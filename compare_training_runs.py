"""Pair each preference-training run with SFT on the same CaveBench questions."""
import argparse
import csv
import io
from collections import Counter, defaultdict

from verify_results import TABLES, scored_rows


def comparison():
    runs = defaultdict(dict)
    for row, _ in scored_rows("adaptation_question_scores.csv", ["model", "method", "run"]):
        if row["model"] == "Qwen3.5-9B" and row["method"] != "Baseline":
            runs[row["method"], row["run"]][row["question_id"]] = (int(row["k"]), int(row["exact"]))
    reference_key, = [key for key in runs if key[0] == "SFT"]
    reference = runs.pop(reference_key)
    buf = io.StringIO(newline="")
    writer = csv.writer(buf, lineterminator="\n")
    writer.writerow(["method", "seed", "k", "both_correct", "adapted_only", "sft_only", "both_incorrect", "questions"])
    for (method, seed), predictions in sorted(runs.items()):
        if predictions.keys() != reference.keys():
            raise ValueError(f"Question IDs differ for {method} {seed}")
        counts = defaultdict(Counter)
        for qid, (k, correct) in predictions.items():
            original_k, sft_correct = reference[qid]
            if k != original_k:
                raise ValueError(f"Question length differs at {qid}")
            counts[k][sft_correct, correct] += 1
        for k, bucket in sorted(counts.items()):
            writer.writerow([method, seed, k, bucket[1, 1], bucket[0, 1], bucket[1, 0], bucket[0, 0], sum(bucket.values())])
    return buf.getvalue()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Compare the shipped CSV with the paired scores")
    args = parser.parse_args()
    output = TABLES / "paired_training.csv"
    content = comparison()
    if args.check:
        if output.read_text(encoding="utf-8") != content:
            raise SystemExit("Paired results differ from the question-level scores.")
    else:
        output.write_bytes(content.encode("utf-8"))
