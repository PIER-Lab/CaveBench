'use strict';

// A history entry describes the view before the reader leaves it, including
// controls that have no fragment of their own (sort, units, open panels).
(() => {
  const key='caveReaderV1';
  const entries=new Map();
  let current=history.state?.[key] || {index:0};
  let restoring=false, generation=0, initialRestore=Boolean(current.view);
  const back=document.getElementById('view-back');
  const frame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
  history.scrollRestoration='manual';

  function store(persist=false) {
    entries.set(current.index,current);
    if (persist) history.replaceState({...history.state,[key]:current},'');
    if (back) back.hidden=current.index===0;
  }
  function checkpoint(persist=false) {
    if (restoring || !window.cavePageState) return;
    current.view=window.cavePageState.capture();
    current.x=window.scrollX; current.y=window.scrollY;
    store(persist);
  }
  function push(url,extras={},keepPreviousView=false) {
    if (!keepPreviousView || !current.view) checkpoint(true);
    else { current.x=scrollX; current.y=scrollY; store(true); }
    const next={index:current.index+1,atlas:current.atlas,overlay:current.overlay,...extras};
    history.pushState({[key]:next},'',url);
    current=next; entries.set(next.index,next);
    if (back) back.hidden=false;
    // Native select/summary and button handlers run after the capture listener.
    queueMicrotask(()=>{ if (current===next) checkpoint(); });
    requestAnimationFrame(()=>{ if (current===next) checkpoint(true); });
  }
  async function restore(entry) {
    const token=++generation;
    const valid=()=>token===generation;
    restoring=true;
    current=entries.get(entry.index) || entry;
    if (back) back.hidden=current.index===0;
    try {
      if (current.view) await window.cavePageState.restore(current.view,valid);
      if (!valid()) return;
      await frame(); await frame();
      if (valid()) window.scrollTo({left:current.x || 0,top:current.y || 0,behavior:'instant'});
    } finally {
      if (valid()) { restoring=false; checkpoint(); }
    }
  }
  back?.addEventListener('click',()=>{ if (current.index>0) history.back(); });
  window.addEventListener('popstate',event=>{
    const previous=event.state?.[key];
    if (previous) restore(previous);
    else { current={index:current.index+1}; requestAnimationFrame(()=>checkpoint(true)); }
  });
  window.addEventListener('scroll',()=>{
    if (!restoring) { current.x=scrollX; current.y=scrollY; }
  },{passive:true});
  window.addEventListener('pagehide',()=>checkpoint(true));
  document.addEventListener('timeupdate',event=>{
    if (!restoring && current.view && event.target.matches('.overview-video')) current.view.film=window.caveFilmState?.capture();
  },true);

  function follow(link) {
    const url=new URL(link.href);
    const oldURL=location.href;
    if (link.closest('.reader-actions') && url.hash==='#viewer' && Number.isInteger(current.atlas)) {
      history.go(current.atlas-current.index);
      return;
    }
    const fromAtlas=link.matches('.specimen');
    push(url,{atlas:fromAtlas ? current.index : undefined,overlay:undefined});
    // pushState changes the address without firing hashchange. Route it using
    // the same handlers as an address pasted directly into the browser.
    window.dispatchEvent(new HashChangeEvent('hashchange',{oldURL,newURL:url.href}));
    document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({block:'start',behavior:'instant'});
  }
  document.addEventListener('click',event=>{
    if (restoring || event.defaultPrevented || event.button!==0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target=event.target.closest('a,button,summary');
    if (!target) return;
    if (target.matches('a[href^="#"]') && !target.hasAttribute('download') && target.target!=='_blank') {
      event.preventDefault(); follow(target); return;
    }
    if (target.matches('a.zoom') && typeof document.querySelector('#lightbox')?.showModal==='function') {
      push(location.href,{overlay:current.index}); return;
    }
    if (target.getAttribute('aria-pressed')==='true') return;
    if (target.matches('summary,#image-scale,#prev,#next,#results button,[data-events]')) {
      push(location.href);
    }
  },true);
  window.caveReadingHistory={
    get restoring() { return restoring; },
    checkpoint,
    ready() {
      if (initialRestore) { initialRestore=false; restore(current); }
      else checkpoint(true);
    },
    dismissImage() {
      if (!Number.isInteger(current.overlay)) return false;
      history.go(current.overlay-current.index); return true;
    }
  };
})();
