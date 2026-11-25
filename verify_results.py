"""Recompute published leaderboard, adaptation, and reasoning-effort tables."""
import argparse
import csv
import json
import math
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SCORES = ROOT / "results"
TABLES = ROOT / "docs/assets/results"


def rows(path):
    with path.open(encoding="utf-8-sig", newline="") as source:
        yield from csv.DictReader(source)


def scored_rows(name, identity):
    seen = set()
    for row in rows(SCORES / name):
        key = tuple(row[field] for field in identity) + (row["question_id"],)
        events = [int(flag) for flag in row["correct_events"].split()]
        if key in seen or len(events) != int(row["k"]) or set(events) - {0, 1}:
            raise ValueError(f"{name}: invalid event sequence or repeated question {key}")
        if int(row["exact"]) != int(all(events)):
            raise ValueError(f"{name}: exact match disagrees with event scores on {key}")
        seen.add(key)
        yield row, events


def add(totals, key, exact, events):
    counts = totals[key]
    counts[0] += exact
    counts[1] += 1
    counts[2] += sum(events)
    counts[3] += len(events)


def counts():
    return defaultdict(lambda: [0, 0, 0, 0])


def verify_table(name, totals, key_fields):
    visited = set()
    for row in rows(TABLES / name):
        key = tuple(row[f] for f in key_fields)
        if key in visited:
            raise ValueError(f"{name}: duplicate {key}")
        visited.add(key)
        if "runs" in row:
            runs = 2 if row["run"] == "Mean" else 1
            if int(row["runs"]) != runs or runs * int(row["questions_per_run"]) != int(row["total"]):
                raise ValueError(f"{name}: inconsistent run or question count at {key}")
        expected = totals.get(key)
        if expected is None:
            if not (row.get("scene") == "S11" and row.get("k") in {"1", "2"}):
                raise ValueError(f"{name}: no source scores for {key}")
            expected = [0, 0, 0, 0]
        metrics = []
        if "total" in row:
            metrics.append(("correct", "total", "accuracy_pct", *expected[:2]))
        if "total_events" in row:
            metrics.append(("correct_events", "total_events", "event_accuracy_pct", *expected[2:]))
        if not metrics:
            raise ValueError(f"{name}: missing accuracy fields")
        for correct_field, total_field, percent_field, correct, total in metrics:
            actual = row[percent_field]
            if (int(row[correct_field]), int(row[total_field])) != (correct, total):
                raise ValueError(f"{name}: wrong counts for {key} ({correct_field})")
            if total:
                if not math.isclose(float(actual), 100 * correct / total, abs_tol=1e-6):
                    raise ValueError(f"{name}: wrong percentage for {key} ({percent_field})")
            elif actual:
                raise ValueError(f"{name}: percentage has a zero denominator at {key}")
    missing = totals.keys() - visited
    if missing:
        raise ValueError(f"{name}: {len(missing)} groups missing")
    return len(visited)


LENGTHS = ("1", "2", "3", "4", "5", "6", "Overall")
QUESTION_COUNTS = (190, 190, 200, 200, 200, 200, 1180)
DOMAIN_COLUMNS = dict(Dynamics="Dynamics", Thermal="Thermal", EM="Electromagnetism",
                      Acoustics="Acoustics", Optics="Optics", Overall="Overall")


def percentage(record, decimals=1, event=False):
    start = 2 if event else 0
    correct, total = record[start:start + 2]
    return format(100 * correct / total, f".{decimals}f")


def check_release(questions, data):
    from contracts import read_jsonl, score, validate_question
    from prompt_templates import template_parts

    official = {q["id"]: q for q in read_jsonl(data / "questions.jsonl")}
    labels = {r["id"]: r["operations"] for r in read_jsonl(data / "labels.jsonl")}
    if set(labels) != set(questions) or set(official) != set(questions):
        raise ValueError("Dataset and published scored question IDs differ")
    for q in official.values():
        validate_question(q, files=False)
        template_parts(q)
        if questions[q["id"]] != (q["paper_scene"], str(q["k"])):
            raise ValueError(f"Scene or question length differs for {q['id']}")
        answer = json.dumps({"operations": labels[q["id"]]})
        if not score(answer, q, labels[q["id"]])["all_steps_correct"]:
            raise ValueError(f"Reference answer does not pass the scorer: {q['id']}")
    checked = 0
    for filename in ("question_scores.csv", "adaptation_question_scores.csv", "effort_question_scores.csv"):
        for row in rows(SCORES / filename):
            qid = row["question_id"]
            operations = json.loads(row["operations"])
            answer = json.dumps({"operations": operations}) if operations is not None else ""
            rescored = score(answer, official[qid], labels[qid])
            event_flags = [bool(int(x)) for x in row["correct_events"].split()]
            if (rescored["step_correct"] != event_flags
                    or rescored["all_steps_correct"] != bool(int(row["exact"]))):
                raise ValueError(f"{filename}: prediction and recorded score differ for {qid}")
            checked += 1
    print(f"Rescored {checked:,} released predictions against the dataset labels.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, help="Rescore every released prediction using the dataset labels.")
    args = parser.parse_args()
    scenes = {r["scene"]: r["domain"] for r in rows(TABLES / "scene_controls.csv")}
    names = {r["model_key"]: r["display_name"] for r in rows(SCORES / "models.csv")}
    by_scene, by_domain, by_length = counts(), counts(), counts()
    questions = {}
    seen_questions = defaultdict(set)
    for r, events in scored_rows("question_scores.csv", ["model"]):
        model, scene, k = r["model"], r["scene"], r["k"]
        if questions.setdefault(r["question_id"], (scene, k)) != (scene, k):
            raise ValueError(f"Question metadata differs at {r['question_id']}")
        seen_questions[model].add(r["question_id"])
        exact = int(r["exact"])
        add(by_scene, (model, scene, k), exact, events)
        for length in (k, "Overall"):
            add(by_length, (names[model], length), exact, events)
        if k == "6":
            for domain in (scenes[scene], "Overall"):
                add(by_domain, (names[model], domain), exact, events)
    if (len(names) != 27 or set(seen_questions) != set(names) or len(questions) != 1180
            or any(ids != questions.keys() for ids in seen_questions.values())):
        raise ValueError("Expected 27 configurations evaluated on the same 1,180 questions")
    for name in names.values():
        if tuple(by_length[name, k][1] for k in LENGTHS) != QUESTION_COUNTS:
            raise ValueError(f"Incorrect number of questions by length for {name}")
    if args.data:
        check_release(questions, args.data)

    assets = TABLES.parent
    for r in rows(assets / "domains.csv"):
        for col, domain in DOMAIN_COLUMNS.items():
            if r[col] != percentage(by_domain[r["Model"], domain]):
                raise ValueError(f"Table 1: {r['Model']}, {domain}")
    for r in rows(assets / "length.csv"):
        for k in LENGTHS:
            col = k if k == "Overall" else f"k = {k}"
            if r[col] != percentage(by_length[r["Model"], k]):
                raise ValueError(f"Table 2: {r['Model']}, {k}")
    if verify_table("scene_by_length.csv", by_scene, ["model_key", "scene", "k"]) != 3240:
        raise ValueError("Missing model/apparatus/length rows")

    by_method = counts()
    method_questions = defaultdict(set)
    for r, events in scored_rows("adaptation_question_scores.csv", ["model", "method", "run"]):
        if questions.get(r["question_id"]) != (r["scene"], r["k"]):
            raise ValueError(f"Unknown adaptation question: {r['question_id']}")
        method_questions[r["model"], r["method"], r["run"]].add(r["question_id"])
        run_names = [r["run"]]
        if r["method"] in {"SFT + SimPO", "SFT + KTO"}:
            run_names.append("Mean")
        for run in run_names:
            for k in (r["k"], "Overall"):
                add(by_method, (r["model"], r["method"], run, k), int(r["exact"]), events)
    if len(method_questions) != 11 or any(ids != questions.keys() for ids in method_questions.values()):
        raise ValueError("Incomplete question coverage in adaptation runs")
    if verify_table("adaptation_by_length.csv", by_method, ["model", "method", "run", "k"]) != 91:
        raise ValueError("Missing adaptation rows")
    for r in rows(assets / "methods.csv"):
        model = r["Group"].split("(")[1].rstrip(")")
        method = r["Method"]
        runs = [run for m, method_name, run in method_questions if m == model and method_name == method]
        run = "Mean" if len(runs) == 2 else runs[0]
        for k in LENGTHS:
            col = k if k == "Overall" else f"k = {k}"
            if r[col] != percentage(by_method[model, method, run, k]):
                raise ValueError(f"Table 3: {model}, {method}, {k}")

    effort = counts()
    for r, events in scored_rows("effort_question_scores.csv", ["model", "effort", "stage"]):
        if questions.get(r["question_id"]) != (r["scene"], "6"):
            raise ValueError(f"Unknown six-event question: {r['question_id']}")
        for scene in (r["scene"], "Overall"):
            add(effort, (r["model"], r["effort"], r["stage"], scene), int(r["exact"]), events)
    if verify_table("effort_results.csv", effort, ["model", "effort", "stage", "scene"]) != 252:
        raise ValueError("Missing reasoning-effort rows")
    for r in rows(TABLES / "reasoning_effort_summary.csv"):
        key = (r["model"], r["effort"])
        initial = effort[key + ("Primary", "Overall")]
        final = effort[key + ("Final", "Overall")]
        if (percentage(initial), percentage(final), percentage(final, 2, event=True)) != (
                r["initial_exact_pct"], r["final_exact_pct"], r["final_event_accuracy_pct"]):
            raise ValueError(f"Table 13 disagrees with the recorded answers for {key}")
    print("Verified 27 configurations on 1,180 questions, six apparatus tables, "
          "the adaptation runs and the reasoning-effort scores.")


if __name__ == "__main__":
    main()


