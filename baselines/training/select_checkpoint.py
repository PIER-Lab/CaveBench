"""Select a preference checkpoint on the 100 fixed six-event validation questions."""

import argparse
import gc
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from contracts import read_jsonl, score
from run_local import complete_question, load_generator


def evaluate(questions, episodes, root, generate):
    correct_sequences = 0
    correct_events = 0
    for q in questions:
        ref = episodes[q["id"].rsplit("/", 1)[0]]["operations"]
        answer = complete_question(q, root, generate)
        scored = score(answer["response"], q, ref)
        correct_sequences += int(scored["all_steps_correct"])
        correct_events += sum(scored["step_correct"])
    return correct_sequences, correct_events


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", required=True, type=Path)
    parser.add_argument("--inputs", required=True, type=Path)
    parser.add_argument("--model", required=True, type=Path, help="Merged SFT model")
    parser.add_argument("--run", required=True, type=Path, help="Output of a two-epoch preference run")
    args = parser.parse_args()
    questions = read_jsonl(args.inputs / "dev100.jsonl")
    val = {e["id"]: e for e in read_jsonl(args.data / "episodes" / "validation.jsonl")}
    if len(questions) != 100 or len(val) != 1000:
        parser.error("Expected 100 selection questions from 1,000 validation episodes")
    checkpoints = sorted((p for p in args.run.glob("checkpoint-*") if p.is_dir() and p.name[11:].isdigit()),
                         key=lambda p: int(p.name[11:]))
    if len(checkpoints) != 2:
        parser.error("Expected one saved checkpoint for each of two epochs")
    results = []
    for i, checkpoint in enumerate(checkpoints):
        generate = load_generator(str(args.model.resolve()), checkpoint, None)
        sequences, events = evaluate(questions, val, args.data, generate)
        results.append((sequences, events, -i, checkpoint))
        print(json.dumps({"epoch": i + 1, "checkpoint": str(checkpoint),
                          "exact_sequences": sequences, "correct_events": events}), flush=True)
        del generate
        gc.collect()
    print(json.dumps({"selected": str(max(results)[3])}))


if __name__ == "__main__":
    main()
