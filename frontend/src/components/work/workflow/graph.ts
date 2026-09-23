/**
 * Sơ đồ quy trình — phần tính toán thuần (không React): khoá cặp chuyển,
 * tự sắp xếp theo cột nhóm, đường cong mũi tên né nút, kiểm tra hợp lệ.
 */

import type { StatusCategory, WorkStatus } from '@/lib/work-api';

export interface Pos { x: number; y: number }
export interface Rect { x: number; y: number; w: number; h: number }

export const NODE_W = 184;
export const NODE_H = 62;
const COL_GAP = 120;
const ROW_GAP = 58;
const MAX_PER_COL = 4;

/** Nút "Any status" (from = null) và chấm "Create" — kích thước cố định. */
export const ANY_W = 112;
export const ANY_H = 32;
export const START_R = 9;

// ─── Khoá cặp chuyển ─────────────────────────────────────────────

export const pairKey = (from: number | null, to: number) => `${from ?? 'any'}:${to}`;
export function parsePair(k: string): { from: number | null; to: number } {
  const [f, t] = k.split(':');
  return { from: f === 'any' ? null : Number(f), to: Number(t) };
}

// ─── Tự sắp xếp ──────────────────────────────────────────────────

const CAT_ORDER: StatusCategory[] = ['TODO', 'IN_PROGRESS', 'DONE'];

/**
 * Trái → phải theo nhóm (To do → In progress → Done), xếp dọc trong cột theo
 * thứ tự board. Nhóm đông (>4) tách thành nhiều cột con để sơ đồ không quá cao.
 */
export function autoLayout(statuses: WorkStatus[]): Record<number, Pos> {
  const sorted = [...statuses].sort((a, b) => a.position - b.position);
  const cols: WorkStatus[][] = [];
  for (const cat of CAT_ORDER) {
    const inCat = sorted.filter((s) => s.category === cat);
    for (let i = 0; i < inCat.length; i += MAX_PER_COL) cols.push(inCat.slice(i, i + MAX_PER_COL));
  }
  const tallest = Math.max(1, ...cols.map((c) => c.length));
  const fullH = tallest * NODE_H + (tallest - 1) * ROW_GAP;
  const out: Record<number, Pos> = {};
  cols.forEach((col, ci) => {
    const h = col.length * NODE_H + (col.length - 1) * ROW_GAP;
    const top = (fullH - h) / 2;
    col.forEach((s, ri) => { out[s.id] = { x: ci * (NODE_W + COL_GAP), y: Math.round(top + ri * (NODE_H + ROW_GAP)) }; });
  });
  return out;
}

/**
 * Ghép bố cục đã lưu với tự sắp xếp: trạng thái chưa có toạ độ (mới thêm) đặt
 * ở cột tự động của nó, dưới nút thấp nhất đang nằm quanh cột đó.
 */
export function mergeLayout(statuses: WorkStatus[], saved: Record<string, Pos> | undefined | null, current?: Record<number, Pos>): Record<number, Pos> {
  const auto = autoLayout(statuses);
  const base: Record<number, Pos> = {};
  for (const s of statuses) {
    const p = current?.[s.id] ?? saved?.[String(s.id)];
    if (p) base[s.id] = { x: p.x, y: p.y };
  }
  if (!Object.keys(base).length) return auto;
  for (const s of statuses) {
    if (base[s.id]) continue;
    const a = auto[s.id];
    const near = Object.values(base).filter((p) => Math.abs(p.x - a.x) < NODE_W);
    const y = near.length ? Math.max(...near.map((p) => p.y)) + NODE_H + ROW_GAP : a.y;
    base[s.id] = { x: a.x, y };
  }
  return base;
}

// ─── Hình học ────────────────────────────────────────────────────

export const center = (r: Rect): Pos => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

/** Giao điểm của tia từ tâm hình chữ nhật hướng về `toward` với viền của nó. */
export function boundaryPoint(r: Rect, toward: Pos, pad = 0): Pos {
  const c = center(r);
  const dx = toward.x - c.x;
  const dy = toward.y - c.y;
  if (!dx && !dy) return c;
  const hw = r.w / 2 + pad;
  const hh = r.h / 2 + pad;
  const s = 1 / Math.max(Math.abs(dx) / hw, Math.abs(dy) / hh);
  return { x: c.x + dx * s, y: c.y + dy * s };
}

const quad = (a: Pos, c: Pos, b: Pos, t: number): Pos => ({
  x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x,
  y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y,
});

const inside = (p: Pos, r: Rect, pad: number) => p.x > r.x - pad && p.x < r.x + r.w + pad && p.y > r.y - pad && p.y < r.y + r.h + pad;

export interface EdgeGeom { d: string; start: Pos; end: Pos; mid: Pos; ctrl: Pos }

/**
 * Mũi tên cong bậc hai giữa hai hình chữ nhật. `bulge` là độ phồng (px) về
 * phía pháp tuyến trái của hướng a→b — nên cặp hai chiều tự tách hai bên.
 * Thử các độ phồng tăng dần để né các nút khác nằm trên đường đi.
 */
export function routeEdge(a: Rect, b: Rect, obstacles: Rect[], baseBulge: number): EdgeGeom {
  const ca = center(a);
  const cb = center(b);
  const dx = cb.x - ca.x;
  const dy = cb.y - ca.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const m = { x: (ca.x + cb.x) / 2, y: (ca.y + cb.y) / 2 };
  const steps = baseBulge
    ? [0, 30, 60, 100, 150].map((v) => baseBulge + Math.sign(baseBulge) * v)
    : [0, 40, -40, 80, -80, 130, -130, 190, -190];
  let best: { bulge: number; hits: number } | null = null;
  for (const bulge of steps) {
    const ctrl = { x: m.x + nx * bulge * 2, y: m.y + ny * bulge * 2 };
    let hits = 0;
    for (let i = 1; i < 20; i++) {
      const p = quad(ca, ctrl, cb, i / 20);
      if (inside(p, a, 2) || inside(p, b, 2)) continue;
      for (const o of obstacles) if (inside(p, o, 10)) hits++;
    }
    if (!best || hits < best.hits) best = { bulge, hits };
    if (!hits) break;
  }
  const bulge = best?.bulge ?? baseBulge;
  const ctrl = { x: m.x + nx * bulge * 2, y: m.y + ny * bulge * 2 };
  const start = boundaryPoint(a, ctrl, 1);
  const end = boundaryPoint(b, ctrl, 3);
  // Điểm điều khiển tính lại theo hai đầu mới để đỉnh cong vẫn đúng chỗ.
  const c2 = { x: 2 * quad(ca, ctrl, cb, 0.5).x - (start.x + end.x) / 2, y: 2 * quad(ca, ctrl, cb, 0.5).y - (start.y + end.y) / 2 };
  const mid = quad(start, c2, end, 0.5);
  const f = (n: number) => Math.round(n * 10) / 10;
  return { d: `M${f(start.x)},${f(start.y)} Q${f(c2.x)},${f(c2.y)} ${f(end.x)},${f(end.y)}`, start, end, mid, ctrl: c2 };
}

/** Đường thẳng tạm khi đang kéo tạo chuyển. */
export function straightFrom(a: Rect, to: Pos): string {
  const s = boundaryPoint(a, to, 1);
  return `M${s.x},${s.y} L${to.x},${to.y}`;
}

export function boundsOf(rects: Rect[]): Rect {
  if (!rects.length) return { x: 0, y: 0, w: 0, h: 0 };
  const x1 = Math.min(...rects.map((r) => r.x));
  const y1 = Math.min(...rects.map((r) => r.y));
  const x2 = Math.max(...rects.map((r) => r.x + r.w));
  const y2 = Math.max(...rects.map((r) => r.y + r.h));
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
}

// ─── Luồng mặc định & kiểm tra ───────────────────────────────────

/**
 * Luồng tuyến tính gợi ý khi chuyển từ tự do sang giới hạn: mỗi trạng thái →
 * trạng thái kế (theo thứ tự board), và "từ bất kỳ" → trạng thái đầu (mở lại).
 */
export function linearFlow(statuses: WorkStatus[]): string[] {
  const s = [...statuses].sort((a, b) => a.position - b.position);
  const out: string[] = [];
  for (let i = 0; i < s.length - 1; i++) out.push(pairKey(s[i].id, s[i + 1].id));
  if (s.length) out.push(pairKey(null, s[0].id));
  return out;
}

export interface Warning { kind: 'unreachable' | 'deadend'; text: string }

/**
 * Cảnh báo kiểu trình kiểm của Jira (không chặn lưu):
 *  - không đường vào: không mũi tên nào tới (trừ trạng thái đầu — nơi thẻ mới sinh ra),
 *  - ngõ cụt: từ đây không có đường nào tới một trạng thái Done.
 * Quy trình tự do thì không có gì để cảnh báo.
 */
export function validate(statuses: WorkStatus[], pairs: Set<string>, mode: 'free' | 'restricted'): Record<number, Warning[]> {
  const out: Record<number, Warning[]> = {};
  if (mode === 'free' || !statuses.length) return out;
  const sorted = [...statuses].sort((a, b) => a.position - b.position);
  const initial = sorted[0].id;
  const edges = [...pairs].map(parsePair);
  const anyTargets = new Set(edges.filter((e) => e.from === null).map((e) => e.to));
  const next = new Map<number, Set<number>>();
  for (const s of sorted) next.set(s.id, new Set());
  for (const e of edges) {
    if (e.from === null) { for (const s of sorted) if (s.id !== e.to) next.get(s.id)?.add(e.to); }
    else next.get(e.from)?.add(e.to);
  }
  const incoming = new Set<number>();
  for (const e of edges) incoming.add(e.to);
  const done = new Set(sorted.filter((s) => s.category === 'DONE').map((s) => s.id));
  // Đi ngược từ các trạng thái Done để biết ai tới được Done.
  const prev = new Map<number, number[]>();
  for (const [f, ts] of next) for (const t of ts) prev.set(t, [...(prev.get(t) ?? []), f]);
  const canFinish = new Set(done);
  const queue = [...done];
  while (queue.length) {
    const t = queue.shift()!;
    for (const f of prev.get(t) ?? []) if (!canFinish.has(f)) { canFinish.add(f); queue.push(f); }
  }
  for (const s of sorted) {
    const w: Warning[] = [];
    if (s.id !== initial && !incoming.has(s.id) && !anyTargets.has(s.id)) {
      w.push({ kind: 'unreachable', text: 'No transition leads here — issues can only land in this status when they are created in it.' });
    }
    if (!done.has(s.id) && !canFinish.has(s.id)) {
      w.push({ kind: 'deadend', text: 'Dead end — issues in this status can never reach a Done status.' });
    }
    if (w.length) out[s.id] = w;
  }
  return out;
}

// ─── Đo chữ để cắt gọn trong nút SVG ─────────────────────────────

let measureCtx: CanvasRenderingContext2D | null | undefined;

/** Cắt chữ cho vừa bề rộng (px) theo font; không có canvas thì ước lượng theo số ký tự. */
export function fitText(text: string, maxW: number, font: string): string {
  if (measureCtx === undefined) {
    measureCtx = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null;
  }
  const ctx = measureCtx;
  if (!ctx) return text.length * 7 > maxW ? `${text.slice(0, Math.max(1, Math.floor(maxW / 7) - 1))}…` : text;
  ctx.font = font;
  if (ctx.measureText(text).width <= maxW) return text;
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (ctx.measureText(`${text.slice(0, mid)}…`).width <= maxW) lo = mid; else hi = mid - 1;
  }
  return `${text.slice(0, Math.max(1, lo)).trimEnd()}…`;
}
