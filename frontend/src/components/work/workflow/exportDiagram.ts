/**
 * Xuất sơ đồ ra SVG / PNG (cho báo cáo SWR302…). Nhân bản <svg> đang hiển thị,
 * bỏ phần chỉ để thao tác (lưới chấm, tay nắm), đặt khung vừa nội dung và
 * THAY biến CSS --w-* bằng giá trị thật — file tải về không có work.css.
 */

import type { Rect } from './graph';

const PAD = 32;

function buildSvg(svg: SVGSVGElement, bounds: Rect, title: string): { markup: string; w: number; h: number } {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.querySelectorAll('[data-export="skip"]').forEach((n) => n.remove());
  const w = Math.ceil(bounds.w + PAD * 2);
  const h = Math.ceil(bounds.h + PAD * 2 + 28);
  const vp = clone.querySelector('[data-viewport]');
  vp?.setAttribute('transform', `translate(${PAD - bounds.x},${PAD + 28 - bounds.y})`);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(w));
  clone.setAttribute('height', String(h));
  clone.setAttribute('viewBox', `0 0 ${w} ${h}`);
  clone.removeAttribute('class');
  clone.removeAttribute('style');
  clone.setAttribute('font-family', 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif');
  const NS = 'http://www.w3.org/2000/svg';
  const bg = document.createElementNS(NS, 'rect');
  bg.setAttribute('width', '100%');
  bg.setAttribute('height', '100%');
  bg.setAttribute('fill', 'var(--w-panel)');
  clone.insertBefore(bg, clone.firstChild);
  const t = document.createElementNS(NS, 'text');
  t.setAttribute('x', String(PAD));
  t.setAttribute('y', String(PAD - 4));
  t.setAttribute('font-size', '14');
  t.setAttribute('font-weight', '600');
  t.setAttribute('fill', 'var(--w-text)');
  t.textContent = title;
  clone.appendChild(t);

  let markup = new XMLSerializer().serializeToString(clone);
  const cs = getComputedStyle(svg);
  markup = markup.replace(/var\((--[\w-]+)\)/g, (_, name: string) => cs.getPropertyValue(name).trim() || '#888');
  return { markup, w, h };
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const safeName = (s: string) => s.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').toLowerCase() || 'workflow';

export function downloadSvg(svg: SVGSVGElement, bounds: Rect, title: string) {
  const { markup } = buildSvg(svg, bounds, title);
  download(new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${markup}`], { type: 'image/svg+xml' }), `${safeName(title)}.svg`);
}

/** PNG độ phân giải gấp đôi (nét trên màn Retina / khi in). */
export async function downloadPng(svg: SVGSVGElement, bounds: Rect, title: string) {
  const { markup, w, h } = buildSvg(svg, bounds, title);
  const url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = new Image();
    await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error('Could not render the diagram')); img.src = url; });
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is not available');
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) throw new Error('Could not create the PNG');
    download(blob, `${safeName(title)}.png`);
  } finally {
    URL.revokeObjectURL(url);
  }
}
