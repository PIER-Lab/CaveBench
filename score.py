"""Compute exact-match accuracy overall and by question length from a prediction JSONL file."""
import argparse
import json
from collections import defaultdict
from pathlib import Path

from contracts import score


def read_rows(path):
    indexed = {}
    with path.open(encoding="utf-8") as stream:
        for line in stream:
            row = json.loads(line)
            if row["id"] in indexed:
                raise ValueError(f"Duplicate question ID in {path}: {row['id']}")
            indexed[row["id"]] = row
    return indexed


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, required=True)
    parser.add_argument("--predictions", type=Path, required=True)
    args = parser.parse_args()
    questions = read_rows(args.data / "questions.jsonl")
    labels = read_rows(args.data / "labels.jsonl")
    predictions = read_rows(args.predictions)
    if questions.keys() != labels.keys() or predictions.keys() - questions.keys():
        raise ValueError("Question IDs do not match the dataset.")
    groups = defaultdict(list)
    for key, question in questions.items():
        prediction = predictions.get(key, {})
        answer = prediction.get("response", "")
        if prediction.get("prompt_style") in ("compact","narrative"):
            question = {**question, "prompt_style": prediction["prompt_style"]}
        result = score(answer, question, labels[key]["operations"])
        for group in ("overall", f"k{question['k']}"):
            groups[group].append(result["all_steps_correct"])
    print(json.dumps({"answered":len(predictions), "questions":len(questions),
                      "exact_match_percent":{g:round(100 * sum(v)/len(v), 3) for g,v in groups.items()}}, indent=2))


if __name__ == "__main__":
    main()

