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
import '../../src/renderer/styles.css';

const duong = new URLSearchParams(location.search).get('trang') ?? '/dashboard';
const Trang = nativePageFor(duong);

createRoot(document.getElementById('root')!).render(
  <AppStateProvider tuyenBanDau={duong}>
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
      </div>
    </MusicPlayerProvider>
  </AppStateProvider>,
);
