"""Render the repository's readable result tables from the public CSV files."""
import argparse
import csv
import re
from fractions import Fraction
from pathlib import Path


ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "docs" / "assets"
DATA = ASSETS / "results"
OUT = ROOT / "results"
LENGTHS = tuple(str(k) for k in range(1, 7))
LENGTH_HEADERS = tuple(f"k = {k}" for k in LENGTHS)
DOMAINS = ("Dynamics", "Thermal", "Electromagnetism", "Acoustics", "Optics", "Overall")


def read(path):
    with path.open(encoding="utf-8-sig", newline="") as stream:
        return list(csv.DictReader(stream))


def index(name, fields):
    records = {}
    for row in read(DATA / f"{name}.csv"):
        key = tuple(row[field] for field in fields)
        if key in records:
            raise ValueError(f"Duplicate key in {name}: {key}")
        records[key] = row
    return records


def row(cells):
    return "| " + " | ".join(map(str, cells)) + " |"


def table(first, columns):
    return [row([first, *columns]), row(["---", *["---:" for _ in columns]])]


def heading(anchor, title):
    return [f'<a name="{anchor}"></a>', "", f"## {title}", ""]


def percent(record, event=False):
    value = record["event_accuracy_pct" if event else "accuracy_pct"]
    return f"{float(value):.1f}" if value else "—"


def measured(record):
    return Fraction(int(record["correct"]), int(record["total"]))


def model_rows(order, columns, values):
    lines = table("Model", columns)
    last_group = None
    for entry in order:
        if entry["Group"] != last_group:
            last_group = entry["Group"]
            lines.append(row([f"**{last_group}**", *([""] * len(columns))]))
        lines.append(row([entry["Model"], *values(entry["Model"])]))
    return lines


def domain_tables(order):
    records = index("domain_by_length", ["model", "k", "domain"])
    lines = ["# Exact match by physical domain", "",
             "Each table reports the percentage of questions for which every event is correct. "
             "Bold marks the highest accuracy in a column across all 27 models. "
             "Underlining marks the second distinct accuracy. Tied models share the same mark.", "",
             " · ".join(f"[{k} {'event' if k == '1' else 'events'}](#domain-k{k})" for k in LENGTHS), "",
             "[Download counts and percentages](../docs/assets/results/domain_by_length.csv)", ""]
    for k in LENGTHS:
        total = int(records[order[0]["Model"], k, "Overall"]["total"])
        lines.extend(heading(f"domain-k{k}", f"{k} {'event' if k == '1' else 'events'}"))
        denominators = [int(records[order[0]["Model"], k, d]["total"]) for d in DOMAINS[:-1]]
        if len(set(denominators)) == 1:
            lines.extend([f"{total} questions, with {denominators[0]} in each domain.", ""])
        else:
            lines.extend([f"{total} questions, with {denominators[2]} in electromagnetism and "
                          f"{denominators[0]} in each other domain.", ""])
        top_two = {d: sorted({measured(records[m["Model"], k, d]) for m in order}, reverse=True)[:2]
                   for d in DOMAINS}
        def values(model):
            cells = []
            for d in DOMAINS:
                r = records[model, k, d]
                text, value = percent(r), measured(r)
                if value == top_two[d][0]:
                    text = f"**{text}**"
                elif value in top_two[d][1:]:
                    text = f"<ins>{text}</ins>"
                cells.append(text)
            return cells
        lines.extend([*model_rows(order, DOMAINS, values), ""])
    return lines


def scene_tables(order, scenes):
    records = index("scene_by_length", ["model", "scene", "k"])
    lines = ["# Exact match by apparatus and question length", "",
             "Each percentage scores complete answers from ten test episodes at a given length. "
             "S11 has questions with three to six events. A dash marks a length with zero eligible questions.", "",
             "[Download counts and percentages](../docs/assets/results/scene_by_length.csv)", ""]
    for d in DOMAINS[:-1]:
        links = [f"[{s['scene']} {s['apparatus']}](#{s['scene'].lower()})" for s in scenes if s["domain"] == d]
        lines.append(f"- **{d}** · " + " · ".join(links))
    lines.append("")
    for s in scenes:
        sid = s["scene"]
        lines.extend(heading(sid.lower(), f"{sid} · {s['apparatus']}"))
        lines.extend(model_rows(order, LENGTH_HEADERS,
                                lambda m: [percent(records[m, sid, k]) for k in LENGTHS]))
        lines.append("")
    return lines


def method_title(configuration):
    model, method, run = configuration
    suffix = f" · seed {run}" if run.isdigit() else " · two-seed mean" if run == "Mean" else ""
    return f"{model} · {method}{suffix}"


def run_anchor(configuration):
    return re.sub(r"[^a-z0-9]+", "-", "-".join(configuration).lower()).strip("-")


def adaptation_tables(scenes):
    summaries = index("adaptation_by_length", ["model", "method", "run", "k"])
    by_scene = index("adaptation_by_scene", ["model", "method", "run", "scene", "k"])
    runs = list(dict.fromkeys(key[:3] for key in summaries))
    cols = (*LENGTH_HEADERS, "Overall")
    lengths = (*LENGTHS, "Overall")
    lines = ["# Adaptation results by run and apparatus", "",
             "Sequence exact match requires a correct control set at every position. "
             "Event accuracy scores each position individually. All scores are percentages. "
             "SimPO and KTO each have two training seeds. The reported means combine runs with equal test denominators.", "",
             "Each run uses 190 questions at each of the first two lengths and 200 at each of the other four. "
             "Each apparatus contributes ten questions per available length. Across lengths, the denominator is "
             "60 questions per apparatus, or 40 for S11. A dash marks a length with zero eligible questions.", "",
             "[Counts by run and length](../docs/assets/results/adaptation_by_length.csv) · "
             "[Counts by run and apparatus](../docs/assets/results/adaptation_by_scene.csv) · "
             "[Question-level scores](adaptation_question_scores.csv)", "",
             "## All runs", "", "**Sequence exact match (%)**", "", *table("Model and method", cols)]
    for run in runs:
        link = f"[{method_title(run)}](#{run_anchor(run)})"
        lines.append(row([link, *[percent(summaries[run + (k,)]) for k in lengths]]))
    lines.extend(["", "<details><summary>Event accuracy across all apparatuses</summary>", "",
                  *table("Model and method", cols)])
    for run in runs:
        lines.append(row([method_title(run), *[percent(summaries[run + (k,)], True) for k in lengths]]))
    lines.extend(["", "</details>", ""])
    for run in runs:
        lines.extend(heading(run_anchor(run), method_title(run)))
        for event in (False, True):
            if event:
                lines.extend(["<details><summary>Event accuracy by apparatus</summary>", ""])
            else:
                lines.extend(["**Sequence exact match (%)**", ""])
            lines.extend(table("Apparatus", cols))
            for s in scenes:
                sid = s["scene"]
                lines.append(row([f"{sid} · {s['apparatus']}",
                                  *[percent(by_scene[run + (sid, k)], event) for k in lengths]]))
            lines.append("")
            if event:
                lines.extend(["</details>", ""])
    return lines


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="verify existing tables without rewriting them")
    args = parser.parse_args()
    order = read(ASSETS / "domains.csv")
    scenes = read(DATA / "scene_controls.csv")
    documents = {"domain_tables.md": domain_tables(order), "apparatus_tables.md": scene_tables(order, scenes),
                 "adaptation_tables.md": adaptation_tables(scenes)}
    for name, lines in documents.items():
        content = "\n".join(lines).rstrip() + "\n"
        target = OUT / name
        if args.check:
            if content != target.read_text(encoding="utf8"):
                raise SystemExit(f"Regenerate {name} with python render_result_tables.py")
        else:
            target.write_bytes(content.encode("utf8"))
        print(name)


if __name__ == "__main__":
    main()
