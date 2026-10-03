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

/** Dự án dùng AI gần nhất — để nút "Ask AI" ở trang KHÔNG thuộc dự án nào (My work,
 *  tìm kiếm) vẫn mở được đúng chỗ người dùng vừa làm (04/10/2026). Per-viewer. */
const LAST_PID = 'ctwork-ai-last-pid';
export function lastAiPid(): number | null {
  try {
    const v = Number(localStorage.getItem(LAST_PID));
    return Number.isInteger(v) && v > 0 ? v : null;
  } catch { return null; }
}

export const useAiPanel = create<AiPanelState>((set) => ({
  open: false,
  pid: null,
  issueNumber: null,
  quick: null,
  openAiPanel: ({ pid, issueNumber, quick }) => {
    try { localStorage.setItem(LAST_PID, String(pid)); } catch { /* chỉ là tiện ích */ }
    set({ open: true, pid, issueNumber: issueNumber ?? quick?.issueNumber ?? null, quick: quick ?? null });
  },
  closeAiPanel: () => set({ open: false, quick: null }),
  clearIssue: () => set({ issueNumber: null }),
  clearQuick: () => set({ quick: null }),
}));

export const openAiPanel = (args: Parameters<AiPanelState['openAiPanel']>[0]) => useAiPanel.getState().openAiPanel(args);
export const closeAiPanel = () => useAiPanel.getState().closeAiPanel();
