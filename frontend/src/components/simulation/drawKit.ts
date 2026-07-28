/**
 * Bộ đồ nghề vẽ dùng chung cho hai trình vẽ của studio: sơ đồ node/cạnh
 * (`canvasRenderer.ts`) và bảng panel (`panelRenderer.ts`).
 *
 * Trước đây mấy hàm này nằm riêng tư trong `canvasRenderer.ts`. Khi có trình
 * vẽ thứ hai, chép chúng sang file mới là cách chắc chắn để hai bên trôi dạt
 * khỏi nhau — cùng một góc bo mà hai nơi vẽ lệch nhau vài pixel là thấy ngay
 * trên video 1080p. Tách ra đây để chỉ có MỘT định nghĩa.
 *
 * TẤT ĐỊNH: không `Math.random()`, không `Date.now()` — xem đầu
 * `canvasRenderer.ts` để hiểu vì sao đó là điều kiện sống còn.
 */

/** Băm số nguyên → [0,1). Thay cho Math.random() ở mọi nơi cần "nhiễu". */
export function hash01(n: number): number {
  let h = (n ^ 0x9e3779b9) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export const easeInOutCubic = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
export const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;
export const clamp01 = (t: number): number => (t < 0 ? 0 : t > 1 ? 1 : t);

/** Chuyển hex → rgba với alpha cho trước (canvas không nhận hex 8 số ở mọi engine). */
export function rgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

export const SANS = 'Inter, "Helvetica Neue", Arial, sans-serif';
export const MONO = '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace';

/** Ngắt dòng theo bề rộng thật đo bằng ctx.measureText. */
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    line = word;
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines && line && lines[maxLines - 1] !== line) {
    // Thêm dấu … khi phải cắt bớt.
    let last = lines[maxLines - 1];
    while (last.length > 4 && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
    lines[maxLines - 1] = `${last}…`;
  }
  return lines;
}

/**
 * Cắt một chuỗi cho vừa bề rộng, thêm dấu … — dùng cho nhãn một dòng
 * (tên hàm trong ngăn xếp, nhãn cột biểu đồ) nơi xuống dòng là không được.
 */
export function ellipsize(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let out = text;
  while (out.length > 1 && ctx.measureText(`${out}…`).width > maxWidth) out = out.slice(0, -1);
  return `${out}…`;
}

/** Định dạng số cho nhãn biểu đồ: 1.234.567 → "1,23 M", 0,004 → "0,004". */
export function formatNumber(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(2).replace('.', ',')} M`;
  if (abs >= 1000) return v.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  if (abs >= 10) return v.toFixed(0);
  if (abs >= 1) return v.toFixed(1).replace('.', ',');
  if (abs === 0) return '0';
  return v.toFixed(3).replace('.', ',');
}
