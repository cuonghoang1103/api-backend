/**
 * TTM202 — Destination Management and Marketing. Giáo trình FLM (syl): quản
 * trị điểm đến & marketing du lịch — vai trò DMO, sản phẩm điểm đến & chuỗi
 * giá trị, nghiên cứu thị trường & phân khúc, định vị & thương hiệu điểm đến,
 * marketing mix (7Ps), xúc tiến & marketing số, quản trị trải nghiệm & bên
 * liên quan, bền vững & đo hiệu quả/khủng hoảng. Trích: Kotler/Bowen/Makens —
 * Marketing for Hospitality & Tourism; Pike — Destination Marketing; UNWTO.
 * Song ngữ + khung lý thuyết + quiz. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ttm202-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (Kotler/Bowen/Makens, Pike), tài liệu UNWTO, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">TTM202 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Destination Management and Marketing — DMO roles, destination product, branding, marketing mix, digital promotion, sustainability — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources that follow the same references.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for TTM202 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Marketing for Hospitality and Tourism</em> — Philip Kotler, John T. Bowen, James C. Makens (Pearson) — chapters on destination marketing &amp; the tourism marketing mix.</li>
<li><em>Destination Marketing: Essentials</em> — Steven Pike (Routledge) — DMO structures, branding, positioning.</li>
<li><a href="https://www.unwto.org/" target="_blank" rel="noopener">UNWTO (World Tourism Organization)</a> — official guidance on destination management &amp; sustainable tourism policy.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.e-unwto.org/" target="_blank" rel="noopener">e-UNWTO library</a> — free UNWTO reports on destination management, marketing &amp; sustainability.</li>
<li><a href="https://www.thinkwithgoogle.com/marketing-strategies/travel/" target="_blank" rel="noopener">Think with Google — Travel</a> — data-driven digital marketing insights for destinations.</li>
<li><a href="https://skift.com/" target="_blank" rel="noopener">Skift</a> — travel &amp; destination marketing news and case studies.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@wtm" target="_blank" rel="noopener">WTM (World Travel Market)</a> — destination marketing talks &amp; case studies.</li>
<li><a href="https://www.youtube.com/@SkiftNews" target="_blank" rel="noopener">Skift</a> — destination &amp; travel industry marketing analysis.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://trends.google.com/trends/" target="_blank" rel="noopener">Google Trends</a> — gauge demand &amp; seasonality for a destination.</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — build sample destination campaign visuals for class exercises.</li>
<li><a href="https://www.visualcapitalist.com/" target="_blank" rel="noopener">Visual Capitalist</a> — tourism &amp; travel data visualizations for market research practice.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — DMO roles, the destination product (6A's), STP (segmentation-targeting-positioning), the 7Ps marketing mix.</li>
<li><strong>Practice</strong> — pick a real destination, write its brand positioning statement and a one-page marketing mix plan.</li>
<li><strong>Go deeper</strong> — digital promotion channels, stakeholder collaboration, sustainable tourism metrics.</li>
<li><strong>Job-ready</strong> — read a real DMO's annual marketing plan or a UNWTO case study and critique it against this course's frameworks.</li>
</ol></div>`,
    `<span class="eyebrow">TTM202 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Quản trị Điểm đến &amp; Marketing Du lịch — vai trò DMO, sản phẩm điểm đến, thương hiệu, marketing mix, xúc tiến số, bền vững — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, cùng hệ tài liệu tham khảo.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của TTM202 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Marketing for Hospitality and Tourism</em> — Philip Kotler, John T. Bowen, James C. Makens (Pearson) — các chương về marketing điểm đến &amp; marketing mix du lịch.</li>
<li><em>Destination Marketing: Essentials</em> — Steven Pike (Routledge) — cơ cấu DMO, xây dựng thương hiệu, định vị.</li>
<li><a href="https://www.unwto.org/" target="_blank" rel="noopener">UNWTO (Tổ chức Du lịch Thế giới)</a> — hướng dẫn chính thức về quản trị điểm đến &amp; chính sách du lịch bền vững.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.e-unwto.org/" target="_blank" rel="noopener">Thư viện e-UNWTO</a> — báo cáo UNWTO miễn phí về quản trị điểm đến, marketing &amp; bền vững.</li>
<li><a href="https://www.thinkwithgoogle.com/marketing-strategies/travel/" target="_blank" rel="noopener">Think with Google — Travel</a> — dữ liệu &amp; insight marketing số cho điểm đến.</li>
<li><a href="https://skift.com/" target="_blank" rel="noopener">Skift</a> — tin tức &amp; case study marketing điểm đến, du lịch.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@wtm" target="_blank" rel="noopener">WTM (World Travel Market)</a> — chia sẻ &amp; case study marketing điểm đến.</li>
<li><a href="https://www.youtube.com/@SkiftNews" target="_blank" rel="noopener">Skift</a> — phân tích marketing ngành du lịch &amp; điểm đến.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://trends.google.com/trends/" target="_blank" rel="noopener">Google Trends</a> — đo nhu cầu &amp; tính mùa vụ của một điểm đến.</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — dựng hình ảnh chiến dịch điểm đến mẫu cho bài tập.</li>
<li><a href="https://www.visualcapitalist.com/" target="_blank" rel="noopener">Visual Capitalist</a> — trực quan hoá dữ liệu du lịch để luyện nghiên cứu thị trường.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — vai trò DMO, sản phẩm điểm đến (6A), STP (phân khúc-mục tiêu-định vị), marketing mix 7Ps.</li>
<li><strong>Luyện tập</strong> — chọn một điểm đến thật, viết câu định vị thương hiệu và một trang kế hoạch marketing mix.</li>
<li><strong>Đào sâu thực tế</strong> — kênh xúc tiến số, hợp tác bên liên quan, chỉ số du lịch bền vững.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc kế hoạch marketing thật của một DMO hoặc case study UNWTO và phản biện theo khung của môn.</li>
</ol></div>`,
  ]]);

const intro = doc('ttm202-0-1-overview', 'Course overview: Destination Management and Marketing|||Tổng quan: Quản trị Điểm đến & Marketing Du lịch',
  'Điểm đến là gì; khác TTM201 (nhập môn) & TTM203 (hành vi tiêu dùng) thế nào; lộ trình 8 chương: DMO → sản phẩm điểm đến → nghiên cứu thị trường → thương hiệu → marketing mix → xúc tiến số → trải nghiệm & bên liên quan → bền vững & đo hiệu quả.',
  [[
    `<span class="eyebrow">TTM202 · Lesson 0.1 · Overview</span>
<h2>Destination Management and Marketing</h2>
<p class="lead">This course is about <strong>managing and marketing a destination</strong> — a city, region or country consumed as a single tourism product — through the organization built to do it: the <strong>DMO (Destination Management/Marketing Organization)</strong>. It is different from <strong>TTM201</strong> (a general introduction to tourism &amp; travel) and from <strong>TTM203</strong> (tourist consumer behavior): here the unit of analysis is the <em>destination itself</em>, and the question is how it is planned, positioned, marketed and kept sustainable.</p>
<h3>Why destinations need managing</h3>
<p>A destination is not owned by one company — it is a bundle of attractions, businesses, infrastructure and communities that a visitor experiences as one whole. Nobody controls all of it, so someone has to <strong>coordinate</strong> it: that is the DMO's job, sitting between government, industry and the community.</p>
<h3>Roadmap (8 chapters)</h3>
<pre><code>1. Destination management overview & the role of the DMO
2. The destination product & tourism value chain
3. Market research & tourist segmentation
4. Destination positioning & branding
5. Marketing strategy & the destination marketing mix (7Ps)
6. Destination communication, promotion & digital marketing
7. Experience & stakeholder management at the destination
8. Sustainable destinations, performance measurement & crisis recovery
</code></pre>
<div class="callout"><span class="badge">How this differs</span> TTM201 introduces tourism as an industry; TTM203 studies why a tourist chooses and behaves as they do. TTM202 studies the <strong>supply side</strong> — how a destination organizes itself, builds a brand and markets that brand to the right segments.</div>`,
    `<span class="eyebrow">TTM202 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị Điểm đến &amp; Marketing Du lịch</h2>
<p class="lead">Môn này nói về <strong>quản trị và marketing một điểm đến</strong> — một thành phố, vùng hay quốc gia được du khách tiêu dùng như MỘT sản phẩm duy nhất — thông qua tổ chức được lập ra để làm việc đó: <strong>DMO (tổ chức Quản trị/Marketing Điểm đến)</strong>. Môn này KHÁC <strong>TTM201</strong> (nhập môn tổng quan về du lịch) và <strong>TTM203</strong> (hành vi tiêu dùng của khách du lịch): đơn vị phân tích ở đây là <em>chính điểm đến</em>, câu hỏi là điểm đến được quy hoạch, định vị, marketing và giữ bền vững ra sao.</p>
<h3>Vì sao điểm đến cần được quản trị</h3>
<p>Một điểm đến không thuộc sở hữu của một doanh nghiệp — đó là tập hợp điểm hấp dẫn, doanh nghiệp, hạ tầng và cộng đồng mà du khách trải nghiệm như một thể thống nhất. Không ai kiểm soát toàn bộ, nên cần một bên <strong>điều phối</strong> — đó là việc của DMO, đứng giữa chính quyền, doanh nghiệp và cộng đồng.</p>
<h3>Lộ trình (8 chương)</h3>
<pre><code>1. Tổng quan quản trị điểm đến & vai trò DMO
2. Sản phẩm điểm đến & chuỗi giá trị du lịch
3. Nghiên cứu thị trường & phân khúc khách du lịch
4. Định vị & xây dựng thương hiệu điểm đến
5. Chiến lược marketing & marketing mix điểm đến (7Ps)
6. Truyền thông, xúc tiến & marketing số điểm đến
7. Quản trị trải nghiệm & các bên liên quan tại điểm đến
8. Điểm đến bền vững, đo lường hiệu quả & khủng hoảng/phục hồi
</code></pre>
<div class="callout"><span class="badge">Khác gì với môn kia</span> TTM201 giới thiệu du lịch như một ngành; TTM203 nghiên cứu vì sao khách chọn và hành xử như vậy. TTM202 nghiên cứu <strong>phía cung</strong> — điểm đến tự tổ chức, xây thương hiệu và marketing thương hiệu đó tới đúng phân khúc ra sao.</div>`,
  ]]);

const c1 = doc('ttm202-1-1-dmo-overview', '1.1 — Destination management overview & the role of the DMO|||1.1 — Tổng quan quản trị điểm đến & vai trò DMO',
  'Điểm đến là gì; các bên liên quan (chính quyền, doanh nghiệp, cộng đồng, du khách); DMO — cấp quốc gia/vùng/địa phương, chức năng chính; quản trị điểm đến khác marketing điểm đến.',
  [[
    `<span class="eyebrow">TTM202 · Chapter 1 · Lesson 1.1</span>
<h2>Destination management overview &amp; the role of the DMO</h2>
<h3>What is a "destination"?</h3>
<p>A <strong>destination</strong> is a geographic area — a city, region or country — that a visitor perceives and consumes as <em>one</em> tourism product, even though it is made up of many independent attractions, businesses and communities.</p>
<h3>Who is involved (stakeholders)</h3>
<ul>
<li><strong>Government / public sector</strong> — policy, infrastructure, funding, regulation.</li>
<li><strong>Private sector</strong> — hotels, tour operators, attractions, transport, F&amp;B.</li>
<li><strong>Local community</strong> — hosts the tourism activity; quality of life is affected both ways.</li>
<li><strong>Tourists</strong> — the demand side; their experience is the product being managed.</li>
</ul>
<h3>The DMO (Destination Management/Marketing Organization)</h3>
<p>The DMO is the organization tasked with coordinating all of the above toward one destination brand and strategy. It usually exists at three levels:</p>
<pre><code>National DMO   -> e.g. a national tourism board (country-level branding, policy)
Regional DMO   -> e.g. a province/state tourism office
Local DMO      -> e.g. a city convention & visitors bureau (CVB)
</code></pre>
<h3>Core DMO functions</h3>
<ul>
<li><strong>Marketing &amp; promotion</strong> — building and pushing the destination brand.</li>
<li><strong>Coordination</strong> — aligning public and private stakeholders around one strategy.</li>
<li><strong>Policy &amp; planning advocacy</strong> — infrastructure, sustainability, investment.</li>
<li><strong>Visitor services</strong> — information centers, signage, visitor experience quality.</li>
</ul>
<h3>Management vs. marketing</h3>
<p><strong>Destination management</strong> is the broader function — planning, coordinating stakeholders, policy. <strong>Destination marketing</strong> is one part of it — attracting and communicating with visitors. This course covers both, but the marketing side in more depth (branding, mix, promotion).</p>
<div class="callout"><span class="badge">Key idea</span> No single company owns a destination, so the DMO's real job is <strong>coordination</strong> as much as promotion — getting hundreds of independent players to pull in the same direction.</div>`,
    `<span class="eyebrow">TTM202 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan quản trị điểm đến &amp; vai trò DMO</h2>
<h3>"Điểm đến" là gì?</h3>
<p>Một <strong>điểm đến</strong> là một khu vực địa lý — thành phố, vùng hay quốc gia — mà du khách cảm nhận và tiêu dùng như <em>MỘT</em> sản phẩm du lịch duy nhất, dù nó được tạo thành từ nhiều điểm hấp dẫn, doanh nghiệp và cộng đồng độc lập.</p>
<h3>Các bên liên quan</h3>
<ul>
<li><strong>Chính quyền / khu vực công</strong> — chính sách, hạ tầng, ngân sách, quy định.</li>
<li><strong>Khu vực tư nhân</strong> — khách sạn, công ty lữ hành, điểm hấp dẫn, vận chuyển, ăn uống.</li>
<li><strong>Cộng đồng địa phương</strong> — nơi diễn ra hoạt động du lịch; chất lượng sống bị ảnh hưởng hai chiều.</li>
<li><strong>Du khách</strong> — phía cầu; trải nghiệm của họ chính là sản phẩm được quản trị.</li>
</ul>
<h3>DMO (tổ chức Quản trị/Marketing Điểm đến)</h3>
<p>DMO là tổ chức được giao điều phối tất cả các bên trên hướng tới một thương hiệu và chiến lược điểm đến. DMO thường tồn tại ở ba cấp:</p>
<pre><code>DMO quốc gia   -> vd cơ quan du lịch quốc gia (thương hiệu, chính sách cấp quốc gia)
DMO vùng       -> vd sở/cục du lịch cấp tỉnh, bang
DMO địa phương -> vd văn phòng xúc tiến du lịch & hội nghị cấp thành phố (CVB)
</code></pre>
<h3>Chức năng cốt lõi của DMO</h3>
<ul>
<li><strong>Marketing &amp; xúc tiến</strong> — xây và đẩy thương hiệu điểm đến.</li>
<li><strong>Điều phối</strong> — gắn kết các bên công-tư theo một chiến lược.</li>
<li><strong>Vận động chính sách &amp; quy hoạch</strong> — hạ tầng, bền vững, đầu tư.</li>
<li><strong>Dịch vụ du khách</strong> — trung tâm thông tin, chỉ dẫn, chất lượng trải nghiệm.</li>
</ul>
<h3>Quản trị vs. marketing</h3>
<p><strong>Quản trị điểm đến</strong> là chức năng rộng hơn — quy hoạch, điều phối các bên, chính sách. <strong>Marketing điểm đến</strong> là một phần trong đó — thu hút và truyền thông tới du khách. Môn này bao quát cả hai, nhưng đi sâu hơn về marketing (thương hiệu, mix, xúc tiến).</p>
<div class="callout"><span class="badge">Ý chính</span> Không doanh nghiệp nào sở hữu cả một điểm đến, nên việc thật của DMO là <strong>điều phối</strong> không kém gì xúc tiến — làm cho hàng trăm bên độc lập cùng đi một hướng.</div>`,
  ]]);

const c1q = quiz('ttm202-quiz-1', 'Quiz 1 — DMO overview|||Quiz 1 — Tổng quan DMO', [
  { id: 'q1', question: 'DMO là viết tắt của tổ chức nào?', options: ['Destination Management/Marketing Organization', 'Domestic Market Operator', 'Digital Media Office', 'Direct Marketing Organization'], correctIndex: 0, explanation: 'DMO = tổ chức Quản trị/Marketing Điểm đến, điều phối các bên liên quan.' },
  { id: 'q2', question: 'Vì sao một điểm đến cần một DMO điều phối?', options: ['Vì luật bắt buộc mọi thành phố phải có', 'Vì không doanh nghiệp nào sở hữu cả điểm đến, cần bên gắn kết các bên liên quan', 'Vì DMO thay chính quyền thu thuế du lịch', 'Vì DMO là cơ quan duy nhất được bán tour'], correctIndex: 1, explanation: 'Điểm đến là tập hợp nhiều bên độc lập; DMO đứng giữa để điều phối theo một chiến lược.' },
  { id: 'q3', question: 'Quản trị điểm đến khác marketing điểm đến ở điểm nào?', options: ['Không khác, là một', 'Quản trị chỉ làm ở cấp quốc gia, marketing chỉ ở cấp địa phương', 'Quản trị là chức năng rộng (quy hoạch, điều phối, chính sách); marketing là một phần trong đó (thu hút & truyền thông tới khách)', 'Marketing rộng hơn, bao gồm cả quản trị'], correctIndex: 2, explanation: 'Quản trị điểm đến bao quát hơn; marketing là một nhánh tập trung vào thu hút và truyền thông với du khách.' },
]);

const c2 = doc('ttm202-2-1-destination-product', '2.1 — The destination product & tourism value chain|||2.1 — Sản phẩm điểm đến & chuỗi giá trị du lịch',
  'Sản phẩm điểm đến là một "bó" trải nghiệm (mô hình 6A của Buhalis: Attractions, Accessibility, Amenities, Available packages, Activities, Ancillary services); chuỗi giá trị du lịch — các mắt xích cung ứng tạo nên trải nghiệm.',
  [[
    `<span class="eyebrow">TTM202 · Chapter 2 · Lesson 2.1</span>
<h2>The destination product &amp; tourism value chain</h2>
<h3>The destination as a "bundled" product</h3>
<p>Unlike a single hotel room or a flight ticket, the <strong>destination product</strong> is an entire bundle of experiences a visitor consumes together — attractions, place, services, image and price — assembled from many independent suppliers.</p>
<h3>Buhalis' 6A framework</h3>
<pre><code>Attractions          -> natural, man-made, cultural, special events
Accessibility        -> transport, visas, connectivity to/within the destination
Amenities            -> accommodation, catering, retail, other visitor services
Available packages   -> pre-arranged combinations (tour operators, agents)
Activities            -> everything a visitor can DO while there
Ancillary services     -> banks, telecom, hospitals, postal — support services
</code></pre>
<h3>The tourism value chain</h3>
<p>A destination product is delivered through a chain of suppliers, each adding value before the visitor experiences the whole:</p>
<pre><code>Transport -> Accommodation -> Food & beverage -> Attractions -> Tour operators/agents -> Visitor experience
</code></pre>
<p>A weak link anywhere in this chain (e.g. poor airport transfers, unsafe streets) damages the whole destination's image — visitors do not separate "the airport" from "the destination."</p>
<div class="callout"><span class="badge">Practical use</span> The 6A framework is an <strong>audit checklist</strong> — before marketing a destination, check whether all six elements are actually in place. Promoting attractions without fixing accessibility fails visitors on arrival.</div>`,
    `<span class="eyebrow">TTM202 · Chương 2 · Bài 2.1</span>
<h2>Sản phẩm điểm đến &amp; chuỗi giá trị du lịch</h2>
<h3>Điểm đến là một sản phẩm "đóng gói"</h3>
<p>Khác với một phòng khách sạn hay một vé máy bay đơn lẻ, <strong>sản phẩm điểm đến</strong> là cả một bó trải nghiệm mà du khách tiêu dùng cùng lúc — điểm hấp dẫn, không gian, dịch vụ, hình ảnh và giá — được ghép từ nhiều nhà cung cấp độc lập.</p>
<h3>Khung 6A của Buhalis</h3>
<pre><code>Attractions (điểm hấp dẫn)     -> tự nhiên, nhân tạo, văn hoá, sự kiện đặc biệt
Accessibility (khả năng tiếp cận) -> vận chuyển, visa, kết nối tới/trong điểm đến
Amenities (tiện nghi)          -> lưu trú, ăn uống, mua sắm, dịch vụ khác cho khách
Available packages (gói sẵn có)  -> tổ hợp đặt trước (công ty lữ hành, đại lý)
Activities (hoạt động)         -> mọi thứ du khách có thể LÀM khi ở đó
Ancillary services (dịch vụ phụ trợ) -> ngân hàng, viễn thông, y tế, bưu điện
</code></pre>
<h3>Chuỗi giá trị du lịch</h3>
<p>Sản phẩm điểm đến được tạo ra qua một chuỗi nhà cung cấp, mỗi mắt xích cộng thêm giá trị trước khi du khách trải nghiệm tổng thể:</p>
<pre><code>Vận chuyển -> Lưu trú -> Ăn uống -> Điểm hấp dẫn -> Công ty lữ hành/đại lý -> Trải nghiệm du khách
</code></pre>
<p>Một mắt xích yếu ở bất kỳ đâu trong chuỗi này (vd đón sân bay kém, đường phố không an toàn) làm hỏng hình ảnh của cả điểm đến — du khách không tách riêng "sân bay" khỏi "điểm đến".</p>
<div class="callout"><span class="badge">Ứng dụng thực tế</span> Khung 6A là một <strong>bảng kiểm (audit checklist)</strong> — trước khi marketing một điểm đến, hãy kiểm cả 6 yếu tố có thật đầy đủ chưa. Quảng bá điểm hấp dẫn mà không sửa khả năng tiếp cận sẽ khiến khách thất vọng ngay khi đến.</div>`,
  ]]);

const c2q = quiz('ttm202-quiz-2', 'Quiz 2 — Sản phẩm điểm đến & chuỗi giá trị|||Quiz 2 — Destination product & value chain', [
  { id: 'q1', question: 'Trong khung 6A của Buhalis, "Amenities" chỉ điều gì?', options: ['Điểm hấp dẫn tự nhiên', 'Lưu trú, ăn uống, mua sắm và dịch vụ khác cho khách', 'Vé máy bay và visa', 'Ngân hàng, viễn thông, y tế'], correctIndex: 1, explanation: 'Amenities = tiện nghi: lưu trú, ăn uống, mua sắm, dịch vụ hỗ trợ khách tại chỗ.' },
  { id: 'q2', question: 'Vì sao "Accessibility" (khả năng tiếp cận) quan trọng dù điểm đến có nhiều điểm hấp dẫn?', options: ['Vì nó không liên quan đến trải nghiệm khách', 'Vì thiếu khả năng tiếp cận (vận chuyển, visa) khiến khách không tới được hoặc trải nghiệm kém ngay từ đầu', 'Vì Accessibility chỉ áp dụng cho khách nội địa', 'Vì nó thay thế được cho Attractions'], correctIndex: 1, explanation: 'Khách không tách "sân bay/đường tới nơi" khỏi điểm đến — tiếp cận kém làm hỏng cả trải nghiệm.' },
  { id: 'q3', question: 'Chuỗi giá trị du lịch minh hoạ điều gì?', options: ['Chỉ vai trò của DMO', 'Các mắt xích nhà cung cấp độc lập cùng tạo nên trải nghiệm điểm đến, một mắt xích yếu làm hỏng cả hình ảnh', 'Cách tính giá tour', 'Thứ tự các chương trong môn học'], correctIndex: 1, explanation: 'Chuỗi giá trị: vận chuyển→lưu trú→ăn uống→điểm hấp dẫn→lữ hành→trải nghiệm; mỗi mắt xích ảnh hưởng tổng thể.' },
]);

const c3 = doc('ttm202-3-1-market-research-segmentation', '3.1 — Market research & tourist segmentation|||3.1 — Nghiên cứu thị trường & phân khúc khách du lịch',
  'Phương pháp nghiên cứu thị trường du lịch (khảo sát, dữ liệu thứ cấp, hồ sơ du khách); cơ sở phân khúc (nhân khẩu, địa lý, tâm lý, hành vi); mô hình tâm lý du khách của Plog.',
  [[
    `<span class="eyebrow">TTM202 · Chapter 3 · Lesson 3.1</span>
<h2>Market research &amp; tourist segmentation</h2>
<h3>Why research before marketing</h3>
<p>A destination cannot be "for everyone" — resources are limited, and different visitor types want different things. <strong>Market research</strong> tells a DMO who currently visits, who could visit, and what they actually value.</p>
<h3>Research methods</h3>
<ul>
<li><strong>Primary research</strong> — visitor surveys, exit interviews, focus groups.</li>
<li><strong>Secondary research</strong> — arrival statistics, spending data, competitor reports, UNWTO/national tourism board data.</li>
<li><strong>Visitor profiling</strong> — building a picture of who currently comes (origin, spend, length of stay, purpose).</li>
</ul>
<h3>Segmentation bases</h3>
<pre><code>Demographic   -> age, income, family stage, occupation
Geographic    -> country/region of origin, domestic vs. international
Psychographic -> lifestyle, values, personality, risk tolerance
Behavioral    -> purpose of visit (leisure/business/VFR), booking behavior, loyalty
</code></pre>
<h3>Plog's psychocentric–allocentric model</h3>
<p>A classic tourist-personality model: <strong>psychocentrics</strong> prefer familiar, low-risk, well-developed destinations; <strong>allocentrics</strong> seek novel, less-developed, adventurous ones; most travelers sit somewhere in between (mid-centrics). This shapes which destinations appeal to which personality type — a mass-market beach resort and a remote trekking destination target opposite ends of this spectrum.</p>
<h3>From segments to targets</h3>
<p>After segmenting, a DMO selects <strong>target segments</strong> — the ones it can serve well and profitably — rather than trying to appeal to every traveler type at once. This choice feeds directly into positioning (Chapter 4) and the marketing mix (Chapter 5).</p>
<div class="callout"><span class="badge">Key idea</span> Segmentation is not academic — it decides which images, channels and messages a DMO invests in. Get the segment wrong, and every later marketing decision aims at the wrong audience.</div>`,
    `<span class="eyebrow">TTM202 · Chương 3 · Bài 3.1</span>
<h2>Nghiên cứu thị trường &amp; phân khúc khách du lịch</h2>
<h3>Vì sao phải nghiên cứu trước khi marketing</h3>
<p>Một điểm đến không thể "dành cho tất cả mọi người" — nguồn lực có hạn, và các nhóm khách khác nhau muốn những điều khác nhau. <strong>Nghiên cứu thị trường</strong> giúp DMO biết ai đang tới, ai có thể tới, và họ thực sự coi trọng điều gì.</p>
<h3>Phương pháp nghiên cứu</h3>
<ul>
<li><strong>Nghiên cứu sơ cấp</strong> — khảo sát du khách, phỏng vấn khi rời điểm đến, nhóm tập trung (focus group).</li>
<li><strong>Nghiên cứu thứ cấp</strong> — thống kê lượt khách, dữ liệu chi tiêu, báo cáo đối thủ, dữ liệu UNWTO/cơ quan du lịch quốc gia.</li>
<li><strong>Hồ sơ du khách (visitor profiling)</strong> — dựng chân dung ai đang tới (xuất xứ, chi tiêu, thời gian lưu trú, mục đích).</li>
</ul>
<h3>Cơ sở phân khúc</h3>
<pre><code>Nhân khẩu học -> tuổi, thu nhập, giai đoạn gia đình, nghề nghiệp
Địa lý         -> quốc gia/vùng xuất xứ, nội địa vs. quốc tế
Tâm lý         -> phong cách sống, giá trị, tính cách, mức chịu rủi ro
Hành vi        -> mục đích chuyến đi (nghỉ dưỡng/công vụ/thăm thân), cách đặt, sự trung thành
</code></pre>
<h3>Mô hình psychocentric–allocentric của Plog</h3>
<p>Một mô hình tính cách du khách kinh điển: <strong>psychocentric</strong> thích điểm đến quen thuộc, ít rủi ro, đã phát triển tốt; <strong>allocentric</strong> tìm điểm đến mới lạ, ít phát triển, mạo hiểm; đa số du khách nằm ở giữa (mid-centric). Điều này quyết định loại điểm đến nào phù hợp với loại tính cách nào — một khu resort biển đại chúng và một điểm trekking hẻo lánh nhắm vào hai đầu đối lập của thang này.</p>
<h3>Từ phân khúc đến mục tiêu</h3>
<p>Sau khi phân khúc, DMO chọn <strong>phân khúc mục tiêu</strong> — những nhóm mình phục vụ tốt và có lãi — thay vì cố hấp dẫn mọi loại du khách cùng lúc. Lựa chọn này nạp trực tiếp vào định vị (Chương 4) và marketing mix (Chương 5).</p>
<div class="callout"><span class="badge">Ý chính</span> Phân khúc không phải chuyện học thuật — nó quyết định DMO đầu tư vào hình ảnh, kênh và thông điệp nào. Chọn sai phân khúc, mọi quyết định marketing sau đó sẽ nhắm sai đối tượng.</div>`,
  ]]);

const c3q = quiz('ttm202-quiz-3', 'Quiz 3 — Nghiên cứu thị trường & phân khúc|||Quiz 3 — Market research & segmentation', [
  { id: 'q1', question: 'Phân khúc theo "hành vi" (behavioral) dựa trên yếu tố nào?', options: ['Tuổi và thu nhập', 'Quốc gia xuất xứ', 'Mục đích chuyến đi, cách đặt dịch vụ, sự trung thành', 'Phong cách sống và tính cách'], correctIndex: 2, explanation: 'Phân khúc hành vi nhìn vào mục đích chuyến đi, hành vi đặt và mức trung thành — khác nhân khẩu/địa lý/tâm lý.' },
  { id: 'q2', question: 'Theo mô hình Plog, du khách "allocentric" có xu hướng nào?', options: ['Ưu tiên điểm đến quen thuộc, ít rủi ro', 'Tìm điểm đến mới lạ, ít phát triển, mạo hiểm', 'Chỉ đi du lịch công vụ', 'Không quan tâm tới hình ảnh điểm đến'], correctIndex: 1, explanation: 'Allocentric tìm sự mới lạ và mạo hiểm; psychocentric mới là nhóm ưu tiên quen thuộc, an toàn.' },
  { id: 'q3', question: 'Vì sao một DMO cần chọn "phân khúc mục tiêu" thay vì nhắm tới mọi loại khách?', options: ['Vì luật quy định phải chọn', 'Vì nguồn lực marketing có hạn, cần phục vụ tốt nhóm mình có thể phục vụ có lãi', 'Vì mỗi điểm đến chỉ được phép có một loại khách', 'Vì nghiên cứu thị trường không áp dụng cho đa phân khúc'], correctIndex: 1, explanation: 'Chọn mục tiêu giúp tập trung nguồn lực marketing hiệu quả, tránh loãng thông điệp và ngân sách.' },
]);

const c4 = doc('ttm202-4-1-positioning-branding', '4.1 — Destination positioning & branding|||4.1 — Định vị & xây dựng thương hiệu điểm đến',
  'Định vị điểm đến (chỗ đứng trong tâm trí khách so với đối thủ); nhận diện thương hiệu (brand identity) vs. hình ảnh thương hiệu (brand image); câu định vị, USP, tài sản thương hiệu; ví dụ thực tế.',
  [[
    `<span class="eyebrow">TTM202 · Chapter 4 · Lesson 4.1</span>
<h2>Destination positioning &amp; branding</h2>
<h3>Positioning: the mental "spot"</h3>
<p><strong>Positioning</strong> is the place a destination occupies in a target visitor's mind, relative to competing destinations — e.g. "the safe, family-friendly beach option" vs. "the adventurous backpacker route." Positioning is decided, not discovered by accident — it must follow directly from the target segment chosen in Chapter 3.</p>
<h3>Brand identity vs. brand image</h3>
<pre><code>Brand identity -> what the DMO WANTS the destination to stand for (controlled)
Brand image    -> what visitors ACTUALLY perceive (not fully controlled)
</code></pre>
<p>The gap between the two is a marketing problem: a destination can have a beautiful campaign (identity) that visitors still perceive as unsafe or overpriced (image) if the underlying experience doesn't match the message.</p>
<h3>Positioning statement &amp; USP</h3>
<p>A good positioning statement names the target segment, the category, and the <strong>Unique Selling Proposition (USP)</strong> — the one differentiating benefit competitors can't credibly claim. Slogans (e.g. "Malaysia, Truly Asia," "Incredible India") are the visible tip of a positioning strategy, not the strategy itself.</p>
<h3>Destination brand equity</h3>
<p>Just like a product brand, a destination brand builds equity — awareness, perceived quality, associations, loyalty (repeat visits, word-of-mouth) — that lets it command a price premium and survive short-term bad press.</p>
<div class="callout"><span class="badge">Common mistake</span> Branding a destination around an image the actual product can't deliver (an "adventure" positioning with no real adventure infrastructure) breaks trust the moment visitors arrive — brand and product must match.</div>`,
    `<span class="eyebrow">TTM202 · Chương 4 · Bài 4.1</span>
<h2>Định vị &amp; xây dựng thương hiệu điểm đến</h2>
<h3>Định vị: "chỗ đứng" trong tâm trí</h3>
<p><strong>Định vị</strong> là chỗ đứng của một điểm đến trong tâm trí du khách mục tiêu, so với các điểm đến cạnh tranh — vd "lựa chọn biển an toàn, phù hợp gia đình" đối lại "lộ trình phượt bụi mạo hiểm". Định vị là điều được QUYẾT ĐỊNH, không phải ngẫu nhiên có được — nó phải bám trực tiếp vào phân khúc mục tiêu đã chọn ở Chương 3.</p>
<h3>Nhận diện thương hiệu vs. hình ảnh thương hiệu</h3>
<pre><code>Brand identity (nhận diện) -> điều DMO MUỐN điểm đến đại diện cho (kiểm soát được)
Brand image (hình ảnh)     -> điều du khách THỰC SỰ cảm nhận (không kiểm soát hết được)
</code></pre>
<p>Khoảng cách giữa hai thứ này là một vấn đề marketing: một điểm đến có thể có chiến dịch đẹp (identity) mà khách vẫn cảm nhận là không an toàn hay quá đắt (image) nếu trải nghiệm thật không khớp với thông điệp.</p>
<h3>Câu định vị &amp; USP</h3>
<p>Một câu định vị tốt nêu rõ phân khúc mục tiêu, danh mục cạnh tranh, và <strong>USP (Unique Selling Proposition — điểm bán độc nhất)</strong> — lợi ích khác biệt duy nhất mà đối thủ không thể tuyên bố một cách đáng tin. Slogan (vd "Malaysia, Truly Asia", "Incredible India") là phần nhìn thấy của chiến lược định vị, không phải chiến lược tự nó.</p>
<h3>Tài sản thương hiệu điểm đến (brand equity)</h3>
<p>Giống thương hiệu sản phẩm, thương hiệu điểm đến tích luỹ tài sản — độ nhận biết, cảm nhận chất lượng, liên tưởng, sự trung thành (quay lại, truyền miệng) — cho phép định giá cao hơn và chịu đựng được khủng hoảng truyền thông ngắn hạn.</p>
<div class="callout"><span class="badge">Lỗi thường gặp</span> Xây thương hiệu quanh một hình ảnh mà sản phẩm thật không đáp ứng được (định vị "mạo hiểm" mà không có hạ tầng mạo hiểm thật) sẽ phá vỡ niềm tin ngay khi khách tới — thương hiệu và sản phẩm phải khớp nhau.</div>`,
  ]]);

const c4q = quiz('ttm202-quiz-4', 'Quiz 4 — Định vị & thương hiệu|||Quiz 4 — Positioning & branding', [
  { id: 'q1', question: '"Brand identity" và "brand image" khác nhau ở điểm nào?', options: ['Không khác gì cả', 'Brand identity là điều DMO muốn đại diện (kiểm soát được); brand image là điều khách thực sự cảm nhận (không kiểm soát hết)', 'Brand identity chỉ dùng cho doanh nghiệp, không dùng cho điểm đến', 'Brand image được quyết định trước, brand identity hình thành sau'], correctIndex: 1, explanation: 'Identity = thông điệp chủ định của DMO; image = cảm nhận thực tế của khách, có thể lệch với identity.' },
  { id: 'q2', question: 'Định vị điểm đến nên bám vào yếu tố nào đã có ở chương trước?', options: ['Chuỗi giá trị du lịch', 'Phân khúc mục tiêu đã chọn từ nghiên cứu thị trường', 'Số lượng DMO cấp quốc gia', 'Ngân sách marketing của đối thủ'], correctIndex: 1, explanation: 'Định vị phải nhắm đúng phân khúc mục tiêu — nếu không thì thông điệp lệch đối tượng.' },
  { id: 'q3', question: 'Vì sao xây thương hiệu điểm đến quanh một hình ảnh sản phẩm không đáp ứng được là lỗi nghiêm trọng?', options: ['Vì không ảnh hưởng gì tới trải nghiệm khách', 'Vì nó phá vỡ niềm tin ngay khi khách tới, do brand và sản phẩm thật không khớp', 'Vì DMO sẽ bị phạt hành chính', 'Vì slogan sẽ không dịch được sang tiếng khác'], correctIndex: 1, explanation: 'Khi trải nghiệm thật không khớp thông điệp thương hiệu, niềm tin của khách sụp ngay khi họ trải nghiệm.' },
]);

const c5 = doc('ttm202-5-1-marketing-mix-7ps', '5.1 — Marketing strategy & the destination marketing mix (7Ps)|||5.1 — Chiến lược marketing & marketing mix điểm đến (7Ps)',
  'Ôn STP (phân khúc-mục tiêu-định vị) làm nền cho chiến lược; marketing mix 7Ps áp cho điểm đến: Product, Price, Place, Promotion, People, Process, Physical evidence.',
  [[
    `<span class="eyebrow">TTM202 · Chapter 5 · Lesson 5.1</span>
<h2>Marketing strategy &amp; the destination marketing mix (7Ps)</h2>
<h3>From STP to a marketing plan</h3>
<p>Segmentation (Ch. 3) and positioning (Ch. 4) set the direction. The <strong>marketing mix</strong> is where strategy becomes concrete, controllable decisions — because destination marketing includes services (accommodation, guiding, hospitality), the classic 4Ps are extended to <strong>7Ps</strong>.</p>
<h3>The 7Ps applied to a destination</h3>
<pre><code>Product   -> the destination bundle itself (attractions, amenities, experiences — see Ch. 2)
Price     -> perceived value, cost of travel/stay, currency, seasonal pricing
Place     -> distribution: how visitors book/access the destination (OTAs, agents, direct)
Promotion -> advertising, PR, digital campaigns (detailed in Ch. 6)
People    -> frontline staff, guides, hosts — service quality shapes the whole experience
Process   -> booking flow, visa process, queueing, on-ground logistics
Physical evidence -> signage, infrastructure condition, cleanliness — tangible proof of quality
</code></pre>
<h3>Why the extra 3Ps matter for destinations</h3>
<p>A destination is largely a <strong>service</strong>, not a physical good — it is intangible, produced and consumed at the same time, and highly variable in quality. People, Process and Physical evidence exist specifically to manage that variability: a friendly guide (People), a smooth immigration process (Process) and clean, well-signed streets (Physical evidence) shape perceived quality as much as the attraction itself.</p>
<div class="callout"><span class="badge">Practical tip</span> When building a destination marketing plan, write one line per P — a plan that only covers Promotion is not a marketing mix, just an ad campaign.</div>`,
    `<span class="eyebrow">TTM202 · Chương 5 · Bài 5.1</span>
<h2>Chiến lược marketing &amp; marketing mix điểm đến (7Ps)</h2>
<h3>Từ STP tới một kế hoạch marketing</h3>
<p>Phân khúc (Chương 3) và định vị (Chương 4) đặt ra hướng đi. <strong>Marketing mix</strong> là nơi chiến lược trở thành các quyết định cụ thể, kiểm soát được — vì marketing điểm đến bao gồm dịch vụ (lưu trú, hướng dẫn, tiếp đón), 4Ps kinh điển được mở rộng thành <strong>7Ps</strong>.</p>
<h3>7Ps áp dụng cho điểm đến</h3>
<pre><code>Product (sản phẩm)   -> chính bó sản phẩm điểm đến (điểm hấp dẫn, tiện nghi, trải nghiệm — xem Ch.2)
Price (giá)           -> giá trị cảm nhận, chi phí đi lại/lưu trú, tiền tệ, giá theo mùa
Place (phân phối)     -> cách khách đặt/tiếp cận điểm đến (OTA, đại lý, đặt trực tiếp)
Promotion (xúc tiến)  -> quảng cáo, PR, chiến dịch số (chi tiết ở Ch.6)
People (con người)    -> nhân viên tuyến đầu, hướng dẫn viên, người tiếp đón — quyết định chất lượng trải nghiệm
Process (quy trình)   -> luồng đặt dịch vụ, thủ tục visa, xếp hàng, hậu cần tại chỗ
Physical evidence (chứng thực vật lý) -> chỉ dẫn, hạ tầng, độ sạch sẽ — bằng chứng hữu hình cho chất lượng
</code></pre>
<h3>Vì sao 3P bổ sung quan trọng với điểm đến</h3>
<p>Điểm đến phần lớn là một <strong>dịch vụ</strong>, không phải hàng hoá vật lý — vô hình, được tạo ra và tiêu dùng cùng lúc, chất lượng dễ biến động. People, Process và Physical evidence tồn tại chính để quản trị sự biến động đó: một hướng dẫn viên thân thiện (People), thủ tục nhập cảnh trơn tru (Process) và đường phố sạch, chỉ dẫn rõ (Physical evidence) định hình chất lượng cảm nhận không kém gì điểm hấp dẫn chính.</p>
<div class="callout"><span class="badge">Gợi ý thực hành</span> Khi dựng kế hoạch marketing điểm đến, viết một dòng cho MỖI P — một kế hoạch chỉ có Promotion không phải marketing mix, đó chỉ là một chiến dịch quảng cáo.</div>`,
  ]]);

const c5q = quiz('ttm202-quiz-5', 'Quiz 5 — Marketing mix 7Ps|||Quiz 5 — Marketing mix 7Ps', [
  { id: 'q1', question: 'Vì sao marketing mix điểm đến dùng 7Ps thay vì 4Ps kinh điển?', options: ['Vì 7Ps dễ nhớ hơn', 'Vì điểm đến chủ yếu là dịch vụ — vô hình, biến động chất lượng — cần thêm People, Process, Physical evidence', 'Vì UNWTO quy định bắt buộc', 'Vì 4Ps chỉ áp dụng cho hàng hoá xuất khẩu'], correctIndex: 1, explanation: 'Dịch vụ có tính vô hình & biến động cao, cần 3P bổ sung để quản trị chất lượng cảm nhận.' },
  { id: 'q2', question: '"Physical evidence" trong marketing mix điểm đến là gì?', options: ['Giá vé máy bay', 'Chỉ dẫn, hạ tầng, độ sạch sẽ — bằng chứng hữu hình cho chất lượng', 'Kênh phân phối trực tuyến', 'Chiến dịch quảng cáo trên mạng xã hội'], correctIndex: 1, explanation: 'Physical evidence là các yếu tố hữu hình (biển chỉ dẫn, hạ tầng, độ sạch) chứng minh chất lượng.' },
  { id: 'q3', question: 'Một kế hoạch marketing điểm đến chỉ tập trung vào Promotion thì có vấn đề gì?', options: ['Không có vấn đề, Promotion là quan trọng nhất', 'Đó chỉ là một chiến dịch quảng cáo, không phải marketing mix đầy đủ vì thiếu 6P còn lại', 'Promotion không thuộc marketing mix', 'Cần bỏ Promotion để tập trung vào Price'], correctIndex: 1, explanation: 'Marketing mix đầy đủ cần cân đối cả 7P; chỉ làm Promotion bỏ sót Product, Price, Place, People, Process, Physical evidence.' },
]);

const c6 = doc('ttm202-6-1-promotion-digital', '6.1 — Destination communication, promotion & digital marketing|||6.1 — Truyền thông, xúc tiến & marketing số điểm đến',
  'Mô hình xúc tiến (promotion mix): quảng cáo, PR, khuyến mãi, bán hàng cá nhân; marketing số cho điểm đến: mạng xã hội, content & influencer marketing, website DMO, SEO.',
  [[
    `<span class="eyebrow">TTM202 · Chapter 6 · Lesson 6.1</span>
<h2>Destination communication, promotion &amp; digital marketing</h2>
<h3>The promotion mix</h3>
<pre><code>Advertising      -> paid media (TV, print, digital ads) building broad awareness
PR / publicity   -> earned media (press trips, news coverage) — credible but less controllable
Sales promotion  -> short-term incentives (fam trips, discounts, seasonal offers)
Personal selling -> trade shows, B2B relations with tour operators/travel agents
Digital / social -> owned & earned online channels — now the dominant channel mix
</code></pre>
<h3>Digital marketing for destinations</h3>
<ul>
<li><strong>Social media</strong> — visual platforms (Instagram, TikTok, YouTube) drive destination discovery; user-generated content (UGC) is often more persuasive than official ads.</li>
<li><strong>Influencer &amp; content marketing</strong> — travel creators reach niche, high-trust audiences a DMO's own channels can't.</li>
<li><strong>DMO websites &amp; SEO</strong> — the destination's own site is the conversion point; ranking for "things to do in X" captures active search intent.</li>
<li><strong>Data-driven targeting</strong> — search trend and campaign data (see Ch. 3 tools) let a DMO time and target promotion to actual demand signals.</li>
</ul>
<h3>Integrated communication</h3>
<p>The channels above must say the <strong>same brand story</strong> (Ch. 4) to the <strong>same target segments</strong> (Ch. 3) — a beautiful Instagram campaign contradicted by an outdated, hard-to-navigate DMO website undermines both.</p>
<div class="callout"><span class="badge">Shift to note</span> Traditional advertising builds broad awareness; in tourism today, UGC and influencer content usually drive the actual booking decision — a DMO's job increasingly is curating and amplifying visitor-generated content, not just producing its own ads.</div>`,
    `<span class="eyebrow">TTM202 · Chương 6 · Bài 6.1</span>
<h2>Truyền thông, xúc tiến &amp; marketing số điểm đến</h2>
<h3>Mô hình xúc tiến (promotion mix)</h3>
<pre><code>Quảng cáo         -> truyền thông trả tiền (TV, báo in, ads số) xây nhận biết rộng
PR / công bố       -> truyền thông kiếm được (mời báo chí, tin tức) — đáng tin nhưng khó kiểm soát
Khuyến mãi         -> ưu đãi ngắn hạn (fam trip, giảm giá, ưu đãi theo mùa)
Bán hàng cá nhân    -> hội chợ du lịch, quan hệ B2B với công ty lữ hành/đại lý
Số / mạng xã hội   -> kênh sở hữu & kiếm được trên mạng — nay là nhóm kênh chủ đạo
</code></pre>
<h3>Marketing số cho điểm đến</h3>
<ul>
<li><strong>Mạng xã hội</strong> — nền tảng hình ảnh (Instagram, TikTok, YouTube) dẫn dắt việc khám phá điểm đến; nội dung do người dùng tạo (UGC) thường thuyết phục hơn quảng cáo chính thức.</li>
<li><strong>Influencer &amp; content marketing</strong> — nhà sáng tạo du lịch tiếp cận nhóm khách ngách, độ tin cao mà kênh chính thức của DMO khó chạm tới.</li>
<li><strong>Website DMO &amp; SEO</strong> — website riêng của điểm đến là điểm chuyển đổi; lên top tìm kiếm "things to do in X" bắt được nhu cầu tìm kiếm chủ động.</li>
<li><strong>Nhắm mục tiêu theo dữ liệu</strong> — dữ liệu xu hướng tìm kiếm & chiến dịch (xem công cụ ở Ch.3) giúp DMO chọn thời điểm và đối tượng theo tín hiệu cầu thật.</li>
</ul>
<h3>Truyền thông tích hợp</h3>
<p>Các kênh trên phải kể <strong>cùng một câu chuyện thương hiệu</strong> (Ch.4) tới <strong>cùng phân khúc mục tiêu</strong> (Ch.3) — một chiến dịch Instagram đẹp mà bị mâu thuẫn bởi website DMO lỗi thời, khó dùng sẽ làm hỏng cả hai.</p>
<div class="callout"><span class="badge">Xu hướng cần lưu ý</span> Quảng cáo truyền thống xây nhận biết rộng; trong du lịch hiện nay, UGC và nội dung influencer thường là thứ thúc đẩy quyết định đặt chuyến thật — việc của DMO ngày càng là chọn lọc và khuếch đại nội dung do khách tạo ra, không chỉ tự sản xuất quảng cáo.</div>`,
  ]]);

const c6q = quiz('ttm202-quiz-6', 'Quiz 6 — Xúc tiến & marketing số|||Quiz 6 — Promotion & digital marketing', [
  { id: 'q1', question: 'Trong promotion mix, "PR / công bố" khác "quảng cáo" ở điểm gì?', options: ['PR là trả tiền, quảng cáo là miễn phí', 'PR là truyền thông kiếm được (đáng tin nhưng khó kiểm soát), quảng cáo là truyền thông trả tiền (kiểm soát được nội dung)', 'PR chỉ dùng cho khủng hoảng', 'Không có khác biệt'], correctIndex: 1, explanation: 'Quảng cáo trả tiền, kiểm soát nội dung; PR là earned media, đáng tin hơn nhưng DMO không kiểm soát hoàn toàn.' },
  { id: 'q2', question: 'Vì sao nội dung do người dùng tạo (UGC) thường thuyết phục hơn quảng cáo chính thức?', options: ['Vì UGC luôn có chất lượng hình ảnh cao hơn', 'Vì UGC đến từ du khách thật, được xem là đáng tin và khách quan hơn nội dung DMO tự sản xuất', 'Vì UGC được DMO trả tiền để sản xuất', 'Vì UGC không xuất hiện trên mạng xã hội'], correctIndex: 1, explanation: 'UGC được cảm nhận là khách quan, đến từ trải nghiệm thật, nên đáng tin hơn quảng cáo tự làm.' },
  { id: 'q3', question: 'Vì sao các kênh truyền thông của một điểm đến phải nhất quán với thương hiệu đã định vị?', options: ['Vì luật quảng cáo yêu cầu', 'Vì thông điệp mâu thuẫn giữa các kênh (vd chiến dịch đẹp nhưng website lỗi thời) làm suy yếu cả thương hiệu và trải nghiệm khách', 'Vì mỗi kênh chỉ được phép dùng một màu sắc', 'Vì DMO chỉ được phép có một kênh truyền thông'], correctIndex: 1, explanation: 'Truyền thông tích hợp đòi hỏi mọi kênh kể cùng câu chuyện thương hiệu tới cùng phân khúc mục tiêu.' },
]);

const c7 = doc('ttm202-7-1-experience-stakeholder', '7.1 — Experience & stakeholder management at the destination|||7.1 — Quản trị trải nghiệm & các bên liên quan tại điểm đến',
  'Quản trị trải nghiệm khách qua các điểm chạm (touchpoints); hợp tác công-tư (PPP); vai trò cộng đồng địa phương; sức chứa điểm đến (carrying capacity).',
  [[
    `<span class="eyebrow">TTM202 · Chapter 7 · Lesson 7.1</span>
<h2>Experience &amp; stakeholder management at the destination</h2>
<h3>Managing the visitor experience across touchpoints</h3>
<p>A visitor's overall impression is the sum of many <strong>touchpoints</strong> — arrival, signage, staff interactions, attractions, digital info — often run by different, unrelated organizations. Experience management means auditing and improving that whole journey, not just the parts a DMO directly controls.</p>
<pre><code>Pre-trip -> Arrival -> On-site experience -> Departure -> Post-trip (reviews, return intent)
</code></pre>
<h3>Public-private partnership (PPP)</h3>
<p>Because infrastructure (public) and services (mostly private) both shape the experience, DMOs coordinate through <strong>PPP structures</strong> — joint funding of promotion campaigns, shared visitor-service standards, coordinated event calendars.</p>
<h3>Community involvement</h3>
<p>The local community is both a stakeholder and part of the product (hospitality, authenticity). Excluding residents from planning risks <strong>over-tourism backlash</strong> — protests, restrictions, reputational damage — which then damages the very brand the DMO built.</p>
<h3>Carrying capacity</h3>
<p>Every destination has a <strong>carrying capacity</strong> — the visitor volume it can host without degrading the experience, environment or resident quality of life. Managing demand (timed entry, seasonal pricing, visitor caps) is now a core DMO responsibility, not just attracting more visitors.</p>
<div class="callout"><span class="badge">Key idea</span> Stakeholder management is not a "soft" add-on — a destination that ignores residents or exceeds its carrying capacity eventually damages the brand that marketing spent years building.</div>`,
    `<span class="eyebrow">TTM202 · Chương 7 · Bài 7.1</span>
<h2>Quản trị trải nghiệm &amp; các bên liên quan tại điểm đến</h2>
<h3>Quản trị trải nghiệm khách qua các điểm chạm</h3>
<p>Ấn tượng tổng thể của du khách là tổng của nhiều <strong>điểm chạm (touchpoints)</strong> — lúc tới, chỉ dẫn, tương tác với nhân viên, điểm hấp dẫn, thông tin số — thường do các tổ chức khác nhau, không liên quan vận hành. Quản trị trải nghiệm nghĩa là soát xét và cải thiện toàn bộ hành trình đó, không chỉ phần DMO trực tiếp kiểm soát.</p>
<pre><code>Trước chuyến đi -> Lúc đến -> Trải nghiệm tại chỗ -> Lúc về -> Sau chuyến đi (đánh giá, ý định quay lại)
</code></pre>
<h3>Hợp tác công-tư (PPP)</h3>
<p>Vì hạ tầng (công) và dịch vụ (chủ yếu tư) cùng định hình trải nghiệm, DMO điều phối qua các <strong>cấu trúc PPP</strong> — đồng tài trợ chiến dịch xúc tiến, chuẩn dịch vụ khách chung, lịch sự kiện được phối hợp.</p>
<h3>Vai trò cộng đồng địa phương</h3>
<p>Cộng đồng địa phương vừa là một bên liên quan, vừa là một phần của sản phẩm (sự hiếu khách, tính chân thực). Loại cư dân khỏi việc quy hoạch có nguy cơ gây <strong>phản ứng do quá tải du lịch (over-tourism)</strong> — phản đối, hạn chế, tổn hại danh tiếng — điều này rồi lại làm hỏng chính thương hiệu DMO đã xây.</p>
<h3>Sức chứa điểm đến (carrying capacity)</h3>
<p>Mọi điểm đến có một <strong>sức chứa</strong> — lượng khách có thể tiếp nhận mà không làm suy giảm trải nghiệm, môi trường hay chất lượng sống của cư dân. Quản trị cầu (đặt giờ vào, giá theo mùa, hạn mức khách) nay là trách nhiệm cốt lõi của DMO, không chỉ là thu hút thêm khách.</p>
<div class="callout"><span class="badge">Ý chính</span> Quản trị bên liên quan không phải phần "phụ, mềm" — một điểm đến bỏ qua cư dân hoặc vượt sức chứa cuối cùng sẽ làm hỏng chính thương hiệu mà marketing đã tốn nhiều năm xây dựng.</div>`,
  ]]);

const c7q = quiz('ttm202-quiz-7', 'Quiz 7 — Trải nghiệm & bên liên quan|||Quiz 7 — Experience & stakeholders', [
  { id: 'q1', question: '"Touchpoint" trong quản trị trải nghiệm khách là gì?', options: ['Chỉ là quảng cáo trên mạng xã hội', 'Bất kỳ điểm tiếp xúc nào giữa khách và điểm đến (lúc tới, nhân viên, điểm hấp dẫn, thông tin số...)', 'Một loại visa du lịch', 'Tên gọi khác của DMO'], correctIndex: 1, explanation: 'Touchpoint là mọi điểm chạm trong hành trình khách, thường do nhiều tổ chức khác nhau vận hành.' },
  { id: 'q2', question: 'Vì sao loại cộng đồng địa phương khỏi quy hoạch điểm đến là rủi ro?', options: ['Không có rủi ro gì', 'Có thể gây phản ứng quá tải du lịch (phản đối, hạn chế) làm tổn hại thương hiệu điểm đến', 'Cộng đồng địa phương không phải bên liên quan', 'Chỉ ảnh hưởng tới doanh thu thuế, không ảnh hưởng thương hiệu'], correctIndex: 1, explanation: 'Cộng đồng vừa là bên liên quan vừa là một phần sản phẩm; loại họ ra dễ gây phản ứng làm hỏng thương hiệu.' },
  { id: 'q3', question: '"Carrying capacity" (sức chứa) của điểm đến là gì?', options: ['Số phòng khách sạn tối đa được xây', 'Lượng khách có thể tiếp nhận mà không làm suy giảm trải nghiệm, môi trường hay chất lượng sống cư dân', 'Ngân sách marketing tối đa mỗi năm', 'Số lượng DMO được phép hoạt động cùng lúc'], correctIndex: 1, explanation: 'Carrying capacity là ngưỡng lượng khách mà điểm đến chịu được không suy giảm chất lượng chung.' },
]);

const c8 = doc('ttm202-8-1-sustainability-performance-crisis', '8.1 — Sustainable destinations, performance measurement & crisis recovery|||8.1 — Điểm đến bền vững, đo lường hiệu quả & khủng hoảng/phục hồi',
  'Du lịch bền vững theo UNWTO; chỉ số đo hiệu quả marketing điểm đến (lượt khách, chi tiêu, mức hài lòng, tỷ lệ quay lại); quản trị khủng hoảng & marketing phục hồi.',
  [[
    `<span class="eyebrow">TTM202 · Chapter 8 · Lesson 8.1</span>
<h2>Sustainable destinations, performance measurement &amp; crisis recovery</h2>
<h3>Sustainable destination management (UNWTO)</h3>
<p>UNWTO defines sustainable tourism as meeting today's visitor and host-community needs while protecting the opportunity for the future — balancing three dimensions:</p>
<pre><code>Environmental -> protect natural/cultural resources the destination depends on
Economic      -> ensure tourism income benefits the local economy broadly
Social        -> protect resident quality of life and cultural integrity
</code></pre>
<h3>Measuring destination marketing performance</h3>
<ul>
<li><strong>Volume metrics</strong> — visitor arrivals, overnight stays, length of stay.</li>
<li><strong>Value metrics</strong> — visitor spend, yield per visitor (quality over quantity).</li>
<li><strong>Satisfaction &amp; loyalty</strong> — satisfaction scores, repeat-visit rate, net promoter score, online review sentiment.</li>
<li><strong>Brand health</strong> — awareness and perception tracking against competitor destinations.</li>
</ul>
<h3>Crisis management &amp; recovery marketing</h3>
<p>Destinations face shocks — natural disasters, pandemics, political instability, negative viral events. A DMO's crisis role has two phases:</p>
<pre><code>During crisis  -> accurate, transparent communication; visitor safety information; pause promotion that looks tone-deaf
After crisis   -> recovery marketing — rebuild confidence, often with domestic/nearby markets first, before international
</code></pre>
<div class="callout"><span class="badge">Bringing it together</span> Chapters 1–7 built the strategy (DMO, product, research, brand, mix, promotion, stakeholders); this closing chapter asks whether it actually works (measurement) and holds up under shocks (sustainability &amp; crisis recovery) — the two tests every real destination marketing plan must pass.</div>`,
    `<span class="eyebrow">TTM202 · Chương 8 · Bài 8.1</span>
<h2>Điểm đến bền vững, đo lường hiệu quả &amp; khủng hoảng/phục hồi</h2>
<h3>Quản trị điểm đến bền vững (UNWTO)</h3>
<p>UNWTO định nghĩa du lịch bền vững là đáp ứng nhu cầu của du khách và cộng đồng chủ nhà hiện tại mà vẫn bảo vệ cơ hội cho tương lai — cân bằng ba khía cạnh:</p>
<pre><code>Môi trường  -> bảo vệ tài nguyên tự nhiên/văn hoá mà điểm đến phụ thuộc vào
Kinh tế     -> đảm bảo thu nhập du lịch mang lại lợi ích rộng cho kinh tế địa phương
Xã hội      -> bảo vệ chất lượng sống cư dân và tính toàn vẹn văn hoá
</code></pre>
<h3>Đo lường hiệu quả marketing điểm đến</h3>
<ul>
<li><strong>Chỉ số lượng</strong> — lượt khách đến, số đêm lưu trú, thời gian lưu trú.</li>
<li><strong>Chỉ số giá trị</strong> — chi tiêu của khách, doanh thu trên mỗi khách (chất lượng hơn số lượng).</li>
<li><strong>Hài lòng &amp; trung thành</strong> — điểm hài lòng, tỷ lệ quay lại, net promoter score, sắc thái đánh giá trực tuyến.</li>
<li><strong>Sức khoẻ thương hiệu</strong> — theo dõi độ nhận biết & cảm nhận so với điểm đến cạnh tranh.</li>
</ul>
<h3>Quản trị khủng hoảng &amp; marketing phục hồi</h3>
<p>Điểm đến phải đối mặt các cú sốc — thiên tai, đại dịch, bất ổn chính trị, sự cố lan truyền tiêu cực. Vai trò của DMO trong khủng hoảng có hai giai đoạn:</p>
<pre><code>Trong khủng hoảng -> truyền thông chính xác, minh bạch; thông tin an toàn cho khách; dừng xúc tiến nếu không hợp thời điểm
Sau khủng hoảng   -> marketing phục hồi — xây lại niềm tin, thường ưu tiên thị trường nội địa/gần trước quốc tế
</code></pre>
<div class="callout"><span class="badge">Tổng kết môn</span> Chương 1–7 xây chiến lược (DMO, sản phẩm, nghiên cứu, thương hiệu, mix, xúc tiến, bên liên quan); chương cuối này hỏi liệu chiến lược đó có thực sự hiệu quả (đo lường) và có chịu được cú sốc (bền vững & phục hồi khủng hoảng) — hai bài kiểm mà mọi kế hoạch marketing điểm đến thật đều phải qua.</div>`,
  ]]);

const c8q = quiz('ttm202-quiz-8', 'Quiz 8 — Bền vững, đo hiệu quả & khủng hoảng|||Quiz 8 — Sustainability, performance & crisis', [
  { id: 'q1', question: 'Ba khía cạnh của du lịch bền vững theo UNWTO là gì?', options: ['Marketing, bán hàng, quảng cáo', 'Môi trường, kinh tế, xã hội', 'Quốc gia, vùng, địa phương', 'Product, Price, Place'], correctIndex: 1, explanation: 'UNWTO cân bằng ba khía cạnh: môi trường, kinh tế, xã hội.' },
  { id: 'q2', question: 'Vì sao "chi tiêu của khách" (chỉ số giá trị) quan trọng hơn chỉ đếm lượt khách?', options: ['Vì lượt khách không đo được', 'Vì hiệu quả marketing điểm đến cần cân đối cả giá trị (chất lượng) không chỉ số lượng khách', 'Vì chỉ số lượng khách luôn sai', 'Vì UNWTO cấm đo lượt khách'], correctIndex: 1, explanation: 'Đo hiệu quả cần cả khối lượng và giá trị — nhiều khách nhưng chi tiêu thấp có thể không tốt cho điểm đến.' },
  { id: 'q3', question: 'Trong khủng hoảng, DMO nên làm gì trước tiên?', options: ['Tăng ngay ngân sách quảng cáo quốc tế', 'Truyền thông chính xác, minh bạch và cung cấp thông tin an toàn cho khách', 'Ngừng hoàn toàn mọi hoạt động của DMO', 'Chuyển toàn bộ ngân sách sang xây thương hiệu mới'], correctIndex: 1, explanation: 'Giai đoạn trong khủng hoảng ưu tiên thông tin chính xác, minh bạch và an toàn; marketing phục hồi đến sau.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'TTM202',
    slug: 'ttm202-quan-tri-iem-en-v224-marketing',
    title: 'Destination Management and Marketing',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/TTM202.webp',
    shortDescription: 'Managing & marketing a destination — DMO roles, the destination product, market research & segmentation, destination branding, marketing mix (7Ps), digital promotion, stakeholder management, sustainability & crisis recovery.|||Quản trị & marketing một điểm đến — vai trò DMO, sản phẩm điểm đến, nghiên cứu thị trường & phân khúc, xây thương hiệu điểm đến, marketing mix (7Ps), xúc tiến số, quản trị bên liên quan, bền vững & phục hồi khủng hoảng.',
    description: 'Môn <strong>TTM202 — Destination Management and Marketing</strong> (khối Quản trị Kinh doanh, kỳ 5) tập trung vào <strong>quản trị và marketing điểm đến</strong> qua vai trò của <strong>DMO</strong> — khác <strong>TTM201</strong> (nhập môn tổng quan) và <strong>TTM203</strong> (hành vi tiêu dùng). Từ <strong>vai trò DMO</strong> → <strong>sản phẩm điểm đến &amp; chuỗi giá trị</strong> → <strong>nghiên cứu thị trường &amp; phân khúc</strong> → <strong>định vị &amp; thương hiệu điểm đến</strong> → <strong>marketing mix 7Ps</strong> → <strong>xúc tiến &amp; marketing số</strong> → <strong>quản trị trải nghiệm &amp; bên liên quan</strong> → <strong>bền vững, đo hiệu quả &amp; phục hồi khủng hoảng</strong>. Trích dẫn Kotler/Bowen/Makens, Pike, UNWTO; song ngữ, có khung lý thuyết và quiz mỗi chương.',
    whatYouLearn: 'Vai trò & cấp độ DMO (quốc gia/vùng/địa phương); sản phẩm điểm đến (6A của Buhalis) & chuỗi giá trị du lịch; nghiên cứu thị trường & phân khúc (nhân khẩu/địa lý/tâm lý/hành vi, mô hình Plog); định vị, brand identity vs. image, USP & brand equity; marketing mix 7Ps cho điểm đến; promotion mix & marketing số (mạng xã hội, influencer, SEO); quản trị trải nghiệm qua touchpoints, PPP, cộng đồng, sức chứa; du lịch bền vững UNWTO, đo hiệu quả marketing, quản trị khủng hoảng & marketing phục hồi.',
    requirements: 'Đã học TTM201 (nhập môn Du lịch) hoặc có kiến thức marketing căn bản. Xem điều kiện tiên quyết chính thức trong khung chương trình khối Quản trị Kinh doanh trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách Kotler/Bowen/Makens & Pike, tài liệu UNWTO, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Điểm đến, DMO, khác TTM201/TTM203, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan quản trị điểm đến & vai trò DMO|||Chapter 1 — Destination management overview & the DMO', description: 'Bên liên quan, cấp độ DMO, chức năng, quản trị vs. marketing.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Sản phẩm điểm đến & chuỗi giá trị du lịch|||Chapter 2 — Destination product & value chain', description: 'Khung 6A của Buhalis, chuỗi giá trị du lịch.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Nghiên cứu thị trường & phân khúc khách du lịch|||Chapter 3 — Market research & tourist segmentation', description: 'Phương pháp nghiên cứu, cơ sở phân khúc, mô hình Plog.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Định vị & xây dựng thương hiệu điểm đến|||Chapter 4 — Destination positioning & branding', description: 'Brand identity vs. image, câu định vị, USP, brand equity.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Chiến lược marketing & marketing mix điểm đến (7Ps)|||Chapter 5 — Marketing strategy & the 7Ps mix', description: 'STP, 7Ps áp dụng cho điểm đến.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Truyền thông, xúc tiến & marketing số điểm đến|||Chapter 6 — Communication, promotion & digital marketing', description: 'Promotion mix, mạng xã hội, influencer, SEO.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Quản trị trải nghiệm & các bên liên quan tại điểm đến|||Chapter 7 — Experience & stakeholder management', description: 'Touchpoints, PPP, cộng đồng, sức chứa.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Điểm đến bền vững, đo lường hiệu quả & khủng hoảng/phục hồi|||Chapter 8 — Sustainability, performance & crisis recovery', description: 'UNWTO bền vững, chỉ số hiệu quả, quản trị khủng hoảng.', lessons: [c8, c8q] },
  ],
};
