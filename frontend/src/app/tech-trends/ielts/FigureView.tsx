'use client';

/**
 * Vẽ hình cho đề Writing Task 1 và bản đồ cho Listening Map Labelling.
 *
 * Toàn bộ là SVG NỘI TUYẾN — không tải ảnh từ đâu. Lý do quan trọng nhất
 * không phải kỹ thuật mà là sư phạm: đề Task 1 thật là một biểu đồ, và việc
 * khó của Task 1 chính là ĐỌC biểu đồ rồi chọn ra đặc điểm đáng viết. Nếu chỉ
 * đưa bảng số bằng chữ thì người học đọc số có sẵn, không tập được kỹ năng đó.
 *
 * Số liệu và bài mẫu đọc chung MỘT nguồn dữ liệu, nên hình vẽ và các con số
 * trong bài mẫu không bao giờ lệch nhau.
 *
 * Màu lấy cố định theo bảng dưới thay vì theo biến CSS: trang này có nền tối
 * cố định (#0a0a0f) nên không cần theo theme, mà màu cố định thì bảo đảm tương
 * phản đủ để đọc số trên biểu đồ.
 */
import type { Figure, MapSpec } from './data/types';

const PALETTE = ['#38bdf8', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#fb923c'];

const AXIS = '#64748b';
const GRID = 'rgba(148,163,184,0.18)';
const TEXT = '#cbd5e1';
const TEXT_DIM = '#94a3b8';

/** Làm tròn để trục dọc có mốc đẹp thay vì số lẻ. */
function niceMax(v: number): number {
  if (v <= 0) return 1;
  const mag = 10 ** Math.floor(Math.log10(v));
  const n = v / mag;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * mag;
}

/* ────────────────────────── BIỂU ĐỒ CỘT ────────────────────────── */

function BarChart({ f }: { f: Figure }) {
  const cats = f.categories ?? [];
  const series = f.series ?? [];
  const W = 640;
  const H = 300;
  const padL = 48;
  const padR = 12;
  const padT = 16;
  const padB = 46;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const max = niceMax(Math.max(...series.flatMap((s) => s.values), 1));
  const groupW = plotW / (cats.length || 1);
  const barW = Math.max(6, (groupW * 0.66) / (series.length || 1));
  const ticks = 5;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={f.title}>
      {/* lưới ngang + mốc trục dọc */}
      {Array.from({ length: ticks + 1 }, (_, i) => {
        const v = (max / ticks) * i;
        const y = padT + plotH - (v / max) * plotH;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke={GRID} strokeWidth={1} />
            <text x={padL - 8} y={y + 4} textAnchor="end" fontSize={11} fill={TEXT_DIM}>
              {Number.isInteger(v) ? v : v.toFixed(1)}
            </text>
          </g>
        );
      })}

      {/* cột */}
      {cats.map((c, ci) => (
        <g key={c}>
          {series.map((s, si) => {
            const v = s.values[ci] ?? 0;
            const h = (v / max) * plotH;
            const x = padL + ci * groupW + groupW / 2 - (barW * series.length) / 2 + si * barW;
            const y = padT + plotH - h;
            return (
              <g key={s.name}>
                <rect
                  x={x}
                  y={y}
                  width={barW - 2}
                  height={Math.max(0, h)}
                  fill={s.color ?? PALETTE[si % PALETTE.length]}
                  rx={2}
                />
                {series.length <= 3 && (
                  <text x={x + (barW - 2) / 2} y={y - 4} textAnchor="middle" fontSize={10} fill={TEXT_DIM}>
                    {v}
                  </text>
                )}
              </g>
            );
          })}
          <text
            x={padL + ci * groupW + groupW / 2}
            y={H - padB + 16}
            textAnchor="middle"
            fontSize={11}
            fill={TEXT}
          >
            {c}
          </text>
        </g>
      ))}

      {/* trục */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={AXIS} strokeWidth={1} />
      <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke={AXIS} strokeWidth={1} />
      {f.unit && (
        <text x={4} y={12} fontSize={11} fill={TEXT_DIM}>
          {f.unit}
        </text>
      )}
    </svg>
  );
}

/* ────────────────────────── BIỂU ĐỒ ĐƯỜNG ────────────────────────── */

function LineChart({ f }: { f: Figure }) {
  const cats = f.categories ?? [];
  const series = f.series ?? [];
  const W = 640;
  const H = 300;
  const padL = 48;
  const padR = 12;
  const padT = 16;
  const padB = 46;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const max = niceMax(Math.max(...series.flatMap((s) => s.values), 1));
  const stepX = cats.length > 1 ? plotW / (cats.length - 1) : plotW;
  const ticks = 5;
  const px = (i: number): number => padL + i * stepX;
  const py = (v: number): number => padT + plotH - (v / max) * plotH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={f.title}>
      {Array.from({ length: ticks + 1 }, (_, i) => {
        const v = (max / ticks) * i;
        const y = py(v);
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke={GRID} strokeWidth={1} />
            <text x={padL - 8} y={y + 4} textAnchor="end" fontSize={11} fill={TEXT_DIM}>
              {Number.isInteger(v) ? v : v.toFixed(1)}
            </text>
          </g>
        );
      })}

      {series.map((s, si) => {
        const color = s.color ?? PALETTE[si % PALETTE.length];
        const d = s.values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i)} ${py(v)}`).join(' ');
        return (
          <g key={s.name}>
            <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
            {s.values.map((v, i) => (
              <g key={i}>
                <circle cx={px(i)} cy={py(v)} r={3.5} fill={color} />
                <text x={px(i)} y={py(v) - 8} textAnchor="middle" fontSize={10} fill={TEXT_DIM}>
                  {v}
                </text>
              </g>
            ))}
          </g>
        );
      })}

      {cats.map((c, i) => (
        <text key={c} x={px(i)} y={H - padB + 16} textAnchor="middle" fontSize={11} fill={TEXT}>
          {c}
        </text>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={AXIS} strokeWidth={1} />
      <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke={AXIS} strokeWidth={1} />
      {f.unit && (
        <text x={4} y={12} fontSize={11} fill={TEXT_DIM}>
          {f.unit}
        </text>
      )}
    </svg>
  );
}

/* ────────────────────────── BIỂU ĐỒ TRÒN ────────────────────────── */

function PieChart({ f }: { f: Figure }) {
  const slices = f.slices ?? [];
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const W = 640;
  const H = 260;
  const cx = 150;
  const cy = H / 2;
  const r = 92;

  let acc = -Math.PI / 2; // bắt đầu từ 12 giờ cho dễ đọc

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={f.title}>
      {slices.map((s, i) => {
        const frac = s.value / total;
        const a0 = acc;
        const a1 = acc + frac * Math.PI * 2;
        acc = a1;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const x0 = cx + r * Math.cos(a0);
        const y0 = cy + r * Math.sin(a0);
        const x1 = cx + r * Math.cos(a1);
        const y1 = cy + r * Math.sin(a1);
        const mid = (a0 + a1) / 2;
        const lx = cx + r * 0.62 * Math.cos(mid);
        const ly = cy + r * 0.62 * Math.sin(mid);
        const color = s.color ?? PALETTE[i % PALETTE.length];
        return (
          <g key={s.label}>
            <path
              d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`}
              fill={color}
              stroke="#0a0a0f"
              strokeWidth={1.5}
            />
            {frac > 0.06 && (
              <text x={lx} y={ly + 4} textAnchor="middle" fontSize={12} fontWeight={600} fill="#0a0a0f">
                {Math.round(frac * 100)}%
              </text>
            )}
          </g>
        );
      })}

      {/* chú giải */}
      {slices.map((s, i) => (
        <g key={`l-${s.label}`} transform={`translate(300, ${40 + i * 26})`}>
          <rect width={14} height={14} rx={3} fill={s.color ?? PALETTE[i % PALETTE.length]} />
          <text x={22} y={12} fontSize={13} fill={TEXT}>
            {s.label} — {s.value}
            {unitSuffix(f.unit ?? '%')}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ────────────────────────── BẢNG SỐ LIỆU ────────────────────────── */

/**
 * Đơn vị dán ngay sau số hay tách bằng khoảng trắng?
 *
 * Ký hiệu (%, °) viết dính: "38%". Đơn vị là CHỮ thì phải tách, nếu không ra
 * "186phút" — đúng lỗi đã thấy ở bảng thời gian trong ngày của chặng 4.
 */
function unitSuffix(unit?: string): string {
  if (!unit) return '';
  return /^[%°$£€]/.test(unit) ? unit : ` ${unit}`;
}

function TableFigure({ f }: { f: Figure }) {
  const cats = f.categories ?? [];
  const series = f.series ?? [];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left px-3 py-2 border-b border-white/15 text-slate-400 font-medium"> </th>
            {cats.map((c) => (
              <th key={c} className="text-right px-3 py-2 border-b border-white/15 text-white font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {series.map((s, si) => (
            <tr key={s.name} className={si % 2 ? 'bg-white/[0.02]' : ''}>
              <td className="px-3 py-2 border-b border-white/10 text-slate-200">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-sm mr-2 align-middle"
                  style={{ background: s.color ?? PALETTE[si % PALETTE.length] }}
                />
                {s.name}
              </td>
              {s.values.map((v, i) => (
                <td key={i} className="text-right px-3 py-2 border-b border-white/10 text-slate-300 tabular-nums">
                  {v}
                  {unitSuffix(f.unit)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ────────────────────────── SƠ ĐỒ QUY TRÌNH ────────────────────────── */

function ProcessFigure({ f }: { f: Figure }) {
  const steps = f.steps ?? [];
  return (
    <div className="flex flex-wrap items-stretch gap-2">
      {steps.map((s, i) => (
        <div key={i} className="flex items-stretch gap-2">
          <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2.5 min-w-[8.5rem] max-w-[13rem]">
            <p className="text-[10px] text-sky-300 font-bold">BƯỚC {i + 1}</p>
            <p className="text-white text-sm leading-snug mt-0.5">{s.label}</p>
            {s.note && <p className="text-slate-400 text-xs mt-1 leading-snug">{s.note}</p>}
          </div>
          {i < steps.length - 1 && (
            <span className="self-center text-slate-600 text-lg" aria-hidden>
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────── BẢN ĐỒ ────────────────────────── */

function MapFigure({ m, title }: { m: MapSpec; title: string }) {
  const CELL = 46;
  const W = m.cols * CELL;
  const H = m.rows * CELL;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={title}>
      <rect width={W} height={H} fill="rgba(255,255,255,0.02)" rx={8} />

      {/* lối đi / đường */}
      {(m.paths ?? []).map((p, i) => (
        <g key={`p-${i}`}>
          <rect
            x={p.x * CELL}
            y={p.y * CELL}
            width={p.w * CELL}
            height={p.h * CELL}
            fill="rgba(148,163,184,0.14)"
            rx={4}
          />
          {p.label && (
            <text
              x={p.x * CELL + (p.w * CELL) / 2}
              y={p.y * CELL + (p.h * CELL) / 2 + 4}
              textAnchor="middle"
              fontSize={11}
              fill={TEXT_DIM}
            >
              {p.label}
            </text>
          )}
        </g>
      ))}

      {/* khối: phòng / khu vực */}
      {m.boxes.map((b, i) => {
        const isBlank = !!b.blank;
        return (
          <g key={`b-${i}`}>
            <rect
              x={b.x * CELL + 2}
              y={b.y * CELL + 2}
              width={b.w * CELL - 4}
              height={b.h * CELL - 4}
              fill={isBlank ? 'rgba(56,189,248,0.12)' : 'rgba(255,255,255,0.05)'}
              stroke={isBlank ? '#38bdf8' : 'rgba(255,255,255,0.2)'}
              strokeWidth={isBlank ? 2 : 1}
              strokeDasharray={isBlank ? '5 3' : undefined}
              rx={5}
            />
            <text
              x={b.x * CELL + (b.w * CELL) / 2}
              y={b.y * CELL + (b.h * CELL) / 2 + 5}
              textAnchor="middle"
              fontSize={isBlank ? 16 : 12}
              fontWeight={isBlank ? 700 : 500}
              fill={isBlank ? '#38bdf8' : TEXT}
            >
              {b.blank ?? b.label}
            </text>
          </g>
        );
      })}

      {/* mốc */}
      {(m.pins ?? []).map((p, i) => (
        <g key={`pin-${i}`}>
          <circle cx={p.x * CELL} cy={p.y * CELL} r={6} fill="#34d399" />
          <text x={p.x * CELL + 10} y={p.y * CELL + 4} fontSize={11} fill="#34d399" fontWeight={600}>
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ────────────────────────── VỎ NGOÀI ────────────────────────── */

export default function FigureView({ figure }: { figure: Figure }) {
  const showLegend =
    (figure.kind === 'bar' || figure.kind === 'line') && (figure.series?.length ?? 0) > 1;

  return (
    <figure className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <figcaption className="mb-3">
        <p className="text-white text-sm font-semibold leading-snug">{figure.title}</p>
        {figure.note && <p className="text-slate-500 text-xs mt-0.5">{figure.note}</p>}
      </figcaption>

      {figure.kind === 'bar' && <BarChart f={figure} />}
      {figure.kind === 'line' && <LineChart f={figure} />}
      {figure.kind === 'pie' && <PieChart f={figure} />}
      {figure.kind === 'table' && <TableFigure f={figure} />}
      {figure.kind === 'process' && <ProcessFigure f={figure} />}
      {figure.kind === 'map' && figure.map && <MapFigure m={figure.map} title={figure.title} />}

      {showLegend && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
          {figure.series!.map((s, i) => (
            <span key={s.name} className="inline-flex items-center gap-1.5 text-xs text-slate-300">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ background: s.color ?? PALETTE[i % PALETTE.length] }}
              />
              {s.name}
            </span>
          ))}
        </div>
      )}
    </figure>
  );
}
