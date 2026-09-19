export const deck = { key: 'labL2', code: 'LAB 2', title: 'Context diagram', sub: 'SWR302 · Software Requirements · LAB (10%)' };
export const slides = [
  { kind: 'cover', t: 'Context diagram', sub: 'Ranh giới hệ thống trong một bức hình',
    body: `<p class="cov-meta">SWR302 · LAB 2 · Wiegers Ch. 12<br/>Bài luyện lấy từ đề <b>TP2 — OMFS</b></p>` },

  { t: 'Nó trả lời ĐÚNG MỘT câu hỏi', body: `
    <p class="lead2" style="text-align:center;font-size:30px"><b>Cái gì nằm TRONG hệ thống, cái gì nằm NGOÀI?</b></p>
    <p class="lead2">Đây là mô hình đơn giản nhất môn học, và là cái <b>đáng làm đúng nhất</b>: mọi tranh cãi về phạm vi suốt phần còn lại của dự án đều được nó phân xử.</p>
    <div class="box ok">Người chấm mở mục “Limitations and Exclusions” của Vision &amp; Scope, rồi đối chiếu với sơ đồ này. Hai thứ lệch nhau là mất điểm.</div>` },

  { t: 'Chỉ có BA ký hiệu', body: `
    <table class="t">
      <tr><th>Ký hiệu</th><th>Nghĩa</th><th>Bao nhiêu</th></tr>
      <tr><td>Vòng tròn ở giữa</td><td>TOÀN BỘ hệ thống, đặt tên bằng cụm danh từ</td><td class="hl">Đúng MỘT</td></tr>
      <tr><td>Hình chữ nhật quanh nó</td><td>Thực thể ngoài — lớp người dùng &amp; hệ thống khác</td><td>Có bao nhiêu vẽ bấy nhiêu</td></tr>
      <tr><td>Mũi tên có nhãn</td><td>Luồng DỮ LIỆU, đặt tên theo dữ liệu</td><td>Mỗi luồng một mũi tên, có chiều</td></tr>
    </table>
    <p class="note">Không có tiến trình, không có cơ sở dữ liệu, không có màn hình bên trong vòng tròn.</p>` },

  { t: 'Vòng tròn KHÔNG có ruột', body: `
    <div class="two">
      <div class="box ok"><b>✓ Context diagram</b><br/><span class="note">Một vòng tròn duy nhất. Không nhìn thấy gì bên trong.</span></div>
      <div class="box warn"><b>✕ Đã thành DFD mức 1</b><br/><span class="note">Tách “OMFS lõi” và “OMFS báo cáo” là bỏ mất nhiệm vụ duy nhất của sơ đồ.</span></div>
    </div>
    <p class="lead2">Nếu bạn đã vẽ các hộp bên trong vòng tròn, bạn đang vẽ <b>bài khác</b> — đó là LAB 5.</p>` },

  { t: 'Bài luyện TP2 · Bước 1 — liệt kê thực thể ngoài', body: `
    <p class="nh">Bất cứ thứ gì gửi/nhận dữ liệu mà KHÔNG thuộc hệ thống</p>
    <div class="grid2">
      <div class="f">Nhân viên kho</div><div class="f">Kênh bán</div>
      <div class="f">Quản lý hoàn tất đơn</div><div class="f">Hãng 3PL</div>
      <div class="f">Kiểm soát tồn kho</div><div class="f">Cổng thanh toán</div>
      <div class="f">Nhân viên CSKH</div><div class="f">ERP / Kế toán</div>
      <div class="f">Khách hàng</div><div class="f">Dịch vụ thông báo</div>
    </div>` },

  { t: 'Bài luyện TP2 · Bước 2 — đặt tên theo DỮ LIỆU', body: `
    <div class="dg">
      <div class="bx ext">Kênh bán</div>
      <div class="ar">──▶<small>dữ liệu đơn hàng</small></div>
      <div class="oval">OMFS</div>
      <div class="ar">──▶<small>yêu cầu giá, tem</small></div>
      <div class="bx ext">Hãng 3PL</div>
    </div>
    <div class="dg">
      <div class="bx ext">Cổng thanh toán</div>
      <div class="ar">──▶<small>trạng thái uỷ quyền</small></div>
      <div class="oval">OMFS</div>
      <div class="ar">──▶<small>số lượng tồn</small></div>
      <div class="bx ext">Kênh bán</div>
    </div>
    <p class="note">Không phải “đăng nhập”, “bấm”, “yêu cầu” — đó là hành động. Gọi tên thứ <b>đi qua vạch</b>.</p>` },

  { t: 'Bước 3 — đối chiếu ranh giới với ĐỀ BÀI', body: `
    <div class="box"><b>Đề TP2 viết:</b> “web storefront xử lý tốt việc khách duyệt hàng”.</div>
    <p class="lead2">Đó là thầy đang <b>bảo bạn đừng đặc tả nó</b>. Storefront là hình chữ nhật <b>bên ngoài</b>, không nằm trong vòng tròn.</p>
    <div class="box warn">Đưa danh mục, giá, khuyến mãi hay thanh toán vào phạm vi là <b>lỗi phạm vi phổ biến nhất</b> của TP2.</div>` },

  { t: 'Ecosystem map — khi nào vẽ nó thay thế', body: `
    <table class="t">
      <tr><th></th><th>Context diagram</th><th>Ecosystem map</th></tr>
      <tr><th>Ở giữa</th><td>Hệ ta, MỘT vòng tròn</td><td>Hệ ta, một trong nhiều hộp</td></tr>
      <tr><th>Thể hiện</th><td>Chỉ luồng tới/đi từ TA</td><td>Luồng giữa BẤT KỲ hai hệ</td></tr>
      <tr><th>Thêm</th><td>—</td><td>Ai sở hữu, công nghệ, khối lượng</td></tr>
      <tr><th>Trả lời</th><td class="hl">Cái gì trong phạm vi?</td><td class="hl">Còn ảnh hưởng ai nữa?</td></tr>
    </table>
    <p class="note">TP2 rất hợp ecosystem map: sàn TMĐT vốn đã nói chuyện với danh mục của storefront, sau lưng bạn.</p>` },

  { t: 'Bốn lỗi mất điểm', body: `
    <div class="steps">
      <div><span class="n">1</span><b>Mũi tên không nhãn.</b> “Kênh bán → OMFS” chẳng nói gì.</div>
      <div><span class="n">2</span><b>Luồng điều khiển thay vì dữ liệu.</b> “phê duyệt” là hành động; “quyết định phê duyệt” mới là dữ liệu.</div>
      <div><span class="n">3</span><b>Hai vòng tròn.</b> Đã thành DFD mức 1.</div>
      <div><span class="n">4</span><b>Thiếu hệ thống ngoài mà đề có nhắc.</b> TP2 nhắc hãng 3PL rõ ràng.</div>
    </div>` },
];
