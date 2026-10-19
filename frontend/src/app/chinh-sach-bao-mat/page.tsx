import type { Metadata } from 'next';
import LegalShell from '@/components/legal/LegalShell';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description: 'Chính sách bảo mật thông tin của CuongThai theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP: dữ liệu thu thập, mục đích, chia sẻ, thời hạn lưu trữ và quyền của chủ thể dữ liệu.',
  alternates: { canonical: 'https://cuongthai.com/chinh-sach-bao-mat' },
};

export default function Page() {
  return (
    <LegalShell title="Chính sách bảo mật" activeHref="/chinh-sach-bao-mat" updated="2026-10-19">
      <p>
        CuongThai tôn trọng và bảo vệ thông tin cá nhân của người dùng, tuân thủ
        <b> Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15</b> và <b>Nghị định 356/2025/NĐ-CP</b> (hiệu lực từ 01/01/2026, thay thế Nghị định 13/2023/NĐ-CP). Chính sách này
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
        <li><b>Đăng nhập bên thứ ba</b> (Google, GitHub, Apple) — khi Quý khách chọn đăng nhập bằng các dịch vụ này.</li>
        <li><b>Hạ tầng lưu trữ &amp; giám sát lỗi</b> (lưu trữ tệp, theo dõi lỗi kỹ thuật) — để vận hành website.</li>
        <li><b>Nhà cung cấp AI</b> — chỉ nội dung Quý khách chủ động gửi cho một tính năng AI (trò chuyện, tóm tắt, gợi ý…) được chuyển tới mô hình ngôn ngữ (Anthropic, OpenAI, trực tiếp hoặc qua cổng trung gian) để tạo câu trả lời. <b>Groq</b> chuyển giọng nói thành chữ (tin nhắn thoại, biên bản họp trong CT Work) — chỉ khi Quý khách đồng ý trong ứng dụng.</li>
        <li><b>Apple</b> — đăng nhập bằng Apple và gửi thông báo đẩy (APNs) tới ứng dụng iOS.</li>
      </ul>
      <p>Chúng tôi <b>không bán</b> dữ liệu cá nhân cho bên thứ ba vì mục đích quảng cáo.</p>

      <h2>4. Thời hạn lưu trữ</h2>
      <ul>
        <li><b>Dữ liệu tài khoản:</b> lưu trong suốt thời gian tài khoản hoạt động. Khi Quý khách yêu cầu xoá, dữ liệu cá nhân được ẩn danh hoá (xem mục 5).</li>
        <li><b>Thông tin đăng nhập kỹ thuật</b> (IP, thiết bị): chỉ giữ của <b>lần đăng nhập gần nhất</b> (ghi đè ở mỗi lần đăng nhập) để phát hiện truy cập lạ; bị xoá/ẩn danh khi Quý khách xoá tài khoản.</li>
        <li><b>Dữ liệu đơn hàng:</b> lưu theo yêu cầu kế toán/pháp lý; khi tài khoản bị xoá, thông tin cá nhân gắn với đơn được <b>ẩn danh hoá</b> nhưng bản ghi giao dịch được giữ để đối soát.</li>
      </ul>

      <h2>5. Quyền của chủ thể dữ liệu</h2>
      <p>Theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP, Quý khách có quyền:</p>
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

      <h2 id="youtube">7. Dịch vụ API YouTube (YouTube API Services)</h2>
      <p>
        CuongThai đăng các video bài giảng do chính chúng tôi sản xuất lên kênh YouTube của CuongThai bằng một công cụ nội bộ
        (“CuongThai Lesson Uploader”) sử dụng <b>YouTube API Services</b>, rồi nhúng các video đó vào trang bài học tương ứng trên website.
      </p>
      <div lang="en">
        <p>
          <b>English summary.</b> CuongThai uses <b>YouTube API Services</b>. Our internal API client “CuongThai Lesson Uploader”
          is used only by the CuongThai channel owner to upload our own lesson videos (with title, description, captions,
          thumbnail and playlist placement) to our own YouTube channel. Lesson pages on cuongthai.com may embed the YouTube player.
          By watching embedded YouTube videos you agree to be bound by the{' '}
          <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">YouTube Terms of Service</a>, and
          YouTube’s handling of data is described in the{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.
        </p>
        <ul>
          <li><b>Information accessed:</b> only the OAuth 2.0 authorization of the CuongThai channel owner’s own Google account (scopes
            for uploading videos and managing that channel’s captions, thumbnails and playlists). We do not access, collect or store
            any YouTube data of website visitors or of any other channel.</li>
          <li><b>Storage:</b> the owner’s OAuth tokens are stored only on the owner’s own computer, never on our servers. We store the
            public video ID of each of our own uploaded lessons so the lesson page can embed it.</li>
          <li><b>Sharing:</b> we do not share, sell or transfer any data obtained through YouTube API Services to third parties.</li>
          <li><b>Cookies:</b> the embedded YouTube player is provided by YouTube and may store or read cookies or similar
            technologies on your device in accordance with the Google Privacy Policy. CuongThai itself does not place cookies for
            YouTube API purposes.</li>
          <li><b>Revoking access &amp; deletion:</b> access granted to the API client can be revoked at any time via the{' '}
            <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noopener noreferrer">Google
            security settings page</a>. On revocation, or on request to the contact below, any stored authorization data is deleted
            within 7 days, and API data we stored is refreshed or deleted within 30 days as required by the YouTube API Services
            Developer Policies.</li>
        </ul>
      </div>

    </LegalShell>
  );
}
