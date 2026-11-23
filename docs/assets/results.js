'use strict';

const tables = window.CAVE_TABLES;
const resultDirectory = 'assets/results/';
// Match the paper's nearest-even formatting for nonnegative binary floats.
// At one decimal, .25 is the only exact halfway fraction that toFixed rounds to an odd digit.
function percent(value) {
  if (value === '' || value === undefined || value === null) return '—';
  const number = Number(value);
  return number % 1 === 0.25 ? Math.floor(number) + '.2' : number.toFixed(1);
}
const cachedResults = new Map();
const detailedPercent = new Intl.NumberFormat('en', {
  minimumFractionDigits: 1, maximumFractionDigits: 2, useGrouping: false
}).format;
const lengths = [1, 2, 3, 4, 5, 6];
const physicalDomains = ['Dynamics', 'Thermal', 'Electromagnetism', 'Acoustics', 'Optics', 'Overall'];
const lengthNames = lengths.map(k => 'k = ' + k);
const leaderboard = {view: 'domains', k: 6, scene: 'S01', sort: 5, ascending: false};
let leaderboardVersion = 0;
let csvDownloadUrl;

// A quoted choice or answer can span lines and contain commas and doubled quotes.
function csvRows(csv) {
  const records = [];
  let record = [], field = '', quoted = false;
  const text = csv.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"' && quoted && text[i + 1] === '"') {
      field += '"';
      i++;
    } else if (ch === '"') {
      quoted = !quoted;
    } else if (!quoted && ch === ',') {
      record.push(field);
      field = '';
    } else if (!quoted && (ch === '\n' || ch === '\r')) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      record.push(field);
      if (record.some(value => value !== '')) records.push(record);
      record = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (quoted) throw new Error('Incomplete quoted CSV field');
  if (record.length || field) {
    record.push(field);
    records.push(record);
  }
  const columns = records.shift() || [];
  return records.map(fields => Object.fromEntries(columns.map((key, i) => [key, fields[i]])));
}

function readResults(name) {
  if (!cachedResults.has(name)) {
    const source = location.protocol === 'file:'
      ? script('assets/offline-results.js').then(() => window.CAVE_RESULT_CSV[name])
      : fetch(resultDirectory + name + '.csv').then(response => {
      if (!response.ok) throw new Error('Missing table ' + name);
      return response.text();
    });
    const promise = source.then(csvRows).catch(error => {
      cachedResults.delete(name);
      throw error;
    });
    cachedResults.set(name, promise);
  }
  return cachedResults.get(name);
}

function setDownload(table, filename) {
  if (csvDownloadUrl) URL.revokeObjectURL(csvDownloadUrl);
  const quote = value => '"' + String(value ?? '').replaceAll('"', '""') + '"';
  const lines = [['Group', table.label, ...table.columns]];
  for (const row of table.rows) {
    lines.push([row.group, row.name, ...row.values.map((value, i) => value === null ? '' : cellValue(table, row, i))]);
  }
  const csv = lines.map(line => line.map(quote).join(',')).join('\r\n') + '\r\n';
  csvDownloadUrl = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8'}));
  const link = $('#download');
  link.href = csvDownloadUrl;
  link.download = 'CaveBench-' + filename + '.csv';
}

function cellValue(table, row, col) {
  if (row.values[col] === null) return '—';
  return table.showCounts ? row.counts[col].replace(' correct', '') : percent(row.values[col]);
}

function renderLeaderboard(table, note, filename) {
  const element = $('#results');
  const visibleRows = [];
  element.replaceChildren();
  element.setAttribute('aria-label', note);
  const thead = element.createTHead();
  if (table.apparatuses) {
    const domains = thead.insertRow();
    domains.className = 'matrix-domains';
    domains.append(node('td','Domain'));
    for (const domain of new Set(table.apparatuses.map(c => c.domain))) {
      const header = node('th', nameFor(domain));
      header.scope = 'colgroup';
      header.colSpan = table.apparatuses.filter(c => c.domain === domain).length;
      domains.append(header);
    }
  }
  const head = thead.insertRow();
  [table.label, ...table.columns].forEach((name, i) => {
    const col = i - 1;
    const sorted = leaderboard.sort === col;
    const th = node('th');
    th.scope = 'col';
    th.setAttribute('aria-sort', sorted ? (leaderboard.ascending ? 'ascending' : 'descending') : 'none');
    const button = node('button', name + (sorted ? (leaderboard.ascending ? ' ↑' : ' ↓') : ''));
    if (table.apparatuses && col >= 0) {
      const item = table.apparatuses[col];
      button.replaceChildren(node('small',item.id), node('span',item.title + (sorted ? (leaderboard.ascending ? ' ↑' : ' ↓') : '')));
    }
    button.type = 'button';
    button.title = 'Sort by ' + name;
    button.onclick = () => {
      leaderboard.ascending = sorted ? !leaderboard.ascending : col === -1;
      leaderboard.sort = col;
      renderLeaderboard(table, note, filename);
      $('#results thead').querySelectorAll('button')[i].focus();
    };
    th.append(button);
    head.append(th);
  });
  const allRanks = ['domains','tasks'].includes(leaderboard.view) ? table.columns.map((_, i) =>
    [...new Set(table.rows.map(row => row.values[i]).filter(value => value !== null))].sort((a,b) => b-a)) : null;
  const groups = [...new Set(table.rows.map(row => row.group))];
  const legend = $('#result-legend');
  legend.replaceChildren();
  for (const group of groups) {
    const body = element.createTBody();
    body.dataset.group = group;
    const key = node('li',group.replace(/ Models$/, ''));
    key.dataset.group = group;
    legend.append(key);
    const band = body.insertRow();
    band.className = 'group';
    const th = node('th', group);
    th.scope = 'rowgroup';
    th.colSpan = table.columns.length + 1;
    band.append(th);
    const rows = table.rows.filter(row => row.group === group);
    const best = allRanks ? allRanks.map(levels => levels[0]) : table.columns.map((_, i) => Math.max(...rows.map(row => row.values[i] ?? -Infinity)));
    const second = allRanks ? allRanks.map(levels => levels[1]) : [];
    if (leaderboard.sort !== null) {
      const col = leaderboard.sort;
      const sign = leaderboard.ascending ? 1 : -1;
      rows.sort((a, b) => {
        if (col === -1) return sign * a.name.localeCompare(b.name);
        if (a.values[col] === null || b.values[col] === null) return Number(a.values[col] === null) - Number(b.values[col] === null);
        return sign * (a.values[col] - b.values[col]);
      });
    }
    for (const row of rows) {
      visibleRows.push(row);
      const tr = body.insertRow();
      const model = node('th', row.name);
      model.scope = 'row';
      tr.append(model);
      row.values.forEach((value, i) => {
        const td = node('td', cellValue(table, row, i));
        if (value === null) td.className = 'missing';
        else if (value === best[i]) td.className = 'best';
        else if (value === second[i]) td.className = 'runner-up';
        if (row.counts) td.title = row.counts[i];
        tr.append(td);
      });
    }
  }
  $('#table-note').textContent = note;
  $('#leaderboard-status').textContent = '';
  $('#download').hidden = false;
  setDownload({...table, rows:visibleRows}, filename);
}

function scoreMatrix(records, columns, keyOf) {
  const byModel = new Map();
  for (const r of records) {
    if (!byModel.has(r.model_key)) byModel.set(r.model_key, new Map());
    byModel.get(r.model_key).set(keyOf(r), r);
  }
  const rows = [];
  for (const entries of byModel.values()) {
    const first = entries.values().next().value;
    const cells = columns.map(key => entries.get(key));
    rows.push({
      name:first.model, group:first.group,
      values:cells.map(r => r && Number(r.total) > 0 ? Number(r.accuracy_pct) : null),
      counts:cells.map(r => r && Number(r.total) > 0 ? r.correct + ' / ' + r.total + ' correct' : 'No questions at this length')
    });
  }
  return {label:'Model', rows};
}

async function updateLeaderboard() {
  const version = ++leaderboardVersion;
  const {view, k, scene} = leaderboard;
  const isTaskMatrix = view === 'tasks';
  $('#k-filter').hidden = view !== 'domains' && !isTaskMatrix;
  $('#matrix-filter').hidden = !isTaskMatrix;
  $('#results').parentElement.classList.toggle('task-matrix',isTaskMatrix);
  $('#apparatus-filter').hidden = view !== 'scenes';
  document.querySelectorAll('[data-table]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.table === view)));
  document.querySelectorAll('[data-events]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.events) === k)));
  if (view === 'methods' || view === 'length') {
    const source = tables[view];
    renderLeaderboard({...source, label:view === 'methods' ? 'Method' : 'Model'},
      'Exact match (%). Columns group questions by event count (k). Overall includes all 1,180 questions.', view);
    return;
  }
  const source = view === 'domains' ? 'domain_by_length' : 'scene_by_length';
  const isDomain = view === 'domains';
  let note = isDomain
    ? 'Exact-match accuracy (%) on ' + k + '-event questions. ' + (k < 3 ? '190 questions, including 30 in electromagnetism and 40 in each other domain.' : '200 questions, 40 per domain.') +
      ' The highest score in each column is bold and the runner-up is underlined.'
    : 'Exact-match accuracy (%) for ' + scene + ' · ' + cases.find(c => c.id === scene).title + '. ' +
      (scene === 'S11' ? 'Ten questions at each length (k = 3–6 events).' : 'Ten questions at each length (k = 1–6 events).');
  if (isTaskMatrix) {
    note = 'Complete sequences on ' + k + '-event questions · ten questions per apparatus. ' +
      (k < 3 ? 'S11 begins at three events (—). ' : '') +
      'Bold and underlined scores rank first and second within each column.';
  }
  if (isDomain && k === 6) {
    const rows = tables.domains.rows.map(row => ({
      ...row,
      counts:row.values.map((value, index) => {
        const total = index === 5 ? 200 : 40;
        return Math.round(value * total / 100) + ' / ' + total + ' correct';
      })
    }));
    renderLeaderboard({columns:physicalDomains, rows, label:'Model'}, note, 'domains-k6');
    return;
  } else {
    $('#results').replaceChildren();
    $('#table-note').textContent = note;
    $('#leaderboard-status').textContent = 'Loading results…';
    $('#download').hidden = true;
  }
  try {
    const records = await readResults(source);
    if (version !== leaderboardVersion) return;
    if (isTaskMatrix) {
      const matrix = scoreMatrix(records.filter(r => Number(r.k) === k), cases.map(item => item.id), r => r.scene);
      matrix.columns = cases.map(item => item.id + ' · ' + item.title);
      matrix.apparatuses = cases;
      matrix.showCounts = $('#matrix-values').value === 'counts';
      renderLeaderboard(matrix, note, 'tasks-k'+k+(matrix.showCounts ? '-counts' : ''));
      return;
    }
    const matrix = isDomain
      ? scoreMatrix(records.filter(r => Number(r.k) === k), physicalDomains, r => r.domain)
      : scoreMatrix(records.filter(r => r.scene === scene), lengths, r => Number(r.k));
    matrix.columns = isDomain ? physicalDomains : lengthNames;
    renderLeaderboard(matrix, note, isDomain ? 'domains-k'+k : scene+'-by-length');
  } catch {
    if (version !== leaderboardVersion) return;
    $('#leaderboard-status').textContent = 'Open the CSV for the full results.';
    const link = $('#download');
    link.hidden = false;
    link.href = resultDirectory + source + '.csv';
    link.download = source + '.csv';
  }
}

function chooseView(view, updateHash = true) {
  leaderboard.view = view;
  leaderboard.sort = view === 'domains' || view === 'scenes' ? 5 : null;
  leaderboard.ascending = false;
  if (updateHash) {
    const fragments = {domains:'domain-k'+leaderboard.k, tasks:'tasks-k'+leaderboard.k, scenes:'apparatus-'+leaderboard.scene};
    const fragment = fragments[view] || 'scores-' + view;
    history.replaceState(null, '', '#' + fragment);
  }
  updateLeaderboard();
}
for (const k of lengths) {
  const button = node('button', k);
  button.type = 'button';
  button.dataset.events = k;
  button.setAttribute('aria-label', k + (k === 1 ? ' event' : ' events'));
  button.onclick = () => { leaderboard.k = k; chooseView(leaderboard.view); };
  $('.k-options').append(button);
}
for (const item of cases) $('#result-apparatus').add(new Option(item.id + ' · ' + item.title, item.id));
$('#result-apparatus').onchange = event => { leaderboard.scene = event.target.value; chooseView('scenes'); };
$('#matrix-values').onchange = updateLeaderboard;
document.querySelectorAll('[data-table]').forEach(button => { button.onclick = () => chooseView(button.dataset.table); });

const views = {
  adaptation_by_length: ['Adaptation by run and question length', 'Training and adaptation'],
  adaptation_by_domain: ['Adaptation by physical domain', 'Training and adaptation'],
  adaptation_by_scene: ['Adaptation by apparatus', 'Training and adaptation'],
  adaptation_by_position: ['Adaptation by event position', 'Training and adaptation'],
  paired_training: ['Paired outcomes against SFT', 'Training and adaptation'],
  training_case: ['Recorded predictions in Figure 5', 'Training and adaptation'],
  effort_results: ['Reasoning effort in Figure 6', 'Model analysis'],
  figure1: ['Six-event scores in Figure 1', 'Model analysis'],
  model_protocols: ['Main-evaluation reasoning mode', 'Model analysis'],
  main_event_by_length: ['Event accuracy by question length', 'Model analysis'],
  error_categories: ['Error categories', 'Model analysis'],
  event_positions: ['Accuracy by event position', 'Model analysis'],
  compound_by_length: ['Single- and two-label events', 'Model analysis'],
  uniform_reference: ['Uniform-choice reference', 'Benchmark'],
  scene_controls: ['Apparatus and event statistics', 'Benchmark'],
  benchmark_comparison: ['Related benchmark comparison', 'Benchmark']
};
const detailSelect = $('#detail-view');
for (const group of new Set(Object.values(views).map(view => view[1]))) {
  const options = node('optgroup');
  options.label = group;
  for (const [key, [name, section]] of Object.entries(views)) {
    if (section === group) options.append(new Option(name, key));
  }
  detailSelect.append(options);
}

const unique = values => [...new Set(values)];
const setSelectOptions = (entries, current) => entries.map(([value, name]) => new Option(name, value, false, value === current));
const detailState = {scene:'S01', domain:'', k:'6', metric:'accuracy_pct', stage:'Final', model:''};
let detailVersion = 0;
function adaptationAnchor() {
  const query = new URLSearchParams();
  if (detailState.domain) query.set('domain', detailState.domain);
  if (detailState.metric === 'event_accuracy_pct') query.set('metric', 'event');
  return '#table-adaptation_by_domain-k' + detailState.k + (query.size ? '?' + query : '');
}
function detailFilter(key, title, options, rerender) {
  const label = node('label', title);
  const select = node('select');
  select.id = 'detail-' + key;
  select.replaceChildren(...setSelectOptions(options, detailState[key]));
  select.onchange = () => {
    detailState[key] = select.value;
    if (detailSelect.value === 'adaptation_by_domain') history.replaceState(null, '', adaptationAnchor());
    rerender();
    document.getElementById(select.id)?.focus({preventScroll:true});
  };
  label.append(select);
  $('#detail-filters').append(label);
}

function pivotRows(records, rowKey, columnKey, columnOrder, metric, labelFields, format = percent) {
  const grouped = new Map();
  for (const r of records) {
    const key = rowKey(r);
    if (!grouped.has(key)) grouped.set(key, {labels:labelFields(r), values:new Map()});
    grouped.get(key).values.set(columnKey(r), r[metric]);
  }
  return [...grouped.values()].map(group => [...group.labels, ...columnOrder.map(key => format(group.values.get(key)))]);
}

function detailTable(headers, records, textColumns, caption, linkColumn = -1) {
  const table = $('#detail-table');
  table.replaceChildren();
  table.setAttribute('aria-label', views[detailSelect.value][0]);
  const head = table.createTHead().insertRow();
  headers.forEach((label, i) => {
    const th = node('th', label);
    th.scope = 'col';
    if (textColumns.includes(i)) th.className = 'text';
    head.append(th);
  });
  const body = table.createTBody();
  for (const record of records) {
    const row = body.insertRow();
    record.forEach((value, i) => {
      const cell = node(i === 0 ? 'th' : 'td');
      if (!i) cell.scope = 'row';
      if (textColumns.includes(i)) cell.classList.add('text');
      if (String(value).length > 52) cell.classList.add('long-text');
      if (i === linkColumn && value) {
        const a = node('a', 'Source');
        a.href = value;
        cell.append(a);
      } else {
        cell.textContent = value === '' || value === undefined ? '—' : value;
      }
      row.append(cell);
    });
  }
  $('#detail-note').textContent = caption;
  $('#detail-note').hidden = !caption;
  $('#detail-wrapper').hidden = false;
  $('#detail-status').textContent = '';
}

function displayDetailed(view, records) {
  const filters = $('#detail-filters');
  filters.replaceChildren();
  const rerender = () => displayDetailed(view, records);
  if (view === 'adaptation_by_scene') {
    detailFilter('scene', 'Apparatus', cases.map(c => [c.id, c.id + ' · ' + c.title]), rerender);
  }
  if (['adaptation_by_domain','compound_by_length','paired_training'].includes(view)) {
    detailFilter('k', 'Events per question', lengths.map(k => [String(k), String(k)]), rerender);
  }
  if (view === 'adaptation_by_domain') {
    detailFilter('domain', 'Physical domain', [['','All domains'], ...physicalDomains.map(d => [d,nameFor(d)])], rerender);
  }
  if (view === 'effort_results') {
    detailFilter('stage', 'Response scored', [['Primary','Initial answer'],['Final','Final answer']], rerender);
  }
  if (['adaptation_by_domain','adaptation_by_scene','adaptation_by_length','effort_results'].includes(view)) {
    detailFilter('metric', 'Metric', [['accuracy_pct','Sequence exact match'],['event_accuracy_pct','Event accuracy']], rerender);
  }
  const metric = detailState.metric;
  if (view === 'adaptation_by_domain') {
    const rows = records.filter(r => r.k === detailState.k);
    const labels = r => [r.model, r.method, r.run];
    const individualEvents = metric === 'event_accuracy_pct';
    const unit = individualEvents ? 'events' : 'questions';
    const title = individualEvents ? 'Event accuracy (%)' : 'Sequence exact match (%)';
    const denominators = rows.filter(r => r.runs === '1');
    const total = d => {
      const record = denominators.find(r => r.domain === d);
      return individualEvents ? record.total_events : record.total;
    };
    if (detailState.domain) {
      const selected = rows.filter(r => r.domain === detailState.domain);
      detailTable(['Model','Method','Run','Correct',individualEvents ? 'Events' : 'Questions',title],
        selected.map(r => [...labels(r), individualEvents ? r.correct_events : r.correct,
          individualEvents ? r.total_events : r.total, detailedPercent(r[metric])]), [0,1,2],
        nameFor(detailState.domain) + ' · ' + total(detailState.domain) + ' ' + unit + ' per run. Mean rows combine the counts from both seeds.');
    } else {
      const table = pivotRows(rows, r => JSON.stringify(labels(r)), r => r.domain, physicalDomains, metric, labels, detailedPercent);
      detailTable(['Model','Method','Run',...physicalDomains.map(d => nameFor(d) + ' (n = ' + total(d) + ')')],table,[0,1,2],
        title + '. Column headings give ' + unit + ' per run. Mean rows combine the two training seeds.');
    }
  } else if (view === 'adaptation_by_position') {
    const labels = r => [r.model,r.method,r.run];
    const rows = pivotRows(records, r => JSON.stringify(labels(r)), r => Number(r.position), lengths, 'accuracy_pct', labels);
    detailTable(['Model','Method','Run',...lengths.map(k => 'Event '+k)], rows, [0,1,2],
      'Each position is scored on 200 six-event questions. At event 3, Qwen3.5-9B rises from 57.5% with SFT to 82.0% with SFT + DPO.');
  } else if (view.startsWith('adaptation_by_')) {
    const rows = records.filter(r => view === 'adaptation_by_length' || r.scene === detailState.scene);
    const ks = [...lengths.map(String), 'Overall'];
    const table = pivotRows(rows, r => JSON.stringify([r.model,r.method,r.run]), r => r.k, ks, metric,
      r => [r.model, r.method, r.run]);
    detailTable(['Model','Method','Run',...lengthNames,'Overall'], table, [0,1,2],
      (metric === 'accuracy_pct' ? 'Exact-match accuracy (%). Overall pools questions across lengths.' : 'Event accuracy (%). Overall pools events across question lengths.') +
      ' SimPO and KTO each use two training seeds.' +
      (view === 'adaptation_by_scene' && detailState.scene === 'S11' ? ' S11 has questions at three to six events.' : ''));
  } else if (view === 'paired_training') {
    const rows = records.filter(r => r.k === detailState.k);
    detailTable(['Adapted method','Training seed','Both correct','Adapted only','SFT only','Both incorrect','Questions'],
      rows.map(r => [r.method,r.seed,r.both_correct,r.adapted_only,r.sft_only,r.both_incorrect,r.questions]), [0],
      'Each row compares a preference-trained checkpoint with Qwen3.5-9B SFT on the same questions.');
  } else if (view === 'effort_results') {
    const rows = records.filter(r => r.stage === detailState.stage);
    const key = r => r.model + ' · ' + r.effort;
    const columns = unique(rows.map(key));
    const table = pivotRows(rows, r => r.scene, key, columns, metric, r => [r.scene, r.apparatus]);
    detailTable(['Scene','Apparatus',...columns], table, [0,1],
      (metric === 'accuracy_pct' ? 'Six-event exact-match accuracy (%).' : 'Correct event sets across six-event answers (%).') +
      ' Ten episodes per apparatus.');
  } else if (view === 'training_case') {
    detailTable(['Event','Reference','Baseline','SimPO · 20261108','SimPO · 20261109'],
      records.map(r => [r.event,r.reference,r.baseline,r.simpo_20261108,r.simpo_20261109]), [1,2,3,4],
      'Dielectric response (S11), Figure 5. Each SimPO column is one training seed.');
  } else if (view === 'figure1') {
    detailTable(['Model','Correct','Questions','Exact match (%)'],
      records.map(r => [r.model,r.correct,r.total,percent(r.accuracy_pct)]), [0],
      'Figure 1. Exact matches on 200 six-event questions.');
  } else if (view === 'model_protocols') {
    detailFilter('model', 'Model', [['','All ' + records.length + ' models'], ...records.map(r => [r.model,r.model])], rerender);
    const rows = records.filter(r => !detailState.model || r.model === detailState.model);
    detailTable(['Model','Reasoning mode'], rows.map(r => [r.model,r.reasoning]), [0,1],
      'Enabled lets the model choose its reasoning effort. Default uses the provider’s setting.');
  } else if (view === 'main_event_by_length') {
    const columns = [...lengths.map(String), 'Overall'];
    const table = pivotRows(records, r => r.model_key, r => r.k, columns, 'event_accuracy_pct', r => [r.model], detailedPercent);
    detailTable(['Model',...lengthNames,'Overall'], table, [0],
      'An event is correct when its entire control set matches the reference. Overall accuracy covers 4,170 event predictions across 1,180 questions.');
  } else if (view === 'event_positions') {
    const columns = lengths.map(String);
    const table = pivotRows(records, r => r.model_key, r => r.position, columns, 'accuracy_pct', r => [r.model]);
    detailTable(['Model',...lengths.map(k => 'Event ' + k)], table, [0],
      'Percentage of the 200 six-event questions with the correct control set at each event position.');
  } else if (view === 'compound_by_length') {
    const rows = records.filter(r => r.k === detailState.k);
    const columns = unique(rows.map(r => r.composition));
    const table = pivotRows(rows, r => r.model_key, r => r.composition, columns, 'accuracy_pct', r => [r.model]);
    const headers = columns.map(c => c + ' (n = ' + rows.find(r => r.composition === c).total + ')');
    detailTable(['Model',...headers], table, [0],
      'Exact-match accuracy (%) by the labels in the first ' + detailState.k + (detailState.k === '1' ? ' event.' : ' events.') +
      ' A two-label event encodes concurrent controls or two parameters of one intervention.');
  } else if (view === 'error_categories') {
    detailTable(['Primary category','Cases','Direct support','Limited support'],
      records.map(r => [r.category,r.total,r.direct,r.limited]), [0],
      'Each answer has one primary error. The two support columns rate the evidence for that assignment. Of the 100 answers, 97 are from Gemini 3.8 Flash, two from GLM-5.3 Flash and one from GPT-6.1 Sol.');
  } else if (view === 'uniform_reference') {
    const format = value => {
      if (!value) return '—';
      const number = Number(value);
      return number > 0 && number < 0.001 ? number.toExponential(2) : Number(number.toPrecision(3)).toString();
    };
    const rows = pivotRows(records, r => r.domain, r => r.k, lengths.map(String), 'expected_exact_pct', r => [r.domain], format);
    detailTable(['Domain',...lengthNames], rows, [0],
      'Expected exact match (%) for independent uniform choices among the allowed control sets at each event, averaged over questions.');
  } else if (view === 'scene_controls') {
    detailTable(['Scene','Apparatus','Domain','Episodes','Labels','Candidate sets','Single-label events','Two-label events','Total events'],
      records.map(r => [r.scene,r.apparatus,r.domain,r.episodes,r.labels,r.candidate_sets,r.single_events,r.paired_events,r.events]), [0,1,2],
      'Each apparatus contributes 60 events from ten test episodes.');
  } else if (view === 'benchmark_comparison') {
    detailTable(['Benchmark','Evidence','Task','Response','Source'],
      records.map(r => [r.benchmark,r.evidence,r.task,r.response,r.source]), [0,1,2,3,4],
      '', 4);
  }
}

async function loadDetail() {
  const version = ++detailVersion;
  const view = detailSelect.value;
  const source = view === 'model_protocols' ? 'model_reasoning' : view;
  $('#detail-wrapper').hidden = true;
  $('#detail-filters').replaceChildren();
  $('#detail-note').textContent = '';
  $('#detail-download').href = resultDirectory + source + '.csv';
  $('#detail-status').textContent = 'Loading results…';
  try {
    const records = await readResults(source);
    if (version === detailVersion) displayDetailed(view, records);
  } catch {
    if (version === detailVersion) $('#detail-status').textContent = 'Open the CSV to view this table.';
  }
}
detailSelect.onchange = () => {
  history.replaceState(null, '', detailSelect.value === 'adaptation_by_domain' ? adaptationAnchor() : '#table-' + detailSelect.value);
  loadDetail();
};
document.querySelectorAll('a[data-detail]').forEach(link => {
  link.onclick = event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.replaceState(null, '', link.hash);
    openResultAnchor();
  };
});
function openResultAnchor() {
  const key = location.hash.slice(1);
  const byLength = /^(domain|tasks)-k([1-6])$/.exec(key);
  const adaptation = /^table-adaptation_by_domain(?:-k([1-6]))?(?:\?(.+))?$/.exec(key);
  if (byLength) {
    leaderboard.k = Number(byLength[2]);
    chooseView(byLength[1] === 'tasks' ? 'tasks' : 'domains', false);
  } else if (key.startsWith('apparatus-') && cases.some(c => c.id === key.slice(10))) {
    leaderboard.scene = key.slice(10);
    $('#result-apparatus').value = leaderboard.scene;
    chooseView('scenes', false);
  } else if (key === 'scores-length' || key === 'scores-methods') {
    chooseView(key.slice(7), false);
  } else if (adaptation || (key.startsWith('table-') && Object.hasOwn(views, key.slice(6)))) {
    if (adaptation) {
      const params = new URLSearchParams(adaptation[2]);
      detailState.k = adaptation[1] || '6';
      detailState.domain = physicalDomains.includes(params.get('domain')) ? params.get('domain') : '';
      detailState.metric = params.get('metric') === 'event' ? 'event_accuracy_pct' : 'accuracy_pct';
    } else if (key === 'table-effort_results') {
      detailState.stage = 'Final';
      detailState.metric = 'accuracy_pct';
    }
    detailSelect.value = adaptation ? 'adaptation_by_domain' : key.slice(6);
    loadDetail();
    requestAnimationFrame(() => $('#detailed-results').scrollIntoView({block:'start',behavior:'instant'}));
    return;
  } else {
    return;
  }
  const target = key.startsWith('tasks-k') ? $('#leaderboard .tabs') : $('#leaderboard');
  requestAnimationFrame(() => target.scrollIntoView({block:'start',behavior:'instant'}));
}
window.addEventListener('hashchange', openResultAnchor);
openResultAnchor();
if (!leaderboardVersion) updateLeaderboard();
whenNear($('#detailed-results'), () => { if (!detailVersion) loadDetail(); });
function lengthComparison() {
  const figure = document.getElementById('length-comparison');
  const copy = node('div',undefined,'trend-copy'), heading = node('h3','Exact match by question length');
  const selectors = node('div',undefined,'trend-selectors');
  const models = tables.length.rows;
  const labels = ['First model', 'Second model'];
  const picks = ['GPT-6.1 Sol','Gemini 3.8 Flash'].map((name, i) => {
    const label=node('label');
    const marker=node('span',undefined,'trend-key key-'+i);
    marker.setAttribute('aria-hidden','true');
    const select=node('select');
    select.setAttribute('aria-label',labels[i]);
    for (const row of models) select.add(new Option(row.name, row.name));
    select.value=name; label.append(marker,select); selectors.append(label); return select;
  });
  copy.append(heading,selectors);
  const plot=node('div',undefined,'trend-plot'), ns='http://www.w3.org/2000/svg';
  const graphic=(parent,tag,attrs,text='')=>{
    const e=document.createElementNS(ns,tag);
    for (const [key,value] of Object.entries(attrs)) e.setAttribute(key,String(value));
    if (text) e.textContent=text;
    parent.append(e); return e;
  };
  function draw() {
    const svg=document.createElementNS(ns,'svg'); svg.setAttribute('viewBox','0 0 490 190');
    svg.setAttribute('role','img');
    const series=picks.map((select,i)=>{
      const other=picks[1-i].value;
      for (const option of select.options) option.disabled=option.value===other;
      return models.find(row=>row.name===select.value);
    });
    svg.setAttribute('aria-label', series.map(row=>row.name+': '+row.values.slice(0,6).map(percent).join(', ')+' percent for one to six events').join('. '));
    const x=i=>39+i*87, y=v=>145-1.19*v;
    graphic(svg,'text',{x:7,y:14,class:'axis-title'},'Exact match (%)');
    for(const mark of [0,25,50,75,100]) {
      graphic(svg,'line',{x1:x(0),x2:x(5),y1:y(mark),y2:y(mark),class:'chart-grid'});
      graphic(svg,'text',{x:29,y:y(mark)+4,'text-anchor':'end'},String(mark));
    }
    for(let i=0;i<6;i++) graphic(svg,'text',{x:x(i),y:162,'text-anchor':'middle'},String(i+1));
    graphic(svg,'text',{x:253,y:183,'text-anchor':'middle',class:'axis-title'},'Events per question');
    series.forEach((row,j)=>{
      const points=row.values.slice(0,6).map((value,i)=>[x(i),y(value)]);
      const group=graphic(svg,'g',{class:'trend-line series-'+j});
      graphic(group,'polyline',{points:points.map(p=>p.join(',')).join(' '),fill:'none'});
      points.forEach(([cx,cy],i)=>{
        const dot=j ? graphic(group,'path',{d:'M'+cx+' '+(cy-3.7)+'l3.7 3.7 -3.7 3.7 -3.7 -3.7Z'}) : graphic(group,'circle',{cx,cy,r:3.4});
        graphic(dot,'title',{},row.name+', '+(i+1)+' events: '+percent(row.values[i])+'%');
      });
    });
    const caption=node('p',undefined,'trend-caption');
    for(const [i,row] of series.entries()){
      const item=node('span');item.append(node('i',undefined,'key-'+i),node('b',percent(row.values[0])+'% → '+percent(row.values[5])+'%'));
      item.setAttribute('aria-label',row.name+', one event to six events'); caption.append(item);
    }
    plot.replaceChildren(svg,caption);
  }
  picks.forEach(select=>select.onchange=draw);
  figure.append(copy,plot); draw(); figure.hidden=false;
}
lengthComparison();
