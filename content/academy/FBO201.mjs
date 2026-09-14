/**
 * FBO201 — Food and Beverage Service Operations. Giáo trình tham khảo (trích
 * dẫn, KHÔNG upload PDF): "Food and Beverage Service" (Lillicrap & Cousins);
 * "The Restaurant: From Concept to Operation" (Walker); "Modern Restaurant
 * Service". Khối Quản trị Kinh doanh (BBA), FPTU, Kỳ 4. 8 chương song ngữ.
 * Giữ NGUYÊN slug/semester/thumb(v3). KHÔNG backtick lồng / ${} / nháy đơn.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('fbo201-0-0-tai-lieu', 'Course materials|||Tài liệu tham khảo',
  'Giáo trình FLM, sách tham khảo, tài liệu chính thức, lộ trình tự học môn Vận hành dịch vụ Ẩm thực & Đồ uống.',
  [[
    `<span class="eyebrow">FBO201 · Course materials</span>
<h2>Reference hub</h2>
<p class="lead">Everything for studying <strong>Food and Beverage Service Operations</strong> — service types, facility &amp; food safety, table service, beverage knowledge, menu engineering, staffing &amp; cost control — in one place. The official FPTU syllabus and slides live on <strong>FLM</strong>; below are free, legitimate sources.</p>
<h3>Textbooks</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Food+and+Beverage+Service-p-9781510449372" target="_blank" rel="noopener">Food and Beverage Service — Lillicrap &amp; Cousins</a> — the classic UK hospitality text: settings, service sequence, beverages.</li>
<li><a href="https://www.wiley.com/en-us/The+Restaurant%3A+From+Concept+to+Operation-p-9781119702961" target="_blank" rel="noopener">The Restaurant: From Concept to Operation — Walker</a> — concept, menu, service, cost control.</li>
<li><em>Modern Restaurant Service</em> — contemporary front-of-house standards and technology.</li>
</ul>
<h3>Official / free materials</h3>
<ul>
<li><a href="https://www.ecolab.com/food-safety" target="_blank" rel="noopener">Ecolab — Food safety &amp; HACCP resources</a></li>
<li><a href="https://www.fda.gov/food/hazard-analysis-critical-control-point-haccp/haccp-principles-application-guidelines" target="_blank" rel="noopener">FDA — HACCP Principles &amp; Application Guidelines</a></li>
<li><a href="https://www.wsetglobal.com/" target="_blank" rel="noopener">WSET — wine &amp; spirit education (levels, tasting)</a></li>
</ul>
<h3>Tools</h3>
<ul>
<li>POS demo (Toast, Square for Restaurants) — order-to-payment flow.</li>
<li>Spreadsheet — menu engineering matrix &amp; food-cost calculations.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — service types, HACCP principles, service sequence, beverage basics.</li>
<li><strong>Practice</strong> — role-play a full service sequence; compute food cost % and menu-engineering quadrants for a sample menu.</li>
<li><strong>Go deeper</strong> — pairing logic, upselling &amp; guest recovery, RevPASH and F&amp;B trends.</li>
<li><strong>Job-ready</strong> — shadow a real restaurant shift; compare against the checklist in Chapter 4.</li>
</ol></div>`,
    `<span class="eyebrow">FBO201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Vận hành dịch vụ Ẩm thực &amp; Đồ uống</strong> — loại hình dịch vụ, cơ sở vật chất &amp; an toàn thực phẩm, phục vụ bàn, kiến thức đồ uống, menu engineering, nhân sự &amp; kiểm soát chi phí — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>Sách tham khảo</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Food+and+Beverage+Service-p-9781510449372" target="_blank" rel="noopener">Food and Beverage Service — Lillicrap &amp; Cousins</a> — sách kinh điển ngành khách sạn Anh: bố trí bàn, quy trình phục vụ, đồ uống.</li>
<li><a href="https://www.wiley.com/en-us/The+Restaurant%3A+From+Concept+to+Operation-p-9781119702961" target="_blank" rel="noopener">The Restaurant: From Concept to Operation — Walker</a> — ý tưởng nhà hàng, menu, phục vụ, kiểm soát chi phí.</li>
<li><em>Modern Restaurant Service</em> — chuẩn phục vụ tiền sảnh &amp; công nghệ hiện đại.</li>
</ul>
<h3>Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.ecolab.com/food-safety" target="_blank" rel="noopener">Ecolab — Tài liệu an toàn thực phẩm &amp; HACCP</a></li>
<li><a href="https://www.fda.gov/food/hazard-analysis-critical-control-point-haccp/haccp-principles-application-guidelines" target="_blank" rel="noopener">FDA — Nguyên tắc &amp; hướng dẫn áp dụng HACCP</a></li>
<li><a href="https://www.wsetglobal.com/" target="_blank" rel="noopener">WSET — giáo dục rượu vang &amp; đồ uống có cồn (các cấp độ, thử vị)</a></li>
</ul>
<h3>Công cụ</h3>
<ul>
<li>Bản demo POS (Toast, Square for Restaurants) — luồng gọi món đến thanh toán.</li>
<li>Bảng tính — ma trận menu engineering &amp; tính food cost.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — loại hình dịch vụ, nguyên tắc HACCP, quy trình phục vụ, kiến thức đồ uống cơ bản.</li>
<li><strong>Luyện tập</strong> — đóng vai một ca phục vụ đầy đủ; tính food cost % và xếp menu mẫu vào 4 nhóm menu engineering.</li>
<li><strong>Đào sâu</strong> — logic pairing, gợi ý bán thêm &amp; xử lý khiếu nại, RevPASH và xu hướng F&amp;B.</li>
<li><strong>Sẵn sàng đi làm</strong> — quan sát một ca làm thật tại nhà hàng; đối chiếu với checklist ở Chương 4.</li>
</ol></div>`,
  ]]);

const intro = doc('fbo201-0-1-overview', 'Course overview: Food and Beverage Service Operations|||Tổng quan: Vận hành dịch vụ Ẩm thực & Đồ uống',
  'F&B là gì, vì sao quan trọng trong ngành khách sạn/du lịch; lộ trình 8 chương từ tổng quan ngành đến kiểm soát chi phí & xu hướng.',
  [[
    `<span class="eyebrow">FBO201 · Lesson 0.1 · Overview</span>
<h2>Food &amp; Beverage Service Operations</h2>
<p class="lead">This course covers how a restaurant, hotel outlet or event actually <strong>runs the service</strong> — from the moment a guest is greeted to the moment they pay. F&amp;B is one of the largest revenue and employment segments of hospitality and tourism, and it is unusually visible: guests judge a whole brand on one meal.</p>
<h3>Why it matters</h3>
<ul>
<li><strong>Revenue</strong> — F&amp;B often rivals or exceeds rooms revenue in hotels, and is the entire business in standalone restaurants.</li>
<li><strong>Guest experience</strong> — service quality, timing and recovery from mistakes drive repeat visits and reviews more than the food alone.</li>
<li><strong>Operational complexity</strong> — perishable inventory, tight labor scheduling, and legal food-safety obligations make it harder to manage than most retail.</li>
</ul>
<h3>Roadmap</h3>
<p>Industry &amp; service types → facilities, equipment &amp; HACCP food safety → service styles (a la carte, buffet, banquet, room service) → the table-service sequence &amp; etiquette → beverage knowledge &amp; pairing → menu engineering &amp; pricing → staffing, reservations &amp; guest care → cost, revenue control &amp; trends. Bilingual, with worked checklists and quizzes.</p>`,
    `<span class="eyebrow">FBO201 · Bài 0.1 · Tổng quan</span>
<h2>Vận hành dịch vụ Ẩm thực &amp; Đồ uống</h2>
<p class="lead">Môn này học cách một nhà hàng, một outlet trong khách sạn hay một sự kiện <strong>thực sự vận hành dịch vụ</strong> — từ lúc chào khách đến lúc khách thanh toán. F&amp;B là một trong những mảng doanh thu và việc làm lớn nhất của du lịch - khách sạn, và cực kỳ dễ bị nhìn thấy: khách đánh giá cả thương hiệu qua một bữa ăn.</p>
<h3>Vì sao quan trọng</h3>
<ul>
<li><strong>Doanh thu</strong> — F&amp;B thường ngang hoặc vượt doanh thu buồng phòng trong khách sạn, và là toàn bộ mô hình kinh doanh ở nhà hàng độc lập.</li>
<li><strong>Trải nghiệm khách</strong> — chất lượng phục vụ, tốc độ và cách xử lý sai sót ảnh hưởng đến khách quay lại &amp; đánh giá nhiều hơn chính món ăn.</li>
<li><strong>Vận hành phức tạp</strong> — hàng tồn dễ hỏng, lịch nhân sự sát giờ, và ràng buộc pháp lý về an toàn thực phẩm khiến quản lý khó hơn hầu hết bán lẻ.</li>
</ul>
<h3>Lộ trình</h3>
<p>Ngành &amp; loại hình dịch vụ → cơ sở vật chất, thiết bị &amp; an toàn thực phẩm HACCP → kiểu phục vụ (à la carte, buffet, banquet, room service) → quy trình phục vụ bàn &amp; nghi thức → kiến thức đồ uống &amp; pairing → menu engineering &amp; định giá → nhân sự, đặt bàn &amp; chăm sóc khách → kiểm soát chi phí, doanh thu &amp; xu hướng. Song ngữ, có checklist mẫu và quiz.</p>`,
  ]]);

const c1 = doc('fbo201-1-1-industry-overview', '1.1 — The F&B industry & types of service|||1.1 — Ngành F&B & các loại hình dịch vụ',
  'Phân khúc thương mại/phi thương mại; các loại hình dịch vụ ăn uống: phục vụ bàn, tự chọn, quầy nhanh, vận chuyển/sự kiện.',
  [[
    `<span class="eyebrow">FBO201 · Chapter 1 · Lesson 1.1</span>
<h2>The F&amp;B industry &amp; types of service</h2>
<h3>Segments</h3>
<ul>
<li><strong>Commercial</strong> — restaurants, hotel outlets, bars, cafes; profit-driven, open to the public.</li>
<li><strong>Non-commercial (institutional)</strong> — hospitals, schools, corporate canteens, prisons; cost/budget-driven, often run by contract caterers.</li>
</ul>
<h3>Types of food service</h3>
<ul>
<li><strong>Table service</strong> — guest is seated, server takes the order and brings the food (a la carte, fine dining, casual dining).</li>
<li><strong>Self-service</strong> — buffet, cafeteria; guest selects and often carries their own food.</li>
<li><strong>Counter / quick service</strong> — order at a counter, minimal wait, high turnover (fast food, coffee shops).</li>
<li><strong>Transport / in-situ service</strong> — room service, airline catering, banquet &amp; event catering — food delivered to where the guest already is.</li>
</ul>
<pre><code>Type            Speed   Labor cost   Guest control   Typical venue
A la carte      Slow    High         High             Fine dining
Buffet          Fast    Medium       Medium           Hotel breakfast
Counter/QSR     Fast    Low          Low              Fast food
Room service    Slow    High         High             Hotel room
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> The type of service chosen fixes almost everything downstream — staffing ratio, equipment, menu design and pricing all follow from it. Getting this classification right is step one of any F&amp;B operating plan.</div>`,
    `<span class="eyebrow">FBO201 · Chương 1 · Bài 1.1</span>
<h2>Ngành F&amp;B &amp; các loại hình dịch vụ</h2>
<h3>Phân khúc</h3>
<ul>
<li><strong>Thương mại</strong> — nhà hàng, outlet khách sạn, bar, cafe; hướng tới lợi nhuận, mở cho công chúng.</li>
<li><strong>Phi thương mại (thể chế)</strong> — bệnh viện, trường học, canteen doanh nghiệp, trại giam; hướng tới ngân sách, thường do đơn vị catering hợp đồng vận hành.</li>
</ul>
<h3>Các loại hình dịch vụ ăn uống</h3>
<ul>
<li><strong>Phục vụ bàn</strong> — khách ngồi tại bàn, nhân viên nhận order và mang món (à la carte, fine dining, casual dining).</li>
<li><strong>Tự chọn</strong> — buffet, cafeteria; khách tự chọn và thường tự mang món.</li>
<li><strong>Quầy / phục vụ nhanh</strong> — gọi tại quầy, chờ tối thiểu, xoay vòng khách cao (fast food, quán cà phê).</li>
<li><strong>Vận chuyển / phục vụ tại chỗ</strong> — room service, catering hàng không, catering sự kiện/tiệc — món ăn được đưa tới nơi khách đang ở.</li>
</ul>
<pre><code>Loại hình        Tốc độ  Chi phí NS   Khách chủ động  Nơi thường gặp
À la carte       Chậm    Cao          Cao              Fine dining
Buffet           Nhanh   Trung bình   Trung bình       Khách sạn (sáng)
Quầy/QSR         Nhanh   Thấp         Thấp             Fast food
Room service     Chậm    Cao          Cao              Phòng khách sạn
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Loại hình dịch vụ được chọn quyết định gần như mọi thứ phía sau — tỉ lệ nhân sự, thiết bị, thiết kế menu và giá đều đi theo nó. Phân loại đúng là bước đầu của mọi kế hoạch vận hành F&amp;B.</div>`,
  ]]);
const c1q = quiz('fbo201-quiz-1', 'Quiz 1 — Ngành F&B & loại hình dịch vụ', [
  { id: 'q1', question: 'Canteen bệnh viện, trường học thuộc phân khúc nào của ngành F&B?', options: ['Thương mại', 'Phi thương mại (thể chế)', 'Bán lẻ', 'Xuất khẩu'], correctIndex: 1, explanation: 'Canteen bệnh viện/trường học hướng tới ngân sách, không vì lợi nhuận trực tiếp — thuộc phân khúc phi thương mại/thể chế.' },
  { id: 'q2', question: 'Loại hình dịch vụ nào có chi phí nhân sự thấp nhất và tốc độ phục vụ nhanh nhất?', options: ['À la carte', 'Room service', 'Quầy / phục vụ nhanh (QSR)', 'Banquet'], correctIndex: 2, explanation: 'Quầy/phục vụ nhanh (fast food) có ít nhân sự phục vụ trực tiếp và tốc độ xoay vòng khách cao nhất.' },
  { id: 'q3', question: 'Room service được xếp vào nhóm loại hình dịch vụ nào?', options: ['Tự chọn', 'Vận chuyển / phục vụ tại chỗ', 'Quầy nhanh', 'Phi thương mại'], correctIndex: 1, explanation: 'Room service mang món ăn tới nơi khách đang ở (phòng khách sạn) — thuộc nhóm vận chuyển/phục vụ tại chỗ.' },
]);

const c2 = doc('fbo201-2-1-facilities-haccp', '2.1 — Facilities, equipment & food safety (HACCP)|||2.1 — Cơ sở vật chất, thiết bị & an toàn thực phẩm (HACCP)',
  'Khu vực bếp/tiền sảnh, thiết bị chính; 7 nguyên tắc HACCP để kiểm soát an toàn thực phẩm.',
  [[
    `<span class="eyebrow">FBO201 · Chapter 2 · Lesson 2.1</span>
<h2>Facilities, equipment &amp; food safety (HACCP)</h2>
<h3>Key areas</h3>
<ul>
<li><strong>Back of house (BOH)</strong> — kitchen, storage, dishwashing; organized around the flow: receiving → storage → preparation → cooking → holding → service.</li>
<li><strong>Front of house (FOH)</strong> — dining room, bar, host stand, service stations; must support smooth traffic between kitchen and guest.</li>
<li><strong>Core equipment</strong> — refrigeration, cooking line, dishwashing, POS terminals; equipment choice locks in menu capability and throughput.</li>
</ul>
<h3>HACCP — 7 principles</h3>
<p><strong>HACCP (Hazard Analysis and Critical Control Points)</strong> is a preventive food-safety system, not an inspection-after-the-fact one.</p>
<pre><code>1. Conduct a hazard analysis           (biological/chemical/physical risks)
2. Identify Critical Control Points     (CCPs — steps where a hazard can be prevented)
3. Establish critical limits            (e.g. cook to 74C internal temp)
4. Establish monitoring procedures      (who checks, how, how often)
5. Establish corrective actions         (what to do when a limit is missed)
6. Establish verification procedures    (confirm the system works)
7. Establish record-keeping             (temperature logs, checklists)
</code></pre>
<div class="callout"><span class="badge">Danger zone</span> Bacteria multiply fastest between 5C and 60C — the "danger zone". Cold storage below 5C, cooking above 74C internal, and minimizing time in between are the three levers of food safety.</div>`,
    `<span class="eyebrow">FBO201 · Chương 2 · Bài 2.1</span>
<h2>Cơ sở vật chất, thiết bị &amp; an toàn thực phẩm (HACCP)</h2>
<h3>Các khu vực chính</h3>
<ul>
<li><strong>Khu vực sau (BOH)</strong> — bếp, kho, khu rửa; tổ chức theo luồng: nhận hàng → lưu kho → sơ chế → nấu → giữ nóng/lạnh → phục vụ.</li>
<li><strong>Khu vực trước (FOH)</strong> — phòng ăn, quầy bar, bàn lễ tân, trạm phục vụ; phải hỗ trợ luồng di chuyển trơn tru giữa bếp và khách.</li>
<li><strong>Thiết bị cốt lõi</strong> — tủ lạnh/mát, dây chuyền nấu, khu rửa, máy POS; chọn thiết bị quyết định khả năng menu và công suất phục vụ.</li>
</ul>
<h3>HACCP — 7 nguyên tắc</h3>
<p><strong>HACCP (Phân tích mối nguy và điểm kiểm soát tới hạn)</strong> là hệ thống an toàn thực phẩm mang tính phòng ngừa, không phải kiểm tra sau khi xảy ra.</p>
<pre><code>1. Phân tích mối nguy                  (rủi ro sinh học/hoá học/vật lý)
2. Xác định điểm kiểm soát tới hạn (CCP) (bước có thể ngăn mối nguy)
3. Đặt giới hạn tới hạn                 (vd: nấu tới 74C bên trong)
4. Đặt quy trình giám sát               (ai kiểm, cách nào, tần suất)
5. Đặt hành động khắc phục              (làm gì khi vượt giới hạn)
6. Đặt quy trình xác minh               (xác nhận hệ thống hoạt động)
7. Đặt quy trình lưu hồ sơ              (nhật ký nhiệt độ, checklist)
</code></pre>
<div class="callout"><span class="badge">Vùng nguy hiểm</span> Vi khuẩn sinh sôi nhanh nhất trong khoảng 5C-60C — "vùng nguy hiểm". Trữ lạnh dưới 5C, nấu chín trên 74C bên trong, và giảm thời gian ở khoảng giữa là ba đòn bẩy của an toàn thực phẩm.</div>`,
  ]]);
const c2q = quiz('fbo201-quiz-2', 'Quiz 2 — Cơ sở vật chất & HACCP', [
  { id: 'q1', question: 'HACCP là hệ thống an toàn thực phẩm mang tính chất gì?', options: ['Kiểm tra sau khi xảy ra sự cố', 'Phòng ngừa, kiểm soát trước khi xảy ra mối nguy', 'Chỉ áp dụng cho nhà hàng cao cấp', 'Thay thế hoàn toàn việc vệ sinh tay'], correctIndex: 1, explanation: 'HACCP là hệ thống PHÒNG NGỪA — xác định và kiểm soát mối nguy trước khi xảy ra, không chỉ kiểm tra sau đó.' },
  { id: 'q2', question: '"Vùng nguy hiểm" (danger zone) về nhiệt độ thực phẩm là khoảng nào?', options: ['0C - 5C', '5C - 60C', '60C - 100C', 'Trên 74C'], correctIndex: 1, explanation: 'Vi khuẩn sinh sôi nhanh nhất trong khoảng 5C-60C, gọi là vùng nguy hiểm; cần trữ lạnh dưới 5C hoặc giữ nóng trên 60C.' },
  { id: 'q3', question: 'Điểm kiểm soát tới hạn (CCP) trong HACCP là gì?', options: ['Nơi lưu hồ sơ giấy tờ', 'Bước trong quy trình mà tại đó có thể ngăn hoặc loại bỏ mối nguy', 'Khu vực tiền sảnh nhà hàng', 'Thiết bị đắt nhất trong bếp'], correctIndex: 1, explanation: 'CCP là bước cụ thể trong quy trình chế biến mà việc kiểm soát tại đó có thể ngăn ngừa, loại bỏ hoặc giảm mối nguy tới mức chấp nhận được.' },
]);

const c3 = doc('fbo201-3-1-service-styles', '3.1 — Service styles: a la carte, buffet, banquet, room service|||3.1 — Các kiểu phục vụ: à la carte, buffet, banquet, room service',
  'So sánh 4 kiểu phục vụ chính: đặc điểm, ưu/nhược, tình huống áp dụng.',
  [[
    `<span class="eyebrow">FBO201 · Chapter 3 · Lesson 3.1</span>
<h2>Service styles</h2>
<ul>
<li><strong>A la carte</strong> — guest orders individual dishes from a printed menu, each cooked to order; highest guest satisfaction and price, slowest and most labor-intensive.</li>
<li><strong>Buffet</strong> — food pre-set on a display, guest self-serves; fast throughput and predictable labor, but higher food waste risk and less individual attention.</li>
<li><strong>Banquet</strong> — a pre-set menu served to a large group at a fixed time (weddings, conferences); planned in advance, plated or family-style, high volume in a short window.</li>
<li><strong>Room service</strong> — order taken by phone/app, food delivered to a hotel room; premium pricing to offset low volume per trip and travel time.</li>
</ul>
<pre><code>Style        Menu choice   Speed to guest   Labor/cover   Typical use
A la carte   High          Slow             High          Fine/casual dining
Buffet       Medium        Fast             Low-Medium    Hotel breakfast, brunch
Banquet      Fixed         Batch, on time   Medium        Weddings, conferences
Room service Menu-limited  Slowest          Highest       Hotel guest rooms
</code></pre>
<div class="callout"><span class="badge">Choosing a style</span> The right style balances guest expectation, kitchen capacity and labor cost for the occasion — a wedding almost always needs banquet service, not a la carte, regardless of the venue's usual format.</div>`,
    `<span class="eyebrow">FBO201 · Chương 3 · Bài 3.1</span>
<h2>Các kiểu phục vụ</h2>
<ul>
<li><strong>À la carte</strong> — khách chọn từng món riêng theo menu in sẵn, mỗi món nấu theo order; mức hài lòng và giá cao nhất, nhưng chậm và tốn nhân sự nhất.</li>
<li><strong>Buffet</strong> — món được bày sẵn trên bàn trưng bày, khách tự lấy; xoay vòng nhanh, nhân sự dễ dự đoán, nhưng rủi ro lãng phí thực phẩm cao hơn và ít chăm sóc cá nhân.</li>
<li><strong>Banquet (tiệc)</strong> — menu cố định phục vụ nhóm lớn vào một giờ ấn định (cưới hỏi, hội nghị); lên kế hoạch trước, phục vụ theo đĩa hoặc kiểu gia đình, khối lượng lớn trong thời gian ngắn.</li>
<li><strong>Room service</strong> — nhận order qua điện thoại/app, giao món tới phòng khách sạn; giá cao hơn để bù cho số lượt ít và thời gian di chuyển.</li>
</ul>
<pre><code>Kiểu         Lựa chọn menu  Tốc độ tới khách  NS/khách  Trường hợp dùng
À la carte   Cao            Chậm              Cao       Fine/casual dining
Buffet       Trung bình     Nhanh             Thấp-TB   Sáng khách sạn, brunch
Banquet      Cố định        Theo lô, đúng giờ TB        Cưới hỏi, hội nghị
Room service Menu hạn chế   Chậm nhất         Cao nhất  Phòng khách khách sạn
</code></pre>
<div class="callout"><span class="badge">Chọn kiểu phục vụ</span> Kiểu phục vụ phù hợp cân bằng kỳ vọng khách, năng lực bếp và chi phí nhân sự theo sự kiện — một tiệc cưới hầu như luôn cần banquet, không phải à la carte, dù nơi tổ chức thường phục vụ kiểu khác.</div>`,
  ]]);
const c3q = quiz('fbo201-quiz-3', 'Quiz 3 — Các kiểu phục vụ', [
  { id: 'q1', question: 'Kiểu phục vụ nào có tốc độ tới khách nhanh nhất và chi phí nhân sự trên mỗi khách thấp nhất?', options: ['À la carte', 'Buffet', 'Room service', 'Banquet'], correctIndex: 1, explanation: 'Buffet cho khách tự lấy món đã bày sẵn, nên tốc độ nhanh và nhân sự trên mỗi khách thấp hơn các kiểu khác.' },
  { id: 'q2', question: 'Một tiệc cưới 300 khách với menu cố định, phục vụ đúng giờ, nên chọn kiểu phục vụ nào?', options: ['À la carte', 'Room service', 'Banquet', 'Quầy nhanh'], correctIndex: 2, explanation: 'Banquet phù hợp cho nhóm lớn, menu cố định, phục vụ đồng loạt vào một thời điểm — đúng đặc điểm của tiệc cưới.' },
  { id: 'q3', question: 'Vì sao room service thường có giá cao hơn cùng món ăn tại nhà hàng?', options: ['Nguyên liệu khác biệt', 'Bù cho số lượt phục vụ ít và thời gian di chuyển tới phòng khách', 'Không cần đầu bếp', 'Không tính thuế'], correctIndex: 1, explanation: 'Room service có khối lượng phục vụ thấp trên mỗi lượt và tốn thời gian di chuyển, nên giá được đặt cao hơn để bù chi phí nhân sự/thời gian đó.' },
]);

const c4 = doc('fbo201-4-1-service-sequence', '4.1 — Table service sequence & etiquette|||4.1 — Quy trình phục vụ bàn & nghi thức',
  'Trình tự phục vụ bàn từ đón khách đến thanh toán; nghi thức cơ bản (bên phục vụ, mang khay, giao tiếp).',
  [[
    `<span class="eyebrow">FBO201 · Chapter 4 · Lesson 4.1</span>
<h2>Table service sequence &amp; etiquette</h2>
<h3>The service sequence</h3>
<pre><code> 1. Greet & seat the guest
 2. Present menu & offer water/aperitif
 3. Take the order (food, then beverage, or per house standard)
 4. Relay order to kitchen/bar (POS)
 5. Serve bread/starters
 6. Clear starter plates before main course arrives
 7. Serve main course; check back within 2 dishes ("How is everything?")
 8. Clear main course plates
 9. Offer dessert / coffee menu
10. Present the bill; process payment
11. Thank the guest, assist departure, reset the table
</code></pre>
<h3>Basic etiquette</h3>
<ul>
<li><strong>Serve from the guest's right, clear from the right</strong> when possible (house standards vary; the key rule is consistency and not reaching across a guest).</li>
<li><strong>Ladies/host first</strong>, or as directed by the host — order of service should follow local convention.</li>
<li>Never stack dirty plates in front of guests; carry discreetly.</li>
<li>Confirm allergies/special requests before the order reaches the kitchen, not after.</li>
</ul>
<div class="callout"><span class="badge">Timing beats politeness</span> A guest forgives a small etiquette slip far more easily than a long, silent wait — checking back and managing pace between courses is often the single biggest driver of a good review.</div>`,
    `<span class="eyebrow">FBO201 · Chương 4 · Bài 4.1</span>
<h2>Quy trình phục vụ bàn &amp; nghi thức</h2>
<h3>Trình tự phục vụ</h3>
<pre><code> 1. Chào và dẫn khách vào bàn
 2. Đưa menu & mời nước lọc/khai vị
 3. Ghi order (món ăn, rồi đồ uống, hoặc theo chuẩn nhà hàng)
 4. Chuyển order tới bếp/bar (qua POS)
 5. Phục vụ bánh mì/khai vị
 6. Dọn đĩa khai vị trước khi món chính tới
 7. Phục vụ món chính; hỏi thăm sau 2 món ("Mọi thứ ổn không?")
 8. Dọn đĩa món chính
 9. Mời tráng miệng / menu cà phê
10. Đưa hoá đơn; xử lý thanh toán
11. Cảm ơn khách, hỗ trợ ra về, dọn lại bàn
</code></pre>
<h3>Nghi thức cơ bản</h3>
<ul>
<li><strong>Phục vụ từ bên phải khách, dọn từ bên phải</strong> khi có thể (mỗi nơi có chuẩn riêng; điểm cốt yếu là nhất quán và không đưa tay qua người khách).</li>
<li><strong>Ưu tiên phụ nữ/chủ tiệc trước</strong>, hoặc theo hướng dẫn của người chủ trì — thứ tự phục vụ theo tập quán địa phương.</li>
<li>Không xếp chồng đĩa bẩn trước mặt khách; mang đi kín đáo.</li>
<li>Xác nhận dị ứng/yêu cầu đặc biệt trước khi order tới bếp, không phải sau.</li>
</ul>
<div class="callout"><span class="badge">Tốc độ quan trọng hơn lịch sự</span> Khách dễ bỏ qua một sai sót nhỏ về nghi thức hơn nhiều so với việc phải chờ lâu trong im lặng — hỏi thăm và điều tiết nhịp giữa các món thường là yếu tố quyết định lớn nhất cho một đánh giá tốt.</div>`,
  ]]);
const c4q = quiz('fbo201-quiz-4', 'Quiz 4 — Quy trình phục vụ bàn', [
  { id: 'q1', question: 'Trong trình tự phục vụ bàn, bước nào diễn ra NGAY SAU khi ghi order?', options: ['Đưa hoá đơn', 'Chuyển order tới bếp/bar qua POS', 'Mời tráng miệng', 'Dọn đĩa món chính'], correctIndex: 1, explanation: 'Sau khi ghi order, nhân viên cần chuyển ngay tới bếp/bar (qua POS) để bắt đầu chế biến, tránh trì hoãn cả chuỗi phục vụ.' },
  { id: 'q2', question: 'Thời điểm hợp lý để xác nhận dị ứng thực phẩm của khách là khi nào?', options: ['Sau khi món ăn được phục vụ', 'Trước khi order được chuyển tới bếp', 'Khi khách thanh toán', 'Không cần xác nhận'], correctIndex: 1, explanation: 'Dị ứng/yêu cầu đặc biệt phải được xác nhận TRƯỚC khi order tới bếp, để bếp chế biến đúng ngay từ đầu, tránh rủi ro an toàn và phải làm lại món.' },
  { id: 'q3', question: 'Theo bài học, yếu tố nào thường ảnh hưởng đến đánh giá của khách nhiều hơn một lỗi nhỏ về nghi thức?', options: ['Màu sắc đồng phục nhân viên', 'Thời gian chờ và việc hỏi thăm giữa các món', 'Kiểu chữ trên menu', 'Số lượng nhân viên trong ca'], correctIndex: 1, explanation: 'Bài học nhấn mạnh: khách tha thứ lỗi nhỏ về nghi thức dễ hơn việc phải chờ lâu trong im lặng — quản lý thời gian và hỏi thăm giữa các món ảnh hưởng lớn hơn tới cảm nhận.' },
]);

const c5 = doc('fbo201-5-1-beverage-pairing', '5.1 — Beverage knowledge (wine, cocktails, coffee) & pairing|||5.1 — Kiến thức đồ uống (rượu vang, cocktail, cà phê) & pairing',
  'Kiến thức cơ bản rượu vang (đỏ/trắng/sủi), cocktail, cà phê; nguyên tắc pairing đồ uống với món ăn.',
  [[
    `<span class="eyebrow">FBO201 · Chapter 5 · Lesson 5.1</span>
<h2>Beverage knowledge &amp; pairing</h2>
<h3>Wine basics</h3>
<ul>
<li><strong>Red wine</strong> — served at room temperature (~16-18C), typically paired with red meat and rich dishes.</li>
<li><strong>White wine</strong> — served chilled (~8-12C), typically paired with fish, poultry and lighter dishes.</li>
<li><strong>Sparkling wine</strong> — served well chilled (~6-8C), used as an aperitif or for celebration; pairs broadly, including with salty/fried starters.</li>
</ul>
<h3>Cocktails &amp; coffee</h3>
<ul>
<li><strong>Cocktails</strong> — built (poured in glass), stirred (spirit-forward, e.g. Martini) or shaken (with juice/cream, e.g. Margarita); glassware and garnish signal the drink before the first sip.</li>
<li><strong>Coffee</strong> — espresso as the base; milk ratio defines the drink (espresso &lt; macchiato &lt; cappuccino &lt; latte in milk volume).</li>
</ul>
<h3>Pairing principle</h3>
<pre><code>Rule of thumb:
  Match weight    -> light dish with light drink, rich dish with fuller drink
  Match or contrast flavor -> acidity cuts fat (white wine + fried fish)
  Sweetness with sweetness -> dessert wine with dessert, not a dry red
</code></pre>
<div class="callout"><span class="badge">When unsure</span> A dry sparkling wine or a light beer is the safest "house pairing" across most starters — it is acidic/carbonated enough to cut through fat without a strong flavor that could clash.</div>`,
    `<span class="eyebrow">FBO201 · Chương 5 · Bài 5.1</span>
<h2>Kiến thức đồ uống &amp; pairing</h2>
<h3>Cơ bản về rượu vang</h3>
<ul>
<li><strong>Vang đỏ</strong> — phục vụ ở nhiệt độ phòng (~16-18C), thường đi cùng thịt đỏ và món đậm vị.</li>
<li><strong>Vang trắng</strong> — phục vụ lạnh (~8-12C), thường đi cùng hải sản, gia cầm và món nhẹ.</li>
<li><strong>Vang sủi</strong> — phục vụ rất lạnh (~6-8C), dùng làm khai vị hoặc mừng lễ; hợp với nhiều món, gồm cả khai vị mặn/chiên.</li>
</ul>
<h3>Cocktail &amp; cà phê</h3>
<ul>
<li><strong>Cocktail</strong> — pha trực tiếp trong ly (built), khuấy (stirred, nặng rượu, vd Martini) hoặc lắc (shaken, có nước ép/kem, vd Margarita); ly và trang trí báo hiệu loại đồ uống trước cả khi nhấp môi.</li>
<li><strong>Cà phê</strong> — espresso là nền; tỉ lệ sữa quyết định loại đồ uống (espresso &lt; macchiato &lt; cappuccino &lt; latte theo lượng sữa tăng dần).</li>
</ul>
<h3>Nguyên tắc pairing</h3>
<pre><code>Quy tắc chung:
  Cân bằng độ đậm  -> món nhẹ đi đồ uống nhẹ, món đậm đi đồ uống mạnh hơn
  Hợp/đối lập vị    -> độ chua cắt béo (vang trắng + hải sản chiên)
  Ngọt với ngọt     -> vang ngọt đi tráng miệng, không dùng vang đỏ khô
</code></pre>
<div class="callout"><span class="badge">Khi không chắc chọn gì</span> Vang sủi khô hoặc bia nhẹ là "lựa chọn an toàn" cho hầu hết món khai vị — đủ chua/có gas để cắt béo mà không có vị quá mạnh dễ xung đột.</div>`,
  ]]);
const c5q = quiz('fbo201-quiz-5', 'Quiz 5 — Kiến thức đồ uống & pairing', [
  { id: 'q1', question: 'Vang trắng thường được phục vụ ở nhiệt độ nào và đi cùng loại món nào?', options: ['Nhiệt độ phòng, đi với thịt đỏ', 'Lạnh (~8-12C), đi với hải sản/món nhẹ', 'Rất lạnh (~6-8C), chỉ dùng làm khai vị', 'Đun nóng, đi với tráng miệng'], correctIndex: 1, explanation: 'Vang trắng phục vụ lạnh khoảng 8-12C, thường đi cùng hải sản, gia cầm và các món nhẹ.' },
  { id: 'q2', question: 'Theo nguyên tắc pairing, món tráng miệng ngọt nên đi cùng loại rượu vang nào?', options: ['Vang đỏ khô, đậm tannin', 'Vang ngọt (dessert wine)', 'Vang sủi rất chua', 'Không nên dùng rượu vang'], correctIndex: 1, explanation: 'Nguyên tắc "ngọt với ngọt": món tráng miệng nên đi cùng vang ngọt, một vang đỏ khô sẽ tạo cảm giác chát/đắng khó chịu khi ăn cùng món ngọt.' },
  { id: 'q3', question: 'Trong các loại cà phê espresso pha sữa, loại nào có lượng sữa NHIỀU nhất?', options: ['Espresso', 'Macchiato', 'Cappuccino', 'Latte'], correctIndex: 3, explanation: 'Theo thứ tự lượng sữa tăng dần: espresso (không sữa) < macchiato < cappuccino < latte — latte có lượng sữa nhiều nhất.' },
]);

const c6 = doc('fbo201-6-1-menu-engineering', '6.1 — Menu engineering & pricing|||6.1 — Menu engineering & định giá',
  'Ma trận menu engineering (Stars/Plowhorses/Puzzles/Dogs); food cost %, contribution margin, chiến lược định giá.',
  [[
    `<span class="eyebrow">FBO201 · Chapter 6 · Lesson 6.1</span>
<h2>Menu engineering &amp; pricing</h2>
<h3>Two key numbers per dish</h3>
<ul>
<li><strong>Popularity</strong> — how often the dish is ordered (sales mix %).</li>
<li><strong>Profitability</strong> — contribution margin = selling price − food cost per dish.</li>
</ul>
<h3>The 2x2 menu engineering matrix</h3>
<pre><code>                High profitability     Low profitability
High popularity  STARS (promote)       PLOWHORSES (reprice/reengineer)
Low popularity   PUZZLES (reposition)  DOGS (consider removing)
</code></pre>
<h3>Pricing math</h3>
<pre><code>Food cost %          = food cost / selling price x 100
Contribution margin  = selling price - food cost
Target food cost %   often 28-35% for full-service restaurants
</code></pre>
<div class="callout"><span class="badge">Menu is a sales tool</span> Placement (top-right of a page, boxed items, photos) steers guests toward Stars and Puzzles — high-profit items should be the easiest to notice, not just the cheapest to make.</div>`,
    `<span class="eyebrow">FBO201 · Chương 6 · Bài 6.1</span>
<h2>Menu engineering &amp; định giá</h2>
<h3>Hai số liệu quan trọng mỗi món</h3>
<ul>
<li><strong>Độ phổ biến</strong> — món được order thường xuyên đến đâu (% trong tổng bán ra).</li>
<li><strong>Lợi nhuận</strong> — biên lợi nhuận (contribution margin) = giá bán − chi phí nguyên liệu (food cost) của món.</li>
</ul>
<h3>Ma trận menu engineering 2x2</h3>
<pre><code>                Lợi nhuận cao          Lợi nhuận thấp
Phổ biến cao     STARS (đẩy mạnh)      PLOWHORSES (định giá lại/cải tiến)
Phổ biến thấp    PUZZLES (đổi vị trí)  DOGS (xem xét loại bỏ)
</code></pre>
<h3>Công thức định giá</h3>
<pre><code>Food cost %         = chi phí NL / giá bán x 100
Biên lợi nhuận      = giá bán - chi phí nguyên liệu
Food cost % mục tiêu thường 28-35% cho nhà hàng phục vụ đầy đủ
</code></pre>
<div class="callout"><span class="badge">Menu là công cụ bán hàng</span> Vị trí trình bày (góc trên-phải trang, khung riêng, ảnh minh hoạ) hướng khách tới nhóm Stars và Puzzles — món lợi nhuận cao nên là món DỄ THẤY nhất, không chỉ là món rẻ để làm.</div>`,
  ]]);
const c6q = quiz('fbo201-quiz-6', 'Quiz 6 — Menu engineering & định giá', [
  { id: 'q1', question: 'Một món có độ phổ biến cao nhưng lợi nhuận thấp thuộc nhóm nào trong ma trận menu engineering?', options: ['Stars', 'Plowhorses', 'Puzzles', 'Dogs'], correctIndex: 1, explanation: 'Món phổ biến cao nhưng lợi nhuận thấp là Plowhorse — bán chạy nhưng lời ít, cần định giá lại hoặc cải tiến chi phí.' },
  { id: 'q2', question: 'Food cost % được tính bằng công thức nào?', options: ['Giá bán / chi phí nguyên liệu x 100', 'Chi phí nguyên liệu / giá bán x 100', 'Giá bán - chi phí nguyên liệu', 'Chi phí nguyên liệu + giá bán'], correctIndex: 1, explanation: 'Food cost % = chi phí nguyên liệu chia cho giá bán, nhân 100 — cho biết bao nhiêu phần trăm giá bán bị nguyên liệu chiếm.' },
  { id: 'q3', question: 'Món thuộc nhóm "Dogs" (phổ biến thấp, lợi nhuận thấp) nên được xử lý thế nào?', options: ['Đẩy mạnh quảng bá ngay', 'Đổi vị trí trình bày lên đầu menu', 'Xem xét loại bỏ khỏi menu', 'Tăng gấp đôi số lượng chế biến'], correctIndex: 2, explanation: 'Món Dogs vừa ít được order vừa ít lời — thường nên xem xét loại bỏ khỏi menu để giảm gánh nặng vận hành và tồn kho.' },
]);

const c7 = doc('fbo201-7-1-staffing-reservations', '7.1 — Staffing, reservations & guest care|||7.1 — Quản lý nhân sự, đặt bàn & chăm sóc khách',
  'Vai trò FOH/BOH, lịch làm việc theo giờ cao điểm; quản lý đặt bàn; xử lý khiếu nại & chăm sóc khách.',
  [[
    `<span class="eyebrow">FBO201 · Chapter 7 · Lesson 7.1</span>
<h2>Staffing, reservations &amp; guest care</h2>
<h3>Front-of-house roles</h3>
<ul>
<li><strong>Host/hostess</strong> — greets, manages the waitlist and table plan.</li>
<li><strong>Server</strong> — takes orders, serves, upsells, handles the check.</li>
<li><strong>Busser/runner</strong> — clears, resets, carries food from kitchen to table.</li>
<li><strong>Manager/supervisor</strong> — floor oversight, escalations, staffing decisions.</li>
</ul>
<h3>Scheduling &amp; reservations</h3>
<p>Staffing should follow demand curves (lunch/dinner peaks, weekends) rather than a flat schedule. A reservation system (book, confirm, no-show/overbooking policy) protects table turnover — the single biggest lever on revenue per seat in table-service venues.</p>
<h3>Guest care &amp; service recovery</h3>
<pre><code>L - Listen        (let the guest fully explain, do not interrupt)
E - Empathize     (acknowledge the guest's frustration)
A - Apologize     (a genuine apology, even if the fault is unclear)
R - Resolve       (fix it now: remake, discount, comp, or replace)
N - Notify        (log/inform the manager so it does not repeat)
</code></pre>
<div class="callout"><span class="badge">Recovery beats prevention (sometimes)</span> Research on service recovery shows a well-handled complaint can leave a guest MORE loyal than if nothing had gone wrong — speed and sincerity of the fix matter more than the mistake itself.</div>`,
    `<span class="eyebrow">FBO201 · Chương 7 · Bài 7.1</span>
<h2>Quản lý nhân sự, đặt bàn &amp; chăm sóc khách</h2>
<h3>Vai trò khu vực tiền sảnh (FOH)</h3>
<ul>
<li><strong>Host/hostess</strong> — chào khách, quản lý danh sách chờ và sơ đồ bàn.</li>
<li><strong>Server (phục vụ)</strong> — ghi order, phục vụ, gợi ý bán thêm, xử lý hoá đơn.</li>
<li><strong>Busser/runner</strong> — dọn bàn, sắp lại, mang món từ bếp ra bàn.</li>
<li><strong>Quản lý/giám sát</strong> — giám sát sàn, xử lý tình huống leo thang, quyết định nhân sự.</li>
</ul>
<h3>Lịch làm việc &amp; đặt bàn</h3>
<p>Lịch nhân sự nên theo đường cầu (giờ cao điểm trưa/tối, cuối tuần) chứ không phải lịch cố định phẳng. Hệ thống đặt bàn (đặt, xác nhận, chính sách no-show/overbooking) bảo vệ tốc độ xoay bàn — đòn bẩy lớn nhất tới doanh thu trên mỗi ghế ở mô hình phục vụ bàn.</p>
<h3>Chăm sóc khách &amp; xử lý khiếu nại</h3>
<pre><code>L - Lắng nghe     (để khách trình bày hết, không cắt lời)
E - Đồng cảm      (thừa nhận sự khó chịu của khách)
A - Xin lỗi       (lời xin lỗi thật lòng, dù chưa rõ lỗi thuộc ai)
R - Giải quyết    (sửa ngay: làm lại món, giảm giá, miễn phí, đổi món)
N - Ghi nhận      (báo/log cho quản lý để không lặp lại)
</code></pre>
<div class="callout"><span class="badge">Xử lý tốt còn hơn không xảy ra</span> Nghiên cứu về xử lý khiếu nại cho thấy một sự cố được giải quyết tốt có thể khiến khách TRUNG THÀNH HƠN so với khi không có gì xảy ra — tốc độ và sự chân thành của cách sửa quan trọng hơn chính sai sót.</div>`,
  ]]);
const c7q = quiz('fbo201-quiz-7', 'Quiz 7 — Nhân sự, đặt bàn & chăm sóc khách', [
  { id: 'q1', question: 'Vai trò nào chịu trách nhiệm chào khách và quản lý danh sách chờ/sơ đồ bàn?', options: ['Busser', 'Server', 'Host/hostess', 'Bếp trưởng'], correctIndex: 2, explanation: 'Host/hostess là người chào khách khi tới, quản lý danh sách chờ và sắp xếp sơ đồ bàn.' },
  { id: 'q2', question: 'Theo mô hình LEARN xử lý khiếu nại, bước nào diễn ra SAU bước "Xin lỗi"?', options: ['Lắng nghe', 'Đồng cảm', 'Giải quyết (sửa ngay)', 'Ghi nhận là bước đầu tiên'], correctIndex: 2, explanation: 'Thứ tự LEARN: Lắng nghe → Đồng cảm → Xin lỗi → Giải quyết → Ghi nhận. Sau khi xin lỗi, bước tiếp theo là giải quyết/sửa vấn đề ngay.' },
  { id: 'q3', question: 'Lịch làm việc nhân sự trong nhà hàng nên được xây dựng dựa trên yếu tố gì?', options: ['Cố định như nhau mỗi ngày trong tuần', 'Đường cầu — giờ cao điểm trưa/tối, cuối tuần', 'Chỉ dựa vào sở thích cá nhân của quản lý', 'Số lượng bàn tối đa của nhà hàng'], correctIndex: 1, explanation: 'Lịch nhân sự hiệu quả cần theo đường cầu thực tế (giờ cao điểm, cuối tuần) thay vì một lịch cố định phẳng, để tránh thiếu/dư nhân sự.' },
]);

const c8 = doc('fbo201-8-1-cost-revenue-trends', '8.1 — Cost, revenue control & F&B trends|||8.1 — Kiểm soát chi phí, doanh thu & xu hướng F&B',
  'Kiểm soát food/beverage cost, chỉ số RevPASH, các xu hướng F&B hiện nay (bền vững, công nghệ, trải nghiệm).',
  [[
    `<span class="eyebrow">FBO201 · Chapter 8 · Lesson 8.1</span>
<h2>Cost, revenue control &amp; F&amp;B trends</h2>
<h3>Cost control basics</h3>
<pre><code>Food cost %       = cost of food sold / food revenue x 100
Beverage cost %   = cost of beverage sold / beverage revenue x 100
Labor cost %      = total labor cost / total revenue x 100
Prime cost %      = food cost % + labor cost %   (target often <=60%)
</code></pre>
<h3>Revenue metrics</h3>
<p><strong>RevPASH</strong> (Revenue Per Available Seat Hour) = total revenue / (seats x hours open) — the F&amp;B equivalent of hotel RevPAR; it captures both pricing AND table turnover in one number.</p>
<h3>Current F&B trends</h3>
<ul>
<li><strong>Sustainability</strong> — local sourcing, reduced food waste, plant-forward menus.</li>
<li><strong>Technology</strong> — QR-code menus, self-order kiosks, kitchen display systems, delivery integration.</li>
<li><strong>Experience-led dining</strong> — open kitchens, chef's table, storytelling menus over plain formality.</li>
<li><strong>Ghost kitchens / delivery-only brands</strong> — F&amp;B production decoupled from a dine-in room.</li>
</ul>
<div class="callout"><span class="badge">Control without micromanaging</span> Tracking food cost % and RevPASH weekly catches drift (waste, portioning, pricing) early — waiting for the monthly P&amp;L to find a problem means a month of losses already happened.</div>`,
    `<span class="eyebrow">FBO201 · Chương 8 · Bài 8.1</span>
<h2>Kiểm soát chi phí, doanh thu &amp; xu hướng F&amp;B</h2>
<h3>Kiểm soát chi phí cơ bản</h3>
<pre><code>Food cost %       = chi phí thực phẩm bán ra / doanh thu thực phẩm x 100
Beverage cost %   = chi phí đồ uống bán ra / doanh thu đồ uống x 100
Labor cost %      = tổng chi phí nhân sự / tổng doanh thu x 100
Prime cost %      = Food cost % + Labor cost %   (mục tiêu thường <=60%)
</code></pre>
<h3>Chỉ số doanh thu</h3>
<p><strong>RevPASH</strong> (Doanh thu trên mỗi ghế-giờ khả dụng) = tổng doanh thu / (số ghế x số giờ mở cửa) — tương đương RevPAR trong khách sạn nhưng cho F&amp;B; nó gộp cả yếu tố giá VÀ tốc độ xoay bàn vào một số duy nhất.</p>
<h3>Xu hướng F&amp;B hiện nay</h3>
<ul>
<li><strong>Bền vững</strong> — nguồn nguyên liệu địa phương, giảm lãng phí thực phẩm, menu hướng thực vật.</li>
<li><strong>Công nghệ</strong> — menu QR-code, kiosk tự order, hệ thống hiển thị bếp (KDS), tích hợp giao hàng.</li>
<li><strong>Ăn uống theo trải nghiệm</strong> — bếp mở, bàn đầu bếp, menu kể chuyện thay vì chỉ trang trọng đơn thuần.</li>
<li><strong>Ghost kitchen / thương hiệu chỉ giao hàng</strong> — sản xuất F&amp;B tách khỏi phòng ăn tại chỗ.</li>
</ul>
<div class="callout"><span class="badge">Kiểm soát không phải vi quản lý</span> Theo dõi food cost % và RevPASH hàng tuần bắt được sai lệch sớm (lãng phí, định lượng, giá bán) — đợi tới báo cáo lãi/lỗ hàng tháng mới phát hiện vấn đề nghĩa là đã lỗ nguyên một tháng.</div>`,
  ]]);
const c8q = quiz('fbo201-quiz-8', 'Quiz 8 — Kiểm soát chi phí, doanh thu & xu hướng', [
  { id: 'q1', question: 'Prime cost % được tính bằng cách nào?', options: ['Food cost % nhân Labor cost %', 'Food cost % cộng Labor cost %', 'Doanh thu chia chi phí nhân sự', 'Beverage cost % cộng Food cost %'], correctIndex: 1, explanation: 'Prime cost % = Food cost % + Labor cost %, thường được kiểm soát ở mức không vượt quá khoảng 60% doanh thu.' },
  { id: 'q2', question: 'RevPASH đo lường điều gì?', options: ['Chi phí nguyên liệu trên mỗi món', 'Doanh thu trên mỗi ghế-giờ khả dụng', 'Số lượng nhân viên trên mỗi ca', 'Tỉ lệ khách quay lại'], correctIndex: 1, explanation: 'RevPASH (Revenue Per Available Seat Hour) = tổng doanh thu chia cho (số ghế x số giờ mở cửa) — gộp cả giá bán và tốc độ xoay bàn.' },
  { id: 'q3', question: 'Mô hình kinh doanh nào tách hoàn toàn việc sản xuất món ăn khỏi phòng ăn tại chỗ?', options: ['Banquet truyền thống', 'Fine dining bàn đầu bếp', 'Ghost kitchen / thương hiệu chỉ giao hàng', 'Buffet khách sạn'], correctIndex: 2, explanation: 'Ghost kitchen (thương hiệu chỉ giao hàng) sản xuất món ăn mà không có phòng ăn phục vụ khách tại chỗ, chỉ phục vụ qua giao hàng.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'FBO201',
    slug: 'fbo201-food-and-beverage-service-operations',
    title: 'Food and beverage service operations',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FBO201.webp',
    shortDescription: 'How F&B service runs — industry & service types, facilities & HACCP, service styles, table service & etiquette, beverage knowledge & pairing, menu engineering & pricing, staffing & guest care, cost/revenue control & trends. Bilingual.|||Vận hành dịch vụ Ẩm thực & Đồ uống — ngành & loại hình dịch vụ, cơ sở vật chất & HACCP, kiểu phục vụ, phục vụ bàn & nghi thức, đồ uống & pairing, menu engineering & định giá, nhân sự & chăm sóc khách, chi phí/doanh thu & xu hướng. Song ngữ.',
    description: 'Môn <strong>FBO201 — Food and Beverage Service Operations</strong> (khối Quản trị Kinh doanh, kỳ 4) học cách <strong>vận hành dịch vụ ăn uống</strong> thực tế. Từ <strong>ngành F&amp;B &amp; loại hình dịch vụ</strong> → <strong>cơ sở vật chất &amp; an toàn thực phẩm (HACCP)</strong> → <strong>các kiểu phục vụ</strong> (à la carte, buffet, banquet, room service) → <strong>quy trình phục vụ bàn &amp; nghi thức</strong> → <strong>kiến thức đồ uống</strong> (rượu vang, cocktail, cà phê) &amp; pairing → <strong>menu engineering &amp; định giá</strong> → <strong>nhân sự, đặt bàn &amp; chăm sóc khách</strong> → <strong>kiểm soát chi phí, doanh thu &amp; xu hướng F&amp;B</strong>. Song ngữ, có ví dụ checklist thực tế và quiz mỗi chương.',
    whatYouLearn: 'Phân khúc F&B & loại hình dịch vụ; 7 nguyên tắc HACCP & vùng nguy hiểm nhiệt độ; so sánh à la carte/buffet/banquet/room service; trình tự phục vụ bàn 11 bước & nghi thức; rượu vang/cocktail/cà phê & nguyên tắc pairing; ma trận menu engineering (Stars/Plowhorses/Puzzles/Dogs), food cost %; vai trò FOH, lịch nhân sự theo cầu, mô hình LEARN xử lý khiếu nại; food/labor/prime cost %, RevPASH, xu hướng F&B (bền vững, công nghệ, ghost kitchen).',
    requirements: 'Không yêu cầu kiến thức chuyên ngành trước đó. Nên có hiểu biết cơ bản về quản trị kinh doanh/dịch vụ (các môn nền của khối BBA kỳ 1-3) và quan tâm tới ngành nhà hàng - khách sạn.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, sách tham khảo, tài liệu chính thức, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'F&B là gì, vì sao quan trọng, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Ngành F&B & loại hình dịch vụ|||Chapter 1 — F&B industry & service types', description: 'Thương mại/phi thương mại, các loại hình dịch vụ ăn uống.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Cơ sở vật chất & HACCP|||Chapter 2 — Facilities & HACCP', description: 'FOH/BOH, thiết bị chính, 7 nguyên tắc HACCP.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Các kiểu phục vụ|||Chapter 3 — Service styles', description: 'À la carte, buffet, banquet, room service.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Quy trình phục vụ bàn & nghi thức|||Chapter 4 — Table service sequence & etiquette', description: 'Trình tự 11 bước, nghi thức cơ bản.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Kiến thức đồ uống & pairing|||Chapter 5 — Beverage knowledge & pairing', description: 'Rượu vang, cocktail, cà phê, nguyên tắc pairing.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Menu engineering & định giá|||Chapter 6 — Menu engineering & pricing', description: 'Ma trận Stars/Plowhorses/Puzzles/Dogs, food cost %.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Nhân sự, đặt bàn & chăm sóc khách|||Chapter 7 — Staffing, reservations & guest care', description: 'Vai trò FOH, lịch nhân sự, xử lý khiếu nại (LEARN).', lessons: [c7, c7q] },
    { title: 'Chương 8 — Chi phí, doanh thu & xu hướng F&B|||Chapter 8 — Cost, revenue control & F&B trends', description: 'Food/labor/prime cost %, RevPASH, xu hướng ngành.', lessons: [c8, c8q] },
  ],
};
