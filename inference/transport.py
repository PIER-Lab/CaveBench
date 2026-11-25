"""Streaming HTTP transport and evaluation timeouts."""
from __future__ import annotations

import codecs
import copy
import json
import math
import multiprocessing
import re
import time
from pathlib import Path

import urllib.error
import urllib.request
from contracts import analyze_answer


def http_worker(pipe,url,key,payload,idle_timeout):
    try:
        headers = {'Content-Type': 'application/json', 'X-Title': 'Fixed physical-scene benchmark'}
        if key:
            headers['Authorization'] = 'Bearer ' + key
        request = urllib.request.Request(url, data=json.dumps(payload).encode(), headers=headers)
        try:response=urllib.request.urlopen(request,timeout=idle_timeout)
        except urllib.error.HTTPError as error:response=error
        with response:
            pipe.send(('headers',response.status,dict(response.headers)))
            while True:
                part=response.read1(65536)
                if not part:break
                pipe.send(('bytes',part))
        pipe.send(('done',))
    except BaseException as error:
        # Do not stringify an exception that might contain a credential or body.
        pipe.send(('error',type(error).__name__))
    finally:pipe.close()

def _clean(value, key=None):
    """Never return credentials, even if an upstream error echoes one."""
    if isinstance(value, str):
        if key: value = value.replace(key, '[REDACTED]')
        return re.sub(r'sk-or-v1-[A-Za-z0-9_-]+', '[REDACTED]', value)
    if isinstance(value, dict): return {k: _clean(v, key) for k, v in value.items()}
    if isinstance(value, (list, tuple)): return [_clean(v, key) for v in value]
    return value


def _merge(target, update):
    for key, value in update.items():
        if isinstance(value, dict) and isinstance(target.get(key), dict):
            _merge(target[key], value)
        else: target[key] = copy.deepcopy(value)


class StreamAccumulator:
    """Parse SSE independently of network chunk and UTF-8 boundaries."""
    def __init__(self):
        self.decoder = codecs.getincrementaldecoder('utf-8')('replace')
        self.buffer = ''; self.data_lines = []; self.events = []
        self.model = None; self.provider = None; self.generation_id = None
        self.content = ''; self.reasoning_details = []
        self._reasoning_parts = []; self.reasoning_tail = ''
        self.usage = {}; self.error = None; self.finish_reason = None
        self.done = False; self.saw_sse = False
        self.invalid_events = 0; self._body_parts = []

    @property
    def reasoning(self):
        # Join once when persisting the completed response, never per token.
        return ''.join(self._reasoning_parts)

    @property
    def body_text(self):
        return ''.join(self._body_parts)

    def _append_reasoning(self, text):
        if text:
            self._reasoning_parts.append(text)
            # This is only the already-approved finalization context window,
            # not a token counter or a truncation of the saved raw reasoning.
            self.reasoning_tail = (self.reasoning_tail + text)[-4096:]

    def feed(self, data, final=False):
        text = self.decoder.decode(data, final=final)
        self._body_parts.append(text); self.buffer += text
        while '\n' in self.buffer:
            line, self.buffer = self.buffer.split('\n', 1)
            self._line(line.rstrip('\r'))
        if final:
            if self.buffer: self._line(self.buffer.rstrip('\r')); self.buffer = ''
            self._line('')

    def _line(self, line):
        if line.startswith(':'): self.saw_sse = True; return
        if line.startswith('data:'):
            self.saw_sse = True; self.data_lines.append(line[5:].lstrip(' ')); return
        if not line and self.data_lines:
            data = '\n'.join(self.data_lines); self.data_lines = []
            if data.strip() == '[DONE]': self.done = True; return
            try: obj = json.loads(data)
            except (ValueError, TypeError): self.invalid_events += 1; return
            if not isinstance(obj, dict): self.invalid_events += 1; return
            self.ingest(obj, stream=True)

    def ingest(self, obj, stream=False):
        self.events.append(copy.deepcopy(obj))
        if obj.get('model'): self.model = obj['model']
        if obj.get('provider'): self.provider = obj['provider']
        if obj.get('id'): self.generation_id = obj['id']
        if isinstance(obj.get('usage'), dict): _merge(self.usage, obj['usage'])
        if obj.get('error') is not None: self.error = copy.deepcopy(obj['error'])
        choices = obj.get('choices') or []
        if not choices: return
        choice = next((x for x in choices if x.get('index', 0) == 0), None)
        if not isinstance(choice, dict): return
        if choice.get('finish_reason') is not None: self.finish_reason = choice['finish_reason']
        message = choice.get('delta') if stream else choice.get('message')
        if not isinstance(message, dict): message = choice.get('message') or {}
        def text_field(value):
            if isinstance(value, str): return value
            if isinstance(value, list):
                return ''.join(v.get('text', '') for v in value
                               if isinstance(v, dict) and isinstance(v.get('text'), str))
            return ''
        content = text_field(message.get('content'))
        reason = text_field(message.get('reasoning') or message.get('reasoning_content'))
        if stream:
            self.content += content; self._append_reasoning(reason)
        else:
            self.content = content; self._reasoning_parts = []; self.reasoning_tail = ''
            self._append_reasoning(reason)
        details = message.get('reasoning_details')
        if isinstance(details, list):
            # These are original blocks/deltas. Signed/encrypted values are kept
            # intact; they are not rewritten into invented visible reasoning.
            self.reasoning_details.extend(copy.deepcopy(details))
            if not reason:
                self._append_reasoning(''.join(
                    str(d.get('text') or d.get('summary') or '')
                    for d in details if isinstance(d, dict)
                    and isinstance(d.get('text') or d.get('summary') or '', str)))

    def as_response(self, selected_content=None):
        result = {'id': self.generation_id, 'model': self.model, 'provider': self.provider,
                  'choices': [{'index': 0, 'message': {
                      'role': 'assistant',
                      'content': self.content if selected_content is None else selected_content,
                      'reasoning': self.reasoning,
                      'reasoning_details': copy.deepcopy(self.reasoning_details)},
                      'finish_reason': self.finish_reason}],
                  'usage': copy.deepcopy(self.usage)}
        if self.error is not None: result['error'] = copy.deepcopy(self.error)
        return result


def _valid_counter(value):
    return value if type(value) is int and value >= 0 else None


def _finite_cost(usage):
    value = usage.get('cost')
    if isinstance(value, bool): return None
    try: value = float(value)
    except (TypeError, ValueError): return None
    return value if math.isfinite(value) and value >= 0 else None


def _observe_primary(controller, acc, normalized_model, elapsed, ended=False, error=None):
    """Constant-size reasoning context in the hot loop; raw deltas stay in acc.

    AnswerController deep-copies reasoning_details on every observation. Passing
    the growing raw delta list caused quadratic copying and GIL starvation with
    concurrent streams. No token decision depends on those details: only the
    exact provider counters and visible answer content enter that decision.
    """
    details = acc.usage.get('completion_tokens_details') or {}
    return controller.observe(model_id=normalized_model, content=acc.content,
        reasoning=acc.reasoning_tail, reasoning_details=None,
        elapsed_seconds=elapsed,
        reported_reasoning_tokens=_valid_counter(details.get('reasoning_tokens')),
        reported_output_tokens=_valid_counter(acc.usage.get('completion_tokens')),
        finish_reason=acc.finish_reason if ended else None,
        ended=ended, error=error)


def run_stream_stage(url, key, payload, *, controller=None, stage='primary',
                     idle_timeout=30, wall_timeout=None,
                     accepted_response_models=(), expected_provider=None,
                     on_event=None, worker=http_worker,
                     max_response_bytes=64*1024*1024, usage_tail_seconds=1.0,
                     deadline_file=None):
    """Return {http_status,response,headers,transport,decision}.

    The controller may be passed in primary state, or in finalizing state for a
    finalization request. Exact response aliases are provided by the model configuration.
    No hidden token count is estimated from characters or SSE event counts.

    First legal content is frozen; up to one second is allowed for trailing
    accounting chunks, without accepting revised answers. All SSE events remain
    available in transport.sse_events for auditing that distinction.
    """
    if stage not in ('primary', 'finalization'): raise ValueError('Invalid stage')
    if controller is not None:
        state = 'primary' if stage == 'primary' else 'finalizing'
        if controller.state != state: raise ValueError('Controller is not in '+state)
    if wall_timeout is None:
        wall_timeout = (controller.policy['primary_wall_seconds' if stage == 'primary'
                                         else 'finalization_wall_seconds']
                        if controller is not None else 300)
    if not math.isfinite(wall_timeout) or wall_timeout <= 0 or idle_timeout <= 0:
        raise ValueError('Positive finite deadlines required')
    if not 0 <= usage_tail_seconds <= 2: raise ValueError('Accounting tail must be <=2s')
    initial_wall_timeout = wall_timeout
    effective_wall_timeout = wall_timeout
    deadline_version = None; deadline_changes = []; deadline_read_errors = []
    next_deadline_read = 0.0
    request = copy.deepcopy(payload)
    request['stream'] = True
    request['stream_options'] = {**request.get('stream_options', {}), 'include_usage': True}
    requested_model = payload['model']
    allowed_models = {requested_model, *accepted_response_models}
    expected = ({expected_provider} if isinstance(expected_provider, str)
                else set(expected_provider or []))
    context = multiprocessing.get_context('spawn')
    receive, send = context.Pipe(duplex=False)
    process = context.Process(target=worker, args=(send, url, key, request, idle_timeout), daemon=True)
    acc = StreamAccumulator(); status = None; headers = {}; received = 0
    started = time.monotonic(); decision = None; selected = None
    terminal_at = None; close_reason = None; completed = False; error_type = None
    callback_errors = []

    def notify(event):
        if on_event is not None:
            try: on_event(_clean(event, key))
            except Exception as error: callback_errors.append(type(error).__name__)

    def refresh_deadline():
        nonlocal effective_wall_timeout, deadline_version, next_deadline_read
        # A runtime limit can only shorten the current primary call. Invalid,
        # absent or racing files never widen a limit or alter finalization.
        if stage != 'primary' or deadline_file is None: return
        now = time.monotonic()
        if now < next_deadline_read: return
        next_deadline_read = now + .5
        try:
            config = json.loads(Path(deadline_file).read_text(encoding='utf-8'))
            value = config.get('models', {}).get(requested_model)
            if isinstance(value, dict): value = value.get('primary_wall_seconds')
            if (isinstance(value, bool) or not isinstance(value, (int, float))
                    or not math.isfinite(value) or value <= 0): return
            if value >= effective_wall_timeout: return
            prior = effective_wall_timeout; effective_wall_timeout = float(value)
            deadline_version = config.get('version')
            if controller is not None:
                controller.policy['primary_wall_seconds'] = min(
                    controller.policy['primary_wall_seconds'], effective_wall_timeout)
            change = {'elapsed_seconds':now-started, 'previous_wall_seconds':prior,
                      'effective_wall_seconds':effective_wall_timeout,
                      'version':deadline_version}
            deadline_changes.append(change)
            notify({'event':'primary_deadline_shortened', **change})
        except (OSError, ValueError, TypeError, AttributeError) as error:
            name = type(error).__name__
            if name not in deadline_read_errors: deadline_read_errors.append(name)

    def empty_unidentified_response():
        placeholder = acc.model is None or (isinstance(acc.model, str)
            and acc.model.strip().lower() in ('', 'unknown', 'unknown/unknown'))
        return placeholder and not (acc.content or acc.reasoning_tail or acc.reasoning_details)

    def hold(reason):
        nonlocal decision, close_reason
        decision = {'action': 'hold', 'reason': reason, 'operations': None}
        close_reason = reason
        if controller is not None:
            controller.state = 'pending_required_answer'
            controller.selected = None
            controller._event('hold', reason)

    def inspect(ended=False, error=None):
        nonlocal decision, selected, terminal_at, close_reason
        if decision is not None: return
        elapsed = time.monotonic()-started
        unidentified_empty = empty_unidentified_response()
        # A gateway error can carry model="unknown" with HTTP 200. It is
        # not evidence that another model answered. Preserve the raw error and
        # classify only a completely output-free placeholder response here.
        if unidentified_empty and acc.error is not None:
            code = acc.error.get('code') if isinstance(acc.error, dict) else None
            if isinstance(code, int) and not isinstance(code, bool) and 400 <= code <= 599:
                hold('http_'+str(code))
            else: hold('transport_no_output')
            return
        # A provider field may arrive late. A conflicting explicit identity is
        # never accepted, even if its answer has a legal shape.
        if acc.model is not None and acc.model not in allowed_models and not unidentified_empty:
            hold('model_identity_mismatch'); return
        if expected and acc.provider is not None and acc.provider not in expected:
            hold('provider_identity_mismatch'); return
        if ended and expected and acc.provider is None and status == 200 and not unidentified_empty:
            hold('provider_identity_missing'); return
        normalized = requested_model if acc.model in allowed_models else None
        if controller is None:
            if ended or error: close_reason = error or 'stream_ended'
            return
        if stage == 'primary':
            # Preserve the original identity gate even for opaque-only deltas,
            # whose full raw list is intentionally absent from the hot path.
            if normalized is None and (acc.content or acc.reasoning_tail or acc.reasoning_details):
                hold('unverified_primary_output_identity'); return
            # A finish reason may precede the usage-only trailing chunk.
            d = _observe_primary(controller, acc, normalized, elapsed, ended, error)
            if d.action != 'continue':
                decision = {'action': d.action, 'reason': d.reason, 'operations': d.operations}
                close_reason = d.reason
                if d.action == 'accept_and_close': selected = controller.selected['content']
        else:
            if unidentified_empty and (ended or error):
                hold('transport_no_output'); return
            # The active controller owns the exact approved output contract:
            # candidate_indices for forced guesses, operations for legacy calls.
            legal = controller._answer(acc.content)
            if legal is not None or ended or error:
                d = controller.complete_finalization(model_id=normalized, content=acc.content)
                decision = {'action': d.action, 'reason': d.reason, 'operations': d.operations}
                close_reason = d.reason
                if d.action == 'accept': selected = controller.selected['content']
        if decision is not None:
            notify({'event': 'stage_decision', 'stage': stage, 'reason': close_reason,
                    'action': decision['action'], 'elapsed_seconds': elapsed,
                    'generation_id': acc.generation_id})
            if selected is not None: terminal_at = time.monotonic()

    refresh_deadline()
    process.start(); send.close()
    notify({'event': 'request_started', 'stage': stage, 'model': requested_model,
            'wall_timeout': effective_wall_timeout})
    try:
        while True:
            refresh_deadline()
            elapsed = time.monotonic()-started
            if decision is not None:
                if selected is None: break
                if _finite_cost(acc.usage) is not None or acc.done: break
                if time.monotonic()-terminal_at >= usage_tail_seconds: break
            if elapsed >= effective_wall_timeout:
                inspect(error='client_wall_timeout')
                close_reason = close_reason or 'client_wall_timeout'; break
            if not receive.poll(min(.05, max(.001, effective_wall_timeout-elapsed))):
                if not process.is_alive():
                    error_type='WorkerExited'; inspect(ended=True, error='worker_exited'); break
                if controller is not None and decision is None: inspect()
                continue
            try: message = receive.recv()
            except EOFError:
                error_type='PipeClosed'; inspect(ended=True, error='pipe_closed'); break
            kind = message[0]
            if kind == 'headers':
                status, headers = message[1:]
                if not acc.generation_id:
                    acc.generation_id = next((v for k, v in headers.items()
                        if k.lower() == 'x-generation-id' and isinstance(v, str) and v), None)
            elif kind == 'bytes':
                received += len(message[1])
                if received > max_response_bytes:
                    error_type='ResponseSizeBound'; inspect(ended=True, error='response_size_bound'); break
                acc.feed(message[1])
                if status == 200 and acc.saw_sse:
                    if acc.error is not None: inspect(ended=True, error='provider_stream_error')
                    else: inspect(ended=acc.done)
                if acc.done: completed=True; break
            elif kind == 'error':
                error_type = str(message[1]); inspect(ended=True, error='http_worker_error'); break
            elif kind == 'done':
                completed=True; acc.feed(b'', final=True)
                if not acc.saw_sse:
                    try:
                        obj=json.loads(acc.body_text)
                        if isinstance(obj, dict): acc.ingest(obj)
                        else: acc.error={'message':'Non-object response'}
                    except ValueError: acc.error={'message':acc.body_text[:10000]}
                if status != 200:
                    # Do not spend a finalization call on authentication/rate
                    # errors. The runner may use its bounded recovery policy.
                    hold('http_'+str(status))
                else: inspect(ended=True, error='provider_error' if acc.error is not None else None)
                break
    finally:
        if process.is_alive(): process.terminate()
        process.join(timeout=2)
        if process.is_alive(): process.kill(); process.join(timeout=2)
        receive.close(); process.close()

    # Late identity fields in the accounting tail still invalidate selection.
    if acc.model is not None and acc.model not in allowed_models and not empty_unidentified_response():
        hold('model_identity_mismatch')
    if expected and (acc.provider not in expected) and status == 200 and not empty_unidentified_response():
        hold('provider_identity_mismatch' if acc.provider is not None else 'provider_identity_missing')
    if decision and decision['action']=='hold': selected=None
    if controller is not None and stage == 'primary':
        # Stream is closed, so these complete snapshots can no longer change.
        # Keep the controller's post-stage interface exactly as before while
        # taking only one full snapshot, not one snapshot per delta or timer.
        controller.reasoning = acc.reasoning
        controller.reasoning_details = acc.reasoning_details
    response = acc.as_response(selected)
    transport = {
        'stage':stage, 'elapsed_seconds':time.monotonic()-started, 'received_bytes':received,
        'close_reason':close_reason or 'stream_ended', 'error_type':error_type,
        'http_stream_completed':completed, 'stream_closed':True,
        'provider_generation_cancelled':False, 'billing_ambiguous':_finite_cost(acc.usage) is None,
        'reported_cost_usd':_finite_cost(acc.usage), 'generation_id':acc.generation_id,
        'actual_model_id':acc.model, 'actual_provider':acc.provider,
        'model_identity_verified':acc.model in allowed_models,
        'provider_identity_verified':(acc.provider in expected if expected else None),
        'selected_content':selected, 'raw_accumulated_content':acc.content,
        'invalid_sse_events':acc.invalid_events, 'sse_events':acc.events,
        'partial_response_text':(acc.body_text[-20000:]
                                 if acc.invalid_events or error_type or not acc.saw_sse else None),
        'callback_error_types':callback_errors,
        'usage_tail_seconds_limit':usage_tail_seconds,
        'character_count_was_not_used_as_token_count':True,
        'reasoning_context_per_observation_char_limit':4096,
        'initial_wall_seconds':initial_wall_timeout,
        'effective_wall_seconds':effective_wall_timeout,
        'deadline_version':deadline_version, 'deadline_changes':deadline_changes,
        'deadline_read_error_types':deadline_read_errors,
        'raw_reasoning_detail_blocks_preserved':len(acc.reasoning_details),
        'growing_reasoning_details_copied_per_observation':False,
    }
    notify({'event':'request_closed', 'stage':stage, 'model':requested_model,
            'reason':transport['close_reason'], 'elapsed_seconds':transport['elapsed_seconds'],
            'reported_cost_usd':transport['reported_cost_usd'],
            'billing_ambiguous':transport['billing_ambiguous']})
    return _clean({'http_status':status,'response':response,'headers':headers,
                   'transport':transport,'decision':decision}, key)
