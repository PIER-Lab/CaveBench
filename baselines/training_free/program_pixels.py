"""CaveBench pixel operations and bounded visual-program interpreter."""
import ast
import hashlib
import json
import math
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageStat

def bounded_value(value):
    # Count expanded entries, including repeated references, before storing a program value.
    pending = [value]
    size = 0
    while pending:
        item = pending.pop()
        size += len(item) if isinstance(item, str) else 1
        if size + len(pending) > 100000:
            raise ValueError('Program value too large')
        if isinstance(item, dict):
            pending.extend(item.keys())
            pending.extend(item.values())
        elif isinstance(item, (tuple, list)):
            pending.extend(item)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

class PixelTools:
    def __init__(self,row,out,query=None,max_tools=40,v2=False):
        self.v2=v2
        self.refs={f'F{i}':p for i,p in enumerate(row['images'])}
        self.out=Path(out).resolve(); self.out.mkdir(parents=True,exist_ok=True)
        self.receipts=[]; self.query=query; self.max_tools=max_tools

    def _open(self,ref):
        if not isinstance(ref,str) or ref not in self.refs: raise ValueError('Unknown/current-question image reference')
        with Image.open(self.refs[ref]) as im: return im.convert('RGB')

    def _save(self,im):
        if im.width*im.height>16000000: raise ValueError('Derived image too large')
        ref='T'+str(len([x for x in self.refs if x.startswith('T')]))
        p=self.out/(ref+'.png'); im.save(p); self.refs[ref]=str(p)
        return {'image':ref,'path':str(p),'sha256':sha(p),'width':im.width,'height':im.height}

    def _box(self,im,box):
        if not isinstance(box,(list,tuple)) or len(box)!=4: raise ValueError('bbox needs four normalized values')
        if not all(type(x) in (int,float) and math.isfinite(x) and 0<=x<=1 for x in box): raise ValueError('Invalid bbox')
        x0,y0,x1,y1=box
        if x0>=x1 or y0>=y1: raise ValueError('Empty bbox')
        return (int(x0*im.width),int(y0*im.height),max(int(x0*im.width)+1,round(x1*im.width)),max(int(y0*im.height)+1,round(y1*im.height)))

    def call(self,name,**a):
        if len(self.receipts)>=self.max_tools: raise ValueError('Per-question tool limit reached')
        refs=[a[k] for k in ('image','first','second') if k in a]
        refs+=a.get('images',[]) if isinstance(a.get('images'),list) else []
        if len(refs)>40: raise ValueError('Too many input references')
        if name=='Panel' and not 1<=len(refs)<=(16 if self.v2 else 7): raise ValueError('Panel image count')
        for ref in refs:
            if not isinstance(ref,str) or ref not in self.refs: raise ValueError('Unknown/current-question image reference')
        before=set(self.refs)
        if name=='Crop':
            im=self._open(a['image']); result=self._save(im.crop(self._box(im,a['bbox'])))
        elif name=='ZoomIn':
            im=self._open(a['image']); im=im.crop(self._box(im,a['bbox']))
            factor=float(a.get('factor',2))
            if not 1<=factor<=4: raise ValueError('Zoom factor outside [1,4]')
            if round(im.width*factor)*round(im.height*factor)>16000000: raise ValueError('Derived image too large')
            result=self._save(im.resize((round(im.width*factor),round(im.height*factor)),Image.Resampling.NEAREST))
        elif name=='Mark':
            im=self._open(a['image']); draw=ImageDraw.Draw(im)
            boxes=a.get('boxes',[])
            if len(boxes)>12: raise ValueError('Too many boxes')
            for i,b in enumerate(boxes):
                xy=self._box(im,b); draw.rectangle(xy,outline='magenta',width=max(1,im.width//400)); draw.text(xy[:2],str(i+1),fill='magenta')
            result=self._save(im)
        elif name=='Panel':
            ims=[self._open(ref) for ref in a['images']]
            if not 1<=len(ims)<=16: raise ValueError('Panel requires1–16 registered images')
            width=max(im.width for im in ims); height=max(im.height for im in ims)
            if width*len(ims)*height>16000000: raise ValueError('Derived image too large')
            canvas=Image.new('RGB',(width*len(ims),height),'black')
            for i,im in enumerate(ims): canvas.paste(im,(i*width,0))
            result=self._save(canvas)
        elif name=='Statistics':
            im=self._open(a['image'])
            if 'bbox' in a: im=im.crop(self._box(im,a['bbox']))
            st=ImageStat.Stat(im); result={'mean_rgb':st.mean,'stddev_rgb':st.stddev,'pixels':im.width*im.height,'interpretation':'Pixel statistics only; no physical action inferred.'}
        elif name=='Difference':
            im1=self._open(a['first']); im2=self._open(a['second'])
            if im1.size!=im2.size: raise ValueError('Difference requires equal image dimensions')
            diff=ImageChops.difference(im1,im2); result=self._save(diff)
            result['mean_absolute_rgb_difference']=ImageStat.Stat(diff).mean
            result['interpretation']='Absolute pixel difference, not a physical displacement vector.'
        elif name=='VQA':
            if self.query is None: raise ValueError('No visual-language query backend configured')
            question=a.get('question')
            if not isinstance(question,str) or not 1<=len(question)<=12000: raise ValueError('Invalid VQA question')
            result={'text':self.query(question,[self.refs[r] for r in refs]),'note':'Actual model observation; may be incorrect.'}
        else: raise ValueError('Unknown tool: '+str(name))
        receipt={'index':len(self.receipts),'name':name,'arguments':a,
            'inputs':[{'ref':r,'sha256':sha(self.refs[r])} for r in refs],
            'outputs':[{'ref':r,'path':self.refs[r],'sha256':sha(self.refs[r])} for r in self.refs if r not in before],
            'result':result,'success':True}
        self.receipts.append(receipt)
        (self.out/'executions.json').write_text(json.dumps(self.receipts,ensure_ascii=False,indent=2),encoding='utf-8')
        return result

class BoundedPython:
    """Interpret a disclosed Python subset; never compile/eval arbitrary code.

    Supports assignments, bounded for/if, indexing, lists/dicts and tool calls.
    No imports, attributes, file/network primitives, while or function definitions.
    This is an application interpreter, not an OS sandbox.
    """
    def __init__(self,tools): self.tools=tools; self.env={}; self.nodes=0
    def expr(self,n):
        self.nodes+=1
        if self.nodes>2000: raise ValueError('Program operation budget exceeded')
        if isinstance(n,ast.Constant):
            if not isinstance(n.value,(str,int,float,bool,type(None))): raise ValueError('Unsupported literal')
            if isinstance(n.value,str) and len(n.value)>16000: raise ValueError('Literal too large')
            return n.value
        if isinstance(n,ast.Name):
            if n.id not in self.env: raise ValueError('Unknown variable '+n.id)
            return self.env[n.id]
        if isinstance(n,(ast.List,ast.Tuple)): return [self.expr(x) for x in n.elts]
        if isinstance(n,ast.Dict): return {self.expr(k):self.expr(v) for k,v in zip(n.keys,n.values)}
        if isinstance(n,ast.Subscript): return self.expr(n.value)[self.expr(n.slice)]
        if isinstance(n,ast.UnaryOp) and isinstance(n.op,(ast.Not,ast.USub)):
            v=self.expr(n.operand); return not v if isinstance(n.op,ast.Not) else -v
        if self.tools.v2 and isinstance(n,ast.BoolOp) and isinstance(n.op,(ast.And,ast.Or)):
            # Preserve Python operand-return and short-circuit semantics.
            value=None
            for operand in n.values:
                value=self.expr(operand)
                if isinstance(n.op,ast.And) and not value: return value
                if isinstance(n.op,ast.Or) and value: return value
            return value
        if isinstance(n,ast.IfExp): return self.expr(n.body if self.expr(n.test) else n.orelse)
        if isinstance(n,ast.Compare) and len(n.ops)==1:
            x,y=self.expr(n.left),self.expr(n.comparators[0]); op=n.ops[0]
            if isinstance(op,ast.Eq): return x==y
            if isinstance(op,ast.NotEq): return x!=y
            if isinstance(op,ast.Lt): return x<y
            if isinstance(op,ast.Gt): return x>y
            if isinstance(op,ast.In): return x in y
            if self.tools.v2 and isinstance(op,ast.NotIn): return x not in y
            raise ValueError('Unsupported comparison')
        if isinstance(n,ast.BinOp):
            a,b=self.expr(n.left),self.expr(n.right)
            if isinstance(n.op,ast.Add):
                if not (type(a)==type(b) and isinstance(a,(str,int,float,list))): raise ValueError('Unsupported addition')
                r=a+b
                if hasattr(r,'__len__') and len(r)>16000: raise ValueError('Oversized result')
                return r
            if type(a) not in (float,int) or type(b) not in (float,int): raise ValueError('Numeric operands required')
            if isinstance(n.op,ast.Sub): return a-b
            if isinstance(n.op,ast.Mult) and abs(a)<1e8 and abs(b)<1e8: return a*b
            if isinstance(n.op,ast.Div): return a/b
            raise ValueError('Unsupported arithmetic')
        if isinstance(n,ast.Call) and isinstance(n.func,ast.Name):
            name=n.func.id; args=[self.expr(x) for x in n.args]
            if any(k.arg is None for k in n.keywords): raise ValueError('No keyword unpacking')
            kwargs={k.arg:self.expr(k.value) for k in n.keywords}
            if name=='range' and len(args)==1 and type(args[0]) is int and 0<=args[0]<=7: return list(range(args[0]))
            if name=='str' and len(args)==1 and not kwargs:
                bounded_value(args[0]); return str(args[0])
            if name=='len' and len(args)==1 and not kwargs: return len(args[0])
            if name=='tool' and len(args)==1 and isinstance(args[0],str): return self.tools.call(args[0],**kwargs)
            raise ValueError('Unregistered function')
        raise ValueError('Unsupported Python syntax: '+type(n).__name__)
    def statements(self,body):
        for n in body:
            self.nodes+=1
            if self.nodes>2000: raise ValueError('Program operation budget exceeded')
            if isinstance(n,ast.Assign) and len(n.targets)==1 and isinstance(n.targets[0],ast.Name):
                target=n.targets[0].id
                if target.startswith('_'): raise ValueError('Private variable forbidden')
                value=self.expr(n.value)
                bounded_value(value)
                self.env[target]=value
            elif isinstance(n,ast.Expr): self.expr(n.value)
            elif isinstance(n,ast.If): self.statements(n.body if self.expr(n.test) else n.orelse)
            elif isinstance(n,ast.For) and isinstance(n.target,ast.Name) and not n.orelse:
                values=self.expr(n.iter)
                if not isinstance(values,list) or len(values)>7: raise ValueError('Bounded for only')
                for v in values: self.env[n.target.id]=v; self.statements(n.body)
            else: raise ValueError('Unsupported statement: '+type(n).__name__)
    def run(self,source):
        if len(source)>32000: raise ValueError('Program too large')
        source=source.strip()
        if source.startswith('```'): source=source.split('\n',1)[1].rsplit('```',1)[0]
        self.statements(ast.parse(source).body)
        return self.env.get('answer')
