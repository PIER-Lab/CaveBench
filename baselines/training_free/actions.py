"""CaveBench answer formats used by the training-free methods."""
import json
from contracts import parse_answer, valid_operations

def parse_action(text, q):
    """Strict envelope, with original operations-only format accepted as Finish."""
    if not isinstance(text, str):
        raise ValueError('Action content is not text')
    def unique(pairs):
        d = {}
        for k, v in pairs:
            if k in d:
                raise ValueError('Duplicate key')
            d[k] = v
        return d
    obj = json.loads(text, object_pairs_hook=unique)
    if not isinstance(obj, dict):
        raise ValueError('Action must be a JSON object')
    action = obj.get('action', 'finish' if set(obj) == {'operations'} else None)
    if action == 'finish':
        if set(obj) - {'action', 'operations', 'note'}:
            raise ValueError('Unexpected final fields')
        normalized = json.dumps({'operations': obj.get('operations')}, ensure_ascii=False)
        ops = parse_answer(normalized, q['k'], q['allowed_labels'], q.get('candidates'))
        if ops is None:
            raise ValueError('Final operations must contain exactly k legal nonempty events')
        return {'action': 'finish', 'operations': ops, 'note': obj.get('note', '')}
    if action not in ('crop_compare', 'frame_difference', 'measure_translation'):
        raise ValueError('Unknown action; choose one documented tool or finish')
    if set(obj) - {'action', 'arguments', 'note'} or not isinstance(obj.get('arguments'), dict):
        raise ValueError('Tool action requires an arguments object')
    return {'action': action, 'arguments': obj['arguments'], 'note': obj.get('note', '')}

def legal_answer(value, row):
    if isinstance(value, str):
        ops=parse_answer(value,row['k'],row['allowed_labels'],row.get('candidates'))
        return {'operations':ops} if ops is not None else None
    if not isinstance(value,dict) or set(value)!={'operations'}:return None
    ops=value['operations']
    return {'operations':ops} if valid_operations(ops,row['k'],row['allowed_labels'],row.get('candidates')) else None

def candidate_schema(row):
 return {'type':'json_schema','json_schema':{'name':'bounded_final_candidate_indices','strict':True,'schema':{'type':'object','properties':{'candidate_indices':{'type':'array','minItems':row['k'],'maxItems':row['k'],'items':{'type':'integer','minimum':0,'maximum':len(row['candidates'])-1}}},'required':['candidate_indices'],'additionalProperties':False}}}

def map_indices(raw,row):
 def unique(pairs):
  value={}
  for k,v in pairs:
   if k in value:raise ValueError('Duplicate JSON object key')
   value[k]=v
  return value
 try:value=json.loads(raw,object_pairs_hook=unique)
 except (ValueError,TypeError):return None
 if not isinstance(value,dict) or set(value)!={'candidate_indices'}:return None
 indices=value['candidate_indices']
 if not isinstance(indices,list) or len(indices)!=row['k'] or any(type(i)!=int or i<0 or i>=len(row['candidates']) for i in indices):return None
 return {'operations':[list(row['candidates'][i]) for i in indices]}

def answer_schema(row):
    return {'type':'json_schema','json_schema':{'name':'operation_answer','strict':True,'schema':{'type':'object','properties':{'operations':{'type':'array','minItems':row['k'],'maxItems':row['k'],'items':{'type':'array','minItems':1,'items':{'type':'string','enum':row['allowed_labels']}}}},'required':['operations'],'additionalProperties':False}}}
