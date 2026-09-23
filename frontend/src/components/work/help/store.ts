'use client';

/**
 * CT Work — trạng thái ngăn Trợ giúp (mở/đóng + bài đang mở). Một store nhỏ để
 * nút "?" ở header, dòng "Help & guide" ở sidebar, bảng lệnh ⌘K và phím ? đều
 * mở cùng MỘT ngăn do HelpPanelHost vẽ (giống ai/store.ts).
 */

import { create } from 'zustand';
import { helpArticleForPath } from './content';

interface HelpState {
  open: boolean;
  /** Bài cần mở; null = trang mục lục (hoặc bài đọc lần trước). */
  articleId: string | null;
  /** Tăng mỗi lần gọi openHelp để ngăn nhận lại yêu cầu dù cùng một bài. */
  nonce: number;
  openHelp: (articleId?: string | null) => void;
  closeHelp: () => void;
}

export const useHelp = create<HelpState>((set) => ({
  open: false,
  articleId: null,
  nonce: 0,
  openHelp: (articleId) => set((s) => ({ open: true, articleId: articleId ?? null, nonce: s.nonce + 1 })),
  closeHelp: () => set({ open: false }),
}));

export const openHelp = (articleId?: string | null) => useHelp.getState().openHelp(articleId);
export const closeHelp = () => useHelp.getState().closeHelp();

/** Mở đúng bài của trang đang xem (đọc URL lúc bấm). */
export function openContextualHelp() {
  if (typeof window === 'undefined') return;
  openHelp(helpArticleForPath(window.location.pathname, window.location.search));
}
