'use strict';

// Apparatus questions from the illustrated case sheets.
window.caveCaseQuestions = {
  "S01": "The ball, pendulum and other objects respond to the motion of a closed vehicle. Which changes in speed or direction occurred during the six events?",
  "S02": "Loads and gas-filled tubes move on a rotating deck. At each event, which direction did the deck turn, and did it speed up or slow down?",
  "S03": "Three pendulums hang from a carriage driven along a rail. Which of the three programmed trajectories moved the carriage at each event?",
  "S04": "Eight objects rest on a tray. From the changes in their positions and orientations, identify the direction or combination of directions of each impact.",
  "S05": "One heater moves beneath a conducting plate while three heaters stay fixed. In which direction or directions did the movable heater travel at each event?",
  "S06": "Separate jackets control the temperature of two liquid layers. For each event, which layer received the intervention, and was it heated or cooled?",
  "S07": "Three connected glass bulbs have visible menisci. Which bulb or combination of bulbs was heated at each of the six events?",
  "S08": "Three bimetal strips support a central annulus. Use their changing shapes and the annulus position to identify the lamp or lamps selected at each event.",
  "S09": "Compass needles respond to three coils beneath the apparatus. Which coil or coils were energized at each event, and with which polarity?",
  "S10": "Horizontal probe pairs respond to two electric dipoles. At each event, which dipole charges increased or decreased in magnitude?",
  "S11": "A charged capacitor is connected to an electroscope. Use the leaf positions to identify full insertion, half insertion or withdrawal of the dielectric at each event.",
  "S12": "Three suspended conductors move when current flows. Which pair carried current at each event, and did the two currents run in the same or opposite directions?",
  "S13": "A diaphragm drives a tube containing loose cork granules. Which changes in drive amplitude, frequency or both produced the six observed responses?",
  "S14": "Waves travel through an elastic surface around fixed columns. From which edge or edges did each pulse enter the surface?",
  "S15": "A moving siren emits a fixed tone toward a stationary receiver. At each event, did the siren approach or recede, and was its motion fast or slow?",
  "S16": "Two plungers drive ripples in a tank. For each observed pattern, identify the phase set for source A and the phase of source B relative to A.",
  "S17": "The specimen responds to compression and to a rotating optical control. Which loading or rotation controls produced each observed fringe pattern?",
  "S18": "Light reaches a screen after reflections from two mirrors. For each event, identify which mirror or mirrors turned and in what direction.",
  "S19": "Three light rays pass through a graded-index insert before reaching a screen. How was the insert translated or rotated at each event?",
  "S20": "A coherent light source illuminates two adjustable slits. Which changes in slit width, slit spacing or both produced each fringe pattern?"
};

// Contiguous character ranges in the released model responses.
const cavePassageRanges = {"S01":[1106,2119],"S02":[0,746],"S03":[0,1009],"S04":[832,1913],"S05":[0,1019],"S06":[440,1459],"S07":[480,1301],"S08":[636,1684],"S09":[89,1283],"S10":[638,1691],"S11":[0,876],"S12":[0,1278],"S13":[1370,2509],"S14":[0,753],"S15":[832,1897],"S16":[710,1804],"S17":[0,1011],"S18":[1314,2456],"S19":[575,1514],"S20":[581,1928]};

window.caveCaseReader = function (item, {node, pathFor, answerText, strip, preview}) {
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
  const event=item.excerpt_event;
  const heading=node('h4',item.model);
  const locator=node('p','From the model’s response','reading-subtitle');
  const quote=node('blockquote');
  const range=cavePassageRanges[item.id];
  const passage=Array.from(item.response_text).slice(range[0],range[1]).join('')
    .split(/\n\s*\n/).map(paragraph=>paragraph.split(/\r?\n/)
      .map(line=>line.replace(/^\s*(?:[-*]\s+|\d+\.\s+)/,'').trim()).join(' ')).join('\n\n');
  answerText(quote, passage);
  const more=node('details',undefined,'model-text');
  more.append(node('summary','Full model explanation'));
  const text=node('div',undefined,'full-explanation'); answerText(text,item.response_text); more.append(text);
  aside.append(meta,heading,locator,quote,more);
  const materials=node('div',undefined,'case-sheet');
  const sheet=node('a','Enlarge case sheet','zoom');
  sheet.href='assets/cases/'+item.id+'.webp?v=portrait2';
  sheet.setAttribute('aria-label','Enlarge '+item.id+' illustrated case sheet');
  const data=node('a','Download case record'); data.href=pathFor(item,'worked.json');
  data.download=item.id+'-worked.json';
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
  renderEvent(event); switchMode(false); return reader;
};
