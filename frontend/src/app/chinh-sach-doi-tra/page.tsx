import type { Metadata } from 'next';
import LegalShell from '@/components/legal/LegalShell';

export const metadata: Metadata = {
  title: 'Chính sách đổi trả & hoàn tiền',
  description: 'Chính sách đổi trả và hoàn tiền của CuongThai cho khoá học, hàng số và hàng vật lý; các trường hợp được hỗ trợ hoàn tiền.',
  alternates: { canonical: 'https://cuongthai.com/chinh-sach-doi-tra' },
};

export default function Page() {
  return (
    <LegalShell title="Chính sách đổi trả & hoàn tiền" activeHref="/chinh-sach-doi-tra">
      <h2>1. Khoá học &amp; hàng số</h2>
      <ul>
        <li>Do đặc thù nội dung số được <b>cấp quyền truy cập ngay</b> sau thanh toán, sản phẩm đã cấp quyền/đã kích hoạt <b>không áp dụng đổi trả hoặc hoàn tiền</b>, trừ các trường hợp dưới đây.</li>
        <li><b>Được hoàn tiền</b> khi: (a) lỗi kỹ thuật từ phía hệ thống khiến Quý khách <b>không thể truy cập</b> nội dung và người bán không khắc phục được; (b) đã thanh toán nhưng <b>không nhận được</b> quyền truy cập/sản phẩm; (c) bị tính tiền <b>trùng/nhiều lần</b> cho một đơn.</li>
        <li>Thời hạn yêu cầu: trong vòng <b>[48 giờ]</b> kể từ khi thanh toán, kèm <b>mã đơn hàng</b> và mô tả sự cố.</li>
      </ul>

      <h2>2. Hàng vật lý (nếu có)</h2>
      <ul>
        <li>Được đổi/trả trong <b>[03 ngày]</b> kể từ khi nhận hàng nếu: sản phẩm <b>hư hỏng do vận chuyển</b>, <b>sai mẫu/sai mô tả</b>, hoặc lỗi từ nhà sản xuất.</li>
        <li>Điều kiện: sản phẩm còn nguyên vẹn, đầy đủ phụ kiện/bao bì, có hình ảnh/bằng chứng lỗi.</li>
        <li>Chi phí đổi trả do lỗi người bán sẽ do người bán chịu; các trường hợp khác theo thoả thuận.</li>
      </ul>

      <h2>3. Quy trình &amp; thời gian hoàn tiền</h2>
      <ul>
        <li>Gửi yêu cầu qua thông tin liên hệ ở cuối trang, kèm <b>mã đơn hàng</b> + lý do + bằng chứng.</li>
        <li>Người bán phản hồi trong <b>[24–48 giờ làm việc]</b>. Nếu được chấp thuận, tiền được hoàn về phương thức thanh toán ban đầu qua PayOS/VNPay trong <b>[3–7 ngày làm việc]</b> (tuỳ ngân hàng/cổng).</li>
      </ul>

      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        * Các mốc thời gian/điều kiện trong [dấu ngoặc] cần được người bán chốt theo
        thực tế trước khi công bố.
      </p>
    </LegalShell>
  );
}
