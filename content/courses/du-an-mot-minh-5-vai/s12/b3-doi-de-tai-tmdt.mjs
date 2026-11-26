/**
 * 12.3 — Đổi đề tài trong 1 tuần: áp trọn quy trình sang Sàn thương mại điện tử (dm5-12-3-doi-de-tai-tmdt).
 * Khung tổng quát 7 ngày đổi đề tài + Bài làm mẫu TRỌN VẸN cho đề tài mới:
 * ShopFlow — Sàn thương mại điện tử nhiều người bán (Charter/MoSCoW, Actor/Use Case/BR, 5 màn lõi,
 * ERD lõi + ràng buộc chống bán âm & webhook idempotent, kế hoạch 3 iteration, rủi ro/góc hacker đặc thù TMĐT,
 * bảng đối chiếu 1-1 với LabFlow AI chứng minh quy trình dùng lại 100%).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, out, ac, cs, vo, dm, lf, mu, viecLabflow, apDung } from '../_chung.mjs';

const L123 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 12 · Lesson 12.3', 'Chương 12 · Bài 12.3', `
<h2>${t('12.3 — Switching Topics in One Week: Full Worked Playbook on a Multi-Vendor E-Commerce Marketplace', '12.3 — Đổi đề tài trong 1 tuần: áp trọn quy trình sang Sàn thương mại điện tử')}</h2>
<p class="lead">${t(
    'Picture Monday of Week 1: you walk into SWP391 or SEP490 ready to build LabFlow AI, and your lecturer says, "Interesting idea, but this semester my class is doing a <strong>Multi-Vendor E-Commerce Marketplace</strong> — please switch topics and present your starter pack within one week (by next Monday)." Do you panic and lose three weeks? Not if you learned the <strong>process</strong> rather than memorizing one project! This lesson gives you the universal <strong>7-Day Topic Pivot Protocol</strong> and walks through a complete, end-to-end worked example on a Multi-Vendor Marketplace ("ShopFlow").',
    'Thử tưởng tượng sáng thứ Hai Tuần 1: bạn bước vào lớp SWP391 hoặc SEP490 sẵn sàng làm LabFlow AI, và giảng viên nói: "Ý tưởng hay đấy, nhưng kỳ này lớp thầy chốt đề tài <strong>Sàn thương mại điện tử nhiều người bán</strong> — nhóm em đổi đề tài và chốt gói khởi động trong 1 tuần (thứ Hai tuần sau) nhé." Bạn có hoảng loạn mất trắng ba tuần không? Không bao giờ — nếu bạn học <strong>quy trình</strong> chứ không học vẹt một đề tài! Bài này đưa cho bạn <strong>Giao thức Đổi đề tài trong 7 ngày</strong> áp cho mọi lĩnh vực và làm mẫu trọn vẹn trên đề tài Sàn thương mại điện tử ("ShopFlow").')}</p>

<h3>${t('Everyday picture: a commercial pilot converting from Airbus A320 to Boeing 737', 'Liên tưởng đời thường: phi công chuyển loại từ Airbus A320 sang Boeing 737')}</h3>
<p>${t(
    'When an airline pilot transitions to a new aircraft model, they do not re-learn aerodynamics, radio protocol, weather radar, or emergency checklists from zero. Only the cockpit layout and aircraft-specific limits change. Similarly, when your software topic shifts from Lab Booking to E-Commerce, Healthcare, or Logistics, <strong>most of your engineering muscle stays identical</strong>: MoSCoW charter, vertical slices, OpenAPI-first design, database invariants, Git/CI gates, 3-round testing, and RTM. Only the <strong>domain nouns, business rules, and failure modes</strong> change.',
    'Khi phi công chuyển sang lái một dòng máy bay mới, họ không học lại khí động học, quy tắc liên lạc đài không lưu, radar thời tiết hay bảng kiểm khẩn cấp từ con số 0. Thứ duy nhất đổi là bố cục buồng lái và giới hạn riêng của dòng máy bay đó. Y hệt vậy, khi đề tài phần mềm đổi từ Đặt phòng lab sang Thương mại điện tử, Y tế hay Giao vận, <strong>phần lớn cơ bắp kỹ thuật của bạn giữ nguyên</strong>: Charter MoSCoW, lát cắt miền dọc, thiết kế OpenAPI trước, ràng buộc CSDL, cổng Git/CI, test 3 vòng và RTM. Thứ duy nhất đổi là <strong>danh từ nghiệp vụ, luật kinh doanh và kiểu sự cố đặc thù của miền đó</strong>.')}</p>

<h3>${t('The Universal 7-Day Topic Pivot Protocol (Works for ANY Domain)', 'Giao thức Đổi đề tài 7 ngày tổng quát (Áp cho MỌI lĩnh vực)')}</h3>
${bang(
  [t('Day', 'Ngày'), t('Hat', 'Mũ'), t('Core Output (Topic-Agnostic)', 'Sản phẩm đầu ra (Tổng quát)'), t('Done Criteria', 'Đạt khi')],
  [
    ['<strong>Day 1</strong>', mu('C1', en), t('1-page Project Charter + MoSCoW Scope + explicit "Out of Scope v1" list', 'Project Charter 1 trang + Phạm vi MoSCoW + danh sách "KHÔNG làm ở v1"'), t('Goal measurable; ≥ 5 high-risk features explicitly cut from v1', 'Mục tiêu đo được; cắt rõ ≥ 5 tính năng nặng khỏi v1')],
    ['<strong>Day 2</strong>', mu('C2', en), t('Actor Matrix + Top 12–15 Use Cases + Top 8–10 Domain Business Rules (with numbers)', 'Ma trận Actor + 12–15 Use Case lõi + 8–10 Business Rule lõi (có con số)'), t('Zero vague adjectives; every BR maps to a testable condition', 'Không còn tính từ mơ hồ; mỗi BR gắn điều kiện kiểm được')],
    ['<strong>Day 3</strong>', mu('C3', en), t('Core ERD (8–12 tables) + #1 Data Invariant (concurrency/money/state constraint)', 'ERD lõi (8–12 bảng) + Ràng buộc dữ liệu số 1 (tranh chấp/tiền/trạng thái)'), t('1-page ERD + SQL constraint &amp; state machine drafted', 'Có ERD 1 trang + nháp ràng buộc SQL &amp; máy trạng thái')],
    ['<strong>Day 4</strong>', mu('C2', en) + ' ' + mu('C4', en), t('Core 5 Screens wireframes + Screen-Role Authorization Matrix + OpenAPI v0.1', 'Wireframe 5 màn lõi + Ma trận phân quyền màn hình + OpenAPI v0.1'), t('End-to-end happy + unhappy flow visible across all 5 core screens', 'Thấy rõ luồng đúng + luồng lỗi xuyên suốt 5 màn lõi')],
    ['<strong>Day 5</strong>', mu('C1', en), t('3-Iteration Roadmap (10 weeks) + Vertical Slice assignment + CT Work Backlog', 'Lộ trình 3 Iteration (10 tuần) + Chia miền dọc + Backlog trên CT Work'), t('Balanced complexity (S/M/C) per member; Milestone M1/M2/M3 gates clear', 'Độ phức tạp S/M/C cân giữa các vai; rõ mốc M1/M2/M3')],
    ['<strong>Day 6</strong>', mu('C5', en) + ' ' + mu('C1', en), t('Domain-Specific RAID Risk Register + Threat Model + 10 High-Risk Test Ideas', 'Sổ rủi ro RAID đặc thù miền + Mô hình mối đe doạ + 10 ý tưởng test rủi ro cao'), t('Top 3 domain failure/hacker scenarios have concrete mitigations', '3 kịch bản lỗi/tấn công nặng nhất của miền đều có cách chặn')],
    ['<strong>Day 7</strong>', mu('C1', en) + ' ' + mu('C2', en), t('Lecturer Q&amp;A Pack (5–8 closed questions with proposed defaults) + Go/No-Go sign-off', 'Gói Q&amp;A gửi GV (5–8 câu hỏi đóng kèm đề xuất) + chốt Go/No-Go'), t('Lecturer confirms scope, stack, and BR defaults before Coding Day 1', 'GV chốt phạm vi, tech stack và số BR trước ngày code đầu tiên')]
  ]
)}

<h3>${t('Complete Worked Example: ShopFlow — Multi-Vendor E-Commerce Marketplace', 'Bài làm mẫu trọn vẹn: ShopFlow — Sàn thương mại điện tử nhiều người bán')}</h3>
<p>${t(
    'Let us run Days 1–6 right here on a multi-vendor marketplace (buyers browse multiple shops, add items to cart, check out with sandbox payment, sellers fulfill orders, buyers review or open disputes, admins moderate). Notice how every template matches what you used in LabFlow — zero reinvention!',
    'Hãy chạy thẳng Ngày 1–6 ngay tại đây trên đề tài sàn thương mại điện tử nhiều người bán (người mua xem hàng từ nhiều shop, thêm giỏ, thanh toán qua cổng sandbox, người bán xác nhận &amp; giao hàng, người mua đánh giá hoặc mở khiếu nại, admin kiểm duyệt). Hãy để ý mọi mẫu biểu đều khớp y hệt bộ bạn dùng ở LabFlow — không phải chế lại thứ gì!')}</p>

<h4>${t('1. Project Charter &amp; MoSCoW Scope (Day 1)', '1. Project Charter &amp; Phạm vi MoSCoW (Ngày 1)')} ${mu('C1', en)}</h4>
<ul>
<li>${t('<strong>Product Goal:</strong> Enable independent sellers to list SKU-tracked products and buyers to place multi-shop orders with atomic inventory protection, sandbox payment verification, shipping status tracking, and verified-purchase reviews within a 10-week SWP391 release.', '<strong>Mục tiêu sản phẩm:</strong> Cho phép các người bán độc lập đăng sản phẩm quản lý tồn kho theo SKU, người mua đặt đơn nhiều shop có bảo vệ chống bán âm kho, xác thực thanh toán sandbox, theo dõi giao vận và đánh giá xác thực đã mua trong gói SWP391 10 tuần.')}</li>
<li>${t('<strong>MUST (P0 — Core v1):</strong> Auth &amp; RBAC (Buyer/Seller/Admin), Shop &amp; Product/SKU CRUD, Server-side Search/Filter/Paging, Cart &amp; Atomic Checkout (split into sub-orders per shop), Sandbox Payment Webhook (idempotent), Order State Machine &amp; Seller Fulfillment, Verified Reviews &amp; Basic Dispute Ticket.', '<strong>MUST (P0 — Lõi v1):</strong> Đăng nhập &amp; RBAC (Buyer/Seller/Admin), CRUD Shop &amp; Sản phẩm/SKU, Tìm kiếm/Lọc/Phân trang server-side, Giỏ hàng &amp; Checkout nguyên tử (tách đơn con theo từng shop), Webhook thanh toán Sandbox (idempotent), Máy trạng thái đơn hàng &amp; Xử lý của Seller, Đánh giá đã mua &amp; Phiếu khiếu nại cơ bản.')}</li>
<li>${t('<strong>SHOULD (P1):</strong> Shop-level voucher codes (single voucher per order), Seller revenue summary dashboard, Email outbox notifications.', '<strong>SHOULD (P1):</strong> Mã giảm giá theo shop (tối đa 1 mã/đơn), Dashboard doanh thu cho Seller, Gửi email qua bảng Outbox.')}</li>
<li>${t('<strong>WON\'T (Explicitly Out of Scope v1 — Protects Your Sanity!):</strong> Real production bank/card settlement (sandbox gateway only), real-time livestream shopping, real carrier API integration (simulated shipping status webhook only), multi-warehouse split routing, AI recommendation engine.', '<strong>WON\'T (Chốt KHÔNG làm ở v1 — Bảo vệ tiến độ!):</strong> Kết nối ngân hàng/thẻ thật (chỉ cổng sandbox), bán hàng livestream thời gian thực, tích hợp API hãng vận chuyển thật (chỉ giả lập webhook trạng thái giao hàng), định tuyến đa kho, hệ gợi ý AI.')}</li>
</ul>

<h4>${t('2. Actors, Core Use Cases &amp; Domain Business Rules (Day 2)', '2. Actor, Use Case lõi &amp; Business Rule đặc thù (Ngày 2)')} ${mu('C2', en)}</h4>
${bang(
  [t('Actor', 'Tác nhân'), t('Core Use Cases (Sample 12 of ~35)', 'Use Case lõi (Ví dụ 12 trên ~35)'), t('Key Domain Business Rules (Testable!)', 'Business Rule lõi (Kiểm thử được!)')],
  [
    [t('<strong>Buyer</strong>', '<strong>Người mua</strong>'), t('UC-01 Search/Filter Products; UC-02 Manage Cart; UC-03 Place Order (Checkout); UC-04 Cancel Unpaid/Pending Order; UC-05 Submit Verified Review; UC-06 Open Dispute', 'UC-01 Tìm/Lọc sản phẩm; UC-02 Quản lý giỏ; UC-03 Đặt hàng (Checkout); UC-04 Huỷ đơn chưa thanh toán/chờ duyệt; UC-05 Đánh giá đã mua; UC-06 Mở khiếu nại'), t('<strong>BR-01 (Atomic Stock):</strong> Stock decrement MUST succeed atomically only when <code>stock_qty &gt;= requested_qty</code>; otherwise return 409.<br><strong>BR-02 (Server Price Truth):</strong> Order total is computed strictly from server-side SKU prices, NEVER client JSON.', '<strong>BR-01 (Tồn kho nguyên tử):</strong> Trừ kho CHỈ thành công nguyên tử khi <code>stock_qty &gt;= requested_qty</code>; nếu thiếu trả 409.<br><strong>BR-02 (Giá chuẩn ở server):</strong> Tổng đơn tính 100% từ giá SKU trên server, KHÔNG tin JSON từ client.')],
    [t('<strong>Seller</strong>', '<strong>Người bán</strong>'), t('UC-07 Register Shop; UC-08 Manage Products &amp; SKU Stock; UC-09 Confirm/Pack/Ship Sub-Order; UC-10 View Shop Revenue', 'UC-07 Đăng ký Shop; UC-08 Quản lý Sản phẩm &amp; Tồn kho SKU; UC-09 Xác nhận/Đóng gói/Giao đơn con; UC-10 Xem doanh thu Shop'), t('<strong>BR-03 (Shop Isolation):</strong> A Seller can only edit products and sub-orders belonging to their own approved <code>shop_id</code>.<br><strong>BR-04 (Order State Machine):</strong> Happy path: <code>PENDING_PAYMENT → PAID → CONFIRMED → SHIPPED → DELIVERED → COMPLETED</code>; exception &amp; terminal states: <code>CANCELLED</code> (allowed only before <code>SHIPPED</code>), <code>EXPIRED</code> (unpaid &gt; 15 min), <code>DISPUTED</code> (within 7 days of <code>DELIVERED</code>), and <code>REFUNDED</code>. Any illegal jump returns 409.', '<strong>BR-03 (Cô lập Shop):</strong> Seller chỉ được sửa sản phẩm và đơn con thuộc đúng <code>shop_id</code> đã duyệt của mình.<br><strong>BR-04 (Máy trạng thái đơn):</strong> Luồng chuẩn: <code>PENDING_PAYMENT → PAID → CONFIRMED → SHIPPED → DELIVERED → COMPLETED</code>; các trạng thái ngoại lệ &amp; kết thúc: <code>CANCELLED</code> (chỉ được trước <code>SHIPPED</code>), <code>EXPIRED</code> (quá 15 phút chưa trả tiền), <code>DISPUTED</code> (trong 7 ngày sau <code>DELIVERED</code>) và <code>REFUNDED</code>. Mọi bước nhảy trái luật trả 409.')],
    [t('<strong>Payment Gateway</strong>', '<strong>Cổng thanh toán</strong>'), t('UC-11 Deliver Payment Result Webhook', 'UC-11 Gửi Webhook kết quả thanh toán'), t('<strong>BR-05 (Idempotent Webhook):</strong> Every webhook MUST pass HMAC signature verification AND deduplicate by unique <code>provider_tx_id</code>; unpaid checkouts/orders auto-expire after 15 minutes (<code>EXPIRED</code>) releasing reserved stock.', '<strong>BR-05 (Webhook Idempotent):</strong> Mọi webhook PHẢI kiểm chữ ký HMAC VÀ chống trùng bằng <code>provider_tx_id</code> duy nhất; checkout/đơn chưa thanh toán tự hết hạn sau 15 phút (<code>EXPIRED</code>) và hoàn tồn kho.')],
    [t('<strong>Admin</strong>', '<strong>Quản trị viên</strong>'), t('UC-12 Approve/Suspend Shop &amp; Resolve Dispute/Refund', 'UC-12 Duyệt/Khoá Shop &amp; Phân xử Khiếu nại/Hoàn tiền'), t('<strong>BR-06 (Verified Review &amp; Dispute Window):</strong> Buyer can submit at most 1 review per delivered <code>order_item_id</code>; disputes open only within 7 days of <code>DELIVERED</code>.', '<strong>BR-06 (Đánh giá xác thực &amp; Hạn khiếu nại):</strong> Mỗi <code>order_item_id</code> đã giao chỉ được đánh giá tối đa 1 lần; chỉ mở khiếu nại trong 7 ngày kể từ <code>DELIVERED</code>.')]
  ]
)}

<p>${t('<strong>Legal Order State Transitions (BR-04 — any unlisted transition returns HTTP 409):</strong>', '<strong>Bảng chuyển trạng thái đơn hợp lệ (BR-04 — mọi bước chuyển ngoài bảng trả HTTP 409):</strong>')}</p>
${bang(
  [t('From State', 'Trạng thái hiện tại'), t('Trigger / Actor', 'Sự kiện / Tác nhân'), t('To State', 'Trạng thái mới'), t('Side Effect / Guard', 'Tác động / Ràng buộc')],
  [
    ['<code>PENDING_PAYMENT</code>', t('Valid HMAC payment webhook (BR-05)', 'Webhook thanh toán HMAC hợp lệ (BR-05)'), '<code>PAID</code>', t('Marks parent checkout paid; idempotent on <code>provider_tx_id</code>', 'Đánh dấu checkout đã trả; chống trùng theo <code>provider_tx_id</code>')],
    ['<code>PENDING_PAYMENT</code>', t('Buyer cancels OR 15-min timeout job', 'Người mua huỷ HOẶC job quá hạn 15 phút'), '<code>CANCELLED</code> / <code>EXPIRED</code>', t('Atomically restores reserved SKU <code>stock_qty</code>', 'Hoàn tồn kho <code>stock_qty</code> nguyên tử cho các SKU')],
    ['<code>PAID</code> / <code>CONFIRMED</code>', t('Seller confirms (from PAID) OR packs &amp; hands to carrier (from CONFIRMED)', 'Seller xác nhận (từ PAID) HOẶC đóng gói giao vận (từ CONFIRMED)'), '<code>CONFIRMED</code> / <code>SHIPPED</code>', t('Scoped to Seller\'s own <code>shop_id</code> (BR-03)', 'Kiểm quyền đúng <code>shop_id</code> của Seller (BR-03)')],
    ['<code>PAID</code> / <code>CONFIRMED</code>', t('Buyer/Seller cancels before <code>SHIPPED</code>', 'Huỷ hợp lệ trước khi sang <code>SHIPPED</code>'), '<code>CANCELLED</code> → <code>REFUNDED</code>', t('Restores stock and triggers sandbox refund record', 'Hoàn kho và tạo giao dịch hoàn tiền sandbox')],
    ['<code>SHIPPED</code>', t('Simulated carrier webhook confirms delivery', 'Webhook giao vận giả lập báo đã giao'), '<code>DELIVERED</code>', t('Starts 7-day dispute window; unlocks verified review (BR-06)', 'Mở cửa sổ 7 ngày khiếu nại; cho phép đánh giá xác thực (BR-06)')],
    ['<code>DELIVERED</code>', t('Buyer confirms receipt / 7 days pass without dispute', 'Người mua xác nhận / hết 7 ngày không khiếu nại'), '<code>COMPLETED</code>', t('Terminal state; releases seller payout summary', 'Trạng thái kết thúc; chốt doanh thu cho Seller')],
    ['<code>DELIVERED</code>', t('Buyer opens dispute within 7 days', 'Người mua mở khiếu nại trong 7 ngày'), '<code>DISPUTED</code>', t('Freezes order until Admin resolves', 'Tạm giữ đơn chờ Admin phân xử')],
    ['<code>DISPUTED</code>', t('Admin approves refund OR rejects dispute', 'Admin duyệt hoàn tiền HOẶC bác khiếu nại'), '<code>REFUNDED</code> / <code>COMPLETED</code>', t('Terminal state; writes immutable <code>audit_logs</code> entry', 'Trạng thái kết thúc; ghi vết bất biến vào <code>audit_logs</code>')]
  ]
)}

<h4>${t('3. Core ERD &amp; Atomic Invariant (Day 3)', '3. ERD lõi &amp; Ràng buộc nguyên tử (Ngày 3)')} ${mu('C3', en)}</h4>
<p>${t(
    'Because a buyer checks out items from <strong>multiple shops in ONE payment</strong>, we model a parent <code>checkouts</code> table (1:N <code>orders</code> per shop, 1:N <code>payments</code> tied to <code>checkout_id</code>) alongside server-persisted <code>carts</code> / <code>cart_items</code>:',
    'Vì người mua có thể thanh toán <strong>MỘT lần cho giỏ hàng gồm nhiều shop</strong>, ta tách bảng cha <code>checkouts</code> (1:N sang các đơn con <code>orders</code> theo từng shop, và <code>payments</code> gắn với <code>checkout_id</code>) kèm cặp bảng giỏ hàng <code>carts</code> / <code>cart_items</code> lưu phía server:')}</p>
<pre><code>  users (id, email, role, status)
    | 1:1                                     1:N
    +---&gt; carts (id, buyer_id UNIQUE) -----------&gt; cart_items (id, cart_id, sku_id, qty)
    | 1:N                                     1:N
    +---&gt; shops (id, owner_id, status) -----------&gt; products (id, shop_id, title, status)
    |                                                   | 1:N
    | 1:N                                               v
    +---&gt; checkouts (id, buyer_id, total_vnd,     skus (id, product_id, price_vnd, stock_qty CHECK &gt;= 0)
    |                status, expires_at)                |
    |       | 1:N                                       | 1:N
    |       +---&gt; payments (id, checkout_id, provider_tx_id UNIQUE, amount_vnd, status)
    |       | 1:N
    |       +---&gt; orders (id, checkout_id, buyer_id, shop_id, status, subtotal_vnd)
    |               | 1:N
    |               +---&gt; order_items (id, order_id, sku_id, qty, unit_price_vnd)
    |               |       | 1:1 (UNIQUE order_item_id; DELIVERED checked in service/trigger)
    |               |       v
    |               |     reviews (id, order_item_id UNIQUE, buyer_id, rating 1..5)
    |               +---&gt; shipments (id, order_id, carrier_code, status)
    |               +---&gt; disputes (id, order_id, reason, resolution, admin_id)
    +---&gt; audit_logs (id, actor_id, entity_type, entity_id, action, created_at)</code></pre>

<p>${t(
    'Just as LabFlow pushed double-booking protection down to PostgreSQL, ShopFlow pushes overselling protection down to an <strong>atomic conditional SQL update</strong> plus a <code>CHECK (stock_qty &gt;= 0)</code> constraint (generic 8-line illustration):',
    'Y như LabFlow đẩy lớp chống đặt trùng xuống PostgreSQL, ShopFlow đẩy lớp chống bán âm kho xuống một <strong>câu lệnh SQL cập nhật có điều kiện nguyên tử</strong> kèm ràng buộc <code>CHECK (stock_qty &gt;= 0)</code> (đoạn SQL tổng quát 8 dòng minh hoạ):')}</p>
${out(`-- Generic atomic stock reservation inside @Transactional checkout
UPDATE skus
   SET stock_qty = stock_qty - :requestedQty
 WHERE id = :skuId
   AND stock_qty >= :requestedQty;
-- If affectedRows == 0 -> rollback transaction and return HTTP 409 Conflict (Out of Stock)!`)}

<h4>${t('4. Five Core Screens &amp; 3-Iteration Roadmap (10 Weeks, Days 4–5)', '4. Năm màn hình lõi &amp; Lộ trình 3 Iteration 10 tuần (Ngày 4–5)')} ${mu('C1', en)} ${mu('C4', en)}</h4>
<p>${t(
    'Below are the <strong>5 spotlight core screens</strong> (out of ~35–40 full marketplace screens) balanced across iterations, followed by the complete <strong>3-Iteration 10-Week Roadmap</strong> benchmarked against SWP391 MaxLOC thresholds (confirm with your lecturer whether your class uses 180/240/660 or 240/240/720 per member):',
    'Dưới đây là <strong>5 màn hình lõi tiêu biểu</strong> (trong tổng số ~35–40 màn của sàn đầy đủ) được cân lại tải theo vòng, kèm <strong>Bảng lộ trình 3 Iteration 10 tuần</strong> đối chiếu ngưỡng MaxLOC của SWP391 (kiểm lại với GV xem lớp dùng mốc 180/240/660 hay 240/240/720 mỗi người):')}</p>
${bang(
  [t('Core Screen', 'Màn hình lõi'), t('Complexity (LOC)', 'Độ phức tạp (LOC)'), t('Owner Slice', 'Miền sở hữu'), t('Iteration', 'Iteration'), t('Must-Have Unhappy Paths (Quality ≥ L2 = has unhappy paths; count confirmed with lecturer)', 'Nhánh lỗi bắt buộc (Quality ≥ L2 = có nhánh lỗi; số nhánh chốt cùng GV)')],
  [
    [t('<strong>S01</strong> Product Catalog &amp; Search/Filter', '<strong>S01</strong> Danh mục &amp; Tìm/Lọc sản phẩm'), 'M (120)', mu('C4', en), 'Iter 1', t('Empty result state, invalid price range (min &gt; max), SQL-safe sort allowlist, server paging', 'Trạng thái rỗng, khoảng giá sai (min &gt; max), allowlist cột sắp xếp, phân trang server')],
    [t('<strong>S04</strong> Seller Inventory &amp; Fulfillment Console', '<strong>S04</strong> Kho &amp; Xử lý đơn cho Người bán'), 'M (120) + M (120)', mu('C2', en), t('Iter 1 (SKU) → Iter 2 (Fulfill)', 'Iter 1 (SKU) → Iter 2 (Giao đơn)'), t('Cross-shop IDOR access → 403, illegal status jump (PAID → DELIVERED) → 409, negative stock edit → 400', 'Truy cập chéo shop khác → 403, nhảy cóc trạng thái → 409, nhập tồn kho âm → 400')],
    [t('<strong>S02</strong> Cart &amp; Atomic Checkout', '<strong>S02</strong> Giỏ hàng &amp; Checkout nguyên tử'), 'C (240)', mu('C1', en), 'Iter 2', t('Out-of-stock 409 mid-checkout, multi-shop checkout split, expired voucher, double-click idempotency', 'Hết hàng 409 giữa lúc thanh toán, tách đơn nhiều shop chung 1 checkout, mã giảm giá hết hạn, chống bấm đúp')],
    [t('<strong>S03</strong> Payment Webhook &amp; Order Tracker', '<strong>S03</strong> Webhook Thanh toán &amp; Theo dõi đơn'), 'C (240)', mu('C3', en), 'Iter 2', t('Forged HMAC signature → 401, duplicate webhook replay → idempotent 200, 15-min timeout auto-expire &amp; restock', 'Chữ ký HMAC giả → 401, gửi lặp webhook → xử lý idempotent 200, quá 15 phút tự hết hạn &amp; hoàn kho')],
    [t('<strong>S05</strong> Verified Reviews, Disputes &amp; Admin Panel', '<strong>S05</strong> Đánh giá, Khiếu nại &amp; Kiểm duyệt Admin'), 'C (240)', mu('C5', en), 'Iter 3', t('Review without DELIVERED order → 403, duplicate review → 409, dispute past 7 days → 400, audit log recorded', 'Đánh giá khi chưa nhận hàng → 403, đánh giá trùng → 409, khiếu nại quá 7 ngày → 400, ghi audit log')]
  ]
)}

${bang(
  [t('Iteration', 'Iteration'), t('Weeks', 'Tuần'), t('Spotlight &amp; Supporting Screens', 'Màn hình chính &amp; phần nền'), t('Planned LOC / Member vs MaxLOC (example)', 'Tổng LOC/người so với MaxLOC (ví dụ)'), t('Milestone Gate', 'Cổng mốc (Gate)')],
  [
    ['<strong>Iter 1</strong>', t('Weeks 1–3', 'Tuần 1–3'), t('WF0 Auth/RBAC + Common Layout + Shop Onboarding + <code>S01</code> Catalog/Search + <code>S04a</code> Seller Product/SKU CRUD', 'WF0 Đăng nhập/RBAC + Layout chung + Mở Shop + <code>S01</code> Danh mục/Tìm kiếm + <code>S04a</code> CRUD Sản phẩm/SKU'), t('~180–240 LOC/member (balanced 2–3 S/M screens each) vs Iter-1 MaxLOC <strong>180–240</strong>', '~180–240 LOC/người (cân đều 2–3 màn S/M mỗi người) so với MaxLOC Iter 1 <strong>180–240</strong>'), t('<strong>M1 (Week 3):</strong> SRS §1 + SDS §1–2, approved wireframes, WF0 + S01/SKU running, tag <code>iter1</code>', '<strong>M1 (Tuần 3):</strong> SRS §1 + SDS §1–2, wireframe duyệt, WF0 + S01/SKU chạy, tag <code>iter1</code>')],
    ['<strong>Iter 2</strong>', t('Weeks 4–8', 'Tuần 4–8'), t('<code>S02</code> Cart &amp; Atomic Checkout (multi-shop split) + <code>S03</code> HMAC Payment Webhook &amp; 15-min Expiry Job + <code>S04b</code> Seller Fulfillment &amp; State Machine', '<code>S02</code> Giỏ &amp; Checkout nguyên tử (tách đơn nhiều shop) + <code>S03</code> Webhook HMAC &amp; Job quá hạn 15p + <code>S04b</code> Xử lý đơn Seller'), t('~240 LOC/member core WF2 transactions (cumulative ~420–480) vs Iter-2 MaxLOC <strong>240</strong>', '~240 LOC/người luồng lõi WF2 (luỹ kế ~420–480) so với MaxLOC Iter 2 <strong>240</strong>'), t('<strong>M2 (Week 8):</strong> 50-thread overselling IT + HMAC webhook IT + 403/409 tests green, tag <code>iter2</code>', '<strong>M2 (Tuần 8):</strong> Test song song 50 luồng + test Webhook HMAC + test 403/409 xanh, tag <code>iter2</code>')],
    ['<strong>Iter 3</strong>', t('Weeks 9–10', 'Tuần 9–10'), t('<code>S05</code> Verified Reviews, Disputes &amp; Admin Moderation + Seller Revenue Dashboard + Outbox Email + 3 System Test rounds', '<code>S05</code> Đánh giá xác thực, Khiếu nại &amp; Admin + Dashboard doanh thu Seller + Outbox Email + 3 vòng System Test'), t('~240 LOC/member WF3 &amp; hardening → cumulative <strong>660–720</strong> vs Final MaxLOC <strong>660–720</strong>', '~240 LOC/người WF3 &amp; hoàn thiện → luỹ kế <strong>660–720</strong> so với MaxLOC cuối <strong>660–720</strong>'), t('<strong>M3 (Week 10):</strong> Deploy staging, UAT, 3-round ST, Final Release Doc, tag <code>iter3</code>', '<strong>M3 (Tuần 10):</strong> Deploy staging, UAT, 3 vòng ST, Final Release Doc, tag <code>iter3</code>')]
  ]
)}

<h4>${t('5. E-Commerce Specific Risks &amp; Hacker Attack Vectors (Day 6)', '5. Rủi ro đặc thù &amp; Góc Hacker trên Sàn TMĐT (Ngày 6)')} ${mu('C5', en)}</h4>
${cl('danger', `<p>${t(
    'E-commerce handles <strong>money, finite inventory, and competing sellers</strong> — making it one of the most heavily attacked domains on the web (categorized under <strong>OWASP API Security Top 10:2023 — API6 Unrestricted Access to Sensitive Business Flows</strong> and <strong>API1 BOLA/IDOR</strong>). Three classic attacks your QA hat MUST test before demo:',
    'Thương mại điện tử đụng trực tiếp tới <strong>tiền, tồn kho hữu hạn và nhiều người bán cạnh tranh nhau</strong> — biến nó thành một trong những lĩnh vực bị tấn công nhiều nhất trên web (xếp nhóm <strong>OWASP API Security Top 10:2023 — API6 Lạm dụng luồng nghiệp vụ nhạy cảm</strong> và <strong>API1 BOLA/IDOR</strong>). Ba đòn tấn công kinh điển mà mũ QA của bạn PHẢI kiểm trước khi demo:')}</p>
<ul>
<li>${t('<strong>Attack 1 — Client-Side Price &amp; Quantity Tampering:</strong> Attacker intercepts <code>POST /api/v1/orders</code> in DevTools/Burp Suite and changes <code>unitPrice: 15000000</code> to <code>1000</code> or <code>qty: -5</code>. <em>Defense:</em> Server ignores any price field from client, validates <code>qty &gt;= 1</code>, and queries authoritative prices from <code>skus</code> inside the transaction.', '<strong>Đòn 1 — Sửa giá &amp; số lượng âm từ client:</strong> Kẻ xấu chặn request <code>POST /api/v1/orders</code> bằng DevTools/Burp Suite rồi đổi <code>unitPrice: 15000000</code> thành <code>1000</code> hoặc <code>qty: -5</code>. <em>Phòng thủ:</em> Server bỏ qua mọi giá gửi từ client, kiểm <code>qty &gt;= 1</code> và đọc giá gốc từ bảng <code>skus</code> ngay trong transaction.')}</li>
<li>${t('<strong>Attack 2 — Flash-Sale Overselling (TOCTOU Race Condition):</strong> Attacker (or 50 real shoppers) fires parallel checkout requests for the last 1 item in stock. Naive <code>if (stock &gt;= 1)</code> sells 1 item to 12 people! <em>Defense:</em> Atomic conditional <code>UPDATE</code> + <code>CHECK (stock_qty &gt;= 0)</code> + 50-thread Testcontainers test.', '<strong>Đòn 2 — Chạy đua mua vượt tồn kho (TOCTOU Race Condition):</strong> Kẻ xấu (hoặc 50 khách thật) bắn request đặt hàng song song vào 1 món hàng cuối cùng. Kiểu viết ngây thơ <code>if (stock &gt;= 1)</code> bán 1 món cho 12 người! <em>Phòng thủ:</em> Câu <code>UPDATE</code> có điều kiện nguyên tử + <code>CHECK (stock_qty &gt;= 0)</code> + bài test 50 luồng với Testcontainers.')}</li>
<li>${t('<strong>Attack 3 — Forged / Replayed Payment Webhook &amp; Fake Reviews:</strong> Attacker posts a fake <code>{"checkoutId": 42, "status": "PAID"}</code> straight to your webhook URL, or submits 100 5-star reviews to boost a scam shop. <em>Defense:</em> Verify HMAC-SHA256 webhook signature using a shared secret, deduplicate by unique <code>provider_tx_id</code>, enforce <code>UNIQUE(order_item_id)</code> on <code>reviews</code> to block duplicate reviews, and verify the parent order belongs to the buyer and has status <code>DELIVERED</code> inside the service/transaction (or a DB trigger).', '<strong>Đòn 3 — Giả mạo / Phát lại Webhook thanh toán &amp; Seeding đánh giá giả:</strong> Kẻ xấu gửi thẳng gói <code>{"checkoutId": 42, "status": "PAID"}</code> giả vào URL webhook của bạn, hoặc bơm 100 đánh giá 5 sao cho shop lừa đảo. <em>Phòng thủ:</em> Kiểm chữ ký HMAC-SHA256 bằng khoá bí mật, chống trùng theo <code>provider_tx_id</code> duy nhất, đặt <code>UNIQUE(order_item_id)</code> trên bảng <code>reviews</code> để chống đánh giá trùng, còn điều kiện đơn hàng thuộc đúng người mua và đã <code>DELIVERED</code> kiểm ở tầng service/transaction (hoặc trigger).')}</li>
</ul>`)}

<h3>${t('1-to-1 Structural Mapping: Why Mastering LabFlow Unlocks E-Commerce Instantly', 'Đối chiếu 1-1: Vì sao làm chủ LabFlow giúp bạn làm chủ Sàn TMĐT ngay lập tức')}</h3>
${bang(
  [t('Engineering Pattern', 'Mẫu kỹ thuật'), t('In LabFlow AI (Lab Booking)', 'Ở LabFlow AI (Đặt phòng lab)'), t('In ShopFlow (E-Commerce Marketplace)', 'Ở ShopFlow (Sàn TMĐT nhiều người bán)')],
  [
    [t('<strong>Concurrency Invariant</strong>', '<strong>Ràng buộc đồng thời</strong>'), t('PostgreSQL <code>EXCLUDE USING gist</code> (requires <code>CREATE EXTENSION IF NOT EXISTS btree_gist;</code> in Flyway V1) prevents double-booking same lab/slot', '<code>EXCLUDE USING gist</code> trên PostgreSQL (cần <code>CREATE EXTENSION IF NOT EXISTS btree_gist;</code> ở Flyway V1) chặn đặt trùng ca phòng lab'), t('Atomic <code>UPDATE skus ... WHERE stock_qty &gt;= qty</code> + <code>CHECK &gt;= 0</code> prevents overselling', '<code>UPDATE skus ... WHERE stock_qty &gt;= qty</code> + <code>CHECK &gt;= 0</code> chặn bán âm kho')],
    [t('<strong>Idempotency &amp; Replay Guard</strong>', '<strong>Chống xử lý trùng / Replay</strong>'), t('One-time QR check-in token + Outbox <code>dedup_key</code>', 'Mã QR check-in dùng 1 lần + <code>dedup_key</code> trên bảng Outbox'), t('Payment webhook <code>provider_tx_id</code> UNIQUE + Checkout Idempotency-Key', 'Webhook thanh toán <code>provider_tx_id</code> UNIQUE + Idempotency-Key lúc checkout')],
    [t('<strong>State Machine</strong>', '<strong>Máy trạng thái</strong>'), t('Reservation, Loan, Maintenance ticket transitions (illegal → 409)', 'Chuyển trạng thái Đặt lịch, Mượn thiết bị, Bảo trì (sai luật → 409)'), t('Order, Payment, Shipment, Dispute transitions (illegal → 409)', 'Chuyển trạng thái Đơn hàng, Thanh toán, Giao vận, Khiếu nại (sai luật → 409)')],
    [t('<strong>Multi-Tenant / Scope Auth</strong>', '<strong>Phân quyền phạm vi</strong>'), t('Student sees own bookings; Lab Manager approves own campus labs', 'Sinh viên xem lịch của mình; Quản lý lab duyệt phòng thuộc cơ sở mình'), t('Buyer sees own orders; Seller edits only own <code>shop_id</code> SKUs &amp; sub-orders', 'Người mua xem đơn của mình; Seller chỉ sửa SKU &amp; đơn thuộc <code>shop_id</code> của mình')],
    [t('<strong>Background Timeout Job</strong>', '<strong>Job tự động quá hạn</strong>'), t('Auto-mark <code>NO_SHOW</code> &amp; promote Waitlist', 'Tự đánh <code>NO_SHOW</code> &amp; đôn người trong Waitlist'), t('Auto-cancel unpaid order after 15 min &amp; restore SKU stock', 'Tự huỷ đơn chưa thanh toán sau 15 phút &amp; hoàn tồn kho SKU')]
  ]
)}

${apDung([
  [t('Another topic pivot — Clinic Booking / EdTech / Car Rental', 'Đổi sang đề tài khác nữa — Phòng khám / EdTech / Thuê xe'), t('Run the exact same 7-Day Protocol: identify your #1 scarce resource (doctor slot, course seat, car license plate), lock its DB concurrency invariant on Day 3, and cut v1 non-essentials on Day 1.', 'Chạy đúng Giao thức 7 ngày này: tìm tài nguyên hữu hạn số 1 (ca khám bác sĩ, ghế lớp học, biển số xe), khoá ràng buộc đồng thời ở DB vào Ngày 3 và cắt phần phụ khỏi v1 ngay Ngày 1.')],
  [t('Real 5-person team (SEP490 Capstone topic rejection in Week 1)', 'Đồ án nhóm thật 5 người (SEP490 bị đổi đề tài ngay Tuần 1)'), t('Instead of panicking, divide Days 1–6 across all 5 members in parallel: M1 drafts Charter/Iterations, M2 drafts Use Cases/BR, M3 drafts ERD/Constraints, M4 sketches 5 wireframes, M5 drafts RAID &amp; Threat Model — your entire pivot pack finishes in 72 hours!', 'Thay vì hoảng, chia song song Ngày 1–6 cho 5 bạn: M1 viết Charter/Lịch, M2 viết Use Case/BR, M3 vẽ ERD/Ràng buộc, M4 phác 5 wireframe, M5 lập RAID &amp; Threat Model — cả bộ đổi đề tài xong gọn trong 72 giờ!')],
  [t('Large enterprise / outsourcing company (FPT Software Discovery Sprint)', 'Công ty lớn / dự án outsourcing (Discovery Sprint tại FPT Software)'), t('Enterprise teams call this exact 1-week exercise a <strong>Discovery / Inception Sprint</strong> (or Pre-Sales RFP Scoping): PM, BA, Solution Architect, and QA Lead produce Scope, High-Level ERD, WBS man-days, and Risk Register before signing the contract.', 'Ở doanh nghiệp, đúng tuần làm việc này gọi là <strong>Discovery / Inception Sprint</strong> (hoặc Scoping hồ sơ thầu RFP): PM, BA, Kiến trúc sư giải pháp và QA Lead chốt Phạm vi, ERD tổng quan, ước lượng man-day và Sổ rủi ro trước khi ký hợp đồng.')]
], en)}

${viecLabflow([
  [t('Compare your LabFlow AI <code>RAID</code> register and <code>requirements</code> page against the 1-to-1 ShopFlow mapping table above to confirm you understand the <em>underlying pattern</em> behind each LabFlow rule (not just memorized text).', 'Đối chiếu trang <code>RAID</code> và <code>requirements</code> của LabFlow AI với bảng ánh xạ 1-1 sang ShopFlow ở trên để chắc chắn bạn nắm <em>mẫu gốc</em> đằng sau từng luật của LabFlow chứ không học thuộc lòng.'), t('You can explain orally in 60 seconds how each of the 5 core LabFlow engineering patterns translates to an E-Commerce marketplace without opening notes.', 'Bạn nói trôi chảy trong 60 giây cách 5 mẫu kỹ thuật lõi của LabFlow chuyển sang sàn TMĐT mà không cần nhìn giấy.')],
  [t('Keep the 7-Day Topic Pivot checklist ready for ', 'Giữ sẵn bảng Giao thức Đổi đề tài 7 ngày để thực hành trực tiếp trên CT Work ở ') + dm('dm5-12-lab', 'Lab 12.6') + t(' and the timed ', ' và bài thi thực hành có giờ ở ') + dm('dm5-12-de-cuoi', 'Đề cuối khoá 12.7') + '.', t('Ready to stand up a brand-new project skeleton in CT Work inside one lab session.', 'Sẵn sàng dựng bộ khung dự án mới tinh trên CT Work trong một buổi lab.')]
], en)}

${phongVan([
  [t('"You built a Lab Booking system at university, but our company builds FinTech / E-Commerce. Won\'t you struggle with our domain?"', '"Ở trường em làm Đặt phòng lab, còn công ty anh làm FinTech / TMĐT. Em có bị bỡ ngỡ nghiệp vụ không?"'), t('Show structural pattern transfer immediately: "Domain nouns change, but core engineering invariants transfer 1-to-1: preventing double-booking a lab slot uses the exact same DB concurrency thinking as preventing overselling a SKU or double-spending a wallet; QR replay defense transfers directly to idempotent payment webhooks; and my 7-day discovery protocol lets me map new business rules and edge cases with BA/PO fast."', 'Chứng minh ngay khả năng chuyển giao mẫu gốc: "Danh từ nghiệp vụ đổi nhưng ràng buộc kỹ thuật lõi chuyển 1-1: chặn đặt trùng ca phòng lab dùng đúng tư duy đồng thời DB như chặn bán âm SKU hay chi trùng ví; chống quét lại QR chuyển thẳng sang webhook thanh toán idempotent; và quy trình 7 ngày giúp em nắm luật nghiệp vụ mới cùng BA/PO rất nhanh."')]
], en)}

${thuatNgu([
  ['Topic Pivot Protocol', t('7-day structured sequence (Charter → Use Cases/BR → Core ERD → 5 Screens → 3 Iterations → RAID/Threats → Q&amp;A) to stand up any new software project cleanly.', 'Quy trình 7 ngày có cấu trúc (Charter → Use Case/BR → ERD lõi → 5 màn → 3 Iteration → RAID/Đe doạ → Q&amp;A) để khởi động gọn bất kỳ dự án phần mềm mới nào.')],
  ['Atomic Stock Guard', t('Database-level conditional update (<code>WHERE stock_qty &gt;= qty</code>) paired with a non-negative <code>CHECK</code> constraint so concurrent checkouts can never oversell.', 'Câu cập nhật có điều kiện ở tầng CSDL (<code>WHERE stock_qty &gt;= qty</code>) kèm ràng buộc <code>CHECK</code> không âm để checkout đồng thời không bao giờ bán âm kho.')],
  ['Idempotent Webhook', t('Payment callback handler that verifies cryptographic signature (HMAC) and deduplicates by unique transaction ID so repeated deliveries never mark an order paid twice or ship twice.', 'Hàm nhận callback thanh toán có kiểm chữ ký mật mã (HMAC) và chống trùng theo mã giao dịch duy nhất để việc gửi lặp không bao giờ ghi nhận thanh toán hay giao hàng hai lần.')],
  ['TOCTOU (Time-of-Check to Time-of-Use)', t('Concurrency vulnerability where a resource state changes between checking it (<code>SELECT stock</code>) and acting on it (<code>UPDATE stock</code>).', 'Lỗ hổng đồng thời xảy ra khi trạng thái tài nguyên bị đổi ở khoảng trống giữa lúc kiểm tra (<code>SELECT stock</code>) và lúc cập nhật (<code>UPDATE stock</code>).')]
], en)}

${tomTat([
  t('If your lecturer or client changes the topic, <strong>most of your 5-hat process stays unchanged</strong> — run the 7-Day Topic Pivot Protocol instead of improvising.', 'Khi giảng viên hoặc khách hàng đổi đề tài, <strong>phần lớn quy trình 5 vai giữ nguyên</strong> — chạy Giao thức Đổi đề tài 7 ngày thay vì làm mò.'),
  t('On a Multi-Vendor Marketplace (ShopFlow), the heart of the system is <strong>atomic stock reservation</strong>, <strong>server-side price truth</strong>, <strong>idempotent HMAC payment webhooks</strong>, and <strong>shop-scoped authorization</strong>.', 'Trên Sàn TMĐT nhiều người bán (ShopFlow), trái tim hệ thống là <strong>trừ kho nguyên tử</strong>, <strong>giá chuẩn ở server</strong>, <strong>webhook thanh toán HMAC idempotent</strong> và <strong>phân quyền cô lập theo shop</strong>.'),
  t('Every major LabFlow pattern (exclusion constraint, QR idempotency, state machines, timeout jobs) maps 1-to-1 onto e-commerce and enterprise transaction systems.', 'Mọi mẫu lõi của LabFlow (ràng buộc loại trừ, chống trùng QR, máy trạng thái, job quá hạn) đều ánh xạ 1-1 sang sàn TMĐT và các hệ thống giao dịch doanh nghiệp.')
], en)}

<p>${t('Cross-references: ', 'Đọc thêm: ')}${ac('software-requirements', 'swr302-assignment-tp2', 'SWR302 A.3 — Đề tài mẫu Quản lý đơn hàng TMĐT (OMFS)')} · ${ac('software-requirements', 'swr302-bai-mau-assignment-omfs', 'SWR302 — Bộ tài liệu mẫu OMFS 9,6 điểm')} · ${cs('api-design', 'api-1-2-phuong-thuc', 'API Design 1.2 — Idempotent & phương thức HTTP')} · ${dm('dm5-10-2-bao-mat-api', '10.2 — Bảo mật API tối thiểu')} · ${lf('Trái tim hệ thống: chống đặt trùng — LabFlow AI')}. ${t('Next: ', 'Bài tiếp: ')}${dm('dm5-12-4-quy-mo-doanh-nghiep', t('12.4 — Scaling to Enterprise (20–100 People): Roles, CMMI, Environments, Release & On-Call', '12.4 — Lên quy mô doanh nghiệp: dự án 20–100 người khác đồ án thế nào'))}.</p>
`);
};

export default {
  title: '12.3 — Switching Topics in One Week: Full Worked Playbook on a Multi-Vendor E-Commerce Marketplace|||12.3 — Đổi đề tài trong 1 tuần: áp trọn quy trình sang Sàn thương mại điện tử',
  slug: 'dm5-12-3-doi-de-tai-tmdt',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Giao thức Đổi đề tài 7 ngày tổng quát và bài làm mẫu trọn vẹn trên Sàn thương mại điện tử nhiều người bán (ShopFlow): Charter/MoSCoW, Actor/Use Case/BR, ERD lõi + chống bán âm + webhook idempotent, 5 màn lõi, lộ trình 3 iteration, góc hacker TMĐT và bảng ánh xạ 1-1 với LabFlow AI.',
  content: L123(true) + L123(false),
};
