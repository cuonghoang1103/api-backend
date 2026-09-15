/**
 * SCM201 — Supply Chain Management. Giáo trình (trích dẫn, KHÔNG upload PDF):
 * Chopra & Meindl "Supply Chain Management: Strategy, Planning, and Operation";
 * Simchi-Levi "Designing and Managing the Supply Chain". Môn NHẬP MÔN nền tảng —
 * tổng quan chuỗi cung ứng; SCM302 (Procurement) & SCM303 (Logistics) đi sâu riêng.
 * Song ngữ + ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('scm201-0-1-overview', 'Course overview: Supply Chain Management|||Tổng quan: Quản trị Chuỗi Cung ứng',
  'Chuỗi cung ứng là gì, thặng dư chuỗi cung ứng, sự phù hợp chiến lược (responsive vs efficient); lộ trình 8 chương từ tổng quan đến công nghệ số.',
  [[
    `<span class="eyebrow">SCM201 · Lesson 0.1 · Overview</span>
<h2>Supply Chain Management</h2>
<p class="lead">This course helps you understand <strong>how supply chains create value</strong> — every organization, from raw-material supplier to the customer's doorstep, working together to get the right product to the right place at the right cost. You'll learn the building blocks (flows, forecasting, inventory, network design, relationships, coordination, performance) that make a supply chain either a competitive weapon or a costly bottleneck.</p>
<h3>What is a supply chain?</h3>
<p>A <strong>supply chain</strong> is the network of suppliers, manufacturers, distributors, retailers and customers — plus the flows of product, information and money between them — involved in bringing a product or service to the end customer.</p>
<h3>Supply chain surplus</h3>
<p>The goal of supply chain management is NOT to minimize cost or maximize service alone — it is to maximize <strong>supply chain surplus = customer value − total supply chain cost</strong>. Every decision (forecasting, inventory, network, sourcing) should be judged against this single yardstick.</p>
<h3>Roadmap</h3>
<p>Overview &amp; strategic fit → flows in the supply chain → demand forecasting &amp; planning → inventory management → network &amp; distribution design → supplier &amp; customer relationships → the bullwhip effect &amp; coordination → performance measurement, sustainability &amp; digital technology.</p>`,
    `<span class="eyebrow">SCM201 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị Chuỗi Cung ứng</h2>
<p class="lead">Môn này giúp bạn hiểu <strong>chuỗi cung ứng tạo ra giá trị thế nào</strong> — mọi tổ chức, từ nhà cung cấp nguyên liệu đến tận cửa nhà khách hàng, cùng phối hợp để đưa đúng sản phẩm đến đúng nơi với chi phí hợp lý. Bạn sẽ học các mảnh ghép nền tảng (dòng chảy, dự báo, tồn kho, thiết kế mạng lưới, quan hệ, phối hợp, hiệu suất) khiến một chuỗi cung ứng trở thành lợi thế cạnh tranh hoặc điểm nghẽn tốn kém.</p>
<h3>Chuỗi cung ứng là gì?</h3>
<p>Một <strong>chuỗi cung ứng (supply chain)</strong> là mạng lưới nhà cung cấp, nhà sản xuất, nhà phân phối, nhà bán lẻ và khách hàng — cùng các dòng chảy sản phẩm, thông tin và tiền giữa họ — tham gia đưa một sản phẩm/dịch vụ đến khách hàng cuối.</p>
<h3>Thặng dư chuỗi cung ứng</h3>
<p>Mục tiêu của quản trị chuỗi cung ứng KHÔNG phải chỉ giảm chi phí hay chỉ tăng dịch vụ — mà là tối đa hoá <strong>thặng dư chuỗi cung ứng = giá trị khách hàng nhận được − tổng chi phí cả chuỗi</strong>. Mọi quyết định (dự báo, tồn kho, mạng lưới, thu mua) phải được đánh giá theo đúng một thước đo này.</p>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; sự phù hợp chiến lược → dòng chảy trong chuỗi cung ứng → dự báo &amp; lập kế hoạch nhu cầu → quản lý tồn kho → thiết kế mạng lưới &amp; phân phối → quan hệ nhà cung cấp &amp; khách hàng → hiệu ứng bullwhip &amp; phối hợp → đo lường hiệu suất, bền vững &amp; công nghệ số.</p>`,
  ]]);

const c1 = doc('scm201-1-1-overview-strategic-fit', '1.1 — Supply chain overview & strategic fit|||1.1 — Tổng quan chuỗi cung ứng & sự phù hợp chiến lược',
  'Chuỗi cung ứng, thặng dư chuỗi cung ứng; sự phù hợp chiến lược giữa chiến lược cạnh tranh & chiến lược chuỗi cung ứng; phổ đáp ứng nhanh–hiệu quả.',
  [[
    `<span class="eyebrow">SCM201 · Chapter 1 · Lesson 1.1</span>
<h2>Supply chain overview &amp; strategic fit</h2>
<h3>Why supply chains matter strategically</h3>
<p>A company's supply chain decisions (where to make, how much to stock, how to deliver) directly shape whether it can compete on <strong>cost</strong> (like Walmart) or on <strong>responsiveness</strong> (like Zara's fast fashion). There is no single "best" supply chain — only one that <em>fits</em> the competitive strategy.</p>
<h3>Strategic fit</h3>
<p><strong>Strategic fit</strong> means the supply chain strategy matches the competitive strategy: both must aim to satisfy the same customer priorities (low price, wide variety, fast delivery, high service). A cheap, slow supply chain paired with a "next-day delivery" promise is a mismatch that destroys value.</p>
<h3>The responsiveness–efficiency spectrum</h3>
<pre><code>Efficient  &lt;--------------------------&gt;  Responsive
(low cost, predictable demand)       (fast, flexible, uncertain demand)
Example: staple groceries             Example: fashion, new tech launches</code></pre>
<p>Customer demand uncertainty (implied demand uncertainty) should determine where a supply chain sits on this spectrum — high uncertainty needs a responsive chain; low uncertainty rewards an efficient one.</p>
<div class="callout"><span class="badge">Key idea</span> Supply chain management is a source of competitive advantage, not just a cost center — the strategy question is "efficient or responsive," and the answer must match what customers actually value.</div>`,
    `<span class="eyebrow">SCM201 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan chuỗi cung ứng &amp; sự phù hợp chiến lược</h2>
<h3>Vì sao chuỗi cung ứng quan trọng về chiến lược</h3>
<p>Các quyết định chuỗi cung ứng của một công ty (sản xuất ở đâu, dự trữ bao nhiêu, giao hàng thế nào) quyết định trực tiếp việc công ty cạnh tranh bằng <strong>chi phí</strong> (như Walmart) hay bằng <strong>tốc độ đáp ứng</strong> (như thời trang nhanh Zara). Không có chuỗi cung ứng "tốt nhất" duy nhất — chỉ có chuỗi <em>phù hợp</em> với chiến lược cạnh tranh.</p>
<h3>Sự phù hợp chiến lược (strategic fit)</h3>
<p><strong>Sự phù hợp chiến lược</strong> nghĩa là chiến lược chuỗi cung ứng khớp với chiến lược cạnh tranh: cả hai phải cùng hướng đến những ưu tiên khách hàng giống nhau (giá rẻ, đa dạng, giao nhanh, dịch vụ tốt). Một chuỗi cung ứng rẻ, chậm mà đi kèm lời hứa "giao trong ngày" là một sự lệch pha phá hủy giá trị.</p>
<h3>Phổ đáp ứng nhanh – hiệu quả</h3>
<pre><code>Hiệu quả (efficient)  &lt;--------------------------&gt;  Đáp ứng nhanh (responsive)
(chi phí thấp, nhu cầu dự đoán được)                (nhanh, linh hoạt, nhu cầu bất định)
Ví dụ: hàng tiêu dùng thiết yếu                      Ví dụ: thời trang, sản phẩm công nghệ mới ra mắt</code></pre>
<p>Mức độ bất định của nhu cầu ngầm (implied demand uncertainty) nên quyết định vị trí chuỗi cung ứng trên phổ này — bất định cao cần chuỗi đáp ứng nhanh; bất định thấp thì chuỗi hiệu quả có lợi hơn.</p>
<div class="callout"><span class="badge">Ý chính</span> Quản trị chuỗi cung ứng là nguồn lợi thế cạnh tranh, không chỉ là trung tâm chi phí — câu hỏi chiến lược là "hiệu quả hay đáp ứng nhanh," và câu trả lời phải khớp với điều khách hàng thật sự coi trọng.</div>`,
  ]]);

const c1q = quiz('scm201-quiz-1', 'Quiz 1 — Overview & strategic fit|||Quiz 1 — Tổng quan & sự phù hợp chiến lược', [
  { id: 'q1', question: 'Mục tiêu của quản trị chuỗi cung ứng là gì?', options: ['Chỉ giảm chi phí vận chuyển', 'Tối đa hoá thặng dư chuỗi cung ứng (giá trị khách hàng − chi phí cả chuỗi)', 'Chỉ tối đa hoá tồn kho', 'Chỉ giảm số nhà cung cấp'], correctIndex: 1, explanation: 'Thặng dư chuỗi cung ứng = giá trị khách hàng nhận được − tổng chi phí cả chuỗi; đây là thước đo trung tâm.' },
  { id: 'q2', question: 'Chuỗi cung ứng cho hàng thời trang nhanh, nhu cầu khó đoán, nên định hướng theo?', options: ['Hiệu quả (efficient)', 'Đáp ứng nhanh (responsive)', 'Không cần chiến lược riêng', 'Tối thiểu tồn kho tuyệt đối'], correctIndex: 1, explanation: 'Nhu cầu bất định cao đòi hỏi chuỗi cung ứng đáp ứng nhanh, linh hoạt.' },
  { id: 'q3', question: '"Sự phù hợp chiến lược" (strategic fit) nghĩa là gì?', options: ['Chuỗi cung ứng càng rẻ càng tốt', 'Chiến lược chuỗi cung ứng khớp với chiến lược cạnh tranh & ưu tiên khách hàng', 'Chỉ áp dụng cho công ty sản xuất', 'Không liên quan đến khách hàng'], correctIndex: 1, explanation: 'Chiến lược chuỗi cung ứng và chiến lược cạnh tranh phải cùng nhắm tới cùng ưu tiên khách hàng.' },
]);

const c2 = doc('scm201-2-1-components-flows', '2.1 — Supply chain components & flows|||2.1 — Các thành phần & dòng chảy trong chuỗi cung ứng',
  'Các thành phần: nhà cung cấp, nhà sản xuất, nhà phân phối, nhà bán lẻ, khách hàng; ba dòng chảy: sản phẩm, thông tin, tài chính; ranh giới push/pull.',
  [[
    `<span class="eyebrow">SCM201 · Chapter 2 · Lesson 2.1</span>
<h2>Supply chain components &amp; flows</h2>
<h3>Who is in a supply chain</h3>
<p>A typical supply chain has five types of players: <strong>suppliers</strong> (raw materials), <strong>manufacturers</strong> (turn inputs into products), <strong>distributors/wholesalers</strong> (aggregate &amp; break bulk), <strong>retailers</strong> (sell to end customers), and <strong>customers</strong>. Real chains are networks, not straight lines — one manufacturer may feed many retailers, and one retailer may buy from many distributors.</p>
<h3>Three flows</h3>
<pre><code>Suppliers -&gt; Manufacturers -&gt; Distributors -&gt; Retailers -&gt; Customers   (product/material flow, downstream)
Suppliers &lt;- Manufacturers &lt;- Distributors &lt;- Retailers &lt;- Customers   (cash flow, upstream)
Suppliers &lt;-&gt; Manufacturers &lt;-&gt; Distributors &lt;-&gt; Retailers &lt;-&gt; Customers (information flow, both ways)</code></pre>
<ul>
<li><strong>Product/material flow</strong> — goods moving from raw material toward the end customer.</li>
<li><strong>Information flow</strong> — orders, forecasts, inventory levels, shipment status — flows both ways and is what lets the other two flows be planned instead of guessed.</li>
<li><strong>Financial/cash flow</strong> — payments generally flow upstream (customer → retailer → ... → supplier), the opposite direction of goods.</li>
</ul>
<h3>Push vs. pull boundary</h3>
<p>Processes are <strong>push</strong> (executed in anticipation of demand — forecast-driven) or <strong>pull</strong> (executed in response to an actual customer order). The <strong>push-pull boundary</strong> is where a supply chain switches from forecast-driven to order-driven — moving it earlier (more pull) increases responsiveness but often raises cost.</p>
<div class="callout"><span class="badge">Key idea</span> A supply chain is only as good as its weakest flow — a fast product flow with no information flow just moves inventory blindly.</div>`,
    `<span class="eyebrow">SCM201 · Chương 2 · Bài 2.1</span>
<h2>Các thành phần &amp; dòng chảy trong chuỗi cung ứng</h2>
<h3>Ai tham gia trong chuỗi cung ứng</h3>
<p>Một chuỗi cung ứng điển hình có năm nhóm người tham gia: <strong>nhà cung cấp</strong> (nguyên vật liệu), <strong>nhà sản xuất</strong> (biến đầu vào thành sản phẩm), <strong>nhà phân phối/bán sỉ</strong> (gom hàng &amp; chia nhỏ lô), <strong>nhà bán lẻ</strong> (bán cho khách hàng cuối), và <strong>khách hàng</strong>. Chuỗi cung ứng thật là mạng lưới, không phải một đường thẳng — một nhà sản xuất có thể cung cho nhiều nhà bán lẻ, một nhà bán lẻ có thể mua từ nhiều nhà phân phối.</p>
<h3>Ba dòng chảy</h3>
<pre><code>Nhà cung cấp -&gt; Nhà sản xuất -&gt; Nhà phân phối -&gt; Nhà bán lẻ -&gt; Khách hàng   (dòng sản phẩm/vật chất, xuôi dòng)
Nhà cung cấp &lt;- Nhà sản xuất &lt;- Nhà phân phối &lt;- Nhà bán lẻ &lt;- Khách hàng   (dòng tiền, ngược dòng)
Nhà cung cấp &lt;-&gt; Nhà sản xuất &lt;-&gt; Nhà phân phối &lt;-&gt; Nhà bán lẻ &lt;-&gt; Khách hàng (dòng thông tin, hai chiều)</code></pre>
<ul>
<li><strong>Dòng sản phẩm/vật chất</strong> — hàng hoá di chuyển từ nguyên liệu đến khách hàng cuối.</li>
<li><strong>Dòng thông tin</strong> — đơn hàng, dự báo, mức tồn kho, tình trạng vận chuyển — chảy hai chiều và là thứ giúp hai dòng còn lại được lập kế hoạch thay vì đoán mò.</li>
<li><strong>Dòng tài chính/tiền</strong> — thanh toán thường chảy ngược dòng (khách hàng → nhà bán lẻ → ... → nhà cung cấp), ngược hướng với hàng hoá.</li>
</ul>
<h3>Ranh giới push/pull</h3>
<p>Các quy trình là <strong>push</strong> (thực hiện đón đầu nhu cầu — dựa trên dự báo) hoặc <strong>pull</strong> (thực hiện đáp lại một đơn hàng thật của khách). <strong>Ranh giới push-pull</strong> là điểm chuỗi cung ứng chuyển từ dựa-dự-báo sang dựa-đơn-hàng — đẩy ranh giới này sớm hơn (nhiều pull hơn) tăng khả năng đáp ứng nhưng thường tăng chi phí.</p>
<div class="callout"><span class="badge">Ý chính</span> Chuỗi cung ứng chỉ tốt bằng dòng chảy yếu nhất của nó — dòng sản phẩm nhanh mà không có dòng thông tin thì chỉ là di chuyển hàng một cách mù quáng.</div>`,
  ]]);

const c2q = quiz('scm201-quiz-2', 'Quiz 2 — Components & flows|||Quiz 2 — Thành phần & dòng chảy', [
  { id: 'q1', question: 'Ba dòng chảy chính trong chuỗi cung ứng là gì?', options: ['Sản phẩm, thông tin, tài chính', 'Sản phẩm, nhân sự, thiết bị', 'Thông tin, marketing, bán hàng', 'Tài chính, pháp lý, thuế'], correctIndex: 0, explanation: 'Chuỗi cung ứng vận hành nhờ dòng sản phẩm/vật chất, dòng thông tin, và dòng tài chính.' },
  { id: 'q2', question: 'Dòng tiền trong chuỗi cung ứng thường chảy theo hướng nào?', options: ['Cùng hướng với dòng sản phẩm', 'Ngược hướng với dòng sản phẩm (từ khách hàng về nhà cung cấp)', 'Chỉ chảy một chiều duy nhất từ nhà cung cấp', 'Không liên quan đến dòng sản phẩm'], correctIndex: 1, explanation: 'Hàng hoá chảy xuôi từ nhà cung cấp đến khách hàng; tiền chảy ngược từ khách hàng về nhà cung cấp.' },
  { id: 'q3', question: '"Ranh giới push/pull" là gì?', options: ['Nơi phân chia lợi nhuận giữa các bên', 'Điểm chuỗi cung ứng chuyển từ dựa-dự-báo (push) sang dựa-đơn-hàng-thật (pull)', 'Ranh giới địa lý giữa hai quốc gia', 'Mức tồn kho tối đa cho phép'], correctIndex: 1, explanation: 'Push = theo dự báo, đón đầu nhu cầu; pull = theo đơn hàng thật đã xảy ra.' },
]);

const c3 = doc('scm201-3-1-demand-forecasting-planning', '3.1 — Demand forecasting & planning|||3.1 — Dự báo nhu cầu & lập kế hoạch',
  'Đặc điểm dự báo (luôn sai, dài hạn kém chính xác hơn, tổng hợp chính xác hơn chi tiết); phương pháp định tính/định lượng; san bằng số mũ; S&OP.',
  [[
    `<span class="eyebrow">SCM201 · Chapter 3 · Lesson 3.1</span>
<h2>Demand forecasting &amp; planning</h2>
<h3>Characteristics of forecasts</h3>
<ul>
<li>Forecasts are <strong>always wrong</strong> — plan for the error, not just the number (via safety stock, flexibility).</li>
<li>A <strong>longer forecast horizon</strong> is less accurate — order components early only for long lead-time items.</li>
<li><strong>Aggregate forecasts</strong> (total demand, a region, a category) are more accurate than disaggregate ones (one SKU, one store) — errors cancel out across items.</li>
<li>Distorted information travels <strong>upstream</strong> — the further a stage is from the end customer, the worse its view of real demand (a preview of the bullwhip effect in Chapter 7).</li>
</ul>
<h3>Forecasting methods</h3>
<ul>
<li><strong>Qualitative</strong> — expert judgment, Delphi method, market research; best for new products with no history.</li>
<li><strong>Time series</strong> — uses past demand patterns (moving average, exponential smoothing) assuming the future resembles the past.</li>
<li><strong>Causal</strong> — links demand to an external factor (price, weather, GDP) via regression.</li>
<li><strong>Simulation</strong> — models customer choice behavior; combines time series and causal methods.</li>
</ul>
<pre><code>Exponential smoothing:
  F(t) = alpha * D(t-1) + (1 - alpha) * F(t-1)
  F(t)     = forecast for period t
  D(t-1)   = actual demand of the previous period
  alpha    = smoothing constant (0 &lt; alpha &lt; 1); larger alpha reacts faster to recent changes</code></pre>
<h3>Sales &amp; Operations Planning (S&amp;OP)</h3>
<p><strong>S&amp;OP</strong> is the recurring process (usually monthly) where sales, marketing, finance and operations agree on one shared demand and supply plan — turning a single forecast number into a coordinated plan for production, inventory and capacity.</p>
<div class="callout"><span class="badge">Key idea</span> The forecast is a starting point for planning, never a promise — good supply chains plan for the forecast error, not just the forecast.</div>`,
    `<span class="eyebrow">SCM201 · Chương 3 · Bài 3.1</span>
<h2>Dự báo nhu cầu &amp; lập kế hoạch</h2>
<h3>Đặc điểm của dự báo</h3>
<ul>
<li>Dự báo <strong>luôn luôn sai</strong> — phải lập kế hoạch cho sai số, không chỉ cho con số dự báo (qua safety stock, tính linh hoạt).</li>
<li><strong>Chân trời dự báo dài hơn</strong> thì kém chính xác hơn — chỉ nên đặt trước linh kiện có thời gian giao hàng dài.</li>
<li><strong>Dự báo tổng hợp</strong> (tổng nhu cầu, một vùng, một nhóm hàng) chính xác hơn dự báo chi tiết (một SKU, một cửa hàng) — sai số các mặt hàng bù trừ lẫn nhau.</li>
<li>Thông tin bị bóp méo càng đi <strong>ngược dòng</strong> — càng xa khách hàng cuối, cái nhìn về nhu cầu thật càng kém (đây là dấu hiệu sớm của hiệu ứng bullwhip ở Chương 7).</li>
</ul>
<h3>Phương pháp dự báo</h3>
<ul>
<li><strong>Định tính</strong> — ý kiến chuyên gia, phương pháp Delphi, nghiên cứu thị trường; phù hợp cho sản phẩm mới chưa có lịch sử.</li>
<li><strong>Chuỗi thời gian (time series)</strong> — dùng mẫu hình nhu cầu quá khứ (trung bình động, san bằng số mũ) với giả định tương lai giống quá khứ.</li>
<li><strong>Nhân quả (causal)</strong> — gắn nhu cầu với một yếu tố bên ngoài (giá, thời tiết, GDP) qua hồi quy.</li>
<li><strong>Mô phỏng</strong> — mô hình hoá hành vi lựa chọn của khách hàng; kết hợp chuỗi thời gian và nhân quả.</li>
</ul>
<pre><code>San bằng số mũ (exponential smoothing):
  F(t) = alpha * D(t-1) + (1 - alpha) * F(t-1)
  F(t)     = dự báo cho kỳ t
  D(t-1)   = nhu cầu thực tế kỳ trước
  alpha    = hằng số san bằng (0 &lt; alpha &lt; 1); alpha lớn phản ứng nhanh hơn với thay đổi gần đây</code></pre>
<h3>Lập kế hoạch bán hàng &amp; vận hành (S&amp;OP)</h3>
<p><strong>S&amp;OP</strong> là quy trình định kỳ (thường mỗi tháng) nơi bán hàng, marketing, tài chính và vận hành cùng thống nhất MỘT kế hoạch nhu cầu &amp; cung ứng chung — biến một con số dự báo thành kế hoạch phối hợp cho sản xuất, tồn kho và công suất.</p>
<div class="callout"><span class="badge">Ý chính</span> Dự báo là điểm khởi đầu để lập kế hoạch, không phải một lời hứa — chuỗi cung ứng tốt lập kế hoạch cho sai số dự báo, không chỉ cho con số dự báo.</div>`,
  ]]);

const c3q = quiz('scm201-quiz-3', 'Quiz 3 — Demand forecasting & planning|||Quiz 3 — Dự báo nhu cầu & lập kế hoạch', [
  { id: 'q1', question: 'Đặc điểm nào ĐÚNG về dự báo nhu cầu?', options: ['Dự báo luôn luôn đúng nếu dùng đủ dữ liệu', 'Dự báo tổng hợp thường chính xác hơn dự báo chi tiết', 'Chân trời dự báo càng dài thì càng chính xác', 'Dự báo không cần cập nhật theo thời gian'], correctIndex: 1, explanation: 'Sai số ở dự báo tổng hợp bù trừ lẫn nhau nên chính xác hơn dự báo từng SKU/cửa hàng riêng lẻ.' },
  { id: 'q2', question: 'Trong công thức san bằng số mũ F(t) = alpha·D(t-1) + (1-alpha)·F(t-1), alpha lớn nghĩa là gì?', options: ['Dự báo phản ứng chậm với thay đổi gần đây', 'Dự báo phản ứng nhanh hơn với thay đổi gần đây', 'Không dùng dữ liệu quá khứ', 'Chỉ dùng cho dự báo dài hạn'], correctIndex: 1, explanation: 'alpha càng lớn thì trọng số cho nhu cầu kỳ gần nhất càng cao → phản ứng nhanh hơn.' },
  { id: 'q3', question: 'S&OP (Sales & Operations Planning) là gì?', options: ['Phần mềm quản lý kho duy nhất', 'Quy trình định kỳ để bán hàng, marketing, tài chính, vận hành thống nhất một kế hoạch chung', 'Chỉ là báo cáo tài chính cuối năm', 'Một loại hợp đồng với nhà cung cấp'], correctIndex: 1, explanation: 'S&OP phối hợp các bộ phận để có một kế hoạch nhu cầu & cung ứng chung, thường theo tháng.' },
]);

const c4 = doc('scm201-4-1-inventory-management', '4.1 — Inventory management (EOQ & safety stock)|||4.1 — Quản lý tồn kho (EOQ & safety stock)',
  'Vì sao giữ tồn kho (economies of scale, bất định, thời vụ); EOQ, điểm đặt hàng lại, safety stock; phân loại ABC.',
  [[
    `<span class="eyebrow">SCM201 · Chapter 4 · Lesson 4.1</span>
<h2>Inventory management</h2>
<h3>Why hold inventory?</h3>
<ul>
<li><strong>Economies of scale (cycle inventory)</strong> — ordering in bulk lowers fixed order cost per unit, at the price of holding more stock.</li>
<li><strong>Uncertainty (safety stock)</strong> — demand and lead time are never perfectly known; a buffer protects against stockouts.</li>
<li><strong>Seasonality (seasonal inventory)</strong> — building stock ahead of a predictable demand spike (e.g. Tet, Black Friday).</li>
</ul>
<h3>Economic Order Quantity (EOQ)</h3>
<pre><code>Q* = sqrt( 2 * D * S / H )
  Q* = optimal order quantity
  D  = annual demand
  S  = fixed cost per order (ordering/setup cost)
  H  = annual holding cost per unit

Example: D = 12,000 units/year, S = $100/order, H = $2/unit/year
  Q* = sqrt(2 * 12,000 * 100 / 2) = sqrt(1,200,000) ≈ 1,095 units/order</code></pre>
<p>EOQ balances two opposing costs: ordering cost (falls as order size grows) against holding cost (rises as order size grows) — the optimum is where the two costs are equal.</p>
<h3>Reorder point &amp; safety stock</h3>
<pre><code>ROP = d * L + SS
  ROP = reorder point (order when inventory drops to this level)
  d   = average demand per period (e.g. per day)
  L   = replenishment lead time
  SS  = safety stock = z * sigma_L
    z       = service-level factor (higher target service -&gt; higher z)
    sigma_L = standard deviation of demand during lead time</code></pre>
<h3>ABC classification</h3>
<p>Not all SKUs deserve equal attention: <strong>A items</strong> (small % of SKUs, large % of value) get tight control &amp; frequent review; <strong>C items</strong> (many SKUs, low value) get loose, infrequent control.</p>
<div class="callout"><span class="badge">Key idea</span> Every inventory decision trades off holding cost against stockout risk or ordering cost — there is no "free" extra stock.</div>`,
    `<span class="eyebrow">SCM201 · Chương 4 · Bài 4.1</span>
<h2>Quản lý tồn kho</h2>
<h3>Vì sao phải giữ tồn kho?</h3>
<ul>
<li><strong>Lợi thế quy mô (tồn kho chu kỳ)</strong> — đặt hàng số lượng lớn giảm chi phí cố định trên mỗi đơn vị, đổi lại phải giữ nhiều hàng hơn.</li>
<li><strong>Bất định (safety stock)</strong> — nhu cầu và thời gian giao hàng không bao giờ biết chính xác; tồn kho đệm giúp chống hết hàng.</li>
<li><strong>Thời vụ (tồn kho thời vụ)</strong> — dự trữ trước một đợt tăng nhu cầu có thể dự đoán (vd Tết, Black Friday).</li>
</ul>
<h3>Sản lượng đặt hàng kinh tế (EOQ)</h3>
<pre><code>Q* = sqrt( 2 * D * S / H )
  Q* = sản lượng đặt hàng tối ưu
  D  = nhu cầu hàng năm
  S  = chi phí cố định mỗi lần đặt (chi phí đặt hàng/thiết lập)
  H  = chi phí giữ hàng mỗi đơn vị mỗi năm

Ví dụ: D = 12.000 đơn vị/năm, S = 100$/lần đặt, H = 2$/đơn vị/năm
  Q* = sqrt(2 * 12.000 * 100 / 2) = sqrt(1.200.000) ≈ 1.095 đơn vị/lần đặt</code></pre>
<p>EOQ cân bằng hai chi phí đối nghịch: chi phí đặt hàng (giảm khi lô hàng lớn hơn) với chi phí giữ hàng (tăng khi lô hàng lớn hơn) — điểm tối ưu là nơi hai chi phí này bằng nhau.</p>
<h3>Điểm đặt hàng lại & safety stock</h3>
<pre><code>ROP = d * L + SS
  ROP = điểm đặt hàng lại (đặt hàng khi tồn kho giảm tới mức này)
  d   = nhu cầu trung bình mỗi kỳ (vd mỗi ngày)
  L   = thời gian giao hàng (lead time)
  SS  = tồn kho an toàn = z * sigma_L
    z       = hệ số mức phục vụ (mục tiêu phục vụ cao hơn -&gt; z lớn hơn)
    sigma_L = độ lệch chuẩn của nhu cầu trong thời gian giao hàng</code></pre>
<h3>Phân loại ABC</h3>
<p>Không phải mọi mã hàng đáng được quan tâm ngang nhau: <strong>hàng A</strong> (ít mã hàng, chiếm phần lớn giá trị) được kiểm soát chặt &amp; rà soát thường xuyên; <strong>hàng C</strong> (nhiều mã hàng, giá trị thấp) được kiểm soát lơi hơn, ít rà soát.</p>
<div class="callout"><span class="badge">Ý chính</span> Mọi quyết định tồn kho đều đánh đổi giữa chi phí giữ hàng với rủi ro hết hàng hoặc chi phí đặt hàng — không có tồn kho dư "miễn phí".</div>`,
  ]]);

const c4q = quiz('scm201-quiz-4', 'Quiz 4 — Inventory management|||Quiz 4 — Quản lý tồn kho', [
  { id: 'q1', question: 'EOQ (Economic Order Quantity) cân bằng hai loại chi phí nào?', options: ['Chi phí vận chuyển & chi phí thuế', 'Chi phí đặt hàng & chi phí giữ hàng', 'Chi phí marketing & chi phí bán hàng', 'Chi phí nhân sự & chi phí mặt bằng'], correctIndex: 1, explanation: 'EOQ tìm sản lượng đặt hàng nơi chi phí đặt hàng và chi phí giữ hàng cân bằng nhau.' },
  { id: 'q2', question: 'Trong ROP = d·L + SS, "SS" (safety stock) dùng để làm gì?', options: ['Tăng lợi nhuận trực tiếp', 'Làm bộ đệm chống hết hàng do bất định nhu cầu/thời gian giao hàng', 'Thay thế hoàn toàn cho dự báo', 'Giảm chi phí đặt hàng'], correctIndex: 1, explanation: 'Safety stock là lớp đệm bảo vệ trước sự bất định của nhu cầu và lead time.' },
  { id: 'q3', question: 'Theo phân loại ABC, "hàng A" là loại hàng nào?', options: ['Nhiều mã hàng, giá trị thấp', 'Ít mã hàng nhưng chiếm phần lớn giá trị tồn kho', 'Chỉ hàng tồn kho thời vụ', 'Hàng đã ngừng kinh doanh'], correctIndex: 1, explanation: 'Hàng A chiếm tỉ trọng giá trị lớn dù số lượng mã hàng ít, nên cần kiểm soát chặt.' },
]);

const c5 = doc('scm201-5-1-network-distribution-design', '5.1 — Network design & distribution|||5.1 — Thiết kế mạng lưới & phân phối',
  'Quyết định vai trò/vị trí/công suất/phân bổ cơ sở; đánh đổi chi phí–đáp ứng; các mô hình phân phối (từ kho nhà sản xuất đến giao tận nhà bán lẻ).',
  [[
    `<span class="eyebrow">SCM201 · Chapter 5 · Lesson 5.1</span>
<h2>Network design &amp; distribution</h2>
<h3>Network design decisions</h3>
<ul>
<li><strong>Facility role</strong> — what each plant/warehouse does (produce, store, cross-dock).</li>
<li><strong>Facility location</strong> — where to place plants, warehouses, DCs (cost, labor, tariffs, proximity to demand).</li>
<li><strong>Capacity allocation</strong> — how much each facility can handle.</li>
<li><strong>Market/supply allocation</strong> — which facility serves which market or which supplier feeds which plant.</li>
</ul>
<h3>Cost vs. responsiveness trade-off</h3>
<pre><code>Few, large facilities   -&gt; lower facility & inventory cost, higher transportation cost, slower delivery
Many, small facilities  -&gt; higher facility cost, lower transportation cost, faster/closer delivery</code></pre>
<p>Adding facilities generally increases responsiveness (closer to customers) while raising total facility and inventory costs — the right number depends on how much customers value speed.</p>
<h3>Distribution network options</h3>
<ul>
<li><strong>Manufacturer storage with direct shipping (drop-shipping)</strong> — low inventory cost, but higher transportation cost and lower visibility for the customer.</li>
<li><strong>Distributor storage with carrier delivery</strong> — pools inventory across a region; a middle ground on cost and speed.</li>
<li><strong>Retail storage with customer/last-mile delivery</strong> — highest facility &amp; inventory cost, but fastest, most responsive delivery.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Network design locks in a huge share of a supply chain's cost and responsiveness for years — it is a strategic, not a daily, decision.</div>`,
    `<span class="eyebrow">SCM201 · Chương 5 · Bài 5.1</span>
<h2>Thiết kế mạng lưới &amp; phân phối</h2>
<h3>Các quyết định thiết kế mạng lưới</h3>
<ul>
<li><strong>Vai trò cơ sở</strong> — mỗi nhà máy/kho làm việc gì (sản xuất, lưu trữ, trung chuyển cross-dock).</li>
<li><strong>Vị trí cơ sở</strong> — đặt nhà máy, kho, trung tâm phân phối ở đâu (chi phí, nhân công, thuế/thuế quan, gần nhu cầu).</li>
<li><strong>Phân bổ công suất</strong> — mỗi cơ sở xử lý được bao nhiêu.</li>
<li><strong>Phân bổ thị trường/nguồn cung</strong> — cơ sở nào phục vụ thị trường nào, hoặc nhà cung cấp nào cấp cho nhà máy nào.</li>
</ul>
<h3>Đánh đổi chi phí – đáp ứng</h3>
<pre><code>Ít cơ sở, quy mô lớn    -&gt; chi phí cơ sở & tồn kho thấp, chi phí vận chuyển cao, giao hàng chậm hơn
Nhiều cơ sở, quy mô nhỏ -&gt; chi phí cơ sở cao hơn, chi phí vận chuyển thấp, giao hàng nhanh/gần hơn</code></pre>
<p>Thêm cơ sở nhìn chung tăng khả năng đáp ứng (gần khách hàng hơn) nhưng tăng tổng chi phí cơ sở &amp; tồn kho — số lượng phù hợp phụ thuộc vào việc khách hàng coi trọng tốc độ đến đâu.</p>
<h3>Các mô hình mạng lưới phân phối</h3>
<ul>
<li><strong>Kho nhà sản xuất, giao trực tiếp (drop-shipping)</strong> — chi phí tồn kho thấp, nhưng chi phí vận chuyển cao và khách hàng ít thấy được tình trạng đơn hàng.</li>
<li><strong>Kho nhà phân phối, giao qua đơn vị vận chuyển</strong> — gộp tồn kho theo vùng; ở giữa về chi phí và tốc độ.</li>
<li><strong>Kho bán lẻ, giao chặng cuối cho khách</strong> — chi phí cơ sở &amp; tồn kho cao nhất, nhưng giao hàng nhanh và đáp ứng tốt nhất.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Thiết kế mạng lưới cố định phần lớn chi phí và khả năng đáp ứng của chuỗi cung ứng trong nhiều năm — đây là quyết định chiến lược, không phải quyết định hàng ngày.</div>`,
  ]]);

const c5q = quiz('scm201-quiz-5', 'Quiz 5 — Network design & distribution|||Quiz 5 — Thiết kế mạng lưới & phân phối', [
  { id: 'q1', question: 'Có nhiều cơ sở nhỏ, gần khách hàng thường mang lại điều gì?', options: ['Chi phí vận chuyển cao hơn & giao hàng chậm hơn', 'Chi phí cơ sở cao hơn nhưng giao hàng nhanh/gần hơn', 'Không ảnh hưởng gì đến chi phí', 'Luôn rẻ hơn ít cơ sở lớn'], correctIndex: 1, explanation: 'Nhiều cơ sở nhỏ tăng chi phí cơ sở nhưng giảm vận chuyển & tăng tốc độ đáp ứng.' },
  { id: 'q2', question: 'Mô hình "kho nhà sản xuất, giao trực tiếp" (drop-shipping) có đặc điểm gì?', options: ['Tồn kho thấp nhưng vận chuyển đắt & ít khả năng nhìn thấy đơn hàng', 'Luôn nhanh nhất cho khách hàng', 'Không cần nhà sản xuất tham gia', 'Chỉ dùng cho hàng thời vụ'], correctIndex: 0, explanation: 'Drop-shipping gom hàng tại nhà sản xuất, giảm tồn kho nhưng tăng chi phí & thời gian vận chuyển.' },
  { id: 'q3', question: 'Quyết định thiết kế mạng lưới (vị trí, công suất, vai trò cơ sở) có tính chất gì?', options: ['Thay đổi hàng ngày theo đơn hàng', 'Quyết định chiến lược, ảnh hưởng chi phí & đáp ứng trong nhiều năm', 'Không ảnh hưởng đến tồn kho', 'Chỉ áp dụng cho công ty logistics'], correctIndex: 1, explanation: 'Xây/đóng một nhà máy hay kho là quyết định dài hạn, khó đảo ngược.' },
]);

const c6 = doc('scm201-6-1-supplier-customer-relationships', '6.1 — Supplier & customer relationship management|||6.1 — Quản trị quan hệ nhà cung cấp & khách hàng',
  'Quản trị quan hệ nhà cung cấp (chọn/đánh giá/hợp đồng); quản trị quan hệ khách hàng; chia sẻ thông tin & lòng tin giữa các bên.',
  [[
    `<span class="eyebrow">SCM201 · Chapter 6 · Lesson 6.1</span>
<h2>Supplier &amp; customer relationship management</h2>
<h3>Supplier relationship management (SRM)</h3>
<p>Working with suppliers well means: <strong>selecting</strong> them on more than just price (quality, reliability, capacity, financial health), <strong>evaluating</strong> performance continuously (on-time delivery, defect rate), and structuring <strong>contracts</strong> that align incentives — e.g. a buy-back or revenue-sharing contract can encourage a supplier to support higher order quantities. (Deep sourcing &amp; procurement mechanics belong to SCM302 — here the focus is the relationship, not the process.)</p>
<h3>Customer relationship management (CRM)</h3>
<p>On the demand side, firms <strong>segment customers</strong> by value and needs, and set <strong>service-level agreements</strong> (fill rate, delivery lead time) that match each segment's willingness to pay. Treating every customer identically wastes resources on low-value accounts and under-serves high-value ones.</p>
<h3>Why relationships beat arm's-length transactions</h3>
<ul>
<li><strong>Information sharing</strong> — a supplier who sees real demand (not just orders) can plan production better, reducing the bullwhip effect (Chapter 7).</li>
<li><strong>Trust &amp; long-term contracts</strong> — reduce opportunistic behavior and encourage joint investment (e.g. a supplier investing in capacity dedicated to one buyer).</li>
<li><strong>Collaborative planning</strong> — buyer and supplier jointly forecast and replenish, instead of each guessing at the other's behavior.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> A supply chain is a set of relationships, not just a set of transactions — the best contracts align each party's incentive with total supply chain profit, not just their own piece.</div>`,
    `<span class="eyebrow">SCM201 · Chương 6 · Bài 6.1</span>
<h2>Quản trị quan hệ nhà cung cấp &amp; khách hàng</h2>
<h3>Quản trị quan hệ nhà cung cấp (SRM)</h3>
<p>Làm việc tốt với nhà cung cấp nghĩa là: <strong>chọn</strong> họ dựa trên nhiều hơn giá cả (chất lượng, độ tin cậy, công suất, tình hình tài chính), <strong>đánh giá</strong> hiệu suất liên tục (giao hàng đúng hạn, tỉ lệ lỗi), và xây <strong>hợp đồng</strong> gắn đúng động lực — vd hợp đồng buy-back (mua lại hàng tồn) hoặc chia sẻ doanh thu có thể khuyến khích nhà cung cấp hỗ trợ đặt số lượng lớn hơn. (Cơ chế thu mua &amp; nguồn cung sâu hơn thuộc về SCM302 — ở đây trọng tâm là quan hệ, không phải quy trình.)</p>
<h3>Quản trị quan hệ khách hàng (CRM)</h3>
<p>Ở phía nhu cầu, doanh nghiệp <strong>phân khúc khách hàng</strong> theo giá trị và nhu cầu, và đặt <strong>thoả thuận mức dịch vụ</strong> (tỉ lệ đáp ứng đơn hàng, thời gian giao hàng) khớp với mức sẵn sàng chi trả của từng phân khúc. Đối xử giống nhau với mọi khách hàng lãng phí nguồn lực cho khách giá trị thấp và phục vụ chưa đủ cho khách giá trị cao.</p>
<h3>Vì sao quan hệ tốt hơn giao dịch đơn lẻ</h3>
<ul>
<li><strong>Chia sẻ thông tin</strong> — nhà cung cấp thấy được nhu cầu thật (không chỉ đơn hàng) sẽ lập kế hoạch sản xuất tốt hơn, giảm hiệu ứng bullwhip (Chương 7).</li>
<li><strong>Lòng tin &amp; hợp đồng dài hạn</strong> — giảm hành vi cơ hội và khuyến khích đầu tư chung (vd nhà cung cấp đầu tư công suất riêng cho một khách mua).</li>
<li><strong>Lập kế hoạch phối hợp</strong> — bên mua và bên bán cùng dự báo và bổ sung hàng, thay vì mỗi bên tự đoán hành vi của bên còn lại.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Chuỗi cung ứng là một tập hợp quan hệ, không chỉ là tập hợp giao dịch — hợp đồng tốt nhất gắn động lực từng bên với lợi nhuận toàn chuỗi, không chỉ phần của riêng họ.</div>`,
  ]]);

const c6q = quiz('scm201-quiz-6', 'Quiz 6 — Supplier & customer relationships|||Quiz 6 — Quan hệ nhà cung cấp & khách hàng', [
  { id: 'q1', question: 'Vì sao chỉ chọn nhà cung cấp theo giá rẻ nhất là chưa đủ?', options: ['Giá rẻ luôn đi kèm chất lượng tốt', 'Cần xét cả chất lượng, độ tin cậy, công suất, tài chính của nhà cung cấp', 'Giá là yếu tố duy nhất ảnh hưởng chuỗi cung ứng', 'Nhà cung cấp rẻ không cần đánh giá lại'], correctIndex: 1, explanation: 'Chọn nhà cung cấp tốt cần nhìn tổng thể, không chỉ mức giá.' },
  { id: 'q2', question: 'Việc phân khúc khách hàng trong CRM giúp gì?', options: ['Đối xử giống nhau với mọi khách hàng', 'Đặt mức dịch vụ phù hợp với giá trị & nhu cầu từng nhóm khách', 'Loại bỏ hoàn toàn khách hàng giá trị thấp', 'Chỉ áp dụng cho khách hàng doanh nghiệp'], correctIndex: 1, explanation: 'Phân khúc giúp phân bổ nguồn lực dịch vụ đúng với giá trị và mức sẵn sàng chi trả của khách.' },
  { id: 'q3', question: 'Chia sẻ thông tin nhu cầu thật với nhà cung cấp mang lại lợi ích gì?', options: ['Không ảnh hưởng gì đến kế hoạch sản xuất', 'Giúp nhà cung cấp lập kế hoạch tốt hơn, giảm hiệu ứng bullwhip', 'Chỉ có lợi cho nhà cung cấp, không có lợi cho bên mua', 'Làm tăng chi phí mà không có lợi ích'], correctIndex: 1, explanation: 'Thông tin nhu cầu thật (thay vì chỉ đơn hàng) giúp giảm biến động khuếch đại lên chuỗi cung ứng.' },
]);

const c7 = doc('scm201-7-1-bullwhip-coordination', '7.1 — The bullwhip effect & supply chain coordination|||7.1 — Hiệu ứng bullwhip & phối hợp chuỗi cung ứng',
  'Hiệu ứng bullwhip: biến động nhu cầu khuếch đại ngược dòng; 4 nguyên nhân; các biện pháp phối hợp: chia sẻ thông tin, VMI, CPFR.',
  [[
    `<span class="eyebrow">SCM201 · Chapter 7 · Lesson 7.1</span>
<h2>The bullwhip effect &amp; supply chain coordination</h2>
<h3>What is the bullwhip effect?</h3>
<p>The <strong>bullwhip effect</strong> is the phenomenon where small fluctuations in customer demand get progressively <em>amplified</em> as orders move upstream — the retailer's order variance is larger than actual customer demand variance, the distributor's is larger still, and the manufacturer sees the wildest swings of all, even if end demand barely changed.</p>
<pre><code>Demand variability, moving upstream:
Customer demand  --&gt;  Retailer orders  --&gt;  Distributor orders  --&gt;  Manufacturer orders
   small swing            bigger swing            bigger still            biggest swing</code></pre>
<h3>Four causes</h3>
<ul>
<li><strong>Demand signal processing</strong> — each stage overreacts to a small demand change when updating its own forecast, and orders more than needed "just in case."</li>
<li><strong>Order batching</strong> — ordering in batches (to save on fixed order cost, or on a periodic cycle) creates lumpy orders instead of smooth ones.</li>
<li><strong>Price fluctuations / promotions</strong> — discounts cause forward-buying (stock up now, order less later), creating artificial demand spikes and troughs.</li>
<li><strong>Shortage gaming / rationing</strong> — when supply is short and a supplier rations by order size, buyers inflate orders to get a bigger share, then cancel — a self-inflicted shortage signal.</li>
</ul>
<h3>Coordination levers</h3>
<ul>
<li><strong>Information sharing</strong> — give every stage visibility into actual end-customer demand, not just the next stage's order.</li>
<li><strong>Vendor-managed inventory (VMI)</strong> — the supplier, seeing real sell-through data, decides replenishment for the buyer, removing one layer of order distortion.</li>
<li><strong>CPFR (Collaborative Planning, Forecasting and Replenishment)</strong> — trading partners jointly build one shared forecast and plan instead of each guessing at the other.</li>
<li>Smaller batch sizes, stable pricing (everyday low pricing), and reducing lead times all shrink the bullwhip.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> The bullwhip effect is a coordination failure, not a demand problem — the fix is sharing real information and aligning incentives, not just holding more inventory.</div>`,
    `<span class="eyebrow">SCM201 · Chương 7 · Bài 7.1</span>
<h2>Hiệu ứng bullwhip &amp; phối hợp chuỗi cung ứng</h2>
<h3>Hiệu ứng bullwhip là gì?</h3>
<p><strong>Hiệu ứng bullwhip (roi da)</strong> là hiện tượng những biến động nhỏ trong nhu cầu khách hàng bị <em>khuếch đại</em> dần khi đơn hàng đi ngược dòng — độ biến động đơn hàng của nhà bán lẻ lớn hơn độ biến động nhu cầu khách hàng thật, của nhà phân phối còn lớn hơn nữa, và nhà sản xuất chứng kiến biến động dữ dội nhất, dù nhu cầu cuối cùng gần như không đổi.</p>
<pre><code>Biến động nhu cầu, đi ngược dòng:
Nhu cầu khách hàng  --&gt;  Đơn hàng nhà bán lẻ  --&gt;  Đơn hàng nhà phân phối  --&gt;  Đơn hàng nhà sản xuất
   biến động nhỏ              biến động lớn hơn            lớn hơn nữa                biến động lớn nhất</code></pre>
<h3>Bốn nguyên nhân</h3>
<ul>
<li><strong>Xử lý tín hiệu nhu cầu (demand signal processing)</strong> — mỗi tầng phản ứng quá mức với một thay đổi nhu cầu nhỏ khi cập nhật dự báo riêng, và đặt hàng nhiều hơn cần thiết để "phòng hờ."</li>
<li><strong>Đặt hàng theo lô (order batching)</strong> — đặt hàng theo lô lớn (để tiết kiệm chi phí cố định mỗi lần đặt, hoặc theo chu kỳ định kỳ) tạo ra đơn hàng lộn cộm thay vì mượt.</li>
<li><strong>Biến động giá / khuyến mãi</strong> — giảm giá khiến khách mua trước (mua nhiều lúc rẻ, đặt ít lại sau), tạo ra đỉnh và đáy nhu cầu giả tạo.</li>
<li><strong>Đặt hàng "chơi trò khan hiếm" (shortage gaming)</strong> — khi nguồn cung thiếu và nhà cung cấp phân bổ theo tỉ lệ số lượng đặt, bên mua thổi phồng đơn hàng để giành phần lớn hơn, rồi huỷ bớt — một tín hiệu khan hiếm tự tạo ra.</li>
</ul>
<h3>Biện pháp phối hợp</h3>
<ul>
<li><strong>Chia sẻ thông tin</strong> — cho mọi tầng thấy được nhu cầu khách hàng cuối thật, không chỉ đơn hàng của tầng kế tiếp.</li>
<li><strong>Tồn kho do nhà cung cấp quản lý (VMI)</strong> — nhà cung cấp, thấy dữ liệu bán hàng thật, tự quyết định bổ sung hàng cho bên mua, loại bỏ một lớp bóp méo đơn hàng.</li>
<li><strong>CPFR (lập kế hoạch, dự báo & bổ sung hàng phối hợp)</strong> — các đối tác thương mại cùng xây MỘT dự báo và kế hoạch chung thay vì mỗi bên tự đoán bên còn lại.</li>
<li>Giảm quy mô lô hàng, giữ giá ổn định (everyday low pricing), và giảm thời gian giao hàng đều làm giảm hiệu ứng bullwhip.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Hiệu ứng bullwhip là lỗi phối hợp, không phải vấn đề nhu cầu — cách sửa là chia sẻ thông tin thật và gắn đúng động lực các bên, không chỉ giữ nhiều tồn kho hơn.</div>`,
  ]]);

const c7q = quiz('scm201-quiz-7', 'Quiz 7 — Bullwhip effect & coordination|||Quiz 7 — Hiệu ứng bullwhip & phối hợp', [
  { id: 'q1', question: 'Hiệu ứng bullwhip là gì?', options: ['Nhu cầu khách hàng giảm dần theo thời gian', 'Biến động nhu cầu bị khuếch đại dần khi đơn hàng đi ngược dòng chuỗi cung ứng', 'Chi phí vận chuyển tăng theo khoảng cách', 'Tồn kho luôn bằng 0 ở mọi tầng'], correctIndex: 1, explanation: 'Bullwhip: biến động nhỏ ở khách hàng cuối trở thành biến động lớn ở nhà sản xuất.' },
  { id: 'q2', question: 'Đâu KHÔNG phải là một trong bốn nguyên nhân chính của hiệu ứng bullwhip?', options: ['Xử lý tín hiệu nhu cầu quá mức', 'Đặt hàng theo lô lớn', 'Biến động giá/khuyến mãi', 'Chuỗi cung ứng có quá nhiều khách hàng trung thành'], correctIndex: 3, explanation: 'Bốn nguyên nhân là: xử lý tín hiệu nhu cầu, đặt hàng theo lô, biến động giá, và shortage gaming — không liên quan đến "khách hàng trung thành".' },
  { id: 'q3', question: 'VMI (Vendor-Managed Inventory) giúp giảm bullwhip bằng cách nào?', options: ['Bên mua tự quyết định đặt hàng nhiều hơn để an toàn', 'Nhà cung cấp thấy dữ liệu bán hàng thật và tự quyết định bổ sung hàng, bỏ một lớp bóp méo đơn hàng', 'Tăng giá để giảm nhu cầu', 'Ngừng chia sẻ thông tin giữa các bên'], correctIndex: 1, explanation: 'VMI cho nhà cung cấp quyền và dữ liệu để quản lý tồn kho trực tiếp, giảm biến động do đặt hàng riêng lẻ.' },
]);

const c8 = doc('scm201-8-1-performance-sustainability-digital', '8.1 — Performance measurement, sustainability & digital supply chains|||8.1 — Đo lường hiệu suất, chuỗi cung ứng bền vững & công nghệ số',
  'Mô hình SCOR (Plan-Source-Make-Deliver-Return); KPI (OTIF, fill rate, cash-to-cash, vòng quay tồn kho); chuỗi cung ứng bền vững & công nghệ số.',
  [[
    `<span class="eyebrow">SCM201 · Chapter 8 · Lesson 8.1</span>
<h2>Performance measurement, sustainability &amp; digital supply chains</h2>
<h3>The SCOR model</h3>
<p>The <strong>SCOR (Supply Chain Operations Reference)</strong> model gives every supply chain a common language of five core processes:</p>
<pre><code>PLAN -&gt; SOURCE -&gt; MAKE -&gt; DELIVER -&gt; RETURN
Plan:    balance demand & supply
Source:  procure materials/services
Make:    convert inputs into a finished product
Deliver: order, transport, and distribute to the customer
Return:  handle returned/defective product (reverse logistics)</code></pre>
<h3>Key performance indicators (KPIs)</h3>
<ul>
<li><strong>Perfect order fulfillment / OTIF (on-time, in-full)</strong> — % of orders delivered complete and on time.</li>
<li><strong>Fill rate</strong> — % of demand met directly from available stock.</li>
<li><strong>Cash-to-cash cycle time</strong> — days between paying suppliers and collecting from customers; shorter is better for cash flow.</li>
<li><strong>Inventory turnover</strong> — how many times inventory is sold and replaced in a period; higher generally means less capital tied up in stock.</li>
</ul>
<h3>Sustainable supply chains</h3>
<p>Beyond cost and speed, supply chains are now measured on <strong>ESG</strong> factors: carbon footprint of transport &amp; production, ethical sourcing, and the <strong>circular economy</strong> (designing products and reverse-logistics flows for reuse, repair and recycling instead of disposal).</p>
<h3>Digital supply chains</h3>
<p>Technology is reshaping visibility and control: <strong>IoT sensors</strong> track shipments in real time, <strong>blockchain</strong> creates a tamper-proof record for traceability, <strong>AI/analytics</strong> improve forecasting and anomaly detection, and a <strong>control tower</strong> gives a single real-time view across the whole network to react fast to disruptions.</p>
<div class="callout"><span class="badge">Key idea</span> You cannot manage what you cannot measure — SCOR and KPIs give a shared scorecard; sustainability and digital tools are how modern supply chains keep improving that scorecard.</div>`,
    `<span class="eyebrow">SCM201 · Chương 8 · Bài 8.1</span>
<h2>Đo lường hiệu suất, chuỗi cung ứng bền vững &amp; công nghệ số</h2>
<h3>Mô hình SCOR</h3>
<p>Mô hình <strong>SCOR (Supply Chain Operations Reference)</strong> cho mọi chuỗi cung ứng một ngôn ngữ chung gồm năm quy trình cốt lõi:</p>
<pre><code>PLAN (Lập kế hoạch) -&gt; SOURCE (Thu mua) -&gt; MAKE (Sản xuất) -&gt; DELIVER (Giao hàng) -&gt; RETURN (Hoàn trả)
Plan:    cân bằng nhu cầu & cung ứng
Source:  thu mua nguyên vật liệu/dịch vụ
Make:    biến đầu vào thành sản phẩm hoàn thiện
Deliver: đặt hàng, vận chuyển, phân phối đến khách hàng
Return:  xử lý hàng trả về/lỗi (logistics ngược)</code></pre>
<h3>Chỉ số hiệu suất chính (KPI)</h3>
<ul>
<li><strong>Đơn hàng hoàn hảo / OTIF (đúng hạn, đủ hàng)</strong> — % đơn hàng giao đủ và đúng hạn.</li>
<li><strong>Tỉ lệ đáp ứng (fill rate)</strong> — % nhu cầu được đáp ứng trực tiếp từ hàng có sẵn.</li>
<li><strong>Chu kỳ tiền mặt (cash-to-cash)</strong> — số ngày giữa lúc trả tiền nhà cung cấp và lúc thu tiền từ khách hàng; ngắn hơn tốt hơn cho dòng tiền.</li>
<li><strong>Vòng quay tồn kho</strong> — số lần tồn kho được bán và thay mới trong một kỳ; cao hơn thường nghĩa là ít vốn bị "kẹt" trong hàng tồn.</li>
</ul>
<h3>Chuỗi cung ứng bền vững</h3>
<p>Ngoài chi phí và tốc độ, chuỗi cung ứng ngày nay còn được đo bằng các yếu tố <strong>ESG</strong>: dấu chân carbon của vận chuyển &amp; sản xuất, nguồn cung có đạo đức, và <strong>kinh tế tuần hoàn</strong> (thiết kế sản phẩm và dòng logistics ngược để tái sử dụng, sửa chữa, tái chế thay vì vứt bỏ).</p>
<h3>Chuỗi cung ứng số</h3>
<p>Công nghệ đang thay đổi khả năng nhìn thấy &amp; kiểm soát: <strong>cảm biến IoT</strong> theo dõi lô hàng theo thời gian thực, <strong>blockchain</strong> tạo hồ sơ không thể sửa để truy xuất nguồn gốc, <strong>AI/phân tích dữ liệu</strong> cải thiện dự báo và phát hiện bất thường, và <strong>control tower (tháp điều khiển)</strong> cho một góc nhìn thời gian thực toàn mạng lưới để phản ứng nhanh với gián đoạn.</p>
<div class="callout"><span class="badge">Ý chính</span> Không thể quản lý cái không đo được — SCOR và KPI cho một bảng điểm chung; bền vững và công nghệ số là cách chuỗi cung ứng hiện đại tiếp tục cải thiện bảng điểm đó.</div>`,
  ]]);

const c8q = quiz('scm201-quiz-8', 'Quiz 8 — Performance, sustainability & digital SCM|||Quiz 8 — Hiệu suất, bền vững & công nghệ số', [
  { id: 'q1', question: 'Mô hình SCOR gồm 5 quy trình cốt lõi theo thứ tự nào?', options: ['Source-Plan-Deliver-Make-Return', 'Plan-Source-Make-Deliver-Return', 'Make-Plan-Source-Return-Deliver', 'Deliver-Make-Plan-Source-Return'], correctIndex: 1, explanation: 'SCOR: Plan (kế hoạch) → Source (thu mua) → Make (sản xuất) → Deliver (giao hàng) → Return (hoàn trả).' },
  { id: 'q2', question: 'KPI "cash-to-cash cycle time" đo điều gì?', options: ['Số lượng đơn hàng bị huỷ', 'Số ngày giữa lúc trả tiền nhà cung cấp và thu tiền từ khách hàng', 'Tổng số nhà cung cấp đang hợp tác', 'Số lượng SKU trong danh mục hàng'], correctIndex: 1, explanation: 'Chu kỳ tiền mặt ngắn hơn nghĩa là vốn quay lại nhanh hơn, tốt cho dòng tiền doanh nghiệp.' },
  { id: 'q3', question: '"Kinh tế tuần hoàn" (circular economy) trong chuỗi cung ứng bền vững nghĩa là gì?', options: ['Sản xuất càng nhiều càng tốt bất kể chất thải', 'Thiết kế sản phẩm & logistics ngược để tái sử dụng, sửa chữa, tái chế thay vì vứt bỏ', 'Chỉ tập trung giảm giá thành sản phẩm', 'Không liên quan đến logistics'], correctIndex: 1, explanation: 'Kinh tế tuần hoàn giữ vật liệu/sản phẩm trong vòng sử dụng lâu hơn thay vì đưa thẳng ra bãi thải.' },
]);

const taiLieu = doc('scm201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ mô phỏng, lộ trình tự học.',
  [[
    `<span class="eyebrow">SCM201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Supply Chain Management — flows, forecasting, inventory, network design, relationships, coordination and performance — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for SCM201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://openlibrary.org/search?q=Supply+Chain+Management+Strategy+Planning+Operation+Chopra+Meindl" target="_blank" rel="noopener"><em>Supply Chain Management: Strategy, Planning, and Operation</em> — Chopra &amp; Meindl</a></li>
<li><a href="https://openlibrary.org/search?q=Designing+and+Managing+the+Supply+Chain+Simchi-Levi" target="_blank" rel="noopener"><em>Designing and Managing the Supply Chain</em> — Simchi-Levi, Kaminsky &amp; Simchi-Levi</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Supply_chain_management" target="_blank" rel="noopener">Wikipedia — Supply chain management</a></li>
<li><a href="https://www.investopedia.com/terms/s/scm.asp" target="_blank" rel="noopener">Investopedia — Supply Chain Management overview</a></li>
<li><a href="https://www.ascm.org/" target="_blank" rel="noopener">ASCM (Association for Supply Chain Management) — SCOR model &amp; standards</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@MITCTL" target="_blank" rel="noopener">MIT Center for Transportation &amp; Logistics (MIT CTL)</a> — research-grade SCM talks &amp; case studies</li>
<li><a href="https://www.youtube.com/@ASCMHQ" target="_blank" rel="noopener">ASCM</a> — supply chain concepts &amp; certification content</li>
</ul>
<h3>🛠️ Tools &amp; simulations</h3>
<ul>
<li><a href="https://www.beergame.org/" target="_blank" rel="noopener">The Beer Distribution Game (MIT)</a> — the classic simulation that makes you feel the bullwhip effect firsthand</li>
<li><a href="https://www.investopedia.com/terms/e/economicorderquantity.asp" target="_blank" rel="noopener">Investopedia — Economic Order Quantity (EOQ)</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — supply chain flows, strategic fit, demand forecasting basics, EOQ &amp; safety stock formulas.</li>
<li><strong>Practice</strong> — work EOQ/ROP numeric examples by hand until the formulas feel automatic.</li>
<li><strong>Go deeper</strong> — network design trade-offs, the bullwhip effect (play the Beer Game), SRM/CRM.</li>
<li><strong>Job-ready</strong> — read a real company's SCOR-style KPI dashboard and connect it back to the concepts here.</li>
</ol></div>`,
    `<span class="eyebrow">SCM201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Quản trị Chuỗi Cung ứng — dòng chảy, dự báo, tồn kho, thiết kế mạng lưới, quan hệ, phối hợp và hiệu suất — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của SCM201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://openlibrary.org/search?q=Supply+Chain+Management+Strategy+Planning+Operation+Chopra+Meindl" target="_blank" rel="noopener"><em>Supply Chain Management: Strategy, Planning, and Operation</em> — Chopra &amp; Meindl</a></li>
<li><a href="https://openlibrary.org/search?q=Designing+and+Managing+the+Supply+Chain+Simchi-Levi" target="_blank" rel="noopener"><em>Designing and Managing the Supply Chain</em> — Simchi-Levi, Kaminsky &amp; Simchi-Levi</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Supply_chain_management" target="_blank" rel="noopener">Wikipedia — Supply chain management</a></li>
<li><a href="https://www.investopedia.com/terms/s/scm.asp" target="_blank" rel="noopener">Investopedia — Tổng quan Supply Chain Management</a></li>
<li><a href="https://www.ascm.org/" target="_blank" rel="noopener">ASCM (Association for Supply Chain Management) — mô hình SCOR & chuẩn ngành</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MITCTL" target="_blank" rel="noopener">MIT Center for Transportation &amp; Logistics (MIT CTL)</a> — bài giảng & case study SCM chất lượng nghiên cứu</li>
<li><a href="https://www.youtube.com/@ASCMHQ" target="_blank" rel="noopener">ASCM</a> — kiến thức chuỗi cung ứng & nội dung chứng chỉ</li>
</ul>
<h3>🛠️ Công cụ & mô phỏng</h3>
<ul>
<li><a href="https://www.beergame.org/" target="_blank" rel="noopener">The Beer Distribution Game (MIT)</a> — mô phỏng kinh điển giúp bạn cảm nhận hiệu ứng bullwhip trực tiếp</li>
<li><a href="https://www.investopedia.com/terms/e/economicorderquantity.asp" target="_blank" rel="noopener">Investopedia — Sản lượng đặt hàng kinh tế (EOQ)</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — dòng chảy chuỗi cung ứng, sự phù hợp chiến lược, dự báo nhu cầu cơ bản, công thức EOQ & safety stock.</li>
<li><strong>Luyện tập</strong> — tự tính các ví dụ số EOQ/ROP đến khi thành thục công thức.</li>
<li><strong>Đào sâu thực tế</strong> — đánh đổi thiết kế mạng lưới, hiệu ứng bullwhip (chơi thử Beer Game), SRM/CRM.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc một bảng KPI kiểu SCOR của công ty thật và liên hệ lại với các khái niệm ở đây.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'SCM201',
    slug: 'scm201-supply-chain-management',
    title: 'Supply Chain Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SCM201.webp',
    shortDescription: 'How supply chains create value — flows, demand forecasting, inventory (EOQ, safety stock), network design, supplier/customer relationships, the bullwhip effect, SCOR/KPIs, sustainability & digital tech. Bilingual, with examples & quizzes.|||Chuỗi cung ứng tạo giá trị thế nào — dòng chảy, dự báo nhu cầu, tồn kho (EOQ, safety stock), thiết kế mạng lưới, quan hệ nhà cung cấp/khách hàng, bullwhip, SCOR/KPI, bền vững & công nghệ số. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>SCM201 — Supply Chain Management</strong> (kỳ 4, khối Quản trị Kinh doanh) là môn <strong>nhập môn nền tảng</strong> về chuỗi cung ứng — bao quát khái niệm chung, không đi sâu riêng thu mua (xem SCM302) hay logistics (xem SCM303). Từ <strong>tổng quan &amp; sự phù hợp chiến lược</strong> → <strong>các thành phần &amp; dòng chảy</strong> (sản phẩm, thông tin, tài chính) → <strong>dự báo nhu cầu &amp; lập kế hoạch</strong> → <strong>quản lý tồn kho</strong> (EOQ, safety stock) → <strong>thiết kế mạng lưới &amp; phân phối</strong> → <strong>quan hệ nhà cung cấp &amp; khách hàng</strong> → <strong>hiệu ứng bullwhip &amp; phối hợp chuỗi cung</strong> → <strong>đo lường hiệu suất (SCOR, KPI), bền vững &amp; công nghệ số</strong>. Bám giáo trình Chopra &amp; Meindl và Simchi-Levi, song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Thặng dư chuỗi cung ứng & sự phù hợp chiến lược (efficient vs responsive); dòng sản phẩm/thông tin/tài chính, ranh giới push/pull; đặc điểm & phương pháp dự báo nhu cầu, S&OP; EOQ, điểm đặt hàng lại, safety stock, phân loại ABC; đánh đổi chi phí–đáp ứng trong thiết kế mạng lưới & phân phối; quản trị quan hệ nhà cung cấp (SRM) & khách hàng (CRM); hiệu ứng bullwhip (4 nguyên nhân) & biện pháp phối hợp (VMI, CPFR); mô hình SCOR, KPI, chuỗi cung bền vững & công nghệ số (IoT, blockchain, AI).',
    requirements: 'Kiến thức quản trị kinh doanh cơ bản (nhập môn kinh tế/quản trị). Không cần công cụ đặc biệt — có ví dụ tính toán trực tiếp trong bài.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách (Chopra & Meindl, Simchi-Levi), tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Chuỗi cung ứng, thặng dư chuỗi cung ứng, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & sự phù hợp chiến lược|||Chapter 1 — Overview & strategic fit', description: 'Thặng dư chuỗi cung ứng, phổ đáp ứng nhanh–hiệu quả.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thành phần & dòng chảy|||Chapter 2 — Components & flows', description: 'Sản phẩm, thông tin, tài chính; ranh giới push/pull.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Dự báo nhu cầu & lập kế hoạch|||Chapter 3 — Demand forecasting & planning', description: 'Đặc điểm & phương pháp dự báo, san bằng số mũ, S&OP.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Quản lý tồn kho|||Chapter 4 — Inventory management', description: 'EOQ, điểm đặt hàng lại, safety stock, phân loại ABC.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thiết kế mạng lưới & phân phối|||Chapter 5 — Network & distribution design', description: 'Đánh đổi chi phí–đáp ứng, mô hình phân phối.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Quan hệ nhà cung cấp & khách hàng|||Chapter 6 — Supplier & customer relationships', description: 'SRM, CRM, chia sẻ thông tin & lòng tin.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hiệu ứng bullwhip & phối hợp|||Chapter 7 — Bullwhip effect & coordination', description: '4 nguyên nhân bullwhip; VMI, CPFR.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Hiệu suất, bền vững & công nghệ số|||Chapter 8 — Performance, sustainability & digital SCM', description: 'SCOR, KPI, ESG, kinh tế tuần hoàn, IoT/blockchain/AI.', lessons: [c8, c8q] },
  ],
};
