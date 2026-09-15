/**
 * LOD222 — Front Desk and Receptionist Skills. Giáo trình tham khảo:
 * "Front Office Operations and Management" (Bardi); "Hotel Front Office
 * Management" (Kasavana); tiêu chuẩn nghề VTOS Việt Nam (Front Office).
 * Khung 8 chương: tổng quan lễ tân → chu trình khách & đặt phòng →
 * check-in → dịch vụ lưu trú → check-out & thanh toán → giao tiếp/phàn nàn
 * → PMS → upselling/an ninh. Song ngữ + quy trình + quiz.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('lod222-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (Bardi, Kasavana), tiêu chuẩn nghề VTOS, tài liệu chính thức miễn phí, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">LOD222 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn front desk and receptionist skills — the guest cycle, check-in/check-out, complaint handling, PMS and upselling — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for LOD222 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Front Office Operations and Management</em> — James A. Bardi (core front-office textbook: reservations, registration, guest services, night audit)</li>
<li><em>Hotel Front Office Management</em> — Michael L. Kasavana &amp; Richard M. Brooks (PMS-focused, guest cycle framework used across the industry)</li>
</ul>
<h3>🌐 Official / free standards</h3>
<ul>
<li><a href="https://vtos.edu.vn/" target="_blank" rel="noopener">VTOS — Vietnam Tourism Occupational Skills Standards</a> — the national skills standard for Front Office, used by most Vietnamese hotel schools and employers</li>
<li><a href="https://www.ahlei.org/" target="_blank" rel="noopener">AHLEI — American Hotel &amp; Lodging Educational Institute</a> — front office certification references</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=hotel+front+office+training" target="_blank" rel="noopener">Hotel front office training (search)</a> — check-in/check-out role-plays, telephone etiquette demos</li>
<li><a href="https://www.youtube.com/results?search_query=hospitality+guest+complaint+handling" target="_blank" rel="noopener">Guest complaint handling (search)</a> — real service-recovery scenarios</li>
</ul>
<h3>🛠️ Tools you should know exist</h3>
<ul>
<li>Property Management Systems (PMS): Oracle Opera, Smile, eZee — most schools use a demo/trial version for hands-on practice</li>
<li>OTA extranets: Booking.com, Agoda, Expedia partner portals — where most reservations arrive from today</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — front office structure, the guest cycle (pre-arrival → arrival → occupancy → departure), reservation types.</li>
<li><strong>Procedure drill</strong> — check-in and check-out scripts, registration cards, folio &amp; payment settlement.</li>
<li><strong>Service skills</strong> — telephone etiquette, complaint handling models, handling difficult guests.</li>
<li><strong>Job-ready</strong> — PMS hands-on practice, upselling techniques, security &amp; privacy standards (VTOS).</li>
</ol></div>`,
    `<span class="eyebrow">LOD222 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học kỹ năng lễ tân — chu trình khách, nhận/trả phòng, xử lý phàn nàn, PMS và bán hàng — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của LOD222 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Front Office Operations and Management</em> — James A. Bardi (giáo trình lễ tân cốt lõi: đặt phòng, đăng ký, dịch vụ khách, kiểm toán đêm)</li>
<li><em>Hotel Front Office Management</em> — Michael L. Kasavana &amp; Richard M. Brooks (trọng tâm PMS, khung chu trình khách dùng phổ biến trong ngành)</li>
</ul>
<h3>🌐 Tiêu chuẩn chính thức / miễn phí</h3>
<ul>
<li><a href="https://vtos.edu.vn/" target="_blank" rel="noopener">VTOS — Tiêu chuẩn kỹ năng nghề Du lịch Việt Nam</a> — tiêu chuẩn nghề quốc gia cho Lễ tân, được hầu hết trường &amp; doanh nghiệp khách sạn Việt Nam dùng</li>
<li><a href="https://www.ahlei.org/" target="_blank" rel="noopener">AHLEI — Viện Giáo dục Khách sạn &amp; Lưu trú Hoa Kỳ</a> — tài liệu tham khảo chứng chỉ lễ tân</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=hotel+front+office+training" target="_blank" rel="noopener">Hotel front office training (tìm kiếm)</a> — nhập vai check-in/check-out, mẫu giao tiếp qua điện thoại</li>
<li><a href="https://www.youtube.com/results?search_query=hospitality+guest+complaint+handling" target="_blank" rel="noopener">Guest complaint handling (tìm kiếm)</a> — tình huống xử lý phàn nàn thực tế</li>
</ul>
<h3>🛠️ Công cụ nên biết</h3>
<ul>
<li>Hệ thống quản lý tài sản (PMS): Oracle Opera, Smile, eZee — hầu hết trường dùng bản demo/thử để thực hành</li>
<li>Cổng OTA: Booking.com, Agoda, Expedia — nơi phần lớn đặt phòng đến ngày nay</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — cấu trúc bộ phận lễ tân, chu trình khách (trước đến → đến → lưu trú → đi), các loại đặt phòng.</li>
<li><strong>Luyện quy trình</strong> — mẫu hội thoại check-in/check-out, thẻ đăng ký, folio &amp; thanh toán.</li>
<li><strong>Kỹ năng dịch vụ</strong> — giao tiếp điện thoại, mô hình xử lý phàn nàn, xử lý khách khó tính.</li>
<li><strong>Sẵn sàng đi làm</strong> — thực hành PMS, kỹ thuật upselling, tiêu chuẩn an ninh &amp; riêng tư (VTOS).</li>
</ol></div>`,
  ]]);

const intro = doc('lod222-0-1-overview', 'Course overview: Front Desk and Receptionist Skills|||Tổng quan: Kỹ năng Lễ tân',
  'Vì sao lễ tân là "mặt tiền" của khách sạn; lộ trình 8 chương từ tổng quan bộ phận đến chu trình khách, check-in/out, giao tiếp, PMS, upselling & an ninh.',
  [[
    `<span class="eyebrow">LOD222 · Lesson 0.1 · Overview</span>
<h2>Front Desk and Receptionist Skills</h2>
<p class="lead">The front desk is the <strong>face of the hotel</strong> — the first and last point of contact for almost every guest. This course builds the practical skills of a professional receptionist: running the <strong>guest cycle</strong> from reservation to departure, communicating and handling complaints well, using a <strong>Property Management System (PMS)</strong>, and protecting both revenue (upselling) and guest safety (security).</p>
<h3>Why it matters</h3>
<p>A hotel can have great rooms and food, but one rude or slow check-in can define a guest's entire impression. Front office staff also sit at the center of hotel operations — coordinating housekeeping, F&amp;B, sales and security in real time.</p>
<h3>Roadmap — 8 chapters</h3>
<ol>
<li>Front office overview &amp; the receptionist's role</li>
<li>The guest cycle &amp; reservations</li>
<li>Check-in procedure &amp; welcoming guests</li>
<li>In-house services &amp; handling guest requests</li>
<li>Check-out procedure &amp; billing</li>
<li>Communication skills, complaint handling &amp; difficult situations</li>
<li>PMS &amp; guest information management</li>
<li>Upselling, security &amp; service standards</li>
</ol>
<p>Based on Bardi's <em>Front Office Operations and Management</em>, Kasavana's <em>Hotel Front Office Management</em>, and the Vietnamese national skills standard <strong>VTOS</strong> for Front Office. Bilingual, with step-by-step checklists, sample scripts and a quiz per chapter.</p>`,
    `<span class="eyebrow">LOD222 · Bài 0.1 · Tổng quan</span>
<h2>Kỹ năng Lễ tân</h2>
<p class="lead">Bộ phận lễ tân là <strong>mặt tiền của khách sạn</strong> — điểm chạm đầu tiên và cuối cùng với hầu hết mọi khách. Môn này xây kỹ năng thực hành của một lễ tân chuyên nghiệp: vận hành <strong>chu trình khách (guest cycle)</strong> từ đặt phòng đến rời đi, giao tiếp và xử lý phàn nàn tốt, dùng <strong>hệ thống quản lý tài sản (PMS)</strong>, và bảo vệ cả doanh thu (upselling) lẫn an toàn khách (an ninh).</p>
<h3>Vì sao quan trọng</h3>
<p>Khách sạn có phòng đẹp, đồ ăn ngon nhưng một lượt check-in chậm chạp, khiếm nhã có thể định hình cả cảm nhận của khách. Nhân viên lễ tân còn nằm ở trung tâm vận hành khách sạn — phối hợp buồng phòng, F&amp;B, kinh doanh và an ninh theo thời gian thực.</p>
<h3>Lộ trình — 8 chương</h3>
<ol>
<li>Tổng quan bộ phận lễ tân &amp; vai trò của lễ tân</li>
<li>Chu trình khách &amp; đặt phòng</li>
<li>Quy trình nhận phòng &amp; đón tiếp khách</li>
<li>Dịch vụ trong thời gian lưu trú &amp; xử lý yêu cầu khách</li>
<li>Quy trình trả phòng &amp; thanh toán</li>
<li>Kỹ năng giao tiếp, xử lý phàn nàn &amp; tình huống khó</li>
<li>PMS &amp; quản lý thông tin khách</li>
<li>Bán hàng (upselling), an ninh &amp; tiêu chuẩn dịch vụ</li>
</ol>
<p>Dựa trên giáo trình <em>Front Office Operations and Management</em> của Bardi, <em>Hotel Front Office Management</em> của Kasavana, và tiêu chuẩn kỹ năng nghề quốc gia <strong>VTOS</strong> cho Lễ tân. Song ngữ, có quy trình từng bước, mẫu hội thoại và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('lod222-1-1-overview-role', '1.1 — Front office overview & the receptionist role|||1.1 — Tổng quan bộ phận lễ tân & vai trò',
  'Vị trí bộ phận lễ tân trong khách sạn ("trung tâm thần kinh"); các bộ phận nhỏ (đặt phòng, tiếp tân, hành lý, tổng đài, thu ngân); tố chất & kỹ năng cần có.',
  [[
    `<span class="eyebrow">LOD222 · Chapter 1 · Lesson 1.1</span>
<h2>Front office overview &amp; the receptionist role</h2>
<h3>The front office as the hotel's nerve center</h3>
<p>The <strong>front office</strong> is the department that manages the entire guest cycle — reservation, arrival, stay, departure — and coordinates with every other department. It is often called the hotel's <strong>nerve center</strong> because information (who's arriving, who needs a room cleaned, who's checking out) flows through it constantly.</p>
<h3>Sub-sections of front office</h3>
<ul>
<li><strong>Reservations</strong> — takes and confirms bookings from OTAs, phone, email, walk-in.</li>
<li><strong>Reception / front desk</strong> — checks guests in and out, assigns rooms, handles registration.</li>
<li><strong>Concierge / guest services</strong> — tours, transport, restaurant bookings, local information.</li>
<li><strong>Bell desk</strong> — luggage handling, escorting guests to rooms.</li>
<li><strong>Telephone operator / PBX</strong> — routes calls, wake-up calls, message taking.</li>
<li><strong>Front office cashier</strong> — settles bills, foreign currency exchange, safe deposit boxes.</li>
</ul>
<h3>Qualities of a professional receptionist</h3>
<ul>
<li><strong>Appearance &amp; grooming</strong> — neat uniform, professional posture; guests judge the hotel by the first face they see.</li>
<li><strong>Communication</strong> — clear, polite, active listening, comfortable in a second language.</li>
<li><strong>Multitasking under pressure</strong> — a queue at the desk, a ringing phone, and a PMS screen, all at once.</li>
<li><strong>Product knowledge</strong> — room types, rates, facilities, local area — so answers are instant, not "let me check."</li>
<li><strong>Discretion</strong> — guest information (room number, who they are with) is confidential by default.</li>
</ul>
<div class="callout"><span class="badge">Cross-department coordination</span> Front office does not work alone — it talks constantly to <strong>housekeeping</strong> (room status), <strong>F&amp;B</strong> (breakfast counts, room service), <strong>sales</strong> (group bookings), and <strong>security</strong> (incidents, key control).</div>`,
    `<span class="eyebrow">LOD222 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan bộ phận lễ tân &amp; vai trò của lễ tân</h2>
<h3>Lễ tân — trung tâm thần kinh của khách sạn</h3>
<p><strong>Bộ phận lễ tân (front office)</strong> quản lý toàn bộ chu trình khách — đặt phòng, đến, lưu trú, rời đi — và phối hợp với mọi bộ phận khác. Nó thường được gọi là <strong>trung tâm thần kinh</strong> của khách sạn vì thông tin (ai sắp đến, phòng nào cần dọn, ai đang trả phòng) liên tục chảy qua đây.</p>
<h3>Các bộ phận nhỏ của lễ tân</h3>
<ul>
<li><strong>Đặt phòng (Reservations)</strong> — nhận và xác nhận đặt phòng từ OTA, điện thoại, email, khách vãng lai (walk-in).</li>
<li><strong>Tiếp tân / lễ tân sảnh</strong> — nhận/trả phòng cho khách, phân phòng, làm thủ tục đăng ký.</li>
<li><strong>Concierge / dịch vụ khách</strong> — tour, xe đưa đón, đặt nhà hàng, thông tin địa phương.</li>
<li><strong>Bộ phận hành lý (Bell desk)</strong> — vận chuyển hành lý, đưa khách lên phòng.</li>
<li><strong>Tổng đài (Telephone/PBX)</strong> — chuyển máy, gọi báo thức, nhận lời nhắn.</li>
<li><strong>Thu ngân lễ tân</strong> — thanh toán hóa đơn, đổi ngoại tệ, két an toàn.</li>
</ul>
<h3>Tố chất của một lễ tân chuyên nghiệp</h3>
<ul>
<li><strong>Ngoại hình &amp; tác phong</strong> — đồng phục gọn gàng, dáng đứng chuyên nghiệp; khách đánh giá khách sạn qua gương mặt đầu tiên họ thấy.</li>
<li><strong>Giao tiếp</strong> — rõ ràng, lịch sự, lắng nghe chủ động, tự tin dùng ngoại ngữ.</li>
<li><strong>Xử lý nhiều việc dưới áp lực</strong> — hàng khách chờ, điện thoại reo, màn hình PMS — cùng một lúc.</li>
<li><strong>Am hiểu sản phẩm</strong> — loại phòng, giá, tiện ích, khu vực xung quanh — để trả lời ngay, không phải "để em kiểm tra lại."</li>
<li><strong>Kín tiếng</strong> — thông tin khách (số phòng, đi cùng ai) mặc định là bảo mật.</li>
</ul>
<div class="callout"><span class="badge">Phối hợp liên bộ phận</span> Lễ tân không làm việc đơn độc — liên tục trao đổi với <strong>buồng phòng</strong> (tình trạng phòng), <strong>F&amp;B</strong> (số lượng bữa sáng, room service), <strong>kinh doanh</strong> (đoàn khách), và <strong>an ninh</strong> (sự cố, quản lý chìa khóa).</div>`,
  ]]);

const c1q = quiz('lod222-quiz-1', 'Quiz 1 — Front office overview|||Quiz 1 — Tổng quan lễ tân', [
  { id: 'q1', question: 'Bộ phận lễ tân thường được gọi là gì vì thông tin liên tục chảy qua đó?', options: ['Trung tâm thần kinh của khách sạn', 'Bộ phận phụ trợ', 'Kho lưu trữ', 'Bộ phận độc lập, không cần phối hợp'], correctIndex: 0, explanation: 'Front office là nơi mọi thông tin về khách (đến, ở, đi) hội tụ và lan ra các bộ phận khác.' },
  { id: 'q2', question: 'Bộ phận nào chịu trách nhiệm vận chuyển hành lý và đưa khách lên phòng?', options: ['Concierge', 'Bell desk (hành lý)', 'Thu ngân lễ tân', 'Tổng đài'], correctIndex: 1, explanation: 'Bell desk phụ trách hành lý và hộ tống khách lên phòng.' },
  { id: 'q3', question: 'Vì sao lễ tân cần "kín tiếng" về thông tin khách?', options: ['Vì quy định phòng cháy', 'Vì thông tin khách (số phòng, người đi cùng) mặc định là bảo mật', 'Để tiết kiệm thời gian trả lời', 'Vì PMS không lưu thông tin đó'], correctIndex: 1, explanation: 'Bảo mật thông tin khách là nguyên tắc nghề nghiệp cơ bản của lễ tân.' },
]);

const c2 = doc('lod222-2-1-guest-cycle-reservations', '2.1 — The guest cycle & reservations|||2.1 — Chu trình khách & đặt phòng',
  '4 giai đoạn chu trình khách (trước đến, đến, lưu trú, rời đi); các loại đặt phòng (cá nhân, đoàn, OTA, walk-in); đặt phòng đảm bảo vs không đảm bảo; overbooking.',
  [[
    `<span class="eyebrow">LOD222 · Chapter 2 · Lesson 2.1</span>
<h2>The guest cycle &amp; reservations</h2>
<h3>The four stages of the guest cycle</h3>
<pre><code>1. Pre-arrival  -> reservation is made, confirmed, guest profile created
2. Arrival      -> check-in, registration, room key issued
3. Occupancy    -> guest services, requests, billing accumulates on the folio
4. Departure    -> check-out, settle the bill, guest history is saved
</code></pre>
<p>Every front office procedure in this course maps onto one of these four stages — this is the master framework used throughout the industry (Kasavana's model).</p>
<h3>Types of reservations</h3>
<ul>
<li><strong>Individual (FIT)</strong> — a single traveler or family booking directly.</li>
<li><strong>Group / MICE</strong> — blocks of rooms for tours, conferences, weddings — handled with a rooming list.</li>
<li><strong>Corporate</strong> — negotiated rates for a company's staff.</li>
<li><strong>OTA (Online Travel Agency)</strong> — Booking.com, Agoda, Expedia; today the majority of bookings arrive this way, pre-paid or pay-at-hotel.</li>
<li><strong>Walk-in</strong> — a guest arrives with no prior reservation, sold subject to availability.</li>
</ul>
<h3>Guaranteed vs. non-guaranteed</h3>
<ul>
<li><strong>Guaranteed reservation</strong> — held by a credit card, deposit or company account; the room is held all night even if the guest arrives late, but a cancellation policy/fee usually applies.</li>
<li><strong>Non-guaranteed reservation</strong> — held only until a cut-off time (e.g. 6 PM); released for resale after that.</li>
</ul>
<h3>Overbooking</h3>
<p>Hotels often <strong>overbook</strong> slightly (accept more reservations than rooms) because history shows a percentage of guests will no-show or cancel late. Done well it maximizes occupancy; done badly it produces a "walked guest" — a guest with a reservation but no room, who must be relocated (usually at the hotel's expense) to a comparable nearby hotel.</p>`,
    `<span class="eyebrow">LOD222 · Chương 2 · Bài 2.1</span>
<h2>Chu trình khách &amp; đặt phòng</h2>
<h3>Bốn giai đoạn của chu trình khách</h3>
<pre><code>1. Trước khi đến -> đặt phòng được tạo, xác nhận, hồ sơ khách được lập
2. Khi đến       -> check-in, đăng ký, giao chìa khóa/thẻ phòng
3. Lưu trú        -> phục vụ khách, xử lý yêu cầu, chi phí cộng vào folio
4. Rời đi         -> check-out, thanh toán, lịch sử khách được lưu lại
</code></pre>
<p>Mọi quy trình lễ tân trong môn này đều nằm trong một trong bốn giai đoạn này — đây là khung tổng quát dùng xuyên suốt ngành (mô hình của Kasavana).</p>
<h3>Các loại đặt phòng</h3>
<ul>
<li><strong>Cá nhân (FIT)</strong> — một khách hoặc một gia đình đặt trực tiếp.</li>
<li><strong>Đoàn / MICE</strong> — khối phòng cho tour, hội nghị, cưới hỏi — quản lý bằng danh sách phân phòng (rooming list).</li>
<li><strong>Công ty</strong> — giá đàm phán cho nhân viên một doanh nghiệp.</li>
<li><strong>OTA (đại lý du lịch trực tuyến)</strong> — Booking.com, Agoda, Expedia; ngày nay phần lớn đặt phòng đến từ đây, trả trước hoặc trả tại khách sạn.</li>
<li><strong>Khách vãng lai (walk-in)</strong> — khách đến không đặt trước, bán tùy theo phòng còn trống.</li>
</ul>
<h3>Đặt phòng đảm bảo vs không đảm bảo</h3>
<ul>
<li><strong>Đặt phòng đảm bảo (guaranteed)</strong> — giữ bằng thẻ tín dụng, tiền đặt cọc hoặc tài khoản công ty; phòng được giữ suốt đêm dù khách đến muộn, nhưng thường áp dụng chính sách/phí hủy.</li>
<li><strong>Đặt phòng không đảm bảo</strong> — chỉ giữ đến một mốc giờ (vd 18h); sau đó phòng được thả ra để bán lại.</li>
</ul>
<h3>Overbooking</h3>
<p>Khách sạn thường <strong>nhận đặt phòng vượt số phòng thực tế (overbooking)</strong> một chút vì lịch sử cho thấy luôn có tỷ lệ khách không đến hoặc hủy muộn. Làm tốt thì tối ưu công suất phòng; làm dở thì tạo ra "khách bị đẩy đi" (walked guest) — khách có đặt phòng nhưng không còn phòng, phải được chuyển (thường khách sạn chịu chi phí) sang một khách sạn tương đương gần đó.</p>`,
  ]]);

const c2q = quiz('lod222-quiz-2', 'Quiz 2 — Guest cycle & reservations|||Quiz 2 — Chu trình khách & đặt phòng', [
  { id: 'q1', question: 'Bốn giai đoạn của chu trình khách theo đúng thứ tự là?', options: ['Lưu trú → đến → rời đi → trước khi đến', 'Trước khi đến → đến → lưu trú → rời đi', 'Đến → trước khi đến → rời đi → lưu trú', 'Rời đi → lưu trú → đến → trước khi đến'], correctIndex: 1, explanation: 'Guest cycle: pre-arrival → arrival → occupancy → departure.' },
  { id: 'q2', question: 'Đặt phòng "đảm bảo" (guaranteed) khác đặt phòng "không đảm bảo" ở điểm nào?', options: ['Được giữ suốt đêm nhờ có bảo đảm (thẻ tín dụng/cọc), dù khách đến muộn', 'Luôn rẻ hơn', 'Không cần xác nhận', 'Chỉ áp dụng cho khách đoàn'], correctIndex: 0, explanation: 'Đặt phòng đảm bảo được giữ dù khách đến muộn, nhưng thường có chính sách hủy.' },
  { id: 'q3', question: 'Overbooking là gì và rủi ro chính của nó?', options: ['Bán ít phòng hơn thực tế để an toàn', 'Nhận đặt phòng nhiều hơn số phòng thực có, rủi ro tạo ra khách bị đẩy đi (walked guest)', 'Chỉ dành cho khách công ty', 'Luôn bị pháp luật cấm'], correctIndex: 1, explanation: 'Overbooking tối ưu công suất nhưng có thể khiến khách có đặt phòng mà không còn phòng.' },
]);

const c3 = doc('lod222-3-1-checkin-welcoming', '3.1 — Check-in procedure & welcoming guests|||3.1 — Quy trình nhận phòng & đón tiếp',
  'Chuẩn bị trước khi khách đến (pre-registration); tiêu chuẩn chào khách (VTOS); quy trình check-in từng bước; xử lý walk-in & khách VIP.',
  [[
    `<span class="eyebrow">LOD222 · Chapter 3 · Lesson 3.1</span>
<h2>Check-in procedure &amp; welcoming guests</h2>
<h3>Before the guest arrives — pre-registration</h3>
<p>For known arrivals (reservations), the front desk prepares in advance: verify room availability, pre-assign a room, print the registration card, flag special requests (early check-in, high floor, allergy note) so the desk agent isn't discovering them live in front of the guest.</p>
<h3>VTOS greeting standard</h3>
<ul>
<li>Stand, make eye contact, and <strong>smile</strong> within a few seconds of the guest approaching.</li>
<li>Greet by name once known ("Good afternoon, Mr./Ms. ___, welcome to [Hotel]").</li>
<li>Use open, welcoming body language — never keep a guest waiting without acknowledgement.</li>
</ul>
<h3>Step-by-step check-in</h3>
<pre><code>1. Greet the guest, ask for reservation name or booking reference
2. Verify identity (ID/passport) — required by law in most countries
3. Confirm room type, rate, and length of stay with the guest
4. Complete/verify the registration card; obtain guest signature
5. Take a payment method / credit card imprint for incidentals
6. Assign the room; issue the key/keycard
7. Explain key facilities (breakfast hours, Wi-Fi, checkout time)
8. Offer luggage assistance / escort to the room
</code></pre>
<h3>Walk-ins &amp; VIP guests</h3>
<p>A <strong>walk-in</strong> is checked in the same way, but availability and rate must be confirmed first (no existing reservation to fall back on). <strong>VIP guests</strong> (loyalty tier, repeat guest, referred by management) often get expedited, private check-in — e.g. in the lounge instead of the busy lobby desk — and a welcome amenity.</p>
<div class="callout"><span class="badge">Why ID verification matters</span> Beyond hotel policy, many countries legally require hotels to record every guest's identity for security and immigration reporting.</div>`,
    `<span class="eyebrow">LOD222 · Chương 3 · Bài 3.1</span>
<h2>Quy trình nhận phòng &amp; đón tiếp khách</h2>
<h3>Trước khi khách đến — chuẩn bị (pre-registration)</h3>
<p>Với khách đã đặt phòng trước, lễ tân chuẩn bị sẵn: kiểm tra phòng còn trống, xếp phòng trước, in sẵn thẻ đăng ký, đánh dấu yêu cầu đặc biệt (nhận phòng sớm, tầng cao, ghi chú dị ứng) để nhân viên không phải phát hiện những điều này ngay trước mặt khách.</p>
<h3>Tiêu chuẩn chào khách theo VTOS</h3>
<ul>
<li>Đứng dậy, giao tiếp bằng mắt, và <strong>mỉm cười</strong> trong vài giây khi khách tiến đến.</li>
<li>Chào bằng tên khi đã biết ("Chào anh/chị ___, chào mừng đến với [Khách sạn]").</li>
<li>Ngôn ngữ cơ thể cởi mở, chào đón — không bao giờ để khách chờ mà không có lời chào nào.</li>
</ul>
<h3>Quy trình check-in từng bước</h3>
<pre><code>1. Chào khách, hỏi tên đặt phòng hoặc mã đặt phòng
2. Kiểm tra giấy tờ tùy thân (CMND/CCCD/passport) — luật pháp hầu hết
   quốc gia yêu cầu
3. Xác nhận lại loại phòng, giá, số ngày lưu trú với khách
4. Hoàn tất/kiểm tra thẻ đăng ký; lấy chữ ký của khách
5. Lấy phương thức thanh toán / cà thẻ tín dụng cho các chi phí phát sinh
6. Xếp phòng; giao chìa khóa/thẻ phòng
7. Giới thiệu tiện ích chính (giờ ăn sáng, Wi-Fi, giờ trả phòng)
8. Mời hỗ trợ hành lý / hộ tống khách lên phòng
</code></pre>
<h3>Khách vãng lai (walk-in) & khách VIP</h3>
<p><strong>Khách vãng lai</strong> được check-in theo cùng quy trình, nhưng phải xác nhận phòng trống và giá trước (không có đặt phòng sẵn để đối chiếu). <strong>Khách VIP</strong> (hạng thành viên, khách quen, do quản lý giới thiệu) thường được check-in nhanh, riêng tư — vd tại phòng chờ thay vì sảnh đông — và có quà chào mừng.</p>
<div class="callout"><span class="badge">Vì sao phải kiểm tra giấy tờ</span> Ngoài quy định khách sạn, nhiều quốc gia yêu cầu theo luật khách sạn phải lưu lại danh tính mọi khách vì lý do an ninh và khai báo xuất nhập cảnh.</div>`,
  ]]);

const c3q = quiz('lod222-quiz-3', 'Quiz 3 — Check-in procedure|||Quiz 3 — Quy trình nhận phòng', [
  { id: 'q1', question: 'Chuẩn bị "pre-registration" trước khi khách đến gồm việc gì?', options: ['Chỉ dọn phòng', 'Xếp phòng trước, in thẻ đăng ký, đánh dấu yêu cầu đặc biệt', 'Hủy đặt phòng nếu khách chưa xác nhận', 'Không cần chuẩn bị gì'], correctIndex: 1, explanation: 'Pre-registration giúp lễ tân sẵn sàng, tránh phát hiện vấn đề trước mặt khách.' },
  { id: 'q2', question: 'Vì sao phải kiểm tra giấy tờ tùy thân khi check-in?', options: ['Chỉ để trang trí hồ sơ', 'Luật pháp nhiều quốc gia yêu cầu lưu danh tính khách vì an ninh/xuất nhập cảnh', 'Không bắt buộc, chỉ là thói quen', 'Chỉ áp dụng cho khách đoàn'], correctIndex: 1, explanation: 'Xác minh danh tính là yêu cầu pháp lý ở hầu hết quốc gia, không chỉ là quy định nội bộ.' },
  { id: 'q3', question: 'Khách "walk-in" khác khách đã đặt phòng trước ở điểm nào trong quy trình check-in?', options: ['Không cần xác nhận giấy tờ', 'Phải xác nhận phòng còn trống và giá trước vì không có đặt phòng sẵn', 'Luôn được nâng cấp phòng miễn phí', 'Không cần thẻ đăng ký'], correctIndex: 1, explanation: 'Walk-in cần kiểm tra availability và giá tại thời điểm đến, vì không có booking để đối chiếu.' },
]);

const c4 = doc('lod222-4-1-inhouse-service-requests', '4.1 — In-house services & handling guest requests|||4.1 — Dịch vụ lưu trú & xử lý yêu cầu khách',
  'Dịch vụ trong lưu trú (báo thức, message, hành lý); mã trạng thái phòng buồng phòng (VD/VC/OD/OC); ghi nhận & theo dõi yêu cầu; đồ thất lạc.',
  [[
    `<span class="eyebrow">LOD222 · Chapter 4 · Lesson 4.1</span>
<h2>In-house services &amp; handling guest requests</h2>
<h3>Common in-house services</h3>
<ul>
<li><strong>Wake-up calls</strong> — logged with exact time, confirmed back to the guest, and tracked so none are missed.</li>
<li><strong>Message handling</strong> — for guests without a mobile signal or when someone calls for them; written and delivered promptly, never verbally relayed through a third party without the guest's consent.</li>
<li><strong>Luggage &amp; errands</strong> — bell desk assistance during the stay, not just at arrival/departure.</li>
<li><strong>Room service coordination</strong> — front desk often relays special timing/dietary requests to F&amp;B.</li>
</ul>
<h3>Room status codes (housekeeping ↔ front desk)</h3>
<pre><code>VC  Vacant Clean       - ready to sell
VD  Vacant Dirty       - empty, needs cleaning before resale
OC  Occupied Clean     - guest in house, room serviced
OD  Occupied Dirty     - guest in house, needs servicing
OOO Out of Order       - not sellable (maintenance issue)
</code></pre>
<p>Front desk and housekeeping must keep these statuses in sync in the PMS in real time — selling a room that is actually <code>OD</code> or <code>OOO</code> is one of the most common and most damaging front-office errors.</p>
<h3>Logging &amp; tracking guest requests</h3>
<p>Every non-trivial request (extra pillow, late checkout, room change, maintenance issue) should be logged with guest name, room number, time, and who is responsible — so it can be followed up on and nothing is forgotten across shift changes.</p>
<h3>Lost and found</h3>
<p>Items left behind are logged with a description, date, and location found, stored securely, and the guest is contacted if identifiable — with a clear, documented process for returning items (usually by courier at the guest's cost, or held for pickup).</p>`,
    `<span class="eyebrow">LOD222 · Chương 4 · Bài 4.1</span>
<h2>Dịch vụ trong thời gian lưu trú &amp; xử lý yêu cầu khách</h2>
<h3>Các dịch vụ phổ biến trong lưu trú</h3>
<ul>
<li><strong>Báo thức (wake-up call)</strong> — ghi lại giờ chính xác, xác nhận lại với khách, và theo dõi để không bỏ sót cuộc nào.</li>
<li><strong>Xử lý lời nhắn (message)</strong> — cho khách không có sóng điện thoại hoặc khi có người gọi tìm; ghi lại và chuyển kịp thời, không truyền miệng qua bên thứ ba nếu khách không đồng ý.</li>
<li><strong>Hành lý &amp; việc lặt vặt</strong> — hỗ trợ của bell desk trong suốt thời gian lưu trú, không chỉ lúc đến/đi.</li>
<li><strong>Phối hợp room service</strong> — lễ tân thường chuyển yêu cầu đặc biệt về giờ giấc/chế độ ăn cho F&amp;B.</li>
</ul>
<h3>Mã trạng thái phòng (buồng phòng ↔ lễ tân)</h3>
<pre><code>VC  Vacant Clean       - phòng trống, sạch, sẵn sàng bán
VD  Vacant Dirty       - phòng trống, chưa dọn, cần dọn trước khi bán
OC  Occupied Clean     - có khách, phòng đã được dọn
OD  Occupied Dirty     - có khách, cần dọn
OOO Out of Order       - không thể bán (đang sửa chữa/lỗi)
</code></pre>
<p>Lễ tân và buồng phòng phải đồng bộ các trạng thái này trên PMS theo thời gian thực — bán một phòng thực chất đang <code>OD</code> hoặc <code>OOO</code> là một trong những lỗi lễ tân phổ biến và gây thiệt hại nhất.</p>
<h3>Ghi nhận &amp; theo dõi yêu cầu khách</h3>
<p>Mọi yêu cầu không đơn giản (thêm gối, trả phòng muộn, đổi phòng, sự cố kỹ thuật) cần được ghi lại kèm tên khách, số phòng, thời gian, và người chịu trách nhiệm — để theo dõi tiếp và không bị quên qua các ca trực.</p>
<h3>Đồ thất lạc (lost and found)</h3>
<p>Vật dụng khách để lại được ghi nhận kèm mô tả, ngày, vị trí tìm thấy, lưu giữ an toàn, và liên hệ khách nếu xác định được — với quy trình rõ ràng, có ghi chép để hoàn trả (thường gửi chuyển phát khách chịu phí, hoặc giữ để khách đến lấy).</p>`,
  ]]);

const c4q = quiz('lod222-quiz-4', 'Quiz 4 — In-house requests|||Quiz 4 — Dịch vụ lưu trú', [
  { id: 'q1', question: 'Mã trạng thái phòng "OD" (Occupied Dirty) nghĩa là gì?', options: ['Phòng trống, sạch, sẵn sàng bán', 'Có khách, phòng cần được dọn', 'Phòng đang sửa chữa, không bán được', 'Có khách, phòng đã dọn sạch'], correctIndex: 1, explanation: 'OD = Occupied Dirty: có khách ở, phòng cần dọn.' },
  { id: 'q2', question: 'Vì sao đồng bộ trạng thái phòng giữa buồng phòng và lễ tân trên PMS quan trọng?', options: ['Chỉ để báo cáo cuối tháng', 'Tránh bán nhầm phòng đang OD/OOO cho khách mới', 'Không quan trọng nếu khách sạn ít phòng', 'Chỉ cần cập nhật một lần mỗi ngày'], correctIndex: 1, explanation: 'Bán nhầm phòng chưa dọn hoặc đang sửa chữa là lỗi nghiêm trọng, gây trải nghiệm xấu.' },
  { id: 'q3', question: 'Một yêu cầu của khách (vd đổi phòng) nên được xử lý thế nào để không bị quên qua ca trực?', options: ['Nhớ trong đầu, không cần ghi', 'Ghi lại kèm tên khách, số phòng, thời gian, người chịu trách nhiệm', 'Chỉ báo miệng cho ca sau nếu gặp mặt', 'Bỏ qua nếu không quan trọng'], correctIndex: 1, explanation: 'Ghi log đầy đủ giúp theo dõi và bàn giao chính xác giữa các ca.' },
]);

const c5 = doc('lod222-5-1-checkout-billing', '5.1 — Check-out procedure & billing|||5.1 — Quy trình trả phòng & thanh toán',
  'Quy trình check-out từng bước; kiểm tra folio & chi phí phát sinh; phương thức thanh toán; khách đoàn & express check-out; khảo sát/feedback.',
  [[
    `<span class="eyebrow">LOD222 · Chapter 5 · Lesson 5.1</span>
<h2>Check-out procedure &amp; billing</h2>
<h3>Step-by-step check-out</h3>
<pre><code>1. Confirm room number and ask about the stay
2. Review the folio (room charge, taxes, minibar, laundry, room service...)
3. Ask if there are any last-minute charges not yet posted
4. Present the final bill; confirm the payment method
5. Process payment and issue a receipt / final invoice
6. Collect the room key/keycard
7. Ask about luggage assistance and transport (taxi/airport transfer)
8. Thank the guest, invite them back, note any feedback
</code></pre>
<h3>The folio and settling incidentals</h3>
<p>The <strong>folio</strong> is the running record of every charge posted to a guest's room during their stay. Before check-out, the agent must verify minibar consumption, laundry, spa or room-service charges are all posted — settling a bill with charges still missing is a common and costly front-office mistake, usually only caught after the guest has already left.</p>
<h3>Payment methods &amp; late charges</h3>
<p>Cash, credit/debit card, bank transfer (for corporate accounts), or a pre-authorized card hold taken at check-in. If a guest stays past the checkout time without prior arrangement, a <strong>late checkout fee</strong> (often half-day or full-day rate) may apply — this should be explained politely, not sprung on the guest as a surprise.</p>
<h3>Group departures &amp; express check-out</h3>
<p>Group departures are settled against a master bill (usually company/agency pays) with only personal incidentals billed to individuals. Many hotels offer <strong>express check-out</strong> — the bill is settled automatically on the card on file and slipped under the door or emailed, so the guest can leave without queuing at the desk.</p>
<h3>Guest feedback</h3>
<p>Check-out is also the natural moment to invite feedback — a short verbal question ("How was your stay?") plus a comment card or review-link reminder, without pressuring the guest.</p>`,
    `<span class="eyebrow">LOD222 · Chương 5 · Bài 5.1</span>
<h2>Quy trình trả phòng &amp; thanh toán</h2>
<h3>Quy trình check-out từng bước</h3>
<pre><code>1. Xác nhận số phòng và hỏi thăm về kỳ nghỉ
2. Kiểm tra folio (tiền phòng, thuế, minibar, giặt ủi, room service...)
3. Hỏi khách có chi phí phút cuối nào chưa được ghi nhận không
4. Đưa hóa đơn cuối; xác nhận phương thức thanh toán
5. Xử lý thanh toán và xuất biên nhận / hóa đơn cuối cùng
6. Thu lại chìa khóa/thẻ phòng
7. Hỏi về hỗ trợ hành lý và phương tiện (taxi/xe đưa sân bay)
8. Cảm ơn khách, mời quay lại, ghi nhận phản hồi (nếu có)
</code></pre>
<h3>Folio và thanh toán các khoản phát sinh</h3>
<p><strong>Folio</strong> là bảng ghi liên tục mọi chi phí phát sinh vào phòng khách trong suốt thời gian lưu trú. Trước khi check-out, nhân viên phải xác nhận đã ghi nhận đủ chi phí minibar, giặt ủi, spa hoặc room-service — thanh toán khi còn thiếu chi phí là lỗi lễ tân phổ biến và tốn kém, thường chỉ phát hiện ra sau khi khách đã đi.</p>
<h3>Phương thức thanh toán & phí phát sinh</h3>
<p>Tiền mặt, thẻ tín dụng/ghi nợ, chuyển khoản (cho tài khoản công ty), hoặc giữ thẻ (pre-authorization) đã lấy lúc check-in. Nếu khách ở lại quá giờ trả phòng mà không thỏa thuận trước, có thể áp <strong>phí trả phòng muộn</strong> (thường bằng nửa ngày hoặc cả ngày giá phòng) — cần giải thích lịch sự, không nên thông báo bất ngờ với khách.</p>
<h3>Đoàn khách & express check-out</h3>
<p>Đoàn khách thanh toán theo hóa đơn tổng (master bill, thường công ty/đại lý trả), chỉ chi phí cá nhân mới tính riêng cho từng khách. Nhiều khách sạn có <strong>express check-out</strong> — hóa đơn tự động trừ vào thẻ đã lưu và gửi qua khe cửa hoặc email, để khách rời đi không cần xếp hàng ở lễ tân.</p>
<h3>Phản hồi của khách</h3>
<p>Check-out cũng là lúc tự nhiên để mời phản hồi — một câu hỏi ngắn ("Kỳ nghỉ của anh/chị thế nào?") kèm phiếu góp ý hoặc gợi ý đánh giá online, không gây áp lực cho khách.</p>`,
  ]]);

const c5q = quiz('lod222-quiz-5', 'Quiz 5 — Check-out & billing|||Quiz 5 — Trả phòng & thanh toán', [
  { id: 'q1', question: '"Folio" trong quy trình check-out là gì?', options: ['Thẻ chìa khóa phòng', 'Bảng ghi liên tục mọi chi phí phát sinh vào phòng khách', 'Phiếu khảo sát khách hàng', 'Danh sách phòng trống'], correctIndex: 1, explanation: 'Folio ghi lại toàn bộ chi phí (phòng, minibar, giặt ủi...) trong suốt lưu trú.' },
  { id: 'q2', question: 'Sai sót phổ biến nào khi check-out gây thiệt hại cho khách sạn?', options: ['Chào khách quá nhiệt tình', 'Thanh toán khi còn thiếu một số chi phí (vd minibar) chưa ghi nhận', 'Hỏi khách về hành lý', 'Mời khách phản hồi'], correctIndex: 1, explanation: 'Bỏ sót chi phí trước khi chốt bill khiến khách sạn mất doanh thu, thường phát hiện ra sau khi khách đã đi.' },
  { id: 'q3', question: 'Đoàn khách thanh toán bill theo cách nào là phổ biến?', options: ['Từng khách tự trả toàn bộ chi phí, kể cả tiền phòng', 'Thanh toán theo hóa đơn tổng (master bill), chỉ chi phí cá nhân tính riêng', 'Không cần thanh toán vì đã đặt online', 'Luôn trả bằng tiền mặt'], correctIndex: 1, explanation: 'Master bill do công ty/đại lý chi trả phần chung; chi phí cá nhân tính riêng cho từng khách.' },
]);

const c6 = doc('lod222-6-1-communication-complaints', '6.1 — Communication skills, complaint handling & difficult situations|||6.1 — Giao tiếp, xử lý phàn nàn & tình huống khó',
  'Giao tiếp qua điện thoại & phi ngôn ngữ; mô hình xử lý phàn nàn LEARN; xử lý khách khó tính & khác biệt văn hóa.',
  [[
    `<span class="eyebrow">LOD222 · Chapter 6 · Lesson 6.1</span>
<h2>Communication skills, complaint handling &amp; difficult situations</h2>
<h3>Telephone etiquette</h3>
<ul>
<li>Answer within 2-3 rings, identify the hotel/department and yourself.</li>
<li>Smile while speaking — tone carries through the phone even without a face.</li>
<li>Confirm details back to the caller (name spelling, dates, room number) to avoid mistakes.</li>
</ul>
<h3>Non-verbal communication</h3>
<p>Posture, eye contact, and facial expression communicate as much as words — a guest reads confidence or disinterest before a single sentence is finished. Cultural sensitivity matters too: eye-contact norms, personal space, and directness in complaints vary widely across nationalities.</p>
<h3>The LEARN model for complaint handling</h3>
<pre><code>L - Listen      : let the guest finish, do not interrupt or get defensive
E - Empathize   : acknowledge how they feel ("I understand this is frustrating")
A - Apologize   : a sincere apology, even if the fault isn't the receptionist's
R - Resolve     : offer a concrete fix within your authority, or escalate fast
N - Notify      : log the incident and inform the relevant department/manager
</code></pre>
<p>The goal is <strong>service recovery</strong>: a well-handled complaint can leave a guest more loyal than if nothing had gone wrong — a badly handled one escalates into a public review.</p>
<h3>Difficult situations</h3>
<p>An angry guest, an overbooking situation, a language barrier, or a guest raising their voice in a busy lobby — in every case, stay calm, lower your own voice, move the conversation to a quieter/private area if possible, and know exactly when to involve a duty manager rather than trying to resolve everything alone.</p>`,
    `<span class="eyebrow">LOD222 · Chương 6 · Bài 6.1</span>
<h2>Kỹ năng giao tiếp, xử lý phàn nàn &amp; tình huống khó</h2>
<h3>Giao tiếp qua điện thoại</h3>
<ul>
<li>Trả lời trong 2-3 tiếng chuông, xưng tên khách sạn/bộ phận và tên mình.</li>
<li>Mỉm cười khi nói — âm điệu truyền qua điện thoại dù không thấy mặt.</li>
<li>Xác nhận lại thông tin với người gọi (đánh vần tên, ngày, số phòng) để tránh nhầm lẫn.</li>
</ul>
<h3>Giao tiếp phi ngôn ngữ</h3>
<p>Dáng đứng, giao tiếp bằng mắt, và nét mặt truyền tải nhiều như lời nói — khách nhận ra sự tự tin hay thiếu quan tâm trước khi câu nói kết thúc. Khác biệt văn hóa cũng quan trọng: chuẩn mực giao tiếp bằng mắt, khoảng cách cá nhân, và mức độ trực tiếp khi phàn nàn khác nhau nhiều giữa các quốc tịch.</p>
<h3>Mô hình LEARN xử lý phàn nàn</h3>
<pre><code>L - Listen (Lắng nghe)     : để khách nói hết, không cắt lời hay phản bác
E - Empathize (Đồng cảm)  : thừa nhận cảm xúc của khách ("Tôi hiểu điều này khiến anh/chị khó chịu")
A - Apologize (Xin lỗi)   : lời xin lỗi thành tâm, dù lỗi không phải của lễ tân
R - Resolve (Giải quyết)  : đưa ra hướng xử lý cụ thể trong quyền hạn, hoặc báo cấp trên ngay
N - Notify (Thông báo)    : ghi nhận sự việc và báo bộ phận/quản lý liên quan
</code></pre>
<p>Mục tiêu là <strong>service recovery</strong> (khôi phục dịch vụ): một phàn nàn được xử lý tốt có thể khiến khách trung thành hơn cả khi không có sự cố — một phàn nàn xử lý dở dẫn đến đánh giá xấu công khai.</p>
<h3>Tình huống khó</h3>
<p>Khách nổi giận, tình huống overbooking, rào cản ngôn ngữ, hoặc khách lớn tiếng ở sảnh đông — trong mọi trường hợp, giữ bình tĩnh, hạ giọng của chính mình, chuyển câu chuyện đến nơi yên tĩnh/riêng tư nếu có thể, và biết rõ khi nào cần gọi quản lý ca trực thay vì tự cố giải quyết một mình.</p>`,
  ]]);

const c6q = quiz('lod222-quiz-6', 'Quiz 6 — Complaint handling|||Quiz 6 — Xử lý phàn nàn', [
  { id: 'q1', question: 'Trong mô hình LEARN, chữ "E" (Empathize) nghĩa là gì?', options: ['Kết thúc cuộc gọi nhanh', 'Thừa nhận và đồng cảm với cảm xúc của khách', 'Đề nghị khách rời khỏi khách sạn', 'Ghi nhận sự việc vào hệ thống'], correctIndex: 1, explanation: 'Empathize là thể hiện sự đồng cảm với cảm xúc của khách trước khi đi vào giải quyết.' },
  { id: 'q2', question: 'Vì sao lễ tân nên xin lỗi khách dù lỗi không phải do mình gây ra?', options: ['Vì lễ tân luôn phải nhận lỗi thay công ty', 'Lời xin lỗi thành tâm giúp xoa dịu và mở đường cho service recovery', 'Không cần thiết, chỉ cần giải quyết', 'Chỉ áp dụng với khách VIP'], correctIndex: 1, explanation: 'Xin lỗi là bước xây dựng lại cảm xúc tích cực, không đồng nghĩa nhận lỗi cá nhân.' },
  { id: 'q3', question: 'Khi gặp khách nổi giận ở sảnh đông, hành động phù hợp nhất là?', options: ['Lớn tiếng lại để khách dừng', 'Giữ bình tĩnh, hạ giọng, chuyển đến nơi riêng tư nếu có thể, và biết khi nào báo quản lý', 'Bỏ đi để khách tự nguôi', 'Tranh luận để chứng minh khách sạn đúng'], correctIndex: 1, explanation: 'Giữ bình tĩnh và chuyển tình huống ra khỏi không gian công khai là kỹ năng xử lý khủng hoảng cơ bản.' },
]);

const c7 = doc('lod222-7-1-pms-guest-information', '7.1 — PMS & guest information management|||7.1 — PMS & quản lý thông tin khách',
  'Các module cốt lõi của PMS (đặt phòng, lễ tân, buồng phòng, thu ngân, báo cáo); hồ sơ khách & tính chính xác dữ liệu; kiểm toán đêm (night audit).',
  [[
    `<span class="eyebrow">LOD222 · Chapter 7 · Lesson 7.1</span>
<h2>PMS &amp; guest information management</h2>
<h3>What a PMS does</h3>
<p>A <strong>Property Management System (PMS)</strong> — e.g. Oracle Opera, Smile, eZee — is the software that ties the whole front office together. Its core modules:</p>
<ul>
<li><strong>Reservations</strong> — availability, rates, booking sources (OTA channel connections).</li>
<li><strong>Front desk</strong> — check-in/out, room assignment, folio management.</li>
<li><strong>Housekeeping</strong> — room status updates (VC/VD/OC/OD), task assignment.</li>
<li><strong>Cashiering</strong> — payments, currency exchange, city ledger (unpaid corporate accounts).</li>
<li><strong>Reporting</strong> — occupancy, revenue (ADR, RevPAR), arrivals/departures forecast.</li>
</ul>
<h3>Guest profiles &amp; data accuracy</h3>
<p>The PMS builds a <strong>guest profile</strong> over multiple stays — preferences, past complaints, special requests, billing history. Accurate, up-to-date data lets a hotel personalize service (remembering a returning guest's room preference) — but it also carries responsibility: guest data must be handled with the same privacy discipline as any personal information, shared only on a need-to-know basis internally, never with unauthorized third parties.</p>
<h3>Night audit</h3>
<p>The <strong>night audit</strong> is a daily reconciliation run (usually overnight) that closes the business day in the PMS: verifies every room charge was posted, balances cash/card transactions, generates the next day's arrival/departure reports, and produces management reports (occupancy, revenue). It is the checkpoint that catches billing errors before they compound.</p>
<div class="callout"><span class="badge">Garbage in, garbage out</span> A PMS is only as reliable as the data entered at the desk — a wrong room status or an unposted charge doesn't just look bad, it propagates into every report built on top of it.</div>`,
    `<span class="eyebrow">LOD222 · Chương 7 · Bài 7.1</span>
<h2>PMS &amp; quản lý thông tin khách</h2>
<h3>PMS làm gì</h3>
<p><strong>Hệ thống quản lý tài sản (PMS)</strong> — vd Oracle Opera, Smile, eZee — là phần mềm kết nối toàn bộ bộ phận lễ tân. Các module cốt lõi:</p>
<ul>
<li><strong>Đặt phòng</strong> — tình trạng phòng trống, giá, nguồn đặt phòng (kết nối kênh OTA).</li>
<li><strong>Lễ tân</strong> — check-in/out, xếp phòng, quản lý folio.</li>
<li><strong>Buồng phòng</strong> — cập nhật trạng thái phòng (VC/VD/OC/OD), giao việc.</li>
<li><strong>Thu ngân</strong> — thanh toán, đổi ngoại tệ, city ledger (tài khoản công ty chưa thanh toán).</li>
<li><strong>Báo cáo</strong> — công suất phòng, doanh thu (ADR, RevPAR), dự báo đến/đi.</li>
</ul>
<h3>Hồ sơ khách & tính chính xác dữ liệu</h3>
<p>PMS xây <strong>hồ sơ khách</strong> qua nhiều lượt lưu trú — sở thích, phàn nàn cũ, yêu cầu đặc biệt, lịch sử thanh toán. Dữ liệu chính xác, cập nhật giúp khách sạn cá nhân hóa dịch vụ (nhớ sở thích phòng của khách quen) — nhưng cũng đi kèm trách nhiệm: dữ liệu khách phải được xử lý với nguyên tắc riêng tư như mọi thông tin cá nhân khác, chỉ chia sẻ nội bộ khi cần thiết, không bao giờ chia sẻ cho bên thứ ba không được phép.</p>
<h3>Kiểm toán đêm (night audit)</h3>
<p><strong>Kiểm toán đêm</strong> là quá trình đối soát hàng ngày (thường chạy vào ban đêm) để đóng ngày kinh doanh trên PMS: xác nhận mọi chi phí phòng đã được ghi nhận, cân đối giao dịch tiền mặt/thẻ, tạo báo cáo đến/đi cho ngày kế tiếp, và xuất báo cáo quản lý (công suất, doanh thu). Đây là chốt chặn phát hiện lỗi hóa đơn trước khi chúng tích lũy thành vấn đề lớn.</p>
<div class="callout"><span class="badge">Dữ liệu vào sai, báo cáo ra sai</span> PMS chỉ đáng tin bằng dữ liệu được nhập ở lễ tân — một trạng thái phòng sai hoặc một chi phí chưa ghi nhận không chỉ trông tệ, nó lan sang mọi báo cáo dựng trên đó.</div>`,
  ]]);

const c7q = quiz('lod222-quiz-7', 'Quiz 7 — PMS & guest information|||Quiz 7 — PMS & thông tin khách', [
  { id: 'q1', question: 'Module nào của PMS cập nhật trạng thái phòng VC/VD/OC/OD?', options: ['Đặt phòng', 'Buồng phòng (Housekeeping)', 'Thu ngân', 'Báo cáo'], correctIndex: 1, explanation: 'Module buồng phòng theo dõi và cập nhật trạng thái sạch/bẩn/có khách/trống.' },
  { id: 'q2', question: 'Kiểm toán đêm (night audit) có vai trò gì?', options: ['Chỉ để tính lương nhân viên', 'Đối soát và đóng ngày kinh doanh, xác nhận mọi chi phí đã ghi nhận đúng', 'Thay thế hoàn toàn công việc lễ tân ban ngày', 'Chỉ chạy khi khách sạn đầy phòng'], correctIndex: 1, explanation: 'Night audit là chốt chặn đối soát hàng ngày, phát hiện lỗi hóa đơn trước khi tích lũy.' },
  { id: 'q3', question: 'Dữ liệu hồ sơ khách trong PMS nên được xử lý theo nguyên tắc nào?', options: ['Chia sẻ tự do cho bất kỳ ai hỏi', 'Bảo mật, chỉ chia sẻ nội bộ khi cần thiết, không cho bên thứ ba không phép', 'Xóa ngay sau mỗi lượt lưu trú', 'Chỉ lưu tên khách, không lưu gì khác'], correctIndex: 1, explanation: 'Dữ liệu khách cần được bảo vệ như thông tin cá nhân khác, tuân nguyên tắc need-to-know.' },
]);

const c8 = doc('lod222-8-1-upselling-security-standards', '8.1 — Upselling, security & service standards|||8.1 — Bán hàng (upselling), an ninh & tiêu chuẩn dịch vụ',
  'Kỹ thuật upselling tại check-in; cross-selling F&B/spa; quản lý chìa khóa & riêng tư khách; quy trình khẩn cấp; tiêu chuẩn VTOS/ISO.',
  [[
    `<span class="eyebrow">LOD222 · Chapter 8 · Lesson 8.1</span>
<h2>Upselling, security &amp; service standards</h2>
<h3>Upselling at check-in</h3>
<p><strong>Upselling</strong> offers the guest a better version of what they already booked — a room upgrade, a higher floor, a late checkout package — framed around the guest's own stated purpose ("Since you mentioned it's your anniversary, would you like to see our suite with a view for a small upgrade?"), never as pressure. It is one of the front desk's few direct revenue levers.</p>
<h3>Cross-selling</h3>
<p><strong>Cross-selling</strong> promotes different revenue streams — spa, restaurant, tours — relevant to the guest's stay, again suggested naturally rather than pushed on every guest regardless of fit.</p>
<h3>Key control &amp; guest privacy</h3>
<ul>
<li><strong>Never confirm a guest's room number to a third party</strong> at the desk or by phone — a caller asking "which room is Mr. ___ in" is a classic social-engineering attempt; offer to take a message or connect the call instead.</li>
<li><strong>Key/keycard issuance</strong> is logged; lost keys trigger a re-key or lock recode for that room, not just a replacement card.</li>
<li>Master keys and access to guest floors are restricted and tracked — key control is a core VTOS security competency.</li>
</ul>
<h3>Emergency procedures</h3>
<p>Front desk staff must know the basics of fire evacuation (alarm response, guest communication, muster point), medical emergencies (who to call, first-aid location), and how to escalate a security incident — the front desk is often the first point of coordination during any hotel emergency because it is staffed 24/7 and holds the guest list.</p>
<h3>Service standards</h3>
<p>National (VTOS) and international (ISO-aligned) service standards define measurable expectations — greeting time, check-in duration, response time to requests — so quality is not just "be nice" but something a hotel can audit and improve.</p>`,
    `<span class="eyebrow">LOD222 · Chương 8 · Bài 8.1</span>
<h2>Bán hàng (upselling), an ninh &amp; tiêu chuẩn dịch vụ</h2>
<h3>Upselling khi check-in</h3>
<p><strong>Upselling</strong> là mời khách phiên bản tốt hơn của thứ họ đã đặt — nâng cấp phòng, tầng cao hơn, gói trả phòng muộn — gắn với mục đích khách đã chia sẻ ("Vì anh/chị nói đây là dịp kỷ niệm, anh/chị có muốn xem phòng suite view đẹp với phụ phí nhỏ không?"), không bao giờ tạo cảm giác ép buộc. Đây là một trong ít công cụ tạo doanh thu trực tiếp mà lễ tân có.</p>
<h3>Cross-selling</h3>
<p><strong>Cross-selling</strong> giới thiệu các nguồn doanh thu khác — spa, nhà hàng, tour — phù hợp với chuyến đi của khách, cũng nên gợi ý tự nhiên thay vì chào mời mọi khách bất kể có phù hợp hay không.</p>
<h3>Quản lý chìa khóa & riêng tư khách</h3>
<ul>
<li><strong>Không bao giờ xác nhận số phòng của khách cho bên thứ ba</strong> tại lễ tân hoặc qua điện thoại — người gọi hỏi "phòng của anh ___ là phòng nào" là dạng tấn công social-engineering kinh điển; nên đề nghị nhận lời nhắn hoặc chuyển máy thay vì trả lời trực tiếp.</li>
<li><strong>Cấp chìa khóa/thẻ phòng</strong> được ghi log; mất chìa khóa dẫn đến đổi mã khóa cho phòng đó, không chỉ cấp thẻ mới.</li>
<li>Chìa khóa tổng (master key) và quyền vào các tầng khách được hạn chế và theo dõi — quản lý chìa khóa là năng lực an ninh cốt lõi trong VTOS.</li>
</ul>
<h3>Quy trình khẩn cấp</h3>
<p>Nhân viên lễ tân cần biết cơ bản về sơ tán hỏa hoạn (phản ứng khi có chuông báo, thông báo khách, điểm tập trung), cấp cứu y tế (gọi ai, vị trí sơ cứu), và cách báo cáo sự cố an ninh — lễ tân thường là điểm phối hợp đầu tiên trong mọi tình huống khẩn cấp của khách sạn vì trực 24/7 và giữ danh sách khách.</p>
<h3>Tiêu chuẩn dịch vụ</h3>
<p>Tiêu chuẩn dịch vụ quốc gia (VTOS) và quốc tế (theo ISO) đặt ra kỳ vọng có thể đo được — thời gian chào khách, thời lượng check-in, thời gian phản hồi yêu cầu — nên chất lượng không chỉ là "phải tốt bụng" mà là thứ khách sạn có thể kiểm tra và cải thiện.</p>`,
  ]]);

const c8q = quiz('lod222-quiz-8', 'Quiz 8 — Upselling & security|||Quiz 8 — Bán hàng & an ninh', [
  { id: 'q1', question: 'Upselling hiệu quả tại check-in nên được thực hiện như thế nào?', options: ['Ép mọi khách nâng cấp phòng bất kể nhu cầu', 'Gợi ý tự nhiên, gắn với nhu cầu/mục đích khách đã chia sẻ, không gây áp lực', 'Chỉ áp dụng khi khách sạn vắng phòng', 'Không bao giờ đề cập giá khi upsell'], correctIndex: 1, explanation: 'Upselling tốt là gợi ý phù hợp với ngữ cảnh của khách, không phải ép buộc.' },
  { id: 'q2', question: 'Khi có người lạ gọi điện hỏi số phòng của một khách cụ thể, lễ tân nên làm gì?', options: ['Xác nhận ngay số phòng để giúp người gọi', 'Không xác nhận số phòng; đề nghị nhận lời nhắn hoặc chuyển máy', 'Hỏi người gọi có phải người thân không rồi trả lời', 'Chuyển máy thẳng vào phòng khách không hỏi gì'], correctIndex: 1, explanation: 'Không xác nhận số phòng cho bên thứ ba là nguyên tắc an ninh/riêng tư cơ bản.' },
  { id: 'q3', question: 'Vì sao lễ tân thường là điểm phối hợp đầu tiên trong tình huống khẩn cấp của khách sạn?', options: ['Vì lễ tân có quyền quyết định cao nhất', 'Vì lễ tân trực 24/7 và đang giữ danh sách khách hiện có trong khách sạn', 'Vì lễ tân được đào tạo y tế chuyên sâu', 'Vì quy định bắt buộc không liên quan thực tế'], correctIndex: 1, explanation: 'Lễ tân trực liên tục và có sẵn thông tin khách, nên là đầu mối phối hợp ban đầu.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'LOD222',
    slug: 'lod222-front-desk-and-receptionist-skills',
    title: 'Front desk and receptionist skills',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/LOD222.webp',
    shortDescription: 'Hotel front desk operations — front office role, guest cycle & reservations, check-in, in-stay requests, check-out & billing, complaint handling, PMS, upselling & security. Bilingual, with checklists, scripts & quizzes.|||Vận hành lễ tân khách sạn — vai trò bộ phận, chu trình khách & đặt phòng, nhận phòng, xử lý yêu cầu lưu trú, trả phòng & thanh toán, xử lý phàn nàn, PMS, upselling & an ninh. Song ngữ, có quy trình, hội thoại & quiz.',
    description: 'Môn <strong>LOD222 — Front Desk and Receptionist Skills</strong> (khối Quản trị Kinh doanh, kỳ 4) xây kỹ năng thực hành của một lễ tân khách sạn chuyên nghiệp. Từ <strong>tổng quan bộ phận lễ tân &amp; vai trò</strong> → <strong>chu trình khách &amp; đặt phòng</strong> → <strong>quy trình check-in</strong> → <strong>dịch vụ lưu trú &amp; xử lý yêu cầu</strong> → <strong>check-out &amp; thanh toán</strong> → <strong>giao tiếp &amp; xử lý phàn nàn</strong> → <strong>hệ thống PMS</strong> → <strong>upselling, an ninh &amp; tiêu chuẩn dịch vụ</strong>. Bám giáo trình Bardi, Kasavana và tiêu chuẩn nghề VTOS, song ngữ, có quy trình từng bước, mẫu hội thoại và quiz mỗi chương.',
    whatYouLearn: 'Cấu trúc & vai trò bộ phận lễ tân; 4 giai đoạn chu trình khách; các loại đặt phòng & overbooking; quy trình check-in & tiêu chuẩn chào khách; mã trạng thái phòng & xử lý yêu cầu khách; quy trình check-out, folio & thanh toán; mô hình LEARN xử lý phàn nàn; module PMS & night audit; kỹ thuật upselling/cross-selling; quản lý chìa khóa, riêng tư khách & quy trình khẩn cấp.',
    requirements: 'Không yêu cầu kiến thức nền chuyên ngành. Nên có kỹ năng giao tiếp cơ bản và tinh thần phục vụ khách hàng.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Bardi/Kasavana, tiêu chuẩn VTOS, tài liệu chính thức, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Lễ tân là mặt tiền khách sạn; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan lễ tân & vai trò|||Chapter 1 — Front office overview & role', description: 'Cấu trúc bộ phận, tố chất lễ tân.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chu trình khách & đặt phòng|||Chapter 2 — Guest cycle & reservations', description: '4 giai đoạn, loại đặt phòng, overbooking.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Quy trình check-in & đón tiếp|||Chapter 3 — Check-in procedure & welcoming', description: 'Pre-registration, chào khách, walk-in/VIP.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Dịch vụ lưu trú & xử lý yêu cầu|||Chapter 4 — In-house services & requests', description: 'Mã trạng thái phòng, log yêu cầu, lost & found.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Check-out & thanh toán|||Chapter 5 — Check-out & billing', description: 'Folio, phương thức thanh toán, express check-out.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Giao tiếp & xử lý phàn nàn|||Chapter 6 — Communication & complaint handling', description: 'Điện thoại, mô hình LEARN, tình huống khó.', lessons: [c6, c6q] },
    { title: 'Chương 7 — PMS & quản lý thông tin khách|||Chapter 7 — PMS & guest information', description: 'Module PMS, hồ sơ khách, night audit.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Upselling, an ninh & tiêu chuẩn dịch vụ|||Chapter 8 — Upselling, security & standards', description: 'Upsell/cross-sell, key control, khẩn cấp, VTOS.', lessons: [c8, c8q] },
  ],
};
