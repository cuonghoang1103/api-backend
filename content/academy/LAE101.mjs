/**
 * LAE101 — Law and Ethics in Media and Communication (Luật và Đạo đức trong
 * Truyền thông và Báo chí). Khối Công nghệ Truyền thông FPTU, Kỳ 3 — môn NHẬP
 * MÔN rộng, phủ cả LUẬT lẫn ĐẠO ĐỨC truyền thông/báo chí.
 * Nguồn chuẩn: Pember & Calvert "Mass Media Law"; Overbeck "Major Principles of
 * Media Law"; SPJ Code of Ethics; + Luật Báo chí VN 2016, Luật An ninh mạng,
 * Luật Sở hữu trí tuệ VN, Nghị định 13/2023. Song ngữ + điều luật + vụ việc thật.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('lae101-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế, văn bản luật VN chính thức, đạo đức nghề, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">LAE101 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study <strong>Law &amp; Ethics in Media and Communication</strong> in one place — the international standard textbooks, the actual Vietnamese statutes, and the professional codes of ethics. Official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal sources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for LAE101 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Standard textbooks</h3>
<ul>
<li>Pember &amp; Calvert — <em>Mass Media Law</em> (McGraw-Hill), the classic US media-law text.</li>
<li>Wayne Overbeck &amp; Genelle Belmas — <em>Major Principles of Media Law</em>.</li>
</ul>
<h3>⚖️ Vietnamese law (official text)</h3>
<ul>
<li><a href="https://vanban.chinhphu.vn" target="_blank" rel="noopener">Cổng thông tin văn bản QPPL Chính phủ</a> — Luật Báo chí 2016, Luật An ninh mạng 2018, Luật Sở hữu trí tuệ, Nghị định 13/2023.</li>
<li><a href="https://mic.gov.vn" target="_blank" rel="noopener">Bộ Thông tin &amp; Truyền thông</a> — quy định quản lý báo chí, truyền thông.</li>
</ul>
<h3>🧭 Codes of ethics</h3>
<ul>
<li><a href="https://www.spj.org/ethicscode.asp" target="_blank" rel="noopener">SPJ Code of Ethics</a> — Society of Professional Journalists.</li>
<li><a href="https://www.prsa.org/about/ethics" target="_blank" rel="noopener">PRSA Code of Ethics</a> — Public Relations Society of America.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — tell law apart from ethics; know free speech and its limits.</li>
<li><strong>The VN framework</strong> — Press Law 2016, defamation, privacy, copyright.</li>
<li><strong>Professional ethics</strong> — the SPJ four principles applied to real dilemmas.</li>
<li><strong>Job-ready</strong> — audit your own content for legal risk before you publish.</li>
</ol></div>`,
    `<span class="eyebrow">LAE101 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Luật &amp; Đạo đức trong Truyền thông và Báo chí</strong> gom về một chỗ — sách chuẩn quốc tế, văn bản luật Việt Nam gốc, và các bộ quy tắc đạo đức nghề. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của LAE101 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách chuẩn quốc tế</h3>
<ul>
<li>Pember &amp; Calvert — <em>Mass Media Law</em> (McGraw-Hill), sách luật truyền thông kinh điển của Mỹ.</li>
<li>Wayne Overbeck &amp; Genelle Belmas — <em>Major Principles of Media Law</em>.</li>
</ul>
<h3>⚖️ Luật Việt Nam (văn bản gốc)</h3>
<ul>
<li><a href="https://vanban.chinhphu.vn" target="_blank" rel="noopener">Cổng thông tin văn bản QPPL Chính phủ</a> — Luật Báo chí 2016, Luật An ninh mạng 2018, Luật Sở hữu trí tuệ, Nghị định 13/2023.</li>
<li><a href="https://mic.gov.vn" target="_blank" rel="noopener">Bộ Thông tin &amp; Truyền thông</a> — quy định quản lý báo chí, truyền thông.</li>
</ul>
<h3>🧭 Bộ quy tắc đạo đức</h3>
<ul>
<li><a href="https://www.spj.org/ethicscode.asp" target="_blank" rel="noopener">SPJ Code of Ethics</a> — Hiệp hội Nhà báo Chuyên nghiệp (Mỹ).</li>
<li><a href="https://www.prsa.org/about/ethics" target="_blank" rel="noopener">PRSA Code of Ethics</a> — Hiệp hội Quan hệ Công chúng Hoa Kỳ.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — phân biệt luật với đạo đức; hiểu tự do ngôn luận và giới hạn.</li>
<li><strong>Khung pháp lý VN</strong> — Luật Báo chí 2016, phỉ báng, quyền riêng tư, bản quyền.</li>
<li><strong>Đạo đức nghề</strong> — bốn nguyên tắc SPJ áp vào tình huống thật.</li>
<li><strong>Sẵn sàng đi làm</strong> — tự rà rủi ro pháp lý cho nội dung trước khi đăng.</li>
</ol></div>`,
  ]]);

const intro = doc('lae101-0-1-overview', 'Course overview: Law &amp; ethics in media|||Tổng quan: Luật &amp; đạo đức truyền thông',
  'Môn học làm gì; vì sao người làm truyền thông cần biết luật lẫn đạo đức; lộ trình 8 chương từ khái niệm → khung VN → phỉ báng, riêng tư, bản quyền → đạo đức nghề → nội dung nhạy cảm → đạo đức số & AI.',
  [[
    `<span class="eyebrow">LAE101 · Lesson 0.1 · Overview</span>
<h2>Law &amp; Ethics in Media and Communication</h2>
<p class="lead">Anyone who publishes — a journalist, a marketer, a content creator, a PR officer — operates inside two systems at once: <strong>the law</strong> (what the state can force you to do or not do) and <strong>ethics</strong> (what a responsible professional chooses to do even when no law compels it). This course teaches both.</p>
<h3>Why it matters</h3>
<p>A single post can trigger a defamation claim, a copyright strike, a privacy complaint, or an administrative fine. Knowing the rules <em>before</em> you press publish is cheaper than any lawyer afterwards — and being trusted is the whole value of a media professional.</p>
<h3>Roadmap — 8 chapters</h3>
<ol>
<li>Law vs ethics; free speech &amp; its limits.</li>
<li>Vietnam's press &amp; media legal framework (Press Law 2016).</li>
<li>Defamation &amp; protecting reputation.</li>
<li>Privacy &amp; the right to one's own image (Decree 13/2023 on personal data).</li>
<li>Intellectual property in media (copyright, fair quotation).</li>
<li>Professional ethics (SPJ / PRSA codes).</li>
<li>Sensitive content &amp; responsibility (fake news, hate speech, ads, children, cybersecurity).</li>
<li>Digital &amp; AI ethics (deepfakes, data, social media, AI in journalism).</li>
</ol>
<div class="callout"><span class="badge">One rule of thumb</span> If you cannot name <em>who could be harmed</em> and <em>which right or law is in play</em>, you are not ready to publish yet.</div>`,
    `<span class="eyebrow">LAE101 · Bài 0.1 · Tổng quan</span>
<h2>Luật &amp; Đạo đức trong Truyền thông và Báo chí</h2>
<p class="lead">Bất kỳ ai xuất bản nội dung — nhà báo, người làm marketing, nhà sáng tạo, cán bộ PR — đều hoạt động trong hai hệ thống cùng lúc: <strong>luật pháp</strong> (điều nhà nước buộc bạn làm hay không được làm) và <strong>đạo đức</strong> (điều một người làm nghề có trách nhiệm tự chọn làm dù không luật nào ép). Môn này dạy cả hai.</p>
<h3>Vì sao quan trọng</h3>
<p>Một bài đăng có thể kéo theo đơn kiện phỉ báng, khiếu nại bản quyền, khiếu nại xâm phạm riêng tư, hay một quyết định xử phạt hành chính. Biết luật <em>trước</em> khi bấm đăng rẻ hơn mọi luật sư về sau — và sự tín nhiệm chính là toàn bộ giá trị của người làm truyền thông.</p>
<h3>Lộ trình — 8 chương</h3>
<ol>
<li>Luật vs đạo đức; tự do ngôn luận &amp; giới hạn.</li>
<li>Khung pháp lý báo chí &amp; truyền thông VN (Luật Báo chí 2016).</li>
<li>Phỉ báng &amp; bảo vệ danh dự.</li>
<li>Quyền riêng tư &amp; quyền với hình ảnh của mình (Nghị định 13/2023 về dữ liệu cá nhân).</li>
<li>Sở hữu trí tuệ trong truyền thông (bản quyền, trích dẫn hợp lý).</li>
<li>Đạo đức nghề nghiệp (bộ quy tắc SPJ / PRSA).</li>
<li>Nội dung nhạy cảm &amp; trách nhiệm (tin giả, ngôn từ thù ghét, quảng cáo, trẻ em, an ninh mạng).</li>
<li>Đạo đức số &amp; AI (deepfake, dữ liệu, mạng xã hội, AI trong báo chí).</li>
</ol>
<div class="callout"><span class="badge">Một câu tự hỏi</span> Nếu bạn chưa gọi tên được <em>ai có thể bị tổn hại</em> và <em>quyền hay điều luật nào đang liên quan</em>, thì bạn chưa sẵn sàng đăng.</div>`,
  ]]);

const c1 = doc('lae101-1-1-law-vs-ethics', '1.1 — What are media law &amp; ethics?|||1.1 — Luật &amp; đạo đức truyền thông là gì',
  'Phân biệt luật (bắt buộc, có chế tài) với đạo đức (tự nguyện, tự chịu trách nhiệm); vai trò báo chí; tự do ngôn luận và giới hạn hợp pháp.',
  [[
    `<span class="eyebrow">LAE101 · Chapter 1 · Lesson 1.1</span>
<h2>What are media law &amp; ethics?</h2>
<h3>Law vs ethics — not the same thing</h3>
<ul>
<li><strong>Law</strong> is enforced by the state: break it and you face fines, damages, or prosecution. It sets the <em>floor</em> of acceptable behaviour.</li>
<li><strong>Ethics</strong> is enforced by conscience, colleagues and reputation. It is what you do when the law is silent — the <em>ceiling</em> you aim for. Something can be perfectly legal yet clearly unethical (e.g. secretly recording a grieving family), and rarely the reverse.</li>
</ul>
<h3>Free speech and its limits</h3>
<p>Free expression is a foundational right — Vietnam's Constitution 2013 (Điều 25) guarantees freedom of speech, press and information; the US First Amendment bars government from abridging it. But no system treats it as absolute. Common, lawful limits include <strong>defamation, incitement to violence, obscenity affecting minors, state security, and privacy</strong>.</p>
<pre><code>Test yourself before publishing:
  Is it TRUE?            (or clearly labelled opinion)
  Does it HARM anyone?   (reputation, privacy, safety)
  Is it in the PUBLIC interest? (not merely interesting to the public)
</code></pre>
<div class="callout"><span class="badge">Case</span> <em>Near v. Minnesota</em> (1931, US) struck down a law that shut newspapers down in advance — establishing that <strong>prior restraint</strong> (censoring before publication) is the most suspect limit of all.</div>`,
    `<span class="eyebrow">LAE101 · Chương 1 · Bài 1.1</span>
<h2>Luật &amp; đạo đức truyền thông là gì</h2>
<h3>Luật vs đạo đức — không phải một</h3>
<ul>
<li><strong>Luật</strong> do nhà nước cưỡng chế: vi phạm thì bị phạt, bồi thường hoặc truy tố. Nó đặt ra <em>mức sàn</em> của hành vi chấp nhận được.</li>
<li><strong>Đạo đức</strong> được giữ bởi lương tâm, đồng nghiệp và uy tín. Đó là điều bạn làm khi luật im lặng — <em>mức trần</em> bạn hướng tới. Một việc có thể hoàn toàn hợp pháp mà vẫn rõ ràng phi đạo đức (vd lén ghi hình một gia đình đang tang tóc), và hiếm khi ngược lại.</li>
</ul>
<h3>Tự do ngôn luận và giới hạn</h3>
<p>Tự do biểu đạt là quyền nền tảng — Hiến pháp 2013 (Điều 25) bảo đảm tự do ngôn luận, tự do báo chí, tiếp cận thông tin; Tu chính án thứ Nhất của Mỹ cấm chính quyền hạn chế nó. Nhưng không hệ thống nào coi nó là tuyệt đối. Giới hạn hợp pháp phổ biến gồm <strong>phỉ báng, kích động bạo lực, nội dung tục ảnh hưởng trẻ em, an ninh quốc gia, và quyền riêng tư</strong>.</p>
<pre><code>Tự kiểm trước khi đăng:
  Có ĐÚNG SỰ THẬT không?   (hay là quan điểm được ghi rõ)
  Có GÂY HẠI cho ai không?  (danh dự, riêng tư, an toàn)
  Có vì LỢI ÍCH CÔNG không? (chứ không chỉ khiến công chúng tò mò)
</code></pre>
<div class="callout"><span class="badge">Vụ việc</span> <em>Near kiện Minnesota</em> (1931, Mỹ) bác một đạo luật cho phép đóng cửa báo trước khi in — xác lập rằng <strong>kiểm duyệt trước (prior restraint)</strong> là giới hạn đáng ngờ nhất.</div>`,
  ]]);

const c1q = quiz('lae101-quiz-1', 'Quiz 1 — Law &amp; ethics|||Quiz 1 — Luật &amp; đạo đức', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa luật và đạo đức là?|||Core difference between law and ethics?', options: ['Không có khác biệt|||No difference', 'Luật do nhà nước cưỡng chế; đạo đức do lương tâm/uy tín giữ|||Law is state-enforced; ethics is held by conscience/reputation', 'Đạo đức mạnh hơn luật|||Ethics outranks law', 'Luật chỉ áp dụng cho nhà báo|||Law applies only to journalists'], correctIndex: 1, explanation: 'Luật đặt mức sàn có chế tài; đạo đức là mức trần tự nguyện.' },
  { id: 'q2', question: 'Điều nào bảo đảm tự do ngôn luận, báo chí trong Hiến pháp VN 2013?|||Which article of Vietnam\'s 2013 Constitution guarantees free speech and press?', options: ['Điều 25|||Article 25', 'Điều 156|||Article 156', 'Điều 32|||Article 32', 'Điều 331|||Article 331'], correctIndex: 0, explanation: 'Điều 25 Hiến pháp 2013 bảo đảm tự do ngôn luận, báo chí, tiếp cận thông tin.' },
  { id: 'q3', question: '"Prior restraint" (kiểm duyệt trước khi xuất bản) đáng chú ý vì?|||Why is prior restraint notable?', options: ['Nó luôn hợp pháp|||It is always legal', 'Nó là giới hạn tự do ngôn luận đáng ngờ nhất (vụ Near v. Minnesota)|||It is the most suspect limit on speech (Near v. Minnesota)', 'Chỉ áp dụng cho quảng cáo|||It applies only to ads', 'Không liên quan truyền thông|||Unrelated to media'], correctIndex: 1, explanation: 'Near v. Minnesota (1931) coi kiểm duyệt trước là giới hạn đáng ngờ nhất.' },
]);

const c2 = doc('lae101-2-1-vn-framework', '2.1 — Vietnam\'s press &amp; media legal framework|||2.1 — Khung pháp lý báo chí, truyền thông VN',
  'Luật Báo chí 2016: quyền tự do báo chí, quyền & nghĩa vụ của nhà báo, thẻ nhà báo, cơ quan quản lý nhà nước; trách nhiệm cơ quan báo chí.',
  [[
    `<span class="eyebrow">LAE101 · Chapter 2 · Lesson 2.1</span>
<h2>Vietnam's press &amp; media legal framework</h2>
<h3>The Press Law 2016 (Luật Báo chí 2016)</h3>
<p>The 2016 Press Law is the backbone statute. It affirms citizens' right to <strong>freedom of the press and freedom of speech in the press</strong>, and it structures the whole sector: who may operate a press outlet, what a journalist may and must do, and how the state supervises it.</p>
<h3>Rights &amp; duties of a journalist</h3>
<ul>
<li><strong>Rights</strong> (Điều 25) — to gather and report information, access documents, attend and cover events, and be protected in lawful professional activity.</li>
<li><strong>Duties</strong> — report truthfully and accurately, protect sources, correct errors, and not abuse press freedom to harm the State's or others' lawful interests.</li>
<li>A <strong>press card (thẻ nhà báo)</strong> is issued by the state authority and evidences professional standing.</li>
</ul>
<h3>Who supervises</h3>
<p>State management of the press is exercised by the Government through the responsible ministry (historically the <strong>Ministry of Information and Communications</strong>), which licenses outlets, sets standards, and handles violations.</p>
<div class="callout"><span class="badge">Key idea</span> In Vietnam a press outlet is a licensed public institution with duties, not merely a private publisher — freedom of the press comes bundled with legal responsibility.</div>`,
    `<span class="eyebrow">LAE101 · Chương 2 · Bài 2.1</span>
<h2>Khung pháp lý báo chí, truyền thông VN</h2>
<h3>Luật Báo chí 2016</h3>
<p>Luật Báo chí 2016 là đạo luật xương sống. Nó khẳng định quyền <strong>tự do báo chí, tự do ngôn luận trên báo chí</strong> của công dân, và định hình cả ngành: ai được hoạt động báo chí, nhà báo được và phải làm gì, nhà nước giám sát ra sao.</p>
<h3>Quyền &amp; nghĩa vụ của nhà báo</h3>
<ul>
<li><strong>Quyền</strong> (Điều 25) — thu thập và đưa tin, tiếp cận tài liệu, dự và đưa tin sự kiện, được bảo vệ trong hoạt động nghề nghiệp hợp pháp.</li>
<li><strong>Nghĩa vụ</strong> — thông tin trung thực, chính xác; bảo vệ nguồn tin; cải chính khi sai; không lạm dụng tự do báo chí gây hại lợi ích hợp pháp của Nhà nước và người khác.</li>
<li><strong>Thẻ nhà báo</strong> do cơ quan nhà nước cấp, chứng nhận tư cách hành nghề.</li>
</ul>
<h3>Ai quản lý</h3>
<p>Nhà nước quản lý báo chí thông qua Chính phủ và bộ quản lý chuyên ngành (trước đây là <strong>Bộ Thông tin và Truyền thông</strong>) — cấp phép, đặt chuẩn, và xử lý vi phạm.</p>
<div class="callout"><span class="badge">Điểm mấu chốt</span> Ở Việt Nam, cơ quan báo chí là thiết chế công được cấp phép và có nghĩa vụ, không chỉ là nhà xuất bản tư nhân — tự do báo chí đi kèm trách nhiệm pháp lý.</div>`,
  ]]);

const c2q = quiz('lae101-quiz-2', 'Quiz 2 — VN legal framework|||Quiz 2 — Khung pháp lý VN', [
  { id: 'q1', question: 'Đạo luật xương sống của báo chí VN hiện hành là?|||Vietnam\'s backbone press statute is?', options: ['Luật Báo chí 1989|||Press Law 1989', 'Luật Báo chí 2016|||Press Law 2016', 'Luật An ninh mạng 2018|||Cybersecurity Law 2018', 'Luật Quảng cáo 2012|||Advertising Law 2012'], correctIndex: 1, explanation: 'Luật Báo chí 2016 là đạo luật hiện hành điều chỉnh hoạt động báo chí.' },
  { id: 'q2', question: 'Đâu KHÔNG phải nghĩa vụ của nhà báo theo Luật Báo chí?|||Which is NOT a journalist\'s duty under the Press Law?', options: ['Thông tin trung thực, chính xác|||Report truthfully and accurately', 'Bảo vệ nguồn tin|||Protect sources', 'Cải chính khi đưa tin sai|||Correct errors', 'Đăng bất cứ thứ gì không giới hạn|||Publish anything without limit'], correctIndex: 3, explanation: 'Tự do báo chí đi kèm nghĩa vụ; không được lạm dụng gây hại lợi ích hợp pháp.' },
  { id: 'q3', question: 'Giấy tờ chứng nhận tư cách hành nghề do nhà nước cấp cho nhà báo là?|||State-issued document evidencing a journalist\'s standing?', options: ['Thẻ nhà báo|||Press card', 'Giấy phép lái xe|||Driving licence', 'Chứng minh thư|||ID card', 'Thẻ hội viên câu lạc bộ|||Club membership'], correctIndex: 0, explanation: 'Thẻ nhà báo do cơ quan quản lý nhà nước về báo chí cấp.' },
]);

const c3 = doc('lae101-3-1-defamation', '3.1 — Defamation &amp; protecting reputation|||3.1 — Phỉ báng &amp; bảo vệ danh dự',
  'Phỉ báng (defamation), libel vs slander, tội vu khống (Điều 156 BLHS), quyền được bảo vệ danh dự (Điều 34 BLDS), cải chính (Điều 42 Luật Báo chí); chuẩn "actual malice".',
  [[
    `<span class="eyebrow">LAE101 · Chapter 3 · Lesson 3.1</span>
<h2>Defamation &amp; protecting reputation</h2>
<h3>What defamation is</h3>
<p><strong>Defamation</strong> is a false statement of fact, communicated to others, that harms a person's reputation. Traditionally split into <strong>libel</strong> (written/published/permanent form) and <strong>slander</strong> (spoken/transient). A true statement, or a clearly-flagged opinion, is generally <em>not</em> defamation.</p>
<h3>In Vietnamese law</h3>
<ul>
<li>The right to have one's <strong>honour, dignity and reputation</strong> protected is a civil right (Điều 34, Bộ luật Dân sự 2015) — a victim can demand correction, apology and damages.</li>
<li><strong>Vu khống</strong> — fabricating and spreading falsehoods to defame — is a crime under <strong>Điều 156, Bộ luật Hình sự 2015</strong>.</li>
<li>Press law (Điều 42, Luật Báo chí 2016) requires the outlet to publish a <strong>correction (cải chính)</strong> when it reports something false.</li>
</ul>
<h3>The public-figure standard</h3>
<p>US law sets a higher bar for public officials: <em>New York Times v. Sullivan</em> (1964) requires proof of <strong>"actual malice"</strong> — the publisher knew it was false or acted with reckless disregard for the truth — protecting robust criticism of those in power.</p>
<div class="callout"><span class="badge">Defence</span> The strongest shields against a defamation claim are <strong>truth</strong>, <strong>verifiable evidence</strong>, and a <strong>prompt correction</strong> when you get it wrong.</div>`,
    `<span class="eyebrow">LAE101 · Chương 3 · Bài 3.1</span>
<h2>Phỉ báng &amp; bảo vệ danh dự</h2>
<h3>Phỉ báng là gì</h3>
<p><strong>Phỉ báng</strong> là đưa ra một thông tin SAI SỰ THẬT, truyền đạt cho người khác, làm tổn hại danh dự của một người. Thường chia thành <strong>libel</strong> (dạng viết/xuất bản/lưu lại) và <strong>slander</strong> (dạng nói/thoáng qua). Thông tin đúng sự thật, hoặc quan điểm được ghi rõ, thường <em>không</em> phải phỉ báng.</p>
<h3>Trong pháp luật Việt Nam</h3>
<ul>
<li>Quyền được bảo vệ <strong>danh dự, nhân phẩm, uy tín</strong> là quyền dân sự (Điều 34, Bộ luật Dân sự 2015) — người bị hại có thể yêu cầu cải chính, xin lỗi và bồi thường.</li>
<li><strong>Vu khống</strong> — bịa đặt, loan truyền điều sai để hạ uy tín — là tội hình sự theo <strong>Điều 156, Bộ luật Hình sự 2015</strong>.</li>
<li>Luật Báo chí (Điều 42, Luật Báo chí 2016) buộc cơ quan báo chí <strong>cải chính</strong> khi đưa thông tin sai.</li>
</ul>
<h3>Chuẩn với người của công chúng</h3>
<p>Luật Mỹ đặt ngưỡng cao hơn với quan chức: <em>New York Times kiện Sullivan</em> (1964) đòi chứng minh <strong>"actual malice"</strong> — người đăng biết là sai hoặc bất chấp sự thật một cách liều lĩnh — nhằm bảo vệ quyền phê phán mạnh mẽ người nắm quyền.</p>
<div class="callout"><span class="badge">Cách phòng vệ</span> Lá chắn mạnh nhất trước đơn kiện phỉ báng là <strong>sự thật</strong>, <strong>bằng chứng kiểm chứng được</strong>, và <strong>cải chính kịp thời</strong> khi bạn sai.</div>`,
  ]]);

const c3q = quiz('lae101-quiz-3', 'Quiz 3 — Defamation|||Quiz 3 — Phỉ báng', [
  { id: 'q1', question: 'Phỉ báng dạng VIẾT/xuất bản gọi là?|||Written/published defamation is called?', options: ['Slander', 'Libel', 'Fair use', 'Cải chính|||Correction'], correctIndex: 1, explanation: 'Libel = phỉ báng dạng viết/lưu lại; slander = dạng nói.' },
  { id: 'q2', question: 'Tội vu khống trong Bộ luật Hình sự VN 2015 nằm ở?|||Article for the crime of slander/defamation (vu khống) in VN Penal Code 2015?', options: ['Điều 156|||Article 156', 'Điều 25|||Article 25', 'Điều 32|||Article 32', 'Điều 42|||Article 42'], correctIndex: 0, explanation: 'Điều 156 BLHS 2015 quy định tội vu khống.' },
  { id: 'q3', question: 'Chuẩn "actual malice" (vụ NYT v. Sullivan) yêu cầu chứng minh điều gì với quan chức?|||"Actual malice" (NYT v. Sullivan) requires proving what against officials?', options: ['Chỉ cần thông tin sai|||Merely that a statement was false', 'Người đăng biết sai hoặc bất chấp sự thật liều lĩnh|||Publisher knew it was false or was recklessly indifferent to truth', 'Bài viết dài|||The article was long', 'Có ảnh kèm theo|||It had a photo'], correctIndex: 1, explanation: 'Actual malice bảo vệ phê phán người nắm quyền, đòi ngưỡng lỗi cao hơn.' },
]);

const c4 = doc('lae101-4-1-privacy-image', '4.1 — Privacy &amp; the right to one\'s image|||4.1 — Quyền riêng tư &amp; hình ảnh cá nhân',
  'Quyền riêng tư & bí mật đời tư (Điều 21 Hiến pháp, Điều 38 BLDS), quyền với hình ảnh của mình (Điều 32 BLDS 2015 — cần đồng ý), bảo vệ dữ liệu cá nhân theo Nghị định 13/2023.',
  [[
    `<span class="eyebrow">LAE101 · Chapter 4 · Lesson 4.1</span>
<h2>Privacy &amp; the right to one's image</h2>
<h3>Privacy as a right</h3>
<p>Privacy protects a person's private life, secrets, correspondence and personal space. Vietnam's Constitution 2013 (Điều 21) and the Civil Code 2015 (Điều 38) protect <strong>private life, personal &amp; family secrets</strong>. Collecting, storing or publishing such information generally needs the person's <strong>consent</strong>.</p>
<h3>The right to your own image</h3>
<p>Under <strong>Điều 32, Bộ luật Dân sự 2015</strong>, an individual holds the right to their own image — using someone's photo <em>requires their consent</em>. Exceptions exist for images taken at public events or in the national/community interest, but the default is: ask first.</p>
<h3>Personal data protection — Decree 13/2023</h3>
<p><strong>Nghị định 13/2023/NĐ-CP</strong> (Vietnam's first comprehensive personal-data-protection decree) requires a <strong>lawful basis and consent</strong> to process personal data, gives data subjects rights (access, correction, deletion), and obliges controllers to secure the data and report breaches.</p>
<pre><code>Before using a person's photo or data, ask:
  Did they CONSENT?          (explicit, informed)
  Is there a PUBLIC-interest / public-event exception?
  Am I storing it SECURELY and only as long as needed?
</code></pre>
<div class="callout"><span class="badge">Case pattern</span> Publishing a private individual's photo — a hospital patient, a crime victim's child — without consent is the classic privacy/image violation, even when the photo itself is "true".</div>`,
    `<span class="eyebrow">LAE101 · Chương 4 · Bài 4.1</span>
<h2>Quyền riêng tư &amp; hình ảnh cá nhân</h2>
<h3>Riêng tư là một quyền</h3>
<p>Quyền riêng tư bảo vệ đời sống riêng, bí mật, thư tín và không gian cá nhân. Hiến pháp 2013 (Điều 21) và Bộ luật Dân sự 2015 (Điều 38) bảo vệ <strong>đời sống riêng tư, bí mật cá nhân &amp; gia đình</strong>. Thu thập, lưu giữ hay công bố thông tin đó thường cần <strong>sự đồng ý</strong> của người liên quan.</p>
<h3>Quyền với hình ảnh của mình</h3>
<p>Theo <strong>Điều 32, Bộ luật Dân sự 2015</strong>, cá nhân có quyền đối với hình ảnh của mình — dùng ảnh của một người <em>phải được người đó đồng ý</em>. Có ngoại lệ cho ảnh chụp tại sự kiện công cộng hoặc vì lợi ích quốc gia/cộng đồng, nhưng mặc định là: hỏi trước đã.</p>
<h3>Bảo vệ dữ liệu cá nhân — Nghị định 13/2023</h3>
<p><strong>Nghị định 13/2023/NĐ-CP</strong> (nghị định đầu tiên về bảo vệ dữ liệu cá nhân của VN) yêu cầu có <strong>căn cứ hợp pháp và sự đồng ý</strong> khi xử lý dữ liệu cá nhân, trao cho chủ thể dữ liệu các quyền (truy cập, chỉnh sửa, xoá), và buộc bên kiểm soát phải bảo mật và báo cáo khi rò rỉ.</p>
<pre><code>Trước khi dùng ảnh/dữ liệu của một người, hãy hỏi:
  Họ đã ĐỒNG Ý chưa?        (rõ ràng, được thông báo)
  Có ngoại lệ LỢI ÍCH CÔNG / sự kiện công cộng không?
  Có lưu AN TOÀN và chỉ trong thời gian cần không?
</code></pre>
<div class="callout"><span class="badge">Dạng vụ việc</span> Đăng ảnh một cá nhân riêng tư — bệnh nhân, con của nạn nhân — mà không xin phép là vi phạm riêng tư/hình ảnh kinh điển, dù bức ảnh "có thật".</div>`,
  ]]);

const c4q = quiz('lae101-quiz-4', 'Quiz 4 — Privacy &amp; image|||Quiz 4 — Riêng tư &amp; hình ảnh', [
  { id: 'q1', question: 'Điều 32 Bộ luật Dân sự 2015 nói gì về hình ảnh cá nhân?|||What does Article 32 of VN Civil Code 2015 say about a person\'s image?', options: ['Ảnh là tài sản công|||Images are public property', 'Dùng hình ảnh của một người cần sự đồng ý của họ|||Using a person\'s image needs their consent', 'Nhà báo được dùng mọi ảnh|||Journalists may use any image', 'Chỉ ảnh trẻ em mới cần xin phép|||Only children\'s photos need permission'], correctIndex: 1, explanation: 'Điều 32 BLDS 2015: cá nhân có quyền với hình ảnh, dùng phải được đồng ý.' },
  { id: 'q2', question: 'Văn bản đầu tiên của VN về bảo vệ dữ liệu cá nhân toàn diện là?|||Vietnam\'s first comprehensive personal-data-protection instrument?', options: ['Nghị định 13/2023/NĐ-CP', 'Luật Báo chí 2016', 'Nghị định 15/2020', 'Luật SHTT 2005'], correctIndex: 0, explanation: 'Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.' },
  { id: 'q3', question: 'Đăng ảnh một bệnh nhân trong viện mà không xin phép chủ yếu vi phạm?|||Publishing a hospital patient\'s photo without consent mainly violates?', options: ['Bản quyền|||Copyright', 'Quyền riêng tư & hình ảnh cá nhân|||Privacy & right to one\'s image', 'Luật quảng cáo|||Advertising law', 'Không vi phạm gì|||Nothing'], correctIndex: 1, explanation: 'Đây là vi phạm riêng tư/hình ảnh dù bức ảnh có thật.' },
]);

const c5 = doc('lae101-5-1-intellectual-property', '5.1 — Intellectual property in media|||5.1 — Sở hữu trí tuệ trong truyền thông',
  'Bản quyền (Luật SHTT 2005, sửa đổi 2022), quyền tác giả tự phát sinh, trích dẫn hợp lý (Điều 25), dùng nhạc/hình có phép, và ranh giới với đạo văn.',
  [[
    `<span class="eyebrow">LAE101 · Chapter 5 · Lesson 5.1</span>
<h2>Intellectual property in media</h2>
<h3>Copyright basics</h3>
<p><strong>Copyright (quyền tác giả)</strong> protects original works — articles, photos, music, video, design. Under Vietnam's <strong>Law on Intellectual Property 2005</strong> (amended 2009, 2019, 2022), copyright arises <em>automatically on creation</em>; you do not have to register it to own it. Using someone else's work without permission or a legal exception is infringement.</p>
<h3>Fair quotation (not open season)</h3>
<p><strong>Điều 25</strong> of the IP Law allows limited uses without permission or payment — e.g. <strong>quoting a reasonable portion</strong> for commentary, teaching or news, <em>with attribution</em> and without harming normal exploitation of the work. This is narrower than US "fair use"; a whole photo or song is not a "quotation".</p>
<h3>Music &amp; images</h3>
<ul>
<li>Background music in a video needs a <strong>licence</strong> (or use royalty-free / Creative Commons with correct attribution).</li>
<li>Stock and press photos carry usage terms — read them; a Google image result is not "free".</li>
</ul>
<h3>Plagiarism vs infringement</h3>
<p><strong>Plagiarism</strong> (passing others' work as your own) is an <em>ethical</em> breach of honesty; copyright <strong>infringement</strong> is a <em>legal</em> one. The same act is often both — the fix is the same: get permission and credit the source.</p>
<div class="callout"><span class="badge">Rule</span> Credit is not a licence: naming the author does not make unlicensed use legal, and a licence does not remove the duty to credit.</div>`,
    `<span class="eyebrow">LAE101 · Chương 5 · Bài 5.1</span>
<h2>Sở hữu trí tuệ trong truyền thông</h2>
<h3>Nền tảng bản quyền</h3>
<p><strong>Quyền tác giả (bản quyền)</strong> bảo vệ tác phẩm gốc — bài viết, ảnh, nhạc, video, thiết kế. Theo <strong>Luật Sở hữu trí tuệ 2005</strong> (sửa đổi 2009, 2019, 2022), quyền tác giả <em>tự phát sinh khi sáng tạo</em>; không cần đăng ký mới có quyền. Dùng tác phẩm của người khác mà không xin phép hay không có ngoại lệ luật định là xâm phạm.</p>
<h3>Trích dẫn hợp lý (không phải muốn lấy gì thì lấy)</h3>
<p><strong>Điều 25</strong> Luật SHTT cho phép một số việc không cần xin phép, không trả tiền — vd <strong>trích dẫn một phần hợp lý</strong> để bình luận, giảng dạy hay đưa tin, <em>có ghi nguồn</em> và không làm hại việc khai thác bình thường của tác phẩm. Phạm vi này hẹp hơn "fair use" của Mỹ; cả một bức ảnh hay bài hát không phải là "trích dẫn".</p>
<h3>Nhạc &amp; hình ảnh</h3>
<ul>
<li>Nhạc nền trong video cần <strong>giấy phép</strong> (hoặc dùng nhạc miễn phí bản quyền / Creative Commons và ghi nguồn đúng).</li>
<li>Ảnh stock và ảnh báo chí có điều khoản sử dụng — hãy đọc; một kết quả ảnh Google không phải là "miễn phí".</li>
</ul>
<h3>Đạo văn vs xâm phạm</h3>
<p><strong>Đạo văn</strong> (nhận tác phẩm của người khác là của mình) là vi phạm <em>đạo đức</em> về trung thực; <strong>xâm phạm bản quyền</strong> là vi phạm <em>pháp lý</em>. Cùng một hành vi thường là cả hai — cách xử lý giống nhau: xin phép và ghi nguồn.</p>
<div class="callout"><span class="badge">Nguyên tắc</span> Ghi nguồn không phải là giấy phép: nêu tên tác giả không làm cho việc dùng trái phép thành hợp pháp, và có giấy phép không xoá nghĩa vụ ghi nguồn.</div>`,
  ]]);

const c5q = quiz('lae101-quiz-5', 'Quiz 5 — Intellectual property|||Quiz 5 — Sở hữu trí tuệ', [
  { id: 'q1', question: 'Theo Luật SHTT VN, quyền tác giả phát sinh khi nào?|||Under VN IP Law, when does copyright arise?', options: ['Chỉ sau khi đăng ký|||Only after registration', 'Tự động khi tác phẩm được sáng tạo|||Automatically upon creation', 'Sau khi trả phí nhà nước|||After paying a state fee', 'Khi tác giả qua đời|||When the author dies'], correctIndex: 1, explanation: 'Quyền tác giả tự phát sinh khi sáng tạo, không bắt buộc đăng ký.' },
  { id: 'q2', question: 'Điều 25 Luật SHTT cho phép trích dẫn hợp lý với điều kiện?|||Article 25 permits fair quotation provided that?', options: ['Không cần ghi nguồn|||No attribution needed', 'Có ghi nguồn và không hại khai thác bình thường của tác phẩm|||Attribution given and normal exploitation not harmed', 'Chỉ dùng cho quảng cáo|||Only for advertising', 'Được sao chép toàn bộ tác phẩm|||The whole work may be copied'], correctIndex: 1, explanation: 'Trích dẫn hợp lý: phần hợp lý, có ghi nguồn, không hại khai thác.' },
  { id: 'q3', question: 'Khác biệt giữa đạo văn và xâm phạm bản quyền?|||Difference between plagiarism and copyright infringement?', options: ['Giống hệt nhau|||They are identical', 'Đạo văn là vi phạm đạo đức về trung thực; xâm phạm bản quyền là vi phạm pháp lý|||Plagiarism is an ethics breach; infringement is a legal one', 'Đạo văn nặng hơn về luật|||Plagiarism is the more serious legally', 'Chỉ nhà báo mới đạo văn|||Only journalists plagiarise'], correctIndex: 1, explanation: 'Đạo văn = đạo đức (trung thực); xâm phạm bản quyền = pháp lý; thường trùng nhau.' },
]);

const c6 = doc('lae101-6-1-professional-ethics', '6.1 — Professional ethics|||6.1 — Đạo đức nghề nghiệp',
  'Bộ quy tắc SPJ (4 nguyên tắc), PRSA; sự thật - chính xác - công bằng; xung đột lợi ích, quà tặng; bảo vệ nguồn tin; 10 quy định đạo đức nghề nghiệp người làm báo VN.',
  [[
    `<span class="eyebrow">LAE101 · Chapter 6 · Lesson 6.1</span>
<h2>Professional ethics</h2>
<h3>The SPJ four principles</h3>
<p>The <strong>SPJ Code of Ethics</strong> distils journalism into four duties:</p>
<ul>
<li><strong>Seek truth and report it</strong> — verify before you publish; be accurate and fair.</li>
<li><strong>Minimize harm</strong> — treat sources, subjects and the public as human beings deserving respect.</li>
<li><strong>Act independently</strong> — serve the public, not advertisers, donors or your own interests.</li>
<li><strong>Be accountable and transparent</strong> — explain choices, correct errors, invite scrutiny.</li>
</ul>
<h3>Independence &amp; conflicts of interest</h3>
<p>Accepting gifts, paid trips, or covering a company you own shares in all corrupt independence. The <strong>PRSA Code</strong> makes the same demand of communicators: honesty, disclosure, and loyalty that does not deceive the public.</p>
<h3>Protecting sources</h3>
<p>A promise of confidentiality to a source is a serious ethical (and often legal) commitment — Vietnam's Press Law also recognises a journalist's duty to protect sources. Breaking it dries up the flow of important information.</p>
<div class="callout"><span class="badge">Vietnam</span> Vietnam's Journalists' Association publishes a professional-ethics code (<strong>10 quy định đạo đức nghề nghiệp người làm báo</strong>) — truthfulness, responsibility to society, and integrity on social media are core to it.</div>`,
    `<span class="eyebrow">LAE101 · Chương 6 · Bài 6.1</span>
<h2>Đạo đức nghề nghiệp</h2>
<h3>Bốn nguyên tắc SPJ</h3>
<p><strong>Bộ quy tắc đạo đức SPJ</strong> cô đọng nghề báo thành bốn nghĩa vụ:</p>
<ul>
<li><strong>Tìm sự thật và đưa tin</strong> — kiểm chứng trước khi đăng; chính xác và công bằng.</li>
<li><strong>Giảm thiểu tổn hại</strong> — đối xử với nguồn tin, nhân vật và công chúng như những con người đáng được tôn trọng.</li>
<li><strong>Hành động độc lập</strong> — phục vụ công chúng, không phải nhà quảng cáo, nhà tài trợ hay lợi ích của mình.</li>
<li><strong>Chịu trách nhiệm và minh bạch</strong> — giải thích lựa chọn, sửa sai, chấp nhận bị soi.</li>
</ul>
<h3>Độc lập &amp; xung đột lợi ích</h3>
<p>Nhận quà, chuyến đi được trả tiền, hay viết về công ty mình có cổ phần — tất cả làm hỏng tính độc lập. <strong>Bộ quy tắc PRSA</strong> đòi hỏi điều tương tự với người làm truyền thông: trung thực, công khai, và không lừa dối công chúng.</p>
<h3>Bảo vệ nguồn tin</h3>
<p>Lời hứa bảo mật với nguồn tin là cam kết đạo đức (và thường là pháp lý) nghiêm túc — Luật Báo chí VN cũng ghi nhận nghĩa vụ bảo vệ nguồn tin của nhà báo. Phá vỡ nó làm cạn nguồn thông tin quan trọng.</p>
<div class="callout"><span class="badge">Việt Nam</span> Hội Nhà báo VN ban hành bộ quy tắc đạo đức nghề (<strong>10 quy định đạo đức nghề nghiệp người làm báo</strong>) — trung thực, trách nhiệm xã hội và ứng xử liêm chính trên mạng xã hội là cốt lõi.</div>`,
  ]]);

const c6q = quiz('lae101-quiz-6', 'Quiz 6 — Professional ethics|||Quiz 6 — Đạo đức nghề', [
  { id: 'q1', question: 'Đâu KHÔNG phải một trong bốn nguyên tắc SPJ?|||Which is NOT one of the four SPJ principles?', options: ['Tìm sự thật và đưa tin|||Seek truth and report it', 'Giảm thiểu tổn hại|||Minimize harm', 'Hành động độc lập|||Act independently', 'Tối đa hoá lượt xem bằng mọi giá|||Maximize views at any cost'], correctIndex: 3, explanation: 'Bốn nguyên tắc SPJ: sự thật, giảm tổn hại, độc lập, chịu trách nhiệm.' },
  { id: 'q2', question: 'Nhận quà đắt tiền từ nguồn tin để viết bài chủ yếu vi phạm?|||Accepting expensive gifts from a source mainly breaches?', options: ['Bản quyền|||Copyright', 'Tính độc lập / xung đột lợi ích|||Independence / conflict of interest', 'Quyền riêng tư|||Privacy', 'Luật quảng cáo|||Advertising law'], correctIndex: 1, explanation: 'Quà, chuyến đi được trả tiền làm hỏng tính độc lập của nhà báo.' },
  { id: 'q3', question: 'Bộ quy tắc đạo đức nghề của người làm báo VN do ai ban hành?|||Who issues Vietnam\'s journalists\' professional-ethics code?', options: ['Hội Nhà báo Việt Nam|||Vietnam Journalists\' Association', 'Liên Hợp Quốc|||The United Nations', 'Một công ty tư nhân|||A private company', 'Không ai cả|||No one'], correctIndex: 0, explanation: '10 quy định đạo đức nghề nghiệp người làm báo do Hội Nhà báo VN ban hành.' },
]);

const c7 = doc('lae101-7-1-sensitive-content', '7.1 — Sensitive content &amp; responsibility|||7.1 — Nội dung nhạy cảm &amp; trách nhiệm',
  'Tin giả (Nghị định 15/2020 phạt), ngôn từ thù ghét, quảng cáo (Luật Quảng cáo 2012), bảo vệ trẻ em (Luật Trẻ em 2016), và Luật An ninh mạng 2018.',
  [[
    `<span class="eyebrow">LAE101 · Chapter 7 · Lesson 7.1</span>
<h2>Sensitive content &amp; responsibility</h2>
<h3>Fake news &amp; misinformation</h3>
<p>Spreading false information on social media is not just unethical — it is penalised. In Vietnam, <strong>Nghị định 15/2020/NĐ-CP</strong> sets administrative fines for posting or sharing false, fabricated information that causes public alarm. Verify before you amplify.</p>
<h3>Hate speech</h3>
<p>Content that incites hatred or violence against a group (by ethnicity, religion, gender) is unlawful and unethical. Reach amplifies harm — a professional never uses a platform to dehumanise.</p>
<h3>Advertising &amp; children</h3>
<ul>
<li><strong>Advertising Law 2012 (Luật Quảng cáo)</strong> bans false or misleading ads and restricts ads for certain products; native ads must be identifiable as ads.</li>
<li><strong>Children's Law 2016 (Luật Trẻ em)</strong> protects children's privacy and image and bans content harmful to them; publishing a child's information needs special care and consent.</li>
</ul>
<h3>Cybersecurity</h3>
<p>The <strong>Cybersecurity Law 2018 (Luật An ninh mạng)</strong> governs online conduct — it prohibits using cyberspace to spread prohibited content, and imposes duties on platforms and users regarding data and harmful information.</p>
<div class="callout"><span class="badge">Duty of care</span> Reach = responsibility. The bigger your audience, the more a careless or harmful post can spread before it can be corrected.</div>`,
    `<span class="eyebrow">LAE101 · Chương 7 · Bài 7.1</span>
<h2>Nội dung nhạy cảm &amp; trách nhiệm</h2>
<h3>Tin giả &amp; thông tin sai</h3>
<p>Phát tán thông tin sai trên mạng xã hội không chỉ phi đạo đức — nó bị xử phạt. Ở VN, <strong>Nghị định 15/2020/NĐ-CP</strong> quy định phạt hành chính với việc đăng, chia sẻ thông tin sai sự thật, bịa đặt gây hoang mang. Hãy kiểm chứng trước khi lan truyền.</p>
<h3>Ngôn từ thù ghét</h3>
<p>Nội dung kích động thù hằn hay bạo lực nhằm vào một nhóm (theo dân tộc, tôn giáo, giới) là trái luật và phi đạo đức. Độ phủ khuếch đại tổn hại — người làm nghề không bao giờ dùng nền tảng để hạ nhục con người.</p>
<h3>Quảng cáo &amp; trẻ em</h3>
<ul>
<li><strong>Luật Quảng cáo 2012</strong> cấm quảng cáo sai sự thật, gây nhầm lẫn và hạn chế quảng cáo một số sản phẩm; quảng cáo trá hình phải nhận diện được là quảng cáo.</li>
<li><strong>Luật Trẻ em 2016</strong> bảo vệ bí mật đời tư và hình ảnh của trẻ, cấm nội dung gây hại cho trẻ; đăng thông tin của trẻ cần đặc biệt thận trọng và có sự đồng ý.</li>
</ul>
<h3>An ninh mạng</h3>
<p><strong>Luật An ninh mạng 2018</strong> điều chỉnh ứng xử trên mạng — cấm dùng không gian mạng để phát tán nội dung bị cấm, và đặt nghĩa vụ cho nền tảng lẫn người dùng về dữ liệu và thông tin gây hại.</p>
<div class="callout"><span class="badge">Nghĩa vụ cẩn trọng</span> Độ phủ = trách nhiệm. Khán giả càng lớn, một bài đăng cẩu thả hay gây hại càng lan xa trước khi kịp sửa.</div>`,
  ]]);

const c7q = quiz('lae101-quiz-7', 'Quiz 7 — Sensitive content|||Quiz 7 — Nội dung nhạy cảm', [
  { id: 'q1', question: 'Văn bản nào ở VN phạt hành chính việc đăng/chia sẻ tin giả gây hoang mang?|||Which VN instrument fines posting/sharing alarming fake news?', options: ['Nghị định 15/2020/NĐ-CP', 'Luật SHTT 2005', 'Điều 32 BLDS', 'Luật Quảng cáo 2012'], correctIndex: 0, explanation: 'Nghị định 15/2020 quy định phạt hành chính với tin sai sự thật gây hoang mang.' },
  { id: 'q2', question: 'Đăng thông tin, hình ảnh của trẻ em chủ yếu chịu điều chỉnh của?|||Publishing a child\'s information/image is chiefly governed by?', options: ['Luật Trẻ em 2016|||Children\'s Law 2016', 'Luật Báo chí 1989|||Press Law 1989', 'Luật Đất đai|||Land Law', 'Không luật nào|||No law'], correctIndex: 0, explanation: 'Luật Trẻ em 2016 bảo vệ bí mật đời tư, hình ảnh và cấm nội dung hại trẻ.' },
  { id: 'q3', question: 'Luật An ninh mạng 2018 chủ yếu điều chỉnh điều gì?|||The Cybersecurity Law 2018 mainly governs?', options: ['Giá điện|||Electricity prices', 'Ứng xử và nội dung trên không gian mạng|||Conduct and content in cyberspace', 'Bản quyền âm nhạc|||Music copyright', 'Quảng cáo ngoài trời|||Outdoor advertising'], correctIndex: 1, explanation: 'Luật An ninh mạng điều chỉnh ứng xử, nội dung và dữ liệu trên mạng.' },
]);

const c8 = doc('lae101-8-1-digital-ai-ethics', '8.1 — Digital &amp; AI ethics|||8.1 — Đạo đức số &amp; AI',
  'Deepfake và nội dung tổng hợp, quyền riêng tư dữ liệu thời AI, đạo đức mạng xã hội, và dùng AI có trách nhiệm trong báo chí/truyền thông (minh bạch, kiểm chứng, ghi nguồn).',
  [[
    `<span class="eyebrow">LAE101 · Chapter 8 · Lesson 8.1</span>
<h2>Digital &amp; AI ethics</h2>
<h3>Deepfakes &amp; synthetic media</h3>
<p>AI can now fabricate realistic faces, voices and video. A <strong>deepfake</strong> that puts false words in a real person's mouth can defame, deceive voters, or commit fraud — and may violate image rights, defamation and cybersecurity law at once. The ethical rule: <strong>label synthetic media clearly</strong> and never pass it off as real.</p>
<h3>Data privacy in the AI era</h3>
<p>AI systems are trained on, and generate, personal data. The principles of Decree 13/2023 still apply: <strong>lawful basis, consent, minimisation, security</strong>. Feeding a private person's data into a public AI tool can itself be a privacy breach.</p>
<h3>Social media ethics</h3>
<ul>
<li>Do not spread the unverified — a share is a publication.</li>
<li>Disclose paid partnerships; hidden ads deceive.</li>
<li>Respect people's dignity and privacy even in a comment.</li>
</ul>
<h3>AI in journalism &amp; communication</h3>
<p>AI can draft, translate and summarise — but a human must <strong>verify facts, check for bias and hallucination, and remain accountable</strong> for what is published. Transparency (telling the audience AI was used) is increasingly expected.</p>
<div class="callout"><span class="badge">The through-line</span> New tools, same duties: truth, minimizing harm, consent, and accountability. Technology changes the <em>how</em>, never the <em>why</em>.</div>`,
    `<span class="eyebrow">LAE101 · Chương 8 · Bài 8.1</span>
<h2>Đạo đức số &amp; AI</h2>
<h3>Deepfake &amp; nội dung tổng hợp</h3>
<p>AI giờ có thể tạo ra khuôn mặt, giọng nói và video giống thật. Một <strong>deepfake</strong> đặt lời giả vào miệng một người thật có thể phỉ báng, đánh lừa cử tri, hay lừa đảo — và có thể vi phạm cùng lúc quyền hình ảnh, phỉ báng và luật an ninh mạng. Nguyên tắc đạo đức: <strong>ghi nhãn rõ nội dung tổng hợp</strong> và không bao giờ trưng nó ra như thật.</p>
<h3>Riêng tư dữ liệu thời AI</h3>
<p>Hệ thống AI được huấn luyện trên, và sinh ra, dữ liệu cá nhân. Các nguyên tắc của Nghị định 13/2023 vẫn áp dụng: <strong>căn cứ hợp pháp, sự đồng ý, tối thiểu hoá, bảo mật</strong>. Đưa dữ liệu của một người riêng tư vào một công cụ AI công cộng tự nó có thể là vi phạm riêng tư.</p>
<h3>Đạo đức mạng xã hội</h3>
<ul>
<li>Đừng lan truyền thứ chưa kiểm chứng — một lượt chia sẻ là một lần xuất bản.</li>
<li>Công khai hợp tác trả tiền; quảng cáo ẩn là lừa dối.</li>
<li>Tôn trọng nhân phẩm và riêng tư của người khác ngay cả trong một bình luận.</li>
</ul>
<h3>AI trong báo chí &amp; truyền thông</h3>
<p>AI có thể soạn thảo, dịch và tóm tắt — nhưng con người phải <strong>kiểm chứng dữ kiện, soát thiên lệch và ảo giác, và chịu trách nhiệm</strong> cho thứ được đăng. Minh bạch (nói cho khán giả biết có dùng AI) ngày càng được kỳ vọng.</p>
<div class="callout"><span class="badge">Sợi chỉ xuyên suốt</span> Công cụ mới, nghĩa vụ cũ: sự thật, giảm tổn hại, đồng ý, và chịu trách nhiệm. Công nghệ đổi <em>cách làm</em>, không đổi <em>lý do</em>.</div>`,
  ]]);

const c8q = quiz('lae101-quiz-8', 'Quiz 8 — Digital &amp; AI ethics|||Quiz 8 — Đạo đức số &amp; AI', [
  { id: 'q1', question: 'Nguyên tắc đạo đức cốt lõi khi dùng nội dung tổng hợp/deepfake là?|||Core ethical rule for synthetic/deepfake media?', options: ['Giấu để trông thật hơn|||Hide it so it looks more real', 'Ghi nhãn rõ và không trưng ra như thật|||Label it clearly and never pass it as real', 'Chỉ dùng cho quảng cáo|||Use it only for ads', 'Không cần quy tắc nào|||No rule needed'], correctIndex: 1, explanation: 'Deepfake phải được ghi nhãn rõ, không trưng ra như nội dung thật.' },
  { id: 'q2', question: 'Đưa dữ liệu cá nhân của người khác vào công cụ AI công cộng có thể vi phạm?|||Feeding another person\'s data into a public AI tool may violate?', options: ['Nguyên tắc bảo vệ dữ liệu cá nhân (NĐ 13/2023)|||Personal-data protection principles (Decree 13/2023)', 'Luật giao thông|||Traffic law', 'Không gì cả|||Nothing', 'Chỉ bản quyền|||Copyright only'], correctIndex: 0, explanation: 'Nguyên tắc căn cứ hợp pháp, đồng ý, bảo mật của NĐ 13/2023 vẫn áp dụng.' },
  { id: 'q3', question: 'Khi dùng AI để soạn tin bài, ai chịu trách nhiệm cuối cùng cho nội dung đăng?|||When using AI to draft news, who is ultimately accountable for what is published?', options: ['Công cụ AI|||The AI tool', 'Con người (nhà báo/biên tập) phải kiểm chứng và chịu trách nhiệm|||The human (journalist/editor) must verify and be accountable', 'Không ai|||No one', 'Độc giả|||The reader'], correctIndex: 1, explanation: 'AI hỗ trợ, nhưng con người phải kiểm chứng và chịu trách nhiệm.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'LAE101',
    slug: 'lae101-law-and-ethics-in-media-and-communication',
    title: 'Law and Ethics in Media and Communication',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/LAE101.webp',
    shortDescription: 'Law & ethics in media & communication — law vs ethics, VN Press Law 2016, defamation, privacy & image (Decree 13/2023), copyright, ethics codes (SPJ), fake news & cybersecurity, digital & AI ethics. Bilingual, cases & quizzes.|||Luật & đạo đức truyền thông, báo chí — luật vs đạo đức, Luật Báo chí 2016, phỉ báng, riêng tư & hình ảnh (NĐ 13/2023), bản quyền, đạo đức nghề (SPJ), tin giả & an ninh mạng, đạo đức số & AI. Song ngữ, có vụ việc & quiz.',
    description: 'Môn <strong>LAE101 — Law and Ethics in Media and Communication</strong> (Kỳ 3, khối Công nghệ Truyền thông) là môn nhập môn rộng, phủ cả <strong>luật</strong> lẫn <strong>đạo đức</strong> của người làm truyền thông, báo chí. Từ <strong>phân biệt luật vs đạo đức &amp; tự do ngôn luận</strong> → <strong>khung pháp lý VN</strong> (Luật Báo chí 2016) → <strong>phỉ báng, quyền riêng tư &amp; hình ảnh</strong> (BLDS, Nghị định 13/2023) → <strong>sở hữu trí tuệ</strong> (bản quyền, trích dẫn hợp lý) → <strong>đạo đức nghề</strong> (SPJ/PRSA) → <strong>nội dung nhạy cảm</strong> (tin giả, trẻ em, an ninh mạng) → <strong>đạo đức số &amp; AI</strong>. Nguồn chuẩn quốc tế (Pember &amp; Calvert, Overbeck) kết hợp luật Việt Nam. Song ngữ, có điều luật cụ thể, vụ việc thật và quiz mỗi chương.',
    whatYouLearn: 'Phân biệt luật vs đạo đức &amp; giới hạn tự do ngôn luận; Luật Báo chí 2016 (quyền/nghĩa vụ nhà báo, thẻ nhà báo); phỉ báng, libel/slander, vu khống (Điều 156 BLHS), cải chính; quyền riêng tư &amp; hình ảnh (Điều 32 BLDS, Nghị định 13/2023); bản quyền &amp; trích dẫn hợp lý (Luật SHTT); bốn nguyên tắc SPJ, xung đột lợi ích, bảo vệ nguồn tin; tin giả (NĐ 15/2020), quảng cáo, trẻ em, an ninh mạng; đạo đức deepfake &amp; AI trong báo chí.',
    requirements: 'Không cần kiến thức pháp lý trước. Nên đọc song song văn bản luật gốc (Luật Báo chí 2016, Nghị định 13/2023) và bộ quy tắc SPJ khi học từng chương.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn quốc tế, văn bản luật VN, bộ quy tắc đạo đức, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Luật vs đạo đức, vì sao cần cả hai, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Luật & đạo đức là gì|||Chapter 1 — What are law & ethics', description: 'Phân biệt luật/đạo đức, tự do ngôn luận & giới hạn.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Khung pháp lý VN|||Chapter 2 — VN legal framework', description: 'Luật Báo chí 2016, quyền/nghĩa vụ nhà báo, quản lý nhà nước.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Phỉ báng & danh dự|||Chapter 3 — Defamation', description: 'Libel/slander, vu khống, cải chính, actual malice.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Riêng tư & hình ảnh|||Chapter 4 — Privacy & image', description: 'Quyền riêng tư, hình ảnh cá nhân, dữ liệu (NĐ 13/2023).', lessons: [c4, c4q] },
    { title: 'Chương 5 — Sở hữu trí tuệ|||Chapter 5 — Intellectual property', description: 'Bản quyền, trích dẫn hợp lý, nhạc/hình, đạo văn.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đạo đức nghề nghiệp|||Chapter 6 — Professional ethics', description: 'Bộ quy tắc SPJ/PRSA, xung đột lợi ích, nguồn tin.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Nội dung nhạy cảm|||Chapter 7 — Sensitive content', description: 'Tin giả, ngôn từ thù ghét, quảng cáo, trẻ em, an ninh mạng.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đạo đức số & AI|||Chapter 8 — Digital & AI ethics', description: 'Deepfake, riêng tư dữ liệu, MXH, AI trong báo chí.', lessons: [c8, c8q] },
  ],
};
