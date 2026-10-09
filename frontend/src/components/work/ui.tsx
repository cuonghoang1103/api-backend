'use client';

/**
 * CT Work — mảnh giao diện dùng chung. Repo không có shadcn/Radix nên
 * popover/dialog tự viết, gọn, đủ bàn phím (Esc, mũi tên, Enter).
 *
 * Mọi lớp nổi render vào #work-portal (nằm TRONG .work-root) chứ không vào
 * document.body — biến màu --w-* chỉ tồn tại bên trong .work-root.
 */

import {
  forwardRef, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState,
  type ReactNode, type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  AlertOctagon, Bookmark, Bot, Bug, CheckSquare, ChevronsUp, ChevronUp, ChevronDown, ChevronsDown, Equal,
  FileText, FlaskConical, Inbox, Layers, SquareDashedBottom, X, Check, Search, SearchX,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, type IssueTypeKey, type StatusCategory, type WorkUser } from '@/lib/work-api';
import { agentTooltip, useAgentDirectory } from './agents/directory';
import { wt, wfmt } from './i18n';
import { statusName, typeName } from './i18n/names';

// ─── Portal ──────────────────────────────────────────────────────

export function WorkPortal({ children }: { children: ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => setEl(document.getElementById('work-portal')), []);
  return el ? createPortal(children, el) : null;
}

/**
 * KHUNG mà phần tử `position: fixed` trong #work-portal thật sự bám vào.
 *
 * Trên web là cửa sổ. Trong app desktop, CT Work nằm trong vùng nội dung (bên
 * phải thanh bên 218px, dưới thanh tiêu đề 44px) và vỏ của nó đặt `contain:
 * layout paint` ⇒ `fixed` tính từ góc VỎ chứ không từ góc cửa sổ. Lấy toạ độ
 * `getBoundingClientRect()` (theo cửa sổ) đặt thẳng vào thì mọi popover — kể
 * cả menu AI — lệch đúng 218px/44px và bị cắt ở mép phải (04/10/2026). Vỏ nào
 * làm khối chứa thì gắn `data-khung-fixed`; không có thì là cửa sổ như cũ.
 */
export function khungFixed(): { left: number; top: number; width: number; height: number } {
  const k = typeof document === 'undefined' ? null
    : document.getElementById('work-portal')?.closest<HTMLElement>('[data-khung-fixed]');
  if (!k) return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
  const r = k.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
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
      const r = anchorRef.current?.getBoundingClientRect();
      if (!r) return;
      // Đổi toạ độ cửa sổ → toạ độ của khung chứa `fixed` (xem `khungFixed`).
      const k = khungFixed();
      const a = { top: r.top - k.top, bottom: r.bottom - k.top, left: r.left - k.left, right: r.right - k.left };
      const h = ref.current?.offsetHeight ?? 280;
      const below = a.bottom + 4;
      const top = below + h > k.height - 8 && a.top - h - 4 > 8 ? a.top - h - 4 : below;
      let left = align === 'end' ? a.right - width : a.left;
      left = Math.max(8, Math.min(left, k.width - width - 8));
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
  /** Tiêu đề nhóm (vd "People" / "AI agents") — đổi nhóm giữa hai dòng liền nhau ⇒ vẽ tiêu đề. */
  group?: string;
  /** Hiện nhưng không chọn được (vd agent đang tạm dừng). */
  disabled?: boolean;
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

export function PickerList<T>({ options, selected, onPick, multi, placeholder = wt('common.searchPlaceholder'), empty = wt('common.noResults'), onCreate }: PickerProps<T>) {
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
    if (i < filtered.length) { if (!filtered[i].disabled) onPick(filtered[i].value); }
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
          const head = o.group && o.group !== filtered[i - 1]?.group ? o.group : null;
          return (
            <div key={String(o.value)} role="none">
            {head && <div role="presentation" className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--w-text-3)] first:pt-1">{head}</div>}
            <button
              type="button"
              disabled={o.disabled}
              aria-disabled={o.disabled || undefined}
              onMouseEnter={() => setHi(i)}
              onClick={() => choose(i)}
              className={cn(
                'flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px]',
                i === hi && !o.disabled ? 'bg-[var(--w-hover)]' : '',
                o.disabled && 'cursor-not-allowed opacity-50',
              )}
            >
              {o.icon && <span className="flex w-4 shrink-0 justify-center">{o.icon}</span>}
              <span className="min-w-0 flex-1 truncate">{o.label}</span>
              {o.hint && <span className="shrink-0 text-[11px] text-[var(--w-text-3)]">{o.hint}</span>}
              {(multi || isSel) && (
                <Check size={13} className={cn('shrink-0', isSel ? 'text-[var(--w-accent-text)]' : 'opacity-0')} />
              )}
            </button>
            </div>
          );
        })}
        {canCreate && (
          <button
            type="button"
            onMouseEnter={() => setHi(filtered.length)}
            onClick={() => choose(filtered.length)}
            className={cn('flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px]', hi === filtered.length ? 'bg-[var(--w-hover)]' : '')}
          >
            <span className="text-[var(--w-text-3)]">{wt('common.createQuoted')}</span>
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
              {dismissible && <button type="button" onClick={onClose} className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={wt('common.close')}><X size={15} /></button>}
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
// UX-A P0-3: mọi màu ≥ 4.5:1 với chữ trắng (trước đây 4 màu xanh lá/cam/xanh ngọc/vàng chỉ đạt 4.0–4.2).
const AVATAR_COLORS = ['#5e6ad2', '#2a8159', '#a9561f', '#b83f6f', '#2a6fd1', '#8a4fd1', '#0d7a76', '#8f6212', '#c9423e', '#56627a'];

function relLum(hex: string): number | null {
  const m = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i.exec(hex.trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  const ch = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

/**
 * UX-A P0-3: màu tín hiệu (`var(--w-green)`…) dùng làm màu CHỮ ⇒ đổi sang token chữ
 * `var(--w-green-text)` (≥ 4.5:1). Màu khác (hex, --w-text-*) trả nguyên.
 */
export function signalText(color: string): string {
  return color.replace(/^var\(--w-(green|yellow|orange|red|blue|epic)\)$/, 'var(--w-$1-text)');
}

/**
 * Nền + chữ cho một ô màu đậm có chữ (mã dự án). Chữ trắng nếu đạt 4.5:1; không thì
 * chữ gần đen nếu đạt; không thì làm nền tối đi 30% (màu do người dùng chọn có thể
 * là tông giữa — không trắng không đen nào đạt). Màu không phải hex ⇒ giữ nguyên.
 */
export function readableMark(bg: string): { background: string; color: string } {
  const L = relLum(bg);
  if (L === null) return { background: bg, color: '#ffffff' };
  if (1.05 / (L + 0.05) >= 4.5) return { background: bg, color: '#ffffff' };
  if ((L + 0.05) / (0.0105 + 0.05) >= 4.5) return { background: bg, color: '#1a1a17' };
  return { background: `color-mix(in srgb, ${bg} 70%, #000)`, color: '#ffffff' };
}

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

export function UserAvatar({ user, size = 22, className }: { user: Pick<WorkUser, 'username' | 'fullName' | 'displayName' | 'avatarUrl'> & { id?: number; kind?: WorkUser['kind'] } | null | undefined; size?: number; className?: string }) {
  const [broken, setBroken] = useState(false);
  const src = user?.avatarUrl;
  useEffect(() => setBroken(false), [src]);
  // CTW-28: AI agent ⇒ góc vuông bo + huy hiệu robot + tooltip "AI agent · model · owner" (một chỗ, lan khắp nơi).
  const isAgent = user?.kind === 'AGENT';
  const info = useAgentDirectory((s) => (isAgent && user?.id ? s.byUser[user.id] : undefined));
  if (!user) {
    return (
      <span
        role="img"
        title={wt('common.unassigned')}
        aria-label={wt('common.unassigned')}
        style={{ width: size, height: size }}
        className={cn('inline-flex shrink-0 items-center justify-center rounded-full border border-dashed border-[var(--w-border-strong)]', className)}
      />
    );
  }
  const name = userName(user);
  const title = isAgent ? agentTooltip(name, info) : name;
  const shape = isAgent ? 'rounded-[30%]' : 'rounded-full';
  let face: ReactNode;
  if (src && !broken) {
    face = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        title={title}
        width={size}
        height={size}
        onError={() => setBroken(true)}
        style={{ width: size, height: size }}
        className={cn('inline-block shrink-0 object-cover', shape, !isAgent && className, isAgent && info?.status === 'PAUSED' && 'opacity-60')}
      />
    );
  } else {
    const initials = initialsOf(user);
    // Chữ tắt phải NẰM TRONG vòng tròn: ~42% đường kính, hai chữ thì nhỏ hơn chút.
    const fs = Math.max(9, Math.round(size * (initials.length > 1 ? 0.38 : 0.44)));
    face = (
      <span
        role="img"
        aria-label={isAgent ? `${name} (${wt('jql.aiAgent')})` : name}
        title={title}
        style={{ width: size, height: size, fontSize: fs, background: avatarColor(user.username || name) }}
        className={cn('inline-flex shrink-0 select-none items-center justify-center overflow-hidden font-semibold leading-none tracking-[-0.01em] text-white', shape, !isAgent && className, isAgent && info?.status === 'PAUSED' && 'opacity-60')}
      >
        {size >= 14 ? initials : null}
      </span>
    );
  }
  if (!isAgent) return face;
  // Huy hiệu ~½ avatar nhỏ, trần 18px ở avatar lớn (không che chữ tắt). Khung cố định cỡ — cha flex/stretch không kéo giãn.
  const b = Math.min(18, Math.max(9, Math.round(size * (size >= 32 ? 0.36 : 0.52))));
  return (
    <span className={cn('relative inline-flex shrink-0', className)} style={{ width: size, height: size }} data-agent="true" title={title}>
      {face}
      {size >= 14 && (
        <span
          aria-hidden
          className="absolute -bottom-[2px] -right-[3px] inline-flex items-center justify-center rounded-full bg-[var(--w-accent)] text-white ring-[1.5px] ring-[var(--w-raised)]"
          style={{ width: b, height: b }}
        >
          <Bot size={Math.max(7, b - 3)} strokeWidth={2.4} />
        </span>
      )}
    </span>
  );
}

/** Nhận diện dự án (CTW-23): ảnh > emoji > chữ tắt; `color` thay màu băm theo khoá. */
export interface ProjectBrand { avatarUrl?: string | null; iconEmoji?: string | null; color?: string | null }

/** Ô chữ tắt màu cố định cho dự án (theo khoá dự án) — sidebar, thanh trên, lưới dự án. CTW-23: ảnh/emoji/màu riêng nếu có. */
export function ProjectMark({ k, size = 20, letters = 1, brand }: { k: string; size?: number; letters?: 1 | 2; brand?: ProjectBrand | null }) {
  const [broken, setBroken] = useState(false);
  if (brand?.avatarUrl && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={brand.avatarUrl} alt="" aria-hidden="true" width={size} height={size} onError={() => setBroken(true)}
        style={{ width: size, height: size }}
        className="inline-block shrink-0 rounded-[5px] object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
      />
    );
  }
  const bg = brand?.color || avatarColor(k);
  if (brand?.iconEmoji) {
    return (
      <span
        aria-hidden="true"
        style={{ background: `color-mix(in srgb, ${bg} 22%, transparent)`, width: size, height: size, fontSize: Math.round(size * 0.62) }}
        className="inline-flex shrink-0 items-center justify-center rounded-[5px] leading-none shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
      >
        {brand.iconEmoji}
      </span>
    );
  }
  const tone = readableMark(bg);
  return (
    <span
      aria-hidden="true"
      style={{ ...tone, width: size, height: size, fontSize: Math.round(size * (letters === 2 ? 0.38 : 0.52)) }}
      className="inline-flex shrink-0 items-center justify-center rounded-[5px] font-bold leading-none tracking-[-0.02em] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
    >
      {k.slice(0, letters)}
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
      title={type ? typeName(type.name) : undefined}
      style={{ background: type?.color ?? 'var(--w-chart-8)', width: size + 2, height: size + 2 }}
      className="inline-flex shrink-0 items-center justify-center rounded-[4px] text-white"
    >
      <Icon size={size - 3} strokeWidth={2.5} />
    </span>
  );
}

export const PRIORITIES = [
  // `label` là getter: hằng số cấp module mà tính chữ một lần lúc import thì kẹt ở ngôn ngữ đầu tiên.
  { value: 1, get label() { return wt('status.prioHighest'); }, color: 'var(--w-prio-1)', Icon: ChevronsUp },
  { value: 2, get label() { return wt('status.prioHigh'); }, color: 'var(--w-prio-2)', Icon: ChevronUp },
  { value: 3, get label() { return wt('status.prioMedium'); }, color: 'var(--w-prio-3)', Icon: Equal },
  { value: 4, get label() { return wt('status.prioLow'); }, color: 'var(--w-prio-4)', Icon: ChevronDown },
  { value: 5, get label() { return wt('status.prioLowest'); }, color: 'var(--w-prio-5)', Icon: ChevronsDown },
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

/** Màu theo nhóm trạng thái: chưa làm xám · đang làm xanh dương · xong xanh lá. */
export const CATEGORY_DOT: Record<StatusCategory, string> = {
  TODO: 'var(--w-status-todo)',
  IN_PROGRESS: 'var(--w-status-progress)',
  DONE: 'var(--w-status-done)',
};

/**
 * Glyph trạng thái — hình + màu (không chỉ màu, cho người mù màu):
 * vòng rỗng = chưa làm · vòng nửa đặc = đang làm · vòng đặc có dấu ✓ = xong.
 */
export function StatusGlyph({ category, size = 12, className }: { category: StatusCategory; size?: number; className?: string }) {
  const c = CATEGORY_DOT[category];
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true" className={cn('shrink-0', className)}>
      {category === 'DONE' ? (
        <>
          <circle cx="7" cy="7" r="6.25" fill={c} />
          <path d="M4.3 7.2 6.2 9l3.5-3.8" fill="none" stroke="var(--w-panel)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <circle cx="7" cy="7" r="5.75" fill="none" stroke={c} strokeWidth="1.6" />
          {category === 'IN_PROGRESS' && <path d="M7 3.2a3.8 3.8 0 0 1 0 7.6Z" fill={c} />}
        </>
      )}
    </svg>
  );
}

const CATEGORY_STYLE: Record<StatusCategory, string> = {
  TODO: 'bg-[var(--w-sunken)] text-[var(--w-text-2)] border-[var(--w-border)]',
  IN_PROGRESS: 'bg-[color-mix(in_srgb,var(--w-blue)_11%,transparent)] text-[var(--w-text)] border-[color-mix(in_srgb,var(--w-blue)_28%,transparent)]',
  DONE: 'bg-[color-mix(in_srgb,var(--w-green)_11%,transparent)] text-[var(--w-text)] border-[color-mix(in_srgb,var(--w-green)_28%,transparent)]',
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
  const shown = statusName(status.name);
  const text = shown === status.name ? sentenceCase(status.name) : shown;
  return (
    <span
      title={status.name}
      className={cn('inline-flex h-[22px] max-w-full items-center gap-1.5 whitespace-nowrap rounded-[6px] border px-1.5 pr-2 text-[12px] font-medium leading-none', CATEGORY_STYLE[status.category], className)}
    >
      <StatusGlyph category={status.category} size={12} />
      <span className="min-w-0 truncate">{text}</span>
    </span>
  );
}

export function LabelChip({ label }: { label: { name: string; color: string } }) {
  return (
    <span className="inline-flex h-[20px] max-w-[160px] items-center gap-1.5 rounded-[4px] bg-[var(--w-sunken)] px-1.5 text-[11px] font-medium text-[var(--w-text-2)] shadow-[inset_0_0_0_1px_var(--w-border)]">
      <span className="h-2 w-2 shrink-0 rounded-[2px]" style={{ background: label.color }} />
      <span className="truncate">{label.name}</span>
    </span>
  );
}

// ─── Nhỏ lẻ ──────────────────────────────────────────────────────

export const Spinner = ({ size = 16 }: { size?: number }) => (
  <span role="status" aria-label={wt('common.loading')} style={{ width: size, height: size }} className="inline-block animate-spin rounded-full border-2 border-[var(--w-border-strong)] border-t-[var(--w-accent)]" />
);

/**
 * Trạng thái đang tải của cả một vùng: khung chờ (skeleton) có hình dạng
 * "một thanh tiêu đề + vài hàng" thay cho vòng quay trơ trọi giữa màn hình.
 * Dùng chung cho mọi trang /work để chỗ nào cũng tải trông như nhau.
 */
export function PageLoading({ rows = 6, label = wt('common.loading') }: { rows?: number; label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex h-full min-h-[200px] w-full flex-col gap-3 overflow-hidden p-5 md:p-6">
      <span className="sr-only">{label}</span>
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="w-skel h-6 w-6 !rounded-full" />
        <span className="w-skel h-4 w-[38%] max-w-[260px]" />
        <span className="ml-auto w-skel h-7 w-20" />
      </div>
      <div className="mt-2 space-y-2.5" aria-hidden="true">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-skel h-3.5 w-3.5 shrink-0 !rounded-[4px]" />
            <span className="w-skel h-3.5 shrink-0" style={{ width: 52 }} />
            <span className="w-skel h-3.5" style={{ width: `${[62, 48, 71, 55, 40, 66, 58, 45][i % 8]}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

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
  const text = same ? (notFound ? wt('common.notFoundBody') : undefined) : body;
  const act = action ?? (notFound ? (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Link href="/work?tab=my-work" className="w-btn w-btn-primary">{wt('common.backToMyWork')}</Link>
      <Link href="/work?tab=workspaces" className="w-btn">{wt('common.workspaces')}</Link>
    </div>
  ) : undefined);
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center md:py-20">
      <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-[12px] border border-[var(--w-border)] bg-[var(--w-sunken)] text-[var(--w-text-3)] shadow-[var(--w-shadow-card)]">
        {icon ?? (notFound ? <SearchX size={20} /> : <Inbox size={20} />)}
      </div>
      <div className="text-[16px] font-semibold tracking-[-0.01em]">{title}</div>
      {text && <p className="mt-1.5 max-w-[440px] text-[14px] leading-relaxed text-[var(--w-text-2)]">{text}</p>}
      {act && <div className="mt-5">{act}</div>}
    </div>
  );
}

export const Field = forwardRef<HTMLDivElement, { label: string; children: ReactNode; hint?: string }>(function Field({ label, children, hint }, ref) {
  // UX-A ARIA: nhãn trước đây không gắn với ô (axe "label" ở 8 trang). Gắn ô nhập ĐẦU TIÊN
  // chưa có tên bằng aria-labelledby — một chỗ cho 260+ nơi dùng Field.
  const labelId = useId();
  const boxRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = boxRef.current?.querySelector<HTMLElement>('input:not([type=hidden]), select, textarea');
    if (el && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.closest('label')) {
      el.setAttribute('aria-labelledby', labelId);
    }
  });
  return (
    <div
      ref={(node) => {
        boxRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className="mb-4"
    >
      <label className="w-label" id={labelId}>{label}</label>
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

/** Theo ngôn ngữ CT Work: "5m ago" / "5 phút trước" (components/work/i18n/core.ts). */
export function relativeTime(iso: string): string {
  return wfmt.relative(iso);
}

/** "Oct 9, 2026" / "9 thg 10, 2026" — theo UTC như trước (ngày lịch không lệch múi giờ). */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return wfmt.date(iso, { timeZone: 'UTC' });
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
