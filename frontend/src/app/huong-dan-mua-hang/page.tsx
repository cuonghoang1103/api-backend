import type { Metadata } from 'next';
import LegalShell from '@/components/legal/LegalShell';

export const metadata: Metadata = {
  title: 'Hướng dẫn mua hàng',
  description: 'Hướng dẫn các bước đặt mua sản phẩm/khoá học trên CuongThai: chọn sản phẩm, thanh toán, nhận hàng và tra cứu đơn.',
  alternates: { canonical: 'https://cuongthai.com/huong-dan-mua-hang' },
};

export default function Page() {
  return (
    <LegalShell title="Hướng dẫn mua hàng" activeHref="/huong-dan-mua-hang">
      <p>
        Trang này hướng dẫn Quý khách các bước đặt mua sản phẩm và khoá học trên
        website <b>cuongthai.com</b>. Nếu cần hỗ trợ, vui lòng liên hệ theo thông
        tin ở mục “Thông tin người bán” cuối trang.
      </p>

      <h2>1. Chọn sản phẩm / khoá học</h2>
      <ul>
        <li>Truy cập mục <b>Shop</b> (sản phẩm) hoặc <b>Khoá học</b> để xem danh sách.</li>
        <li>Nhấn vào sản phẩm/khoá học để xem chi tiết: mô tả, giá, hình thức giao (hàng số / khoá học truy cập online).</li>
        <li>Với sản phẩm vật lý: chọn số lượng và thêm vào giỏ; với khoá học/hàng số: nhấn mua/đăng ký ngay.</li>
      </ul>

      <h2>2. Đặt hàng &amp; điền thông tin</h2>
      <ul>
        <li>Kiểm tra giỏ hàng, nhấn <b>Thanh toán</b>.</li>
        <li>Điền đầy đủ họ tên, số điện thoại, email (và địa chỉ nhận hàng nếu là hàng vật lý). Thông tin này được dùng để xử lý đơn và liên hệ khi cần.</li>
      </ul>

      <h2>3. Thanh toán</h2>
      <p>
        Chúng tôi hỗ trợ thanh toán trực tuyến qua <b>PayOS</b> và <b>VNPay</b>.
        Sau khi cổng thanh toán báo thành công, đơn hàng của Quý khách được ghi
        nhận trạng thái <b>Đã thanh toán</b>. Chi tiết xem tại{' '}
        <a href="/chinh-sach-thanh-toan" className="text-neon-violet hover:underline">Chính sách thanh toán</a>.
      </p>

      <h2>4. Nhận hàng / truy cập</h2>
      <ul>
        <li><b>Khoá học &amp; hàng số:</b> quyền truy cập được cấp <b>ngay lập tức</b> sau khi thanh toán thành công. Quý khách xem/mở tại mục <b>“Đơn hàng của tôi”</b> hoặc <b>“Khoá học của tôi”</b>.</li>
        <li><b>Hàng vật lý:</b> đơn được xử lý và giao theo{' '}
          <a href="/chinh-sach-giao-hang" className="text-neon-violet hover:underline">Chính sách giao hàng</a>.</li>
      </ul>

      <h2>5. Tra cứu đơn hàng</h2>
      <p>
        Quý khách đăng nhập và vào mục <b>“Đơn hàng của tôi”</b> để xem trạng thái,
        hoặc tra cứu bằng <b>mã đơn hàng</b> đã nhận. Mọi thắc mắc về đơn, vui lòng
        liên hệ hỗ trợ.
      </p>
    </LegalShell>
  );
}
