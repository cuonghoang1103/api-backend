'use client';

/**
 * Sơ đồ Mermaid trong câu trả lời CuongMini (22/10/2026). Dùng bộ vẽ của CT Work Diagrams (`diagrams/render.ts`: theme
 * sáng/tối của CT Work, securityLevel strict, hàng đợi vì mermaid là singleton). Vẽ hỏng ⇒ thử bản đã vá (cleanMermaid);
 * vẫn hỏng ⇒ một dòng nhỏ + mã gốc (không bao giờ để lỗi cú pháp chiếm cả khung).
 *
 * 27/10/2026: sơ đồ bị CẮT (nửa trên trống, hộp tụt xuống đáy rồi mất) — viewBox mermaid tính lúc vẽ ngầm lệch với nội
 * dung thật. Sau khi gắn vào trang ⇒ đo lại khung bao thật (getBBox) và đặt lại viewBox/width; SVG co theo bề ngang khung.
 * Thêm nút phóng to (lớp phủ toàn màn hình, cuộn được) cho sơ đồ lớn.
 */

import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { cleanMermaid } from '@/components/exp-hub/MermaidDiagram';
import { isDarkTheme, renderDiagramSvg } from '../diagrams/render';
import { wt } from '@/components/work/i18n';

/** Khớp viewBox với nội dung thật; trả bề rộng tự nhiên (px) hoặc 0 nếu chưa đo được (khung đang ẩn). */
function khopKhung(svg: SVGSVGElement | null): number {
  if (!svg) return 0;
  try {
    const b = svg.getBBox();
    if (!(b.width > 0 && b.height > 0)) return 0;
    const pad = 8;
    const w = b.width + pad * 2;
    svg.setAttribute('viewBox', `${b.x - pad} ${b.y - pad} ${w} ${b.height + pad * 2}`);
    svg.setAttribute('width', String(w));
    svg.removeAttribute('height');
    svg.style.maxWidth = '100%';
    svg.style.height = 'auto';
    return w;
  } catch {
    return 0;
  }
}

function AiMermaid({ code }: { code: string }) {
  const [svg, setSvg] = useState('');
  const [err, setErr] = useState(false);
  const [to, setTo] = useState(false);
  const khung = useRef<HTMLDivElement>(null);
  const khungTo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let huy = false;
    setErr(false);
    const v = isDarkTheme() ? 'dark' : 'light';
    renderDiagramSvg(code.trim(), v)
      .catch(() => renderDiagramSvg(cleanMermaid(code), v))
      .then((s) => { if (!huy) setSvg(s); })
      .catch(() => { if (!huy) { setSvg(''); setErr(true); } });
    return () => { huy = true; };
  }, [code]);

  useLayoutEffect(() => { khopKhung(khung.current?.querySelector('svg') ?? null); }, [svg]);
  useLayoutEffect(() => {
    if (!to) return;
    const el = khungTo.current?.querySelector('svg') ?? null;
    const w = khopKhung(el);
    // Lớp phủ: giữ cỡ tự nhiên (không co) để đọc rõ, cuộn khi lớn hơn màn hình.
    if (el && w) { el.style.maxWidth = 'none'; el.style.width = `${Math.max(w, 320)}px`; }
    const dong = (e: KeyboardEvent) => { if (e.key === 'Escape') setTo(false); };
    window.addEventListener('keydown', dong);
    return () => window.removeEventListener('keydown', dong);
  }, [to, svg]);

  if (err) {
    return (
      <div className="my-2 rounded-[8px] border border-dashed border-[var(--w-border)] p-2 text-[12px] text-[var(--w-text-3)]">
        {wt('ai.diagramFailed')}
        <pre className="mt-1 max-h-[160px] overflow-auto whitespace-pre-wrap text-[11.5px]">{code}</pre>
      </div>
    );
  }
  if (!svg) return <div className="my-2 h-16 animate-pulse rounded-[8px] bg-[var(--w-sunken)]" aria-hidden />;
  return (
    <>
      <div className="group relative my-2 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] p-2">
        <button
          type="button"
          onClick={() => setTo(true)}
          title={wt('ai.diagramZoom')}
          aria-label={wt('ai.diagramZoom')}
          className="absolute right-1.5 top-1.5 z-[1] rounded-[6px] border border-[var(--w-border)] bg-[var(--w-panel)] p-1 text-[var(--w-text-3)] opacity-70 hover:text-[var(--w-text)] hover:opacity-100"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
        <div
          ref={khung}
          className="overflow-x-auto [&_svg]:mx-auto [&_svg]:block [&_svg]:h-auto [&_svg]:max-w-full"
          data-testid="ai-mermaid"
          // SVG do mermaid tự sinh (securityLevel strict — không HTML thô / click handler từ nguồn).
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
      {to && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={wt('ai.diagramZoom')}
          className="fixed inset-0 z-[200] flex flex-col bg-black/70 p-3 sm:p-6"
          onClick={(e) => { if (e.target === e.currentTarget) setTo(false); }}
        >
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => setTo(false)}
              className="inline-flex items-center gap-1 rounded-[8px] bg-[var(--w-panel)] px-3 py-1.5 text-[13px] text-[var(--w-text)]"
            >
              <X className="h-4 w-4" /> {wt('ai.diagramClose')}
            </button>
          </div>
          <div
            ref={khungTo}
            className="min-h-0 flex-1 overflow-auto rounded-[10px] bg-[var(--w-panel)] p-4 [&_svg]:mx-auto [&_svg]:block [&_svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      )}
    </>
  );
}

export default memo(AiMermaid);
