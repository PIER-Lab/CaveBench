"""Run the three Gemini training-free methods from CaveBench Table 3."""
import argparse
import base64
import csv
import hashlib
import json
import os
import sys
import tempfile
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1]))
from contracts import unique, validate_question
from actions import answer_schema, candidate_schema, legal_answer, map_indices, parse_action
from program_pixels import BoundedPython, PixelTools
from react_pixels import execute_tool

MODEL = "google/gemini-3.8-flash"
PROGRAM_SCHEMA = {"type": "json_schema", "json_schema": {"name": "local_visual_program", "strict": True,
    "schema": {"type": "object", "properties": {"program": {"type": "string",
        "description": "Complete bounded Python source as ordinary text, not a native function call."}},
        "required": ["program"], "additionalProperties": False}}}
PROTOCOL = json.loads((HERE / "protocol.json").read_text(encoding="utf-8"))


def text(value):
    return {"type": "text", "text": value}


def image(path, detail=False):
    encoded = base64.b64encode(Path(path).read_bytes()).decode("ascii")
    item = {"url": "data:image/png;base64," + encoded}
    if detail:
        item["detail"] = "high"
    return {"type": "image_url", "image_url": item}


def message(role, content):
    return {"role": role, "content": content}


def observations(note, paths, detail=False):
    return message("user", [text(note), *(image(path, detail) for path in paths)])


def program_question(row, expected_hash):
    # These two method runs used the question before the final-answer reminder was appended.
    content = row["prompt"].partition("\nFINAL ANSWER CONTRACT:")[0]
    if hashlib.sha256(content.encode("utf-8")).hexdigest() != expected_hash:
        raise ValueError("Program-method prompt differs from the recorded question " + row["id"])
    return {**row, "prompt": content}


def program_final_prompt(row, shared, method):
    k = row["k"]
    override = PROTOCOL["final_instructions_by_question"].get(method, {}).get(row["id"])
    if override:
        return override
    if not shared:
        return (f"ANSWER DEADLINE. Give exactly {k} legal nonempty event label sets. "
                "Select your current best guess for EVERY event. No more tool calls, null, missing events or commentary. "
                'Return only {"operations":[...]} now.')
    options = json.dumps({str(i): value for i, value in enumerate(row["candidates"])})
    return (f"FINAL ANSWER SUBMISSION. Your analysis/tool output allowance is finished. Submit exactly {k} choices now, "
            "one for each chronological event. Use all original task images and actual observations already present "
            "in this conversation. Choose your current best-supported answer even if uncertain; guessing is required "
            "rather than an empty or missing event. Do not call any tool and do not continue an explanation. "
            "The following numbered options are the unchanged legal action sets from the original task: " + options +
            '. Return only {"candidate_indices":[...]} using zero-based integer indices, exactly one per event.')


class OutputBudget(ValueError):
    pass


def run_program(method, profile, row, work, send):
    shared = profile != "wide"
    indexed_final = shared or row["id"] in PROTOCOL["final_instructions_by_question"].get(method, {})
    v2 = profile == "shared_v2"
    preset = {"model": MODEL, "temperature": 0.2, "tool_choice": "none",
              "provider": {"only": ["google-ai-studio"], "require_parameters": True, "allow_fallbacks": False}}
    instructions = PROTOCOL["program_instructions"][method + ("_v2" if v2 else "_v1")].replace("{k}", str(row["k"]))
    messages = [message("system", [text(instructions)]), observations(row["prompt"], row["images"])]
    used = calls = vqa_calls = 0

    def complete(dialog, schema=None, final=False):
        nonlocal used, calls
        cap = 65536
        if shared:
            cap = 1024 if final else 5120 - used
            if cap < 128:
                raise OutputBudget("Primary output allowance exhausted")
        if final and indexed_final:
            cap = 1024
        options = dict(preset, max_tokens=cap, reasoning={"effort": "low" if indexed_final and final else "medium", "exclude": False})
        if schema:
            options["response_format"] = schema
        result = send(dialog, options)
        calls += 1
        if shared and not final:
            tokens = result.get("usage", {}).get("completion_tokens")
            used += tokens if type(tokens) is int and tokens >= 0 else cap
            if result["choices"][0].get("finish_reason") == "length":
                raise OutputBudget("Primary output allowance exhausted")
        return result["choices"][0]["message"].get("content") or ""

    def query(question, paths):
        nonlocal vqa_calls
        vqa_calls += 1
        if vqa_calls > 2 or calls >= 4:
            raise ValueError("VQA budget exhausted; reserve a final answer call")
        prompt = ("ORIGINAL PUBLIC TASK (no hidden answer or event log):\n" + row["prompt"] +
                  "\n\nVISUAL SUBQUESTION:\n" + question +
                  "\nOnly the images attached to this subquestion are supplied here; do not claim to see other frames.")
        return complete([observations(prompt, paths)])

    tools = PixelTools(row, work, query=query, v2=v2)
    program = BoundedPython(tools)
    for _ in range(4 if method == "sketchpad" else 1):
        if calls >= 5 or (shared and used >= 5120):
            break
        try:
            raw = complete(messages, PROGRAM_SCHEMA)
        except OutputBudget:
            break
        messages.append(message("assistant", [text(raw)]))
        previous = len(tools.receipts)
        budget_exhausted = False
        try:
            data = raw.strip()
            if data.startswith('```'):
                data = data.split("\n", 1)[1].rsplit('```', 1)[0]
            value = json.loads(data)
            if not isinstance(value, dict) or set(value) != {"program"} or not isinstance(value["program"], str):
                raise ValueError("Expected text JSON with exactly one program string")
            answer = legal_answer(program.run(value["program"]), row)
            if answer is not None:
                return answer
            feedback = "No complete legal answer yet. Continue from the actual observations, then submit every event."
        except OutputBudget:
            budget_exhausted = True
            feedback = ("The primary/tool output allowance is exhausted or an actual response reached its output limit. "
                        "Continue only to the final submission from existing observations; preserved request receipts "
                        "distinguish submitted responses from unsubmitted calls.")
        except (ValueError, KeyError, TypeError, IndexError, SyntaxError, ZeroDivisionError, OverflowError, RecursionError) as exc:
            feedback = "Actual execution error: " + type(exc).__name__ + ": " + str(exc)[:800]
        new = tools.receipts[previous:]
        paths = [o["path"] for receipt in new for o in receipt["outputs"]]
        # Use image references in the provider-facing receipts and local paths only for reading pixels.
        receipts = json.dumps(new, ensure_ascii=False)
        for path in paths:
            receipts = receipts.replace(json.dumps(path, ensure_ascii=False), json.dumps(Path(path).name))
        messages.append(observations(feedback + "\n" + receipts, paths))
        if budget_exhausted:
            break
    messages.append(message("user", [text(program_final_prompt(row, shared, method))]))
    raw = complete(messages, candidate_schema(row) if indexed_final else answer_schema(row), final=True)
    return legal_answer(map_indices(raw, row) if indexed_final else raw, row)


def run_react(profile, row, work, send):
    preset = PROTOCOL["react"][profile]
    parts = [text(row["prompt"])]
    for index, path in enumerate(row["images"]):
        parts.extend([text(f"Frame F{index}"), image(path, detail=True)])
    messages = [message("system", preset["system"]), message("user", parts)]
    final_only = False
    for turn in range(3):
        final = final_only or turn == 2
        if final:
            messages.append(message("user", preset["finish"].replace("{k}", str(row["k"]))))
        choice = send(messages, preset["final" if final else "inspect"])["choices"][0]
        reply = choice["message"]
        calls = reply.get("tool_calls") or []
        raw = reply.get("content") or ""
        if not calls and not raw and choice.get("finish_reason") == "length":
            if final:
                return None
            messages.append(message("user", "The previous completed generation reached its output limit without a usable action. "
                                    "Proceed directly to the final answer using the original evidence; no further inspection."))
            final_only = True
            continue
        messages.append({key: value for key, value in reply.items() if key in
                         ("role", "content", "tool_calls", "reasoning_details", "reasoning")})
        if len(calls) > 1:
            for call in calls:
                messages.append({"role": "tool", "tool_call_id": call["id"],
                                 "content": "No action executed: choose exactly one inspection function per turn."})
            if final:
                return None
            continue
        try:
            if calls:
                function = calls[0]["function"]
                name = function["name"]
                args = json.loads(function["arguments"], object_pairs_hook=unique)
                if not isinstance(args, dict):
                    raise ValueError("Native function arguments must be an object")
                if name == "finish" and set(args) - {"operations", "note"}:
                    raise ValueError("Unexpected native finish arguments")
                raw = json.dumps({"action": name, **args} if name == "finish" else {"action": name, "arguments": args})
            action = parse_action(raw, row)
            if action["action"] == "finish":
                return {"operations": action["operations"]}
            if final:
                return None
            outcome = execute_tool(action["action"], action["arguments"], row["images"], work / str(turn))
        except (KeyError, ValueError, TypeError) as exc:
            if final:
                return None
            outcome = {"text": "ACTION FORMAT ERROR: " + str(exc), "images": []}
        if calls:
            messages.append({"role": "tool", "tool_call_id": calls[0]["id"], "content": outcome["text"]})
            if outcome["images"]:
                messages.append(observations("REAL TOOL OBSERVATION\nImages produced by the preceding tool.", outcome["images"], True))
        else:
            messages.append(observations("REAL TOOL OBSERVATION\n" + outcome["text"], outcome["images"], True))
        if final:
            break
    return None


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--data", type=Path, required=True)
    cli.add_argument("--method", required=True, choices=["react", "sketchpad", "viper"])
    cli.add_argument("--output", type=Path, required=True, help="New prediction JSONL file")
    cli.add_argument("--limit", type=int, default=None)
    cli.add_argument("--endpoint", required=True, help="Gemini-compatible HTTPS chat/completions endpoint")
    args = cli.parse_args()
    if not args.endpoint.startswith("https://") or (args.limit is not None and args.limit < 1):
        cli.error("Specify an HTTPS endpoint and a positive question limit.")
    key = os.environ.get("CAVEBENCH_API_KEY")
    if not key:
        cli.error("Set CAVEBENCH_API_KEY for the selected endpoint.")
    root = args.data.resolve(strict=True)
    with (HERE / "question_protocols.csv").open(encoding="utf-8") as src:
        profiles = {r["id"]: r for r in csv.DictReader(src)}

    def send(messages, options):
        payload = json.dumps({**options, "messages": messages}, ensure_ascii=False).encode("utf-8")
        req = urllib.request.Request(args.endpoint, data=payload, headers={"Content-Type": "application/json",
                                                                          "Authorization": "Bearer " + key})
        with urllib.request.urlopen(req, timeout=900) as response:
            result = json.load(response)
        model = result.get("model")
        if model and model not in (MODEL, MODEL + "-20260902"):
            raise ValueError("Unexpected response model: " + model)
        return result

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with (root / "questions.jsonl").open(encoding="utf-8") as src, args.output.open("x", encoding="utf-8") as dst:
        for index, line in enumerate(src):
            if args.limit is not None and index >= args.limit:
                break
            row = json.loads(line)
            validate_question(row, files=False)
            paths = [(root / entry).resolve(strict=True) for entry in row["images"]]
            if any(not path.is_relative_to(root) for path in paths):
                raise ValueError("Image outside the dataset")
            row["images"] = [str(path) for path in paths]
            with tempfile.TemporaryDirectory(dir=args.output.parent) as folder:
                entry = profiles[row["id"]]
                profile = entry[args.method]
                if args.method == "react":
                    answer = run_react(profile, row, Path(folder), send)
                else:
                    row = program_question(row, entry["program_prompt_sha256"])
                    answer = run_program(args.method, profile, row, Path(folder), send)
            result = {"id": row["id"], "response": json.dumps(answer) if answer else ""}
            dst.write(json.dumps(result, ensure_ascii=False) + "\n")
            dst.flush()


if __name__ == "__main__":
    main()

