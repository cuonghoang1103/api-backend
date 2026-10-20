'use client';

/** "Create with CuongMini" — mảnh giao diện dùng chung (thẻ mục, gợi ý "vì sao hỏi", sửa danh sách chữ, chip trạng thái nguồn). */

import { useState, type ReactNode } from 'react';
import { AlertTriangle, Check, CircleDashed, FileText, Github, Link2, Lock, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SetupSource } from '@/lib/work-setup-api';
import { wt } from '@/components/work/i18n';

/** Thẻ một mục của trình hướng dẫn: chữ cái, tiêu đề, "vì sao hỏi", ví dụ. */
export function Section({ id, letter, title, why, example, children, right }: {
  id: string; letter: string; title: string; why: string; example?: string; children: ReactNode; right?: ReactNode;
}) {
  return (
    <section id={id} className="w-card scroll-mt-4 p-4 md:p-5">
      <div className="mb-3 flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-[var(--w-accent-soft)] text-[12px] font-semibold text-[var(--w-accent-text)]">{letter}</span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{title}</h2>
          <p className="mt-0.5 text-[12.5px] leading-snug text-[var(--w-text-2)]">{why}</p>
          {example && <p className="mt-1 text-[12px] leading-snug text-[var(--w-text-3)]"><span className="font-medium">{wt('tcm.example')}</span> {example}</p>}
        </div>
        {right}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/** Danh sách chữ sửa tại chỗ (phạm vi, giả định, rủi ro…). */
export function ListEditor({ value, onChange, placeholder, max = 30, disabled }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string; max?: number; disabled?: boolean }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const t = draft.trim();
    if (!t || value.length >= max) return;
    onChange([...value, t]);
    setDraft('');
  };
  return (
    <div className="min-w-0">
      <ul className="space-y-1">
        {value.map((v, i) => (
          <li key={i} className="group flex items-start gap-1.5">
            <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[var(--w-text-3)]" aria-hidden />
            <input
              className="w-input-bare min-w-0 flex-1 rounded-[5px] px-1.5 py-1 text-[13px] hover:bg-[var(--w-hover)] focus:bg-[var(--w-sunken)]"
              value={v} disabled={disabled} aria-label={placeholder}
              onChange={(e) => onChange(value.map((x, k) => (k === i ? e.target.value : x)))}
            />
            {!disabled && (
              <button type="button" className="w-btn w-btn-ghost w-btn-icon h-7 w-7 shrink-0 opacity-60 hover:opacity-100" aria-label={wt('tcm.remove')} onClick={() => onChange(value.filter((_, k) => k !== i))}>
                <X size={13} />
              </button>
            )}
          </li>
        ))}
      </ul>
      {!disabled && value.length < max && (
        <div className="mt-1 flex gap-1.5">
          <input
            className="w-input h-8 min-w-0 flex-1 text-[13px]" value={draft} placeholder={placeholder ?? wt('tcm.addLine')}
            onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          />
          <button type="button" className="w-btn w-btn-sm" onClick={add} disabled={!draft.trim()}><Plus size={13} /> {wt('tcm.add')}</button>
        </div>
      )}
    </div>
  );
}

/** Chip trạng thái của một nguồn đã đọc. */
export function SourceChip({ s, onRemove, disabled }: { s: SetupSource; onRemove?: () => void; disabled?: boolean }) {
  const Icon = s.kind === 'REPO' ? Github : s.kind === 'LINK' ? Link2 : FileText;
  const tone = s.status === 'OK' ? 'text-[var(--w-green)]' : s.status === 'PRIVATE' ? 'text-[var(--w-orange)]' : s.status === 'ERROR' ? 'text-[var(--w-red)]' : 'text-[var(--w-text-3)]';
  const StatusIcon = s.status === 'OK' ? Check : s.status === 'PRIVATE' ? Lock : s.status === 'ERROR' ? AlertTriangle : CircleDashed;
  return (
    <li className="flex min-w-0 items-start gap-2 rounded-[7px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-2.5 py-2">
      <Icon size={14} className="mt-0.5 shrink-0 text-[var(--w-text-2)]" />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-[13px] font-medium" title={s.url ?? s.name}>{s.name}</span>
          <span className={cn('flex shrink-0 items-center gap-0.5 text-[11px] font-medium', tone)}>
            <StatusIcon size={11} /> {wt(`tcm.src_${s.status}` as const)}
          </span>
        </div>
        <div className="mt-0.5 text-[11.5px] leading-snug text-[var(--w-text-3)] [overflow-wrap:anywhere]">
          {s.status === 'OK' && s.chars ? wt('tcm.srcChars', { n: Math.round(s.chars / 100) / 10 }) : null}
          {s.note ? <>{s.status === 'OK' && s.chars ? ' · ' : ''}{s.note}</> : null}
          {s.error ? <span className="block text-[var(--w-text-2)]">{s.error}</span> : null}
        </div>
      </div>
      {onRemove && !disabled && (
        <button type="button" className="w-btn w-btn-ghost w-btn-icon h-7 w-7 shrink-0" aria-label={wt('tcm.removeSource', { name: s.name })} onClick={onRemove}><X size={13} /></button>
      )}
    </li>
  );
}

/** Hai cột trên màn rộng, một cột trên màn hẹp. */
export function Grid2({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid grid-cols-1 gap-x-3 sm:grid-cols-2', className)}>{children}</div>;
}

export function Check2({ checked, onChange, label, hint, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string; disabled?: boolean }) {
  return (
    <label className={cn('flex cursor-pointer items-start gap-2 rounded-[7px] px-2 py-1.5 hover:bg-[var(--w-hover)]', disabled && 'cursor-not-allowed opacity-60')}>
      <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--w-accent)]" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className="min-w-0">
        <span className="block text-[13px]">{label}</span>
        {hint && <span className="block text-[11.5px] leading-snug text-[var(--w-text-3)]">{hint}</span>}
      </span>
    </label>
  );
}
