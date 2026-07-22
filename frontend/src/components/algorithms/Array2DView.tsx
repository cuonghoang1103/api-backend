'use client';

import type { Array2DState } from './engine';

/**
 * Renders a 2-D array (matrix) as a grid of cells — used for dynamic-programming
 * tables. Cells color by state: patched (just written) → accent, selected
 * (being read/compared) → amber.
 */
export default function Array2DView({ state }: { state: Array2DState }) {
  const { data, selected, patched, title } = state;
  const sel = new Set(selected);
  const pat = new Set(patched);
  const cols = data[0]?.length ?? 0;

  return (
    <div className="w-full">
      {title ? (
        <div className="mb-2 text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary, #888)' }}>{title}</div>
      ) : null}
      <div className="overflow-auto rounded-lg p-3" style={{ background: 'var(--bg-secondary, rgba(127,127,127,0.06))' }}>
        <div className="inline-grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${cols || 1}, minmax(28px, 1fr))` }}>
          {data.map((row, r) =>
            row.map((v, c) => {
              const key = `${r},${c}`;
              const bg = pat.has(key)
                ? 'var(--accent-color, #6366f1)'
                : sel.has(key)
                  ? '#f59e0b'
                  : 'var(--surface-3, rgba(127,127,127,0.18))';
              const fg = pat.has(key) || sel.has(key) ? '#fff' : 'var(--text-primary, #ddd)';
              return (
                <div key={key} className="flex h-8 min-w-7 items-center justify-center rounded text-xs tabular-nums transition-colors"
                  style={{ background: bg, color: fg }}>
                  {v}
                </div>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}
