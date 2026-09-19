export const deck = { key: 'asg7', code: 'A.7', title: 'Tài liệu 3–5', sub: 'SWR302 · Software Requirements · Assignment (20%)' };
export const slides = [
  { kind: 'cover', t: 'Business Rules · SRS · Data Dictionary', sub: 'Ba tài liệu giữ cho cả bộ nói cùng một chuyện',
    body: `<p class="cov-meta">SWR302 · A.7 · Wiegers ch.9, ch.10, ch.13</p>` },

  { t: 'Business rule ≠ requirement', body: `
    <div class="grid2">
      <div class="cardb"><b>Business rule</b>Đúng kể cả khi <b>không có</b> phần mềm nào. Do doanh nghiệp/luật pháp đặt ra.<br/><span class="nh">"Sinh viên phải đạt môn tiên quyết mới được học môn sau."</span></div>
      <div class="cardp"><b>Requirement</b>Việc <b>phần mềm</b> phải làm để tuân thủ luật đó.<br/><span class="nh">"Hệ thống phải chặn đăng ký và hiện mã môn còn thiếu."</span></div>
    </div>
    <p class="note">Phép thử: bỏ hết máy tính đi, câu này còn đúng không? Còn ⇒ business rule. Không ⇒ requirement.</p>` },

  { t: 'Năm loại business rule', body: `
    <table class="t big2">
      <tr><th>Fact</th><td>Sự thật luôn đúng — "mỗi lớp thuộc đúng một môn"</td></tr>
      <tr><th>Constraint</th><td class="hl">Cấm đoán — "không được đăng ký quá 21 tín chỉ"</td></tr>
      <tr><th>Action enabler</th><td>Kích hoạt — "khi có người rút, mời người đầu danh sách chờ"</td></tr>
      <tr><th>Inference</th><td>Suy ra — "sinh viên quá 90 tín chỉ là sinh viên năm cuối"</td></tr>
      <tr><th>Computation</th><td>Công thức — "sellable = on hand − reserved − damaged"</td></tr>
    </table>
    <p class="note">Phân loại không phải để đẹp: mỗi loại dẫn tới một kiểu requirement khác nhau.</p>` },

  { t: 'SRS — tài liệu trung tâm', body: `
    <table class="t big2">
      <tr><th>1. Giới thiệu</th><td>Mục đích · phạm vi · định nghĩa · tham chiếu</td></tr>
      <tr><th>2. Mô tả tổng thể</th><td>Bối cảnh · lớp người dùng · môi trường · ràng buộc · giả định</td></tr>
      <tr><th>3. Yêu cầu chức năng</th><td class="hl">Nhóm theo tính năng · mỗi cái một mã FE-xx</td></tr>
      <tr><th>4. Giao diện ngoài</th><td>Người dùng · phần cứng · phần mềm · truyền thông</td></tr>
      <tr><th>5. Thuộc tính chất lượng</th><td class="hl">Hiệu năng · bảo mật · khả dụng — viết bằng Planguage</td></tr>
      <tr><th>6. Yêu cầu khác</th><td>Dữ liệu · tuân thủ · quốc tế hoá</td></tr>
    </table>` },

  { t: 'Viết một yêu cầu chức năng', body: `
    <div class="box warn"><b>Không đạt:</b> "Hệ thống nên xử lý đăng ký nhanh và thân thiện với người dùng."</div>
    <div class="box ok"><b>Đạt:</b> "FE-12. Khi sinh viên gửi yêu cầu đăng ký, hệ thống <b>phải</b> kiểm BR-03, BR-05, BR-08 theo thứ tự đó và trả kết quả trong vòng 3 giây ở tải đỉnh."</div>
    <table class="t">
      <tr><th>Có mã</th><th>Dùng "phải"</th><th>Kiểm chứng được</th><th>Trỏ về BR</th></tr>
      <tr><td>FE-12</td><td>shall</td><td>3 giây, đo được</td><td>BR-03/05/08</td></tr>
    </table>` },

  { t: 'Planguage cho yêu cầu chất lượng', body: `
    <table class="t big2">
      <tr><th>TAG</th><td>PERF-01</td></tr>
      <tr><th>GIST</th><td>Thời gian phản hồi khi đăng ký ở tải đỉnh</td></tr>
      <tr><th>SCALE</th><td class="hl">Giây, từ lúc bấm tới lúc hiện kết quả</td></tr>
      <tr><th>METER</th><td>Percentile 95 đo bằng log ứng dụng trong 72 giờ mở đăng ký</td></tr>
      <tr><th>MUST</th><td>≤ 5 giây</td></tr>
      <tr><th>PLAN</th><td>≤ 3 giây</td></tr>
      <tr><th>WISH</th><td>≤ 1,5 giây</td></tr>
    </table>
    <p class="note">MUST là ngưỡng thất bại, PLAN là đích, WISH là mơ ước. Ba mức khác nhau — đừng ghi một con số rồi thôi.</p>` },

  { t: 'Từ điển dữ liệu — một tên, một nghĩa', body: `
    <table class="t">
      <tr><th>Tên</th><th>Kiểu</th><th>Ràng buộc</th><th>Nguồn</th></tr>
      <tr><td>sellable quantity</td><td>Số nguyên ≥ 0</td><td class="hl">= on hand − reserved − damaged</td><td>Tính, UC-02</td></tr>
      <tr><td>section code</td><td>Chuỗi 8 ký tự</td><td>^[A-Z]{3}\\d{3}-\\d{2}$</td><td>Danh mục môn</td></tr>
      <tr><td>hold window</td><td>Phút, 1…1440</td><td>Mặc định 30, BR-11</td><td>Cấu hình</td></tr>
    </table>
    <p class="lead2">Mục đích không phải để tra cứu. Là để <b>cả nhóm dùng đúng một từ cho đúng một thứ</b>.</p>` },

  { t: 'Từ điển bắt lỗi thật như thế nào', body: `
    <p class="lead2">Khi viết bộ mẫu TP2, chính bảng này phát hiện ba lỗi thật:</p>
    <div class="steps">
      <div><span class="n">1</span>Có <b>District</b> trong mockup mà không có trong từ điển ⇒ chưa ai định nghĩa</div>
      <div><span class="n">2</span>Có <b>Justification</b> trong use case mà không có ràng buộc độ dài</div>
      <div><span class="n">3</span><b>ERP</b> được liệt kê là actor nhưng không tham gia use case nào ⇒ thừa</div>
    </div>
    <p class="note">Cả ba tìm ra bằng một script đối chiếu chéo, không phải bằng đọc. Nhóm nào viết được script ấy thì nên khoe ở tuần 9.</p>` },

  { t: 'Ma trận truy vết', body: `
    <table class="t">
      <tr><th>BR</th><th>UC</th><th>FE</th><th>Test</th></tr>
      <tr><td>BR-03</td><td>UC-02</td><td>FE-12, FE-13</td><td>TC-08</td></tr>
      <tr><td>BR-08</td><td>UC-02, UC-04</td><td>FE-14</td><td>TC-11</td></tr>
      <tr><td class="hl">BR-11</td><td class="hl">UC-02</td><td class="hl">FE-19…FE-23</td><td class="hl">TC-15</td></tr>
    </table>
    <p class="lead2">Một BR không có FE nào ⇒ luật không được cài. Một FE không có BR hay UC nào ⇒ <b>bạn tự nghĩ ra nó</b>.</p>
    <p class="note">Đây là bảng thầy hay xin xem nhất trong các lần gọi kiểm tra.</p>` },
];
