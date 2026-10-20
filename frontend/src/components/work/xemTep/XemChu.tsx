'use client';

/**
 * Trình xem tệp — CHỮ: markdown (vẽ bằng react-markdown, KHÔNG chạy HTML thô trong tệp; ảnh ngoài không tự tải để tệp
 * không thành "điểm ảnh theo dõi"), CSV/TSV ⇒ bảng, JSON ⇒ định dạng đẹp, mã/chữ ⇒ đơn cách + số dòng.
 * Mọi thứ hiện dạng CHỮ — .html/.svg cũng chỉ hiện mã nguồn.
 */

import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { WrapText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatBytes } from '@/components/work/ui';
import { wt } from '@/components/work/i18n';
import { dinhDangJson, doanDauPhan, nhanNgonNgu, tachCsv, tachDong, type LoaiTep } from './loaiTep';

/** Khớp TEXT_PREVIEW_MAX của máy chủ (src/services/work/xemTep.ts). */
const TRAN_CHU = 2 * 1024 * 1024;
const MAX_DONG_BOC = 5000;
const MAX_DONG_BANG = 2000;

function NutChe({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick}
      className={cn('rounded-[6px] px-2 py-1 text-[12px] font-medium', on ? 'bg-[var(--w-panel)] text-[var(--w-text)] shadow-sm' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
      {children}
    </button>
  );
}

function ThanhChe({ children, right }: { children?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-1.5">
      {children && <div className="flex items-center gap-0.5 rounded-[8px] bg-[var(--w-sunken)] p-0.5">{children}</div>}
      <div className="ml-auto flex items-center gap-2 text-[12px] text-[var(--w-text-3)]">{right}</div>
    </div>
  );
}

/** Mã/chữ có số dòng. Không ngắt dòng: hai khối <pre> (gọn DOM cho tệp 2 MB). Ngắt dòng: mỗi dòng một hàng lưới. */
export function KhungMa({ text }: { text: string }) {
  const lines = useMemo(() => tachDong(text), [text]);
  const [boc, setBoc] = useState(false);
  const bocDuoc = lines.length <= MAX_DONG_BOC;
  const so = useMemo(() => lines.map((_, i) => i + 1).join('\n'), [lines]);
  return (
    <div className="flex h-full min-h-0 flex-col">
      <ThanhChe right={
        <>
          <span>{wt('xem.lines', { count: lines.length })}</span>
          {bocDuoc && (
            <button type="button" aria-pressed={boc} onClick={() => setBoc((v) => !v)} className={cn('w-btn w-btn-ghost w-btn-sm h-7', boc && 'bg-[var(--w-active)]')}>
              <WrapText size={13} /> {wt('xem.wrap')}
            </button>
          )}
        </>
      } />
      <div className="min-h-0 flex-1 overflow-auto bg-[var(--w-panel)] font-mono text-[12.5px] leading-[1.6]" tabIndex={0} data-testid="xem-ma">
        {boc && bocDuoc ? (
          <div className="grid grid-cols-[auto_1fr] py-2">
            {lines.map((l, i) => (
              <div key={i} className="contents">
                <span className="select-none border-r border-[var(--w-border)] px-3 text-right text-[var(--w-text-3)] tabular-nums">{i + 1}</span>
                <span className="whitespace-pre-wrap break-words px-3 [overflow-wrap:anywhere]">{l || ' '}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-w-max py-2">
            <pre aria-hidden="true" className="sticky left-0 select-none border-r border-[var(--w-border)] bg-[var(--w-panel)] px-3 text-right text-[var(--w-text-3)] tabular-nums">{so}</pre>
            <pre className="px-3">{text}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

function BangCsv({ text, fileName }: { text: string; fileName: string }) {
  const { rows, truncated } = useMemo(() => tachCsv(text, doanDauPhan(text, fileName), MAX_DONG_BANG), [text, fileName]);
  const nCot = rows.reduce((m, r) => Math.max(m, r.length), 0);
  const [dau, ...than] = rows;
  return (
    <div className="h-full min-h-0 overflow-auto bg-[var(--w-panel)]" tabIndex={0} data-testid="xem-csv">
      <table className="min-w-full border-separate border-spacing-0 text-[12.5px]">
        {dau && (
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-[2] border-b border-r border-[var(--w-border)] bg-[var(--w-sunken)] px-2 py-1.5" />
              {Array.from({ length: nCot }, (_, c) => (
                <th key={c} className="sticky top-0 z-[1] whitespace-nowrap border-b border-r border-[var(--w-border)] bg-[var(--w-sunken)] px-2.5 py-1.5 text-left font-semibold">{dau[c] ?? ''}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {than.map((r, i) => (
            <tr key={i} className="hover:bg-[var(--w-hover)]">
              <td className="sticky left-0 border-b border-r border-[var(--w-border)] bg-[var(--w-panel)] px-2 py-1 text-right text-[11px] tabular-nums text-[var(--w-text-3)]">{i + 2}</td>
              {Array.from({ length: nCot }, (_, c) => (
                <td key={c} className="max-w-[420px] whitespace-pre-wrap border-b border-r border-[var(--w-border)] px-2.5 py-1 align-top [overflow-wrap:anywhere]">{r[c] ?? ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {truncated && <p className="px-3 py-2 text-[12px] text-[var(--w-text-3)]">{wt('xem.rowsTruncated', { n: MAX_DONG_BANG })}</p>}
    </div>
  );
}

function Markdown({ text }: { text: string }) {
  return (
    <div className="h-full min-h-0 overflow-auto bg-[var(--w-panel)]" data-testid="xem-markdown">
      <div className="w-prose mx-auto max-w-[820px] px-5 py-6 sm:px-8">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ children }) => (
              <div className="mb-3 max-w-full overflow-x-auto">
                <table className="w-full border-collapse text-[13px] [&_td]:border [&_td]:border-[var(--w-border)] [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-[var(--w-border)] [&_th]:px-2 [&_th]:py-1 [&_th]:text-left">{children}</table>
              </div>
            ),
            // Link trong tệp luôn mở tab mới (không điều hướng khỏi CT Work); chỉ http(s)/mailto.
            a: ({ href, children }) => (/^(https?:|mailto:)/i.test(href ?? '') ? <a href={href} target="_blank" rel="noopener noreferrer nofollow">{children}</a> : <span>{children}</span>),
            // Ảnh ngoài KHÔNG tự tải (tệp đính kèm có thể là bẫy theo dõi) — hiện thành link.
            img: ({ src, alt }) => (typeof src === 'string' && /^https?:/i.test(src)
              ? <a href={src} target="_blank" rel="noopener noreferrer nofollow">🖼 {alt || src}</a>
              : <span>🖼 {alt}</span>),
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default function XemChu({ loai, text, fileName, truncated, size }: { loai: LoaiTep; text: string; fileName: string; truncated: boolean; size: number | null }) {
  const coBan = loai === 'markdown' || loai === 'csv' || loai === 'json';
  const [che, setChe] = useState<'dep' | 'goc'>('dep');
  const json = useMemo(() => (loai === 'json' ? dinhDangJson(text) : null), [loai, text]);
  const ngonNgu = nhanNgonNgu(fileName);
  const baoCat = truncated ? <p className="shrink-0 border-b border-[var(--w-border)] bg-[color-mix(in_srgb,var(--w-yellow)_12%,var(--w-panel))] px-3 py-1.5 text-[12px] text-[var(--w-text-2)]">{wt('xem.truncated', { size: formatBytes(TRAN_CHU) })}{size ? ` (${formatBytes(size)})` : ''}</p> : null;

  if (!text.length) return <div className="flex h-full items-center justify-center bg-[var(--w-panel)] text-[13px] text-[var(--w-text-3)]">{wt('xem.emptyFile')}</div>;

  let than: React.ReactNode;
  if (loai === 'markdown' && che === 'dep') than = <Markdown text={text} />;
  else if (loai === 'csv' && che === 'dep') than = <BangCsv text={text} fileName={fileName} />;
  else if (loai === 'json' && che === 'dep' && json) than = <KhungMa text={json.text} />;
  else than = <KhungMa text={text} />;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {baoCat}
      {coBan && (
        <ThanhChe right={ngonNgu ? <span>{ngonNgu}</span> : null}>
          <NutChe on={che === 'dep'} onClick={() => setChe('dep')}>{loai === 'csv' ? wt('xem.table') : wt('xem.rendered')}</NutChe>
          <NutChe on={che === 'goc'} onClick={() => setChe('goc')}>{wt('xem.raw')}</NutChe>
        </ThanhChe>
      )}
      <div className="min-h-0 flex-1">{than}</div>
    </div>
  );
}
