'use client';

import type { Array1DState } from './engine';

/**
 * Renders a 1-D array as bars. Height ∝ value; colors show state:
 *  - patched (just changed) → accent
 *  - selected (being compared) → amber
 *  - normal → neutral surface
 */
export default function Array1DView({ state }: { state: Array1DState }) {
  const { data, selected, patched, title } = state;
  const n = data.length || 1;
  const max = Math.max(1, ...data.map((v) => Math.abs(v)));
  const sel = new Set(selected);
  const pat = new Set(patched);

  return (
    <div className="w-full">
      {title ? (
        <div className="mb-2 text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary, #888)' }}>
          {title}
        </div>
      ) : null}
      <div
        className="flex items-end gap-[2px] rounded-lg p-3"
        style={{ height: 260, background: 'var(--bg-secondary, rgba(127,127,127,0.06))' }}
      >
        {data.map((v, i) => {
          const h = Math.max(4, (Math.abs(v) / max) * 220);
          const color = pat.has(i)
            ? 'var(--accent-color, #6366f1)'
            : sel.has(i)
              ? '#f59e0b'
              : 'var(--surface-3, rgba(127,127,127,0.35))';
          return (
            <div key={i} className="flex flex-1 flex-col items-center justify-end" style={{ minWidth: 0 }}>
              <div
                className="w-full rounded-t transition-all duration-150"
                style={{ height: h, background: color }}
                title={String(v)}
              />
              {n <= 30 ? (
                <span className="mt-1 text-[10px] tabular-nums" style={{ color: 'var(--text-secondary, #999)' }}>
                  {v}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
