export const deck = { key: 'p2d3', code: 'W2.3', title: 'TP2 · Business Rules', sub: 'SWR302 · Software Requirements · Bộ tài liệu mẫu' };
export const slides = [
  { kind: 'cover', t: '20 business rule của OMFS', sub: 'Tài liệu 3 — đủ năm loại, có bảng rule CỐ Ý không cài',
    body: `<p class="cov-meta">SWR302 · W2.3 · Wiegers Ch. 9<br/>Ghi nguồn từng rule · ma trận rule → use case → requirement</p>` },

  { t: 'Năm loại, ví dụ từ OMFS', body: `
    <table class="t big2">
      <tr><th>Fact</th><td>Mỗi lô giao thuộc đúng một kho</td></tr>
      <tr><th>Constraint</th><td>BR-06: không tách một đơn quá 3 lô</td></tr>
      <tr><th>Action enabler</th><td class="hl">BR-11: hết cửa sổ giữ tồn ⇒ nhả tồn và báo khách</td></tr>
      <tr><th>Inference</th><td>BR-14: đơn quá 48h chưa giao ⇒ đơn có vấn đề ⇒ vào bảng ngoại lệ</td></tr>
      <tr><th>Computation</th><td class="hl">BR-02: sellable = on hand − reserved − damaged</td></tr>
    </table>` },

  { t: 'BR-02 là luật QUAN TRỌNG NHẤT cả đề', body: `
    <table class="t">
      <tr><th>On hand</th><th>− Reserved</th><th>− Damaged</th><th>= Sellable</th></tr>
      <tr><td>120</td><td>18</td><td>4</td><td class="hl">98</td></tr>
    </table>
    <p class="lead2">Một luật loại <b>computation</b> ⇒ mục từ điển của nó phải có <b>công thức</b>, không phải lời mô tả. Sai chỗ này là cả tám tài liệu sai theo.</p>` },

  { t: 'BR-11 — ba điều kiện, tám cột', body: `
    <table class="t">
      <tr><th>#</th><th>Đã thanh toán</th><th>Còn hàng</th><th>Hết hạn giữ</th><th>Hành động</th></tr>
      <tr><td>1</td><td>Có</td><td>Có</td><td>Không</td><td>Giữ tiếp</td></tr>
      <tr><td class="hl">4</td><td class="hl">Có</td><td class="hl">Không</td><td class="hl">Không</td><td class="hl">?</td></tr>
      <tr><td>8</td><td>Không</td><td>Không</td><td>Có</td><td>Huỷ, báo khách</td></tr>
    </table>
    <p class="lead2">Cột 4 là trường hợp <b>không ai nghĩ tới</b>: đã thu tiền, hàng biến mất, chưa hết hạn giữ. Hoàn tiền hay bắt khách chờ?</p>` },

  { t: 'Ô "?" là câu trả lời ĐÚNG', body: `
    <div class="box ok">Bộ tài liệu mẫu <b>không trả lời</b> cột 4. Nó ghi câu hỏi, ghi ai phải trả lời (Giám đốc TMĐT), và ghi hạn.</div>
    <p class="lead2">Bịa ra câu trả lời rồi viết chắc nịch mới là lỗi — vì nó <b>giấu mất một quyết định chưa ai làm</b>.</p>
    <p class="note">Một bộ tài liệu không có chỗ "?" nào là bộ tài liệu đã đoán ở đâu đó.</p>` },

  { t: 'Rule CỐ Ý không đưa vào phần mềm', body: `
    <table class="t big2">
      <tr><th>BR-19</th><td>Quản lý kho được ưu tiên đơn VIP bằng tay</td></tr>
      <tr><th>BR-20</th><td>CSKH được hứa giao bù không tính phí, trong hạn mức</td></tr>
      <tr><th>Vì sao để ngoài</th><td class="hl">Đó là quyền quyết định của con người. Hệ thống chỉ cần GHI LẠI, không cần tự làm.</td></tr>
    </table>
    <p class="lead2">Ghi rõ rule nào không cài — nếu không, người đọc sau tưởng bạn quên, và sẽ có người viết yêu cầu cho nó.</p>` },

  { t: 'Rule đến từ đâu — ba nguồn', body: `
    <div class="grid3">
      <div class="card"><b>Phỏng vấn</b>thứ người ta NHỚ</div>
      <div class="card"><b>Tài liệu</b>thứ người ta PHẢI tuân theo</div>
      <div class="card"><b>Quan sát</b>thứ người ta THỰC SỰ làm</div>
    </div>
    <p class="lead2">Trên TP2, nguồn thứ ba cho ra BR-19: không ai kể chuyện ưu tiên đơn VIP bằng tay, nhưng nhìn màn hình kho thì thấy.</p>` },

  { t: 'Ma trận truy vết', body: `
    <table class="t">
      <tr><th>BR</th><th>Use case</th><th>Requirement</th></tr>
      <tr><td>BR-02</td><td>UC-02, UC-12</td><td>FE-05…FE-09</td></tr>
      <tr><td class="hl">BR-06</td><td class="hl">UC-04</td><td class="hl">FE-27, FE-28</td></tr>
      <tr><td>BR-11</td><td>UC-02</td><td>FE-19…FE-23</td></tr>
      <tr><td>BR-19</td><td>—</td><td>— <small>(cố ý)</small></td></tr>
    </table>
    <p class="note">Dòng cuối có gạch ngang <b>cố ý</b>, kèm ghi chú. Ô trống không giải thích thì người chấm đọc thành thiếu sót.</p>` },

  { t: 'Tự đo tài liệu 3 của bạn', body: `
    <div class="steps">
      <div><span class="n">1</span>Đủ năm loại chưa?</div>
      <div><span class="n">2</span>Rule nào là computation thì có công thức trong từ điển chưa?</div>
      <div><span class="n">3</span>Rule nhiều điều kiện đã viết thành bảng 2ⁿ cột chưa?</div>
      <div><span class="n">4</span>Có bảng rule CỐ Ý không cài, kèm lý do chưa?</div>
    </div>` },
];
