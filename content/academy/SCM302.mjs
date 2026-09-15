/**
 * SCM302 — Procurement and Global Sourcing. Giáo trình FLM (trích dẫn, KHÔNG
 * upload PDF): "Global Sourcing and Supply Management" (Trent/Monczka);
 * "International Logistics" (Wood/Barone); Incoterms 2020 (ICC). Nhấn TÌM
 * NGUỒN TOÀN CẦU (sourcing quốc tế, thương mại quốc tế, logistics nhập khẩu)
 * — KHÁC PCM301 (thu mua nội bộ) và PSS301 (chiến lược nguồn cung chung).
 * Song ngữ + ví dụ + bài tập. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('scm302-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách tham khảo, Incoterms 2020, tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">SCM302 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Procurement and Global Sourcing — international sourcing strategy, supplier evaluation, Incoterms, trade finance, import customs, FX &amp; supply risk, and total cost of ownership — in one place. Full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for SCM302 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Global Sourcing and Supply Management</em> — Trent &amp; Monczka</li>
<li><em>International Logistics</em> — Wood &amp; Barone</li>
<li><a href="https://iccwbo.org/business-solutions/incoterms-rules/" target="_blank" rel="noopener">Incoterms® 2020 — ICC (International Chamber of Commerce)</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.trade.gov/" target="_blank" rel="noopener">International Trade Administration (trade.gov)</a> — U.S. export/import guides</li>
<li><a href="https://www.wto.org/" target="_blank" rel="noopener">World Trade Organization (wto.org)</a> — trade rules &amp; agreements</li>
<li><a href="https://www.customs.gov.vn/" target="_blank" rel="noopener">Tổng cục Hải quan Việt Nam (customs.gov.vn)</a> — thủ tục hải quan trong nước</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ISM_org" target="_blank" rel="noopener">Institute for Supply Management (ISM)</a> — procurement &amp; sourcing practice</li>
<li><a href="https://www.youtube.com/@Maersk" target="_blank" rel="noopener">Maersk</a> — global container shipping &amp; logistics explained</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://iccwbo.org/business-solutions/incoterms-rules/" target="_blank" rel="noopener">ICC Incoterms 2020 chart</a> — risk/cost transfer per term</li>
<li><a href="https://www.trade.gov/harmonized-system-hs-codes" target="_blank" rel="noopener">HS code lookup</a> — classify goods for customs &amp; duty</li>
<li><a href="https://www.xe.com/currencyconverter/" target="_blank" rel="noopener">XE Currency Converter</a> — FX rates for landed-cost estimates</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — procurement vs. sourcing vs. global sourcing; offshoring/nearshoring/reshoring; the eight Incoterms 2020 rules.</li>
<li><strong>Practice</strong> — build a supplier scorecard, map an Incoterm to who pays freight/insurance/duty, walk an L/C document flow.</li>
<li><strong>Go deeper</strong> — landed cost &amp; total cost of ownership, FX hedging, customs clearance documents.</li>
<li><strong>Job-ready</strong> — read a real commercial invoice/B/L/certificate of origin, negotiate payment terms, run a supplier risk map.</li>
</ol></div>`,
    `<span class="eyebrow">SCM302 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Thu mua &amp; Tìm nguồn Toàn cầu — chiến lược sourcing quốc tế, đánh giá nhà cung cấp, Incoterms, tài trợ thương mại, hải quan nhập khẩu, rủi ro tỷ giá &amp; chuỗi cung, và tổng chi phí sở hữu — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của SCM302 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Global Sourcing and Supply Management</em> — Trent &amp; Monczka</li>
<li><em>International Logistics</em> — Wood &amp; Barone</li>
<li><a href="https://iccwbo.org/business-solutions/incoterms-rules/" target="_blank" rel="noopener">Incoterms® 2020 — ICC (Phòng Thương mại Quốc tế)</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.trade.gov/" target="_blank" rel="noopener">International Trade Administration (trade.gov)</a> — hướng dẫn xuất/nhập khẩu Mỹ</li>
<li><a href="https://www.wto.org/" target="_blank" rel="noopener">Tổ chức Thương mại Thế giới (wto.org)</a> — luật lệ &amp; hiệp định thương mại</li>
<li><a href="https://www.customs.gov.vn/" target="_blank" rel="noopener">Tổng cục Hải quan Việt Nam (customs.gov.vn)</a> — thủ tục hải quan trong nước</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ISM_org" target="_blank" rel="noopener">Institute for Supply Management (ISM)</a> — thực hành thu mua &amp; sourcing</li>
<li><a href="https://www.youtube.com/@Maersk" target="_blank" rel="noopener">Maersk</a> — vận chuyển container &amp; logistics toàn cầu</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://iccwbo.org/business-solutions/incoterms-rules/" target="_blank" rel="noopener">Bảng Incoterms 2020 của ICC</a> — điểm chuyển rủi ro/chi phí theo từng điều kiện</li>
<li><a href="https://www.trade.gov/harmonized-system-hs-codes" target="_blank" rel="noopener">Tra mã HS</a> — phân loại hàng hoá để tính thuế hải quan</li>
<li><a href="https://www.xe.com/currencyconverter/" target="_blank" rel="noopener">XE Currency Converter</a> — tỷ giá để ước tính chi phí đến nơi (landed cost)</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — thu mua vs sourcing vs tìm nguồn toàn cầu; offshoring/nearshoring/reshoring; tám điều kiện Incoterms 2020.</li>
<li><strong>Luyện tập</strong> — dựng bảng chấm điểm nhà cung cấp, gán một Incoterm với ai trả cước/bảo hiểm/thuế, đi qua luồng chứng từ L/C.</li>
<li><strong>Đào sâu thực tế</strong> — chi phí đến nơi &amp; tổng chi phí sở hữu, phòng ngừa rủi ro tỷ giá, chứng từ thông quan.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc hoá đơn thương mại/B·L/giấy chứng nhận xuất xứ thật, đàm phán điều kiện thanh toán, dựng bản đồ rủi ro nhà cung cấp.</li>
</ol></div>`,
  ]]);

const intro = doc('scm302-0-1-overview', 'Course overview: Procurement and Global Sourcing|||Tổng quan: Thu mua & Tìm nguồn Toàn cầu',
  'Thu mua vs sourcing vs tìm nguồn toàn cầu; vì sao doanh nghiệp vượt biên giới tìm nhà cung cấp; lộ trình 8 chương từ chiến lược đến tuân thủ &amp; bền vững.',
  [[
    `<span class="eyebrow">SCM302 · Lesson 0.1 · Overview</span>
<h2>Procurement &amp; Global Sourcing</h2>
<p class="lead">This course is about finding, qualifying and buying from suppliers <strong>across borders</strong> — not the internal purchase-to-pay process (that's PCM301) and not general supply strategy (that's PSS301). The lens here is always <strong>international</strong>: currencies, customs, trade terms, cross-border payment, and the extra risks that come with a supplier a plane ride away.</p>
<h3>Three terms, one ladder</h3>
<ul>
<li><strong>Purchasing</strong> — the transactional act of buying (PO, invoice, payment).</li>
<li><strong>Procurement</strong> — the broader process: specify needs, select suppliers, negotiate, manage the relationship.</li>
<li><strong>Global sourcing</strong> — procurement extended across national borders, adding trade terms, customs, FX, and international logistics to every decision.</li>
</ul>
<h3>Why go global</h3>
<p>Lower unit cost is the obvious driver, but rarely the only one: access to capacity that doesn't exist domestically, specialized technology or raw materials, and entering a foreign market by buying (and later selling) locally.</p>
<h3>Roadmap</h3>
<p>Overview &amp; drivers/risks → sourcing strategy (offshoring/nearshoring/reshoring) → supplier search &amp; evaluation → Incoterms 2020 → international payment &amp; trade finance → import logistics &amp; customs → FX/cultural/supply-chain risk → total cost of ownership, compliance &amp; sustainable sourcing.</p>`,
    `<span class="eyebrow">SCM302 · Bài 0.1 · Tổng quan</span>
<h2>Thu mua &amp; Tìm nguồn Toàn cầu</h2>
<p class="lead">Môn này là về việc tìm, xét duyệt và mua hàng từ nhà cung cấp <strong>xuyên biên giới</strong> — KHÔNG phải quy trình mua hàng nội bộ (đó là PCM301) và KHÔNG phải chiến lược nguồn cung chung (đó là PSS301). Góc nhìn ở đây luôn là <strong>quốc tế</strong>: tiền tệ, hải quan, điều kiện thương mại, thanh toán xuyên biên giới, và rủi ro tăng thêm khi nhà cung cấp cách bạn một chuyến bay.</p>
<h3>Ba tầng, một thang</h3>
<ul>
<li><strong>Mua hàng (purchasing)</strong> — hành động giao dịch mua (PO, hoá đơn, thanh toán).</li>
<li><strong>Thu mua (procurement)</strong> — quy trình rộng hơn: xác định nhu cầu, chọn nhà cung cấp, đàm phán, quản lý quan hệ.</li>
<li><strong>Tìm nguồn toàn cầu (global sourcing)</strong> — thu mua mở rộng qua biên giới quốc gia, thêm điều kiện thương mại, hải quan, tỷ giá và logistics quốc tế vào mọi quyết định.</li>
</ul>
<h3>Vì sao vượt biên giới</h3>
<p>Chi phí đơn vị thấp hơn là động lực rõ nhất, nhưng hiếm khi là động lực duy nhất: tiếp cận năng lực sản xuất không có trong nước, công nghệ hoặc nguyên liệu đặc thù, và bước vào một thị trường nước ngoài bằng cách mua (rồi sau đó bán) tại chỗ.</p>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; động lực/rủi ro → chiến lược sourcing (offshoring/nearshoring/reshoring) → tìm &amp; đánh giá nhà cung cấp → Incoterms 2020 → thanh toán quốc tế &amp; tài trợ thương mại → logistics nhập khẩu &amp; hải quan → rủi ro tỷ giá/văn hoá/chuỗi cung → tổng chi phí sở hữu, tuân thủ &amp; sourcing bền vững.</p>`,
  ]]);

const c1 = doc('scm302-1-1-overview-drivers-risks', '1.1 — Global procurement & sourcing overview, drivers & risks|||1.1 — Tổng quan thu mua & tìm nguồn toàn cầu, động lực & rủi ro',
  'Định nghĩa thu mua toàn cầu; 5 động lực chính (chi phí, năng lực, công nghệ, thị trường, tốc độ); 5 nhóm rủi ro (tỷ giá, chính trị, chất lượng, gián đoạn, sở hữu trí tuệ).',
  [[
    `<span class="eyebrow">SCM302 · Chapter 1 · Lesson 1.1</span>
<h2>Global procurement &amp; sourcing overview, drivers &amp; risks</h2>
<h3>What makes sourcing "global"</h3>
<p>Global sourcing is the deliberate search for and use of suppliers <strong>outside the buyer's home country</strong>, coordinated across regions to leverage worldwide capabilities. It sits inside the wider discipline of procurement but adds a layer that domestic buying never has to deal with: currency conversion, customs borders, longer and less certain lead times, and a supplier operating under a different legal system.</p>
<h3>Five drivers</h3>
<ul>
<li><strong>Cost</strong> — lower labor/material cost in the source country, even after freight and duty.</li>
<li><strong>Capacity</strong> — domestic suppliers can't meet volume; a global supplier can.</li>
<li><strong>Technology / capability</strong> — a specific process, material, or know-how only exists abroad.</li>
<li><strong>Market access</strong> — buying locally is often a precondition for selling locally (local content rules, goodwill, tariff avoidance).</li>
<li><strong>Speed / innovation</strong> — some regions move faster on a given technology cycle.</li>
</ul>
<h3>Five risk families</h3>
<ul>
<li><strong>Currency risk</strong> — the landed cost moves with the exchange rate between quote and payment.</li>
<li><strong>Political / country risk</strong> — instability, export bans, sanctions, sudden tariff changes.</li>
<li><strong>Quality risk</strong> — harder to audit and correct from a distance; standards may differ.</li>
<li><strong>Supply disruption</strong> — longer lead times mean less time to react to a problem.</li>
<li><strong>IP / legal risk</strong> — weaker enforcement of intellectual property or contract law in some jurisdictions.</li>
</ul>
<pre><code>Global sourcing decision, in one line:

  Lower unit price  vs.  Currency + Political + Quality + Disruption + IP risk

  A "cheaper" supplier that fails on any risk line can cost MORE
  than a pricier domestic one — always weigh price against total risk.
</code></pre>
<div class="callout"><span class="badge">Not the same course</span> PCM301 studies the internal purchase-to-pay process (requisition → PO → receipt → invoice). PSS301 studies sourcing strategy in general (single vs. multiple suppliers, make-or-buy). SCM302 studies what changes when the supplier is in <strong>another country</strong>.</div>`,
    `<span class="eyebrow">SCM302 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan thu mua &amp; tìm nguồn toàn cầu, động lực &amp; rủi ro</h2>
<h3>Điều gì làm sourcing trở nên "toàn cầu"</h3>
<p>Tìm nguồn toàn cầu là việc chủ động tìm kiếm và sử dụng nhà cung cấp <strong>ngoài quốc gia của bên mua</strong>, phối hợp qua nhiều khu vực để tận dụng năng lực trên toàn thế giới. Nó nằm trong bộ môn thu mua rộng hơn nhưng thêm một tầng mà mua hàng trong nước không phải xử lý: chuyển đổi tiền tệ, biên giới hải quan, thời gian giao hàng dài và kém chắc chắn hơn, và một nhà cung cấp hoạt động theo hệ thống pháp luật khác.</p>
<h3>Năm động lực</h3>
<ul>
<li><strong>Chi phí</strong> — chi phí lao động/nguyên liệu thấp hơn ở nước nguồn, dù đã tính cước vận chuyển và thuế.</li>
<li><strong>Năng lực</strong> — nhà cung cấp trong nước không đáp ứng được sản lượng; nhà cung cấp toàn cầu thì có.</li>
<li><strong>Công nghệ / năng lực đặc thù</strong> — một công nghệ, nguyên liệu hoặc bí quyết chỉ tồn tại ở nước ngoài.</li>
<li><strong>Tiếp cận thị trường</strong> — mua tại chỗ thường là điều kiện để bán tại chỗ (quy định nội địa hoá, quan hệ, tránh thuế).</li>
<li><strong>Tốc độ / đổi mới</strong> — một số khu vực dẫn đầu nhanh hơn trong một chu kỳ công nghệ nhất định.</li>
</ul>
<h3>Năm nhóm rủi ro</h3>
<ul>
<li><strong>Rủi ro tỷ giá</strong> — chi phí đến nơi biến động theo tỷ giá giữa lúc chào giá và lúc thanh toán.</li>
<li><strong>Rủi ro chính trị / quốc gia</strong> — bất ổn, cấm xuất khẩu, cấm vận, thay đổi thuế đột ngột.</li>
<li><strong>Rủi ro chất lượng</strong> — khó kiểm tra và khắc phục từ xa; tiêu chuẩn có thể khác nhau.</li>
<li><strong>Gián đoạn cung ứng</strong> — thời gian giao hàng dài nghĩa là ít thời gian phản ứng khi có vấn đề.</li>
<li><strong>Rủi ro pháp lý / IP</strong> — thực thi sở hữu trí tuệ hoặc luật hợp đồng yếu hơn ở một số nơi.</li>
</ul>
<pre><code>Quyết định tìm nguồn toàn cầu, tóm trong một dòng:

  Giá đơn vị thấp hơn  so với  Rủi ro tỷ giá + chính trị + chất lượng + gián đoạn + IP

  Một nhà cung cấp "rẻ" nhưng hỏng ở bất kỳ dòng rủi ro nào có thể tốn
  NHIỀU HƠN một nhà cung cấp trong nước đắt hơn — luôn cân giá với tổng rủi ro.
</code></pre>
<div class="callout"><span class="badge">Không phải môn nào cũng giống</span> PCM301 học quy trình mua hàng nội bộ (yêu cầu → PO → nhận hàng → hoá đơn). PSS301 học chiến lược nguồn cung nói chung (một hay nhiều nhà cung cấp, tự làm hay mua ngoài). SCM302 học những gì thay đổi khi nhà cung cấp ở <strong>nước khác</strong>.</div>`,
  ]]);

const c1q = quiz('scm302-quiz-1', 'Quiz 1 — Overview, drivers & risks|||Quiz 1 — Tổng quan, động lực & rủi ro', [
  { id: 'q1', question: 'Điểm khác cốt lõi của SCM302 so với PCM301 là gì?', options: ['SCM302 học quy trình PO nội bộ', 'SCM302 tập trung nhà cung cấp XUYÊN BIÊN GIỚI', 'SCM302 không quan tâm rủi ro', 'Hai môn giống nhau hoàn toàn'], correctIndex: 1, explanation: 'SCM302 nhấn tìm nguồn toàn cầu (quốc tế); PCM301 học quy trình thu mua nội bộ.' },
  { id: 'q2', question: 'Đâu KHÔNG phải một trong năm động lực đi tìm nguồn toàn cầu?', options: ['Chi phí thấp hơn', 'Tiếp cận năng lực sản xuất', 'Tiếp cận thị trường nước ngoài', 'Giảm mọi rủi ro về 0'], correctIndex: 3, explanation: 'Tìm nguồn toàn cầu KHÔNG loại bỏ rủi ro — nó đổi lấy chi phí thấp hơn bằng rủi ro khác (tỷ giá, chính trị, chất lượng...).' },
  { id: 'q3', question: 'Vì sao một nhà cung cấp "rẻ hơn" ở nước ngoài có thể tốn nhiều hơn về sau?', options: ['Vì giá niêm yết luôn đúng', 'Vì rủi ro tỷ giá/chính trị/chất lượng/gián đoạn có thể ăn hết phần tiết kiệm', 'Vì hải quan luôn miễn thuế', 'Vì khoảng cách không ảnh hưởng gì'], correctIndex: 1, explanation: 'Phải so giá với TỔNG rủi ro (tỷ giá, chính trị, chất lượng, gián đoạn, IP), không chỉ so đơn giá.' },
]);

const c2 = doc('scm302-2-1-sourcing-strategy', '2.1 — International sourcing strategy: offshoring, nearshoring, reshoring|||2.1 — Chiến lược sourcing quốc tế: offshoring, nearshoring, reshoring',
  'Ba chiến lược định vị nguồn cung; đánh đổi chi phí – thời gian giao hàng – rủi ro – kiểm soát; yếu tố quyết định chọn chiến lược nào.',
  [[
    `<span class="eyebrow">SCM302 · Chapter 2 · Lesson 2.1</span>
<h2>International sourcing strategy: offshoring, nearshoring, reshoring</h2>
<h3>Three positions on the map</h3>
<ul>
<li><strong>Offshoring</strong> — sourcing from a distant, usually low-cost country (e.g. a US buyer sourcing from Vietnam or China). Lowest unit cost, longest lead time, hardest to visit.</li>
<li><strong>Nearshoring</strong> — sourcing from a nearby country, often sharing a border or time zone (e.g. Mexico for a US buyer). Middling cost, much shorter lead time, easier collaboration.</li>
<li><strong>Reshoring</strong> — bringing production back to the buyer's home country. Highest unit cost, shortest lead time, full control and visibility.</li>
</ul>
<h3>The trade-off is never one-dimensional</h3>
<p>Unit cost, lead time, and control move in <em>opposite</em> directions across the three. A buyer doesn't pick "the best" option — it picks the option whose trade-off fits the product: a fashion item with a 6-week selling window tolerates offshoring's cost savings far less than a slow-moving industrial part does.</p>
<pre><code>              Unit cost   Lead time   Risk/control
Offshoring      Lowest      Longest     Hardest to control
Nearshoring     Middle      Shorter     Easier collaboration
Reshoring       Highest     Shortest    Full control
</code></pre>
<h3>What tips the decision</h3>
<ul>
<li><strong>Total landed cost</strong> — not just factory price; add freight, duty, inventory carrying cost.</li>
<li><strong>Geopolitical stability</strong> — a volatile source country erodes offshoring's savings with risk premium.</li>
<li><strong>Tariff exposure</strong> — new tariffs can flip the cost ranking overnight (a driver behind the recent reshoring/nearshoring wave).</li>
<li><strong>Product life-cycle speed</strong> — fast fashion/electronics favor shorter lead time (nearshoring/reshoring); commodity parts tolerate offshoring.</li>
</ul>
<div class="callout"><span class="badge">Not a permanent choice</span> Companies increasingly run a <strong>mixed portfolio</strong> — offshore the stable, high-volume items and nearshore/reshore the volatile or fast-moving ones, rebalancing as tariffs and geopolitics shift.</div>`,
    `<span class="eyebrow">SCM302 · Chương 2 · Bài 2.1</span>
<h2>Chiến lược sourcing quốc tế: offshoring, nearshoring, reshoring</h2>
<h3>Ba vị trí trên bản đồ</h3>
<ul>
<li><strong>Offshoring</strong> — tìm nguồn từ một nước xa, thường chi phí thấp (vd một bên mua ở Mỹ tìm nguồn từ Việt Nam hoặc Trung Quốc). Chi phí đơn vị thấp nhất, thời gian giao hàng dài nhất, khó ghé thăm nhất.</li>
<li><strong>Nearshoring</strong> — tìm nguồn từ nước lân cận, thường chung biên giới hoặc múi giờ (vd Mexico cho bên mua ở Mỹ). Chi phí trung bình, thời gian giao hàng ngắn hơn nhiều, hợp tác dễ hơn.</li>
<li><strong>Reshoring</strong> — đưa sản xuất trở lại chính quốc gia của bên mua. Chi phí đơn vị cao nhất, thời gian giao hàng ngắn nhất, kiểm soát và tầm nhìn đầy đủ.</li>
</ul>
<h3>Đánh đổi không bao giờ chỉ một chiều</h3>
<p>Chi phí đơn vị, thời gian giao hàng và mức kiểm soát di chuyển theo hướng <em>ngược nhau</em> qua ba lựa chọn. Bên mua không chọn "cái tốt nhất" — họ chọn lựa chọn có đánh đổi phù hợp với sản phẩm: một mặt hàng thời trang chỉ bán trong 6 tuần chịu được việc offshoring tiết kiệm chi phí ít hơn nhiều so với một linh kiện công nghiệp bán chậm.</p>
<pre><code>               Chi phí đơn vị   Thời gian giao   Rủi ro/kiểm soát
Offshoring          Thấp nhất      Dài nhất        Khó kiểm soát nhất
Nearshoring         Trung bình     Ngắn hơn        Hợp tác dễ hơn
Reshoring           Cao nhất       Ngắn nhất       Kiểm soát đầy đủ
</code></pre>
<h3>Điều gì quyết định lựa chọn</h3>
<ul>
<li><strong>Tổng chi phí đến nơi</strong> — không chỉ giá xưởng; cộng cước vận chuyển, thuế, chi phí giữ hàng tồn kho.</li>
<li><strong>Ổn định địa chính trị</strong> — một nước nguồn bất ổn ăn mòn phần tiết kiệm của offshoring bằng phần bù rủi ro.</li>
<li><strong>Mức thuế nhập khẩu</strong> — thuế mới có thể lật ngược thứ hạng chi phí chỉ trong một đêm (một động lực của làn sóng reshoring/nearshoring gần đây).</li>
<li><strong>Tốc độ vòng đời sản phẩm</strong> — thời trang nhanh/điện tử thiên về thời gian giao ngắn (nearshoring/reshoring); linh kiện hàng hoá thông thường chịu được offshoring.</li>
</ul>
<div class="callout"><span class="badge">Không phải lựa chọn vĩnh viễn</span> Các công ty ngày càng chạy một <strong>danh mục kết hợp</strong> — offshore các mặt hàng ổn định, sản lượng lớn và nearshore/reshore các mặt hàng biến động, thay đổi nhanh, rồi tái cân bằng khi thuế và địa chính trị thay đổi.</div>`,
  ]]);

const c2q = quiz('scm302-quiz-2', 'Quiz 2 — Sourcing strategy|||Quiz 2 — Chiến lược sourcing', [
  { id: 'q1', question: 'Chiến lược nào có chi phí đơn vị thấp nhất nhưng thời gian giao hàng dài nhất?', options: ['Reshoring', 'Nearshoring', 'Offshoring', 'Không chiến lược nào'], correctIndex: 2, explanation: 'Offshoring (nguồn xa, chi phí thấp) đổi lấy thời gian giao hàng dài nhất.' },
  { id: 'q2', question: 'Nearshoring khác offshoring chủ yếu ở điểm nào?', options: ['Nearshoring luôn đắt hơn reshoring', 'Nearshoring dùng nước lân cận, thời gian giao ngắn hơn', 'Nearshoring không có rủi ro', 'Nearshoring nghĩa là mua trong nước'], correctIndex: 1, explanation: 'Nearshoring chọn nước gần (biên giới/múi giờ), cho thời gian giao ngắn hơn offshoring dù chi phí cao hơn.' },
  { id: 'q3', question: 'Yếu tố nào có thể "lật ngược" thứ hạng chi phí giữa các chiến lược sourcing gần như ngay lập tức?', options: ['Màu sắc bao bì', 'Thay đổi thuế nhập khẩu (tariff)', 'Font chữ trên hợp đồng', 'Ngày trong tuần'], correctIndex: 1, explanation: 'Thuế nhập khẩu mới có thể khiến lựa chọn offshoring từng rẻ trở nên đắt hơn nearshoring/reshoring.' },
]);

const c3 = doc('scm302-3-1-supplier-search-evaluation', '3.1 — Global supplier search & evaluation|||3.1 — Tìm kiếm & đánh giá nhà cung cấp quốc tế',
  'Phễu tìm nguồn (identify → RFI → RFQ/RFP → đánh giá thực địa → trao hợp đồng); tiêu chí đánh giá; bảng chấm điểm có trọng số.',
  [[
    `<span class="eyebrow">SCM302 · Chapter 3 · Lesson 3.1</span>
<h2>Global supplier search &amp; evaluation</h2>
<h3>The sourcing funnel</h3>
<pre><code>1. Identify   -> trade shows, sourcing platforms (Alibaba, Global Sources),
                 trade missions, industry associations
2. RFI        -> Request for Information: can this supplier even do it?
3. RFQ / RFP  -> Request for Quotation/Proposal: price, terms, capability detail
4. Site audit -> visit or third-party inspection: factory, quality system, labor practices
5. Award      -> contract, trial order, then scale-up
</code></pre>
<h3>Evaluation criteria</h3>
<ul>
<li><strong>Quality system</strong> — ISO 9001 certification, defect rate history, sample inspection.</li>
<li><strong>Capacity &amp; scalability</strong> — can they handle your peak volume, not just your sample order?</li>
<li><strong>Financial health</strong> — a supplier that goes bankrupt mid-contract is a supply disruption you caused by not checking.</li>
<li><strong>Compliance &amp; ethics</strong> — labor standards, environmental compliance, anti-corruption — increasingly required by the buyer's own customers and regulators.</li>
<li><strong>Communication &amp; responsiveness</strong> — across time zones and languages, this often predicts relationship success better than price.</li>
</ul>
<h3>Weighted scorecard example</h3>
<pre><code>Criterion            Weight   Supplier A   Supplier B
Price                 30%        9            6
Quality               25%        7            9
Capacity              20%        6            9
Compliance/ethics     15%        8            7
Communication         10%        6            8
--------------------------------------------------
Weighted score       100%       7.35         7.75   -> Supplier B wins
</code></pre>
<div class="callout"><span class="badge">Cheapest quote ≠ best supplier</span> Supplier A had the lower price but lost on the weighted score — capacity and quality risk outweighed the price advantage. A scorecard forces this trade-off into the open instead of defaulting to price.</div>`,
    `<span class="eyebrow">SCM302 · Chương 3 · Bài 3.1</span>
<h2>Tìm kiếm &amp; đánh giá nhà cung cấp quốc tế</h2>
<h3>Phễu tìm nguồn</h3>
<pre><code>1. Nhận diện  -> hội chợ thương mại, nền tảng sourcing (Alibaba, Global Sources),
                 đoàn xúc tiến thương mại, hiệp hội ngành
2. RFI        -> Yêu cầu thông tin: nhà cung cấp này có LÀM ĐƯỢC việc này không?
3. RFQ / RFP  -> Yêu cầu chào giá/đề xuất: giá, điều kiện, chi tiết năng lực
4. Đánh giá thực địa -> thăm nhà máy hoặc thuê kiểm định độc lập: hệ thống chất lượng,
                 điều kiện lao động
5. Trao hợp đồng -> hợp đồng, đơn hàng thử, rồi mở rộng quy mô
</code></pre>
<h3>Tiêu chí đánh giá</h3>
<ul>
<li><strong>Hệ thống chất lượng</strong> — chứng nhận ISO 9001, lịch sử tỷ lệ lỗi, kiểm tra mẫu.</li>
<li><strong>Năng lực &amp; khả năng mở rộng</strong> — họ có xử lý được sản lượng cao điểm của bạn, không chỉ đơn hàng mẫu?</li>
<li><strong>Sức khoẻ tài chính</strong> — một nhà cung cấp phá sản giữa hợp đồng là gián đoạn cung ứng do chính bạn gây ra vì không kiểm tra trước.</li>
<li><strong>Tuân thủ &amp; đạo đức</strong> — tiêu chuẩn lao động, tuân thủ môi trường, chống tham nhũng — ngày càng được khách hàng của chính bên mua và cơ quan quản lý yêu cầu.</li>
<li><strong>Giao tiếp &amp; phản hồi</strong> — qua múi giờ và ngôn ngữ khác nhau, điều này thường dự báo thành công của quan hệ tốt hơn giá cả.</li>
</ul>
<h3>Ví dụ bảng chấm điểm có trọng số</h3>
<pre><code>Tiêu chí              Trọng số   NCC A   NCC B
Giá                      30%        9       6
Chất lượng               25%        7       9
Năng lực                 20%        6       9
Tuân thủ/đạo đức         15%        8       7
Giao tiếp                10%        6       8
------------------------------------------------
Điểm có trọng số        100%      7,35    7,75   -> NCC B thắng
</code></pre>
<div class="callout"><span class="badge">Giá thấp nhất ≠ nhà cung cấp tốt nhất</span> Nhà cung cấp A có giá thấp hơn nhưng thua ở điểm có trọng số — rủi ro năng lực và chất lượng vượt lợi thế giá. Bảng chấm điểm buộc đánh đổi này phải hiện ra rõ ràng, thay vì mặc định chọn theo giá.</div>`,
  ]]);

const c3q = quiz('scm302-quiz-3', 'Quiz 3 — Supplier search & evaluation|||Quiz 3 — Tìm & đánh giá nhà cung cấp', [
  { id: 'q1', question: 'Trong phễu tìm nguồn, bước nào diễn ra TRƯỚC RFQ/RFP?', options: ['Trao hợp đồng', 'RFI (yêu cầu thông tin)', 'Đánh giá thực địa', 'Mở rộng quy mô'], correctIndex: 1, explanation: 'Thứ tự: nhận diện → RFI → RFQ/RFP → đánh giá thực địa → trao hợp đồng.' },
  { id: 'q2', question: 'Vì sao cần kiểm tra sức khoẻ tài chính của nhà cung cấp trước khi ký hợp đồng?', options: ['Để tính thuế nhập khẩu', 'Vì nhà cung cấp phá sản giữa hợp đồng gây gián đoạn cung ứng', 'Vì đó là yêu cầu của Incoterms', 'Không cần thiết'], correctIndex: 1, explanation: 'Sức khoẻ tài chính yếu là một rủi ro gián đoạn cung ứng có thể phòng tránh được bằng kiểm tra trước.' },
  { id: 'q3', question: 'Trong ví dụ bảng chấm điểm, vì sao Nhà cung cấp B thắng dù giá thấp hơn Nhà cung cấp A?', options: ['Vì giá không có trọng số', 'Vì điểm có trọng số tổng của B cao hơn nhờ chất lượng & năng lực', 'Vì B rẻ hơn A', 'Vì A không được xét'], correctIndex: 1, explanation: 'Điểm có trọng số tổng hợp mọi tiêu chí; B thắng nhờ vượt trội ở chất lượng và năng lực, đủ để bù giá cao hơn.' },
]);

const c4 = doc('scm302-4-1-incoterms-2020', '4.1 — Incoterms 2020 & international trade terms|||4.1 — Incoterms 2020 & điều kiện thương mại quốc tế',
  'Bốn nhóm Incoterms (E/F/C/D); các điều kiện phổ biến EXW, FOB, CIF, DAP, DDP; ai trả cước, bảo hiểm, thuế và điểm chuyển rủi ro.',
  [[
    `<span class="eyebrow">SCM302 · Chapter 4 · Lesson 4.1</span>
<h2>Incoterms 2020 &amp; international trade terms</h2>
<h3>Why Incoterms exist</h3>
<p>An international sale involves two questions that a domestic sale rarely has to spell out: <strong>who pays for what</strong> (transport, insurance, duty) and <strong>when does risk pass</strong> from seller to buyer? <strong>Incoterms®</strong> (published by the ICC, current version 2020) are a standard set of three-letter terms that answer both, unambiguously, worldwide.</p>
<h3>Four groups</h3>
<ul>
<li><strong>E</strong> — Ex Works (EXW): seller does the minimum; buyer picks up at the seller's door.</li>
<li><strong>F</strong> — FCA, FAS, FOB: seller hands off to the buyer's carrier at origin.</li>
<li><strong>C</strong> — CPT, CIP, CFR, CIF: seller pays main transport (and sometimes insurance) but risk still passes early.</li>
<li><strong>D</strong> — DAP, DPU, DDP: seller delivers all the way to destination; DDP even includes import duty.</li>
</ul>
<pre><code>Term    Who arranges/pays freight   Who insures    Risk transfers at
EXW     Buyer                       Buyer          Seller's premises
FOB     Buyer (main carriage)       Buyer          Goods on board vessel (origin port)
CIF     Seller (to destination port) Seller        Goods on board vessel (origin port)
DAP     Seller (to destination)     Seller         Arrival at named destination
DDP     Seller (incl. import duty)  Seller         Goods ready for unloading at destination
</code></pre>
<h3>The trap: cost paid ≠ risk transferred</h3>
<p>Under <strong>CIF</strong>, the seller pays freight and insurance to the destination port — but risk passes to the buyer once goods are loaded on the vessel at origin, long before arrival. A buyer who assumes "seller pays, so seller's problem if it sinks" is wrong under CIF.</p>
<div class="callout"><span class="badge">Match the Incoterm to the mode</span> FOB/CFR/CIF are written for <strong>sea/waterway</strong> transport only. For air, road, rail, or multimodal shipments use FCA/CPT/CIP instead — using FOB for an air shipment is a common, costly mistake.</div>`,
    `<span class="eyebrow">SCM302 · Chương 4 · Bài 4.1</span>
<h2>Incoterms 2020 &amp; điều kiện thương mại quốc tế</h2>
<h3>Vì sao Incoterms tồn tại</h3>
<p>Một giao dịch bán hàng quốc tế đặt ra hai câu hỏi mà giao dịch trong nước hiếm khi phải nói rõ: <strong>ai trả cho cái gì</strong> (vận chuyển, bảo hiểm, thuế) và <strong>rủi ro chuyển giao khi nào</strong> từ người bán sang người mua? <strong>Incoterms®</strong> (do ICC ban hành, phiên bản hiện hành 2020) là một bộ điều kiện ba chữ cái chuẩn hoá trả lời cả hai câu hỏi này, rõ ràng, trên toàn thế giới.</p>
<h3>Bốn nhóm</h3>
<ul>
<li><strong>E</strong> — Ex Works (EXW): người bán làm tối thiểu; người mua tự lấy hàng tại cửa xưởng người bán.</li>
<li><strong>F</strong> — FCA, FAS, FOB: người bán trao hàng cho hãng vận chuyển của người mua tại điểm xuất phát.</li>
<li><strong>C</strong> — CPT, CIP, CFR, CIF: người bán trả cước vận chuyển chính (và có khi cả bảo hiểm) nhưng rủi ro vẫn chuyển sớm.</li>
<li><strong>D</strong> — DAP, DPU, DDP: người bán giao hàng đến hết điểm đích; DDP còn bao gồm cả thuế nhập khẩu.</li>
</ul>
<pre><code>Điều kiện  Ai lo/trả cước vận chuyển    Ai mua bảo hiểm   Rủi ro chuyển giao khi
EXW        Người mua                    Người mua         Tại kho người bán
FOB        Người mua (chặng chính)      Người mua         Hàng lên tàu (cảng xuất phát)
CIF        Người bán (đến cảng đích)    Người bán          Hàng lên tàu (cảng xuất phát)
DAP        Người bán (đến điểm đích)    Người bán          Hàng đến điểm đích chỉ định
DDP        Người bán (cả thuế nhập khẩu) Người bán          Hàng sẵn sàng để dỡ tại điểm đích
</code></pre>
<h3>Cái bẫy: trả tiền ≠ chuyển rủi ro</h3>
<p>Theo <strong>CIF</strong>, người bán trả cước vận chuyển và bảo hiểm đến cảng đích — nhưng rủi ro chuyển sang người mua ngay khi hàng lên tàu tại cảng xuất phát, rất lâu trước khi hàng đến. Một người mua nghĩ "người bán trả tiền thì hàng chìm là việc của người bán" là SAI theo CIF.</p>
<div class="callout"><span class="badge">Khớp Incoterm với phương thức vận chuyển</span> FOB/CFR/CIF chỉ dùng cho vận chuyển <strong>đường biển/đường thuỷ</strong>. Với hàng không, đường bộ, đường sắt hoặc đa phương thức thì dùng FCA/CPT/CIP thay vào — dùng FOB cho lô hàng đường hàng không là một lỗi phổ biến và tốn kém.</div>`,
  ]]);

const c4q = quiz('scm302-quiz-4', 'Quiz 4 — Incoterms 2020|||Quiz 4 — Incoterms 2020', [
  { id: 'q1', question: 'Theo CIF, khi nào rủi ro chuyển từ người bán sang người mua?', options: ['Khi hàng đến cảng đích', 'Khi hàng lên tàu tại cảng xuất phát', 'Khi thanh toán xong', 'Khi hải quan thông quan'], correctIndex: 1, explanation: 'CIF: người bán trả cước/bảo hiểm đến cảng đích nhưng rủi ro chuyển giao sớm hơn nhiều — ngay khi hàng lên tàu.' },
  { id: 'q2', question: 'Điều kiện nào yêu cầu người bán chịu trách nhiệm CẢ thuế nhập khẩu?', options: ['EXW', 'FOB', 'DDP', 'CIF'], correctIndex: 2, explanation: 'DDP (Delivered Duty Paid) là điều kiện duy nhất trong ví dụ mà người bán lo cả thuế nhập khẩu.' },
  { id: 'q3', question: 'Vì sao dùng FOB cho một lô hàng vận chuyển bằng đường HÀNG KHÔNG là sai?', options: ['FOB chỉ dùng cho vận chuyển đường biển/đường thuỷ', 'FOB luôn đắt hơn CIF', 'FOB không tồn tại trong Incoterms 2020', 'FOB chỉ áp dụng cho hàng nội địa'], correctIndex: 0, explanation: 'FOB/CFR/CIF được viết riêng cho vận chuyển đường biển/đường thuỷ; hàng không/đường bộ/đa phương thức dùng FCA/CPT/CIP.' },
]);

const c5 = doc('scm302-5-1-international-payment-trade-finance', '5.1 — International payment & trade finance (L/C, T/T)|||5.1 — Thanh toán quốc tế & tài trợ thương mại (L/C, T/T)',
  'Phổ phương thức thanh toán từ an toàn nhất cho người bán đến an toàn nhất cho người mua; quy trình Letter of Credit (L/C); T/T, D/P, D/A, ghi nợ mở.',
  [[
    `<span class="eyebrow">SCM302 · Chapter 5 · Lesson 5.1</span>
<h2>International payment &amp; trade finance</h2>
<h3>The payment spectrum</h3>
<p>Every method sits somewhere between "safest for the seller" and "safest for the buyer" — the two never agree on the best method, and the final choice reflects relative bargaining power and trust.</p>
<pre><code>Safest for SELLER                                    Safest for BUYER
Advance payment  ->  Letter of Credit (L/C)  ->  Documentary Collection (D/P, D/A)  ->  Open account (T/T after delivery)
</code></pre>
<h3>Letter of Credit (L/C) — the compromise</h3>
<p>An L/C is a bank's <strong>conditional promise to pay</strong> the seller, once the seller presents documents (invoice, packing list, bill of lading, certificate of origin) that exactly match the terms of the credit. It substitutes bank credit for buyer credit — the seller is paid by a bank it trusts, not by trusting the buyer directly.</p>
<pre><code>1. Buyer applies for L/C at its bank (issuing bank)
2. Issuing bank sends L/C to seller's bank (advising/confirming bank)
3. Seller ships goods, collects required documents
4. Seller presents documents to its bank
5. Bank checks documents match the L/C exactly -> pays seller
6. Issuing bank reimburses seller's bank, then collects from buyer
</code></pre>
<h3>Other common methods</h3>
<ul>
<li><strong>T/T (Telegraphic Transfer)</strong> — a bank wire; simple and fast, but no built-in guarantee — often split into a deposit before production and balance before/after shipment.</li>
<li><strong>D/P (Documents against Payment)</strong> — buyer's bank releases shipping documents only once the buyer pays.</li>
<li><strong>D/A (Documents against Acceptance)</strong> — buyer's bank releases documents once the buyer accepts a bill of exchange (promises to pay later) — riskier for the seller than D/P.</li>
<li><strong>Open account</strong> — seller ships first, invoices, buyer pays later (like domestic credit terms) — best for buyer, riskiest for seller; used only with trusted, established relationships.</li>
</ul>
<div class="callout"><span class="badge">"Discrepancy" kills an L/C</span> A bank pays against <strong>documents</strong>, not against the goods themselves. Even a minor mismatch (a date, a spelling, a missing signature) between the documents and the L/C's exact wording lets the bank refuse payment — document accuracy is as important as the goods' quality.</div>`,
    `<span class="eyebrow">SCM302 · Chương 5 · Bài 5.1</span>
<h2>Thanh toán quốc tế &amp; tài trợ thương mại</h2>
<h3>Phổ phương thức thanh toán</h3>
<p>Mỗi phương thức nằm ở đâu đó giữa "an toàn nhất cho người bán" và "an toàn nhất cho người mua" — hai bên không bao giờ đồng thuận về phương thức tốt nhất, và lựa chọn cuối cùng phản ánh sức mạnh đàm phán và mức độ tin tưởng tương đối.</p>
<pre><code>An toàn cho NGƯỜI BÁN                              An toàn cho NGƯỜI MUA
Trả trước  ->  Thư tín dụng (L/C)  ->  Nhờ thu kèm chứng từ (D/P, D/A)  ->  Ghi nợ mở (T/T sau giao hàng)
</code></pre>
<h3>Thư tín dụng (L/C) — giải pháp thoả hiệp</h3>
<p>L/C là <strong>lời hứa trả tiền có điều kiện</strong> của một ngân hàng cho người bán, sau khi người bán xuất trình các chứng từ (hoá đơn, phiếu đóng gói, vận đơn, giấy chứng nhận xuất xứ) khớp CHÍNH XÁC với điều khoản của thư tín dụng. Nó thay tín nhiệm của ngân hàng cho tín nhiệm của người mua — người bán được trả bởi một ngân hàng họ tin tưởng, không phải tin trực tiếp người mua.</p>
<pre><code>1. Người mua xin mở L/C tại ngân hàng của mình (ngân hàng phát hành)
2. Ngân hàng phát hành gửi L/C cho ngân hàng người bán (ngân hàng thông báo/xác nhận)
3. Người bán giao hàng, thu thập các chứng từ theo yêu cầu
4. Người bán xuất trình chứng từ cho ngân hàng của mình
5. Ngân hàng kiểm tra chứng từ khớp đúng L/C -> trả tiền cho người bán
6. Ngân hàng phát hành hoàn tiền cho ngân hàng người bán, rồi thu lại từ người mua
</code></pre>
<h3>Các phương thức phổ biến khác</h3>
<ul>
<li><strong>T/T (chuyển tiền điện tử)</strong> — chuyển khoản ngân hàng; đơn giản và nhanh, nhưng không có bảo đảm sẵn — thường chia đặt cọc trước sản xuất và trả số dư trước/sau khi giao hàng.</li>
<li><strong>D/P (nhờ thu trả tiền ngay)</strong> — ngân hàng người mua chỉ giao chứng từ vận chuyển sau khi người mua trả tiền.</li>
<li><strong>D/A (nhờ thu chấp nhận trả)</strong> — ngân hàng người mua giao chứng từ ngay khi người mua ký chấp nhận hối phiếu (hứa trả sau) — rủi ro cho người bán cao hơn D/P.</li>
<li><strong>Ghi nợ mở (open account)</strong> — người bán giao hàng trước, xuất hoá đơn, người mua trả sau (như điều kiện tín dụng trong nước) — tốt nhất cho người mua, rủi ro nhất cho người bán; chỉ dùng khi quan hệ đã đáng tin cậy, lâu năm.</li>
</ul>
<div class="callout"><span class="badge">"Sai lệch chứng từ" giết chết một L/C</span> Ngân hàng trả tiền dựa trên <strong>chứng từ</strong>, không dựa trên hàng hoá thật. Chỉ một sai lệch nhỏ (ngày tháng, lỗi đánh máy, thiếu chữ ký) giữa chứng từ và câu chữ chính xác của L/C là đủ để ngân hàng từ chối trả tiền — độ chính xác chứng từ quan trọng không kém chất lượng hàng hoá.</div>`,
  ]]);

const c5q = quiz('scm302-quiz-5', 'Quiz 5 — International payment & trade finance|||Quiz 5 — Thanh toán quốc tế & tài trợ thương mại', [
  { id: 'q1', question: 'Phương thức thanh toán nào an toàn NHẤT cho người BÁN?', options: ['Ghi nợ mở (open account)', 'Trả trước (advance payment)', 'D/A', 'T/T sau giao hàng'], correctIndex: 1, explanation: 'Trả trước là an toàn nhất cho người bán vì nhận tiền trước khi giao hàng.' },
  { id: 'q2', question: 'Ngân hàng trong một giao dịch L/C trả tiền dựa trên điều gì?', options: ['Chất lượng hàng hoá thực tế', 'Chứng từ khớp chính xác với điều khoản L/C', 'Lời hứa miệng của người bán', 'Giá thị trường tại thời điểm giao hàng'], correctIndex: 1, explanation: 'Ngân hàng chỉ kiểm tra chứng từ có khớp đúng L/C hay không — không kiểm tra hàng hoá thật.' },
  { id: 'q3', question: 'Khác biệt chính giữa D/P và D/A là gì?', options: ['D/P chứng từ được giao khi trả tiền ngay; D/A chứng từ được giao khi chấp nhận trả sau', 'D/P và D/A hoàn toàn giống nhau', 'D/A an toàn hơn D/P cho người bán', 'D/P chỉ dùng cho hàng không'], correctIndex: 0, explanation: 'D/P đòi trả tiền ngay để nhận chứng từ; D/A chỉ cần chấp nhận hối phiếu (hứa trả sau) — rủi ro hơn cho người bán.' },
]);

const c6 = doc('scm302-6-1-import-logistics-customs-tariffs', '6.1 — Import logistics, customs clearance & tariffs|||6.1 — Logistics nhập khẩu, hải quan & thuế quan',
  'Chứng từ nhập khẩu cốt lõi; quy trình thông quan; mã HS &amp; cách tính thuế; hiệp định thương mại tự do (FTA) giảm thuế.',
  [[
    `<span class="eyebrow">SCM302 · Chapter 6 · Lesson 6.1</span>
<h2>Import logistics, customs clearance &amp; tariffs</h2>
<h3>Core import documents</h3>
<ul>
<li><strong>Commercial invoice</strong> — the seller's bill: goods, quantity, price, terms.</li>
<li><strong>Packing list</strong> — how the shipment is physically packed (cartons, weight, dimensions).</li>
<li><strong>Bill of Lading (B/L) / Airway Bill</strong> — the carrier's receipt AND, for ocean B/L, a document of title to the goods.</li>
<li><strong>Certificate of Origin (C/O)</strong> — states which country the goods were made in — the basis for claiming a lower FTA tariff rate.</li>
</ul>
<h3>Customs clearance, step by step</h3>
<pre><code>1. Pre-arrival: importer/broker files an import declaration with the customs authority
2. Goods classified by HS code (Harmonized System) -> determines duty rate
3. Customs calculates duty + VAT/import tax based on declared value + HS code
4. Customs may select for physical/document inspection (risk-based)
5. Duty & tax paid -> customs releases the goods
6. Goods picked up / trucked to the importer's warehouse
</code></pre>
<h3>HS codes &amp; tariffs</h3>
<p>The <strong>Harmonized System (HS)</strong> is a global product classification (used by nearly every customs authority). The HS code assigned to a product determines its <strong>duty rate</strong> — the same product misclassified under a different HS code can attract a very different tariff, so classification is a real cost lever, not paperwork trivia.</p>
<h3>Free Trade Agreements (FTAs) lower the bill</h3>
<p>A valid <strong>Certificate of Origin</strong> under an FTA (e.g. CPTPP, EVFTA for Vietnam) can reduce or eliminate the duty that would otherwise apply — but only if the goods meet the agreement's "rules of origin" (enough value/processing happened inside a member country).</p>
<div class="callout"><span class="badge">Landed cost, not factory price</span> The number that matters for sourcing decisions is <strong>landed cost</strong> = factory price + freight + insurance + duty + customs fees + inland transport — not the price quoted by the supplier alone.</div>`,
    `<span class="eyebrow">SCM302 · Chương 6 · Bài 6.1</span>
<h2>Logistics nhập khẩu, hải quan &amp; thuế quan</h2>
<h3>Chứng từ nhập khẩu cốt lõi</h3>
<ul>
<li><strong>Hoá đơn thương mại</strong> — hoá đơn của người bán: hàng hoá, số lượng, giá, điều kiện.</li>
<li><strong>Phiếu đóng gói</strong> — cách lô hàng được đóng gói vật lý (số thùng, khối lượng, kích thước).</li>
<li><strong>Vận đơn (B/L) / Vận đơn hàng không</strong> — biên nhận của hãng vận chuyển VÀ, với vận đơn đường biển, còn là chứng từ sở hữu hàng hoá.</li>
<li><strong>Giấy chứng nhận xuất xứ (C/O)</strong> — ghi rõ hàng hoá được sản xuất tại quốc gia nào — căn cứ để yêu cầu mức thuế ưu đãi theo FTA.</li>
</ul>
<h3>Thông quan, từng bước</h3>
<pre><code>1. Trước khi hàng đến: nhà nhập khẩu/đại lý khai báo hải quan với cơ quan hải quan
2. Hàng hoá được phân loại theo mã HS (Hệ thống hài hoà) -> quyết định mức thuế
3. Hải quan tính thuế nhập khẩu + VAT/thuế khác dựa trên giá trị khai báo + mã HS
4. Hải quan có thể chọn kiểm tra thực tế/chứng từ (theo mức độ rủi ro)
5. Đóng thuế & phí -> hải quan giải phóng hàng
6. Hàng được lấy / vận chuyển bằng xe tải về kho nhà nhập khẩu
</code></pre>
<h3>Mã HS &amp; thuế quan</h3>
<p><strong>Hệ thống hài hoà (HS)</strong> là hệ phân loại hàng hoá toàn cầu (gần như mọi cơ quan hải quan đều dùng). Mã HS gán cho một sản phẩm quyết định <strong>mức thuế</strong> — cùng một sản phẩm bị phân loại sai sang mã HS khác có thể chịu mức thuế rất khác, nên phân loại là một đòn bẩy chi phí thật sự, không phải thủ tục vặt vãnh.</p>
<h3>Hiệp định thương mại tự do (FTA) giảm số tiền phải trả</h3>
<p>Một <strong>Giấy chứng nhận xuất xứ</strong> hợp lệ theo một FTA (vd CPTPP, EVFTA với Việt Nam) có thể giảm hoặc miễn mức thuế lẽ ra phải áp — nhưng chỉ khi hàng hoá đáp ứng "quy tắc xuất xứ" của hiệp định (đủ giá trị/công đoạn gia công diễn ra trong nước thành viên).</p>
<div class="callout"><span class="badge">Chi phí đến nơi, không phải giá xưởng</span> Con số quan trọng cho quyết định sourcing là <strong>chi phí đến nơi (landed cost)</strong> = giá xưởng + cước vận chuyển + bảo hiểm + thuế nhập khẩu + phí hải quan + vận chuyển nội địa — không chỉ giá do nhà cung cấp báo.</div>`,
  ]]);

const c6q = quiz('scm302-quiz-6', 'Quiz 6 — Import logistics, customs & tariffs|||Quiz 6 — Logistics nhập khẩu, hải quan & thuế quan', [
  { id: 'q1', question: 'Mã HS của một sản phẩm dùng để làm gì?', options: ['Xác định màu bao bì', 'Quyết định mức thuế nhập khẩu áp dụng', 'Xác định ngôn ngữ hợp đồng', 'Không có tác dụng gì'], correctIndex: 1, explanation: 'Mã HS (Hệ thống hài hoà) phân loại hàng hoá và quyết định mức thuế áp dụng.' },
  { id: 'q2', question: 'Chứng từ nào là căn cứ để yêu cầu mức thuế ưu đãi theo một FTA?', options: ['Phiếu đóng gói', 'Giấy chứng nhận xuất xứ (C/O)', 'Vận đơn', 'Hoá đơn thương mại'], correctIndex: 1, explanation: 'C/O xác nhận nước sản xuất, là căn cứ để hưởng thuế ưu đãi FTA nếu đáp ứng quy tắc xuất xứ.' },
  { id: 'q3', question: 'Chi phí đến nơi (landed cost) gồm những gì, ngoài giá xưởng?', options: ['Chỉ giá xưởng, không có gì khác', 'Cước vận chuyển + bảo hiểm + thuế + phí hải quan + vận chuyển nội địa', 'Chỉ thuế nhập khẩu', 'Chỉ cước vận chuyển'], correctIndex: 1, explanation: 'Landed cost = giá xưởng + freight + insurance + duty + phí hải quan + vận chuyển nội địa.' },
]);

const c7 = doc('scm302-7-1-fx-cultural-supply-chain-risk', '7.1 — FX risk, cultural factors & global supply chain risk management|||7.1 — Rủi ro tỷ giá, văn hoá & quản trị rủi ro chuỗi cung toàn cầu',
  'Rủi ro tỷ giá (giao dịch, chuyển đổi, kinh tế) &amp; hedging; khác biệt văn hoá trong đàm phán; bản đồ rủi ro chuỗi cung &amp; chiến lược giảm nhẹ.',
  [[
    `<span class="eyebrow">SCM302 · Chapter 7 · Lesson 7.1</span>
<h2>FX risk, cultural factors &amp; global supply chain risk</h2>
<h3>Three faces of currency risk</h3>
<ul>
<li><strong>Transaction risk</strong> — the rate moves between quote and payment date on a single purchase order.</li>
<li><strong>Translation risk</strong> — foreign-currency contracts/assets change value when converted back into the buyer's reporting currency.</li>
<li><strong>Economic risk</strong> — a sustained currency shift changes a source country's competitiveness for years, not just one order.</li>
</ul>
<h3>Hedging the transaction</h3>
<ul>
<li><strong>Forward contract</strong> — lock today's rate for a future payment date; removes the uncertainty, at the cost of giving up any favorable swing.</li>
<li><strong>Natural hedge</strong> — match currency inflows and outflows (e.g. sell and buy in the same currency) so movements cancel out.</li>
<li><strong>Pricing in a stable currency</strong> — many global contracts are priced in USD specifically to sidestep a volatile local currency.</li>
</ul>
<h3>Culture shapes the negotiation, not just the paperwork</h3>
<p>Hofstede's cultural dimensions (e.g. high vs. low context communication, attitude to hierarchy, relationship-first vs. deal-first cultures) predict real friction: a buyer expecting a quick "yes/no" answer can badly misread a supplier culture where relationship-building must come first, and mistake politeness for agreement.</p>
<h3>Mapping supply chain risk</h3>
<pre><code>Risk type              Example                          Mitigation
Geopolitical            War, sanctions, export ban       Dual/multi-sourcing, alternate lane
Natural disaster        Earthquake, flood, port closure  Buffer stock, geographic diversification
Single-source dependency Only one supplier makes part X  Qualify a second supplier before you need one
Concentration risk      Whole category from one country  Regional spread, nearshoring for critical items
</code></pre>
<div class="callout"><span class="badge">Risk mapping is a living document</span> A supply chain risk map goes stale the moment geopolitics or a supplier's finances shift — review it on a cadence, not once at supplier onboarding.</div>`,
    `<span class="eyebrow">SCM302 · Chương 7 · Bài 7.1</span>
<h2>Rủi ro tỷ giá, văn hoá &amp; quản trị rủi ro chuỗi cung toàn cầu</h2>
<h3>Ba dạng rủi ro tỷ giá</h3>
<ul>
<li><strong>Rủi ro giao dịch</strong> — tỷ giá thay đổi giữa lúc chào giá và lúc thanh toán trên một đơn hàng cụ thể.</li>
<li><strong>Rủi ro chuyển đổi</strong> — hợp đồng/tài sản bằng ngoại tệ đổi giá trị khi quy về tiền tệ báo cáo của bên mua.</li>
<li><strong>Rủi ro kinh tế</strong> — biến động tỷ giá kéo dài thay đổi năng lực cạnh tranh của nước nguồn trong nhiều năm, không chỉ một đơn hàng.</li>
</ul>
<h3>Phòng ngừa rủi ro giao dịch</h3>
<ul>
<li><strong>Hợp đồng kỳ hạn (forward)</strong> — chốt tỷ giá hôm nay cho một ngày thanh toán trong tương lai; loại bỏ sự bất định, đổi lại từ bỏ mọi biến động thuận lợi.</li>
<li><strong>Hedging tự nhiên</strong> — khớp dòng tiền vào và ra cùng loại tiền tệ (vd bán và mua cùng đồng tiền) để biến động triệt tiêu nhau.</li>
<li><strong>Định giá bằng tiền tệ ổn định</strong> — nhiều hợp đồng toàn cầu định giá bằng USD chính để tránh một đồng tiền địa phương biến động.</li>
</ul>
<h3>Văn hoá định hình đàm phán, không chỉ giấy tờ</h3>
<p>Các chiều văn hoá của Hofstede (vd giao tiếp ngữ cảnh cao vs thấp, thái độ với thứ bậc, văn hoá quan hệ-trước vs giao dịch-trước) dự báo được ma sát thật: một người mua kỳ vọng câu trả lời "có/không" nhanh có thể hiểu sai nghiêm trọng một nền văn hoá nhà cung cấp cần xây quan hệ trước, và nhầm sự lịch sự với sự đồng ý.</p>
<h3>Dựng bản đồ rủi ro chuỗi cung</h3>
<pre><code>Loại rủi ro              Ví dụ                              Giảm nhẹ
Địa chính trị             Chiến tranh, cấm vận, cấm xuất khẩu Đa nguồn cung, tuyến vận chuyển thay thế
Thiên tai                 Động đất, lũ lụt, đóng cảng         Hàng dự trữ đệm, đa dạng hoá địa lý
Phụ thuộc một nguồn        Chỉ một NCC làm được linh kiện X    Xét duyệt NCC dự phòng trước khi cần đến
Rủi ro tập trung          Cả một nhóm hàng chỉ từ một nước    Trải rộng vùng, nearshoring cho hàng quan trọng
</code></pre>
<div class="callout"><span class="badge">Bản đồ rủi ro là tài liệu SỐNG</span> Một bản đồ rủi ro chuỗi cung lỗi thời ngay khi địa chính trị hoặc tài chính nhà cung cấp thay đổi — rà soát định kỳ, không chỉ một lần lúc mới nhận nhà cung cấp.</div>`,
  ]]);

const c7q = quiz('scm302-quiz-7', 'Quiz 7 — FX, cultural & supply chain risk|||Quiz 7 — Rủi ro tỷ giá, văn hoá & chuỗi cung', [
  { id: 'q1', question: 'Rủi ro tỷ giá thay đổi giữa lúc chào giá và lúc thanh toán trên một đơn hàng cụ thể gọi là gì?', options: ['Rủi ro kinh tế', 'Rủi ro giao dịch', 'Rủi ro chuyển đổi', 'Rủi ro chính trị'], correctIndex: 1, explanation: 'Rủi ro giao dịch là biến động tỷ giá trên một giao dịch/đơn hàng cụ thể, giữa lúc chào giá và thanh toán.' },
  { id: 'q2', question: 'Hợp đồng kỳ hạn (forward contract) dùng để làm gì?', options: ['Tăng lợi nhuận chắc chắn', 'Chốt tỷ giá hôm nay cho một ngày thanh toán tương lai', 'Thay thế Incoterms', 'Miễn thuế nhập khẩu'], correctIndex: 1, explanation: 'Forward contract chốt tỷ giá trước, loại bỏ bất định nhưng cũng từ bỏ biến động thuận lợi nếu có.' },
  { id: 'q3', question: 'Vì sao chỉ phụ thuộc một nhà cung cấp duy nhất cho một linh kiện là rủi ro?', options: ['Vì luôn vi phạm pháp luật', 'Vì không có nguồn thay thế nếu nhà cung cấp đó gặp sự cố', 'Vì giá luôn cao hơn', 'Không phải rủi ro'], correctIndex: 1, explanation: 'Phụ thuộc một nguồn (single-source dependency) nghĩa là không có phương án dự phòng nếu nhà cung cấp đó gián đoạn.' },
]);

const c8 = doc('scm302-8-1-global-tco-compliance-sustainable-sourcing', '8.1 — Global total cost of ownership, compliance & sustainable sourcing|||8.1 — Tổng chi phí sở hữu toàn cầu, tuân thủ & sourcing bền vững',
  'Các thành phần của TCO ngoài giá mua; tuân thủ chống tham nhũng &amp; lao động; sourcing bền vững &amp; bộ quy tắc ứng xử nhà cung cấp.',
  [[
    `<span class="eyebrow">SCM302 · Chapter 8 · Lesson 8.1</span>
<h2>Global TCO, compliance &amp; sustainable sourcing</h2>
<h3>Total cost of ownership (TCO) beyond price</h3>
<p><strong>TCO</strong> is the full cost of a sourcing decision over its life, not just the invoice. For global sourcing, several components are easy to underestimate because they don't appear on the supplier's quote:</p>
<pre><code>TCO = Purchase price
    + Freight & insurance
    + Duty & customs fees
    + Inventory carrying cost (longer lead time = more safety stock)
    + Quality cost (inspection, rework, returns, warranty)
    + Risk premium (currency, disruption, political)
    - Any FTA duty savings
</code></pre>
<p>A supplier that looks 15% cheaper on the invoice can end up costing more once carrying cost (from a much longer lead time) and quality cost (from harder remote oversight) are added in.</p>
<h3>Compliance obligations that travel with global sourcing</h3>
<ul>
<li><strong>Anti-corruption</strong> — laws like the US FCAP (Foreign Corrupt Practices Act) reach a buyer's dealings with foreign suppliers/agents, not just domestic ones.</li>
<li><strong>Forced &amp; child labor</strong> — increasingly enforced through import bans on goods tied to forced labor, not just reputational risk.</li>
<li><strong>Trade/export controls &amp; sanctions</strong> — some suppliers, countries, or goods are legally off-limits regardless of price or quality.</li>
</ul>
<h3>Sustainable sourcing</h3>
<ul>
<li><strong>Supplier code of conduct</strong> — a written standard suppliers must meet (labor, environment, ethics) as a condition of doing business.</li>
<li><strong>Carbon footprint of logistics</strong> — a longer supply chain (offshoring) usually means more transport emissions than nearshoring/reshoring — a factor now weighed alongside cost.</li>
<li><strong>Circular / responsible sourcing</strong> — traceable materials, recyclability, and supplier audits for environmental and social standards (ESG).</li>
</ul>
<div class="callout"><span class="badge">TCO + compliance decide the "real" winner</span> The lowest purchase price is a starting number, not the answer. The supplier that wins on TCO, passes compliance checks, and meets sustainability requirements is the one a mature global sourcing team actually selects.</div>`,
    `<span class="eyebrow">SCM302 · Chương 8 · Bài 8.1</span>
<h2>Tổng chi phí sở hữu toàn cầu, tuân thủ &amp; sourcing bền vững</h2>
<h3>Tổng chi phí sở hữu (TCO) vượt ra ngoài giá mua</h3>
<p><strong>TCO</strong> là toàn bộ chi phí của một quyết định sourcing trong suốt vòng đời của nó, không chỉ hoá đơn. Với sourcing toàn cầu, một số thành phần dễ bị đánh giá thấp vì chúng không hiện trên bảng giá của nhà cung cấp:</p>
<pre><code>TCO = Giá mua
    + Cước vận chuyển & bảo hiểm
    + Thuế nhập khẩu & phí hải quan
    + Chi phí giữ hàng tồn kho (thời gian giao hàng dài hơn = tồn kho an toàn nhiều hơn)
    + Chi phí chất lượng (kiểm tra, làm lại, trả hàng, bảo hành)
    + Phần bù rủi ro (tỷ giá, gián đoạn, chính trị)
    - Bất kỳ khoản tiết kiệm thuế nhờ FTA
</code></pre>
<p>Một nhà cung cấp nhìn có vẻ rẻ hơn 15% trên hoá đơn có thể tốn nhiều hơn khi cộng thêm chi phí giữ hàng (do thời gian giao hàng dài hơn nhiều) và chi phí chất lượng (do giám sát từ xa khó hơn).</p>
<h3>Nghĩa vụ tuân thủ đi kèm sourcing toàn cầu</h3>
<ul>
<li><strong>Chống tham nhũng</strong> — các luật như FCPA của Mỹ (Luật Chống Hành vi Tham nhũng ở Nước ngoài) áp dụng cho giao dịch của bên mua với nhà cung cấp/đại lý nước ngoài, không chỉ trong nước.</li>
<li><strong>Lao động cưỡng bức &amp; trẻ em</strong> — ngày càng được thực thi qua lệnh cấm nhập khẩu hàng hoá liên quan đến lao động cưỡng bức, không chỉ là rủi ro danh tiếng.</li>
<li><strong>Kiểm soát xuất/nhập khẩu &amp; cấm vận</strong> — một số nhà cung cấp, quốc gia hoặc hàng hoá bị cấm về mặt pháp lý bất kể giá hay chất lượng.</li>
</ul>
<h3>Sourcing bền vững</h3>
<ul>
<li><strong>Bộ quy tắc ứng xử nhà cung cấp</strong> — tiêu chuẩn viết ra mà nhà cung cấp phải đáp ứng (lao động, môi trường, đạo đức) như điều kiện để hợp tác kinh doanh.</li>
<li><strong>Dấu chân carbon của logistics</strong> — chuỗi cung dài hơn (offshoring) thường có phát thải vận chuyển nhiều hơn nearshoring/reshoring — một yếu tố nay được cân nhắc cùng với chi phí.</li>
<li><strong>Sourcing tuần hoàn / có trách nhiệm</strong> — nguyên liệu có thể truy xuất, khả năng tái chế, và kiểm định nhà cung cấp theo tiêu chuẩn môi trường &amp; xã hội (ESG).</li>
</ul>
<div class="callout"><span class="badge">TCO + tuân thủ mới quyết định người thắng "thật"</span> Giá mua thấp nhất chỉ là con số khởi điểm, không phải câu trả lời. Nhà cung cấp thắng về TCO, qua được kiểm tra tuân thủ, và đáp ứng yêu cầu bền vững mới là nhà cung cấp mà một đội sourcing toàn cầu trưởng thành thực sự chọn.</div>`,
  ]]);

const c8q = quiz('scm302-quiz-8', 'Quiz 8 — Global TCO, compliance & sustainable sourcing|||Quiz 8 — TCO toàn cầu, tuân thủ & sourcing bền vững', [
  { id: 'q1', question: 'Vì sao thời gian giao hàng dài hơn (như trong offshoring) làm tăng TCO?', options: ['Vì luôn làm giá mua tăng', 'Vì cần tồn kho an toàn nhiều hơn, tăng chi phí giữ hàng', 'Vì hải quan luôn phạt', 'Không liên quan đến TCO'], correctIndex: 1, explanation: 'Thời gian giao hàng dài hơn buộc giữ nhiều tồn kho an toàn hơn, làm tăng chi phí giữ hàng — một thành phần của TCO.' },
  { id: 'q2', question: 'Luật chống tham nhũng như FCPA của Mỹ áp dụng cho đối tượng nào?', options: ['Chỉ giao dịch trong nước Mỹ', 'Cả giao dịch với nhà cung cấp/đại lý NƯỚC NGOÀI', 'Chỉ áp dụng cho chính phủ', 'Không áp dụng cho doanh nghiệp tư nhân'], correctIndex: 1, explanation: 'FCPA reach cả giao dịch của bên mua với nhà cung cấp/đại lý nước ngoài, không chỉ trong nước Mỹ.' },
  { id: 'q3', question: 'Vì sao "giá mua thấp nhất" không phải là câu trả lời cuối cùng khi chọn nhà cung cấp toàn cầu?', options: ['Vì giá mua không quan trọng', 'Vì phải cân với TCO, tuân thủ và yêu cầu bền vững', 'Vì giá luôn sai', 'Vì Incoterms quyết định tất cả'], correctIndex: 1, explanation: 'Quyết định đúng cần cân giá mua với TCO đầy đủ, tuân thủ pháp lý, và yêu cầu sourcing bền vững.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'SCM302',
    slug: 'scm302-procurement-and-global-sourcing',
    title: 'Procurement and Global Sourcing',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SCM302.webp',
    shortDescription: 'Global sourcing — offshoring/nearshoring/reshoring, supplier evaluation, Incoterms 2020, L/C & T/T payment, import customs & tariffs, FX & supply risk, TCO and sustainable sourcing. Bilingual, examples & quizzes.|||Tìm nguồn toàn cầu — offshoring/nearshoring/reshoring, đánh giá nhà cung cấp, Incoterms 2020, thanh toán L/C & T/T, hải quan & thuế nhập khẩu, rủi ro tỷ giá & chuỗi cung, TCO và sourcing bền vững. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>SCM302 — Procurement and Global Sourcing</strong> (kỳ 3, khối Quản trị Kinh doanh) tập trung vào <strong>tìm nguồn XUYÊN BIÊN GIỚI</strong> — khác PCM301 (quy trình thu mua nội bộ) và PSS301 (chiến lược nguồn cung chung). Từ <strong>động lực &amp; rủi ro sourcing toàn cầu</strong> → <strong>chiến lược offshoring/nearshoring/reshoring</strong> → <strong>tìm &amp; đánh giá nhà cung cấp quốc tế</strong> → <strong>Incoterms 2020</strong> → <strong>thanh toán quốc tế (L/C, T/T)</strong> → <strong>logistics nhập khẩu &amp; hải quan</strong> → <strong>rủi ro tỷ giá, văn hoá &amp; chuỗi cung</strong> → <strong>tổng chi phí sở hữu, tuân thủ &amp; sourcing bền vững</strong>. Bám giáo trình Trent/Monczka, Wood/Barone và Incoterms® 2020 (ICC), song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Thu mua vs sourcing vs tìm nguồn toàn cầu; động lực & rủi ro sourcing quốc tế; offshoring/nearshoring/reshoring & đánh đổi chi phí-thời gian-kiểm soát; phễu tìm nguồn & bảng chấm điểm nhà cung cấp; 8 điều kiện Incoterms 2020 (EXW, FOB, CIF, DAP, DDP...) & điểm chuyển rủi ro; L/C, T/T, D/P, D/A & phổ thanh toán quốc tế; chứng từ nhập khẩu, mã HS, thông quan & FTA; rủi ro tỷ giá (hedging) & khác biệt văn hoá; tổng chi phí sở hữu (TCO), tuân thủ chống tham nhũng/lao động & sourcing bền vững.',
    requirements: 'Kiến thức nhập môn Quản trị chuỗi cung ứng/Thu mua. Nên đọc trước Incoterms® 2020 (ICC) để hình dung điều kiện thương mại quốc tế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách tham khảo, Incoterms 2020, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Thu mua vs sourcing vs tìm nguồn toàn cầu; vì sao vượt biên giới; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan thu mua & tìm nguồn toàn cầu|||Chapter 1 — Global procurement & sourcing overview', description: 'Định nghĩa; 5 động lực; 5 nhóm rủi ro.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chiến lược sourcing quốc tế|||Chapter 2 — International sourcing strategy', description: 'Offshoring, nearshoring, reshoring & đánh đổi.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tìm kiếm & đánh giá nhà cung cấp quốc tế|||Chapter 3 — Global supplier search & evaluation', description: 'Phễu tìm nguồn, tiêu chí, bảng chấm điểm.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Incoterms 2020 & điều kiện thương mại|||Chapter 4 — Incoterms 2020 & trade terms', description: 'EXW, FOB, CIF, DAP, DDP & điểm chuyển rủi ro.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thanh toán quốc tế & tài trợ thương mại|||Chapter 5 — International payment & trade finance', description: 'L/C, T/T, D/P, D/A & phổ thanh toán.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Logistics nhập khẩu, hải quan & thuế quan|||Chapter 6 — Import logistics, customs & tariffs', description: 'Chứng từ, mã HS, thông quan, FTA.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Rủi ro tỷ giá, văn hoá & chuỗi cung|||Chapter 7 — FX, cultural & supply chain risk', description: 'Hedging, khác biệt văn hoá, bản đồ rủi ro.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Tổng chi phí sở hữu toàn cầu & sourcing bền vững|||Chapter 8 — Global TCO & sustainable sourcing', description: 'TCO, tuân thủ, sourcing bền vững.', lessons: [c8, c8q] },
  ],
};
