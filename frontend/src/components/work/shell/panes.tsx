'use client';

/**
 * UX-E (09/10/2026) — "không gian đọc/viết rộng, panel thu gọn được".
 *
 * Người dùng chụp trang Docs trên iPad (1000–1366px): bốn cột cùng lúc (sidebar dự án,
 * cây trang, nội dung, Details) ⇒ nội dung còn ~400px, không có nút nào để ẩn panel.
 * File này là bộ khung dùng chung cho MỌI trang có panel phụ:
 *
 *   · `usePanes(scope, boxRef, { left, right })` — mỗi panel có một CHẾ ĐỘ:
 *       inline  = cột cạnh nội dung (đủ chỗ, người dùng chưa ẩn)
 *       strip   = người dùng đã ẩn ⇒ còn thanh mảnh có nút mở lại (chỉ panel trái)
 *       hidden  = người dùng đã ẩn (panel phải — mở lại bằng nút "Details")
 *       drawer  = KHÔNG đủ chỗ (hoặc đang Focus) ⇒ ngăn trượt, mở bằng nút / phím tắt
 *     "Đủ chỗ" đo bằng ResizeObserver trên khung của trang (KHÔNG đoán theo
 *     breakpoint): app desktop có thanh bên riêng, sidebar CT Work có thể đang mở
 *     hay thu gọn — cùng một bề ngang cửa sổ mà chỗ thật khác nhau cả 200px.
 *   · Focus / Full width: ẩn sidebar dự án (WorkShell đọc `focus`) + mọi panel
 *     (chuyển sang ngăn trượt). Esc hoặc nút "Exit focus" để thoát; rời trang ⇒ tự thoát.
 *   · Nhớ lựa chọn ẩn/hiện theo người dùng (localStorage, bọc try/catch — cửa sổ
 *     riêng tư có thể ném lỗi). Focus KHÔNG nhớ qua lần tải trang (tránh "sidebar
 *     biến mất không rõ vì sao" khi mở lại app).
 *   · Kiểm tra chính tả (spellcheck) của editor: bật/tắt, nhớ.
 *
 * Mọi hook gọi ở đầu component, trước mọi `return` sớm (rules-of-hooks).
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { create } from 'zustand';
import { Maximize2, Minimize2, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkPortal, isTyping, khungFixed } from '../ui';

// ─── Lựa chọn đã lưu ─────────────────────────────────────────────

const KEY = 'ctwork.layout.v1';

interface Saved {
  /** `${scope}.left|right` → true = người dùng đã ẩn panel đó. */
  hidden: Record<string, boolean>;
  /** Kiểm tra chính tả khi đang soạn. */
  spell: boolean;
  /** Ngăn Ask AI mở rộng (720px) thay vì 440px. */
  aiWide: boolean;
}

function readSaved(): Saved {
  const base: Saved = { hidden: {}, spell: true, aiWide: false };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return base;
    const v = JSON.parse(raw) as Partial<Saved>;
    return {
      hidden: v.hidden && typeof v.hidden === 'object' ? v.hidden : {},
      spell: v.spell !== false,
      aiWide: v.aiWide === true,
    };
  } catch {
    return base;
  }
}

function writeSaved(s: Saved) {
  try { window.localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* riêng tư / đầy — bỏ qua, chỉ là tiện ích */ }
}

interface LayoutState extends Saved {
  loaded: boolean;
  /** `${scope}.${side}` đang mở dạng ngăn trượt (không nhớ). */
  drawer: string | null;
  /** Trang đang ở chế độ Focus (scope) + đường dẫn gốc lúc bật (rời ra ngoài ⇒ thoát). */
  focus: string | null;
  focusBase: string | null;
  load: () => void;
  setHidden: (id: string, v: boolean) => void;
  setSpell: (v: boolean) => void;
  setAiWide: (v: boolean) => void;
  setDrawer: (id: string | null) => void;
  enterFocus: (scope: string, base: string) => void;
  exitFocus: () => void;
}

export const useLayoutPrefs = create<LayoutState>((set, get) => {
  const save = () => { const s = get(); writeSaved({ hidden: s.hidden, spell: s.spell, aiWide: s.aiWide }); };
  return {
    hidden: {},
    spell: true,
    aiWide: false,
    loaded: false,
    drawer: null,
    focus: null,
    focusBase: null,
    load: () => { if (!get().loaded) set({ ...readSaved(), loaded: true }); },
    setHidden: (id, v) => { get().load(); set((s) => ({ hidden: { ...s.hidden, [id]: v } })); save(); },
    setSpell: (v) => { get().load(); set({ spell: v }); save(); },
    setAiWide: (v) => { get().load(); set({ aiWide: v }); save(); },
    setDrawer: (id) => set({ drawer: id }),
    enterFocus: (scope, base) => set({ focus: scope, focusBase: base, drawer: null }),
    exitFocus: () => set({ focus: null, focusBase: null, drawer: null }),
  };
});

/** Đoạn đường dẫn tới hết "trang" của dự án: /work/<ws>/<KEY>/<view> — rời khỏi đây ⇒ thoát Focus. */
export function focusBaseOf(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  return `/${parts.slice(0, Math.min(parts.length, 4)).join('/')}`;
}

// ─── Đo chỗ ──────────────────────────────────────────────────────

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Bề ngang của phần tử (ResizeObserver) + bề ngang KHUNG (cửa sổ web / vùng CT Work trong app desktop). */
export function useBoxWidth(el: HTMLElement | null): { box: number | null; frame: number } {
  const [w, setW] = useState<{ box: number | null; frame: number }>({ box: null, frame: 1440 });
  useIsoLayoutEffect(() => {
    const measure = () => {
      const frame = Math.round(khungFixed().width);
      const box = el ? Math.round(el.getBoundingClientRect().width) : null;
      setW((p) => (p.box === box && p.frame === frame ? p : { box, frame }));
    };
    measure();
    window.addEventListener('resize', measure);
    const ro = el && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (el && ro) ro.observe(el);
    return () => { window.removeEventListener('resize', measure); ro?.disconnect(); };
  }, [el]);
  return w;
}

// ─── Panel ───────────────────────────────────────────────────────

export type PaneMode = 'inline' | 'strip' | 'hidden' | 'drawer';

export interface PaneSpec {
  /** Bề ngang cột khi nằm cạnh nội dung. */
  width: number;
  /** Khung hẹp hơn mức này ⇒ luôn là ngăn trượt (iPad dọc, điện thoại). */
  minFrame?: number;
  /** Ẩn thì còn thanh mảnh (panel trái) hay biến hẳn (panel phải, mở lại bằng nút). */
  strip?: boolean;
  /** Không bao giờ thành ngăn trượt (vd danh sách hàm 5.1 xếp chồng ở điện thoại). */
  neverDrawer?: boolean;
  /** Chỗ tối thiểu còn lại cho nội dung khi panel này nằm cạnh (mặc định = `minMain` chung). */
  minMain?: number;
}

export interface PaneState {
  id: string;
  mode: PaneMode;
  /** Đang thấy được (inline, hoặc ngăn trượt đang mở). */
  visible: boolean;
  drawerOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export interface PanesOptions {
  left?: PaneSpec;
  right?: PaneSpec;
  /** Chỗ tối thiểu còn lại cho nội dung chính (px, gồm cả lề của nó). */
  minMain?: number;
  /** Trang có hỗ trợ Focus / Full width. */
  focusable?: boolean;
}

const STRIP_W = 40;

/**
 * `ref` (callback) gắn vào KHUNG chứa cả panel lẫn nội dung — phần tử có thể chỉ xuất hiện
 * sau khi dữ liệu tải xong, nên dùng callback ref (đổi phần tử ⇒ đo lại).
 */
export function usePanes(scope: string, opts: PanesOptions) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const ref = useCallback((node: HTMLElement | null) => setEl(node), []);
  const { box, frame } = useBoxWidth(el);
  const hidden = useLayoutPrefs((s) => s.hidden);
  const drawer = useLayoutPrefs((s) => s.drawer);
  const focusScope = useLayoutPrefs((s) => s.focus);
  const focus = !!opts.focusable && focusScope === scope;
  useEffect(() => { useLayoutPrefs.getState().load(); }, []);

  // Rời trang ⇒ đóng ngăn trượt của nó. Focus thì KHÔNG thoát ở đây: đi từ trang tài liệu này
  // sang trang khác (cùng /docs) vẫn giữ Focus — WorkShell thoát khi đường dẫn rời `focusBase`.
  useEffect(() => () => {
    const st = useLayoutPrefs.getState();
    if (st.drawer?.startsWith(`${scope}.`)) st.setDrawer(null);
  }, [scope]);

  const minMain = opts.minMain ?? 600;
  // Chưa đo (lần vẽ đầu) ⇒ ước theo khung trừ sidebar mặc định.
  const width = box ?? Math.max(0, frame - 260);

  const leftId = `${scope}.left`;
  const rightId = `${scope}.right`;

  const modeOf = (spec: PaneSpec | undefined, id: string, room: number): PaneMode => {
    if (!spec) return 'hidden';
    if (focus && !spec.neverDrawer) return 'drawer';
    const fits = spec.neverDrawer || (frame >= (spec.minFrame ?? 0) && room - spec.width >= (spec.minMain ?? minMain));
    if (!fits) return 'drawer';
    if (hidden[id]) return spec.strip ? 'strip' : 'hidden';
    return 'inline';
  };

  const leftMode = modeOf(opts.left, leftId, width);
  const leftUsed = leftMode === 'inline' ? opts.left!.width : leftMode === 'strip' ? STRIP_W : 0;
  const rightMode = modeOf(opts.right, rightId, width - leftUsed);

  const make = (id: string, mode: PaneMode): PaneState => {
    const drawerOpen = mode === 'drawer' && drawer === id;
    return {
      id,
      mode,
      drawerOpen,
      visible: mode === 'inline' || drawerOpen,
      toggle: () => {
        const st = useLayoutPrefs.getState();
        if (mode === 'drawer') st.setDrawer(st.drawer === id ? null : id);
        else st.setHidden(id, mode === 'inline');
      },
      close: () => {
        const st = useLayoutPrefs.getState();
        if (mode === 'drawer') { if (st.drawer === id) st.setDrawer(null); }
        else if (mode === 'inline') st.setHidden(id, true);
      },
    };
  };

  const left = make(leftId, leftMode);
  const right = make(rightId, rightMode);

  return { ref, width, frame, left, right, focus };
}

/** Bật/tắt Focus cho trang `scope`. `base` = focusBaseOf(pathname) lúc bật. */
export function toggleFocus(scope: string, base: string) {
  const st = useLayoutPrefs.getState();
  if (st.focus === scope) st.exitFocus();
  else st.enterFocus(scope, base);
}

/**
 * Phím tắt đọc/viết của trang: `[` panel trái · `]` panel phải · `F` Focus · Esc thoát Focus / đóng ngăn.
 * Không chạy khi đang gõ (ô nhập, editor) hoặc khi có hộp thoại modal đang mở
 * (RunPanel dùng `[`/`]` cho test trước/sau; Present dùng `F`).
 */
export function usePaneKeys(handlers: { left?: () => void; right?: () => void; focus?: () => void; escape?: () => boolean }) {
  const ref = useRef(handlers);
  ref.current = handlers;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const h = ref.current;
      const modal = !!document.querySelector('[role="dialog"][aria-modal="true"]:not([data-pane-drawer])');
      if (e.key === 'Escape') {
        // Esc trong ô nhập/textarea để ô đó tự xử lý; trong editor (contenteditable) vẫn thoát Focus.
        const t = e.target as HTMLElement | null;
        if (modal || (t && ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))) return;
        if (h.escape?.()) e.preventDefault();
        return;
      }
      if (isTyping(e.target) || modal) return;
      if (e.key === '[' && h.left) { e.preventDefault(); h.left(); }
      else if (e.key === ']' && h.right) { e.preventDefault(); h.right(); }
      else if ((e.key === 'f' || e.key === 'F') && !e.shiftKey && h.focus) { e.preventDefault(); h.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

/** Esc mặc định của một trang có panel: đóng ngăn trượt đang mở, nếu không thì thoát Focus. */
export function escapePanes(scope: string): boolean {
  const st = useLayoutPrefs.getState();
  if (st.drawer?.startsWith(`${scope}.`)) { st.setDrawer(null); return true; }
  if (st.focus === scope) { st.exitFocus(); return true; }
  return false;
}

// ─── Giao diện ───────────────────────────────────────────────────

/** Nút bật/tắt một panel (đặt ở header hoặc thanh công cụ của trang). */
export function PaneToggle({ pane, side, label, shortcut, className, showLabel = true }: {
  pane: PaneState; side: 'left' | 'right'; label: string; shortcut?: string; className?: string; showLabel?: boolean;
}) {
  const Icon = side === 'left' ? (pane.visible ? PanelLeftClose : PanelLeftOpen) : (pane.visible ? PanelRightClose : PanelRightOpen);
  const verb = pane.visible ? 'Hide' : 'Show';
  const tip = `${verb} ${label.toLowerCase()}${shortcut ? ` (${shortcut})` : ''}`;
  return (
    <button
      type="button"
      className={cn('w-btn w-btn-sm', !showLabel && 'w-btn-icon', pane.visible && pane.mode === 'drawer' && 'w-btn-on', className)}
      onClick={pane.toggle}
      aria-pressed={pane.visible}
      aria-label={tip}
      title={tip}
      data-pane-toggle={pane.id}
    >
      <Icon size={14} />
      {showLabel && <span className="max-sm:hidden">{label}</span>}
    </button>
  );
}

/** Nút Focus / Full width (đổi thành "Exit focus" khi đang bật). */
export function FocusToggle({ on, onToggle, className, compact }: { on: boolean; onToggle: () => void; className?: string; compact?: boolean }) {
  const tip = on ? 'Exit focus (Esc)' : 'Focus — full width, hide sidebars (F)';
  return (
    <button
      type="button"
      className={cn('w-btn w-btn-sm', compact && 'w-btn-icon', on && 'w-btn-on', className)}
      onClick={onToggle}
      aria-pressed={on}
      aria-label={tip}
      title={tip}
      data-testid="focus-toggle"
    >
      {on ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
      {!compact && <span className="max-md:hidden">{on ? 'Exit focus' : 'Focus'}</span>}
    </button>
  );
}

/** Thanh mảnh còn lại khi người dùng ẩn panel trái — một nút mở lại. */
export function PaneStrip({ label, shortcut, onOpen, className }: { label: string; shortcut?: string; onOpen: () => void; className?: string }) {
  const tip = `Show ${label.toLowerCase()}${shortcut ? ` (${shortcut})` : ''}`;
  return (
    <div className={cn('flex shrink-0 flex-col items-center border-r border-[var(--w-border)] bg-[var(--w-bg)] pt-2 max-md:h-10 max-md:w-full max-md:flex-row max-md:border-b max-md:border-r-0 max-md:px-2 max-md:pt-0 md:w-10', className)} data-pane-strip>
      <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm md:!w-8" onClick={onOpen} aria-label={tip} title={tip}>
        <PanelLeftOpen size={15} />
      </button>
      <span className="text-[12.5px] text-[var(--w-text-2)] md:hidden">{label}</span>
    </div>
  );
}

/**
 * Ngăn trượt (khi không đủ chỗ cho cột). Portal vào #work-portal ⇒ `fixed` bám đúng
 * khung CT Work cả trong app desktop. Esc / bấm nền / nút X để đóng; trả tiêu điểm về
 * nút đã mở nó.
 */
export function PaneDrawer({ open, onClose, side, label, width = 320, children }: {
  open: boolean; onClose: () => void; side: 'left' | 'right'; label: string; width?: number; children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const back = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => panelRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      // Hộp thoại mở TỪ trong ngăn (chọn người, xác nhận) tự đóng trước.
      if (document.querySelector('[role="dialog"][aria-modal="true"]:not([data-pane-drawer])')) return;
      e.preventDefault();
      closeRef.current();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      if (back && document.contains(back)) back.focus();
    };
  }, [open]);
  if (!open) return null;
  return (
    <WorkPortal>
      <div className="fixed inset-0 z-[62] bg-black/30" onMouseDown={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        data-pane-drawer
        className={cn(
          'fixed inset-y-0 z-[63] flex max-w-[92vw] flex-col bg-[var(--w-panel)] outline-none',
          side === 'left' ? 'left-0 border-r' : 'right-0 border-l',
          'border-[var(--w-border)]',
        )}
        style={{ width, boxShadow: 'var(--w-shadow-pop)' }}
      >
        <div className="flex h-[48px] shrink-0 items-center gap-2 border-b border-[var(--w-border)] px-3">
          <span className="min-w-0 flex-1 truncate text-[14px] font-semibold">{label}</span>
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onClose} aria-label={`Close ${label.toLowerCase()} (Esc)`} title="Close (Esc)">
            <X size={15} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </WorkPortal>
  );
}

/** Tiện ích cho trang chỉ cần Focus (không có panel riêng): nút + phím F / Esc. */
export function useFocusMode(scope: string, pathname: string) {
  const focusScope = useLayoutPrefs((s) => s.focus);
  const on = focusScope === scope;
  const toggle = useCallback(() => toggleFocus(scope, focusBaseOf(pathname)), [scope, pathname]);
  usePaneKeys({ focus: toggle, escape: () => escapePanes(scope) });
  return { on, toggle };
}

/**
 * Nút Focus tự chứa cho header của trang chỉ cần "rộng tối đa" (Tests 5.1–5.3, Requirements,
 * FPT reports, biên bản họp): gắn vào là có nút + phím `F` + Esc, không đụng hook của trang.
 */
export function PageFocusButton({ scope }: { scope: string }) {
  const pathname = usePathname() ?? '';
  const { on, toggle } = useFocusMode(scope, pathname);
  return <FocusToggle on={on} onToggle={toggle} />;
}
