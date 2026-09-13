/**
 * IMC201 — Introduction to Integrated Marketing Communication.
 * Nhập môn Truyền thông marketing tích hợp — ngành Công nghệ Truyền thông FPTU.
 * Môn KHÔNG có FLM syl → dựng theo giáo trình chuẩn quốc tế:
 *   Belch & Belch, "Advertising and Promotion: An IMC Perspective";
 *   Schultz, "Integrated Marketing Communications"; AdAge; WARC.
 * Song ngữ VI+EN, ví dụ chiến dịch thật, quiz mỗi chương.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('imc201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách chuẩn (Belch & Belch, Schultz), tạp chí ngành (AdAge, WARC, Campaign), khoá học miễn phí, kênh YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">IMC201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Integrated Marketing Communication (IMC)</strong> — how a brand plans and delivers <strong>one voice</strong> across advertising, PR, promotions, direct, personal selling and digital — gathered in one place. Below are widely used textbooks and free, legal resources.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><strong>Belch &amp; Belch</strong> — <em>Advertising and Promotion: An Integrated Marketing Communications Perspective</em> (McGraw-Hill). The standard IMC textbook.</li>
<li><strong>Don Schultz</strong> — <em>Integrated Marketing Communications</em> — the book that named the discipline.</li>
<li><strong>Kotler &amp; Keller</strong> — <em>Marketing Management</em> — the "promotion" (communication) chapters.</li>
</ul>
<h3>🌐 Industry press &amp; free resources</h3>
<ul>
<li><a href="https://adage.com/" target="_blank" rel="noopener">AdAge</a> — campaigns, brands &amp; advertising news.</li>
<li><a href="https://www.warc.com/" target="_blank" rel="noopener">WARC</a> — evidence &amp; case studies on what works in marketing.</li>
<li><a href="https://www.thinkwithgoogle.com/" target="_blank" rel="noopener">Think with Google</a> — data, trends &amp; measurement.</li>
<li><a href="https://www.campaignlive.com/" target="_blank" rel="noopener">Campaign</a> — creative &amp; media industry news.</li>
</ul>
<h3>▶️ Learn for free</h3>
<ul>
<li><a href="https://skillshop.withgoogle.com/" target="_blank" rel="noopener">Google Skillshop</a> — Ads, Analytics &amp; measurement certifications.</li>
<li><a href="https://www.facebook.com/business/learn" target="_blank" rel="noopener">Meta Blueprint</a> — social &amp; paid social advertising.</li>
<li><a href="https://academy.hubspot.com/" target="_blank" rel="noopener">HubSpot Academy</a> — content, inbound &amp; digital marketing.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what IMC is, why "one voice", the communication process &amp; response models (AIDA).</li>
<li><strong>Plan</strong> — situation analysis (SWOT), audience, and objectives (DAGMAR / SMART).</li>
<li><strong>Create &amp; deliver</strong> — message strategy &amp; the big idea; the promotion mix; media planning &amp; budgets.</li>
<li><strong>Digital &amp; measure</strong> — social, content &amp; influencer; then KPIs, brand lift, ROI &amp; attribution.</li>
</ol></div>`,
    `<span class="eyebrow">IMC201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Truyền thông marketing tích hợp (IMC)</strong> — cách một thương hiệu lập kế hoạch và truyền tải <strong>một tiếng nói thống nhất</strong> xuyên suốt quảng cáo, PR, khuyến mãi, direct, bán hàng cá nhân và digital — gom về một chỗ. Bên dưới là sách giáo khoa chuẩn và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Sách nền tảng</h3>
<ul>
<li><strong>Belch &amp; Belch</strong> — <em>Advertising and Promotion: An Integrated Marketing Communications Perspective</em> (McGraw-Hill). Giáo trình IMC chuẩn.</li>
<li><strong>Don Schultz</strong> — <em>Integrated Marketing Communications</em> — cuốn sách đặt tên cho ngành này.</li>
<li><strong>Kotler &amp; Keller</strong> — <em>Marketing Management</em> — các chương về "promotion" (truyền thông).</li>
</ul>
<h3>🌐 Báo ngành &amp; nguồn miễn phí</h3>
<ul>
<li><a href="https://adage.com/" target="_blank" rel="noopener">AdAge</a> — tin chiến dịch, thương hiệu &amp; quảng cáo.</li>
<li><a href="https://www.warc.com/" target="_blank" rel="noopener">WARC</a> — bằng chứng &amp; case study về cái gì thực sự hiệu quả.</li>
<li><a href="https://www.thinkwithgoogle.com/" target="_blank" rel="noopener">Think with Google</a> — dữ liệu, xu hướng &amp; đo lường.</li>
<li><a href="https://www.campaignlive.com/" target="_blank" rel="noopener">Campaign</a> — tin ngành sáng tạo &amp; media.</li>
</ul>
<h3>▶️ Học miễn phí</h3>
<ul>
<li><a href="https://skillshop.withgoogle.com/" target="_blank" rel="noopener">Google Skillshop</a> — chứng chỉ Ads, Analytics &amp; đo lường.</li>
<li><a href="https://www.facebook.com/business/learn" target="_blank" rel="noopener">Meta Blueprint</a> — quảng cáo social &amp; paid social.</li>
<li><a href="https://academy.hubspot.com/" target="_blank" rel="noopener">HubSpot Academy</a> — content, inbound &amp; digital marketing.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — IMC là gì, vì sao "một tiếng nói", quy trình truyền thông &amp; mô hình phản hồi (AIDA).</li>
<li><strong>Lập kế hoạch</strong> — phân tích tình huống (SWOT), đối tượng, và mục tiêu (DAGMAR / SMART).</li>
<li><strong>Sáng tạo &amp; truyền tải</strong> — chiến lược thông điệp &amp; big idea; promotion mix; media planning &amp; ngân sách.</li>
<li><strong>Digital &amp; đo lường</strong> — social, content &amp; influencer; rồi KPI, brand lift, ROI &amp; attribution.</li>
</ol></div>`,
  ]]);

const intro = doc('imc201-0-1-overview', 'Course overview: what is IMC?|||Tổng quan: IMC là gì?',
  'IMC làm gì; vì sao thương hiệu phải nói bằng một tiếng nói; lộ trình: khái niệm & mô hình → lập kế hoạch & mục tiêu → thông điệp & công cụ → digital & đo lường.',
  [[
    `<span class="eyebrow">IMC201 · Lesson 0.1 · Overview</span>
<h2>What is Integrated Marketing Communication?</h2>
<p class="lead"><strong>Integrated Marketing Communication (IMC)</strong> is the practice of coordinating <em>every</em> way a brand talks to its audience — advertising, PR, sales promotion, direct marketing, personal selling and digital/social — so they carry <strong>one consistent message</strong> and reinforce each other.</p>
<h3>Why "integrated"?</h3>
<p>A customer does not experience your TV ad, your Instagram post and your in-store promotion as separate things — they experience one brand. If those touchpoints say different things, trust leaks away. IMC makes them say <strong>one voice, one look, one story</strong>.</p>
<h3>What you will learn</h3>
<ul>
<li><strong>Concepts &amp; models</strong> — how communication works (sender–receiver), and how people respond (AIDA, hierarchy of effects).</li>
<li><strong>Planning</strong> — situation analysis (SWOT), audience, and clear objectives (DAGMAR / SMART).</li>
<li><strong>Creative &amp; tools</strong> — positioning, the big idea, appeals; and the promotion mix of communication tools.</li>
<li><strong>Media &amp; measurement</strong> — media planning &amp; budgets, digital/social/influencer, and campaign KPIs, ROI &amp; attribution.</li>
</ul>
<div class="callout"><span class="badge">Course promise</span> By the end you can read a real campaign — Nike, Dove, Coca-Cola, Spotify — and explain <em>why</em> it was built the way it was, then sketch an integrated plan of your own.</div>`,
    `<span class="eyebrow">IMC201 · Bài 0.1 · Tổng quan</span>
<h2>Truyền thông marketing tích hợp là gì?</h2>
<p class="lead"><strong>Truyền thông marketing tích hợp (IMC)</strong> là việc phối hợp <em>mọi</em> cách một thương hiệu nói với công chúng — quảng cáo, PR, khuyến mãi, direct marketing, bán hàng cá nhân và digital/social — sao cho chúng mang <strong>một thông điệp nhất quán</strong> và củng cố lẫn nhau.</p>
<h3>Vì sao phải "tích hợp"?</h3>
<p>Khách hàng không trải nghiệm quảng cáo TV, bài Instagram và khuyến mãi tại cửa hàng như những thứ rời rạc — họ trải nghiệm một thương hiệu. Nếu các điểm chạm đó nói khác nhau, niềm tin rò rỉ dần. IMC làm chúng nói <strong>một tiếng nói, một diện mạo, một câu chuyện</strong>.</p>
<h3>Bạn sẽ học gì</h3>
<ul>
<li><strong>Khái niệm &amp; mô hình</strong> — truyền thông hoạt động thế nào (sender–receiver), và con người phản hồi ra sao (AIDA, hierarchy of effects).</li>
<li><strong>Lập kế hoạch</strong> — phân tích tình huống (SWOT), đối tượng, và mục tiêu rõ ràng (DAGMAR / SMART).</li>
<li><strong>Sáng tạo &amp; công cụ</strong> — định vị, big idea, appeals; và promotion mix các công cụ truyền thông.</li>
<li><strong>Phương tiện &amp; đo lường</strong> — media planning &amp; ngân sách, digital/social/influencer, và KPI, ROI &amp; attribution của chiến dịch.</li>
</ul>
<div class="callout"><span class="badge">Cam kết của môn</span> Kết thúc môn, bạn có thể đọc một chiến dịch thật — Nike, Dove, Coca-Cola, Spotify — và giải thích <em>vì sao</em> nó được dựng như vậy, rồi phác một kế hoạch tích hợp của riêng mình.</div>`,
  ]]);

const c1 = doc('imc201-1-1-what-is-imc', '1.1 — What IMC is & the "one voice" idea|||1.1 — IMC là gì & ý tưởng "một tiếng nói"',
  'Định nghĩa IMC; vì sao tích hợp (điểm chạm rời rạc làm loãng thương hiệu); nguyên tắc one voice / one look; ví dụ Coca-Cola "Share a Coke", Dove "Real Beauty".',
  [[
    `<span class="eyebrow">IMC201 · Chapter 1 · Lesson 1.1</span>
<h2>What IMC is &amp; the "one voice" idea</h2>
<h3>Definition</h3>
<p><strong>IMC</strong> is a strategic process that plans, coordinates and evaluates all brand contacts a customer has — so that a single, clear, compelling message reaches them through the <em>right mix</em> of channels. Belch &amp; Belch stress the shift from thinking in <em>separate tools</em> (an "ad campaign", a "PR push") to thinking about the <strong>total customer experience</strong>.</p>
<h3>Why integrate?</h3>
<ul>
<li><strong>Consistency builds trust</strong> — repeated, aligned messages are easier to remember and believe.</li>
<li><strong>Channels multiply, audiences fragment</strong> — TV, search, social, retail, email: only integration keeps them on-message.</li>
<li><strong>Synergy</strong> — PR earns credibility, advertising builds reach, promotion drives action; together they do more than the sum of parts.</li>
</ul>
<h3>"One voice, one look"</h3>
<p>Every touchpoint should share the same core <strong>message</strong>, <strong>tone</strong> and <strong>visual identity</strong> — logo, colours, tagline, personality — so a customer instantly knows it is the same brand, whether on a billboard, a TikTok, or a shelf.</p>
<div class="callout"><span class="badge">Real campaign</span> <strong>Coca-Cola "Share a Coke"</strong> printed names on bottles and ran ONE idea — "share a Coke with someone" — identically across packaging, TV, out-of-home, social and in-store. Personalised bottles became earned media as people posted their names, lifting sales after years of decline. <strong>Dove "Real Beauty"</strong> is another: the same message about real, un-retouched beauty across ads, PR, film and social for over a decade.</div>`,
    `<span class="eyebrow">IMC201 · Chương 1 · Bài 1.1</span>
<h2>IMC là gì &amp; ý tưởng "một tiếng nói"</h2>
<h3>Định nghĩa</h3>
<p><strong>IMC</strong> là quy trình chiến lược lập kế hoạch, phối hợp và đánh giá mọi điểm chạm thương hiệu mà khách hàng gặp — sao cho một thông điệp duy nhất, rõ ràng, thuyết phục đến được với họ qua <em>tổ hợp kênh phù hợp</em>. Belch &amp; Belch nhấn mạnh sự dịch chuyển từ tư duy <em>công cụ rời rạc</em> (một "chiến dịch quảng cáo", một "đợt PR") sang tư duy về <strong>tổng trải nghiệm khách hàng</strong>.</p>
<h3>Vì sao phải tích hợp?</h3>
<ul>
<li><strong>Nhất quán tạo niềm tin</strong> — thông điệp lặp lại và ăn khớp thì dễ nhớ và dễ tin hơn.</li>
<li><strong>Kênh nhân lên, công chúng phân mảnh</strong> — TV, search, social, bán lẻ, email: chỉ tích hợp mới giữ chúng đúng thông điệp.</li>
<li><strong>Cộng hưởng (synergy)</strong> — PR tạo uy tín, quảng cáo tạo độ phủ, khuyến mãi thúc hành động; hợp lại lớn hơn tổng các phần.</li>
</ul>
<h3>"Một tiếng nói, một diện mạo"</h3>
<p>Mọi điểm chạm nên chia sẻ cùng một <strong>thông điệp</strong>, <strong>tông giọng</strong> và <strong>nhận diện thị giác</strong> — logo, màu, tagline, tính cách — để khách hàng nhận ra ngay đó là cùng một thương hiệu, dù trên billboard, một TikTok, hay trên kệ hàng.</p>
<div class="callout"><span class="badge">Chiến dịch thật</span> <strong>Coca-Cola "Share a Coke"</strong> in tên người lên chai và chạy MỘT ý tưởng — "chia sẻ một chai Coke với ai đó" — y hệt nhau xuyên bao bì, TV, out-of-home, social và tại cửa hàng. Chai cá nhân hoá thành earned media khi người ta đăng tên mình, kéo doanh số tăng trở lại sau nhiều năm giảm. <strong>Dove "Real Beauty"</strong> cũng vậy: cùng một thông điệp về vẻ đẹp thật, không chỉnh sửa, xuyên quảng cáo, PR, phim và social suốt hơn một thập kỷ.</div>`,
  ]]);

const c1q = quiz('imc201-quiz-1', 'Quiz 1 — What IMC is|||Quiz 1 — IMC là gì', [
  { id: 'q1', question: 'Ý tưởng cốt lõi của IMC là?|||The core idea of IMC is?', options: ['Chạy càng nhiều quảng cáo càng tốt|||Run as many ads as possible', 'Một tiếng nói nhất quán xuyên mọi điểm chạm|||One consistent voice across every touchpoint', 'Chỉ tập trung vào một kênh duy nhất|||Focus on only one single channel', 'Giảm giá sâu để bán nhanh|||Cut prices deeply to sell fast'], correctIndex: 1, explanation: 'IMC phối hợp mọi kênh để truyền một thông điệp nhất quán (one voice).' },
  { id: 'q2', question: '"Synergy" trong IMC nghĩa là?|||"Synergy" in IMC means?', options: ['Các công cụ hợp lại tạo hiệu quả lớn hơn tổng các phần|||Tools combined create more than the sum of parts', 'Mỗi công cụ chạy độc lập|||Each tool runs independently', 'Chỉ dùng PR miễn phí|||Use only free PR', 'Sao chép đối thủ|||Copy competitors'], correctIndex: 0, explanation: 'PR tạo uy tín, quảng cáo tạo độ phủ, khuyến mãi thúc hành động — cộng hưởng.' },
  { id: 'q3', question: 'Chiến dịch nào minh hoạ "one voice" xuyên nhiều kênh?|||Which campaign illustrates "one voice" across channels?', options: ['Một banner ngẫu nhiên|||A random banner', 'Coca-Cola "Share a Coke"|||Coca-Cola "Share a Coke"', 'Một email spam|||A spam email', 'Bảng giá nội bộ|||An internal price list'], correctIndex: 1, explanation: '"Share a Coke" chạy cùng một ý tưởng đồng bộ trên bao bì, TV, OOH, social và tại điểm bán.' },
]);

const c2 = doc('imc201-2-1-communication-models', '2.1 — The communication process & response models|||2.1 — Quy trình truyền thông & mô hình phản hồi',
  'Mô hình sender–receiver (nguồn, mã hoá, thông điệp, kênh, giải mã, người nhận, nhiễu, phản hồi); AIDA; hierarchy of effects (Lavidge–Steiner); ví dụ phễu Old Spice.',
  [[
    `<span class="eyebrow">IMC201 · Chapter 2 · Lesson 2.1</span>
<h2>The communication process &amp; response models</h2>
<h3>Sender–receiver model</h3>
<p>Communication is a chain, and it can break at any link:</p>
<pre><code>SOURCE -> encoding -> MESSAGE -> channel -> decoding -> RECEIVER
                          ^                                  |
                        NOISE  &lt;----- feedback -------------+</code></pre>
<ul>
<li><strong>Source / sender</strong> — the brand (or a spokesperson) with something to say.</li>
<li><strong>Encoding</strong> — turning the idea into words, images, symbols.</li>
<li><strong>Channel</strong> — the medium (TV, search, social, email, a salesperson).</li>
<li><strong>Decoding</strong> — how the receiver interprets it (shaped by their frame of reference).</li>
<li><strong>Noise</strong> — anything that distorts the message (clutter, competing ads, confusion).</li>
<li><strong>Feedback</strong> — the receiver's response (clicks, purchases, comments) that closes the loop.</li>
</ul>
<h3>Response models — AIDA</h3>
<p>People move through stages before buying. <strong>AIDA</strong>: <strong>A</strong>ttention → <strong>I</strong>nterest → <strong>D</strong>esire → <strong>A</strong>ction.</p>
<h3>Hierarchy of effects</h3>
<p>Lavidge &amp; Steiner expand this into <strong>Awareness → Knowledge → Liking → Preference → Conviction → Purchase</strong> — a ladder from "never heard of it" to "bought it". IMC picks tools for the rung the audience is on: awareness needs reach; conviction needs proof and testimonials.</p>
<div class="callout"><span class="badge">Real campaign</span> <strong>Old Spice "The Man Your Man Could Smell Like"</strong> used a viral TV/YouTube film to grab <em>Attention</em>, personalised response videos to build <em>Interest</em> and <em>Desire</em>, and coupons/retail to drive <em>Action</em> — a textbook AIDA funnel that roughly doubled sales.</div>`,
    `<span class="eyebrow">IMC201 · Chương 2 · Bài 2.1</span>
<h2>Quy trình truyền thông &amp; mô hình phản hồi</h2>
<h3>Mô hình sender–receiver</h3>
<p>Truyền thông là một chuỗi, và nó có thể đứt ở bất kỳ mắt xích nào:</p>
<pre><code>NGUỒN -> mã hoá -> THÔNG ĐIỆP -> kênh -> giải mã -> NGƯỜI NHẬN
                       ^                                    |
                     NHIỄU  &lt;----- phản hồi ----------------+</code></pre>
<ul>
<li><strong>Nguồn / người gửi</strong> — thương hiệu (hoặc người phát ngôn) có điều muốn nói.</li>
<li><strong>Mã hoá (encoding)</strong> — biến ý tưởng thành chữ, hình ảnh, biểu tượng.</li>
<li><strong>Kênh (channel)</strong> — phương tiện (TV, search, social, email, nhân viên bán hàng).</li>
<li><strong>Giải mã (decoding)</strong> — cách người nhận diễn giải (bị chi phối bởi khung tham chiếu của họ).</li>
<li><strong>Nhiễu (noise)</strong> — bất cứ thứ gì làm méo thông điệp (rối rắm, quảng cáo cạnh tranh, khó hiểu).</li>
<li><strong>Phản hồi (feedback)</strong> — đáp lại của người nhận (click, mua, bình luận) khép kín vòng lặp.</li>
</ul>
<h3>Mô hình phản hồi — AIDA</h3>
<p>Con người đi qua các bậc trước khi mua. <strong>AIDA</strong>: <strong>A</strong>ttention (chú ý) → <strong>I</strong>nterest (quan tâm) → <strong>D</strong>esire (khao khát) → <strong>A</strong>ction (hành động).</p>
<h3>Hierarchy of effects (bậc thang hiệu ứng)</h3>
<p>Lavidge &amp; Steiner mở rộng thành <strong>Nhận biết → Hiểu biết → Yêu thích → Ưa chuộng → Tin tưởng → Mua</strong> — một bậc thang từ "chưa từng nghe" đến "đã mua". IMC chọn công cụ cho đúng bậc công chúng đang đứng: nhận biết cần độ phủ; tin tưởng cần bằng chứng và lời chứng thực.</p>
<div class="callout"><span class="badge">Chiến dịch thật</span> <strong>Old Spice "The Man Your Man Could Smell Like"</strong> dùng phim TV/YouTube viral để giành <em>Chú ý</em>, video phản hồi cá nhân hoá để tạo <em>Quan tâm</em> và <em>Khao khát</em>, rồi coupon/bán lẻ để thúc <em>Hành động</em> — một phễu AIDA sách giáo khoa, giúp doanh số tăng gần gấp đôi.</div>`,
  ]]);

const c2q = quiz('imc201-quiz-2', 'Quiz 2 — Communication models|||Quiz 2 — Mô hình truyền thông', [
  { id: 'q1', question: 'Trong mô hình truyền thông, "noise" (nhiễu) là?|||In the communication model, "noise" is?', options: ['Ngân sách quảng cáo|||The advertising budget', 'Bất cứ thứ gì làm méo/cản thông điệp|||Anything that distorts or blocks the message', 'Phản hồi của khách hàng|||Customer feedback', 'Logo thương hiệu|||The brand logo'], correctIndex: 1, explanation: 'Noise = rối rắm, quảng cáo cạnh tranh, hiểu sai — làm méo thông điệp giữa gửi và nhận.' },
  { id: 'q2', question: 'Thứ tự đúng của mô hình AIDA?|||The correct order of AIDA?', options: ['Action → Interest → Desire → Attention', 'Attention → Interest → Desire → Action', 'Awareness → Action → Desire → Interest', 'Interest → Attention → Action → Desire'], correctIndex: 1, explanation: 'AIDA: Attention → Interest → Desire → Action.' },
  { id: 'q3', question: '"Hierarchy of effects" hữu ích vì?|||"Hierarchy of effects" is useful because?', options: ['Nó thay thế mọi loại quảng cáo|||It replaces all advertising', 'Giúp chọn công cụ đúng theo bậc nhận thức của công chúng|||It helps pick tools for the audience stage', 'Nó chỉ đo doanh thu|||It only measures revenue', 'Nó cấm dùng social|||It bans social media'], correctIndex: 1, explanation: 'Awareness cần độ phủ; conviction cần bằng chứng — chọn công cụ theo bậc thang.' },
]);

const c3 = doc('imc201-3-1-situation-objectives', '3.1 — Situation analysis & communication objectives|||3.1 — Phân tích tình huống & mục tiêu truyền thông',
  'SWOT; xác định đối tượng & phân khúc; đặt mục tiêu truyền thông bằng DAGMAR và tiêu chí SMART; phân biệt mục tiêu truyền thông với mục tiêu doanh số; ví dụ Airbnb.',
  [[
    `<span class="eyebrow">IMC201 · Chapter 3 · Lesson 3.1</span>
<h2>Situation analysis &amp; communication objectives</h2>
<h3>Start with a SWOT</h3>
<p>Before any creative, map the situation. A <strong>SWOT</strong> lists internal <strong>Strengths</strong> &amp; <strong>Weaknesses</strong> and external <strong>Opportunities</strong> &amp; <strong>Threats</strong> — grounding the plan in reality rather than guesswork.</p>
<h3>Who are we talking to?</h3>
<p>Define the <strong>target audience</strong> by <strong>segmentation</strong> — demographics, geography, psychographics (values, lifestyle) and behaviour (usage, loyalty). Then write a <strong>persona</strong> and an <strong>insight</strong>: the deep truth about the audience the campaign will speak to.</p>
<h3>Objectives: DAGMAR &amp; SMART</h3>
<p><strong>DAGMAR</strong> — "Defining Advertising Goals for Measured Advertising Results" — insists a communication goal be a <em>specific communication task</em> (e.g. raise awareness from 30% to 60%), not just "more sales". Objectives should be <strong>SMART</strong>:</p>
<pre><code>Specific   - a single clear task
Measurable - a number you can track
Achievable - realistic given budget
Relevant   - tied to the business goal
Time-bound - by a deadline</code></pre>
<p>Separate <strong>communication objectives</strong> (awareness, attitude, intent) from <strong>marketing/sales objectives</strong> (revenue, share) — advertising influences the mind; many things drive the final sale.</p>
<div class="callout"><span class="badge">Real campaign</span> <strong>Airbnb "Belong Anywhere"</strong> grew from a situation analysis: a strength (unique local stays), a threat (hotels + trust concerns). The objective was an <em>attitude</em> goal — reframe strangers' homes as belonging, not risk — measured by brand trust and bookings, not one ad's clicks.</div>`,
    `<span class="eyebrow">IMC201 · Chương 3 · Bài 3.1</span>
<h2>Phân tích tình huống &amp; mục tiêu truyền thông</h2>
<h3>Bắt đầu bằng SWOT</h3>
<p>Trước mọi ý tưởng sáng tạo, hãy vẽ bức tranh tình huống. <strong>SWOT</strong> liệt kê <strong>Điểm mạnh</strong> &amp; <strong>Điểm yếu</strong> bên trong và <strong>Cơ hội</strong> &amp; <strong>Thách thức</strong> bên ngoài — neo kế hoạch vào thực tế thay vì phỏng đoán.</p>
<h3>Chúng ta đang nói với ai?</h3>
<p>Xác định <strong>đối tượng mục tiêu</strong> bằng <strong>phân khúc (segmentation)</strong> — nhân khẩu, địa lý, tâm lý (giá trị, lối sống) và hành vi (mức dùng, lòng trung thành). Rồi viết một <strong>persona</strong> và một <strong>insight</strong>: sự thật ngầm hiểu sâu sắc về đối tượng mà chiến dịch sẽ chạm tới.</p>
<h3>Mục tiêu: DAGMAR &amp; SMART</h3>
<p><strong>DAGMAR</strong> — "Defining Advertising Goals for Measured Advertising Results" — đòi mục tiêu truyền thông phải là <em>một nhiệm vụ truyền thông cụ thể</em> (vd nâng nhận biết từ 30% lên 60%), chứ không chỉ "bán được nhiều hơn". Mục tiêu nên <strong>SMART</strong>:</p>
<pre><code>Specific   - một nhiệm vụ rõ ràng, duy nhất
Measurable - một con số đo được
Achievable - khả thi với ngân sách
Relevant   - gắn với mục tiêu kinh doanh
Time-bound - có hạn chót</code></pre>
<p>Tách <strong>mục tiêu truyền thông</strong> (nhận biết, thái độ, ý định) khỏi <strong>mục tiêu marketing/doanh số</strong> (doanh thu, thị phần) — quảng cáo tác động tới tâm trí; nhiều yếu tố mới quyết định lần mua cuối.</p>
<div class="callout"><span class="badge">Chiến dịch thật</span> <strong>Airbnb "Belong Anywhere"</strong> lớn lên từ một phân tích tình huống: điểm mạnh (chỗ ở địa phương độc đáo), thách thức (khách sạn + lo ngại niềm tin). Mục tiêu là một mục tiêu <em>thái độ</em> — định khung lại "ở nhà người lạ" thành sự thuộc về, không phải rủi ro — đo bằng niềm tin thương hiệu và lượt đặt phòng, không phải click của một mẩu quảng cáo.</div>`,
  ]]);

const c3q = quiz('imc201-quiz-3', 'Quiz 3 — Situation & objectives|||Quiz 3 — Tình huống & mục tiêu', [
  { id: 'q1', question: 'Trong SWOT, "Opportunities" và "Threats" là yếu tố?|||In SWOT, "Opportunities" and "Threats" are factors that are?', options: ['Bên trong doanh nghiệp|||Internal to the company', 'Bên ngoài (môi trường/thị trường)|||External (market/environment)', 'Chỉ về ngân sách|||Only about budget', 'Chỉ về sản phẩm|||Only about the product'], correctIndex: 1, explanation: 'Strengths/Weaknesses là nội bộ; Opportunities/Threats là bên ngoài.' },
  { id: 'q2', question: 'DAGMAR nhấn mạnh mục tiêu truyền thông phải?|||DAGMAR insists a communication objective must be?', options: ['Một nhiệm vụ truyền thông cụ thể, đo được|||A specific, measurable communication task', 'Luôn là "tăng doanh số"|||Always "increase sales"', 'Không cần con số|||Need no numbers', 'Do đối thủ quyết định|||Be decided by competitors'], correctIndex: 0, explanation: 'DAGMAR = mục tiêu là nhiệm vụ truyền thông cụ thể (vd nâng nhận biết), đo được.' },
  { id: 'q3', question: 'Chữ "M" trong mục tiêu SMART là?|||The "M" in a SMART objective is?', options: ['Marketing', 'Measurable (đo được)|||Measurable', 'Money', 'Media'], correctIndex: 1, explanation: 'SMART: Specific, Measurable, Achievable, Relevant, Time-bound.' },
]);

const c4 = doc('imc201-4-1-message-creative', '4.1 — Message strategy & the creative big idea|||4.1 — Chiến lược thông điệp & big idea sáng tạo',
  'Định vị (positioning) & value proposition; big idea; các loại appeal (lý tính, cảm xúc, hài hước, sợ hãi); USP; ví dụ Nike "Just Do It", Apple "Think Different", Dove.',
  [[
    `<span class="eyebrow">IMC201 · Chapter 4 · Lesson 4.1</span>
<h2>Message strategy &amp; the creative big idea</h2>
<h3>Positioning</h3>
<p><strong>Positioning</strong> is the place your brand owns in the customer's mind relative to rivals — "the safest car", "the challenger", "the premium choice". Everything creative flows from a sharp position and a clear <strong>value proposition</strong> (the promise of value you deliver).</p>
<h3>The big idea</h3>
<p>A <strong>big idea</strong> is a single, memorable creative concept that can carry a campaign across years and channels. It is not a slogan — it is the thought the slogan expresses.</p>
<h3>Appeals — how the message persuades</h3>
<ul>
<li><strong>Rational</strong> — features, price, proof, USP (unique selling proposition).</li>
<li><strong>Emotional</strong> — belonging, pride, love, humour, fear.</li>
<li><strong>Humour</strong> — likeable and shareable, but can overshadow the product.</li>
<li><strong>Fear / anxiety</strong> — used carefully in health &amp; safety (smoking, insurance).</li>
</ul>
<div class="callout"><span class="badge">Real campaigns</span> <strong>Nike "Just Do It"</strong> — one big idea (personal determination) has run for decades across every sport and channel. <strong>Apple "Think Different"</strong> positioned Apple as the creative rebel's brand. <strong>Dove "Real Beauty"</strong> used an emotional appeal to own a distinct position (authentic beauty) against glossy rivals — showing a big idea and a position are the engine of an integrated campaign.</div>`,
    `<span class="eyebrow">IMC201 · Chương 4 · Bài 4.1</span>
<h2>Chiến lược thông điệp &amp; big idea sáng tạo</h2>
<h3>Định vị (positioning)</h3>
<p><strong>Định vị</strong> là chỗ đứng thương hiệu chiếm trong tâm trí khách hàng so với đối thủ — "chiếc xe an toàn nhất", "kẻ thách thức", "lựa chọn cao cấp". Mọi thứ sáng tạo chảy ra từ một định vị sắc nét và một <strong>value proposition (tuyên bố giá trị)</strong> rõ ràng.</p>
<h3>Big idea</h3>
<p><strong>Big idea</strong> là một ý tưởng sáng tạo duy nhất, dễ nhớ, đủ sức mang cả chiến dịch xuyên nhiều năm và nhiều kênh. Nó không phải câu slogan — nó là ý tưởng mà slogan diễn đạt.</p>
<h3>Appeals — thông điệp thuyết phục thế nào</h3>
<ul>
<li><strong>Lý tính (rational)</strong> — tính năng, giá, bằng chứng, USP (điểm bán độc đáo).</li>
<li><strong>Cảm xúc (emotional)</strong> — sự thuộc về, niềm tự hào, tình yêu, hài hước, sợ hãi.</li>
<li><strong>Hài hước</strong> — dễ mến và dễ chia sẻ, nhưng có thể lấn át sản phẩm.</li>
<li><strong>Sợ hãi / lo lắng</strong> — dùng thận trọng trong sức khoẻ &amp; an toàn (thuốc lá, bảo hiểm).</li>
</ul>
<div class="callout"><span class="badge">Chiến dịch thật</span> <strong>Nike "Just Do It"</strong> — một big idea (quyết tâm cá nhân) chạy hàng thập kỷ xuyên mọi môn thể thao và mọi kênh. <strong>Apple "Think Different"</strong> định vị Apple là thương hiệu của kẻ nổi loạn sáng tạo. <strong>Dove "Real Beauty"</strong> dùng appeal cảm xúc để chiếm một định vị riêng (vẻ đẹp chân thật) trước các đối thủ bóng bẩy — cho thấy big idea và định vị là động cơ của một chiến dịch tích hợp.</div>`,
  ]]);

const c4q = quiz('imc201-quiz-4', 'Quiz 4 — Message & creative|||Quiz 4 — Thông điệp & sáng tạo', [
  { id: 'q1', question: '"Positioning" (định vị) là?|||"Positioning" is?', options: ['Vị trí đặt billboard|||Where a billboard is placed', 'Chỗ đứng thương hiệu trong tâm trí khách hàng so với đối thủ|||The place a brand owns in the customer mind vs rivals', 'Ngân sách media|||The media budget', 'Số nhân viên bán hàng|||The number of salespeople'], correctIndex: 1, explanation: 'Định vị = chỗ đứng riêng của thương hiệu trong tâm trí, so với đối thủ.' },
  { id: 'q2', question: '"Big idea" khác slogan ở chỗ?|||A "big idea" differs from a slogan in that?', options: ['Chúng hoàn toàn giống nhau|||They are exactly the same', 'Big idea là ý tưởng cốt lõi mà slogan chỉ diễn đạt|||The big idea is the core concept the slogan expresses', 'Slogan luôn dài hơn|||A slogan is always longer', 'Big idea chỉ dùng cho PR|||Big idea is only for PR'], correctIndex: 1, explanation: 'Big idea là ý tưởng nền; slogan là cách diễn đạt ngắn gọn của nó.' },
  { id: 'q3', question: 'Chiến dịch chống thuốc lá thường dùng loại appeal nào?|||Anti-smoking campaigns often use which appeal?', options: ['Hài hước|||Humour', 'Sợ hãi / lo lắng (dùng thận trọng)|||Fear / anxiety (used carefully)', 'Giảm giá|||Discount', 'USP kỹ thuật|||Technical USP'], correctIndex: 1, explanation: 'Appeal sợ hãi hay dùng trong sức khoẻ và an toàn, cần dùng có chừng mực.' },
]);

const c5 = doc('imc201-5-1-promotion-mix', '5.1 — The IMC tools (promotion mix)|||5.1 — Bộ công cụ IMC (promotion mix)',
  'Sáu công cụ: quảng cáo, khuyến mãi (sales promotion), PR & publicity, direct marketing, personal selling, digital; điểm mạnh/yếu và khi nào dùng; ví dụ Red Bull, IKEA.',
  [[
    `<span class="eyebrow">IMC201 · Chapter 5 · Lesson 5.1</span>
<h2>The IMC tools — the promotion mix</h2>
<p>IMC blends six main tools. Each has a job; integration decides the balance.</p>
<ul>
<li><strong>Advertising</strong> — paid, non-personal mass messages (TV, print, out-of-home, online). Great for <em>reach</em> &amp; brand-building; low credibility, high cost.</li>
<li><strong>Sales promotion</strong> — short-term incentives (coupons, discounts, samples, contests). Drives <em>immediate action</em>; can erode brand if overused.</li>
<li><strong>Public relations &amp; publicity</strong> — earned coverage, events, sponsorship, CSR. High <em>credibility</em>; less control over the message.</li>
<li><strong>Direct marketing</strong> — one-to-one, measurable (email, catalogues, SMS, targeted mail). <em>Personalised</em> &amp; trackable.</li>
<li><strong>Personal selling</strong> — face-to-face persuasion. Powerful for <em>complex/high-value</em> sales; costly per contact.</li>
<li><strong>Digital / interactive</strong> — search, social, content, influencer, display. Targeted, two-way, measurable (see Chapter 7).</li>
</ul>
<h3>Push vs pull</h3>
<p><strong>Push</strong> aims at the trade/retailer (personal selling, trade promotion) to push product down the channel; <strong>pull</strong> aims at consumers (advertising, promotions) to pull product through by creating demand.</p>
<div class="callout"><span class="badge">Real campaigns</span> <strong>Red Bull</strong> leans on PR/events &amp; sponsorship (Stratos space jump, extreme sports) far more than classic ads — "Red Bull gives you wings" earned through spectacle. <strong>IKEA</strong> built decades of demand on a direct-marketing pillar — the catalogue — integrated with stores and, later, digital.</div>`,
    `<span class="eyebrow">IMC201 · Chương 5 · Bài 5.1</span>
<h2>Bộ công cụ IMC — promotion mix</h2>
<p>IMC pha trộn sáu công cụ chính. Mỗi công cụ có một việc; tích hợp quyết định tỉ lệ.</p>
<ul>
<li><strong>Quảng cáo (advertising)</strong> — thông điệp đại chúng, trả tiền, phi cá nhân (TV, in ấn, OOH, online). Tốt cho <em>độ phủ</em> &amp; xây thương hiệu; uy tín thấp, chi phí cao.</li>
<li><strong>Khuyến mãi (sales promotion)</strong> — ưu đãi ngắn hạn (coupon, giảm giá, mẫu thử, cuộc thi). Thúc <em>hành động tức thì</em>; lạm dụng dễ bào mòn thương hiệu.</li>
<li><strong>PR &amp; publicity</strong> — đưa tin earned, sự kiện, tài trợ, CSR. <em>Uy tín</em> cao; ít kiểm soát thông điệp.</li>
<li><strong>Direct marketing</strong> — một-đối-một, đo được (email, catalogue, SMS, thư nhắm mục tiêu). <em>Cá nhân hoá</em> &amp; theo dõi được.</li>
<li><strong>Bán hàng cá nhân (personal selling)</strong> — thuyết phục trực tiếp. Mạnh cho giao dịch <em>phức tạp/giá trị cao</em>; đắt trên mỗi lần tiếp xúc.</li>
<li><strong>Digital / tương tác</strong> — search, social, content, influencer, display. Nhắm đúng, hai chiều, đo được (xem Chương 7).</li>
</ul>
<h3>Push và pull</h3>
<p><strong>Push (đẩy)</strong> nhắm vào kênh phân phối/đại lý (bán hàng cá nhân, trade promotion) để đẩy hàng xuống kênh; <strong>pull (kéo)</strong> nhắm vào người tiêu dùng (quảng cáo, khuyến mãi) để kéo hàng qua kênh bằng cách tạo nhu cầu.</p>
<div class="callout"><span class="badge">Chiến dịch thật</span> <strong>Red Bull</strong> dựa vào PR/sự kiện &amp; tài trợ (cú nhảy vũ trụ Stratos, thể thao mạo hiểm) nhiều hơn quảng cáo cổ điển — "Red Bull cho bạn đôi cánh" kiếm được qua sự kiện gây choáng. <strong>IKEA</strong> xây nhiều thập kỷ nhu cầu trên một trụ direct marketing — cuốn catalogue — tích hợp với cửa hàng và sau này là digital.</div>`,
  ]]);

const c5q = quiz('imc201-quiz-5', 'Quiz 5 — Promotion mix|||Quiz 5 — Promotion mix', [
  { id: 'q1', question: 'Công cụ IMC nào có uy tín cao nhất nhưng ít kiểm soát thông điệp nhất?|||Which IMC tool has the highest credibility but least message control?', options: ['Quảng cáo|||Advertising', 'PR & publicity|||PR & publicity', 'Khuyến mãi|||Sales promotion', 'Direct marketing|||Direct marketing'], correctIndex: 1, explanation: 'PR/earned media uy tín cao (người thứ ba nói) nhưng thương hiệu ít kiểm soát nội dung.' },
  { id: 'q2', question: 'Coupon, giảm giá, mẫu thử thuộc công cụ nào?|||Coupons, discounts and samples belong to which tool?', options: ['Personal selling', 'Sales promotion (khuyến mãi)|||Sales promotion', 'Quảng cáo TV|||TV advertising', 'PR'], correctIndex: 1, explanation: 'Đó là các ưu đãi ngắn hạn — sales promotion, thúc hành động tức thì.' },
  { id: 'q3', question: 'Chiến lược "pull" nhắm chủ yếu vào?|||A "pull" strategy mainly targets?', options: ['Đại lý và nhà bán lẻ|||Distributors and retailers', 'Người tiêu dùng cuối để tạo nhu cầu|||End consumers to create demand', 'Nhân viên nội bộ|||Internal staff', 'Nhà cung cấp|||Suppliers'], correctIndex: 1, explanation: 'Pull tạo nhu cầu ở người tiêu dùng để kéo hàng qua kênh; push đẩy vào kênh phân phối.' },
]);

const c6 = doc('imc201-6-1-media-budget', '6.1 — Media planning & budgeting|||6.1 — Lập kế hoạch phương tiện & ngân sách',
  'Loại phương tiện & lựa chọn; reach, frequency, GRP; lịch phát (continuity/flighting/pulsing); phương pháp lập ngân sách (percent-of-sales, objective-task, parity, affordable); ví dụ Super Bowl.',
  [[
    `<span class="eyebrow">IMC201 · Chapter 6 · Lesson 6.1</span>
<h2>Media planning &amp; budgeting</h2>
<h3>Media planning</h3>
<p>Media planning decides <em>where</em>, <em>how often</em> and <em>when</em> the message runs. Three core metrics:</p>
<ul>
<li><strong>Reach</strong> — the % of the target audience exposed at least once.</li>
<li><strong>Frequency</strong> — the average number of times they are exposed.</li>
<li><strong>GRP</strong> (Gross Rating Points) = Reach × Frequency — total weight of a schedule.</li>
</ul>
<p>Trade-off: a fixed budget buys either <em>broad reach</em> (many people once) or <em>high frequency</em> (fewer people, repeatedly). <strong>Scheduling</strong> can be <em>continuous</em> (steady), <em>flighting</em> (on/off bursts) or <em>pulsing</em> (a base plus bursts).</p>
<h3>Setting the budget</h3>
<ul>
<li><strong>Percent-of-sales</strong> — a fixed % of revenue. Simple, but lets sales drive spend (backwards).</li>
<li><strong>Competitive parity</strong> — match rivals' spend. Ignores your own goals.</li>
<li><strong>Objective-and-task</strong> — define objectives, cost the tasks to hit them, sum it up. The soundest, most defensible method.</li>
<li><strong>Affordable</strong> — spend what is left over. Common but weakest.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> A <strong>Super Bowl</strong> spot buys enormous one-shot <em>reach</em> (100M+ viewers) at a huge unit cost — brands wrap it in social, PR and teaser films so the frequency and story continue for weeks, making the expensive reach pay off.</div>`,
    `<span class="eyebrow">IMC201 · Chương 6 · Bài 6.1</span>
<h2>Lập kế hoạch phương tiện &amp; ngân sách</h2>
<h3>Media planning</h3>
<p>Media planning quyết định <em>ở đâu</em>, <em>bao nhiêu lần</em> và <em>khi nào</em> chạy thông điệp. Ba chỉ số cốt lõi:</p>
<ul>
<li><strong>Reach (độ phủ)</strong> — % đối tượng mục tiêu tiếp xúc ít nhất một lần.</li>
<li><strong>Frequency (tần suất)</strong> — số lần tiếp xúc trung bình.</li>
<li><strong>GRP</strong> (Gross Rating Points) = Reach × Frequency — tổng "trọng lượng" của lịch chạy.</li>
</ul>
<p>Đánh đổi: một ngân sách cố định mua được hoặc <em>độ phủ rộng</em> (nhiều người một lần) hoặc <em>tần suất cao</em> (ít người, lặp lại). <strong>Lịch phát</strong> có thể <em>liên tục</em> (đều), <em>flighting</em> (bật/tắt từng đợt) hoặc <em>pulsing</em> (nền cộng đợt bùng).</p>
<h3>Đặt ngân sách</h3>
<ul>
<li><strong>Percent-of-sales</strong> — một % cố định của doanh thu. Đơn giản, nhưng để doanh số dẫn chi (ngược đời).</li>
<li><strong>Competitive parity</strong> — bám mức chi của đối thủ. Bỏ qua mục tiêu riêng của mình.</li>
<li><strong>Objective-and-task</strong> — xác định mục tiêu, tính chi phí các việc để đạt, cộng lại. Phương pháp vững và có căn cứ nhất.</li>
<li><strong>Affordable</strong> — chi phần còn dư. Phổ biến nhưng yếu nhất.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> Một spot <strong>Super Bowl</strong> mua <em>độ phủ</em> khổng lồ trong một lần (hơn 100 triệu người xem) với đơn giá rất cao — thương hiệu bọc nó bằng social, PR và phim teaser để tần suất và câu chuyện kéo dài hàng tuần, khiến độ phủ đắt đỏ đó sinh lời.</div>`,
  ]]);

const c6q = quiz('imc201-quiz-6', 'Quiz 6 — Media & budget|||Quiz 6 — Phương tiện & ngân sách', [
  { id: 'q1', question: 'GRP (Gross Rating Points) được tính bằng?|||GRP (Gross Rating Points) is calculated as?', options: ['Reach + Frequency', 'Reach × Frequency', 'Reach ÷ Frequency', 'Ngân sách ÷ Frequency|||Budget ÷ Frequency'], correctIndex: 1, explanation: 'GRP = Reach × Frequency — tổng trọng lượng của một lịch phát.' },
  { id: 'q2', question: 'Phương pháp ngân sách nào được coi là vững và có căn cứ nhất?|||Which budgeting method is considered the soundest?', options: ['Affordable (chi phần dư)|||Affordable', 'Objective-and-task (mục tiêu & nhiệm vụ)|||Objective-and-task', 'Percent-of-sales', 'Competitive parity'], correctIndex: 1, explanation: 'Objective-and-task: đặt mục tiêu → tính chi phí các việc để đạt → cộng lại.' },
  { id: 'q3', question: 'Với ngân sách cố định, tăng "reach" thường phải?|||With a fixed budget, increasing "reach" usually means?', options: ['Đánh đổi bằng giảm "frequency"|||Trading off lower "frequency"', 'Tăng cả frequency vô hạn|||Increasing frequency without limit', 'Không ảnh hưởng gì|||No effect at all', 'Giảm reach|||Reducing reach'], correctIndex: 0, explanation: 'Ngân sách cố định: phủ rộng hơn (nhiều người một lần) đổi lấy tần suất thấp hơn, và ngược lại.' },
]);

const c7 = doc('imc201-7-1-digital-social', '7.1 — Digital & social in IMC|||7.1 — Kênh số & social trong IMC',
  'Paid–owned–earned media; content marketing; social & cộng đồng; influencer marketing; SEO/SEM; vai trò trong hành trình khách hàng; ví dụ Spotify Wrapped, ALS Ice Bucket.',
  [[
    `<span class="eyebrow">IMC201 · Chapter 7 · Lesson 7.1</span>
<h2>Digital &amp; social in IMC</h2>
<h3>The POE model</h3>
<ul>
<li><strong>Paid media</strong> — you buy it: search &amp; social ads, display, sponsored posts.</li>
<li><strong>Owned media</strong> — you control it: website, app, blog, email list, your own social accounts.</li>
<li><strong>Earned media</strong> — others give it: shares, reviews, press, word-of-mouth. The most trusted, the least controllable.</li>
</ul>
<h3>The digital toolkit</h3>
<ul>
<li><strong>Content marketing</strong> — useful/entertaining content that attracts an audience (the modern "pull").</li>
<li><strong>Social &amp; community</strong> — two-way conversation, not broadcast; speed and tone matter.</li>
<li><strong>Influencer marketing</strong> — creators lend reach and trust; fit and authenticity beat follower count.</li>
<li><strong>SEO / SEM</strong> — being found in search at the moment of intent.</li>
</ul>
<p>Digital is where IMC's "one voice" is tested hardest: it is fast, public and two-way, so the brand's message, tone and visual identity must stay consistent while responding in real time.</p>
<div class="callout"><span class="badge">Real campaigns</span> <strong>Spotify "Wrapped"</strong> turns each user's own data into shareable cards — owned content that becomes vast <em>earned</em> media every December. The <strong>ALS "Ice Bucket Challenge"</strong> was earned-media-first: a social mechanic spread person-to-person, raised ~$220M, and shows how digital can carry an integrated message with almost no paid spend.</div>`,
    `<span class="eyebrow">IMC201 · Chương 7 · Bài 7.1</span>
<h2>Kênh số &amp; social trong IMC</h2>
<h3>Mô hình POE (paid–owned–earned)</h3>
<ul>
<li><strong>Paid media</strong> — bạn mua: quảng cáo search &amp; social, display, bài tài trợ.</li>
<li><strong>Owned media</strong> — bạn kiểm soát: website, app, blog, danh sách email, tài khoản social của chính bạn.</li>
<li><strong>Earned media</strong> — người khác trao: lượt chia sẻ, đánh giá, báo chí, truyền miệng. Đáng tin nhất, khó kiểm soát nhất.</li>
</ul>
<h3>Bộ công cụ digital</h3>
<ul>
<li><strong>Content marketing</strong> — nội dung hữu ích/giải trí thu hút công chúng (kiểu "pull" hiện đại).</li>
<li><strong>Social &amp; cộng đồng</strong> — đối thoại hai chiều, không phải phát một chiều; tốc độ và tông giọng rất quan trọng.</li>
<li><strong>Influencer marketing</strong> — người sáng tạo cho mượn độ phủ và niềm tin; sự phù hợp và chân thật thắng số follower.</li>
<li><strong>SEO / SEM</strong> — được tìm thấy trong tìm kiếm đúng lúc có ý định.</li>
</ul>
<p>Digital là nơi "một tiếng nói" của IMC bị thử thách gắt nhất: nó nhanh, công khai và hai chiều, nên thông điệp, tông giọng và nhận diện của thương hiệu phải nhất quán trong khi vẫn phản hồi thời gian thực.</p>
<div class="callout"><span class="badge">Chiến dịch thật</span> <strong>Spotify "Wrapped"</strong> biến dữ liệu của mỗi người dùng thành thẻ chia sẻ được — nội dung owned trở thành earned media khổng lồ mỗi tháng 12. <strong>ALS "Ice Bucket Challenge"</strong> đi từ earned media trước: một cơ chế social lan từ người sang người, gây quỹ ~220 triệu USD, cho thấy digital có thể mang thông điệp tích hợp gần như không cần chi tiền paid.</div>`,
  ]]);

const c7q = quiz('imc201-quiz-7', 'Quiz 7 — Digital & social|||Quiz 7 — Digital & social', [
  { id: 'q1', question: 'Website, app và danh sách email của thương hiệu là loại media nào?|||A brand website, app and email list are which media type?', options: ['Paid media', 'Owned media', 'Earned media', 'Không tính là media|||Not media at all'], correctIndex: 1, explanation: 'Kênh do thương hiệu sở hữu và kiểm soát = owned media.' },
  { id: 'q2', question: 'Loại media nào đáng tin nhất nhưng khó kiểm soát nhất?|||Which media is most trusted but least controllable?', options: ['Paid media', 'Owned media', 'Earned media (chia sẻ, đánh giá, báo chí)|||Earned media (shares, reviews, press)', 'Quảng cáo TV|||TV advertising'], correctIndex: 2, explanation: 'Earned media do người khác trao (truyền miệng, review, báo chí) — uy tín cao, khó kiểm soát.' },
  { id: 'q3', question: 'Trong influencer marketing, điều gì quan trọng hơn số follower?|||In influencer marketing, what matters more than follower count?', options: ['Sự phù hợp và tính chân thật|||Fit and authenticity', 'Chỉ cần nhiều follower|||Just having many followers', 'Giá rẻ nhất|||The cheapest price', 'Đăng thật nhiều bài|||Posting as much as possible'], correctIndex: 0, explanation: 'Sự phù hợp với thương hiệu và tính chân thật tạo niềm tin hơn là số follower thô.' },
]);

const c8 = doc('imc201-8-1-measurement', '8.1 — Measuring & optimising the campaign|||8.1 — Đo lường & tối ưu chiến dịch',
  'KPI theo mục tiêu; brand lift vs performance metrics; ROI/ROAS; mô hình attribution (last-click vs data-driven); A/B testing & tối ưu; ví dụ brand lift study.',
  [[
    `<span class="eyebrow">IMC201 · Chapter 8 · Lesson 8.1</span>
<h2>Measuring &amp; optimising the campaign</h2>
<h3>Match the KPI to the objective</h3>
<p>Measurement closes the loop back to Chapter 3's objectives. Pick <strong>KPIs</strong> for the stage you set out to move:</p>
<ul>
<li><strong>Awareness / attitude</strong> — reach, <strong>brand lift</strong> (survey-measured rise in awareness, recall or favourability).</li>
<li><strong>Consideration</strong> — engagement, site visits, search volume, video completion.</li>
<li><strong>Action</strong> — conversions, sales, <strong>ROI</strong> / <strong>ROAS</strong> (return on ad spend).</li>
</ul>
<h3>Attribution — who gets the credit?</h3>
<p>A customer touches search, social and email before buying. <strong>Attribution</strong> decides how credit is split:</p>
<ul>
<li><strong>Last-click</strong> — all credit to the final touch. Simple, but undervalues awareness channels.</li>
<li><strong>First-click / linear / time-decay</strong> — spread credit across the journey.</li>
<li><strong>Data-driven</strong> — model the real contribution of each touch. Fairest, needs data.</li>
</ul>
<h3>Optimise</h3>
<p>Use <strong>A/B testing</strong> (compare two versions), watch the data, and shift budget to what works — measurement is not a report at the end, it is a steering wheel during the campaign.</p>
<div class="callout"><span class="badge">Real practice</span> Platforms like Google and Meta run <strong>brand lift studies</strong>: they survey an exposed group vs a control group and report the true rise in awareness or recall the ads caused — separating real brand impact from clicks that would have happened anyway.</div>`,
    `<span class="eyebrow">IMC201 · Chương 8 · Bài 8.1</span>
<h2>Đo lường &amp; tối ưu chiến dịch</h2>
<h3>Khớp KPI với mục tiêu</h3>
<p>Đo lường khép vòng trở lại mục tiêu ở Chương 3. Chọn <strong>KPI</strong> cho đúng bậc bạn muốn dịch chuyển:</p>
<ul>
<li><strong>Nhận biết / thái độ</strong> — reach, <strong>brand lift</strong> (mức tăng nhận biết, gợi nhớ hay thiện cảm đo bằng khảo sát).</li>
<li><strong>Cân nhắc</strong> — tương tác, lượt vào web, khối lượng tìm kiếm, tỉ lệ xem hết video.</li>
<li><strong>Hành động</strong> — chuyển đổi, doanh số, <strong>ROI</strong> / <strong>ROAS</strong> (lợi nhuận trên chi quảng cáo).</li>
</ul>
<h3>Attribution — ai được ghi công?</h3>
<p>Một khách hàng chạm search, social và email trước khi mua. <strong>Attribution</strong> quyết định cách chia công:</p>
<ul>
<li><strong>Last-click</strong> — dồn hết công cho điểm chạm cuối. Đơn giản, nhưng đánh giá thấp các kênh tạo nhận biết.</li>
<li><strong>First-click / linear / time-decay</strong> — rải công dọc hành trình.</li>
<li><strong>Data-driven</strong> — mô hình hoá đóng góp thật của từng điểm chạm. Công bằng nhất, cần dữ liệu.</li>
</ul>
<h3>Tối ưu</h3>
<p>Dùng <strong>A/B testing</strong> (so hai phiên bản), theo dõi dữ liệu, và dồn ngân sách vào cái hiệu quả — đo lường không phải bản báo cáo lúc cuối, nó là vô-lăng lái trong lúc chạy chiến dịch.</p>
<div class="callout"><span class="badge">Thực hành thật</span> Các nền tảng như Google và Meta chạy <strong>brand lift study</strong>: khảo sát nhóm được tiếp xúc quảng cáo so với nhóm đối chứng và báo mức tăng nhận biết hay gợi nhớ thật mà quảng cáo tạo ra — tách tác động thương hiệu thật khỏi những click vốn dĩ đã xảy ra.</div>`,
  ]]);

const c8q = quiz('imc201-quiz-8', 'Quiz 8 — Measurement|||Quiz 8 — Đo lường', [
  { id: 'q1', question: '"Brand lift" đo cái gì?|||"Brand lift" measures what?', options: ['Doanh số tức thì|||Immediate sales', 'Mức tăng nhận biết/gợi nhớ/thiện cảm do quảng cáo tạo ra (đo bằng khảo sát)|||The survey-measured rise in awareness/recall/favourability from ads', 'Số nhân viên bán hàng|||The number of salespeople', 'Chi phí sản xuất TVC|||TVC production cost'], correctIndex: 1, explanation: 'Brand lift = mức tăng nhận biết/gợi nhớ/thiện cảm, đo bằng khảo sát nhóm tiếp xúc vs nhóm đối chứng.' },
  { id: 'q2', question: 'Nhược điểm chính của mô hình attribution "last-click" là?|||The main flaw of "last-click" attribution is?', options: ['Quá phức tạp|||Too complex', 'Đánh giá thấp các kênh tạo nhận biết ở đầu hành trình|||It undervalues upper-funnel awareness channels', 'Không đo được doanh số|||It cannot measure sales', 'Cần quá nhiều dữ liệu|||It needs too much data'], correctIndex: 1, explanation: 'Last-click dồn hết công cho điểm chạm cuối nên bỏ quên các kênh tạo nhận biết ban đầu.' },
  { id: 'q3', question: 'ROAS là viết tắt của?|||ROAS stands for?', options: ['Rate Of Ad Sales', 'Return On Ad Spend (lợi nhuận trên chi quảng cáo)|||Return On Ad Spend', 'Reach Of All Screens', 'Review Of Ad Strategy'], correctIndex: 1, explanation: 'ROAS = Return On Ad Spend — doanh thu thu về trên mỗi đồng chi cho quảng cáo.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'IMC201',
    slug: 'imc201-introduction-to-integrated-marketing-communication',
    title: 'Introduction to Integrated Marketing Communication',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IMC201.webp',
    shortDescription: 'How brands speak with one voice — the promotion mix, AIDA & hierarchy of effects, SWOT & SMART objectives, positioning & big ideas, media planning, social & influencer, and measurement (KPIs, ROI, attribution). Bilingual, with real campaigns & quizzes.|||Thương hiệu nói bằng một tiếng nói — promotion mix, AIDA, SWOT & mục tiêu SMART, định vị & big idea, media planning, social & influencer, đo lường (KPI, ROI, attribution). Song ngữ, chiến dịch thật & quiz.',
    description: 'Môn <strong>IMC201 — Introduction to Integrated Marketing Communication</strong> (Nhập môn Truyền thông marketing tích hợp, kỳ 2) dạy cách một thương hiệu nói bằng <strong>một tiếng nói thống nhất</strong> xuyên mọi điểm chạm. Từ <strong>khái niệm &amp; mô hình</strong> (IMC, one voice, quy trình truyền thông, AIDA, hierarchy of effects) → <strong>lập kế hoạch</strong> (SWOT, đối tượng, mục tiêu DAGMAR/SMART) → <strong>thông điệp &amp; sáng tạo</strong> (định vị, big idea, appeals) → <strong>promotion mix</strong> (quảng cáo, khuyến mãi, PR, direct, personal selling, digital) → <strong>media planning &amp; ngân sách</strong> → <strong>digital/social/influencer</strong> → <strong>đo lường &amp; tối ưu</strong> (KPI, brand lift, ROI, attribution). Bám sách chuẩn Belch &amp; Belch và Schultz, song ngữ, có ví dụ chiến dịch thật (Nike, Dove, Coca-Cola, Spotify) và quiz mỗi chương.',
    whatYouLearn: 'IMC là gì &amp; nguyên tắc one voice; quy trình truyền thông (sender–receiver, noise, feedback); mô hình phản hồi (AIDA, hierarchy of effects); SWOT &amp; phân khúc đối tượng; đặt mục tiêu DAGMAR/SMART; định vị, big idea &amp; appeals (lý tính/cảm xúc/hài hước/sợ hãi); promotion mix 6 công cụ &amp; push/pull; media planning (reach, frequency, GRP, lịch phát) &amp; các phương pháp ngân sách; paid–owned–earned, content, social &amp; influencer; đo lường (KPI, brand lift, ROI/ROAS, attribution, A/B testing).',
    requirements: 'Không cần kiến thức trước. Có hiểu biết cơ bản về marketing và mạng xã hội là một lợi thế. Tài liệu: Belch &amp; Belch "Advertising and Promotion: An IMC Perspective", Schultz "Integrated Marketing Communications", AdAge, WARC.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách chuẩn, báo ngành, khoá học miễn phí, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'IMC là gì, vì sao một tiếng nói, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — IMC & một tiếng nói|||Chapter 1 — IMC & one voice', description: 'Định nghĩa, vì sao tích hợp, one voice/one look.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quy trình & mô hình|||Chapter 2 — Process & models', description: 'Sender–receiver, AIDA, hierarchy of effects.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tình huống & mục tiêu|||Chapter 3 — Situation & objectives', description: 'SWOT, đối tượng, DAGMAR/SMART.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thông điệp & sáng tạo|||Chapter 4 — Message & creative', description: 'Định vị, big idea, appeals.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Promotion mix|||Chapter 5 — Promotion mix', description: 'Quảng cáo, khuyến mãi, PR, direct, selling, digital.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Phương tiện & ngân sách|||Chapter 6 — Media & budget', description: 'Reach/frequency/GRP, phương pháp ngân sách.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Digital & social|||Chapter 7 — Digital & social', description: 'Paid–owned–earned, content, social, influencer.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường & tối ưu|||Chapter 8 — Measure & optimise', description: 'KPI, brand lift, ROI, attribution, A/B testing.', lessons: [c8, c8q] },
  ],
};
