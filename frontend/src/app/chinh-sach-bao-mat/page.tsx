import type { Metadata } from 'next';
import LegalShell from '@/components/legal/LegalShell';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description: 'Chính sách bảo mật thông tin của CuongThai theo Nghị định 13/2023/NĐ-CP: dữ liệu thu thập, mục đích, chia sẻ, thời hạn lưu trữ và quyền của chủ thể dữ liệu.',
  alternates: { canonical: 'https://cuongthai.com/chinh-sach-bao-mat' },
};

export default function Page() {
  return (
    <LegalShell title="Chính sách bảo mật" activeHref="/chinh-sach-bao-mat">
      <p>
        CuongThai tôn trọng và bảo vệ thông tin cá nhân của người dùng, tuân thủ
        <b> Nghị định 13/2023/NĐ-CP</b> về bảo vệ dữ liệu cá nhân. Chính sách này
        mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu của Quý khách.
      </p>

      <h2>1. Thông tin thu thập</h2>
      <ul>
        <li><b>Thông tin tài khoản:</b> họ tên, tên đăng nhập, email, mật khẩu (được mã hoá), ảnh đại diện.</li>
        <li><b>Thông tin đơn hàng:</b> họ tên, số điện thoại, email, địa chỉ nhận hàng (với hàng vật lý).</li>
        <li><b>Dữ liệu kỹ thuật:</b> địa chỉ IP, loại trình duyệt/thiết bị, thời điểm đăng nhập (phục vụ bảo mật &amp; chống gian lận).</li>
        <li><b>Cookie:</b> dùng để duy trì đăng nhập và ghi nhớ tuỳ chọn (giao diện, ngôn ngữ).</li>
      </ul>

      <h2>2. Mục đích sử dụng</h2>
      <ul>
        <li>Xử lý đơn hàng, cấp quyền truy cập khoá học/hàng số, chăm sóc khách hàng.</li>
        <li>Xác thực đăng nhập, bảo mật tài khoản, phát hiện gian lận.</li>
        <li>Cải thiện dịch vụ và liên hệ hỗ trợ khi cần.</li>
      </ul>

      <h2>3. Chia sẻ với bên thứ ba</h2>
      <p>Chúng tôi chỉ chia sẻ dữ liệu tối thiểu cần thiết với các đơn vị:</p>
      <ul>
        <li><b>Cổng thanh toán</b> (PayOS, VNPay) — để xử lý giao dịch.</li>
        <li><b>Đăng nhập bên thứ ba</b> (Google, GitHub) — khi Quý khách chọn đăng nhập bằng các dịch vụ này.</li>
        <li><b>Hạ tầng lưu trữ &amp; giám sát lỗi</b> (lưu trữ tệp, theo dõi lỗi kỹ thuật) — để vận hành website.</li>
      </ul>
      <p>Chúng tôi <b>không bán</b> dữ liệu cá nhân cho bên thứ ba vì mục đích quảng cáo.</p>

      <h2>4. Thời hạn lưu trữ</h2>
      <ul>
        <li><b>Dữ liệu tài khoản:</b> lưu trong suốt thời gian tài khoản hoạt động. Khi Quý khách yêu cầu xoá, dữ liệu cá nhân được ẩn danh hoá (xem mục 5).</li>
        <li><b>Nhật ký đăng nhập</b> (IP, thiết bị): lưu tối đa <b>[90 ngày]</b> rồi tự xoá/ẩn danh.</li>
        <li><b>Dữ liệu đơn hàng:</b> lưu theo yêu cầu kế toán/pháp lý; khi tài khoản bị xoá, thông tin cá nhân gắn với đơn được <b>ẩn danh hoá</b> nhưng bản ghi giao dịch được giữ để đối soát.</li>
      </ul>

      <h2>5. Quyền của chủ thể dữ liệu</h2>
      <p>Theo Nghị định 13/2023/NĐ-CP, Quý khách có quyền:</p>
      <ul>
        <li><b>Truy cập &amp; tải dữ liệu:</b> tự tải bản sao dữ liệu của mình (định dạng JSON) tại <b>Cài đặt → Tài khoản &amp; Dữ liệu</b>.</li>
        <li><b>Chỉnh sửa:</b> cập nhật thông tin cá nhân trong trang hồ sơ.</li>
        <li><b>Xoá dữ liệu:</b> yêu cầu xoá tài khoản — hệ thống sẽ <b>ẩn danh hoá</b> thông tin cá nhân của Quý khách. Thực hiện tại <b>Cài đặt → Tài khoản &amp; Dữ liệu</b>.</li>
        <li><b>Rút đồng ý / khiếu nại:</b> liên hệ theo thông tin ở cuối trang.</li>
      </ul>

      <h2>6. Liên hệ</h2>
      <p>
        Mọi yêu cầu liên quan đến dữ liệu cá nhân, vui lòng liên hệ theo thông tin ở
        mục “Thông tin người bán” bên dưới.
      </p>

      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        * Thời hạn trong [dấu ngoặc] cần được người bán chốt theo thực tế trước khi công bố.
      </p>
    </LegalShell>
  );
}
