'use client';

/**
 * Maker Lab — system flow diagram.
 *
 * Three lanes, because the single most important thing to understand
 * about this robot is WHERE each step runs:
 *   robot   — on the ESP32, battery powered, 240 MHz
 *   link    — the WebSocket, i.e. the only place latency is physics
 *   server  — your VPS, where the expensive thinking happens
 *
 * Laid out from data (MakerProject.architecture) rather than drawn by
 * hand so the picture cannot drift from the design when the design
 * changes. Wide on purpose — it scrolls horizontally on phones instead
 * of shrinking into unreadable 6px text.
 */

import type { MakerArchitecture, MakerArchNode } from '@/types/maker-lab';

const LANES = [
  { id: 'robot', label: 'Trên robot', sub: 'ESP32-S3 · chạy pin', y: 70 },
  { id: 'link', label: 'Đường truyền', sub: 'WebSocket nhị phân', y: 236 },
  { id: 'server', label: 'Trên VPS của bạn', sub: 'Node · Postgres · Redis', y: 372 },
] as const;

const KIND_COLOR: Record<MakerArchNode['kind'], string> = {
  sensor: '#38bdf8',
  actuator: '#fb923c',
  compute: '#a78bfa',
  ai: '#34d399',
  store: '#f472b6',
  ui: '#facc15',
  link: '#22d3ee',
};

const NODE_W = 132;
const NODE_H = 58;
const GAP = 26;
const PAD_X = 150;

interface Placed extends MakerArchNode {
  x: number;
  y: number;
  w: number;
}

function layout(nodes: MakerArchNode[]): { placed: Placed[]; width: number; height: number } {
  const placed: Placed[] = [];
  let maxRight = 0;

  for (const lane of LANES) {
    const inLane = nodes.filter((n) => n.lane === lane.id);
    // The link lane is one long pipe, not a row of boxes — it is a
    // single thing that everything crosses.
    if (lane.id === 'link' && inLane.length === 1) {
      const w = Math.max(
        520,
        LANES.reduce((m, l) => {
          const c = nodes.filter((n) => n.lane === l.id).length;
          return Math.max(m, c * NODE_W + (c - 1) * GAP);
        }, 0),
      );
      placed.push({ ...inLane[0], x: PAD_X, y: lane.y, w });
      maxRight = Math.max(maxRight, PAD_X + w);
      continue;
    }
    inLane.forEach((n, i) => {
      const x = PAD_X + i * (NODE_W + GAP);
      placed.push({ ...n, x, y: lane.y, w: NODE_W });
      maxRight = Math.max(maxRight, x + NODE_W);
    });
  }

  return { placed, width: maxRight + 40, height: 470 };
}

export function SystemFlowDiagram({ architecture }: { architecture: MakerArchitecture | null }) {
  if (!architecture?.nodes?.length) return null;

  const { placed, width, height } = layout(architecture.nodes);
  const byId = new Map(placed.map((p) => [p.id, p]));

  return (
    <div className="space-y-4">
      {/* Horizontal scroll container — never let the page itself scroll sideways. */}
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          className="block min-w-full"
          style={{ background: 'var(--bg-card)' }}
          role="img"
          aria-label="Sơ đồ hoạt động của robot"
        >
          <defs>
            <marker id="ml-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="var(--text-muted)" />
            </marker>
          </defs>

          {/* lanes */}
          {LANES.map((lane) => (
            <g key={lane.id}>
              <rect
                x="12"
                y={lane.y - 26}
                width={width - 24}
                height={lane.id === 'link' ? 74 : NODE_H + 40}
                rx="10"
                fill="var(--bg-surface)"
                opacity="0.55"
              />
              <text x="28" y={lane.y + 4} fontSize="13" fontWeight="700" fill="var(--text-primary)">
                {lane.label}
              </text>
              <text x="28" y={lane.y + 22} fontSize="10.5" fill="var(--text-muted)">
                {lane.sub}
              </text>
            </g>
          ))}

          {/* edges first so boxes sit on top */}
          {architecture.edges.map((e, i) => {
            const a = byId.get(e.from);
            const b = byId.get(e.to);
            if (!a || !b) return null;

            const ax = a.x + a.w / 2;
            const bx = b.x + b.w / 2;
            const sameLane = a.lane === b.lane;

            let d: string;
            let lx: number;
            let ly: number;

            if (sameLane) {
              const y = a.y + NODE_H / 2;
              const x1 = a.x + a.w;
              const x2 = b.x;
              d = `M${x1} ${y} L${x2 - 4} ${y}`;
              lx = (x1 + x2) / 2;
              ly = y - 7;
            } else {
              const downward = b.y > a.y;
              const y1 = downward ? a.y + NODE_H : a.y;
              const y2 = downward ? b.y - 4 : b.y + NODE_H + 4;
              const mid = (y1 + y2) / 2;
              d = `M${ax} ${y1} C${ax} ${mid}, ${bx} ${mid}, ${bx} ${y2}`;
              lx = (ax + bx) / 2;
              ly = mid;
            }

            return (
              <g key={i}>
                <path
                  d={d}
                  fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth="1.6"
                  opacity="0.65"
                  markerEnd="url(#ml-arrow)"
                />
                {e.label && (
                  <text
                    x={lx}
                    y={ly}
                    fontSize="9.5"
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    style={{ paintOrder: 'stroke' }}
                    stroke="var(--bg-card)"
                    strokeWidth="3"
                  >
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* nodes */}
          {placed.map((n) => (
            <g key={n.id}>
              <rect
                x={n.x}
                y={n.y}
                width={n.w}
                height={NODE_H}
                rx="9"
                fill="var(--bg-card)"
                stroke={KIND_COLOR[n.kind]}
                strokeWidth="1.8"
              />
              <rect x={n.x} y={n.y} width="4" height={NODE_H} rx="2" fill={KIND_COLOR[n.kind]} />
              <text
                x={n.x + n.w / 2}
                y={n.y + 24}
                fontSize="12.5"
                fontWeight="600"
                textAnchor="middle"
                fill="var(--text-primary)"
              >
                {n.label}
              </text>
              {n.sub && (
                <text
                  x={n.x + n.w / 2}
                  y={n.y + 41}
                  fontSize="9.5"
                  textAnchor="middle"
                  fill="var(--text-muted)"
                >
                  {n.sub}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {architecture.budget?.length ? <LatencyBudget budget={architecture.budget} /> : null}
    </div>
  );
}

/**
 * The latency budget is the number that decides whether the robot
 * feels alive or feels like a call centre IVR, so it gets its own
 * visual rather than a line of prose.
 */
function LatencyBudget({ budget }: { budget: Array<{ step: string; ms: number }> }) {
  const total = budget.reduce((s, b) => s + b.ms, 0);
  const colors = ['#22d3ee', '#34d399', '#a78bfa', '#fb923c', '#f472b6', '#facc15'];

  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
    >
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Ngân sách độ trễ — từ lúc bạn dứt lời tới lúc loa kêu
        </h4>
        <span className="font-mono text-lg font-bold" style={{ color: 'var(--accent-color)' }}>
          ~{(total / 1000).toFixed(2)}s
        </span>
      </div>

      <div className="mb-3 flex h-6 w-full overflow-hidden rounded-md">
        {budget.map((b, i) => (
          <div
            key={b.step}
            title={`${b.step}: ${b.ms}ms`}
            style={{
              width: `${(b.ms / total) * 100}%`,
              background: colors[i % colors.length],
            }}
          />
        ))}
      </div>

      <ul className="grid gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2">
        {budget.map((b, i) => (
          <li key={b.step} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ background: colors[i % colors.length] }}
              />
              <span className="truncate" style={{ color: 'var(--text-secondary)' }}>
                {b.step}
              </span>
            </span>
            <span className="shrink-0 font-mono" style={{ color: 'var(--text-primary)' }}>
              {b.ms} ms
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
