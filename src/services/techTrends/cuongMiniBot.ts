/**
 * CuongMini — tài khoản BOT đăng bản tin công nghệ lên Bảng tin (Feed).
 * ─────────────────────────────────────────────────────────────────────────
 * Đây KHÔNG phải một agent CT Work (không có hồ sơ `work_agents`, không dùng
 * token `ctw_`). Nó chỉ là một tài khoản `User` bình thường, KHÔNG đăng nhập
 * được, dùng làm `authorId` cho các bài đăng tự động trên Bảng tin.
 *
 * Vì sao `kind = 'HUMAN'` (mặc định) chứ không phải `'AGENT'`:
 *   • Trên web, `kind === 'AGENT'` CHỈ bị chặn ở đường ĐĂNG NHẬP
 *     (`auth.service.ts` → 403 AGENT_NO_LOGIN) — Bảng tin KHÔNG lọc theo kind,
 *     nên AGENT vẫn đăng được bài. Nhưng kind='AGENT' là quy ước của CT Work
 *     (kèm hồ sơ `work_agents` 1:1, huy hiệu 🤖 ở `ui.tsx`, bị "Team"-hoá ở
 *     cổng khách). Bot bảng tin không thuộc thế giới đó, nên dùng kind mặc
 *     định để không vướng vào bất kỳ giả định nào của CT Work.
 *   • Không-đăng-nhập được bảo đảm bằng `password = null`: login so khớp mật
 *     khẩu sẽ rơi vào nhánh `!user.password` → 401 OAUTH_ACCOUNT. Bot không
 *     bao giờ có mật khẩu.
 *
 * Danh tính bot (để minh bạch là bài do AI tạo) nằm ở: displayName "CuongMini",
 * avatar robot dễ thương, và dòng chân bài "🤖 Bản tin tự động bởi CuongMini AI"
 * mà `cuongMiniFeed.ts` luôn gắn vào mỗi bài.
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

/** Username ổn định — dùng cho find-or-create VÀ cho huy hiệu "AI" ở frontend. */
export const CUONGMINI_USERNAME = 'cuongmini';
export const CUONGMINI_DISPLAY_NAME = 'CuongMini';
export const CUONGMINI_AVATAR = '/images/cuongmini-avatar.svg';
/** Email định danh — KHÔNG bao giờ nhận thư (bot không đăng nhập, không nhận mail). */
const CUONGMINI_EMAIL = 'cuongmini-bot@cuongthai.com';

export interface CuongMiniBot {
  id: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

/**
 * Lấy (hoặc tạo) tài khoản bot CuongMini. Idempotent: gọi bao nhiêu lần cũng
 * trả về cùng một hàng, và tự vá lại displayName/avatar nếu ai đó lỡ đổi.
 */
export async function getCuongMiniBotUser(): Promise<CuongMiniBot> {
  const existing = await prisma.user.findUnique({
    where: { username: CUONGMINI_USERNAME },
    select: { id: true, username: true, displayName: true, avatarUrl: true },
  });

  if (existing) {
    // Tự chữa: nếu avatar/displayName bị trống hoặc lệch, đưa về chuẩn.
    if (existing.displayName !== CUONGMINI_DISPLAY_NAME || existing.avatarUrl !== CUONGMINI_AVATAR) {
      const fixed = await prisma.user.update({
        where: { id: existing.id },
        data: { displayName: CUONGMINI_DISPLAY_NAME, avatarUrl: CUONGMINI_AVATAR },
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      });
      return fixed;
    }
    return existing;
  }

  const created = await prisma.user.create({
    data: {
      username: CUONGMINI_USERNAME,
      email: CUONGMINI_EMAIL,
      password: null,                // ⇒ không đăng nhập được (nhánh OAUTH_ACCOUNT)
      fullName: CUONGMINI_DISPLAY_NAME,
      displayName: CUONGMINI_DISPLAY_NAME,
      avatarUrl: CUONGMINI_AVATAR,
      bio: 'Trợ lý AI của cuongthai.com — tổng hợp tin công nghệ & các bài so sánh. Bài viết do AI tạo tự động.',
      emailVerified: true,           // bỏ qua mọi luồng xác thực email
      showActiveStatus: false,       // bot không cần chấm xanh "đang hoạt động"
      enabled: true,
      // kind giữ mặc định 'HUMAN' — xem phần đầu file vì sao.
    },
    select: { id: true, username: true, displayName: true, avatarUrl: true },
  });
  logger.info('[cuongmini] đã tạo tài khoản bot bảng tin', { id: created.id, username: created.username });
  return created;
}
