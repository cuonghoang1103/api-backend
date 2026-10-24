'use client';

/** Mảnh dùng chung của tab Unit (5.1) / Integration (5.2): ô số liệu, nút xuất, ô sửa-khi-rời. */

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Download, FileSpreadsheet, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { isTyping, Spinner, WorkPortal } from '../../ui';
import { fptApi, saveBlob, type ReportKind } from './fptApi';
import KpiTile from '../../KpiTile';
import { wt } from '@/components/work/i18n';

/** Ô số liệu của 5.1/5.2 — nay là `KpiTile` cỡ nhỏ (UX-A: bỏ dải chữ HOA, kiểu KPI thứ ba). */
export function Stat({ label, value, tone, hint }: { label: string; value: ReactNode; tone?: 'green' | 'red' | 'yellow' | 'muted'; hint?: string }) {
  return <KpiTile size="sm" label={label} value={value} tone={tone} title={hint} hint={hint} />;
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
          toast.success(wt('fpt.exported', { name: fileName }));
        } catch (e) {
          toast.error(workError(e, wt('fpt.exportFailed')));
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
  const text = { idle: '', dirty: wt('issues.unsaved'), saving: wt('common.saving'), saved: wt('fpt.allSaved'), error: wt('fpt.notSaved') }[state];
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

// ─── Xem rõ bảng 5.1/5.2/5.3 (24/10/2026) ─────────────────────────
// Chủ kênh SWT301: "không kéo rộng từng dòng, hàng gì ra được để xem rõ từng hàm test nhập vào".
// ⇒ cột kéo rộng được (nhớ theo người dùng, localStorage có try/catch), khung chi tiết bên phải.

const readJson = <T,>(key: string): T | null => {
  try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : null; } catch { return null; }
};
const writeJson = (key: string, v: unknown) => { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* chế độ riêng tư / bị chặn — bỏ qua */ } };

/** Độ rộng cột theo id, nhớ trong localStorage (`key`); giá trị lạ bị kẹp trong [min, max]. */
export function useColWidths(key: string, defaults: Record<string, number>, min = 48, max = 1200) {
  const [w, setW] = useState<Record<string, number>>(defaults);
  // Đọc sau khi gắn (tránh lệch HTML giữa server và trình duyệt).
  useEffect(() => {
    const saved = readJson<Record<string, number>>(key);
    if (!saved) return;
    setW((cur) => {
      const next = { ...cur };
      for (const [k, v] of Object.entries(saved)) if (k in defaults && Number.isFinite(v)) next[k] = Math.min(max, Math.max(min, Math.round(v)));
      return next;
    });
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const latest = useRef(w);
  latest.current = w;
  const set = useCallback((id: string, px: number) => setW((cur) => ({ ...cur, [id]: Math.min(max, Math.max(min, Math.round(px))) })), [min, max]);
  const commit = useCallback(() => writeJson(key, latest.current), [key]);
  const reset = useCallback(() => { setW(defaults); try { localStorage.removeItem(key); } catch { /* bỏ qua */ } }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return { widths: w, set, commit, reset };
}

/** Tay cầm kéo ở mép phải một ô tiêu đề (th phải có position sticky/relative). Nhấp đúp ⇒ về độ rộng mặc định. */
export function ColResizer({ width, onResize, onDone, onReset, label }: { width: number; onResize: (px: number) => void; onDone: () => void; onReset?: () => void; label: string }) {
  const start = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    const x0 = e.clientX, w0 = width;
    const el = e.currentTarget;
    try { el.setPointerCapture(e.pointerId); } catch { /* bỏ qua */ }
    const move = (ev: PointerEvent) => onResize(w0 + ev.clientX - x0);
    const up = () => {
      el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
      document.body.style.cursor = ''; document.body.style.userSelect = '';
      onDone();
    };
    document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none';
    el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  };
  return (
    <div
      role="separator" aria-orientation="vertical" aria-label={label} tabIndex={0} title={wt('fpt.dragResize')}
      className="fpt-resizer" onPointerDown={start} onDoubleClick={onReset}
      onKeyDown={(e) => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); onResize(width + (e.key === 'ArrowRight' ? 24 : -24)); onDone(); } }}
    />
  );
}

/** Lựa chọn hiển thị nhớ theo người dùng (vd "gói dòng"/"gọn"). */
export function useStoredFlag(key: string, initial: boolean): [boolean, (v: boolean) => void] {
  const [v, setV] = useState(initial);
  useEffect(() => { const s = readJson<boolean>(key); if (typeof s === 'boolean') setV(s); }, [key]);
  return [v, (x: boolean) => { setV(x); writeJson(key, x); }];
}

/**
 * Khung chi tiết bên phải (không chặn bảng phía sau): xem trọn một case / một hàm; ← → (hoặc J/K) sang case khác, Esc đóng.
 * Nằm trong #work-portal nên bám đúng khung CT Work cả trên web lẫn app desktop.
 */
export function DetailDrawer({ open, onClose, title, subtitle, children, onPrev, onNext, width = 560 }: {
  open: boolean; onClose: () => void; title: ReactNode; subtitle?: ReactNode; children: ReactNode;
  onPrev?: (() => void) | null; onNext?: (() => void) | null; width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if (e.key === 'Escape') { onClose(); return; }
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.key === 'ArrowLeft' || e.key === 'k') && onPrev) { e.preventDefault(); onPrev(); }
      if ((e.key === 'ArrowRight' || e.key === 'j') && onNext) { e.preventDefault(); onNext(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, onPrev, onNext]);
  if (!open) return null;
  return (
    <WorkPortal>
      <aside role="dialog" aria-modal="false" aria-label={typeof title === 'string' ? title : wt('fpt.caseDetails')} className="fpt-drawer" style={{ width: `min(${width}px, 100%)` }}>
        <header className="flex items-center gap-2 border-b border-[var(--w-border)] px-4 py-2.5">
          <div className="min-w-0 flex-1">
            <div className="truncate text-[14px] font-semibold">{title}</div>
            {subtitle && <div className="truncate text-[12px] text-[var(--w-text-3)]">{subtitle}</div>}
          </div>
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" disabled={!onPrev} onClick={() => onPrev?.()} aria-label={wt('fpt.prevCase')} title={`${wt('fpt.prevCase')} (←)`}><ChevronLeft size={15} /></button>
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" disabled={!onNext} onClick={() => onNext?.()} aria-label={wt('fpt.nextCase')} title={`${wt('fpt.nextCase')} (→)`}><ChevronRight size={15} /></button>
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onClose} aria-label={wt('common.close')} title={`${wt('common.close')} (Esc)`}><X size={15} /></button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">{children}</div>
      </aside>
    </WorkPortal>
  );
}

/** Ô nhập nhiều dòng tự giãn theo nội dung (khung chi tiết). */
export function GrowArea({ value, onChange, readOnly, placeholder, ariaLabel, maxLength, mono }: {
  value: string; onChange: (v: string) => void; readOnly?: boolean; placeholder?: string; ariaLabel: string; maxLength?: number; mono?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${Math.max(38, el.scrollHeight + 2)}px`;
  }, [value]);
  return (
    <textarea ref={ref} rows={1} value={value} readOnly={readOnly} placeholder={readOnly ? '' : placeholder} aria-label={ariaLabel} maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)} className={cn('w-input fpt-grow', mono && 'font-mono text-[12.5px]')} />
  );
}

/** Danh sách chuỗi nhớ theo người dùng (vd cột đang ẩn). */
export function useStoredList(key: string): [string[], (v: string[]) => void] {
  const [v, setV] = useState<string[]>([]);
  useEffect(() => { const s = readJson<unknown>(key); if (Array.isArray(s)) setV(s.filter((x): x is string => typeof x === 'string')); }, [key]);
  return [v, (x: string[]) => { setV(x); writeJson(key, x); }];
}
