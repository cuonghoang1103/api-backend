/**
 * SCM202 — Nhập môn Quản lý Logistics và chuỗi cung ứng (Introduction to Logistics and Supply
 * Chain Management). Khối Quản trị Kinh doanh, kỳ 2.
 * Bám cấu trúc giáo trình chuẩn quốc tế: Martin Christopher — Logistics & Supply Chain Management;
 * Chopra & Meindl — Supply Chain Management: Strategy, Planning, and Operation; Coyle et al. —
 * Supply Chain Management: A Logistics Perspective. Nền tảng, mục tiêu & SCOR, chiến lược (Fisher,
 * đẩy/kéo, điểm tách, hiệu ứng roi da), tồn kho (EOQ, ROP, tồn kho an toàn, ABC), vận tải &
 * Incoterms 2020, kho bãi, cross-docking, 3PL/4PL, mua hàng, đo lường (fill rate, OTIF, vòng quay,
 * cash-to-cash), chuỗi cung ứng số & bền vững. Song ngữ + ví dụ (số đã kiểm bằng script; tình
 * huống là GIẢ ĐỊNH, không có số liệu ngành thật) + bài tập có lời giải + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('scm202-0-1-overview', 'Course overview: what logistics and supply chains are|||Tổng quan: logistics và chuỗi cung ứng là gì',
  'Định nghĩa logistics, quản trị chuỗi cung ứng và chuỗi cung ứng, thặng dư chuỗi cung ứng, ba dòng chảy (hàng, thông tin, tiền), các hoạt động logistics chính, nguyên tắc 7 đúng, lộ trình môn.',
  [[
    `<span class="eyebrow">SCM202 · Lesson 0.1 · Overview</span>
<h2>Introduction to Logistics and Supply Chain Management</h2>
<p class="lead">Every product you buy — a bottle of fish sauce, a phone, a T-shirt ordered online — reaches you through a chain of companies that source materials, make, store, move and sell it. <strong>Logistics</strong> and <strong>supply chain management (SCM)</strong> are about managing that chain so that customers get what they want, when and where they want it, at the lowest total cost.</p>
<h3>Logistics, supply chains and supply chain management</h3>
<ul>
<li><strong>Logistics</strong> is the part of supply chain management that plans, implements and controls the efficient, effective forward and reverse flow and storage of goods, services and related information between the point of origin and the point of consumption, in order to meet customer requirements (a paraphrase of the widely used definition by CSCMP, the Council of Supply Chain Management Professionals).</li>
<li><strong>Supply chain management</strong> is broader: it manages upstream and downstream <em>relationships</em> with suppliers and customers in order to deliver superior customer value at less cost to the supply chain as a whole (Christopher). It includes logistics, but also sourcing, production planning, coordination of product design and collaboration between firms.</li>
<li>A <strong>supply chain</strong> consists of all parties involved, directly or indirectly, in fulfilling a customer request — suppliers, manufacturers, distributors, retailers, service providers such as carriers and warehouses, and the customer (Chopra &amp; Meindl).</li>
</ul>
<p>Chopra &amp; Meindl express the goal as maximizing the <strong>supply chain surplus</strong>: the value of the final product to the customer minus the total cost the whole chain incurs to deliver it. Because that surplus is shared among the members, a supply chain succeeds or fails together — competition is increasingly between supply chains, not only between individual companies.</p>
<h3>The three flows</h3>
<table>
<tr><th>Flow</th><th>Direction</th><th>Examples</th></tr>
<tr><td>Products / materials</td><td>Mainly downstream (supplier → customer); also upstream as returns, repairs and recycling (<strong>reverse logistics</strong>)</td><td>Raw materials, components, finished goods, returned items</td></tr>
<tr><td>Information</td><td>Both directions</td><td>Orders, forecasts, point-of-sale (POS) data, inventory levels, shipment status, invoices</td></tr>
<tr><td>Funds (money)</td><td>Mainly upstream (customer → supplier)</td><td>Payments, credit terms, refunds</td></tr>
</table>
<pre><code class="language-text">Tier-2 supplier → Tier-1 supplier → Manufacturer → Distributor → Retailer → Customer

Products:     ───────────────────────────────────────►   (returns ◄── reverse logistics)
Information:  ◄──────────────────────────────────────►   (orders, forecasts, POS data)
Funds:        ◄───────────────────────────────────────   (payments)</code></pre>
<h3>Key logistics activities</h3>
<p>Customer service, order processing, demand forecasting, inventory management, transportation, warehousing and materials handling, packaging, procurement, facility location and reverse logistics. These activities are interdependent: a decision in one area changes the costs of the others.</p>
<h3>What "good" looks like — the 7 Rs</h3>
<p>Logistics aims to deliver the <strong>right product</strong>, in the <strong>right quantity</strong>, in the <strong>right condition</strong>, to the <strong>right place</strong>, at the <strong>right time</strong>, to the <strong>right customer</strong>, at the <strong>right cost</strong>.</p>
<h3>Roadmap</h3>
<p>Part 1: objectives, the SCOR model, supply chain strategy and the bullwhip effect · Part 2: inventory management (EOQ, reorder point, safety stock, ABC) · Part 3: transportation and Incoterms 2020 · Part 4: warehousing, 3PL/4PL, purchasing, performance measurement, digital and sustainable supply chains. Each part ends with a quiz; Parts 2, 3 and 4 include worked exercises.</p>
<div class="callout"><span class="badge">Mindset</span> Think in systems, not departments. Cutting transport cost by shipping less often may look good for the transport manager — and raise inventory cost by more than it saves.</div>`,
    `<span class="eyebrow">SCM202 · Bài 0.1 · Tổng quan</span>
<h2>Nhập môn Quản lý Logistics và chuỗi cung ứng</h2>
<p class="lead">Mọi sản phẩm bạn mua — một chai nước mắm, một chiếc điện thoại, một chiếc áo đặt trên mạng — đến tay bạn qua một chuỗi doanh nghiệp tìm nguồn nguyên liệu, sản xuất, lưu kho, vận chuyển và bán nó. <strong>Logistics</strong> và <strong>quản trị chuỗi cung ứng (SCM)</strong> là việc quản lý chuỗi đó sao cho khách hàng nhận được thứ họ muốn, đúng lúc và đúng nơi họ cần, với tổng chi phí thấp nhất.</p>
<h3>Logistics, chuỗi cung ứng và quản trị chuỗi cung ứng</h3>
<ul>
<li><strong>Logistics</strong> là một phần của quản trị chuỗi cung ứng, có nhiệm vụ hoạch định, thực hiện và kiểm soát một cách hiệu quả và hữu hiệu dòng di chuyển xuôi, dòng di chuyển ngược và việc lưu trữ hàng hoá, dịch vụ cùng thông tin liên quan từ điểm xuất phát tới điểm tiêu dùng, nhằm đáp ứng yêu cầu của khách hàng (diễn giải định nghĩa phổ biến của CSCMP — Hội đồng các Chuyên gia Quản trị Chuỗi cung ứng).</li>
<li><strong>Quản trị chuỗi cung ứng</strong> rộng hơn: quản lý các <em>mối quan hệ</em> phía thượng nguồn và hạ nguồn với nhà cung cấp và khách hàng để mang lại giá trị vượt trội cho khách hàng với chi phí thấp hơn cho toàn chuỗi (Christopher). Nó bao gồm logistics, cộng thêm tìm nguồn cung, hoạch định sản xuất, phối hợp thiết kế sản phẩm và hợp tác giữa các doanh nghiệp.</li>
<li><strong>Chuỗi cung ứng</strong> gồm mọi bên tham gia, trực tiếp hay gián tiếp, vào việc đáp ứng một yêu cầu của khách hàng — nhà cung cấp, nhà sản xuất, nhà phân phối, nhà bán lẻ, các nhà cung cấp dịch vụ như hãng vận tải và kho bãi, và chính khách hàng (Chopra &amp; Meindl).</li>
</ul>
<p>Chopra &amp; Meindl diễn đạt mục tiêu là tối đa hoá <strong>thặng dư chuỗi cung ứng</strong>: giá trị của sản phẩm cuối cùng đối với khách hàng trừ đi tổng chi phí mà cả chuỗi bỏ ra để đưa sản phẩm tới tay họ. Vì thặng dư đó được chia giữa các thành viên, cả chuỗi cùng thành công hoặc cùng thất bại — cạnh tranh ngày càng diễn ra giữa các chuỗi cung ứng chứ không chỉ giữa từng doanh nghiệp.</p>
<h3>Ba dòng chảy</h3>
<table>
<tr><th>Dòng chảy</th><th>Chiều</th><th>Ví dụ</th></tr>
<tr><td>Hàng hoá / vật tư</td><td>Chủ yếu xuôi dòng (nhà cung cấp → khách hàng); cũng đi ngược dòng khi trả hàng, sửa chữa và tái chế (<strong>logistics ngược</strong>)</td><td>Nguyên liệu, linh kiện, thành phẩm, hàng bị trả lại</td></tr>
<tr><td>Thông tin</td><td>Cả hai chiều</td><td>Đơn hàng, dự báo, dữ liệu điểm bán (POS), mức tồn kho, trạng thái lô hàng, hoá đơn</td></tr>
<tr><td>Tiền</td><td>Chủ yếu ngược dòng (khách hàng → nhà cung cấp)</td><td>Thanh toán, điều khoản tín dụng, hoàn tiền</td></tr>
</table>
<pre><code class="language-text">NCC cấp 2 → NCC cấp 1 → Nhà sản xuất → Nhà phân phối → Nhà bán lẻ → Khách hàng

Hàng hoá:     ───────────────────────────────────────►   (hàng trả lại ◄── logistics ngược)
Thông tin:    ◄──────────────────────────────────────►   (đơn hàng, dự báo, dữ liệu POS)
Tiền:         ◄───────────────────────────────────────   (thanh toán)

(NCC = nhà cung cấp)</code></pre>
<h3>Các hoạt động logistics chính</h3>
<p>Dịch vụ khách hàng, xử lý đơn hàng, dự báo nhu cầu, quản lý tồn kho, vận tải, kho bãi và bốc xếp, đóng gói, mua hàng, chọn địa điểm cơ sở và logistics ngược. Các hoạt động này phụ thuộc lẫn nhau: một quyết định ở khâu này làm thay đổi chi phí ở các khâu khác.</p>
<h3>Thế nào là "làm tốt" — nguyên tắc 7 đúng</h3>
<p>Logistics hướng tới giao <strong>đúng sản phẩm</strong>, <strong>đúng số lượng</strong>, <strong>đúng tình trạng</strong>, <strong>đúng địa điểm</strong>, <strong>đúng thời gian</strong>, <strong>đúng khách hàng</strong>, với <strong>đúng chi phí</strong>.</p>
<h3>Lộ trình</h3>
<p>Phần 1: mục tiêu, mô hình SCOR, chiến lược chuỗi cung ứng và hiệu ứng roi da · Phần 2: quản lý tồn kho (EOQ, điểm đặt hàng lại, tồn kho an toàn, ABC) · Phần 3: vận tải và Incoterms 2020 · Phần 4: kho bãi, 3PL/4PL, mua hàng, đo lường hiệu quả, chuỗi cung ứng số và bền vững. Mỗi phần kết thúc bằng một bài quiz; phần 2, 3 và 4 có bài tập kèm lời giải.</p>
<div class="callout"><span class="badge">Tư duy</span> Nghĩ theo hệ thống, không theo phòng ban. Giảm chi phí vận tải bằng cách giao hàng thưa hơn có thể làm đẹp số liệu của trưởng bộ phận vận tải — nhưng lại làm chi phí tồn kho tăng nhiều hơn phần tiết kiệm được.</div>`,
  ]]);

const c1 = doc('scm202-1-1-objectives-scor', '1.1 — Objectives, trade-offs & the SCOR model|||1.1 — Mục tiêu, đánh đổi & mô hình SCOR',
  'Ba giai đoạn dịch vụ khách hàng, đơn hàng hoàn hảo, đánh đổi giữa mức phục vụ và chi phí (khái niệm tổng chi phí), lợi thế chi phí và lợi thế giá trị, ba cấp quyết định, mô hình SCOR (Plan, Source, Make, Deliver, Return, Enable), các cấp và thuộc tính hiệu quả.',
  [[
    `<span class="eyebrow">SCM202 · Part 1 · Lesson 1.1</span>
<h2>Objectives, trade-offs &amp; the SCOR model</h2>
<h3>Customer service: the output of logistics</h3>
<p>Customer service is usually described in three stages:</p>
<ul>
<li><strong>Pre-transaction</strong> — written service policies, accessibility, organization structure, system flexibility.</li>
<li><strong>Transaction</strong> — order cycle time, stock availability, order fill rate, order status information, delivery reliability.</li>
<li><strong>Post-transaction</strong> — installation, warranty, handling complaints and returns, spare parts availability.</li>
</ul>
<p>A demanding single measure is the <strong>perfect order</strong>: an order delivered <em>complete</em>, <em>on time</em>, to the <em>right place</em>, in <em>perfect condition</em> and with <em>correct documentation and invoice</em>. If any element fails, the order is not perfect — which is why perfect-order rates are usually much lower than each individual metric.</p>
<pre><code class="language-text">Illustrative numbers (assuming the four failures are independent):
On time 95% × In full 96% × Undamaged 99% × Correct documents 98%
= 0.95 × 0.96 × 0.99 × 0.98 = 0.8848 → only about 88.5% of orders are perfect</code></pre>
<h3>Service vs cost: the total cost concept</h3>
<p>Higher service usually costs more, and the relationship is not linear: raising stock availability from 95% to 99% needs far more safety stock than raising it from 85% to 89%. Logistics therefore manages <strong>trade-offs</strong> and judges each decision by its effect on <strong>total cost</strong> for a given service level, not by a single cost line.</p>
<table>
<tr><th>Decision</th><th>Cost that falls</th><th>Cost that rises</th></tr>
<tr><td>Ship in full truckloads, less often</td><td>Transport cost per unit</td><td>Inventory holding cost (bigger batches)</td></tr>
<tr><td>Fewer, larger warehouses</td><td>Facility cost, total safety stock</td><td>Outbound transport cost, delivery time to customers</td></tr>
<tr><td>Switch from sea to air freight</td><td>Pipeline inventory, lead time</td><td>Freight cost</td></tr>
<tr><td>Cheaper packaging</td><td>Packaging cost</td><td>Damage, returns, customer dissatisfaction</td></tr>
</table>
<h3>Competitive advantage through logistics</h3>
<p>Christopher describes two sources of advantage: a <strong>cost advantage</strong> (a lower-cost position through productivity, scale and efficient processes) and a <strong>value advantage</strong> (an offer customers value more, often through service — reliability, speed, flexibility). The strongest positions combine both.</p>
<h3>Three levels of supply chain decisions</h3>
<p>Chopra &amp; Meindl distinguish <strong>strategy or design</strong> decisions (years: where to locate plants and warehouses, what to make or outsource, which transport modes to use), <strong>planning</strong> decisions (a quarter to a year: which markets each facility serves, inventory policies, timing of promotions) and <strong>operation</strong> decisions (weekly or daily: allocating orders, picking, loading, scheduling deliveries). Each level works within the limits set by the one above.</p>
<h3>The SCOR model</h3>
<p>The <strong>Supply Chain Operations Reference (SCOR)</strong> model, created by the Supply Chain Council and now maintained by ASCM (the Association for Supply Chain Management), gives companies a common language for describing, measuring and improving supply chains. Its classic version organizes every chain into six management processes:</p>
<table>
<tr><th>Process</th><th>What it covers</th></tr>
<tr><td><strong>Plan</strong></td><td>Balancing demand and supply; planning the whole chain as well as sourcing, making, delivering and returning</td></tr>
<tr><td><strong>Source</strong></td><td>Ordering, receiving, verifying and paying for goods and services; managing suppliers</td></tr>
<tr><td><strong>Make</strong></td><td>Transforming materials into finished products (make-to-stock, make-to-order, engineer-to-order)</td></tr>
<tr><td><strong>Deliver</strong></td><td>Order management, warehousing, transportation and installation for customers</td></tr>
<tr><td><strong>Return</strong></td><td>Returning defective, excess or MRO products — both from customers and to suppliers</td></tr>
<tr><td><strong>Enable</strong></td><td>Managing the chain itself: business rules, performance, data, resources, contracts, compliance and risk</td></tr>
</table>
<p>The model works at levels of increasing detail: <strong>level 1</strong> defines the scope (the six processes), <strong>level 2</strong> the configuration (for example Make-to-Stock vs Make-to-Order), <strong>level 3</strong> the process elements (steps, inputs, outputs, metrics); company-specific practices sit below that. Performance is measured on five attributes: <strong>reliability</strong>, <strong>responsiveness</strong> and <strong>agility</strong> (customer-facing), <strong>cost</strong> and <strong>asset management efficiency</strong> (internal-facing) — for example perfect order fulfilment, order fulfilment cycle time and cash-to-cash cycle time.</p>
<div class="callout"><span class="badge">Note</span> ASCM has since released a digital version of the model (SCOR DS) that regroups the processes. Most introductory textbooks — and this course — still teach the classic six, which remain the clearest way to map a chain.</div>`,
    `<span class="eyebrow">SCM202 · Phần 1 · Bài 1.1</span>
<h2>Mục tiêu, đánh đổi &amp; mô hình SCOR</h2>
<h3>Dịch vụ khách hàng: đầu ra của logistics</h3>
<p>Dịch vụ khách hàng thường được mô tả theo ba giai đoạn:</p>
<ul>
<li><strong>Trước giao dịch</strong> — chính sách dịch vụ bằng văn bản, khả năng liên hệ, cơ cấu tổ chức, tính linh hoạt của hệ thống.</li>
<li><strong>Trong giao dịch</strong> — thời gian chu kỳ đặt hàng, mức sẵn có của hàng, tỷ lệ đáp ứng đơn hàng, thông tin trạng thái đơn, độ tin cậy khi giao.</li>
<li><strong>Sau giao dịch</strong> — lắp đặt, bảo hành, xử lý khiếu nại và hàng trả lại, sẵn có phụ tùng thay thế.</li>
</ul>
<p>Một thước đo tổng hợp khắt khe là <strong>đơn hàng hoàn hảo</strong>: đơn được giao <em>đủ</em>, <em>đúng hạn</em>, <em>đúng địa điểm</em>, <em>nguyên vẹn</em> và có <em>chứng từ, hoá đơn chính xác</em>. Chỉ cần một yếu tố hỏng là đơn không còn hoàn hảo — vì thế tỷ lệ đơn hàng hoàn hảo thường thấp hơn nhiều so với từng chỉ số riêng lẻ.</p>
<pre><code class="language-text">Số liệu minh hoạ giả định (giả sử bốn loại lỗi độc lập với nhau):
Đúng hạn 95% × Đủ hàng 96% × Không hư hỏng 99% × Chứng từ đúng 98%
= 0,95 × 0,96 × 0,99 × 0,98 = 0,8848 → chỉ khoảng 88,5% số đơn là hoàn hảo</code></pre>
<h3>Mức phục vụ và chi phí: khái niệm tổng chi phí</h3>
<p>Mức phục vụ cao hơn thường tốn kém hơn, và quan hệ này không tuyến tính: nâng mức sẵn có của hàng từ 95% lên 99% cần nhiều tồn kho an toàn hơn hẳn so với nâng từ 85% lên 89%. Vì vậy logistics quản lý các <strong>đánh đổi</strong> và đánh giá mỗi quyết định theo ảnh hưởng tới <strong>tổng chi phí</strong> ở một mức phục vụ cho trước, chứ không theo một khoản chi phí đơn lẻ.</p>
<table>
<tr><th>Quyết định</th><th>Chi phí giảm</th><th>Chi phí tăng</th></tr>
<tr><td>Chở nguyên xe, giao thưa hơn</td><td>Chi phí vận tải trên mỗi đơn vị</td><td>Chi phí lưu kho (lô hàng lớn hơn)</td></tr>
<tr><td>Ít kho hơn nhưng kho lớn hơn</td><td>Chi phí cơ sở, tổng tồn kho an toàn</td><td>Chi phí vận tải đi giao, thời gian giao tới khách</td></tr>
<tr><td>Chuyển từ đường biển sang đường hàng không</td><td>Tồn kho trên đường, thời gian chờ hàng</td><td>Cước vận chuyển</td></tr>
<tr><td>Bao bì rẻ hơn</td><td>Chi phí bao bì</td><td>Hư hỏng, hàng trả lại, khách hàng không hài lòng</td></tr>
</table>
<h3>Lợi thế cạnh tranh nhờ logistics</h3>
<p>Christopher mô tả hai nguồn lợi thế: <strong>lợi thế chi phí</strong> (vị thế chi phí thấp hơn nhờ năng suất, quy mô và quy trình hiệu quả) và <strong>lợi thế giá trị</strong> (một sản phẩm chào bán được khách hàng đánh giá cao hơn, thường nhờ dịch vụ — tin cậy, nhanh, linh hoạt). Vị thế mạnh nhất kết hợp được cả hai.</p>
<h3>Ba cấp quyết định trong chuỗi cung ứng</h3>
<p>Chopra &amp; Meindl phân biệt quyết định <strong>chiến lược hay thiết kế</strong> (tính bằng năm: đặt nhà máy và kho ở đâu, tự làm hay thuê ngoài khâu nào, dùng phương thức vận tải nào), quyết định <strong>hoạch định</strong> (từ một quý tới một năm: cơ sở nào phục vụ thị trường nào, chính sách tồn kho, thời điểm khuyến mại) và quyết định <strong>vận hành</strong> (hằng tuần hay hằng ngày: phân bổ đơn hàng, lấy hàng, xếp hàng lên xe, lập lịch giao). Mỗi cấp vận hành trong giới hạn do cấp trên đặt ra.</p>
<h3>Mô hình SCOR</h3>
<p><strong>Mô hình tham chiếu hoạt động chuỗi cung ứng (SCOR)</strong>, do Hội đồng Chuỗi cung ứng (Supply Chain Council) xây dựng và nay do ASCM (Hiệp hội Quản trị Chuỗi cung ứng) duy trì, cho doanh nghiệp một ngôn ngữ chung để mô tả, đo lường và cải tiến chuỗi cung ứng. Phiên bản kinh điển tổ chức mọi chuỗi thành sáu quy trình quản lý:</p>
<table>
<tr><th>Quy trình</th><th>Bao gồm</th></tr>
<tr><td><strong>Plan</strong> (Hoạch định)</td><td>Cân bằng cung và cầu; hoạch định cho toàn chuỗi cũng như cho các khâu mua, sản xuất, giao và trả hàng</td></tr>
<tr><td><strong>Source</strong> (Tìm nguồn / Mua)</td><td>Đặt hàng, nhận hàng, kiểm tra và thanh toán cho hàng hoá, dịch vụ; quản lý nhà cung cấp</td></tr>
<tr><td><strong>Make</strong> (Sản xuất)</td><td>Chuyển nguyên vật liệu thành thành phẩm (sản xuất để dự trữ, sản xuất theo đơn, thiết kế theo đơn)</td></tr>
<tr><td><strong>Deliver</strong> (Giao hàng)</td><td>Quản lý đơn hàng, kho bãi, vận tải và lắp đặt cho khách hàng</td></tr>
<tr><td><strong>Return</strong> (Trả hàng)</td><td>Trả lại sản phẩm lỗi, dư thừa hoặc vật tư MRO — cả từ khách hàng về lẫn trả cho nhà cung cấp</td></tr>
<tr><td><strong>Enable</strong> (Hỗ trợ)</td><td>Quản lý chính chuỗi cung ứng: quy tắc kinh doanh, hiệu quả, dữ liệu, nguồn lực, hợp đồng, tuân thủ và rủi ro</td></tr>
</table>
<p>Mô hình có các cấp chi tiết tăng dần: <strong>cấp 1</strong> xác định phạm vi (sáu quy trình), <strong>cấp 2</strong> xác định cấu hình (ví dụ sản xuất để dự trữ hay sản xuất theo đơn), <strong>cấp 3</strong> xác định các phần tử quy trình (các bước, đầu vào, đầu ra, chỉ số); thực hành riêng của từng doanh nghiệp nằm ở dưới nữa. Hiệu quả được đo theo năm thuộc tính: <strong>độ tin cậy</strong>, <strong>khả năng đáp ứng</strong> và <strong>tính nhanh nhạy (agility)</strong> (hướng tới khách hàng), <strong>chi phí</strong> và <strong>hiệu quả quản lý tài sản</strong> (hướng nội bộ) — ví dụ tỷ lệ hoàn thành đơn hàng hoàn hảo, thời gian chu kỳ hoàn thành đơn hàng và chu kỳ tiền mặt (cash-to-cash).</p>
<div class="callout"><span class="badge">Ghi chú</span> ASCM sau này đã phát hành một phiên bản số của mô hình (SCOR DS) sắp xếp lại các quy trình. Phần lớn giáo trình nhập môn — và môn học này — vẫn dạy sáu quy trình kinh điển, vì đó vẫn là cách rõ ràng nhất để vẽ bản đồ một chuỗi cung ứng.</div>`,
  ]]);

const c2 = doc('scm202-1-2-strategy', '1.2 — Supply chain strategy: efficient vs responsive, push vs pull|||1.2 — Chiến lược chuỗi cung ứng: hiệu quả hay đáp ứng nhanh, đẩy hay kéo',
  'Khung của Fisher (sản phẩm chức năng – sản phẩm đổi mới, chuỗi hiệu quả – chuỗi đáp ứng nhanh), sự phù hợp chiến lược theo Chopra & Meindl, quy trình đẩy và kéo, điểm tách đơn hàng khách hàng (MTS, ATO, MTO, ETO), tinh gọn và nhanh nhạy, chiến lược trì hoãn.',
  [[
    `<span class="eyebrow">SCM202 · Part 1 · Lesson 1.2</span>
<h2>Supply chain strategy: efficient vs responsive, push vs pull</h2>
<p class="lead">There is no single "best" supply chain. The right design depends on the product and on the customers it serves.</p>
<h3>Fisher's framework</h3>
<p>Marshall Fisher (1997) classifies products by their demand pattern:</p>
<table>
<tr><th></th><th>Functional products</th><th>Innovative products</th></tr>
<tr><td>Demand</td><td>Stable, predictable</td><td>Unpredictable</td></tr>
<tr><td>Product life cycle</td><td>Long</td><td>Short (often months)</td></tr>
<tr><td>Contribution margin</td><td>Low</td><td>High</td></tr>
<tr><td>Product variety</td><td>Low</td><td>High (many variants)</td></tr>
<tr><td>Forecast error, stockouts, end-of-season markdowns</td><td>Low</td><td>High</td></tr>
<tr><td>Illustrations</td><td>Rice, detergent, basic white T-shirts</td><td>Fashion apparel, a new smartphone model, seasonal toys</td></tr>
</table>
<p>Functional products need a <strong>physically efficient</strong> supply chain: minimize cost, keep utilization high and inventory low, choose suppliers mainly on cost and quality. Innovative products need a <strong>market-responsive</strong> supply chain: react quickly to uncertain demand, keep buffer capacity and strategic stock, cut lead times, choose suppliers on speed and flexibility. A mismatch destroys value — an efficient chain for an innovative product causes stockouts and markdowns; a responsive (costly) chain for a functional product adds cost the market will not pay for.</p>
<h3>Strategic fit</h3>
<p>Chopra &amp; Meindl generalize the idea as <strong>strategic fit</strong>, in three steps: (1) understand the customer and the <em>implied demand uncertainty</em> — the uncertainty created by the part of demand the chain is asked to satisfy (quantity per order, response time, variety, service level, rate of innovation, price); (2) understand the chain's capabilities on a spectrum from <em>efficient</em> to <em>responsive</em>; (3) match them — the higher the implied uncertainty, the more responsive the chain should be.</p>
<h3>Push vs pull and the decoupling point</h3>
<p>In a <strong>push</strong> process, execution starts in anticipation of orders, based on forecasts. In a <strong>pull</strong> process, execution starts in response to an actual customer order. Most chains are push–pull: upstream steps are pushed by forecasts, downstream steps are pulled by orders. The boundary is the <strong>push–pull boundary</strong>, closely related to the <strong>customer order decoupling point (CODP)</strong> — the point where a specific customer order first enters the flow and where strategic stock is usually held.</p>
<table>
<tr><th>Where stock waits for the order</th><th>Strategy</th><th>Illustration</th></tr>
<tr><td>Finished goods at the retailer or DC</td><td>Make-to-stock (MTS)</td><td>Bottled water, instant noodles</td></tr>
<tr><td>Components / modules</td><td>Assemble-to-order (ATO)</td><td>A laptop configured online</td></tr>
<tr><td>Raw materials</td><td>Make-to-order (MTO)</td><td>Custom furniture, a tailored suit</td></tr>
<tr><td>Nothing specific — design starts with the order</td><td>Engineer-to-order (ETO)</td><td>A ship, an industrial plant</td></tr>
</table>
<p>Upstream of the decoupling point, demand is aggregated and more stable, so <strong>lean</strong> (efficient, waste-reducing) principles fit; downstream, demand is specific and variable, so <strong>agile</strong> (fast, flexible) principles fit — a combination sometimes called "leagile". The further downstream the decoupling point, the shorter the customer's waiting time, but the more finished inventory the chain must carry.</p>
<h3>Postponement</h3>
<p><strong>Postponement</strong> delays the final configuration or the movement of a product until real demand is known: <em>form</em> postponement (paint tinted in the store to the colour the customer picks; a generic product labelled and packed for a specific market at a regional DC) or <em>time and place</em> postponement (keeping stock centrally and shipping only when orders arrive). One generic stock can then serve many variants, which reduces forecast error and inventory.</p>
<div class="callout"><span class="badge">Key idea</span> Match the chain to the product — efficiency where demand is predictable, responsiveness where it is not — and push the uncertain, customer-specific part of the process as late as possible.</div>`,
    `<span class="eyebrow">SCM202 · Phần 1 · Bài 1.2</span>
<h2>Chiến lược chuỗi cung ứng: hiệu quả hay đáp ứng nhanh, đẩy hay kéo</h2>
<p class="lead">Không có một chuỗi cung ứng "tốt nhất" cho mọi trường hợp. Thiết kế đúng tuỳ thuộc vào sản phẩm và vào khách hàng mà chuỗi phục vụ.</p>
<h3>Khung của Fisher</h3>
<p>Marshall Fisher (1997) phân loại sản phẩm theo đặc điểm nhu cầu:</p>
<table>
<tr><th></th><th>Sản phẩm chức năng</th><th>Sản phẩm đổi mới</th></tr>
<tr><td>Nhu cầu</td><td>Ổn định, dự đoán được</td><td>Khó dự đoán</td></tr>
<tr><td>Vòng đời sản phẩm</td><td>Dài</td><td>Ngắn (thường tính bằng tháng)</td></tr>
<tr><td>Tỷ suất lãi góp</td><td>Thấp</td><td>Cao</td></tr>
<tr><td>Mức đa dạng sản phẩm</td><td>Thấp</td><td>Cao (nhiều biến thể)</td></tr>
<tr><td>Sai số dự báo, hết hàng, giảm giá xả hàng cuối mùa</td><td>Thấp</td><td>Cao</td></tr>
<tr><td>Minh hoạ</td><td>Gạo, bột giặt, áo phông trắng cơ bản</td><td>Thời trang, mẫu điện thoại mới, đồ chơi theo mùa</td></tr>
</table>
<p>Sản phẩm chức năng cần một chuỗi cung ứng <strong>hiệu quả về mặt vật chất</strong>: tối thiểu hoá chi phí, giữ hiệu suất sử dụng cao và tồn kho thấp, chọn nhà cung cấp chủ yếu theo chi phí và chất lượng. Sản phẩm đổi mới cần một chuỗi cung ứng <strong>đáp ứng nhanh thị trường</strong>: phản ứng nhanh với nhu cầu bất định, giữ công suất dự phòng và tồn kho chiến lược, rút ngắn thời gian chờ hàng, chọn nhà cung cấp theo tốc độ và tính linh hoạt. Lệch pha sẽ phá huỷ giá trị — chuỗi hiệu quả cho sản phẩm đổi mới gây hết hàng và phải giảm giá xả hàng; chuỗi đáp ứng nhanh (tốn kém) cho sản phẩm chức năng đội thêm chi phí mà thị trường không chịu trả.</p>
<h3>Sự phù hợp chiến lược</h3>
<p>Chopra &amp; Meindl khái quát ý tưởng này thành <strong>sự phù hợp chiến lược</strong>, qua ba bước: (1) hiểu khách hàng và <em>mức bất định nhu cầu hàm ý</em> — mức bất định sinh ra từ phần nhu cầu mà chuỗi được yêu cầu đáp ứng (số lượng mỗi đơn, thời gian phản hồi, mức đa dạng, mức phục vụ, tốc độ đổi mới, giá); (2) hiểu năng lực của chuỗi trên một dải từ <em>hiệu quả</em> tới <em>đáp ứng nhanh</em>; (3) khớp hai điều đó — mức bất định hàm ý càng cao thì chuỗi càng phải đáp ứng nhanh.</p>
<h3>Đẩy và kéo, điểm tách</h3>
<p>Trong quy trình <strong>đẩy</strong>, việc thực hiện bắt đầu trước khi có đơn, dựa trên dự báo. Trong quy trình <strong>kéo</strong>, việc thực hiện bắt đầu khi có đơn hàng thực tế của khách. Phần lớn chuỗi là đẩy – kéo: các khâu thượng nguồn được đẩy theo dự báo, các khâu hạ nguồn được kéo theo đơn hàng. Ranh giới giữa hai phần là <strong>ranh giới đẩy – kéo</strong>, gắn chặt với <strong>điểm tách đơn hàng khách hàng (CODP)</strong> — điểm mà một đơn hàng cụ thể của khách lần đầu đi vào dòng chảy và thường là nơi đặt tồn kho chiến lược.</p>
<table>
<tr><th>Hàng chờ đơn ở đâu</th><th>Chiến lược</th><th>Minh hoạ</th></tr>
<tr><td>Thành phẩm tại nhà bán lẻ hoặc trung tâm phân phối</td><td>Sản xuất để dự trữ (MTS)</td><td>Nước đóng chai, mì ăn liền</td></tr>
<tr><td>Linh kiện / mô-đun</td><td>Lắp ráp theo đơn (ATO)</td><td>Máy tính xách tay cấu hình trên mạng</td></tr>
<tr><td>Nguyên vật liệu</td><td>Sản xuất theo đơn (MTO)</td><td>Đồ nội thất đặt riêng, bộ vest may đo</td></tr>
<tr><td>Chưa có gì cụ thể — thiết kế bắt đầu từ đơn hàng</td><td>Thiết kế theo đơn (ETO)</td><td>Con tàu, một nhà máy công nghiệp</td></tr>
</table>
<p>Phía thượng nguồn của điểm tách, nhu cầu được gộp lại và ổn định hơn nên hợp với nguyên tắc <strong>tinh gọn (lean)</strong> — hiệu quả, loại bỏ lãng phí; phía hạ nguồn, nhu cầu cụ thể và biến động nên hợp với nguyên tắc <strong>nhanh nhạy (agile)</strong> — nhanh, linh hoạt. Sự kết hợp này đôi khi được gọi là "leagile". Điểm tách càng dời về hạ nguồn thì khách chờ càng ngắn, nhưng chuỗi phải giữ càng nhiều thành phẩm.</p>
<h3>Chiến lược trì hoãn (postponement)</h3>
<p><strong>Trì hoãn</strong> là lùi việc hoàn thiện cấu hình hoặc việc di chuyển sản phẩm cho tới khi biết nhu cầu thực: trì hoãn <em>hình thái</em> (sơn được pha màu tại cửa hàng theo màu khách chọn; sản phẩm chung được dán nhãn và đóng gói cho từng thị trường tại trung tâm phân phối khu vực) hoặc trì hoãn <em>thời gian và địa điểm</em> (giữ hàng tập trung và chỉ chuyển đi khi có đơn). Nhờ đó một kho hàng chung phục vụ được nhiều biến thể, giảm sai số dự báo và tồn kho.</p>
<div class="callout"><span class="badge">Ý chính</span> Khớp chuỗi với sản phẩm — hiệu quả nơi nhu cầu dự đoán được, đáp ứng nhanh nơi nhu cầu bất định — và đẩy phần bất định, riêng cho từng khách, về càng muộn càng tốt.</div>`,
  ]]);

const c3 = doc('scm202-1-3-bullwhip', '1.3 — The bullwhip effect|||1.3 — Hiệu ứng roi da (bullwhip effect)',
  'Hiệu ứng roi da là gì, minh hoạ bằng số liệu giả định, cách đo bằng tỷ số phương sai, hậu quả, bốn nguyên nhân theo Lee, Padmanabhan & Whang (xử lý tín hiệu nhu cầu, gộp đơn, biến động giá, phân bổ khi thiếu hàng) và biện pháp tương ứng.',
  [[
    `<span class="eyebrow">SCM202 · Part 1 · Lesson 1.3</span>
<h2>The bullwhip effect</h2>
<p class="lead">The <strong>bullwhip effect</strong> is the amplification of demand variability as orders move upstream: small changes in consumer demand become larger swings in the retailer's orders, larger still at the wholesaler and distributor, and largest at the factory and its suppliers.</p>
<p>The phenomenon was analysed in Jay Forrester's industrial dynamics work and is experienced first-hand by students in the <em>beer distribution game</em> developed at MIT. Lee, Padmanabhan and Whang (1997) identified its four main causes.</p>
<h3>An illustration (fictional numbers)</h3>
<table>
<tr><th>Stage</th><th>Standard deviation of weekly orders (units)</th><th>Variance relative to consumer demand = (σ / 10)²</th></tr>
<tr><td>Consumer demand at the retailer</td><td>10</td><td>1.00</td></tr>
<tr><td>Retailer's orders to the wholesaler</td><td>15</td><td>2.25</td></tr>
<tr><td>Wholesaler's orders to the distributor</td><td>24</td><td>5.76</td></tr>
<tr><td>Distributor's orders to the factory</td><td>38</td><td>14.44</td></tr>
<tr><td>Factory's production orders</td><td>60</td><td>36.00</td></tr>
</table>
<p>A common measure at each stage is the ratio <em>variance of orders placed / variance of demand received</em>; a ratio above 1 signals amplification. In the table, end-customer demand barely moves, yet the factory sees swings whose variance is 36 times larger. The consequences: excess inventory and stockouts in turn, poor capacity utilization (overtime, then idle time), higher transport and warehousing costs, and worse service.</p>
<h3>Four causes and their remedies</h3>
<table>
<tr><th>Cause</th><th>What happens</th><th>Remedies</th></tr>
<tr><td>Demand signal processing (forecast updating)</td><td>Each stage forecasts from the orders it receives rather than from end-customer demand, and adds its own safety stock; every adjustment is magnified upstream</td><td>Share point-of-sale (POS) data; one collaborative forecast (CPFR — collaborative planning, forecasting and replenishment); vendor-managed inventory (VMI); shorter lead times</td></tr>
<tr><td>Order batching</td><td>Orders are placed in large, infrequent batches (to save ordering or transport cost, or because of periodic planning), so demand looks lumpy</td><td>Cut ordering cost with EDI and online ordering; smaller, more frequent orders; mixed-product truckloads; consolidation by a third-party provider</td></tr>
<tr><td>Price fluctuations</td><td>Promotions and discounts lead buyers to forward-buy and stockpile, then stop ordering</td><td>Everyday low price (EDLP); fewer trade promotions; costing that shows the true cost of forward buying</td></tr>
<tr><td>Rationing and shortage gaming</td><td>When supply is short and allocated in proportion to orders, buyers inflate their orders, then cancel when supply recovers</td><td>Allocate on past sales rather than current orders; share capacity and inventory information; limit free cancellations and returns</td></tr>
</table>
<p>Long lead times and many stages make every cause worse, because each stage must plan further ahead and hold more safety stock.</p>
<div class="callout"><span class="badge">Key idea</span> The bullwhip is mostly produced by sensible local decisions made with poor information. The cure is visibility and coordination across the chain, not blaming the stage upstream.</div>`,
    `<span class="eyebrow">SCM202 · Phần 1 · Bài 1.3</span>
<h2>Hiệu ứng roi da</h2>
<p class="lead"><strong>Hiệu ứng roi da (bullwhip effect)</strong> là hiện tượng biến động của nhu cầu bị khuếch đại khi đơn hàng đi ngược lên thượng nguồn: thay đổi nhỏ trong nhu cầu của người tiêu dùng trở thành dao động lớn hơn trong đơn hàng của nhà bán lẻ, lớn hơn nữa ở nhà bán buôn và nhà phân phối, và lớn nhất ở nhà máy cùng các nhà cung cấp của nó.</p>
<p>Hiện tượng này đã được phân tích trong nghiên cứu động lực học công nghiệp (industrial dynamics) của Jay Forrester, và sinh viên có thể trực tiếp trải nghiệm qua <em>trò chơi phân phối bia</em> (beer game) do MIT phát triển. Lee, Padmanabhan và Whang (1997) chỉ ra bốn nguyên nhân chính.</p>
<h3>Minh hoạ (số liệu giả định)</h3>
<table>
<tr><th>Khâu</th><th>Độ lệch chuẩn của đơn hàng hằng tuần (đơn vị)</th><th>Phương sai so với nhu cầu tiêu dùng = (σ / 10)²</th></tr>
<tr><td>Nhu cầu tiêu dùng tại nhà bán lẻ</td><td>10</td><td>1,00</td></tr>
<tr><td>Đơn của nhà bán lẻ gửi nhà bán buôn</td><td>15</td><td>2,25</td></tr>
<tr><td>Đơn của nhà bán buôn gửi nhà phân phối</td><td>24</td><td>5,76</td></tr>
<tr><td>Đơn của nhà phân phối gửi nhà máy</td><td>38</td><td>14,44</td></tr>
<tr><td>Lệnh sản xuất của nhà máy</td><td>60</td><td>36,00</td></tr>
</table>
<p>Thước đo phổ biến ở mỗi khâu là tỷ số <em>phương sai của đơn hàng đặt đi / phương sai của nhu cầu nhận được</em>; tỷ số lớn hơn 1 báo hiệu có khuếch đại. Trong bảng, nhu cầu của người tiêu dùng cuối gần như không đổi, vậy mà nhà máy phải chịu dao động có phương sai lớn gấp 36 lần. Hậu quả: lúc thừa tồn kho, lúc hết hàng; sử dụng công suất kém (tăng ca rồi lại để máy nằm không); chi phí vận tải và kho bãi cao hơn; và dịch vụ tệ hơn.</p>
<h3>Bốn nguyên nhân và biện pháp</h3>
<table>
<tr><th>Nguyên nhân</th><th>Điều gì xảy ra</th><th>Biện pháp</th></tr>
<tr><td>Xử lý tín hiệu nhu cầu (cập nhật dự báo)</td><td>Mỗi khâu dự báo dựa trên đơn hàng mình nhận được chứ không dựa trên nhu cầu của khách hàng cuối, lại cộng thêm tồn kho an toàn của riêng mình; mỗi lần điều chỉnh bị phóng đại lên thượng nguồn</td><td>Chia sẻ dữ liệu điểm bán (POS); một dự báo chung (CPFR — hợp tác lập kế hoạch, dự báo và bổ sung hàng); tồn kho do nhà cung cấp quản lý (VMI); rút ngắn thời gian chờ hàng</td></tr>
<tr><td>Gộp đơn hàng</td><td>Đơn được đặt theo lô lớn, thưa (để tiết kiệm chi phí đặt hàng hay vận chuyển, hoặc do lập kế hoạch theo kỳ) nên nhu cầu trông như từng cục</td><td>Giảm chi phí đặt hàng bằng EDI và đặt hàng trực tuyến; đơn nhỏ hơn, thường xuyên hơn; xe chở ghép nhiều mặt hàng; gom hàng qua bên cung cấp dịch vụ thứ ba</td></tr>
<tr><td>Biến động giá</td><td>Khuyến mại và chiết khấu khiến người mua mua trước, tích trữ, rồi ngừng đặt hàng</td><td>Giá thấp mỗi ngày (EDLP); ít đợt khuyến mại thương mại hơn; cách tính chi phí cho thấy cái giá thật của việc mua trước</td></tr>
<tr><td>Phân bổ khi thiếu hàng và "đặt khống"</td><td>Khi nguồn cung thiếu và được chia theo tỷ lệ đơn đặt, người mua thổi phồng đơn hàng rồi huỷ khi nguồn cung hồi phục</td><td>Phân bổ theo doanh số quá khứ thay vì đơn hiện tại; chia sẻ thông tin công suất và tồn kho; hạn chế huỷ đơn và trả hàng tự do</td></tr>
</table>
<p>Thời gian chờ hàng dài và nhiều khâu trung gian làm mọi nguyên nhân trầm trọng hơn, vì mỗi khâu phải lập kế hoạch xa hơn và giữ nhiều tồn kho an toàn hơn.</p>
<div class="callout"><span class="badge">Ý chính</span> Hiệu ứng roi da phần lớn sinh ra từ những quyết định hợp lý ở từng nơi nhưng dựa trên thông tin kém. Cách chữa là minh bạch thông tin và phối hợp trên toàn chuỗi, chứ không phải đổ lỗi cho khâu phía trên.</div>`,
  ]]);

const c3q = quiz('scm202-quiz-1', 'Quiz 1 — Foundations, SCOR & strategy|||Quiz 1 — Nền tảng, SCOR & chiến lược', [
  { id: 'q1', question: 'In the SCOR model, which process manages business rules, performance, data, risk and compliance for the whole chain?|||Trong mô hình SCOR, quy trình nào quản lý quy tắc kinh doanh, hiệu quả, dữ liệu, rủi ro và tuân thủ cho toàn chuỗi?', options: ['Plan|||Plan (Hoạch định)', 'Source|||Source (Tìm nguồn / Mua)', 'Deliver|||Deliver (Giao hàng)', 'Enable|||Enable (Hỗ trợ)'], correctIndex: 3, explanation: 'Enable covers managing the supply chain itself; Plan balances demand and supply, Source buys, Deliver fulfils customer orders.|||Enable là quản lý chính chuỗi cung ứng; Plan cân bằng cung cầu, Source lo mua hàng, Deliver lo đáp ứng đơn của khách.' },
  { id: 'q2', question: 'A detergent brand has stable demand, a long life cycle and low margins. According to Fisher, it needs…|||Một nhãn bột giặt có nhu cầu ổn định, vòng đời dài và biên lợi nhuận thấp. Theo Fisher, nó cần…', options: ['a market-responsive supply chain with large buffer capacity|||một chuỗi đáp ứng nhanh thị trường với nhiều công suất dự phòng', 'a physically efficient supply chain|||một chuỗi cung ứng hiệu quả về mặt vật chất', 'an engineer-to-order process|||một quy trình thiết kế theo đơn', 'no inventory of finished goods at all|||hoàn toàn không giữ thành phẩm'], correctIndex: 1, explanation: 'Functional products with predictable demand should be served at the lowest cost; responsiveness would add cost the market will not pay for.|||Sản phẩm chức năng có nhu cầu dự đoán được nên được phục vụ với chi phí thấp nhất; đáp ứng nhanh chỉ đội thêm chi phí mà thị trường không chịu trả.' },
  { id: 'q3', question: 'Which of the following is a REMEDY for the bullwhip effect rather than a cause?|||Đâu là BIỆN PHÁP chống hiệu ứng roi da chứ không phải nguyên nhân?', options: ['Order batching|||Gộp đơn hàng', 'Frequent trade promotions|||Khuyến mại thương mại thường xuyên', 'Sharing point-of-sale data with suppliers|||Chia sẻ dữ liệu điểm bán với nhà cung cấp', 'Shortage gaming|||Đặt khống khi thiếu hàng'], correctIndex: 2, explanation: 'Sharing POS data lets every stage see real end-customer demand; the other three are among the causes identified by Lee, Padmanabhan and Whang.|||Chia sẻ dữ liệu POS giúp mọi khâu thấy nhu cầu thực của khách hàng cuối; ba phương án còn lại là nguyên nhân do Lee, Padmanabhan và Whang chỉ ra.' },
]);

const c4 = doc('scm202-2-1-inventory', '2.1 — Inventory management: EOQ, reorder point, safety stock & ABC|||2.1 — Quản lý tồn kho: EOQ, điểm đặt hàng lại, tồn kho an toàn & ABC',
  'Vì sao phải giữ tồn kho (tồn kho chu kỳ, an toàn, trên đường, mùa vụ, tách khâu), ba nhóm chi phí tồn kho, mô hình EOQ và giả định, điểm đặt hàng lại, tồn kho an toàn z × σd × √L, mức phục vụ chu kỳ và fill rate, kiểm tra định kỳ, phân tích ABC.',
  [[
    `<span class="eyebrow">SCM202 · Part 2 · Lesson 2.1</span>
<h2>Inventory management: EOQ, reorder point, safety stock &amp; ABC</h2>
<p class="lead">Inventory is money in physical form. It protects service, but it ties up capital, takes space and can become obsolete. The goal is not zero inventory but the <strong>right</strong> inventory.</p>
<h3>Why firms hold inventory</h3>
<table>
<tr><th>Type (by function)</th><th>Purpose</th></tr>
<tr><td>Cycle stock</td><td>Results from ordering in batches: on average about half a batch is on hand</td></tr>
<tr><td>Safety (buffer) stock</td><td>Protects against uncertainty in demand and in lead time</td></tr>
<tr><td>Pipeline (in-transit) stock</td><td>Goods moving between stages; grows with lead time</td></tr>
<tr><td>Anticipation / seasonal stock</td><td>Built ahead of a peak (the Tet holiday, a promotion) or a planned shutdown</td></tr>
<tr><td>Decoupling stock</td><td>Lets successive stages work at different rates without stopping each other</td></tr>
</table>
<p>By form, inventory consists of raw materials, work in process (WIP), finished goods and MRO supplies (maintenance, repair and operating).</p>
<h3>Inventory costs</h3>
<ul>
<li><strong>Ordering (setup) cost S</strong> — incurred per order: preparing and sending the order, receiving, inspection, or a production changeover. It does not depend on the order quantity.</li>
<li><strong>Holding (carrying) cost H</strong> — per unit per year: cost of capital, storage space, insurance, taxes, obsolescence, damage and shrinkage. Often expressed as a percentage of the unit's value per year.</li>
<li><strong>Shortage (stockout) cost</strong> — lost sales, backorder handling, lost goodwill.</li>
</ul>
<h3>Economic order quantity (EOQ)</h3>
<p>Under the classic assumptions — known, constant demand; a fixed cost per order; a constant holding cost; the whole batch arrives at once; no quantity discounts; no stockouts — total annual relevant cost is:</p>
<pre><code class="language-text">TC(Q) = (D / Q) × S   +   (Q / 2) × H
        ordering cost      holding cost

EOQ = √(2DS / H)

D = annual demand (units)   S = cost per order   H = holding cost per unit per year
At the EOQ, annual ordering cost = annual holding cost.</code></pre>
<p>The total cost curve is flat around the EOQ: ordering 20% more than the EOQ raises the relevant cost by only about 1.7%. Rounding the EOQ to a full case or pallet is therefore usually harmless.</p>
<h3>Reorder point and safety stock</h3>
<p>With <strong>continuous review</strong>, an order of Q units is placed whenever the inventory position (on hand + on order − backorders) falls to the <strong>reorder point (ROP)</strong>:</p>
<pre><code class="language-text">ROP = d × L + SS          (d = average demand per day, L = lead time in days)

Safety stock when daily demand varies (normally distributed, independent from day to day)
and the lead time is constant:
SS = z × σd × √L

σd = standard deviation of daily demand; z comes from the target cycle service level (CSL):
CSL 90% → z ≈ 1.28    95% → z ≈ 1.65    97.5% → z ≈ 1.96    99% → z ≈ 2.33</code></pre>
<p>The <strong>cycle service level</strong> is the probability of not running out during a replenishment cycle. It is different from the <strong>fill rate</strong>, the share of demand met directly from stock: a 95% CSL usually gives a fill rate higher than 95%, because even in a cycle with a stockout most of the demand is still served. If the lead time also varies, the standard deviation of demand during the lead time becomes √(L × σd² + d² × σL²), where σL is the standard deviation of the lead time. Safety stock rises steeply as the service target approaches 100%.</p>
<p>In a <strong>periodic review</strong> system, stock is checked every R days and topped up to an order-up-to level that covers the review period plus the lead time: d × (R + L) + z × σd × √(R + L).</p>
<h3>ABC analysis</h3>
<p>Not every item deserves the same attention. ABC analysis applies the Pareto principle and ranks items by <strong>annual usage value</strong> = annual demand × unit cost:</p>
<table>
<tr><th>Class</th><th>Typical share of items</th><th>Typical share of value</th><th>Control</th></tr>
<tr><td>A</td><td>≈ 10–20%</td><td>≈ 70–80%</td><td>Tight: frequent review, accurate records, close supplier management</td></tr>
<tr><td>B</td><td>≈ 30%</td><td>≈ 15–25%</td><td>Moderate</td></tr>
<tr><td>C</td><td>≈ 50%</td><td>≈ 5–10%</td><td>Simple rules, larger orders, periodic checks</td></tr>
</table>
<p>The cut-offs are rules of thumb, not laws. Firms also consider criticality: a cheap part that can stop a production line may need A-level attention.</p>
<div class="callout"><span class="badge">Remember</span> EOQ answers "how much to order?", the reorder point answers "when to order?", safety stock answers "how much protection?", and ABC answers "which items deserve the most management attention?".</div>`,
    `<span class="eyebrow">SCM202 · Phần 2 · Bài 2.1</span>
<h2>Quản lý tồn kho: EOQ, điểm đặt hàng lại, tồn kho an toàn &amp; ABC</h2>
<p class="lead">Tồn kho là tiền dưới dạng vật chất. Nó bảo vệ mức phục vụ, nhưng chôn vốn, chiếm diện tích và có thể lỗi thời. Mục tiêu không phải là tồn kho bằng không mà là tồn kho <strong>đúng mức</strong>.</p>
<h3>Vì sao doanh nghiệp giữ tồn kho</h3>
<table>
<tr><th>Loại (theo chức năng)</th><th>Mục đích</th></tr>
<tr><td>Tồn kho chu kỳ</td><td>Sinh ra do đặt hàng theo lô: bình quân có khoảng nửa lô trong kho</td></tr>
<tr><td>Tồn kho an toàn (đệm)</td><td>Phòng ngừa bất định về nhu cầu và về thời gian chờ hàng</td></tr>
<tr><td>Tồn kho trên đường (đang vận chuyển)</td><td>Hàng đang di chuyển giữa các khâu; tăng theo thời gian chờ hàng</td></tr>
<tr><td>Tồn kho dự phòng / mùa vụ</td><td>Tích trước một đợt cao điểm (Tết, khuyến mại) hoặc đợt nghỉ bảo trì theo kế hoạch</td></tr>
<tr><td>Tồn kho tách khâu</td><td>Cho các khâu liên tiếp làm việc với nhịp khác nhau mà không làm dừng nhau</td></tr>
</table>
<p>Theo hình thái, tồn kho gồm nguyên vật liệu, sản phẩm dở dang (WIP), thành phẩm và vật tư MRO (bảo trì, sửa chữa và vận hành).</p>
<h3>Chi phí tồn kho</h3>
<ul>
<li><strong>Chi phí đặt hàng (chi phí chuẩn bị) S</strong> — phát sinh theo mỗi đơn: lập và gửi đơn, nhận hàng, kiểm tra, hoặc chuyển đổi dây chuyền sản xuất. Không phụ thuộc vào số lượng đặt.</li>
<li><strong>Chi phí lưu kho (chi phí tồn trữ) H</strong> — tính trên mỗi đơn vị mỗi năm: chi phí vốn, mặt bằng kho, bảo hiểm, thuế, lỗi thời, hư hỏng và hao hụt. Thường được biểu diễn bằng một tỷ lệ phần trăm trên giá trị đơn vị hàng mỗi năm.</li>
<li><strong>Chi phí thiếu hàng (hết hàng)</strong> — mất doanh số, chi phí xử lý đơn nợ, mất thiện cảm của khách.</li>
</ul>
<h3>Lượng đặt hàng kinh tế (EOQ)</h3>
<p>Với các giả định kinh điển — nhu cầu biết trước và không đổi; chi phí mỗi đơn cố định; chi phí lưu kho không đổi; cả lô về một lần; không có chiết khấu theo số lượng; không để hết hàng — tổng chi phí liên quan hằng năm là:</p>
<pre><code class="language-text">TC(Q) = (D / Q) × S   +   (Q / 2) × H
        chi phí đặt hàng   chi phí lưu kho

EOQ = √(2DS / H)

D = nhu cầu năm (đơn vị)   S = chi phí mỗi đơn hàng   H = chi phí lưu kho mỗi đơn vị mỗi năm
Tại EOQ, chi phí đặt hàng năm = chi phí lưu kho năm.</code></pre>
<p>Đường tổng chi phí khá phẳng quanh EOQ: đặt nhiều hơn EOQ 20% chỉ làm chi phí liên quan tăng khoảng 1,7%. Vì vậy làm tròn EOQ theo thùng hay pallet thường không gây hại gì.</p>
<h3>Điểm đặt hàng lại và tồn kho an toàn</h3>
<p>Với <strong>kiểm tra liên tục</strong>, một đơn Q đơn vị được đặt mỗi khi vị thế tồn kho (tồn thực tế + hàng đã đặt − đơn nợ khách) giảm xuống <strong>điểm đặt hàng lại (ROP)</strong>:</p>
<pre><code class="language-text">ROP = d × L + SS          (d = nhu cầu bình quân mỗi ngày, L = thời gian chờ hàng tính bằng ngày)

Tồn kho an toàn khi nhu cầu hằng ngày biến động (phân phối chuẩn, độc lập giữa các ngày)
và thời gian chờ hàng cố định:
SS = z × σd × √L

σd = độ lệch chuẩn của nhu cầu hằng ngày; z lấy theo mức phục vụ chu kỳ (CSL) mục tiêu:
CSL 90% → z ≈ 1,28    95% → z ≈ 1,65    97,5% → z ≈ 1,96    99% → z ≈ 2,33</code></pre>
<p><strong>Mức phục vụ chu kỳ</strong> là xác suất không bị hết hàng trong một chu kỳ bổ sung hàng. Nó khác với <strong>tỷ lệ đáp ứng (fill rate)</strong> — phần nhu cầu được đáp ứng ngay từ hàng trong kho: CSL 95% thường cho fill rate cao hơn 95%, vì kể cả trong chu kỳ bị hết hàng, phần lớn nhu cầu vẫn đã được phục vụ. Nếu thời gian chờ hàng cũng biến động, độ lệch chuẩn của nhu cầu trong thời gian chờ hàng trở thành √(L × σd² + d² × σL²), trong đó σL là độ lệch chuẩn của thời gian chờ hàng. Tồn kho an toàn tăng rất nhanh khi mục tiêu phục vụ tiến gần 100%.</p>
<p>Trong hệ thống <strong>kiểm tra định kỳ</strong>, hàng được kiểm mỗi R ngày và bổ sung lên tới một mức tồn tối đa đủ phủ cả chu kỳ kiểm tra lẫn thời gian chờ hàng: d × (R + L) + z × σd × √(R + L).</p>
<h3>Phân tích ABC</h3>
<p>Không phải mặt hàng nào cũng cần được chú ý như nhau. Phân tích ABC áp dụng nguyên lý Pareto, xếp hạng mặt hàng theo <strong>giá trị sử dụng năm</strong> = nhu cầu năm × đơn giá:</p>
<table>
<tr><th>Nhóm</th><th>Tỷ trọng số mặt hàng điển hình</th><th>Tỷ trọng giá trị điển hình</th><th>Mức kiểm soát</th></tr>
<tr><td>A</td><td>≈ 10–20%</td><td>≈ 70–80%</td><td>Chặt: kiểm tra thường xuyên, sổ sách chính xác, quản lý sát nhà cung cấp</td></tr>
<tr><td>B</td><td>≈ 30%</td><td>≈ 15–25%</td><td>Vừa phải</td></tr>
<tr><td>C</td><td>≈ 50%</td><td>≈ 5–10%</td><td>Quy tắc đơn giản, đặt lô lớn hơn, kiểm tra định kỳ</td></tr>
</table>
<p>Các ngưỡng chia chỉ là kinh nghiệm, không phải quy luật. Doanh nghiệp còn xét mức độ trọng yếu: một linh kiện rẻ nhưng có thể làm dừng cả dây chuyền vẫn cần được chú ý như hàng nhóm A.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> EOQ trả lời "đặt bao nhiêu?", điểm đặt hàng lại trả lời "khi nào đặt?", tồn kho an toàn trả lời "phòng ngừa bao nhiêu?", còn ABC trả lời "mặt hàng nào đáng được quản lý kỹ nhất?".</div>`,
  ]]);

const c4e = doc('scm202-2-2-exercise', 'Exercise 1 — EOQ, reorder point, safety stock & ABC|||Bài tập 1 — EOQ, điểm đặt hàng lại, tồn kho an toàn & ABC',
  'Bài tập tình huống giả định: nhà phân phối thực phẩm khô — tính chi phí lưu kho, EOQ, số đơn mỗi năm, tổng chi phí so với đặt lô gấp đôi, tồn kho an toàn ở mức phục vụ 95%, điểm đặt hàng lại; rồi phân loại ABC cho 10 mã hàng; kèm lời giải.',
  [[
    `<span class="eyebrow">SCM202 · Part 2 · Exercise 1</span>
<h2>Exercise 1 — how much, when, and which items first</h2>
<div class="callout"><span class="badge">Problem</span> A distributor of a dry-food product (a fictional case, illustrative numbers) sells D = 7,200 cartons a year over 360 working days. Each order costs S = VND 400,000 to place and receive. A carton costs VND 80,000 and the annual holding cost rate is 20% of its value. The supplier's lead time is L = 9 days (constant); daily demand has a standard deviation σd = 5 cartons; the target cycle service level is 95% (z = 1.65). (a) Find H and the EOQ. (b) How many orders per year, and how many days between orders? (c) Compute the annual ordering, holding and total cost at the EOQ, and compare with ordering 1,200 cartons at a time. (d) Find the safety stock (rounded <em>up</em> to whole cartons) and the reorder point. (e) Classify the ten SKUs below with ABC analysis, using the cut-offs: A = items within the first 75% of cumulative value, B = above 75% up to 95%, C = the rest.</div>
<table>
<tr><th>SKU</th><th>Annual demand (units)</th><th>Unit cost (VND)</th></tr>
<tr><td>K01</td><td>2,000</td><td>35,000</td></tr>
<tr><td>K02</td><td>1,400</td><td>300,000</td></tr>
<tr><td>K03</td><td>4,000</td><td>4,000</td></tr>
<tr><td>K04</td><td>400</td><td>150,000</td></tr>
<tr><td>K05</td><td>140</td><td>100,000</td></tr>
<tr><td>K06</td><td>5,500</td><td>60,000</td></tr>
<tr><td>K07</td><td>1,100</td><td>20,000</td></tr>
<tr><td>K08</td><td>10,000</td><td>5,000</td></tr>
<tr><td>K09</td><td>400</td><td>20,000</td></tr>
<tr><td>K10</td><td>2,500</td><td>4,000</td></tr>
</table>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) H   = 20% × 80,000 = 16,000 VND per carton per year
    EOQ = √(2 × 7,200 × 400,000 / 16,000) = √360,000 = 600 cartons

(b) Orders per year     = 7,200 / 600 = 12
    Days between orders = 360 / 12   = 30 days

(c) At Q = 600:   ordering = 12 × 400,000        = 4,800,000
                  holding  = (600 / 2) × 16,000  = 4,800,000   (equal, as expected at the EOQ)
                  total    = 9,600,000 VND per year
    At Q = 1,200: ordering = (7,200 / 1,200) × 400,000 = 6 × 400,000 = 2,400,000
                  holding  = (1,200 / 2) × 16,000         = 9,600,000
                  total    = 12,000,000 VND  → 2,400,000 (25%) more than at the EOQ

(d) d   = 7,200 / 360 = 20 cartons per day
    SS  = 1.65 × 5 × √9 = 1.65 × 5 × 3 = 24.75 → rounded up to 25 cartons
    ROP = 20 × 9 + 25 = 180 + 25 = 205 cartons
    (holding the safety stock costs 25 × 16,000 = 400,000 VND a year;
     average inventory ≈ 600 / 2 + 25 = 325 cartons)

(e) Annual usage value (VND million), ranked:
    SKU   Value   Share    Cumulative   Class
    K02    420    42.0%     42.0%        A
    K06    330    33.0%     75.0%        A
    K01     70     7.0%     82.0%        B
    K04     60     6.0%     88.0%        B
    K08     50     5.0%     93.0%        B
    K07     22     2.2%     95.2%        C
    K03     16     1.6%     96.8%        C
    K05     14     1.4%     98.2%        C
    K10     10     1.0%     99.2%        C
    K09      8     0.8%    100.0%        C
    Total 1,000
    A: 2 SKUs (20% of items) = 75% of value · B: 3 SKUs (30%) = 18% · C: 5 SKUs (50%) = 7%</code></pre>
<p><strong>Why:</strong> the EOQ balances two opposite costs — doubling the batch halves ordering cost but doubles cycle-stock holding cost, so total cost rises by a quarter. The reorder point covers average lead-time demand (180 cartons) and adds a buffer only for its variability; rounding the safety stock up keeps the service level at or above target. ABC shows where attention pays: two SKUs carry three-quarters of the money tied up in usage, so they deserve tight forecasting, frequent review and close supplier contact, while the five C items can run on simple rules.</p>`,
    `<span class="eyebrow">SCM202 · Phần 2 · Bài tập 1</span>
<h2>Bài tập 1 — đặt bao nhiêu, khi nào, và ưu tiên mặt hàng nào</h2>
<div class="callout"><span class="badge">Đề</span> Một nhà phân phối thực phẩm khô (tình huống giả định, số liệu minh hoạ) bán D = 7.200 thùng mỗi năm trong 360 ngày làm việc. Mỗi lần đặt và nhận hàng tốn S = 400.000 đồng. Giá mỗi thùng là 80.000 đồng, tỷ lệ chi phí lưu kho năm bằng 20% giá trị hàng. Thời gian chờ hàng của nhà cung cấp là L = 9 ngày (cố định); nhu cầu hằng ngày có độ lệch chuẩn σd = 5 thùng; mức phục vụ chu kỳ mục tiêu là 95% (z = 1,65). (a) Tính H và EOQ. (b) Mỗi năm đặt bao nhiêu lần, cách nhau bao nhiêu ngày? (c) Tính chi phí đặt hàng, chi phí lưu kho và tổng chi phí năm tại EOQ, so sánh với việc mỗi lần đặt 1.200 thùng. (d) Tính tồn kho an toàn (làm tròn <em>lên</em> tới số thùng nguyên) và điểm đặt hàng lại. (e) Phân loại ABC cho mười mã hàng dưới đây theo ngưỡng: A = các mã nằm trong 75% giá trị luỹ kế đầu tiên, B = trên 75% tới 95%, C = phần còn lại.</div>
<table>
<tr><th>Mã hàng</th><th>Nhu cầu năm (đơn vị)</th><th>Đơn giá (đồng)</th></tr>
<tr><td>K01</td><td>2.000</td><td>35.000</td></tr>
<tr><td>K02</td><td>1.400</td><td>300.000</td></tr>
<tr><td>K03</td><td>4.000</td><td>4.000</td></tr>
<tr><td>K04</td><td>400</td><td>150.000</td></tr>
<tr><td>K05</td><td>140</td><td>100.000</td></tr>
<tr><td>K06</td><td>5.500</td><td>60.000</td></tr>
<tr><td>K07</td><td>1.100</td><td>20.000</td></tr>
<tr><td>K08</td><td>10.000</td><td>5.000</td></tr>
<tr><td>K09</td><td>400</td><td>20.000</td></tr>
<tr><td>K10</td><td>2.500</td><td>4.000</td></tr>
</table>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) H   = 20% × 80.000 = 16.000 đồng mỗi thùng mỗi năm
    EOQ = √(2 × 7.200 × 400.000 / 16.000) = √360.000 = 600 thùng

(b) Số lần đặt mỗi năm   = 7.200 / 600 = 12
    Khoảng cách giữa hai lần đặt = 360 / 12 = 30 ngày

(c) Với Q = 600:   đặt hàng = 12 × 400.000        = 4.800.000
                   lưu kho  = (600 / 2) × 16.000  = 4.800.000   (bằng nhau, đúng như tại EOQ)
                   tổng     = 9.600.000 đồng mỗi năm
    Với Q = 1.200: đặt hàng = (7.200 / 1.200) × 400.000 = 6 × 400.000 = 2.400.000
                   lưu kho  = (1.200 / 2) × 16.000         = 9.600.000
                   tổng     = 12.000.000 đồng  → cao hơn EOQ 2.400.000 (25%)

(d) d   = 7.200 / 360 = 20 thùng mỗi ngày
    SS  = 1,65 × 5 × √9 = 1,65 × 5 × 3 = 24,75 → làm tròn lên 25 thùng
    ROP = 20 × 9 + 25 = 180 + 25 = 205 thùng
    (giữ tồn kho an toàn tốn 25 × 16.000 = 400.000 đồng mỗi năm;
     tồn kho bình quân ≈ 600 / 2 + 25 = 325 thùng)

(e) Giá trị sử dụng năm (triệu đồng), đã xếp hạng:
    Mã    Giá trị  Tỷ trọng  Luỹ kế    Nhóm
    K02    420     42,0%     42,0%      A
    K06    330     33,0%     75,0%      A
    K01     70      7,0%     82,0%      B
    K04     60      6,0%     88,0%      B
    K08     50      5,0%     93,0%      B
    K07     22      2,2%     95,2%      C
    K03     16      1,6%     96,8%      C
    K05     14      1,4%     98,2%      C
    K10     10      1,0%     99,2%      C
    K09      8      0,8%    100,0%      C
    Tổng 1.000
    A: 2 mã (20% số mã) = 75% giá trị · B: 3 mã (30%) = 18% · C: 5 mã (50%) = 7%</code></pre>
<p><strong>Vì sao:</strong> EOQ cân bằng hai khoản chi phí ngược chiều — gấp đôi lô hàng làm chi phí đặt hàng giảm một nửa nhưng chi phí lưu kho tồn kho chu kỳ tăng gấp đôi, nên tổng chi phí tăng thêm một phần tư. Điểm đặt hàng lại phủ nhu cầu bình quân trong thời gian chờ hàng (180 thùng) và chỉ cộng thêm phần đệm cho mức biến động; làm tròn lên tồn kho an toàn giúp mức phục vụ bằng hoặc cao hơn mục tiêu. ABC cho thấy chỗ đáng bỏ công: hai mã chiếm ba phần tư giá trị sử dụng, nên cần dự báo kỹ, kiểm tra thường xuyên và làm việc sát với nhà cung cấp, còn năm mã nhóm C có thể vận hành bằng quy tắc đơn giản.</p>`,
  ]]);

const c4q = quiz('scm202-quiz-2', 'Quiz 2 — Inventory management|||Quiz 2 — Quản lý tồn kho', [
  { id: 'q1', question: 'Annual demand is 2,000 units, ordering cost is VND 100,000 per order and holding cost is VND 10,000 per unit per year. What is the EOQ?|||Nhu cầu năm là 2.000 đơn vị, chi phí đặt hàng 100.000 đồng mỗi đơn, chi phí lưu kho 10.000 đồng mỗi đơn vị mỗi năm. EOQ bằng bao nhiêu?', options: ['200 units|||200 đơn vị', '100 units|||100 đơn vị', '400 units|||400 đơn vị', '2,000 units|||2.000 đơn vị'], correctIndex: 0, explanation: 'EOQ = √(2 × 2,000 × 100,000 / 10,000) = √40,000 = 200 units.|||EOQ = √(2 × 2.000 × 100.000 / 10.000) = √40.000 = 200 đơn vị.' },
  { id: 'q2', question: 'Average demand is 40 units per day, the lead time is 5 days and the safety stock is 30 units. What is the reorder point?|||Nhu cầu bình quân 40 đơn vị mỗi ngày, thời gian chờ hàng 5 ngày, tồn kho an toàn 30 đơn vị. Điểm đặt hàng lại là bao nhiêu?', options: ['170 units|||170 đơn vị', '200 units|||200 đơn vị', '230 units|||230 đơn vị', '240 units|||240 đơn vị'], correctIndex: 2, explanation: 'ROP = d × L + SS = 40 × 5 + 30 = 230 units; 200 would cover only average lead-time demand, with no buffer.|||ROP = d × L + SS = 40 × 5 + 30 = 230 đơn vị; 200 chỉ phủ nhu cầu bình quân trong thời gian chờ hàng, không có phần đệm.' },
  { id: 'q3', question: 'In ABC analysis, class A items are typically…|||Trong phân tích ABC, hàng nhóm A thường là…', options: ['the items with the highest unit price, whatever their volume|||những mặt hàng có đơn giá cao nhất, bất kể số lượng', 'many items with a small share of annual usage value|||nhiều mặt hàng chiếm tỷ trọng nhỏ trong giá trị sử dụng năm', 'items that never need safety stock|||những mặt hàng không bao giờ cần tồn kho an toàn', 'few items with a large share of annual usage value|||ít mặt hàng nhưng chiếm tỷ trọng lớn trong giá trị sử dụng năm'], correctIndex: 3, explanation: 'Ranking is by annual usage value (demand × unit cost), not unit price alone; roughly 10–20% of items often carry 70–80% of the value.|||Xếp hạng theo giá trị sử dụng năm (nhu cầu × đơn giá), không chỉ theo đơn giá; khoảng 10–20% số mặt hàng thường chiếm 70–80% giá trị.' },
]);

const c5 = doc('scm202-3-1-transportation', '3.1 — Transportation: modes, intermodal transport & containers|||3.1 — Vận tải: phương thức, vận tải đa phương thức & container',
  'Tính kinh tế theo quy mô và theo khoảng cách, năm phương thức vận tải (đường bộ, đường sắt, đường thuỷ, hàng không, đường ống) và tiêu chí so sánh, vận tải đa phương thức, container và TEU, FCL/LCL, các bên tham gia và vận đơn.',
  [[
    `<span class="eyebrow">SCM202 · Part 3 · Lesson 3.1</span>
<h2>Transportation: modes, intermodal transport &amp; containers</h2>
<p class="lead">Transport is often the largest single logistics cost. It creates <strong>place utility</strong> (goods where they are needed) and <strong>time utility</strong> (goods when they are needed).</p>
<h3>Two principles of transport economics</h3>
<ul>
<li><strong>Economies of scale</strong> — the cost per unit of weight falls as the shipment gets larger (a full truckload is cheaper per tonne than a small parcel), because fixed costs such as pickup, paperwork and terminal handling are spread over more units.</li>
<li><strong>Economies of distance</strong> — the cost per kilometre falls as the distance increases (the "tapering principle"), because the fixed costs of loading and unloading are spread over more kilometres.</li>
</ul>
<h3>The five modes</h3>
<table>
<tr><th>Mode</th><th>Strengths</th><th>Limitations</th><th>Typical cargo</th></tr>
<tr><td>Road</td><td>Door-to-door, flexible, fast over short and medium distances</td><td>Higher cost per tonne-km than rail or water over long distances; congestion; limited load per vehicle</td><td>Consumer goods, food, parcels, final delivery</td></tr>
<tr><td>Rail</td><td>Low cost for heavy, bulky loads over long distances; lower emissions per tonne-km than road</td><td>Fixed routes and schedules; needs road transport for the first and last mile</td><td>Coal, ore, grain, containers</td></tr>
<tr><td>Water (sea, inland waterway)</td><td>Very low cost per tonne-km; huge capacity; the backbone of international trade</td><td>Slowest; depends on ports; exposed to weather</td><td>Containers, bulk commodities, oil, vehicles</td></tr>
<tr><td>Air</td><td>Fastest over long distances; secure; suits high-value goods</td><td>Highest cost per tonne-km; limits on weight and size; depends on airports</td><td>Electronics, pharmaceuticals, fresh flowers, urgent spare parts, express parcels</td></tr>
<tr><td>Pipeline</td><td>Very low operating cost; continuous and reliable flow</td><td>Very high fixed investment; only liquids and gases; fixed route</td><td>Crude oil, refined products, natural gas, water</td></tr>
</table>
<p>Modes are compared on <strong>cost</strong>, <strong>speed (transit time)</strong>, <strong>reliability</strong> (consistency of transit time), <strong>capability</strong> (what can be carried), <strong>accessibility</strong> and <strong>security</strong>. A slower, cheaper mode increases <em>pipeline inventory</em> — goods owned while they are in transit — so the right choice depends on total cost, not on the freight rate alone.</p>
<h3>Intermodal transport and containers</h3>
<p><strong>Intermodal (multimodal) transport</strong> moves goods in the same loading unit across two or more modes, without handling the cargo itself when the mode changes — for example truck → ship → rail. The enabler is the standardized ISO <strong>container</strong>:</p>
<ul>
<li>Capacity is measured in <strong>TEU</strong> (twenty-foot equivalent units): a 20-foot container = 1 TEU; a 40-foot container = 2 TEU (also called one FEU, forty-foot equivalent unit).</li>
<li>Common types: dry (general purpose), high-cube (taller), reefer (refrigerated), open-top, flat-rack and tank containers.</li>
<li><strong>FCL</strong> (full container load): one shipper fills a container. <strong>LCL</strong> (less than container load): a consolidator combines several shippers' goods in one container.</li>
</ul>
<p>Containers cut handling time, damage and theft, and let ships, trains and trucks exchange loads quickly at terminals.</p>
<h3>Key players and documents</h3>
<ul>
<li>The <strong>shipper</strong> sends the goods, the <strong>consignee</strong> receives them, the <strong>carrier</strong> performs the transport, and a <strong>freight forwarder</strong> arranges transport and documentation on a client's behalf.</li>
<li>In sea transport, the <strong>bill of lading (B/L)</strong> is a receipt for the goods, evidence of the contract of carriage and — when issued in negotiable form — a document of title. An <strong>air waybill</strong> is a receipt and evidence of the contract of carriage, but not a document of title.</li>
</ul>
<div class="callout"><span class="badge">Trade-off</span> Air freight costs far more per kilogram than sea freight, but it can cut weeks from the lead time, which lowers pipeline and safety stock. For high-value, short-life or urgent goods, it can be the cheaper total solution.</div>`,
    `<span class="eyebrow">SCM202 · Phần 3 · Bài 3.1</span>
<h2>Vận tải: phương thức, vận tải đa phương thức &amp; container</h2>
<p class="lead">Vận tải thường là khoản chi phí logistics lớn nhất. Nó tạo ra <strong>lợi ích địa điểm</strong> (hàng có mặt ở nơi cần) và <strong>lợi ích thời gian</strong> (hàng có mặt vào lúc cần).</p>
<h3>Hai nguyên lý kinh tế vận tải</h3>
<ul>
<li><strong>Tính kinh tế theo quy mô</strong> — chi phí trên mỗi đơn vị trọng lượng giảm khi lô hàng lớn lên (chở nguyên xe rẻ hơn trên mỗi tấn so với gửi một kiện nhỏ), vì các chi phí cố định như nhận hàng, giấy tờ và bốc xếp tại bến được chia cho nhiều đơn vị hơn.</li>
<li><strong>Tính kinh tế theo khoảng cách</strong> — chi phí trên mỗi kilômét giảm khi quãng đường dài ra ("nguyên lý giảm dần"), vì chi phí cố định của việc xếp và dỡ hàng được chia cho nhiều kilômét hơn.</li>
</ul>
<h3>Năm phương thức vận tải</h3>
<table>
<tr><th>Phương thức</th><th>Điểm mạnh</th><th>Hạn chế</th><th>Hàng điển hình</th></tr>
<tr><td>Đường bộ</td><td>Từ cửa tới cửa, linh hoạt, nhanh ở cự ly ngắn và trung bình</td><td>Chi phí mỗi tấn-km cao hơn đường sắt hay đường thuỷ ở cự ly dài; ùn tắc; tải trọng mỗi xe có hạn</td><td>Hàng tiêu dùng, thực phẩm, bưu kiện, giao chặng cuối</td></tr>
<tr><td>Đường sắt</td><td>Chi phí thấp cho hàng nặng, cồng kềnh, cự ly dài; phát thải mỗi tấn-km thấp hơn đường bộ</td><td>Tuyến và lịch cố định; cần đường bộ cho chặng đầu và chặng cuối</td><td>Than, quặng, ngũ cốc, container</td></tr>
<tr><td>Đường thuỷ (biển, thuỷ nội địa)</td><td>Chi phí mỗi tấn-km rất thấp; sức chở khổng lồ; xương sống của thương mại quốc tế</td><td>Chậm nhất; phụ thuộc cảng; chịu ảnh hưởng thời tiết</td><td>Container, hàng rời, dầu, ô tô</td></tr>
<tr><td>Hàng không</td><td>Nhanh nhất ở cự ly dài; an toàn; hợp với hàng giá trị cao</td><td>Chi phí mỗi tấn-km cao nhất; giới hạn trọng lượng và kích thước; phụ thuộc sân bay</td><td>Điện tử, dược phẩm, hoa tươi, phụ tùng khẩn, chuyển phát nhanh</td></tr>
<tr><td>Đường ống</td><td>Chi phí vận hành rất thấp; dòng chảy liên tục, tin cậy</td><td>Vốn đầu tư ban đầu rất lớn; chỉ chở chất lỏng và khí; tuyến cố định</td><td>Dầu thô, sản phẩm lọc dầu, khí đốt, nước</td></tr>
</table>
<p>Các phương thức được so sánh theo <strong>chi phí</strong>, <strong>tốc độ (thời gian vận chuyển)</strong>, <strong>độ tin cậy</strong> (thời gian vận chuyển có ổn định không), <strong>năng lực</strong> (chở được loại hàng gì), <strong>khả năng tiếp cận</strong> và <strong>an ninh</strong>. Phương thức chậm và rẻ làm tăng <em>tồn kho trên đường</em> — hàng doanh nghiệp sở hữu trong lúc đang vận chuyển — nên lựa chọn đúng phụ thuộc vào tổng chi phí, không chỉ vào giá cước.</p>
<h3>Vận tải đa phương thức và container</h3>
<p><strong>Vận tải đa phương thức</strong> chở hàng trong cùng một đơn vị xếp dỡ qua hai hay nhiều phương thức mà không phải bốc dỡ bản thân hàng hoá khi chuyển phương thức — ví dụ xe tải → tàu biển → tàu hoả. Yếu tố làm nên điều đó là <strong>container</strong> tiêu chuẩn ISO:</p>
<ul>
<li>Sức chứa đo bằng <strong>TEU</strong> (đơn vị tương đương container 20 feet): một container 20 feet = 1 TEU; một container 40 feet = 2 TEU (còn gọi là một FEU — đơn vị tương đương container 40 feet).</li>
<li>Các loại phổ biến: container khô (hàng bách hoá), container cao (high-cube), container lạnh (reefer), container mở nóc, container mặt bằng (flat-rack) và container bồn.</li>
<li><strong>FCL</strong> (hàng nguyên container): một người gửi đóng đầy một container. <strong>LCL</strong> (hàng lẻ): một đơn vị gom hàng ghép hàng của nhiều người gửi vào một container.</li>
</ul>
<p>Container giảm thời gian bốc xếp, hư hỏng và mất cắp, cho phép tàu biển, tàu hoả và xe tải trao đổi hàng nhanh chóng tại các bến.</p>
<h3>Các bên tham gia và chứng từ</h3>
<ul>
<li><strong>Người gửi hàng</strong> gửi hàng đi, <strong>người nhận hàng</strong> nhận hàng, <strong>người vận chuyển</strong> thực hiện việc chở, còn <strong>người giao nhận (freight forwarder)</strong> thay mặt khách hàng thu xếp vận tải và chứng từ.</li>
<li>Trong vận tải biển, <strong>vận đơn đường biển (B/L)</strong> là biên lai nhận hàng, bằng chứng của hợp đồng vận chuyển và — khi được phát hành ở dạng chuyển nhượng được — là chứng từ sở hữu hàng hoá. <strong>Vận đơn hàng không</strong> là biên lai và bằng chứng của hợp đồng vận chuyển, nhưng không phải chứng từ sở hữu.</li>
</ul>
<div class="callout"><span class="badge">Đánh đổi</span> Cước hàng không đắt hơn cước đường biển rất nhiều trên mỗi kilôgam, nhưng có thể rút ngắn thời gian chờ hàng hàng tuần, qua đó giảm tồn kho trên đường và tồn kho an toàn. Với hàng giá trị cao, vòng đời ngắn hoặc cần gấp, đó có thể là phương án có tổng chi phí thấp hơn.</div>`,
  ]]);

const c6 = doc('scm202-3-2-incoterms', '3.2 — Incoterms 2020: who pays and who bears the risk|||3.2 — Incoterms 2020: ai trả chi phí, ai chịu rủi ro',
  'Incoterms là gì và không quy định những gì, 11 quy tắc Incoterms 2020 chia hai nhóm (mọi phương thức vận tải; đường biển và thuỷ nội địa), điểm chuyển giao rủi ro, thông quan, bảo hiểm trong CIF và CIP, lưu ý với hàng container, những thay đổi so với 2010.',
  [[
    `<span class="eyebrow">SCM202 · Part 3 · Lesson 3.2</span>
<h2>Incoterms 2020: who pays and who bears the risk</h2>
<p class="lead"><strong>Incoterms</strong> are standard trade terms published by the International Chamber of Commerce (ICC). The current edition, <strong>Incoterms 2020</strong>, contains 11 rules. Each three-letter rule, written with a precise named place and the edition — for example "FOB Cat Lai Port, Ho Chi Minh City, Incoterms 2020" — tells buyer and seller <strong>where delivery takes place</strong> (and therefore where risk passes), <strong>who pays which costs</strong>, and <strong>who handles export and import clearance</strong>.</p>
<div class="callout"><span class="badge">What Incoterms do NOT cover</span> Transfer of ownership (title), the price and the payment method, and remedies for breach of contract. Those belong in the sales contract and the applicable law.</div>
<h3>The 11 rules in two groups</h3>
<table>
<tr><th>Rule</th><th>Name</th><th>Delivery — risk passes to the buyer</th><th>Main carriage paid by</th></tr>
<tr><td colspan="4"><strong>Rules for any mode or modes of transport</strong></td></tr>
<tr><td>EXW</td><td>Ex Works</td><td>When the goods are placed at the buyer's disposal at the seller's premises (or another named place), not loaded</td><td>Buyer</td></tr>
<tr><td>FCA</td><td>Free Carrier</td><td>When the goods are handed to the carrier nominated by the buyer at the named place (loaded on the buyer's vehicle if that place is the seller's premises)</td><td>Buyer</td></tr>
<tr><td>CPT</td><td>Carriage Paid To</td><td>When the goods are handed to the carrier contracted by the seller (the first carrier)</td><td>Seller, to the named destination</td></tr>
<tr><td>CIP</td><td>Carriage and Insurance Paid To</td><td>When the goods are handed to the first carrier</td><td>Seller, who must also insure</td></tr>
<tr><td>DAP</td><td>Delivered at Place</td><td>At the named destination, on the arriving means of transport, ready for unloading</td><td>Seller</td></tr>
<tr><td>DPU</td><td>Delivered at Place Unloaded</td><td>At the named destination, once the goods are unloaded</td><td>Seller</td></tr>
<tr><td>DDP</td><td>Delivered Duty Paid</td><td>At the named destination, ready for unloading, cleared for import with duties paid</td><td>Seller</td></tr>
<tr><td colspan="4"><strong>Rules for sea and inland waterway transport only</strong></td></tr>
<tr><td>FAS</td><td>Free Alongside Ship</td><td>When the goods are placed alongside the buyer's vessel at the port of shipment</td><td>Buyer</td></tr>
<tr><td>FOB</td><td>Free On Board</td><td>When the goods are on board the buyer's vessel at the port of shipment</td><td>Buyer</td></tr>
<tr><td>CFR</td><td>Cost and Freight</td><td>When the goods are on board the vessel at the port of shipment</td><td>Seller, to the port of destination</td></tr>
<tr><td>CIF</td><td>Cost, Insurance and Freight</td><td>When the goods are on board the vessel at the port of shipment</td><td>Seller, who must also insure</td></tr>
</table>
<h3>Principles to remember</h3>
<ul>
<li><strong>Clearance</strong>: export clearance is the seller's job under every rule except EXW; import clearance and import duties are the buyer's under every rule except DDP.</li>
<li><strong>E and F rules</strong>: the buyer arranges and pays the main carriage. <strong>C rules</strong>: the seller pays the main carriage, but risk passes at shipment — there are <em>two critical points</em>, one for risk (at origin) and one for cost (at destination). <strong>D rules</strong>: the seller bears both risk and cost up to the destination.</li>
<li><strong>Insurance</strong>: only CIF and CIP oblige the seller to insure for the buyer's benefit. Under Incoterms 2020, CIF requires at least minimum cover (Institute Cargo Clauses C), while CIP requires extensive cover (Institute Cargo Clauses A), in both cases for at least 110% of the contract price. Under the other rules, the party bearing the risk decides whether to insure.</li>
<li><strong>Unloading</strong>: DPU is the only rule under which the seller must unload the goods at the destination.</li>
<li><strong>Containers</strong>: containerized goods are normally handed to the carrier at a terminal before they are on board, so the ICC recommends FCA, CPT or CIP rather than FOB, CFR or CIF — otherwise the seller keeps the risk for goods it no longer controls.</li>
<li><strong>Changes from Incoterms 2010</strong>: DAT was replaced by DPU; CIP's insurance level was raised to Institute Cargo Clauses A; under FCA the parties can agree that the buyer instructs its carrier to issue an on-board bill of lading to the seller (useful with letters of credit); the parties may use their own means of transport under FCA, DAP, DPU and DDP.</li>
</ul>
<div class="callout"><span class="badge">Watch out</span> "FOB" and "CIF" are often used loosely in everyday trade talk. Always write the rule, the precise named place and the edition, and check that the rule fits the mode of transport.</div>`,
    `<span class="eyebrow">SCM202 · Phần 3 · Bài 3.2</span>
<h2>Incoterms 2020: ai trả chi phí, ai chịu rủi ro</h2>
<p class="lead"><strong>Incoterms</strong> là các điều kiện thương mại chuẩn do Phòng Thương mại Quốc tế (ICC) ban hành. Phiên bản hiện hành, <strong>Incoterms 2020</strong>, gồm 11 quy tắc. Mỗi quy tắc ba chữ cái, khi ghi kèm địa điểm cụ thể và phiên bản — ví dụ "FOB Cảng Cát Lái, TP. Hồ Chí Minh, Incoterms 2020" — cho người mua và người bán biết <strong>việc giao hàng diễn ra ở đâu</strong> (và vì thế rủi ro chuyển giao ở đâu), <strong>ai trả những chi phí nào</strong>, và <strong>ai làm thủ tục thông quan xuất khẩu, nhập khẩu</strong>.</p>
<div class="callout"><span class="badge">Incoterms KHÔNG quy định</span> Việc chuyển quyền sở hữu hàng hoá, giá và phương thức thanh toán, cũng như chế tài khi vi phạm hợp đồng. Những điều đó thuộc về hợp đồng mua bán và luật áp dụng.</div>
<h3>11 quy tắc chia làm hai nhóm</h3>
<table>
<tr><th>Quy tắc</th><th>Tên</th><th>Giao hàng — rủi ro chuyển sang người mua</th><th>Người trả cước vận tải chính</th></tr>
<tr><td colspan="4"><strong>Nhóm dùng cho mọi phương thức vận tải (một hay nhiều phương thức)</strong></td></tr>
<tr><td>EXW</td><td>Giao tại xưởng</td><td>Khi hàng được đặt dưới quyền định đoạt của người mua tại cơ sở của người bán (hoặc nơi chỉ định khác), chưa bốc lên phương tiện</td><td>Người mua</td></tr>
<tr><td>FCA</td><td>Giao cho người chuyên chở</td><td>Khi hàng được giao cho người chuyên chở do người mua chỉ định tại nơi quy định (đã bốc lên phương tiện của người mua nếu nơi đó là cơ sở của người bán)</td><td>Người mua</td></tr>
<tr><td>CPT</td><td>Cước phí trả tới</td><td>Khi hàng được giao cho người chuyên chở do người bán thuê (người chuyên chở đầu tiên)</td><td>Người bán, tới nơi đến quy định</td></tr>
<tr><td>CIP</td><td>Cước phí và bảo hiểm trả tới</td><td>Khi hàng được giao cho người chuyên chở đầu tiên</td><td>Người bán, đồng thời phải mua bảo hiểm</td></tr>
<tr><td>DAP</td><td>Giao tại nơi đến</td><td>Tại nơi đến quy định, trên phương tiện vận tải đến, sẵn sàng để dỡ</td><td>Người bán</td></tr>
<tr><td>DPU</td><td>Giao tại địa điểm đã dỡ xuống</td><td>Tại nơi đến quy định, sau khi hàng đã được dỡ xuống</td><td>Người bán</td></tr>
<tr><td>DDP</td><td>Giao hàng đã nộp thuế</td><td>Tại nơi đến quy định, sẵn sàng để dỡ, đã thông quan nhập khẩu và nộp thuế</td><td>Người bán</td></tr>
<tr><td colspan="4"><strong>Nhóm chỉ dùng cho vận tải đường biển và đường thuỷ nội địa</strong></td></tr>
<tr><td>FAS</td><td>Giao dọc mạn tàu</td><td>Khi hàng được đặt dọc mạn con tàu do người mua chỉ định tại cảng bốc hàng</td><td>Người mua</td></tr>
<tr><td>FOB</td><td>Giao hàng lên tàu</td><td>Khi hàng đã được xếp lên con tàu do người mua chỉ định tại cảng bốc hàng</td><td>Người mua</td></tr>
<tr><td>CFR</td><td>Tiền hàng và cước phí</td><td>Khi hàng đã được xếp lên tàu tại cảng bốc hàng</td><td>Người bán, tới cảng đến</td></tr>
<tr><td>CIF</td><td>Tiền hàng, bảo hiểm và cước phí</td><td>Khi hàng đã được xếp lên tàu tại cảng bốc hàng</td><td>Người bán, đồng thời phải mua bảo hiểm</td></tr>
</table>
<h3>Những nguyên tắc cần nhớ</h3>
<ul>
<li><strong>Thông quan</strong>: thông quan xuất khẩu là việc của người bán trong mọi quy tắc trừ EXW; thông quan nhập khẩu và thuế nhập khẩu là việc của người mua trong mọi quy tắc trừ DDP.</li>
<li><strong>Nhóm E và F</strong>: người mua thu xếp và trả cước vận tải chính. <strong>Nhóm C</strong>: người bán trả cước vận tải chính, nhưng rủi ro chuyển giao ngay khi gửi hàng — có <em>hai điểm tới hạn</em>, một cho rủi ro (ở nơi đi) và một cho chi phí (ở nơi đến). <strong>Nhóm D</strong>: người bán chịu cả rủi ro lẫn chi phí tới tận nơi đến.</li>
<li><strong>Bảo hiểm</strong>: chỉ CIF và CIP buộc người bán mua bảo hiểm vì lợi ích của người mua. Theo Incoterms 2020, CIF chỉ yêu cầu mức bảo hiểm tối thiểu (Điều khoản bảo hiểm hàng hoá của Viện — ICC C), còn CIP yêu cầu mức bảo hiểm rộng (ICC A); cả hai đều với số tiền tối thiểu 110% giá hợp đồng. Với các quy tắc khác, bên chịu rủi ro tự quyết định có mua bảo hiểm hay không.</li>
<li><strong>Dỡ hàng</strong>: DPU là quy tắc duy nhất buộc người bán phải dỡ hàng tại nơi đến.</li>
<li><strong>Hàng container</strong>: hàng đóng container thường được giao cho người chuyên chở tại bãi hay bến container trước khi được xếp lên tàu, nên ICC khuyến nghị dùng FCA, CPT hoặc CIP thay cho FOB, CFR hoặc CIF — nếu không, người bán vẫn chịu rủi ro đối với hàng mà mình không còn kiểm soát.</li>
<li><strong>Thay đổi so với Incoterms 2010</strong>: DAT được thay bằng DPU; mức bảo hiểm của CIP được nâng lên ICC A; với FCA, hai bên có thể thoả thuận để người mua yêu cầu người chuyên chở của mình cấp vận đơn đã xếp hàng lên tàu cho người bán (hữu ích khi thanh toán bằng thư tín dụng); các bên được dùng phương tiện vận tải của chính mình trong FCA, DAP, DPU và DDP.</li>
</ul>
<div class="callout"><span class="badge">Cẩn thận</span> "FOB" và "CIF" thường được dùng một cách lỏng lẻo trong giao tiếp thương mại hằng ngày. Luôn ghi rõ quy tắc, địa điểm cụ thể và phiên bản, và kiểm tra quy tắc có phù hợp với phương thức vận tải hay không.</div>`,
  ]]);

const c6e = doc('scm202-3-3-exercise', 'Exercise 2 — Incoterms 2020 for a furniture shipment|||Bài tập 2 — Incoterms 2020 cho một lô hàng nội thất',
  'Bài tập tình huống giả định: lô hàng hai container 40 feet bàn gỗ từ Bình Dương đi Rotterdam — phân chia tám khoản chi phí theo FOB, CIF, DAP, DDP, tính giá chào tối thiểu, xác định điểm chuyển rủi ro, ai chịu tổn thất khi cháy trên tàu, vì sao nên dùng FCA cho hàng container; kèm lời giải.',
  [[
    `<span class="eyebrow">SCM202 · Part 3 · Exercise 2</span>
<h2>Exercise 2 — one shipment, four Incoterms</h2>
<div class="callout"><span class="badge">Problem</span> A furniture exporter in Binh Duong (a fictional case, illustrative figures) sells two 40-foot containers of wooden tables to an importer whose warehouse is near Rotterdam. The goods go by truck to Cat Lai port, by sea to Rotterdam, then by truck to the importer. Cost items (USD): (1) goods at the factory, i.e. the EXW value — 40,000; (2) export customs clearance — 200; (3) loading at the factory, trucking to Cat Lai and loading on board — 1,000; (4) ocean freight Cat Lai → Rotterdam — 4,800; (5) cargo insurance for the whole journey (Institute Cargo Clauses C, 110% of the value) — 150; (6) unloading at Rotterdam port and trucking to the importer's warehouse — 900; (7) import customs clearance and import duties — 3,000; (8) unloading at the importer's warehouse — 100. (a) Under <strong>FOB Cat Lai</strong>, <strong>CIF Rotterdam</strong>, <strong>DAP importer's warehouse</strong> and <strong>DDP importer's warehouse</strong> (all Incoterms 2020), which items does the seller pay, and what is the minimum price it must quote to recover its costs (no profit added)? Assume that under DAP and DDP the seller buys the same insurance for its own protection because it bears the transit risk, and that under FOB the buyer buys it. (b) Where does risk pass under each rule? (c) A fire breaks out on the vessel during the voyage and part of the cargo is destroyed. Who bears the loss under FOB, CIF and DAP? (d) Why might FCA be a better choice than FOB for this shipment?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Who pays each item (S = seller, B = buyer)
    Item                                   FOB   CIF   DAP   DDP
    (1) Goods, EXW value        40,000      S     S     S     S
    (2) Export clearance           200      S     S     S     S
    (3) To Cat Lai, on board     1,000      S     S     S     S
    (4) Ocean freight            4,800      B     S     S     S
    (5) Cargo insurance            150      B*    S     S*    S*
    (6) Rotterdam → warehouse      900      B     B**   S     S
    (7) Import clearance, duty   3,000      B     B     B     S
    (8) Unloading at warehouse     100      B     B     B     B
    *  not an Incoterms obligation: bought by whoever bears the risk, by choice
    ** unless the seller's contract of carriage already includes unloading at Rotterdam

    Minimum quote (USD):
    FOB Cat Lai   = 40,000 + 200 + 1,000                   = 41,200
    CIF Rotterdam = 41,200 + 4,800 + 150                   = 46,150
    DAP warehouse = 46,150 + 900                           = 47,050
    DDP warehouse = 47,050 + 3,000                         = 50,050

    Buyer's total landed cost is the same in every case:
    FOB: 41,200 + 4,800 + 150 + 900 + 3,000 + 100 = 50,150
    CIF: 46,150 + 900 + 3,000 + 100               = 50,150
    DAP: 47,050 + 3,000 + 100                     = 50,150
    DDP: 50,050 + 100                             = 50,150

(b) Risk passes:
    FOB, CIF → when the goods are on board the vessel at Cat Lai
    DAP, DDP → at the importer's warehouse, on the arriving truck, ready for unloading

(c) Fire on board during the voyage:
    FOB → the buyer bears the loss (risk passed at Cat Lai); it claims on its own policy
    CIF → the buyer also bears the loss, but claims under the policy the seller bought for
          its benefit — fire is among the perils covered even by minimum cover (ICC C)
    DAP → the seller bears the loss (risk has not yet passed); it claims on its own policy
          and still has to deliver the goods as the contract requires</code></pre>
<p><strong>(d)</strong> The containers are handed to the carrier at the Cat Lai container terminal — or even collected at the factory — days before they are loaded on board. Under FOB the seller keeps the risk during that period, although the goods are already out of its control. FCA (named terminal, or the seller's factory) passes risk when the containers are handed to the buyer's carrier, which is why the ICC recommends FCA, CPT or CIP for containerized cargo.</p>
<p><strong>Why:</strong> Incoterms do not make costs disappear — they <em>allocate</em> them. Moving from FOB to DDP raises the seller's price from 41,200 to 50,050, but the buyer's total landed cost stays 50,150 in every case. The right rule is the one that gives each step to the party that can arrange it most cheaply and reliably, and puts the risk where it can be controlled and insured. Note that CIF and FOB share the same risk point: paying the freight does not mean carrying the risk at sea.</p>`,
    `<span class="eyebrow">SCM202 · Phần 3 · Bài tập 2</span>
<h2>Bài tập 2 — một lô hàng, bốn điều kiện Incoterms</h2>
<div class="callout"><span class="badge">Đề</span> Một doanh nghiệp xuất khẩu đồ gỗ ở Bình Dương (tình huống giả định, số liệu minh hoạ) bán hai container 40 feet bàn gỗ cho một nhà nhập khẩu có kho gần Rotterdam. Hàng đi xe tải ra cảng Cát Lái, đi biển tới Rotterdam, rồi đi xe tải về kho người mua. Các khoản chi phí (USD): (1) hàng tại xưởng, tức giá trị EXW — 40.000; (2) thông quan xuất khẩu — 200; (3) bốc hàng tại xưởng, chở ra Cát Lái và xếp lên tàu — 1.000; (4) cước biển Cát Lái → Rotterdam — 4.800; (5) bảo hiểm hàng hoá cho toàn hành trình (ICC C, 110% giá trị) — 150; (6) dỡ hàng tại cảng Rotterdam và chở về kho người nhập khẩu — 900; (7) thông quan nhập khẩu và thuế nhập khẩu — 3.000; (8) dỡ hàng tại kho người nhập khẩu — 100. (a) Theo <strong>FOB Cát Lái</strong>, <strong>CIF Rotterdam</strong>, <strong>DAP kho người nhập khẩu</strong> và <strong>DDP kho người nhập khẩu</strong> (đều là Incoterms 2020), người bán trả những khoản nào, và giá chào tối thiểu để bù đủ chi phí (chưa cộng lãi) là bao nhiêu? Giả sử với DAP và DDP, người bán tự mua cùng mức bảo hiểm đó để bảo vệ chính mình vì họ chịu rủi ro trên đường, còn với FOB thì người mua mua. (b) Rủi ro chuyển giao ở đâu theo từng quy tắc? (c) Trong hành trình, trên tàu xảy ra cháy và một phần hàng bị thiêu huỷ. Ai chịu tổn thất theo FOB, CIF và DAP? (d) Vì sao FCA có thể là lựa chọn tốt hơn FOB cho lô hàng này?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Ai trả từng khoản (B = người bán, M = người mua)
    Khoản                                   FOB   CIF   DAP   DDP
    (1) Hàng, giá trị EXW        40.000      B     B     B     B
    (2) Thông quan xuất khẩu        200      B     B     B     B
    (3) Ra Cát Lái, lên tàu       1.000      B     B     B     B
    (4) Cước biển                 4.800      M     B     B     B
    (5) Bảo hiểm hàng hoá           150      M*    B     B*    B*
    (6) Rotterdam → kho             900      M     M**   B     B
    (7) Thông quan, thuế NK       3.000      M     M     M     B
    (8) Dỡ hàng tại kho             100      M     M     M     M
    *  không phải nghĩa vụ theo Incoterms: bên chịu rủi ro tự chọn mua
    ** trừ khi hợp đồng vận chuyển của người bán đã bao gồm việc dỡ hàng tại Rotterdam

    Giá chào tối thiểu (USD):
    FOB Cát Lái   = 40.000 + 200 + 1.000                   = 41.200
    CIF Rotterdam = 41.200 + 4.800 + 150                   = 46.150
    DAP tại kho   = 46.150 + 900                           = 47.050
    DDP tại kho   = 47.050 + 3.000                         = 50.050

    Tổng chi phí hàng về kho của người mua như nhau ở mọi trường hợp:
    FOB: 41.200 + 4.800 + 150 + 900 + 3.000 + 100 = 50.150
    CIF: 46.150 + 900 + 3.000 + 100               = 50.150
    DAP: 47.050 + 3.000 + 100                     = 50.150
    DDP: 50.050 + 100                             = 50.150

(b) Rủi ro chuyển giao:
    FOB, CIF → khi hàng đã được xếp lên tàu tại Cát Lái
    DAP, DDP → tại kho người nhập khẩu, trên xe tải vừa tới, sẵn sàng để dỡ

(c) Cháy trên tàu trong hành trình:
    FOB → người mua chịu tổn thất (rủi ro đã chuyển tại Cát Lái); đòi bồi thường theo đơn
          bảo hiểm của chính mình
    CIF → người mua cũng chịu tổn thất, nhưng đòi bồi thường theo đơn bảo hiểm người bán
          đã mua cho mình — cháy nằm trong các rủi ro được bảo hiểm kể cả ở mức tối thiểu (ICC C)
    DAP → người bán chịu tổn thất (rủi ro chưa chuyển); đòi bồi thường theo đơn bảo hiểm
          của mình và vẫn phải giao hàng như hợp đồng quy định</code></pre>
<p><strong>(d)</strong> Container được giao cho người chuyên chở tại bãi container Cát Lái — thậm chí được nhận ngay tại xưởng — nhiều ngày trước khi xếp lên tàu. Theo FOB, người bán vẫn chịu rủi ro trong khoảng thời gian đó dù hàng đã ra khỏi tầm kiểm soát của mình. FCA (tại bãi container chỉ định, hoặc tại xưởng người bán) chuyển rủi ro khi container được giao cho người chuyên chở của người mua — vì thế ICC khuyến nghị FCA, CPT hoặc CIP cho hàng container.</p>
<p><strong>Vì sao:</strong> Incoterms không làm chi phí biến mất — chúng chỉ <em>phân bổ</em> chi phí. Chuyển từ FOB sang DDP làm giá chào của người bán tăng từ 41.200 lên 50.050, nhưng tổng chi phí hàng về kho của người mua vẫn là 50.150 trong mọi trường hợp. Quy tắc đúng là quy tắc giao mỗi khâu cho bên thu xếp được rẻ và tin cậy nhất, và đặt rủi ro ở chỗ kiểm soát và bảo hiểm được. Lưu ý CIF và FOB có cùng điểm chuyển rủi ro: trả cước biển không có nghĩa là chịu rủi ro trên biển.</p>`,
  ]]);

const c6q = quiz('scm202-quiz-3', 'Quiz 3 — Transportation & Incoterms|||Quiz 3 — Vận tải & Incoterms', [
  { id: 'q1', question: 'Under FOB (Incoterms 2020), risk passes from the seller to the buyer when…|||Theo FOB (Incoterms 2020), rủi ro chuyển từ người bán sang người mua khi…', options: ['the goods leave the seller’s factory|||hàng rời xưởng của người bán', 'the goods are on board the vessel at the port of shipment|||hàng đã được xếp lên tàu tại cảng bốc hàng', 'the vessel arrives at the port of destination|||tàu cập cảng đến', 'the buyer pays the invoice|||người mua thanh toán hoá đơn'], correctIndex: 1, explanation: 'FOB delivery — and the transfer of risk — happens when the goods are on board at the named port of shipment; payment is not governed by Incoterms.|||Theo FOB, việc giao hàng — và chuyển rủi ro — diễn ra khi hàng đã lên tàu tại cảng bốc hàng quy định; việc thanh toán không do Incoterms điều chỉnh.' },
  { id: 'q2', question: 'Which Incoterms 2020 rule obliges the seller to buy insurance with extensive cover (Institute Cargo Clauses A)?|||Quy tắc Incoterms 2020 nào buộc người bán mua bảo hiểm mức rộng (ICC A)?', options: ['CIF|||CIF', 'CPT|||CPT', 'DAP|||DAP', 'CIP|||CIP'], correctIndex: 3, explanation: 'CIP requires ICC (A) cover; CIF requires only minimum ICC (C) cover; CPT and DAP impose no insurance obligation.|||CIP yêu cầu bảo hiểm ICC (A); CIF chỉ yêu cầu mức tối thiểu ICC (C); CPT và DAP không có nghĩa vụ mua bảo hiểm.' },
  { id: 'q3', question: 'How many TEU does one 40-foot container represent?|||Một container 40 feet tương đương bao nhiêu TEU?', options: ['2 TEU|||2 TEU', '1 TEU|||1 TEU', '4 TEU|||4 TEU', '40 TEU|||40 TEU'], correctIndex: 0, explanation: 'TEU means twenty-foot equivalent unit, so a 40-foot container counts as 2 TEU.|||TEU là đơn vị tương đương container 20 feet, nên một container 40 feet được tính là 2 TEU.' },
]);

const c7 = doc('scm202-4-1-warehousing-purchasing', '4.1 — Warehousing, distribution, 3PL/4PL & purchasing|||4.1 — Kho bãi, phân phối, 3PL/4PL & mua hàng',
  'Kho và trung tâm phân phối, các chức năng kho (lưu trữ, gom hàng, chia lẻ, cross-docking, dịch vụ giá trị gia tăng), quy trình kho và WMS, mạng lưới tập trung – phân tán và quy luật căn bậc hai, 1PL–4PL, lợi ích và rủi ro thuê ngoài, quy trình mua hàng, TCO, ma trận Kraljic, quan hệ nhà cung cấp.',
  [[
    `<span class="eyebrow">SCM202 · Part 4 · Lesson 4.1</span>
<h2>Warehousing, distribution, 3PL/4PL &amp; purchasing</h2>
<h3>Warehouses and distribution centres</h3>
<p>A traditional <strong>warehouse</strong> emphasizes storage; a <strong>distribution centre (DC)</strong> emphasizes <em>flow</em> — receiving, sorting and shipping quickly, with high throughput and short dwell times. Warehousing functions include:</p>
<ul>
<li><strong>Storage</strong> — holding seasonal, safety and anticipation stock.</li>
<li><strong>Consolidation</strong> — combining small shipments from several suppliers into full loads for one destination.</li>
<li><strong>Break-bulk</strong> — splitting a large inbound load into small orders for many customers.</li>
<li><strong>Mixing and cross-docking</strong> — sorting inbound goods straight onto outbound vehicles.</li>
<li><strong>Value-added services</strong> — labelling, kitting, light assembly, market-specific packaging (a form of postponement), returns processing.</li>
</ul>
<p>The core processes are receiving → put-away → storage → order picking → packing → shipping. Picking is typically the most labour-intensive step; common methods are discrete picking (one order at a time), batch, zone and wave picking. A <strong>warehouse management system (WMS)</strong> tracks every location, directs tasks and uses barcodes or RFID to keep records accurate.</p>
<h3>Cross-docking</h3>
<p>In <strong>cross-docking</strong>, goods arriving at the inbound dock are sorted and moved directly to the outbound dock with little or no storage — usually within hours rather than days. It cuts storage and handling costs and speeds up flow, but it requires accurate advance shipment information, tight scheduling and reliable suppliers. It works best for high-volume, predictable items and pre-labelled shipments.</p>
<h3>Centralized vs decentralized networks</h3>
<p>Fewer, centralized DCs pool demand uncertainty, so total safety stock falls. The <strong>square root law</strong> approximates that total safety stock grows with the square root of the number of stocking points (assuming similar, independent demand at each point and the same service level). Consolidating 4 DCs into 1, for example, cuts safety stock to about 1/√4 = 50% of its previous level. Decentralized networks are closer to customers — faster and cheaper final delivery — but carry more inventory.</p>
<h3>Outsourcing: from 1PL to 4PL</h3>
<table>
<tr><th>Level</th><th>Who performs logistics</th></tr>
<tr><td>1PL</td><td>The shipper itself (its own trucks, its own warehouse)</td></tr>
<tr><td>2PL</td><td>Asset-based carriers or warehouse operators providing a single service (a shipping line, a trucking company)</td></tr>
<tr><td>3PL (third-party logistics)</td><td>A provider that performs several integrated logistics activities under contract — transport, warehousing, order fulfilment, customs brokerage</td></tr>
<tr><td>4PL (fourth-party logistics)</td><td>An integrator that manages the client's whole logistics network, including several 3PLs, technology and process design — often without owning physical assets</td></tr>
</table>
<p>Benefits of outsourcing: focus on core competencies, lower cost through the provider's scale, flexibility, access to expertise and technology. Risks: loss of control and visibility, dependence on the provider, service failures that customers still blame on you, hidden costs. Clear contracts, <strong>service level agreements (SLAs)</strong> and KPIs are essential.</p>
<h3>Purchasing and supplier relationships</h3>
<p>Purchased materials and services make up a large part of most manufacturers' costs, so purchasing is strategic, not clerical. The process: identify and specify the need → find and evaluate suppliers → negotiate and contract → place the order → receive and inspect → pay → evaluate supplier performance. Firms first make a <strong>make-or-buy</strong> decision, then judge suppliers on quality, delivery reliability, flexibility, financial stability, sustainability and <strong>total cost of ownership (TCO)</strong> — the price plus the costs of ordering, transport, quality problems, inventory, maintenance and disposal.</p>
<p>The <strong>Kraljic matrix</strong> (Kraljic, 1983) classifies purchases by profit impact and supply risk:</p>
<table>
<tr><th></th><th>Low supply risk</th><th>High supply risk</th></tr>
<tr><td><strong>High profit impact</strong></td><td>Leverage items — use buying power, competitive bidding</td><td>Strategic items — long-term partnerships, joint development</td></tr>
<tr><td><strong>Low profit impact</strong></td><td>Non-critical (routine) items — simplify, automate, e-catalogues</td><td>Bottleneck items — secure supply, hold safety stock, develop alternatives</td></tr>
</table>
<p>Relationships range from <strong>arm's-length (transactional)</strong> — many suppliers, short contracts, a focus on price — to <strong>partnerships and strategic alliances</strong> — few suppliers, long-term contracts, information sharing, joint improvement, and practices such as vendor-managed inventory (VMI). Single sourcing deepens the relationship but raises supply risk; multiple sourcing does the opposite.</p>
<div class="callout"><span class="badge">Key idea</span> A cheap price is not a cheap supplier. Late deliveries, defects and extra inventory can make the lowest-price supplier the most expensive one.</div>`,
    `<span class="eyebrow">SCM202 · Phần 4 · Bài 4.1</span>
<h2>Kho bãi, phân phối, 3PL/4PL &amp; mua hàng</h2>
<h3>Kho và trung tâm phân phối</h3>
<p><strong>Kho</strong> truyền thống chú trọng lưu trữ; <strong>trung tâm phân phối (DC)</strong> chú trọng <em>dòng chảy</em> — nhận, phân loại và xuất hàng nhanh, công suất thông qua lớn và thời gian hàng nằm lại ngắn. Các chức năng kho gồm:</p>
<ul>
<li><strong>Lưu trữ</strong> — giữ tồn kho mùa vụ, tồn kho an toàn và tồn kho dự phòng.</li>
<li><strong>Gom hàng</strong> — gộp các lô nhỏ từ nhiều nhà cung cấp thành chuyến đầy đi một điểm đến.</li>
<li><strong>Chia lẻ (break-bulk)</strong> — tách một lô nhập lớn thành nhiều đơn nhỏ cho nhiều khách hàng.</li>
<li><strong>Phối trộn và cross-docking</strong> — phân loại hàng nhập và chuyển thẳng lên xe xuất.</li>
<li><strong>Dịch vụ giá trị gia tăng</strong> — dán nhãn, đóng bộ, lắp ráp nhẹ, đóng gói theo thị trường (một dạng trì hoãn), xử lý hàng trả lại.</li>
</ul>
<p>Các quy trình cốt lõi: nhận hàng → cất hàng → lưu trữ → lấy hàng theo đơn → đóng gói → xuất hàng. Lấy hàng thường là khâu tốn nhiều nhân công nhất; các cách phổ biến là lấy theo từng đơn, lấy gộp nhiều đơn, lấy theo khu vực và lấy theo đợt. <strong>Hệ thống quản lý kho (WMS)</strong> theo dõi từng vị trí, điều phối công việc và dùng mã vạch hoặc RFID để giữ sổ sách chính xác.</p>
<h3>Cross-docking</h3>
<p>Với <strong>cross-docking</strong> (trung chuyển thẳng), hàng tới cửa nhập được phân loại và chuyển thẳng sang cửa xuất mà gần như không lưu kho — thường trong vài giờ chứ không phải vài ngày. Cách này giảm chi phí lưu trữ, bốc xếp và tăng tốc dòng chảy, nhưng đòi hỏi thông tin báo trước lô hàng chính xác, lịch trình chặt chẽ và nhà cung cấp tin cậy. Nó hiệu quả nhất với hàng khối lượng lớn, nhu cầu dự đoán được và các lô đã dán nhãn sẵn.</p>
<h3>Mạng lưới tập trung và phân tán</h3>
<p>Ít trung tâm phân phối tập trung hơn giúp gộp mức bất định của nhu cầu, nên tổng tồn kho an toàn giảm. <strong>Quy luật căn bậc hai</strong> xấp xỉ rằng tổng tồn kho an toàn tăng theo căn bậc hai của số điểm giữ hàng (giả định nhu cầu ở mỗi điểm tương tự nhau, độc lập nhau và cùng mức phục vụ). Chẳng hạn gộp 4 trung tâm phân phối thành 1 làm tồn kho an toàn giảm còn khoảng 1/√4 = 50% mức cũ. Mạng lưới phân tán gần khách hàng hơn — giao chặng cuối nhanh và rẻ hơn — nhưng phải giữ nhiều hàng hơn.</p>
<h3>Thuê ngoài: từ 1PL tới 4PL</h3>
<table>
<tr><th>Cấp</th><th>Ai thực hiện logistics</th></tr>
<tr><td>1PL</td><td>Chính chủ hàng (xe của mình, kho của mình)</td></tr>
<tr><td>2PL</td><td>Hãng vận tải hoặc đơn vị vận hành kho có tài sản, cung cấp một dịch vụ đơn lẻ (hãng tàu, công ty xe tải)</td></tr>
<tr><td>3PL (logistics bên thứ ba)</td><td>Nhà cung cấp thực hiện nhiều hoạt động logistics tích hợp theo hợp đồng — vận tải, kho bãi, xử lý đơn hàng, khai báo hải quan</td></tr>
<tr><td>4PL (logistics bên thứ tư)</td><td>Đơn vị tích hợp quản lý toàn bộ mạng lưới logistics của khách hàng, gồm nhiều 3PL, công nghệ và thiết kế quy trình — thường không sở hữu tài sản vật chất</td></tr>
</table>
<p>Lợi ích của thuê ngoài: tập trung vào năng lực cốt lõi, chi phí thấp hơn nhờ quy mô của nhà cung cấp, linh hoạt, tiếp cận chuyên môn và công nghệ. Rủi ro: mất kiểm soát và mất khả năng quan sát, phụ thuộc vào nhà cung cấp, lỗi dịch vụ mà khách hàng vẫn đổ cho bạn, chi phí ẩn. Hợp đồng rõ ràng, <strong>thoả thuận mức dịch vụ (SLA)</strong> và KPI là điều bắt buộc.</p>
<h3>Mua hàng và quan hệ nhà cung cấp</h3>
<p>Nguyên vật liệu và dịch vụ mua vào chiếm phần lớn chi phí của đa số nhà sản xuất, nên mua hàng là việc chiến lược chứ không phải việc hành chính. Quy trình: xác định và mô tả nhu cầu → tìm và đánh giá nhà cung cấp → đàm phán và ký hợp đồng → đặt hàng → nhận và kiểm tra hàng → thanh toán → đánh giá kết quả của nhà cung cấp. Doanh nghiệp trước hết quyết định <strong>tự làm hay mua ngoài</strong>, rồi đánh giá nhà cung cấp theo chất lượng, độ tin cậy giao hàng, tính linh hoạt, sức khoẻ tài chính, tính bền vững và <strong>tổng chi phí sở hữu (TCO)</strong> — giá mua cộng chi phí đặt hàng, vận chuyển, lỗi chất lượng, tồn kho, bảo trì và thanh lý.</p>
<p><strong>Ma trận Kraljic</strong> (Kraljic, 1983) phân loại hàng mua theo mức ảnh hưởng tới lợi nhuận và rủi ro nguồn cung:</p>
<table>
<tr><th></th><th>Rủi ro nguồn cung thấp</th><th>Rủi ro nguồn cung cao</th></tr>
<tr><td><strong>Ảnh hưởng lợi nhuận cao</strong></td><td>Hàng đòn bẩy — tận dụng sức mua, đấu thầu cạnh tranh</td><td>Hàng chiến lược — đối tác dài hạn, cùng phát triển</td></tr>
<tr><td><strong>Ảnh hưởng lợi nhuận thấp</strong></td><td>Hàng thông thường — đơn giản hoá, tự động hoá, danh mục điện tử</td><td>Hàng nút thắt — bảo đảm nguồn cung, giữ tồn kho an toàn, phát triển nguồn thay thế</td></tr>
</table>
<p>Quan hệ trải từ <strong>giao dịch thuần tuý (arm’s-length)</strong> — nhiều nhà cung cấp, hợp đồng ngắn, chú trọng giá — tới <strong>đối tác và liên minh chiến lược</strong> — ít nhà cung cấp, hợp đồng dài hạn, chia sẻ thông tin, cùng cải tiến, và các thực hành như tồn kho do nhà cung cấp quản lý (VMI). Một nguồn cung duy nhất làm quan hệ sâu hơn nhưng tăng rủi ro nguồn cung; nhiều nguồn cung thì ngược lại.</p>
<div class="callout"><span class="badge">Ý chính</span> Giá rẻ không có nghĩa là nhà cung cấp rẻ. Giao trễ, hàng lỗi và tồn kho thêm có thể biến nhà cung cấp giá thấp nhất thành nhà cung cấp đắt nhất.</div>`,
  ]]);

const c8 = doc('scm202-4-2-performance-digital-sustainable', '4.2 — Measuring performance; digital & sustainable supply chains|||4.2 — Đo lường hiệu quả; chuỗi cung ứng số & bền vững',
  'Chỉ số dịch vụ (fill rate theo đơn vị, dòng, đơn; OTIF; đơn hàng hoàn hảo), chỉ số tồn kho và tài chính (vòng quay tồn kho, DIO, DSO, DPO, chu kỳ tiền mặt cash-to-cash), công nghệ số (RFID, IoT, tháp điều khiển, AI, tự động hoá, bản sao số, blockchain), bền vững và khả năng chống chịu.',
  [[
    `<span class="eyebrow">SCM202 · Part 4 · Lesson 4.2</span>
<h2>Measuring performance; digital &amp; sustainable supply chains</h2>
<h3>Service metrics</h3>
<pre><code class="language-text">Unit fill rate   = units shipped from stock on the first attempt / units ordered
Line fill rate   = order lines shipped complete / order lines ordered
Order fill rate  = orders shipped complete / orders received
OTIF (on time in full) = orders delivered on time AND complete / total orders
Perfect order rate     = orders on time, in full, undamaged, with correct documents / total orders</code></pre>
<p>Order-level metrics are the strictest: an order with ten lines fails if a single line is short. OTIF must be counted order by order — it cannot be obtained by multiplying the on-time rate by the in-full rate, unless the two kinds of failure are independent.</p>
<h3>Inventory and financial metrics</h3>
<pre><code class="language-text">Inventory turnover = cost of goods sold (COGS) / average inventory (at cost)
Days of inventory (DIO)          = average inventory / COGS × 365     (= 365 / turnover)
Days sales outstanding (DSO)     = accounts receivable / revenue × 365
Days payables outstanding (DPO)  = accounts payable / COGS × 365
Cash-to-cash cycle (C2C)         = DIO + DSO − DPO</code></pre>
<p>The <strong>cash-to-cash cycle</strong> is the number of days between paying suppliers and collecting cash from customers — how long the firm's own money is tied up in operations. Lower is better: it falls when inventory moves faster, customers pay sooner or supplier terms are longer. Some analysts compute DPO on purchases instead of COGS, or use 360 days instead of 365 — state the convention and apply it consistently. Other common metrics include logistics cost as a percentage of sales, order cycle time, forecast accuracy, capacity utilization and the SCOR metrics seen in Lesson 1.1.</p>
<h3>Digital supply chains</h3>
<ul>
<li><strong>Data capture and visibility</strong>: barcodes, RFID, IoT sensors (temperature, location), GPS tracking, EDI and APIs linking partners, and <strong>control towers</strong> that show end-to-end status in one place.</li>
<li><strong>Analytics and AI</strong>: machine-learning demand forecasting, inventory optimization, dynamic routing.</li>
<li><strong>Automation</strong>: warehouse robots, automated storage and retrieval systems (AS/RS), autonomous mobile robots.</li>
<li><strong>Digital twins</strong>: virtual models of a network used to test scenarios before changing the real one.</li>
<li><strong>Blockchain</strong>: shared, tamper-resistant records for tracing origin and documents — useful when many parties must trust the same data.</li>
</ul>
<h3>Sustainable and resilient supply chains</h3>
<ul>
<li><strong>Triple bottom line</strong>: economic, environmental and social performance together.</li>
<li><strong>Emissions</strong>: mode choice (air emits far more per tonne-km than sea or rail), fuller loads, route optimization, energy-efficient warehouses. Under the GHG Protocol, <strong>Scope 3</strong> covers indirect emissions across the upstream and downstream value chain — for many companies the largest share of their footprint.</li>
<li><strong>Reverse logistics and the circular economy</strong>: returns, repair, refurbishment, remanufacturing and recycling keep materials in use longer.</li>
<li><strong>Social responsibility</strong>: supplier codes of conduct, audits, safe working conditions, no child or forced labour.</li>
<li><strong>Resilience</strong>: mapping suppliers beyond tier 1, dual sourcing for critical items, strategic buffers and scenario planning — the ability to recover quickly from disruptions.</li>
</ul>
<div class="callout"><span class="badge">Balance</span> Very lean chains are cheap in normal times but fragile in a disruption; resilient chains cost more to run. Good design decides deliberately where to hold buffers — and measures service, cost and cash together, because improving one at the expense of the others is easy.</div>`,
    `<span class="eyebrow">SCM202 · Phần 4 · Bài 4.2</span>
<h2>Đo lường hiệu quả; chuỗi cung ứng số &amp; bền vững</h2>
<h3>Chỉ số dịch vụ</h3>
<pre><code class="language-text">Fill rate theo đơn vị = số đơn vị xuất từ kho ngay lần đầu / số đơn vị được đặt
Fill rate theo dòng   = số dòng hàng giao đủ / số dòng hàng được đặt
Fill rate theo đơn    = số đơn giao đủ / số đơn nhận được
OTIF (đúng hạn, đủ hàng) = số đơn giao đúng hạn VÀ đủ hàng / tổng số đơn
Tỷ lệ đơn hàng hoàn hảo  = số đơn đúng hạn, đủ hàng, không hư hỏng, chứng từ đúng / tổng số đơn</code></pre>
<p>Chỉ số ở cấp đơn hàng là khắt khe nhất: một đơn mười dòng bị tính là hỏng nếu chỉ một dòng thiếu hàng. OTIF phải được đếm theo từng đơn — không thể lấy tỷ lệ đúng hạn nhân với tỷ lệ đủ hàng, trừ khi hai loại lỗi độc lập với nhau.</p>
<h3>Chỉ số tồn kho và tài chính</h3>
<pre><code class="language-text">Vòng quay tồn kho = giá vốn hàng bán / tồn kho bình quân (theo giá vốn)
Số ngày tồn kho (DIO)      = tồn kho bình quân / giá vốn hàng bán × 365   (= 365 / vòng quay)
Số ngày thu tiền (DSO)     = phải thu khách hàng / doanh thu × 365
Số ngày trả tiền (DPO)     = phải trả người bán / giá vốn hàng bán × 365
Chu kỳ tiền mặt (C2C)      = DIO + DSO − DPO</code></pre>
<p><strong>Chu kỳ tiền mặt (cash-to-cash)</strong> là số ngày từ lúc trả tiền cho nhà cung cấp tới lúc thu tiền từ khách hàng — tiền của chính doanh nghiệp bị chôn trong hoạt động bao lâu. Càng thấp càng tốt: nó giảm khi hàng quay vòng nhanh hơn, khách trả tiền sớm hơn hoặc điều khoản trả chậm với nhà cung cấp dài hơn. Một số nhà phân tích tính DPO theo giá trị mua hàng thay vì giá vốn, hoặc dùng 360 ngày thay cho 365 — hãy nêu rõ quy ước và áp dụng nhất quán. Các chỉ số phổ biến khác: chi phí logistics trên doanh thu, thời gian chu kỳ đơn hàng, độ chính xác dự báo, hiệu suất sử dụng công suất và các chỉ số SCOR đã học ở bài 1.1.</p>
<h3>Chuỗi cung ứng số</h3>
<ul>
<li><strong>Thu thập dữ liệu và minh bạch</strong>: mã vạch, RFID, cảm biến IoT (nhiệt độ, vị trí), định vị GPS, EDI và API kết nối các đối tác, cùng <strong>tháp điều khiển (control tower)</strong> hiển thị trạng thái đầu cuối ở một nơi.</li>
<li><strong>Phân tích dữ liệu và AI</strong>: dự báo nhu cầu bằng học máy, tối ưu tồn kho, định tuyến động.</li>
<li><strong>Tự động hoá</strong>: robot trong kho, hệ thống lưu trữ và lấy hàng tự động (AS/RS), robot di động tự hành.</li>
<li><strong>Bản sao số (digital twin)</strong>: mô hình ảo của mạng lưới dùng để thử kịch bản trước khi thay đổi mạng lưới thật.</li>
<li><strong>Blockchain</strong>: sổ ghi chép dùng chung, khó sửa đổi, để truy xuất nguồn gốc và chứng từ — hữu ích khi nhiều bên cần cùng tin vào một dữ liệu.</li>
</ul>
<h3>Chuỗi cung ứng bền vững và có khả năng chống chịu</h3>
<ul>
<li><strong>Ba trụ cột (triple bottom line)</strong>: kết quả kinh tế, môi trường và xã hội cùng lúc.</li>
<li><strong>Phát thải</strong>: lựa chọn phương thức (hàng không phát thải mỗi tấn-km cao hơn nhiều so với đường biển hay đường sắt), chở đầy xe hơn, tối ưu tuyến, kho tiết kiệm năng lượng. Theo GHG Protocol, <strong>phạm vi 3 (Scope 3)</strong> gồm phát thải gián tiếp trong toàn chuỗi giá trị phía thượng nguồn và hạ nguồn — với nhiều doanh nghiệp đây là phần lớn nhất trong tổng phát thải.</li>
<li><strong>Logistics ngược và kinh tế tuần hoàn</strong>: thu hồi hàng trả lại, sửa chữa, tân trang, tái sản xuất và tái chế giúp vật liệu được dùng lâu hơn.</li>
<li><strong>Trách nhiệm xã hội</strong>: bộ quy tắc ứng xử cho nhà cung cấp, đánh giá tuân thủ, điều kiện làm việc an toàn, không lao động trẻ em hay lao động cưỡng bức.</li>
<li><strong>Khả năng chống chịu</strong>: lập bản đồ nhà cung cấp sâu hơn cấp 1, hai nguồn cung cho hàng trọng yếu, tồn kho đệm chiến lược và lập kế hoạch theo kịch bản — năng lực phục hồi nhanh sau gián đoạn.</li>
</ul>
<div class="callout"><span class="badge">Cân bằng</span> Chuỗi quá tinh gọn rẻ lúc bình thường nhưng dễ gãy khi gián đoạn; chuỗi có khả năng chống chịu tốn kém hơn khi vận hành. Thiết kế tốt chủ động quyết định giữ phần đệm ở đâu — và đo cùng lúc dịch vụ, chi phí và dòng tiền, vì cải thiện một chỉ số bằng cách hy sinh các chỉ số khác là việc rất dễ.</div>`,
  ]]);

const c8e = doc('scm202-4-3-exercise', 'Exercise 3 — turnover, cash-to-cash cycle, fill rate & OTIF|||Bài tập 3 — vòng quay tồn kho, chu kỳ tiền mặt, fill rate & OTIF',
  'Bài tập tình huống giả định: nhà phân phối đồ gia dụng — tính vòng quay tồn kho, DIO, DSO, DPO, chu kỳ tiền mặt, tác động khi cải thiện vòng quay và điều khoản trả chậm (lượng tiền được giải phóng), rồi tính fill rate, tỷ lệ đúng hạn, đủ hàng và OTIF; kèm lời giải.',
  [[
    `<span class="eyebrow">SCM202 · Part 4 · Exercise 3</span>
<h2>Exercise 3 — from the warehouse floor to the cash cycle</h2>
<div class="callout"><span class="badge">Problem</span> A household-appliance distributor (a fictional case, illustrative figures in VND million) reports for the year: revenue 109,500; cost of goods sold (COGS) 73,000; inventory 9,200 at the beginning of the year and 10,800 at the end; accounts receivable 15,000; accounts payable 8,000. Use a 365-day year and COGS for DPO. (a) Compute inventory turnover and days of inventory (DIO). (b) Compute DSO, DPO and the cash-to-cash cycle. (c) Management wants a turnover of 10 times and negotiates supplier terms that raise accounts payable to 9,000, with DSO unchanged. Find the new DIO, DPO and cash-to-cash cycle, and the cash released. (d) In one month the company received 500 orders for 40,000 units in total; 38,800 units were shipped from stock; 460 orders arrived on time, 470 arrived complete and 440 were both on time and complete. Compute the unit fill rate, on-time rate, in-full rate and OTIF.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Average inventory = (9,200 + 10,800) / 2 = 10,000
    Inventory turnover = 73,000 / 10,000 = 7.3 times a year
    DIO = 10,000 / 73,000 × 365 = 50 days        (check: 365 / 7.3 = 50)

(b) DSO = 15,000 / 109,500 × 365 = 50 days
    DPO =  8,000 /  73,000 × 365 = 40 days
    Cash-to-cash = DIO + DSO − DPO = 50 + 50 − 40 = 60 days

(c) Average inventory for 10 turns = 73,000 / 10 = 7,300 → DIO = 7,300 / 73,000 × 365 = 36.5 days
    DPO = 9,000 / 73,000 × 365 = 45 days
    Cash-to-cash = 36.5 + 50 − 45 = 41.5 days     (18.5 days shorter)
    Cash released: inventory 10,000 − 7,300 = 2,700
                   extra supplier credit 9,000 − 8,000 = 1,000
                   total = 3,700 (VND million)

(d) Unit fill rate = 38,800 / 40,000 = 97%
    On-time rate   = 460 / 500 = 92%
    In-full rate   = 470 / 500 = 94%
    OTIF           = 440 / 500 = 88%
    (92% × 94% = 86.48% ≠ 88%: OTIF must be counted order by order)</code></pre>
<p><strong>Why:</strong> every day cut from the cash-to-cash cycle is working capital the company no longer has to finance — here 3,700 million is freed, mostly by faster-moving inventory. Stretching supplier payments also shortens the cycle, but pushed too far it simply shifts the burden upstream and can damage relationships or raise prices. Part (d) shows why customers judge you on order-level metrics: a 97% unit fill rate sounds excellent, yet 12% of orders were late, incomplete or both.</p>`,
    `<span class="eyebrow">SCM202 · Phần 4 · Bài tập 3</span>
<h2>Bài tập 3 — từ sàn kho tới chu kỳ tiền mặt</h2>
<div class="callout"><span class="badge">Đề</span> Một nhà phân phối đồ gia dụng (tình huống giả định, số liệu minh hoạ tính bằng triệu đồng) báo cáo trong năm: doanh thu 109.500; giá vốn hàng bán 73.000; tồn kho đầu năm 9.200 và cuối năm 10.800; phải thu khách hàng 15.000; phải trả người bán 8.000. Dùng năm 365 ngày và tính DPO theo giá vốn. (a) Tính vòng quay tồn kho và số ngày tồn kho (DIO). (b) Tính DSO, DPO và chu kỳ tiền mặt. (c) Ban lãnh đạo muốn vòng quay đạt 10 lần và đàm phán được điều khoản trả chậm làm phải trả người bán tăng lên 9.000, DSO giữ nguyên. Tính DIO, DPO, chu kỳ tiền mặt mới và lượng tiền được giải phóng. (d) Trong một tháng, công ty nhận 500 đơn với tổng cộng 40.000 đơn vị; 38.800 đơn vị được xuất từ kho; 460 đơn tới đúng hạn, 470 đơn đủ hàng và 440 đơn vừa đúng hạn vừa đủ hàng. Tính fill rate theo đơn vị, tỷ lệ đúng hạn, tỷ lệ đủ hàng và OTIF.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Tồn kho bình quân = (9.200 + 10.800) / 2 = 10.000
    Vòng quay tồn kho  = 73.000 / 10.000 = 7,3 lần mỗi năm
    DIO = 10.000 / 73.000 × 365 = 50 ngày        (kiểm tra: 365 / 7,3 = 50)

(b) DSO = 15.000 / 109.500 × 365 = 50 ngày
    DPO =  8.000 /  73.000 × 365 = 40 ngày
    Chu kỳ tiền mặt = DIO + DSO − DPO = 50 + 50 − 40 = 60 ngày

(c) Tồn kho bình quân để quay 10 vòng = 73.000 / 10 = 7.300 → DIO = 7.300 / 73.000 × 365 = 36,5 ngày
    DPO = 9.000 / 73.000 × 365 = 45 ngày
    Chu kỳ tiền mặt = 36,5 + 50 − 45 = 41,5 ngày   (ngắn hơn 18,5 ngày)
    Tiền được giải phóng: từ tồn kho 10.000 − 7.300 = 2.700
                          từ tín dụng nhà cung cấp tăng thêm 9.000 − 8.000 = 1.000
                          tổng = 3.700 (triệu đồng)

(d) Fill rate theo đơn vị = 38.800 / 40.000 = 97%
    Tỷ lệ đúng hạn        = 460 / 500 = 92%
    Tỷ lệ đủ hàng         = 470 / 500 = 94%
    OTIF                  = 440 / 500 = 88%
    (92% × 94% = 86,48% ≠ 88%: OTIF phải được đếm theo từng đơn)</code></pre>
<p><strong>Vì sao:</strong> mỗi ngày rút ngắn được trong chu kỳ tiền mặt là một phần vốn lưu động doanh nghiệp không còn phải tài trợ — ở đây 3.700 triệu đồng được giải phóng, chủ yếu nhờ hàng quay vòng nhanh hơn. Kéo dài thời hạn trả tiền nhà cung cấp cũng rút ngắn chu kỳ, nhưng nếu đẩy quá mức thì chỉ là dồn gánh nặng lên thượng nguồn, có thể làm hỏng quan hệ hoặc khiến giá mua tăng. Câu (d) cho thấy vì sao khách hàng đánh giá bạn theo chỉ số cấp đơn hàng: fill rate theo đơn vị 97% nghe rất tốt, vậy mà 12% số đơn bị trễ, thiếu hoặc cả hai.</p>`,
  ]]);

const c8q = quiz('scm202-quiz-4', 'Quiz 4 — Warehousing, purchasing & performance|||Quiz 4 — Kho bãi, mua hàng & đo lường hiệu quả', [
  { id: 'q1', question: 'Cross-docking means…|||Cross-docking là…', options: ['storing goods for a long period to wait for better prices|||lưu kho dài ngày để chờ giá tốt hơn', 'returning defective goods to suppliers|||trả hàng lỗi cho nhà cung cấp', 'moving inbound goods directly to outbound vehicles with little or no storage|||chuyển hàng nhập thẳng sang phương tiện xuất, gần như không lưu kho', 'outsourcing all logistics activities to a 4PL|||thuê một 4PL làm toàn bộ hoạt động logistics'], correctIndex: 2, explanation: 'Cross-docking replaces storage with fast sorting between inbound and outbound docks; it needs accurate advance information and tight scheduling.|||Cross-docking thay việc lưu kho bằng phân loại nhanh giữa cửa nhập và cửa xuất; nó cần thông tin báo trước chính xác và lịch trình chặt chẽ.' },
  { id: 'q2', question: 'Days of inventory are 45, days sales outstanding 30 and days payables outstanding 35. What is the cash-to-cash cycle?|||Số ngày tồn kho là 45, số ngày thu tiền 30 và số ngày trả tiền 35. Chu kỳ tiền mặt là bao nhiêu?', options: ['40 days|||40 ngày', '110 days|||110 ngày', '50 days|||50 ngày', '10 days|||10 ngày'], correctIndex: 0, explanation: 'Cash-to-cash = DIO + DSO − DPO = 45 + 30 − 35 = 40 days.|||Chu kỳ tiền mặt = DIO + DSO − DPO = 45 + 30 − 35 = 40 ngày.' },
  { id: 'q3', question: 'In the Kraljic matrix, purchases with high profit impact but low supply risk are…|||Trong ma trận Kraljic, hàng mua có ảnh hưởng lợi nhuận cao nhưng rủi ro nguồn cung thấp là…', options: ['strategic items|||hàng chiến lược', 'bottleneck items|||hàng nút thắt', 'non-critical items|||hàng thông thường', 'leverage items|||hàng đòn bẩy'], correctIndex: 3, explanation: 'Many capable suppliers and a big spend let the buyer use its purchasing power; strategic items combine high impact with high supply risk.|||Nhiều nhà cung cấp đủ năng lực và giá trị mua lớn cho phép người mua tận dụng sức mua; hàng chiến lược là loại vừa ảnh hưởng cao vừa rủi ro nguồn cung cao.' },
]);

const taiLieu = doc('scm202-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">SCM202 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning logistics and supply chain management: the official syllabus and slides, books, free official resources, video channels, tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official SCM202 syllabus and lecture slides.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">Logistics &amp; Supply Chain Management</a> — Martin Christopher (Pearson / FT Publishing) — a widely used text; search the title on the publisher site.</li>
<li><a href="https://www.cengage.com/" target="_blank" rel="noopener">Supply Chain Management: A Logistics Perspective</a> — John J. Coyle and co-authors (Cengage); search the title on the publisher site.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://www.ascm.org/" target="_blank" rel="noopener">ASCM</a> — the association behind the SCOR model and supply chain certifications.</li>
<li><a href="https://iccwbo.org/business-solutions/incoterms-rules/" target="_blank" rel="noopener">ICC — Incoterms rules</a> — the official page of the International Chamber of Commerce on Incoterms 2020.</li>
<li><a href="https://ocw.mit.edu/" target="_blank" rel="noopener">MIT OpenCourseWare</a> — free MIT course materials, including logistics and supply chain courses.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MITCTL" target="_blank" rel="noopener">MIT Center for Transportation &amp; Logistics</a> — research talks and lectures.</li>
<li><a href="https://www.youtube.com/@SupplyChainNow" target="_blank" rel="noopener">Supply Chain Now</a> — interviews with practitioners.</li>
<li><a href="https://www.youtube.com/@Maersk" target="_blank" rel="noopener">Maersk</a> — how container shipping and ports work.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.microsoft.com/en-us/microsoft-365/excel" target="_blank" rel="noopener">Microsoft Excel</a> — EOQ, reorder point and ABC analysis like Exercise 1.</li>
<li><a href="https://www.freightos.com/" target="_blank" rel="noopener">Freightos</a> — freight marketplace — see how shipping quotes are built.</li>
<li><a href="https://www.flexport.com/" target="_blank" rel="noopener">Flexport</a> — freight forwarding and trade learning resources.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — flows, SCOR and supply chain strategy, following Part 1 here.</li>
<li><strong>Practise</strong> — repeat EOQ, reorder-point and ABC calculations on your own data.</li>
<li><strong>Go deeper</strong> — compare Incoterms and transport costs for a sample shipment.</li>
<li><strong>Apply</strong> — map the supply chain of a product you buy and propose four KPIs.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">SCM202 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học logistics và quản lý chuỗi cung ứng: giáo trình &amp; slide chính thức, sách, tài liệu miễn phí chính thống, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc giáo trình và slide bài giảng chính thức của SCM202.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">Logistics &amp; Supply Chain Management</a> — Martin Christopher (Pearson / FT Publishing) — giáo trình được dùng rộng rãi; tra tên sách trên trang nhà xuất bản.</li>
<li><a href="https://www.cengage.com/" target="_blank" rel="noopener">Supply Chain Management: A Logistics Perspective</a> — John J. Coyle và cộng sự (Cengage); tra tên sách trên trang nhà xuất bản.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://www.ascm.org/" target="_blank" rel="noopener">ASCM</a> — hiệp hội đứng sau mô hình SCOR và các chứng chỉ chuỗi cung ứng.</li>
<li><a href="https://iccwbo.org/business-solutions/incoterms-rules/" target="_blank" rel="noopener">ICC — Incoterms rules</a> — trang chính thức của Phòng Thương mại Quốc tế về Incoterms 2020.</li>
<li><a href="https://ocw.mit.edu/" target="_blank" rel="noopener">MIT OpenCourseWare</a> — học liệu miễn phí của MIT, gồm các môn logistics và chuỗi cung ứng.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MITCTL" target="_blank" rel="noopener">MIT Center for Transportation &amp; Logistics</a> — bài giảng và trình bày nghiên cứu.</li>
<li><a href="https://www.youtube.com/@SupplyChainNow" target="_blank" rel="noopener">Supply Chain Now</a> — phỏng vấn người làm nghề.</li>
<li><a href="https://www.youtube.com/@Maersk" target="_blank" rel="noopener">Maersk</a> — vận tải container và cảng biển vận hành thế nào.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.microsoft.com/en-us/microsoft-365/excel" target="_blank" rel="noopener">Microsoft Excel</a> — EOQ, điểm đặt hàng lại và phân tích ABC như Bài tập 1.</li>
<li><a href="https://www.freightos.com/" target="_blank" rel="noopener">Freightos</a> — sàn cước vận tải — xem báo giá vận chuyển được hình thành thế nào.</li>
<li><a href="https://www.flexport.com/" target="_blank" rel="noopener">Flexport</a> — giao nhận vận tải và tài nguyên học về thương mại.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — các dòng chảy, SCOR và chiến lược chuỗi cung ứng, theo đúng Phần 1 ở đây.</li>
<li><strong>Luyện tập</strong> — làm lại tính EOQ, điểm đặt hàng lại và ABC với dữ liệu của chính bạn.</li>
<li><strong>Đào sâu</strong> — so sánh Incoterms và chi phí vận tải cho một lô hàng mẫu.</li>
<li><strong>Vận dụng</strong> — vẽ chuỗi cung ứng của một sản phẩm bạn mua và đề xuất bốn chỉ số KPI.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'SCM202',
    slug: 'scm202-39nhap-m244n-quan-l253-logistics-v224-chuoi-cung-ung',
    title: 'Nhập môn Quản lý Logistics và chuỗi cung ứng',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SCM202.webp',
    shortDescription: 'How goods, information and money flow from suppliers to customers: SCOR, strategy, the bullwhip effect, inventory (EOQ, safety stock, ABC), transport, Incoterms 2020, warehousing, 3PL, purchasing and KPIs. Bilingual, with exercises.|||Dòng hàng, thông tin và tiền từ nhà cung cấp tới khách hàng: SCOR, chiến lược, hiệu ứng roi da, tồn kho (EOQ, tồn kho an toàn, ABC), vận tải, Incoterms 2020, kho bãi, 3PL, mua hàng và KPI. Song ngữ, có bài tập.',
    description: 'Môn <strong>SCM202 — Nhập môn Quản lý Logistics và chuỗi cung ứng (Introduction to Logistics and Supply Chain Management)</strong> (khối Quản trị Kinh doanh, kỳ 2) giới thiệu cách quản lý <strong>dòng hàng hoá, thông tin và tiền</strong> từ nhà cung cấp tới khách hàng. Từ <strong>khái niệm, mục tiêu, đơn hàng hoàn hảo và mô hình SCOR</strong> → <strong>chiến lược chuỗi cung ứng</strong> (khung của Fisher, đẩy/kéo, điểm tách) và <strong>hiệu ứng roi da</strong> → <strong>quản lý tồn kho</strong> (EOQ, điểm đặt hàng lại, tồn kho an toàn, ABC) → <strong>vận tải và Incoterms 2020</strong> → <strong>kho bãi, cross-docking, 3PL/4PL, mua hàng</strong> và <strong>đo lường hiệu quả</strong> (fill rate, OTIF, vòng quay tồn kho, chu kỳ tiền mặt), chuỗi cung ứng số và bền vững. Bám cấu trúc giáo trình chuẩn (Christopher; Chopra và Meindl; Coyle và cộng sự), song ngữ Anh–Việt, có bài tập tính toán và tình huống (số liệu giả định) kèm lời giải, quiz cuối mỗi phần.',
    whatYouLearn: 'Giải thích logistics, quản trị chuỗi cung ứng, ba dòng chảy và mục tiêu đơn hàng hoàn hảo\nMô tả chuỗi cung ứng bằng mô hình SCOR và cân bằng mức phục vụ với tổng chi phí\nChọn chuỗi hiệu quả hay đáp ứng nhanh theo khung Fisher; xác định ranh giới đẩy/kéo và điểm tách\nGiải thích bốn nguyên nhân của hiệu ứng roi da và đề xuất biện pháp giảm thiểu\nTính EOQ, điểm đặt hàng lại, tồn kho an toàn và phân loại hàng theo ABC\nSo sánh các phương thức vận tải; phân bổ chi phí và rủi ro theo Incoterms 2020\nHiểu vai trò kho, cross-docking, thuê ngoài 3PL/4PL và quản lý quan hệ nhà cung cấp\nĐo fill rate, OTIF, vòng quay tồn kho, chu kỳ tiền mặt; nắm xu hướng chuỗi cung ứng số và bền vững',
    requirements: 'Không cần kiến thức logistics trước\nToán cơ bản: tỷ lệ phần trăm, căn bậc hai; biết dùng bảng tính (Excel hoặc Google Sheets) là lợi thế\nNên có nền tảng nhập môn kinh doanh, marketing hoặc kế toán (không bắt buộc)',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Logistics và chuỗi cung ứng là gì, ba dòng chảy, 7 đúng, lộ trình.', lessons: [intro] },
    { title: 'Part 1 — Foundations, SCOR & supply chain strategy|||Phần 1 — Nền tảng, SCOR & chiến lược chuỗi cung ứng', description: 'Đơn hàng hoàn hảo, tổng chi phí, SCOR, khung Fisher, đẩy/kéo, điểm tách, hiệu ứng roi da.', lessons: [c1, c2, c3, c3q] },
    { title: 'Part 2 — Inventory management|||Phần 2 — Quản lý tồn kho', description: 'Chi phí tồn kho, EOQ, điểm đặt hàng lại, tồn kho an toàn, ABC.', lessons: [c4, c4e, c4q] },
    { title: 'Part 3 — Transportation & Incoterms 2020|||Phần 3 — Vận tải & Incoterms 2020', description: 'Năm phương thức vận tải, container, đa phương thức, 11 quy tắc Incoterms 2020.', lessons: [c5, c6, c6e, c6q] },
    { title: 'Part 4 — Warehousing, purchasing & performance|||Phần 4 — Kho bãi, mua hàng & đo lường hiệu quả', description: 'Kho, cross-docking, 3PL/4PL, Kraljic, fill rate, OTIF, cash-to-cash, số hoá, bền vững.', lessons: [c7, c8, c8e, c8q] },
  ],
};
