/**
 * CSP202m — Introduction of Content Strategy (Nhập môn Chiến lược nội dung).
 * Khối Công nghệ Truyền thông FPTU, Kỳ 3. Khung "chất lượng", song ngữ VI+EN.
 * Sách chuẩn: Halvorson "Content Strategy for the Web"; Handley "Everybody
 * Writes"; Pulizzi "Epic Content Marketing"/"Content Inc."; Rebecca Lieb.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('csp202m-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, sách chuẩn (Halvorson, Handley, Pulizzi, Lieb), tài liệu miễn phí (CMI, HubSpot Academy), YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">CSP202m · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>content strategy</strong> — from planning and audience research to editorial calendars, SEO and measurement — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for CSP202m are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Content Strategy for the Web</em> — Kristina Halvorson &amp; Melissa Rach (the field's foundational text)</li>
<li><em>Everybody Writes</em> — Ann Handley (writing &amp; content quality)</li>
<li><em>Epic Content Marketing</em> / <em>Content Inc.</em> — Joe Pulizzi (audience-first strategy)</li>
<li><em>Content: The Atomic Particle of Marketing</em> — Rebecca Lieb</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://contentmarketinginstitute.com/" target="_blank" rel="noopener">Content Marketing Institute (CMI)</a> — research, frameworks &amp; the annual benchmarks</li>
<li><a href="https://academy.hubspot.com/" target="_blank" rel="noopener">HubSpot Academy</a> — free content marketing &amp; SEO certifications</li>
<li><a href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content" target="_blank" rel="noopener">Google Search Central — helpful content</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@hubspot" target="_blank" rel="noopener">HubSpot</a> — content &amp; inbound marketing</li>
<li><a href="https://www.youtube.com/@AhrefsCom" target="_blank" rel="noopener">Ahrefs</a> — SEO &amp; content that ranks</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://trends.google.com/trends/" target="_blank" rel="noopener">Google Trends</a> — topic &amp; demand research</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> / Notion — editorial calendar &amp; workflow</li>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics</a> — engagement &amp; conversion measurement</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what strategy is (vs marketing), audience &amp; message, the content audit.</li>
<li><strong>Plan</strong> — build pillars, pick formats/channels, draft an editorial calendar.</li>
<li><strong>Publish</strong> — write findable content (SEO, topic clusters) on a repeatable workflow.</li>
<li><strong>Measure</strong> — set KPIs by goal, read engagement &amp; conversion, iterate.</li>
</ol></div>`,
    `<span class="eyebrow">CSP202m · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>chiến lược nội dung</strong> — từ lập kế hoạch, nghiên cứu công chúng đến lịch biên tập, SEO và đo lường — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của CSP202m có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Content Strategy for the Web</em> — Kristina Halvorson &amp; Melissa Rach (sách nền tảng của ngành)</li>
<li><em>Everybody Writes</em> — Ann Handley (viết &amp; chất lượng nội dung)</li>
<li><em>Epic Content Marketing</em> / <em>Content Inc.</em> — Joe Pulizzi (chiến lược lấy công chúng làm gốc)</li>
<li><em>Content: The Atomic Particle of Marketing</em> — Rebecca Lieb</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://contentmarketinginstitute.com/" target="_blank" rel="noopener">Content Marketing Institute (CMI)</a> — nghiên cứu, framework &amp; báo cáo thường niên</li>
<li><a href="https://academy.hubspot.com/" target="_blank" rel="noopener">HubSpot Academy</a> — chứng chỉ content marketing &amp; SEO miễn phí</li>
<li><a href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content" target="_blank" rel="noopener">Google Search Central — nội dung hữu ích</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@hubspot" target="_blank" rel="noopener">HubSpot</a> — content &amp; inbound marketing</li>
<li><a href="https://www.youtube.com/@AhrefsCom" target="_blank" rel="noopener">Ahrefs</a> — SEO &amp; nội dung lên top</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://trends.google.com/trends/" target="_blank" rel="noopener">Google Trends</a> — nghiên cứu chủ đề &amp; nhu cầu</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> / Notion — lịch biên tập &amp; quy trình</li>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics</a> — đo tương tác &amp; chuyển đổi</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — chiến lược là gì (khác marketing), công chúng &amp; thông điệp, kiểm toán nội dung.</li>
<li><strong>Lập kế hoạch</strong> — dựng trụ cột, chọn định dạng/kênh, soạn lịch biên tập.</li>
<li><strong>Xuất bản</strong> — viết nội dung tìm thấy được (SEO, topic cluster) trên quy trình lặp lại.</li>
<li><strong>Đo lường</strong> — đặt KPI theo mục tiêu, đọc tương tác &amp; chuyển đổi, cải tiến.</li>
</ol></div>`,
  ]]);

const intro = doc('csp202m-0-1-overview', 'Course overview: Content strategy|||Tổng quan: Chiến lược nội dung',
  'Chiến lược nội dung làm gì; khác gì viết bài lẻ; lộ trình: chiến lược & công chúng → kiểm toán & trụ cột → định dạng/kênh & lịch biên tập → SEO & đo lường.',
  [[
    `<span class="eyebrow">CSP202m · Lesson 0.1 · Overview</span>
<h2>Content strategy</h2>
<p class="lead">This course helps you understand <strong>how organizations plan, create, deliver and govern content</strong> so it serves a real business goal — not just "posting more". You'll learn to move from random acts of content to a <strong>repeatable strategy</strong>: who it's for, what it says, where it lives, and how you know it worked.</p>
<h3>Kristina Halvorson's definition</h3>
<p>"Content strategy guides the <strong>creation, delivery, and governance</strong> of useful, usable content." Four verbs, one discipline: plan it, make it, publish it, and keep it healthy over time.</p>
<h3>Why it matters</h3>
<p>Great content without strategy is expensive noise. Strategy makes every piece <strong>earn its place</strong> — aligned to an audience need and a measurable outcome.</p>
<h3>Roadmap</h3>
<p>Strategy vs marketing (COPE) → audience personas &amp; journey → content audit &amp; gap analysis → pillars &amp; brand voice → formats &amp; channels → editorial calendar &amp; governance → SEO &amp; topic clusters → measurement &amp; content ROI. Bilingual, with real-brand examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">CSP202m · Bài 0.1 · Tổng quan</span>
<h2>Chiến lược nội dung</h2>
<p class="lead">Môn này giúp bạn hiểu <strong>tổ chức lập kế hoạch, tạo, phân phối và quản trị nội dung thế nào</strong> để phục vụ một mục tiêu kinh doanh thật — không chỉ là "đăng cho nhiều". Bạn học cách đi từ những mẩu nội dung ngẫu hứng đến một <strong>chiến lược lặp lại được</strong>: cho ai, nói gì, ở đâu, và làm sao biết nó có hiệu quả.</p>
<h3>Định nghĩa của Kristina Halvorson</h3>
<p>"Chiến lược nội dung dẫn dắt việc <strong>tạo, phân phối và quản trị</strong> nội dung hữu ích, dùng được." Bốn động từ, một chuyên môn: lên kế hoạch, làm ra, xuất bản, và giữ cho nó khoẻ mạnh theo thời gian.</p>
<h3>Vì sao quan trọng</h3>
<p>Nội dung hay mà không có chiến lược là tiếng ồn đắt tiền. Chiến lược khiến mỗi mẩu <strong>xứng đáng có mặt</strong> — gắn với một nhu cầu của công chúng và một kết quả đo được.</p>
<h3>Lộ trình</h3>
<p>Chiến lược vs marketing (COPE) → chân dung công chúng &amp; hành trình → kiểm toán &amp; gap analysis → trụ cột &amp; brand voice → định dạng &amp; kênh → lịch biên tập &amp; governance → SEO &amp; topic cluster → đo lường &amp; content ROI. Song ngữ, có ví dụ thương hiệu thật và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('csp202m-1-1-what-is', '1.1 — What content strategy is|||1.1 — Chiến lược nội dung là gì',
  'Content strategy vs content marketing; vì sao cần chiến lược; nguyên tắc COPE (Create Once, Publish Everywhere).',
  [[
    `<span class="eyebrow">CSP202m · Chapter 1 · Lesson 1.1</span>
<h2>What content strategy is</h2>
<h3>Strategy vs marketing</h3>
<ul>
<li><strong>Content strategy</strong> is the <em>plan</em> — the discipline of deciding why, for whom, what, and how content gets created, delivered and governed.</li>
<li><strong>Content marketing</strong> is one <em>execution</em> of that plan — using content to attract and retain an audience to drive profitable action.</li>
</ul>
<p>Strategy is the map; marketing is one journey on it. Skip the map and you get busy publishing that goes nowhere.</p>
<h3>Why you need a strategy</h3>
<p>Without it, teams produce "random acts of content" — inconsistent voice, duplicated effort, pages nobody reads. Strategy aligns every piece to a <strong>goal</strong> and an <strong>audience need</strong>.</p>
<h3>COPE — Create Once, Publish Everywhere</h3>
<p>Coined at NPR: structure content as reusable chunks (not page-locked blobs) so one source can flow to web, app, email and voice. Separate <strong>content from presentation</strong> and you stop rewriting the same thing for every channel.</p>
<div class="callout"><span class="badge">Real brand</span> <strong>NPR</strong> built COPE so a single story feeds its site, apps and partners — write once, appear everywhere.</div>`,
    `<span class="eyebrow">CSP202m · Chương 1 · Bài 1.1</span>
<h2>Chiến lược nội dung là gì</h2>
<h3>Chiến lược vs marketing</h3>
<ul>
<li><strong>Chiến lược nội dung</strong> là <em>kế hoạch</em> — chuyên môn quyết định vì sao, cho ai, cái gì, và nội dung được tạo, phân phối, quản trị thế nào.</li>
<li><strong>Content marketing</strong> là một <em>cách thực thi</em> kế hoạch đó — dùng nội dung để thu hút và giữ chân công chúng, thúc đẩy hành động có lợi.</li>
</ul>
<p>Chiến lược là tấm bản đồ; marketing là một chuyến đi trên đó. Bỏ bản đồ thì bạn bận rộn xuất bản mà chẳng tới đâu.</p>
<h3>Vì sao cần chiến lược</h3>
<p>Thiếu nó, đội ngũ sản xuất "nội dung ngẫu hứng" — giọng không nhất quán, làm trùng, trang chẳng ai đọc. Chiến lược gắn mỗi mẩu với một <strong>mục tiêu</strong> và một <strong>nhu cầu công chúng</strong>.</p>
<h3>COPE — Tạo một lần, Xuất bản mọi nơi</h3>
<p>Ra đời tại NPR: cấu trúc nội dung thành khối tái dùng (không khoá cứng vào trang) để một nguồn chảy được ra web, app, email và giọng nói. Tách <strong>nội dung khỏi trình bày</strong> thì bạn hết phải viết lại cùng một thứ cho mỗi kênh.</p>
<div class="callout"><span class="badge">Thương hiệu thật</span> <strong>NPR</strong> dựng COPE để một bài chảy vào site, app và đối tác — viết một lần, hiện mọi nơi.</div>`,
  ]]);

const c1q = quiz('csp202m-quiz-1', 'Quiz 1 — What it is|||Quiz 1 — Là gì', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa chiến lược nội dung và content marketing?', options: ['Hai cái giống hệt nhau', 'Chiến lược là kế hoạch; marketing là một cách thực thi kế hoạch đó', 'Marketing là kế hoạch; chiến lược là thực thi', 'Chiến lược chỉ dành cho mạng xã hội'], correctIndex: 1, explanation: 'Chiến lược = bản đồ/kế hoạch; content marketing = một chuyến đi thực thi.' },
  { id: 'q2', question: 'COPE là viết tắt của?', options: ['Copy Often, Post Everyday', 'Create Once, Publish Everywhere', 'Content Only, Publish Early', 'Curate Old, Post Everywhere'], correctIndex: 1, explanation: 'Create Once, Publish Everywhere — tách nội dung khỏi trình bày để tái dùng.' },
  { id: 'q3', question: '"Random acts of content" (nội dung ngẫu hứng) là hệ quả của?', options: ['Có chiến lược rõ ràng', 'Thiếu chiến lược dẫn dắt', 'Dùng COPE', 'Đo lường KPI'], correctIndex: 1, explanation: 'Thiếu chiến lược → giọng thiếu nhất quán, làm trùng, không gắn mục tiêu.' },
]);

const c2 = doc('csp202m-2-1-audience', '2.1 — Audience research & insight|||2.1 — Nghiên cứu & thấu hiểu công chúng',
  'Audience persona, jobs-to-be-done, insight thật, và hành trình khách hàng (awareness → consideration → decision).',
  [[
    `<span class="eyebrow">CSP202m · Chapter 2 · Lesson 2.1</span>
<h2>Audience research &amp; insight</h2>
<h3>Personas</h3>
<p>A <strong>persona</strong> is a research-based portrait of a target reader — goals, context, questions, and where they look. It stops you writing for "everyone" (which reaches no one).</p>
<h3>Jobs-to-be-done (JTBD)</h3>
<p>People "hire" content to get a job done. Ask <em>what is the reader trying to accomplish?</em> — not just demographics. JTBD reframes topics around progress the reader wants.</p>
<h3>Insight, not data</h3>
<p>A number is data ("70% drop off at checkout"); an <strong>insight</strong> is the human why behind it ("they don't trust the shipping cost yet"). Content answers the why.</p>
<h3>The customer journey</h3>
<pre><code>Awareness    -> reader has a problem, is searching  (how-to, explainer)
Consideration-> comparing options                   (guides, comparisons)
Decision     -> ready to act                         (case study, demo, pricing)
</code></pre>
<div class="callout"><span class="badge">Real brand</span> <strong>Spotify Wrapped</strong> works because it nails a JTBD — "help me share who I am through my music" — turning private data into content people <em>want</em> to post.</div>`,
    `<span class="eyebrow">CSP202m · Chương 2 · Bài 2.1</span>
<h2>Nghiên cứu &amp; thấu hiểu công chúng</h2>
<h3>Chân dung (persona)</h3>
<p>Một <strong>persona</strong> là bức chân dung dựa trên nghiên cứu về người đọc mục tiêu — mục tiêu, bối cảnh, câu hỏi, và họ tìm ở đâu. Nó ngăn bạn viết cho "tất cả mọi người" (tức chẳng chạm được ai).</p>
<h3>Jobs-to-be-done (JTBD)</h3>
<p>Người ta "thuê" nội dung để hoàn thành một việc. Hãy hỏi <em>người đọc đang cố đạt điều gì?</em> — không chỉ nhân khẩu học. JTBD đặt chủ đề quanh tiến bộ mà người đọc muốn.</p>
<h3>Insight, không phải số liệu</h3>
<p>Một con số là dữ liệu ("70% bỏ giỏ ở bước thanh toán"); một <strong>insight</strong> là cái "vì sao" con người phía sau ("họ chưa tin phí ship"). Nội dung trả lời cái "vì sao".</p>
<h3>Hành trình khách hàng</h3>
<pre><code>Nhận biết   -> có vấn đề, đang tìm kiếm     (how-to, bài giải thích)
Cân nhắc    -> so sánh lựa chọn             (cẩm nang, so sánh)
Quyết định  -> sẵn sàng hành động           (case study, demo, bảng giá)
</code></pre>
<div class="callout"><span class="badge">Thương hiệu thật</span> <strong>Spotify Wrapped</strong> thành công vì trúng một JTBD — "giúp tôi thể hiện mình qua âm nhạc" — biến dữ liệu riêng tư thành nội dung người ta <em>muốn</em> đăng.</div>`,
  ]]);

const c2q = quiz('csp202m-quiz-2', 'Quiz 2 — Audience|||Quiz 2 — Công chúng', [
  { id: 'q1', question: 'Persona (chân dung công chúng) là?', options: ['Một khách hàng có thật cụ thể', 'Bức chân dung dựa trên nghiên cứu về người đọc mục tiêu', 'Danh sách từ khoá SEO', 'Lịch đăng bài'], correctIndex: 1, explanation: 'Persona gói mục tiêu, bối cảnh, câu hỏi của nhóm đọc mục tiêu.' },
  { id: 'q2', question: 'Jobs-to-be-done tập trung vào?', options: ['Nhân khẩu học (tuổi, giới)', 'Việc/tiến bộ mà người đọc đang cố đạt được', 'Số lượt like', 'Ngân sách quảng cáo'], correctIndex: 1, explanation: 'JTBD hỏi người đọc muốn hoàn thành việc gì, không chỉ họ là ai.' },
  { id: 'q3', question: 'Ở giai đoạn "Nhận biết" (awareness), nội dung phù hợp nhất là?', options: ['Bảng giá & demo', 'Case study chốt đơn', 'Bài how-to / giải thích vấn đề', 'Điều khoản hợp đồng'], correctIndex: 2, explanation: 'Awareness: người đọc mới có vấn đề → nội dung giải thích, how-to.' },
]);

const c3 = doc('csp202m-3-1-audit', '3.1 — Content audit & ecosystem|||3.1 — Kiểm toán & hệ sinh thái nội dung',
  'Content inventory (kiểm kê), content audit (đánh giá chất lượng), và gap analysis (tìm khoảng trống nội dung).',
  [[
    `<span class="eyebrow">CSP202m · Chapter 3 · Lesson 3.1</span>
<h2>Content audit &amp; ecosystem</h2>
<h3>Inventory vs audit</h3>
<ul>
<li><strong>Inventory</strong> — the quantitative list: every URL/asset, its title, type, owner, date. It answers "what do we have?"</li>
<li><strong>Audit</strong> — the qualitative judgement on each item: is it accurate, on-brand, performing? It answers "is it any good?"</li>
</ul>
<h3>The ROT test</h3>
<p>Flag content that is <strong>Redundant, Outdated, or Trivial</strong> — the classic clean-up filter. Decide per item: <em>keep, update, consolidate, or remove</em>.</p>
<h3>Gap analysis</h3>
<p>Compare what you have against audience needs and the journey. Missing a decision-stage comparison? A gap. Three blog posts on the same beginner topic and nothing advanced? Overlap plus a gap. Gaps become your content backlog.</p>
<pre><code>Audit output per page:
  URL | type | audience | journey stage | quality | action (keep/update/kill)
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> You can't plan new content honestly until you know what already exists — most teams have more content than they think and less that works than they hope.</div>`,
    `<span class="eyebrow">CSP202m · Chương 3 · Bài 3.1</span>
<h2>Kiểm toán &amp; hệ sinh thái nội dung</h2>
<h3>Kiểm kê vs kiểm toán</h3>
<ul>
<li><strong>Kiểm kê (inventory)</strong> — danh sách định lượng: mọi URL/tài sản, tiêu đề, loại, người phụ trách, ngày. Trả lời "ta đang có gì?"</li>
<li><strong>Kiểm toán (audit)</strong> — đánh giá định tính từng mục: có chính xác, đúng thương hiệu, hiệu quả không? Trả lời "nó có tốt không?"</li>
</ul>
<h3>Phép thử ROT</h3>
<p>Đánh dấu nội dung <strong>Trùng lặp (Redundant), Lỗi thời (Outdated), Vụn vặt (Trivial)</strong> — bộ lọc dọn dẹp kinh điển. Quyết mỗi mục: <em>giữ, cập nhật, gộp, hay bỏ</em>.</p>
<h3>Gap analysis (phân tích khoảng trống)</h3>
<p>So cái đang có với nhu cầu công chúng và hành trình. Thiếu bài so sánh ở giai đoạn quyết định? Một khoảng trống. Ba bài blog cùng chủ đề nhập môn mà không có bài nâng cao? Vừa trùng vừa hụt. Khoảng trống trở thành danh sách nội dung cần làm.</p>
<pre><code>Kết quả kiểm toán mỗi trang:
  URL | loại | công chúng | giai đoạn hành trình | chất lượng | hành động (giữ/cập nhật/bỏ)
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Không thể lập kế hoạch nội dung mới một cách trung thực khi chưa biết đang có gì — hầu hết đội ngũ có nhiều nội dung hơn họ tưởng và ít cái chạy được hơn họ mong.</div>`,
  ]]);

const c3q = quiz('csp202m-quiz-3', 'Quiz 3 — Audit|||Quiz 3 — Kiểm toán', [
  { id: 'q1', question: 'Khác nhau giữa content inventory và content audit?', options: ['Giống nhau hoàn toàn', 'Inventory là danh sách định lượng "có gì"; audit là đánh giá định tính "có tốt không"', 'Inventory đánh giá chất lượng; audit chỉ đếm', 'Cả hai chỉ dùng cho video'], correctIndex: 1, explanation: 'Inventory = liệt kê; audit = đánh giá chất lượng/độ phù hợp.' },
  { id: 'q2', question: 'Bộ lọc ROT dùng để đánh dấu nội dung?', options: ['Redundant, Outdated, Trivial (trùng, lỗi thời, vụn vặt)', 'Ranked, Optimized, Trending', 'Read, Open, Tagged', 'Real, Original, True'], correctIndex: 0, explanation: 'ROT = Redundant/Outdated/Trivial — nội dung nên gộp/cập nhật/bỏ.' },
  { id: 'q3', question: 'Gap analysis giúp phát hiện?', options: ['Nội dung trùng lặp cần xoá', 'Khoảng trống nội dung so với nhu cầu công chúng & hành trình', 'Lỗi chính tả', 'Ngân sách quảng cáo'], correctIndex: 1, explanation: 'Gap analysis so cái đang có với nhu cầu → tìm nội dung còn thiếu.' },
]);

const c4 = doc('csp202m-4-1-pillars', '4.1 — Content pillars & brand voice|||4.1 — Trụ cột nội dung & thông điệp',
  'Content pillars (trụ cột chủ đề), messaging framework (thông điệp), và brand voice/tone (giọng & sắc thái thương hiệu).',
  [[
    `<span class="eyebrow">CSP202m · Chapter 4 · Lesson 4.1</span>
<h2>Content pillars &amp; brand voice</h2>
<h3>Content pillars</h3>
<p><strong>Pillars</strong> are the 3–5 core themes you want to be known for — each tied to audience needs and business goals. Every piece should ladder up to a pillar; if it doesn't fit one, question why you're making it.</p>
<h3>Messaging framework</h3>
<p>A short document capturing <em>what you say and why</em>: value proposition, key messages, proof points. It keeps a hundred pieces of content telling <strong>one coherent story</strong>.</p>
<h3>Voice vs tone</h3>
<ul>
<li><strong>Voice</strong> — your brand's consistent personality (e.g. "plain-spoken, encouraging"). It doesn't change.</li>
<li><strong>Tone</strong> — how that voice flexes by context: warm on a welcome page, calm and precise on an error message.</li>
</ul>
<div class="callout"><span class="badge">Real brand</span> <strong>Mailchimp</strong>'s public voice-and-tone guide is the classic example: one friendly voice, tone that shifts with the reader's emotional state.</div>`,
    `<span class="eyebrow">CSP202m · Chương 4 · Bài 4.1</span>
<h2>Trụ cột nội dung &amp; giọng thương hiệu</h2>
<h3>Trụ cột nội dung (pillars)</h3>
<p><strong>Trụ cột</strong> là 3–5 chủ đề cốt lõi bạn muốn được biết đến — mỗi cái gắn với nhu cầu công chúng và mục tiêu kinh doanh. Mỗi mẩu nên quy về được một trụ cột; nếu không khớp cái nào, hãy hỏi vì sao lại làm nó.</p>
<h3>Khung thông điệp (messaging framework)</h3>
<p>Một tài liệu ngắn ghi lại <em>bạn nói gì và vì sao</em>: tuyên bố giá trị, thông điệp chính, bằng chứng. Nó giữ cho hàng trăm mẩu nội dung cùng kể <strong>một câu chuyện nhất quán</strong>.</p>
<h3>Voice vs tone (giọng vs sắc thái)</h3>
<ul>
<li><strong>Voice (giọng)</strong> — tính cách nhất quán của thương hiệu (vd "mộc mạc, khích lệ"). Nó không đổi.</li>
<li><strong>Tone (sắc thái)</strong> — cách giọng đó uốn theo bối cảnh: ấm áp ở trang chào mừng, điềm tĩnh và chính xác ở thông báo lỗi.</li>
</ul>
<div class="callout"><span class="badge">Thương hiệu thật</span> Cẩm nang voice-and-tone công khai của <strong>Mailchimp</strong> là ví dụ kinh điển: một giọng thân thiện, sắc thái đổi theo trạng thái cảm xúc của người đọc.</div>`,
  ]]);

const c4q = quiz('csp202m-quiz-4', 'Quiz 4 — Pillars & voice|||Quiz 4 — Trụ cột & giọng', [
  { id: 'q1', question: 'Content pillars (trụ cột nội dung) là?', options: ['Danh sách từ khoá', '3–5 chủ đề cốt lõi thương hiệu muốn được biết đến', 'Số bài đăng mỗi tuần', 'Màu sắc thương hiệu'], correctIndex: 1, explanation: 'Pillars là các chủ đề cốt lõi, mỗi mẩu nội dung nên quy về một trụ cột.' },
  { id: 'q2', question: 'Khác biệt giữa voice và tone?', options: ['Voice đổi theo bối cảnh; tone không đổi', 'Voice là tính cách nhất quán; tone là cách giọng uốn theo bối cảnh', 'Chúng giống hệt nhau', 'Voice chỉ dùng cho video'], correctIndex: 1, explanation: 'Voice = tính cách cố định; tone = biến thể theo tình huống.' },
  { id: 'q3', question: 'Messaging framework giúp?', options: ['Đo lượt xem', 'Giữ hàng trăm mẩu nội dung cùng kể một câu chuyện nhất quán', 'Thay thế SEO', 'Chọn màu logo'], correctIndex: 1, explanation: 'Khung thông điệp gói value prop + thông điệp chính + bằng chứng → nhất quán.' },
]);

const c5 = doc('csp202m-5-1-formats-channels', '5.1 — Formats & channels|||5.1 — Định dạng & kênh',
  'Định dạng (blog/video/social/email/podcast), chọn kênh phù hợp công chúng & mục tiêu, và repurposing (tái sử dụng).',
  [[
    `<span class="eyebrow">CSP202m · Chapter 5 · Lesson 5.1</span>
<h2>Formats &amp; channels</h2>
<h3>Format follows the job</h3>
<ul>
<li><strong>Blog / article</strong> — depth, SEO, evergreen how-tos.</li>
<li><strong>Video</strong> — demonstration, emotion, reach on social &amp; YouTube.</li>
<li><strong>Social posts</strong> — awareness, community, timely reactions.</li>
<li><strong>Email / newsletter</strong> — owned audience, nurture, retention.</li>
<li><strong>Podcast</strong> — depth &amp; loyalty on the go.</li>
</ul>
<h3>Owned, earned, paid</h3>
<p>Pick channels by where your audience already is and what you control: <strong>owned</strong> (site, email), <strong>earned</strong> (PR, shares), <strong>paid</strong> (ads). Don't spread thin across every platform — go deep where it counts.</p>
<h3>Repurposing</h3>
<p>One pillar piece becomes many: a webinar → a blog recap → five social clips → an email → an infographic. This is COPE in practice — maximize reach per idea, tuned to each channel's native form.</p>
<div class="callout"><span class="badge">Real brand</span> <strong>GaryVee</strong>'s "content pyramid" turns one long video into dozens of platform-native micro-pieces — the repurposing playbook made famous.</div>`,
    `<span class="eyebrow">CSP202m · Chương 5 · Bài 5.1</span>
<h2>Định dạng &amp; kênh</h2>
<h3>Định dạng bám theo mục đích</h3>
<ul>
<li><strong>Blog / bài viết</strong> — chiều sâu, SEO, how-to lâu bền.</li>
<li><strong>Video</strong> — minh hoạ, cảm xúc, lan toả trên social &amp; YouTube.</li>
<li><strong>Bài mạng xã hội</strong> — nhận biết, cộng đồng, phản ứng kịp thời.</li>
<li><strong>Email / bản tin</strong> — công chúng sở hữu, nuôi dưỡng, giữ chân.</li>
<li><strong>Podcast</strong> — chiều sâu &amp; trung thành khi di chuyển.</li>
</ul>
<h3>Owned, earned, paid (sở hữu, kiếm được, trả phí)</h3>
<p>Chọn kênh theo nơi công chúng đã có mặt và thứ bạn kiểm soát: <strong>owned</strong> (site, email), <strong>earned</strong> (PR, chia sẻ), <strong>paid</strong> (quảng cáo). Đừng dàn mỏng khắp mọi nền tảng — hãy đào sâu ở nơi đáng.</p>
<h3>Repurposing (tái sử dụng)</h3>
<p>Một mẩu trụ cột đẻ ra nhiều: một webinar → bài blog tóm tắt → năm clip social → một email → một infographic. Đây là COPE trong thực tế — tối đa hoá độ phủ mỗi ý tưởng, chỉnh theo hình thức bản địa của từng kênh.</p>
<div class="callout"><span class="badge">Thương hiệu thật</span> "Content pyramid" của <strong>GaryVee</strong> biến một video dài thành hàng chục mẩu nhỏ bản địa cho từng nền tảng — bài bản repurposing nổi tiếng.</div>`,
  ]]);

const c5q = quiz('csp202m-quiz-5', 'Quiz 5 — Formats & channels|||Quiz 5 — Định dạng & kênh', [
  { id: 'q1', question: 'Kênh "owned" (sở hữu) là ví dụ nào?', options: ['Quảng cáo trả phí trên Facebook', 'Website & email của chính thương hiệu', 'Bài báo PR do báo viết', 'Lượt chia sẻ của người dùng'], correctIndex: 1, explanation: 'Owned = kênh bạn kiểm soát (site, email); paid = quảng cáo; earned = PR/chia sẻ.' },
  { id: 'q2', question: 'Repurposing nội dung nghĩa là?', options: ['Xoá nội dung cũ', 'Biến một mẩu trụ cột thành nhiều định dạng/kênh khác nhau', 'Chỉ đăng lại y hệt', 'Mua thêm quảng cáo'], correctIndex: 1, explanation: 'Repurposing tối đa hoá độ phủ mỗi ý tưởng, chỉnh theo từng kênh.' },
  { id: 'q3', question: 'Nguyên tắc chọn kênh đúng là?', options: ['Có mặt trên mọi nền tảng cùng lúc', 'Đào sâu nơi công chúng đã có mặt, không dàn mỏng', 'Chỉ dùng kênh mới nhất', 'Chọn kênh rẻ nhất'], correctIndex: 1, explanation: 'Đi sâu nơi công chúng ở và nơi bạn kiểm soát, thay vì dàn trải.' },
]);

const c6 = doc('csp202m-6-1-calendar', '6.1 — Editorial calendar & governance|||6.1 — Lịch biên tập & quản trị',
  'Editorial calendar & content plan, workflow (quy trình sản xuất), và governance (quản trị: ai sở hữu, quy chuẩn, vòng đời).',
  [[
    `<span class="eyebrow">CSP202m · Chapter 6 · Lesson 6.1</span>
<h2>Editorial calendar &amp; governance</h2>
<h3>Editorial calendar</h3>
<p>A shared schedule of <em>what publishes when, where, by whom, for which audience/pillar</em>. It turns strategy into a steady, plannable cadence instead of last-minute scrambles.</p>
<h3>Workflow</h3>
<pre><code>Idea -> Draft -> Edit -> Review/approve -> Publish -> Promote -> Review
</code></pre>
<p>Define who does each step and the hand-off between them. A clear workflow is what lets a team publish reliably without heroics.</p>
<h3>Governance</h3>
<p><strong>Governance</strong> is the "who decides" layer: ownership, standards (style guide, brand voice), and the <strong>content lifecycle</strong> — review dates, archiving, and who retires stale pages. Without governance, today's great content quietly rots into tomorrow's ROT.</p>
<div class="callout"><span class="badge">Why it matters</span> Halvorson stresses governance as the most-skipped, most-decisive part: strategy that no one owns or maintains dies within a quarter.</div>`,
    `<span class="eyebrow">CSP202m · Chương 6 · Bài 6.1</span>
<h2>Lịch biên tập &amp; quản trị</h2>
<h3>Lịch biên tập (editorial calendar)</h3>
<p>Một lịch chung ghi <em>cái gì xuất bản khi nào, ở đâu, do ai, cho công chúng/trụ cột nào</em>. Nó biến chiến lược thành nhịp đều đặn, lập kế hoạch được, thay vì chạy nước rút phút chót.</p>
<h3>Quy trình (workflow)</h3>
<pre><code>Ý tưởng -> Bản nháp -> Biên tập -> Duyệt -> Xuất bản -> Quảng bá -> Rà lại
</code></pre>
<p>Định rõ ai làm mỗi bước và cách bàn giao giữa các bước. Một quy trình rõ ràng là thứ giúp đội ngũ xuất bản đều đặn mà không cần "anh hùng".</p>
<h3>Quản trị (governance)</h3>
<p><strong>Governance</strong> là lớp "ai quyết định": quyền sở hữu, quy chuẩn (style guide, brand voice), và <strong>vòng đời nội dung</strong> — ngày rà soát, lưu trữ, và ai gỡ trang cũ. Thiếu governance, nội dung hay hôm nay âm thầm mục thành ROT ngày mai.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Halvorson nhấn mạnh governance là phần bị bỏ qua nhiều nhất nhưng quyết định nhất: chiến lược không ai sở hữu hay bảo trì sẽ chết trong một quý.</div>`,
  ]]);

const c6q = quiz('csp202m-quiz-6', 'Quiz 6 — Calendar & governance|||Quiz 6 — Lịch & quản trị', [
  { id: 'q1', question: 'Editorial calendar (lịch biên tập) chủ yếu trả lời?', options: ['Nội dung nào đúng chính tả', 'Cái gì xuất bản khi nào, ở đâu, do ai, cho ai', 'Giá quảng cáo bao nhiêu', 'Server đặt ở đâu'], correctIndex: 1, explanation: 'Lịch biên tập biến chiến lược thành nhịp xuất bản lập kế hoạch được.' },
  { id: 'q2', question: 'Content governance (quản trị nội dung) bao gồm?', options: ['Chỉ việc viết bài', 'Quyền sở hữu, quy chuẩn, và vòng đời nội dung (rà soát/lưu trữ/gỡ)', 'Chỉ chọn màu sắc', 'Chỉ mua từ khoá'], correctIndex: 1, explanation: 'Governance = ai quyết định, quy chuẩn, và duy trì vòng đời nội dung.' },
  { id: 'q3', question: 'Vì sao workflow rõ ràng lại quan trọng?', options: ['Để tăng giá bán', 'Giúp đội ngũ xuất bản đều đặn, đáng tin mà không cần "anh hùng"', 'Để bỏ bước biên tập', 'Để tránh đo lường'], correctIndex: 1, explanation: 'Workflow định rõ ai làm gì và bàn giao ra sao → xuất bản ổn định.' },
]);

const c7 = doc('csp202m-7-1-seo', '7.1 — SEO & discoverable content|||7.1 — SEO & nội dung tìm thấy được',
  'Nghiên cứu từ khoá & search intent, on-page SEO, topic cluster (cụm chủ đề pillar–cluster), và discoverability.',
  [[
    `<span class="eyebrow">CSP202m · Chapter 7 · Lesson 7.1</span>
<h2>SEO &amp; discoverable content</h2>
<h3>Keywords &amp; search intent</h3>
<p>Start from what people actually search and <em>why</em> — the <strong>intent</strong> behind a query (informational, navigational, transactional). Match the content type to the intent or you rank for nothing.</p>
<h3>On-page basics</h3>
<ul>
<li>Clear <strong>title</strong> &amp; meta description that promise the answer.</li>
<li>Logical <strong>headings</strong> (H1/H2) and descriptive URLs.</li>
<li>Genuinely helpful, in-depth content — Google rewards "people-first" writing, not keyword stuffing.</li>
</ul>
<h3>Topic clusters</h3>
<p>The modern structure: one <strong>pillar page</strong> covering a broad topic, linked to many <strong>cluster</strong> pages on subtopics, all interlinked. It signals depth &amp; authority and helps readers and crawlers navigate.</p>
<pre><code>[ Pillar: "Content strategy" ]
   |- cluster: content audit
   |- cluster: editorial calendar
   |- cluster: content KPIs
</code></pre>
<div class="callout"><span class="badge">Real brand</span> <strong>HubSpot</strong> popularized the pillar-cluster model and ranks for huge topic areas by owning the pillar plus dozens of interlinked clusters.</div>`,
    `<span class="eyebrow">CSP202m · Chương 7 · Bài 7.1</span>
<h2>SEO &amp; nội dung tìm thấy được</h2>
<h3>Từ khoá &amp; ý định tìm kiếm</h3>
<p>Bắt đầu từ thứ người ta thật sự tìm và <em>vì sao</em> — <strong>ý định (intent)</strong> sau một truy vấn (tìm thông tin, tìm đường, giao dịch). Khớp loại nội dung với ý định, nếu không bạn chẳng lên top gì cả.</p>
<h3>On-page cơ bản</h3>
<ul>
<li><strong>Tiêu đề</strong> &amp; meta description rõ ràng, hứa hẹn câu trả lời.</li>
<li><strong>Heading</strong> hợp lý (H1/H2) và URL mô tả được.</li>
<li>Nội dung thật sự hữu ích, chuyên sâu — Google thưởng cách viết "vì người dùng", không nhồi từ khoá.</li>
</ul>
<h3>Topic cluster (cụm chủ đề)</h3>
<p>Cấu trúc hiện đại: một <strong>trang trụ cột (pillar)</strong> bao quát chủ đề rộng, liên kết tới nhiều trang <strong>cluster</strong> về chủ đề con, tất cả liên kết chéo. Nó phát tín hiệu chiều sâu &amp; thẩm quyền, giúp người đọc lẫn bọ tìm kiếm điều hướng.</p>
<pre><code>[ Trụ cột: "Chiến lược nội dung" ]
   |- cluster: kiểm toán nội dung
   |- cluster: lịch biên tập
   |- cluster: KPI nội dung
</code></pre>
<div class="callout"><span class="badge">Thương hiệu thật</span> <strong>HubSpot</strong> phổ biến mô hình pillar-cluster và lên top nhiều mảng chủ đề lớn nhờ sở hữu trang trụ cột cộng hàng chục cluster liên kết chéo.</div>`,
  ]]);

const c7q = quiz('csp202m-quiz-7', 'Quiz 7 — SEO|||Quiz 7 — SEO', [
  { id: 'q1', question: '"Search intent" (ý định tìm kiếm) nghĩa là?', options: ['Số lần một từ khoá xuất hiện trên trang', 'Lý do/mục đích thật sự phía sau một truy vấn', 'Tốc độ tải trang', 'Số backlink'], correctIndex: 1, explanation: 'Intent = người tìm muốn gì (thông tin, tìm đường, giao dịch).' },
  { id: 'q2', question: 'Mô hình topic cluster gồm?', options: ['Nhiều trang rời rạc không liên kết', 'Một trang trụ cột (pillar) liên kết tới nhiều trang cluster chủ đề con', 'Chỉ một trang duy nhất', 'Danh sách quảng cáo trả phí'], correctIndex: 1, explanation: 'Pillar bao quát chủ đề rộng, liên kết chéo tới các cluster chủ đề con.' },
  { id: 'q3', question: 'Google ưu tiên nội dung như thế nào?', options: ['Nhồi càng nhiều từ khoá càng tốt', 'Nội dung hữu ích, "vì người dùng" (people-first)', 'Bài càng ngắn càng tốt', 'Chỉ dựa vào meta keyword'], correctIndex: 1, explanation: 'Google thưởng nội dung hữu ích cho người, không phải nhồi từ khoá.' },
]);

const c8 = doc('csp202m-8-1-measure', '8.1 — Measurement & optimization|||8.1 — Đo lường & tối ưu',
  'KPI theo mục tiêu, engagement vs conversion, content ROI, và vòng lặp đo → học → cải tiến.',
  [[
    `<span class="eyebrow">CSP202m · Chapter 8 · Lesson 8.1</span>
<h2>Measurement &amp; optimization</h2>
<h3>KPIs follow the goal</h3>
<p>Pick metrics that match the objective — not vanity numbers. Awareness → reach/impressions; engagement → time on page, shares, comments; conversion → sign-ups, leads, sales. A metric that doesn't tie to a goal is a distraction.</p>
<h3>Engagement vs conversion</h3>
<ul>
<li><strong>Engagement</strong> — is anyone paying attention? (views, dwell time, shares)</li>
<li><strong>Conversion</strong> — did it drive the action that matters? (subscribe, buy, request demo)</li>
</ul>
<h3>Content ROI</h3>
<p>Return on investment weighs the <em>value created</em> (leads, revenue, saved support cost) against the <em>cost to produce</em>. It's the question executives actually ask — and the reason strategy must be measurable.</p>
<h3>The improvement loop</h3>
<pre><code>Set goal -> Publish -> Measure -> Learn -> Optimize -> repeat
</code></pre>
<p>Content strategy is never "done": you double down on what works, fix or kill what doesn't, and feed learnings back into the calendar.</p>
<div class="callout"><span class="badge">Real brand</span> <strong>Canva</strong>'s content team runs this loop continuously — testing topics and formats, then scaling the pieces that convert into product sign-ups.</div>`,
    `<span class="eyebrow">CSP202m · Chương 8 · Bài 8.1</span>
<h2>Đo lường &amp; tối ưu</h2>
<h3>KPI bám theo mục tiêu</h3>
<p>Chọn chỉ số khớp mục tiêu — không phải con số phù phiếm. Nhận biết → reach/impression; tương tác → thời gian trên trang, chia sẻ, bình luận; chuyển đổi → đăng ký, lead, doanh số. Một chỉ số không gắn mục tiêu là thứ gây nhiễu.</p>
<h3>Engagement vs conversion</h3>
<ul>
<li><strong>Tương tác (engagement)</strong> — có ai chú ý không? (lượt xem, thời gian ở lại, chia sẻ)</li>
<li><strong>Chuyển đổi (conversion)</strong> — nó có tạo ra hành động quan trọng không? (đăng ký, mua, yêu cầu demo)</li>
</ul>
<h3>Content ROI (lợi tức nội dung)</h3>
<p>ROI cân <em>giá trị tạo ra</em> (lead, doanh thu, chi phí hỗ trợ tiết kiệm được) với <em>chi phí sản xuất</em>. Đây là câu hỏi lãnh đạo thật sự đặt ra — và là lý do chiến lược phải đo được.</p>
<h3>Vòng lặp cải tiến</h3>
<pre><code>Đặt mục tiêu -> Xuất bản -> Đo -> Học -> Tối ưu -> lặp lại
</code></pre>
<p>Chiến lược nội dung không bao giờ "xong": bạn dồn lực vào cái chạy tốt, sửa hoặc bỏ cái không, và đưa bài học trở lại lịch biên tập.</p>
<div class="callout"><span class="badge">Thương hiệu thật</span> Đội nội dung của <strong>Canva</strong> chạy vòng lặp này liên tục — thử chủ đề &amp; định dạng, rồi nhân rộng mẩu nào chuyển đổi thành lượt đăng ký sản phẩm.</div>`,
  ]]);

const c8q = quiz('csp202m-quiz-8', 'Quiz 8 — Measurement|||Quiz 8 — Đo lường', [
  { id: 'q1', question: 'Nguyên tắc chọn KPI đúng là?', options: ['Chọn con số lớn nhất cho đẹp', 'Chọn chỉ số khớp với mục tiêu (awareness/engagement/conversion)', 'Luôn dùng lượt like', 'Không cần đo gì cả'], correctIndex: 1, explanation: 'KPI bám mục tiêu; chỉ số không gắn mục tiêu là con số phù phiếm.' },
  { id: 'q2', question: 'Content ROI cân đối giữa?', options: ['Số bài và số ảnh', 'Giá trị tạo ra so với chi phí sản xuất', 'Số kênh và số người', 'Độ dài bài và số từ khoá'], correctIndex: 1, explanation: 'ROI = giá trị (lead/doanh thu/tiết kiệm) so với chi phí làm ra nội dung.' },
  { id: 'q3', question: 'Vòng lặp cải tiến nội dung đúng thứ tự là?', options: ['Xuất bản → đặt mục tiêu → bỏ qua đo', 'Đặt mục tiêu → xuất bản → đo → học → tối ưu → lặp', 'Đo → xoá → nghỉ', 'Tối ưu → đặt mục tiêu → không đo'], correctIndex: 1, explanation: 'Chiến lược không bao giờ "xong": đo → học → tối ưu và lặp lại.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'CSP202m',
    slug: 'csp202m-introduction-of-content-strategy',
    title: 'Introduction of Content Strategy',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CSP202m.webp',
    shortDescription: 'What content strategy is & how to run one — strategy vs marketing (COPE), audience & journey, content audit, pillars & brand voice, channels, editorial calendar, SEO & topic clusters, content ROI. Bilingual, real-brand examples & quizzes.|||Chiến lược nội dung là gì & làm thế nào — chiến lược vs marketing (COPE), công chúng & hành trình, kiểm toán, trụ cột & giọng, kênh, lịch biên tập, SEO & topic cluster, ROI nội dung. Song ngữ, ví dụ thương hiệu thật & quiz.',
    description: 'Môn <strong>CSP202m — Introduction of Content Strategy</strong> (Nhập môn Chiến lược nội dung, khối Công nghệ Truyền thông, kỳ 3) giúp hiểu <strong>tổ chức lập kế hoạch, tạo, phân phối và quản trị nội dung thế nào</strong> để phục vụ mục tiêu thật. Từ <strong>chiến lược vs marketing</strong> (COPE) → <strong>nghiên cứu công chúng</strong> (persona, JTBD, hành trình) → <strong>kiểm toán &amp; gap analysis</strong> → <strong>trụ cột &amp; brand voice</strong> → <strong>định dạng &amp; kênh</strong> → <strong>lịch biên tập &amp; governance</strong> → <strong>SEO &amp; topic cluster</strong> → <strong>đo lường &amp; content ROI</strong>. Bám sách chuẩn (Halvorson, Handley, Pulizzi, Lieb), song ngữ, ví dụ thương hiệu thật, quiz mỗi chương.',
    whatYouLearn: 'Chiến lược nội dung vs content marketing & COPE; persona, jobs-to-be-done, insight, hành trình khách hàng; content inventory/audit, ROT, gap analysis; content pillars, messaging framework, voice vs tone; định dạng (blog/video/social/email/podcast), owned/earned/paid, repurposing; editorial calendar, workflow, governance & vòng đời nội dung; keyword & search intent, on-page SEO, topic cluster; KPI theo mục tiêu, engagement vs conversion, content ROI, vòng lặp tối ưu.',
    requirements: 'Không cần kiến thức nền chuyên sâu. Nên có tài khoản Google (Trends, Analytics) và một công cụ lịch biên tập (Trello/Notion) để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, sách chuẩn, tài liệu miễn phí (CMI, HubSpot Academy), YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Chiến lược nội dung là gì, định nghĩa Halvorson, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Chiến lược nội dung là gì|||Chapter 1 — What it is', description: 'Strategy vs marketing, vì sao cần, COPE.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nghiên cứu công chúng|||Chapter 2 — Audience research', description: 'Persona, JTBD, insight, hành trình.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Kiểm toán & hệ sinh thái|||Chapter 3 — Audit & ecosystem', description: 'Inventory, audit, ROT, gap analysis.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Trụ cột & thông điệp|||Chapter 4 — Pillars & voice', description: 'Content pillars, messaging, voice/tone.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Định dạng & kênh|||Chapter 5 — Formats & channels', description: 'Định dạng, owned/earned/paid, repurposing.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Lịch biên tập & quản trị|||Chapter 6 — Calendar & governance', description: 'Editorial calendar, workflow, governance.', lessons: [c6, c6q] },
    { title: 'Chương 7 — SEO & tìm thấy được|||Chapter 7 — SEO & discoverability', description: 'Keyword, intent, on-page, topic cluster.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường & tối ưu|||Chapter 8 — Measurement', description: 'KPI, engagement/conversion, ROI, vòng lặp.', lessons: [c8, c8q] },
  ],
};
