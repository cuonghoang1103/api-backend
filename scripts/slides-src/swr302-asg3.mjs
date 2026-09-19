export const deck = { key: 'asg3', code: 'A.3', title: 'Đề TP2 — OMFS', sub: 'SWR302 · Software Requirements · Assignment (20%)' };
export const slides = [
  { kind: 'cover', t: 'TP2 — Quản lý đơn hàng TMĐT', sub: 'Order Management &amp; Fulfillment System (OMFS)',
    body: `<p class="cov-meta">SWR302 · A.3 · Xây mới<br/>Nhiều kênh bán · nhiều kho · nhiều hãng vận chuyển</p>` },

  { t: 'Bối cảnh', body: `
    <p class="lead2">Nova Retail Group bán trên <b>website riêng, hai sàn TMĐT và một kênh bán sỉ</b>, giao từ <b>ba kho</b> qua nhiều hãng 3PL.</p>
    <div class="box warn">Hôm nay: mỗi kênh một file tồn kho riêng · phiếu giao in tay rồi chia thủ công · không ai biết chính xác còn bao nhiêu hàng bán được.</div>
    <p class="note">Đây là dự án <b>xây mới</b> — nhưng "hiện tại làm bằng tay" vẫn là một trạng thái phải mô hình hoá để chứng minh giá trị.</p>` },

  { t: 'Vấn đề trung tâm: MỘT con số tồn kho', body: `
    <div class="dg">
      <div class="bx ext">Website</div>
      <div class="ar">──▶<small>đơn</small></div>
      <div class="oval">OMFS</div>
      <div class="ar">◀──<small>số bán được</small></div>
      <div class="bx ext">Sàn TMĐT</div>
    </div>
    <p class="lead2">Khái niệm khó nhất của cả đề là <b>sellable quantity</b> — số bán được, khác với số đang nằm trong kho.</p>
    <table class="t">
      <tr><th>On hand</th><th>− Reserved</th><th>− Damaged</th><th>= Sellable</th></tr>
      <tr><td>120</td><td>18</td><td>4</td><td class="hl">98</td></tr>
    </table>
    <p class="note">Định nghĩa sai con số này thì cả tám tài liệu sai theo. Nó phải nằm trong từ điển dữ liệu với đúng công thức.</p>` },

  { t: 'Trong phạm vi / Ngoài phạm vi', body: `
    <div class="grid2">
      <div class="box ok"><b>TRONG</b><br/>Nhận đơn nhiều kênh · giữ tồn · định tuyến kho · nhặt &amp; đóng gói · mua vận chuyển · theo dõi giao · xử lý trả hàng · đồng bộ tồn kho</div>
      <div class="box warn"><b>NGOÀI</b><br/>Storefront &amp; danh mục · giá &amp; khuyến mãi · thanh toán · kế toán · quan hệ khách hàng · mua hàng nhập kho</div>
    </div>
    <p class="note">Đề nói storefront "xử lý tốt việc khách duyệt hàng" ⇒ <b>đừng đặc tả nó</b>. Đây là lỗi phạm vi phổ biến nhất của TP2.</p>` },

  { t: 'Bên liên quan', body: `
    <div class="grid3">
      <div class="card"><b>Quản lý đơn hàng</b>Theo dõi, can thiệp ngoại lệ</div>
      <div class="card"><b>Nhân viên kho</b>Nhặt, đóng gói, giao</div>
      <div class="card"><b>Quản lý tồn kho</b>Giữ con số đúng</div>
      <div class="card"><b>CSKH</b>Trả lời khách về đơn</div>
      <div class="card"><b>Điều phối vận chuyển</b>Chọn hãng, giá cước</div>
      <div class="card"><b>Giám đốc TMĐT</b>Người tài trợ dự án</div>
    </div>
    <p class="note">Bốn hệ thống ngoài: Storefront · Sàn TMĐT · Cổng thanh toán · Hãng 3PL. Đủ mười thực thể cho context diagram (LAB L.2).</p>` },

  { t: '14 use case — bộ khung', body: `
    <table class="t">
      <tr><th>Mã</th><th>Use case</th><th>Actor chính</th></tr>
      <tr><td>UC-01</td><td>Nhận đơn từ kênh bán</td><td>Kênh bán (hệ thống)</td></tr>
      <tr><td>UC-02</td><td>Giữ tồn cho đơn</td><td>OMFS</td></tr>
      <tr><td class="hl">UC-04</td><td class="hl">Định tuyến đơn về kho</td><td class="hl">OMFS</td></tr>
      <tr><td>UC-05</td><td>Nhặt và đóng gói</td><td>Nhân viên kho</td></tr>
      <tr><td>UC-07</td><td>Mua nhãn vận chuyển</td><td>Điều phối vận chuyển</td></tr>
      <tr><td>UC-10</td><td>Xử lý trả hàng</td><td>CSKH</td></tr>
      <tr><td>UC-12</td><td>Đồng bộ tồn kho ra các kênh</td><td>OMFS</td></tr>
    </table>
    <p class="note">Bảng đầy đủ 14 use case nằm ở bộ tài liệu mẫu TP2, tài liệu 2.</p>` },

  { t: 'Chỗ khó nhất của TP2', body: `
    <p class="lead2">UC-04 — <b>chọn kho nào giao</b>. Bốn yếu tố cùng lúc:</p>
    <div class="steps">
      <div><span class="n">1</span>Kho nào còn đủ hàng?</div>
      <div><span class="n">2</span>Kho nào gần khách nhất?</div>
      <div><span class="n">3</span>Kho nào còn sức xử lý hôm nay?</div>
      <div><span class="n">4</span>Ghép được cả đơn vào một kho, hay phải tách?</div>
    </div>
    <div class="box warn">Đây là nơi "chia đơn" xuất hiện — và chia đơn làm phát sinh <b>nhiều lô giao cho một đơn</b>, thứ phải có trong ERD ngay từ đầu.</div>` },

  { t: 'Cái bẫy đồng bộ của TP2', body: `
    <p class="lead2">Sàn TMĐT <b>đã</b> đồng bộ danh mục với storefront — sau lưng OMFS.</p>
    <div class="box warn">Nghĩa là một thay đổi tồn kho có thể tới khách qua con đường OMFS <b>không kiểm soát</b>, và hai con số hiện ra lệch nhau.</div>
    <p class="note">Context diagram không thấy được mắt xích đó. Phải vẽ <b>ecosystem map</b> (LAB L.2, slide 8) mới thấy — và đó là một giả định phải ghi vào Vision &amp; Scope.</p>` },

  { t: 'Bảng tự kiểm TP2', body: `
    <table class="t big2">
      <tr><th>Từ điển dữ liệu</th><td class="hl">"sellable quantity" có công thức, không chỉ có mô tả</td></tr>
      <tr><th>Use case</th><td>UC-04 có luồng tách đơn, không chỉ luồng vui vẻ</td></tr>
      <tr><th>Business rule</th><td>BR-11 (nhả tồn) viết thành bảng 8 cột</td></tr>
      <tr><th>ERD</th><td>Một đơn ↔ nhiều lô giao (không phải 1-1)</td></tr>
      <tr><th>Phạm vi</th><td>Storefront, giá, thanh toán nằm NGOÀI và được nêu tên</td></tr>
    </table>` },
];
