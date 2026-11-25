"""Published model settings and the two-stage evaluation protocol."""
import json
from pathlib import Path

from .completion import build_forced_guess_payload
from .controller import AnswerController, ForcedGuessController, make_finalization_request
from .transport import run_stream_stage


class PaperSettings:
    def __init__(self, model):
        with Path(__file__).with_name("profiles.json").open(encoding="utf-8") as source:
            profiles = json.load(source)
        if model not in profiles:
            raise ValueError("Choose a published provider model ID: " + ", ".join(profiles))
        table = profiles[model]
        self.default = table["default"]
        self.overrides = {
            question_id: group["settings"]
            for group in table["overrides"] for question_id in group["questions"]
        }
        self.identity = {
            "accepted_response_models": table["accepted_response_models"],
            "expected_provider": table["expected_provider"],
        }

    def for_question(self, question):
        return self.overrides.get(question["id"], self.default)


def completion_request(question, primary, controller, settings):
    format_name = settings["format"]
    if format_name == "operations":
        request = make_finalization_request(primary, controller, settings["reasoning"])
    else:
        # The primary adds an answer contract after the archived task. The
        # candidate-index completion presents the original task and its own contract.
        task = {**question, "prompt": question["prompt"].rsplit("\nFINAL ANSWER CONTRACT:", 1)[0].rstrip()}
        request = build_forced_guess_payload(
            primary, task, prior_content=controller.content,
            prior_reasoning=controller.recent_context()["recent_visible_reasoning"],
            reasoning_config=settings["reasoning"], max_tokens=settings["max_tokens"],
        )
        if format_name == "indices":
            request.pop("response_format")
        elif format_name == "json":
            request["response_format"] = {"type": "json_object"}
        elif format_name == "enum":
            field = request["response_format"]["json_schema"]["schema"]["properties"]["candidate_indices"]
            field.pop("minItems")
            field.pop("maxItems")
            field["items"] = {"type": "integer", "enum": list(range(1, len(question["candidates"]) + 1))}
    if "provider" in settings:
        if settings["provider"] is None:
            request.pop("provider", None)
        else:
            request["provider"] = settings["provider"]
    return request


def request_published(question, payload, protocol, endpoint, key, transport=run_stream_stage):
    config = protocol.for_question(question)
    first = {**payload, **config["primary"]}
    final = config["completion"]
    model = dict(id=first["model"], output_total_token_cap=first["max_tokens"],
                 primary_client_timeout_seconds=config["primary_seconds"],
                 answer_submission_token_cap=final["max_tokens"],
                 accept_equivalent_operation_format=final["accept_operations"])
    controller_type = AnswerController if final["format"] == "operations" else ForcedGuessController
    controller = controller_type(model, question)

    def send(request, stage, seconds):
        out = transport(endpoint, key, request, controller=controller, stage=stage,
                        idle_timeout=45, wall_timeout=seconds, **protocol.identity)
        action = out.get("decision") or {}
        if out["http_status"] is not None and not 200 <= out["http_status"] < 300:
            raise RuntimeError(f"{question['id']}: HTTP {out['http_status']}")
        if action.get("action") == "hold":
            raise RuntimeError(f"{question['id']}: {action.get('reason')}")

    send(first, "primary", controller.policy["primary_wall_seconds"])
    if controller.state == "awaiting_finalization":
        controller.begin_finalization()
        send(completion_request(question, first, controller, final), "finalization", final["seconds"])
    if not controller.selected:
        raise ValueError(f"No complete model-selected sequence for {question['id']}")
    return json.dumps({"operations": controller.selected["operations"]}, ensure_ascii=False)
