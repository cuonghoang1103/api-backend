/**
 * Xuất Timeline ra PNG (UX-C, 11/10/2026).
 *
 * Timeline vẽ bằng div + SVG trong một khung cuộn hai chiều ⇒ không chụp DOM được trọn. Ở đây VẼ LẠI lên canvas từ dữ
 * liệu đang hiện (đúng hàng đang lọc/gập, đúng mức zoom): cột tên bên trái, thang tháng, thanh thẻ, thanh baseline mờ,
 * viền đường găng, mũi tên phụ thuộc, vạch hôm nay, cờ phát hành. Màu đọc từ token CSS đã tính (resolveColor) nên ảnh
 * theo đúng theme sáng/tối đang dùng; phông Inter của trang (canvas dùng được phông web đã nạp) ⇒ chữ có dấu đúng.
 */

import { resolveColor } from '../charts/exportChart';
import type { TimelineMarkers } from '@/lib/work-uxc-api';

const DAY = 86_400_000;
const toDay = (s: string) => Math.floor(Date.parse(`${s}T00:00:00Z`) / DAY);

type Row =
  | { kind: 'group'; label: string }
  | { kind: 'epic' | 'issue'; id: number; key: string; title: string; color: string | null; done: boolean };

export async function exportTimelinePng(opts: {
  root: HTMLElement;
  title: string;
  rows: Row[];
  spans: Map<number, { start: number; end: number; derived?: boolean; fallback?: string }>;
  base: Map<number, { start: number; end: number; slip: number | null }>;
  deps: Array<{ from: number; to: number; critical: boolean; conflict: boolean }>;
  critical: ReadonlySet<number>;
  today: number;
  range: { start: number; days: number };
  zoom: string;
  months: string[];
  markers: TimelineMarkers | null;
  fileName: string;
}) {
  const ROW = 26, LEFT = 300, HEAD = 46, PAD = 16;
  // Bề ngang mỗi ngày theo mức zoom, giới hạn ảnh ~ 4000px.
  const dwBase = opts.zoom === 'days' ? 22 : opts.zoom === 'weeks' ? 12 : opts.zoom === 'months' ? 5 : 2;
  // Cắt khoảng ngày về phần có dữ liệu ±7 ngày (ảnh gọn hơn khung cuộn).
  let lo = opts.today, hi = opts.today;
  for (const s of opts.spans.values()) { lo = Math.min(lo, s.start); hi = Math.max(hi, s.end); }
  for (const b of opts.base.values()) { lo = Math.min(lo, b.start); hi = Math.max(hi, b.end); }
  lo -= 7; hi += 7;
  lo = Math.max(lo, opts.range.start);
  const days = Math.max(14, hi - lo + 1);
  const dw = Math.max(1, Math.min(dwBase, Math.floor(3600 / days)));
  const W = PAD * 2 + LEFT + days * dw;
  const H = PAD * 2 + 30 + HEAD + opts.rows.length * ROW + 8;
  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available');
  ctx.scale(scale, scale);
  if (document.fonts?.ready) await document.fonts.ready;
  const c = (v: string) => resolveColor(opts.root, v);
  const bg = c('var(--w-panel)'), fg = c('var(--w-text)'), fg2 = c('var(--w-text-2)'), fg3 = c('var(--w-text-3)'), border = c('var(--w-border)');
  const accent = c('var(--w-accent)'), orange = c('var(--w-orange)'), red = c('var(--w-red)'), sunken = c('var(--w-sunken)');
  const font = (w: number, px: number) => `${w} ${px}px Inter, "Segoe UI", "Helvetica Neue", Arial, sans-serif`;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = 'middle';
  ctx.fillStyle = fg;
  ctx.font = font(600, 15);
  ctx.fillText(opts.title, PAD, PAD + 10);

  const top = PAD + 30;
  const x0 = PAD + LEFT;
  const xOf = (d: number) => x0 + (d - lo) * dw;
  // Thang tháng + đường lưới đầu tháng / đầu tuần.
  ctx.font = font(600, 11);
  for (let d = lo; d < lo + days; d++) {
    const dt = new Date(d * DAY);
    if (dt.getUTCDate() === 1 || d === lo) {
      ctx.fillStyle = fg2;
      ctx.fillText(`${opts.months[dt.getUTCMonth()] ?? ''} ${dt.getUTCFullYear()}`, xOf(d) + 4, top + 10);
      ctx.strokeStyle = border;
      ctx.beginPath(); ctx.moveTo(xOf(d) + 0.5, top); ctx.lineTo(xOf(d) + 0.5, top + HEAD + opts.rows.length * ROW); ctx.stroke();
    }
    if (dw >= 10 && dt.getUTCDay() === 1) {
      ctx.fillStyle = fg3;
      ctx.font = font(400, 10);
      ctx.fillText(String(dt.getUTCDate()), xOf(d) + 2, top + 28);
      ctx.font = font(600, 11);
    }
  }
  // Mốc: sprint (dải) + version (cờ).
  const mk = opts.markers;
  if (mk) {
    for (const sp of mk.sprints) {
      if (!sp.start || !sp.end) continue;
      const a = toDay(sp.start), b = toDay(sp.end);
      if (b < lo || a > lo + days) continue;
      ctx.fillStyle = sunken;
      ctx.fillRect(xOf(a), top + 34, (b - a + 1) * dw, 10);
      ctx.fillStyle = fg2;
      ctx.font = font(400, 9);
      ctx.fillText(sp.name, xOf(a) + 2, top + 39, Math.max(10, (b - a + 1) * dw - 4));
    }
  }
  ctx.strokeStyle = border;
  ctx.beginPath(); ctx.moveTo(PAD, top + HEAD - 0.5); ctx.lineTo(W - PAD, top + HEAD - 0.5); ctx.stroke();

  const body = top + HEAD;
  const yOf = (i: number) => body + i * ROW;
  const index = new Map<number, number>();
  opts.rows.forEach((r, i) => { if (r.kind !== 'group') index.set(r.id, i); });
  // Hàng: tên trái + vạch kẻ.
  opts.rows.forEach((r, i) => {
    const y = yOf(i);
    if (r.kind === 'group') {
      ctx.fillStyle = sunken;
      ctx.fillRect(PAD, y, W - PAD * 2, ROW);
      ctx.fillStyle = fg2;
      ctx.font = font(600, 11.5);
      ctx.fillText(r.label, PAD + 6, y + ROW / 2, LEFT - 12);
    } else {
      ctx.fillStyle = fg3;
      ctx.font = font(400, 10.5);
      ctx.fillText(r.key, PAD + (r.kind === 'issue' ? 14 : 4), y + ROW / 2);
      ctx.fillStyle = r.done ? fg3 : fg;
      ctx.font = font(r.kind === 'epic' ? 600 : 400, 12);
      ctx.fillText(r.title, PAD + (r.kind === 'issue' ? 70 : 60), y + ROW / 2, LEFT - (r.kind === 'issue' ? 78 : 68));
    }
    ctx.strokeStyle = border;
    ctx.beginPath(); ctx.moveTo(PAD, y + ROW - 0.5); ctx.lineTo(W - PAD, y + ROW - 0.5); ctx.stroke();
  });
  ctx.beginPath(); ctx.moveTo(x0 - 0.5, top); ctx.lineTo(x0 - 0.5, body + opts.rows.length * ROW); ctx.stroke();

  // Phụ thuộc (đường gấp khúc như trên màn hình).
  for (const d of opts.deps) {
    const ra = index.get(d.from), rb = index.get(d.to);
    const sa = opts.spans.get(d.from), sb = opts.spans.get(d.to);
    if (ra === undefined || rb === undefined || !sa || !sb) continue;
    const x1 = xOf(sa.end + 1), y1 = yOf(ra) + ROW / 2, x2 = xOf(sb.start), y2 = yOf(rb) + ROW / 2;
    ctx.strokeStyle = d.conflict ? red : d.critical ? orange : fg3;
    ctx.lineWidth = d.critical || d.conflict ? 1.8 : 1.1;
    ctx.setLineDash(d.conflict ? [4, 3] : []);
    ctx.beginPath();
    ctx.moveTo(x1, y1); ctx.lineTo(x1 + 6, y1); ctx.lineTo(x1 + 6, y2); ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - 5, y2 - 3); ctx.lineTo(x2 - 5, y2 + 3); ctx.closePath(); ctx.fill();
  }
  ctx.lineWidth = 1;

  // Thanh baseline (mờ) rồi thanh hiện tại.
  opts.rows.forEach((r, i) => {
    if (r.kind === 'group') return;
    const y = yOf(i);
    const b = opts.base.get(r.id);
    if (b) {
      ctx.fillStyle = fg3;
      ctx.globalAlpha = 0.45;
      ctx.fillRect(xOf(b.start), y + ROW - 6, Math.max(3, (b.end - b.start + 1) * dw), 3);
      ctx.globalAlpha = 1;
    }
    const s = opts.spans.get(r.id);
    if (!s) return;
    const col = r.color ? c(r.color) : accent;
    const x = xOf(s.start), w = Math.max(4, (s.end - s.start + 1) * dw);
    const h = r.kind === 'epic' ? 10 : 14;
    const yy = y + (ROW - h) / 2 - 2;
    ctx.globalAlpha = s.derived || s.fallback ? 0.25 : r.done ? 0.45 : 0.6;
    ctx.fillStyle = col;
    ctx.fillRect(x, yy, w, h);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = opts.critical.has(r.id) ? orange : col;
    ctx.lineWidth = opts.critical.has(r.id) ? 2 : 1;
    ctx.setLineDash(s.derived || s.fallback ? [3, 2] : []);
    ctx.strokeRect(x + 0.5, yy + 0.5, w - 1, h - 1);
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
    if (b && b.slip && b.slip > 0) {
      ctx.fillStyle = red;
      ctx.font = font(600, 10);
      ctx.fillText(`+${b.slip}d`, x + w + 4, yy + h / 2);
    }
  });

  // Hôm nay + cờ phát hành.
  ctx.fillStyle = accent;
  ctx.fillRect(xOf(opts.today) + dw / 2 - 1, top, 2, HEAD + opts.rows.length * ROW);
  if (mk) {
    for (const v of mk.versions) {
      if (!v.release) continue;
      const d = toDay(v.release);
      if (d < lo || d > lo + days) continue;
      ctx.strokeStyle = fg2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(xOf(d) + dw / 2, top + HEAD); ctx.lineTo(xOf(d) + dw / 2, body + opts.rows.length * ROW); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = fg;
      ctx.font = font(600, 10);
      ctx.fillText(`⚑ ${v.name}`, xOf(d) + dw / 2 + 3, top + 39);
    }
  }

  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not create PNG'))), 'image/png'));
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${opts.fileName}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
