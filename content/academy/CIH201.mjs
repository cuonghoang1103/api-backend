/**
 * CIH201 — Contemporary Issues in Hotel and Tourism Management. Giáo trình
 * (syl): Tourism Management (Weaver & Lawton); Contemporary Hospitality
 * Management (Boella); Hospitality Management (Walker); UNWTO reports.
 * 8 chương: tổng quan & xu hướng toàn cầu, bền vững, chuyển đổi số, trải
 * nghiệm khách hàng, nhân sự, khủng hoảng & phục hồi, cộng đồng & văn hoá VN,
 * marketing điểm đến & tương lai. Song ngữ + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). KHÔNG backtick/dollar-brace lồng.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('cih201-0-0-tai-lieu', 'Course materials & references|||Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách tham khảo, báo cáo UNWTO, trang tin ngành, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">CIH201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Contemporary Issues in Hotel and Tourism Management — industry structure, sustainability, technology, workforce, crisis management, culture and marketing — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for CIH201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Tourism Management</em> — Weaver &amp; Lawton (industry structure, trends, sustainability).</li>
<li><em>Contemporary Hospitality Management</em> — Boella (workforce, service, contemporary issues).</li>
<li><em>Hospitality Management: A Capstone Approach</em> — Walker (operations across hotel departments).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.unwto.org/" target="_blank" rel="noopener">UNWTO — World Tourism Organization</a> — global data, barometer, Global Code of Ethics for Tourism.</li>
<li><a href="https://www.hospitalitynet.org/" target="_blank" rel="noopener">Hospitality Net</a> — industry news &amp; analysis.</li>
<li><a href="https://skift.com/" target="_blank" rel="noopener">Skift</a> — travel &amp; tourism industry research.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@UNWTO" target="_blank" rel="noopener">UNWTO</a> — official reports &amp; global tourism data.</li>
<li><a href="https://www.youtube.com/@skift" target="_blank" rel="noopener">Skift</a> — travel industry news &amp; interviews.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.unwto.org/tourism-data" target="_blank" rel="noopener">UNWTO Tourism Data Dashboard</a> — free global arrivals &amp; recovery data.</li>
<li><a href="https://www.google.com/travel/hotels" target="_blank" rel="noopener">Google Hotels</a> — see live OTA distribution &amp; pricing in practice.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — industry structure (accommodation, transport, intermediaries, DMOs) and current global trends.</li>
<li><strong>Core issues</strong> — sustainability, digital transformation, guest experience, workforce.</li>
<li><strong>Applied</strong> — crisis management, community &amp; cultural tourism, with Vietnam case studies.</li>
<li><strong>Forward-looking</strong> — destination marketing, social media, and where the industry is heading.</li>
</ol></div>`,
    `<span class="eyebrow">CIH201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Các vấn đề đương đại trong Quản trị Khách sạn và Du lịch — cấu trúc ngành, bền vững, công nghệ, nhân sự, quản trị khủng hoảng, văn hoá và marketing — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của CIH201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Tourism Management</em> — Weaver &amp; Lawton (cấu trúc ngành, xu hướng, bền vững).</li>
<li><em>Contemporary Hospitality Management</em> — Boella (nhân sự, dịch vụ, vấn đề đương đại).</li>
<li><em>Hospitality Management: A Capstone Approach</em> — Walker (vận hành các bộ phận khách sạn).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.unwto.org/" target="_blank" rel="noopener">UNWTO — Tổ chức Du lịch Thế giới</a> — dữ liệu toàn cầu, báo cáo định kỳ, Bộ Quy tắc Đạo đức Du lịch Toàn cầu.</li>
<li><a href="https://www.hospitalitynet.org/" target="_blank" rel="noopener">Hospitality Net</a> — tin tức &amp; phân tích ngành.</li>
<li><a href="https://skift.com/" target="_blank" rel="noopener">Skift</a> — nghiên cứu ngành du lịch &amp; khách sạn.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@UNWTO" target="_blank" rel="noopener">UNWTO</a> — báo cáo chính thức &amp; dữ liệu du lịch toàn cầu.</li>
<li><a href="https://www.youtube.com/@skift" target="_blank" rel="noopener">Skift</a> — tin tức &amp; phỏng vấn ngành du lịch.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.unwto.org/tourism-data" target="_blank" rel="noopener">UNWTO Tourism Data Dashboard</a> — dữ liệu lượt khách &amp; phục hồi toàn cầu, miễn phí.</li>
<li><a href="https://www.google.com/travel/hotels" target="_blank" rel="noopener">Google Hotels</a> — quan sát phân phối &amp; giá qua OTA trong thực tế.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — cấu trúc ngành (lưu trú, vận chuyển, trung gian, DMO) và xu hướng toàn cầu hiện nay.</li>
<li><strong>Vấn đề cốt lõi</strong> — bền vững, chuyển đổi số, trải nghiệm khách hàng, nhân sự.</li>
<li><strong>Ứng dụng</strong> — quản trị khủng hoảng, du lịch cộng đồng &amp; văn hoá, có case Việt Nam.</li>
<li><strong>Hướng tới tương lai</strong> — marketing điểm đến, mạng xã hội, và ngành đang đi về đâu.</li>
</ol></div>`,
  ]]);

const intro = doc('cih201-0-1-overview', 'Course overview: Contemporary issues in hotel and tourism management|||Tổng quan môn học: Các vấn đề đương đại trong Quản trị Khách sạn và Du lịch',
  'Ngành khách sạn - du lịch là gì, tại sao cần học "vấn đề đương đại"; lộ trình 8 chương từ cấu trúc ngành đến tương lai ngành.',
  [[
    `<span class="eyebrow">CIH201 · Lesson 0.1 · Overview</span>
<h2>Contemporary Issues in Hotel and Tourism Management</h2>
<p class="lead">Hotels and tourism form one of the world's largest employers and export earners — but the industry is being reshaped fast by sustainability pressure, digital disruption, labour shortages, recurring crises, and shifting traveller expectations. This course studies those <strong>contemporary issues</strong> so you can manage, not just react to, a fast-changing industry.</p>
<h3>Roadmap</h3>
<ul>
<li><strong>Ch.1</strong> Industry structure &amp; global trends</li>
<li><strong>Ch.2</strong> Sustainable &amp; responsible tourism</li>
<li><strong>Ch.3</strong> Digital transformation &amp; technology</li>
<li><strong>Ch.4</strong> Guest experience &amp; personalization</li>
<li><strong>Ch.5</strong> Workforce &amp; the labour shortage</li>
<li><strong>Ch.6</strong> Crisis management &amp; recovery</li>
<li><strong>Ch.7</strong> Community, cultural tourism &amp; the Vietnam context</li>
<li><strong>Ch.8</strong> Destination marketing, social media &amp; the future</li>
</ul>
<p>Bilingual lessons follow <strong>Tourism Management</strong> (Weaver &amp; Lawton), <strong>Contemporary Hospitality Management</strong> (Boella), <strong>Hospitality Management</strong> (Walker) and UNWTO reports, with a quiz per chapter.</p>`,
    `<span class="eyebrow">CIH201 · Bài 0.1 · Tổng quan</span>
<h2>Các vấn đề đương đại trong Quản trị Khách sạn và Du lịch</h2>
<p class="lead">Khách sạn &amp; du lịch là một trong những ngành tạo việc làm và thu ngoại tệ lớn nhất thế giới — nhưng ngành đang đổi rất nhanh dưới áp lực bền vững, gián đoạn số, thiếu lao động, khủng hoảng lặp lại, và kỳ vọng khách hàng thay đổi. Môn này nghiên cứu các <strong>vấn đề đương đại</strong> đó để bạn có thể quản trị, không chỉ phản ứng, với một ngành thay đổi nhanh.</p>
<h3>Lộ trình</h3>
<ul>
<li><strong>Ch.1</strong> Cấu trúc ngành &amp; xu hướng toàn cầu</li>
<li><strong>Ch.2</strong> Du lịch bền vững &amp; có trách nhiệm</li>
<li><strong>Ch.3</strong> Chuyển đổi số &amp; công nghệ</li>
<li><strong>Ch.4</strong> Trải nghiệm khách hàng &amp; cá nhân hoá</li>
<li><strong>Ch.5</strong> Nhân sự &amp; thiếu hụt lao động</li>
<li><strong>Ch.6</strong> Quản trị khủng hoảng &amp; phục hồi</li>
<li><strong>Ch.7</strong> Du lịch cộng đồng, văn hoá &amp; bối cảnh Việt Nam</li>
<li><strong>Ch.8</strong> Marketing điểm đến, mạng xã hội &amp; tương lai ngành</li>
</ul>
<p>Bài giảng song ngữ bám theo <strong>Tourism Management</strong> (Weaver &amp; Lawton), <strong>Contemporary Hospitality Management</strong> (Boella), <strong>Hospitality Management</strong> (Walker) và báo cáo UNWTO, có quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('cih201-1-1-industry-overview', '1.1 — Industry overview & global trends|||1.1 — Tổng quan ngành & xu hướng toàn cầu',
  'Cấu trúc ngành (lưu trú, vận chuyển, F&amp;B, trung gian, DMO); xu hướng toàn cầu: kinh tế trải nghiệm, bleisure, phục hồi không đều, hợp nhất tập đoàn.',
  [[
    `<span class="eyebrow">CIH201 · Chapter 1 · Lesson 1.1</span>
<h2>Industry overview &amp; global trends</h2>
<h3>How the industry fits together</h3>
<p>The <strong>hotel and tourism industry</strong> is a network of interdependent sectors: <strong>accommodation</strong> (hotels, resorts, homestays), <strong>transport</strong> (airlines, cruise lines, ground transport), <strong>food &amp; beverage</strong>, <strong>attractions &amp; events</strong>, and <strong>intermediaries</strong> — tour operators, travel agents, and Online Travel Agencies (OTAs) such as Booking.com or Agoda. A <strong>Destination Management Organization (DMO)</strong> coordinates marketing and planning for a place as a whole.</p>
<h3>Trends reshaping the industry (UNWTO data)</h3>
<ul>
<li><strong>Experience economy</strong> — travellers pay for memorable experiences, not just a bed or a flight.</li>
<li><strong>Bleisure &amp; staycations</strong> — business trips extended for leisure; short breaks close to home.</li>
<li><strong>Slow, uneven recovery</strong> — international arrivals only passed pre-pandemic levels around 2024, unevenly across regions (UNWTO World Tourism Barometer).</li>
<li><strong>Consolidation</strong> — large hotel groups (Marriott, Accor, IHG) grow mainly through management &amp; franchise contracts, not property ownership.</li>
</ul>
<pre><code>Industry map:
 Accommodation + Transport + F&amp;B + Attractions
        -&gt; sold via Intermediaries (agents, OTAs, DMOs)
        -&gt; to the Traveller
</code></pre>
<div class="callout"><span class="badge">Why "contemporary issues"</span> This course studies the pressures reshaping that map today: sustainability, technology, workforce, crises, culture and marketing — the themes of Chapters 2 to 8.</div>`,
    `<span class="eyebrow">CIH201 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan ngành &amp; xu hướng toàn cầu</h2>
<h3>Cấu trúc ngành liên kết ra sao</h3>
<p>Ngành <strong>khách sạn &amp; du lịch</strong> là một mạng lưới các phân ngành liên kết: <strong>lưu trú</strong> (khách sạn, resort, homestay), <strong>vận chuyển</strong> (hàng không, tàu biển, vận chuyển mặt đất), <strong>ẩm thực (F&amp;B)</strong>, <strong>điểm tham quan &amp; sự kiện</strong>, và <strong>trung gian</strong> — công ty lữ hành, đại lý du lịch, và các đại lý du lịch trực tuyến (OTA) như Booking.com hay Agoda. Một <strong>Tổ chức Quản lý Điểm đến (DMO)</strong> điều phối marketing và quy hoạch cho cả một điểm đến.</p>
<h3>Xu hướng đang định hình lại ngành (dữ liệu UNWTO)</h3>
<ul>
<li><strong>Kinh tế trải nghiệm</strong> — khách hàng trả tiền cho trải nghiệm đáng nhớ, không chỉ cho phòng ngủ hay chuyến bay.</li>
<li><strong>Bleisure &amp; staycation</strong> — chuyến công tác kéo dài thêm để nghỉ dưỡng; kỳ nghỉ ngắn gần nhà.</li>
<li><strong>Phục hồi chậm, không đều</strong> — lượt khách quốc tế chỉ vượt mức trước đại dịch vào khoảng 2024, không đều giữa các khu vực (báo cáo UNWTO).</li>
<li><strong>Hợp nhất tập đoàn</strong> — các tập đoàn khách sạn lớn (Marriott, Accor, IHG) tăng trưởng chủ yếu qua hợp đồng quản lý &amp; nhượng quyền, không phải sở hữu bất động sản.</li>
</ul>
<pre><code>Bản đồ ngành:
 Lưu trú + Vận chuyển + F&amp;B + Điểm tham quan
        -&gt; bán qua Trung gian (đại lý, OTA, DMO)
        -&gt; đến Khách du lịch
</code></pre>
<div class="callout"><span class="badge">Vì sao gọi là "vấn đề đương đại"</span> Môn này nghiên cứu các áp lực đang định hình lại bản đồ đó hôm nay: bền vững, công nghệ, nhân sự, khủng hoảng và marketing — chủ đề của Chương 2 đến 8.</div>`,
  ]]);

const c1q = quiz('cih201-quiz-1', 'Quiz 1 — Industry overview|||Quiz 1 — Tổng quan ngành', [
  { id: 'q1', question: 'DMO trong ngành du lịch là viết tắt của?', options: ['Destination Management Organization', 'Digital Marketing Office', 'Domestic Migration Organization', 'Duty Manager Order'], correctIndex: 0, explanation: 'DMO — tổ chức quản lý điểm đến, điều phối marketing và quy hoạch cho một điểm đến.' },
  { id: 'q2', question: 'Kinh tế trải nghiệm (experience economy) trong ngành khách sạn - du lịch nghĩa là gì?', options: ['Khách chỉ quan tâm giá phòng thấp nhất', 'Khách trả tiền cho trải nghiệm đáng nhớ, không chỉ dịch vụ cơ bản', 'Chỉ áp dụng cho khách sạn 5 sao', 'Không liên quan đến hành vi tiêu dùng'], correctIndex: 1, explanation: 'Kinh tế trải nghiệm: giá trị nằm ở trải nghiệm đáng nhớ mà khách nhận được, không chỉ ở phòng ngủ hay chuyến bay.' },
  { id: 'q3', question: 'Các tập đoàn khách sạn lớn (Marriott, Accor, IHG) tăng trưởng chủ yếu qua hình thức nào?', options: ['Mua đứt toàn bộ bất động sản', 'Hợp đồng quản lý & nhượng quyền (franchise)', 'Vay ngân hàng để tự xây 100% khách sạn', 'Chỉ đầu tư vào một quốc gia duy nhất'], correctIndex: 1, explanation: 'Các tập đoàn lớn thường không sở hữu bất động sản mà quản lý/nhượng quyền thương hiệu cho chủ đầu tư.' },
]);

const c2 = doc('cih201-2-1-sustainable-tourism', '2.1 — Sustainable & responsible tourism|||2.1 — Du lịch bền vững & có trách nhiệm',
  'Ba trụ cột bền vững (môi trường-xã hội-kinh tế); overtourism & khả năng chịu tải; chứng nhận xanh; Bộ Quy tắc Đạo đức Du lịch Toàn cầu (UNWTO).',
  [[
    `<span class="eyebrow">CIH201 · Chapter 2 · Lesson 2.1</span>
<h2>Sustainable &amp; responsible tourism</h2>
<h3>The triple bottom line</h3>
<p><strong>Sustainable tourism</strong> balances three pillars: <strong>environmental</strong> (protecting ecosystems, resources, wildlife), <strong>social &amp; cultural</strong> (respecting host communities and heritage), and <strong>economic</strong> (fair, long-term local benefit) — not growth at any cost.</p>
<h3>Overtourism &amp; carrying capacity</h3>
<p><strong>Overtourism</strong> happens when visitor numbers exceed a destination's <strong>carrying capacity</strong> — the environment, infrastructure, or resident tolerance breaks down (crowding, price inflation, resource strain). Cities like Venice and Bali have introduced visitor caps or tourist taxes in response.</p>
<h3>Certifications &amp; codes</h3>
<ul>
<li><strong>Green certifications</strong> (e.g. Green Key, Travelife) audit hotels on energy, water, waste and community practices.</li>
<li><strong>UNWTO Global Code of Ethics for Tourism</strong> — a voluntary framework of principles for governments, businesses and travellers.</li>
<li><strong>Responsible tourism</strong> shifts responsibility to every actor — operators design lower-impact trips, travellers choose them.</li>
</ul>
<div class="callout"><span class="badge">Not the same thing</span> Sustainable tourism is the <em>goal</em> (a balanced system); responsible tourism is the <em>behaviour</em> that gets you there.</div>`,
    `<span class="eyebrow">CIH201 · Chương 2 · Bài 2.1</span>
<h2>Du lịch bền vững &amp; có trách nhiệm</h2>
<h3>Ba trụ cột bền vững</h3>
<p><strong>Du lịch bền vững</strong> cân bằng ba trụ cột: <strong>môi trường</strong> (bảo vệ hệ sinh thái, tài nguyên, động vật hoang dã), <strong>xã hội &amp; văn hoá</strong> (tôn trọng cộng đồng bản địa và di sản), và <strong>kinh tế</strong> (lợi ích công bằng, lâu dài cho địa phương) — không phải tăng trưởng bằng mọi giá.</p>
<h3>Overtourism &amp; khả năng chịu tải</h3>
<p><strong>Overtourism (quá tải du lịch)</strong> xảy ra khi lượng khách vượt <strong>khả năng chịu tải</strong> của điểm đến — môi trường, hạ tầng, hoặc sự chịu đựng của người dân địa phương bị phá vỡ (đông đúc, giá tăng, tài nguyên cạn). Venice và Bali đã áp giới hạn khách hoặc thuế du lịch để đối phó.</p>
<h3>Chứng nhận &amp; quy tắc</h3>
<ul>
<li><strong>Chứng nhận xanh</strong> (vd Green Key, Travelife) kiểm định khách sạn về năng lượng, nước, rác thải và thực hành với cộng đồng.</li>
<li><strong>Bộ Quy tắc Đạo đức Du lịch Toàn cầu (UNWTO)</strong> — khung nguyên tắc tự nguyện cho chính phủ, doanh nghiệp và du khách.</li>
<li><strong>Du lịch có trách nhiệm</strong> đặt trách nhiệm lên mọi bên — nhà điều hành thiết kế chuyến đi ít tác động, du khách chọn chúng.</li>
</ul>
<div class="callout"><span class="badge">Không giống nhau</span> Du lịch bền vững là <em>mục tiêu</em> (một hệ thống cân bằng); du lịch có trách nhiệm là <em>hành vi</em> để đạt tới đó.</div>`,
  ]]);

const c2q = quiz('cih201-quiz-2', 'Quiz 2 — Sustainable tourism|||Quiz 2 — Du lịch bền vững', [
  { id: 'q1', question: 'Ba trụ cột của du lịch bền vững (triple bottom line) gồm?', options: ['Giá rẻ - nhanh - tiện', 'Môi trường - Xã hội/văn hoá - Kinh tế', 'Marketing - Bán hàng - Vận hành', 'Khách sạn - Hàng không - Lữ hành'], correctIndex: 1, explanation: 'Bền vững cân bằng ba trụ cột: môi trường, xã hội/văn hoá, và kinh tế.' },
  { id: 'q2', question: 'Overtourism (quá tải du lịch) là gì?', options: ['Khách sạn hết phòng vào cao điểm', 'Lượng khách vượt khả năng chịu tải của điểm đến', 'Một loại thuế du lịch mới', 'Chiến lược marketing thu hút thêm khách'], correctIndex: 1, explanation: 'Overtourism: số khách vượt ngưỡng mà môi trường/hạ tầng/cộng đồng địa phương có thể chịu đựng.' },
  { id: 'q3', question: 'Bộ Quy tắc Đạo đức Du lịch Toàn cầu do tổ chức nào ban hành?', options: ['WHO', 'UNWTO', 'IATA', 'World Bank'], correctIndex: 1, explanation: 'UNWTO (Tổ chức Du lịch Thế giới) ban hành Bộ Quy tắc Đạo đức Du lịch Toàn cầu.' },
]);

const c3 = doc('cih201-3-1-digital-transformation', '3.1 — Digital transformation & technology|||3.1 — Chuyển đổi số & công nghệ',
  'OTA & phân phối; PMS/CRS/RMS; khách sạn thông minh (IoT, check-in không tiếp xúc, chatbot); channel manager; cá nhân hoá qua CRM.',
  [[
    `<span class="eyebrow">CIH201 · Chapter 3 · Lesson 3.1</span>
<h2>Digital transformation &amp; technology</h2>
<h3>Distribution: how a room gets sold</h3>
<p>A hotel sells rooms through many channels: its own website, phone, walk-in, travel agents, and <strong>OTAs</strong> (Online Travel Agencies) like Booking.com, Agoda or Expedia — which take a commission (often 15 to 25%) in exchange for reach. A <strong>channel manager</strong> syncs availability and rates across all these channels in real time to avoid overbooking.</p>
<h3>The technology stack behind the front desk</h3>
<ul>
<li><strong>PMS (Property Management System)</strong> — the hotel's core system: reservations, check-in/out, housekeeping, billing.</li>
<li><strong>CRS (Central Reservation System)</strong> — manages reservations across multiple properties/brands.</li>
<li><strong>RMS (Revenue Management System)</strong> — adjusts prices dynamically based on demand, similar to airline pricing.</li>
</ul>
<h3>The smart hotel</h3>
<p>IoT sensors, keyless mobile check-in, in-room voice assistants, and AI chatbots for guest service are becoming standard — reducing friction and staff workload while creating rich guest data.</p>
<div class="callout"><span class="badge">Data is the point</span> Every booking and stay feeds a guest profile in the <strong>CRM</strong> — the foundation for the personalization covered in Chapter 4.</div>`,
    `<span class="eyebrow">CIH201 · Chương 3 · Bài 3.1</span>
<h2>Chuyển đổi số &amp; công nghệ</h2>
<h3>Phân phối: một phòng được bán ra sao</h3>
<p>Khách sạn bán phòng qua nhiều kênh: website riêng, điện thoại, khách vãng lai, đại lý du lịch, và <strong>OTA</strong> (đại lý du lịch trực tuyến) như Booking.com, Agoda hay Expedia — thu hoa hồng (thường 15-25%) đổi lại độ tiếp cận. Một <strong>channel manager</strong> đồng bộ tình trạng phòng &amp; giá trên tất cả các kênh theo thời gian thực để tránh overbooking.</p>
<h3>Nền công nghệ phía sau lễ tân</h3>
<ul>
<li><strong>PMS (Property Management System)</strong> — hệ thống lõi của khách sạn: đặt phòng, check-in/out, buồng phòng, thanh toán.</li>
<li><strong>CRS (Central Reservation System)</strong> — quản lý đặt phòng trên nhiều cơ sở/thương hiệu.</li>
<li><strong>RMS (Revenue Management System)</strong> — điều chỉnh giá động theo nhu cầu, tương tự cách hàng không định giá.</li>
</ul>
<h3>Khách sạn thông minh</h3>
<p>Cảm biến IoT, check-in không cần chìa khoá qua điện thoại, trợ lý giọng nói trong phòng, và chatbot AI phục vụ khách đang trở thành tiêu chuẩn — giảm ma sát và tải công việc cho nhân viên, đồng thời tạo ra dữ liệu khách phong phú.</p>
<div class="callout"><span class="badge">Dữ liệu là mấu chốt</span> Mỗi lượt đặt phòng và lưu trú đều nuôi hồ sơ khách trong <strong>CRM</strong> — nền tảng cho cá nhân hoá ở Chương 4.</div>`,
  ]]);

const c3q = quiz('cih201-quiz-3', 'Quiz 3 — Digital transformation|||Quiz 3 — Chuyển đổi số', [
  { id: 'q1', question: 'PMS trong khách sạn là viết tắt của?', options: ['Property Management System', 'Personal Marketing Software', 'Payment Management Service', 'Public Media System'], correctIndex: 0, explanation: 'PMS — hệ thống quản lý tài sản/khách sạn: đặt phòng, check-in/out, buồng phòng, thanh toán.' },
  { id: 'q2', question: 'Vai trò chính của channel manager là gì?', options: ['Quản lý nhân viên buồng phòng', 'Đồng bộ phòng trống & giá trên nhiều kênh phân phối cùng lúc', 'Thiết kế website khách sạn', 'Chấm điểm đánh giá khách hàng'], correctIndex: 1, explanation: 'Channel manager đồng bộ availability/rate qua OTA, website riêng, đại lý... để tránh overbooking.' },
  { id: 'q3', question: 'RMS (Revenue Management System) dùng để làm gì?', options: ['Quản lý hồ sơ nhân sự', 'Điều chỉnh giá phòng động theo nhu cầu thị trường', 'Lưu trữ hình ảnh khách sạn', 'Chỉ dùng cho khách sạn nhỏ'], correctIndex: 1, explanation: 'RMS tối ưu doanh thu bằng cách điều chỉnh giá theo nhu cầu, tương tự định giá của hàng không.' },
]);

const c4 = doc('cih201-4-1-guest-experience', '4.1 — Guest experience & personalization|||4.1 — Trải nghiệm khách hàng & cá nhân hoá',
  'Hành trình khách hàng (trước-trong-sau lưu trú); mô hình khoảng cách dịch vụ (SERVQUAL); cá nhân hoá qua hồ sơ khách & CRM; quản trị đánh giá trực tuyến.',
  [[
    `<span class="eyebrow">CIH201 · Chapter 4 · Lesson 4.1</span>
<h2>Guest experience &amp; personalization</h2>
<h3>The guest journey</h3>
<p>Guest experience is managed across three stages: <strong>pre-stay</strong> (search, booking, pre-arrival communication), <strong>in-stay</strong> (check-in, service delivery, on-site touchpoints), and <strong>post-stay</strong> (checkout, feedback, loyalty follow-up). Every touchpoint is a chance to build — or break — satisfaction.</p>
<h3>Measuring service quality: the gaps model</h3>
<p>The <strong>SERVQUAL</strong> model measures the <strong>gap</strong> between what a guest expects and what they perceive they received, across dimensions such as reliability, responsiveness, and tangibles. A persistent negative gap signals a real operational problem, not just "bad luck".</p>
<h3>Personalization</h3>
<ul>
<li><strong>Guest profiles</strong> in the CRM store preferences (room type, pillow, allergies) built from past stays.</li>
<li><strong>Loyalty programs</strong> reward repeat guests and generate the data that fuels personalization.</li>
<li><strong>Online reviews</strong> (TripAdvisor, Google) are now part of the guest journey itself — read before booking, written after checkout.</li>
</ul>
<div class="callout"><span class="badge">Reputation management</span> Responding promptly and specifically to reviews (not with a generic template) is now a core hospitality skill, not an afterthought.</div>`,
    `<span class="eyebrow">CIH201 · Chương 4 · Bài 4.1</span>
<h2>Trải nghiệm khách hàng &amp; cá nhân hoá</h2>
<h3>Hành trình khách hàng</h3>
<p>Trải nghiệm khách được quản trị qua ba giai đoạn: <strong>trước lưu trú</strong> (tìm kiếm, đặt phòng, liên hệ trước khi đến), <strong>trong lưu trú</strong> (check-in, phục vụ, các điểm chạm tại chỗ), và <strong>sau lưu trú</strong> (check-out, phản hồi, chăm sóc lòng trung thành). Mỗi điểm chạm là một cơ hội xây dựng — hoặc phá vỡ — sự hài lòng.</p>
<h3>Đo chất lượng dịch vụ: mô hình khoảng cách</h3>
<p>Mô hình <strong>SERVQUAL</strong> đo <strong>khoảng cách</strong> giữa điều khách kỳ vọng và điều khách cảm nhận đã nhận được, qua các khía cạnh như độ tin cậy, khả năng phản hồi, và yếu tố hữu hình. Khoảng cách âm kéo dài báo hiệu vấn đề vận hành thật, không chỉ là "xui".</p>
<h3>Cá nhân hoá</h3>
<ul>
<li><strong>Hồ sơ khách</strong> trong CRM lưu sở thích (loại phòng, gối, dị ứng) đúc kết từ các lần lưu trú trước.</li>
<li><strong>Chương trình khách hàng thân thiết</strong> thưởng cho khách quay lại và tạo ra dữ liệu nuôi cá nhân hoá.</li>
<li><strong>Đánh giá trực tuyến</strong> (TripAdvisor, Google) nay là một phần của hành trình khách — đọc trước khi đặt, viết sau khi trả phòng.</li>
</ul>
<div class="callout"><span class="badge">Quản trị danh tiếng</span> Phản hồi đánh giá nhanh và cụ thể (không dùng mẫu chung) nay là kỹ năng cốt lõi của ngành khách sạn, không phải việc phụ.</div>`,
  ]]);

const c4q = quiz('cih201-quiz-4', 'Quiz 4 — Guest experience|||Quiz 4 — Trải nghiệm khách hàng', [
  { id: 'q1', question: 'Mô hình SERVQUAL dùng để đo điều gì?', options: ['Giá phòng cạnh tranh', 'Khoảng cách giữa kỳ vọng và cảm nhận của khách về chất lượng dịch vụ', 'Số lượng phòng trống', 'Doanh thu theo tháng'], correctIndex: 1, explanation: 'SERVQUAL đo khoảng cách (gap) giữa kỳ vọng và trải nghiệm thực tế của khách.' },
  { id: 'q2', question: 'Ba giai đoạn của hành trình khách hàng gồm?', options: ['Đặt phòng - hủy phòng - đặt lại', 'Trước lưu trú - trong lưu trú - sau lưu trú', 'Sáng - trưa - tối', 'Marketing - bán hàng - vận hành'], correctIndex: 1, explanation: 'Hành trình khách: trước lưu trú, trong lưu trú, sau lưu trú — mỗi giai đoạn có điểm chạm riêng.' },
  { id: 'q3', question: 'Cá nhân hoá dịch vụ khách sạn chủ yếu dựa vào đâu?', options: ['Hồ sơ khách & dữ liệu CRM từ các lần lưu trú trước', 'Đoán ngẫu nhiên sở thích khách', 'Chỉ áp dụng giá thấp nhất', 'Không cần dữ liệu gì'], correctIndex: 0, explanation: 'Cá nhân hoá dựa trên hồ sơ khách (guest profile) và dữ liệu CRM tích lũy qua các lần lưu trú.' },
]);

const c5 = doc('cih201-5-1-workforce', '5.1 — Workforce & the labour shortage|||5.1 — Nhân sự & thiếu hụt lao động ngành',
  'Nguyên nhân thiếu hụt lao động sau đại dịch; tuyển dụng & employer branding; xu hướng lương & lao động linh hoạt; giữ chân nhân viên.',
  [[
    `<span class="eyebrow">CIH201 · Chapter 5 · Lesson 5.1</span>
<h2>Workforce &amp; the labour shortage</h2>
<h3>Why the industry struggles to staff up</h3>
<p>Hospitality has one of the highest staff turnover rates of any industry. Post-pandemic, many workers who left during closures did not return — drawn by better pay, more predictable hours, or remote work elsewhere. The result is a persistent <strong>labour shortage</strong>, especially for housekeeping, kitchen, and front-line service roles.</p>
<h3>Attracting talent: employer branding</h3>
<p><strong>Employer branding</strong> is how an organization markets itself as a place to work, not just a place to stay — career paths, training, culture, and benefits communicated the same way a hotel markets its rooms to guests.</p>
<h3>Flexible staffing &amp; retention</h3>
<ul>
<li><strong>Gig / part-time staffing platforms</strong> and outsourced housekeeping fill short-term gaps, but risk consistency and training depth.</li>
<li><strong>Wage growth &amp; benefits</strong> — many markets have raised entry wages to compete with retail and delivery jobs.</li>
<li><strong>Employee experience</strong> — cross-training, clear promotion paths, and manageable schedules reduce turnover more reliably than pay alone.</li>
</ul>
<div class="callout"><span class="badge">A service-quality problem, not just an HR problem</span> Understaffing shows up directly in Chapter 4's guest experience — a short-staffed front desk cannot deliver a personalized stay.</div>`,
    `<span class="eyebrow">CIH201 · Chương 5 · Bài 5.1</span>
<h2>Nhân sự &amp; thiếu hụt lao động ngành</h2>
<h3>Vì sao ngành khó tuyển đủ người</h3>
<p>Khách sạn - du lịch có tỉ lệ nghỉ việc thuộc hàng cao nhất trong mọi ngành. Sau đại dịch, nhiều lao động rời ngành trong thời gian đóng cửa đã không trở lại — vì lương tốt hơn, giờ làm ổn định hơn, hoặc công việc từ xa ở nơi khác. Kết quả là <strong>thiếu hụt lao động</strong> kéo dài, đặc biệt ở buồng phòng, bếp, và các vị trí phục vụ trực tiếp.</p>
<h3>Thu hút nhân tài: employer branding</h3>
<p><strong>Employer branding (xây dựng thương hiệu nhà tuyển dụng)</strong> là cách tổ chức tự tiếp thị mình là nơi làm việc, không chỉ là nơi để ở — lộ trình nghề nghiệp, đào tạo, văn hoá và phúc lợi được truyền thông giống cách khách sạn tiếp thị phòng cho khách.</p>
<h3>Lao động linh hoạt &amp; giữ chân nhân viên</h3>
<ul>
<li><strong>Nền tảng lao động thời vụ/bán thời gian</strong> và buồng phòng thuê ngoài lấp khoảng trống ngắn hạn, nhưng đánh đổi tính nhất quán và độ sâu đào tạo.</li>
<li><strong>Tăng lương &amp; phúc lợi</strong> — nhiều thị trường đã nâng lương khởi điểm để cạnh tranh với bán lẻ và giao hàng.</li>
<li><strong>Trải nghiệm nhân viên</strong> — đào tạo chéo, lộ trình thăng tiến rõ ràng, và lịch làm hợp lý giữ chân nhân viên hiệu quả hơn chỉ tăng lương.</li>
</ul>
<div class="callout"><span class="badge">Vấn đề chất lượng dịch vụ, không chỉ vấn đề nhân sự</span> Thiếu người thể hiện trực tiếp lên trải nghiệm khách ở Chương 4 — một lễ tân thiếu người không thể tạo ra một kỳ nghỉ cá nhân hoá.</div>`,
  ]]);

const c5q = quiz('cih201-quiz-5', 'Quiz 5 — Workforce|||Quiz 5 — Nhân sự & lao động', [
  { id: 'q1', question: 'Nguyên nhân chính gây thiếu hụt lao động ngành khách sạn sau đại dịch?', options: ['Ngành tăng trưởng quá nhanh không kịp mở trường đào tạo', 'Nhiều lao động rời ngành trong thời gian đóng cửa và không trở lại', 'Chính phủ cấm tuyển dụng lao động mới', 'Không có nguyên nhân rõ ràng'], correctIndex: 1, explanation: 'Nhiều lao động chuyển sang việc khác có lương/giờ làm tốt hơn trong thời gian ngành đóng cửa và không quay lại.' },
  { id: 'q2', question: 'Employer branding trong ngành khách sạn nghĩa là gì?', options: ['Thiết kế logo khách sạn', 'Tiếp thị tổ chức như một nơi làm việc hấp dẫn, giống cách tiếp thị phòng cho khách', 'Một loại chứng nhận xanh', 'Chỉ áp dụng cho quản lý cấp cao'], correctIndex: 1, explanation: 'Employer branding: truyền thông về lộ trình nghề nghiệp, đào tạo, văn hoá, phúc lợi để thu hút người lao động.' },
  { id: 'q3', question: 'Yếu tố nào giữ chân nhân viên hiệu quả hơn CHỈ tăng lương?', options: ['Không có yếu tố nào khác quan trọng bằng lương', 'Đào tạo chéo, lộ trình thăng tiến rõ ràng và lịch làm hợp lý', 'Bắt nhân viên làm thêm giờ không lương', 'Giảm số ngày nghỉ phép'], correctIndex: 1, explanation: 'Trải nghiệm nhân viên (đào tạo, thăng tiến, lịch làm hợp lý) giữ chân nhân viên bền hơn chỉ tăng lương.' },
]);

const c6 = doc('cih201-6-1-crisis-recovery', '6.1 — Crisis management & recovery|||6.1 — Quản trị khủng hoảng & phục hồi',
  'Các loại khủng hoảng ngành; chu trình quản trị khủng hoảng (phòng ngừa-chuẩn bị-ứng phó-phục hồi); case COVID-19; kế hoạch duy trì hoạt động.',
  [[
    `<span class="eyebrow">CIH201 · Chapter 6 · Lesson 6.1</span>
<h2>Crisis management &amp; recovery</h2>
<h3>What counts as a crisis</h3>
<p>Hotel and tourism businesses face recurring crises: <strong>pandemics</strong> (COVID-19), <strong>natural disasters</strong> (typhoons, earthquakes, flooding), <strong>economic shocks</strong> (currency crises, recessions), and <strong>security incidents</strong> (terrorism, political unrest). Tourism is uniquely exposed because demand can collapse to near zero overnight, with no way to store or resell an unsold room-night.</p>
<h3>The crisis management cycle</h3>
<pre><code>Prevention  -&gt; reduce risk before it happens (safety standards, diversification)
Preparedness -&gt; plans, training, insurance, emergency contacts
Response    -&gt; act during the crisis (guest safety, clear communication)
Recovery    -&gt; rebuild demand and trust after the crisis
</code></pre>
<h3>Case: COVID-19</h3>
<p>COVID-19 collapsed international travel almost completely in 2020. Recovery strategies included: pivoting to domestic/"staycation" demand, flexible cancellation policies to rebuild trust, government wage-support schemes, and eventually "travel bubbles" between low-risk countries.</p>
<h3>Business continuity planning (BCP)</h3>
<p>A <strong>BCP</strong> documents in advance how a business keeps operating — or reopens fastest — after disruption: backup staffing, cash reserves, insurance coverage, and a communication plan for guests and staff.</p>
<div class="callout"><span class="badge">Plan before, not during</span> Businesses with an existing BCP recovered demonstrably faster from COVID-19 than those improvising a response from scratch.</div>`,
    `<span class="eyebrow">CIH201 · Chương 6 · Bài 6.1</span>
<h2>Quản trị khủng hoảng &amp; phục hồi</h2>
<h3>Điều gì được coi là khủng hoảng</h3>
<p>Doanh nghiệp khách sạn - du lịch đối mặt khủng hoảng lặp lại: <strong>đại dịch</strong> (COVID-19), <strong>thiên tai</strong> (bão, động đất, lũ lụt), <strong>sốc kinh tế</strong> (khủng hoảng tiền tệ, suy thoái), và <strong>sự cố an ninh</strong> (khủng bố, bất ổn chính trị). Du lịch đặc biệt dễ tổn thương vì nhu cầu có thể sụp về gần bằng 0 chỉ trong một đêm, và một đêm phòng không bán được thì không thể lưu trữ hay bán lại.</p>
<h3>Chu trình quản trị khủng hoảng</h3>
<pre><code>Phòng ngừa   -&gt; giảm rủi ro trước khi xảy ra (tiêu chuẩn an toàn, đa dạng hoá)
Chuẩn bị     -&gt; kế hoạch, đào tạo, bảo hiểm, đầu mối liên hệ khẩn cấp
Ứng phó      -&gt; hành động trong khủng hoảng (an toàn khách, truyền thông rõ ràng)
Phục hồi     -&gt; xây lại nhu cầu và niềm tin sau khủng hoảng
</code></pre>
<h3>Case: COVID-19</h3>
<p>COVID-19 làm du lịch quốc tế sụp gần như hoàn toàn năm 2020. Chiến lược phục hồi gồm: chuyển hướng sang nhu cầu nội địa/"staycation", chính sách hủy phòng linh hoạt để lấy lại niềm tin, chương trình hỗ trợ lương của chính phủ, và cuối cùng là "bong bóng du lịch" giữa các nước rủi ro thấp.</p>
<h3>Kế hoạch duy trì hoạt động kinh doanh (BCP)</h3>
<p>Một <strong>BCP</strong> ghi lại trước cách doanh nghiệp tiếp tục hoạt động — hoặc mở lại nhanh nhất — sau gián đoạn: nhân sự dự phòng, dự trữ tiền mặt, bảo hiểm, và kế hoạch truyền thông cho khách &amp; nhân viên.</p>
<div class="callout"><span class="badge">Lập kế hoạch trước, không phải trong lúc khủng hoảng</span> Doanh nghiệp có BCP sẵn phục hồi rõ ràng nhanh hơn sau COVID-19 so với doanh nghiệp phải ứng biến từ đầu.</div>`,
  ]]);

const c6q = quiz('cih201-quiz-6', 'Quiz 6 — Crisis & recovery|||Quiz 6 — Khủng hoảng & phục hồi', [
  { id: 'q1', question: 'Bốn giai đoạn của chu trình quản trị khủng hoảng gồm?', options: ['Marketing - Bán hàng - Vận hành - Chăm sóc', 'Phòng ngừa - Chuẩn bị - Ứng phó - Phục hồi', 'Đặt phòng - Lưu trú - Trả phòng - Đánh giá', 'Tuyển dụng - Đào tạo - Vận hành - Sa thải'], correctIndex: 1, explanation: 'Chu trình quản trị khủng hoảng gồm 4 giai đoạn: phòng ngừa, chuẩn bị, ứng phó, phục hồi.' },
  { id: 'q2', question: 'Tại sao ngành du lịch đặc biệt dễ bị tổn thương trước khủng hoảng?', options: ['Vì có quá nhiều lao động', 'Vì nhu cầu có thể sụp gần bằng 0 rất nhanh và không thể lưu trữ hay bán lại một đêm phòng trống', 'Vì phòng khách sạn quá đắt', 'Vì ngành không có công nghệ'], correctIndex: 1, explanation: 'Một đêm phòng không bán được là mất vĩnh viễn — không có kho để lưu trữ như hàng hoá thông thường.' },
  { id: 'q3', question: 'Kế hoạch duy trì hoạt động kinh doanh (Business Continuity Planning) là gì?', options: ['Kế hoạch marketing thường niên', 'Tài liệu chuẩn bị trước cách doanh nghiệp tiếp tục/mở lại nhanh sau gián đoạn', 'Chỉ áp dụng sau khi khủng hoảng đã xảy ra', 'Một loại bảo hiểm du lịch cho khách'], correctIndex: 1, explanation: 'BCP được lập TRƯỚC, ghi rõ nhân sự dự phòng, tài chính, bảo hiểm và kế hoạch truyền thông.' },
]);

const c7 = doc('cih201-7-1-community-culture-vietnam', '7.1 — Community-based & cultural tourism: the Vietnam context|||7.1 — Du lịch cộng đồng, văn hoá & bối cảnh Việt Nam',
  'Du lịch cộng đồng (CBT); du lịch di sản văn hoá; case Việt Nam (Sa Pa, Hội An, đồng bằng sông Cửu Long, di sản UNESCO); cân bằng phát triển & bảo tồn.',
  [[
    `<span class="eyebrow">CIH201 · Chapter 7 · Lesson 7.1</span>
<h2>Community-based &amp; cultural tourism: the Vietnam context</h2>
<h3>Community-based tourism (CBT)</h3>
<p><strong>Community-based tourism</strong> is planned, owned, and largely run by the local community itself — homestays, guided treks, craft workshops — so that tourism revenue stays local rather than flowing mainly to outside investors.</p>
<h3>Cultural &amp; heritage tourism</h3>
<p>Heritage tourism draws visitors to historic sites, traditions, and living culture. It creates strong economic incentive to preserve heritage — but also risk: commercialization can hollow out the very culture that attracts visitors ("staged authenticity").</p>
<h3>Vietnam case studies</h3>
<ul>
<li><strong>Sa Pa</strong> — H'mong and Dao community-based homestay treks; a model for CBT, but facing rapid commercial development pressure.</li>
<li><strong>Hoi An Ancient Town</strong> — a UNESCO World Heritage Site balancing a living town with mass tourist visitation.</li>
<li><strong>Mekong Delta</strong> — homestay &amp; river-life tourism built directly on local livelihoods (floating markets, orchards).</li>
</ul>
<p>Vietnam has multiple UNESCO World Heritage Sites (Hoi An, Ha Long Bay, Hue Complex, and more), each requiring a balance between visitor access, local income, and preservation.</p>
<div class="callout"><span class="badge">The core tension</span> Every heritage or community destination faces the same question: how much tourism growth can a place absorb before it damages the exact culture or environment that makes it worth visiting?</div>`,
    `<span class="eyebrow">CIH201 · Chương 7 · Bài 7.1</span>
<h2>Du lịch cộng đồng, văn hoá &amp; bối cảnh Việt Nam</h2>
<h3>Du lịch cộng đồng (CBT)</h3>
<p><strong>Du lịch cộng đồng</strong> được quy hoạch, sở hữu, và vận hành chủ yếu bởi chính cộng đồng địa phương — homestay, trekking có hướng dẫn, workshop nghề thủ công — để doanh thu du lịch giữ lại ở địa phương, không chảy hết ra nhà đầu tư ngoài.</p>
<h3>Du lịch văn hoá &amp; di sản</h3>
<p>Du lịch di sản thu hút khách đến các di tích lịch sử, truyền thống, và văn hoá sống. Nó tạo động lực kinh tế mạnh để bảo tồn di sản — nhưng cũng có rủi ro: thương mại hoá có thể làm rỗng ruột chính nền văn hoá đã thu hút khách ("bản sắc dàn dựng").</p>
<h3>Case Việt Nam</h3>
<ul>
<li><strong>Sa Pa</strong> — trekking homestay cộng đồng người H'Mông và Dao; một mô hình CBT, nhưng đang đối mặt áp lực phát triển thương mại nhanh.</li>
<li><strong>Phố cổ Hội An</strong> — Di sản Thế giới UNESCO đang cân bằng một thị trấn đang sống với lượng khách đại chúng.</li>
<li><strong>Đồng bằng sông Cửu Long</strong> — du lịch homestay &amp; đời sống sông nước dựa trực tiếp vào sinh kế địa phương (chợ nổi, vườn cây ăn trái).</li>
</ul>
<p>Việt Nam có nhiều Di sản Thế giới UNESCO (Hội An, Vịnh Hạ Long, Quần thể di tích Huế, và nhiều nơi khác), mỗi nơi đều cần cân bằng giữa tiếp cận của du khách, thu nhập địa phương, và bảo tồn.</p>
<div class="callout"><span class="badge">Căng thẳng cốt lõi</span> Mọi điểm đến di sản hay cộng đồng đều đối mặt cùng câu hỏi: một nơi chịu được bao nhiêu tăng trưởng du lịch trước khi nó phá hỏng chính nền văn hoá hay môi trường khiến nơi đó đáng đến?</div>`,
  ]]);

const c7q = quiz('cih201-quiz-7', 'Quiz 7 — Community & cultural tourism|||Quiz 7 — Du lịch cộng đồng & văn hoá', [
  { id: 'q1', question: 'Du lịch cộng đồng (CBT) đặc trưng ở điểm gì?', options: ['Chỉ nhà đầu tư nước ngoài được hưởng lợi', 'Do chính cộng đồng địa phương quy hoạch, sở hữu và vận hành', 'Không liên quan đến homestay', 'Chỉ áp dụng ở thành phố lớn'], correctIndex: 1, explanation: 'CBT giữ doanh thu du lịch ở lại địa phương vì cộng đồng trực tiếp sở hữu & vận hành.' },
  { id: 'q2', question: 'Địa danh nào dưới đây là Di sản Thế giới UNESCO tại Việt Nam?', options: ['Sa Pa', 'Phố cổ Hội An', 'Đồng bằng sông Cửu Long', 'Cả ba đều không phải'], correctIndex: 1, explanation: 'Phố cổ Hội An được UNESCO công nhận là Di sản Thế giới.' },
  { id: 'q3', question: 'Rủi ro chính khi thương mại hoá quá mức du lịch di sản/văn hoá là gì?', options: ['Giá phòng giảm', 'Làm rỗng ruột chính nền văn hoá đã thu hút khách ("bản sắc dàn dựng")', 'Không có rủi ro nào', 'Tăng thu nhập cho toàn bộ cộng đồng đồng đều'], correctIndex: 1, explanation: 'Thương mại hoá quá mức có thể biến văn hoá sống thành trình diễn dàn dựng, mất bản sắc thật.' },
]);

const c8 = doc('cih201-8-1-destination-marketing-future', '8.1 — Destination marketing, social media & the future of the industry|||8.1 — Marketing điểm đến, mạng xã hội & tương lai ngành',
  'DMO & xây dựng thương hiệu điểm đến; marketing mạng xã hội, influencer, nội dung do người dùng tạo (UGC); AI trong du lịch; xu hướng tương lai.',
  [[
    `<span class="eyebrow">CIH201 · Chapter 8 · Lesson 8.1</span>
<h2>Destination marketing, social media &amp; the future</h2>
<h3>Destination branding</h3>
<p>A <strong>DMO</strong> markets a place as a single brand — a consistent story, visual identity and set of promises ("Vietnam — Timeless Charm") aimed at the traveller segments the destination wants to attract, while coordinating with hotels, attractions and airlines.</p>
<h3>Social media &amp; influencer marketing</h3>
<ul>
<li><strong>User-generated content (UGC)</strong> — guest photos and reviews now influence bookings more than official ads; hotels actively encourage and re-share it.</li>
<li><strong>Influencer marketing</strong> — creators showcase a destination or property to their own audience, trading reach for a stay or fee.</li>
<li><strong>Short-form video</strong> (TikTok, Reels) has become a primary discovery channel for younger travellers, ahead of search engines for inspiration.</li>
</ul>
<h3>Where the industry is heading</h3>
<p>AI-powered trip planning and concierge chatbots, generative-AI content for marketing, growing demand for verified sustainable options, and a generational shift toward Gen Z travellers who prioritize experience and values over traditional loyalty programs.</p>
<div class="callout"><span class="badge">Full circle</span> Every theme in this course — sustainability, technology, workforce, crisis resilience, culture — converges in how a destination markets itself and adapts for what comes next.</div>`,
    `<span class="eyebrow">CIH201 · Chương 8 · Bài 8.1</span>
<h2>Marketing điểm đến, mạng xã hội &amp; tương lai ngành</h2>
<h3>Xây dựng thương hiệu điểm đến</h3>
<p>Một <strong>DMO</strong> tiếp thị một địa điểm như một thương hiệu thống nhất — một câu chuyện xuyên suốt, hình ảnh nhận diện và lời hứa nhất quán (vd "Việt Nam — Vẻ đẹp bất tận") hướng đến phân khúc du khách điểm đến muốn thu hút, đồng thời phối hợp với khách sạn, điểm tham quan và hàng không.</p>
<h3>Marketing mạng xã hội &amp; influencer</h3>
<ul>
<li><strong>Nội dung do người dùng tạo (UGC)</strong> — ảnh và đánh giá của khách nay ảnh hưởng đến quyết định đặt phòng hơn quảng cáo chính thức; khách sạn chủ động khuyến khích và chia sẻ lại.</li>
<li><strong>Marketing qua influencer</strong> — người sáng tạo nội dung giới thiệu điểm đến hoặc khách sạn cho khán giả riêng của họ, đổi lại một kỳ nghỉ hoặc phí hợp tác.</li>
<li><strong>Video ngắn</strong> (TikTok, Reels) đã trở thành kênh khám phá chính của khách du lịch trẻ, vượt qua công cụ tìm kiếm khi tìm cảm hứng.</li>
</ul>
<h3>Ngành đang đi về đâu</h3>
<p>Lập kế hoạch chuyến đi &amp; chatbot lễ tân bằng AI, nội dung marketing tạo bằng AI sinh tạo, nhu cầu tăng với các lựa chọn bền vững được xác minh, và sự chuyển dịch thế hệ sang khách du lịch Gen Z ưu tiên trải nghiệm và giá trị hơn các chương trình khách thân thiết truyền thống.</p>
<div class="callout"><span class="badge">Khép vòng</span> Mọi chủ đề của môn học — bền vững, công nghệ, nhân sự, khả năng chống chịu khủng hoảng, văn hoá — hội tụ về cách một điểm đến tiếp thị bản thân và thích ứng cho những gì sắp tới.</div>`,
  ]]);

const c8q = quiz('cih201-quiz-8', 'Quiz 8 — Destination marketing & the future|||Quiz 8 — Marketing điểm đến & tương lai', [
  { id: 'q1', question: 'UGC (User-Generated Content) trong marketing du lịch là gì?', options: ['Nội dung do chính khách sạn tự sản xuất và trả tiền', 'Nội dung (ảnh, đánh giá) do khách du lịch tự tạo và chia sẻ', 'Một loại phần mềm PMS', 'Chỉ áp dụng cho quảng cáo truyền hình'], correctIndex: 1, explanation: 'UGC là nội dung khách tự tạo (ảnh, review) — ảnh hưởng quyết định đặt phòng của người khác.' },
  { id: 'q2', question: 'DMO thực hiện marketing điểm đến chủ yếu nhằm mục đích gì?', options: ['Bán trực tiếp phòng khách sạn cho khách', 'Xây dựng một thương hiệu, câu chuyện thống nhất để thu hút phân khúc khách mong muốn', 'Thay thế hoàn toàn vai trò của OTA', 'Chỉ quản lý visa nhập cảnh'], correctIndex: 1, explanation: 'DMO xây dựng và truyền thông thương hiệu điểm đến thống nhất, phối hợp với các bên trong ngành.' },
  { id: 'q3', question: 'Xu hướng nào được nêu là định hình tương lai ngành khách sạn - du lịch?', options: ['Loại bỏ hoàn toàn công nghệ số', 'AI hỗ trợ lập kế hoạch chuyến đi/chatbot, nhu cầu bền vững, thế hệ Gen Z', 'Chỉ tập trung vào khách hàng lớn tuổi', 'Ngừng phát triển mạng xã hội'], correctIndex: 1, explanation: 'AI trong du lịch, nhu cầu bền vững được xác minh, và thế hệ Gen Z là các xu hướng định hình tương lai ngành.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'CIH201',
    slug: 'cih201-contemporary-issues-in-hotel-and-tourism-management',
    title: 'Contemporary issues in hotel and tourism management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CIH201.webp',
    shortDescription: 'Hotel-tourism industry trends, sustainable tourism, digital transformation, guest experience, workforce shortage, crisis recovery, culture & the Vietnam context, destination marketing & the future. Bilingual, with quizzes.|||Xu hướng ngành khách sạn - du lịch, du lịch bền vững, chuyển đổi số, trải nghiệm khách hàng, thiếu hụt lao động, phục hồi khủng hoảng, văn hoá & bối cảnh Việt Nam, marketing điểm đến & tương lai ngành. Song ngữ, có quiz.',
    description: 'Môn <strong>CIH201 — Contemporary Issues in Hotel and Tourism Management</strong> (kỳ 2, khối Quản trị Kinh doanh) nghiên cứu các vấn đề đương đại đang định hình lại ngành khách sạn - du lịch. Từ <strong>cấu trúc ngành &amp; xu hướng toàn cầu</strong> → <strong>du lịch bền vững &amp; có trách nhiệm</strong> → <strong>chuyển đổi số</strong> (OTA, PMS, khách sạn thông minh) → <strong>trải nghiệm khách hàng &amp; cá nhân hoá</strong> → <strong>nhân sự &amp; thiếu hụt lao động</strong> → <strong>quản trị khủng hoảng &amp; phục hồi</strong> → <strong>du lịch cộng đồng, văn hoá &amp; bối cảnh Việt Nam</strong> → <strong>marketing điểm đến &amp; tương lai ngành</strong>. Bám giáo trình Tourism Management (Weaver &amp; Lawton), Contemporary Hospitality Management (Boella), Hospitality Management (Walker) và báo cáo UNWTO; song ngữ, có ví dụ thực tế và quiz mỗi chương.',
    whatYouLearn: 'Cấu trúc ngành khách sạn - du lịch & DMO; kinh tế trải nghiệm & xu hướng phục hồi; du lịch bền vững (ba trụ cột), overtourism, chứng nhận xanh, Bộ Quy tắc UNWTO; OTA/PMS/CRS/RMS, khách sạn thông minh, channel manager; hành trình khách hàng, SERVQUAL, cá nhân hoá qua CRM, quản trị đánh giá; thiếu hụt lao động, employer branding, giữ chân nhân viên; chu trình quản trị khủng hoảng, case COVID-19, kế hoạch duy trì hoạt động; du lịch cộng đồng & di sản, case Sa Pa/Hội An/ĐBSCL; marketing điểm đến, UGC, influencer, xu hướng AI & Gen Z.',
    requirements: 'Không yêu cầu kiến thức chuyên ngành trước. Nên có hiểu biết tiếng Anh cơ bản để đọc thuật ngữ ngành (OTA, PMS, DMO...).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách tham khảo, báo cáo UNWTO, trang tin ngành, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Ngành khách sạn - du lịch, vấn đề đương đại, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan ngành & xu hướng toàn cầu|||Chapter 1 — Industry overview & global trends', description: 'Cấu trúc ngành, DMO, kinh tế trải nghiệm, hợp nhất tập đoàn.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Du lịch bền vững & có trách nhiệm|||Chapter 2 — Sustainable & responsible tourism', description: 'Ba trụ cột bền vững, overtourism, chứng nhận xanh, UNWTO.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chuyển đổi số & công nghệ|||Chapter 3 — Digital transformation & technology', description: 'OTA, PMS/CRS/RMS, khách sạn thông minh, channel manager.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Trải nghiệm khách hàng & cá nhân hoá|||Chapter 4 — Guest experience & personalization', description: 'Hành trình khách, SERVQUAL, CRM, quản trị đánh giá.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nhân sự & thiếu hụt lao động|||Chapter 5 — Workforce & labour shortage', description: 'Thiếu hụt lao động, employer branding, giữ chân nhân viên.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Khủng hoảng & phục hồi|||Chapter 6 — Crisis management & recovery', description: 'Chu trình quản trị khủng hoảng, case COVID-19, kế hoạch BCP.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Du lịch cộng đồng, văn hoá & Việt Nam|||Chapter 7 — Community, cultural tourism & Vietnam', description: 'CBT, di sản văn hoá, case Sa Pa/Hội An/ĐBSCL.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Marketing điểm đến & tương lai ngành|||Chapter 8 — Destination marketing & the future', description: 'DMO, mạng xã hội, influencer, xu hướng AI & Gen Z.', lessons: [c8, c8q] },
  ],
};
