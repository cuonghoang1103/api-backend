import type { Metadata } from 'next';
import LegalShell from '@/components/legal/LegalShell';

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng',
  description: 'Điều khoản sử dụng website CuongThai và ứng dụng CT Work: tài khoản, nội dung học tập, sở hữu trí tuệ, video nhúng từ YouTube, quy tắc cộng đồng CT Work (không khoan nhượng với nội dung phản cảm, báo cáo và chặn, xử lý trong 24 giờ) và giới hạn trách nhiệm. Có bản tiếng Anh.',
  alternates: { canonical: 'https://cuongthai.com/dieu-khoan-su-dung' },
};

export default function Page() {
  return (
    <LegalShell title="Điều khoản sử dụng" activeHref="/dieu-khoan-su-dung" updated="2026-10-22">
      <p>
        Khi truy cập và sử dụng website <b>cuongthai.com</b> (“CuongThai”) và các ứng dụng của CuongThai, trong đó có ứng dụng <b>CT Work</b>,
        Quý khách đồng ý với các điều khoản dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.
      </p>
      <p lang="en">
        <i>By using cuongthai.com and CuongThai apps, including the CT Work app, you agree to these terms. The CT Work community rules are
        in English in <a href="#ct-work-community-rules">section 4</a>.</i>
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
        Chi tiết xem <a href="/chinh-sach-bao-mat#youtube">mục 12 Chính sách bảo mật</a>.
      </p>
      <p lang="en">
        <b>English.</b> By using cuongthai.com, including watching lesson videos embedded from YouTube, you agree to be bound by
        the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">YouTube Terms of Service</a>.
        Our use of YouTube API Services and the data involved are described in section 12 of our{' '}
        <a href="/chinh-sach-bao-mat#youtube">Privacy Policy</a>, together with the{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.
      </p>

      <h2 id="quy-tac-ct-work">4. Quy tắc cộng đồng CT Work</h2>
      <p>
        CT Work (web và ứng dụng) cho phép Quý khách đăng bài và bình luận trên Bảng tin, nhắn tin riêng, chat trong kênh, bình luận trên thẻ công việc và tài liệu,
        và đặt tên hiển thị, ảnh, giới thiệu trên hồ sơ. Khi dùng các tính năng này, Quý khách đồng ý:
      </p>
      <ul>
        <li><b>Không khoan nhượng</b> với nội dung phản cảm và người dùng có hành vi lạm dụng. Nội dung vi phạm bị gỡ và tài khoản vi phạm bị khoá, có thể vĩnh viễn,
          không cần báo trước.</li>
        <li><b>Bị cấm:</b> lời lẽ thù ghét hoặc xúc phạm theo sắc tộc, tôn giáo, giới tính, xu hướng tính dục, khuyết tật hay nguồn gốc; quấy rối, bắt nạt, đe doạ,
          kích động bạo lực hoặc tự hại; nội dung khiêu dâm, tình dục trần trụi, hoặc bất kỳ nội dung tình dục nào liên quan tới trẻ vị thành niên; nội dung bạo lực ghê rợn;
          spam, lừa đảo, mạo danh; chia sẻ thông tin cá nhân của người khác khi chưa được đồng ý; nội dung vi phạm pháp luật Việt Nam hoặc quyền sở hữu trí tuệ.</li>
        <li><b>Lọc tự động:</b> máy chủ từ chối bài viết, bình luận, tin nhắn, tên hiển thị và giới thiệu có từ ngữ tục tĩu nặng, xúc phạm, tình dục trần trụi hoặc
          đe doạ (tiếng Việt và tiếng Anh). Bộ lọc không bắt được mọi thứ — trách nhiệm về nội dung vẫn thuộc về người đăng.</li>
        <li><b>Báo cáo, ẩn và chặn:</b> Quý khách có thể báo cáo bất kỳ bài viết, bình luận, tin nhắn hay hồ sơ nào (nút “Báo cáo”), ẩn nội dung khỏi màn hình của mình
          và chặn người dùng — người bị chặn không thể nhắn tin cho Quý khách và bài của họ không còn hiện với Quý khách.</li>
        <li><b>Xử lý trong 24 giờ:</b> mọi báo cáo được gửi tới đội kiểm duyệt CuongThai (và quản trị viên của không gian/dự án liên quan) và được xem xét
          <b> trong vòng 24 giờ</b>. Nội dung vi phạm bị gỡ và người đăng bị khoá tài khoản.</li>
        <li>Quản trị viên không gian/dự án cũng có thể gỡ nội dung và xoá thành viên trong phạm vi của mình. Liên hệ đội kiểm duyệt theo thông tin ở cuối trang.</li>
      </ul>
      <div lang="en" id="ct-work-community-rules">
        <p><b>CT Work community rules (English).</b> CT Work (web and app) lets you post and comment in the Team Feed, send direct messages, chat in channels,
          comment on issues and documents, and set a display name, photos and bio on your profile. By using these features you agree that:</p>
        <ul>
          <li>There is <b>zero tolerance</b> for objectionable content and abusive users. Violating content is removed and offending accounts are suspended, possibly
            permanently, without notice.</li>
          <li><b>Prohibited:</b> hate speech or slurs based on race, ethnicity, religion, gender, sexual orientation, disability or origin; harassment, bullying, threats,
            incitement to violence or self-harm; pornographic or explicit sexual content, and any sexual content involving minors; graphic violence; spam, scams and
            impersonation; sharing other people’s personal information without consent; content that breaks Vietnamese law or infringes intellectual property.</li>
          <li><b>Automatic filtering:</b> our server rejects posts, comments, messages, display names and bios containing severe profanity, slurs, explicit sexual terms
            or threats (Vietnamese and English). The filter cannot catch everything — you remain responsible for what you post.</li>
          <li><b>Report, hide and block:</b> you can report any post, comment, message or profile (the “Report” action), hide content from your own view and block
            users — a blocked user cannot message you and their posts no longer appear for you.</li>
          <li><b>Reviewed within 24 hours:</b> every report goes to the CuongThai moderation team (and to the admins of the workspace/project concerned) and is reviewed
            <b> within 24 hours</b>. Violating content is removed and the user who posted it is banned.</li>
          <li>Workspace and project admins can also remove content and members within their own space. Contact the moderation team using the details at the bottom of this page.</li>
        </ul>
      </div>

      <h2>5. Giới hạn trách nhiệm</h2>
      <p>
        Nội dung được cung cấp nhằm mục đích học tập. CuongThai nỗ lực đảm bảo tính chính xác nhưng không bảo đảm nội dung
        không có sai sót, và không chịu trách nhiệm cho thiệt hại phát sinh từ việc áp dụng nội dung vào thực tế.
      </p>

      <h2>6. Thay đổi điều khoản</h2>
      <p>CuongThai có thể cập nhật điều khoản; ngày cập nhật gần nhất hiển thị ở đầu trang.</p>
    </LegalShell>
  );
}
