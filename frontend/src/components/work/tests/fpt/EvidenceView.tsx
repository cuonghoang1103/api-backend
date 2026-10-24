'use client';

/**
 * Ảnh Evidence của một case 5.2/5.3 (24/10/2026): ảnh chụp dán trong tệp Excel nhập vào (hoặc tải lên ở khung chi tiết)
 * nằm trong kho tệp của dự án; ô evidence giữ token `[img:<tệp>]`. Ở đây vẽ ảnh thu nhỏ + liên kết http(s) trong chữ,
 * bấm ảnh ⇒ xem cỡ lớn. Ảnh tải qua proxy /api/v1 (cookie đăng nhập) — quyền xem dự án như mọi dữ liệu 5.2/5.3.
 */

import { useEffect, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkPortal } from '../../ui';
import { evidenceUrl } from './fptApi';
import { wt } from '@/components/work/i18n';

const URL_RE = /https?:\/\/[^\s<>"')\]]+/g;

export default function EvidenceView({ pid, files, text, compact, onRemove }: {
  pid: number; files: string[]; text?: string; compact?: boolean; onRemove?: (file: string) => void;
}) {
  const [big, setBig] = useState<string | null>(null);
  const links = text ? [...new Set(text.match(URL_RE) ?? [])] : [];
  if (!files.length && !links.length) return null;
  const shown = compact ? files.slice(0, 3) : files;
  return (
    <div className={cn('fpt-ev', compact && 'is-compact')}>
      {links.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {links.slice(0, compact ? 2 : 20).map((u) => (
            <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="fpt-ev-link" title={u}>
              <ExternalLink size={11} aria-hidden /> <span className="truncate">{u.replace(/^https?:\/\//, '')}</span>
            </a>
          ))}
        </div>
      )}
      {shown.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {shown.map((f, i) => (
            <span key={f} className="fpt-ev-thumb">
              <button type="button" onClick={() => setBig(f)} aria-label={wt('fpt.evidenceOpen', { n: i + 1 })} title={wt('fpt.evidenceOpen', { n: i + 1 })}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={evidenceUrl(pid, f)} alt={wt('fpt.evidenceAlt', { n: i + 1 })} loading="lazy" decoding="async" />
              </button>
              {onRemove && (
                <button type="button" className="fpt-ev-del" onClick={() => onRemove(f)} aria-label={wt('fpt.evidenceRemove')} title={wt('fpt.evidenceRemove')}><X size={11} /></button>
              )}
            </span>
          ))}
          {compact && files.length > shown.length && <span className="fpt-ev-more">+{files.length - shown.length}</span>}
        </div>
      )}
      {big && <Lightbox src={evidenceUrl(pid, big)} onClose={() => setBig(null)} />}
    </div>
  );
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); onClose(); } };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [onClose]);
  return (
    <WorkPortal>
      <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-6" role="dialog" aria-modal="true" aria-label={wt('fpt.evidenceAlt', { n: '' })} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="max-h-full max-w-full rounded-[6px] bg-white object-contain shadow-2xl" />
        <div className="absolute right-4 top-4 flex gap-2">
          <a href={src} target="_blank" rel="noopener noreferrer" className="w-btn w-btn-sm">{wt('fpt.evidenceNewTab')}</a>
          <button type="button" className="w-btn w-btn-sm" onClick={onClose} aria-label={wt('common.close')}><X size={14} /></button>
        </div>
      </div>
    </WorkPortal>
  );
}
