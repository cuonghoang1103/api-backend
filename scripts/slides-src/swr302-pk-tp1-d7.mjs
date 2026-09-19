export const deck = { key: 'p1d7', code: 'W1.7', title: 'TP1 · Xếp ưu tiên', sub: 'SWR302 · Software Requirements · Bộ tài liệu mẫu' };
export const slides = [
  { kind: 'cover', t: 'Xếp ưu tiên — và vì sao thứ hạng bị BÁC', sub: 'Bảng ưu tiên là ĐẦU VÀO, không phải quyết định',
    body: `<p class="cov-meta">SWR302 · W1.7 · Wiegers Ch. 16<br/>13 feature · ba cái GIÁ TRỊ NHẤT xếp hạng 9, 12, 13</p>` },

  { t: 'Công thức Chapter 16', body: `
    <div class="texbig">\\text{Priority} = \\dfrac{\\text{Value}\\%}{\\text{Cost}\\%\\times w_c + \\text{Risk}\\%\\times w_r}</div>
    <p class="lead2">Value gộp từ <b>Benefit</b> (được gì nếu có) và <b>Penalty</b> (mất gì nếu thiếu). Hai thứ đó khác nhau — một tính năng có thể lợi ít mà thiếu nó thì chết.</p>` },

  { t: 'Trọng số phải có BIỆN MINH', body: `
    <table class="t">
      <tr><th>Chiều</th><th>Trọng số</th><th>Vì sao</th></tr>
      <tr><td>Benefit</td><td class="hl">2</td><td>Phó hiệu trưởng cấp tiền để chấm dứt đăng ký thất bại</td></tr>
      <tr><td>Penalty</td><td>1</td><td></td></tr>
      <tr><td>Cost</td><td>1</td><td></td></tr>
      <tr><td>Risk</td><td>0,5</td><td>Nâng lên từ 0 sau khi RI-1 và RI-2 được xác nhận</td></tr>
    </table>
    <p class="note">Đặt trọng số rủi ro <b>bằng</b> chi phí sẽ đẩy FE-5 và FE-9 xuống đáy — và đó là hai tính năng gánh RI-1, RI-2. Con số trọng số quyết định kết quả, nên phải viết lý do ra.</p>` },

  { t: 'Mục BẮT BUỘC tách riêng, không chấm', body: `
    <div class="box warn">Yêu cầu pháp lý, bảo mật, tuân thủ <b>không vào bảng</b>. Chấm điểm chúng là giả vờ rằng có phương án không làm.</div>
    <p class="lead2">Trên TP1: quy định lưu trữ hồ sơ học vụ và kiểm soát truy cập theo FERPA nằm ở danh sách riêng, ghi rõ "bắt buộc, không xếp hạng".</p>
    <p class="note">Nhóm nào chấm cả những mục này thường ra bảng đẹp mà vô nghĩa.</p>` },

  { t: 'Kết quả: FE-12 hạng 1', body: `
    <table class="t">
      <tr><th>Feature</th><th>Value%</th><th>Cost%</th><th>Risk%</th><th>Điểm</th><th>Hạng</th></tr>
      <tr><td>FE-12</td><td>9,8</td><td>4,1</td><td>3,0</td><td class="hl">1,211</td><td class="hl">1</td></tr>
      <tr><td>FE-4</td><td>11,2</td><td>9,8</td><td>8,1</td><td>0,701</td><td>9</td></tr>
      <tr><td>FE-5</td><td>10,6</td><td>11,9</td><td>12,4</td><td>0,576</td><td>12</td></tr>
      <tr><td>FE-9</td><td>10,1</td><td>12,3</td><td>13,0</td><td>0,536</td><td>13</td></tr>
    </table>
    <p class="note">Ba tính năng có <b>giá trị cao nhất bảng</b> xếp hạng 9, 12, 13.</p>` },

  { t: 'Đó là KẾT QUẢ, không phải lỗi', body: `
    <p class="lead2">FE-4, FE-5, FE-9 đắt và rủi ro vì cả ba đụng vào dữ liệu tiên quyết bẩn của hệ cũ (RI-1). Bảng nói đúng một điều: <b>làm ngay ba cái đó là nhận toàn bộ rủi ro vào bản 1</b>.</p>
    <div class="box ok">Phần đáng viết nhất của tài liệu 7 không phải cái bảng — là đoạn văn giải thích chỗ bảng làm nhóm bất ngờ.</div>` },

  { t: 'Vì sao thứ hạng bị BÁC', body: `
    <div class="steps">
      <div><span class="n">1</span>FE-5 hạng 12, nhưng BO-1 (chịu tải đỉnh) <b>không đạt được nếu thiếu nó</b></div>
      <div><span class="n">2</span>Mục tiêu kinh doanh thắng điểm số — bảng không biết về BO-1</div>
      <div><span class="n">3</span>Nhóm đưa FE-5 vào R1, và <b>ghi lý do ngay trong tài liệu</b></div>
      <div><span class="n">4</span>FE-9 tách đôi: phần rẻ vào R1, phần đụng dữ liệu bẩn sang R2</div>
    </div>
    <p class="note">Bác thứ hạng là hợp lệ. Bác mà <b>không ghi lý do</b> mới là lỗi.</p>` },

  { t: 'Tách tính năng là nước đi hay bị bỏ quên', body: `
    <p class="lead2">Một tính năng đắt hiếm khi là một khối không chia được. FE-9 tách thành phần hiển thị (rẻ, giá trị ngay) và phần đối soát dữ liệu cũ (đắt, rủi ro).</p>
    <div class="box ok">Sau khi tách, bảng ưu tiên chạy lại: FE-9a lên hạng 4, FE-9b xuống hạng 15 và sang R2. Cùng một giá trị, rủi ro rời sang sau.</div>` },

  { t: 'Tự đo tài liệu 7 của bạn', body: `
    <div class="steps">
      <div><span class="n">1</span>Trọng số có <b>lý do viết ra</b> chưa, hay chỉ là 1-1-1-1?</div>
      <div><span class="n">2</span>Mục bắt buộc đã tách khỏi bảng chưa?</div>
      <div><span class="n">3</span>Có đoạn văn nói chỗ bảng làm bạn bất ngờ chưa?</div>
      <div><span class="n">4</span>Kế hoạch phát hành khác thứ hạng ở chỗ nào, và vì sao?</div>
    </div>` },
];
