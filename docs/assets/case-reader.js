'use strict';

window.caveCaseReader = function (item, {node, pathFor, answerText, strip, preview, displayControls}) {
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
  const word = labels => Array.isArray(labels) ? displayControls(labels) : 'Unparsed';
  const renderEvent = n => {
    const step = item.steps[n-1];
    for (const button of controls.children) button.setAttribute('aria-pressed', String(Number(button.value)===n));
    const views = [n-1,n].map((frame, index) => {
      const fig = node('figure'), zoom = node('a',undefined,'zoom');
      zoom.href = pathFor(item,item.frames[frame]);
      zoom.setAttribute('aria-label','Enlarge '+item.title+', frame F'+frame);
      const cap=node('figcaption');
      cap.append(node('b','F'+frame),node('span', index ? 'After event '+n : 'Before event '+n));
      zoom.append(preview(item,frame,'frame-thumb')); fig.append(zoom,cap); return fig;
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
  const heading=node('h4',item.model);
  const locator=node('p',item.display_complete ? 'Model reasoning' : 'Excerpts from the model’s reasoning','reading-subtitle');
  const quote=node('blockquote');
  answerText(quote,item.display_text);
  const more=node('details',undefined,'model-text');
  more.append(node('summary','Complete model response'));
  more.addEventListener('toggle',()=>{
    if (!more.open || more.querySelector('.full-explanation')) return;
    const text=node('div',undefined,'full-explanation');
    answerText(text,item.full_text);
    text.append(node('h5','Final answer'),node('pre',item.final_answer));
    more.append(text);
  });
  aside.append(meta,heading,locator,quote,more);
  const materials=node('div',undefined,'case-sheet');
  const sheet=node('a','Enlarge case sheet','zoom');
  sheet.href='assets/cases/'+item.id+'.webp?v=verbal-prompts-3';
  sheet.setAttribute('aria-label','Enlarge '+item.id+' illustrated case sheet');
  const data=node('a','Download case record'); data.href=pathFor(item,'illustrated_response.json');
  data.download=item.id+'-illustrated-response.json';
  const results=node('a','Apparatus scores'); results.href='#apparatus-'+item.id;
  materials.append(sheet,data,results);
  const modes=node('div',undefined,'case-modes');
  modes.setAttribute('role','group'); modes.setAttribute('aria-label','Case presentation');
  const inspect=node('button','Observations and response'), print=node('button','One-page case sheet');
  const plate=node('figure',undefined,'printed-plate'), open=node('a',undefined,'zoom'), facsimile=node('img');
  open.href=sheet.href; open.setAttribute('aria-label','Enlarge the '+item.title+' case sheet');
  facsimile.alt='One-page case sheet for '+item.id+', '+item.title+'.';
  open.append(facsimile); plate.append(open); plate.hidden=true;
  const switchMode=printed=>{
    plate.hidden=!printed; stage.hidden=printed; aside.hidden=printed;
    inspect.setAttribute('aria-pressed',String(!printed)); print.setAttribute('aria-pressed',String(printed));
    if (printed && !facsimile.hasAttribute('src')) facsimile.src=sheet.href;
  };
  for (const button of [inspect,print]) { button.type='button'; modes.append(button); }
  inspect.onclick=()=>switchMode(false); print.onclick=()=>switchMode(true);
  reader.append(modes,stage,aside,plate,materials);
  renderEvent(1); switchMode(false); return reader;
};
