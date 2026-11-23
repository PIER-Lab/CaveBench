"""Generate the GitHub result tables from the published CaveBench data."""
import argparse
import csv
import re
from decimal import Decimal, ROUND_HALF_UP
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


def count_percent(record, correct="correct", total="total"):
    value = Decimal(100) * Decimal(record[correct]) / Decimal(record[total])
    text = format(value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP), "f")
    return text[:-1] if text.endswith("0") else text


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
             "Exact match is the percentage of questions with the correct controls at every event. "
             "Bold marks the highest score in each column and underlining marks the second highest.", "",
             " · ".join(f"[{k} {'event' if k == '1' else 'events'}](#domain-k{k})" for k in LENGTHS), "",
             "[Download counts and percentages](../docs/assets/results/domain_by_length.csv)"
             " · [Event accuracy by question length](#event-by-length)", ""]
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
    events = index("main_event_by_length", ["model", "k"])
    lengths = (*LENGTHS, "Overall")
    lines.extend(heading("event-by-length", "Event accuracy by question length"))
    lines.extend(["Event accuracy (%) counts an event as correct when its entire control set matches the reference. "
                  "Overall pools the 4,170 event predictions across all 1,180 questions.", "",
                  *table("Model", [*LENGTH_HEADERS, "Overall"])])
    total = [int(events[order[0]["Model"], k]["total_events"]) for k in lengths]
    lines.append(row(["Scored events", *[f"{n:,}" for n in total]]))
    for m in order:
        name = m["Model"]
        lines.append(row([name, *[count_percent(events[name, k], "correct_events", "total_events") for k in lengths]]))
    lines.extend(["","[Download correct and scored event counts](../docs/assets/results/main_event_by_length.csv)", ""])
    return lines


def scene_tables(order, scenes):
    records = index("scene_by_length", ["model", "scene", "k"])
    lines = ["# Exact match by apparatus and question length", "",
             "Each column shows sequence exact match (%) for questions with `k` events. "
             "Each apparatus contributes ten questions per available length. "
             "Dielectric response (S11) begins at three events.", "",
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


def adaptation_domains():
    records = index("adaptation_by_domain", ["model", "method", "run", "k", "domain"])
    runs = list(dict.fromkeys(key[:3] for key in records))
    lines = [
        "# Adaptation results by physical domain", "",
        "Each column gives sequence exact match (%) within a physical domain. Overall pools all questions "
        "at that length. For SimPO and KTO, the two-seed mean gives equal weight to the two runs.", "",
        " · ".join(f"[{k} {'event' if k == '1' else 'events'}](#adaptation-k{k})" for k in LENGTHS), "",
        "[Download correct counts, denominators and event accuracy](../docs/assets/results/adaptation_by_domain.csv)"
        " · [Results for individual apparatuses](adaptation_tables.md) · [Question-level scores](adaptation_question_scores.csv)", ""
    ]
    for k in LENGTHS:
        lines.extend(heading(f"adaptation-k{k}", f"{k} {'event' if k == '1' else 'events'}"))
        counts = {d: records[runs[0] + (k, d)]["questions_per_run"] for d in DOMAINS}
        if counts["Electromagnetism"] == counts["Dynamics"]:
            note = f"{counts['Dynamics']} in each domain."
        else:
            note = f"{counts['Electromagnetism']} in electromagnetism and {counts['Dynamics']} in each other domain."
        lines.extend([f"{counts['Overall']} questions per run, with {note} "
                      f"[Interactive table](https://pier-lab.github.io/CaveBench/#table-adaptation_by_domain-k{k})", "",
                      *table("Model and method", DOMAINS)])
        for run in runs:
            label = f"[{method_title(run)}](adaptation_tables.md#{run_anchor(run)})"
            lines.append(row([label, *[count_percent(records[run + (k, d)]) for d in DOMAINS]]))
        lines.append("")
    return lines


def figure_tables(order, scenes):
    """Report the values plotted in the paper and the counts behind the error analysis."""
    lines = ["# Data for the paper figures", "",
             "[Six-event accuracy](#figure-1) · [Dataset construction](#figure-3) · "
             "[Training case](#figure-5) · [Reasoning effort](#figure-6) · [Error categories](#error-categories)", ""]
    lines.extend(heading("figure-1", "Figure 1 · Six-event accuracy"))
    lines.extend(table("Model", ["Correct sequences", "Test questions", "Exact match (%)"]))
    for r in read(DATA / "figure1.csv"):
        lines.append(row([r["model"], r["correct"], r["total"], percent(r)]))
    lines.extend(["", "[Download figure data](../docs/assets/results/figure1.csv) · [All 27 models](domain_tables.md#domain-k6)", ""])

    lines.extend(heading("figure-3", "Figure 3 · Dataset construction"))
    lines.extend([*table("Quantity", ["Count"]),
                  row(["Physical domains", len({s["domain"] for s in scenes})]),
                  row(["Apparatuses per domain", 4]),
                  row(["Apparatuses", len(scenes)]),
                  row(["Episodes per apparatus", 510]),
                  row(["Development and test episodes per apparatus", "500 development + 10 test"]),
                  row(["Development episodes", "10,000 (9,000 training + 1,000 validation)"]),
                  row(["Test episodes", sum(int(s["episodes"]) for s in scenes)]),
                  row(["Total episodes", "10,200"]),
                  row(["Internal frames per episode", 7]), row(["Interventions per episode", 6]),
                  row(["Question lengths (events)", "1–6 (3–6 for S11)"]),
                  row(["Test questions per model", "1,180"]), row(["Evaluated model configurations", len(order)]),
                  "", "[Dataset](https://huggingface.co/datasets/linguanxin/CaveBench)"
                  " · [Test counts by apparatus](../docs/assets/results/scene_controls.csv)", ""])

    lines.extend(heading("figure-5", "Figure 5 · Dielectric response after preference training"))
    lines.extend(["In S11 sample 0007, the Qwen3.5-9B baseline confuses full and half insertion at events 1 and 3. "
                  "Both SimPO runs recover all six controls.", "",
                  row(["Event", "Reference", "Qwen3.5-9B baseline", "SFT + SimPO (seed 20261108)", "SFT + SimPO (seed 20261109)"]),
                  row(["---:", "---", "---", "---", "---"])])
    for r in read(DATA / "training_case.csv"):
        lines.append(row([r["event"], *[f"`{r[field]}`" for field in ("reference", "baseline", "simpo_20261108", "simpo_20261109")]]))
    lines.extend(["", "[Download per-event predictions](../docs/assets/results/training_case.csv)", ""])

    lines.extend(heading("figure-6", "Figure 6 · Reasoning effort by apparatus"))
    lines.extend(["GPT-6.1 Sol and Gemini 3.8 Flash each answer the same ten six-event questions per apparatus "
                  "at low, medium and high reasoning effort. Scores are final sequence exact match (%).", "",
                  row(["Apparatus", "Domain", "Sol low", "Sol medium", "Sol high", "Gemini low", "Gemini medium", "Gemini high"]),
                  row(["---", "---", "---:", "---:", "---:", "---:", "---:", "---:"])])
    effort = index("effort_results", ["model", "effort", "stage", "scene"])
    for s in [*scenes, {"scene": "Overall", "apparatus": "All 200 episodes", "domain": "All five"}]:
        label = f"{s['scene']} · {s['apparatus']}"
        values = [percent(effort[model, level, "Final", s["scene"]])
                  for model in ("GPT-6.1 Sol", "Gemini 3.8 Flash") for level in ("Low", "Medium", "High")]
        lines.append(row([label, s["domain"], *values]))
    lines.extend(["",
                  "[Download initial and final scores and counts](../docs/assets/results/effort_results.csv)"
                  " · [Question-level scores](effort_question_scores.csv)", ""])

    lines.extend(heading("error-categories", "Error categories"))
    lines.extend(["Each of the 100 incorrect six-event responses received one primary error category. "
                  "The direct and limited counts reflect the strength of the evidence for that category in the response. "
                  "Visual identification accounted for 38 responses and evidence integration for 31.", "",
                  *table("Error category", ["Responses", "Direct support", "Limited support"])])
    errors = read(DATA / "error_categories.csv")
    fields = ("total", "direct", "limited")
    for r in errors:
        lines.append(row([r["category"], *[r[f] for f in fields]]))
    lines.append(row(["Total", *[sum(int(r[f]) for r in errors) for f in fields]]))
    return [*lines, "", "[Download error counts](../docs/assets/results/error_categories.csv)"]


def adaptation_tables(scenes):
    summaries = index("adaptation_by_length", ["model", "method", "run", "k"])
    by_scene = index("adaptation_by_scene", ["model", "method", "run", "scene", "k"])
    runs = list(dict.fromkeys(key[:3] for key in summaries))
    cols = (*LENGTH_HEADERS, "Overall")
    lengths = (*LENGTHS, "Overall")
    lines = ["# Adaptation results by run and apparatus", "",
             "Sequence exact match counts questions with every event correct. Event accuracy counts individual "
             "events whose predicted controls match the recorded set. SimPO and KTO have two seeds each.", "",
             "Question length (`k`) ranges from one to six events. There are ten questions per apparatus "
             "at each available length. Dielectric response (S11) begins at three events, giving "
             "190 questions each at one and two events and 200 each at three through six.", "",
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
    parser.add_argument("--check", action="store_true", help="Compare the Markdown tables with the source CSV files")
    args = parser.parse_args()
    order = read(ASSETS / "domains.csv")
    scenes = read(DATA / "scene_controls.csv")
    documents = {"domain_tables.md": domain_tables(order), "apparatus_tables.md": scene_tables(order, scenes),
                 "adaptation_tables.md": adaptation_tables(scenes), "adaptation_domains.md": adaptation_domains(),
                 "figure_tables.md": figure_tables(order, scenes)}
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
