'use client';

/**
 * CT Work — mảnh giao diện dùng chung. Repo không có shadcn/Radix nên
 * popover/dialog tự viết, gọn, đủ bàn phím (Esc, mũi tên, Enter).
 *
 * Mọi lớp nổi render vào #work-portal (nằm TRONG .work-root) chứ không vào
 * document.body — biến màu --w-* chỉ tồn tại bên trong .work-root.
 */

import {
  forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState,
  type ReactNode, type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  AlertOctagon, Bookmark, Bug, CheckSquare, ChevronsUp, ChevronUp, ChevronDown, ChevronsDown, Equal,
  FileText, FlaskConical, Layers, SquareDashedBottom, X, Check, Search, SearchX,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, type IssueTypeKey, type StatusCategory, type WorkUser } from '@/lib/work-api';

// ─── Portal ──────────────────────────────────────────────────────

export function WorkPortal({ children }: { children: ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => setEl(document.getElementById('work-portal')), []);
  return el ? createPortal(children, el) : null;
}

// ─── Popover ─────────────────────────────────────────────────────

interface PopoverProps {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement>;
  children: ReactNode;
  width?: number;
  align?: 'start' | 'end';
  className?: string;
}

/** Lớp nổi bám theo một phần tử; tự lật lên trên khi hết chỗ bên dưới. */
export function Popover({ open, onClose, anchorRef, children, width = 240, align = 'start', className }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const a = anchorRef.current?.getBoundingClientRect();
      if (!a) return;
      const h = ref.current?.offsetHeight ?? 280;
      const below = a.bottom + 4;
      const top = below + h > window.innerHeight - 8 && a.top - h - 4 > 8 ? a.top - h - 4 : below;
      let left = align === 'end' ? a.right - width : a.left;
      left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
      setPos({ top, left });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, anchorRef, width, align]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || anchorRef.current?.contains(t)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // preventDefault để Dialog/ngăn kéo bên ngoài biết Esc này đã có chủ.
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey, true);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;
  return (
    <WorkPortal>
      <div
        ref={ref}
        style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999, width, boxShadow: 'var(--w-shadow-pop)' }}
        className={cn('fixed z-[80] rounded-[8px] bg-[var(--w-raised)] text-[13px]', className)}
      >
        {children}
      </div>
    </WorkPortal>
  );
}

// ─── Danh sách chọn có ô tìm (dùng cho mọi picker) ───────────────

export interface PickOption<T> {
  value: T;
  label: string;
  icon?: ReactNode;
  hint?: string;
  keywords?: string;
}

interface PickerProps<T> {
  options: PickOption<T>[];
  selected: T[];
  onPick: (value: T) => void;
  multi?: boolean;
  placeholder?: string;
  empty?: string;
  /** Hiện dòng "Create “…”" khi gõ chữ không khớp gì. */
  onCreate?: (text: string) => void;
}

export function PickerList<T>({ options, selected, onPick, multi, placeholder = 'Search…', empty = 'No results', onCreate }: PickerProps<T>) {
  const [q, setQ] = useState('');
  const [hi, setHi] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return options;
    return options.filter((o) => `${o.label} ${o.keywords ?? ''}`.toLowerCase().includes(t));
  }, [q, options]);
  const canCreate = !!onCreate && q.trim().length > 0 && !options.some((o) => o.label.toLowerCase() === q.trim().toLowerCase());
  const total = filtered.length + (canCreate ? 1 : 0);

  useEffect(() => inputRef.current?.focus(), []);
  useEffect(() => setHi(0), [q]);

  const choose = (i: number) => {
    if (i < filtered.length) onPick(filtered[i].value);
    else if (canCreate) onCreate!(q.trim());
  };

  return (
    <div>
      <div className="flex items-center gap-2 border-b border-[var(--w-border)] px-2.5">
        <Search size={13} className="shrink-0 text-[var(--w-text-3)]" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => Math.min(h + 1, total - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)); }
            if (e.key === 'Enter') { e.preventDefault(); if (total) choose(hi); }
          }}
          placeholder={placeholder}
          className="h-9 w-full bg-transparent text-[13px] text-[var(--w-text)] outline-none placeholder:text-[var(--w-text-3)]"
        />
      </div>
      <div className="max-h-[280px] overflow-y-auto p-1">
        {filtered.map((o, i) => {
          const isSel = selected.includes(o.value);
          return (
            <button
              key={String(o.value)}
              type="button"
              onMouseEnter={() => setHi(i)}
              onClick={() => choose(i)}
              className={cn(
                'flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px]',
                i === hi ? 'bg-[var(--w-hover)]' : '',
              )}
            >
              {o.icon && <span className="flex w-4 shrink-0 justify-center">{o.icon}</span>}
              <span className="min-w-0 flex-1 truncate">{o.label}</span>
              {o.hint && <span className="shrink-0 text-[11px] text-[var(--w-text-3)]">{o.hint}</span>}
              {(multi || isSel) && (
                <Check size={13} className={cn('shrink-0', isSel ? 'text-[var(--w-accent-text)]' : 'opacity-0')} />
              )}
            </button>
          );
        })}
        {canCreate && (
          <button
            type="button"
            onMouseEnter={() => setHi(filtered.length)}
            onClick={() => choose(filtered.length)}
            className={cn('flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px]', hi === filtered.length ? 'bg-[var(--w-hover)]' : '')}
          >
            <span className="text-[var(--w-text-3)]">Create</span>
            <span className="truncate font-medium">“{q.trim()}”</span>
          </button>
        )}
        {!total && <div className="px-2 py-3 text-center text-[12px] text-[var(--w-text-3)]">{empty}</div>}
      </div>
    </div>
  );
}

// ─── Hộp thoại ───────────────────────────────────────────────────

export function Dialog({
  open, onClose, title, children, width = 520, footer, dismissible = true,
}: {
  open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; width?: number; footer?: ReactNode;
  /** false = Esc / bấm nền / nút X không đóng được (vd hộp hiện token một lần). */
  dismissible?: boolean;
}) {
  useEffect(() => {
    if (!open || !dismissible) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !e.defaultPrevented && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, dismissible]);
  if (!open) return null;
  return (
    <WorkPortal>
      <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-[8vh]" onMouseDown={(e) => dismissible && e.target === e.currentTarget && onClose()}>
        <div role="dialog" aria-modal="true" style={{ maxWidth: width, boxShadow: 'var(--w-shadow-pop)' }} className="w-full rounded-[10px] bg-[var(--w-panel)]">
          {title !== undefined && (
            <div className="flex items-center justify-between border-b border-[var(--w-border)] px-5 py-3.5">
              <div className="text-[15px] font-semibold">{title}</div>
              {dismissible && <button type="button" onClick={onClose} className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label="Close"><X size={15} /></button>}
            </div>
          )}
          <div className="px-5 py-4">{children}</div>
          {footer && <div className="flex justify-end gap-2 border-t border-[var(--w-border)] px-5 py-3">{footer}</div>}
        </div>
      </div>
    </WorkPortal>
  );
}

// ─── Người ───────────────────────────────────────────────────────

/** Bảng màu dễ chịu, đủ tương phản với chữ trắng ở cả hai theme. */
const AVATAR_COLORS = ['#5e6ad2', '#2f8f65', '#c8612f', '#b83f6f', '#2a6fd1', '#8a4fd1', '#0f8a86', '#a8741a', '#c9423e', '#56627a'];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Màu cố định theo người (cùng username ⇒ cùng màu ở mọi nơi). */
export function avatarColor(seed: string): string {
  return AVATAR_COLORS[hashStr(seed || '?') % AVATAR_COLORS.length];
}

/** Chữ tắt: chữ cái đầu của tối đa 2 từ trong tên hiển thị; không có thì username. */
export function initialsOf(user: { username: string; fullName?: string | null; displayName?: string | null }): string {
  const name = (user.displayName || user.fullName || '').trim();
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 1).toUpperCase();
  return (user.username || '?').slice(0, 1).toUpperCase();
}

export function UserAvatar({ user, size = 22, className }: { user: Pick<WorkUser, 'username' | 'fullName' | 'displayName' | 'avatarUrl'> | null | undefined; size?: number; className?: string }) {
  const [broken, setBroken] = useState(false);
  const src = user?.avatarUrl;
  useEffect(() => setBroken(false), [src]);
  if (!user) {
    return (
      <span
        title="Unassigned"
        aria-label="Unassigned"
        style={{ width: size, height: size }}
        className={cn('inline-flex shrink-0 items-center justify-center rounded-full border border-dashed border-[var(--w-border-strong)]', className)}
      />
    );
  }
  const name = userName(user);
  if (src && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        title={name}
        width={size}
        height={size}
        onError={() => setBroken(true)}
        style={{ width: size, height: size }}
        className={cn('inline-block shrink-0 rounded-full object-cover', className)}
      />
    );
  }
  const initials = initialsOf(user);
  // Chữ tắt phải NẰM TRONG vòng tròn: ~42% đường kính, hai chữ thì nhỏ hơn chút.
  const fs = Math.max(9, Math.round(size * (initials.length > 1 ? 0.38 : 0.44)));
  return (
    <span
      role="img"
      aria-label={name}
      title={name}
      style={{ width: size, height: size, fontSize: fs, background: avatarColor(user.username || name) }}
      className={cn('inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full font-semibold leading-none tracking-[-0.01em] text-white', className)}
    >
      {size >= 14 ? initials : null}
    </span>
  );
}

// ─── Loại thẻ, ưu tiên, trạng thái ───────────────────────────────

const TYPE_ICON: Record<IssueTypeKey, typeof Bug> = {
  EPIC: Layers,
  STORY: Bookmark,
  TASK: CheckSquare,
  BUG: Bug,
  SUBTASK: SquareDashedBottom,
  TEST: FlaskConical,
  REQUIREMENT: FileText,
};

export function IssueTypeIcon({ type, size = 14 }: { type: { key: string; color: string; name: string } | undefined; size?: number }) {
  const Icon = (type && TYPE_ICON[type.key as IssueTypeKey]) || CheckSquare;
  return (
    <span
      title={type?.name}
      style={{ background: type?.color ?? '#64748b', width: size + 2, height: size + 2 }}
      className="inline-flex shrink-0 items-center justify-center rounded-[4px] text-white"
    >
      <Icon size={size - 3} strokeWidth={2.5} />
    </span>
  );
}

export const PRIORITIES = [
  { value: 1, label: 'Highest', color: 'var(--w-red)', Icon: ChevronsUp },
  { value: 2, label: 'High', color: 'var(--w-orange)', Icon: ChevronUp },
  { value: 3, label: 'Medium', color: 'var(--w-yellow)', Icon: Equal },
  { value: 4, label: 'Low', color: 'var(--w-blue)', Icon: ChevronDown },
  { value: 5, label: 'Lowest', color: 'var(--w-text-3)', Icon: ChevronsDown },
] as const;

export function priorityOf(priority: number) {
  return PRIORITIES.find((x) => x.value === priority) ?? PRIORITIES[2];
}

/** Biểu tượng ưu tiên, luôn có tooltip tên; `showLabel` hiện thêm chữ. */
export function PriorityIcon({ priority, size = 15, showLabel, className }: { priority: number; size?: number; showLabel?: boolean; className?: string }) {
  const p = priorityOf(priority);
  const Icon = p.value === 1 ? AlertOctagon : p.Icon;
  const label = `${p.label} priority`;
  return (
    <span title={label} aria-label={label} role="img" className={cn('inline-flex shrink-0 items-center gap-1.5', className)}>
      <Icon size={size} style={{ color: p.color }} strokeWidth={2.25} aria-hidden="true" />
      {showLabel && <span className="text-[13px] text-[var(--w-text)]">{p.label}</span>}
    </span>
  );
}

/** Màu chấm theo nhóm trạng thái: chưa làm xám · đang làm xanh dương · xong xanh lá. */
export const CATEGORY_DOT: Record<StatusCategory, string> = {
  TODO: 'var(--w-text-3)',
  IN_PROGRESS: 'var(--w-blue)',
  DONE: 'var(--w-green)',
};

const CATEGORY_STYLE: Record<StatusCategory, string> = {
  TODO: 'bg-[var(--w-sunken)] text-[var(--w-text-2)] border-[var(--w-border-strong)]',
  IN_PROGRESS: 'bg-[color-mix(in_srgb,var(--w-blue)_12%,transparent)] text-[var(--w-text)] border-[color-mix(in_srgb,var(--w-blue)_35%,transparent)]',
  DONE: 'bg-[color-mix(in_srgb,var(--w-green)_12%,transparent)] text-[var(--w-text)] border-[color-mix(in_srgb,var(--w-green)_35%,transparent)]',
};

/** "In review" thay vì "IN REVIEW": viết hoa chữ đầu, giữ nguyên chữ viết tắt (QA, UAT…). */
function sentenceCase(name: string): string {
  const words = name.trim().split(/\s+/);
  return words
    .map((w, i) => {
      if (w.length > 1 && w === w.toUpperCase() && /[A-Z]/.test(w) && w.length <= 3) return w; // viết tắt
      const lower = w.toLowerCase();
      return i === 0 ? lower.charAt(0).toUpperCase() + lower.slice(1) : lower;
    })
    .join(' ');
}

export function StatusBadge({ status, className }: { status: { name: string; category: StatusCategory } | undefined; className?: string }) {
  if (!status) return null;
  const text = sentenceCase(status.name);
  return (
    <span
      title={status.name}
      className={cn('inline-flex h-[22px] max-w-full items-center gap-1.5 whitespace-nowrap rounded-full border px-2 text-[12px] font-medium leading-none', CATEGORY_STYLE[status.category], className)}
    >
      <span aria-hidden="true" className="inline-block h-[7px] w-[7px] shrink-0 rounded-full align-middle" style={{ background: CATEGORY_DOT[status.category] }} />
      <span className="min-w-0 truncate">{text}</span>
    </span>
  );
}

export function LabelChip({ label }: { label: { name: string; color: string } }) {
  return (
    <span className="inline-flex h-[20px] items-center gap-1 rounded-full border border-[var(--w-border-strong)] px-2 text-[11px] text-[var(--w-text-2)]">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: label.color }} />
      {label.name}
    </span>
  );
}

// ─── Nhỏ lẻ ──────────────────────────────────────────────────────

export const Spinner = ({ size = 16 }: { size?: number }) => (
  <span style={{ width: size, height: size }} className="inline-block animate-spin rounded-full border-2 border-[var(--w-border-strong)] border-t-[var(--w-accent)]" />
);

const NOT_FOUND_RE = /not found|unavailable|no access|does not exist/i;

/**
 * Trạng thái rỗng / lỗi. Tiêu đề kiểu "… not found" mà trang không đưa nút
 * nào ⇒ tự thêm lối về (My work · Workspaces) để không bao giờ là ngõ cụt.
 * Thân trùng tiêu đề (lỗi máy chủ trả đúng "Project not found") thì thay bằng
 * câu giải thích.
 */
export function EmptyState({ title, body, action, icon }: { title: string; body?: string; action?: ReactNode; icon?: ReactNode }) {
  const notFound = NOT_FOUND_RE.test(title);
  const same = body && body.trim().replace(/[.!]$/, '').toLowerCase() === title.trim().replace(/[.!]$/, '').toLowerCase();
  const text = same ? (notFound ? 'It may have been deleted, renamed, or you no longer have access to it.' : undefined) : body;
  const act = action ?? (notFound ? (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Link href="/work?tab=my-work" className="w-btn w-btn-primary">Back to My work</Link>
      <Link href="/work?tab=workspaces" className="w-btn">Workspaces</Link>
    </div>
  ) : undefined);
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {(icon || notFound) && (
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--w-border)] bg-[var(--w-sunken)] text-[var(--w-text-3)]">
          {icon ?? <SearchX size={20} />}
        </div>
      )}
      <div className="text-[16px] font-semibold">{title}</div>
      {text && <p className="mt-1.5 max-w-[440px] text-[14px] leading-relaxed text-[var(--w-text-2)]">{text}</p>}
      {act && <div className="mt-5">{act}</div>}
    </div>
  );
}

export const Field = forwardRef<HTMLDivElement, { label: string; children: ReactNode; hint?: string }>(function Field({ label, children, hint }, ref) {
  return (
    <div ref={ref} className="mb-4">
      <label className="w-label">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[12px] text-[var(--w-text-3)]">{hint}</p>}
    </div>
  );
});

/** Đang gõ trong ô nhập thì phím tắt một chữ không được ăn mất ký tự. */
export function isTyping(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el) return false;
  return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName);
}

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const open = useCallback(() => setOn(true), []);
  const close = useCallback(() => setOn(false), []);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return { on, open, close, toggle, set: setOn };
}

export function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 45) return 'just now';
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.round(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: new Date(iso).getFullYear() === new Date().getFullYear() ? undefined : 'numeric' });
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

/**
 * Gốc web công khai để dựng link chia sẻ / URL API. Trong app desktop trang
 * chạy ở `app://cuongthai` — link đó vô dụng với người khác, nên đổi về web thật.
 */
export function publicOrigin(): string {
  if (typeof window === 'undefined') return 'https://cuongthai.com';
  const o = window.location.origin;
  return /^https?:/.test(o) ? o : 'https://cuongthai.com';
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
