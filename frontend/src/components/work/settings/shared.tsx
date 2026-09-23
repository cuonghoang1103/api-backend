'use client';

/**
 * Mảnh dùng chung cho các trang cài đặt CT Work (không gian + dự án):
 * thanh tiêu đề trang, tab, khối cài đặt, hộp xác nhận, ô chọn gốc.
 */

import { useEffect, useState, type ReactNode, type SelectHTMLAttributes } from 'react';
import { Lock, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { avatarColor, Dialog, Spinner } from '../ui';
import { MobileNavButton } from '../shell/mobileNav';

/** Thanh tiêu đề 52px: nút ☰ (điện thoại), tiêu đề trái, hành động phải. */
export function PageHeader({ title, sub, actions }: { title: ReactNode; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="w-header flex h-[52px] shrink-0 items-center gap-2 border-b border-[var(--w-border)] px-3 md:gap-3 md:px-5">
      <MobileNavButton />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <h1 className="flex min-w-0 items-center truncate text-[15px] font-semibold">{title}</h1>
        {sub && <span className="hidden truncate text-[13px] text-[var(--w-text-3)] sm:inline">{sub}</span>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

export interface TabDef<K extends string> { key: K; label: string; icon?: LucideIcon }

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

export interface NavGroup<K extends string> { label: string; tabs: TabDef<K>[]; danger?: boolean }

/**
 * Khung trang cài đặt: cột điều hướng dọc chia nhóm bên trái (≥md), ô chọn ở
 * đầu trang trên điện thoại. Nội dung dùng hết bề ngang, riêng form giới hạn
 * ~880px cho dễ đọc. Nhóm rỗng (không đủ quyền) tự ẩn.
 */
export function SettingsLayout<K extends string>({ groups, active, onChange, children, label = 'Settings sections' }: {
  groups: NavGroup<K>[]; active: K; onChange: (k: K) => void; children: ReactNode; label?: string;
}) {
  const visible = groups.filter((g) => g.tabs.length);
  return (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      {/* Điện thoại: một ô chọn thay cho cột điều hướng. */}
      <div className="shrink-0 border-b border-[var(--w-border)] px-4 py-3 md:hidden">
        <Select aria-label={label} value={active} onChange={(e) => onChange(e.target.value as K)} className="!h-10">
          {visible.map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.tabs.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
            </optgroup>
          ))}
        </Select>
      </div>
      <nav aria-label={label} className="hidden w-[220px] shrink-0 overflow-y-auto border-r border-[var(--w-border)] px-3 py-5 md:block">
        {visible.map((g, gi) => (
          <div key={g.label} className={cn(gi > 0 && 'mt-5')}>
            <div className={cn('w-eyebrow mb-1.5 px-2', g.danger && '!text-[var(--w-red)]')}>{g.label}</div>
            <ul className="space-y-0.5">
              {g.tabs.map((t) => {
                const on = t.key === active;
                const Icon = t.icon;
                return (
                  <li key={t.key}>
                    <button
                      type="button"
                      onClick={() => onChange(t.key)}
                      aria-current={on ? 'page' : undefined}
                      className={cn(
                        'w-nav-row relative flex h-8 w-full items-center gap-2 rounded-[6px] px-2 text-left text-[13px] transition-colors',
                        on
                          ? 'bg-[var(--w-active)] font-medium text-[var(--w-text)]'
                          : g.danger
                            ? 'text-[var(--w-red)] hover:bg-[var(--w-hover)]'
                            : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]',
                      )}
                    >
                      {on && <span aria-hidden="true" className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-[var(--w-accent)]" />}
                      {Icon && <Icon size={15} className="shrink-0 opacity-80" />}
                      <span className="truncate">{t.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <div className="w-full max-w-[880px] px-4 py-6 md:px-8 md:py-7">
          {children}
        </div>
      </div>
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

/**
 * Ô chọn gốc (giữ native cho bàn phím / trình đọc màn hình / bánh xe iOS) nhưng
 * cùng "vỏ" với ô nhập: cao 32px, chevron riêng theo token, màu theo theme.
 * Kiểu dáng nằm ở `select:where(.w-input)` trong work.css.
 */
export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...rest} className={cn('w-input disabled:cursor-not-allowed disabled:opacity-60', className)}>
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
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38), background: avatarColor(name) }}
      className="inline-flex shrink-0 items-center justify-center rounded-[7px] font-semibold leading-none text-white"
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
