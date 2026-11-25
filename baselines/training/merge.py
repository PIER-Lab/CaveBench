"""Merge the prefix-trained LoRA into Qwen3.5-9B as the starting point for preference training."""

import argparse
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base", required=True, type=Path)
    parser.add_argument("--adapter", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    if args.output.exists():
        parser.error("--output must name a new directory")
    import torch
    from peft import PeftModel
    from transformers import AutoProcessor, Qwen3_5ForConditionalGeneration

    base = Qwen3_5ForConditionalGeneration.from_pretrained(
        str(args.base), dtype=torch.bfloat16, device_map="cpu", local_files_only=True)
    merged = PeftModel.from_pretrained(base, str(args.adapter)).merge_and_unload(safe_merge=True)
    merged.save_pretrained(args.output, safe_serialization=True, max_shard_size="4GB")
    AutoProcessor.from_pretrained(str(args.base), local_files_only=True).save_pretrained(args.output)


if __name__ == "__main__":
    main()
