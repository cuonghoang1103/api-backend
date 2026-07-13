import type { Metadata } from 'next';
import LegalShell from '@/components/legal/LegalShell';

export const metadata: Metadata = {
  title: 'Chính sách giao hàng',
  description: 'Chính sách giao hàng của CuongThai: khoá học & hàng số giao tự động tức thì; hàng vật lý (nếu có) giao theo đơn vị vận chuyển.',
  alternates: { canonical: 'https://cuongthai.com/chinh-sach-giao-hang' },
};

export default function Page() {
  return (
    <LegalShell title="Chính sách giao hàng" activeHref="/chinh-sach-giao-hang">
      <p>
        Phần lớn sản phẩm trên CuongThai là <b>khoá học và hàng số</b> (tài khoản/
        quyền truy cập nội dung, tài liệu, mã kích hoạt…). Chính sách giao hàng áp
        dụng theo từng loại như sau.
      </p>

      <h2>1. Khoá học &amp; hàng số — giao tự động, tức thì</h2>
      <ul>
        <li>Ngay sau khi thanh toán được ghi nhận <b>thành công</b> (qua PayOS/VNPay), hệ thống <b>cấp quyền truy cập ngay lập tức</b>.</li>
        <li>Quý khách mở nội dung tại mục <b>“Khoá học của tôi”</b> hoặc xem chi tiết/khoá kích hoạt tại <b>“Đơn hàng của tôi”</b> sau khi đăng nhập.</li>
        <li>Không phát sinh phí vận chuyển và không có thời gian chờ giao.</li>
        <li>Nếu sau khi thanh toán thành công mà Quý khách chưa thấy quyền truy cập, vui lòng liên hệ hỗ trợ kèm <b>mã đơn hàng</b> để được cấp lại.</li>
      </ul>

      <h2>2. Hàng vật lý (nếu có)</h2>
      <ul>
        <li>Với sản phẩm vật lý, đơn được xử lý trong <b>[1–2 ngày làm việc]</b> và giao qua đơn vị vận chuyển đối tác.</li>
        <li>Thời gian giao dự kiến: nội thành <b>[1–3 ngày]</b>, ngoại tỉnh <b>[3–7 ngày]</b> tuỳ khu vực.</li>
        <li>Phí vận chuyển được tính theo khu vực và hiển thị khi đặt hàng.</li>
        <li>Quý khách vui lòng kiểm tra hàng khi nhận; nếu có sai/hư hỏng do vận chuyển, xem{' '}
          <a href="/chinh-sach-doi-tra" className="text-neon-violet hover:underline">Chính sách đổi trả &amp; hoàn tiền</a>.</li>
      </ul>

      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        * Các mốc thời gian trong [dấu ngoặc] cần được điều chỉnh theo thực tế của
        người bán trước khi công bố.
      </p>
    </LegalShell>
  );
}
