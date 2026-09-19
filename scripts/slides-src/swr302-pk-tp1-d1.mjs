export const deck = { key: 'p1d1', code: 'W1.1', title: 'TP1 · Vision & Scope', sub: 'SWR302 · Software Requirements · Bộ tài liệu mẫu' };
export const slides = [
  { kind: 'cover', t: 'Vision &amp; Scope của CARS', sub: 'Tài liệu 1 — đọc một bản đã hoàn chỉnh',
    body: `<p class="cov-meta">SWR302 · W1.1 · Wiegers Ch. 5<br/>6 nỗi đau · 6 mục tiêu · 14 feature · 8 loại trừ</p>` },

  { t: 'Sáu nỗi đau, mỗi cái một CON SỐ', body: `
    <table class="t big2">
      <tr><th>Hệ cũ chết ở 1.800</th><td class="hl">trong khi đỉnh thật là 4.200 người cùng lúc</td></tr>
      <tr><th>640 giờ-người/kỳ</th><td>phòng học vụ làm tay</td></tr>
      <tr><th>2.300 yêu cầu vượt sĩ số</th><td>chờ trung bình 6 ngày</td></tr>
      <tr><th>4.800 lượt hỏi cố vấn</th><td>phần lớn là câu trả lời được bằng tự phục vụ</td></tr>
    </table>
    <p class="note">Không có con số thì không có mục tiêu. Đây là chỗ cả tài liệu bắt đầu.</p>` },

  { t: 'Từ nỗi đau sang MỤC TIÊU: 4 phần', body: `
    <div class="box warn"><b>Không đạt:</b> "Cải thiện trải nghiệm đăng ký môn."</div>
    <div class="box ok"><b>Đạt:</b> "Giảm thời gian quyết định vượt sĩ số từ <b>6 ngày</b> (đo kỳ Thu 2025) xuống <b>dưới 48 giờ</b> cho <b>90%</b> yêu cầu, trong <b>kỳ đầu tiên</b> sau triển khai."</div>
    <p class="lead2">Chỉ số · mốc hiện tại · mốc đích · thời hạn. Thiếu <b>mốc hiện tại</b> là biến thể hay gặp nhất — không có nó thì không ai biết đích là tham vọng hay tầm thường.</p>` },

  { t: 'Thước đo thành công phải có NGUỒN DỮ LIỆU', body: `
    <table class="t">
      <tr><th>Mục tiêu</th><th>Đo bằng gì</th><th>Lấy ở đâu</th></tr>
      <tr><td>BO-1 chịu tải đỉnh</td><td>phiên đồng thời</td><td class="hl">log ứng dụng, cửa sổ 72h</td></tr>
      <tr><td>BO-3 giảm chờ</td><td>giờ từ gửi tới quyết định</td><td>bảng override, cột timestamp</td></tr>
      <tr><td>BO-5 giảm hỏi</td><td>số ticket/kỳ</td><td>hệ thống cố vấn</td></tr>
    </table>
    <p class="note">Một mục tiêu không nói đo ở đâu thì sau này <b>không ai kiểm được</b> dự án có thành công không.</p>` },

  { t: 'Vision statement theo mẫu Moore', body: `
    <p class="lead2"><b>Cho</b> sinh viên đại học · <b>những người</b> phải đăng ký môn trong cửa sổ 72 giờ · <b>CARS là</b> hệ thống học vụ và đăng ký · <b>giúp</b> đăng ký không trượt và biết ngay vì sao bị chặn · <b>khác với</b> hệ Banner hiện tại · <b>sản phẩm này</b> kiểm tiên quyết và trùng lịch ngay lúc bấm.</p>
    <p class="note">Sáu ô điền. Giá trị của mẫu này là ô <b>"khác với"</b> — nó buộc nhóm nói ra mình thay thế cái gì.</p>` },

  { t: 'Mục "KHÔNG làm" — 8 loại trừ, gọi TÊN', body: `
    <div class="grid2">
      <div class="box warn"><b>NGOÀI phạm vi bản 1</b><br/>Tuyển sinh · học phí &amp; thanh toán · nhập điểm · xếp phòng · nhân sự · cổng thư viện · app di động · đăng ký hè</div>
      <div class="box ok"><b>Vì sao vẫn phải ghi</b><br/>Mỗi dòng ở đây khớp một hình chữ nhật NGOÀI vòng tròn trong context diagram. Đây là cặp tài liệu người chấm đọc chéo đầu tiên.</div>
    </div>
    <p class="note">Ghi "các chức năng khác" là không ghi gì — và đó là cửa phạm vi phình ra vào tuần 6.</p>` },

  { t: 'Ba bản phát hành, không phải một', body: `
    <div class="steps">
      <div><span class="n">1</span><b>R1</b> — đăng ký, rút, tiên quyết, trùng lịch, danh sách chờ</div>
      <div><span class="n">2</span><b>R2</b> — vượt sĩ số có SLA, kiểm tiến độ tốt nghiệp</div>
      <div><span class="n">3</span><b>R3</b> — báo cáo học vụ, gợi ý kế hoạch học</div>
    </div>
    <p class="note">Chia bản phát hành ở tài liệu 1 làm cho bảng ưu tiên ở tài liệu 7 <b>có việc để làm</b>. Không chia thì bảng ưu tiên chỉ là trang trí.</p>` },

  { t: 'Sáu rủi ro — và rủi ro dẫn tới TBD', body: `
    <table class="t big2">
      <tr><th>RI-1</th><td class="hl">Dữ liệu tiên quyết trong hệ cũ không sạch — chưa ai đo mức sai</td></tr>
      <tr><th>RI-2</th><td>Quy chế học vụ đang sửa, có thể đổi giữa dự án</td></tr>
      <tr><th>RI-4</th><td>Không có môi trường thử tải giống production</td></tr>
    </table>
    <p class="lead2">RI-1 và RI-2 quay lại ở tài liệu 8 làm <b>lý do thật</b> để xin thêm một BA — chứ không phải quy tắc dư 15%.</p>` },

  { t: 'Đọc tài liệu này thế nào', body: `
    <div class="steps">
      <div><span class="n">1</span>Tự viết mục 1.1 và 1.2 của đề bạn TRƯỚC</div>
      <div><span class="n">2</span>Rồi mở bản này ra so — đặc biệt là cách viết mục tiêu 4 phần</div>
      <div><span class="n">3</span>Đếm: bạn có đủ 4 phần cho MỌI mục tiêu chưa?</div>
      <div><span class="n">4</span>Danh sách loại trừ của bạn có gọi tên cụ thể không?</div>
    </div>` },
];
