/**
 * AET102c — Aesthetics (Mỹ học). Ngành Thiết kế mỹ thuật số (Digital Art &
 * Design), FPTU. KHUNG chất lượng: 8 chương triết học & ứng dụng mỹ học —
 * cái đẹp là gì, lịch sử tư tưởng (Plato/Aristotle → Kant/Hegel), các phạm
 * trù thẩm mỹ, trải nghiệm & thị hiếu, cái đẹp trong thiết kế, mỹ học Á Đông
 * & Việt Nam, mỹ học đương đại & số. Song ngữ + triết gia/lý thuyết + ví dụ
 * tác phẩm/thiết kế thật, quiz mỗi chương.
 * Nguồn: Bender "Aesthetics: A Very Short Introduction", Kant "Critique of
 * Judgment" (tổng quan), Beardsley "Aesthetics", mỹ học thiết kế.
 * Giữ NGUYÊN slug/semester/thumb(v3)/courseCode. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('aet102c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách nhập môn mỹ học, văn bản gốc miễn phí, YouTube, bảo tàng số, lộ trình tự học.',
  [[
    `<span class="eyebrow">AET102c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study <strong>aesthetics</strong> — the philosophy of beauty, art and taste, and how those ideas feed <strong>design</strong> — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for AET102c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Bender &amp; Blocker, <em>Aesthetics: A Very Short Introduction</em> — a compact entry point.</li>
<li>Immanuel Kant, <em>Critique of the Power of Judgment</em> (1790) — the founding text on aesthetic judgment.</li>
<li>Monroe Beardsley, <em>Aesthetics: Problems in the Philosophy of Criticism</em>.</li>
</ul>
<h3>🌐 Free primary texts &amp; encyclopedias</h3>
<ul>
<li><a href="https://plato.stanford.edu/entries/aesthetic-concept/" target="_blank" rel="noopener">Stanford Encyclopedia of Philosophy — Aesthetics entries</a></li>
<li><a href="https://www.gutenberg.org/" target="_blank" rel="noopener">Project Gutenberg — Kant, Hume, Burke in the public domain</a></li>
</ul>
<h3>▶️ Video</h3>
<ul>
<li><a href="https://www.youtube.com/@thenationalgallery" target="_blank" rel="noopener">The National Gallery</a> — reading real paintings.</li>
<li><a href="https://smarthistory.org/" target="_blank" rel="noopener">Smarthistory</a> — free art-history essays &amp; videos.</li>
</ul>
<h3>🖼️ Museums &amp; collections</h3>
<ul>
<li><a href="https://www.metmuseum.org/art/collection" target="_blank" rel="noopener">The Met — open-access collection</a></li>
<li><a href="https://artsandculture.google.com/" target="_blank" rel="noopener">Google Arts &amp; Culture</a> — high-resolution works worldwide.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — what aesthetics is, the core categories (beauty, sublime, tragic, comic).</li>
<li><strong>History &amp; theory</strong> — Plato and Aristotle, then Kant on disinterested judgment.</li>
<li><strong>Experience</strong> — read one artwork closely; describe why it moves you, not just that it does.</li>
<li><strong>Apply</strong> — carry proportion, harmony and simplicity into your own design work.</li>
</ol></div>`,
    `<span class="eyebrow">AET102c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>mỹ học</strong> — triết học về cái đẹp, nghệ thuật và thị hiếu, và cách các ý tưởng đó nuôi <strong>thiết kế</strong> — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của AET102c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Bender &amp; Blocker, <em>Aesthetics: A Very Short Introduction</em> — cửa vào ngắn gọn.</li>
<li>Immanuel Kant, <em>Phê phán năng lực phán đoán</em> (1790) — văn bản nền tảng về phán đoán thẩm mỹ.</li>
<li>Monroe Beardsley, <em>Aesthetics: Problems in the Philosophy of Criticism</em>.</li>
</ul>
<h3>🌐 Văn bản gốc &amp; bách khoa miễn phí</h3>
<ul>
<li><a href="https://plato.stanford.edu/entries/aesthetic-concept/" target="_blank" rel="noopener">Stanford Encyclopedia of Philosophy — mục Mỹ học</a></li>
<li><a href="https://www.gutenberg.org/" target="_blank" rel="noopener">Project Gutenberg — Kant, Hume, Burke thuộc phạm vi công cộng</a></li>
</ul>
<h3>▶️ Video</h3>
<ul>
<li><a href="https://www.youtube.com/@thenationalgallery" target="_blank" rel="noopener">The National Gallery</a> — đọc tranh thật.</li>
<li><a href="https://smarthistory.org/" target="_blank" rel="noopener">Smarthistory</a> — bài &amp; video lịch sử nghệ thuật miễn phí.</li>
</ul>
<h3>🖼️ Bảo tàng &amp; bộ sưu tập</h3>
<ul>
<li><a href="https://www.metmuseum.org/art/collection" target="_blank" rel="noopener">The Met — bộ sưu tập mở</a></li>
<li><a href="https://artsandculture.google.com/" target="_blank" rel="noopener">Google Arts &amp; Culture</a> — tác phẩm độ phân giải cao toàn cầu.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — mỹ học là gì, các phạm trù lõi (cái đẹp, cái cao cả, cái bi, cái hài).</li>
<li><strong>Lịch sử &amp; lý thuyết</strong> — Plato và Aristotle, rồi Kant về phán đoán vô tư.</li>
<li><strong>Trải nghiệm</strong> — đọc kỹ một tác phẩm; nói vì sao nó lay động bạn, không chỉ rằng nó lay động.</li>
<li><strong>Ứng dụng</strong> — mang tỉ lệ, hài hoà và tối giản vào chính công việc thiết kế của bạn.</li>
</ol></div>`,
  ]]);

const intro = doc('aet102c-0-1-overview', 'Course overview: what is aesthetics?|||Tổng quan: mỹ học là gì?',
  'Mỹ học nghiên cứu gì; vì sao người thiết kế cần nó; lộ trình: cái đẹp & phạm trù → lịch sử tư tưởng → Kant → trải nghiệm → thiết kế → Á Đông/Việt Nam → mỹ học số.',
  [[
    `<span class="eyebrow">AET102c · Lesson 0.1 · Overview</span>
<h2>What is aesthetics?</h2>
<p class="lead"><strong>Aesthetics</strong> is the branch of philosophy that asks what <strong>beauty</strong> is, what <strong>art</strong> is, and how we <strong>judge</strong> and experience them. The word comes from the Greek <em>aisthesis</em> — &quot;sense perception&quot; — coined for philosophy by Alexander Baumgarten in 1750.</p>
<h3>Why a designer studies it</h3>
<p>Design decisions are aesthetic judgments made hundreds of times a day: this proportion, this colour, this amount of empty space. Aesthetics gives you the <strong>vocabulary and reasons</strong> behind &quot;this looks right&quot; — so you can defend a choice, not just feel it.</p>
<h3>Roadmap</h3>
<p>What beauty &amp; the aesthetic categories are → the history of aesthetic thought (Plato, Aristotle → Kant, Hegel) → Kant &amp; modern aesthetics → the categories in depth → aesthetic experience &amp; taste → beauty in design → East Asian &amp; Vietnamese aesthetics → contemporary, digital &amp; AI aesthetics. Bilingual, with real works and a quiz each chapter.</p>`,
    `<span class="eyebrow">AET102c · Bài 0.1 · Tổng quan</span>
<h2>Mỹ học là gì?</h2>
<p class="lead"><strong>Mỹ học</strong> là nhánh triết học hỏi <strong>cái đẹp</strong> là gì, <strong>nghệ thuật</strong> là gì, và ta <strong>phán đoán</strong> cùng cảm thụ chúng thế nào. Từ này gốc Hy Lạp <em>aisthesis</em> — &quot;tri giác qua giác quan&quot; — được Alexander Baumgarten đưa vào triết học năm 1750.</p>
<h3>Vì sao người thiết kế học nó</h3>
<p>Quyết định thiết kế là những phán đoán thẩm mỹ lặp lại hàng trăm lần mỗi ngày: tỉ lệ này, màu này, khoảng trống này. Mỹ học cho bạn <strong>vốn từ và lý do</strong> đằng sau câu &quot;nhìn thấy đúng&quot; — để bạn bảo vệ được lựa chọn, chứ không chỉ cảm thấy.</p>
<h3>Lộ trình</h3>
<p>Cái đẹp &amp; các phạm trù thẩm mỹ → lịch sử tư tưởng mỹ học (Plato, Aristotle → Kant, Hegel) → Kant &amp; mỹ học hiện đại → các phạm trù đào sâu → trải nghiệm &amp; thị hiếu → cái đẹp trong thiết kế → mỹ học Á Đông &amp; Việt Nam → mỹ học đương đại, số &amp; AI. Song ngữ, có tác phẩm thật và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('aet102c-1-1-what-is-aesthetics', '1.1 — What aesthetics studies|||1.1 — Mỹ học nghiên cứu gì',
  'Đối tượng của mỹ học: cái đẹp, giá trị thẩm mỹ, các phạm trù; phân biệt mỹ học với lý thuyết nghệ thuật; câu hỏi cái đẹp là chủ quan hay khách quan.',
  [[
    `<span class="eyebrow">AET102c · Chapter 1 · Lesson 1.1</span>
<h2>What aesthetics studies</h2>
<h3>The core questions</h3>
<ul>
<li><strong>Beauty</strong> — what makes something beautiful? Is it a property of the object, or of our response to it?</li>
<li><strong>Aesthetic value</strong> — why do we prize some things (a sunset, a sonata) for how they look or sound, apart from any use?</li>
<li><strong>The aesthetic categories</strong> — beauty is only one. We also respond to the <em>sublime</em>, the <em>tragic</em>, the <em>comic</em>, and even the <em>ugly</em>.</li>
</ul>
<h3>Aesthetics vs. the philosophy of art</h3>
<p>They overlap but differ. <strong>Aesthetics</strong> covers all aesthetic experience — a mountain, a face, a well-made chair. The <strong>philosophy of art</strong> asks the narrower question &quot;what is art, and what makes an artwork good?&quot; A storm can be sublime without being art.</p>
<h3>Objective or subjective?</h3>
<p>The oldest debate: is beauty &quot;in the object&quot; (a real proportion we discover) or &quot;in the eye of the beholder&quot; (a feeling we project)? David Hume argued taste can be <strong>refined</strong> and that qualified critics converge — so it is neither pure fact nor pure whim.</p>
<div class="callout"><span class="badge">For designers</span> Treat beauty as a claim you can argue, using shared reasons (proportion, contrast, fit to purpose), not as &quot;I just like it.&quot;</div>`,
    `<span class="eyebrow">AET102c · Chương 1 · Bài 1.1</span>
<h2>Mỹ học nghiên cứu gì</h2>
<h3>Các câu hỏi lõi</h3>
<ul>
<li><strong>Cái đẹp</strong> — điều gì khiến một vật đẹp? Đó là thuộc tính của đối tượng, hay của phản ứng nơi ta?</li>
<li><strong>Giá trị thẩm mỹ</strong> — vì sao ta quý một số thứ (hoàng hôn, bản sonata) vì hình dáng hay âm thanh của chúng, tách khỏi mọi công dụng?</li>
<li><strong>Các phạm trù thẩm mỹ</strong> — cái đẹp chỉ là một. Ta còn đáp lại cái <em>cao cả</em>, cái <em>bi</em>, cái <em>hài</em>, và cả cái <em>xấu</em>.</li>
</ul>
<h3>Mỹ học và triết học nghệ thuật</h3>
<p>Chúng giao nhau nhưng khác. <strong>Mỹ học</strong> bao trùm mọi trải nghiệm thẩm mỹ — ngọn núi, gương mặt, chiếc ghế đóng khéo. <strong>Triết học nghệ thuật</strong> hỏi hẹp hơn: &quot;nghệ thuật là gì, và điều gì làm một tác phẩm hay?&quot; Một cơn bão có thể cao cả mà không phải nghệ thuật.</p>
<h3>Khách quan hay chủ quan?</h3>
<p>Cuộc tranh luận xưa nhất: cái đẹp &quot;nằm trong đối tượng&quot; (một tỉ lệ có thật ta khám phá) hay &quot;nằm trong mắt người ngắm&quot; (một cảm giác ta phóng chiếu)? David Hume lập luận rằng thị hiếu có thể được <strong>rèn giũa</strong> và những nhà phê bình đủ tầm sẽ hội tụ — nên nó không thuần sự thật cũng không thuần tuỳ hứng.</p>
<div class="callout"><span class="badge">Với người thiết kế</span> Hãy coi cái đẹp là một khẳng định có thể lập luận, bằng lý do chung (tỉ lệ, tương phản, hợp mục đích), không phải &quot;tôi thích thế thôi.&quot;</div>`,
  ]]);

const c1q = quiz('aet102c-quiz-1', 'Quiz 1 — What aesthetics is|||Quiz 1 — Mỹ học là gì', [
  { id: 'q1', question: 'Từ "aesthetics" bắt nguồn từ chữ Hy Lạp "aisthesis" nghĩa là?|||The word "aesthetics" comes from the Greek "aisthesis", meaning?', options: ['Cái đẹp|||Beauty', 'Tri giác qua giác quan|||Sense perception', 'Nghệ thuật|||Art', 'Phán đoán|||Judgment'], correctIndex: 1, explanation: 'Baumgarten (1750) lập ngành từ "aisthesis" = tri giác cảm tính.' },
  { id: 'q2', question: 'Khác biệt chính giữa mỹ học và triết học nghệ thuật?|||The main difference between aesthetics and the philosophy of art?', options: ['Chúng hoàn toàn giống nhau|||They are identical', 'Mỹ học bao mọi trải nghiệm thẩm mỹ, triết học nghệ thuật chỉ hỏi về nghệ thuật|||Aesthetics covers all aesthetic experience; philosophy of art asks only about art', 'Mỹ học chỉ về hội hoạ|||Aesthetics is only about painting', 'Triết học nghệ thuật không bàn cái đẹp|||Philosophy of art ignores beauty'], correctIndex: 1, explanation: 'Cơn bão có thể cao cả mà không phải nghệ thuật — mỹ học rộng hơn.' },
  { id: 'q3', question: 'Hume cho rằng thị hiếu (taste)?|||Hume argued that taste?', options: ['Là bẩm sinh, không đổi|||Is innate and fixed', 'Có thể rèn giũa và người đủ tầm hội tụ|||Can be refined, and qualified critics converge', 'Hoàn toàn tuỳ hứng cá nhân|||Is pure personal whim', 'Chỉ đúng với âm nhạc|||Applies only to music'], correctIndex: 1, explanation: 'Hume: thị hiếu rèn giũa được; phê bình đủ tầm sẽ đồng quy.' },
]);

const c2 = doc('aet102c-2-1-history', '2.1 — A history of aesthetic thought|||2.1 — Lịch sử tư tưởng mỹ học',
  'Plato (bắt chước, thang cái đẹp), Aristotle (mô phỏng, catharsis), Trung cổ (đẹp = ánh sáng thần thánh), Phục Hưng (tỉ lệ, phối cảnh), Khai sáng (thị hiếu).',
  [[
    `<span class="eyebrow">AET102c · Chapter 2 · Lesson 2.1</span>
<h2>A history of aesthetic thought</h2>
<h3>Antiquity: Plato &amp; Aristotle</h3>
<ul>
<li><strong>Plato</strong> — art is <em>mimesis</em> (imitation) and thus twice removed from the true Forms; he was suspicious of art. Yet in the <em>Symposium</em> he describes a &quot;ladder of beauty&quot; rising from a beautiful body to Beauty itself.</li>
<li><strong>Aristotle</strong> — rehabilitated imitation. In the <em>Poetics</em> he argued tragedy produces <strong>catharsis</strong>, a purging of pity and fear, and praised unity, order and proportion.</li>
</ul>
<h3>Middle Ages</h3>
<p>Beauty was tied to the divine. <strong>Aquinas</strong> named three marks of beauty: <em>integritas</em> (wholeness), <em>consonantia</em> (proportion) and <em>claritas</em> (radiance) — beauty as light shining through form.</p>
<h3>Renaissance</h3>
<p>Beauty became measurable: <strong>linear perspective</strong> (Brunelleschi, Alberti) and human proportion — Leonardo&apos;s <em>Vitruvian Man</em> — put mathematics at the centre of art.</p>
<h3>The Enlightenment</h3>
<p>Attention shifted from the object to the viewer: the eighteenth century debated <strong>taste</strong> (Hume) and set the stage for Kant.</p>`,
    `<span class="eyebrow">AET102c · Chương 2 · Bài 2.1</span>
<h2>Lịch sử tư tưởng mỹ học</h2>
<h3>Cổ đại: Plato &amp; Aristotle</h3>
<ul>
<li><strong>Plato</strong> — nghệ thuật là <em>mimesis</em> (bắt chước), do đó cách hai lần khỏi các Ý niệm (Form) chân thực; ông ngờ vực nghệ thuật. Nhưng trong <em>Symposium</em> ông tả một &quot;thang cái đẹp&quot; đi lên từ một thân thể đẹp tới chính Cái Đẹp.</li>
<li><strong>Aristotle</strong> — phục hồi vai trò của bắt chước. Trong <em>Thi pháp học</em> ông cho rằng bi kịch tạo ra <strong>catharsis</strong>, sự thanh lọc thương cảm và sợ hãi, và đề cao tính thống nhất, trật tự, tỉ lệ.</li>
</ul>
<h3>Trung cổ</h3>
<p>Cái đẹp gắn với cái thiêng. <strong>Aquinas</strong> nêu ba dấu hiệu của cái đẹp: <em>integritas</em> (sự toàn vẹn), <em>consonantia</em> (tỉ lệ) và <em>claritas</em> (sự rạng rỡ) — cái đẹp như ánh sáng chiếu qua hình thể.</p>
<h3>Phục Hưng</h3>
<p>Cái đẹp trở nên đo được: <strong>phối cảnh tuyến tính</strong> (Brunelleschi, Alberti) và tỉ lệ cơ thể người — <em>Người Vitruvius</em> của Leonardo — đặt toán học vào trung tâm nghệ thuật.</p>
<h3>Khai sáng</h3>
<p>Sự chú ý dời từ đối tượng sang người xem: thế kỷ 18 tranh luận về <strong>thị hiếu</strong> (Hume) và dọn đường cho Kant.</p>`,
  ]]);

const c2q = quiz('aet102c-quiz-2', 'Quiz 2 — History of aesthetics|||Quiz 2 — Lịch sử mỹ học', [
  { id: 'q1', question: 'Plato coi nghệ thuật là gì?|||Plato saw art as?', options: ['Con đường tới chân lý cao nhất|||The highest path to truth', 'Mimesis (bắt chước), cách hai lần khỏi Ý niệm|||Mimesis, twice removed from the Forms', 'Sản phẩm thị trường|||A market product', 'Toán học thuần tuý|||Pure mathematics'], correctIndex: 1, explanation: 'Plato: nghệ thuật bắt chước cái đã bắt chước Ý niệm.' },
  { id: 'q2', question: 'Trong Thi pháp học, Aristotle cho rằng bi kịch tạo ra?|||In the Poetics, Aristotle said tragedy produces?', options: ['Catharsis — thanh lọc thương cảm và sợ hãi|||Catharsis — a purging of pity and fear', 'Lợi nhuận|||Profit', 'Phối cảnh|||Perspective', 'Sự cao cả|||The sublime'], correctIndex: 0, explanation: 'Catharsis: bi kịch thanh lọc thương cảm và sợ hãi.' },
  { id: 'q3', question: 'Ba dấu hiệu cái đẹp của Aquinas là?|||Aquinas named which three marks of beauty?', options: ['Màu, đường, khối|||Colour, line, mass', 'Toàn vẹn, tỉ lệ, rạng rỡ (integritas, consonantia, claritas)|||Wholeness, proportion, radiance', 'Nhanh, rẻ, tốt|||Fast, cheap, good', 'Đối xứng, lặp, tương phản|||Symmetry, repetition, contrast'], correctIndex: 1, explanation: 'Aquinas: integritas, consonantia, claritas.' },
]);

const c3 = doc('aet102c-3-1-kant', '3.1 — Kant & modern aesthetics|||3.1 — Mỹ học Kant & hiện đại',
  'Kant: phán đoán thẩm mỹ, cái đẹp là khoái cảm vô tư (disinterested), tính phổ quát chủ quan, cái cao cả (sublime); Hegel về nghệ thuật là hiện thân của tinh thần.',
  [[
    `<span class="eyebrow">AET102c · Chapter 3 · Lesson 3.1</span>
<h2>Kant &amp; modern aesthetics</h2>
<p>Immanuel Kant&apos;s <em>Critique of the Power of Judgment</em> (1790) is the hinge of modern aesthetics.</p>
<h3>The disinterested judgment</h3>
<p>For Kant, a judgment of beauty is <strong>disinterested</strong> — we take pleasure in a thing&apos;s form <em>without wanting to own, eat or use it</em>. A pleasure that depends on desire (a cake looks tasty) is merely <em>agreeable</em>, not beautiful.</p>
<h3>Subjective universality</h3>
<p>When I call a rose beautiful I do not just report my feeling — I speak <em>as if</em> everyone ought to agree. Kant calls this <strong>subjective universality</strong>: a feeling, yet one that claims to hold for all.</p>
<h3>The sublime</h3>
<p>The <strong>sublime</strong> is different from beauty. Beauty rests in ordered form; the sublime arises before the <em>formless and overwhelming</em> — a storm at sea, a vast mountain. It first overpowers us, then lifts us as reason grasps what the senses cannot.</p>
<h3>Hegel</h3>
<p><strong>Hegel</strong> shifted focus to art&apos;s content: art is the <em>sensuous appearance of the Idea</em> — spirit made visible — and its forms (symbolic, classical, romantic) unfold through history.</p>`,
    `<span class="eyebrow">AET102c · Chương 3 · Bài 3.1</span>
<h2>Mỹ học Kant &amp; hiện đại</h2>
<p><em>Phê phán năng lực phán đoán</em> (1790) của Immanuel Kant là bản lề của mỹ học hiện đại.</p>
<h3>Phán đoán vô tư</h3>
<p>Với Kant, phán đoán về cái đẹp là <strong>vô tư (disinterested)</strong> — ta khoái cảm trước hình thức của vật <em>mà không muốn sở hữu, ăn hay dùng nó</em>. Khoái cảm phụ thuộc ham muốn (chiếc bánh trông ngon) chỉ là cái <em>dễ chịu</em>, không phải cái đẹp.</p>
<h3>Tính phổ quát chủ quan</h3>
<p>Khi tôi nói một bông hồng đẹp, tôi không chỉ báo cảm giác của mình — tôi nói <em>như thể</em> mọi người đều nên đồng ý. Kant gọi đó là <strong>tính phổ quát chủ quan</strong>: một cảm giác, nhưng đòi hỏi có giá trị cho tất cả.</p>
<h3>Cái cao cả (sublime)</h3>
<p><strong>Cái cao cả</strong> khác cái đẹp. Cái đẹp nằm ở hình thức có trật tự; cái cao cả trỗi lên trước cái <em>vô hình thức và áp đảo</em> — bão biển, ngọn núi mênh mông. Nó áp đảo ta trước, rồi nâng ta lên khi lý trí nắm được điều giác quan không thể.</p>
<h3>Hegel</h3>
<p><strong>Hegel</strong> chuyển tiêu điểm sang nội dung nghệ thuật: nghệ thuật là <em>sự hiện ra cảm tính của Ý niệm</em> — tinh thần được làm cho thấy được — và các hình thức của nó (tượng trưng, cổ điển, lãng mạn) trải ra qua lịch sử.</p>`,
  ]]);

const c3q = quiz('aet102c-quiz-3', 'Quiz 3 — Kant & modern aesthetics|||Quiz 3 — Kant & mỹ học hiện đại', [
  { id: 'q1', question: 'Với Kant, phán đoán về cái đẹp là "vô tư" nghĩa là?|||For Kant, a judgment of beauty is "disinterested" means?', options: ['Ta thờ ơ, không quan tâm|||We are indifferent and bored', 'Ta khoái cảm trước hình thức mà không muốn sở hữu/dùng nó|||We enjoy the form without wanting to own or use it', 'Ta phán đoán vì tiền|||We judge for money', 'Cái đẹp là khách quan tuyệt đối|||Beauty is fully objective'], correctIndex: 1, explanation: 'Disinterested: khoái cảm với hình thức, tách khỏi ham muốn.' },
  { id: 'q2', question: '"Tính phổ quát chủ quan" của Kant nói rằng phán đoán đẹp?|||Kant "subjective universality" says a beauty judgment?', options: ['Chỉ đúng với riêng tôi|||Is true for me only', 'Là cảm giác nhưng nói như thể mọi người nên đồng ý|||Is a feeling that yet claims everyone should agree', 'Là sự thật toán học|||Is a mathematical fact', 'Không có giá trị gì|||Has no validity'], correctIndex: 1, explanation: 'Cảm giác mà đòi hỏi tính phổ quát — chủ quan nhưng phổ quát.' },
  { id: 'q3', question: 'Cái cao cả (sublime) khác cái đẹp ở chỗ?|||The sublime differs from beauty in that?', options: ['Nó luôn nhỏ và dễ thương|||It is always small and cute', 'Nó trỗi lên trước cái vô hình thức, áp đảo (bão, núi lớn)|||It arises before the formless and overwhelming', 'Nó chỉ có trong âm nhạc|||It exists only in music', 'Nó cần màu sắc rực rỡ|||It requires bright colours'], correctIndex: 1, explanation: 'Cái đẹp = hình thức có trật tự; cái cao cả = vô hình thức, áp đảo.' },
]);

const c4 = doc('aet102c-4-1-categories', '4.1 — The aesthetic categories|||4.1 — Các phạm trù thẩm mỹ',
  'Cái đẹp (hài hoà), cái cao cả (áp đảo), cái bi (mất mát cao quý), cái hài (lệch chuẩn vô hại), cái xấu (phản thẩm mỹ có thể thành nghệ thuật).',
  [[
    `<span class="eyebrow">AET102c · Chapter 4 · Lesson 4.1</span>
<h2>The aesthetic categories</h2>
<p>Aesthetic response is not one flavour. The major <strong>categories</strong> name distinct kinds of value:</p>
<ul>
<li><strong>The beautiful</strong> — harmony, proportion, order; a calm pleasure. Example: a Raphael Madonna, a Bach fugue.</li>
<li><strong>The sublime</strong> — the vast or overpowering that awes us. Example: Caspar David Friedrich&apos;s <em>Wanderer above the Sea of Fog</em>.</li>
<li><strong>The tragic</strong> — noble suffering and loss that moves us to pity and fear. Example: Sophocles&apos; <em>Oedipus Rex</em>.</li>
<li><strong>The comic</strong> — harmless incongruity, the gap between expectation and outcome, that makes us laugh. Example: Chaplin&apos;s mishaps.</li>
<li><strong>The ugly</strong> — the disharmonious or repellent. Modern art (Goya, Bacon) shows the ugly can carry real aesthetic power.</li>
</ul>
<h3>Why categories matter</h3>
<p>Great work often <strong>mixes</strong> them — tragedy edged with comedy, beauty touched by the sublime. Naming the categories lets you say <em>which</em> feeling a piece aims at, and whether it lands.</p>
<div class="callout"><span class="badge">For designers</span> Not every interface should be &quot;beautiful.&quot; A memorial site may aim for the solemn or sublime; a game may aim for the comic. Match the category to the purpose.</div>`,
    `<span class="eyebrow">AET102c · Chương 4 · Bài 4.1</span>
<h2>Các phạm trù thẩm mỹ</h2>
<p>Phản ứng thẩm mỹ không chỉ một vị. Các <strong>phạm trù</strong> chính gọi tên những loại giá trị khác nhau:</p>
<ul>
<li><strong>Cái đẹp</strong> — hài hoà, tỉ lệ, trật tự; một khoái cảm êm dịu. Ví dụ: tranh Đức Mẹ của Raphael, một khúc fugue của Bach.</li>
<li><strong>Cái cao cả</strong> — cái mênh mông hay áp đảo khiến ta kinh ngạc. Ví dụ: <em>Lữ khách trên biển sương mù</em> của Caspar David Friedrich.</li>
<li><strong>Cái bi</strong> — nỗi khổ và mất mát cao quý làm ta thương cảm và sợ hãi. Ví dụ: <em>Oedipus làm vua</em> của Sophocles.</li>
<li><strong>Cái hài</strong> — sự lệch chuẩn vô hại, khoảng cách giữa kỳ vọng và kết cục, khiến ta bật cười. Ví dụ: những pha hớ hênh của Chaplin.</li>
<li><strong>Cái xấu</strong> — cái bất hoà hay gây ghê sợ. Nghệ thuật hiện đại (Goya, Bacon) cho thấy cái xấu có thể mang sức mạnh thẩm mỹ thật.</li>
</ul>
<h3>Vì sao phạm trù quan trọng</h3>
<p>Tác phẩm lớn thường <strong>trộn</strong> chúng — cái bi viền cái hài, cái đẹp chạm cái cao cả. Gọi tên phạm trù giúp bạn nói tác phẩm nhắm tới cảm xúc <em>nào</em>, và có đạt hay không.</p>
<div class="callout"><span class="badge">Với người thiết kế</span> Không phải giao diện nào cũng nên &quot;đẹp.&quot; Trang tưởng niệm có thể nhắm sự trang nghiêm hay cao cả; một trò chơi có thể nhắm cái hài. Hãy khớp phạm trù với mục đích.</div>`,
  ]]);

const c4q = quiz('aet102c-quiz-4', 'Quiz 4 — Aesthetic categories|||Quiz 4 — Phạm trù thẩm mỹ', [
  { id: 'q1', question: 'Phạm trù nào gắn với "nỗi khổ và mất mát cao quý", gợi thương cảm và sợ hãi?|||Which category is tied to noble suffering and loss, evoking pity and fear?', options: ['Cái hài|||The comic', 'Cái bi|||The tragic', 'Cái đẹp|||The beautiful', 'Cái xấu|||The ugly'], correctIndex: 1, explanation: 'Cái bi: Oedipus Rex — thương cảm và sợ hãi.' },
  { id: 'q2', question: 'Nhiều lý thuyết giải thích cái hài là do?|||Many theories explain the comic as arising from?', options: ['Sự hài hoà hoàn hảo|||Perfect harmony', 'Sự lệch chuẩn vô hại giữa kỳ vọng và kết cục|||Harmless incongruity between expectation and outcome', 'Nỗi sợ chết|||Fear of death', 'Tỉ lệ vàng|||The golden ratio'], correctIndex: 1, explanation: 'Thuyết incongruity: cái hài = lệch chuẩn vô hại.' },
  { id: 'q3', question: 'Câu nào ĐÚNG về cái xấu trong nghệ thuật?|||Which is TRUE about the ugly in art?', options: ['Cái xấu không bao giờ có giá trị thẩm mỹ|||The ugly can never have aesthetic value', 'Cái xấu có thể mang sức mạnh thẩm mỹ (Goya, Bacon)|||The ugly can carry real aesthetic power (Goya, Bacon)', 'Cái xấu chỉ là thiếu màu|||The ugly is merely a lack of colour', 'Cái xấu đồng nghĩa cái cao cả|||The ugly is the same as the sublime'], correctIndex: 1, explanation: 'Nghệ thuật hiện đại cho thấy cái xấu có thể có sức mạnh thẩm mỹ.' },
]);

const c5 = doc('aet102c-5-1-experience', '5.1 — Aesthetic experience & taste|||5.1 — Trải nghiệm & thị hiếu thẩm mỹ',
  'Trải nghiệm thẩm mỹ (chú ý vô tư, đắm mình), tri giác & Gestalt, cảm xúc trong nghệ thuật, thị hiếu (taste) và việc rèn giũa nó.',
  [[
    `<span class="eyebrow">AET102c · Chapter 5 · Lesson 5.1</span>
<h2>Aesthetic experience &amp; taste</h2>
<h3>What aesthetic experience feels like</h3>
<p>Thinkers describe it as <strong>absorbed, disinterested attention</strong>: we attend to the thing <em>for its own sake</em>, losing track of time and use. John Dewey (<em>Art as Experience</em>) stressed that it is a complete, unified episode with a felt shape — a beginning, build and close.</p>
<h3>Perception &amp; Gestalt</h3>
<p>We do not see isolated dots; we see <strong>wholes</strong>. Gestalt principles — <em>proximity, similarity, closure, figure/ground</em> — describe how the eye groups elements. This is where aesthetics meets the psychology of design directly.</p>
<h3>Emotion in art</h3>
<p>Why does sad music feel good? The <strong>paradox of tragedy</strong>: we seek out works that arouse painful emotions and are rewarded, perhaps because the emotion is felt at a safe distance and given form and meaning.</p>
<h3>Taste, and refining it</h3>
<p><strong>Taste</strong> is the capacity to perceive and judge aesthetic quality. It is not fixed: exposure, comparison and knowledge <em>train</em> it — the eye you bring to a painting after a year of looking is a better instrument.</p>`,
    `<span class="eyebrow">AET102c · Chương 5 · Bài 5.1</span>
<h2>Trải nghiệm &amp; thị hiếu thẩm mỹ</h2>
<h3>Trải nghiệm thẩm mỹ cảm thấy thế nào</h3>
<p>Các nhà tư tưởng tả nó là <strong>sự chú ý đắm mình, vô tư</strong>: ta chú ý tới vật <em>vì chính nó</em>, quên cả thời gian và công dụng. John Dewey (<em>Nghệ thuật như trải nghiệm</em>) nhấn mạnh đó là một chặng trọn vẹn, thống nhất, có hình dạng cảm nhận được — mở đầu, dâng lên và khép lại.</p>
<h3>Tri giác &amp; Gestalt</h3>
<p>Ta không thấy các chấm rời rạc; ta thấy các <strong>tổng thể</strong>. Nguyên lý Gestalt — <em>gần nhau, tương tự, khép kín, hình/nền</em> — mô tả cách mắt gộp nhóm các thành phần. Đây là nơi mỹ học gặp trực tiếp tâm lý học thiết kế.</p>
<h3>Cảm xúc trong nghệ thuật</h3>
<p>Vì sao nhạc buồn nghe lại dễ chịu? <strong>Nghịch lý của bi kịch</strong>: ta tìm đến những tác phẩm khơi cảm xúc đau đớn và được đền đáp, có lẽ vì cảm xúc được nếm ở một khoảng cách an toàn và được trao hình thức cùng ý nghĩa.</p>
<h3>Thị hiếu, và cách rèn giũa</h3>
<p><strong>Thị hiếu (taste)</strong> là năng lực tri giác và phán đoán chất lượng thẩm mỹ. Nó không cố định: sự tiếp xúc, so sánh và tri thức <em>rèn</em> nó — con mắt bạn mang đến một bức tranh sau một năm ngắm nhìn là một khí cụ tốt hơn.</p>`,
  ]]);

const c5q = quiz('aet102c-quiz-5', 'Quiz 5 — Experience & taste|||Quiz 5 — Trải nghiệm & thị hiếu', [
  { id: 'q1', question: 'Nguyên lý Gestalt mô tả điều gì?|||Gestalt principles describe?', options: ['Cách pha màu sơn dầu|||How to mix oil paint', 'Cách mắt gộp các thành phần thành tổng thể (gần nhau, tương tự, khép kín...)|||How the eye groups elements into wholes (proximity, similarity, closure...)', 'Giá tranh trên thị trường|||Art market prices', 'Lịch sử Phục Hưng|||Renaissance history'], correctIndex: 1, explanation: 'Gestalt: proximity, similarity, closure, figure/ground.' },
  { id: 'q2', question: '"Nghịch lý của bi kịch" (paradox of tragedy) là?|||The "paradox of tragedy" is?', options: ['Bi kịch luôn có kết vui|||Tragedies always end happily', 'Ta tìm đến tác phẩm khơi cảm xúc đau đớn mà vẫn thấy được đền đáp|||We seek works arousing painful emotions yet feel rewarded', 'Bi kịch không có cảm xúc|||Tragedy has no emotion', 'Chỉ trẻ em thích bi kịch|||Only children like tragedy'], correctIndex: 1, explanation: 'Cảm xúc đau ở khoảng cách an toàn, được cho hình thức và ý nghĩa.' },
  { id: 'q3', question: 'Theo bài, thị hiếu (taste)?|||According to the lesson, taste?', options: ['Cố định từ khi sinh|||Is fixed from birth', 'Rèn giũa được nhờ tiếp xúc, so sánh, tri thức|||Can be trained by exposure, comparison and knowledge', 'Không liên quan tri giác|||Has nothing to do with perception', 'Chỉ là ý kiến vô căn cứ|||Is just groundless opinion'], correctIndex: 1, explanation: 'Thị hiếu là năng lực rèn giũa được, không cố định.' },
]);

const c6 = doc('aet102c-6-1-beauty-in-design', '6.1 — Beauty in design|||6.1 — Cái đẹp trong thiết kế',
  'Nguyên lý thẩm mỹ trong design: tỉ lệ vàng & quy tắc một phần ba, hài hoà & cân bằng, tương phản & nhịp điệu, tối giản; hiệu ứng thẩm mỹ-khả dụng.',
  [[
    `<span class="eyebrow">AET102c · Chapter 6 · Lesson 6.1</span>
<h2>Beauty in design</h2>
<p>Aesthetic theory becomes practical the moment you place two shapes on a page. The recurring principles:</p>
<ul>
<li><strong>Proportion</strong> — the <em>golden ratio</em> (~1.618) and the <em>rule of thirds</em> give pleasing divisions of space; seen in the Parthenon and in modern layout grids.</li>
<li><strong>Harmony &amp; balance</strong> — elements that agree (colour, scale, style) and weight distributed so the composition does not tip.</li>
<li><strong>Contrast &amp; emphasis</strong> — difference creates a focal point; without it everything competes and nothing is seen.</li>
<li><strong>Rhythm &amp; repetition</strong> — repeated motifs and consistent spacing move the eye and build unity.</li>
<li><strong>Simplicity / minimalism</strong> — &quot;less, but better&quot; (Dieter Rams). Remove until only the essential remains.</li>
</ul>
<h3>The aesthetic-usability effect</h3>
<p>Research (Kurosu &amp; Kashimura; later Norman) found users perceive <strong>more beautiful interfaces as more usable</strong> — and forgive minor problems. Beauty is not decoration bolted on at the end; it shapes trust and the felt experience.</p>
<div class="callout"><span class="badge">Practice</span> Before adding, ask what you can remove. Align to a grid. Give the most important element the most contrast. Let white space do work.</div>`,
    `<span class="eyebrow">AET102c · Chương 6 · Bài 6.1</span>
<h2>Cái đẹp trong thiết kế</h2>
<p>Lý thuyết thẩm mỹ trở nên thực dụng ngay khi bạn đặt hai hình lên trang. Các nguyên lý lặp lại:</p>
<ul>
<li><strong>Tỉ lệ</strong> — <em>tỉ lệ vàng</em> (~1,618) và <em>quy tắc một phần ba</em> cho những cách chia không gian dễ chịu; thấy ở đền Parthenon và các lưới bố cục hiện đại.</li>
<li><strong>Hài hoà &amp; cân bằng</strong> — các thành phần ăn ý nhau (màu, tỉ lệ, phong cách) và trọng lượng phân bố sao cho bố cục không nghiêng.</li>
<li><strong>Tương phản &amp; nhấn</strong> — sự khác biệt tạo điểm nhìn; thiếu nó thì mọi thứ tranh nhau và không gì được thấy.</li>
<li><strong>Nhịp điệu &amp; lặp</strong> — mô-típ lặp và khoảng cách nhất quán dẫn dắt mắt và dựng tính thống nhất.</li>
<li><strong>Đơn giản / tối giản</strong> — &quot;ít hơn, nhưng tốt hơn&quot; (Dieter Rams). Bỏ bớt cho đến khi chỉ còn cái cốt yếu.</li>
</ul>
<h3>Hiệu ứng thẩm mỹ-khả dụng</h3>
<p>Nghiên cứu (Kurosu &amp; Kashimura; sau này Norman) thấy người dùng cảm nhận <strong>giao diện đẹp hơn là dễ dùng hơn</strong> — và tha thứ những lỗi nhỏ. Cái đẹp không phải trang trí gắn thêm ở phút chót; nó định hình niềm tin và trải nghiệm cảm nhận.</p>
<div class="callout"><span class="badge">Thực hành</span> Trước khi thêm, hãy hỏi có thể bỏ gì. Canh theo lưới. Cho thành phần quan trọng nhất độ tương phản lớn nhất. Để khoảng trắng làm việc.</div>`,
  ]]);

const c6q = quiz('aet102c-quiz-6', 'Quiz 6 — Beauty in design|||Quiz 6 — Cái đẹp trong thiết kế', [
  { id: 'q1', question: 'Tỉ lệ vàng xấp xỉ bằng?|||The golden ratio is approximately?', options: ['1,618', '3,142', '2,718', '0,577'], correctIndex: 0, explanation: 'Tỉ lệ vàng φ ≈ 1,618.' },
  { id: 'q2', question: '"Hiệu ứng thẩm mỹ-khả dụng" nói rằng?|||The aesthetic-usability effect says?', options: ['Giao diện xấu dễ dùng hơn|||Ugly interfaces are easier to use', 'Người dùng cảm nhận giao diện đẹp hơn là dễ dùng hơn|||Users perceive more beautiful interfaces as more usable', 'Cái đẹp không ảnh hưởng trải nghiệm|||Beauty has no effect on experience', 'Tối giản luôn xấu|||Minimalism is always ugly'], correctIndex: 1, explanation: 'Kurosu & Kashimura / Norman: đẹp hơn → cảm thấy dễ dùng hơn.' },
  { id: 'q3', question: 'Câu "ít hơn, nhưng tốt hơn" gắn với nguyên lý và nhà thiết kế nào?|||"Less, but better" is tied to which principle and designer?', options: ['Tương phản — Josef Albers|||Contrast — Josef Albers', 'Tối giản — Dieter Rams|||Minimalism — Dieter Rams', 'Nhịp điệu — William Morris|||Rhythm — William Morris', 'Đối xứng — Vitruvius|||Symmetry — Vitruvius'], correctIndex: 1, explanation: 'Dieter Rams: "Weniger, aber besser" — tối giản.' },
]);

const c7 = doc('aet102c-7-1-east-asian-vietnamese', '7.1 — East Asian & Vietnamese aesthetics|||7.1 — Mỹ học Á Đông & Việt Nam',
  'Mỹ học phương Đông: khoảng trống & khí vận (Trung Hoa), wabi-sabi, ma, mono no aware (Nhật); thẩm mỹ truyền thống Việt (đình chùa, gốm, tranh dân gian).',
  [[
    `<span class="eyebrow">AET102c · Chapter 7 · Lesson 7.1</span>
<h2>East Asian &amp; Vietnamese aesthetics</h2>
<h3>Chinese aesthetics</h3>
<p>Classical Chinese painting prizes <strong>qiyun</strong> (spirit-resonance) over mere likeness, and uses <strong>empty space</strong> (liubai) as an active element — the unpainted silk breathes. Calligraphy treats the living line as the highest art.</p>
<h3>Japanese aesthetics</h3>
<ul>
<li><strong>Wabi-sabi</strong> — beauty in the imperfect, impermanent and incomplete; a cracked, repaired tea bowl.</li>
<li><strong>Ma</strong> — the meaningful interval, the pregnant emptiness between things.</li>
<li><strong>Mono no aware</strong> — the gentle sadness at the passing of things; falling cherry blossom.</li>
</ul>
<h3>Vietnamese aesthetics</h3>
<p>Traditional Vietnamese beauty lives in <strong>communal-house (đình) and pagoda architecture</strong>, in <strong>Bát Tràng ceramics</strong>, and in <strong>Đông Hồ folk woodblock prints</strong> — bold flat colour on điệp paper, warm humour, motifs of harvest and prosperity. The values run to harmony with nature, the collective, and a restrained, earthy palette.</p>
<div class="callout"><span class="badge">For designers</span> Eastern aesthetics teaches that <strong>emptiness is content</strong> and imperfection can be intentional — a powerful counter-weight to Western symmetry and finish.</div>`,
    `<span class="eyebrow">AET102c · Chương 7 · Bài 7.1</span>
<h2>Mỹ học Á Đông &amp; Việt Nam</h2>
<h3>Mỹ học Trung Hoa</h3>
<p>Tranh cổ điển Trung Hoa quý <strong>khí vận (qiyun)</strong> — thần khí — hơn là giống thật, và dùng <strong>khoảng trống</strong> (lưu bạch) như một yếu tố chủ động — mặt lụa để trống mà thở. Thư pháp coi đường nét sống động là nghệ thuật cao nhất.</p>
<h3>Mỹ học Nhật Bản</h3>
<ul>
<li><strong>Wabi-sabi</strong> — cái đẹp trong sự bất toàn, vô thường và dang dở; một chén trà rạn được hàn lại.</li>
<li><strong>Ma</strong> — khoảng ngắt có nghĩa, cái trống đầy sức chứa giữa các sự vật.</li>
<li><strong>Mono no aware</strong> — nỗi buồn dịu trước sự phôi pha của vạn vật; hoa anh đào rụng.</li>
</ul>
<h3>Thẩm mỹ Việt Nam</h3>
<p>Cái đẹp truyền thống Việt sống trong <strong>kiến trúc đình, chùa</strong>, trong <strong>gốm Bát Tràng</strong>, và trong <strong>tranh khắc gỗ dân gian Đông Hồ</strong> — màu bệt tươi trên giấy điệp, hài hước ấm áp, mô-típ mùa màng và phồn thực. Giá trị nghiêng về hài hoà với thiên nhiên, tính cộng đồng, và một bảng màu mộc mạc, tiết chế.</p>
<div class="callout"><span class="badge">Với người thiết kế</span> Mỹ học phương Đông dạy rằng <strong>khoảng trống cũng là nội dung</strong> và sự bất toàn có thể là chủ ý — một đối trọng mạnh với tính đối xứng và độ hoàn thiện của phương Tây.</div>`,
  ]]);

const c7q = quiz('aet102c-quiz-7', 'Quiz 7 — East Asian & Vietnamese|||Quiz 7 — Á Đông & Việt Nam', [
  { id: 'q1', question: '"Wabi-sabi" (Nhật Bản) tôn vinh cái đẹp ở đâu?|||Japanese "wabi-sabi" finds beauty in?', options: ['Sự hoàn hảo bóng bẩy|||Glossy perfection', 'Sự bất toàn, vô thường và dang dở|||The imperfect, impermanent and incomplete', 'Tính đối xứng tuyệt đối|||Absolute symmetry', 'Màu sắc rực rỡ nhất|||The brightest colours'], correctIndex: 1, explanation: 'Wabi-sabi: đẹp trong bất toàn, vô thường, dang dở.' },
  { id: 'q2', question: 'Trong tranh cổ điển Trung Hoa, "khoảng trống" (lưu bạch) là?|||In classical Chinese painting, empty space (liubai) is?', options: ['Lỗi kỹ thuật|||A technical mistake', 'Một yếu tố chủ động, mặt lụa để trống mà thở|||An active element — the unpainted silk breathes', 'Nơi ký tên|||Where the signature goes only', 'Không có ý nghĩa|||Meaningless'], correctIndex: 1, explanation: 'Lưu bạch là yếu tố chủ động, không phải chỗ thừa.' },
  { id: 'q3', question: 'Tranh dân gian Đông Hồ (Việt Nam) đặc trưng bởi?|||Vietnamese Đông Hồ folk prints are characterized by?', options: ['Sơn dầu phối cảnh phương Tây|||Western oil and perspective', 'Màu bệt tươi trên giấy điệp, mô-típ mùa màng|||Bold flat colour on điệp paper, harvest motifs', 'Chỉ đen trắng|||Black and white only', 'Điêu khắc kim loại|||Metal sculpture'], correctIndex: 1, explanation: 'Đông Hồ: màu bệt trên giấy điệp, mô-típ mùa màng, phồn thực.' },
]);

const c8 = doc('aet102c-8-1-contemporary-digital', '8.1 — Contemporary, digital & AI aesthetics|||8.1 — Mỹ học đương đại, số & AI',
  'Nghệ thuật đương đại (ý niệm, Duchamp, thể chế nghệ thuật), thẩm mỹ số & new media, generative/AI art, và thẩm mỹ đại chúng (kitsch, thị giác mạng).',
  [[
    `<span class="eyebrow">AET102c · Chapter 8 · Lesson 8.1</span>
<h2>Contemporary, digital &amp; AI aesthetics</h2>
<h3>The contemporary turn</h3>
<p>Marcel Duchamp&apos;s <em>Fountain</em> (1917) — a signed urinal — asked whether art is defined by the maker&apos;s <strong>idea</strong> and the <strong>institution</strong> that frames it, not by beauty of form. This launched <strong>conceptual art</strong> and the &quot;institutional theory&quot; (Dickie): something is art if the artworld treats it as art.</p>
<h3>Digital &amp; new-media aesthetics</h3>
<p>The screen adds properties older media lacked: <strong>interactivity, generativity, the infinitely reproducible, and code as medium</strong>. Aesthetic judgment now covers motion, responsiveness and system behaviour, not just a static image.</p>
<h3>Generative &amp; AI art</h3>
<p>AI image models reopen old questions in new form: if a model produces a striking image, <strong>where is authorship</strong> — in the prompt, the training data, the model, the curator? Is the result creative, or recombination? Aesthetics gives the tools to argue this rather than merely react.</p>
<h3>Popular aesthetics</h3>
<p><strong>Kitsch</strong> (sentimental, mass-produced &quot;easy&quot; beauty), memes, and platform visual culture are now legitimate objects of aesthetic study — taste operates at scale, shaped by feeds and algorithms.</p>`,
    `<span class="eyebrow">AET102c · Chương 8 · Bài 8.1</span>
<h2>Mỹ học đương đại, số &amp; AI</h2>
<h3>Bước ngoặt đương đại</h3>
<p><em>Fountain</em> (1917) của Marcel Duchamp — một bồn tiểu có chữ ký — đặt câu hỏi liệu nghệ thuật có được định nghĩa bởi <strong>ý niệm</strong> của người làm và <strong>thể chế</strong> đóng khung nó, chứ không bởi vẻ đẹp hình thức. Điều này khai sinh <strong>nghệ thuật ý niệm</strong> và &quot;thuyết thể chế&quot; (Dickie): một vật là nghệ thuật nếu giới nghệ thuật coi nó là nghệ thuật.</p>
<h3>Mỹ học số &amp; truyền thông mới</h3>
<p>Màn hình thêm những thuộc tính mà phương tiện cũ không có: <strong>tính tương tác, tính sinh tạo, khả năng sao chép vô hạn, và mã như chất liệu</strong>. Phán đoán thẩm mỹ nay bao cả chuyển động, sự phản hồi và hành vi hệ thống, không chỉ một ảnh tĩnh.</p>
<h3>Nghệ thuật sinh tạo &amp; AI</h3>
<p>Các mô hình sinh ảnh AI mở lại câu hỏi cũ dưới dạng mới: nếu một mô hình tạo ra bức ảnh ấn tượng, <strong>quyền tác giả nằm ở đâu</strong> — ở câu lệnh, dữ liệu huấn luyện, mô hình, hay người tuyển chọn? Kết quả là sáng tạo, hay tái tổ hợp? Mỹ học cho công cụ để lập luận điều này thay vì chỉ phản ứng.</p>
<h3>Thẩm mỹ đại chúng</h3>
<p><strong>Kitsch</strong> (cái đẹp &quot;dễ dãi&quot;, uỷ mị, sản xuất hàng loạt), meme, và văn hoá thị giác trên nền tảng nay là đối tượng chính đáng của mỹ học — thị hiếu vận hành ở quy mô lớn, được định hình bởi dòng tin và thuật toán.</p>`,
  ]]);

const c8q = quiz('aet102c-quiz-8', 'Quiz 8 — Contemporary & digital|||Quiz 8 — Đương đại & số', [
  { id: 'q1', question: 'Tác phẩm "Fountain" (1917) của Duchamp chủ yếu đặt câu hỏi gì?|||Duchamp "Fountain" (1917) mainly asks?', options: ['Cách vẽ phối cảnh|||How to draw perspective', 'Nghệ thuật có phải do ý niệm và thể chế định nghĩa, chứ không do vẻ đẹp hình thức?|||Whether art is defined by idea and institution, not beauty of form', 'Màu nào đẹp nhất|||Which colour is best', 'Cách nung gốm|||How to fire ceramics'], correctIndex: 1, explanation: 'Duchamp mở nghệ thuật ý niệm & thuyết thể chế (Dickie).' },
  { id: 'q2', question: 'Đâu là thuộc tính RIÊNG mà mỹ học số/new-media thêm vào?|||Which is a property distinctive to digital/new-media aesthetics?', options: ['Tính tương tác, sinh tạo, mã như chất liệu|||Interactivity, generativity, code as medium', 'Sơn dầu trên vải|||Oil on canvas', 'Đá cẩm thạch|||Marble', 'Chỉ có màu đen|||Only black'], correctIndex: 0, explanation: 'Màn hình thêm tương tác, sinh tạo, hành vi hệ thống, mã.' },
  { id: 'q3', question: 'Với nghệ thuật AI, câu hỏi thẩm mỹ nổi bật là?|||For AI art, a key aesthetic question is?', options: ['Nên dùng khung tranh nào|||Which frame to use', 'Quyền tác giả nằm ở đâu (câu lệnh, dữ liệu, mô hình, người tuyển chọn)?|||Where authorship lies (prompt, data, model, curator)', 'Giá điện của máy tính|||The electricity bill', 'Cỡ màn hình|||Screen size'], correctIndex: 1, explanation: 'AI art mở lại câu hỏi quyền tác giả và sáng tạo vs tái tổ hợp.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'AET102c',
    slug: 'aet102c-aesthetic',
    title: 'Aesthetic',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/AET102c.webp',
    shortDescription: 'What beauty is and how we judge it — aesthetic categories, the history of aesthetic thought (Plato to Kant & Hegel), taste & experience, beauty in design, East Asian & Vietnamese aesthetics, and digital & AI art. Bilingual, with quizzes.|||Cái đẹp là gì và ta phán đoán ra sao — các phạm trù thẩm mỹ, lịch sử tư tưởng mỹ học (Plato tới Kant & Hegel), thị hiếu & trải nghiệm, cái đẹp trong thiết kế, mỹ học Á Đông & Việt Nam, nghệ thuật số & AI. Song ngữ, có quiz.',
    description: 'Môn <strong>AET102c — Aesthetics (Mỹ học)</strong> thuộc ngành Thiết kế mỹ thuật số, kỳ 8, dựng triết học về cái đẹp thành nền cho công việc thiết kế. Từ <strong>mỹ học là gì &amp; các phạm trù</strong> → <strong>lịch sử tư tưởng</strong> (Plato, Aristotle → Kant, Hegel) → <strong>Kant &amp; mỹ học hiện đại</strong> (phán đoán vô tư, cái cao cả) → <strong>các phạm trù thẩm mỹ</strong> → <strong>trải nghiệm &amp; thị hiếu</strong> → <strong>cái đẹp trong thiết kế</strong> (tỉ lệ vàng, hài hoà, tối giản) → <strong>mỹ học Á Đông &amp; Việt Nam</strong> → <strong>mỹ học đương đại, số &amp; AI</strong>. Song ngữ, có triết gia/lý thuyết và ví dụ tác phẩm thật, quiz mỗi chương.',
    whatYouLearn: 'Đối tượng của mỹ học &amp; phân biệt với triết học nghệ thuật; cái đẹp chủ quan/khách quan (Hume); Plato &amp; Aristotle (mimesis, catharsis), Trung cổ, Phục Hưng, Khai sáng; Kant (phán đoán vô tư, phổ quát chủ quan, cái cao cả) &amp; Hegel; các phạm trù (đẹp, cao cả, bi, hài, xấu); trải nghiệm thẩm mỹ, Gestalt, thị hiếu; nguyên lý thẩm mỹ trong thiết kế &amp; hiệu ứng thẩm mỹ-khả dụng; mỹ học Á Đông (wabi-sabi, khí vận) &amp; Việt Nam; nghệ thuật ý niệm, số &amp; AI.',
    requirements: 'Không cần nền triết học trước. Ham đọc, ham nhìn tác phẩm và sẵn lòng lập luận về "vì sao đẹp". Xem điều kiện tiên quyết trong khung ngành Thiết kế mỹ thuật số trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách nhập môn, văn bản gốc, bảo tàng số, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mỹ học là gì, vì sao người thiết kế cần, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Mỹ học là gì|||Chapter 1 — What aesthetics is', description: 'Cái đẹp, giá trị & phạm trù thẩm mỹ, chủ quan/khách quan.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Lịch sử tư tưởng mỹ học|||Chapter 2 — History of aesthetics', description: 'Plato, Aristotle, Trung cổ, Phục Hưng, Khai sáng.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Kant & mỹ học hiện đại|||Chapter 3 — Kant & modern aesthetics', description: 'Phán đoán vô tư, cái cao cả, Hegel.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Các phạm trù thẩm mỹ|||Chapter 4 — Aesthetic categories', description: 'Đẹp, cao cả, bi, hài, xấu.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Cảm thụ & trải nghiệm|||Chapter 5 — Experience & taste', description: 'Trải nghiệm thẩm mỹ, Gestalt, cảm xúc, thị hiếu.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Cái đẹp trong thiết kế|||Chapter 6 — Beauty in design', description: 'Tỉ lệ vàng, hài hoà, tương phản, tối giản, thẩm mỹ-khả dụng.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Mỹ học Á Đông & Việt Nam|||Chapter 7 — East Asian & Vietnamese', description: 'Khí vận, wabi-sabi, ma, thẩm mỹ truyền thống Việt.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Mỹ học đương đại & số|||Chapter 8 — Contemporary & digital', description: 'Nghệ thuật ý niệm, thẩm mỹ số, AI art, thẩm mỹ đại chúng.', lessons: [c8, c8q] },
  ],
};
