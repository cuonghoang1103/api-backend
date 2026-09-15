/**
 * MKT208c — Social Media Marketing. Giáo trình FLM (syl): hệ sinh thái nền
 * tảng, chiến lược & nội dung, Facebook/Instagram, TikTok/YouTube, influencer
 * KOL/KOC, quảng cáo trả phí (Meta/TikTok Ads), community management & xử lý
 * khủng hoảng, đo lường & social listening. Song ngữ + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mkt208c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (Tuten/Solomon, Ryan), tài liệu chính thức Meta/TikTok/Google, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">MKT208c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Social Media Marketing — platform ecosystem, content strategy, paid ads, influencer marketing, community management and measurement — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MKT208c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Social+Media+Marketing" target="_blank" rel="noopener"><em>Social Media Marketing</em> — Tuten &amp; Solomon</a></li>
<li><a href="https://www.pearson.com/en-gb/subject-catalog/p/understanding-digital-marketing/" target="_blank" rel="noopener"><em>Understanding Digital Marketing</em> — Damian Ryan</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.facebook.com/business/help" target="_blank" rel="noopener">Meta Business Help Center — Facebook &amp; Instagram Ads</a></li>
<li><a href="https://www.tiktok.com/business/en/blog" target="_blank" rel="noopener">TikTok for Business — official blog &amp; guides</a></li>
<li><a href="https://blog.google/products/ads-commerce/" target="_blank" rel="noopener">Google Ads &amp; Marketing blog</a></li>
<li><a href="https://ads.tiktok.com/business/creativecenter" target="_blank" rel="noopener">TikTok Creative Center — trending content &amp; benchmarks</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@HubSpot" target="_blank" rel="noopener">HubSpot Marketing</a> — content &amp; inbound marketing</li>
<li><a href="https://www.youtube.com/@NeilPatel" target="_blank" rel="noopener">Neil Patel</a> — digital &amp; social marketing tactics</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://business.facebook.com/" target="_blank" rel="noopener">Meta Business Suite</a> — quản lý Page/Instagram, Ads Manager, Insights</li>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — xu hướng tìm kiếm &amp; chủ đề</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — thiết kế hình ảnh/video social nhanh</li>
<li><a href="https://buffer.com/" target="_blank" rel="noopener">Buffer</a> / <a href="https://hootsuite.com/" target="_blank" rel="noopener">Hootsuite</a> — lên lịch &amp; quản lý đa nền tảng</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — platform ecosystem, PESO media, content strategy &amp; calendar.</li>
<li><strong>Practice</strong> — build a 4-week content calendar for one real brand, one platform.</li>
<li><strong>Go deeper</strong> — paid ads structure &amp; targeting, influencer marketing, community management.</li>
<li><strong>Job-ready</strong> — run Meta Business Suite / TikTok Ads Manager on a real (or test) account and read the Insights.</li>
</ol></div>`,
    `<span class="eyebrow">MKT208c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Marketing mạng xã hội — hệ sinh thái nền tảng, chiến lược nội dung, quảng cáo trả phí, influencer marketing, quản trị cộng đồng và đo lường — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MKT208c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Social+Media+Marketing" target="_blank" rel="noopener"><em>Social Media Marketing</em> — Tuten &amp; Solomon</a></li>
<li><a href="https://www.pearson.com/en-gb/subject-catalog/p/understanding-digital-marketing/" target="_blank" rel="noopener"><em>Understanding Digital Marketing</em> — Damian Ryan</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.facebook.com/business/help" target="_blank" rel="noopener">Meta Business Help Center — Facebook &amp; Instagram Ads</a></li>
<li><a href="https://www.tiktok.com/business/en/blog" target="_blank" rel="noopener">TikTok for Business — blog &amp; hướng dẫn chính thức</a></li>
<li><a href="https://blog.google/products/ads-commerce/" target="_blank" rel="noopener">Google Ads &amp; Marketing blog</a></li>
<li><a href="https://ads.tiktok.com/business/creativecenter" target="_blank" rel="noopener">TikTok Creative Center — nội dung thịnh hành &amp; benchmark</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@HubSpot" target="_blank" rel="noopener">HubSpot Marketing</a> — nội dung &amp; inbound marketing</li>
<li><a href="https://www.youtube.com/@NeilPatel" target="_blank" rel="noopener">Neil Patel</a> — chiến thuật digital &amp; social marketing</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://business.facebook.com/" target="_blank" rel="noopener">Meta Business Suite</a> — quản lý Page/Instagram, Ads Manager, Insights</li>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — xu hướng tìm kiếm &amp; chủ đề</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — thiết kế hình ảnh/video social nhanh</li>
<li><a href="https://buffer.com/" target="_blank" rel="noopener">Buffer</a> / <a href="https://hootsuite.com/" target="_blank" rel="noopener">Hootsuite</a> — lên lịch &amp; quản lý đa nền tảng</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — hệ sinh thái nền tảng, mô hình PESO, chiến lược &amp; lịch nội dung.</li>
<li><strong>Luyện tập</strong> — dựng lịch nội dung 4 tuần cho một thương hiệu thật, một nền tảng.</li>
<li><strong>Đào sâu thực tế</strong> — cấu trúc &amp; target quảng cáo trả phí, influencer marketing, quản trị cộng đồng.</li>
<li><strong>Sẵn sàng đi làm</strong> — thao tác Meta Business Suite / TikTok Ads Manager trên tài khoản thật (hoặc thử) và đọc Insights.</li>
</ol></div>`,
  ]]);

const intro = doc('mkt208c-0-1-overview', 'Course overview: Social Media Marketing|||Tổng quan: Marketing mạng xã hội',
  'Marketing mạng xã hội là gì; vì sao doanh nghiệp cần nó; lộ trình môn: hệ sinh thái nền tảng → chiến lược nội dung → từng nền tảng (Facebook/Instagram, TikTok/YouTube) → influencer → quảng cáo trả phí → community & khủng hoảng → đo lường & social listening.',
  [[
    `<span class="eyebrow">MKT208c · Lesson 0.1 · Overview</span>
<h2>Social Media Marketing</h2>
<p class="lead">This course helps you understand <strong>how brands use social media to reach, engage and convert customers</strong> — from choosing the right platform, to planning content, running paid ads, working with influencers, managing community and crisis, and proving results with data.</p>
<h3>Why it matters</h3>
<ul>
<li>Billions of people spend hours daily on Facebook, Instagram, TikTok, YouTube — attention lives there, so marketing has to meet it there.</li>
<li>Social platforms give <strong>two-way, measurable</strong> communication — unlike TV/print, every post, ad and comment can be tracked and optimized.</li>
<li>It's cheap to start (organic posting) and infinitely scalable (paid ads with precise targeting).</li>
</ul>
<h3>Roadmap</h3>
<p>Platform ecosystem &amp; PESO media → content strategy &amp; calendars → Facebook/Instagram → TikTok/YouTube video → influencer/KOL-KOC → paid ads (Meta &amp; TikTok Ads) → community management &amp; crisis response → measurement &amp; social listening. Bilingual, with worked examples and quizzes.</p>`,
    `<span class="eyebrow">MKT208c · Bài 0.1 · Tổng quan</span>
<h2>Marketing mạng xã hội</h2>
<p class="lead">Môn này giúp bạn hiểu <strong>doanh nghiệp dùng mạng xã hội thế nào để tiếp cận, tương tác và chuyển đổi khách hàng</strong> — từ chọn đúng nền tảng, lên kế hoạch nội dung, chạy quảng cáo trả phí, hợp tác influencer, quản trị cộng đồng &amp; khủng hoảng, đến chứng minh hiệu quả bằng số liệu.</p>
<h3>Vì sao quan trọng</h3>
<ul>
<li>Hàng tỉ người dành nhiều giờ mỗi ngày trên Facebook, Instagram, TikTok, YouTube — sự chú ý nằm ở đó, marketing phải có mặt ở đó.</li>
<li>Nền tảng mạng xã hội cho giao tiếp <strong>hai chiều, đo được</strong> — khác TV/báo in, mọi bài đăng, quảng cáo, bình luận đều theo dõi và tối ưu được.</li>
<li>Chi phí khởi động thấp (đăng bài tự nhiên) và mở rộng vô hạn (quảng cáo trả phí với target chính xác).</li>
</ul>
<h3>Lộ trình</h3>
<p>Hệ sinh thái nền tảng &amp; mô hình PESO → chiến lược &amp; lịch nội dung → Facebook/Instagram → video TikTok/YouTube → influencer/KOL-KOC → quảng cáo trả phí (Meta &amp; TikTok Ads) → quản trị cộng đồng &amp; xử lý khủng hoảng → đo lường &amp; social listening. Song ngữ, có ví dụ mẫu và quiz.</p>`,
  ]]);

const c1 = doc('mkt208c-1-1-overview-ecosystem', '1.1 — SMM overview & platform ecosystem|||1.1 — Tổng quan SMM & hệ sinh thái nền tảng',
  'Định nghĩa social media marketing, mô hình PESO (Paid/Earned/Shared/Owned), đặc điểm từng nền tảng lớn, hành trình khách hàng trên social.',
  [[
    `<span class="eyebrow">MKT208c · Chapter 1 · Lesson 1.1</span>
<h2>SMM overview &amp; platform ecosystem</h2>
<h3>What is social media marketing?</h3>
<p><strong>Social media marketing (SMM)</strong> is using social platforms — organically and with paid ads — to build brand awareness, engage audiences, drive traffic and generate sales/leads.</p>
<h3>The PESO model</h3>
<ul>
<li><strong>Paid</strong> — ads you pay for (Meta Ads, TikTok Ads).</li>
<li><strong>Earned</strong> — organic mentions, shares, press you didn't pay for (word of mouth, PR).</li>
<li><strong>Shared</strong> — content that spreads via followers' own networks (shares, reposts).</li>
<li><strong>Owned</strong> — channels the brand controls (its Page, its account, its website).</li>
</ul>
<h3>Platform ecosystem</h3>
<pre><code>Facebook   -> broad audience, all ages, Groups/community
Instagram  -> visual, younger, Stories/Reels/Shopping
TikTok     -> short video, Gen Z, algorithm-driven discovery
YouTube    -> long-form + Shorts, search-driven, high intent
LinkedIn   -> B2B, professional, recruiting/thought leadership
Zalo       -> Vietnam-local, chat + Official Account + mini app
</code></pre>
<p>Each platform has a different audience, content format and algorithm — a strategy that works on one rarely copy-pastes onto another.</p>
<h3>Customer journey on social</h3>
<p>Awareness (see the brand) → Consideration (follow, engage, research) → Conversion (click, buy) → Loyalty/Advocacy (repeat, recommend). Content and ads should match the stage — a Reel builds awareness, a retargeting ad drives conversion.</p>
<div class="callout"><span class="badge">Key idea</span> SMM isn't "posting on Facebook" — it's picking the right platform and message for each stage of the customer journey, then measuring what actually moves the business.</div>`,
    `<span class="eyebrow">MKT208c · Chương 1 · Bài 1.1</span>
<h2>Tổng quan SMM &amp; hệ sinh thái nền tảng</h2>
<h3>Marketing mạng xã hội là gì?</h3>
<p><strong>Marketing mạng xã hội (SMM)</strong> là dùng nền tảng mạng xã hội — cả tự nhiên và quảng cáo trả phí — để xây nhận diện thương hiệu, tương tác với khách hàng, kéo traffic và tạo doanh số/lead.</p>
<h3>Mô hình PESO</h3>
<ul>
<li><strong>Paid</strong> — quảng cáo trả tiền (Meta Ads, TikTok Ads).</li>
<li><strong>Earned</strong> — nhắc đến, chia sẻ, báo chí tự nhiên không trả tiền (truyền miệng, PR).</li>
<li><strong>Shared</strong> — nội dung lan qua mạng lưới của người theo dõi (share, repost).</li>
<li><strong>Owned</strong> — kênh thương hiệu tự sở hữu (Page, tài khoản, website).</li>
</ul>
<h3>Hệ sinh thái nền tảng</h3>
<pre><code>Facebook   -> khán giả rộng, mọi lứa tuổi, Group/cộng đồng
Instagram  -> hình ảnh, trẻ hơn, Stories/Reels/Shopping
TikTok     -> video ngắn, Gen Z, khám phá theo thuật toán
YouTube    -> video dài + Shorts, dựa tìm kiếm, chủ đích cao
LinkedIn   -> B2B, chuyên nghiệp, tuyển dụng/thought leadership
Zalo       -> nội địa Việt Nam, chat + Official Account + mini app
</code></pre>
<p>Mỗi nền tảng có khán giả, định dạng nội dung và thuật toán khác nhau — chiến lược hiệu quả trên nền tảng này hiếm khi copy-paste sang nền tảng khác.</p>
<h3>Hành trình khách hàng trên social</h3>
<p>Nhận biết (thấy thương hiệu) → Xem xét (theo dõi, tương tác, tìm hiểu) → Chuyển đổi (nhấn, mua) → Trung thành/Ủng hộ (mua lại, giới thiệu). Nội dung và quảng cáo nên khớp giai đoạn — một Reel xây nhận biết, một quảng cáo retargeting thúc chuyển đổi.</p>
<div class="callout"><span class="badge">Ý chính</span> SMM không phải "đăng bài lên Facebook" — mà là chọn đúng nền tảng và đúng thông điệp cho từng giai đoạn hành trình khách hàng, rồi đo xem điều gì thật sự tác động tới kinh doanh.</div>`,
  ]]);

const c1q = quiz('mkt208c-quiz-1', 'Quiz 1 — Overview & ecosystem|||Quiz 1 — Tổng quan & hệ sinh thái', [
  { id: 'q1', question: 'Trong mô hình PESO, kênh thương hiệu tự sở hữu (Page, website) thuộc nhóm nào?', options: ['Paid', 'Earned', 'Shared', 'Owned'], correctIndex: 3, explanation: 'Owned là kênh thương hiệu kiểm soát hoàn toàn, như Page hoặc website.' },
  { id: 'q2', question: 'Nền tảng nào đặc trưng bởi video ngắn và khám phá theo thuật toán, chủ yếu Gen Z?', options: ['LinkedIn', 'TikTok', 'Zalo', 'Facebook'], correctIndex: 1, explanation: 'TikTok nổi bật với video ngắn và feed "For You" gợi ý theo thuật toán.' },
  { id: 'q3', question: 'Giai đoạn nào trong hành trình khách hàng trên social là "theo dõi, tương tác, tìm hiểu thêm"?', options: ['Nhận biết', 'Xem xét', 'Chuyển đổi', 'Trung thành'], correctIndex: 1, explanation: 'Xem xét (Consideration) là lúc khách theo dõi và tìm hiểu thêm trước khi mua.' },
]);

const c2 = doc('mkt208c-2-1-strategy-content-planning', '2.1 — Strategy & content planning|||2.1 — Chiến lược & lập kế hoạch nội dung',
  'Content pillars, buyer persona & tone of voice, tỉ lệ nội dung (educate/entertain/inspire/promote), lịch nội dung, tái sử dụng nội dung.',
  [[
    `<span class="eyebrow">MKT208c · Chapter 2 · Lesson 2.1</span>
<h2>Strategy &amp; content planning</h2>
<h3>Content pillars</h3>
<p>A <strong>content pillar</strong> is a recurring theme tied to the brand (e.g. a coffee shop: "brewing tips", "behind the counter", "customer stories", "promotions"). Pillars keep content varied but consistent, and make planning repeatable.</p>
<h3>Buyer persona &amp; tone of voice</h3>
<p>Before writing a single post, define <strong>who</strong> you're talking to (persona: age, goals, pain points, favorite platform) and <strong>how</strong> the brand sounds (tone of voice: playful, expert, warm...). Every post should read like the same "person" wrote it.</p>
<h3>Content mix</h3>
<pre><code>Educate  -> tips, how-to, explain the product
Entertain-> memes, trends, behind-the-scenes
Inspire  -> stories, values, customer wins
Promote  -> offers, product, direct CTA
</code></pre>
<p>A common rule of thumb: keep <strong>promotional content around 20%</strong> and the rest educate/entertain/inspire — an all-ads feed loses followers fast.</p>
<h3>Content calendar</h3>
<pre><code>Week | Mon        | Wed         | Fri
1    | Tip (Educ) | Reel (Ent.) | Story poll
2    | Customer   | Behind scenes| Offer (Promo)
</code></pre>
<p>A calendar maps pillars to dates and platforms, so content ships on a predictable rhythm instead of being made up on the day.</p>
<h3>Repurposing</h3>
<p>One idea → many formats: a blog post becomes a carousel, a Reel, a Story poll, and a LinkedIn text post — same message, native format per platform.</p>
<div class="callout"><span class="badge">Key idea</span> Strategy comes before posting. A content pillar plus a calendar turns "what do we post today?" into "which pillar is due this week?"</div>`,
    `<span class="eyebrow">MKT208c · Chương 2 · Bài 2.1</span>
<h2>Chiến lược &amp; lập kế hoạch nội dung</h2>
<h3>Content pillar (trụ nội dung)</h3>
<p>Một <strong>trụ nội dung</strong> là chủ đề lặp lại gắn với thương hiệu (vd quán cà phê: "mẹo pha chế", "hậu trường quầy bar", "chuyện khách hàng", "khuyến mãi"). Trụ giúp nội dung đa dạng nhưng nhất quán, và lên kế hoạch lặp lại được.</p>
<h3>Buyer persona &amp; tone of voice</h3>
<p>Trước khi viết một bài đăng nào, hãy xác định <strong>nói với ai</strong> (persona: tuổi, mục tiêu, nỗi đau, nền tảng ưa thích) và <strong>nói thế nào</strong> (tone of voice: hài hước, chuyên gia, ấm áp...). Mọi bài nên đọc như cùng một "người" viết.</p>
<h3>Tỉ lệ nội dung</h3>
<pre><code>Educate  -> mẹo, hướng dẫn, giải thích sản phẩm
Entertain-> meme, trend, hậu trường
Inspire  -> câu chuyện, giá trị, thành công của khách
Promote  -> ưu đãi, sản phẩm, CTA trực tiếp
</code></pre>
<p>Quy tắc phổ biến: giữ <strong>nội dung bán hàng khoảng 20%</strong>, còn lại là educate/entertain/inspire — feed toàn quảng cáo mất người theo dõi rất nhanh.</p>
<h3>Lịch nội dung</h3>
<pre><code>Tuần | Thứ Hai      | Thứ Tư        | Thứ Sáu
1    | Mẹo (Educ)   | Reel (Ent.)   | Story bình chọn
2    | Chuyện khách | Hậu trường    | Ưu đãi (Promo)
</code></pre>
<p>Lịch nội dung gắn trụ với ngày và nền tảng cụ thể, giúp nội dung ra đều đặn thay vì nghĩ ra trong ngày.</p>
<h3>Tái sử dụng nội dung</h3>
<p>Một ý tưởng → nhiều định dạng: một bài blog trở thành carousel, Reel, Story bình chọn, và bài text trên LinkedIn — cùng thông điệp, định dạng đúng "bản chất" từng nền tảng.</p>
<div class="callout"><span class="badge">Ý chính</span> Chiến lược đi trước khi đăng bài. Một trụ nội dung cộng lịch nội dung biến "hôm nay đăng gì?" thành "tuần này tới trụ nào?"</div>`,
  ]]);

const c2q = quiz('mkt208c-quiz-2', 'Quiz 2 — Strategy & content|||Quiz 2 — Chiến lược & nội dung', [
  { id: 'q1', question: 'Content pillar (trụ nội dung) dùng để làm gì?', options: ['Tăng ngân sách quảng cáo', 'Giữ chủ đề đa dạng nhưng nhất quán, dễ lên kế hoạch', 'Thay thế hoàn toàn quảng cáo trả phí', 'Chỉ dùng cho video dài'], correctIndex: 1, explanation: 'Trụ nội dung là chủ đề lặp lại giúp nội dung đa dạng, nhất quán và lặp lại được.' },
  { id: 'q2', question: 'Theo quy tắc phổ biến trong bài, nội dung mang tính bán hàng/khuyến mãi nên chiếm khoảng bao nhiêu?', options: ['80%', '50%', '20%', '100%'], correctIndex: 2, explanation: 'Giữ nội dung promo khoảng 20%, còn lại educate/entertain/inspire.' },
  { id: 'q3', question: '"Tái sử dụng nội dung" (repurposing) nghĩa là gì?', options: ['Đăng lại đúng một bài trên mọi nền tảng không đổi gì', 'Một ý tưởng chuyển thành nhiều định dạng phù hợp từng nền tảng', 'Xoá nội dung cũ khi ra nội dung mới', 'Chỉ áp dụng cho quảng cáo trả phí'], correctIndex: 1, explanation: 'Repurposing biến một ý tưởng thành nhiều định dạng native cho từng nền tảng.' },
]);

const c3 = doc('mkt208c-3-1-facebook-instagram', '3.1 — Facebook & Instagram marketing|||3.1 — Marketing trên Facebook & Instagram',
  'Page/Group Facebook, định dạng Instagram (feed/Stories/Reels), thuật toán ưu tiên gì, Meta Business Suite & Insights.',
  [[
    `<span class="eyebrow">MKT208c · Chapter 3 · Lesson 3.1</span>
<h2>Facebook &amp; Instagram marketing</h2>
<h3>Facebook: Page &amp; Group</h3>
<p>A <strong>Page</strong> is the brand's public presence (posts, reviews, messaging); a <strong>Group</strong> builds a tighter community around a shared interest — great for support communities and loyal fans, but needs active moderation.</p>
<h3>Instagram formats</h3>
<ul>
<li><strong>Feed post</strong> — single image/carousel, stays on the profile grid.</li>
<li><strong>Stories</strong> — 24h, casual, polls/stickers for quick interaction.</li>
<li><strong>Reels</strong> — short video, the format the algorithm currently pushes hardest for reach.</li>
<li><strong>Live</strong> — real-time, good for launches and Q&amp;A.</li>
</ul>
<h3>What the algorithm rewards</h3>
<pre><code>Signals the feed algorithm weighs:
 - Engagement speed (comments/shares in the first minutes)
 - Watch time / time spent on the post
 - Relationship (how often you two interact)
 - Recency and content type (video is currently favored)
</code></pre>
<h3>Meta Business Suite</h3>
<p>The free hub to manage Facebook Page + Instagram together: schedule posts, reply to messages/comments from one inbox, run ads, and read <strong>Insights</strong> (reach, engagement, follower demographics).</p>
<div class="callout"><span class="badge">Key idea</span> Facebook and Instagram share Meta's ad/data infrastructure but have different audience habits — plan format and tone per platform, not one post copy-pasted to both.</div>`,
    `<span class="eyebrow">MKT208c · Chương 3 · Bài 3.1</span>
<h2>Marketing trên Facebook &amp; Instagram</h2>
<h3>Facebook: Page &amp; Group</h3>
<p>Một <strong>Page</strong> là bộ mặt công khai của thương hiệu (bài đăng, đánh giá, tin nhắn); một <strong>Group</strong> xây cộng đồng gắn kết hơn quanh sở thích chung — tốt cho cộng đồng hỗ trợ và fan trung thành, nhưng cần kiểm duyệt tích cực.</p>
<h3>Định dạng Instagram</h3>
<ul>
<li><strong>Bài feed</strong> — ảnh đơn/carousel, ở lại lưới hồ sơ.</li>
<li><strong>Stories</strong> — tồn tại 24h, thoải mái, có poll/sticker tương tác nhanh.</li>
<li><strong>Reels</strong> — video ngắn, định dạng thuật toán đang ưu tiên nhất để tăng reach.</li>
<li><strong>Live</strong> — trực tiếp, hợp cho ra mắt sản phẩm và hỏi-đáp.</li>
</ul>
<h3>Thuật toán ưu tiên điều gì</h3>
<pre><code>Tín hiệu thuật toán feed cân nhắc:
 - Tốc độ tương tác (comment/share trong vài phút đầu)
 - Thời gian xem / thời gian dừng lại ở bài
 - Mối quan hệ (hai người tương tác với nhau thường xuyên không)
 - Độ mới và loại nội dung (video đang được ưu ái)
</code></pre>
<h3>Meta Business Suite</h3>
<p>Trung tâm miễn phí quản lý chung Facebook Page + Instagram: lên lịch bài đăng, trả lời tin nhắn/comment từ một hộp thư, chạy quảng cáo, và đọc <strong>Insights</strong> (reach, engagement, nhân khẩu học người theo dõi).</p>
<div class="callout"><span class="badge">Ý chính</span> Facebook và Instagram dùng chung hạ tầng quảng cáo/dữ liệu của Meta nhưng thói quen khán giả khác nhau — lên kế hoạch định dạng và tone riêng cho mỗi nền tảng, đừng copy-paste một bài cho cả hai.</div>`,
  ]]);

const c3q = quiz('mkt208c-quiz-3', 'Quiz 3 — Facebook & Instagram|||Quiz 3 — Facebook & Instagram', [
  { id: 'q1', question: 'Định dạng nào trên Instagram hiện được thuật toán ưu tiên nhất để tăng reach?', options: ['Bài feed ảnh đơn', 'Stories', 'Reels', 'Bài text'], correctIndex: 2, explanation: 'Reels (video ngắn) hiện là định dạng thuật toán Instagram ưu tiên đẩy reach nhất.' },
  { id: 'q2', question: 'Meta Business Suite dùng để làm gì?', options: ['Chỉ để xem tin tức', 'Quản lý chung Facebook Page + Instagram: lên lịch, tin nhắn, ads, Insights', 'Chỉ chạy được trên TikTok', 'Thay thế hoàn toàn Google Ads'], correctIndex: 1, explanation: 'Meta Business Suite là hub quản lý chung Page + Instagram: lịch đăng, hộp thư, quảng cáo, Insights.' },
  { id: 'q3', question: 'Theo bài, tín hiệu nào KHÔNG được thuật toán feed Facebook/Instagram cân nhắc?', options: ['Tốc độ tương tác ban đầu', 'Thời gian xem/dừng lại', 'Mối quan hệ giữa hai người dùng', 'Số năm tài khoản đã tồn tại'], correctIndex: 3, explanation: 'Bài chỉ nêu tốc độ tương tác, thời gian xem, mối quan hệ, độ mới/loại nội dung — không nhắc tuổi tài khoản.' },
]);

const c4 = doc('mkt208c-4-1-tiktok-youtube-video', '4.1 — TikTok, YouTube & video marketing|||4.1 — TikTok, YouTube & video marketing',
  'Thuật toán "For You" của TikTok, SEO video YouTube, cấu trúc video Hook-Body-CTA, thông số định dạng video theo nền tảng.',
  [[
    `<span class="eyebrow">MKT208c · Chapter 4 · Lesson 4.1</span>
<h2>TikTok, YouTube &amp; video marketing</h2>
<h3>TikTok's "For You" feed</h3>
<p>TikTok's algorithm doesn't rely much on follower count — it tests every video with a small audience, then pushes it wider if <strong>completion rate</strong>, replays and comments are strong. The first <strong>3 seconds</strong> ("the hook") decide whether people keep watching or scroll away.</p>
<h3>YouTube: search + suggested</h3>
<p>YouTube is discovered two ways: <strong>search</strong> (people typing a question) and <strong>suggested</strong> (recommended after another video). Video SEO — title, description, tags, an eye-catching thumbnail — drives search traffic; <strong>watch time</strong> and click-through rate drive suggestions. <strong>Shorts</strong> compete more like TikTok's feed.</p>
<h3>Video structure: Hook - Body - CTA</h3>
<pre><code>Hook (0-3s)  -> grab attention: question, bold claim, visual surprise
Body         -> deliver the promise: value, story, demo
CTA          -> one clear next step: follow, comment, click link
</code></pre>
<h3>Format specs (typical)</h3>
<pre><code>TikTok / Reels / Shorts -> 9:16 vertical, 15-60s
YouTube long-form       -> 16:9 landscape, 8-15+ min
Facebook/Instagram feed -> 1:1 or 4:5, under 90s
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Video marketing is platform-native by design: the same message needs a different cut, ratio and length for TikTok, Shorts and a YouTube deep-dive.</div>`,
    `<span class="eyebrow">MKT208c · Chương 4 · Bài 4.1</span>
<h2>TikTok, YouTube &amp; video marketing</h2>
<h3>Feed "For You" của TikTok</h3>
<p>Thuật toán TikTok không dựa nhiều vào số người theo dõi — nó thử mỗi video với một nhóm khán giả nhỏ, rồi đẩy rộng hơn nếu <strong>tỉ lệ xem hết (completion rate)</strong>, xem lại và comment tốt. <strong>3 giây đầu</strong> ("cái hook") quyết định người xem ở lại hay lướt qua.</p>
<h3>YouTube: tìm kiếm + gợi ý</h3>
<p>YouTube được tìm thấy qua hai cách: <strong>tìm kiếm</strong> (người dùng gõ câu hỏi) và <strong>gợi ý</strong> (đề xuất sau video khác). SEO video — tiêu đề, mô tả, tag, thumbnail bắt mắt — kéo traffic tìm kiếm; <strong>thời gian xem</strong> và tỉ lệ click kéo lượt gợi ý. <strong>Shorts</strong> cạnh tranh gần giống feed TikTok.</p>
<h3>Cấu trúc video: Hook - Body - CTA</h3>
<pre><code>Hook (0-3s)  -> gây chú ý: câu hỏi, tuyên bố mạnh, bất ngờ hình ảnh
Body         -> giao đúng lời hứa: giá trị, câu chuyện, demo
CTA          -> một bước kế tiếp rõ ràng: theo dõi, comment, bấm link
</code></pre>
<h3>Thông số định dạng (điển hình)</h3>
<pre><code>TikTok / Reels / Shorts -> dọc 9:16, 15-60 giây
YouTube video dài       -> ngang 16:9, 8-15+ phút
Feed Facebook/Instagram -> 1:1 hoặc 4:5, dưới 90 giây
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Video marketing vốn phải "bản địa hoá" theo nền tảng: cùng thông điệp cần cắt dựng, tỉ lệ và độ dài khác nhau cho TikTok, Shorts và một video sâu trên YouTube.</div>`,
  ]]);

const c4q = quiz('mkt208c-quiz-4', 'Quiz 4 — TikTok, YouTube & video|||Quiz 4 — TikTok, YouTube & video', [
  { id: 'q1', question: 'Yếu tố nào quyết định TikTok đẩy một video ra khán giả rộng hơn?', options: ['Số người theo dõi kênh', 'Tỉ lệ xem hết, xem lại, comment tốt trong lần thử ban đầu', 'Thời gian đăng bài', 'Độ dài video'], correctIndex: 1, explanation: 'TikTok thử video với nhóm nhỏ rồi đẩy rộng dựa trên completion rate, replay, comment.' },
  { id: 'q2', question: 'YouTube được khám phá chủ yếu qua hai cách nào?', options: ['Quảng cáo và email', 'Tìm kiếm và gợi ý', 'Group và tin nhắn', 'Hashtag và livestream'], correctIndex: 1, explanation: 'Bài nêu rõ hai cách khám phá YouTube: search và suggested (gợi ý).' },
  { id: 'q3', question: 'Trong cấu trúc Hook-Body-CTA, "Hook" nằm ở đâu và làm gì?', options: ['Cuối video, chốt hành động', 'Giữa video, kể chuyện', '0-3 giây đầu, gây chú ý', 'Không thuộc cấu trúc video'], correctIndex: 2, explanation: 'Hook là 3 giây đầu, mục tiêu gây chú ý để người xem không lướt qua.' },
]);

const c5 = doc('mkt208c-5-1-influencer-kol-koc', '5.1 — Influencer marketing & KOL/KOC|||5.1 — Influencer marketing & KOL/KOC',
  'KOL vs KOC, tầng influencer theo follower (Nano/Micro/Macro/Mega), quy trình hợp tác 3R, rủi ro & minh bạch quảng cáo.',
  [[
    `<span class="eyebrow">MKT208c · Chapter 5 · Lesson 5.1</span>
<h2>Influencer marketing &amp; KOL/KOC</h2>
<h3>KOL vs KOC</h3>
<p><strong>KOL (Key Opinion Leader)</strong> — an expert or celebrity with authority and a large following (a doctor, a famous singer). <strong>KOC (Key Opinion Consumer)</strong> — an everyday consumer whose honest, relatable reviews feel more trustworthy than a celebrity endorsement, even with a smaller audience.</p>
<h3>Influencer tiers (by followers)</h3>
<pre><code>Nano   1K-10K     -> highest engagement rate, cheap, very niche
Micro  10K-100K    -> strong engagement, affordable, niche authority
Macro  100K-1M     -> broad reach, professional content, higher cost
Mega   1M+         -> celebrity-level reach, lowest engagement rate, priciest
</code></pre>
<h3>Choosing an influencer: the 3R framework</h3>
<ul>
<li><strong>Relevance</strong> — do their content and audience actually fit the brand?</li>
<li><strong>Reach</strong> — how many people, and how many of those match the target audience?</li>
<li><strong>Resonance</strong> — do their followers genuinely engage, not just scroll past?</li>
</ul>
<h3>Process &amp; risk</h3>
<p>Define the campaign goal → shortlist by 3R → brief clearly (message, do's/don'ts, deadline) → contract (deliverables, usage rights, payment) → measure results. Watch for <strong>fake followers/engagement</strong> (check for suspiciously round engagement rates) and always require honest <strong>#ad disclosure</strong> — undisclosed sponsorship is both a trust issue and, in many markets, a legal one.</p>
<div class="callout"><span class="badge">Key idea</span> Bigger isn't always better — a well-matched nano/micro influencer with real engagement often outperforms a mega influencer whose audience doesn't care about the product.</div>`,
    `<span class="eyebrow">MKT208c · Chương 5 · Bài 5.1</span>
<h2>Influencer marketing &amp; KOL/KOC</h2>
<h3>KOL vs KOC</h3>
<p><strong>KOL (Key Opinion Leader)</strong> — chuyên gia hoặc người nổi tiếng có uy tín và lượng theo dõi lớn (bác sĩ, ca sĩ nổi tiếng). <strong>KOC (Key Opinion Consumer)</strong> — người tiêu dùng bình thường, review thật và gần gũi khiến người xem tin hơn cả một lời chứng thực từ celebrity, dù lượng theo dõi nhỏ hơn.</p>
<h3>Tầng influencer (theo follower)</h3>
<pre><code>Nano   1K-10K    -> tỉ lệ engagement cao nhất, rẻ, rất ngách
Micro  10K-100K   -> engagement mạnh, giá hợp lý, uy tín trong ngách
Macro  100K-1M    -> reach rộng, nội dung chuyên nghiệp, chi phí cao hơn
Mega   1M+        -> reach cấp celebrity, tỉ lệ engagement thấp nhất, đắt nhất
</code></pre>
<h3>Chọn influencer: khung 3R</h3>
<ul>
<li><strong>Relevance (liên quan)</strong> — nội dung và khán giả của họ có thực sự hợp thương hiệu không?</li>
<li><strong>Reach (tiếp cận)</strong> — bao nhiêu người, và bao nhiêu trong số đó khớp khán giả mục tiêu?</li>
<li><strong>Resonance (cộng hưởng)</strong> — người theo dõi có thật sự tương tác, không chỉ lướt qua?</li>
</ul>
<h3>Quy trình &amp; rủi ro</h3>
<p>Xác định mục tiêu chiến dịch → sàng lọc theo 3R → brief rõ ràng (thông điệp, được/không được làm, hạn) → hợp đồng (sản phẩm bàn giao, quyền sử dụng, thanh toán) → đo kết quả. Cẩn thận <strong>follower/engagement giả</strong> (kiểm tra tỉ lệ engagement tròn đến đáng ngờ) và luôn yêu cầu <strong>gắn nhãn #ad</strong> minh bạch — quảng cáo không công bố vừa mất niềm tin, vừa vi phạm pháp luật ở nhiều thị trường.</p>
<div class="callout"><span class="badge">Ý chính</span> Lớn hơn không luôn tốt hơn — một nano/micro influencer hợp thương hiệu với engagement thật thường hiệu quả hơn một mega influencer mà khán giả không quan tâm sản phẩm.</div>`,
  ]]);

const c5q = quiz('mkt208c-quiz-5', 'Quiz 5 — Influencer & KOL/KOC|||Quiz 5 — Influencer & KOL/KOC', [
  { id: 'q1', question: 'Khác biệt chính giữa KOL và KOC là gì?', options: ['KOL luôn rẻ hơn KOC', 'KOL là chuyên gia/người nổi tiếng có uy tín; KOC là người tiêu dùng bình thường, review gần gũi', 'KOC luôn có nhiều follower hơn KOL', 'Không có khác biệt, hai tên gọi như nhau'], correctIndex: 1, explanation: 'KOL có uy tín/nổi tiếng; KOC là người dùng thật, review khiến khán giả tin hơn dù follower ít.' },
  { id: 'q2', question: 'Trong khung 3R chọn influencer, "Resonance" nghĩa là gì?', options: ['Số lượng follower', 'Mức độ liên quan với thương hiệu', 'Mức độ người theo dõi thật sự tương tác', 'Giá hợp tác'], correctIndex: 2, explanation: 'Resonance đo việc follower có tương tác thật, không chỉ lướt qua.' },
  { id: 'q3', question: 'Vì sao phải yêu cầu gắn nhãn #ad khi hợp tác influencer?', options: ['Để tăng thêm follower', 'Vì không gắn nhãn không ảnh hưởng gì', 'Để minh bạch với khán giả và tránh vi phạm pháp luật ở nhiều thị trường', 'Chỉ để làm đẹp bài đăng'], correctIndex: 2, explanation: 'Không công bố quảng cáo vừa mất niềm tin khán giả, vừa có thể vi phạm luật quảng cáo.' },
]);

const c6 = doc('mkt208c-6-1-paid-ads', '6.1 — Paid advertising: Meta Ads & TikTok Ads|||6.1 — Quảng cáo trả phí: Meta Ads & TikTok Ads',
  'Cấu trúc campaign, mục tiêu quảng cáo, targeting (demographic/interest/custom/lookalike), ngân sách & tối ưu, chỉ số CPM/CPC/CTR.',
  [[
    `<span class="eyebrow">MKT208c · Chapter 6 · Lesson 6.1</span>
<h2>Paid advertising: Meta Ads &amp; TikTok Ads</h2>
<h3>Campaign structure</h3>
<pre><code>Campaign  -> the overall goal (awareness, traffic, conversions...)
 Ad Set / Ad Group -> targeting + budget + placement
  Ad      -> the actual creative (image/video + copy + CTA)
</code></pre>
<h3>Campaign objectives</h3>
<p>Choose the objective that matches the funnel stage: <strong>Awareness</strong> (reach), <strong>Traffic</strong> (clicks to a link), <strong>Engagement</strong> (likes/comments/shares), <strong>Leads</strong> (form fill), <strong>Conversions</strong> (purchase, sign-up). The platform optimizes delivery toward whichever objective you pick.</p>
<h3>Targeting</h3>
<ul>
<li><strong>Demographic/interest</strong> — age, location, interests, behaviors.</li>
<li><strong>Custom Audience</strong> — people who already interacted with the brand (website visitors, past customers, existing followers).</li>
<li><strong>Lookalike Audience</strong> — new people who resemble an existing Custom Audience — a way to scale beyond who you already know.</li>
</ul>
<h3>Budget &amp; key metrics</h3>
<pre><code>CPM (Cost per 1,000 impressions) = Spend / Impressions x 1000
CPC (Cost per click)             = Spend / Clicks
CTR (Click-through rate)         = Clicks / Impressions x 100%
CPA (Cost per acquisition)       = Spend / Conversions
</code></pre>
<p>Budgets are set <strong>daily</strong> or <strong>lifetime</strong>; always run <strong>A/B tests</strong> on creative (image/video, copy, CTA) — small changes can swing CTR and CPA significantly.</p>
<div class="callout"><span class="badge">Key idea</span> Paid ads are precise and scalable, but only as good as the objective, targeting and creative behind them — the platform optimizes delivery, not your strategy.</div>`,
    `<span class="eyebrow">MKT208c · Chương 6 · Bài 6.1</span>
<h2>Quảng cáo trả phí: Meta Ads &amp; TikTok Ads</h2>
<h3>Cấu trúc campaign</h3>
<pre><code>Campaign  -> mục tiêu tổng thể (nhận biết, traffic, chuyển đổi...)
 Ad Set / Ad Group -> target + ngân sách + vị trí hiển thị
  Ad      -> nội dung sáng tạo thực (ảnh/video + copy + CTA)
</code></pre>
<h3>Mục tiêu quảng cáo</h3>
<p>Chọn mục tiêu khớp giai đoạn funnel: <strong>Nhận biết</strong> (reach), <strong>Traffic</strong> (click về link), <strong>Tương tác</strong> (like/comment/share), <strong>Lead</strong> (điền form), <strong>Chuyển đổi</strong> (mua, đăng ký). Nền tảng tối ưu phân phối theo đúng mục tiêu bạn chọn.</p>
<h3>Targeting</h3>
<ul>
<li><strong>Nhân khẩu học/sở thích</strong> — tuổi, vị trí, sở thích, hành vi.</li>
<li><strong>Custom Audience</strong> — người đã từng tương tác với thương hiệu (khách vào web, khách cũ, follower hiện tại).</li>
<li><strong>Lookalike Audience</strong> — người mới giống với một Custom Audience đã có — cách mở rộng ra ngoài nhóm bạn đã biết.</li>
</ul>
<h3>Ngân sách &amp; chỉ số chính</h3>
<pre><code>CPM (giá mỗi 1.000 lượt hiển thị) = Chi phí / Impressions x 1000
CPC (giá mỗi click)               = Chi phí / Số click
CTR (tỉ lệ click)                 = Số click / Impressions x 100%
CPA (giá mỗi chuyển đổi)          = Chi phí / Số chuyển đổi
</code></pre>
<p>Ngân sách đặt theo <strong>ngày</strong> hoặc <strong>trọn đời chiến dịch</strong>; luôn chạy <strong>A/B test</strong> nội dung sáng tạo (ảnh/video, copy, CTA) — thay đổi nhỏ có thể ảnh hưởng lớn tới CTR và CPA.</p>
<div class="callout"><span class="badge">Ý chính</span> Quảng cáo trả phí chính xác và mở rộng được, nhưng chỉ tốt bằng mục tiêu, targeting và nội dung sáng tạo phía sau — nền tảng tối ưu phân phối, không tối ưu chiến lược của bạn.</div>`,
  ]]);

const c6q = quiz('mkt208c-quiz-6', 'Quiz 6 — Paid ads|||Quiz 6 — Quảng cáo trả phí', [
  { id: 'q1', question: 'Trong cấu trúc quảng cáo Meta/TikTok, đâu là thứ tự đúng từ trên xuống?', options: ['Ad → Ad Set → Campaign', 'Campaign → Ad Set/Ad Group → Ad', 'Ad Set → Campaign → Ad', 'Không có cấu trúc phân cấp'], correctIndex: 1, explanation: 'Campaign chứa mục tiêu tổng, Ad Set chứa targeting/ngân sách, Ad là nội dung sáng tạo thực.' },
  { id: 'q2', question: 'Lookalike Audience là gì?', options: ['Người đã từng mua hàng', 'Người mới có đặc điểm giống một Custom Audience đã có', 'Toàn bộ người dùng nền tảng', 'Chỉ áp dụng cho email marketing'], correctIndex: 1, explanation: 'Lookalike mở rộng targeting tới người giống với một Custom Audience hiện có.' },
  { id: 'q3', question: 'CTR (tỉ lệ click) được tính bằng công thức nào?', options: ['Chi phí / Impressions', 'Số click / Impressions x 100%', 'Chi phí / Số click', 'Số chuyển đổi / Chi phí'], correctIndex: 1, explanation: 'CTR = số click chia impressions, nhân 100%.' },
]);

const c7 = doc('mkt208c-7-1-community-crisis', '7.1 — Community management & crisis response|||7.1 — Quản trị cộng đồng & xử lý khủng hoảng',
  'Vai trò community manager, nguyên tắc phản hồi, social listening phát hiện sớm, quy trình 4 bước xử lý khủng hoảng.',
  [[
    `<span class="eyebrow">MKT208c · Chapter 7 · Lesson 7.1</span>
<h2>Community management &amp; crisis response</h2>
<h3>The community manager's role</h3>
<p>A <strong>community manager</strong> replies to comments/DMs, moderates (removes spam/abuse, keeps discussion on-topic), and nurtures a sense of belonging (welcoming new members, celebrating fans) — the human side of the brand's owned channels.</p>
<h3>Response principles</h3>
<ul>
<li><strong>Speed</strong> — reply within hours, not days; slow replies read as "nobody's listening."</li>
<li><strong>Tone</strong> — match the brand voice, stay calm even when criticized.</li>
<li><strong>Personalization</strong> — use the person's name, address the specific issue, don't copy-paste a generic script.</li>
</ul>
<h3>Social listening: catching problems early</h3>
<p><strong>Social listening</strong> tracks mentions of the brand across platforms — not just on owned channels — so a complaint on a personal page or a trending hashtag is caught before it grows into a crisis.</p>
<h3>Crisis response: a 4-step process</h3>
<pre><code>1. Detect   -> social listening / monitoring flags the issue early
2. Assess   -> how serious? how many people? is it factually true?
3. Respond  -> one unified, honest, timely public statement + fix
4. Follow up-> monitor sentiment, update stakeholders, learn for next time
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Silence is the worst response to a public complaint — a fast, honest, human reply defuses far more crises than it starts.</div>`,
    `<span class="eyebrow">MKT208c · Chương 7 · Bài 7.1</span>
<h2>Quản trị cộng đồng &amp; xử lý khủng hoảng</h2>
<h3>Vai trò community manager</h3>
<p>Một <strong>community manager</strong> trả lời comment/DM, kiểm duyệt (gỡ spam/quấy rối, giữ thảo luận đúng chủ đề), và nuôi dưỡng cảm giác thuộc về (chào thành viên mới, tôn vinh fan) — phần "con người" của các kênh sở hữu của thương hiệu.</p>
<h3>Nguyên tắc phản hồi</h3>
<ul>
<li><strong>Tốc độ</strong> — trả lời trong vài giờ, không phải vài ngày; trả lời chậm khiến khách nghĩ "chẳng ai nghe cả."</li>
<li><strong>Tone</strong> — khớp giọng thương hiệu, giữ bình tĩnh dù bị chê.</li>
<li><strong>Cá nhân hoá</strong> — dùng tên người dùng, nói đúng vấn đề của họ, không copy-paste kịch bản chung.</li>
</ul>
<h3>Social listening: phát hiện sớm</h3>
<p><strong>Social listening</strong> theo dõi nhắc đến thương hiệu trên nhiều nền tảng — không chỉ kênh sở hữu — để một lời phàn nàn trên trang cá nhân hay một hashtag đang lên được phát hiện trước khi nó lớn thành khủng hoảng.</p>
<h3>Xử lý khủng hoảng: quy trình 4 bước</h3>
<pre><code>1. Phát hiện -> social listening/giám sát cảnh báo sớm
2. Đánh giá  -> nghiêm trọng thế nào? bao nhiêu người? có đúng sự thật?
3. Phản hồi  -> một thông cáo công khai thống nhất, thật, kịp lúc + hướng xử lý
4. Theo dõi  -> giám sát cảm xúc dư luận, cập nhật liên quan, rút kinh nghiệm
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Im lặng là phản hồi tệ nhất trước một lời phàn nàn công khai — một phản hồi nhanh, thật, có tính người dập tắt khủng hoảng nhiều hơn là gây ra nó.</div>`,
  ]]);

const c7q = quiz('mkt208c-quiz-7', 'Quiz 7 — Community & crisis|||Quiz 7 — Cộng đồng & khủng hoảng', [
  { id: 'q1', question: 'Social listening khác gì so với chỉ đọc comment/DM trên kênh của thương hiệu?', options: ['Không khác gì', 'Theo dõi nhắc đến thương hiệu trên nhiều nền tảng, không chỉ kênh sở hữu', 'Chỉ dùng để chạy quảng cáo', 'Chỉ áp dụng cho TikTok'], correctIndex: 1, explanation: 'Social listening bao quát cả nhắc đến ngoài kênh sở hữu, giúp phát hiện sớm.' },
  { id: 'q2', question: 'Bước đầu tiên trong quy trình 4 bước xử lý khủng hoảng là gì?', options: ['Phản hồi công khai ngay', 'Phát hiện (qua social listening/giám sát)', 'Theo dõi cảm xúc dư luận', 'Đánh giá mức độ nghiêm trọng'], correctIndex: 1, explanation: 'Bước 1 là phát hiện sớm; sau đó mới đánh giá, phản hồi, theo dõi.' },
  { id: 'q3', question: 'Theo bài, phản hồi nào là tệ nhất trước một lời phàn nàn công khai?', options: ['Trả lời chậm nhưng chân thành', 'Im lặng, không phản hồi', 'Xin lỗi và đưa hướng xử lý', 'Trả lời cá nhân hoá theo tên khách'], correctIndex: 1, explanation: 'Im lặng khiến khách nghĩ thương hiệu không lắng nghe, thường làm khủng hoảng lớn hơn.' },
]);

const c8 = doc('mkt208c-8-1-measurement-listening-trends', '8.1 — Measurement, social listening & trends|||8.1 — Đo lường, social listening & xu hướng',
  'KPI (reach, engagement rate, CTR, ROI/ROAS), công thức engagement rate, công cụ social listening, xu hướng mới của SMM.',
  [[
    `<span class="eyebrow">MKT208c · Chapter 8 · Lesson 8.1</span>
<h2>Measurement, social listening &amp; trends</h2>
<h3>Core KPIs</h3>
<ul>
<li><strong>Reach</strong> — how many unique people saw the content.</li>
<li><strong>Impressions</strong> — total times content was displayed (can be more than reach — one person can see it twice).</li>
<li><strong>Engagement rate</strong> — how much the audience interacted, relative to reach/followers.</li>
<li><strong>Conversion rate</strong> — the share of clicks/visits that completed the desired action.</li>
<li><strong>ROI / ROAS</strong> — Return on Investment / Return on Ad Spend — revenue generated per dollar spent.</li>
</ul>
<h3>Engagement rate formula</h3>
<pre><code>Engagement rate = (Likes + Comments + Shares + Saves) / Reach x 100%
ROAS            = Revenue from ads / Ad spend
</code></pre>
<h3>Social listening tools</h3>
<p>Beyond native platform Insights, dedicated <strong>social listening</strong> tools (Brandwatch, Hootsuite Insights, and Vietnam-local tools like YouNet Media) track brand mentions, sentiment, and competitor activity across the whole web, not just your own accounts.</p>
<h3>Emerging trends</h3>
<pre><code>- AI-generated & AI-assisted content (scripts, captions, even video)
- Short-form video as the default discovery format
- Social commerce (buy directly inside the app: Shop tabs, live shopping)
- Livestream selling (especially strong in Vietnam/SEA)
- AR filters & interactive/immersive ad formats
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Vanity metrics (likes, follower count) look good but don't pay the bills — always tie reporting back to a business outcome: leads, sales, ROAS.</div>`,
    `<span class="eyebrow">MKT208c · Chương 8 · Bài 8.1</span>
<h2>Đo lường, social listening &amp; xu hướng</h2>
<h3>KPI cốt lõi</h3>
<ul>
<li><strong>Reach</strong> — bao nhiêu người xem duy nhất thấy nội dung.</li>
<li><strong>Impressions</strong> — tổng số lần nội dung được hiển thị (có thể nhiều hơn reach — một người có thể thấy hai lần).</li>
<li><strong>Engagement rate</strong> — mức khán giả tương tác, so với reach/follower.</li>
<li><strong>Conversion rate</strong> — tỉ lệ click/lượt truy cập hoàn thành hành động mong muốn.</li>
<li><strong>ROI / ROAS</strong> — tỉ suất hoàn vốn đầu tư / tỉ suất hoàn vốn quảng cáo — doanh thu tạo ra trên mỗi đồng chi.</li>
</ul>
<h3>Công thức engagement rate</h3>
<pre><code>Engagement rate = (Like + Comment + Share + Save) / Reach x 100%
ROAS            = Doanh thu từ quảng cáo / Chi phí quảng cáo
</code></pre>
<h3>Công cụ social listening</h3>
<p>Ngoài Insights có sẵn của từng nền tảng, các công cụ <strong>social listening</strong> chuyên biệt (Brandwatch, Hootsuite Insights, và công cụ nội địa như YouNet Media) theo dõi nhắc đến thương hiệu, cảm xúc dư luận, và hoạt động đối thủ trên toàn web, không chỉ tài khoản của bạn.</p>
<h3>Xu hướng mới</h3>
<pre><code>- Nội dung do AI tạo & AI hỗ trợ (kịch bản, caption, cả video)
- Video ngắn trở thành định dạng khám phá mặc định
- Social commerce (mua ngay trong app: tab Shop, live shopping)
- Livestream bán hàng (đặc biệt mạnh ở Việt Nam/Đông Nam Á)
- Bộ lọc AR & định dạng quảng cáo tương tác/nhập vai
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Chỉ số "vanity" (like, số follower) nhìn đẹp nhưng không trả được hoá đơn — luôn gắn báo cáo với kết quả kinh doanh thật: lead, doanh số, ROAS.</div>`,
  ]]);

const c8q = quiz('mkt208c-quiz-8', 'Quiz 8 — Measurement & trends|||Quiz 8 — Đo lường & xu hướng', [
  { id: 'q1', question: 'Engagement rate được tính bằng công thức nào?', options: ['Reach / Impressions', '(Like+Comment+Share+Save) / Reach x 100%', 'Chi phí / Số click', 'Số follower / Số bài đăng'], correctIndex: 1, explanation: 'Engagement rate = tổng tương tác chia reach, nhân 100%.' },
  { id: 'q2', question: 'Vì sao bài nói "vanity metrics" như like hay số follower có thể gây hiểu lầm?', options: ['Vì chúng luôn sai số liệu', 'Vì chúng nhìn đẹp nhưng không gắn trực tiếp với kết quả kinh doanh như lead, doanh số', 'Vì các nền tảng đã bỏ hiển thị chúng', 'Vì chúng chỉ tồn tại trên TikTok'], correctIndex: 1, explanation: 'Vanity metrics không phản ánh trực tiếp doanh thu/ROAS — cần gắn với kết quả kinh doanh thật.' },
  { id: 'q3', question: 'Social listening giúp ích gì mà Insights riêng của từng nền tảng không làm được?', options: ['Chạy quảng cáo tự động', 'Theo dõi nhắc đến thương hiệu & đối thủ trên toàn web, không chỉ tài khoản của mình', 'Tăng follower miễn phí', 'Thay thế hoàn toàn community manager'], correctIndex: 1, explanation: 'Social listening quét nhắc đến thương hiệu/đối thủ trên toàn web, vượt ra ngoài kênh sở hữu.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'MKT208c',
    slug: 'mkt208c-social-media-marketing',
    title: 'Social media marketing',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MKT208c.webp',
    shortDescription: 'How brands reach & convert customers on social — platforms, content strategy, Facebook/Instagram, TikTok/YouTube, influencers, paid ads, community & crisis handling, measurement & listening. Bilingual, with examples & quizzes.|||Cách doanh nghiệp tiếp cận & chuyển đổi khách hàng trên mạng xã hội — nền tảng, chiến lược nội dung, Facebook/Instagram, TikTok/YouTube, influencer, quảng cáo trả phí, cộng đồng & khủng hoảng, đo lường & social listening. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>MKT208c — Social Media Marketing</strong> (kỳ 3, khối Quản trị Kinh doanh) giúp hiểu <strong>doanh nghiệp dùng mạng xã hội thế nào để marketing hiệu quả</strong>. Từ <strong>hệ sinh thái nền tảng &amp; mô hình PESO</strong> → <strong>chiến lược &amp; lịch nội dung</strong> → <strong>Facebook/Instagram</strong> → <strong>TikTok, YouTube &amp; video marketing</strong> → <strong>influencer marketing &amp; KOL/KOC</strong> → <strong>quảng cáo trả phí</strong> (Meta Ads, TikTok Ads) → <strong>community management &amp; xử lý khủng hoảng</strong> → <strong>đo lường (engagement, ROI) &amp; social listening</strong>. Bám giáo trình (Tuten/Solomon, Ryan), song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Hệ sinh thái nền tảng & mô hình PESO; hành trình khách hàng trên social; content pillar, tone of voice, tỉ lệ nội dung, lịch nội dung; Facebook Page/Group, định dạng Instagram; TikTok "For You", SEO video YouTube, cấu trúc Hook-Body-CTA; KOL vs KOC, tầng influencer, khung 3R; cấu trúc campaign, targeting, CPM/CPC/CTR/CPA; community management, social listening, quy trình xử lý khủng hoảng; KPI, engagement rate, ROI/ROAS, xu hướng mới.',
    requirements: 'Có tài khoản mạng xã hội cá nhân (Facebook/Instagram/TikTok) để quan sát ví dụ thực tế. Không cần kiến thức marketing trước.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Tuten/Solomon & Ryan, tài liệu chính thức Meta/TikTok/Google, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Social media marketing là gì, vì sao quan trọng, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & hệ sinh thái|||Chapter 1 — Overview & ecosystem', description: 'PESO, đặc điểm từng nền tảng, hành trình khách hàng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chiến lược & nội dung|||Chapter 2 — Strategy & content', description: 'Content pillar, tone of voice, lịch nội dung, tái sử dụng.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Facebook & Instagram|||Chapter 3 — Facebook & Instagram', description: 'Page/Group, định dạng Instagram, thuật toán, Meta Business Suite.', lessons: [c3, c3q] },
    { title: 'Chương 4 — TikTok, YouTube & video|||Chapter 4 — TikTok, YouTube & video', description: 'Thuật toán For You, SEO video, Hook-Body-CTA, thông số định dạng.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Influencer & KOL/KOC|||Chapter 5 — Influencer & KOL/KOC', description: 'KOL vs KOC, tầng influencer, khung 3R, rủi ro & minh bạch.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Quảng cáo trả phí|||Chapter 6 — Paid advertising', description: 'Cấu trúc campaign, targeting, ngân sách, CPM/CPC/CTR/CPA.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Cộng đồng & khủng hoảng|||Chapter 7 — Community & crisis', description: 'Community manager, nguyên tắc phản hồi, quy trình xử lý khủng hoảng.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường & xu hướng|||Chapter 8 — Measurement & trends', description: 'KPI, engagement rate, ROI/ROAS, social listening, xu hướng mới.', lessons: [c8, c8q] },
  ],
};
