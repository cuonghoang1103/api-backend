/**
 * Bản dựng THỬ BỐ CỤC — mount từng trang thật vào đúng vỏ app, để đo tràn ngang.
 *
 * Xem `scripts/do-bo-cuc.mjs` để biết vì sao bộ này tồn tại.
 */
import { createRoot } from 'react-dom/client';
import { NATIVE_PAGES } from '../../src/renderer/page-registry';
import { MusicPlayerProvider } from '../../src/renderer/features/music/player';
import '../../src/renderer/styles.css';

const duong = new URLSearchParams(location.search).get('trang') ?? '/dashboard';
const Trang = NATIVE_PAGES[duong];

createRoot(document.getElementById('root')!).render(
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
  </MusicPlayerProvider>,
);
