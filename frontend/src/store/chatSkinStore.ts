/**
 * Skin (giao diện) của trang /chat.
 *
 * HAI giao diện dùng CHUNG toàn bộ logic chat — chỉ khác cách trình bày:
 *
 *  - 'terminal' — bản gốc: nền cyber-grid + mưa Matrix, chữ mono, tông cyan,
 *                 dấu nhắc `root@cuongmini-os`. MẶC ĐỊNH, không được bỏ.
 *  - 'studio'   — bản dễ nhìn kiểu ChatGPT/Claude, mang tên server
 *                 cuongthai.com: chữ sans, bong bóng mềm, theo theme
 *                 sáng/tối của cả web.
 *
 * Lưu vào localStorage để giữ lựa chọn qua các lần tải lại. LƯU Ý khi đọc:
 * giá trị đã lưu chỉ về SAU khi hydrate, nên trang phải đọc qua cổng
 * `mounted` (xem `/chat/page.tsx`) — render thẳng lúc SSR sẽ lệch HTML.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ssrSafeStorage } from '@/store/ssrSafeStorage';

export type ChatSkin = 'terminal' | 'studio';

/** Giao diện cũ vẫn là mặc định — người đang dùng không bị đổi đột ngột. */
export const DEFAULT_CHAT_SKIN: ChatSkin = 'terminal';

export const CHAT_SKIN_LABEL: Record<ChatSkin, string> = {
  terminal: 'Terminal',
  studio: 'Studio',
};

interface ChatSkinState {
  skin: ChatSkin;
  setSkin: (skin: ChatSkin) => void;
  toggleSkin: () => void;
}

export const useChatSkinStore = create<ChatSkinState>()(
  persist(
    (set) => ({
      skin: DEFAULT_CHAT_SKIN,
      setSkin: (skin) => set({ skin: skin === 'studio' ? 'studio' : 'terminal' }),
      toggleSkin: () => set((s) => ({ skin: s.skin === 'studio' ? 'terminal' : 'studio' })),
    }),
    {
      name: 'cuongmini-chat-skin',
      storage: createJSONStorage(() => ssrSafeStorage),
    },
  ),
);
