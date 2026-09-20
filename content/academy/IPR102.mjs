/**
 * IPR102 — Intellectual Property Rights (Quyền sở hữu trí tuệ). Ngành Thiết kế
 * mỹ thuật số, kỳ 8, FPTU. Song ngữ VI+EN, 8 chương (mỗi chương 1 DOCUMENT +
 * 1 QUIZ 3 câu). Nguồn trích dẫn: Luật SHTT VN 2005 (sửa đổi 2009/2019/2022);
 * WIPO "Understanding Copyright and Related Rights", "Understanding Industrial
 * Property"; các công ước Berne, Paris, TRIPS. KHÔNG upload PDF.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ipr102-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, Luật SHTT VN, tài liệu WIPO, các công ước quốc tế, công cụ tra cứu, lộ trình tự học.',
  [[
    `<span class="eyebrow">IPR102 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Intellectual Property Rights</strong> for digital artists — copyright, industrial property, registration and enforcement — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, official, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for IPR102 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>⚖️ Primary law (Vietnam)</h3>
<ul>
<li><strong>Luật Sở hữu trí tuệ 2005</strong>, amended <strong>2009, 2019, 2022</strong> — the master statute for copyright, industrial property and plant varieties.</li>
<li><a href="https://ipvietnam.gov.vn" target="_blank" rel="noopener">Cục Sở hữu trí tuệ Việt Nam (IP Vietnam)</a> — the national IP office: filing, search, official notices.</li>
</ul>
<h3>🌐 WIPO &amp; international</h3>
<ul>
<li><a href="https://www.wipo.int/publications/en/details.jsp?id=4081" target="_blank" rel="noopener">WIPO — Understanding Copyright and Related Rights</a></li>
<li><a href="https://www.wipo.int/publications/en/details.jsp?id=4080" target="_blank" rel="noopener">WIPO — Understanding Industrial Property</a></li>
<li><a href="https://www.wipo.int/treaties/en/ip/berne/" target="_blank" rel="noopener">Berne Convention</a> · <a href="https://www.wipo.int/treaties/en/ip/paris/" target="_blank" rel="noopener">Paris Convention</a> · <a href="https://www.wto.org/english/tratop_e/trips_e/trips_e.htm" target="_blank" rel="noopener">TRIPS Agreement (WTO)</a></li>
</ul>
<h3>🛠️ Tools &amp; search</h3>
<ul>
<li><a href="https://patentscope.wipo.int/" target="_blank" rel="noopener">WIPO PATENTSCOPE</a> — search patents worldwide</li>
<li><a href="https://branddb.wipo.int/" target="_blank" rel="noopener">WIPO Global Brand Database</a> — search trademarks</li>
<li><a href="https://creativecommons.org/choose/" target="_blank" rel="noopener">Creative Commons — choose a licence</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — what IP is, why it exists, the two big families (copyright vs industrial property).</li>
<li><strong>Rights that matter to designers</strong> — copyright, trademarks, industrial designs.</li>
<li><strong>Procedure</strong> — how to register at the IP Office of Vietnam and what protection you get.</li>
<li><strong>Practice</strong> — enforcement, licensing (Creative Commons) and IP in the digital world.</li>
</ol></div>`,
    `<span class="eyebrow">IPR102 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Quyền sở hữu trí tuệ</strong> cho nhà thiết kế số — quyền tác giả, sở hữu công nghiệp, đăng ký và thực thi — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, chính thống, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của IPR102 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>⚖️ Luật gốc (Việt Nam)</h3>
<ul>
<li><strong>Luật Sở hữu trí tuệ 2005</strong>, sửa đổi <strong>2009, 2019, 2022</strong> — đạo luật gốc cho quyền tác giả, sở hữu công nghiệp và giống cây trồng.</li>
<li><a href="https://ipvietnam.gov.vn" target="_blank" rel="noopener">Cục Sở hữu trí tuệ Việt Nam</a> — cơ quan SHTT quốc gia: nộp đơn, tra cứu, thông báo chính thức.</li>
</ul>
<h3>🌐 WIPO &amp; quốc tế</h3>
<ul>
<li><a href="https://www.wipo.int/publications/en/details.jsp?id=4081" target="_blank" rel="noopener">WIPO — Understanding Copyright and Related Rights</a></li>
<li><a href="https://www.wipo.int/publications/en/details.jsp?id=4080" target="_blank" rel="noopener">WIPO — Understanding Industrial Property</a></li>
<li><a href="https://www.wipo.int/treaties/en/ip/berne/" target="_blank" rel="noopener">Công ước Berne</a> · <a href="https://www.wipo.int/treaties/en/ip/paris/" target="_blank" rel="noopener">Công ước Paris</a> · <a href="https://www.wto.org/english/tratop_e/trips_e/trips_e.htm" target="_blank" rel="noopener">Hiệp định TRIPS (WTO)</a></li>
</ul>
<h3>🛠️ Công cụ &amp; tra cứu</h3>
<ul>
<li><a href="https://patentscope.wipo.int/" target="_blank" rel="noopener">WIPO PATENTSCOPE</a> — tra cứu sáng chế toàn cầu</li>
<li><a href="https://branddb.wipo.int/" target="_blank" rel="noopener">WIPO Global Brand Database</a> — tra cứu nhãn hiệu</li>
<li><a href="https://creativecommons.org/choose/" target="_blank" rel="noopener">Creative Commons — chọn giấy phép</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — SHTT là gì, vì sao tồn tại, hai họ lớn (quyền tác giả vs sở hữu công nghiệp).</li>
<li><strong>Quyền quan trọng với nhà thiết kế</strong> — quyền tác giả, nhãn hiệu, kiểu dáng công nghiệp.</li>
<li><strong>Thủ tục</strong> — cách đăng ký tại Cục SHTT Việt Nam và phạm vi bảo hộ nhận được.</li>
<li><strong>Thực hành</strong> — thực thi, cấp phép (Creative Commons) và SHTT trong môi trường số.</li>
</ol></div>`,
  ]]);

const intro = doc('ipr102-0-1-overview', 'Course overview: Intellectual Property Rights|||Tổng quan: Quyền sở hữu trí tuệ',
  'SHTT là gì, vì sao tồn tại; hai họ lớn (quyền tác giả & sở hữu công nghiệp); lộ trình 8 chương và ý nghĩa với nhà thiết kế mỹ thuật số.',
  [[
    `<span class="eyebrow">IPR102 · Lesson 0.1 · Overview</span>
<h2>Intellectual Property Rights</h2>
<p class="lead">This course explains <strong>how the law protects creations of the mind</strong> — the drawings, logos, brand names, products and software behind a designer's work. You will learn what rights exist, how to obtain them, and how to avoid infringing others.</p>
<h3>What is intellectual property?</h3>
<p><strong>Intellectual property (IP)</strong> is a legal right over an intangible creation: a design, a song, an invention, a brand. Unlike a physical object, an idea can be copied infinitely at almost no cost — IP law gives the creator a time-limited, exclusive right so they can benefit from their work.</p>
<h3>Two great families</h3>
<pre><code>Intellectual property
 ├─ Copyright &amp; related rights  -> works of authorship (art, code, music)
 │      automatic, no registration required
 └─ Industrial property         -> patents, trademarks, industrial designs
        rights arise on REGISTRATION at the IP office</code></pre>
<h3>Roadmap (8 chapters)</h3>
<p>Overview → copyright &amp; related rights → patents &amp; utility solutions → trademarks &amp; geographical indications → industrial designs &amp; layout designs → registration at the IP Office of Vietnam → infringement &amp; enforcement → IP in the digital world (Creative Commons &amp; the international system).</p>
<div class="callout"><span class="badge">Why designers care</span> Every logo, illustration, UI and typeface is IP. Knowing the rules protects your own work and keeps you from unknowingly using someone else's.</div>`,
    `<span class="eyebrow">IPR102 · Bài 0.1 · Tổng quan</span>
<h2>Quyền sở hữu trí tuệ</h2>
<p class="lead">Môn này giải thích <strong>pháp luật bảo hộ các sáng tạo trí tuệ ra sao</strong> — hình vẽ, logo, tên thương hiệu, sản phẩm và phần mềm đằng sau công việc của nhà thiết kế. Bạn sẽ học có những quyền gì, làm sao có được, và cách tránh xâm phạm người khác.</p>
<h3>Sở hữu trí tuệ là gì?</h3>
<p><strong>Sở hữu trí tuệ (SHTT)</strong> là quyền pháp lý đối với một sáng tạo vô hình: một thiết kế, một bài hát, một sáng chế, một thương hiệu. Khác vật thể hữu hình, một ý tưởng có thể bị sao chép vô hạn gần như không tốn chi phí — luật SHTT trao cho người sáng tạo một quyền độc quyền có thời hạn để họ hưởng lợi từ công sức của mình.</p>
<h3>Hai họ lớn</h3>
<pre><code>Sở hữu trí tuệ
 ├─ Quyền tác giả &amp; quyền liên quan -> tác phẩm (mỹ thuật, mã, nhạc)
 │      tự động, KHÔNG bắt buộc đăng ký
 └─ Quyền sở hữu công nghiệp         -> sáng chế, nhãn hiệu, kiểu dáng
        quyền phát sinh khi ĐĂNG KÝ tại cơ quan SHTT</code></pre>
<h3>Lộ trình (8 chương)</h3>
<p>Tổng quan → quyền tác giả &amp; quyền liên quan → sáng chế &amp; giải pháp hữu ích → nhãn hiệu &amp; chỉ dẫn địa lý → kiểu dáng công nghiệp &amp; thiết kế bố trí → đăng ký tại Cục SHTT Việt Nam → xâm phạm &amp; thực thi → SHTT trong môi trường số (Creative Commons &amp; hệ thống quốc tế).</p>
<div class="callout"><span class="badge">Vì sao nhà thiết kế cần</span> Mỗi logo, minh hoạ, giao diện và bộ chữ đều là SHTT. Nắm luật giúp bảo vệ chính tác phẩm của bạn và tránh vô tình dùng phải của người khác.</div>`,
  ]]);

const c1 = doc('ipr102-1-1-ip-fundamentals', '1.1 — What IP is & why it exists|||1.1 — SHTT là gì & vì sao tồn tại',
  'Định nghĩa SHTT, tài sản vô hình; ba mục tiêu (khuyến khích sáng tạo, công khai tri thức, cân bằng lợi ích); phân loại đối tượng theo Luật SHTT 2005.',
  [[
    `<span class="eyebrow">IPR102 · Chapter 1 · Lesson 1.1</span>
<h2>What IP is &amp; why it exists</h2>
<h3>Intangible property</h3>
<p>IP is <strong>property you cannot touch</strong>. You can own the copyright in a painting without owning the canvas; you can sell a licence to a logo while keeping the logo yourself. This is what makes IP different from ordinary goods.</p>
<h3>Why society grants these rights</h3>
<ul>
<li><strong>Incentive to create</strong> — a time-limited monopoly lets creators recover their effort and invest again.</li>
<li><strong>Disclosure of knowledge</strong> — a patent is published in exchange for protection, so others can learn and build on it.</li>
<li><strong>Balance</strong> — rights are limited in time and scope so knowledge eventually returns to the public.</li>
</ul>
<h3>Subject matter under Vietnamese law</h3>
<pre><code>Luật SHTT 2005 protects three groups:
  1. Copyright &amp; related rights (quyền tác giả &amp; quyền liên quan)
  2. Industrial property        (quyền sở hữu công nghiệp)
  3. Plant variety rights        (quyền đối với giống cây trồng)</code></pre>
<div class="callout"><span class="badge">Key idea</span> IP is a bargain: society gives the creator an exclusive right for a limited time, and in return gets new creations and, eventually, free access to them.</div>`,
    `<span class="eyebrow">IPR102 · Chương 1 · Bài 1.1</span>
<h2>SHTT là gì &amp; vì sao tồn tại</h2>
<h3>Tài sản vô hình</h3>
<p>SHTT là <strong>tài sản không thể cầm nắm</strong>. Bạn có thể sở hữu quyền tác giả một bức tranh mà không sở hữu tấm toan; có thể bán giấy phép dùng một logo trong khi vẫn giữ logo đó. Đây là điều khiến SHTT khác với hàng hoá thông thường.</p>
<h3>Vì sao xã hội trao các quyền này</h3>
<ul>
<li><strong>Khuyến khích sáng tạo</strong> — độc quyền có thời hạn giúp người sáng tạo thu hồi công sức và tái đầu tư.</li>
<li><strong>Công khai tri thức</strong> — một sáng chế được công bố để đổi lấy bảo hộ, nhờ đó người khác học và phát triển tiếp.</li>
<li><strong>Cân bằng lợi ích</strong> — quyền bị giới hạn về thời gian và phạm vi để tri thức cuối cùng quay về cộng đồng.</li>
</ul>
<h3>Đối tượng bảo hộ theo luật Việt Nam</h3>
<pre><code>Luật SHTT 2005 bảo hộ ba nhóm:
  1. Quyền tác giả &amp; quyền liên quan
  2. Quyền sở hữu công nghiệp
  3. Quyền đối với giống cây trồng</code></pre>
<div class="callout"><span class="badge">Ý chính</span> SHTT là một cuộc trao đổi: xã hội trao cho người sáng tạo độc quyền có thời hạn, đổi lại nhận được sáng tạo mới và cuối cùng là quyền tiếp cận tự do.</div>`,
  ]]);

const c1q = quiz('ipr102-quiz-1', 'Quiz 1 — Fundamentals|||Quiz 1 — Nền tảng SHTT', [
  { id: 'q1', question: 'Sở hữu trí tuệ là quyền đối với loại tài sản nào?', options: ['Tài sản hữu hình (đất, máy móc)', 'Tài sản vô hình (sáng tạo trí tuệ)', 'Tiền mặt', 'Cổ phiếu'], correctIndex: 1, explanation: 'SHTT là quyền đối với sáng tạo trí tuệ vô hình, tách rời khỏi vật thể mang nó.' },
  { id: 'q2', question: 'Vì sao xã hội trao độc quyền CÓ THỜI HẠN cho người sáng tạo?', options: ['Để độc quyền vĩnh viễn', 'Để khuyến khích sáng tạo rồi tri thức quay về cộng đồng', 'Để cấm mọi người dùng', 'Để tăng thuế'], correctIndex: 1, explanation: 'Bảo hộ có thời hạn vừa khuyến khích sáng tạo, vừa đảm bảo tri thức cuối cùng trở thành của chung.' },
  { id: 'q3', question: 'Luật SHTT Việt Nam 2005 bảo hộ mấy nhóm đối tượng chính?', options: ['Một nhóm', 'Hai nhóm', 'Ba nhóm (tác giả, công nghiệp, giống cây trồng)', 'Năm nhóm'], correctIndex: 2, explanation: 'Ba nhóm: quyền tác giả & quyền liên quan, quyền sở hữu công nghiệp, quyền đối với giống cây trồng.' },
]);

const c2 = doc('ipr102-2-1-copyright', '2.1 — Copyright & related rights|||2.1 — Quyền tác giả & quyền liên quan',
  'Điều kiện bảo hộ (định hình, nguyên gốc, không cần đăng ký); quyền nhân thân & quyền tài sản; quyền liên quan (biểu diễn, ghi âm, phát sóng); thời hạn; Berne.',
  [[
    `<span class="eyebrow">IPR102 · Chapter 2 · Lesson 2.1</span>
<h2>Copyright &amp; related rights</h2>
<h3>What copyright protects</h3>
<p>Copyright protects <strong>original works of authorship</strong> — literary, artistic and scientific works, including drawings, graphic designs, photographs, software and websites. Protection is <strong>automatic</strong> from the moment the work is <em>fixed</em> in a tangible form; registration is optional but useful as evidence.</p>
<h3>Two bundles of rights</h3>
<ul>
<li><strong>Moral rights (quyền nhân thân)</strong> — to be named as author, to keep the work's integrity. In Vietnam these are largely perpetual and cannot be transferred.</li>
<li><strong>Economic rights (quyền tài sản)</strong> — to reproduce, distribute, communicate, adapt. These can be licensed or sold.</li>
</ul>
<h3>Related rights (quyền liên quan)</h3>
<p>Rights of those who bring works to the public: <strong>performers, phonogram producers, broadcasting organisations</strong>.</p>
<pre><code>Term of protection (Vietnam, typical):
  Economic rights: author's life + 50 years
  Applied/photographic/cinematographic: 75 years from publication
  Moral rights (attribution, integrity): indefinite
Berne Convention: automatic protection, no formality, min. life + 50</code></pre>
<div class="callout"><span class="badge">Idea vs expression</span> Copyright protects the <em>expression</em>, not the idea. A "flat-design fox mascot" idea is free; your specific drawing of it is protected.</div>`,
    `<span class="eyebrow">IPR102 · Chương 2 · Bài 2.1</span>
<h2>Quyền tác giả &amp; quyền liên quan</h2>
<h3>Quyền tác giả bảo hộ gì</h3>
<p>Quyền tác giả bảo hộ <strong>tác phẩm nguyên gốc</strong> — tác phẩm văn học, nghệ thuật, khoa học, gồm hình vẽ, thiết kế đồ hoạ, ảnh chụp, phần mềm và website. Bảo hộ <strong>tự động</strong> từ khi tác phẩm được <em>định hình</em> dưới dạng vật chất; đăng ký là tuỳ chọn nhưng hữu ích để làm chứng cứ.</p>
<h3>Hai nhóm quyền</h3>
<ul>
<li><strong>Quyền nhân thân</strong> — được đứng tên tác giả, bảo vệ sự toàn vẹn tác phẩm. Ở Việt Nam phần lớn là vô thời hạn và không được chuyển giao.</li>
<li><strong>Quyền tài sản</strong> — sao chép, phân phối, truyền đạt, làm tác phẩm phái sinh. Có thể cấp phép hoặc bán.</li>
</ul>
<h3>Quyền liên quan</h3>
<p>Quyền của những người đưa tác phẩm đến công chúng: <strong>người biểu diễn, nhà sản xuất bản ghi âm, tổ chức phát sóng</strong>.</p>
<pre><code>Thời hạn bảo hộ (Việt Nam, điển hình):
  Quyền tài sản: suốt đời tác giả + 50 năm
  Mỹ thuật ứng dụng/ảnh/điện ảnh: 75 năm kể từ khi công bố
  Quyền nhân thân (đứng tên, toàn vẹn): vô thời hạn
Công ước Berne: bảo hộ tự động, không thủ tục, tối thiểu đời + 50</code></pre>
<div class="callout"><span class="badge">Ý tưởng vs cách thể hiện</span> Quyền tác giả bảo hộ <em>cách thể hiện</em>, không bảo hộ ý tưởng. Ý tưởng "linh vật cáo phong cách phẳng" là tự do; bức vẽ cụ thể của bạn thì được bảo hộ.</div>`,
  ]]);

const c2q = quiz('ipr102-quiz-2', 'Quiz 2 — Copyright|||Quiz 2 — Quyền tác giả', [
  { id: 'q1', question: 'Quyền tác giả phát sinh khi nào?', options: ['Khi nộp đơn đăng ký', 'Tự động khi tác phẩm được định hình dưới dạng vật chất', 'Khi được cấp bằng', 'Sau 1 năm công bố'], correctIndex: 1, explanation: 'Quyền tác giả tự động phát sinh khi tác phẩm được định hình; đăng ký chỉ để làm chứng cứ.' },
  { id: 'q2', question: 'Quyền tác giả bảo hộ điều gì?', options: ['Ý tưởng', 'Cách thể hiện cụ thể của tác phẩm', 'Cả ý tưởng lẫn công dụng', 'Tên thương hiệu'], correctIndex: 1, explanation: 'Quyền tác giả bảo hộ cách thể hiện (expression), KHÔNG bảo hộ ý tưởng trừu tượng.' },
  { id: 'q3', question: 'Đâu là ví dụ của "quyền liên quan"?', options: ['Quyền của người biểu diễn, nhà sản xuất bản ghi, tổ chức phát sóng', 'Quyền đứng tên tác giả', 'Quyền sáng chế', 'Quyền nhãn hiệu'], correctIndex: 0, explanation: 'Quyền liên quan thuộc về người biểu diễn, nhà sản xuất bản ghi âm/ghi hình và tổ chức phát sóng.' },
]);

const c3 = doc('ipr102-3-1-patents', '3.1 — Patents & utility solutions|||3.1 — Sáng chế & giải pháp hữu ích',
  'Sáng chế là gì; ba điều kiện (mới, trình độ sáng tạo, khả năng áp dụng công nghiệp); bằng độc quyền sáng chế vs giải pháp hữu ích; thời hạn; nguyên tắc first-to-file.',
  [[
    `<span class="eyebrow">IPR102 · Chapter 3 · Lesson 3.1</span>
<h2>Patents &amp; utility solutions</h2>
<h3>What a patent protects</h3>
<p>A <strong>patent</strong> protects a <em>technical solution</em> — a product or process that solves a problem. In exchange for disclosing how it works, the owner gets an exclusive right to exploit it for a limited term.</p>
<h3>The three conditions</h3>
<ul>
<li><strong>Novelty</strong> — not disclosed anywhere in the world before filing.</li>
<li><strong>Inventive step</strong> — not obvious to a skilled person.</li>
<li><strong>Industrial applicability</strong> — can be made or used in practice.</li>
</ul>
<h3>Two levels of protection (Vietnam)</h3>
<pre><code>Invention patent (Bằng độc quyền sáng chế)
   requires novelty + inventive step + applicability
   term: 20 years from filing (no renewal)

Utility solution (Bằng độc quyền giải pháp hữu ích)
   requires novelty + applicability (no inventive step)
   term: 10 years from filing

Rule: FIRST-TO-FILE — the first to file wins, not the first to invent</code></pre>
<div class="callout"><span class="badge">Careful</span> Publicly showing your invention (a demo, a post) <em>before</em> filing can destroy novelty. File first, then reveal.</div>`,
    `<span class="eyebrow">IPR102 · Chương 3 · Bài 3.1</span>
<h2>Sáng chế &amp; giải pháp hữu ích</h2>
<h3>Sáng chế bảo hộ gì</h3>
<p>Một <strong>sáng chế</strong> bảo hộ một <em>giải pháp kỹ thuật</em> — sản phẩm hoặc quy trình giải quyết một vấn đề. Đổi lại việc công bố cách hoạt động, chủ sở hữu được độc quyền khai thác trong một thời hạn giới hạn.</p>
<h3>Ba điều kiện</h3>
<ul>
<li><strong>Tính mới</strong> — chưa bị bộc lộ ở bất kỳ đâu trên thế giới trước ngày nộp đơn.</li>
<li><strong>Trình độ sáng tạo</strong> — không hiển nhiên với người có trình độ trung bình trong lĩnh vực.</li>
<li><strong>Khả năng áp dụng công nghiệp</strong> — có thể sản xuất hoặc sử dụng trong thực tế.</li>
</ul>
<h3>Hai mức bảo hộ (Việt Nam)</h3>
<pre><code>Bằng độc quyền sáng chế
   cần: mới + trình độ sáng tạo + áp dụng công nghiệp
   thời hạn: 20 năm từ ngày nộp đơn (không gia hạn)

Bằng độc quyền giải pháp hữu ích
   cần: mới + áp dụng công nghiệp (không cần trình độ sáng tạo)
   thời hạn: 10 năm từ ngày nộp đơn

Nguyên tắc: NỘP ĐƠN ĐẦU TIÊN — ai nộp trước được, không xét ai làm ra trước</code></pre>
<div class="callout"><span class="badge">Lưu ý</span> Công khai sáng chế (demo, đăng bài) <em>trước</em> khi nộp đơn có thể làm mất tính mới. Nộp đơn trước, rồi mới công bố.</div>`,
  ]]);

const c3q = quiz('ipr102-quiz-3', 'Quiz 3 — Patents|||Quiz 3 — Sáng chế', [
  { id: 'q1', question: 'Ba điều kiện bảo hộ của một sáng chế là?', options: ['Đẹp, rẻ, bền', 'Tính mới, trình độ sáng tạo, khả năng áp dụng công nghiệp', 'Nổi tiếng, đã bán, có logo', 'Đăng ký, công bố, nộp phí'], correctIndex: 1, explanation: 'Sáng chế cần: tính mới, trình độ sáng tạo và khả năng áp dụng công nghiệp.' },
  { id: 'q2', question: 'Giải pháp hữu ích khác sáng chế ở chỗ nào?', options: ['Không cần tính mới', 'Không đòi hỏi trình độ sáng tạo, thời hạn 10 năm', 'Bảo hộ vĩnh viễn', 'Không cần nộp đơn'], correctIndex: 1, explanation: 'Giải pháp hữu ích chỉ cần tính mới + khả năng áp dụng công nghiệp, thời hạn 10 năm.' },
  { id: 'q3', question: 'Việt Nam áp dụng nguyên tắc nào khi có nhiều người cùng nộp đơn sáng chế?', options: ['Người sáng tạo trước được (first-to-invent)', 'Người nộp đơn đầu tiên được (first-to-file)', 'Người nổi tiếng hơn được', 'Bốc thăm'], correctIndex: 1, explanation: 'Nguyên tắc nộp đơn đầu tiên (first-to-file): ai nộp trước được ưu tiên bảo hộ.' },
]);

const c4 = doc('ipr102-4-1-trademarks', '4.1 — Trademarks & geographical indications|||4.1 — Nhãn hiệu & chỉ dẫn địa lý',
  'Nhãn hiệu là gì (dấu hiệu phân biệt); điều kiện bảo hộ & dấu hiệu bị loại; thời hạn 10 năm gia hạn vô hạn; nhãn hiệu nổi tiếng; chỉ dẫn địa lý.',
  [[
    `<span class="eyebrow">IPR102 · Chapter 4 · Lesson 4.1</span>
<h2>Trademarks &amp; geographical indications</h2>
<h3>What a trademark is</h3>
<p>A <strong>trademark</strong> is a <em>sign that distinguishes</em> the goods or services of one business from another — a word, logo, or combination. Its job is to identify origin and carry reputation.</p>
<h3>Protectable vs excluded</h3>
<ul>
<li><strong>Protectable</strong> — distinctive signs: invented words, stylised logos, distinctive colour combinations.</li>
<li><strong>Excluded</strong> — signs that are generic, purely descriptive, deceptive, or identical/confusingly similar to an earlier mark; national flags and official emblems.</li>
</ul>
<h3>Term &amp; famous marks</h3>
<pre><code>Trademark term (Vietnam):
   10 years from filing, RENEWABLE indefinitely (10-year blocks)
   -> a brand can last forever if kept in use and renewed

Well-known mark (nhãn hiệu nổi tiếng):
   protected even without registration, across classes</code></pre>
<h3>Geographical indications</h3>
<p>A <strong>geographical indication (GI)</strong> marks goods whose quality or reputation comes from a place — e.g. "Phú Quốc" fish sauce. GIs belong to the State and are used collectively by qualifying producers.</p>
<div class="callout"><span class="badge">Designer tip</span> Before finalising a brand name or logo, search the trademark register (WIPO Global Brand Database, IP Vietnam) to avoid clashing with an existing mark.</div>`,
    `<span class="eyebrow">IPR102 · Chương 4 · Bài 4.1</span>
<h2>Nhãn hiệu &amp; chỉ dẫn địa lý</h2>
<h3>Nhãn hiệu là gì</h3>
<p>Một <strong>nhãn hiệu</strong> là <em>dấu hiệu phân biệt</em> hàng hoá, dịch vụ của doanh nghiệp này với doanh nghiệp khác — một từ, logo, hoặc tổ hợp. Nhiệm vụ của nó là chỉ nguồn gốc và mang theo uy tín.</p>
<h3>Được bảo hộ vs bị loại</h3>
<ul>
<li><strong>Được bảo hộ</strong> — dấu hiệu có khả năng phân biệt: từ tự đặt, logo cách điệu, tổ hợp màu đặc trưng.</li>
<li><strong>Bị loại</strong> — dấu hiệu chung chung, mô tả thuần tuý, gây nhầm lẫn lừa dối, hoặc trùng/tương tự gây nhầm với nhãn hiệu có trước; quốc kỳ, quốc huy.</li>
</ul>
<h3>Thời hạn &amp; nhãn hiệu nổi tiếng</h3>
<pre><code>Thời hạn nhãn hiệu (Việt Nam):
   10 năm từ ngày nộp đơn, GIA HẠN vô hạn (mỗi lần 10 năm)
   -> thương hiệu có thể tồn tại mãi nếu còn dùng và gia hạn

Nhãn hiệu nổi tiếng:
   được bảo hộ kể cả khi chưa đăng ký, vượt nhóm sản phẩm</code></pre>
<h3>Chỉ dẫn địa lý</h3>
<p>Một <strong>chỉ dẫn địa lý</strong> gắn hàng hoá có chất lượng hoặc danh tiếng đến từ một địa danh — ví dụ nước mắm "Phú Quốc". Chỉ dẫn địa lý thuộc về Nhà nước và được các nhà sản xuất đủ điều kiện dùng chung.</p>
<div class="callout"><span class="badge">Mẹo cho nhà thiết kế</span> Trước khi chốt tên thương hiệu hoặc logo, hãy tra cứu đăng bạ nhãn hiệu (WIPO Global Brand Database, Cục SHTT) để tránh trùng với nhãn hiệu đã có.</div>`,
  ]]);

const c4q = quiz('ipr102-quiz-4', 'Quiz 4 — Trademarks|||Quiz 4 — Nhãn hiệu', [
  { id: 'q1', question: 'Chức năng chính của nhãn hiệu là gì?', options: ['Mô tả công dụng sản phẩm', 'Phân biệt hàng hoá/dịch vụ của doanh nghiệp này với doanh nghiệp khác', 'Bảo hộ ý tưởng kỹ thuật', 'Ghi lại tác giả'], correctIndex: 1, explanation: 'Nhãn hiệu là dấu hiệu phân biệt nguồn gốc thương mại của hàng hoá, dịch vụ.' },
  { id: 'q2', question: 'Thời hạn bảo hộ nhãn hiệu ở Việt Nam?', options: ['20 năm, không gia hạn', '10 năm, gia hạn được vô hạn mỗi lần 10 năm', 'Suốt đời tác giả', 'Vĩnh viễn ngay khi nộp đơn'], correctIndex: 1, explanation: 'Nhãn hiệu bảo hộ 10 năm và có thể gia hạn nhiều lần, nên có thể tồn tại mãi nếu còn dùng.' },
  { id: 'q3', question: '"Nước mắm Phú Quốc" là ví dụ của đối tượng nào?', options: ['Sáng chế', 'Nhãn hiệu cá nhân', 'Chỉ dẫn địa lý', 'Kiểu dáng công nghiệp'], correctIndex: 2, explanation: 'Chỉ dẫn địa lý gắn danh tiếng/chất lượng sản phẩm với một địa danh cụ thể.' },
]);

const c5 = doc('ipr102-5-1-industrial-designs', '5.1 — Industrial designs & layout designs|||5.1 — Kiểu dáng công nghiệp & thiết kế bố trí',
  'Kiểu dáng công nghiệp bảo hộ hình dáng bên ngoài (mới, sáng tạo, áp dụng công nghiệp); thời hạn; khác quyền tác giả; thiết kế bố trí mạch tích hợp.',
  [[
    `<span class="eyebrow">IPR102 · Chapter 5 · Lesson 5.1</span>
<h2>Industrial designs &amp; layout designs</h2>
<h3>Industrial design</h3>
<p>An <strong>industrial design</strong> protects the <em>external appearance</em> of a product — its shape, lines, colours, patterns — not how it works. Think of a bottle silhouette, a phone body, a chair form. This is the right closest to a product designer's daily work.</p>
<h3>Conditions &amp; term</h3>
<pre><code>Conditions: novelty + creativity + industrial applicability
Term: 5 years from filing, renewable twice
      -> maximum 15 years total

Design (appearance) vs copyright (artwork):
  same object can carry BOTH — the aesthetic drawing is copyright,
  the registered product shape is an industrial design</code></pre>
<h3>Layout designs of integrated circuits</h3>
<p>A <strong>layout design (topography)</strong> protects the three-dimensional arrangement of elements in a semiconductor integrated circuit — a specialised right for chip design.</p>
<div class="callout"><span class="badge">Designer note</span> A striking product look is often best covered by an industrial design; the packaging graphics by copyright; the brand name by a trademark. One product, several IP rights.</div>`,
    `<span class="eyebrow">IPR102 · Chương 5 · Bài 5.1</span>
<h2>Kiểu dáng công nghiệp &amp; thiết kế bố trí</h2>
<h3>Kiểu dáng công nghiệp</h3>
<p>Một <strong>kiểu dáng công nghiệp</strong> bảo hộ <em>hình dáng bên ngoài</em> của sản phẩm — hình khối, đường nét, màu sắc, hoạ tiết — không bảo hộ cách hoạt động. Hãy nghĩ đến dáng một chai nước, thân một chiếc điện thoại, kiểu một chiếc ghế. Đây là quyền gần nhất với công việc hằng ngày của nhà thiết kế sản phẩm.</p>
<h3>Điều kiện &amp; thời hạn</h3>
<pre><code>Điều kiện: tính mới + tính sáng tạo + khả năng áp dụng công nghiệp
Thời hạn: 5 năm từ ngày nộp đơn, gia hạn 2 lần
          -> tối đa 15 năm

Kiểu dáng (hình dáng) vs quyền tác giả (tác phẩm mỹ thuật):
  cùng một vật có thể mang CẢ HAI — bản vẽ thẩm mỹ là quyền tác giả,
  hình dáng sản phẩm đã đăng ký là kiểu dáng công nghiệp</code></pre>
<h3>Thiết kế bố trí mạch tích hợp</h3>
<p>Một <strong>thiết kế bố trí (topography)</strong> bảo hộ cách sắp xếp không gian ba chiều của các phần tử trong mạch tích hợp bán dẫn — một quyền chuyên biệt cho thiết kế chip.</p>
<div class="callout"><span class="badge">Ghi chú cho nhà thiết kế</span> Dáng sản phẩm nổi bật thường được bảo hộ tốt nhất bằng kiểu dáng công nghiệp; đồ hoạ bao bì bằng quyền tác giả; tên thương hiệu bằng nhãn hiệu. Một sản phẩm, nhiều quyền SHTT.</div>`,
  ]]);

const c5q = quiz('ipr102-quiz-5', 'Quiz 5 — Industrial designs|||Quiz 5 — Kiểu dáng công nghiệp', [
  { id: 'q1', question: 'Kiểu dáng công nghiệp bảo hộ điều gì?', options: ['Cách sản phẩm hoạt động', 'Hình dáng bên ngoài của sản phẩm', 'Tên thương hiệu', 'Mã nguồn phần mềm'], correctIndex: 1, explanation: 'Kiểu dáng công nghiệp bảo hộ hình dáng, đường nét, màu sắc, hoạ tiết bên ngoài — không bảo hộ chức năng.' },
  { id: 'q2', question: 'Thời hạn tối đa của kiểu dáng công nghiệp ở Việt Nam?', options: ['10 năm', '15 năm (5 năm + gia hạn 2 lần)', '20 năm', 'Vô hạn'], correctIndex: 1, explanation: 'Kiểu dáng bảo hộ 5 năm, gia hạn được 2 lần, tối đa 15 năm.' },
  { id: 'q3', question: 'Thiết kế bố trí (topography) bảo hộ đối tượng nào?', options: ['Bố cục trang web', 'Cách sắp xếp không gian các phần tử trong mạch tích hợp bán dẫn', 'Bản đồ địa lý', 'Sơ đồ tổ chức'], correctIndex: 1, explanation: 'Thiết kế bố trí bảo hộ cấu trúc không gian ba chiều của mạch tích hợp bán dẫn.' },
]);

const c6 = doc('ipr102-6-1-registration', '6.1 — Registration & establishing rights|||6.1 — Đăng ký, xác lập & bảo hộ quyền',
  'Quyền nào tự động vs phải đăng ký; quy trình nộp đơn tại Cục SHTT VN (nộp → hình thức → công bố → nội dung → cấp bằng); ngày ưu tiên (Paris); vai trò đăng ký quyền tác giả.',
  [[
    `<span class="eyebrow">IPR102 · Chapter 6 · Lesson 6.1</span>
<h2>Registration &amp; establishing rights</h2>
<h3>Automatic vs registered</h3>
<ul>
<li><strong>Automatic</strong> — copyright &amp; related rights arise on creation. Registration is optional (evidence only).</li>
<li><strong>By registration</strong> — patents, trademarks, industrial designs are established only when granted by the IP office.</li>
</ul>
<h3>Filing at the IP Office of Vietnam</h3>
<pre><code>Industrial property registration flow (Cục SHTT VN):
  1. File application (đơn) + fees
  2. Formality examination (thẩm định hình thức) ~1 month
  3. Publication (công bố đơn)
  4. Substantive examination (thẩm định nội dung)
  5. Decision -> grant a protection title (văn bằng bảo hộ)
                 or refusal
Priority date (Paris Convention): a first filing abroad gives you
  up to 6 months (designs/marks) / 12 months (patents) priority</code></pre>
<h3>Copyright registration</h3>
<p>Filed with the <strong>Copyright Office of Vietnam</strong>. Not required for protection, but a certificate shifts the burden of proof — very handy in a dispute.</p>
<div class="callout"><span class="badge">Practical order</span> For a new brand: search first → file the trademark early (first-to-file) → keep dated evidence of your original artwork for copyright.</div>`,
    `<span class="eyebrow">IPR102 · Chương 6 · Bài 6.1</span>
<h2>Đăng ký, xác lập &amp; bảo hộ quyền</h2>
<h3>Tự động vs phải đăng ký</h3>
<ul>
<li><strong>Tự động</strong> — quyền tác giả &amp; quyền liên quan phát sinh khi sáng tạo. Đăng ký là tuỳ chọn (chỉ để làm chứng cứ).</li>
<li><strong>Qua đăng ký</strong> — sáng chế, nhãn hiệu, kiểu dáng chỉ được xác lập khi cơ quan SHTT cấp bằng.</li>
</ul>
<h3>Nộp đơn tại Cục SHTT Việt Nam</h3>
<pre><code>Quy trình đăng ký sở hữu công nghiệp (Cục SHTT VN):
  1. Nộp đơn + phí
  2. Thẩm định hình thức ~1 tháng
  3. Công bố đơn
  4. Thẩm định nội dung
  5. Quyết định -> cấp văn bằng bảo hộ
                   hoặc từ chối
Ngày ưu tiên (Công ước Paris): đơn nộp đầu tiên ở nước ngoài cho bạn
  quyền ưu tiên tới 6 tháng (kiểu dáng/nhãn hiệu) / 12 tháng (sáng chế)</code></pre>
<h3>Đăng ký quyền tác giả</h3>
<p>Nộp tại <strong>Cục Bản quyền tác giả Việt Nam</strong>. Không bắt buộc để được bảo hộ, nhưng giấy chứng nhận đảo nghĩa vụ chứng minh — rất hữu ích khi tranh chấp.</p>
<div class="callout"><span class="badge">Thứ tự thực tế</span> Với thương hiệu mới: tra cứu trước → nộp đơn nhãn hiệu sớm (nộp trước được) → giữ chứng cứ có ngày tháng cho tác phẩm gốc để bảo vệ quyền tác giả.</div>`,
  ]]);

const c6q = quiz('ipr102-quiz-6', 'Quiz 6 — Registration|||Quiz 6 — Đăng ký quyền', [
  { id: 'q1', question: 'Quyền nào KHÔNG bắt buộc đăng ký vẫn được bảo hộ?', options: ['Sáng chế', 'Nhãn hiệu', 'Quyền tác giả', 'Kiểu dáng công nghiệp'], correctIndex: 2, explanation: 'Quyền tác giả tự động phát sinh khi sáng tạo; sáng chế/nhãn hiệu/kiểu dáng phải đăng ký mới được xác lập.' },
  { id: 'q2', question: 'Bước nào đứng SAU "thẩm định hình thức" trong quy trình đăng ký sở hữu công nghiệp?', options: ['Nộp đơn', 'Công bố đơn rồi thẩm định nội dung', 'Cấp bằng ngay', 'Nộp phí'], correctIndex: 1, explanation: 'Trình tự: nộp đơn → thẩm định hình thức → công bố đơn → thẩm định nội dung → cấp/từ chối.' },
  { id: 'q3', question: '"Ngày ưu tiên" theo Công ước Paris có tác dụng gì?', options: ['Kéo dài thời hạn bảo hộ vĩnh viễn', 'Cho phép giữ ngày nộp đầu tiên khi nộp ở nước khác trong thời hạn quy định', 'Miễn toàn bộ phí', 'Bỏ qua thẩm định nội dung'], correctIndex: 1, explanation: 'Ngày ưu tiên giúp giữ ngày nộp đơn đầu tiên (6 hoặc 12 tháng) khi nộp tiếp ở quốc gia thành viên khác.' },
]);

const c7 = doc('ipr102-7-1-enforcement', '7.1 — Infringement, enforcement & disputes|||7.1 — Xâm phạm, thực thi & giải quyết tranh chấp',
  'Thế nào là xâm phạm; các biện pháp thực thi (dân sự, hành chính, hình sự, kiểm soát biên giới); chế tài & bồi thường; ngoại lệ (sử dụng hợp lý, hết quyền).',
  [[
    `<span class="eyebrow">IPR102 · Chapter 7 · Lesson 7.1</span>
<h2>Infringement, enforcement &amp; disputes</h2>
<h3>What counts as infringement</h3>
<p>Using a protected right without permission and without a legal exception — copying a work, using a confusingly similar mark, making a patented product. The rights holder must usually prove they own a valid right and that the defendant's act falls within it.</p>
<h3>Enforcement channels in Vietnam</h3>
<pre><code>Four routes (can combine):
  Civil   -> sue in court: injunction + damages
  Administrative -> report to inspectorate/market authority: fines, seizure
  Criminal -> for serious counterfeiting: prosecution
  Border control -> Customs stops infringing imports/exports</code></pre>
<h3>Remedies &amp; limits</h3>
<ul>
<li><strong>Remedies</strong> — stop the act, destroy goods, compensate, public apology/correction.</li>
<li><strong>Exceptions</strong> — fair use (personal study, quotation, news), and <em>exhaustion</em>: once a genuine copy is sold, the holder cannot control its resale.</li>
</ul>
<div class="callout"><span class="badge">Evidence first</span> Enforcement lives or dies on evidence: registration certificates, dated files, notarised captures of the infringing use.</div>`,
    `<span class="eyebrow">IPR102 · Chương 7 · Bài 7.1</span>
<h2>Xâm phạm, thực thi &amp; giải quyết tranh chấp</h2>
<h3>Thế nào là xâm phạm</h3>
<p>Sử dụng một quyền được bảo hộ mà không được phép và không thuộc ngoại lệ luật định — sao chép tác phẩm, dùng nhãn hiệu gây nhầm lẫn, sản xuất sản phẩm đã được cấp bằng sáng chế. Chủ thể quyền thường phải chứng minh mình có quyền hợp lệ và hành vi của bị đơn nằm trong phạm vi quyền đó.</p>
<h3>Kênh thực thi ở Việt Nam</h3>
<pre><code>Bốn con đường (có thể kết hợp):
  Dân sự    -> kiện ra toà: buộc chấm dứt + bồi thường
  Hành chính -> báo thanh tra/quản lý thị trường: phạt tiền, tịch thu
  Hình sự    -> với hàng giả nghiêm trọng: truy cứu trách nhiệm hình sự
  Kiểm soát biên giới -> Hải quan chặn hàng xâm phạm xuất/nhập khẩu</code></pre>
<h3>Chế tài &amp; giới hạn</h3>
<ul>
<li><strong>Chế tài</strong> — buộc chấm dứt hành vi, tiêu huỷ hàng hoá, bồi thường, xin lỗi/cải chính công khai.</li>
<li><strong>Ngoại lệ</strong> — sử dụng hợp lý (học tập cá nhân, trích dẫn, đưa tin), và <em>hết quyền</em>: khi một bản gốc đã được bán, chủ quyền không kiểm soát việc bán lại.</li>
</ul>
<div class="callout"><span class="badge">Chứng cứ trước hết</span> Thực thi sống chết nhờ chứng cứ: giấy chứng nhận đăng ký, hồ sơ có ngày tháng, bản ghi hành vi xâm phạm có công chứng.</div>`,
  ]]);

const c7q = quiz('ipr102-quiz-7', 'Quiz 7 — Enforcement|||Quiz 7 — Thực thi', [
  { id: 'q1', question: 'Đâu KHÔNG phải là một kênh thực thi quyền SHTT ở Việt Nam?', options: ['Biện pháp dân sự (kiện ra toà)', 'Biện pháp hành chính', 'Kiểm soát biên giới (Hải quan)', 'Tự ý tịch thu tài sản của người khác'], correctIndex: 3, explanation: 'Bốn kênh hợp pháp: dân sự, hành chính, hình sự, kiểm soát biên giới. Tự ý tịch thu là trái luật.' },
  { id: 'q2', question: 'Nguyên tắc "hết quyền" (exhaustion) nghĩa là gì?', options: ['Quyền hết hạn sau 1 năm', 'Khi bản gốc đã được bán hợp pháp, chủ quyền không kiểm soát việc bán lại', 'Chủ quyền mất mọi quyền', 'Không ai được bán lại sản phẩm'], correctIndex: 1, explanation: 'Sau lần bán hợp pháp đầu tiên, chủ thể quyền không còn kiểm soát việc phân phối lại chính bản đó.' },
  { id: 'q3', question: 'Yếu tố quyết định thành bại khi thực thi quyền SHTT là?', options: ['May mắn', 'Chứng cứ (đăng ký, hồ sơ có ngày, ghi nhận công chứng)', 'Số lượng nhân viên', 'Danh tiếng cá nhân'], correctIndex: 1, explanation: 'Thực thi phụ thuộc vào chứng cứ chứng minh quyền hợp lệ và hành vi xâm phạm.' },
]);

const c8 = doc('ipr102-8-1-digital-ip', '8.1 — IP in the digital world & licensing|||8.1 — SHTT thời số & cấp phép',
  'SHTT trong thiết kế mỹ thuật số (ảnh stock, font, tác phẩm phái sinh); giấy phép Creative Commons; AI & bản quyền; hệ thống quốc tế (Berne, Paris, TRIPS, WIPO).',
  [[
    `<span class="eyebrow">IPR102 · Chapter 8 · Lesson 8.1</span>
<h2>IP in the digital world &amp; licensing</h2>
<h3>Digital design realities</h3>
<p>Online, copying is one click away — so knowing licences matters. Stock photos, fonts, icons and code each come with terms. "Free to download" is not "free to use commercially". Read the licence.</p>
<h3>Creative Commons — a licence toolkit</h3>
<pre><code>CC building blocks (mix into a licence):
  BY  Attribution      -> credit the author
  SA  ShareAlike       -> derivatives under the same licence
  NC  NonCommercial    -> no commercial use
  ND  NoDerivatives    -> no modified versions

Examples:
  CC BY        -> reuse freely, just credit
  CC BY-NC-ND  -> credit, non-commercial, no edits
  CC0          -> author waives rights (public-domain-like)</code></pre>
<h3>AI &amp; new questions</h3>
<p>Who owns AI-generated art? Can models train on copyrighted images? These are unsettled and vary by country — a live frontier for digital designers.</p>
<h3>The international system</h3>
<p><strong>Berne</strong> (copyright), <strong>Paris</strong> (industrial property), <strong>TRIPS</strong> (WTO minimum standards) and <strong>WIPO</strong> treaties knit national systems together, so protection can reach across borders.</p>
<div class="callout"><span class="badge">Rule of thumb</span> If you did not create it and have no licence, assume it is protected. When in doubt, get permission or pick a clearly-licensed (e.g. CC) asset.</div>`,
    `<span class="eyebrow">IPR102 · Chương 8 · Bài 8.1</span>
<h2>SHTT thời số &amp; cấp phép</h2>
<h3>Thực tế thiết kế số</h3>
<p>Trên mạng, sao chép chỉ cách một cú nhấp — nên hiểu giấy phép rất quan trọng. Ảnh stock, font, icon và mã đều kèm điều khoản. "Tải miễn phí" không có nghĩa là "dùng thương mại miễn phí". Hãy đọc giấy phép.</p>
<h3>Creative Commons — bộ công cụ cấp phép</h3>
<pre><code>Các khối CC (ghép thành giấy phép):
  BY  Ghi công        -> ghi tên tác giả
  SA  Chia sẻ tương tự -> tác phẩm phái sinh cùng giấy phép
  NC  Phi thương mại   -> không dùng thương mại
  ND  Không phái sinh  -> không được sửa đổi

Ví dụ:
  CC BY        -> dùng tự do, chỉ cần ghi công
  CC BY-NC-ND  -> ghi công, phi thương mại, không sửa
  CC0          -> tác giả từ bỏ quyền (gần như phạm vi công cộng)</code></pre>
<h3>AI &amp; câu hỏi mới</h3>
<p>Ai sở hữu tranh do AI sinh ra? Mô hình có được huấn luyện trên ảnh có bản quyền không? Đây là những vấn đề chưa ngã ngũ và khác nhau theo từng nước — một biên giới nóng cho nhà thiết kế số.</p>
<h3>Hệ thống quốc tế</h3>
<p><strong>Berne</strong> (quyền tác giả), <strong>Paris</strong> (sở hữu công nghiệp), <strong>TRIPS</strong> (chuẩn tối thiểu của WTO) và các điều ước <strong>WIPO</strong> nối các hệ thống quốc gia lại, để bảo hộ vươn qua biên giới.</p>
<div class="callout"><span class="badge">Nguyên tắc vàng</span> Nếu bạn không tạo ra nó và không có giấy phép, hãy mặc định là nó được bảo hộ. Khi phân vân, xin phép hoặc chọn tài nguyên có giấy phép rõ ràng (ví dụ CC).</div>`,
  ]]);

const c8q = quiz('ipr102-quiz-8', 'Quiz 8 — Digital IP|||Quiz 8 — SHTT thời số', [
  { id: 'q1', question: 'Trong giấy phép Creative Commons, ký hiệu "NC" nghĩa là gì?', options: ['Không ghi công', 'Không sửa đổi', 'Phi thương mại (NonCommercial)', 'Không giới hạn'], correctIndex: 2, explanation: 'NC = NonCommercial: không được dùng cho mục đích thương mại.' },
  { id: 'q2', question: 'Một tài nguyên "tải miễn phí" trên mạng thì?', options: ['Luôn được dùng thương mại thoải mái', 'Vẫn phải xem giấy phép để biết được dùng thế nào', 'Thuộc phạm vi công cộng', 'Không cần ghi công bao giờ'], correctIndex: 1, explanation: '"Tải miễn phí" không đồng nghĩa "dùng thương mại tự do"; phải đọc giấy phép đi kèm.' },
  { id: 'q3', question: 'Hiệp định/công ước nào đặt chuẩn bảo hộ SHTT tối thiểu cho các thành viên WTO?', options: ['Công ước Berne', 'Công ước Paris', 'Hiệp định TRIPS', 'Công ước Viên'], correctIndex: 2, explanation: 'TRIPS (thuộc WTO) đặt các tiêu chuẩn bảo hộ SHTT tối thiểu mà các nước thành viên phải đáp ứng.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'IPR102',
    slug: 'ipr102-intellectual-property-rights',
    title: 'Intellectual Property Rights',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IPR102.webp',
    shortDescription: 'Intellectual property for digital artists — copyright & related rights, patents, trademarks & GIs, industrial designs, registration at the IP Office of Vietnam, enforcement & IP in the digital world (Creative Commons). Bilingual, with quizzes.|||Sở hữu trí tuệ cho nhà thiết kế số — quyền tác giả & liên quan, sáng chế, nhãn hiệu & chỉ dẫn địa lý, kiểu dáng, đăng ký tại Cục SHTT VN, thực thi & SHTT thời số (Creative Commons). Song ngữ, có quiz.',
    description: 'Môn <strong>IPR102 — Intellectual Property Rights</strong> (Quyền sở hữu trí tuệ, kỳ 8) trang bị cho nhà thiết kế mỹ thuật số hiểu biết pháp lý để <strong>bảo vệ tác phẩm của mình và tránh xâm phạm người khác</strong>. Từ <strong>nền tảng SHTT</strong> → <strong>quyền tác giả &amp; quyền liên quan</strong> → <strong>sáng chế</strong> → <strong>nhãn hiệu &amp; chỉ dẫn địa lý</strong> → <strong>kiểu dáng công nghiệp</strong> → <strong>đăng ký tại Cục SHTT Việt Nam</strong> → <strong>xâm phạm &amp; thực thi</strong> → <strong>SHTT thời số (Creative Commons) &amp; hệ thống quốc tế</strong>. Bám Luật SHTT VN 2005 (sửa đổi 2009/2019/2022), tài liệu WIPO và các công ước Berne, Paris, TRIPS. Song ngữ, quiz mỗi chương.',
    whatYouLearn: 'Bản chất SHTT &amp; hai họ quyền; điều kiện &amp; thời hạn quyền tác giả và quyền liên quan; ba điều kiện sáng chế, giải pháp hữu ích &amp; first-to-file; nhãn hiệu, nhãn hiệu nổi tiếng &amp; chỉ dẫn địa lý; kiểu dáng công nghiệp &amp; thiết kế bố trí; quy trình đăng ký tại Cục SHTT VN &amp; ngày ưu tiên (Paris); bốn kênh thực thi &amp; ngoại lệ (fair use, hết quyền); giấy phép Creative Commons &amp; hệ thống quốc tế (Berne, TRIPS, WIPO).',
    requirements: 'Không cần kiến thức pháp lý trước. Phù hợp sinh viên ngành Thiết kế mỹ thuật số và bất kỳ ai làm việc với tác phẩm sáng tạo. Nên tham khảo Luật SHTT VN trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, Luật SHTT VN, WIPO, công ước quốc tế, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'SHTT là gì, vì sao tồn tại, hai họ quyền, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Nền tảng SHTT|||Chapter 1 — IP fundamentals', description: 'Tài sản vô hình, ba mục tiêu, ba nhóm đối tượng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quyền tác giả|||Chapter 2 — Copyright', description: 'Điều kiện, quyền nhân thân/tài sản, quyền liên quan, thời hạn.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Sáng chế|||Chapter 3 — Patents', description: 'Ba điều kiện, giải pháp hữu ích, first-to-file.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Nhãn hiệu & chỉ dẫn địa lý|||Chapter 4 — Trademarks & GIs', description: 'Dấu hiệu phân biệt, thời hạn, nhãn hiệu nổi tiếng, GI.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Kiểu dáng công nghiệp|||Chapter 5 — Industrial designs', description: 'Hình dáng bên ngoài, thời hạn, thiết kế bố trí.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đăng ký quyền|||Chapter 6 — Registration', description: 'Tự động vs đăng ký, quy trình Cục SHTT VN, ngày ưu tiên.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Xâm phạm & thực thi|||Chapter 7 — Enforcement', description: 'Bốn kênh thực thi, chế tài, ngoại lệ.', lessons: [c7, c7q] },
    { title: 'Chương 8 — SHTT thời số|||Chapter 8 — Digital IP', description: 'Thiết kế số, Creative Commons, AI, hệ thống quốc tế.', lessons: [c8, c8q] },
  ],
};
