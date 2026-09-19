export const deck = { key: 'labL5', code: 'LAB 5', title: 'DFD & ERD', sub: 'SWR302 · Software Requirements · LAB (10%)' };
export const slides = [
  { kind: 'cover', t: 'DFD & ERD', sub: 'Dữ liệu chảy đi đâu — và có những thứ gì',
    body: `<p class="cov-meta">SWR302 · LAB 5 · Wiegers Ch. 12–13<br/>Bài luyện: <b>TP2</b> (DFD) và <b>TP1</b> (ERD)</p>` },

  { t: 'DFD trả lời câu hỏi không mô hình nào khác trả lời', body: `
    <p class="lead2" style="text-align:center;font-size:28px">Mỗi mẩu dữ liệu <b>bắt nguồn từ đâu</b>, cái gì <b>biến đổi</b> nó, và giữa hai lần biến đổi nó <b>nằm ở đâu</b>?</p>
    <div class="box warn">DFD <b>không</b> thể hiện trình tự, <b>không</b> thể hiện actor làm từng bước. Đó là việc của swimlane — lẫn hai thứ là lỗi phổ biến nhất của LAB này.</div>` },

  { t: 'Bốn ký hiệu', body: `
    <div class="dg">
      <div class="bx ext">Kênh bán</div><div class="ar">▶<small>dữ liệu đơn</small></div>
      <div class="oval">Kiểm hợp lệ</div><div class="ar">▶<small>đơn hợp lệ</small></div>
      <div class="store">D1 Đơn hàng</div>
    </div>
    <table class="t">
      <tr><td>Hình tròn</td><td><b>Tiến trình</b> — biến đổi dữ liệu</td><td>Cụm động từ</td></tr>
      <tr><td>Hộp hở hai đầu</td><td><b>Kho dữ liệu</b> — dữ liệu nằm yên</td><td>Danh từ</td></tr>
      <tr><td>Hình vuông</td><td><b>Thực thể ngoài</b> — nguồn / đích</td><td>Danh từ</td></tr>
      <tr><td>Mũi tên có nhãn</td><td><b>Luồng dữ liệu</b></td><td class="hl">Chính dữ liệu, không phải “gửi”</td></tr>
    </table>` },

  { t: 'Hai lỗi mà người chấm nào cũng soi', body: `
    <div class="two">
      <div class="box warn"><b>Hố đen</b><br/>Tiến trình có ĐẦU VÀO mà không có đầu ra.<br/><span class="note">Hoặc bạn quên một luồng, hoặc tiến trình đó chẳng làm gì.</span></div>
      <div class="box warn"><b>Phép màu</b><br/>Có ĐẦU RA mà không có đầu vào — hoặc đầu ra chứa dữ liệu đầu vào chưa từng mang tới.<br/><span class="note">Dữ liệu dư đó ở đâu ra?</span></div>
    </div>
    <p class="lead2">Hai lỗi này được kiểm một cách <b>máy móc</b>. Để mất điểm vì chúng là mất không.</p>` },

  { t: 'Luật cân bằng giữa các mức', body: `
    <div class="steps">
      <div><span class="n">0</span>DFD mức 0 có MỘT tiến trình — cả hệ thống. Trùng với context diagram.</div>
      <div><span class="n">1</span>DFD mức 1 nổ tung tiến trình đó thành nhiều cái.</div>
      <div><span class="n">✓</span><b>Mọi luồng cắt ranh giới ở mức 0 phải xuất hiện ở mức 1 — và không được sinh thêm luồng ranh giới mới.</b></div>
    </div>
    <p class="note">Thêm một luồng ở mức 1 mà context diagram không có ⇒ một trong hai sơ đồ sai.</p>` },

  { t: 'Bài luyện TP2 · DFD mức 1', body: `
    <div class="dg">
      <div class="bx ext">Kênh bán</div><div class="ar">▶<small>dữ liệu đơn</small></div>
      <div class="oval">1. Sàng lọc</div><div class="ar">▶<small>đơn hợp lệ</small></div>
      <div class="oval">2. Giữ chỗ</div>
    </div>
    <div class="dg">
      <div class="store">D1 Tồn kho</div><div class="ar">◀▶<small>ATP / giữ chỗ</small></div>
      <div class="oval">3. Đẩy tồn</div><div class="ar">▶<small>số lượng bán được</small></div>
      <div class="bx ext">Kênh bán</div>
    </div>
    <p class="note">Tự kiểm: tiến trình 3 xuất ra <b>số lượng</b> — nó không tự bịa được, nên phải ĐỌC D1. Vẽ thiếu mũi tên đó là một <b>phép màu</b>.</p>` },

  { t: 'ERD — mô hình LOGIC, không phải schema', body: `
    <table class="t">
      <tr><th>Thành phần</th><th>Ký pháp</th><th>Luật</th></tr>
      <tr><td>Thực thể</td><td>Chữ nhật</td><td class="hl">Danh từ SỐ ÍT — “Sinh viên”, không phải “Các sinh viên”</td></tr>
      <tr><td>Quan hệ</td><td>Đường nối + động từ</td><td>Đọc được cả hai chiều</td></tr>
      <tr><td>Bản số</td><td>1, n, chân quạ</td><td class="hl">Ghi ở CẢ HAI đầu, luôn luôn</td></tr>
      <tr><td>Tuỳ chọn</td><td>0..1, 0..n</td><td>“Có thể không có” khác “có ít nhất một”</td></tr>
    </table>
    <p class="note">Không khoá chính, không khoá ngoại, không kiểu dữ liệu — đó là thiết kế, không phải yêu cầu.</p>` },

  { t: 'Bài luyện TP1 · Lõi đăng ký môn', body: `
    <div class="dg">
      <div class="bx">Chương trình</div><div class="ar">1 ─ có ─ n</div>
      <div class="bx">Nhóm yêu cầu</div><div class="ar">n ─ gồm ─ n</div>
      <div class="bx">Môn học</div>
    </div>
    <div class="dg">
      <div class="bx">Sinh viên</div><div class="ar">1 ─ giữ ─ n</div>
      <div class="bx">Lượt ghi danh</div><div class="ar">n ─ thuộc ─ 1</div>
      <div class="bx">Lớp học phần</div>
    </div>
    <div class="box ok"><b>Quan hệ quan trọng nhất: Môn học ↔ Môn học.</b> Môn tiên quyết cũng là môn học — quan hệ <b>đệ quy</b>, n:n. Bỏ sót nó là vẽ một sơ đồ mà BR-02 không diễn đạt được.</div>` },

  { t: 'Bốn lỗi mất điểm', body: `
    <div class="steps">
      <div><span class="n">1</span>Vẽ schema cơ sở dữ liệu — khoá ngoại, varchar. Đó là thiết kế.</div>
      <div><span class="n">2</span>Bản số chỉ ghi một đầu — nói được nửa sự thật.</div>
      <div><span class="n">3</span>Tên thực thể số nhiều.</div>
      <div><span class="n">4</span>Trộn ký hiệu DFD với ERD — kho dữ liệu KHÔNG phải thực thể.</div>
    </div>` },
];
