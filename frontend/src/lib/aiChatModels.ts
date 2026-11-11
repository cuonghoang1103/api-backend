/**
 * AI Chat Bot — selectable model tiers ("CuongMini").
 *
 * The default is the fast Groq Llama model. "Pro"/"Max" route to Claude via the
 * backend (same key as the Interview Simulator). If a Claude tier can't answer,
 * the backend falls back to the default and streams a `model` SSE frame with
 * `fellBack: true` — the UI then reverts the selection to default (see the
 * chat surfaces' SSE handlers).
 *
 * The selection is shared across BOTH chat surfaces (the /chat page and the
 * floating ChatModal) via this tiny zustand store, persisted to localStorage.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ssrSafeStorage } from '@/store/ssrSafeStorage';

export interface ChatModelOption {
  id: string;
  label: string;
  /** Short Vietnamese hint shown in the dropdown. */
  desc: string;
  /** Visual tier for the badge colour. */
  tier: 'default' | 'pro' | 'max' | 'groq';
  /** Không hiện trong ô chọn — chỉ dùng để HIỂN THỊ khi backend lùi (vd. CuongMini Groq). */
  hidden?: boolean;
}

export const DEFAULT_CHAT_MODEL_ID = 'cuongmini-3.11';

// 09/11/2026: thêm Pro 2. Ba bậc trả phí đi cổng Anthropic chính hãng ở backend
// (`src/services/aiChatChinhHang.ts`) — giao diện CHỈ hiện tên CuongMini.
export const CHAT_MODELS: ChatModelOption[] = [
  { id: 'cuongmini-3.11', label: 'CuongMini 3.11', desc: 'Nhanh · mặc định', tier: 'default' },
  { id: 'cuongmini-pro', label: 'CuongMini Pro', desc: 'Nhanh, thông minh · việc hằng ngày', tier: 'pro' },
  { id: 'cuongmini-pro-2', label: 'CuongMini Pro 2', desc: 'Cân bằng · viết, code, phân tích', tier: 'pro' },
  { id: 'cuongmini-max', label: 'CuongMini Max', desc: 'Mạnh nhất · bài khó, đọc file dài', tier: 'max' },
  // Dự phòng (ẩn khỏi ô chọn): chỉ hiện khi model chính không phản hồi và backend lùi về Groq.
  { id: 'cuongmini-groq', label: 'CuongMini Groq', desc: 'Dự phòng khi model chính không phản hồi · có thể kém hơn', tier: 'groq', hidden: true },
];

/** Các model người dùng CHỌN được (bỏ bản dự phòng ẩn). */
export const SELECTABLE_CHAT_MODELS = CHAT_MODELS.filter((m) => !m.hidden);

export function getChatModel(id: string | undefined): ChatModelOption {
  return CHAT_MODELS.find((m) => m.id === id) ?? CHAT_MODELS[0];
}

interface ChatModelState {
  modelId: string;
  setModelId: (id: string) => void;
}

export const useChatModelStore = create<ChatModelState>()(
  persist(
    (set) => ({
      modelId: DEFAULT_CHAT_MODEL_ID,
      setModelId: (id) => set({ modelId: CHAT_MODELS.some((m) => m.id === id) ? id : DEFAULT_CHAT_MODEL_ID }),
    }),
    {
      name: 'cuongmini-chat-model',
      storage: createJSONStorage(() => ssrSafeStorage),
      // 'cuongmini-groq' là trạng thái LÙI tạm thời (model chính không phản hồi) — chỉ hiện trong phiên,
      // nạp lại thì về mặc định để phiên mới không khởi động trên Groq.
      onRehydrateStorage: () => (state) => {
        if (state?.modelId === 'cuongmini-groq') state.setModelId(DEFAULT_CHAT_MODEL_ID);
      },
    },
  ),
);
