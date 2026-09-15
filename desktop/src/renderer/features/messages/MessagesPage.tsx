/**
 * ============================================================
 * TIN NHẮN — dùng lại nguyên cây messenger của web
 * ============================================================
 *
 * ─── Vì sao viết lại trang này ───
 * Bản cũ ở đây là một bản tự viết 458 dòng, và nó thiếu gần hết những gì người
 * dùng trông đợi ở một messenger. Đo thật 16/09/2026:
 *
 *     web      19 component · 5.760 dòng
 *     desktop   3 tệp       ·   791 dòng
 *
 * Những thứ bản cũ KHÔNG có: gửi ảnh/tệp, ghi âm, nhãn dán, GIF, emoji, thả
 * cảm xúc, trả lời một tin, thu hồi, đánh dấu chưa đọc, tắt thông báo, chặn
 * người, đổi biệt danh, bảng thông tin hội thoại, gọi video. Và một thứ tệ hơn
 * cả thiếu: nó **không bao giờ nghe `presence:update`**, nên ô trạng thái luôn
 * nói "ngoại tuyến" kể cả khi người kia đang online — đúng lỗi người dùng báo.
 *
 * Viết lại từng cái trong số đó ở đây là nuôi hai bản song song mãi mãi. App
 * này đã dùng lại hơn 57.000 dòng của web theo đúng lối đó (Notes, Thuật toán,
 * Mô phỏng, Lộ trình, Ngoại ngữ) — xem `vite.alias.ts`. Messenger cũng vậy.
 *
 * ─── Bốn thứ lớp bọc này phải làm ───
 *  1. Trỏ axios của web vào máy chủ thật (`configureWebApi`) — giống Notes.
 *  2. Nạp phiên desktop vào `authStore` của web; cây messenger đọc `user` từ
 *     đó, rỗng thì nó vẽ màn hình "hãy đăng nhập" cho người đã đăng nhập.
 *  3. **Cắm socket của app vào `lib/socket.ts` của web** (`camSocketDesktop`).
 *     Thiếu bước này thì web nối tới `app://cuongthai` và mọi thứ thời gian
 *     thực chết câm: không có tin mới, không có "đang nhập", và trạng thái
 *     hoạt động đứng im ở ngoại tuyến. Xem `shims/web-socket-adapter.ts`.
 *  4. Chờ cả ba xong RỒI mới dựng — dựng trước thì lượt gọi API đầu tiên bay
 *     đi khi chưa có token và trang hiện ra trống trơn.
 */
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import WebMessagesPage from '@/app/messages/page';
import { useAuthStore } from '@/store/authStore';
import { useSession } from '../../auth/session';
import { configureWebApi } from '../../shims/web-api-adapter';
import { camSocketDesktop } from '../../shims/web-socket-adapter';
import { useDich } from '../../i18n';

export function MessagesPage() {
  const { dich } = useDich();
  const { api, user } = useSession();
  const [sanSang, datSanSang] = useState(false);

  useEffect(() => {
    if (!api || !user) return;

    configureWebApi({
      apiBase: api.baseUrlForForms(),
      getToken: () => api.getToken(),
    });

    /* Cắm TRƯỚC khi dựng cây messenger. `messagingStore.init()` chạy ngay ở
       lần render đầu và nó gọi `connectSocket()` — cắm sau là lần gọi đó đã
       kịp mở một socket thứ hai tới `app://cuongthai`, thứ không bao giờ nối
       được, và cửa hàng ghi nhớ lỗi ấy thành "Không kết nối được chat". */
    camSocketDesktop();

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
      refreshToken: '',
    } as never);

    datSanSang(true);
  }, [api, user]);

  if (!sanSang) {
    return (
      <div className="ct-boot">
        <div className="ct-empty">
          <Loader2 size={22} className="ct-spin" aria-hidden />
          <p style={{ marginTop: 10 }}>{dich('Đang mở Tin nhắn…')}</p>
        </div>
      </div>
    );
  }

  /**
   * `ct-web-nhung` cho trang web mượn CHIỀU CAO THẬT của khung app.
   *
   * Trang messenger của web tự tính chiều cao theo `100dvh` — đúng trong tab
   * trình duyệt, nhưng trong app nó nằm dưới thanh tiêu đề và bên phải thanh
   * điều hướng, nên `100dvh` đẩy phần cuối khung nhập chữ xuống dưới mép cửa
   * sổ. Xem [[feedback_webview_do_chieu_cao_phai_theo_body]] — cùng một bẫy.
   */
  return (
    <div className="ct-web-nhung">
      <WebMessagesPage />
    </div>
  );
}

export default MessagesPage;
