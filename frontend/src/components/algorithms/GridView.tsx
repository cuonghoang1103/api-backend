'use client';

import type { GridState } from './engine';

/**
 * Renders a pathfinding grid. Cell colors:
 *  - start → green, goal → red
 *  - wall → dark slate
 *  - frontier (in the open set) → amber
 *  - visited (expanded) → blue
 *  - path (final route) → accent
 */
const COLORS: Record<string, string> = {
  frontier: '#fbbf24',
  visited: '#60a5fa',
  path: 'var(--accent-color, #6366f1)',
};

export default function GridView({ state }: { state: GridState }) {
  const { rows, cols, walls, weights, states, start, goal, title } = state;
  if (!rows || !cols) return null;
  const cell = cols > 16 ? 22 : 28;
  const hasWeights = weights.some((w) => w > 1);

  return (
    <div className="w-full">
      {title ? (
        <div className="mb-2 text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary, #888)' }}>
          {title}
        </div>
      ) : null}
      <div className="overflow-x-auto rounded-lg p-3" style={{ background: 'var(--bg-secondary, rgba(127,127,127,0.06))' }}>
        <div
          className="grid gap-[2px]"
          style={{ gridTemplateColumns: `repeat(${cols}, ${cell}px)`, width: 'max-content' }}
        >
          {Array.from({ length: rows * cols }).map((_, idx) => {
            const r = Math.floor(idx / cols);
            const c = idx % cols;
            const key = `${r},${c}`;
            const w = weights[idx] ?? 1;
            const isEndpoint = start === key || goal === key;
            let bg: string;
            if (start === key) bg = '#22c55e';
            else if (goal === key) bg = '#ef4444';
            else if (walls[idx]) bg = '#475569';
            else if (states[idx] && COLORS[states[idx]]) bg = COLORS[states[idx]];
            else if (w > 1) bg = 'rgba(217, 119, 6, 0.28)'; // weighted terrain tint
            else bg = 'var(--surface-3, rgba(127,127,127,0.15))';
            const showWeight = w > 1 && !walls[idx] && !isEndpoint && !states[idx];
            return (
              <div
                key={idx}
                className="flex items-center justify-center rounded-[3px] text-[9px] font-semibold tabular-nums transition-colors duration-150"
                style={{ width: cell, height: cell, background: bg, color: 'var(--text-secondary, #b45309)' }}
                title={w > 1 ? `${key} · cost ${w}` : key}
              >
                {showWeight ? w : ''}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-[11px]" style={{ color: 'var(--text-secondary, #888)' }}>
        <Legend color="#22c55e" label="Start" />
        <Legend color="#ef4444" label="Goal" />
        <Legend color="#475569" label="Wall" />
        <Legend color="#fbbf24" label="Frontier" />
        <Legend color="#60a5fa" label="Visited" />
        <Legend color="var(--accent-color, #6366f1)" label="Path" />
        {hasWeights ? <Legend color="rgba(217, 119, 6, 0.5)" label="Weighted (higher cost)" /> : null}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="inline-block h-3 w-3 rounded-[3px]" style={{ background: color }} />
      {label}
    </span>
  );
}
