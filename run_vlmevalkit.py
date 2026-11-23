"""Evaluate a multi-image model from VLMEvalKit's registry on CaveBench."""
import argparse
import json
from itertools import islice
from pathlib import Path

from run_local import messages_for


def message_for(question, data):
    content = messages_for(question, data)[0]["content"]
    return [{"type": part["type"], "value": part["text"] if part["type"] == "text" else part["url"]}
            for part in content]


def evaluate(model, data, output, limit):
    output.parent.mkdir(parents=True, exist_ok=True)
    if output.exists():
        raise FileExistsError(output)
    partial = output.with_name(output.name + ".partial")
    with (data / "questions.jsonl").open(encoding="utf-8") as source, partial.open("x", encoding="utf-8") as sink:
        if output.exists():
            sink.close()
            partial.unlink()
            raise FileExistsError(output)
        for line in islice(source, limit):
            question = json.loads(line)
            answer = model.generate(message=message_for(question, data))
            if not isinstance(answer, str):
                raise ValueError(f"No visible answer text for {question['id']}")
            sink.write(json.dumps({"id": question["id"], "response": answer}, ensure_ascii=False) + "\n")
            sink.flush()
    partial.rename(output)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, required=True)
    parser.add_argument("--model", required=True, help="Registered VLMEvalKit model with multi-image support")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--limit", type=int, help="Read only the first N questions")
    args = parser.parse_args()
    if args.limit is not None and args.limit < 1:
        parser.error("--limit must be positive")
    from vlmeval.config import supported_VLM
    if args.model not in supported_VLM:
        parser.error(f"Unknown model in the installed VLMEvalKit registry: {args.model}")
    evaluate(supported_VLM[args.model](), args.data, args.output, args.limit)
