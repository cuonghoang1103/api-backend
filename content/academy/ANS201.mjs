/**
 * ANS201 — Idea & Script Development (Phát triển ý tưởng và Kịch bản).
 * Ngành Thiết kế mỹ thuật số FPTU, Kỳ 3. Giáo trình chuẩn quốc tế: Robert
 * McKee "Story", Blake Snyder "Save the Cat", Syd Field "Screenplay",
 * Joseph Campbell "The Hero with a Thousand Faces". Song ngữ + ví dụ phim
 * thật + quiz. Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ans201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Sách kinh điển (McKee, Snyder, Field, Campbell), tài liệu FLM, YouTube, công cụ viết kịch bản, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">ANS201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>idea &amp; script development</strong> — from a spark of an idea to a finished, formatted script — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are the field's canonical books and free resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for ANS201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 The four canonical books</h3>
<ul>
<li><strong>Robert McKee — <em>Story</em></strong>: substance, structure, style and the principles of screenwriting. The deep theory of story.</li>
<li><strong>Blake Snyder — <em>Save the Cat!</em></strong>: the 15-beat "beat sheet" and the logline — the most practical modern toolkit.</li>
<li><strong>Syd Field — <em>Screenplay</em></strong>: the three-act paradigm, plot points and the page-count map.</li>
<li><strong>Joseph Campbell — <em>The Hero with a Thousand Faces</em></strong>: the monomyth / hero's journey behind countless stories.</li>
</ul>
<h3>🌐 Free documentation &amp; tools</h3>
<ul>
<li><a href="https://www.studiobinder.com/blog/" target="_blank" rel="noopener">StudioBinder blog</a> — screenwriting &amp; structure guides.</li>
<li><a href="https://www.savethecat.com/" target="_blank" rel="noopener">Save the Cat!</a> — the beat sheet, explained.</li>
<li><a href="https://www.celtx.com/" target="_blank" rel="noopener">Celtx</a> / <a href="https://www.writerduet.com/" target="_blank" rel="noopener">WriterDuet</a> — free screenwriting software with correct format.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@lessonsfromthescreenplay" target="_blank" rel="noopener">Lessons from the Screenplay</a> — how great scripts work.</li>
<li><a href="https://www.youtube.com/@StudioBinder" target="_blank" rel="noopener">StudioBinder</a> — structure, character &amp; dialogue breakdowns.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Idea</strong> — generate premises, pick one, sharpen it into a logline.</li>
<li><strong>Structure</strong> — map it onto three acts and a beat sheet.</li>
<li><strong>Character</strong> — give the hero a want, a need and an antagonist that tests both.</li>
<li><strong>Script</strong> — write scenes with subtext, format correctly, then rewrite.</li>
</ol></div>`,
    `<span class="eyebrow">ANS201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>phát triển ý tưởng &amp; kịch bản</strong> — từ một tia ý tưởng đến kịch bản hoàn chỉnh, đúng định dạng — gom về một chỗ. Slide &amp; đề cương chính thức nằm trên <strong>FLM</strong>; bên dưới là các sách kinh điển của ngành và nguồn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đề cương FPTU &amp; slide bài giảng chính thức của ANS201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Bốn cuốn sách kinh điển</h3>
<ul>
<li><strong>Robert McKee — <em>Story</em></strong>: nội dung, cấu trúc, phong cách và các nguyên lý viết kịch bản. Lý thuyết câu chuyện chiều sâu.</li>
<li><strong>Blake Snyder — <em>Save the Cat!</em></strong>: bảng "beat sheet" 15 nhịp và logline — bộ công cụ hiện đại thực dụng nhất.</li>
<li><strong>Syd Field — <em>Screenplay</em></strong>: mô hình ba hồi, điểm nút (plot point) và bản đồ theo số trang.</li>
<li><strong>Joseph Campbell — <em>The Hero with a Thousand Faces</em></strong>: hành trình người hùng (monomyth) đứng sau vô số câu chuyện.</li>
</ul>
<h3>🌐 Tài liệu &amp; công cụ miễn phí</h3>
<ul>
<li><a href="https://www.studiobinder.com/blog/" target="_blank" rel="noopener">StudioBinder blog</a> — hướng dẫn viết kịch bản &amp; cấu trúc.</li>
<li><a href="https://www.savethecat.com/" target="_blank" rel="noopener">Save the Cat!</a> — giải thích beat sheet.</li>
<li><a href="https://www.celtx.com/" target="_blank" rel="noopener">Celtx</a> / <a href="https://www.writerduet.com/" target="_blank" rel="noopener">WriterDuet</a> — phần mềm viết kịch bản miễn phí, đúng định dạng.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@lessonsfromthescreenplay" target="_blank" rel="noopener">Lessons from the Screenplay</a> — vì sao các kịch bản hay hoạt động.</li>
<li><a href="https://www.youtube.com/@StudioBinder" target="_blank" rel="noopener">StudioBinder</a> — mổ xẻ cấu trúc, nhân vật &amp; đối thoại.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Ý tưởng</strong> — sinh nhiều tiền đề, chọn một, mài thành logline.</li>
<li><strong>Cấu trúc</strong> — đặt lên ba hồi và một beat sheet.</li>
<li><strong>Nhân vật</strong> — cho nhân vật một khao khát (want), một nhu cầu (need) và một phản diện thử thách cả hai.</li>
<li><strong>Kịch bản</strong> — viết cảnh có subtext, định dạng đúng, rồi sửa lại.</li>
</ol></div>`,
  ]]);

const intro = doc('ans201-0-1-overview', 'Course overview: from idea to script|||Tổng quan: từ ý tưởng đến kịch bản',
  'Kịch bản là gì; vì sao câu chuyện có cấu trúc; lộ trình 4 bước ý tưởng → cấu trúc → nhân vật → kịch bản.',
  [[
    `<span class="eyebrow">ANS201 · Lesson 0.1 · Overview</span>
<h2>From idea to script</h2>
<p class="lead">This course teaches you to <strong>turn a raw idea into a written, structured script</strong> — the blueprint behind films, animations and games. A great visual is nothing without a story worth telling; ANS201 gives you the craft to build that story on purpose, not by luck.</p>
<h3>What a script is</h3>
<p>A <strong>script (screenplay)</strong> is a written plan for a visual story: who is where, what they do and say, and in what order. It is the <em>architecture</em> everyone else — director, animator, designer — builds from.</p>
<h3>Why story has structure</h3>
<p>Audiences feel a story is "satisfying" when it follows deep patterns discovered over centuries: a beginning that sets up, a middle that escalates conflict, and an end that pays off. Theorists like <strong>McKee, Field, Snyder</strong> and <strong>Campbell</strong> named these patterns so you can use them deliberately.</p>
<h3>Roadmap</h3>
<p>Idea generation &amp; logline → three-act structure → character arc &amp; the hero's journey → character &amp; conflict → scene structure &amp; the beat sheet → dialogue &amp; subtext → script format → rewriting. Bilingual, with real film examples and a quiz each chapter.</p>`,
    `<span class="eyebrow">ANS201 · Bài 0.1 · Tổng quan</span>
<h2>Từ ý tưởng đến kịch bản</h2>
<p class="lead">Môn này dạy bạn <strong>biến một ý tưởng thô thành kịch bản viết ra, có cấu trúc</strong> — bản thiết kế đứng sau phim, hoạt hình và game. Một hình ảnh đẹp là vô nghĩa nếu không có câu chuyện đáng kể; ANS201 cho bạn kỹ nghệ dựng câu chuyện đó một cách có chủ đích, không nhờ may rủi.</p>
<h3>Kịch bản là gì</h3>
<p>Một <strong>kịch bản (screenplay)</strong> là bản kế hoạch viết ra cho một câu chuyện hình ảnh: ai ở đâu, làm gì, nói gì, theo thứ tự nào. Nó là <em>kiến trúc</em> mà mọi người khác — đạo diễn, họa sĩ diễn hoạt, nhà thiết kế — dựa vào để dựng.</p>
<h3>Vì sao câu chuyện có cấu trúc</h3>
<p>Khán giả thấy một câu chuyện "đã" khi nó đi theo những khuôn mẫu sâu được khám phá qua nhiều thế kỷ: mở đầu để giới thiệu, thân bài đẩy xung đột lên, kết trả nợ cho khán giả. Các nhà lý thuyết như <strong>McKee, Field, Snyder</strong> và <strong>Campbell</strong> đã gọi tên các khuôn mẫu này để bạn dùng có chủ đích.</p>
<h3>Lộ trình</h3>
<p>Sinh ý tưởng &amp; logline → cấu trúc ba hồi → hành trình nhân vật &amp; người hùng → nhân vật &amp; xung đột → cấu trúc cảnh &amp; beat sheet → đối thoại &amp; subtext → định dạng kịch bản → sửa &amp; phát triển. Song ngữ, có ví dụ phim thật và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('ans201-1-1-idea', '1.1 — Idea generation, logline & premise|||1.1 — Sinh ý tưởng, logline & tiền đề',
  'Brainstorm "what if", tiền đề (premise), concept, và logline một câu; từ ý tưởng lộn xộn tới hạt nhân câu chuyện.',
  [[
    `<span class="eyebrow">ANS201 · Chapter 1 · Lesson 1.1</span>
<h2>Idea generation, logline &amp; premise</h2>
<h3>Finding ideas</h3>
<p>Ideas rarely arrive whole. Writers generate many with tools like <strong>"What if…?"</strong> (What if a fish got lost in the ocean?), combining unlike things, asking "what's the worst that could happen", and mining personal fear or desire. Quantity first — judge later.</p>
<h3>Premise vs concept</h3>
<ul>
<li><strong>Premise</strong> — the core idea in a sentence, usually a <em>character + situation + conflict</em>: "A timid clownfish crosses the ocean to find his captured son."</li>
<li><strong>Concept</strong> — the broader hook or world ("a world where toys are alive when humans aren't looking").</li>
</ul>
<h3>The logline</h3>
<p>A <strong>logline</strong> is a one-sentence pitch that names the <em>hero</em>, their <em>goal</em>, and the <em>obstacle/stakes</em>. If you can't write the logline, the idea isn't focused yet.</p>
<pre><code>Logline formula:
 When [inciting event], a [flawed hero]
 must [goal] before [stakes] — but [obstacle].

Example (Finding Nemo):
 When his son is captured, a fearful clownfish
 must cross a dangerous ocean to find him.
</code></pre>
<div class="callout"><span class="badge">Real example</span> <em>Jaws</em>: "A police chief with a fear of water must hunt a killer shark terrorizing his beach town." One sentence — hero, goal, obstacle, irony.</div>`,
    `<span class="eyebrow">ANS201 · Chương 1 · Bài 1.1</span>
<h2>Sinh ý tưởng, logline &amp; tiền đề</h2>
<h3>Tìm ý tưởng</h3>
<p>Ý tưởng hiếm khi đến trọn vẹn. Người viết sinh ra thật nhiều bằng các công cụ như <strong>"Nếu như…?"</strong> (Nếu một con cá lạc giữa đại dương?), ghép những thứ không liên quan, hỏi "điều tệ nhất có thể xảy ra là gì", và đào vào nỗi sợ hay khát khao của chính mình. Số lượng trước — đánh giá sau.</p>
<h3>Tiền đề (premise) và concept</h3>
<ul>
<li><strong>Tiền đề</strong> — ý tưởng lõi trong một câu, thường là <em>nhân vật + tình huống + xung đột</em>: "Một chú cá hề nhút nhát băng qua đại dương tìm đứa con bị bắt."</li>
<li><strong>Concept</strong> — cái móc hay thế giới rộng hơn ("một thế giới nơi đồ chơi biết sống khi con người không nhìn").</li>
</ul>
<h3>Logline</h3>
<p>Một <strong>logline</strong> là lời chào hàng một câu, nêu <em>nhân vật chính</em>, <em>mục tiêu</em> và <em>chướng ngại/cái giá</em>. Nếu chưa viết được logline thì ý tưởng còn chưa hội tụ.</p>
<pre><code>Công thức logline:
 Khi [sự kiện khơi mào], một [nhân vật có khiếm khuyết]
 phải [mục tiêu] trước [cái giá] — nhưng [chướng ngại].

Ví dụ (Finding Nemo):
 Khi con bị bắt, một chú cá hề đầy sợ hãi
 phải băng qua đại dương hiểm nguy để tìm con.
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> <em>Jaws (Hàm cá mập)</em>: "Một cảnh sát trưởng sợ nước phải săn con cá mập ăn thịt đang khủng bố thị trấn biển." Một câu — nhân vật, mục tiêu, chướng ngại, và sự trớ trêu.</div>`,
  ]]);

const c1q = quiz('ans201-quiz-1', 'Quiz 1 — Idea & logline|||Quiz 1 — Ý tưởng & logline', [
  { id: 'q1', question: 'Một logline tốt phải nêu?', options: ['Toàn bộ cốt truyện từng cảnh', 'Nhân vật chính, mục tiêu và chướng ngại/cái giá', 'Danh sách diễn viên', 'Ngân sách phim'], correctIndex: 1, explanation: 'Logline một câu = hero + goal + obstacle/stakes.' },
  { id: 'q2', question: 'Công cụ sinh ý tưởng kinh điển bắt đầu bằng câu hỏi?', options: ['"Ai trả tiền?"', '"Nếu như…?" (What if…?)', '"Bao nhiêu trang?"', '"Diễn viên nào?"'], correctIndex: 1, explanation: '"What if…?" mở ra tình huống giả định để sinh tiền đề.' },
  { id: 'q3', question: 'Tiền đề (premise) thường gồm?', options: ['Nhân vật + tình huống + xung đột', 'Chỉ tên phim', 'Danh sách cảnh quay', 'Bảng chi phí'], correctIndex: 0, explanation: 'Premise nén nhân vật, tình huống và xung đột vào một câu.' },
]);

const c2 = doc('ans201-2-1-structure', '2.1 — Three-act structure & the Field paradigm|||2.1 — Cấu trúc ba hồi & mô hình Syd Field',
  'Ba hồi (setup/confrontation/resolution), plot point 1 & 2, midpoint; bản đồ theo trang của Syd Field.',
  [[
    `<span class="eyebrow">ANS201 · Chapter 2 · Lesson 2.1</span>
<h2>Three-act structure &amp; the Field paradigm</h2>
<h3>The three acts</h3>
<ul>
<li><strong>Act 1 — Setup</strong>: introduce the hero, world and want; end with the <strong>inciting incident</strong> that kicks off the story.</li>
<li><strong>Act 2 — Confrontation</strong>: the hero pursues the goal, obstacles escalate, stakes rise to a low point.</li>
<li><strong>Act 3 — Resolution</strong>: the climax and its aftermath — the goal won or lost, the hero changed.</li>
</ul>
<h3>Syd Field's paradigm</h3>
<p><strong>Syd Field</strong> mapped this onto pages: in a 120-page script, roughly Act 1 = pp.1-30, Act 2 = pp.30-90, Act 3 = pp.90-120, hinged by two <strong>plot points</strong> — turning events that spin the story in a new direction — and a <strong>midpoint</strong> that raises the stakes.</p>
<pre><code>|-- Act 1 --|------- Act 2 -------|-- Act 3 --|
 Setup      Confrontation          Resolution
   ^ Plot Point 1    ^ Midpoint   ^ Plot Point 2
</code></pre>
<div class="callout"><span class="badge">Real example</span> <em>Star Wars</em>: PP1 = Luke's family is killed, forcing him to leave home; Midpoint = trash compactor / rescue turns; PP2 = the Death Star plans reach the rebels for the final assault.</div>`,
    `<span class="eyebrow">ANS201 · Chương 2 · Bài 2.1</span>
<h2>Cấu trúc ba hồi &amp; mô hình Syd Field</h2>
<h3>Ba hồi</h3>
<ul>
<li><strong>Hồi 1 — Setup (giới thiệu)</strong>: giới thiệu nhân vật, thế giới và khao khát; kết bằng <strong>sự kiện khơi mào (inciting incident)</strong> châm ngòi câu chuyện.</li>
<li><strong>Hồi 2 — Confrontation (đối đầu)</strong>: nhân vật theo đuổi mục tiêu, chướng ngại tăng dần, cái giá lên đến đáy thấp nhất.</li>
<li><strong>Hồi 3 — Resolution (giải quyết)</strong>: cao trào và hậu quả — thắng hay thua mục tiêu, nhân vật đã thay đổi.</li>
</ul>
<h3>Mô hình của Syd Field</h3>
<p><strong>Syd Field</strong> đặt cấu trúc này lên số trang: trong kịch bản 120 trang, xấp xỉ Hồi 1 = trang 1-30, Hồi 2 = 30-90, Hồi 3 = 90-120, bản lề là hai <strong>plot point</strong> — sự kiện bước ngoặt xoay câu chuyện sang hướng mới — và một <strong>midpoint</strong> đẩy cái giá lên.</p>
<pre><code>|-- Hồi 1 --|------- Hồi 2 -------|-- Hồi 3 --|
 Giới thiệu  Đối đầu                Giải quyết
   ^ Plot Point 1   ^ Midpoint   ^ Plot Point 2
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> <em>Star Wars</em>: PP1 = gia đình Luke bị giết, buộc cậu rời nhà; Midpoint = khúc máy nghiền rác / cứu công chúa; PP2 = bản vẽ Death Star về tay quân nổi dậy cho trận đánh cuối.</div>`,
  ]]);

const c2q = quiz('ans201-quiz-2', 'Quiz 2 — Structure|||Quiz 2 — Cấu trúc', [
  { id: 'q1', question: 'Sự kiện kết thúc Hồi 1, châm ngòi cho câu chuyện gọi là?', options: ['Cao trào (climax)', 'Sự kiện khơi mào (inciting incident)', 'Đối thoại', 'Midpoint'], correctIndex: 1, explanation: 'Inciting incident khởi động câu chuyện, thường chốt cuối Hồi 1.' },
  { id: 'q2', question: 'Theo Syd Field, "plot point" là?', options: ['Một câu thoại hay', 'Sự kiện bước ngoặt xoay câu chuyện sang hướng mới', 'Tên nhân vật', 'Cỡ chữ kịch bản'], correctIndex: 1, explanation: 'Plot point là bản lề nối các hồi, đổi hướng câu chuyện.' },
  { id: 'q3', question: 'Hồi 2 (confrontation) chủ yếu làm gì?', options: ['Giới thiệu nhân vật', 'Đẩy xung đột và chướng ngại tăng dần tới đáy thấp', 'Chốt hạ mọi thứ', 'Chạy credit'], correctIndex: 1, explanation: 'Hồi 2 là nơi xung đột leo thang, cái giá dâng lên.' },
]);

const c3 = doc('ans201-3-1-hero-journey', '3.1 — Character arc & the hero’s journey|||3.1 — Hành trình nhân vật & người hùng',
  'Cung nhân vật (thay đổi), want vs need, và 12 chặng hành trình người hùng của Joseph Campbell.',
  [[
    `<span class="eyebrow">ANS201 · Chapter 3 · Lesson 3.1</span>
<h2>Character arc &amp; the hero's journey</h2>
<h3>Want vs need</h3>
<p>A rich hero pursues an external <strong>want</strong> (the goal, e.g. "win the tournament") while secretly lacking an internal <strong>need</strong> (the lesson, e.g. "learn to trust others"). The <strong>arc</strong> is the change from who they are to who they must become to get the need — often by giving up the want.</p>
<h3>Campbell's hero's journey</h3>
<p><strong>Joseph Campbell</strong> found one recurring shape (the <em>monomyth</em>): the hero leaves the ordinary world, is tested, faces an ordeal, and returns transformed.</p>
<pre><code>Hero's journey (condensed):
 1 Ordinary World  ->  2 Call to Adventure
 3 Refusal         ->  4 Meeting the Mentor
 5 Crossing the Threshold -> 6 Tests, Allies, Enemies
 7 Approach -> 8 Ordeal -> 9 Reward
 10 The Road Back -> 11 Resurrection -> 12 Return with the Elixir
</code></pre>
<div class="callout"><span class="badge">Real example</span> <em>The Lion King</em>: Simba refuses the call, meets mentors (Timon, Pumbaa, Rafiki), faces the ordeal (confronting Scar), and returns transformed to reclaim Pride Rock — a textbook monomyth.</div>`,
    `<span class="eyebrow">ANS201 · Chương 3 · Bài 3.1</span>
<h2>Hành trình nhân vật &amp; người hùng</h2>
<h3>Want (khao khát) và need (nhu cầu)</h3>
<p>Một nhân vật giàu sức sống theo đuổi một <strong>khao khát</strong> bên ngoài (mục tiêu, vd "vô địch giải đấu") trong khi âm thầm thiếu một <strong>nhu cầu</strong> bên trong (bài học, vd "học cách tin người khác"). <strong>Cung nhân vật (arc)</strong> là sự thay đổi từ con người họ đang là sang con người họ phải trở thành để đạt được nhu cầu — thường bằng cách từ bỏ khao khát.</p>
<h3>Hành trình người hùng của Campbell</h3>
<p><strong>Joseph Campbell</strong> tìm ra một khuôn hình lặp lại (<em>monomyth</em>): người hùng rời thế giới thường nhật, bị thử thách, đối mặt thử thách sinh tử, rồi trở về đã đổi khác.</p>
<pre><code>Hành trình người hùng (rút gọn):
 1 Thế giới thường  ->  2 Tiếng gọi phiêu lưu
 3 Chối từ          ->  4 Gặp người dẫn đường
 5 Vượt ngưỡng cửa  ->  6 Thử thách, đồng minh, kẻ thù
 7 Tiến đến -> 8 Thử thách sinh tử -> 9 Phần thưởng
 10 Đường về -> 11 Hồi sinh -> 12 Trở về với "linh dược"
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> <em>The Lion King (Vua sư tử)</em>: Simba chối từ tiếng gọi, gặp người dẫn đường (Timon, Pumbaa, Rafiki), đối mặt thử thách (đối đầu Scar), rồi trở về đã đổi khác để giành lại Pride Rock — một monomyth chuẩn mực.</div>`,
  ]]);

const c3q = quiz('ans201-quiz-3', 'Quiz 3 — Hero’s journey|||Quiz 3 — Hành trình người hùng', [
  { id: 'q1', question: '"Want" và "need" của nhân vật khác nhau thế nào?', options: ['Giống hệt nhau', 'Want là mục tiêu bên ngoài, need là bài học bên trong', 'Want là tên, need là tuổi', 'Cả hai đều là đạo cụ'], correctIndex: 1, explanation: 'Arc = nhân vật đạt need thường bằng cách buông want.' },
  { id: 'q2', question: 'Khái niệm "monomyth" (hành trình người hùng) gắn với ai?', options: ['Syd Field', 'Joseph Campbell', 'Blake Snyder', 'Aristotle'], correctIndex: 1, explanation: 'Campbell mô tả monomyth trong "The Hero with a Thousand Faces".' },
  { id: 'q3', question: 'Cung nhân vật (character arc) là?', options: ['Kiểu tóc của nhân vật', 'Sự thay đổi nội tâm của nhân vật qua câu chuyện', 'Số cảnh nhân vật xuất hiện', 'Màu trang phục'], correctIndex: 1, explanation: 'Arc là hành trình biến đổi từ con người cũ sang con người mới.' },
]);

const c4 = doc('ans201-4-1-conflict', '4.1 — Character, conflict, antagonist & stakes|||4.1 — Nhân vật, xung đột, phản diện & cái giá',
  'Xây nhân vật (want/flaw/backstory), ba tầng xung đột, phản diện đối trọng, và cái giá (stakes).',
  [[
    `<span class="eyebrow">ANS201 · Chapter 4 · Lesson 4.1</span>
<h2>Character, conflict, antagonist &amp; stakes</h2>
<h3>Building a character</h3>
<p>Give each character a <strong>want</strong>, a <strong>flaw</strong> (the thing standing in their own way), and a <strong>backstory wound</strong> that explains the flaw. Character is revealed by <em>choice under pressure</em>, not by description.</p>
<h3>Conflict — the engine</h3>
<p>No conflict, no story. It comes in three layers:</p>
<ul>
<li><strong>Inner</strong> — the hero vs their own flaw/fear.</li>
<li><strong>Interpersonal</strong> — hero vs antagonist and allies.</li>
<li><strong>External/social</strong> — hero vs the world, society or nature.</li>
</ul>
<h3>Antagonist &amp; stakes</h3>
<p>The best <strong>antagonist</strong> is a mirror — as strong as the hero and personally aimed at their weakness. <strong>Stakes</strong> are what is lost if the hero fails; the higher and more personal, the more we care.</p>
<div class="callout"><span class="badge">Real example</span> <em>The Dark Knight</em>: the Joker is a perfect antagonist because he attacks Batman's core rule ("no killing") — the conflict is philosophical, not just physical, and the stakes are the city's soul.</div>`,
    `<span class="eyebrow">ANS201 · Chương 4 · Bài 4.1</span>
<h2>Nhân vật, xung đột, phản diện &amp; cái giá</h2>
<h3>Xây một nhân vật</h3>
<p>Cho mỗi nhân vật một <strong>khao khát (want)</strong>, một <strong>khiếm khuyết (flaw)</strong> (thứ tự cản đường chính họ), và một <strong>vết thương quá khứ</strong> giải thích cho khiếm khuyết đó. Tính cách lộ ra qua <em>lựa chọn dưới áp lực</em>, không phải qua lời mô tả.</p>
<h3>Xung đột — động cơ của câu chuyện</h3>
<p>Không xung đột thì không có câu chuyện. Nó có ba tầng:</p>
<ul>
<li><strong>Nội tâm</strong> — nhân vật đấu với khiếm khuyết/nỗi sợ của chính mình.</li>
<li><strong>Liên cá nhân</strong> — nhân vật đối với phản diện và đồng minh.</li>
<li><strong>Bên ngoài/xã hội</strong> — nhân vật đối với thế giới, xã hội hay thiên nhiên.</li>
</ul>
<h3>Phản diện &amp; cái giá</h3>
<p><strong>Phản diện (antagonist)</strong> hay nhất là một tấm gương — mạnh ngang nhân vật chính và nhắm thẳng vào điểm yếu của họ. <strong>Cái giá (stakes)</strong> là thứ sẽ mất nếu nhân vật thất bại; càng lớn và càng riêng tư thì khán giả càng quan tâm.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> <em>The Dark Knight (Kỵ sĩ bóng đêm)</em>: Joker là phản diện hoàn hảo vì hắn tấn công đúng nguyên tắc cốt lõi của Batman ("không giết người") — xung đột mang tính triết lý, không chỉ thể chất, và cái giá là linh hồn của cả thành phố.</div>`,
  ]]);

const c4q = quiz('ans201-quiz-4', 'Quiz 4 — Conflict|||Quiz 4 — Xung đột', [
  { id: 'q1', question: 'Ba tầng xung đột cơ bản là?', options: ['To, vừa, nhỏ', 'Nội tâm, liên cá nhân, bên ngoài/xã hội', 'Sáng, tối, xám', 'Đầu, thân, kết'], correctIndex: 1, explanation: 'Xung đột chạy ở tầng nội tâm, giữa người và với thế giới.' },
  { id: 'q2', question: 'Một phản diện mạnh lý tưởng nên?', options: ['Yếu để nhân vật dễ thắng', 'Là tấm gương, mạnh ngang và nhắm vào điểm yếu của nhân vật chính', 'Không bao giờ xuất hiện', 'Chỉ để chọc cười'], correctIndex: 1, explanation: 'Phản diện tốt thử thách đúng khiếm khuyết của hero, đẩy arc.' },
  { id: 'q3', question: '"Stakes" (cái giá) trong câu chuyện là?', options: ['Tên nhân vật', 'Thứ sẽ mất nếu nhân vật thất bại', 'Số trang kịch bản', 'Địa điểm quay'], correctIndex: 1, explanation: 'Cái giá càng cao và riêng tư, khán giả càng quan tâm.' },
]);

const c5 = doc('ans201-5-1-beat-sheet', '5.1 — Scene, beat & the Save the Cat beat sheet|||5.1 — Cảnh, nhịp & beat sheet Save the Cat',
  'Cảnh (scene) và nhịp (beat), 15 nhịp Save the Cat của Blake Snyder, và pacing (nhịp độ).',
  [[
    `<span class="eyebrow">ANS201 · Chapter 5 · Lesson 5.1</span>
<h2>Scene, beat &amp; the Save the Cat beat sheet</h2>
<h3>Scenes and beats</h3>
<ul>
<li><strong>Scene</strong> — a unit of story in one place/time where something <em>changes</em> (a value flips: safe→danger, hope→despair). If nothing changes, cut it.</li>
<li><strong>Beat</strong> — the smallest unit: a single action/reaction that turns the moment.</li>
</ul>
<h3>Blake Snyder's beat sheet</h3>
<p><strong>Save the Cat!</strong> breaks a story into <strong>15 beats</strong> at set positions — a practical map from opening image to final image.</p>
<pre><code>15 beats (abridged):
 Opening Image · Theme Stated · Setup
 Catalyst · Debate · Break into Two
 B Story · Fun and Games · Midpoint
 Bad Guys Close In · All Is Lost · Dark Night of the Soul
 Break into Three · Finale · Final Image
</code></pre>
<h3>Pacing</h3>
<p><strong>Pacing</strong> is the rhythm of tension — alternate fast, high-conflict scenes with slower breathers so the audience never numbs out or gets bored.</p>
<div class="callout"><span class="badge">Real example</span> <em>Save the Cat</em> is named for the beat where the hero does something kind early on (e.g. Aladdin gives bread to hungry kids) so we root for them.</div>`,
    `<span class="eyebrow">ANS201 · Chương 5 · Bài 5.1</span>
<h2>Cảnh, nhịp &amp; beat sheet Save the Cat</h2>
<h3>Cảnh (scene) và nhịp (beat)</h3>
<ul>
<li><strong>Cảnh (scene)</strong> — một đơn vị câu chuyện trong một nơi/thời điểm, ở đó có gì đó <em>thay đổi</em> (một giá trị bị lật: an toàn→nguy hiểm, hy vọng→tuyệt vọng). Nếu không có gì đổi, cắt bỏ.</li>
<li><strong>Nhịp (beat)</strong> — đơn vị nhỏ nhất: một hành động/phản ứng xoay chuyển khoảnh khắc.</li>
</ul>
<h3>Beat sheet của Blake Snyder</h3>
<p><strong>Save the Cat!</strong> chia câu chuyện thành <strong>15 nhịp</strong> ở các vị trí cố định — một bản đồ thực dụng từ hình ảnh mở đầu đến hình ảnh kết.</p>
<pre><code>15 nhịp (rút gọn):
 Hình ảnh mở đầu · Nêu chủ đề · Giới thiệu
 Chất xúc tác · Do dự · Bước vào Hồi hai
 Câu chuyện B · Vui chơi (Fun and Games) · Midpoint
 Phe ác siết lại · Mất tất cả · Đêm tối của tâm hồn
 Bước vào Hồi ba · Cao trào · Hình ảnh kết
</code></pre>
<h3>Nhịp độ (pacing)</h3>
<p><strong>Pacing</strong> là nhịp điệu của căng thẳng — xen kẽ cảnh nhanh, nhiều xung đột với cảnh chậm cho thở, để khán giả không chai lì cũng không chán.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> <em>"Save the Cat"</em> được đặt tên theo nhịp mà nhân vật làm một việc tử tế sớm (vd Aladdin đưa bánh mì cho lũ trẻ đói) để khán giả đứng về phía họ.</div>`,
  ]]);

const c5q = quiz('ans201-quiz-5', 'Quiz 5 — Beat sheet|||Quiz 5 — Beat sheet', [
  { id: 'q1', question: 'Một "cảnh" (scene) hiệu quả cần điều gì?', options: ['Có ít nhất 3 nhân vật', 'Có một sự thay đổi giá trị (value flip)', 'Dài đúng 1 trang', 'Không có đối thoại'], correctIndex: 1, explanation: 'Cảnh không làm gì đổi thì nên cắt; cảnh phải lật một giá trị.' },
  { id: 'q2', question: 'Beat sheet 15 nhịp gắn với sách/tác giả nào?', options: ['Screenplay — Syd Field', 'Save the Cat! — Blake Snyder', 'Story — Robert McKee', 'Poetics — Aristotle'], correctIndex: 1, explanation: 'Blake Snyder đưa ra beat sheet 15 nhịp trong Save the Cat!.' },
  { id: 'q3', question: 'Pacing (nhịp độ) tốt thường?', options: ['Giữ mọi cảnh cùng tốc độ', 'Xen kẽ cảnh căng nhanh với cảnh chậm cho thở', 'Chỉ toàn cảnh hành động', 'Không có cao trào'], correctIndex: 1, explanation: 'Xen kẽ căng–chùng giữ khán giả không chai lì hay chán.' },
]);

const c6 = doc('ans201-6-1-dialogue', '6.1 — Dialogue, subtext & voice|||6.1 — Đối thoại, subtext & giọng',
  'Đối thoại hay (ngắn, có mục đích), subtext (ý ngầm), show-not-tell, và giọng riêng của từng nhân vật.',
  [[
    `<span class="eyebrow">ANS201 · Chapter 6 · Lesson 6.1</span>
<h2>Dialogue, subtext &amp; voice</h2>
<h3>What good dialogue does</h3>
<p>Dialogue is not real speech — it's <em>compressed</em> speech with purpose. Every line should do at least one of: reveal character, advance plot, or raise tension. Cut small talk that does none.</p>
<h3>Subtext — the unspoken</h3>
<p><strong>Subtext</strong> is what characters <em>mean</em> beneath what they <em>say</em>. People rarely state their feelings directly; a line like "It's fine." can carry anger, grief or love depending on the scene. Great dialogue lives in the gap between text and subtext.</p>
<h3>Show, don't tell</h3>
<p>Prefer action and behaviour over on-the-nose explanation. Instead of a character saying "I'm nervous," show a trembling hand. The audience feels what they discover, not what they're told.</p>
<h3>Voice</h3>
<p>Each character should have a distinct <strong>voice</strong> — word choice, rhythm and vocabulary — so you could tell who's speaking with the names removed.</p>
<div class="callout"><span class="badge">Real example</span> In <em>Casablanca</em>, "We'll always have Paris" says goodbye, love and sacrifice at once — pure subtext; the plainer "I still love you but you must leave" would kill the scene.</div>`,
    `<span class="eyebrow">ANS201 · Chương 6 · Bài 6.1</span>
<h2>Đối thoại, subtext &amp; giọng</h2>
<h3>Đối thoại hay làm gì</h3>
<p>Đối thoại không phải lời nói thật ngoài đời — nó là lời nói <em>được nén lại</em>, có mục đích. Mỗi câu nên làm ít nhất một việc: hé lộ tính cách, đẩy cốt truyện, hoặc nâng căng thẳng. Cắt hết những câu tán gẫu không làm gì.</p>
<h3>Subtext — điều không nói ra</h3>
<p><strong>Subtext</strong> là điều nhân vật <em>thật sự muốn nói</em> nằm dưới điều họ <em>nói ra</em>. Người ta hiếm khi phát biểu thẳng cảm xúc; một câu "Không sao đâu." có thể mang giận dữ, đau buồn hay tình yêu tùy cảnh. Đối thoại hay sống trong khoảng cách giữa lời và ý ngầm.</p>
<h3>Show, don’t tell (cho thấy, đừng kể)</h3>
<p>Ưu tiên hành động và cử chỉ hơn là giải thích lộ liễu. Thay vì để nhân vật nói "Tôi đang lo," hãy cho thấy một bàn tay run. Khán giả cảm nhận điều họ tự khám phá, không phải điều bị kể cho nghe.</p>
<h3>Giọng (voice)</h3>
<p>Mỗi nhân vật nên có một <strong>giọng</strong> riêng — cách chọn từ, nhịp điệu và vốn từ — để bỏ tên đi bạn vẫn biết ai đang nói.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Trong <em>Casablanca</em>, câu "We'll always have Paris" cùng lúc nói lời chia tay, tình yêu và sự hy sinh — subtext thuần túy; câu thẳng "Anh vẫn yêu em nhưng em phải đi" sẽ giết chết cảnh đó.</div>`,
  ]]);

const c6q = quiz('ans201-quiz-6', 'Quiz 6 — Dialogue|||Quiz 6 — Đối thoại', [
  { id: 'q1', question: '"Subtext" trong đối thoại là?', options: ['Phụ đề dưới màn hình', 'Ý ngầm bên dưới điều nhân vật nói ra', 'Chữ in nhỏ', 'Lời dẫn của người kể'], correctIndex: 1, explanation: 'Subtext là ý thật nằm dưới lời thoại bề mặt.' },
  { id: 'q2', question: 'Nguyên tắc "show, don’t tell" khuyên?', options: ['Giải thích cảm xúc trực tiếp', 'Cho thấy qua hành động/cử chỉ thay vì kể ra', 'Viết thật nhiều lời dẫn', 'Bỏ hết hình ảnh'], correctIndex: 1, explanation: 'Cho khán giả tự khám phá qua hành động, đừng nói toạc.' },
  { id: 'q3', question: 'Mỗi câu thoại tốt nên làm ít nhất một trong?', options: ['Kéo dài thời lượng', 'Hé lộ tính cách, đẩy cốt truyện, hoặc nâng căng thẳng', 'Lặp lại câu trước', 'Nêu tên phim'], correctIndex: 1, explanation: 'Thoại vô mục đích thì cắt; mỗi câu phải "làm việc".' },
]);

const c7 = doc('ans201-7-1-format', '7.1 — Script format for film, animation & games|||7.1 — Định dạng kịch bản: phim, hoạt hình & game',
  'Định dạng screenplay chuẩn (slug line, action, dialogue), storyboard & animatic, và kịch bản cho game.',
  [[
    `<span class="eyebrow">ANS201 · Chapter 7 · Lesson 7.1</span>
<h2>Script format for film, animation &amp; games</h2>
<h3>Standard screenplay format</h3>
<p>A screenplay uses a strict format so 1 page ≈ 1 minute of screen time:</p>
<ul>
<li><strong>Slug line (scene heading)</strong> — INT./EXT. LOCATION — TIME (e.g. "INT. SPACESHIP — NIGHT").</li>
<li><strong>Action</strong> — present-tense description of what we see and hear.</li>
<li><strong>Character cue + dialogue</strong> — the name centered, the line below.</li>
<li><strong>Parenthetical / transition</strong> — brief acting notes; CUT TO:.</li>
</ul>
<h3>Storyboard &amp; animatic</h3>
<p>For <strong>animation</strong>, the script becomes a <strong>storyboard</strong> (drawn panels of each shot), then an <strong>animatic</strong> (the boards edited to timing with temp audio) — testing the story visually before expensive animation.</p>
<h3>Game scripts</h3>
<p><strong>Games</strong> add <em>interactivity</em>: writing is non-linear — branching dialogue, player choices, and multiple outcomes — often planned as a flowchart or dialogue tree, not a straight page.</p>
<div class="callout"><span class="badge">Rule of thumb</span> Film/TV = linear pages; animation = board then animatic; games = branching trees. Same story craft, different container.</div>`,
    `<span class="eyebrow">ANS201 · Chương 7 · Bài 7.1</span>
<h2>Định dạng kịch bản: phim, hoạt hình &amp; game</h2>
<h3>Định dạng screenplay chuẩn</h3>
<p>Kịch bản dùng định dạng chặt để 1 trang ≈ 1 phút thời lượng:</p>
<ul>
<li><strong>Slug line (đầu cảnh)</strong> — INT./EXT. ĐỊA ĐIỂM — THỜI GIAN (vd "INT. TÀU VŨ TRỤ — ĐÊM").</li>
<li><strong>Action (mô tả)</strong> — mô tả thì hiện tại điều ta thấy và nghe.</li>
<li><strong>Tên nhân vật + thoại</strong> — tên căn giữa, câu thoại bên dưới.</li>
<li><strong>Ghi chú diễn/chuyển cảnh</strong> — ghi chú diễn xuất ngắn; CUT TO:.</li>
</ul>
<h3>Storyboard &amp; animatic</h3>
<p>Với <strong>hoạt hình</strong>, kịch bản biến thành <strong>storyboard</strong> (các khung vẽ từng cú máy), rồi thành <strong>animatic</strong> (ghép các khung theo đúng thời lượng kèm âm thanh tạm) — thử câu chuyện bằng hình trước khi diễn hoạt tốn kém.</p>
<h3>Kịch bản game</h3>
<p><strong>Game</strong> thêm yếu tố <em>tương tác</em>: viết theo lối phi tuyến — đối thoại rẽ nhánh, lựa chọn của người chơi, và nhiều kết cục — thường lập kế hoạch dưới dạng lưu đồ hay cây đối thoại, không phải trang thẳng.</p>
<div class="callout"><span class="badge">Nguyên tắc chung</span> Phim/TV = trang tuyến tính; hoạt hình = storyboard rồi animatic; game = cây rẽ nhánh. Cùng một kỹ nghệ kể chuyện, khác vật chứa.</div>`,
  ]]);

const c7q = quiz('ans201-quiz-7', 'Quiz 7 — Script format|||Quiz 7 — Định dạng kịch bản', [
  { id: 'q1', question: 'Trong screenplay, "slug line" (đầu cảnh) cho biết?', options: ['Tên diễn viên', 'INT./EXT., địa điểm và thời gian của cảnh', 'Số tiền cảnh quay', 'Nhạc nền'], correctIndex: 1, explanation: 'Slug line: INT./EXT. LOCATION — TIME mở mỗi cảnh.' },
  { id: 'q2', question: 'Với hoạt hình, thứ tự thử câu chuyện bằng hình thường là?', options: ['Animatic rồi mới storyboard', 'Storyboard rồi animatic', 'Chỉ cần trang chữ', 'Không cần bước nào'], correctIndex: 1, explanation: 'Vẽ storyboard trước, ghép thành animatic để kiểm nhịp.' },
  { id: 'q3', question: 'Kịch bản game khác phim chủ yếu ở?', options: ['Không cần nhân vật', 'Tính tương tác: rẽ nhánh, lựa chọn, nhiều kết cục', 'Không có đối thoại', 'Luôn ngắn hơn'], correctIndex: 1, explanation: 'Game viết phi tuyến bằng cây đối thoại/lưu đồ.' },
]);

const c8 = doc('ans201-8-1-rewrite', '8.1 — Rewriting, feedback & pitching|||8.1 — Sửa, phản hồi & chào ý tưởng (pitch)',
  'Bản nháp đầu, quy trình rewrite (structure→scene→line), nhận phản hồi, và pitch từ ý tưởng tới kịch bản hoàn chỉnh.',
  [[
    `<span class="eyebrow">ANS201 · Chapter 8 · Lesson 8.1</span>
<h2>Rewriting, feedback &amp; pitching</h2>
<h3>The first draft is not the script</h3>
<p>"Writing is rewriting." The first draft exists to be fixed. Rewrite in <strong>passes</strong>, big to small, so you don't polish a line you'll later delete:</p>
<ol>
<li><strong>Structure pass</strong> — do the acts, beats and arc work? Fix the skeleton first.</li>
<li><strong>Scene pass</strong> — does each scene turn a value and earn its place?</li>
<li><strong>Line pass</strong> — tighten dialogue, sharpen action, cut the fat.</li>
</ol>
<h3>Getting feedback</h3>
<p>Show the draft to trusted readers. Listen for <em>where</em> attention drops or confusion starts — readers are reliable at spotting problems, less so at prescribing fixes. Note the pattern across several notes, don't obey any single one blindly.</p>
<h3>Pitching</h3>
<p>A <strong>pitch</strong> sells the story fast: logline, then the hook, the hero and the stakes, in a minute or two. It's how an idea becomes a greenlit project — the last step from idea to finished, produced script.</p>
<div class="callout"><span class="badge">Real example</span> Pixar's rule: "You admire a character for trying more than for their successes." Rewrites often add a flaw and a struggle the first draft lacked — that's where a script comes alive.</div>`,
    `<span class="eyebrow">ANS201 · Chương 8 · Bài 8.1</span>
<h2>Sửa, phản hồi &amp; chào ý tưởng (pitch)</h2>
<h3>Bản nháp đầu chưa phải là kịch bản</h3>
<p>"Viết chính là viết lại." Bản nháp đầu tồn tại để được sửa. Hãy sửa theo <strong>từng lượt</strong>, từ lớn tới nhỏ, để khỏi mài một câu mà sau này bạn sẽ xóa:</p>
<ol>
<li><strong>Lượt cấu trúc</strong> — các hồi, nhịp và arc có ổn không? Sửa bộ xương trước.</li>
<li><strong>Lượt cảnh</strong> — mỗi cảnh có lật một giá trị và xứng đáng có mặt không?</li>
<li><strong>Lượt câu chữ</strong> — siết đối thoại, làm sắc hành động, cắt phần thừa.</li>
</ol>
<h3>Nhận phản hồi</h3>
<p>Đưa bản nháp cho những người đọc tin cậy. Hãy lắng nghe <em>chỗ nào</em> sự chú ý tụt xuống hoặc bắt đầu rối — người đọc giỏi phát hiện vấn đề, kém hơn ở việc kê đơn sửa. Ghi lại khuôn mẫu lặp qua nhiều ý kiến, đừng mù quáng nghe theo một ý riêng lẻ.</p>
<h3>Chào ý tưởng (pitch)</h3>
<p>Một <strong>pitch</strong> bán câu chuyện thật nhanh: logline, rồi cái móc, nhân vật và cái giá, gói trong một hai phút. Đó là cách một ý tưởng trở thành dự án được duyệt — bước cuối từ ý tưởng đến kịch bản hoàn chỉnh, được sản xuất.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Quy tắc của Pixar: "Ta khâm phục nhân vật vì nỗ lực hơn là vì thành công của họ." Các lượt sửa thường thêm một khiếm khuyết và một cuộc vật lộn mà bản nháp đầu còn thiếu — chính ở đó kịch bản sống dậy.</div>`,
  ]]);

const c8q = quiz('ans201-quiz-8', 'Quiz 8 — Rewrite & pitch|||Quiz 8 — Sửa & pitch', [
  { id: 'q1', question: 'Nên sửa (rewrite) kịch bản theo thứ tự nào?', options: ['Câu chữ trước, cấu trúc sau', 'Cấu trúc → cảnh → câu chữ (lớn tới nhỏ)', 'Chỉ sửa chính tả', 'Không cần sửa'], correctIndex: 1, explanation: 'Sửa bộ xương trước để khỏi mài câu sẽ bị xóa.' },
  { id: 'q2', question: 'Khi nhận phản hồi, người đọc đáng tin nhất ở việc?', options: ['Kê đơn cách sửa chính xác', 'Chỉ ra CHỖ có vấn đề (chú ý tụt, rối)', 'Viết lại hộ kịch bản', 'Đặt tên phim'], correctIndex: 1, explanation: 'Người đọc giỏi phát hiện vấn đề, kém ở việc kê đơn sửa.' },
  { id: 'q3', question: 'Một "pitch" tốt gồm?', options: ['Toàn bộ kịch bản đọc to', 'Logline, cái móc, nhân vật và cái giá — gọn trong ít phút', 'Chỉ ngân sách', 'Danh sách đạo cụ'], correctIndex: 1, explanation: 'Pitch bán câu chuyện nhanh: hook + hero + stakes.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'ANS201',
    slug: 'ans201-idea-script-development',
    title: 'Idea & Script Development',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ANS201.webp',
    shortDescription: 'From idea to finished script — logline, three-act structure (Field), the hero’s journey & character arc, conflict & antagonist, the Save the Cat beat sheet, dialogue & subtext, script format for film/animation/games, and rewriting. Bilingual, with real film examples.|||Từ ý tưởng đến kịch bản — logline, cấu trúc ba hồi (Field), hành trình nhân vật, xung đột & phản diện, beat sheet Save the Cat, đối thoại & subtext, định dạng cho phim/hoạt hình/game, và sửa bản. Song ngữ, ví dụ phim thật.',
    description: 'Môn <strong>ANS201 — Idea & Script Development</strong> (kỳ 3, ngành Thiết kế mỹ thuật số) dạy bạn <strong>biến ý tưởng thành kịch bản hoàn chỉnh</strong>. Từ <strong>sinh ý tưởng &amp; logline</strong> → <strong>cấu trúc ba hồi</strong> (mô hình Syd Field) → <strong>hành trình nhân vật &amp; người hùng</strong> (Joseph Campbell) → <strong>nhân vật, xung đột &amp; phản diện</strong> → <strong>cấu trúc cảnh &amp; beat sheet</strong> (Blake Snyder, Save the Cat) → <strong>đối thoại &amp; subtext</strong> → <strong>định dạng kịch bản</strong> (phim/hoạt hình/game) → <strong>sửa &amp; pitch</strong>. Bám giáo trình chuẩn quốc tế (McKee, Field, Snyder, Campbell), song ngữ, có ví dụ phim thật và quiz mỗi chương.',
    whatYouLearn: 'Brainstorm & logline một câu; tiền đề vs concept; cấu trúc ba hồi, plot point, midpoint; want vs need & cung nhân vật; 12 chặng hành trình người hùng; xây nhân vật, ba tầng xung đột, phản diện & cái giá; cảnh, nhịp, beat sheet 15 nhịp & pacing; đối thoại, subtext, show-not-tell, giọng riêng; định dạng screenplay, storyboard/animatic, kịch bản game; quy trình rewrite, nhận phản hồi & pitch.',
    requirements: 'Không cần nền chuyên môn. Nên thích xem phim/kể chuyện và sẵn sàng viết. Có phần mềm viết kịch bản miễn phí (Celtx, WriterDuet) là một lợi thế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách kinh điển (McKee, Snyder, Field, Campbell), FLM, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Kịch bản là gì, vì sao câu chuyện có cấu trúc, lộ trình 4 bước.', lessons: [intro] },
    { title: 'Chương 1 — Phát triển ý tưởng|||Chapter 1 — Idea development', description: 'Brainstorm, tiền đề, concept, logline.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Cấu trúc câu chuyện|||Chapter 2 — Story structure', description: 'Ba hồi, mô hình Syd Field, plot point.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Hành trình nhân vật|||Chapter 3 — Character journey', description: 'Character arc, hero journey, want vs need.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Nhân vật & xung đột|||Chapter 4 — Character & conflict', description: 'Xây nhân vật, xung đột, phản diện, cái giá.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Cấu trúc cảnh & nhịp|||Chapter 5 — Scene & beat', description: 'Scene, beat, beat sheet Save the Cat, pacing.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đối thoại & subtext|||Chapter 6 — Dialogue & subtext', description: 'Đối thoại, subtext, show-not-tell, giọng.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Định dạng kịch bản|||Chapter 7 — Script format', description: 'Screenplay, storyboard/animatic, phim/hoạt hình/game.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Sửa & phát triển|||Chapter 8 — Rewrite & develop', description: 'Rewrite, phản hồi, pitch, tới kịch bản hoàn chỉnh.', lessons: [c8, c8q] },
  ],
};
