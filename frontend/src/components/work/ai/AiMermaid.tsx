'use client';

/**
 * Sơ đồ Mermaid trong câu trả lời CuongMini (22/10/2026). Dùng bộ vẽ của CT Work Diagrams (`diagrams/render.ts`: theme
 * sáng/tối của CT Work, securityLevel strict, hàng đợi vì mermaid là singleton). Vẽ hỏng ⇒ thử bản đã vá (cleanMermaid);
 * vẫn hỏng ⇒ một dòng nhỏ + mã gốc (không bao giờ để lỗi cú pháp chiếm cả khung).
 */

import { memo, useEffect, useState } from 'react';
import { cleanMermaid } from '@/components/exp-hub/MermaidDiagram';
import { isDarkTheme, renderDiagramSvg } from '../diagrams/render';
import { wt } from '@/components/work/i18n';

function AiMermaid({ code }: { code: string }) {
  const [svg, setSvg] = useState('');
  const [err, setErr] = useState(false);
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
    <div
      className="my-2 overflow-x-auto rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] p-2 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
      data-testid="ai-mermaid"
      // SVG do mermaid tự sinh (securityLevel strict — không HTML thô / click handler từ nguồn).
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default memo(AiMermaid);
