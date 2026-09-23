'use client';

/**
 * CT Work — trạng thái của ngăn AI (mở/đóng, dự án nào, thẻ nào đang bàn,
 * việc một chạm nào đang chờ chạy). Một store nhỏ để nút ở bất cứ đâu cũng
 * mở được ngăn AI duy nhất do AiPanelHost vẽ.
 */

import { create } from 'zustand';
import type { AiQuickTask } from '@/lib/work-api';

export interface AiQuickRequest {
  task: AiQuickTask;
  issueNumber?: number | null;
  text?: string | null;
  /** Tiêu đề hiện trên lượt trả lời (vd "Break into stories"); bỏ trống thì lấy theo task. */
  label?: string;
}

interface AiPanelState {
  open: boolean;
  pid: number | null;
  issueNumber: number | null;
  quick: AiQuickRequest | null;
  openAiPanel: (args: { pid: number; issueNumber?: number | null; quick?: AiQuickRequest | null }) => void;
  closeAiPanel: () => void;
  /** Bỏ ngữ cảnh "About KEY-n" mà không đóng ngăn. */
  clearIssue: () => void;
  /** Ngăn đã nhận việc một chạm — xoá để không chạy lại. */
  clearQuick: () => void;
}

export const useAiPanel = create<AiPanelState>((set) => ({
  open: false,
  pid: null,
  issueNumber: null,
  quick: null,
  openAiPanel: ({ pid, issueNumber, quick }) =>
    set({ open: true, pid, issueNumber: issueNumber ?? quick?.issueNumber ?? null, quick: quick ?? null }),
  closeAiPanel: () => set({ open: false, quick: null }),
  clearIssue: () => set({ issueNumber: null }),
  clearQuick: () => set({ quick: null }),
}));

export const openAiPanel = (args: Parameters<AiPanelState['openAiPanel']>[0]) => useAiPanel.getState().openAiPanel(args);
export const closeAiPanel = () => useAiPanel.getState().closeAiPanel();
