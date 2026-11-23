"""Render a verbal CaveBench task or export a prefix with its ordered images and recorded metadata."""
import argparse
from functools import lru_cache
import json
import os
from pathlib import Path
import re
import tempfile

from contracts import validate_question

ROOT = Path(__file__).resolve().parent
STYLE_HELP = "original replays the archived evaluation prompt; narrative (also accepted as compact) uses the published verbal task"
# Raw simulation scene numbers map to paper apparatus IDs.
PAPER_SCENES = ("S01","S09","S05","S17","S13","S02","S10","S06","S18","S14",
                "S03","S04","S11","S12","S07","S08","S19","S20","S15","S16")


@lru_cache(maxsize=1)
def definitions():
    return json.loads((ROOT / "prompts/apparatus.json").read_bytes())


def event_key(events):
    return {frozenset(event) for event in events}


def narrative_paragraphs(parts):
    paragraphs = definitions()["scenes"][parts["scene"]]["prose"]
    if len(paragraphs) != 3 or any(not p.strip() or re.search(r"[0-9°={}]", p) for p in paragraphs):
        raise ValueError(f"{parts['scene']} must contain three qualitative paragraphs")
    return list(paragraphs)


def episode_template(scene, k):
    spec = definitions()["scenes"][scene]
    if type(k) is not int or not 1 <= k <= 6 or (scene == "S11" and k < 3):
        raise ValueError(f"{scene} expects {'3–6' if scene == 'S11' else '1–6'} events")
    parts = {"scene": scene, "k": k,
             "allowed_event_sets": spec["allowed_event_sets"], "display_labels": spec.get("display_labels", {})}
    parts["paragraphs"] = narrative_paragraphs(parts)
    return parts


def template_parts(question):
    validate_question(question, files=False)
    expected = PAPER_SCENES[question["scene"] - 1]
    sid = question.get("paper_scene", expected)
    if sid != expected:
        raise ValueError(f"{question['id']}: paper scene {sid} does not match source scene {question['scene']}")
    spec = definitions()["scenes"][sid]
    labels = question["allowed_labels"]
    candidates = question.get("candidates", spec["allowed_event_sets"])
    if set(labels) != set(spec["allowed_labels"]) or event_key(candidates) != event_key(spec["allowed_event_sets"]):
        raise ValueError(f"{question['id']}: control vocabulary differs from the published {sid} template")
    return episode_template(sid, question["k"])


def render(parts):
    return "\n\n".join(parts["paragraphs"])


def evaluation_question(question, style):
    if style == "original":
        if "original_prompt" not in question:
            return question
        restored = question.copy()
        restored["prompt"] = restored.pop("original_prompt")
        restored.pop("prompt_style", None)
        return restored
    if style not in ("compact", "narrative"):
        raise ValueError(f"Unknown prompt style: {style}")
    original = question.get("original_prompt", question["prompt"])
    return {**question, "prompt": render(template_parts(question)), "original_prompt": original, "prompt_style": style}


def add_style_option(parser):
    parser.add_argument("--prompt-style", choices=("original","narrative","compact"), default="original", help=STYLE_HELP)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--questions", type=Path, help="Source questions.jsonl")
    source.add_argument("--scene", choices=definitions()["scenes"], help="Print a question for a new episode")
    parser.add_argument("--events", type=int, help="Number of events in a new episode")
    parser.add_argument("--output", type=Path, help="New JSONL for the selected question style")
    parser.add_argument("--prompt-style", choices=("narrative", "original", "compact"), default="narrative", help=STYLE_HELP)
    args = parser.parse_args()
    if args.scene:
        if args.output or args.prompt_style == "original":
            parser.error("--scene prints a narrative prompt to stdout")
        try:
            print(render(episode_template(args.scene, args.events)))
        except ValueError as exc:
            parser.error(str(exc))
        return
    if not args.output or args.events is not None:
        parser.error("--questions requires --output; --events applies to --scene")
    if args.output.exists():
        parser.error(f"Output already exists: {args.output}")
    args.output.parent.mkdir(parents=True,exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=args.output.parent,delete=False) as tmp:
        name=Path(tmp.name)
    try:
        with args.questions.open(encoding="utf-8-sig") as src, name.open("w",encoding="utf8",newline="\n") as dest:
            for line in src:
                if not line.strip():continue
                q=json.loads(line)
                validate_question(q, files=False)
                row=evaluation_question(q,args.prompt_style)
                dest.write(json.dumps(row,ensure_ascii=False)+"\n")
        # Exclusive publication prevents simultaneous exports from overwriting each other.
        os.link(name,args.output)
    finally:
        name.unlink(missing_ok=True)

if __name__=="__main__":
    main()

