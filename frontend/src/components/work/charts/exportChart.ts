/**
 * Xuất biểu đồ (UX-B): PNG (SVG của Recharts → canvas) và CSV.
 *
 * Vì sao phải "đóng băng" style: Recharts tô bằng `fill="var(--w-chart-1)"`. Ảnh SVG nạp vào <img> là một tài liệu
 * riêng, KHÔNG thấy biến CSS hay phông web của trang ⇒ phải chép giá trị ĐÃ TÍNH (getComputedStyle) vào từng nút.
 * Chữ trong SVG dùng chuỗi phông hệ thống có đủ dấu tiếng Việt (Segoe UI / Helvetica Neue / Arial…); tiêu đề và chú
 * giải vẽ thẳng lên canvas — canvas DÙNG ĐƯỢC phông Inter của trang (đã nạp) nên dấu "ố, ữ, ặ" hiện đúng.
 */

export interface PngLegendItem { label: string; color: string; dashed?: boolean }

const SVG_FONT = 'Inter, "Segoe UI", "Helvetica Neue", Helvetica, Arial, "Noto Sans", sans-serif';
const STYLE_PROPS = [
  'fill', 'fill-opacity', 'stroke', 'stroke-opacity', 'stroke-width', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin',
  'opacity', 'font-size', 'font-weight', 'text-anchor', 'dominant-baseline', 'visibility',
] as const;

function inlineStyles(src: Element, dst: Element) {
  const cs = getComputedStyle(src);
  const parts: string[] = [];
  for (const p of STYLE_PROPS) {
    const v = cs.getPropertyValue(p);
    if (v) parts.push(`${p}:${v}`);
  }
  if (src.tagName.toLowerCase() === 'text' || src.tagName.toLowerCase() === 'tspan') parts.push(`font-family:${SVG_FONT}`);
  dst.setAttribute('style', parts.join(';'));
  const a = src.children;
  const b = dst.children;
  for (let i = 0; i < a.length && i < b.length; i++) inlineStyles(a[i], b[i]);
}

/** Màu đã tính của một biến CSS trong phạm vi `el` (vd var(--w-panel) ⇒ rgb(...)). */
export function resolveColor(el: Element, value: string): string {
  const probe = document.createElement('span');
  probe.style.color = value;
  probe.style.display = 'none';
  el.appendChild(probe);
  const c = getComputedStyle(probe).color;
  probe.remove();
  return c || value;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not render the chart image'));
    img.src = url;
  });
}

function download(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/** Tên tệp an toàn: "Cumulative flow — CLI" ⇒ "cumulative-flow-cli". Giữ chữ có dấu (bỏ dấu cho tên tệp). */
export function fileSlug(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'chart';
}

/** Vẽ khung PNG: tiêu đề + dòng phụ + chú giải + nội dung (ảnh SVG hoặc hàm vẽ riêng). Trả Blob PNG. */
export async function renderPng(opts: {
  root: HTMLElement;
  title: string;
  subtitle?: string;
  legend?: PngLegendItem[];
  /** Vẽ nội dung khi biểu đồ KHÔNG phải SVG (vd ma trận rủi ro HTML). */
  draw?: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  drawSize?: { width: number; height: number };
  scale?: number;
}): Promise<Blob> {
  const scale = opts.scale ?? 2;
  const svg = opts.draw ? null : opts.root.querySelector('svg.recharts-surface') ?? opts.root.querySelector('svg');
  if (!svg && !opts.draw) throw new Error('Nothing to export');
  const box = svg ? (svg as SVGSVGElement).getBoundingClientRect() : { width: opts.drawSize?.width ?? 480, height: opts.drawSize?.height ?? 320 };
  const W = Math.max(320, Math.round(box.width));
  const H = Math.round(box.height);
  const pad = 20;
  const titleH = 26;
  const subH = opts.subtitle ? 18 : 0;
  const legendH = opts.legend?.length ? 24 : 0;
  const top = pad + titleH + subH + legendH + 8;
  const canvas = document.createElement('canvas');
  canvas.width = (W + pad * 2) * scale;
  canvas.height = (top + H + pad) * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);
  const bg = resolveColor(opts.root, 'var(--w-panel)');
  const fg = resolveColor(opts.root, 'var(--w-text)');
  const fg3 = resolveColor(opts.root, 'var(--w-text-3)');
  const fg2 = resolveColor(opts.root, 'var(--w-text-2)');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W + pad * 2, top + H + pad);
  if (document.fonts?.ready) await document.fonts.ready;
  const font = (w: number, px: number) => `${w} ${px}px Inter, "Segoe UI", "Helvetica Neue", Arial, sans-serif`;
  ctx.textBaseline = 'top';
  ctx.fillStyle = fg;
  ctx.font = font(600, 15);
  ctx.fillText(opts.title, pad, pad);
  if (opts.subtitle) {
    ctx.fillStyle = fg3;
    ctx.font = font(400, 12);
    ctx.fillText(opts.subtitle, pad, pad + titleH);
  }
  if (opts.legend?.length) {
    let x = pad;
    const y = pad + titleH + subH + 4;
    ctx.font = font(400, 12);
    for (const it of opts.legend) {
      const c = resolveColor(opts.root, it.color);
      ctx.strokeStyle = c;
      ctx.fillStyle = c;
      if (it.dashed) {
        ctx.setLineDash([4, 3]);
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x, y + 7); ctx.lineTo(x + 14, y + 7); ctx.stroke();
        ctx.setLineDash([]);
      } else {
        ctx.fillRect(x, y + 2, 10, 10);
      }
      ctx.fillStyle = fg2;
      ctx.fillText(it.label, x + 16, y);
      x += 16 + ctx.measureText(it.label).width + 16;
    }
  }
  if (svg) {
    const clone = svg.cloneNode(true) as SVGSVGElement;
    inlineStyles(svg, clone);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', String(Math.round(box.width)));
    clone.setAttribute('height', String(Math.round(box.height)));
    const xml = new XMLSerializer().serializeToString(clone);
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
    const img = await loadImage(url);
    ctx.drawImage(img, pad, top, box.width, box.height);
  } else if (opts.draw) {
    ctx.save();
    ctx.translate(pad, top);
    opts.draw(ctx, W, H);
    ctx.restore();
  }
  return new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not create PNG'))), 'image/png'));
}

export async function downloadPng(opts: Parameters<typeof renderPng>[0] & { fileName: string }) {
  const blob = await renderPng(opts);
  download(blob, opts.fileName.endsWith('.png') ? opts.fileName : `${opts.fileName}.png`);
}

// ─── CSV ─────────────────────────────────────────────────────────

export interface CsvColumn<T> { key: string; label: string; value?: (row: T) => unknown }

function cell(v: unknown): string {
  if (v === null || v === undefined) return '';
  const s = typeof v === 'number' ? String(Math.round(v * 100) / 100) : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** CSV UTF-8 có BOM (Excel đọc đúng chữ có dấu). Cột tính bằng `value` hoặc lấy `row[key]`. */
export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const head = columns.map((c) => cell(c.label)).join(',');
  const body = rows.map((r) => columns.map((c) => cell(c.value ? c.value(r) : (r as Record<string, unknown>)[c.key])).join(','));
  return `﻿${[head, ...body].join('\r\n')}\r\n`;
}

export function downloadCsv<T>(rows: T[], columns: CsvColumn<T>[], fileName: string) {
  download(new Blob([toCsv(rows, columns)], { type: 'text/csv;charset=utf-8' }), fileName.endsWith('.csv') ? fileName : `${fileName}.csv`);
}
