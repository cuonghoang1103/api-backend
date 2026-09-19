export const deck = { key: 'p2d8', code: 'W2.8', title: 'TP2 · Ước lượng', sub: 'SWR302 · Software Requirements · Bộ tài liệu mẫu' };
export const slides = [
  { kind: 'cover', t: 'Ngân sách và số BA — ba cách tính', sub: 'Tài liệu 8 — 2,25 / 2,00 / 1,71 BA',
    body: `<p class="cov-meta">SWR302 · W2.8 · Wiegers Ch. 19<br/>Cam kết 2 BA · và điều gì sẽ khiến đổi ý</p>` },

  { t: 'Đầu vào lấy từ CHÍNH tài liệu của nhóm', body: `
    <table class="t big2">
      <tr><th>14 use case · 12 actor</th><td>tài liệu 2</td></tr>
      <tr><th>101 yêu cầu · 18 chất lượng</th><td>tài liệu 4</td></tr>
      <tr><th>110 mục từ điển</th><td>tài liệu 5</td></tr>
      <tr><th>5 mockup · 6 stakeholder · 10 giao tiếp</th><td class="hl">tài liệu 6, 1 và 4</td></tr>
    </table>
    <p class="note">Ước lượng là phép tính trên thứ bạn đã đếm được. Đó là lý do nó nằm cuối — và lý do không thể làm nó trước.</p>` },

  { t: 'Kết quả: 2,25 / 2,00 / 1,71 BA', body: `
    <table class="t">
      <tr><th>Phương pháp</th><th>TP2</th><th>TP1</th><th>Chênh</th></tr>
      <tr><td>A · tương tự</td><td>2,25</td><td>2,04</td><td>+10%</td></tr>
      <tr><td>B · use case điểm</td><td>2,00</td><td>1,67</td><td>+20%</td></tr>
      <tr><td>C · theo hoạt động</td><td class="hl">1,71 <small>(1.097 giờ)</small></td><td>1,59</td><td>+8%</td></tr>
    </table>
    <p class="lead2">TP2 tốn công hơn TP1 ở cả ba phương pháp — hợp lý, vì nó có <b>10 giao tiếp ngoài</b> thay vì 8, và 110 mục từ điển thay vì 91.</p>` },

  { t: 'Vì sao C thấp nhất — ngược trực giác', body: `
    <p class="lead2">Mô hình hoạt động định giá use case và màn hình rất kỹ, nhưng <b>không có dòng nào</b> cho các cuộc trao đổi đi tới chỗ viết được chúng.</p>
    <div class="box warn">Cộng từng việc chỉ cộng được những việc bạn nghĩ ra. Phương pháp A thì mang theo cả phần phát sinh của dự án cũ — kể cả phần không ai từng ghi vào bảng nào.</div>
    <p class="note">Bản A.9 trên web ban đầu ghi nhầm C là cao nhất — <b>đã vá</b>. Nếu bạn thấy tài liệu nào nói ngược, đây là số đúng.</p>` },

  { t: 'Khoảng rộng hơn TP1 — và đó là tín hiệu', body: `
    <p class="lead2">TP2 lệch <b>0,54 BA</b> giữa cao nhất và thấp nhất; TP1 chỉ <b>0,45</b>. Khoảng rộng hơn nghĩa là ba phương pháp bất đồng nhiều hơn.</p>
    <div class="box warn">Nguồn bất đồng: bốn hãng 3PL. Phương pháp B đếm chúng là <b>một</b> actor tích hợp; phương pháp C cộng công cho <b>từng</b> hãng. Hai cách hiểu, hai con số.</div>
    <p class="note">Chỉ ra được nguồn bất đồng quan trọng hơn là làm cho nó biến mất.</p>` },

  { t: 'Ghi KHOẢNG, cam kết MỘT số', body: `
    <div class="box ok"><b>1,7–2,4 BA</b> (khoảng tin cậy 80%). Ba phương pháp cho 1,71 / 2,00 / 2,25. Nhóm cam kết <b>2,0 BA</b>, và nêu rõ ba giả định đứng sau con số đó.</div>
    <p class="lead2">Một con số duy nhất là lời hứa. Một khoảng kèm giả định là ước lượng. Môn này chấm cái thứ hai — nhưng vẫn đòi bạn <b>chọn một số để cam kết</b>.</p>` },

  { t: 'Ba giả định đứng sau con số', body: `
    <div class="steps">
      <div><span class="n">1</span>Hai hãng 3PL chưa có tài liệu sẽ cung cấp trong 3 tuần (RI-3)</div>
      <div><span class="n">2</span>Hạn mức API của sàn đủ cho 18.000 đơn ngày đỉnh (RI-1)</div>
      <div><span class="n">3</span>Không phát sinh kênh bán thứ năm trong kỳ dự án</div>
    </div>
    <p class="note">Viết giả định ra là cách duy nhất để sau này nói được "con số sai vì giả định 2 không đúng" thay vì "nhóm ước lượng kém".</p>` },

  { t: 'Điều gì sẽ khiến đổi ý', body: `
    <table class="t big2">
      <tr><th>3PL không giao tài liệu đúng hạn</th><td class="hl">+0,5 BA cho việc dò ngược giao thức</td></tr>
      <tr><th>TBD-2 trả lời "được huỷ sau đóng gói"</th><td>+0,3 BA — thêm cả một họ luật hoàn hàng</td></tr>
      <tr><th>Rút xuống 2 hãng 3PL</th><td>−0,4 BA</td></tr>
    </table>
    <p class="lead2">Ghi sẵn ngưỡng đổi ý biến ước lượng thành công cụ quản lý, không còn là một con số trong bảng.</p>` },

  { t: 'Tự đo tài liệu 8 của bạn', body: `
    <div class="steps">
      <div><span class="n">1</span>Đã làm đủ <b>ba</b> phương pháp chưa?</div>
      <div><span class="n">2</span>Ba số khác nhau — bạn có giải thích được <b>vì sao</b> không?</div>
      <div><span class="n">3</span>Có ghi khoảng, và có chọn một số để cam kết chưa?</div>
      <div><span class="n">4</span>Có liệt kê giả định và ngưỡng đổi ý chưa?</div>
    </div>` },
];
