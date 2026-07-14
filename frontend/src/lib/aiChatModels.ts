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
  tier: 'default' | 'pro' | 'max';
}

export const DEFAULT_CHAT_MODEL_ID = 'cuongmini-3.11';

export const CHAT_MODELS: ChatModelOption[] = [
  { id: 'cuongmini-3.11', label: 'CuongMini3.11', desc: 'Nhanh & mượt · mặc định', tier: 'default' },
  { id: 'cuongmini-pro', label: 'CuongMini Pro', desc: 'Thông minh hơn · trả lời sâu', tier: 'pro' },
  { id: 'cuongmini-max', label: 'CuongMini Max', desc: 'Mạnh nhất · chính xác nhất', tier: 'max' },
];

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
    },
  ),
);
