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

function whenNear(element, run) {
  if (!('IntersectionObserver' in window)) { run(); return; }
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); run(); }
  }, {rootMargin:'200px 0px'});
  observer.observe(element);
}
document.querySelectorAll('img[data-lazy-src]').forEach(img => whenNear(img, () => {
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
    tag.src = path + (path === 'assets/results.js' ? '?v=copy2' : '?v=atlas3');
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
function preview(item, frame, className) {
  const thumb = node('span', undefined, className);
  thumb.setAttribute('aria-hidden','true');
  thumb.style.backgroundImage = 'url("assets/atlas.webp?v=atlas3")';
  thumb.style.backgroundSize = '700% 2000%';
  thumb.style.backgroundPosition = (frame * 100 / 6) + '% ' + ((Number(item.id.slice(1)) - 1) * 100 / 19) + '%';
  return thumb;
}

function matchingCases() {
  return cases.filter(i=>!$('#domain').value || i.domain===$('#domain').value);
}
function updateSceneOptions(selected) {
  const items=matchingCases();
  $('#scene').replaceChildren(...items.map(i=>new Option(i.id+' · '+i.title,i.id)));
  $('#scene').value=selected || items[0].id;
}
function textPanel(title,value) {
  const box=node('details');
  box.append(node('summary',title));
  const pre=node('pre',value);
  const copy=node('button','Copy','copy');
  copy.type='button';
  copy.onclick=async () => {
    try { await navigator.clipboard.writeText(value); copy.textContent='Copied'; }
    catch { const range=document.createRange(); range.selectNodeContents(pre); const selection=window.getSelection(); selection.removeAllRanges(); selection.addRange(range); copy.textContent='Selected'; }
    window.setTimeout(()=>copy.textContent='Copy',1300);
  };
  box.append(copy,pre);
  return box;
}
function answerText(parent, value) {
  for (const line of value.split(/\n+/).map(s=>s.trim()).filter(Boolean)) {
    const p = node('p');
    for (const part of line.replace(/^[-*]\s+/, '').split(/(\*\*[^*]+\*\*|`[^`]+`)/)) {
      if (part.startsWith('**') && part.endsWith('**')) p.append(node('strong',part.slice(2,-2)));
      else if (part.startsWith('`') && part.endsWith('`')) p.append(node('code',part.slice(1,-1)));
      else p.append(document.createTextNode(part));
    }
    parent.append(p);
  }
}
function caseStudy(item) {
  const grid = node('div',undefined,'case-study');
  const figure = node('figure',undefined,'case-sheet');
  const zoom = node('a',undefined,'zoom');
  zoom.href = 'assets/cases/'+item.id+'.webp';
  const image = node('img');
  image.src=zoom.href; image.alt=item.id+' '+item.title+' case sheet with observations, answer and event scores.';
  image.loading='lazy'; image.decoding='async';
  zoom.append(image,node('span','Open full-size sheet ↗','sheet-open'));
  figure.append(zoom);
  const aside=node('div',undefined,'case-reading');
  const meta=node('p',nameFor(item.domain)+'  /  '+item.sample_id,'reading-meta');
  const event=item.excerpt_event;
  const heading=node('h4',item.model);
  const locator=node('p',(event ? 'Event '+event+' · ' : '')+'From the model’s answer','reading-subtitle');
  const quote=node('blockquote');
  answerText(quote,item.excerpt);
  const more=node('details',undefined,'model-text');
  more.append(node('summary','Read the full explanation'));
  const text=node('div',undefined,'full-explanation'); answerText(text,item.response_text); more.append(text);
  const link=node('a','Download the example record ↗','record-link'); link.href=pathFor(item,'worked.json');
  aside.append(meta,heading,locator,quote,more,link);
  grid.append(figure,aside); return grid;
}
function compareSteps(item) {
  const box=node('details');
  box.append(node('summary','Reference answer and event scores'));
  const wrapper=node('div',undefined,'tablewrap');
  wrapper.tabIndex=0;
  const table=node('table',undefined,'check-table');
  const header=table.createTHead().insertRow();
  for (const title of ['Event','Reference controls','Predicted controls','Match']) header.append(node('th',title));
  const body=table.createTBody();
  for (const step of item.steps) {
    const row=body.insertRow();
    row.append(node('th',step.event),node('td',step.expected.join(' + ')),node('td',Array.isArray(step.predicted) ? step.predicted.join(' + ') : 'Unparsed'),node('td',step.correct ? 'Yes' : 'No'));
  }
  wrapper.append(table);
  box.append(node('p','Sequence exact match: '+(item.exact_match ? 'yes.':'no.')),wrapper);
  return box;
}
function trySequence(item) {
  const panel = node('details', undefined, 'try-sequence');
  panel.append(node('summary', 'Try the six-event question'));
  const sets = JSON.parse(item.prompt.match(/ALLOWED EVENT LABEL SETS\s*\n(\[.*\])\s*\n/)[1]);
  const reference = item.steps.map(step => step.expected);
  const key = controls => JSON.stringify([...controls].sort());
  const fields = node('div', undefined, 'answer-fields');
  const inputs = reference.map((_, i) => {
    const label = node('label', 'Event ' + (i + 1));
    const select = node('select');
    select.add(new Option('Choose controls', ''));
    for (const controls of sets) select.add(new Option(controls.join(' + '), key(controls)));
    label.append(select);
    fields.append(label);
    return select;
  });
  const actions = node('div', undefined, 'answer-actions');
  const result = node('p', '', 'answer-result');
  result.setAttribute('role', 'status');
  const reveal = node('ol', undefined, 'answer-key');
  reference.forEach(controls => reveal.append(node('li', controls.join(' + '))));
  reveal.hidden = true;
  function action(title, run) {
    const button = node('button', title);
    button.type = 'button';
    button.onclick = run;
    actions.append(button);
    return button;
  }
  action('Check answer', () => {
    const missing = inputs.find(input => !input.value);
    if (missing) {
      result.textContent = 'Choose a control set for each event.';
      missing.focus();
      return;
    }
    const misses = inputs.flatMap((input, i) => input.value === key(reference[i]) ? [] : [i + 1]);
    result.textContent = misses.length
      ? (6 - misses.length) + ' of 6 events correct. Revisit ' + (misses.length === 1 ? 'event ' : 'events ') + misses.join(', ') + '.'
      : '6 of 6 events correct.';
  });
  const toggle = action('Reveal reference', () => {
    reveal.hidden = !reveal.hidden;
    toggle.textContent = reveal.hidden ? 'Reveal reference' : 'Hide reference';
    toggle.setAttribute('aria-expanded', String(!reveal.hidden));
  });
  toggle.setAttribute('aria-expanded', 'false');
  action('Clear', () => {
    inputs.forEach(input => { input.value = ''; });
    result.textContent = '';
    if (!reveal.hidden) toggle.click();
    inputs[0].focus();
  });
  fields.onchange = () => { result.textContent = ''; };
  panel.append(node('p', 'Use the internal frames and the apparatus description. Choose one control set for each event.'), fields, actions, result, reveal);
  return panel;
}
let activeScene = '';
async function renderScene(id, changeHash=false) {
  const entry=cases.find(i=>i.id===id);
  if (!entry) return;
  if (changeHash) history.replaceState(null,'','#'+id);
  activeScene = id;
  document.querySelectorAll('#atlas button').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.id===id)));
  const example = $('#example');
  example.setAttribute('aria-busy','true');
  const oldVideo=$('#example video');
  if (oldVideo) oldVideo.pause();
  let item;
  try {
    item = entry.frames ? entry : await jsonFile(pathFor(entry,'worked.json'));
  } catch {
    if (activeScene === id) {
      example.removeAttribute('data-scene');
      example.removeAttribute('aria-busy');
      loadFailure(example, 'Could not load ' + entry.title + '.', () => renderScene(id));
    }
    return;
  }
  if (activeScene !== id) return;
  const header=node('div',undefined,'sceneinfo');
  header.append(node('h3',item.id+' · '+item.title));
  const video=node('video');
  video.controls=true; video.playsInline=true; video.preload='none';
  video.setAttribute('aria-label',item.title+' episode video');
  video.poster='assets/posters/'+encodeURIComponent(item.id)+'.jpg?v=atlas3';
  video.src=pathFor(item,item.video);
  const caption=node('div',undefined,'video-caption');
  const movieLink=node('a','Open video ↗');
  movieLink.href=video.src;
  caption.append(node('span','Exterior and interior views'),movieLink);
  const strip=node('div',undefined,'strip');
  item.frames.forEach((filename,n)=>{
    const fig=node('figure'); const zoom=node('a',undefined,'zoom');
    zoom.setAttribute('aria-label', item.title+', '+(n ? 'internal observation after event '+n : 'initial internal observation'));
    zoom.href=pathFor(item,filename); zoom.append(preview(item,n,'frame-thumb'));
    fig.append(zoom,node('figcaption',item.frame_labels?.[n] || 'Frame F'+n)); strip.append(fig);
  });
  const media=node('details',undefined,'case-media');
  media.append(node('summary','Watch the episode and inspect its seven frames'),video,caption,node('h4','Model input frames'),strip);
  const parts=[header,caseStudy(item),media,textPanel('Complete prompt',item.prompt),trySequence(item),compareSteps(item)];
  example.replaceChildren(...parts);
  example.dataset.scene=id;
  example.removeAttribute('aria-busy');
}
function chooseScene(item) {
  if (!item) return;
  if ($('#domain').value && item.domain!==$('#domain').value) $('#domain').value=item.domain;
  updateSceneOptions(item.id);
  renderScene(item.id,true);
}
function moveScene(delta) {
  const items=matchingCases();
  const idx=items.findIndex(i=>i.id===$('#scene').value);
  chooseScene(items[(idx+delta+items.length)%items.length]);
}
$('#prev').onclick=()=>moveScene(-1);
$('#next').onclick=()=>moveScene(1);
$('#random-scene').onclick=()=>{
  const others=matchingCases().filter(item=>item.id!==$('#scene').value);
  if (others.length) chooseScene(others[Math.floor(Math.random()*others.length)]);
};
$('#domain').onchange=()=>{ updateSceneOptions(); renderScene($('#scene').value,true); };
$('#scene').onchange=()=>renderScene($('#scene').value,true);

async function showViewer() {
  try { await sceneIndex(); }
  catch {
    loadFailure($('#example'),'Could not load the apparatus list.',showViewer);
    return;
  }
  const atlas = $('#atlas');
  if (!atlas.childElementCount) {
    $('#domain').add(new Option('All five domains',''));
    for (const domain of new Set(cases.map(item=>item.domain))) {
      $('#domain').add(new Option(nameFor(domain),domain));
      const section=node('section',undefined,'atlas-domain'), grid=node('div',undefined,'atlas');
      for (const item of cases.filter(entry=>entry.domain===domain)) {
        const btn=node('button');
        btn.type='button'; btn.dataset.id=item.id; btn.setAttribute('aria-pressed','false');
        btn.append(preview(item,0,'atlas-thumb'),node('span',item.id+' · '+item.title));
        btn.onclick=()=>{
          $('#apparatus-atlas').open=false;
          chooseScene(item);
          $('#viewer').scrollIntoView({block:'start',behavior:'instant'});
          $('#scene').focus({preventScroll:true});
        };
        grid.append(btn);
      }
      section.append(node('h4',nameFor(domain)),grid);
      atlas.append(section);
    }
  }
  const target = cases.find(item=>'#'+item.id===location.hash);
  if (!activeScene || (target && target.id !== activeScene)) {
    const first=target || cases[0];
    if ($('#domain').value && $('#domain').value !== first.domain) $('#domain').value='';
    updateSceneOptions(first.id);
    await renderScene(first.id);
  }
}
let resultsReady = false;
async function showResults() {
  try {
    await Promise.all([sceneIndex(),script('assets/tables.js')]);
    await script('assets/results.js');
    resultsReady = true;
  } catch {
    loadFailure($('#leaderboard-status'),'Could not load the results.',showResults);
  }
}
whenNear($('#viewer'),showViewer);
whenNear($('#leaderboard'),showResults);
document.querySelectorAll('a[data-detail]').forEach(link => { link.href='#table-' + link.dataset.detail; });
let requestedAnchor = '';
function preserveAnchor() {
  if (!requestedAnchor || requestedAnchor !== location.hash) return;
  const id = requestedAnchor.slice(1);
  const target = document.getElementById(id) ||
    (/^S\d{2}$/.test(id) ? $('#viewer') :
     id.startsWith('table-') ? $('#detailed-results') :
     /^(domain-k|scores-|apparatus-)/.test(id) ? $('#leaderboard') : null);
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
  const tab = event.target.closest('button[data-table]');
  if (tab && !resultsReady && !tab.onclick) showResults().then(() => { if (resultsReady) tab.click(); });
  const link = event.target.closest('a[href^="#"]');
  if (link && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) requestedAnchor=link.hash;
});
function openSection() {
  requestedAnchor=location.hash;
  if (/^#S(?:0[1-9]|1\d|20)$/.test(location.hash)) {
    $('#viewer').scrollIntoView({block:'start',behavior:'instant'});
    showViewer();
  } else if (location.hash === '#viewer') {
    showViewer();
  } else if (/^#(?:domain-k[1-6]|apparatus-S\d{2}|scores-(?:length|methods)|table-[a-z0-9_]+|leaderboard|detailed-results)$/.test(location.hash)) {
    showResults();
  }
}
openSection();
window.addEventListener('hashchange',openSection);

const film = $('#film video'), playButton = $('#film .film-play');
if (playButton && film) {
  const hero = film.closest('.hero');
  film.controls = false;
  playButton.hidden = false;
  playButton.onclick = () => {
    film.controls = true;
    film.play().catch(() => { hero.classList.remove('is-playing'); film.controls = false; playButton.hidden = false; });
  };
  film.addEventListener('play', () => { hero.classList.add('is-playing'); playButton.hidden = true; film.focus({preventScroll:true}); });
  for (const action of ['ended','error']) film.addEventListener(action, () => {
    hero.classList.remove('is-playing'); film.controls=false; playButton.hidden = false;
  });
  $('#close-film').onclick=()=>{
    film.pause(); film.controls=false; hero.classList.remove('is-playing');
    playButton.hidden=false; playButton.focus({preventScroll:true});
  };
}

const lightbox=$('#lightbox');
document.addEventListener('click',e=>{
  const target=e.target.closest('a.zoom');
  if (!target || typeof lightbox.showModal!=='function' || e.metaKey || e.ctrlKey) return;
  e.preventDefault();
  const img=lightbox.querySelector('img');
  img.src=target.href; img.alt=target.querySelector('img')?.alt || target.getAttribute('aria-label') || '';
  lightbox.classList.remove('actual-size'); $('#image-scale').textContent='Actual size'; lightbox.showModal();
});
$('#image-scale').onclick=()=>{
  const large=lightbox.classList.toggle('actual-size'); $('#image-scale').textContent=large ? 'Fit to screen' : 'Actual size';
};
$('#image-close').onclick=()=>lightbox.close();
lightbox.addEventListener('click',event=>{ if(event.target===lightbox) lightbox.close(); });

