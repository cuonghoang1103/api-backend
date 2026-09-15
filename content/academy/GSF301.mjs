/**
 * GSF301 — Sea Transport and Forwarding. Giáo trình FLM (khối Quản trị Kinh
 * doanh, kỳ 4): vận tải biển & giao nhận — vai trò trong thương mại toàn
 * cầu, tàu/cảng/container hoá, phương thức thuê tàu, vận đơn & chứng từ,
 * FCL/LCL, giá cước & phụ phí, trách nhiệm người chuyên chở & công ước quốc
 * tế, đại lý hàng hải & đa phương thức. Song ngữ + ví dụ + bài tập.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('gsf301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách tham khảo, công ước quốc tế, tài liệu chính thức miễn phí, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">GSF301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Sea Transport and Forwarding — ships &amp; ports, chartering, bills of lading, FCL/LCL, freight cost, carrier liability, shipping agency &amp; multimodal transport — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for GSF301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Maritime Logistics: A Guide to Contemporary Shipping and Port Management</em> — Song &amp; Panayides (Kogan Page)</li>
<li><em>Shipping and Logistics Management</em> — Y.H. Venus Lun, K.H. Lai, T.C.E. Cheng (Springer)</li>
</ul>
<h3>⚖️ Legal sources</h3>
<ul>
<li>Bộ luật Hàng hải Việt Nam 2015 (Vietnam Maritime Code) — <a href="https://vanban.chinhphu.vn" target="_blank" rel="noopener">Cổng thông tin Chính phủ</a></li>
<li>Hague-Visby Rules (1968), Hamburg Rules (1978), Rotterdam Rules (2008) — <a href="https://www.comitemaritime.org" target="_blank" rel="noopener">CMI — Comité Maritime International</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://unctad.org/topic/transport-and-trade-logistics" target="_blank" rel="noopener">UNCTAD — Review of Maritime Transport</a> (yearly free report)</li>
<li><a href="https://www.imo.org" target="_blank" rel="noopener">IMO — International Maritime Organization</a></li>
<li><a href="https://www.vpa.org.vn" target="_blank" rel="noopener">Vietnam Ports Association (VPA)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@TradeFinanceGlobal" target="_blank" rel="noopener">Trade Finance Global</a> — trade documents &amp; Incoterms explained</li>
<li><a href="https://www.youtube.com/@freightwaves" target="_blank" rel="noopener">FreightWaves</a> — ocean freight market news &amp; analysis</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.marinetraffic.com" target="_blank" rel="noopener">MarineTraffic</a> — live vessel tracking (see liner routes, ship types in action)</li>
<li><a href="https://www.searates.com" target="_blank" rel="noopener">SeaRates</a> — freight rate lookup &amp; distance/transit-time calculator</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — role of sea transport, ship &amp; port basics, liner vs tramp vs charter, B/L functions and types.</li>
<li><strong>Practice</strong> — read a sample bill of lading end to end; compute a freight quote from base rate + surcharges.</li>
<li><strong>Go deeper</strong> — carrier liability regimes (Hague-Visby/Hamburg/Rotterdam), multimodal transport documents.</li>
<li><strong>Job-ready</strong> — trace a real FCL and LCL shipment step by step; know Vietnam's main seaport clusters.</li>
</ol></div>`,
    `<span class="eyebrow">GSF301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Vận tải biển &amp; giao nhận — tàu &amp; cảng, thuê tàu, vận đơn, FCL/LCL, chi phí cước, trách nhiệm người chuyên chở, đại lý hàng hải &amp; đa phương thức — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của GSF301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Maritime Logistics: A Guide to Contemporary Shipping and Port Management</em> — Song &amp; Panayides (Kogan Page)</li>
<li><em>Shipping and Logistics Management</em> — Y.H. Venus Lun, K.H. Lai, T.C.E. Cheng (Springer)</li>
</ul>
<h3>⚖️ Nguồn luật</h3>
<ul>
<li>Bộ luật Hàng hải Việt Nam 2015 — <a href="https://vanban.chinhphu.vn" target="_blank" rel="noopener">Cổng thông tin Chính phủ</a></li>
<li>Quy tắc Hague-Visby (1968), Hamburg (1978), Rotterdam (2008) — <a href="https://www.comitemaritime.org" target="_blank" rel="noopener">CMI — Comité Maritime International</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://unctad.org/topic/transport-and-trade-logistics" target="_blank" rel="noopener">UNCTAD — Review of Maritime Transport</a> (báo cáo thường niên miễn phí)</li>
<li><a href="https://www.imo.org" target="_blank" rel="noopener">IMO — Tổ chức Hàng hải Quốc tế</a></li>
<li><a href="https://www.vpa.org.vn" target="_blank" rel="noopener">Hiệp hội Cảng biển Việt Nam (VPA)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@TradeFinanceGlobal" target="_blank" rel="noopener">Trade Finance Global</a> — giải thích chứng từ thương mại &amp; Incoterms</li>
<li><a href="https://www.youtube.com/@freightwaves" target="_blank" rel="noopener">FreightWaves</a> — tin tức &amp; phân tích thị trường cước biển</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.marinetraffic.com" target="_blank" rel="noopener">MarineTraffic</a> — theo dõi tàu trực tiếp (xem tuyến liner, loại tàu ngoài đời)</li>
<li><a href="https://www.searates.com" target="_blank" rel="noopener">SeaRates</a> — tra cước vận tải &amp; tính khoảng cách/thời gian đi biển</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — vai trò vận tải biển, tàu &amp; cảng cơ bản, liner vs tramp vs charter, chức năng &amp; loại B/L.</li>
<li><strong>Luyện tập</strong> — đọc một vận đơn mẫu từ đầu đến cuối; tính báo giá cước từ giá gốc + phụ phí.</li>
<li><strong>Đào sâu</strong> — các công ước trách nhiệm người chuyên chở (Hague-Visby/Hamburg/Rotterdam), chứng từ đa phương thức.</li>
<li><strong>Sẵn sàng đi làm</strong> — lần theo một lô FCL và một lô LCL thật từng bước; nắm các cụm cảng biển chính Việt Nam.</li>
</ol></div>`,
  ]]);

const intro = doc('gsf301-0-1-overview', 'Course overview: Sea Transport and Forwarding|||Tổng quan: Vận tải biển và Giao nhận',
  'Vận tải biển chở phần lớn thương mại toàn cầu; lộ trình môn: vai trò & thị trường → tàu/cảng/container hoá → thuê tàu → vận đơn & chứng từ → FCL/LCL → giá cước → trách nhiệm & công ước → đại lý & đa phương thức.',
  [[
    `<span class="eyebrow">GSF301 · Lesson 0.1 · Overview</span>
<h2>Sea Transport &amp; Forwarding</h2>
<p class="lead">This course explains <strong>how goods move by sea</strong> and how the freight forwarding industry organizes that movement — from booking a container to the documents that make an ocean shipment legally sound. It sits in the Business Administration (BBA) curriculum because international trade cannot happen without ocean transport underneath it.</p>
<h3>Why sea transport matters</h3>
<p>Ocean shipping carries the vast majority of world trade by volume — it is by far the cheapest way to move large quantities over long distances, which is why containers, bulk carriers and tankers underpin global supply chains for everything from electronics to grain to crude oil.</p>
<h3>Roadmap</h3>
<ul>
<li><strong>Ch.1</strong> — sea transport's role in global trade</li>
<li><strong>Ch.2</strong> — ships, ports &amp; containerization</li>
<li><strong>Ch.3</strong> — chartering methods (liner, tramp, charter)</li>
<li><strong>Ch.4</strong> — bills of lading &amp; shipping documents</li>
<li><strong>Ch.5</strong> — forwarding process &amp; FCL/LCL</li>
<li><strong>Ch.6</strong> — freight rates, surcharges &amp; cost calculation</li>
<li><strong>Ch.7</strong> — carrier liability &amp; international conventions</li>
<li><strong>Ch.8</strong> — shipping agency, multimodal transport &amp; Vietnam's seaports</li>
</ul>
<p>Bilingual, with worked examples (documents, cost calculations) and a quiz per chapter.</p>`,
    `<span class="eyebrow">GSF301 · Bài 0.1 · Tổng quan</span>
<h2>Vận tải biển &amp; Giao nhận</h2>
<p class="lead">Môn này giải thích <strong>hàng hoá di chuyển bằng đường biển thế nào</strong> và ngành giao nhận (forwarding) tổ chức việc di chuyển đó ra sao — từ đặt chỗ container tới các chứng từ khiến một lô hàng đường biển hợp pháp về mặt pháp lý. Môn nằm trong khung Quản trị Kinh doanh (BBA) vì thương mại quốc tế không thể diễn ra nếu thiếu vận tải biển bên dưới.</p>
<h3>Vì sao vận tải biển quan trọng</h3>
<p>Vận tải biển chở phần lớn thương mại toàn cầu tính theo khối lượng — đây là cách rẻ nhất để chuyển lượng hàng lớn qua khoảng cách dài, nên container, tàu hàng rời và tàu chở dầu là nền tảng của chuỗi cung ứng toàn cầu, từ điện tử tới lúa gạo tới dầu thô.</p>
<h3>Lộ trình</h3>
<ul>
<li><strong>Ch.1</strong> — vai trò vận tải biển trong thương mại toàn cầu</li>
<li><strong>Ch.2</strong> — tàu biển, cảng &amp; container hoá</li>
<li><strong>Ch.3</strong> — phương thức thuê tàu (liner, tramp, charter)</li>
<li><strong>Ch.4</strong> — vận đơn &amp; chứng từ vận tải</li>
<li><strong>Ch.5</strong> — quy trình giao nhận &amp; FCL/LCL</li>
<li><strong>Ch.6</strong> — giá cước, phụ phí &amp; tính toán chi phí</li>
<li><strong>Ch.7</strong> — trách nhiệm người chuyên chở &amp; công ước quốc tế</li>
<li><strong>Ch.8</strong> — đại lý hàng hải, đa phương thức &amp; cảng biển Việt Nam</li>
</ul>
<p>Song ngữ, có ví dụ mẫu (chứng từ, tính chi phí) và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('gsf301-1-1-overview-role', '1.1 — Sea transport & its role in global trade|||1.1 — Vận tải biển & vai trò trong thương mại toàn cầu',
  'Ưu thế chi phí của vận tải biển; các thị trường vận tải biển (hàng rời, hàng container, hàng lỏng); các bên tham gia (shipper, carrier, consignee, forwarder); Incoterms quyết định ai lo chặng biển.',
  [[
    `<span class="eyebrow">GSF301 · Chapter 1 · Lesson 1.1</span>
<h2>Sea transport &amp; its role in global trade</h2>
<h3>Why sea, not air or road</h3>
<p>Sea transport dominates world trade because of one simple fact: <strong>economies of scale</strong>. A single large containership or bulk carrier can move tens of thousands of tonnes in one voyage at a fraction of the per-tonne cost of air or road freight. It is slower — but for most goods, cost matters far more than speed.</p>
<h3>The main shipping markets</h3>
<ul>
<li><strong>Dry bulk</strong> — unpackaged commodities (grain, coal, iron ore, cement) carried in bulk carriers.</li>
<li><strong>Liquid bulk / tanker</strong> — crude oil, refined products, chemicals, LNG/LPG.</li>
<li><strong>Container liner</strong> — manufactured goods, consumer products, moved in standardized boxes on fixed schedules.</li>
<li><strong>General / break-bulk</strong> — project cargo, machinery, steel — too big or awkward for a container.</li>
</ul>
<h3>The parties involved</h3>
<ul>
<li><strong>Shipper (exporter)</strong> — owns/sells the goods and arranges (or pays for) their carriage.</li>
<li><strong>Carrier</strong> — the shipping line that physically transports the cargo.</li>
<li><strong>Consignee (importer)</strong> — receives the goods at destination.</li>
<li><strong>Freight forwarder</strong> — arranges transport on the shipper's behalf, often without owning any ships.</li>
</ul>
<p><strong>Incoterms</strong> (FOB, CIF, EXW, DAP, etc.) decide <em>who</em> books and pays for the sea leg, and <em>where</em> risk transfers from seller to buyer — this is why forwarders always ask "what Incoterm is this shipment under?" before booking.</p>
<div class="callout"><span class="badge">Big picture</span> No container ship, no globalization: the drop in sea-freight cost per unit over the past decades is one of the main reasons manufacturing could spread across countries while still reaching one global market.</div>`,
    `<span class="eyebrow">GSF301 · Chương 1 · Bài 1.1</span>
<h2>Vận tải biển &amp; vai trò trong thương mại toàn cầu</h2>
<h3>Vì sao là biển, không phải hàng không hay đường bộ</h3>
<p>Vận tải biển chiếm phần lớn thương mại thế giới nhờ một lý do đơn giản: <strong>lợi ích quy mô</strong>. Một tàu container hoặc tàu hàng rời lớn có thể chở hàng chục nghìn tấn trong một chuyến, với chi phí trên mỗi tấn chỉ bằng một phần nhỏ so với hàng không hoặc đường bộ. Nó chậm hơn — nhưng với hầu hết hàng hoá, chi phí quan trọng hơn tốc độ rất nhiều.</p>
<h3>Các thị trường vận tải biển chính</h3>
<ul>
<li><strong>Hàng rời khô (dry bulk)</strong> — hàng không đóng gói (ngũ cốc, than, quặng sắt, xi măng) chở bằng tàu hàng rời.</li>
<li><strong>Hàng lỏng / tàu chở dầu</strong> — dầu thô, sản phẩm lọc dầu, hoá chất, LNG/LPG.</li>
<li><strong>Container liner</strong> — hàng chế biến, hàng tiêu dùng, chở trong container tiêu chuẩn theo lịch cố định.</li>
<li><strong>Hàng tổng hợp / hàng rời chuyên biệt (break-bulk)</strong> — hàng dự án, máy móc, sắt thép — quá lớn hoặc quá cồng kềnh để đóng container.</li>
</ul>
<h3>Các bên tham gia</h3>
<ul>
<li><strong>Người gửi hàng (shipper/xuất khẩu)</strong> — sở hữu/bán hàng và tổ chức (hoặc trả tiền) vận chuyển.</li>
<li><strong>Người chuyên chở (carrier)</strong> — hãng tàu thực hiện vận chuyển hàng.</li>
<li><strong>Người nhận hàng (consignee/nhập khẩu)</strong> — nhận hàng tại điểm đến.</li>
<li><strong>Người giao nhận (freight forwarder)</strong> — tổ chức vận chuyển cho người gửi hàng, thường không sở hữu tàu.</li>
</ul>
<p><strong>Incoterms</strong> (FOB, CIF, EXW, DAP, v.v.) quyết định <em>ai</em> đặt chỗ và trả tiền chặng biển, và <em>ở đâu</em> rủi ro chuyển từ người bán sang người mua — đây là lý do người giao nhận luôn hỏi "lô này theo Incoterm nào?" trước khi đặt chỗ.</p>
<div class="callout"><span class="badge">Bức tranh lớn</span> Không có tàu container, không có toàn cầu hoá: chi phí cước biển trên mỗi đơn vị giảm mạnh trong nhiều thập kỷ qua là một trong những lý do khiến sản xuất trải rộng khắp các nước mà vẫn vươn tới một thị trường toàn cầu.</div>`,
  ]]);

const c1q = quiz('gsf301-quiz-1', 'Quiz 1 — Overview & role|||Quiz 1 — Tổng quan & vai trò', [
  { id: 'q1', question: 'Vì sao vận tải biển thống trị thương mại toàn cầu về khối lượng?', options: ['Vì nhanh nhất', 'Vì lợi ích quy mô cho chi phí thấp nhất trên mỗi tấn', 'Vì không cần chứng từ', 'Vì chỉ dùng cho hàng dễ vỡ'], correctIndex: 1, explanation: 'Tàu lớn chở lượng hàng khổng lồ nên chi phí/tấn thấp hơn hẳn hàng không hay đường bộ.' },
  { id: 'q2', question: 'Ai là bên tổ chức vận chuyển cho người gửi hàng, thường không sở hữu tàu?', options: ['Consignee', 'Carrier', 'Freight forwarder', 'Cảng vụ'], correctIndex: 2, explanation: 'Người giao nhận (forwarder) đứng ra tổ chức vận chuyển, không nhất thiết có tàu riêng.' },
  { id: 'q3', question: 'Incoterms trong vận tải biển dùng để làm gì?', options: ['Định loại tàu', 'Xác định ai đặt/trả cước và điểm chuyển rủi ro', 'Thay cho vận đơn', 'Quy định tốc độ tàu'], correctIndex: 1, explanation: 'Incoterms (FOB, CIF...) quyết định bên nào lo chặng biển và tại đâu rủi ro chuyển giao.' },
]);

const c2 = doc('gsf301-2-1-ships-ports-containerization', '2.1 — Ships, ports & containerization|||2.1 — Tàu biển, cảng & container hoá',
  'Các loại tàu chính (container, bulk carrier, tanker, general cargo, ro-ro); kết cấu cảng (cầu bến, cần trục, bãi container, CFS); cuộc cách mạng container hoá & TEU.',
  [[
    `<span class="eyebrow">GSF301 · Chapter 2 · Lesson 2.1</span>
<h2>Ships, ports &amp; containerization</h2>
<h3>Main ship types</h3>
<ul>
<li><strong>Container ship</strong> — carries standardized boxes; capacity measured in <strong>TEU</strong> (Twenty-foot Equivalent Unit).</li>
<li><strong>Bulk carrier</strong> — open holds for unpackaged dry bulk (grain, coal, ore).</li>
<li><strong>Tanker</strong> — tanks for liquid cargo (crude oil, chemicals, LNG).</li>
<li><strong>General cargo ship</strong> — mixed, non-containerized cargo, often with onboard cranes.</li>
<li><strong>Ro-Ro (Roll-on/Roll-off)</strong> — vehicles &amp; wheeled cargo drive on/off via ramps.</li>
</ul>
<h3>Port infrastructure</h3>
<ul>
<li><strong>Berth / quay</strong> — where the ship moors to load/discharge.</li>
<li><strong>Quay crane (STS crane)</strong> — lifts containers between ship and shore.</li>
<li><strong>Container yard (CY)</strong> — storage area for full/empty containers waiting for pickup or loading.</li>
<li><strong>Container Freight Station (CFS)</strong> — warehouse where cargo is stuffed into / stripped from containers (used for LCL).</li>
</ul>
<h3>The containerization revolution</h3>
<p>Before the 1950s, cargo was loaded piece by piece ("break-bulk") — slow, labor-heavy, and prone to damage/theft. The standardized <strong>ISO container</strong> (mainly 20ft and 40ft steel boxes) let cargo move seamlessly between ship, rail and truck without ever being unpacked — a single, stackable, craneable unit.</p>
<pre><code>Before containers:            After containers:
 Break-bulk, item by item  ->  Standard 20ft / 40ft box
 Days per ship in port      ->  Hours per ship in port
 High labor + damage risk   ->  Low labor, sealed & tracked
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Containerization did not just make shipping cheaper — it made it <em>predictable</em>, which is what let global supply chains plan production schedules around ocean transit times.</div>`,
    `<span class="eyebrow">GSF301 · Chương 2 · Bài 2.1</span>
<h2>Tàu biển, cảng &amp; container hoá</h2>
<h3>Các loại tàu chính</h3>
<ul>
<li><strong>Tàu container</strong> — chở container tiêu chuẩn; sức chở đo bằng <strong>TEU</strong> (đơn vị tương đương container 20 feet).</li>
<li><strong>Tàu hàng rời (bulk carrier)</strong> — hầm hở chở hàng khô không đóng gói (ngũ cốc, than, quặng).</li>
<li><strong>Tàu chở dầu/hoá chất (tanker)</strong> — bồn chứa hàng lỏng (dầu thô, hoá chất, LNG).</li>
<li><strong>Tàu hàng tổng hợp (general cargo)</strong> — hàng hỗn hợp, không đóng container, thường có cần trục riêng trên tàu.</li>
<li><strong>Tàu Ro-Ro (Roll-on/Roll-off)</strong> — xe cộ và hàng có bánh tự lăn lên/xuống qua cầu dẫn.</li>
</ul>
<h3>Kết cấu cảng biển</h3>
<ul>
<li><strong>Cầu bến (berth/quay)</strong> — nơi tàu neo để bốc/dỡ hàng.</li>
<li><strong>Cần trục cầu bến (STS crane)</strong> — nâng container giữa tàu và bờ.</li>
<li><strong>Bãi container (CY)</strong> — khu lưu container đầy/rỗng chờ lấy hoặc chờ xếp lên tàu.</li>
<li><strong>Trạm giao nhận hàng lẻ (CFS)</strong> — kho đóng hàng vào / rút hàng ra container (dùng cho hàng LCL).</li>
</ul>
<h3>Cuộc cách mạng container hoá</h3>
<p>Trước những năm 1950, hàng được bốc từng kiện ("break-bulk") — chậm, tốn nhân công, dễ hư hỏng/mất mát. <strong>Container ISO</strong> tiêu chuẩn (chủ yếu thùng thép 20ft và 40ft) cho phép hàng di chuyển liền mạch giữa tàu, tàu hoả và xe tải mà không cần mở ra — một đơn vị duy nhất, xếp chồng được, cần trục nâng được.</p>
<pre><code>Trước container:               Sau container:
 Break-bulk, từng kiện một  ->  Thùng chuẩn 20ft / 40ft
 Nhiều ngày mỗi tàu ở cảng   ->  Vài giờ mỗi tàu ở cảng
 Nhân công nhiều + dễ hỏng   ->  Ít nhân công, niêm phong & theo dõi được
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Container hoá không chỉ làm vận tải rẻ hơn — nó làm vận tải <em>dự đoán được</em>, chính điều này cho phép chuỗi cung ứng toàn cầu lập kế hoạch sản xuất theo thời gian vận chuyển đường biển.</div>`,
  ]]);

const c2q = quiz('gsf301-quiz-2', 'Quiz 2 — Ships, ports & containerization|||Quiz 2 — Tàu, cảng & container hoá', [
  { id: 'q1', question: 'TEU là đơn vị đo gì?', options: ['Tốc độ tàu', 'Sức chở tàu container (tương đương container 20ft)', 'Trọng tải hàng rời', 'Số cần trục ở cảng'], correctIndex: 1, explanation: 'TEU (Twenty-foot Equivalent Unit) đo sức chở container của tàu.' },
  { id: 'q2', question: 'Trạm giao nhận hàng lẻ CFS dùng để làm gì?', options: ['Sửa tàu', 'Đóng/rút hàng vào-ra container, phục vụ hàng LCL', 'Neo tàu', 'Nạp nhiên liệu'], correctIndex: 1, explanation: 'CFS là kho đóng hàng lẻ vào container hoặc rút ra, chủ yếu cho hàng LCL.' },
  { id: 'q3', question: 'Container hoá thay đổi ngành vận tải chủ yếu vì?', options: ['Tàu chạy nhanh hơn', 'Đơn vị hàng hoá chuẩn hoá, giảm thời gian & nhân công bốc dỡ', 'Bỏ được vận đơn', 'Giảm số cảng cần dùng'], correctIndex: 1, explanation: 'Container chuẩn hoá giúp bốc dỡ nhanh, ít nhân công, ít hư hỏng — thay cho break-bulk từng kiện.' },
]);

const c3 = doc('gsf301-3-1-chartering-methods', '3.1 — Chartering methods: liner, tramp & charter|||3.1 — Phương thức thuê tàu: liner, tramp & charter',
  'Liner shipping (lịch cố định, biểu giá công bố) vs tramp shipping (theo hợp đồng thuê, không lịch cố định); ba loại hợp đồng thuê tàu: chuyến (voyage), định hạn (time), thuê tàu trơn (bareboat/demise).',
  [[
    `<span class="eyebrow">GSF301 · Chapter 3 · Lesson 3.1</span>
<h2>Chartering methods: liner, tramp &amp; charter</h2>
<h3>Liner shipping</h3>
<p><strong>Liner</strong> operators run <em>fixed routes</em> on a <em>published schedule</em>, at a <em>published tariff</em>, and accept cargo from any shipper as a <strong>common carrier</strong>. Container lines (Maersk, MSC, COSCO...) are the classic example — you book a slot; the ship sails whether it is full or not.</p>
<h3>Tramp shipping</h3>
<p><strong>Tramp</strong> ships have no fixed route or schedule — they go wherever cargo (and the charter market) takes them, typically carrying full shiploads of bulk commodities for one charterer at a time, under individually negotiated rates.</p>
<h3>The three charter types</h3>
<ul>
<li><strong>Voyage charter</strong> — the shipowner carries a specific cargo between named ports for one voyage; shipowner pays running costs and controls the vessel; charterer pays freight per the agreed rate.</li>
<li><strong>Time charter</strong> — the charterer hires the ship (with crew) for a period of time and directs where it sails; charterer pays for fuel &amp; port costs (voyage costs), owner still pays running costs (crew, maintenance, insurance).</li>
<li><strong>Bareboat / demise charter</strong> — the charterer hires just the vessel, with no crew, and operates it as if they owned it — takes on nearly all costs and responsibilities.</li>
</ul>
<pre><code>Charter type     Who provides crew   Who controls voyage   Typical use
Voyage charter   Shipowner            Shipowner              One cargo, one voyage
Time charter     Shipowner            Charterer               Multi-voyage, fixed period
Bareboat charter Charterer            Charterer                Long-term, near-ownership
</code></pre>
<p>The contract governing any charter is the <strong>charter party</strong> — it sets the rate, laytime (allowed loading/discharge time), demurrage (penalty for delay) and other terms.</p>
<div class="callout"><span class="badge">Liner vs tramp, in one line</span> Liner = "the schedule is fixed, cargo fits around it." Tramp/charter = "the cargo is fixed, the ship's movement fits around it."</div>`,
    `<span class="eyebrow">GSF301 · Chương 3 · Bài 3.1</span>
<h2>Phương thức thuê tàu: liner, tramp &amp; charter</h2>
<h3>Vận tải tàu chợ (liner)</h3>
<p>Hãng <strong>liner</strong> chạy các tuyến <em>cố định</em> theo <em>lịch trình công bố</em>, với <em>biểu giá công bố</em>, và nhận hàng từ bất kỳ người gửi hàng nào với vai trò <strong>người chuyên chở công cộng (common carrier)</strong>. Hãng tàu container (Maersk, MSC, COSCO...) là ví dụ điển hình — bạn đặt chỗ; tàu chạy đúng lịch dù đầy hay không.</p>
<h3>Vận tải tàu chuyến (tramp)</h3>
<p>Tàu <strong>tramp</strong> không có tuyến hay lịch cố định — chúng đi theo nơi có hàng (và thị trường thuê tàu), thường chở nguyên chuyến hàng rời cho một người thuê tại một thời điểm, theo giá đàm phán riêng cho từng hợp đồng.</p>
<h3>Ba loại hợp đồng thuê tàu</h3>
<ul>
<li><strong>Thuê tàu chuyến (voyage charter)</strong> — chủ tàu chở một lô hàng cụ thể giữa các cảng chỉ định cho một chuyến; chủ tàu trả chi phí vận hành và kiểm soát tàu; người thuê trả cước theo giá thoả thuận.</li>
<li><strong>Thuê tàu định hạn (time charter)</strong> — người thuê thuê tàu (kèm thuỷ thủ đoàn) trong một khoảng thời gian và chỉ định tàu chạy đi đâu; người thuê trả nhiên liệu &amp; chi phí cảng (chi phí chuyến đi), chủ tàu vẫn trả chi phí vận hành (thuỷ thủ, bảo dưỡng, bảo hiểm).</li>
<li><strong>Thuê tàu trơn (bareboat/demise charter)</strong> — người thuê chỉ thuê con tàu, không có thuỷ thủ đoàn, và vận hành như thể mình sở hữu — gánh gần hết chi phí và trách nhiệm.</li>
</ul>
<pre><code>Loại thuê tàu      Ai cấp thuỷ thủ    Ai kiểm soát chuyến đi   Dùng cho
Thuê chuyến        Chủ tàu             Chủ tàu                   Một lô hàng, một chuyến
Thuê định hạn      Chủ tàu             Người thuê                Nhiều chuyến, thời hạn cố định
Thuê tàu trơn      Người thuê          Người thuê                 Dài hạn, gần như sở hữu
</code></pre>
<p>Hợp đồng chi phối mọi loại thuê tàu là <strong>charter party</strong> — quy định giá, laytime (thời gian bốc/dỡ được phép), demurrage (phạt trễ) và các điều khoản khác.</p>
<div class="callout"><span class="badge">Liner vs tramp, gói trong một câu</span> Liner = "lịch cố định, hàng phải xếp theo lịch." Tramp/charter = "hàng cố định, tàu di chuyển theo hàng."</div>`,
  ]]);

const c3q = quiz('gsf301-quiz-3', 'Quiz 3 — Liner, tramp & charter|||Quiz 3 — Liner, tramp & charter', [
  { id: 'q1', question: 'Đặc điểm của vận tải tàu chợ (liner) là gì?', options: ['Không lịch cố định', 'Tuyến cố định, lịch trình & biểu giá công bố', 'Chỉ chở hàng rời', 'Không nhận hàng lẻ'], correctIndex: 1, explanation: 'Liner chạy tuyến/lịch/giá cố định, nhận hàng từ bất kỳ shipper nào.' },
  { id: 'q2', question: 'Ở hợp đồng thuê tàu định hạn (time charter), ai trả nhiên liệu & chi phí cảng?', options: ['Chủ tàu', 'Người thuê tàu (charterer)', 'Cảng vụ', 'Hãng bảo hiểm'], correctIndex: 1, explanation: 'Time charter: người thuê trả chi phí chuyến đi (nhiên liệu, cảng); chủ tàu trả chi phí vận hành.' },
  { id: 'q3', question: 'Thuê tàu trơn (bareboat charter) khác gì so với hai loại còn lại?', options: ['Có kèm thuỷ thủ đoàn của chủ tàu', 'Người thuê vận hành tàu như của mình, không kèm thuỷ thủ', 'Chỉ dùng cho tàu container', 'Không cần hợp đồng'], correctIndex: 1, explanation: 'Bareboat: người thuê nhận tàu trơn, tự bố trí thuỷ thủ, gánh gần hết chi phí/trách nhiệm.' },
]);

const c4 = doc('gsf301-4-1-bill-of-lading-documents', '4.1 — Bill of Lading & shipping documents|||4.1 — Vận đơn đường biển (Bill of Lading) & chứng từ',
  'Ba chức năng của B/L (biên nhận hàng, bằng chứng hợp đồng, chứng từ sở hữu); các loại B/L (straight/order/bearer, clean/claused, House/Master); các chứng từ liên quan.',
  [[
    `<span class="eyebrow">GSF301 · Chapter 4 · Lesson 4.1</span>
<h2>Bill of Lading &amp; shipping documents</h2>
<h3>The three functions of a Bill of Lading (B/L)</h3>
<ul>
<li><strong>Receipt of goods</strong> — the carrier acknowledges it received the cargo described, in the condition stated.</li>
<li><strong>Evidence of the contract of carriage</strong> — it records (or refers to) the terms under which the carrier agreed to transport the goods.</li>
<li><strong>Document of title</strong> — for a <em>negotiable</em> B/L, whoever holds the original document controls the right to claim the goods at destination — this is what lets banks use it as loan collateral in trade finance.</li>
</ul>
<h3>Types of B/L</h3>
<ul>
<li><strong>Straight B/L</strong> — names a specific consignee, non-negotiable, cannot be transferred by endorsement.</li>
<li><strong>Order B/L</strong> — made "to order", <em>negotiable</em>, transferable by endorsement — the common type in letter-of-credit trade.</li>
<li><strong>Bearer B/L</strong> — whoever physically holds it can claim the goods — rare, high risk if lost.</li>
<li><strong>Clean B/L</strong> — no remark about damage/shortage; <strong>Claused (foul) B/L</strong> — carrier noted a defect on loading, which most banks will reject under a letter of credit.</li>
<li><strong>House B/L (HBL)</strong> — issued by the freight forwarder to their customer; <strong>Master B/L (MBL)</strong> — issued by the actual ocean carrier to the forwarder (or NVOCC).</li>
</ul>
<h3>Related documents</h3>
<pre><code>Booking note         -> shipper's request, confirmed slot on the vessel
Shipping instruction  -> shipper tells forwarder/carrier the B/L details
Mate's receipt        -> ship officer's preliminary receipt before the B/L is issued
Sea waybill           -> like a B/L but NOT a document of title (faster release, no negotiability)
Commercial invoice    -> price & payment terms between seller and buyer
Packing list          -> itemized contents, weights & measurements
Certificate of origin -> where the goods were manufactured (for customs/tariffs)
</code></pre>
<div class="callout"><span class="badge">Exam tip</span> "Document of title" is the single most-tested phrase in this chapter — it is what separates a B/L from a sea waybill, and it is why the original B/L, not a copy, is what a bank in a letter-of-credit deal actually wants to see.</div>`,
    `<span class="eyebrow">GSF301 · Chương 4 · Bài 4.1</span>
<h2>Vận đơn đường biển &amp; chứng từ</h2>
<h3>Ba chức năng của Vận đơn (B/L)</h3>
<ul>
<li><strong>Biên nhận hàng hoá</strong> — người chuyên chở xác nhận đã nhận đúng loại hàng, trong tình trạng như đã ghi.</li>
<li><strong>Bằng chứng hợp đồng vận chuyển</strong> — ghi lại (hoặc dẫn chiếu) các điều khoản mà người chuyên chở đồng ý vận chuyển hàng.</li>
<li><strong>Chứng từ sở hữu (document of title)</strong> — với B/L <em>chuyển nhượng được</em>, ai đang giữ bản gốc có quyền nhận hàng tại điểm đến — đây là lý do ngân hàng dùng nó làm tài sản đảm bảo trong tài trợ thương mại.</li>
</ul>
<h3>Các loại B/L</h3>
<ul>
<li><strong>Straight B/L</strong> — ghi rõ một người nhận hàng cụ thể, không chuyển nhượng được bằng ký hậu.</li>
<li><strong>Order B/L</strong> — lập "theo lệnh", <em>chuyển nhượng được</em> bằng ký hậu — loại phổ biến trong giao dịch L/C.</li>
<li><strong>Bearer B/L</strong> — ai đang cầm bản gốc có quyền nhận hàng — hiếm dùng, rủi ro cao nếu mất.</li>
<li><strong>Clean B/L</strong> — không ghi chú hư hỏng/thiếu hụt; <strong>Claused (foul) B/L</strong> — người chuyên chở ghi chú lỗi khi nhận hàng, hầu hết ngân hàng từ chối trong giao dịch L/C.</li>
<li><strong>House B/L (HBL)</strong> — do người giao nhận phát cho khách hàng của mình; <strong>Master B/L (MBL)</strong> — do hãng tàu thực tế phát cho người giao nhận (hoặc NVOCC).</li>
</ul>
<h3>Chứng từ liên quan</h3>
<pre><code>Booking note          -> yêu cầu đặt chỗ của shipper, xác nhận chỗ trên tàu
Shipping instruction   -> shipper báo chi tiết B/L cho forwarder/hãng tàu
Mate's receipt         -> biên nhận sơ bộ của sĩ quan tàu trước khi phát B/L
Sea waybill            -> giống B/L nhưng KHÔNG là chứng từ sở hữu (trả hàng nhanh, không chuyển nhượng)
Commercial invoice     -> giá & điều khoản thanh toán giữa người bán và người mua
Packing list           -> chi tiết hàng hoá, trọng lượng & kích thước
Certificate of origin  -> nơi sản xuất hàng hoá (phục vụ hải quan/thuế)
</code></pre>
<div class="callout"><span class="badge">Mẹo thi</span> "Chứng từ sở hữu" là cụm từ được hỏi nhiều nhất ở chương này — nó là điểm khác biệt giữa B/L và sea waybill, và là lý do ngân hàng trong giao dịch L/C cần xem bản gốc B/L, không phải bản copy.</div>`,
  ]]);

const c4q = quiz('gsf301-quiz-4', 'Quiz 4 — Bill of Lading & documents|||Quiz 4 — Vận đơn & chứng từ', [
  { id: 'q1', question: 'Chức năng nào của B/L cho phép ngân hàng dùng nó làm tài sản đảm bảo trong L/C?', options: ['Biên nhận hàng', 'Bằng chứng hợp đồng', 'Chứng từ sở hữu (document of title)', 'Chứng nhận xuất xứ'], correctIndex: 2, explanation: 'Vì B/L chuyển nhượng được là chứng từ sở hữu — ai giữ bản gốc có quyền nhận hàng.' },
  { id: 'q2', question: 'B/L nào KHÔNG chuyển nhượng được bằng ký hậu?', options: ['Order B/L', 'Straight B/L', 'Bearer B/L', 'Cả ba đều chuyển nhượng được'], correctIndex: 1, explanation: 'Straight B/L ghi rõ một consignee cụ thể, không ký hậu chuyển nhượng.' },
  { id: 'q3', question: 'House B/L (HBL) do ai phát hành?', options: ['Hãng tàu thực tế cho forwarder', 'Người giao nhận (forwarder) cho khách hàng của mình', 'Cảng vụ cho chủ tàu', 'Hải quan cho người nhập khẩu'], correctIndex: 1, explanation: 'HBL là B/L do forwarder phát cho khách; Master B/L mới là do hãng tàu phát cho forwarder/NVOCC.' },
]);

const c5 = doc('gsf301-5-1-forwarding-fcl-lcl', '5.1 — Forwarding process & FCL/LCL|||5.1 — Quy trình giao nhận & FCL/LCL',
  'Vai trò forwarder (đặt chỗ, chứng từ, hải quan, gom hàng); FCL (nguyên container) vs LCL (hàng lẻ, gom tại CFS); quy trình xuất/nhập khẩu từng bước.',
  [[
    `<span class="eyebrow">GSF301 · Chapter 5 · Lesson 5.1</span>
<h2>Forwarding process &amp; FCL/LCL</h2>
<h3>What a freight forwarder actually does</h3>
<p>A <strong>freight forwarder</strong> acts as the shipper's logistics organizer: booking space with a carrier, preparing/checking shipping documents, arranging customs clearance, and — critically for small shippers — <strong>consolidating</strong> many shippers' cargo into one container.</p>
<h3>FCL — Full Container Load</h3>
<p>The shipper (or their trucker) loads and seals an <em>entire container</em> themselves; it travels container-to-container (CY-to-CY) without being opened until it reaches the consignee. Cheaper per unit for large volumes, and lower risk of mixing/damage since only one shipper's goods are inside.</p>
<h3>LCL — Less than Container Load</h3>
<p>For a shipment too small to fill a container, the forwarder <strong>consolidates (groupage)</strong>: several shippers' smaller lots are stuffed into one shared container at a <strong>CFS</strong>, then de-stuffed and re-sorted to each consignee at destination. Costs more per unit but is the only viable option below a full container's worth of cargo.</p>
<pre><code>FCL flow:
 Shipper stuffs &amp; seals container -> CY (loaded) -> vessel -> CY (destination) -> consignee (door)

LCL flow:
 Shipper's cargo -> CFS (origin, consolidated with others) -> vessel -> CFS (destination, de-consolidated)
 -> sorted -> delivered to each consignee
</code></pre>
<h3>Export process, step by step</h3>
<pre><code>1. Booking        -> forwarder books space with the carrier
2. Stuffing        -> FCL: at shipper's premises | LCL: at origin CFS
3. Customs export  -> declaration filed, cargo cleared for export
4. B/L issued       -> Master B/L (carrier) and/or House B/L (forwarder)
5. Main carriage    -> ocean voyage to destination port
6. Arrival &amp; customs import -> declaration, duties, clearance
7. Delivery         -> FCL: container to consignee door | LCL: de-stuffed at CFS, then delivered
</code></pre>
<div class="callout"><span class="badge">Exam tip</span> FCL vs LCL is really a question of <em>who controls the container</em> — one shipper alone (FCL) or several shippers sharing it through the forwarder (LCL).</div>`,
    `<span class="eyebrow">GSF301 · Chương 5 · Bài 5.1</span>
<h2>Quy trình giao nhận &amp; FCL/LCL</h2>
<h3>Người giao nhận thực sự làm gì</h3>
<p>Một <strong>người giao nhận (freight forwarder)</strong> đóng vai trò người tổ chức logistics cho shipper: đặt chỗ với hãng tàu, chuẩn bị/kiểm tra chứng từ vận tải, tổ chức thông quan, và — quan trọng với shipper nhỏ — <strong>gom hàng (consolidation)</strong> của nhiều shipper vào một container.</p>
<h3>FCL — Nguyên container (Full Container Load)</h3>
<p>Shipper (hoặc đơn vị vận tải của họ) tự đóng và niêm phong <em>cả container</em>; hàng đi container-đến-container (CY-to-CY) không bị mở ra cho tới khi tới tay consignee. Rẻ hơn trên mỗi đơn vị với khối lượng lớn, và ít rủi ro lẫn/hư hỏng vì bên trong chỉ có hàng của một shipper.</p>
<h3>LCL — Hàng lẻ (Less than Container Load)</h3>
<p>Với lô hàng quá nhỏ để lấp đầy một container, forwarder <strong>gom hàng (groupage)</strong>: nhiều lô nhỏ của nhiều shipper được đóng vào cùng một container tại <strong>CFS</strong>, rồi rút hàng và phân loại lại cho từng consignee ở điểm đến. Chi phí trên mỗi đơn vị cao hơn nhưng là lựa chọn duy nhất khả thi khi lượng hàng chưa đủ một container.</p>
<pre><code>Luồng FCL:
 Shipper đóng &amp; niêm phong container -> CY (đi) -> tàu -> CY (đến) -> consignee (tại kho)

Luồng LCL:
 Hàng của shipper -> CFS (nơi đi, gom cùng hàng khác) -> tàu -> CFS (nơi đến, rút hàng)
 -> phân loại -> giao cho từng consignee
</code></pre>
<h3>Quy trình xuất khẩu, từng bước</h3>
<pre><code>1. Đặt chỗ (booking)   -> forwarder đặt chỗ với hãng tàu
2. Đóng hàng            -> FCL: tại kho shipper | LCL: tại CFS nơi đi
3. Thông quan xuất       -> khai báo, thông quan cho phép xuất
4. Phát vận đơn          -> Master B/L (hãng tàu) và/hoặc House B/L (forwarder)
5. Vận chuyển chính       -> chuyến biển tới cảng đến
6. Đến cảng &amp; thông quan nhập -> khai báo, đóng thuế, thông quan
7. Giao hàng              -> FCL: container tới tận kho consignee | LCL: rút hàng tại CFS rồi giao
</code></pre>
<div class="callout"><span class="badge">Mẹo thi</span> FCL vs LCL thực chất là câu hỏi <em>ai kiểm soát container</em> — một shipper duy nhất (FCL) hay nhiều shipper chia sẻ qua forwarder (LCL).</div>`,
  ]]);

const c5q = quiz('gsf301-quiz-5', 'Quiz 5 — Forwarding & FCL/LCL|||Quiz 5 — Giao nhận & FCL/LCL', [
  { id: 'q1', question: 'Điểm khác biệt cốt lõi giữa FCL và LCL là gì?', options: ['FCL chỉ dùng cho hàng lỏng', 'FCL: một shipper kiểm soát cả container; LCL: nhiều shipper gom chung qua forwarder', 'LCL nhanh hơn FCL', 'FCL không cần B/L'], correctIndex: 1, explanation: 'FCL = nguyên container của một shipper; LCL = gom hàng lẻ của nhiều shipper tại CFS.' },
  { id: 'q2', question: 'CFS (Container Freight Station) dùng để làm gì trong quy trình LCL?', options: ['Sửa container hỏng', 'Đóng/rút hàng và phân loại cho hàng lẻ', 'Cấp vận đơn gốc', 'Thông quan hải quan'], correctIndex: 1, explanation: 'CFS là nơi gom hàng lẻ vào container ở đầu đi và rút/phân loại ở đầu đến.' },
  { id: 'q3', question: 'Bước nào diễn ra NGAY SAU khi cargo được đóng hàng, trong quy trình xuất khẩu?', options: ['Giao hàng cho consignee', 'Thông quan xuất khẩu', 'Vận chuyển chính trên biển', 'Thông quan nhập khẩu'], correctIndex: 1, explanation: 'Sau đóng hàng là khai báo & thông quan xuất, rồi mới phát B/L và vận chuyển chính.' },
]);

const c6 = doc('gsf301-6-1-freight-rates-surcharges', '6.1 — Freight rates, surcharges & cost calculation|||6.1 — Giá cước, phụ phí & tính toán chi phí',
  'Cơ sở tính cước (theo container FCL; theo trọng lượng/thể tích W/M cho LCL); các phụ phí phổ biến (BAF, CAF, THC, PSS, D/O); ví dụ tính tổng chi phí.',
  [[
    `<span class="eyebrow">GSF301 · Chapter 6 · Lesson 6.1</span>
<h2>Freight rates, surcharges &amp; cost calculation</h2>
<h3>How the base rate is charged</h3>
<ul>
<li><strong>FCL</strong> — a flat rate <em>per container</em> (e.g. per 20ft or per 40ft), regardless of exactly how full it is.</li>
<li><strong>LCL / break-bulk</strong> — charged on the <strong>revenue ton (W/M — weight or measurement)</strong>: the carrier bills on whichever is greater, actual weight in tonnes or volume in cubic meters, using the standard conversion <strong>1 CBM = 1,000 kg</strong>.</li>
</ul>
<h3>Common surcharges</h3>
<ul>
<li><strong>BAF / FAF</strong> (Bunker/Fuel Adjustment Factor) — offsets fuel-price swings.</li>
<li><strong>CAF</strong> (Currency Adjustment Factor) — offsets exchange-rate risk.</li>
<li><strong>THC</strong> (Terminal Handling Charge) — port terminal's fee for handling the container.</li>
<li><strong>PSS</strong> (Peak Season Surcharge) — added during high-demand periods.</li>
<li><strong>CIC</strong> (Container Imbalance Charge) — where containers pile up empty in one direction.</li>
<li><strong>D/O fee</strong> (Delivery Order) — the fee to release the cargo/container at destination.</li>
</ul>
<h3>Worked example — LCL revenue ton</h3>
<pre><code>Shipment: 3,200 kg, dimensions give 4.5 CBM total
Weight in tonnes  = 3.2 t
Volume in tonnes   = 4.5 t   (using 1 CBM = 1,000 kg)
Chargeable (W/M)   = MAX(3.2, 4.5) = 4.5 revenue tons  -> billed as 4.5 t, not 3.2 t
</code></pre>
<h3>Worked example — total freight cost</h3>
<pre><code>Base ocean freight (FCL 40ft)   = 1,200 (currency unit)
+ BAF                            =   150
+ THC (origin + destination)     =   180
+ D/O fee                        =    60
------------------------------------------
Total sea-freight cost           = 1,590
</code></pre>
<div class="callout"><span class="badge">Exam tip</span> The revenue-ton rule (bill on whichever is bigger, weight or volume) is the single calculation most likely to appear in an exam question — always convert volume to tonnes using 1 CBM = 1,000 kg before comparing.</div>`,
    `<span class="eyebrow">GSF301 · Chương 6 · Bài 6.1</span>
<h2>Giá cước, phụ phí &amp; tính toán chi phí</h2>
<h3>Cách tính giá cước gốc</h3>
<ul>
<li><strong>FCL</strong> — giá cố định <em>theo container</em> (vd theo container 20ft hoặc 40ft), bất kể chở đầy hay chưa.</li>
<li><strong>LCL / hàng rời</strong> — tính theo <strong>tấn cước (W/M — weight or measurement)</strong>: hãng tàu tính theo bên lớn hơn giữa trọng lượng thực (tấn) và thể tích (m3), theo quy đổi chuẩn <strong>1 CBM = 1.000 kg</strong>.</li>
</ul>
<h3>Các phụ phí phổ biến</h3>
<ul>
<li><strong>BAF / FAF</strong> (phụ phí biến động nhiên liệu) — bù đắp biến động giá nhiên liệu.</li>
<li><strong>CAF</strong> (phụ phí biến động tỷ giá) — bù đắp rủi ro tỷ giá.</li>
<li><strong>THC</strong> (phí xếp dỡ tại cảng) — phí của cảng cho việc xử lý container.</li>
<li><strong>PSS</strong> (phụ phí mùa cao điểm) — thêm vào khi nhu cầu tăng cao.</li>
<li><strong>CIC</strong> (phụ phí mất cân đối container) — khi container rỗng dồn lại một chiều.</li>
<li><strong>Phí D/O</strong> (lệnh giao hàng) — phí để nhận hàng/container tại điểm đến.</li>
</ul>
<h3>Ví dụ — tấn cước LCL</h3>
<pre><code>Lô hàng: 3.200 kg, kích thước cho ra 4,5 CBM tổng
Trọng lượng theo tấn = 3,2 t
Thể tích theo tấn      = 4,5 t   (dùng 1 CBM = 1.000 kg)
Tấn cước tính (W/M)     = MAX(3,2; 4,5) = 4,5 tấn cước  -> tính theo 4,5 t, không phải 3,2 t
</code></pre>
<h3>Ví dụ — tổng chi phí cước</h3>
<pre><code>Cước biển gốc (FCL 40ft)     = 1.200 (đơn vị tiền)
+ BAF                          =   150
+ THC (đầu đi + đầu đến)       =   180
+ Phí D/O                      =    60
------------------------------------------
Tổng chi phí cước biển         = 1.590
</code></pre>
<div class="callout"><span class="badge">Mẹo thi</span> Quy tắc tấn cước (tính theo bên lớn hơn giữa trọng lượng và thể tích) là phép tính hay xuất hiện nhất trong đề — luôn quy đổi thể tích ra tấn bằng 1 CBM = 1.000 kg trước khi so sánh.</div>`,
  ]]);

const c6q = quiz('gsf301-quiz-6', 'Quiz 6 — Freight rates & surcharges|||Quiz 6 — Giá cước & phụ phí', [
  { id: 'q1', question: 'Lô hàng LCL có trọng lượng 3,2 tấn và thể tích quy đổi 4,5 tấn. Tấn cước (W/M) tính là bao nhiêu?', options: ['3,2 tấn', '4,5 tấn', '7,7 tấn', 'Trung bình 3,85 tấn'], correctIndex: 1, explanation: 'W/M tính theo bên lớn hơn giữa trọng lượng và thể tích quy đổi (1 CBM = 1.000 kg) -> 4,5 tấn.' },
  { id: 'q2', question: 'THC (Terminal Handling Charge) là phụ phí gì?', options: ['Phụ phí biến động tỷ giá', 'Phí xếp dỡ container tại cảng', 'Phí mùa cao điểm', 'Phí thuê tàu'], correctIndex: 1, explanation: 'THC là phí cảng thu cho việc xếp dỡ/xử lý container.' },
  { id: 'q3', question: 'Giá cước FCL thường được tính như thế nào?', options: ['Theo tấn cước W/M', 'Giá cố định theo mỗi container, bất kể độ đầy', 'Theo số ngày tàu chạy', 'Theo giá trị hàng hoá'], correctIndex: 1, explanation: 'FCL tính cước cố định theo container (20ft/40ft), không phụ thuộc mức độ đầy.' },
]);

const c7 = doc('gsf301-7-1-carrier-liability-conventions', '7.1 — Carrier liability & international conventions|||7.1 — Trách nhiệm người chuyên chở & công ước quốc tế',
  'Các chế độ trách nhiệm quốc tế (Hague/Hague-Visby, Hamburg, Rotterdam); giới hạn trách nhiệm & miễn trừ; thời hạn trách nhiệm; Bộ luật Hàng hải Việt Nam.',
  [[
    `<span class="eyebrow">GSF301 · Chapter 7 · Lesson 7.1</span>
<h2>Carrier liability &amp; international conventions</h2>
<h3>Why liability rules exist</h3>
<p>When cargo is lost or damaged at sea, <em>who pays, how much, and under what conditions</em> is not left to guesswork — it is set by international conventions that most countries' maritime law is built on.</p>
<h3>The main conventions</h3>
<ul>
<li><strong>Hague Rules (1924)</strong> — the original framework: minimum carrier obligations (seaworthiness, proper care of cargo) balanced against a long list of carrier exceptions (e.g. nautical fault, fire, act of God) and a per-package liability limit.</li>
<li><strong>Hague-Visby Rules (1968)</strong> — amended Hague Rules: raised liability limits, added container-specific rules (how to count "packages" inside a container), still widely used today (and the basis for Vietnam's Maritime Code).</li>
<li><strong>Hamburg Rules (1978)</strong> — more shipper-friendly: removed several carrier exceptions (including nautical fault), extended the carrier's period of responsibility.</li>
<li><strong>Rotterdam Rules (2008)</strong> — designed for door-to-door and multimodal transport, covering electronic documents; not yet widely in force.</li>
</ul>
<h3>Key liability concepts</h3>
<ul>
<li><strong>Package/unit limitation</strong> — liability capped per package or per kg, unless the shipper declared a higher value.</li>
<li><strong>Carrier exceptions</strong> — under Hague-Visby, carriers are not liable for losses from causes like fire (without their fault), perils of the sea, or inherent defect of the goods.</li>
<li><strong>Period of responsibility</strong> — historically "tackle to tackle" (loading to discharge only); modern practice extends this "port to port" or even "door to door" by contract.</li>
<li><strong>General average</strong> — when cargo/ship is deliberately sacrificed to save the voyage (e.g. jettisoning cargo in a storm), the loss is shared proportionally among all cargo interests, not borne solely by the owner of what was lost.</li>
</ul>
<h3>Vietnam</h3>
<p>The <strong>Bộ luật Hàng hải Việt Nam 2015 (Vietnam Maritime Code)</strong> largely follows Hague-Visby principles for carrier liability, package limitation and the carrier's core obligations.</p>
<div class="callout"><span class="badge">Exam tip</span> If a question asks "which convention removed the nautical-fault exception," the answer is <strong>Hamburg Rules</strong> — that single change is the clearest line dividing the older, carrier-favoring regime from the newer, shipper-favoring one.</div>`,
    `<span class="eyebrow">GSF301 · Chương 7 · Bài 7.1</span>
<h2>Trách nhiệm người chuyên chở &amp; công ước quốc tế</h2>
<h3>Vì sao cần quy tắc trách nhiệm</h3>
<p>Khi hàng hoá bị mất hoặc hư hỏng trên biển, <em>ai chịu trách nhiệm, bao nhiêu, và trong điều kiện nào</em> không phải để tuỳ ý phán đoán — nó được quy định bởi các công ước quốc tế mà luật hàng hải hầu hết các nước dựa vào.</p>
<h3>Các công ước chính</h3>
<ul>
<li><strong>Quy tắc Hague (1924)</strong> — khung ban đầu: nghĩa vụ tối thiểu của người chuyên chở (tàu đủ khả năng đi biển, chăm sóc hàng hợp lý) được cân bằng bằng một danh sách dài các trường hợp miễn trừ (lỗi hàng vận, cháy, thiên tai) và giới hạn trách nhiệm theo kiện hàng.</li>
<li><strong>Quy tắc Hague-Visby (1968)</strong> — sửa đổi Hague Rules: nâng mức giới hạn trách nhiệm, thêm quy định riêng cho container (cách tính "kiện hàng" trong container), vẫn được dùng rộng rãi hiện nay (và là cơ sở của Bộ luật Hàng hải Việt Nam).</li>
<li><strong>Quy tắc Hamburg (1978)</strong> — nghiêng về phía shipper hơn: bỏ một số miễn trừ của người chuyên chở (bao gồm lỗi hàng vận), kéo dài thời hạn trách nhiệm của người chuyên chở.</li>
<li><strong>Quy tắc Rotterdam (2008)</strong> — thiết kế cho vận tải door-to-door và đa phương thức, có quy định chứng từ điện tử; chưa có hiệu lực rộng rãi.</li>
</ul>
<h3>Các khái niệm trách nhiệm chính</h3>
<ul>
<li><strong>Giới hạn theo kiện/đơn vị</strong> — trách nhiệm giới hạn theo mỗi kiện hoặc mỗi kg, trừ khi shipper khai giá trị cao hơn.</li>
<li><strong>Miễn trừ của người chuyên chở</strong> — theo Hague-Visby, người chuyên chở không chịu trách nhiệm cho tổn thất do nguyên nhân như cháy (không do lỗi của họ), hiểm hoạ của biển, hoặc khuyết điểm cố hữu của hàng hoá.</li>
<li><strong>Thời hạn trách nhiệm</strong> — trước đây là "từ móc cẩu đến móc cẩu" (chỉ từ lúc bốc tới lúc dỡ); thực tế hiện đại mở rộng theo hợp đồng thành "cảng đến cảng" hoặc cả "kho đến kho".</li>
<li><strong>Tổn thất chung (general average)</strong> — khi hàng/tàu bị hy sinh có chủ đích để cứu cả chuyến đi (vd vứt hàng khi bão), tổn thất được chia theo tỷ lệ cho tất cả các bên có lợi ích trên hàng, không chỉ chủ hàng bị mất.</li>
</ul>
<h3>Việt Nam</h3>
<p><strong>Bộ luật Hàng hải Việt Nam 2015</strong> phần lớn theo nguyên tắc Hague-Visby về trách nhiệm người chuyên chở, giới hạn theo kiện hàng và nghĩa vụ cốt lõi của người chuyên chở.</p>
<div class="callout"><span class="badge">Mẹo thi</span> Nếu đề hỏi "công ước nào bỏ miễn trừ lỗi hàng vận," câu trả lời là <strong>Quy tắc Hamburg</strong> — thay đổi đó là ranh giới rõ nhất giữa chế độ cũ (nghiêng về người chuyên chở) và chế độ mới (nghiêng về shipper).</div>`,
  ]]);

const c7q = quiz('gsf301-quiz-7', 'Quiz 7 — Carrier liability & conventions|||Quiz 7 — Trách nhiệm & công ước', [
  { id: 'q1', question: 'Công ước nào bỏ miễn trừ "lỗi hàng vận" (nautical fault) của người chuyên chở?', options: ['Hague Rules', 'Hague-Visby Rules', 'Hamburg Rules', 'Rotterdam Rules'], correctIndex: 2, explanation: 'Hamburg Rules (1978) bỏ nhiều miễn trừ của người chuyên chở, gồm lỗi hàng vận.' },
  { id: 'q2', question: 'Bộ luật Hàng hải Việt Nam 2015 chủ yếu dựa theo nguyên tắc của công ước nào?', options: ['Hague Rules', 'Hague-Visby Rules', 'Hamburg Rules', 'Rotterdam Rules'], correctIndex: 1, explanation: 'Bộ luật Hàng hải Việt Nam theo nguyên tắc Hague-Visby cho trách nhiệm người chuyên chở.' },
  { id: 'q3', question: 'Tổn thất chung (general average) là gì?', options: ['Bảo hiểm bắt buộc cho mọi lô hàng', 'Chia tổn thất theo tỷ lệ khi hàng/tàu bị hy sinh có chủ đích để cứu cả chuyến đi', 'Giới hạn trách nhiệm theo kiện hàng', 'Phụ phí biến động nhiên liệu'], correctIndex: 1, explanation: 'General average chia sẻ tổn thất cho mọi bên có lợi ích trên hàng khi có hy sinh chủ đích để cứu chuyến đi.' },
]);

const c8 = doc('gsf301-8-1-shipping-agency-multimodal-vietnam', '8.1 — Shipping agency, multimodal transport & Vietnam seaports|||8.1 — Đại lý hàng hải, đa phương thức & cảng biển Việt Nam',
  'Vai trò đại lý hàng hải (husbanding/port agent); phân biệt forwarder, NVOCC, customs broker; vận tải đa phương thức & MTO; các cụm cảng biển chính của Việt Nam.',
  [[
    `<span class="eyebrow">GSF301 · Chapter 8 · Lesson 8.1</span>
<h2>Shipping agency, multimodal transport &amp; Vietnam's seaports</h2>
<h3>Shipping agents</h3>
<p>A <strong>shipping agent</strong> represents the carrier (not the shipper) at a port the carrier doesn't have its own office in — handling paperwork, port formalities, crew matters, and coordinating with the terminal on the carrier's behalf.</p>
<ul>
<li><strong>Port agent</strong> — handles one call/one port for the ship.</li>
<li><strong>Husbanding agent</strong> — looks after the ship's operational needs in port (crew changes, supplies, repairs) while it is there.</li>
</ul>
<h3>Forwarder vs NVOCC vs customs broker</h3>
<ul>
<li><strong>Freight forwarder</strong> — arranges transport for the shipper; may or may not issue its own B/L.</li>
<li><strong>NVOCC</strong> (Non-Vessel Operating Common Carrier) — acts as a carrier to its customers (issues its own B/L, takes on carrier liability) while actually booking space with a real vessel-operating carrier — a forwarder that also functions as a carrier on paper.</li>
<li><strong>Customs broker</strong> — specializes in customs declarations and clearance, may be a separate role from the forwarder or combined with it.</li>
</ul>
<h3>Multimodal transport</h3>
<p><strong>Multimodal (combined) transport</strong> moves cargo under a single contract across at least two different modes (e.g. sea + rail + truck) door-to-door. The <strong>Multimodal Transport Operator (MTO)</strong> issues one <strong>combined transport document</strong> and takes responsibility for the whole journey — the shipper deals with one party instead of coordinating each leg separately.</p>
<pre><code>Multimodal chain example:
 Factory (inland) -> truck -> port (sea leg, ocean carrier)
 -> destination port -> rail/truck -> final warehouse (door)
 One MTO, one combined transport document, covers the whole chain.
</code></pre>
<h3>Vietnam's main seaport clusters</h3>
<ul>
<li><strong>Hải Phòng</strong> — main gateway for Northern Vietnam.</li>
<li><strong>Cái Mép – Thị Vải (Bà Rịa – Vũng Tàu)</strong> — deep-water port handling direct services to the Americas/Europe.</li>
<li><strong>Cát Lái (TP.HCM/Sài Gòn)</strong> — Vietnam's busiest container terminal by volume, serving the Southern economic hub.</li>
<li><strong>Đà Nẵng</strong> — main gateway for Central Vietnam.</li>
</ul>
<div class="callout"><span class="badge">Big picture</span> An NVOCC is the clearest example that "carrier" is a legal role, not just "owns a ship" — it lets a company take on carrier liability toward its customers while itself being just another customer of the real ocean carrier.</div>`,
    `<span class="eyebrow">GSF301 · Chương 8 · Bài 8.1</span>
<h2>Đại lý hàng hải, đa phương thức &amp; cảng biển Việt Nam</h2>
<h3>Đại lý hàng hải</h3>
<p>Một <strong>đại lý hàng hải</strong> đại diện cho người chuyên chở (không phải shipper) tại cảng mà hãng tàu không có văn phòng riêng — xử lý giấy tờ, thủ tục cảng, việc của thuỷ thủ đoàn, và phối hợp với cảng thay cho hãng tàu.</p>
<ul>
<li><strong>Đại lý cảng (port agent)</strong> — xử lý một lượt tàu ghé/một cảng.</li>
<li><strong>Đại lý phục vụ tàu (husbanding agent)</strong> — chăm lo nhu cầu vận hành của tàu khi ở cảng (đổi thuỷ thủ, tiếp tế, sửa chữa).</li>
</ul>
<h3>Forwarder vs NVOCC vs customs broker</h3>
<ul>
<li><strong>Người giao nhận (forwarder)</strong> — tổ chức vận chuyển cho shipper; có thể hoặc không phát B/L riêng.</li>
<li><strong>NVOCC</strong> (người chuyên chở không có tàu) — đóng vai người chuyên chở với khách hàng của mình (phát B/L riêng, nhận trách nhiệm người chuyên chở) trong khi thực tế đặt chỗ với hãng tàu thật — một forwarder cũng đóng vai carrier trên giấy.</li>
<li><strong>Đại lý hải quan (customs broker)</strong> — chuyên khai báo & thông quan hải quan, có thể tách riêng khỏi forwarder hoặc gộp chung.</li>
</ul>
<h3>Vận tải đa phương thức</h3>
<p><strong>Vận tải đa phương thức (combined transport)</strong> chuyển hàng theo một hợp đồng duy nhất qua ít nhất hai phương thức khác nhau (vd biển + đường sắt + xe tải) từ kho đến kho. <strong>Người kinh doanh vận tải đa phương thức (MTO)</strong> phát một <strong>chứng từ vận tải đa phương thức</strong> duy nhất và chịu trách nhiệm cho cả chuyến đi — shipper chỉ làm việc với một bên duy nhất thay vì phối hợp từng chặng riêng.</p>
<pre><code>Ví dụ chuỗi đa phương thức:
 Nhà máy (trong nội địa) -> xe tải -> cảng (chặng biển, hãng tàu)
 -> cảng đến -> đường sắt/xe tải -> kho cuối (tận kho)
 Một MTO, một chứng từ vận tải đa phương thức, phủ toàn chuỗi.
</code></pre>
<h3>Các cụm cảng biển chính của Việt Nam</h3>
<ul>
<li><strong>Hải Phòng</strong> — cửa ngõ chính của miền Bắc.</li>
<li><strong>Cái Mép – Thị Vải (Bà Rịa – Vũng Tàu)</strong> — cảng nước sâu chạy tuyến trực tiếp tới châu Mỹ/châu Âu.</li>
<li><strong>Cát Lái (TP.HCM/Sài Gòn)</strong> — cảng container nhiều lượng hàng nhất Việt Nam, phục vụ trung tâm kinh tế miền Nam.</li>
<li><strong>Đà Nẵng</strong> — cửa ngõ chính của miền Trung.</li>
</ul>
<div class="callout"><span class="badge">Bức tranh lớn</span> NVOCC là ví dụ rõ nhất cho thấy "người chuyên chở" là một vai trò pháp lý, không chỉ là "có tàu" — nó cho phép một công ty nhận trách nhiệm người chuyên chở với khách hàng của mình trong khi bản thân chỉ là một khách hàng khác của hãng tàu thật.</div>`,
  ]]);

const c8q = quiz('gsf301-quiz-8', 'Quiz 8 — Shipping agency, multimodal & Vietnam ports|||Quiz 8 — Đại lý, đa phương thức & cảng VN', [
  { id: 'q1', question: 'NVOCC khác freight forwarder thông thường ở điểm nào?', options: ['NVOCC không phát chứng từ nào', 'NVOCC đóng vai người chuyên chở, phát B/L riêng & nhận trách nhiệm carrier', 'NVOCC chỉ làm thủ tục hải quan', 'NVOCC luôn sở hữu tàu riêng'], correctIndex: 1, explanation: 'NVOCC hoạt động như carrier với khách hàng (phát B/L, nhận trách nhiệm) dù thực tế đặt chỗ với hãng tàu thật.' },
  { id: 'q2', question: 'Vận tải đa phương thức (multimodal) có đặc điểm gì?', options: ['Mỗi chặng có hợp đồng riêng', 'Một hợp đồng duy nhất, một MTO chịu trách nhiệm toàn chuỗi qua nhiều phương thức', 'Chỉ dùng đường biển', 'Không cần chứng từ vận tải'], correctIndex: 1, explanation: 'MTO phát một chứng từ vận tải đa phương thức duy nhất, chịu trách nhiệm cho cả chuỗi door-to-door.' },
  { id: 'q3', question: 'Cảng nào là cảng container có lượng hàng lớn nhất, phục vụ khu vực TP.HCM?', options: ['Hải Phòng', 'Đà Nẵng', 'Cát Lái', 'Cái Mép – Thị Vải'], correctIndex: 2, explanation: 'Cát Lái tại TP.HCM là cảng container nhiều lượng hàng nhất Việt Nam.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'GSF301',
    slug: 'gsf301-sea-transport-and-forwarding',
    title: 'Sea Transport and Forwarding',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/GSF301.webp',
    shortDescription: 'How sea transport & forwarding work: trade role, ships/ports/containerization, liner/tramp/charter, bills of lading, FCL/LCL, freight rates & surcharges, carrier liability, shipping agency & Vietnam ports. Bilingual, with quizzes.|||Vận tải biển & giao nhận hoạt động thế nào: vai trò thương mại, tàu/cảng/container hoá, thuê tàu liner/tramp/charter, vận đơn, FCL/LCL, giá cước & phụ phí, trách nhiệm người chuyên chở, đại lý hàng hải & cảng biển Việt Nam. Song ngữ, có quiz.',
    description: 'Môn <strong>GSF301 — Sea Transport and Forwarding</strong> (Vận tải biển và Giao nhận, kỳ 4, khối Quản trị Kinh doanh) giúp hiểu <strong>hàng hoá di chuyển bằng đường biển thế nào</strong> và ngành giao nhận tổ chức việc đó ra sao. Từ <strong>vai trò vận tải biển trong thương mại toàn cầu</strong> → <strong>tàu, cảng &amp; container hoá</strong> → <strong>phương thức thuê tàu</strong> (liner, tramp, charter) → <strong>vận đơn &amp; chứng từ</strong> → <strong>quy trình giao nhận, FCL/LCL</strong> → <strong>giá cước &amp; phụ phí</strong> → <strong>trách nhiệm người chuyên chở &amp; công ước quốc tế</strong> → <strong>đại lý hàng hải, đa phương thức &amp; cảng biển Việt Nam</strong>. Bám giáo trình FLM (Maritime Logistics — Song &amp; Panayides; Shipping and Logistics Management — Lun; Bộ luật Hàng hải Việt Nam; Hague-Visby/Hamburg/Rotterdam), song ngữ, có ví dụ tính toán/chứng từ mẫu và quiz mỗi chương.',
    whatYouLearn: 'Vai trò & thị trường vận tải biển (bulk, tanker, liner, break-bulk); tàu biển & kết cấu cảng; container hoá; liner vs tramp vs charter (voyage/time/bareboat); chức năng & loại B/L (straight/order/bearer, House/Master); chứng từ đi kèm; quy trình forwarding & FCL/LCL; cơ sở tính cước, tấn cước W/M, phụ phí (BAF/THC/PSS...); công ước Hague-Visby/Hamburg/Rotterdam & Bộ luật Hàng hải Việt Nam; đại lý hàng hải, NVOCC, vận tải đa phương thức; cảng biển chính của Việt Nam.',
    requirements: 'Không yêu cầu kiến thức chuyên ngành trước. Nên đọc trước về Incoterms và quy trình xuất nhập khẩu cơ bản.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, công ước quốc tế, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vận tải biển, giao nhận, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & vai trò|||Chapter 1 — Overview & role', description: 'Vai trò vận tải biển, thị trường, các bên tham gia, Incoterms.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tàu biển, cảng & container hoá|||Chapter 2 — Ships, ports & containerization', description: 'Loại tàu, kết cấu cảng, TEU, container hoá.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Phương thức thuê tàu|||Chapter 3 — Chartering methods', description: 'Liner, tramp, voyage/time/bareboat charter.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Vận đơn & chứng từ|||Chapter 4 — Bill of Lading & documents', description: 'Chức năng & loại B/L, chứng từ liên quan.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Giao nhận & FCL/LCL|||Chapter 5 — Forwarding & FCL/LCL', description: 'Vai trò forwarder, FCL vs LCL, quy trình xuất khẩu.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Giá cước & phụ phí|||Chapter 6 — Freight rates & surcharges', description: 'Cơ sở tính cước, tấn cước W/M, phụ phí, ví dụ tính chi phí.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Trách nhiệm & công ước|||Chapter 7 — Liability & conventions', description: 'Hague-Visby/Hamburg/Rotterdam, giới hạn trách nhiệm, tổn thất chung.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đại lý, đa phương thức & cảng VN|||Chapter 8 — Agency, multimodal & Vietnam ports', description: 'Shipping agent, NVOCC, MTO, cảng biển Việt Nam.', lessons: [c8, c8q] },
  ],
};
