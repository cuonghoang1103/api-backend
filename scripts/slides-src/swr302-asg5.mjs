export const deck = { key: 'asg5', code: 'A.5', title: 'Kế hoạch tuần 2→9', sub: 'SWR302 · Software Requirements · Assignment (20%)' };
export const slides = [
  { kind: 'cover', t: 'Tuần 2 → tuần 9', sub: 'Kế hoạch tám tuần và cách sống sót qua các lần bị gọi kiểm tra',
    body: `<p class="cov-meta">SWR302 · A.5 · Mốc giao nộp + ngân hàng câu hỏi</p>` },

  { t: 'Nguyên tắc xếp lịch', body: `
    <p class="lead2">Xếp ngược từ tuần 9. Tài liệu nào <b>ăn đầu ra</b> của tài liệu khác thì phải nằm sau nó, cách ít nhất một tuần để còn kịp sửa.</p>
    <div class="box warn">Ước lượng (tài liệu 8) ăn SRS. SRS ăn use case. Use case ăn Vision &amp; Scope. Chuỗi đó dài <b>bốn tuần</b> — nên tuần 2 mà chưa chốt phạm vi là đã trễ.</div>` },

  { t: 'Tuần 2–3 · Nền móng', body: `
    <table class="t big2">
      <tr><th>Tuần 2</th><td class="hl">Chốt đề · chốt phạm vi trong/ngoài · Vision &amp; Scope nháp · context diagram</td></tr>
      <tr><th>Giao nộp</th><td>V&amp;S mục 1–3 + context diagram · danh sách bên liên quan</td></tr>
      <tr><th>Tuần 3</th><td>Phỏng vấn (hoặc giả lập) bên liên quan · use case v1 (mới tên + actor + mục tiêu)</td></tr>
      <tr><th>Giao nộp</th><td>Bảng 14 use case · swimlane quy trình hiện tại</td></tr>
    </table>
    <p class="note">Tuần 2 làm được context diagram là vì nó chỉ cần phạm vi, chưa cần chi tiết. Vẽ sớm để chốt tranh cãi sớm.</p>` },

  { t: 'Tuần 4–5 · Phần thịt', body: `
    <table class="t big2">
      <tr><th>Tuần 4</th><td>Use case đầy đủ (luồng chính + <b>luồng ngoại lệ</b>) · business rules BR-01…BR-20</td></tr>
      <tr><th>Giao nộp</th><td>Tài liệu 2 và 3 bản hoàn chỉnh</td></tr>
      <tr><th>Tuần 5</th><td class="hl">SRS phần chức năng · mỗi use case sinh ra các FE-xx</td></tr>
      <tr><th>Giao nộp</th><td>SRS mục 3 + ma trận truy vết UC ↔ FE v1</td></tr>
    </table>
    <div class="box warn">Tuần 4 là tuần dễ trễ nhất: viết luồng ngoại lệ tốn gấp đôi luồng chính. Đừng để nó sang tuần 5.</div>` },

  { t: 'Tuần 6–7 · Chất lượng &amp; hình ảnh', body: `
    <table class="t big2">
      <tr><th>Tuần 6</th><td>Yêu cầu chất lượng viết bằng <b>Planguage</b> · từ điển dữ liệu</td></tr>
      <tr><th>Giao nộp</th><td>SRS mục 4–5 · tài liệu 5</td></tr>
      <tr><th>Tuần 7</th><td>Mockup các màn hình chính · rà soát chéo toàn bộ</td></tr>
      <tr><th>Giao nộp</th><td class="hl">Tài liệu 6 · danh sách lỗi lệch tìm được khi rà chéo</td></tr>
    </table>
    <p class="note">"Danh sách lỗi lệch tìm được" là thứ thầy hay hỏi. Có nó nghĩa là nhóm thật sự có rà soát.</p>` },

  { t: 'Tuần 8–9 · Đóng gói', body: `
    <table class="t big2">
      <tr><th>Tuần 8</th><td>Ưu tiên (có số) · ước lượng (3 phương pháp) · đóng gói · đọc soát lần cuối</td></tr>
      <tr><th>Tuần 9</th><td class="hl">Thuyết trình · mọi thành viên nói ít nhất một phần</td></tr>
    </table>
    <p class="lead2">Tuần 8 <b>không</b> để viết nội dung mới. Nếu tuần 8 còn viết use case thì kế hoạch đã hỏng từ tuần 4.</p>` },

  { t: 'Lần gọi kiểm tra trông như thế nào', body: `
    <p class="lead2">Thầy gọi <b>một người bất kỳ</b>, không báo trước, hỏi ba lớp câu hỏi:</p>
    <div class="grid3">
      <div class="card"><b>Tiến độ</b>Đang ở đâu, tuần này giao gì</div>
      <div class="card"><b>Nội dung</b>Yêu cầu này nghĩa là gì</div>
      <div class="card"><b>Cách làm</b>Con số này ở đâu ra</div>
    </div>
    <div class="box warn">Lớp thứ ba là chỗ rớt. "Em nghĩ là cần" không phải câu trả lời — phải là "từ UC-06, mà UC-06 ra từ con số 2.300 yêu cầu/kỳ trong đề".</div>` },

  { t: 'Ngân hàng câu hỏi — trích', body: `
    <table class="t big2">
      <tr><th>Yêu cầu FE-12 ở đâu ra?</th><td class="hl">Trả lời bằng chuỗi truy vết, không bằng lý lẽ</td></tr>
      <tr><th>Cái này là business rule hay requirement?</th><td>BR tồn tại kể cả khi không có phần mềm; FE là việc phần mềm làm</td></tr>
      <tr><th>Sao xếp cái này ưu tiên 1?</th><td>Đọc công thức và bốn con số vào, không nói "vì nó quan trọng"</td></tr>
      <tr><th>Nếu bên liên quan đổi ý thì sao?</th><td>Chỉ ra mục "giả định" và quy trình kiểm soát thay đổi</td></tr>
      <tr><th>Em làm phần nào?</th><td>Mở nhật ký đóng góp ra</td></tr>
    </table>
    <p class="note">Bốn mươi câu đầy đủ nằm trong phần chữ của bài học này, ngay dưới slide.</p>` },

  { t: 'Chuẩn bị cho lần bị gọi', body: `
    <div class="steps">
      <div><span class="n">1</span>Mỗi người đọc <b>toàn bộ</b> SRS ít nhất một lần, không chỉ phần mình viết</div>
      <div><span class="n">2</span>Giữ ma trận truy vết mở sẵn trong một tab</div>
      <div><span class="n">3</span>Mỗi người thuộc <b>ba con số</b> của đề</div>
      <div><span class="n">4</span>Tập trả lời "cái này ở đâu ra" trong 30 giây, trong họp thứ 2 hằng tuần</div>
    </div>
    <p class="note">Bốn việc này mất chừng 20 phút mỗi tuần và là phần chuẩn bị có tỉ suất cao nhất của cả bài.</p>` },
];
