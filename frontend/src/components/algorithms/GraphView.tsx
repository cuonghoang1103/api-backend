'use client';

import { useMemo } from 'react';
import type { GraphState } from './engine';

/**
 * Renders a graph as SVG. Nodes auto-layout on a circle unless the algorithm
 * supplied x/y (treated as normalized 0..1). Colors show traversal state:
 *  - selected (current)   → amber
 *  - visited              → accent
 *  - unvisited            → neutral
 */
const W = 460, H = 320, R = 18;

export default function GraphView({ state }: { state: GraphState }) {
  const { nodes, edges, directed, title } = state;

  const pos = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    const cx = W / 2, cy = H / 2, radius = Math.min(W, H) / 2 - 40;
    nodes.forEach((n, i) => {
      if (n.x != null && n.y != null) {
        map[n.id] = { x: 30 + n.x * (W - 60), y: 30 + n.y * (H - 60) };
      } else {
        const a = (i / Math.max(1, nodes.length)) * Math.PI * 2 - Math.PI / 2;
        map[n.id] = { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
      }
    });
    return map;
  }, [nodes]);

  const edgeColor = (visited: boolean, selected: boolean) =>
    selected ? '#f59e0b' : visited ? 'var(--accent-color, #6366f1)' : 'var(--surface-3, rgba(127,127,127,0.4))';
  const nodeFill = (visited: boolean, selected: boolean) =>
    selected ? '#f59e0b' : visited ? 'var(--accent-color, #6366f1)' : 'var(--bg-secondary, #2a2a2a)';

  return (
    <div className="w-full">
      {title ? (
        <div className="mb-2 text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary, #888)' }}>{title}</div>
      ) : null}
      <div className="rounded-lg p-2" style={{ background: 'var(--bg-secondary, rgba(127,127,127,0.06))' }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 320 }}>
          <defs>
            <marker id="algo-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--surface-3, rgba(127,127,127,0.6))" />
            </marker>
          </defs>
          {edges.map((e, i) => {
            const a = pos[e.source], b = pos[e.target];
            if (!a || !b) return null;
            // shorten so arrow sits at node edge
            const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
            const ux = dx / len, uy = dy / len;
            const x2 = b.x - ux * (R + 3), y2 = b.y - uy * (R + 3);
            const x1 = a.x + ux * R, y1 = a.y + uy * R;
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={edgeColor(e.visited, e.selected)} strokeWidth={e.selected || e.visited ? 3 : 1.5}
                  markerEnd={directed ? 'url(#algo-arrow)' : undefined} />
                {e.weight != null ? (
                  <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 4} textAnchor="middle" fontSize="11" fill="var(--text-secondary, #999)">{e.weight}</text>
                ) : null}
              </g>
            );
          })}
          {nodes.map((n) => {
            const p = pos[n.id];
            if (!p) return null;
            return (
              <g key={n.id}>
                <circle cx={p.x} cy={p.y} r={R} fill={nodeFill(n.visited, n.selected)} stroke="var(--border-color, rgba(127,127,127,0.5))" strokeWidth={1.5} />
                <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="12" fontWeight="600"
                  fill={n.visited || n.selected ? '#fff' : 'var(--text-primary, #ddd)'}>{n.id}</text>
                {n.weight != null ? (
                  <text x={p.x} y={p.y - R - 4} textAnchor="middle" fontSize="10" fill="var(--accent-color, #6366f1)">{n.weight}</text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
