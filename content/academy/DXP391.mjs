/**
 * DXP391 — Digital Product Development (Phát triển sản phẩm số). Ngành Chuyển
 * đổi số, kỳ 5, FPTU. Giáo trình: Inspired (Cagan), Lean Product Playbook
 * (Olsen), Continuous Discovery Habits (Torres), Hooked (Eyal), GV Design
 * Sprint. 8 chương song ngữ + quiz. ⚠️ KHÔNG backtick/${; "&" HTML → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dxp391-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách kinh điển (Inspired, Lean Product Playbook, Continuous Discovery Habits, Hooked), công cụ (Figma, GA4), YouTube, lộ trình.',
  [[
    `<span class="eyebrow">DXP391 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Digital Product Development</strong> — from discovering what to build, to shipping an MVP, to growing it — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are the canonical books and free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for DXP391 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Core reference books</h3>
<ul>
<li><a href="https://www.svpg.com/inspired-how-to-create-products-customers-love/" target="_blank" rel="noopener"><em>Inspired</em> — Marty Cagan</a> (how great product teams work)</li>
<li><a href="https://leanproductplaybook.com/" target="_blank" rel="noopener"><em>The Lean Product Playbook</em> — Dan Olsen</a> (product-market fit, step by step)</li>
<li><a href="https://www.producttalk.org/continuous-discovery-habits/" target="_blank" rel="noopener"><em>Continuous Discovery Habits</em> — Teresa Torres</a> (opportunity solution trees)</li>
<li><a href="https://www.nirandfar.com/hooked/" target="_blank" rel="noopener"><em>Hooked</em> — Nir Eyal</a> (habit-forming products)</li>
</ul>
<h3>🌐 Official / free resources</h3>
<ul>
<li><a href="https://www.gv.com/sprint/" target="_blank" rel="noopener">Google Ventures Design Sprint</a> — the 5-day sprint method</li>
<li><a href="https://www.svpg.com/articles/" target="_blank" rel="noopener">SVPG articles (Marty Cagan)</a> — free product essays</li>
<li><a href="https://www.producttalk.org/blog/" target="_blank" rel="noopener">Product Talk blog</a> — discovery techniques</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@productschool" target="_blank" rel="noopener">Product School</a> — PM interviews &amp; talks</li>
<li><a href="https://www.youtube.com/@GV" target="_blank" rel="noopener">GV (Google Ventures)</a> — design sprint &amp; product</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — design &amp; prototyping</li>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics 4</a> — product analytics</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — journey maps &amp; workshops</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what a digital product is, the product lifecycle, and roles on a product team.</li>
<li><strong>Discover</strong> — talk to users, map opportunities, find product-market fit and a sharp value proposition.</li>
<li><strong>Build</strong> — prototype in Figma, scope an MVP, prioritise with RICE/MoSCoW, work Agile with engineers.</li>
<li><strong>Grow</strong> — measure with AARRR, run A/B tests, plan go-to-market, and iterate continuously.</li>
</ol></div>`,
    `<span class="eyebrow">DXP391 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Phát triển sản phẩm số</strong> — từ khám phá nên xây gì, đến ra mắt MVP, đến tăng trưởng — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là các sách kinh điển và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DXP391 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><a href="https://www.svpg.com/inspired-how-to-create-products-customers-love/" target="_blank" rel="noopener"><em>Inspired</em> — Marty Cagan</a> (đội sản phẩm giỏi làm việc thế nào)</li>
<li><a href="https://leanproductplaybook.com/" target="_blank" rel="noopener"><em>The Lean Product Playbook</em> — Dan Olsen</a> (tìm product-market fit từng bước)</li>
<li><a href="https://www.producttalk.org/continuous-discovery-habits/" target="_blank" rel="noopener"><em>Continuous Discovery Habits</em> — Teresa Torres</a> (cây cơ hội - giải pháp)</li>
<li><a href="https://www.nirandfar.com/hooked/" target="_blank" rel="noopener"><em>Hooked</em> — Nir Eyal</a> (sản phẩm tạo thói quen)</li>
</ul>
<h3>🌐 Nguồn chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.gv.com/sprint/" target="_blank" rel="noopener">Google Ventures Design Sprint</a> — phương pháp sprint 5 ngày</li>
<li><a href="https://www.svpg.com/articles/" target="_blank" rel="noopener">Bài viết SVPG (Marty Cagan)</a> — tiểu luận sản phẩm miễn phí</li>
<li><a href="https://www.producttalk.org/blog/" target="_blank" rel="noopener">Blog Product Talk</a> — kỹ thuật khám phá</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@productschool" target="_blank" rel="noopener">Product School</a> — phỏng vấn &amp; talk về PM</li>
<li><a href="https://www.youtube.com/@GV" target="_blank" rel="noopener">GV (Google Ventures)</a> — design sprint &amp; sản phẩm</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — thiết kế &amp; prototyping</li>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics 4</a> — phân tích sản phẩm</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — bản đồ hành trình &amp; workshop</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — sản phẩm số là gì, vòng đời sản phẩm, vai trò trong đội sản phẩm.</li>
<li><strong>Khám phá</strong> — trò chuyện với người dùng, lập bản đồ cơ hội, tìm product-market fit và tuyên bố giá trị sắc bén.</li>
<li><strong>Xây dựng</strong> — prototype trong Figma, phạm vi MVP, ưu tiên bằng RICE/MoSCoW, làm Agile với kỹ sư.</li>
<li><strong>Tăng trưởng</strong> — đo bằng AARRR, chạy A/B test, lập kế hoạch go-to-market, cải tiến liên tục.</li>
</ol></div>`,
  ]]);

const intro = doc('dxp391-0-1-overview', 'Course overview: Digital Product Development|||Tổng quan: Phát triển sản phẩm số',
  'Sản phẩm số là gì; vì sao "xây đúng thứ" quan trọng hơn "xây đúng cách"; lộ trình: khám phá → product-market fit → thiết kế & MVP → Agile → đo lường → tăng trưởng.',
  [[
    `<span class="eyebrow">DXP391 · Lesson 0.1 · Overview</span>
<h2>Digital Product Development</h2>
<p class="lead">This course teaches you to <strong>build digital products people actually want</strong> — apps, web platforms, SaaS. The hard part is rarely writing code; it's deciding <strong>what</strong> to build and <strong>for whom</strong>. As Marty Cagan puts it: most product ideas fail, so great teams <em>discover</em> before they <em>deliver</em>.</p>
<h3>Two questions every product must answer</h3>
<ul>
<li><strong>Value</strong> — will people choose to use or buy it?</li>
<li><strong>Viability</strong> — does it work for the business (cost, growth, sustainability)?</li>
</ul>
<p>Plus <strong>usability</strong> (can they figure it out?) and <strong>feasibility</strong> (can we build it?). These four risks — value, usability, feasibility, viability — are the lens for every decision.</p>
<h3>Roadmap</h3>
<p>Product &amp; lifecycle → user research &amp; discovery → product-market fit &amp; value proposition → UX/UI &amp; prototyping → MVP, roadmap &amp; prioritisation → Agile with engineers → metrics, analytics &amp; A/B testing → go-to-market &amp; growth. Bilingual, with canvases, templates and quizzes.</p>`,
    `<span class="eyebrow">DXP391 · Bài 0.1 · Tổng quan</span>
<h2>Phát triển sản phẩm số</h2>
<p class="lead">Môn này dạy bạn <strong>xây sản phẩm số mà người ta thực sự muốn</strong> — app, nền tảng web, SaaS. Phần khó hiếm khi là viết mã; nó là quyết định <strong>xây gì</strong> và <strong>cho ai</strong>. Như Marty Cagan nói: hầu hết ý tưởng sản phẩm thất bại, nên đội giỏi <em>khám phá</em> trước khi <em>giao hàng</em>.</p>
<h3>Hai câu hỏi mọi sản phẩm phải trả lời</h3>
<ul>
<li><strong>Giá trị (value)</strong> — người ta có chọn dùng hay mua không?</li>
<li><strong>Khả thi kinh doanh (viability)</strong> — nó có ổn cho doanh nghiệp không (chi phí, tăng trưởng, bền vững)?</li>
</ul>
<p>Cộng thêm <strong>tính dùng được (usability)</strong> (họ có hiểu cách dùng?) và <strong>khả thi kỹ thuật (feasibility)</strong> (ta xây được không?). Bốn rủi ro này — giá trị, dùng được, kỹ thuật, kinh doanh — là lăng kính cho mọi quyết định.</p>
<h3>Lộ trình</h3>
<p>Sản phẩm &amp; vòng đời → nghiên cứu người dùng &amp; khám phá → product-market fit &amp; tuyên bố giá trị → UX/UI &amp; prototyping → MVP, roadmap &amp; ưu tiên → Agile với kỹ sư → metrics, analytics &amp; A/B test → go-to-market &amp; tăng trưởng. Song ngữ, có canvas, mẫu và quiz.</p>`,
  ]]);

const c1 = doc('dxp391-1-1-product-lifecycle', '1.1 — What is a digital product & the development lifecycle|||1.1 — Sản phẩm số là gì & vòng đời phát triển',
  'Định nghĩa sản phẩm số; khác biệt với dự án/dịch vụ; vòng đời sản phẩm (discovery→delivery→growth→sunset); vai trò đội sản phẩm (PM, designer, engineer).',
  [[
    `<span class="eyebrow">DXP391 · Chapter 1 · Lesson 1.1</span>
<h2>What is a digital product &amp; the development lifecycle</h2>
<h3>Product vs project</h3>
<p>A <strong>digital product</strong> (an app, website, or SaaS) is <em>ongoing</em> — it lives, evolves and is measured by the outcomes it creates for users and the business. A <strong>project</strong> ends when it ships; a product is never "done". This is the core mindset shift Marty Cagan calls <strong>empowered product teams</strong>: teams solve problems, they don't just build a feature list.</p>
<h3>The product lifecycle</h3>
<pre><code>Discovery  -> figure out WHAT is worth building (reduce risk cheaply)
Delivery   -> design &amp; build it, ship to real users
Growth     -> acquire, activate, retain, expand
Maturity   -> optimise, defend, extract value
Sunset     -> retire or replace when value fades
</code></pre>
<h3>The product team</h3>
<ul>
<li><strong>Product Manager (PM)</strong> — owns the "why" and "what"; responsible for value &amp; viability.</li>
<li><strong>Product Designer</strong> — owns usability &amp; the user experience.</li>
<li><strong>Engineers</strong> — own feasibility &amp; how it's built.</li>
</ul>
<div class="callout"><span class="badge">Outcome over output</span> Shipping features is <em>output</em>. Moving a real metric — retention, activation, revenue — is <em>outcome</em>. Great teams are measured on outcomes.</div>`,
    `<span class="eyebrow">DXP391 · Chương 1 · Bài 1.1</span>
<h2>Sản phẩm số là gì &amp; vòng đời phát triển</h2>
<h3>Sản phẩm khác dự án</h3>
<p>Một <strong>sản phẩm số</strong> (app, website, hay SaaS) là thứ <em>liên tục</em> — nó sống, tiến hoá và được đo bằng kết quả nó tạo ra cho người dùng và doanh nghiệp. Một <strong>dự án</strong> kết thúc khi ra mắt; sản phẩm thì không bao giờ "xong". Đây là chuyển dịch tư duy cốt lõi mà Marty Cagan gọi là <strong>đội sản phẩm được trao quyền</strong>: đội giải quyết vấn đề, không chỉ xây một danh sách tính năng.</p>
<h3>Vòng đời sản phẩm</h3>
<pre><code>Khám phá  -> tìm ra CÁI GÌ đáng xây (giảm rủi ro với chi phí rẻ)
Giao hàng -> thiết kế &amp; xây, ra mắt cho người dùng thật
Tăng trưởng -> thu hút, kích hoạt, giữ chân, mở rộng
Trưởng thành -> tối ưu, phòng thủ, khai thác giá trị
Kết thúc  -> ngừng hoặc thay thế khi giá trị phai
</code></pre>
<h3>Đội sản phẩm</h3>
<ul>
<li><strong>Product Manager (PM)</strong> — sở hữu "tại sao" và "cái gì"; chịu trách nhiệm giá trị &amp; khả thi kinh doanh.</li>
<li><strong>Product Designer</strong> — sở hữu tính dùng được &amp; trải nghiệm người dùng.</li>
<li><strong>Kỹ sư (Engineers)</strong> — sở hữu khả thi kỹ thuật &amp; cách xây.</li>
</ul>
<div class="callout"><span class="badge">Kết quả hơn sản lượng</span> Ra mắt tính năng là <em>sản lượng (output)</em>. Dịch chuyển một chỉ số thật — giữ chân, kích hoạt, doanh thu — là <em>kết quả (outcome)</em>. Đội giỏi được đo bằng kết quả.</div>`,
  ]]);

const c1q = quiz('dxp391-quiz-1', 'Quiz 1 — Product & lifecycle|||Quiz 1 — Sản phẩm & vòng đời', [
  { id: 'q1', question: 'Điểm khác cốt lõi giữa "sản phẩm" và "dự án" là?', options: ['Sản phẩm rẻ hơn dự án', 'Dự án kết thúc khi ra mắt, sản phẩm liên tục tiến hoá', 'Dự án cần code, sản phẩm thì không', 'Không có khác biệt'], correctIndex: 1, explanation: 'Dự án có điểm kết thúc; sản phẩm sống và tiến hoá liên tục, đo bằng kết quả.' },
  { id: 'q2', question: 'Trong đội sản phẩm, ai chịu trách nhiệm chính về "tính dùng được" (usability)?', options: ['Product Manager', 'Product Designer', 'Engineer', 'CEO'], correctIndex: 1, explanation: 'Designer sở hữu trải nghiệm và tính dùng được; PM lo giá trị/khả thi KD, engineer lo khả thi kỹ thuật.' },
  { id: 'q3', question: 'Đâu là "outcome" (kết quả) chứ không phải "output" (sản lượng)?', options: ['Ra mắt 5 tính năng mới', 'Viết 10.000 dòng code', 'Tăng tỉ lệ giữ chân người dùng', 'Tổ chức 3 cuộc họp'], correctIndex: 2, explanation: 'Outcome là dịch chuyển chỉ số thật (giữ chân); output là thứ ta làm ra (tính năng, code).' },
]);

const c2 = doc('dxp391-2-1-discovery', '2.1 — User research & product discovery|||2.1 — Nghiên cứu người dùng & product discovery',
  'Vì sao khám phá trước khi xây; phỏng vấn người dùng (Torres); opportunity solution tree; jobs-to-be-done; giả định vs sự thật; tránh bẫy "xây theo ý sếp".',
  [[
    `<span class="eyebrow">DXP391 · Chapter 2 · Lesson 2.1</span>
<h2>User research &amp; product discovery</h2>
<h3>Discover before you deliver</h3>
<p>Most ideas don't work: users don't want it, or won't pay, or can't figure it out. <strong>Discovery</strong> is the cheap way to find out — before you spend months building. Teresa Torres calls the ideal a habit: <strong>continuous discovery</strong>, at least weekly touchpoints with customers.</p>
<h3>Talk to users the right way</h3>
<ul>
<li>Ask about <strong>past behaviour</strong>, not hypotheticals ("Tell me about the last time you..." beats "Would you use...").</li>
<li>Look for the <strong>job to be done</strong> — the progress the user is trying to make, not the feature they request.</li>
<li>Separate a <strong>fact</strong> (what happened) from an <strong>assumption</strong> (what we hope is true).</li>
</ul>
<h3>Opportunity Solution Tree (Torres)</h3>
<pre><code>Outcome (the metric to move)
  |
  +- Opportunity (a user need / pain / desire)
  |     +- Solution A   (idea to address it)
  |     +- Solution B
  |           +- Experiment (cheap test of the riskiest assumption)
</code></pre>
<div class="callout"><span class="badge">Beware the HiPPO</span> The "Highest Paid Person's Opinion" is not evidence. Discovery replaces opinion with what real users actually do.</div>`,
    `<span class="eyebrow">DXP391 · Chương 2 · Bài 2.1</span>
<h2>Nghiên cứu người dùng &amp; product discovery</h2>
<h3>Khám phá trước khi giao hàng</h3>
<p>Hầu hết ý tưởng không chạy: người dùng không muốn, không trả tiền, hoặc không hiểu cách dùng. <strong>Khám phá (discovery)</strong> là cách rẻ để phát hiện điều đó — trước khi bỏ nhiều tháng để xây. Teresa Torres đề cao một thói quen: <strong>khám phá liên tục</strong>, tối thiểu tiếp xúc khách hàng hằng tuần.</p>
<h3>Trò chuyện với người dùng đúng cách</h3>
<ul>
<li>Hỏi về <strong>hành vi trong quá khứ</strong>, đừng hỏi giả định ("Kể lần gần nhất bạn..." tốt hơn "Bạn có dùng... không?").</li>
<li>Tìm <strong>công việc cần hoàn thành (job to be done)</strong> — tiến bộ người dùng muốn đạt, không phải tính năng họ yêu cầu.</li>
<li>Tách <strong>sự thật</strong> (điều đã xảy ra) khỏi <strong>giả định</strong> (điều ta mong là đúng).</li>
</ul>
<h3>Cây cơ hội - giải pháp (Torres)</h3>
<pre><code>Kết quả (chỉ số cần dịch chuyển)
  |
  +- Cơ hội (một nhu cầu / nỗi đau / mong muốn của người dùng)
  |     +- Giải pháp A   (ý tưởng xử lý cơ hội đó)
  |     +- Giải pháp B
  |           +- Thí nghiệm (test rẻ cho giả định rủi ro nhất)
</code></pre>
<div class="callout"><span class="badge">Coi chừng HiPPO</span> "Ý kiến của người lương cao nhất" không phải bằng chứng. Khám phá thay ý kiến bằng điều người dùng thật sự làm.</div>`,
  ]]);

const c2q = quiz('dxp391-quiz-2', 'Quiz 2 — Discovery|||Quiz 2 — Khám phá', [
  { id: 'q1', question: 'Cách phỏng vấn người dùng tốt nhất để lấy dữ liệu đáng tin?', options: ['Hỏi "Bạn có dùng tính năng này không?"', 'Hỏi về hành vi trong quá khứ, ví dụ cụ thể gần nhất', 'Hỏi họ muốn ta xây gì', 'Chỉ hỏi người quen'], correctIndex: 1, explanation: 'Hành vi quá khứ đáng tin hơn giả định tương lai; "hãy kể lần gần nhất bạn..." tránh câu trả lời lịch sự sáo rỗng.' },
  { id: 'q2', question: '"Opportunity Solution Tree" của Teresa Torres nối những gì?', options: ['Doanh thu với chi phí', 'Kết quả → cơ hội → giải pháp → thí nghiệm', 'Sprint với backlog', 'Diode với transistor'], correctIndex: 1, explanation: 'Cây gắn một outcome với các cơ hội (nhu cầu người dùng), rồi giải pháp và thí nghiệm kiểm chứng.' },
  { id: 'q3', question: '"HiPPO" trong phát triển sản phẩm ám chỉ điều cần tránh nào?', options: ['Một loại thú', 'Ra quyết định theo ý người lương cao nhất thay vì bằng chứng', 'Một công cụ phân tích', 'Một khung ưu tiên'], correctIndex: 1, explanation: 'HiPPO = Highest Paid Person Opinion; discovery thay ý kiến chủ quan bằng dữ liệu người dùng thật.' },
]);

const c3 = doc('dxp391-3-1-pmf', '3.1 — Product-market fit & value proposition|||3.1 — Product-market fit & tuyên bố giá trị',
  'Product-market fit là gì (Olsen); tháp Lean Product; value proposition (pains/gains); phân khúc khách hàng mục tiêu; dấu hiệu đạt/chưa đạt PMF.',
  [[
    `<span class="eyebrow">DXP391 · Chapter 3 · Lesson 3.1</span>
<h2>Product-market fit &amp; value proposition</h2>
<h3>What is product-market fit (PMF)?</h3>
<p><strong>PMF</strong> means you've built something a well-defined market genuinely wants — enough that they use it, stay, and tell others. Dan Olsen frames it as a stack: get the lower layers right before the upper ones.</p>
<h3>The Lean Product Process (Olsen)</h3>
<pre><code>6. UX               (top - what users touch)
5. Feature set
4. Value proposition
--------------------  (the fit line)
3. Underserved needs
2. Target customer
1. (Market)          (bottom - foundation)
</code></pre>
<p>Fit happens when your <strong>value proposition + features + UX</strong> (the product) truly serves the <strong>target customer's underserved needs</strong> (the market).</p>
<h3>Value proposition</h3>
<ul>
<li><strong>Pains</strong> the product removes (frustrations, risks, costs).</li>
<li><strong>Gains</strong> it creates (outcomes the customer wants).</li>
<li>Stated sharply: <em>for [target] who [need], our product provides [benefit], unlike [alternative].</em></li>
</ul>
<div class="callout"><span class="badge">Signals of PMF</span> Strong retention curves that flatten (not decay to zero), organic word-of-mouth, and users who'd be "very disappointed" without it (Sean Ellis test, &gt;40%).</div>`,
    `<span class="eyebrow">DXP391 · Chương 3 · Bài 3.1</span>
<h2>Product-market fit &amp; tuyên bố giá trị</h2>
<h3>Product-market fit (PMF) là gì?</h3>
<p><strong>PMF</strong> nghĩa là bạn đã xây thứ mà một thị trường xác định rõ thực sự muốn — đủ để họ dùng, ở lại, và giới thiệu cho người khác. Dan Olsen mô tả nó như một tháp: làm đúng tầng dưới trước tầng trên.</p>
<h3>Quy trình Lean Product (Olsen)</h3>
<pre><code>6. UX                (đỉnh - thứ người dùng chạm vào)
5. Bộ tính năng
4. Tuyên bố giá trị
---------------------  (đường "fit")
3. Nhu cầu chưa được đáp ứng
2. Khách hàng mục tiêu
1. (Thị trường)       (đáy - nền móng)
</code></pre>
<p>Fit xảy ra khi <strong>tuyên bố giá trị + tính năng + UX</strong> (sản phẩm) thực sự phục vụ <strong>nhu cầu chưa được đáp ứng của khách hàng mục tiêu</strong> (thị trường).</p>
<h3>Tuyên bố giá trị</h3>
<ul>
<li><strong>Nỗi đau (pains)</strong> sản phẩm gỡ bỏ (bực bội, rủi ro, chi phí).</li>
<li><strong>Lợi ích (gains)</strong> nó tạo ra (kết quả khách hàng muốn).</li>
<li>Nói sắc: <em>cho [đối tượng] đang cần [nhu cầu], sản phẩm của chúng tôi mang lại [lợi ích], khác với [giải pháp thay thế].</em></li>
</ul>
<div class="callout"><span class="badge">Dấu hiệu PMF</span> Đường giữ chân đi ngang (không rơi về 0), truyền miệng tự nhiên, và người dùng "rất thất vọng" nếu thiếu sản phẩm (test Sean Ellis, &gt;40%).</div>`,
  ]]);

const c3q = quiz('dxp391-quiz-3', 'Quiz 3 — PMF|||Quiz 3 — Product-market fit', [
  { id: 'q1', question: 'Trong tháp Lean Product (Olsen), "đường fit" ngăn cách gì?', options: ['Code và thiết kế', 'Thị trường (khách hàng + nhu cầu) bên dưới với sản phẩm (giá trị + tính năng + UX) bên trên', 'Marketing và bán hàng', 'MVP và roadmap'], correctIndex: 1, explanation: 'Fit là khi phần sản phẩm (giá trị/tính năng/UX) khớp phần thị trường (khách hàng mục tiêu + nhu cầu chưa đáp ứng).' },
  { id: 'q2', question: 'Một tuyên bố giá trị tốt nên nêu rõ điều gì?', options: ['Ngôn ngữ lập trình dùng', 'Nỗi đau được gỡ và lợi ích tạo ra cho đối tượng cụ thể', 'Số dòng code', 'Tên đội kỹ thuật'], correctIndex: 1, explanation: 'Value proposition tập trung vào pains gỡ bỏ và gains mang lại cho một đối tượng mục tiêu, so với giải pháp thay thế.' },
  { id: 'q3', question: 'Theo "test Sean Ellis", dấu hiệu tốt của PMF là bao nhiêu người dùng sẽ "rất thất vọng" nếu mất sản phẩm?', options: ['Trên 10%', 'Trên 40%', 'Đúng 100%', 'Không quan trọng con số'], correctIndex: 1, explanation: 'Ngưỡng tham chiếu phổ biến là >40% người dùng "rất thất vọng" — tín hiệu mạnh của product-market fit.' },
]);

const c4 = doc('dxp391-4-1-ux-prototyping', '4.1 — UX/UI & prototyping (Figma)|||4.1 — UX/UI & prototyping (Figma)',
  'Khác biệt UX vs UI; luồng người dùng (user flow); wireframe → mockup → prototype; nguyên tắc thiết kế (nhất quán, phản hồi, dễ nhận biết); prototyping và test trong Figma.',
  [[
    `<span class="eyebrow">DXP391 · Chapter 4 · Lesson 4.1</span>
<h2>UX/UI &amp; prototyping (Figma)</h2>
<h3>UX vs UI</h3>
<ul>
<li><strong>UX (experience)</strong> — the whole journey: can the user accomplish their goal easily? Flows, information architecture, friction.</li>
<li><strong>UI (interface)</strong> — the surface: layout, colour, type, components, states.</li>
</ul>
<h3>Fidelity ladder</h3>
<pre><code>User flow   -> the steps to complete a task (boxes &amp; arrows)
Wireframe   -> low-fidelity layout, no colour/branding
Mockup      -> high-fidelity visual design (real UI)
Prototype   -> clickable, simulates the real product for testing
</code></pre>
<h3>Design principles that matter</h3>
<ul>
<li><strong>Consistency</strong> — same pattern, same behaviour everywhere.</li>
<li><strong>Feedback</strong> — every action gets a visible response.</li>
<li><strong>Recognition over recall</strong> — show options, don't make users remember them.</li>
<li><strong>Error prevention</strong> — make the wrong action hard, the right action easy.</li>
</ul>
<div class="callout"><span class="badge">Prototype to learn, not to polish</span> In <strong>Figma</strong>, build a clickable prototype and put it in front of 5 users. Watch where they hesitate — that's your real backlog, found before a line of code is written.</div>`,
    `<span class="eyebrow">DXP391 · Chương 4 · Bài 4.1</span>
<h2>UX/UI &amp; prototyping (Figma)</h2>
<h3>UX khác UI</h3>
<ul>
<li><strong>UX (trải nghiệm)</strong> — cả hành trình: người dùng đạt mục tiêu dễ không? Luồng, kiến trúc thông tin, ma sát.</li>
<li><strong>UI (giao diện)</strong> — bề mặt: bố cục, màu, chữ, component, trạng thái.</li>
</ul>
<h3>Thang độ chi tiết</h3>
<pre><code>User flow  -> các bước hoàn thành một tác vụ (hộp &amp; mũi tên)
Wireframe  -> bố cục sơ khai, không màu/thương hiệu
Mockup     -> thiết kế hình ảnh chi tiết (UI thật)
Prototype  -> bấm được, mô phỏng sản phẩm thật để test
</code></pre>
<h3>Nguyên tắc thiết kế quan trọng</h3>
<ul>
<li><strong>Nhất quán</strong> — cùng một mẫu, cùng một hành vi ở khắp nơi.</li>
<li><strong>Phản hồi</strong> — mỗi hành động có phản hồi thấy được.</li>
<li><strong>Nhận biết hơn ghi nhớ</strong> — bày lựa chọn ra, đừng bắt người dùng nhớ.</li>
<li><strong>Ngăn lỗi</strong> — làm hành động sai khó xảy ra, hành động đúng dễ làm.</li>
</ul>
<div class="callout"><span class="badge">Prototype để học, không phải để đẹp</span> Trong <strong>Figma</strong>, dựng prototype bấm được và đặt trước 5 người dùng. Quan sát chỗ họ do dự — đó là backlog thật, tìm ra trước khi viết dòng code nào.</div>`,
  ]]);

const c4q = quiz('dxp391-quiz-4', 'Quiz 4 — UX/UI|||Quiz 4 — UX/UI & prototyping', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa UX và UI là?', options: ['UX là màu sắc, UI là hành trình', 'UX là toàn bộ trải nghiệm/hành trình, UI là bề mặt giao diện', 'UX chỉ dành cho web, UI cho app', 'Không có khác biệt'], correctIndex: 1, explanation: 'UX = trải nghiệm/luồng tổng thể; UI = lớp giao diện cụ thể (bố cục, màu, component).' },
  { id: 'q2', question: 'Sắp đúng thứ tự tăng dần độ chi tiết (fidelity)?', options: ['Prototype → mockup → wireframe', 'Wireframe → mockup → prototype', 'Mockup → wireframe → user flow', 'Prototype → wireframe → mockup'], correctIndex: 1, explanation: 'Từ sơ khai đến chi tiết: user flow → wireframe → mockup → prototype (bấm được).' },
  { id: 'q3', question: 'Nguyên tắc "recognition over recall" nghĩa là?', options: ['Bắt người dùng ghi nhớ phím tắt', 'Bày sẵn lựa chọn để người dùng nhận ra thay vì phải nhớ', 'Ẩn mọi tuỳ chọn cho gọn', 'Ưu tiên tốc độ hơn rõ ràng'], correctIndex: 1, explanation: 'Hiển thị lựa chọn rõ ràng giảm tải trí nhớ; người dùng nhận ra dễ hơn phải hồi tưởng.' },
]);

const c5 = doc('dxp391-5-1-mvp-roadmap', '5.1 — MVP, roadmap & feature prioritisation|||5.1 — MVP, roadmap & ưu tiên tính năng',
  'MVP là gì (học tối đa, công sức tối thiểu); hiểu lầm về MVP; roadmap theo kết quả; ưu tiên bằng RICE và MoSCoW; nói "không" là kỹ năng cốt lõi của PM.',
  [[
    `<span class="eyebrow">DXP391 · Chapter 5 · Lesson 5.1</span>
<h2>MVP, roadmap &amp; feature prioritisation</h2>
<h3>Minimum Viable Product</h3>
<p>An <strong>MVP</strong> is the smallest thing that lets you <em>learn</em> whether the idea works — with real users, for real. It is <em>not</em> a buggy half-product; it's the leanest <strong>valuable</strong> slice. The goal is validated learning, not feature count.</p>
<h3>Prioritise with a framework</h3>
<pre><code>RICE score = (Reach x Impact x Confidence) / Effort
  Reach      - how many users, per period
  Impact     - how much it moves the goal (e.g. 3/2/1/0.5)
  Confidence - how sure are we (100% / 80% / 50%)
  Effort     - person-months
Higher score = do sooner.
</code></pre>
<p><strong>MoSCoW</strong> sorts scope fast: <strong>Must</strong> have, <strong>Should</strong> have, <strong>Could</strong> have, <strong>Won't</strong> have (this time).</p>
<h3>Outcome-based roadmap</h3>
<p>Modern roadmaps list <strong>problems/outcomes and time horizons</strong> (Now / Next / Later), not a dated list of features you've promised to ship. This keeps commitments honest while discovery continues.</p>
<div class="callout"><span class="badge">Saying no</span> A roadmap is mostly a list of what you will NOT build yet. Prioritisation is the PM's core craft.</div>`,
    `<span class="eyebrow">DXP391 · Chương 5 · Bài 5.1</span>
<h2>MVP, roadmap &amp; ưu tiên tính năng</h2>
<h3>Sản phẩm khả dụng tối thiểu (MVP)</h3>
<p>Một <strong>MVP</strong> là thứ nhỏ nhất giúp bạn <em>học</em> được ý tưởng có chạy không — với người dùng thật, thật sự. Nó <em>không phải</em> một sản phẩm nửa vời đầy lỗi; nó là lát cắt <strong>có giá trị</strong> tinh gọn nhất. Mục tiêu là học có kiểm chứng, không phải đếm tính năng.</p>
<h3>Ưu tiên bằng khung</h3>
<pre><code>Điểm RICE = (Reach x Impact x Confidence) / Effort
  Reach      - bao nhiêu người dùng, mỗi kỳ
  Impact     - dịch chuyển mục tiêu bao nhiêu (vd 3/2/1/0.5)
  Confidence - ta chắc bao nhiêu (100% / 80% / 50%)
  Effort     - số người-tháng
Điểm cao hơn = làm sớm hơn.
</code></pre>
<p><strong>MoSCoW</strong> phân loại phạm vi nhanh: <strong>Must</strong> (bắt buộc), <strong>Should</strong> (nên), <strong>Could</strong> (có thể), <strong>Won't</strong> (chưa làm lần này).</p>
<h3>Roadmap theo kết quả</h3>
<p>Roadmap hiện đại liệt kê <strong>vấn đề/kết quả và mốc thời gian</strong> (Now / Next / Later), không phải danh sách tính năng có ngày cố định đã hứa. Cách này giữ cam kết trung thực trong khi khám phá vẫn tiếp tục.</p>
<div class="callout"><span class="badge">Nói "không"</span> Roadmap phần lớn là danh sách những thứ bạn sẽ CHƯA xây. Ưu tiên là tay nghề cốt lõi của PM.</div>`,
  ]]);

const c5q = quiz('dxp391-quiz-5', 'Quiz 5 — MVP & priorities|||Quiz 5 — MVP & ưu tiên', [
  { id: 'q1', question: 'MVP (Minimum Viable Product) đúng nghĩa là?', options: ['Sản phẩm nửa vời, đầy lỗi để ship cho nhanh', 'Lát cắt nhỏ nhất, có giá trị, đủ để HỌC ý tưởng có chạy không', 'Phiên bản đầy đủ mọi tính năng', 'Bản thiết kế Figma'], correctIndex: 1, explanation: 'MVP nhắm học có kiểm chứng với công sức tối thiểu; nó vẫn phải có giá trị, không phải bản lỗi.' },
  { id: 'q2', question: 'Công thức điểm RICE là?', options: ['Reach + Impact + Confidence + Effort', '(Reach × Impact × Confidence) / Effort', 'Reach / (Impact × Effort)', 'Impact × Effort'], correctIndex: 1, explanation: 'RICE = (Reach × Impact × Confidence) / Effort; điểm cao hơn nghĩa là nên làm sớm hơn.' },
  { id: 'q3', question: 'Trong MoSCoW, chữ "W" (Won\'t) nghĩa là?', options: ['Bắt buộc phải có', 'Sẽ không làm (ít nhất là lần này)', 'Nên có nếu kịp', 'Chắc chắn có'], correctIndex: 1, explanation: 'MoSCoW = Must / Should / Could / Won\'t; "Won\'t" đánh dấu thứ được loại khỏi phạm vi lần này.' },
]);

const c6 = doc('dxp391-6-1-agile', '6.1 — Agile development & working with engineers|||6.1 — Agile & làm việc với đội kỹ thuật',
  'Agile vs waterfall; Scrum (sprint, backlog, standup, review, retro); user story & tiêu chí chấp nhận; định nghĩa "Done"; PM làm việc với engineer thế nào.',
  [[
    `<span class="eyebrow">DXP391 · Chapter 6 · Lesson 6.1</span>
<h2>Agile development &amp; working with engineers</h2>
<h3>Why Agile</h3>
<p><strong>Waterfall</strong> plans everything up front, then builds — risky when you're still learning. <strong>Agile</strong> ships small increments, gets feedback, and adapts. It suits products because the plan <em>should</em> change as you learn.</p>
<h3>Scrum in one screen</h3>
<pre><code>Product backlog  -> prioritised list of what to build
Sprint (1-2 wks) -> a committed batch of work
  Daily standup  -> 15-min sync: done / doing / blockers
  Sprint review  -> demo the increment to stakeholders
  Retrospective  -> how do we work better next sprint
</code></pre>
<h3>User stories &amp; acceptance criteria</h3>
<pre><code>As a [type of user],
I want [some goal],
so that [some benefit].

Acceptance criteria (Definition of Done):
  - Given ... When ... Then ...
  - edge cases handled, tested, no known defects
</code></pre>
<div class="callout"><span class="badge">PM + engineers</span> Bring engineers into <em>discovery</em> early — they spot the cheapest way to solve a problem and the risky assumptions. Hand them problems to solve, not just specs to implement.</div>`,
    `<span class="eyebrow">DXP391 · Chương 6 · Bài 6.1</span>
<h2>Agile &amp; làm việc với đội kỹ thuật</h2>
<h3>Vì sao Agile</h3>
<p><strong>Waterfall</strong> lập kế hoạch mọi thứ từ đầu rồi mới xây — rủi ro khi bạn vẫn đang học. <strong>Agile</strong> ship từng phần nhỏ, lấy phản hồi, và thích ứng. Nó hợp với sản phẩm vì kế hoạch <em>nên</em> thay đổi khi ta học được điều mới.</p>
<h3>Scrum trong một màn hình</h3>
<pre><code>Product backlog  -> danh sách ưu tiên những gì cần xây
Sprint (1-2 tuần) -> một mẻ công việc đã cam kết
  Standup ngày   -> đồng bộ 15 phút: xong / đang làm / vướng
  Sprint review  -> demo phần tăng thêm cho các bên
  Retrospective  -> làm sao làm tốt hơn ở sprint sau
</code></pre>
<h3>User story &amp; tiêu chí chấp nhận</h3>
<pre><code>Là một [loại người dùng],
tôi muốn [mục tiêu],
để [lợi ích].

Tiêu chí chấp nhận (Định nghĩa "Done"):
  - Cho ... Khi ... Thì ...
  - xử lý ca biên, đã test, không lỗi đã biết
</code></pre>
<div class="callout"><span class="badge">PM + kỹ sư</span> Đưa kỹ sư vào <em>khám phá</em> sớm — họ nhìn ra cách rẻ nhất để giải vấn đề và các giả định rủi ro. Giao cho họ vấn đề để giải, không chỉ là spec để triển khai.</div>`,
  ]]);

const c6q = quiz('dxp391-quiz-6', 'Quiz 6 — Agile|||Quiz 6 — Agile', [
  { id: 'q1', question: 'Ưu điểm chính của Agile so với Waterfall khi làm sản phẩm là?', options: ['Không cần kế hoạch', 'Ship từng phần nhỏ, lấy phản hồi và thích ứng khi học được điều mới', 'Rẻ hơn tuyệt đối', 'Không cần kỹ sư'], correctIndex: 1, explanation: 'Agile giao tăng dần và thích ứng; hợp với sản phẩm vì kế hoạch nên đổi khi ta học.' },
  { id: 'q2', question: 'Một user story chuẩn có dạng?', options: ['"Xây tính năng X trước thứ Sáu"', '"Là một [người dùng], tôi muốn [mục tiêu], để [lợi ích]"', '"Điểm RICE = 12"', '"Sprint dài 2 tuần"'], correctIndex: 1, explanation: 'User story diễn đạt nhu cầu theo góc người dùng: vai trò → mục tiêu → lợi ích, kèm tiêu chí chấp nhận.' },
  { id: 'q3', question: 'Buổi "retrospective" trong Scrum dùng để?', options: ['Demo sản phẩm cho khách', 'Nhìn lại cách làm việc để cải thiện ở sprint sau', 'Lập kế hoạch cả năm', 'Sửa lỗi code trực tiếp'], correctIndex: 1, explanation: 'Retro tập trung vào quy trình: đội đã làm gì tốt/chưa tốt và cải thiện ra sao cho sprint tới.' },
]);

const c7 = doc('dxp391-7-1-metrics', '7.1 — Metrics, analytics & A/B testing (AARRR)|||7.1 — Metrics, analytics & A/B testing (AARRR)',
  'Vì sao đo lường; phễu AARRR (pirate metrics); north star metric; chỉ số phù phiếm vs chỉ số hành động; A/B test (giả thuyết, mẫu, ý nghĩa thống kê).',
  [[
    `<span class="eyebrow">DXP391 · Chapter 7 · Lesson 7.1</span>
<h2>Metrics, analytics &amp; A/B testing</h2>
<h3>The AARRR funnel (pirate metrics)</h3>
<pre><code>Acquisition -> how do users find you?
Activation  -> do they reach the first "aha" value?
Retention   -> do they come back?
Revenue     -> do they pay (or drive value)?
Referral    -> do they tell others?
</code></pre>
<h3>North Star &amp; honest metrics</h3>
<ul>
<li>Pick a <strong>North Star Metric</strong> — the one number that best captures the value users get (e.g. weekly active teams, nights booked).</li>
<li><strong>Vanity metric</strong> (total signups, page views) always goes up and hides truth. An <strong>actionable metric</strong> (activation rate, D7 retention) ties to a decision.</li>
</ul>
<h3>A/B testing</h3>
<pre><code>1. Hypothesis: "Changing X will improve metric Y because Z."
2. Split traffic: Control (A) vs Variant (B), randomly.
3. Run until enough sample for statistical significance.
4. Keep the winner; if no difference, learn and move on.
</code></pre>
<div class="callout"><span class="badge">Measure to decide</span> Instrument with a tool like <strong>GA4</strong>. A metric you won't act on is a distraction; every key metric should map to a decision.</div>`,
    `<span class="eyebrow">DXP391 · Chương 7 · Bài 7.1</span>
<h2>Metrics, analytics &amp; A/B testing</h2>
<h3>Phễu AARRR (pirate metrics)</h3>
<pre><code>Acquisition (Thu hút) -> người dùng tìm thấy bạn thế nào?
Activation (Kích hoạt) -> họ có đạt giá trị "aha" đầu tiên?
Retention (Giữ chân)  -> họ có quay lại không?
Revenue (Doanh thu)   -> họ có trả tiền (hay tạo giá trị)?
Referral (Giới thiệu) -> họ có mách người khác?
</code></pre>
<h3>North Star &amp; chỉ số trung thực</h3>
<ul>
<li>Chọn một <strong>North Star Metric</strong> — con số phản ánh rõ nhất giá trị người dùng nhận được (vd nhóm hoạt động hằng tuần, số đêm đặt phòng).</li>
<li><strong>Chỉ số phù phiếm</strong> (tổng đăng ký, lượt xem) luôn tăng và che sự thật. <strong>Chỉ số hành động</strong> (tỉ lệ kích hoạt, giữ chân D7) gắn với một quyết định.</li>
</ul>
<h3>A/B testing</h3>
<pre><code>1. Giả thuyết: "Đổi X sẽ cải thiện chỉ số Y vì Z."
2. Chia lưu lượng: Nhóm A (đối chứng) vs B (biến thể), ngẫu nhiên.
3. Chạy đến khi đủ mẫu để có ý nghĩa thống kê.
4. Giữ bên thắng; nếu không khác biệt, rút bài học và đi tiếp.
</code></pre>
<div class="callout"><span class="badge">Đo để quyết định</span> Gắn công cụ như <strong>GA4</strong>. Chỉ số mà bạn không hành động theo chỉ gây nhiễu; mỗi chỉ số then chốt nên gắn với một quyết định.</div>`,
  ]]);

const c7q = quiz('dxp391-quiz-7', 'Quiz 7 — Metrics|||Quiz 7 — Metrics & A/B', [
  { id: 'q1', question: 'Phễu AARRR gồm đúng các bước nào?', options: ['Analyze, Act, Report, Review, Repeat', 'Acquisition, Activation, Retention, Revenue, Referral', 'Agile, Api, Release, Review, Roadmap', 'Ads, App, Retarget, Revenue, Report'], correctIndex: 1, explanation: 'AARRR (pirate metrics): Thu hút → Kích hoạt → Giữ chân → Doanh thu → Giới thiệu.' },
  { id: 'q2', question: 'Đâu là "chỉ số phù phiếm" (vanity metric) ít giá trị ra quyết định?', options: ['Tỉ lệ giữ chân sau 7 ngày (D7)', 'Tỉ lệ kích hoạt', 'Tổng số lượt đăng ký tích luỹ', 'Tỉ lệ chuyển đổi trả phí'], correctIndex: 2, explanation: 'Tổng đăng ký tích luỹ luôn tăng và che sự thật; chỉ số hành động (D7, activation) gắn với quyết định cụ thể.' },
  { id: 'q3', question: 'Bước đầu tiên đúng của một A/B test là?', options: ['Chọn ngay bên thắng', 'Nêu giả thuyết rõ: đổi X sẽ cải thiện Y vì Z', 'Gửi email cho toàn bộ người dùng', 'Tắt nhóm đối chứng'], correctIndex: 1, explanation: 'A/B test bắt đầu bằng giả thuyết kiểm chứng được, rồi chia lưu lượng ngẫu nhiên và chạy đến khi đủ ý nghĩa thống kê.' },
]);

const c8 = doc('dxp391-8-1-gtm-growth', '8.1 — Go-to-market, growth & continuous improvement|||8.1 — Go-to-market, tăng trưởng & cải tiến liên tục',
  'Chiến lược go-to-market; kênh tăng trưởng; vòng lặp Hooked (trigger→action→reward→investment); Design Sprint; xây văn hoá cải tiến liên tục Build-Measure-Learn.',
  [[
    `<span class="eyebrow">DXP391 · Chapter 8 · Lesson 8.1</span>
<h2>Go-to-market, growth &amp; continuous improvement</h2>
<h3>Go-to-market (GTM)</h3>
<p>A <strong>GTM strategy</strong> answers: who is the target segment, what is the positioning &amp; pricing, and through which <strong>channels</strong> will you reach and convert them (content, ads, sales, partnerships, product-led)? Launch is a beginning, not the finish line.</p>
<h3>The Hook Model (Nir Eyal)</h3>
<pre><code>Trigger    -> a cue to act (notification, internal itch)
Action     -> the simplest behaviour done in anticipation of reward
Reward     -> variable, satisfying (the "aha", social, mastery)
Investment -> user puts in data/effort, loading the next Trigger
   (loop repeats -> a habit forms)
</code></pre>
<h3>Design Sprint &amp; continuous improvement</h3>
<p>A <strong>Google Ventures Design Sprint</strong> compresses months into 5 days: <em>map → sketch → decide → prototype → test</em> with real users. Beyond launch, run the <strong>Build-Measure-Learn</strong> loop forever — ship, measure with AARRR, learn, and feed insight back into discovery.</p>
<div class="callout"><span class="badge">Ethics of habits</span> Hooked techniques are powerful. Use them to help users reach value they want — not to trap them. The "manipulation matrix" asks: would you use it yourself, and does it materially improve the user's life?</div>`,
    `<span class="eyebrow">DXP391 · Chương 8 · Bài 8.1</span>
<h2>Go-to-market, tăng trưởng &amp; cải tiến liên tục</h2>
<h3>Go-to-market (GTM)</h3>
<p>Một <strong>chiến lược GTM</strong> trả lời: phân khúc mục tiêu là ai, định vị &amp; giá thế nào, và qua <strong>kênh</strong> nào để tiếp cận và chuyển đổi họ (nội dung, quảng cáo, bán hàng, đối tác, tăng trưởng dẫn dắt bởi sản phẩm)? Ra mắt là điểm bắt đầu, không phải vạch đích.</p>
<h3>Mô hình Hook (Nir Eyal)</h3>
<pre><code>Kích hoạt (Trigger) -> tín hiệu để hành động (thông báo, ngứa ngáy nội tại)
Hành động (Action)  -> hành vi đơn giản nhất làm vì kỳ vọng phần thưởng
Phần thưởng (Reward) -> biến đổi, thoả mãn (khoảnh khắc "aha", xã hội, thành thạo)
Đầu tư (Investment) -> người dùng bỏ dữ liệu/công sức, nạp cho Trigger kế tiếp
   (vòng lặp lặp lại -> thói quen hình thành)
</code></pre>
<h3>Design Sprint &amp; cải tiến liên tục</h3>
<p>Một <strong>Google Ventures Design Sprint</strong> nén nhiều tháng vào 5 ngày: <em>map → sketch → decide → prototype → test</em> với người dùng thật. Sau ra mắt, chạy vòng lặp <strong>Build-Measure-Learn</strong> mãi mãi — ship, đo bằng AARRR, học, rồi đưa hiểu biết trở lại khám phá.</p>
<div class="callout"><span class="badge">Đạo đức của thói quen</span> Kỹ thuật Hooked rất mạnh. Dùng để giúp người dùng đạt giá trị họ muốn — đừng bẫy họ. "Ma trận thao túng" hỏi: bạn có tự dùng không, và nó có thật sự cải thiện đời sống người dùng?</div>`,
  ]]);

const c8q = quiz('dxp391-quiz-8', 'Quiz 8 — GTM & growth|||Quiz 8 — Go-to-market & tăng trưởng', [
  { id: 'q1', question: 'Bốn bước theo đúng thứ tự của mô hình Hook (Nir Eyal) là?', options: ['Action → Trigger → Investment → Reward', 'Trigger → Action → Reward → Investment', 'Reward → Trigger → Action → Investment', 'Trigger → Reward → Action → Investment'], correctIndex: 1, explanation: 'Vòng Hook: Kích hoạt → Hành động → Phần thưởng (biến đổi) → Đầu tư, rồi lặp lại tạo thói quen.' },
  { id: 'q2', question: 'Một Google Ventures Design Sprint chuẩn kéo dài và làm gì?', options: ['1 ngày, chỉ họp', '5 ngày: map → sketch → decide → prototype → test', '1 tháng viết code', '2 tuần chạy quảng cáo'], correctIndex: 1, explanation: 'Design Sprint nén nhiều tháng vào 5 ngày, kết thúc bằng test prototype với người dùng thật.' },
  { id: 'q3', question: 'Vòng lặp "Build-Measure-Learn" nhấn mạnh điều gì sau khi ra mắt?', options: ['Ngừng thay đổi vì đã xong', 'Ship → đo lường → học → đưa hiểu biết trở lại khám phá, lặp mãi', 'Chỉ đo doanh thu', 'Chỉ đo lượt tải một lần'], correctIndex: 1, explanation: 'Cải tiến liên tục: ra mắt chỉ là bắt đầu; đo (AARRR), học, và lặp lại vòng discovery-delivery.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'DXP391',
    slug: 'dxp391-digital-product-development',
    title: 'Digital Product Development',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DXP391.webp',
    shortDescription: 'Build digital products people want — product lifecycle, user discovery, product-market fit, UX/UI prototyping in Figma, MVP & prioritisation (RICE/MoSCoW), Agile, metrics (AARRR) & A/B testing, go-to-market & growth. Bilingual, with quizzes.|||Xây sản phẩm số người ta muốn — vòng đời, khám phá người dùng, product-market fit, prototyping UX/UI (Figma), MVP & ưu tiên (RICE/MoSCoW), Agile, metrics (AARRR) & A/B test, go-to-market & tăng trưởng. Song ngữ, có quiz.',
    description: 'Môn <strong>DXP391 — Digital Product Development</strong> (Phát triển sản phẩm số, ngành Chuyển đổi số, kỳ 5) dạy cách <strong>xây sản phẩm số mà người dùng thực sự muốn</strong>. Từ <strong>sản phẩm &amp; vòng đời</strong> → <strong>nghiên cứu người dùng &amp; discovery</strong> (Torres) → <strong>product-market fit &amp; tuyên bố giá trị</strong> (Olsen) → <strong>UX/UI &amp; prototyping</strong> (Figma) → <strong>MVP, roadmap &amp; ưu tiên</strong> (RICE, MoSCoW) → <strong>Agile với đội kỹ thuật</strong> → <strong>metrics, analytics &amp; A/B testing</strong> (AARRR) → <strong>go-to-market, tăng trưởng &amp; cải tiến liên tục</strong> (Hooked, Design Sprint). Bám giáo trình FLM và các sách kinh điển, song ngữ, có canvas &amp; quiz mỗi chương.',
    whatYouLearn: 'Sản phẩm số &amp; vòng đời; vai trò đội sản phẩm (PM/designer/engineer); phỏng vấn người dùng &amp; opportunity solution tree; product-market fit &amp; tháp Lean Product; value proposition (pains/gains); UX vs UI, wireframe→mockup→prototype (Figma); MVP; ưu tiên bằng RICE &amp; MoSCoW; roadmap Now/Next/Later; Scrum, user story &amp; acceptance criteria; phễu AARRR, north star, A/B testing; go-to-market, mô hình Hook, Design Sprint, Build-Measure-Learn.',
    requirements: 'Không cần biết lập trình. Nên có tài khoản Figma (miễn phí) để thực hành prototyping và một tài khoản Google để dùng GA4/Miro.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách kinh điển, công cụ, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Sản phẩm số, 4 rủi ro, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Sản phẩm số & vòng đời|||Chapter 1 — Product & lifecycle', description: 'Sản phẩm vs dự án, vòng đời, đội sản phẩm.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nghiên cứu người dùng & discovery|||Chapter 2 — Research & discovery', description: 'Phỏng vấn, opportunity solution tree, JTBD.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Product-market fit & giá trị|||Chapter 3 — PMF & value', description: 'Tháp Lean Product, value proposition, PMF.', lessons: [c3, c3q] },
    { title: 'Chương 4 — UX/UI & prototyping|||Chapter 4 — UX/UI & prototyping', description: 'UX vs UI, fidelity, Figma, nguyên tắc.', lessons: [c4, c4q] },
    { title: 'Chương 5 — MVP, roadmap & ưu tiên|||Chapter 5 — MVP & prioritisation', description: 'MVP, RICE, MoSCoW, roadmap kết quả.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Agile & đội kỹ thuật|||Chapter 6 — Agile & engineers', description: 'Scrum, user story, Done, PM+engineer.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Metrics & A/B testing|||Chapter 7 — Metrics & A/B', description: 'AARRR, north star, A/B test, GA4.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Go-to-market & tăng trưởng|||Chapter 8 — GTM & growth', description: 'GTM, Hook, Design Sprint, Build-Measure-Learn.', lessons: [c8, c8q] },
  ],
};
