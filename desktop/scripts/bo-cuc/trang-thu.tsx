/**
 * Bản dựng THỬ BỐ CỤC — mount từng trang thật vào đúng vỏ app, để đo tràn ngang.
 *
 * Xem `scripts/do-bo-cuc.mjs` để biết vì sao bộ này tồn tại.
 *
 * ⚠️ HAI THỨ TỪNG THIẾU, và cả hai làm bộ kiểm báo ĐỎ oan (20/08/2026):
 *
 *  1. Nó đọc thẳng `NATIVE_PAGES[duong]` thay vì gọi `nativePageFor()`. Bảng
 *     đó khớp CHÍNH XÁC, nên mọi trang con động (`/language/ja`) ra `undefined`
 *     và bộ kiểm báo "trang gần như TRỐNG" — nghe như trang hỏng, thật ra là
 *     bộ kiểm không tìm ra trang.
 *
 *  2. Nó không bọc `AppStateProvider`. Trang nào đọc `useAppState()` sẽ nhận
 *     giá trị mặc định của context, và `route` là `undefined` — cây Ngoại ngữ
 *     nổ ngay ở `khopTuyenWeb(undefined)`. Lại là lỗi của bộ kiểm.
 *
 * Bài học chung: bộ kiểm phải dựng trang qua ĐÚNG con đường mà app dùng, nếu
 * không thì nó đo một thứ khác. Xem [[feedback_verify_the_checker_before_the_content]].
 */
import { createRoot } from 'react-dom/client';
import { AppStateProvider } from '../../src/renderer/app-state';
import { nativePageFor } from '../../src/renderer/page-registry';
import { MusicPlayerProvider } from '../../src/renderer/features/music/player';
/* Giống `main.tsx` của app thật: thiếu provider này là mọi mã web dùng
   `useQuery` ném ngay lúc vẽ, và bộ đo báo "trang trống" — một lỗi của BỘ ĐO
   đội lốt lỗi của trang, đúng cái bẫy đã ghi hai lần trong tệp cấu hình. */
import TanStackQueryProvider from '@/components/providers/TanStackQueryProvider';
import { useAuthStore } from '@/store/authStore';
import { OdinDock } from '../../src/renderer/features/odin/OdinDock';
import '../../src/renderer/styles.css';



/* Nạp phiên vào `authStore` của WEB, y như `Gate()` của app thật làm qua
   `useCauNoiWeb()`. Thiếu bước này thì mọi mã web khoá theo
   `authStore.isAuthenticated` (rõ nhất là `usePro()`) hành xử như KHÁCH: gia
   sư AI hiện "Đăng nhập để dùng" và bộ đo không bao giờ chạm tới nhánh Pro —
   đúng lỗi người dùng gặp 09/09/2026 mà bộ đo không thấy. */
useAuthStore.getState().setAuth({
  userId: 1, username: 'thu', email: 'thu@thu.test', fullName: 'Nguoi thu',
  avatarUrl: '', roles: ['ADMIN'], role: 'ADMIN', roleVersion: 0,
  token: 'gia', refreshToken: '',
} as never);

const duong = new URLSearchParams(location.search).get('trang') ?? '/dashboard';
const Trang = nativePageFor(duong);

createRoot(document.getElementById('root')!).render(
  <AppStateProvider tuyenBanDau={duong}>
   <TanStackQueryProvider>
    <MusicPlayerProvider>
      {/* Đúng cây vỏ của App.tsx: shell > sidebar > main > content > trang. */}
      <div className="ct-shell">
        <div className="ct-sidebar" style={{ width: 240, flex: '0 0 240px' }} />
        <div className="ct-main">
          <div style={{ height: 'var(--ct-titlebar-h)' }} />
          <div className="ct-content">
            {Trang ? <Trang /> : <p>Không có trang {duong}</p>}
          </div>
          <div style={{ height: 'var(--ct-statusbar-h)' }} />
        </div>
        {/* Robot chỉ gắn khi `?robot=1`. Nó không liên quan tới bố cục trang,
            và gắn mặc định thì 42 trang nào cũng phải chịu một cái mic xin
            quyền. Bật cờ này để CHỨNG MINH đường nhắc lịch chạy thật: bắn sự
            kiện rồi xem bong bóng có hiện không — thứ mà phép kiểm đơn vị
            không nói được. */}
        {new URLSearchParams(location.search).get('robot') === '1' && <OdinDock />}
      </div>
    </MusicPlayerProvider>
   </TanStackQueryProvider>
  </AppStateProvider>,
);
