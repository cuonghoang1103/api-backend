'use client';

/**
 * Database designer — ERD vẽ bằng SVG từ mô hình đã đọc (không qua Mermaid ⇒ vẽ lại tức thì khi gõ, giữ chỗ bảng):
 *   - Thẻ bảng: dải màu đầu, tên (+ schema), từng cột: 🔑 PK · ↗ FK · U (UNIQUE) · tên · kiểu · "?" cho cột cho NULL ·
 *     "auto" cho IDENTITY/SERIAL/AUTO_INCREMENT; rê chuột thấy chú thích, DEFAULT, CHECK.
 *   - Đường quan hệ nối ĐÚNG cột khoá ngoại ⇄ cột được tham chiếu, ký hiệu chân chim (crow's foot): phía cha | (bắt buộc) hoặc
 *     o| (không bắt buộc — khoá ngoại cho NULL); phía con o{ (nhiều) hoặc o| (1–1: khoá ngoại cũng là PK/UNIQUE). Nét liền =
 *     quan hệ xác định (khoá ngoại nằm trong PK của con), nét đứt = không xác định.
 *   - Bấm bảng/cột ⇒ chọn (trình soạn nhảy tới câu CREATE TABLE); kéo đầu bảng ⇒ dời chỗ (lưu vào dòng meta của nguồn).
 * Màu lấy từ bảng màu cố định theo biến thể (sáng/tối/in) ⇒ xuất SVG/PNG ra đúng như thấy.
 */

import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { relationships, sameName, type DbModel, type Relationship, type Table } from '@/lib/sqlDesign';
import { layoutErd } from '@/lib/sqlDesign/layout';

export type ErdVariant = 'light' | 'dark' | 'print';

interface Pal { paper: string; card: string; border: string; ink: string; muted: string; soft: string; line: string; accent: string; key: string; fk: string; uk: string; rowHover: string; error: string; grid: string }
const PAL: Record<ErdVariant, Pal> = {
  light: { paper: '#fbfaf7', card: '#ffffff', border: '#d9d6ce', ink: '#1f1f1c', muted: '#6b6a63', soft: '#9a988f', line: '#8a877e', accent: '#4f5bd5', key: '#c08a00', fk: '#2d6bd6', uk: '#0f766e', rowHover: '#f3f2ee', error: '#cf342f', grid: '#efede7' },
  dark: { paper: '#141416', card: '#1d1d21', border: '#3a3a42', ink: '#ededef', muted: '#a9a9b2', soft: '#7d7d86', line: '#8b8b96', accent: '#8b93ee', key: '#f0c14b', fk: '#6cb0fa', uk: '#4ec9b0', rowHover: '#25252b', error: '#ff6b62', grid: '#1b1b1f' },
  print: { paper: '#ffffff', card: '#ffffff', border: '#777777', ink: '#111111', muted: '#444444', soft: '#666666', line: '#333333', accent: '#2b3591', key: '#111111', fk: '#111111', uk: '#111111', rowHover: '#ffffff', error: '#111111', grid: '#ffffff' },
};
const HUES = [222, 262, 190, 152, 32, 340, 12, 282, 205, 95];
const hueOf = (s: string) => { let h = 0; for (const c of s.toLowerCase()) h = (h * 31 + c.charCodeAt(0)) >>> 0; return HUES[h % HUES.length]; };
const headFill = (v: ErdVariant, hue: number) => (v === 'print' ? '#f0f0f0' : v === 'dark' ? `hsl(${hue} 28% 21%)` : `hsl(${hue} 72% 95%)`);
const headBar = (v: ErdVariant, hue: number) => (v === 'print' ? '#333333' : v === 'dark' ? `hsl(${hue} 65% 62%)` : `hsl(${hue} 58% 48%)`);

export const HEADER = 34;
export const ROW = 22;
const PADB = 6;
const FONT = "'Be Vietnam Pro', 'Inter', 'Segoe UI', Arial, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

let measureCtx: CanvasRenderingContext2D | null | undefined;
function textW(s: string, font: string, approx: number): number {
  if (measureCtx === undefined) { try { measureCtx = typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d'); } catch { measureCtx = null; } }
  if (!measureCtx) return s.length * approx;
  measureCtx.font = font;
  return measureCtx.measureText(s).width;
}

export interface CardRow { name: string; type: string; pk: boolean; fk: boolean; uk: boolean; nullable: boolean; auto: boolean; tip: string }
export interface Card { name: string; label: string; rows: CardRow[]; w: number; h: number; hue: number; tip: string; incomplete: boolean; table: Table }

export function buildCards(model: DbModel): Card[] {
  return model.tables.map((t) => {
    const ukSingle = new Set([...t.uniques.filter((u) => u.columns.length === 1).map((u) => u.columns[0].toLowerCase()), ...t.indexes.filter((i) => i.unique && i.columns.length === 1 && !i.columns[0].expr).map((i) => i.columns[0].name.toLowerCase())]);
    const fkCols = new Set(t.foreignKeys.flatMap((f) => f.columns.map((c) => c.toLowerCase())));
    const pkCols = new Set((t.primaryKey?.columns ?? []).map((c) => c.toLowerCase()));
    const rows: CardRow[] = t.columns.map((c) => {
      const lc = c.name.toLowerCase();
      const checks = t.checks.filter((k) => k.column ? sameName(k.column, c.name) : k.expr.toks.some((x) => (x.t === 'word' || x.t === 'qident') && sameName(x.v, c.name))).map((k) => `CHECK ${k.expr.text}`);
      const fk = t.foreignKeys.find((f) => f.columns.some((x) => sameName(x, c.name)));
      const tip = [
        `${c.name} ${c.type.raw || c.type.name}${c.nullable ? ' NULL' : ' NOT NULL'}`,
        c.identity ? `auto-increment (${c.identity.start}, ${c.identity.increment})` : '',
        c.default ? `DEFAULT ${c.default.text}` : '', c.computed ? `= ${c.computed.expr.text}` : '',
        fk ? `→ ${fk.refTable}(${fk.refColumns.join(', ') || 'PK'})${fk.onDelete ? ` ON DELETE ${fk.onDelete}` : ''}` : '',
        ...checks.slice(0, 3), c.comment ?? '',
      ].filter(Boolean).join('\n');
      return { name: c.name, type: (c.type.raw || c.type.name || '').replace(/\s+/g, ' ').slice(0, 28), pk: pkCols.has(lc), fk: fkCols.has(lc), uk: ukSingle.has(lc), nullable: c.nullable, auto: !!c.identity, tip };
    });
    const label = t.schema ? `${t.schema}.${t.name}` : t.name;
    const nameW = Math.max(0, ...rows.map((r) => textW(r.name, `500 12.5px ${FONT}`, 7.4)));
    const typeW = Math.max(0, ...rows.map((r) => textW(r.type + (r.nullable ? ' ?' : ''), `11px ${MONO}`, 6.7) + (r.auto ? 30 : 0)));
    const w = Math.round(Math.min(460, Math.max(170, textW(label, `600 13.5px ${FONT}`, 8.2) + 56, 30 + nameW + 22 + typeW + 14)));
    const h = HEADER + Math.max(1, rows.length) * ROW + PADB;
    return { name: t.name, label, rows, w, h, hue: hueOf(t.name), tip: [label, t.comment ?? '', `${t.columns.length} columns`].filter(Boolean).join('\n'), incomplete: !!t.incomplete, table: t };
  });
}

export interface ErdHandle {
  /** SVG đứng riêng (màu tuyệt đối) để xuất. */
  svgElement(): SVGSVGElement | null;
  /** Hình chữ nhật (toạ độ nội dung) của một bảng — để khung phóng đưa nó vào giữa. */
  rectOf(name: string): { x: number; y: number; w: number; h: number } | null;
  /** Vị trí hiện tại của mọi bảng (toạ độ bố cục) — để "đóng băng" bố cục khi người kéo bảng đầu tiên. */
  positions(): Record<string, [number, number]>;
}

export interface ErdProps {
  model: DbModel;
  variant: ErdVariant;
  direction: 'LR' | 'TB';
  layout?: Record<string, [number, number]>;
  selected: string | null;
  /** Bảng đang có lỗi đọc (vẽ viền đỏ nét đứt). */
  broken?: Set<string>;
  editable: boolean;
  getScale: () => number;
  onSelect: (table: string | null, column?: string) => void;
  onMove?: (table: string, x: number, y: number) => void;
}

const MARGIN = 40;

const ErdCanvas = forwardRef<ErdHandle, ErdProps>(function ErdCanvas({ model, variant, direction, layout, selected, broken, editable, getScale, onSelect, onMove }, ref) {
  const p = PAL[variant];
  const cards = useMemo(() => buildCards(model), [model]);
  const rels = useMemo(() => relationships(model).filter((r) => cards.some((c) => sameName(c.name, r.parent))), [model, cards]);
  const auto = useMemo(() => layoutErd(cards.map((c) => ({ id: c.name, w: c.w, h: c.h })), rels.map((r) => ({ from: r.child, to: r.parent })), { direction, fixed: layout }), [cards, rels, direction, layout]);
  const [dragging, setDragging] = useState<{ name: string; x: number; y: number } | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pos = (name: string) => (dragging && dragging.name === name ? { x: dragging.x, y: dragging.y } : auto[name] ?? { x: 0, y: 0 });

  const bounds = useMemo(() => {
    let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
    for (const c of cards) { const q = auto[c.name] ?? { x: 0, y: 0 }; x0 = Math.min(x0, q.x); y0 = Math.min(y0, q.y); x1 = Math.max(x1, q.x + c.w); y1 = Math.max(y1, q.y + c.h); }
    if (!cards.length) return { x0: 0, y0: 0, w: 400, h: 240 };
    return { x0: x0 - MARGIN, y0: y0 - MARGIN, w: x1 - x0 + MARGIN * 2, h: y1 - y0 + MARGIN * 2 };
  }, [cards, auto]);

  useImperativeHandle(ref, () => ({
    svgElement: () => svgRef.current,
    rectOf: (name) => {
      const c = cards.find((x) => sameName(x.name, name));
      if (!c) return null;
      const q = auto[c.name] ?? { x: 0, y: 0 };
      return { x: q.x - bounds.x0, y: q.y - bounds.y0, w: c.w, h: c.h };
    },
    positions: () => Object.fromEntries(cards.map((c) => [c.name, [Math.round(auto[c.name]?.x ?? 0), Math.round(auto[c.name]?.y ?? 0)] as [number, number]])),
  }), [cards, auto, bounds]);

  const focus = selected ?? hover;
  const related = useMemo(() => {
    if (!focus) return null;
    const s = new Set<string>([focus.toLowerCase()]);
    for (const r of rels) { if (sameName(r.child, focus)) s.add(r.parent.toLowerCase()); if (sameName(r.parent, focus)) s.add(r.child.toLowerCase()); }
    return s;
  }, [focus, rels]);

  const startDrag = (e: React.PointerEvent, c: Card) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const start = { cx: e.clientX, cy: e.clientY, ...pos(c.name) };
    let moved = false;
    const el = e.currentTarget as Element;
    const pid = e.pointerId;
    const move = (ev: PointerEvent) => {
      const k = getScale() || 1;
      const dx = (ev.clientX - start.cx) / k; const dy = (ev.clientY - start.cy) / k;
      if (!moved && Math.hypot(dx, dy) < 3) return;
      if (!moved) { moved = true; try { el.setPointerCapture(pid); } catch { /* */ } }
      setDragging({ name: c.name, x: Math.round((start.x + dx) / 8) * 8, y: Math.round((start.y + dy) / 8) * 8 });
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      if (moved) {
        const k = getScale() || 1;
        const nx = Math.round((start.x + (ev.clientX - start.cx) / k) / 8) * 8; const ny = Math.round((start.y + (ev.clientY - start.cy) / k) / 8) * 8;
        onMove?.(c.name, nx, ny);
        setTimeout(() => setDragging(null), 0);
      }
    };
    if (editable) { window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); }
  };

  const rowY = (c: Card, col: string) => { const i = c.rows.findIndex((r) => sameName(r.name, col)); return HEADER + (i < 0 ? 0 : i) * ROW + ROW / 2; };

  const edgePath = (r: Relationship) => {
    const cc = cards.find((x) => sameName(x.name, r.child))!;
    const pc = cards.find((x) => sameName(x.name, r.parent))!;
    const a = pos(cc.name); const b = pos(pc.name);
    const y1 = a.y + rowY(cc, r.childColumns[0] ?? ''); const y2 = b.y + rowY(pc, r.parentColumns[0] ?? '');
    let x1: number; let x2: number; let d1: number; let d2: number;
    if (r.self) { x1 = a.x + cc.w; x2 = a.x + cc.w; d1 = 1; d2 = 1; } else {
      const overlapX = a.x < b.x + pc.w + 24 && b.x < a.x + cc.w + 24;
      if (overlapX) { x1 = a.x + cc.w; x2 = b.x + pc.w; d1 = 1; d2 = 1; } else if (a.x + cc.w / 2 >= b.x + pc.w / 2) { x1 = a.x; x2 = b.x + pc.w; d1 = -1; d2 = 1; } else { x1 = a.x + cc.w; x2 = b.x; d1 = 1; d2 = -1; }
    }
    const span = Math.abs(x2 - x1);
    const off = r.self ? 56 : d1 === d2 ? Math.max(48, Math.abs(y2 - y1) * 0.25 + 36) : Math.max(36, span * 0.45);
    const sx = x1 + d1 * 18; const ex = x2 + d2 * 18;
    const path = r.self
      ? `M ${x1} ${y1} H ${sx} C ${x1 + off} ${y1}, ${x2 + off} ${y2}, ${ex} ${y2} H ${x2}`
      : `M ${x1} ${y1} H ${sx} C ${sx + d1 * off} ${y1}, ${ex + d2 * off} ${y2}, ${ex} ${y2} H ${x2}`;
    return { path, x1, y1, x2, y2, d1, d2, mid: { x: (sx + ex) / 2, y: (y1 + y2) / 2 } };
  };

  /** Ký hiệu đầu đường: tại (x,y), hướng ra khỏi bảng d (±1). */
  const end = (x: number, y: number, d: number, kind: 'one' | 'zeroOrOne' | 'many', color: string) => {
    const els: JSX.Element[] = [];
    const L = (ax: number, ay: number, bx: number, by: number, k: string) => els.push(<line key={k} x1={ax} y1={ay} x2={bx} y2={by} stroke={color} strokeWidth={1.4} />);
    if (kind === 'many') {
      L(x, y - 6, x + d * 10, y, 'a'); L(x, y + 6, x + d * 10, y, 'b'); L(x, y, x + d * 10, y, 'c');
      els.push(<circle key="o" cx={x + d * 14.5} cy={y} r={3.4} fill={p.paper} stroke={color} strokeWidth={1.3} />);
    } else {
      L(x + d * 5, y - 5.5, x + d * 5, y + 5.5, 'a');
      if (kind === 'one') L(x + d * 9, y - 5.5, x + d * 9, y + 5.5, 'b');
      else els.push(<circle key="o" cx={x + d * 12.5} cy={y} r={3.4} fill={p.paper} stroke={color} strokeWidth={1.3} />);
    }
    return els;
  };

  const shiftX = -bounds.x0; const shiftY = -bounds.y0;
  return (
    <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" width={bounds.w} height={bounds.h} viewBox={`0 0 ${bounds.w} ${bounds.h}`} role="img" aria-label="ERD"
      style={{ display: 'block', background: p.paper, fontFamily: FONT, overflow: 'visible' }}>
      <rect x={0} y={0} width={bounds.w} height={bounds.h} fill={p.paper} />
      {variant !== 'print' && (
        <g aria-hidden="true">
          <defs><pattern id="ctw-erd-dots" width={16} height={16} patternUnits="userSpaceOnUse"><circle cx={1} cy={1} r={0.9} fill={p.grid} /></pattern></defs>
          <rect x={0} y={0} width={bounds.w} height={bounds.h} fill="url(#ctw-erd-dots)" />
        </g>
      )}
      {/* font-family đặt trên nhóm (không chỉ style của <svg>): bản xuất SVG/PNG bỏ style gốc rồi nhúng @font-face riêng. */}
      <g transform={`translate(${shiftX} ${shiftY})`} fontFamily={FONT}>
        {/* Quan hệ (dưới thẻ) */}
        {rels.map((r) => {
          const g = edgePath(r);
          const on = !related || (related.has(r.child.toLowerCase()) && related.has(r.parent.toLowerCase()) && (sameName(r.child, focus!) || sameName(r.parent, focus!)));
          const color = on && related ? p.accent : p.line;
          return (
            <g key={r.id} opacity={on ? 1 : 0.22}>
              <title>{`${r.name ?? 'FK'}: ${r.child}(${r.childColumns.join(', ')}) → ${r.parent}(${r.parentColumns.join(', ')})\n${r.parentCard === 'one' ? '1' : '0..1'} ${r.parent} — ${r.childCard === 'many' ? '0..*' : '0..1'} ${r.child}`}</title>
              <path d={g.path} fill="none" stroke="transparent" strokeWidth={10} />
              <path d={g.path} fill="none" stroke={color} strokeWidth={on && related ? 1.8 : 1.3} strokeDasharray={r.identifying ? undefined : '5 4'} />
              {end(g.x2, g.y2, g.d2, r.parentCard, color)}
              {end(g.x1, g.y1, g.d1, r.childCard === 'many' ? 'many' : 'zeroOrOne', color)}
              {related && on && (
                <g transform={`translate(${g.mid.x} ${g.mid.y})`}>
                  <rect x={-(r.childColumns.join(', ').length * 3.4 + 6)} y={-9} width={r.childColumns.join(', ').length * 6.8 + 12} height={17} rx={4} fill={p.card} stroke={p.border} />
                  <text textAnchor="middle" y={3.5} fontSize={10.5} fontFamily={MONO} fill={p.muted}>{r.childColumns.join(', ')}</text>
                </g>
              )}
            </g>
          );
        })}
        {/* Thẻ bảng */}
        {cards.map((c) => {
          const q = pos(c.name);
          const sel = selected ? sameName(selected, c.name) : false;
          const dim = related && !related.has(c.name.toLowerCase());
          const bad = c.incomplete || broken?.has(c.name.toLowerCase());
          return (
            <g key={c.name} transform={`translate(${q.x} ${q.y})`} opacity={dim ? 0.45 : 1} data-pz-nodrag="" data-table={c.name}
              style={{ cursor: editable ? (dragging?.name === c.name ? 'grabbing' : 'grab') : 'pointer' }}
              onPointerDown={(e) => startDrag(e, c)} onPointerEnter={() => setHover(c.name)} onPointerLeave={() => setHover((h) => (h === c.name ? null : h))}
              onClick={(e) => { if (dragging) return; const row = (e.target as Element).closest('[data-col]'); onSelect(c.name, row?.getAttribute('data-col') ?? undefined); }}>
              <title>{c.tip}</title>
              {variant !== 'print' && <rect x={1} y={3} width={c.w} height={c.h} rx={9} fill="#000" opacity={variant === 'dark' ? 0.35 : 0.06} />}
              <rect x={0} y={0} width={c.w} height={c.h} rx={9} fill={p.card} stroke={bad ? p.error : sel ? p.accent : p.border} strokeWidth={sel || bad ? 2 : 1} strokeDasharray={bad ? '5 4' : undefined} />
              <path d={`M 0 9 a 9 9 0 0 1 9 -9 H ${c.w - 9} a 9 9 0 0 1 9 9 V ${HEADER} H 0 Z`} fill={headFill(variant, c.hue)} />
              <rect x={0} y={HEADER - 1} width={c.w} height={1} fill={p.border} />
              <rect x={0} y={9} width={3.5} height={HEADER - 9} fill={headBar(variant, c.hue)} />
              <path d={`M 0 9 a 9 9 0 0 1 9 -9 H 12 V 3.5 H 9 a 5.5 5.5 0 0 0 -5.5 5.5 Z`} fill={headBar(variant, c.hue)} />
              <text x={14} y={HEADER / 2 + 4.5} fontSize={13.5} fontWeight={600} fill={p.ink}>{c.label}</text>
              <text x={c.w - 10} y={HEADER / 2 + 4} fontSize={10.5} textAnchor="end" fill={p.soft} fontFamily={MONO}>{c.rows.length}</text>
              {c.rows.map((r, i) => {
                const y = HEADER + i * ROW;
                return (
                  <g key={r.name + i} data-col={r.name} transform={`translate(0 ${y})`}>
                    <title>{r.tip}</title>
                    <rect x={1} y={0} width={c.w - 2} height={ROW} fill={i % 2 ? (variant === 'print' ? '#fff' : p.rowHover) : 'transparent'} opacity={0.6} />
                    {r.pk ? (
                      <g transform={`translate(9 ${ROW / 2})`} aria-label="PK"><circle cx={3.5} cy={-1} r={3.3} fill="none" stroke={p.key} strokeWidth={1.6} /><path d="M 6.2 0.6 L 12 6.4 M 9.4 3.6 L 11 2 M 10.8 5 L 12.4 3.4" stroke={p.key} strokeWidth={1.6} fill="none" strokeLinecap="round" /></g>
                    ) : r.fk ? (
                      <g transform={`translate(9 ${ROW / 2})`} aria-label="FK"><path d="M 1 4 L 9 -4 M 4 -4 H 9 V 1" stroke={p.fk} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
                    ) : r.uk ? (
                      <text x={9} y={ROW / 2 + 4} fontSize={10} fontWeight={700} fill={p.uk} fontFamily={MONO}>U</text>
                    ) : null}
                    {r.pk && r.fk && <path d={`M 22 ${ROW / 2 + 4} L 27 ${ROW / 2 - 1} M 24 ${ROW / 2 - 1} H 27 V ${ROW / 2 + 2}`} stroke={p.fk} strokeWidth={1.3} fill="none" />}
                    <text x={30} y={ROW / 2 + 4.2} fontSize={12.5} fontWeight={r.pk ? 600 : 500} fill={p.ink} textDecoration={r.pk ? 'underline' : undefined}>{r.name}</text>
                    <text x={c.w - 10} y={ROW / 2 + 4} fontSize={11} textAnchor="end" fontFamily={MONO} fill={p.muted}>
                      {r.auto && <tspan fill={p.accent} fontSize={9.5}>auto </tspan>}
                      {r.type}{r.nullable ? <tspan fill={p.soft}> ?</tspan> : null}
                    </text>
                  </g>
                );
              })}
              {!c.rows.length && <text x={14} y={HEADER + 15} fontSize={11.5} fill={p.soft}>—</text>}
            </g>
          );
        })}
      </g>
    </svg>
  );
});

export default ErdCanvas;

/** Bản đồ nhỏ: chỉ khung các bảng. */
export function ErdMinimap({ model, direction, layout, variant, width, height }: { model: DbModel; direction: 'LR' | 'TB'; layout?: Record<string, [number, number]>; variant: ErdVariant; width: number; height: number }) {
  const cards = useMemo(() => buildCards(model), [model]);
  const rels = useMemo(() => relationships(model), [model]);
  const pos = useMemo(() => layoutErd(cards.map((c) => ({ id: c.name, w: c.w, h: c.h })), rels.map((r) => ({ from: r.child, to: r.parent })), { direction, fixed: layout }), [cards, rels, direction, layout]);
  let x0 = Infinity; let y0 = Infinity;
  for (const c of cards) { x0 = Math.min(x0, pos[c.name]?.x ?? 0); y0 = Math.min(y0, pos[c.name]?.y ?? 0); }
  const p = PAL[variant];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect width={width} height={height} fill={p.paper} />
      {cards.map((c) => <rect key={c.name} x={(pos[c.name]?.x ?? 0) - x0 + MARGIN} y={(pos[c.name]?.y ?? 0) - y0 + MARGIN} width={c.w} height={c.h} rx={10} fill={headFill(variant, c.hue)} stroke={headBar(variant, c.hue)} strokeWidth={6} />)}
    </svg>
  );
}
