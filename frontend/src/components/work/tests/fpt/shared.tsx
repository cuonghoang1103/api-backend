'use client';

/** Mảnh dùng chung của tab Unit (5.1) / Integration (5.2): ô số liệu, nút xuất, ô sửa-khi-rời. */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Spinner } from '../../ui';
import { fptApi, saveBlob, type ReportKind } from './fptApi';

export function Stat({ label, value, tone, hint }: { label: string; value: ReactNode; tone?: 'green' | 'red' | 'yellow' | 'muted'; hint?: string }) {
  return (
    <div className="min-w-[72px]" title={hint}>
      <div className="text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">{label}</div>
      <div
        className={cn(
          'text-[17px] font-semibold tabular-nums leading-tight',
          tone === 'green' && 'text-[var(--w-green)]',
          tone === 'red' && 'text-[var(--w-red)]',
          tone === 'yellow' && 'text-[var(--w-yellow)]',
          tone === 'muted' && 'text-[var(--w-text-2)]',
        )}
      >
        {value}
      </div>
    </div>
  );
}

/** Thanh tỉ lệ Passed / Failed / còn lại. */
export function ResultBar({ passed, failed, total, className }: { passed: number; failed: number; total: number; className?: string }) {
  const p = total ? (passed / total) * 100 : 0;
  const f = total ? (failed / total) * 100 : 0;
  return (
    <div className={cn('flex h-1.5 w-full overflow-hidden rounded-full bg-[var(--w-sunken)]', className)} aria-hidden>
      <div style={{ width: `${p}%` }} className="bg-[var(--w-green)]" />
      <div style={{ width: `${f}%` }} className="bg-[var(--w-red)]" />
    </div>
  );
}

export function ExportButton({ pid, report, label }: { pid: number; report: ReportKind; label: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className="w-btn w-btn-sm"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const { blob, fileName } = await fptApi.exportXlsx(pid, report);
          saveBlob(blob, fileName);
          toast.success(`Exported ${fileName}`);
        } catch (e) {
          toast.error(workError(e, 'Could not export'));
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? <Spinner size={12} /> : <Download size={13} />} <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export const ExcelIcon = () => <FileSpreadsheet size={13} />;

/** Ô chữ sửa tại chỗ — gửi khi rời ô / Enter (không gửi mỗi phím). */
export function InlineText({
  value, onCommit, placeholder, className, readOnly, multiline, ariaLabel, maxLength,
}: {
  value: string | null | undefined; onCommit: (v: string) => void; placeholder?: string; className?: string;
  readOnly?: boolean; multiline?: boolean; ariaLabel?: string; maxLength?: number;
}) {
  const [v, setV] = useState(value ?? '');
  const focused = useRef(false);
  useEffect(() => { if (!focused.current) setV(value ?? ''); }, [value]);
  const commit = () => { if ((value ?? '') !== v) onCommit(v); };
  const common = {
    value: v,
    readOnly,
    placeholder,
    'aria-label': ariaLabel ?? placeholder,
    maxLength,
    onFocus: () => { focused.current = true; },
    onBlur: () => { focused.current = false; commit(); },
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV(e.target.value),
  };
  return multiline ? (
    <textarea {...common} rows={2} className={cn('w-input min-h-[52px] resize-y text-[13px]', className)} />
  ) : (
    <input
      {...common}
      className={cn('w-input h-[30px] text-[13px]', className)}
      onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); if (e.key === 'Escape') { setV(value ?? ''); (e.target as HTMLInputElement).blur(); } }}
    />
  );
}

/** Trạng thái lưu tự động. */
export function SaveState({ state }: { state: 'idle' | 'dirty' | 'saving' | 'saved' | 'error' }) {
  const text = { idle: '', dirty: 'Unsaved changes', saving: 'Saving…', saved: 'All changes saved', error: 'Not saved' }[state];
  if (!text) return null;
  return (
    <span className={cn('inline-flex items-center gap-1 text-[12px]', state === 'error' ? 'text-[var(--w-red)]' : 'text-[var(--w-text-3)]')} aria-live="polite">
      {state === 'saving' && <Spinner size={11} />}
      {text}
    </span>
  );
}

export const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
export const shortDate = (iso: string | null | undefined) => (iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}` : '');
