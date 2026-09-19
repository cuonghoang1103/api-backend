export const deck = { key: 'asg2', code: 'A.2', title: 'Đề TP1 — CARS', sub: 'SWR302 · Software Requirements · Assignment (20%)' };
export const slides = [
  { kind: 'cover', t: 'TP1 — Học vụ &amp; Đăng ký môn', sub: 'Campus Academic &amp; Registration System (CARS)',
    body: `<p class="cov-meta">SWR302 · A.2 · Thay thế hệ thống cũ<br/>12.000 sinh viên · 1.400 lớp · 3 đợt đăng ký</p>` },

  { t: 'Bối cảnh', body: `
    <p class="lead2">Northern Regional University chạy một hệ đăng ký môn <b>đã 14 năm tuổi</b>. Mỗi kỳ có 12.000 sinh viên tranh 1.400 lớp trong một cửa sổ 72 giờ chia ba đợt.</p>
    <div class="box warn">Đỉnh thật đo được: <b>4.200 người cùng lúc</b>. Hệ cũ chết ở <b>1.800</b>.</div>
    <p class="note">Đây là dự án <b>thay thế</b>, không phải xây mới — nên bạn bắt buộc phải mô hình hoá cả quy trình HIỆN TẠI (xem LAB L.3).</p>` },

  { t: 'Bốn con số là cả bài toán', body: `
    <table class="t big2">
      <tr><th>4.200 / 1.800</th><td class="hl">Đỉnh thật so với sức chịu của hệ cũ ⇒ yêu cầu hiệu năng</td></tr>
      <tr><th>640 giờ-người/kỳ</th><td>Công thủ công của phòng học vụ ⇒ bài toán tiết kiệm</td></tr>
      <tr><th>2.300 yêu cầu · 6 ngày</th><td>Xin vượt sĩ số, chờ trung bình 6 ngày ⇒ UC-06 + SLA 48h</td></tr>
      <tr><th>4.800 lượt hỏi</th><td>Sinh viên hỏi cố vấn mỗi kỳ ⇒ bài toán tự phục vụ</td></tr>
    </table>
    <p class="note">Mọi mục tiêu kinh doanh trong Vision &amp; Scope của bạn phải <b>neo vào một trong bốn con số này</b>.</p>` },

  { t: 'Trong phạm vi / Ngoài phạm vi', body: `
    <div class="grid2">
      <div class="box ok"><b>TRONG</b><br/>Đăng ký &amp; rút môn · danh sách chờ · kiểm tiên quyết · phát hiện trùng lịch · xin vượt sĩ số · xem lịch · báo cáo học vụ</div>
      <div class="box warn"><b>NGOÀI</b><br/>Tuyển sinh · học phí &amp; thanh toán · điểm số · xếp phòng · quản lý nhân sự · cổng thư viện</div>
    </div>
    <p class="note">Đề nói học phí "đã có hệ riêng". Đó là câu thầy bảo bạn <b>đừng đặc tả nó</b> — nhưng vẫn phải vẽ nó thành thực thể ngoài trong context diagram.</p>` },

  { t: 'Bên liên quan', body: `
    <div class="grid3">
      <div class="card"><b>Sinh viên</b>12.000 · người dùng chính</div>
      <div class="card"><b>Cố vấn học tập</b>Duyệt kế hoạch học</div>
      <div class="card"><b>Trưởng bộ môn</b>Duyệt vượt sĩ số</div>
      <div class="card"><b>Nhân viên học vụ</b>Vận hành hằng ngày</div>
      <div class="card"><b>Giảng viên</b>Xem danh sách lớp</div>
      <div class="card"><b>Phòng CNTT</b>Vận hành, tích hợp</div>
    </div>
    <p class="note">Sáu vai này phải xuất hiện lại y nguyên ở cột Actor của bảng use case — lệch tên là mất điểm nhất quán.</p>` },

  { t: '14 use case — bộ khung', body: `
    <table class="t">
      <tr><th>Mã</th><th>Use case</th><th>Actor chính</th></tr>
      <tr><td>UC-01</td><td>Tìm và lọc lớp học phần</td><td>Sinh viên</td></tr>
      <tr><td>UC-02</td><td>Đăng ký vào lớp</td><td>Sinh viên</td></tr>
      <tr><td>UC-03</td><td>Rút khỏi lớp</td><td>Sinh viên</td></tr>
      <tr><td>UC-04</td><td>Vào danh sách chờ</td><td>Sinh viên</td></tr>
      <tr><td class="hl">UC-06</td><td class="hl">Xin vượt sĩ số</td><td class="hl">Sinh viên · Trưởng bộ môn</td></tr>
      <tr><td>UC-09</td><td>Duyệt kế hoạch học của sinh viên</td><td>Cố vấn</td></tr>
      <tr><td>UC-13</td><td>Xuất báo cáo sĩ số</td><td>Nhân viên học vụ</td></tr>
    </table>
    <p class="note">Bảng đầy đủ 14 use case + luồng chính/ngoại lệ nằm ở bộ tài liệu mẫu TP1, tài liệu 2.</p>` },

  { t: 'Chỗ khó nhất của TP1', body: `
    <p class="lead2">Không phải màn hình. Là <b>ba luật va nhau</b> khi sinh viên bấm Đăng ký:</p>
    <div class="steps">
      <div><span class="n">1</span>Đã học xong môn tiên quyết chưa? (BR-03)</div>
      <div><span class="n">2</span>Lớp có trùng giờ với lớp đã đăng ký không? (BR-05)</div>
      <div><span class="n">3</span>Còn chỗ không, hay phải vào danh sách chờ? (BR-08)</div>
    </div>
    <div class="box warn">Ba điều kiện ⇒ <b>8 tổ hợp</b>. Đây là chỗ dùng bảng quyết định (LAB L.6), không phải chỗ viết văn xuôi.</div>` },

  { t: 'Cái bẫy phạm vi của TP1', body: `
    <p class="lead2">Điểm số. Hệ thống <b>ĐỌC</b> điểm để kiểm môn tiên quyết, nhưng <b>KHÔNG QUẢN LÝ</b> điểm.</p>
    <div class="grid2">
      <div class="box ok"><b>Đúng</b><br/>Gradebook là thực thể ngoài · một luồng "kết quả môn học" đi vào · BR-03 dùng nó</div>
      <div class="box warn"><b>Sai</b><br/>Viết use case "Nhập điểm" · thêm thực thể Grade vào ERD với đầy đủ thuộc tính</div>
    </div>
    <p class="note">Đọc dữ liệu của hệ khác <b>không</b> kéo hệ đó vào phạm vi. Ranh giới nằm ở chỗ ai GHI, không phải ai ĐỌC.</p>` },

  { t: 'Bảng tự kiểm TP1', body: `
    <table class="t big2">
      <tr><th>Vision &amp; Scope</th><td>Mỗi mục tiêu neo vào một trong 4 con số</td></tr>
      <tr><th>Use case</th><td>Có cả luồng hỏng: hết chỗ, trùng lịch, thiếu tiên quyết</td></tr>
      <tr><th>Business rule</th><td>BR-03/05/08 viết thành bảng quyết định, không phải văn xuôi</td></tr>
      <tr><th>SRS chất lượng</th><td class="hl">Có yêu cầu hiệu năng nêu rõ 4.200 người cùng lúc</td></tr>
      <tr><th>Phạm vi</th><td>Điểm số, học phí, tuyển sinh nằm NGOÀI và được nêu tên</td></tr>
    </table>` },
];
