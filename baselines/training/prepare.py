"""Build training and validation inputs from the public CaveBench split manifests."""

import argparse
import gzip
import hashlib
import json
import tempfile
from contextlib import contextmanager
from pathlib import Path


RECORDS = Path(__file__).resolve().parent / "records"


def records(name):
    with gzip.open(RECORDS / f"{name}.jsonl.gz", "rt", encoding="utf-8") as stream:
        yield from map(json.loads, stream)


def compact(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def read_split(root, name, size):
    with (root / "episodes" / f"{name}.jsonl").open(encoding="utf-8") as stream:
        rows = list(map(json.loads, stream))
    indexed = {r["id"]: r for r in rows}
    if len(indexed) != size or len(rows) != size or any(r["split_status"] != name for r in rows):
        raise ValueError(f"Invalid {name} episode manifest")
    for ep in rows:
        if len(ep["images"]) != 7 or len(ep["operations"]) != 6:
            raise ValueError(f"Incomplete episode {ep['id']}")
        raw_paths = ep["images"]
        paths = [(root / rel).resolve() for rel in raw_paths]
        if any(not p.is_relative_to(root) or not p.is_file() for p in paths):
            raise ValueError(f"Missing or invalid frame in {ep['id']}. Run prepare_media.py --all first.")
        ep["images"] = [str(p) for p in paths]
    return indexed


@contextmanager
def output_file(folder, name):
    with (folder / f"{name}.jsonl").open("x", encoding="utf-8", newline="\n") as stream:
        yield lambda row: stream.write(compact(row) + "\n")


def supervised(folder, name, episodes):
    rows = list(records(name))
    if len(rows) != len(episodes) or {r["id"] for r in rows} != episodes.keys():
        raise ValueError(f"Episode membership differs for {name}")
    if name == "sft_prefix":
        def prefix_order(row):
            qid = f"{row['id']}/k{row['k']}"
            return hashlib.sha256(compact(["mixed-order-v1", qid]).encode()).digest()
        rows.sort(key=prefix_order)
    with output_file(folder, name) as write:
        for row in rows:
            ep = episodes[row["id"]]
            k = row.get("k", 6)
            images = ep["images"][:k + 1]
            markers = "\n".join(f"F{i}: <image>" for i in range(k + 1))
            messages = [
                {"role": "user", "content": markers + "\n\n" + row["prompt"]},
                {"role": "assistant", "content": compact({"operations": ep["operations"][:k]})},
            ]
            write({"messages": messages, "images": images})


def preferences(folder, name, episodes, expected):
    with output_file(folder, name) as write:
        count = 0
        for row in records(name):
            ep = episodes[row.pop("episode")]
            k = row.pop("k")
            row["images"] = ep["images"][:k + 1]
            write(row)
            count += 1
        if count != expected:
            raise ValueError(f"Incomplete {name} records")


def validation_cases(folder, validation, root):
    rows = list(records("dev100"))
    if len(rows) != 100 or len({r["episode"] for r in rows}) != 100:
        raise ValueError("Invalid checkpoint-selection cohort")
    with output_file(folder, "dev100") as write:
        for row in rows:
            ep = validation[row.pop("episode")]
            row.update(scene=ep["scene"], paper_scene=ep["paper_scene"], sample_id=ep["sample_id"], k=6,
                       images=[Path(path).relative_to(root).as_posix() for path in ep["images"]])
            write(row)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    root = args.data.resolve()
    target = args.output.resolve()
    if target.exists():
        parser.error("--output must name a new directory")
    train = read_split(root, "train", 9000)
    val = read_split(root, "validation", 1000)
    if train.keys() & val.keys():
        raise ValueError("Train and validation IDs intersect")
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=target.parent) as tmp:
        staging = Path(tmp) / "inputs"
        staging.mkdir()
        supervised(staging, "sft_full", train)
        supervised(staging, "sft_prefix", train)
        supervised(staging, "validation", val)
        preferences(staging, "pairs", train, 1076)
        preferences(staging, "kto", train, 5475)
        validation_cases(staging, val, root)
        staging.rename(target)


if __name__ == "__main__":
    main()
