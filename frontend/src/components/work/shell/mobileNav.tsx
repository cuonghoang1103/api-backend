'use client';

/**
 * Ngăn điều hướng trên điện thoại. Trước đây layout vẽ một thanh "☰ CT Work"
 * riêng rồi trang lại vẽ header của nó ⇒ hai thanh chồng nhau (~90px) ở 390px.
 * Giờ header của trang (PageHeader / ProjectHeader) tự đặt nút ☰ bên trái và
 * ĐĂNG KÝ với store này; layout chỉ vẽ thanh dự phòng khi trang không có
 * header nào đăng ký (trang của agent khác chưa dùng nút này vẫn có đường mở).
 */

import { useEffect, useLayoutEffect } from 'react';
import { create } from 'zustand';
import { Menu } from 'lucide-react';

interface MobileNavState {
  open: boolean;
  /** Số header đang gắn có nút ☰ riêng. */
  headers: number;
  setOpen: (v: boolean) => void;
  addHeader: () => void;
  removeHeader: () => void;
}

export const useMobileNav = create<MobileNavState>((set) => ({
  open: false,
  headers: 0,
  setOpen: (open) => set({ open }),
  addHeader: () => set((s) => ({ headers: s.headers + 1 })),
  removeHeader: () => set((s) => ({ headers: Math.max(0, s.headers - 1) })),
}));

// Trên máy chủ useLayoutEffect chỉ sinh cảnh báo — dùng useEffect ở đó.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Nút ☰ chỉ hiện dưới md; gắn vào header nào thì header đó thay thanh của layout. */
export function MobileNavButton() {
  const setOpen = useMobileNav((s) => s.setOpen);
  useIsoLayoutEffect(() => {
    const { addHeader, removeHeader } = useMobileNav.getState();
    addHeader();
    return removeHeader;
  }, []);
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="w-btn w-btn-ghost w-btn-icon -ml-1.5 shrink-0 md:!hidden"
      aria-label="Open navigation"
    >
      <Menu size={17} />
    </button>
  );
}

// ─── Sidebar thu gọn (≥md) ───────────────────────────────────────
//
// Thu gọn = thanh icon 60px. Người dùng bấm ⇒ nhớ lựa chọn (localStorage, có thể
// ném lỗi ở cửa sổ riêng tư ⇒ bọc try). Chưa từng chọn ⇒ tự thu gọn khi cửa sổ
// hẹp hơn 1100px (cửa sổ app desktop 820px vẫn còn ~760px cho board).

const RAIL_KEY = 'ctwork.sidebar.collapsed';

function readRail(): boolean | null {
  try {
    const v = window.localStorage.getItem(RAIL_KEY);
    return v === null ? null : v === '1';
  } catch { return null; }
}

interface RailState {
  collapsed: boolean;
  /** true khi người dùng đã tự chọn (khi đó không tự đổi theo bề ngang nữa). */
  chosen: boolean;
  init: () => void;
  toggle: () => void;
}

export const useSidebarRail = create<RailState>((set, get) => ({
  collapsed: false,
  chosen: false,
  init: () => {
    const saved = readRail();
    if (saved !== null) set({ collapsed: saved, chosen: true });
    else set({ collapsed: window.innerWidth < 1100, chosen: false });
  },
  toggle: () => {
    const next = !get().collapsed;
    try { window.localStorage.setItem(RAIL_KEY, next ? '1' : '0'); } catch { /* bỏ qua */ }
    set({ collapsed: next, chosen: true });
  },
}));
