export const deck = { key: 'p2d1', code: 'W2.1', title: 'TP2 · Vision & Scope', sub: 'SWR302 · Software Requirements · Bộ tài liệu mẫu' };
export const slides = [
  { kind: 'cover', t: 'Vision &amp; Scope của OMFS', sub: 'Tài liệu 1 — Nova Retail Group, xây mới',
    body: `<p class="cov-meta">SWR302 · W2.1 · Wiegers Ch. 5<br/>5 brand · 12.000 SKU · 4 kênh · 3 kho · 4 hãng 3PL</p>` },

  { t: 'Sáu mục tiêu, mỗi cái ba mốc', body: `
    <table class="t">
      <tr><th>Mục tiêu</th><th>Hiện tại</th><th>Đích</th></tr>
      <tr><td>BO-1 giảm bán vượt tồn</td><td class="hl">3,8%</td><td class="hl">0,5%</td></tr>
      <tr><td>BO-2 rút thời gian nhận→giao</td><td>26 giờ</td><td>8 giờ</td></tr>
      <tr><td>BO-3 giảm hỏi "đơn tôi đâu"</td><td>560/ngày</td><td>−60%</td></tr>
      <tr><td>BO-4 giảm chi phí mỗi đơn</td><td>38.000₫</td><td>−12%</td></tr>
    </table>
    <p class="note">Mỗi dòng có nguồn dữ liệu riêng ghi trong tài liệu. Mục tiêu không nói đo ở đâu thì sau này không ai kiểm được.</p>` },

  { t: 'Quy mô: 4.500 đơn/ngày, đỉnh 18.000', body: `
    <p class="lead2">Đỉnh gấp <b>4 lần</b> ngày thường, và nó rơi vào các đợt sale — đúng lúc sai sót tốn nhất.</p>
    <div class="box warn">Con số 18.000 là thứ mọi yêu cầu hiệu năng ở tài liệu 4 phải neo vào. Viết "hệ thống phải nhanh" mà không nhắc con số này là bỏ mất cả bài toán.</div>` },

  { t: 'Vision statement theo mẫu Moore', body: `
    <p class="lead2"><b>Cho</b> Nova Retail Group · <b>những người</b> bán trên bốn kênh và giao từ ba kho · <b>OMFS là</b> hệ quản lý đơn hàng &amp; hoàn tất · <b>giúp</b> giữ MỘT con số tồn kho đúng cho mọi kênh · <b>khác với</b> bốn file tồn kho rời hiện nay · <b>sản phẩm này</b> giữ tồn khi nhận đơn và đồng bộ ngược ra các kênh.</p>
    <p class="note">Ô "khác với" ở đây nói thẳng hiện trạng — và hiện trạng đó là lý lẽ của cả dự án.</p>` },

  { t: 'Trong / Ngoài phạm vi — 8 loại trừ', body: `
    <div class="grid2">
      <div class="box ok"><b>TRONG</b><br/>Nhận đơn nhiều kênh · giữ tồn · định tuyến kho · nhặt &amp; đóng gói · mua vận chuyển · theo dõi giao · trả hàng · đồng bộ tồn kho</div>
      <div class="box warn"><b>NGOÀI</b><br/>Storefront &amp; danh mục · giá &amp; khuyến mãi · thanh toán · kế toán · CRM · mua hàng nhập kho · kho vận nội bộ · BI</div>
    </div>
    <p class="note">Đề nói storefront "xử lý tốt việc khách duyệt hàng" ⇒ đó là câu bảo bạn <b>đừng đặc tả nó</b>.</p>` },

  { t: 'Giả định mà ecosystem map lộ ra', body: `
    <div class="dg">
      <div class="bx ext">Sàn TMĐT</div>
      <div class="ar">◀──▶<small>đồng bộ sẵn có</small></div>
      <div class="bx ext">Storefront</div>
      <div class="ar">──▶</div>
      <div class="oval">OMFS</div>
    </div>
    <p class="lead2">Sàn TMĐT <b>đã</b> đồng bộ danh mục với storefront — sau lưng OMFS. Một thay đổi tồn kho có thể tới khách theo con đường OMFS không kiểm soát.</p>
    <p class="note">Ghi nó vào mục giả định. Context diagram không thấy được mắt xích này.</p>` },

  { t: 'Ba bản phát hành', body: `
    <div class="steps">
      <div><span class="n">1</span><b>R1</b> — nhận đơn, giữ tồn, định tuyến, nhặt &amp; đóng gói, đồng bộ tồn</div>
      <div><span class="n">2</span><b>R2</b> — so giá vận chuyển, bảng xử lý ngoại lệ, trả hàng</div>
      <div><span class="n">3</span><b>R3</b> — trang theo dõi cho khách, báo cáo vận hành</div>
    </div>
    <p class="note">R1 phải đủ để BO-1 (giảm bán vượt tồn) đo được — nếu không thì bản 1 không chứng minh được gì.</p>` },

  { t: 'Sáu rủi ro', body: `
    <table class="t big2">
      <tr><th>RI-1</th><td class="hl">API của hai sàn TMĐT có hạn mức gọi chưa đo được</td></tr>
      <tr><th>RI-3</th><td>Bốn hãng 3PL, mỗi hãng một kiểu tích hợp, hai hãng chưa có tài liệu</td></tr>
      <tr><th>RI-5</th><td>Số tồn kho hiện tại chưa ai biết sai bao nhiêu — không có mốc để so</td></tr>
    </table>
    <p class="lead2">RI-5 nguy hiểm nhất: nếu không đo được <b>3,8% hôm nay</b> thì không chứng minh được <b>0,5% ngày mai</b>.</p>` },

  { t: 'So với TP1 — cùng khuôn, khác bài toán', body: `
    <table class="t">
      <tr><th></th><th>TP1 · CARS</th><th>TP2 · OMFS</th></tr>
      <tr><td>Loại dự án</td><td>Thay thế hệ cũ</td><td class="hl">Xây mới</td></tr>
      <tr><td>Khó nhất</td><td>Ba luật va nhau khi bấm Đăng ký</td><td>MỘT con số tồn kho cho bốn kênh</td></tr>
      <tr><td>Bắt buộc phải có</td><td>Mô hình quy trình HIỆN TẠI</td><td>Ecosystem map</td></tr>
    </table>
    <p class="note">Đọc cả hai bộ là cách nhanh nhất thấy khuôn Wiegers không đổi còn nội dung thì đổi hoàn toàn.</p>` },
];
