'use client';

import { useEffect, useRef } from 'react';
import type { LogState } from './engine';

/** Renders the console/log tracer output; auto-scrolls to the latest line. */
export default function LogView({ state }: { state: LogState }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [state.lines.length]);

  return (
    <div className="w-full">
      {state.title ? (
        <div className="mb-2 text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary, #888)' }}>
          {state.title}
        </div>
      ) : null}
      <div
        ref={ref}
        className="max-h-40 overflow-auto rounded-lg p-3 font-mono text-xs leading-relaxed"
        style={{ background: 'var(--bg-secondary, rgba(127,127,127,0.06))', color: 'var(--text-primary, #ddd)' }}
      >
        {state.lines.length === 0 ? (
          <span style={{ color: 'var(--text-secondary, #888)' }}>—</span>
        ) : (
          state.lines.map((l, i) => <div key={i}>{l}</div>)
        )}
      </div>
    </div>
  );
}
