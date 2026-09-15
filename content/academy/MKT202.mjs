/**
 * MKT202 — Services Marketing Management. Giáo trình FLM (syl): Zeithaml/Bitner
 * "Services Marketing"; Lovelock "Services Marketing"; Grönroos "Service
 * Management" — bản chất dịch vụ (IHIP), hành vi & kỳ vọng khách hàng, 7P mở
 * rộng, mô hình khoảng cách GAP/SERVQUAL, con người-quy trình-bằng chứng vật
 * chất (servicescape), quản lý cung-cầu & năng suất, phục hồi dịch vụ & lòng
 * trung thành, marketing dịch vụ số. Song ngữ + ví dụ + bài tập.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mkt202-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách tham khảo, tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">MKT202 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Services Marketing Management — service characteristics, customer expectations, the 7P mix, service quality, and demand management — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MKT202 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Services Marketing: Integrating Customer Focus Across the Firm</em> — Valarie A. Zeithaml, Mary Jo Bitner, Dwayne D. Gremler (main course text)</li>
<li><em>Services Marketing: People, Technology, Strategy</em> — Christopher Lovelock, Jochen Wirtz</li>
<li><em>Service Management and Marketing: Customer Management in Service Competition</em> — Christian Grönroos</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.ama.org/" target="_blank" rel="noopener">American Marketing Association (ama.org)</a> — definitions, articles on services marketing</li>
<li><a href="https://hbr.org/topic/subject/services" target="_blank" rel="noopener">Harvard Business Review — Services</a> — case studies on service design &amp; quality</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@MarketingWeekEd" target="_blank" rel="noopener">Marketing Week</a> — services &amp; brand marketing explainers</li>
<li><a href="https://www.youtube.com/@HarvardBusinessReview" target="_blank" rel="noopener">Harvard Business Review</a> — service strategy &amp; customer experience talks</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — draw a customer journey map or blueprint quickly</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — service blueprinting &amp; process mapping templates</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — IHIP characteristics, the 7P mix, the GAP model and SERVQUAL dimensions.</li>
<li><strong>Practice</strong> — apply the gap model and SERVQUAL to a real service you use often (bank, clinic, airline).</li>
<li><strong>Go deeper</strong> — servicescape design, demand-capacity management, service recovery.</li>
<li><strong>Job-ready</strong> — draw a service blueprint for a real process; read a service-recovery case study.</li>
</ol></div>`,
    `<span class="eyebrow">MKT202 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Quản trị Marketing dịch vụ — đặc điểm dịch vụ, kỳ vọng khách hàng, marketing mix 7P, chất lượng dịch vụ và quản lý cung-cầu — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MKT202 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Services Marketing: Integrating Customer Focus Across the Firm</em> — Valarie A. Zeithaml, Mary Jo Bitner, Dwayne D. Gremler (giáo trình chính)</li>
<li><em>Services Marketing: People, Technology, Strategy</em> — Christopher Lovelock, Jochen Wirtz</li>
<li><em>Service Management and Marketing: Customer Management in Service Competition</em> — Christian Grönroos</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.ama.org/" target="_blank" rel="noopener">American Marketing Association (ama.org)</a> — định nghĩa, bài viết về marketing dịch vụ</li>
<li><a href="https://hbr.org/topic/subject/services" target="_blank" rel="noopener">Harvard Business Review — Services</a> — case study thiết kế &amp; chất lượng dịch vụ</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MarketingWeekEd" target="_blank" rel="noopener">Marketing Week</a> — giải thích marketing dịch vụ &amp; thương hiệu</li>
<li><a href="https://www.youtube.com/@HarvardBusinessReview" target="_blank" rel="noopener">Harvard Business Review</a> — chiến lược dịch vụ &amp; trải nghiệm khách hàng</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — vẽ nhanh customer journey map hoặc blueprint</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — mẫu vẽ service blueprint &amp; sơ đồ quy trình</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — đặc điểm IHIP, marketing mix 7P, mô hình GAP và các chiều SERVQUAL.</li>
<li><strong>Luyện tập</strong> — áp mô hình GAP và SERVQUAL vào một dịch vụ bạn dùng thường xuyên (ngân hàng, bệnh viện, hàng không).</li>
<li><strong>Đào sâu</strong> — thiết kế servicescape, quản lý cung-cầu & năng suất, phục hồi dịch vụ.</li>
<li><strong>Sẵn sàng đi làm</strong> — vẽ service blueprint cho một quy trình thật; đọc case study phục hồi dịch vụ.</li>
</ol></div>`,
  ]]);

const intro = doc('mkt202-0-1-overview', 'Course overview: Services Marketing Management|||Tổng quan: Quản trị Marketing dịch vụ',
  'Vì sao dịch vụ khác hàng hoá; lộ trình môn: bản chất dịch vụ → hành vi & kỳ vọng → 7P → chất lượng dịch vụ (GAP/SERVQUAL) → servicescape → cung-cầu → phục hồi & trung thành → dịch vụ số.',
  [[
    `<span class="eyebrow">MKT202 · Lesson 0.1 · Overview</span>
<h2>Services Marketing Management</h2>
<p class="lead">This course helps you understand <strong>why marketing a service is different from marketing a physical good</strong> — and gives you the frameworks managers use to design, deliver, and fix services: from the extended marketing mix to the quality-gap model to demand management.</p>
<h3>Goods vs. services — why the difference matters</h3>
<p>A product like a phone is tangible, made in a factory, inspected before it ships, and can sit in a warehouse. A haircut, a bank transaction, a hospital visit cannot. Marketing has to compensate for that with different tools — that compensation is the spine of this course.</p>
<h3>Roadmap</h3>
<p>Nature &amp; characteristics of services (IHIP) → consumer behavior &amp; expectations → the 7P services marketing mix → the GAP model &amp; SERVQUAL → people, process &amp; physical evidence (servicescape) → managing supply, demand &amp; productivity → service recovery &amp; customer loyalty → digital services marketing.</p>
<div class="callout"><span class="badge">Why it matters</span> Services are over 60% of GDP in most economies, and every physical product today ships with a service wrapper (support, warranty, delivery, app). The tools in this course apply everywhere.</div>`,
    `<span class="eyebrow">MKT202 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị Marketing dịch vụ</h2>
<p class="lead">Môn này giúp bạn hiểu <strong>vì sao marketing một dịch vụ khác marketing một sản phẩm vật chất</strong> — và trang bị các khung mà nhà quản lý dùng để thiết kế, cung cấp, và sửa lỗi dịch vụ: từ marketing mix mở rộng đến mô hình khoảng cách chất lượng đến quản lý cung-cầu.</p>
<h3>Hàng hoá vs. dịch vụ — vì sao khác biệt quan trọng</h3>
<p>Một sản phẩm như điện thoại là hữu hình, sản xuất trong nhà máy, kiểm tra trước khi xuất kho, và có thể nằm trong kho hàng. Một lần cắt tóc, một giao dịch ngân hàng, một lần khám bệnh thì không. Marketing phải bù đắp điều đó bằng công cụ khác — sự bù đắp đó là mạch xuyên suốt môn học.</p>
<h3>Lộ trình</h3>
<p>Bản chất &amp; đặc điểm dịch vụ (IHIP) → hành vi & kỳ vọng khách hàng → marketing mix 7P cho dịch vụ → mô hình GAP &amp; SERVQUAL → con người, quy trình &amp; bằng chứng vật chất (servicescape) → quản lý cung, cầu &amp; năng suất → phục hồi dịch vụ &amp; lòng trung thành khách hàng → marketing dịch vụ số.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Dịch vụ chiếm hơn 60% GDP ở hầu hết nền kinh tế, và mọi sản phẩm vật chất ngày nay đều đi kèm lớp dịch vụ (hỗ trợ, bảo hành, giao hàng, app). Công cụ trong môn này áp dụng khắp mọi nơi.</div>`,
  ]]);

const c1 = doc('mkt202-1-1-nature-of-services', '1.1 — Nature of services & IHIP characteristics|||1.1 — Bản chất dịch vụ & đặc điểm IHIP',
  'Định nghĩa dịch vụ; bốn đặc điểm IHIP (Vô hình, Không đồng nhất, Không thể tách rời, Không thể lưu trữ) và hệ quả marketing của từng đặc điểm.',
  [[
    `<span class="eyebrow">MKT202 · Chapter 1 · Lesson 1.1</span>
<h2>Nature of services &amp; IHIP characteristics</h2>
<h3>What is a service?</h3>
<p>A <strong>service</strong> is a deed, process, or performance provided by one party for another, typically producing a change (in the customer, or something the customer owns) rather than a physical object the customer keeps. Services are usually a mix of tangible and intangible elements — a flight includes a seat and a meal (tangible) plus safe transport and a smile from crew (intangible).</p>
<h3>The four IHIP characteristics</h3>
<pre><code>I - Intangibility     : cannot be seen, touched, or inventoried before purchase
H - Heterogeneity     : quality varies by provider, customer, day, mood
I - Inseparability    : produced and consumed at the same time (provider + customer present)
P - Perishability     : cannot be stored - an empty seat/hour is lost forever
</code></pre>
<h3>Marketing implications of each</h3>
<ul>
<li><strong>Intangibility</strong> → customers cannot "try before they buy"; marketing must use tangible cues (branding, physical evidence, testimonials) to signal quality.</li>
<li><strong>Heterogeneity</strong> → hard to standardize; firms invest in training, service scripts, and technology to reduce variability.</li>
<li><strong>Inseparability</strong> → the customer is part of production; the provider's skill and the customer's own behavior both shape the outcome. Mass production is hard; scaling requires more people or self-service technology.</li>
<li><strong>Perishability</strong> → unsold capacity (an empty hotel room tonight) cannot be sold tomorrow, which is why pricing and demand management (discussed in Chapter 6) matter so much more for services than for goods.</li>
</ul>
<div class="callout"><span class="badge">Exam anchor</span> IHIP is the single most tested concept in services marketing — always be ready to name all four and give a fresh example (not the textbook's) for each.</div>`,
    `<span class="eyebrow">MKT202 · Chương 1 · Bài 1.1</span>
<h2>Bản chất dịch vụ &amp; đặc điểm IHIP</h2>
<h3>Dịch vụ là gì?</h3>
<p>Một <strong>dịch vụ</strong> là hành động, quy trình, hoặc màn trình diễn do một bên cung cấp cho bên khác, thường tạo ra một sự thay đổi (ở khách hàng, hoặc ở thứ khách hàng sở hữu) chứ không phải một vật thể mà khách hàng giữ lại. Dịch vụ thường là hỗn hợp yếu tố hữu hình và vô hình — một chuyến bay gồm ghế ngồi và bữa ăn (hữu hình) cộng với việc vận chuyển an toàn và nụ cười của phi hành đoàn (vô hình).</p>
<h3>Bốn đặc điểm IHIP</h3>
<pre><code>I - Vô hình (Intangibility)    : không thấy, không sờ, không lưu kho trước khi mua
H - Không đồng nhất (Heterogeneity) : chất lượng đổi theo người cung cấp, khách hàng, ngày, tâm trạng
I - Không tách rời (Inseparability) : sản xuất và tiêu dùng diễn ra cùng lúc (có mặt cả hai bên)
P - Không lưu trữ (Perishability)   : không tồn kho được - một ghế trống/giờ trống là mất vĩnh viễn
</code></pre>
<h3>Hệ quả marketing của mỗi đặc điểm</h3>
<ul>
<li><strong>Vô hình</strong> → khách hàng không thể "thử trước khi mua"; marketing phải dùng tín hiệu hữu hình (thương hiệu, bằng chứng vật chất, lời chứng thực) để báo hiệu chất lượng.</li>
<li><strong>Không đồng nhất</strong> → khó chuẩn hoá; doanh nghiệp đầu tư đào tạo, quy trình mẫu (script), và công nghệ để giảm biến thiên.</li>
<li><strong>Không tách rời</strong> → khách hàng là một phần của quá trình sản xuất; kỹ năng người cung cấp và hành vi khách hàng đều định hình kết quả. Sản xuất đại trà khó; mở rộng quy mô cần thêm người hoặc công nghệ tự phục vụ.</li>
<li><strong>Không lưu trữ</strong> → công suất không bán được (một phòng khách sạn trống đêm nay) không thể bán vào ngày mai — đây là lý do định giá và quản lý cầu (Chương 6) quan trọng hơn nhiều so với hàng hoá.</li>
</ul>
<div class="callout"><span class="badge">Mốc thi</span> IHIP là khái niệm bị hỏi nhiều nhất trong marketing dịch vụ — luôn sẵn sàng kể đủ 4 đặc điểm và cho một ví dụ mới (không phải ví dụ trong sách) cho mỗi đặc điểm.</div>`,
  ]]);

const c1q = quiz('mkt202-quiz-1', 'Quiz 1 — Nature of services & IHIP|||Quiz 1 — Bản chất dịch vụ & IHIP', [
  { id: 'q1', question: 'Đặc điểm nào của dịch vụ nói rằng nó không thể lưu kho, một ghế trống trên máy bay là mất vĩnh viễn?', options: ['Vô hình (Intangibility)', 'Không đồng nhất (Heterogeneity)', 'Không thể tách rời (Inseparability)', 'Không thể lưu trữ (Perishability)'], correctIndex: 3, explanation: 'Perishability: công suất không bán được không thể tồn kho để bán sau.' },
  { id: 'q2', question: 'Vì sao chất lượng một dịch vụ dễ khác nhau giữa hai lần cung cấp, dù cùng một công ty?', options: ['Vì dịch vụ Không đồng nhất (Heterogeneity)', 'Vì dịch vụ Vô hình', 'Vì dịch vụ Không tách rời', 'Vì dịch vụ được sản xuất hàng loạt như hàng hoá'], correctIndex: 0, explanation: 'Heterogeneity: chất lượng phụ thuộc người thực hiện, khách hàng, thời điểm — khó chuẩn hoá tuyệt đối.' },
  { id: 'q3', question: 'Đặc điểm "Inseparability" (Không thể tách rời) nghĩa là gì?', options: ['Dịch vụ có thể sản xuất trước rồi tồn kho', 'Dịch vụ được sản xuất và tiêu dùng cùng lúc, khách hàng tham gia vào quá trình', 'Dịch vụ luôn giống nhau ở mọi lần cung cấp', 'Dịch vụ luôn hữu hình như sản phẩm'], correctIndex: 1, explanation: 'Inseparability: người cung cấp và khách hàng cùng có mặt tại thời điểm tạo ra dịch vụ.' },
]);

const c2 = doc('mkt202-2-1-consumer-behavior-expectations', '2.1 — Consumer behavior & customer expectations|||2.1 — Hành vi khách hàng dịch vụ & kỳ vọng',
  'Kỳ vọng khách hàng (dịch vụ mong đợi vs. cảm nhận), dịch vụ đầy đủ/thoả đáng, zone of tolerance; các yếu tố hình thành kỳ vọng.',
  [[
    `<span class="eyebrow">MKT202 · Chapter 2 · Lesson 2.1</span>
<h2>Consumer behavior in services &amp; customer expectations</h2>
<h3>Two levels of expectation</h3>
<ul>
<li><strong>Desired service</strong> — the level of service the customer hopes to receive (the "wished for" level).</li>
<li><strong>Adequate service</strong> — the minimum level the customer will accept without being dissatisfied.</li>
</ul>
<p>The gap between these two is the <strong>zone of tolerance</strong> — the range of performance a customer considers "satisfactory." Below adequate service, customers are frustrated; above desired service, they are delighted. The zone widens or narrows depending on the customer, the service, and the situation (e.g. a wider tolerance for delay during a snowstorm than on a sunny day).</p>
<pre><code>Desired service      (hoped for)
      ^
      |  Zone of tolerance (acceptable range)
      v
Adequate service     (minimum acceptable)
</code></pre>
<h3>What shapes expectations</h3>
<ul>
<li><strong>Word-of-mouth</strong> — recommendations or warnings from others.</li>
<li><strong>Personal needs</strong> — the individual customer's own requirements.</li>
<li><strong>Past experience</strong> — prior use of this or a similar service.</li>
<li><strong>Explicit &amp; implicit service promises</strong> — advertising, price, physical evidence (a fancy lobby implies fancy service).</li>
<li><strong>Situational factors</strong> — the context of a specific encounter (an emergency vs. a routine visit).</li>
</ul>
<div class="callout"><span class="badge">Manager takeaway</span> Never promise more than you can consistently deliver — over-promising in advertising raises the "desired" bar and shrinks the zone of tolerance, making the same actual service feel worse.</div>`,
    `<span class="eyebrow">MKT202 · Chương 2 · Bài 2.1</span>
<h2>Hành vi khách hàng dịch vụ &amp; kỳ vọng khách hàng</h2>
<h3>Hai mức kỳ vọng</h3>
<ul>
<li><strong>Dịch vụ mong muốn (desired service)</strong> — mức dịch vụ khách hàng hy vọng nhận được (mức "ước ao").</li>
<li><strong>Dịch vụ thoả đáng (adequate service)</strong> — mức tối thiểu khách hàng chấp nhận được mà không thấy bất mãn.</li>
</ul>
<p>Khoảng cách giữa hai mức này là <strong>vùng chấp nhận được (zone of tolerance)</strong> — khoảng hiệu suất mà khách hàng coi là "thoả đáng". Dưới mức thoả đáng, khách hàng thấy thất vọng; trên mức mong muốn, khách hàng thấy thích thú. Vùng này rộng hay hẹp tuỳ khách hàng, tuỳ dịch vụ, và tuỳ tình huống (vd chấp nhận trễ hơn khi có bão tuyết so với ngày nắng đẹp).</p>
<pre><code>Dịch vụ mong muốn      (ước ao)
      ^
      |  Vùng chấp nhận được (khoảng thoả đáng)
      v
Dịch vụ thoả đáng       (tối thiểu chấp nhận)
</code></pre>
<h3>Yếu tố hình thành kỳ vọng</h3>
<ul>
<li><strong>Truyền miệng (word-of-mouth)</strong> — lời khuyên hoặc cảnh báo từ người khác.</li>
<li><strong>Nhu cầu cá nhân</strong> — yêu cầu riêng của từng khách hàng.</li>
<li><strong>Kinh nghiệm trước đó</strong> — đã từng dùng dịch vụ này hoặc dịch vụ tương tự.</li>
<li><strong>Lời hứa dịch vụ rõ ràng &amp; ngầm định</strong> — quảng cáo, giá cả, bằng chứng vật chất (sảnh sang trọng ngụ ý dịch vụ sang trọng).</li>
<li><strong>Yếu tố tình huống</strong> — bối cảnh cụ thể của một lần trải nghiệm (cấp cứu so với khám định kỳ).</li>
</ul>
<div class="callout"><span class="badge">Bài học cho nhà quản lý</span> Đừng hứa nhiều hơn khả năng cung cấp ổn định — quảng cáo thổi phồng đẩy mức "mong muốn" lên cao và làm vùng chấp nhận hẹp lại, khiến cùng một dịch vụ thật lại bị cảm nhận tệ hơn.</div>`,
  ]]);

const c2q = quiz('mkt202-quiz-2', 'Quiz 2 — Consumer behavior & expectations|||Quiz 2 — Hành vi & kỳ vọng khách hàng', [
  { id: 'q1', question: 'Khoảng giữa "dịch vụ mong muốn" và "dịch vụ thoả đáng" gọi là gì?', options: ['SERVQUAL', 'Zone of tolerance (vùng chấp nhận được)', 'GAP model', 'Servicescape'], correctIndex: 1, explanation: 'Zone of tolerance là khoảng hiệu suất khách hàng coi là thoả đáng, nằm giữa mức mong muốn và mức tối thiểu chấp nhận.' },
  { id: 'q2', question: 'Quảng cáo hứa hẹn quá mức tác động thế nào đến cảm nhận của khách hàng?', options: ['Không ảnh hưởng gì vì khách hàng không tin quảng cáo', 'Nâng mức dịch vụ mong muốn, làm vùng chấp nhận hẹp lại, dễ gây thất vọng', 'Luôn làm khách hàng hài lòng hơn', 'Chỉ ảnh hưởng đến giá, không ảnh hưởng đến kỳ vọng'], correctIndex: 1, explanation: 'Hứa quá mức đẩy "desired service" lên cao, khiến cùng một dịch vụ thật dễ rơi dưới ngưỡng mong đợi.' },
  { id: 'q3', question: 'Yếu tố nào SAU ĐÂY không thuộc nhóm hình thành kỳ vọng khách hàng theo bài học?', options: ['Truyền miệng (word-of-mouth)', 'Kinh nghiệm trước đó', 'Giá vốn hàng bán của doanh nghiệp', 'Lời hứa dịch vụ rõ ràng & ngầm định'], correctIndex: 2, explanation: 'Giá vốn hàng bán là chi phí nội bộ doanh nghiệp, không phải yếu tố hình thành kỳ vọng khách hàng.' },
]);

const c3 = doc('mkt202-3-1-extended-marketing-mix-7p', '3.1 — Extended marketing mix: the 7Ps for services|||3.1 — Marketing mix mở rộng: 7P cho dịch vụ',
  'Bốn P truyền thống (Product, Price, Place, Promotion) và ba P bổ sung riêng cho dịch vụ (People, Process, Physical evidence).',
  [[
    `<span class="eyebrow">MKT202 · Chapter 3 · Lesson 3.1</span>
<h2>The extended marketing mix: 7Ps for services</h2>
<p>The classic <strong>4Ps</strong> (Product, Price, Place, Promotion) were built for physical goods and do not capture how a service is actually delivered. Because of IHIP — especially inseparability — three more Ps are added.</p>
<pre><code>Traditional 4P            Added for services (3P)
------------------        -------------------------
Product                   People
Price                     Process
Place                     Physical evidence
Promotion
</code></pre>
<ul>
<li><strong>Product</strong> — the core service offering and any supplementary services around it (e.g. a hotel stay plus Wi-Fi, breakfast, concierge).</li>
<li><strong>Price</strong> — often harder to compare across providers (intangibility); psychological pricing and value perception matter more.</li>
<li><strong>Place</strong> — where and how the service is delivered: physical location, online, or a mix (omnichannel).</li>
<li><strong>Promotion</strong> — must work harder to make the intangible tangible (testimonials, guarantees, visuals of the process).</li>
<li><strong>People</strong> — employees ARE the product in the customer's eyes; hiring, training, and empowering front-line staff directly shapes quality.</li>
<li><strong>Process</strong> — the actual steps, flows, and procedures by which the service is delivered — a badly designed queue or approval chain destroys an otherwise good service.</li>
<li><strong>Physical evidence</strong> — the tangible cues surrounding an intangible service: building, uniforms, website design, receipts — all signal quality before, during, and after delivery.</li>
</ul>
<div class="callout"><span class="badge">Exam anchor</span> Be ready to map any real-life service example onto all 7 Ps — examiners often give a case (e.g. a coffee shop, a clinic) and ask you to identify each P.</div>`,
    `<span class="eyebrow">MKT202 · Chương 3 · Bài 3.1</span>
<h2>Marketing mix mở rộng: 7P cho dịch vụ</h2>
<p><strong>4P</strong> cổ điển (Product, Price, Place, Promotion) được xây cho hàng hoá vật chất và không phản ánh cách dịch vụ thực sự được cung cấp. Vì đặc điểm IHIP — đặc biệt là không thể tách rời — ba P bổ sung được thêm vào.</p>
<pre><code>4P truyền thống            3P bổ sung cho dịch vụ
------------------        -------------------------
Product (Sản phẩm)         People (Con người)
Price (Giá)                 Process (Quy trình)
Place (Phân phối)           Physical evidence (Bằng chứng vật chất)
Promotion (Chiêu thị)
</code></pre>
<ul>
<li><strong>Product</strong> — dịch vụ cốt lõi và các dịch vụ bổ trợ quanh nó (vd một đêm khách sạn kèm Wi-Fi, bữa sáng, lễ tân hỗ trợ).</li>
<li><strong>Price</strong> — thường khó so sánh giữa các nhà cung cấp (vì vô hình); định giá tâm lý và nhận thức giá trị quan trọng hơn.</li>
<li><strong>Place</strong> — dịch vụ được cung cấp ở đâu và bằng cách nào: tại chỗ, trực tuyến, hay kết hợp (đa kênh/omnichannel).</li>
<li><strong>Promotion</strong> — phải làm việc nhiều hơn để biến cái vô hình thành hữu hình (lời chứng thực, bảo đảm, hình ảnh minh hoạ quy trình).</li>
<li><strong>People</strong> — nhân viên CHÍNH LÀ sản phẩm trong mắt khách hàng; tuyển dụng, đào tạo, và trao quyền cho nhân viên tuyến đầu định hình trực tiếp chất lượng.</li>
<li><strong>Process</strong> — các bước, luồng, và thủ tục thực tế mà dịch vụ được cung cấp qua — một hàng chờ thiết kế tồi hay chuỗi phê duyệt rắc rối có thể phá hỏng một dịch vụ vốn tốt.</li>
<li><strong>Physical evidence</strong> — các tín hiệu hữu hình quanh một dịch vụ vô hình: toà nhà, đồng phục, thiết kế website, hoá đơn — tất cả báo hiệu chất lượng trước, trong, và sau khi cung cấp.</li>
</ul>
<div class="callout"><span class="badge">Mốc thi</span> Luôn sẵn sàng ánh xạ một ví dụ dịch vụ thực tế vào đủ 7P — đề thi thường cho một case (vd quán cà phê, phòng khám) và yêu cầu chỉ ra từng P.</div>`,
  ]]);

const c3q = quiz('mkt202-quiz-3', 'Quiz 3 — Extended marketing mix 7P|||Quiz 3 — Marketing mix mở rộng 7P', [
  { id: 'q1', question: 'Ba P được bổ sung riêng cho dịch vụ (ngoài 4P truyền thống) là gì?', options: ['Product, Price, Place', 'People, Process, Physical evidence', 'Promotion, Positioning, Packaging', 'Performance, Perception, Perishability'], correctIndex: 1, explanation: 'Vì tính không tách rời của dịch vụ, marketing mix cần thêm People, Process, Physical evidence.' },
  { id: 'q2', question: 'Trong 7P, yếu tố nào coi nhân viên "chính là sản phẩm" trong mắt khách hàng?', options: ['Process', 'Physical evidence', 'People', 'Place'], correctIndex: 2, explanation: 'People: chất lượng nhân viên tuyến đầu trực tiếp là chất lượng dịch vụ khách hàng cảm nhận.' },
  { id: 'q3', question: 'Toà nhà, đồng phục, hoá đơn, thiết kế website — đây là ví dụ của yếu tố P nào?', options: ['Physical evidence (bằng chứng vật chất)', 'Process (quy trình)', 'Price (giá)', 'Promotion (chiêu thị)'], correctIndex: 0, explanation: 'Physical evidence là các tín hiệu hữu hình báo hiệu chất lượng của một dịch vụ vô hình.' },
]);

const c4 = doc('mkt202-4-1-gap-model-servqual', '4.1 — The GAP model & SERVQUAL|||4.1 — Mô hình khoảng cách GAP & SERVQUAL',
  'Mô hình khoảng cách chất lượng dịch vụ (Customer gap + 4 provider gaps) và 5 chiều đo SERVQUAL (RATER).',
  [[
    `<span class="eyebrow">MKT202 · Chapter 4 · Lesson 4.1</span>
<h2>The service-quality GAP model &amp; SERVQUAL</h2>
<h3>The customer gap</h3>
<p>The central gap in services marketing is the <strong>customer gap</strong>: the difference between <em>expected service</em> and <em>perceived service</em>. Closing it is the goal of every tool in this course. Behind it are four <strong>provider gaps</strong> that cause it:</p>
<pre><code>Gap 1  Listening gap   : not knowing what customers expect (weak market research)
Gap 2  Design gap      : wrong service standards/design for what customers expect
Gap 3  Performance gap : standards exist but employees don't deliver them (delivery gap)
Gap 4  Communication gap: advertising promises more than operations can deliver
                                    |
                                    v
                        CUSTOMER GAP = Expected service - Perceived service
</code></pre>
<h3>SERVQUAL — 5 dimensions (RATER)</h3>
<p>SERVQUAL is the most widely used instrument to measure the customer gap, scoring customer perceptions against five dimensions:</p>
<ul>
<li><strong>R</strong>eliability — performing the promised service dependably and accurately.</li>
<li><strong>A</strong>ssurance — knowledge and courtesy of employees; ability to inspire trust and confidence.</li>
<li><strong>T</strong>angibles — physical facilities, equipment, and appearance of personnel.</li>
<li><strong>E</strong>mpathy — caring, individualized attention given to customers.</li>
<li><strong>R</strong>esponsiveness — willingness to help customers and provide prompt service.</li>
</ul>
<div class="callout"><span class="badge">Exam anchor</span> "RATER" is the standard mnemonic — memorize the order and be able to classify a complaint (e.g. "the doctor was rushed and dismissive" = low Empathy) into the correct dimension.</div>`,
    `<span class="eyebrow">MKT202 · Chương 4 · Bài 4.1</span>
<h2>Mô hình khoảng cách chất lượng dịch vụ &amp; SERVQUAL</h2>
<h3>Khoảng cách khách hàng (customer gap)</h3>
<p>Khoảng cách trung tâm trong marketing dịch vụ là <strong>khoảng cách khách hàng</strong>: sự khác biệt giữa <em>dịch vụ mong đợi</em> và <em>dịch vụ cảm nhận</em>. Thu hẹp khoảng cách này là mục tiêu của mọi công cụ trong môn học. Phía sau nó là bốn <strong>khoảng cách của nhà cung cấp</strong> gây ra nó:</p>
<pre><code>Gap 1  Khoảng cách lắng nghe : không biết khách hàng mong đợi gì (nghiên cứu thị trường yếu)
Gap 2  Khoảng cách thiết kế  : tiêu chuẩn/thiết kế dịch vụ sai so với mong đợi khách hàng
Gap 3  Khoảng cách thực hiện : có tiêu chuẩn nhưng nhân viên không thực hiện đúng
Gap 4  Khoảng cách truyền thông: quảng cáo hứa nhiều hơn khả năng vận hành đáp ứng
                                    |
                                    v
              KHOẢNG CÁCH KHÁCH HÀNG = Dịch vụ mong đợi - Dịch vụ cảm nhận
</code></pre>
<h3>SERVQUAL — 5 chiều đo (RATER)</h3>
<p>SERVQUAL là công cụ được dùng rộng rãi nhất để đo khoảng cách khách hàng, chấm điểm cảm nhận khách hàng theo năm chiều:</p>
<ul>
<li><strong>R</strong>eliability (Tin cậy) — thực hiện đúng lời hứa dịch vụ một cách đáng tin và chính xác.</li>
<li><strong>A</strong>ssurance (Đảm bảo) — kiến thức và sự lễ độ của nhân viên; khả năng tạo niềm tin.</li>
<li><strong>T</strong>angibles (Hữu hình) — cơ sở vật chất, thiết bị, và ngoại hình nhân viên.</li>
<li><strong>E</strong>mpathy (Đồng cảm) — sự quan tâm, chăm sóc cá nhân hoá dành cho khách hàng.</li>
<li><strong>R</strong>esponsiveness (Đáp ứng) — sẵn lòng giúp đỡ khách hàng và cung cấp dịch vụ nhanh chóng.</li>
</ul>
<div class="callout"><span class="badge">Mốc thi</span> "RATER" là từ viết tắt chuẩn — nhớ đúng thứ tự và biết phân loại một lời phàn nàn (vd "bác sĩ vội vàng và lạnh nhạt" = thiếu Empathy) vào đúng chiều đo.</div>`,
  ]]);

const c4q = quiz('mkt202-quiz-4', 'Quiz 4 — GAP model & SERVQUAL|||Quiz 4 — Mô hình GAP & SERVQUAL', [
  { id: 'q1', question: '"Khoảng cách khách hàng" (customer gap) trong mô hình GAP được định nghĩa là gì?', options: ['Giá bán trừ giá vốn', 'Dịch vụ mong đợi trừ Dịch vụ cảm nhận', 'Số lượng nhân viên trừ số lượng khách hàng', 'Doanh thu trừ chi phí marketing'], correctIndex: 1, explanation: 'Customer gap = Expected service - Perceived service, khoảng cách trung tâm cần thu hẹp.' },
  { id: 'q2', question: 'Doanh nghiệp có tiêu chuẩn dịch vụ tốt nhưng nhân viên không thực hiện đúng tiêu chuẩn đó — đây là khoảng cách nào?', options: ['Gap 1 — Khoảng cách lắng nghe', 'Gap 2 — Khoảng cách thiết kế', 'Gap 3 — Khoảng cách thực hiện', 'Gap 4 — Khoảng cách truyền thông'], correctIndex: 2, explanation: 'Gap 3 (performance/delivery gap): tiêu chuẩn tồn tại nhưng nhân viên không đưa nó vào thực hiện.' },
  { id: 'q3', question: 'Khách hàng phàn nàn "nhân viên lễ độ nhưng không có kiến thức để tư vấn, tôi không tin tưởng" — thiếu chiều SERVQUAL nào?', options: ['Tangibles (Hữu hình)', 'Assurance (Đảm bảo)', 'Empathy (Đồng cảm)', 'Reliability (Tin cậy)'], correctIndex: 1, explanation: 'Assurance gồm kiến thức nhân viên và khả năng tạo niềm tin — đây chính là điều bị thiếu.' },
]);

const c5 = doc('mkt202-5-1-people-process-physical-evidence', '5.1 — People, process & physical evidence: the servicescape|||5.1 — Con người, quy trình & bằng chứng vật chất: servicescape',
  'Vai trò nhân viên tuyến đầu & khách hàng đồng sản xuất; thiết kế quy trình & service blueprint; servicescape (ambient, không gian, ký hiệu).',
  [[
    `<span class="eyebrow">MKT202 · Chapter 5 · Lesson 5.1</span>
<h2>People, process &amp; physical evidence: the servicescape</h2>
<h3>People: employees and customers as co-producers</h3>
<p>Because of inseparability, front-line employees ("boundary spanners") represent the organization AND must satisfy the customer, often under conflicting pressures (efficiency vs. personal attention). Customers themselves are often <strong>co-producers</strong> — a gym member has to show up and do the reps; a self-checkout customer scans their own items. Poorly designed customer participation (a confusing self-service kiosk) can sink an otherwise good service.</p>
<h3>Process: the service blueprint</h3>
<p>A <strong>service blueprint</strong> maps every step of a service process, split into what the customer does, what is visible to them ("onstage"), and what happens behind the scenes ("backstage"), separated by the <strong>line of visibility</strong>.</p>
<pre><code>Customer actions      : arrive -> order -> wait -> receive -> pay -> leave
------------ line of visibility --------------------------------------
Onstage (visible)     : greeter -> cashier -> barista makes drink -> hands it over
------------ line of internal interaction ------------------------------
Backstage (invisible) : inventory restock, bean roasting, equipment maintenance
</code></pre>
<h3>Physical evidence: the servicescape</h3>
<p>The <strong>servicescape</strong> is the physical environment where the service is delivered, shaping perception through three dimensions: <strong>ambient conditions</strong> (temperature, lighting, music, scent), <strong>space/function</strong> (layout, equipment, furnishings), and <strong>signs/symbols/artifacts</strong> (signage, personal artifacts, style of décor).</p>
<div class="callout"><span class="badge">Manager takeaway</span> The servicescape can be used to attract the right customers, signal the intended positioning (a spa vs. a gym), guide customer flow, and even influence employee mood and productivity.</div>`,
    `<span class="eyebrow">MKT202 · Chương 5 · Bài 5.1</span>
<h2>Con người, quy trình &amp; bằng chứng vật chất: servicescape</h2>
<h3>People: nhân viên và khách hàng cùng đồng sản xuất</h3>
<p>Vì tính không thể tách rời, nhân viên tuyến đầu ("boundary spanners") đại diện cho tổ chức VÀ phải làm hài lòng khách hàng, thường dưới áp lực xung đột (hiệu quả vs. sự quan tâm cá nhân). Khách hàng chính họ thường là <strong>người đồng sản xuất</strong> — hội viên gym phải tự đến và tập; khách tự thanh toán phải tự quét sản phẩm. Thiết kế tồi cho sự tham gia của khách hàng (kiosk tự phục vụ gây rối) có thể phá hỏng một dịch vụ vốn tốt.</p>
<h3>Process: service blueprint</h3>
<p>Một <strong>service blueprint</strong> vẽ mọi bước của quy trình dịch vụ, chia thành phần khách hàng làm, phần khách hàng nhìn thấy ("onstage" - trên sân khấu), và phần diễn ra ẩn sau ("backstage" - hậu trường), tách bởi <strong>đường tầm nhìn (line of visibility)</strong>.</p>
<pre><code>Hành động khách hàng    : đến -> gọi món -> chờ -> nhận -> trả tiền -> ra đi
------------ đường tầm nhìn ----------------------------------------------
Trên sân khấu (thấy được): người chào -> nhân viên thu ngân -> barista pha -> trao ly
------------ đường tương tác nội bộ --------------------------------------
Hậu trường (không thấy) : nhập kho, rang cà phê, bảo trì thiết bị
</code></pre>
<h3>Physical evidence: servicescape</h3>
<p><strong>Servicescape</strong> là môi trường vật chất nơi dịch vụ được cung cấp, định hình nhận thức qua ba chiều: <strong>điều kiện xung quanh</strong> (nhiệt độ, ánh sáng, nhạc, mùi hương), <strong>không gian/công năng</strong> (bố cục, thiết bị, nội thất), và <strong>bảng hiệu/biểu tượng/vật trang trí</strong> (chỉ dẫn, đồ vật cá nhân, phong cách trang trí).</p>
<div class="callout"><span class="badge">Bài học cho nhà quản lý</span> Servicescape có thể dùng để thu hút đúng khách hàng mục tiêu, báo hiệu định vị mong muốn (spa vs. gym), dẫn dòng di chuyển khách hàng, và cả tác động đến tâm trạng &amp; năng suất nhân viên.</div>`,
  ]]);

const c5q = quiz('mkt202-quiz-5', 'Quiz 5 — People, process & servicescape|||Quiz 5 — Con người, quy trình & servicescape', [
  { id: 'q1', question: 'Trong service blueprint, "đường tầm nhìn" (line of visibility) tách biệt điều gì?', options: ['Khách hàng cũ và khách hàng mới', 'Phần khách hàng nhìn thấy (onstage) và phần hậu trường (backstage)', 'Giá cao và giá thấp', 'Nhân viên chính thức và nhân viên thời vụ'], correctIndex: 1, explanation: 'Line of visibility phân tách những gì khách hàng quan sát được (onstage) với hoạt động ẩn sau (backstage).' },
  { id: 'q2', question: 'Khách hàng tự quét sản phẩm ở quầy tự thanh toán là ví dụ của khái niệm nào?', options: ['Servicescape', 'Khách hàng như người đồng sản xuất (co-producer)', 'SERVQUAL', 'Zone of tolerance'], correctIndex: 1, explanation: 'Khi khách hàng tự thực hiện một phần quy trình dịch vụ, họ đóng vai trò đồng sản xuất.' },
  { id: 'q3', question: 'Nhiệt độ, ánh sáng, âm nhạc, mùi hương trong không gian dịch vụ thuộc chiều nào của servicescape?', options: ['Không gian/công năng', 'Bảng hiệu/biểu tượng', 'Điều kiện xung quanh (ambient conditions)', 'Đường tầm nhìn'], correctIndex: 2, explanation: 'Ambient conditions gồm nhiệt độ, ánh sáng, nhạc, mùi hương — một trong ba chiều của servicescape.' },
]);

const c6 = doc('mkt202-6-1-managing-supply-demand-productivity', '6.1 — Managing supply, demand & service productivity|||6.1 — Quản lý cung-cầu & năng suất dịch vụ',
  'Vì dịch vụ không lưu trữ được: các chiến lược khớp cung-cầu (điều chỉnh cầu, điều chỉnh cung), yield management, và cải thiện năng suất dịch vụ.',
  [[
    `<span class="eyebrow">MKT202 · Chapter 6 · Lesson 6.1</span>
<h2>Managing supply, demand &amp; service productivity</h2>
<h3>Why this matters: perishability</h3>
<p>Because services cannot be inventoried, unused capacity (an empty restaurant table, an idle hotel room) is lost revenue forever, while excess demand (a queue out the door) is lost business AND a quality problem. The core task is matching <strong>capacity</strong> (fixed in the short run: staff, seats, equipment) to <strong>fluctuating demand</strong>.</p>
<h3>Four capacity-demand patterns</h3>
<pre><code>Excess demand      : turn customers away - lost business, some customers permanently lost
Demand > optimum   : service quality declines - customers rushed or poorly served
Balanced            : demand and capacity are well matched - the ideal
Excess capacity     : wasted resources - staff idle, no revenue on that capacity
</code></pre>
<h3>Strategies</h3>
<ul>
<li><strong>Shift demand</strong> — differentiated pricing to shift demand to off-peak (e.g. matinee movie tickets), reservations, communicating peak times, offering complementary services during the wait.</li>
<li><strong>Adjust capacity</strong> — stretch existing capacity (extra seating), use part-time employees, cross-train employees to move between tasks, invite customer participation (self-service), share capacity with another firm, rent extra facilities.</li>
<li><strong>Yield management</strong> — dynamically adjusting price and allocation to maximize revenue from fixed capacity (classic in airlines and hotels: cheaper prices sold earlier, higher prices as capacity fills).</li>
</ul>
<h3>Service productivity</h3>
<p>Productivity in services is harder to define than in manufacturing — it must balance efficiency (output per input) with the customer's experienced quality; cutting staff to save cost often raises "efficiency" numbers while destroying the actual service experience.</p>
<div class="callout"><span class="badge">Exam anchor</span> Be able to classify a scenario into one of the four capacity-demand patterns AND propose the matching strategy (shift demand vs. adjust capacity vs. yield management).</div>`,
    `<span class="eyebrow">MKT202 · Chương 6 · Bài 6.1</span>
<h2>Quản lý cung, cầu &amp; năng suất dịch vụ</h2>
<h3>Vì sao quan trọng: tính không lưu trữ được</h3>
<p>Vì dịch vụ không thể tồn kho, công suất chưa dùng (một bàn trống ở nhà hàng, một phòng khách sạn trống) là doanh thu mất vĩnh viễn, còn cầu vượt quá (hàng chờ tràn ra cửa) là mất khách VÀ là vấn đề chất lượng. Nhiệm vụ cốt lõi là khớp <strong>công suất</strong> (cố định trong ngắn hạn: nhân viên, ghế, thiết bị) với <strong>cầu dao động</strong>.</p>
<h3>Bốn kiểu quan hệ cung-cầu</h3>
<pre><code>Cầu vượt công suất       : phải từ chối khách - mất doanh thu, một số khách mất vĩnh viễn
Cầu > mức tối ưu         : chất lượng dịch vụ giảm - khách bị vội hoặc phục vụ kém
Cân bằng                  : cầu và công suất khớp nhau - lý tưởng
Công suất dư thừa        : lãng phí nguồn lực - nhân viên rỗi, không có doanh thu trên công suất đó
</code></pre>
<h3>Chiến lược</h3>
<ul>
<li><strong>Điều chỉnh cầu</strong> — định giá phân biệt để đẩy cầu sang giờ thấp điểm (vd giá vé xem phim buổi chiều rẻ hơn), đặt trước, truyền thông giờ cao điểm, cung cấp dịch vụ bổ trợ trong khi khách chờ.</li>
<li><strong>Điều chỉnh cung</strong> — kéo giãn công suất hiện có (thêm ghế), dùng nhân viên bán thời gian, đào tạo đa kỹ năng để nhân viên chuyển giữa nhiệm vụ, mời khách hàng tham gia (tự phục vụ), chia sẻ công suất với doanh nghiệp khác, thuê thêm cơ sở.</li>
<li><strong>Yield management</strong> — điều chỉnh giá và phân bổ công suất linh động để tối đa hoá doanh thu từ công suất cố định (kinh điển ở hàng không và khách sạn: giá rẻ bán sớm, giá cao hơn khi công suất gần đầy).</li>
</ul>
<h3>Năng suất dịch vụ</h3>
<p>Năng suất trong dịch vụ khó định nghĩa hơn trong sản xuất — phải cân bằng giữa hiệu quả (đầu ra trên đầu vào) và chất lượng khách hàng cảm nhận; cắt giảm nhân viên để tiết kiệm chi phí thường làm số "hiệu quả" tăng nhưng lại phá hỏng trải nghiệm dịch vụ thật.</p>
<div class="callout"><span class="badge">Mốc thi</span> Phải phân loại được một tình huống vào một trong bốn kiểu quan hệ cung-cầu VÀ đề xuất đúng chiến lược (điều chỉnh cầu vs. điều chỉnh cung vs. yield management).</div>`,
  ]]);

const c6q = quiz('mkt202-quiz-6', 'Quiz 6 — Supply, demand & productivity|||Quiz 6 — Cung-cầu & năng suất', [
  { id: 'q1', question: 'Vì sao quản lý cung-cầu quan trọng hơn với dịch vụ so với hàng hoá?', options: ['Vì dịch vụ luôn rẻ hơn hàng hoá', 'Vì dịch vụ không thể lưu kho (perishability), công suất chưa dùng mất vĩnh viễn', 'Vì dịch vụ không cần nhân viên', 'Vì dịch vụ không có khách hàng cố định'], correctIndex: 1, explanation: 'Tính không lưu trữ được khiến công suất trống là mất doanh thu không thể bù lại.' },
  { id: 'q2', question: 'Rạp chiếu phim bán vé buổi chiều giá rẻ hơn buổi tối để kéo khách sang giờ ít đông là ví dụ của chiến lược nào?', options: ['Yield management thuần giá', 'Điều chỉnh cầu (shift demand) qua định giá phân biệt', 'Điều chỉnh cung bằng nhân viên bán thời gian', 'Servicescape'], correctIndex: 1, explanation: 'Định giá phân biệt theo giờ để dịch chuyển cầu sang giờ thấp điểm là chiến lược điều chỉnh cầu.' },
  { id: 'q3', question: 'Khi cầu vượt quá công suất tối ưu (nhưng chưa vượt công suất tối đa), điều gì thường xảy ra?', options: ['Chất lượng dịch vụ tăng vì nhiều khách hơn', 'Chất lượng dịch vụ giảm vì khách bị vội hoặc phục vụ kém', 'Không ảnh hưởng gì đến chất lượng', 'Công suất tự động tăng lên'], correctIndex: 1, explanation: 'Cầu vượt mức tối ưu (dù chưa vượt công suất tối đa) làm chất lượng trải nghiệm giảm.' },
]);

const c7 = doc('mkt202-7-1-service-recovery-loyalty', '7.1 — Service recovery & customer loyalty|||7.1 — Phục hồi dịch vụ & lòng trung thành khách hàng',
  'Vì sao dịch vụ luôn có lúc thất bại; nguyên tắc phục hồi dịch vụ hiệu quả (công bằng thủ tục/tương tác/kết quả), service recovery paradox, và xây lòng trung thành.',
  [[
    `<span class="eyebrow">MKT202 · Chapter 7 · Lesson 7.1</span>
<h2>Service recovery &amp; customer loyalty</h2>
<h3>Service failures are inevitable</h3>
<p>Because of heterogeneity and inseparability, some service failures WILL happen — no amount of training eliminates them completely. What separates great firms from average ones is not "zero failures" but excellent <strong>service recovery</strong>: the actions taken to resolve a problem and retain the customer's goodwill.</p>
<h3>Three types of fairness customers judge recovery on</h3>
<ul>
<li><strong>Outcome (distributive) fairness</strong> — did the compensation (refund, replacement, discount) match the size of the problem?</li>
<li><strong>Procedural fairness</strong> — was the process to resolve it reasonable, prompt, and not overly bureaucratic?</li>
<li><strong>Interactional fairness</strong> — were employees polite, empathetic, and did they explain what happened?</li>
</ul>
<h3>The service recovery paradox</h3>
<p>An excellent recovery from a failure can, in some cases, leave the customer <em>more</em> satisfied than if no failure had ever happened — because the firm demonstrated it truly cares when things go wrong. This is not a license to fail on purpose: it only works when failures are rare and the recovery is genuinely excellent.</p>
<h3>From recovery to loyalty</h3>
<p>Customer loyalty in services grows from consistently meeting or exceeding the zone of tolerance (Chapter 2), reinforced by loyalty programs, personalization, and — critically — how well the firm handles the failures that do occur. A loyal customer is more profitable over their lifetime and is a source of positive word-of-mouth, which (from Chapter 2) shapes other customers' expectations before they ever buy.</p>
<div class="callout"><span class="badge">Exam anchor</span> Be able to critique a recovery scenario against all three fairness types — examiners often give a complaint-handling case and ask what was done well/badly on each dimension.</div>`,
    `<span class="eyebrow">MKT202 · Chương 7 · Bài 7.1</span>
<h2>Phục hồi dịch vụ &amp; lòng trung thành khách hàng</h2>
<h3>Thất bại dịch vụ là không thể tránh khỏi</h3>
<p>Vì tính không đồng nhất và không thể tách rời, một số thất bại dịch vụ SẼ xảy ra — không đào tạo nào loại bỏ hoàn toàn được. Điều phân biệt doanh nghiệp xuất sắc với doanh nghiệp bình thường không phải là "không bao giờ thất bại" mà là <strong>phục hồi dịch vụ</strong> xuất sắc: hành động để giải quyết vấn đề và giữ lại sự hài lòng của khách hàng.</p>
<h3>Ba loại công bằng khách hàng dùng để đánh giá phục hồi</h3>
<ul>
<li><strong>Công bằng kết quả (outcome/distributive)</strong> — bồi thường (hoàn tiền, đổi lại, giảm giá) có tương xứng với mức độ vấn đề không?</li>
<li><strong>Công bằng thủ tục (procedural)</strong> — quy trình giải quyết có hợp lý, nhanh chóng, không quá rườm rà không?</li>
<li><strong>Công bằng tương tác (interactional)</strong> — nhân viên có lễ độ, đồng cảm, và có giải thích rõ chuyện gì xảy ra không?</li>
</ul>
<h3>Nghịch lý phục hồi dịch vụ (service recovery paradox)</h3>
<p>Một lần phục hồi xuất sắc sau thất bại, trong một số trường hợp, có thể khiến khách hàng hài lòng <em>hơn</em> so với khi không hề có thất bại — vì doanh nghiệp đã chứng minh họ thực sự quan tâm khi có sự cố. Đây KHÔNG phải giấy phép để cố tình làm sai: nó chỉ hiệu quả khi thất bại hiếm gặp và việc phục hồi thực sự xuất sắc.</p>
<h3>Từ phục hồi đến lòng trung thành</h3>
<p>Lòng trung thành khách hàng trong dịch vụ được xây từ việc đáp ứng hoặc vượt vùng chấp nhận (Chương 2) một cách nhất quán, cùng với chương trình khách hàng thân thiết, cá nhân hoá, và — quan trọng — cách doanh nghiệp xử lý những thất bại xảy ra. Một khách hàng trung thành có giá trị lâu dài cao hơn và là nguồn truyền miệng tích cực, điều này (theo Chương 2) định hình kỳ vọng của khách hàng khác trước cả khi họ mua.</p>
<div class="callout"><span class="badge">Mốc thi</span> Phải phân tích được một tình huống phục hồi dịch vụ theo đủ ba loại công bằng — đề thi thường cho case xử lý khiếu nại và hỏi điều gì làm tốt/chưa tốt ở từng chiều.</div>`,
  ]]);

const c7q = quiz('mkt202-quiz-7', 'Quiz 7 — Service recovery & loyalty|||Quiz 7 — Phục hồi dịch vụ & trung thành', [
  { id: 'q1', question: 'Khách hàng đánh giá "khoản bồi thường có tương xứng với thiệt hại không" — đây thuộc loại công bằng nào?', options: ['Công bằng thủ tục', 'Công bằng tương tác', 'Công bằng kết quả (distributive)', 'Công bằng cạnh tranh'], correctIndex: 2, explanation: 'Outcome/distributive fairness đánh giá mức bồi thường có tương xứng với vấn đề không.' },
  { id: 'q2', question: '"Nghịch lý phục hồi dịch vụ" (service recovery paradox) nói điều gì?', options: ['Khách hàng luôn ghét doanh nghiệp mắc lỗi, không thể cứu vãn', 'Một lần phục hồi xuất sắc đôi khi khiến khách hài lòng hơn cả khi chưa từng có lỗi', 'Doanh nghiệp nên cố tình gây lỗi để test khách hàng', 'Phục hồi dịch vụ không ảnh hưởng đến lòng trung thành'], correctIndex: 1, explanation: 'Recovery xuất sắc có thể vượt kỳ vọng ban đầu, nhưng chỉ khi lỗi hiếm và phục hồi thực sự tốt.' },
  { id: 'q3', question: 'Nhân viên xử lý khiếu nại chậm, quy trình rườm rà qua nhiều bước phê duyệt — đây là vấn đề ở loại công bằng nào?', options: ['Công bằng kết quả', 'Công bằng thủ tục (procedural)', 'Công bằng tương tác', 'Không thuộc loại công bằng nào'], correctIndex: 1, explanation: 'Procedural fairness đánh giá quy trình giải quyết có nhanh chóng, hợp lý, không rườm rà.' },
]);

const c8 = doc('mkt202-8-1-digital-services-marketing', '8.1 — Digital services marketing & trends|||8.1 — Marketing dịch vụ số & xu hướng',
  'Công nghệ tự phục vụ (SST), omnichannel, AI & cá nhân hoá dịch vụ, và các xu hướng đang thay đổi ngành dịch vụ.',
  [[
    `<span class="eyebrow">MKT202 · Chapter 8 · Lesson 8.1</span>
<h2>Digital services marketing &amp; trends</h2>
<h3>Self-service technologies (SST)</h3>
<p>SSTs — ATMs, airport check-in kiosks, e-commerce checkout, chatbots — remove the front-line employee from the encounter, shifting the "co-producer" role (Chapter 5) almost entirely onto the customer. Done well, SSTs raise convenience and cut costs; done poorly (confusing interface, no human fallback), they destroy the experience and violate the customer's zone of tolerance (Chapter 2).</p>
<h3>Omnichannel service delivery</h3>
<p>Customers now move fluidly between channels — browsing on an app, chatting with support online, then visiting in person — and expect the service experience (history, pricing, tone) to stay consistent across all of them. This is the modern "Place" P (Chapter 3) — no longer a single physical location.</p>
<h3>AI and personalization</h3>
<p>AI-driven chatbots, recommendation engines, and predictive service (e.g. a bank flagging a likely overdraft before it happens) let firms personalize at a scale no human staff could match — directly addressing the <strong>Empathy</strong> dimension of SERVQUAL (Chapter 4) through data rather than only through people.</p>
<h3>Other trends</h3>
<ul>
<li><strong>Subscription &amp; servitization</strong> — physical products increasingly sold as ongoing services (software-as-a-service, car subscriptions).</li>
<li><strong>Social media as a service channel</strong> — complaints and praise now happen publicly, making service recovery (Chapter 7) visible to far more than just the affected customer.</li>
<li><strong>Sustainability expectations</strong> — customers increasingly expect service providers to demonstrate environmental and social responsibility as part of the overall service experience.</li>
</ul>
<div class="callout"><span class="badge">Course wrap-up</span> Every framework in this course — IHIP, 7P, GAP/SERVQUAL, servicescape, capacity management, recovery — still applies in a digital channel; only the mechanics of delivery change.</div>`,
    `<span class="eyebrow">MKT202 · Chương 8 · Bài 8.1</span>
<h2>Marketing dịch vụ số &amp; xu hướng</h2>
<h3>Công nghệ tự phục vụ (SST)</h3>
<p>SST — máy ATM, kiosk check-in sân bay, thanh toán thương mại điện tử, chatbot — loại bỏ nhân viên tuyến đầu khỏi lần tương tác, chuyển vai trò "đồng sản xuất" (Chương 5) gần như hoàn toàn sang khách hàng. Làm tốt, SST tăng sự thuận tiện và giảm chi phí; làm tồi (giao diện gây rối, không có phương án chuyển sang người thật), nó phá hỏng trải nghiệm và vi phạm vùng chấp nhận của khách hàng (Chương 2).</p>
<h3>Cung cấp dịch vụ đa kênh (omnichannel)</h3>
<p>Khách hàng ngày nay di chuyển liền mạch giữa các kênh — xem trên app, chat với hỗ trợ trực tuyến, rồi ghé trực tiếp — và kỳ vọng trải nghiệm dịch vụ (lịch sử, giá cả, tông giọng) nhất quán ở mọi kênh. Đây là P "Place" hiện đại (Chương 3) — không còn là một địa điểm vật chất duy nhất.</p>
<h3>AI và cá nhân hoá</h3>
<p>Chatbot dựa trên AI, hệ thống gợi ý, và dịch vụ dự đoán (vd ngân hàng cảnh báo khả năng bị thấu chi trước khi nó xảy ra) cho phép doanh nghiệp cá nhân hoá ở quy mô mà không nhân viên nào theo được — trực tiếp giải quyết chiều <strong>Empathy</strong> của SERVQUAL (Chương 4) bằng dữ liệu thay vì chỉ bằng con người.</p>
<h3>Các xu hướng khác</h3>
<ul>
<li><strong>Đăng ký thuê bao & servitization</strong> — sản phẩm vật chất ngày càng được bán như dịch vụ liên tục (phần mềm dạng dịch vụ, thuê bao xe hơi).</li>
<li><strong>Mạng xã hội như một kênh dịch vụ</strong> — khiếu nại và lời khen giờ diễn ra công khai, khiến việc phục hồi dịch vụ (Chương 7) hiện diện trước nhiều người hơn chỉ khách hàng bị ảnh hưởng.</li>
<li><strong>Kỳ vọng bền vững</strong> — khách hàng ngày càng kỳ vọng nhà cung cấp dịch vụ thể hiện trách nhiệm môi trường và xã hội như một phần của trải nghiệm dịch vụ tổng thể.</li>
</ul>
<div class="callout"><span class="badge">Tổng kết môn</span> Mọi khung trong môn này — IHIP, 7P, GAP/SERVQUAL, servicescape, quản lý công suất, phục hồi dịch vụ — vẫn áp dụng trong kênh số; chỉ cơ chế cung cấp thay đổi.</div>`,
  ]]);

const c8q = quiz('mkt202-quiz-8', 'Quiz 8 — Digital services marketing|||Quiz 8 — Marketing dịch vụ số', [
  { id: 'q1', question: 'Công nghệ tự phục vụ (SST) như kiosk check-in làm gì với vai trò "đồng sản xuất" của khách hàng?', options: ['Loại bỏ hoàn toàn vai trò đồng sản xuất của khách hàng', 'Chuyển vai trò đồng sản xuất gần như hoàn toàn sang khách hàng', 'Không liên quan đến khái niệm đồng sản xuất', 'Chỉ áp dụng cho nhân viên, không áp dụng cho khách hàng'], correctIndex: 1, explanation: 'SST loại bỏ nhân viên tuyến đầu khỏi tương tác, khiến khách hàng tự thực hiện phần lớn quy trình.' },
  { id: 'q2', question: 'Kỳ vọng khách hàng về sự nhất quán trải nghiệm khi chuyển giữa app, chat, và tại điểm bán liên quan đến P nào trong 7P?', options: ['Price', 'Place (đã mở rộng thành omnichannel)', 'Physical evidence', 'People'], correctIndex: 1, explanation: 'Place hiện đại không còn là một địa điểm cố định mà là trải nghiệm nhất quán qua nhiều kênh.' },
  { id: 'q3', question: 'Chatbot AI cá nhân hoá dịch vụ theo dữ liệu khách hàng chủ yếu giải quyết chiều SERVQUAL nào?', options: ['Tangibles', 'Reliability', 'Empathy', 'Assurance'], correctIndex: 2, explanation: 'Cá nhân hoá bằng AI là một cách đạt được sự quan tâm cá nhân hoá (Empathy) ở quy mô lớn.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'MKT202',
    slug: 'mkt202-services-marketing-management',
    title: 'Services Marketing Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MKT202.webp',
    shortDescription: 'Marketing & managing services — IHIP traits, customer expectations, the 7P mix, GAP/SERVQUAL quality model, servicescape, demand-capacity management, service recovery & loyalty, digital trends. Bilingual, with frameworks & quizzes.|||Marketing & quản trị dịch vụ — đặc điểm IHIP, kỳ vọng khách hàng, marketing mix 7P, mô hình GAP/SERVQUAL, servicescape, quản lý cung-cầu, phục hồi dịch vụ & trung thành, xu hướng dịch vụ số. Song ngữ, có mô hình & quiz.',
    description: 'Môn <strong>MKT202 — Services Marketing Management</strong> (kỳ 4, khối Quản trị Kinh doanh) giúp hiểu <strong>vì sao dịch vụ khác hàng hoá và cách quản trị marketing dịch vụ</strong>. Từ <strong>bản chất dịch vụ</strong> (đặc điểm IHIP) → <strong>hành vi &amp; kỳ vọng khách hàng</strong> (zone of tolerance) → <strong>marketing mix mở rộng 7P</strong> → <strong>mô hình chất lượng GAP &amp; SERVQUAL</strong> → <strong>con người, quy trình &amp; servicescape</strong> → <strong>quản lý cung-cầu &amp; năng suất</strong> → <strong>phục hồi dịch vụ &amp; lòng trung thành</strong> → <strong>marketing dịch vụ số</strong>. Bám giáo trình Zeithaml/Bitner, Lovelock, Grönroos; song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Đặc điểm IHIP (Vô hình, Không đồng nhất, Không tách rời, Không lưu trữ); kỳ vọng khách hàng & zone of tolerance; marketing mix 7P (Product/Price/Place/Promotion/People/Process/Physical evidence); mô hình GAP (customer gap + 4 provider gaps) & SERVQUAL (RATER); service blueprint & servicescape; quản lý cung-cầu, yield management, năng suất dịch vụ; service recovery (3 loại công bằng), recovery paradox, lòng trung thành; SST, omnichannel, AI trong marketing dịch vụ.',
    requirements: 'Đã học các kiến thức marketing cơ bản (marketing mix 4P, hành vi khách hàng). Không yêu cầu công cụ đặc biệt.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách tham khảo, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao dịch vụ khác hàng hoá; lộ trình môn học.', lessons: [intro] },
    { title: 'Chương 1 — Bản chất dịch vụ & IHIP|||Chapter 1 — Nature of services & IHIP', description: 'Định nghĩa dịch vụ; đặc điểm IHIP.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hành vi & kỳ vọng khách hàng|||Chapter 2 — Consumer behavior & expectations', description: 'Zone of tolerance; yếu tố hình thành kỳ vọng.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Marketing mix mở rộng 7P|||Chapter 3 — Extended marketing mix 7P', description: '4P truyền thống + People, Process, Physical evidence.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Mô hình GAP & SERVQUAL|||Chapter 4 — GAP model & SERVQUAL', description: 'Customer gap, 4 provider gaps, RATER.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Con người, quy trình & servicescape|||Chapter 5 — People, process & servicescape', description: 'Service blueprint; servicescape.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Quản lý cung-cầu & năng suất|||Chapter 6 — Supply-demand & productivity', description: 'Yield management; chiến lược khớp cung-cầu.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Phục hồi dịch vụ & trung thành|||Chapter 7 — Service recovery & loyalty', description: '3 loại công bằng; recovery paradox.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Marketing dịch vụ số & xu hướng|||Chapter 8 — Digital services marketing & trends', description: 'SST, omnichannel, AI, xu hướng.', lessons: [c8, c8q] },
  ],
};
