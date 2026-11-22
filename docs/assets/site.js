'use strict';

const cases = window.CAVE_CASES;
const tables = window.CAVE_TABLES;
const $ = selector => document.querySelector(selector);
const node = (tag, value, className) => {
  const item = document.createElement(tag);
  if (value !== undefined) item.textContent = value;
  if (className) item.className = className;
  return item;
};
const pathFor = (item, file) => 'examples/' + encodeURIComponent(item.id) + '/' + encodeURIComponent(file);
const sceneFromHash = () => /^#S\d{2}$/.test(location.hash) && cases.find(i => i.id === location.hash.slice(1));
const labels = {'Thermal':'Thermal physics','EM':'Electromagnetism'};
const nameFor = domain => labels[domain] || domain;

function resourceList(settings) {
  const byline = $('#byline');
  byline.replaceChildren();
  if (settings.authors?.length) {
    const authors=node('p',undefined,'authors');
    settings.authors.forEach((author,i)=>{
      if (i) authors.append(document.createTextNode(', '));
      const mark=author.match(/[*†]+$/);
      const label=node('span',mark ? author.slice(0,-mark[0].length) : author);
      if (mark) label.append(node('sup',mark[0]));
      authors.append(label);
    });
    byline.append(authors);
  }
  if (settings.affiliations?.length) byline.append(node('p',settings.affiliations.join(' · ')));
  if (settings.authorNote) byline.append(node('small',settings.authorNote));
  const links = $('#resources');
  links.replaceChildren();
  for (const [title,to] of [['Paper',settings.paper],['Dataset',settings.dataset],['GitHub',settings.github],['arXiv',settings.arxiv],['Supplement',settings.supplement]]) {
    if (!to) continue;
    const url = new URL(to,document.baseURI);
    if (!['https:','http:'].includes(url.protocol) && !(url.protocol==='file:' && !to.includes(':'))) continue;
    const link=node('a',title);
    link.href=to;
    links.append(link);
  }
  if (!links.childElementCount) {
    for (const [title,to] of [['Browse scenes','#viewer'],['View results','#leaderboard']]) {
      const link=node('a',title);
      link.href=to;
      links.append(link);
    }
  }
}
resourceList(window.CAVE_RELEASE || {});
if (location.protocol.startsWith('http')) {
  fetch('release.json').then(response => response.ok ? response.json() : {}).then(resourceList).catch(()=>{});
}
const domains = [...new Set(cases.map(i=>i.domain))];
$('#domain').add(new Option('All five domains',''));
for (const domain of domains) $('#domain').add(new Option(nameFor(domain),domain));

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
function renderScene(id, changeHash=false) {
  const item=cases.find(i=>i.id===id);
  if (!item) return;
  const oldVideo=$('#example video');
  if (oldVideo) oldVideo.pause();
  const header=node('div',undefined,'sceneinfo');
  header.append(node('h3',item.id+' · '+item.title),node('small',nameFor(item.domain)+' · '+item.sample_id));
  const video=node('video');
  video.controls=true; video.playsInline=true; video.preload='none';
  video.setAttribute('aria-label',item.title+' episode video');
  video.poster='assets/posters/'+encodeURIComponent(item.id)+'.jpg';
  video.src=pathFor(item,item.video);
  const caption=node('div',undefined,'video-caption');
  const movieLink=node('a','Open video ↗');
  movieLink.href=video.src;
  caption.append(node('span','Recorded episode · dual view'),movieLink);
  const strip=node('div',undefined,'strip');
  item.frames.forEach((filename,n)=>{
    const fig=node('figure'); const zoom=node('a',undefined,'zoom'); const img=node('img');
    img.src=pathFor(item,filename); img.alt=item.title+', '+(n ? 'internal observation after event '+n : 'initial internal observation');
    zoom.href=img.src; zoom.append(img); fig.append(zoom,node('figcaption',item.frame_labels?.[n] || 'Frame F'+n)); strip.append(fig);
  });
  const parts=[header,video,caption,node('h4','Model input frames'),strip,textPanel('Complete prompt',item.prompt),textPanel('Model response · '+item.model,item.response),compareSteps(item)];
  $('#example').replaceChildren(...parts);
  document.querySelectorAll('#atlas button').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.id===id)));
  if (changeHash) history.replaceState(null,'','#'+id);
}
function chooseScene(item) {
  if ($('#domain').value && item.domain!==$('#domain').value) $('#domain').value='';
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
$('#domain').onchange=()=>{ updateSceneOptions(); renderScene($('#scene').value,true); };
$('#scene').onchange=()=>renderScene($('#scene').value,true);

const atlas=node('div',undefined,'atlas'); atlas.id='atlas';
for (const item of cases) {
  const btn=node('button');
  btn.type='button'; btn.dataset.id=item.id; btn.setAttribute('aria-pressed','false');
  const thumb=node('img'); thumb.loading='lazy'; thumb.alt=''; thumb.src=pathFor(item,item.frames[0]);
  btn.append(thumb,node('span',item.id+' · '+item.title));
  btn.onclick=()=>{ chooseScene(item); $('#viewer').scrollIntoView({block:'start'}); $('#scene').focus({preventScroll:true}); };
  atlas.append(btn);
}
$('#browser').after(atlas);
const initial=sceneFromHash() || cases[0];
updateSceneOptions(initial.id);
renderScene(initial.id);
if (sceneFromHash()) requestAnimationFrame(()=>$('#viewer').scrollIntoView({block:'start'}));
window.addEventListener('hashchange',()=>{ const item=sceneFromHash(); if(item){chooseScene(item);$('#viewer').scrollIntoView({block:'start'});} });

const lightbox=$('#lightbox');
document.addEventListener('click',e=>{
  const target=e.target.closest('a.zoom');
  if (!target || typeof lightbox.showModal!=='function' || e.metaKey || e.ctrlKey) return;
  e.preventDefault();
  const img=lightbox.querySelector('img');
  img.src=target.href; img.alt=target.querySelector('img').alt;
  lightbox.showModal();
});
lightbox.querySelector('button').onclick=()=>lightbox.close();
lightbox.addEventListener('click',event=>{ if(event.target===lightbox) lightbox.close(); });

