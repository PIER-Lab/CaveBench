'use strict';

const resultDirectory = 'assets/results/';
// Match the paper's nearest-even formatting for nonnegative binary floats.
// At one decimal, .25 is the only exact halfway fraction that toFixed rounds to an odd digit.
function percent(value) {
  if (value === '' || value === undefined || value === null) return '—';
  const number = Number(value);
  return number % 1 === 0.25 ? Math.floor(number) + '.2' : number.toFixed(1);
}
const cachedResults = new Map();
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
    const promise = fetch(resultDirectory + name + '.csv').then(response => {
      if (!response.ok) throw new Error('Missing table ' + name);
      return response.text();
    }).then(csvRows).catch(error => {
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
    lines.push([row.group, row.name, ...row.values.map(v => v === null ? '' : percent(v))]);
  }
  const csv = lines.map(line => line.map(quote).join(',')).join('\r\n') + '\r\n';
  csvDownloadUrl = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8'}));
  const link = $('#download');
  link.href = csvDownloadUrl;
  link.download = 'CaveBench-' + filename + '.csv';
}

function renderLeaderboard(table, note, filename) {
  const element = $('#results');
  const visibleRows = [];
  element.replaceChildren();
  element.setAttribute('aria-label', note);
  const head = element.createTHead().insertRow();
  [table.label, ...table.columns].forEach((name, i) => {
    const col = i - 1;
    const sorted = leaderboard.sort === col;
    const th = node('th');
    th.scope = 'col';
    th.setAttribute('aria-sort', sorted ? (leaderboard.ascending ? 'ascending' : 'descending') : 'none');
    const button = node('button', name + (sorted ? (leaderboard.ascending ? ' ↑' : ' ↓') : ''));
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
  const allRanks = leaderboard.view === 'domains' ? table.columns.map((_, i) =>
    [...new Set(table.rows.map(row => row.values[i]).filter(value => value !== null))].sort((a,b) => b-a)) : null;
  for (const group of new Set(table.rows.map(row => row.group))) {
    const body = element.createTBody();
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
        const td = node('td', percent(value));
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
      counts:cells.map(r => r && Number(r.total) > 0 ? r.correct + ' / ' + r.total + ' correct' : 'No eligible questions')
    });
  }
  return {label:'Model', rows};
}

async function updateLeaderboard() {
  const version = ++leaderboardVersion;
  const {view, k, scene} = leaderboard;
  $('#k-filter').hidden = view !== 'domains';
  $('#apparatus-filter').hidden = view !== 'scenes';
  document.querySelectorAll('[data-table]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.table === view)));
  document.querySelectorAll('[data-events]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.events) === k)));
  if (view === 'methods' || view === 'length') {
    const source = tables[view];
    renderLeaderboard({...source, label:view === 'methods' ? 'Method' : 'Model'},
      'Exact-match accuracy (%). Overall pools all 1,180 questions.', view);
    return;
  }
  const source = view === 'domains' ? 'domain_by_length' : 'scene_by_length';
  const isDomain = view === 'domains';
  const note = isDomain
    ? 'Exact-match accuracy (%) at k = ' + k + '. ' + (k < 3 ? '190 questions, including 30 in electromagnetism and 40 in each other domain.' : '200 questions, 40 per domain.') +
      ' Across all 27 configurations, bold marks the highest score per column and underlining marks the next distinct score. Ties share the same mark.'
    : scene + ' · ' + cases.find(c => c.id === scene).title + '. Ten questions per reported length.' +
      (scene === 'S11' ? ' S11 begins at three events. A dash marks an untested length.' : '');
  if (isDomain && k === 6) {
    renderLeaderboard({...tables.domains, label:'Model'}, note, 'domains-k6');
    if (location.protocol === 'file:') return;
  } else {
    $('#results').replaceChildren();
    $('#table-note').textContent = note;
    $('#leaderboard-status').textContent = 'Loading results…';
    $('#download').hidden = true;
  }
  try {
    const records = await readResults(source);
    if (version !== leaderboardVersion) return;
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
    const fragment = view === 'domains' ? 'domain-k' + leaderboard.k : view === 'scenes' ? 'apparatus-' + leaderboard.scene : 'scores-' + view;
    history.replaceState(null, '', '#' + fragment);
  }
  updateLeaderboard();
}
for (const k of lengths) {
  const button = node('button', k);
  button.type = 'button';
  button.dataset.events = k;
  button.setAttribute('aria-label', k + (k === 1 ? ' event' : ' events'));
  button.onclick = () => { leaderboard.k = k; chooseView('domains'); };
  $('.k-options').append(button);
}
for (const item of cases) $('#result-apparatus').add(new Option(item.id + ' · ' + item.title, item.id));
$('#result-apparatus').onchange = event => { leaderboard.scene = event.target.value; chooseView('scenes'); };
document.querySelectorAll('[data-table]').forEach(button => { button.onclick = () => chooseView(button.dataset.table); });
updateLeaderboard();

const views = {
  adaptation_by_length: ['Adaptation by run and question length', 'Training and adaptation'],
  adaptation_by_scene: ['Adaptation by apparatus', 'Training and adaptation'],
  paired_training: ['Paired outcomes against SFT', 'Training and adaptation'],
  training_case: ['Recorded predictions in Figure 5', 'Training and adaptation'],
  effort_results: ['Reasoning effort in Figure 6', 'Model analysis'],
  figure1: ['Six-event scores in Figure 1', 'Model analysis'],
  model_protocols: ['Evaluation settings by model', 'Model analysis'],
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
const detailState = {scene:'S01', k:'6', metric:'accuracy_pct', stage:'Final', model:''};
let detailVersion = 0;
function detailFilter(key, title, options, rerender) {
  const label = node('label', title);
  const select = node('select');
  select.id = 'detail-' + key;
  select.replaceChildren(...setSelectOptions(options, detailState[key]));
  select.onchange = () => { detailState[key] = select.value; rerender(); };
  label.append(select);
  $('#detail-filters').append(label);
}

// Only the presentation is pivoted. Counts and unrounded source values travel with the downloads.
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
  if (view === 'compound_by_length' || view === 'paired_training') {
    detailFilter('k', 'Events per question', lengths.map(k => [String(k), String(k)]), rerender);
  }
  if (view === 'effort_results') {
    detailFilter('stage', 'Response scored', [['Primary','Initial answer'],['Final','Final answer']], rerender);
  }
  if (['adaptation_by_scene','adaptation_by_length','effort_results'].includes(view)) {
    detailFilter('metric', 'Metric', [['accuracy_pct','Sequence exact match'],['event_accuracy_pct','Event accuracy']], rerender);
  }
  const metric = detailState.metric;
  if (view.startsWith('adaptation_by_')) {
    const rows = records.filter(r => view === 'adaptation_by_length' || r.scene === detailState.scene);
    const ks = [...lengths.map(String), 'Overall'];
    const table = pivotRows(rows, r => JSON.stringify([r.model,r.method,r.run]), r => r.k, ks, metric,
      r => [r.model, r.method, r.run]);
    detailTable(['Model','Method','Run',...lengthNames,'Overall'], table, [0,1,2],
      (metric === 'accuracy_pct' ? 'Exact-match accuracy (%).' : 'Correctly predicted event sets (%).') +
      ' Individual training runs and their reported means are shown separately. Overall pools all eligible lengths.' +
      (view === 'adaptation_by_scene' && detailState.scene === 'S11' ? ' S11 has questions at three to six events.' : ''));
  } else if (view === 'paired_training') {
    const rows = records.filter(r => r.k === detailState.k);
    detailTable(['Adapted method','Training seed','Both correct','Adapted only','SFT only','Both incorrect','Questions'],
      rows.map(r => [r.method,r.seed,r.both_correct,r.adapted_only,r.sft_only,r.both_incorrect,r.questions]), [0],
      'Each column counts exact matches for the same question IDs, pairing the supervised Qwen3.5-9B checkpoint with one preference-training run.');
  } else if (view === 'effort_results') {
    const rows = records.filter(r => r.stage === detailState.stage);
    const key = r => r.model + ' · ' + r.effort;
    const columns = unique(rows.map(key));
    const table = pivotRows(rows, r => r.scene, key, columns, metric, r => [r.scene, r.apparatus]);
    detailTable(['Scene','Apparatus',...columns], table, [0,1],
      (metric === 'accuracy_pct' ? 'Six-event exact-match accuracy (%).' : 'Correct event sets across six-event answers (%).') +
      ' Each apparatus contributes ten episodes. The final answer includes conditional answer completion.');
  } else if (view === 'training_case') {
    detailTable(['Event','Reference','Baseline','SimPO · 20261108','SimPO · 20261109'],
      records.map(r => [r.event,r.reference,r.baseline,r.simpo_20261108,r.simpo_20261109]), [1,2,3,4],
      'Recorded control predictions for the dielectric-response example in Figure 5.');
  } else if (view === 'figure1') {
    detailTable(['Model','Correct','Questions','Exact match (%)'],
      records.map(r => [r.model,r.correct,r.total,percent(r.accuracy_pct)]), [0],
      'Six-event exact-match accuracy for the model configurations shown in Figure 1.');
  } else if (view === 'model_protocols') {
    const models = new Map(records.map(r => [r.model_key,r.model]));
    detailFilter('model', 'Model', [['','All ' + models.size + ' models'], ...models], rerender);
    const rows = records.filter(r => !detailState.model || r.model_key === detailState.model);
    detailTable(['Model','Visual input','Reasoning setting','Initial token cap','Answer completion','Completion token cap','Questions','Completion answers scored'],
      rows.map(r => [r.model,r.input_format,r.reasoning,r.primary_token_cap,r.completion_policy,r.completion_token_cap,r.questions,r.completion_selected]), [0,1,2,4],
      'Each row shows the settings used for a group of scored questions. The last column counts questions for which the completion answer was selected for scoring.');
  } else if (view === 'event_positions') {
    const columns = lengths.map(String);
    const table = pivotRows(records, r => r.model_key, r => r.position, columns, 'accuracy_pct', r => [r.model]);
    detailTable(['Model',...lengths.map(k => 'Event ' + k)], table, [0],
      'Accuracy (%) for the complete control set at each event position in the 200 six-event questions. The CSV includes the number correct at each position.');
  } else if (view === 'compound_by_length') {
    const rows = records.filter(r => r.k === detailState.k);
    const columns = unique(rows.map(r => r.composition));
    const table = pivotRows(rows, r => r.model_key, r => r.composition, columns, 'accuracy_pct', r => [r.model]);
    const headers = columns.map(c => c + ' (n = ' + rows.find(r => r.composition === c).total + ')');
    detailTable(['Model',...headers], table, [0],
      'Exact-match accuracy (%) by the labels in the first ' + detailState.k + (detailState.k === '1' ? ' event.' : ' events.') +
      ' Two labels can denote concurrent controls or two parameters of one intervention. The groups can contain different apparatuses.');
  } else if (view === 'error_categories') {
    detailTable(['Primary category','Cases','Direct support','Limited support'],
      records.map(r => [r.category,r.total,r.direct,r.limited]), [0],
      'Each of the 100 selected erroneous answers has one primary category. Support refers to the evidence for that diagnosis.');
  } else if (view === 'uniform_reference') {
    const format = value => {
      if (!value) return '—';
      const number = Number(value);
      return number > 0 && number < 0.001 ? number.toExponential(2) : Number(number.toPrecision(3)).toString();
    };
    const rows = pivotRows(records, r => r.domain, r => r.k, lengths.map(String), 'expected_exact_pct', r => [r.domain], format);
    detailTable(['Domain',...lengthNames], rows, [0],
      'Expected exact-match accuracy (%) when an event set is chosen independently and uniformly from each question’s offered sets. Values average the question-specific probabilities.');
  } else if (view === 'scene_controls') {
    detailTable(['Scene','Apparatus','Domain','Episodes','Labels','Candidate sets','Single-label events','Two-label events','Total events'],
      records.map(r => [r.scene,r.apparatus,r.domain,r.episodes,r.labels,r.candidate_sets,r.single_events,r.paired_events,r.events]), [0,1,2],
      'Control vocabulary and event composition for each apparatus.');
  } else if (view === 'benchmark_comparison') {
    detailTable(['Benchmark','Evidence','Task','Response','Source'],
      records.map(r => [r.benchmark,r.evidence,r.task,r.response,r.source]), [0,1,2,3,4],
      'Benchmarks compared by the evidence presented, task and requested response.', 4);
  }
}

async function loadDetail() {
  const version = ++detailVersion;
  const view = detailSelect.value;
  $('#detail-wrapper').hidden = true;
  $('#detail-filters').replaceChildren();
  $('#detail-note').textContent = '';
  $('#detail-download').href = resultDirectory + view + '.csv';
  $('#detail-status').textContent = 'Loading results…';
  try {
    const records = await readResults(view);
    if (version === detailVersion) displayDetailed(view, records);
  } catch {
    if (version === detailVersion) $('#detail-status').textContent = 'Open the CSV to view this table.';
  }
}
detailSelect.onchange = () => {
  history.replaceState(null, '', '#table-' + detailSelect.value);
  loadDetail();
};
document.querySelectorAll('a[data-detail]').forEach(link => {
  link.href = '#table-' + link.dataset.detail;
  link.onclick = event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    detailSelect.value = link.dataset.detail;
    history.replaceState(null, '', link.hash);
    loadDetail();
    $('#detailed-results').scrollIntoView({block:'start'});
  };
});
loadDetail();
function openResultAnchor() {
  const key = location.hash.slice(1);
  const domain = /^domain-k([1-6])$/.exec(key);
  if (domain) {
    leaderboard.k = Number(domain[1]);
    chooseView('domains', false);
  } else if (key.startsWith('apparatus-') && cases.some(c => c.id === key.slice(10))) {
    leaderboard.scene = key.slice(10);
    $('#result-apparatus').value = leaderboard.scene;
    chooseView('scenes', false);
  } else if (key === 'scores-length' || key === 'scores-methods') {
    chooseView(key.slice(7), false);
  } else if (key.startsWith('table-') && Object.hasOwn(views, key.slice(6))) {
    detailSelect.value = key.slice(6);
    loadDetail();
    requestAnimationFrame(() => $('#detailed-results').scrollIntoView({block:'start'}));
    return;
  } else {
    return;
  }
  requestAnimationFrame(() => $('#leaderboard').scrollIntoView({block:'start'}));
}
window.addEventListener('hashchange', openResultAnchor);
openResultAnchor();
