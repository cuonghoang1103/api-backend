/**
 * KMS301 — Knowledge Management System. Khung chất lượng (8 chương) theo giáo
 * trình chuẩn quốc tế: Nonaka & Takeuchi "The Knowledge-Creating Company"
 * (SECI), Dalkir "Knowledge Management in Theory and Practice", Davenport &
 * Prusak "Working Knowledge". Song ngữ + mô hình + ví dụ doanh nghiệp thật.
 * Giữ NGUYÊN slug/semester/courseCode 'KMS301'/thumb(v3).
 * ⚠️ KHÔNG backtick lồng/${; "&"→&amp; trong HTML; content .join('\n') ra string.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('kms301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế, tài liệu miễn phí, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">KMS301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Knowledge Management</strong> — from what knowledge is, to how organizations create, share and reuse it, to the systems and metrics that make it stick — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are the standard reference books and free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for KMS301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (international standard)</h3>
<ul>
<li>Ikujiro Nonaka &amp; Hirotaka Takeuchi — <em>The Knowledge-Creating Company</em> (the SECI model &amp; ba)</li>
<li>Kimiz Dalkir — <em>Knowledge Management in Theory and Practice</em> (the KM cycle, tools, metrics)</li>
<li>Thomas Davenport &amp; Laurence Prusak — <em>Working Knowledge</em> (KM in real organizations)</li>
</ul>
<h3>🌐 Official / free resources</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Knowledge_management" target="_blank" rel="noopener">Knowledge management — overview (Wikipedia)</a></li>
<li><a href="https://en.wikipedia.org/wiki/SECI_model_of_knowledge_dimensions" target="_blank" rel="noopener">SECI model — Nonaka &amp; Takeuchi</a></li>
<li><a href="https://hbr.org/1998/03/whats-your-strategy-for-managing-knowledge" target="_blank" rel="noopener">HBR — What&#39;s Your Strategy for Managing Knowledge? (Hansen, Nohria &amp; Tierney)</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=knowledge+management+seci+model" target="_blank" rel="noopener">SECI model explained</a> — tacit ↔ explicit knowledge conversion</li>
<li><a href="https://www.youtube.com/results?search_query=community+of+practice+knowledge+management" target="_blank" rel="noopener">Communities of practice</a> — how knowledge really moves</li>
</ul>
<h3>🛠️ Tools you will meet</h3>
<ul>
<li>Wikis &amp; document management — Confluence, SharePoint, MediaWiki</li>
<li>Enterprise search &amp; expert location — Elasticsearch, Microsoft Viva Topics</li>
<li>Knowledge graphs &amp; ontology — Neo4j, RDF/OWL, Google Knowledge Graph</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — DIKW hierarchy, tacit vs explicit knowledge, why KM matters.</li>
<li><strong>Models</strong> — Nonaka&#39;s SECI creation spiral and the knowledge life cycle (capture → codify → share → apply).</li>
<li><strong>Enablers</strong> — KM strategy &amp; culture, KMS technology, communities of practice, AI &amp; knowledge graphs.</li>
<li><strong>Prove value</strong> — KM metrics, intellectual capital, implementation and its pitfalls.</li>
</ol></div>`,
    `<span class="eyebrow">KMS301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Quản lý tri thức</strong> — từ tri thức là gì, tới cách tổ chức tạo, chia sẻ và tái dùng tri thức, tới hệ thống và thước đo giữ cho nó bền — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là sách chuẩn và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của KMS301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (chuẩn quốc tế)</h3>
<ul>
<li>Ikujiro Nonaka &amp; Hirotaka Takeuchi — <em>The Knowledge-Creating Company</em> (mô hình SECI &amp; ba)</li>
<li>Kimiz Dalkir — <em>Knowledge Management in Theory and Practice</em> (vòng đời KM, công cụ, thước đo)</li>
<li>Thomas Davenport &amp; Laurence Prusak — <em>Working Knowledge</em> (KM trong tổ chức thật)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Knowledge_management" target="_blank" rel="noopener">Quản lý tri thức — tổng quan (Wikipedia)</a></li>
<li><a href="https://en.wikipedia.org/wiki/SECI_model_of_knowledge_dimensions" target="_blank" rel="noopener">Mô hình SECI — Nonaka &amp; Takeuchi</a></li>
<li><a href="https://hbr.org/1998/03/whats-your-strategy-for-managing-knowledge" target="_blank" rel="noopener">HBR — Chiến lược quản lý tri thức của bạn là gì? (Hansen, Nohria &amp; Tierney)</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=knowledge+management+seci+model" target="_blank" rel="noopener">Giải thích mô hình SECI</a> — chuyển hoá tri thức ẩn ↔ hiện</li>
<li><a href="https://www.youtube.com/results?search_query=community+of+practice+knowledge+management" target="_blank" rel="noopener">Cộng đồng thực hành</a> — tri thức thật sự lan truyền thế nào</li>
</ul>
<h3>🛠️ Công cụ bạn sẽ gặp</h3>
<ul>
<li>Wiki &amp; quản lý tài liệu — Confluence, SharePoint, MediaWiki</li>
<li>Tìm kiếm doanh nghiệp &amp; định vị chuyên gia — Elasticsearch, Microsoft Viva Topics</li>
<li>Knowledge graph &amp; ontology — Neo4j, RDF/OWL, Google Knowledge Graph</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — tháp DIKW, tri thức ẩn vs hiện, vì sao cần KM.</li>
<li><strong>Mô hình</strong> — vòng xoáy tạo tri thức SECI của Nonaka và vòng đời tri thức (thu nhận → mã hoá → chia sẻ → áp dụng).</li>
<li><strong>Yếu tố thúc đẩy</strong> — chiến lược &amp; văn hoá KM, công nghệ KMS, cộng đồng thực hành, AI &amp; knowledge graph.</li>
<li><strong>Chứng minh giá trị</strong> — thước đo KM, vốn trí tuệ, triển khai và các cạm bẫy.</li>
</ol></div>`,
  ]]);

const intro = doc('kms301-0-1-overview', 'Course overview: Knowledge Management System|||Tổng quan: Hệ thống quản lý tri thức',
  'KM là gì và vì sao quan trọng; tri thức là tài sản; lộ trình: nền tảng → mô hình SECI & vòng đời → chiến lược, công nghệ, cộng đồng → AI & đo lường.',
  [[
    `<span class="eyebrow">KMS301 · Lesson 0.1 · Overview</span>
<h2>Knowledge Management System</h2>
<p class="lead">This course explains <strong>how organizations turn what people know into a lasting asset</strong> — captured, shared and reused instead of walking out the door when an employee leaves. You will learn the core concepts (tacit vs explicit knowledge), the models that describe how knowledge is created (Nonaka&#39;s SECI), and the strategy, culture, technology and metrics that make a <strong>Knowledge Management System (KMS)</strong> actually work.</p>
<h3>Why knowledge is different from data</h3>
<p>Data and information can be stored in any database. <strong>Knowledge</strong> — the judgement, experience and know-how in people&#39;s heads — is far harder to capture, yet it is where competitive advantage lives. KM is the discipline of getting the right knowledge to the right person at the right time.</p>
<h3>Roadmap</h3>
<p>What KM is (DIKW, tacit/explicit) → the SECI creation model → the knowledge life cycle → KM strategy &amp; culture → KMS technology → communities of practice → AI &amp; knowledge graphs → measurement &amp; implementation. Bilingual, with real company examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">KMS301 · Bài 0.1 · Tổng quan</span>
<h2>Hệ thống quản lý tri thức</h2>
<p class="lead">Môn này giải thích <strong>cách tổ chức biến những gì con người biết thành tài sản bền vững</strong> — được thu nhận, chia sẻ và tái dùng thay vì ra đi cùng nhân viên khi họ nghỉ việc. Bạn sẽ học khái niệm cốt lõi (tri thức ẩn vs hiện), các mô hình mô tả cách tri thức được tạo ra (SECI của Nonaka), cùng chiến lược, văn hoá, công nghệ và thước đo giúp một <strong>Hệ thống quản lý tri thức (KMS)</strong> thật sự chạy được.</p>
<h3>Vì sao tri thức khác dữ liệu</h3>
<p>Dữ liệu và thông tin có thể lưu trong bất kỳ cơ sở dữ liệu nào. <strong>Tri thức</strong> — sự phán đoán, kinh nghiệm và bí quyết trong đầu con người — khó nắm bắt hơn nhiều, nhưng lại là nơi lợi thế cạnh tranh trú ngụ. KM là môn học đưa đúng tri thức tới đúng người vào đúng lúc.</p>
<h3>Lộ trình</h3>
<p>KM là gì (DIKW, ẩn/hiện) → mô hình tạo tri thức SECI → vòng đời tri thức → chiến lược &amp; văn hoá KM → công nghệ KMS → cộng đồng thực hành → AI &amp; knowledge graph → đo lường &amp; triển khai. Song ngữ, có ví dụ doanh nghiệp thật và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('kms301-1-1-what-is-km', '1.1 — What is knowledge management|||1.1 — Quản lý tri thức là gì',
  'Tháp DIKW (data-information-knowledge-wisdom), tri thức ẩn/hiện (tacit/explicit), vì sao tổ chức cần KM.',
  [[
    `<span class="eyebrow">KMS301 · Chapter 1 · Lesson 1.1</span>
<h2>What is knowledge management</h2>
<h3>The DIKW hierarchy</h3>
<ul>
<li><strong>Data</strong> — raw facts with no context (e.g. the number 42).</li>
<li><strong>Information</strong> — data given context and meaning (42 orders yesterday).</li>
<li><strong>Knowledge</strong> — information combined with experience and judgement (orders drop 42% every rainy Monday, so we staff fewer people).</li>
<li><strong>Wisdom</strong> — knowing which knowledge to apply, and when.</li>
</ul>
<h3>Tacit vs explicit knowledge</h3>
<ul>
<li><strong>Explicit</strong> — can be written down: manuals, reports, formulas, code. Easy to store and copy.</li>
<li><strong>Tacit</strong> — personal know-how that is hard to articulate: a surgeon&#39;s touch, a salesperson&#39;s instinct for a deal. It lives in people, and most valuable knowledge is tacit.</li>
</ul>
<p>KM is the deliberate process of <strong>creating, capturing, sharing and using</strong> both kinds so the organization gets smarter over time.</p>
<div class="callout"><span class="badge">Real example</span> Davenport &amp; Prusak (<em>Working Knowledge</em>) describe how firms lose millions when experts retire without their tacit knowledge ever being captured — the drive behind corporate KM programs.</div>`,
    `<span class="eyebrow">KMS301 · Chương 1 · Bài 1.1</span>
<h2>Quản lý tri thức là gì</h2>
<h3>Tháp DIKW</h3>
<ul>
<li><strong>Dữ liệu (Data)</strong> — sự kiện thô không có ngữ cảnh (vd con số 42).</li>
<li><strong>Thông tin (Information)</strong> — dữ liệu được gắn ngữ cảnh và ý nghĩa (42 đơn hàng hôm qua).</li>
<li><strong>Tri thức (Knowledge)</strong> — thông tin kết hợp kinh nghiệm và phán đoán (đơn hàng giảm 42% mỗi thứ Hai mưa, nên bố trí ít nhân viên hơn).</li>
<li><strong>Minh triết (Wisdom)</strong> — biết dùng tri thức nào, vào lúc nào.</li>
</ul>
<h3>Tri thức ẩn vs hiện</h3>
<ul>
<li><strong>Hiện (explicit)</strong> — có thể viết ra: cẩm nang, báo cáo, công thức, mã nguồn. Dễ lưu và sao chép.</li>
<li><strong>Ẩn (tacit)</strong> — bí quyết cá nhân khó diễn đạt: cái tay của bác sĩ phẫu thuật, trực giác chốt đơn của người bán hàng. Nó nằm trong con người, và phần tri thức giá trị nhất là tri thức ẩn.</li>
</ul>
<p>KM là quá trình chủ động <strong>tạo, thu nhận, chia sẻ và sử dụng</strong> cả hai loại để tổ chức ngày một thông minh hơn.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Davenport &amp; Prusak (<em>Working Knowledge</em>) mô tả các công ty mất hàng triệu đô khi chuyên gia nghỉ hưu mà tri thức ẩn của họ chưa bao giờ được thu lại — động lực cho các chương trình KM doanh nghiệp.</div>`,
  ]]);

const c1q = quiz('kms301-quiz-1', 'Quiz 1 — What is KM|||Quiz 1 — KM là gì', [
  { id: 'q1', question: 'Trong tháp DIKW, thứ tự đúng từ thấp đến cao là?|||In the DIKW hierarchy, the correct order from low to high is?', options: ['Wisdom → Knowledge → Information → Data', 'Data → Information → Knowledge → Wisdom', 'Information → Data → Knowledge → Wisdom', 'Knowledge → Data → Wisdom → Information'], correctIndex: 1, explanation: 'Dữ liệu → thông tin → tri thức → minh triết.|||Data → information → knowledge → wisdom.' },
  { id: 'q2', question: 'Bí quyết cá nhân khó diễn đạt, nằm trong đầu người ta, gọi là?|||Personal know-how that is hard to articulate is called?', options: ['Tri thức hiện (explicit)|||Explicit knowledge', 'Tri thức ẩn (tacit)|||Tacit knowledge', 'Dữ liệu thô|||Raw data', 'Thông tin|||Information'], correctIndex: 1, explanation: 'Tri thức ẩn (tacit) là bí quyết khó viết ra.|||Tacit knowledge is know-how hard to write down.' },
  { id: 'q3', question: 'Mục tiêu cốt lõi của quản lý tri thức là?|||The core goal of knowledge management is?', options: ['Xoá bớt dữ liệu cũ|||Delete old data', 'Đưa đúng tri thức tới đúng người vào đúng lúc|||Get the right knowledge to the right person at the right time', 'Tăng dung lượng ổ đĩa|||Increase disk capacity', 'Thay thế mọi nhân viên bằng phần mềm|||Replace all staff with software'], correctIndex: 1, explanation: 'KM giúp tổ chức tạo, chia sẻ và tái dùng tri thức đúng lúc.|||KM helps create, share and reuse knowledge at the right time.' },
]);

const c2 = doc('kms301-2-1-seci', '2.1 — The SECI knowledge-creation model|||2.1 — Mô hình tạo tri thức SECI',
  'Nonaka & Takeuchi: bốn chế độ chuyển hoá Socialization/Externalization/Combination/Internalization; không gian chia sẻ "ba".',
  [[
    `<span class="eyebrow">KMS301 · Chapter 2 · Lesson 2.1</span>
<h2>The SECI knowledge-creation model</h2>
<p>Nonaka &amp; Takeuchi argue that new knowledge is created by <strong>converting tacit and explicit knowledge into each other</strong>, in a repeating spiral of four modes:</p>
<ul>
<li><strong>Socialization (tacit → tacit)</strong> — sharing experience directly, e.g. an apprentice watching a master.</li>
<li><strong>Externalization (tacit → explicit)</strong> — putting know-how into words, metaphors, diagrams so others can use it.</li>
<li><strong>Combination (explicit → explicit)</strong> — merging documents and data into new, systematized knowledge (reports, databases).</li>
<li><strong>Internalization (explicit → tacit)</strong> — learning by doing, until written knowledge becomes second nature.</li>
</ul>
<h3>Ba — the shared context</h3>
<p>Nonaka adds <strong>ba</strong>: a shared space (physical, virtual or mental) where this conversion happens — a meeting room, a chat channel, a project team. Without ba, the spiral stalls.</p>
<div class="callout"><span class="badge">Real example</span> Nonaka&#39;s classic case: Matsushita&#39;s home bakery team could not program a good bread machine until an engineer apprenticed with a master baker (socialization), then translated the kneading &quot;twist&quot; into machine specs (externalization) — tacit skill turned into a shipped product.</div>`,
    `<span class="eyebrow">KMS301 · Chương 2 · Bài 2.1</span>
<h2>Mô hình tạo tri thức SECI</h2>
<p>Nonaka &amp; Takeuchi cho rằng tri thức mới được tạo ra bằng cách <strong>chuyển hoá tri thức ẩn và hiện qua lại lẫn nhau</strong>, theo vòng xoáy lặp gồm bốn chế độ:</p>
<ul>
<li><strong>Xã hội hoá (Socialization, ẩn → ẩn)</strong> — chia sẻ kinh nghiệm trực tiếp, vd học việc quan sát người thầy.</li>
<li><strong>Ngoại hoá (Externalization, ẩn → hiện)</strong> — diễn đạt bí quyết thành lời, ẩn dụ, sơ đồ để người khác dùng được.</li>
<li><strong>Kết hợp (Combination, hiện → hiện)</strong> — ghép tài liệu và dữ liệu thành tri thức mới, hệ thống hoá (báo cáo, cơ sở dữ liệu).</li>
<li><strong>Nội hoá (Internalization, hiện → ẩn)</strong> — học qua làm, tới khi tri thức viết ra trở thành bản năng.</li>
</ul>
<h3>Ba — không gian chia sẻ</h3>
<p>Nonaka bổ sung khái niệm <strong>ba</strong>: một không gian chung (vật lý, ảo hoặc tinh thần) nơi việc chuyển hoá diễn ra — phòng họp, kênh chat, nhóm dự án. Thiếu ba, vòng xoáy đứng lại.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Ca kinh điển của Nonaka: nhóm làm máy làm bánh mì của Matsushita không lập trình nổi một chiếc máy tốt cho tới khi một kỹ sư học việc cùng thợ bánh bậc thầy (xã hội hoá), rồi dịch cái &quot;xoắn nhào bột&quot; thành thông số máy (ngoại hoá) — kỹ năng ẩn hoá thành sản phẩm bán ra.</div>`,
  ]]);

const c2q = quiz('kms301-quiz-2', 'Quiz 2 — SECI model|||Quiz 2 — Mô hình SECI', [
  { id: 'q1', question: 'Chuyển tri thức ẩn thành tri thức hiện (viết ra thành lời/sơ đồ) là chế độ nào?|||Turning tacit knowledge into explicit (words/diagrams) is which mode?', options: ['Socialization', 'Externalization', 'Combination', 'Internalization'], correctIndex: 1, explanation: 'Externalization: ẩn → hiện.|||Externalization: tacit → explicit.' },
  { id: 'q2', question: '"Ba" trong lý thuyết Nonaka nghĩa là?|||In Nonaka&#39;s theory, "ba" means?', options: ['Một loại tài liệu|||A type of document', 'Không gian/ngữ cảnh chung để chia sẻ tri thức|||A shared space/context for sharing knowledge', 'Một phần mềm KMS|||A KMS software', 'Số ba chế độ chuyển hoá|||The number three of modes'], correctIndex: 1, explanation: 'Ba là không gian chung nơi chuyển hoá tri thức diễn ra.|||Ba is the shared space where knowledge conversion happens.' },
  { id: 'q3', question: 'Học việc bằng cách quan sát và bắt chước người thầy (ẩn → ẩn) là?|||Learning by watching and imitating a master (tacit → tacit) is?', options: ['Socialization', 'Combination', 'Internalization', 'Externalization'], correctIndex: 0, explanation: 'Socialization: chia sẻ kinh nghiệm ẩn trực tiếp.|||Socialization: sharing tacit experience directly.' },
]);

const c3 = doc('kms301-3-1-knowledge-life-cycle', '3.1 — The knowledge life cycle|||3.1 — Vòng đời tri thức',
  'Bốn giai đoạn: thu nhận (capture), mã hoá (codification), chia sẻ (sharing), áp dụng (application) — mô hình vòng đời KM của Dalkir.',
  [[
    `<span class="eyebrow">KMS301 · Chapter 3 · Lesson 3.1</span>
<h2>The knowledge life cycle</h2>
<p>Dalkir describes KM as a repeating cycle. Knowledge is not a thing you store once — it flows through stages:</p>
<ul>
<li><strong>Capture / creation</strong> — get knowledge out of heads and events: interviews, after-action reviews, lessons learned.</li>
<li><strong>Codification / organization</strong> — structure it so it can be found: tag, classify, put it in a taxonomy or repository.</li>
<li><strong>Sharing / transfer</strong> — move it to the people who need it: portals, communities, training.</li>
<li><strong>Application / reuse</strong> — put it to work in real decisions and tasks — the only stage that creates value.</li>
</ul>
<p>Feedback closes the loop: applying knowledge reveals gaps, which trigger new capture. A KMS is the toolset that supports each stage.</p>
<div class="callout"><span class="badge">Real example</span> NASA&#39;s <strong>Lessons Learned Information System (LLIS)</strong> captures mission successes and failures, codifies them into a searchable database, and shares them so future missions reuse hard-won knowledge instead of repeating fatal mistakes.</div>`,
    `<span class="eyebrow">KMS301 · Chương 3 · Bài 3.1</span>
<h2>Vòng đời tri thức</h2>
<p>Dalkir mô tả KM như một chu trình lặp. Tri thức không phải thứ lưu một lần — nó chảy qua các giai đoạn:</p>
<ul>
<li><strong>Thu nhận / tạo (capture)</strong> — lấy tri thức ra khỏi đầu người và sự kiện: phỏng vấn, tổng kết sau việc, bài học kinh nghiệm.</li>
<li><strong>Mã hoá / tổ chức (codification)</strong> — cấu trúc lại để tìm được: gắn thẻ, phân loại, đưa vào taxonomy hoặc kho lưu.</li>
<li><strong>Chia sẻ / truyền (sharing)</strong> — đưa tới người cần: cổng thông tin, cộng đồng, đào tạo.</li>
<li><strong>Áp dụng / tái dùng (application)</strong> — đưa vào quyết định và công việc thật — giai đoạn duy nhất tạo ra giá trị.</li>
</ul>
<p>Phản hồi khép vòng: áp dụng tri thức bộc lộ chỗ thiếu, kích hoạt thu nhận mới. KMS là bộ công cụ hỗ trợ từng giai đoạn.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Hệ thống <strong>Lessons Learned (LLIS)</strong> của NASA thu lại thành công và thất bại của các sứ mệnh, mã hoá vào một cơ sở dữ liệu tìm kiếm được, và chia sẻ để sứ mệnh sau tái dùng tri thức đắt giá thay vì lặp lại sai lầm chết người.</div>`,
  ]]);

const c3q = quiz('kms301-quiz-3', 'Quiz 3 — Knowledge life cycle|||Quiz 3 — Vòng đời tri thức', [
  { id: 'q1', question: 'Giai đoạn duy nhất thực sự tạo ra giá trị trong vòng đời tri thức là?|||The only stage that actually creates value in the life cycle is?', options: ['Thu nhận|||Capture', 'Mã hoá|||Codification', 'Áp dụng / tái dùng|||Application / reuse', 'Lưu trữ|||Storage'], correctIndex: 2, explanation: 'Tri thức chỉ sinh giá trị khi được áp dụng vào việc thật.|||Knowledge creates value only when applied to real work.' },
  { id: 'q2', question: 'Gắn thẻ, phân loại, đưa tri thức vào taxonomy để tìm được thuộc giai đoạn?|||Tagging, classifying and putting knowledge into a taxonomy belongs to?', options: ['Codification / organization', 'Application', 'Socialization', 'Wisdom'], correctIndex: 0, explanation: 'Mã hoá/tổ chức giúp tri thức tìm kiếm được.|||Codification/organization makes knowledge findable.' },
  { id: 'q3', question: 'Vì sao vòng đời tri thức được gọi là "vòng"?|||Why is the knowledge life cycle called a "cycle"?', options: ['Vì nó chỉ chạy một lần|||Because it runs only once', 'Vì áp dụng bộc lộ chỗ thiếu, kích hoạt thu nhận mới|||Because applying reveals gaps that trigger new capture', 'Vì dữ liệu bị xoá định kỳ|||Because data is deleted periodically', 'Vì nó không có điểm bắt đầu|||Because it has no start'], correctIndex: 1, explanation: 'Phản hồi từ áp dụng khép vòng và bắt đầu lại.|||Feedback from application closes the loop and restarts it.' },
]);

const c4 = doc('kms301-4-1-strategy-culture', '4.1 — KM strategy & culture|||4.1 — Chiến lược & văn hoá KM',
  'Hai chiến lược: codification (mã hoá, người-tới-tài liệu) vs personalization (cá nhân hoá, người-tới-người); văn hoá chia sẻ tri thức.',
  [[
    `<span class="eyebrow">KMS301 · Chapter 4 · Lesson 4.1</span>
<h2>KM strategy &amp; culture</h2>
<h3>Two strategies (Hansen, Nohria &amp; Tierney, HBR)</h3>
<ul>
<li><strong>Codification</strong> — write knowledge down and store it in databases so anyone can reuse it (people-to-documents). Best when problems are similar and repeatable.</li>
<li><strong>Personalization</strong> — connect people so they share tacit knowledge through dialogue (people-to-people). Best for unique, expert-driven problems.</li>
</ul>
<p>The HBR authors warn: pick a <strong>primary</strong> strategy (roughly 80/20). Firms that try to do both equally usually do neither well.</p>
<h3>Culture — the make-or-break factor</h3>
<p>Technology is the easy part. KM fails when <strong>knowledge is hoarded as power</strong>. A sharing culture needs trust, time, recognition and leadership that rewards contributing, not just knowing.</p>
<div class="callout"><span class="badge">Real example</span> HBR contrasted <strong>Accenture &amp; Ernst &amp; Young</strong> (codification — reusable methodologies in vast repositories) with <strong>McKinsey &amp; Bain</strong> (personalization — expert networks and &quot;who knows what&quot;). Same industry, deliberately opposite KM strategies, both successful.</div>`,
    `<span class="eyebrow">KMS301 · Chương 4 · Bài 4.1</span>
<h2>Chiến lược &amp; văn hoá KM</h2>
<h3>Hai chiến lược (Hansen, Nohria &amp; Tierney, HBR)</h3>
<ul>
<li><strong>Mã hoá (codification)</strong> — viết tri thức ra và lưu vào cơ sở dữ liệu để ai cũng tái dùng được (người-tới-tài liệu). Hợp khi vấn đề giống nhau, lặp lại.</li>
<li><strong>Cá nhân hoá (personalization)</strong> — kết nối con người để họ chia sẻ tri thức ẩn qua đối thoại (người-tới-người). Hợp với vấn đề độc nhất, dựa vào chuyên gia.</li>
</ul>
<p>Nhóm tác giả HBR cảnh báo: hãy chọn một chiến lược <strong>chính</strong> (khoảng 80/20). Công ty cố làm cả hai ngang nhau thường không làm tốt cái nào.</p>
<h3>Văn hoá — yếu tố sống còn</h3>
<p>Công nghệ là phần dễ. KM thất bại khi <strong>tri thức bị giữ khư khư như quyền lực</strong>. Văn hoá chia sẻ cần niềm tin, thời gian, sự ghi nhận và lãnh đạo tưởng thưởng cho việc đóng góp, không chỉ cho việc biết.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> HBR so sánh <strong>Accenture &amp; Ernst &amp; Young</strong> (mã hoá — phương pháp luận tái dùng trong kho khổng lồ) với <strong>McKinsey &amp; Bain</strong> (cá nhân hoá — mạng lưới chuyên gia và &quot;ai biết cái gì&quot;). Cùng ngành, chiến lược KM cố tình ngược nhau, cả hai đều thành công.</div>`,
  ]]);

const c4q = quiz('kms301-quiz-4', 'Quiz 4 — Strategy & culture|||Quiz 4 — Chiến lược & văn hoá', [
  { id: 'q1', question: 'Chiến lược "người-tới-tài liệu", viết tri thức vào kho để tái dùng, gọi là?|||The "people-to-documents" strategy of writing knowledge into repositories is?', options: ['Personalization (people-to-people)|||Cá nhân hoá (người-tới-người)', 'Codification (people-to-documents)|||Mã hoá (người-tới-tài liệu)', 'Socialization', 'Internalization'], correctIndex: 1, explanation: 'Codification lưu tri thức hiện để tái dùng.|||Codification stores explicit knowledge for reuse.' },
  { id: 'q2', question: 'Rào cản lớn nhất khiến KM thất bại thường là?|||The biggest barrier that makes KM fail is usually?', options: ['Thiếu phần cứng máy chủ|||Lack of server hardware', 'Văn hoá giữ tri thức làm quyền lực, không chịu chia sẻ|||A culture of hoarding knowledge as power', 'Băng thông mạng chậm|||Slow network bandwidth', 'Quá nhiều tài liệu|||Too many documents'], correctIndex: 1, explanation: 'Công nghệ là phần dễ; văn hoá chia sẻ mới quyết định.|||Technology is easy; a sharing culture is decisive.' },
  { id: 'q3', question: 'Theo HBR, công ty nên?|||According to HBR, a company should?', options: ['Làm cả hai chiến lược ngang 50/50|||Do both strategies equally 50/50', 'Chọn một chiến lược chính (~80/20)|||Choose one primary strategy (~80/20)', 'Bỏ hẳn chiến lược KM|||Drop KM strategy entirely', 'Chỉ dùng phần mềm đắt tiền|||Only use expensive software'], correctIndex: 1, explanation: 'Chọn một chiến lược chính, cái kia hỗ trợ.|||Pick one primary strategy, the other supports it.' },
]);

const c5 = doc('kms301-5-1-kms-technology', '5.1 — KMS technology|||5.1 — Công nghệ hệ thống quản lý tri thức',
  'Các loại KMS: quản lý tài liệu (document management), wiki, groupware/cộng tác, tìm kiếm doanh nghiệp (enterprise search).',
  [[
    `<span class="eyebrow">KMS301 · Chapter 5 · Lesson 5.1</span>
<h2>KMS technology</h2>
<p>A <strong>Knowledge Management System</strong> is the technology layer that supports the life cycle. Main categories:</p>
<ul>
<li><strong>Document / content management</strong> — store, version and control documents (e.g. SharePoint). The backbone of explicit knowledge.</li>
<li><strong>Wikis</strong> — anyone can edit, so knowledge grows collaboratively and stays current (e.g. Confluence, MediaWiki).</li>
<li><strong>Groupware / collaboration</strong> — shared workspaces, chat, forums where tacit knowledge surfaces (e.g. Microsoft Teams, Slack).</li>
<li><strong>Enterprise search</strong> — one search box across all repositories; often the single most valued KM feature, because unfindable knowledge is worthless.</li>
</ul>
<p>Key lesson: <strong>tools do not equal KM</strong>. Buying software without process and culture just creates an empty portal.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Wikipedia</strong> is the world&#39;s largest wiki — millions of contributors codify and continuously update explicit knowledge. Inside companies, <strong>Confluence</strong> and <strong>SharePoint</strong> play the same role for internal know-how.</div>`,
    `<span class="eyebrow">KMS301 · Chương 5 · Bài 5.1</span>
<h2>Công nghệ hệ thống quản lý tri thức</h2>
<p>Một <strong>Hệ thống quản lý tri thức (KMS)</strong> là lớp công nghệ hỗ trợ vòng đời tri thức. Các nhóm chính:</p>
<ul>
<li><strong>Quản lý tài liệu / nội dung</strong> — lưu, quản phiên bản và kiểm soát tài liệu (vd SharePoint). Xương sống của tri thức hiện.</li>
<li><strong>Wiki</strong> — ai cũng sửa được, nên tri thức lớn dần theo lối cộng tác và luôn cập nhật (vd Confluence, MediaWiki).</li>
<li><strong>Groupware / cộng tác</strong> — không gian làm việc chung, chat, diễn đàn nơi tri thức ẩn hiện ra (vd Microsoft Teams, Slack).</li>
<li><strong>Tìm kiếm doanh nghiệp (enterprise search)</strong> — một ô tìm kiếm xuyên mọi kho; thường là tính năng KM được coi trọng nhất, vì tri thức không tìm ra thì vô giá trị.</li>
</ul>
<p>Bài học quan trọng: <strong>công cụ không đồng nghĩa với KM</strong>. Mua phần mềm mà thiếu quy trình và văn hoá chỉ tạo ra một cổng thông tin trống rỗng.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> <strong>Wikipedia</strong> là wiki lớn nhất thế giới — hàng triệu người đóng góp mã hoá và liên tục cập nhật tri thức hiện. Trong doanh nghiệp, <strong>Confluence</strong> và <strong>SharePoint</strong> đóng vai trò tương tự cho bí quyết nội bộ.</div>`,
  ]]);

const c5q = quiz('kms301-quiz-5', 'Quiz 5 — KMS technology|||Quiz 5 — Công nghệ KMS', [
  { id: 'q1', question: 'Tính năng KMS thường được coi trọng nhất, vì tri thức không tìm ra thì vô dụng, là?|||The most valued KMS feature, since unfindable knowledge is useless, is?', options: ['Đổi màu giao diện|||Theme colors', 'Tìm kiếm doanh nghiệp (enterprise search)|||Enterprise search', 'Gửi email hàng loạt|||Mass email', 'Nén tệp|||File compression'], correctIndex: 1, explanation: 'Tìm kiếm doanh nghiệp giúp tri thức tìm ra được.|||Enterprise search makes knowledge findable.' },
  { id: 'q2', question: 'Công cụ KMS mà "ai cũng sửa được" để tri thức lớn dần theo lối cộng tác là?|||The KMS tool where "anyone can edit" so knowledge grows collaboratively is?', options: ['Wiki', 'Bảng tính rời|||A standalone spreadsheet', 'Máy in|||A printer', 'Firewall'], correctIndex: 0, explanation: 'Wiki (Confluence, MediaWiki) cho sửa cộng tác.|||Wikis (Confluence, MediaWiki) allow collaborative editing.' },
  { id: 'q3', question: 'Nhận định nào đúng về công nghệ KMS?|||Which statement about KMS technology is correct?', options: ['Mua phần mềm là đủ để có KM|||Buying software is enough for KM', 'Công cụ không đồng nghĩa KM; cần cả quy trình và văn hoá|||Tools do not equal KM; process and culture are also needed', 'KMS thay thế hoàn toàn con người|||KMS fully replaces people', 'Chỉ tập đoàn lớn mới cần KMS|||Only big corporations need KMS'], correctIndex: 1, explanation: 'Thiếu quy trình và văn hoá, KMS chỉ là cổng trống.|||Without process and culture, a KMS is just an empty portal.' },
]);

const c6 = doc('kms301-6-1-communities-sharing', '6.1 — Communities & knowledge sharing|||6.1 — Cộng đồng & chia sẻ tri thức',
  'Cộng đồng thực hành (community of practice), kể chuyện (storytelling), cố vấn (mentoring), định vị chuyên gia (expert location).',
  [[
    `<span class="eyebrow">KMS301 · Chapter 6 · Lesson 6.1</span>
<h2>Communities &amp; knowledge sharing</h2>
<p>Much tacit knowledge moves through people, not documents. Key mechanisms:</p>
<ul>
<li><strong>Community of practice (CoP)</strong> — a group who share a craft and learn from each other over time (coined by Lave &amp; Wenger). The heart of personalization strategy.</li>
<li><strong>Storytelling</strong> — narratives carry context and emotion that bullet points lose; stories make lessons memorable and transferable.</li>
<li><strong>Mentoring &amp; apprenticeship</strong> — direct tacit-to-tacit transfer (SECI socialization) between experienced and new staff.</li>
<li><strong>Expert location</strong> — systems that answer &quot;who knows about X?&quot; so people can find the right person fast.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> <strong>Xerox&#39;s Eureka</strong>: field repair technicians shared fix tips in a community-curated database. Anthropologist Julian Orr showed techs solved problems by swapping <em>war stories</em>, not by reading manuals — Eureka captured those stories and reportedly saved Xerox around 100 million dollars.</div>`,
    `<span class="eyebrow">KMS301 · Chương 6 · Bài 6.1</span>
<h2>Cộng đồng &amp; chia sẻ tri thức</h2>
<p>Phần lớn tri thức ẩn di chuyển qua con người, không qua tài liệu. Các cơ chế chính:</p>
<ul>
<li><strong>Cộng đồng thực hành (community of practice, CoP)</strong> — nhóm cùng nghề, học từ nhau theo thời gian (Lave &amp; Wenger đặt tên). Trái tim của chiến lược cá nhân hoá.</li>
<li><strong>Kể chuyện (storytelling)</strong> — câu chuyện mang theo ngữ cảnh và cảm xúc mà gạch đầu dòng đánh mất; chuyện làm bài học dễ nhớ và dễ truyền.</li>
<li><strong>Cố vấn &amp; học việc (mentoring)</strong> — truyền ẩn-tới-ẩn trực tiếp (xã hội hoá trong SECI) giữa người có kinh nghiệm và người mới.</li>
<li><strong>Định vị chuyên gia (expert location)</strong> — hệ thống trả lời &quot;ai biết về X?&quot; để người ta tìm đúng người thật nhanh.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> <strong>Eureka của Xerox</strong>: kỹ thuật viên sửa máy hiện trường chia sẻ mẹo sửa trong một cơ sở dữ liệu do cộng đồng biên tập. Nhà nhân học Julian Orr chỉ ra thợ giải quyết sự cố bằng cách kể <em>chuyện nghề</em> cho nhau, không phải đọc cẩm nang — Eureka thu lại những câu chuyện đó và được cho là giúp Xerox tiết kiệm khoảng 100 triệu đô.</div>`,
  ]]);

const c6q = quiz('kms301-quiz-6', 'Quiz 6 — Communities & sharing|||Quiz 6 — Cộng đồng & chia sẻ', [
  { id: 'q1', question: 'Nhóm người cùng nghề, học hỏi lẫn nhau theo thời gian, gọi là?|||A group of same-craft people who learn from each other over time is?', options: ['Cộng đồng thực hành (CoP)|||Community of practice (CoP)', 'Phòng ban chính thức|||A formal department', 'Cơ sở dữ liệu|||A database', 'Uỷ ban kỷ luật|||A disciplinary board'], correctIndex: 0, explanation: 'Community of practice là trung tâm của chia sẻ tri thức ẩn.|||A community of practice is central to sharing tacit knowledge.' },
  { id: 'q2', question: 'Vì sao kể chuyện (storytelling) hiệu quả để truyền tri thức?|||Why is storytelling effective for transferring knowledge?', options: ['Vì nó ngắn hơn tài liệu|||Because it is shorter than documents', 'Vì nó mang ngữ cảnh và cảm xúc mà gạch đầu dòng đánh mất|||Because it carries context and emotion that bullet points lose', 'Vì nó không cần con người|||Because it needs no people', 'Vì nó tự động hoá|||Because it is automated'], correctIndex: 1, explanation: 'Chuyện giữ ngữ cảnh, làm bài học dễ nhớ và dễ truyền.|||Stories keep context, making lessons memorable and transferable.' },
  { id: 'q3', question: 'Hệ thống trả lời câu hỏi "ai biết về chủ đề X?" được gọi là?|||A system answering "who knows about topic X?" is called?', options: ['Định vị chuyên gia (expert location)|||Expert location', 'Quản lý phiên bản|||Version control', 'Sao lưu dữ liệu|||Data backup', 'Tường lửa|||Firewall'], correctIndex: 0, explanation: 'Expert location giúp tìm đúng người nắm tri thức.|||Expert location helps find the right knowledge holder.' },
]);

const c7 = doc('kms301-7-1-km-new-tech', '7.1 — KM & new technology|||7.1 — KM & công nghệ mới',
  'AI/chatbot tri thức, web ngữ nghĩa (semantic) & ontology, knowledge graph — công nghệ mới thay đổi KM thế nào.',
  [[
    `<span class="eyebrow">KMS301 · Chapter 7 · Lesson 7.1</span>
<h2>KM &amp; new technology</h2>
<p>New technology is reshaping every stage of the KM life cycle:</p>
<ul>
<li><strong>AI &amp; knowledge chatbots</strong> — large language models answer questions from a company&#39;s documents (retrieval-augmented generation), turning a static repository into a conversational expert available 24/7.</li>
<li><strong>Semantic web &amp; ontology</strong> — an <strong>ontology</strong> formally defines concepts and their relationships, so machines can reason about meaning, not just match keywords.</li>
<li><strong>Knowledge graph</strong> — knowledge stored as a network of entities and relationships (nodes and edges), letting systems connect facts and answer complex queries.</li>
</ul>
<p>These make knowledge <strong>findable and connected</strong> at a scale manual codification never could — but they still depend on good source knowledge and governance.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Google&#39;s Knowledge Graph</strong> powers the info panels in search by linking billions of entities (people, places, things) and their relationships. In enterprises, the same idea underlies AI assistants that answer staff questions from internal wikis and tickets.</div>`,
    `<span class="eyebrow">KMS301 · Chương 7 · Bài 7.1</span>
<h2>KM &amp; công nghệ mới</h2>
<p>Công nghệ mới đang định hình lại mọi giai đoạn của vòng đời KM:</p>
<ul>
<li><strong>AI &amp; chatbot tri thức</strong> — mô hình ngôn ngữ lớn trả lời câu hỏi từ tài liệu của công ty (sinh có tăng cường truy hồi, RAG), biến kho tĩnh thành một chuyên gia trò chuyện được, sẵn sàng 24/7.</li>
<li><strong>Web ngữ nghĩa &amp; ontology</strong> — một <strong>ontology</strong> định nghĩa hình thức các khái niệm và quan hệ giữa chúng, để máy suy luận theo ý nghĩa chứ không chỉ khớp từ khoá.</li>
<li><strong>Knowledge graph</strong> — tri thức lưu dưới dạng mạng lưới thực thể và quan hệ (nút và cạnh), cho phép hệ thống nối các sự kiện và trả lời truy vấn phức tạp.</li>
</ul>
<p>Chúng làm tri thức <strong>tìm được và kết nối</strong> ở quy mô mà mã hoá thủ công không bao giờ đạt tới — nhưng vẫn phụ thuộc tri thức nguồn tốt và việc quản trị.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> <strong>Knowledge Graph của Google</strong> tạo ra các bảng thông tin trong tìm kiếm bằng cách nối hàng tỷ thực thể (người, nơi chốn, sự vật) và quan hệ của chúng. Trong doanh nghiệp, cùng ý tưởng đó nằm dưới các trợ lý AI trả lời câu hỏi nhân viên từ wiki và ticket nội bộ.</div>`,
  ]]);

const c7q = quiz('kms301-quiz-7', 'Quiz 7 — KM & new tech|||Quiz 7 — KM & công nghệ mới', [
  { id: 'q1', question: 'Tri thức lưu dưới dạng mạng lưới thực thể và quan hệ (nút và cạnh) gọi là?|||Knowledge stored as a network of entities and relationships (nodes and edges) is a?', options: ['Bảng tính|||Spreadsheet', 'Knowledge graph', 'Tệp PDF|||PDF file', 'Hàng đợi tin nhắn|||Message queue'], correctIndex: 1, explanation: 'Knowledge graph nối thực thể và quan hệ.|||A knowledge graph links entities and relationships.' },
  { id: 'q2', question: 'Một "ontology" trong KM dùng để?|||An "ontology" in KM is used to?', options: ['Nén dữ liệu|||Compress data', 'Định nghĩa hình thức các khái niệm và quan hệ để máy suy luận theo ý nghĩa|||Formally define concepts and relationships so machines reason about meaning', 'Tăng tốc mạng|||Speed up the network', 'Sao lưu ổ cứng|||Back up disks'], correctIndex: 1, explanation: 'Ontology cho máy hiểu ý nghĩa, không chỉ khớp từ khoá.|||An ontology lets machines grasp meaning, not just match keywords.' },
  { id: 'q3', question: 'Chatbot tri thức doanh nghiệp (RAG) vẫn phụ thuộc điều gì?|||An enterprise knowledge chatbot (RAG) still depends on?', options: ['Tri thức nguồn tốt và việc quản trị|||Good source knowledge and governance', 'Không phụ thuộc gì cả|||Nothing at all', 'Chỉ tốc độ GPU|||Only GPU speed', 'Số lượng nhân viên|||Headcount'], correctIndex: 0, explanation: 'AI chỉ tốt khi tri thức nguồn tốt và được quản trị.|||AI is only as good as its governed source knowledge.' },
]);

const c8 = doc('kms301-8-1-metrics-implementation', '8.1 — Measurement & implementation|||8.1 — Đo lường & triển khai',
  'Thước đo KM (KM metrics), vốn trí tuệ (intellectual capital), các bước triển khai, thách thức, ví dụ doanh nghiệp thật.',
  [[
    `<span class="eyebrow">KMS301 · Chapter 8 · Lesson 8.1</span>
<h2>Measurement &amp; implementation</h2>
<h3>Measuring KM</h3>
<ul>
<li><strong>KM metrics</strong> — process (contributions, reuse rate, search success) and outcome (time saved, faster onboarding, fewer repeated mistakes). Hard to isolate, so combine numbers with stories.</li>
<li><strong>Intellectual capital</strong> — the value of knowledge assets: <em>human</em> (skills), <em>structural</em> (processes, patents, systems) and <em>relational</em> (customers, partners) capital.</li>
</ul>
<h3>Implementing a KM program</h3>
<ol>
<li>Start from a business goal, not the technology.</li>
<li>Audit what knowledge exists and what is at risk.</li>
<li>Pick a strategy (codification / personalization) and pilot small.</li>
<li>Build culture &amp; incentives; then scale with the right KMS.</li>
</ol>
<h3>Common challenges</h3>
<p>Knowledge hoarding, no time to contribute, information overload, out-of-date content, and proving ROI. Leadership and culture beat technology every time.</p>
<div class="callout"><span class="badge">Real example</span> Sweden&#39;s <strong>Skandia</strong> published the first <em>Intellectual Capital</em> supplement to its annual report and built the <strong>Skandia Navigator</strong> to measure human and structural capital — a landmark attempt to show that intangible knowledge assets drive real value.</div>`,
    `<span class="eyebrow">KMS301 · Chương 8 · Bài 8.1</span>
<h2>Đo lường &amp; triển khai</h2>
<h3>Đo lường KM</h3>
<ul>
<li><strong>Thước đo KM</strong> — quá trình (số đóng góp, tỷ lệ tái dùng, tỷ lệ tìm thành công) và kết quả (thời gian tiết kiệm, hội nhập nhanh hơn, ít lặp sai lầm). Khó tách bạch, nên kết hợp con số với câu chuyện.</li>
<li><strong>Vốn trí tuệ (intellectual capital)</strong> — giá trị tài sản tri thức: vốn <em>con người</em> (kỹ năng), <em>cấu trúc</em> (quy trình, bằng sáng chế, hệ thống) và <em>quan hệ</em> (khách hàng, đối tác).</li>
</ul>
<h3>Triển khai một chương trình KM</h3>
<ol>
<li>Bắt đầu từ mục tiêu kinh doanh, không phải từ công nghệ.</li>
<li>Kiểm kê tri thức đang có và tri thức đang có nguy cơ mất.</li>
<li>Chọn chiến lược (mã hoá / cá nhân hoá) và thử nghiệm ở quy mô nhỏ.</li>
<li>Dựng văn hoá &amp; cơ chế khích lệ; rồi mới mở rộng bằng KMS phù hợp.</li>
</ol>
<h3>Thách thức thường gặp</h3>
<p>Giữ tri thức khư khư, không có thời gian đóng góp, quá tải thông tin, nội dung lỗi thời, và chứng minh ROI. Lãnh đạo và văn hoá luôn thắng công nghệ.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Công ty <strong>Skandia</strong> (Thuỵ Điển) công bố phụ lục <em>Vốn trí tuệ</em> đầu tiên trong báo cáo thường niên và xây <strong>Skandia Navigator</strong> để đo vốn con người và vốn cấu trúc — một nỗ lực mang tính cột mốc cho thấy tài sản tri thức vô hình tạo ra giá trị thật.</div>`,
  ]]);

const c8q = quiz('kms301-quiz-8', 'Quiz 8 — Metrics & implementation|||Quiz 8 — Đo lường & triển khai', [
  { id: 'q1', question: 'Vốn trí tuệ (intellectual capital) thường gồm ba loại vốn nào?|||Intellectual capital usually comprises which three types of capital?', options: ['Con người, cấu trúc, quan hệ|||Human, structural, relational', 'Tiền mặt, cổ phiếu, trái phiếu|||Cash, stocks, bonds', 'Đất, nhà, máy móc|||Land, buildings, machines', 'Dữ liệu, thông tin, nhiễu|||Data, information, noise'], correctIndex: 0, explanation: 'Vốn con người, cấu trúc và quan hệ.|||Human, structural and relational capital.' },
  { id: 'q2', question: 'Bước ĐẦU TIÊN khi triển khai một chương trình KM nên là?|||The FIRST step in implementing a KM program should be?', options: ['Mua phần mềm đắt nhất|||Buy the most expensive software', 'Bắt đầu từ mục tiêu kinh doanh, không phải công nghệ|||Start from a business goal, not technology', 'Sa thải chuyên gia cũ|||Fire senior experts', 'Xoá kho dữ liệu cũ|||Delete old repositories'], correctIndex: 1, explanation: 'KM phục vụ mục tiêu kinh doanh; công nghệ đến sau.|||KM serves a business goal; technology comes later.' },
  { id: 'q3', question: 'Vì sao đo lường KM khó?|||Why is measuring KM difficult?', options: ['Vì không ai quan tâm|||Because nobody cares', 'Vì khó tách riêng tác động của tri thức, nên cần kết hợp con số với câu chuyện|||Because the impact of knowledge is hard to isolate, so numbers must be paired with stories', 'Vì tri thức luôn miễn phí|||Because knowledge is always free', 'Vì máy tính không đếm được|||Because computers cannot count'], correctIndex: 1, explanation: 'Tác động tri thức khó tách bạch; kết hợp định lượng và định tính.|||Knowledge impact is hard to isolate; mix quantitative and qualitative evidence.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'KMS301',
    slug: 'kms301-knowledge-management-system',
    title: 'Knowledge management system',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KMS301.webp',
    shortDescription: 'Knowledge management from theory to systems — tacit vs explicit knowledge & DIKW, Nonaka SECI model, the KM life cycle, strategy & culture, KMS tools, communities of practice, AI & knowledge graphs, and metrics. Bilingual with real examples.|||Quản lý tri thức từ lý thuyết tới hệ thống — tri thức ẩn/hiện & DIKW, mô hình SECI của Nonaka, vòng đời tri thức, chiến lược & văn hoá, công nghệ KMS, cộng đồng thực hành, AI & knowledge graph, đo lường. Song ngữ, ví dụ doanh nghiệp thật & quiz.',
    description: 'Môn <strong>KMS301 — Knowledge Management System</strong> (kỳ 7, ngành Hệ thống thông tin) giúp hiểu <strong>cách tổ chức biến tri thức thành tài sản</strong>. Từ <strong>nền tảng</strong> (tháp DIKW, tri thức ẩn/hiện) → <strong>mô hình SECI</strong> của Nonaka &amp; Takeuchi → <strong>vòng đời tri thức</strong> (thu nhận → mã hoá → chia sẻ → áp dụng) → <strong>chiến lược &amp; văn hoá KM</strong> → <strong>công nghệ KMS</strong> → <strong>cộng đồng thực hành</strong> → <strong>AI &amp; knowledge graph</strong> → <strong>đo lường &amp; triển khai</strong>. Bám sách chuẩn quốc tế (Nonaka &amp; Takeuchi, Dalkir, Davenport &amp; Prusak), song ngữ, có ví dụ doanh nghiệp thật và quiz mỗi chương.',
    whatYouLearn: 'Tháp DIKW & tri thức ẩn/hiện; mô hình SECI (socialization/externalization/combination/internalization) & khái niệm ba; vòng đời tri thức (capture → codification → sharing → application); chiến lược codification vs personalization & văn hoá chia sẻ; công nghệ KMS (document management, wiki, groupware, enterprise search); cộng đồng thực hành, storytelling, mentoring, expert location; AI/chatbot, ontology & knowledge graph; thước đo KM & vốn trí tuệ; các bước triển khai và thách thức.',
    requirements: 'Không cần kiến thức kỹ thuật sâu. Hiểu cơ bản về tổ chức/doanh nghiệp và hệ thống thông tin là đủ. Xem điều kiện tiên quyết trong khung ngành Hệ thống thông tin trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn quốc tế, tài liệu miễn phí, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'KM là gì, vì sao quan trọng, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Quản lý tri thức là gì|||Chapter 1 — What is KM', description: 'DIKW, tri thức ẩn/hiện, vì sao cần KM.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mô hình tạo tri thức SECI|||Chapter 2 — The SECI model', description: 'Bốn chế độ chuyển hoá & khái niệm ba.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Vòng đời tri thức|||Chapter 3 — Knowledge life cycle', description: 'Thu nhận, mã hoá, chia sẻ, áp dụng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Chiến lược & văn hoá KM|||Chapter 4 — Strategy & culture', description: 'Codification vs personalization, văn hoá chia sẻ.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Công nghệ KMS|||Chapter 5 — KMS technology', description: 'Document management, wiki, groupware, enterprise search.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Cộng đồng & chia sẻ tri thức|||Chapter 6 — Communities & sharing', description: 'CoP, storytelling, mentoring, expert location.', lessons: [c6, c6q] },
    { title: 'Chương 7 — KM & công nghệ mới|||Chapter 7 — KM & new technology', description: 'AI/chatbot, ontology, knowledge graph.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường & triển khai|||Chapter 8 — Measurement & implementation', description: 'KM metrics, vốn trí tuệ, triển khai, thách thức.', lessons: [c8, c8q] },
  ],
};
