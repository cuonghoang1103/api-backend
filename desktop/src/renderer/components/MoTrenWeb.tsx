/**
 * Nút "Mở trên cuongthai.com" cho màn "Không tìm thấy" (04/10/2026): đường dẫn mà
 * app chưa có trang thì ít nhất cũng mở được trang đó trên web bằng trình duyệt —
 * không để người dùng đứng ở ngõ cụt.
 */
import { ExternalLink } from 'lucide-react';

export function MoTrenWeb({ duong }: { duong: string }) {
  const mo = () => {
    void window.cuongthai?.app
      .getInfo()
      .then((info) => window.cuongthai?.app.openExternal(`${info.webOrigin}${duong}`));
  };
  return (
    <button type="button" className="ct-btn" onClick={mo}>
      <ExternalLink size={14} aria-hidden /> Mở trên cuongthai.com
    </button>
  );
}
