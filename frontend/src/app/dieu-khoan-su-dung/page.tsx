import type { Metadata } from 'next';
import LegalShell from '@/components/legal/LegalShell';

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng',
  description: 'Điều khoản sử dụng website CuongThai: tài khoản, nội dung học tập, sở hữu trí tuệ, video nhúng từ YouTube và giới hạn trách nhiệm.',
  alternates: { canonical: 'https://cuongthai.com/dieu-khoan-su-dung' },
};

export default function Page() {
  return (
    <LegalShell title="Điều khoản sử dụng" activeHref="/dieu-khoan-su-dung" updated="2026-10-14">
      <p>
        Khi truy cập và sử dụng website <b>cuongthai.com</b> (“CuongThai”), Quý khách đồng ý với các điều khoản dưới đây.
        Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.
      </p>

      <h2>1. Tài khoản</h2>
      <ul>
        <li>Quý khách chịu trách nhiệm giữ bí mật thông tin đăng nhập và mọi hoạt động diễn ra dưới tài khoản của mình.</li>
        <li>Không dùng tài khoản để phát tán nội dung vi phạm pháp luật, spam, hoặc can thiệp vào hệ thống.</li>
      </ul>

      <h2>2. Nội dung học tập &amp; sở hữu trí tuệ</h2>
      <ul>
        <li>Bài giảng, video, slide, bài tập do CuongThai sản xuất thuộc quyền sở hữu của CuongThai; chỉ dùng cho mục đích học tập cá nhân.</li>
        <li>Không sao chép, bán lại hoặc phát hành lại nội dung khi chưa có sự đồng ý bằng văn bản.</li>
      </ul>

      <h2>3. Video YouTube nhúng trong bài học</h2>
      <p>
        Một số bài học nhúng video từ kênh YouTube của CuongThai, được đăng bằng YouTube API Services. Khi xem các video này,
        Quý khách đồng thời đồng ý tuân theo{' '}
        <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">Điều khoản dịch vụ của YouTube</a>{' '}
        và việc xử lý dữ liệu được mô tả trong{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Chính sách bảo mật của Google</a>.
        Chi tiết xem <a href="/chinh-sach-bao-mat#youtube">mục 7 Chính sách bảo mật</a>.
      </p>
      <p lang="en">
        <b>English.</b> By using cuongthai.com, including watching lesson videos embedded from YouTube, you agree to be bound by
        the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">YouTube Terms of Service</a>.
        Our use of YouTube API Services and the data involved are described in section 7 of our{' '}
        <a href="/chinh-sach-bao-mat#youtube">Privacy Policy</a>, together with the{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.
      </p>

      <h2>4. Giới hạn trách nhiệm</h2>
      <p>
        Nội dung được cung cấp nhằm mục đích học tập. CuongThai nỗ lực đảm bảo tính chính xác nhưng không bảo đảm nội dung
        không có sai sót, và không chịu trách nhiệm cho thiệt hại phát sinh từ việc áp dụng nội dung vào thực tế.
      </p>

      <h2>5. Thay đổi điều khoản</h2>
      <p>CuongThai có thể cập nhật điều khoản; ngày cập nhật gần nhất hiển thị ở đầu trang.</p>
    </LegalShell>
  );
}
