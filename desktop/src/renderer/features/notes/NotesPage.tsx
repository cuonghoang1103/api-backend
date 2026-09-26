/**
 * Notes trên desktop — DÙNG LẠI nguyên trang Notes của web.
 *
 * ─── Vì sao không viết lại ───
 * Bản web đã là một Notion hoàn chỉnh: 22 component, 6.332 dòng, có slash menu,
 * database (bảng/board/lịch), trang lồng nhau, bình luận, lịch sử phiên bản,
 * backlink, mục lục, chia sẻ, flashcard. Viết lại từng ấy thứ ở đây là làm lại
 * nhiều tháng công việc, rồi phải nuôi hai bản song song mãi mãi — mỗi tính
 * năng mới phải làm hai lần, mỗi lỗi phải sửa hai chỗ.
 *
 * Hai điều khiến việc dùng lại khả thi (đã kiểm, không đoán):
 *   • Cả cây Notes chỉ dính Next.js đúng MỘT chỗ (`next/dynamic`), và trang
 *     không dùng router/link/image của Next. Xem shims/next-dynamic.tsx.
 *   • `lib/api.ts` export ra chính instance axios, nên đổi `baseURL` + gắn
 *     Bearer là 4.994 dòng gọi API chạy nguyên xi. Xem shims/web-api-adapter.ts.
 *
 * ─── Ba thứ lớp bọc này phải làm ───
 *  1. Trỏ axios của web vào máy chủ thật (web dựa vào proxy Next cùng origin,
 *     desktop thì không có).
 *  2. Nạp phiên desktop vào `authStore` của web — cây Notes đọc `user`/`token`
 *     từ đó, và nếu nó rỗng thì mọi lời gọi API đi ra mà không có ai đăng nhập.
 *  3. Chờ cả hai xong RỒI mới dựng trang. Dựng trước sẽ khiến lượt gọi API đầu
 *     tiên bay đi khi chưa có token — nhận 401, và trang hiện ra trống trơn
 *     dù người dùng đã đăng nhập.
 */
import { Suspense, lazy, useEffect, useLayoutEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import WebNotesPage from '@/app/notes/page';
// Khung/nền bảng của Notes (Sổ lệnh…) — CẮT từ globals.css của web, xem vite.noi-dung-bai.ts.
import 'virtual:bang-ghi-chu.css';
import { useAuthStore } from '@/store/authStore';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { configureWebApi } from '../../shims/web-api-adapter';
import { useDich } from '../../i18n';
import { VoWeb } from '../web/TrangWeb';

/** `/notes/graph` — "Đồ thị liên kết" (⌘K và trang chủ Sổ tay trỏ tới). Nạp
 *  lười: phần lớn người dùng không bao giờ mở nó. */
const WebNotesGraph = lazy(() => import('@/app/notes/graph/page'));

/**
 * Đặt / gỡ `?note=ID` trên URL THẬT của renderer.
 *
 * ─── Vì sao phải đụng vào `location` ───
 * Trang Notes của web mở ghi chú theo deep link bằng cách đọc
 * `window.location.search` (một lần, sau khi nạp xong cây). Web tới đó bằng
 * TẢI LẠI TRANG `/notes?note=ID` — Ghi nhanh "Mở", "Xem Sổ lệnh ↗", nút trên
 * thông báo. App thì định tuyến bằng chuỗi trong app-state, `location` của
 * renderer luôn là `app://cuongthai/index.html` ⇒ trang web không bao giờ thấy
 * tham số, và bấm "Mở" chỉ đưa về Sổ tay trống.
 *
 * `replaceState` chỉ đổi chuỗi trên thanh địa chỉ (không có thanh nào để thấy),
 * không điều hướng, không tải lại; router của app không đọc URL nên không bị
 * ảnh hưởng. Sửa được mà KHÔNG đụng một dòng mã web.
 */
function datUrlGhiChu(noteId: string | null): void {
  try {
    const { pathname, hash } = window.location;
    history.replaceState(history.state, '', noteId ? `${pathname}?note=${noteId}${hash}` : `${pathname}${hash}`);
  } catch { /* không có history (môi trường kiểm) — bỏ qua */ }
}

export function NotesPage() {
  const { dich } = useDich();
  const { api, user } = useSession();
  const { route, layThamSo, lanDieuHuong } = useAppState();
  const [ready, setReady] = useState(false);

  /*
   * Deep link `?note=ID` — tới từ Ghi nhanh ("Mở", "Xem Sổ lệnh ↗"), từ Đồ thị
   * liên kết (`router.push('/notes?note=…')`), hay tiến trình main chặn
   * `location.href` (xem `main/dieuHuongNoiBo.ts`).
   *
   * `lanMo` là `key` của trang web: đổi nó = GẮN LẠI trang, y hệt web tải lại
   * `/notes?note=ID`. Cần vì trang web chỉ xử lý deep link MỘT lần mỗi lần gắn
   * (`commentDeepLinkHandled`), nên đang ở Sổ tay mà bấm "Mở" một ghi chú khác
   * thì không gắn lại là không có gì xảy ra.
   */
  const [ghiChuMo, datGhiChuMo] = useState<{ id: string; lan: number } | null>(null);
  useEffect(() => {
    const id = layThamSo('note');
    if (!id || !/^\d+$/.test(id)) return;
    datGhiChuMo((cu) => ({ id, lan: (cu?.lan ?? 0) + 1 }));
  }, [lanDieuHuong, layThamSo]);

  /* Layout effect + dọn trong CÙNG effect: StrictMode chạy gắn → gỡ → gắn, và
     tách "đặt" với "gỡ khi rời trang" ra hai effect thì lượt gỡ giả chạy SAU
     lượt đặt, xoá mất tham số trước khi trang web kịp đọc. Rời Sổ tay thì gỡ
     — không thì lần sau vào lại, trang mở lại đúng ghi chú cũ. */
  useLayoutEffect(() => {
    if (!ghiChuMo) return;
    datUrlGhiChu(ghiChuMo.id);
    return () => datUrlGhiChu(null);
  }, [ghiChuMo]);

  useEffect(() => {
    if (!api || !user) return;

    // 1. Gốc API. Ở dev đây là chuỗi rỗng — proxy của Vite lo chuyển tiếp.
    configureWebApi({
      apiBase: api.baseUrlForForms(),
      getToken: () => api.getToken(),
    });

    // 2. Nạp phiên vào store của web.
    //
    // Dựng lại hình dạng `AuthResponse` mà `setAuth` mong đợi. `refreshToken`
    // để rỗng CÓ CHỦ ĐÍCH: backend không có endpoint nào nhận nó (xem
    // shared/ipc.ts), nên điền vào chỉ tạo ảo giác là nó dùng được.
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

    setReady(true);
  }, [api, user]);

  if (!ready) {
    return (
      <div className="ct-boot">
        <div className="ct-empty">
          <Loader2 size={22} className="ct-spin" aria-hidden />
          <p style={{ marginTop: 10 }}>{dich('Đang mở Ghi chú…')}</p>
        </div>
      </div>
    );
  }

  if (route === '/notes/graph') {
    return (
      <VoWeb>
        <Suspense fallback={null}>
          <WebNotesGraph />
        </Suspense>
      </VoWeb>
    );
  }

  /**
   * ⚠️ Lớp bọc này KHÔNG mang `notes-theme-root` nữa (26/09/2026).
   *
   * `NotesThemeProvider` của web TỰ dựng `div.notes-theme-root` của nó — chính
   * phần tử mang lớp `.dark` (chủ đề Tối của Notes) và các biến
   * `--notes-surface`/`--notes-text`. Bản cũ đặt thêm lớp đó lên vùng bọc ngoài
   * này, thành HAI phần tử cùng tên lồng nhau. Không sao cho tới khi mã web bắt
   * đầu tìm nó để portal hộp thoại vào:
   *     document.querySelector('.notes-theme-root')   // NoteMovePicker,
   *                                                   // NotesNewPageDialog,
   *                                                   // hoiMotDongAsync
   * `querySelector` trả phần tử ĐẦU TIÊN theo thứ tự tài liệu — tức vùng bọc
   * NGOÀI, không có `.dark` và không có biến màu ⇒ ở chủ đề Tối, hộp "Chuyển
   * tới…", "Trang mới" và hộp hỏi link hiện ra trắng toát giữa giao diện tối.
   * Trên web chỉ có một phần tử nên không ai thấy.
   *
   * Chủ đề tối TOÀN CỤC của dự án dùng `theme-dark`, KHÔNG phải `dark` — đừng
   * đặt `dark` lên đây hay lên <html> (lỗi thật trên web ngày 02/07/2026).
   */
  return (
    <div className="ct-notes-host">
      <WebNotesPage key={ghiChuMo?.lan ?? 0} />
    </div>
  );
}
