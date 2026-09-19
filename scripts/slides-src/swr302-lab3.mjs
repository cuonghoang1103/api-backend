export const deck = { key: 'labL3', code: 'LAB 3', title: 'Swimlane', sub: 'SWR302 · Software Requirements · LAB (10%)' };
export const slides = [
  { kind: 'cover', t: 'Swimlane diagram', sub: 'Sơ đồ tìm ra các điểm BÀN GIAO',
    body: `<p class="cov-meta">SWR302 · LAB 3 · Wiegers Ch. 12<br/>Bài luyện lấy từ đề <b>TP1 — vượt sĩ số</b></p>` },

  { t: 'Giá trị nằm ở chỗ BÀN GIAO', body: `
    <p class="lead2">Swimlane trả lời: <b>ai làm gì, theo thứ tự nào, và công việc chuyển từ người này sang người kia ở đâu?</b></p>
    <div class="box ok" style="text-align:center;font-size:27px">Công việc <b>gãy ở chỗ bàn giao</b>.</div>
    <p class="lead2">Đây là mô hình DUY NHẤT làm mọi điểm bàn giao hiện ra thành một mũi tên cắt ngang ranh giới lane.</p>` },

  { t: 'Ký pháp', body: `
    <table class="t">
      <tr><th>Ký hiệu</th><th>Nghĩa</th><th>Luật</th></tr>
      <tr><td>Dải ngang (lane)</td><td>Một VAI TRÒ hoặc một hệ thống</td><td class="hl">Không bao giờ là tên người</td></tr>
      <tr><td>Chữ nhật bo góc</td><td>Hoạt động — động từ + tân ngữ</td><td>Nằm trong lane của người làm</td></tr>
      <tr><td>Hình thoi</td><td>Quyết định</td><td class="hl">Mọi nhánh đi ra đều có nhãn</td></tr>
      <tr><td>Mũi tên cắt lane</td><td>MỘT ĐIỂM BÀN GIAO</td><td>Đếm chúng — đó là phát hiện</td></tr>
    </table>` },

  { t: 'Lane là VAI TRÒ, không phải PHÒNG BAN', body: `
    <div class="two">
      <div class="box warn"><b>✕ Một lane cho “Phòng Đào tạo”</b><br/><span class="note">Giấu đi đúng những điểm bàn giao bạn đang đi tìm.</span></div>
      <div class="box ok"><b>✓ “Nhân viên học vụ” và “Trưởng phòng”</b><br/><span class="note">Hai vai khác nhau, làm việc khác nhau, bàn giao cho nhau.</span></div>
    </div>
    <p class="lead2">Đây là lỗi làm <b>cả bài tập trở nên vô nghĩa</b> — sơ đồ vẫn đẹp mà không phát hiện được gì.</p>` },

  { t: 'Bài luyện TP1 · Quy trình HIỆN TẠI', body: `
    <div class="lanes">
      <div class="row"><div class="who">Sinh viên</div><div class="acts"><span class="a">Gửi email cho bộ môn</span><span class="x">→</span><span class="a">Đăng ký thủ công</span></div></div>
      <div class="row"><div class="who">Thư ký bộ môn</div><div class="acts"><span class="a">Chuyển tiếp phòng học vụ</span></div></div>
      <div class="row"><div class="who">Nhân viên học vụ</div><div class="acts"><span class="a">Tra hồ sơ sinh viên</span><span class="x">→</span><span class="a">Báo lại sinh viên</span></div></div>
      <div class="row"><div class="who">Giảng viên</div><div class="acts"><span class="d">◇ Còn chỗ?</span><span class="x">→</span><span class="a">Trả lời email</span></div></div>
    </div>
    <p class="note">Đếm số lần mũi tên cắt ngang ranh giới lane…</p>` },

  { t: 'Con số ĐÓ là phát hiện', body: `
    <div class="grid3">
      <div class="card"><b>6</b>lần bàn giao</div>
      <div class="card"><b>6 ngày</b>thời gian quyết định TB</div>
      <div class="card"><b>2.300</b>yêu cầu mỗi kỳ</div>
    </div>
    <p class="lead2">Sáu lần bàn giao, mỗi lần là một email nằm chờ trong hộp thư ai đó — đó là <b>lý do</b> quy trình mất sáu ngày.</p>
    <div class="box ok">Thuyết phục hơn hẳn câu “quy trình chậm”.</div>` },

  { t: 'Quy trình TƯƠNG LAI — UC-06', body: `
    <div class="lanes">
      <div class="row"><div class="who">Sinh viên</div><div class="acts"><span class="a">Gửi yêu cầu + lý do</span></div></div>
      <div class="row"><div class="who">CARS</div><div class="acts"><span class="a">Định tuyến tới Trưởng bộ môn</span><span class="x">→</span><span class="a">Đếm giờ SLA 48h</span><span class="x">→</span><span class="a">Ghi danh</span></div></div>
      <div class="row"><div class="who">Trưởng bộ môn</div><div class="acts"><span class="d">◇ Duyệt?</span><span class="x">→</span><span class="a">Ghi lý do</span></div></div>
    </div>
    <p class="lead2"><b>2</b> lần cắt ranh giới, thay vì 6. Đặt hai sơ đồ cạnh nhau là slide rõ ràng nhất của buổi thuyết trình tuần 9.</p>` },

  { t: 'Bốn lỗi mất điểm', body: `
    <div class="steps">
      <div><span class="n">1</span><b>Nhánh quyết định không nhãn.</b> Hình thoi với hai mũi tên trần thì không đọc được.</div>
      <div><span class="n">2</span><b>Không có đường hỏng.</b> Giảng viên không bao giờ trả lời thì quy trình đi đâu?</div>
      <div><span class="n">3</span><b>Nhét hệ thống vào lane của người.</b> Ranh giới tự động hoá trở nên vô hình.</div>
      <div><span class="n">4</span><b>Một lane cho một phòng ban.</b> Xem lại slide 4.</div>
    </div>` },

  { t: 'Vẽ HIỆN TẠI trước, TƯƠNG LAI sau', body: `
    <p class="lead2">Khoảng cách giữa hai sơ đồ chính là <b>bài toán kinh doanh</b> của bạn. Chương 21 gọi nó là <b>gap analysis</b>.</p>
    <div class="box">Với TP1 việc này bắt buộc — đề mô tả một dự án <b>thay thế hệ cũ</b>, không phải xây mới từ đầu.</div>
    <p class="note">Với TP2 cũng vậy: quy trình in phiếu và chia tay là “hiện tại”, UC-04 định tuyến tự động là “tương lai”.</p>` },
];
