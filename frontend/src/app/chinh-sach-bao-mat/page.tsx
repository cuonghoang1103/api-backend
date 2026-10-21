import type { Metadata } from 'next';
import LegalShell from '@/components/legal/LegalShell';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description: 'Chính sách bảo mật thông tin của CuongThai và ứng dụng CT Work theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP: dữ liệu thu thập, tin nhắn riêng, trạng thái hoạt động, trợ lý AI, phiên âm giọng nói, thông báo đẩy, thời hạn lưu trữ, xoá tài khoản và quyền của chủ thể dữ liệu. Có bản tóm tắt tiếng Anh.',
  alternates: { canonical: 'https://cuongthai.com/chinh-sach-bao-mat' },
};

export default function Page() {
  return (
    <LegalShell title="Chính sách bảo mật" activeHref="/chinh-sach-bao-mat" updated="2026-10-22">
      <p>
        CuongThai tôn trọng và bảo vệ thông tin cá nhân của người dùng, tuân thủ
        <b> Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15</b> và <b>Nghị định 356/2025/NĐ-CP</b> (hiệu lực từ 01/01/2026, thay thế Nghị định 13/2023/NĐ-CP). Chính sách này
        mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu của Quý khách trên website cuongthai.com và các ứng dụng
        của CuongThai, trong đó có ứng dụng <b>CT Work</b> trên iOS.
      </p>
      <p lang="en">
        <i>An English summary of this policy is available in <a href="#english">section 13</a>.</i>
      </p>

      <h2>1. Thông tin thu thập</h2>
      <ul>
        <li><b>Thông tin tài khoản:</b> họ tên, tên đăng nhập, email, mật khẩu (được mã hoá), ảnh đại diện.</li>
        <li><b>Thông tin đơn hàng:</b> họ tên, số điện thoại, email, địa chỉ nhận hàng (với hàng vật lý).</li>
        <li><b>Nội dung Quý khách tạo:</b> tin nhắn và tệp đính kèm, tin nhắn thoại, bình luận, thẻ công việc, tài liệu và các nội dung khác trong dự án CT Work (xem mục 6, 8 và 9).</li>
        <li><b>Trạng thái hoạt động:</b> thời điểm hoạt động gần nhất và việc Quý khách đang kết nối hay không (xem mục 7).</li>
        <li><b>Thẻ thiết bị cho thông báo đẩy</b> (xem mục 10).</li>
        <li><b>Micro:</b> chỉ được dùng trong lúc Quý khách chủ động ghi một tin nhắn thoại hoặc ghi âm cuộc họp.</li>
        <li><b>Dữ liệu kỹ thuật:</b> địa chỉ IP, loại trình duyệt/thiết bị, thời điểm đăng nhập (phục vụ bảo mật &amp; chống gian lận).</li>
        <li><b>Cookie:</b> dùng để duy trì đăng nhập và ghi nhớ tuỳ chọn (giao diện, ngôn ngữ).</li>
      </ul>

      <h2>2. Mục đích sử dụng</h2>
      <ul>
        <li>Xử lý đơn hàng, cấp quyền truy cập khoá học/hàng số, chăm sóc khách hàng.</li>
        <li>Cung cấp các tính năng Quý khách dùng: nhắn tin, làm việc nhóm trong CT Work, trợ lý AI, phiên âm tin nhắn thoại, thông báo.</li>
        <li>Xác thực đăng nhập, bảo mật tài khoản, phát hiện gian lận, xử lý báo cáo vi phạm.</li>
        <li>Cải thiện dịch vụ và liên hệ hỗ trợ khi cần.</li>
      </ul>
      <p>Chúng tôi <b>không</b> dùng dữ liệu của Quý khách cho quảng cáo.</p>

      <h2>3. Chia sẻ với bên thứ ba</h2>
      <p>Chúng tôi chỉ chia sẻ dữ liệu tối thiểu cần thiết với các đơn vị:</p>
      <ul>
        <li><b>Cổng thanh toán</b> (PayOS, VNPay) — để xử lý giao dịch.</li>
        <li><b>Đăng nhập bên thứ ba</b> (Google, GitHub, Apple) — khi Quý khách chọn đăng nhập bằng các dịch vụ này.</li>
        <li><b>Hạ tầng lưu trữ &amp; giám sát lỗi</b> (lưu trữ tệp trên <b>Cloudflare R2</b>, theo dõi lỗi kỹ thuật) — để vận hành website và ứng dụng.</li>
        <li><b>Nhà cung cấp mô hình AI</b> (như Anthropic — Claude, OpenAI — GPT), trực tiếp hoặc qua cổng API AI trung gian — chỉ nội dung Quý khách chủ động gửi cho một tính năng AI, kèm phần nội dung cần cho câu trả lời. Chi tiết cho CT Work ở mục 8.</li>
        <li><b>Groq</b> — chuyển giọng nói thành chữ cho tin nhắn thoại và bản ghi âm cuộc họp trong CT Work (xem mục 9).</li>
        <li><b>Apple</b> — đăng nhập bằng Apple và chuyển thông báo đẩy (APNs) tới ứng dụng iOS (xem mục 10).</li>
      </ul>
      <p>Chúng tôi <b>không bán</b> dữ liệu cá nhân cho bên thứ ba.</p>

      <h2>4. Thời hạn lưu trữ</h2>
      <ul>
        <li><b>Dữ liệu tài khoản:</b> lưu trong suốt thời gian tài khoản hoạt động. Khi Quý khách yêu cầu xoá, dữ liệu cá nhân được ẩn danh hoá (xem mục 5).</li>
        <li><b>Thông tin đăng nhập kỹ thuật</b> (IP, thiết bị): hồ sơ tài khoản chỉ giữ của <b>lần đăng nhập gần nhất</b> (ghi đè ở mỗi lần đăng nhập) để phát hiện truy cập lạ, và bị xoá khi Quý khách xoá tài khoản. Nhật ký kỹ thuật của máy chủ có thể ghi địa chỉ IP của các yêu cầu truy cập để vận hành và chống tấn công.</li>
        <li><b>Tin nhắn, tệp đính kèm, tin nhắn thoại và nội dung CT Work:</b> lưu cho tới khi bị xoá hoặc thu hồi theo các cách ở mục 6 và 9 (khi thu hồi hoặc xoá một tin nhắn riêng, tệp đính kèm của tin đó cũng bị xoá khỏi máy chủ). Nội dung Quý khách đã gửi cho người khác vẫn nằm trong cuộc trò chuyện/dự án của họ.</li>
        <li><b>Hội thoại với trợ lý AI và nhật ký sử dụng AI:</b> xem mục 8.</li>
        <li><b>Thẻ thiết bị:</b> lưu cho tới khi Quý khách đăng xuất, gỡ ứng dụng, thẻ hết hiệu lực, hoặc tài khoản bị xoá (xem mục 10).</li>
        <li><b>Dữ liệu đơn hàng:</b> lưu theo yêu cầu kế toán/pháp lý; khi tài khoản bị xoá, thông tin cá nhân gắn với đơn được <b>ẩn danh hoá</b> nhưng bản ghi giao dịch được giữ để đối soát.</li>
      </ul>

      <h2>5. Quyền của chủ thể dữ liệu</h2>
      <p>Theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP, Quý khách có quyền:</p>
      <ul>
        <li><b>Truy cập &amp; tải dữ liệu:</b> tự tải bản sao dữ liệu của mình (định dạng JSON) tại <b>Cài đặt → Tài khoản &amp; Dữ liệu</b>.</li>
        <li><b>Chỉnh sửa:</b> cập nhật thông tin cá nhân trong trang hồ sơ.</li>
        <li>
          <b>Xoá tài khoản:</b> gửi yêu cầu tại <b>Cài đặt → Tài khoản &amp; Dữ liệu</b> trên web, hoặc <b>Account → Delete account</b> trong ứng dụng CT Work.
          Nếu Quý khách không huỷ, yêu cầu <b>tự động có hiệu lực sau 72 giờ</b>; trong 72 giờ đó Quý khách có thể huỷ yêu cầu. Quản trị viên có thể xử lý sớm hơn
          nhưng <b>không thể từ chối</b> yêu cầu xoá tài khoản của Quý khách.
          Khi có hiệu lực: tài khoản bị vô hiệu hoá, mọi phiên đăng nhập bị đăng xuất (kể cả kết nối đang mở), mật khẩu bị xoá; họ tên, tên hiển thị, email, tên đăng nhập,
          ảnh đại diện, ảnh bìa, giới thiệu, số điện thoại, IP và thiết bị đăng nhập gần nhất bị xoá hoặc thay bằng giá trị ẩn danh, và tệp ảnh đại diện/ảnh bìa Quý khách
          đã tải lên bị xoá khỏi kho lưu trữ; thông tin người mua trên đơn hàng được ẩn danh hoá. Đồng thời: <b>mọi thẻ thiết bị bị xoá</b> (không còn thông báo đẩy nào
          tới máy của Quý khách), mọi token API CT Work bị thu hồi và các kết nối tài khoản bên ngoài (như Microsoft, Google) bị gỡ, trạng thái hoạt động bị tắt và xoá mốc,
          các hội thoại AI riêng của Quý khách (AI Chat trên web và hội thoại “Riêng tư” với trợ lý CT Work) bị xoá.
          Nội dung Quý khách đã chia sẻ với người khác (tin nhắn đã gửi, thẻ, bình luận, tài liệu, hội thoại AI ở chế độ “Dự án” trong CT Work…) vẫn nằm lại trong cuộc
          trò chuyện/dự án của họ nhưng chỉ còn gắn với một tài khoản đã ẩn danh. Muốn gỡ nội dung cụ thể, Quý khách có thể tự xoá trước, hoặc liên hệ chúng tôi.
        </li>
        <li><b>Rút đồng ý / khiếu nại:</b> rút đồng ý cho từng tính năng trong ứng dụng (xem mục 8, 9) hoặc liên hệ theo thông tin ở cuối trang.</li>
      </ul>

      <h2 id="tin-nhan">6. Tin nhắn riêng và tệp đính kèm</h2>
      <ul>
        <li><b>Lưu trữ:</b> tin nhắn riêng (1-1) được lưu trên máy chủ của chúng tôi để đồng bộ giữa các thiết bị; tệp đính kèm (tối đa 10 MB/tệp) được lưu trên Cloudflare R2.
          Trong ứng dụng, chỉ những người tham gia cuộc trò chuyện xem được nội dung. Tệp đính kèm được mở qua một đường dẫn khó đoán — ai có đường dẫn đó đều mở được,
          vì vậy xin đừng chia sẻ đường dẫn tệp ra ngoài.</li>
        <li><b>Thu hồi:</b> người gửi có thể thu hồi một tin trong vòng <b>5 phút</b> sau khi gửi (máy chủ từ chối sau thời hạn này). Khi thu hồi, phần chữ của tin bị xoá khỏi
          máy chủ, <b>tệp đính kèm của tin bị xoá khỏi kho lưu trữ</b> (đường dẫn tệp không còn mở được) và cả hai bên thấy “Tin nhắn đã thu hồi”.</li>
        <li><b>Xoá tin:</b> Quý khách có thể xoá tin của chính mình bất kỳ lúc nào; phần chữ (và ảnh động/sticker) của tin bị ẩn với mọi người trong cuộc trò chuyện, kể cả ở dòng
          xem trước trong hộp thư (bản ghi được đánh dấu đã xoá), và <b>tệp đính kèm của tin bị xoá khỏi kho lưu trữ</b>.
          Nếu Quý khách đã gửi cùng một tệp trong một tin khác vẫn còn, tệp được giữ cho tới khi tin cuối cùng chứa nó bị xoá hoặc thu hồi.</li>
        <li><b>Xoá cuộc trò chuyện:</b> chỉ xoá ở phía Quý khách — người kia vẫn giữ bản của họ. Quý khách có thể khôi phục cuộc trò chuyện (kèm toàn bộ lịch sử) ở mục “Đã xoá”.</li>
        <li><b>Đã xem và đang soạn tin:</b> mốc “đã xem” được lưu và hiển thị cho người còn lại trong cuộc trò chuyện. Tín hiệu “đang soạn tin” chỉ được chuyển tiếp tức thời tới
          người kia và không được lưu.</li>
        <li><b>Báo cáo và chặn:</b> Quý khách có thể báo cáo một cuộc trò chuyện (lý do và loại vi phạm); đội kiểm duyệt xem báo cáo cùng tin nhắn gần nhất của cuộc trò chuyện đó để xử lý,
          và có thể gỡ tin vi phạm. Khi Quý khách chặn một người, người đó không thể nhắn tin, mở cuộc trò chuyện mới hay bắt đầu nhắn riêng với Quý khách trong CT Work,
          và hai người không còn thấy trạng thái hoạt động của nhau (mục 7).</li>
        <li><b>Nhắn riêng trong CT Work:</b> là một kênh riêng chỉ hai người xem được. Quý khách xoá tin của mình bất kỳ lúc nào; quản trị viên dự án có thể gỡ tin vi phạm;
          tin bị báo cáo được gửi tới quản trị viên dự án và đội kiểm duyệt.</li>
      </ul>

      <h2 id="trang-thai-hoat-dong">7. Trạng thái hoạt động</h2>
      <ul>
        <li><b>Hiển thị gì:</b> chấm xanh “đang hoạt động” khi Quý khách đang kết nối, và “hoạt động N phút trước” dựa trên mốc hoạt động gần nhất (<i>lastActiveAt</i>).
          Khi mở, ứng dụng gửi tín hiệu định kỳ tới máy chủ để cập nhật mốc này.</li>
        <li><b>Ai thấy:</b> chỉ người dùng đã đăng nhập <b>có quan hệ với Quý khách</b>: bạn bè, người đã có cuộc trò chuyện với Quý khách, và thành viên cùng không gian làm việc
          CT Work (không tính khách của cổng khách hàng). Khách chưa đăng nhập và người lạ không thấy trạng thái của Quý khách ở bất kỳ đâu — trang cá nhân, danh sách
          người theo dõi/bạn bè, Tin nhắn, danh sách Thành viên CT Work hay danh sách “Đang online” (danh sách này chỉ gồm những người có quan hệ với người xem).</li>
        <li><b>Tắt trạng thái hoạt động:</b> tắt “Hiển thị trạng thái hoạt động” (trong phần chỉnh sửa hồ sơ của ứng dụng, hoặc phần trạng thái hoạt động của CT Work).
          Khi tắt, chấm xanh và thời điểm hoạt động của Quý khách không được gửi tới bất kỳ ai, ở mọi nơi kể trên. Các danh sách áp dụng ngay; tín hiệu trực tiếp
          (chấm xanh bật/tắt theo thời gian thực) áp dụng đầy đủ từ lần ứng dụng kết nối lại.</li>
        <li><b>Luật đối ứng:</b> nếu Quý khách tắt trạng thái của mình thì Quý khách cũng không thấy trạng thái của người khác, ở mọi nơi kể trên.</li>
        <li><b>Chặn và AI agent:</b> hai người đã chặn nhau (bất kỳ chiều nào) không thấy trạng thái của nhau ở bất kỳ đâu; AI agent không có trạng thái hoạt động.</li>
      </ul>

      <h2 id="ai">8. Trợ lý AI CuongMini trong CT Work</h2>
      <ul>
        <li><b>Khi nào dữ liệu được gửi:</b> chỉ khi Quý khách chủ động dùng một tính năng AI — hỏi trợ lý (chat), tác vụ nhanh (viết story, tách việc, sinh test case,
          tóm tắt, rà soát yêu cầu…), bản tin hằng ngày, báo cáo tuần, lập kế hoạch sprint, hoặc <b>“Create with CuongMini”</b>.</li>
        <li><b>Gửi gì:</b> câu hỏi hoặc yêu cầu của Quý khách, các lượt trước trong cùng hội thoại, và phần nội dung dự án mà Quý khách đã có quyền xem cần cho câu trả lời:
          thẻ (tiêu đề, mô tả, trạng thái, người được giao), bình luận, trang Docs, chữ trong tệp đính kèm, liên kết, tên hiển thị thành viên.
          Với “Create with CuongMini”: đề bài, các tệp Quý khách tải lên, nội dung các liên kết/kho mã Quý khách dán, và danh sách thành viên Quý khách cung cấp
          (họ tên, mã sinh viên, email, vai trò, kỹ năng…) để soạn bản nháp dự án.</li>
        <li><b>Gửi tới đâu:</b> nhà cung cấp mô hình AI bên thứ ba (như Anthropic — Claude và OpenAI — GPT), qua API của Anthropic hoặc qua cổng API AI trung gian
          (như modelapi.vn, rambo.ai.vn). Các bên này xử lý dữ liệu theo điều khoản của họ.</li>
        <li><b>Mục đích:</b> chỉ để tạo câu trả lời hoặc bản nháp cho Quý khách. Không dùng cho quảng cáo, không bán. <b>Chúng tôi không dùng nội dung của Quý khách để huấn luyện mô hình AI.</b>
          AI không tự thay đổi dự án: mọi thay đổi AI đề xuất chỉ được thực hiện khi một người bấm áp dụng, và chạy dưới quyền của chính người đó.</li>
        <li><b>Lưu trữ:</b> hội thoại với trợ lý được lưu trên máy chủ để xem lại. Mặc định hội thoại thuộc chế độ “Dự án” (thành viên xem được dự án đều đọc được); Quý khách có thể
          chọn “Riêng tư” để chỉ mình xem. Người tạo hoặc quản trị viên dự án có thể xoá hội thoại; hội thoại đã xoá không còn hiển thị với ai.
          Chúng tôi ghi nhật ký sử dụng AI (thời điểm, tính năng, model, số token, chi phí ước tính, thành công hay lỗi) — nhật ký này <b>không chứa nội dung</b> câu hỏi và câu trả lời;
          quản trị viên dự án xem được nhật ký của dự án, mỗi thành viên xem được phần của mình.</li>
        <li><b>Đồng ý:</b> ứng dụng CT Work trên iOS hỏi ý kiến đồng ý của Quý khách trước lần dùng trợ lý AI đầu tiên; Quý khách có thể rút lại trong <b>Account → Privacy</b>.
          Rút đồng ý không ảnh hưởng tới các lần đã gửi trước đó.</li>
        <li><b>Nhãn và báo cáo:</b> câu trả lời của AI được gắn nhãn “AI-generated” và có thể bị báo cáo; báo cáo (kèm câu hỏi và câu trả lời) được gửi tới đội kiểm duyệt CT Work.
          Câu trả lời của AI có thể sai — xin kiểm tra lại trước khi dùng.</li>
      </ul>

      <h2 id="groq">9. Phiên âm tin nhắn thoại (Groq)</h2>
      <ul>
        <li>Khi Quý khách gửi một tin nhắn thoại trong kênh chat hoặc bình luận CT Work, bản ghi âm được lưu trên Cloudflare R2 cho những người xem được kênh/thẻ đó.
          Máy chủ gửi bản ghi âm tới <b>Groq</b> (dịch vụ chuyển giọng nói thành chữ của bên thứ ba) để tạo bản chữ hiển thị dưới tin nhắn cho đồng đội.</li>
        <li>Chúng tôi không ghi nội dung bản ghi âm hay bản chữ vào nhật ký hệ thống. Bản ghi âm và bản chữ được lưu cùng tin nhắn/bình luận cho tới khi bị xoá.</li>
        <li>Ứng dụng CT Work trên iOS hỏi ý kiến đồng ý trước tin nhắn thoại đầu tiên; không có gì được ghi âm cho tới khi Quý khách bấm micro.</li>
        <li>Ghi âm cuộc họp trong CT Work chỉ bắt đầu khi mọi người đang có mặt trong phòng họp đã đồng ý (với tệp ghi âm tải lên, người tải lên phải xác nhận đã có sự đồng ý);
          bản ghi được phiên âm bằng Groq theo cùng cách.</li>
      </ul>

      <h2 id="thong-bao-day">10. Thông báo đẩy</h2>
      <ul>
        <li><b>Dữ liệu lưu:</b> khi Quý khách cho phép thông báo, ứng dụng iOS gửi thẻ thiết bị APNs (kèm ứng dụng và môi trường) tới máy chủ (<i>POST /api/v1/devices</i>);
          thẻ được gắn với tài khoản để gửi thông báo qua dịch vụ Apple Push Notification (APNs).</li>
        <li><b>Nội dung thông báo:</b> tin nhắn riêng (tên người gửi và đoạn đầu tin nhắn), và các thông báo CT Work: được giao việc, bình luận, được nhắc tên, cảnh báo và yêu cầu phê duyệt,
          tin nhắn chat, hoạt động Git, nhắc lịch họp, lời mời. Nội dung này đi qua máy chủ của Apple và có thể hiện trên màn hình khoá tuỳ cài đặt iPhone của Quý khách.</li>
        <li><b>Tuỳ chỉnh:</b> trong CT Work Quý khách bật/tắt riêng từng loại (giao việc, bình luận, nhắc tên, cảnh báo, phê duyệt, mọi tin chat, Git); lời mời luôn được gửi.
          Ứng dụng dùng âm thanh thông báo riêng; Quý khách có thể tắt âm thanh hoặc toàn bộ thông báo trong Cài đặt của iPhone.</li>
        <li><b>Gỡ thẻ:</b> khi Quý khách đăng xuất, ứng dụng gỡ thẻ khỏi máy chủ; khi Apple báo thẻ không còn hiệu lực (ví dụ đã gỡ ứng dụng), máy chủ tự xoá thẻ;
          nếu người khác đăng nhập trên cùng thiết bị, thẻ chuyển sang tài khoản của họ để thông báo của Quý khách không tới máy đó nữa; khi tài khoản bị xoá, mọi thẻ của
          tài khoản bị xoá.</li>
      </ul>

      <h2>11. Liên hệ</h2>
      <p>
        Mọi yêu cầu liên quan đến dữ liệu cá nhân, vui lòng liên hệ theo thông tin ở
        mục “Thông tin người bán” bên dưới.
      </p>

      <h2 id="youtube">12. Dịch vụ API YouTube (YouTube API Services)</h2>
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

      <h2 id="english">13. English summary — CT Work app, messaging and AI</h2>
      <div lang="en">
        <p>
          This section summarises, in English, how cuongthai.com and the <b>CT Work</b> iOS app handle the data described in sections 1–10 above.
          We do not sell personal data and do not use it for advertising.
        </p>

        <p><b>Direct messages and attachments.</b></p>
        <ul>
          <li>One-to-one messages are stored on our servers so they sync across your devices; attachments (up to 10 MB each) are stored on Cloudflare R2.
            In the app only the participants of a conversation can see it. Attachments open through a hard-to-guess link — anyone who has that link can open
            the file, so please do not share attachment links.</li>
          <li><b>Unsend:</b> the sender can unsend a message within <b>5 minutes</b> of sending it (enforced by the server). The text is erased from our server,
            <b>the message’s attachments are deleted from storage</b> (their links stop working) and both sides see “message unsent”.</li>
          <li><b>Delete:</b> you can delete your own messages at any time; the message text (and GIF/sticker) is hidden from everyone in the conversation, including the inbox
            preview (the record is marked as deleted), and <b>the message’s attachments are deleted from storage</b>. If you sent the same file in another message that still
            exists, the file is kept until the last message containing it is deleted or unsent.
            Deleting a conversation removes it only for you — the other person keeps their copy — and you can restore it, with its full history, from the “Deleted” tab.</li>
          <li><b>Read receipts and typing:</b> a “seen” marker is stored and shown to the other participant; the “typing…” signal is relayed live and never stored.</li>
          <li><b>Report and block:</b> you can report a conversation (reason and category); moderators review the report together with the conversation’s latest message
            and may remove violating messages. A blocked user can no longer message you, start a new conversation with you, or start a CT Work direct message with you,
            and the two of you no longer see each other’s activity status.
            CT Work direct messages are private two-person channels; project admins can remove violating messages and reports go to project admins and CT Work moderators.</li>
        </ul>

        <p><b>Activity status (presence).</b></p>
        <ul>
          <li>We show a green “active now” dot while you are connected and “active N minutes ago” based on your last-activity time (<i>lastActiveAt</i>),
            which the app refreshes with a periodic heartbeat while it is open.</li>
          <li>It is visible only to signed-in people <b>connected to you</b>: your friends, people you have a conversation with, and members of CT Work workspaces you
            share (client-portal guests excluded). Signed-out visitors and strangers never see your status anywhere — profile pages, follower/friend lists, Messages,
            the CT Work Members list or the “Online now” list (which only lists people connected to the viewer).</li>
          <li>Turning off <b>“Show activity status”</b> (in the app’s profile/privacy settings) stops your online dot and last-active time from being sent to anyone, in
            all of the places above. Lists apply it immediately; the live online/offline signal is fully effective from the app’s next reconnect. Reciprocal rule: if
            you hide yours, you also cannot see anyone else’s status, anywhere. People who have blocked each other (in either direction) never see each other’s status,
            and AI agents have no status.</li>
        </ul>

        <p><b>CuongMini AI assistant in CT Work.</b></p>
        <ul>
          <li>Data is sent only when you actively use an AI feature: asking the assistant, quick tasks (write a story, split work, generate test cases, summarise,
            review requirements…), the daily brief, weekly report, sprint planning, or <b>“Create with CuongMini”</b>.</li>
          <li><b>What is sent:</b> your question or request, earlier turns of the same conversation, and the project content you can already access that is needed for the
            answer — issues (title, description, status, assignee), comments, Docs pages, text of attached files, links and member display names. For “Create with CuongMini”:
            your project brief, the files you upload, the content of links/repositories you paste, and the member list you provide (names, student IDs, emails, roles,
            skills…) so the AI can draft the project.</li>
          <li><b>Who receives it:</b> third-party AI model providers (such as Anthropic — Claude and OpenAI — GPT), reached through Anthropic’s API or through AI API gateways
            (such as modelapi.vn and rambo.ai.vn), which process it under their own terms.</li>
          <li><b>Purpose:</b> only to generate the answer or draft for you — not for advertising and not sold. <b>We do not use your content to train AI models.</b>
            The AI never changes a project by itself: its suggestions are applied only when a person taps apply, with that person’s own permissions.</li>
          <li><b>Retention:</b> assistant conversations are stored on our servers so you can come back to them. By default a conversation is “Project” (readable by project
            members); you can make it “Private”. Its creator or a project admin can delete it, after which it is no longer shown to anyone. We keep AI usage logs (time,
            feature, model, token counts, estimated cost, success/failure) that <b>do not contain</b> your questions or answers; project admins can see a project’s log
            and each member can see their own.</li>
          <li><b>Consent:</b> the CT Work iOS app asks for your consent before your first AI question; you can withdraw it in <b>Account → Privacy</b>. Withdrawing does not
            affect what was sent before.</li>
          <li>AI answers are labelled <b>“AI-generated”</b> and can be reported; a report (with the question and answer) goes to the CT Work moderation team. AI answers can be
            wrong — please check them.</li>
        </ul>

        <p><b>Voice note transcription (Groq).</b></p>
        <ul>
          <li>When you send a voice note in a CT Work chat channel or comment, the recording is stored on Cloudflare R2 for the people who can see that channel or issue, and our
            server sends the audio to <b>Groq</b>, a third-party speech-to-text service, to create a transcript shown under the voice note for your teammates.</li>
          <li>We do not write audio or transcripts to our system logs; both are kept with the message or comment until it is deleted.</li>
          <li>The CT Work iOS app asks for your consent before your first voice note; nothing is recorded until you tap the microphone. Meeting recordings start only after
            everyone present in the meeting room agrees (for an uploaded recording, the uploader must confirm everyone agreed) and are transcribed the same way.</li>
        </ul>

        <p><b>Push notifications.</b></p>
        <ul>
          <li>If you allow notifications, the iOS app sends its APNs device token (with the app and environment) to <i>POST /api/v1/devices</i>; we link it to your account to
            deliver notifications through Apple Push Notification service.</li>
          <li>Notifications cover direct messages (sender name and the start of the message) and CT Work events: assignments, comments, mentions, alerts and approval requests,
            chat messages, Git activity, meeting reminders and invitations. Their content passes through Apple’s servers and may appear on your lock screen depending on your
            iPhone settings.</li>
          <li>In CT Work you can turn each category on or off (assignments, comments, mentions, alerts, approvals, all chat messages, Git); invitations are always sent. The app
            uses its own notification sounds; you can mute sounds or all notifications in iPhone Settings.</li>
          <li>Tokens are removed from our server when you sign out, deleted automatically when Apple reports them invalid (for example after the app is removed), reassigned
            if someone else signs in on the same device so your notifications stop reaching it, and all deleted when your account is deleted.</li>
        </ul>

        <p><b>Account deletion.</b></p>
        <ul>
          <li>Request it in <b>Account → Delete account</b> in the CT Work app (or Settings → Account &amp; Data on the web). Unless you cancel, the request takes effect
            <b>automatically after 72 hours</b>; you can cancel it during those 72 hours. An admin may process it sooner but <b>cannot refuse</b> your deletion request.</li>
          <li>When it takes effect, the account is disabled, every session is signed out (including open connections) and the password removed; your name, display name,
            email, username, avatar, cover photo, bio, phone number and last sign-in IP/device are erased or replaced with anonymous values, the avatar/cover image files
            you uploaded are deleted from storage, and buyer details on orders are anonymised (the transaction record is kept for accounting). At the same time
            <b>all your device tokens are deleted</b> (no more push notifications reach your devices), every CT Work API token is revoked and connected external accounts
            (such as Microsoft or Google) are removed, your activity status is turned off and cleared, and your private AI conversations (web AI Chat and “Private”
            CT Work assistant conversations) are deleted.</li>
          <li>Content you shared with others (messages you sent, issues, comments, documents and “Project” AI conversations in CT Work projects…) remains in their
            conversations/projects, attributed to the anonymised account. You can delete specific content yourself beforehand, or contact us.</li>
        </ul>

        <p>
          <b>Your rights and contact.</b> You can download a copy of your data (JSON) in Settings → Account &amp; Data, edit your profile, withdraw consent for individual
          features in the app, and contact us using the seller information below.
        </p>
      </div>

    </LegalShell>
  );
}
