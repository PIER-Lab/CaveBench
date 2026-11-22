"""Recompute published leaderboard, adaptation, and reasoning-effort tables."""
import csv
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
        metrics = [("correct", "total", "accuracy_pct", *expected[:2])]
        if "total_events" in row:
            metrics.append(("correct_events", "total_events", "event_accuracy_pct", *expected[2:]))
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


def main():
    domains = {r["scene"]: r["domain"] for r in rows(TABLES / "scene_controls.csv")}
    by_domain, by_scene, by_position = counts(), counts(), counts()
    for row, events in scored_rows("question_scores.csv", ["model"]):
        model, scene, k = row["model"], row["scene"], row["k"]
        exact = int(row["exact"])
        add(by_scene, (model, scene, k), exact, events)
        for domain in (domains[scene], "Overall"):
            add(by_domain, (model, domain, k), exact, events)
        if k == "6":
            for pos, hit in enumerate(events, 1):
                add(by_position, (model, str(pos)), hit, [hit])

    by_method, by_method_scene = counts(), counts()
    for row, events in scored_rows("adaptation_question_scores.csv", ["model", "method", "run"]):
        model, method = row["model"], row["method"]
        runs = [row["run"]]
        if method in {"SFT + SimPO", "SFT + KTO"}:
            runs.append("Mean")
        for run in runs:
            for length in (row["k"], "Overall"):
                key = (model, method, run)
                add(by_method, (*key, length), int(row["exact"]), events)
                add(by_method_scene, (*key, row["scene"], length), int(row["exact"]), events)

    effort = counts()
    for row, events in scored_rows("effort_question_scores.csv", ["model", "effort", "stage"]):
        for scene in (row["scene"], "Overall"):
            add(effort, (row["model"], row["effort"], row["stage"], scene), int(row["exact"]), events)

    tables = [
        ("domain_by_length.csv", by_domain, ["model_key", "domain", "k"], 27 * 6 * 6),
        ("scene_by_length.csv", by_scene, ["model_key", "scene", "k"], 27 * 20 * 6),
        ("event_positions.csv", by_position, ["model_key", "position"], 27 * 6),
        ("adaptation_by_length.csv", by_method, ["model", "method", "run", "k"], 13 * 7),
        ("adaptation_by_scene.csv", by_method_scene, ["model", "method", "run", "scene", "k"], 13 * 20 * 7),
        ("effort_results.csv", effort, ["model", "effort", "stage", "scene"], 2 * 3 * 2 * 21),
    ]
    for name, totals, fields, expected_rows in tables:
        checked = verify_table(name, totals, fields)
        if checked != expected_rows:
            raise ValueError(f"{name}: expected {expected_rows} rows, found {checked}")
        print(f"{name}: {checked} rows verified")


if __name__ == "__main__":
    main()
