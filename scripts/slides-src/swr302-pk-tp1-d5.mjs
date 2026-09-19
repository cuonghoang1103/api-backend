export const deck = { key: 'p1d5', code: 'W1.5', title: 'TP1 · Data dictionary', sub: 'SWR302 · Software Requirements · Bộ tài liệu mẫu' };
export const slides = [
  { kind: 'cover', t: 'Data dictionary — 91 mục', sub: 'Tài liệu 5 — một tên, một nghĩa, trong cả tám tài liệu',
    body: `<p class="cov-meta">SWR302 · W1.5 · Wiegers Ch. 13<br/>Xếp theo bảng chữ cái · đúng ký pháp · mọi phần tử có mục riêng</p>` },

  { t: 'Mục đích KHÔNG phải để tra cứu', body: `
    <p class="lead2">Là để cả nhóm dùng <b>đúng một từ cho đúng một thứ</b>. Hai tên cho một khái niệm là cách một nhóm đi tới chỗ dựng hai trường dữ liệu khác nhau.</p>
    <div class="box warn">Trên TP1: "lớp học phần", "section", "class" từng xuất hiện cả ba trong bản nháp. Từ điển chốt <b>section</b>, và bảy chỗ khác phải sửa theo.</div>` },

  { t: 'Ký pháp — năm ký hiệu', body: `
    <table class="t big2">
      <tr><th>+</th><td>và (thành phần bắt buộc)</td></tr>
      <tr><th>( )</th><td>tuỳ chọn</td></tr>
      <tr><th>{ }</th><td class="hl">lặp lại · viết min:max ở ngoài</td></tr>
      <tr><th>[ a | b ]</th><td>chọn một trong các phương án</td></tr>
      <tr><th>= </th><td>được định nghĩa là</td></tr>
    </table>
    <p class="note">Ký pháp này không phải để trông chuyên nghiệp — nó nén được cấu trúc mà văn xuôi phải viết cả đoạn.</p>` },

  { t: 'Một mục ĐẠT trông thế nào', body: `
    <table class="t big2">
      <tr><th>Tên</th><td>Registration Request</td></tr>
      <tr><th>Định nghĩa</th><td class="hl">= Student ID + Section Code + Request Timestamp + (Override Justification)</td></tr>
      <tr><th>Kiểu/Ràng buộc</th><td>Section Code: chuỗi 8 ký tự, <code>^[A-Z]{3}\\d{3}-\\d{2}$</code></td></tr>
      <tr><th>Values</th><td>trỏ BR-05, không chép lại luật</td></tr>
    </table>
    <p class="lead2">Cột ràng buộc mới là phần <b>làm việc</b>: regex, khoảng, hoặc công thức. Mục chỉ có lời mô tả là chưa định nghĩa gì.</p>` },

  { t: 'Mọi phần tử trong cấu trúc PHẢI có mục riêng', body: `
    <p class="lead2">Registration Request nhắc tới <b>Override Justification</b> ⇒ Override Justification phải có mục của chính nó, kèm độ dài tối đa.</p>
    <div class="box warn">Đây là phép kiểm máy chạy được: duyệt mọi định nghĩa, tách tên thành phần, đối chiếu với danh sách mục. Thiếu là lộ ngay.</div>
    <p class="note">Chính phép kiểm này bắt được thiếu mục <b>District</b> khi dựng bộ TP2 — mắt đọc không ra.</p>` },

  { t: 'Catalog Year — mục lộ ra một quyết định', body: `
    <p class="lead2">Viết mục <b>Catalog Year</b> buộc nhóm trả lời: sinh viên tuân theo quy chế năm nào?</p>
    <div class="box warn">Câu trả lời — <b>năm nhập học</b> — làm BR-03 không còn là một luật mà là một họ luật, và thêm một trường vào Student. Đổi cả ERD.</div>
    <p class="note">Một mục từ điển làm đổi mô hình dữ liệu. Đó là lý do làm tài liệu 5 SỚM, đừng để tới tuần 8.</p>` },

  { t: 'NeedsReview và Queue Position', body: `
    <table class="t big2">
      <tr><th>NeedsReview</th><td class="hl">Cờ đánh dấu bản ghi tiên quyết nhập từ hệ cũ mà máy không chắc — sinh ra từ RI-1</td></tr>
      <tr><th>Queue Position</th><td>Vị trí trong danh sách chờ. Tồn tại vì sinh viên HỎI về nó — không hệ thống nào tính sẵn thì CSKH phải đếm tay</td></tr>
    </table>
    <p class="lead2">Cả hai không có trong đề. Chúng ra từ việc <b>viết từ điển</b>, và mỗi cái sinh thêm yêu cầu ở tài liệu 4.</p>` },

  { t: 'Đối chiếu chéo từ điển ↔ mockup', body: `
    <div class="steps">
      <div><span class="n">1</span>Liệt kê mọi trường hiển thị trên mọi mockup</div>
      <div><span class="n">2</span>Đối chiếu với danh sách mục từ điển</div>
      <div><span class="n">3</span>Trường có trên màn hình mà không có trong từ điển ⇒ <b>chưa ai định nghĩa</b></div>
      <div><span class="n">4</span>Mục trong từ điển mà không màn hình nào dùng ⇒ hỏi xem có thừa không</div>
    </div>
    <p class="note">Hai chiều, không phải một. Chiều thứ hai tìm ra thứ bạn viết thừa.</p>` },

  { t: 'Tự đo từ điển của bạn', body: `
    <table class="t big2">
      <tr><th>&lt; 40 mục</th><td>Chưa soi mockup và use case đủ kỹ</td></tr>
      <tr><th>Mục không có ràng buộc</th><td class="hl">Chưa định nghĩa, mới chỉ mô tả</td></tr>
      <tr><th>Phần tử con không có mục riêng</th><td>Kiểm bằng script, đừng đọc</td></tr>
      <tr><th>Values chép lại luật</th><td>Phải TRỎ về BR-xx, nếu không luật đổi là lệch hai chỗ</td></tr>
    </table>` },
];
