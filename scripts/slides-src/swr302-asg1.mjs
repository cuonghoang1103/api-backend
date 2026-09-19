export const deck = { key: 'asg1', code: 'A.1', title: 'Đề bài', sub: 'SWR302 · Software Requirements · Assignment (20%)' };
export const slides = [
  { kind: 'cover', t: 'Assignment nhóm — 20%', sub: 'Tám tài liệu, năm người, tám tuần',
    body: `<p class="cov-meta">SWR302 · A.1 · CLO2–CLO9<br/>Nhận đề <b>đầu tuần 2</b> · Thuyết trình <b>tuần 9</b></p>` },

  { t: 'Tám tài liệu phải nộp', body: `
    <table class="t big2">
      <tr><th>1. Vision &amp; Scope</th><td>Tại sao làm, làm tới đâu — Wiegers ch.5</td></tr>
      <tr><th>2. Use Cases</th><td>Người dùng làm được gì — ch.8</td></tr>
      <tr><th>3. Business Rules</th><td>Luật doanh nghiệp, tách khỏi phần mềm — ch.9</td></tr>
      <tr><th>4. SRS</th><td class="hl">Tài liệu trung tâm, mọi thứ khác chảy vào đây — ch.10</td></tr>
      <tr><th>5. Data Dictionary</th><td>Một tên, một nghĩa — ch.13</td></tr>
      <tr><th>6. Mockups</th><td>Bản vẽ màn hình — ch.15</td></tr>
      <tr><th>7. Prioritization</th><td>Làm gì trước, có số — ch.16</td></tr>
      <tr><th>8. Estimation</th><td>Bao nhiêu công — ch.19</td></tr>
    </table>` },

  { t: 'Tám tài liệu KHÔNG phải tám bài rời', body: `
    <div class="dg">
      <div class="bx">Vision &amp; Scope</div><div class="ar">──▶</div>
      <div class="bx">Use Cases</div><div class="ar">──▶</div>
      <div class="bx st">SRS</div><div class="ar">──▶</div>
      <div class="bx">Ưu tiên</div><div class="ar">──▶</div>
      <div class="bx">Ước lượng</div>
    </div>
    <p class="lead2">Mỗi tài liệu <b>ăn đầu ra</b> của tài liệu trước. Đổi phạm vi ở tài liệu 1 ⇒ phải sửa cả bảy cái sau.</p>
    <p class="note">Đó là lý do <b>không chia mỗi người một tài liệu rồi ghép lại cuối kỳ</b> — xem A.4.</p>` },

  { t: 'Hai đề tài, chọn MỘT', body: `
    <div class="grid2">
      <div class="cardb"><b>TP1 — Học vụ &amp; Đăng ký môn</b>
        Thay hệ cũ · 12.000 sinh viên · đỉnh 4.200 người cùng lúc<br/>
        <span class="nh">Khó ở: hiệu năng đỉnh, quy tắc tiên quyết, xung đột lịch</span></div>
      <div class="cardp"><b>TP2 — Quản lý đơn hàng TMĐT</b>
        Xây mới · nhiều kênh bán · nhiều kho · hãng vận chuyển<br/>
        <span class="nh">Khó ở: đồng bộ tồn kho, định tuyến kho, tích hợp 3PL</span></div>
    </div>
    <p class="note">Cả hai đề đều đủ sức cho 8 tài liệu. Chọn theo <b>nhóm bạn hiểu lĩnh vực nào hơn</b>, không chọn theo cái nào trông dễ.</p>` },

  { t: 'Tuần 2 → tuần 9', body: `
    <div class="steps">
      <div><span class="n">2</span>Nhận đề · chốt phạm vi · Vision &amp; Scope nháp</div>
      <div><span class="n">3</span>Phỏng vấn/giả lập bên liên quan · use case v1</div>
      <div><span class="n">4</span>Use case đầy đủ · business rules</div>
      <div><span class="n">5</span>SRS phần chức năng</div>
      <div><span class="n">6</span>Chất lượng (Planguage) · từ điển dữ liệu</div>
      <div><span class="n">7</span>Mockup · rà soát chéo</div>
      <div><span class="n">8</span>Ưu tiên · ước lượng · đóng gói</div>
      <div><span class="n">9</span>Thuyết trình</div>
    </div>` },

  { t: 'Thầy gọi kiểm tra BẤT CHỢT', body: `
    <p class="lead2">Từ tuần 2 đến tuần 9, thầy có thể gọi bất kỳ lúc nào, hỏi <b>tiến độ</b> và <b>cách làm</b>.</p>
    <div class="box warn"><b>Câu hỏi hay gặp nhất:</b> "Yêu cầu này em lấy ở đâu ra?"<br/>
      Trả lời được bằng một dòng truy vết (UC-04 → FE-12 → BR-07) là đạt. Trả lời "em nghĩ là cần" là trượt.</div>
    <p class="note">Ngân hàng 40 câu hỏi kiểm tra + cách trả lời nằm ở bài <b>A.5</b>.</p>` },

  { t: 'Ba thứ làm rớt điểm cả nhóm', body: `
    <div class="grid3">
      <div class="card"><b>Không truy vết</b>Yêu cầu không gắn được về use case hay nguồn nào</div>
      <div class="card"><b>Lệch nhau</b>Vision nói ngoài phạm vi, SRS lại đặc tả</div>
      <div class="card"><b>Một người làm hết</b>Bốn người còn lại không trả lời được khi bị gọi</div>
    </div>
    <p class="note">Cả ba đều <b>kiểm được bằng máy</b> trước khi nộp — bảng tự kiểm ở bài A.10.</p>` },

  { t: 'Điểm 20% này chấm cái gì', body: `
    <table class="t big2">
      <tr><th>Đầy đủ</th><td>Có đủ 8 tài liệu, mỗi cái đúng khuôn Wiegers</td></tr>
      <tr><th>Nhất quán</th><td class="hl">Tám tài liệu nói cùng một chuyện — chỗ mất điểm nhiều nhất</td></tr>
      <tr><th>Truy vết</th><td>Mọi yêu cầu về được nguồn; mọi use case ra được yêu cầu</td></tr>
      <tr><th>Chất lượng viết</th><td>Không mơ hồ, kiểm chứng được, có số</td></tr>
      <tr><th>Cá nhân</th><td>Trả lời được khi bị gọi kiểm tra giữa kỳ</td></tr>
    </table>` },

  { t: 'Tuần này làm gì', body: `
    <div class="steps">
      <div><span class="n">1</span>Chốt đề tài và ghi vào nhóm chat — đừng để tuần 3 còn đổi</div>
      <div><span class="n">2</span>Chia vai theo A.4, dán bảng RACI vào Google Doc chung</div>
      <div><span class="n">3</span>Đọc A.2 hoặc A.3 (đề đã chọn) — gạch chân mọi con số trong đề</div>
      <div><span class="n">4</span>Viết nháp Vision &amp; Scope mục 1.1 và 1.2</div>
    </div>
    <p class="note">Bộ tài liệu mẫu hoàn chỉnh của <b>cả hai đề</b> nằm ở hai mục "Bộ tài liệu mẫu" trong khoá — đọc để biết đích đến trông thế nào.</p>` },
];
