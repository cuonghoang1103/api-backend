/**
 * GLA301 — Air Transport. Vận tải hàng không trong logistics/chuỗi cung ứng.
 * Khối Quản trị Kinh doanh (BBA), FPTU, Kỳ 4. Giáo trình tham khảo: "Air
 * Transport Management" (Wittmer/Bieger); IATA docs; "Global Logistics and
 * Supply Chain Management" (Mangan). Song ngữ VI/EN, 8 chương.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('gla301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (Wittmer/Bieger, Mangan), tài liệu IATA/ICAO chính thức, YouTube, công cụ tra cứu, lộ trình tự học.',
  [[
    `<span class="eyebrow">GLA301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Air Transport</strong> — the fastest but most expensive mode in the logistics chain — in one place. The official FPTU slides &amp; giáo trình live on <strong>FLM</strong>; below are the reference books and free, legal resources this course draws from.</p>
<h3>📘 Textbooks</h3>
<ul>
<li><em>Air Transport Management: An International Perspective</em> — Wittmer, Bieger &amp; Müller (eds.)</li>
<li><em>Global Logistics and Supply Chain Management</em> — Mangan, Lalwani &amp; Butcher</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.iata.org/" target="_blank" rel="noopener">IATA — International Air Transport Association</a> (commercial standards, AWB, e-freight)</li>
<li><a href="https://www.icao.int/" target="_blank" rel="noopener">ICAO — International Civil Aviation Organization</a> (Chicago Convention, safety/security Annexes)</li>
<li><a href="https://www.iata.org/en/programs/cargo/dgr/" target="_blank" rel="noopener">IATA Dangerous Goods Regulations (DGR) — overview</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@IATA" target="_blank" rel="noopener">IATA official channel</a> — industry briefings, air cargo</li>
<li><a href="https://www.youtube.com/@FreightwavesTV" target="_blank" rel="noopener">FreightWaves</a> — air &amp; multimodal freight market news</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.flightradar24.com/" target="_blank" rel="noopener">Flightradar24</a> — live flight &amp; freighter tracking</li>
<li><a href="https://www.iata.org/en/services/data/" target="_blank" rel="noopener">IATA airline/airport code lookup</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — vai trò vận tải hàng không, cấu trúc ngành, IATA/ICAO.</li>
<li><strong>Practice</strong> — đọc mẫu AWB thật, tính trọng lượng tính cước cho vài lô hàng giả định.</li>
<li><strong>Go deeper</strong> — hàng nguy hiểm (DGR), an ninh hàng không, đại lý giao nhận &amp; đa phương thức.</li>
<li><strong>Job-ready</strong> — theo dõi xu hướng e-freight, SAF, và thị trường hàng không Việt Nam (Long Thành).</li>
</ol></div>`,
    `<span class="eyebrow">GLA301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Vận tải hàng không</strong> — phương thức nhanh nhất nhưng đắt nhất trong chuỗi logistics — gom về một chỗ. Slide &amp; giáo trình chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là sách tham khảo và nguồn miễn phí, hợp pháp mà môn này bám theo.</p>
<h3>📘 Sách giáo trình</h3>
<ul>
<li><em>Air Transport Management: An International Perspective</em> — Wittmer, Bieger &amp; Müller (chủ biên)</li>
<li><em>Global Logistics and Supply Chain Management</em> — Mangan, Lalwani &amp; Butcher</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.iata.org/" target="_blank" rel="noopener">IATA — Hiệp hội Vận tải Hàng không Quốc tế</a> (chuẩn thương mại, AWB, e-freight)</li>
<li><a href="https://www.icao.int/" target="_blank" rel="noopener">ICAO — Tổ chức Hàng không Dân dụng Quốc tế</a> (Công ước Chicago, Annex an toàn/an ninh)</li>
<li><a href="https://www.iata.org/en/programs/cargo/dgr/" target="_blank" rel="noopener">IATA Dangerous Goods Regulations (DGR) — tổng quan</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@IATA" target="_blank" rel="noopener">Kênh chính thức IATA</a> — bản tin ngành, air cargo</li>
<li><a href="https://www.youtube.com/@FreightwavesTV" target="_blank" rel="noopener">FreightWaves</a> — tin thị trường vận tải hàng không &amp; đa phương thức</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.flightradar24.com/" target="_blank" rel="noopener">Flightradar24</a> — theo dõi chuyến bay &amp; máy bay chở hàng thời gian thực</li>
<li><a href="https://www.iata.org/en/services/data/" target="_blank" rel="noopener">Tra mã hãng bay/sân bay của IATA</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — vai trò vận tải hàng không, cấu trúc ngành, IATA/ICAO.</li>
<li><strong>Luyện tập</strong> — đọc mẫu AWB thật, tính trọng lượng tính cước cho vài lô hàng giả định.</li>
<li><strong>Đào sâu</strong> — hàng nguy hiểm (DGR), an ninh hàng không, đại lý giao nhận &amp; đa phương thức.</li>
<li><strong>Sẵn sàng đi làm</strong> — theo dõi xu hướng e-freight, SAF, và thị trường hàng không Việt Nam (Long Thành).</li>
</ol></div>`,
  ]]);

const intro = doc('gla301-0-1-overview', 'Course overview: Air Transport|||Tổng quan môn: Vận tải hàng không',
  'Vận tải hàng không trong logistics: nhanh nhất, đắt nhất, phù hợp hàng giá trị cao/thời gian gấp; lộ trình 8 chương từ tổng quan đến xu hướng &amp; Việt Nam.',
  [[
    `<span class="eyebrow">GLA301 · Lesson 0.1 · Overview</span>
<h2>Air Transport</h2>
<p class="lead">This course explains how <strong>air transport</strong> fits into global logistics and supply chains — the fastest mode, and by far the most expensive per kilogram, reserved for goods where <em>time</em> or <em>value</em> matters more than cost.</p>
<h3>Why air transport exists in a supply chain</h3>
<ul>
<li><strong>Speed</strong> — hours instead of weeks; critical for perishables, urgent spare parts, high fashion, e-commerce.</li>
<li><strong>Value density</strong> — air carries roughly <strong>1% of world trade by weight but over 35% by value</strong> (IATA estimate) — it moves the expensive, light, urgent slice of trade.</li>
<li><strong>Trade-off</strong> — highest cost per kg among all modes; sensitive to weight <em>and</em> volume.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Industry overview &amp; role in logistics → industry structure (airlines, airports, IATA/ICAO) → air cargo process → documents &amp; customs (AWB) → rates &amp; surcharges → security, safety &amp; dangerous goods (DGR) → freight forwarders &amp; multimodal integration → trends (e-freight, sustainability) &amp; Vietnam air transport.</p>`,
    `<span class="eyebrow">GLA301 · Bài 0.1 · Tổng quan</span>
<h2>Vận tải hàng không</h2>
<p class="lead">Môn này giải thích <strong>vận tải hàng không</strong> nằm ở đâu trong logistics và chuỗi cung ứng toàn cầu — phương thức nhanh nhất, và đắt nhất tính theo kilogram, dành cho hàng hoá mà <em>thời gian</em> hoặc <em>giá trị</em> quan trọng hơn chi phí.</p>
<h3>Vì sao vận tải hàng không tồn tại trong chuỗi cung ứng</h3>
<ul>
<li><strong>Tốc độ</strong> — vài giờ thay vì vài tuần; sống còn với hàng dễ hỏng, phụ tùng khẩn cấp, thời trang cao cấp, thương mại điện tử.</li>
<li><strong>Mật độ giá trị</strong> — hàng không chở khoảng <strong>1% khối lượng thương mại thế giới nhưng hơn 35% giá trị</strong> (ước tính IATA) — nó chở phần đắt, nhẹ, gấp của thương mại.</li>
<li><strong>Đánh đổi</strong> — chi phí/kg cao nhất trong mọi phương thức; nhạy cả với trọng lượng <em>và</em> thể tích.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Tổng quan ngành &amp; vai trò trong logistics → cấu trúc ngành (hãng bay, sân bay, IATA/ICAO) → quy trình air cargo → chứng từ &amp; hải quan (AWB) → giá cước &amp; phụ phí → an ninh, an toàn &amp; hàng nguy hiểm (DGR) → đại lý giao nhận &amp; tích hợp đa phương thức → xu hướng (e-freight, bền vững) &amp; vận tải hàng không Việt Nam.</p>`,
  ]]);

const c1 = doc('gla301-1-1-overview-role', '1.1 — Air transport in the logistics chain|||1.1 — Vận tải hàng không trong chuỗi logistics',
  'Đặc điểm vận tải hàng không so với đường biển/bộ/sắt; hàng phù hợp (giá trị cao, thời gian gấp, dễ hỏng); belly cargo vs freighter.',
  [[
    `<span class="eyebrow">GLA301 · Chapter 1 · Lesson 1.1</span>
<h2>Air transport in the logistics chain</h2>
<h3>Comparing transport modes</h3>
<pre><code>Mode   | Speed     | Cost/kg  | Capacity | Typical cargo
Sea    | Slowest   | Lowest   | Huge     | Bulk, low-value, non-urgent
Rail   | Slow      | Low      | Large    | Bulk, inland, medium distance
Road   | Medium    | Medium   | Medium   | Door-to-door, short/medium haul
Air    | Fastest   | Highest  | Limited  | High-value, urgent, perishable
</code></pre>
<h3>What goes by air, and why</h3>
<ul>
<li><strong>Time-sensitive</strong> goods — spare parts keeping a factory line running, medical supplies, urgent e-commerce orders.</li>
<li><strong>Perishable</strong> goods — fresh flowers, seafood, fruit — where days matter for shelf life.</li>
<li><strong>High value-density</strong> goods — electronics, pharmaceuticals, luxury items — where the freight cost is small relative to the goods' value.</li>
</ul>
<h3>Belly cargo vs freighters</h3>
<p>Air cargo travels in two ways: <strong>belly cargo</strong> (in the hold of passenger aircraft, alongside luggage) and <strong>freighter aircraft</strong> (all-cargo, no passengers). A drop in passenger flights (as seen during 2020) directly shrinks belly capacity — cargo and passenger networks are tightly linked.</p>
<div class="callout"><span class="badge">Key figure</span> Air moves about <strong>1% of world trade by weight</strong> but <strong>&gt;35% by value</strong> (IATA) — a small, expensive, urgent slice of global trade.</div>`,
    `<span class="eyebrow">GLA301 · Chương 1 · Bài 1.1</span>
<h2>Vận tải hàng không trong chuỗi logistics</h2>
<h3>So sánh các phương thức vận tải</h3>
<pre><code>Phương thức | Tốc độ    | Chi phí/kg | Năng lực  | Hàng điển hình
Đường biển  | Chậm nhất | Thấp nhất  | Rất lớn   | Hàng rời, giá trị thấp, không gấp
Đường sắt   | Chậm      | Thấp       | Lớn       | Hàng rời, nội địa, cự ly trung
Đường bộ    | Trung bình| Trung bình | Trung bình| Door-to-door, cự ly ngắn/trung
Hàng không  | Nhanh nhất| Cao nhất   | Hạn chế   | Giá trị cao, gấp, dễ hỏng
</code></pre>
<h3>Hàng nào đi bằng máy bay, và vì sao</h3>
<ul>
<li><strong>Hàng gấp về thời gian</strong> — phụ tùng giữ dây chuyền nhà máy chạy, vật tư y tế, đơn thương mại điện tử khẩn.</li>
<li><strong>Hàng dễ hỏng</strong> — hoa tươi, hải sản, trái cây — nơi vài ngày quyết định hạn sử dụng.</li>
<li><strong>Hàng mật độ giá trị cao</strong> — điện tử, dược phẩm, hàng xa xỉ — nơi chi phí vận chuyển nhỏ so với giá trị hàng.</li>
</ul>
<h3>Belly cargo và máy bay chở hàng chuyên dụng</h3>
<p>Air cargo di chuyển theo hai cách: <strong>belly cargo</strong> (trong khoang bụng máy bay chở khách, cùng hành lý) và <strong>máy bay chở hàng (freighter)</strong> (toàn hàng, không khách). Số chuyến bay khách giảm (như năm 2020) làm giảm trực tiếp năng lực belly — mạng hàng hoá và mạng khách gắn chặt với nhau.</p>
<div class="callout"><span class="badge">Số liệu chính</span> Hàng không chở khoảng <strong>1% khối lượng thương mại thế giới</strong> nhưng <strong>&gt;35% giá trị</strong> (IATA) — một phần nhỏ, đắt, gấp của thương mại toàn cầu.</div>`,
  ]]);

const c1q = quiz('gla301-quiz-1', 'Quiz 1 — Overview & role|||Quiz 1 — Tổng quan & vai trò', [
  { id: 'q1', question: 'Vận tải hàng không phù hợp nhất với loại hàng nào?', options: ['Hàng rời, giá trị thấp', 'Hàng giá trị cao, gấp thời gian hoặc dễ hỏng', 'Hàng cồng kềnh không gấp', 'Nguyên vật liệu thô số lượng lớn'], correctIndex: 1, explanation: 'Air transport dành cho hàng giá trị cao, gấp, hoặc dễ hỏng — nơi tốc độ đáng giá hơn chi phí.' },
  { id: 'q2', question: 'Theo ước tính IATA, hàng không chở khoảng bao nhiêu % giá trị thương mại thế giới?', options: ['Khoảng 1%', 'Khoảng 10%', 'Trên 35%', 'Trên 80%'], correctIndex: 2, explanation: 'Hàng không chở ~1% khối lượng nhưng hơn 35% giá trị thương mại thế giới.' },
  { id: 'q3', question: '"Belly cargo" nghĩa là gì?', options: ['Hàng chở trên máy bay chở hàng chuyên dụng', 'Hàng chở trong khoang bụng máy bay chở khách', 'Hàng chở bằng xe tải thay máy bay', 'Hàng nguy hiểm bị cấm bay'], correctIndex: 1, explanation: 'Belly cargo là hàng hoá chở trong khoang bụng của máy bay chở khách, cùng với hành lý.' },
]);

const c2 = doc('gla301-2-1-industry-structure', '2.1 — Industry structure: airlines, airports, IATA/ICAO|||2.1 — Cấu trúc ngành: hãng bay, sân bay, IATA/ICAO',
  'Các thành phần ngành hàng không (hãng bay, sân bay, ground handler), mạng hub-and-spoke, vai trò IATA (thương mại) vs ICAO (kỹ thuật/an toàn).',
  [[
    `<span class="eyebrow">GLA301 · Chapter 2 · Lesson 2.1</span>
<h2>Industry structure: airlines, airports, IATA/ICAO</h2>
<h3>The main actors</h3>
<ul>
<li><strong>Airlines</strong> — network carriers (mixed passenger + cargo), all-cargo carriers, and low-cost carriers (mostly no cargo capacity).</li>
<li><strong>Airports</strong> — infrastructure, runways, cargo terminals; classified as <strong>hub</strong> (major connecting point) or <strong>spoke</strong> (feeds traffic to a hub).</li>
<li><strong>Ground handlers &amp; cargo terminal operators</strong> — physically load/unload, build up pallets, screen cargo.</li>
</ul>
<h3>Hub-and-spoke vs point-to-point</h3>
<p>Most air cargo moves through a <strong>hub-and-spoke</strong> network: cargo is consolidated at a hub airport and redistributed onward, maximizing aircraft utilization at the cost of transit time. <strong>Point-to-point</strong> networks fly direct but need enough demand on each route to be viable.</p>
<h3>Two organizations, two roles — do not confuse them</h3>
<pre><code>ICAO (International Civil Aviation Organization)
  - UN specialized agency (Chicago Convention, 1944)
  - Sets SAFETY and technical standards (Annexes 1-19)
  - Government-to-government

IATA (International Air Transport Association)
  - Trade association of airlines
  - Sets COMMERCIAL standards: Air Waybill format, IATA
    airport/airline codes, ticket/cargo settlement (BSP/CASS)
  - Airline-to-airline / industry self-regulation
</code></pre>
<div class="callout"><span class="badge">Memory hook</span> <strong>ICAO = rules of the sky (safety, government)</strong>. <strong>IATA = rules of the business (commerce, industry)</strong>.</div>`,
    `<span class="eyebrow">GLA301 · Chương 2 · Bài 2.1</span>
<h2>Cấu trúc ngành: hãng bay, sân bay, IATA/ICAO</h2>
<h3>Các thành phần chính</h3>
<ul>
<li><strong>Hãng bay (airlines)</strong> — hãng mạng lưới (kết hợp khách + hàng), hãng chở hàng chuyên dụng, và hãng giá rẻ (thường không có năng lực chở hàng).</li>
<li><strong>Sân bay</strong> — cơ sở hạ tầng, đường băng, ga hàng hoá; phân loại <strong>hub</strong> (điểm trung chuyển lớn) hoặc <strong>spoke</strong> (nạp luồng vào hub).</li>
<li><strong>Ground handler &amp; đơn vị khai thác ga hàng hoá</strong> — bốc/xếp hàng thực tế, đóng pallet, soi chiếu hàng.</li>
</ul>
<h3>Mạng hub-and-spoke vs điểm-đến-điểm</h3>
<p>Đa số air cargo đi qua mạng <strong>hub-and-spoke</strong>: hàng tập trung tại sân bay hub rồi phân phối tiếp, tối ưu hiệu suất máy bay nhưng đánh đổi thời gian vận chuyển. Mạng <strong>điểm-đến-điểm</strong> bay thẳng nhưng cần đủ nhu cầu trên mỗi tuyến để khả thi.</p>
<h3>Hai tổ chức, hai vai trò — không nhầm lẫn</h3>
<pre><code>ICAO (Tổ chức Hàng không Dân dụng Quốc tế)
  - Cơ quan chuyên môn của Liên Hợp Quốc (Công ước Chicago, 1944)
  - Đặt chuẩn AN TOÀN và kỹ thuật (các Annex 1-19)
  - Cấp chính phủ với chính phủ

IATA (Hiệp hội Vận tải Hàng không Quốc tế)
  - Hiệp hội thương mại của các hãng bay
  - Đặt chuẩn THƯƠNG MẠI: mẫu Air Waybill, mã sân
    bay/hãng bay IATA, thanh toán vé/hàng (BSP/CASS)
  - Hãng bay với hãng bay / tự quản của ngành
</code></pre>
<div class="callout"><span class="badge">Cách nhớ</span> <strong>ICAO = luật trên trời (an toàn, chính phủ)</strong>. <strong>IATA = luật kinh doanh (thương mại, ngành)</strong>.</div>`,
  ]]);

const c2q = quiz('gla301-quiz-2', 'Quiz 2 — Industry structure|||Quiz 2 — Cấu trúc ngành', [
  { id: 'q1', question: 'Tổ chức nào đặt chuẩn AN TOÀN kỹ thuật hàng không, cấp chính phủ với chính phủ?', options: ['IATA', 'ICAO', 'WTO', 'FIATA'], correctIndex: 1, explanation: 'ICAO là cơ quan Liên Hợp Quốc, đặt chuẩn an toàn/kỹ thuật (Công ước Chicago).' },
  { id: 'q2', question: 'IATA chịu trách nhiệm chính về?', options: ['Cấp phép bay quân sự', 'Chuẩn thương mại: mẫu AWB, mã sân bay/hãng bay, thanh toán', 'Kiểm soát không lưu', 'Xây dựng đường băng'], correctIndex: 1, explanation: 'IATA là hiệp hội thương mại — đặt chuẩn AWB, mã IATA, hệ thống thanh toán BSP/CASS.' },
  { id: 'q3', question: 'Mạng "hub-and-spoke" nghĩa là gì?', options: ['Bay thẳng mọi tuyến, không trung chuyển', 'Tập trung hàng tại một điểm trung tâm rồi phân phối tiếp', 'Chỉ dùng cho hành khách, không dùng cho hàng hoá', 'Không cần sân bay lớn'], correctIndex: 1, explanation: 'Hub-and-spoke gom hàng tại hub rồi phân phối tiếp đến các spoke, tối ưu hiệu suất khai thác.' },
]);

const c3 = doc('gla301-3-1-air-cargo-process', '3.1 — Air cargo transport & process|||3.1 — Vận tải hàng hoá hàng không & quy trình',
  'Quy trình air cargo từ đặt chỗ đến giao hàng; ULD (pallet/container); vai trò forwarder, GSA, cargo terminal.',
  [[
    `<span class="eyebrow">GLA301 · Chapter 3 · Lesson 3.1</span>
<h2>Air cargo transport &amp; process</h2>
<h3>The end-to-end flow</h3>
<pre><code>Booking (space request)
  -> Cargo acceptance (weigh, measure, document check)
  -> Build-up (loaded onto ULDs: pallets / containers)
  -> Security screening (X-ray, explosive detection)
  -> Loading onto aircraft
  -> Flight (possibly with transit/transshipment at a hub)
  -> Unloading, break-down of ULDs
  -> Customs clearance at destination
  -> Delivery to consignee
</code></pre>
<h3>ULDs — Unit Load Devices</h3>
<p>Cargo is not loaded loose; it is built onto standardized <strong>ULDs</strong> — flat <strong>pallets</strong> (secured with nets) or rigid <strong>containers</strong> (e.g. the common "LD3" size) shaped to fit an aircraft's curved hold. ULDs speed up loading/unloading and protect cargo.</p>
<h3>Key intermediaries</h3>
<ul>
<li><strong>Freight forwarder</strong> — arranges transport on behalf of the shipper, often consolidating many small shipments into one.</li>
<li><strong>General Sales Agent (GSA)</strong> — sells cargo space on behalf of an airline in a market where the airline has no local office.</li>
<li><strong>Cargo terminal operator</strong> — runs the physical warehouse/build-up facility at the airport.</li>
</ul>`,
    `<span class="eyebrow">GLA301 · Chương 3 · Bài 3.1</span>
<h2>Vận tải hàng hoá hàng không &amp; quy trình</h2>
<h3>Luồng quy trình đầu-cuối</h3>
<pre><code>Đặt chỗ (booking không gian chở hàng)
  -> Nhận hàng (cân, đo, kiểm chứng từ)
  -> Đóng hàng (xếp lên ULD: pallet / container)
  -> Soi chiếu an ninh (máy X-quang, dò chất nổ)
  -> Xếp lên máy bay
  -> Bay (có thể trung chuyển tại một hub)
  -> Dỡ hàng, tách hàng khỏi ULD
  -> Thông quan tại điểm đến
  -> Giao hàng cho người nhận
</code></pre>
<h3>ULD — Đơn vị xếp hàng chuẩn</h3>
<p>Hàng không được xếp rời; nó được đóng lên các <strong>ULD</strong> chuẩn hoá — <strong>pallet</strong> phẳng (cố định bằng lưới) hoặc <strong>container</strong> cứng (vd cỡ phổ biến "LD3") có hình dạng khớp khoang bụng cong của máy bay. ULD giúp xếp/dỡ hàng nhanh hơn và bảo vệ hàng hoá.</p>
<h3>Các trung gian chính</h3>
<ul>
<li><strong>Đại lý giao nhận (freight forwarder)</strong> — sắp xếp vận chuyển thay chủ hàng, thường gộp nhiều lô nhỏ thành một lô lớn.</li>
<li><strong>Đại lý bán hàng chung (GSA)</strong> — bán không gian chở hàng thay hãng bay ở thị trường hãng chưa có văn phòng.</li>
<li><strong>Đơn vị khai thác ga hàng hoá</strong> — vận hành nhà kho/khu đóng hàng vật lý tại sân bay.</li>
</ul>`,
  ]]);

const c3q = quiz('gla301-quiz-3', 'Quiz 3 — Air cargo process|||Quiz 3 — Quy trình air cargo', [
  { id: 'q1', question: 'ULD (Unit Load Device) dùng để làm gì?', options: ['Tính giá cước', 'Chuẩn hoá việc xếp hàng lên máy bay (pallet/container)', 'Thông quan hải quan', 'Kiểm tra an ninh hành khách'], correctIndex: 1, explanation: 'ULD là pallet/container chuẩn hoá để xếp hàng lên máy bay nhanh và an toàn hơn.' },
  { id: 'q2', question: 'Bước nào diễn ra TRƯỚC khi hàng được xếp lên máy bay?', options: ['Giao hàng cho người nhận', 'Thông quan tại điểm đến', 'Soi chiếu an ninh', 'Dỡ hàng khỏi ULD'], correctIndex: 2, explanation: 'Soi chiếu an ninh diễn ra sau đóng hàng lên ULD và trước khi xếp lên máy bay.' },
  { id: 'q3', question: 'GSA (General Sales Agent) làm gì?', options: ['Vận hành sân bay', 'Bán không gian chở hàng thay hãng bay tại thị trường chưa có văn phòng', 'Kiểm định hàng nguy hiểm', 'Thiết kế lịch bay'], correctIndex: 1, explanation: 'GSA đại diện bán cargo space cho hãng bay ở nơi hãng chưa có mặt trực tiếp.' },
]);

const c4 = doc('gla301-4-1-documents-customs', '4.1 — Documents & customs procedures: the Air Waybill|||4.1 — Chứng từ & thủ tục hải quan: Air Waybill',
  'AWB (Master/House), tính chất không chuyển nhượng; các chứng từ kèm (invoice, packing list, C/O); thủ tục hải quan hàng không.',
  [[
    `<span class="eyebrow">GLA301 · Chapter 4 · Lesson 4.1</span>
<h2>Documents &amp; customs procedures: the Air Waybill</h2>
<h3>The Air Waybill (AWB) — the core document</h3>
<p>The <strong>AWB</strong> is the contract of carriage between shipper and airline, issued in a standardized IATA format. Unlike an ocean Bill of Lading, an AWB is <strong>NOT negotiable and NOT a document of title</strong> — it cannot be traded or endorsed to transfer ownership; goods are simply released to the named consignee.</p>
<pre><code>AWB structure:
  Master AWB (MAWB) - issued by the airline to the
                        forwarder; covers the whole consolidation
  House AWB (HAWB)   - issued by the forwarder to each
                        individual shipper inside that consolidation

Set of AWB copies: typically 3 originals
  Original 1 - for the carrier (issuing airline)
  Original 2 - travels with the goods, for the consignee
  Original 3 - for the shipper (proof of contract)
</code></pre>
<h3>Supporting documents &amp; customs</h3>
<ul>
<li><strong>Commercial invoice</strong> — value and description of goods for customs valuation.</li>
<li><strong>Packing list</strong> — itemized contents, weights, dimensions.</li>
<li><strong>Certificate of origin</strong> — for preferential tariffs / trade agreements.</li>
<li><strong>Customs declaration</strong> — using the correct <strong>HS code</strong>; goods may be selected for physical inspection before release.</li>
</ul>
<div class="callout"><span class="badge">Exam trap</span> AWB ≠ Bill of Lading. AWB is a <strong>receipt + contract</strong>, not a title document — do not confuse the two on an exam.</div>`,
    `<span class="eyebrow">GLA301 · Chương 4 · Bài 4.1</span>
<h2>Chứng từ &amp; thủ tục hải quan: Air Waybill</h2>
<h3>Air Waybill (AWB) — chứng từ cốt lõi</h3>
<p><strong>AWB</strong> là hợp đồng vận chuyển giữa chủ hàng và hãng bay, phát hành theo mẫu chuẩn IATA. Khác với Bill of Lading đường biển, AWB <strong>KHÔNG chuyển nhượng được và KHÔNG phải chứng từ sở hữu</strong> — không thể mua bán hay ký hậu để chuyển quyền sở hữu; hàng đơn giản được giao cho người nhận được ghi tên.</p>
<pre><code>Cấu trúc AWB:
  Master AWB (MAWB) - hãng bay phát hành cho đại lý
                        giao nhận; bao trùm cả lô gộp
  House AWB (HAWB)   - đại lý phát hành cho từng chủ
                        hàng riêng trong lô gộp đó

Bộ bản AWB: thường 3 bản gốc
  Bản gốc 1 - cho người vận chuyển (hãng bay phát hành)
  Bản gốc 2 - đi cùng hàng, cho người nhận
  Bản gốc 3 - cho người gửi (chứng minh hợp đồng)
</code></pre>
<h3>Chứng từ kèm &amp; hải quan</h3>
<ul>
<li><strong>Hoá đơn thương mại</strong> — giá trị và mô tả hàng để hải quan định giá.</li>
<li><strong>Phiếu đóng gói</strong> — nội dung chi tiết, trọng lượng, kích thước.</li>
<li><strong>Giấy chứng nhận xuất xứ (C/O)</strong> — hưởng thuế ưu đãi / hiệp định thương mại.</li>
<li><strong>Khai báo hải quan</strong> — dùng đúng <strong>mã HS</strong>; hàng có thể bị chọn kiểm tra thực tế trước khi thông quan.</li>
</ul>
<div class="callout"><span class="badge">Bẫy thi</span> AWB ≠ Bill of Lading. AWB là <strong>biên nhận + hợp đồng</strong>, không phải chứng từ sở hữu — đừng nhầm hai loại này khi thi.</div>`,
  ]]);

const c4q = quiz('gla301-quiz-4', 'Quiz 4 — Documents & customs|||Quiz 4 — Chứng từ & hải quan', [
  { id: 'q1', question: 'AWB khác Bill of Lading đường biển ở điểm nào?', options: ['AWB có nhiều bản gốc hơn', 'AWB không chuyển nhượng được và không phải chứng từ sở hữu', 'AWB do hải quan phát hành', 'AWB chỉ dùng cho hàng nguy hiểm'], correctIndex: 1, explanation: 'AWB là biên nhận + hợp đồng, không negotiable, không phải document of title.' },
  { id: 'q2', question: 'Master AWB (MAWB) và House AWB (HAWB) khác nhau thế nào?', options: ['Không khác gì, chỉ là tên gọi khác', 'MAWB do hãng bay phát hành cho forwarder, HAWB do forwarder phát hành cho từng chủ hàng', 'HAWB chỉ dùng cho hàng nguy hiểm', 'MAWB chỉ dùng nội địa'], correctIndex: 1, explanation: 'MAWB bao trùm cả lô gộp giữa hãng bay–forwarder; HAWB là chứng từ riêng cho mỗi chủ hàng trong lô gộp.' },
  { id: 'q3', question: 'Mã nào dùng để khai báo hải quan hàng hoá theo đúng chủng loại?', options: ['Mã AWB', 'Mã HS (Harmonized System)', 'Mã ULD', 'Mã IATA sân bay'], correctIndex: 1, explanation: 'Mã HS xác định phân loại hàng hoá cho khai báo và tính thuế hải quan.' },
]);

const c5 = doc('gla301-5-1-rates-surcharges', '5.1 — Freight rates, surcharges & cost calculation|||5.1 — Giá cước, phụ phí & tính toán chi phí',
  'Trọng lượng tính cước (gross vs volumetric, hệ số 6000), cơ cấu giá cước (GCR/SCR/class rate), các phụ phí (FSC/SSC), ví dụ tính toán.',
  [[
    `<span class="eyebrow">GLA301 · Chapter 5 · Lesson 5.1</span>
<h2>Freight rates, surcharges &amp; cost calculation</h2>
<h3>Chargeable weight — the core rule</h3>
<p>Air freight is charged on whichever is <strong>higher</strong>: the actual (gross) weight, or the <strong>volumetric (dimensional) weight</strong> — because a light, bulky shipment still takes up expensive aircraft space.</p>
<pre><code>Volumetric weight (kg) = L x W x H (cm) / 6000

Example:
  Box: 60 cm x 50 cm x 40 cm = 120,000 cm3
  Volumetric weight = 120,000 / 6000 = 20 kg
  Actual gross weight = 15 kg
  -> Chargeable weight = 20 kg (the HIGHER of the two)
</code></pre>
<h3>Rate structure</h3>
<ul>
<li><strong>General Cargo Rate (GCR)</strong> — the default rate for ordinary goods, often tiered by weight break (e.g. +45kg, +100kg get a lower rate per kg).</li>
<li><strong>Specific Commodity Rate (SCR)</strong> — a discounted rate for a specific commodity moving in bulk on a specific route.</li>
<li><strong>Class rate</strong> — a percentage adjustment (surcharge or discount) to GCR for special categories (e.g. live animals, valuables).</li>
<li><strong>Minimum charge (M)</strong> — the lowest amount charged, regardless of how small the shipment is.</li>
</ul>
<h3>Surcharges on top of the base rate</h3>
<p><strong>FSC</strong> (Fuel Surcharge), <strong>SSC</strong> (Security Surcharge), war-risk surcharge, ULD/handling charges — these move with fuel price and security conditions and can be a large share of the final price.</p>
<div class="callout"><span class="badge">Rule of thumb</span> Always compute BOTH gross and volumetric weight first — quoting on gross weight alone is the most common costing mistake for bulky, light cargo.</div>`,
    `<span class="eyebrow">GLA301 · Chương 5 · Bài 5.1</span>
<h2>Giá cước, phụ phí &amp; tính toán chi phí</h2>
<h3>Trọng lượng tính cước — quy tắc cốt lõi</h3>
<p>Cước hàng không tính theo giá trị <strong>cao hơn</strong> giữa: trọng lượng thực tế (gross), hoặc <strong>trọng lượng thể tích (volumetric)</strong> — vì lô hàng nhẹ nhưng cồng kềnh vẫn chiếm không gian máy bay đắt đỏ.</p>
<pre><code>Trọng lượng thể tích (kg) = D x R x C (cm) / 6000

Ví dụ:
  Thùng: 60 cm x 50 cm x 40 cm = 120.000 cm3
  Trọng lượng thể tích = 120.000 / 6000 = 20 kg
  Trọng lượng thực tế = 15 kg
  -> Trọng lượng tính cước = 20 kg (giá trị CAO HƠN)
</code></pre>
<h3>Cơ cấu giá cước</h3>
<ul>
<li><strong>General Cargo Rate (GCR)</strong> — giá mặc định cho hàng thông thường, thường chia theo bậc trọng lượng (vd +45kg, +100kg được giá/kg thấp hơn).</li>
<li><strong>Specific Commodity Rate (SCR)</strong> — giá ưu đãi cho một loại hàng cụ thể vận chuyển khối lượng lớn trên tuyến cụ thể.</li>
<li><strong>Class rate</strong> — điều chỉnh theo tỉ lệ % (tăng hoặc giảm) so với GCR cho các nhóm đặc biệt (vd động vật sống, hàng giá trị).</li>
<li><strong>Cước tối thiểu (Minimum charge)</strong> — mức thấp nhất phải trả, bất kể lô hàng nhỏ đến đâu.</li>
</ul>
<h3>Phụ phí cộng thêm vào cước cơ bản</h3>
<p><strong>FSC</strong> (phụ phí nhiên liệu), <strong>SSC</strong> (phụ phí an ninh), phụ phí rủi ro chiến tranh, phí ULD/xử lý hàng — các phụ phí này biến động theo giá nhiên liệu và tình hình an ninh, có thể chiếm phần lớn giá cuối cùng.</p>
<div class="callout"><span class="badge">Quy tắc nhớ</span> Luôn tính CẢ trọng lượng thực tế và thể tích trước — chỉ báo giá theo trọng lượng thực tế là lỗi tính giá phổ biến nhất với hàng cồng kềnh, nhẹ.</div>`,
  ]]);

const c5q = quiz('gla301-quiz-5', 'Quiz 5 — Rates & surcharges|||Quiz 5 — Giá cước & phụ phí', [
  { id: 'q1', question: 'Một thùng 60x50x40cm, nặng thực 15kg. Trọng lượng tính cước là bao nhiêu (hệ số 6000)?', options: ['15 kg', '20 kg', '12 kg', '30 kg'], correctIndex: 1, explanation: 'Thể tích 120.000 cm3 / 6000 = 20kg > 15kg thực tế -> tính cước theo 20kg.' },
  { id: 'q2', question: 'FSC và SSC là loại chi phí gì?', options: ['Giá cước cơ bản', 'Phụ phí (nhiên liệu, an ninh) cộng thêm vào giá cơ bản', 'Thuế nhập khẩu', 'Chi phí lưu kho'], correctIndex: 1, explanation: 'FSC (fuel) và SSC (security) là các phụ phí cộng thêm vào cước cơ bản, biến động theo thị trường.' },
  { id: 'q3', question: 'Trọng lượng tính cước được lấy như thế nào giữa trọng lượng thực và thể tích?', options: ['Luôn lấy trọng lượng thực tế', 'Luôn lấy trọng lượng thể tích', 'Lấy giá trị CAO HƠN giữa hai loại', 'Lấy trung bình của hai loại'], correctIndex: 2, explanation: 'Nguyên tắc chargeable weight: luôn lấy giá trị cao hơn giữa gross và volumetric weight.' },
]);

const c6 = doc('gla301-6-1-security-safety-dgr', '6.1 — Aviation security, safety & dangerous goods (DGR)|||6.1 — An ninh, an toàn hàng không & hàng nguy hiểm (DGR)',
  'Khung an ninh hàng không (ICAO Annex 17, regulated agent), an toàn khai thác (weight & balance), 9 nhóm hàng nguy hiểm IATA DGR.',
  [[
    `<span class="eyebrow">GLA301 · Chapter 6 · Lesson 6.1</span>
<h2>Aviation security, safety &amp; dangerous goods (DGR)</h2>
<h3>Security framework</h3>
<p>Since the security tightening that followed 9/11, cargo security is governed internationally by <strong>ICAO Annex 17</strong>. Cargo must be screened (X-ray, explosive trace detection) or come from a <strong>known consignor</strong> / <strong>regulated agent</strong> whose supply chain is already vetted — this is what allows most cargo to skip a slow, full re-screening at the airport.</p>
<h3>Operational safety</h3>
<p><strong>Weight and balance</strong> calculations ensure the aircraft's center of gravity stays within safe limits — cargo cannot simply be loaded wherever there is space; load planning is a safety-critical step, not just a logistics one.</p>
<h3>Dangerous Goods Regulations (DGR)</h3>
<p>IATA's <strong>DGR</strong> classifies hazardous cargo into <strong>9 classes</strong>, each with strict packing, labeling, and documentation rules:</p>
<pre><code>Class 1 - Explosives
Class 2 - Gases (flammable, non-flammable, toxic)
Class 3 - Flammable liquids
Class 4 - Flammable solids
Class 5 - Oxidizing substances & organic peroxides
Class 6 - Toxic & infectious substances
Class 7 - Radioactive material
Class 8 - Corrosives
Class 9 - Miscellaneous (e.g. lithium batteries)
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Mis-declared or mis-packed dangerous goods (e.g. lithium batteries) have caused real cargo-aircraft accidents — DGR compliance is not paperwork, it is flight safety.</div>`,
    `<span class="eyebrow">GLA301 · Chương 6 · Bài 6.1</span>
<h2>An ninh, an toàn hàng không &amp; hàng nguy hiểm (DGR)</h2>
<h3>Khung an ninh</h3>
<p>Từ sau khi an ninh siết chặt hậu 11/9, an ninh hàng hoá được quản lý quốc tế theo <strong>ICAO Annex 17</strong>. Hàng phải được soi chiếu (X-quang, dò vết chất nổ) hoặc xuất phát từ <strong>known consignor</strong> / <strong>regulated agent</strong> — chủ hàng/đại lý đã được kiểm định chuỗi cung ứng — đây là lý do đa số hàng không cần soi chiếu lại đầy đủ, chậm chạp tại sân bay.</p>
<h3>An toàn khai thác</h3>
<p>Tính toán <strong>weight and balance</strong> (trọng lượng &amp; cân bằng) đảm bảo trọng tâm máy bay nằm trong giới hạn an toàn — hàng không thể xếp tuỳ ý ở đâu còn chỗ; lập kế hoạch xếp hàng là bước quan trọng cho an toàn bay, không chỉ là logistics.</p>
<h3>Quy định hàng nguy hiểm (DGR)</h3>
<p><strong>DGR</strong> của IATA phân loại hàng nguy hiểm thành <strong>9 nhóm</strong>, mỗi nhóm có quy định đóng gói, dán nhãn, chứng từ chặt chẽ:</p>
<pre><code>Nhóm 1 - Chất nổ
Nhóm 2 - Khí (dễ cháy, không cháy, độc)
Nhóm 3 - Chất lỏng dễ cháy
Nhóm 4 - Chất rắn dễ cháy
Nhóm 5 - Chất oxy hoá & peroxit hữu cơ
Nhóm 6 - Chất độc & lây nhiễm
Nhóm 7 - Vật liệu phóng xạ
Nhóm 8 - Chất ăn mòn
Nhóm 9 - Hàng khác (vd pin lithium)
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Hàng nguy hiểm khai sai/đóng gói sai (vd pin lithium) đã gây ra tai nạn máy bay chở hàng thực tế — tuân thủ DGR không phải giấy tờ, mà là an toàn bay.</div>`,
  ]]);

const c6q = quiz('gla301-quiz-6', 'Quiz 6 — Security, safety & DGR|||Quiz 6 — An ninh, an toàn & DGR', [
  { id: 'q1', question: 'Văn bản quốc tế nào chi phối an ninh hàng hoá hàng không?', options: ['ICAO Annex 17', 'Incoterms 2020', 'Công ước Warsaw', 'ISO 9001'], correctIndex: 0, explanation: 'ICAO Annex 17 quy định khung an ninh hàng không quốc tế, bao gồm cargo security.' },
  { id: 'q2', question: 'DGR (Dangerous Goods Regulations) của IATA phân loại hàng nguy hiểm thành mấy nhóm?', options: ['5 nhóm', '9 nhóm', '12 nhóm', '3 nhóm'], correctIndex: 1, explanation: 'IATA DGR chia hàng nguy hiểm thành 9 nhóm (Class 1-9).' },
  { id: 'q3', question: '"Weight and balance" trong khai thác hàng không dùng để làm gì?', options: ['Tính giá cước cho khách', 'Đảm bảo trọng tâm máy bay trong giới hạn an toàn khi xếp hàng', 'Kiểm tra hải quan', 'Xếp hạng hãng bay'], correctIndex: 1, explanation: 'Weight and balance là bước an toàn bắt buộc để giữ trọng tâm máy bay an toàn khi chất xếp hàng/khách.' },
]);

const c7 = doc('gla301-7-1-forwarders-multimodal', '7.1 — Freight forwarders & multimodal integration|||7.1 — Đại lý giao nhận & tích hợp đa phương thức',
  'Vai trò forwarder như "indirect carrier", consolidation, GSA/GSSA; Road Feeder Service (RFS); tích hợp air-sea/air-road.',
  [[
    `<span class="eyebrow">GLA301 · Chapter 7 · Lesson 7.1</span>
<h2>Freight forwarders &amp; multimodal integration</h2>
<h3>The freight forwarder as "indirect carrier"</h3>
<p>A <strong>freight forwarder</strong> does not own aircraft, but acts as an intermediary that arranges the whole movement for the shipper: booking space, consolidating many small shipments into one larger one (splitting the discount between shipments), preparing documents, and coordinating customs. This role is sometimes called an <strong>indirect carrier</strong>, because the forwarder issues its own House AWB while buying space under a single Master AWB.</p>
<h3>GSA / GSSA</h3>
<p>A <strong>General Sales Agent (GSA)</strong> — often called <strong>GSSA</strong> for cargo — represents an airline commercially in a market, selling its cargo capacity without the airline needing its own local sales office.</p>
<h3>Multimodal integration: Road Feeder Service (RFS)</h3>
<p>Not every leg of an "air" shipment actually flies. A <strong>Road Feeder Service (RFS)</strong> uses trucks — under the same AWB — to move cargo between nearby airports or from an inland point to a gateway airport, replacing a short, uneconomical flight. This is a core example of <strong>air-road multimodal</strong> integration; air-sea (sea-air) combinations also exist for cost/speed trade-offs on long routes.</p>
<div class="callout"><span class="badge">Exam trap</span> A shipment moved partly by truck under an AWB is still an <strong>air shipment</strong> commercially (RFS) — the AWB, not the physical vehicle, defines the mode of contract.</div>`,
    `<span class="eyebrow">GLA301 · Chương 7 · Bài 7.1</span>
<h2>Đại lý giao nhận &amp; tích hợp đa phương thức</h2>
<h3>Freight forwarder — "người vận chuyển gián tiếp"</h3>
<p><strong>Đại lý giao nhận (freight forwarder)</strong> không sở hữu máy bay, nhưng đóng vai trò trung gian sắp xếp toàn bộ quá trình vận chuyển cho chủ hàng: đặt chỗ, gộp nhiều lô nhỏ thành một lô lớn hơn (chia sẻ mức giá ưu đãi giữa các lô), chuẩn bị chứng từ, và điều phối hải quan. Vai trò này còn được gọi là <strong>indirect carrier</strong> (người vận chuyển gián tiếp), vì forwarder phát hành House AWB riêng trong khi mua không gian dưới một Master AWB chung.</p>
<h3>GSA / GSSA</h3>
<p><strong>General Sales Agent (GSA)</strong> — với hàng hoá thường gọi là <strong>GSSA</strong> — đại diện thương mại cho một hãng bay tại một thị trường, bán năng lực chở hàng của hãng mà hãng không cần văn phòng bán hàng riêng tại đó.</p>
<h3>Tích hợp đa phương thức: Road Feeder Service (RFS)</h3>
<p>Không phải mọi đoạn của một lô hàng "air" đều thực sự bay. <strong>Road Feeder Service (RFS)</strong> dùng xe tải — vẫn dưới cùng một AWB — để chuyển hàng giữa các sân bay gần nhau hoặc từ điểm nội địa đến sân bay cửa ngõ, thay cho một chuyến bay ngắn không kinh tế. Đây là ví dụ cốt lõi của tích hợp <strong>đa phương thức air-road</strong>; kết hợp air-sea (sea-air) cũng tồn tại để đánh đổi chi phí/tốc độ trên tuyến dài.</p>
<div class="callout"><span class="badge">Bẫy thi</span> Một lô hàng được vận chuyển một phần bằng xe tải dưới AWB vẫn là <strong>lô hàng air</strong> về mặt thương mại (RFS) — AWB, không phải phương tiện vật lý, quyết định phương thức hợp đồng.</div>`,
  ]]);

const c7q = quiz('gla301-quiz-7', 'Quiz 7 — Forwarders & multimodal|||Quiz 7 — Đại lý giao nhận & đa phương thức', [
  { id: 'q1', question: 'Vì sao freight forwarder được gọi là "indirect carrier"?', options: ['Vì họ sở hữu máy bay riêng', 'Vì họ phát hành House AWB riêng trong khi mua không gian dưới một Master AWB chung', 'Vì họ chỉ làm hàng nội địa', 'Vì họ không cần chứng từ'], correctIndex: 1, explanation: 'Forwarder không có máy bay nhưng phát hành HAWB của mình dưới một MAWB — nên gọi là indirect carrier.' },
  { id: 'q2', question: 'GSA/GSSA làm gì cho một hãng bay?', options: ['Lái máy bay thay hãng', 'Đại diện bán năng lực chở hàng của hãng tại một thị trường', 'Kiểm định an toàn bay', 'Thiết kế lịch trình bay'], correctIndex: 1, explanation: 'GSA/GSSA bán cargo space thay hãng bay ở nơi hãng chưa có văn phòng riêng.' },
  { id: 'q3', question: 'Road Feeder Service (RFS) là gì?', options: ['Dịch vụ giao hàng cuối cùng bằng xe máy', 'Dùng xe tải thay một đoạn bay ngắn, vẫn dưới cùng một AWB', 'Một loại hàng nguy hiểm', 'Phụ phí an ninh'], correctIndex: 1, explanation: 'RFS dùng xe tải để thay thế đoạn bay ngắn không kinh tế, vẫn nằm trong hợp đồng AWB.' },
]);

const c8 = doc('gla301-8-1-trends-vietnam', '8.1 — Trends (e-freight, sustainability) & air transport in Vietnam|||8.1 — Xu hướng (e-freight, bền vững) & vận tải hàng không Việt Nam',
  'e-AWB/e-freight (số hoá), nhiên liệu bền vững (SAF) & CORSIA; hàng không Việt Nam: sân bay, hãng bay, Long Thành, air cargo thương mại điện tử.',
  [[
    `<span class="eyebrow">GLA301 · Chapter 8 · Lesson 8.1</span>
<h2>Trends (e-freight, sustainability) &amp; air transport in Vietnam</h2>
<h3>Digitalization: e-freight / e-AWB</h3>
<p>IATA's <strong>e-freight</strong> initiative replaces the traditional paper AWB and its stack of accompanying documents with electronic data (<strong>e-AWB</strong>), cutting processing time and errors. Industry data-sharing standards (e.g. <strong>Cargo iQ</strong>) track shipment milestones end-to-end for better visibility.</p>
<h3>Sustainability</h3>
<p><strong>Sustainable Aviation Fuel (SAF)</strong> — made from waste, biomass or synthetic feedstocks — is the main near-term lever to cut aviation's carbon footprint, since aircraft cannot yet be electrified at scale. <strong>CORSIA</strong> (Carbon Offsetting and Reduction Scheme for International Aviation, an ICAO program) requires airlines to offset emissions growth above a baseline.</p>
<h3>Air transport in Vietnam</h3>
<ul>
<li><strong>Airports</strong> — Noi Bai (Hanoi) and Tan Son Nhat (Ho Chi Minh City) are the two main gateways; <strong>Long Thanh International Airport</strong> (under construction, planned to open in phases from 2026) is designed as a major new cargo &amp; passenger hub for the south.</li>
<li><strong>Airlines</strong> — Vietnam Airlines, VietJet, Bamboo Airways operate mixed passenger/belly-cargo networks; dedicated freighter capacity remains limited compared to regional hubs like Singapore or Hong Kong.</li>
<li><strong>Driver of growth</strong> — cross-border e-commerce (consumer parcels from China and beyond) has become a major and fast-growing source of air cargo volume into and through Vietnam.</li>
</ul>
<div class="callout"><span class="badge">Takeaway</span> Vietnam's air cargo growth is now driven less by traditional manufacturing exports and more by <strong>e-commerce parcel volume</strong> — a structural shift worth watching for logistics careers.</div>`,
    `<span class="eyebrow">GLA301 · Chương 8 · Bài 8.1</span>
<h2>Xu hướng (e-freight, bền vững) &amp; vận tải hàng không Việt Nam</h2>
<h3>Số hoá: e-freight / e-AWB</h3>
<p>Sáng kiến <strong>e-freight</strong> của IATA thay AWB giấy truyền thống và cả chồng chứng từ kèm bằng dữ liệu điện tử (<strong>e-AWB</strong>), giảm thời gian xử lý và sai sót. Chuẩn chia sẻ dữ liệu của ngành (vd <strong>Cargo iQ</strong>) theo dõi các mốc vận chuyển đầu-cuối để tăng khả năng hiển thị.</p>
<h3>Bền vững</h3>
<p><strong>Nhiên liệu hàng không bền vững (SAF)</strong> — sản xuất từ chất thải, sinh khối hoặc nguyên liệu tổng hợp — là công cụ chính trong ngắn hạn để giảm phát thải carbon của hàng không, vì máy bay chưa thể điện hoá ở quy mô lớn. <strong>CORSIA</strong> (Chương trình Bù đắp và Giảm phát thải Carbon cho Hàng không Quốc tế, một chương trình của ICAO) yêu cầu hãng bay bù đắp phần phát thải tăng vượt mức nền.</p>
<h3>Vận tải hàng không tại Việt Nam</h3>
<ul>
<li><strong>Sân bay</strong> — Nội Bài (Hà Nội) và Tân Sơn Nhất (TP.HCM) là hai cửa ngõ chính; <strong>Sân bay quốc tế Long Thành</strong> (đang xây, dự kiến khai thác theo giai đoạn từ 2026) được thiết kế thành hub hàng hoá &amp; hành khách lớn mới cho khu vực phía Nam.</li>
<li><strong>Hãng bay</strong> — Vietnam Airlines, VietJet, Bamboo Airways vận hành mạng lưới kết hợp khách/belly-cargo; năng lực freighter chuyên dụng còn hạn chế so với các hub khu vực như Singapore hay Hong Kong.</li>
<li><strong>Động lực tăng trưởng</strong> — thương mại điện tử xuyên biên giới (đơn hàng tiêu dùng từ Trung Quốc và các nước khác) đã trở thành nguồn tăng trưởng khối lượng air cargo lớn và nhanh vào và qua Việt Nam.</li>
</ul>
<div class="callout"><span class="badge">Điểm chốt</span> Tăng trưởng air cargo Việt Nam hiện được dẫn dắt ít hơn bởi xuất khẩu sản xuất truyền thống và nhiều hơn bởi <strong>khối lượng đơn hàng thương mại điện tử</strong> — một dịch chuyển cơ cấu đáng theo dõi cho nghề nghiệp logistics.</div>`,
  ]]);

const c8q = quiz('gla301-quiz-8', 'Quiz 8 — Trends & Vietnam|||Quiz 8 — Xu hướng & Việt Nam', [
  { id: 'q1', question: 'e-AWB thay thế điều gì?', options: ['Hệ thống soi chiếu an ninh', 'AWB giấy và chứng từ kèm bằng dữ liệu điện tử', 'Mã HS hải quan', 'ULD'], correctIndex: 1, explanation: 'e-freight/e-AWB số hoá AWB và chứng từ kèm, giảm giấy tờ và sai sót.' },
  { id: 'q2', question: 'SAF (Sustainable Aviation Fuel) và CORSIA liên quan đến vấn đề gì?', options: ['Tính giá cước', 'Giảm phát thải carbon của hàng không', 'Phân loại hàng nguy hiểm', 'Bảo hiểm hàng hoá'], correctIndex: 1, explanation: 'SAF là nhiên liệu ít phát thải; CORSIA là chương trình ICAO yêu cầu bù đắp phát thải tăng thêm.' },
  { id: 'q3', question: 'Động lực tăng trưởng chính của air cargo Việt Nam gần đây là gì?', options: ['Xuất khẩu nông sản truyền thống', 'Thương mại điện tử xuyên biên giới', 'Vận tải quân sự', 'Du lịch nội địa'], correctIndex: 1, explanation: 'Thương mại điện tử xuyên biên giới (đơn hàng tiêu dùng) là nguồn tăng trưởng air cargo nhanh vào/qua Việt Nam.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'GLA301',
    slug: 'gla301-air-transport',
    title: 'Air Transport',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/GLA301.webp',
    shortDescription: 'Air transport in logistics: industry structure (IATA/ICAO), air cargo process, AWB & customs, rates & surcharges, security & dangerous goods (DGR), forwarders & multimodal, e-freight & Vietnam. Bilingual, with quizzes.|||Vận tải hàng không trong logistics: cấu trúc ngành (IATA/ICAO), quy trình air cargo, AWB & hải quan, giá cước & phụ phí, an ninh & hàng nguy hiểm (DGR), đại lý giao nhận & đa phương thức, e-freight & Việt Nam. Song ngữ, có quiz.',
    description: 'Môn <strong>GLA301 — Air Transport</strong> (Vận tải hàng không, kỳ 4, khối Quản trị Kinh doanh) giúp hiểu vai trò vận tải hàng không trong <strong>logistics và chuỗi cung ứng</strong>. Từ <strong>tổng quan ngành</strong> (belly cargo, freighter) → <strong>cấu trúc ngành</strong> (hãng bay, sân bay, IATA/ICAO) → <strong>quy trình air cargo</strong> (ULD, forwarder, GSA) → <strong>chứng từ &amp; hải quan</strong> (AWB) → <strong>giá cước &amp; phụ phí</strong> (trọng lượng tính cước, FSC/SSC) → <strong>an ninh, an toàn &amp; hàng nguy hiểm (DGR)</strong> → <strong>đại lý giao nhận &amp; đa phương thức</strong> (RFS) → <strong>xu hướng &amp; vận tải hàng không Việt Nam</strong> (e-freight, SAF, Long Thành). Trích dẫn "Air Transport Management" (Wittmer/Bieger), tài liệu IATA, "Global Logistics and Supply Chain Management" (Mangan). Song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Vai trò vận tải hàng không trong logistics (belly cargo/freighter); cấu trúc ngành, IATA vs ICAO, mạng hub-and-spoke; quy trình air cargo & ULD; Air Waybill (Master/House), chứng từ & thủ tục hải quan; trọng lượng tính cước (gross vs volumetric), cơ cấu giá cước & phụ phí; an ninh hàng không, weight & balance, 9 nhóm hàng nguy hiểm (DGR); vai trò freight forwarder/GSA & Road Feeder Service; e-freight, SAF/CORSIA, và vận tải hàng không Việt Nam.',
    requirements: 'Kiến thức nền về logistics/chuỗi cung ứng (tương đương môn nhập môn logistics). Nên đọc trước tài liệu IATA cơ bản về AWB.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình (Wittmer/Bieger, Mangan), tài liệu IATA/ICAO, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vận tải hàng không trong logistics, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & vai trò|||Chapter 1 — Overview & role', description: 'Đặc điểm vận tải hàng không, hàng phù hợp, belly cargo/freighter.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Cấu trúc ngành|||Chapter 2 — Industry structure', description: 'Hãng bay, sân bay, hub-and-spoke, IATA vs ICAO.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Vận tải hàng hoá & quy trình|||Chapter 3 — Air cargo & process', description: 'Quy trình air cargo, ULD, forwarder, GSA.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Chứng từ & hải quan|||Chapter 4 — Documents & customs', description: 'Air Waybill (Master/House), chứng từ kèm, thủ tục hải quan.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Giá cước & phụ phí|||Chapter 5 — Rates & surcharges', description: 'Trọng lượng tính cước, cơ cấu giá, phụ phí, ví dụ tính toán.', lessons: [c5, c5q] },
    { title: 'Chương 6 — An ninh, an toàn & hàng nguy hiểm|||Chapter 6 — Security, safety & DGR', description: 'Khung an ninh, weight & balance, 9 nhóm DGR.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Đại lý giao nhận & đa phương thức|||Chapter 7 — Forwarders & multimodal', description: 'Forwarder, GSA/GSSA, Road Feeder Service.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Xu hướng & Việt Nam|||Chapter 8 — Trends & Vietnam', description: 'e-freight, SAF/CORSIA, vận tải hàng không Việt Nam.', lessons: [c8, c8q] },
  ],
};
