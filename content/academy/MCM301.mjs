/**
 * MCM301 — Marketing Channel Management (Quản trị kênh marketing / phân phối).
 * Khối Công nghệ Truyền thông FPTU, Kỳ 4. Môn KHÔNG có FLM syllabus → dựng theo
 * giáo trình chuẩn quốc tế: Coughlan/Anderson/Stern/El-Ansary "Marketing
 * Channels: A Management View"; Rosenbloom "Marketing Channels"; Kotler & Keller
 * "Marketing Management" (phần Place). 8 chương: kênh là gì (vai trò/chức năng/
 * dòng chảy) · cấu trúc & thiết kế · trung gian phân phối · quản trị thành viên
 * kênh · quyền lực & xung đột · kênh số & đa kênh · logistics & phân phối vật lý ·
 * xu hướng & đo lường. Mỗi chương = 1 DOCUMENT song ngữ EN+VI + 1 QUIZ 3 câu, có
 * ví dụ thương hiệu thật (Apple, Amazon, Coca-Cola, Warby Parker, Nike, Zara...).
 * Giữ NGUYÊN slug/semester(Kỳ4)/courseCode 'MCM301'/thumb(v3).
 * ⚠️ KHÔNG backtick lồng, KHÔNG ${ } trong chuỗi HTML; "&" trong text HTML là &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mcm301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Giáo trình chuẩn (Coughlan, Rosenbloom, Kotler phần Place), tài liệu HBR, công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">MCM301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Marketing Channel Management</strong> — how a product travels from producer to the end customer, and how firms design, run and measure those routes. This subject has no FLM syllabus, so it is built on the international standard textbooks below.</p>
<h3>📗 Core textbooks</h3>
<ul>
<li><strong>Coughlan, Anderson, Stern &amp; El-Ansary — <em>Marketing Channels: A Management View</em></strong> (Pearson) — the academic reference for channel structure, flows and design.</li>
<li><strong>Rosenbloom — <em>Marketing Channels: A Management View</em></strong> (Cengage) — strong on channel members, power &amp; conflict.</li>
<li><strong>Kotler &amp; Keller — <em>Marketing Management</em></strong> — the "Place" chapters give the 4Ps context.</li>
</ul>
<h3>🌐 Free / official reading</h3>
<ul>
<li><a href="https://hbr.org/topic/subject/distribution" target="_blank" rel="noopener">Harvard Business Review — Distribution &amp; channels</a></li>
<li><a href="https://www.investopedia.com/terms/d/distribution-channel.asp" target="_blank" rel="noopener">Investopedia — Distribution channel explained</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.google.com/analytics/" target="_blank" rel="noopener">Google Analytics</a> — track online channel performance.</li>
<li><a href="https://www.tableau.com/" target="_blank" rel="noopener">Tableau</a> — visualise sales-by-channel and coverage.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — what a channel is, the intermediary's role, channel functions and the 8 marketing flows.</li>
<li><strong>Design</strong> — number of levels, coverage intensity, direct vs indirect, and choosing intermediaries.</li>
<li><strong>Management</strong> — recruit, motivate, evaluate members; handle power and conflict; lead the channel.</li>
<li><strong>Modern &amp; measure</strong> — e-commerce, D2C, marketplaces, omnichannel, logistics and channel KPIs.</li>
</ol></div>`,
    `<span class="eyebrow">MCM301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Quản trị kênh marketing</strong> — sản phẩm đi từ nhà sản xuất tới khách hàng cuối thế nào, và doanh nghiệp thiết kế, vận hành, đo lường các tuyến đường đó ra sao. Môn này không có syllabus trên FLM nên được dựng theo các giáo trình chuẩn quốc tế dưới đây.</p>
<h3>📗 Giáo trình cốt lõi</h3>
<ul>
<li><strong>Coughlan, Anderson, Stern &amp; El-Ansary — <em>Marketing Channels: A Management View</em></strong> (Pearson) — tài liệu học thuật về cấu trúc, dòng chảy và thiết kế kênh.</li>
<li><strong>Rosenbloom — <em>Marketing Channels: A Management View</em></strong> (Cengage) — mạnh về thành viên kênh, quyền lực &amp; xung đột.</li>
<li><strong>Kotler &amp; Keller — <em>Marketing Management</em></strong> — các chương "Place" đặt kênh trong bối cảnh 4P.</li>
</ul>
<h3>🌐 Nguồn miễn phí / chính thức</h3>
<ul>
<li><a href="https://hbr.org/topic/subject/distribution" target="_blank" rel="noopener">Harvard Business Review — Phân phối &amp; kênh</a></li>
<li><a href="https://www.investopedia.com/terms/d/distribution-channel.asp" target="_blank" rel="noopener">Investopedia — Kênh phân phối là gì</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.google.com/analytics/" target="_blank" rel="noopener">Google Analytics</a> — theo dõi hiệu quả kênh online.</li>
<li><a href="https://www.tableau.com/" target="_blank" rel="noopener">Tableau</a> — trực quan hoá doanh số theo kênh và độ phủ.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — kênh là gì, vai trò trung gian, chức năng kênh và 8 dòng chảy marketing.</li>
<li><strong>Thiết kế</strong> — số cấp kênh, độ phủ, trực tiếp/gián tiếp, và chọn trung gian.</li>
<li><strong>Quản trị</strong> — tuyển, tạo động lực, đánh giá thành viên; xử lý quyền lực và xung đột; lãnh đạo kênh.</li>
<li><strong>Hiện đại &amp; đo lường</strong> — e-commerce, D2C, marketplace, omnichannel, logistics và KPI kênh.</li>
</ol></div>`,
  ]]);

const intro = doc('mcm301-0-1-overview', 'Course overview: Marketing channels|||Tổng quan: Kênh marketing',
  'Kênh phân phối là gì, vì sao "Place" là 1 trong 4P; lộ trình: kênh & dòng chảy → thiết kế → trung gian → quản trị → quyền lực/xung đột → kênh số → logistics → đo lường.',
  [[
    `<span class="eyebrow">MCM301 · Lesson 0.1 · Overview</span>
<h2>What is a marketing channel?</h2>
<p class="lead">A <strong>marketing channel</strong> (or distribution channel) is the set of organisations that make a product or service <strong>available for use or consumption</strong> — the path from producer to end customer. It answers the <strong>"Place"</strong> question in the 4Ps (Product, Price, Place, Promotion): a great product at a fair price still fails if the customer cannot buy it conveniently.</p>
<h3>Why channels matter</h3>
<ul>
<li><strong>Reach</strong> — a maker cannot personally meet every buyer; intermediaries extend reach cheaply.</li>
<li><strong>Convenience</strong> — customers get the right product, in the right place, at the right time.</li>
<li><strong>Efficiency</strong> — intermediaries reduce the number of contacts and carry inventory closer to demand.</li>
</ul>
<h3>Roadmap</h3>
<p>Channels &amp; flows → structure &amp; design (coverage, direct vs indirect) → intermediaries (wholesalers, retailers, agents) → managing members → power &amp; conflict → digital &amp; omnichannel → logistics → trends &amp; measurement. Bilingual, with real-brand examples (Apple, Amazon, Coca-Cola, Warby Parker) and a quiz per chapter.</p>`,
    `<span class="eyebrow">MCM301 · Bài 0.1 · Tổng quan</span>
<h2>Kênh marketing là gì?</h2>
<p class="lead">Một <strong>kênh marketing</strong> (hay kênh phân phối) là tập hợp các tổ chức giúp một sản phẩm/dịch vụ <strong>sẵn sàng để sử dụng hoặc tiêu dùng</strong> — con đường từ nhà sản xuất tới khách hàng cuối. Nó trả lời chữ <strong>"Place"</strong> trong 4P (Product, Price, Place, Promotion): một sản phẩm tốt, giá hợp lý vẫn thất bại nếu khách không mua được thuận tiện.</p>
<h3>Vì sao kênh quan trọng</h3>
<ul>
<li><strong>Độ phủ</strong> — nhà sản xuất không thể tự gặp mọi người mua; trung gian mở rộng độ phủ với chi phí thấp.</li>
<li><strong>Sự tiện lợi</strong> — khách có đúng sản phẩm, đúng nơi, đúng lúc.</li>
<li><strong>Hiệu quả</strong> — trung gian giảm số lần tiếp xúc và trữ hàng gần cầu hơn.</li>
</ul>
<h3>Lộ trình</h3>
<p>Kênh &amp; dòng chảy → cấu trúc &amp; thiết kế (độ phủ, trực tiếp/gián tiếp) → trung gian (bán buôn, bán lẻ, đại lý) → quản trị thành viên → quyền lực &amp; xung đột → kênh số &amp; đa kênh → logistics → xu hướng &amp; đo lường. Song ngữ, có ví dụ thương hiệu thật (Apple, Amazon, Coca-Cola, Warby Parker) và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('mcm301-1-1-channels-flows', '1.1 — Channels, intermediary role & flows|||1.1 — Kênh, vai trò trung gian & dòng chảy',
  'Vai trò trung gian (giảm số lần tiếp xúc), chức năng kênh (mua/bán, trữ hàng, vận chuyển, chia sẻ rủi ro, thông tin), và 8 dòng chảy kênh.',
  [[
    `<span class="eyebrow">MCM301 · Chapter 1 · Lesson 1.1</span>
<h2>Channels, the intermediary role &amp; channel flows</h2>
<h3>Why intermediaries exist</h3>
<p>Intermediaries cut the number of contacts. With <strong>3 makers</strong> selling to <strong>3 shops</strong> directly you need <strong>3×3 = 9</strong> contacts; add <strong>one distributor</strong> in the middle and it drops to <strong>3 + 3 = 6</strong>. The more players, the bigger the saving — this is the core economic reason channels form.</p>
<h3>Channel functions</h3>
<ul>
<li><strong>Transactional</strong> — buying, selling, and risk-bearing (holding stock that may not sell).</li>
<li><strong>Logistical</strong> — assorting, storing, and transporting goods to where demand is.</li>
<li><strong>Facilitating</strong> — financing, grading, and gathering market information.</li>
</ul>
<h3>The eight marketing flows</h3>
<pre><code>Producer &lt;----&gt; Intermediaries &lt;----&gt; Customer
 Forward : physical possession, ownership, promotion
 Backward: ordering, payment
 Both ways: negotiation, financing, risk
</code></pre>
<p>Some flows move <strong>forward</strong> (product, ownership, promotion), some <strong>backward</strong> (orders, payment), some <strong>both ways</strong> (negotiation, financing, risk). Every channel member performs some of these flows — and should be paid for the ones they do.</p>
<div class="callout"><span class="badge">Coca-Cola</span> Coca-Cola makes concentrate, but a vast network of <strong>bottlers, wholesalers and retailers</strong> performs the physical, ownership and promotion flows so a chilled can is within arm's reach almost anywhere on earth.</div>`,
    `<span class="eyebrow">MCM301 · Chương 1 · Bài 1.1</span>
<h2>Kênh, vai trò trung gian &amp; dòng chảy kênh</h2>
<h3>Vì sao có trung gian</h3>
<p>Trung gian cắt giảm số lần tiếp xúc. Với <strong>3 nhà sản xuất</strong> bán cho <strong>3 cửa hàng</strong> trực tiếp, bạn cần <strong>3×3 = 9</strong> lần tiếp xúc; thêm <strong>một nhà phân phối</strong> ở giữa thì còn <strong>3 + 3 = 6</strong>. Càng nhiều bên, mức tiết kiệm càng lớn — đây là lý do kinh tế cốt lõi khiến kênh hình thành.</p>
<h3>Chức năng của kênh</h3>
<ul>
<li><strong>Giao dịch</strong> — mua, bán, và gánh rủi ro (trữ hàng có thể không bán được).</li>
<li><strong>Hậu cần</strong> — phân loại, lưu kho, và vận chuyển hàng tới nơi có cầu.</li>
<li><strong>Hỗ trợ</strong> — tài trợ vốn, phân hạng, và thu thập thông tin thị trường.</li>
</ul>
<h3>Tám dòng chảy marketing</h3>
<pre><code>Nhà sản xuất &lt;----&gt; Trung gian &lt;----&gt; Khách hàng
 Xuôi : sở hữu vật lý, quyền sở hữu, xúc tiến
 Ngược: đặt hàng, thanh toán
 Hai chiều: đàm phán, tài trợ, rủi ro
</code></pre>
<p>Một số dòng chảy đi <strong>xuôi</strong> (sản phẩm, quyền sở hữu, xúc tiến), một số đi <strong>ngược</strong> (đơn hàng, thanh toán), một số đi <strong>hai chiều</strong> (đàm phán, tài trợ, rủi ro). Mỗi thành viên kênh đảm nhận một số dòng chảy — và nên được trả công cho phần mình làm.</p>
<div class="callout"><span class="badge">Coca-Cola</span> Coca-Cola sản xuất siro cô đặc, nhưng một mạng lưới khổng lồ <strong>nhà đóng chai, bán buôn và bán lẻ</strong> thực hiện các dòng chảy vật lý, sở hữu và xúc tiến để một lon nước ngọt mát lạnh luôn nằm trong tầm tay ở gần như mọi nơi trên Trái Đất.</div>`,
  ]]);

const c1q = quiz('mcm301-quiz-1', 'Quiz 1 — Channels & flows|||Quiz 1 — Kênh & dòng chảy', [
  { id: 'q1', question: 'Lý do kinh tế cốt lõi để có trung gian trong kênh là?|||The core economic reason for intermediaries in a channel is?', options: ['Tăng giá bán|||Raise the selling price', 'Giảm số lần tiếp xúc giữa người mua và người bán|||Reduce the number of contacts between buyers and sellers', 'Loại bỏ nhà sản xuất|||Eliminate the producer', 'Bỏ khâu vận chuyển|||Remove transport'], correctIndex: 1, explanation: 'Trung gian giảm số lần tiếp xúc (vd 9 → 6), tiết kiệm chi phí.' },
  { id: 'q2', question: 'Dòng chảy "thanh toán" (payment) trong kênh đi theo chiều nào?|||The "payment" flow in a channel moves in which direction?', options: ['Xuôi (nhà sản xuất → khách)|||Forward (producer → customer)', 'Ngược (khách → nhà sản xuất)|||Backward (customer → producer)', 'Không di chuyển|||It does not move', 'Chỉ trong kho|||Only inside the warehouse'], correctIndex: 1, explanation: 'Đặt hàng và thanh toán là dòng chảy ngược, từ khách về nhà sản xuất.' },
  { id: 'q3', question: 'Đâu là một CHỨC NĂNG hậu cần (logistical) của kênh?|||Which is a LOGISTICAL channel function?', options: ['Gánh rủi ro tồn kho|||Bearing inventory risk', 'Lưu kho và vận chuyển hàng|||Storing and transporting goods', 'Tài trợ vốn|||Providing financing', 'Đàm phán giá|||Negotiating price'], correctIndex: 1, explanation: 'Phân loại, lưu kho, vận chuyển là chức năng hậu cần; rủi ro/tài trợ là giao dịch/hỗ trợ.' },
]);

const c2 = doc('mcm301-2-1-structure-design', '2.1 — Channel structure & design|||2.1 — Cấu trúc & thiết kế kênh',
  'Số cấp kênh (0/1/2 cấp), độ phủ (intensive/selective/exclusive), kênh trực tiếp vs gián tiếp; ví dụ Apple, Rolex, hàng tiêu dùng nhanh.',
  [[
    `<span class="eyebrow">MCM301 · Chapter 2 · Lesson 2.1</span>
<h2>Channel structure &amp; design</h2>
<h3>Channel levels</h3>
<pre><code>0-level (direct): Producer -----------------&gt; Customer
1-level         : Producer -&gt; Retailer -----&gt; Customer
2-level         : Producer -&gt; Wholesaler -&gt; Retailer -&gt; Customer
</code></pre>
<p>The number of intermediaries between producer and customer is the channel's <strong>length</strong>. Fewer levels = more control and margin but more work; more levels = wider reach but less control.</p>
<h3>Distribution intensity — how many outlets?</h3>
<ul>
<li><strong>Intensive</strong> — as many outlets as possible. Right for cheap, frequent, convenience goods (Coca-Cola, chewing gum).</li>
<li><strong>Selective</strong> — a curated set of qualified outlets. Right for shopping goods (Nike, mid-range electronics).</li>
<li><strong>Exclusive</strong> — one or very few outlets per area. Right for luxury/high-service goods (Rolex, luxury cars) to protect brand image and service.</li>
</ul>
<h3>Direct vs indirect</h3>
<p><strong>Direct</strong> means the producer sells straight to the customer (own stores, own website). <strong>Indirect</strong> uses intermediaries. Many firms run <strong>both</strong>.</p>
<div class="callout"><span class="badge">Apple</span> Apple mixes channels deliberately: <strong>direct</strong> (Apple Store, apple.com) for control and experience, plus <strong>selective indirect</strong> (authorised resellers, telecom carriers) for reach — never intensive, to protect the premium image.</div>`,
    `<span class="eyebrow">MCM301 · Chương 2 · Bài 2.1</span>
<h2>Cấu trúc &amp; thiết kế kênh</h2>
<h3>Số cấp kênh</h3>
<pre><code>0 cấp (trực tiếp): Nhà SX -----------------&gt; Khách
1 cấp           : Nhà SX -&gt; Bán lẻ --------&gt; Khách
2 cấp           : Nhà SX -&gt; Bán buôn -&gt; Bán lẻ -&gt; Khách
</code></pre>
<p>Số trung gian giữa nhà sản xuất và khách là <strong>độ dài</strong> của kênh. Ít cấp = nhiều kiểm soát và biên lợi nhuận nhưng nhiều việc hơn; nhiều cấp = độ phủ rộng nhưng ít kiểm soát.</p>
<h3>Độ phủ phân phối — bao nhiêu điểm bán?</h3>
<ul>
<li><strong>Đại trà (intensive)</strong> — càng nhiều điểm bán càng tốt. Hợp với hàng rẻ, mua thường xuyên (Coca-Cola, kẹo cao su).</li>
<li><strong>Chọn lọc (selective)</strong> — một nhóm điểm bán đủ điều kiện, được tuyển. Hợp với hàng mua có cân nhắc (Nike, điện tử tầm trung).</li>
<li><strong>Độc quyền (exclusive)</strong> — một hoặc rất ít điểm bán mỗi khu vực. Hợp với hàng xa xỉ/dịch vụ cao (Rolex, xe sang) để bảo vệ hình ảnh và dịch vụ.</li>
</ul>
<h3>Trực tiếp vs gián tiếp</h3>
<p><strong>Trực tiếp</strong> là nhà sản xuất bán thẳng cho khách (cửa hàng riêng, website riêng). <strong>Gián tiếp</strong> dùng trung gian. Nhiều hãng chạy <strong>cả hai</strong>.</p>
<div class="callout"><span class="badge">Apple</span> Apple phối kênh có chủ đích: <strong>trực tiếp</strong> (Apple Store, apple.com) để kiểm soát và tạo trải nghiệm, cộng <strong>gián tiếp chọn lọc</strong> (đại lý uỷ quyền, nhà mạng) để mở rộng — không bao giờ đại trà, nhằm giữ hình ảnh cao cấp.</div>`,
  ]]);

const c2q = quiz('mcm301-quiz-2', 'Quiz 2 — Structure & design|||Quiz 2 — Cấu trúc & thiết kế', [
  { id: 'q1', question: 'Kênh "0 cấp" (zero-level) nghĩa là?|||A "zero-level" channel means?', options: ['Có 2 trung gian|||Two intermediaries', 'Nhà sản xuất bán trực tiếp cho khách, không trung gian|||Producer sells directly to the customer, no intermediaries', 'Không có khách hàng|||No customers', 'Chỉ bán buôn|||Wholesale only'], correctIndex: 1, explanation: 'Kênh 0 cấp = kênh trực tiếp, không có trung gian giữa nhà SX và khách.' },
  { id: 'q2', question: 'Độ phủ nào phù hợp nhất cho đồng hồ Rolex?|||Which coverage intensity best fits Rolex watches?', options: ['Đại trà (intensive)|||Intensive', 'Độc quyền (exclusive)|||Exclusive', 'Không phân phối|||No distribution', 'Chọn lọc rộng khắp mọi siêu thị|||Selective across every supermarket'], correctIndex: 1, explanation: 'Hàng xa xỉ dùng phân phối độc quyền để bảo vệ hình ảnh và dịch vụ.' },
  { id: 'q3', question: 'Hàng tiêu dùng nhanh như Coca-Cola thường dùng độ phủ nào?|||Fast-moving goods like Coca-Cola typically use which coverage?', options: ['Đại trà (intensive) — càng nhiều điểm bán càng tốt|||Intensive — as many outlets as possible', 'Độc quyền|||Exclusive', 'Chỉ bán online|||Online only', 'Một cửa hàng duy nhất|||A single store'], correctIndex: 0, explanation: 'Hàng tiện lợi, mua thường xuyên cần độ phủ đại trà.' },
]);

const c3 = doc('mcm301-3-1-intermediaries', '3.1 — Distribution intermediaries|||3.1 — Trung gian phân phối',
  'Nhà bán buôn, bán lẻ, đại lý, môi giới — chức năng và khác biệt (ai nắm quyền sở hữu hàng, ai chỉ kết nối).',
  [[
    `<span class="eyebrow">MCM301 · Chapter 3 · Lesson 3.1</span>
<h2>Distribution intermediaries</h2>
<p>Not all intermediaries are the same. The key distinction: <strong>who takes ownership (title) of the goods</strong>?</p>
<h3>Merchants — take title</h3>
<ul>
<li><strong>Wholesalers</strong> — buy in bulk from producers, break bulk, and resell to retailers or businesses (not to end consumers). They carry stock and bear risk. Example: <strong>Sysco</strong> supplying restaurants.</li>
<li><strong>Retailers</strong> — buy and sell to the <strong>final consumer</strong>. Formats range from hypermarkets (Walmart) to convenience stores, specialty stores and pure e-tailers.</li>
</ul>
<h3>Agents &amp; brokers — do NOT take title</h3>
<ul>
<li><strong>Agents</strong> — represent a buyer or seller on an ongoing basis, earn commission, never own the goods (e.g. a manufacturer's sales agent).</li>
<li><strong>Brokers</strong> — bring buyer and seller together for a single deal, earn a fee, never own the goods (e.g. a real-estate or insurance broker).</li>
</ul>
<pre><code>Takes ownership?   Yes -> Merchant (wholesaler, retailer)
                   No  -> Agent / Broker (commission or fee only)
</code></pre>
<div class="callout"><span class="badge">Amazon wears two hats</span> Amazon is a <strong>retailer</strong> when it buys and resells its own inventory, but a <strong>marketplace agent</strong> when third-party sellers list on its platform — Amazon never owns those goods, it just connects and takes a fee.</div>`,
    `<span class="eyebrow">MCM301 · Chương 3 · Bài 3.1</span>
<h2>Trung gian phân phối</h2>
<p>Không phải mọi trung gian đều giống nhau. Điểm phân biệt then chốt: <strong>ai nắm quyền sở hữu (title) hàng hoá</strong>?</p>
<h3>Nhà buôn — CÓ nắm quyền sở hữu</h3>
<ul>
<li><strong>Nhà bán buôn</strong> — mua số lượng lớn từ nhà sản xuất, chia nhỏ, và bán lại cho nhà bán lẻ hoặc doanh nghiệp (không bán cho người tiêu dùng cuối). Họ trữ hàng và gánh rủi ro. Ví dụ: <strong>Sysco</strong> cung ứng cho nhà hàng.</li>
<li><strong>Nhà bán lẻ</strong> — mua và bán cho <strong>người tiêu dùng cuối</strong>. Định dạng từ đại siêu thị (Walmart) tới cửa hàng tiện lợi, cửa hàng chuyên doanh và nhà bán online thuần tuý.</li>
</ul>
<h3>Đại lý &amp; môi giới — KHÔNG nắm quyền sở hữu</h3>
<ul>
<li><strong>Đại lý (agent)</strong> — đại diện cho bên mua hoặc bán một cách lâu dài, hưởng hoa hồng, không sở hữu hàng (vd đại lý bán hàng của nhà sản xuất).</li>
<li><strong>Môi giới (broker)</strong> — kết nối người mua và người bán cho một thương vụ, hưởng phí, không sở hữu hàng (vd môi giới bất động sản hoặc bảo hiểm).</li>
</ul>
<pre><code>Có nắm sở hữu?   Có     -> Nhà buôn (bán buôn, bán lẻ)
                 Không  -> Đại lý / Môi giới (chỉ hoa hồng hoặc phí)
</code></pre>
<div class="callout"><span class="badge">Amazon đội hai mũ</span> Amazon là <strong>nhà bán lẻ</strong> khi mua và bán lại hàng của chính mình, nhưng là <strong>đại lý sàn (marketplace)</strong> khi người bán thứ ba đăng bán trên nền tảng — Amazon không sở hữu hàng đó, chỉ kết nối và thu phí.</div>`,
  ]]);

const c3q = quiz('mcm301-quiz-3', 'Quiz 3 — Intermediaries|||Quiz 3 — Trung gian', [
  { id: 'q1', question: 'Điểm phân biệt then chốt giữa nhà buôn và đại lý/môi giới là?|||The key distinction between merchants and agents/brokers is?', options: ['Quy mô công ty|||Company size', 'Ai nắm quyền sở hữu (title) hàng hoá|||Who takes ownership (title) of the goods', 'Màu logo|||Logo colour', 'Số nhân viên|||Number of employees'], correctIndex: 1, explanation: 'Nhà buôn nắm sở hữu hàng; đại lý/môi giới thì không, chỉ hưởng hoa hồng/phí.' },
  { id: 'q2', question: 'Nhà bán buôn (wholesaler) KHÁC nhà bán lẻ ở chỗ?|||A wholesaler differs from a retailer in that?', options: ['Bán cho nhà bán lẻ/doanh nghiệp, không bán cho người tiêu dùng cuối|||Sells to retailers/businesses, not to final consumers', 'Chỉ bán online|||Only sells online', 'Không bao giờ trữ hàng|||Never holds stock', 'Không tính tiền|||Charges nothing'], correctIndex: 0, explanation: 'Bán buôn mua lớn, chia nhỏ, bán cho bán lẻ/doanh nghiệp; bán lẻ bán cho người tiêu dùng cuối.' },
  { id: 'q3', question: 'Khi người bán thứ ba đăng hàng trên Amazon Marketplace, Amazon đóng vai?|||When third-party sellers list on Amazon Marketplace, Amazon acts as?', options: ['Nhà bán buôn sở hữu hàng|||A wholesaler that owns the goods', 'Đại lý sàn — kết nối và thu phí, không sở hữu hàng|||A marketplace agent — connects and takes a fee, does not own the goods', 'Nhà sản xuất|||A manufacturer', 'Môi giới bất động sản|||A real-estate broker'], correctIndex: 1, explanation: 'Với hàng bên thứ ba, Amazon là đại lý sàn: kết nối, thu phí, không nắm sở hữu.' },
]);

const c4 = doc('mcm301-4-1-managing-members', '4.1 — Managing channel members|||4.1 — Quản trị thành viên kênh',
  'Tuyển chọn thành viên (tiêu chí), tạo động lực (chiết khấu, hỗ trợ, hợp tác), đánh giá (KPI), và hỗ trợ (đào tạo, marketing).',
  [[
    `<span class="eyebrow">MCM301 · Chapter 4 · Lesson 4.1</span>
<h2>Managing channel members</h2>
<p>Choosing a channel is not enough — members must be <strong>selected, motivated, evaluated and supported</strong> over time.</p>
<h3>Select</h3>
<p>Screen candidates on criteria: financial strength, market coverage, product-line fit, reputation, and sales capability. A weak partner damages the brand; a strong one is worth courting.</p>
<h3>Motivate</h3>
<ul>
<li><strong>Trade discounts &amp; margins</strong> — the basic incentive to stock and push the product.</li>
<li><strong>Co-op advertising, training, tools</strong> — help partners sell more, not just buy more.</li>
<li><strong>Partnership / relationship</strong> — long-term collaboration beats one-off coercion.</li>
</ul>
<h3>Evaluate</h3>
<p>Track member performance against KPIs: sales quotas, average inventory, delivery time to customers, handling of damaged goods, and service quality. Reward the strong; coach or replace the weak.</p>
<h3>Support</h3>
<p>Provide training, marketing materials, demo stock and after-sales backup so members can represent the brand well.</p>
<div class="callout"><span class="badge">Nike SNKRS &amp; partners</span> Nike selects retail partners carefully, funds in-store experiences and training, sets sell-through targets, and prunes partners that don't meet standards — a textbook select-motivate-evaluate loop.</div>`,
    `<span class="eyebrow">MCM301 · Chương 4 · Bài 4.1</span>
<h2>Quản trị thành viên kênh</h2>
<p>Chọn được kênh chưa đủ — thành viên phải được <strong>tuyển chọn, tạo động lực, đánh giá và hỗ trợ</strong> theo thời gian.</p>
<h3>Tuyển chọn</h3>
<p>Sàng lọc ứng viên theo tiêu chí: năng lực tài chính, độ phủ thị trường, mức phù hợp dòng sản phẩm, uy tín, và năng lực bán hàng. Một đối tác yếu làm hại thương hiệu; một đối tác mạnh đáng để mời gọi.</p>
<h3>Tạo động lực</h3>
<ul>
<li><strong>Chiết khấu &amp; biên lợi nhuận</strong> — động lực cơ bản để nhập và đẩy sản phẩm.</li>
<li><strong>Quảng cáo hợp tác, đào tạo, công cụ</strong> — giúp đối tác bán được nhiều hơn, không chỉ nhập nhiều hơn.</li>
<li><strong>Quan hệ đối tác</strong> — hợp tác dài hạn hơn hẳn việc ép buộc từng lần.</li>
</ul>
<h3>Đánh giá</h3>
<p>Theo dõi hiệu quả thành viên theo KPI: chỉ tiêu doanh số, tồn kho trung bình, thời gian giao tới khách, cách xử lý hàng hỏng, và chất lượng dịch vụ. Thưởng người mạnh; huấn luyện hoặc thay người yếu.</p>
<h3>Hỗ trợ</h3>
<p>Cung cấp đào tạo, vật phẩm marketing, hàng trưng bày và hỗ trợ sau bán để thành viên đại diện thương hiệu tốt.</p>
<div class="callout"><span class="badge">Nike SNKRS &amp; đối tác</span> Nike chọn đối tác bán lẻ kỹ càng, tài trợ trải nghiệm tại cửa hàng và đào tạo, đặt mục tiêu bán ra, và loại bỏ đối tác không đạt chuẩn — một vòng tuyển-động lực-đánh giá mẫu mực.</div>`,
  ]]);

const c4q = quiz('mcm301-quiz-4', 'Quiz 4 — Managing members|||Quiz 4 — Quản trị thành viên', [
  { id: 'q1', question: 'Đâu KHÔNG phải tiêu chí thường dùng khi TUYỂN CHỌN thành viên kênh?|||Which is NOT a common criterion when SELECTING channel members?', options: ['Năng lực tài chính|||Financial strength', 'Độ phủ thị trường|||Market coverage', 'Màu sơn văn phòng đối tác|||The paint colour of the partner office', 'Uy tín và năng lực bán hàng|||Reputation and sales capability'], correctIndex: 2, explanation: 'Tuyển chọn dựa trên tài chính, độ phủ, uy tín, năng lực bán — không phải màu sơn.' },
  { id: 'q2', question: 'Cách tạo động lực BỀN VỮNG nhất cho thành viên kênh là?|||The most sustainable way to motivate channel members is?', options: ['Ép buộc và phạt liên tục|||Constant coercion and penalties', 'Quan hệ đối tác hợp tác dài hạn (chiết khấu, đào tạo, hỗ trợ)|||Long-term partnership (discounts, training, support)', 'Không liên lạc|||No communication', 'Giảm biên lợi nhuận của họ|||Cutting their margins'], correctIndex: 1, explanation: 'Hợp tác dài hạn với hỗ trợ và động lực hơn hẳn ép buộc từng lần.' },
  { id: 'q3', question: 'Khi ĐÁNH GIÁ thành viên kênh, chỉ số nào là hợp lý?|||When EVALUATING a channel member, which metric is appropriate?', options: ['Đạt chỉ tiêu doanh số và thời gian giao hàng|||Meeting sales quotas and delivery time', 'Số lượng cây xanh trước cửa hàng|||Number of trees outside the store', 'Tuổi của giám đốc|||The age of the manager', 'Màu bao bì|||Packaging colour'], correctIndex: 0, explanation: 'Đánh giá theo KPI: doanh số, tồn kho, thời gian giao, chất lượng dịch vụ.' },
]);

const c5 = doc('mcm301-5-1-power-conflict', '5.1 — Channel power & conflict|||5.1 — Quyền lực & xung đột trong kênh',
  'Nguồn quyền lực (reward/coercive/legitimate/expert/referent), xung đột dọc vs ngang, hợp tác, và lãnh đạo kênh (channel captain).',
  [[
    `<span class="eyebrow">MCM301 · Chapter 5 · Lesson 5.1</span>
<h2>Channel power &amp; conflict</h2>
<h3>Sources of channel power</h3>
<p>Power is the ability of one member to influence another. Five classic sources:</p>
<ul>
<li><strong>Reward</strong> — offer higher margins, bonuses, exclusive territory.</li>
<li><strong>Coercive</strong> — threaten to cut supply, slow shipments, or drop the partner.</li>
<li><strong>Legitimate</strong> — contractual rights the other side agreed to.</li>
<li><strong>Expert</strong> — superior know-how (training, data, systems) the partner needs.</li>
<li><strong>Referent</strong> — a brand so desirable that partners want to be associated with it.</li>
</ul>
<h3>Types of conflict</h3>
<ul>
<li><strong>Vertical</strong> — between different levels (a manufacturer vs its retailer, e.g. over price).</li>
<li><strong>Horizontal</strong> — between members at the same level (two retailers of the same brand undercutting each other).</li>
<li><strong>Multichannel</strong> — the firm's own website competing with its retail partners for the same customer.</li>
</ul>
<h3>Leading the channel</h3>
<p>A <strong>channel captain</strong> — the most powerful member — coordinates the others toward shared goals. Cooperation, clear roles and fair rewards resolve conflict better than raw coercion.</p>
<div class="callout"><span class="badge">Referent power</span> Apple's brand is so wanted that carriers and resellers accept strict terms just to sell it — pure <strong>referent + expert</strong> power, no threats needed.</div>`,
    `<span class="eyebrow">MCM301 · Chương 5 · Bài 5.1</span>
<h2>Quyền lực &amp; xung đột trong kênh</h2>
<h3>Nguồn quyền lực kênh</h3>
<p>Quyền lực là khả năng một thành viên tác động lên thành viên khác. Năm nguồn kinh điển:</p>
<ul>
<li><strong>Thưởng (reward)</strong> — cho biên lợi nhuận cao hơn, thưởng, lãnh thổ độc quyền.</li>
<li><strong>Ép buộc (coercive)</strong> — doạ cắt nguồn cung, giao hàng chậm, hoặc loại đối tác.</li>
<li><strong>Chính danh (legitimate)</strong> — quyền theo hợp đồng mà bên kia đã đồng ý.</li>
<li><strong>Chuyên môn (expert)</strong> — bí quyết vượt trội (đào tạo, dữ liệu, hệ thống) mà đối tác cần.</li>
<li><strong>Tham chiếu (referent)</strong> — thương hiệu hấp dẫn tới mức đối tác muốn được gắn tên vào.</li>
</ul>
<h3>Các loại xung đột</h3>
<ul>
<li><strong>Dọc (vertical)</strong> — giữa các cấp khác nhau (nhà sản xuất vs nhà bán lẻ, vd về giá).</li>
<li><strong>Ngang (horizontal)</strong> — giữa các thành viên cùng cấp (hai nhà bán lẻ cùng thương hiệu phá giá nhau).</li>
<li><strong>Đa kênh (multichannel)</strong> — website của chính hãng cạnh tranh với đối tác bán lẻ cho cùng một khách.</li>
</ul>
<h3>Lãnh đạo kênh</h3>
<p>Một <strong>thủ lĩnh kênh (channel captain)</strong> — thành viên mạnh nhất — điều phối các bên còn lại hướng tới mục tiêu chung. Hợp tác, vai trò rõ ràng và phần thưởng công bằng giải quyết xung đột tốt hơn ép buộc thô.</p>
<div class="callout"><span class="badge">Quyền lực tham chiếu</span> Thương hiệu Apple được ưa chuộng tới mức nhà mạng và đại lý chấp nhận điều khoản khắt khe chỉ để được bán — quyền lực <strong>tham chiếu + chuyên môn</strong> thuần tuý, không cần doạ dẫm.</div>`,
  ]]);

const c5q = quiz('mcm301-quiz-5', 'Quiz 5 — Power & conflict|||Quiz 5 — Quyền lực & xung đột', [
  { id: 'q1', question: 'Hai nhà bán lẻ cùng bán một thương hiệu phá giá lẫn nhau là xung đột?|||Two retailers of the same brand undercutting each other is which conflict?', options: ['Xung đột dọc (vertical)|||Vertical conflict', 'Xung đột ngang (horizontal)|||Horizontal conflict', 'Không phải xung đột|||Not a conflict', 'Xung đột nội bộ nhà máy|||Internal factory conflict'], correctIndex: 1, explanation: 'Cùng một cấp trong kênh → xung đột ngang.' },
  { id: 'q2', question: 'Nguồn quyền lực dựa trên "doạ cắt nguồn cung hoặc loại đối tác" gọi là?|||Power based on "threatening to cut supply or drop the partner" is called?', options: ['Quyền lực thưởng (reward)|||Reward power', 'Quyền lực ép buộc (coercive)|||Coercive power', 'Quyền lực tham chiếu (referent)|||Referent power', 'Quyền lực chuyên môn (expert)|||Expert power'], correctIndex: 1, explanation: 'Doạ dẫm/trừng phạt là quyền lực ép buộc (coercive).' },
  { id: 'q3', question: '"Channel captain" (thủ lĩnh kênh) là?|||A "channel captain" is?', options: ['Khách hàng cuối|||The final customer', 'Thành viên mạnh nhất điều phối cả kênh hướng tới mục tiêu chung|||The most powerful member coordinating the channel toward shared goals', 'Người giao hàng|||The delivery driver', 'Cơ quan quản lý nhà nước|||A government regulator'], correctIndex: 1, explanation: 'Channel captain là thành viên có quyền lực nhất, dẫn dắt và điều phối kênh.' },
]);

const c6 = doc('mcm301-6-1-digital-omnichannel', '6.1 — Digital & multichannel|||6.1 — Kênh số & đa kênh',
  'E-commerce, D2C, marketplace, omnichannel; sự khác nhau multichannel vs omnichannel; ví dụ Warby Parker, Nespresso, Amazon.',
  [[
    `<span class="eyebrow">MCM301 · Chapter 6 · Lesson 6.1</span>
<h2>Digital &amp; multichannel</h2>
<h3>New routes to market</h3>
<ul>
<li><strong>E-commerce</strong> — selling through a website or app.</li>
<li><strong>D2C (direct-to-consumer)</strong> — the maker sells straight to customers online, skipping wholesalers and retailers to own the relationship and the data.</li>
<li><strong>Marketplace</strong> — third-party platforms (Amazon, Shopee, Etsy) where many sellers reach a huge shared audience.</li>
</ul>
<h3>Multichannel vs omnichannel</h3>
<p><strong>Multichannel</strong> = several channels that operate <em>separately</em> (the website, the app and the store each run their own way). <strong>Omnichannel</strong> = the same channels <em>integrated</em> into one seamless experience: buy online, pick up in store; check store stock on the app; returns handled anywhere.</p>
<pre><code>Multichannel : Web | App | Store   (silos)
Omnichannel  : Web + App + Store    (one journey, shared cart/stock/data)
</code></pre>
<h3>Why D2C exploded</h3>
<p>Lower barriers (Shopify, ads, fulfilment services) let brands bypass gatekeepers, keep margin, and learn directly from customer data.</p>
<div class="callout"><span class="badge">Warby Parker &amp; Nespresso</span> <strong>Warby Parker</strong> launched D2C online (home try-on kit), then added its own stores — omnichannel by design. <strong>Nespresso</strong> sells coffee direct via its Club, boutiques and app, tightly controlling brand and repeat orders.</div>`,
    `<span class="eyebrow">MCM301 · Chương 6 · Bài 6.1</span>
<h2>Kênh số &amp; đa kênh</h2>
<h3>Các tuyến ra thị trường mới</h3>
<ul>
<li><strong>Thương mại điện tử (e-commerce)</strong> — bán qua website hoặc ứng dụng.</li>
<li><strong>D2C (trực tiếp tới người tiêu dùng)</strong> — nhà sản xuất bán thẳng cho khách online, bỏ qua bán buôn và bán lẻ để nắm quan hệ và dữ liệu.</li>
<li><strong>Marketplace (sàn)</strong> — nền tảng bên thứ ba (Amazon, Shopee, Etsy) nơi nhiều người bán tiếp cận một lượng khách chung khổng lồ.</li>
</ul>
<h3>Đa kênh (multichannel) vs hợp kênh (omnichannel)</h3>
<p><strong>Đa kênh</strong> = nhiều kênh vận hành <em>tách rời</em> (website, app và cửa hàng mỗi cái chạy theo cách riêng). <strong>Hợp kênh (omnichannel)</strong> = cũng những kênh đó nhưng <em>tích hợp</em> thành một trải nghiệm liền mạch: mua online, nhận tại cửa hàng; xem tồn kho cửa hàng trên app; đổi trả ở bất kỳ đâu.</p>
<pre><code>Đa kênh   : Web | App | Cửa hàng   (rời rạc)
Hợp kênh  : Web + App + Cửa hàng    (một hành trình, chung giỏ/tồn/dữ liệu)
</code></pre>
<h3>Vì sao D2C bùng nổ</h3>
<p>Rào cản thấp (Shopify, quảng cáo, dịch vụ hoàn tất đơn) cho phép thương hiệu vượt qua "người gác cổng", giữ biên lợi nhuận, và học trực tiếp từ dữ liệu khách hàng.</p>
<div class="callout"><span class="badge">Warby Parker &amp; Nespresso</span> <strong>Warby Parker</strong> khởi đầu D2C online (bộ thử kính tại nhà), rồi mở cửa hàng riêng — hợp kênh có chủ đích. <strong>Nespresso</strong> bán cà phê trực tiếp qua Club, boutique và app, kiểm soát chặt thương hiệu và đơn mua lại.</div>`,
  ]]);

const c6q = quiz('mcm301-quiz-6', 'Quiz 6 — Digital & omnichannel|||Quiz 6 — Kênh số & đa kênh', [
  { id: 'q1', question: 'D2C (direct-to-consumer) nghĩa là?|||D2C (direct-to-consumer) means?', options: ['Nhà sản xuất bán thẳng cho khách, bỏ qua bán buôn/bán lẻ|||The maker sells straight to customers, skipping wholesalers/retailers', 'Chỉ bán qua đại lý|||Selling only through agents', 'Bán buôn cho doanh nghiệp|||Wholesaling to businesses', 'Không có kênh online|||No online channel'], correctIndex: 0, explanation: 'D2C: nhà sản xuất bán trực tiếp tới người tiêu dùng, nắm quan hệ và dữ liệu.' },
  { id: 'q2', question: 'Khác biệt chính giữa multichannel và omnichannel là?|||The key difference between multichannel and omnichannel is?', options: ['Omnichannel tích hợp các kênh thành một trải nghiệm liền mạch|||Omnichannel integrates channels into one seamless experience', 'Multichannel không có website|||Multichannel has no website', 'Chúng giống hệt nhau|||They are identical', 'Omnichannel chỉ có một kênh|||Omnichannel has only one channel'], correctIndex: 0, explanation: 'Multichannel = kênh rời rạc; omnichannel = tích hợp, chung giỏ/tồn/dữ liệu.' },
  { id: 'q3', question: 'Amazon, Shopee, Etsy là ví dụ của loại kênh nào?|||Amazon, Shopee and Etsy are examples of which channel type?', options: ['Marketplace (sàn bên thứ ba)|||Marketplace (third-party platform)', 'Cửa hàng độc quyền của hãng|||A brand exclusive store', 'Nhà bán buôn truyền thống|||A traditional wholesaler', 'Kênh 0 cấp trực tiếp|||A zero-level direct channel'], correctIndex: 0, explanation: 'Đó là các sàn marketplace nơi nhiều người bán tiếp cận khách chung.' },
]);

const c7 = doc('mcm301-7-1-logistics', '7.1 — Logistics & physical distribution|||7.1 — Logistics & phân phối vật lý',
  'Quản trị hàng tồn (EOQ, safety stock), kho bãi, vận tải (chọn phương thức), và hoàn tất đơn hàng (order fulfillment); ví dụ Amazon, Zara.',
  [[
    `<span class="eyebrow">MCM301 · Chapter 7 · Lesson 7.1</span>
<h2>Logistics &amp; physical distribution</h2>
<p><strong>Physical distribution</strong> is the actual movement and storage of goods so they arrive in the right quantity, place and time — at the lowest total cost for a target service level.</p>
<h3>Inventory management</h3>
<ul>
<li><strong>Too much stock</strong> ties up cash and risks obsolescence; <strong>too little</strong> means stockouts and lost sales.</li>
<li>Firms balance this with <strong>reorder points</strong>, <strong>safety stock</strong>, and models like <strong>EOQ</strong> (economic order quantity). <strong>JIT</strong> (just-in-time) minimises inventory by syncing supply to demand.</li>
</ul>
<h3>Warehousing &amp; transport</h3>
<ul>
<li><strong>Warehouses / distribution centres</strong> store and consolidate goods; placing them near demand cuts delivery time.</li>
<li><strong>Transport modes</strong> trade speed vs cost: air (fast, costly) → truck → rail → sea (slow, cheap). Choose by product value, urgency and distance.</li>
</ul>
<h3>Order fulfillment</h3>
<p>The cycle: <strong>order → pick → pack → ship → deliver → returns</strong>. Fast, accurate fulfillment is now a competitive weapon, not a back-office task.</p>
<div class="callout"><span class="badge">Amazon &amp; Zara</span> <strong>Amazon</strong> places fulfilment centres near cities for same/next-day delivery. <strong>Zara</strong> runs a fast, tightly-controlled supply chain — small batches, frequent shipments — so new styles reach stores in weeks, not months.</div>`,
    `<span class="eyebrow">MCM301 · Chương 7 · Bài 7.1</span>
<h2>Logistics &amp; phân phối vật lý</h2>
<p><strong>Phân phối vật lý</strong> là việc di chuyển và lưu trữ hàng hoá thực tế để chúng đến đúng số lượng, đúng nơi, đúng lúc — với tổng chi phí thấp nhất ở một mức dịch vụ mục tiêu.</p>
<h3>Quản trị hàng tồn</h3>
<ul>
<li><strong>Tồn quá nhiều</strong> chôn vốn và dễ lỗi thời; <strong>quá ít</strong> gây hết hàng và mất doanh số.</li>
<li>Doanh nghiệp cân bằng bằng <strong>điểm đặt lại hàng</strong>, <strong>tồn an toàn (safety stock)</strong>, và các mô hình như <strong>EOQ</strong> (lượng đặt hàng kinh tế). <strong>JIT</strong> (đúng lúc) tối thiểu hoá tồn kho bằng cách đồng bộ cung theo cầu.</li>
</ul>
<h3>Kho bãi &amp; vận tải</h3>
<ul>
<li><strong>Kho / trung tâm phân phối</strong> lưu trữ và gom hàng; đặt gần cầu giúp cắt thời gian giao.</li>
<li><strong>Phương thức vận tải</strong> đánh đổi tốc độ và chi phí: hàng không (nhanh, đắt) → đường bộ → đường sắt → đường biển (chậm, rẻ). Chọn theo giá trị sản phẩm, độ gấp và khoảng cách.</li>
</ul>
<h3>Hoàn tất đơn hàng</h3>
<p>Chu trình: <strong>đặt hàng → lấy hàng → đóng gói → gửi → giao → đổi trả</strong>. Hoàn tất đơn nhanh và chính xác nay là vũ khí cạnh tranh, không còn là việc hậu trường.</p>
<div class="callout"><span class="badge">Amazon &amp; Zara</span> <strong>Amazon</strong> đặt trung tâm hoàn tất đơn gần đô thị để giao trong ngày/hôm sau. <strong>Zara</strong> vận hành chuỗi cung ứng nhanh, kiểm soát chặt — lô nhỏ, giao thường xuyên — nên mẫu mới tới cửa hàng trong vài tuần, không phải vài tháng.</div>`,
  ]]);

const c7q = quiz('mcm301-quiz-7', 'Quiz 7 — Logistics|||Quiz 7 — Logistics', [
  { id: 'q1', question: '"Safety stock" (tồn an toàn) dùng để?|||"Safety stock" is used to?', options: ['Giảm giá bán|||Lower the price', 'Đệm chống hết hàng khi cầu hoặc giao hàng biến động|||Buffer against stockouts when demand or delivery varies', 'Tăng thuế|||Increase tax', 'Thay cho kho bãi|||Replace warehousing'], correctIndex: 1, explanation: 'Tồn an toàn là lượng đệm phòng khi cầu/giao hàng dao động, tránh hết hàng.' },
  { id: 'q2', question: 'Phương thức vận tải nào NHANH nhất nhưng ĐẮT nhất?|||Which transport mode is fastest but most expensive?', options: ['Đường biển|||Sea', 'Đường sắt|||Rail', 'Hàng không|||Air', 'Đường bộ|||Truck'], correctIndex: 2, explanation: 'Hàng không nhanh nhất nhưng chi phí cao nhất; đường biển ngược lại.' },
  { id: 'q3', question: 'Chu trình "order fulfillment" gồm các bước điển hình nào?|||The order fulfillment cycle typically includes which steps?', options: ['Đặt → lấy hàng → đóng gói → gửi → giao → đổi trả|||Order → pick → pack → ship → deliver → returns', 'Chỉ quảng cáo|||Advertising only', 'Định giá và khuyến mãi|||Pricing and promotion only', 'Tuyển dụng nhân sự|||Recruiting staff'], correctIndex: 0, explanation: 'Hoàn tất đơn: đặt → lấy → đóng gói → gửi → giao → đổi trả.' },
]);

const c8 = doc('mcm301-8-1-trends-metrics', '8.1 — Channel trends & measurement|||8.1 — Xu hướng & đo lường kênh',
  'Kênh xanh (bền vững), retail media, và các KPI kênh (sell-through, coverage, service level, cost-to-serve, channel margin).',
  [[
    `<span class="eyebrow">MCM301 · Chapter 8 · Lesson 8.1</span>
<h2>Channel trends &amp; measurement</h2>
<h3>Emerging trends</h3>
<ul>
<li><strong>Green / sustainable channels</strong> — greener packaging, consolidated shipping, reverse logistics (returns, recycling). Customers and regulators reward lower-carbon distribution.</li>
<li><strong>Retail media</strong> — retailers (Amazon, Walmart) sell advertising on their own platforms; the channel itself becomes a media business and a data source.</li>
<li><strong>Q-commerce &amp; social commerce</strong> — ultra-fast delivery and selling inside social apps blur channel and content.</li>
</ul>
<h3>Measuring channel performance — KPIs</h3>
<ul>
<li><strong>Sell-through rate</strong> — units sold ÷ units received, per period. Shows how fast a partner moves stock.</li>
<li><strong>Coverage / distribution</strong> — % of target outlets that stock the product (numeric &amp; weighted distribution).</li>
<li><strong>Service level</strong> — % of orders delivered complete and on time.</li>
<li><strong>Cost-to-serve</strong> — total channel cost per order or per customer.</li>
<li><strong>Channel margin / contribution</strong> — profit each channel generates after its own costs.</li>
</ul>
<pre><code>Sell-through % = units sold / units received x 100
Service level % = on-time complete orders / total orders x 100
</code></pre>
<div class="callout"><span class="badge">Measure to manage</span> A channel you cannot measure, you cannot manage. Track sell-through, coverage and cost-to-serve side by side — a channel with high sales but sky-high cost-to-serve may be worth less than a smaller, efficient one.</div>`,
    `<span class="eyebrow">MCM301 · Chương 8 · Bài 8.1</span>
<h2>Xu hướng &amp; đo lường kênh</h2>
<h3>Xu hướng nổi lên</h3>
<ul>
<li><strong>Kênh xanh / bền vững</strong> — bao bì thân thiện hơn, gom chuyến giao, logistics ngược (đổi trả, tái chế). Khách hàng và cơ quan quản lý tưởng thưởng cho phân phối ít phát thải.</li>
<li><strong>Retail media</strong> — nhà bán lẻ (Amazon, Walmart) bán quảng cáo trên chính nền tảng của họ; bản thân kênh trở thành một mảng truyền thông và nguồn dữ liệu.</li>
<li><strong>Q-commerce &amp; social commerce</strong> — giao siêu nhanh và bán ngay trong ứng dụng mạng xã hội làm mờ ranh giới kênh và nội dung.</li>
</ul>
<h3>Đo lường hiệu quả kênh — KPI</h3>
<ul>
<li><strong>Tỷ lệ bán ra (sell-through)</strong> — số bán ÷ số nhập, mỗi kỳ. Cho thấy đối tác luân chuyển hàng nhanh thế nào.</li>
<li><strong>Độ phủ / phân phối</strong> — % điểm bán mục tiêu có trữ hàng (phân phối theo số lượng &amp; theo trọng số).</li>
<li><strong>Mức dịch vụ (service level)</strong> — % đơn giao đủ và đúng hạn.</li>
<li><strong>Chi phí phục vụ (cost-to-serve)</strong> — tổng chi phí kênh trên mỗi đơn hoặc mỗi khách.</li>
<li><strong>Biên/đóng góp của kênh</strong> — lợi nhuận mỗi kênh tạo ra sau chi phí riêng.</li>
</ul>
<pre><code>Tỷ lệ bán ra % = số bán / số nhập x 100
Mức dịch vụ % = đơn đúng hạn &amp; đủ / tổng đơn x 100
</code></pre>
<div class="callout"><span class="badge">Đo được mới quản được</span> Một kênh bạn không đo được thì không quản được. Theo dõi sell-through, độ phủ và cost-to-serve cạnh nhau — một kênh doanh số cao nhưng cost-to-serve ngất ngưởng có thể kém giá trị hơn một kênh nhỏ nhưng hiệu quả.</div>`,
  ]]);

const c8q = quiz('mcm301-quiz-8', 'Quiz 8 — Trends & metrics|||Quiz 8 — Xu hướng & đo lường', [
  { id: 'q1', question: '"Sell-through rate" (tỷ lệ bán ra) được tính bằng?|||The "sell-through rate" is calculated as?', options: ['Số nhập ÷ số bán|||Units received ÷ units sold', 'Số bán ÷ số nhập (mỗi kỳ)|||Units sold ÷ units received (per period)', 'Tổng doanh thu ÷ số nhân viên|||Total revenue ÷ number of employees', 'Chi phí ÷ giá|||Cost ÷ price'], correctIndex: 1, explanation: 'Sell-through = số bán chia số nhập trong kỳ; cho thấy tốc độ luân chuyển hàng.' },
  { id: 'q2', question: '"Retail media" là xu hướng gì?|||"Retail media" is which trend?', options: ['Nhà bán lẻ bán quảng cáo trên chính nền tảng của họ|||Retailers selling advertising on their own platforms', 'Đóng cửa mọi cửa hàng|||Closing all stores', 'Chỉ bán qua báo giấy|||Selling only via print newspapers', 'Bỏ hoàn toàn dữ liệu khách|||Abandoning customer data entirely'], correctIndex: 0, explanation: 'Retail media: nhà bán lẻ (Amazon, Walmart) biến nền tảng thành kênh quảng cáo và nguồn dữ liệu.' },
  { id: 'q3', question: 'Vì sao một kênh doanh số cao vẫn có thể kém giá trị?|||Why can a high-sales channel still be less valuable?', options: ['Vì nó có logo đẹp|||Because it has a nice logo', 'Vì chi phí phục vụ (cost-to-serve) quá cao làm giảm đóng góp lợi nhuận|||Because a very high cost-to-serve erodes its profit contribution', 'Vì bán quá nhanh|||Because it sells too fast', 'Doanh số cao luôn tốt nhất|||High sales is always best'], correctIndex: 1, explanation: 'Phải xét cost-to-serve và biên đóng góp, không chỉ doanh số thô.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'MCM301',
    slug: 'mcm301-marketing-channel-management',
    title: 'Marketing Channel Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MCM301.webp',
    shortDescription: 'How products reach customers — channel roles & flows, structure & design, intermediaries, managing members, power & conflict, digital & omnichannel, logistics, and channel KPIs. Bilingual, real brands & quizzes.|||Sản phẩm đến tay khách hàng thế nào — vai trò & dòng chảy kênh, cấu trúc & thiết kế, trung gian, quản trị thành viên, quyền lực & xung đột, kênh số & đa kênh, logistics, KPI kênh. Song ngữ, thương hiệu thật & quiz.',
    description: 'Môn <strong>MCM301 — Marketing Channel Management</strong> (Quản trị kênh marketing, Kỳ 4, khối Công nghệ Truyền thông) dạy cách sản phẩm đi từ nhà sản xuất tới khách hàng cuối và cách doanh nghiệp thiết kế, vận hành, đo lường các tuyến đường đó. Từ <strong>kênh &amp; dòng chảy</strong> → <strong>cấu trúc &amp; thiết kế</strong> (độ phủ, trực tiếp/gián tiếp) → <strong>trung gian phân phối</strong> → <strong>quản trị thành viên kênh</strong> → <strong>quyền lực &amp; xung đột</strong> → <strong>kênh số &amp; đa kênh</strong> → <strong>logistics</strong> → <strong>xu hướng &amp; đo lường</strong>. Dựng theo giáo trình chuẩn (Coughlan, Rosenbloom, Kotler phần Place), song ngữ, có ví dụ thương hiệu thật và quiz mỗi chương.',
    whatYouLearn: 'Vai trò trung gian &amp; 8 dòng chảy kênh; số cấp kênh và độ phủ (intensive/selective/exclusive); trực tiếp vs gián tiếp; nhà bán buôn/bán lẻ/đại lý/môi giới; tuyển chọn, tạo động lực, đánh giá thành viên; 5 nguồn quyền lực và xung đột dọc/ngang; e-commerce, D2C, marketplace, omnichannel; quản trị tồn kho, kho bãi, vận tải, hoàn tất đơn; kênh xanh, retail media và KPI kênh (sell-through, coverage, cost-to-serve).',
    requirements: 'Kiến thức marketing căn bản (4P) là lợi thế nhưng không bắt buộc. Không cần nền kỹ thuật.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình chuẩn quốc tế, HBR, công cụ, lộ trình tự học 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Kênh marketing là gì, "Place" trong 4P, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Kênh & dòng chảy|||Chapter 1 — Channels & flows', description: 'Vai trò trung gian, chức năng kênh, 8 dòng chảy.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Cấu trúc & thiết kế|||Chapter 2 — Structure & design', description: 'Số cấp, độ phủ, trực tiếp vs gián tiếp.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Trung gian phân phối|||Chapter 3 — Intermediaries', description: 'Bán buôn, bán lẻ, đại lý, môi giới.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Quản trị thành viên|||Chapter 4 — Managing members', description: 'Tuyển chọn, động lực, đánh giá, hỗ trợ.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Quyền lực & xung đột|||Chapter 5 — Power & conflict', description: 'Nguồn quyền lực, xung đột dọc/ngang, lãnh đạo kênh.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Kênh số & đa kênh|||Chapter 6 — Digital & omnichannel', description: 'E-commerce, D2C, marketplace, omnichannel.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Logistics & phân phối vật lý|||Chapter 7 — Logistics', description: 'Tồn kho, kho bãi, vận tải, hoàn tất đơn.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Xu hướng & đo lường|||Chapter 8 — Trends & measurement', description: 'Kênh xanh, retail media, KPI kênh.', lessons: [c8, c8q] },
  ],
};
