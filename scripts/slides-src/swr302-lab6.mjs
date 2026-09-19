export const deck = { key: 'labL6', code: 'LAB 6', title: 'Bảng quyết định', sub: 'SWR302 · Software Requirements · LAB (10%)' };
export const slides = [
  { kind: 'cover', t: 'Bảng quyết định & Dialog map', sub: 'Mô hình tìm ra trường hợp chưa ai nghĩ tới',
    body: `<p class="cov-meta">SWR302 · LAB 6 · Wiegers Ch. 12<br/>Bài luyện: <b>BR-11</b> của TP2</p>` },

  { t: 'Giá trị của nó mang tính MÁY MÓC', body: `
    <p class="lead2" style="text-align:center;font-size:29px"><b>n</b> điều kiện nhị phân ⇒ <b>2ⁿ</b> tổ hợp<br/>và cái bảng buộc bạn viết kết cục cho <b>từng cái</b>.</p>
    <div class="box warn" style="text-align:center">Tổ hợp bạn chưa nghĩ tới chính là cái sẽ thành <b>lỗi trên production</b>.</div>` },

  { t: 'Bài luyện TP2 · BR-11, ba điều kiện ⇒ tám cột', body: `
    <table class="t" style="font-size:19px">
      <tr><th>Luật</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
      <tr><th>Hãng đang hoạt động</th><td>C</td><td>C</td><td>C</td><td>C</td><td>K</td><td>K</td><td>K</td><td>K</td></tr>
      <tr><th>Phục vụ mã bưu chính</th><td>C</td><td>C</td><td>K</td><td>K</td><td>C</td><td>C</td><td>K</td><td>K</td></tr>
      <tr><th>Nhận khối lượng</th><td>C</td><td>K</td><td>C</td><td>K</td><td>C</td><td>K</td><td>C</td><td>K</td></tr>
      <tr><th>Đủ điều kiện</th><td class="hl">✓</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><th>Báo “quá khổ”</th><td></td><td>✓</td><td></td><td>✓</td><td></td><td></td><td></td><td></td></tr>
      <tr><th>Báo “không phục vụ”</th><td></td><td></td><td>✓</td><td>✓</td><td></td><td></td><td></td><td></td></tr>
      <tr><th>Không hiện ra</th><td></td><td></td><td></td><td></td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr>
    </table>` },

  { t: 'Luật 4 mới là lý do cái bảng tồn tại', body: `
    <div class="box"><b>Luật 4:</b> cả khu vực LẪN kích thước đều không đạt.<br/>Người vận hành thấy <b>một</b> lý do hay <b>cả hai</b>?</div>
    <p class="lead2">Văn xuôi của BR-11 không nói. Cái bảng làm khoảng trống đó <b>không thể lờ đi</b>.</p>
    <div class="box ok">Đáp án chọn: <b>cả hai</b>. Người đóng gói lại cho vừa kích thước rồi chạy lại sẽ đâm vào lời từ chối thứ hai và mất thêm một vòng.</div>` },

  { t: 'Rút gọn — nhưng CHỈ SAU KHI viết đủ 2ⁿ', body: `
    <table class="t">
      <tr><th>Luật</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>
      <tr><th>Hãng hoạt động</th><td>C</td><td>C</td><td>C</td><td>C</td><td>K</td></tr>
      <tr><th>Phục vụ mã bưu</th><td>C</td><td>C</td><td>K</td><td>K</td><td class="hl">–</td></tr>
      <tr><th>Nhận khối lượng</th><td>C</td><td>K</td><td>C</td><td>K</td><td class="hl">–</td></tr>
      <tr><th>Kết cục</th><td>Báo giá</td><td>Quá khổ</td><td>Không phục vụ</td><td>Cả hai</td><td>Không hiện</td></tr>
    </table>
    <div class="box warn">Vừa dựng vừa rút gọn là cách khiến tổ hợp chưa nghĩ tới <b>mãi mãi không được nghĩ tới</b>.</div>` },

  { t: 'Bảng hay Cây?', body: `
    <div class="two">
      <div class="box ok"><b>BẢNG</b><br/>Kiểm tính đầy đủ · đưa cho lập trình viên<br/><span class="note">Ô trống hiện ra.</span></div>
      <div class="box"><b>CÂY</b><br/>Để stakeholder theo dõi trong cuộc họp<br/><span class="note">Dễ đọc, nhưng cũng dễ để sót.</span></div>
    </div>
    <p class="lead2">Dựng <b>bảng trước</b>, rồi vẽ cây <b>từ bảng</b>.</p>` },

  { t: 'Dialog map — màn hình nào đi đâu', body: `
    <div class="dg">
      <div class="bx st">Catalog</div><div class="ar">▶<small>chọn lớp</small></div>
      <div class="bx st">Chi tiết lớp</div><div class="ar">▶<small>đăng ký</small></div>
      <div class="bx st">Kết quả</div>
    </div>
    <p class="lead2">Một sơ đồ trạng thái mà <b>trạng thái là màn hình</b>, <b>chuyển tiếp là hành động người dùng</b>.</p>
    <div class="box warn">Nó phơi ra <b>ngõ cụt</b> — màn hình không có lối ra. Đó là phép kiểm chính của mô hình này.</div>` },

  { t: 'Bảng Display-Action-Response', body: `
    <table class="t" style="font-size:19px">
      <tr><th>Thành phần</th><th>Hiển thị</th><th>Hành động</th><th>Phản hồi</th></tr>
      <tr><td>Chấp nhận định tuyến</td><td>Bật khi trạng thái = Routed</td><td>Bấm</td><td>Chốt shipment, chuyển sang lập đợt</td></tr>
      <tr><td>Ghi đè…</td><td class="hl">Chỉ bật với vai Quản lý (BR-19)</td><td>Bấm</td><td>Mở chọn trung tâm + ô lý do bắt buộc</td></tr>
    </table>
    <p class="lead2">Đây là nơi những điều kiện <b>“Bật khi…”</b> được viết ra. Chúng là YÊU CẦU, và gần như không xuất hiện ở chỗ nào khác.</p>` },

  { t: 'Bảng tự kiểm trước khi nộp LAB', body: `
    <div class="steps">
      <div><span class="n">1</span>Mọi hộp, mũi tên, lane đều <b>có nhãn</b></div>
      <div><span class="n">2</span>Một mức trừu tượng</div>
      <div><span class="n">3</span>Có vẽ <b>ranh giới hệ thống</b></div>
      <div><span class="n">4</span>Có ít nhất một đường <b>hỏng / từ chối / ngoại lệ</b></div>
      <div><span class="n">5</span>Có chú giải nếu tự chế ký hiệu · xuất ảnh <b>và</b> giữ file nguồn</div>
    </div>
    <div class="box ok">Chương 17: đưa sơ đồ cho người <b>không vẽ nó</b> và nhờ đọc to. Mỗi chỗ họ ngập ngừng là một chỗ bạn quên ghi nhãn.</div>` },
];
