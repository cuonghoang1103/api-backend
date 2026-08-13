'use client';

/**
 * Xem trước bản chép: chữ + công thức LaTeX, vẽ bằng KaTeX.
 * ─────────────────────────────────────────────────────────────────────────
 * Đây cũng chính là thứ được IN RA PDF (`window.print()` từ trang công cụ),
 * nên phần trình bày ở đây phải giống một trang giấy: nền trắng, chữ đen,
 * Times New Roman. Đừng đổi sang màu theo theme — bản in sẽ ra chữ xám.
 *
 * KaTeX được nạp muộn (dynamic import) vì nó nặng ~270KB và trang này chỉ
 * cần nó sau khi người dùng đã bấm chuyển đổi.
 */
import { memo, useEffect, useRef } from 'react';

interface Props {
  vanBan: string;
  /** Ảnh hình vẽ (PNG base64) chèn xuống cuối. */
  hinh?: { pngBase64: string; chuThich?: string }[];
  className?: string;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Markdown rất hẹp: # / ## / - / **đậm**. Mọi thứ khác giữ nguyên. */
function toHtml(vanBan: string): string {
  // Gộp khối $$…$$ nhiều dòng lại trước khi tách dòng — nếu không, bước tách
  // dòng sẽ xé đôi công thức và KaTeX chỉ thấy một nửa.
  const gop = vanBan.replace(/\$\$([\s\S]*?)\$\$/g, (_, t: string) => `$$${t.replace(/\s*\n\s*/g, ' ').trim()}$$`);

  return gop
    .split('\n')
    .map((dong) => {
      const d = dong.trim();
      if (!d) return '<div class="h-3"></div>';
      const esc = escapeHtml(d).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      const hinh = esc.match(/^\[HÌNH\]\s*(.*)$/i);
      if (hinh) return `<p class="mp-hinh"><em>Hình vẽ:</em> ${hinh[1]}</p>`;
      if (/^#\s+/.test(esc)) return `<h2>${esc.replace(/^#\s+/, '')}</h2>`;
      if (/^##\s+/.test(esc)) return `<h3>${esc.replace(/^##\s+/, '')}</h3>`;
      if (/^[-*]\s+/.test(esc)) return `<p class="mp-gach">• ${esc.replace(/^[-*]\s+/, '')}</p>`;
      return `<p>${esc}</p>`;
    })
    .join('\n');
}

function MathPreview({ vanBan, hinh = [], className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!/\$/.test(vanBan)) return;
    let huy = false;

    (async () => {
      try {
        // Cùng cách nạp với ChatMarkdown — đường dẫn `katex/dist/contrib/…mjs`
        // là bản đã chạy thật trong gói production, đừng đổi sang
        // `katex/contrib/auto-render` (Next dựng ra bản CommonJS lệch tên).
        await import('katex/dist/katex.min.css' as unknown as string);
        const mod = await import('katex/dist/contrib/auto-render.mjs' as unknown as string);
        const renderMathInElement = (mod.default || mod) as (e: HTMLElement, o: Record<string, unknown>) => void;
        if (huy || !ref.current) return;
        renderMathInElement(ref.current, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false },
          ],
          // Một lệnh lạ chỉ nên đỏ lên tại chỗ, không được ném lỗi làm trắng trang.
          throwOnError: false,
          errorColor: '#dc2626',
        });
      } catch {
        /* nạp lỗi thì để nguyên chữ $…$ — vẫn đọc được, vẫn tải Word được */
      }
    })();

    return () => { huy = true; };
  }, [vanBan]);

  return (
    <div ref={ref} className={`mp-giay ${className}`} dangerouslySetInnerHTML={{ __html: `${toHtml(vanBan)}${hinh
      .map(
        (h) =>
          `<figure class="mp-anh"><img src="data:image/png;base64,${h.pngBase64}" alt="hình vẽ" />${
            h.chuThich ? `<figcaption>${escapeHtml(h.chuThich)}</figcaption>` : ''
          }</figure>`,
      )
      .join('')}` }}
    />
  );
}

export default memo(MathPreview);
