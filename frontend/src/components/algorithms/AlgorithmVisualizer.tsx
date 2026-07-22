'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Zap, Loader2, AlertCircle, ChevronRight, Share2, Check } from 'lucide-react';
import { CATALOG, CATEGORIES, type AlgoDef } from './catalog';
import { runCode, buildFrames, type Frame, type TracerMeta } from './engine';
import Array1DView from './Array1DView';
import LogView from './LogView';
import GraphView from './GraphView';
import Array2DView from './Array2DView';
import ChartView from './ChartView';
import GridView from './GridView';
import MazeEditor from './MazeEditor';
import CodeEditor from './CodeEditor';

const MAZE_RE = /const MAZE = (\[[\s\S]*?\]);/;
const SG_RE = /const S = \[[^\]]*\], G = \[[^\]]*\];/;
function parseMaze(src: string): number[][] | null {
  const m = src.match(MAZE_RE);
  if (!m) return null;
  try {
    const g = JSON.parse(m[1]);
    if (Array.isArray(g) && g.length > 0 && g.every((row) => Array.isArray(row) && row.every((x) => typeof x === 'number'))) {
      return g as number[][];
    }
  } catch { /* not a plain literal — skip the editor */ }
  return null;
}

const SPEEDS = [
  { label: '0.5×', ms: 700 },
  { label: '1×', ms: 350 },
  { label: '2×', ms: 160 },
  { label: '4×', ms: 70 },
  { label: '8×', ms: 25 },
];

export default function AlgorithmVisualizer() {
  const [algoId, setAlgoId] = useState<string>(CATALOG[0].id);
  const [code, setCode] = useState<string>(CATALOG[0].code);
  const [metas, setMetas] = useState<TracerMeta[]>([]);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [maze, setMaze] = useState<number[][] | null>(null);
  const [mazeStart, setMazeStart] = useState<[number, number]>([0, 0]);
  const [mazeGoal, setMazeGoal] = useState<[number, number]>([0, 0]);
  const initRef = useRef(false);

  const algo = useMemo<AlgoDef | undefined>(() => CATALOG.find((a) => a.id === algoId), [algoId]);
  const lastStep = Math.max(0, frames.length - 1);

  const build = useCallback(async (src: string) => {
    setRunning(true);
    setError(null);
    setPlaying(false);
    const res = await runCode(src);
    if (!res.ok) {
      setError(res.error || 'Unknown error');
      setMetas([]); setFrames([]); setStep(0); setRunning(false);
      return;
    }
    const { metas: m, frames: f } = buildFrames(res.commands);
    setMetas(m);
    setFrames(f);
    setStep(0);
    setRunning(false);
    // Auto-play from the start so the user immediately sees the animation.
    setPlaying(true);
  }, []);

  // Initial load: a shared "?code=" URL wins over the default algorithm.
  useEffect(() => {
    let shared: string | null = null;
    try {
      const c = new URLSearchParams(window.location.search).get('code');
      if (c) shared = decodeURIComponent(escape(atob(c)));
    } catch { shared = null; }
    if (shared) { setAlgoId(''); setCode(shared); void build(shared); }
    else { void build(CATALOG[0].code); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load + run whenever the user picks a different algorithm (skip the mount run above).
  useEffect(() => {
    if (!initRef.current) { initRef.current = true; return; }
    if (!algo) return;
    setCode(algo.code);
    void build(algo.code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algoId]);

  // Copy a shareable link that embeds the current code.
  const share = useCallback(() => {
    try {
      const enc = btoa(unescape(encodeURIComponent(code)));
      const url = `${window.location.origin}${window.location.pathname}?code=${encodeURIComponent(enc)}`;
      void navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked — ignore */ }
  }, [code]);

  // Replace the first plain-number array literal in the code, then re-run.
  const applyInput = useCallback((nums: number[]) => {
    const re = /\[\s*-?\d+(?:\s*,\s*-?\d+)*\s*\]/;
    if (!nums.length || !re.test(code)) return;
    const next = code.replace(re, '[' + nums.join(', ') + ']');
    setCode(next);
    void build(next);
  }, [code, build]);

  const randomize = useCallback(() => {
    const n = 8 + Math.floor(Math.random() * 4); // 8–11 values
    const nums = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 20));
    applyInput(nums);
  }, [applyInput]);

  // For pathfinding algorithms, expose the maze as an editable grid.
  useEffect(() => {
    const g = algo?.category === 'Pathfinding' ? parseMaze(algo.code) : null;
    setMaze(g);
    if (g) { setMazeStart([0, 0]); setMazeGoal([g.length - 1, (g[0]?.length ?? 1) - 1]); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algoId]);

  const paintWall = useCallback((r: number, c: number, wall: boolean) => {
    setMaze((m) => (m ? m.map((row, ri) => (ri === r ? row.map((v, ci) => (ci === c ? (wall ? 1 : 0) : v)) : row)) : m));
  }, []);

  const clearWalls = useCallback(() => {
    setMaze((m) => (m ? m.map((row) => row.map(() => 0)) : m));
  }, []);

  const runMaze = useCallback(() => {
    if (!maze) return;
    const lit = '[' + maze.map((row) => '[' + row.join(',') + ']').join(',') + ']';
    const next = code
      .replace(MAZE_RE, 'const MAZE = ' + lit + ';')
      .replace(SG_RE, `const S = [${mazeStart[0]}, ${mazeStart[1]}], G = [${mazeGoal[0]}, ${mazeGoal[1]}];`);
    setCode(next);
    void build(next);
  }, [maze, mazeStart, mazeGoal, code, build]);

  // Playback loop.
  useEffect(() => {
    if (!playing) return;
    if (step >= lastStep) { setPlaying(false); return; }
    const t = setTimeout(() => setStep((s) => Math.min(lastStep, s + 1)), SPEEDS[speedIdx].ms);
    return () => clearTimeout(t);
  }, [playing, step, lastStep, speedIdx]);

  const frame = frames[Math.min(step, lastStep)] || {};

  const togglePlay = () => {
    if (step >= lastStep) { setStep(0); setPlaying(true); }
    else setPlaying((p) => !p);
  };

  return (
    <div className="mx-auto max-w-[1440px] px-3 py-4 xl:pr-16 2xl:pr-20">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr_minmax(320px,0.9fr)]">
        {/* ── Left: algorithm tree ─────────────────────────────── */}
        <aside className="rounded-xl border p-3" style={{ borderColor: 'var(--border-color, rgba(127,127,127,0.2))' }}>
          <h2 className="mb-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Algorithms</h2>
          <div className="space-y-4">
            {CATEGORIES.map((cat) => (
              <div key={cat}>
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary, #888)' }}>{cat}</div>
                <ul className="space-y-0.5">
                  {CATALOG.filter((a) => a.category === cat).map((a) => {
                    const active = a.id === algoId;
                    return (
                      <li key={a.id}>
                        <button
                          onClick={() => setAlgoId(a.id)}
                          className="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left text-sm transition-colors"
                          style={{
                            background: active ? 'var(--accent-color, #6366f1)' : 'transparent',
                            color: active ? '#fff' : 'var(--text-primary)',
                          }}
                        >
                          <ChevronRight size={13} className="opacity-60" />
                          {a.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Center: visualization + controls ─────────────────── */}
        <main className="rounded-xl border p-4" style={{ borderColor: 'var(--border-color, rgba(127,127,127,0.2))' }}>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{algo?.name}</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary, #888)' }}>{algo?.description}</p>
            </div>
            {running ? <Loader2 className="animate-spin" size={18} style={{ color: 'var(--accent-color)' }} /> : null}
          </div>

          {error ? (
            <div className="mb-3 flex items-start gap-2 rounded-lg border p-3 text-sm" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span className="font-mono">{error}</span>
            </div>
          ) : null}

          {algo?.category === 'Sorting' ? (
            <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border p-2 text-sm" style={{ borderColor: 'var(--border-color, rgba(127,127,127,0.2))' }}>
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary, #888)' }}>Custom input</span>
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { const nums = customInput.split(/[\s,]+/).map(Number).filter((x) => Number.isFinite(x)); applyInput(nums); } }}
                placeholder="e.g. 5, 3, 8, 1, 9, 2"
                className="min-w-[160px] flex-1 rounded-md border bg-transparent px-2 py-1 text-sm outline-none"
                style={{ borderColor: 'var(--border-color, rgba(127,127,127,0.3))', color: 'var(--text-primary)' }}
              />
              <button
                onClick={() => { const nums = customInput.split(/[\s,]+/).map(Number).filter((x) => Number.isFinite(x)); applyInput(nums); }}
                className="rounded-md px-3 py-1 text-xs font-medium text-white"
                style={{ background: 'var(--accent-color, #6366f1)' }}
              >
                Apply
              </button>
              <button
                onClick={randomize}
                className="rounded-md border px-3 py-1 text-xs font-medium"
                style={{ borderColor: 'var(--border-color, rgba(127,127,127,0.3))', color: 'var(--text-secondary, #888)' }}
              >
                🎲 Random
              </button>
            </div>
          ) : null}

          {maze ? (
            <MazeEditor
              grid={maze}
              start={mazeStart}
              goal={mazeGoal}
              onPaint={paintWall}
              onMoveStart={(r, c) => setMazeStart([r, c])}
              onMoveGoal={(r, c) => setMazeGoal([r, c])}
              onClear={clearWalls}
              onRun={runMaze}
              disabled={running}
            />
          ) : null}

          {/* tracer views */}
          <div className="space-y-4">
            {metas.map((m) => {
              const s = frame[m.id];
              if (!s) return null;
              if (s.kind === 'array1d') return <Array1DView key={m.id} state={s} />;
              if (s.kind === 'chart') return <ChartView key={m.id} state={s} />;
              if (s.kind === 'grid') return <GridView key={m.id} state={s} />;
              if (s.kind === 'graph') return <GraphView key={m.id} state={s} />;
              if (s.kind === 'array2d') return <Array2DView key={m.id} state={s} />;
              return <LogView key={m.id} state={s} />;
            })}
            {metas.length === 0 && !error && !running ? (
              <div className="py-12 text-center text-sm" style={{ color: 'var(--text-secondary, #888)' }}>Run the code to visualize.</div>
            ) : null}
          </div>

          {/* controls */}
          <div className="mt-4 space-y-2">
            <input
              type="range"
              min={0}
              max={lastStep}
              value={Math.min(step, lastStep)}
              onChange={(e) => { setPlaying(false); setStep(Number(e.target.value)); }}
              className="w-full accent-[var(--accent-color,#6366f1)]"
              aria-label="Step"
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button onClick={() => { setPlaying(false); setStep(0); }} className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/5" title="Reset" style={{ color: 'var(--text-primary)' }}><RotateCcw size={16} /></button>
                <button onClick={() => { setPlaying(false); setStep((s) => Math.max(0, s - 1)); }} className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/5" title="Step back" style={{ color: 'var(--text-primary)' }}><SkipBack size={16} /></button>
                <button onClick={togglePlay} className="rounded-md px-4 py-2 text-white" style={{ background: 'var(--accent-color, #6366f1)' }} title={playing ? 'Pause' : 'Play'}>
                  {playing ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button onClick={() => { setPlaying(false); setStep((s) => Math.min(lastStep, s + 1)); }} className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/5" title="Step forward" style={{ color: 'var(--text-primary)' }}><SkipForward size={16} /></button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs tabular-nums" style={{ color: 'var(--text-secondary, #888)' }}>Step {Math.min(step, lastStep)} / {lastStep}</span>
                <div className="flex items-center gap-1">
                  <Zap size={13} style={{ color: 'var(--text-secondary, #888)' }} />
                  {SPEEDS.map((sp, i) => (
                    <button key={sp.label} onClick={() => setSpeedIdx(i)} className="rounded px-1.5 py-0.5 text-xs" style={{ background: i === speedIdx ? 'var(--accent-color,#6366f1)' : 'transparent', color: i === speedIdx ? '#fff' : 'var(--text-secondary,#888)' }}>{sp.label}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ── Right: code editor ───────────────────────────────── */}
        <aside className="flex flex-col rounded-xl border" style={{ borderColor: 'var(--border-color, rgba(127,127,127,0.2))', minHeight: 420 }}>
          <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: 'var(--border-color, rgba(127,127,127,0.2))' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Code (JavaScript)</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={share}
                className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium"
                style={{ borderColor: 'var(--border-color, rgba(127,127,127,0.3))', color: copied ? '#10b981' : 'var(--text-secondary, #888)' }}
                title="Copy a shareable link with this code"
              >
                {copied ? <Check size={13} /> : <Share2 size={13} />}
                {copied ? 'Copied' : 'Share'}
              </button>
              <button onClick={() => void build(code)} className="rounded-md px-3 py-1 text-xs font-medium text-white" style={{ background: 'var(--accent-color, #6366f1)' }} disabled={running}>
                {running ? 'Running…' : 'Run ▶'}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden rounded-b-xl">
            <CodeEditor value={code} onChange={setCode} />
          </div>
        </aside>
      </div>

      <p className="mx-auto mt-4 max-w-3xl text-center text-xs" style={{ color: 'var(--text-secondary, #888)' }}>
        Edit the code and press <strong>Run</strong>. Tracers: <code>Array1DTracer</code>, <code>ChartTracer</code>,{' '}
        <code>GraphTracer</code>, <code>Array2DTracer</code>, <code>GridTracer</code>, <code>LogTracer</code> — call{' '}
        <code>Tracer.delay()</code> to add an animation step, then <strong>Share</strong> to copy a link with your code.
        Runs safely in your browser.
      </p>
    </div>
  );
}
