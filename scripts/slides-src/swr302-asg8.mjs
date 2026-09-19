export const deck = { key: 'asg8', code: 'A.8', title: 'Tài liệu 6–8', sub: 'SWR302 · Software Requirements · Assignment (20%)' };
export const slides = [
  { kind: 'cover', t: 'Mockup · Ưu tiên · Ước lượng', sub: 'Ba tài liệu cuối — nơi bài làm biến thành quyết định',
    body: `<p class="cov-meta">SWR302 · A.8 · Wiegers ch.15, ch.16, ch.19</p>` },

  { t: 'Mockup để HỎI, không phải để đẹp', body: `
    <p class="lead2">Bản vẽ màn hình trong môn này là công cụ <b>lấy yêu cầu</b>: đưa cho bên liên quan xem để họ nói ra thứ họ quên kể.</p>
    <div class="grid2">
      <div class="box ok"><b>Nên</b><br/>Nét thô, xám trắng · ghi chú số trỏ vào FE-xx · vẽ cả trạng thái lỗi</div>
      <div class="box warn"><b>Không nên</b><br/>Màu mè, font đẹp · dữ liệu giả kiểu "Nguyễn Văn A" · chỉ vẽ màn hình thành công</div>
    </div>
    <p class="note">Mockup càng đẹp, người xem càng bàn về màu sắc thay vì về luật nghiệp vụ. Đó là lý do Wiegers khuyên vẽ thô.</p>` },

  { t: 'Vẽ màn hình nào', body: `
    <div class="steps">
      <div><span class="n">1</span>Màn hình mang <b>luật khó nhất</b> — TP1: đăng ký lớp · TP2: định tuyến kho</div>
      <div><span class="n">2</span>Màn hình <b>dùng nhiều nhất</b></div>
      <div><span class="n">3</span>Màn hình có <b>trạng thái lỗi thú vị</b></div>
      <div><span class="n">4</span>Dừng lại. Ba tới sáu cái là đủ.</div>
    </div>
    <div class="box warn">Vẽ đủ 14 màn hình cho 14 use case là dấu hiệu nhóm đang làm cho có. Không ai đọc hết, và nó không bắt được lỗi nào.</div>` },

  { t: 'Ưu tiên phải có SỐ', body: `
    <p class="lead2">"Quan trọng / Vừa / Ít" là ý kiến. Công thức của Wiegers cho ra một con số xếp hạng được.</p>
    <div class="texbig">\\text{Priority} = \\dfrac{\\text{Value}\\%}{\\text{Cost}\\%\\times w_c + \\text{Risk}\\%\\times w_r}</div>
    <table class="t">
      <tr><th>Tính năng</th><th>Value%</th><th>Cost%</th><th>Risk%</th><th>Điểm</th><th>Hạng</th></tr>
      <tr><td>FE-12</td><td>9,8</td><td>4,1</td><td>3,0</td><td class="hl">1,211</td><td class="hl">1</td></tr>
      <tr><td>FE-4</td><td>11,2</td><td>9,8</td><td>8,1</td><td>0,701</td><td>9</td></tr>
    </table>
    <p class="note">Chú ý FE-4: <b>giá trị cao nhất</b> mà chỉ xếp hạng 9 — vì đắt và rủi ro. Đó là điều cả bảng tồn tại để cho thấy.</p>` },

  { t: 'Phần đáng viết nhất của tài liệu 7', body: `
    <p class="lead2">Không phải cái bảng. Là <b>đoạn văn giải thích chỗ bảng làm bạn bất ngờ</b>.</p>
    <div class="box ok">"FE-4 có giá trị kinh doanh cao nhất (11,2%) nhưng xếp hạng 9 vì chi phí và rủi ro đều nằm trong nhóm cao nhất. Nhóm đề xuất tách FE-4 thành hai phần, đưa phần rẻ vào bản 1."</div>
    <p class="note">Viết được đoạn đó nghĩa là bạn đã <b>dùng</b> phương pháp, không chỉ điền vào bảng.</p>` },

  { t: 'Ước lượng — làm BA cách', body: `
    <table class="t big2">
      <tr><th>Theo tương tự</th><td>So với dự án đã biết, nhân hệ số quy mô</td></tr>
      <tr><th>Theo use case điểm</th><td class="hl">Đếm actor + use case, nhân trọng số kỹ thuật/môi trường</td></tr>
      <tr><th>Theo hoạt động</th><td>Cộng công từng việc BA: phỏng vấn, viết, rà soát, sửa</td></tr>
    </table>
    <p class="lead2">Ba cách ra ba số khác nhau. <b>Đó là kết quả</b>, không phải lỗi.</p>` },

  { t: 'Ba con số lệch nhau nói điều gì', body: `
    <table class="t">
      <tr><th>Phương pháp</th><th>TP1</th><th>TP2</th></tr>
      <tr><td>Tương tự</td><td>2,04 BA</td><td>2,25 BA</td></tr>
      <tr><td>Use case điểm</td><td>1,67 BA</td><td>2,00 BA</td></tr>
      <tr><td>Theo hoạt động</td><td class="hl">1,59 BA</td><td class="hl">1,71 BA</td></tr>
    </table>
    <p class="lead2">Cách <b>chi tiết nhất</b> lại ra số <b>thấp nhất</b> — ngược với trực giác.</p>
    <p class="note">Lý do: ước lượng theo tương tự mang theo cả phần phát sinh của dự án cũ, còn cộng từng việc thì chỉ cộng việc bạn nghĩ ra được. Viết nhận xét này vào bài.</p>` },

  { t: 'Luôn ghi khoảng, đừng ghi một số', body: `
    <div class="box warn"><b>Không đạt:</b> "Dự án cần 1,8 BA."</div>
    <div class="box ok"><b>Đạt:</b> "1,6–2,3 BA (khoảng tin cậy 80%). Ba phương pháp cho 1,59 / 1,67 / 2,04. Nhóm đề xuất 2,0 BA, dư 15% cho vòng rà soát với bên liên quan chưa chốt được lịch."</div>
    <p class="note">Một con số duy nhất là lời hứa. Một khoảng kèm giả định là ước lượng. Môn này chấm cái thứ hai.</p>` },

  { t: 'Trước khi đóng gói', body: `
    <div class="steps">
      <div><span class="n">1</span>Mọi FE trong bảng ưu tiên có mặt trong SRS</div>
      <div><span class="n">2</span>Mọi mockup có ghi chú trỏ về FE-xx</div>
      <div><span class="n">3</span>Ước lượng có ghi rõ <b>đã giả định gì</b></div>
      <div><span class="n">4</span>Ma trận truy vết không còn ô trống</div>
    </div>` },
];
