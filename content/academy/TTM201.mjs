/**
 * TTM201 — Tourism and Travel Management. Nhập môn tổng quan ngành du lịch
 * (syl): hệ thống du lịch, tour operator/travel agency, thiết kế & điều hành
 * tour, vận chuyển & lưu trú, marketing du lịch, chất lượng dịch vụ, tác động
 * & bền vững/số hoá. Trích: Cooper/Fletcher/Fyall "Tourism: Principles and
 * Practice", Holloway "The Business of Tourism", UNWTO. Song ngữ + quiz.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ttm201-0-0-tai-lieu', 'Course materials & references|||Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình chính (Cooper et al., Holloway), tổ chức chính thức (UNWTO, WTTC, IATA), tin ngành, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">TTM201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Tourism and Travel Management — the tourism system, tour operators &amp; agencies, marketing, service quality and sustainability — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal references.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><em>Tourism: Principles and Practice</em> — Cooper, Fletcher, Fyall, Gilbert &amp; Wanhill (Pearson) — the main reference for this course.</li>
<li><em>The Business of Tourism</em> — J. Christopher Holloway &amp; Claire Humphreys — practical, industry-operations focused.</li>
</ul>
<h3>🌐 Official organizations</h3>
<ul>
<li><a href="https://www.unwto.org/" target="_blank" rel="noopener">UNWTO — UN World Tourism Organization</a> — definitions, glossary, global tourism statistics.</li>
<li><a href="https://wttc.org/" target="_blank" rel="noopener">WTTC — World Travel &amp; Tourism Council</a> — economic impact research (GDP, jobs).</li>
<li><a href="https://www.iata.org/" target="_blank" rel="noopener">IATA — International Air Transport Association</a> — air transport standards &amp; data.</li>
</ul>
<h3>📰 Industry news</h3>
<ul>
<li><a href="https://skift.com/" target="_blank" rel="noopener">Skift</a> — global travel industry news &amp; research.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li>UNWTO Tourism Data Dashboard — arrivals &amp; receipts by country/region.</li>
<li>Booking.com / TripAdvisor listings — study real pricing, positioning &amp; reviews of hotels and tours.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — tourism definitions, the tourism system, tour operator vs travel agency.</li>
<li><strong>Practice</strong> — read a real package tour itinerary and a hotel OTA listing; map each part back to the concepts.</li>
<li><strong>Go deeper</strong> — marketing mix (7Ps), service quality (SERVQUAL), destination case studies.</li>
<li><strong>Job-ready</strong> — read UNWTO/WTTC reports, follow Skift, understand sustainability &amp; policy debates.</li>
</ol></div>`,
    `<span class="eyebrow">TTM201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Quản trị Du lịch &amp; Lữ hành — hệ thống du lịch, doanh nghiệp lữ hành &amp; đại lý, marketing, chất lượng dịch vụ và bền vững — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình chính</h3>
<ul>
<li><em>Tourism: Principles and Practice</em> — Cooper, Fletcher, Fyall, Gilbert &amp; Wanhill (Pearson) — tài liệu tham khảo chính của môn.</li>
<li><em>The Business of Tourism</em> — J. Christopher Holloway &amp; Claire Humphreys — hướng thực tiễn, vận hành ngành.</li>
</ul>
<h3>🌐 Tổ chức chính thức</h3>
<ul>
<li><a href="https://www.unwto.org/" target="_blank" rel="noopener">UNWTO — Tổ chức Du lịch Thế giới của LHQ</a> — định nghĩa, thuật ngữ, thống kê du lịch toàn cầu.</li>
<li><a href="https://wttc.org/" target="_blank" rel="noopener">WTTC — Hội đồng Du lịch &amp; Lữ hành Thế giới</a> — nghiên cứu tác động kinh tế (GDP, việc làm).</li>
<li><a href="https://www.iata.org/" target="_blank" rel="noopener">IATA — Hiệp hội Vận tải Hàng không Quốc tế</a> — chuẩn &amp; dữ liệu vận tải hàng không.</li>
</ul>
<h3>📰 Tin ngành</h3>
<ul>
<li><a href="https://skift.com/" target="_blank" rel="noopener">Skift</a> — tin tức &amp; nghiên cứu ngành du lịch toàn cầu.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li>UNWTO Tourism Data Dashboard — lượt khách &amp; doanh thu theo quốc gia/khu vực.</li>
<li>Danh sách trên Booking.com / TripAdvisor — nghiên cứu giá, định vị &amp; đánh giá thật của khách sạn, tour.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — định nghĩa du lịch, hệ thống du lịch, tour operator so với travel agency.</li>
<li><strong>Luyện tập</strong> — đọc một lịch trình tour thật và một trang OTA khách sạn; đối chiếu từng phần với khái niệm đã học.</li>
<li><strong>Đào sâu</strong> — marketing mix (7P), chất lượng dịch vụ (SERVQUAL), case study điểm đến.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc báo cáo UNWTO/WTTC, theo dõi Skift, hiểu tranh luận về bền vững &amp; chính sách.</li>
</ol></div>`,
  ]]);

const intro = doc('ttm201-0-1-overview', 'Course overview: Tourism and Travel Management|||Tổng quan: Quản trị Du lịch & Lữ hành',
  'Du lịch là gì (UNWTO), vì sao ngành quan trọng, lộ trình 8 chương từ tổng quan đến bền vững & số hoá.',
  [[
    `<span class="eyebrow">TTM201 · Lesson 0.1 · Overview</span>
<h2>Tourism and Travel Management</h2>
<p class="lead">This course introduces the <strong>tourism and travel industry</strong> as a system of interconnected businesses and stakeholders — destinations, tour operators, travel agencies, transport and accommodation providers — that together create the experience a tourist buys.</p>
<h3>What is tourism?</h3>
<p>By the <strong>UNWTO</strong> definition, tourism is the activity of people traveling to and staying in places outside their usual environment for no more than 12 consecutive months, for leisure, business or other purposes not remunerated by an entity in the place visited.</p>
<h3>Why it matters</h3>
<p>Tourism is one of the world's largest economic sectors — a major source of jobs, foreign exchange and regional development, but also a sector with real socio-cultural and environmental impact that must be managed.</p>
<h3>Roadmap</h3>
<p>The tourism system &amp; its components → tour operators &amp; travel agencies → tour design &amp; operations → transport &amp; accommodation → tourism marketing → service quality &amp; guest experience → impacts, policy, sustainability &amp; digitalization. Bilingual, with a quiz per chapter.</p>`,
    `<span class="eyebrow">TTM201 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị Du lịch &amp; Lữ hành</h2>
<p class="lead">Môn này giới thiệu <strong>ngành du lịch &amp; lữ hành</strong> như một hệ thống các doanh nghiệp và bên liên quan gắn kết với nhau — điểm đến, doanh nghiệp lữ hành, đại lý du lịch, đơn vị vận chuyển và lưu trú — cùng tạo ra trải nghiệm mà khách du lịch mua.</p>
<h3>Du lịch là gì?</h3>
<p>Theo định nghĩa của <strong>UNWTO</strong>, du lịch là hoạt động của người di chuyển tới và lưu lại nơi ngoài môi trường sống thường xuyên của họ không quá 12 tháng liên tục, vì mục đích giải trí, công việc hoặc mục đích khác không phải được trả lương bởi một tổ chức tại nơi đến.</p>
<h3>Vì sao ngành quan trọng</h3>
<p>Du lịch là một trong những ngành kinh tế lớn nhất thế giới — nguồn việc làm, ngoại tệ và phát triển vùng quan trọng, nhưng cũng là ngành có tác động xã hội-văn hoá và môi trường thật cần được quản trị.</p>
<h3>Lộ trình</h3>
<p>Hệ thống du lịch &amp; các thành phần → doanh nghiệp lữ hành &amp; đại lý du lịch → thiết kế &amp; điều hành tour → vận chuyển &amp; lưu trú → marketing du lịch → chất lượng dịch vụ &amp; trải nghiệm khách → tác động, chính sách, bền vững &amp; số hoá. Song ngữ, có quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('ttm201-1-1-overview-concepts', '1.1 — Tourism industry overview & core concepts|||1.1 — Tổng quan ngành du lịch & khái niệm cơ bản',
  'Định nghĩa du lịch (UNWTO), khách du lịch vs khách tham quan, du lịch nội địa/đến/ra ngoài, mô hình 5A điểm đến.',
  [[
    `<span class="eyebrow">TTM201 · Chapter 1 · Lesson 1.1</span>
<h2>Tourism industry overview &amp; core concepts</h2>
<h3>What is "tourism"?</h3>
<p>By the <strong>UNWTO</strong> definition, tourism is the activity of people traveling to and staying in places <em>outside their usual environment</em> for leisure, business or other purposes, for <strong>no more than 12 consecutive months</strong>, and not for an activity remunerated by an entity in the place visited.</p>
<h3>Visitor, tourist, excursionist</h3>
<ul>
<li><strong>Visitor</strong> — the umbrella term for anyone traveling outside their usual environment.</li>
<li><strong>Tourist</strong> — a visitor who stays <strong>overnight</strong> (at least one night) at the destination.</li>
<li><strong>Excursionist / same-day visitor</strong> — a visitor who does <strong>not</strong> stay overnight (e.g. a day-trip, a cruise passenger ashore for a few hours).</li>
</ul>
<h3>Three forms of tourism</h3>
<pre><code>Domestic tourism   -> residents traveling within their own country
Inbound tourism    -> non-residents traveling INTO a country
Outbound tourism   -> residents traveling OUT to another country
</code></pre>
<h3>The 5 A's of a destination</h3>
<ul>
<li><strong>Attractions</strong> — the reason to visit (natural, cultural, man-made, events).</li>
<li><strong>Accessibility</strong> — how visitors reach and move around the destination (flights, roads, visas).</li>
<li><strong>Accommodation</strong> — where visitors stay (hotels, resorts, homestays).</li>
<li><strong>Amenities</strong> — supporting services (food, shops, banks, medical care).</li>
<li><strong>Activities</strong> — what visitors do once there (tours, sports, entertainment).</li>
</ul>
<div class="callout"><span class="badge">Why the definitions matter</span> National tourism statistics (arrivals, receipts) are built directly on these definitions — get "tourist" vs "excursionist" wrong and the numbers are not comparable across countries.</div>`,
    `<span class="eyebrow">TTM201 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan ngành du lịch &amp; khái niệm cơ bản</h2>
<h3>Du lịch là gì?</h3>
<p>Theo định nghĩa của <strong>UNWTO</strong>, du lịch là hoạt động của người di chuyển và lưu lại tại nơi <em>ngoài môi trường sống thường xuyên</em> vì mục đích giải trí, công việc hoặc mục đích khác, không quá <strong>12 tháng liên tục</strong>, và không phải hoạt động được trả lương bởi một tổ chức tại nơi đến.</p>
<h3>Visitor, tourist, excursionist</h3>
<ul>
<li><strong>Visitor (khách)</strong> — thuật ngữ chung cho bất kỳ ai di chuyển ra ngoài môi trường sống thường xuyên.</li>
<li><strong>Tourist (khách du lịch)</strong> — visitor có ở lại <strong>qua đêm</strong> (ít nhất một đêm) tại điểm đến.</li>
<li><strong>Excursionist / khách tham quan trong ngày</strong> — visitor <strong>không</strong> ở lại qua đêm (vd đi trong ngày, khách du thuyền lên bờ vài giờ).</li>
</ul>
<h3>Ba hình thức du lịch</h3>
<pre><code>Du lịch nội địa (domestic)  -> cư dân di chuyển trong nước mình
Du lịch đến (inbound)       -> người không cư trú đi VÀO một quốc gia
Du lịch ra ngoài (outbound) -> cư dân đi RA một quốc gia khác
</code></pre>
<h3>Mô hình 5A của điểm đến</h3>
<ul>
<li><strong>Attractions (điểm hấp dẫn)</strong> — lý do để đến (tự nhiên, văn hoá, nhân tạo, sự kiện).</li>
<li><strong>Accessibility (khả năng tiếp cận)</strong> — cách khách đến và di chuyển tại điểm đến (chuyến bay, đường bộ, visa).</li>
<li><strong>Accommodation (lưu trú)</strong> — nơi khách ở lại (khách sạn, resort, homestay).</li>
<li><strong>Amenities (tiện ích)</strong> — dịch vụ hỗ trợ (ăn uống, mua sắm, ngân hàng, y tế).</li>
<li><strong>Activities (hoạt động)</strong> — những gì khách làm khi tới nơi (tour, thể thao, giải trí).</li>
</ul>
<div class="callout"><span class="badge">Vì sao định nghĩa quan trọng</span> Thống kê du lịch quốc gia (lượt khách, doanh thu) được xây trực tiếp từ các định nghĩa này — nhầm "tourist" với "excursionist" là số liệu không còn so sánh được giữa các nước.</div>`,
  ]]);

const c1q = quiz('ttm201-quiz-1', 'Quiz 1 — Overview & concepts|||Quiz 1 — Tổng quan & khái niệm', [
  { id: 'q1', question: 'Theo định nghĩa UNWTO, một người được gọi là "khách du lịch" (tourist) khi nào?', options: ['Ở lại điểm đến ít nhất một đêm', 'Chỉ đi trong ngày, không ngủ lại', 'Đi công tác được trả lương tại nơi đến', 'Đi quá 12 tháng liên tục'], correctIndex: 0, explanation: 'Tourist là visitor có ở lại qua đêm (ít nhất 1 đêm); dưới 1 đêm gọi là excursionist/khách tham quan trong ngày.' },
  { id: 'q2', question: 'Một khách đi du lịch ra nước ngoài (rời khỏi nước mình) thuộc hình thức du lịch nào?', options: ['Du lịch nội địa (domestic)', 'Du lịch đến (inbound)', 'Du lịch ra ngoài (outbound)', 'Du lịch trong ngày'], correctIndex: 2, explanation: 'Outbound tourism: cư dân một nước đi ra nước ngoài.' },
  { id: 'q3', question: 'Yếu tố nào trong mô hình 5A của điểm đến chỉ "cách khách đến và di chuyển trong điểm đến"?', options: ['Attractions', 'Accessibility', 'Amenities', 'Activities'], correctIndex: 1, explanation: 'Accessibility là khả năng tiếp cận: chuyến bay, đường bộ, visa...' },
]);

const c2 = doc('ttm201-2-1-tourism-system', '2.1 — The tourism system & its components|||2.1 — Hệ thống du lịch & các thành phần',
  'Mô hình hệ thống du lịch (Cooper et al.): cầu (khách) và cung (điểm đến, trung gian, vận chuyển, lưu trú); chuỗi giá trị du lịch.',
  [[
    `<span class="eyebrow">TTM201 · Chapter 2 · Lesson 2.1</span>
<h2>The tourism system &amp; its components</h2>
<p>Tourism is best understood as a <strong>system</strong>: a demand side (tourists, with needs and motivations) connected to a supply side (destinations and the businesses that serve them) through <strong>intermediaries</strong> and <strong>transport</strong>.</p>
<pre><code>DEMAND                         SUPPLY
(tourists / markets)  ---->    Intermediaries (tour operators, travel agents, OTAs)
                       ---->    Transport (air, rail, road, water)
                       ---->    Destination
                                  - Attractions
                                  - Accommodation
                                  - Amenities / local services
</code></pre>
<h3>The five supply-side components</h3>
<ul>
<li><strong>Destination</strong> — the place with attractions that pulls visitors in.</li>
<li><strong>Intermediaries</strong> — tour operators and travel agents (including online travel agencies, OTAs) who package and distribute travel products.</li>
<li><strong>Transport</strong> — moves tourists between origin and destination, and within it.</li>
<li><strong>Accommodation</strong> — hotels, resorts, homestays, and other places to stay.</li>
<li><strong>Support services</strong> — food &amp; beverage, retail, guiding, insurance, finance (currency exchange, payments).</li>
</ul>
<h3>Tourism value chain</h3>
<p>Value is created and captured across the chain: <strong>marketing/booking → transport → destination services → accommodation → experience → post-trip (reviews, repeat visits)</strong>. Each link can be run by a different business, which is why coordination between them — and between the public and private sector — matters so much in tourism.</p>
<div class="callout"><span class="badge">One system, many owners</span> Unlike a factory, no single company owns the whole tourism "product" a tourist experiences — the flight, the hotel, the attraction and the local guide are usually four different businesses. Quality has to be coordinated, not just controlled.</div>`,
    `<span class="eyebrow">TTM201 · Chương 2 · Bài 2.1</span>
<h2>Hệ thống du lịch &amp; các thành phần</h2>
<p>Du lịch được hiểu tốt nhất như một <strong>hệ thống</strong>: bên cầu (khách du lịch, với nhu cầu và động cơ) kết nối với bên cung (điểm đến và các doanh nghiệp phục vụ) thông qua <strong>trung gian</strong> và <strong>vận chuyển</strong>.</p>
<pre><code>CẦU                            CUNG
(khách du lịch / thị trường) -> Trung gian (tour operator, travel agent, OTA)
                              -> Vận chuyển (hàng không, đường sắt, đường bộ, đường thuỷ)
                              -> Điểm đến
                                  - Điểm hấp dẫn (attractions)
                                  - Lưu trú
                                  - Tiện ích / dịch vụ địa phương
</code></pre>
<h3>Năm thành phần bên cung</h3>
<ul>
<li><strong>Điểm đến</strong> — nơi có điểm hấp dẫn kéo khách đến.</li>
<li><strong>Trung gian</strong> — tour operator và đại lý du lịch (kể cả đại lý trực tuyến, OTA) đóng gói và phân phối sản phẩm du lịch.</li>
<li><strong>Vận chuyển</strong> — đưa khách giữa nơi xuất phát và điểm đến, và di chuyển trong điểm đến.</li>
<li><strong>Lưu trú</strong> — khách sạn, resort, homestay và các nơi ở khác.</li>
<li><strong>Dịch vụ hỗ trợ</strong> — ăn uống, bán lẻ, hướng dẫn, bảo hiểm, tài chính (đổi ngoại tệ, thanh toán).</li>
</ul>
<h3>Chuỗi giá trị du lịch</h3>
<p>Giá trị được tạo ra và thu về theo chuỗi: <strong>marketing/đặt dịch vụ → vận chuyển → dịch vụ tại điểm đến → lưu trú → trải nghiệm → hậu chuyến đi (đánh giá, quay lại)</strong>. Mỗi mắt xích có thể do một doanh nghiệp khác nhau vận hành, đó là lý do sự phối hợp giữa họ — và giữa nhà nước với tư nhân — quan trọng đến vậy trong du lịch.</p>
<div class="callout"><span class="badge">Một hệ thống, nhiều chủ sở hữu</span> Khác với một nhà máy, không một công ty nào sở hữu toàn bộ "sản phẩm" du lịch mà khách trải nghiệm — chuyến bay, khách sạn, điểm tham quan và hướng dẫn viên địa phương thường thuộc bốn doanh nghiệp khác nhau. Chất lượng phải được phối hợp, không chỉ kiểm soát nội bộ.</div>`,
  ]]);

const c2q = quiz('ttm201-quiz-2', 'Quiz 2 — Tourism system|||Quiz 2 — Hệ thống du lịch', [
  { id: 'q1', question: 'Trong mô hình hệ thống du lịch, "trung gian" (intermediaries) gồm những ai?', options: ['Chỉ hãng hàng không', 'Tour operator, đại lý du lịch (kể cả OTA)', 'Chỉ khách sạn', 'Chỉ chính phủ'], correctIndex: 1, explanation: 'Trung gian là các đơn vị đóng gói/phân phối sản phẩm du lịch: tour operator, travel agency, OTA.' },
  { id: 'q2', question: 'Vì sao du lịch được xem là "một hệ thống nhiều chủ sở hữu"?', options: ['Vì chỉ một công ty làm hết mọi việc', 'Vì chuyến bay, khách sạn, điểm tham quan, hướng dẫn viên thường thuộc các doanh nghiệp khác nhau', 'Vì chính phủ sở hữu toàn bộ ngành', 'Vì khách du lịch tự làm hết'], correctIndex: 1, explanation: 'Sản phẩm du lịch trải qua nhiều doanh nghiệp độc lập nên cần phối hợp chất lượng, không chỉ kiểm soát nội bộ.' },
  { id: 'q3', question: 'Chuỗi giá trị du lịch bắt đầu từ đâu và kết thúc ở đâu theo bài học?', options: ['Bắt đầu từ lưu trú, kết thúc ở vận chuyển', 'Bắt đầu từ marketing/đặt dịch vụ, kết thúc ở hậu chuyến đi (đánh giá, quay lại)', 'Không có điểm bắt đầu/kết thúc', 'Chỉ có một bước duy nhất'], correctIndex: 1, explanation: 'Chuỗi: marketing/booking → vận chuyển → dịch vụ điểm đến → lưu trú → trải nghiệm → hậu chuyến đi.' },
]);

const c3 = doc('ttm201-3-1-tour-operators-agencies', '3.1 — Tour operators & travel agencies|||3.1 — Doanh nghiệp lữ hành & đại lý du lịch',
  'Phân biệt tour operator (bán sỉ, đóng gói tour) và travel agency (bán lẻ); mô hình OTA, kênh phân phối, package tour vs tailor-made.',
  [[
    `<span class="eyebrow">TTM201 · Chapter 3 · Lesson 3.1</span>
<h2>Tour operators &amp; travel agencies</h2>
<h3>Two different businesses, often confused</h3>
<ul>
<li><strong>Tour operator</strong> — buys transport, accommodation and other services <em>in bulk</em>, combines them into a package tour, and sells it — usually through agents (wholesale). Bears the commercial risk of unsold capacity.</li>
<li><strong>Travel agency</strong> — sells travel products (packages, flights, hotels) directly to the end consumer (retail), earning commission; does not usually take on inventory risk.</li>
</ul>
<h3>Distribution channels</h3>
<pre><code>Tour operator --wholesale--> Travel agency --retail--> Tourist   (classic)
Tour operator ---------------------direct---------------------> Tourist   (direct sell)
Supplier (hotel/airline) --> OTA (Booking.com, Traveloka, ...) --> Tourist  (online)
</code></pre>
<h3>Online travel agencies (OTAs)</h3>
<p>OTAs sell hotel rooms, flights and tours online, often combining inventory from many suppliers on one platform. They compete with traditional travel agencies on price transparency and convenience, and increasingly offer <strong>dynamic packaging</strong> — assembling flight + hotel + extras on demand instead of a fixed pre-built package.</p>
<h3>Package tour vs tailor-made</h3>
<ul>
<li><strong>Package tour</strong> — a fixed itinerary, price and inclusions set in advance; economical, low effort for the tourist.</li>
<li><strong>Tailor-made / FIT (Free Independent Traveler)</strong> — itinerary built to the client's own requests; more expensive per person, more flexible.</li>
</ul>
<div class="callout"><span class="badge">Exam tip</span> If a question says "buys in bulk and takes inventory risk" → tour operator. If it says "sells to the end customer and earns commission" → travel agency (or OTA).</div>`,
    `<span class="eyebrow">TTM201 · Chương 3 · Bài 3.1</span>
<h2>Doanh nghiệp lữ hành &amp; đại lý du lịch</h2>
<h3>Hai loại doanh nghiệp khác nhau, thường bị nhầm</h3>
<ul>
<li><strong>Tour operator (doanh nghiệp lữ hành)</strong> — mua vận chuyển, lưu trú và dịch vụ khác theo <em>lô lớn</em>, ghép lại thành package tour và bán ra — thường qua đại lý (bán sỉ). Chịu rủi ro thương mại nếu công suất không bán hết.</li>
<li><strong>Travel agency (đại lý du lịch)</strong> — bán sản phẩm du lịch (tour, vé bay, khách sạn) trực tiếp cho khách hàng cuối (bán lẻ), hưởng hoa hồng; thường không chịu rủi ro tồn kho.</li>
</ul>
<h3>Kênh phân phối</h3>
<pre><code>Tour operator --bán sỉ--> Travel agency --bán lẻ--> Khách du lịch   (kênh cổ điển)
Tour operator ------------------bán trực tiếp------------------> Khách du lịch   (bán trực tiếp)
Nhà cung cấp (khách sạn/hãng bay) --> OTA (Booking.com, Traveloka...) --> Khách du lịch  (trực tuyến)
</code></pre>
<h3>Đại lý du lịch trực tuyến (OTA)</h3>
<p>OTA bán phòng khách sạn, vé bay và tour trực tuyến, thường ghép tồn kho từ nhiều nhà cung cấp trên cùng một nền tảng. OTA cạnh tranh với đại lý truyền thống bằng minh bạch giá và sự tiện lợi, và ngày càng cung cấp <strong>dynamic packaging</strong> — ghép chuyến bay + khách sạn + dịch vụ kèm theo yêu cầu thay vì một package cố định dựng sẵn.</p>
<h3>Package tour vs tailor-made</h3>
<ul>
<li><strong>Package tour</strong> — lịch trình, giá và dịch vụ kèm theo đã cố định từ trước; kinh tế, ít công cho khách.</li>
<li><strong>Tailor-made / FIT (khách tự do độc lập)</strong> — lịch trình dựng theo yêu cầu riêng của khách; đắt hơn theo đầu người, linh hoạt hơn.</li>
</ul>
<div class="callout"><span class="badge">Mẹo làm bài</span> Nếu đề nói "mua sỉ và chịu rủi ro tồn kho" → tour operator. Nếu đề nói "bán cho khách hàng cuối và hưởng hoa hồng" → travel agency (hoặc OTA).</div>`,
  ]]);

const c3q = quiz('ttm201-quiz-3', 'Quiz 3 — Tour operator & travel agency|||Quiz 3 — Doanh nghiệp lữ hành & đại lý', [
  { id: 'q1', question: 'Điểm khác biệt cốt lõi giữa tour operator và travel agency là gì?', options: ['Tour operator bán lẻ, travel agency bán sỉ', 'Tour operator mua sỉ & đóng gói tour (chịu rủi ro tồn kho), travel agency bán lẻ cho khách & hưởng hoa hồng', 'Cả hai hoàn toàn giống nhau', 'Travel agency luôn là công ty nhà nước'], correctIndex: 1, explanation: 'Tour operator mua sỉ, đóng gói, chịu rủi ro; travel agency bán lẻ, ăn hoa hồng, ít rủi ro tồn kho hơn.' },
  { id: 'q2', question: '"Dynamic packaging" mà các OTA cung cấp nghĩa là gì?', options: ['Bán tour cố định duy nhất một loại', 'Ghép linh hoạt vé bay + khách sạn + dịch vụ theo yêu cầu thời điểm đặt', 'Chỉ bán vé máy bay', 'Không cho khách chọn gì cả'], correctIndex: 1, explanation: 'Dynamic packaging: ghép flight + hotel + extra theo thời điểm đặt, khác với package cố định dựng sẵn.' },
  { id: 'q3', question: 'Một tour có lịch trình, giá, dịch vụ kèm theo đã cố định sẵn trước khi bán là loại nào?', options: ['Tailor-made / FIT', 'Package tour', 'Dynamic packaging', 'OTA trực tiếp'], correctIndex: 1, explanation: 'Package tour: lịch trình/giá/dịch vụ cố định trước, kinh tế, ít công cho khách.' },
]);

const c4 = doc('ttm201-4-1-tour-design-operations', '4.1 — Tour design & operations|||4.1 — Thiết kế & điều hành chương trình tour',
  'Quy trình xây dựng tour: nghiên cứu thị trường → thiết kế lịch trình → tính giá → ký hợp đồng nhà cung cấp → vận hành → đánh giá sau tour; quản trị rủi ro.',
  [[
    `<span class="eyebrow">TTM201 · Chapter 4 · Lesson 4.1</span>
<h2>Tour design &amp; operations</h2>
<h3>The tour-building process</h3>
<pre><code>1. Market research      -> who is this tour for, what do they want
2. Itinerary design     -> day-by-day route, sights, pacing
3. Costing & pricing    -> fixed costs + variable costs + margin
4. Supplier contracting -> hotels, transport, guides, attractions
5. Booking & documents  -> reservations, vouchers, visas/insurance
6. Operation            -> on-the-ground delivery, guiding
7. Post-tour evaluation -> feedback, cost review, improvements
</code></pre>
<h3>Costing a tour</h3>
<p>A tour price is built from <strong>fixed costs</strong> (guide, transport rental — the same regardless of group size) and <strong>variable costs</strong> (per-person costs like meals, entrance tickets), divided by group size, plus the operator's margin. Smaller groups pay a higher fixed-cost share per head — this is why operators set a <strong>minimum group size</strong>.</p>
<h3>Risk &amp; contingency</h3>
<p>Tour operations must plan for weather disruption, supplier no-shows, medical emergencies, and last-minute cancellations. Good practice includes a <strong>contingency plan</strong>, travel insurance requirements, and a 24/7 emergency contact for guides in the field.</p>
<div class="callout"><span class="badge">Guiding is operations, not just narration</span> A tour guide's real job on the ground is timing, problem-solving and safety — the storytelling is only the visible part.</div>`,
    `<span class="eyebrow">TTM201 · Chương 4 · Bài 4.1</span>
<h2>Thiết kế &amp; điều hành chương trình tour</h2>
<h3>Quy trình xây dựng tour</h3>
<pre><code>1. Nghiên cứu thị trường -> tour này cho ai, họ muốn gì
2. Thiết kế lịch trình    -> lộ trình từng ngày, điểm đến, nhịp độ
3. Tính giá               -> chi phí cố định + chi phí biến đổi + lợi nhuận
4. Ký hợp đồng nhà cung cấp -> khách sạn, vận chuyển, hướng dẫn viên, điểm tham quan
5. Đặt dịch vụ & chứng từ -> booking, voucher, visa/bảo hiểm
6. Vận hành               -> triển khai thực tế, hướng dẫn tại chỗ
7. Đánh giá sau tour       -> phản hồi, rà soát chi phí, cải tiến
</code></pre>
<h3>Tính giá một tour</h3>
<p>Giá tour được xây từ <strong>chi phí cố định</strong> (hướng dẫn viên, thuê xe — không đổi theo số khách) và <strong>chi phí biến đổi</strong> (chi phí theo đầu khách như ăn uống, vé cổng), chia cho số khách trong đoàn, cộng lợi nhuận của doanh nghiệp lữ hành. Đoàn nhỏ phải chịu phần chi phí cố định trên đầu người cao hơn — đây là lý do tour operator đặt <strong>số khách tối thiểu</strong>.</p>
<h3>Rủi ro &amp; kế hoạch dự phòng</h3>
<p>Vận hành tour phải lên kế hoạch cho: gián đoạn do thời tiết, nhà cung cấp không đến, cấp cứu y tế, và hủy vào giờ chót. Thực hành tốt gồm <strong>kế hoạch dự phòng</strong>, yêu cầu bảo hiểm du lịch, và đầu mối liên hệ khẩn cấp 24/7 cho hướng dẫn viên tại thực địa.</p>
<div class="callout"><span class="badge">Hướng dẫn là vận hành, không chỉ thuyết minh</span> Công việc thật của hướng dẫn viên tại thực địa là canh thời gian, xử lý sự cố và an toàn — thuyết minh chỉ là phần nổi có thể thấy được.</div>`,
  ]]);

const c4q = quiz('ttm201-quiz-4', 'Quiz 4 — Tour design & operations|||Quiz 4 — Thiết kế & điều hành tour', [
  { id: 'q1', question: 'Bước nào diễn ra ngay sau khi thiết kế lịch trình trong quy trình xây dựng tour?', options: ['Vận hành tại điểm đến', 'Tính giá (costing & pricing)', 'Đánh giá sau tour', 'Nghiên cứu thị trường'], correctIndex: 1, explanation: 'Thứ tự: nghiên cứu thị trường → thiết kế lịch trình → tính giá → ký hợp đồng → đặt dịch vụ → vận hành → đánh giá.' },
  { id: 'q2', question: 'Vì sao tour operator thường đặt "số khách tối thiểu" cho một tour?', options: ['Vì luật bắt buộc', 'Vì chi phí cố định chia cho ít khách sẽ làm giá mỗi người cao lên', 'Vì khách sạn yêu cầu', 'Không có lý do kinh tế'], correctIndex: 1, explanation: 'Fixed cost (hướng dẫn viên, thuê xe...) chia cho càng ít khách thì phần chi phí/người càng cao.' },
  { id: 'q3', question: 'Công việc thật của hướng dẫn viên trên thực địa, theo bài học, chủ yếu là gì?', options: ['Chỉ kể chuyện, thuyết minh', 'Canh thời gian, xử lý sự cố và đảm bảo an toàn', 'Chỉ lái xe', 'Không có vai trò vận hành'], correctIndex: 1, explanation: 'Thuyết minh chỉ là phần nổi; phần vận hành thật là canh giờ, xử lý sự cố, an toàn.' },
]);

const c5 = doc('ttm201-5-1-transport-accommodation', '5.1 — Transport & accommodation in tourism|||5.1 — Vận chuyển & lưu trú trong du lịch',
  'Các phương thức vận chuyển (hàng không full-service/low-cost, đường sắt, đường bộ, đường thuỷ); loại hình lưu trú & chỉ số occupancy, ADR, RevPAR.',
  [[
    `<span class="eyebrow">TTM201 · Chapter 5 · Lesson 5.1</span>
<h2>Transport &amp; accommodation in tourism</h2>
<h3>Transport modes</h3>
<ul>
<li><strong>Air</strong> — full-service carriers (checked bags, meals, connections) vs <strong>low-cost carriers / LCCs</strong> (point-to-point, unbundled fees, lower base fare).</li>
<li><strong>Rail</strong> — efficient for medium distances; scenic/heritage rail is itself an attraction.</li>
<li><strong>Road</strong> — coach tours, rental cars, ride-hailing — flexible, door-to-door.</li>
<li><strong>Water</strong> — cruise ships (the destination travels with the tourist), ferries for island/coastal routes.</li>
</ul>
<h3>Accommodation types</h3>
<ul>
<li><strong>Hotels</strong> — classified by star rating (services, room quality); chain-branded vs independent.</li>
<li><strong>Resorts</strong> — destination in themselves, extensive on-site amenities.</li>
<li><strong>Homestays / short-term rentals (e.g. Airbnb)</strong> — local, often cheaper, variable consistency.</li>
<li><strong>Hostels</strong> — budget, shared rooms, common in backpacker travel.</li>
</ul>
<h3>Key hotel performance metrics</h3>
<pre><code>Occupancy rate = rooms sold / rooms available            (how full)
ADR (Average Daily Rate) = room revenue / rooms sold      (how much per room)
RevPAR = ADR × Occupancy rate                              (revenue per available room)
</code></pre>
<div class="callout"><span class="badge">Why RevPAR, not just occupancy</span> A hotel can be 100% full at a heavily discounted rate and still earn less than a hotel at 70% occupancy with a strong rate. RevPAR captures both volume and price.</div>`,
    `<span class="eyebrow">TTM201 · Chương 5 · Bài 5.1</span>
<h2>Vận chuyển &amp; lưu trú trong du lịch</h2>
<h3>Các phương thức vận chuyển</h3>
<ul>
<li><strong>Hàng không</strong> — hãng full-service (hành lý ký gửi, ăn uống, nối chuyến) so với <strong>hãng giá rẻ / LCC</strong> (bay thẳng điểm-điểm, tách phí dịch vụ, giá vé cơ bản thấp hơn).</li>
<li><strong>Đường sắt</strong> — hiệu quả với cự ly trung bình; tuyến đường sắt cảnh quan/di sản có thể tự thành điểm hấp dẫn.</li>
<li><strong>Đường bộ</strong> — tour bằng xe khách, thuê xe tự lái, gọi xe công nghệ — linh hoạt, tận nơi.</li>
<li><strong>Đường thuỷ</strong> — du thuyền (điểm đến di chuyển cùng khách), phà cho tuyến đảo/ven biển.</li>
</ul>
<h3>Loại hình lưu trú</h3>
<ul>
<li><strong>Khách sạn</strong> — phân loại theo hạng sao (dịch vụ, chất lượng phòng); thuộc chuỗi thương hiệu hay độc lập.</li>
<li><strong>Resort</strong> — tự thân là một điểm đến, tiện ích nội khu phong phú.</li>
<li><strong>Homestay / cho thuê ngắn hạn (vd Airbnb)</strong> — mang tính địa phương, thường rẻ hơn, chất lượng không đồng đều.</li>
<li><strong>Hostel</strong> — bình dân, phòng chung, phổ biến trong du lịch backpacker.</li>
</ul>
<h3>Các chỉ số hiệu suất khách sạn cốt lõi</h3>
<pre><code>Occupancy rate (tỉ lệ lấp đầy) = số phòng bán được / số phòng có sẵn
ADR (giá phòng bình quân) = doanh thu phòng / số phòng bán được
RevPAR = ADR × Occupancy rate    (doanh thu trên mỗi phòng có sẵn)
</code></pre>
<div class="callout"><span class="badge">Vì sao cần RevPAR, không chỉ occupancy</span> Một khách sạn có thể full phòng với giá giảm sâu và vẫn thu ít hơn khách sạn lấp đầy 70% nhưng giá tốt. RevPAR phản ánh cả khối lượng và mức giá.</div>`,
  ]]);

const c5q = quiz('ttm201-quiz-5', 'Quiz 5 — Transport & accommodation|||Quiz 5 — Vận chuyển & lưu trú', [
  { id: 'q1', question: 'Hãng hàng không giá rẻ (LCC) khác hãng hàng không truyền thống (full-service) chủ yếu ở điểm nào?', options: ['LCC luôn đắt hơn', 'LCC tách phí dịch vụ riêng (hành lý, ăn...), giá vé cơ bản thấp hơn', 'LCC chỉ bay quốc tế', 'Không có khác biệt'], correctIndex: 1, explanation: 'LCC "unbundle" dịch vụ, tính phí riêng, giá vé gốc thấp; full-service gộp sẵn dịch vụ vào giá.' },
  { id: 'q2', question: 'RevPAR của khách sạn được tính như thế nào?', options: ['ADR chia Occupancy', 'ADR nhân Occupancy rate', 'Chỉ bằng Occupancy rate', 'Doanh thu chia số phòng đã bán'], correctIndex: 1, explanation: 'RevPAR = ADR × Occupancy rate — phản ánh cả khối lượng bán và mức giá.' },
  { id: 'q3', question: 'Vì sao chỉ nhìn tỉ lệ lấp đầy (occupancy) mà không nhìn RevPAR có thể gây hiểu nhầm?', options: ['Vì occupancy luôn chính xác hơn', 'Vì khách sạn có thể full phòng với giá giảm sâu, doanh thu thực tế thấp hơn khách sạn ít phòng hơn nhưng giá tốt', 'Vì occupancy không liên quan doanh thu', 'Vì RevPAR không dùng trong ngành'], correctIndex: 1, explanation: 'Full phòng giá thấp có thể thu ít hơn khách sạn lấp đầy thấp hơn nhưng giá cao — RevPAR mới phản ánh đúng.' },
]);

const c6 = doc('ttm201-6-1-tourism-marketing', '6.1 — Tourism marketing fundamentals|||6.1 — Marketing du lịch cơ bản',
  'Marketing mix 7Ps cho dịch vụ du lịch; vai trò tổ chức quản lý điểm đến (DMO); kênh marketing số (OTA, social, influencer, SEO).',
  [[
    `<span class="eyebrow">TTM201 · Chapter 6 · Lesson 6.1</span>
<h2>Tourism marketing fundamentals</h2>
<h3>Why tourism needs an extended marketing mix</h3>
<p>Tourism sells <strong>services</strong>, which are intangible, perishable (an empty seat tonight can't be sold tomorrow), and produced &amp; consumed at the same time with the customer present. The classic 4Ps (Product, Price, Place, Promotion) are extended with 3 more for services:</p>
<pre><code>Product    -> the tour/hotel/destination experience itself
Price      -> often dynamic (changes with demand, season, lead time)
Place      -> distribution: direct, agents, OTAs
Promotion  -> advertising, PR, content, influencers
People     -> staff, guides - service quality depends heavily on them
Process    -> booking flow, check-in, service delivery steps
Physical evidence -> what the customer can see/touch: website, brochure, decor, uniforms
</code></pre>
<h3>Destination marketing organizations (DMOs)</h3>
<p>A <strong>DMO</strong> (national tourism board, provincial/city tourism office) markets a <em>destination</em> rather than a single company's product — building a destination brand, running promotional campaigns, and coordinating many small businesses that individually cannot afford global marketing.</p>
<h3>Digital marketing channels</h3>
<ul>
<li><strong>OTA listings</strong> — visibility and reviews on Booking.com, TripAdvisor, Traveloka, etc.</li>
<li><strong>Social media &amp; influencers</strong> — user-generated content and creator partnerships heavily shape destination choice today.</li>
<li><strong>SEO / content</strong> — travel blogs and search results influence the early "dreaming" stage of trip planning.</li>
</ul>
<div class="callout"><span class="badge">Perishability drives pricing</span> Because an unsold hotel room or plane seat is lost revenue forever, tourism businesses lean heavily on dynamic/yield pricing to fill capacity.</div>`,
    `<span class="eyebrow">TTM201 · Chương 6 · Bài 6.1</span>
<h2>Marketing du lịch cơ bản</h2>
<h3>Vì sao du lịch cần marketing mix mở rộng</h3>
<p>Du lịch bán <strong>dịch vụ</strong>, thứ vô hình, dễ "hết hạn" (một ghế/phòng trống tối nay không thể bán lại cho ngày mai), và được sản xuất &amp; tiêu dùng cùng lúc với sự tham gia của khách hàng. 4P cổ điển (Product, Price, Place, Promotion) được mở rộng thêm 3P cho dịch vụ:</p>
<pre><code>Product (sản phẩm) -> chính trải nghiệm tour/khách sạn/điểm đến
Price (giá)         -> thường linh hoạt (đổi theo nhu cầu, mùa, thời điểm đặt)
Place (phân phối)   -> trực tiếp, đại lý, OTA
Promotion (chiêu thị) -> quảng cáo, PR, nội dung, influencer
People (con người)  -> nhân viên, hướng dẫn viên - chất lượng dịch vụ phụ thuộc lớn vào họ
Process (quy trình) -> luồng đặt dịch vụ, check-in, các bước phục vụ
Physical evidence (minh chứng vật lý) -> thứ khách thấy/chạm được: website, brochure, trang trí, đồng phục
</code></pre>
<h3>Tổ chức quản lý điểm đến (DMO)</h3>
<p>Một <strong>DMO</strong> (cơ quan du lịch quốc gia, sở/phòng du lịch tỉnh-thành) marketing cho <em>điểm đến</em> chứ không phải sản phẩm của riêng một công ty — xây thương hiệu điểm đến, chạy chiến dịch chiêu thị, và phối hợp nhiều doanh nghiệp nhỏ mà từng đơn vị riêng không đủ lực làm marketing toàn cầu.</p>
<h3>Kênh marketing số</h3>
<ul>
<li><strong>Trang OTA</strong> — độ hiện diện và đánh giá trên Booking.com, TripAdvisor, Traveloka...</li>
<li><strong>Mạng xã hội &amp; influencer</strong> — nội dung do người dùng tạo và hợp tác với nhà sáng tạo nội dung định hình mạnh lựa chọn điểm đến ngày nay.</li>
<li><strong>SEO / nội dung</strong> — blog du lịch và kết quả tìm kiếm ảnh hưởng tới giai đoạn "mơ mộng" ban đầu khi lên kế hoạch chuyến đi.</li>
</ul>
<div class="callout"><span class="badge">Tính dễ hết hạn dẫn dắt định giá</span> Vì một phòng khách sạn hoặc ghế máy bay không bán được là mất doanh thu vĩnh viễn, doanh nghiệp du lịch nghiêng nặng về định giá linh hoạt/theo nhu cầu để lấp đầy công suất.</div>`,
  ]]);

const c6q = quiz('ttm201-quiz-6', 'Quiz 6 — Tourism marketing|||Quiz 6 — Marketing du lịch', [
  { id: 'q1', question: 'Vì sao marketing mix trong du lịch thường mở rộng thành 7P thay vì chỉ 4P?', options: ['Vì du lịch không phải dịch vụ', 'Vì du lịch bán dịch vụ vô hình, dễ "hết hạn", sản xuất và tiêu dùng cùng lúc có khách hàng tham gia', 'Vì 4P đã lỗi thời với mọi ngành', 'Vì luật yêu cầu 7P'], correctIndex: 1, explanation: 'Đặc điểm dịch vụ (vô hình, dễ hết hạn, đồng thời) cần thêm People, Process, Physical evidence.' },
  { id: 'q2', question: 'DMO (tổ chức quản lý điểm đến) chủ yếu làm gì?', options: ['Bán tour trực tiếp cho khách', 'Marketing cho một điểm đến nói chung, phối hợp nhiều doanh nghiệp nhỏ', 'Điều hành khách sạn', 'Chỉ bán vé máy bay'], correctIndex: 1, explanation: 'DMO xây thương hiệu điểm đến, chạy chiến dịch chung mà từng doanh nghiệp nhỏ khó tự làm.' },
  { id: 'q3', question: 'Tính "dễ hết hạn" của dịch vụ du lịch dẫn tới điều gì trong định giá?', options: ['Giá luôn cố định quanh năm', 'Doanh nghiệp thường dùng định giá linh hoạt/theo nhu cầu để lấp đầy công suất', 'Không ảnh hưởng gì tới giá', 'Giá chỉ giảm, không bao giờ tăng'], correctIndex: 1, explanation: 'Ghế/phòng không bán được là mất vĩnh viễn nên ngành nghiêng về định giá động để tối ưu lấp đầy.' },
]);

const c7 = doc('ttm201-7-1-service-quality-experience', '7.1 — Service quality & guest experience management|||7.1 — Chất lượng dịch vụ & quản trị trải nghiệm khách du lịch',
  'Mô hình khoảng cách chất lượng dịch vụ (SERVQUAL); hành trình khách hàng & điểm chạm; xử lý khiếu nại; ảnh hưởng của đánh giá trực tuyến.',
  [[
    `<span class="eyebrow">TTM201 · Chapter 7 · Lesson 7.1</span>
<h2>Service quality &amp; guest experience management</h2>
<h3>The SERVQUAL dimensions</h3>
<p>Perceived service quality in tourism is commonly assessed across five dimensions:</p>
<pre><code>Tangibles      -> physical facilities, equipment, appearance of staff
Reliability    -> delivering the promised service accurately & on time
Responsiveness -> willingness to help promptly
Assurance      -> staff knowledge, courtesy, trustworthiness
Empathy        -> caring, individualized attention to each guest
</code></pre>
<h3>The service quality gap</h3>
<p>Dissatisfaction usually comes from a <strong>gap between expected service and perceived service</strong> — the guest expected one thing (often set by marketing promises) and experienced another. Managing expectations honestly in marketing is itself a quality tool.</p>
<h3>Customer journey &amp; touchpoints</h3>
<p>A guest's experience is the sum of many touchpoints: <strong>pre-trip</strong> (search, booking) → <strong>arrival</strong> (check-in, first impression) → <strong>during</strong> (service delivery, staff interactions) → <strong>departure</strong> → <strong>post-trip</strong> (review, follow-up). Any single weak touchpoint can define the whole memory of the trip.</p>
<h3>Complaints &amp; online reviews</h3>
<p>A well-handled complaint (fast acknowledgment, genuine fix, follow-up) can retain a guest who would otherwise leave a negative public review. Because <strong>online reviews</strong> (TripAdvisor, Google) are now a primary trust signal for future bookings, service recovery is a marketing activity, not just an operational one.</p>
<div class="callout"><span class="badge">The last touchpoint bias</span> Guests disproportionately remember the last interaction (departure) — a smooth checkout can rescue a mediocre stay in memory, and a rough one can spoil a great one.</div>`,
    `<span class="eyebrow">TTM201 · Chương 7 · Bài 7.1</span>
<h2>Chất lượng dịch vụ &amp; quản trị trải nghiệm khách du lịch</h2>
<h3>Năm khía cạnh SERVQUAL</h3>
<p>Chất lượng dịch vụ được khách cảm nhận trong du lịch thường được đánh giá qua năm khía cạnh:</p>
<pre><code>Tangibles (hữu hình)      -> cơ sở vật chất, trang thiết bị, vẻ ngoài nhân viên
Reliability (tin cậy)     -> thực hiện đúng như đã hứa, đúng thời gian
Responsiveness (đáp ứng)  -> sẵn lòng hỗ trợ nhanh chóng
Assurance (đảm bảo)       -> kiến thức, lịch sự, đáng tin của nhân viên
Empathy (đồng cảm)        -> quan tâm, chăm sóc cá nhân hoá từng khách
</code></pre>
<h3>Khoảng cách chất lượng dịch vụ</h3>
<p>Sự không hài lòng thường đến từ <strong>khoảng cách giữa dịch vụ kỳ vọng và dịch vụ được cảm nhận</strong> — khách kỳ vọng một điều (thường do lời hứa marketing tạo ra) nhưng trải nghiệm một điều khác. Quản lý kỳ vọng trung thực trong marketing chính là một công cụ chất lượng.</p>
<h3>Hành trình khách hàng &amp; điểm chạm</h3>
<p>Trải nghiệm của khách là tổng của nhiều điểm chạm: <strong>trước chuyến đi</strong> (tìm kiếm, đặt dịch vụ) → <strong>đến nơi</strong> (check-in, ấn tượng đầu) → <strong>trong chuyến đi</strong> (phục vụ, tương tác nhân viên) → <strong>rời đi</strong> → <strong>hậu chuyến đi</strong> (đánh giá, theo sát). Chỉ một điểm chạm yếu cũng có thể định hình cả ký ức về chuyến đi.</p>
<h3>Khiếu nại &amp; đánh giá trực tuyến</h3>
<p>Xử lý khiếu nại tốt (ghi nhận nhanh, khắc phục thật, theo sát) có thể giữ lại một khách hàng mà nếu không sẽ để lại đánh giá công khai tiêu cực. Vì <strong>đánh giá trực tuyến</strong> (TripAdvisor, Google) nay là tín hiệu tin cậy chính cho các lượt đặt dịch vụ tương lai, khắc phục dịch vụ là một hoạt động marketing, không chỉ vận hành.</p>
<div class="callout"><span class="badge">Định kiến điểm chạm cuối</span> Khách nhớ điểm tương tác cuối (lúc rời đi) một cách không tương xứng — một lượt trả phòng suôn sẻ có thể cứu ký ức về một kỳ nghỉ tầm tầm, và một lượt tệ có thể phá hỏng một kỳ nghỉ tuyệt vời.</div>`,
  ]]);

const c7q = quiz('ttm201-quiz-7', 'Quiz 7 — Service quality & experience|||Quiz 7 — Chất lượng dịch vụ & trải nghiệm', [
  { id: 'q1', question: '"Assurance" trong 5 khía cạnh SERVQUAL nói về điều gì?', options: ['Cơ sở vật chất hữu hình', 'Kiến thức, lịch sự và độ tin cậy của nhân viên', 'Sự đồng cảm cá nhân hoá', 'Tốc độ phản hồi'], correctIndex: 1, explanation: 'Assurance: kiến thức + thái độ lịch sự + tạo được sự tin tưởng của nhân viên.' },
  { id: 'q2', question: '"Khoảng cách chất lượng dịch vụ" thường xuất phát từ đâu?', options: ['Từ giá tour quá rẻ', 'Từ chênh lệch giữa kỳ vọng của khách (do marketing hứa hẹn) và trải nghiệm thực tế', 'Từ số lượng khách quá ít', 'Từ vị trí địa lý của điểm đến'], correctIndex: 1, explanation: 'Gap chủ yếu do kỳ vọng (thường do marketing tạo ra) khác với trải nghiệm nhận được.' },
  { id: 'q3', question: 'Vì sao xử lý khiếu nại tốt được xem là một hoạt động marketing, không chỉ vận hành?', options: ['Vì khiếu nại không ảnh hưởng gì tới khách khác', 'Vì đánh giá trực tuyến từ khách được xử lý tốt/tệ ảnh hưởng trực tiếp tới quyết định đặt của khách tương lai', 'Vì marketing không liên quan tới dịch vụ', 'Vì khiếu nại luôn được giữ kín'], correctIndex: 1, explanation: 'Review online là tín hiệu tin cậy cho khách tương lai — xử lý khiếu nại tốt bảo vệ được uy tín/marketing.' },
]);

const c8 = doc('ttm201-8-1-impacts-policy-sustainability', '8.1 — Impacts, policy, sustainable tourism & digitalization|||8.1 — Tác động, chính sách, du lịch bền vững & số hoá',
  'Tác động kinh tế/xã hội-văn hoá/môi trường của du lịch; vai trò chính sách nhà nước; nguyên tắc du lịch bền vững (UNWTO); xu hướng số hoá & smart tourism.',
  [[
    `<span class="eyebrow">TTM201 · Chapter 8 · Lesson 8.1</span>
<h2>Impacts, policy, sustainable tourism &amp; digitalization</h2>
<h3>Triple bottom line of tourism impact</h3>
<ul>
<li><strong>Economic</strong> — jobs, GDP contribution, foreign exchange; but also <strong>leakage</strong> (revenue that flows out to foreign-owned chains/airlines instead of staying local).</li>
<li><strong>Socio-cultural</strong> — cultural exchange and pride, but risk of commodifying local culture, and <strong>overtourism</strong> (residents' daily life disrupted by visitor volume).</li>
<li><strong>Environmental</strong> — carbon footprint of travel, waste, and pressure on natural sites beyond their <strong>carrying capacity</strong> (the maximum visitor level a site can sustain without degrading).</li>
</ul>
<h3>The role of government policy</h3>
<p>Governments shape tourism through visa policy, infrastructure investment (airports, roads), destination promotion (via a DMO), regulation (licensing tour operators, safety standards), and — increasingly — <strong>demand management</strong> (visitor caps, tourist taxes) in overtouristed sites.</p>
<h3>Principles of sustainable tourism (UNWTO)</h3>
<p>Sustainable tourism aims to make optimal use of resources while respecting socio-cultural authenticity and ensuring long-term economic viability — for both <strong>current and future</strong> generations of hosts and visitors.</p>
<h3>Digitalization &amp; smart tourism</h3>
<p>OTAs and metasearch shifted booking online; big data and AI now personalize recommendations and dynamic pricing; chatbots handle basic guest queries; <strong>smart tourism</strong> destinations use sensors/data to manage crowding and resources in real time.</p>
<div class="callout"><span class="badge">Sustainability is not "no tourism"</span> The goal is managing tourism's scale and behavior so the same site can still host visitors decades from now — not eliminating tourism.</div>`,
    `<span class="eyebrow">TTM201 · Chương 8 · Bài 8.1</span>
<h2>Tác động, chính sách, du lịch bền vững &amp; số hoá</h2>
<h3>Ba trụ cột tác động của du lịch</h3>
<ul>
<li><strong>Kinh tế</strong> — việc làm, đóng góp GDP, ngoại tệ; nhưng cũng có <strong>rò rỉ (leakage)</strong> — doanh thu chảy ra ngoài về các chuỗi/hãng nước ngoài thay vì giữ lại tại địa phương.</li>
<li><strong>Xã hội-văn hoá</strong> — giao lưu và tự hào văn hoá, nhưng có rủi ro thương mại hoá văn hoá địa phương, và <strong>overtourism</strong> (quá tải du lịch) — cuộc sống thường ngày của cư dân bị xáo trộn vì lượng khách quá lớn.</li>
<li><strong>Môi trường</strong> — dấu chân carbon của việc di chuyển, rác thải, và áp lực lên các điểm tự nhiên vượt quá <strong>sức chứa (carrying capacity)</strong> — mức khách tối đa một điểm có thể chịu được mà không suy giảm.</li>
</ul>
<h3>Vai trò chính sách nhà nước</h3>
<p>Chính phủ định hình du lịch qua chính sách visa, đầu tư hạ tầng (sân bay, đường bộ), quảng bá điểm đến (qua DMO), quy định (cấp phép tour operator, tiêu chuẩn an toàn), và — ngày càng nhiều — <strong>quản lý cầu</strong> (giới hạn số khách, thuế du lịch) tại các điểm bị quá tải.</p>
<h3>Nguyên tắc du lịch bền vững (UNWTO)</h3>
<p>Du lịch bền vững hướng tới sử dụng tối ưu nguồn lực trong khi tôn trọng tính chân thực xã hội-văn hoá và đảm bảo khả năng tồn tại kinh tế dài hạn — cho cả thế hệ <strong>hiện tại và tương lai</strong> của cả người dân địa phương và khách du lịch.</p>
<h3>Số hoá &amp; smart tourism</h3>
<p>OTA và metasearch đã chuyển việc đặt dịch vụ lên trực tuyến; dữ liệu lớn và AI nay cá nhân hoá gợi ý và định giá động; chatbot xử lý câu hỏi cơ bản của khách; các điểm đến <strong>smart tourism</strong> dùng cảm biến/dữ liệu để quản lý tình trạng đông đúc và nguồn lực theo thời gian thực.</p>
<div class="callout"><span class="badge">Bền vững không phải là "không du lịch"</span> Mục tiêu là quản lý quy mô và hành vi của du lịch để điểm đến đó vẫn có thể phục vụ khách trong nhiều chục năm tới — không phải triệt tiêu du lịch.</div>`,
  ]]);

const c8q = quiz('ttm201-quiz-8', 'Quiz 8 — Impacts, policy & sustainability|||Quiz 8 — Tác động, chính sách & bền vững', [
  { id: 'q1', question: '"Leakage" (rò rỉ kinh tế) trong tác động kinh tế của du lịch nghĩa là gì?', options: ['Tiền từ khách du lịch luôn ở lại 100% địa phương', 'Một phần doanh thu du lịch chảy ra ngoài (về chuỗi/hãng nước ngoài) thay vì giữ lại tại địa phương', 'Chính phủ thu thuế du lịch', 'Khách du lịch không chi tiêu gì'], correctIndex: 1, explanation: 'Leakage: doanh thu "rò" ra ngoài qua các chuỗi/hãng sở hữu nước ngoài, giảm lợi ích kinh tế giữ lại tại điểm đến.' },
  { id: 'q2', question: '"Sức chứa" (carrying capacity) của một điểm đến là gì?', options: ['Số phòng khách sạn tối đa xây được', 'Mức khách tối đa một điểm đến có thể tiếp nhận mà không bị suy giảm/xuống cấp', 'Ngân sách marketing tối đa', 'Số chuyến bay tối đa mỗi ngày'], correctIndex: 1, explanation: 'Carrying capacity: ngưỡng khách tối đa mà điểm đến chịu được về môi trường/xã hội mà không suy giảm.' },
  { id: 'q3', question: 'Theo bài học, mục tiêu của du lịch bền vững là gì?', options: ['Xoá bỏ hoàn toàn du lịch tại điểm nhạy cảm', 'Quản lý quy mô và hành vi du lịch để điểm đến vẫn phục vụ được khách trong tương lai, không chỉ hiện tại', 'Chỉ tối đa hoá doanh thu ngắn hạn', 'Không cần chính sách nhà nước can thiệp'], correctIndex: 1, explanation: 'Bền vững = cân bằng lợi ích kinh tế-xã hội-môi trường cho cả hiện tại và tương lai, không phải triệt tiêu du lịch.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'TTM201',
    slug: 'ttm201-tourism-and-travel-management',
    title: 'Tourism and Travel Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/TTM201.webp',
    shortDescription: 'Intro to tourism & travel: the tourism system, tour operators & agencies, tour design, transport & lodging, marketing, service quality, impacts & sustainability/digitalization. Bilingual, with quizzes.|||Nhập môn du lịch & lữ hành: hệ thống du lịch, doanh nghiệp lữ hành & đại lý, thiết kế tour, vận chuyển & lưu trú, marketing, chất lượng dịch vụ, tác động & bền vững/số hoá. Song ngữ, có quiz.',
    description: 'Môn <strong>TTM201 — Tourism and Travel Management</strong> (kỳ 3) là môn <strong>nhập môn tổng quan</strong> về ngành du lịch &amp; lữ hành. Từ <strong>khái niệm cơ bản</strong> (du lịch, khách du lịch theo UNWTO) → <strong>hệ thống du lịch</strong> (điểm đến, trung gian, vận chuyển, lưu trú) → <strong>doanh nghiệp lữ hành &amp; đại lý du lịch</strong> (tour operator, travel agency, OTA) → <strong>thiết kế &amp; điều hành tour</strong> → <strong>vận chuyển &amp; lưu trú</strong> → <strong>marketing du lịch</strong> → <strong>chất lượng dịch vụ &amp; trải nghiệm khách</strong> → <strong>tác động, chính sách &amp; du lịch bền vững, số hoá</strong>. Bám giáo trình FLM (tham chiếu Cooper/Fletcher/Fyall &amp; Holloway, UNWTO), song ngữ, có quiz mỗi chương.',
    whatYouLearn: 'Định nghĩa du lịch theo UNWTO, khách du lịch vs khách tham quan, du lịch nội địa/đến/ra ngoài; mô hình 5A điểm đến; hệ thống du lịch & chuỗi giá trị; tour operator vs travel agency, OTA, dynamic packaging; quy trình thiết kế & điều hành tour, tính giá; vận chuyển (hàng không, đường sắt, đường bộ, đường thuỷ) & lưu trú (occupancy, ADR, RevPAR); marketing mix 7P & DMO; chất lượng dịch vụ SERVQUAL, hành trình khách, xử lý khiếu nại; tác động kinh tế/xã hội/môi trường, chính sách, du lịch bền vững & xu hướng số hoá.',
    requirements: 'Không yêu cầu kiến thức nền đặc biệt. Nên đọc thêm giáo trình chính thức trên FLM (flm.fpt.edu.vn) để bám chuẩn đầu ra của trường.',
  },
  sections: [
    { title: 'Tài liệu tham khảo|||Course materials', description: 'Giáo trình chính, tổ chức chính thức (UNWTO, WTTC, IATA), tin ngành, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Du lịch là gì, vì sao ngành quan trọng, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & khái niệm|||Chapter 1 — Overview & concepts', description: 'Định nghĩa du lịch, tourist vs excursionist, mô hình 5A.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hệ thống du lịch|||Chapter 2 — Tourism system', description: 'Cầu/cung, trung gian, chuỗi giá trị du lịch.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Doanh nghiệp lữ hành & đại lý|||Chapter 3 — Tour operators & agencies', description: 'Tour operator vs travel agency, OTA, package vs tailor-made.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thiết kế & điều hành tour|||Chapter 4 — Tour design & operations', description: 'Quy trình xây tour, tính giá, rủi ro & dự phòng.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Vận chuyển & lưu trú|||Chapter 5 — Transport & accommodation', description: 'Phương thức vận chuyển, loại lưu trú, occupancy/ADR/RevPAR.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Marketing du lịch|||Chapter 6 — Tourism marketing', description: 'Marketing mix 7P, DMO, kênh số.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Chất lượng dịch vụ & trải nghiệm khách|||Chapter 7 — Service quality & guest experience', description: 'SERVQUAL, hành trình khách, khiếu nại & review.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Tác động, chính sách & bền vững|||Chapter 8 — Impacts, policy & sustainability', description: 'Tác động 3 trụ cột, chính sách, bền vững, số hoá.', lessons: [c8, c8q] },
  ],
};
