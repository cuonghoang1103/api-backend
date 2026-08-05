'use client';

/**
 * Trạng thái phía trình duyệt cho kho AI Templates.
 *
 * Hai thứ được nhớ lại giữa các phiên, cả hai đều nằm gọn ở localStorage vì
 * chúng thuộc về CÁI MÁY chứ không thuộc về tài khoản: giỏ cài đặt là để dán
 * vào terminal đang mở ngay đây, còn danh sách yêu thích thì không đáng bắt
 * người ta đăng nhập mới dùng được.
 *
 * - `stack`   — giỏ "Stack Builder": chọn nhiều component rồi lấy MỘT lệnh cài gộp.
 * - `favorites` — đánh dấu để xem lại, khoá là `<loại>:<đường dẫn>`.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ssrSafeStorage } from './ssrSafeStorage';
import type { StackItem } from '@/lib/ai-templates/types';

/** Khoá định danh duy nhất một component trong toàn kho. */
export function itemKey(type: string, path: string): string {
  return `${type}:${path}`;
}

interface AiTemplatesState {
  stack: StackItem[];
  favorites: string[];
  isStackOpen: boolean;

  addToStack: (item: StackItem) => void;
  removeFromStack: (type: string, ref: string) => void;
  toggleStack: (item: StackItem) => void;
  clearStack: () => void;
  isInStack: (type: string, ref: string) => boolean;

  toggleFavorite: (key: string) => void;
  isFavorite: (key: string) => boolean;

  openStack: () => void;
  closeStack: () => void;
  toggleStackPanel: () => void;
}

/** Trần giỏ hàng: quá số này thì lệnh cài dài tới mức không dán nổi. */
const STACK_MAX = 40;

export const useAiTemplatesStore = create<AiTemplatesState>()(
  persist(
    (set, get) => ({
      stack: [],
      favorites: [],
      isStackOpen: false,

      addToStack: (item) => {
        const { stack } = get();
        if (stack.some((s) => s.type === item.type && s.ref === item.ref)) return;
        if (stack.length >= STACK_MAX) return;
        set({ stack: [...stack, item] });
      },

      removeFromStack: (type, ref) =>
        set({ stack: get().stack.filter((s) => !(s.type === type && s.ref === ref)) }),

      toggleStack: (item) => {
        const exists = get().stack.some((s) => s.type === item.type && s.ref === item.ref);
        if (exists) get().removeFromStack(item.type, item.ref);
        else get().addToStack(item);
      },

      clearStack: () => set({ stack: [] }),

      isInStack: (type, ref) => get().stack.some((s) => s.type === type && s.ref === ref),

      toggleFavorite: (key) => {
        const { favorites } = get();
        set({
          favorites: favorites.includes(key)
            ? favorites.filter((f) => f !== key)
            : [...favorites, key],
        });
      },

      isFavorite: (key) => get().favorites.includes(key),

      openStack: () => set({ isStackOpen: true }),
      closeStack: () => set({ isStackOpen: false }),
      toggleStackPanel: () => set({ isStackOpen: !get().isStackOpen }),
    }),
    {
      name: 'ai-templates-store',
      storage: createJSONStorage(() => ssrSafeStorage),
      // `isStackOpen` cố ý KHÔNG lưu: mở lại tab mà panel tự bung ra thì phiền,
      // và nó không phải dữ liệu của người dùng.
      partialize: (s) => ({ stack: s.stack, favorites: s.favorites }),
    },
  ),
);

export const STACK_LIMIT = STACK_MAX;
