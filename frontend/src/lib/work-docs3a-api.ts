/**
 * CT Work — CTW đợt 3A (09/10/2026): client cho ảnh trong trình soạn thảo, xuất trang Docs ra .docx/PDF, Record of Changes
 * và "Fill from project data". Backend: src/routes/work.docs3a.routes.ts + src/services/work/docs3a.service.ts.
 * Tách riêng khỏi lib/work-api.ts để không giẫm tệp nhiều phiên cùng sửa.
 */

import { api } from '@/lib/api';
import type { TiptapDoc, WorkPageDetail } from '@/lib/work-api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const B = '/work/projects';

export interface UploadedImage { id: number; url: string; width: number | null; height: number | null }
export interface ChangeRow { date: string; action: 'A' | 'M' | 'D'; inCharge: string; description: string }
export type FillSection = 'recordOfChanges' | 'team' | 'risks' | 'schedule' | 'raci';

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const IMAGE_SRC_RE = /^\/api\/v1\/work\/projects\/\d+\/images\/\d+$/;

export const workDocs3aApi = {
  /** Gửi BYTE ảnh làm thân request (không FormData — instance axios đặt cứng JSON sẽ biến FormData thành `{}`). */
  uploadImage: async (pid: number, file: Blob, name = 'image'): Promise<UploadedImage> => {
    if (file.size > MAX_IMAGE_BYTES) throw new Error('Images must be 10 MB or smaller');
    const buf = await file.arrayBuffer();
    return d<UploadedImage>(api.post(`${B}/${pid}/images?${new URLSearchParams({ name: name.slice(0, 180) })}`, buf, {
      headers: { 'Content-Type': file.type || 'application/octet-stream' }, timeout: 120_000, transformRequest: [(x) => x],
    }));
  },
  exportPage: async (pid: number, num: number, format: 'docx' | 'pdf', diagrams: Array<string | null>) => {
    const res = await api.post(`${B}/${pid}/pages/${num}/export`, { format, diagrams }, { responseType: 'blob', timeout: 180_000 });
    const cd = String(res.headers['content-disposition'] ?? '');
    const star = /filename\*=UTF-8''([^;]+)/.exec(cd)?.[1];
    const name = star ? decodeURIComponent(star) : /filename="([^"]+)"/.exec(cd)?.[1] ?? `document.${format}`;
    return { blob: res.data as Blob, fileName: name };
  },
  recordOfChanges: (pid: number, num: number) => d<ChangeRow[]>(api.get(`${B}/${pid}/pages/${num}/record-of-changes`)),
  autofill: (pid: number, num: number, body: { version?: number; sections?: FillSection[] }) =>
    d<{ filled: FillSection[]; page: WorkPageDetail }>(api.post(`${B}/${pid}/pages/${num}/autofill`, body)),
};

export function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// ─── Mermaid ────────────────────────────────────────────────────

let seq = 0;
async function mermaidLib(dark: boolean) {
  const mermaid = (await import('mermaid')).default;
  mermaid.initialize({
    startOnLoad: false,
    theme: dark ? 'dark' : 'default',
    securityLevel: 'strict',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    suppressErrorRendering: true,
    // Nhãn là <text> SVG thật (không foreignObject) ⇒ vẽ được lên canvas để xuất PNG cho Word/PDF.
    htmlLabels: false,
    flowchart: { htmlLabels: false },
  });
  return mermaid;
}

/** Vẽ một sơ đồ ⇒ SVG (chuỗi). Lỗi cú pháp ⇒ ném Error có thông điệp của mermaid. */
export async function renderMermaidSvg(source: string, dark = false): Promise<string> {
  const mermaid = await mermaidLib(dark);
  const id = `ctw-mmd-${++seq}-${Math.random().toString(36).slice(2, 7)}`;
  try {
    const { svg } = await mermaid.render(id, source.trim());
    return svg;
  } finally {
    document.getElementById(`d${id}`)?.remove();
  }
}

async function svgToPng(svg: string, scale = 2): Promise<string | null> {
  const box = /viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/.exec(svg);
  const w = Math.ceil(Number(box?.[1] ?? 800));
  const h = Math.ceil(Number(box?.[2] ?? 600));
  // Thẻ <svg> gốc của mermaid có sẵn width="100%" + style max-width: bỏ đi rồi đặt kích thước tuyệt đối — để nguyên mà
  // thêm width thứ hai thì SVG thành XML hỏng (trùng thuộc tính) và <img> báo lỗi ⇒ bản xuất mất sơ đồ.
  const sized = svg.replace(/<svg\b[^>]*>/, (tag) => tag.replace(/\s(width|height|style)="[^"]*"/g, '').replace('<svg', `<svg width="${w}" height="${h}"`));
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sized)}`;
  const img = new Image();
  img.decoding = 'sync';
  await new Promise<void>((ok, bad) => { img.onload = () => ok(); img.onerror = () => bad(new Error('svg')); img.src = url; });
  const k = Math.min(scale, 4000 / Math.max(w, h));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(w * k));
  canvas.height = Math.max(1, Math.round(h * k));
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  try { return canvas.toDataURL('image/png'); } catch { return null; }
}

/** Ảnh PNG (data URL) cho mọi khối ```mermaid của trang, theo thứ tự — để bản Word/PDF có sơ đồ. Khối lỗi ⇒ null. */
export async function mermaidPngsOf(doc: TiptapDoc | null | undefined, budget = 8 * 1024 * 1024): Promise<Array<string | null>> {
  const sources: string[] = [];
  const walk = (n: { type?: string; attrs?: Record<string, unknown>; content?: unknown[]; text?: string }) => {
    if (n.type === 'codeBlock' && String(n.attrs?.language ?? '').toLowerCase() === 'mermaid') {
      sources.push(((n.content ?? []) as Array<{ text?: string }>).map((c) => c.text ?? '').join(''));
      return;
    }
    for (const c of (n.content ?? []) as never[]) walk(c);
  };
  if (doc) walk(doc as never);
  const out: Array<string | null> = [];
  let used = 0;
  for (const src of sources) {
    let png: string | null = null;
    try { png = await svgToPng(await renderMermaidSvg(src, false)); } catch (e) { console.warn('[ctw] Mermaid → PNG failed; the export prints the diagram source instead', e); png = null; }
    // Trần thân request của máy chủ là 10 MB: sơ đồ vượt ngân sách thì in mã nguồn thay vì làm hỏng cả bản xuất.
    if (png && used + png.length > budget) png = null;
    used += png?.length ?? 0;
    out.push(png);
  }
  return out;
}
