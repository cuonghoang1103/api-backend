/**
 * PRE203 — Introduction to Public Relations (Nhập môn Quan hệ công chúng).
 * Ngành Công nghệ Truyền thông FPTU, kỳ 4. KHÔNG có FLM syl công khai →
 * dựng theo giáo trình chuẩn quốc tế: Cutlip & Center "Effective Public
 * Relations", Wilcox "Public Relations: Strategies and Tactics", Grunig &
 * Hunt (4 models). 8 chương: PR là gì · lý thuyết & mô hình · quy trình
 * RACE/ROPE · công chúng & stakeholder · quan hệ báo chí · công cụ & kênh ·
 * viết cho PR · đo lường & đạo đức. Song ngữ + ví dụ thật + quiz.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; "&"→"&amp;" trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('pre203-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách chuẩn (Cutlip & Center, Wilcox), hiệp hội nghề (PRSA/IPRA), dịch vụ phát tin (PR Newswire, Cision), kênh học, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">PRE203 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Public Relations</strong> — what PR is, the theory and process behind it, media relations, tools and channels, writing and measurement — in one place. The core textbooks below are the global standard for an intro PR course.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener"><em>Effective Public Relations</em> — Cutlip &amp; Center (Broom &amp; Sha)</a> — the field's classic, home of the four-step process.</li>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener"><em>Public Relations: Strategies and Tactics</em> — Wilcox, Cameron &amp; Reber</a> — practice-focused, tactic by tactic.</li>
<li><a href="https://www.routledge.com/" target="_blank" rel="noopener"><em>Managing Public Relations</em> — Grunig &amp; Hunt</a> — origin of the four models &amp; two-way symmetric theory.</li>
</ul>
<h3>🌐 Professional bodies (free)</h3>
<ul>
<li><a href="https://www.prsa.org/" target="_blank" rel="noopener">PRSA — Public Relations Society of America</a> — definition of PR, Code of Ethics, resources.</li>
<li><a href="https://www.ipra.org/" target="_blank" rel="noopener">IPRA — International Public Relations Association</a> — global code &amp; standards.</li>
<li><a href="https://amecorg.com/" target="_blank" rel="noopener">AMEC — Barcelona Principles</a> — the modern standard for PR measurement.</li>
</ul>
<h3>🛠️ Industry tools &amp; wire services</h3>
<ul>
<li><a href="https://www.prnewswire.com/" target="_blank" rel="noopener">PR Newswire</a> — press-release distribution wire.</li>
<li><a href="https://www.cision.com/" target="_blank" rel="noopener">Cision</a> — media database, monitoring &amp; measurement.</li>
<li><a href="https://www.muckrack.com/" target="_blank" rel="noopener">Muck Rack</a> — journalist database &amp; pitching.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what PR is (vs marketing &amp; advertising), its history, why reputation is an asset.</li>
<li><strong>Think in models</strong> — Grunig's four models, two-way symmetric communication, and who your publics are.</li>
<li><strong>Run the process</strong> — RACE / ROPE: research → objectives → programming → evaluation, on a real (mini) campaign.</li>
<li><strong>Job-ready</strong> — write a press release, pitch a journalist, and measure outcomes with the Barcelona Principles.</li>
</ol></div>`,
    `<span class="eyebrow">PRE203 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Quan hệ công chúng (PR)</strong> — PR là gì, lý thuyết &amp; quy trình, quan hệ báo chí, công cụ &amp; kênh, viết và đo lường — gom về một chỗ. Các sách bên dưới là chuẩn quốc tế cho môn nhập môn PR.</p>
<h3>📘 Sách giáo trình gốc</h3>
<ul>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener"><em>Effective Public Relations</em> — Cutlip &amp; Center (Broom &amp; Sha)</a> — kinh điển của ngành, nơi sinh ra quy trình 4 bước.</li>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener"><em>Public Relations: Strategies and Tactics</em> — Wilcox, Cameron &amp; Reber</a> — thiên về thực hành, đi theo từng chiến thuật.</li>
<li><a href="https://www.routledge.com/" target="_blank" rel="noopener"><em>Managing Public Relations</em> — Grunig &amp; Hunt</a> — gốc của bốn mô hình &amp; lý thuyết hai chiều đối xứng.</li>
</ul>
<h3>🌐 Hiệp hội nghề (miễn phí)</h3>
<ul>
<li><a href="https://www.prsa.org/" target="_blank" rel="noopener">PRSA — Hiệp hội PR Hoa Kỳ</a> — định nghĩa PR, Bộ quy tắc đạo đức, tài liệu.</li>
<li><a href="https://www.ipra.org/" target="_blank" rel="noopener">IPRA — Hiệp hội PR Quốc tế</a> — bộ quy tắc &amp; chuẩn toàn cầu.</li>
<li><a href="https://amecorg.com/" target="_blank" rel="noopener">AMEC — Nguyên tắc Barcelona</a> — chuẩn hiện đại cho đo lường PR.</li>
</ul>
<h3>🛠️ Công cụ ngành &amp; dịch vụ phát tin</h3>
<ul>
<li><a href="https://www.prnewswire.com/" target="_blank" rel="noopener">PR Newswire</a> — dịch vụ phát tán thông cáo báo chí.</li>
<li><a href="https://www.cision.com/" target="_blank" rel="noopener">Cision</a> — cơ sở dữ liệu báo chí, giám sát &amp; đo lường.</li>
<li><a href="https://www.muckrack.com/" target="_blank" rel="noopener">Muck Rack</a> — dữ liệu nhà báo &amp; gửi pitch.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — PR là gì (khác marketing &amp; quảng cáo), lịch sử, vì sao danh tiếng là tài sản.</li>
<li><strong>Tư duy theo mô hình</strong> — bốn mô hình của Grunig, truyền thông hai chiều đối xứng, và công chúng của bạn là ai.</li>
<li><strong>Chạy quy trình</strong> — RACE / ROPE: nghiên cứu → mục tiêu → lập trình → đánh giá, trên một chiến dịch (nhỏ) thật.</li>
<li><strong>Sẵn sàng đi làm</strong> — viết một thông cáo báo chí, pitch một nhà báo, và đo kết quả theo Nguyên tắc Barcelona.</li>
</ol></div>`,
  ]]);

const intro = doc('pre203-0-1-overview', 'Course overview: Introduction to Public Relations|||Tổng quan: Nhập môn Quan hệ công chúng',
  'PR quản trị danh tiếng & mối quan hệ giữa tổ chức và công chúng; khác quảng cáo/marketing; lộ trình 8 chương: PR là gì → lý thuyết → quy trình → công chúng → báo chí → công cụ → viết → đo lường & đạo đức.',
  [[
    `<span class="eyebrow">PRE203 · Lesson 0.1 · Overview</span>
<h2>Introduction to Public Relations</h2>
<p class="lead">Public relations is the <strong>management of relationships and reputation</strong> between an organization and the publics it depends on. Where advertising buys space to say "buy this", PR earns <strong>trust</strong> — through media coverage, events, community work and honest two-way communication.</p>
<h3>A working definition</h3>
<p>PRSA defines PR as "a <strong>strategic communication process</strong> that builds <strong>mutually beneficial relationships</strong> between organizations and their publics." Two words matter: <em>strategic</em> (planned, tied to goals) and <em>mutually beneficial</em> (both sides gain — not spin).</p>
<h3>Why it matters</h3>
<p>Reputation is an asset you cannot buy back after a crisis. A single mishandled recall, data breach or scandal can erase years of goodwill — while a well-run PR program turns customers, employees and communities into advocates.</p>
<h3>Roadmap</h3>
<p>What PR is (vs marketing &amp; advertising, history) → theory &amp; models (Grunig) → the PR process (RACE/ROPE) → publics &amp; stakeholders → media relations → tools &amp; channels → writing for PR → measurement &amp; ethics. Bilingual, with real-world examples and a quiz each chapter.</p>`,
    `<span class="eyebrow">PRE203 · Bài 0.1 · Tổng quan</span>
<h2>Nhập môn Quan hệ công chúng</h2>
<p class="lead">Quan hệ công chúng là việc <strong>quản trị mối quan hệ và danh tiếng</strong> giữa một tổ chức và các nhóm công chúng mà nó phụ thuộc. Trong khi quảng cáo mua chỗ để nói "hãy mua cái này", PR <strong>gây dựng niềm tin</strong> — qua đưa tin báo chí, sự kiện, hoạt động cộng đồng và truyền thông hai chiều trung thực.</p>
<h3>Một định nghĩa làm việc</h3>
<p>PRSA định nghĩa PR là "một <strong>quy trình truyền thông chiến lược</strong> xây dựng <strong>mối quan hệ đôi bên cùng có lợi</strong> giữa tổ chức và công chúng của họ." Hai chữ quan trọng: <em>chiến lược</em> (có kế hoạch, gắn với mục tiêu) và <em>đôi bên cùng có lợi</em> (cả hai phía cùng được lợi — không phải tô vẽ).</p>
<h3>Vì sao quan trọng</h3>
<p>Danh tiếng là tài sản không mua lại được sau khủng hoảng. Một vụ thu hồi sản phẩm, rò rỉ dữ liệu hay bê bối xử lý kém có thể xoá sạch nhiều năm thiện chí — còn một chương trình PR tốt biến khách hàng, nhân viên và cộng đồng thành người ủng hộ.</p>
<h3>Lộ trình</h3>
<p>PR là gì (khác marketing &amp; quảng cáo, lịch sử) → lý thuyết &amp; mô hình (Grunig) → quy trình PR (RACE/ROPE) → công chúng &amp; stakeholder → quan hệ báo chí → công cụ &amp; kênh → viết cho PR → đo lường &amp; đạo đức. Song ngữ, có ví dụ thật và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('pre203-1-1-what-is-pr', '1.1 — What is PR? (vs marketing/advertising, history)|||1.1 — PR là gì? (khác marketing/quảng cáo, lịch sử)',
  'Định nghĩa PR; phân biệt PR / quảng cáo / marketing (earned vs paid); lịch sử ngành: Ivy Lee (Declaration of Principles), Edward Bernays ("cha đẻ PR").',
  [[
    `<span class="eyebrow">PRE203 · Chapter 1 · Lesson 1.1</span>
<h2>What is PR?</h2>
<h3>PR vs advertising vs marketing</h3>
<ul>
<li><strong>Advertising = paid media.</strong> You buy the space and control the exact message ("owned words, rented space"). The audience knows it is an ad, so trust is lower.</li>
<li><strong>PR = earned media.</strong> You persuade a journalist, editor or influencer to cover you on their own judgment. You do not control the wording — but third-party endorsement carries far more credibility.</li>
<li><strong>Marketing</strong> is the wider function of creating and selling value (the 4Ps: product, price, place, promotion). PR is one part of promotion, but its focus is <em>relationships and reputation</em>, not just sales.</li>
</ul>
<div class="callout"><span class="badge">One-liner</span> "Advertising is what you pay for; publicity is what you pray for." PR earns coverage instead of buying it.</div>
<h3>A short history</h3>
<ul>
<li><strong>Ivy Lee (early 1900s)</strong> — issued the first "Declaration of Principles", argued for telling the public the truth promptly; handled the 1906 Pennsylvania Railroad crash with an open press statement (the first modern press release).</li>
<li><strong>Edward Bernays</strong> — the "father of public relations"; applied psychology to shape opinion (e.g. the 1929 "Torches of Freedom" campaign linking cigarettes to women's liberation), and wrote <em>Crystallizing Public Opinion</em>.</li>
</ul>
<p>The field moved from one-way publicity toward today's ideal: honest, two-way relationship management.</p>`,
    `<span class="eyebrow">PRE203 · Chương 1 · Bài 1.1</span>
<h2>PR là gì?</h2>
<h3>PR khác quảng cáo khác marketing</h3>
<ul>
<li><strong>Quảng cáo = media trả tiền (paid).</strong> Bạn mua chỗ và kiểm soát thông điệp chính xác ("lời của bạn, chỗ thuê"). Khán giả biết đó là quảng cáo nên độ tin thấp hơn.</li>
<li><strong>PR = media kiếm được (earned).</strong> Bạn thuyết phục nhà báo, biên tập viên hay người ảnh hưởng đưa tin theo đánh giá của họ. Bạn không kiểm soát câu chữ — nhưng lời chứng thực từ bên thứ ba đáng tin hơn nhiều.</li>
<li><strong>Marketing</strong> là chức năng rộng: tạo và bán giá trị (4P: sản phẩm, giá, phân phối, xúc tiến). PR là một phần của xúc tiến, nhưng trọng tâm là <em>mối quan hệ và danh tiếng</em>, không chỉ doanh số.</li>
</ul>
<div class="callout"><span class="badge">Một câu</span> "Quảng cáo là thứ bạn trả tiền; publicity là thứ bạn cầu mong." PR kiếm được tin bài thay vì mua nó.</div>
<h3>Lịch sử ngắn gọn</h3>
<ul>
<li><strong>Ivy Lee (đầu 1900s)</strong> — ra "Tuyên ngôn Nguyên tắc" đầu tiên, chủ trương nói thật với công chúng kịp thời; xử lý vụ tai nạn đường sắt Pennsylvania 1906 bằng thông cáo mở cho báo chí (thông cáo báo chí hiện đại đầu tiên).</li>
<li><strong>Edward Bernays</strong> — "cha đẻ của PR"; áp dụng tâm lý học để định hình dư luận (vd chiến dịch "Torches of Freedom" 1929 gắn thuốc lá với giải phóng phụ nữ), và viết <em>Crystallizing Public Opinion</em>.</li>
</ul>
<p>Ngành dịch chuyển từ publicity một chiều sang lý tưởng ngày nay: quản trị quan hệ hai chiều trung thực.</p>`,
  ]]);

const c1q = quiz('pre203-quiz-1', 'Quiz 1 — What is PR|||Quiz 1 — PR là gì', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa PR và quảng cáo là?', options: ['PR luôn đắt hơn', 'PR là media "kiếm được" (earned), quảng cáo là media "trả tiền" (paid)', 'PR chỉ dùng cho tổ chức phi lợi nhuận', 'Quảng cáo không kiểm soát thông điệp'], correctIndex: 1, explanation: 'PR earned: thuyết phục bên thứ ba đưa tin; quảng cáo paid: mua chỗ, kiểm soát thông điệp.' },
  { id: 'q2', question: 'Ai được gọi là "cha đẻ của PR", áp dụng tâm lý học vào định hình dư luận?', options: ['Ivy Lee', 'Edward Bernays', 'James Grunig', 'Scott Cutlip'], correctIndex: 1, explanation: 'Edward Bernays — tác giả Crystallizing Public Opinion, chiến dịch Torches of Freedom.' },
  { id: 'q3', question: 'Theo PRSA, PR là quy trình truyền thông chiến lược nhằm xây dựng?', options: ['Doanh số ngắn hạn', 'Mối quan hệ đôi bên cùng có lợi', 'Quảng cáo giá rẻ', 'Nội dung viral'], correctIndex: 1, explanation: 'PRSA: "mutually beneficial relationships" giữa tổ chức và công chúng.' },
]);

const c2 = doc('pre203-2-1-theory-models', '2.1 — PR theory & models (Grunig)|||2.1 — Lý thuyết & mô hình PR (Grunig)',
  'Bốn mô hình Grunig & Hunt (press agentry, public information, two-way asymmetric, two-way symmetric); truyền thông hai chiều đối xứng là lý tưởng; khái niệm "publics".',
  [[
    `<span class="eyebrow">PRE203 · Chapter 2 · Lesson 2.1</span>
<h2>PR theory &amp; models</h2>
<h3>Grunig &amp; Hunt's four models</h3>
<p>The most cited framework in PR describes four historical ways organizations communicate:</p>
<ol>
<li><strong>Press agentry / publicity</strong> — one-way, propaganda, truth optional; goal is attention (think old-style celebrity hype).</li>
<li><strong>Public information</strong> — one-way, but truthful; a "journalist-in-residence" disseminates accurate facts (e.g. government press office).</li>
<li><strong>Two-way asymmetric</strong> — uses research to persuade; feedback flows in, but only to make the message more convincing. The <em>organization</em> still changes least.</li>
<li><strong>Two-way symmetric</strong> — dialogue and negotiation; both the organization and its publics may change. Grunig calls this the <strong>ideal, most ethical</strong> model.</li>
</ol>
<div class="callout"><span class="badge">The ideal</span> Two-way symmetric communication treats PR as relationship management and conflict resolution — not one-way persuasion.</div>
<h3>Publics &amp; systems thinking</h3>
<p>An organization is an <em>open system</em> that depends on groups in its environment — customers, employees, media, regulators, community. A <strong>public</strong> is any group that is affected by, or can affect, the organization. Good PR keeps the whole system in balance by managing these interdependencies.</p>`,
    `<span class="eyebrow">PRE203 · Chương 2 · Bài 2.1</span>
<h2>Lý thuyết &amp; mô hình PR</h2>
<h3>Bốn mô hình của Grunig &amp; Hunt</h3>
<p>Khung được trích dẫn nhiều nhất trong PR mô tả bốn cách tổ chức truyền thông theo lịch sử:</p>
<ol>
<li><strong>Press agentry / publicity</strong> — một chiều, tuyên truyền, sự thật tuỳ chọn; mục tiêu là gây chú ý (kiểu thổi phồng người nổi tiếng xưa).</li>
<li><strong>Public information</strong> — một chiều nhưng trung thực; một "nhà báo nội bộ" phát đi thông tin chính xác (vd phòng thông tin chính phủ).</li>
<li><strong>Two-way asymmetric (hai chiều bất đối xứng)</strong> — dùng nghiên cứu để thuyết phục; có phản hồi đi vào, nhưng chỉ để làm thông điệp thuyết phục hơn. <em>Tổ chức</em> thay đổi ít nhất.</li>
<li><strong>Two-way symmetric (hai chiều đối xứng)</strong> — đối thoại và thương lượng; cả tổ chức lẫn công chúng đều có thể thay đổi. Grunig gọi đây là mô hình <strong>lý tưởng, đạo đức nhất</strong>.</li>
</ol>
<div class="callout"><span class="badge">Lý tưởng</span> Truyền thông hai chiều đối xứng coi PR là quản trị quan hệ và giải quyết xung đột — không phải thuyết phục một chiều.</div>
<h3>Công chúng &amp; tư duy hệ thống</h3>
<p>Tổ chức là một <em>hệ mở</em> phụ thuộc vào các nhóm trong môi trường — khách hàng, nhân viên, báo chí, cơ quan quản lý, cộng đồng. Một <strong>public (công chúng)</strong> là bất kỳ nhóm nào bị tác động bởi, hoặc có thể tác động tới, tổ chức. PR tốt giữ cả hệ thống cân bằng bằng cách quản trị các phụ thuộc lẫn nhau này.</p>`,
  ]]);

const c2q = quiz('pre203-quiz-2', 'Quiz 2 — Theory & models|||Quiz 2 — Lý thuyết & mô hình', [
  { id: 'q1', question: 'Mô hình nào của Grunig được coi là lý tưởng và đạo đức nhất?', options: ['Press agentry', 'Public information', 'Two-way asymmetric', 'Two-way symmetric'], correctIndex: 3, explanation: 'Hai chiều đối xứng: đối thoại, cả hai phía có thể thay đổi.' },
  { id: 'q2', question: 'Mô hình "public information" đặc trưng bởi?', options: ['Một chiều nhưng thông tin trung thực, chính xác', 'Tuyên truyền một chiều bất chấp sự thật', 'Đối thoại hai chiều', 'Dùng nghiên cứu để thao túng'], correctIndex: 0, explanation: 'Public information: một chiều nhưng trung thực, như phòng thông tin chính phủ.' },
  { id: 'q3', question: 'Trong PR, "a public" (một nhóm công chúng) là?', options: ['Toàn bộ dân số một quốc gia', 'Nhóm bị tác động bởi hoặc có thể tác động tới tổ chức', 'Chỉ khách hàng đã mua hàng', 'Cổ đông duy nhất'], correctIndex: 1, explanation: 'Public = nhóm có quan hệ tác động qua lại với tổ chức.' },
]);

const c3 = doc('pre203-3-1-race-rope', '3.1 — The PR process (RACE / ROPE)|||3.1 — Quy trình PR (RACE / ROPE)',
  'Quy trình 4 bước: Research → Objectives/Action → Communication/Programming → Evaluation. Cutlip & Center; SMART objectives; ví dụ chiến dịch.',
  [[
    `<span class="eyebrow">PRE203 · Chapter 3 · Lesson 3.1</span>
<h2>The PR process — RACE / ROPE</h2>
<p>Effective PR is not random publicity; it follows a <strong>four-step process</strong>. Two popular acronyms describe the same cycle.</p>
<pre><code>RACE (Marston)        ROPE / Cutlip &amp; Center
 R  Research           R  Research  (define the problem)
 A  Action &amp; planning  O  Objectives
 C  Communication      P  Programming (planning + execution)
 E  Evaluation         E  Evaluation
</code></pre>
<ul>
<li><strong>Research</strong> — define the situation and the publics; gather data (surveys, media audits, listening). "No research, no PR."</li>
<li><strong>Objectives</strong> — set <strong>SMART</strong> goals (Specific, Measurable, Achievable, Relevant, Time-bound); separate <em>output</em> goals (e.g. 20 media pieces) from <em>outcome</em> goals (e.g. +10% awareness).</li>
<li><strong>Programming / Communication</strong> — plan strategy &amp; tactics, then execute: messages, channels, timeline, budget.</li>
<li><strong>Evaluation</strong> — measure against the objectives and feed the results back into the next round.</li>
</ul>
<div class="callout"><span class="badge">Example</span> A university wants more applicants. <em>Research</em>: survey why students choose rivals. <em>Objective</em>: +15% open-day sign-ups in 3 months. <em>Programming</em>: student ambassador stories + local media + campus tour events. <em>Evaluation</em>: compare sign-ups and coverage to the target.</div>`,
    `<span class="eyebrow">PRE203 · Chương 3 · Bài 3.1</span>
<h2>Quy trình PR — RACE / ROPE</h2>
<p>PR hiệu quả không phải publicity ngẫu hứng; nó đi theo một <strong>quy trình 4 bước</strong>. Hai từ viết tắt phổ biến mô tả cùng một chu trình.</p>
<pre><code>RACE (Marston)        ROPE / Cutlip &amp; Center
 R  Research           R  Research  (xác định vấn đề)
 A  Action &amp; planning  O  Objectives (mục tiêu)
 C  Communication      P  Programming (lập & thực thi)
 E  Evaluation         E  Evaluation (đánh giá)
</code></pre>
<ul>
<li><strong>Research (Nghiên cứu)</strong> — xác định tình huống và công chúng; thu thập dữ liệu (khảo sát, audit báo chí, lắng nghe). "Không nghiên cứu, không PR."</li>
<li><strong>Objectives (Mục tiêu)</strong> — đặt mục tiêu <strong>SMART</strong> (Cụ thể, Đo được, Khả thi, Liên quan, Có hạn định); tách mục tiêu <em>output</em> (vd 20 bài báo) khỏi mục tiêu <em>outcome</em> (vd +10% nhận biết).</li>
<li><strong>Programming / Communication</strong> — lập chiến lược &amp; chiến thuật rồi thực thi: thông điệp, kênh, tiến độ, ngân sách.</li>
<li><strong>Evaluation (Đánh giá)</strong> — đo lại theo mục tiêu và đưa kết quả vào vòng kế tiếp.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ</span> Một trường đại học muốn tăng thí sinh. <em>Nghiên cứu</em>: khảo sát vì sao thí sinh chọn trường đối thủ. <em>Mục tiêu</em>: +15% đăng ký ngày hội mở trong 3 tháng. <em>Programming</em>: câu chuyện đại sứ sinh viên + báo địa phương + sự kiện tham quan. <em>Đánh giá</em>: so lượt đăng ký và tin bài với mục tiêu.</div>`,
  ]]);

const c3q = quiz('pre203-quiz-3', 'Quiz 3 — PR process|||Quiz 3 — Quy trình PR', [
  { id: 'q1', question: 'RACE trong quy trình PR viết tắt cho?', options: ['Reach, Action, Cost, Effect', 'Research, Action, Communication, Evaluation', 'Report, Analyze, Create, Execute', 'Review, Adjust, Change, Evaluate'], correctIndex: 1, explanation: 'RACE: Research → Action/planning → Communication → Evaluation.' },
  { id: 'q2', question: 'Mục tiêu PR nên là "SMART", trong đó chữ M nghĩa là?', options: ['Marketing', 'Measurable (đo được)', 'Media', 'Massive'], correctIndex: 1, explanation: 'SMART: Specific, Measurable, Achievable, Relevant, Time-bound.' },
  { id: 'q3', question: 'Bước đầu tiên, nền tảng của cả quy trình PR là?', options: ['Communication', 'Evaluation', 'Research', 'Distribution'], correctIndex: 2, explanation: 'Nghiên cứu trước: "No research, no PR" — xác định vấn đề và công chúng.' },
]);

const c4 = doc('pre203-4-1-publics-stakeholders', '4.1 — Publics & stakeholders|||4.1 — Công chúng & stakeholder',
  'Stakeholder vs public; mapping (power/interest); phân khúc công chúng; lý thuyết công chúng tình huống của Grunig (latent/aware/active).',
  [[
    `<span class="eyebrow">PRE203 · Chapter 4 · Lesson 4.1</span>
<h2>Publics &amp; stakeholders</h2>
<h3>Stakeholder vs public</h3>
<p>A <strong>stakeholder</strong> is any group with a stake in the organization (employees, investors, customers, suppliers, community, government). A <strong>public</strong> is a stakeholder group that has become <em>active</em> around a specific issue. You cannot talk to "everyone" — you segment.</p>
<h3>Stakeholder mapping (power / interest)</h3>
<pre><code>            HIGH interest
              |
 Keep         |   Manage
 informed     |   closely  (key players)
--------------+--------------- HIGH power
 Monitor      |   Keep
 (min. effort)|   satisfied
              |
            LOW interest
</code></pre>
<p>Plot each group by how much <strong>power</strong> and <strong>interest</strong> it has, then match the effort: manage key players closely, keep the powerful-but-disengaged satisfied, keep the interested-but-weak informed.</p>
<h3>Grunig's situational theory of publics</h3>
<p>People become an active public when three things line up: they <strong>recognize a problem</strong>, feel <strong>low constraint</strong> (they believe they can do something), and have high <strong>involvement</strong>. This explains the ladder:</p>
<ul>
<li><strong>Latent</strong> — affected but not yet aware.</li>
<li><strong>Aware</strong> — recognize the problem.</li>
<li><strong>Active</strong> — organize and act (the group PR must engage first).</li>
</ul>
<div class="callout"><span class="badge">Example</span> A factory plans expansion. Nearby residents start as a <em>latent</em> public; once local media reports on noise they become <em>aware</em>; if they form a petition group they are an <em>active</em> public — engage them early, not after the protest.</div>`,
    `<span class="eyebrow">PRE203 · Chương 4 · Bài 4.1</span>
<h2>Công chúng &amp; stakeholder</h2>
<h3>Stakeholder khác public</h3>
<p><strong>Stakeholder</strong> là bất kỳ nhóm nào có lợi ích liên quan tới tổ chức (nhân viên, nhà đầu tư, khách hàng, nhà cung cấp, cộng đồng, chính quyền). <strong>Public (công chúng)</strong> là nhóm stakeholder đã trở nên <em>chủ động</em> quanh một vấn đề cụ thể. Bạn không thể nói với "tất cả mọi người" — phải phân khúc.</p>
<h3>Bản đồ stakeholder (quyền lực / mức quan tâm)</h3>
<pre><code>            Quan tâm CAO
              |
 Giữ cho      |   Quản lý
 nắm tin      |   sát  (nhân vật chủ chốt)
--------------+--------------- Quyền lực CAO
 Theo dõi     |   Giữ cho
 (ít công)    |   hài lòng
              |
            Quan tâm THẤP
</code></pre>
<p>Đặt mỗi nhóm theo mức <strong>quyền lực</strong> và <strong>quan tâm</strong>, rồi phân bổ công sức: quản lý sát nhóm chủ chốt, giữ hài lòng nhóm mạnh nhưng ít quan tâm, giữ cho nắm tin nhóm quan tâm nhưng yếu.</p>
<h3>Lý thuyết công chúng tình huống của Grunig</h3>
<p>Người ta trở thành công chúng chủ động khi ba yếu tố gặp nhau: họ <strong>nhận ra vấn đề</strong>, thấy <strong>ít ràng buộc</strong> (tin mình làm được gì đó), và có <strong>mức liên quan</strong> cao. Điều này giải thích các bậc:</p>
<ul>
<li><strong>Latent (tiềm ẩn)</strong> — bị ảnh hưởng nhưng chưa nhận biết.</li>
<li><strong>Aware (nhận biết)</strong> — nhận ra vấn đề.</li>
<li><strong>Active (chủ động)</strong> — tổ chức lại và hành động (nhóm PR phải tiếp cận trước tiên).</li>
</ul>
<div class="callout"><span class="badge">Ví dụ</span> Một nhà máy dự định mở rộng. Cư dân gần đó ban đầu là công chúng <em>tiềm ẩn</em>; khi báo địa phương đưa tin về tiếng ồn họ thành <em>nhận biết</em>; nếu lập nhóm kiến nghị thì thành công chúng <em>chủ động</em> — hãy tiếp cận sớm, đừng đợi tới khi có biểu tình.</div>`,
  ]]);

const c4q = quiz('pre203-quiz-4', 'Quiz 4 — Publics & stakeholders|||Quiz 4 — Công chúng & stakeholder', [
  { id: 'q1', question: 'Hai trục thường dùng trong bản đồ stakeholder là?', options: ['Tuổi và giới tính', 'Quyền lực (power) và mức quan tâm (interest)', 'Doanh thu và chi phí', 'Online và offline'], correctIndex: 1, explanation: 'Ma trận power/interest quyết định mức đầu tư cho từng nhóm.' },
  { id: 'q2', question: 'Theo lý thuyết tình huống của Grunig, nhóm "bị ảnh hưởng nhưng chưa nhận biết vấn đề" là công chúng?', options: ['Active (chủ động)', 'Aware (nhận biết)', 'Latent (tiềm ẩn)', 'Non-public'], correctIndex: 2, explanation: 'Latent → aware → active là ba bậc phát triển của công chúng.' },
  { id: 'q3', question: 'Vì sao PR phải phân khúc thay vì nói với "tất cả mọi người"?', options: ['Để tiết kiệm tiền in ấn', 'Vì mỗi nhóm công chúng có mối quan tâm và kênh khác nhau', 'Vì luật cấm nói với công chúng rộng', 'Vì chỉ khách hàng mới đáng quan tâm'], correctIndex: 1, explanation: 'Phân khúc để thông điệp và kênh khớp với từng nhóm.' },
]);

const c5 = doc('pre203-5-1-media-relations', '5.1 — Media relations|||5.1 — Quan hệ báo chí',
  'Quan hệ với nhà báo; news value; thông cáo báo chí, press kit/media kit, họp báo (press conference); pitching; gatekeeper.',
  [[
    `<span class="eyebrow">PRE203 · Chapter 5 · Lesson 5.1</span>
<h2>Media relations</h2>
<p>Journalists are <strong>gatekeepers</strong> to earned coverage. Media relations is the craft of giving them genuinely newsworthy material and being a reliable source.</p>
<h3>What makes something newsworthy?</h3>
<p>News values: <strong>timeliness, impact, proximity, prominence, conflict, novelty, human interest</strong>. If your story has none of these, no press release will save it.</p>
<h3>The core toolkit</h3>
<ul>
<li><strong>Press release</strong> — a ready-to-use news story (see Chapter 7 for how to write one).</li>
<li><strong>Media kit / press kit</strong> — a bundle: fact sheet, backgrounder, bios, high-res images/logos, key quotes, contact — everything a journalist needs to write the piece fast.</li>
<li><strong>Press conference</strong> — reserve it for genuinely big, complex news that many outlets want at once (a launch, a merger, a crisis). Calling one for trivial news burns credibility.</li>
<li><strong>Pitch</strong> — a short, personalized message proposing a story to <em>one specific</em> journalist whose beat it fits.</li>
</ul>
<div class="callout"><span class="badge">Golden rule</span> Build the relationship before you need it. Know each journalist's beat, respect deadlines, never lie, and make their job easier — that is what earns coverage next time.</div>`,
    `<span class="eyebrow">PRE203 · Chương 5 · Bài 5.1</span>
<h2>Quan hệ báo chí</h2>
<p>Nhà báo là <strong>người gác cổng (gatekeeper)</strong> của earned media. Quan hệ báo chí là nghệ thuật cung cấp cho họ chất liệu thật sự đáng đưa tin và là nguồn tin đáng tin cậy.</p>
<h3>Điều gì khiến một thứ "đáng đưa tin"?</h3>
<p>Giá trị tin (news values): <strong>tính thời sự, tác động, gần gũi, nhân vật nổi bật, xung đột, mới lạ, yếu tố con người</strong>. Nếu câu chuyện không có gì trong số này, không thông cáo nào cứu được.</p>
<h3>Bộ công cụ cốt lõi</h3>
<ul>
<li><strong>Thông cáo báo chí (press release)</strong> — một bản tin sẵn dùng (cách viết ở Chương 7).</li>
<li><strong>Media kit / press kit</strong> — một gói: fact sheet, backgrounder, tiểu sử, ảnh/logo độ phân giải cao, trích dẫn chính, đầu mối liên hệ — mọi thứ để nhà báo viết bài nhanh.</li>
<li><strong>Họp báo (press conference)</strong> — chỉ dùng cho tin thật sự lớn, phức tạp mà nhiều toà soạn cùng muốn (ra mắt, sáp nhập, khủng hoảng). Mở họp báo cho tin vặt là đốt uy tín.</li>
<li><strong>Pitch</strong> — thông điệp ngắn, cá nhân hoá, đề xuất câu chuyện tới <em>đúng một</em> nhà báo phù hợp mảng phụ trách.</li>
</ul>
<div class="callout"><span class="badge">Quy tắc vàng</span> Xây quan hệ trước khi cần đến. Hiểu mảng của từng nhà báo, tôn trọng deadline, không bao giờ nói dối, và làm công việc của họ dễ hơn — đó là thứ mang lại tin bài lần sau.</div>`,
  ]]);

const c5q = quiz('pre203-quiz-5', 'Quiz 5 — Media relations|||Quiz 5 — Quan hệ báo chí', [
  { id: 'q1', question: 'Trong quan hệ báo chí, nhà báo giữ vai trò?', options: ['Khách hàng trả tiền', 'Gatekeeper (người gác cổng) của earned media', 'Đối thủ cạnh tranh', 'Nhà tài trợ'], correctIndex: 1, explanation: 'Nhà báo quyết định tin nào được đăng → gatekeeper của earned media.' },
  { id: 'q2', question: 'Một "media kit" (press kit) KHÔNG thường bao gồm?', options: ['Fact sheet & backgrounder', 'Ảnh/logo độ phân giải cao', 'Hoá đơn thanh toán của khách hàng', 'Tiểu sử & trích dẫn chính'], correctIndex: 2, explanation: 'Media kit gồm tư liệu giúp nhà báo viết bài, không có hoá đơn khách hàng.' },
  { id: 'q3', question: 'Khi nào nên tổ chức họp báo (press conference)?', options: ['Với mọi thông cáo nhỏ', 'Chỉ khi có tin thật sự lớn/phức tạp mà nhiều báo cùng quan tâm', 'Khi không có tin gì để nói', 'Thay cho mọi press release'], correctIndex: 1, explanation: 'Họp báo dành cho tin lớn; lạm dụng cho tin vặt làm mất uy tín.' },
]);

const c6 = doc('pre203-6-1-tools-channels', '6.1 — PR tools & channels|||6.1 — Công cụ & kênh PR',
  'Mô hình PESO (paid/earned/shared/owned); owned & earned media; sự kiện; CSR & sponsorship; digital PR (influencer, SEO, mạng xã hội).',
  [[
    `<span class="eyebrow">PRE203 · Chapter 6 · Lesson 6.1</span>
<h2>PR tools &amp; channels</h2>
<h3>The PESO model</h3>
<p>Modern PR organizes every channel into four media types:</p>
<ul>
<li><strong>Paid</strong> — advertising, sponsored posts, boosted content.</li>
<li><strong>Earned</strong> — press coverage, reviews, word of mouth (classic PR).</li>
<li><strong>Shared</strong> — social media, communities, user-generated content.</li>
<li><strong>Owned</strong> — your website, blog, newsletter, brand channels you control.</li>
</ul>
<p>The best campaigns combine all four so they reinforce each other.</p>
<h3>Core tactics</h3>
<ul>
<li><strong>Events</strong> — launches, open days, conferences, trade shows: face-to-face experiences that generate coverage and relationships.</li>
<li><strong>CSR &amp; sponsorship</strong> — corporate social responsibility (community, environment, causes) builds reputation and goodwill — but only when it is authentic, not "greenwashing".</li>
<li><strong>Digital PR</strong> — influencer partnerships, social media, online newsrooms, and PR that also earns backlinks for SEO. Reach is huge, but so is the speed at which a mistake spreads.</li>
</ul>
<div class="callout"><span class="badge">Example</span> A shoe brand runs a beach clean-up (CSR event, owned + shared content), invites local media and micro-influencers (earned + shared), and boosts the best recap post (paid) — one story across all four PESO types.</div>`,
    `<span class="eyebrow">PRE203 · Chương 6 · Bài 6.1</span>
<h2>Công cụ &amp; kênh PR</h2>
<h3>Mô hình PESO</h3>
<p>PR hiện đại xếp mọi kênh vào bốn loại media:</p>
<ul>
<li><strong>Paid (trả tiền)</strong> — quảng cáo, bài tài trợ, đẩy nội dung.</li>
<li><strong>Earned (kiếm được)</strong> — tin bài báo chí, review, truyền miệng (PR cổ điển).</li>
<li><strong>Shared (chia sẻ)</strong> — mạng xã hội, cộng đồng, nội dung do người dùng tạo.</li>
<li><strong>Owned (sở hữu)</strong> — website, blog, newsletter, kênh thương hiệu bạn kiểm soát.</li>
</ul>
<p>Chiến dịch tốt nhất kết hợp cả bốn để chúng bổ trợ nhau.</p>
<h3>Các chiến thuật cốt lõi</h3>
<ul>
<li><strong>Sự kiện</strong> — ra mắt, ngày hội mở, hội nghị, hội chợ: trải nghiệm trực tiếp tạo tin bài và mối quan hệ.</li>
<li><strong>CSR &amp; tài trợ</strong> — trách nhiệm xã hội doanh nghiệp (cộng đồng, môi trường, mục tiêu xã hội) xây danh tiếng và thiện chí — nhưng chỉ khi chân thật, không phải "tẩy xanh" (greenwashing).</li>
<li><strong>Digital PR</strong> — hợp tác influencer, mạng xã hội, phòng tin trực tuyến, và PR mang cả backlink cho SEO. Độ phủ rất lớn, nhưng tốc độ lan của một sai lầm cũng vậy.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ</span> Một hãng giày tổ chức dọn rác bãi biển (sự kiện CSR, nội dung owned + shared), mời báo địa phương và micro-influencer (earned + shared), rồi đẩy bài tổng kết hay nhất (paid) — một câu chuyện trải khắp cả bốn loại PESO.</div>`,
  ]]);

const c6q = quiz('pre203-quiz-6', 'Quiz 6 — Tools & channels|||Quiz 6 — Công cụ & kênh', [
  { id: 'q1', question: 'Mô hình PESO gồm bốn loại media nào?', options: ['Print, Email, Social, Online', 'Paid, Earned, Shared, Owned', 'Public, Event, Sponsor, Online', 'Press, Editorial, SEO, Outreach'], correctIndex: 1, explanation: 'PESO: Paid, Earned, Shared, Owned.' },
  { id: 'q2', question: 'CSR (trách nhiệm xã hội doanh nghiệp) chỉ xây được danh tiếng khi?', options: ['Được quảng cáo rầm rộ nhất', 'Chân thật, không phải "greenwashing"', 'Chi nhiều tiền nhất', 'Do CEO đích thân làm'], correctIndex: 1, explanation: 'CSR giả tạo (greenwashing) bị phản tác dụng; phải chân thật.' },
  { id: 'q3', question: 'Website, blog và newsletter của thương hiệu thuộc loại media nào?', options: ['Paid', 'Earned', 'Shared', 'Owned'], correctIndex: 3, explanation: 'Kênh bạn sở hữu và kiểm soát = owned media.' },
]);

const c7 = doc('pre203-7-1-writing-for-pr', '7.1 — Writing for PR|||7.1 — Viết cho PR',
  'Thông cáo báo chí (kim tự tháp ngược, headline, dateline, lead 5W1H, boilerplate, ###); pitch email; newsletter; phong cách AP; giọng khách quan.',
  [[
    `<span class="eyebrow">PRE203 · Chapter 7 · Lesson 7.1</span>
<h2>Writing for PR</h2>
<h3>The press release — inverted pyramid</h3>
<p>Put the most important facts <em>first</em>; editors cut from the bottom. Structure:</p>
<ol>
<li><strong>Headline</strong> — clear, factual, not a slogan.</li>
<li><strong>Dateline &amp; lead</strong> — city/date, then a first paragraph answering the <strong>5W1H</strong> (who, what, when, where, why, how).</li>
<li><strong>Body</strong> — supporting detail and a human <strong>quote</strong> from a named spokesperson.</li>
<li><strong>Boilerplate</strong> — a short standard paragraph about the organization.</li>
<li><strong>Contact info</strong>, then <strong>###</strong> to mark the end.</li>
</ol>
<pre><code>FOR IMMEDIATE RELEASE
Headline in Title Case
HANOI, Sept 13 - Lead paragraph (who/what/when/where/why)...
"Quote from a named spokesperson," said Jane Do, CEO.
About [Company]: one-paragraph boilerplate.
Media contact: name, email, phone
###
</code></pre>
<h3>Other formats</h3>
<ul>
<li><strong>Pitch email</strong> — 3-5 sentences, personalized, a clear news angle for that journalist; not a press release pasted in.</li>
<li><strong>Newsletter</strong> — owned channel; conversational, useful, consistent cadence.</li>
</ul>
<div class="callout"><span class="badge">Style</span> Use a neutral, third-person, factual voice (many newsrooms follow <strong>AP style</strong>). Avoid hype adjectives ("revolutionary", "world-class") — let the facts and the quote carry it.</div>`,
    `<span class="eyebrow">PRE203 · Chương 7 · Bài 7.1</span>
<h2>Viết cho PR</h2>
<h3>Thông cáo báo chí — kim tự tháp ngược</h3>
<p>Đặt thông tin quan trọng nhất lên <em>đầu</em>; biên tập viên cắt từ dưới lên. Cấu trúc:</p>
<ol>
<li><strong>Headline (tít)</strong> — rõ ràng, dựa trên sự thật, không phải khẩu hiệu.</li>
<li><strong>Dateline &amp; lead</strong> — thành phố/ngày, rồi đoạn đầu trả lời <strong>5W1H</strong> (ai, cái gì, khi nào, ở đâu, tại sao, thế nào).</li>
<li><strong>Body (thân)</strong> — chi tiết hỗ trợ và một <strong>trích dẫn</strong> con người từ người phát ngôn có tên.</li>
<li><strong>Boilerplate</strong> — đoạn giới thiệu chuẩn ngắn về tổ chức.</li>
<li><strong>Đầu mối liên hệ</strong>, rồi <strong>###</strong> đánh dấu kết thúc.</li>
</ol>
<pre><code>FOR IMMEDIATE RELEASE (Phát hành ngay)
Tít viết hoa đầu từ
HA NOI, 13 thg 9 - Đoạn lead (ai/gì/khi nào/ở đâu/tại sao)...
"Trích dẫn của người phát ngôn có tên," ba Jane Do, CEO, noi.
Ve [Cong ty]: boilerplate một đoạn.
Lien he bao chi: ten, email, dien thoai
###
</code></pre>
<h3>Các định dạng khác</h3>
<ul>
<li><strong>Pitch email</strong> — 3-5 câu, cá nhân hoá, một góc tin rõ cho đúng nhà báo đó; không phải dán nguyên thông cáo vào.</li>
<li><strong>Newsletter</strong> — kênh owned; giọng gần gũi, hữu ích, nhịp đều đặn.</li>
</ul>
<div class="callout"><span class="badge">Phong cách</span> Dùng giọng trung lập, ngôi thứ ba, dựa trên sự thật (nhiều toà soạn theo <strong>AP style</strong>). Tránh tính từ thổi phồng ("cách mạng", "đẳng cấp thế giới") — để sự thật và trích dẫn tự nói.</div>`,
  ]]);

const c7q = quiz('pre203-quiz-7', 'Quiz 7 — Writing for PR|||Quiz 7 — Viết cho PR', [
  { id: 'q1', question: 'Cấu trúc "kim tự tháp ngược" của thông cáo báo chí nghĩa là?', options: ['Kết luận đặt cuối cùng', 'Thông tin quan trọng nhất đặt lên đầu', 'Viết theo trình tự thời gian', 'Trích dẫn đặt trước tít'], correctIndex: 1, explanation: 'Quan trọng nhất lên đầu vì biên tập cắt từ dưới lên.' },
  { id: 'q2', question: 'Đoạn "lead" của thông cáo cần trả lời?', options: ['Chỉ giá sản phẩm', '5W1H: ai, cái gì, khi nào, ở đâu, tại sao, thế nào', 'Lịch sử toàn bộ công ty', 'Ý kiến cá nhân người viết'], correctIndex: 1, explanation: 'Lead tóm tắt 5W1H để nhà báo nắm ngay cốt lõi.' },
  { id: 'q3', question: '"Boilerplate" trong thông cáo báo chí là?', options: ['Ký hiệu ### kết thúc', 'Đoạn giới thiệu chuẩn ngắn về tổ chức', 'Tiêu đề chính', 'Danh sách nhà báo nhận tin'], correctIndex: 1, explanation: 'Boilerplate: đoạn "About the company" chuẩn ở cuối.' },
]);

const c8 = doc('pre203-8-1-measurement-ethics', '8.1 — Measurement & ethics|||8.1 — Đo lường & đạo đức',
  'Từ AVE (Advertising Value Equivalency) sang outcomes; Nguyên tắc Barcelona; output vs outcome vs outtake; đo theo PESO; PRSA Code of Ethics; khủng hoảng.',
  [[
    `<span class="eyebrow">PRE203 · Chapter 8 · Lesson 8.1</span>
<h2>Measurement &amp; ethics</h2>
<h3>From AVE to outcomes</h3>
<p><strong>AVE (Advertising Value Equivalency)</strong> — pricing coverage as "what the space would have cost as an ad" — is now <strong>discredited</strong>. It measures publicity volume, not whether anyone changed their mind. Modern practice measures the funnel:</p>
<ul>
<li><strong>Outputs</strong> — what you produced (releases sent, articles placed, reach).</li>
<li><strong>Outtakes</strong> — did the audience notice, understand, recall the message?</li>
<li><strong>Outcomes</strong> — did attitude, awareness or behavior actually change? (the real goal)</li>
</ul>
<h3>The Barcelona Principles (AMEC)</h3>
<p>The industry standard for measurement: set measurable goals; measure <strong>outcomes not just outputs</strong>; <strong>AVEs are not the value of PR</strong>; measure quality not only quantity; measurement should be transparent, consistent and valid. Tie every campaign to <em>business results</em>, not clip counts.</p>
<h3>Ethics</h3>
<p>The <strong>PRSA Code of Ethics</strong> rests on honesty, expertise, independence, loyalty and fairness. Core rules: <strong>never lie</strong> or mislead, disclose who you represent, protect confidential information, avoid conflicts of interest. In a <strong>crisis</strong>, the ethical playbook is: be prompt, be honest, take responsibility, and never cover up — the cover-up almost always does more damage than the original problem.</p>
<div class="callout"><span class="badge">Example</span> Johnson &amp; Johnson's 1982 Tylenol response — a fast, transparent, public-safety-first recall — is the classic case of ethics <em>and</em> good crisis PR protecting a brand.</div>`,
    `<span class="eyebrow">PRE203 · Chương 8 · Bài 8.1</span>
<h2>Đo lường &amp; đạo đức</h2>
<h3>Từ AVE sang outcomes</h3>
<p><strong>AVE (Advertising Value Equivalency)</strong> — quy tin bài thành "chỗ đó đáng bao nhiêu tiền quảng cáo" — nay đã bị <strong>bác bỏ</strong>. Nó đo khối lượng publicity, không đo việc có ai đổi suy nghĩ hay không. Thực hành hiện đại đo theo phễu:</p>
<ul>
<li><strong>Outputs</strong> — thứ bạn tạo ra (thông cáo gửi đi, bài được đăng, độ phủ).</li>
<li><strong>Outtakes</strong> — công chúng có chú ý, hiểu, nhớ thông điệp không?</li>
<li><strong>Outcomes</strong> — thái độ, nhận biết hay hành vi có thật sự thay đổi không? (mục tiêu thật)</li>
</ul>
<h3>Nguyên tắc Barcelona (AMEC)</h3>
<p>Chuẩn đo lường của ngành: đặt mục tiêu đo được; đo <strong>outcomes chứ không chỉ outputs</strong>; <strong>AVE không phải giá trị của PR</strong>; đo cả chất chứ không chỉ lượng; đo lường phải minh bạch, nhất quán và hợp lệ. Gắn mọi chiến dịch với <em>kết quả kinh doanh</em>, không phải đếm số bài.</p>
<h3>Đạo đức</h3>
<p><strong>Bộ quy tắc đạo đức PRSA</strong> dựa trên trung thực, chuyên môn, độc lập, trung thành và công bằng. Quy tắc cốt lõi: <strong>không nói dối</strong> hay đánh lừa, công khai mình đại diện cho ai, bảo vệ thông tin mật, tránh xung đột lợi ích. Trong <strong>khủng hoảng</strong>, kịch bản đạo đức là: nhanh, trung thực, nhận trách nhiệm, và không bao giờ che giấu — việc che giấu gần như luôn gây hại nhiều hơn bản thân sự cố.</p>
<div class="callout"><span class="badge">Ví dụ</span> Cách Johnson &amp; Johnson xử lý vụ Tylenol 1982 — thu hồi nhanh, minh bạch, đặt an toàn công chúng lên đầu — là ca kinh điển về đạo đức <em>và</em> PR khủng hoảng tốt bảo vệ thương hiệu.</div>`,
  ]]);

const c8q = quiz('pre203-quiz-8', 'Quiz 8 — Measurement & ethics|||Quiz 8 — Đo lường & đạo đức', [
  { id: 'q1', question: 'Vì sao AVE (Advertising Value Equivalency) bị ngành PR bác bỏ?', options: ['Vì tính toán quá phức tạp', 'Vì đo khối lượng publicity, không đo có ai đổi suy nghĩ (outcome) hay không', 'Vì chỉ dùng được cho quảng cáo', 'Vì luôn cho số quá thấp'], correctIndex: 1, explanation: 'AVE đo output/độ phủ, không đo outcome — Barcelona Principles bác bỏ.' },
  { id: 'q2', question: 'Trong đo lường PR, "outcome" nghĩa là?', options: ['Số thông cáo đã gửi', 'Độ phủ (reach) của bài báo', 'Thay đổi thật về nhận biết/thái độ/hành vi của công chúng', 'Số nhà báo trong danh sách'], correctIndex: 2, explanation: 'Outcome = thay đổi thật; output là thứ tạo ra, outtake là ghi nhận.' },
  { id: 'q3', question: 'Nguyên tắc đạo đức cốt lõi khi xử lý khủng hoảng là?', options: ['Im lặng cho tới khi mọi việc lắng xuống', 'Nhanh, trung thực, nhận trách nhiệm, không che giấu', 'Đổ lỗi cho bên thứ ba', 'Chỉ phát ngôn qua quảng cáo trả tiền'], correctIndex: 1, explanation: 'Che giấu thường gây hại hơn sự cố gốc; minh bạch bảo vệ danh tiếng.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'PRE203',
    slug: 'pre203-introduction-to-public-relations',
    title: 'Introduction to Public Relations',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PRE203.webp',
    shortDescription: 'What PR is & how it works — vs marketing/advertising, Grunig models, the RACE/ROPE process, publics & stakeholders, media relations, PESO tools, PR writing, measurement & ethics. Bilingual, real examples & quizzes.|||PR là gì & vận hành thế nào — khác marketing/quảng cáo, mô hình Grunig, quy trình RACE/ROPE, công chúng & stakeholder, quan hệ báo chí, công cụ PESO, viết PR, đo lường & đạo đức. Song ngữ, ví dụ thật & quiz.',
    description: 'Môn <strong>PRE203 — Introduction to Public Relations</strong> (kỳ 4, ngành Công nghệ Truyền thông) giúp hiểu <strong>PR là gì và vận hành thế nào</strong>. Từ <strong>định nghĩa &amp; lịch sử</strong> (khác marketing/quảng cáo, Ivy Lee, Bernays) → <strong>lý thuyết &amp; mô hình</strong> (bốn mô hình Grunig, hai chiều đối xứng) → <strong>quy trình PR</strong> (RACE/ROPE) → <strong>công chúng &amp; stakeholder</strong> → <strong>quan hệ báo chí</strong> → <strong>công cụ &amp; kênh (PESO)</strong> → <strong>viết cho PR</strong> → <strong>đo lường &amp; đạo đức</strong>. Bám giáo trình chuẩn quốc tế (Cutlip &amp; Center, Wilcox, Grunig), song ngữ, có ví dụ thật và quiz mỗi chương.',
    whatYouLearn: 'PR là gì (earned vs paid, khác marketing); lịch sử (Ivy Lee, Bernays); bốn mô hình Grunig & hai chiều đối xứng; công chúng (latent/aware/active); quy trình RACE/ROPE & mục tiêu SMART; mapping stakeholder (power/interest); quan hệ báo chí (news value, press kit, họp báo, pitch); mô hình PESO, sự kiện, CSR, digital PR; viết thông cáo (kim tự tháp ngược, 5W1H, boilerplate); đo lường (output/outcome, Nguyên tắc Barcelona) & đạo đức (PRSA, khủng hoảng).',
    requirements: 'Không cần kiến thức nền chuyên ngành. Nên đọc tin tức & quan sát cách các thương hiệu, tổ chức truyền thông trong thực tế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách chuẩn (Cutlip & Center, Wilcox, Grunig), hiệp hội nghề (PRSA/IPRA/AMEC), công cụ ngành, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'PR quản trị danh tiếng & quan hệ; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — PR là gì|||Chapter 1 — What is PR', description: 'Định nghĩa, khác marketing/quảng cáo, lịch sử (Ivy Lee, Bernays).', lessons: [c1, c1q] },
    { title: 'Chương 2 — Lý thuyết & mô hình|||Chapter 2 — Theory & models', description: 'Bốn mô hình Grunig, hai chiều đối xứng, publics.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Quy trình PR|||Chapter 3 — PR process', description: 'RACE/ROPE: research, objectives, programming, evaluation.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Công chúng & stakeholder|||Chapter 4 — Publics & stakeholders', description: 'Mapping power/interest, phân khúc, công chúng tình huống.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Quan hệ báo chí|||Chapter 5 — Media relations', description: 'News value, thông cáo, press kit, họp báo, pitch.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Công cụ & kênh|||Chapter 6 — Tools & channels', description: 'PESO, owned/earned, sự kiện, CSR, digital PR.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Viết cho PR|||Chapter 7 — Writing for PR', description: 'Kim tự tháp ngược, 5W1H, boilerplate, pitch, AP style.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường & đạo đức|||Chapter 8 — Measurement & ethics', description: 'Output/outcome, Barcelona Principles, PRSA ethics, khủng hoảng.', lessons: [c8, c8q] },
  ],
};
