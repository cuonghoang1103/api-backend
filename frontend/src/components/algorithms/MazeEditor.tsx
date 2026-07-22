'use client';

import { useRef, useState } from 'react';

/**
 * Interactive maze editor for pathfinding algorithms.
 *  - Click or click-drag on empty cells to paint walls (drag from a wall erases).
 *  - Drag the green Start or red Goal square to move it.
 *  - "Run on this maze" writes the grid + endpoints back into the code and re-runs.
 */
type DragMode = 'wall' | 'erase' | 'start' | 'goal' | null;

export default function MazeEditor({
  grid,
  start,
  goal,
  onPaint,
  onMoveStart,
  onMoveGoal,
  onClear,
  onRun,
  disabled,
}: {
  grid: number[][];
  start: [number, number];
  goal: [number, number];
  onPaint: (r: number, c: number, wall: boolean) => void;
  onMoveStart: (r: number, c: number) => void;
  onMoveGoal: (r: number, c: number) => void;
  onClear: () => void;
  onRun: () => void;
  disabled?: boolean;
}) {
  const cols = grid[0]?.length ?? 0;
  const [drag, setDrag] = useState<DragMode>(null);
  const dragRef = useRef<DragMode>(null);
  if (!cols) return null;
  const cell = cols > 16 ? 20 : 26;

  const setMode = (m: DragMode) => { dragRef.current = m; setDrag(m); };
  const endDrag = () => { dragRef.current = null; setDrag(null); };

  const isStart = (r: number, c: number) => r === start[0] && c === start[1];
  const isGoal = (r: number, c: number) => r === goal[0] && c === goal[1];

  const onDown = (r: number, c: number, wall: boolean) => {
    if (disabled) return;
    if (isStart(r, c)) { setMode('start'); return; }
    if (isGoal(r, c)) { setMode('goal'); return; }
    const mode: DragMode = wall ? 'erase' : 'wall';
    setMode(mode);
    onPaint(r, c, mode === 'wall');
  };

  const onEnter = (r: number, c: number) => {
    const m = dragRef.current;
    if (!m) return;
    if (m === 'start') { if (!isGoal(r, c) && grid[r][c] !== 1) onMoveStart(r, c); return; }
    if (m === 'goal') { if (!isStart(r, c) && grid[r][c] !== 1) onMoveGoal(r, c); return; }
    if (isStart(r, c) || isGoal(r, c)) return;
    onPaint(r, c, m === 'wall');
  };

  return (
    <div className="mb-3 rounded-lg border p-3" style={{ borderColor: 'var(--border-color, rgba(127,127,127,0.2))' }}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary, #888)' }}>
          🖱️ Drag to draw walls · drag <span style={{ color: '#22c55e' }}>Start</span> / <span style={{ color: '#ef4444' }}>Goal</span> to move them
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onClear}
            className="rounded-md border px-2.5 py-1 text-xs font-medium"
            style={{ borderColor: 'var(--border-color, rgba(127,127,127,0.3))', color: 'var(--text-secondary, #888)' }}
          >
            Clear walls
          </button>
          <button
            onClick={onRun}
            disabled={disabled}
            className="rounded-md px-3 py-1 text-xs font-medium text-white"
            style={{ background: 'var(--accent-color, #6366f1)' }}
          >
            ▶ Run on this maze
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div
          className="grid select-none gap-[2px]"
          style={{ gridTemplateColumns: `repeat(${cols}, ${cell}px)`, width: 'max-content' }}
          onMouseLeave={endDrag}
          onMouseUp={endDrag}
        >
          {grid.flatMap((row, r) =>
            row.map((v, c) => {
              const s = isStart(r, c), g = isGoal(r, c);
              const bg = s ? '#22c55e' : g ? '#ef4444' : v === 1 ? '#475569' : 'var(--surface-3, rgba(127,127,127,0.15))';
              return (
                <div
                  key={`${r}-${c}`}
                  onMouseDown={(e) => { e.preventDefault(); onDown(r, c, v === 1); }}
                  onMouseEnter={() => onEnter(r, c)}
                  className="rounded-[3px] transition-colors"
                  style={{ width: cell, height: cell, background: bg, cursor: s || g ? 'grab' : 'pointer' }}
                  title={s ? 'Start (drag to move)' : g ? 'Goal (drag to move)' : v === 1 ? 'Wall' : 'Empty'}
                />
              );
            }),
          )}
        </div>
      </div>
      {drag ? <div className="mt-1 text-[10px]" style={{ color: 'var(--text-secondary, #888)' }}>Release to finish…</div> : null}
    </div>
  );
}
