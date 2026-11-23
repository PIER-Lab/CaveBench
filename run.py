"""Evaluate CaveBench prompts and internal frames with a chat-completions endpoint."""
import argparse
import base64
import json
import os
import urllib.request
from pathlib import Path

from contracts import validate_question


def payload(question, dataset, model, max_tokens):
    validate_question(question, files=False)
    parts = [{"type": "text", "text": question["prompt"]}]
    for index, relative_path in enumerate(question["images"]):
        path = (dataset / relative_path).resolve()
        if not path.is_relative_to(dataset.resolve()):
            raise ValueError(f"Image path outside dataset: {relative_path}")
        image = base64.b64encode(path.read_bytes()).decode("ascii")
        parts.extend([{"type": "text", "text": f"Frame F{index}"},
                      {"type": "image_url", "image_url": {"url": "data:image/png;base64," + image, "detail": "high"}}])
    return {"model": model, "messages": [{"role":"user","content":parts}],
            "max_tokens": max_tokens, "stream": False}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, required=True)
    parser.add_argument("--model", required=True)
    parser.add_argument("--endpoint", required=True, help="Complete HTTPS chat/completions URL")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--max-tokens", type=int, default=8192)
    parser.add_argument("--limit", type=int, help="Evaluate only the first N questions")
    args = parser.parse_args()
    if not args.endpoint.startswith("https://") and not args.endpoint.startswith(("http://localhost:", "http://127.0.0.1:")):
        parser.error("Use HTTPS for remote endpoints.")
    key = os.environ.get("CAVEBENCH_API_KEY")
    headers = {"Content-Type":"application/json"}
    if key:
        headers["Authorization"] = "Bearer " + key
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with (args.data / "questions.jsonl").open(encoding="utf-8") as questions, args.output.open("x", encoding="utf-8") as predictions:
        for index, line in enumerate(questions):
            if args.limit is not None and index >= args.limit:
                break
            question = json.loads(line)
            data = json.dumps(payload(question, args.data, args.model, args.max_tokens)).encode()
            req = urllib.request.Request(args.endpoint, data=data, headers=headers)
            with urllib.request.urlopen(req, timeout=300) as response:
                answer = json.load(response)["choices"][0]["message"]["content"]
            if not isinstance(answer, str):
                raise ValueError(f"No text response for {question['id']}")
            predictions.write(json.dumps({"id":question["id"], "response":answer}, ensure_ascii=False) + "\n")
            predictions.flush()


if __name__ == "__main__":
    main()

