/**
 * Màn hình cho route đã có trên web nhưng CHƯA được viết lại dạng native.
 *
 * Đây là chỗ dễ nói dối nhất trong cả app, nên nó được viết để nói thật: tính
 * năng có thật, nhưng chưa có trong bản desktop này, và đây là đường đi tiếp.
 * Cách làm sai là dựng một khung giao diện trống trông như đang tải — người
 * dùng sẽ ngồi đợi một thứ không bao giờ tới.
 */
import { ExternalLink } from 'lucide-react';
import type { RouteDef } from '../routes';

export function NotPorted({ route }: { route: RouteDef }) {
  const openOnWeb = () => {
    void window.cuongthai?.app
      .getInfo()
      .then((info) => window.cuongthai?.app.openExternal(`${info.webOrigin}${route.path}`));
  };

  return (
    <div className="ct-page">
      <div className="ct-empty">
        <route.icon size={30} aria-hidden className="ct-empty-icon" />
        <h1>{route.label}</h1>
        <p>
          Tính năng này đã có trên <strong>cuongthai.com</strong> nhưng chưa được
          đưa vào bản desktop. Nó nằm trong kế hoạch — xem
          {' '}<code>docs/electron-implementation-plan.md</code>.
        </p>
        <div className="ct-actions">
          <button type="button" className="ct-btn" onClick={openOnWeb}>
            <ExternalLink size={14} aria-hidden />
            Mở trên web
          </button>
        </div>
        <p className="ct-empty-note">
          Mở bằng trình duyệt mặc định của bạn, giữ nguyên phiên đăng nhập ở đó.
        </p>
      </div>
    </div>
  );
}
