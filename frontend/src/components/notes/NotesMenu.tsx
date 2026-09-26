'use client';

/**
 * Menu thả xuống dùng chung của Sổ tay (menu ⋯ mỗi dòng, menu "+ Mới").
 *
 * ─── Vì sao vẽ qua portal ───
 * Cây nằm trong một cột `overflow-y-auto`: menu vẽ tại chỗ sẽ bị CẮT ở mép
 * cột (lỗi cũ đã gặp với dropdown ở nơi khác). Nên menu được đưa ra ngoài.
 *
 * ⚠️ Nhưng KHÔNG đưa ra `document.body`: các lớp `dark:` của Sổ tay chỉ chạy
 * bên trong `.notes-theme-root` (nó mang class `dark`), ra body là menu mất
 * theme tối. Portal vào chính `.notes-theme-root` gần nhất — phần tử đó không
 * có `transform`, nên `position: fixed` vẫn tính theo khung nhìn, kể cả khi nút
 * mở nằm trong ngăn kéo di động (ngăn kéo CÓ transform).
 */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface MenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  hint?: string;
  danger?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}
export type MenuEntry = MenuItem | 'divider' | { heading: string };

export function NotesMenu({
  anchor, items, onClose, align = 'start', width = 232,
}: {
  anchor: HTMLElement;
  items: MenuEntry[];
  onClose: () => void;
  align?: 'start' | 'end';
  width?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [active, setActive] = useState(-1);
  const host = (anchor.closest('.notes-theme-root') as HTMLElement | null) ?? document.body;

  useLayoutEffect(() => {
    const r = anchor.getBoundingClientRect();
    const h = ref.current?.offsetHeight ?? 240;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let left = align === 'end' ? r.right - width : r.left;
    left = Math.max(8, Math.min(left, vw - width - 8));
    let top = r.bottom + 4;
    if (top + h > vh - 8) top = Math.max(8, r.top - h - 4);
    setPos({ top, left });
  }, [anchor, align, width]);

  const selectable = items
    .map((it, i) => ({ it, i }))
    .filter((x): x is { it: MenuItem; i: number } => typeof x.it === 'object' && 'key' in x.it && !x.it.disabled);

  useEffect(() => {
    const onDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || anchor.contains(t)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.isComposing) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose(); anchor.focus(); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((cur) => {
          const idx = selectable.findIndex((x) => x.i === cur);
          const n = selectable.length;
          if (n === 0) return -1;
          const next = e.key === 'ArrowDown' ? (idx + 1) % n : (idx - 1 + n) % n;
          return selectable[next]!.i;
        });
      }
      if (e.key === 'Enter' && active >= 0) {
        const it = items[active];
        if (it && typeof it === 'object' && 'key' in it && !it.disabled) { e.preventDefault(); onClose(); it.onSelect?.(); }
      }
    };
    const onScroll = (e: Event) => { if (!ref.current?.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', onDown, true);
    document.addEventListener('touchstart', onDown, true);
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onClose);
    return () => {
      document.removeEventListener('mousedown', onDown, true);
      document.removeEventListener('touchstart', onDown, true);
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onClose);
    };
  }, [anchor, onClose, items, active, selectable]);

  return createPortal(
    <div
      ref={ref}
      role="menu"
      style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999, width }}
      className="fixed z-[95] overflow-hidden rounded-lg border border-black/[0.08] bg-[var(--notes-surface,#ffffff)] p-1 text-[13px] text-[var(--notes-text,#1e293b)] shadow-[0_10px_38px_-10px_rgba(0,0,0,0.35),0_10px_20px_-15px_rgba(0,0,0,0.2)] dark:border-white/[0.1] dark:bg-[#161b23]"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {items.map((it, i) => {
        if (it === 'divider') return <div key={`d${i}`} className="my-1 h-px bg-black/[0.07] dark:bg-white/[0.07]" />;
        if ('heading' in it) {
          return <div key={`h${i}`} className="truncate px-2 pb-1 pt-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--notes-text-muted,#64748b)]">{it.heading}</div>;
        }
        return (
          <button
            key={it.key}
            type="button"
            role="menuitem"
            disabled={it.disabled}
            onMouseEnter={() => setActive(i)}
            onClick={() => { onClose(); it.onSelect?.(); }}
            className={`flex min-h-[32px] w-full items-center gap-2 rounded-md px-2 py-1.5 text-left disabled:cursor-not-allowed disabled:opacity-45 ${
              active === i ? 'bg-black/[0.05] dark:bg-white/[0.07]' : ''
            } ${it.danger ? 'text-rose-600 dark:text-rose-400' : ''}`}
          >
            {it.icon && <span className="flex h-4 w-4 shrink-0 items-center justify-center opacity-80">{it.icon}</span>}
            <span className="min-w-0 flex-1 truncate">{it.label}</span>
            {it.hint && <span className="shrink-0 truncate text-[11px] text-[var(--notes-text-muted,#64748b)]">{it.hint}</span>}
          </button>
        );
      })}
    </div>,
    host,
  );
}
