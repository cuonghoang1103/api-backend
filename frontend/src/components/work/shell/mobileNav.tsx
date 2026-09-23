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
