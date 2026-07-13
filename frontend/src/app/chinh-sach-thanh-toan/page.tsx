import type { Metadata } from 'next';
import LegalShell from '@/components/legal/LegalShell';

export const metadata: Metadata = {
  title: 'Chính sách thanh toán',
  description: 'Các hình thức thanh toán được chấp nhận trên CuongThai (PayOS, VNPay), quy trình ghi nhận và bảo mật giao dịch.',
  alternates: { canonical: 'https://cuongthai.com/chinh-sach-thanh-toan' },
};

export default function Page() {
  return (
    <LegalShell title="Chính sách thanh toán" activeHref="/chinh-sach-thanh-toan">
      <h2>1. Hình thức thanh toán</h2>
      <p>Website chấp nhận thanh toán trực tuyến qua các cổng:</p>
      <ul>
        <li><b>PayOS</b> — chuyển khoản/quét mã QR ngân hàng.</li>
        <li><b>VNPay</b> — thẻ ATM nội địa, thẻ quốc tế, ví/QR (tuỳ ngân hàng hỗ trợ).</li>
      </ul>
      <p>
        Toàn bộ giá sản phẩm/khoá học hiển thị trên website là giá cuối cùng bằng
        <b> Đồng Việt Nam (VND)</b>, đã bao gồm các loại thuế/phí áp dụng (nếu có).
        Phí vận chuyển (với hàng vật lý) được tính và hiển thị riêng khi đặt hàng.
      </p>

      <h2>2. Quy trình ghi nhận thanh toán</h2>
      <ul>
        <li>Sau khi Quý khách hoàn tất trên cổng, hệ thống nhận kết quả từ PayOS/VNPay và cập nhật đơn sang trạng thái <b>Đã thanh toán</b>.</li>
        <li>Với khoá học và hàng số: quyền truy cập được cấp <b>ngay</b> sau khi ghi nhận thành công.</li>
        <li>Nếu thanh toán chưa hoàn tất/bị huỷ, đơn giữ trạng thái chờ và Quý khách có thể thanh toán lại.</li>
      </ul>

      <h2>3. Bảo mật giao dịch</h2>
      <p>
        Giao dịch thanh toán được xử lý trực tiếp trên hạ tầng của PayOS/VNPay theo
        tiêu chuẩn của các đơn vị này. Website <b>không lưu trữ</b> thông tin thẻ/
        tài khoản ngân hàng của Quý khách. Xem thêm{' '}
        <a href="/chinh-sach-bao-mat" className="text-neon-violet hover:underline">Chính sách bảo mật</a>.
      </p>

      <h2>4. Hoá đơn &amp; hỗ trợ</h2>
      <p>
        Quý khách cần hoá đơn hoặc gặp sự cố thanh toán (đã trừ tiền nhưng đơn chưa
        cập nhật…), vui lòng liên hệ theo thông tin ở mục “Thông tin người bán” kèm
        <b> mã đơn hàng</b> để được đối soát và xử lý.
      </p>
    </LegalShell>
  );
}
