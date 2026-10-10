'use client';

/**
 * Notes — trạng thái ngăn Trợ giúp (mở/đóng + bài đang mở).
 *
 * Song song với store của CT Work (components/work/help/store.ts) nhưng RIÊNG
 * cho Sổ tay: không chạm vào store kia. Một store nhỏ để nút "Trợ giúp" ở
 * sidebar và phím ? đều mở cùng MỘT ngăn do NotesHelpPanelHost vẽ.
 */

import { create } from 'zustand';

interface NotesHelpState {
  open: boolean;
  /** Bài cần mở; null = trang mục lục (hoặc bài đọc lần trước). */
  articleId: string | null;
  /** Tăng mỗi lần mở để ngăn nhận lại yêu cầu dù cùng một bài. */
  nonce: number;
  openNotesHelp: (articleId?: string | null) => void;
  closeNotesHelp: () => void;
}

export const useNotesHelp = create<NotesHelpState>((set) => ({
  open: false,
  articleId: null,
  nonce: 0,
  openNotesHelp: (articleId) =>
    set((s) => ({ open: true, articleId: articleId ?? null, nonce: s.nonce + 1 })),
  closeNotesHelp: () => set({ open: false }),
}));

export const openNotesHelp = (articleId?: string | null) =>
  useNotesHelp.getState().openNotesHelp(articleId);
export const closeNotesHelp = () => useNotesHelp.getState().closeNotesHelp();
