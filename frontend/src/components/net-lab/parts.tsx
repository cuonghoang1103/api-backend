'use client';
/**
 * Mảnh giao diện dùng chung cho 5 mô phỏng Chương 2 (subnet / route / nat / ipv6 / bgp — 01/11/2026):
 *   <Src real />      — nhãn nguồn số liệu: xanh "capture thật" hay cam "tính ra"
 *   <Term … />        — khung terminal: dòng thật / dòng tính ra / dòng đang sáng
 *   <Topo … />        — sơ đồ mạng SVG: hộp máy, dây, gói tin đang chạy trên một dây
 * Không đổi gì của 4 mô phỏng Chương 1 (chúng không dùng file này).
 */
import type { CSSProperties, ReactNode } from 'react';
import { css as s, cx, tx, type Lang } from '../os-lab/ui';
import n from './netlab.module.css';

export function Src({ real, lang, en, vi }: { real: boolean; lang: Lang; en?: string; vi?: string }) {
  return <span className={cx(n.src, real ? n.srcReal : n.srcCalc)}>{en && vi ? tx(lang, en, vi) : real ? tx(lang, 'real capture', 'capture thật') : tx(lang, 'computed', 'tính ra')}</span>;
}

export type TLine = string | { t: string; on?: boolean; calc?: boolean; dim?: boolean; tag?: string };
export function Term({ title, lines, lang, real, tour, wrap, badge }: { title?: ReactNode; lines: TLine[]; lang: Lang; real?: boolean; tour?: string; wrap?: boolean; badge?: ReactNode }) {
  return (
    <div data-tour={tour} style={{ minWidth: 0 }}>
      {(title || real !== undefined || badge) && (
        <div className={s.panelTitle} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
          {title}{real !== undefined && <Src real={real} lang={lang} />}{badge}
        </div>
      )}
      <div className={cx(n.term, wrap && n.wrapTerm)}>
        {lines.length === 0 && <div className={n.termEcho}>{tx(lang, '(nothing yet)', '(chưa có gì)')}</div>}
        {lines.map((l, k) => {
          const o = typeof l === 'string' ? { t: l } : l;
          return (
            <div key={k} className={cx(o.on && n.termOn, o.calc && n.termCalc, (o.dim || o.t.startsWith('$ ') || o.t.startsWith('# ')) && !o.on && n.termEcho)}>
              {o.t}{o.tag && <span className={n.termTag}>{o.tag}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface TNode { id: string; x: number; y: number; icon: string; name: string; sub?: string; sub2?: string; on?: boolean; bad?: boolean; gone?: boolean; w?: number }
export interface TLink { a: string; b: string; label?: string; on?: boolean; bad?: boolean; back?: boolean; dashed?: boolean }
/** Sơ đồ mạng. `pill` = nhãn trên cùng (gói gì đang chạy); `k` = màu gói. Liên kết `on` vẽ nét chạy từ a → b (back: b → a). */
export function Topo({ nodes, links, w = 520, h = 210, pill, k = '#2563eb', label, marks }: {
  nodes: TNode[]; links: TLink[]; w?: number; h?: number; pill?: string; k?: string; label: string;
  marks?: Array<{ x: number; y: number; text: string; bad?: boolean; ok?: boolean }>;
}) {
  const at = (id: string) => nodes.find((x) => x.id === id)!;
  return (
    <svg className={n.topo} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} style={{ '--k': k } as CSSProperties}>
      {links.map((l, i) => {
        const A = at(l.a), B = at(l.b);
        const [p, q] = l.back ? [B, A] : [A, B];
        return (
          <g key={i}>
            <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className={n.tLink} strokeDasharray={l.dashed ? '4 4' : undefined} />
            {(l.on || l.bad) && <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} className={cx(n.tLink, l.bad ? n.tLinkDrop : n.tLinkOn)} />}
            {l.label && <text x={(A.x + B.x) / 2} y={(A.y + B.y) / 2 - 6} textAnchor="middle" className={n.tSub}>{l.label}</text>}
          </g>
        );
      })}
      {nodes.map((d) => {
        const bw = d.w ?? 104;
        return (
          <g key={d.id}>
            <rect x={d.x - bw / 2} y={d.y - 27} width={bw} height={54} rx={10} className={cx(n.tBox, d.on && n.tBoxOn, d.gone && n.tBoxGone)} style={d.bad ? { stroke: 'var(--ol-bad)', strokeWidth: 3 } : undefined} />
            <text x={d.x} y={d.y - 9} textAnchor="middle" className={n.tName}>{d.icon} {d.name}</text>
            {d.sub && <text x={d.x} y={d.y + 6} textAnchor="middle" className={n.tSub}>{d.sub}</text>}
            {d.sub2 && <text x={d.x} y={d.y + 19} textAnchor="middle" className={n.tSub}>{d.sub2}</text>}
          </g>
        );
      })}
      {marks?.map((m, i) => <text key={i} x={m.x} y={m.y} textAnchor="middle" fontSize="13" fontWeight={800} fill={m.bad ? 'var(--ol-bad)' : m.ok ? 'var(--ol-ok)' : 'var(--ol-text)'}>{m.text}</text>)}
      {pill && (
        <g>
          <rect x={w / 2 - Math.min(w / 2 - 6, pill.length * 3.4 + 16)} y={4} width={2 * Math.min(w / 2 - 6, pill.length * 3.4 + 16)} height={22} rx={11} className={n.tPill} />
          <text x={w / 2} y={19} textAnchor="middle" className={n.tPillTxt}>{pill}</text>
        </g>
      )}
    </svg>
  );
}

/** Nút chọn nhỏ (một hàng nút, nút đang chọn sáng) */
export function Picks<T extends string>({ value, options, onChange, label, tour }: { value: T; options: Array<[T, string]>; onChange: (v: T) => void; label?: string; tour?: string }) {
  return (
    <div className={n.picks} data-tour={tour}>
      {label && <span className={s.lbl}>{label}</span>}
      {options.map(([v, t]) => <button type="button" key={v} className={cx(s.btn, v === value && s.on)} onClick={() => onChange(v)}>{t}</button>)}
    </div>
  );
}
