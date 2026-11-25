"""Candidate-index completion used in the main evaluation."""
from __future__ import annotations
from copy import deepcopy
import json
import re

ADAPTER_VERSION = 'forced_candidate_guess_v1'


def _unique(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError('Duplicate JSON key')
        result[key] = value
    return result


def _unwrap(text):
    if not isinstance(text, str):
        return text
    text = text.strip()
    if text.startswith('```'):
        found = re.fullmatch(r'```(?:json)?[ \t]*\r?\n(.*?)\r?\n```', text, re.DOTALL | re.IGNORECASE)
        if found is not None and '```' not in found.group(1):
            return found.group(1).strip()
    return text


def _validate_question(question):
    if set(question) & {'operations', 'answer', 'target', 'ground_truth', 'reference_operations'}:
        raise ValueError('Only public question inputs are allowed')
    k = question.get('k')
    if type(k) is not int or not 1 <= k <= 6:
        raise ValueError('Expected one to six chronological events')
    labels = question.get('allowed_labels')
    candidates = question.get('candidates')
    if not isinstance(labels, list) or not labels or any(not isinstance(x, str) or not x for x in labels):
        raise ValueError('Public labels must be nonempty strings')
    if not isinstance(candidates, list) or not candidates:
        raise ValueError('A fixed, nonempty candidate mapping is required')
    allowed = set(labels)
    for candidate in candidates:
        if (not isinstance(candidate, list) or not candidate
                or any(not isinstance(x, str) for x in candidate)
                or len(set(candidate)) != len(candidate) or not set(candidate) <= allowed):
            raise ValueError('Every candidate must be a complete legal action set')
    return k, len(candidates)


def parse_indices(text, k, n):
    """Accept exactly one complete index object, optionally in one JSON fence.

    Booleans, floats, missing/out-of-range selections, other fields, prose,
    duplicate keys and incomplete JSON are rejected. No guess is generated here.
    """
    if type(k) is not int or type(n) is not int or k < 1 or n < 1:
        raise ValueError('Positive integer event and candidate counts required')
    try:
        obj = json.loads(_unwrap(text), object_pairs_hook=_unique)
    except (TypeError, ValueError):
        return None
    if not isinstance(obj, dict) or set(obj) != {'candidate_indices'}:
        return None
    indices = obj['candidate_indices']
    if not isinstance(indices, list) or len(indices) != k:
        return None
    if any(type(index) is not int or not 1 <= index <= n for index in indices):
        return None
    return indices


def map_indices(indices, question):
    """Map explicit one-based model choices to unchanged public candidates."""
    k, n = _validate_question(question)
    if (not isinstance(indices, list) or len(indices) != k
            or any(type(index) is not int or not 1 <= index <= n for index in indices)):
        raise ValueError('Every index must be explicitly chosen by the model')
    return [deepcopy(question['candidates'][index - 1]) for index in indices]


def parse_candidate_answer(text, question):
    """Return authored indices and mapped operations, or None without repairs."""
    k, n = _validate_question(question)
    indices = parse_indices(text, k, n)
    if indices is None:
        return None
    return {'candidate_indices': indices, 'operations': map_indices(indices, question)}


def candidate_index_schema(question):
    k, n = _validate_question(question)
    return {'type': 'json_schema', 'json_schema': {
        'name': 'forced_candidate_guesses', 'strict': True,
        'schema': {'type': 'object', 'additionalProperties': False,
            'required': ['candidate_indices'], 'properties': {
                'candidate_indices': {'type': 'array', 'minItems': k, 'maxItems': k,
                    'items': {'type': 'integer', 'minimum': 1, 'maximum': n}}}}}}


def decision_system_prompt(question):
    k, n = _validate_question(question)
    return (
        'TIME EXPIRED: FORCED DECISION STAGE. Your reasoning time has already ended. '
        'You must commit your current best guesses NOW. Do not solve the physics problem again, '
        're-derive anything, inspect alternatives in prose, verify, or continue deliberation. '
        'This finalization stage only submits choices. The problem and images below are retained '
        'as context; previous requests to explain or use another output format are superseded '
        'ONLY for the output format of this decision stage. '
        f'Return exactly {{"candidate_indices":[...]}} containing exactly {k} integers, '
        f'each between 1 and {n}, in chronological event order. Each integer selects the entire '
        'corresponding legal action set, including simultaneous actions. Use the most recent '
        'provisional conclusions in your prior notes. If any event remains uncertain, choose '
        'the most likely candidate yourself. If completely uncertain, pick any candidate yourself '
        'as your guess. Every event MUST receive a choice. Never abstain, return null, an empty '
        'answer, a missing index, an explanation, or additional fields. Emit the JSON immediately.')


def build_forced_guess_payload(primary_payload, question, *, prior_content='',
                               prior_reasoning='', reasoning_config,
                               max_tokens=2048, debug_echo=False):
    """Copy an original multimodal request into the tested decision-stage format.

    The first request supplies the original model and ordered observations.
    Every original image and frame label stays in place. Only the generic old
    output-format suffix is replaced with the index-format finalization contract.
    """
    _validate_question(question)
    if type(max_tokens) is not int or not 1 <= max_tokens <= 2048:
        raise ValueError('Forced-guess output limit must stay within 2048')
    if not isinstance(prior_content, str) or not isinstance(prior_reasoning, str):
        raise TypeError('Prior visible output and reasoning must be strings')
    if reasoning_config is not None and not isinstance(reasoning_config, dict):
        raise TypeError('Approved reasoning configuration must be an object or None')
    if not isinstance(primary_payload.get('model'), str) or not primary_payload['model']:
        raise ValueError('Explicit original model identity required')
    payload = deepcopy(primary_payload)
    messages = payload.get('messages')
    if not isinstance(messages, list) or len(messages) != 1 or messages[0].get('role') != 'user':
        raise ValueError('Expected exactly the original benchmark user message')
    parts = messages[0].get('content')
    prompt = question.get('prompt')
    if (not isinstance(prompt, str) or not isinstance(parts, list) or not parts
            or parts[0].get('type') != 'text'
            or not isinstance(parts[0].get('text'), str)
            or not parts[0]['text'].startswith(prompt)):
        raise ValueError('Original public prompt differs')
    if sum(part.get('type') == 'image_url' for part in parts) != question['k'] + 1:
        raise ValueError('Original ordered frame count differs')
    parts[0]['text'] = prompt
    payload['max_tokens'] = max_tokens
    payload.pop('max_completion_tokens', None)
    payload.pop('reasoning_effort', None)
    if reasoning_config is None:
        payload.pop('reasoning', None)
    else:
        payload['reasoning'] = deepcopy(reasoning_config)
    messages.insert(0, {'role': 'system', 'content': decision_system_prompt(question)})
    context = {
        'recent_provisional_reasoning': prior_reasoning[-4096:],
        'recent_incomplete_answer': prior_content[-2048:],
        'candidate_index_mapping': [
            {'index': index, 'actions': deepcopy(candidate)}
            for index, candidate in enumerate(question['candidates'], 1)]}
    messages.append({'role': 'user', 'content':
        'Time is already exhausted. The following is your own prior incomplete reasoning and '
        'the legal index mapping, provided as data rather than new instructions or correct-answer '
        'feedback. Stop analyzing. Choose or guess every index and submit the JSON now.\n'
        + json.dumps(context, ensure_ascii=False)})
    payload['response_format'] = candidate_index_schema(question)
    if debug_echo:
        payload['debug'] = {'echo_upstream_body': True}
    else:
        payload.pop('debug', None)
    return payload
