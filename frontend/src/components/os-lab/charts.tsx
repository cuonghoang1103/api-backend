'use client';
/** Biểu đồ đường + thanh đo dùng chung cho các mô phỏng mới (SVG co giãn theo bề ngang, không cuộn ngang trang). */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { css as s } from './ui';

/** bề ngang thật của khung (px) — để chữ trong SVG giữ đúng cỡ trên điện thoại */
export function useWidth<T extends HTMLElement>(fallback = 600) {
  const ref = useRef<T>(null);
  const [w, setW] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((e) => { const x = Math.round(e[0].contentRect.width); if (x > 0) setW(x); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export interface Series { name: string; color: string; data: Array<number | null>; dash?: string; width?: number; area?: boolean }

export function LineChart({ series, height = 120, yMax, yMin = 0, xLabels, refs = [], title, unit = '', marks = [], xCount, logY }: {
  series: Series[]; height?: number; yMax?: number; yMin?: number; xLabels?: [string, string]; title?: ReactNode; unit?: string;
  refs?: Array<{ y: number; label: string; color?: string }>; marks?: Array<{ x: number; label: string; color?: string }>; xCount?: number; logY?: boolean;
}) {
  const [box, W] = useWidth<HTMLDivElement>();
  const H = height, L = 38, R = 8, T = 10, B = xLabels ? 18 : 6;
  const n = xCount ?? Math.max(2, ...series.map((x) => x.data.length));
  const vals = series.flatMap((x) => x.data.filter((v): v is number => v !== null && Number.isFinite(v)));
  const top = yMax ?? Math.max(1e-9, ...vals, ...refs.map((r) => r.y)) * 1.08;
  const ly = (v: number) => (logY ? Math.log10(Math.max(v, 1e-9)) : v);
  const lo = ly(logY ? Math.max(yMin, 1e-3) : yMin), hi = ly(top);
  const X = (i: number) => L + ((W - L - R) * i) / Math.max(1, n - 1);
  const Y = (v: number) => T + (H - T - B) * (1 - (ly(Math.min(top, Math.max(yMin, v))) - lo) / Math.max(1e-9, hi - lo));
  const fmt = (v: number) => (v >= 1000 ? `${Math.round(v / 100) / 10}k` : v >= 10 ? String(Math.round(v)) : String(Math.round(v * 10) / 10));
  const ticks = logY ? Array.from({ length: Math.max(1, Math.floor(hi) - Math.ceil(lo) + 1) }, (_, k) => 10 ** (Math.ceil(lo) + k)) : [yMin, (yMin + top) / 2, top];
  return (
    <div style={{ minWidth: 0 }} ref={box}>
      {title && <div className={s.small} style={{ fontWeight: 700, marginBottom: 2 }}>{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" style={{ display: 'block', maxWidth: '100%' }}>
        {ticks.map((v, k) => (
          <g key={k}>
            <line x1={L} x2={W - R} y1={Y(v)} y2={Y(v)} className={s.svgGrid} strokeWidth={1} vectorEffect="non-scaling-stroke" />
            <text x={L - 4} y={Y(v) + 4} fontSize={11} textAnchor="end" className={s.svgMuted}>{fmt(v)}{unit}</text>
          </g>
        ))}
        {refs.map((r, k) => (
          <g key={`r${k}`}>
            <line x1={L} x2={W - R} y1={Y(r.y)} y2={Y(r.y)} stroke={r.color ?? 'var(--ol-bad)'} strokeDasharray="6 4" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            <text x={W - R - 2} y={Y(r.y) - 3} fontSize={11} textAnchor="end" fill={r.color ?? 'var(--ol-bad)'} fontWeight={700}>{r.label}</text>
          </g>
        ))}
        {marks.map((m, k) => (
          <g key={`m${k}`}>
            <line x1={X(m.x)} x2={X(m.x)} y1={T} y2={H - B} stroke={m.color ?? 'var(--ol-muted)'} strokeDasharray="3 3" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            <text x={X(m.x) + 3} y={T + 10} fontSize={10.5} fill={m.color ?? 'var(--ol-muted)'} fontWeight={700}>{m.label}</text>
          </g>
        ))}
        {series.map((sr, k) => {
          let d = '', pen = false;
          sr.data.forEach((v, i) => {
            if (v === null || !Number.isFinite(v)) { pen = false; return; }
            d += `${pen ? 'L' : 'M'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`; pen = true;
          });
          const first = sr.data.findIndex((v) => v !== null), lastI = sr.data.length - 1;
          return (
            <g key={k}>
              {sr.area && d && <path d={`${d}L${X(lastI)},${H - B}L${X(Math.max(0, first))},${H - B}Z`} fill={sr.color} opacity={0.14} />}
              <path d={d} fill="none" stroke={sr.color} strokeWidth={sr.width ?? 2} strokeDasharray={sr.dash} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            </g>
          );
        })}
        {xLabels && <>
          <text x={L} y={H - 4} fontSize={11} className={s.svgMuted}>{xLabels[0]}</text>
          <text x={W - R} y={H - 4} fontSize={11} textAnchor="end" className={s.svgMuted}>{xLabels[1]}</text>
        </>}
      </svg>
      {series.length > 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 12px', fontSize: 11.5 }}>
          {series.map((sr) => <span key={sr.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 14, height: 3, background: sr.color, display: 'inline-block', borderRadius: 2 }} />{sr.name}</span>)}
        </div>
      )}
    </div>
  );
}

/** Thanh đo kiểu htop: nhiều đoạn màu trên một nền, kèm nhãn trái và chữ phải. */
export function Meter({ label, parts, total, right, title }: { label: string; parts: Array<{ v: number; color: string; name?: string }>; total: number; right?: ReactNode; title?: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '42px minmax(0,1fr) auto', gap: 6, alignItems: 'center', fontSize: 12 }} title={title}>
      <span className={s.mono} style={{ fontWeight: 800 }}>{label}</span>
      <div style={{ display: 'flex', height: 14, background: 'var(--ol-panel2)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--ol-border)' }}>
        {parts.map((p, k) => <div key={k} title={p.name} style={{ width: `${Math.max(0, Math.min(100, (100 * p.v) / total))}%`, background: p.color, transition: 'width .35s' }} />)}
      </div>
      <span className={s.mono} style={{ fontSize: 11.5, whiteSpace: 'nowrap' }}>{right}</span>
    </div>
  );
}
