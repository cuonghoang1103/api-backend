export const deck = { key: 'p1d3', code: 'W1.3', title: 'TP1 · Business Rules', sub: 'SWR302 · Software Requirements · Bộ tài liệu mẫu' };
export const slides = [
  { kind: 'cover', t: '20 business rule của CARS', sub: 'Tài liệu 3 — đủ năm loại, mỗi rule ghi nguồn',
    body: `<p class="cov-meta">SWR302 · W1.3 · Wiegers Ch. 9<br/>7/20 rule đến từ ĐỌC TÀI LIỆU, không từ phỏng vấn</p>` },

  { t: 'Phép thử phân biệt', body: `
    <p class="lead2">Bỏ hết phần mềm đi — câu này còn đúng không?</p>
    <div class="grid2">
      <div class="cardb"><b>Còn đúng ⇒ business rule</b>"Sinh viên phải đạt môn tiên quyết mới được học môn sau." Quy chế trường nói vậy, có máy tính hay không cũng thế.</div>
      <div class="cardp"><b>Hết nghĩa ⇒ requirement</b>"Hệ thống phải chặn đăng ký và hiện mã môn còn thiếu." Không có phần mềm thì câu này vô nghĩa.</div>
    </div>` },

  { t: 'Năm loại, có ví dụ thật', body: `
    <table class="t big2">
      <tr><th>Fact</th><td>Mỗi lớp thuộc đúng một môn</td></tr>
      <tr><th>Constraint</th><td class="hl">BR-07: không quá 21 tín chỉ mỗi kỳ, trừ khi cố vấn duyệt</td></tr>
      <tr><th>Action enabler</th><td>BR-09: có người rút ⇒ mời người đầu danh sách chờ trong 24h</td></tr>
      <tr><th>Inference</th><td>BR-12: quá 90 tín chỉ ⇒ sinh viên năm cuối ⇒ được ưu tiên đợt 1</td></tr>
      <tr><th>Computation</th><td>BR-15: GPA tính trên thang 4,0, môn học lại lấy điểm cao nhất</td></tr>
    </table>` },

  { t: 'TĨNH hay ĐỘNG — cột hay bị bỏ', body: `
    <div class="grid2">
      <div class="box ok"><b>Tĩnh</b><br/>Hiếm khi đổi. Có thể viết cứng trong mã.</div>
      <div class="box warn"><b>Động</b><br/>Đổi theo kỳ hoặc theo quyết định. <b>Phải để cấu hình được</b>, nếu không mỗi lần đổi là một lần deploy.</div>
    </div>
    <p class="lead2">BR-07 (trần tín chỉ) là ĐỘNG — trường đã đổi hai lần trong năm năm. Đánh dấu nó là tĩnh thì sinh ra một yêu cầu sai ở tài liệu 4.</p>` },

  { t: '7/20 rule ra từ ĐỌC, không từ HỎI', body: `
    <p class="lead2">Bảy rule đến thẳng từ <b>Quy chế học vụ</b> — một văn bản có sẵn, không ai trong các buổi phỏng vấn nhắc tới.</p>
    <div class="box warn">Phỏng vấn cho bạn thứ người ta <b>nhớ</b>. Tài liệu cho bạn thứ người ta <b>phải tuân theo</b>. Hai tập hợp đó không trùng nhau.</div>
    <p class="note">Chương 9 gọi kỹ thuật này là khai thác từ tài liệu. Trên đề TP1 nó cho 35% số rule — bỏ qua là mất một phần ba.</p>` },

  { t: 'Vấn đề "catalog year"', body: `
    <p class="lead2">Sinh viên tuân theo quy chế <b>của năm nhập học</b>, không phải quy chế hiện hành. Một trường có 4–6 phiên bản quy chế cùng hiệu lực.</p>
    <div class="box warn">Nghĩa là BR-03 (tiên quyết) không phải MỘT luật — nó là một họ luật, chọn theo năm nhập học của sinh viên đang đứng trước mặt.</div>
    <p class="note">Phát hiện này đến từ việc <b>viết catalog rule ra</b>, không từ buổi họp nào. Nó đổi cả mô hình dữ liệu ở tài liệu 5.</p>` },

  { t: 'Rule CỐ Ý không đưa vào phần mềm', body: `
    <table class="t big2">
      <tr><th>BR-18</th><td>Trưởng khoa được miễn trừ bất kỳ điều kiện nào bằng văn bản</td></tr>
      <tr><th>Vì sao để ngoài</th><td class="hl">Nó là quyền con người ta có, không phải quy trình máy chạy. Hệ thống chỉ cần GHI LẠI khi nó xảy ra.</td></tr>
    </table>
    <p class="lead2">Ghi rõ rule nào <b>không</b> cài là một phần của tài liệu — nếu không, người đọc sau sẽ tưởng bạn quên.</p>` },

  { t: 'Ma trận truy vết rule → UC → FE', body: `
    <table class="t">
      <tr><th>BR</th><th>Use case</th><th>Requirement</th></tr>
      <tr><td>BR-03</td><td>UC-02</td><td>FE-12, FE-13</td></tr>
      <tr><td>BR-07</td><td>UC-02, UC-09</td><td>FE-18</td></tr>
      <tr><td class="hl">BR-09</td><td class="hl">UC-04</td><td class="hl">FE-21…FE-24</td></tr>
    </table>
    <p class="lead2">Một BR không có FE nào ⇒ luật <b>chưa được cài</b>. Một FE không có BR hay UC nào ⇒ bạn <b>tự nghĩ ra nó</b>.</p>` },

  { t: 'Tự đo tài liệu 3 của bạn', body: `
    <div class="steps">
      <div><span class="n">1</span>Có đủ <b>năm</b> loại chưa? Thiếu loại nào là dấu hiệu chưa tìm hết</div>
      <div><span class="n">2</span>Mỗi rule có ghi <b>nguồn</b> chưa (ai nói, hay tài liệu nào)?</div>
      <div><span class="n">3</span>Có rule nào bạn đánh tĩnh mà thật ra động không?</div>
      <div><span class="n">4</span>Có bảng rule CỐ Ý không cài chưa?</div>
    </div>` },
];
