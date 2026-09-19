export const deck = { key: 'p2d7', code: 'W2.7', title: 'TP2 · Xếp ưu tiên', sub: 'SWR302 · Software Requirements · Bộ tài liệu mẫu' };
export const slides = [
  { kind: 'cover', t: 'Xếp ưu tiên — và vì sao kế hoạch KHÁC thứ hạng', sub: 'Bảng ưu tiên là ĐẦU VÀO, không phải quyết định',
    body: `<p class="cov-meta">SWR302 · W2.7 · Wiegers Ch. 16<br/>13 feature · hạng 1 = FE-10 (1,094) · FE-3 chỉ hạng 6 (0,690)</p>` },

  { t: 'Công thức và bốn chiều', body: `
    <div class="texbig">\\text{Priority} = \\dfrac{\\text{Value}\\%}{\\text{Cost}\\%\\times w_c + \\text{Risk}\\%\\times w_r}</div>
    <p class="lead2"><b>Benefit</b> = được gì nếu có · <b>Penalty</b> = mất gì nếu thiếu. Tách hai thứ này ra là điểm khác biệt của phương pháp Wiegers so với việc chấm "quan trọng/vừa/ít".</p>` },

  { t: 'Trọng số của TP2', body: `
    <table class="t">
      <tr><th>Chiều</th><th>Trọng số</th><th>Biện minh</th></tr>
      <tr><td>Benefit</td><td class="hl">2</td><td>Người tài trợ cấp tiền để chấm dứt bán vượt tồn</td></tr>
      <tr><td>Penalty</td><td>1</td><td></td></tr>
      <tr><td>Cost</td><td>1</td><td></td></tr>
      <tr><td>Risk</td><td>0,5</td><td>RI-1 (hạn mức API) và RI-3 (4 hãng 3PL) đều chưa đo được</td></tr>
    </table>
    <p class="note">Trùng trọng số của TP1 — nhưng đó là <b>trùng hợp có lý do</b>, không phải chép: cả hai dự án đều có một người tài trợ với một mục tiêu rõ và rủi ro tập trung ở tích hợp.</p>` },

  { t: 'Kết quả 13 feature', body: `
    <table class="t">
      <tr><th>Feature</th><th>Value%</th><th>Cost%</th><th>Risk%</th><th>Điểm</th><th>Hạng</th></tr>
      <tr><td>FE-10 đồng bộ tồn</td><td>10,4</td><td>6,2</td><td>5,1</td><td class="hl">1,094</td><td class="hl">1</td></tr>
      <tr><td>FE-1 nhận đơn</td><td>9,1</td><td>6,8</td><td>4,2</td><td>1,020</td><td>2</td></tr>
      <tr><td>FE-3 định tuyến kho</td><td>11,8</td><td>13,1</td><td>10,6</td><td>0,690</td><td>6</td></tr>
    </table>
    <p class="lead2">FE-3 có <b>giá trị cao nhất bảng</b> (11,8%) mà chỉ hạng 6 — vì nó là tính năng đắt nhất và rủi ro nhất.</p>` },

  { t: 'Đó là điều cả bảng tồn tại để cho thấy', body: `
    <p class="lead2">Nếu xếp theo cảm tính, FE-3 chắc chắn hạng 1: nó là "trái tim hệ thống". Bảng nói: trái tim ấy đắt gấp đôi và rủi ro gấp đôi thứ hạng hai.</p>
    <div class="box ok">Phần đáng viết nhất của tài liệu 7 là đoạn văn này — <b>không phải cái bảng</b>. Ai cũng điền được bảng tính; giải thích nó đã đổi kế hoạch ra sao mới cho thấy bạn dùng phương pháp.</div>` },

  { t: 'Kế hoạch phát hành KHÔNG theo thứ hạng', body: `
    <div class="steps">
      <div><span class="n">1</span>FE-3 hạng 6, nhưng <b>FE-10 và FE-1 vô dụng nếu thiếu nó</b> — không định tuyến thì không có gì để đồng bộ</div>
      <div><span class="n">2</span>Có phụ thuộc kỹ thuật mà bảng không biết</div>
      <div><span class="n">3</span>FE-3 vào R1, nhưng ở <b>bản rút gọn</b>: chỉ một kho, chưa tách đơn</div>
      <div><span class="n">4</span>Phần tách đơn (đắt, rủi ro) sang R2</div>
    </div>
    <p class="note">Bảng chấm <b>giá trị</b>, không chấm <b>phụ thuộc</b>. Hai thứ đó phải hợp lại mới thành kế hoạch.</p>` },

  { t: 'Mục bắt buộc — tách riêng, không chấm', body: `
    <div class="box warn">Tuân thủ thuế, lưu vết giao dịch, kiểm soát truy cập theo vai <b>không vào bảng</b>.</div>
    <p class="lead2">Chấm điểm chúng là giả vờ rằng tồn tại phương án không làm. Chúng nằm ở một danh sách riêng, ghi "bắt buộc, không xếp hạng".</p>` },

  { t: 'So với TP1', body: `
    <table class="t">
      <tr><th></th><th>TP1</th><th>TP2</th></tr>
      <tr><td>Hạng 1</td><td>FE-12 (1,211)</td><td>FE-10 (1,094)</td></tr>
      <tr><td>Feature giá trị nhất</td><td class="hl">FE-4 → hạng 9</td><td class="hl">FE-3 → hạng 6</td></tr>
      <tr><td>Cách xử lý</td><td>Bác thứ hạng vì mục tiêu kinh doanh</td><td>Bác thứ hạng vì phụ thuộc kỹ thuật</td></tr>
    </table>
    <p class="note">Hai lý do bác khác nhau, và cả hai đều hợp lệ — miễn là <b>ghi lý do ra</b>.</p>` },

  { t: 'Tự đo tài liệu 7 của bạn', body: `
    <div class="steps">
      <div><span class="n">1</span>Trọng số có lý do viết ra chưa?</div>
      <div><span class="n">2</span>Mục bắt buộc đã tách khỏi bảng chưa?</div>
      <div><span class="n">3</span>Có feature nào giá trị cao mà hạng thấp không — bạn giải thích thế nào?</div>
      <div><span class="n">4</span>Kế hoạch phát hành khác thứ hạng ở đâu, vì lý do gì?</div>
    </div>` },
];
