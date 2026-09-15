/**
 * HMO102 — Introduction to Tourism &amp; Hospitality Industry. Giáo trình
 * (trích dẫn, không upload PDF): "Introduction to Hospitality" (Walker);
 * "Tourism: Principles and Practice" (Cooper); UNWTO. 8 chương: tổng quan
 * ngành → lịch sử & xu hướng → lĩnh vực hospitality → sản phẩm & dịch vụ
 * du lịch → đặc điểm dịch vụ & trải nghiệm khách → cơ cấu khách sạn →
 * nghề nghiệp & kỹ năng → du lịch bền vững/công nghệ/Việt Nam. Song ngữ.
 * Giữ NGUYÊN slug/semester/courseCode/thumbnailUrl. KHÔNG backtick/${.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('hmo102-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (Walker, Cooper, UNWTO), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">HMO102 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to get an overview of the tourism &amp; hospitality industry — sectors, products, service characteristics and careers — in one place. The official FPTU slides live on <strong>FLM</strong>; below are free, legal references used worldwide in hospitality education.</p>
<h3>📘 Reference textbooks</h3>
<ul>
<li><em>Introduction to Hospitality</em> — John R. Walker</li>
<li><em>Tourism: Principles and Practice</em> — Chris Cooper et al.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.unwto.org/" target="_blank" rel="noopener">UNWTO — UN World Tourism Organization</a> — definitions, data &amp; global tourism statistics</li>
<li><a href="https://vietnamtourism.gov.vn/" target="_blank" rel="noopener">Cục Du lịch Quốc gia Việt Nam (vietnamtourism.gov.vn)</a></li>
<li><a href="https://vietnam.travel/" target="_blank" rel="noopener">Vietnam.travel</a> — official Vietnam tourism promotion site</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ehlhospitalitybusiness" target="_blank" rel="noopener">EHL Hospitality Business School</a> — hospitality management lectures &amp; case studies</li>
<li><a href="https://www.youtube.com/@NatGeoTravel" target="_blank" rel="noopener">National Geographic Travel</a> — destinations, culture &amp; sustainable travel</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.unwto.org/tourism-data/global-and-regional-tourism-performance" target="_blank" rel="noopener">UNWTO Tourism Data Dashboard</a> — real arrivals/receipts by region</li>
<li><a href="https://vietnam.travel/" target="_blank" rel="noopener">Vietnam.travel</a> — browse Vietnam's tourism products &amp; heritage sites</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — definitions (tourism, hospitality), the 5A tourism-product model, service characteristics (IHIP).</li>
<li><strong>Practice</strong> — map a real hotel or tour package onto the sectors and departments covered here.</li>
<li><strong>Go deeper</strong> — hotel departments, front-of-house/back-of-house, career ladders in the industry.</li>
<li><strong>Job-ready</strong> — sustainable tourism principles, hospitality technology (PMS, OTA), and Vietnam's own tourism landscape.</li>
</ol></div>`,
    `<span class="eyebrow">HMO102 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để có cái nhìn tổng quan về ngành du lịch &amp; khách sạn — lĩnh vực, sản phẩm, đặc điểm dịch vụ và nghề nghiệp — gom về một chỗ. Slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn tham khảo miễn phí, hợp pháp, được dùng trong đào tạo hospitality trên thế giới.</p>
<h3>📘 Giáo trình tham khảo</h3>
<ul>
<li><em>Introduction to Hospitality</em> — John R. Walker</li>
<li><em>Tourism: Principles and Practice</em> — Chris Cooper và cộng sự</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.unwto.org/" target="_blank" rel="noopener">UNWTO — Tổ chức Du lịch Thế giới của Liên Hợp Quốc</a> — định nghĩa, dữ liệu &amp; thống kê du lịch toàn cầu</li>
<li><a href="https://vietnamtourism.gov.vn/" target="_blank" rel="noopener">Cục Du lịch Quốc gia Việt Nam (vietnamtourism.gov.vn)</a></li>
<li><a href="https://vietnam.travel/" target="_blank" rel="noopener">Vietnam.travel</a> — trang quảng bá du lịch Việt Nam chính thức</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ehlhospitalitybusiness" target="_blank" rel="noopener">EHL Hospitality Business School</a> — bài giảng &amp; case study quản trị khách sạn</li>
<li><a href="https://www.youtube.com/@NatGeoTravel" target="_blank" rel="noopener">National Geographic Travel</a> — điểm đến, văn hoá &amp; du lịch bền vững</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.unwto.org/tourism-data/global-and-regional-tourism-performance" target="_blank" rel="noopener">UNWTO Tourism Data Dashboard</a> — số liệu khách/doanh thu thật theo khu vực</li>
<li><a href="https://vietnam.travel/" target="_blank" rel="noopener">Vietnam.travel</a> — xem sản phẩm du lịch &amp; di sản của Việt Nam</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — định nghĩa (du lịch, khách sạn), mô hình sản phẩm du lịch 5A, đặc điểm dịch vụ (IHIP).</li>
<li><strong>Luyện tập</strong> — thử ánh xạ một khách sạn hoặc tour thật vào các lĩnh vực &amp; bộ phận trong bài.</li>
<li><strong>Đào sâu thực tế</strong> — bộ phận khách sạn, front-of-house/back-of-house, lộ trình nghề nghiệp trong ngành.</li>
<li><strong>Sẵn sàng đi làm</strong> — nguyên tắc du lịch bền vững, công nghệ hospitality (PMS, OTA), và bối cảnh du lịch Việt Nam.</li>
</ol></div>`,
  ]]);

const intro = doc('hmo102-0-1-overview', 'Course overview: Introduction to Tourism & Hospitality Industry|||Tổng quan: Nhập môn ngành Du lịch & Khách sạn',
  'Ngành du lịch & khách sạn là gì, quy mô toàn cầu, lộ trình 8 chương từ khái niệm đến du lịch bền vững & Việt Nam.',
  [[
    `<span class="eyebrow">HMO102 · Lesson 0.1 · Overview</span>
<h2>Introduction to Tourism &amp; Hospitality Industry</h2>
<p class="lead">This course gives you a <strong>360° first look</strong> at one of the world's largest industries: tourism (people traveling and staying away from home) and hospitality (the businesses that serve them — hotels, restaurants, tours, events). You will learn what the industry is made of, how it works, and where you could fit into it.</p>
<h3>Why it matters</h3>
<p>Before recent global disruptions, tourism generated roughly <strong>1 in 10 jobs worldwide</strong> and about <strong>10% of global GDP</strong> (UNWTO estimates) — spanning airlines, hotels, restaurants, tour operators, and local communities that host visitors.</p>
<h3>Roadmap — 8 chapters</h3>
<ul>
<li><strong>1–2</strong> Industry overview, history &amp; trends</li>
<li><strong>3–4</strong> Hospitality sectors, tourism products &amp; services</li>
<li><strong>5–6</strong> Service characteristics &amp; guest experience, hotel departments</li>
<li><strong>7–8</strong> Careers &amp; skills, sustainable tourism/technology/Vietnam</li>
</ul>
<p>Bilingual throughout, with real-world examples and a short quiz after every chapter.</p>`,
    `<span class="eyebrow">HMO102 · Bài 0.1 · Tổng quan</span>
<h2>Nhập môn ngành Du lịch &amp; Khách sạn</h2>
<p class="lead">Môn này cho bạn cái nhìn <strong>toàn cảnh đầu tiên</strong> về một trong những ngành lớn nhất thế giới: du lịch (con người đi lại &amp; lưu trú xa nhà) và khách sạn/hospitality (các doanh nghiệp phục vụ họ — khách sạn, nhà hàng, tour, sự kiện). Bạn sẽ hiểu ngành gồm những gì, vận hành thế nào, và mình có thể góp mặt ở đâu.</p>
<h3>Vì sao quan trọng</h3>
<p>Trước những biến động toàn cầu gần đây, du lịch tạo ra khoảng <strong>1 trong 10 việc làm trên thế giới</strong> và chiếm khoảng <strong>10% GDP toàn cầu</strong> (ước tính của UNWTO) — trải rộng từ hàng không, khách sạn, nhà hàng, công ty lữ hành, đến cộng đồng địa phương đón khách.</p>
<h3>Lộ trình — 8 chương</h3>
<ul>
<li><strong>1–2</strong> Tổng quan ngành, lịch sử &amp; xu hướng</li>
<li><strong>3–4</strong> Các lĩnh vực hospitality, sản phẩm &amp; dịch vụ du lịch</li>
<li><strong>5–6</strong> Đặc điểm dịch vụ &amp; trải nghiệm khách, cơ cấu khách sạn</li>
<li><strong>7–8</strong> Nghề nghiệp &amp; kỹ năng, du lịch bền vững/công nghệ/Việt Nam</li>
</ul>
<p>Song ngữ toàn bộ, có ví dụ thực tế và một quiz ngắn sau mỗi chương.</p>`,
  ]]);

const c1 = doc('hmo102-1-1-overview-industry', '1.1 — Overview of the tourism & hospitality industry|||1.1 — Tổng quan ngành du lịch & khách sạn',
  'Định nghĩa du lịch (UNWTO) & hospitality; mối liên hệ giữa hai ngành; các bên liên quan; quy mô kinh tế.',
  [[
    `<span class="eyebrow">HMO102 · Chapter 1 · Lesson 1.1</span>
<h2>Overview of the tourism &amp; hospitality industry</h2>
<h3>Two words, one ecosystem</h3>
<ul>
<li><strong>Tourism (UNWTO definition)</strong> — the activity of people traveling to and staying in places outside their usual environment for not more than one consecutive year, for leisure, business or other purposes.</li>
<li><strong>Hospitality</strong> — the industry of providing lodging, food &amp; beverage, and related services to people away from home; the word comes from Latin <em>hospes</em>, "host/guest".</li>
</ul>
<p>Tourism creates the <strong>demand</strong> (people wanting to travel); hospitality supplies the <strong>means to stay comfortably</strong> once they arrive. Neither works well without the other.</p>
<h3>The visitor's chain</h3>
<pre><code>Tourism demand:  a traveler wants to visit a place
        |
        v
Hospitality supply chain:
  Transport -> Accommodation -> Food & Beverage -> Attractions/Activities -> Support services
  (airline,     (hotel,          (restaurant,        (tour, museum,          (bank, insurance,
   bus)          homestay)        street food)        beach)                 telecom)
</code></pre>
<h3>Key stakeholders</h3>
<ul>
<li><strong>Government</strong> — policy, visas, infrastructure, promotion</li>
<li><strong>Private businesses</strong> — hotels, airlines, tour operators, restaurants</li>
<li><strong>Local community</strong> — hosts culture, labor, and is directly affected by tourism</li>
<li><strong>Tourists</strong> — the demand side; their needs shape every product in the industry</li>
</ul>
<div class="callout"><span class="badge">Scale</span> UNWTO estimates tourism as one of the world's largest economic sectors — supporting roughly 1 in 10 jobs and around 10% of global GDP in a normal year.</div>`,
    `<span class="eyebrow">HMO102 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan ngành du lịch &amp; khách sạn</h2>
<h3>Hai từ, một hệ sinh thái</h3>
<ul>
<li><strong>Du lịch (định nghĩa UNWTO)</strong> — hoạt động của con người di chuyển đến và lưu trú tại nơi ngoài môi trường sống thường xuyên của họ, không quá một năm liên tục, vì mục đích nghỉ dưỡng, công việc hoặc mục đích khác.</li>
<li><strong>Hospitality (khách sạn/lưu trú &amp; đón tiếp)</strong> — ngành cung cấp lưu trú, ẩm thực và dịch vụ liên quan cho người xa nhà; từ này gốc Latin <em>hospes</em>, nghĩa "chủ nhà/khách".</li>
</ul>
<p>Du lịch tạo ra <strong>nhu cầu</strong> (con người muốn đi lại); hospitality cung cấp <strong>phương tiện để lưu trú thoải mái</strong> khi họ đến nơi. Thiếu một trong hai, cái còn lại đều khó vận hành tốt.</p>
<h3>Chuỗi phục vụ khách</h3>
<pre><code>Nhu cầu du lịch: du khách muốn tới một nơi
        |
        v
Chuỗi cung ứng hospitality:
  Vận chuyển -> Lưu trú -> Ẩm thực -> Điểm tham quan/hoạt động -> Dịch vụ hỗ trợ
  (hàng không,   (khách sạn,  (nhà hàng,   (tour, bảo tàng,        (ngân hàng, bảo hiểm,
   xe khách)      homestay)   ẩm thực đường phố) biển)               viễn thông)
</code></pre>
<h3>Các bên liên quan chính</h3>
<ul>
<li><strong>Chính phủ</strong> — chính sách, visa, hạ tầng, xúc tiến quảng bá</li>
<li><strong>Doanh nghiệp tư nhân</strong> — khách sạn, hàng không, công ty lữ hành, nhà hàng</li>
<li><strong>Cộng đồng địa phương</strong> — chủ nhà văn hoá, lao động, chịu ảnh hưởng trực tiếp từ du lịch</li>
<li><strong>Du khách</strong> — phía cầu; nhu cầu của họ định hình mọi sản phẩm trong ngành</li>
</ul>
<div class="callout"><span class="badge">Quy mô</span> UNWTO ước tính du lịch là một trong những khu vực kinh tế lớn nhất thế giới — tạo ra khoảng 1 trong 10 việc làm và khoảng 10% GDP toàn cầu trong một năm bình thường.</div>`,
  ]]);

const c1q = quiz('hmo102-quiz-1', 'Quiz 1 — Industry overview|||Quiz 1 — Tổng quan ngành', [
  { id: 'q1', question: 'Theo UNWTO, du lịch được định nghĩa là hoạt động của người di chuyển và lưu trú ngoài môi trường sống thường xuyên trong khoảng thời gian nào?', options: ['Không quá 1 tuần', 'Không quá 1 tháng', 'Không quá 1 năm liên tục', 'Không có giới hạn thời gian'], correctIndex: 2, explanation: 'UNWTO định nghĩa du lịch là lưu trú ngoài môi trường thường xuyên không quá một năm liên tục.' },
  { id: 'q2', question: 'Mối quan hệ giữa du lịch và hospitality được mô tả đúng nhất là?', options: ['Hai ngành hoàn toàn tách biệt, không liên quan', 'Du lịch tạo cầu, hospitality cung cấp phương tiện lưu trú/phục vụ khi khách đến', 'Hospitality tạo cầu, du lịch chỉ vận chuyển khách', 'Chỉ chính phủ mới nối được hai ngành này'], correctIndex: 1, explanation: 'Du lịch (nhu cầu đi lại) và hospitality (đáp ứng lưu trú, ẩm thực) là hai mặt của cùng một hệ sinh thái, hỗ trợ lẫn nhau.' },
  { id: 'q3', question: 'Theo ước tính của UNWTO trong một năm bình thường, du lịch đóng góp khoảng bao nhiêu vào GDP toàn cầu?', options: ['Khoảng 1%', 'Khoảng 10%', 'Khoảng 50%', 'Khoảng 90%'], correctIndex: 1, explanation: 'UNWTO ước tính du lịch chiếm khoảng 10% GDP toàn cầu và 1 trong 10 việc làm trên thế giới.' },
]);

const c2 = doc('hmo102-2-1-history-trends', '2.1 — History & development trends of the industry|||2.1 — Lịch sử & xu hướng phát triển ngành',
  'Các cột mốc lớn (Thomas Cook, thời đại máy bay phản lực, internet/OTA) và xu hướng hiện nay (trải nghiệm, bền vững, số hoá, wellness).',
  [[
    `<span class="eyebrow">HMO102 · Chapter 2 · Lesson 2.1</span>
<h2>History &amp; development trends</h2>
<h3>Milestones that reshaped travel</h3>
<pre><code>1841  Thomas Cook organizes the first commercial package tour (UK)
1950s-60s  Jet aircraft cut travel time drastically -> rise of MASS tourism
1990s      Internet -> Online Travel Agencies (OTAs), self-service booking
2000s-10s  Budget/low-cost airlines -> travel becomes affordable to more people
2020s      Digital-first, contactless, and sustainability-driven travel
</code></pre>
<p>Each milestone lowered the cost or friction of traveling — from wealthy "Grand Tour" travelers of past centuries to today's traveler booking an entire trip from a phone.</p>
<h3>Trends shaping the industry today</h3>
<ul>
<li><strong>Experiential travel</strong> — travelers seek authentic local experiences, not just sightseeing.</li>
<li><strong>Sustainable / eco-tourism</strong> — minimizing environmental &amp; cultural impact, supporting local communities.</li>
<li><strong>Digitalization</strong> — OTAs, mobile apps, AI chatbots, contactless check-in.</li>
<li><strong>Health &amp; wellness tourism</strong> — spa, retreat, medical tourism.</li>
<li><strong>"Bleisure"</strong> — combining business trips with leisure time.</li>
</ul>
<div class="callout"><span class="badge">Pattern to remember</span> Almost every historical leap in tourism came from a leap in <strong>transport or information</strong> technology (steamship/rail → jet aircraft → internet). Today's leap is digital and sustainability-driven.</div>`,
    `<span class="eyebrow">HMO102 · Chương 2 · Bài 2.1</span>
<h2>Lịch sử &amp; xu hướng phát triển ngành</h2>
<h3>Các cột mốc thay đổi cách con người đi lại</h3>
<pre><code>1841       Thomas Cook tổ chức tour du lịch trọn gói thương mại đầu tiên (Anh)
1950s-60s  Máy bay phản lực rút ngắn thời gian di chuyển -> DU LỊCH ĐẠI CHÚNG bùng nổ
1990s      Internet -> các đại lý du lịch trực tuyến (OTA), tự đặt dịch vụ
2000s-10s  Hàng không giá rẻ -> du lịch trở nên vừa túi tiền với nhiều người hơn
2020s      Du lịch số hoá, không tiếp xúc, và hướng tới bền vững
</code></pre>
<p>Mỗi cột mốc đều giảm chi phí hoặc rào cản đi lại — từ những du khách giàu có "Grand Tour" ở các thế kỷ trước, đến du khách hôm nay đặt cả chuyến đi chỉ bằng điện thoại.</p>
<h3>Xu hướng định hình ngành hiện nay</h3>
<ul>
<li><strong>Du lịch trải nghiệm</strong> — du khách tìm trải nghiệm địa phương thực thụ, không chỉ ngắm cảnh.</li>
<li><strong>Du lịch bền vững / sinh thái</strong> — giảm tác động môi trường &amp; văn hoá, hỗ trợ cộng đồng địa phương.</li>
<li><strong>Số hoá</strong> — OTA, ứng dụng di động, chatbot AI, nhận phòng không tiếp xúc.</li>
<li><strong>Du lịch sức khoẻ &amp; nghỉ dưỡng</strong> — spa, retreat, du lịch y tế.</li>
<li><strong>"Bleisure"</strong> — kết hợp công tác với thời gian nghỉ dưỡng.</li>
</ul>
<div class="callout"><span class="badge">Quy luật cần nhớ</span> Hầu hết các bước nhảy lịch sử của du lịch đều bắt nguồn từ bước nhảy về <strong>công nghệ vận chuyển hoặc thông tin</strong> (tàu hơi nước/xe lửa → máy bay phản lực → internet). Bước nhảy hôm nay là số hoá và hướng bền vững.</div>`,
  ]]);

const c2q = quiz('hmo102-quiz-2', 'Quiz 2 — History & trends|||Quiz 2 — Lịch sử & xu hướng', [
  { id: 'q1', question: 'Ai được ghi nhận là người tổ chức tour du lịch trọn gói thương mại đầu tiên (1841)?', options: ['Thomas Cook', 'Conrad Hilton', 'César Ritz', 'Walt Disney'], correctIndex: 0, explanation: 'Thomas Cook tổ chức tour trọn gói thương mại đầu tiên tại Anh năm 1841.' },
  { id: 'q2', question: 'Sự xuất hiện của máy bay phản lực (thập niên 1950-60) chủ yếu dẫn tới điều gì?', options: ['Du lịch trở nên đắt đỏ hơn', 'Du lịch đại chúng bùng nổ nhờ rút ngắn thời gian di chuyển', 'Ngành khách sạn biến mất', 'Không có tác động đáng kể'], correctIndex: 1, explanation: 'Máy bay phản lực rút ngắn thời gian di chuyển drastically, tạo tiền đề cho du lịch đại chúng.' },
  { id: 'q3', question: 'Xu hướng nào sau đây thể hiện việc kết hợp chuyến công tác với thời gian nghỉ dưỡng?', options: ['Du lịch sinh thái', 'Bleisure', 'MICE', 'Du lịch y tế'], correctIndex: 1, explanation: '"Bleisure" (business + leisure) là xu hướng kết hợp công tác với nghỉ dưỡng.' },
]);

const c3 = doc('hmo102-3-1-hospitality-sectors', '3.1 — Sectors within the hospitality industry|||3.1 — Các lĩnh vực trong ngành hospitality',
  'Lưu trú, ẩm thực, lữ hành, MICE/sự kiện, giải trí — mỗi lĩnh vực làm gì và ví dụ thực tế.',
  [[
    `<span class="eyebrow">HMO102 · Chapter 3 · Lesson 3.1</span>
<h2>Sectors within the hospitality industry</h2>
<p class="lead">"Hospitality" is an umbrella covering several distinct sectors that often work together to serve the same guest.</p>
<pre><code>Hospitality industry
 |-- Lodging          hotels, resorts, hostels, homestays, Airbnb
 |-- Food & Beverage   restaurants, cafes, catering, room service
 |-- Travel & tourism  tour operators, travel agents, airlines, transport
 |-- MICE / events      Meetings, Incentives, Conferences, Exhibitions
 |-- Entertainment      theme parks, casinos, cruises, recreation
</code></pre>
<h3>What each sector does</h3>
<ul>
<li><strong>Lodging (Lưu trú)</strong> — provides a place to sleep and rest away from home, from budget hostels to luxury resorts.</li>
<li><strong>Food &amp; Beverage (Ẩm thực)</strong> — feeds guests, from street food to fine dining and hotel room service.</li>
<li><strong>Travel &amp; tourism (Lữ hành)</strong> — moves people and packages the trip: tour operators design itineraries, travel agents sell them, airlines/buses transport travelers.</li>
<li><strong>MICE / Events (Sự kiện)</strong> — Meetings, Incentives, Conferences, Exhibitions; a fast-growing, high-spending segment (weddings, conventions, trade shows).</li>
<li><strong>Entertainment &amp; recreation (Giải trí)</strong> — theme parks, casinos, cruise ships, spas — the "fun" layer on top of a trip.</li>
</ul>
<div class="callout"><span class="badge">One trip, many sectors</span> A single guest's weekend trip usually touches all five sectors: booking a flight (travel), sleeping at a resort (lodging), eating out (F&amp;B), attending a friend's wedding there (MICE), and visiting a theme park (entertainment).</div>`,
    `<span class="eyebrow">HMO102 · Chương 3 · Bài 3.1</span>
<h2>Các lĩnh vực trong ngành hospitality</h2>
<p class="lead">"Hospitality" là một mái nhà chung bao gồm nhiều lĩnh vực riêng biệt, thường phối hợp với nhau để phục vụ cùng một khách hàng.</p>
<pre><code>Ngành hospitality
 |-- Lưu trú           khách sạn, resort, hostel, homestay, Airbnb
 |-- Ẩm thực           nhà hàng, quán cà phê, catering, dịch vụ phòng
 |-- Lữ hành           công ty lữ hành, đại lý du lịch, hàng không, vận chuyển
 |-- MICE / sự kiện     Hội họp, Khuyến khích, Hội nghị, Triển lãm
 |-- Giải trí          công viên giải trí, casino, du thuyền, khu nghỉ dưỡng
</code></pre>
<h3>Từng lĩnh vực làm gì</h3>
<ul>
<li><strong>Lưu trú</strong> — cung cấp nơi ngủ nghỉ xa nhà, từ hostel bình dân đến resort sang trọng.</li>
<li><strong>Ẩm thực</strong> — phục vụ ăn uống cho khách, từ ẩm thực đường phố đến nhà hàng cao cấp và dịch vụ phòng khách sạn.</li>
<li><strong>Lữ hành</strong> — di chuyển con người và đóng gói chuyến đi: công ty lữ hành thiết kế lịch trình, đại lý du lịch bán tour, hàng không/xe khách vận chuyển du khách.</li>
<li><strong>MICE / Sự kiện</strong> — Meetings, Incentives, Conferences, Exhibitions; phân khúc tăng trưởng nhanh, chi tiêu cao (cưới hỏi, hội nghị, triển lãm).</li>
<li><strong>Giải trí</strong> — công viên giải trí, casino, du thuyền, spa — lớp "vui chơi" phía trên chuyến đi.</li>
</ul>
<div class="callout"><span class="badge">Một chuyến đi, nhiều lĩnh vực</span> Một chuyến đi cuối tuần của một khách thường chạm cả năm lĩnh vực: đặt vé bay (lữ hành), nghỉ tại resort (lưu trú), ăn ngoài (ẩm thực), tham dự đám cưới bạn tại đó (MICE), và ghé công viên giải trí (giải trí).</div>`,
  ]]);

const c3q = quiz('hmo102-quiz-3', 'Quiz 3 — Hospitality sectors|||Quiz 3 — Các lĩnh vực hospitality', [
  { id: 'q1', question: 'MICE là viết tắt của cụm từ nào?', options: ['Meetings, Incentives, Conferences, Exhibitions', 'Money, Insurance, Cruise, Entertainment', 'Marketing, Investment, Culture, Events', 'Media, Information, Communication, Experience'], correctIndex: 0, explanation: 'MICE = Meetings, Incentives, Conferences, Exhibitions — lĩnh vực hội họp/sự kiện.' },
  { id: 'q2', question: 'Lĩnh vực nào chịu trách nhiệm thiết kế lịch trình tour và bán chúng cho khách?', options: ['Lưu trú', 'Ẩm thực', 'Lữ hành (tour operator, travel agent)', 'Giải trí'], correctIndex: 2, explanation: 'Công ty lữ hành thiết kế itinerary, đại lý du lịch bán tour cho khách.' },
  { id: 'q3', question: 'Casino, công viên giải trí và du thuyền thuộc lĩnh vực nào của hospitality?', options: ['MICE', 'Giải trí (Entertainment & recreation)', 'Lưu trú', 'Ẩm thực'], correctIndex: 1, explanation: 'Casino, công viên giải trí, du thuyền thuộc lĩnh vực giải trí & nghỉ dưỡng.' },
]);

const c4 = doc('hmo102-4-1-tourism-products', '4.1 — Tourism products & services (the 5A model)|||4.1 — Sản phẩm & dịch vụ du lịch (mô hình 5A)',
  'Sản phẩm du lịch là gì (hữu hình/vô hình kết hợp); mô hình 5A: Attractions, Accessibility, Amenities, Activities, Ancillary services; các loại sản phẩm du lịch.',
  [[
    `<span class="eyebrow">HMO102 · Chapter 4 · Lesson 4.1</span>
<h2>Tourism products &amp; services</h2>
<h3>What is a "tourism product"?</h3>
<p>A tourism product is rarely one single item — it's a <strong>bundle</strong> of tangible goods (a hotel room, a meal) and intangible services (a warm welcome, a guided story) that together create the visitor's experience. A common way to describe that bundle is the <strong>5A model</strong>.</p>
<pre><code>5A model of a tourism product/destination
  Attractions       what draws visitors (beach, heritage site, festival)
  Accessibility     how visitors get there (flights, roads, visas)
  Amenities         facilities on site (hotels, restaurants, restrooms)
  Activities        things to DO there (diving, trekking, city tour)
  Ancillary services  supporting services (banks, hospitals, telecom, souvenirs)
</code></pre>
<h3>Types of tourism products</h3>
<ul>
<li><strong>Cultural / heritage tourism</strong> — historic sites, festivals, local traditions</li>
<li><strong>Eco-tourism</strong> — nature-based, low-impact travel</li>
<li><strong>Adventure tourism</strong> — trekking, diving, extreme sports</li>
<li><strong>MICE</strong> — conferences, incentive trips</li>
<li><strong>Medical / wellness tourism</strong> — healthcare, spa, retreats</li>
</ul>
<div class="callout"><span class="badge">Design tip</span> A destination missing just one "A" — say, poor <strong>Accessibility</strong> (no direct flights) — can fail commercially even if its Attraction is world-class.</div>`,
    `<span class="eyebrow">HMO102 · Chương 4 · Bài 4.1</span>
<h2>Sản phẩm &amp; dịch vụ du lịch</h2>
<h3>"Sản phẩm du lịch" là gì?</h3>
<p>Sản phẩm du lịch hiếm khi là một món đơn lẻ — đó là một <strong>gói kết hợp</strong> hàng hoá hữu hình (phòng khách sạn, bữa ăn) và dịch vụ vô hình (lời chào đón, câu chuyện của hướng dẫn viên) cùng tạo nên trải nghiệm của du khách. Cách phổ biến để mô tả gói này là <strong>mô hình 5A</strong>.</p>
<pre><code>Mô hình 5A của sản phẩm/điểm đến du lịch
  Attractions (Điểm hấp dẫn)   thứ thu hút khách (bãi biển, di sản, lễ hội)
  Accessibility (Khả năng tiếp cận)  cách khách tới nơi (chuyến bay, đường bộ, visa)
  Amenities (Tiện nghi)        cơ sở vật chất tại chỗ (khách sạn, nhà hàng, nhà vệ sinh)
  Activities (Hoạt động)       việc khách có thể LÀM (lặn biển, trekking, city tour)
  Ancillary services (Dịch vụ hỗ trợ)  dịch vụ đi kèm (ngân hàng, y tế, viễn thông, quà lưu niệm)
</code></pre>
<h3>Các loại sản phẩm du lịch</h3>
<ul>
<li><strong>Du lịch văn hoá / di sản</strong> — di tích lịch sử, lễ hội, truyền thống địa phương</li>
<li><strong>Du lịch sinh thái</strong> — dựa vào thiên nhiên, tác động thấp</li>
<li><strong>Du lịch mạo hiểm</strong> — trekking, lặn biển, thể thao mạo hiểm</li>
<li><strong>MICE</strong> — hội nghị, chuyến đi khen thưởng nhân viên</li>
<li><strong>Du lịch y tế / nghỉ dưỡng</strong> — khám chữa bệnh, spa, retreat</li>
</ul>
<div class="callout"><span class="badge">Lưu ý khi thiết kế</span> Một điểm đến chỉ thiếu một chữ "A" — vd <strong>Accessibility</strong> kém (không có chuyến bay thẳng) — có thể thất bại thương mại dù Attraction đẳng cấp thế giới.</div>`,
  ]]);

const c4q = quiz('hmo102-quiz-4', 'Quiz 4 — Tourism products (5A)|||Quiz 4 — Sản phẩm du lịch (5A)', [
  { id: 'q1', question: 'Trong mô hình 5A, "Amenities" chỉ điều gì?', options: ['Cách khách tiếp cận điểm đến', 'Thứ thu hút khách đến', 'Cơ sở vật chất tiện nghi tại điểm đến (khách sạn, nhà hàng...)', 'Dịch vụ ngân hàng, y tế đi kèm'], correctIndex: 2, explanation: 'Amenities = tiện nghi/cơ sở vật chất tại điểm đến, khác với Attractions và Ancillary services.' },
  { id: 'q2', question: 'Một sản phẩm du lịch được mô tả đúng nhất là?', options: ['Chỉ là hàng hoá hữu hình đơn lẻ', 'Chỉ là dịch vụ vô hình đơn lẻ', 'Một gói kết hợp hàng hoá hữu hình & dịch vụ vô hình tạo nên trải nghiệm', 'Chỉ tồn tại trong ngành hàng không'], correctIndex: 2, explanation: 'Sản phẩm du lịch là sự kết hợp giữa hữu hình (phòng, bữa ăn) và vô hình (dịch vụ, trải nghiệm).' },
  { id: 'q3', question: 'Du lịch dựa vào thiên nhiên, hướng tới tác động thấp lên môi trường gọi là?', options: ['Du lịch MICE', 'Du lịch sinh thái (eco-tourism)', 'Du lịch y tế', 'Du lịch mạo hiểm'], correctIndex: 1, explanation: 'Eco-tourism là du lịch dựa vào thiên nhiên, giảm thiểu tác động môi trường.' },
]);

const c5 = doc('hmo102-5-1-service-characteristics', '5.1 — Service characteristics & customer experience|||5.1 — Đặc điểm dịch vụ & trải nghiệm khách hàng',
  'Bốn đặc điểm dịch vụ IHIP (vô hình, không đồng nhất, không tách rời, không tồn trữ) và hệ quả cho hospitality; khoảnh khắc quyết định & khoảng cách chất lượng dịch vụ.',
  [[
    `<span class="eyebrow">HMO102 · Chapter 5 · Lesson 5.1</span>
<h2>Service characteristics &amp; customer experience</h2>
<h3>The four IHIP characteristics</h3>
<pre><code>IHIP — what makes a SERVICE different from a physical PRODUCT
  Intangibility     can't touch/see it before buying (a "clean room" is a promise)
  Heterogeneity     quality varies staff-to-staff, day-to-day (variability)
  Inseparability    produced & consumed at the SAME time (a haircut, a meal served hot)
  Perishability     can't be stored — an empty hotel room tonight is lost revenue forever
</code></pre>
<h3>What this means for hospitality</h3>
<ul>
<li><strong>Intangibility</strong> → give guests tangible cues (a clean lobby, a tidy uniform) to signal quality they can't otherwise "see" in advance.</li>
<li><strong>Heterogeneity</strong> → training and standard operating procedures (SOPs) keep every guest's experience consistent.</li>
<li><strong>Inseparability</strong> → staff ARE the product in the moment of service — a rude front-desk agent damages the whole stay.</li>
<li><strong>Perishability</strong> → this is why hotels/airlines use dynamic pricing and overbook slightly — an unsold seat/room tonight cannot be sold again tomorrow.</li>
</ul>
<h3>Moments of truth &amp; service gaps</h3>
<p>Every guest interaction — checking in, ordering room service, checking out — is a <strong>"moment of truth"</strong> that shapes satisfaction. The <strong>SERVQUAL</strong> model tracks the gap between what a guest <em>expects</em> and what they <em>perceive</em> they received; closing that gap is the core job of service management.</p>
<div class="callout"><span class="badge">Remember IHIP</span> A hotel room is not a product you can return for a refund and re-sell unused — it is a promise, delivered live, by people, and lost forever if unsold tonight.</div>`,
    `<span class="eyebrow">HMO102 · Chương 5 · Bài 5.1</span>
<h2>Đặc điểm dịch vụ &amp; trải nghiệm khách hàng</h2>
<h3>Bốn đặc điểm IHIP</h3>
<pre><code>IHIP — điều khiến DỊCH VỤ khác với SẢN PHẨM vật lý
  Vô hình (Intangibility)      không sờ/thấy trước khi mua (một "phòng sạch" chỉ là lời hứa)
  Không đồng nhất (Heterogeneity)  chất lượng khác nhau theo nhân viên, theo ngày
  Không tách rời (Inseparability)  sản xuất & tiêu dùng CÙNG LÚC (cắt tóc, món ăn phục vụ nóng)
  Không tồn trữ (Perishability)    không lưu kho được — phòng trống đêm nay là mất doanh thu vĩnh viễn
</code></pre>
<h3>Ý nghĩa với ngành hospitality</h3>
<ul>
<li><strong>Vô hình</strong> → cần dấu hiệu hữu hình (sảnh sạch, đồng phục gọn) để báo hiệu chất lượng khách không thể "thấy" trước.</li>
<li><strong>Không đồng nhất</strong> → đào tạo và quy trình chuẩn (SOP) giúp trải nghiệm mọi khách nhất quán.</li>
<li><strong>Không tách rời</strong> → nhân viên CHÍNH LÀ sản phẩm ngay tại thời điểm phục vụ — một lễ tân thô lỗ làm hỏng cả kỳ nghỉ.</li>
<li><strong>Không tồn trữ</strong> → đây là lý do khách sạn/hàng không dùng giá động và overbook nhẹ — một chỗ/phòng không bán được đêm nay không thể bán lại vào ngày mai.</li>
</ul>
<h3>Khoảnh khắc quyết định &amp; khoảng cách chất lượng dịch vụ</h3>
<p>Mỗi tương tác với khách — nhận phòng, gọi dịch vụ phòng, trả phòng — là một <strong>"khoảnh khắc quyết định" (moment of truth)</strong> định hình sự hài lòng. Mô hình <strong>SERVQUAL</strong> theo dõi khoảng cách giữa điều khách <em>kỳ vọng</em> và điều họ <em>cảm nhận</em> đã nhận được; thu hẹp khoảng cách đó là công việc cốt lõi của quản trị dịch vụ.</p>
<div class="callout"><span class="badge">Ghi nhớ IHIP</span> Một phòng khách sạn không phải sản phẩm có thể trả lại để hoàn tiền và bán lại nguyên vẹn — đó là một lời hứa, được thực hiện trực tiếp, bởi con người, và mất vĩnh viễn nếu không bán được đêm nay.</div>`,
  ]]);

const c5q = quiz('hmo102-quiz-5', 'Quiz 5 — Service characteristics|||Quiz 5 — Đặc điểm dịch vụ', [
  { id: 'q1', question: 'Đặc điểm nào của dịch vụ khiến "phòng khách sạn không bán được đêm nay là mất doanh thu vĩnh viễn"?', options: ['Vô hình (Intangibility)', 'Không đồng nhất (Heterogeneity)', 'Không tồn trữ (Perishability)', 'Không tách rời (Inseparability)'], correctIndex: 2, explanation: 'Perishability: dịch vụ không lưu kho được, phòng trống đêm nay mất doanh thu vĩnh viễn.' },
  { id: 'q2', question: '"Không tách rời" (Inseparability) trong dịch vụ có nghĩa là?', options: ['Dịch vụ được sản xuất và tiêu dùng cùng lúc', 'Dịch vụ có thể lưu kho để bán sau', 'Chất lượng luôn giống nhau mọi lúc', 'Khách có thể thấy dịch vụ trước khi mua'], correctIndex: 0, explanation: 'Inseparability: dịch vụ được tạo ra và tiêu dùng đồng thời (vd cắt tóc, phục vụ món nóng).' },
  { id: 'q3', question: 'Mô hình SERVQUAL dùng để làm gì?', options: ['Tính giá phòng động', 'Theo dõi khoảng cách giữa kỳ vọng và cảm nhận của khách về chất lượng dịch vụ', 'Thiết kế sơ đồ tổ chức khách sạn', 'Quản lý tồn kho thực phẩm'], correctIndex: 1, explanation: 'SERVQUAL đo khoảng cách giữa kỳ vọng (expectation) và cảm nhận (perception) của khách.' },
]);

const c6 = doc('hmo102-6-1-hotel-org-structure', '6.1 — Hotel organizational structure & departments|||6.1 — Cơ cấu tổ chức khách sạn & các bộ phận',
  'Các bộ phận chính của khách sạn (lễ tân, buồng phòng, F&B, sales & marketing, nhân sự, tài chính, kỹ thuật, an ninh); front-of-house vs back-of-house.',
  [[
    `<span class="eyebrow">HMO102 · Chapter 6 · Lesson 6.1</span>
<h2>Hotel organizational structure &amp; departments</h2>
<h3>Core departments</h3>
<pre><code>General Manager (GM)
  |-- Front Office        reservations, check-in/out, guest services, concierge
  |-- Housekeeping        room cleaning, laundry, public area upkeep
  |-- Food & Beverage      restaurants, bars, banquet/events, room service
  |-- Sales & Marketing    corporate accounts, OTAs, promotions, branding
  |-- Human Resources      hiring, training, staff welfare
  |-- Finance/Accounting   revenue, payroll, budgeting, purchasing
  |-- Engineering/Maintenance  repairs, HVAC, safety systems
  |-- Security             guest & property safety
</code></pre>
<h3>Front-of-house vs back-of-house</h3>
<ul>
<li><strong>Front-of-house (FOH)</strong> — guest-facing: front office, F&amp;B service, concierge. Directly shapes the guest's perception.</li>
<li><strong>Back-of-house (BOH)</strong> — not guest-facing but essential: kitchen prep, laundry, engineering, accounting. Guests rarely see it, but everything breaks without it.</li>
</ul>
<div class="callout"><span class="badge">Why structure matters</span> A guest complaint about a "dirty room" might trace back to Housekeeping (BOH) staffing, while a guest complaint about a "rude receptionist" is a Front Office (FOH) training issue — the org chart tells you exactly where to look.</div>`,
    `<span class="eyebrow">HMO102 · Chương 6 · Bài 6.1</span>
<h2>Cơ cấu tổ chức khách sạn &amp; các bộ phận</h2>
<h3>Các bộ phận chính</h3>
<pre><code>Tổng Giám đốc (GM)
  |-- Lễ tân (Front Office)    đặt phòng, nhận/trả phòng, dịch vụ khách, concierge
  |-- Buồng phòng (Housekeeping)  dọn phòng, giặt ủi, vệ sinh khu vực chung
  |-- Ẩm thực (F&B)             nhà hàng, bar, tiệc/sự kiện, dịch vụ phòng
  |-- Kinh doanh & Marketing     khách hàng doanh nghiệp, OTA, khuyến mãi, thương hiệu
  |-- Nhân sự (HR)              tuyển dụng, đào tạo, phúc lợi nhân viên
  |-- Tài chính/Kế toán          doanh thu, lương, ngân sách, mua sắm
  |-- Kỹ thuật/Bảo trì           sửa chữa, điều hoà, hệ thống an toàn
  |-- An ninh                   an toàn cho khách & tài sản
</code></pre>
<h3>Front-of-house vs back-of-house</h3>
<ul>
<li><strong>Front-of-house (FOH)</strong> — tiếp xúc trực tiếp với khách: lễ tân, phục vụ F&amp;B, concierge. Trực tiếp định hình cảm nhận của khách.</li>
<li><strong>Back-of-house (BOH)</strong> — không tiếp xúc khách nhưng thiết yếu: chuẩn bị bếp, giặt ủi, kỹ thuật, kế toán. Khách hiếm khi thấy, nhưng thiếu nó mọi thứ đều trục trặc.</li>
</ul>
<div class="callout"><span class="badge">Vì sao cơ cấu quan trọng</span> Khách phàn nàn "phòng bẩn" có thể bắt nguồn từ nhân sự Buồng phòng (BOH), còn phàn nàn "lễ tân thô lỗ" là vấn đề đào tạo của Lễ tân (FOH) — sơ đồ tổ chức cho biết chính xác nên tìm ở đâu.</div>`,
  ]]);

const c6q = quiz('hmo102-quiz-6', 'Quiz 6 — Hotel org structure|||Quiz 6 — Cơ cấu khách sạn', [
  { id: 'q1', question: 'Bộ phận nào chịu trách nhiệm dọn phòng, giặt ủi và vệ sinh khu vực chung?', options: ['Lễ tân', 'Buồng phòng (Housekeeping)', 'Kỹ thuật', 'Kinh doanh & Marketing'], correctIndex: 1, explanation: 'Housekeeping chịu trách nhiệm dọn phòng, giặt ủi, vệ sinh khu vực chung.' },
  { id: 'q2', question: 'Bộ phận nào được xem là "front-of-house" (tiếp xúc trực tiếp khách)?', options: ['Kế toán', 'Kỹ thuật/Bảo trì', 'Lễ tân & phục vụ F&B', 'Nhân sự'], correctIndex: 2, explanation: 'Lễ tân và phục vụ F&B tiếp xúc trực tiếp khách nên thuộc front-of-house.' },
  { id: 'q3', question: 'Khiếu nại "phòng bẩn" nên được truy vấn đầu tiên ở bộ phận nào?', options: ['Buồng phòng (Housekeeping)', 'Sales & Marketing', 'An ninh', 'Tài chính/Kế toán'], correctIndex: 0, explanation: 'Phòng bẩn liên quan trực tiếp đến chất lượng dọn phòng của Housekeeping.' },
]);

const c7 = doc('hmo102-7-1-careers-skills', '7.1 — Careers & skills in the industry|||7.1 — Nghề nghiệp & kỹ năng trong ngành',
  'Các vị trí từ entry-level đến quản lý; kỹ năng cần thiết (giao tiếp, ngoại ngữ, xử lý tình huống, công nghệ); lộ trình thăng tiến.',
  [[
    `<span class="eyebrow">HMO102 · Chapter 7 · Lesson 7.1</span>
<h2>Careers &amp; skills in the industry</h2>
<h3>A career ladder, not a dead end</h3>
<pre><code>Entry-level        Receptionist, F&B server, housekeeping attendant, tour guide
      |
Supervisor/lead     Front Office supervisor, F&B captain, team leader
      |
Manager             Department manager (Front Office/F&B/Sales), revenue manager
      |
Executive           General Manager (GM), Regional/Area Director
</code></pre>
<h3>Common entry roles</h3>
<ul>
<li><strong>Front desk / receptionist</strong> — check-in/out, guest requests</li>
<li><strong>Concierge</strong> — recommendations, bookings, local know-how</li>
<li><strong>F&amp;B service &amp; chef roles</strong> — serving and preparing food</li>
<li><strong>Tour guide</strong> — leading and narrating trips</li>
<li><strong>Event planner</strong> — organizing weddings, conferences, banquets</li>
</ul>
<h3>Skills that matter most</h3>
<ul>
<li><strong>Communication &amp; foreign languages</strong> — guests come from everywhere</li>
<li><strong>Cultural sensitivity</strong> — respecting different customs and expectations</li>
<li><strong>Problem-solving under pressure</strong> — service failures happen live, in front of the guest</li>
<li><strong>Teamwork</strong> — one department's delay affects every other department</li>
<li><strong>Technology literacy</strong> — booking systems, PMS, POS</li>
</ul>
<div class="callout"><span class="badge">Why it's a good starting point</span> Hospitality is one of the few industries where you can start at the front desk and, over 10-15 years, become a hotel General Manager — the industry heavily promotes from within.</div>`,
    `<span class="eyebrow">HMO102 · Chương 7 · Bài 7.1</span>
<h2>Nghề nghiệp &amp; kỹ năng trong ngành</h2>
<h3>Một nấc thang nghề nghiệp, không phải ngõ cụt</h3>
<pre><code>Cấp mới vào nghề    Lễ tân, phục vụ F&B, nhân viên buồng phòng, hướng dẫn viên
      |
Giám sát/trưởng nhóm  Giám sát lễ tân, captain F&B, trưởng nhóm
      |
Quản lý              Trưởng bộ phận (lễ tân/F&B/kinh doanh), revenue manager
      |
Cấp điều hành         Tổng Giám đốc (GM), Giám đốc khu vực/vùng
</code></pre>
<h3>Các vị trí phổ biến khi mới vào nghề</h3>
<ul>
<li><strong>Lễ tân</strong> — nhận/trả phòng, xử lý yêu cầu khách</li>
<li><strong>Concierge</strong> — gợi ý, đặt dịch vụ, hiểu biết địa phương</li>
<li><strong>Phục vụ F&amp;B &amp; đầu bếp</strong> — phục vụ và chế biến món ăn</li>
<li><strong>Hướng dẫn viên du lịch</strong> — dẫn đoàn và thuyết minh</li>
<li><strong>Người tổ chức sự kiện</strong> — tổ chức cưới hỏi, hội nghị, tiệc</li>
</ul>
<h3>Kỹ năng quan trọng nhất</h3>
<ul>
<li><strong>Giao tiếp &amp; ngoại ngữ</strong> — khách đến từ mọi nơi trên thế giới</li>
<li><strong>Nhạy cảm văn hoá</strong> — tôn trọng phong tục &amp; kỳ vọng khác nhau</li>
<li><strong>Giải quyết vấn đề dưới áp lực</strong> — sự cố dịch vụ xảy ra trực tiếp, ngay trước mặt khách</li>
<li><strong>Làm việc nhóm</strong> — sự chậm trễ của một bộ phận ảnh hưởng mọi bộ phận khác</li>
<li><strong>Am hiểu công nghệ</strong> — hệ thống đặt phòng, PMS, POS</li>
</ul>
<div class="callout"><span class="badge">Vì sao đây là điểm khởi đầu tốt</span> Hospitality là một trong số ít ngành mà bạn có thể bắt đầu từ vị trí lễ tân và, sau 10-15 năm, trở thành Tổng Giám đốc khách sạn — ngành ưu tiên thăng tiến từ nội bộ.</div>`,
  ]]);

const c7q = quiz('hmo102-quiz-7', 'Quiz 7 — Careers & skills|||Quiz 7 — Nghề nghiệp & kỹ năng', [
  { id: 'q1', question: 'Theo lộ trình nghề nghiệp điển hình trong hospitality, sau vị trí giám sát/trưởng nhóm thường là cấp nào?', options: ['Cấp điều hành (GM) ngay lập tức', 'Quản lý bộ phận (Manager)', 'Trở về cấp mới vào nghề', 'Không có cấp nào tiếp theo'], correctIndex: 1, explanation: 'Lộ trình: entry-level -> giám sát/trưởng nhóm -> quản lý bộ phận -> điều hành (GM).' },
  { id: 'q2', question: 'Kỹ năng nào đặc biệt quan trọng vì "sự cố dịch vụ xảy ra trực tiếp, ngay trước mặt khách"?', options: ['Kế toán', 'Giải quyết vấn đề dưới áp lực', 'Lập trình phần mềm', 'Thiết kế đồ hoạ'], correctIndex: 1, explanation: 'Dịch vụ diễn ra trực tiếp (inseparability) nên cần giải quyết vấn đề nhanh, dưới áp lực.' },
  { id: 'q3', question: 'Vì sao hospitality được xem là ngành "ưu tiên thăng tiến từ nội bộ"?', options: ['Vì ngành này không cần kỹ năng gì', 'Vì có thể bắt đầu từ lễ tân và thăng tiến lên Tổng Giám đốc theo thời gian', 'Vì chỉ tuyển người có bằng thạc sĩ', 'Vì lương entry-level rất cao'], correctIndex: 1, explanation: 'Ngành hospitality thường đào tạo và thăng tiến nhân viên từ vị trí entry-level lên quản lý, điều hành.' },
]);

const c8 = doc('hmo102-8-1-sustainable-tech-vietnam', '8.1 — Sustainable tourism, technology & Vietnam’s tourism industry|||8.1 — Du lịch bền vững, công nghệ & ngành du lịch Việt Nam',
  'Ba trụ cột du lịch bền vững, vấn đề quá tải du lịch; công nghệ (PMS, OTA, AI, không tiếp xúc); di sản & tăng trưởng du lịch Việt Nam.',
  [[
    `<span class="eyebrow">HMO102 · Chapter 8 · Lesson 8.1</span>
<h2>Sustainable tourism, technology &amp; Vietnam's tourism industry</h2>
<h3>Sustainable tourism — the triple bottom line</h3>
<pre><code>Sustainable tourism balances THREE pillars:
  Economic     jobs, income, local business growth
  Social/cultural   respecting local communities, traditions, fair benefit-sharing
  Environmental     protecting nature, limiting pollution/overcrowding
</code></pre>
<p><strong>Overtourism</strong> — when visitor numbers exceed a destination's capacity — damages exactly these pillars (e.g. eroded heritage sites, resentful locals, degraded nature). Sustainable tourism aims to grow visitor numbers WITHOUT breaking that balance.</p>
<h3>Technology reshaping the guest journey</h3>
<ul>
<li><strong>PMS (Property Management System)</strong> — runs a hotel's reservations, check-in/out, billing</li>
<li><strong>OTA (Online Travel Agency)</strong> — Booking.com, Agoda, etc. — booking distribution</li>
<li><strong>AI chatbots &amp; contactless check-in</strong> — faster, 24/7 guest service</li>
</ul>
<h3>Vietnam's tourism industry</h3>
<p>Vietnam has multiple <strong>UNESCO World Heritage Sites</strong> that anchor its tourism product — Ha Long Bay, Hoi An Ancient Town, Trang An Landscape Complex, among others — plus a national strategy targeting continued tourism growth through 2030, driven by both international arrivals and a fast-growing domestic travel market.</p>
<div class="callout"><span class="badge">Closing the loop</span> Every chapter in this course — definitions, sectors, products, service, structure, careers — comes together here: a sustainable, tech-enabled tourism industry is how Vietnam turns its heritage sites into long-term economic &amp; social value.</div>`,
    `<span class="eyebrow">HMO102 · Chương 8 · Bài 8.1</span>
<h2>Du lịch bền vững, công nghệ &amp; ngành du lịch Việt Nam</h2>
<h3>Du lịch bền vững — ba trụ cột</h3>
<pre><code>Du lịch bền vững cân bằng BA trụ cột:
  Kinh tế       việc làm, thu nhập, tăng trưởng doanh nghiệp địa phương
  Xã hội/văn hoá  tôn trọng cộng đồng địa phương, truyền thống, chia sẻ lợi ích công bằng
  Môi trường     bảo vệ thiên nhiên, hạn chế ô nhiễm/quá tải
</code></pre>
<p><strong>Quá tải du lịch (overtourism)</strong> — khi số lượng khách vượt quá năng lực chứa của điểm đến — gây tổn hại chính ba trụ cột này (di sản xuống cấp, người dân bất bình, thiên nhiên suy thoái). Du lịch bền vững nhằm tăng lượng khách MÀ KHÔNG phá vỡ sự cân bằng đó.</p>
<h3>Công nghệ định hình lại hành trình khách</h3>
<ul>
<li><strong>PMS (Hệ thống quản lý khách sạn)</strong> — vận hành đặt phòng, nhận/trả phòng, thanh toán</li>
<li><strong>OTA (Đại lý du lịch trực tuyến)</strong> — Booking.com, Agoda, v.v. — phân phối đặt phòng</li>
<li><strong>Chatbot AI &amp; nhận phòng không tiếp xúc</strong> — phục vụ khách nhanh hơn, 24/7</li>
</ul>
<h3>Ngành du lịch Việt Nam</h3>
<p>Việt Nam có nhiều <strong>Di sản Thế giới UNESCO</strong> làm nền cho sản phẩm du lịch — Vịnh Hạ Long, Phố cổ Hội An, Quần thể danh thắng Tràng An, và nhiều nơi khác — cùng chiến lược quốc gia hướng tới tăng trưởng du lịch bền vững đến năm 2030, được thúc đẩy bởi cả khách quốc tế và thị trường du lịch nội địa đang tăng nhanh.</p>
<div class="callout"><span class="badge">Khép lại vòng kiến thức</span> Mọi chương trong môn này — định nghĩa, lĩnh vực, sản phẩm, dịch vụ, cơ cấu, nghề nghiệp — hội tụ ở đây: một ngành du lịch bền vững, có công nghệ hỗ trợ là cách Việt Nam biến di sản thành giá trị kinh tế &amp; xã hội lâu dài.</div>`,
  ]]);

const c8q = quiz('hmo102-quiz-8', 'Quiz 8 — Sustainability, tech & Vietnam|||Quiz 8 — Bền vững, công nghệ & Việt Nam', [
  { id: 'q1', question: 'Ba trụ cột của du lịch bền vững là?', options: ['Kinh tế, xã hội/văn hoá, môi trường', 'Công nghệ, marketing, tài chính', 'Lưu trú, ẩm thực, lữ hành', 'Chính phủ, doanh nghiệp, ngân hàng'], correctIndex: 0, explanation: 'Du lịch bền vững cân bằng ba trụ cột: kinh tế, xã hội/văn hoá, môi trường.' },
  { id: 'q2', question: '"Overtourism" (quá tải du lịch) là hiện tượng gì?', options: ['Khách du lịch giảm mạnh', 'Số lượng khách vượt quá năng lực chứa của điểm đến, gây tổn hại các trụ cột bền vững', 'Giá phòng khách sạn giảm', 'Chỉ xảy ra ở các nước nghèo'], correctIndex: 1, explanation: 'Overtourism là khi lượng khách vượt sức chứa, gây hại cho môi trường/xã hội/kinh tế địa phương.' },
  { id: 'q3', question: 'Kể tên một Di sản Thế giới UNESCO của Việt Nam được nêu trong bài?', options: ['Tháp Eiffel', 'Vịnh Hạ Long', 'Đại Vạn Lý Trường Thành', 'Kim tự tháp Giza'], correctIndex: 1, explanation: 'Vịnh Hạ Long là một trong các Di sản Thế giới UNESCO của Việt Nam được nêu trong bài.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'HMO102',
    slug: 'hmo102-introduction-to-tourism-amp-hospitality-industry',
    title: 'Introduction to Tourism &amp; Hospitality industry',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/HMO102.webp',
    shortDescription: '8-chapter intro to tourism & hospitality — industry overview, history, sectors, tourism products, service & guest experience, hotel departments, careers, sustainable tourism & tech in Vietnam. Bilingual, quizzes.|||Khung 8 chương nhập môn du lịch & khách sạn — tổng quan ngành, lịch sử, các lĩnh vực, sản phẩm dịch vụ, dịch vụ & trải nghiệm khách, cơ cấu khách sạn, nghề nghiệp, du lịch bền vững & công nghệ tại Việt Nam. Song ngữ, có quiz.',
    description: 'Môn <strong>HMO102 — Introduction to Tourism &amp;amp; Hospitality Industry</strong> (kỳ 1, khối Quản trị Kinh doanh) giúp sinh viên có cái nhìn toàn cảnh về ngành du lịch và khách sạn. Từ <strong>khái niệm &amp;amp; quy mô ngành</strong> → <strong>lịch sử &amp;amp; xu hướng</strong> → các <strong>lĩnh vực trong hospitality</strong> (lưu trú, ẩm thực, lữ hành, MICE, giải trí) → <strong>sản phẩm &amp;amp; dịch vụ du lịch</strong> → <strong>đặc điểm dịch vụ &amp;amp; trải nghiệm khách hàng</strong> → <strong>cơ cấu tổ chức khách sạn</strong> → <strong>nghề nghiệp &amp;amp; kỹ năng</strong> → <strong>du lịch bền vững, công nghệ &amp;amp; ngành du lịch Việt Nam</strong>. Bám giáo trình quốc tế (Walker, Cooper, UNWTO), song ngữ, có ví dụ thực tế và quiz mỗi chương.',
    whatYouLearn: 'Định nghĩa và mối liên hệ giữa du lịch & khách sạn (UNWTO); lịch sử ngành và các xu hướng hiện đại; các lĩnh vực trong hospitality (lưu trú, ẩm thực, lữ hành, MICE, giải trí); cấu trúc sản phẩm & dịch vụ du lịch (mô hình 5A); đặc điểm dịch vụ IHIP & khoảng cách chất lượng dịch vụ; cơ cấu tổ chức khách sạn & các bộ phận; nghề nghiệp, kỹ năng & lộ trình thăng tiến; du lịch bền vững, công nghệ và tổng quan ngành du lịch Việt Nam.',
    requirements: 'Không yêu cầu kiến thức nền; phù hợp sinh viên năm nhất khối Quản trị Kinh doanh mới bắt đầu tìm hiểu ngành Du lịch & Khách sạn.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Walker/Cooper/UNWTO, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Ngành du lịch & khách sạn là gì, quy mô, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan ngành|||Chapter 1 — Industry overview', description: 'Định nghĩa, mối liên hệ tourism & hospitality, các bên liên quan.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Lịch sử & xu hướng|||Chapter 2 — History & trends', description: 'Cột mốc lịch sử, xu hướng phát triển hiện nay.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Các lĩnh vực hospitality|||Chapter 3 — Hospitality sectors', description: 'Lưu trú, ẩm thực, lữ hành, MICE, giải trí.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Sản phẩm & dịch vụ du lịch|||Chapter 4 — Tourism products & services', description: 'Mô hình 5A, các loại sản phẩm du lịch.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Đặc điểm dịch vụ & trải nghiệm khách|||Chapter 5 — Service characteristics & experience', description: 'IHIP, khoảnh khắc quyết định, SERVQUAL.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Cơ cấu tổ chức khách sạn|||Chapter 6 — Hotel organizational structure', description: 'Các bộ phận, front-of-house/back-of-house.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Nghề nghiệp & kỹ năng|||Chapter 7 — Careers & skills', description: 'Vị trí entry-level đến quản lý, kỹ năng, lộ trình.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Bền vững, công nghệ & Việt Nam|||Chapter 8 — Sustainability, technology & Vietnam', description: 'Du lịch bền vững, công nghệ, ngành du lịch Việt Nam.', lessons: [c8, c8q] },
  ],
};
