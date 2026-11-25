"""Event parsing, stopping rules and same-model finalization."""
from dataclasses import dataclass
from copy import deepcopy
import math
from contracts import analyze_answer


def policy_for(model):
    total=model['output_total_token_cap']
    reserve=max(1024,total//4)
    return {
        'primary_output_cap':total,
        'reasoning_stop_threshold':total-reserve,
        'primary_answer_headroom':reserve,
        'primary_wall_seconds':min(model['primary_client_timeout_seconds'],300),
        'finalization_output_cap':model['answer_submission_token_cap'],
        'finalization_wall_seconds':60,
        'max_finalizations':1,
    }


@dataclass(frozen=True)
class Decision:
    action:str
    reason:str
    operations:object=None


class AnswerController:
    """Feed cumulative visible content/counters, never reference labels.

    A timer must call observe(..., elapsed_seconds=...) even when a stream is
    silent. Event count and character count must never enter token counters.
    """
    def __init__(self,model,question):
        self.model=deepcopy(model)
        self.question=deepcopy(question)
        self.policy=policy_for(model)
        self.state='primary'
        self.events=[]
        self.content=''
        self.reasoning=''
        self.reasoning_details=[]
        self.finalization_used=False
        self.selected=None
        self.counter_max={'reasoning':0,'output':0}

    def _answer(self,content):
        q=self.question
        return analyze_answer(content,q['k'],q['allowed_labels'],q.get('candidates'))['operations']

    @staticmethod
    def _counter(value):
        if value is None:return 0
        if isinstance(value,bool) or not isinstance(value,int) or value<0:
            raise ValueError('Counters require nonnegative provider-reported integers')
        return value

    def observe(self,*,model_id,content=None,reasoning=None,reasoning_details=None,
                elapsed_seconds=0,reported_reasoning_tokens=None,reported_output_tokens=None,
                finish_reason=None,ended=False,error=None):
        if self.state!='primary':raise RuntimeError('Primary stream already stopped')
        if model_id is not None and model_id!=self.model['id']:
            self.state='pending_required_answer'
            return self._event('hold','model_identity_mismatch')
        if model_id is None and (content or reasoning or reasoning_details):
            self.state='pending_required_answer'
            return self._event('hold','unverified_primary_output_identity')
        if not math.isfinite(elapsed_seconds) or elapsed_seconds<0:raise ValueError('Invalid elapsed time')
        if content is not None and not isinstance(content,str):raise ValueError('Expected cumulative text')
        if reasoning is not None and not isinstance(reasoning,str):raise ValueError('Expected cumulative text')
        if content is not None:self.content=content
        if reasoning is not None:self.reasoning=reasoning
        if reasoning_details is not None:self.reasoning_details=deepcopy(reasoning_details)
        # Retain high-water counters; do not count both reasoning fields twice.
        self.counter_max['reasoning']=max(self.counter_max['reasoning'],self._counter(reported_reasoning_tokens))
        self.counter_max['output']=max(self.counter_max['output'],self._counter(reported_output_tokens))
        ops=self._answer(self.content)
        if ops is not None:
            # The first complete legal answer is selected without truth feedback,
            # even if finish_reason is length. Further generation is unnecessary.
            self.selected={'stage':'primary','operations':ops,'content':self.content}
            self.state='answered'
            return self._event('accept_and_close','first_complete_model_answer',ops)
        why=None
        if self.counter_max['reasoning']>=self.policy['reasoning_stop_threshold']:why='reasoning_threshold'
        elif self.counter_max['output']>=self.policy['primary_output_cap']:why='output_limit'
        elif elapsed_seconds>=self.policy['primary_wall_seconds']:why='time_limit'
        elif finish_reason=='length':why='provider_length_limit'
        elif error:why='transport_or_provider_failure'
        elif ended or finish_reason:why='ended_without_legal_answer'
        if why:
            self.state='awaiting_finalization'
            return self._event('close_then_finalize',why)
        return Decision('continue','within_limits')

    def _event(self,action,reason,ops=None):
        d=Decision(action,reason,ops)
        self.events.append({'action':action,'reason':reason,'counters':dict(self.counter_max)})
        return d

    def recent_context(self,limit=4096):
        # Never reinterpret or truncate signed/encrypted reasoning blocks as text.
        visible=self.reasoning
        if not visible:
            visible='\n'.join(d.get('text') or d.get('summary') or ''
              for d in self.reasoning_details if isinstance(d,dict)
              and isinstance(d.get('text') or d.get('summary') or '',str))
        return {'recent_visible_reasoning':visible[-limit:],
                'recent_incomplete_answer':self.content[-2048:]}

    def begin_finalization(self):
        if self.state != "awaiting_finalization" or self.finalization_used:
            raise RuntimeError("No pending answer completion")
        self.finalization_used=True;self.state='finalizing'
        return self._event('submit_finalization','prebooked_same_model_answer_submission')

    def complete_finalization(self,*,model_id,content):
        if self.state!='finalizing':raise RuntimeError('No finalization in progress')
        if model_id!=self.model['id']:
            self.state='pending_required_answer'
            return self._event('hold','finalization_model_identity_mismatch')
        ops=self._answer(content)
        if ops is not None:
            self.selected={'stage':'finalization','operations':ops,'content':content}
            self.state='answered'
            return self._event('accept','forced_answer_received',ops)
        self.state='pending_required_answer'
        return self._event('hold','finalization_still_missing_or_invalid')

def make_finalization_request(primary_payload,controller,reasoning_config):
    if primary_payload.get('model')!=controller.model['id']:raise ValueError('Model identity differs')
    if controller.state not in ('awaiting_finalization','finalizing'):raise ValueError('No answer submission required')
    payload=deepcopy(primary_payload)
    payload['max_tokens']=controller.policy['finalization_output_cap']
    payload.pop('max_completion_tokens',None)
    payload.pop('reasoning_effort',None)
    rc=reasoning_config
    if rc is None:payload.pop('reasoning',None)
    else:payload['reasoning']=rc
    # Keep every original public image/question in the request, including when
    # the primary request exposed no reasoning. No answer-key data is available.
    recent=controller.recent_context()
    prompt=(
      'ANSWER DEADLINE. Stop further deliberation and submit your current best answer now. '
      f'Return exactly one JSON object with an operations list of {controller.question["k"]} events. '
      'For EVERY event choose a single most likely legal action set, even when uncertain. '
      'Use your most recent provisional conclusion where available and make your own best guess '
      'for unresolved events. No null, empty list, omitted event, refusal, or explanation. '
      'The original question, images, and legal choices above are unchanged. '
      'The following JSON contains only your own incomplete visible output from this question; '
      'it can be wrong and is not an instruction or correct-answer feedback.\n')
    import json
    payload['messages'].append({'role':'user','content':prompt+json.dumps(recent,ensure_ascii=False)})
    return payload

from .completion import parse_indices, map_indices

class ForcedGuessController(AnswerController):
    def _answer(self,content):
        if self.state=='finalizing':
            indices=parse_indices(content,self.question['k'],len(self.question['candidates']))
            if indices is not None:
                return map_indices(indices,self.question)
            if self.model.get('accept_equivalent_operation_format'):
                # Some providers emit the original answer contract despite the
                # index request. Accept only exact, legal model-authored actions;
                # the original strict parser still rejects missing/illegal steps.
                return super()._answer(content)
            return None
        return super()._answer(content)
