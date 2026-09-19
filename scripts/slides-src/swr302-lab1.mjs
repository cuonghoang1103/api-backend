export const deck = { key: 'labL1', code: 'LAB 1', title: 'Chọn mô hình nào', sub: 'SWR302 · Software Requirements · LAB (10%)' };

export const slides = [
  { kind: 'cover', t: 'LAB — Vẽ mô hình yêu cầu', sub: 'Mô hình nào trả lời câu hỏi nào',
    body: `<p class="cov-meta">SWR302 · LAB chiếm <b>10%</b> điểm môn · CLO5–CLO6<br/>Wiegers &amp; Beatty — <i>Software Requirements</i>, Ch. 12</p>` },

  { t: 'LAB là gì trong SWR302?', body: `
    <p class="lead2">LAB là nửa <b>VẼ</b> của môn học. Assignment bắt bạn làm ra một bộ tài liệu; LAB bắt bạn làm ra <b>một mô hình đúng, mỗi lần một cái</b> — và giải thích được vì sao chọn nó.</p>
    <div class="grid3">
      <div class="card"><b>10%</b>điểm quá trình</div>
      <div class="card"><b>CLO5–6</b>phân tích &amp; mô hình hoá</div>
      <div class="card"><b>85 phút</b>Practical Exam 25%</div>
    </div>
    <p class="note">Practical Exam cho một tình huống và bắt bạn vẽ tại chỗ. Không ôn bằng cách đọc được — mỗi buổi LAB là một lượt tổng duyệt.</p>` },

  { t: 'Chọn theo CÂU HỎI, không theo thói quen', body: `
    <p class="nh">Lỗi phổ biến nhất: vẽ mô hình mình thấy dễ nhất</p>
    <table class="t">
      <tr><th>Câu hỏi cần trả lời</th><th>Mô hình</th></tr>
      <tr><td>Cái gì trong hệ thống, cái gì ngoài?</td><td class="hl">Context diagram</td></tr>
      <tr><td>Ai làm gì, thứ tự nào, bàn giao ở đâu?</td><td class="hl">Swimlane</td></tr>
      <tr><td>Vật này ở trạng thái nào, cái gì chuyển nó?</td><td class="hl">State diagram</td></tr>
      <tr><td>Dữ liệu từ đâu, đi đâu, nằm ở đâu?</td><td class="hl">DFD</td></tr>
      <tr><td>Có những thứ gì, quan hệ ra sao?</td><td class="hl">ERD</td></tr>
      <tr><td>Điều kiện này thì hệ thống làm gì?</td><td class="hl">Decision table</td></tr>
    </table>` },

  { t: 'Cái bẫy: Swimlane ≠ DFD', body: `
    <div class="two">
      <div class="box ok"><b>Swimlane</b><br/>Ai hành động, và LÚC NÀO.<br/><span class="note">Có lane theo vai trò. Có thứ tự.</span></div>
      <div class="box warn"><b>DFD</b><br/>Dữ liệu nào di chuyển, nằm lại ĐÂU.<br/><span class="note">Không có actor. Không có thứ tự.</span></div>
    </div>
    <p class="lead2">Hai cái trông giống nhau — hộp nối bằng mũi tên — nhưng trả lời hai câu hỏi khác nhau và <b>được chấm khác nhau</b>.</p>
    <p class="note">Vẽ DFD có actor, hay swimlane có kho dữ liệu, đều mất điểm dù bức hình còn lại đúng hết.</p>` },

  { t: 'Quy tắc 1 — Ghi nhãn TẤT CẢ', body: `
    <div class="dg">
      <div class="bx ext">Kênh bán</div><div class="ar">──▶</div><div class="oval">OMFS</div>
    </div>
    <p class="note" style="text-align:center">✕ Mũi tên trần — người chấm không biết cái gì chảy trên đó</p>
    <div class="dg">
      <div class="bx ext">Kênh bán</div><div class="ar">──▶<small>dữ liệu đơn hàng</small></div><div class="oval">OMFS</div>
    </div>
    <p class="note" style="text-align:center">✓ Có nhãn — đây là chỗ mất điểm nhiều nhất của cả môn</p>` },

  { t: 'Quy tắc 2 & 3', body: `
    <div class="box"><b>2 · Một mức trừu tượng</b><br/>Đừng để “Xử lý đơn hàng” nằm cạnh “Bấm nút Lưu”. Hai hộp không tương đương độ lớn ⇒ một cái đang ở nhầm sơ đồ.</div>
    <div class="box"><b>3 · Vẽ ranh giới hệ thống</b><br/>Nói rõ cái gì trong, cái gì ngoài. Sơ đồ không có khung ranh giới nghĩa là tác giả <b>chưa từng quyết định phạm vi</b>.</div>` },

  { t: 'Quy tắc 4 & 5', body: `
    <div class="box warn"><b>4 · Vẽ cả đường HỎNG</b><br/>Mô hình chỉ có đường thành công là mô hình của một thế giới không tồn tại. Mọi sơ đồ nên có ít nhất một nhánh hỏng / từ chối / ngoại lệ.</div>
    <div class="box"><b>5 · Chú giải khi tự chế ký hiệu</b><br/>Được phép lệch chuẩn — <b>không</b> được lệch trong im lặng.</div>` },

  { t: 'Công cụ & nộp gì', body: `
    <div class="grid3">
      <div class="card"><b>draw.io</b>miễn phí, trình duyệt</div>
      <div class="card"><b>Visual Paradigm</b>bản Community</div>
      <div class="card"><b>BOUML</b>nhẹ, offline</div>
    </div>
    <p class="lead2">Nộp <b>ảnh xuất ra</b> <u>và</u> <b>file nguồn sửa được</b>.</p>
    <p class="note">Ở buổi kiểm tra thầy hay bắt sửa sơ đồ ngay tại chỗ — nhóm chỉ có ảnh dẹt thì chịu.</p>` },

  { t: 'LAB nuôi Assignment, và nuôi cả bài thi', body: `
    <div class="steps">
      <div><span class="n">1</span>Bài luyện LAB lấy từ chính đề <b>TP1 / TP2</b> của Assignment</div>
      <div><span class="n">2</span>Mô hình vẽ ở LAB là mô hình nhóm bạn <b>cần nộp</b> trong Assignment</div>
      <div><span class="n">3</span>Practical Exam (25%) hỏi đúng những mô hình này, có tính giờ</div>
    </div>
    <p class="lead2">Ba cột điểm — LAB 10%, Assignment 20%, Practical 25% — dùng chung một kỹ năng. <b>Tổng 55%.</b></p>` },
];
