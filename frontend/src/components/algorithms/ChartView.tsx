'use client';

import type { ChartState } from './engine';

/**
 * Renders values as a labeled bar chart with a baseline axis and horizontal
 * gridlines — visually distinct from Array1DView (which is a bare bar strip).
 * Colors follow the same state convention:
 *  - patched (just changed) → accent
 *  - selected (being read)   → amber
 *  - normal                  → neutral surface
 */
export default function ChartView({ state }: { state: ChartState }) {
  const { data, selected, patched, title } = state;
  const n = data.length || 1;
  const max = Math.max(1, ...data.map((v) => Math.abs(v)));
  const sel = new Set(selected);
  const pat = new Set(patched);

  const H = 240; // plot height in px
  const gridlines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="w-full">
      {title ? (
        <div className="mb-2 text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary, #888)' }}>
          {title}
        </div>
      ) : null}
      <div
        className="relative rounded-lg p-3"
        style={{ background: 'var(--bg-secondary, rgba(127,127,127,0.06))' }}
      >
        {/* gridlines + y labels */}
        <div className="relative" style={{ height: H, marginLeft: 34 }}>
          {gridlines.map((g) => (
            <div
              key={g}
              className="absolute left-0 right-0 flex items-center"
              style={{ bottom: g * H }}
            >
              <span
                className="absolute -translate-x-full pr-1 text-[10px] tabular-nums"
                style={{ color: 'var(--text-secondary, #999)', left: 0 }}
              >
                {Math.round(g * max)}
              </span>
              <div
                className="w-full"
                style={{ height: 1, background: 'var(--border-color, rgba(127,127,127,0.18))' }}
              />
            </div>
          ))}

          {/* bars */}
          <div className="absolute inset-0 flex items-end gap-[3px]">
            {data.map((v, i) => {
              const h = Math.max(2, (Math.abs(v) / max) * H);
              const color = pat.has(i)
                ? 'var(--accent-color, #6366f1)'
                : sel.has(i)
                  ? '#f59e0b'
                  : 'var(--surface-3, rgba(127,127,127,0.4))';
              return (
                <div key={i} className="relative flex flex-1 flex-col items-center justify-end" style={{ minWidth: 0 }}>
                  {n <= 24 ? (
                    <span
                      className="mb-0.5 text-[10px] tabular-nums"
                      style={{ color: pat.has(i) ? 'var(--accent-color, #6366f1)' : 'var(--text-secondary, #999)' }}
                    >
                      {v}
                    </span>
                  ) : null}
                  <div
                    className="w-full rounded-t transition-all duration-150"
                    style={{ height: h, background: color }}
                    title={String(v)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* x-axis index labels */}
        {n <= 24 ? (
          <div className="flex gap-[3px]" style={{ marginLeft: 34 }}>
            {data.map((_, i) => (
              <span
                key={i}
                className="flex-1 text-center text-[10px] tabular-nums"
                style={{ color: 'var(--text-secondary, #777)', minWidth: 0 }}
              >
                {i}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
