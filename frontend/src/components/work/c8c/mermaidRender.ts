'use client';

/**
 * CTW đợt 8c — gửi ảnh Mermaid VẼ SẴN lên máy chủ (SVG + PNG theo mã băm nguồn) để API/MCP và bản xuất Word/PDF qua API có
 * ảnh mà máy chủ không cần trình duyệt (xem src/services/work/diagramRender.ts).
 *
 * Gửi lặng lẽ, sau khi trang rảnh, MỘT lần mỗi nguồn mỗi phiên; lỗi chỉ ghi console (không làm phiền người dùng —
 * thiếu ảnh thì bản xuất qua API in mã nguồn như trước). Biến thể "print" (nền trắng, mực đen) — đúng thứ in vào Word/PDF.
 */

import { useEffect } from 'react';
import { diagramRenderApi } from '@/lib/work-c8c-api';

const sent = new Set<string>();
const keyOf = (pid: number, src: string) => `${pid}:${src.replace(/\r\n?/g, '\n').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').trim()}`;
const MAX_PNG_DATAURL = 5_400_000;

async function blobToDataUrl(b: Blob): Promise<string> {
  return new Promise((ok, bad) => { const r = new FileReader(); r.onload = () => ok(String(r.result)); r.onerror = () => bad(r.error); r.readAsDataURL(b); });
}

/** Vẽ (theme in) + gửi. Trả false khi đã gửi trước đó / nguồn rỗng / vẽ hỏng. */
export async function storeMermaidRender(pid: number, source: string): Promise<boolean> {
  const src = source.trim();
  if (!src || src.length > 60_000) return false;
  const k = keyOf(pid, src);
  if (sent.has(k)) return false;
  sent.add(k);
  try {
    const { renderDiagramSvg, standaloneSvg, svgToPngBlob } = await import('../diagrams/render');
    const raw = await renderDiagramSvg(src, 'print');
    const svg = await standaloneSvg(raw, 'Diagram', 'print');
    const png = await blobToDataUrl(await svgToPngBlob(svg, 2));
    await diagramRenderApi.put(pid, { source: src, svg: svg.length < 2_000_000 ? svg : null, png: png.length < MAX_PNG_DATAURL ? png : null });
    return true;
  } catch (e) {
    sent.delete(k);
    console.warn('[ctw] storing the Mermaid image failed — API exports will print the source instead', e);
    return false;
  }
}

/** Hook: khi `source` (đã lưu, không phải bản nháp đang gõ) ổn định ~2 s thì gửi ảnh. null ⇒ không làm gì. */
export function useStoreMermaidRender(pid: number, source: string | null | undefined, enabled = true) {
  useEffect(() => {
    if (!enabled || !source?.trim()) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      const run = () => { if (!cancelled) void storeMermaidRender(pid, source); };
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
      if (ric) ric(run); else run();
    }, 2000);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [pid, source, enabled]);
}

/** Mọi khối ```mermaid của một tài liệu TipTap (cùng thứ tự với bản xuất). */
export function mermaidSourcesOf(doc: unknown): string[] {
  const out: string[] = [];
  const walk = (n: { type?: string; attrs?: Record<string, unknown>; content?: unknown[] } | null | undefined) => {
    if (!n || typeof n !== 'object') return;
    if (n.type === 'codeBlock' && String(n.attrs?.language ?? '').toLowerCase() === 'mermaid') {
      out.push(((n.content ?? []) as Array<{ text?: string }>).map((c) => c.text ?? '').join(''));
      return;
    }
    for (const c of (n.content ?? []) as never[]) walk(c);
  };
  walk(doc as never);
  return out;
}

/** Hook cho trang Docs: gửi ảnh mọi khối Mermaid của trang ĐÃ LƯU (tối đa 20 khối). */
export function useStoreDocMermaid(pid: number, doc: unknown, enabled = true) {
  const sources = enabled ? mermaidSourcesOf(doc).slice(0, 20) : [];
  const sig = sources.join('\u0000');
  useEffect(() => {
    if (!sig) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      for (const s of sig.split('\u0000')) { if (cancelled) return; await storeMermaidRender(pid, s); }
    }, 3000);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [pid, sig]);
}
