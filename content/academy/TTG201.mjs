/**
 * TTG201 — Tourism Geography. Giáo trình (syl): Hall & Page "The Geography of
 * Tourism and Recreation"; Williams & Lew "Tourism Geography"; UNWTO — địa lý
 * du lịch LÝ THUYẾT/TOÀN CẦU (khái niệm, cầu/dòng khách, mô hình không gian,
 * điểm đến, sức chứa, giao thông, các vùng du lịch thế giới, tác động, bền
 * vững). KHÔNG trùng danh mục điểm đến VN của TTD202. Song ngữ + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ttg201-0-0-tai-lieu', 'Course materials & references|||Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình tham khảo, UNWTO, dữ liệu thống kê, YouTube, công cụ bản đồ, lộ trình tự học.',
  [[
    `<span class="eyebrow">TTG201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Tourism Geography — core concepts, resources, demand &amp; flow models, destinations, transport, world regions, impacts and sustainability — in one place. This is the theoretical/global side of tourism geography; for Vietnam-specific destinations and routes, see <strong>TTD202</strong>.</p>
<h3>📗 Reference textbooks</h3>
<ul>
<li><em>The Geography of Tourism and Recreation: Environment, Place and Space</em> — C. Michael Hall &amp; Stephen J. Page (Routledge). The standard English-language textbook for this subject.</li>
<li><em>Tourism Geography: Critical Understandings of Place, Space and Experience</em> — Stephen Williams &amp; Alan A. Lew (Routledge).</li>
</ul>
<h3>🌐 Official / free data &amp; documentation</h3>
<ul>
<li><a href="https://www.unwto.org/" target="_blank" rel="noopener">UNWTO — World Tourism Organization</a> — the UN agency for tourism; regional definitions, data and reports.</li>
<li><a href="https://en.wikipedia.org/wiki/World_Tourism_Organization" target="_blank" rel="noopener">UNWTO — overview (Wikipedia)</a></li>
<li><a href="https://en.wikipedia.org/wiki/Tourist_area_life_cycle" target="_blank" rel="noopener">Butler's Tourist Area Life Cycle (TALC)</a></li>
<li><a href="https://en.wikipedia.org/wiki/Carrying_capacity" target="_blank" rel="noopener">Carrying capacity</a></li>
<li><a href="https://en.wikipedia.org/wiki/Sustainable_tourism" target="_blank" rel="noopener">Sustainable tourism</a></li>
<li><a href="https://ourworldindata.org/tourism" target="_blank" rel="noopener">Our World in Data — Tourism</a> — global tourism statistics &amp; charts.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@GeographyNow" target="_blank" rel="noopener">Geography Now</a> — country-by-country geography, useful background for regional tourism profiles.</li>
<li><a href="https://www.youtube.com/@RealLifeLore" target="_blank" rel="noopener">RealLifeLore</a> — geography &amp; spatial-pattern explainers, several on travel and transport networks.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://earth.google.com/" target="_blank" rel="noopener">Google Earth</a> — explore terrain, coastlines and destinations directly.</li>
<li><a href="https://www.unwto.org/tourism-data" target="_blank" rel="noopener">UNWTO Tourism Data</a> — arrivals, receipts and regional breakdowns for real-world figures.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — the tourism system, push/pull factors, natural &amp; cultural resources.</li>
<li><strong>Models</strong> — demand &amp; gravity model, distance decay, TALC, carrying capacity.</li>
<li><strong>Applied</strong> — transport &amp; accessibility, world tourism regions, impacts.</li>
<li><strong>Current issues</strong> — sustainability, climate change, emerging spatial trends — read a current UNWTO report to see the theory in today's numbers.</li>
</ol></div>`,
    `<span class="eyebrow">TTG201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Địa lý Du lịch — khái niệm nền, tài nguyên, mô hình cầu/dòng khách, điểm đến, giao thông, các vùng du lịch thế giới, tác động và bền vững — gom về một chỗ. Đây là phần <strong>lý thuyết/toàn cầu</strong> của địa lý du lịch; điểm đến &amp; tuyến du lịch cụ thể của Việt Nam nằm ở môn <strong>TTD202</strong>.</p>
<h3>📗 Sách giáo trình tham khảo</h3>
<ul>
<li><em>The Geography of Tourism and Recreation: Environment, Place and Space</em> — C. Michael Hall &amp; Stephen J. Page (Routledge). Giáo trình tiếng Anh chuẩn của môn này.</li>
<li><em>Tourism Geography: Critical Understandings of Place, Space and Experience</em> — Stephen Williams &amp; Alan A. Lew (Routledge).</li>
</ul>
<h3>🌐 Dữ liệu &amp; tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.unwto.org/" target="_blank" rel="noopener">UNWTO — Tổ chức Du lịch Thế giới</a> — cơ quan của Liên Hợp Quốc về du lịch; định nghĩa vùng, dữ liệu và báo cáo.</li>
<li><a href="https://en.wikipedia.org/wiki/World_Tourism_Organization" target="_blank" rel="noopener">UNWTO — tổng quan (Wikipedia)</a></li>
<li><a href="https://en.wikipedia.org/wiki/Tourist_area_life_cycle" target="_blank" rel="noopener">Chu kỳ sống vùng du lịch của Butler (TALC)</a></li>
<li><a href="https://en.wikipedia.org/wiki/Carrying_capacity" target="_blank" rel="noopener">Sức chứa (carrying capacity)</a></li>
<li><a href="https://en.wikipedia.org/wiki/Sustainable_tourism" target="_blank" rel="noopener">Du lịch bền vững</a></li>
<li><a href="https://ourworldindata.org/tourism" target="_blank" rel="noopener">Our World in Data — Tourism</a> — thống kê &amp; biểu đồ du lịch toàn cầu.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@GeographyNow" target="_blank" rel="noopener">Geography Now</a> — địa lý từng quốc gia, nền tốt cho hồ sơ du lịch theo vùng.</li>
<li><a href="https://www.youtube.com/@RealLifeLore" target="_blank" rel="noopener">RealLifeLore</a> — giải thích địa lý &amp; khuôn mẫu không gian, nhiều bài về du lịch và mạng giao thông.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://earth.google.com/" target="_blank" rel="noopener">Google Earth</a> — khám phá địa hình, bờ biển và điểm đến trực tiếp.</li>
<li><a href="https://www.unwto.org/tourism-data" target="_blank" rel="noopener">UNWTO Tourism Data</a> — lượng khách, doanh thu và số liệu theo vùng.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — hệ thống du lịch, nhân tố đẩy/kéo, tài nguyên tự nhiên &amp; nhân văn.</li>
<li><strong>Mô hình</strong> — cầu du lịch &amp; mô hình hấp dẫn, suy giảm theo khoảng cách, TALC, sức chứa.</li>
<li><strong>Ứng dụng</strong> — giao thông &amp; khả năng tiếp cận, các vùng du lịch thế giới, tác động.</li>
<li><strong>Vấn đề thời sự</strong> — bền vững, biến đổi khí hậu, xu hướng không gian mới — đọc một báo cáo UNWTO gần đây để thấy lý thuyết trong số liệu hôm nay.</li>
</ol></div>`,
  ]]);

const intro = doc('ttg201-0-1-overview', 'Course overview: Tourism Geography|||Tổng quan: Địa lý Du lịch',
  'Địa lý du lịch nghiên cứu gì; khác TTD202 (điểm đến VN) thế nào; lộ trình 8 chương.',
  [[
    `<span class="eyebrow">TTG201 · Lesson 0.1 · Overview</span>
<h2>Tourism Geography</h2>
<p class="lead">This course studies tourism through the lens of <strong>space and place</strong>: why tourism resources are distributed unevenly across the globe, how tourist flows form and move, what makes a "destination" work as a spatial system, and how tourism reshapes the environments, economies and societies it touches. It is the <strong>theoretical/global</strong> half of the tourism-geography pair — <strong>TTD202</strong> covers concrete Vietnam destinations and routes region by region.</p>
<h3>Roadmap — 8 chapters</h3>
<ol>
<li>Overview &amp; core concepts (the tourism system, push/pull)</li>
<li>Natural &amp; cultural (human) tourism resources</li>
<li>Tourism demand, flows &amp; spatial models</li>
<li>Destinations, tourism regions &amp; carrying capacity</li>
<li>Transport, accessibility &amp; connectivity</li>
<li>World tourism regions</li>
<li>Impacts of tourism — economic, environmental, sociocultural</li>
<li>Sustainable tourism, climate change &amp; new spatial trends</li>
</ol>
<p>Bilingual throughout, with a chapter quiz to check understanding.</p>`,
    `<span class="eyebrow">TTG201 · Bài 0.1 · Tổng quan</span>
<h2>Địa lý Du lịch</h2>
<p class="lead">Môn này nghiên cứu du lịch qua lăng kính <strong>không gian và nơi chốn</strong>: vì sao tài nguyên du lịch phân bố không đều trên toàn cầu, dòng khách du lịch hình thành và di chuyển thế nào, điều gì làm một "điểm đến" hoạt động như một hệ thống không gian, và du lịch làm thay đổi môi trường, kinh tế, xã hội mà nó chạm tới ra sao. Đây là nửa <strong>lý thuyết/toàn cầu</strong> trong cặp môn địa lý du lịch — <strong>TTD202</strong> đi vào điểm đến và tuyến du lịch cụ thể của Việt Nam theo từng vùng.</p>
<h3>Lộ trình — 8 chương</h3>
<ol>
<li>Tổng quan &amp; khái niệm nền (hệ thống du lịch, nhân tố đẩy/kéo)</li>
<li>Tài nguyên du lịch tự nhiên &amp; nhân văn</li>
<li>Cầu du lịch, dòng khách &amp; mô hình không gian</li>
<li>Điểm đến, vùng du lịch &amp; sức chứa</li>
<li>Giao thông, khả năng tiếp cận &amp; kết nối du lịch</li>
<li>Các vùng du lịch trên thế giới</li>
<li>Tác động của du lịch — kinh tế, môi trường, xã hội</li>
<li>Du lịch bền vững, biến đổi khí hậu &amp; xu hướng không gian mới</li>
</ol>
<p>Song ngữ toàn bộ, kèm quiz mỗi chương để kiểm tra hiểu bài.</p>`,
  ]]);

const c1 = doc('ttg201-1-1-overview-concepts', '1.1 — Scope & core concepts|||1.1 — Phạm vi & khái niệm nền',
  'Hệ thống du lịch (Leiper): vùng phát sinh–trung chuyển–điểm đến; nhân tố đẩy/kéo; vì sao cần góc nhìn địa lý.',
  [[
    `<span class="eyebrow">TTG201 · Chapter 1 · Lesson 1.1</span>
<h2>Tourism geography: scope &amp; core concepts</h2>
<p class="lead"><strong>Tourism geography</strong> is the spatial study of tourism — where people travel, why they choose one place over another, how tourists move through space, and how that movement reshapes the places involved. It sits between human geography and tourism studies, using concepts of <strong>space, place and scale</strong> to explain patterns that a purely economic or marketing view misses.</p>
<h3>The tourism system</h3>
<p>Neil Leiper's classic model splits every trip into three linked spatial elements:</p>
<pre><code>Generating region --travel--> Transit route region --travel--> Destination region
(tourist's home:              (the journey itself:             (where the trip's
 demand originates)            transport, stopovers)            purpose is fulfilled)
</code></pre>
<p>Tourism only exists where all three exist together — a beautiful place with no way to reach it, or no one wanting to leave home, generates no tourism flow.</p>
<h3>Push &amp; pull factors</h3>
<ul>
<li><strong>Push factors</strong> — forces at the <em>origin</em> that create the desire to travel: stress, routine, curiosity, social status, the need to escape.</li>
<li><strong>Pull factors</strong> — attributes of the <em>destination</em> that channel that desire toward a specific place: climate, landscape, culture, safety, price, marketing image.</li>
</ul>
<p>Push explains <em>why people travel at all</em>; pull explains <em>why they go here rather than there</em> — the two together produce an actual flow.</p>
<div class="callout"><span class="badge">Why geography, not just marketing</span> A destination can have perfect pull factors and still receive zero visitors if push factors are absent (no one feels the need to leave) or if distance/accessibility blocks the flow — geography studies both sides and the friction between them.</div>`,
    `<span class="eyebrow">TTG201 · Chương 1 · Bài 1.1</span>
<h2>Địa lý du lịch: phạm vi &amp; khái niệm nền</h2>
<p class="lead"><strong>Địa lý du lịch</strong> là nghiên cứu không gian của du lịch — du khách đi đâu, vì sao chọn nơi này mà không phải nơi khác, họ di chuyển qua không gian thế nào, và sự di chuyển đó làm thay đổi các nơi liên quan ra sao. Môn học nằm giữa địa lý nhân văn và du lịch học, dùng khái niệm <strong>không gian, nơi chốn và quy mô (scale)</strong> để giải thích những khuôn mẫu mà góc nhìn kinh tế hay marketing đơn thuần bỏ sót.</p>
<h3>Hệ thống du lịch</h3>
<p>Mô hình kinh điển của Neil Leiper chia mỗi chuyến đi thành ba vùng không gian liên kết:</p>
<pre><code>Vùng phát sinh --di chuyển--> Vùng trung chuyển --di chuyển--> Vùng điểm đến
(nhà của du khách:              (chính chuyến đi:                (nơi mục đích
 nơi cầu bắt đầu)                 vận chuyển, dừng chân)            chuyến đi thành hiện thực)
</code></pre>
<p>Du lịch chỉ tồn tại khi cả ba vùng cùng có mặt — một nơi đẹp mà không có đường tới, hoặc không ai muốn rời nhà, đều không tạo ra dòng khách.</p>
<h3>Nhân tố đẩy &amp; nhân tố kéo</h3>
<ul>
<li><strong>Nhân tố đẩy (push)</strong> — lực tại <em>nơi xuất phát</em> tạo ra mong muốn đi: áp lực, nhàm chán thường nhật, tò mò, địa vị xã hội, nhu cầu thoát khỏi thường ngày.</li>
<li><strong>Nhân tố kéo (pull)</strong> — thuộc tính của <em>điểm đến</em> hướng mong muốn đó tới một nơi cụ thể: khí hậu, cảnh quan, văn hoá, an toàn, giá cả, hình ảnh marketing.</li>
</ul>
<p>Đẩy giải thích <em>vì sao người ta đi du lịch</em>; kéo giải thích <em>vì sao họ đến đây mà không phải nơi khác</em> — hai nhân tố cộng lại mới tạo ra dòng khách thật.</p>
<div class="callout"><span class="badge">Vì sao cần địa lý, không chỉ marketing</span> Một điểm đến có thể có nhân tố kéo hoàn hảo mà vẫn không đón được khách nào nếu thiếu nhân tố đẩy (không ai cảm thấy cần rời nhà) hoặc khoảng cách/khả năng tiếp cận chặn dòng khách — địa lý nghiên cứu cả hai phía và lực cản giữa chúng.</div>`,
  ]]);

const c1q = quiz('ttg201-quiz-1', 'Quiz 1 — Concepts|||Quiz 1 — Khái niệm nền', [
  { id: 'q1', question: 'Mô hình của Leiper chia một chuyến du lịch thành mấy vùng không gian?', options: ['2', '3', '4', '5'], correctIndex: 1, explanation: 'Vùng phát sinh — vùng trung chuyển — vùng điểm đến.' },
  { id: 'q2', question: 'Nhân tố nào giải thích "vì sao người ta muốn rời nhà đi du lịch"?', options: ['Nhân tố kéo', 'Nhân tố đẩy', 'Sức chứa', 'Khả năng tiếp cận'], correctIndex: 1, explanation: 'Nhân tố đẩy nằm ở nơi xuất phát, tạo mong muốn đi.' },
  { id: 'q3', question: 'Nhân tố kéo (pull factor) là gì?', options: ['Áp lực công việc tại nơi ở', 'Thuộc tính hấp dẫn của điểm đến', 'Giá vé máy bay tăng', 'Thời gian nghỉ hạn chế'], correctIndex: 1, explanation: 'Nhân tố kéo là thuộc tính của điểm đến (khí hậu, văn hoá...) hướng du khách tới đó.' },
]);

const c2 = doc('ttg201-2-1-resources', '2.1 — Natural & cultural resources|||2.1 — Tài nguyên tự nhiên & nhân văn',
  'Tài nguyên tự nhiên (khí hậu, địa hình, thuỷ văn, sinh vật); tài nguyên nhân văn (di sản, văn hoá sống, đô thị); tiêu chí đánh giá.',
  [[
    `<span class="eyebrow">TTG201 · Chapter 2 · Lesson 2.1</span>
<h2>Tourism resources: natural &amp; cultural (human)</h2>
<p class="lead">A <strong>tourism resource</strong> is anything in a place capable of attracting visitors. Geographers group them into two families — and most real destinations combine both.</p>
<h3>Natural resources</h3>
<ul>
<li><strong>Climate &amp; weather</strong> — sunshine hours, temperature, seasonality (drives sun-and-sea and winter-sports tourism).</li>
<li><strong>Landform &amp; landscape</strong> — mountains, coastlines, karst caves, deserts, waterfalls — the physical stage for scenery and outdoor activity.</li>
<li><strong>Water bodies</strong> — seas, lakes, rivers — beaches, diving, cruising.</li>
<li><strong>Flora, fauna &amp; protected areas</strong> — national parks, reefs, wildlife reserves (ecotourism).</li>
</ul>
<h3>Cultural (human) resources</h3>
<ul>
<li><strong>Heritage &amp; built environment</strong> — historic sites, architecture, UNESCO World Heritage listings.</li>
<li><strong>Living culture</strong> — festivals, performing arts, cuisine, crafts, religion.</li>
<li><strong>Urban &amp; modern attractions</strong> — museums, theme parks, shopping, MICE (meetings/events) venues.</li>
</ul>
<h3>Evaluating a resource</h3>
<pre><code>Attractiveness / uniqueness  - does it stand out from substitutes?
Accessibility                - can visitors physically & affordably reach it?
Capacity / fragility         - how much use before it degrades?
Complementarity               - does it combine well with nearby resources?
</code></pre>
<div class="callout"><span class="badge">Resource ≠ destination</span> A resource only becomes tourism <em>supply</em> once infrastructure (roads, accommodation, services) makes it reachable and usable — an unreached waterfall is scenery, not (yet) tourism.</div>`,
    `<span class="eyebrow">TTG201 · Chương 2 · Bài 2.1</span>
<h2>Tài nguyên du lịch: tự nhiên &amp; nhân văn</h2>
<p class="lead"><strong>Tài nguyên du lịch</strong> là bất cứ thứ gì ở một nơi có khả năng thu hút du khách. Các nhà địa lý chia thành hai nhóm — và hầu hết điểm đến thực tế đều kết hợp cả hai.</p>
<h3>Tài nguyên tự nhiên</h3>
<ul>
<li><strong>Khí hậu &amp; thời tiết</strong> — số giờ nắng, nhiệt độ, tính mùa (thúc đẩy du lịch biển-nắng và trượt tuyết mùa đông).</li>
<li><strong>Địa hình &amp; cảnh quan</strong> — núi, bờ biển, hang động karst, sa mạc, thác nước — bối cảnh vật lý cho cảnh quan và hoạt động ngoài trời.</li>
<li><strong>Thuỷ văn</strong> — biển, hồ, sông — tắm biển, lặn biển, du thuyền.</li>
<li><strong>Sinh vật &amp; khu bảo tồn</strong> — vườn quốc gia, rạn san hô, khu bảo tồn động vật hoang dã (du lịch sinh thái).</li>
</ul>
<h3>Tài nguyên nhân văn</h3>
<ul>
<li><strong>Di sản &amp; công trình xây dựng</strong> — di tích lịch sử, kiến trúc, danh sách Di sản Thế giới UNESCO.</li>
<li><strong>Văn hoá sống</strong> — lễ hội, nghệ thuật biểu diễn, ẩm thực, thủ công, tôn giáo.</li>
<li><strong>Điểm hấp dẫn đô thị &amp; hiện đại</strong> — bảo tàng, công viên chủ đề, mua sắm, địa điểm MICE (hội nghị/sự kiện).</li>
</ul>
<h3>Đánh giá một tài nguyên</h3>
<pre><code>Tính hấp dẫn / độc đáo   - có nổi bật hơn các lựa chọn thay thế?
Khả năng tiếp cận        - du khách có tới được và chi trả được không?
Sức chứa / độ mong manh  - dùng bao nhiêu thì xuống cấp?
Tính bổ sung              - có kết hợp tốt với tài nguyên lân cận?
</code></pre>
<div class="callout"><span class="badge">Tài nguyên ≠ điểm đến</span> Một tài nguyên chỉ trở thành <em>cung du lịch</em> khi có hạ tầng (đường, lưu trú, dịch vụ) giúp nó tiếp cận và sử dụng được — một thác nước chưa có đường vào chỉ là cảnh quan, chưa (phải) là du lịch.</div>`,
  ]]);

const c2q = quiz('ttg201-quiz-2', 'Quiz 2 — Resources|||Quiz 2 — Tài nguyên', [
  { id: 'q1', question: 'Tài nguyên du lịch tự nhiên bao gồm nhóm nào sau đây?', options: ['Festival và ẩm thực', 'Khí hậu và địa hình', 'Kiến trúc di sản', 'Trung tâm mua sắm'], correctIndex: 1, explanation: 'Khí hậu và địa hình thuộc tài nguyên tự nhiên; các phương án khác là tài nguyên nhân văn.' },
  { id: 'q2', question: 'Tiêu chí nào đánh giá "dùng bao nhiêu thì tài nguyên xuống cấp"?', options: ['Tính hấp dẫn', 'Khả năng tiếp cận', 'Sức chứa / độ mong manh', 'Tính bổ sung'], correctIndex: 2, explanation: 'Sức chứa/độ mong manh (capacity/fragility) đo mức chịu tải trước khi xuống cấp.' },
  { id: 'q3', question: 'Vì sao một thác nước chưa có đường vào chưa được coi là tài nguyên du lịch đầy đủ?', options: ['Vì thác nước không đẹp', 'Vì thiếu hạ tầng tiếp cận nên chưa thành cung du lịch', 'Vì không có nhân tố đẩy', 'Vì khí hậu không phù hợp'], correctIndex: 1, explanation: 'Tài nguyên chỉ thành cung du lịch khi có hạ tầng giúp tiếp cận và sử dụng.' },
]);

const c3 = doc('ttg201-3-1-demand-flows', '3.1 — Demand, flows & spatial models|||3.1 — Cầu, dòng khách & mô hình không gian',
  'Nhân tố cầu (thu nhập, thời gian, động cơ); cầu hiệu quả/tiềm ẩn; mô hình hấp dẫn (gravity model); suy giảm theo khoảng cách.',
  [[
    `<span class="eyebrow">TTG201 · Chapter 3 · Lesson 3.1</span>
<h2>Tourism demand, flows &amp; spatial models</h2>
<h3>What drives demand</h3>
<ul>
<li><strong>Disposable income</strong> — travel is a discretionary spend; demand rises with income (with a lag/threshold effect).</li>
<li><strong>Leisure time</strong> — paid holidays, weekends, retirement.</li>
<li><strong>Motivation &amp; demographics</strong> — age, family stage, lifestyle, life-course.</li>
</ul>
<p><strong>Effective demand</strong> is those who actually travel; <strong>potential/suppressed demand</strong> is those who would like to but are blocked by cost, time or access — closing that gap is exactly what cheaper transport and rising income do over time.</p>
<h3>Origin-destination flows &amp; the gravity model</h3>
<p>Tourist flows between two places behave like gravity: bigger "masses" (population, attractiveness) generate more flow, and flow weakens fast with distance.</p>
<pre><code>Gravity model (simplified):
  Flow(i,j)  proportional to   Pi x Pj
                                --------
                                Dij^n

  Pi, Pj = population / size of origin i and destination j
  Dij    = distance between i and j
  n      = distance-decay exponent (bigger n = flow drops off faster)
</code></pre>
<h3>Distance decay</h3>
<p>Visitor numbers from a given origin typically fall as distance increases — but not evenly: budget airlines, direct flights and strong pull factors can flatten the curve, while visas or poor connections steepen it.</p>
<div class="callout"><span class="badge">Reading a flow map</span> A destination's visitor market is rarely random — it clusters around a few nearby, well-connected, historically-linked origins. Mapping origin-destination pairs is the first step in any market analysis.</div>`,
    `<span class="eyebrow">TTG201 · Chương 3 · Bài 3.1</span>
<h2>Cầu du lịch, dòng khách &amp; mô hình không gian</h2>
<h3>Điều gì tạo ra cầu</h3>
<ul>
<li><strong>Thu nhập khả dụng</strong> — du lịch là chi tiêu không thiết yếu; cầu tăng theo thu nhập (có độ trễ/ngưỡng).</li>
<li><strong>Thời gian nghỉ</strong> — ngày nghỉ có lương, cuối tuần, nghỉ hưu.</li>
<li><strong>Động cơ &amp; nhân khẩu học</strong> — tuổi, giai đoạn gia đình, phong cách sống, chu kỳ đời người.</li>
</ul>
<p><strong>Cầu hiệu quả (effective demand)</strong> là những người thực sự đã đi du lịch; <strong>cầu tiềm ẩn/bị nén</strong> là những người muốn đi nhưng bị chặn bởi chi phí, thời gian hoặc khả năng tiếp cận — thu hẹp khoảng cách đó chính là điều giao thông rẻ hơn và thu nhập tăng làm được theo thời gian.</p>
<h3>Dòng khách origin-destination &amp; mô hình hấp dẫn</h3>
<p>Dòng khách giữa hai nơi hoạt động như lực hấp dẫn: "khối lượng" lớn hơn (dân số, độ hấp dẫn) tạo dòng khách lớn hơn, và dòng khách yếu đi nhanh theo khoảng cách.</p>
<pre><code>Mô hình hấp dẫn (đơn giản hoá):
  Dòng(i,j)  tỉ lệ với   Pi x Pj
                          --------
                          Dij^n

  Pi, Pj = dân số / quy mô của nơi phát sinh i và điểm đến j
  Dij    = khoảng cách giữa i và j
  n      = hệ số suy giảm theo khoảng cách (n lớn hơn = dòng giảm nhanh hơn)
</code></pre>
<h3>Suy giảm theo khoảng cách</h3>
<p>Số khách từ một nơi phát sinh thường giảm khi khoảng cách tăng — nhưng không đều: hàng không giá rẻ, chuyến bay thẳng và nhân tố kéo mạnh có thể làm đường cong bằng hơn, còn visa hay kết nối kém làm nó dốc hơn.</p>
<div class="callout"><span class="badge">Đọc bản đồ dòng khách</span> Thị trường khách của một điểm đến hiếm khi ngẫu nhiên — nó tập trung quanh vài nơi phát sinh gần, kết nối tốt, có liên hệ lịch sử. Vẽ các cặp origin-destination là bước đầu của mọi phân tích thị trường.</div>`,
  ]]);

const c3q = quiz('ttg201-quiz-3', 'Quiz 3 — Demand & flows|||Quiz 3 — Cầu & dòng khách', [
  { id: 'q1', question: '"Cầu hiệu quả" (effective demand) trong du lịch là gì?', options: ['Người muốn đi nhưng bị chặn bởi chi phí', 'Người thực sự đã đi du lịch', 'Tổng dân số điểm đến', 'Khoảng cách trung bình các chuyến đi'], correctIndex: 1, explanation: 'Cầu hiệu quả là nhu cầu đã hiện thực hoá thành chuyến đi thật.' },
  { id: 'q2', question: 'Theo mô hình hấp dẫn (gravity model), dòng khách giữa hai nơi tăng khi nào?', options: ['Khoảng cách tăng', '"Khối lượng" (dân số/độ hấp dẫn) hai nơi tăng', 'Giá vé tăng', 'Thời gian bay tăng'], correctIndex: 1, explanation: 'Dòng khách tỉ lệ thuận với "khối lượng" hai nơi và tỉ lệ nghịch với khoảng cách.' },
  { id: 'q3', question: '"Suy giảm theo khoảng cách" (distance decay) mô tả điều gì?', options: ['Số khách từ một nơi giảm khi khoảng cách tới điểm đến tăng', 'Giá phòng giảm theo mùa', 'Sức chứa giảm dần theo năm', 'Khí hậu điểm đến thay đổi'], correctIndex: 0, explanation: 'Distance decay: khoảng cách tăng thì lượng khách từ nơi đó thường giảm.' },
]);

const c4 = doc('ttg201-4-1-destinations-capacity', '4.1 — Destinations & carrying capacity|||4.1 — Điểm đến & sức chứa',
  'Điểm đến & vùng du lịch; TALC của Butler (khám phá→...→suy thoái/trẻ hoá); sức chứa vật lý/sinh thái/xã hội/kinh tế; quá tải du lịch.',
  [[
    `<span class="eyebrow">TTG201 · Chapter 4 · Lesson 4.1</span>
<h2>Destinations, tourism regions &amp; carrying capacity</h2>
<h3>Destination &amp; tourism region</h3>
<p>A <strong>destination</strong> is a place — a city, coastline, or country — that combines resources, infrastructure and services to attract and host visitors. A <strong>tourism region</strong> is a broader spatial unit grouping destinations that share characteristics (climate, culture, a shared brand) for planning and marketing.</p>
<h3>Butler's Tourist Area Life Cycle (TALC)</h3>
<pre><code>Visitor
numbers          Development      Consolidation
   ^                  /----\\        /----\\
   |                /        \\    /        \\___ Stagnation
   |   Involvement /            \\/                \\__ Decline
   | /                            \\                    (or Rejuvenation
   |/ Exploration                  \\                     with reinvestment)
   +---------------------------------------------------------------> Time
</code></pre>
<p>A destination is not static — it moves through stages as visitor numbers, investment and market type change, from a few explorers discovering it to mass tourism, and eventually to stagnation unless it reinvents itself.</p>
<h3>Carrying capacity</h3>
<ul>
<li><strong>Physical</strong> — the maximum number a site can hold (beach space, trail width).</li>
<li><strong>Ecological</strong> — the load an ecosystem can absorb before lasting damage.</li>
<li><strong>Social</strong> — the crowding level hosts and visitors will tolerate before satisfaction drops.</li>
<li><strong>Economic</strong> — the point where tourism starts crowding out other local activities.</li>
</ul>
<div class="callout"><span class="badge">Overtourism</span> When arrivals exceed one or more of these capacities, the result is overtourism — degraded sites, resentful residents, falling visitor satisfaction — the destination's own success undermining itself.</div>`,
    `<span class="eyebrow">TTG201 · Chương 4 · Bài 4.1</span>
<h2>Điểm đến, vùng du lịch &amp; sức chứa</h2>
<h3>Điểm đến &amp; vùng du lịch</h3>
<p>Một <strong>điểm đến</strong> là một nơi — thành phố, bờ biển, hay quốc gia — kết hợp tài nguyên, hạ tầng và dịch vụ để thu hút và đón tiếp du khách. Một <strong>vùng du lịch</strong> là đơn vị không gian rộng hơn, nhóm các điểm đến có đặc điểm chung (khí hậu, văn hoá, một thương hiệu chung) để quy hoạch và marketing.</p>
<h3>Chu kỳ sống vùng du lịch của Butler (TALC)</h3>
<pre><code>Lượng khách
                 Phát triển        Củng cố
   ^                  /----\\        /----\\
   |                /        \\    /        \\___ Trì trệ
   |   Tham gia   /            \\/                \\__ Suy thoái
   | /                            \\                    (hoặc Trẻ hoá
   |/ Khám phá                     \\                     nếu tái đầu tư)
   +---------------------------------------------------------------> Thời gian
</code></pre>
<p>Một điểm đến không tĩnh — nó đi qua các giai đoạn khi lượng khách, đầu tư và loại thị trường thay đổi, từ vài người khám phá đầu tiên đến du lịch đại chúng, và cuối cùng là trì trệ nếu không tự làm mới mình.</p>
<h3>Sức chứa (carrying capacity)</h3>
<ul>
<li><strong>Vật lý</strong> — số lượng tối đa một địa điểm có thể chứa (diện tích bãi biển, độ rộng đường mòn).</li>
<li><strong>Sinh thái</strong> — tải lượng mà một hệ sinh thái chịu được trước khi bị tổn hại lâu dài.</li>
<li><strong>Xã hội</strong> — mức độ chật chội mà dân địa phương và du khách còn chấp nhận trước khi sự hài lòng giảm.</li>
<li><strong>Kinh tế</strong> — điểm mà du lịch bắt đầu chèn lấn các hoạt động kinh tế khác của địa phương.</li>
</ul>
<div class="callout"><span class="badge">Quá tải du lịch</span> Khi lượng khách vượt một hoặc nhiều loại sức chứa trên, kết quả là quá tải du lịch (overtourism) — địa điểm xuống cấp, dân địa phương bất mãn, sự hài lòng của du khách giảm — chính thành công của điểm đến làm suy yếu nó.</div>`,
  ]]);

const c4q = quiz('ttg201-quiz-4', 'Quiz 4 — Destinations & capacity|||Quiz 4 — Điểm đến & sức chứa', [
  { id: 'q1', question: 'Giai đoạn nào trong TALC của Butler diễn ra TRƯỚC "Phát triển (Development)"?', options: ['Suy thoái', 'Khám phá (Exploration) rồi Tham gia (Involvement)', 'Trẻ hoá (Rejuvenation)', 'Củng cố (Consolidation)'], correctIndex: 1, explanation: 'Thứ tự TALC: Khám phá → Tham gia → Phát triển → Củng cố → Trì trệ → Suy thoái/Trẻ hoá.' },
  { id: 'q2', question: 'Sức chứa nào giới hạn bởi "mức độ chật chội mà du khách/dân địa phương còn chấp nhận"?', options: ['Sức chứa vật lý', 'Sức chứa sinh thái', 'Sức chứa xã hội', 'Sức chứa kinh tế'], correctIndex: 2, explanation: 'Sức chứa xã hội đo mức chấp nhận đông đúc trước khi sự hài lòng giảm.' },
  { id: 'q3', question: '"Quá tải du lịch" (overtourism) xảy ra khi nào?', options: ['Lượng khách vượt một hoặc nhiều loại sức chứa', 'Giá phòng giảm', 'Mùa thấp điểm kéo dài', 'Khoảng cách tới điểm đến tăng'], correctIndex: 0, explanation: 'Overtourism là khi lượng khách vượt sức chứa vật lý/sinh thái/xã hội/kinh tế.' },
]);

const c5 = doc('ttg201-5-1-transport-access', '5.1 — Transport & accessibility|||5.1 — Giao thông & khả năng tiếp cận',
  'Các loại vận tải (hàng không, đường sắt, đường bộ, đường biển); khả năng tiếp cận; hub-and-spoke; thành phố cửa ngõ; hội tụ thời gian-không gian.',
  [[
    `<span class="eyebrow">TTG201 · Chapter 5 · Lesson 5.1</span>
<h2>Transport, accessibility &amp; connectivity</h2>
<h3>Modes of tourism transport</h3>
<ul>
<li><strong>Air</strong> — dominant for long-haul; low-cost carriers opened up short/medium-haul mass markets.</li>
<li><strong>Rail</strong> — strong for regional/intercity travel where networks are dense (e.g. high-speed rail in Europe/East Asia).</li>
<li><strong>Road</strong> — flexible, dominant for domestic and cross-border short trips.</li>
<li><strong>Sea</strong> — cruises and ferries; both transport and, for cruises, the destination itself.</li>
</ul>
<h3>Accessibility</h3>
<p><strong>Accessibility</strong> is not just distance — it's a function of travel time, cost, frequency of service and ease of connection. Two places at the same physical distance can have very different accessibility depending on whether a direct flight exists.</p>
<h3>Hub-and-spoke &amp; gateway cities</h3>
<pre><code>         Spoke city A
              \\
Spoke city B -- HUB airport -- Spoke city C
              /
         Spoke city D
</code></pre>
<p>Airlines route passengers through a central <strong>hub</strong> to connect many origins to many destinations efficiently. Cities that concentrate this role become <strong>gateway cities</strong> — the first point of entry that shapes a whole country's or region's inbound tourism.</p>
<div class="callout"><span class="badge">Time-space convergence</span> Faster, cheaper transport "shrinks" geographic distance in travel-time terms — a process called time-space convergence. It's why yesterday's remote destination becomes today's weekend break.</div>`,
    `<span class="eyebrow">TTG201 · Chương 5 · Bài 5.1</span>
<h2>Giao thông, khả năng tiếp cận &amp; kết nối du lịch</h2>
<h3>Các loại hình vận tải du lịch</h3>
<ul>
<li><strong>Hàng không</strong> — chủ đạo cho chuyến dài; hàng không giá rẻ mở ra thị trường đại chúng cho chuyến ngắn/trung.</li>
<li><strong>Đường sắt</strong> — mạnh cho di chuyển vùng/liên thành phố nơi mạng lưới dày (vd đường sắt cao tốc ở châu Âu/Đông Á).</li>
<li><strong>Đường bộ</strong> — linh hoạt, chủ đạo cho chuyến ngắn trong nước và xuyên biên giới.</li>
<li><strong>Đường biển</strong> — du thuyền và phà; vừa là vận tải, với du thuyền còn là chính điểm đến.</li>
</ul>
<h3>Khả năng tiếp cận</h3>
<p><strong>Khả năng tiếp cận (accessibility)</strong> không chỉ là khoảng cách — nó là hàm của thời gian di chuyển, chi phí, tần suất chuyến và độ dễ kết nối. Hai nơi cùng khoảng cách vật lý có thể có khả năng tiếp cận rất khác nhau tuỳ vào có chuyến bay thẳng hay không.</p>
<h3>Hub-and-spoke &amp; thành phố cửa ngõ</h3>
<pre><code>          Thành phố nhánh A
               \\
Thành phố nhánh B -- Sân bay TRUNG TÂM -- Thành phố nhánh C
               /
          Thành phố nhánh D
</code></pre>
<p>Các hãng hàng không dẫn khách qua một <strong>trung tâm (hub)</strong> để kết nối hiệu quả nhiều nơi phát sinh với nhiều điểm đến. Những thành phố tập trung vai trò này trở thành <strong>thành phố cửa ngõ (gateway city)</strong> — điểm nhập cảnh đầu tiên định hình cả luồng khách vào của một quốc gia hay vùng.</p>
<div class="callout"><span class="badge">Hội tụ thời gian-không gian</span> Giao thông nhanh và rẻ hơn làm "co lại" khoảng cách địa lý theo thời gian di chuyển — quá trình gọi là hội tụ thời gian-không gian (time-space convergence). Đây là lý do điểm đến xa xôi hôm qua trở thành chuyến nghỉ cuối tuần hôm nay.</div>`,
  ]]);

const c5q = quiz('ttg201-quiz-5', 'Quiz 5 — Transport & access|||Quiz 5 — Giao thông & tiếp cận', [
  { id: 'q1', question: 'Khả năng tiếp cận (accessibility) của một điểm đến phụ thuộc vào yếu tố nào?', options: ['Chỉ khoảng cách vật lý', 'Thời gian, chi phí, tần suất và độ dễ kết nối di chuyển', 'Chỉ giá vé', 'Chỉ số lượng khách sạn'], correctIndex: 1, explanation: 'Accessibility là hàm của nhiều yếu tố, không chỉ khoảng cách vật lý.' },
  { id: 'q2', question: '"Thành phố cửa ngõ" (gateway city) là gì?', options: ['Nơi có nhiều bãi biển', 'Điểm nhập cảnh trung tâm định hình luồng khách vào cả vùng/quốc gia', 'Nơi giá phòng rẻ nhất', 'Nơi khí hậu quanh năm ôn hoà'], correctIndex: 1, explanation: 'Gateway city là điểm vào chính, định hình luồng khách của cả vùng/quốc gia.' },
  { id: 'q3', question: '"Hội tụ thời gian-không gian" (time-space convergence) mô tả điều gì?', options: ['Giao thông nhanh/rẻ hơn làm khoảng cách "co lại" theo thời gian di chuyển', 'Khoảng cách vật lý giữa hai nơi giảm thật', 'Sức chứa điểm đến tăng', 'Dân số điểm đến tăng'], correctIndex: 0, explanation: 'Khoảng cách vật lý không đổi, nhưng thời gian đi lại giảm nhờ giao thông tốt hơn.' },
]);

const c6 = doc('ttg201-6-1-world-regions', '6.1 — World tourism regions|||6.1 — Các vùng du lịch trên thế giới',
  'Phân vùng UNWTO: châu Âu, châu Á-TBD, châu Mỹ, Trung Đông, châu Phi; hồ sơ từng vùng; du lịch nội vùng vs liên vùng.',
  [[
    `<span class="eyebrow">TTG201 · Chapter 6 · Lesson 6.1</span>
<h2>Tourism regions of the world</h2>
<p class="lead">UNWTO groups the world into macro-regions to track and compare tourism flows. Each has a distinct profile of resources, markets and growth pattern.</p>
<pre><code>Region        | Profile
--------------|---------------------------------------------------
Europe        | Largest historical share; dense intra-regional
              | travel; culture, heritage, coastal & winter tourism.
Asia-Pacific  | Fast-growing pre-pandemic; huge outbound market
              | (esp. China); diverse nature, culture, urban mix.
Americas      | Split N/S profiles; strong US/Canada intra-region
              | travel + Caribbean/Latin America beach & nature.
Middle East   | Fast-growing hub role (aviation hubs), religious
              | tourism (Hajj/Umrah), luxury & desert tourism.
Africa        | Smallest global share but high-value wildlife &
              | safari tourism; strong growth potential.
</code></pre>
<h3>Reading regional data</h3>
<p>Regional shares shift with the economic cycle, exchange rates, visa policy and geopolitics — a snapshot from a few years ago is not today's map. Use current UNWTO data (see Materials) rather than memorising fixed percentages.</p>
<div class="callout"><span class="badge">Intra- vs inter-regional travel</span> Most tourism worldwide is <strong>intra-regional</strong> — people travelling within their own region — a key reason accessibility and proximity dominate over pure attractiveness.</div>`,
    `<span class="eyebrow">TTG201 · Chương 6 · Bài 6.1</span>
<h2>Các vùng du lịch trên thế giới</h2>
<p class="lead">UNWTO chia thế giới thành các vùng lớn (macro-region) để theo dõi và so sánh dòng khách du lịch. Mỗi vùng có hồ sơ riêng về tài nguyên, thị trường và mô hình tăng trưởng.</p>
<pre><code>Vùng         | Hồ sơ
-------------|----------------------------------------------------
Châu Âu      | Tỉ trọng lịch sử lớn nhất; du lịch nội vùng dày đặc;
             | văn hoá, di sản, du lịch biển & mùa đông.
Châu Á-TBD   | Tăng nhanh trước dịch; thị trường outbound khổng lồ
             | (đặc biệt Trung Quốc); tự nhiên, văn hoá, đô thị đa dạng.
Châu Mỹ      | Hồ sơ Bắc/Nam khác nhau; du lịch nội vùng Mỹ/Canada
             | mạnh + biển & thiên nhiên Caribe/Mỹ Latinh.
Trung Đông   | Vai trò trung tâm hàng không tăng nhanh, du lịch tôn
             | giáo (Hajj/Umrah), du lịch sang trọng & sa mạc.
Châu Phi     | Tỉ trọng toàn cầu nhỏ nhất nhưng du lịch động vật hoang
             | dã & safari giá trị cao; tiềm năng tăng trưởng lớn.
</code></pre>
<h3>Đọc dữ liệu theo vùng</h3>
<p>Tỉ trọng các vùng thay đổi theo chu kỳ kinh tế, tỷ giá, chính sách visa và địa chính trị — một lát cắt vài năm trước không phải bản đồ hôm nay. Nên dùng dữ liệu UNWTO cập nhật (xem mục Tài liệu) thay vì học thuộc số phần trăm cố định.</p>
<div class="callout"><span class="badge">Du lịch nội vùng vs liên vùng</span> Phần lớn du lịch toàn cầu là <strong>nội vùng (intra-regional)</strong> — người dân đi lại trong chính vùng của mình — một lý do vì sao khả năng tiếp cận và sự gần gũi lấn lướt tính hấp dẫn thuần túy.</div>`,
  ]]);

const c6q = quiz('ttg201-quiz-6', 'Quiz 6 — World regions|||Quiz 6 — Vùng du lịch thế giới', [
  { id: 'q1', question: 'Theo phân vùng UNWTO, khu vực nào có lịch sử chiếm tỉ trọng khách du lịch lớn nhất thế giới?', options: ['Châu Phi', 'Châu Âu', 'Trung Đông', 'Nam Mỹ'], correctIndex: 1, explanation: 'Châu Âu có tỉ trọng lịch sử lớn nhất, nhờ du lịch nội vùng dày đặc.' },
  { id: 'q2', question: 'Phần lớn du lịch toàn cầu là loại nào?', options: ['Liên vùng (đi rất xa khỏi vùng của mình)', 'Nội vùng (đi trong chính vùng của mình)', 'Chỉ nội địa trong một thành phố', 'Chỉ du lịch vũ trụ'], correctIndex: 1, explanation: 'Phần lớn dòng khách là nội vùng, nhờ khoảng cách gần và kết nối tốt.' },
  { id: 'q3', question: 'Vì sao không nên học tỉ trọng vùng như số cố định?', options: ['Vì tỉ trọng không đổi theo thời gian', 'Vì tỉ trọng thay đổi theo kinh tế, tỷ giá, chính sách visa, địa chính trị', 'Vì UNWTO không công bố số liệu', 'Vì các vùng không có ranh giới rõ'], correctIndex: 1, explanation: 'Tỉ trọng vùng biến động theo nhiều yếu tố kinh tế-chính trị, nên phải cập nhật số liệu thật.' },
]);

const c7 = doc('ttg201-7-1-impacts', '7.1 — Impacts of tourism|||7.1 — Tác động của du lịch',
  'Tác động kinh tế (nhân số nhân, rò rỉ); môi trường (tài nguyên, ô nhiễm, dấu chân carbon); xã hội-văn hoá (hiệu ứng lan truyền, hàng hoá hoá văn hoá, Irridex của Doxey).',
  [[
    `<span class="eyebrow">TTG201 · Chapter 7 · Lesson 7.1</span>
<h2>Impacts of tourism: economic, environmental, sociocultural</h2>
<h3>Economic impacts</h3>
<ul>
<li><strong>Benefits</strong> — income, jobs, foreign exchange, the tourism <strong>multiplier effect</strong> (money re-spent through the local economy).</li>
<li><strong>Costs</strong> — <strong>leakage</strong> (profits/imports flowing back out, e.g. to foreign-owned hotel chains), seasonality, inflation of local prices.</li>
</ul>
<h3>Environmental impacts</h3>
<ul>
<li>Resource consumption (water, energy, land), waste &amp; pollution, habitat/coral/trail degradation from overuse, carbon footprint of transport (especially aviation).</li>
</ul>
<h3>Sociocultural impacts</h3>
<ul>
<li><strong>Demonstration effect</strong> — locals adopting visitor behaviours/consumption patterns.</li>
<li><strong>Commodification of culture</strong> — traditions performed/sold for visitors, sometimes losing original meaning.</li>
<li><strong>Host-guest relations</strong> — can shift from welcoming to resentful as visitor numbers rise (Doxey's Irridex: euphoria → apathy → annoyance → antagonism).</li>
</ul>
<div class="callout"><span class="badge">No impact is purely one column</span> A new airport is an economic benefit, an environmental cost, and can be a sociocultural benefit (connectivity) or cost (rapid, unplanned change) at the same time — always weigh all three together.</div>`,
    `<span class="eyebrow">TTG201 · Chương 7 · Bài 7.1</span>
<h2>Tác động của du lịch: kinh tế, môi trường, xã hội-văn hoá</h2>
<h3>Tác động kinh tế</h3>
<ul>
<li><strong>Lợi ích</strong> — thu nhập, việc làm, ngoại tệ, <strong>hiệu ứng số nhân (multiplier effect)</strong> của du lịch (tiền được chi tiêu lại trong nền kinh tế địa phương).</li>
<li><strong>Chi phí</strong> — <strong>rò rỉ (leakage)</strong> (lợi nhuận/hàng nhập chảy ra ngoài, vd về chuỗi khách sạn nước ngoài), tính mùa, lạm phát giá cả địa phương.</li>
</ul>
<h3>Tác động môi trường</h3>
<ul>
<li>Tiêu thụ tài nguyên (nước, năng lượng, đất), rác thải &amp; ô nhiễm, xuống cấp môi trường sống/rạn san hô/đường mòn do dùng quá tải, dấu chân carbon của giao thông (đặc biệt hàng không).</li>
</ul>
<h3>Tác động xã hội-văn hoá</h3>
<ul>
<li><strong>Hiệu ứng lan truyền (demonstration effect)</strong> — dân địa phương học theo hành vi/tiêu dùng của du khách.</li>
<li><strong>Hàng hoá hoá văn hoá (commodification)</strong> — truyền thống được biểu diễn/bán cho du khách, đôi khi mất đi ý nghĩa gốc.</li>
<li><strong>Quan hệ chủ-khách</strong> — có thể chuyển từ hiếu khách sang bất mãn khi lượng khách tăng (Irridex của Doxey: hưng phấn → thờ ơ → khó chịu → đối kháng).</li>
</ul>
<div class="callout"><span class="badge">Không tác động nào chỉ thuộc một cột</span> Một sân bay mới là lợi ích kinh tế, chi phí môi trường, và có thể vừa là lợi ích xã hội-văn hoá (kết nối) vừa là chi phí (thay đổi nhanh, không quy hoạch) cùng lúc — luôn cân cả ba cùng nhau.</div>`,
  ]]);

const c7q = quiz('ttg201-quiz-7', 'Quiz 7 — Impacts|||Quiz 7 — Tác động', [
  { id: 'q1', question: '"Rò rỉ" (leakage) trong kinh tế du lịch là gì?', options: ['Tiền/lợi nhuận chảy ra ngoài nền kinh tế địa phương, ví dụ về chuỗi khách sạn ngoại', 'Tiền lương tăng cho lao động địa phương', 'Thuế du lịch tăng', 'Giá phòng giảm mùa thấp điểm'], correctIndex: 0, explanation: 'Leakage là lợi nhuận/ngoại tệ chảy ra khỏi nền kinh tế địa phương.' },
  { id: 'q2', question: '"Hiệu ứng lan truyền" (demonstration effect) mô tả điều gì?', options: ['Giá cả điểm đến tăng theo mùa', 'Dân địa phương học theo hành vi/tiêu dùng của du khách', 'Du khách học ngôn ngữ địa phương', 'Chính phủ tăng đầu tư hạ tầng'], correctIndex: 1, explanation: 'Demonstration effect: dân địa phương bắt chước hành vi/tiêu dùng của du khách.' },
  { id: 'q3', question: 'Theo Irridex của Doxey, quan hệ chủ-khách thường biến chuyển theo hướng nào khi lượng khách tăng?', options: ['Từ hưng phấn dần sang khó chịu/đối kháng', 'Luôn giữ nguyên hưng phấn', 'Từ đối kháng chuyển sang hưng phấn', 'Không thay đổi theo lượng khách'], correctIndex: 0, explanation: 'Irridex: euphoria → apathy → annoyance → antagonism khi khách tăng.' },
]);

const c8 = doc('ttg201-8-1-sustainability-trends', '8.1 — Sustainability, climate change & trends|||8.1 — Bền vững, biến đổi khí hậu & xu hướng',
  'Du lịch bền vững (ba trụ cột); sinh thái & cộng đồng; biến đổi khí hậu (biển dâng, tuyết giảm, dịch chuyển độ phù hợp khí hậu); xu hướng không gian mới.',
  [[
    `<span class="eyebrow">TTG201 · Chapter 8 · Lesson 8.1</span>
<h2>Sustainable tourism, climate change &amp; new spatial trends</h2>
<h3>Sustainable tourism</h3>
<p>Sustainable tourism balances the <strong>triple bottom line</strong> — economic viability, environmental protection, and sociocultural respect — so that today's tourism does not undermine tomorrow's resource base. <strong>Ecotourism</strong> and <strong>community-based tourism</strong> are common models: low-impact, nature-focused, with benefits flowing to local communities.</p>
<h3>Climate change &amp; the geography of tourism</h3>
<ul>
<li><strong>Coastal &amp; island destinations</strong> — sea-level rise and stronger storms threaten beaches and infrastructure.</li>
<li><strong>Winter-sports destinations</strong> — shrinking snow cover pushes ski tourism to higher altitudes/latitudes.</li>
<li><strong>Shifting climate suitability</strong> — some currently "too hot" destinations may become more attractive in cooler seasons, and vice versa — the whole map of "when to go where" is redrawing itself.</li>
</ul>
<h3>Emerging spatial trends</h3>
<ul>
<li><strong>Dark tourism</strong> — visiting sites associated with death/tragedy (memorials, disaster sites).</li>
<li><strong>Digital nomadism &amp; slow travel</strong> — longer stays, less point-to-point movement, blurring "tourist" and "resident".</li>
<li><strong>Space tourism</strong> — the newest, most extreme extension of the destination concept beyond Earth.</li>
</ul>
<div class="callout"><span class="badge">The map keeps moving</span> Tourism geography is not a fixed atlas — resources, demand, transport and climate all keep shifting, which is exactly why the discipline studies patterns and processes, not a final list of places.</div>`,
    `<span class="eyebrow">TTG201 · Chương 8 · Bài 8.1</span>
<h2>Du lịch bền vững, biến đổi khí hậu &amp; xu hướng không gian mới</h2>
<h3>Du lịch bền vững</h3>
<p>Du lịch bền vững cân bằng <strong>ba trụ cột</strong> — khả thi kinh tế, bảo vệ môi trường, và tôn trọng xã hội-văn hoá — để du lịch hôm nay không làm suy yếu nguồn tài nguyên của ngày mai. <strong>Du lịch sinh thái (ecotourism)</strong> và <strong>du lịch dựa vào cộng đồng</strong> là các mô hình phổ biến: tác động thấp, tập trung tự nhiên, lợi ích chảy tới cộng đồng địa phương.</p>
<h3>Biến đổi khí hậu &amp; địa lý du lịch</h3>
<ul>
<li><strong>Điểm đến ven biển &amp; đảo</strong> — nước biển dâng và bão mạnh hơn đe doạ bãi biển và hạ tầng.</li>
<li><strong>Điểm đến thể thao mùa đông</strong> — lớp tuyết thu hẹp đẩy du lịch trượt tuyết lên độ cao/vĩ độ lớn hơn.</li>
<li><strong>Dịch chuyển độ phù hợp khí hậu</strong> — một số điểm đến hiện "quá nóng" có thể trở nên hấp dẫn hơn vào mùa mát, và ngược lại — toàn bộ bản đồ "khi nào nên đi đâu" đang được vẽ lại.</li>
</ul>
<h3>Xu hướng không gian mới nổi</h3>
<ul>
<li><strong>Du lịch đen (dark tourism)</strong> — thăm các địa điểm gắn với cái chết/bi kịch (khu tưởng niệm, hiện trường thảm hoạ).</li>
<li><strong>Du mục số &amp; du lịch chậm (slow travel)</strong> — lưu trú dài hơn, ít di chuyển điểm-tới-điểm, làm mờ ranh giới "du khách" và "cư dân".</li>
<li><strong>Du lịch vũ trụ (space tourism)</strong> — phần mở rộng mới nhất, cực đoan nhất của khái niệm điểm đến, vượt ra ngoài Trái Đất.</li>
</ul>
<div class="callout"><span class="badge">Bản đồ luôn dịch chuyển</span> Địa lý du lịch không phải một tập bản đồ cố định — tài nguyên, cầu, giao thông và khí hậu đều liên tục thay đổi, đó chính là lý do môn học nghiên cứu khuôn mẫu và quá trình, không phải một danh sách địa điểm cuối cùng.</div>`,
  ]]);

const c8q = quiz('ttg201-quiz-8', 'Quiz 8 — Sustainability & trends|||Quiz 8 — Bền vững & xu hướng', [
  { id: 'q1', question: '"Ba trụ cột" (triple bottom line) của du lịch bền vững gồm gì?', options: ['Giá, quảng bá, thương hiệu', 'Kinh tế, môi trường, văn hoá-xã hội', 'Vận tải, lưu trú, ăn uống', 'Khí hậu, địa hình, thuỷ văn'], correctIndex: 1, explanation: 'Triple bottom line: khả thi kinh tế + bảo vệ môi trường + tôn trọng xã hội-văn hoá.' },
  { id: 'q2', question: 'Biến đổi khí hậu ảnh hưởng thế nào tới điểm đến trượt tuyết?', options: ['Tuyết dày hơn quanh năm', 'Lớp tuyết thu hẹp, đẩy du lịch trượt tuyết lên độ cao/vĩ độ lớn hơn', 'Không ảnh hưởng gì', 'Khách du lịch tăng gấp đôi'], correctIndex: 1, explanation: 'Tuyết thu hẹp buộc các khu trượt tuyết dịch lên cao hơn hoặc về phía cực hơn.' },
  { id: 'q3', question: '"Du lịch chậm" (slow travel) / du mục số làm mờ ranh giới nào?', options: ['Ranh giới giữa "du khách" và "cư dân"', 'Ranh giới giữa vùng phát sinh và điểm đến', 'Ranh giới quốc gia', 'Ranh giới sức chứa vật lý và sinh thái'], correctIndex: 0, explanation: 'Lưu trú dài, ít di chuyển điểm-tới-điểm làm mờ ranh giới du khách/cư dân.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'TTG201',
    slug: 'ttg201-tourism-geography',
    title: 'Tourism Geography',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/TTG201.webp',
    shortDescription: 'How tourism geography explains where people travel and why — the tourism system, resources, demand & flow models, destinations & carrying capacity, transport, world regions, impacts, and sustainability & climate trends. Bilingual, with quizzes.|||Địa lý du lịch giải thích du khách đi đâu và vì sao — hệ thống du lịch, tài nguyên, mô hình cầu/dòng khách, điểm đến & sức chứa, giao thông, các vùng du lịch thế giới, tác động, bền vững & xu hướng khí hậu. Song ngữ, có quiz.',
    description: 'Môn <strong>TTG201 — Tourism Geography</strong> (kỳ 3) nghiên cứu du lịch qua lăng kính không gian: <strong>hệ thống du lịch &amp; nhân tố đẩy/kéo</strong> → <strong>tài nguyên tự nhiên &amp; nhân văn</strong> → <strong>cầu, dòng khách &amp; mô hình không gian</strong> (mô hình hấp dẫn, suy giảm theo khoảng cách) → <strong>điểm đến, vùng du lịch &amp; sức chứa</strong> (TALC của Butler) → <strong>giao thông &amp; khả năng tiếp cận</strong> → <strong>các vùng du lịch trên thế giới</strong> → <strong>tác động kinh tế, môi trường, xã hội</strong> → <strong>du lịch bền vững, biến đổi khí hậu &amp; xu hướng không gian mới</strong>. Đây là phần lý thuyết/toàn cầu của địa lý du lịch — điểm đến &amp; tuyến du lịch cụ thể của Việt Nam nằm ở môn TTD202. Bám giáo trình Hall &amp; Page, Williams &amp; Lew, UNWTO; song ngữ, có quiz mỗi chương.',
    whatYouLearn: 'Hệ thống du lịch (Leiper) & nhân tố đẩy/kéo; tài nguyên tự nhiên & nhân văn và tiêu chí đánh giá; cầu du lịch, cầu hiệu quả/tiềm ẩn, mô hình hấp dẫn & suy giảm theo khoảng cách; điểm đến, vùng du lịch, TALC của Butler, sức chứa (vật lý/sinh thái/xã hội/kinh tế) & quá tải du lịch; giao thông, khả năng tiếp cận, hub-and-spoke, thành phố cửa ngõ, hội tụ thời gian-không gian; các vùng du lịch thế giới theo UNWTO; tác động kinh tế/môi trường/xã hội-văn hoá của du lịch; du lịch bền vững, biến đổi khí hậu & xu hướng không gian mới.',
    requirements: 'Kiến thức địa lý phổ thông cơ bản; không yêu cầu môn tiên quyết đặc biệt. Xem điều kiện tiên quyết chính thức trong khung chương trình khối Quản trị Kinh doanh trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách tham khảo, UNWTO, dữ liệu thống kê, YouTube, công cụ, lộ trình tự học.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Địa lý du lịch nghiên cứu gì; khác TTD202 thế nào; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & khái niệm nền|||Chapter 1 — Overview & core concepts', description: 'Hệ thống du lịch (Leiper), nhân tố đẩy/kéo.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tài nguyên tự nhiên & nhân văn|||Chapter 2 — Natural & cultural resources', description: 'Khí hậu, địa hình, di sản, văn hoá sống; tiêu chí đánh giá.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Cầu, dòng khách & mô hình không gian|||Chapter 3 — Demand, flows & spatial models', description: 'Nhân tố cầu, mô hình hấp dẫn, suy giảm theo khoảng cách.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Điểm đến, vùng du lịch & sức chứa|||Chapter 4 — Destinations & carrying capacity', description: 'TALC của Butler; sức chứa vật lý/sinh thái/xã hội/kinh tế.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Giao thông & khả năng tiếp cận|||Chapter 5 — Transport & accessibility', description: 'Vận tải, hub-and-spoke, thành phố cửa ngõ.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Các vùng du lịch trên thế giới|||Chapter 6 — World tourism regions', description: 'Phân vùng UNWTO; du lịch nội vùng vs liên vùng.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Tác động của du lịch|||Chapter 7 — Impacts of tourism', description: 'Kinh tế, môi trường, xã hội-văn hoá.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Bền vững, khí hậu & xu hướng|||Chapter 8 — Sustainability, climate & trends', description: 'Du lịch bền vững, biến đổi khí hậu, xu hướng không gian mới.', lessons: [c8, c8q] },
  ],
};
