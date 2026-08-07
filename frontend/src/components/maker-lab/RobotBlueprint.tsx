'use client';

/**
 * Maker Lab — enclosure blueprint.
 *
 * Answers the question the parts list can't: where does all of this
 * physically go, and will it fit?
 *
 * Three orthographic views plus a cutaway. Drawn to scale from the
 * dimensions in `MakerProject.enclosure`, so the picture cannot claim
 * a battery fits where the numbers say it doesn't — every bay is
 * positioned in millimetres and rendered through one transform.
 */

import { useState } from 'react';
import { AlertTriangle, Box, Ruler } from 'lucide-react';

export interface EnclosureBay {
  id: string;
  label: string;
  /** Millimetres, origin at the robot's bottom-front-left. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Which view this bay is visible in. */
  view: 'side' | 'front';
  contents: string[];
  color: string;
  note?: string;
}

export interface EnclosurePart {
  id: string;
  name: string;
  method: string;
  sizeMm: string;
  note?: string;
}

export interface EnclosureData {
  reference?: { name: string; sourceSizeMm: number; targetSizeMm: number; note: string };
  dimensions: { w: number; h: number; d: number; weightG?: number };
  bays: EnclosureBay[];
  parts?: EnclosurePart[];
  assembly?: Array<{ step: number; title: string; detail: string }>;
  warnings?: string[];
}

// Drawing scale: millimetres → SVG units.
const S = 2.2;

export function RobotBlueprint({ data }: { data: EnclosureData | null }) {
  const [hover, setHover] = useState<string | null>(null);

  if (!data?.dimensions) return null;

  const { w, h, d } = data.dimensions;
  const sideBays = data.bays.filter((b) => b.view === 'side');
  const frontBays = data.bays.filter((b) => b.view === 'front');

  return (
    <div className="space-y-6">
      {/* ── Scale-up callout ── */}
      {data.reference && (
        <div
          className="flex items-start gap-3 rounded-xl border p-4"
          style={{ borderColor: '#f59e0b', background: 'rgba(245,158,11,0.06)' }}
        >
          <Ruler size={18} className="mt-0.5 shrink-0" style={{ color: '#f59e0b' }} />
          <div className="min-w-0">
            <p className="text-sm font-semibold" style={{ color: '#f59e0b' }}>
              Mẫu gốc {data.reference.sourceSizeMm} mm → bản của bạn {data.reference.targetSizeMm} mm
              (phóng {(data.reference.targetSizeMm / data.reference.sourceSizeMm).toFixed(1)}×)
            </p>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {data.reference.note}
            </p>
          </div>
        </div>
      )}

      {/* ── Drawings ── */}
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
        <svg
          viewBox={`0 0 ${(w + d + 120) * S} ${(h + 120) * S}`}
          width={(w + d + 120) * S}
          height={(h + 120) * S}
          className="block min-w-full"
          style={{ background: 'var(--bg-card)' }}
          role="img"
          aria-label="Bản vẽ bố trí linh kiện bên trong robot"
        >
          <defs>
            <pattern id="bp-grid" width={10 * S} height={10 * S} patternUnits="userSpaceOnUse">
              <path
                d={`M ${10 * S} 0 L 0 0 0 ${10 * S}`}
                fill="none"
                stroke="var(--border-light)"
                strokeWidth="0.5"
              />
            </pattern>
            <marker id="bp-dim" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" fill="var(--text-muted)" />
            </marker>
          </defs>

          <rect width="100%" height="100%" fill="url(#bp-grid)" opacity="0.6" />

          {/* ═══ SIDE VIEW (cutaway) ═══ */}
          <g transform={`translate(${40 * S}, ${40 * S})`}>
            <text x="0" y={-14 * S} fontSize={11} fontWeight="700" fill="var(--text-primary)">
              MẶT BÊN — cắt bổ, thấy ruột
            </text>

            {/* tracks */}
            <TrackDrawing x={0} y={(h - 62) * S} w={d * S} h={62 * S} />

            {/* body shell */}
            <rect
              x={4 * S}
              y={(h - 62 - 88) * S}
              width={(d - 8) * S}
              height={88 * S}
              rx={4 * S}
              fill="#f0b429"
              fillOpacity="0.18"
              stroke="#f0b429"
              strokeWidth="2"
            />

            {/* head */}
            <rect
              x={22 * S}
              y={6 * S}
              width={64 * S}
              height={46 * S}
              rx={5 * S}
              fill="#f0b429"
              fillOpacity="0.18"
              stroke="#f0b429"
              strokeWidth="2"
            />
            {/* neck */}
            <rect x={48 * S} y={52 * S} width={14 * S} height={(h - 62 - 88 - 52) * S} fill="#64748b" fillOpacity="0.4" stroke="#64748b" />

            {/* eye barrel poking forward */}
            <rect x={4 * S} y={14 * S} width={20 * S} height={30 * S} rx={4 * S} fill="#475569" fillOpacity="0.35" stroke="#475569" strokeWidth="1.5" />

            {/* bays */}
            {sideBays.map((b) => (
              <BayRect key={b.id} bay={b} hover={hover} setHover={setHover} />
            ))}

            {/* height dimension */}
            <g stroke="var(--text-muted)" strokeWidth="1">
              <line x1={-10 * S} y1={0} x2={-10 * S} y2={h * S} markerStart="url(#bp-dim)" markerEnd="url(#bp-dim)" />
              <text
                x={-14 * S}
                y={(h / 2) * S}
                fontSize={10}
                fill="var(--text-muted)"
                textAnchor="middle"
                transform={`rotate(-90 ${-14 * S} ${(h / 2) * S})`}
                stroke="none"
              >
                {h} mm
              </text>
            </g>
            {/* depth dimension */}
            <g stroke="var(--text-muted)" strokeWidth="1">
              <line x1={0} y1={(h + 12) * S} x2={d * S} y2={(h + 12) * S} markerStart="url(#bp-dim)" markerEnd="url(#bp-dim)" />
              <text x={(d / 2) * S} y={(h + 20) * S} fontSize={10} fill="var(--text-muted)" textAnchor="middle" stroke="none">
                {d} mm
              </text>
            </g>
          </g>

          {/* ═══ FRONT VIEW ═══ */}
          <g transform={`translate(${(d + 90) * S}, ${40 * S})`}>
            <text x="0" y={-14 * S} fontSize={11} fontWeight="700" fill="var(--text-primary)">
              MẶT TRƯỚC
            </text>

            <TrackDrawing x={0} y={(h - 62) * S} w={w * S} h={62 * S} front />

            {/* body */}
            <rect
              x={8 * S}
              y={(h - 62 - 88) * S}
              width={(w - 16) * S}
              height={88 * S}
              rx={4 * S}
              fill="#f0b429"
              fillOpacity="0.18"
              stroke="#f0b429"
              strokeWidth="2"
            />

            {/* head block */}
            <rect x={(w / 2 - 42) * S} y={16 * S} width={84 * S} height={36 * S} rx={4 * S} fill="#f0b429" fillOpacity="0.18" stroke="#f0b429" strokeWidth="2" />

            {/* THE eyes — two barrels, the whole look of the thing */}
            {[-21, 21].map((dx) => (
              <g key={dx}>
                <circle cx={(w / 2 + dx) * S} cy={30 * S} r={19 * S} fill="#475569" fillOpacity="0.3" stroke="#475569" strokeWidth="2" />
                <circle cx={(w / 2 + dx) * S} cy={30 * S} r={16.2 * S} fill="#0f172a" stroke="#22d3ee" strokeWidth="1.4" />
                <circle cx={(w / 2 + dx) * S} cy={30 * S} r={9 * S} fill="#1e88e5" />
                <circle cx={(w / 2 + dx) * S} cy={30 * S} r={4 * S} fill="#05070a" />
                <circle cx={(w / 2 + dx - 3) * S} cy={27 * S} r={2 * S} fill="#fff" opacity="0.8" />
              </g>
            ))}
            <text
              x={(w / 2) * S}
              y={58 * S}
              fontSize={8.5}
              fill="#22d3ee"
              textAnchor="middle"
            >
              2× GC9A01 ⌀32,4 mm trong ống ⌀40 mm
            </text>

            {/*
              Two-jointed arms, drawn in the pose the servos default to:
              upper arm straight down from the shoulder, forearm folded
              slightly in at the elbow. Showing the fold is the point —
              a single straight bar reads as one joint and hides the
              thing that makes the gestures work.
            */}
            {[-1, 1].map((s) => {
              const shoulderX = s < 0 ? 2 : w - 2;
              const shoulderY = h - 62 - 78;
              const elbowY = shoulderY + 34;
              const handX = shoulderX + s * -7;
              const handY = elbowY + 28;
              return (
                <g key={s}>
                  {/* upper arm */}
                  <rect
                    x={(shoulderX - 4) * S}
                    y={shoulderY * S}
                    width={8 * S}
                    height={34 * S}
                    rx={3 * S}
                    fill="#94a3b8"
                    fillOpacity="0.35"
                    stroke="#94a3b8"
                    strokeWidth="1.4"
                  />
                  {/* forearm, angled in at the elbow */}
                  <rect
                    x={(handX - 3.5) * S}
                    y={elbowY * S}
                    width={7 * S}
                    height={28 * S}
                    rx={3 * S}
                    fill="#94a3b8"
                    fillOpacity="0.28"
                    stroke="#94a3b8"
                    strokeWidth="1.3"
                    transform={`rotate(${s * 14} ${shoulderX * S} ${elbowY * S})`}
                  />
                  {/* shoulder joint */}
                  <circle cx={shoulderX * S} cy={shoulderY * S} r={4.5 * S} fill="#f0b429" fillOpacity="0.55" stroke="#f0b429" strokeWidth="1.4" />
                  {/* elbow joint — the new one */}
                  <circle cx={shoulderX * S} cy={elbowY * S} r={3.6 * S} fill="#22d3ee" fillOpacity="0.5" stroke="#22d3ee" strokeWidth="1.4" />
                  <text
                    x={(shoulderX + s * 11) * S}
                    y={(elbowY + 2) * S}
                    fontSize={7.5}
                    textAnchor="middle"
                    fill="#22d3ee"
                  >
                    khuỷu
                  </text>
                  <text
                    x={(shoulderX + s * 11) * S}
                    y={(shoulderY + 2) * S}
                    fontSize={7.5}
                    textAnchor="middle"
                    fill="#f0b429"
                  >
                    vai
                  </text>
                  {/* hand */}
                  <rect x={(handX - 4) * S} y={handY * S} width={8 * S} height={7 * S} rx={2 * S} fill="#94a3b8" fillOpacity="0.4" stroke="#94a3b8" />
                </g>
              );
            })}

            {frontBays.map((b) => (
              <BayRect key={b.id} bay={b} hover={hover} setHover={setHover} />
            ))}

            {/* width dimension */}
            <g stroke="var(--text-muted)" strokeWidth="1">
              <line x1={0} y1={(h + 12) * S} x2={w * S} y2={(h + 12) * S} markerStart="url(#bp-dim)" markerEnd="url(#bp-dim)" />
              <text x={(w / 2) * S} y={(h + 20) * S} fontSize={10} fill="var(--text-muted)" textAnchor="middle" stroke="none">
                {w} mm
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* ── Bay legend ── */}
      <div className="grid gap-2 sm:grid-cols-2">
        {data.bays.map((b) => (
          <div
            key={b.id}
            onMouseEnter={() => setHover(b.id)}
            onMouseLeave={() => setHover(null)}
            className="rounded-lg border p-3 transition-colors"
            style={{
              borderColor: hover === b.id ? b.color : 'var(--border-color)',
              background: hover === b.id ? `${b.color}12` : 'var(--bg-card)',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: b.color }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {b.label}
              </span>
              <span className="ml-auto shrink-0 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {b.w}×{b.h} mm
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {b.contents.join(' · ')}
            </p>
            {b.note && (
              <p className="mt-1 text-[11px] italic" style={{ color: 'var(--text-muted)' }}>
                {b.note}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ── Printed parts ── */}
      {data.parts?.length ? (
        <section>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            <Box size={15} /> Các mảnh vỏ
          </h4>
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
            <table className="w-full min-w-[560px] text-sm" style={{ background: 'var(--bg-card)' }}>
              <thead>
                <tr className="text-left text-xs" style={{ color: 'var(--text-muted)' }}>
                  <th className="px-4 py-2 font-medium">Mảnh</th>
                  <th className="px-2 py-2 font-medium">Làm bằng</th>
                  <th className="px-2 py-2 font-medium">Kích thước</th>
                  <th className="px-4 py-2 font-medium">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {data.parts.map((p) => (
                  <tr key={p.id} className="border-t" style={{ borderColor: 'var(--border-light)' }}>
                    <td className="px-4 py-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                      {p.name}
                    </td>
                    <td className="px-2 py-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {p.method}
                    </td>
                    <td className="px-2 py-2 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {p.sizeMm}
                    </td>
                    <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {p.note ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {/* ── Assembly order ── */}
      {data.assembly?.length ? (
        <section>
          <h4 className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Thứ tự lắp
          </h4>
          <ol className="space-y-2">
            {data.assembly.map((a) => (
              <li key={a.step} className="flex gap-3">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}
                >
                  {a.step}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {a.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {a.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {/* ── Gotchas ── */}
      {data.warnings?.length ? (
        <section
          className="rounded-xl border p-4"
          style={{ borderColor: '#ef444455', background: 'rgba(239,68,68,0.05)' }}
        >
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: '#ef4444' }}>
            <AlertTriangle size={15} /> Chỗ dễ hỏng việc
          </h4>
          <ul className="space-y-1.5">
            {data.warnings.map((wn, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: '#ef4444' }}>•</span>
                {wn}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function BayRect({
  bay,
  hover,
  setHover,
}: {
  bay: EnclosureBay;
  hover: string | null;
  setHover: (id: string | null) => void;
}) {
  const on = hover === bay.id;
  return (
    <g
      onMouseEnter={() => setHover(bay.id)}
      onMouseLeave={() => setHover(null)}
      style={{ cursor: 'help' }}
    >
      <rect
        x={bay.x * S}
        y={bay.y * S}
        width={bay.w * S}
        height={bay.h * S}
        rx={2 * S}
        fill={bay.color}
        fillOpacity={on ? 0.42 : 0.22}
        stroke={bay.color}
        strokeWidth={on ? 2.2 : 1.4}
      />
      <text
        x={(bay.x + bay.w / 2) * S}
        y={(bay.y + bay.h / 2 + 2) * S}
        fontSize={8.5}
        fontWeight="600"
        textAnchor="middle"
        fill={bay.color}
      >
        {bay.label}
      </text>
      <title>
        {bay.label} — {bay.contents.join(', ')}
      </title>
    </g>
  );
}

/** Tank tracks: the silhouette that makes it read as WALL-E. */
function TrackDrawing({
  x,
  y,
  w,
  h,
  front,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  front?: boolean;
}) {
  if (front) {
    // Front view: two track walls, body between them.
    return (
      <g>
        {[0, w - 22 * S].map((dx, i) => (
          <rect
            key={i}
            x={x + dx}
            y={y}
            width={22 * S}
            height={h}
            rx={6 * S}
            fill="#334155"
            fillOpacity="0.35"
            stroke="#334155"
            strokeWidth="1.6"
          />
        ))}
      </g>
    );
  }
  // Side view: the classic rounded-triangle track loop.
  const r = h / 2;
  return (
    <g>
      <path
        d={`M ${x + r} ${y} H ${x + w - r} A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} H ${x + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`}
        fill="#334155"
        fillOpacity="0.3"
        stroke="#334155"
        strokeWidth="1.8"
      />
      <circle cx={x + r} cy={y + r} r={r * 0.55} fill="none" stroke="#334155" strokeWidth="1.4" />
      <circle cx={x + w - r} cy={y + r} r={r * 0.55} fill="none" stroke="#334155" strokeWidth="1.4" />
      {/* track links */}
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={i}
          x1={x + r + (i * (w - 2 * r)) / 8}
          y1={y}
          x2={x + r + (i * (w - 2 * r)) / 8}
          y2={y + 5}
          stroke="#334155"
          strokeWidth="1.6"
        />
      ))}
    </g>
  );
}
