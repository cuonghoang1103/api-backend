/**
 * ITE303c — Ethics in IT (Đạo đức trong Công nghệ thông tin). Ngành Khoa học
 * Máy tính, Kỳ 6. Khung 8 chương song ngữ VI+EN, mỗi chương 1 DOCUMENT + 1 QUIZ.
 * Giáo trình: Quinn "Ethics for the Information Age"; Tavani "Ethics and
 * Technology"; Reynolds "Ethics in Information Technology"; ACM Code of Ethics.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ lồng; & -> &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ite303c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách kinh điển (Quinn, Tavani, Reynolds), ACM/IEEE Code of Ethics, văn bản pháp luật Việt Nam, lộ trình.',
  [[
    `<span class="eyebrow">ITE303c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study <strong>Ethics in IT</strong> — moral reasoning, professional codes, privacy, intellectual property, security, speech and AI ethics — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for ITE303c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Michael J. Quinn — <em>Ethics for the Information Age</em></li>
<li>Herman T. Tavani — <em>Ethics and Technology</em></li>
<li>George W. Reynolds — <em>Ethics in Information Technology</em></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.acm.org/code-of-ethics" target="_blank" rel="noopener">ACM Code of Ethics and Professional Conduct</a></li>
<li><a href="https://www.computer.org/education/code-of-ethics" target="_blank" rel="noopener">IEEE-CS / ACM Software Engineering Code of Ethics</a></li>
<li><a href="https://plato.stanford.edu/entries/ethics-computer/" target="_blank" rel="noopener">Stanford Encyclopedia of Philosophy — Computer &amp; Information Ethics</a></li>
</ul>
<h3>▶️ Video &amp; talks</h3>
<ul>
<li><a href="https://www.youtube.com/@crashcourse" target="_blank" rel="noopener">CrashCourse — Philosophy (ethics playlist)</a></li>
<li><a href="https://www.ted.com/topics/ethics" target="_blank" rel="noopener">TED — talks on technology &amp; ethics</a></li>
</ul>
<h3>🇻🇳 Vietnam legal texts</h3>
<ul>
<li>Luật An ninh mạng 2018 · Luật An toàn thông tin mạng 2015</li>
<li>Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân · Luật Sở hữu trí tuệ</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — moral theories (consequentialist, deontological, virtue) and how to argue an ethical case.</li>
<li><strong>Professional core</strong> — the ACM/IEEE codes and how to apply them to a real dilemma.</li>
<li><strong>Applied topics</strong> — privacy, IP &amp; open source, security &amp; cybercrime, free speech, AI ethics.</li>
<li><strong>Job-ready</strong> — recognise dilemmas early, document your reasoning, know the Vietnamese legal context.</li>
</ol></div>`,
    `<span class="eyebrow">ITE303c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Đạo đức trong CNTT</strong> — lập luận đạo đức, quy tắc nghề nghiệp, quyền riêng tư, sở hữu trí tuệ, an ninh, tự do ngôn luận và đạo đức AI — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ITE303c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Michael J. Quinn — <em>Ethics for the Information Age</em></li>
<li>Herman T. Tavani — <em>Ethics and Technology</em></li>
<li>George W. Reynolds — <em>Ethics in Information Technology</em></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.acm.org/code-of-ethics" target="_blank" rel="noopener">Bộ Quy tắc Đạo đức ACM (ACM Code of Ethics)</a></li>
<li><a href="https://www.computer.org/education/code-of-ethics" target="_blank" rel="noopener">Bộ Quy tắc Đạo đức Kỹ nghệ Phần mềm IEEE-CS / ACM</a></li>
<li><a href="https://plato.stanford.edu/entries/ethics-computer/" target="_blank" rel="noopener">Bách khoa Triết học Stanford — Đạo đức Máy tính &amp; Thông tin</a></li>
</ul>
<h3>▶️ Video &amp; bài nói</h3>
<ul>
<li><a href="https://www.youtube.com/@crashcourse" target="_blank" rel="noopener">CrashCourse — Triết học (chuỗi về đạo đức)</a></li>
<li><a href="https://www.ted.com/topics/ethics" target="_blank" rel="noopener">TED — các bài nói về công nghệ &amp; đạo đức</a></li>
</ul>
<h3>🇻🇳 Văn bản pháp luật Việt Nam</h3>
<ul>
<li>Luật An ninh mạng 2018 · Luật An toàn thông tin mạng 2015</li>
<li>Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân · Luật Sở hữu trí tuệ</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — các lý thuyết đạo đức (vị lợi, nghĩa vụ luận, đức hạnh) và cách lập luận một tình huống đạo đức.</li>
<li><strong>Lõi nghề nghiệp</strong> — bộ quy tắc ACM/IEEE và cách áp dụng vào một tình huống thật.</li>
<li><strong>Chủ đề ứng dụng</strong> — quyền riêng tư, sở hữu trí tuệ &amp; mã nguồn mở, an ninh &amp; tội phạm mạng, tự do ngôn luận, đạo đức AI.</li>
<li><strong>Sẵn sàng đi làm</strong> — nhận diện tình huống sớm, ghi lại lập luận, nắm bối cảnh pháp lý Việt Nam.</li>
</ol></div>`,
  ]]);

const intro = doc('ite303c-0-1-overview', 'Course overview: Ethics in IT|||Tổng quan: Đạo đức trong CNTT',
  'Đạo đức trong CNTT là gì; vì sao người làm công nghệ cần nó; đạo đức khác luật ra sao; lộ trình 8 chương từ lý thuyết đạo đức → quy tắc nghề → các chủ đề ứng dụng.',
  [[
    `<span class="eyebrow">ITE303c · Lesson 0.1 · Overview</span>
<h2>Ethics in Information Technology</h2>
<p class="lead">Technology gives IT professionals real power over other people — over their data, their money, their attention and their safety. <strong>Ethics</strong> is the disciplined study of how we <em>ought</em> to use that power. This course teaches you to <strong>recognise, analyse and defend</strong> decisions about privacy, security, intellectual property, speech and AI.</p>
<h3>Ethics is not the same as law</h3>
<ul>
<li><strong>Law</strong> — rules the state enforces; breaking them brings penalties. Law lags behind technology and varies by country.</li>
<li><strong>Ethics</strong> — what is right, whether or not a law exists. Something can be legal yet unethical (dark patterns), or illegal yet arguably ethical (a good-faith whistleblower).</li>
<li><strong>Professional codes</strong> — a middle layer: what your profession expects of you (ACM, IEEE).</li>
</ul>
<h3>Roadmap</h3>
<p>Moral theories (utilitarian, deontology, virtue) → professional codes (ACM/IEEE) → privacy &amp; data protection → intellectual property &amp; open source → cybersecurity &amp; computer crime → free speech &amp; moderation → AI ethics &amp; algorithmic bias → professional responsibility, whistleblowing &amp; the Vietnamese legal context. Bilingual, with case-analysis frameworks and a quiz each chapter.</p>
<div class="callout"><span class="badge">Why it matters</span> A single deploy can expose millions of records or amplify a lie to millions of feeds. Knowing the ethical questions <em>before</em> you ship is a core professional skill, not an afterthought.</div>`,
    `<span class="eyebrow">ITE303c · Bài 0.1 · Tổng quan</span>
<h2>Đạo đức trong Công nghệ thông tin</h2>
<p class="lead">Công nghệ trao cho người làm CNTT quyền lực thật sự với người khác — với dữ liệu, tiền bạc, sự chú ý và an toàn của họ. <strong>Đạo đức</strong> là ngành nghiên cứu có hệ thống về việc ta <em>nên</em> dùng quyền lực đó thế nào. Môn này dạy bạn <strong>nhận diện, phân tích và bảo vệ</strong> các quyết định về quyền riêng tư, an ninh, sở hữu trí tuệ, ngôn luận và AI.</p>
<h3>Đạo đức không phải là luật</h3>
<ul>
<li><strong>Luật</strong> — quy tắc do nhà nước cưỡng chế; vi phạm thì bị chế tài. Luật thường đi sau công nghệ và khác nhau giữa các nước.</li>
<li><strong>Đạo đức</strong> — điều đúng đắn, dù có luật hay không. Một việc có thể hợp pháp mà phi đạo đức (mẫu thiết kế lừa dối), hoặc phi pháp mà có lý về mặt đạo đức (người tố giác thiện chí).</li>
<li><strong>Quy tắc nghề nghiệp</strong> — lớp ở giữa: điều nghề của bạn kỳ vọng ở bạn (ACM, IEEE).</li>
</ul>
<h3>Lộ trình</h3>
<p>Lý thuyết đạo đức (vị lợi, nghĩa vụ luận, đức hạnh) → quy tắc nghề nghiệp (ACM/IEEE) → quyền riêng tư &amp; bảo vệ dữ liệu → sở hữu trí tuệ &amp; mã nguồn mở → an ninh mạng &amp; tội phạm máy tính → tự do ngôn luận &amp; kiểm duyệt → đạo đức AI &amp; thuật toán thiên lệch → trách nhiệm nghề nghiệp, tố giác &amp; bối cảnh pháp lý Việt Nam. Song ngữ, có khung phân tích tình huống và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Một lần triển khai có thể làm lộ hàng triệu bản ghi hoặc khuếch đại một lời dối tới hàng triệu bảng tin. Biết các câu hỏi đạo đức <em>trước</em> khi ship là kỹ năng nghề cốt lõi, không phải chuyện làm sau.</div>`,
  ]]);

const c1 = doc('ite303c-1-1-moral-theories', '1.1 — Ethics &amp; moral theories|||1.1 — Đạo đức học &amp; lý thuyết đạo đức',
  'Đạo đức học là gì; ba trường phái lớn: vị lợi (hệ quả), nghĩa vụ luận (bổn phận/quyền), đức hạnh (phẩm chất); dùng chúng để soi một tình huống công nghệ.',
  [[
    `<span class="eyebrow">ITE303c · Chapter 1 · Lesson 1.1</span>
<h2>Ethics &amp; moral theories</h2>
<p>A <strong>moral theory</strong> gives you a principled way to decide what is right — not just a gut feeling. The three most useful families in IT ethics are:</p>
<h3>The three families</h3>
<ul>
<li><strong>Consequentialism / Utilitarianism</strong> — an act is right if it produces the greatest good for the greatest number. Judge by <em>outcomes</em>. Strength: weighs real harms &amp; benefits. Weakness: can justify sacrificing a minority.</li>
<li><strong>Deontology (duty ethics, Kant)</strong> — some acts are right or wrong in themselves, regardless of outcome. Judge by <em>duties &amp; rights</em>: keep promises, tell the truth, respect people as ends not means. Strength: protects rights. Weakness: rigid when duties conflict.</li>
<li><strong>Virtue ethics (Aristotle)</strong> — focus on <em>character</em>: what would an honest, courageous, fair professional do? Strength: fits real life and role models. Weakness: vague on hard cases.</li>
</ul>
<h3>Applying them to a case</h3>
<pre><code>Case: your app quietly sells user location data.

Utilitarian : sum harms (privacy loss, risk) vs benefits (revenue).
              If harm to many &gt; benefit to few -&gt; wrong.
Deontology  : users were not told -&gt; consent/right violated -&gt; wrong,
              even if profitable.
Virtue      : would an honest engineer hide this? No -&gt; wrong.

All three converge -&gt; strong signal the act is unethical.
</code></pre>
<div class="callout"><span class="badge">Key idea</span> When several theories point the same way, you have a strong ethical conclusion. When they disagree, that is exactly where careful reasoning — and this course — earns its keep.</div>`,
    `<span class="eyebrow">ITE303c · Chương 1 · Bài 1.1</span>
<h2>Đạo đức học &amp; lý thuyết đạo đức</h2>
<p>Một <strong>lý thuyết đạo đức</strong> cho bạn cách quyết định điều đúng có nguyên tắc — không chỉ là cảm tính. Ba nhóm hữu dụng nhất trong đạo đức CNTT là:</p>
<h3>Ba trường phái</h3>
<ul>
<li><strong>Thuyết hệ quả / Vị lợi (Utilitarianism)</strong> — một hành vi đúng nếu tạo ra điều tốt lớn nhất cho số đông nhất. Xét theo <em>kết quả</em>. Mạnh: cân được lợi &amp; hại thật. Yếu: có thể biện minh cho việc hy sinh thiểu số.</li>
<li><strong>Nghĩa vụ luận (Deontology, Kant)</strong> — có những hành vi tự thân là đúng hay sai, bất kể kết quả. Xét theo <em>bổn phận &amp; quyền</em>: giữ lời hứa, nói thật, coi con người là mục đích chứ không là phương tiện. Mạnh: bảo vệ quyền. Yếu: cứng nhắc khi các bổn phận xung đột.</li>
<li><strong>Đạo đức đức hạnh (Aristotle)</strong> — tập trung vào <em>phẩm chất</em>: một người làm nghề trung thực, dũng cảm, công bằng sẽ làm gì? Mạnh: hợp đời thực và hình mẫu. Yếu: mơ hồ ở ca khó.</li>
</ul>
<h3>Soi vào một tình huống</h3>
<pre><code>Tình huống: app âm thầm bán dữ liệu vị trí người dùng.

Vị lợi      : cộng hại (mất riêng tư, rủi ro) so lợi (doanh thu).
              Hại nhiều &gt; lợi ít -&gt; sai.
Nghĩa vụ    : người dùng không được báo -&gt; vi phạm đồng thuận/quyền
              -&gt; sai, dù có lời.
Đức hạnh    : một kỹ sư trung thực có giấu điều này không? Không -&gt; sai.

Cả ba cùng chỉ một hướng -&gt; tín hiệu mạnh: hành vi phi đạo đức.
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Khi nhiều lý thuyết cùng chỉ một hướng, bạn có kết luận đạo đức vững. Khi chúng bất đồng, đó chính là chỗ lập luận cẩn thận — và môn học này — phát huy giá trị.</div>`,
  ]]);

const c1q = quiz('ite303c-quiz-1', 'Quiz 1 — Moral theories|||Quiz 1 — Lý thuyết đạo đức', [
  { id: 'q1', question: 'Thuyết vị lợi (utilitarianism) đánh giá một hành vi dựa trên?', options: ['Ý định trong lòng', 'Hệ quả: điều tốt lớn nhất cho số đông nhất', 'Bổn phận tuyệt đối', 'Truyền thống của tổ chức'], correctIndex: 1, explanation: 'Vị lợi thuộc thuyết hệ quả: đúng/sai xét theo kết quả — tổng lợi và hại.' },
  { id: 'q2', question: 'Nghĩa vụ luận (deontology, Kant) nhấn mạnh điều gì?', options: ['Chỉ kết quả cuối cùng', 'Bổn phận và quyền — có việc tự thân là đúng/sai', 'Lợi nhuận tối đa', 'Số đông luôn đúng'], correctIndex: 1, explanation: 'Nghĩa vụ luận xét bổn phận và quyền: giữ lời hứa, nói thật, tôn trọng con người như mục đích.' },
  { id: 'q3', question: 'Đạo đức đức hạnh (virtue ethics) tập trung vào?', options: ['Phẩm chất của người hành động (trung thực, công bằng...)', 'Bảng tính lợi-hại', 'Điều luật thành văn', 'Hợp đồng lao động'], correctIndex: 0, explanation: 'Đức hạnh hỏi: một người làm nghề có phẩm chất tốt sẽ hành xử thế nào?' },
]);

const c2 = doc('ite303c-2-1-professional-codes', '2.1 — Professional ethics &amp; ACM/IEEE codes|||2.1 — Đạo đức nghề nghiệp &amp; quy tắc ACM/IEEE',
  'Vì sao CNTT là một nghề có trách nhiệm; bộ Quy tắc ACM (public good là ưu tiên số một) và bộ IEEE-CS/ACM cho kỹ nghệ phần mềm; cách dùng quy tắc để soi tình huống.',
  [[
    `<span class="eyebrow">ITE303c · Chapter 2 · Lesson 2.1</span>
<h2>Professional ethics &amp; the ACM/IEEE codes</h2>
<p>A <strong>profession</strong> holds specialised power the public cannot easily check — so it accepts special duties. IT is now such a profession, and its two anchor documents are the <strong>ACM Code of Ethics</strong> and the <strong>IEEE-CS/ACM Software Engineering Code</strong>.</p>
<h3>ACM Code — the shape of it</h3>
<ul>
<li><strong>General principles</strong> — contribute to society and human well-being; avoid harm; be honest and trustworthy; be fair and non-discriminatory; respect privacy; honour confidentiality.</li>
<li><strong>Professional responsibilities</strong> — do quality work; know and respect existing rules; give and accept professional review.</li>
<li><strong>The overriding rule</strong> — <em>the public good is the primary consideration.</em></li>
</ul>
<h3>IEEE/ACM Software Engineering — eight principles</h3>
<pre><code>PUBLIC        - act in the public interest
CLIENT        - serve client &amp; employer in the public interest
PRODUCT       - meet the highest professional standards
JUDGMENT      - keep professional judgment independent
MANAGEMENT    - manage ethically
PROFESSION    - protect the profession's reputation
COLLEAGUES    - be fair to and support colleagues
SELF          - keep learning; practise ethically
</code></pre>
<div class="callout"><span class="badge">How to use a code</span> A code is not a lookup table. Identify the affected stakeholders, list the principles in tension (e.g. CLIENT vs PUBLIC), and justify which one wins in this context. When they conflict, the public interest is the tie-breaker.</div>`,
    `<span class="eyebrow">ITE303c · Chương 2 · Bài 2.1</span>
<h2>Đạo đức nghề nghiệp &amp; bộ quy tắc ACM/IEEE</h2>
<p>Một <strong>nghề chuyên môn</strong> nắm quyền lực đặc thù mà công chúng khó kiểm soát — nên nó nhận về những bổn phận riêng. CNTT nay là một nghề như vậy, với hai văn bản trụ cột: <strong>Bộ Quy tắc Đạo đức ACM</strong> và <strong>Bộ Quy tắc Kỹ nghệ Phần mềm IEEE-CS/ACM</strong>.</p>
<h3>Quy tắc ACM — hình hài</h3>
<ul>
<li><strong>Nguyên tắc chung</strong> — đóng góp cho xã hội và phúc lợi con người; tránh gây hại; trung thực, đáng tin; công bằng, không phân biệt; tôn trọng quyền riêng tư; giữ bảo mật.</li>
<li><strong>Trách nhiệm nghề nghiệp</strong> — làm việc chất lượng; biết và tôn trọng quy định hiện hành; sẵn sàng cho và nhận phản biện chuyên môn.</li>
<li><strong>Quy tắc bao trùm</strong> — <em>lợi ích công chúng là ưu tiên hàng đầu.</em></li>
</ul>
<h3>Kỹ nghệ phần mềm IEEE/ACM — tám nguyên tắc</h3>
<pre><code>PUBLIC       - hành động vì lợi ích công chúng
CLIENT       - phục vụ khách hàng &amp; chủ vì lợi ích công chúng
PRODUCT      - đạt chuẩn nghề nghiệp cao nhất
JUDGMENT     - giữ phán đoán nghề độc lập
MANAGEMENT   - quản lý có đạo đức
PROFESSION   - bảo vệ uy tín của nghề
COLLEAGUES   - công bằng và hỗ trợ đồng nghiệp
SELF         - học suốt đời; hành nghề có đạo đức
</code></pre>
<div class="callout"><span class="badge">Cách dùng một bộ quy tắc</span> Quy tắc không phải bảng tra. Hãy xác định các bên liên quan bị ảnh hưởng, liệt kê những nguyên tắc đang xung đột (vd CLIENT với PUBLIC), rồi lập luận nguyên tắc nào thắng trong bối cảnh này. Khi xung đột, lợi ích công chúng là điểm phân định.</div>`,
  ]]);

const c2q = quiz('ite303c-quiz-2', 'Quiz 2 — Professional codes|||Quiz 2 — Quy tắc nghề nghiệp', [
  { id: 'q1', question: 'Theo Bộ Quy tắc ACM, điều gì là ưu tiên hàng đầu khi các nguyên tắc xung đột?', options: ['Lợi nhuận của công ty', 'Lợi ích công chúng (public good)', 'Mệnh lệnh của cấp trên', 'Tốc độ ra mắt sản phẩm'], correctIndex: 1, explanation: 'ACM đặt "lợi ích công chúng là ưu tiên hàng đầu" — là điểm phân định khi các nguyên tắc mâu thuẫn.' },
  { id: 'q2', question: 'Nguyên tắc "PUBLIC" trong bộ quy tắc kỹ nghệ phần mềm IEEE/ACM nghĩa là?', options: ['Công khai mã nguồn', 'Hành động vì lợi ích công chúng', 'Chỉ phục vụ khách hàng trả tiền', 'Quảng bá sản phẩm rộng rãi'], correctIndex: 1, explanation: 'PUBLIC yêu cầu kỹ sư phần mềm hành động nhất quán với lợi ích công chúng.' },
  { id: 'q3', question: 'Cách dùng đúng một bộ quy tắc đạo đức nghề là?', options: ['Tra như bảng tra để có câu trả lời có/không', 'Xác định các bên liên quan, nêu nguyên tắc xung đột và lập luận nguyên tắc nào thắng', 'Bỏ qua nếu chưa có luật cấm', 'Chỉ dùng khi bị kiện'], correctIndex: 1, explanation: 'Quy tắc là khung lập luận: nhận diện bên liên quan, nguyên tắc căng thẳng, rồi biện minh lựa chọn.' },
]);

const c3 = doc('ite303c-3-1-privacy', '3.1 — Privacy &amp; personal data protection|||3.1 — Quyền riêng tư &amp; bảo vệ dữ liệu cá nhân',
  'Quyền riêng tư là gì và vì sao đáng bảo vệ; thu thập, tổng hợp và giám sát dữ liệu; nguyên tắc bảo vệ dữ liệu (đồng thuận, tối thiểu hoá, mục đích); GDPR và Nghị định 13/2023 của Việt Nam.',
  [[
    `<span class="eyebrow">ITE303c · Chapter 3 · Lesson 3.1</span>
<h2>Privacy &amp; personal data protection</h2>
<p><strong>Privacy</strong> is the ability to control information about yourself. It matters because data can be used to profile, manipulate, discriminate against or endanger a person. In IT the threat is rarely one leak — it is <em>aggregation</em>: harmless-looking data combined into a revealing profile.</p>
<h3>Core data-protection principles</h3>
<ul>
<li><strong>Lawful basis &amp; consent</strong> — collect only with a valid reason; consent must be informed and freely given.</li>
<li><strong>Purpose limitation</strong> — use data only for the purpose stated at collection.</li>
<li><strong>Data minimisation</strong> — collect the least you need; do not hoard.</li>
<li><strong>Security &amp; retention</strong> — protect it, and delete it when no longer needed.</li>
<li><strong>Rights of the subject</strong> — access, correct, delete, and object.</li>
</ul>
<h3>Two legal anchors</h3>
<pre><code>GDPR (EU, 2018)      - consent, subject rights, breach notice,
                       fines up to 4% of global revenue.
NĐ 13/2023 (Vietnam) - defines personal &amp; sensitive data,
                       requires consent, an impact assessment,
                       and breach reporting.
</code></pre>
<div class="callout"><span class="badge">Privacy by design</span> Build protection in from the start — minimise, encrypt, and default to the most private setting — rather than bolting it on after a breach makes the news.</div>`,
    `<span class="eyebrow">ITE303c · Chương 3 · Bài 3.1</span>
<h2>Quyền riêng tư &amp; bảo vệ dữ liệu cá nhân</h2>
<p><strong>Quyền riêng tư</strong> là khả năng kiểm soát thông tin về chính mình. Nó quan trọng vì dữ liệu có thể bị dùng để lập hồ sơ, thao túng, phân biệt đối xử hay gây nguy hiểm cho một người. Trong CNTT, mối đe doạ hiếm khi là một lần rò rỉ — mà là <em>tổng hợp</em>: những dữ liệu tưởng vô hại ghép lại thành hồ sơ lộ liễu.</p>
<h3>Các nguyên tắc bảo vệ dữ liệu cốt lõi</h3>
<ul>
<li><strong>Căn cứ hợp pháp &amp; đồng thuận</strong> — chỉ thu thập khi có lý do chính đáng; đồng thuận phải rõ ràng và tự nguyện.</li>
<li><strong>Giới hạn mục đích</strong> — chỉ dùng dữ liệu đúng mục đích đã nêu khi thu thập.</li>
<li><strong>Tối thiểu hoá dữ liệu</strong> — thu ít nhất mức cần; đừng tích trữ.</li>
<li><strong>An toàn &amp; thời hạn lưu</strong> — bảo vệ dữ liệu, và xoá khi không còn cần.</li>
<li><strong>Quyền của chủ thể</strong> — truy cập, chỉnh sửa, xoá và phản đối.</li>
</ul>
<h3>Hai trụ cột pháp lý</h3>
<pre><code>GDPR (EU, 2018)      - đồng thuận, quyền chủ thể, báo rò rỉ,
                       phạt tới 4% doanh thu toàn cầu.
NĐ 13/2023 (Việt Nam)- định nghĩa dữ liệu cá nhân &amp; nhạy cảm,
                       buộc có đồng thuận, đánh giá tác động,
                       và báo cáo khi có vi phạm.
</code></pre>
<div class="callout"><span class="badge">Riêng tư từ thiết kế</span> Đưa bảo vệ vào ngay từ đầu — tối thiểu hoá, mã hoá, và đặt mặc định ở mức riêng tư nhất — thay vì gắn thêm sau khi một vụ rò rỉ lên báo.</div>`,
  ]]);

const c3q = quiz('ite303c-quiz-3', 'Quiz 3 — Privacy|||Quiz 3 — Quyền riêng tư', [
  { id: 'q1', question: 'Nguyên tắc "tối thiểu hoá dữ liệu" (data minimisation) nghĩa là?', options: ['Thu thập càng nhiều càng tốt để dự phòng', 'Chỉ thu thập lượng dữ liệu ít nhất cần cho mục đích', 'Nén dữ liệu để tiết kiệm ổ đĩa', 'Xoá toàn bộ nhật ký hệ thống'], correctIndex: 1, explanation: 'Tối thiểu hoá: chỉ thu đúng và đủ dữ liệu cần thiết, không tích trữ dư thừa.' },
  { id: 'q2', question: 'Mối đe doạ riêng tư đặc trưng của CNTT thường đến từ?', options: ['Một lần rò rỉ duy nhất', 'Tổng hợp (aggregation) nhiều mẩu dữ liệu tưởng vô hại thành hồ sơ lộ liễu', 'Máy chủ quá nóng', 'Mật khẩu quá dài'], correctIndex: 1, explanation: 'Aggregation ghép các dữ liệu nhỏ lại thành chân dung chi tiết về một người.' },
  { id: 'q3', question: 'Văn bản nào của Việt Nam quy định về bảo vệ dữ liệu cá nhân?', options: ['Nghị định 13/2023/NĐ-CP', 'Luật Giao thông đường bộ', 'GDPR', 'Luật Doanh nghiệp'], correctIndex: 0, explanation: 'Nghị định 13/2023/NĐ-CP quy định bảo vệ dữ liệu cá nhân, đồng thuận và báo cáo vi phạm ở Việt Nam.' },
]);

const c4 = doc('ite303c-4-1-intellectual-property', '4.1 — Intellectual property &amp; open source|||4.1 — Sở hữu trí tuệ &amp; mã nguồn mở',
  'Bản quyền, bằng sáng chế, bí mật thương mại và nhãn hiệu áp dụng cho phần mềm ra sao; giấy phép mã nguồn mở (copyleft GPL vs dễ dãi MIT); đạo văn mã và vi phạm giấy phép.',
  [[
    `<span class="eyebrow">ITE303c · Chapter 4 · Lesson 4.1</span>
<h2>Intellectual property &amp; open source</h2>
<p><strong>Intellectual property (IP)</strong> gives creators temporary control over what they make, to reward and encourage creation. Four kinds matter in software:</p>
<ul>
<li><strong>Copyright</strong> — protects the <em>expression</em> (source code, text, art) automatically. Not the idea, just the way it is written.</li>
<li><strong>Patent</strong> — protects a novel <em>invention/process</em> for a fixed term; controversial for software.</li>
<li><strong>Trade secret</strong> — protects confidential know-how (an algorithm you never publish).</li>
<li><strong>Trademark</strong> — protects names/logos that identify a product.</li>
</ul>
<h3>Open-source licences</h3>
<pre><code>Permissive (MIT, Apache, BSD)
   -&gt; use, modify, close it again; just keep the notice.
Copyleft (GPL)
   -&gt; if you distribute changes, you must share source
      under the same licence ("viral" effect).
No licence at all
   -&gt; default copyright: you have NO right to reuse it.
</code></pre>
<h3>The ethical failures</h3>
<p><strong>Software piracy</strong> (copying paid software), <strong>plagiarism</strong> (passing others' code as your own), and <strong>licence violation</strong> (shipping GPL code inside a closed product) are the common breaches — each both unethical and usually illegal.</p>
<div class="callout"><span class="badge">Read the licence</span> "It is on GitHub" does not mean "free to reuse". Check the LICENSE file; no licence means all rights reserved.</div>`,
    `<span class="eyebrow">ITE303c · Chương 4 · Bài 4.1</span>
<h2>Sở hữu trí tuệ &amp; mã nguồn mở</h2>
<p><strong>Sở hữu trí tuệ (SHTT)</strong> trao cho người sáng tạo quyền kiểm soát tạm thời với sản phẩm của mình, nhằm tưởng thưởng và khuyến khích sáng tạo. Bốn loại quan trọng trong phần mềm:</p>
<ul>
<li><strong>Bản quyền (copyright)</strong> — bảo hộ <em>cách thể hiện</em> (mã nguồn, văn bản, hình ảnh) một cách tự động. Không bảo hộ ý tưởng, chỉ cách viết ra.</li>
<li><strong>Bằng sáng chế (patent)</strong> — bảo hộ một <em>sáng chế/quy trình</em> mới trong thời hạn cố định; gây tranh cãi với phần mềm.</li>
<li><strong>Bí mật thương mại</strong> — bảo hộ bí quyết được giữ kín (một thuật toán bạn không bao giờ công bố).</li>
<li><strong>Nhãn hiệu (trademark)</strong> — bảo hộ tên/logo nhận diện sản phẩm.</li>
</ul>
<h3>Giấy phép mã nguồn mở</h3>
<pre><code>Dễ dãi (MIT, Apache, BSD)
   -&gt; dùng, sửa, đóng lại; chỉ cần giữ dòng ghi công.
Copyleft (GPL)
   -&gt; nếu phát hành bản sửa, PHẢI chia sẻ mã nguồn
      theo cùng giấy phép (hiệu ứng "lây").
Không có giấy phép nào
   -&gt; mặc định bản quyền: bạn KHÔNG có quyền tái sử dụng.
</code></pre>
<h3>Các sai phạm đạo đức</h3>
<p><strong>Vi phạm bản quyền phần mềm</strong> (sao chép phần mềm trả phí), <strong>đạo văn mã</strong> (nhận code người khác là của mình), và <strong>vi phạm giấy phép</strong> (nhét code GPL vào sản phẩm đóng) là các vi phạm phổ biến — vừa phi đạo đức vừa thường là phi pháp.</p>
<div class="callout"><span class="badge">Đọc giấy phép</span> "Có trên GitHub" không có nghĩa "tự do dùng lại". Hãy kiểm tra file LICENSE; không có giấy phép nghĩa là bảo lưu mọi quyền.</div>`,
  ]]);

const c4q = quiz('ite303c-quiz-4', 'Quiz 4 — IP &amp; open source|||Quiz 4 — SHTT &amp; mã nguồn mở', [
  { id: 'q1', question: 'Giấy phép nào buộc bạn phải chia sẻ mã nguồn của bản sửa đổi khi phát hành (copyleft)?', options: ['MIT', 'GPL', 'BSD', 'Apache'], correctIndex: 1, explanation: 'GPL là giấy phép copyleft: phát hành bản sửa thì phải công bố mã nguồn theo cùng giấy phép.' },
  { id: 'q2', question: 'Một kho mã trên GitHub KHÔNG có file LICENSE thì bạn được phép?', options: ['Tự do sao chép và bán lại', 'Không có quyền tái sử dụng — mặc định bảo lưu mọi quyền', 'Dùng nếu ghi công tác giả', 'Dùng cho mục đích thương mại'], correctIndex: 1, explanation: 'Không giấy phép nghĩa là mặc định bản quyền: mọi quyền được bảo lưu, bạn không có quyền dùng lại.' },
  { id: 'q3', question: 'Bản quyền (copyright) bảo hộ điều gì trong phần mềm?', options: ['Ý tưởng và thuật toán trừu tượng', 'Cách thể hiện cụ thể — mã nguồn được viết ra', 'Tên thương hiệu', 'Quy trình sản xuất phần cứng'], correctIndex: 1, explanation: 'Bản quyền bảo hộ cách thể hiện (mã nguồn cụ thể), không bảo hộ ý tưởng phía sau.' },
]);

const c5 = doc('ite303c-5-1-security-cybercrime', '5.1 — Cybersecurity &amp; computer crime|||5.1 — An ninh mạng &amp; tội phạm máy tính',
  'Đạo đức an ninh; tam giác CIA; các loại tội phạm máy tính (xâm nhập, mã độc, lừa đảo); hacker mũ trắng/xám/đen, tiết lộ lỗ hổng có trách nhiệm; ranh giới đạo đức của kiểm thử xâm nhập.',
  [[
    `<span class="eyebrow">ITE303c · Chapter 5 · Lesson 5.1</span>
<h2>Cybersecurity &amp; computer crime</h2>
<p>Security ethics asks: <em>who may access a system, and what may they do with that access?</em> The goal is captured by the <strong>CIA triad</strong>:</p>
<ul>
<li><strong>Confidentiality</strong> — only authorised people can read the data.</li>
<li><strong>Integrity</strong> — data is not altered without authorisation.</li>
<li><strong>Availability</strong> — the system is up for legitimate users.</li>
</ul>
<h3>Categories of computer crime</h3>
<ul>
<li><strong>Unauthorised access</strong> — breaking into systems you may not use.</li>
<li><strong>Malware</strong> — viruses, worms, ransomware.</li>
<li><strong>Fraud &amp; theft</strong> — phishing, identity theft, financial fraud.</li>
<li><strong>Disruption</strong> — denial-of-service attacks.</li>
</ul>
<h3>Hats &amp; responsible disclosure</h3>
<pre><code>White hat - tests WITH permission, reports to fix. Ethical.
Grey hat  - probes WITHOUT permission, then discloses.
            Good intent, but crosses a legal/ethical line.
Black hat - attacks for personal gain. Unethical &amp; criminal.

Responsible disclosure:
  find bug -&gt; tell the vendor privately -&gt; give time to patch
  -&gt; publish only after fix (or after a fair deadline).
</code></pre>
<div class="callout"><span class="badge">Intent is not enough</span> "I only wanted to help" does not make unauthorised access ethical. Permission (a scope, a bug-bounty rule, a contract) is what separates a penetration test from a crime.</div>`,
    `<span class="eyebrow">ITE303c · Chương 5 · Bài 5.1</span>
<h2>An ninh mạng &amp; tội phạm máy tính</h2>
<p>Đạo đức an ninh đặt câu hỏi: <em>ai được truy cập một hệ thống, và được làm gì với quyền đó?</em> Mục tiêu gói trong <strong>tam giác CIA</strong>:</p>
<ul>
<li><strong>Bảo mật (Confidentiality)</strong> — chỉ người được phép mới đọc được dữ liệu.</li>
<li><strong>Toàn vẹn (Integrity)</strong> — dữ liệu không bị sửa đổi trái phép.</li>
<li><strong>Sẵn sàng (Availability)</strong> — hệ thống luôn phục vụ người dùng hợp lệ.</li>
</ul>
<h3>Các loại tội phạm máy tính</h3>
<ul>
<li><strong>Truy cập trái phép</strong> — xâm nhập hệ thống mình không được dùng.</li>
<li><strong>Mã độc</strong> — virus, worm, mã tống tiền (ransomware).</li>
<li><strong>Lừa đảo &amp; trộm cắp</strong> — phishing, đánh cắp danh tính, gian lận tài chính.</li>
<li><strong>Phá hoại</strong> — tấn công từ chối dịch vụ (DoS).</li>
</ul>
<h3>Mũ &amp; tiết lộ có trách nhiệm</h3>
<pre><code>Mũ trắng - kiểm thử CÓ phép, báo để vá. Có đạo đức.
Mũ xám   - dò KHÔNG phép rồi mới tiết lộ.
           Ý tốt, nhưng đã vượt ranh giới pháp lý/đạo đức.
Mũ đen   - tấn công vì tư lợi. Phi đạo đức &amp; phạm pháp.

Tiết lộ có trách nhiệm:
  tìm ra lỗi -&gt; báo riêng cho nhà cung cấp -&gt; cho thời gian vá
  -&gt; chỉ công bố sau khi đã vá (hoặc sau thời hạn hợp lý).
</code></pre>
<div class="callout"><span class="badge">Ý định là chưa đủ</span> "Tôi chỉ muốn giúp" không làm cho việc truy cập trái phép trở nên có đạo đức. Sự cho phép (phạm vi, luật bug-bounty, hợp đồng) mới là ranh giới giữa kiểm thử xâm nhập và tội phạm.</div>`,
  ]]);

const c5q = quiz('ite303c-quiz-5', 'Quiz 5 — Security &amp; crime|||Quiz 5 — An ninh &amp; tội phạm', [
  { id: 'q1', question: 'Tam giác CIA trong an ninh thông tin gồm?', options: ['Chi phí, Tốc độ, Độ tin cậy', 'Bảo mật, Toàn vẹn, Sẵn sàng', 'Mã hoá, Sao lưu, Kiểm toán', 'Client, Internet, Admin'], correctIndex: 1, explanation: 'CIA = Confidentiality (bảo mật), Integrity (toàn vẹn), Availability (sẵn sàng).' },
  { id: 'q2', question: 'Điều gì phân biệt kiểm thử xâm nhập (pentest) có đạo đức với một tội phạm?', options: ['Kỹ năng cao hơn', 'Có sự cho phép/phạm vi được thoả thuận trước', 'Dùng công cụ đắt tiền', 'Thực hiện vào ban đêm'], correctIndex: 1, explanation: 'Sự cho phép (scope, hợp đồng, luật bug-bounty) là ranh giới giữa mũ trắng và phạm pháp.' },
  { id: 'q3', question: 'Tiết lộ có trách nhiệm (responsible disclosure) nghĩa là?', options: ['Công bố lỗ hổng công khai ngay lập tức', 'Báo riêng cho nhà cung cấp, cho thời gian vá rồi mới công bố', 'Bán lỗ hổng cho bên trả giá cao nhất', 'Giữ bí mật mãi mãi'], correctIndex: 1, explanation: 'Báo riêng cho nhà cung cấp, cho thời gian vá, chỉ công bố sau khi vá hoặc sau thời hạn hợp lý.' },
]);

const c6 = doc('ite303c-6-1-free-speech', '6.1 — Free speech, censorship &amp; social media|||6.1 — Tự do ngôn luận, kiểm duyệt &amp; mạng xã hội',
  'Giá trị và giới hạn của tự do ngôn luận trên mạng; kiểm duyệt của nhà nước và của nền tảng; kiểm duyệt nội dung; tin giả, buồng vọng và thuật toán khuếch đại; trách nhiệm của nền tảng.',
  [[
    `<span class="eyebrow">ITE303c · Chapter 6 · Lesson 6.1</span>
<h2>Free speech, censorship &amp; social media</h2>
<p><strong>Free expression</strong> is a core value: it lets people learn, criticise power and organise. But it is not absolute — most societies limit speech that causes direct harm.</p>
<h3>Where free speech ends</h3>
<ul>
<li><strong>Protected</strong> — opinions, criticism, unpopular ideas.</li>
<li><strong>Commonly limited</strong> — incitement to violence, defamation, child sexual abuse material, fraud, credible threats.</li>
</ul>
<h3>Two kinds of censorship</h3>
<pre><code>State censorship    - a government blocks/filters content.
                      Risk: silencing dissent.
Platform moderation - a private company sets &amp; enforces rules.
                      Risk: opaque, inconsistent, at huge scale.
</code></pre>
<h3>The algorithm problem</h3>
<p>Feeds are ranked to maximise <strong>engagement</strong>, and outrage engages. That quietly amplifies <strong>misinformation</strong> and builds <strong>echo chambers</strong> — an ethical harm produced not by any single post but by the ranking system itself. Designers are responsible for what their ranking rewards.</p>
<div class="callout"><span class="badge">Speech vs reach</span> Removing a post limits speech; refusing to <em>amplify</em> it to millions is a different, softer lever. Much of platform ethics is about reach, not just removal.</div>`,
    `<span class="eyebrow">ITE303c · Chương 6 · Bài 6.1</span>
<h2>Tự do ngôn luận, kiểm duyệt &amp; mạng xã hội</h2>
<p><strong>Tự do biểu đạt</strong> là một giá trị cốt lõi: nó cho con người học hỏi, phê phán quyền lực và tổ chức lại. Nhưng nó không tuyệt đối — hầu hết xã hội đều giới hạn phát ngôn gây hại trực tiếp.</p>
<h3>Tự do ngôn luận dừng ở đâu</h3>
<ul>
<li><strong>Được bảo vệ</strong> — quan điểm, phê bình, ý tưởng không được lòng số đông.</li>
<li><strong>Thường bị giới hạn</strong> — kích động bạo lực, phỉ báng, nội dung xâm hại trẻ em, lừa đảo, đe doạ đáng tin.</li>
</ul>
<h3>Hai kiểu kiểm duyệt</h3>
<pre><code>Kiểm duyệt nhà nước - chính quyền chặn/lọc nội dung.
                      Rủi ro: bịt miệng tiếng nói phản biện.
Kiểm duyệt nền tảng - công ty tư nhân đặt &amp; thực thi luật riêng.
                      Rủi ro: mờ ám, thiếu nhất quán, ở quy mô lớn.
</code></pre>
<h3>Vấn đề của thuật toán</h3>
<p>Bảng tin được xếp hạng để tối đa hoá <strong>tương tác</strong>, mà phẫn nộ thì kéo tương tác. Điều đó âm thầm khuếch đại <strong>tin giả</strong> và tạo <strong>buồng vọng</strong> — một tổn hại đạo đức không do một bài đăng đơn lẻ nào, mà do chính hệ thống xếp hạng. Người thiết kế chịu trách nhiệm cho điều mà thuật toán tưởng thưởng.</p>
<div class="callout"><span class="badge">Phát ngôn khác tầm với</span> Gỡ một bài là giới hạn phát ngôn; từ chối <em>khuếch đại</em> nó tới hàng triệu người là một đòn bẩy khác, nhẹ hơn. Phần lớn đạo đức nền tảng nằm ở tầm với, không chỉ ở việc gỡ bỏ.</div>`,
  ]]);

const c6q = quiz('ite303c-quiz-6', 'Quiz 6 — Speech &amp; moderation|||Quiz 6 — Ngôn luận &amp; kiểm duyệt', [
  { id: 'q1', question: 'Vì sao thuật toán xếp hạng theo tương tác lại khuếch đại tin giả?', options: ['Vì máy chủ chậm', 'Vì nội dung gây phẫn nộ tạo nhiều tương tác nên được đẩy lên', 'Vì người dùng yêu cầu', 'Vì thiếu dung lượng lưu trữ'], correctIndex: 1, explanation: 'Tối ưu cho engagement khiến nội dung gây phẫn nộ (thường là tin giả) được khuếch đại.' },
  { id: 'q2', question: 'Loại phát ngôn nào thường KHÔNG được bảo vệ?', options: ['Phê bình chính sách', 'Quan điểm không được lòng số đông', 'Kích động bạo lực và đe doạ đáng tin', 'Ý kiến trái chiều'], correctIndex: 2, explanation: 'Kích động bạo lực, phỉ báng, đe doạ đáng tin... là các giới hạn phổ biến của tự do ngôn luận.' },
  { id: 'q3', question: 'Phân biệt "speech" (phát ngôn) và "reach" (tầm với) có ý nghĩa gì?', options: ['Không có gì khác nhau', 'Từ chối khuếch đại nội dung là đòn bẩy nhẹ hơn so với gỡ bỏ hoàn toàn', 'Tầm với luôn quan trọng hơn nội dung', 'Chỉ nhà nước mới kiểm soát được tầm với'], correctIndex: 1, explanation: 'Gỡ bài giới hạn phát ngôn; giảm khuếch đại là một lựa chọn nhẹ hơn, cốt lõi của đạo đức nền tảng.' },
]);

const c7 = doc('ite303c-7-1-ai-ethics', '7.1 — AI ethics, algorithmic bias &amp; automation|||7.1 — Đạo đức AI, thuật toán thiên lệch &amp; tự động hoá việc làm',
  'Vì sao AI đặt ra vấn đề đạo đức mới; thiên lệch thuật toán từ đâu ra; minh bạch và giải trình (hộp đen); trách nhiệm khi AI gây hại; tác động lên việc làm; các nguyên tắc AI đáng tin cậy.',
  [[
    `<span class="eyebrow">ITE303c · Chapter 7 · Lesson 7.1</span>
<h2>AI ethics, algorithmic bias &amp; automation</h2>
<p>AI systems now make or shape decisions about loans, hiring, policing and health. That raises ethical questions ordinary software does not, because these systems are <em>learned</em>, opaque, and applied at scale.</p>
<h3>Where bias comes from</h3>
<ul>
<li><strong>Biased data</strong> — a model trained on past hiring learns past discrimination.</li>
<li><strong>Biased design</strong> — choice of features and targets encodes assumptions.</li>
<li><strong>Feedback loops</strong> — biased predictions shape future data, deepening the bias.</li>
</ul>
<h3>The core principles</h3>
<pre><code>Fairness        - do not discriminate against protected groups.
Transparency    - be able to explain a decision (not a black box).
Accountability  - a human is answerable when the AI causes harm.
Privacy         - respect the data the model was trained on.
Human oversight - keep a person in the loop for high-stakes calls.
</code></pre>
<h3>Automation &amp; jobs</h3>
<p>Automation raises productivity but displaces workers. The ethical question is not only <em>can</em> we automate a job, but who bears the cost of the transition and who gains the benefit — a question of justice, not only efficiency.</p>
<div class="callout"><span class="badge">Responsibility does not vanish</span> "The algorithm decided" is not a defence. A person or organisation chose to build it, train it and deploy it — and remains accountable for the harm it does.</div>`,
    `<span class="eyebrow">ITE303c · Chương 7 · Bài 7.1</span>
<h2>Đạo đức AI, thuật toán thiên lệch &amp; tự động hoá việc làm</h2>
<p>Các hệ thống AI nay ra quyết định hoặc định hình quyết định về khoản vay, tuyển dụng, trị an và y tế. Điều đó đặt ra những câu hỏi đạo đức mà phần mềm thường không có, vì các hệ thống này được <em>học</em> ra, mờ đục và áp dụng ở quy mô lớn.</p>
<h3>Thiên lệch từ đâu ra</h3>
<ul>
<li><strong>Dữ liệu thiên lệch</strong> — mô hình học từ dữ liệu tuyển dụng cũ sẽ học lại sự phân biệt trong quá khứ.</li>
<li><strong>Thiết kế thiên lệch</strong> — cách chọn đặc trưng và mục tiêu đã mã hoá sẵn các giả định.</li>
<li><strong>Vòng phản hồi</strong> — dự đoán thiên lệch định hình dữ liệu tương lai, làm thiên lệch nặng thêm.</li>
</ul>
<h3>Các nguyên tắc cốt lõi</h3>
<pre><code>Công bằng        - không phân biệt các nhóm được bảo vệ.
Minh bạch        - giải thích được quyết định (không phải hộp đen).
Giải trình       - có con người chịu trách nhiệm khi AI gây hại.
Riêng tư         - tôn trọng dữ liệu dùng để huấn luyện mô hình.
Giám sát con người - giữ người trong vòng lặp cho quyết định hệ trọng.
</code></pre>
<h3>Tự động hoá &amp; việc làm</h3>
<p>Tự động hoá làm tăng năng suất nhưng đẩy người lao động ra rìa. Câu hỏi đạo đức không chỉ là ta <em>có thể</em> tự động hoá một công việc hay không, mà ai gánh chi phí chuyển đổi và ai hưởng lợi — một vấn đề công bằng, không chỉ hiệu quả.</p>
<div class="callout"><span class="badge">Trách nhiệm không biến mất</span> "Do thuật toán quyết định" không phải là lời biện hộ. Một con người hay tổ chức đã chọn xây, huấn luyện và triển khai nó — và vẫn phải chịu trách nhiệm cho tổn hại nó gây ra.</div>`,
  ]]);

const c7q = quiz('ite303c-quiz-7', 'Quiz 7 — AI ethics|||Quiz 7 — Đạo đức AI', [
  { id: 'q1', question: 'Nguồn phổ biến nhất của thiên lệch thuật toán (algorithmic bias) là?', options: ['Máy chủ quá tải', 'Dữ liệu huấn luyện mang sẵn định kiến trong quá khứ', 'Mã nguồn mở', 'Kết nối mạng chậm'], correctIndex: 1, explanation: 'Mô hình học từ dữ liệu lịch sử thiên lệch sẽ tái tạo lại sự phân biệt đó.' },
  { id: 'q2', question: 'Câu "Do thuật toán quyết định, không ai chịu trách nhiệm" là?', options: ['Một lời biện hộ hợp lệ về đạo đức', 'Không hợp lệ — người/tổ chức xây và triển khai AI vẫn phải giải trình', 'Đúng nếu là hộp đen', 'Đúng nếu AI học sâu'], correctIndex: 1, explanation: 'Nguyên tắc giải trình (accountability): luôn có con người chịu trách nhiệm cho hệ thống họ triển khai.' },
  { id: 'q3', question: 'Vấn đề đạo đức của tự động hoá việc làm chủ yếu là?', options: ['Máy tính tốn điện', 'Ai gánh chi phí chuyển đổi và ai hưởng lợi — vấn đề công bằng', 'Phần mềm khó cài đặt', 'Robot chạy chậm'], correctIndex: 1, explanation: 'Không chỉ là "có thể tự động hoá không" mà là phân bổ chi phí và lợi ích công bằng ra sao.' },
]);

const c8 = doc('ite303c-8-1-professional-responsibility', '8.1 — Professional responsibility, whistleblowing &amp; Vietnam law|||8.1 — Trách nhiệm nghề nghiệp, tố giác &amp; pháp lý Việt Nam',
  'Trách nhiệm của người làm CNTT với chủ, khách hàng và công chúng; khi nào và tố giác (whistleblowing) thế nào cho có đạo đức; một khung ra quyết định đạo đức; bối cảnh pháp luật CNTT ở Việt Nam.',
  [[
    `<span class="eyebrow">ITE303c · Chapter 8 · Lesson 8.1</span>
<h2>Professional responsibility, whistleblowing &amp; the Vietnam legal context</h2>
<p>An IT professional owes duties to their <strong>employer</strong>, their <strong>client</strong> and the <strong>public</strong> — and these sometimes conflict. Handling that conflict well is the mark of a professional.</p>
<h3>Whistleblowing — a last resort, done right</h3>
<ul>
<li><strong>When</strong> — there is serious, well-evidenced harm to the public that internal channels failed to fix.</li>
<li><strong>How</strong> — raise it internally first; document facts; escalate proportionally; go external only when nothing else works.</li>
<li><strong>Why care</strong> — it is high-risk for the individual, so it must be a considered ethical act, not an impulsive leak.</li>
</ul>
<h3>A decision framework</h3>
<pre><code>1. Get the facts   - what is actually happening?
2. Stakeholders    - who is affected, and how?
3. Options         - list realistic actions.
4. Test each       - apply utilitarian / duty / virtue lenses
                     and the ACM/IEEE code.
5. Decide &amp; act    - choose, then document your reasoning.
6. Reflect         - what would prevent this next time?
</code></pre>
<h3>The Vietnam legal context</h3>
<p>Key laws frame IT work in Vietnam: <strong>Luật An toàn thông tin mạng (2015)</strong>, <strong>Luật An ninh mạng (2018)</strong>, <strong>Nghị định 13/2023</strong> on personal data, and the <strong>Luật Sở hữu trí tuệ</strong>. Ethics and law overlap but are not identical — aim to satisfy both.</p>
<div class="callout"><span class="badge">Document your reasoning</span> The best protection — professionally and legally — is a clear, dated record of the facts you saw, the options you weighed and why you chose as you did.</div>`,
    `<span class="eyebrow">ITE303c · Chương 8 · Bài 8.1</span>
<h2>Trách nhiệm nghề nghiệp, tố giác &amp; bối cảnh pháp lý Việt Nam</h2>
<p>Người làm CNTT có bổn phận với <strong>chủ lao động</strong>, với <strong>khách hàng</strong> và với <strong>công chúng</strong> — và đôi khi chúng xung đột. Xử lý xung đột đó cho khéo là dấu hiệu của người làm nghề.</p>
<h3>Tố giác (whistleblowing) — biện pháp cuối, làm cho đúng</h3>
<ul>
<li><strong>Khi nào</strong> — có tổn hại nghiêm trọng, đủ bằng chứng cho công chúng mà các kênh nội bộ đã không khắc phục.</li>
<li><strong>Thế nào</strong> — nêu nội bộ trước; ghi lại sự việc; leo thang tương xứng; chỉ ra ngoài khi mọi cách khác thất bại.</li>
<li><strong>Vì sao thận trọng</strong> — rủi ro cao cho cá nhân, nên phải là hành vi đạo đức có cân nhắc, không phải rò rỉ bốc đồng.</li>
</ul>
<h3>Một khung ra quyết định</h3>
<pre><code>1. Nắm sự việc  - chuyện gì đang thực sự diễn ra?
2. Bên liên quan- ai bị ảnh hưởng, và thế nào?
3. Phương án    - liệt kê các hành động khả thi.
4. Kiểm từng cái- soi qua lăng kính vị lợi / bổn phận / đức hạnh
                  và bộ quy tắc ACM/IEEE.
5. Quyết &amp; làm  - chọn, rồi ghi lại lập luận của bạn.
6. Nhìn lại     - điều gì ngăn được việc này lần sau?
</code></pre>
<h3>Bối cảnh pháp lý Việt Nam</h3>
<p>Các luật then chốt định khung công việc CNTT ở Việt Nam: <strong>Luật An toàn thông tin mạng (2015)</strong>, <strong>Luật An ninh mạng (2018)</strong>, <strong>Nghị định 13/2023</strong> về dữ liệu cá nhân, và <strong>Luật Sở hữu trí tuệ</strong>. Đạo đức và luật chồng lấn nhưng không đồng nhất — hãy hướng tới thoả mãn cả hai.</p>
<div class="callout"><span class="badge">Ghi lại lập luận</span> Sự bảo vệ tốt nhất — cả về nghề lẫn pháp lý — là một hồ sơ rõ ràng, có ngày tháng về sự việc bạn thấy, các phương án bạn cân nhắc và vì sao bạn chọn như vậy.</div>`,
  ]]);

const c8q = quiz('ite303c-quiz-8', 'Quiz 8 — Responsibility &amp; law|||Quiz 8 — Trách nhiệm &amp; pháp lý', [
  { id: 'q1', question: 'Tố giác (whistleblowing) có đạo đức nên được coi là?', options: ['Bước đầu tiên, làm ngay khi thấy sai', 'Biện pháp cuối cùng, sau khi các kênh nội bộ đã thất bại', 'Việc không bao giờ nên làm', 'Cách trả thù cấp trên'], correctIndex: 1, explanation: 'Whistleblowing là biện pháp cuối: nêu nội bộ trước, có bằng chứng, chỉ ra ngoài khi mọi cách khác thất bại.' },
  { id: 'q2', question: 'Trong khung ra quyết định đạo đức, bước đầu tiên nên là?', options: ['Quyết định ngay theo cảm tính', 'Nắm rõ sự việc — chuyện gì đang thực sự diễn ra', 'Công bố ra công chúng', 'Từ chức'], correctIndex: 1, explanation: 'Nắm sự việc trước, rồi mới xác định bên liên quan, liệt kê phương án và kiểm qua các lăng kính đạo đức.' },
  { id: 'q3', question: 'Văn bản nào KHÔNG thuộc khung pháp lý CNTT của Việt Nam nêu trong bài?', options: ['Luật An ninh mạng 2018', 'Luật An toàn thông tin mạng 2015', 'Nghị định 13/2023 về dữ liệu cá nhân', 'GDPR của Liên minh châu Âu'], correctIndex: 3, explanation: 'GDPR là luật của EU; khung pháp lý CNTT Việt Nam gồm Luật An ninh mạng, An toàn thông tin mạng, NĐ 13/2023 và Luật SHTT.' },
]);

export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    courseCode: 'ITE303c',
    slug: 'ite303c-ethics-in-it',
    title: 'Ethics in IT',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ITE303c.webp',
    shortDescription: 'Ethics in IT — moral theories (utilitarian, deontology, virtue), ACM/IEEE codes, privacy, IP & open source, cybercrime, free speech, AI ethics & bias, professional responsibility in Vietnam. Bilingual, with case frameworks & quizzes.|||Đạo đức trong CNTT — lý thuyết đạo đức, quy tắc ACM/IEEE, quyền riêng tư, sở hữu trí tuệ & mã nguồn mở, tội phạm mạng, tự do ngôn luận, đạo đức AI & thiên lệch, trách nhiệm nghề nghiệp ở Việt Nam. Song ngữ, có khung tình huống & quiz.',
    description: 'Môn <strong>ITE303c — Ethics in IT</strong> (Đạo đức trong CNTT, kỳ 6, ngành Khoa học Máy tính) dạy cách <strong>nhận diện, phân tích và bảo vệ</strong> các quyết định đạo đức trong công nghệ. Từ <strong>lý thuyết đạo đức</strong> (vị lợi, nghĩa vụ luận, đức hạnh) → <strong>quy tắc nghề nghiệp ACM/IEEE</strong> → <strong>quyền riêng tư &amp; bảo vệ dữ liệu</strong> → <strong>sở hữu trí tuệ &amp; mã nguồn mở</strong> → <strong>an ninh mạng &amp; tội phạm máy tính</strong> → <strong>tự do ngôn luận &amp; kiểm duyệt</strong> → <strong>đạo đức AI &amp; thuật toán thiên lệch</strong> → <strong>trách nhiệm nghề nghiệp, tố giác &amp; pháp lý Việt Nam</strong>. Bám giáo trình (Quinn, Tavani, Reynolds, ACM Code), song ngữ, có khung phân tích tình huống và quiz mỗi chương.',
    whatYouLearn: 'Ba trường phái đạo đức (vị lợi/nghĩa vụ luận/đức hạnh) và cách lập luận một tình huống; Bộ Quy tắc ACM &amp; tám nguyên tắc IEEE/ACM; nguyên tắc bảo vệ dữ liệu (đồng thuận, tối thiểu hoá, giới hạn mục đích), GDPR &amp; NĐ 13/2023; bản quyền/sáng chế/bí mật thương mại &amp; giấy phép mã nguồn mở (GPL vs MIT); tam giác CIA, tội phạm máy tính &amp; tiết lộ có trách nhiệm; tự do ngôn luận, kiểm duyệt &amp; khuếch đại thuật toán; thiên lệch AI, minh bạch, giải trình &amp; tự động hoá việc làm; whistleblowing, khung ra quyết định đạo đức &amp; pháp luật CNTT Việt Nam.',
    requirements: 'Không cần nền kỹ thuật sâu. Nên có hiểu biết cơ bản về cách hệ thống phần mềm và dữ liệu vận hành để soi các tình huống thực tế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách Quinn/Tavani/Reynolds, ACM/IEEE Code, luật Việt Nam.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Đạo đức CNTT là gì, khác luật ra sao, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Lý thuyết đạo đức|||Chapter 1 — Moral theories', description: 'Vị lợi, nghĩa vụ luận, đức hạnh; soi một tình huống.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quy tắc nghề nghiệp|||Chapter 2 — Professional codes', description: 'Bộ Quy tắc ACM & tám nguyên tắc IEEE/ACM.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Quyền riêng tư & dữ liệu|||Chapter 3 — Privacy & data', description: 'Nguyên tắc bảo vệ dữ liệu, GDPR, NĐ 13/2023.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Sở hữu trí tuệ|||Chapter 4 — Intellectual property', description: 'Bản quyền, sáng chế, giấy phép mã nguồn mở.', lessons: [c4, c4q] },
    { title: 'Chương 5 — An ninh & tội phạm|||Chapter 5 — Security & crime', description: 'Tam giác CIA, tội phạm máy tính, tiết lộ có trách nhiệm.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Ngôn luận & kiểm duyệt|||Chapter 6 — Speech & moderation', description: 'Tự do ngôn luận, kiểm duyệt, thuật toán khuếch đại.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Đạo đức AI|||Chapter 7 — AI ethics', description: 'Thiên lệch thuật toán, minh bạch, giải trình, tự động hoá.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Trách nhiệm & pháp lý|||Chapter 8 — Responsibility & law', description: 'Tố giác, khung ra quyết định, pháp luật CNTT Việt Nam.', lessons: [c8, c8q] },
  ],
};
