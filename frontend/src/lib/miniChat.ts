/**
 * Mở khung chat nhỏ (MiniChatDock) đè lên trang đang xem — kiểu Facebook (11/11/2026).
 *
 * MiniChatDock (gắn toàn cục trong SiteNav) nghe sự kiện `social:open-mini-chat`.
 * Màn hẹp (< 768px) thì một khung 320px che gần hết trang ⇒ chuyển thẳng sang
 * /messages như ứng dụng Messenger trên điện thoại.
 */
export interface MiniChatPeer {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  /** Mở thẳng hội thoại có sẵn (vd. hỗ trợ loại ADMIN) thay vì tìm/tạo hội thoại 1-1. */
  threadId?: number;
}

export const MINI_CHAT_EVENT = 'social:open-mini-chat';

/** Màn đủ rộng để khung chat nổi không che hết trang. */
export function coTheMoChatNho(): boolean {
  return typeof window !== 'undefined' && window.innerWidth >= 768;
}

/**
 * Trả về `true` nếu đã mở khung chat nổi; `false` nếu nơi gọi nên điều hướng sang
 * /messages (màn hẹp / chưa chạy trên trình duyệt).
 */
export function moChatNho(peer: MiniChatPeer): boolean {
  if (!coTheMoChatNho()) return false;
  window.dispatchEvent(new CustomEvent<MiniChatPeer>(MINI_CHAT_EVENT, { detail: peer }));
  return true;
}
