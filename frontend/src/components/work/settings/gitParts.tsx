'use client';

/**
 * Mảnh dùng chung của trang cài đặt GitHub / GitLab: ô sao chép (ẩn/hiện bí mật), một bước cài đặt, ô chọn trạng thái.
 * (Tách khỏi ProjectGithub.tsx ngày 18/10/2026 khi hai trang dùng chung GitIntegration.)
 */

import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectConfig } from '@/lib/work-api';
import { Select } from './shared';
import { wt } from '@/components/work/i18n';

export function CopyField({ label, value, secret, mono = true }: { label: string; value: string; secret?: boolean; mono?: boolean }) {
  const [shown, setShown] = useState(!secret);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard.writeText(value).then(
      () => { setCopied(true); toast.success(wt('git.xCopied', { x: label })); setTimeout(() => setCopied(false), 1500); },
      () => toast.error(wt('git.copyFailed')),
    );
  };
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <input
        readOnly
        value={shown ? value : '•'.repeat(Math.min(value.length, 32))}
        aria-label={label}
        onFocus={(e) => shown && e.currentTarget.select()}
        className={cn('w-input min-w-0 flex-1', mono && 'font-mono !text-[12px]')}
      />
      {secret && (
        <button type="button" className="w-btn w-btn-icon shrink-0" onClick={() => setShown((v) => !v)} aria-label={shown ? wt('git.hideSecret') : wt('git.showSecret')} title={shown ? wt('common.hide') : wt('common.show')}>
          {shown ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
      <button type="button" className="w-btn w-btn-icon shrink-0" onClick={copy} aria-label={wt('agents.copyX', { x: label.toLowerCase() })} title={wt('common.copy')}>
        {copied ? <Check size={14} className="text-[var(--w-green)]" /> : <Copy size={14} />}
      </button>
    </div>
  );
}

export function Step({ n, title, children }: { n: number; title: ReactNode; children?: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--w-accent-soft)] text-[11px] font-semibold text-[var(--w-accent-text)]">{n}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium">{title}</div>
        {children && <div className="mt-1.5 text-[13px] text-[var(--w-text-2)]">{children}</div>}
      </div>
    </li>
  );
}

/** Ô chọn trạng thái — gom theo quy trình khi dự án có nhiều quy trình. */
export function StatusSelect({ config, value, onChange, disabled, label }: { config: ProjectConfig; value: number | null; onChange: (v: number | null) => void; disabled?: boolean; label: string }) {
  const multi = config.workflows.length > 1;
  return (
    <Select value={value ?? ''} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)} disabled={disabled} aria-label={label} className="w-full sm:w-[260px]">
      <option value="">{wt('git.noneStatus')}</option>
      {config.workflows.map((w) => {
        const opts = [...w.statuses].sort((a, b) => a.position - b.position).map((s) => <option key={s.id} value={s.id}>{s.name}</option>);
        return multi ? <optgroup key={w.id} label={w.name}>{opts}</optgroup> : opts;
      })}
    </Select>
  );
}
