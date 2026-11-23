'use strict';

// Contiguous character ranges in the released model responses.
const cavePassageRanges = {"S01": [1631, 2119], "S02": [76, 549], "S03": [481, 1009], "S04": [832, 1408], "S05": [352, 830], "S06": [20, 438], "S07": [507, 1078], "S08": [636, 1228], "S09": [103, 932], "S10": [665, 1093], "S11": [0, 515], "S12": [266, 946], "S13": [1606, 2145], "S14": [81, 651], "S15": [844, 1251], "S16": [762, 1251], "S17": [374, 892], "S18": [1314, 1812], "S19": [615, 1249], "S20": [604, 1175]};

window.caveCaseReader = function (item, {node, pathFor, answerText, strip}) {
  const reader = node('section', undefined, 'instrument-reader');
  const stage = node('section', undefined, 'observation-stage');
  stage.setAttribute('aria-label', 'Internal observations');
  const stageTop = node('div', undefined, 'stage-top');
  stageTop.append(node('h4','Internal observations'), node('span', 'F0 — F6'));
  const pair = node('div', undefined, 'observation-pair');
  const controls = node('div', undefined, 'event-dial');
  controls.setAttribute('role','group');
  controls.setAttribute('aria-label','Select an event to compare');
  const score = node('div', undefined, 'event-verdict');
  score.setAttribute('aria-live','polite');
  const word = labels => Array.isArray(labels) ? labels.join(' + ') : 'Unparsed';
  const renderEvent = n => {
    const step = item.steps[n-1];
    for (const button of controls.children) button.setAttribute('aria-pressed', String(Number(button.value)===n));
    const views = [n-1,n].map((frame, index) => {
      const fig = node('figure'), zoom = node('a',undefined,'zoom'), img = node('img');
      zoom.href = pathFor(item,item.frames[frame]);
      img.src = zoom.href; img.alt = item.title + ', frame F' + frame; img.width=960; img.height=540;
      zoom.setAttribute('aria-label','Enlarge '+img.alt);
      const cap=node('figcaption');
      cap.append(node('b','F'+frame),node('span', index ? 'After event '+n : 'Before event '+n));
      zoom.append(img); fig.append(zoom,cap); return fig;
    });
    pair.replaceChildren(...views);
    const lines = node('dl');
    for (const [label,value] of [['Recorded controls',word(step.expected)],['Model prediction',word(step.predicted)]]) {
      const entry = node('div'); entry.append(node('dt',label),node('dd',value)); lines.append(entry);
    }
    const status=node('p',step.correct ? 'Matched' : 'Did not match','verdict-label');
    status.dataset.match=String(step.correct);
    score.replaceChildren(lines,status);
  };
  for (const step of item.steps) {
    const button=node('button', 'E'+step.event);
    button.type='button'; button.value=step.event; button.setAttribute('aria-label','Compare event '+step.event);
    button.onclick=()=>renderEvent(step.event); controls.append(button);
  }
  const nav=node('div',undefined,'stage-navigation'); nav.append(node('span','Event'),controls);
  stage.append(stageTop, nav, pair, score);
  const frames=node('div',undefined,'contact-strip'); frames.append(node('p','Observation sequence'),strip);
  stage.append(frames);
  const aside=node('div',undefined,'case-reading');
  const meta=node('p',item.sample_id+' / '+item.id,'reading-meta');
  const event=item.excerpt_event;
  const heading=node('h4',item.model);
  const locator=node('p','Response excerpt · Event '+event,'reading-subtitle');
  const quote=node('blockquote');
  const range=cavePassageRanges[item.id];
  const passage=item.response_text.slice(range[0],range[1]).replace(/^\s*\d+\.\s+/gm,'');
  answerText(quote, passage);
  const more=node('details',undefined,'model-text');
  more.append(node('summary','Full model explanation'));
  const text=node('div',undefined,'full-explanation'); answerText(text,item.response_text); more.append(text);
  aside.append(meta,heading,locator,quote,more);
  const materials=node('div',undefined,'case-sheet');
  const sheet=node('a','Open one-page case sheet ↗','zoom');
  sheet.href='assets/cases/'+item.id+'.webp?v=plate1';
  sheet.setAttribute('aria-label','Enlarge '+item.id+' illustrated case sheet');
  const data=node('a','Case record (JSON) ↗'); data.href=pathFor(item,'worked.json');
  const results=node('a','Apparatus scores →'); results.href='#apparatus-'+item.id;
  materials.append(sheet,data,results);
  reader.append(stage,aside,materials); renderEvent(event); return reader;
};
