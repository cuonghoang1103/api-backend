export const deck = { key: 'labL4', code: 'LAB 4', title: 'State diagram', sub: 'SWR302 · Software Requirements · LAB (10%)' };
export const slides = [
  { kind: 'cover', t: 'Sơ đồ chuyển trạng thái', sub: 'Vật này ở đâu, và cái gì làm nó chuyển?',
    body: `<p class="cov-meta">SWR302 · LAB 4 · Wiegers Ch. 12<br/>Bài luyện: <b>Order Status</b> của TP2</p>` },

  { t: 'Khi nào vẽ nó?', body: `
    <p class="lead2">Vẽ mỗi khi một đối tượng có <b>ĐỜI SỐNG</b>: một đơn hàng, một lượt ghi danh, một lượt trả hàng, một yêu cầu vượt sĩ số.</p>
    <div class="grid3">
      <div class="card"><b>Order</b>TP2</div>
      <div class="card"><b>Enrollment</b>TP1</div>
      <div class="card"><b>Override Request</b>TP1</div>
    </div>
    <p class="note">Vẽ ra thường phơi bày những trạng thái <b>chưa ai đặt tên</b> — đó là giá trị thật của mô hình này.</p>` },

  { t: 'Ký pháp', body: `
    <div class="dg">
      <div class="bx st">Reserved</div>
      <div class="ar">──▶<small>routed</small></div>
      <div class="bx st">Routed</div>
      <div class="ar">──▶<small>wave released</small></div>
      <div class="bx st">Picking</div>
    </div>
    <table class="t">
      <tr><th>Ký hiệu</th><th>Nghĩa</th></tr>
      <tr><td>Chữ nhật bo tròn</td><td>TRẠNG THÁI — nơi đối tượng <b>nằm yên</b>, tên là tính từ / quá khứ phân từ</td></tr>
      <tr><td>Mũi tên</td><td class="hl">sự kiện [điều kiện] / hành động</td></tr>
      <tr><td>Chấm đặc / vòng tròn viền</td><td>Bắt đầu / Kết thúc</td></tr>
    </table>` },

  { t: 'Lỗi định nghĩa cả bài: trạng thái ≠ hành động', body: `
    <div class="two">
      <div class="box warn"><b>✕ “Đang giữ chỗ tồn kho”</b><br/><span class="note">Đó là HOẠT ĐỘNG — nó thuộc về swimlane.</span></div>
      <div class="box ok"><b>✓ “Reserved” (đã giữ chỗ)</b><br/><span class="note">Đó là TRẠNG THÁI — đối tượng nằm đó tới khi có gì xảy ra.</span></div>
    </div>
    <p class="lead2" style="text-align:center;font-size:28px">Tên hộp bắt đầu bằng <b>“Đang…”</b> ⇒ bạn đã vẽ nhầm mô hình.</p>` },

  { t: 'Bài luyện TP2 · Đời sống một đơn hàng', body: `
    <div class="dg">
      <div class="bx st">Pending</div><div class="ar">▶<small>validated</small></div>
      <div class="bx st">Validated</div><div class="ar">▶<small>reserved</small></div>
      <div class="bx st">Reserved</div><div class="ar">▶<small>routed</small></div>
      <div class="bx st">Routed</div>
    </div>
    <div class="dg">
      <div class="bx st">Picking</div><div class="ar">▶<small>packed</small></div>
      <div class="bx st">Packed</div><div class="ar">▶<small>label bought</small></div>
      <div class="bx st">Labelled</div><div class="ar">▶<small>delivered</small></div>
      <div class="bx st">Delivered ◎</div>
    </div>
    <p class="note">Nhánh phụ: Validated ──ATP &lt; qty [BR-02]──▶ <b>Backordered</b> ──hàng về──▶ Validated</p>` },

  { t: 'Vẽ ra thì LỘ điều gì?', body: `
    <div class="steps">
      <div><span class="n">1</span><b>Cancelled tới được từ 5 trạng thái, nhưng KHÔNG từ Labelled</b> — đó chính là BR-05 hiện hình thành một hình dạng.</div>
      <div><span class="n">2</span><b>Backordered KHÔNG phải trạng thái cuối.</b> Nó quay về Validated khi hàng về. Vẽ nó thành trạng thái kết thúc là thiết kế một hệ thống bỏ rơi khách.</div>
      <div><span class="n">3</span><b>Vòng tự lặp ở Pending</b> (hết hạn giữ chỗ, BR-04) — không lời kể use case nào mô tả nó như một lần đổi trạng thái.</div>
    </div>` },

  { t: 'Quá 7 trạng thái? Dùng BẢNG', body: `
    <table class="t">
      <tr><th>Trạng thái ↓ / Sự kiện →</th><th>kiểm hợp lệ</th><th>giữ chỗ hỏng</th><th>huỷ</th></tr>
      <tr><th>Pending</th><td>Validated</td><td>—</td><td>Cancelled</td></tr>
      <tr><th>Validated</th><td>—</td><td>Backordered</td><td>Cancelled</td></tr>
      <tr><th>Reserved</th><td>—</td><td>—</td><td>Cancelled</td></tr>
      <tr><th>Labelled</th><td>—</td><td>—</td><td class="hl">TỪ CHỐI (BR-05)</td></tr>
    </table>
    <p class="lead2">Ô trống <b>hiện ra</b> — bạn thấy ngay những chuyển tiếp chưa nghĩ tới.</p>` },

  { t: 'Ô “—” và ô “TỪ CHỐI” là HAI yêu cầu khác nhau', body: `
    <div class="two">
      <div class="box"><b>—</b><br/><span class="note">Không có gì xảy ra. Hệ thống im lặng.</span></div>
      <div class="box warn"><b>TỪ CHỐI</b><br/><span class="note">Hệ thống chủ động từ chối VÀ giải thích vì sao.</span></div>
    </div>
    <p class="lead2">Chỉ cái <b>bảng</b> mới buộc bạn viết ra cả hai. Sơ đồ thì cả hai đều trông như “không có mũi tên”.</p>` },

  { t: 'Bốn lỗi mất điểm', body: `
    <div class="steps">
      <div><span class="n">1</span>Trạng thái đặt tên như hành động (“Đang xử lý”).</div>
      <div><span class="n">2</span>Không có trạng thái kết thúc — thiếu vòng tròn viền.</div>
      <div><span class="n">3</span>Chuyển tiếp không nhãn. Phải là <b>sự kiện [điều kiện] / hành động</b>.</div>
      <div><span class="n">4</span>Thiếu chuyển tiếp HỎNG: hết hạn, quá giờ, huỷ — đó chính là lý do mô hình này đáng vẽ.</div>
    </div>` },
];
