/**
 * SCM303 — Logistics and Supply Chain Management. Khối Quản trị Kinh doanh
 * (BBA), FPTU, Kỳ 3. Giáo trình tham khảo (KHÔNG upload PDF): "Logistics
 * Management and Strategy" (Harrison & van Hoek); "Supply Chain Logistics
 * Management" (Bowersox/Closs/Cooper). Nhấn LOGISTICS vận hành (vận tải,
 * kho bãi, phân phối, last-mile) — khác SCM201 (tổng quan chuỗi cung) và
 * SCM302 (global sourcing/thu mua). 8 chương, song ngữ + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/thumbnailUrl. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('scm303-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình tham khảo (Harrison & van Hoek; Bowersox/Closs/Cooper), tài liệu chính thức miễn phí (CSCMP, Investopedia), YouTube, công cụ mô phỏng, lộ trình tự học.',
  [[
    `<span class="eyebrow">SCM303 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Logistics and Supply Chain Management — transportation, warehousing, inventory, distribution, last-mile and logistics technology — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal reference resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for SCM303 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Logistics Management and Strategy</em> — Alan Harrison &amp; Remko van Hoek (Pearson)</li>
<li><em>Supply Chain Logistics Management</em> — Bowersox, Closs &amp; Cooper (McGraw-Hill)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://cscmp.org/CSCMP/Educate/SCM_Definitions_and_Glossary_of_Terms.aspx" target="_blank" rel="noopener">CSCMP — Supply Chain Management Definitions &amp; Glossary</a></li>
<li><a href="https://www.investopedia.com/terms/l/logistics.asp" target="_blank" rel="noopener">Investopedia — Logistics &amp; Supply Chain articles</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@MITCTL" target="_blank" rel="noopener">MIT Center for Transportation &amp; Logistics (MIT CTL)</a> — research-backed talks on logistics &amp; supply chain</li>
<li><a href="https://www.youtube.com/@cscmpvideos" target="_blank" rel="noopener">CSCMP</a> — practitioner webinars &amp; industry trends</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://beergame.mit.edu/" target="_blank" rel="noopener">The Beer Game (MIT)</a> — classic supply-chain simulation, feel the bullwhip effect firsthand</li>
<li><strong>AnyLogistix / FlexSim</strong> — logistics network &amp; warehouse simulation software (free student/trial licenses)</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — what logistics is, its role in the supply chain, transportation modes, warehousing basics.</li>
<li><strong>Practice</strong> — work EOQ/reorder-point and cost-tradeoff numbers until the arithmetic is automatic.</li>
<li><strong>Go deeper</strong> — network design, reverse logistics &amp; last-mile, WMS/TMS technology.</li>
<li><strong>Job-ready</strong> — read real KPI dashboards (OTD, fill rate, perfect order) and connect them to e-commerce/green trends.</li>
</ol></div>`,
    `<span class="eyebrow">SCM303 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Logistics &amp; Quản trị Chuỗi Cung ứng — vận tải, kho bãi, tồn kho, phân phối, giao chặng cuối và công nghệ logistics — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn tham khảo miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của SCM303 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Logistics Management and Strategy</em> — Alan Harrison &amp; Remko van Hoek (Pearson)</li>
<li><em>Supply Chain Logistics Management</em> — Bowersox, Closs &amp; Cooper (McGraw-Hill)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://cscmp.org/CSCMP/Educate/SCM_Definitions_and_Glossary_of_Terms.aspx" target="_blank" rel="noopener">CSCMP — Định nghĩa &amp; thuật ngữ quản trị chuỗi cung ứng</a></li>
<li><a href="https://www.investopedia.com/terms/l/logistics.asp" target="_blank" rel="noopener">Investopedia — Bài viết Logistics &amp; Supply Chain</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MITCTL" target="_blank" rel="noopener">MIT Center for Transportation &amp; Logistics (MIT CTL)</a> — bài nói dựa trên nghiên cứu về logistics &amp; chuỗi cung ứng</li>
<li><a href="https://www.youtube.com/@cscmpvideos" target="_blank" rel="noopener">CSCMP</a> — webinar thực tiễn &amp; xu hướng ngành</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://beergame.mit.edu/" target="_blank" rel="noopener">The Beer Game (MIT)</a> — mô phỏng chuỗi cung ứng kinh điển, cảm nhận trực tiếp hiệu ứng bullwhip</li>
<li><strong>AnyLogistix / FlexSim</strong> — phần mềm mô phỏng mạng lưới logistics &amp; kho bãi (bản trial/sinh viên miễn phí)</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — logistics là gì, vai trò trong chuỗi cung ứng, phương thức vận tải, kho bãi cơ bản.</li>
<li><strong>Luyện tập</strong> — làm bài toán EOQ/điểm đặt hàng lại và đánh đổi chi phí đến khi tính nhoay nhoáy.</li>
<li><strong>Đào sâu thực tế</strong> — thiết kế mạng lưới, logistics ngược &amp; last-mile, công nghệ WMS/TMS.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc dashboard KPI thật (OTD, fill rate, perfect order) và gắn với xu hướng thương mại điện tử/logistics xanh.</li>
</ol></div>`,
  ]]);

const intro = doc('scm303-0-1-overview', 'Course overview: Logistics and Supply Chain Management|||Tổng quan: Logistics & Quản trị Chuỗi Cung ứng',
  'Logistics là gì, khác gì SCM tổng quan (SCM201) và thu mua/sourcing (SCM302); 7 chữ R của logistics; lộ trình 8 chương.',
  [[
    `<span class="eyebrow">SCM303 · Lesson 0.1 · Overview</span>
<h2>Logistics and Supply Chain Management</h2>
<p class="lead">This course zooms in on the <strong>operational, physical side</strong> of the supply chain: how goods actually move and get stored. CSCMP defines <strong>logistics</strong> as the part of supply chain management that plans, implements and controls the efficient forward and reverse flow and storage of goods, services and related information between the point of origin and the point of consumption to meet customers' requirements.</p>
<h3>Logistics vs. the wider supply chain</h3>
<ul>
<li><strong>SCM201 (Supply Chain overview)</strong> — the whole network: suppliers, manufacturers, distributors, retailers, and the relationships/coordination between them.</li>
<li><strong>SCM302 (Global sourcing/procurement)</strong> — deciding <em>what to buy, from whom, at what price</em> — the upstream sourcing decision.</li>
<li><strong>SCM303 (this course) — Logistics</strong> — once goods exist, how do they physically get <em>transported, stored, and delivered</em>: transportation, warehousing, inventory, distribution networks, reverse flows and the technology that runs them.</li>
</ul>
<h3>The 7 Rs of logistics</h3>
<p>Good logistics delivers: the <strong>Right</strong> product, in the <strong>Right</strong> quantity and <strong>Right</strong> condition, to the <strong>Right</strong> place, at the <strong>Right</strong> time, to the <strong>Right</strong> customer, at the <strong>Right</strong> cost.</p>
<h3>Roadmap</h3>
<p>Logistics overview &amp; role → transportation modes → warehousing &amp; layout → inventory &amp; order processing → distribution network design → reverse logistics &amp; last-mile → logistics technology (WMS/TMS/IoT) → green logistics, KPIs &amp; e-commerce trends. Bilingual, with worked examples and quizzes.</p>`,
    `<span class="eyebrow">SCM303 · Bài 0.1 · Tổng quan</span>
<h2>Logistics &amp; Quản trị Chuỗi Cung ứng</h2>
<p class="lead">Môn này đi sâu vào <strong>mặt vận hành, vật lý</strong> của chuỗi cung ứng: hàng hoá thực sự di chuyển và được lưu trữ ra sao. CSCMP định nghĩa <strong>logistics</strong> là phần của quản trị chuỗi cung ứng lập kế hoạch, triển khai và kiểm soát dòng chảy — cả xuôi lẫn ngược — và lưu trữ hàng hoá, dịch vụ và thông tin liên quan một cách hiệu quả từ điểm xuất phát đến điểm tiêu dùng, để đáp ứng yêu cầu khách hàng.</p>
<h3>Logistics khác gì chuỗi cung ứng tổng quát</h3>
<ul>
<li><strong>SCM201 (Tổng quan chuỗi cung ứng)</strong> — toàn mạng lưới: nhà cung cấp, nhà sản xuất, nhà phân phối, nhà bán lẻ, và cách phối hợp/quan hệ giữa họ.</li>
<li><strong>SCM302 (Thu mua/sourcing toàn cầu)</strong> — quyết định <em>mua gì, từ ai, giá nào</em> — quyết định thu mua ở đầu nguồn.</li>
<li><strong>SCM303 (môn này) — Logistics</strong> — khi hàng hoá đã có, làm sao <em>vận chuyển, lưu trữ và giao hàng</em> về mặt vật lý: vận tải, kho bãi, tồn kho, mạng lưới phân phối, dòng chảy ngược và công nghệ vận hành chúng.</li>
</ul>
<h3>7 chữ R của logistics</h3>
<p>Logistics tốt giao: <strong>Đúng</strong> sản phẩm, <strong>Đúng</strong> số lượng và <strong>Đúng</strong> tình trạng, đến <strong>Đúng</strong> nơi, vào <strong>Đúng</strong> thời điểm, cho <strong>Đúng</strong> khách hàng, với <strong>Đúng</strong> chi phí.</p>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; vai trò logistics → phương thức vận tải → kho bãi &amp; bố trí → tồn kho &amp; xử lý đơn hàng → thiết kế mạng lưới phân phối → logistics ngược &amp; last-mile → công nghệ logistics (WMS/TMS/IoT) → logistics xanh, KPI &amp; xu hướng thương mại điện tử. Song ngữ, có ví dụ mẫu và quiz.</p>`,
  ]]);

const c1 = doc('scm303-1-1-logistics-overview', '1.1 — Logistics overview & its role in the supply chain|||1.1 — Tổng quan logistics & vai trò trong chuỗi cung ứng',
  'Định nghĩa logistics (CSCMP); các hoạt động logistics chính; giá trị tạo ra (place/time/quantity/possession utility); 7 chữ R.',
  [[
    `<span class="eyebrow">SCM303 · Chapter 1 · Lesson 1.1</span>
<h2>Logistics overview &amp; its role in the supply chain</h2>
<h3>Key logistics activities</h3>
<ul>
<li><strong>Transportation</strong> — moving goods between locations (road, rail, sea, air, pipeline).</li>
<li><strong>Warehousing &amp; storage</strong> — holding inventory between production and demand.</li>
<li><strong>Inventory management</strong> — deciding how much stock to hold and when to replenish.</li>
<li><strong>Order processing</strong> — capturing, checking and fulfilling customer orders.</li>
<li><strong>Materials handling &amp; packaging</strong> — moving/protecting goods inside facilities and in transit.</li>
<li><strong>Reverse logistics</strong> — returns, repairs, recycling flowing backward.</li>
</ul>
<h3>The value logistics creates</h3>
<p>Logistics doesn't make a product — it makes the product <em>useful</em>, by creating four utilities: <strong>place utility</strong> (the right location), <strong>time utility</strong> (the right moment), <strong>quantity utility</strong> (the right amount), and <strong>possession/quality utility</strong> (in the right hands, right condition).</p>
<pre><code>The 7 Rs of logistics:
 Right product, Right quantity, Right condition,
 Right place,   Right time,     Right customer,
 Right cost.
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Logistics costs typically run 8–15% of a country's GDP and can be 5–35% of a firm's sales — a poorly run logistics function is a direct hit to profit, not a back-office detail.</div>`,
    `<span class="eyebrow">SCM303 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan logistics &amp; vai trò trong chuỗi cung ứng</h2>
<h3>Các hoạt động logistics chính</h3>
<ul>
<li><strong>Vận tải</strong> — di chuyển hàng hoá giữa các địa điểm (đường bộ, đường sắt, đường biển, hàng không, đường ống).</li>
<li><strong>Kho bãi &amp; lưu trữ</strong> — giữ hàng tồn kho giữa lúc sản xuất và lúc có nhu cầu.</li>
<li><strong>Quản lý tồn kho</strong> — quyết định giữ bao nhiêu hàng và khi nào bổ sung.</li>
<li><strong>Xử lý đơn hàng</strong> — ghi nhận, kiểm tra và thực hiện đơn hàng khách.</li>
<li><strong>Xếp dỡ &amp; đóng gói</strong> — di chuyển/bảo vệ hàng trong kho và trên đường vận chuyển.</li>
<li><strong>Logistics ngược</strong> — hàng trả về, sửa chữa, tái chế chảy ngược lại.</li>
</ul>
<h3>Giá trị mà logistics tạo ra</h3>
<p>Logistics không tạo ra sản phẩm — nó làm sản phẩm <em>trở nên hữu dụng</em>, bằng cách tạo bốn loại giá trị: <strong>giá trị địa điểm</strong> (đúng nơi), <strong>giá trị thời gian</strong> (đúng lúc), <strong>giá trị số lượng</strong> (đúng lượng), và <strong>giá trị sở hữu/chất lượng</strong> (đúng người, đúng tình trạng).</p>
<pre><code>7 chữ R của logistics:
 Đúng sản phẩm, Đúng số lượng, Đúng tình trạng,
 Đúng nơi,      Đúng lúc,      Đúng khách hàng,
 Đúng chi phí.
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Chi phí logistics thường chiếm 8–15% GDP một quốc gia và có thể chiếm 5–35% doanh thu một doanh nghiệp — vận hành logistics kém là cú đánh trực tiếp vào lợi nhuận, không phải chi tiết hậu trường.</div>`,
  ]]);

const c1q = quiz('scm303-quiz-1', 'Quiz 1 — Logistics overview|||Quiz 1 — Tổng quan logistics', [
  { id: 'q1', question: 'Theo định nghĩa CSCMP, logistics là phần của quản trị chuỗi cung ứng xử lý điều gì?', options: ['Chỉ đàm phán giá với nhà cung cấp', 'Dòng chảy & lưu trữ hàng hoá, dịch vụ, thông tin từ điểm xuất phát đến điểm tiêu dùng', 'Chỉ marketing sản phẩm', 'Chỉ tuyển dụng nhân sự kho'], correctIndex: 1, explanation: 'CSCMP: logistics lập kế hoạch, triển khai, kiểm soát dòng chảy xuôi/ngược và lưu trữ hàng hoá-dịch vụ-thông tin để đáp ứng yêu cầu khách hàng.' },
  { id: 'q2', question: 'Môn SCM303 (logistics vận hành) khác SCM302 (thu mua toàn cầu) chủ yếu ở điểm nào?', options: ['SCM303 lo mua gì/từ ai, SCM302 lo vận chuyển', 'SCM302 quyết định mua gì/từ ai/giá nào; SCM303 lo vận chuyển-lưu trữ-giao hàng hoá đã có', 'Hai môn hoàn toàn giống nhau', 'SCM303 chỉ học về tài chính chuỗi cung ứng'], correctIndex: 1, explanation: 'SCM302 là quyết định thu mua đầu nguồn; SCM303 là vận hành vật lý sau khi hàng đã tồn tại: vận tải, kho bãi, phân phối.' },
  { id: 'q3', question: 'Logistics tạo ra "giá trị địa điểm" (place utility) nghĩa là gì?', options: ['Giảm giá bán sản phẩm', 'Đưa hàng đến đúng nơi khách hàng cần', 'Tăng số lượng nhân viên bán hàng', 'Thay đổi thiết kế sản phẩm'], correctIndex: 1, explanation: 'Giá trị địa điểm = đưa sản phẩm đến đúng vị trí khách cần, một trong bốn giá trị logistics tạo ra (cùng thời gian, số lượng, sở hữu).' },
]);

const c2 = doc('scm303-2-1-transportation', '2.1 — Transportation management & modes|||2.1 — Quản trị vận tải & phương thức vận chuyển',
  '5 phương thức vận tải (đường bộ/biển/hàng không/đường sắt/đường ống) & đánh đổi chi phí-tốc độ-linh hoạt; vận tải đa phương thức (intermodal).',
  [[
    `<span class="eyebrow">SCM303 · Chapter 2 · Lesson 2.1</span>
<h2>Transportation management &amp; modes of shipment</h2>
<p>Transportation is usually the <strong>single largest cost component</strong> of logistics — it bridges the place gap between where goods are produced and where they're consumed. Choosing a mode is a trade-off between cost, speed, capacity and flexibility.</p>
<h3>Five modes</h3>
<ul>
<li><strong>Road (trucking)</strong> — most flexible, door-to-door, moderate cost/speed; dominant for domestic/short-to-medium haul.</li>
<li><strong>Rail</strong> — very high volume/weight over long land distances, low cost per unit, but slower and less flexible (fixed tracks, needs drayage to/from the rail yard).</li>
<li><strong>Water (ocean/sea)</strong> — highest volume capacity, lowest cost per unit, slowest; the backbone of international trade (containers).</li>
<li><strong>Air</strong> — fastest, most expensive; used for high-value, perishable or urgent goods.</li>
<li><strong>Pipeline</strong> — specialized, continuous flow of liquids/gases (oil, gas); very low variable cost but zero flexibility of route or product.</li>
</ul>
<h3>Intermodal / multimodal transportation</h3>
<p>Combining two or more modes for one shipment — e.g. a container that travels by ship, then rail, then truck without being unpacked — captures each mode's strength (sea's low cost + truck's door-to-door reach).</p>
<pre><code>Mode        Cost/unit   Speed     Flexibility   Capacity
Road        Medium      Medium    Highest       Medium
Rail        Low         Slow      Low           High
Sea         Lowest      Slowest   Lowest        Highest
Air         Highest     Fastest   Medium        Low
Pipeline    Very low    Continuous  None (fixed) High (liquids/gas only)
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> There's no "best" mode — only the best mode for a given shipment's value, urgency and volume. High-value/urgent → air; heavy/bulky/not urgent → sea or rail.</div>`,
    `<span class="eyebrow">SCM303 · Chương 2 · Bài 2.1</span>
<h2>Quản trị vận tải &amp; phương thức vận chuyển</h2>
<p>Vận tải thường là <strong>thành phần chi phí lớn nhất</strong> của logistics — nó lấp khoảng cách địa điểm giữa nơi sản xuất và nơi tiêu dùng. Chọn phương thức là một đánh đổi giữa chi phí, tốc độ, khả năng chuyên chở và độ linh hoạt.</p>
<h3>Năm phương thức</h3>
<ul>
<li><strong>Đường bộ (xe tải)</strong> — linh hoạt nhất, giao door-to-door, chi phí/tốc độ trung bình; chủ đạo cho vận chuyển nội địa/khoảng cách ngắn-trung.</li>
<li><strong>Đường sắt</strong> — khối lượng/trọng lượng rất lớn trên khoảng cách xa trên đất liền, chi phí trên đơn vị thấp, nhưng chậm và kém linh hoạt (đường ray cố định, cần vận chuyển phụ đến/từ bãi đường sắt).</li>
<li><strong>Đường biển</strong> — khả năng chuyên chở lớn nhất, chi phí trên đơn vị thấp nhất, chậm nhất; xương sống của thương mại quốc tế (container).</li>
<li><strong>Hàng không</strong> — nhanh nhất, đắt nhất; dùng cho hàng giá trị cao, dễ hỏng hoặc gấp.</li>
<li><strong>Đường ống</strong> — chuyên dụng, dòng chảy liên tục của chất lỏng/khí (dầu, gas); chi phí biến đổi rất thấp nhưng không có linh hoạt về tuyến hay loại hàng.</li>
</ul>
<h3>Vận tải đa phương thức (intermodal/multimodal)</h3>
<p>Kết hợp hai hoặc nhiều phương thức cho một lô hàng — vd container đi bằng tàu, rồi tàu hoả, rồi xe tải mà không cần dỡ hàng — tận dụng thế mạnh của từng phương thức (chi phí thấp của đường biển + khả năng door-to-door của xe tải).</p>
<pre><code>Phương thức  Chi phí/đv  Tốc độ    Linh hoạt      Khả năng chở
Đường bộ     Trung bình  Trung bình Cao nhất      Trung bình
Đường sắt    Thấp        Chậm      Thấp           Cao
Đường biển   Thấp nhất   Chậm nhất Thấp nhất      Cao nhất
Hàng không   Cao nhất    Nhanh nhất Trung bình    Thấp
Đường ống    Rất thấp    Liên tục  Không (cố định) Cao (chỉ lỏng/khí)
</code></pre>
<div class="callout"><span class="badge">Quy tắc chọn</span> Không có phương thức "tốt nhất" — chỉ có phương thức phù hợp nhất với giá trị, độ gấp và khối lượng của từng lô hàng. Giá trị cao/gấp → hàng không; nặng/cồng kềnh/không gấp → đường biển hoặc đường sắt.</div>`,
  ]]);

const c2q = quiz('scm303-quiz-2', 'Quiz 2 — Vận tải & phương thức|||Quiz 2 — Vận tải & phương thức', [
  { id: 'q1', question: 'Phương thức vận tải nào có chi phí trên đơn vị THẤP NHẤT nhưng cũng CHẬM NHẤT?', options: ['Hàng không', 'Đường bộ', 'Đường biển', 'Đường ống'], correctIndex: 2, explanation: 'Đường biển chở khối lượng lớn nhất, giá rẻ nhất trên đơn vị, nhưng chậm nhất — phù hợp hàng không gấp, khối lượng lớn.' },
  { id: 'q2', question: 'Vận tải đa phương thức (intermodal) nghĩa là gì?', options: ['Chỉ dùng một phương thức duy nhất cho mọi lô hàng', 'Kết hợp ≥2 phương thức cho một lô hàng, thường không dỡ hàng khi chuyển đổi', 'Chỉ áp dụng cho hàng không', 'Là tên khác của kho bãi'], correctIndex: 1, explanation: 'Intermodal kết hợp nhiều phương thức (vd tàu biển→tàu hoả→xe tải) để tận dụng thế mạnh từng loại, container không cần mở khi đổi phương thức.' },
  { id: 'q3', question: 'Nên chọn phương thức nào cho lô hàng giá trị cao, dễ hỏng, cần gấp?', options: ['Đường ống', 'Đường sắt', 'Hàng không', 'Đường biển'], correctIndex: 2, explanation: 'Hàng không nhanh nhất, phù hợp hàng giá trị cao/dễ hỏng/gấp, đổi lại chi phí cao nhất.' },
]);

const c3 = doc('scm303-3-1-warehousing', '3.1 — Warehousing & storage management|||3.1 — Quản trị kho bãi & lưu trữ',
  'Vai trò kho bãi (đệm, hợp nhất, cross-docking); loại kho; bố trí (layout), phân vùng, slotting theo ABC; thiết bị xếp dỡ.',
  [[
    `<span class="eyebrow">SCM303 · Chapter 3 · Lesson 3.1</span>
<h2>Warehousing &amp; storage management</h2>
<h3>Why warehouse at all</h3>
<ul>
<li><strong>Buffering</strong> — absorb the mismatch between production schedules and demand timing.</li>
<li><strong>Consolidation / break-bulk</strong> — combine small shipments into full loads (or split large loads into smaller ones) to cut transport cost.</li>
<li><strong>Cross-docking</strong> — goods move from inbound truck straight to outbound truck with little/no storage — fast, low inventory-holding cost.</li>
<li><strong>Value-added services</strong> — kitting, labeling, light assembly, quality inspection performed inside the warehouse.</li>
</ul>
<h3>Warehouse types</h3>
<p><strong>Private</strong> (company-owned), <strong>public</strong> (rented, pay-per-use), <strong>contract</strong> (dedicated 3PL-operated facility), and <strong>distribution centers (DC)</strong> — high-throughput facilities designed for fast flow rather than long-term storage.</p>
<h3>Layout &amp; slotting</h3>
<p>A warehouse is organized into <strong>zones</strong>: receiving → putaway → storage → picking → packing → shipping. Common flow patterns are <strong>U-shaped</strong> (receiving and shipping share one side, efficient for cross-docking) and <strong>straight-through</strong> (receiving and shipping on opposite sides, better for high volume). <strong>Slotting</strong> places fast-moving SKUs (Class A, by ABC analysis) closest to shipping docks to minimize travel/picking time.</p>
<pre><code>Warehouse flow:
Receiving -&gt; Putaway -&gt; Storage -&gt; Picking -&gt; Packing -&gt; Shipping
(inbound dock)                                          (outbound dock)
</code></pre>
<div class="callout"><span class="badge">ABC slotting</span> Class A (fast movers, ~20% of SKUs, ~80% of picks) → nearest to shipping. Class C (slow movers) → farthest. This alone can cut picker travel time dramatically.</div>`,
    `<span class="eyebrow">SCM303 · Chương 3 · Bài 3.1</span>
<h2>Quản trị kho bãi &amp; lưu trữ</h2>
<h3>Vì sao cần kho bãi</h3>
<ul>
<li><strong>Đệm (buffering)</strong> — hấp thụ độ lệch giữa lịch sản xuất và thời điểm có nhu cầu.</li>
<li><strong>Hợp nhất / chia nhỏ (consolidation/break-bulk)</strong> — ghép các lô nhỏ thành lô đầy (hoặc chia lô lớn thành lô nhỏ) để giảm chi phí vận tải.</li>
<li><strong>Cross-docking</strong> — hàng chuyển từ xe tải đến thẳng sang xe tải đi, lưu kho rất ít hoặc không lưu — nhanh, chi phí giữ hàng thấp.</li>
<li><strong>Dịch vụ giá trị gia tăng</strong> — đóng gói theo bộ (kitting), dán nhãn, lắp ráp nhẹ, kiểm tra chất lượng thực hiện ngay trong kho.</li>
</ul>
<h3>Các loại kho</h3>
<p><strong>Kho riêng</strong> (công ty tự có), <strong>kho công cộng</strong> (thuê, trả theo sử dụng), <strong>kho theo hợp đồng</strong> (cơ sở dành riêng do 3PL vận hành), và <strong>trung tâm phân phối (DC)</strong> — cơ sở thông lượng cao thiết kế cho luân chuyển nhanh hơn là lưu trữ dài hạn.</p>
<h3>Bố trí &amp; slotting</h3>
<p>Một kho được tổ chức theo <strong>vùng</strong>: nhận hàng → cất hàng → lưu trữ → lấy hàng → đóng gói → xuất hàng. Các mẫu luân chuyển phổ biến là <strong>hình U</strong> (nhận và xuất chung một phía, hiệu quả cho cross-docking) và <strong>xuyên thẳng</strong> (nhận và xuất đối diện nhau, tốt hơn cho khối lượng lớn). <strong>Slotting</strong> đặt các SKU luân chuyển nhanh (nhóm A theo phân tích ABC) gần cửa xuất hàng nhất để giảm thời gian di chuyển/lấy hàng.</p>
<pre><code>Luồng kho:
Nhận hàng -&gt; Cất hàng -&gt; Lưu trữ -&gt; Lấy hàng -&gt; Đóng gói -&gt; Xuất hàng
(cửa nhập)                                              (cửa xuất)
</code></pre>
<div class="callout"><span class="badge">Slotting theo ABC</span> Nhóm A (luân chuyển nhanh, ~20% SKU, ~80% lượt lấy) → gần cửa xuất nhất. Nhóm C (chậm) → xa nhất. Chỉ riêng việc này đã giảm mạnh thời gian di chuyển của người lấy hàng.</div>`,
  ]]);

const c3q = quiz('scm303-quiz-3', 'Quiz 3 — Kho bãi & lưu trữ|||Quiz 3 — Kho bãi & lưu trữ', [
  { id: 'q1', question: 'Cross-docking là gì?', options: ['Lưu trữ hàng dài hạn trong kho', 'Hàng chuyển từ xe nhập thẳng sang xe xuất, ít/không lưu kho', 'Chỉ dùng cho vận tải hàng không', 'Là tên khác của trung tâm phân phối'], correctIndex: 1, explanation: 'Cross-docking: hàng đi thẳng từ dock nhập sang dock xuất, giảm tối đa thời gian và chi phí lưu kho.' },
  { id: 'q2', question: 'Theo phân tích ABC trong slotting, SKU nhóm A (luân chuyển nhanh) nên đặt ở đâu trong kho?', options: ['Xa cửa xuất hàng nhất', 'Gần cửa xuất hàng nhất', 'Ở tầng cao nhất của kệ', 'Vị trí ngẫu nhiên'], correctIndex: 1, explanation: 'SKU nhóm A chiếm phần lớn lượt lấy hàng nên đặt gần cửa xuất nhất để giảm thời gian di chuyển của người lấy hàng.' },
  { id: 'q3', question: 'Luồng kho chuẩn theo thứ tự nào?', options: ['Xuất hàng → Lấy hàng → Nhận hàng', 'Nhận hàng → Cất hàng → Lưu trữ → Lấy hàng → Đóng gói → Xuất hàng', 'Đóng gói → Nhận hàng → Xuất hàng', 'Lưu trữ → Xuất hàng → Nhận hàng'], correctIndex: 1, explanation: 'Thứ tự chuẩn: nhận → cất → lưu trữ → lấy → đóng gói → xuất, từ cửa nhập tới cửa xuất.' },
]);

const c4 = doc('scm303-4-1-inventory-order', '4.1 — Inventory management & order processing|||4.1 — Quản lý tồn kho & xử lý đơn hàng',
  'Vì sao giữ tồn kho; chi phí tồn kho; EOQ, điểm đặt hàng lại (ROP), tồn kho an toàn; chu trình xử lý đơn hàng.',
  [[
    `<span class="eyebrow">SCM303 · Chapter 4 · Lesson 4.1</span>
<h2>Inventory management &amp; order processing</h2>
<h3>Why hold inventory</h3>
<p>Firms hold stock to buffer against <strong>demand variability</strong> and <strong>lead-time variability</strong>, capture <strong>economies of scale</strong> in ordering/production, and handle <strong>seasonality</strong>. The cost of holding inventory must be weighed against the cost of ordering too often and the cost of stocking out.</p>
<h3>Three cost buckets</h3>
<ul>
<li><strong>Ordering/setup cost (S)</strong> — fixed cost per order placed, regardless of quantity.</li>
<li><strong>Holding/carrying cost (H)</strong> — cost of keeping one unit in stock for a period (capital, storage, insurance, obsolescence).</li>
<li><strong>Stockout cost</strong> — lost sales, expediting, customer goodwill when demand isn't met.</li>
</ul>
<h3>Economic Order Quantity (EOQ)</h3>
<p>EOQ finds the order quantity that <strong>minimizes total ordering + holding cost</strong>:</p>
<pre><code>EOQ formula:  Q* = sqrt( 2 * D * S / H )
  D = annual demand (units/year)
  S = ordering cost per order
  H = holding cost per unit per year

Example: D = 10,000 units/yr, S = $50/order, H = $2/unit/yr
  Q* = sqrt(2 * 10,000 * 50 / 2) = sqrt(500,000) ≈ 707 units/order
</code></pre>
<h3>Reorder point &amp; safety stock</h3>
<p><strong>Reorder point (ROP) = (average daily demand × lead time) + safety stock.</strong> Safety stock absorbs unexpected spikes in demand or delays in supply so the business doesn't stock out while waiting for the next order to arrive.</p>
<h3>Order processing cycle</h3>
<p>Order receipt → order entry &amp; check → order sourcing (which warehouse/stock) → scheduling → picking &amp; packing → shipping → delivery → documentation/invoicing. Each step adds time to the <strong>order-to-delivery cycle</strong> — a key customer-service metric.</p>`,
    `<span class="eyebrow">SCM303 · Chương 4 · Bài 4.1</span>
<h2>Quản lý tồn kho &amp; xử lý đơn hàng</h2>
<h3>Vì sao cần giữ tồn kho</h3>
<p>Doanh nghiệp giữ hàng để đệm cho <strong>biến động nhu cầu</strong> và <strong>biến động thời gian giao hàng (lead time)</strong>, tận dụng <strong>lợi thế quy mô</strong> khi đặt hàng/sản xuất, và ứng phó <strong>tính mùa vụ</strong>. Chi phí giữ hàng phải được cân đối với chi phí đặt hàng quá thường xuyên và chi phí hết hàng.</p>
<h3>Ba nhóm chi phí</h3>
<ul>
<li><strong>Chi phí đặt hàng/thiết lập (S)</strong> — chi phí cố định mỗi lần đặt hàng, không phụ thuộc số lượng.</li>
<li><strong>Chi phí giữ hàng (H)</strong> — chi phí giữ một đơn vị hàng trong kho một kỳ (vốn, kho bãi, bảo hiểm, hao mòn/lỗi thời).</li>
<li><strong>Chi phí hết hàng (stockout)</strong> — mất doanh số, chi phí gấp gáp, ảnh hưởng uy tín khi không đáp ứng nhu cầu.</li>
</ul>
<h3>Số lượng đặt hàng kinh tế (EOQ)</h3>
<p>EOQ tìm số lượng đặt hàng <strong>tối thiểu hoá tổng chi phí đặt hàng + giữ hàng</strong>:</p>
<pre><code>Công thức EOQ:  Q* = sqrt( 2 * D * S / H )
  D = nhu cầu hàng năm (đơn vị/năm)
  S = chi phí đặt hàng mỗi lần đặt
  H = chi phí giữ hàng mỗi đơn vị mỗi năm

Ví dụ: D = 10.000 đơn vị/năm, S = 50$/lần đặt, H = 2$/đơn vị/năm
  Q* = sqrt(2 * 10.000 * 50 / 2) = sqrt(500.000) ≈ 707 đơn vị/lần đặt
</code></pre>
<h3>Điểm đặt hàng lại &amp; tồn kho an toàn</h3>
<p><strong>Điểm đặt hàng lại (ROP) = (nhu cầu trung bình mỗi ngày × thời gian giao hàng) + tồn kho an toàn.</strong> Tồn kho an toàn hấp thụ những đợt tăng nhu cầu bất ngờ hoặc chậm giao hàng, để doanh nghiệp không hết hàng trong lúc chờ lô hàng mới đến.</p>
<h3>Chu trình xử lý đơn hàng</h3>
<p>Nhận đơn → nhập &amp; kiểm tra đơn → nguồn hàng (kho/tồn kho nào) → lên lịch → lấy &amp; đóng gói → giao vận → giao hàng → chứng từ/xuất hoá đơn. Mỗi bước cộng thêm thời gian vào <strong>chu kỳ từ-đặt-đến-giao</strong> — một chỉ số dịch vụ khách hàng then chốt.</p>`,
  ]]);

const c4q = quiz('scm303-quiz-4', 'Quiz 4 — Tồn kho & xử lý đơn hàng|||Quiz 4 — Tồn kho & xử lý đơn hàng', [
  { id: 'q1', question: 'Công thức EOQ dùng để làm gì?', options: ['Tính lương nhân viên kho', 'Tìm số lượng đặt hàng tối thiểu hoá tổng chi phí đặt hàng + giữ hàng', 'Tính thuế nhập khẩu', 'Chọn phương thức vận tải'], correctIndex: 1, explanation: 'EOQ = sqrt(2DS/H) — cân bằng chi phí đặt hàng (S) và chi phí giữ hàng (H) để có tổng chi phí thấp nhất.' },
  { id: 'q2', question: 'Điểm đặt hàng lại (ROP) được tính bằng?', options: ['Nhu cầu trung bình mỗi ngày × thời gian giao hàng + tồn kho an toàn', 'Chỉ bằng tồn kho an toàn', 'Chi phí đặt hàng chia chi phí giữ hàng', 'Tổng doanh thu năm chia 12'], correctIndex: 0, explanation: 'ROP = (nhu cầu trung bình/ngày × lead time) + tồn kho an toàn — báo hiệu lúc cần đặt hàng lại trước khi hết hàng.' },
  { id: 'q3', question: 'Tồn kho an toàn (safety stock) có vai trò gì?', options: ['Tăng chi phí giữ hàng vô ích', 'Hấp thụ biến động bất ngờ về nhu cầu hoặc chậm giao hàng, tránh hết hàng', 'Thay thế hoàn toàn cho việc dự báo nhu cầu', 'Chỉ dùng cho hàng xuất khẩu'], correctIndex: 1, explanation: 'Safety stock là lớp đệm cho các cú sốc ngoài dự kiến (nhu cầu tăng vọt, giao hàng trễ), giúp tránh stockout.' },
]);

const c5 = doc('scm303-5-1-network-design', '5.1 — Distribution network design & distribution centers|||5.1 — Thiết kế mạng lưới phân phối & trung tâm phân phối',
  'Quyết định số lượng/vị trí trung tâm phân phối; đánh đổi chi phí cơ sở-vận tải-tồn kho-mức dịch vụ; phương pháp trọng tâm (center of gravity); chiến lược phân phối.',
  [[
    `<span class="eyebrow">SCM303 · Chapter 5 · Lesson 5.1</span>
<h2>Distribution network design &amp; distribution centers</h2>
<h3>The core network decision</h3>
<p>How many distribution centers (DCs) should a company have, and where? More DCs → closer to customers → faster delivery and lower transportation cost per shipment, but <strong>higher facility cost and more scattered inventory</strong> (each DC needs its own safety stock). Fewer, larger DCs → cheaper to run and lower total inventory, but longer/more expensive last-mile transport.</p>
<h3>The cost trade-off</h3>
<ul>
<li><strong>Facility cost</strong> — rent, staff, equipment per DC (falls as you consolidate DCs).</li>
<li><strong>Transportation cost</strong> — rises the farther DCs are from customers (fewer DCs = longer average trip).</li>
<li><strong>Inventory cost</strong> — more DCs = more total safety stock needed for the same service level.</li>
<li><strong>Responsiveness / service level</strong> — more DCs closer to demand = faster delivery, a competitive lever especially in e-commerce.</li>
</ul>
<h3>Center-of-gravity method</h3>
<p>A simple way to suggest a DC location: place it near the <strong>demand-weighted centroid</strong> of the customers it serves — the location that minimizes total weighted transportation distance.</p>
<pre><code>Center of gravity (simplified):
  x = Σ(demand_i × x_i) / Σ(demand_i)
  y = Σ(demand_i × y_i) / Σ(demand_i)
(x_i, y_i = customer coordinates; demand_i = customer's volume)
</code></pre>
<h3>Distribution strategies</h3>
<p><strong>Direct shipping</strong> (factory straight to customer, skips the DC — fastest but least consolidation), <strong>DC/warehouse storage</strong> (classic hub, holds inventory), <strong>cross-docking network</strong> (DC as a pass-through, minimal storage), and <strong>milk-run</strong> (one truck makes multiple stops to consolidate small deliveries on one route).</p>
<div class="callout"><span class="badge">No free lunch</span> Network design is always a trade-off — there is no configuration that simultaneously minimizes facility cost, transportation cost, inventory cost AND maximizes speed. Pick the trade-off that matches your customers' service expectations.</div>`,
    `<span class="eyebrow">SCM303 · Chương 5 · Bài 5.1</span>
<h2>Thiết kế mạng lưới phân phối &amp; trung tâm phân phối</h2>
<h3>Quyết định cốt lõi về mạng lưới</h3>
<p>Một công ty nên có bao nhiêu trung tâm phân phối (DC), và đặt ở đâu? Nhiều DC hơn → gần khách hàng hơn → giao hàng nhanh hơn và chi phí vận tải mỗi lô thấp hơn, nhưng <strong>chi phí cơ sở cao hơn và tồn kho phân tán hơn</strong> (mỗi DC cần tồn kho an toàn riêng). Ít DC hơn, quy mô lớn hơn → vận hành rẻ hơn và tổng tồn kho thấp hơn, nhưng vận tải chặng cuối dài/đắt hơn.</p>
<h3>Đánh đổi chi phí</h3>
<ul>
<li><strong>Chi phí cơ sở</strong> — tiền thuê, nhân sự, thiết bị mỗi DC (giảm khi hợp nhất DC).</li>
<li><strong>Chi phí vận tải</strong> — tăng khi DC càng xa khách hàng (ít DC = quãng đường trung bình dài hơn).</li>
<li><strong>Chi phí tồn kho</strong> — nhiều DC hơn = cần nhiều tổng tồn kho an toàn hơn cho cùng mức dịch vụ.</li>
<li><strong>Khả năng phản hồi / mức dịch vụ</strong> — nhiều DC gần khách hàng hơn = giao hàng nhanh hơn, một lợi thế cạnh tranh đặc biệt trong thương mại điện tử.</li>
</ul>
<h3>Phương pháp trọng tâm (center of gravity)</h3>
<p>Một cách đơn giản để gợi ý vị trí DC: đặt gần <strong>trọng tâm theo nhu cầu</strong> của các khách hàng nó phục vụ — vị trí tối thiểu hoá tổng quãng đường vận tải có trọng số.</p>
<pre><code>Trọng tâm (rút gọn):
  x = Σ(nhu cầu_i × x_i) / Σ(nhu cầu_i)
  y = Σ(nhu cầu_i × y_i) / Σ(nhu cầu_i)
(x_i, y_i = toạ độ khách hàng; nhu cầu_i = khối lượng của khách hàng đó)
</code></pre>
<h3>Chiến lược phân phối</h3>
<p><strong>Giao trực tiếp</strong> (từ nhà máy thẳng đến khách, bỏ qua DC — nhanh nhất nhưng ít hợp nhất nhất), <strong>lưu trữ qua DC/kho</strong> (mô hình hub cổ điển, giữ tồn kho), <strong>mạng cross-docking</strong> (DC chỉ là điểm trung chuyển, lưu kho tối thiểu), và <strong>milk-run</strong> (một xe tải dừng nhiều điểm để hợp nhất các lô giao nhỏ trên một tuyến).</p>
<div class="callout"><span class="badge">Không có bữa ăn miễn phí</span> Thiết kế mạng lưới luôn là đánh đổi — không có cấu hình nào vừa tối thiểu hoá chi phí cơ sở, chi phí vận tải, chi phí tồn kho VỪA tối đa hoá tốc độ. Chọn đánh đổi phù hợp với kỳ vọng dịch vụ của khách hàng.</div>`,
  ]]);

const c5q = quiz('scm303-quiz-5', 'Quiz 5 — Thiết kế mạng lưới phân phối|||Quiz 5 — Thiết kế mạng lưới phân phối', [
  { id: 'q1', question: 'Khi tăng số lượng trung tâm phân phối (DC) và đặt gần khách hàng hơn, điều gì thường xảy ra?', options: ['Chi phí cơ sở giảm, chi phí vận tải tăng', 'Giao hàng nhanh hơn nhưng chi phí cơ sở & tổng tồn kho an toàn tăng', 'Không ảnh hưởng gì đến chi phí', 'Chỉ ảnh hưởng đến chi phí nhân sự'], correctIndex: 1, explanation: 'Nhiều DC gần khách hơn → tốc độ giao hàng tăng, nhưng chi phí cơ sở và tổng tồn kho an toàn (phân tán ở nhiều nơi) cũng tăng.' },
  { id: 'q2', question: 'Phương pháp "center of gravity" trong thiết kế mạng lưới dùng để làm gì?', options: ['Tính lương nhân viên', 'Gợi ý vị trí DC gần trọng tâm nhu cầu để tối thiểu hoá quãng đường vận tải có trọng số', 'Chọn phương thức vận tải', 'Tính EOQ'], correctIndex: 1, explanation: 'Center of gravity đặt DC ở vị trí trung bình có trọng số theo nhu cầu khách hàng, giảm tổng chi phí vận tải.' },
  { id: 'q3', question: 'Cross-docking trong mạng lưới phân phối có đặc điểm gì?', options: ['Lưu trữ hàng dài hạn tại DC', 'DC chỉ là điểm trung chuyển, hàng qua nhanh với lưu kho tối thiểu', 'Chỉ áp dụng cho vận tải hàng không', 'Là chiến lược tăng tồn kho an toàn'], correctIndex: 1, explanation: 'Trong mạng cross-docking, DC đóng vai trò trung chuyển nhanh, hàng không lưu kho lâu, giảm chi phí tồn kho.' },
]);

const c6 = doc('scm303-6-1-reverse-lastmile', '6.1 — Reverse logistics & last-mile delivery|||6.1 — Logistics ngược & giao hàng chặng cuối',
  'Logistics ngược (trả hàng, sửa chữa, tái chế) & quy trình xử lý; last-mile delivery — thử thách & giải pháp (điểm nhận hàng, tủ khoá, micro-fulfillment).',
  [[
    `<span class="eyebrow">SCM303 · Chapter 6 · Lesson 6.1</span>
<h2>Reverse logistics &amp; last-mile delivery</h2>
<h3>Reverse logistics</h3>
<p><strong>Reverse logistics</strong> is the flow of goods from the point of consumption back toward the origin — for returns, repairs, recycling or disposal. Drivers include e-commerce returns, product recalls, warranty repairs, and end-of-life recycling/circular-economy goals.</p>
<pre><code>Reverse logistics process:
Gatekeeping -&gt; Collection -&gt; Sorting/inspection -&gt; Disposition
(decide what's returnable)          (resell / refurbish / recycle / dispose)
</code></pre>
<h3>Last-mile delivery</h3>
<p>The <strong>last mile</strong> is the final leg of a shipment's journey — from a local DC/hub to the customer's door. It's usually the <strong>most expensive and most difficult segment</strong>, often cited as up to half of total shipping cost, because it involves many small, low-density stops instead of one big consolidated load.</p>
<h3>Last-mile challenges</h3>
<ul>
<li><strong>Urban congestion</strong> — traffic, parking, delivery-window restrictions in cities.</li>
<li><strong>Low delivery density</strong> — one driver, many scattered stops, each with its own cost.</li>
<li><strong>Failed deliveries</strong> — nobody home, wrong address — forces a costly re-attempt.</li>
</ul>
<h3>Solutions</h3>
<p><strong>Parcel lockers &amp; pickup points</strong> (consolidate many deliveries at one location), <strong>crowdsourced/gig delivery</strong> (flexible capacity for peak demand), and <strong>micro-fulfillment centers</strong> (small urban stock points that shrink the last-mile distance itself). Drone and robot delivery remain mostly pilot-stage solutions.</p>
<div class="callout"><span class="badge">Returns are logistics too</span> A generous return policy is a sales tool — but every return re-enters the reverse logistics pipeline (inspect, restock or write off), and that cost has to be planned for, not treated as an afterthought.</div>`,
    `<span class="eyebrow">SCM303 · Chương 6 · Bài 6.1</span>
<h2>Logistics ngược &amp; giao hàng chặng cuối</h2>
<h3>Logistics ngược</h3>
<p><strong>Logistics ngược</strong> là dòng chảy hàng hoá từ điểm tiêu dùng trở về nguồn gốc — để trả hàng, sửa chữa, tái chế hoặc tiêu huỷ. Nguyên nhân bao gồm trả hàng thương mại điện tử, thu hồi sản phẩm, sửa chữa bảo hành, và mục tiêu tái chế/kinh tế tuần hoàn khi hết đời sản phẩm.</p>
<pre><code>Quy trình logistics ngược:
Sàng lọc đầu vào -&gt; Thu gom -&gt; Phân loại/kiểm tra -&gt; Xử lý cuối
(quyết định hàng nào được nhận trả)     (bán lại / tái sửa / tái chế / loại bỏ)
</code></pre>
<h3>Giao hàng chặng cuối (last-mile)</h3>
<p><strong>Chặng cuối</strong> là đoạn cuối cùng trong hành trình của lô hàng — từ DC/hub địa phương đến cửa nhà khách hàng. Đây thường là <strong>đoạn đắt nhất và khó nhất</strong>, được ước tính chiếm tới một nửa tổng chi phí vận chuyển, vì nó gồm nhiều điểm dừng nhỏ, mật độ thấp thay vì một lô hàng lớn hợp nhất.</p>
<h3>Thử thách chặng cuối</h3>
<ul>
<li><strong>Tắc nghẽn đô thị</strong> — giao thông, đỗ xe, giới hạn khung giờ giao hàng trong thành phố.</li>
<li><strong>Mật độ giao hàng thấp</strong> — một tài xế, nhiều điểm dừng rải rác, mỗi điểm có chi phí riêng.</li>
<li><strong>Giao thất bại</strong> — không có người nhận, sai địa chỉ — buộc phải giao lại, tốn thêm chi phí.</li>
</ul>
<h3>Giải pháp</h3>
<p><strong>Tủ khoá &amp; điểm nhận hàng</strong> (hợp nhất nhiều đơn tại một địa điểm), <strong>giao hàng qua nền tảng cộng đồng/gig</strong> (năng lực linh hoạt cho nhu cầu cao điểm), và <strong>trung tâm micro-fulfillment</strong> (điểm dự trữ nhỏ trong đô thị giúp rút ngắn chính khoảng cách chặng cuối). Giao hàng bằng drone và robot phần lớn vẫn ở giai đoạn thử nghiệm.</p>
<div class="callout"><span class="badge">Trả hàng cũng là logistics</span> Chính sách đổi trả rộng rãi là công cụ bán hàng — nhưng mỗi lượt trả lại đi vào quy trình logistics ngược (kiểm tra, nhập lại kho hoặc xoá sổ), và chi phí đó phải được lập kế hoạch, không phải nghĩ đến sau cùng.</div>`,
  ]]);

const c6q = quiz('scm303-quiz-6', 'Quiz 6 — Logistics ngược & last-mile|||Quiz 6 — Logistics ngược & last-mile', [
  { id: 'q1', question: 'Logistics ngược (reverse logistics) chủ yếu xử lý dòng chảy nào?', options: ['Hàng từ nhà cung cấp đến nhà sản xuất', 'Hàng từ điểm tiêu dùng trở về nguồn gốc (trả hàng, sửa chữa, tái chế)', 'Chỉ dòng tiền thanh toán', 'Chỉ thông tin đơn hàng'], correctIndex: 1, explanation: 'Reverse logistics là dòng chảy ngược — hàng đi từ khách hàng trở lại doanh nghiệp để trả, sửa, tái chế hoặc loại bỏ.' },
  { id: 'q2', question: 'Vì sao giao hàng chặng cuối (last-mile) thường là đoạn ĐẮT NHẤT trong vận chuyển?', options: ['Vì quãng đường luôn dài nhất', 'Vì nhiều điểm dừng nhỏ, mật độ thấp, thay vì một lô hàng lớn hợp nhất', 'Vì chỉ dùng máy bay', 'Vì không cần tài xế'], correctIndex: 1, explanation: 'Last-mile gồm nhiều điểm dừng rải rác, mỗi điểm chi phí riêng, thiếu tính hợp nhất — khác với vận chuyển lô lớn giữa các trung tâm.' },
  { id: 'q3', question: 'Giải pháp nào giúp giảm khó khăn giao hàng chặng cuối bằng cách hợp nhất nhiều đơn tại một điểm?', options: ['Tủ khoá / điểm nhận hàng (parcel locker, pickup point)', 'Tăng số lần giao lại khi thất bại', 'Bỏ hoàn toàn chính sách đổi trả', 'Chỉ dùng đường biển'], correctIndex: 0, explanation: 'Tủ khoá và điểm nhận hàng tập trung nhiều đơn về một địa điểm, giảm số điểm dừng phân tán mà tài xế phải đến.' },
]);

const c7 = doc('scm303-7-1-technology', '7.1 — Logistics technology: WMS, TMS, IoT & tracking|||7.1 — Công nghệ logistics: WMS, TMS, IoT & theo dõi',
  'Hệ thống quản lý kho (WMS), quản lý vận tải (TMS), IoT/RFID/GPS theo dõi thời gian thực, tự động hoá kho (AS/RS, AGV/AMR), tích hợp dữ liệu.',
  [[
    `<span class="eyebrow">SCM303 · Chapter 7 · Lesson 7.1</span>
<h2>Logistics technology: WMS, TMS, IoT &amp; tracking</h2>
<h3>WMS — Warehouse Management System</h3>
<p>A <strong>WMS</strong> tracks exactly where every SKU sits in the warehouse, directs putaway and picking, optimizes slotting, and manages labor — turning a warehouse from "where did we put that?" into a system with real-time inventory accuracy.</p>
<h3>TMS — Transportation Management System</h3>
<p>A <strong>TMS</strong> plans routes and loads, selects the best carrier/mode by cost and service, consolidates shipments, audits freight bills, and tracks shipments in transit — the transportation-side counterpart to a WMS.</p>
<h3>IoT, RFID &amp; real-time tracking</h3>
<ul>
<li><strong>GPS/telematics</strong> — live vehicle location for transportation visibility.</li>
<li><strong>RFID &amp; barcode scanning</strong> — fast, accurate identification of items/pallets without manual data entry.</li>
<li><strong>IoT sensors</strong> — temperature/humidity monitoring for cold-chain (pharma, food) shipments.</li>
</ul>
<h3>Warehouse automation</h3>
<p><strong>AS/RS</strong> (automated storage &amp; retrieval systems) move pallets/totes without human travel; <strong>AGVs/AMRs</strong> (automated/autonomous guided vehicles) move goods around the floor; robotic sorting systems speed up parcel sortation for e-commerce volumes.</p>
<pre><code>Data flow: WMS (inventory) &lt;-&gt; ERP (orders/finance) &lt;-&gt; TMS (transport)
All three feeding one shared, real-time view of "where is everything, right now".
</code></pre>
<div class="callout"><span class="badge">Visibility is the point</span> The common thread across WMS, TMS and IoT tracking isn't automation for its own sake — it's turning "we think it's somewhere in transit" into "it's on truck #42, 3km from the customer, ETA 14:20".</div>`,
    `<span class="eyebrow">SCM303 · Chương 7 · Bài 7.1</span>
<h2>Công nghệ logistics: WMS, TMS, IoT &amp; theo dõi</h2>
<h3>WMS — Hệ thống quản lý kho</h3>
<p>Một <strong>WMS</strong> theo dõi chính xác từng SKU đang ở đâu trong kho, chỉ đạo việc cất hàng và lấy hàng, tối ưu slotting, và quản lý nhân công — biến một kho từ "để đâu rồi nhỉ?" thành một hệ thống có độ chính xác tồn kho theo thời gian thực.</p>
<h3>TMS — Hệ thống quản lý vận tải</h3>
<p>Một <strong>TMS</strong> lập kế hoạch tuyến đường và tải trọng, chọn hãng vận tải/phương thức tốt nhất theo chi phí và mức dịch vụ, hợp nhất các lô hàng, kiểm toán cước vận tải, và theo dõi hàng đang vận chuyển — đối tác của WMS ở phía vận tải.</p>
<h3>IoT, RFID &amp; theo dõi thời gian thực</h3>
<ul>
<li><strong>GPS/telematics</strong> — vị trí xe trực tiếp, phục vụ khả năng nhìn thấy toàn cảnh vận tải.</li>
<li><strong>RFID &amp; quét mã vạch</strong> — nhận diện hàng hoá/pallet nhanh, chính xác mà không cần nhập liệu thủ công.</li>
<li><strong>Cảm biến IoT</strong> — theo dõi nhiệt độ/độ ẩm cho lô hàng cần chuỗi lạnh (dược, thực phẩm).</li>
</ul>
<h3>Tự động hoá kho</h3>
<p><strong>AS/RS</strong> (hệ thống lưu trữ &amp; lấy hàng tự động) di chuyển pallet/khay hàng không cần người đi lại; <strong>AGV/AMR</strong> (xe dẫn hướng tự động) di chuyển hàng trong kho; hệ thống phân loại robot tăng tốc phân loại bưu kiện cho khối lượng thương mại điện tử.</p>
<pre><code>Dòng dữ liệu: WMS (tồn kho) &lt;-&gt; ERP (đơn hàng/tài chính) &lt;-&gt; TMS (vận tải)
Cả ba cùng đổ vào một góc nhìn chung, thời gian thực: "mọi thứ đang ở đâu, ngay lúc này".
</code></pre>
<div class="callout"><span class="badge">Mấu chốt là khả năng nhìn thấy</span> Điểm chung giữa WMS, TMS và theo dõi IoT không phải tự động hoá vì tự động hoá — mà là biến "chắc đang trên đường đâu đó" thành "đang trên xe số 42, cách khách 3km, dự kiến đến 14:20".</div>`,
  ]]);

const c7q = quiz('scm303-quiz-7', 'Quiz 7 — Công nghệ logistics|||Quiz 7 — Công nghệ logistics', [
  { id: 'q1', question: 'WMS (Warehouse Management System) chủ yếu dùng để làm gì?', options: ['Chọn hãng vận tải tốt nhất', 'Theo dõi vị trí SKU trong kho, chỉ đạo cất/lấy hàng, tối ưu slotting', 'Tính thuế xuất nhập khẩu', 'Quản lý quan hệ khách hàng (CRM)'], correctIndex: 1, explanation: 'WMS quản lý mọi hoạt động trong kho: vị trí hàng, cất/lấy hàng, slotting, độ chính xác tồn kho theo thời gian thực.' },
  { id: 'q2', question: 'TMS (Transportation Management System) khác WMS ở điểm nào?', options: ['TMS quản lý kho, WMS quản lý vận tải', 'TMS lập kế hoạch tuyến/tải, chọn hãng vận tải & theo dõi vận chuyển; WMS quản lý hoạt động trong kho', 'Hai hệ thống hoàn toàn giống nhau', 'TMS chỉ dùng cho hàng không'], correctIndex: 1, explanation: 'WMS lo bên trong kho; TMS lo bên vận tải — lập tuyến, chọn hãng, kiểm toán cước, theo dõi hàng đang đi.' },
  { id: 'q3', question: 'RFID trong logistics giúp gì?', options: ['Tính EOQ tự động', 'Nhận diện hàng hoá/pallet nhanh & chính xác, không cần nhập liệu tay', 'Thay thế hoàn toàn nhân viên kho', 'Chỉ dùng để theo dõi nhiệt độ'], correctIndex: 1, explanation: 'RFID (cùng quét mã vạch) cho phép nhận diện và theo dõi hàng hoá nhanh, chính xác, giảm lỗi nhập liệu thủ công.' },
]);

const c8 = doc('scm303-8-1-green-metrics-ecommerce', '8.1 — Green logistics, performance metrics & e-commerce trends|||8.1 — Logistics xanh, đo lường hiệu suất & xu hướng thương mại điện tử',
  'Logistics xanh/bền vững; KPI logistics (OTD, fill rate, perfect order, inventory turnover); xu hướng thương mại điện tử (omnichannel, micro-fulfillment, mùa cao điểm).',
  [[
    `<span class="eyebrow">SCM303 · Chapter 8 · Lesson 8.1</span>
<h2>Green logistics, performance metrics &amp; e-commerce trends</h2>
<h3>Green / sustainable logistics</h3>
<ul>
<li><strong>Mode shift</strong> — moving volume from air/road to rail/sea where transit time allows, cutting emissions per unit shipped.</li>
<li><strong>Route &amp; load optimization</strong> — fewer, fuller trips instead of many half-empty ones.</li>
<li><strong>Alternative-fuel &amp; electric vehicles</strong> — for last-mile and yard fleets especially.</li>
<li><strong>Packaging reduction &amp; reverse logistics for the circular economy</strong> — reuse, refurbish, recycle instead of dispose.</li>
</ul>
<h3>Key performance metrics (KPIs)</h3>
<pre><code>On-Time Delivery (OTD) %   = (orders delivered on time / total orders) × 100
Order Fill Rate %          = (orders shipped complete / total orders) × 100
Perfect Order Rate %       = % of orders that are on-time AND complete
                              AND damage-free AND with accurate documentation
Inventory Turnover         = Cost of goods sold / Average inventory value
</code></pre>
<p>The <strong>perfect order rate</strong> is the strictest metric — an order only counts if it clears every requirement; it's a good single number to track overall logistics health.</p>
<h3>E-commerce trends reshaping logistics</h3>
<ul>
<li><strong>Omnichannel fulfillment</strong> — customers order online, pick up in store, or return in store; inventory has to be visible and shippable from anywhere.</li>
<li><strong>Same-day/next-day delivery expectations</strong> — pushing companies toward micro-fulfillment and dark stores close to demand.</li>
<li><strong>Returns at scale</strong> — e-commerce return rates are far higher than in-store, making reverse logistics a first-class capability, not an afterthought.</li>
<li><strong>Peak-season capacity planning</strong> — events like 11.11 or Black Friday require pre-booked transport and temporary labor/warehouse capacity well in advance.</li>
</ul>
<div class="callout"><span class="badge">Green and efficient aren't opposites</span> Fuller trucks, optimized routes and mode-shifting usually cut both cost AND emissions at the same time — sustainability in logistics is often just good operations, done deliberately.</div>`,
    `<span class="eyebrow">SCM303 · Chương 8 · Bài 8.1</span>
<h2>Logistics xanh, đo lường hiệu suất &amp; xu hướng thương mại điện tử</h2>
<h3>Logistics xanh / bền vững</h3>
<ul>
<li><strong>Chuyển đổi phương thức</strong> — dời khối lượng từ hàng không/đường bộ sang đường sắt/đường biển khi thời gian vận chuyển cho phép, giảm khí thải trên mỗi đơn vị hàng.</li>
<li><strong>Tối ưu tuyến &amp; tải trọng</strong> — ít chuyến hơn nhưng đầy hơn, thay vì nhiều chuyến nửa vơi nửa đầy.</li>
<li><strong>Xe nhiên liệu thay thế &amp; xe điện</strong> — đặc biệt cho chặng cuối và đội xe trong bãi.</li>
<li><strong>Giảm bao bì &amp; logistics ngược cho kinh tế tuần hoàn</strong> — tái sử dụng, tái sửa, tái chế thay vì loại bỏ.</li>
</ul>
<h3>Các chỉ số hiệu suất chính (KPI)</h3>
<pre><code>Tỉ lệ giao đúng hạn (OTD) % = (đơn giao đúng hạn / tổng đơn) × 100
Tỉ lệ hoàn thành đơn %      = (đơn giao đủ hàng / tổng đơn) × 100
Tỉ lệ đơn hoàn hảo %        = % đơn đúng hạn VÀ đủ hàng
                               VÀ không hư hỏng VÀ chứng từ chính xác
Vòng quay tồn kho           = Giá vốn hàng bán / Giá trị tồn kho trung bình
</code></pre>
<p><strong>Tỉ lệ đơn hoàn hảo</strong> là chỉ số khắt khe nhất — một đơn chỉ tính là hoàn hảo nếu đạt MỌI yêu cầu; đây là một con số đơn lẻ tốt để theo dõi sức khoẻ tổng thể của logistics.</p>
<h3>Xu hướng thương mại điện tử định hình lại logistics</h3>
<ul>
<li><strong>Thực hiện đa kênh (omnichannel)</strong> — khách đặt online, nhận tại cửa hàng, hoặc trả tại cửa hàng; tồn kho phải nhìn thấy được và giao được từ bất cứ đâu.</li>
<li><strong>Kỳ vọng giao trong ngày/ngày kế tiếp</strong> — thúc doanh nghiệp hướng tới micro-fulfillment và dark store gần khu vực có nhu cầu.</li>
<li><strong>Trả hàng ở quy mô lớn</strong> — tỉ lệ trả hàng thương mại điện tử cao hơn nhiều so với mua tại cửa hàng, biến logistics ngược thành năng lực hàng đầu, không phải việc nghĩ đến sau.</li>
<li><strong>Lập kế hoạch năng lực mùa cao điểm</strong> — các sự kiện như 11.11 hay Black Friday cần đặt trước năng lực vận tải và nhân công/kho tạm thời từ rất sớm.</li>
</ul>
<div class="callout"><span class="badge">Xanh và hiệu quả không đối lập</span> Xe đầy hơn, tuyến tối ưu và chuyển đổi phương thức thường giảm CẢ chi phí VÀ khí thải cùng lúc — bền vững trong logistics thường chỉ là vận hành tốt, làm một cách có chủ đích.</div>`,
  ]]);

const c8q = quiz('scm303-quiz-8', 'Quiz 8 — Logistics xanh, KPI & thương mại điện tử|||Quiz 8 — Logistics xanh, KPI & thương mại điện tử', [
  { id: 'q1', question: '"Tỉ lệ đơn hoàn hảo" (perfect order rate) yêu cầu điều gì?', options: ['Chỉ cần giao đúng hạn', 'Đơn phải đúng hạn VÀ đủ hàng VÀ không hư hỏng VÀ chứng từ chính xác', 'Chỉ cần đủ hàng, không cần đúng hạn', 'Chỉ áp dụng cho đơn quốc tế'], correctIndex: 1, explanation: 'Perfect order rate là chỉ số khắt khe nhất, đòi hỏi đơn đạt đồng thời tất cả các tiêu chí: đúng hạn, đủ hàng, không hư hỏng, chứng từ đúng.' },
  { id: 'q2', question: 'Chuyển đổi phương thức vận tải (mode shift) từ đường bộ/hàng không sang đường sắt/đường biển thường mang lại lợi ích gì?', options: ['Luôn làm chậm giao hàng mà không lợi gì', 'Giảm khí thải trên mỗi đơn vị hàng khi thời gian cho phép', 'Tăng chi phí vận tải mà không đổi gì khác', 'Chỉ áp dụng được cho hàng không'], correctIndex: 1, explanation: 'Mode shift sang đường sắt/biển (khi không gấp về thời gian) giảm khí thải và thường giảm chi phí trên đơn vị hàng.' },
  { id: 'q3', question: 'Vì sao lập kế hoạch năng lực mùa cao điểm (vd 11.11, Black Friday) quan trọng trong thương mại điện tử?', options: ['Vì nhu cầu không đổi trong mùa cao điểm', 'Vì cần đặt trước năng lực vận tải & nhân công/kho tạm thời từ sớm để đáp ứng nhu cầu tăng vọt', 'Vì mùa cao điểm không ảnh hưởng đến logistics', 'Vì chỉ cần tăng giá bán'], correctIndex: 1, explanation: 'Mùa cao điểm gây nhu cầu tăng vọt đột ngột; không chuẩn bị trước năng lực vận tải/kho/nhân công sẽ dẫn đến chậm giao, hết hàng, chi phí gấp gáp.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'SCM303',
    slug: 'scm303-logistics-and-supply-chain-management',
    title: 'Logistics and Supply Chain Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SCM303.webp',
    shortDescription: 'How goods flow through a supply chain — transportation, warehousing, inventory & order processing, distribution network design, reverse logistics & last-mile, WMS/TMS tech, green logistics & e-commerce trends.|||Hàng hoá chảy qua chuỗi cung ứng thế nào — vận tải, kho bãi, tồn kho & xử lý đơn hàng, thiết kế mạng lưới phân phối, logistics ngược & last-mile, công nghệ WMS/TMS, logistics xanh & xu hướng thương mại điện tử.',
    description: 'Môn <strong>SCM303 — Logistics and Supply Chain Management</strong> (khối Quản trị Kinh doanh, kỳ 3) đi sâu vào <strong>mặt vận hành của logistics</strong> — khác với tổng quan chuỗi cung ứng (SCM201) và thu mua toàn cầu (SCM302). Từ <strong>tổng quan &amp; vai trò logistics</strong> → <strong>vận tải</strong> (đường bộ/biển/hàng không/đa phương thức) → <strong>kho bãi &amp; bố trí</strong> → <strong>tồn kho &amp; xử lý đơn hàng</strong> (EOQ, ROP) → <strong>thiết kế mạng lưới phân phối &amp; trung tâm phân phối</strong> → <strong>logistics ngược &amp; last-mile</strong> → <strong>công nghệ logistics</strong> (WMS/TMS/IoT) → <strong>logistics xanh, KPI &amp; xu hướng thương mại điện tử</strong>. Tham khảo Harrison &amp; van Hoek, Bowersox/Closs/Cooper; song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Vai trò logistics trong chuỗi cung ứng, 7 chữ R; 5 phương thức vận tải & đánh đổi chi phí-tốc độ-linh hoạt, vận tải đa phương thức; vai trò & bố trí kho bãi, slotting ABC, cross-docking; chi phí tồn kho, EOQ, điểm đặt hàng lại, tồn kho an toàn, chu trình xử lý đơn hàng; thiết kế mạng lưới phân phối, phương pháp trọng tâm; logistics ngược & giao hàng chặng cuối; WMS/TMS/IoT/RFID; logistics xanh, KPI (OTD, fill rate, perfect order, vòng quay tồn kho), xu hướng thương mại điện tử.',
    requirements: 'Kiến thức nền về quản trị kinh doanh/chuỗi cung ứng (nên đã học SCM201). Không cần kiến thức kỹ thuật chuyên sâu.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình tham khảo, tài liệu chính thức, YouTube, công cụ mô phỏng, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Logistics là gì, khác SCM201/SCM302, 7 chữ R.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan logistics|||Chapter 1 — Logistics overview', description: 'Hoạt động logistics chính, giá trị tạo ra, 7 chữ R.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quản trị vận tải|||Chapter 2 — Transportation management', description: '5 phương thức vận tải, đánh đổi, đa phương thức.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Kho bãi & lưu trữ|||Chapter 3 — Warehousing & storage', description: 'Vai trò kho, loại kho, bố trí, slotting ABC.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tồn kho & xử lý đơn hàng|||Chapter 4 — Inventory & order processing', description: 'Chi phí tồn kho, EOQ, ROP, chu trình đơn hàng.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thiết kế mạng lưới phân phối|||Chapter 5 — Distribution network design', description: 'Đánh đổi chi phí, center of gravity, chiến lược phân phối.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Logistics ngược & last-mile|||Chapter 6 — Reverse logistics & last-mile', description: 'Trả hàng, sửa chữa, tái chế; thử thách & giải pháp last-mile.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Công nghệ logistics|||Chapter 7 — Logistics technology', description: 'WMS, TMS, IoT/RFID, tự động hoá kho.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Logistics xanh, KPI & thương mại điện tử|||Chapter 8 — Green logistics, KPIs & e-commerce', description: 'Bền vững, KPI logistics, xu hướng thương mại điện tử.', lessons: [c8, c8q] },
  ],
};
