/**
 * Algorithm Visualizer — execution engine (original implementation).
 *
 * User code runs in a sandboxed Web Worker with a small "tracer" API. Each tracer
 * call records a command; `Tracer.delay()` marks a visualization step. The main
 * thread replays the command stream into per-step snapshots the renderers draw.
 *
 * Tracers: Array1DTracer, LogTracer, GraphTracer, Array2DTracer.
 */

// ─── Command model ──────────────────────────────────────────────────────────
export type TracerKind = 'array1d' | 'log' | 'graph' | 'array2d' | 'chart' | 'grid';

export type Cmd =
  | { op: 'new'; id: number; kind: TracerKind; title: string; directed?: boolean }
  | { op: 'delay' }
  // array1d
  | { op: 'set'; id: number; data: number[] }
  | { op: 'patch'; id: number; index: number }
  | { op: 'depatch'; id: number; index: number }
  | { op: 'select'; id: number; from: number; to: number }
  | { op: 'deselect'; id: number; from: number; to: number }
  // log
  | { op: 'log'; id: number; text: string }
  | { op: 'logset'; id: number; text: string }
  // graph
  | { op: 'g-node'; id: number; node: string; weight: number | null; x: number | null; y: number | null }
  | { op: 'g-edge'; id: number; source: string; target: string; weight: number | null }
  | { op: 'g-nstate'; id: number; node: string; visited?: boolean; selected?: boolean }
  | { op: 'g-nweight'; id: number; node: string; weight: number | null }
  | { op: 'g-estate'; id: number; source: string; target: string; visited?: boolean; selected?: boolean }
  // array2d
  | { op: 'a2-set'; id: number; data: number[][] }
  | { op: 'a2-sel'; id: number; r: number; c: number; on: boolean }
  | { op: 'a2-pat'; id: number; r: number; c: number; on: boolean }
  // grid (pathfinding)
  | { op: 'gr-set'; id: number; data: number[][] }
  | { op: 'gr-cell'; id: number; r: number; c: number; state: string }
  | { op: 'gr-mark'; id: number; r: number; c: number; role: 'start' | 'goal' }
  | { op: 'gr-weight'; id: number; r: number; c: number; w: number };

// ─── Per-step snapshots ─────────────────────────────────────────────────────
export interface Array1DState { kind: 'array1d'; title: string; data: number[]; selected: number[]; patched: number[]; }
export interface LogState { kind: 'log'; title: string; lines: string[]; }
export interface GraphNode { id: string; weight: number | null; x: number | null; y: number | null; visited: boolean; selected: boolean; }
export interface GraphEdge { source: string; target: string; weight: number | null; visited: boolean; selected: boolean; }
export interface GraphState { kind: 'graph'; title: string; directed: boolean; nodes: GraphNode[]; edges: GraphEdge[]; }
export interface Array2DState { kind: 'array2d'; title: string; data: number[][]; selected: string[]; patched: string[]; }
export interface ChartState { kind: 'chart'; title: string; data: number[]; selected: number[]; patched: number[]; }
export interface GridState { kind: 'grid'; title: string; rows: number; cols: number; walls: boolean[]; weights: number[]; states: string[]; start: string | null; goal: string | null; }
export type TracerState = Array1DState | LogState | GraphState | Array2DState | ChartState | GridState;

export interface TracerMeta { id: number; kind: TracerKind; title: string; }
export type Frame = Record<number, TracerState>;

// ─── The worker source (self-contained string) ──────────────────────────────
const WORKER_SRC = `
self.onmessage = function (e) {
  var commands = [];
  var idc = 0;
  var CAP = 300000;
  function push(c) { if (commands.length >= CAP) throw new Error('Too many steps (> ' + CAP + '). Reduce input size or loops.'); commands.push(c); }
  function delay() { push({ op: 'delay' }); }

  function Tracer(title) { this.id = idc++; this.title = title || ''; this._newExtra(); }
  Tracer.prototype._kind = 'log';
  Tracer.prototype._newExtra = function () { push({ op: 'new', id: this.id, kind: this._kind, title: this.title }); };
  Tracer.prototype.delay = function () { delay(); };
  Tracer.delay = delay;

  // Array1DTracer
  function Array1DTracer(title) { Tracer.call(this, title); }
  Array1DTracer.prototype = Object.create(Tracer.prototype);
  Array1DTracer.prototype._kind = 'array1d';
  Array1DTracer.prototype.set = function (a) { var arr = []; for (var i = 0; i < (a ? a.length : 0); i++) arr.push(Number(a[i])); push({ op: 'set', id: this.id, data: arr }); };
  Array1DTracer.prototype.patch = function (i) { push({ op: 'patch', id: this.id, index: i | 0 }); };
  Array1DTracer.prototype.depatch = function (i) { push({ op: 'depatch', id: this.id, index: i | 0 }); };
  Array1DTracer.prototype.select = function (a, b) { push({ op: 'select', id: this.id, from: a | 0, to: (b == null ? a : b) | 0 }); };
  Array1DTracer.prototype.deselect = function (a, b) { push({ op: 'deselect', id: this.id, from: a | 0, to: (b == null ? a : b) | 0 }); };
  Array1DTracer.delay = delay;

  // ChartTracer — same command shape as Array1D, rendered as a labeled bar chart.
  function ChartTracer(title) { Tracer.call(this, title); }
  ChartTracer.prototype = Object.create(Tracer.prototype);
  ChartTracer.prototype._kind = 'chart';
  ChartTracer.prototype.set = function (a) { var arr = []; for (var i = 0; i < (a ? a.length : 0); i++) arr.push(Number(a[i])); push({ op: 'set', id: this.id, data: arr }); };
  ChartTracer.prototype.patch = function (i) { push({ op: 'patch', id: this.id, index: i | 0 }); };
  ChartTracer.prototype.depatch = function (i) { push({ op: 'depatch', id: this.id, index: i | 0 }); };
  ChartTracer.prototype.select = function (a, b) { push({ op: 'select', id: this.id, from: a | 0, to: (b == null ? a : b) | 0 }); };
  ChartTracer.prototype.deselect = function (a, b) { push({ op: 'deselect', id: this.id, from: a | 0, to: (b == null ? a : b) | 0 }); };
  ChartTracer.delay = delay;

  // LogTracer
  function LogTracer(title) { Tracer.call(this, title); }
  LogTracer.prototype = Object.create(Tracer.prototype);
  LogTracer.prototype._kind = 'log';
  LogTracer.prototype.println = function () { push({ op: 'log', id: this.id, text: Array.prototype.join.call(arguments, ' ') }); };
  LogTracer.prototype.print = LogTracer.prototype.println;
  LogTracer.prototype.set = function (s) { push({ op: 'logset', id: this.id, text: String(s) }); };
  LogTracer.delay = delay;

  // GraphTracer
  function GraphTracer(title, directed) { this._directed = !!directed; Tracer.call(this, title); }
  GraphTracer.prototype = Object.create(Tracer.prototype);
  GraphTracer.prototype._kind = 'graph';
  GraphTracer.prototype._newExtra = function () { push({ op: 'new', id: this.id, kind: 'graph', title: this.title, directed: this._directed }); };
  GraphTracer.prototype.addNode = function (id, weight, x, y) { push({ op: 'g-node', id: this.id, node: String(id), weight: (weight == null ? null : Number(weight)), x: (x == null ? null : Number(x)), y: (y == null ? null : Number(y)) }); };
  GraphTracer.prototype.addEdge = function (s, t, weight) { push({ op: 'g-edge', id: this.id, source: String(s), target: String(t), weight: (weight == null ? null : Number(weight)) }); };
  GraphTracer.prototype.updateNode = function (id, weight) { push({ op: 'g-nweight', id: this.id, node: String(id), weight: (weight == null ? null : Number(weight)) }); };
  GraphTracer.prototype.visit = function (target, source, weight) {
    push({ op: 'g-nstate', id: this.id, node: String(target), visited: true, selected: true });
    if (source != null) push({ op: 'g-estate', id: this.id, source: String(source), target: String(target), visited: true });
    if (weight != null) push({ op: 'g-nweight', id: this.id, node: String(target), weight: Number(weight) });
  };
  GraphTracer.prototype.leave = function (target, source) {
    push({ op: 'g-nstate', id: this.id, node: String(target), selected: false });
    if (source != null) push({ op: 'g-estate', id: this.id, source: String(source), target: String(target), selected: false });
  };
  GraphTracer.prototype.select = function (target, source) {
    push({ op: 'g-nstate', id: this.id, node: String(target), selected: true });
    if (source != null) push({ op: 'g-estate', id: this.id, source: String(source), target: String(target), selected: true });
  };
  GraphTracer.prototype.deselect = function (target, source) {
    push({ op: 'g-nstate', id: this.id, node: String(target), selected: false });
    if (source != null) push({ op: 'g-estate', id: this.id, source: String(source), target: String(target), selected: false });
  };
  GraphTracer.delay = delay;

  // Array2DTracer
  function Array2DTracer(title) { Tracer.call(this, title); }
  Array2DTracer.prototype = Object.create(Tracer.prototype);
  Array2DTracer.prototype._kind = 'array2d';
  Array2DTracer.prototype.set = function (m) {
    var out = [];
    for (var r = 0; r < (m ? m.length : 0); r++) { var row = []; for (var c = 0; c < m[r].length; c++) row.push(Number(m[r][c])); out.push(row); }
    push({ op: 'a2-set', id: this.id, data: out });
  };
  Array2DTracer.prototype.select = function (r, c) { push({ op: 'a2-sel', id: this.id, r: r | 0, c: c | 0, on: true }); };
  Array2DTracer.prototype.deselect = function (r, c) { push({ op: 'a2-sel', id: this.id, r: r | 0, c: c | 0, on: false }); };
  Array2DTracer.prototype.patch = function (r, c) { push({ op: 'a2-pat', id: this.id, r: r | 0, c: c | 0, on: true }); };
  Array2DTracer.prototype.depatch = function (r, c) { push({ op: 'a2-pat', id: this.id, r: r | 0, c: c | 0, on: false }); };
  Array2DTracer.delay = delay;

  // GridTracer — 2-D grid for pathfinding. Cells are empty(0)/wall(1); the
  // algorithm paints per-cell states: 'frontier', 'visited', 'path'.
  function GridTracer(title) { Tracer.call(this, title); }
  GridTracer.prototype = Object.create(Tracer.prototype);
  GridTracer.prototype._kind = 'grid';
  GridTracer.prototype.set = function (m) {
    var out = [];
    for (var r = 0; r < (m ? m.length : 0); r++) { var row = []; for (var c = 0; c < m[r].length; c++) row.push(Number(m[r][c]) ? 1 : 0); out.push(row); }
    push({ op: 'gr-set', id: this.id, data: out });
  };
  GridTracer.prototype.start = function (r, c) { push({ op: 'gr-mark', id: this.id, r: r | 0, c: c | 0, role: 'start' }); };
  GridTracer.prototype.goal = function (r, c) { push({ op: 'gr-mark', id: this.id, r: r | 0, c: c | 0, role: 'goal' }); };
  GridTracer.prototype.weight = function (r, c, w) { push({ op: 'gr-weight', id: this.id, r: r | 0, c: c | 0, w: Number(w) }); };
  GridTracer.prototype.frontier = function (r, c) { push({ op: 'gr-cell', id: this.id, r: r | 0, c: c | 0, state: 'frontier' }); };
  GridTracer.prototype.visit = function (r, c) { push({ op: 'gr-cell', id: this.id, r: r | 0, c: c | 0, state: 'visited' }); };
  GridTracer.prototype.path = function (r, c) { push({ op: 'gr-cell', id: this.id, r: r | 0, c: c | 0, state: 'path' }); };
  GridTracer.prototype.clear = function (r, c) { push({ op: 'gr-cell', id: this.id, r: r | 0, c: c | 0, state: '' }); };
  GridTracer.delay = delay;

  try {
    var fn = new Function('Array1DTracer', 'LogTracer', 'GraphTracer', 'Array2DTracer', 'ChartTracer', 'GridTracer', 'Tracer', e.data.code);
    fn(Array1DTracer, LogTracer, GraphTracer, Array2DTracer, ChartTracer, GridTracer, Tracer);
    self.postMessage({ ok: true, commands: commands });
  } catch (err) { self.postMessage({ ok: false, error: (err && err.message) ? err.message : String(err) }); }
};
`;

/** Run user code in a Worker, with a hard timeout to kill infinite loops. */
export function runCode(code: string, timeoutMs = 6000): Promise<{ ok: boolean; error?: string; commands: Cmd[] }> {
  return new Promise((resolve) => {
    let url: string | null = null;
    let worker: Worker | null = null;
    let done = false;
    const finish = (r: { ok: boolean; error?: string; commands: Cmd[] }) => {
      if (done) return; done = true;
      if (worker) worker.terminate();
      if (url) URL.revokeObjectURL(url);
      resolve(r);
    };
    try {
      const blob = new Blob([WORKER_SRC], { type: 'application/javascript' });
      url = URL.createObjectURL(blob);
      worker = new Worker(url);
      const timer = setTimeout(() => finish({ ok: false, error: 'Execution timed out — an infinite loop? (6s limit)', commands: [] }), timeoutMs);
      worker.onmessage = (ev: MessageEvent) => { clearTimeout(timer); const d = ev.data as { ok: boolean; error?: string; commands?: Cmd[] }; finish({ ok: d.ok, error: d.error, commands: d.commands || [] }); };
      worker.onerror = (ev: ErrorEvent) => { clearTimeout(timer); finish({ ok: false, error: ev.message || 'Worker error', commands: [] }); };
      worker.postMessage({ code });
    } catch (err) { finish({ ok: false, error: err instanceof Error ? err.message : String(err), commands: [] }); }
  });
}

// ─── Replay commands → per-step frames ──────────────────────────────────────
function cloneState(s: TracerState): TracerState {
  switch (s.kind) {
    case 'array1d': return { kind: 'array1d', title: s.title, data: s.data.slice(), selected: s.selected.slice(), patched: s.patched.slice() };
    case 'log': return { kind: 'log', title: s.title, lines: s.lines.slice() };
    case 'graph': return { kind: 'graph', title: s.title, directed: s.directed, nodes: s.nodes.map((n) => ({ ...n })), edges: s.edges.map((e) => ({ ...e })) };
    case 'array2d': return { kind: 'array2d', title: s.title, data: s.data.map((r) => r.slice()), selected: s.selected.slice(), patched: s.patched.slice() };
    case 'chart': return { kind: 'chart', title: s.title, data: s.data.slice(), selected: s.selected.slice(), patched: s.patched.slice() };
    case 'grid': return { kind: 'grid', title: s.title, rows: s.rows, cols: s.cols, walls: s.walls.slice(), weights: s.weights.slice(), states: s.states.slice(), start: s.start, goal: s.goal };
  }
}

export function buildFrames(commands: Cmd[]): { metas: TracerMeta[]; frames: Frame[] } {
  const metas: TracerMeta[] = [];
  const live: Record<number, TracerState> = {};
  const frames: Frame[] = [];
  const snapshot = (): Frame => { const f: Frame = {}; for (const k of Object.keys(live)) f[Number(k)] = cloneState(live[Number(k)]); return f; };

  const addSel = (arr: number[], from: number, to: number) => { const lo = Math.min(from, to), hi = Math.max(from, to); for (let i = lo; i <= hi; i++) if (!arr.includes(i)) arr.push(i); };
  const rmSel = (arr: number[], from: number, to: number) => { const lo = Math.min(from, to), hi = Math.max(from, to); return arr.filter((i) => i < lo || i > hi); };
  const findNode = (g: GraphState, id: string) => g.nodes.find((n) => n.id === id);
  const findEdge = (g: GraphState, s: string, t: string) => g.edges.find((e) => (e.source === s && e.target === t) || (!g.directed && e.source === t && e.target === s));

  for (const c of commands) {
    switch (c.op) {
      case 'new':
        metas.push({ id: c.id, kind: c.kind, title: c.title });
        live[c.id] =
          c.kind === 'array1d' ? { kind: 'array1d', title: c.title, data: [], selected: [], patched: [] } :
          c.kind === 'chart' ? { kind: 'chart', title: c.title, data: [], selected: [], patched: [] } :
          c.kind === 'graph' ? { kind: 'graph', title: c.title, directed: !!c.directed, nodes: [], edges: [] } :
          c.kind === 'array2d' ? { kind: 'array2d', title: c.title, data: [], selected: [], patched: [] } :
          c.kind === 'grid' ? { kind: 'grid', title: c.title, rows: 0, cols: 0, walls: [], weights: [], states: [], start: null, goal: null } :
          { kind: 'log', title: c.title, lines: [] };
        break;
      case 'set': { const s = live[c.id]; if (s && (s.kind === 'array1d' || s.kind === 'chart')) s.data = c.data.slice(); break; }
      case 'patch': { const s = live[c.id]; if (s && (s.kind === 'array1d' || s.kind === 'chart') && !s.patched.includes(c.index)) s.patched.push(c.index); break; }
      case 'depatch': { const s = live[c.id]; if (s && (s.kind === 'array1d' || s.kind === 'chart')) s.patched = s.patched.filter((i) => i !== c.index); break; }
      case 'select': { const s = live[c.id]; if (s && (s.kind === 'array1d' || s.kind === 'chart')) addSel(s.selected, c.from, c.to); break; }
      case 'deselect': { const s = live[c.id]; if (s && (s.kind === 'array1d' || s.kind === 'chart')) s.selected = rmSel(s.selected, c.from, c.to); break; }
      case 'log': { const s = live[c.id]; if (s && s.kind === 'log') s.lines.push(c.text); break; }
      case 'logset': { const s = live[c.id]; if (s && s.kind === 'log') s.lines = [c.text]; break; }
      case 'g-node': { const s = live[c.id]; if (s && s.kind === 'graph' && !findNode(s, c.node)) s.nodes.push({ id: c.node, weight: c.weight, x: c.x, y: c.y, visited: false, selected: false }); break; }
      case 'g-edge': { const s = live[c.id]; if (s && s.kind === 'graph' && !findEdge(s, c.source, c.target)) s.edges.push({ source: c.source, target: c.target, weight: c.weight, visited: false, selected: false }); break; }
      case 'g-nstate': { const s = live[c.id]; if (s && s.kind === 'graph') { const n = findNode(s, c.node); if (n) { if (c.visited !== undefined) n.visited = c.visited; if (c.selected !== undefined) n.selected = c.selected; } } break; }
      case 'g-nweight': { const s = live[c.id]; if (s && s.kind === 'graph') { const n = findNode(s, c.node); if (n) n.weight = c.weight; } break; }
      case 'g-estate': { const s = live[c.id]; if (s && s.kind === 'graph') { const e = findEdge(s, c.source, c.target); if (e) { if (c.visited !== undefined) e.visited = c.visited; if (c.selected !== undefined) e.selected = c.selected; } } break; }
      case 'a2-set': { const s = live[c.id]; if (s && s.kind === 'array2d') s.data = c.data.map((r) => r.slice()); break; }
      case 'a2-sel': { const s = live[c.id]; if (s && s.kind === 'array2d') { const key = c.r + ',' + c.c; if (c.on) { if (!s.selected.includes(key)) s.selected.push(key); } else s.selected = s.selected.filter((k) => k !== key); } break; }
      case 'a2-pat': { const s = live[c.id]; if (s && s.kind === 'array2d') { const key = c.r + ',' + c.c; if (c.on) { if (!s.patched.includes(key)) s.patched.push(key); } else s.patched = s.patched.filter((k) => k !== key); } break; }
      case 'gr-set': { const s = live[c.id]; if (s && s.kind === 'grid') { s.rows = c.data.length; s.cols = c.data.length ? c.data[0].length : 0; s.walls = []; s.weights = []; s.states = []; for (let r = 0; r < s.rows; r++) for (let col = 0; col < s.cols; col++) { s.walls.push(c.data[r][col] === 1); s.weights.push(1); s.states.push(''); } } break; }
      case 'gr-cell': { const s = live[c.id]; if (s && s.kind === 'grid' && c.r >= 0 && c.r < s.rows && c.c >= 0 && c.c < s.cols) s.states[c.r * s.cols + c.c] = c.state; break; }
      case 'gr-mark': { const s = live[c.id]; if (s && s.kind === 'grid') { if (c.role === 'start') s.start = c.r + ',' + c.c; else s.goal = c.r + ',' + c.c; } break; }
      case 'gr-weight': { const s = live[c.id]; if (s && s.kind === 'grid' && c.r >= 0 && c.r < s.rows && c.c >= 0 && c.c < s.cols) s.weights[c.r * s.cols + c.c] = c.w; break; }
      case 'delay': frames.push(snapshot()); break;
    }
  }
  frames.push(snapshot());
  return { metas, frames };
}
