"""Run one CaveBench training stage with the recorded SWIFT configuration."""

import argparse
import json
import os
import shlex
import subprocess
from pathlib import Path


CONFIGS = Path(__file__).resolve().parent / "configs"
DATASETS = {
    "sft_k6": "sft_full", "sft_prefix": "sft_prefix",
    "dpo": "pairs", "simpo": "pairs", "kto": "kto",
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("stage", choices=DATASETS)
    parser.add_argument("--model", required=True, type=Path)
    parser.add_argument("--inputs", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--warm-adapter", type=Path, help="Final full-sequence SFT checkpoint for prefix training")
    parser.add_argument("--gpus", default="0", help="Comma-separated local CUDA device indices")
    parser.add_argument("--seed", type=int)
    parser.add_argument("--dry-run", action="store_true", help="Print the resolved SWIFT command")
    args = parser.parse_args()
    devices = args.gpus.split(",")
    if not all(d.isdigit() for d in devices) or len(set(map(int, devices))) != len(devices) or 16 % len(devices):
        parser.error("--gpus must select distinct CUDA indices whose number divides the effective batch size 16")
    if (args.stage == "sft_prefix") != bool(args.warm_adapter):
        parser.error("--warm-adapter applies only to sft_prefix and is required for that stage")
    output = args.output.resolve()
    dataset = args.inputs.resolve() / (DATASETS[args.stage] + ".jsonl")
    validation = args.inputs.resolve() / "validation.jsonl"
    if not dataset.is_file() or (args.stage.startswith("sft") and not validation.is_file()):
        parser.error("Prepared input files are missing. Run prepare.py before training.")
    if not args.dry_run:
        if not args.model.is_dir() or (args.warm_adapter and not (args.warm_adapter / "adapter_config.json").is_file()):
            parser.error("The requested local model or adapter does not exist")
        if output.exists() and any(output.iterdir()):
            parser.error("--output must be new or empty")
    variables = {
        "${INIT_MODEL}": str(args.model.resolve()), "${DATASET}": str(dataset),
        "${OUTPUT}": str(output), "${VALIDATION}": str(validation),
        "${WARM_ADAPTER}": str(args.warm_adapter.resolve()) if args.warm_adapter else "",
    }
    options = json.loads((CONFIGS / (args.stage + ".json")).read_text(encoding="utf-8"))
    options["--gradient_accumulation_steps"] = str(16 // len(devices))
    if args.seed is not None:
        options.update({"--seed": str(args.seed), "--data_seed": str(args.seed)})
    command = ["swift", "sft" if args.stage.startswith("sft") else "rlhf"]
    for key, value in options.items():
        command.extend([key, variables.get(value, value)])
    print(shlex.join(command), flush=True)
    if not args.dry_run:
        env = dict(os.environ, CUDA_VISIBLE_DEVICES=args.gpus, NPROC_PER_NODE=str(len(devices)),
                   IMAGE_MAX_TOKEN_NUM="1024", TOKENIZERS_PARALLELISM="false", USE_HF="1")
        subprocess.run(command, env=env, check=True)


if __name__ == "__main__":
    main()
