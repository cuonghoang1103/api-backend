/**
 * DET101c — Design Thinking (Tư duy thiết kế). Khối Công nghệ Truyền thông FPTU,
 * Kỳ 2. FULL KHUNG song ngữ theo giáo trình chuẩn quốc tế: IDEO/Stanford d.school
 * (5 giai đoạn Empathize→Define→Ideate→Prototype→Test), Tim Brown "Change by
 * Design", IDEO Field Guide to HCD, Norman "The Design of Everyday Things".
 * 8 chương + giới thiệu + tài liệu; mỗi chương 1 DOCUMENT + 1 QUIZ 3 câu.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('det101c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách kinh điển (Tim Brown, Norman), IDEO Field Guide/IDEO U, d.school, công cụ (Miro/Figma), lộ trình 4 bước.',
  [[
    `<span class="eyebrow">DET101c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to learn <strong>Design Thinking</strong> — the human-centered, five-stage approach to innovation used at IDEO and Stanford d.school — gathered in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal, world-class resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for DET101c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Core books</h3>
<ul>
<li><a href="https://www.ideo.com/journal/change-by-design" target="_blank" rel="noopener">Tim Brown — <em>Change by Design</em></a> (IDEO CEO; the classic on design thinking for business)</li>
<li><a href="https://www.nngroup.com/books/design-everyday-things-revised/" target="_blank" rel="noopener">Don Norman — <em>The Design of Everyday Things</em></a> (affordances, signifiers, human-centered design)</li>
<li><a href="https://www.designkit.org/resources/1" target="_blank" rel="noopener">IDEO.org — <em>The Field Guide to Human-Centered Design</em></a> (free PDF, 57 methods)</li>
</ul>
<h3>🌐 Free courses &amp; toolkits</h3>
<ul>
<li><a href="https://dschool.stanford.edu/resources" target="_blank" rel="noopener">Stanford d.school — Resources &amp; the "bootcamp bootleg"</a></li>
<li><a href="https://www.ideou.com/pages/design-thinking" target="_blank" rel="noopener">IDEO U — Design Thinking guide</a></li>
<li><a href="https://www.interaction-design.org/literature/topics/design-thinking" target="_blank" rel="noopener">Interaction Design Foundation — Design Thinking</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — online whiteboard for empathy maps, journey maps &amp; sticky notes</li>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma / FigJam</a> — wireframes, prototypes &amp; collaborative workshops</li>
<li><a href="https://www.sessionlab.com/library/design-thinking" target="_blank" rel="noopener">SessionLab — workshop &amp; facilitation library</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Mindset</strong> — what design thinking is, human-centered design, the five stages &amp; the double diamond.</li>
<li><strong>Discover</strong> — Empathize (interview, observe, empathy map) then Define (point of view, insight, how-might-we).</li>
<li><strong>Create</strong> — Ideate (brainstorm, SCAMPER), Prototype (low/high fidelity), Test (usability, iterate).</li>
<li><strong>Apply</strong> — run a real design sprint on a communication campaign or digital product.</li>
</ol></div>`,
    `<span class="eyebrow">DET101c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Tư duy thiết kế</strong> — phương pháp đổi mới lấy con người làm trung tâm, năm giai đoạn, do IDEO và Stanford d.school dùng — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, hàng đầu thế giới.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DET101c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><a href="https://www.ideo.com/journal/change-by-design" target="_blank" rel="noopener">Tim Brown — <em>Change by Design</em></a> (CEO IDEO; sách kinh điển về tư duy thiết kế trong kinh doanh)</li>
<li><a href="https://www.nngroup.com/books/design-everyday-things-revised/" target="_blank" rel="noopener">Don Norman — <em>The Design of Everyday Things</em></a> (affordance, signifier, thiết kế lấy con người làm trung tâm)</li>
<li><a href="https://www.designkit.org/resources/1" target="_blank" rel="noopener">IDEO.org — <em>Field Guide to Human-Centered Design</em></a> (PDF miễn phí, 57 phương pháp)</li>
</ul>
<h3>🌐 Khoá học &amp; bộ công cụ miễn phí</h3>
<ul>
<li><a href="https://dschool.stanford.edu/resources" target="_blank" rel="noopener">Stanford d.school — Tài nguyên &amp; "bootcamp bootleg"</a></li>
<li><a href="https://www.ideou.com/pages/design-thinking" target="_blank" rel="noopener">IDEO U — Hướng dẫn Design Thinking</a></li>
<li><a href="https://www.interaction-design.org/literature/topics/design-thinking" target="_blank" rel="noopener">Interaction Design Foundation — Design Thinking</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — bảng trắng online cho empathy map, journey map &amp; sticky note</li>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma / FigJam</a> — wireframe, prototype &amp; workshop cộng tác</li>
<li><a href="https://www.sessionlab.com/library/design-thinking" target="_blank" rel="noopener">SessionLab — thư viện workshop &amp; điều phối</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Tư duy</strong> — design thinking là gì, thiết kế lấy con người làm trung tâm, năm giai đoạn &amp; double diamond.</li>
<li><strong>Khám phá</strong> — Đồng cảm (phỏng vấn, quan sát, empathy map) rồi Xác định (point of view, insight, how-might-we).</li>
<li><strong>Sáng tạo</strong> — Lên ý tưởng (brainstorm, SCAMPER), Tạo mẫu (low/high fidelity), Kiểm thử (usability, lặp).</li>
<li><strong>Ứng dụng</strong> — chạy một design sprint thật cho chiến dịch truyền thông hoặc sản phẩm số.</li>
</ol></div>`,
  ]]);

const intro = doc('det101c-0-1-overview', 'Course overview: Design Thinking|||Tổng quan: Tư duy thiết kế',
  'Design thinking là gì, vì sao ngành truyền thông cần nó; 5 giai đoạn d.school; lộ trình môn: đồng cảm → xác định → ý tưởng → tạo mẫu → kiểm thử → công cụ nhóm → ứng dụng.',
  [[
    `<span class="eyebrow">DET101c · Lesson 0.1 · Overview</span>
<h2>What is Design Thinking?</h2>
<p class="lead"><strong>Design thinking</strong> is a <strong>human-centered</strong> approach to innovation: you start from the real needs of real people, not from your own assumptions or the technology you happen to have. Popularized by <strong>IDEO</strong> and the <strong>Stanford d.school</strong>, it turns fuzzy problems into desirable, feasible, viable solutions.</p>
<h3>The five stages (d.school)</h3>
<ul>
<li><strong>Empathize</strong> — understand people through observation and interviews.</li>
<li><strong>Define</strong> — frame the right problem as a clear point of view.</li>
<li><strong>Ideate</strong> — generate many possible solutions.</li>
<li><strong>Prototype</strong> — make ideas tangible, cheaply and fast.</li>
<li><strong>Test</strong> — put prototypes in front of users and learn.</li>
</ul>
<p>The stages are <strong>not a straight line</strong> — you loop back constantly. A test result often sends you back to redefine the problem or empathize more deeply.</p>
<h3>Why communication students need it</h3>
<p>Great campaigns, products and services all start with the same question: <em>what does the audience actually need and feel?</em> Design thinking gives you a repeatable method to answer it — and to prototype and test a message before you spend the budget.</p>
<div class="callout"><span class="badge">Roadmap</span> Mindset → Empathize → Define → Ideate → Prototype → Test → tools &amp; teamwork → applying it to media &amp; innovation. Bilingual, with real IDEO/Airbnb/GE cases and a quiz each chapter.</div>`,
    `<span class="eyebrow">DET101c · Bài 0.1 · Tổng quan</span>
<h2>Tư duy thiết kế là gì?</h2>
<p class="lead"><strong>Tư duy thiết kế (design thinking)</strong> là cách tiếp cận đổi mới <strong>lấy con người làm trung tâm</strong>: bạn bắt đầu từ nhu cầu thật của người thật, không phải từ giả định của mình hay công nghệ sẵn có. Được <strong>IDEO</strong> và <strong>Stanford d.school</strong> phổ biến, nó biến vấn đề mơ hồ thành giải pháp vừa đáng mong muốn, khả thi, vừa bền vững.</p>
<h3>Năm giai đoạn (d.school)</h3>
<ul>
<li><strong>Đồng cảm (Empathize)</strong> — hiểu con người qua quan sát và phỏng vấn.</li>
<li><strong>Xác định (Define)</strong> — đóng khung đúng vấn đề thành một góc nhìn rõ ràng.</li>
<li><strong>Lên ý tưởng (Ideate)</strong> — tạo ra thật nhiều giải pháp khả dĩ.</li>
<li><strong>Tạo mẫu (Prototype)</strong> — biến ý tưởng thành thứ sờ được, rẻ và nhanh.</li>
<li><strong>Kiểm thử (Test)</strong> — đưa mẫu cho người dùng và học từ họ.</li>
</ul>
<p>Các giai đoạn <strong>không phải đường thẳng</strong> — bạn liên tục quay lại. Một kết quả kiểm thử thường đẩy bạn về xác định lại vấn đề hoặc đồng cảm sâu hơn.</p>
<h3>Vì sao sinh viên truyền thông cần nó</h3>
<p>Chiến dịch, sản phẩm và dịch vụ hay đều bắt đầu từ cùng một câu hỏi: <em>công chúng thật sự cần gì và cảm thấy gì?</em> Tư duy thiết kế cho bạn một phương pháp lặp lại được để trả lời — và để tạo mẫu, kiểm thử một thông điệp trước khi tiêu ngân sách.</p>
<div class="callout"><span class="badge">Lộ trình</span> Tư duy → Đồng cảm → Xác định → Ý tưởng → Tạo mẫu → Kiểm thử → công cụ &amp; nhóm → ứng dụng vào truyền thông &amp; đổi mới. Song ngữ, có case IDEO/Airbnb/GE thật và quiz mỗi chương.</div>`,
  ]]);

const c1 = doc('det101c-1-1-what-is-dt', '1.1 — What design thinking is|||1.1 — Tư duy thiết kế là gì',
  'Human-centered design, 3 thấu kính desirability/feasibility/viability, 5 giai đoạn d.school, mindset (đồng cảm, chấp nhận thất bại, học bằng làm); case IDEO shopping cart.',
  [[
    `<span class="eyebrow">DET101c · Chapter 1 · Lesson 1.1</span>
<h2>What design thinking is</h2>
<h3>Human-centered design</h3>
<p><strong>Design thinking</strong> is problem solving that begins with people. IDEO frames every project around three overlapping lenses — a good solution sits where they meet:</p>
<ul>
<li><strong>Desirability</strong> — do people actually want this? (human lens)</li>
<li><strong>Feasibility</strong> — can we build it? (technical lens)</li>
<li><strong>Viability</strong> — can it sustain itself? (business lens)</li>
</ul>
<h3>The mindset matters more than the steps</h3>
<ul>
<li><strong>Empathy first</strong> — design for others, not for yourself.</li>
<li><strong>Bias toward action</strong> — build to think; a rough prototype beats a long debate.</li>
<li><strong>Embrace failure</strong> — fail early and cheaply to succeed sooner.</li>
<li><strong>Radical collaboration</strong> — diverse teams see more of the problem.</li>
</ul>
<pre><code>The five stages loop, not march:
  Empathize -> Define -> Ideate -> Prototype -> Test
             ^______________ iterate ______________|
</code></pre>
<div class="callout"><span class="badge">Case: IDEO shopping cart</span> On a 1999 ABC Nightline challenge, IDEO redesigned the shopping cart in five days — observing shoppers, generating wild ideas, building a rough prototype, testing it. It became the textbook demo of the whole process.</div>`,
    `<span class="eyebrow">DET101c · Chương 1 · Bài 1.1</span>
<h2>Tư duy thiết kế là gì</h2>
<h3>Thiết kế lấy con người làm trung tâm</h3>
<p><strong>Tư duy thiết kế</strong> là cách giải quyết vấn đề bắt đầu từ con người. IDEO đóng khung mọi dự án quanh ba thấu kính giao nhau — giải pháp tốt nằm ở chỗ chúng gặp nhau:</p>
<ul>
<li><strong>Đáng mong muốn (desirability)</strong> — người ta có thật sự muốn không? (thấu kính con người)</li>
<li><strong>Khả thi (feasibility)</strong> — ta có làm được không? (thấu kính kỹ thuật)</li>
<li><strong>Bền vững (viability)</strong> — nó tự nuôi được không? (thấu kính kinh doanh)</li>
</ul>
<h3>Tư duy (mindset) quan trọng hơn các bước</h3>
<ul>
<li><strong>Đồng cảm trước</strong> — thiết kế cho người khác, không phải cho mình.</li>
<li><strong>Thiên về hành động</strong> — làm để nghĩ; một mẫu thô hơn cả buổi tranh luận dài.</li>
<li><strong>Chấp nhận thất bại</strong> — thất bại sớm và rẻ để thành công sớm hơn.</li>
<li><strong>Cộng tác triệt để</strong> — nhóm đa dạng nhìn được nhiều mặt của vấn đề hơn.</li>
</ul>
<pre><code>Năm giai đoạn LẶP, không đi thẳng:
  Đồng cảm -> Xác định -> Ý tưởng -> Tạo mẫu -> Kiểm thử
            ^________________ lặp ________________|
</code></pre>
<div class="callout"><span class="badge">Case: xe đẩy IDEO</span> Trong thử thách ABC Nightline năm 1999, IDEO thiết kế lại xe đẩy siêu thị trong năm ngày — quan sát người mua, tung ý tưởng táo bạo, dựng mẫu thô, kiểm thử. Nó thành ví dụ kinh điển cho cả quy trình.</div>`,
  ]]);

const c1q = quiz('det101c-quiz-1', 'Quiz 1 — What design thinking is|||Quiz 1 — Tư duy thiết kế là gì', [
  { id: 'q1', question: 'Điểm khởi đầu của tư duy thiết kế là?|||What does design thinking start from?', options: ['Công nghệ có sẵn|||Available technology', 'Nhu cầu thật của con người|||Real human needs', 'Ngân sách|||The budget', 'Giả định của nhà thiết kế|||The designer\'s assumptions'], correctIndex: 1, explanation: 'Design thinking lấy con người làm trung tâm — bắt đầu từ nhu cầu người dùng.' },
  { id: 'q2', question: 'Ba thấu kính của IDEO cho một giải pháp tốt?|||IDEO\'s three lenses for a good solution?', options: ['Rẻ, nhanh, đẹp|||Cheap, fast, pretty', 'Đáng mong muốn, khả thi, bền vững|||Desirability, feasibility, viability', 'Đồng cảm, ý tưởng, kiểm thử|||Empathize, ideate, test', 'Nghe, nhìn, chạm|||Hear, see, touch'], correctIndex: 1, explanation: 'Desirability (con người) + Feasibility (kỹ thuật) + Viability (kinh doanh).' },
  { id: 'q3', question: 'Năm giai đoạn của d.school diễn ra thế nào?|||How do the five d.school stages proceed?', options: ['Một đường thẳng, không quay lại|||A straight line, no going back', 'Lặp — thường quay lại giai đoạn trước|||They loop — you often go back', 'Ngẫu nhiên không thứ tự|||Random, no order', 'Chỉ làm một lần duy nhất|||Only once, ever'], correctIndex: 1, explanation: 'Các giai đoạn lặp; kết quả kiểm thử có thể đẩy về đồng cảm/xác định lại.' },
]);

const c2 = doc('det101c-2-1-empathize', '2.1 — Empathize: user research|||2.1 — Đồng cảm: nghiên cứu người dùng',
  'Nghiên cứu người dùng, phỏng vấn sâu (5 whys, câu hỏi mở), quan sát (shadowing, fly-on-the-wall), empathy map (Says/Thinks/Does/Feels); case Airbnb "đi đến tận nhà".',
  [[
    `<span class="eyebrow">DET101c · Chapter 2 · Lesson 2.1</span>
<h2>Empathize — understand real people</h2>
<p>You cannot design for people you do not understand. The <strong>Empathize</strong> stage is field research: you set aside your assumptions and learn how users actually think, feel and behave.</p>
<h3>Three ways to gather empathy</h3>
<ul>
<li><strong>Interview</strong> — open questions, not yes/no. Ask "why" repeatedly (the <strong>5 Whys</strong>) to reach the real motive. Listen far more than you talk.</li>
<li><strong>Observe</strong> — watch people in their real context (<em>shadowing</em>, <em>fly-on-the-wall</em>). What people <em>do</em> often differs from what they <em>say</em>.</li>
<li><strong>Immerse</strong> — experience the situation yourself to feel the friction firsthand.</li>
</ul>
<h3>The empathy map</h3>
<pre><code>Four quadrants around the user:
  SAYS   | THINKS
  -------+-------
  DOES   | FEELS
Gaps between quadrants (says one thing, does another) = insight.
</code></pre>
<div class="callout"><span class="badge">Case: Airbnb</span> Early on, Airbnb was nearly dead. The founders left their desks and went door to door to hosts in New York, photographed listings, and listened. That immersion revealed the fix (better photos, trust) that saved the company — empathy as a business rescue.</div>`,
    `<span class="eyebrow">DET101c · Chương 2 · Bài 2.1</span>
<h2>Đồng cảm — hiểu con người thật</h2>
<p>Bạn không thể thiết kế cho người mình không hiểu. Giai đoạn <strong>Đồng cảm</strong> là nghiên cứu thực địa: gạt giả định sang một bên và tìm hiểu người dùng thật sự nghĩ, cảm và hành xử ra sao.</p>
<h3>Ba cách thu thập sự đồng cảm</h3>
<ul>
<li><strong>Phỏng vấn</strong> — câu hỏi mở, không có/không. Hỏi "vì sao" nhiều lần (<strong>5 Whys</strong>) để chạm động cơ thật. Lắng nghe nhiều hơn nói.</li>
<li><strong>Quan sát</strong> — nhìn người dùng trong bối cảnh thật (<em>shadowing</em>, <em>fly-on-the-wall</em>). Điều người ta <em>làm</em> thường khác điều họ <em>nói</em>.</li>
<li><strong>Nhập vai</strong> — tự trải nghiệm tình huống để cảm nhận điểm khó tận nơi.</li>
</ul>
<h3>Bản đồ đồng cảm (empathy map)</h3>
<pre><code>Bốn ô quanh người dùng:
  NÓI    | NGHĨ
  -------+-------
  LÀM    | CẢM
Khoảng lệch giữa các ô (nói một đằng, làm một nẻo) = insight.
</code></pre>
<div class="callout"><span class="badge">Case: Airbnb</span> Thời đầu Airbnb suýt chết. Nhà sáng lập rời bàn làm việc, gõ cửa từng chủ nhà ở New York, chụp lại tin đăng và lắng nghe. Sự nhập vai đó lộ ra cách sửa (ảnh đẹp hơn, niềm tin) đã cứu công ty — đồng cảm như một cuộc giải cứu kinh doanh.</div>`,
  ]]);

const c2q = quiz('det101c-quiz-2', 'Quiz 2 — Empathize|||Quiz 2 — Đồng cảm', [
  { id: 'q1', question: 'Kỹ thuật hỏi "vì sao" nhiều lần để chạm động cơ thật gọi là?|||The technique of repeatedly asking "why" to reach the real motive?', options: ['5 Whys', 'SCAMPER', 'A/B testing', 'Double diamond'], correctIndex: 0, explanation: '5 Whys: hỏi "vì sao" liên tiếp để đào tới nguyên nhân/động cơ gốc.' },
  { id: 'q2', question: 'Bốn ô của empathy map là?|||The four quadrants of an empathy map?', options: ['Điểm mạnh/yếu/cơ hội/thách thức|||Strengths/weaknesses/opportunities/threats', 'Nói / Nghĩ / Làm / Cảm|||Says / Thinks / Does / Feels', 'Ai/Gì/Khi/Ở đâu|||Who/What/When/Where', 'Rẻ/Nhanh/Tốt/Đẹp|||Cheap/Fast/Good/Nice'], correctIndex: 1, explanation: 'Empathy map: Says, Thinks, Does, Feels — khe hở giữa chúng là insight.' },
  { id: 'q3', question: 'Vì sao chỉ phỏng vấn thôi là chưa đủ, phải quan sát nữa?|||Why is interviewing alone not enough — why also observe?', options: ['Quan sát nhanh hơn|||Observation is faster', 'Điều người ta LÀM thường khác điều họ NÓI|||What people DO often differs from what they SAY', 'Để tiết kiệm tiền|||To save money', 'Vì phỏng vấn bị cấm|||Interviews are forbidden'], correctIndex: 1, explanation: 'Hành vi thật (quan sát) thường lệch lời tự thuật (phỏng vấn).' },
]);

const c3 = doc('det101c-3-1-define', '3.1 — Define: frame the problem|||3.1 — Xác định: đóng khung vấn đề',
  'Tổng hợp dữ liệu thành insight, point of view (User + Need + Insight), how-might-we (HMW), persona; tránh nhảy sang giải pháp; case GE Adventure MRI.',
  [[
    `<span class="eyebrow">DET101c · Chapter 3 · Lesson 3.1</span>
<h2>Define — frame the right problem</h2>
<p>Research gives you a pile of notes; <strong>Define</strong> turns it into one sharp problem statement. Solving the wrong problem beautifully is still failure — so this stage decides everything downstream.</p>
<h3>From data to insight</h3>
<p>Cluster your observations, look for surprises and gaps, and distill a <strong>insight</strong> — a non-obvious truth about the user. Then write a <strong>Point of View (POV)</strong>:</p>
<pre><code>POV = [USER] needs [NEED] because [surprising INSIGHT]
e.g. A first-time patient needs to feel safe during a scan
     because the machine feels frightening, not the illness.
</code></pre>
<h3>How-Might-We (HMW)</h3>
<p>Reframe the POV as open questions that invite ideas: <em>"How might we make the scan feel like an adventure?"</em> Good HMWs are broad enough for many solutions but narrow enough to focus. A <strong>persona</strong> keeps a real user in view.</p>
<div class="callout"><span class="badge">Case: GE Adventure Series MRI</span> Designer Doug Dietz saw children terrified of MRI machines. Redefining the problem — not "improve the scanner" but "reduce a child's fear" — led to painting scan rooms as pirate ships and jungles. Sedation rates dropped and patient satisfaction jumped: same machine, reframed problem.</div>`,
    `<span class="eyebrow">DET101c · Chương 3 · Bài 3.1</span>
<h2>Xác định — đóng khung đúng vấn đề</h2>
<p>Nghiên cứu cho bạn một đống ghi chép; <strong>Xác định</strong> biến nó thành một phát biểu vấn đề sắc bén. Giải hay một vấn đề sai vẫn là thất bại — nên giai đoạn này quyết định mọi thứ phía sau.</p>
<h3>Từ dữ liệu tới insight</h3>
<p>Gom nhóm các quan sát, tìm điều bất ngờ và khoảng trống, chắt ra một <strong>insight</strong> — sự thật không hiển nhiên về người dùng. Rồi viết một <strong>Góc nhìn (Point of View — POV)</strong>:</p>
<pre><code>POV = [NGƯỜI DÙNG] cần [NHU CẦU] vì [INSIGHT bất ngờ]
vd: Bệnh nhân lần đầu cần thấy an toàn khi chụp
    vì cái máy đáng sợ, chứ không phải vì bệnh.
</code></pre>
<h3>How-Might-We (HMW — Làm sao để ta có thể)</h3>
<p>Đổi POV thành câu hỏi mở mời gọi ý tưởng: <em>"Làm sao để ta biến buổi chụp thành một cuộc phiêu lưu?"</em> HMW tốt đủ rộng cho nhiều lời giải nhưng đủ hẹp để tập trung. Một <strong>persona</strong> giữ một người dùng thật trong tầm mắt.</p>
<div class="callout"><span class="badge">Case: GE Adventure Series MRI</span> Nhà thiết kế Doug Dietz thấy trẻ em sợ hãi máy MRI. Đóng khung lại vấn đề — không phải "cải tiến máy quét" mà "giảm nỗi sợ của trẻ" — dẫn tới vẽ phòng chụp thành tàu cướp biển và rừng rậm. Tỉ lệ phải gây mê giảm, hài lòng tăng vọt: cùng cái máy, khác cách đóng khung.</div>`,
  ]]);

const c3q = quiz('det101c-quiz-3', 'Quiz 3 — Define|||Quiz 3 — Xác định', [
  { id: 'q1', question: 'Một phát biểu Point of View (POV) tốt gồm?|||A good Point of View (POV) statement contains?', options: ['Ngân sách + hạn chót|||Budget + deadline', 'Người dùng + Nhu cầu + Insight|||User + Need + Insight', 'Tên sản phẩm + giá|||Product name + price', 'Đối thủ + thị phần|||Competitors + market share'], correctIndex: 1, explanation: 'POV = [Người dùng] cần [Nhu cầu] vì [Insight bất ngờ].' },
  { id: 'q2', question: '"How Might We…" dùng để làm gì?|||What is "How Might We…" used for?', options: ['Chốt giải pháp cuối|||Lock the final solution', 'Đóng khung vấn đề thành câu hỏi mở mời ý tưởng|||Reframe the problem as open questions that invite ideas', 'Tính chi phí|||Estimate cost', 'Phân công nhân sự|||Assign staff'], correctIndex: 1, explanation: 'HMW biến POV thành câu hỏi mở, đủ rộng để nhiều ý tưởng nảy ra.' },
  { id: 'q3', question: 'Bài học từ case GE Adventure MRI là?|||The lesson from the GE Adventure MRI case?', options: ['Máy mới luôn tốt hơn|||A new machine is always better', 'Đóng khung lại đúng vấn đề quan trọng hơn cải tiến kỹ thuật|||Reframing the right problem beats a technical upgrade', 'Trẻ em không nên chụp MRI|||Children should not have MRIs', 'Sơn màu làm máy chạy nhanh hơn|||Paint makes the machine faster'], correctIndex: 1, explanation: 'Cùng máy, đổi vấn đề từ "cải tiến máy" sang "giảm nỗi sợ" → kết quả khác hẳn.' },
]);

const c4 = doc('det101c-4-1-ideate', '4.1 — Ideate: generate ideas|||4.1 — Lên ý tưởng: tạo giải pháp',
  'Brainstorm (defer judgment, go for volume, build on ideas), SCAMPER, worst possible idea, phân kỳ/hội tụ, chọn lọc (dot voting, ma trận 2x2).',
  [[
    `<span class="eyebrow">DET101c · Chapter 4 · Lesson 4.1</span>
<h2>Ideate — go wide before you go deep</h2>
<p><strong>Ideate</strong> is deliberate <em>divergence</em>: you chase quantity to find quality. The goal is many options, not one "right" answer too soon.</p>
<h3>Brainstorm rules (IDEO)</h3>
<ul>
<li><strong>Defer judgment</strong> — no "yes but" during divergence.</li>
<li><strong>Go for volume</strong> — quantity breeds quality.</li>
<li><strong>Build on the ideas of others</strong> — "yes, and…".</li>
<li><strong>Encourage wild ideas</strong> and stay on topic.</li>
</ul>
<h3>Idea-generation tools</h3>
<ul>
<li><strong>SCAMPER</strong> — Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse — prompts to twist an existing idea.</li>
<li><strong>Worst possible idea</strong> — deliberately propose terrible ideas; flipping them frees the group and surfaces hidden assumptions.</li>
</ul>
<h3>Then converge</h3>
<p>After diverging, <strong>select</strong>: <em>dot voting</em>, or a <strong>2×2 matrix</strong> (e.g. impact vs. effort) to spot quick wins. You keep a few ideas to prototype — not the one everyone already expected.</p>
<div class="callout"><span class="badge">Diverge then converge</span> Every design stage breathes: open up to many possibilities, then narrow to a decision. Ideate is the widest breath.</div>`,
    `<span class="eyebrow">DET101c · Chương 4 · Bài 4.1</span>
<h2>Lên ý tưởng — mở rộng trước khi đào sâu</h2>
<p><strong>Lên ý tưởng</strong> là <em>phân kỳ</em> có chủ đích: bạn đuổi theo số lượng để tìm chất lượng. Mục tiêu là nhiều lựa chọn, không phải một câu trả lời "đúng" quá sớm.</p>
<h3>Luật brainstorm (IDEO)</h3>
<ul>
<li><strong>Hoãn phán xét</strong> — không "đúng nhưng mà" trong lúc phân kỳ.</li>
<li><strong>Chạy theo số lượng</strong> — nhiều đẻ ra chất.</li>
<li><strong>Xây tiếp ý người khác</strong> — "đúng rồi, và…".</li>
<li><strong>Khuyến khích ý táo bạo</strong> và bám chủ đề.</li>
</ul>
<h3>Công cụ tạo ý tưởng</h3>
<ul>
<li><strong>SCAMPER</strong> — Thay thế, Kết hợp, Thích ứng, Thay đổi, Dùng cách khác, Loại bỏ, Đảo ngược — gợi ý để vặn xoáy một ý tưởng có sẵn.</li>
<li><strong>Ý tưởng tệ nhất (worst possible idea)</strong> — cố tình đề xuất ý dở tệ; lật ngược chúng giải phóng cả nhóm và lộ ra giả định ẩn.</li>
</ul>
<h3>Rồi hội tụ</h3>
<p>Sau khi phân kỳ, <strong>chọn lọc</strong>: <em>bỏ phiếu bằng chấm (dot voting)</em>, hoặc <strong>ma trận 2×2</strong> (vd tác động vs công sức) để tìm "quick win". Bạn giữ vài ý tưởng để tạo mẫu — không phải cái ai cũng đoán trước.</p>
<div class="callout"><span class="badge">Phân kỳ rồi hội tụ</span> Mỗi giai đoạn thiết kế đều "thở": mở ra nhiều khả năng, rồi thu lại một quyết định. Lên ý tưởng là nhịp thở rộng nhất.</div>`,
  ]]);

const c4q = quiz('det101c-quiz-4', 'Quiz 4 — Ideate|||Quiz 4 — Lên ý tưởng', [
  { id: 'q1', question: 'Trong lúc brainstorm phân kỳ, quy tắc quan trọng là?|||During divergent brainstorming, the key rule is?', options: ['Phán xét ngay mỗi ý|||Judge each idea immediately', 'Hoãn phán xét, chạy theo số lượng|||Defer judgment, go for volume', 'Chỉ một người được nói|||Only one person may speak', 'Chọn ngay ý đầu tiên|||Pick the first idea at once'], correctIndex: 1, explanation: 'Hoãn phán xét + chạy theo số lượng là luật cốt lõi của brainstorm.' },
  { id: 'q2', question: 'SCAMPER là viết tắt của nhóm động từ để?|||SCAMPER is a set of verbs used to?', options: ['Đo lường chi phí|||Measure cost', 'Vặn xoáy/biến đổi một ý tưởng có sẵn|||Twist/transform an existing idea', 'Phỏng vấn người dùng|||Interview users', 'Viết báo cáo|||Write reports'], correctIndex: 1, explanation: 'Substitute/Combine/Adapt/Modify/Put-to-other-use/Eliminate/Reverse — biến đổi ý tưởng.' },
  { id: 'q3', question: 'Công cụ nào giúp CHỌN LỌC (hội tụ) ý tưởng?|||Which tool helps SELECT (converge) ideas?', options: ['5 Whys', 'Ma trận 2×2 tác động–công sức / dot voting|||2×2 impact–effort matrix / dot voting', 'Empathy map', 'Shadowing'], correctIndex: 1, explanation: 'Dot voting và ma trận 2×2 (impact/effort) dùng để hội tụ, chọn ý.' },
]);

const c5 = doc('det101c-5-1-prototype', '5.1 — Prototype: make it tangible|||5.1 — Tạo mẫu: biến thành thứ sờ được',
  'Low-fidelity vs high-fidelity, rapid prototyping, "làm để nghĩ", storyboard, wireframe, giấy/Lego/đóng vai; nguyên tắc rẻ-nhanh-vứt-được.',
  [[
    `<span class="eyebrow">DET101c · Chapter 5 · Lesson 5.1</span>
<h2>Prototype — build to think</h2>
<p>A <strong>prototype</strong> is any rough, tangible version of an idea made to learn from. You are not building the product — you are building a question you can put in front of a user.</p>
<h3>Fidelity: start low</h3>
<ul>
<li><strong>Low fidelity</strong> — paper sketches, sticky-note flows, cardboard, role-play. Cheap, fast, easy to throw away — perfect for early ideas.</li>
<li><strong>High fidelity</strong> — clickable Figma mockups, working models. Use later, once the concept is proven, to test details and feel.</li>
</ul>
<h3>Common prototype forms</h3>
<ul>
<li><strong>Storyboard</strong> — a comic strip of the user's journey; great for services and campaigns.</li>
<li><strong>Wireframe</strong> — a skeletal layout of a screen, no colours or polish, just structure.</li>
<li><strong>Paper / physical mock-up</strong> — even Lego or foam stands in for a real object.</li>
</ul>
<pre><code>Rule of thumb: cheap, fast, disposable.
If you're afraid to throw the prototype away,
it is already too polished to test honestly.
</code></pre>
<div class="callout"><span class="badge">Build to think</span> Making an idea physical exposes flaws no discussion reveals — and gives users something concrete to react to, which produces far better feedback than describing an idea in words.</div>`,
    `<span class="eyebrow">DET101c · Chương 5 · Bài 5.1</span>
<h2>Tạo mẫu — làm để nghĩ</h2>
<p>Một <strong>mẫu (prototype)</strong> là bất kỳ phiên bản thô, sờ được nào của ý tưởng, làm ra để học. Bạn không dựng sản phẩm — bạn dựng một câu hỏi để đặt trước người dùng.</p>
<h3>Độ tinh (fidelity): bắt đầu từ thấp</h3>
<ul>
<li><strong>Độ thấp (low-fi)</strong> — phác giấy, luồng bằng sticky note, bìa các-tông, đóng vai. Rẻ, nhanh, dễ vứt — hợp với ý tưởng thời đầu.</li>
<li><strong>Độ cao (hi-fi)</strong> — mockup Figma bấm được, mô hình chạy. Dùng về sau, khi ý tưởng đã được chứng minh, để kiểm chi tiết và cảm giác.</li>
</ul>
<h3>Các dạng mẫu thường gặp</h3>
<ul>
<li><strong>Storyboard</strong> — dải truyện tranh về hành trình người dùng; rất hợp dịch vụ và chiến dịch.</li>
<li><strong>Wireframe</strong> — bố cục khung xương của một màn hình, không màu mè, chỉ cấu trúc.</li>
<li><strong>Mẫu giấy / vật lý</strong> — cả Lego hay xốp cũng thay được cho vật thật.</li>
</ul>
<pre><code>Nguyên tắc: rẻ, nhanh, vứt được.
Nếu bạn tiếc không dám vứt cái mẫu,
nghĩa là nó đã quá bóng bẩy để kiểm thử thành thật.
</code></pre>
<div class="callout"><span class="badge">Làm để nghĩ</span> Biến ý tưởng thành vật chất phơi ra lỗi mà không buổi bàn luận nào lộ được — và cho người dùng thứ cụ thể để phản ứng, tạo phản hồi tốt hơn nhiều so với tả ý tưởng bằng lời.</div>`,
  ]]);

const c5q = quiz('det101c-quiz-5', 'Quiz 5 — Prototype|||Quiz 5 — Tạo mẫu', [
  { id: 'q1', question: 'Mục đích chính của một prototype là?|||The main purpose of a prototype is?', options: ['Bán ngay cho khách|||To sell to customers now', 'Làm ra để học và lấy phản hồi|||To be built so you can learn and get feedback', 'Thay thế nghiên cứu người dùng|||To replace user research', 'Trang trí báo cáo|||To decorate the report'], correctIndex: 1, explanation: 'Prototype là để học — "làm để nghĩ" và đặt trước người dùng lấy phản hồi.' },
  { id: 'q2', question: 'Ở giai đoạn ý tưởng còn sớm, nên dùng mẫu độ tinh nào?|||For early ideas, which fidelity should you use?', options: ['Độ cao (hi-fi) hoàn thiện|||Polished high fidelity', 'Độ thấp (low-fi): giấy, sticky note, rẻ và vứt được|||Low fidelity: paper, sticky notes, cheap & disposable', 'Sản phẩm thật hoàn chỉnh|||A finished real product', 'Không cần mẫu|||No prototype at all'], correctIndex: 1, explanation: 'Bắt đầu low-fi: rẻ, nhanh, dễ vứt để thử nhiều ý.' },
  { id: 'q3', question: 'Dạng mẫu vẽ hành trình người dùng như truyện tranh gọi là?|||The prototype form that draws the user journey like a comic strip?', options: ['Wireframe', 'Storyboard', 'Empathy map', 'Persona'], correctIndex: 1, explanation: 'Storyboard kể hành trình người dùng bằng khung tranh — hợp dịch vụ/chiến dịch.' },
]);

const c6 = doc('det101c-6-1-test', '6.1 — Test: learn from users|||6.1 — Kiểm thử: học từ người dùng',
  'Usability testing (think-aloud, nhiệm vụ thật), feedback loop, hỏi mở không dẫn dắt, "I like / I wish / What if", vòng lặp cải tiến, thất bại là dữ liệu.',
  [[
    `<span class="eyebrow">DET101c · Chapter 6 · Lesson 6.1</span>
<h2>Test — put it in front of real users</h2>
<p><strong>Test</strong> closes the loop: real users try your prototype so you learn what works before you invest. Test to <em>learn</em>, not to prove you were right.</p>
<h3>Usability testing</h3>
<ul>
<li>Give users a <strong>real task</strong>, then stay quiet and watch. Do not explain or defend the design.</li>
<li>Use <strong>think-aloud</strong>: ask them to say what they are thinking as they go.</li>
<li>Ask <strong>open, non-leading</strong> questions — "what were you expecting here?" not "wasn't that easy?"</li>
</ul>
<h3>Structured feedback: I Like / I Wish / What If</h3>
<pre><code>I LIKE ...   what worked well
I WISH ...   what could be better
WHAT IF ...  new ideas the test sparked
</code></pre>
<h3>The feedback loop</h3>
<p>Findings feed straight back: tweak the prototype and retest, or if the whole idea misses, return to Define or Ideate. <strong>Iteration</strong> — many small cheap cycles — is where design thinking earns its value. A prototype that fails a test is not a failure; it is data that saved you from failing in production.</p>
<div class="callout"><span class="badge">Test early, test often</span> Even five users reveal most usability problems. The cheaper and earlier you test, the less a mistake costs.</div>`,
    `<span class="eyebrow">DET101c · Chương 6 · Bài 6.1</span>
<h2>Kiểm thử — đặt trước người dùng thật</h2>
<p><strong>Kiểm thử</strong> khép vòng lặp: người dùng thật thử mẫu để bạn biết cái gì chạy được trước khi đầu tư. Kiểm thử để <em>học</em>, không phải để chứng minh mình đúng.</p>
<h3>Kiểm thử khả dụng (usability)</h3>
<ul>
<li>Giao cho người dùng một <strong>nhiệm vụ thật</strong>, rồi im lặng quan sát. Đừng giải thích hay bênh vực thiết kế.</li>
<li>Dùng <strong>think-aloud</strong>: mời họ nói ra suy nghĩ khi thao tác.</li>
<li>Hỏi <strong>câu mở, không dẫn dắt</strong> — "bạn mong gì ở chỗ này?" chứ không phải "dễ đúng không?".</li>
</ul>
<h3>Phản hồi có cấu trúc: I Like / I Wish / What If</h3>
<pre><code>TÔI THÍCH ...  cái gì chạy tốt
TÔI ƯỚC ...    cái gì có thể tốt hơn
NẾU NHƯ ...    ý mới mà buổi thử gợi ra
</code></pre>
<h3>Vòng lặp phản hồi</h3>
<p>Phát hiện quay thẳng lại: chỉnh mẫu rồi thử lại, hoặc nếu cả ý tưởng trật thì về Xác định hay Lên ý tưởng. <strong>Lặp (iteration)</strong> — nhiều vòng nhỏ và rẻ — là chỗ tư duy thiết kế tạo ra giá trị. Một mẫu rớt kiểm thử không phải thất bại; nó là dữ liệu cứu bạn khỏi hỏng lúc đã ra thị trường.</p>
<div class="callout"><span class="badge">Thử sớm, thử nhiều</span> Chỉ năm người dùng đã lộ ra phần lớn lỗi khả dụng. Thử càng rẻ và sớm, một sai lầm càng ít tốn kém.</div>`,
  ]]);

const c6q = quiz('det101c-quiz-6', 'Quiz 6 — Test|||Quiz 6 — Kiểm thử', [
  { id: 'q1', question: 'Khi kiểm thử khả dụng, người thiết kế nên?|||During usability testing, the designer should?', options: ['Giải thích và bênh vực thiết kế|||Explain and defend the design', 'Giao nhiệm vụ thật rồi im lặng quan sát|||Give a real task, then stay quiet and observe', 'Trả lời hộ khi người dùng lúng túng|||Answer for the user when they struggle', 'Chỉ hỏi câu có/không|||Only ask yes/no questions'], correctIndex: 1, explanation: 'Quan sát người dùng làm nhiệm vụ thật; hỏi câu mở, không dẫn dắt.' },
  { id: 'q2', question: 'Khung phản hồi "I Like / I Wish / What If" dùng để?|||The "I Like / I Wish / What If" frame is used to?', options: ['Tính điểm thi|||Grade an exam', 'Thu phản hồi có cấu trúc từ buổi thử|||Collect structured feedback from a test', 'Đặt tên sản phẩm|||Name the product', 'Phân chia ngân sách|||Split the budget'], correctIndex: 1, explanation: 'I Like/I Wish/What If gom phản hồi thành cái tốt, cái cần sửa, ý mới.' },
  { id: 'q3', question: 'Một mẫu "rớt" khi kiểm thử nên được xem là?|||A prototype that "fails" a test should be seen as?', options: ['Thất bại của cả dự án|||A failure of the whole project', 'Dữ liệu để cải tiến, lặp lại|||Data to improve and iterate', 'Lý do bỏ môn|||A reason to quit', 'Lỗi của người dùng|||The user\'s fault'], correctIndex: 1, explanation: 'Thất bại sớm là dữ liệu; lặp lại để cải tiến trước khi ra thị trường.' },
]);

const c7 = doc('det101c-7-1-tools-teamwork', '7.1 — Tools & teamwork|||7.1 — Công cụ & làm việc nhóm',
  'Điều phối (facilitation), workshop/design sprint, double diamond (discover-define-develop-deliver), sticky note & bảng trắng (Miro/FigJam), làm việc nhóm đa ngành.',
  [[
    `<span class="eyebrow">DET101c · Chapter 7 · Lesson 7.1</span>
<h2>Tools &amp; teamwork</h2>
<p>Design thinking is a team sport. This chapter covers how to <strong>run</strong> the process with a group, not just understand it.</p>
<h3>The Double Diamond</h3>
<pre><code>Discover -> Define  |  Develop -> Deliver
(diverge) (converge)| (diverge) (converge)
   problem space     |    solution space
</code></pre>
<p>The British Design Council's <strong>Double Diamond</strong> maps the two breaths: first find the <em>right problem</em> (Discover, Define), then build the <em>right solution</em> (Develop, Deliver).</p>
<h3>Facilitation &amp; workshops</h3>
<ul>
<li>A <strong>facilitator</strong> guides the process (time, turns, energy) without owning the content — everyone contributes.</li>
<li>A <strong>design sprint</strong> compresses the stages into a few intense days to reach a tested prototype fast.</li>
<li><strong>Sticky notes</strong> give everyone equal voice: one idea per note, cluster, vote. Tools like <strong>Miro</strong> and <strong>FigJam</strong> do this online.</li>
</ul>
<h3>Multidisciplinary teams</h3>
<p>Mix backgrounds — a marketer, a developer, a user. Diverse teams spot more of the problem and produce more original ideas than experts who all think alike.</p>
<div class="callout"><span class="badge">Process over opinion</span> Good facilitation replaces "the loudest person wins" with a fair method: diverge, cluster, vote, decide — so the best idea wins, not the boldest voice.</div>`,
    `<span class="eyebrow">DET101c · Chương 7 · Bài 7.1</span>
<h2>Công cụ &amp; làm việc nhóm</h2>
<p>Tư duy thiết kế là môn thể thao đồng đội. Chương này bàn cách <strong>vận hành</strong> quy trình cùng một nhóm, không chỉ hiểu nó.</p>
<h3>Double Diamond (Kim cương đôi)</h3>
<pre><code>Khám phá -> Xác định | Phát triển -> Chuyển giao
(phân kỳ) (hội tụ)   | (phân kỳ)   (hội tụ)
  không gian vấn đề   |   không gian giải pháp
</code></pre>
<p><strong>Double Diamond</strong> của Design Council (Anh) vẽ hai nhịp thở: trước hết tìm <em>đúng vấn đề</em> (Khám phá, Xác định), rồi dựng <em>đúng giải pháp</em> (Phát triển, Chuyển giao).</p>
<h3>Điều phối &amp; workshop</h3>
<ul>
<li><strong>Người điều phối (facilitator)</strong> dẫn dắt quy trình (thời gian, lượt nói, năng lượng) mà không sở hữu nội dung — ai cũng đóng góp.</li>
<li><strong>Design sprint</strong> nén các giai đoạn vào vài ngày dồn dập để đạt một mẫu đã kiểm thử thật nhanh.</li>
<li><strong>Sticky note</strong> cho mọi người tiếng nói ngang nhau: mỗi note một ý, gom nhóm, bỏ phiếu. Công cụ như <strong>Miro</strong> và <strong>FigJam</strong> làm việc này online.</li>
</ul>
<h3>Nhóm đa ngành</h3>
<p>Trộn nền tảng khác nhau — một người marketing, một lập trình viên, một người dùng. Nhóm đa dạng thấy nhiều mặt vấn đề hơn và cho ý tưởng độc đáo hơn các chuyên gia nghĩ giống nhau.</p>
<div class="callout"><span class="badge">Quy trình hơn ý kiến</span> Điều phối tốt thay "ai to mồm thì thắng" bằng một phương pháp công bằng: phân kỳ, gom nhóm, bỏ phiếu, quyết — để ý tưởng tốt nhất thắng, không phải giọng nói bạo nhất.</div>`,
  ]]);

const c7q = quiz('det101c-quiz-7', 'Quiz 7 — Tools & teamwork|||Quiz 7 — Công cụ & làm việc nhóm', [
  { id: 'q1', question: 'Double Diamond mô tả hai không gian nào?|||The Double Diamond describes which two spaces?', options: ['Thời gian và tiền bạc|||Time and money', 'Không gian vấn đề và không gian giải pháp|||Problem space and solution space', 'Phần cứng và phần mềm|||Hardware and software', 'Đầu vào và đầu ra|||Input and output'], correctIndex: 1, explanation: 'Kim cương 1 = tìm đúng vấn đề; kim cương 2 = dựng đúng giải pháp.' },
  { id: 'q2', question: 'Vai trò của người điều phối (facilitator) là?|||The role of a facilitator is?', options: ['Áp đặt ý tưởng của mình|||Impose their own ideas', 'Dẫn dắt quy trình để ai cũng đóng góp, không sở hữu nội dung|||Guide the process so everyone contributes, without owning the content', 'Ghi biên bản rồi rời đi|||Take minutes then leave', 'Chỉ quản lý ngân sách|||Only manage the budget'], correctIndex: 1, explanation: 'Facilitator lo quy trình (thời gian, lượt, năng lượng), để cả nhóm góp ý.' },
  { id: 'q3', question: 'Vì sao dùng sticky note trong workshop?|||Why use sticky notes in a workshop?', options: ['Vì rẻ tiền|||Because they are cheap', 'Cho mọi người tiếng nói ngang nhau: mỗi note một ý, gom nhóm, bỏ phiếu|||They give everyone equal voice: one idea per note, cluster, vote', 'Để trang trí tường|||To decorate the wall', 'Vì bắt buộc phải viết tay|||Because handwriting is required'], correctIndex: 1, explanation: 'Sticky note phân tán ý tưởng công bằng, dễ gom nhóm và bỏ phiếu.' },
]);

const c8 = doc('det101c-8-1-applications', '8.1 — Design thinking in media & innovation|||8.1 — Ứng dụng trong truyền thông & đổi mới',
  'Áp dụng DT cho chiến dịch truyền thông, sản phẩm số & dịch vụ (service design, journey map); đo hiệu quả; đạo đức; case IBM/GE, khép lại 4 bước.',
  [[
    `<span class="eyebrow">DET101c · Chapter 8 · Lesson 8.1</span>
<h2>Applying design thinking to media &amp; innovation</h2>
<p>The five stages are not just for gadgets — they shape <strong>campaigns, digital products and services</strong>. Communication is design: you are designing an experience for an audience.</p>
<h3>For a communication campaign</h3>
<ul>
<li><strong>Empathize</strong> with the audience — who are they, what do they feel, where do they pay attention?</li>
<li><strong>Define</strong> the real message-need, then <strong>ideate</strong> many creative angles.</li>
<li><strong>Prototype</strong> the ad/post cheaply (a mock feed, a storyboard) and <strong>test</strong> it on a small audience before the media spend.</li>
</ul>
<h3>For digital products &amp; services</h3>
<p><strong>Service design</strong> maps the whole experience with a <strong>customer journey map</strong> — every touchpoint, front-stage and back-stage. Prototype flows in Figma, test, iterate. The same loop drives app UX and end-to-end services.</p>
<h3>Measure, and design responsibly</h3>
<p>Close the loop with metrics (engagement, task success, satisfaction) and keep iterating. And design <strong>ethically</strong>: human-centered means serving real needs, not manipulating attention.</p>
<div class="callout"><span class="badge">Case: IBM at scale</span> IBM adopted Enterprise Design Thinking across tens of thousands of employees — the Loop (Observe → Reflect → Make) plus playbacks and sponsor users. It shows design thinking working not just in a studio but as a company-wide way of building products.</div>
<h3>Wrap-up: the four-step journey</h3>
<p>Understand people → frame the problem → create &amp; prototype → test &amp; iterate. Keep looping, stay human-centered, and you have a repeatable engine for innovation in any medium.</p>`,
    `<span class="eyebrow">DET101c · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng tư duy thiết kế vào truyền thông &amp; đổi mới</h2>
<p>Năm giai đoạn không chỉ dành cho thiết bị — chúng định hình <strong>chiến dịch, sản phẩm số và dịch vụ</strong>. Truyền thông chính là thiết kế: bạn đang thiết kế một trải nghiệm cho công chúng.</p>
<h3>Cho một chiến dịch truyền thông</h3>
<ul>
<li><strong>Đồng cảm</strong> với công chúng — họ là ai, cảm thấy gì, chú ý ở đâu?</li>
<li><strong>Xác định</strong> nhu cầu thông điệp thật, rồi <strong>lên ý tưởng</strong> nhiều góc sáng tạo.</li>
<li><strong>Tạo mẫu</strong> quảng cáo/bài đăng thật rẻ (feed giả, storyboard) và <strong>kiểm thử</strong> trên nhóm nhỏ trước khi chi tiền media.</li>
</ul>
<h3>Cho sản phẩm số &amp; dịch vụ</h3>
<p><strong>Thiết kế dịch vụ (service design)</strong> vẽ toàn bộ trải nghiệm bằng <strong>bản đồ hành trình khách hàng (journey map)</strong> — mọi điểm chạm, sân trước và sân sau. Tạo mẫu luồng trong Figma, kiểm thử, lặp lại. Cùng vòng lặp đó dẫn dắt UX ứng dụng và dịch vụ đầu-cuối.</p>
<h3>Đo lường, và thiết kế có trách nhiệm</h3>
<p>Khép vòng bằng chỉ số (tương tác, tỉ lệ hoàn thành nhiệm vụ, hài lòng) và tiếp tục lặp. Và thiết kế có <strong>đạo đức</strong>: lấy con người làm trung tâm nghĩa là phục vụ nhu cầu thật, không thao túng sự chú ý.</p>
<div class="callout"><span class="badge">Case: IBM ở quy mô lớn</span> IBM áp dụng Enterprise Design Thinking trên hàng chục nghìn nhân viên — the Loop (Quan sát → Suy ngẫm → Làm) cùng playback và sponsor user. Nó cho thấy tư duy thiết kế chạy được không chỉ trong studio mà như một cách xây sản phẩm toàn công ty.</div>
<h3>Khép lại: hành trình bốn bước</h3>
<p>Hiểu con người → đóng khung vấn đề → sáng tạo &amp; tạo mẫu → kiểm thử &amp; lặp. Cứ lặp mãi, giữ con người làm trung tâm, và bạn có một cỗ máy đổi mới lặp lại được cho bất kỳ phương tiện nào.</p>`,
  ]]);

const c8q = quiz('det101c-quiz-8', 'Quiz 8 — Media & innovation|||Quiz 8 — Truyền thông & đổi mới', [
  { id: 'q1', question: 'Trước khi chi ngân sách media cho một chiến dịch, nên?|||Before spending media budget on a campaign, you should?', options: ['Chạy quảng cáo ngay|||Run the ad immediately', 'Tạo mẫu (feed giả/storyboard) và kiểm thử trên nhóm nhỏ|||Prototype (mock feed/storyboard) and test on a small audience', 'Bỏ qua khâu người dùng|||Skip the user entirely', 'Chỉ dựa vào cảm hứng|||Rely on inspiration only'], correctIndex: 1, explanation: 'Prototype rẻ + test nhỏ trước khi tiêu tiền là cách áp DT vào chiến dịch.' },
  { id: 'q2', question: 'Công cụ nào vẽ toàn bộ trải nghiệm và mọi điểm chạm của dịch vụ?|||Which tool maps the whole experience and every touchpoint of a service?', options: ['SCAMPER', 'Bản đồ hành trình khách hàng (journey map)|||Customer journey map', 'Định luật Ohm|||Ohm\'s law', 'Ma trận 2×2|||2×2 matrix'], correctIndex: 1, explanation: 'Service design dùng customer journey map để phủ mọi điểm chạm.' },
  { id: 'q3', question: 'Thiết kế "lấy con người làm trung tâm" có nghĩa đạo đức là?|||The ethical meaning of "human-centered" design is?', options: ['Thao túng sự chú ý để tăng click|||Manipulate attention to boost clicks', 'Phục vụ nhu cầu thật của người dùng|||Serve users\' real needs', 'Chỉ tối đa hoá lợi nhuận|||Maximize profit only', 'Giấu thông tin với người dùng|||Hide information from users'], correctIndex: 1, explanation: 'Human-centered = phục vụ nhu cầu thật, không thao túng sự chú ý.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'DET101c',
    slug: 'det101c-design-thinking',
    title: 'Design Thinking',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DET101c.webp',
    shortDescription: 'Human-centered innovation the IDEO/d.school way: the five stages — Empathize, Define, Ideate, Prototype, Test — plus empathy maps, how-might-we, SCAMPER & the double diamond, applied to media & digital products. Bilingual, with quizzes.|||Đổi mới lấy con người làm trung tâm theo IDEO/d.school: năm giai đoạn — Đồng cảm, Xác định, Ý tưởng, Tạo mẫu, Kiểm thử — cùng empathy map, how-might-we, SCAMPER & double diamond, ứng dụng vào truyền thông & sản phẩm số. Song ngữ, có quiz.',
    description: 'Môn <strong>DET101c — Design Thinking (Tư duy thiết kế)</strong> thuộc khối Công nghệ Truyền thông, kỳ 2, dạy cách đổi mới <strong>lấy con người làm trung tâm</strong> theo chuẩn <strong>IDEO / Stanford d.school</strong>. Đi qua <strong>năm giai đoạn</strong> — Đồng cảm (phỏng vấn, quan sát, empathy map) → Xác định (point of view, insight, how-might-we, persona) → Lên ý tưởng (brainstorm, SCAMPER) → Tạo mẫu (low/high fidelity, storyboard, wireframe) → Kiểm thử (usability, lặp cải tiến) — rồi <strong>công cụ &amp; làm việc nhóm</strong> (facilitation, double diamond, Miro) và <strong>ứng dụng vào truyền thông &amp; đổi mới</strong>. Song ngữ, có case thật (IDEO shopping cart, Airbnb, GE MRI, IBM) và quiz mỗi chương.',
    whatYouLearn: 'Design thinking &amp; human-centered design; 3 thấu kính desirability/feasibility/viability; đồng cảm (phỏng vấn 5 Whys, quan sát, empathy map); xác định vấn đề (POV, insight, how-might-we, persona); lên ý tưởng (luật brainstorm, SCAMPER, worst idea, phân kỳ/hội tụ); tạo mẫu (low/high fidelity, storyboard, wireframe); kiểm thử (usability, think-aloud, I like/I wish/what if, vòng lặp); facilitation, workshop, design sprint, double diamond; ứng dụng vào chiến dịch, sản phẩm số &amp; dịch vụ (journey map).',
    requirements: 'Không yêu cầu tiên quyết kỹ thuật. Nên có tài khoản để dùng Miro/FigJam hoặc Figma khi thực hành tạo mẫu.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách (Tim Brown, Norman), IDEO Field Guide/d.school, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Design thinking là gì, 5 giai đoạn, vì sao truyền thông cần.', lessons: [intro] },
    { title: 'Chương 1 — Tư duy thiết kế là gì|||Chapter 1 — What design thinking is', description: 'Human-centered, 3 thấu kính, mindset, IDEO cart.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Đồng cảm (Empathize)|||Chapter 2 — Empathize', description: 'Phỏng vấn, quan sát, empathy map, case Airbnb.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Xác định vấn đề (Define)|||Chapter 3 — Define', description: 'POV, insight, how-might-we, persona, GE MRI.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Lên ý tưởng (Ideate)|||Chapter 4 — Ideate', description: 'Brainstorm, SCAMPER, worst idea, phân kỳ/hội tụ.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tạo mẫu (Prototype)|||Chapter 5 — Prototype', description: 'Low/high fidelity, storyboard, wireframe, rẻ-nhanh-vứt.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Kiểm thử (Test)|||Chapter 6 — Test', description: 'Usability, think-aloud, feedback loop, lặp cải tiến.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Công cụ & làm việc nhóm|||Chapter 7 — Tools & teamwork', description: 'Facilitation, workshop, double diamond, sticky/Miro.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng truyền thông & đổi mới|||Chapter 8 — Media & innovation', description: 'Chiến dịch, sản phẩm số, service design, case IBM.', lessons: [c8, c8q] },
  ],
};
