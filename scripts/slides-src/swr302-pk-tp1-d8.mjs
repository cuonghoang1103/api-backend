export const deck = { key: 'p1d8', code: 'W1.8', title: 'TP1 · Ước lượng', sub: 'SWR302 · Software Requirements · Bộ tài liệu mẫu' };
export const slides = [
  { kind: 'cover', t: 'Ngân sách và số BA — ba cách tính', sub: 'Tài liệu 8 — 2,04 / 1,67 / 1,59 BA',
    body: `<p class="cov-meta">SWR302 · W1.8 · Wiegers Ch. 19<br/>Ba con số gần nhau — và vì sao sự đồng thuận đó chưa đủ</p>` },

  { t: 'Đầu vào lấy từ CHÍNH tài liệu của nhóm', body: `
    <table class="t big2">
      <tr><th>14 use case · 12 actor</th><td>từ tài liệu 2</td></tr>
      <tr><th>109 yêu cầu chức năng</th><td>từ tài liệu 4</td></tr>
      <tr><th>15 thuộc tính chất lượng</th><td>từ tài liệu 4 mục 5</td></tr>
      <tr><th>3 mockup · 8 stakeholder</th><td class="hl">từ tài liệu 6 và tài liệu 1</td></tr>
    </table>
    <p class="note">Ước lượng KHÔNG phải đoán. Nó là phép tính trên thứ bạn đã đếm được — và đó là lý do nó nằm cuối.</p>` },

  { t: 'Ba phương pháp', body: `
    <div class="steps">
      <div><span class="n">A</span><b>Theo tương tự</b> — so với dự án đã biết, nhân hệ số quy mô</div>
      <div><span class="n">B</span><b>Theo use case điểm</b> — đếm actor + use case, nhân trọng số kỹ thuật/môi trường</div>
      <div><span class="n">C</span><b>Theo hoạt động</b> — cộng công từng việc BA: phỏng vấn, viết, rà soát, sửa</div>
    </div>
    <p class="note">Làm cả ba. Một phương pháp cho một con số; ba phương pháp cho biết con số đó <b>đáng tin tới đâu</b>.</p>` },

  { t: 'Kết quả: 2,04 / 1,67 / 1,59 BA', body: `
    <table class="t">
      <tr><th>Phương pháp</th><th>TP1 (CARS)</th><th>TP2 (OMFS)</th></tr>
      <tr><td>A · tương tự</td><td>2,04</td><td>2,25</td></tr>
      <tr><td>B · use case điểm</td><td>1,67</td><td>2,00</td></tr>
      <tr><td>C · theo hoạt động</td><td class="hl">1,59 <small>(1.041 giờ)</small></td><td class="hl">1,71</td></tr>
    </table>
    <p class="lead2">Cách <b>chi tiết nhất</b> lại ra số <b>thấp nhất</b> — ở cả hai đề.</p>` },

  { t: 'Vì sao C thấp nhất — ngược trực giác', body: `
    <p class="lead2">Cộng từng việc chỉ cộng được <b>những việc bạn nghĩ ra</b>. Mô hình hoạt động định giá use case và màn hình rất kỹ, nhưng không có dòng nào cho các cuộc trao đổi đi tới chỗ viết được chúng.</p>
    <div class="box warn">Còn phương pháp A mang theo cả phần phát sinh của dự án cũ — kể cả phần không ai ghi vào bảng nào.</div>
    <p class="note">Viết nhận xét này vào bài. Nó cho thấy bạn <b>hiểu</b> phương pháp, không chỉ chạy phương pháp.</p>` },

  { t: 'Ba số gần nhau: tin được tới đâu?', body: `
    <p class="lead2">Trên TP1 ba con số chỉ lệch nhau <b>0,45 BA</b> — hẹp hơn TP2. Nghe thì yên tâm, nhưng đó là sự đồng thuận <b>có điều kiện</b>.</p>
    <div class="box warn">Cả ba đều giả định dữ liệu tiên quyết của hệ cũ dùng được. Nếu TBD-5 trả lời "sai 12%" thì cả ba con số cùng sai theo cùng một hướng.</div>
    <p class="note">Ba phương pháp đồng ý <b>không</b> có nghĩa là đúng — nếu chúng chia chung một giả định.</p>` },

  { t: 'Luôn ghi KHOẢNG, đừng ghi một số', body: `
    <div class="box warn"><b>Không đạt:</b> "Dự án cần 1,8 BA."</div>
    <div class="box ok"><b>Đạt:</b> "1,6–2,3 BA (khoảng tin cậy 80%). Ba phương pháp cho 1,59 / 1,67 / 2,04. Nhóm cam kết <b>2,0 BA</b>."</div>
    <p class="lead2">Một con số duy nhất là một lời hứa. Một khoảng kèm giả định là một ước lượng.</p>` },

  { t: 'Biện minh cho BA thứ hai: dùng RỦI RO, đừng dùng 15%', body: `
    <p class="lead2">Bản nháp đầu lấy "dư 15%" của phương pháp A để làm tròn lên 2 BA. Nhưng phần dư ấy là <b>hệ quả của đơn giá USD</b> — nếu trường thuê BA theo giá địa phương, nó biến mất.</p>
    <div class="box ok">Biện minh trung thực là <b>RI-2</b> (quy chế đang sửa) và <b>TBD-5</b> (dữ liệu cũ chưa đo). Đó là lý do đứng vững bất kể đơn giá.</div>
    <p class="note">Đừng để một giả định về đơn giá gánh lập luận thay bạn.</p>` },

  { t: 'Điều gì sẽ khiến đổi ý', body: `
    <table class="t big2">
      <tr><th>TBD-5 trả lời "sai &gt; 10%"</th><td class="hl">+0,4 BA cho việc đối soát dữ liệu</td></tr>
      <tr><th>Quy chế mới chốt sớm</th><td>−0,2 BA, bỏ được vòng viết lại</td></tr>
      <tr><th>Không có môi trường thử tải</th><td>+0,3 BA cho việc dựng kịch bản đo</td></tr>
    </table>
    <p class="lead2">Ghi sẵn ngưỡng đổi ý là thứ phân biệt một ước lượng với một con số. Thầy hỏi "tin được không" thì đây là câu trả lời.</p>` },
];
