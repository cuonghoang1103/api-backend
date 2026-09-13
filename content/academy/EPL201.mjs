/**
 * EPL201 — Ethics, Privacy & Legal Issues in IMC (Đạo đức, Quyền riêng tư &
 * Pháp lý trong Truyền thông marketing tích hợp — ngành Công nghệ Truyền thông
 * FPTU). Môn KHÔNG có FLM → khung dựng theo chuẩn quốc tế (FTC advertising
 * guides, ICC Advertising & Marketing Code, GDPR, PRSA/AAF ethics) + luật VN
 * (Luật Quảng cáo 2012 + Nghị định 38/2021, Nghị định 13/2023 về bảo vệ dữ
 * liệu cá nhân, Luật An ninh mạng 2018, Luật SHTT). 8 chương, song ngữ VI+EN,
 * mỗi chương 1 DOCUMENT outline + 1 QUIZ 3 câu.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ trong HTML;
 * "&"→&amp; chỉ trong content; shortDescription dùng "&" thường.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('epl201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: quy tắc quốc tế (FTC, ICC, GDPR), luật VN (Luật Quảng cáo, Nghị định 13/2023, An ninh mạng), quy tắc đạo đức nghề (PRSA/AAF), lộ trình 4 bước.',
  [[
    `<span class="eyebrow">EPL201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study <strong>ethics, privacy and law in Integrated Marketing Communication (IMC)</strong> — in one place. This subject has no FLM syllabus, so the framework is built on <strong>recognised international codes</strong> and <strong>current Vietnamese law</strong>. All links below are free and official.</p>
<h3>⚖️ International codes &amp; regulators</h3>
<ul>
<li><a href="https://www.ftc.gov/business-guidance/advertising-marketing" target="_blank" rel="noopener">FTC — Advertising &amp; Marketing guidance</a> (truth-in-advertising, endorsement guides)</li>
<li><a href="https://iccwbo.org/business-solutions/marketing-advertising/" target="_blank" rel="noopener">ICC Advertising &amp; Marketing Communications Code</a> (the global self-regulation standard)</li>
<li><a href="https://gdpr-info.eu/" target="_blank" rel="noopener">GDPR — full text (EU 2016/679)</a></li>
</ul>
<h3>🇻🇳 Vietnamese law</h3>
<ul>
<li><a href="https://vanban.chinhphu.vn/" target="_blank" rel="noopener">Luật Quảng cáo 2012 &amp; Nghị định 38/2021 (xử phạt)</a></li>
<li><a href="https://vanban.chinhphu.vn/" target="_blank" rel="noopener">Nghị định 13/2023/NĐ-CP — bảo vệ dữ liệu cá nhân</a></li>
<li><a href="https://vanban.chinhphu.vn/" target="_blank" rel="noopener">Luật An ninh mạng 2018; Luật Sở hữu trí tuệ (sửa đổi 2022)</a></li>
</ul>
<h3>🎓 Professional ethics</h3>
<ul>
<li><a href="https://www.prsa.org/about/ethics" target="_blank" rel="noopener">PRSA Code of Ethics</a> (public relations)</li>
<li><a href="https://www.aaf.org/" target="_blank" rel="noopener">AAF — advertising principles &amp; ethics</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Frame it</strong> — learn the ethical lenses (utilitarian, deontology, virtue) and how they clash.</li>
<li><strong>Know the rules</strong> — truthful advertising, privacy/consent, IP, vulnerable audiences, disclosure.</li>
<li><strong>Apply the law</strong> — map a campaign to FTC/ICC + Luật Quảng cáo + Nghị định 13/2023.</li>
<li><strong>Job-ready</strong> — audit real ads &amp; data flows; write a compliance checklist for a live campaign.</li>
</ol></div>`,
    `<span class="eyebrow">EPL201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>đạo đức, quyền riêng tư và pháp lý trong Truyền thông marketing tích hợp (IMC)</strong> — gom một chỗ. Môn này không có giáo trình FLM, nên khung dựa trên <strong>các bộ quy tắc quốc tế được công nhận</strong> và <strong>luật Việt Nam hiện hành</strong>. Mọi liên kết dưới đây đều miễn phí, chính thức.</p>
<h3>⚖️ Quy tắc &amp; cơ quan quốc tế</h3>
<ul>
<li><a href="https://www.ftc.gov/business-guidance/advertising-marketing" target="_blank" rel="noopener">FTC — hướng dẫn Quảng cáo &amp; Marketing</a> (trung thực trong quảng cáo, quy tắc endorsement)</li>
<li><a href="https://iccwbo.org/business-solutions/marketing-advertising/" target="_blank" rel="noopener">Bộ quy tắc Quảng cáo &amp; Truyền thông ICC</a> (chuẩn tự quản toàn cầu)</li>
<li><a href="https://gdpr-info.eu/" target="_blank" rel="noopener">GDPR — toàn văn (EU 2016/679)</a></li>
</ul>
<h3>🇻🇳 Luật Việt Nam</h3>
<ul>
<li><a href="https://vanban.chinhphu.vn/" target="_blank" rel="noopener">Luật Quảng cáo 2012 &amp; Nghị định 38/2021 (xử phạt)</a></li>
<li><a href="https://vanban.chinhphu.vn/" target="_blank" rel="noopener">Nghị định 13/2023/NĐ-CP — bảo vệ dữ liệu cá nhân</a></li>
<li><a href="https://vanban.chinhphu.vn/" target="_blank" rel="noopener">Luật An ninh mạng 2018; Luật Sở hữu trí tuệ (sửa đổi 2022)</a></li>
</ul>
<h3>🎓 Đạo đức nghề nghiệp</h3>
<ul>
<li><a href="https://www.prsa.org/about/ethics" target="_blank" rel="noopener">Bộ quy tắc đạo đức PRSA</a> (quan hệ công chúng)</li>
<li><a href="https://www.aaf.org/" target="_blank" rel="noopener">AAF — nguyên tắc &amp; đạo đức quảng cáo</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Đặt khung</strong> — nắm các lăng kính đạo đức (vị lợi, nghĩa vụ luận, đức hạnh) và chỗ chúng mâu thuẫn.</li>
<li><strong>Biết luật chơi</strong> — quảng cáo trung thực, riêng tư/đồng thuận, SHTT, nhóm dễ tổn thương, disclosure.</li>
<li><strong>Áp luật</strong> — chiếu một chiến dịch vào FTC/ICC + Luật Quảng cáo + Nghị định 13/2023.</li>
<li><strong>Sẵn sàng đi làm</strong> — rà quảng cáo &amp; luồng dữ liệu thật; viết checklist tuân thủ cho một chiến dịch đang chạy.</li>
</ol></div>`,
  ]]);

const intro = doc('epl201-0-1-overview', 'Course overview: ethics, privacy & law in IMC|||Tổng quan: đạo đức, riêng tư & pháp lý trong IMC',
  'IMC là gì; vì sao đạo đức–riêng tư–pháp lý là ba trụ; ba lớp ràng buộc (luật cứng, tự quản, đạo đức); lộ trình 8 chương.',
  [[
    `<span class="eyebrow">EPL201 · Lesson 0.1 · Overview</span>
<h2>Ethics, privacy &amp; law in IMC</h2>
<p class="lead">Integrated Marketing Communication (IMC) coordinates advertising, PR, digital, social and promotion into one voice. This course asks the harder question: <strong>not can we say it, but should we — and is it legal?</strong> You'll learn to weigh an idea against ethics, privacy rights and the law before it ships.</p>
<h3>Three layers of constraint</h3>
<ul>
<li><strong>Hard law</strong> — statutes and decrees you must obey (Luật Quảng cáo, GDPR, Nghị định 13/2023). Breaking them = fines, bans, liability.</li>
<li><strong>Self-regulation</strong> — industry codes (ICC, FTC guides, AAF/PRSA). Not statutes, but enforced by regulators and platforms.</li>
<li><strong>Ethics</strong> — what is right even when it is legal. Reputation and trust live here.</li>
</ul>
<h3>Roadmap — 8 chapters</h3>
<p>Ethical frameworks → truthful vs misleading advertising → privacy &amp; data (GDPR, Nghị định 13/2023) → intellectual property → sensitive content &amp; vulnerable audiences → influencers &amp; disclosure → Vietnamese &amp; international ad law → digital &amp; AI responsibility. Every chapter pairs a principle with a real law and a real case.</p>
<div class="callout"><span class="badge">Why it matters</span> A single non-compliant campaign can trigger a regulator fine, a platform takedown and a public boycott at once — legal, financial and reputational damage from one decision.</div>`,
    `<span class="eyebrow">EPL201 · Bài 0.1 · Tổng quan</span>
<h2>Đạo đức, riêng tư &amp; pháp lý trong IMC</h2>
<p class="lead">Truyền thông marketing tích hợp (IMC) phối hợp quảng cáo, PR, digital, mạng xã hội và khuyến mãi thành một tiếng nói. Môn này đặt câu hỏi khó hơn: <strong>không phải "có được nói không", mà "có nên nói không — và có hợp pháp không?"</strong> Bạn học cách cân một ý tưởng với đạo đức, quyền riêng tư và luật trước khi phát hành.</p>
<h3>Ba lớp ràng buộc</h3>
<ul>
<li><strong>Luật cứng</strong> — luật, nghị định bắt buộc tuân theo (Luật Quảng cáo, GDPR, Nghị định 13/2023). Vi phạm = phạt, cấm, chịu trách nhiệm.</li>
<li><strong>Tự quản</strong> — bộ quy tắc ngành (ICC, hướng dẫn FTC, AAF/PRSA). Không là luật, nhưng bị cơ quan quản lý và nền tảng thực thi.</li>
<li><strong>Đạo đức</strong> — điều đúng ngay cả khi hợp pháp. Uy tín và niềm tin nằm ở đây.</li>
</ul>
<h3>Lộ trình — 8 chương</h3>
<p>Khung đạo đức → quảng cáo trung thực vs gây hiểu lầm → quyền riêng tư &amp; dữ liệu (GDPR, Nghị định 13/2023) → sở hữu trí tuệ → nội dung nhạy cảm &amp; nhóm dễ tổn thương → influencer &amp; disclosure → luật quảng cáo VN &amp; quốc tế → trách nhiệm số &amp; AI. Mỗi chương ghép một nguyên tắc với một điều luật thật và một vụ việc thật.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Một chiến dịch vi phạm có thể cùng lúc kích hoạt án phạt của cơ quan quản lý, gỡ bỏ trên nền tảng và tẩy chay công khai — thiệt hại pháp lý, tài chính và uy tín từ một quyết định.</div>`,
  ]]);

const c1 = doc('epl201-1-1-ethics-frameworks', '1.1 — Ethics in marketing communication|||1.1 — Đạo đức trong truyền thông marketing',
  'Ba khung đạo đức (vị lợi/utilitarian, nghĩa vụ luận/deontology, đức hạnh); mâu thuẫn lợi ích (conflict of interest); ranh giới thuyết phục vs thao túng.',
  [[
    `<span class="eyebrow">EPL201 · Chapter 1 · Lesson 1.1</span>
<h2>Ethics in marketing communication</h2>
<p class="lead">Ethics is reasoning about right and wrong <em>before</em> the law forces your hand. Three classic frameworks give you a vocabulary to argue a decision.</p>
<h3>Three ethical lenses</h3>
<ul>
<li><strong>Utilitarian</strong> — judge by outcomes: the right act creates the greatest good for the greatest number. Risk: it can justify harming a minority "for the majority".</li>
<li><strong>Deontology (duty)</strong> — some rules hold regardless of outcome (don't lie, don't deceive). A truthful ad that sells less is still right.</li>
<li><strong>Virtue ethics</strong> — ask "what would an honest, fair professional do?" Focus on character, not just the single act.</li>
</ul>
<h3>Conflict of interest</h3>
<p>A <strong>conflict of interest</strong> is when personal or financial gain competes with your duty to the audience or client — e.g. an agency recommending media it secretly owns, or an editor running "news" that is paid promotion. The fix is <strong>disclosure and separation</strong>.</p>
<h3>Persuasion vs manipulation</h3>
<p>Persuasion appeals to reasons the audience can inspect; <strong>manipulation</strong> exploits weaknesses they cannot (fear, addiction, cognitive bias) without their awareness. The line matters for every later chapter.</p>
<div class="callout"><span class="badge">Real case</span> The 2018 <strong>Cambridge Analytica</strong> scandal: Facebook data on ~87M people was used for micro-targeted political ads without meaningful consent — a utilitarian "it works" defence collided with a deontological duty not to deceive, and triggered global privacy reform.</div>`,
    `<span class="eyebrow">EPL201 · Chương 1 · Bài 1.1</span>
<h2>Đạo đức trong truyền thông marketing</h2>
<p class="lead">Đạo đức là lập luận về đúng–sai <em>trước khi</em> luật buộc bạn. Ba khung kinh điển cho bạn ngôn ngữ để tranh luận một quyết định.</p>
<h3>Ba lăng kính đạo đức</h3>
<ul>
<li><strong>Vị lợi (utilitarian)</strong> — xét theo hậu quả: hành động đúng tạo lợi ích lớn nhất cho nhiều người nhất. Rủi ro: có thể biện minh cho việc hại một nhóm nhỏ "vì số đông".</li>
<li><strong>Nghĩa vụ luận (deontology)</strong> — một số quy tắc luôn đúng bất kể hậu quả (không nói dối, không lừa dối). Quảng cáo trung thực dù bán ít hơn vẫn đúng.</li>
<li><strong>Đạo đức đức hạnh</strong> — hỏi "một người làm nghề trung thực, công bằng sẽ làm gì?" Tập trung vào nhân cách, không chỉ hành vi đơn lẻ.</li>
</ul>
<h3>Mâu thuẫn lợi ích</h3>
<p><strong>Mâu thuẫn lợi ích</strong> là khi lợi ích cá nhân hoặc tài chính cạnh tranh với nghĩa vụ với khán giả hoặc khách hàng — vd đại lý gợi ý kênh truyền thông mà mình bí mật sở hữu, hoặc biên tập chạy "tin tức" thực chất là quảng cáo trả tiền. Cách sửa là <strong>công khai và tách bạch</strong>.</p>
<h3>Thuyết phục vs thao túng</h3>
<p>Thuyết phục kêu gọi lý do mà khán giả kiểm chứng được; <strong>thao túng</strong> khai thác điểm yếu họ không nhận ra (sợ hãi, nghiện, thiên kiến nhận thức) mà họ không hay biết. Ranh giới này chi phối mọi chương sau.</p>
<div class="callout"><span class="badge">Vụ việc thật</span> Bê bối <strong>Cambridge Analytica</strong> 2018: dữ liệu Facebook của ~87 triệu người bị dùng cho quảng cáo chính trị nhắm siêu mục tiêu mà không có đồng thuận thực chất — lối biện hộ vị lợi "nó hiệu quả" đụng nghĩa vụ không được lừa dối, và châm ngòi cải cách quyền riêng tư toàn cầu.</div>`,
  ]]);

const c1q = quiz('epl201-quiz-1', 'Quiz 1 — Ethical frameworks|||Quiz 1 — Khung đạo đức', [
  { id: 'q1', question: 'Khung đạo đức xét hành động ĐÚNG theo HẬU QUẢ (lợi ích lớn nhất cho nhiều người nhất) là?', options: ['Nghĩa vụ luận (deontology)', 'Vị lợi (utilitarian)', 'Đạo đức đức hạnh', 'Thuyết vô chính phủ'], correctIndex: 1, explanation: 'Vị lợi (utilitarian) đánh giá theo hậu quả/tổng lợi ích.' },
  { id: 'q2', question: 'Cách xử lý cốt lõi cho một mâu thuẫn lợi ích (conflict of interest) là?', options: ['Giữ bí mật để không mất khách', 'Công khai và tách bạch vai trò', 'Tăng ngân sách quảng cáo', 'Nhờ influencer nói giúp'], correctIndex: 1, explanation: 'Disclosure + tách bạch giữa lợi ích cá nhân và nghĩa vụ với khán giả/khách hàng.' },
  { id: 'q3', question: 'Điểm phân biệt "thao túng" với "thuyết phục" là?', options: ['Thao túng dùng số liệu, thuyết phục thì không', 'Thao túng khai thác điểm yếu người xem không nhận ra', 'Thuyết phục luôn bất hợp pháp', 'Không có khác biệt'], correctIndex: 1, explanation: 'Thao túng khai thác yếu điểm (sợ hãi, thiên kiến) ngoài nhận thức của khán giả.' },
]);

const c2 = doc('epl201-2-1-truthful-advertising', '2.1 — Truthful vs misleading advertising|||2.1 — Quảng cáo trung thực & gây hiểu lầm',
  'Quảng cáo gây hiểu lầm (misleading), phóng đại chấp nhận được (puffery), nghĩa vụ chứng minh (substantiation), quảng cáo so sánh (comparative).',
  [[
    `<span class="eyebrow">EPL201 · Chapter 2 · Lesson 2.1</span>
<h2>Truthful vs misleading advertising</h2>
<p class="lead">The core rule everywhere: an ad must not <strong>deceive or mislead</strong> a reasonable consumer — by a false statement OR by a true statement that creates a false impression (omission, fine print, misleading image).</p>
<h3>Key concepts</h3>
<ul>
<li><strong>Misleading claim</strong> — likely to deceive and material to the buying decision. Illegal under FTC rules and Luật Quảng cáo (Điều 8).</li>
<li><strong>Puffery</strong> — subjective, obvious exaggeration no one takes literally ("the best coffee in the world"). Generally allowed because it makes no measurable claim.</li>
<li><strong>Substantiation</strong> — any <em>objective</em> claim ("clinically proven", "lasts 2× longer") must have evidence <em>before</em> it runs. No proof = deceptive.</li>
<li><strong>Comparative advertising</strong> — naming a competitor is allowed if the comparison is truthful, verifiable and not denigrating.</li>
</ul>
<pre><code>Test a claim:
  Objective &amp; measurable? -> needs substantiation (evidence on file)
  Subjective &amp; obvious?    -> puffery (usually OK)
  Creates false impression? -> misleading (illegal), even if literally true
</code></pre>
<div class="callout"><span class="badge">Real case</span> <strong>FTC v. POM Wonderful (2013)</strong>: health claims that pomegranate juice treats heart disease and prostate cancer lacked adequate substantiation — the court ordered two randomized human trials before such claims could run. Objective health claims need real evidence.</div>`,
    `<span class="eyebrow">EPL201 · Chương 2 · Bài 2.1</span>
<h2>Quảng cáo trung thực &amp; gây hiểu lầm</h2>
<p class="lead">Quy tắc lõi ở mọi nơi: quảng cáo không được <strong>lừa dối hoặc gây hiểu lầm</strong> cho người tiêu dùng hợp lý — bằng phát ngôn sai HOẶC bằng phát ngôn đúng nhưng tạo ấn tượng sai (bỏ sót, chữ nhỏ, hình ảnh đánh lừa).</p>
<h3>Khái niệm cốt lõi</h3>
<ul>
<li><strong>Tuyên bố gây hiểu lầm</strong> — có khả năng lừa dối và trọng yếu với quyết định mua. Bị cấm theo FTC và Luật Quảng cáo (Điều 8).</li>
<li><strong>Phóng đại (puffery)</strong> — cường điệu chủ quan, hiển nhiên, không ai hiểu theo nghĩa đen ("cà phê ngon nhất thế giới"). Thường được phép vì không đưa tuyên bố đo được.</li>
<li><strong>Nghĩa vụ chứng minh (substantiation)</strong> — mọi tuyên bố <em>khách quan</em> ("được chứng minh lâm sàng", "bền gấp 2 lần") phải có bằng chứng <em>trước khi</em> phát. Không bằng chứng = lừa dối.</li>
<li><strong>Quảng cáo so sánh</strong> — nêu tên đối thủ được phép nếu so sánh trung thực, kiểm chứng được và không bôi nhọ.</li>
</ul>
<pre><code>Thử một tuyên bố:
  Khách quan &amp; đo được?   -> cần substantiation (lưu bằng chứng)
  Chủ quan &amp; hiển nhiên?  -> puffery (thường OK)
  Tạo ấn tượng sai?       -> gây hiểu lầm (phạm luật), dù đúng nghĩa đen
</code></pre>
<div class="callout"><span class="badge">Vụ việc thật</span> <strong>FTC kiện POM Wonderful (2013)</strong>: tuyên bố nước lựu chữa bệnh tim và ung thư tuyến tiền liệt thiếu bằng chứng đủ mạnh — toà buộc phải có hai thử nghiệm ngẫu nhiên trên người trước khi được nói vậy. Tuyên bố sức khoẻ khách quan cần bằng chứng thật.</div>`,
  ]]);

const c2q = quiz('epl201-quiz-2', 'Quiz 2 — Truthful advertising|||Quiz 2 — Quảng cáo trung thực', [
  { id: 'q1', question: '"Bền gấp 2 lần sản phẩm thường" là tuyên bố khách quan. Trước khi phát quảng cáo, nhà quảng cáo PHẢI?', options: ['Không cần gì, cứ chạy', 'Có bằng chứng chứng minh (substantiation) sẵn', 'Chỉ cần ghi chữ nhỏ', 'Xin phép đối thủ'], correctIndex: 1, explanation: 'Tuyên bố khách quan cần substantiation — bằng chứng có trước khi phát.' },
  { id: 'q2', question: '"Cà phê ngon nhất thế giới" thường được phép vì đây là?', options: ['Tuyên bố khách quan', 'Puffery — cường điệu chủ quan không đo được', 'Quảng cáo so sánh', 'Lời chứng thực'], correctIndex: 1, explanation: 'Puffery: phóng đại chủ quan, hiển nhiên, không đưa tuyên bố đo được.' },
  { id: 'q3', question: 'Một quảng cáo nói ĐÚNG sự thật nhưng bỏ sót thông tin khiến người xem hiểu sai. Nó được xem là?', options: ['Hợp pháp vì mọi câu đều đúng', 'Vẫn gây hiểu lầm và bị cấm', 'Puffery', 'Quảng cáo so sánh hợp lệ'], correctIndex: 1, explanation: 'Ấn tượng sai do bỏ sót vẫn là gây hiểu lầm, dù từng câu đúng nghĩa đen.' },
]);

const c3 = doc('epl201-3-1-privacy-data', '3.1 — Privacy & personal data|||3.1 — Quyền riêng tư & dữ liệu cá nhân',
  'Dữ liệu cá nhân, đồng thuận (consent), cookie & tracking, nguyên tắc GDPR, Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân VN.',
  [[
    `<span class="eyebrow">EPL201 · Chapter 3 · Lesson 3.1</span>
<h2>Privacy &amp; personal data</h2>
<p class="lead">Modern marketing runs on data — but personal data belongs to the person, not the marketer. Two regimes set the rules: the EU's <strong>GDPR</strong> and Vietnam's <strong>Nghị định 13/2023/NĐ-CP</strong> (PDPD).</p>
<h3>GDPR core principles</h3>
<ul>
<li><strong>Lawful basis</strong> — you need a legal reason to process data; the strongest for marketing is <strong>consent</strong>.</li>
<li><strong>Consent must be freely given, specific, informed, unambiguous</strong> — a pre-ticked box or "by using the site you agree" is NOT valid.</li>
<li><strong>Purpose limitation &amp; data minimisation</strong> — collect only what you need, for the stated purpose.</li>
<li><strong>Data-subject rights</strong> — access, rectification, erasure ("right to be forgotten"), objection.</li>
</ul>
<h3>Vietnam — Nghị định 13/2023</h3>
<p>In force from 1 July 2023, it defines <strong>personal data</strong> and stricter <strong>sensitive personal data</strong>, requires <strong>consent</strong> for processing, gives data subjects rights (access, delete, withdraw consent), and mandates an <strong>impact assessment dossier (hồ sơ đánh giá tác động)</strong> for processing and cross-border transfers.</p>
<h3>Cookies &amp; tracking</h3>
<p>Cookies, pixels and device IDs are personal data when they identify a person. Non-essential tracking needs prior consent — hence the cookie banner (which must let users refuse as easily as accept).</p>
<div class="callout"><span class="badge">Real case</span> <strong>CNIL v. Google (2019)</strong> fined Google €50M under GDPR: consent for ad personalisation was neither properly informed (buried in layers) nor specific. Consent must be clear, granular and easy to find.</div>`,
    `<span class="eyebrow">EPL201 · Chương 3 · Bài 3.1</span>
<h2>Quyền riêng tư &amp; dữ liệu cá nhân</h2>
<p class="lead">Marketing hiện đại chạy bằng dữ liệu — nhưng dữ liệu cá nhân thuộc về người đó, không phải người làm marketing. Hai khung đặt luật chơi: <strong>GDPR</strong> của EU và <strong>Nghị định 13/2023/NĐ-CP</strong> (bảo vệ dữ liệu cá nhân) của VN.</p>
<h3>Nguyên tắc lõi GDPR</h3>
<ul>
<li><strong>Cơ sở pháp lý</strong> — phải có lý do hợp pháp để xử lý dữ liệu; mạnh nhất cho marketing là <strong>đồng thuận</strong>.</li>
<li><strong>Đồng thuận phải tự nguyện, cụ thể, được thông báo, rõ ràng</strong> — ô tick sẵn hay "dùng trang tức là bạn đồng ý" KHÔNG hợp lệ.</li>
<li><strong>Giới hạn mục đích &amp; tối thiểu dữ liệu</strong> — chỉ thu đúng thứ cần, cho mục đích đã nêu.</li>
<li><strong>Quyền của chủ thể</strong> — truy cập, chỉnh sửa, xoá ("quyền được lãng quên"), phản đối.</li>
</ul>
<h3>Việt Nam — Nghị định 13/2023</h3>
<p>Hiệu lực từ 01/7/2023, định nghĩa <strong>dữ liệu cá nhân</strong> và <strong>dữ liệu cá nhân nhạy cảm</strong> chặt hơn, yêu cầu <strong>sự đồng ý</strong> khi xử lý, trao quyền cho chủ thể (truy cập, xoá, rút đồng ý), và bắt buộc lập <strong>hồ sơ đánh giá tác động</strong> khi xử lý và khi chuyển dữ liệu ra nước ngoài.</p>
<h3>Cookie &amp; theo dõi</h3>
<p>Cookie, pixel, mã thiết bị là dữ liệu cá nhân khi nhận diện được một người. Theo dõi không thiết yếu cần đồng thuận trước — nên có banner cookie (phải cho từ chối dễ như chấp nhận).</p>
<div class="callout"><span class="badge">Vụ việc thật</span> <strong>CNIL phạt Google (2019)</strong> 50 triệu € theo GDPR: đồng thuận cho cá nhân hoá quảng cáo vừa không được thông báo đúng (chôn qua nhiều lớp) vừa không cụ thể. Đồng thuận phải rõ ràng, chi tiết và dễ tìm.</div>`,
  ]]);

const c3q = quiz('epl201-quiz-3', 'Quiz 3 — Privacy & data|||Quiz 3 — Riêng tư & dữ liệu', [
  { id: 'q1', question: 'Theo GDPR, cách lấy đồng thuận nào là KHÔNG hợp lệ cho marketing?', options: ['Ô tick trống người dùng tự tick', 'Nút "Đồng ý" tách khỏi "Từ chối" rõ ràng', 'Ô đã tick sẵn / "dùng trang tức là đồng ý"', 'Lựa chọn chi tiết từng mục đích'], correctIndex: 2, explanation: 'Đồng thuận phải tự nguyện, cụ thể, rõ ràng; ô tick sẵn hay đồng ý ngầm không hợp lệ.' },
  { id: 'q2', question: 'Văn bản nào là luật lõi bảo vệ dữ liệu cá nhân ở Việt Nam (hiệu lực 01/7/2023)?', options: ['Luật Quảng cáo 2012', 'Nghị định 13/2023/NĐ-CP', 'Luật An ninh mạng 2018', 'GDPR'], correctIndex: 1, explanation: 'Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, hiệu lực 01/7/2023.' },
  { id: 'q3', question: 'Nguyên tắc "data minimisation" (tối thiểu dữ liệu) nghĩa là?', options: ['Thu càng nhiều dữ liệu càng tốt', 'Chỉ thu đúng dữ liệu cần cho mục đích đã nêu', 'Xoá toàn bộ dữ liệu sau 1 ngày', 'Không cần đồng thuận'], correctIndex: 1, explanation: 'Chỉ thu thập dữ liệu cần thiết cho mục đích đã công bố.' },
]);

const c4 = doc('epl201-4-1-intellectual-property', '4.1 — Intellectual property|||4.1 — Sở hữu trí tuệ',
  'Bản quyền (copyright), nhãn hiệu (trademark), sử dụng hình ảnh/nhạc/font, sử dụng hợp lý (fair use) và quyền hình ảnh cá nhân.',
  [[
    `<span class="eyebrow">EPL201 · Chapter 4 · Lesson 4.1</span>
<h2>Intellectual property in campaigns</h2>
<p class="lead">Almost every asset in a campaign — a photo, a song, a font, a logo, a face — is owned by someone. Using it without a licence is infringement, and "I found it online" is not a defence.</p>
<h3>The main rights</h3>
<ul>
<li><strong>Copyright</strong> — protects original works (images, music, video, text) automatically, for the author's life + decades. You need a <strong>licence</strong> to reuse.</li>
<li><strong>Trademark</strong> — protects brand identifiers (name, logo, slogan). Using a competitor's mark to confuse consumers = infringement.</li>
<li><strong>Image rights / right of publicity</strong> — you need a <strong>model/property release</strong> to use a person's likeness commercially.</li>
<li><strong>Music</strong> — needs BOTH the composition licence (songwriter/publisher) and the master-recording licence (label). Buying the song does not license it for an ad.</li>
</ul>
<h3>Fair use — narrow, not a loophole</h3>
<p><strong>Fair use / fair dealing</strong> may allow limited use for criticism, commentary, news or parody — judged on purpose, amount, and market effect. <em>Commercial advertising rarely qualifies.</em> In Vietnam this is the "sử dụng hợp lý" exception under the Luật Sở hữu trí tuệ, and it is narrow.</p>
<div class="callout"><span class="badge">Real case</span> Photographer <strong>Daniel Morel</strong> won US$1.2M (2013) after AFP/Getty distributed his Haiti earthquake photos taken from Twitter without a licence. "Public on social media" is NOT permission to reuse commercially.</div>`,
    `<span class="eyebrow">EPL201 · Chương 4 · Bài 4.1</span>
<h2>Sở hữu trí tuệ trong chiến dịch</h2>
<p class="lead">Gần như mọi tài sản trong một chiến dịch — tấm ảnh, bài hát, font chữ, logo, gương mặt — đều có chủ. Dùng mà không có giấy phép là xâm phạm, và "tôi thấy trên mạng" không phải lý do bào chữa.</p>
<h3>Các quyền chính</h3>
<ul>
<li><strong>Bản quyền (copyright)</strong> — bảo hộ tác phẩm gốc (ảnh, nhạc, video, chữ) tự động, suốt đời tác giả + hàng chục năm. Muốn dùng lại phải có <strong>giấy phép</strong>.</li>
<li><strong>Nhãn hiệu (trademark)</strong> — bảo hộ dấu hiệu thương hiệu (tên, logo, slogan). Dùng nhãn hiệu đối thủ gây nhầm lẫn = xâm phạm.</li>
<li><strong>Quyền hình ảnh cá nhân</strong> — cần <strong>văn bản đồng ý (release)</strong> để dùng hình ảnh một người vào mục đích thương mại.</li>
<li><strong>Âm nhạc</strong> — cần CẢ giấy phép tác phẩm (nhạc sĩ/nhà xuất bản) VÀ giấy phép bản ghi (hãng đĩa). Mua bài hát không đồng nghĩa được dùng trong quảng cáo.</li>
</ul>
<h3>Sử dụng hợp lý — hẹp, không phải kẽ hở</h3>
<p><strong>Fair use / sử dụng hợp lý</strong> có thể cho dùng giới hạn để phê bình, bình luận, tin tức hay nhại — xét theo mục đích, lượng dùng, ảnh hưởng thị trường. <em>Quảng cáo thương mại hiếm khi đủ điều kiện.</em> Ở VN đây là ngoại lệ "sử dụng hợp lý" trong Luật Sở hữu trí tuệ, và nó rất hẹp.</p>
<div class="callout"><span class="badge">Vụ việc thật</span> Nhiếp ảnh gia <strong>Daniel Morel</strong> thắng 1,2 triệu USD (2013) sau khi AFP/Getty phát tán ảnh động đất Haiti lấy từ Twitter mà không có giấy phép. "Công khai trên mạng xã hội" KHÔNG phải là cho phép dùng lại thương mại.</div>`,
  ]]);

const c4q = quiz('epl201-quiz-4', 'Quiz 4 — Intellectual property|||Quiz 4 — Sở hữu trí tuệ', [
  { id: 'q1', question: 'Muốn dùng một bài hát nổi tiếng làm nhạc nền quảng cáo, thường phải xin?', options: ['Chỉ cần mua bài hát trên nền tảng nhạc số', 'Cả giấy phép tác phẩm VÀ giấy phép bản ghi', 'Không cần gì nếu ghi tên ca sĩ', 'Chỉ cần giấy phép của ca sĩ'], correctIndex: 1, explanation: 'Cần cả quyền tác phẩm (nhạc sĩ/NXB) và quyền bản ghi (hãng đĩa).' },
  { id: 'q2', question: 'Một tấm ảnh đăng công khai trên mạng xã hội. Dùng nó cho quảng cáo thương mại thì?', options: ['Được, vì đã công khai', 'Vẫn cần giấy phép của chủ bản quyền', 'Chỉ cần tag tác giả', 'Miễn phí nếu không sửa ảnh'], correctIndex: 1, explanation: 'Công khai ≠ cấp phép; dùng thương mại cần giấy phép (vụ Daniel Morel).' },
  { id: 'q3', question: 'Về "sử dụng hợp lý" (fair use) trong quảng cáo thương mại?', options: ['Luôn áp dụng cho mọi quảng cáo', 'Rất hẹp và hiếm khi áp dụng cho quảng cáo thương mại', 'Cho phép dùng mọi bài hát miễn phí', 'Thay thế cho giấy phép nhãn hiệu'], correctIndex: 1, explanation: 'Fair use hẹp (phê bình/tin/nhại); quảng cáo thương mại hiếm khi đủ điều kiện.' },
]);

const c5 = doc('epl201-5-1-sensitive-vulnerable', '5.1 — Sensitive content & vulnerable audiences|||5.1 — Nội dung nhạy cảm & nhóm dễ tổn thương',
  'Quảng cáo hướng tới trẻ em, quảng cáo rượu/bia/thuốc lá, khuôn mẫu (stereotyping) và trách nhiệm với nhóm dễ tổn thương.',
  [[
    `<span class="eyebrow">EPL201 · Chapter 5 · Lesson 5.1</span>
<h2>Sensitive content &amp; vulnerable audiences</h2>
<p class="lead">Some audiences cannot fully evaluate an ad, and some products carry real harm. Both law and ethics demand extra care.</p>
<h3>Children</h3>
<ul>
<li>Children cannot tell persuasion from information — codes ban ads that exploit their inexperience or create "pester power".</li>
<li>In the US, <strong>COPPA</strong> forbids collecting data from under-13s without verifiable parental consent.</li>
<li>Vietnam's <strong>Luật Trẻ em 2016</strong> and advertising rules restrict content that harms children's development.</li>
</ul>
<h3>Restricted products</h3>
<ul>
<li><strong>Tobacco</strong> — advertising is banned in Vietnam (Luật Phòng chống tác hại của thuốc lá 2012).</li>
<li><strong>Alcohol</strong> — the Luật Phòng chống tác hại của rượu, bia 2019 bans advertising drinks ≥15° and restricts time, place and targeting for the rest (no ads aimed at minors).</li>
</ul>
<h3>Stereotyping</h3>
<p>Ads that demean by gender, ethnicity, disability or age cause social harm even when legal. The ICC Code and the UK's banned "harmful gender stereotypes" rule (2019) show self-regulation moving ahead of statute.</p>
<div class="callout"><span class="badge">Real case</span> In 2019 the UK's ASA banned two ads (Volkswagen, Philadelphia) for <strong>harmful gender stereotypes</strong> — the first bans under a new rule. Legal to make, but not acceptable to run.</div>`,
    `<span class="eyebrow">EPL201 · Chương 5 · Bài 5.1</span>
<h2>Nội dung nhạy cảm &amp; nhóm dễ tổn thương</h2>
<p class="lead">Một số nhóm khán giả không đánh giá đầy đủ được quảng cáo, và một số sản phẩm mang hại thật. Cả luật lẫn đạo đức đều đòi hỏi cẩn trọng hơn.</p>
<h3>Trẻ em</h3>
<ul>
<li>Trẻ em không phân biệt được thuyết phục với thông tin — các bộ quy tắc cấm quảng cáo lợi dụng sự thiếu kinh nghiệm hay tạo "sức ép vòi vĩnh".</li>
<li>Ở Mỹ, <strong>COPPA</strong> cấm thu dữ liệu của trẻ dưới 13 nếu không có đồng ý xác thực của cha mẹ.</li>
<li><strong>Luật Trẻ em 2016</strong> và quy định quảng cáo của VN hạn chế nội dung gây hại cho sự phát triển của trẻ.</li>
</ul>
<h3>Sản phẩm hạn chế</h3>
<ul>
<li><strong>Thuốc lá</strong> — cấm quảng cáo ở Việt Nam (Luật Phòng chống tác hại của thuốc lá 2012).</li>
<li><strong>Rượu, bia</strong> — Luật Phòng chống tác hại của rượu, bia 2019 cấm quảng cáo đồ uống từ 15 độ cồn trở lên và hạn chế thời điểm, nơi chốn, đối tượng với phần còn lại (không nhắm tới trẻ vị thành niên).</li>
</ul>
<h3>Khuôn mẫu (stereotyping)</h3>
<p>Quảng cáo hạ thấp theo giới, dân tộc, khuyết tật hay tuổi tác gây hại xã hội ngay cả khi hợp pháp. Bộ quy tắc ICC và quy tắc "khuôn mẫu giới có hại" bị cấm ở Anh (2019) cho thấy tự quản đi trước luật.</p>
<div class="callout"><span class="badge">Vụ việc thật</span> Năm 2019 cơ quan ASA (Anh) cấm hai quảng cáo (Volkswagen, Philadelphia) vì <strong>khuôn mẫu giới có hại</strong> — những lệnh cấm đầu tiên theo quy tắc mới. Làm ra thì hợp pháp, nhưng không được phép phát.</div>`,
  ]]);

const c5q = quiz('epl201-quiz-5', 'Quiz 5 — Sensitive content|||Quiz 5 — Nội dung nhạy cảm', [
  { id: 'q1', question: 'Ở Việt Nam, quảng cáo THUỐC LÁ được xử lý thế nào?', options: ['Được phép nếu có cảnh báo', 'Bị cấm quảng cáo', 'Chỉ cấm trên TV', 'Được phép sau 22h'], correctIndex: 1, explanation: 'Luật Phòng chống tác hại của thuốc lá 2012 cấm quảng cáo thuốc lá.' },
  { id: 'q2', question: 'Theo Luật Phòng chống tác hại rượu bia 2019, quảng cáo đồ uống có cồn từ bao nhiêu độ bị cấm?', options: ['Từ 5 độ trở lên', 'Từ 15 độ trở lên', 'Mọi loại đều được phép', 'Chỉ cấm trên 40 độ'], correctIndex: 1, explanation: 'Cấm quảng cáo rượu, bia từ 15 độ cồn trở lên.' },
  { id: 'q3', question: 'Vì sao quảng cáo nhắm tới trẻ em cần chuẩn đạo đức cao hơn?', options: ['Trẻ em có nhiều tiền hơn', 'Trẻ khó phân biệt thuyết phục với thông tin', 'Trẻ không xem quảng cáo', 'Không có lý do đặc biệt'], correctIndex: 1, explanation: 'Trẻ chưa phân biệt được persuasion vs information nên dễ bị lợi dụng.' },
]);

const c6 = doc('epl201-6-1-influencer-disclosure', '6.1 — Influencers & disclosure|||6.1 — Influencer & minh bạch tài trợ',
  'Minh bạch quan hệ tài trợ, quy tắc endorsement của FTC, nghĩa vụ ở VN, quảng cáo trá hình (native ads) và ranh giới nội dung–quảng cáo.',
  [[
    `<span class="eyebrow">EPL201 · Chapter 6 · Lesson 6.1</span>
<h2>Influencers &amp; disclosure</h2>
<p class="lead">When a post is paid for, the audience has a right to know. Hidden sponsorship is deceptive because it borrows the credibility of "a real person's honest opinion".</p>
<h3>The disclosure rule</h3>
<ul>
<li><strong>FTC Endorsement Guides</strong> — any "material connection" (payment, free product, family/employee tie) must be disclosed <em>clearly and conspicuously</em>. Buried "#ad" among 30 hashtags is not enough.</li>
<li><strong>Honest experience</strong> — an endorser must actually use and believe in the product; you cannot claim results you did not get.</li>
<li><strong>The brand is liable too</strong> — companies are responsible for what their influencers say.</li>
</ul>
<h3>Native ads &amp; advertorials</h3>
<p><strong>Native advertising</strong> mimics editorial content. It must be labelled ("Sponsored", "Paid partnership") so readers are not misled into treating an ad as independent journalism.</p>
<h3>Vietnam</h3>
<p>Under Luật Quảng cáo and Nghị định 38/2021, advertising must be <strong>identifiable as advertising</strong> and must not mislead; from 2021 Vietnam has tightened rules on influencers/KOLs promoting products (especially unverified health and food claims).</p>
<div class="callout"><span class="badge">Real case</span> The 2017 <strong>Fyre Festival</strong> collapse: paid influencer posts (undisclosed) made a non-existent luxury event look real. The FTC later reminded influencers that #ad-style disclosure is mandatory, and reached settlements over hidden sponsorships.</div>`,
    `<span class="eyebrow">EPL201 · Chương 6 · Bài 6.1</span>
<h2>Influencer &amp; minh bạch tài trợ</h2>
<p class="lead">Khi một bài đăng được trả tiền, khán giả có quyền biết. Tài trợ giấu mặt là lừa dối vì nó mượn uy tín của "ý kiến trung thực của một người thật".</p>
<h3>Quy tắc công khai (disclosure)</h3>
<ul>
<li><strong>Quy tắc endorsement của FTC</strong> — mọi "quan hệ trọng yếu" (trả tiền, tặng sản phẩm, quan hệ gia đình/nhân viên) phải được công khai <em>rõ ràng, dễ thấy</em>. Nhét "#ad" giữa 30 hashtag là chưa đủ.</li>
<li><strong>Trải nghiệm thật</strong> — người quảng bá phải thực sự dùng và tin vào sản phẩm; không được nói kết quả mình không có.</li>
<li><strong>Nhãn hàng cũng chịu trách nhiệm</strong> — doanh nghiệp chịu trách nhiệm về điều influencer nói.</li>
</ul>
<h3>Quảng cáo trá hình (native ads)</h3>
<p><strong>Native advertising</strong> bắt chước nội dung biên tập. Nó phải được gắn nhãn ("Được tài trợ", "Hợp tác trả phí") để người đọc không bị đánh lừa xem quảng cáo là báo chí độc lập.</p>
<h3>Việt Nam</h3>
<p>Theo Luật Quảng cáo và Nghị định 38/2021, quảng cáo phải <strong>nhận biết được là quảng cáo</strong> và không gây hiểu lầm; từ 2021 VN siết quy định với influencer/KOL quảng bá sản phẩm (nhất là tuyên bố sức khoẻ, thực phẩm chưa kiểm chứng).</p>
<div class="callout"><span class="badge">Vụ việc thật</span> Vụ sụp đổ <strong>Fyre Festival</strong> 2017: các bài influencer trả tiền (không công khai) khiến một sự kiện xa xỉ không có thật trông như thật. FTC sau đó nhắc influencer rằng công khai kiểu "#ad" là bắt buộc, và đạt các dàn xếp về tài trợ giấu mặt.</div>`,
  ]]);

const c6q = quiz('epl201-quiz-6', 'Quiz 6 — Influencers & disclosure|||Quiz 6 — Influencer & minh bạch', [
  { id: 'q1', question: 'Một influencer được nhãn hàng tặng sản phẩm và trả tiền để đăng bài. Theo quy tắc FTC, họ phải?', options: ['Không cần nói gì', 'Công khai quan hệ tài trợ rõ ràng, dễ thấy', 'Chỉ cần khen sản phẩm', 'Xoá bài sau 24h'], correctIndex: 1, explanation: 'Mọi "material connection" phải được disclosure rõ ràng, dễ thấy.' },
  { id: 'q2', question: '"Native ad" (quảng cáo trông giống nội dung biên tập) bắt buộc phải?', options: ['Giấu hoàn toàn là quảng cáo', 'Gắn nhãn "Được tài trợ"/"Paid partnership"', 'Đăng trên trang nhất', 'Do nhà báo viết'], correctIndex: 1, explanation: 'Phải gắn nhãn để người đọc không nhầm quảng cáo với báo chí độc lập.' },
  { id: 'q3', question: 'Khi influencer nói sai/gây hiểu lầm về sản phẩm, ai chịu trách nhiệm?', options: ['Chỉ influencer', 'Cả nhãn hàng và influencer', 'Chỉ nền tảng mạng xã hội', 'Không ai cả'], correctIndex: 1, explanation: 'Doanh nghiệp cũng chịu trách nhiệm về điều influencer của mình nói.' },
]);

const c7 = doc('epl201-7-1-vn-international-ad-law', '7.1 — Vietnamese & international ad law|||7.1 — Luật quảng cáo VN & quốc tế',
  'Luật Quảng cáo 2012 & Nghị định 38/2021, sản phẩm cấm/hạn chế quảng cáo, Luật An ninh mạng, và khung tự quản quốc tế (ICC/FTC).',
  [[
    `<span class="eyebrow">EPL201 · Chapter 7 · Lesson 7.1</span>
<h2>Vietnamese &amp; international advertising law</h2>
<p class="lead">Every campaign lives inside a legal frame. Know the Vietnamese statutes and how they line up with the international self-regulatory system.</p>
<h3>Vietnam — the core statutes</h3>
<ul>
<li><strong>Luật Quảng cáo 2012</strong> — the master law: Điều 8 lists prohibited acts (false, misleading, denigrating competitors); Điều 7 lists <strong>products banned from advertising</strong> (tobacco, alcohol ≥15°, banned goods, prescription drugs, breast-milk substitutes for under-24-months, and more).</li>
<li><strong>Nghị định 38/2021/NĐ-CP</strong> — administrative penalties for advertising violations (fines, forced removal, correction).</li>
<li><strong>Luật An ninh mạng 2018</strong> — governs online content, data localisation and takedown of unlawful information; relevant to any digital campaign served in Vietnam.</li>
</ul>
<h3>International self-regulation</h3>
<p>The <strong>ICC Code</strong> is the global baseline most national bodies (and platforms) build on; the US <strong>FTC</strong> enforces truth-in-advertising and endorsement rules; the EU adds GDPR and unfair-commercial-practices directives. A cross-border campaign must clear the strictest rule that applies.</p>
<div class="callout"><span class="badge">Practice</span> Before launch, run a two-column check: (1) is the product/claim allowed to be advertised here at all? (2) does the creative meet FTC/ICC + Luật Quảng cáo Điều 8? A "no" in either column stops the campaign.</div>`,
    `<span class="eyebrow">EPL201 · Chương 7 · Bài 7.1</span>
<h2>Luật quảng cáo Việt Nam &amp; quốc tế</h2>
<p class="lead">Mọi chiến dịch đều sống trong một khung pháp lý. Hãy nắm các luật Việt Nam và cách chúng khớp với hệ thống tự quản quốc tế.</p>
<h3>Việt Nam — các luật lõi</h3>
<ul>
<li><strong>Luật Quảng cáo 2012</strong> — luật gốc: Điều 8 liệt kê hành vi cấm (sai sự thật, gây hiểu lầm, nói xấu đối thủ); Điều 7 liệt kê <strong>sản phẩm cấm quảng cáo</strong> (thuốc lá, rượu từ 15 độ, hàng cấm, thuốc kê đơn, sản phẩm thay thế sữa mẹ cho trẻ dưới 24 tháng, và nhiều loại khác).</li>
<li><strong>Nghị định 38/2021/NĐ-CP</strong> — xử phạt hành chính vi phạm quảng cáo (phạt tiền, buộc gỡ bỏ, cải chính).</li>
<li><strong>Luật An ninh mạng 2018</strong> — điều chỉnh nội dung trực tuyến, nội địa hoá dữ liệu và gỡ bỏ thông tin trái luật; liên quan tới mọi chiến dịch số phục vụ tại VN.</li>
</ul>
<h3>Tự quản quốc tế</h3>
<p><strong>Bộ quy tắc ICC</strong> là nền chung toàn cầu mà hầu hết cơ quan quốc gia (và nền tảng) dựa vào; <strong>FTC</strong> (Mỹ) thực thi trung thực trong quảng cáo và quy tắc endorsement; EU thêm GDPR và chỉ thị chống thực hành thương mại không lành mạnh. Chiến dịch xuyên biên giới phải vượt qua quy tắc chặt nhất áp dụng.</p>
<div class="callout"><span class="badge">Thực hành</span> Trước khi phát, chạy kiểm hai cột: (1) sản phẩm/tuyên bố có được phép quảng cáo ở đây không? (2) creative có đạt FTC/ICC + Luật Quảng cáo Điều 8 không? Một chữ "không" ở bất kỳ cột nào là dừng chiến dịch.</div>`,
  ]]);

const c7q = quiz('epl201-quiz-7', 'Quiz 7 — Ad law|||Quiz 7 — Luật quảng cáo', [
  { id: 'q1', question: 'Điều 7 Luật Quảng cáo 2012 quy định về?', options: ['Danh mục sản phẩm CẤM quảng cáo', 'Mức thuế quảng cáo', 'Giờ phát quảng cáo TV', 'Kích thước biển quảng cáo'], correctIndex: 0, explanation: 'Điều 7 liệt kê sản phẩm, hàng hoá, dịch vụ cấm quảng cáo (thuốc lá, rượu ≥15 độ...).' },
  { id: 'q2', question: 'Văn bản nào quy định XỬ PHẠT hành chính với vi phạm quảng cáo ở VN?', options: ['GDPR', 'Nghị định 38/2021/NĐ-CP', 'Luật Trẻ em 2016', 'ICC Code'], correctIndex: 1, explanation: 'Nghị định 38/2021/NĐ-CP quy định xử phạt vi phạm hành chính trong lĩnh vực quảng cáo.' },
  { id: 'q3', question: 'Một chiến dịch quảng cáo XUYÊN BIÊN GIỚI nên tuân theo quy tắc nào?', options: ['Quy tắc lỏng nhất để dễ chạy', 'Quy tắc CHẶT nhất trong các nơi áp dụng', 'Chỉ luật nước gửi', 'Không cần tuân luật nào'], correctIndex: 1, explanation: 'Phải vượt qua quy tắc chặt nhất áp dụng ở các thị trường liên quan.' },
]);

const c8 = doc('epl201-8-1-digital-ai-responsibility', '8.1 — Digital & AI responsibility|||8.1 — Trách nhiệm số & AI',
  'Deepfake, dark patterns (giao diện đánh lừa), đạo đức dữ liệu & AI trong marketing, minh bạch nội dung do AI tạo và trách nhiệm giải trình.',
  [[
    `<span class="eyebrow">EPL201 · Chapter 8 · Lesson 8.1</span>
<h2>Digital &amp; AI responsibility</h2>
<p class="lead">New tools raise old questions faster. AI, automation and behavioural design let marketers persuade — or deceive — at a scale that needs new guardrails.</p>
<h3>Deepfakes &amp; synthetic media</h3>
<p>AI-generated faces, voices and endorsements can put words in a real person's mouth. Using someone's likeness without consent violates image/publicity rights; passing off synthetic content as real is deceptive. Emerging rules (EU AI Act, platform policies) require <strong>labelling AI-generated content</strong>.</p>
<h3>Dark patterns</h3>
<ul>
<li><strong>Dark patterns</strong> are interface tricks that push users into choices against their interest — pre-checked add-ons, "confirmshaming", fake scarcity/countdowns, hard-to-cancel subscriptions.</li>
<li>The FTC and EU now treat many dark patterns as unlawful deceptive practices; consent obtained by a dark pattern is not valid consent.</li>
</ul>
<h3>Data &amp; AI ethics</h3>
<p>Algorithmic targeting can discriminate (excluding groups from housing/job ads) or exploit vulnerability. Principles: <strong>fairness, transparency, accountability</strong> — be able to explain why a person saw an ad, and let them opt out of automated profiling (a GDPR right).</p>
<div class="callout"><span class="badge">Real case</span> The FTC's action against <strong>Epic Games / Fortnite (2022, US$520M)</strong> targeted dark patterns and children's privacy — default settings and confusing buttons that led to unwanted charges. Design choices are ethical and legal choices.</div>`,
    `<span class="eyebrow">EPL201 · Chương 8 · Bài 8.1</span>
<h2>Trách nhiệm số &amp; AI</h2>
<p class="lead">Công cụ mới đặt lại câu hỏi cũ nhanh hơn. AI, tự động hoá và thiết kế hành vi cho phép người làm marketing thuyết phục — hoặc lừa dối — ở quy mô cần lan can mới.</p>
<h3>Deepfake &amp; nội dung tổng hợp</h3>
<p>Gương mặt, giọng nói, lời chứng thực do AI tạo có thể đặt lời vào miệng một người thật. Dùng hình ảnh ai đó không có sự đồng ý là xâm phạm quyền hình ảnh; đưa nội dung tổng hợp như thật là lừa dối. Các quy tắc mới (Đạo luật AI của EU, chính sách nền tảng) yêu cầu <strong>gắn nhãn nội dung do AI tạo</strong>.</p>
<h3>Dark patterns (giao diện đánh lừa)</h3>
<ul>
<li><strong>Dark patterns</strong> là mẹo giao diện đẩy người dùng vào lựa chọn ngược lợi ích của họ — tuỳ chọn tick sẵn, "confirmshaming" (làm xấu hổ khi từ chối), khan hiếm/đếm ngược giả, đăng ký khó huỷ.</li>
<li>FTC và EU nay coi nhiều dark pattern là hành vi lừa dối trái luật; đồng thuận lấy được bằng dark pattern không phải đồng thuận hợp lệ.</li>
</ul>
<h3>Đạo đức dữ liệu &amp; AI</h3>
<p>Nhắm mục tiêu bằng thuật toán có thể phân biệt đối xử (loại nhóm khỏi quảng cáo nhà ở/việc làm) hoặc khai thác điểm yếu. Nguyên tắc: <strong>công bằng, minh bạch, trách nhiệm giải trình</strong> — phải giải thích được vì sao một người thấy quảng cáo, và cho họ từ chối lập hồ sơ tự động (một quyền theo GDPR).</p>
<div class="callout"><span class="badge">Vụ việc thật</span> Hành động của FTC với <strong>Epic Games / Fortnite (2022, 520 triệu USD)</strong> nhắm vào dark patterns và quyền riêng tư trẻ em — cài đặt mặc định và nút gây rối dẫn tới các khoản thu ngoài ý muốn. Lựa chọn thiết kế là lựa chọn đạo đức và pháp lý.</div>`,
  ]]);

const c8q = quiz('epl201-quiz-8', 'Quiz 8 — Digital & AI|||Quiz 8 — Số & AI', [
  { id: 'q1', question: '"Dark pattern" trong thiết kế giao diện là?', options: ['Giao diện màu tối', 'Mẹo đẩy người dùng vào lựa chọn ngược lợi ích họ', 'Chế độ ban đêm', 'Một loại font'], correctIndex: 1, explanation: 'Dark pattern: thủ thuật UI như tick sẵn, khan hiếm giả, khó huỷ — đánh lừa lựa chọn.' },
  { id: 'q2', question: 'Dùng deepfake tạo lời chứng thực của một người nổi tiếng mà KHÔNG xin phép sẽ?', options: ['Hợp pháp vì là AI', 'Xâm phạm quyền hình ảnh và có tính lừa dối', 'Được phép nếu ghi "AI"', 'Chỉ vi phạm bản quyền nhạc'], correctIndex: 1, explanation: 'Dùng hình ảnh/giọng người thật không có đồng ý = xâm phạm quyền hình ảnh + lừa dối.' },
  { id: 'q3', question: 'Ba nguyên tắc đạo đức dữ liệu & AI trong marketing thường được nêu là?', options: ['Nhanh, rẻ, nhiều', 'Công bằng, minh bạch, trách nhiệm giải trình', 'Bí mật, độc quyền, tối đa hoá', 'Tự động, ẩn danh, vô hạn'], correctIndex: 1, explanation: 'Fairness, transparency, accountability — công bằng, minh bạch, giải trình được.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'EPL201',
    slug: 'epl201-ethics-privacy-legal-issues-in-imc',
    title: 'Ethics, Privacy & Legal Issues in IMC',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EPL201.webp',
    shortDescription: 'Ethics, privacy & law in marketing communication (IMC): ethical frameworks, truthful vs misleading ads, data privacy (GDPR, VN Decree 13/2023), IP, vulnerable audiences, influencer disclosure, ad law & AI responsibility. Bilingual, real cases & quizzes.|||Đạo đức, quyền riêng tư & pháp lý trong truyền thông marketing (IMC): khung đạo đức, quảng cáo trung thực/gây hiểu lầm, dữ liệu cá nhân (GDPR, NĐ 13/2023), SHTT, nhóm dễ tổn thương, disclosure influencer, luật QC & AI. Song ngữ, vụ việc thật.',
    description: 'Môn <strong>EPL201 — Ethics, Privacy &amp; Legal Issues in IMC</strong> (kỳ 3, ngành Công nghệ Truyền thông) dạy cách cân một ý tưởng truyền thông với <strong>đạo đức, quyền riêng tư và pháp luật</strong> trước khi phát hành. Từ <strong>khung đạo đức</strong> (vị lợi/nghĩa vụ luận/đức hạnh) → <strong>quảng cáo trung thực vs gây hiểu lầm</strong> (puffery, substantiation) → <strong>dữ liệu cá nhân</strong> (GDPR, Nghị định 13/2023) → <strong>sở hữu trí tuệ</strong> → <strong>nhóm dễ tổn thương</strong> → <strong>influencer &amp; disclosure</strong> → <strong>luật quảng cáo VN &amp; quốc tế</strong> → <strong>trách nhiệm số &amp; AI</strong> (deepfake, dark patterns). Môn không có FLM: khung dựng theo FTC/ICC/GDPR + Luật Quảng cáo 2012, Nghị định 38/2021 &amp; 13/2023, Luật An ninh mạng. Song ngữ, mỗi chương có vụ việc thật và quiz.',
    whatYouLearn: 'Ba khung đạo đức (utilitarian/deontology/virtue) &amp; mâu thuẫn lợi ích; phân biệt quảng cáo trung thực–gây hiểu lầm, puffery, substantiation, so sánh; nguyên tắc GDPR &amp; Nghị định 13/2023 (đồng thuận, cookie, quyền chủ thể); bản quyền/nhãn hiệu/quyền hình ảnh &amp; fair use; quảng cáo tới trẻ em, rượu/thuốc lá, chống stereotyping; quy tắc disclosure của influencer &amp; native ads; Luật Quảng cáo Điều 7/8, Nghị định 38/2021, Luật An ninh mạng; deepfake, dark patterns, đạo đức dữ liệu/AI.',
    requirements: 'Không cần kiến thức pháp lý trước. Nên có hiểu biết marketing/IMC cơ bản. Sẵn sàng đọc điều luật và phân tích tình huống thực tế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Quy tắc quốc tế (FTC/ICC/GDPR), luật VN, đạo đức nghề, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'IMC, ba lớp ràng buộc, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Đạo đức trong truyền thông|||Chapter 1 — Ethics', description: 'Utilitarian/deontology/virtue, mâu thuẫn lợi ích.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quảng cáo trung thực|||Chapter 2 — Truthful advertising', description: 'Misleading, puffery, substantiation, so sánh.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Quyền riêng tư & dữ liệu|||Chapter 3 — Privacy & data', description: 'Consent, cookie, GDPR, Nghị định 13/2023.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Sở hữu trí tuệ|||Chapter 4 — Intellectual property', description: 'Bản quyền, nhãn hiệu, ảnh/nhạc, fair use.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nội dung nhạy cảm|||Chapter 5 — Sensitive content', description: 'Trẻ em, rượu/thuốc lá, stereotyping.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Influencer & disclosure|||Chapter 6 — Influencers & disclosure', description: 'Tài trợ minh bạch, FTC, native ads.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Luật quảng cáo VN & quốc tế|||Chapter 7 — Ad law', description: 'Luật Quảng cáo, sản phẩm cấm, an ninh mạng.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Trách nhiệm số & AI|||Chapter 8 — Digital & AI', description: 'Deepfake, dark patterns, đạo đức dữ liệu/AI.', lessons: [c8, c8q] },
  ],
};
