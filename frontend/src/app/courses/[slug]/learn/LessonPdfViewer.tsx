'use client';

import { useRef, useState } from 'react';
import { Download, Maximize2, FileText } from 'lucide-react';

/**
 * Inline PDF viewer for EXERCISE / SOLUTION lessons. Uses the browser's
 * native PDF viewer via an <iframe> pointed at the enrollment-gated download
 * URL (which 302s to a signed R2 URL) — so page navigation, zoom, download
 * and text/code selection all work for free. A fullscreen button gives the
 * "phóng to" experience.
 */
export default function LessonPdfViewer({ url, title }: { url: string; title?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tall, setTall] = useState(false);
  // Inline variant (no attachment disposition) so the browser RENDERS the
  // PDF in the iframe instead of downloading it. The plain `url` keeps the
  // attachment behaviour for the "Tải về" button.
  const inlineUrl = url + (url.includes('?') ? '&' : '?') + 'inline=1';

  const fullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen().catch(() => setTall((t) => !t));
  };

  return (
    <div ref={wrapRef} className="rounded-2xl border border-darkborder bg-darkcard overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-darkborder/50">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-red-400 shrink-0" />
          <span className="text-sm text-text-secondary truncate">{title || 'Tài liệu PDF'}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a href={url} target="_blank" rel="noopener noreferrer" download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-darkbg border border-darkborder text-text-secondary hover:text-text-primary">
            <Download className="w-3.5 h-3.5" /> Tải về
          </a>
          <button onClick={fullscreen}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-darkbg border border-darkborder text-text-secondary hover:text-text-primary">
            <Maximize2 className="w-3.5 h-3.5" /> Phóng to
          </button>
        </div>
      </div>
      <iframe
        src={inlineUrl}
        title={title || 'PDF'}
        className="w-full bg-white"
        style={{ height: tall ? '85vh' : '75vh' }}
      />
    </div>
  );
}
