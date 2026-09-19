export const deck = { key: 'asg6', code: 'A.6', title: 'Tài liệu 1–2', sub: 'SWR302 · Software Requirements · Assignment (20%)' };
export const slides = [
  { kind: 'cover', t: 'Vision &amp; Scope · Use Cases', sub: 'Hai tài liệu đầu — mọi thứ còn lại chảy ra từ đây',
    body: `<p class="cov-meta">SWR302 · A.6 · Wiegers ch.5 &amp; ch.8</p>` },

  { t: 'Vision &amp; Scope — khuôn 5 phần', body: `
    <table class="t big2">
      <tr><th>1. Business Requirements</th><td class="hl">Nền tảng · cơ hội · mục tiêu <b>có số</b> · rủi ro</td></tr>
      <tr><th>2. Vision of the Solution</th><td>Một câu tầm nhìn · tính năng chính · giả định &amp; phụ thuộc</td></tr>
      <tr><th>3. Scope &amp; Limitations</th><td>Bản phát hành 1 làm gì · <b>không</b> làm gì</td></tr>
      <tr><th>4. Business Context</th><td>Hồ sơ bên liên quan · ưu tiên dự án</td></tr>
      <tr><th>5. Operating Environment</th><td>Nơi chạy, số người dùng, yêu cầu sẵn sàng</td></tr>
    </table>` },

  { t: 'Mục tiêu kinh doanh phải ĐO ĐƯỢC', body: `
    <div class="grid2">
      <div class="box warn"><b>Không đạt</b><br/>"Cải thiện trải nghiệm đăng ký môn cho sinh viên."</div>
      <div class="box ok"><b>Đạt</b><br/>"Giảm thời gian quyết định vượt sĩ số từ 6 ngày xuống dưới 48 giờ cho 90% yêu cầu, trong kỳ đầu tiên sau khi triển khai."</div>
    </div>
    <p class="lead2">Công thức: <b>chỉ số + mốc hiện tại + mốc đích + thời hạn</b>.</p>
    <p class="note">Nếu không neo được vào con số nào trong đề thì mục tiêu đó có thể là bạn tự nghĩ ra — bỏ đi hoặc đi hỏi.</p>` },

  { t: 'Mục "KHÔNG làm" quan trọng ngang mục "làm"', body: `
    <p class="lead2">Đây là chỗ duy nhất trong cả bộ tài liệu bạn được ghi thẳng cái gì <b>ngoài phạm vi</b> — và là chỗ người chấm mở ra đầu tiên.</p>
    <div class="box ok">Ghi tên cụ thể: "Học phí và thanh toán — do hệ thống Tài chính hiện có xử lý. OMFS/CARS chỉ đọc trạng thái, không ghi."</div>
    <p class="note">Ghi "các chức năng khác" là không ghi gì. Danh sách này phải khớp với các hình chữ nhật ngoài vòng tròn trong context diagram.</p>` },

  { t: 'Use case — khuôn đầy đủ', body: `
    <table class="t big2">
      <tr><th>ID &amp; Tên</th><td>UC-06 · Xin vượt sĩ số. Tên là <b>động từ + tân ngữ</b>.</td></tr>
      <tr><th>Actor chính</th><td>Người khởi động và hưởng giá trị</td></tr>
      <tr><th>Tiền điều kiện</th><td>Phải đúng TRƯỚC khi bắt đầu</td></tr>
      <tr><th>Hậu điều kiện</th><td>Đúng SAU khi kết thúc thành công</td></tr>
      <tr><th>Luồng chính</th><td>Đánh số, mỗi bước một hành động</td></tr>
      <tr><th>Luồng thay thế</th><td class="hl">Vẫn thành công, đường khác</td></tr>
      <tr><th>Luồng ngoại lệ</th><td class="hl">KHÔNG thành công — chỗ mất điểm nhiều nhất</td></tr>
    </table>` },

  { t: 'Luồng ngoại lệ là chỗ phân loại nhóm', body: `
    <p class="lead2">Ai cũng viết được luồng vui vẻ. Bài được điểm cao là bài trả lời: <b>nó hỏng ở đâu, và rồi sao?</b></p>
    <div class="steps">
      <div><span class="n">1</span>Với mỗi bước, hỏi "bước này hỏng được không?"</div>
      <div><span class="n">2</span>Hỏng thì hệ thống nói gì với người dùng?</div>
      <div><span class="n">3</span>Dữ liệu đã ghi dở thì xử lý sao?</div>
      <div><span class="n">4</span>Người dùng quay lại được bước nào?</div>
    </div>
    <div class="box warn">TP1: giảng viên không trả lời trong 48h thì sao? TP2: nhặt hàng phát hiện thiếu thì đơn đi đâu? Hai câu này phải có trong bài.</div>` },

  { t: 'Đặt tên use case', body: `
    <div class="grid2">
      <div class="box warn"><b>Sai</b><br/>"Quản lý đơn hàng" — quá rộng, không có điểm kết<br/>"Màn hình đăng ký" — là màn hình, không phải mục tiêu<br/>"Hệ thống kiểm tra tiên quyết" — là một bước, không phải use case</div>
      <div class="box ok"><b>Đúng</b><br/>"Đăng ký vào lớp học phần"<br/>"Xin vượt sĩ số"<br/>"Định tuyến đơn về kho"</div>
    </div>
    <p class="note">Phép thử: sau khi làm xong, actor có <b>đạt được thứ gì đáng kể</b> và bỏ đi được không? Không thì đó là một bước, không phải use case.</p>` },

  { t: 'Bao nhiêu use case là đủ?', body: `
    <p class="lead2">Hai đề này ra khoảng <b>12–16</b> use case. Ít hơn 10 là đang gộp; nhiều hơn 20 là đang tách bước ra thành use case.</p>
    <table class="t">
      <tr><th>Dấu hiệu gộp</th><th>Dấu hiệu tách vụn</th></tr>
      <tr><td>Luồng chính dài hơn 15 bước</td><td>Luồng chính chỉ 2–3 bước</td></tr>
      <tr><td>Có hai actor chính</td><td>Tên bắt đầu bằng "Hệ thống kiểm tra…"</td></tr>
      <tr><td>Tên có chữ "và"</td><td>Không ai dừng lại được sau khi làm xong</td></tr>
    </table>` },

  { t: 'Trước khi chuyển sang tài liệu 3', body: `
    <div class="steps">
      <div><span class="n">1</span>Mọi actor trong bảng use case có mặt trong V&amp;S mục 4</div>
      <div><span class="n">2</span>Mọi thứ ngoài phạm vi trong V&amp;S mục 3 <b>không</b> có use case nào</div>
      <div><span class="n">3</span>Mọi use case có ít nhất một luồng ngoại lệ</div>
      <div><span class="n">4</span>Mọi tiền điều kiện là thứ kiểm được, không phải mong muốn</div>
    </div>` },
];
