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
const lengths = [1, 2, 3, 4, 5, 6];
const eventNames = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
const leaderboard = {k: 6, sort: null, ascending: false};
let leaderboardVersion = 0;

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

function apparatusMatrix(records, k) {
  const byModel = new Map();
  for (const record of records) {
    if (Number(record.k) !== k) continue;
    if (!byModel.has(record.model_key)) {
      byModel.set(record.model_key, {name: record.model, group: record.group, scores: new Map()});
    }
    byModel.get(record.model_key).scores.set(record.scene, record);
  }
  return Array.from(byModel.values(), model => ({
    name: model.name,
    group: model.group,
    values: cases.map(item => {
      const record = model.scores.get(item.id);
      return record && Number(record.total) > 0 ? Number(record.accuracy_pct) : null;
    })
  }));
}

function apparatusFinding(maxima) {
  const eligible = maxima.filter(Number.isFinite);
  const perfect = eligible.filter(value => value === 100).length;
  const first = 'At least one model solves all ten questions on ' + perfect + ' of the ' +
    eligible.length + ' eligible apparatuses.';
  const lowest = Math.min(...eligible);
  if (lowest === 100) return first;
  const item = cases[maxima.indexOf(lowest)];
  return first + ' For “' + item.title + '” (' + item.id + '), the best score is ' +
    Math.round(lowest / 10) + ' out of ten.';
}

const resultsTable = $('#results');

// Four scene scores share each physical-domain cell. Track the scene label,
// so that the highlight still identifies one apparatus on a wrapped table.
function highlightScene(source) {
  const target = source instanceof Element ? source.closest('[data-scene]') : null;
  if (target && resultsTable.contains(target) && target.classList.contains('scene-reading')) return;
  for (const cell of resultsTable.querySelectorAll('.scene-reading')) {
    cell.classList.remove('scene-reading');
  }
  if (!target || !resultsTable.contains(target)) return;
  for (const cell of resultsTable.querySelectorAll('[data-scene="' + CSS.escape(target.dataset.scene) + '"]')) {
    cell.classList.add('scene-reading');
  }
}
resultsTable.addEventListener('pointerover', event => {
  if (event.pointerType !== 'touch') highlightScene(event.target);
});
resultsTable.addEventListener('pointerleave', () => highlightScene(document.activeElement));
resultsTable.addEventListener('focusin', event => highlightScene(event.target));
resultsTable.addEventListener('focusout', event => highlightScene(event.relatedTarget));

function renderLeaderboard(rows) {
  const element = $('#results');
  const maxima = cases.map((_, i) => Math.max(...rows.map(row => row.values[i] ?? -Infinity)));
  const domains = new Map();
  cases.forEach((item, i) => {
    if (!domains.has(item.domain)) domains.set(item.domain, []);
    domains.get(item.domain).push(i);
  });
  element.replaceChildren();
  const head = element.createTHead().insertRow();
  function header() {
    const th = node('th');
    th.scope = 'col';
    head.append(th);
    return th;
  }
  function sortButton(col, label, th) {
    const {sort, ascending} = leaderboard;
    const sorted = sort === col;
    const name = col < 0 ? 'Model' : cases[col].id + ' · ' + cases[col].title;
    const button = node('button', label);
    button.type = 'button';
    button.title = 'Sort by ' + name;
    button.setAttribute('aria-label', button.title + (sorted ? (ascending ? ', ascending' : ', descending') : ''));
    if (sorted) {
      button.dataset.direction = ascending ? 'up' : 'down';
      th.setAttribute('aria-sort', ascending ? 'ascending' : 'descending');
    }
    button.dataset.sort = col;
    button.onclick = () => {
      leaderboard.ascending = sorted ? !ascending : col === -1;
      leaderboard.sort = col;
      renderLeaderboard(rows);
      element.querySelector('[data-sort="' + col + '"]').focus({preventScroll: true});
    };
    return button;
  }
  const modelHeader = header();
  modelHeader.append(sortButton(-1, 'Model', modelHeader));
  for (const [domain, cols] of domains) {
    const th = header();
    const grid = node('div', undefined, 'matrix-scores');
    for (const i of cols) {
      const item = cases[i];
      const button = sortButton(i, item.id, th);
      button.dataset.scene = item.id;
      grid.append(button);
    }
    th.append(node('span', nameFor(domain), 'matrix-domain-name'), grid);
  }

  for (const group of new Set(rows.map(row => row.group))) {
    const body = element.createTBody();
    body.dataset.group = group;
    const band = body.insertRow();
    band.className = 'group';
    const heading = node('th', group);
    heading.scope = 'rowgroup';
    heading.colSpan = head.cells.length;
    band.append(heading);
    const groupRows = rows.filter(row => row.group === group);
    const col = leaderboard.sort;
    if (col !== null) {
      const sign = leaderboard.ascending ? 1 : -1;
      groupRows.sort((a, b) => {
        if (col === -1) return sign * a.name.localeCompare(b.name);
        if (a.values[col] === null || b.values[col] === null) return Number(a.values[col] === null) - Number(b.values[col] === null);
        return sign * (a.values[col] - b.values[col]);
      });
    }
    for (const row of groupRows) {
      const tr = body.insertRow();
      const model = node('th', row.name);
      model.scope = 'row';
      tr.append(model);
      for (const cols of domains.values()) {
        const grid = node('div', undefined, 'matrix-scores');
        for (const i of cols) {
          const item = cases[i];
          const value = row.values[i];
          const cell = node('span', percent(value));
          if (value === null) cell.className = 'missing';
          else if (value > 0 && value === maxima[i]) cell.className = 'best';
          cell.dataset.scene = item.id;
          cell.title = item.id + ' · ' + item.title + ': ' + (value === null ? 'No questions at this length' : percent(value) + '%');
          cell.setAttribute('role', 'group');
          cell.setAttribute('aria-label', cell.title);
          grid.append(cell);
        }
        tr.insertCell().append(grid);
      }
    }
  }
  $('.leaderboard-reading').textContent = apparatusFinding(maxima);
  $('.leaderboard-reading').hidden = false;
}

async function updateLeaderboard() {
  const version = ++leaderboardVersion;
  const {k} = leaderboard;
  const note = eventNames[k - 1] + '-event exact-match accuracy (%), ten questions per eligible apparatus.' +
    (k < 3 ? ' S11 begins at three events (—).' : '');
  const element = $('#results');
  element.parentElement.classList.add('task-matrix');
  element.setAttribute('aria-label', note);
  $('#table-note').textContent = note;
  document.querySelectorAll('#k-filter [data-events]').forEach(button =>
    button.setAttribute('aria-pressed', String(Number(button.dataset.events) === k)));
  const status = $('#leaderboard-status');
  status.textContent = 'Loading results…';
  element.setAttribute('aria-busy', 'true');
  try {
    const records = await readResults('scene_by_length');
    if (version !== leaderboardVersion) return;
    renderLeaderboard(apparatusMatrix(records, k));
    status.textContent = '';
  } catch {
    if (version !== leaderboardVersion) return;
    element.replaceChildren();
    $('.leaderboard-reading').hidden = true;
    loadFailure(status, 'Could not load the leaderboard.', updateLeaderboard);
  } finally {
    if (version === leaderboardVersion) element.removeAttribute('aria-busy');
  }
}

for (const k of lengths) {
  const button = node('button', k);
  button.type = 'button';
  button.dataset.events = k;
  button.setAttribute('aria-label', k + (k === 1 ? ' event' : ' events'));
  button.onclick = () => {
    if (leaderboard.k === k) return;
    leaderboard.k = k;
    history.replaceState(history.state, '', '#tasks-k' + k);
    updateLeaderboard();
  };
  $('#k-filter .k-options').append(button);
}

function openResultAnchor() {
  if (window.caveReadingHistory?.restoring) return;
  const key = location.hash.slice(1);
  const byLength = /^(?:domain|tasks)-k([1-6])$/.exec(key);
  if (byLength) {
    leaderboard.k = Number(byLength[1]);
    updateLeaderboard();
  } else if (!['leaderboard', 'scores', 'scores-length', 'scores-methods'].includes(key) &&
             !/^apparatus-S(?:0[1-9]|1[0-9]|20)$/.test(key)) {
    return;
  }
  const target = key === 'scores-length' ? $('#question-length') :
    key === 'scores-methods' ? $('#training-seeds') : $('#leaderboard');
  requestAnimationFrame(() => target?.scrollIntoView({block: 'start', behavior: 'instant'}));
}
window.addEventListener('hashchange', openResultAnchor);
openResultAnchor();
if (!leaderboardVersion) updateLeaderboard();

function lengthComparison() {
  const figure = $('#length-comparison');
  const series = ['GPT-6.1 Sol', 'Gemini 3.8 Flash'].map(name => tables.length.rows.find(row => row.name === name));
  const legend = node('div', undefined, 'trend-legend');
  series.forEach((row, i) => {
    const item = node('span');
    const marker = node('i', undefined, 'trend-key key-' + i);
    marker.setAttribute('aria-hidden', 'true');
    item.append(marker, row.name);
    legend.append(item);
  });
  const ns = 'http://www.w3.org/2000/svg';
  function graphic(parent, tag, attributes, label) {
    const child = document.createElementNS(ns, tag);
    for (const [key, value] of Object.entries(attributes)) child.setAttribute(key, value);
    if (label) child.textContent = label;
    parent.append(child);
    return child;
  }
  const plot = node('div', undefined, 'trend-plot');
  const svg = graphic(plot, 'svg', {viewBox: '0 0 490 190', role: 'img'});
  svg.setAttribute('aria-label', series.map(row => row.name + ': ' +
    row.values.slice(0, 6).map(percent).join(', ') + ' percent for one to six events').join('. '));
  const x = i => 39 + i * 87;
  const y = v => 145 - 1.19 * v;
  graphic(svg, 'text', {x: 7, y: 14, class: 'axis-title'}, 'Exact match (%)');
  for (const mark of [0, 25, 50, 75, 100]) {
    graphic(svg, 'line', {x1: x(0), x2: x(5), y1: y(mark), y2: y(mark), class: 'chart-grid'});
    graphic(svg, 'text', {x: 29, y: y(mark) + 4, 'text-anchor': 'end'}, String(mark));
  }
  lengths.forEach((k, i) => graphic(svg, 'text', {x: x(i), y: 162, 'text-anchor': 'middle'}, String(k)));
  graphic(svg, 'text', {x: 253, y: 183, 'text-anchor': 'middle', class: 'axis-title'}, 'Events per question');
  series.forEach((row, j) => {
    const points = lengths.map((_, i) => [x(i), y(row.values[i])]);
    const group = graphic(svg, 'g', {class: 'trend-line series-' + j});
    graphic(group, 'polyline', {points: points.map(p => p.join(',')).join(' '), fill: 'none'});
    points.forEach(([cx, cy], i) => {
      const dot = j ? graphic(group, 'path', {d: 'M' + cx + ' ' + (cy - 3.7) + 'l3.7 3.7 -3.7 3.7 -3.7 -3.7Z'}) :
        graphic(group, 'circle', {cx, cy, r: 3.4});
      graphic(dot, 'title', {}, row.name + ', ' + lengths[i] + (i ? ' events: ' : ' event: ') + percent(row.values[i]) + '%');
    });
  });
  figure.replaceChildren(legend, plot);
  figure.hidden = false;
}
lengthComparison();
window.caveResultState = {
  capture: () => ({...leaderboard}),
  async restore(saved) {
    if (!saved || !lengths.includes(saved.k)) return;
    leaderboard.k = saved.k;
    // Older entries used the same sort index for several unrelated tables.
    const compatible = !saved.view || saved.view === 'tasks';
    leaderboard.sort = compatible && Number.isInteger(saved.sort) && saved.sort >= -1 && saved.sort < cases.length ? saved.sort : null;
    leaderboard.ascending = compatible && Boolean(saved.ascending);
    await updateLeaderboard();
  }
};
window.caveReadingHistory?.checkpoint();
