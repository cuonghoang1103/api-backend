/**
 * Hộp nhắc "bản mới đã sẵn sàng" — nổi ở góc phải dưới, thấy ở mọi trang.
 *
 * ─── Vì sao có thêm cái này khi đã có dải ở sidebar ───
 * Dải trong sidebar cố tình nhỏ và im lặng (xem đầu `UpdateBanner.tsx`), hợp
 * cho lúc bản mới mới chỉ được PHÁT HIỆN. Nhưng khi bản mới đã TẢI XONG và chỉ
 * còn chờ một cú bấm thì im lặng lại thành hại: người dùng không biết mình
 * đang cách bản mới đúng một nút, nên cứ dùng bản cũ mãi rồi tự đi tải tay.
 *
 * Nên chỉ ở ĐÚNG khoảnh khắc đó mới hiện hộp này. Vẫn KHÔNG chặn thao tác: nó
 * là một ô nổi ở góc, không phải hộp thoại phủ giữa màn hình — đang gõ dở thì
 * gõ tiếp.
 *
 * ─── "Để sau" nghĩa là để sau, không phải để mãi ───
 * Ghi vào `sessionStorage`, nên nó im tới khi app đóng mở lại. Ghi vào
 * `localStorage` thì bấm một lần là câm vĩnh viễn với bản đó — người dùng mất
 * luôn đường nhắc. Dải nhỏ ở sidebar vẫn còn nguyên để bấm lúc rảnh.
 */
import { useEffect, useState } from 'react';
import { RotateCw, X } from 'lucide-react';
import { useUpdateStatus } from './UpdateBanner';

const KHOA_HOAN = 'ct-update-hoan';

export function UpdateToast() {
  const status = useUpdateStatus();
  const [hoan, setHoan] = useState<string | null>(() => sessionStorage.getItem(KHOA_HOAN));
  const [dangCai, setDangCai] = useState(false);

  // Bản mới hơn nữa xuất hiện thì lời "để sau" cho bản cũ hết hiệu lực.
  const version = status.state === 'ready' || status.state === 'sanSang' ? status.version : null;
  useEffect(() => {
    if (version && hoan && hoan !== version) {
      sessionStorage.removeItem(KHOA_HOAN);
      setHoan(null);
    }
  }, [version, hoan]);

  if (!version || hoan === version) return null;

  const cai = () => {
    setDangCai(true);
    // Windows/Linux: Squirrel đã có sẵn bản vá, `install()` thoát rồi áp.
    // macOS: app tự tráo bó `.app` bằng gói đã tải sẵn.
    void (status.state === 'ready'
      ? window.cuongthai?.update.install()
      : window.cuongthai?.update.tuCapNhat());
  };

  return (
    <div className="ct-update-toast" role="status">
      <div className="ct-update-toast-icon"><RotateCw size={17} aria-hidden /></div>
      <div className="ct-update-toast-body">
        <p className="ct-update-toast-title">Đã có bản {version}</p>
        <p className="ct-update-toast-desc">
          Bản mới đã tải xong. Khởi động lại là dùng được ngay — mất vài giây.
        </p>
        <div className="ct-update-toast-actions">
          <button type="button" className="ct-btn" onClick={cai} disabled={dangCai}>
            {dangCai ? 'Đang cài…' : 'Khởi động lại ngay'}
          </button>
          <button
            type="button"
            className="ct-btn ct-btn-ghost"
            onClick={() => { sessionStorage.setItem(KHOA_HOAN, version); setHoan(version); }}
            disabled={dangCai}
          >
            Để sau
          </button>
        </div>
      </div>
      <button
        type="button"
        className="ct-update-toast-close"
        onClick={() => { sessionStorage.setItem(KHOA_HOAN, version); setHoan(version); }}
        aria-label="Đóng"
      >
        <X size={14} aria-hidden />
      </button>
    </div>
  );
}
