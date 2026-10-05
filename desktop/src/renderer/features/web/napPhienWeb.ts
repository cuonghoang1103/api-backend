/**
 * Nạp phiên của app vào kho đăng nhập của WEB (`useAuthStore`) — MỘT chỗ cho mọi
 * nơi dựng mã web trong app (TrangWeb, Tin nhắn, Ghi chú…).
 *
 * `setAuth` của web coi MỖI lần gọi là một lần ĐĂNG NHẬP: phát tiếng "login"
 * ("Yahooo") và bắn sự kiện `auth-changed`. 04/10/2026 đã chặn ở TrangWeb, nhưng
 * Tin nhắn và Ghi chú tự gọi `setAuth` riêng ⇒ người dùng vẫn nghe "Yahooo" mỗi lần
 * mở hai trang đó ở mục Chính (05/10/2026: "tôi tưởng bạn fix full rồi"). Giờ mọi
 * nơi đi qua hàm này: kho đã giữ đúng người này thì THÔI, không gọi lại.
 */
import { useAuthStore } from '@/store/authStore';
import type { ApiClient } from '../../api/client';
import type { CurrentUser } from '../../auth/session';

export function napPhienWeb(api: ApiClient, user: CurrentUser): void {
  const daCo = useAuthStore.getState() as unknown as { isAuthenticated?: boolean; user?: { id?: number } | null };
  if (daCo.isAuthenticated && daCo.user?.id === user.userId) return;
  useAuthStore.getState().setAuth({
    userId: user.userId,
    username: user.username,
    email: user.email,
    fullName: user.fullName ?? '',
    avatarUrl: user.avatarUrl ?? '',
    roles: user.roles,
    role: user.role,
    roleVersion: 0,
    token: api.getToken() ?? '',
    // Rỗng CÓ CHỦ ĐÍCH: backend không có endpoint nhận refresh token.
    refreshToken: '',
  } as never);
}
