'use client';

/**
 * Mảnh dùng chung cho các trang cài đặt CT Work (không gian + dự án):
 * thanh tiêu đề trang, tab, khối cài đặt, hộp xác nhận, ô chọn gốc.
 */

import { useEffect, useState, type ReactNode, type SelectHTMLAttributes } from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, Spinner } from '../ui';

/** Thanh tiêu đề 48px: tiêu đề trái, hành động phải. */
export function PageHeader({ title, sub, actions }: { title: ReactNode; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-3 border-b border-[var(--w-border)] px-4 md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <h1 className="truncate text-[14px] font-semibold">{title}</h1>
        {sub && <span className="hidden truncate text-[13px] text-[var(--w-text-3)] sm:inline">{sub}</span>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export interface TabDef<K extends string> { key: K; label: string }

/** Tab ngang, cuộn ngang khi hẹp (trong vùng riêng, không làm trang cuộn ngang). */
export function SettingsTabs<K extends string>({ tabs, active, onChange }: { tabs: TabDef<K>[]; active: K; onChange: (k: K) => void }) {
  return (
    <div className="-mx-1 mb-6 flex gap-1 overflow-x-auto border-b border-[var(--w-border)] px-1">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={cn(
            '-mb-px shrink-0 whitespace-nowrap border-b-2 px-2.5 pb-2.5 pt-1 text-[13px] font-medium transition-colors',
            active === t.key
              ? 'border-[var(--w-accent)] text-[var(--w-text)]'
              : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]',
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/** Một khối cài đặt: tiêu đề + mô tả + nội dung, ngăn bằng đường kẻ mảnh. */
export function Section({ title, description, children, danger, action }: { title: string; description?: ReactNode; children?: ReactNode; danger?: boolean; action?: ReactNode }) {
  return (
    <section className="border-b border-[var(--w-border)] py-6 first:pt-0 last:border-b-0">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className={cn('text-[14px] font-semibold', danger && 'text-[var(--w-red)]')}>{title}</h2>
          {description && <p className="mt-1 text-[13px] leading-relaxed text-[var(--w-text-2)]">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
}

export function ReadOnlyNotice({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-2 rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-[13px] text-[var(--w-text-2)]">
      <Lock size={13} className="shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...rest} className={cn('w-input cursor-pointer pr-7 disabled:cursor-not-allowed disabled:opacity-60', className)}>
      {children}
    </select>
  );
}

/** Hộp xác nhận cho thao tác phá huỷ. */
export function ConfirmDialog({
  open, onClose, onConfirm, title, body, confirmLabel = 'Confirm', danger = true, pending,
}: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; body: ReactNode;
  confirmLabel?: string; danger?: boolean; pending?: boolean;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      width={440}
      footer={
        <>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="button" autoFocus className={cn('w-btn', danger ? 'w-btn-danger-solid' : 'w-btn-primary')} disabled={pending} onClick={onConfirm}>
            {pending && <Spinner size={12} />}
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="text-[13px] leading-relaxed text-[var(--w-text-2)]">{body}</div>
    </Dialog>
  );
}

/** Xác nhận bằng cách gõ đúng một chuỗi (tên không gian / khoá dự án). */
export function TypeToConfirmDialog({
  open, onClose, onConfirm, title, body, expected, confirmLabel, pending, caseInsensitive,
}: {
  open: boolean; onClose: () => void; onConfirm: (typed: string) => void; title: string; body: ReactNode;
  expected: string; confirmLabel: string; pending?: boolean; caseInsensitive?: boolean;
}) {
  const [typed, setTyped] = useState('');
  useEffect(() => { if (!open) setTyped(''); }, [open]);
  const match = caseInsensitive ? typed.trim().toUpperCase() === expected.toUpperCase() : typed.trim() === expected;
  return (
    <Dialog open={open} onClose={onClose} title={title} width={460}>
      <form onSubmit={(e) => { e.preventDefault(); if (match && !pending) onConfirm(typed.trim()); }}>
        <div className="mb-4 text-[13px] leading-relaxed text-[var(--w-text-2)]">{body}</div>
        <label className="w-label">
          Type <span className="font-mono font-semibold text-[var(--w-text)]">{expected}</span> to confirm
        </label>
        <input className="w-input" value={typed} onChange={(e) => setTyped(e.target.value)} autoFocus autoComplete="off" spellCheck={false} />
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="w-btn w-btn-danger-solid" disabled={!match || pending}>
            {pending && <Spinner size={12} />}
            {confirmLabel}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

/** Tên vai trò hiển thị. */
export const WS_ROLE_LABEL = { OWNER: 'Owner', ADMIN: 'Admin', MEMBER: 'Member', GUEST: 'Guest' } as const;
export const PROJECT_ROLE_LABEL = { ADMIN: 'Admin', MEMBER: 'Member', VIEWER: 'Viewer', TEACHER: 'Teacher', CLIENT: 'Client' } as const;
export const PROJECT_TYPE_LABEL = { SCRUM: 'Scrum', KANBAN: 'Kanban', TESTING: 'Testing' } as const;

export const WS_ROLE_HELP: Record<'ADMIN' | 'MEMBER' | 'GUEST', string> = {
  ADMIN: 'Manages members and every project',
  MEMBER: 'Works in shared projects',
  GUEST: 'Only sees projects they are added to (teachers, clients)',
};

export const PROJECT_ROLE_HELP: Record<'ADMIN' | 'MEMBER' | 'VIEWER' | 'TEACHER' | 'CLIENT', string> = {
  ADMIN: 'Full control of the project and its settings',
  MEMBER: 'Creates, edits and moves issues',
  VIEWER: 'Read only',
  TEACHER: 'Can view and comment (for lecturers)',
  CLIENT: 'Can view, comment and report issues',
};

/** Ô vuông chữ tắt cho không gian. */
export function WorkspaceMark({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '?';
  return (
    <span
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
      className="inline-flex shrink-0 items-center justify-center rounded-[6px] bg-[var(--w-accent)] font-semibold text-white"
    >
      {initials}
    </span>
  );
}

/** Công tắc bật/tắt (luật tự động, giờ im lặng…). */
export function Switch({ checked, onChange, disabled, label }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-[18px] w-[32px] shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-[var(--w-accent)]' : 'bg-[var(--w-border-strong)]',
      )}
    >
      <span className={cn('inline-block h-[14px] w-[14px] rounded-full bg-white shadow transition-transform', checked ? 'translate-x-[16px]' : 'translate-x-[2px]')} />
    </button>
  );
}
