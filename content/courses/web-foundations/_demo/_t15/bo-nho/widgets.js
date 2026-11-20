// Four widgets that are mounted and unmounted like a modal or a page in a single-page app.
// Each widget holds about 1 MB of data (a chart's points, a chat history...).
const root = document.getElementById('root');
const bigData = () => Array.from({ length: 125000 }, (_, i) => i * 1.5);   // ~1 MB of numbers

// ── Leak 1: a listener on window that is never removed ──────────────────────
function mountListenerLeak() {
  const el = document.createElement('div');
  const points = bigData();
  const onResize = () => { el.textContent = innerWidth + 'px, ' + points.length + ' points'; };
  window.addEventListener('resize', onResize);
  root.append(el);
  return () => el.remove();                      // forgets the listener
}
function mountListenerFixed() {
  const el = document.createElement('div');
  const points = bigData();
  const controller = new AbortController();
  const onResize = () => { el.textContent = innerWidth + 'px, ' + points.length + ' points'; };
  window.addEventListener('resize', onResize, { signal: controller.signal });
  root.append(el);
  return () => { controller.abort(); el.remove(); };   // abort() removes the listener
}

// ── Leak 2: a timer that is never cleared ───────────────────────────────────
function mountTimerLeak() {
  const el = document.createElement('div');
  const points = bigData();
  setInterval(() => { el.textContent = 'last point ' + points[points.length - 1]; }, 60000);
  root.append(el);
  return () => el.remove();
}
function mountTimerFixed() {
  const el = document.createElement('div');
  const points = bigData();
  const id = setInterval(() => { el.textContent = 'last point ' + points[points.length - 1]; }, 60000);
  root.append(el);
  return () => { clearInterval(id); el.remove(); };
}

// ── Leak 3: detached DOM — removed from the page, still held by an array ────
const recentlyClosed = [];                       // "keep them in case the user reopens"
function makeTable() {
  const table = document.createElement('table');
  for (let r = 0; r < 100; r++) {
    const tr = table.insertRow();
    for (let c = 0; c < 5; c++) tr.insertCell().textContent = r + ':' + c;
  }
  return table;
}
function mountDetachedLeak() {
  const table = makeTable();
  root.append(table);
  return () => { table.remove(); recentlyClosed.push(table); };
}
function mountDetachedFixed() {
  const table = makeTable();
  root.append(table);
  return () => table.remove();
}

// ── Leak 4: extra data attached to elements in a Map ────────────────────────
const metaMap = new Map();
const metaWeak = new WeakMap();
function mountMapLeak() {
  const el = document.createElement('div');
  metaMap.set(el, { points: bigData() });         // the Map keeps el AND the data alive
  root.append(el);
  return () => el.remove();
}
function mountWeakMapFixed() {
  const el = document.createElement('div');
  metaWeak.set(el, { points: bigData() });        // freed together with el
  root.append(el);
  return () => el.remove();
}

window.SCENARIOS = {
  'listener (never removed)': mountListenerLeak,
  'listener + AbortController': mountListenerFixed,
  'setInterval (never cleared)': mountTimerLeak,
  'setInterval + clearInterval': mountTimerFixed,
  'detached tables kept in an array': mountDetachedLeak,
  'tables removed, nothing kept': mountDetachedFixed,
  'metadata in a Map': mountMapLeak,
  'metadata in a WeakMap': mountWeakMapFixed,
};
window.runScenario = (name, times) => {
  for (let i = 0; i < times; i++) { const unmount = SCENARIOS[name](); unmount(); }
};
