export const deck = { key: 'p1d4', code: 'W1.4', title: 'TP1 · SRS', sub: 'SWR302 · Software Requirements · Bộ tài liệu mẫu' };
export const slides = [
  { kind: 'cover', t: 'SRS của CARS — 109 yêu cầu', sub: 'Tài liệu 4 — tài liệu trung tâm, mọi thứ chảy vào đây',
    body: `<p class="cov-meta">SWR302 · W1.4 · Wiegers Ch. 10<br/>14 nhóm tính năng · 109 functional · 15 chất lượng Planguage</p>` },

  { t: 'Sáu mục, và hai mục mang trọng số', body: `
    <table class="t big2">
      <tr><th>1. Giới thiệu</th><td>Mục đích · phạm vi · định nghĩa · tham chiếu</td></tr>
      <tr><th>2. Mô tả tổng thể</th><td>Bối cảnh · lớp người dùng · môi trường · <b>giả định</b></td></tr>
      <tr><th>3. Yêu cầu chức năng</th><td class="hl">109 FE-xx, nhóm theo 14 tính năng</td></tr>
      <tr><th>4. Giao diện ngoài</th><td>8 giao tiếp: Gradebook, Tài chính, LDAP, email…</td></tr>
      <tr><th>5. Thuộc tính chất lượng</th><td class="hl">15 mục Planguage — chỗ sinh viên viết non nhất</td></tr>
      <tr><th>6. Khác</th><td>Dữ liệu · tuân thủ · glossary · danh sách TBD</td></tr>
    </table>` },

  { t: 'Mật độ: 14 use case ⇒ 109 yêu cầu', body: `
    <p class="lead2">Trung bình <b>7,8 yêu cầu cho mỗi use case</b>. Đó là thước hiệu chuẩn cho bài của bạn.</p>
    <div class="grid3">
      <div class="card"><b>&lt; 4 FE/UC</b>Đang viết lại use case, chưa phân rã</div>
      <div class="card"><b>6–9 FE/UC</b>Mật độ môn này mong đợi</div>
      <div class="card"><b>&gt; 14 FE/UC</b>Đang lấn sang thiết kế</div>
    </div>
    <p class="note">Đếm trước khi lo. Nếu bạn có 14 use case mà chỉ 40 yêu cầu thì vấn đề không phải ở chữ nghĩa.</p>` },

  { t: 'Một yêu cầu chức năng ĐẠT', body: `
    <div class="box warn"><b>Không đạt:</b> "Hệ thống nên xử lý đăng ký nhanh và thân thiện."</div>
    <div class="box ok"><b>FE-12.</b> Khi sinh viên gửi yêu cầu đăng ký, hệ thống <b>phải</b> kiểm BR-03, BR-05, BR-08 <b>theo thứ tự đó</b> và trả kết quả trong 3 giây ở tải đỉnh.</div>
    <table class="t">
      <tr><th>Có mã</th><th>Dùng "shall"</th><th>Kiểm chứng được</th><th>Trỏ về BR</th></tr>
      <tr><td>FE-12</td><td>phải</td><td>3 giây, đo được</td><td class="hl">BR-03/05/08</td></tr>
    </table>` },

  { t: 'Thứ tự kiểm cũng là YÊU CẦU', body: `
    <p class="lead2">"Theo thứ tự đó" không phải chữ thừa. Nếu kiểm chỗ trống trước tiên quyết, sinh viên thiếu tiên quyết sẽ nhận thông báo <b>"lớp đã đầy"</b> — sai lý do, và sẽ đi hỏi cố vấn.</p>
    <div class="box warn">Đó chính là 4.800 lượt hỏi mỗi kỳ mà BO-5 muốn giảm. Một chi tiết thứ tự trong tài liệu 4 nối thẳng về một mục tiêu ở tài liệu 1.</div>` },

  { t: 'Planguage — 15 thuộc tính chất lượng', body: `
    <table class="t big2">
      <tr><th>TAG</th><td>PERF-01</td></tr>
      <tr><th>SCALE</th><td class="hl">Phiên đồng thời hệ thống phục vụ mà p95 &lt; 3s</td></tr>
      <tr><th>METER</th><td>Thử tải trên môi trường giống production, kịch bản 72h</td></tr>
      <tr><th>MUST</th><td>4.200 (bằng đỉnh thật đã đo)</td></tr>
      <tr><th>PLAN</th><td class="hl">6.000</td></tr>
      <tr><th>WISH</th><td>8.000</td></tr>
    </table>
    <p class="note">MUST = ngưỡng thất bại, PLAN = đích, WISH = mơ ước. Ghi một con số rồi thôi là bỏ mất hai phần ba giá trị.</p>` },

  { t: 'Có thuộc tính chất lượng mốc là SỐ KHÔNG', body: `
    <div class="box ok"><b>DATA-02 · SCALE:</b> số chỗ bị cấp cho hai sinh viên trong một đợt đăng ký · <b>MUST: 0</b></div>
    <p class="lead2">Không phải "hiếm khi", không phải "99,9%". <b>Không có cái nào</b>. Một chỗ cấp trùng là một sinh viên mất môn.</p>
    <p class="note">Viết được mốc 0 nghĩa là nhóm hiểu đây là ràng buộc tính đúng đắn, không phải chỉ tiêu hiệu năng.</p>` },

  { t: 'Danh sách TBD là một PHẦN của tài liệu', body: `
    <table class="t big2">
      <tr><th>TBD-3</th><td>Quy chế mới có đổi trần tín chỉ không? — chờ Hội đồng học vụ, hạn 30/10</td></tr>
      <tr><th>TBD-5</th><td class="hl">Dữ liệu tiên quyết hệ cũ sai bao nhiêu phần trăm? — chờ phòng CNTT trích mẫu</td></tr>
    </table>
    <p class="lead2">Mỗi TBD ghi <b>ai trả lời</b> và <b>hạn nào</b>. TBD không có chủ thì không phải TBD, nó là một chỗ trống.</p>
    <p class="note">TBD-5 quay lại ở tài liệu 8 làm lý do xin thêm BA.</p>` },

  { t: 'Tự đo SRS của bạn', body: `
    <div class="steps">
      <div><span class="n">1</span>Số FE ÷ số UC — có rơi vào 6–9 không?</div>
      <div><span class="n">2</span>Mọi FE có mã, có "phải", có thứ đo được chưa?</div>
      <div><span class="n">3</span>Mục 5 có đủ SCALE + METER cho <b>mọi</b> thuộc tính chưa?</div>
      <div><span class="n">4</span>Có danh sách TBD, mỗi cái có chủ và hạn chưa?</div>
    </div>` },
];
