'use client';

/**
 * Trình xem tệp — OFFICE dựng ở máy chủ (không gửi tệp cho Office Online/Google): docx ⇒ HTML (mammoth) được lọc
 * LẠI bằng DOMPurify trước khi chèn; link trong tài liệu mở tab mới, không điều hướng khỏi CT Work. xlsx ⇒ bảng giá
 * trị theo trang tính (tên cột A, B, C… + số dòng như Excel).
 */

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { wt } from '@/components/work/i18n';
import type { XemTruocOffice } from './kieu';

function Docx({ html, imagesDropped }: { html: string; imagesDropped: boolean }) {
  const sach = useMemo(() => sanitizeHtml(html), [html]);
  const onClick = (e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a) return;
    e.preventDefault();
    const href = a.getAttribute('href') ?? '';
    if (/^(https?:|mailto:)/i.test(href)) window.open(href, '_blank', 'noopener,noreferrer');
  };
  return (
    <div className="h-full min-h-0 overflow-auto bg-[var(--w-sunken)] px-2 py-4 sm:px-6 sm:py-8" data-testid="xem-docx">
      {imagesDropped && <p className="mx-auto mb-3 max-w-[820px] text-[12px] text-[var(--w-text-3)]">{wt('xem.imagesDropped')}</p>}
      <article
        className="w-prose mx-auto max-w-[820px] rounded-[4px] border border-[var(--w-border)] bg-[var(--w-panel)] px-5 py-6 shadow-sm sm:px-12 sm:py-10 [&_img]:h-auto [&_img]:max-w-full [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[var(--w-border)] [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-[var(--w-border)] [&_th]:px-2 [&_th]:py-1"
        onClick={onClick}
        // Đã lọc: mammoth thoát chữ + DOMPurify bỏ script/on*/javascript:.
        dangerouslySetInnerHTML={{ __html: sach }}
      />
    </div>
  );
}

function Xlsx({ data }: { data: Extract<XemTruocOffice, { kind: 'xlsx' }> }) {
  const [i, setI] = useState(0);
  const s = data.sheets[i];
  if (!s) return <div className="flex h-full items-center justify-center text-[13px] text-[var(--w-text-3)]">{wt('xem.emptyFile')}</div>;
  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--w-panel)]" data-testid="xem-xlsx">
      <div className="min-h-0 flex-1 overflow-auto" tabIndex={0}>
        <table className="min-w-full border-separate border-spacing-0 text-[12.5px]">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-[2] w-10 border-b border-r border-[var(--w-border)] bg-[var(--w-sunken)]" />
              {s.cols.map((c) => <th key={c} className="sticky top-0 z-[1] min-w-[72px] border-b border-r border-[var(--w-border)] bg-[var(--w-sunken)] px-2 py-1 text-center font-medium text-[var(--w-text-2)]">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {s.rows.map((r, ri) => (
              <tr key={ri} className="hover:bg-[var(--w-hover)]">
                <td className="sticky left-0 border-b border-r border-[var(--w-border)] bg-[var(--w-sunken)] px-2 py-1 text-right text-[11px] tabular-nums text-[var(--w-text-3)]">{ri + 1}</td>
                {s.cols.map((c, ci) => (
                  <td key={c} className={cn('max-w-[360px] whitespace-pre-wrap border-b border-r border-[var(--w-border)] px-2 py-1 align-top [overflow-wrap:anywhere]', /^-?[\d.,]+%?$/.test(r[ci] ?? '') && 'text-right tabular-nums')}>{r[ci] ?? ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {s.truncated && <p className="px-3 py-2 text-[12px] text-[var(--w-text-3)]">{wt('xem.sheetTruncated', { r: s.rows.length, tr: s.totalRows, c: s.cols.length, tc: s.totalCols })}</p>}
      </div>
      {(data.sheets.length > 1 || data.moreSheets > 0) && (
        <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-t border-[var(--w-border)] bg-[var(--w-sunken)] px-2 py-1" role="tablist" aria-label={wt('xem.sheets')}>
          {data.sheets.map((sh, k) => (
            <button key={k} type="button" role="tab" aria-selected={k === i} onClick={() => setI(k)}
              className={cn('shrink-0 rounded-[6px] px-2.5 py-1 text-[12px]', k === i ? 'bg-[var(--w-panel)] font-semibold text-[var(--w-accent-text)] shadow-sm' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}>
              {sh.name}
            </button>
          ))}
          {data.moreSheets > 0 && <span className="shrink-0 px-2 text-[11.5px] text-[var(--w-text-3)]">{wt('xem.moreSheets', { count: data.moreSheets })}</span>}
        </div>
      )}
    </div>
  );
}

export default function XemOffice({ data }: { data: XemTruocOffice }) {
  return data.kind === 'docx' ? <Docx html={data.html} imagesDropped={data.imagesDropped} /> : <Xlsx data={data} />;
}
