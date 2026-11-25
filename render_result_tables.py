"""Render the tables and figure data in arXiv:2611.32251 from the released CSVs."""
import argparse
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "docs/assets"
DATA = ASSETS / "results"
RESULTS = ROOT / "results"
PAPER = "https://arxiv.org/html/2611.32251v1"


def rows(path):
    with path.open(encoding="utf-8-sig", newline="") as source:
        return list(csv.DictReader(source))


def table(headers, records):
    def row(values):
        return "| " + " | ".join(values) + " |"
    return [row(headers), row(["---"] * len(headers)), *[row(values) for values in records], ""]


def source(name, anchor):
    return f"[{name}]({PAPER}#{anchor})"


def grouped(path):
    records = rows(path)
    columns = list(records[0])[1:]
    output = []
    for group in dict.fromkeys(r["Group"] for r in records):
        output += [f"### {group}", ""]
        output += table(columns, ([r[c] for c in columns] for r in records if r["Group"] == group))
    return output


def main_tables():
    return ['<a name="domain-k6"></a>', "", "# Model Results", "",
            source("Table 1. Six-event exact-match accuracy by physical domain (%)", "S3.T1"), "",
            *grouped(ASSETS / "domains.csv"),
            source("Table 2. Exact-match accuracy by question length (%)", "S4.T2"), "",
            *grouped(ASSETS / "length.csv"),
            "[Question-level scores](question_scores.csv)", ""]


def apparatus_tables():
    records = rows(DATA / "scene_by_length.csv")
    scenes = rows(DATA / "scene_controls.csv")
    values = {(r["model"], r["k"], r["scene"]): r for r in records}
    order = rows(ASSETS / "domains.csv")
    output = ["# Exact Match by Apparatus and Question Length", "",
              "Each cell reports the percentage of ten questions answered exactly. "
              "S11 has questions at lengths three through six. "
              "The two panels share the same model order.", "",
              " · ".join(f"[{i} events](#tasks-k{i})" for i in range(1, 7)), "",
              "[Question-level scores](question_scores.csv) · "
              "[Counts by apparatus](../docs/assets/results/scene_by_length.csv)", ""]
    for length in range(1, 7):
        output += [f'<a name="tasks-k{length}"></a>', "",
                   f"## Table {length + 5}. {length}-event questions", "",
                   source("Published table", f"A6.T{length + 5}"), ""]
        for panel in (scenes[:10], scenes[10:]):
            scene_ids = [s["scene"] for s in panel]
            data = []
            for entry in order:
                line = [entry["Model"]]
                for scene in scene_ids:
                    result = values[entry["Model"], str(length), scene]
                    line.append(f'{float(result["accuracy_pct"]):g}' if result["total"] != "0" else "—")
                data.append(line)
            output += table(["Model", *scene_ids], data)
    return output


def adaptation_tables():
    output = ["# Adaptation Results", "",
              source("Table 3. Exact-match accuracy by method (%)", "S4.T3"), "",
              *grouped(ASSETS / "methods.csv"), '<a name="preference-seeds"></a>', "",
              "## Preference Training across Seeds", "",
              source("Table 12. Sequence exact match across seeds (%)", "A6.T12"), ""]
    runs = rows(DATA / "adaptation_by_length.csv")
    lengths = [*map(str, range(1, 7)), "Overall"]
    entries = []
    for method in ("SFT + SimPO", "SFT + KTO"):
        for seed in sorted({r["run"] for r in runs if r["method"] == method and r["run"] != "Mean"}):
            run = {r["k"]: r for r in runs if (r["method"], r["run"]) == (method, seed)}
            entries.append([method, seed, *[f'{float(run[k]["accuracy_pct"]):.1f}' for k in lengths]])
    output += table(["Method", "Training seed", *[f"k = {v}" for v in lengths[:-1]], "Overall"], entries)
    return output + ["[Individual run counts](../docs/assets/results/adaptation_by_length.csv) · "
                     "[Question-level scores](adaptation_question_scores.csv)", ""]


def research_tables():
    output = ["# Benchmark and Experiment Tables", ""]
    for path, title, anchor, headers in [
        ("benchmark_comparison", "Visual Evidence and Inference Targets", "A2.T4",
         ["Benchmark", "Evidence supplied", "Inference target"]),
        ("test_by_domain", "Test Questions and Recorded Events", "A4.T5",
         ["Domain", "Apparatuses", "Questions", "One-label events", "Two-label events"]),
        ("reasoning_effort_summary", "Accuracy and Mean Token Use by Reasoning Effort", "A6.T13",
         ["Model", "Effort", "Initial exact (%)", "Final exact (%)", "Final event accuracy (%)",
          "Output tokens", "Reasoning tokens"]),
    ]:
        if path == "reasoning_effort_summary":
            output += ['<a name="reasoning-effort"></a>', ""]
        data = rows(DATA / f"{path}.csv")
        output += [f"## {title}", "", source("Published table", anchor), ""]
        output += table(headers, [list(r.values()) for r in data])
    output += ["## Figure Data", "",
               "- [Figure 1. Six-event exact match](../docs/assets/results/figure1.csv)",
               "- [Figure 6. Reasoning effort by apparatus](../docs/assets/results/effort_results.csv)",
               "- [Figure 7. Error categories](../docs/assets/results/error_categories.csv)", ""]
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Compare tracked tables with the released CSVs")
    args = parser.parse_args()
    for name, lines in [("domain_tables.md", main_tables()), ("tasks_by_length.md", apparatus_tables()),
                        ("adaptation_tables.md", adaptation_tables()), ("figure_tables.md", research_tables())]:
        path = RESULTS / name
        content = "\n".join(lines)
        if args.check:
            if path.read_text(encoding="utf-8") != content:
                raise SystemExit(f"{name} differs from the released results")
        else:
            path.write_text(content, encoding="utf-8")
        print(name)


if __name__ == "__main__":
    main()
