'use strict';

window.caveCaseReader = function (item, {node, pathFor, answerText, strip, preview, displayControls, promptText, scores, loadApparatusScore}) {
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
  reader.selectEvent=renderEvent;
  const nav=node('div',undefined,'stage-navigation'); nav.append(node('span','Event'),controls);
  const frames=node('div',undefined,'contact-strip'); frames.append(strip);
  stage.append(stageTop,frames,nav,pair,score);

  function casePlate(heading, filename, description, className) {
    const section=node('section',undefined,'case-plate '+className);
    const fig=node('figure'), link=node('a',undefined,'zoom'), image=node('img');
    link.href='assets/cases/'+filename;
    link.setAttribute('aria-label','Enlarge '+description);
    image.alt=description;
    image.loading='lazy'; image.decoding='async'; image.src=link.href;
    link.append(image); fig.append(link);
    section.append(node('h4',heading),fig);
    return section;
  }
  const prompt=casePlate('Question and reference answer',item.id+'-prompt.webp',
    'Illustrated task prompt and recorded controls for '+item.title,'prompt-plate');
  prompt.append(promptText);

  const response=casePlate(item.model+' response',item.id+'.webp',
    'Illustrated model response and final answer for '+item.title,'response-plate');
  const context=node('dl',undefined,'case-outcome');
  function metric(label,value) {
    const entry=node('div'), datum=node('dd');
    datum.append(value); entry.append(node('dt',label),datum); context.append(entry);
  }
  const eventsCorrect=item.steps.filter(step=>step.correct).length;
  const apparatusScores=node('a','Apparatus scores');
  apparatusScores.href='#apparatus-'+item.id;
  metric('Events correct in this example',eventsCorrect+' / '+item.steps.length);
  metric('Full sequence',item.exact_match ? 'Correct' : 'Incorrect');
  metric('Same model on '+item.id+' · '+item.steps.length+' events',apparatusScores);
  response.querySelector('h4').after(context);
  loadApparatusScore(item,apparatusScores);

  const more=node('details',undefined,'model-text');
  more.append(node('summary','Complete model response'));
  more.addEventListener('toggle',()=>{
    if (!more.open || more.querySelector('.full-explanation')) return;
    const text=node('div',undefined,'full-explanation');
    answerText(text,item.full_text);
    text.append(node('h5','Final answer'),node('pre',item.final_answer));
    more.append(text);
  });
  response.append(more,scores);
  const materials=node('div',undefined,'case-sheet');
  const data=node('a','Download case record'); data.href=pathFor(item,'illustrated_response.json');
  data.download=item.id+'-illustrated-response.json';
  materials.append(node('span',item.sample_id),data);
  response.append(materials);
  reader.append(stage,prompt,response);
  renderEvent(1); return reader;
};
