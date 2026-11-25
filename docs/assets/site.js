'use strict';

let cases = [];
const $ = selector => document.querySelector(selector);
const node = (tag, value, className) => {
  const item = document.createElement(tag);
  if (value !== undefined) item.textContent = value;
  if (className) item.className = className;
  return item;
};
const pathFor = (item, file) => 'examples/' + encodeURIComponent(item.id) + '/' + file.split('/').map(encodeURIComponent).join('/');
const labels = {'Thermal':'Thermal physics','EM':'Electromagnetism'};
const nameFor = domain => labels[domain] || domain;

function whenNear(element, run, margin='200px 0px') {
  if (!element) return;
  if (!('IntersectionObserver' in window)) { run(); return; }
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); run(); }
  }, {rootMargin:margin});
  observer.observe(element);
}
document.querySelectorAll('img[data-lazy-src]').forEach(img => whenNear(img, () => {
  if (img.dataset.lazySrcset) {
    img.srcset = img.dataset.lazySrcset;
    img.removeAttribute('data-lazy-srcset');
  }
  img.src = img.dataset.lazySrc;
  img.removeAttribute('data-lazy-src');
}));
const files = new Map();
function cachedFile(key, load) {
  if (!files.has(key)) files.set(key, load().catch(error => { files.delete(key); throw error; }));
  return files.get(key);
}
function script(path) {
  return cachedFile(path, () => new Promise((resolve, reject) => {
    const tag = document.createElement('script');
    const versions = {'assets/results.js':'leaderboard-k6', 'assets/offline-results.js':'arxiv-v1', 'assets/catalog.js':'arxiv-v1'};
    const version = versions[path] || 'atlas3';
    tag.src = path + '?v=' + version;
    tag.onload = resolve;
    tag.onerror = () => { tag.remove(); reject(new Error(path)); };
    document.head.append(tag);
  }));
}
function jsonFile(path) {
  return cachedFile(path, async () => {
    const response = await fetch(path);
    if (!response.ok) throw new Error(path);
    return response.json();
  });
}
async function sceneIndex() {
  if (!cases.length) {
    if (location.protocol === 'file:') {
      await script('assets/catalog.js');
      cases = window.CAVE_CASES;
    } else {
      cases = await jsonFile('examples/index.json');
    }
  }
  return cases;
}
function loadFailure(container, message, again) {
  const retry = node('button','Retry');
  retry.type = 'button';
  retry.onclick = again;
  container.replaceChildren(node('span', message + ' '), retry);
}
function sectionStyle(id, href) {
  if (!document.getElementById(id)) {
    const css = node('link');
    css.id=id; css.rel='stylesheet'; css.href=href;
    document.head.append(css);
  }
}
// Play visible media, releasing off-screen decoders. Native controls retain sound and caption preferences.
const visiblePlayers = new Set();
function syncPlayers() {
  for (const video of visiblePlayers) {
    if (document.hidden) video.pause();
    else video.play().catch(() => {});
  }
}
const playerObserver = 'IntersectionObserver' in window && new IntersectionObserver(entries => {
  for (const entry of entries) {
    const video = entry.target;
    if (entry.isIntersecting && entry.intersectionRatio >= 0.06) {
      visiblePlayers.add(video);
      if (!document.hidden) video.play().catch(() => {});
    } else {
      visiblePlayers.delete(video);
      video.pause();
    }
  }
}, {threshold:[0,0.06]});
document.addEventListener('visibilitychange',syncPlayers);
function watchPlayer(video) {
  if (playerObserver) playerObserver.observe(video);
  else { visiblePlayers.add(video); syncPlayers(); }
}
const film = $('.overview-video');
if (playerObserver && /^(?:#dataset|#viewer|#S\d{2})$/.test(location.hash)) {
  // The browser briefly lays out the top of the paper before scrolling to the atlas fragment.
  // During that first layout the film is visible but its large download would compete with the scene.
  const landing = new IntersectionObserver(([entry]) => {
    if (entry.intersectionRatio < 0.06) enableFilm();
  }, {threshold: [0, 0.06]});
  function enableFilm() {
    landing.disconnect();
    window.removeEventListener('hashchange', enableFilm);
    watchPlayer(film);
  }
  landing.observe(film);
  window.addEventListener('hashchange', enableFilm);
} else {
  watchPlayer(film);
}
window.caveFilmState = {
  capture() { return {time:film.currentTime,playing:!film.paused}; },
  restore(state) {
    if (Number.isFinite(state.time) && Math.abs(film.currentTime-state.time)>0.5) film.currentTime=state.time;
    if (state.playing && visiblePlayers.has(film)) film.play().catch(() => {});
    else film.pause();
  }
};

let activeScene = '';
function closeScene() {
  const video = $('#example video');
  if (video) {
    if (playerObserver) playerObserver.unobserve(video);
    visiblePlayers.delete(video);
    video.pause();
    video.removeAttribute('src');
    video.load();
  }
  $('#example').replaceChildren();
  $('#scene-reader').hidden=true;
  $('#apparatus-atlas').hidden=false;
  activeScene='';
}
function scenePrompt(item,card) {
  const panel=node('section',undefined,'scene-prompt');
  panel.dataset.domain=item.domain;
  const heading=node('h4',card.querySelector('.motion-question').textContent);
  heading.id='scene-question';
  panel.setAttribute('aria-labelledby',heading.id);
  panel.append(heading,node('p',card.dataset.context));
  const sequence=node('figure',undefined,'prompt-sequence');
  sequence.append(node('figcaption','Internal observations'));
  const frames=node('div',undefined,'prompt-frames');
  for (let n=0;n<=6;n++) {
    const link=node('a',undefined,'zoom');
    link.href=pathFor(item,'F'+n+'.png');
    link.setAttribute('aria-label',item.title+(n===0?' — initial observation':' — observation after event '+n));
    const thumb=node('span',undefined,'frame-thumb');
    thumb.style.backgroundImage='url("assets/observations/'+item.id+'.webp")';
    thumb.style.backgroundPosition=(n%4*100/3)+'% '+(n<4?'0':'100')+'%';
    link.append(thumb,node('span','F'+n,'frame-index'));
    frames.append(link);
  }
  sequence.append(frames);
  panel.append(sequence);
  return panel;
}
function renderScene(id) {
  const item=cases.find(entry=>entry.id===id);
  if (!item || id===activeScene) return;
  const card=document.querySelector('#atlas [data-scene="'+item.id+'"]');
  closeScene();
  activeScene=id;
  $('#apparatus-atlas').hidden=true;
  $('#scene-reader').hidden=false;
  const header=node('div',undefined,'sceneinfo');
  const identity=node('div',undefined,'scene-identity');
  identity.append(node('span',id+' · '+nameFor(item.domain),'scene-tag'),node('h3',item.title));
  const actions=node('div',undefined,'reader-actions');
  const browse=node('a','Back to atlas');
  browse.href='#viewer';
  actions.append(browse);
  header.append(identity,actions);
  const media=node('div',undefined,'case-media');
  const video=node('video');
  video.controls=true; video.autoplay=true; video.defaultMuted=true; video.muted=true;
  video.playsInline=true; video.loop=true; video.preload='auto';
  video.setAttribute('controlslist','nodownload');
  video.setAttribute('aria-label',item.title+' — synchronized exterior and interior views');
  video.poster='assets/posters/'+id+'.jpg';
  video.src=pathFor(item,'dual_view.mp4');
  media.append(node('h4','Exterior and interior views'),video);
  $('#example').replaceChildren(header,scenePrompt(item,card),media);
  $('#example').dataset.scene=id;
  $('#viewer-position').textContent=(cases.indexOf(item)+1)+' / '+cases.length;
  watchPlayer(video);
  window.caveReadingHistory?.checkpoint(true);
}
function moveScene(delta) {
  const index=cases.findIndex(item=>item.id===activeScene);
  if (index<0) return;
  const next=cases[(index+delta+cases.length)%cases.length];
  history.replaceState(history.state,'','#'+next.id);
  renderScene(next.id);
}
$('#prev').onclick=()=>moveScene(-1);
$('#next').onclick=()=>moveScene(1);
async function showViewer(followHash=true) {
  try { await sceneIndex(); }
  catch { loadFailure($('#viewer-status'),'Could not load the apparatus index.',()=>showViewer()); return; }
  $('#viewer-status').replaceChildren();
  if (followHash) renderScene(location.hash.slice(1));
}
let resultsReady = false;
async function showResults() {
  if (resultsReady || !$('#leaderboard')) return;
  sectionStyle('length-plot-style','assets/length-comparison.css?v=doppler-1');
  try {
    await Promise.all([sceneIndex(),script('assets/tables.js')]);
    await script('assets/results.js');
    resultsReady = true;
  } catch {
    const status=$('#leaderboard-status');
    if (status) loadFailure(status,'Could not load the results.',showResults);
  }
}
whenNear($('#viewer'),showViewer);
whenNear($('#leaderboard'),showResults);
whenNear($('.key-results'),showResults);
let requestedAnchor = '';
function needsAlignment(hash) {
  // Only content injected after navigation can move its own deep-link target.
  return /^#(?:S(?:0[1-9]|1\d|20)|viewer|film|leaderboard|scores|analysis|question-length|training-seeds|reasoning-effort|error-analysis|citation|(?:tasks|domain)-k[1-6]|apparatus-S\d{2}|scores-(?:length|methods))$/.test(hash);
}
function preserveAnchor() {
  if (!requestedAnchor || requestedAnchor !== location.hash) return;
  const id = requestedAnchor.slice(1);
  const target = document.getElementById(id) ||
    (/^S\d{2}$/.test(id) ? $('#scene-reader') :
     id==='scores-length' ? $('#question-length') : id==='scores-methods' ? $('#training-seeds') : /^(tasks-k|domain-k|apparatus-)/.test(id) ? $('#leaderboard') : null);
  if (target) target.scrollIntoView({block:'start',behavior:'instant'});
}
// Keep a direct link aligned while earlier sections get their data. A reader
// who starts scrolling or using the controls takes over the viewport.
for (const type of ['wheel','touchmove','pointerdown','keydown']) {
  window.addEventListener(type, () => { requestedAnchor=''; }, {passive:true});
}
if ('ResizeObserver' in window) {
  const observer = new ResizeObserver(preserveAnchor);
  for (const section of document.querySelectorAll('.hero,#release,#dataset,#leaderboard')) observer.observe(section);
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (link && !event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) requestedAnchor=needsAlignment(link.hash) ? link.hash : '';
});
function openSection() {
  if (window.caveReadingHistory?.restoring) return;
  if (/^#try-S(?:0[1-9]|1\d|20)$/.test(location.hash)) history.replaceState(history.state, '', location.hash.replace('#try-', '#'));
  requestedAnchor=needsAlignment(location.hash) ? location.hash : '';
  if (/^#S(?:0[1-9]|1\d|20)$/.test(location.hash)) {
    const reader=$('#scene-reader');
    $('#apparatus-atlas').hidden=true;
    reader.hidden=false;
    showViewer();
    reader.focus({preventScroll:true});
    preserveAnchor();
  } else if (location.hash==='#viewer' || location.hash==='#dataset') {
    if (activeScene || !$('#scene-reader').hidden) closeScene();
  } else if (/^#(?:(?:domain|tasks)-k[1-6]|apparatus-S\d{2}|scores(?:-(?:length|methods))?|leaderboard|question-length)$/.test(location.hash)) {
    showResults();
  }
}
openSection();
window.addEventListener('hashchange',openSection);

const lightbox=$('#lightbox');
document.addEventListener('click',e=>{
  const target=e.target.closest('a.zoom');
  if (!target || !lightbox || typeof lightbox.showModal!=='function' || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
  e.preventDefault();
  const img=lightbox.querySelector('img');
  img.src=target.href; img.alt=target.querySelector('img')?.alt || target.getAttribute('aria-label') || '';
  lightbox.classList.remove('actual-size'); $('#image-scale').textContent='Actual size'; lightbox.showModal();
});
$('#image-scale').onclick=()=>{
  const large=lightbox.classList.toggle('actual-size'); $('#image-scale').textContent=large ? 'Fit to screen' : 'Actual size';
};
function dismissImage() {
  if (!window.caveReadingHistory?.dismissImage()) lightbox.close();
}
$('#image-close').onclick=dismissImage;
lightbox.addEventListener('click',event=>{ if(event.target===lightbox) dismissImage(); });
lightbox.addEventListener('cancel',event=>{
  if (window.caveReadingHistory?.dismissImage()) event.preventDefault();
});

function disclosures(scope, withinReader) {
  return Array.from(scope.querySelectorAll('details')).filter(detail=>withinReader || !detail.closest('#example'));
}
function openDisclosures(scope, withinReader) {
  return disclosures(scope,withinReader).flatMap((detail,index)=>detail.open ? [index] : []);
}
function restoreDisclosures(scope, withinReader, selected) {
  disclosures(scope,withinReader).forEach((detail,index)=>{ detail.open=selected.includes(index); });
}
window.cavePageState = {
  capture() {
    const image=lightbox.querySelector('img');
    return {
      scene:activeScene, expanded:openDisclosures(document,false),
      image:lightbox.open ? {src:image.getAttribute('src'),alt:image.alt,large:lightbox.classList.contains('actual-size')} : null,
      results:window.caveResultState?.capture() || null, film:window.caveFilmState?.capture()
    };
  },
  async restore(saved,isCurrent) {
    requestedAnchor='';
    if (saved.scene) {
      await showViewer(false);
      if (!isCurrent()) return;
      renderScene(saved.scene);
    } else if (activeScene || !$('#scene-reader').hidden) closeScene();
    restoreDisclosures(document,false,saved.expanded);
    if (saved.film) window.caveFilmState?.restore(saved.film);
    if (saved.results) {
      await showResults();
      if (!isCurrent()) return;
      const results=window.caveResultState;
      if (results && JSON.stringify(saved.results)!==JSON.stringify(results.capture())) await results.restore(saved.results);
      if (!isCurrent()) return;
    }
    if (saved.image) {
      const image=lightbox.querySelector('img');
      image.src=saved.image.src; image.alt=saved.image.alt;
      lightbox.classList.toggle('actual-size',saved.image.large);
      $('#image-scale').textContent=saved.image.large ? 'Fit to screen' : 'Actual size';
      if (!lightbox.open) lightbox.showModal();
    } else if (lightbox.open) lightbox.close();
  }
};
window.caveReadingHistory?.ready();

