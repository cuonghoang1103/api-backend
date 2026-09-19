export const deck = { key: 'p2d5', code: 'W2.5', title: 'TP2 · Data dictionary', sub: 'SWR302 · Software Requirements · Bộ tài liệu mẫu' };
export const slides = [
  { kind: 'cover', t: 'Data dictionary — 110 mục', sub: 'Tài liệu 5 — nhiều hơn TP1 19 mục, và có lý do',
    body: `<p class="cov-meta">SWR302 · W2.5 · Wiegers Ch. 13<br/>Cột Values TRỎ business rule, không chép lại</p>` },

  { t: 'Vì sao TP2 cần nhiều mục hơn TP1', body: `
    <p class="lead2">110 so với 91. Chênh lệch nằm ở <b>tích hợp</b>: bốn hãng 3PL và hai sàn TMĐT, mỗi bên một bộ mã trạng thái riêng phải ánh xạ về một bộ chung.</p>
    <div class="box warn">Mỗi hệ thống ngoài bạn nối vào đều kéo theo một nhóm mục từ điển. Đếm hệ thống ngoài trước, rồi mới ước lượng số mục.</div>` },

  { t: 'Mục quan trọng nhất: Sellable Quantity', body: `
    <table class="t big2">
      <tr><th>Tên</th><td>Sellable Quantity</td></tr>
      <tr><th>Định nghĩa</th><td class="hl">= On Hand Quantity − Reserved Quantity − Damaged Quantity</td></tr>
      <tr><th>Kiểu</th><td>Số nguyên ≥ 0</td></tr>
      <tr><th>Values</th><td>xem BR-02</td></tr>
    </table>
    <p class="lead2">Một <b>công thức</b>, không phải một câu mô tả. Và ba thành phần trong đó đều phải có mục riêng.</p>` },

  { t: 'Cột Values TRỎ, không CHÉP', body: `
    <div class="grid2">
      <div class="box warn"><b>Sai</b><br/>Values: "0–3, vì một đơn không được tách quá 3 lô"</div>
      <div class="box ok"><b>Đúng</b><br/>Values: "0–3 (BR-06)"</div>
    </div>
    <p class="lead2">Chép lại luật nghĩa là khi luật đổi, bạn phải nhớ sửa hai chỗ — và lần thứ hai sẽ quên.</p>` },

  { t: 'Ký pháp — ví dụ thật', body: `
    <table class="t big2">
      <tr><th>Order</th><td>= Order ID + Channel + Customer Ref + { Order Line }1:200 + Shipping Address</td></tr>
      <tr><th>Shipping Address</th><td class="hl">= Recipient + Street + Ward + District + City + (Postal Code) + Country</td></tr>
      <tr><th>Carrier Status</th><td>= [ created | picked_up | in_transit | delivered | exception ]</td></tr>
    </table>
    <p class="note">min:max ở ngoài dấu { } là chỗ hay viết sai. <code>1:200</code> nói mỗi đơn có 1 đến 200 dòng — một ràng buộc thật, lấy từ dữ liệu vận hành.</p>` },

  { t: 'District — lỗi bộ kiểm chéo bắt được', body: `
    <p class="lead2">Shipping Address nhắc <b>District</b>, nhưng District <b>không có mục riêng</b> trong bản nháp. Không ai đọc ra — script đối chiếu chéo tìm thấy.</p>
    <div class="box warn">Hậu quả nếu bỏ sót: không ai định nghĩa District là bắt buộc hay tuỳ chọn, mà ở Việt Nam nó bắt buộc còn ở nhiều nước thì không tồn tại. Luật định tuyến kho dùng nó.</div>
    <p class="note">Đây là một trong ba lỗi thật mà <code>check.py</code> bắt được. Mắt đọc không ra.</p>` },

  { t: 'Ánh xạ trạng thái của bốn hãng 3PL', body: `
    <table class="t">
      <tr><th>Hãng</th><th>Mã của họ</th><th>Carrier Status chung</th></tr>
      <tr><td>A</td><td>PICKED</td><td rowspan="2" class="hl">picked_up</td></tr>
      <tr><td>B</td><td>COLLECTED</td></tr>
      <tr><td>C</td><td>OUT_FOR_DELIVERY</td><td>in_transit</td></tr>
      <tr><td>D</td><td>EXCEPTION_3</td><td>exception</td></tr>
    </table>
    <p class="lead2">Bảng ánh xạ này thuộc về <b>từ điển</b>, không phải về mã nguồn. Nó là tri thức nghiệp vụ, và nó đổi khi đổi hãng.</p>` },

  { t: 'Mục sinh ra từ CÂU HỎI, không từ đề', body: `
    <div class="grid3">
      <div class="card"><b>Hold Expiry</b>BR-11 cần biết khi nào hết hạn giữ</div>
      <div class="card"><b>Exception Code</b>bảng ngoại lệ cần lọc theo loại</div>
      <div class="card"><b>Split Group ID</b>nối các lô của cùng một đơn</div>
    </div>
    <p class="note">Ba mục này không có trong đề. Chúng ra từ việc viết use case và mockup — bằng chứng bạn đã làm thật, không chép.</p>` },

  { t: 'Tự đo từ điển của bạn', body: `
    <table class="t big2">
      <tr><th>Đếm hệ thống ngoài</th><td>mỗi cái kéo theo một nhóm mục — có đủ chưa?</td></tr>
      <tr><th>Mọi phần tử con</th><td class="hl">có mục riêng chưa? kiểm bằng script</td></tr>
      <tr><th>Values</th><td>TRỎ về BR-xx, không chép lại luật</td></tr>
      <tr><th>Computation</th><td>có CÔNG THỨC, không phải lời mô tả</td></tr>
    </table>` },
];
