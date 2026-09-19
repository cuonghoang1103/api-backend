export const deck = { key: 'p2d4', code: 'W2.4', title: 'TP2 · SRS', sub: 'SWR302 · Software Requirements · Bộ tài liệu mẫu' };
export const slides = [
  { kind: 'cover', t: 'SRS của OMFS — 101 yêu cầu', sub: 'Tài liệu 4 — 18 thuộc tính chất lượng viết bằng Planguage',
    body: `<p class="cov-meta">SWR302 · W2.4 · Wiegers Ch. 10<br/>14 nhóm tính năng · 10 giao tiếp phần mềm · i18n · glossary · TBD</p>` },

  { t: 'Mật độ: 14 use case ⇒ 101 yêu cầu', body: `
    <p class="lead2"><b>7,2 yêu cầu mỗi use case</b> — sát TP1 (7,8). Hai đề khác hẳn nhau về lĩnh vực mà mật độ gần như trùng: đó là mật độ mà khuôn Wiegers tự nhiên dẫn tới.</p>
    <div class="box ok">Dùng nó làm thước: 14 use case của bạn nên ra khoảng <b>85–120</b> yêu cầu. Ra 40 thì chưa phân rã; ra 200 thì đã lấn sang thiết kế.</div>` },

  { t: 'Một yêu cầu ĐẠT — và chỗ nó trỏ về', body: `
    <div class="box ok"><b>FE-27.</b> Khi định tuyến một đơn, hệ thống <b>phải</b> ưu tiên phương án giao trọn từ MỘT kho; chỉ tách khi không kho nào đủ hàng, và <b>không quá 3 lô</b> (BR-06).</div>
    <table class="t">
      <tr><th>Mã</th><th>"phải"</th><th>Kiểm chứng được</th><th>Trỏ về</th></tr>
      <tr><td>FE-27</td><td>✓</td><td>đếm số lô, ≤ 3</td><td class="hl">BR-06 · UC-04</td></tr>
    </table>` },

  { t: 'Yêu cầu cho LUỒNG HỎNG, không chỉ luồng vui', body: `
    <div class="box warn"><b>FE-28.</b> Nếu phương án tách tối ưu cần quá 3 lô, hệ thống <b>phải</b> từ chối định tuyến, <b>không tạo lô nào</b>, và đưa đơn vào bảng ngoại lệ kèm mã lý do.</div>
    <p class="lead2">Cụm "<b>không tạo lô nào</b>" là phần đắt nhất câu này. Thiếu nó, cài đặt hợp lệ có thể tạo 3 lô rồi bỏ dở — để lại tồn kho bị giữ mà không ai nhả.</p>` },

  { t: 'Planguage — 18 thuộc tính', body: `
    <table class="t big2">
      <tr><th>TAG</th><td>PERF-03</td></tr>
      <tr><th>GIST</th><td>Độ trễ đồng bộ tồn kho ra các kênh</td></tr>
      <tr><th>SCALE</th><td class="hl">Giây từ lúc tồn đổi tới lúc kênh cuối cùng nhận được</td></tr>
      <tr><th>METER</th><td>p95 đo trong 7 ngày, gồm một đợt sale</td></tr>
      <tr><th>MUST / PLAN / WISH</th><td>≤ 120s · ≤ 30s · ≤ 5s</td></tr>
    </table>
    <p class="note">Con số này nối thẳng về BO-1: tồn kho đồng bộ chậm <b>chính là</b> cơ chế sinh ra 3,8% bán vượt tồn.</p>` },

  { t: 'Mười giao tiếp phần mềm', body: `
    <div class="grid3">
      <div class="card"><b>2 sàn TMĐT</b>đơn vào, tồn ra</div>
      <div class="card"><b>Storefront</b>đơn vào, tồn ra</div>
      <div class="card"><b>Cổng thanh toán</b>trạng thái uỷ quyền</div>
      <div class="card"><b>4 hãng 3PL</b>báo giá, nhãn, trạng thái</div>
      <div class="card"><b>Kế toán</b>xuất theo ngày</div>
      <div class="card"><b>Email/SMS</b>báo khách</div>
    </div>
    <p class="note">Mỗi giao tiếp cần: giao thức, tần suất, xử lý lỗi, và <b>chuyện gì xảy ra khi đầu kia chết</b>. Mục cuối là mục hay bị bỏ.</p>` },

  { t: 'i18n: hai thứ tiếng, một mã đơn', body: `
    <p class="lead2">Giao diện kho tiếng Việt, giao diện khách hai thứ tiếng, nhưng <b>mã đơn và mã lý do ngoại lệ không dịch</b> — chúng là khoá, không phải chữ hiển thị.</p>
    <div class="box warn">Nhóm nào dịch cả mã lý do sẽ có hai bộ mã cho cùng một lỗi, và bảng ngoại lệ không lọc được.</div>` },

  { t: 'Glossary + TBD', body: `
    <table class="t big2">
      <tr><th>Glossary</th><td>sellable quantity · hold window · split shipment · exception code — trùng khớp từ điển dữ liệu, không định nghĩa lại</td></tr>
      <tr><th>TBD-2</th><td class="hl">Đơn đã đóng gói còn huỷ được không? — Giám đốc TMĐT, hạn 15/11</td></tr>
      <tr><th>TBD-4</th><td>Hạn mức gọi API của hai sàn là bao nhiêu? — phòng tích hợp</td></tr>
    </table>
    <p class="note">Glossary và từ điển dữ liệu nói cùng một chuyện ở hai mức chi tiết. Lệch nhau là mất điểm nhất quán.</p>` },

  { t: 'Tự đo SRS của bạn', body: `
    <div class="steps">
      <div><span class="n">1</span>Số FE ÷ số UC có nằm trong 6–9 không?</div>
      <div><span class="n">2</span>Có yêu cầu nào nói rõ hệ thống KHÔNG được làm gì dở dang chưa?</div>
      <div><span class="n">3</span>Mỗi giao tiếp ngoài có nói "đầu kia chết thì sao" chưa?</div>
      <div><span class="n">4</span>Glossary có khớp từ điển dữ liệu từng chữ không?</div>
    </div>` },
];
