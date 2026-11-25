"""Evaluate the Qwen3.5-9B base model or CaveBench PEFT adapters on local test frames."""
import argparse
import json
from pathlib import Path

from contracts import parse_answer, read_jsonl, validate_question
from prompt_templates import add_style_option, evaluation_question


MODEL_ID = "Qwen/Qwen3.5-9B"
BASE_REVISION = "c202236235762e1c871ad0ccb60c8ee5ba337b9a"


def messages_for(question, dataset):
    validate_question(question, files=False)
    root = dataset.resolve()
    parts = [{"type": "text", "text": question["prompt"]}]
    for relative in question["images"]:
        image = (root / relative).resolve()
        if not image.is_relative_to(root) or not image.is_file():
            raise ValueError(f"Missing or invalid frame for {question['id']}: {relative}")
        parts.append({"type": "image", "url": str(image)})
    return [{"role": "user", "content": parts}]


def complete_question(question, dataset, generate):
    messages = messages_for(question, dataset)
    first = generate(messages)
    k = question["k"]
    parsed = parse_answer(first, k, question["allowed_labels"], question.get("candidates"),
                          compact_labels=question.get("prompt_style") in ("compact","narrative"))
    if parsed is not None:
        return {"id": question["id"], "response": first, "completion_used": False}
    request = (
        f"Submit your current best-supported answer for all {k} events now. "
        "Return exactly one JSON object with only the operations field and exactly "
        f"{k} nonempty event lists. Every event must use one allowed label set "
        "from the original task. Do not omit an event or return null, unknown, abstention, "
        "empty lists, commentary, or additional fields. No additional images or evidence are supplied."
    )
    messages.extend([{"role": "assistant", "content": first},
                     {"role": "user", "content": [{"type": "text", "text": request}]}])
    return {"id": question["id"], "response": generate(messages),
            "initial_response": first, "completion_used": True}


def load_generator(base, sft, preference):
    import torch
    from transformers import AutoProcessor, Qwen3_5ForConditionalGeneration

    # The release's six adapters share this exact base revision.
    source = {"revision": BASE_REVISION} if base == MODEL_ID else {"local_files_only": True}
    processor = AutoProcessor.from_pretrained(base, **source)
    model = Qwen3_5ForConditionalGeneration.from_pretrained(
        base, dtype=torch.bfloat16, device_map="auto", **source)
    if sft is not None:
        from peft import PeftModel

        model = PeftModel.from_pretrained(model, str(sft))
        if preference is not None:
            model = model.merge_and_unload(safe_merge=True)
            model = PeftModel.from_pretrained(model, str(preference))
    model.eval()

    def generate(messages):
        inputs = processor.apply_chat_template(
            messages, tokenize=True, add_generation_prompt=True, enable_thinking=False,
            return_dict=True, return_tensors="pt").to(model.device)
        with torch.inference_mode():
            output = model.generate(**inputs, do_sample=False, max_new_tokens=1536)
        return processor.decode(output[0, inputs["input_ids"].shape[-1]:], skip_special_tokens=True)

    return generate


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--data", type=Path, required=True, help="Dataset root prepared by prepare_media.py")
    cli.add_argument("--output", type=Path, required=True, help="New prediction JSONL for score.py")
    cli.add_argument("--base", default=MODEL_ID, help="Official base model ID or its local snapshot directory")
    cli.add_argument("--sft", type=Path, help="Extracted CaveBench SFT adapter")
    cli.add_argument("--preference", type=Path, help="Extracted DPO, KTO or SimPO adapter, applied after SFT")
    cli.add_argument("--limit", type=int, help="Evaluate the first N questions")
    add_style_option(cli)
    args = cli.parse_args()
    if args.preference and not args.sft:
        cli.error("--preference requires the SFT adapter passed to --sft")
    if args.limit is not None and args.limit < 1:
        cli.error("--limit must be positive")
    if args.base != MODEL_ID and not Path(args.base).is_dir():
        cli.error("--base must be the official base ID or a local model directory")
    for path in (args.sft, args.preference):
        if path and not all((path / f).is_file() for f in ("adapter_model.safetensors", "adapter_config.json")):
            cli.error(f"Expected an extracted PEFT adapter in {path}")
    if args.output.exists():
        cli.error(f"Output already exists: {args.output}")

    questions = read_jsonl(args.data / "questions.jsonl")[:args.limit]
    if not questions:
        cli.error("The question file is empty")
    generate = load_generator(args.base, args.sft, args.preference)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    partial = args.output.with_name(args.output.name + ".partial")
    with partial.open("x", encoding="utf-8") as output:
        if args.output.exists():
            output.close()
            partial.unlink()
            cli.error(f"Output already exists: {args.output}")
        for question in questions:
            question = evaluation_question(question, args.prompt_style)
            row = complete_question(question, args.data, generate)
            if args.prompt_style != "original":
                row["prompt_style"] = args.prompt_style
            output.write(json.dumps(row, ensure_ascii=False) + "\n")
            output.flush()
    partial.rename(args.output)


if __name__ == "__main__":
    main()
