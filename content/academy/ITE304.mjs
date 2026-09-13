/**
 * ITE304 — Law and Ethics in Digital Technology. Ngành Chuyển đổi số (FPTU).
 * Khung chất lượng (8 chương): đạo đức nghề IT (ACM/IEEE), quyền riêng tư &
 * dữ liệu cá nhân (GDPR, NĐ 13/2023), an ninh mạng & pháp lý (Luật ANM 2018),
 * sở hữu trí tuệ số, giao dịch & hợp đồng điện tử, đạo đức AI, nội dung số &
 * trách nhiệm nền tảng, nghề nghiệp & tuân thủ. Song ngữ + điều luật + vụ việc.
 * Giữ NGUYÊN slug/semester/courseCode/thumb(v3). ⚠️ KHÔNG backtick/${; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('ite304-0-1-overview', 'Course overview: Law & ethics in digital technology|||Tổng quan: Luật & đạo đức trong công nghệ số',
  'Vì sao dân công nghệ phải học luật và đạo đức; hai nguồn chuẩn (chuẩn mực nghề quốc tế ACM/IEEE + luật Việt Nam); lộ trình 8 chương và 4 bước tự học.',
  [[
    `<span class="eyebrow">ITE304 · Lesson 0.1 · Overview</span>
<h2>Law &amp; ethics in digital technology</h2>
<p class="lead">Code that ships touches real people — their data, their money, their reputation. This course gives a digital-transformation professional the two things needed to act responsibly: the <strong>ethical judgment</strong> to ask whether something <em>should</em> be built, and the <strong>legal knowledge</strong> of what the law in Vietnam and abroad requires.</p>
<h3>Two sources of the rules</h3>
<ul>
<li><strong>Professional ethics</strong> — the <strong>ACM/IEEE Code of Ethics</strong>: put the public good first, avoid harm, be honest, respect privacy.</li>
<li><strong>The law</strong> — in Vietnam: the <strong>Law on Cybersecurity 2018</strong>, the <strong>Law on E-Transactions</strong>, the <strong>Law on Intellectual Property</strong>, and <strong>Decree 13/2023</strong> on personal data protection; abroad the EU <strong>GDPR</strong> sets the global benchmark.</li>
</ul>
<h3>Ethics vs. law</h3>
<p>They are not the same. Something can be <em>legal but unethical</em> (dark patterns that trick users) or <em>ethical but not yet regulated</em> (much of AI). A professional needs both lenses.</p>
<h3>Roadmap (8 chapters)</h3>
<p>Ethics &amp; the ACM/IEEE code → privacy &amp; personal data (GDPR, Decree 13) → cybersecurity law → digital intellectual property → e-transactions &amp; contracts → AI ethics → digital content &amp; platform responsibility → professional duty &amp; compliance. Bilingual, each chapter with the governing law and a real case.</p>`,
    `<span class="eyebrow">ITE304 · Bài 0.1 · Tổng quan</span>
<h2>Luật &amp; đạo đức trong công nghệ số</h2>
<p class="lead">Sản phẩm phần mềm chạm tới người thật — dữ liệu, tiền bạc, danh dự của họ. Môn này trang bị cho người làm chuyển đổi số hai thứ để hành xử có trách nhiệm: <strong>khả năng phán xét đạo đức</strong> để tự hỏi có <em>nên</em> làm điều đó không, và <strong>hiểu biết pháp lý</strong> về những gì luật Việt Nam và quốc tế yêu cầu.</p>
<h3>Hai nguồn của luật chơi</h3>
<ul>
<li><strong>Đạo đức nghề nghiệp</strong> — <strong>Bộ quy tắc đạo đức ACM/IEEE</strong>: đặt lợi ích công cộng lên trước, tránh gây hại, trung thực, tôn trọng quyền riêng tư.</li>
<li><strong>Pháp luật</strong> — tại Việt Nam: <strong>Luật An ninh mạng 2018</strong>, <strong>Luật Giao dịch điện tử</strong>, <strong>Luật Sở hữu trí tuệ</strong>, và <strong>Nghị định 13/2023</strong> về bảo vệ dữ liệu cá nhân; ở quốc tế, <strong>GDPR</strong> của EU đặt ra chuẩn mực toàn cầu.</li>
</ul>
<h3>Đạo đức khác pháp luật</h3>
<p>Hai thứ không đồng nhất. Có thứ <em>hợp pháp nhưng phi đạo đức</em> (mẫu thiết kế đánh lừa người dùng) hoặc <em>hợp đạo đức nhưng chưa có luật</em> (phần lớn lĩnh vực AI). Người làm nghề cần cả hai lăng kính.</p>
<h3>Lộ trình (8 chương)</h3>
<p>Đạo đức &amp; bộ quy tắc ACM/IEEE → quyền riêng tư &amp; dữ liệu cá nhân (GDPR, NĐ 13) → luật an ninh mạng → sở hữu trí tuệ số → giao dịch &amp; hợp đồng điện tử → đạo đức AI → nội dung số &amp; trách nhiệm nền tảng → trách nhiệm nghề nghiệp &amp; tuân thủ. Song ngữ, mỗi chương gắn với điều luật và một vụ việc thật.</p>`,
  ]]);

const c1 = doc('ite304-1-1-ethics', '1.1 — Digital technology ethics|||1.1 — Đạo đức công nghệ số',
  'Đạo đức nghề IT; bộ quy tắc ACM/IEEE (7 nguyên tắc chính); phân biệt đạo đức và pháp luật; tình huống đạo đức và vụ Volkswagen/Therac-25.',
  [[
    `<span class="eyebrow">ITE304 · Chapter 1 · Lesson 1.1</span>
<h2>Digital technology ethics</h2>
<h3>Why a code of ethics</h3>
<p>Software engineers hold power the public cannot check: only they know what the code really does. A <strong>code of ethics</strong> is the profession promising to use that power for good.</p>
<h3>The ACM/IEEE code — core principles</h3>
<ul>
<li><strong>Public</strong> — act in the public interest above all.</li>
<li><strong>Client &amp; employer</strong> — serve them without harming the public.</li>
<li><strong>Product</strong> — meet professional standards of quality.</li>
<li><strong>Judgment</strong> — stay honest and independent.</li>
<li><strong>Colleagues &amp; self</strong> — be fair, and keep learning.</li>
</ul>
<pre><code>Ethics vs law:
  Legal + ethical    -> normal good practice
  Legal but unethical-> dark patterns, addictive design
  Illegal but common -> pirating dev tools "to learn"
  A code of ethics judges the second column; law only the third.
</code></pre>
<div class="callout"><span class="badge">Real case</span> In the <strong>Volkswagen</strong> emissions scandal (2015) engineers wrote software to detect the lab test and cheat it. It was profitable and hidden — and a textbook violation of the duty to the <em>public</em>. In the <strong>Therac-25</strong> case, a race condition in medical software delivered lethal radiation doses: a reminder that quality is an ethical obligation, not only a technical one.</div>`,
    `<span class="eyebrow">ITE304 · Chương 1 · Bài 1.1</span>
<h2>Đạo đức công nghệ số</h2>
<h3>Vì sao cần bộ quy tắc đạo đức</h3>
<p>Kỹ sư phần mềm nắm một quyền lực mà công chúng khó kiểm chứng: chỉ họ biết đoạn mã thực sự làm gì. Một <strong>bộ quy tắc đạo đức</strong> là lời hứa của nghề rằng sẽ dùng quyền lực đó cho điều tốt.</p>
<h3>Bộ quy tắc ACM/IEEE — nguyên tắc cốt lõi</h3>
<ul>
<li><strong>Công chúng</strong> — hành động vì lợi ích công cộng lên trên hết.</li>
<li><strong>Khách hàng &amp; chủ lao động</strong> — phục vụ họ nhưng không hại công chúng.</li>
<li><strong>Sản phẩm</strong> — đạt chuẩn chất lượng nghề nghiệp.</li>
<li><strong>Phán xét</strong> — giữ trung thực và độc lập.</li>
<li><strong>Đồng nghiệp &amp; bản thân</strong> — công bằng, và học hỏi không ngừng.</li>
</ul>
<pre><code>Đạo đức và pháp luật:
  Hợp pháp + hợp đạo đức  -> thực hành tốt bình thường
  Hợp pháp nhưng phi đạo đức -> mẫu đánh lừa, thiết kế gây nghiện
  Phạm luật nhưng phổ biến -> bẻ khoá công cụ "để học"
  Bộ quy tắc xét cột thứ hai; pháp luật chỉ xử cột thứ ba.
</code></pre>
<div class="callout"><span class="badge">Vụ việc thật</span> Trong bê bối khí thải <strong>Volkswagen</strong> (2015), kỹ sư viết phần mềm nhận diện bài kiểm định trong phòng thí nghiệm rồi gian lận. Nó sinh lời và được giấu kín — một ví dụ điển hình vi phạm nghĩa vụ với <em>công chúng</em>. Trong vụ <strong>Therac-25</strong>, một lỗi tranh chấp luồng trong phần mềm y tế phát liều xạ trị chết người: nhắc rằng chất lượng là nghĩa vụ đạo đức, không chỉ là chuyện kỹ thuật.</div>`,
  ]]);

const c1q = quiz('ite304-quiz-1', 'Quiz 1 — Ethics|||Quiz 1 — Đạo đức', [
  { id: 'q1', question: 'Theo bộ quy tắc ACM/IEEE, lợi ích nào đặt LÊN TRÊN hết?|||In the ACM/IEEE code, whose interest comes FIRST?', options: ['Chủ lao động|||The employer', 'Công chúng|||The public', 'Cổ đông|||Shareholders', 'Bản thân kỹ sư|||The engineer'], correctIndex: 1, explanation: 'Nguyên tắc "Public": hành động vì lợi ích công cộng lên trên hết.' },
  { id: 'q2', question: 'Thiết kế "đánh lừa người dùng" (dark pattern) hợp pháp nhưng...|||A dark pattern is legal but...', options: ['cũng hợp đạo đức|||also ethical', 'phi đạo đức|||unethical', 'là tội hình sự|||a criminal offence', 'bắt buộc phải làm|||mandatory'], correctIndex: 1, explanation: 'Có thứ hợp pháp mà vẫn phi đạo đức — bộ quy tắc xét đúng khoảng đó.' },
  { id: 'q3', question: 'Vụ Volkswagen 2015 vi phạm chủ yếu nghĩa vụ với ai?|||The 2015 Volkswagen case chiefly violated a duty to whom?', options: ['Đồng nghiệp|||Colleagues', 'Công chúng|||The public', 'Nhà cung cấp|||Suppliers', 'Bản thân|||Self'], correctIndex: 1, explanation: 'Phần mềm gian lận khí thải gây hại cho công chúng và môi trường.' },
]);

const c2 = doc('ite304-2-1-privacy', '2.1 — Privacy & personal data|||2.1 — Quyền riêng tư & dữ liệu cá nhân',
  'Quyền riêng tư là gì; GDPR (đồng ý, mục đích, tối thiểu hoá, quyền của chủ thể); NĐ 13/2023 của Việt Nam; vòng đời thu thập/xử lý dữ liệu; vụ phạt Google.',
  [[
    `<span class="eyebrow">ITE304 · Chapter 2 · Lesson 2.1</span>
<h2>Privacy &amp; personal data</h2>
<h3>What privacy protects</h3>
<p><strong>Personal data</strong> is any information about an identifiable person — name, location, IP address, health, browsing history. Privacy is that person's right to control who holds it and why.</p>
<h3>GDPR principles (the global benchmark)</h3>
<ul>
<li><strong>Lawful basis &amp; consent</strong> — you need a legal reason (often freely-given consent) to process data.</li>
<li><strong>Purpose limitation</strong> — collect it for a stated purpose, do not reuse it for another.</li>
<li><strong>Data minimisation</strong> — take only what you truly need.</li>
<li><strong>Data-subject rights</strong> — access, correction, erasure (the right to be forgotten), portability.</li>
</ul>
<h3>Vietnam — Decree 13/2023</h3>
<p><strong>Decree 13/2023/ND-CP</strong> is Vietnam first comprehensive personal-data rule. It requires consent, a lawful purpose, protection of <em>sensitive</em> data (health, biometrics, beliefs), and an impact assessment for large processing — closely echoing GDPR.</p>
<pre><code>Data lifecycle:
  Collect (consent + purpose) -> Store (secure, minimal)
  -> Use (only the stated purpose) -> Share (only with basis)
  -> Delete (when purpose ends / on request)
</code></pre>
<div class="callout"><span class="badge">Real case</span> France fined <strong>Google 50 million EUR</strong> under GDPR (2019) for not clearly telling users how their data fed ad personalisation and for burying consent. Lesson: consent must be informed and specific, not hidden in a wall of text.</div>`,
    `<span class="eyebrow">ITE304 · Chương 2 · Bài 2.1</span>
<h2>Quyền riêng tư &amp; dữ liệu cá nhân</h2>
<h3>Quyền riêng tư bảo vệ điều gì</h3>
<p><strong>Dữ liệu cá nhân</strong> là mọi thông tin về một người có thể nhận dạng — tên, vị trí, địa chỉ IP, sức khoẻ, lịch sử duyệt web. Quyền riêng tư là quyền của người đó kiểm soát ai giữ dữ liệu và để làm gì.</p>
<h3>Nguyên tắc GDPR (chuẩn mực toàn cầu)</h3>
<ul>
<li><strong>Căn cứ pháp lý &amp; sự đồng ý</strong> — cần lý do hợp pháp (thường là đồng ý tự nguyện) để xử lý dữ liệu.</li>
<li><strong>Giới hạn mục đích</strong> — thu thập cho một mục đích đã nêu, không tái sử dụng cho mục đích khác.</li>
<li><strong>Tối thiểu hoá dữ liệu</strong> — chỉ lấy đúng thứ thật sự cần.</li>
<li><strong>Quyền của chủ thể</strong> — truy cập, chỉnh sửa, xoá (quyền được lãng quên), chuyển dữ liệu.</li>
</ul>
<h3>Việt Nam — Nghị định 13/2023</h3>
<p><strong>Nghị định 13/2023/NĐ-CP</strong> là quy định toàn diện đầu tiên của Việt Nam về dữ liệu cá nhân. Nó đòi sự đồng ý, mục đích hợp pháp, bảo vệ dữ liệu <em>nhạy cảm</em> (sức khoẻ, sinh trắc học, tín ngưỡng), và đánh giá tác động khi xử lý quy mô lớn — bám sát tinh thần GDPR.</p>
<pre><code>Vòng đời dữ liệu:
  Thu thập (đồng ý + mục đích) -> Lưu trữ (an toàn, tối thiểu)
  -> Sử dụng (đúng mục đích đã nêu) -> Chia sẻ (chỉ khi có căn cứ)
  -> Xoá (khi hết mục đích / khi được yêu cầu)
</code></pre>
<div class="callout"><span class="badge">Vụ việc thật</span> Pháp phạt <strong>Google 50 triệu EUR</strong> theo GDPR (2019) vì không nói rõ dữ liệu người dùng được dùng cho quảng cáo cá nhân hoá thế nào, và vì chôn phần đồng ý. Bài học: sự đồng ý phải rõ ràng và cụ thể, không giấu trong một bức tường chữ.</div>`,
  ]]);

const c2q = quiz('ite304-quiz-2', 'Quiz 2 — Privacy & data|||Quiz 2 — Riêng tư & dữ liệu', [
  { id: 'q1', question: 'Nguyên tắc "tối thiểu hoá dữ liệu" nghĩa là?|||"Data minimisation" means?', options: ['Lấy càng nhiều càng tốt|||Collect as much as possible', 'Chỉ lấy đúng thứ thật sự cần|||Collect only what is truly needed', 'Xoá mọi log|||Delete all logs', 'Mã hoá mọi thứ|||Encrypt everything'], correctIndex: 1, explanation: 'Chỉ thu thập dữ liệu thật sự cần cho mục đích đã nêu.' },
  { id: 'q2', question: 'Văn bản nào là quy định dữ liệu cá nhân toàn diện đầu tiên của Việt Nam?|||Which is Vietnam first comprehensive personal-data rule?', options: ['Luật An ninh mạng 2018|||Law on Cybersecurity 2018', 'Nghị định 13/2023|||Decree 13/2023', 'GDPR', 'Luật SHTT|||IP Law'], correctIndex: 1, explanation: 'Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.' },
  { id: 'q3', question: 'Quyền "được lãng quên" (right to be forgotten) cho phép chủ thể?|||The "right to be forgotten" lets a person?', options: ['Bán dữ liệu của mình|||Sell their own data', 'Yêu cầu xoá dữ liệu cá nhân|||Request erasure of their data', 'Đổi mật khẩu|||Change password', 'Tắt cookie|||Disable cookies'], correctIndex: 1, explanation: 'GDPR trao quyền yêu cầu xoá dữ liệu cá nhân của mình.' },
]);

const c3 = doc('ite304-3-1-cybersecurity-law', '3.1 — Cybersecurity & the law|||3.1 — An ninh mạng & pháp lý',
  'Luật An ninh mạng VN 2018 (nghĩa vụ nhà cung cấp, lưu trữ dữ liệu trong nước); tội phạm mạng và Bộ luật Hình sự; trách nhiệm pháp lý khi rò rỉ; vụ tấn công thật.',
  [[
    `<span class="eyebrow">ITE304 · Chapter 3 · Lesson 3.1</span>
<h2>Cybersecurity &amp; the law</h2>
<h3>Vietnam Law on Cybersecurity 2018</h3>
<p>The <strong>Law on Cybersecurity (2018)</strong> and its decrees set duties for platforms and service providers operating in Vietnam:</p>
<ul>
<li><strong>Data localisation</strong> — certain providers must store defined Vietnamese-user data in-country and may need a local presence.</li>
<li><strong>Cooperation</strong> — remove unlawful content and provide information to authorities on lawful request.</li>
<li><strong>Protection</strong> — secure systems and report serious incidents.</li>
</ul>
<h3>Cybercrime</h3>
<p>Vietnam <strong>Penal Code</strong> criminalises illegal access, spreading malware, and data theft. Elsewhere the same acts fall under laws like the US <strong>Computer Fraud and Abuse Act</strong>. Unauthorised access is a crime even if nothing is damaged.</p>
<pre><code>Duty of care after a breach:
  Contain -> Assess what data leaked
  -> Notify authority + affected users (as the law requires)
  -> Remediate + document
  Hiding a breach can turn a technical failure into legal liability.
</code></pre>
<div class="callout"><span class="badge">Real case</span> <strong>Uber</strong> concealed a 2016 breach exposing 57 million records and paid the attackers to stay quiet; the cover-up, not only the breach, brought regulatory penalties and a guilty plea from an executive. Reporting obligations exist precisely so incidents are not buried.</div>`,
    `<span class="eyebrow">ITE304 · Chương 3 · Bài 3.1</span>
<h2>An ninh mạng &amp; pháp lý</h2>
<h3>Luật An ninh mạng Việt Nam 2018</h3>
<p><strong>Luật An ninh mạng (2018)</strong> và các nghị định hướng dẫn đặt ra nghĩa vụ cho nền tảng và nhà cung cấp dịch vụ hoạt động tại Việt Nam:</p>
<ul>
<li><strong>Lưu trữ dữ liệu trong nước</strong> — một số nhà cung cấp phải lưu dữ liệu người dùng Việt Nam theo quy định ở trong nước và có thể phải đặt chi nhánh.</li>
<li><strong>Phối hợp</strong> — gỡ nội dung vi phạm và cung cấp thông tin cho cơ quan chức năng khi có yêu cầu hợp pháp.</li>
<li><strong>Bảo vệ</strong> — bảo đảm an toàn hệ thống và báo cáo sự cố nghiêm trọng.</li>
</ul>
<h3>Tội phạm mạng</h3>
<p><strong>Bộ luật Hình sự</strong> Việt Nam hình sự hoá truy cập trái phép, phát tán mã độc và trộm cắp dữ liệu. Ở nước ngoài, cùng hành vi bị xử theo luật như <strong>Computer Fraud and Abuse Act</strong> của Mỹ. Truy cập trái phép là tội ngay cả khi không gây hư hại.</p>
<pre><code>Nghĩa vụ cẩn trọng sau sự cố rò rỉ:
  Cô lập -> Đánh giá dữ liệu nào bị lộ
  -> Thông báo cơ quan + người bị ảnh hưởng (theo luật)
  -> Khắc phục + lập hồ sơ
  Che giấu sự cố có thể biến lỗi kỹ thuật thành trách nhiệm pháp lý.
</code></pre>
<div class="callout"><span class="badge">Vụ việc thật</span> <strong>Uber</strong> che giấu vụ rò rỉ 2016 làm lộ 57 triệu bản ghi và trả tiền cho kẻ tấn công để im lặng; chính việc che giấu, không chỉ vụ rò rỉ, đã dẫn tới chế tài và một lãnh đạo nhận tội. Nghĩa vụ báo cáo tồn tại đúng để sự cố không bị chôn giấu.</div>`,
  ]]);

const c3q = quiz('ite304-quiz-3', 'Quiz 3 — Cybersecurity law|||Quiz 3 — Luật an ninh mạng', [
  { id: 'q1', question: 'Luật An ninh mạng VN 2018 có yêu cầu nào về dữ liệu?|||What does Vietnam Law on Cybersecurity 2018 require about data?', options: ['Xoá toàn bộ dữ liệu sau 30 ngày|||Delete all data after 30 days', 'Lưu trữ một số dữ liệu người dùng trong nước|||Store certain user data in-country', 'Công khai mọi dữ liệu|||Publish all data', 'Cấm mã hoá|||Ban encryption'], correctIndex: 1, explanation: 'Luật đặt nghĩa vụ lưu trữ dữ liệu (localisation) với một số nhà cung cấp.' },
  { id: 'q2', question: 'Truy cập trái phép vào hệ thống, dù không gây hư hại, thì?|||Unauthorised access with no damage is?', options: ['Không sao|||Fine', 'Vẫn có thể là tội|||Still can be a crime', 'Chỉ vi phạm hợp đồng|||Only a contract breach', 'Được khuyến khích|||Encouraged'], correctIndex: 1, explanation: 'Truy cập trái phép bị hình sự hoá kể cả khi chưa gây thiệt hại.' },
  { id: 'q3', question: 'Vụ Uber 2016 bị phạt nặng thêm chủ yếu vì?|||Uber 2016 drew extra penalties mainly for?', options: ['Báo cáo quá nhanh|||Reporting too fast', 'Che giấu sự cố rò rỉ|||Concealing the breach', 'Mã hoá quá mạnh|||Encrypting too strongly', 'Xoá dữ liệu|||Deleting data'], correctIndex: 1, explanation: 'Che giấu và trả tiền cho kẻ tấn công biến sự cố thành trách nhiệm pháp lý.' },
]);

const c4 = doc('ite304-4-1-intellectual-property', '4.1 — Digital intellectual property|||4.1 — Sở hữu trí tuệ số',
  'Bản quyền phần mềm; giấy phép (proprietary, phần mềm tự do/mã nguồn mở, copyleft GPL vs permissive MIT); bằng sáng chế phần mềm; vụ Oracle v Google về API Java.',
  [[
    `<span class="eyebrow">ITE304 · Chapter 4 · Lesson 4.1</span>
<h2>Digital intellectual property</h2>
<h3>Copyright on software</h3>
<p>Source code is protected by <strong>copyright</strong> automatically once written — the author controls copying, modifying and distributing it. Vietnam <strong>Law on Intellectual Property</strong> and international treaties (Berne) recognise this.</p>
<h3>Licences — permission to use</h3>
<ul>
<li><strong>Proprietary</strong> — closed source, use under the vendor terms only.</li>
<li><strong>Permissive open source (MIT, Apache)</strong> — use freely, even in closed products, if you keep the notice.</li>
<li><strong>Copyleft (GPL)</strong> — free to use and modify, but derivative works you distribute must also be open under the GPL.</li>
</ul>
<h3>Patents</h3>
<p>A <strong>patent</strong> can protect a novel invention (an algorithm or method) for a limited time; software patents are controversial and vary by country.</p>
<pre><code>Common mistakes:
  Copy Stack Overflow code without checking its licence
  Ship GPL code inside a closed product (violates copyleft)
  Assume "open source" == "no rules" (every licence has terms)
</code></pre>
<div class="callout"><span class="badge">Real case</span> <strong>Oracle v. Google</strong> ran for a decade over reused <strong>Java API</strong> declarations in Android. In 2021 the US Supreme Court held Google reuse was <em>fair use</em> — but the years of litigation show that even interface code carries IP risk. Separately, <strong>BusyBox</strong> GPL enforcement forced several vendors to release the source they had shipped in devices.</div>`,
    `<span class="eyebrow">ITE304 · Chương 4 · Bài 4.1</span>
<h2>Sở hữu trí tuệ số</h2>
<h3>Bản quyền phần mềm</h3>
<p>Mã nguồn được <strong>bản quyền</strong> bảo hộ tự động ngay khi viết ra — tác giả kiểm soát việc sao chép, sửa đổi và phân phối. <strong>Luật Sở hữu trí tuệ</strong> Việt Nam và các điều ước quốc tế (Công ước Berne) đều công nhận điều này.</p>
<h3>Giấy phép — quyền được dùng</h3>
<ul>
<li><strong>Độc quyền (proprietary)</strong> — đóng mã nguồn, chỉ dùng theo điều khoản của nhà cung cấp.</li>
<li><strong>Mã nguồn mở dễ dãi (MIT, Apache)</strong> — dùng tự do, kể cả trong sản phẩm đóng, miễn giữ lại thông báo bản quyền.</li>
<li><strong>Copyleft (GPL)</strong> — tự do dùng và sửa, nhưng sản phẩm phái sinh khi phân phối cũng phải mở theo GPL.</li>
</ul>
<h3>Bằng sáng chế</h3>
<p><strong>Bằng sáng chế</strong> có thể bảo hộ một sáng chế mới (thuật toán hoặc phương pháp) trong thời hạn nhất định; sáng chế phần mềm gây tranh cãi và khác nhau tuỳ quốc gia.</p>
<pre><code>Lỗi thường gặp:
  Chép mã Stack Overflow mà không xem giấy phép
  Nhét mã GPL vào sản phẩm đóng (vi phạm copyleft)
  Tưởng "mã nguồn mở" == "không luật lệ" (giấy phép nào cũng có điều khoản)
</code></pre>
<div class="callout"><span class="badge">Vụ việc thật</span> <strong>Oracle kiện Google</strong> kéo dài một thập kỷ về việc dùng lại phần khai báo <strong>API Java</strong> trong Android. Năm 2021 Tối cao Pháp viện Mỹ phán việc dùng lại đó là <em>sử dụng hợp lý</em> — nhưng nhiều năm kiện tụng cho thấy ngay cả mã giao diện cũng mang rủi ro SHTT. Ngoài ra, việc thực thi GPL của <strong>BusyBox</strong> buộc nhiều hãng phải công bố mã họ đã đưa vào thiết bị.</div>`,
  ]]);

const c4q = quiz('ite304-quiz-4', 'Quiz 4 — Digital IP|||Quiz 4 — Sở hữu trí tuệ số', [
  { id: 'q1', question: 'Giấy phép GPL (copyleft) đòi hỏi điều gì khi bạn PHÂN PHỐI sản phẩm phái sinh?|||GPL (copyleft) requires what when you DISTRIBUTE a derivative?', options: ['Trả phí bản quyền|||Pay a royalty', 'Cũng phải mở mã nguồn theo GPL|||Also release the source under GPL', 'Xin phép tác giả từng lần|||Ask the author each time', 'Không được bán|||May not sell it'], correctIndex: 1, explanation: 'Copyleft: bản phái sinh phân phối phải mở theo cùng GPL.' },
  { id: 'q2', question: 'Mã nguồn được bảo hộ bản quyền từ khi nào?|||When is source code protected by copyright?', options: ['Sau khi đăng ký|||After registration', 'Tự động ngay khi viết ra|||Automatically once written', 'Chỉ khi phát hành|||Only when released', 'Không bao giờ|||Never'], correctIndex: 1, explanation: 'Bản quyền phát sinh tự động khi tác phẩm được tạo ra.' },
  { id: 'q3', question: 'Vụ Oracle v. Google (2021) cuối cùng phán việc dùng lại API Java là?|||Oracle v. Google (2021) finally ruled reusing the Java API was?', options: ['Trộm cắp|||Theft', 'Sử dụng hợp lý (fair use)|||Fair use', 'Bằng sáng chế|||A patent', 'Không liên quan bản quyền|||Not copyright'], correctIndex: 1, explanation: 'Tối cao Pháp viện Mỹ xử việc dùng lại là fair use.' },
]);

const c5 = doc('ite304-5-1-e-transactions', '5.1 — E-transactions & contracts|||5.1 — Giao dịch & hợp đồng điện tử',
  'Luật Giao dịch điện tử VN; giá trị pháp lý của thông điệp dữ liệu; chữ ký số và chữ ký điện tử; hợp đồng điện tử và TMĐT; điều khoản click-wrap.',
  [[
    `<span class="eyebrow">ITE304 · Chapter 5 · Lesson 5.1</span>
<h2>E-transactions &amp; contracts</h2>
<h3>Giving digital records legal weight</h3>
<p>Vietnam <strong>Law on E-Transactions</strong> gives a <strong>data message</strong> the same legal value as paper when integrity and origin can be shown. This is what lets contracts, invoices and filings be done fully online.</p>
<h3>E-signatures vs digital signatures</h3>
<ul>
<li><strong>Electronic signature</strong> — any electronic mark showing intent to sign (a typed name, a click).</li>
<li><strong>Digital signature</strong> — a stronger form using <strong>public-key cryptography</strong> and a certificate, proving <em>who</em> signed and that the document was not altered.</li>
</ul>
<h3>E-contracts &amp; e-commerce</h3>
<p>A contract formed by exchanging electronic messages is valid. <strong>Click-wrap</strong> terms (I agree) bind the user if the terms were reasonably presented. E-commerce law adds duties: clear seller identity, accurate product info, and a returns policy.</p>
<pre><code>Why a digital signature is trusted:
  Certificate authority vouches for identity
  Private key signs -> public key verifies
  Any change to the file breaks the signature
</code></pre>
<div class="callout"><span class="badge">Real case</span> The EU <strong>eIDAS</strong> regulation makes a <em>qualified</em> electronic signature legally equal to a handwritten one across member states — the model many national laws, Vietnam included, follow so that cross-border digital deals hold up in court.</div>`,
    `<span class="eyebrow">ITE304 · Chương 5 · Bài 5.1</span>
<h2>Giao dịch &amp; hợp đồng điện tử</h2>
<h3>Trao giá trị pháp lý cho bản ghi số</h3>
<p><strong>Luật Giao dịch điện tử</strong> Việt Nam cho <strong>thông điệp dữ liệu</strong> giá trị pháp lý như văn bản giấy khi chứng minh được tính toàn vẹn và nguồn gốc. Đây là cơ sở để hợp đồng, hoá đơn và thủ tục được làm hoàn toàn trực tuyến.</p>
<h3>Chữ ký điện tử và chữ ký số</h3>
<ul>
<li><strong>Chữ ký điện tử</strong> — mọi dấu hiệu điện tử thể hiện ý chí ký (gõ tên, một cú nhấp).</li>
<li><strong>Chữ ký số</strong> — dạng mạnh hơn dùng <strong>mật mã khoá công khai</strong> và chứng thư, chứng minh <em>ai</em> đã ký và tài liệu không bị sửa.</li>
</ul>
<h3>Hợp đồng điện tử &amp; thương mại điện tử</h3>
<p>Hợp đồng lập bằng trao đổi thông điệp điện tử là hợp lệ. Điều khoản <strong>click-wrap</strong> (Tôi đồng ý) ràng buộc người dùng nếu điều khoản được trình bày hợp lý. Luật TMĐT thêm nghĩa vụ: nêu rõ danh tính người bán, thông tin sản phẩm chính xác, và chính sách đổi trả.</p>
<pre><code>Vì sao chữ ký số đáng tin:
  Tổ chức chứng thực bảo đảm danh tính
  Khoá riêng ký -> khoá công khai xác minh
  Mọi thay đổi file làm hỏng chữ ký
</code></pre>
<div class="callout"><span class="badge">Vụ việc thật</span> Quy định <strong>eIDAS</strong> của EU cho một chữ ký điện tử <em>đủ điều kiện</em> giá trị ngang chữ ký tay trên toàn khối — mô hình mà nhiều luật quốc gia, trong đó có Việt Nam, đi theo để giao dịch số xuyên biên giới đứng vững trước toà.</div>`,
  ]]);

const c5q = quiz('ite304-quiz-5', 'Quiz 5 — E-transactions|||Quiz 5 — Giao dịch điện tử', [
  { id: 'q1', question: 'Điều gì khiến chữ ký SỐ mạnh hơn chữ ký điện tử thường?|||What makes a DIGITAL signature stronger than a plain e-signature?', options: ['Nó dài hơn|||It is longer', 'Dùng mật mã khoá công khai + chứng thư|||It uses public-key cryptography + a certificate', 'Nó có màu|||It is coloured', 'Nó miễn phí|||It is free'], correctIndex: 1, explanation: 'Chữ ký số dùng PKI và chứng thư để chứng minh danh tính và toàn vẹn.' },
  { id: 'q2', question: 'Theo Luật Giao dịch điện tử, thông điệp dữ liệu có thể có giá trị pháp lý?|||Under the Law on E-Transactions, a data message can have?', options: ['Không bao giờ|||Never', 'Như văn bản giấy khi bảo đảm toàn vẹn/nguồn gốc|||Same value as paper when integrity/origin is shown', 'Chỉ trong ngân hàng|||Only in banks', 'Chỉ khi in ra|||Only if printed'], correctIndex: 1, explanation: 'Luật trao giá trị pháp lý cho thông điệp dữ liệu đủ điều kiện.' },
  { id: 'q3', question: 'Điều khoản "click-wrap" (Tôi đồng ý) ràng buộc người dùng khi?|||Click-wrap terms bind a user when?', options: ['Không bao giờ|||Never', 'Điều khoản được trình bày hợp lý|||The terms were reasonably presented', 'Người dùng in ra|||The user prints them', 'Có công chứng|||They are notarised'], correctIndex: 1, explanation: 'Hợp lệ nếu điều khoản được đưa ra rõ ràng và người dùng chấp nhận.' },
]);

const c6 = doc('ite304-6-1-ai-ethics', '6.1 — AI & data ethics|||6.1 — Đạo đức AI & dữ liệu',
  'Thiên lệch thuật toán (bias); AI có trách nhiệm và công bằng; tính giải thích được (explainability); tự động hoá và con người trong vòng lặp; vụ COMPAS và Amazon.',
  [[
    `<span class="eyebrow">ITE304 · Chapter 6 · Lesson 6.1</span>
<h2>AI &amp; data ethics</h2>
<h3>Algorithmic bias</h3>
<p>An AI learns from data — and inherits its <strong>biases</strong>. If past hiring favoured one group, a model trained on it will too. Bias is not a bug in the code; it is a property of the data and the goal we chose.</p>
<h3>Principles of responsible AI</h3>
<ul>
<li><strong>Fairness</strong> — do not systematically disadvantage a group.</li>
<li><strong>Explainability</strong> — a person affected by an automated decision deserves to know why.</li>
<li><strong>Accountability</strong> — a human, not the model, is responsible for the outcome.</li>
<li><strong>Human-in-the-loop</strong> — keep a person able to review and override high-stakes decisions.</li>
</ul>
<pre><code>The EU AI Act (risk tiers):
  Unacceptable -> banned (social scoring)
  High risk    -> strict duties (hiring, credit, medical)
  Limited      -> transparency (tell users it is AI)
  Minimal      -> mostly free (spam filters)
</code></pre>
<div class="callout"><span class="badge">Real case</span> The <strong>COMPAS</strong> recidivism tool was found to score Black defendants as higher-risk more often, yet its logic was a black box the accused could not challenge. <strong>Amazon</strong> scrapped an experimental hiring AI after it learned to downgrade CVs containing the word women. Both show why fairness and explainability are ethical requirements, not extras.</div>`,
    `<span class="eyebrow">ITE304 · Chương 6 · Bài 6.1</span>
<h2>Đạo đức AI &amp; dữ liệu</h2>
<h3>Thiên lệch thuật toán</h3>
<p>AI học từ dữ liệu — và thừa hưởng luôn <strong>thiên lệch</strong> của dữ liệu đó. Nếu tuyển dụng trước đây thiên vị một nhóm, mô hình huấn luyện trên đó cũng vậy. Thiên lệch không phải lỗi trong mã; nó là thuộc tính của dữ liệu và mục tiêu ta chọn.</p>
<h3>Nguyên tắc AI có trách nhiệm</h3>
<ul>
<li><strong>Công bằng</strong> — không gây bất lợi có hệ thống cho một nhóm.</li>
<li><strong>Giải thích được</strong> — người chịu tác động của quyết định tự động có quyền biết lý do.</li>
<li><strong>Chịu trách nhiệm</strong> — một con người, không phải mô hình, chịu trách nhiệm về kết quả.</li>
<li><strong>Con người trong vòng lặp</strong> — giữ một người có thể rà soát và bác bỏ quyết định hệ trọng.</li>
</ul>
<pre><code>Đạo luật AI của EU (phân tầng rủi ro):
  Không chấp nhận -> cấm (chấm điểm công dân)
  Rủi ro cao     -> nghĩa vụ ngặt (tuyển dụng, tín dụng, y tế)
  Giới hạn       -> minh bạch (báo cho người dùng biết là AI)
  Tối thiểu      -> gần như tự do (lọc spam)
</code></pre>
<div class="callout"><span class="badge">Vụ việc thật</span> Công cụ <strong>COMPAS</strong> dự đoán tái phạm bị phát hiện chấm bị cáo da đen là rủi ro cao thường xuyên hơn, mà logic của nó là hộp đen người bị buộc tội không thể phản biện. <strong>Amazon</strong> phải bỏ một AI tuyển dụng thử nghiệm sau khi nó học cách hạ điểm hồ sơ có chữ women. Cả hai cho thấy vì sao công bằng và giải thích được là yêu cầu đạo đức, không phải phần thêm.</div>`,
  ]]);

const c6q = quiz('ite304-quiz-6', 'Quiz 6 — AI ethics|||Quiz 6 — Đạo đức AI', [
  { id: 'q1', question: 'Thiên lệch thuật toán (bias) chủ yếu đến từ đâu?|||Algorithmic bias mainly comes from?', options: ['Ngôn ngữ lập trình|||The programming language', 'Dữ liệu huấn luyện và mục tiêu đã chọn|||The training data and chosen goal', 'Tốc độ CPU|||CPU speed', 'Màu giao diện|||The UI colour'], correctIndex: 1, explanation: 'AI thừa hưởng thiên lệch từ dữ liệu và mục tiêu tối ưu.' },
  { id: 'q2', question: '"Con người trong vòng lặp" (human-in-the-loop) nghĩa là?|||"Human-in-the-loop" means?', options: ['Bỏ hết con người|||Remove all humans', 'Giữ một người rà soát/bác bỏ quyết định hệ trọng|||Keep a person to review/override key decisions', 'Chạy AI nhanh hơn|||Run AI faster', 'Ẩn logic|||Hide the logic'], correctIndex: 1, explanation: 'Người vẫn có quyền kiểm tra và bác bỏ quyết định rủi ro cao.' },
  { id: 'q3', question: 'Vụ AI tuyển dụng của Amazon bị bỏ vì?|||Amazon hiring AI was scrapped because it?', options: ['Quá chậm|||Was too slow', 'Học cách hạ điểm hồ sơ của phụ nữ|||Learned to downgrade women CVs', 'Quá đắt|||Was too costly', 'Không chạy được|||Would not run'], correctIndex: 1, explanation: 'Mô hình học thiên lệch giới từ dữ liệu tuyển dụng cũ.' },
]);

const c7 = doc('ite304-7-1-content-platforms', '7.1 — Digital content & platform responsibility|||7.1 — Nội dung số & trách nhiệm nền tảng',
  'Tin giả và thông tin sai lệch; kiểm duyệt nội dung và tự do biểu đạt; trách nhiệm pháp lý của nền tảng (Điều 230, Luật ANM); deepfake và tổn hại; vụ việc thật.',
  [[
    `<span class="eyebrow">ITE304 · Chapter 7 · Lesson 7.1</span>
<h2>Digital content &amp; platform responsibility</h2>
<h3>Misinformation &amp; the harm it does</h3>
<p><strong>Fake news</strong> spreads faster than corrections and can swing elections, fuel panic, or damage reputations. Platforms amplify it because engagement-driven feeds reward outrage.</p>
<h3>Moderation vs. free expression</h3>
<p>Removing content protects users from harm but risks <strong>censorship</strong> of legitimate speech. The hard question is <em>who decides</em>, by what rule, and with what appeal — a governance problem, not just a technical filter.</p>
<h3>Platform liability</h3>
<ul>
<li><strong>US Section 230</strong> — long shielded platforms from liability for user posts, enabling the open web but also weak accountability.</li>
<li><strong>Vietnam Law on Cybersecurity</strong> — obliges platforms to remove unlawful content on request.</li>
<li><strong>Deepfakes</strong> — synthetic video/audio used for fraud, non-consensual imagery, or disinformation raise new liability and consent issues.</li>
</ul>
<pre><code>A duty-of-care checklist for a platform:
  Label / down-rank known false content
  Give users a report + appeal path
  Be transparent about the moderation rules
  Act faster on content that can cause real-world harm
</code></pre>
<div class="callout"><span class="badge">Real case</span> After the <strong>Cambridge Analytica</strong> affair, harvested Facebook data was used to micro-target political ads — showing how content systems, data and influence intertwine. Deepfake videos of public figures have since been used in investment scams, pushing several countries to draft specific deepfake laws.</div>`,
    `<span class="eyebrow">ITE304 · Chương 7 · Bài 7.1</span>
<h2>Nội dung số &amp; trách nhiệm nền tảng</h2>
<h3>Tin giả và tổn hại nó gây ra</h3>
<p><strong>Tin giả</strong> lan nhanh hơn cả đính chính, có thể xoay chuyển bầu cử, gây hoảng loạn, hay huỷ hoại danh dự. Nền tảng khuếch đại nó vì bảng tin chạy theo tương tác thưởng cho sự phẫn nộ.</p>
<h3>Kiểm duyệt và tự do biểu đạt</h3>
<p>Gỡ nội dung bảo vệ người dùng khỏi tổn hại nhưng có nguy cơ <strong>kiểm duyệt</strong> tiếng nói chính đáng. Câu hỏi khó là <em>ai quyết định</em>, theo quy tắc nào, và có đường khiếu nại ra sao — một bài toán quản trị, không chỉ là bộ lọc kỹ thuật.</p>
<h3>Trách nhiệm pháp lý của nền tảng</h3>
<ul>
<li><strong>Điều 230 (Mỹ)</strong> — lâu nay miễn trách cho nền tảng với bài đăng của người dùng, giúp web mở nhưng cũng làm trách nhiệm giải trình yếu.</li>
<li><strong>Luật An ninh mạng Việt Nam</strong> — buộc nền tảng gỡ nội dung vi phạm khi có yêu cầu.</li>
<li><strong>Deepfake</strong> — video/âm thanh tổng hợp dùng để lừa đảo, phát tán hình ảnh không đồng thuận hay tung tin sai đặt ra vấn đề trách nhiệm và đồng ý mới.</li>
</ul>
<pre><code>Danh mục nghĩa vụ cẩn trọng của nền tảng:
  Gắn nhãn / hạ hiển thị nội dung sai đã biết
  Cho người dùng đường báo cáo + khiếu nại
  Minh bạch về quy tắc kiểm duyệt
  Xử lý nhanh hơn với nội dung có thể gây hại thực tế
</code></pre>
<div class="callout"><span class="badge">Vụ việc thật</span> Sau vụ <strong>Cambridge Analytica</strong>, dữ liệu Facebook thu thập được dùng để nhắm quảng cáo chính trị vi mô — cho thấy hệ thống nội dung, dữ liệu và ảnh hưởng đan xen thế nào. Video deepfake của người nổi tiếng sau đó bị dùng trong lừa đảo đầu tư, thúc nhiều nước soạn luật riêng về deepfake.</div>`,
  ]]);

const c7q = quiz('ite304-quiz-7', 'Quiz 7 — Content & platforms|||Quiz 7 — Nội dung & nền tảng', [
  { id: 'q1', question: 'Vì sao bảng tin chạy theo tương tác dễ khuếch đại tin giả?|||Why do engagement feeds amplify fake news?', options: ['Vì tin giả luôn đúng|||Fake news is always true', 'Vì chúng thưởng cho nội dung gây phẫn nộ/giật gân|||They reward outrage and sensational content', 'Vì luật bắt buộc|||The law requires it', 'Vì server nhanh|||Servers are fast'], correctIndex: 1, explanation: 'Thuật toán tối ưu tương tác ưu ái nội dung kích động, giúp tin giả lan.' },
  { id: 'q2', question: 'Điều 230 của Mỹ chủ yếu làm gì cho nền tảng?|||US Section 230 mainly does what for platforms?', options: ['Bắt bồi thường mọi bài đăng|||Forces liability for every post', 'Miễn trách với nội dung do người dùng đăng|||Shields them from liability for user posts', 'Cấm kiểm duyệt|||Bans moderation', 'Bắt công khai thuật toán|||Requires publishing the algorithm'], correctIndex: 1, explanation: 'Điều 230 miễn trách nền tảng cho nội dung người dùng tạo ra.' },
  { id: 'q3', question: 'Deepfake gây lo ngại pháp lý mới chủ yếu vì?|||Deepfakes raise new legal concern mainly because?', options: ['Tốn dung lượng|||They use storage', 'Dùng để lừa đảo, tin sai, ảnh không đồng thuận|||Used for fraud, disinformation, non-consensual imagery', 'Chỉ là giải trí|||They are just fun', 'Không ai xem|||No one watches'], correctIndex: 1, explanation: 'Nội dung tổng hợp giả mạo gây tổn hại và vấn đề đồng ý.' },
]);

const c8 = doc('ite304-8-1-profession-compliance', '8.1 — Professional duty & compliance|||8.1 — Nghề nghiệp & tuân thủ',
  'Trách nhiệm nghề nghiệp; tố giác (whistleblowing) và bảo vệ; văn hoá tuân thủ (compliance) trong tổ chức; xu hướng pháp lý mới; vụ Snowden và bài học nghề.',
  [[
    `<span class="eyebrow">ITE304 · Chapter 8 · Lesson 8.1</span>
<h2>Professional duty &amp; compliance</h2>
<h3>Duty as a professional</h3>
<p>Being a professional means the public trusts your judgment even when no one is watching. That duty can outrank an order from your boss when the order would harm the public.</p>
<h3>Whistleblowing</h3>
<p>When wrongdoing cannot be fixed internally, <strong>whistleblowing</strong> — reporting it to an authority or the public — may be the ethical last resort. Many laws now offer <strong>whistleblower protection</strong> against retaliation, but the personal cost is often high.</p>
<h3>Compliance culture</h3>
<ul>
<li><strong>Policies</strong> — written rules mapping law to daily work.</li>
<li><strong>Training &amp; audits</strong> — so rules are known and checked.</li>
<li><strong>Accountability</strong> — clear owners and consequences.</li>
</ul>
<pre><code>Emerging legal trends to watch:
  AI regulation (EU AI Act and national copies)
  Stronger data-protection enforcement (GDPR, Decree 13)
  Platform accountability + deepfake laws
  Right-to-repair, digital-market competition rules
</code></pre>
<div class="callout"><span class="badge">Real case</span> <strong>Edward Snowden</strong> exposed mass surveillance he judged unlawful — a stark study in the clash between loyalty, legality and conscience, and why whistleblower channels and protections matter. Compliance done well aims to catch problems <em>before</em> anyone has to make that choice.</div>`,
    `<span class="eyebrow">ITE304 · Chương 8 · Bài 8.1</span>
<h2>Nghề nghiệp &amp; tuân thủ</h2>
<h3>Trách nhiệm của người làm nghề</h3>
<p>Là người làm nghề nghĩa là công chúng tin vào phán xét của bạn ngay cả khi không ai giám sát. Trách nhiệm đó có thể đứng trên mệnh lệnh của cấp trên khi mệnh lệnh gây hại cho công chúng.</p>
<h3>Tố giác (whistleblowing)</h3>
<p>Khi sai phạm không thể sửa từ bên trong, <strong>tố giác</strong> — báo cho cơ quan chức năng hoặc công chúng — có thể là giải pháp đạo đức cuối cùng. Nhiều luật nay có <strong>bảo vệ người tố giác</strong> khỏi trả đũa, nhưng cái giá cá nhân thường rất lớn.</p>
<h3>Văn hoá tuân thủ</h3>
<ul>
<li><strong>Chính sách</strong> — quy tắc thành văn nối luật với công việc hằng ngày.</li>
<li><strong>Đào tạo &amp; kiểm toán</strong> — để quy tắc được biết và được kiểm.</li>
<li><strong>Trách nhiệm giải trình</strong> — rõ người phụ trách và hậu quả.</li>
</ul>
<pre><code>Xu hướng pháp lý cần theo dõi:
  Quản lý AI (Đạo luật AI của EU và bản sao quốc gia)
  Thực thi bảo vệ dữ liệu mạnh hơn (GDPR, NĐ 13)
  Trách nhiệm nền tảng + luật về deepfake
  Quyền được sửa chữa, quy tắc cạnh tranh thị trường số
</code></pre>
<div class="callout"><span class="badge">Vụ việc thật</span> <strong>Edward Snowden</strong> phơi bày hoạt động giám sát hàng loạt mà ông cho là trái pháp luật — một ví dụ gay gắt về xung đột giữa lòng trung thành, tính hợp pháp và lương tâm, và vì sao kênh cùng cơ chế bảo vệ người tố giác lại quan trọng. Tuân thủ làm tốt nhắm bắt vấn đề <em>trước khi</em> ai đó phải chọn con đường ấy.</div>`,
  ]]);

const c8q = quiz('ite304-quiz-8', 'Quiz 8 — Profession & compliance|||Quiz 8 — Nghề nghiệp & tuân thủ', [
  { id: 'q1', question: 'Tố giác (whistleblowing) nên là?|||Whistleblowing should be?', options: ['Bước đầu tiên luôn dùng|||Always the first step', 'Giải pháp cuối khi không sửa được từ bên trong|||A last resort when internal fixes fail', 'Việc bị cấm|||Forbidden', 'Không liên quan đạo đức|||Unrelated to ethics'], correctIndex: 1, explanation: 'Là lựa chọn đạo đức cuối cùng khi kênh nội bộ không giải quyết được.' },
  { id: 'q2', question: 'Văn hoá tuân thủ (compliance) trong tổ chức gồm?|||A compliance culture includes?', options: ['Giấu luật|||Hiding the law', 'Chính sách, đào tạo, kiểm toán, trách nhiệm giải trình|||Policies, training, audits, accountability', 'Chỉ phạt sau khi hỏng|||Only punishing after failure', 'Bỏ mọi quy tắc|||Dropping all rules'], correctIndex: 1, explanation: 'Tuân thủ tốt nối luật với công việc và kiểm tra thường xuyên.' },
  { id: 'q3', question: 'Xu hướng pháp lý mới đáng theo dõi trong công nghệ số gồm?|||An emerging tech-law trend to watch is?', options: ['Bỏ luật dữ liệu|||Abolishing data law', 'Quản lý AI và trách nhiệm nền tảng|||AI regulation and platform accountability', 'Cấm Internet|||Banning the internet', 'Bỏ bản quyền|||Ending copyright'], correctIndex: 1, explanation: 'Đạo luật AI, thực thi dữ liệu, luật deepfake là các hướng đang lên.' },
]);

const taiLieu = doc('ite304-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), chuẩn mực ACM/IEEE, văn bản luật (GDPR, Luật ANM, Luật GDĐT, Luật SHTT, NĐ 13/2023), khoá học, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">ITE304 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study law and ethics in digital technology — professional codes, data protection, cybersecurity, intellectual property, e-transactions, AI ethics and platform responsibility — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, primary sources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ITE304 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Professional codes</h3>
<ul>
<li><a href="https://www.acm.org/code-of-ethics" target="_blank" rel="noopener">ACM Code of Ethics and Professional Conduct</a></li>
<li><a href="https://www.computer.org/education/code-of-ethics" target="_blank" rel="noopener">IEEE Computer Society / Software Engineering Code of Ethics</a></li>
</ul>
<h3>🌐 Primary legal texts</h3>
<ul>
<li><a href="https://gdpr-info.eu/" target="_blank" rel="noopener">EU GDPR — full text (gdpr-info.eu)</a></li>
<li><a href="https://vanban.chinhphu.vn/" target="_blank" rel="noopener">Vietnam laws — Luật An ninh mạng, Luật Giao dịch điện tử, Luật SHTT, Nghị định 13/2023 (vanban.chinhphu.vn)</a></li>
<li><a href="https://artificialintelligenceact.eu/" target="_blank" rel="noopener">EU AI Act — overview &amp; text</a></li>
</ul>
<h3>▶️ Talks &amp; learning</h3>
<ul>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED</a> — talks on data, AI ethics &amp; surveillance</li>
<li><a href="https://ethics.acm.org/" target="_blank" rel="noopener">ACM Ethics — case studies &amp; guidance</a></li>
</ul>
<h3>🛠️ Tools &amp; references</h3>
<ul>
<li><a href="https://choosealicense.com/" target="_blank" rel="noopener">choosealicense.com — open-source licence guide</a></li>
<li><a href="https://tldrlegal.com/" target="_blank" rel="noopener">TLDRLegal — software licences in plain words</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — the ACM/IEEE code, the ethics-vs-law distinction, and the four Vietnamese laws plus GDPR.</li>
<li><strong>Practice</strong> — take each chapter case and argue both sides: what the law says and what a professional should do.</li>
<li><strong>Go deeper</strong> — read one primary text end to end (GDPR or Decree 13) and map it to a product you know.</li>
<li><strong>Job-ready</strong> — apply a privacy &amp; licence check to your own project before it ships.</li>
</ol></div>`,
    `<span class="eyebrow">ITE304 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học luật và đạo đức trong công nghệ số — quy tắc nghề nghiệp, bảo vệ dữ liệu, an ninh mạng, sở hữu trí tuệ, giao dịch điện tử, đạo đức AI và trách nhiệm nền tảng — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn gốc miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ITE304 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Quy tắc nghề nghiệp</h3>
<ul>
<li><a href="https://www.acm.org/code-of-ethics" target="_blank" rel="noopener">Bộ quy tắc đạo đức và ứng xử nghề nghiệp ACM</a></li>
<li><a href="https://www.computer.org/education/code-of-ethics" target="_blank" rel="noopener">Bộ quy tắc đạo đức kỹ thuật phần mềm IEEE</a></li>
</ul>
<h3>🌐 Văn bản luật gốc</h3>
<ul>
<li><a href="https://gdpr-info.eu/" target="_blank" rel="noopener">GDPR của EU — toàn văn (gdpr-info.eu)</a></li>
<li><a href="https://vanban.chinhphu.vn/" target="_blank" rel="noopener">Luật Việt Nam — Luật An ninh mạng, Luật Giao dịch điện tử, Luật SHTT, Nghị định 13/2023 (vanban.chinhphu.vn)</a></li>
<li><a href="https://artificialintelligenceact.eu/" target="_blank" rel="noopener">Đạo luật AI của EU — tổng quan &amp; toàn văn</a></li>
</ul>
<h3>▶️ Bài nói &amp; học thêm</h3>
<ul>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED</a> — bài nói về dữ liệu, đạo đức AI &amp; giám sát</li>
<li><a href="https://ethics.acm.org/" target="_blank" rel="noopener">ACM Ethics — tình huống &amp; hướng dẫn</a></li>
</ul>
<h3>🛠️ Công cụ &amp; tra cứu</h3>
<ul>
<li><a href="https://choosealicense.com/" target="_blank" rel="noopener">choosealicense.com — chọn giấy phép mã nguồn mở</a></li>
<li><a href="https://tldrlegal.com/" target="_blank" rel="noopener">TLDRLegal — giấy phép phần mềm nói ngắn gọn</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — bộ quy tắc ACM/IEEE, phân biệt đạo đức và pháp luật, và bốn luật Việt Nam cùng GDPR.</li>
<li><strong>Luyện tập</strong> — lấy mỗi vụ việc trong chương và lập luận cả hai phía: luật nói gì và người làm nghề nên làm gì.</li>
<li><strong>Đào sâu</strong> — đọc trọn một văn bản gốc (GDPR hoặc NĐ 13) và soi vào một sản phẩm bạn biết.</li>
<li><strong>Sẵn sàng đi làm</strong> — áp một vòng rà quyền riêng tư &amp; giấy phép cho dự án của chính bạn trước khi phát hành.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'ITE304',
    slug: 'ite304-law-and-ethics-in-digital-technology',
    title: 'Law and Ethics in Digital Technology',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ITE304.webp',
    shortDescription: 'Law & ethics for digital tech — ACM/IEEE code, privacy & data (GDPR, Decree 13/2023), cybersecurity law, digital IP, e-transactions & e-signatures, AI ethics, platforms, compliance. Bilingual, real cases & quizzes.|||Luật & đạo đức công nghệ số — quy tắc ACM/IEEE, riêng tư & dữ liệu (GDPR, NĐ 13/2023), an ninh mạng, SHTT số, giao dịch & chữ ký số, đạo đức AI, nền tảng, tuân thủ. Song ngữ, có vụ việc thật & quiz.',
    description: 'Môn <strong>ITE304 — Law and Ethics in Digital Technology</strong> (kỳ 7, ngành Chuyển đổi số) trang bị cả <strong>phán xét đạo đức</strong> lẫn <strong>hiểu biết pháp lý</strong> cho người làm công nghệ. Từ <strong>đạo đức nghề &amp; bộ quy tắc ACM/IEEE</strong> → <strong>quyền riêng tư &amp; dữ liệu cá nhân</strong> (GDPR, NĐ 13/2023) → <strong>an ninh mạng &amp; pháp lý</strong> (Luật An ninh mạng 2018) → <strong>sở hữu trí tuệ số</strong> → <strong>giao dịch &amp; hợp đồng điện tử</strong> → <strong>đạo đức AI</strong> → <strong>nội dung số &amp; trách nhiệm nền tảng</strong> → <strong>nghề nghiệp &amp; tuân thủ</strong>. Song ngữ, gắn điều luật với vụ việc thật, quiz mỗi chương.',
    whatYouLearn: 'Bộ quy tắc ACM/IEEE &amp; phân biệt đạo đức/pháp luật; nguyên tắc GDPR và NĐ 13/2023 (đồng ý, mục đích, tối thiểu hoá, quyền chủ thể); Luật An ninh mạng 2018 &amp; tội phạm mạng; bản quyền, giấy phép (GPL/MIT), bằng sáng chế, mã nguồn mở; Luật Giao dịch điện tử, chữ ký số &amp; hợp đồng điện tử; thiên lệch AI, AI có trách nhiệm &amp; giải thích được; tin giả, kiểm duyệt, trách nhiệm nền tảng, deepfake; tố giác &amp; văn hoá tuân thủ.',
    requirements: 'Không cần nền pháp lý. Nên có hiểu biết cơ bản về phần mềm và Internet. Xem điều kiện tiên quyết trong khung chương trình ngành Chuyển đổi số trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide FLM, ACM/IEEE, văn bản luật, khoá học, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao học luật & đạo đức; hai nguồn chuẩn; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Đạo đức công nghệ số|||Chapter 1 — Digital tech ethics', description: 'ACM/IEEE code, đạo đức vs pháp luật, tình huống.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quyền riêng tư & dữ liệu|||Chapter 2 — Privacy & data', description: 'GDPR, NĐ 13/2023, vòng đời dữ liệu.', lessons: [c2, c2q] },
    { title: 'Chương 3 — An ninh mạng & pháp lý|||Chapter 3 — Cybersecurity law', description: 'Luật ANM 2018, tội phạm mạng, trách nhiệm.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Sở hữu trí tuệ số|||Chapter 4 — Digital IP', description: 'Bản quyền, giấy phép, mã nguồn mở, sáng chế.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Giao dịch & hợp đồng điện tử|||Chapter 5 — E-transactions', description: 'Luật GDĐT, chữ ký số, TMĐT, hợp đồng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đạo đức AI & dữ liệu|||Chapter 6 — AI ethics', description: 'Bias, AI trách nhiệm, giải thích được, tự động hoá.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Nội dung số & trách nhiệm nền tảng|||Chapter 7 — Content & platforms', description: 'Tin giả, kiểm duyệt, trách nhiệm nền tảng, deepfake.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Nghề nghiệp & tuân thủ|||Chapter 8 — Profession & compliance', description: 'Trách nhiệm nghề, tố giác, compliance, xu hướng luật.', lessons: [c8, c8q] },
  ],
};
