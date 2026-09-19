export const deck = { key: 'asg9', code: 'A.9', title: 'Bài mẫu hoàn chỉnh', sub: 'SWR302 · Software Requirements · Assignment (20%)' };
export const slides = [
  { kind: 'cover', t: 'Bài mẫu — đích đến trông thế nào', sub: 'Hai bộ tài liệu đầy đủ cho TP1 và TP2, có thật trong khoá này',
    body: `<p class="cov-meta">SWR302 · A.9 · 16 tài liệu · 28 use case · 40 business rule</p>` },

  { t: 'Có gì trong bộ mẫu', body: `
    <table class="t">
      <tr><th></th><th>TP1 — CARS</th><th>TP2 — OMFS</th></tr>
      <tr><td>Use case</td><td>14</td><td>14</td></tr>
      <tr><td>Business rule</td><td>20</td><td>20</td></tr>
      <tr><td>Yêu cầu chức năng</td><td class="hl">109</td><td class="hl">101</td></tr>
      <tr><td>Yêu cầu chất lượng</td><td>15</td><td>18</td></tr>
      <tr><td>Mục từ điển</td><td>91</td><td>110</td></tr>
      <tr><td>Mockup</td><td>3</td><td>5</td></tr>
    </table>
    <p class="note">Hai mục "Bộ tài liệu mẫu" trong khoá này chứa toàn bộ, chia theo tám tài liệu.</p>` },

  { t: 'Dùng bộ mẫu thế nào cho ĐÚNG', body: `
    <div class="grid2">
      <div class="box ok"><b>Nên</b><br/>Đọc để biết độ sâu cần đạt · mượn cấu trúc và cách trình bày · đối chiếu sau khi tự làm xong</div>
      <div class="box warn"><b>Không nên</b><br/>Chép nguyên · đổi tên biến rồi nộp · đọc trước khi tự thử</div>
    </div>
    <p class="lead2">Thầy gọi kiểm tra <b>bất chợt</b> và hỏi "cái này ở đâu ra". Bài chép không sống sót qua câu đó.</p>` },

  { t: 'Lát cắt dọc — theo một yêu cầu đi hết tám tài liệu', body: `
    <div class="dg">
      <div class="bx">Đề: 2.300 đơn/kỳ, chờ 6 ngày</div>
      <div class="ar">──▶</div>
      <div class="bx">Mục tiêu: &lt;48h cho 90%</div>
      <div class="ar">──▶</div>
      <div class="bx st">UC-06</div>
      <div class="ar">──▶</div>
      <div class="bx">FE-41…FE-47</div>
    </div>
    <p class="lead2">Đây là thứ bạn phải trình bày được trong 30 giây khi bị gọi.</p>
    <p class="note">Tiếp tục: FE-44 ↔ BR-14 (SLA 48h) ↔ mục từ điển <b>escalation deadline</b> ↔ mockup 3 ↔ hạng 1 bảng ưu tiên ↔ 0,4 BA trong ước lượng.</p>` },

  { t: 'Chỗ bộ mẫu CỐ Ý để hở', body: `
    <p class="lead2">Cả hai bộ đều có các mục ghi <b>"?"</b> và "cần xác nhận với người tài trợ".</p>
    <div class="box ok">Ví dụ TP2: một đơn đã đóng gói còn huỷ được không? Bộ mẫu <b>không trả lời</b> — nó ghi câu hỏi và ghi ai phải trả lời.</div>
    <p class="note">Đó là cách viết đúng. Bịa ra câu trả lời rồi viết chắc nịch mới là lỗi — vì nó giấu mất một quyết định chưa ai làm.</p>` },

  { t: 'Bộ kiểm chéo tự động', body: `
    <p class="lead2">Bộ mẫu đi kèm một script chạy <b>tám phép kiểm</b> trên cả tám tài liệu:</p>
    <table class="t big2">
      <tr><th>1</th><td>Mọi actor trong use case có trong danh sách bên liên quan</td></tr>
      <tr><th>2</th><td>Mọi trường trong mockup có trong từ điển dữ liệu</td></tr>
      <tr><th>3</th><td class="hl">Mọi BR có ít nhất một FE cài đặt nó</td></tr>
      <tr><th>4</th><td>Mọi FE truy về được một UC hoặc BR</td></tr>
      <tr><th>5–8</th><td>Mã trùng · mã thủng lỗ · tên lệch · thứ ngoài phạm vi bị đặc tả</td></tr>
    </table>` },

  { t: 'Nó bắt được ba lỗi thật', body: `
    <div class="steps">
      <div><span class="n">1</span>Thiếu mục <b>District</b> trong từ điển — có trong mockup địa chỉ giao</div>
      <div><span class="n">2</span>Thiếu mục <b>Justification</b> — có trong UC-06, không ai định nghĩa độ dài</div>
      <div><span class="n">3</span><b>ERP</b> nằm trong danh sách actor nhưng không tham gia use case nào</div>
    </div>
    <div class="box warn">Ba lỗi này <b>đọc bằng mắt không ra</b>. Nhóm nào viết được một script tương tự thì nên đưa nó vào slide tuần 9 — nó chứng minh cách làm, không chỉ kết quả.</div>` },

  { t: 'Tự đo bài của mình', body: `
    <table class="t big2">
      <tr><th>Use case &lt; 10</th><td>Đang gộp — tách ra</td></tr>
      <tr><th>FE &lt; 60</th><td class="hl">Chưa đủ sâu — mỗi UC thường sinh 6–9 FE</td></tr>
      <tr><th>BR &lt; 12</th><td>Chưa tách luật ra khỏi yêu cầu</td></tr>
      <tr><th>Từ điển &lt; 40</th><td>Chưa soi mockup và use case đủ kỹ</td></tr>
      <tr><th>Không có mục "?"</th><td>Đang bịa câu trả lời cho thứ chưa ai quyết</td></tr>
    </table>` },

  { t: 'Đọc theo thứ tự này', body: `
    <div class="steps">
      <div><span class="n">1</span>Tuần 2: đọc tài liệu 1 của bộ mẫu <b>đề bạn không chọn</b> — để học khuôn mà không bị chép</div>
      <div><span class="n">2</span>Tự làm tài liệu 1 của đề mình</div>
      <div><span class="n">3</span>Rồi mới mở bộ mẫu đề mình ra đối chiếu</div>
      <div><span class="n">4</span>Lặp lại với từng tài liệu</div>
    </div>
    <p class="note">Thứ tự này giữ được ích lợi của bộ mẫu mà không mất phần học.</p>` },
];
