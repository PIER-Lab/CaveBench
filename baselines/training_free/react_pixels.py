"""Read-only pixel observations for the ReAct adaptation.

The caller supplies the *only* permitted frames, in F0..Fk order. Actions cannot
open paths, run Python, query an environment, or read labels. Measurements are
image-space estimates, never semantic/world-state ground truth.
"""
from __future__ import annotations

import hashlib
import math
from pathlib import Path
import uuid

import numpy as np
from PIL import Image, ImageChops, ImageDraw

try:
    import cv2
except ImportError:
    cv2 = None


TOOL_SCHEMAS = [
    {
        "name": "crop_compare",
        "description": "Show the same normalized rectangle from selected supplied frames, enlarged where possible. Pixel-only observation; no inferred labels.",
        "parameters": {"type": "object", "properties": {
            "frame_indices": {"type": "array", "items": {"type": "integer", "minimum": 0}, "minItems": 1, "maxItems": 7},
            "bbox": {"type": "array", "items": {"type": "number"}, "minItems": 4, "maxItems": 4, "description": "[left, top, right, bottom], normalized 0..1; origin at image top left"},
        }, "required": ["frame_indices", "bbox"], "additionalProperties": False},
    },
    {
        "name": "frame_difference",
        "description": "Compare two supplied frames and their absolute RGB difference; responds to motion, lighting and appearance changes alike.",
        "parameters": {"type": "object", "properties": {
            "a": {"type": "integer", "minimum": 0}, "b": {"type": "integer", "minimum": 0},
            "bbox": {"type": "array", "items": {"type": "number"}, "minItems": 4, "maxItems": 4},
        }, "required": ["a", "b"], "additionalProperties": False},
    },
    {
        "name": "measure_translation",
        "description": "Match a textured rectangle in frame a to a nearby rectangle in b. Returns estimated pixel translation and correlation, not object identity, physical velocity or ground truth. May be ambiguous under occlusion, rotation, lighting or repeated textures.",
        "parameters": {"type": "object", "properties": {
            "a": {"type": "integer", "minimum": 0}, "b": {"type": "integer", "minimum": 0},
            "bbox": {"type": "array", "items": {"type": "number"}, "minItems": 4, "maxItems": 4},
            "search_margin": {"type": "number", "minimum": 0, "maximum": 0.5, "default": 0.15, "description": "Search expansion on each side as fraction of full image dimensions"},
        }, "required": ["a", "b", "bbox"], "additionalProperties": False},
    },
]
_SCHEMAS = {s["name"]: s["parameters"] for s in TOOL_SCHEMAS}


class ToolInputError(ValueError):
    pass


def _integer(value, name):
    if isinstance(value, bool) or not isinstance(value, (int, np.integer)):
        raise ToolInputError(f"{name} must be an integer")
    return int(value)


def _number(value, name):
    if isinstance(value, bool) or not isinstance(value, (int, float, np.number)):
        raise ToolInputError(f"{name} must be a finite number")
    value = float(value)
    if not math.isfinite(value):
        raise ToolInputError(f"{name} must be a finite number")
    return value


def _bbox(value):
    if not isinstance(value, (list, tuple)) or len(value) != 4:
        raise ToolInputError("bbox must be [left, top, right, bottom]")
    x0, y0, x1, y1 = [_number(v, "bbox coordinate") for v in value]
    if not (0 <= x0 < x1 <= 1 and 0 <= y0 < y1 <= 1):
        raise ToolInputError("bbox must be ordered and contained in normalized image coordinates 0..1")
    return x0, y0, x1, y1


def _pixel_box(bbox, size):
    w, h = size
    x0, y0, x1, y1 = bbox
    box = (math.floor(x0 * w), math.floor(y0 * h), math.ceil(x1 * w), math.ceil(y1 * h))
    if box[2] - box[0] < 2 or box[3] - box[1] < 2:
        raise ToolInputError("bbox must cover at least 2x2 source pixels")
    return box


def _frame(index, frame_paths):
    index = _integer(index, "frame index")
    if not 0 <= index < len(frame_paths):
        raise ToolInputError(f"frame index out of range; only F0..F{len(frame_paths)-1} are available")
    path = Path(frame_paths[index])
    if not path.is_file():
        raise ToolInputError(f"supplied F{index} image is missing")
    with Image.open(path) as image:
        if image.format not in ("PNG", "JPEG", "WEBP", "BMP"):
            raise ToolInputError(f"supplied F{index} is not a supported image")
        if image.width * image.height > 25_000_000:
            raise ToolInputError("frame is too large for this read-only tool")
        return image.convert("RGB")


def _pair(arguments, frame_paths):
    a = _integer(arguments["a"], "a")
    b = _integer(arguments["b"], "b")
    if a == b:
        raise ToolInputError("a and b must be different supplied frames")
    ia, ib = _frame(a, frame_paths), _frame(b, frame_paths)
    if ia.size != ib.size:
        raise ToolInputError("comparison frames must have equal dimensions")
    return a, b, ia, ib


def _contact_sheet(images, labels):
    columns = min(3, len(images))
    rows = math.ceil(len(images) / columns)
    cell_w = 1024 // columns
    cell_h = min(510, 1024 // rows)
    content_h = cell_h - 26
    canvas = Image.new("RGB", (cell_w * columns, cell_h * rows), "#181818")
    draw = ImageDraw.Draw(canvas)
    for index, (image, label) in enumerate(zip(images, labels)):
        scale = min(cell_w / image.width, content_h / image.height)
        resized = image.resize((max(1, int(image.width * scale)), max(1, int(image.height * scale))), Image.Resampling.LANCZOS)
        x = (index % columns) * cell_w
        y = (index // columns) * cell_h
        draw.text((x + 6, y + 6), label, fill="white")
        canvas.paste(resized, (x + (cell_w - resized.width)//2, y + 24 + (content_h - resized.height)//2))
    return canvas


def _save(image, output_dir, tool_name):
    directory = Path(output_dir).resolve()
    directory.mkdir(parents=True, exist_ok=True)
    path = directory / (tool_name + "_" + uuid.uuid4().hex + ".png")
    if path.resolve().parent != directory:
        raise ToolInputError("output path escaped observation directory")
    image.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
    image.save(path, format="PNG")
    return str(path), hashlib.sha256(path.read_bytes()).hexdigest()


def _ncc(search, template):
    """CCOEFF_NORMED with an equivalent CPU/SciPy fallback."""
    if cv2 is not None:
        return cv2.matchTemplate(search.astype(np.float32), template.astype(np.float32), cv2.TM_CCOEFF_NORMED), "opencv.TM_CCOEFF_NORMED"
    from scipy.signal import correlate, convolve
    search = search.astype(np.float64)
    template = template.astype(np.float64)
    centered = template - template.mean()
    numerator = correlate(search, centered, mode="valid", method="fft")
    kernel = np.ones(template.shape, dtype=np.float64)
    sums = convolve(search, kernel, mode="valid", method="fft")
    squares = convolve(search * search, kernel, mode="valid", method="fft")
    local_variance = np.maximum(0.0, squares - sums * sums / template.size)
    denom = np.sqrt(local_variance * np.sum(centered * centered))
    result = np.full(numerator.shape, -1.0, dtype=np.float64)
    np.divide(numerator, denom, out=result, where=denom > 1e-9)
    return np.clip(result, -1.0, 1.0), "scipy.normalized_cross_correlation"


def execute_tool(name, arguments, frame_paths, output_dir):
    """Return {ok, text, images, ...}; all failures are genuine error observations.

    Only runner-supplied frame_paths and output_dir are trusted inputs; model
    arguments cannot supply either. Returned paths are generated derived PNGs.
    """
    try:
        if not isinstance(name, str) or name not in _SCHEMAS:
            raise ToolInputError("unknown tool; choose crop_compare, frame_difference or measure_translation")
        if not isinstance(arguments, dict):
            raise ToolInputError("arguments must be a JSON object")
        schema = _SCHEMAS[name]
        extra = set(arguments) - set(schema["properties"])
        missing = set(schema["required"]) - set(arguments)
        if extra or missing:
            raise ToolInputError(f"invalid argument keys; missing={sorted(missing)}, unexpected={sorted(extra)}")
        if not isinstance(frame_paths, (list, tuple)) or not 1 <= len(frame_paths) <= 7:
            raise ToolInputError("runner must supply between 1 and 7 permitted frame paths")
        metadata = {"coordinate_system": "image pixels: +x right, +y down", "no_semantic_or_world_truth": True}
        if name == "crop_compare":
            indices = arguments["frame_indices"]
            if not isinstance(indices, list) or not 1 <= len(indices) <= 7:
                raise ToolInputError("frame_indices must contain 1..7 frame indices")
            indices = [_integer(i, "frame index") for i in indices]
            if len(set(indices)) != len(indices):
                raise ToolInputError("frame_indices must not contain duplicates")
            bbox = _bbox(arguments["bbox"])
            images = []
            boxes = []
            for index in indices:
                source = _frame(index, frame_paths)
                box = _pixel_box(bbox, source.size)
                images.append(source.crop(box))
                boxes.append(list(box))
            sheet = _contact_sheet(images, [f"F{i} crop" for i in indices])
            text = "Same normalized region from " + ", ".join(f"F{i}" for i in indices) + "; resized only for viewing. No object or action inference."
            metadata.update(source_frames=indices, bbox_normalized=list(bbox), source_boxes_px=boxes)
        elif name == "frame_difference":
            a, b, ia, ib = _pair(arguments, frame_paths)
            bbox = _bbox(arguments.get("bbox", [0, 0, 1, 1]))
            box = _pixel_box(bbox, ia.size)
            ca, cb = ia.crop(box), ib.crop(box)
            diff = ImageChops.difference(ca, cb)
            values = np.asarray(diff, dtype=np.float64)
            mae = float(values.mean())
            sheet = _contact_sheet([ca, cb, diff], [f"F{a}", f"F{b}", "Absolute RGB difference (no gain)"])
            text = f"F{a} versus F{b}: mean absolute RGB difference {mae:.3f}/255. Difference is unamplified; motion, lighting and appearance can all contribute."
            metadata.update(source_frames=[a,b], bbox_normalized=list(bbox), source_box_px=list(box), mean_abs_rgb=mae, max_abs_rgb=int(values.max()))
        else:
            a, b, ia, ib = _pair(arguments, frame_paths)
            bbox = _bbox(arguments["bbox"])
            box = _pixel_box(bbox, ia.size)
            x0, y0, x1, y1 = box
            if x1-x0 < 4 or y1-y0 < 4:
                raise ToolInputError("translation template must cover at least 4x4 pixels")
            margin = _number(arguments.get("search_margin", 0.15), "search_margin")
            if not 0 <= margin <= 0.5:
                raise ToolInputError("search_margin must be between 0 and 0.5")
            w, h = ia.size
            sx0, sy0 = max(0, x0-math.ceil(w*margin)), max(0, y0-math.ceil(h*margin))
            sx1, sy1 = min(w, x1+math.ceil(w*margin)), min(h, y1+math.ceil(h*margin))
            template = np.asarray(ia.convert("L"), dtype=np.float64)[y0:y1,x0:x1]
            if float(template.std()) < 2.0:
                raise ToolInputError("template has insufficient texture for a reliable correlation measurement; select a textured object region")
            search = np.asarray(ib.convert("L"), dtype=np.float64)[sy0:sy1,sx0:sx1]
            scores, engine = _ncc(search, template)
            py, px = np.unravel_index(np.argmax(scores), scores.shape)
            score = float(scores[py,px])
            bx, by = int(sx0+px), int(sy0+py)
            dx, dy = bx-x0, by-y0
            excluded = scores.copy()
            excluded[max(0,py-3):py+4,max(0,px-3):px+4] = -np.inf
            second = float(excluded.max()) if np.isfinite(excluded).any() else None
            warnings = []
            if score < 0.65:
                warnings.append("low correlation: translation may be unreliable")
            if second is not None and score-second < 0.02:
                warnings.append("multiple similarly scoring matches: ambiguous location")
            if (px in (0,scores.shape[1]-1) and scores.shape[1]>1) or (py in (0,scores.shape[0]-1) and scores.shape[0]>1):
                warnings.append("best match touches the search boundary")
            va, vb = ia.copy(), ib.copy()
            ImageDraw.Draw(va).rectangle((x0,y0,x1-1,y1-1), outline="yellow", width=2)
            ImageDraw.Draw(vb).rectangle((sx0,sy0,sx1-1,sy1-1), outline="cyan", width=1)
            ImageDraw.Draw(vb).rectangle((bx,by,bx+x1-x0-1,by+y1-y0-1), outline="yellow", width=2)
            sheet = _contact_sheet([va,vb], [f"F{a}: selected template", f"F{b}: estimated match / cyan search"])
            text = f"Template match F{a}->F{b}: dx={dx:+d}, dy={dy:+d} source pixels; correlation={score:.4f}. This is an image-space estimate, not object identity, world displacement or velocity."
            if warnings:
                text += " Warning: " + "; ".join(warnings) + "."
            metadata.update(source_frames=[a,b], bbox_normalized=list(bbox), template_box_px=list(box), search_box_px=[sx0,sy0,sx1,sy1], matched_box_px=[bx,by,bx+x1-x0,by+y1-y0], dx_px=dx, dy_px=dy, correlation=score, runner_up_correlation=second, warnings=warnings, engine=engine)
        path, digest = _save(sheet, output_dir, name)
        return {"ok": True, "tool": name, "text": text, "images": [path], "image_sha256": [digest], **metadata}
    except Exception as exc:
        # Do not include exception paths or source contents in the model observation.
        message = str(exc) if isinstance(exc, ToolInputError) else f"{type(exc).__name__}: image tool failed; no measurement was produced"
        return {"ok": False, "tool": name if isinstance(name,str) else None, "error_type": type(exc).__name__, "text": "Tool error: " + message, "images": [], "no_semantic_or_world_truth": True}
