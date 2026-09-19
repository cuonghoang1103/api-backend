export const deck = { key: 'asg4', code: 'A.4', title: 'Phân công 5 người', sub: 'SWR302 · Software Requirements · Assignment (20%)' };
export const slides = [
  { kind: 'cover', t: 'Năm người, tám tài liệu', sub: 'Chia việc thế nào để không ai ngồi chơi và không ai gánh hết',
    body: `<p class="cov-meta">SWR302 · A.4 · Bảng RACI + nhịp họp</p>` },

  { t: 'Cách chia SAI mà nhóm nào cũng thử', body: `
    <div class="box warn"><b>"Mỗi người một tài liệu, cuối kỳ ghép lại."</b></div>
    <p class="lead2">Nó hỏng vì tám tài liệu <b>ăn đầu ra của nhau</b>. Người viết SRS phải chờ use case xong; người ước lượng phải chờ SRS xong.</p>
    <p class="note">Kết quả thường thấy: hai người làm tuần 3–5, ba người làm tuần 8, và bốn người không trả lời được khi thầy gọi kiểm tra.</p>` },

  { t: 'Chia theo VAI, không theo tài liệu', body: `
    <table class="t big2">
      <tr><th>Nhóm trưởng / BA chính</th><td class="hl">Giữ Vision &amp; Scope và SRS · ráp mọi thứ · người trả lời khi bị gọi</td></tr>
      <tr><th>BA use case</th><td>Use case + luồng ngoại lệ + dialog map</td></tr>
      <tr><th>BA luật &amp; dữ liệu</th><td>Business rules + từ điển dữ liệu + bảng quyết định</td></tr>
      <tr><th>BA mô hình &amp; giao diện</th><td>Context/DFD/ERD/state + mockup</td></tr>
      <tr><th>BA kế hoạch &amp; chất lượng</th><td>Ưu tiên + ước lượng + rà soát chéo + ma trận truy vết</td></tr>
    </table>` },

  { t: 'Bảng RACI', body: `
    <table class="t">
      <tr><th>Tài liệu</th><th>Trưởng</th><th>UC</th><th>Luật</th><th>Mô hình</th><th>KH</th></tr>
      <tr><td>1. Vision &amp; Scope</td><td class="hl">A/R</td><td>C</td><td>C</td><td>C</td><td>C</td></tr>
      <tr><td>2. Use Cases</td><td>A</td><td class="hl">R</td><td>C</td><td>C</td><td>I</td></tr>
      <tr><td>3. Business Rules</td><td>A</td><td>C</td><td class="hl">R</td><td>I</td><td>I</td></tr>
      <tr><td>4. SRS</td><td class="hl">A/R</td><td>R</td><td>R</td><td>R</td><td>C</td></tr>
      <tr><td>5. Data Dictionary</td><td>A</td><td>C</td><td class="hl">R</td><td>C</td><td>I</td></tr>
      <tr><td>6. Mockups</td><td>A</td><td>C</td><td>I</td><td class="hl">R</td><td>I</td></tr>
      <tr><td>7. Ưu tiên</td><td>A</td><td>C</td><td>C</td><td>I</td><td class="hl">R</td></tr>
      <tr><td>8. Ước lượng</td><td>A</td><td>C</td><td>I</td><td>C</td><td class="hl">R</td></tr>
    </table>
    <p class="note">R = làm · A = chịu trách nhiệm cuối · C = được hỏi ý · I = được báo. <b>Mỗi dòng đúng một chữ A.</b></p>` },

  { t: 'Luật "mỗi người chạm vào SRS"', body: `
    <p class="lead2">Dòng số 4 của bảng RACI có <b>bốn chữ R</b>. Đó là cố ý.</p>
    <div class="box ok">SRS là tài liệu trung tâm. Nếu cả bốn người cùng viết vào nó thì cả bốn người đều biết hệ thống làm gì — và <b>ai bị gọi kiểm tra cũng trả lời được</b>.</div>
    <p class="note">Đây là chốt chặn trực tiếp cho rủi ro lớn nhất của bài: thầy gọi đúng người không biết gì.</p>` },

  { t: 'Nhịp làm việc mỗi tuần', body: `
    <div class="steps">
      <div><span class="n">1</span><b>Thứ 2</b> — họp 30 phút: tuần này ai giao cái gì</div>
      <div><span class="n">2</span><b>Thứ 5</b> — nộp bản nháp vào Google Doc chung, không chờ hoàn hảo</div>
      <div><span class="n">3</span><b>Thứ 7</b> — rà chéo: mỗi người đọc tài liệu của <b>người khác</b>, ghi chú vào lề</div>
      <div><span class="n">4</span><b>Chủ nhật</b> — trưởng nhóm gộp, cập nhật ma trận truy vết</div>
    </div>
    <p class="note">Rà chéo là thứ bắt lỗi lệch giữa tài liệu — chỗ mất điểm nhiều nhất. Đừng bỏ bước thứ 7.</p>` },

  { t: 'Nhật ký đóng góp', body: `
    <table class="t">
      <tr><th>Tuần</th><th>Thành viên</th><th>Đã giao</th><th>Giờ</th></tr>
      <tr><td>3</td><td>A</td><td>UC-01…UC-05 luồng chính</td><td>6</td></tr>
      <tr><td>3</td><td>B</td><td>BR-01…BR-08</td><td>5</td></tr>
      <tr><td>4</td><td>A</td><td>UC-06 + luồng ngoại lệ</td><td>4</td></tr>
    </table>
    <p class="lead2">Một bảng, cập nhật mỗi tuần, <b>nộp kèm bài</b>.</p>
    <p class="note">Nó bảo vệ nhóm khi có người không làm, và bảo vệ người làm nhiều khi điểm chia đều.</p>` },

  { t: 'Khi có người không làm', body: `
    <div class="steps">
      <div><span class="n">1</span>Tuần 1 im lặng: nhắn riêng, hỏi có vướng gì</div>
      <div><span class="n">2</span>Tuần 2 im lặng: nêu trong họp nhóm, ghi vào nhật ký</div>
      <div><span class="n">3</span>Tuần 3 im lặng: báo thầy, kèm nhật ký đóng góp</div>
    </div>
    <div class="box warn">Đừng lặng lẽ gánh hết rồi tới tuần 9 mới nói. Lúc đó không còn bằng chứng nào, và nhóm trưởng là người mất nhiều nhất.</div>` },

  { t: 'Việc của nhóm trưởng thật ra là gì', body: `
    <div class="grid3">
      <div class="card"><b>Giữ nhất quán</b>Tám tài liệu nói cùng một chuyện</div>
      <div class="card"><b>Gỡ chặn</b>Ai đang chờ ai, gỡ trong ngày</div>
      <div class="card"><b>Giữ truy vết</b>Ma trận UC ↔ FE ↔ BR luôn cập nhật</div>
    </div>
    <p class="note">Không phải viết nhiều nhất. Là người <b>duy nhất đọc hết cả tám tài liệu</b> — và vì thế là người duy nhất thấy chỗ chúng mâu thuẫn.</p>` },
];
