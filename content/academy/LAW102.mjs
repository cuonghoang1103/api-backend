/**
 * LAW102 — Business Law and Ethics Fundamentals (Luật và đạo đức kinh doanh). Khối QTKD, kỳ 5.
 * Bám ĐỀ CƯƠNG FLM sylID 13718 (QĐ 1318/QĐ-ĐHFPT, 27/11/2025): 4 phần · 17 unit, LUẬT MỸ là chính
 * (common law, UCC), luật Việt Nam chỉ là khung đối chiếu ngắn cuối mỗi bài.
 * Sách chính: Ashcroft, Ashcroft & Patterson — Law for Business (Cengage, 19th ed. 2018,
 * ISBN 9781305654921; bản 17th 2010 cũng được) — Ch 1–3, 5–7, 11–14, 19, 29, 32–34, 39;
 * Byars & Stanberry — Business Ethics (OpenStax 2018) — Ch 3 (3.1–3.4) cho Unit 14–17.
 * Song ngữ + bài tập (số đã kiểm bằng máy; tình huống là GIẢ ĐỊNH) + quiz trắc nghiệm luật Mỹ.
 * Nội dung giáo dục, không phải tư vấn pháp lý; số điều luật VN luôn kèm "kiểm văn bản đang có hiệu lực".
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('law102-0-1-overview', 'Course overview: why business people study US law|||Tổng quan: vì sao người làm kinh doanh học luật Mỹ',
  'Luật kinh doanh là gì, vì sao môn học lấy luật Mỹ (common law, UCC) làm trọng tâm và luật Việt Nam làm phần đối chiếu, bản đồ 4 phần · 17 unit theo đề cương, cách học và cách môn được đánh giá.',
  [[
    `<span class="eyebrow">LAW102 · Lesson 0.1 · Overview</span>
<h2>Business Law and Ethics Fundamentals</h2>
<p class="lead">Every business decision — signing a supplier deal, hiring a director, launching a product, answering a regulator — has a legal side and an ethical side. This course gives you the vocabulary and the reasoning to spot both before they turn into disputes.</p>
<div class="callout"><span class="badge">Educational content, not legal advice</span> These lessons explain general principles for study. Real cases depend on the facts, the jurisdiction and the law in force on the day. For an actual legal problem, consult a licensed lawyer in the relevant jurisdiction.</div>
<h3>Why US law first?</h3>
<p>The course studies <strong>United States law as the main system</strong> and uses Vietnamese law as a short <strong>counterpart</strong> at the end of each lesson. There are good reasons: US contract, sales and corporate law (common law plus the <strong>Uniform Commercial Code, UCC</strong>) shapes a large share of international business documents; many foreign investors and partners of Vietnamese firms think in common-law terms; and comparing a case-law system with Vietnam's code-based system makes both easier to understand.</p>
<p>One warning applies to the whole course: the US has <strong>fifty state legal systems plus the federal system</strong>. Where states differ, lessons state the <strong>general rule</strong> — the position most states follow or the one found in the textbook — and flag that details vary.</p>
<h3>Course map — 4 parts, 17 units (following the syllabus)</h3>
<table>
<tr><th>Part</th><th>Units</th><th>Main textbook chapters</th></tr>
<tr><td>1. Fundamentals of business law</td><td>1 Law &amp; ethics · 2 Courts &amp; procedure · 3 Torts · 4 Property</td><td>Ashcroft Ch 1–3, 14, 39</td></tr>
<tr><td>2. Business transactions &amp; contracts</td><td>5 Nature &amp; classes of contracts · 6 Offer &amp; acceptance · 7 Third parties · 8 Termination &amp; remedies</td><td>Ashcroft Ch 5–7, 11–13</td></tr>
<tr><td>3. Business organization &amp; structure</td><td>9 Forms of business · 10 Nature of a corporation · 11 Ownership · 12 Management &amp; dissolution</td><td>Ashcroft Ch 29, 32–34</td></tr>
<tr><td>4. Ethics in doing business</td><td>13 Warranties &amp; consumer protection · 14–15 Stakeholders &amp; their claims · 16 Prioritizing stakeholders &amp; corruption · 17 CSR</td><td>Ashcroft Ch 19; OpenStax Business Ethics Ch 3</td></tr>
</table>
<h3>How to study law efficiently</h3>
<ul>
<li><strong>Learn the rule as elements.</strong> A valid offer, a negligence claim, a warranty — each is a checklist. Exam questions test whether every element is present.</li>
<li><strong>Use IRAC for every case:</strong> <em>Issue</em> (what legal question?), <em>Rule</em> (which rule applies?), <em>Application</em> (apply the rule to these facts), <em>Conclusion</em>.</li>
<li><strong>Separate "legal" from "ethical".</strong> Many conduct choices are lawful but still harm stakeholders; the ethics units give you frameworks to judge them.</li>
</ul>
<h3>How the course is assessed</h3>
<p>Participation, a short essay test on business organizations, three moot-court sessions on US cases, an individual case summary, three multiple-choice quizzes and a final exam of multiple-choice questions on US law (weights are listed in the Course materials hub). The quizzes at the end of each part here follow the same multiple-choice style, and the three exercises rehearse the moot-court and essay tasks.</p>
<div class="callout"><span class="badge">Cases in this course</span> Worked cases are fictional, with illustrative numbers. Real cases are cited only when they are classic, widely reported decisions — and only for the principle they stand for.</div>`,
    `<span class="eyebrow">LAW102 · Bài 0.1 · Tổng quan</span>
<h2>Luật và đạo đức kinh doanh</h2>
<p class="lead">Mọi quyết định kinh doanh — ký hợp đồng với nhà cung cấp, bổ nhiệm giám đốc, tung sản phẩm, trả lời cơ quan quản lý — đều có mặt pháp lý và mặt đạo đức. Môn học trang bị thuật ngữ và cách lập luận để nhận ra cả hai trước khi chúng trở thành tranh chấp.</p>
<div class="callout"><span class="badge">Nội dung giáo dục, không phải tư vấn pháp lý</span> Các bài học giải thích nguyên tắc chung để học tập. Vụ việc thật phụ thuộc vào tình tiết, vào hệ thống pháp luật áp dụng và vào văn bản đang có hiệu lực tại thời điểm đó. Khi gặp vấn đề pháp lý thật, hãy hỏi luật sư có chứng chỉ hành nghề tại nơi liên quan.</div>
<h3>Vì sao học luật Mỹ trước?</h3>
<p>Môn học lấy <strong>luật Hoa Kỳ làm hệ thống chính</strong> và dùng luật Việt Nam làm phần <strong>đối chiếu</strong> ngắn cuối mỗi bài. Lý do: luật hợp đồng, mua bán và công ty của Mỹ (thông luật cùng <strong>Bộ luật Thương mại Thống nhất — UCC</strong>) định hình một phần lớn tài liệu kinh doanh quốc tế; nhiều nhà đầu tư và đối tác nước ngoài của doanh nghiệp Việt Nam tư duy theo thông luật; và so sánh một hệ thống dựa trên án lệ với hệ thống dựa trên bộ luật như Việt Nam giúp hiểu cả hai dễ hơn.</p>
<p>Một lưu ý dùng cho cả môn: Hoa Kỳ có <strong>năm mươi hệ thống pháp luật tiểu bang cùng hệ thống liên bang</strong>. Ở chỗ các bang khác nhau, bài học nêu <strong>quy tắc chung</strong> — quan điểm đa số bang theo hoặc quan điểm trong giáo trình — và ghi rõ chi tiết có thể khác.</p>
<h3>Bản đồ môn học — 4 phần, 17 unit (theo đề cương)</h3>
<table>
<tr><th>Phần</th><th>Unit</th><th>Chương sách chính</th></tr>
<tr><td>1. Kiến thức nền tảng về luật kinh doanh</td><td>1 Luật &amp; đạo đức · 2 Toà án &amp; tố tụng · 3 Tort · 4 Tài sản</td><td>Ashcroft Ch 1–3, 14, 39</td></tr>
<tr><td>2. Giao dịch kinh doanh &amp; hợp đồng</td><td>5 Bản chất &amp; phân loại hợp đồng · 6 Đề nghị &amp; chấp nhận · 7 Bên thứ ba · 8 Chấm dứt &amp; biện pháp khắc phục</td><td>Ashcroft Ch 5–7, 11–13</td></tr>
<tr><td>3. Tổ chức &amp; cơ cấu doanh nghiệp</td><td>9 Loại hình kinh doanh · 10 Bản chất công ty · 11 Sở hữu công ty · 12 Quản trị &amp; giải thể</td><td>Ashcroft Ch 29, 32–34</td></tr>
<tr><td>4. Đạo đức trong kinh doanh</td><td>13 Bảo đảm &amp; bảo vệ người tiêu dùng · 14–15 Bên liên quan &amp; yêu sách · 16 Ưu tiên bên liên quan &amp; tham nhũng · 17 CSR</td><td>Ashcroft Ch 19; OpenStax Business Ethics Ch 3</td></tr>
</table>
<h3>Học luật sao cho hiệu quả</h3>
<ul>
<li><strong>Học quy tắc theo yếu tố cấu thành.</strong> Một đề nghị hợp lệ, một yêu cầu bồi thường do cẩu thả, một bảo đảm — mỗi thứ là một danh sách kiểm. Câu hỏi thi kiểm tra xem đủ từng yếu tố hay chưa.</li>
<li><strong>Dùng IRAC cho mọi tình huống:</strong> <em>Issue</em> (vấn đề pháp lý là gì?), <em>Rule</em> (quy tắc nào áp dụng?), <em>Application</em> (áp quy tắc vào tình tiết này), <em>Conclusion</em> (kết luận).</li>
<li><strong>Tách "hợp pháp" khỏi "có đạo đức".</strong> Nhiều lựa chọn hợp pháp nhưng vẫn gây hại cho các bên liên quan; các unit đạo đức cho bạn khung để đánh giá chúng.</li>
</ul>
<h3>Môn học được đánh giá thế nào</h3>
<p>Tham gia lớp, một bài kiểm tra tự luận ngắn về tổ chức doanh nghiệp, ba phiên toà giả định (moot court) về án Mỹ, một bài tóm tắt bản án cá nhân, ba quiz trắc nghiệm và bài thi cuối kỳ trắc nghiệm về luật Mỹ (trọng số ghi ở mục Tài liệu tham khảo). Quiz cuối mỗi phần ở đây theo đúng kiểu trắc nghiệm đó, còn ba bài tập giúp luyện phần moot court và tự luận.</p>
<div class="callout"><span class="badge">Tình huống trong môn</span> Các tình huống giải mẫu là giả định, số liệu minh hoạ. Án thật chỉ được nêu khi là án kinh điển, được ghi nhận rộng rãi — và chỉ để nêu nguyên tắc mà án đó xác lập.</div>`,
  ]]);

const u1 = doc('law102-1-1-law-and-ethics', '1.1 — Ch 1 · Introduction to law and ethics (Unit 1)|||1.1 — Ch 1 · Nhập môn luật và đạo đức (Unit 1)',
  'Luật là gì và mục tiêu của luật; thông luật (common law) và dân luật (civil law), hệ thống pháp luật Việt Nam; bốn nguồn của luật Mỹ; phân loại luật; đạo đức, phán xét đạo đức và các nguyên tắc đạo đức kinh doanh.',
  [[
    `<span class="eyebrow">LAW102 · Part 1 · Lesson 1.1</span>
<h2>Introduction to law and ethics</h2>
<p class="lead"><strong>Law</strong> is the body of rules of conduct prescribed and enforced by a government. <strong>Business law</strong> is the part of it that governs business transactions and business organizations: contracts, sales, property, companies, employment and the like.</p>
<h3>1. What law is for</h3>
<ul>
<li><strong>Keep order and protect persons and property</strong> — people can plan, trade and invest without fear.</li>
<li><strong>Resolve disputes peacefully</strong> — through courts and other procedures instead of force.</li>
<li><strong>Protect rights and liberties</strong> — including against abuse by the state.</li>
<li><strong>Provide predictability</strong> — contracts are enforced, so strangers can trust each other.</li>
<li><strong>Promote fairness and social goals</strong> — consumer protection, safety, competition.</li>
</ul>
<h3>2. Two great legal traditions</h3>
<table>
<tr><th></th><th>Common law</th><th>Civil law</th></tr>
<tr><td>Origin</td><td>England; spread to the US, UK, Australia, Canada (except Quebec's private law), India…</td><td>Roman law and the European codes; continental Europe, Latin America, much of Asia</td></tr>
<tr><td>Main source</td><td>Statutes <em>and</em> judicial decisions; earlier cases bind later courts (<strong>stare decisis</strong>, "let the decision stand")</td><td>Comprehensive written <strong>codes</strong>; judges apply the code to the facts</td></tr>
<tr><td>Role of the judge</td><td>Develops the law case by case; trials are adversarial, often with a jury</td><td>Applies and interprets the code; procedure is more judge-led</td></tr>
</table>
<p>Courts in common-law systems rely on precedent because it gives <strong>predictability</strong> (like cases decided alike) and <strong>fairness</strong>, while still letting the law adapt: a court may <em>distinguish</em> a precedent on its facts, and a higher court may <em>overrule</em> it. Within the US, Louisiana's private law keeps a civil-law heritage.</p>
<h3>3. The four sources of US law</h3>
<ol>
<li><strong>Constitutions</strong> — the US Constitution is the supreme law of the land; each state also has a constitution. A statute that conflicts with the Constitution is void.</li>
<li><strong>Statutory law</strong> — laws passed by Congress, state legislatures and local governments (ordinances). The <strong>UCC</strong> is a model code that the states enacted as their own statutes; it has been adopted in every state, although Louisiana has not adopted Article 2 on sales.</li>
<li><strong>Common law (case law)</strong> — principles developed by court decisions, still the main source for torts and most non-sale contracts.</li>
<li><strong>Administrative law</strong> — rules and decisions of government agencies such as the Federal Trade Commission (FTC) or the Securities and Exchange Commission (SEC), made under powers delegated by statute.</li>
</ol>
<h3>4. Classifying law</h3>
<ul>
<li><strong>Public law</strong> (constitutional, criminal, administrative) vs <strong>private law</strong> (contracts, torts, property).</li>
<li><strong>Criminal law</strong> — wrongs against society, prosecuted by the government, proven "beyond a reasonable doubt"; crimes are felonies (serious) or misdemeanors (less serious). <strong>Civil law</strong> — private rights, the injured party sues, usually proven by a "preponderance of the evidence". One act (e.g. a fraud) can lead to both.</li>
<li><strong>Substantive law</strong> (rights and duties) vs <strong>procedural law</strong> (how rights are enforced).</li>
</ul>
<h3>5. Ethics, moral judgment and business ethics</h3>
<p><strong>Ethics</strong> are principles that decide whether conduct is right or wrong. A <strong>moral judgment</strong> is the conclusion we reach about a particular act. Law and ethics overlap but are not the same: some acts are legal but unethical (exploiting a loophole to mislead customers), and law often sets only a <em>minimum</em>. Common ethical principles:</p>
<table>
<tr><th>Approach</th><th>Key question</th></tr>
<tr><td>Utilitarianism (consequences)</td><td>Which action produces the greatest net good for all affected?</td></tr>
<tr><td>Duty / rights (Kant)</td><td>Could the rule behind my act be applied to everyone? Am I treating people as ends, not merely as means?</td></tr>
<tr><td>Justice / fairness</td><td>Are benefits and burdens distributed fairly and is the process impartial?</td></tr>
<tr><td>Virtue ethics</td><td>What would a person of good character — honest, fair, courageous — do?</td></tr>
</table>
<p><strong>Business ethics</strong> applies these principles to business decisions; firms express them in codes of conduct, compliance programs and protections for whistle-blowers. Quick tests: would I be comfortable if this appeared on the front page (publicity test)? Would I accept it if I were on the other side (golden rule)?</p>
<div class="callout"><span class="badge">Vietnam counterpart / Đối chiếu Việt Nam</span> Vietnam follows the civil-law tradition with socialist legal features: written legal documents are the main source, headed by the 2013 Constitution, then codes and laws of the National Assembly (e.g. the Civil Code 2015), then government decrees and ministerial circulars. Since the mid-2010s the Supreme People's Court has also published selected <em>án lệ</em> (precedents) as a supplementary source. The hierarchy of legal documents is set by the Law on Promulgation of Legal Documents — check the version currently in force on vbpl.vn.</div>`,
    `<span class="eyebrow">LAW102 · Phần 1 · Bài 1.1</span>
<h2>Nhập môn luật và đạo đức</h2>
<p class="lead"><strong>Luật</strong> là hệ thống quy tắc xử sự do nhà nước đặt ra và bảo đảm thực hiện. <strong>Luật kinh doanh</strong> là phần điều chỉnh giao dịch kinh doanh và tổ chức kinh doanh: hợp đồng, mua bán, tài sản, công ty, lao động…</p>
<h3>1. Luật để làm gì</h3>
<ul>
<li><strong>Giữ trật tự, bảo vệ con người và tài sản</strong> — người ta có thể lập kế hoạch, giao thương, đầu tư mà không lo sợ.</li>
<li><strong>Giải quyết tranh chấp một cách hoà bình</strong> — qua toà án và các thủ tục khác thay vì dùng vũ lực.</li>
<li><strong>Bảo vệ quyền và tự do</strong> — kể cả trước sự lạm quyền của nhà nước.</li>
<li><strong>Tạo tính dự đoán được</strong> — hợp đồng được thực thi, nên người lạ có thể tin nhau.</li>
<li><strong>Thúc đẩy công bằng và mục tiêu xã hội</strong> — bảo vệ người tiêu dùng, an toàn, cạnh tranh.</li>
</ul>
<h3>2. Hai truyền thống pháp luật lớn</h3>
<table>
<tr><th></th><th>Thông luật (common law)</th><th>Dân luật (civil law)</th></tr>
<tr><td>Nguồn gốc</td><td>Nước Anh; lan sang Mỹ, Anh, Úc, Canada (trừ luật tư của Quebec), Ấn Độ…</td><td>Luật La Mã và các bộ luật châu Âu; lục địa châu Âu, Mỹ Latinh, phần lớn châu Á</td></tr>
<tr><td>Nguồn chính</td><td>Luật thành văn <em>và</em> phán quyết của toà; án trước ràng buộc toà sau (<strong>stare decisis</strong> — "giữ nguyên điều đã quyết")</td><td>Các <strong>bộ luật</strong> thành văn toàn diện; thẩm phán áp dụng bộ luật vào tình tiết</td></tr>
<tr><td>Vai trò thẩm phán</td><td>Phát triển luật qua từng vụ; xét xử theo lối tranh tụng, thường có bồi thẩm đoàn</td><td>Áp dụng và giải thích bộ luật; tố tụng do thẩm phán chủ động dẫn dắt nhiều hơn</td></tr>
</table>
<p>Toà án thông luật dựa vào án lệ vì án lệ đem lại <strong>tính dự đoán được</strong> (vụ giống nhau xử giống nhau) và <strong>công bằng</strong>, mà luật vẫn thích nghi được: toà có thể <em>phân biệt</em> án lệ vì tình tiết khác, và toà cấp trên có thể <em>huỷ bỏ</em> án lệ. Trong nước Mỹ, luật tư của bang Louisiana còn giữ di sản dân luật.</p>
<h3>3. Bốn nguồn của luật Mỹ</h3>
<ol>
<li><strong>Hiến pháp</strong> — Hiến pháp Hoa Kỳ là luật tối cao; mỗi bang cũng có hiến pháp riêng. Đạo luật trái Hiến pháp thì vô hiệu.</li>
<li><strong>Luật thành văn</strong> — do Quốc hội liên bang, nghị viện bang và chính quyền địa phương (pháp lệnh địa phương) ban hành. <strong>UCC</strong> là bộ luật mẫu mà các bang ban hành thành luật của mình; mọi bang đều đã thông qua, dù Louisiana không thông qua Điều khoản 2 (Article 2) về mua bán.</li>
<li><strong>Thông luật (án lệ)</strong> — các nguyên tắc hình thành từ phán quyết của toà, vẫn là nguồn chính của luật tort và phần lớn hợp đồng không phải mua bán hàng hoá.</li>
<li><strong>Luật hành chính</strong> — quy định và quyết định của các cơ quan nhà nước như Uỷ ban Thương mại Liên bang (FTC) hay Uỷ ban Chứng khoán và Giao dịch (SEC), ban hành theo thẩm quyền được luật trao.</li>
</ol>
<h3>4. Phân loại luật</h3>
<ul>
<li><strong>Công pháp</strong> (hiến pháp, hình sự, hành chính) và <strong>tư pháp</strong> (hợp đồng, tort, tài sản).</li>
<li><strong>Luật hình sự</strong> — hành vi xâm hại xã hội, do nhà nước truy tố, phải chứng minh "vượt qua mọi nghi ngờ hợp lý"; tội phạm chia thành trọng tội (felony) và khinh tội (misdemeanor). <strong>Luật dân sự</strong> — quyền tư, người bị hại khởi kiện, thường chỉ cần chứng minh theo "ưu thế chứng cứ". Một hành vi (vd lừa đảo) có thể dẫn tới cả hai.</li>
<li><strong>Luật nội dung</strong> (quyền và nghĩa vụ) và <strong>luật hình thức/tố tụng</strong> (cách thực thi quyền).</li>
</ul>
<h3>5. Đạo đức, phán xét đạo đức và đạo đức kinh doanh</h3>
<p><strong>Đạo đức</strong> là những nguyên tắc xác định hành vi đúng hay sai. <strong>Phán xét đạo đức</strong> là kết luận ta đưa ra về một hành vi cụ thể. Luật và đạo đức giao nhau nhưng không trùng nhau: có hành vi hợp pháp mà phi đạo đức (lợi dụng kẽ hở để đánh lừa khách hàng), và luật thường chỉ đặt ra mức <em>tối thiểu</em>. Các nguyên tắc đạo đức phổ biến:</p>
<table>
<tr><th>Cách tiếp cận</th><th>Câu hỏi then chốt</th></tr>
<tr><td>Chủ nghĩa vị lợi (hệ quả)</td><td>Hành động nào tạo ra lợi ích ròng lớn nhất cho mọi người bị ảnh hưởng?</td></tr>
<tr><td>Nghĩa vụ / quyền (Kant)</td><td>Quy tắc đằng sau hành vi của tôi có thể áp dụng cho mọi người không? Tôi có coi con người là mục đích, không chỉ là phương tiện?</td></tr>
<tr><td>Công lý / công bằng</td><td>Lợi ích và gánh nặng có được phân chia công bằng, quy trình có vô tư không?</td></tr>
<tr><td>Đạo đức học đức hạnh</td><td>Một người có phẩm chất tốt — trung thực, công bằng, dũng cảm — sẽ làm gì?</td></tr>
</table>
<p><strong>Đạo đức kinh doanh</strong> áp dụng các nguyên tắc này vào quyết định kinh doanh; doanh nghiệp thể hiện chúng qua bộ quy tắc ứng xử, chương trình tuân thủ và cơ chế bảo vệ người tố giác. Phép thử nhanh: tôi có thấy thoải mái nếu việc này lên trang nhất báo (phép thử công khai)? Tôi có chấp nhận nếu mình ở phía bên kia (quy tắc vàng)?</p>
<div class="callout"><span class="badge">Đối chiếu Việt Nam</span> Việt Nam theo truyền thống dân luật, mang đặc điểm pháp luật xã hội chủ nghĩa: văn bản quy phạm pháp luật là nguồn chính, đứng đầu là Hiến pháp 2013, rồi các bộ luật, luật của Quốc hội (vd Bộ luật Dân sự 2015), rồi nghị định của Chính phủ và thông tư của bộ. Từ giữa thập niên 2010, Toà án nhân dân tối cao còn công bố các <em>án lệ</em> được tuyển chọn làm nguồn bổ trợ. Thứ bậc văn bản do Luật Ban hành văn bản quy phạm pháp luật quy định — kiểm văn bản đang có hiệu lực trên vbpl.vn.</div>`,
  ]]);

const u2 = doc('law102-1-2-courts-procedure', '1.2 — Ch 2 · Courts and court procedure (Unit 2)|||1.2 — Ch 2 · Toà án và thủ tục tố tụng (Unit 2)',
  'Chức năng của toà án; thẩm quyền (theo vụ việc, theo người, sơ thẩm, phúc thẩm; thẩm quyền liên bang); hệ thống toà án liên bang và bang; các bước của một vụ kiện dân sự và phiên toà có bồi thẩm đoàn; phương thức giải quyết tranh chấp thay thế; đối chiếu toà án và tố tụng Việt Nam.',
  [[
    `<span class="eyebrow">LAW102 · Part 1 · Lesson 1.2</span>
<h2>Courts and court procedure</h2>
<h3>1. What courts do</h3>
<p>A court is a tribunal established to administer justice. Its core function is to <strong>decide controversies</strong>: find the facts, identify the applicable law and apply it. In doing so courts also <strong>interpret</strong> statutes and constitutions, and US courts may declare a statute unconstitutional (<strong>judicial review</strong>, established by <em>Marbury v. Madison</em>, 1803).</p>
<h3>2. Jurisdiction — the power to hear a case</h3>
<ul>
<li><strong>Subject-matter jurisdiction</strong> — the kinds of cases a court may hear (e.g. bankruptcy courts hear only bankruptcy matters). Courts of <em>general</em> jurisdiction hear most cases; courts of <em>limited</em> (special) jurisdiction hear only some.</li>
<li><strong>Personal jurisdiction</strong> — power over the parties, usually because the defendant lives, does business or was served in the state.</li>
<li><strong>Original</strong> jurisdiction (hears the case first, a trial court) vs <strong>appellate</strong> jurisdiction (reviews a lower court's decision for errors of law).</li>
<li><strong>Federal jurisdiction</strong> exists mainly for (a) a <em>federal question</em> — a claim under the US Constitution, a federal statute or treaty; or (b) <em>diversity of citizenship</em> — parties are citizens of different states and the amount in controversy exceeds $75,000. Some cases fall within both state and federal courts (<em>concurrent</em> jurisdiction).</li>
</ul>
<h3>3. The court systems</h3>
<table>
<tr><th>Level</th><th>Federal system</th><th>Typical state system (names vary)</th></tr>
<tr><td>Highest court</td><td>US Supreme Court — nine justices; hears most cases only if it grants a <em>writ of certiorari</em></td><td>State supreme court (in New York the highest court is the Court of Appeals)</td></tr>
<tr><td>Intermediate appellate</td><td>US Courts of Appeals — 13 circuits</td><td>Court of appeals</td></tr>
<tr><td>Trial courts</td><td>US District Courts (94 districts); special courts such as bankruptcy, tax and international trade</td><td>General trial courts (county, circuit or superior courts); limited courts such as small-claims, probate, traffic</td></tr>
</table>
<p>Officers of the court include the judge, attorneys (who are officers of the court), the clerk, the bailiff and the sheriff or marshal who serves process and enforces judgments.</p>
<h3>4. Steps in a civil lawsuit</h3>
<ol>
<li><strong>Pleadings</strong> — the plaintiff files a <em>complaint</em>; the defendant is served with a <em>summons</em> and files an <em>answer</em> (possibly a <em>counterclaim</em>) or a motion to dismiss.</li>
<li><strong>Discovery</strong> — each side obtains evidence: depositions (sworn oral testimony), interrogatories (written questions), requests for documents. Many cases settle here or are decided on <em>summary judgment</em> when no material fact is disputed.</li>
<li><strong>Trial</strong> — jury selection (<em>voir dire</em>, with challenges for cause and a limited number of peremptory challenges) → opening statements → plaintiff's evidence (direct and cross-examination) → defendant's evidence → closing arguments → the judge's <em>instructions</em> (charge) to the jury → deliberation → <strong>verdict</strong> → <strong>judgment</strong> entered by the court.</li>
<li><strong>Post-trial</strong> — motions (e.g. for a new trial), <strong>appeal</strong> on errors of law, and <strong>execution</strong> of the judgment (e.g. seizure of assets).</li>
</ol>
<p>The Seventh Amendment preserves the right to a jury in federal civil suits at common law where the value exceeds twenty dollars; either side can waive it and choose a <em>bench trial</em>. The jury decides questions of fact; the judge decides questions of law. Rules on jury size and unanimity in civil cases vary among states.</p>
<h3>5. Alternative dispute resolution (ADR)</h3>
<p><strong>Negotiation</strong> (parties settle directly), <strong>mediation</strong> (a neutral helps them reach agreement; not binding unless they sign a settlement) and <strong>arbitration</strong> (a neutral arbitrator issues an award that is normally binding and enforceable in court). Business contracts often contain an arbitration clause because it is private, faster and handled by specialists.</p>
<div class="callout"><span class="badge">Vietnam counterpart / Đối chiếu Việt Nam</span> Vietnam's people's courts are headed by the Supreme People's Court; the lower tiers were reorganised in 2025 (district-level courts replaced by regional courts) — check the current Law on Organisation of People's Courts. There is no jury: first-instance trials normally include lay <em>people's assessors</em> (hội thẩm nhân dân) who decide together with the judge. Cases are heard at first instance and on appeal (phúc thẩm), with special review procedures (giám đốc thẩm, tái thẩm). Civil and business disputes follow the Civil Procedure Code 2015; commercial disputes may also go to commercial arbitration (Law on Commercial Arbitration 2010) — check the versions in force on vbpl.vn.</div>`,
    `<span class="eyebrow">LAW102 · Phần 1 · Bài 1.2</span>
<h2>Toà án và thủ tục tố tụng</h2>
<h3>1. Toà án làm gì</h3>
<p>Toà án là cơ quan được lập ra để thực thi công lý. Chức năng cốt lõi là <strong>giải quyết tranh chấp</strong>: xác định sự thật, xác định luật áp dụng và áp dụng nó. Khi làm vậy toà cũng <strong>giải thích</strong> luật và hiến pháp; toà án Mỹ còn có thể tuyên một đạo luật vi hiến (<strong>quyền xem xét tính hợp hiến — judicial review</strong>, xác lập từ án <em>Marbury v. Madison</em>, 1803).</p>
<h3>2. Thẩm quyền — quyền được thụ lý một vụ</h3>
<ul>
<li><strong>Thẩm quyền theo vụ việc</strong> — loại vụ toà được xét (vd toà phá sản chỉ xét việc phá sản). Toà có thẩm quyền <em>chung</em> xét phần lớn các vụ; toà thẩm quyền <em>hạn chế</em> (chuyên biệt) chỉ xét một số loại.</li>
<li><strong>Thẩm quyền đối với đương sự</strong> — quyền đối với các bên, thường vì bị đơn cư trú, kinh doanh hoặc được tống đạt giấy tờ tại bang đó.</li>
<li>Thẩm quyền <strong>sơ thẩm</strong> (xét vụ lần đầu — toà xét xử) và thẩm quyền <strong>phúc thẩm</strong> (xem lại phán quyết của toà dưới về sai lầm áp dụng pháp luật).</li>
<li><strong>Thẩm quyền liên bang</strong> chủ yếu khi (a) có <em>vấn đề liên bang</em> — yêu cầu dựa trên Hiến pháp, luật liên bang hay điều ước; hoặc (b) <em>khác biệt quốc tịch bang</em> — các bên là công dân của các bang khác nhau và giá trị tranh chấp vượt 75.000 $. Có vụ thuộc cả toà bang lẫn toà liên bang (thẩm quyền <em>song song</em>).</li>
</ul>
<h3>3. Các hệ thống toà án</h3>
<table>
<tr><th>Cấp</th><th>Hệ thống liên bang</th><th>Hệ thống bang điển hình (tên gọi khác nhau)</th></tr>
<tr><td>Toà cao nhất</td><td>Toà án Tối cao Hoa Kỳ — chín thẩm phán; xét phần lớn các vụ chỉ khi chấp nhận <em>lệnh certiorari</em></td><td>Toà tối cao bang (ở New York toà cao nhất lại tên là Court of Appeals)</td></tr>
<tr><td>Phúc thẩm trung gian</td><td>Các Toà Phúc thẩm Hoa Kỳ — 13 khu vực (circuit)</td><td>Toà phúc thẩm bang</td></tr>
<tr><td>Toà xét xử</td><td>Các Toà án Quận Liên bang (94 quận); toà chuyên biệt như phá sản, thuế, thương mại quốc tế</td><td>Toà xét xử chung (county, circuit, superior court); toà hạn chế như toà khiếu kiện nhỏ, di chúc, giao thông</td></tr>
</table>
<p>Người tham gia tố tụng phía toà gồm thẩm phán, luật sư (được coi là người phục vụ toà), thư ký, cảnh vệ phiên toà (bailiff), và cảnh sát trưởng hạt (sheriff) hay cảnh sát tư pháp liên bang (marshal) — người tống đạt giấy tờ và thi hành bản án.</p>
<h3>4. Các bước của một vụ kiện dân sự</h3>
<ol>
<li><strong>Trao đổi đơn từ</strong> — nguyên đơn nộp <em>đơn khởi kiện</em>; bị đơn nhận <em>giấy triệu tập</em> và nộp <em>bản trả lời</em> (có thể kèm <em>phản tố</em>) hoặc đề nghị bác đơn.</li>
<li><strong>Thu thập chứng cứ (discovery)</strong> — mỗi bên thu chứng cứ: lấy lời khai có tuyên thệ, bảng câu hỏi bằng văn bản, yêu cầu cung cấp tài liệu. Nhiều vụ hoà giải xong ở đây, hoặc được giải quyết bằng <em>phán quyết rút gọn</em> khi không có tình tiết quan trọng nào bị tranh chấp.</li>
<li><strong>Xét xử</strong> — chọn bồi thẩm (<em>voir dire</em>, gồm phản đối có lý do và một số lượt phản đối không cần lý do) → phát biểu mở đầu → chứng cứ của nguyên đơn (hỏi trực tiếp và đối chất) → chứng cứ của bị đơn → tranh luận kết thúc → thẩm phán <em>hướng dẫn</em> bồi thẩm đoàn → nghị án → <strong>phán quyết của bồi thẩm đoàn (verdict)</strong> → toà tuyên <strong>bản án (judgment)</strong>.</li>
<li><strong>Sau xét xử</strong> — các đề nghị (vd xử lại), <strong>kháng cáo</strong> về sai lầm áp dụng pháp luật, và <strong>thi hành</strong> bản án (vd kê biên tài sản).</li>
</ol>
<p>Tu chính án thứ Bảy bảo đảm quyền được xét xử có bồi thẩm đoàn trong vụ dân sự liên bang theo thông luật khi giá trị vượt hai mươi đô la; mỗi bên có thể từ bỏ để chọn <em>phiên toà chỉ có thẩm phán</em>. Bồi thẩm đoàn quyết định vấn đề sự kiện; thẩm phán quyết định vấn đề pháp lý. Quy định về số bồi thẩm và yêu cầu nhất trí trong vụ dân sự khác nhau giữa các bang.</p>
<h3>5. Giải quyết tranh chấp thay thế (ADR)</h3>
<p><strong>Thương lượng</strong> (các bên tự dàn xếp), <strong>hoà giải</strong> (người trung lập giúp các bên đạt thoả thuận; không ràng buộc trừ khi ký thoả thuận dàn xếp) và <strong>trọng tài</strong> (trọng tài viên ra phán quyết thường có tính ràng buộc và được toà công nhận để thi hành). Hợp đồng kinh doanh hay có điều khoản trọng tài vì bí mật, nhanh hơn và do chuyên gia xử lý.</p>
<div class="callout"><span class="badge">Đối chiếu Việt Nam</span> Hệ thống toà án nhân dân Việt Nam đứng đầu là Toà án nhân dân tối cao; các cấp dưới đã được sắp xếp lại năm 2025 (bỏ toà cấp huyện, lập toà án khu vực) — kiểm Luật Tổ chức Toà án nhân dân hiện hành. Việt Nam không có bồi thẩm đoàn: phiên toà sơ thẩm thường có <em>hội thẩm nhân dân</em> cùng thẩm phán quyết định. Vụ án được xét xử sơ thẩm, phúc thẩm, và có thủ tục xem xét lại đặc biệt (giám đốc thẩm, tái thẩm). Tranh chấp dân sự, kinh doanh theo Bộ luật Tố tụng dân sự 2015; tranh chấp thương mại cũng có thể giải quyết bằng trọng tài thương mại (Luật Trọng tài thương mại 2010) — kiểm văn bản đang có hiệu lực trên vbpl.vn.</div>`,
  ]]);

const u3 = doc('law102-1-3-torts', '1.3 — Ch 3 · Torts, business torts & product liability (Unit 3)|||1.3 — Ch 3 · Tort, tort kinh doanh & trách nhiệm sản phẩm (Unit 3)',
  'Tort là gì, phân biệt với tội phạm và vi phạm hợp đồng; tort cố ý; tort do cẩu thả với bốn yếu tố (nghĩa vụ, vi phạm, quan hệ nhân quả, thiệt hại) và các biện hộ; trách nhiệm nghiêm ngặt; tort kinh doanh; trách nhiệm sản phẩm; đối chiếu bồi thường thiệt hại ngoài hợp đồng theo BLDS 2015.',
  [[
    `<span class="eyebrow">LAW102 · Part 1 · Lesson 1.3</span>
<h2>Torts, business torts &amp; product liability</h2>
<p class="lead">A <strong>tort</strong> is a private (civil) wrong against a person or property, other than a breach of contract, for which the court gives a remedy — usually money damages. The same act can be a tort (the victim sues) and a crime (the state prosecutes).</p>
<h3>1. Intentional torts</h3>
<table>
<tr><th>Tort</th><th>Core idea</th></tr>
<tr><td>Assault / battery</td><td>Causing reasonable fear of imminent harmful contact / actual harmful or offensive contact</td></tr>
<tr><td>False imprisonment</td><td>Unlawfully restraining a person's freedom of movement (e.g. detaining a shopper without reasonable grounds)</td></tr>
<tr><td>Defamation</td><td>A false statement of fact, communicated to a third person, that harms reputation — <em>slander</em> if spoken, <em>libel</em> if written or broadcast; truth is a defense</td></tr>
<tr><td>Invasion of privacy</td><td>E.g. using a person's name or likeness for advertising without consent</td></tr>
<tr><td>Trespass / conversion</td><td>Entering another's land without permission / taking or destroying another's personal property</td></tr>
<tr><td>Fraud (deceit)</td><td>Intentional misrepresentation of a material fact, relied on, causing loss</td></tr>
</table>
<h3>2. Negligence — four elements</h3>
<ol>
<li><strong>Duty</strong> — the defendant owed the plaintiff a duty of reasonable care. In <em>Donoghue v Stevenson</em> (1932), a classic case decided by the UK House of Lords, the court held that a manufacturer owes a duty of care to the ultimate consumer of its product.</li>
<li><strong>Breach</strong> — the defendant failed to act as a <em>reasonable person</em> would in the circumstances.</li>
<li><strong>Causation</strong> — <em>actual</em> cause (would the harm have happened "but for" the conduct?) and <em>proximate</em> cause (was the harm a foreseeable result?). In <em>Palsgraf v. Long Island Railroad</em> (New York, 1928) the court limited liability to harms and plaintiffs that were reasonably foreseeable.</li>
<li><strong>Damages</strong> — actual injury or loss.</li>
</ol>
<p><strong>Defenses:</strong> <em>assumption of risk</em>; <em>contributory negligence</em> (in the handful of jurisdictions that keep it, any fault of the plaintiff bars recovery); <em>comparative negligence</em> (most states: damages are reduced by the plaintiff's share of fault, e.g. 30% at fault → recovers 70%). The doctrine <em>res ipsa loquitur</em> ("the thing speaks for itself") lets a jury infer negligence when an accident would not normally happen without it.</p>
<h3>3. Strict liability</h3>
<p>Liability <strong>without fault</strong>: the defendant is liable even though it took all reasonable care — for abnormally dangerous activities (blasting, storing toxic chemicals) and, most importantly for business, for defective products.</p>
<h3>4. Business torts</h3>
<ul>
<li><strong>Wrongful interference with a contract</strong> — knowingly inducing a party to break a valid contract.</li>
<li><strong>Disparagement (trade libel)</strong> — false statements about a competitor's products or business.</li>
<li><strong>Unfair competition and infringement</strong> — passing off goods as another's, infringing trademarks, patents or copyrights, misappropriating trade secrets.</li>
</ul>
<h3>5. Product liability</h3>
<p>A person injured by a product may sue on three theories: <strong>negligence</strong>, <strong>breach of warranty</strong> (Lesson 4.1) and <strong>strict liability</strong>. Under the widely followed rule of Restatement (Second) of Torts §402A, a seller in the business of selling a product is liable for physical harm caused by the product sold "in a defective condition unreasonably dangerous" to the user, even if the seller exercised all possible care and had no contract with the victim. Defects are of three kinds: <strong>manufacturing</strong> (the item departs from its design), <strong>design</strong> (the whole line is unsafe) and <strong>inadequate warnings or instructions</strong>. Common defenses: misuse, alteration, assumption of risk; many states also apply comparative fault.</p>
<div class="callout"><span class="badge">Vietnam counterpart / Đối chiếu Việt Nam</span> The Civil Code 2015 (Chapter XX, liability for non-contractual damage) states the general rule: a person who infringes another's life, health, honour, property or other lawful rights and causes damage must compensate, on the principle of full and timely compensation; liability also arises without fault in cases set by law, e.g. damage caused by sources of extreme danger. The Law on Protection of Consumers' Rights 2023 (which replaced the 2010 law) makes businesses liable for damage caused by defective goods they supply. Check article numbers and exceptions in the versions in force on vbpl.vn.</div>`,
    `<span class="eyebrow">LAW102 · Phần 1 · Bài 1.3</span>
<h2>Tort, tort kinh doanh &amp; trách nhiệm sản phẩm</h2>
<p class="lead"><strong>Tort</strong> là hành vi sai trái dân sự (tư) xâm phạm người hoặc tài sản, không phải vi phạm hợp đồng, mà toà cho biện pháp khắc phục — thường là bồi thường bằng tiền. Cùng một hành vi có thể vừa là tort (nạn nhân khởi kiện) vừa là tội phạm (nhà nước truy tố).</p>
<h3>1. Tort cố ý</h3>
<table>
<tr><th>Tort</th><th>Ý cốt lõi</th></tr>
<tr><td>Đe doạ / hành hung (assault / battery)</td><td>Gây nỗi sợ hợp lý về một tiếp xúc gây hại sắp xảy ra / tiếp xúc gây hại hay xúc phạm thật sự</td></tr>
<tr><td>Giam giữ trái phép</td><td>Hạn chế trái luật tự do đi lại của người khác (vd giữ khách mua hàng mà không có căn cứ hợp lý)</td></tr>
<tr><td>Phỉ báng (defamation)</td><td>Tuyên bố sai sự thật, truyền tới người thứ ba, làm tổn hại danh dự — <em>slander</em> nếu nói, <em>libel</em> nếu viết hay phát sóng; nói đúng sự thật là lý do biện hộ</td></tr>
<tr><td>Xâm phạm đời tư</td><td>Vd dùng tên hay hình ảnh của người khác để quảng cáo khi chưa được đồng ý</td></tr>
<tr><td>Xâm phạm đất đai / chiếm đoạt tài sản</td><td>Vào đất của người khác không được phép / lấy hay huỷ động sản của người khác</td></tr>
<tr><td>Gian lận (lừa dối)</td><td>Cố ý trình bày sai một sự kiện trọng yếu, được tin theo, gây thiệt hại</td></tr>
</table>
<h3>2. Cẩu thả (negligence) — bốn yếu tố</h3>
<ol>
<li><strong>Nghĩa vụ</strong> — bị đơn có nghĩa vụ cẩn trọng hợp lý với nguyên đơn. Trong <em>Donoghue v Stevenson</em> (1932), một án kinh điển do Viện Quý tộc (House of Lords) Vương quốc Anh quyết định, toà xác định nhà sản xuất có nghĩa vụ cẩn trọng với người tiêu dùng cuối cùng của sản phẩm.</li>
<li><strong>Vi phạm nghĩa vụ</strong> — bị đơn không hành xử như một <em>người bình thường cẩn trọng</em> trong hoàn cảnh đó.</li>
<li><strong>Quan hệ nhân quả</strong> — nguyên nhân <em>thực tế</em> (nếu không có hành vi đó thì thiệt hại có xảy ra không — phép thử "but for") và nguyên nhân <em>trực tiếp</em> (thiệt hại có thể thấy trước không?). Trong <em>Palsgraf v. Long Island Railroad</em> (New York, 1928), toà giới hạn trách nhiệm vào thiệt hại và người bị hại có thể thấy trước một cách hợp lý.</li>
<li><strong>Thiệt hại</strong> — tổn thất hay thương tích thực tế.</li>
</ol>
<p><strong>Biện hộ:</strong> <em>tự nguyện chấp nhận rủi ro</em>; <em>lỗi góp phần</em> (ở số ít nơi còn giữ quy tắc này, nguyên đơn có chút lỗi là mất quyền đòi bồi thường); <em>lỗi hỗn hợp theo tỷ lệ</em> (đa số bang: bồi thường giảm theo phần lỗi của nguyên đơn, vd có lỗi 30% → nhận 70%). Học thuyết <em>res ipsa loquitur</em> ("sự việc tự nói lên") cho phép bồi thẩm đoàn suy ra có cẩu thả khi tai nạn bình thường không thể xảy ra nếu không có cẩu thả.</p>
<h3>3. Trách nhiệm nghiêm ngặt</h3>
<p>Trách nhiệm <strong>không cần lỗi</strong>: bị đơn phải chịu dù đã cẩn trọng hợp lý — với hoạt động nguy hiểm bất thường (nổ mìn, trữ hoá chất độc) và, quan trọng nhất với doanh nghiệp, với sản phẩm khuyết tật.</p>
<h3>4. Tort kinh doanh</h3>
<ul>
<li><strong>Can thiệp trái phép vào hợp đồng</strong> — cố ý xúi một bên phá vỡ hợp đồng hợp lệ.</li>
<li><strong>Bôi nhọ thương mại (trade libel)</strong> — tuyên bố sai sự thật về sản phẩm hay việc kinh doanh của đối thủ.</li>
<li><strong>Cạnh tranh không lành mạnh và xâm phạm</strong> — giả mạo hàng của người khác, xâm phạm nhãn hiệu, sáng chế, quyền tác giả, chiếm đoạt bí mật kinh doanh.</li>
</ul>
<h3>5. Trách nhiệm sản phẩm</h3>
<p>Người bị thương vì sản phẩm có thể kiện theo ba cơ sở: <strong>cẩu thả</strong>, <strong>vi phạm bảo đảm</strong> (Bài 4.1) và <strong>trách nhiệm nghiêm ngặt</strong>. Theo quy tắc được áp dụng rộng rãi của Restatement (Second) of Torts §402A, người kinh doanh bán sản phẩm phải chịu trách nhiệm về thiệt hại thân thể do sản phẩm được bán "trong tình trạng khuyết tật, nguy hiểm bất hợp lý" gây ra, kể cả khi đã cẩn trọng tối đa và không có hợp đồng với nạn nhân. Có ba loại khuyết tật: <strong>khuyết tật sản xuất</strong> (sản phẩm lệch khỏi thiết kế), <strong>khuyết tật thiết kế</strong> (cả dòng sản phẩm không an toàn) và <strong>thiếu cảnh báo hay hướng dẫn</strong>. Biện hộ thường gặp: dùng sai mục đích, tự ý thay đổi sản phẩm, tự nguyện chấp nhận rủi ro; nhiều bang còn áp dụng lỗi theo tỷ lệ.</p>
<div class="callout"><span class="badge">Đối chiếu Việt Nam</span> Bộ luật Dân sự 2015 (Chương XX — trách nhiệm bồi thường thiệt hại ngoài hợp đồng) nêu quy tắc chung: người có hành vi xâm phạm tính mạng, sức khoẻ, danh dự, tài sản hay quyền, lợi ích hợp pháp khác của người khác mà gây thiệt hại thì phải bồi thường, theo nguyên tắc bồi thường toàn bộ và kịp thời; có trường hợp phải bồi thường cả khi không có lỗi theo luật định, vd thiệt hại do nguồn nguy hiểm cao độ gây ra. Luật Bảo vệ quyền lợi người tiêu dùng 2023 (thay luật 2010) buộc tổ chức, cá nhân kinh doanh chịu trách nhiệm bồi thường thiệt hại do hàng hoá có khuyết tật mình cung cấp gây ra. Kiểm số điều và các trường hợp loại trừ trong văn bản đang có hiệu lực trên vbpl.vn.</div>`,
  ]]);

const u4 = doc('law102-1-4-property', '1.4 — Ch 14 & 39 · Personal property, bailments & real property (Unit 4)|||1.4 — Ch 14 & 39 · Động sản, gửi giữ & bất động sản (Unit 4)',
  'Tài sản là bó quyền; động sản hữu hình và vô hình; các cách xác lập quyền sở hữu động sản (mua, tặng cho, thừa kế, sáp nhập, trộn lẫn, tạo ra, nhặt được); bailment và mức độ cẩn trọng; bất động sản, vật gắn liền; fee simple và life estate; đối chiếu BLDS 2015 và quyền sử dụng đất ở Việt Nam.',
  [[
    `<span class="eyebrow">LAW102 · Part 1 · Lesson 1.4</span>
<h2>Personal property, bailments &amp; real property</h2>
<p class="lead"><strong>Property</strong> is not the thing itself but a <strong>bundle of rights</strong> in it: to possess, use, exclude others, sell, give away or leave it by will. The law divides property into <strong>real property</strong> (land and what is permanently attached to it) and <strong>personal property</strong> (everything else).</p>
<h3>1. Personal property</h3>
<p>Personal property may be <strong>tangible</strong> (a car, inventory, a laptop) or <strong>intangible</strong> — rights such as shares of stock, accounts receivable, patents, copyrights and trademarks.</p>
<h3>2. How ownership of personal property is acquired</h3>
<table>
<tr><th>Method</th><th>Rule</th></tr>
<tr><td>Purchase</td><td>The usual way — by a contract of sale (Part 2)</td></tr>
<tr><td>Gift</td><td>Requires donative <strong>intent</strong>, <strong>delivery</strong> and <strong>acceptance</strong>; a promise to give in the future is not a completed gift</td></tr>
<tr><td>Will or inheritance</td><td>Transfer on the owner's death</td></tr>
<tr><td>Accession</td><td>Increase in value by labor or materials added (e.g. a car repainted); generally the owner of the original item keeps it</td></tr>
<tr><td>Confusion</td><td>Fungible goods of different owners mixed (grain in a silo) — owners share in proportion</td></tr>
<tr><td>Creation</td><td>Producing something new — a design, a book, an invention</td></tr>
<tr><td>Finding</td><td><em>Lost</em> property: the finder has a claim good against everyone except the true owner; <em>mislaid</em> property (intentionally put down and forgotten) is usually held by the owner of the premises; <em>abandoned</em> property belongs to the first person who takes possession</td></tr>
</table>
<h3>3. Bailments</h3>
<p>A <strong>bailment</strong> is the transfer of <em>possession</em> (not ownership) of personal property by the <strong>bailor</strong> to the <strong>bailee</strong> for a purpose, on the understanding that the same property will be returned or disposed of as directed. Examples: leaving a car at a repair shop, renting equipment, storing goods in a warehouse, lending a book.</p>
<table>
<tr><th>Type</th><th>Example</th><th>Bailee's standard of care (traditional rule)</th></tr>
<tr><td>For the sole benefit of the bailor</td><td>You keep a neighbor's bike free of charge</td><td>Slight care — liable for gross negligence</td></tr>
<tr><td>For the sole benefit of the bailee</td><td>You borrow a friend's camera for free</td><td>Great (extraordinary) care</td></tr>
<tr><td>Mutual benefit</td><td>Paid parking, repair, rental, storage</td><td>Ordinary (reasonable) care</td></tr>
</table>
<p>Many modern courts simply ask whether the bailee used reasonable care in the circumstances. <strong>Special bailments</strong> — common carriers and hotelkeepers — carry much stricter liability, subject to recognised exceptions such as acts of God. Bailees may limit liability by clear notice or contract, within limits set by law.</p>
<h3>4. Real property</h3>
<p>Real property includes land, buildings, things growing on the land and <strong>fixtures</strong> — personal property attached so that it becomes part of the real estate. Courts decide whether an item is a fixture by looking at <em>attachment</em> (can it be removed without damage?), <em>adaptation</em> (is it made for this property?) and the <em>intention</em> of the person who attached it.</p>
<h3>5. Estates in land: fee simple vs life estate</h3>
<table>
<tr><th></th><th>Fee simple (absolute)</th><th>Life estate</th></tr>
<tr><td>Duration</td><td>Unlimited — the largest estate the law recognises</td><td>Measured by the life of a person</td></tr>
<tr><td>Rights</td><td>Use, sell, lease, mortgage, give away or leave by will; passes to heirs</td><td>Use and enjoy for life; may transfer only the life interest</td></tr>
<tr><td>Duties</td><td>Subject to law (zoning, taxes, easements)</td><td>Must not commit <em>waste</em> (damage the property's long-term value); pay current taxes and upkeep</td></tr>
<tr><td>After it ends</td><td>—</td><td>Property passes to the holder of the <em>remainder</em> or <em>reverts</em> to the grantor</td></tr>
</table>
<p>Other interests include <strong>leaseholds</strong> (a tenant's right to possess for a term) and <strong>easements</strong> (a right to use another's land, e.g. a right of way). Co-owners may hold as <em>tenants in common</em> (shares pass by will) or as <em>joint tenants</em> (a deceased owner's share passes to the survivors).</p>
<div class="callout"><span class="badge">Vietnam counterpart / Đối chiếu Việt Nam</span> The Civil Code 2015 also divides assets into immovables (bất động sản) and movables (động sản) and regulates a bailment-like contract for safekeeping of property (hợp đồng gửi giữ tài sản). The key difference is land: land belongs to the entire people with the State as representative owner, so individuals and companies hold <strong>land-use rights</strong>, not a fee simple; houses and other assets attached to land can be owned. Land-use rights are governed by the Land Law 2024 — check the current version and implementing decrees on vbpl.vn.</div>`,
    `<span class="eyebrow">LAW102 · Phần 1 · Bài 1.4</span>
<h2>Động sản, gửi giữ &amp; bất động sản</h2>
<p class="lead"><strong>Tài sản</strong> về mặt pháp lý không phải bản thân đồ vật mà là một <strong>bó quyền</strong> đối với nó: chiếm hữu, sử dụng, loại trừ người khác, bán, tặng cho hoặc để lại thừa kế. Luật chia tài sản thành <strong>bất động sản</strong> (đất đai và những gì gắn liền cố định với đất) và <strong>động sản</strong> (mọi thứ còn lại).</p>
<h3>1. Động sản</h3>
<p>Động sản có thể <strong>hữu hình</strong> (xe, hàng tồn kho, máy tính) hoặc <strong>vô hình</strong> — các quyền như cổ phần, khoản phải thu, sáng chế, quyền tác giả và nhãn hiệu.</p>
<h3>2. Các cách xác lập quyền sở hữu động sản</h3>
<table>
<tr><th>Cách</th><th>Quy tắc</th></tr>
<tr><td>Mua</td><td>Cách thông thường — qua hợp đồng mua bán (Phần 2)</td></tr>
<tr><td>Tặng cho</td><td>Cần <strong>ý định</strong> tặng cho, <strong>chuyển giao</strong> và <strong>chấp nhận</strong>; lời hứa sẽ tặng trong tương lai chưa phải tặng cho hoàn tất</td></tr>
<tr><td>Di chúc hoặc thừa kế</td><td>Chuyển giao khi chủ sở hữu chết</td></tr>
<tr><td>Sáp nhập (accession)</td><td>Giá trị tăng nhờ công sức hay vật liệu thêm vào (vd sơn lại xe); thường chủ của vật ban đầu vẫn giữ quyền sở hữu</td></tr>
<tr><td>Trộn lẫn (confusion)</td><td>Hàng cùng loại của nhiều chủ bị trộn (thóc trong một silo) — các chủ cùng sở hữu theo tỷ lệ</td></tr>
<tr><td>Tạo ra</td><td>Làm ra vật mới — một thiết kế, một cuốn sách, một sáng chế</td></tr>
<tr><td>Nhặt được</td><td>Vật <em>đánh rơi</em>: người nhặt có quyền mạnh hơn mọi người trừ chủ thật; vật <em>để quên</em> (cố ý đặt xuống rồi quên) thường do chủ nơi đó giữ; vật <em>bị từ bỏ</em> thuộc về người đầu tiên chiếm hữu</td></tr>
</table>
<h3>3. Gửi giữ tài sản (bailment)</h3>
<p><strong>Bailment</strong> là việc <strong>bên giao (bailor)</strong> chuyển <em>quyền chiếm hữu</em> (không phải quyền sở hữu) động sản cho <strong>bên nhận (bailee)</strong> vì một mục đích, với hiểu biết rằng chính tài sản đó sẽ được trả lại hoặc xử lý theo chỉ dẫn. Ví dụ: để xe ở tiệm sửa, thuê thiết bị, gửi hàng vào kho, cho mượn sách.</p>
<table>
<tr><th>Loại</th><th>Ví dụ</th><th>Mức cẩn trọng của bên nhận (quy tắc truyền thống)</th></tr>
<tr><td>Chỉ vì lợi ích bên giao</td><td>Bạn trông hộ xe đạp của hàng xóm không lấy tiền</td><td>Cẩn trọng tối thiểu — chịu trách nhiệm khi cẩu thả nghiêm trọng</td></tr>
<tr><td>Chỉ vì lợi ích bên nhận</td><td>Bạn mượn máy ảnh của bạn bè không mất tiền</td><td>Cẩn trọng cao (đặc biệt)</td></tr>
<tr><td>Cùng có lợi</td><td>Gửi xe có trả tiền, sửa chữa, cho thuê, lưu kho</td><td>Cẩn trọng thông thường (hợp lý)</td></tr>
</table>
<p>Nhiều toà hiện đại chỉ hỏi bên nhận có cẩn trọng hợp lý trong hoàn cảnh đó không. <strong>Gửi giữ đặc biệt</strong> — người vận chuyển công cộng và chủ khách sạn — chịu trách nhiệm nghiêm ngặt hơn nhiều, trừ các ngoại lệ được thừa nhận như thiên tai. Bên nhận có thể giới hạn trách nhiệm bằng thông báo hay hợp đồng rõ ràng, trong giới hạn luật cho phép.</p>
<h3>4. Bất động sản</h3>
<p>Bất động sản gồm đất, nhà, cây trồng trên đất và <strong>vật gắn liền (fixture)</strong> — động sản được gắn vào đến mức trở thành một phần của bất động sản. Toà xác định một vật có phải fixture không bằng cách xét mức độ <em>gắn kết</em> (tháo ra có gây hư hỏng không?), mức độ <em>thích ứng</em> (có làm riêng cho bất động sản này không?) và <em>ý định</em> của người gắn nó.</p>
<h3>5. Các loại quyền đối với đất: fee simple và life estate</h3>
<table>
<tr><th></th><th>Fee simple (tuyệt đối)</th><th>Life estate (quyền trọn đời)</th></tr>
<tr><td>Thời hạn</td><td>Không giới hạn — quyền lớn nhất luật thừa nhận</td><td>Tính theo cuộc đời của một người</td></tr>
<tr><td>Quyền</td><td>Sử dụng, bán, cho thuê, thế chấp, tặng cho, để lại theo di chúc; truyền cho người thừa kế</td><td>Sử dụng, hưởng lợi suốt đời; chỉ chuyển nhượng được quyền trọn đời đó</td></tr>
<tr><td>Nghĩa vụ</td><td>Tuân theo luật (quy hoạch, thuế, quyền địa dịch)</td><td>Không được <em>làm hao huỷ</em> (giảm giá trị lâu dài của tài sản); nộp thuế và bảo trì hiện hành</td></tr>
<tr><td>Khi chấm dứt</td><td>—</td><td>Tài sản chuyển cho người có <em>quyền kế tiếp</em> (remainder) hoặc <em>trở về</em> người chuyển giao</td></tr>
</table>
<p>Các quyền khác gồm <strong>quyền thuê</strong> (quyền chiếm hữu của người thuê trong một thời hạn) và <strong>quyền địa dịch</strong> (quyền dùng đất của người khác, vd lối đi qua). Đồng sở hữu có thể theo dạng <em>tenancy in common</em> (phần của mỗi người để lại theo di chúc được) hoặc <em>joint tenancy</em> (phần của người chết chuyển cho những người còn sống).</p>
<div class="callout"><span class="badge">Đối chiếu Việt Nam</span> Bộ luật Dân sự 2015 cũng chia tài sản thành bất động sản và động sản, và quy định hợp đồng gửi giữ tài sản gần với bailment. Khác biệt then chốt là đất đai: đất thuộc sở hữu toàn dân do Nhà nước đại diện chủ sở hữu, nên cá nhân và doanh nghiệp có <strong>quyền sử dụng đất</strong>, không có fee simple; nhà ở và tài sản khác gắn liền với đất thì được sở hữu. Quyền sử dụng đất do Luật Đất đai 2024 điều chỉnh — kiểm bản đang có hiệu lực và các nghị định hướng dẫn trên vbpl.vn.</div>`,
  ]]);

const q1 = quiz('law102-quiz-1', 'Quiz 1 — Law, courts, torts & property|||Quiz 1 — Luật, toà án, tort & tài sản', [
  { id: 'q1', question: 'Which of the following is NOT one of the four main sources of US law?|||Điều nào sau đây KHÔNG phải một trong bốn nguồn chính của luật Mỹ?', options: ['Constitutions|||Hiến pháp', 'Statutes passed by legislatures|||Luật do cơ quan lập pháp ban hành', 'Rules of administrative agencies|||Quy định của cơ quan hành chính', 'Articles written by law professors|||Bài viết của giáo sư luật'], correctIndex: 3, explanation: 'Constitutions, statutes, case law and administrative regulations are the primary sources; academic writing is only a secondary, persuasive source.|||Hiến pháp, luật thành văn, án lệ và quy định hành chính là nguồn chính; bài viết học thuật chỉ là nguồn thứ cấp có tính thuyết phục.' },
  { id: 'q2', question: 'A plaintiff from Ohio sues a defendant from Texas on a state-law contract claim. For a US district court to have diversity jurisdiction, the amount in controversy must exceed…|||Nguyên đơn ở Ohio kiện bị đơn ở Texas về một yêu cầu hợp đồng theo luật bang. Để toà quận liên bang có thẩm quyền theo khác biệt quốc tịch bang, giá trị tranh chấp phải vượt…', options: ['$10,000|||10.000 $', '$50,000|||50.000 $', '$75,000|||75.000 $', '$1,000,000|||1.000.000 $'], correctIndex: 2, explanation: 'Diversity jurisdiction requires citizens of different states and an amount in controversy exceeding $75,000.|||Thẩm quyền theo khác biệt quốc tịch bang cần các bên là công dân của các bang khác nhau và giá trị tranh chấp vượt 75.000 $.' },
  { id: 'q3', question: 'Lan borrows her friend’s camera free of charge for her own holiday. Under the traditional rule, what standard of care does Lan owe as bailee?|||Lan mượn máy ảnh của bạn không mất tiền để dùng cho kỳ nghỉ của mình. Theo quy tắc truyền thống, Lan (bên nhận) phải cẩn trọng ở mức nào?', options: ['Slight care only|||Chỉ cẩn trọng tối thiểu', 'Great (extraordinary) care|||Cẩn trọng cao (đặc biệt)', 'Ordinary care|||Cẩn trọng thông thường', 'No duty, because no money was paid|||Không có nghĩa vụ vì không trả tiền'], correctIndex: 1, explanation: 'A bailment for the sole benefit of the bailee traditionally requires great care, because the bailee receives all the benefit.|||Gửi giữ chỉ vì lợi ích của bên nhận theo truyền thống đòi hỏi cẩn trọng cao, vì bên nhận hưởng toàn bộ lợi ích.' },
]);

const u5 = doc('law102-2-1-nature-classes-contracts', '2.1 — Ch 5, 7 & 11 · Nature and classes of contracts, capacity & form (Unit 5)|||2.1 — Ch 5, 7 & 11 · Bản chất, phân loại hợp đồng, năng lực & hình thức (Unit 5)',
  'Hợp đồng và thoả thuận; các yếu tố của hợp đồng hợp lệ; phân loại hợp đồng (express/implied, bilateral/unilateral, valid/void/voidable/unenforceable, executed/executory, quasi contract); năng lực của người chưa thành niên, người say, người mất năng lực; Statute of Frauds và UCC; đối chiếu BLDS 2015.',
  [[
    `<span class="eyebrow">LAW102 · Part 2 · Lesson 2.1</span>
<h2>Nature and classes of contracts, capacity &amp; form</h2>
<p class="lead">A <strong>contract</strong> is an agreement that the law will enforce. Every contract is an agreement, but not every agreement is a contract: a promise to meet a friend for dinner creates no legal obligation.</p>
<h3>1. Elements of a valid contract</h3>
<ol>
<li><strong>Offer and acceptance</strong> — mutual assent (Lesson 2.2).</li>
<li><strong>Competent parties</strong> — legal capacity to contract.</li>
<li><strong>Genuine assent</strong> — no fraud, duress, undue influence or material mistake.</li>
<li><strong>Consideration</strong> — each side gives something of legal value in a bargained-for exchange (a promise, an act or a forbearance).</li>
<li><strong>Legal purpose</strong> — an agreement to do something illegal is void.</li>
<li><strong>Form</strong> — where the law requires a writing (Statute of Frauds, below).</li>
</ol>
<h3>2. Classes of contracts</h3>
<table>
<tr><th>By…</th><th>Classes</th><th>Example</th></tr>
<tr><td>How assent is shown</td><td><strong>Express</strong> (words, spoken or written) · <strong>implied in fact</strong> (inferred from conduct)</td><td>A signed lease · taking a seat at a barber's and getting a haircut</td></tr>
<tr><td>What is exchanged</td><td><strong>Bilateral</strong> (a promise for a promise) · <strong>unilateral</strong> (a promise for an act)</td><td>Supply agreement · "$500 reward to whoever finds my dog"</td></tr>
<tr><td>Legal effect</td><td><strong>Valid</strong> · <strong>void</strong> (no legal effect at all) · <strong>voidable</strong> (one party may cancel) · <strong>unenforceable</strong> (valid but a court will not enforce it)</td><td>Normal sale · contract to commit a crime · contract signed by a minor or induced by fraud · oral land sale; claim barred by the statute of limitations</td></tr>
<tr><td>Performance</td><td><strong>Executed</strong> (fully performed) · <strong>executory</strong> (something remains to be done)</td><td>Paid-for coffee handed over · order for next month's delivery</td></tr>
<tr><td>Formality</td><td><strong>Formal</strong> (special form, e.g. negotiable instruments) · <strong>simple/informal</strong></td><td>A cheque · most business contracts</td></tr>
</table>
<p>A <strong>quasi contract</strong> (implied in law) is not a real contract. The court imposes an obligation to pay the reasonable value of a benefit in order to prevent <strong>unjust enrichment</strong> — e.g. a doctor gives emergency care to an unconscious person, or a company is paid twice by mistake.</p>
<h3>3. Capacity to contract (general rules)</h3>
<ul>
<li><strong>Minors</strong> (under the age of majority — 18 in most states): contracts are generally <strong>voidable at the minor's option</strong>. The minor may <em>disaffirm</em> during minority and for a reasonable time after reaching majority; <em>ratification</em> after majority (express, or by conduct such as continuing to use the goods) makes the contract binding. A minor is liable for the reasonable value of <strong>necessaries</strong> (food, clothing, shelter, medical care). The adult party cannot avoid the contract.</li>
<li><strong>Intoxicated persons</strong>: a contract is voidable if the person was so intoxicated that they could not understand the transaction; they must disaffirm promptly on becoming sober.</li>
<li><strong>Mentally incompetent persons</strong>: contracts made after a court has declared the person incompetent are <strong>void</strong>; otherwise, contracts made while unable to understand the nature of the transaction are generally <strong>voidable</strong>.</li>
</ul>
<h3>4. Form: the Statute of Frauds</h3>
<p>Most contracts may be oral. The <strong>Statute of Frauds</strong> requires certain contracts to be evidenced by a writing signed by the party against whom enforcement is sought:</p>
<ol>
<li>contracts for the sale of an interest in <strong>land</strong>;</li>
<li>contracts that <strong>cannot be performed within one year</strong> of their making;</li>
<li>promises to pay the <strong>debt of another</strong> (guarantees, suretyship);</li>
<li>promises by an executor or administrator to pay the estate's debts personally;</li>
<li>promises made in consideration of <strong>marriage</strong>;</li>
<li>under <strong>UCC §2-201</strong>, contracts for the <strong>sale of goods for $500 or more</strong>.</li>
</ol>
<p>The UCC relaxes the rule: the writing may omit terms other than quantity; between <strong>merchants</strong>, a written confirmation binds the recipient unless it objects within 10 days; and oral contracts are enforceable for specially manufactured goods, for goods paid for or received, and where the party admits the contract in court. Once a contract is written, the <strong>parol evidence rule</strong> generally bars earlier or contemporaneous oral terms that contradict it.</p>
<h3>5. Common law or UCC?</h3>
<p><strong>UCC Article 2</strong> governs contracts for the <strong>sale of goods</strong> (movable tangible things), with special rules for merchants. The <strong>common law</strong> governs services, employment, real estate and intangibles. For mixed contracts, many courts ask which element is predominant.</p>
<div class="callout"><span class="badge">Vietnam counterpart / Đối chiếu Việt Nam</span> The Civil Code 2015 defines a contract as an agreement between parties to establish, change or terminate civil rights and obligations. A transaction is valid when the parties have appropriate legal capacity, participate voluntarily, and the purpose and content do not violate prohibitions of law or social ethics; form matters only where the law requires it. Vietnamese law has <strong>no consideration requirement</strong>. Minors act through representatives or with consent, except for everyday transactions suited to their age. Commercial contracts are also governed by the Commercial Law 2005. Check the current provisions on vbpl.vn.</div>`,
    `<span class="eyebrow">LAW102 · Phần 2 · Bài 2.1</span>
<h2>Bản chất, phân loại hợp đồng, năng lực &amp; hình thức</h2>
<p class="lead"><strong>Hợp đồng</strong> là thoả thuận được pháp luật bảo đảm thực thi. Mọi hợp đồng đều là thoả thuận, nhưng không phải thoả thuận nào cũng là hợp đồng: hẹn bạn đi ăn tối không tạo ra nghĩa vụ pháp lý.</p>
<h3>1. Các yếu tố của hợp đồng hợp lệ</h3>
<ol>
<li><strong>Đề nghị và chấp nhận</strong> — sự đồng thuận của các bên (Bài 2.2).</li>
<li><strong>Chủ thể có năng lực</strong> — có năng lực pháp lý để giao kết.</li>
<li><strong>Ý chí thật</strong> — không có gian lận, cưỡng ép, lạm dụng ảnh hưởng hay nhầm lẫn trọng yếu.</li>
<li><strong>Đối giá (consideration)</strong> — mỗi bên đưa ra thứ có giá trị pháp lý trong một trao đổi có mặc cả (một lời hứa, một hành vi hoặc việc kiềm chế không làm).</li>
<li><strong>Mục đích hợp pháp</strong> — thoả thuận làm việc bất hợp pháp là vô hiệu.</li>
<li><strong>Hình thức</strong> — khi luật đòi hỏi văn bản (Statute of Frauds, bên dưới).</li>
</ol>
<h3>2. Phân loại hợp đồng</h3>
<table>
<tr><th>Theo…</th><th>Loại</th><th>Ví dụ</th></tr>
<tr><td>Cách thể hiện ý chí</td><td><strong>Rõ ràng (express)</strong> (bằng lời nói hay văn bản) · <strong>ngụ ý thực tế</strong> (suy ra từ hành vi)</td><td>Hợp đồng thuê có chữ ký · ngồi vào ghế tiệm cắt tóc và được cắt tóc</td></tr>
<tr><td>Thứ được trao đổi</td><td><strong>Song vụ (bilateral)</strong> (hứa đổi hứa) · <strong>đơn vụ (unilateral)</strong> (hứa đổi hành vi)</td><td>Hợp đồng cung ứng · "Thưởng 500 $ cho ai tìm được chó của tôi"</td></tr>
<tr><td>Hiệu lực pháp lý</td><td><strong>Hợp lệ</strong> · <strong>vô hiệu (void)</strong> (không có hiệu lực gì) · <strong>có thể bị huỷ (voidable)</strong> (một bên có quyền huỷ) · <strong>không thể thực thi (unenforceable)</strong> (hợp lệ nhưng toà không cưỡng chế)</td><td>Mua bán bình thường · hợp đồng để phạm tội · hợp đồng do người chưa thành niên ký hoặc bị lừa dối · bán đất bằng miệng; yêu cầu hết thời hiệu</td></tr>
<tr><td>Việc thực hiện</td><td><strong>Đã thực hiện xong (executed)</strong> · <strong>chưa thực hiện xong (executory)</strong></td><td>Ly cà phê đã trả tiền và đã giao · đơn đặt hàng giao tháng sau</td></tr>
<tr><td>Hình thức</td><td><strong>Trang trọng (formal)</strong> (hình thức đặc biệt, vd công cụ chuyển nhượng) · <strong>thông thường</strong></td><td>Một tấm séc · phần lớn hợp đồng kinh doanh</td></tr>
</table>
<p><strong>Quasi contract</strong> (hợp đồng ngụ ý theo luật, "chuẩn hợp đồng") không phải hợp đồng thật. Toà áp đặt nghĩa vụ trả giá trị hợp lý của lợi ích nhận được để ngăn <strong>được lợi bất chính</strong> — vd bác sĩ cấp cứu cho người bất tỉnh, hay một công ty được trả tiền hai lần do nhầm lẫn.</p>
<h3>3. Năng lực giao kết (quy tắc chung)</h3>
<ul>
<li><strong>Người chưa thành niên</strong> (dưới tuổi thành niên — 18 ở đa số bang): hợp đồng nói chung <strong>có thể bị huỷ theo lựa chọn của người chưa thành niên</strong>. Họ có thể <em>từ chối hiệu lực</em> trong thời gian chưa thành niên và trong thời hạn hợp lý sau khi thành niên; <em>xác nhận</em> sau khi thành niên (bằng lời, hoặc bằng hành vi như tiếp tục dùng hàng) làm hợp đồng ràng buộc. Người chưa thành niên phải trả giá trị hợp lý của <strong>nhu yếu phẩm</strong> (thức ăn, quần áo, chỗ ở, chăm sóc y tế). Bên đã thành niên không được huỷ hợp đồng.</li>
<li><strong>Người say</strong>: hợp đồng có thể bị huỷ nếu người đó say tới mức không hiểu được giao dịch; họ phải từ chối hiệu lực ngay khi tỉnh.</li>
<li><strong>Người mất năng lực tâm thần</strong>: hợp đồng giao kết sau khi toà đã tuyên bố mất năng lực là <strong>vô hiệu</strong>; ngoài ra, hợp đồng giao kết khi không hiểu được bản chất giao dịch nói chung <strong>có thể bị huỷ</strong>.</li>
</ul>
<h3>4. Hình thức: Statute of Frauds</h3>
<p>Phần lớn hợp đồng có thể bằng miệng. <strong>Statute of Frauds</strong> (luật chống gian lận) đòi một số hợp đồng phải có văn bản chứng minh, có chữ ký của bên bị yêu cầu thực hiện:</p>
<ol>
<li>hợp đồng bán quyền lợi đối với <strong>đất đai</strong>;</li>
<li>hợp đồng <strong>không thể thực hiện xong trong một năm</strong> kể từ khi giao kết;</li>
<li>lời hứa trả <strong>nợ thay người khác</strong> (bảo lãnh);</li>
<li>lời hứa của người quản lý di sản trả nợ của di sản bằng tiền riêng;</li>
<li>lời hứa đổi lấy <strong>hôn nhân</strong>;</li>
<li>theo <strong>UCC §2-201</strong>, hợp đồng <strong>mua bán hàng hoá từ 500 $ trở lên</strong>.</li>
</ol>
<p>UCC nới lỏng quy tắc: văn bản có thể thiếu các điều khoản khác ngoài số lượng; giữa các <strong>thương nhân</strong>, văn bản xác nhận ràng buộc bên nhận nếu bên đó không phản đối trong 10 ngày; và hợp đồng miệng vẫn thực thi được với hàng sản xuất theo đặt hàng riêng, hàng đã trả tiền hoặc đã nhận, và khi một bên thừa nhận hợp đồng trước toà. Khi hợp đồng đã lập thành văn bản, <strong>quy tắc chứng cứ ngoài văn bản (parol evidence rule)</strong> nói chung không cho viện dẫn thoả thuận miệng trước hoặc cùng lúc trái với văn bản.</p>
<h3>5. Thông luật hay UCC?</h3>
<p><strong>Điều khoản 2 của UCC</strong> điều chỉnh hợp đồng <strong>mua bán hàng hoá</strong> (động sản hữu hình), có quy tắc riêng cho thương nhân. <strong>Thông luật</strong> điều chỉnh dịch vụ, lao động, bất động sản và tài sản vô hình. Với hợp đồng hỗn hợp, nhiều toà xét yếu tố nào chiếm ưu thế.</p>
<div class="callout"><span class="badge">Đối chiếu Việt Nam</span> Bộ luật Dân sự 2015 định nghĩa hợp đồng là sự thoả thuận giữa các bên về việc xác lập, thay đổi hoặc chấm dứt quyền, nghĩa vụ dân sự. Giao dịch có hiệu lực khi chủ thể có năng lực phù hợp, hoàn toàn tự nguyện, mục đích và nội dung không vi phạm điều cấm của luật, không trái đạo đức xã hội; hình thức chỉ là điều kiện khi luật có quy định. Luật Việt Nam <strong>không đòi hỏi yếu tố consideration</strong>. Người chưa thành niên giao dịch qua người đại diện hoặc cần sự đồng ý, trừ giao dịch phục vụ nhu cầu sinh hoạt hằng ngày phù hợp lứa tuổi. Hợp đồng thương mại còn chịu Luật Thương mại 2005. Kiểm quy định hiện hành trên vbpl.vn.</div>`,
  ]]);

const u6 = doc('law102-2-2-offer-acceptance', '2.2 — Ch 6 · Offer and acceptance (Unit 6)|||2.2 — Ch 6 · Đề nghị và chấp nhận (Unit 6)',
  'Ba yêu cầu của một đề nghị hợp lệ; lời mời đề nghị (quảng cáo, catalogue, bảng giá) và ngoại lệ; thời hạn và các cách chấm dứt đề nghị, option và firm offer theo UCC; chấp nhận, mirror image rule và UCC 2-207, phản đề nghị, mailbox rule; đối chiếu giao kết hợp đồng theo BLDS 2015.',
  [[
    `<span class="eyebrow">LAW102 · Part 2 · Lesson 2.2</span>
<h2>Offer and acceptance</h2>
<p class="lead">A contract is formed when one party (the <strong>offeror</strong>) makes an offer and the other (the <strong>offeree</strong>) accepts it. Most contract disputes on the exam turn on one question: <em>was there an offer, and was it accepted before it ended?</em></p>
<h3>1. Requirements of a valid offer</h3>
<ol>
<li><strong>Serious intent</strong> — judged objectively, by what a reasonable person would understand. Statements made in jest, anger or excitement, and preliminary negotiations, are not offers.</li>
<li><strong>Definite and certain terms</strong> — parties, subject matter, quantity, price, time. Under the UCC a sales contract does not fail for indefiniteness if the parties intended to contract and a court can give an appropriate remedy; missing terms such as price or delivery can be filled with reasonable ones.</li>
<li><strong>Communicated to the offeree</strong> — you cannot accept an offer you do not know about.</li>
</ol>
<h3>2. Invitations to make an offer</h3>
<p>Most <strong>advertisements, catalogues, price lists, circulars</strong> and window displays are only <strong>invitations to negotiate</strong>: the customer who orders makes the offer, which the seller may accept or reject. Likewise, in an auction "with reserve" each bid is an offer and the auctioneer accepts with the fall of the hammer. <strong>Exception:</strong> an advertisement that is clear, definite and leaves nothing open for negotiation can be an offer — e.g. a reward notice. In the classic English case <em>Carlill v Carbolic Smoke Ball Co</em> (1893), an advertisement promising a payment to anyone who used the product as directed and still caught influenza was held to be a <strong>unilateral offer to the world</strong>, accepted by performing the conditions.</p>
<h3>3. How long an offer lasts — termination</h3>
<table>
<tr><th>Ground</th><th>Rule</th></tr>
<tr><td>Revocation by the offeror</td><td>Allowed any time before acceptance, effective when <strong>received</strong> by the offeree</td></tr>
<tr><td>Rejection by the offeree</td><td>Ends the offer, effective when received by the offeror</td></tr>
<tr><td>Counteroffer</td><td>A rejection plus a new offer — the original offer is dead</td></tr>
<tr><td>Lapse of time</td><td>At the stated time, or after a reasonable time if none is stated</td></tr>
<tr><td>Operation of law</td><td>Death or insanity of either party, destruction of the subject matter, or supervening illegality</td></tr>
</table>
<p>Two kinds of offer cannot be revoked at will: an <strong>option contract</strong> (the offeree pays consideration to keep the offer open) and, under <strong>UCC §2-205</strong>, a <strong>firm offer</strong> — a merchant's signed written promise to keep an offer to buy or sell goods open, irrevocable without consideration for the stated time or, if none, a reasonable time, but never more than three months.</p>
<h3>4. Acceptance</h3>
<ul>
<li>Only the person to whom the offer was made can accept.</li>
<li><strong>Silence is generally not acceptance</strong>, unless the parties' past dealings or agreement make it so.</li>
<li><strong>Mirror image rule</strong> (common law): the acceptance must match the offer exactly; any change is a <strong>counteroffer</strong>.</li>
<li><strong>UCC §2-207</strong> (sale of goods): a definite expression of acceptance operates as an acceptance even if it states additional or different terms, unless it is expressly conditional on the offeror's assent to them. Between merchants, additional terms become part of the contract unless the offer limits acceptance to its terms, they materially alter it, or the offeror objects within a reasonable time; for non-merchants they are mere proposals.</li>
</ul>
<h3>5. When acceptance takes effect — the mailbox rule</h3>
<p>Under the <strong>mailbox (deposited acceptance) rule</strong>, an acceptance sent by an authorised means — the same means the offer used or one the offer allows — is effective <strong>when dispatched</strong>, even if it is delayed or lost. Revocations and rejections, by contrast, are effective only when received. The offeror can override the rule by stating that acceptance counts only on receipt. Face-to-face and telephone acceptances take effect when heard; for email and other electronic messages, courts and statutes vary, so contracts often state when a message is deemed received.</p>
<div class="callout"><span class="badge">Vietnam counterpart / Đối chiếu Việt Nam</span> Under the Civil Code 2015, an offer is a proposal that clearly shows the intention to contract and to be bound, made to a specified party or to the public. An acceptance must accept the whole offer; an answer that modifies it is treated as a new offer. Silence counts as acceptance only if the parties agreed so or it is an established practice. Key contrast with the US: the contract is generally formed when the offeror <strong>receives</strong> the acceptance — a receipt rule, not a mailbox rule. Check the current provisions on contract formation on vbpl.vn.</div>`,
    `<span class="eyebrow">LAW102 · Phần 2 · Bài 2.2</span>
<h2>Đề nghị và chấp nhận</h2>
<p class="lead">Hợp đồng hình thành khi một bên (<strong>bên đề nghị</strong>) đưa ra đề nghị và bên kia (<strong>bên được đề nghị</strong>) chấp nhận. Phần lớn tranh chấp hợp đồng trong đề thi xoay quanh một câu hỏi: <em>có đề nghị không, và nó có được chấp nhận trước khi chấm dứt không?</em></p>
<h3>1. Yêu cầu của một đề nghị hợp lệ</h3>
<ol>
<li><strong>Ý định nghiêm túc</strong> — đánh giá khách quan, theo cách một người bình thường hiểu. Lời nói đùa, nói lúc giận hay phấn khích, và các cuộc thương lượng sơ bộ không phải là đề nghị.</li>
<li><strong>Điều khoản rõ ràng, xác định</strong> — các bên, đối tượng, số lượng, giá, thời gian. Theo UCC, hợp đồng mua bán không mất hiệu lực vì thiếu cụ thể nếu các bên có ý định giao kết và toà có thể đưa ra biện pháp khắc phục phù hợp; điều khoản còn thiếu như giá hay giao hàng có thể được bổ sung bằng mức hợp lý.</li>
<li><strong>Được thông tin tới bên được đề nghị</strong> — không thể chấp nhận một đề nghị mà mình không biết.</li>
</ol>
<h3>2. Lời mời đề nghị</h3>
<p>Phần lớn <strong>quảng cáo, catalogue, bảng giá, tờ rơi</strong> và hàng bày trong tủ kính chỉ là <strong>lời mời thương lượng</strong>: khách đặt hàng mới là người đưa ra đề nghị, người bán có thể chấp nhận hay từ chối. Tương tự, trong đấu giá "có giá sàn", mỗi lần trả giá là một đề nghị và người điều hành chấp nhận khi gõ búa. <strong>Ngoại lệ:</strong> quảng cáo rõ ràng, xác định, không để lại gì cần thương lượng có thể là đề nghị — vd thông báo treo thưởng. Trong án kinh điển của Anh <em>Carlill v Carbolic Smoke Ball Co</em> (1893), quảng cáo hứa trả tiền cho bất kỳ ai dùng sản phẩm đúng hướng dẫn mà vẫn mắc cúm được coi là <strong>đề nghị đơn vụ gửi tới công chúng</strong>, được chấp nhận bằng việc thực hiện các điều kiện.</p>
<h3>3. Đề nghị kéo dài bao lâu — các cách chấm dứt</h3>
<table>
<tr><th>Căn cứ</th><th>Quy tắc</th></tr>
<tr><td>Bên đề nghị thu hồi</td><td>Được phép bất cứ lúc nào trước khi có chấp nhận, có hiệu lực khi bên được đề nghị <strong>nhận được</strong></td></tr>
<tr><td>Bên được đề nghị từ chối</td><td>Chấm dứt đề nghị, có hiệu lực khi bên đề nghị nhận được</td></tr>
<tr><td>Phản đề nghị</td><td>Là từ chối cộng một đề nghị mới — đề nghị ban đầu chấm dứt</td></tr>
<tr><td>Hết thời hạn</td><td>Vào thời điểm đã nêu, hoặc sau một thời gian hợp lý nếu không nêu</td></tr>
<tr><td>Theo luật</td><td>Một bên chết hoặc mất trí, đối tượng bị huỷ hoại, hoặc việc giao kết trở nên bất hợp pháp</td></tr>
</table>
<p>Hai loại đề nghị không thể tuỳ ý thu hồi: <strong>hợp đồng quyền chọn (option)</strong> (bên được đề nghị trả một khoản đối giá để giữ đề nghị) và, theo <strong>UCC §2-205</strong>, <strong>đề nghị cố định (firm offer)</strong> — cam kết bằng văn bản có chữ ký của thương nhân giữ nguyên đề nghị mua hay bán hàng hoá; nó không thể bị thu hồi dù không có đối giá trong thời hạn đã nêu hoặc, nếu không nêu, trong thời gian hợp lý, nhưng không quá ba tháng.</p>
<h3>4. Chấp nhận</h3>
<ul>
<li>Chỉ người được đề nghị mới có quyền chấp nhận.</li>
<li><strong>Im lặng nói chung không phải là chấp nhận</strong>, trừ khi quan hệ giao dịch trước đó hay thoả thuận của các bên quy định như vậy.</li>
<li><strong>Quy tắc hình ảnh phản chiếu (mirror image rule)</strong> (thông luật): chấp nhận phải khớp hoàn toàn với đề nghị; mọi thay đổi là <strong>phản đề nghị</strong>.</li>
<li><strong>UCC §2-207</strong> (mua bán hàng hoá): một biểu hiện chấp nhận rõ ràng vẫn là chấp nhận dù nêu thêm điều khoản bổ sung hay khác, trừ khi nó được nói rõ là chỉ có hiệu lực nếu bên đề nghị đồng ý các điều khoản đó. Giữa các thương nhân, điều khoản bổ sung trở thành một phần hợp đồng trừ khi đề nghị giới hạn việc chấp nhận vào đúng các điều khoản của nó, điều khoản đó làm thay đổi cơ bản đề nghị, hoặc bên đề nghị phản đối trong thời gian hợp lý; với người không phải thương nhân, chúng chỉ là đề xuất.</li>
</ul>
<h3>5. Chấp nhận có hiệu lực khi nào — mailbox rule</h3>
<p>Theo <strong>quy tắc hộp thư (mailbox rule)</strong>, chấp nhận gửi bằng phương thức được phép — cùng phương thức với đề nghị hoặc phương thức đề nghị cho phép — có hiệu lực <strong>khi được gửi đi</strong>, kể cả khi bị chậm hay thất lạc. Ngược lại, thu hồi và từ chối chỉ có hiệu lực khi được nhận. Bên đề nghị có thể loại trừ quy tắc này bằng cách nêu rõ chấp nhận chỉ có hiệu lực khi nhận được. Chấp nhận trực tiếp hay qua điện thoại có hiệu lực khi được nghe; với email và tin nhắn điện tử, toà án và luật các nơi khác nhau, nên hợp đồng thường quy định khi nào một thông điệp được coi là đã nhận.</p>
<div class="callout"><span class="badge">Đối chiếu Việt Nam</span> Theo Bộ luật Dân sự 2015, đề nghị giao kết hợp đồng là việc thể hiện rõ ý định giao kết và chịu sự ràng buộc về đề nghị, gửi tới bên đã được xác định hoặc tới công chúng. Chấp nhận phải là trả lời chấp nhận toàn bộ nội dung đề nghị; trả lời có sửa đổi, bổ sung được coi là đề nghị mới. Im lặng chỉ là chấp nhận khi có thoả thuận hoặc theo thói quen đã được xác lập giữa các bên. Khác biệt then chốt với Mỹ: hợp đồng nói chung được giao kết khi bên đề nghị <strong>nhận được</strong> chấp nhận — quy tắc tiếp nhận, không phải mailbox rule. Kiểm các quy định hiện hành về giao kết hợp đồng trên vbpl.vn.</div>`,
  ]]);

const u7 = doc('law102-2-3-third-parties', '2.3 — Ch 12 · Third parties and contracts (Unit 7)|||2.3 — Ch 12 · Bên thứ ba và hợp đồng (Unit 7)',
  'Nguyên tắc quan hệ hợp đồng (privity); người thụ hưởng thứ ba (creditor, donee, incidental); chuyển nhượng quyền (assignment) và giới hạn; chuyển giao nghĩa vụ (delegation); novation; nghĩa vụ joint, several, joint and several; đối chiếu chuyển giao quyền, nghĩa vụ, nghĩa vụ liên đới và đại diện theo BLDS 2015.',
  [[
    `<span class="eyebrow">LAW102 · Part 2 · Lesson 2.3</span>
<h2>Third parties and contracts</h2>
<p class="lead">As a general rule only the parties to a contract have rights and duties under it — this relationship is called <strong>privity of contract</strong>. There are three important ways outsiders become involved: they may be intended to benefit, rights may be transferred to them, or duties may be handed to them.</p>
<h3>1. Third-party beneficiaries</h3>
<table>
<tr><th>Type</th><th>Situation</th><th>Can the third party sue?</th></tr>
<tr><td><strong>Creditor beneficiary</strong> (intended)</td><td>The promisee owes the third party a debt and bargains for the promisor to pay it (e.g. a buyer of a business promises the seller to pay the seller's supplier)</td><td>Yes</td></tr>
<tr><td><strong>Donee beneficiary</strong> (intended)</td><td>The promisee wants to confer a gift (e.g. the named beneficiary of a life-insurance policy)</td><td>Yes</td></tr>
<tr><td><strong>Incidental beneficiary</strong></td><td>Benefits only by chance (e.g. neighbours whose property values rise when a firm contracts to build a new mall)</td><td>No</td></tr>
</table>
<h3>2. Assignment of rights</h3>
<p>An <strong>assignment</strong> transfers contract <em>rights</em> from the <strong>assignor</strong> to the <strong>assignee</strong>; the other party is the <strong>obligor</strong>. Most rights — above all the right to receive money — can be assigned without the obligor's consent, typically when a firm sells its accounts receivable. Rights generally <strong>cannot</strong> be assigned when:</p>
<ul>
<li>the contract is for personal services or depends on personal trust and skill;</li>
<li>assignment would materially change the obligor's duty or risk;</li>
<li>a statute forbids it; or the contract validly prohibits it (courts read such clauses narrowly, and the UCC generally allows the right to payment to be assigned despite them).</li>
</ul>
<p>The assignee "stands in the shoes" of the assignor: it takes the right <strong>subject to the defenses</strong> the obligor had against the assignor. The assignee should promptly give <strong>notice</strong> to the obligor — an obligor who pays the assignor before receiving notice is discharged.</p>
<h3>3. Delegation of duties</h3>
<p>A <strong>delegation</strong> transfers contract <em>duties</em> to a <strong>delegatee</strong>. Routine duties (delivering standard goods, paying money) can usually be delegated, but not duties that rely on personal skill or judgment — a famous artist's portrait, a surgeon's operation. Crucially, the <strong>delegator remains liable</strong> if the delegatee does not perform.</p>
<h3>4. Novation</h3>
<p>A <strong>novation</strong> is a new agreement, with the consent of all parties, that substitutes a new party for an original one and <strong>releases</strong> the original party completely. Example: Tenant A, landlord L and new tenant B agree that B takes over the lease and A is released. Without the release, it is only an assignment plus delegation and A is still liable.</p>
<h3>5. Joint, several, and joint and several contracts</h3>
<table>
<tr><th>Type</th><th>Meaning (general rule)</th></tr>
<tr><td><strong>Joint</strong></td><td>Two or more promisors are bound together as one unit for the whole obligation; traditionally the obligee had to sue them together</td></tr>
<tr><td><strong>Several</strong></td><td>Each promisor makes a separate promise and is liable only for its own share</td></tr>
<tr><td><strong>Joint and several</strong></td><td>The obligee may sue any one, some or all of them for the <strong>whole</strong> amount; a promisor who pays more than its share may seek contribution from the others</td></tr>
</table>
<p>Many states have modified the old procedural rules on joint obligations, so check the jurisdiction. In business, loan agreements and guarantees are usually drafted as joint and several to protect the creditor.</p>
<div class="callout"><span class="badge">Vietnam counterpart / Đối chiếu Việt Nam</span> The Civil Code 2015 recognises contracts for the benefit of a third person; it allows the <strong>transfer of the right to claim</strong> without the obligor's consent but with notice to the obligor, while the <strong>transfer of an obligation</strong> requires the obligee's consent — after which the new obligor takes over, an effect close to a novation. Under <strong>joint obligations</strong> (nghĩa vụ liên đới) the obligee may require any co-obligor to perform the whole. Representation (đại diện) is set out in Chapter IX of Part One. Check the current provisions on vbpl.vn.</div>`,
    `<span class="eyebrow">LAW102 · Phần 2 · Bài 2.3</span>
<h2>Bên thứ ba và hợp đồng</h2>
<p class="lead">Theo quy tắc chung, chỉ các bên của hợp đồng mới có quyền và nghĩa vụ theo hợp đồng — quan hệ này gọi là <strong>privity of contract</strong> (tính tương đối của hợp đồng). Có ba cách quan trọng khiến người ngoài dính vào: họ được chủ ý cho hưởng lợi, quyền được chuyển cho họ, hoặc nghĩa vụ được giao cho họ.</p>
<h3>1. Người thụ hưởng thứ ba</h3>
<table>
<tr><th>Loại</th><th>Tình huống</th><th>Người thứ ba có quyền khởi kiện?</th></tr>
<tr><td><strong>Người thụ hưởng là chủ nợ</strong> (có chủ ý)</td><td>Bên nhận lời hứa nợ người thứ ba và thoả thuận để bên hứa trả khoản nợ đó (vd người mua lại một cơ sở kinh doanh hứa với người bán sẽ trả nợ cho nhà cung cấp của người bán)</td><td>Có</td></tr>
<tr><td><strong>Người thụ hưởng được tặng cho</strong> (có chủ ý)</td><td>Bên nhận lời hứa muốn tặng một lợi ích (vd người thụ hưởng ghi tên trong hợp đồng bảo hiểm nhân thọ)</td><td>Có</td></tr>
<tr><td><strong>Người thụ hưởng ngẫu nhiên</strong></td><td>Chỉ hưởng lợi tình cờ (vd hàng xóm có nhà tăng giá khi một công ty ký hợp đồng xây trung tâm thương mại mới)</td><td>Không</td></tr>
</table>
<h3>2. Chuyển nhượng quyền (assignment)</h3>
<p><strong>Assignment</strong> chuyển <em>quyền</em> theo hợp đồng từ <strong>bên chuyển nhượng</strong> sang <strong>bên nhận chuyển nhượng</strong>; bên kia gọi là <strong>bên có nghĩa vụ</strong>. Phần lớn quyền — nhất là quyền nhận tiền — có thể chuyển nhượng mà không cần bên có nghĩa vụ đồng ý, điển hình khi doanh nghiệp bán khoản phải thu. Quyền nói chung <strong>không</strong> chuyển nhượng được khi:</p>
<ul>
<li>hợp đồng là dịch vụ cá nhân hoặc dựa trên sự tin cậy và kỹ năng riêng;</li>
<li>việc chuyển nhượng làm thay đổi đáng kể nghĩa vụ hay rủi ro của bên có nghĩa vụ;</li>
<li>luật cấm; hoặc hợp đồng cấm một cách hợp lệ (toà giải thích hẹp các điều khoản này, và UCC nói chung vẫn cho chuyển nhượng quyền nhận thanh toán dù có điều khoản cấm).</li>
</ul>
<p>Bên nhận chuyển nhượng "đứng vào vị trí" của bên chuyển nhượng: nhận quyền <strong>kèm các lý do phản đối</strong> mà bên có nghĩa vụ có đối với bên chuyển nhượng. Bên nhận chuyển nhượng nên sớm <strong>thông báo</strong> cho bên có nghĩa vụ — nếu bên có nghĩa vụ trả cho bên chuyển nhượng trước khi nhận thông báo thì được giải trừ nghĩa vụ.</p>
<h3>3. Chuyển giao nghĩa vụ (delegation)</h3>
<p><strong>Delegation</strong> chuyển <em>nghĩa vụ</em> theo hợp đồng cho <strong>bên nhận nghĩa vụ</strong>. Nghĩa vụ thông thường (giao hàng tiêu chuẩn, trả tiền) thường chuyển giao được, nhưng nghĩa vụ dựa vào kỹ năng hay phán đoán riêng thì không — bức chân dung của một hoạ sĩ nổi tiếng, ca mổ của một bác sĩ phẫu thuật. Điểm then chốt: <strong>bên chuyển giao vẫn chịu trách nhiệm</strong> nếu bên nhận không thực hiện.</p>
<h3>4. Novation (thay thế chủ thể)</h3>
<p><strong>Novation</strong> là một thoả thuận mới, được mọi bên đồng ý, thay một bên ban đầu bằng một bên mới và <strong>giải phóng hoàn toàn</strong> bên ban đầu. Ví dụ: người thuê A, chủ nhà L và người thuê mới B thoả thuận B tiếp quản hợp đồng thuê và A được giải phóng. Nếu không có sự giải phóng đó, đây chỉ là chuyển nhượng quyền cộng chuyển giao nghĩa vụ và A vẫn chịu trách nhiệm.</p>
<h3>5. Hợp đồng joint, several, và joint and several</h3>
<table>
<tr><th>Loại</th><th>Ý nghĩa (quy tắc chung)</th></tr>
<tr><td><strong>Joint (chung)</strong></td><td>Hai hay nhiều bên hứa cùng bị ràng buộc như một khối với toàn bộ nghĩa vụ; theo truyền thống bên có quyền phải kiện họ cùng nhau</td></tr>
<tr><td><strong>Several (riêng rẽ)</strong></td><td>Mỗi bên hứa đưa ra một lời hứa riêng và chỉ chịu trách nhiệm phần của mình</td></tr>
<tr><td><strong>Joint and several (liên đới)</strong></td><td>Bên có quyền có thể kiện bất kỳ một, vài hay tất cả để đòi <strong>toàn bộ</strong> số tiền; bên nào trả quá phần mình có thể đòi các bên kia hoàn lại</td></tr>
</table>
<p>Nhiều bang đã sửa các quy tắc tố tụng cũ về nghĩa vụ chung, nên cần kiểm theo từng nơi. Trong kinh doanh, hợp đồng vay và bảo lãnh thường được soạn theo dạng liên đới để bảo vệ chủ nợ.</p>
<div class="callout"><span class="badge">Đối chiếu Việt Nam</span> Bộ luật Dân sự 2015 thừa nhận hợp đồng vì lợi ích của người thứ ba; cho phép <strong>chuyển giao quyền yêu cầu</strong> mà không cần bên có nghĩa vụ đồng ý nhưng phải thông báo cho họ, trong khi <strong>chuyển giao nghĩa vụ</strong> cần bên có quyền đồng ý — sau đó người thế nghĩa vụ trở thành bên có nghĩa vụ, hệ quả gần với novation. Với <strong>nghĩa vụ liên đới</strong>, bên có quyền có thể yêu cầu bất kỳ ai trong số những người có nghĩa vụ liên đới thực hiện toàn bộ nghĩa vụ. Chế định đại diện nằm ở Chương IX Phần thứ nhất. Kiểm quy định hiện hành trên vbpl.vn.</div>`,
  ]]);

const u8 = doc('law102-2-4-termination-remedies', '2.4 — Ch 13 · Termination of contracts, breach & remedies (Unit 8)|||2.4 — Ch 13 · Chấm dứt hợp đồng, vi phạm & biện pháp khắc phục (Unit 8)',
  'Chấm dứt do thực hiện (kể cả thực hiện cơ bản), do thoả thuận, do không thể thực hiện, bất khả kháng và commercial impracticability, do luật định và do vi phạm; termination và rescission; các loại bồi thường thiệt hại (compensatory, consequential, incidental, liquidated), nghĩa vụ hạn chế tổn thất, buộc thực hiện đúng; đối chiếu BLDS 2015 và Luật Thương mại 2005.',
  [[
    `<span class="eyebrow">LAW102 · Part 2 · Lesson 2.4</span>
<h2>Termination of contracts, breach &amp; remedies</h2>
<h3>1. How contract obligations end</h3>
<table>
<tr><th>Ground</th><th>Key rules</th></tr>
<tr><td><strong>Performance</strong></td><td>The normal way. <em>Complete</em> performance discharges the duty; <em>substantial</em> performance (a good-faith, minor deviation — common in construction) lets the performer recover the price minus damages for the defect. A valid <em>tender</em> (offer to perform) that is refused also protects the tendering party.</td></tr>
<tr><td><strong>Agreement</strong></td><td>Mutual rescission, novation, <em>accord and satisfaction</em> (agreeing to accept a different performance), release, or a condition in the contract that ends it</td></tr>
<tr><td><strong>Impossibility</strong></td><td>Destruction of the specific subject matter, death or incapacity of a person whose personal performance was required, or a change in law making performance illegal. Mere difficulty or higher cost is <em>not</em> enough.</td></tr>
<tr><td><strong>Commercial impracticability / frustration</strong></td><td>UCC §2-615 excuses a seller when an unforeseen event, whose non-occurrence was a basic assumption of the contract, makes performance impracticable; frustration of purpose applies when the reason for the contract is destroyed. <strong>Force majeure</strong> clauses let parties define such events themselves.</td></tr>
<tr><td><strong>Operation of law</strong></td><td>Discharge in bankruptcy; the statute of limitations (bars the remedy); material alteration of a written contract by one party</td></tr>
<tr><td><strong>Breach</strong></td><td>A <em>material</em> breach discharges the innocent party and gives it a right to damages; a minor breach gives damages only. <em>Anticipatory repudiation</em> — announcing before the due date that you will not perform — can be treated as an immediate breach.</td></tr>
</table>
<h3>2. Termination vs rescission</h3>
<p>The words are often mixed up, but the effects differ. <strong>Termination</strong> ends the contract for the future: unperformed obligations are discharged, but rights based on earlier performance or breach survive (the UCC uses "termination" for ending under a power in the contract or law, and "cancellation" for ending because of the other side's breach). <strong>Rescission</strong> unmakes the contract as if it had never existed: each party returns what it received (<strong>restitution</strong>) — used for mutual agreement or as a remedy for fraud, duress or mistake.</p>
<h3>3. Remedies for breach</h3>
<table>
<tr><th>Remedy</th><th>What it gives</th></tr>
<tr><td><strong>Compensatory damages</strong></td><td>Money that puts the injured party where it would have been had the contract been performed. For a buyer of goods who "covers": cover price − contract price + incidental costs − expenses saved.</td></tr>
<tr><td><strong>Consequential (special) damages</strong></td><td>Indirect losses such as lost profits — recoverable only if they were <strong>foreseeable</strong> to the breaching party when the contract was made (<em>Hadley v Baxendale</em>, England, 1854)</td></tr>
<tr><td><strong>Incidental damages</strong></td><td>Reasonable costs caused by the breach — inspection, transport, storage of rejected goods</td></tr>
<tr><td><strong>Liquidated damages</strong></td><td>A sum fixed in the contract; enforceable if damages were hard to estimate and the sum is a reasonable forecast. A sum out of proportion to any likely loss is a <strong>penalty</strong> and is unenforceable.</td></tr>
<tr><td><strong>Nominal damages</strong></td><td>A token amount when a breach caused no real loss</td></tr>
<tr><td><strong>Specific performance</strong></td><td>An equitable order to perform — used when money is inadequate: land, unique goods (a rare painting). Not ordered for personal services.</td></tr>
<tr><td><strong>Rescission, restitution, reformation, injunction</strong></td><td>Undo the contract; return benefits; correct the writing to reflect the real agreement; prohibit an act</td></tr>
</table>
<p><strong>Duty to mitigate:</strong> the injured party must take reasonable steps to limit its loss; it cannot recover damages it could reasonably have avoided. <strong>Punitive damages</strong> are generally not awarded for breach of contract alone.</p>
<div class="callout"><span class="badge">Vietnam counterpart / Đối chiếu Việt Nam</span> The Civil Code 2015 separates <strong>termination</strong> (chấm dứt), <strong>cancellation</strong> of a contract (huỷ bỏ — the contract has no effect from the time it was made and parties return what they received) and <strong>unilateral termination</strong> (đơn phương chấm dứt — the contract ends when the other party receives notice). It also recognises force majeure and a hardship rule for a fundamental change of circumstances. Unlike US courts, Vietnamese law enforces agreed <strong>penalties</strong> (phạt vi phạm); for commercial contracts the Commercial Law 2005 caps them as a percentage of the breached obligation. Check the rates and conditions in the current texts on vbpl.vn.</div>`,
    `<span class="eyebrow">LAW102 · Phần 2 · Bài 2.4</span>
<h2>Chấm dứt hợp đồng, vi phạm &amp; biện pháp khắc phục</h2>
<h3>1. Nghĩa vụ hợp đồng chấm dứt thế nào</h3>
<table>
<tr><th>Căn cứ</th><th>Quy tắc then chốt</th></tr>
<tr><td><strong>Thực hiện</strong></td><td>Cách thông thường. Thực hiện <em>đầy đủ</em> làm chấm dứt nghĩa vụ; thực hiện <em>cơ bản</em> (sai lệch nhỏ, thiện chí — hay gặp trong xây dựng) cho phép bên thực hiện nhận giá trừ đi thiệt hại do khiếm khuyết. Một <em>đề xuất thực hiện</em> hợp lệ mà bị từ chối cũng bảo vệ bên đề xuất.</td></tr>
<tr><td><strong>Thoả thuận</strong></td><td>Cùng thoả thuận huỷ bỏ, novation, <em>accord and satisfaction</em> (thoả thuận nhận một cách thực hiện khác), miễn trừ, hoặc một điều kiện trong hợp đồng làm hợp đồng chấm dứt</td></tr>
<tr><td><strong>Không thể thực hiện</strong></td><td>Đối tượng đặc định bị huỷ hoại, người phải tự mình thực hiện chết hoặc mất năng lực, hoặc luật thay đổi khiến việc thực hiện trở nên bất hợp pháp. Chỉ khó khăn hơn hay tốn kém hơn thì <em>không</em> đủ.</td></tr>
<tr><td><strong>Commercial impracticability / mất mục đích</strong></td><td>UCC §2-615 miễn trách cho người bán khi một sự kiện không lường trước — mà việc nó không xảy ra là giả định cơ bản của hợp đồng — khiến việc thực hiện trở nên bất khả thi về thương mại; học thuyết mất mục đích (frustration) áp dụng khi lý do giao kết bị triệt tiêu. Điều khoản <strong>bất khả kháng</strong> cho phép các bên tự xác định các sự kiện đó.</td></tr>
<tr><td><strong>Theo luật</strong></td><td>Được miễn nợ khi phá sản; hết thời hiệu (mất quyền yêu cầu toà cưỡng chế); một bên tự ý sửa đổi trọng yếu hợp đồng bằng văn bản</td></tr>
<tr><td><strong>Vi phạm</strong></td><td>Vi phạm <em>cơ bản</em> giải phóng bên vô tội và cho quyền đòi bồi thường; vi phạm nhỏ chỉ cho quyền đòi bồi thường. <em>Tuyên bố trước sẽ không thực hiện</em> (anticipatory repudiation) — báo trước hạn rằng mình sẽ không thực hiện — có thể được coi là vi phạm ngay lập tức.</td></tr>
</table>
<h3>2. Termination và rescission</h3>
<p>Hai từ này hay bị lẫn nhưng hệ quả khác nhau. <strong>Termination (chấm dứt)</strong> kết thúc hợp đồng cho tương lai: nghĩa vụ chưa thực hiện được giải trừ, nhưng quyền dựa trên việc thực hiện hay vi phạm trước đó vẫn còn (UCC dùng "termination" cho việc chấm dứt theo quyền do hợp đồng hay luật trao, và "cancellation" cho việc chấm dứt vì bên kia vi phạm). <strong>Rescission (huỷ bỏ)</strong> xoá hợp đồng như chưa từng tồn tại: mỗi bên hoàn trả những gì đã nhận (<strong>hoàn trả — restitution</strong>) — dùng khi hai bên thoả thuận hoặc làm biện pháp khắc phục khi có gian lận, cưỡng ép hay nhầm lẫn.</p>
<h3>3. Biện pháp khắc phục khi vi phạm</h3>
<table>
<tr><th>Biện pháp</th><th>Đem lại gì</th></tr>
<tr><td><strong>Bồi thường bù đắp (compensatory)</strong></td><td>Khoản tiền đặt bên bị vi phạm vào vị trí như khi hợp đồng được thực hiện. Với người mua hàng đã "mua thay thế" (cover): giá mua thay thế − giá hợp đồng + chi phí phát sinh − chi phí tiết kiệm được.</td></tr>
<tr><td><strong>Bồi thường thiệt hại gián tiếp (consequential)</strong></td><td>Tổn thất gián tiếp như lợi nhuận bị mất — chỉ được bồi thường nếu bên vi phạm <strong>có thể thấy trước</strong> khi giao kết (<em>Hadley v Baxendale</em>, Anh, 1854)</td></tr>
<tr><td><strong>Chi phí phát sinh (incidental)</strong></td><td>Chi phí hợp lý do vi phạm gây ra — kiểm định, vận chuyển, lưu kho hàng bị từ chối</td></tr>
<tr><td><strong>Bồi thường ấn định trước (liquidated damages)</strong></td><td>Khoản tiền ghi sẵn trong hợp đồng; thực thi được nếu thiệt hại khó ước tính và khoản tiền là dự báo hợp lý. Khoản tiền quá lớn so với mọi tổn thất có thể xảy ra là <strong>tiền phạt (penalty)</strong> và không được thực thi.</td></tr>
<tr><td><strong>Bồi thường danh nghĩa</strong></td><td>Khoản tượng trưng khi vi phạm không gây tổn thất thật</td></tr>
<tr><td><strong>Buộc thực hiện đúng (specific performance)</strong></td><td>Lệnh theo luật công bình buộc thực hiện — dùng khi tiền không đủ bù: đất đai, hàng độc nhất (một bức tranh hiếm). Không áp dụng cho dịch vụ cá nhân.</td></tr>
<tr><td><strong>Huỷ bỏ, hoàn trả, sửa văn bản, lệnh cấm</strong></td><td>Xoá hợp đồng; trả lại lợi ích; sửa văn bản cho đúng thoả thuận thật; cấm một hành vi</td></tr>
</table>
<p><strong>Nghĩa vụ hạn chế tổn thất:</strong> bên bị vi phạm phải có biện pháp hợp lý để giảm tổn thất; không đòi được phần thiệt hại lẽ ra có thể tránh một cách hợp lý. <strong>Bồi thường mang tính trừng phạt</strong> nói chung không được áp dụng chỉ vì vi phạm hợp đồng.</p>
<div class="callout"><span class="badge">Đối chiếu Việt Nam</span> Bộ luật Dân sự 2015 tách <strong>chấm dứt</strong> hợp đồng, <strong>huỷ bỏ</strong> hợp đồng (hợp đồng không có hiệu lực từ thời điểm giao kết và các bên hoàn trả cho nhau những gì đã nhận) và <strong>đơn phương chấm dứt</strong> (hợp đồng chấm dứt khi bên kia nhận được thông báo). Bộ luật cũng thừa nhận sự kiện bất khả kháng và quy tắc về thực hiện hợp đồng khi hoàn cảnh thay đổi cơ bản. Khác toà án Mỹ, luật Việt Nam thực thi <strong>phạt vi phạm</strong> do các bên thoả thuận; với hợp đồng thương mại, Luật Thương mại 2005 giới hạn mức phạt theo tỷ lệ phần trăm giá trị phần nghĩa vụ bị vi phạm. Kiểm mức và điều kiện trong văn bản đang có hiệu lực trên vbpl.vn.</div>`,
  ]]);

const ex1 = doc('law102-2-5-exercise', 'Exercise 1 — moot court: the oak-board contract|||Bài tập 1 — phiên toà giả định: hợp đồng gỗ sồi',
  'Bài tập kiểu moot court: xác định lời mời đề nghị, đề nghị, phản đề nghị, thời điểm chấp nhận theo mailbox rule, Statute of Frauds; tính bồi thường bù đắp khi mua thay thế, xét thiệt hại gián tiếp theo Hadley v Baxendale và so với điều khoản liquidated damages; kèm lời giải.',
  [[
    `<span class="eyebrow">LAW102 · Part 2 · Exercise</span>
<h2>Exercise 1 — moot court: the oak-board contract</h2>
<div class="callout"><span class="badge">Problem</span> A fictional case with illustrative numbers. Alpha Furniture (a merchant buyer) and Beta Timber (a merchant seller) are in a state that follows the general common-law and UCC rules.<br>
• 2 May — Beta emails its catalogue to 200 customers: "Premium oak boards, $52 per board, while stocks last."<br>
• 5 May — Alpha mails Beta a signed letter: "We order 2,000 premium oak boards at $50 per board, delivery by 30 June. Please reply by 12 May."<br>
• 8 May — Beta mails a signed reply: "We cannot supply at $50. We can supply 2,000 boards at $52 per board, delivery by 30 June."<br>
• 10 May — Alpha posts a signed letter: "We accept your terms of 8 May." It arrives on 13 May.<br>
• 11 May — Beta emails Alpha, and Alpha reads it the same day: "We withdraw our proposal of 8 May."<br>
• 20 June — Beta announces it will not deliver because timber prices have risen. Alpha promptly buys 2,000 substitute boards at $61 per board and pays $1,500 extra transport. Alpha also claims $30,000 of profit lost on a hotel project delayed by ten days; Beta was never told about that project.<br>
(a) Identify the legal character of each communication. (b) Was a contract formed, when and at what price? (c) Does the Statute of Frauds bar enforcement? (d) Compute Alpha's damages. (e) Variant: the signed contract had said "if Seller fails to deliver, Seller shall pay $4 per board as liquidated damages". What changes? What if the clause had said $40 per board?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) 2 May  catalogue to many customers      -> invitation to make an offer
    5 May  Alpha's order: definite quantity, price, date -> OFFER (at $50)
    8 May  Beta changes the price            -> not an acceptance; a COUNTEROFFER
           = rejection of Alpha's $50 offer + new offer by Beta (at $52)
   10 May  Alpha's letter "we accept"        -> ACCEPTANCE of Beta's counteroffer
   11 May  Beta's withdrawal                  -> attempted revocation

(b) Mailbox rule: acceptance by an authorised means (a letter answering a letter)
    is effective on DISPATCH -> 10 May.
    Revocation is effective only on RECEIPT -> 11 May, one day too late.
    Contract formed on 10 May: 2,000 x $52 = $104,000

(c) Sale of goods for $500 or more -> UCC 2-201 requires a signed writing.
    Beta's signed 8 May letter, read with Alpha's signed acceptance, states the
    quantity (2,000) and is signed by the party to be charged (Beta) -> satisfied.

(d) Beta's 20 June statement = anticipatory repudiation (breach).
    Cover damages = (cover price − contract price) x quantity + incidental costs
                  = ($61 − $52) x 2,000 + $1,500
                  = $18,000 + $1,500 = $19,500
    Lost hotel profit $30,000: consequential damage, NOT foreseeable to Beta at
    contracting (never told) -> not recoverable (Hadley v Baxendale).
    (Without cover, market-price damages would be (market − contract) x quantity,
     e.g. market $60: ($60 − $52) x 2,000 = $16,000.)

(e) $4 per board x 2,000 = $8,000
    If the clause was a reasonable forecast when agreed, the general rule is that
    it fixes the recovery: Alpha receives $8,000, not $19,500.
    $40 per board x 2,000 = $80,000 -> far above any loss likely at contracting
    -> a PENALTY, unenforceable; the court awards actual damages ($19,500).</code></pre>
<p><strong>Why:</strong> a price list sent to many people is not an offer, because the seller cannot intend to sell unlimited stock to everyone who replies. A reply that changes the price is not a "yes" — under the common law and, in practice, under the UCC, a change in so central a term is a counteroffer, and it kills the original offer. The mailbox rule favours the offeree: once the acceptance is in the post, the offeror can no longer revoke. Damages aim to give Alpha the benefit of its bargain, not a windfall — which is why unforeseeable losses are excluded and why a genuine liquidated-damages figure, even a low one, binds both sides.</p>`,
    `<span class="eyebrow">LAW102 · Phần 2 · Bài tập</span>
<h2>Bài tập 1 — phiên toà giả định: hợp đồng gỗ sồi</h2>
<div class="callout"><span class="badge">Đề</span> Tình huống giả định, số liệu minh hoạ. Alpha Furniture (người mua là thương nhân) và Beta Timber (người bán là thương nhân) ở một bang theo các quy tắc chung của thông luật và UCC.<br>
• 2/5 — Beta gửi email catalogue tới 200 khách hàng: "Gỗ sồi loại cao cấp, 52 $ mỗi tấm, cho tới khi hết hàng."<br>
• 5/5 — Alpha gửi thư có chữ ký qua bưu điện tới Beta: "Chúng tôi đặt 2.000 tấm gỗ sồi cao cấp giá 50 $ mỗi tấm, giao trước 30/6. Đề nghị trả lời trước 12/5."<br>
• 8/5 — Beta gửi thư trả lời có chữ ký: "Chúng tôi không thể cung cấp giá 50 $. Chúng tôi có thể cung cấp 2.000 tấm giá 52 $ mỗi tấm, giao trước 30/6."<br>
• 10/5 — Alpha gửi thư có chữ ký: "Chúng tôi chấp nhận các điều kiện của quý công ty ngày 8/5." Thư tới nơi ngày 13/5.<br>
• 11/5 — Beta gửi email và Alpha đọc ngay trong ngày: "Chúng tôi rút lại đề xuất ngày 8/5."<br>
• 20/6 — Beta tuyên bố sẽ không giao hàng vì giá gỗ tăng. Alpha lập tức mua 2.000 tấm thay thế giá 61 $ mỗi tấm và trả thêm 1.500 $ tiền vận chuyển. Alpha còn đòi 30.000 $ lợi nhuận bị mất ở một dự án khách sạn bị chậm mười ngày; Beta chưa hề được cho biết về dự án đó.<br>
(a) Xác định tính chất pháp lý của từng thông điệp. (b) Hợp đồng có hình thành không, khi nào và với giá nào? (c) Statute of Frauds có ngăn việc thực thi không? (d) Tính thiệt hại Alpha được bồi thường. (e) Biến thể: hợp đồng có chữ ký ghi "nếu Bên bán không giao hàng, Bên bán trả 4 $ mỗi tấm làm bồi thường ấn định trước". Điều gì thay đổi? Nếu điều khoản ghi 40 $ mỗi tấm thì sao?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) 2/5  catalogue gửi nhiều khách hàng        -> lời mời đề nghị
    5/5  đơn hàng của Alpha: rõ số lượng, giá, thời hạn -> ĐỀ NGHỊ (giá 50 $)
    8/5  Beta đổi giá                          -> không phải chấp nhận; là PHẢN ĐỀ NGHỊ
         = từ chối đề nghị 50 $ của Alpha + đề nghị mới của Beta (giá 52 $)
   10/5  thư "chúng tôi chấp nhận" của Alpha   -> CHẤP NHẬN phản đề nghị của Beta
   11/5  Beta rút lại                          -> cố gắng thu hồi

(b) Mailbox rule: chấp nhận bằng phương thức được phép (thư trả lời thư)
    có hiệu lực khi GỬI ĐI -> 10/5.
    Thu hồi chỉ có hiệu lực khi NHẬN ĐƯỢC -> 11/5, muộn một ngày.
    Hợp đồng hình thành ngày 10/5: 2.000 x 52 $ = 104.000 $

(c) Mua bán hàng hoá từ 500 $ trở lên -> UCC 2-201 đòi văn bản có chữ ký.
    Thư ngày 8/5 của Beta, đọc cùng thư chấp nhận có chữ ký của Alpha, ghi số lượng
    (2.000) và có chữ ký của bên bị yêu cầu thực hiện (Beta) -> đáp ứng.

(d) Tuyên bố ngày 20/6 của Beta = tuyên bố trước sẽ không thực hiện (vi phạm).
    Bồi thường khi mua thay thế = (giá thay thế − giá hợp đồng) x số lượng + chi phí phát sinh
                                = (61 $ − 52 $) x 2.000 + 1.500 $
                                = 18.000 $ + 1.500 $ = 19.500 $
    Lợi nhuận khách sạn 30.000 $: thiệt hại gián tiếp, Beta KHÔNG thể thấy trước
    khi giao kết (không được báo) -> không được bồi thường (Hadley v Baxendale).
    (Nếu không mua thay thế, bồi thường theo giá thị trường = (giá thị trường − giá HĐ) x số lượng,
     vd giá thị trường 60 $: (60 $ − 52 $) x 2.000 = 16.000 $.)

(e) 4 $ mỗi tấm x 2.000 = 8.000 $
    Nếu điều khoản là dự báo hợp lý lúc thoả thuận, quy tắc chung là nó ấn định
    mức được nhận: Alpha nhận 8.000 $, không phải 19.500 $.
    40 $ mỗi tấm x 2.000 = 80.000 $ -> vượt xa mọi tổn thất có thể thấy lúc giao kết
    -> là TIỀN PHẠT, không được thực thi; toà cho bồi thường thiệt hại thực tế (19.500 $).</code></pre>
<p><strong>Vì sao:</strong> bảng giá gửi cho nhiều người không phải đề nghị, vì người bán không thể có ý định bán lượng hàng không giới hạn cho mọi người trả lời. Một câu trả lời đổi giá không phải là "đồng ý" — theo thông luật và, trên thực tế, theo UCC, thay đổi một điều khoản cốt lõi như vậy là phản đề nghị, và nó chấm dứt đề nghị ban đầu. Mailbox rule có lợi cho bên được đề nghị: khi thư chấp nhận đã gửi đi, bên đề nghị không còn thu hồi được. Bồi thường nhằm cho Alpha hưởng đúng lợi ích của thương vụ, không phải một khoản trời cho — vì thế tổn thất không thể thấy trước bị loại, và một mức bồi thường ấn định trước thật sự hợp lý, dù thấp, vẫn ràng buộc cả hai bên.</p>`,
  ]]);

const q2 = quiz('law102-quiz-2', 'Quiz 2 — Contracts|||Quiz 2 — Hợp đồng', [
  { id: 'q1', question: 'A supermarket’s newspaper advertisement reads: "Winter coats $80 this week." In general, the advertisement is…|||Quảng cáo trên báo của một siêu thị ghi: "Áo khoác mùa đông 80 $ trong tuần này." Nói chung, quảng cáo này là…', options: ['an offer that any reader can accept|||một đề nghị mà bất kỳ người đọc nào cũng chấp nhận được', 'an invitation to make an offer|||một lời mời đề nghị', 'an acceptance|||một chấp nhận', 'a firm offer under the UCC|||một đề nghị cố định theo UCC'], correctIndex: 1, explanation: 'Ordinary advertisements are invitations to negotiate; the customer makes the offer. Only a clear, definite advertisement leaving nothing to negotiate (such as a reward) is an offer.|||Quảng cáo thông thường là lời mời thương lượng; khách hàng mới là người đề nghị. Chỉ quảng cáo rõ ràng, xác định, không còn gì để thương lượng (như treo thưởng) mới là đề nghị.' },
  { id: 'q2', question: 'Under the mailbox rule, an acceptance sent by an authorised means becomes effective…|||Theo mailbox rule, một chấp nhận gửi bằng phương thức được phép có hiệu lực…', options: ['when it is dispatched|||khi được gửi đi', 'when the offeror receives it|||khi bên đề nghị nhận được', 'when the offeror reads it|||khi bên đề nghị đọc nó', 'three days after it is sent|||ba ngày sau khi gửi'], correctIndex: 0, explanation: 'The deposited-acceptance rule makes acceptance effective on dispatch, while revocations and rejections take effect only on receipt.|||Quy tắc hộp thư làm chấp nhận có hiệu lực khi gửi đi, còn thu hồi và từ chối chỉ có hiệu lực khi được nhận.' },
  { id: 'q3', question: 'A contract clause requires a seller to pay $80,000 for late delivery of goods worth $20,000, although any likely loss was about $3,000. A US court will most likely treat the clause as…|||Một điều khoản buộc người bán trả 80.000 $ nếu giao chậm lô hàng trị giá 20.000 $, dù tổn thất có thể xảy ra chỉ khoảng 3.000 $. Toà án Mỹ nhiều khả năng coi điều khoản đó là…', options: ['valid liquidated damages|||bồi thường ấn định trước hợp lệ', 'consequential damages|||thiệt hại gián tiếp', 'specific performance|||buộc thực hiện đúng', 'an unenforceable penalty|||tiền phạt không thực thi được'], correctIndex: 3, explanation: 'Liquidated damages must be a reasonable forecast of loss; a sum grossly out of proportion to any likely harm is a penalty and is not enforced.|||Bồi thường ấn định trước phải là dự báo hợp lý về tổn thất; khoản tiền quá chênh lệch so với mọi thiệt hại có thể xảy ra là tiền phạt và không được thực thi.' },
]);

const u9 = doc('law102-3-1-business-organizations', '3.1 — Ch 29 · Introduction to business organizations (Unit 9)|||3.1 — Ch 29 · Nhập môn các loại hình tổ chức kinh doanh (Unit 9)',
  'Doanh nghiệp một chủ (sole proprietorship), hợp danh (general, limited, LLP), công ty (corporation, S corporation) và LLC: trách nhiệm của chủ sở hữu, tư cách pháp nhân, thuế, cách thành lập, ưu nhược điểm; bảng so sánh; đối chiếu các loại hình doanh nghiệp theo Luật Doanh nghiệp 2020.',
  [[
    `<span class="eyebrow">LAW102 · Part 3 · Lesson 3.1</span>
<h2>Introduction to business organizations</h2>
<p class="lead">Choosing a legal form decides three things that matter to every founder: <strong>who is liable</strong> for the firm's debts, <strong>who controls</strong> it, and <strong>how its profits are taxed</strong>. It also affects how easily the firm can raise capital and survive the departure of an owner.</p>
<h3>1. Sole proprietorship</h3>
<p>A business owned by one person, and the simplest form: no special filing is usually needed beyond local licences and, if a trade name is used, a fictitious-name registration. <strong>Advantages:</strong> easy and cheap to start, the owner keeps all profits and makes all decisions, profits are taxed once as the owner's personal income. <strong>Disadvantages:</strong> <strong>unlimited personal liability</strong> — creditors can reach the owner's house and savings; capital is limited to what one person can raise; the business usually ends when the owner dies.</p>
<h3>2. Partnerships</h3>
<ul>
<li><strong>General partnership</strong> — an association of two or more persons to carry on as co-owners a business for profit. It can arise from an oral agreement or even from conduct, although a written <em>partnership agreement</em> is wise. Each partner is an <strong>agent</strong> of the firm and, under the Revised Uniform Partnership Act followed by most states, partners are <strong>jointly and severally liable</strong> for partnership obligations. Profits "pass through" to the partners for tax.</li>
<li><strong>Limited partnership (LP)</strong> — at least one <strong>general partner</strong> (manages, unlimited liability) and one or more <strong>limited partners</strong> (liability limited to their investment; traditionally they lose that protection if they take part in control). A certificate must be filed with the state.</li>
<li><strong>Limited liability partnership (LLP)</strong> — all partners may manage, but a partner is shielded from personal liability for other partners' negligence or malpractice (the scope of the shield varies by state). Popular with law and accounting firms.</li>
</ul>
<h3>3. Corporation</h3>
<p>A <strong>corporation</strong> is a separate legal entity — an "artificial person" created under state law, able to own property, contract, sue and be sued in its own name. Features: <strong>limited liability</strong> of shareholders (they risk only what they invested), <strong>perpetual existence</strong>, <strong>free transferability</strong> of shares, <strong>centralised management</strong> by a board of directors. The classic drawback is <strong>double taxation</strong>: a regular (C) corporation pays tax on its profits, and shareholders pay tax again on dividends. Eligible small corporations may elect <strong>S corporation</strong> status for pass-through taxation, subject to limits (e.g. no more than 100 shareholders and one class of stock).</p>
<h3>4. Limited liability company (LLC)</h3>
<p>An <strong>LLC</strong> combines the limited liability of a corporation with the tax treatment and flexibility of a partnership. Owners are <strong>members</strong>; it is formed by filing <em>articles of organization</em> with the state and is usually governed by an <em>operating agreement</em>; it can be member-managed or manager-managed. By default a multi-member LLC is taxed as a partnership (it may elect otherwise). This mix of protection and simplicity has made the LLC a very popular choice for new small businesses in the US.</p>
<h3>5. Comparison</h3>
<table>
<tr><th>Form</th><th>Owners' liability</th><th>Separate entity?</th><th>Taxation (default)</th><th>Formation</th></tr>
<tr><td>Sole proprietorship</td><td>Unlimited</td><td>No</td><td>Owner's income</td><td>Informal</td></tr>
<tr><td>General partnership</td><td>Unlimited, joint and several</td><td>Treated as an entity for many purposes under RUPA</td><td>Pass-through</td><td>Agreement (may be oral)</td></tr>
<tr><td>Limited partnership</td><td>General partners unlimited; limited partners limited</td><td>Yes</td><td>Pass-through</td><td>Certificate filed with state</td></tr>
<tr><td>LLP</td><td>Shield against partners' negligence (varies)</td><td>Yes</td><td>Pass-through</td><td>Registration with state</td></tr>
<tr><td>Corporation</td><td>Limited</td><td>Yes</td><td>Corporate tax + tax on dividends (C corp)</td><td>Articles of incorporation filed</td></tr>
<tr><td>LLC</td><td>Limited</td><td>Yes</td><td>Pass-through (can elect)</td><td>Articles of organization filed</td></tr>
</table>
<p>Other arrangements — <strong>joint ventures</strong> (a partnership for a single project), <strong>franchises</strong>, <strong>cooperatives</strong> — are built on these basic forms.</p>
<div class="callout"><span class="badge">Vietnam counterpart / Đối chiếu Việt Nam</span> Under the Law on Enterprises 2020 (as amended), the main forms are: <strong>private enterprise</strong> (doanh nghiệp tư nhân — one individual owner, liable with all personal assets, no legal personality); <strong>partnership company</strong> (công ty hợp danh — at least two general partners with unlimited joint liability, possibly capital-contributing members with limited liability; has legal personality); <strong>limited liability company</strong> with one member or with two to fifty members; and <strong>joint-stock company</strong> (công ty cổ phần — at least three shareholders, may issue shares). Household businesses (hộ kinh doanh) are not enterprises. Check the current law and amendments on vbpl.vn.</div>`,
    `<span class="eyebrow">LAW102 · Phần 3 · Bài 3.1</span>
<h2>Nhập môn các loại hình tổ chức kinh doanh</h2>
<p class="lead">Chọn hình thức pháp lý quyết định ba điều quan trọng với mọi nhà sáng lập: <strong>ai chịu trách nhiệm</strong> về nợ của doanh nghiệp, <strong>ai kiểm soát</strong> doanh nghiệp, và <strong>lợi nhuận bị đánh thuế thế nào</strong>. Nó còn ảnh hưởng tới việc huy động vốn dễ hay khó và doanh nghiệp có tồn tại được khi một chủ sở hữu rời đi hay không.</p>
<h3>1. Doanh nghiệp một chủ (sole proprietorship)</h3>
<p>Cơ sở kinh doanh do một người sở hữu, hình thức đơn giản nhất: thường không cần đăng ký đặc biệt ngoài giấy phép địa phương và, nếu dùng tên thương mại, đăng ký tên giả định. <strong>Ưu điểm:</strong> lập nhanh, rẻ, chủ hưởng toàn bộ lợi nhuận và tự quyết mọi việc, lợi nhuận chỉ bị đánh thuế một lần như thu nhập cá nhân của chủ. <strong>Nhược điểm:</strong> <strong>trách nhiệm cá nhân vô hạn</strong> — chủ nợ có thể đòi cả nhà và tiền tiết kiệm của chủ; vốn giới hạn trong khả năng của một người; doanh nghiệp thường chấm dứt khi chủ chết.</p>
<h3>2. Hợp danh (partnership)</h3>
<ul>
<li><strong>Hợp danh thông thường (general partnership)</strong> — sự liên kết của hai hay nhiều người cùng làm chủ một cơ sở kinh doanh vì lợi nhuận. Nó có thể hình thành từ thoả thuận miệng hay thậm chí từ hành vi, dù nên có <em>thoả thuận hợp danh</em> bằng văn bản. Mỗi thành viên là <strong>người đại diện</strong> của hợp danh và, theo Đạo luật Hợp danh Thống nhất sửa đổi (RUPA) mà đa số bang theo, các thành viên chịu <strong>trách nhiệm liên đới</strong> với nghĩa vụ của hợp danh. Lợi nhuận "chuyển thẳng" cho thành viên để tính thuế.</li>
<li><strong>Hợp danh hữu hạn (LP)</strong> — ít nhất một <strong>thành viên hợp danh</strong> (quản lý, trách nhiệm vô hạn) và một hay nhiều <strong>thành viên hữu hạn</strong> (trách nhiệm giới hạn trong phần vốn góp; theo truyền thống sẽ mất sự bảo vệ đó nếu tham gia kiểm soát). Phải nộp giấy chứng nhận cho bang.</li>
<li><strong>Hợp danh trách nhiệm hữu hạn (LLP)</strong> — mọi thành viên đều có thể quản lý, nhưng mỗi thành viên được che chắn khỏi trách nhiệm cá nhân về sự cẩu thả hay sai sót nghề nghiệp của thành viên khác (phạm vi che chắn tuỳ bang). Phổ biến ở công ty luật và kế toán.</li>
</ul>
<h3>3. Công ty (corporation)</h3>
<p><strong>Corporation</strong> là một thực thể pháp lý riêng — một "pháp nhân" được lập theo luật bang, có thể sở hữu tài sản, ký hợp đồng, khởi kiện và bị kiện nhân danh mình. Đặc điểm: <strong>trách nhiệm hữu hạn</strong> của cổ đông (chỉ rủi ro phần đã góp), <strong>tồn tại liên tục</strong>, cổ phần <strong>tự do chuyển nhượng</strong>, <strong>quản lý tập trung</strong> qua hội đồng quản trị. Nhược điểm kinh điển là <strong>đánh thuế hai lần</strong>: công ty thông thường (C corporation) nộp thuế trên lợi nhuận, rồi cổ đông lại nộp thuế trên cổ tức. Công ty nhỏ đủ điều kiện có thể chọn quy chế <strong>S corporation</strong> để lợi nhuận chuyển thẳng cho cổ đông tính thuế, kèm giới hạn (vd không quá 100 cổ đông và chỉ một loại cổ phần).</p>
<h3>4. Công ty trách nhiệm hữu hạn (LLC)</h3>
<p><strong>LLC</strong> kết hợp trách nhiệm hữu hạn của corporation với cách tính thuế và tính linh hoạt của hợp danh. Chủ sở hữu là <strong>thành viên (member)</strong>; LLC lập bằng cách nộp <em>điều lệ thành lập (articles of organization)</em> cho bang và thường vận hành theo <em>thoả thuận điều hành (operating agreement)</em>; có thể do thành viên trực tiếp quản lý hoặc thuê người quản lý. Mặc định LLC nhiều thành viên được đánh thuế như hợp danh (có thể chọn cách khác). Sự kết hợp giữa bảo vệ và đơn giản này khiến LLC trở thành lựa chọn rất được ưa chuộng của doanh nghiệp nhỏ mới lập ở Mỹ.</p>
<h3>5. So sánh</h3>
<table>
<tr><th>Hình thức</th><th>Trách nhiệm của chủ</th><th>Thực thể riêng?</th><th>Thuế (mặc định)</th><th>Thành lập</th></tr>
<tr><td>Doanh nghiệp một chủ</td><td>Vô hạn</td><td>Không</td><td>Thu nhập của chủ</td><td>Không cần thủ tục chính thức</td></tr>
<tr><td>Hợp danh thông thường</td><td>Vô hạn, liên đới</td><td>Được coi là thực thể ở nhiều khía cạnh theo RUPA</td><td>Chuyển thẳng</td><td>Thoả thuận (có thể bằng miệng)</td></tr>
<tr><td>Hợp danh hữu hạn</td><td>Thành viên hợp danh vô hạn; thành viên hữu hạn giới hạn</td><td>Có</td><td>Chuyển thẳng</td><td>Nộp giấy chứng nhận cho bang</td></tr>
<tr><td>LLP</td><td>Che chắn khỏi cẩu thả của thành viên khác (tuỳ bang)</td><td>Có</td><td>Chuyển thẳng</td><td>Đăng ký với bang</td></tr>
<tr><td>Corporation</td><td>Hữu hạn</td><td>Có</td><td>Thuế công ty + thuế cổ tức (C corp)</td><td>Nộp articles of incorporation</td></tr>
<tr><td>LLC</td><td>Hữu hạn</td><td>Có</td><td>Chuyển thẳng (có thể chọn)</td><td>Nộp articles of organization</td></tr>
</table>
<p>Các hình thức khác — <strong>liên doanh (joint venture)</strong> (hợp danh cho một dự án), <strong>nhượng quyền (franchise)</strong>, <strong>hợp tác xã</strong> — được xây trên các hình thức cơ bản này.</p>
<div class="callout"><span class="badge">Đối chiếu Việt Nam</span> Theo Luật Doanh nghiệp 2020 (đã được sửa đổi, bổ sung), các loại hình chính gồm: <strong>doanh nghiệp tư nhân</strong> (một cá nhân làm chủ, chịu trách nhiệm bằng toàn bộ tài sản của mình, không có tư cách pháp nhân); <strong>công ty hợp danh</strong> (ít nhất hai thành viên hợp danh chịu trách nhiệm vô hạn và liên đới, có thể có thành viên góp vốn chịu trách nhiệm hữu hạn; có tư cách pháp nhân); <strong>công ty trách nhiệm hữu hạn</strong> một thành viên hoặc từ hai đến năm mươi thành viên; và <strong>công ty cổ phần</strong> (tối thiểu ba cổ đông, được phát hành cổ phần). Hộ kinh doanh không phải doanh nghiệp. Kiểm luật và các lần sửa đổi đang có hiệu lực trên vbpl.vn.</div>`,
  ]]);

const u10 = doc('law102-3-2-nature-corporation', '3.2 — Ch 32 · Nature of a corporation (Unit 10)|||3.2 — Ch 32 · Bản chất của công ty (Unit 10)',
  'Phân loại công ty (công và tư, trong bang, ngoài bang, nước ngoài, vì lợi nhuận và phi lợi nhuận, công ty đóng và đại chúng); người sáng lập (promoter) và trách nhiệm với hợp đồng trước thành lập; articles of incorporation và thủ tục thành lập; quyền năng của công ty, ultra vires và xuyên thủng tấm màn công ty; đối chiếu Luật Doanh nghiệp 2020.',
  [[
    `<span class="eyebrow">LAW102 · Part 3 · Lesson 3.2</span>
<h2>Nature of a corporation</h2>
<p class="lead">A corporation exists only because the state says so. That simple fact explains the rules on how it is formed, what it may do, and when courts will ignore it and reach its owners.</p>
<h3>1. Classes of corporations</h3>
<table>
<tr><th>By…</th><th>Classes</th></tr>
<tr><td>Purpose</td><td><strong>Public</strong> (formed by government — a city, a public authority) vs <strong>private</strong>; <strong>for-profit</strong> vs <strong>nonprofit</strong> (charities, universities)</td></tr>
<tr><td>Place of incorporation</td><td><strong>Domestic</strong> (in the state where it was incorporated) · <strong>foreign</strong> (from another US state — it must qualify to do business) · <strong>alien</strong> (incorporated in another country)</td></tr>
<tr><td>Ownership</td><td><strong>Close (closely held)</strong> — few shareholders, shares not publicly traded, often restrictions on transfer · <strong>publicly held</strong> — shares traded on a market and regulated by securities law</td></tr>
<tr><td>Special types</td><td><strong>Professional corporations</strong> (doctors, lawyers); <strong>S corporations</strong> (a tax status)</td></tr>
</table>
<h3>2. Promoters and pre-incorporation contracts</h3>
<p><strong>Promoters</strong> bring the idea, people and money together and arrange the incorporation — they lease premises, hire staff, buy equipment before the company exists. General rules:</p>
<ul>
<li>A promoter who signs a contract for a corporation not yet formed is <strong>personally liable</strong> on it, unless the other party agreed to look only to the future corporation.</li>
<li>The corporation is <strong>not bound</strong> until it comes into existence and <strong>adopts</strong> the contract (expressly, or by accepting its benefits). Adoption alone does not release the promoter; only a <strong>novation</strong> among corporation, promoter and third party does.</li>
<li>Promoters owe <strong>fiduciary duties</strong> to the corporation and its future shareholders: they may not make secret profits, e.g. by selling their own land to the company at an inflated price without disclosure.</li>
</ul>
<h3>3. Forming the corporation</h3>
<ol>
<li>Choose the state of incorporation (many large companies choose Delaware for its developed corporate law and specialised court).</li>
<li>File the <strong>articles of incorporation</strong> (also called the charter or certificate) with the secretary of state. Typical contents: the corporate <strong>name</strong>, which must include a word such as Corporation, Incorporated, Company or Limited (or an abbreviation) and must not be confusingly similar to another's; the <strong>number of shares</strong> authorised and their classes; the <strong>registered agent and office</strong>; the <strong>incorporators</strong>; often the <strong>purpose</strong> ("any lawful business").</li>
<li>Under most modern statutes, corporate existence begins when the articles are filed. The <strong>organisational meeting</strong> then adopts <strong>bylaws</strong> (internal rules), elects directors and officers and authorises the issue of shares.</li>
</ol>
<p>A <em>de jure</em> corporation complies with the statute; where there was a good-faith attempt with minor defects, some courts recognise a <em>de facto</em> corporation or apply <em>corporation by estoppel</em>.</p>
<h3>4. Corporate powers</h3>
<ul>
<li><strong>Express powers</strong> — those granted by the state statute and the articles: to own property, make contracts, borrow, sue and be sued, issue shares.</li>
<li><strong>Implied (incidental) powers</strong> — powers reasonably necessary to carry out the express powers and purposes, e.g. buying office supplies, hiring lawyers.</li>
<li>An act beyond the corporation's powers is <strong>ultra vires</strong>. Because modern articles usually allow "any lawful business", this matters less today; shareholders can still seek an injunction and the state can act.</li>
</ul>
<h3>5. Piercing the corporate veil</h3>
<p>Limited liability is the rule, but courts may <strong>pierce the corporate veil</strong> and hold shareholders personally liable when the corporation is a mere sham: personal and corporate funds are commingled, the company is grossly undercapitalised for its risks, formalities are ignored, or the entity is used to commit fraud. The remedy is exceptional and fact-specific.</p>
<div class="callout"><span class="badge">Vietnam counterpart / Đối chiếu Việt Nam</span> Under the Law on Enterprises 2020, a company is registered with the business registration office, and the file includes the company <strong>charter</strong> (điều lệ — covering roughly what US articles and bylaws do together) and lists of founding members or shareholders. The law regulates <strong>contracts signed before enterprise registration</strong>: the founder who signs is responsible, and the company takes over the rights and obligations once it is established, subject to conditions set by law. A company's name must follow naming rules and may not duplicate or confuse with registered names. Check the current articles on vbpl.vn.</div>`,
    `<span class="eyebrow">LAW102 · Phần 3 · Bài 3.2</span>
<h2>Bản chất của công ty</h2>
<p class="lead">Công ty tồn tại chỉ vì nhà nước cho phép. Sự thật đơn giản này giải thích các quy tắc về cách công ty được lập, được làm gì, và khi nào toà bỏ qua nó để truy tới chủ sở hữu.</p>
<h3>1. Phân loại công ty</h3>
<table>
<tr><th>Theo…</th><th>Loại</th></tr>
<tr><td>Mục đích</td><td><strong>Công</strong> (do nhà nước lập — một thành phố, một cơ quan công quyền) và <strong>tư</strong>; <strong>vì lợi nhuận</strong> và <strong>phi lợi nhuận</strong> (tổ chức từ thiện, trường đại học)</td></tr>
<tr><td>Nơi thành lập</td><td><strong>Trong bang (domestic)</strong> (tại bang nơi thành lập) · <strong>ngoài bang (foreign)</strong> (từ một bang khác của Mỹ — phải đăng ký để kinh doanh) · <strong>nước ngoài (alien)</strong> (thành lập ở quốc gia khác)</td></tr>
<tr><td>Sở hữu</td><td><strong>Công ty đóng (close)</strong> — ít cổ đông, cổ phần không giao dịch công khai, thường hạn chế chuyển nhượng · <strong>công ty đại chúng (publicly held)</strong> — cổ phần giao dịch trên thị trường, chịu luật chứng khoán</td></tr>
<tr><td>Loại đặc biệt</td><td><strong>Công ty nghề nghiệp</strong> (bác sĩ, luật sư); <strong>S corporation</strong> (một quy chế thuế)</td></tr>
</table>
<h3>2. Người sáng lập (promoter) và hợp đồng trước thành lập</h3>
<p><strong>Promoter</strong> gom ý tưởng, con người và tiền lại và lo thủ tục thành lập — thuê mặt bằng, tuyển nhân sự, mua thiết bị trước khi công ty tồn tại. Quy tắc chung:</p>
<ul>
<li>Promoter ký hợp đồng cho một công ty chưa thành lập thì <strong>chịu trách nhiệm cá nhân</strong> với hợp đồng đó, trừ khi bên kia đồng ý chỉ đòi công ty tương lai.</li>
<li>Công ty <strong>không bị ràng buộc</strong> cho tới khi ra đời và <strong>chấp thuận (adopt)</strong> hợp đồng (bằng quyết định rõ ràng, hoặc bằng việc nhận lợi ích từ hợp đồng). Chấp thuận thôi chưa giải phóng promoter; chỉ một <strong>novation</strong> giữa công ty, promoter và bên thứ ba mới làm được việc đó.</li>
<li>Promoter có <strong>nghĩa vụ trung thành, tín thác</strong> với công ty và cổ đông tương lai: không được kiếm lợi bí mật, vd bán đất của mình cho công ty với giá thổi phồng mà không công bố.</li>
</ul>
<h3>3. Thành lập công ty</h3>
<ol>
<li>Chọn bang thành lập (nhiều công ty lớn chọn Delaware vì luật công ty phát triển và có toà chuyên biệt).</li>
<li>Nộp <strong>articles of incorporation</strong> (còn gọi là charter hay certificate — điều lệ thành lập) cho Văn phòng Thư ký bang (secretary of state — cơ quan đăng ký doanh nghiệp của bang). Nội dung điển hình: <strong>tên</strong> công ty, phải có từ như Corporation, Incorporated, Company, Limited (hoặc viết tắt) và không được gây nhầm lẫn với tên khác; <strong>số cổ phần</strong> được phép phát hành và các loại; <strong>người đại diện nhận văn bản và trụ sở đăng ký</strong>; <strong>người lập hồ sơ thành lập</strong>; thường có <strong>mục đích</strong> ("mọi hoạt động kinh doanh hợp pháp").</li>
<li>Theo phần lớn luật hiện đại, công ty tồn tại kể từ khi articles được nộp. Sau đó <strong>cuộc họp tổ chức</strong> thông qua <strong>bylaws</strong> (quy chế nội bộ), bầu giám đốc (director) và cán bộ quản lý, cho phép phát hành cổ phần.</li>
</ol>
<p>Công ty <em>de jure</em> tuân thủ đầy đủ luật; khi đã thành lập thiện chí nhưng có sai sót nhỏ, một số toà công nhận công ty <em>de facto</em> hoặc áp dụng <em>corporation by estoppel</em> (công ty do bị ngăn phủ nhận).</p>
<h3>4. Quyền năng của công ty</h3>
<ul>
<li><strong>Quyền năng rõ ràng</strong> — do luật bang và articles trao: sở hữu tài sản, ký hợp đồng, vay nợ, khởi kiện và bị kiện, phát hành cổ phần.</li>
<li><strong>Quyền năng ngụ ý (phụ trợ)</strong> — quyền cần thiết một cách hợp lý để thực hiện quyền năng và mục đích rõ ràng, vd mua văn phòng phẩm, thuê luật sư.</li>
<li>Hành vi vượt quá quyền năng của công ty là <strong>ultra vires</strong>. Vì articles hiện đại thường cho phép "mọi hoạt động kinh doanh hợp pháp", điều này ngày nay ít quan trọng hơn; cổ đông vẫn có thể xin lệnh cấm và nhà nước có thể can thiệp.</li>
</ul>
<h3>5. Xuyên thủng tấm màn công ty</h3>
<p>Trách nhiệm hữu hạn là nguyên tắc, nhưng toà có thể <strong>xuyên thủng tấm màn công ty (piercing the corporate veil)</strong> và buộc cổ đông chịu trách nhiệm cá nhân khi công ty chỉ là vỏ bọc: tiền cá nhân và tiền công ty trộn lẫn, vốn quá ít so với rủi ro kinh doanh, bỏ qua các thủ tục nội bộ, hoặc dùng công ty để gian lận. Đây là biện pháp ngoại lệ và tuỳ tình tiết từng vụ.</p>
<div class="callout"><span class="badge">Đối chiếu Việt Nam</span> Theo Luật Doanh nghiệp 2020, công ty đăng ký tại cơ quan đăng ký kinh doanh; hồ sơ gồm <strong>điều lệ công ty</strong> (tương đương gần như articles cộng bylaws của Mỹ) và danh sách thành viên hoặc cổ đông sáng lập. Luật quy định về <strong>hợp đồng trước đăng ký doanh nghiệp</strong>: người thành lập ký hợp đồng chịu trách nhiệm, và công ty kế thừa quyền, nghĩa vụ khi được thành lập, theo các điều kiện luật định. Tên doanh nghiệp phải theo quy tắc đặt tên, không được trùng hoặc gây nhầm lẫn với tên đã đăng ký. Kiểm các điều khoản hiện hành trên vbpl.vn.</div>`,
  ]]);

const u11 = doc('law102-3-3-ownership-corporation', '3.3 — Ch 33 · Ownership of a corporation (Unit 11)|||3.3 — Ch 33 · Sở hữu công ty (Unit 11)',
  'Vốn cổ phần, cổ phần được phép phát hành, đã phát hành, đang lưu hành, cổ phiếu quỹ; mệnh giá; chứng chỉ cổ phần; cổ phần phổ thông và cổ phần ưu đãi (cumulative, non-cumulative, participating, convertible, redeemable); cổ tức và điều kiện chia; chuyển nhượng cổ phần; đối chiếu công ty cổ phần Việt Nam.',
  [[
    `<span class="eyebrow">LAW102 · Part 3 · Lesson 3.3</span>
<h2>Ownership of a corporation</h2>
<p class="lead">Shareholders own the corporation, but they own it through <strong>shares</strong> — units of ownership that carry a bundle of rights to vote, to receive dividends and to share in what is left if the company is wound up.</p>
<h3>1. Capital stock vocabulary</h3>
<table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td>Authorised shares</td><td>The maximum number the articles allow the corporation to issue</td></tr>
<tr><td>Issued shares</td><td>Shares actually sold or distributed to shareholders</td></tr>
<tr><td>Outstanding shares</td><td>Issued shares still held by shareholders</td></tr>
<tr><td>Treasury shares</td><td>Shares issued and later reacquired by the corporation; they carry no vote and receive no dividends while held</td></tr>
<tr><td>Par value / no-par</td><td>A nominal value stated in the articles (not the market price); many states allow no-par shares</td></tr>
<tr><td>Stock certificate</td><td>Written evidence of ownership; today most shares are uncertificated, recorded electronically in book-entry form</td></tr>
</table>
<h3>2. Common stock</h3>
<p>Every corporation has at least one class of <strong>common stock</strong>. Common shareholders usually <strong>vote</strong> (elect directors, approve fundamental changes), receive dividends when declared, and have a <strong>residual claim</strong>: on liquidation they are paid last, after creditors and preferred shareholders. They bear the most risk and gain the most if the company grows.</p>
<h3>3. Preferred stock</h3>
<p><strong>Preferred stock</strong> gives priority over common stock, usually as to <strong>dividends</strong> (a fixed rate or amount, often a percentage of par) and to <strong>assets on liquidation</strong>. In exchange, preferred shares usually carry <strong>no voting rights</strong>, except on matters that affect their own class. Variants:</p>
<ul>
<li><strong>Cumulative</strong> — if a dividend is not paid in a year, the unpaid amount (<em>dividends in arrears</em>) accumulates, and all arrears plus the current preferred dividend must be paid before common shareholders receive anything.</li>
<li><strong>Non-cumulative</strong> — a skipped dividend is lost for good; only the current year's preferred dividend has priority.</li>
<li><strong>Participating</strong> — after receiving its fixed dividend, shares further in distributions with common; non-participating preferred receives only the fixed amount.</li>
<li><strong>Convertible</strong> (can be exchanged for common shares) and <strong>redeemable/callable</strong> (the corporation can buy it back at a set price).</li>
</ul>
<h3>4. Dividends</h3>
<ul>
<li>Dividends are distributions of profits. The <strong>board of directors decides</strong> whether and when to declare them; courts respect that discretion unless the board acts in bad faith or abuses it.</li>
<li>Statutes restrict the source: a corporation generally may not pay a dividend if it is insolvent or the payment would make it unable to pay its debts. Directors who approve an illegal dividend can be personally liable.</li>
<li>Once a <strong>cash dividend is declared</strong>, it becomes a debt of the corporation to the shareholders of record on the record date.</li>
<li>Forms: <strong>cash</strong>, <strong>property</strong>, <strong>stock dividends</strong> (additional shares). A <strong>stock split</strong> (e.g. 2-for-1) is not a distribution of profits: it simply divides each share into more shares.</li>
</ul>
<h3>5. Transfer of shares</h3>
<p>Shares are freely transferable as a rule. Close corporations often restrict transfer — e.g. a <strong>right of first refusal</strong> for the company or other shareholders — to keep ownership within a small group. Restrictions are generally valid if reasonable and noted on the certificate or made known to the buyer. Public companies' share trading is governed by federal and state securities law.</p>
<div class="callout"><span class="badge">Vietnam counterpart / Đối chiếu Việt Nam</span> Under the Law on Enterprises 2020, a joint-stock company must have <strong>ordinary shares</strong> (cổ phần phổ thông) and may have <strong>preference shares</strong>: dividend preference, redeemable preference, voting preference (limited to specific holders and conditions) and other types set by the charter. Holders of dividend-preference shares generally have no vote at the general meeting. Dividends on ordinary shares may be paid only after the company has met its tax and financial obligations and remains able to pay its debts as they fall due. Check the detailed conditions in the current law on vbpl.vn.</div>`,
    `<span class="eyebrow">LAW102 · Phần 3 · Bài 3.3</span>
<h2>Sở hữu công ty</h2>
<p class="lead">Cổ đông sở hữu công ty, nhưng sở hữu qua <strong>cổ phần</strong> — đơn vị sở hữu mang một bó quyền: biểu quyết, nhận cổ tức và chia phần tài sản còn lại khi công ty giải thể.</p>
<h3>1. Thuật ngữ về vốn cổ phần</h3>
<table>
<tr><th>Thuật ngữ</th><th>Ý nghĩa</th></tr>
<tr><td>Cổ phần được phép phát hành</td><td>Số tối đa mà articles cho phép công ty phát hành</td></tr>
<tr><td>Cổ phần đã phát hành</td><td>Cổ phần đã thực sự bán hoặc phân phối cho cổ đông</td></tr>
<tr><td>Cổ phần đang lưu hành</td><td>Cổ phần đã phát hành mà cổ đông còn nắm giữ</td></tr>
<tr><td>Cổ phiếu quỹ</td><td>Cổ phần đã phát hành rồi được công ty mua lại; khi công ty giữ, chúng không có quyền biểu quyết và không nhận cổ tức</td></tr>
<tr><td>Mệnh giá / không mệnh giá</td><td>Giá trị danh nghĩa ghi trong articles (không phải giá thị trường); nhiều bang cho phép cổ phần không mệnh giá</td></tr>
<tr><td>Chứng chỉ cổ phần</td><td>Văn bản chứng minh quyền sở hữu; ngày nay phần lớn cổ phần không có chứng chỉ giấy, được ghi nhận điện tử dưới dạng ghi sổ</td></tr>
</table>
<h3>2. Cổ phần phổ thông</h3>
<p>Mọi công ty có ít nhất một loại <strong>cổ phần phổ thông</strong>. Cổ đông phổ thông thường có quyền <strong>biểu quyết</strong> (bầu hội đồng quản trị, thông qua thay đổi cơ bản), nhận cổ tức khi được công bố, và có <strong>quyền đòi phần còn lại</strong>: khi thanh lý họ được trả sau cùng, sau chủ nợ và cổ đông ưu đãi. Họ chịu rủi ro lớn nhất và hưởng nhiều nhất nếu công ty tăng trưởng.</p>
<h3>3. Cổ phần ưu đãi</h3>
<p><strong>Cổ phần ưu đãi</strong> được ưu tiên hơn cổ phần phổ thông, thường về <strong>cổ tức</strong> (mức cố định, hay tính theo % mệnh giá) và về <strong>tài sản khi thanh lý</strong>. Đổi lại, cổ phần ưu đãi thường <strong>không có quyền biểu quyết</strong>, trừ các vấn đề ảnh hưởng tới chính loại cổ phần đó. Các biến thể:</p>
<ul>
<li><strong>Cộng dồn (cumulative)</strong> — nếu năm nào không trả cổ tức, số chưa trả (<em>cổ tức nợ đọng</em>) được cộng dồn, và toàn bộ nợ đọng cộng cổ tức ưu đãi năm hiện tại phải được trả trước khi cổ đông phổ thông nhận bất cứ gì.</li>
<li><strong>Không cộng dồn (non-cumulative)</strong> — cổ tức bị bỏ qua là mất hẳn; chỉ cổ tức ưu đãi của năm hiện tại được ưu tiên.</li>
<li><strong>Tham dự (participating)</strong> — sau khi nhận cổ tức cố định còn được chia thêm cùng cổ đông phổ thông; loại không tham dự chỉ nhận mức cố định.</li>
<li><strong>Chuyển đổi được</strong> (đổi thành cổ phần phổ thông) và <strong>có thể mua lại</strong> (công ty được mua lại theo giá định trước).</li>
</ul>
<h3>4. Cổ tức</h3>
<ul>
<li>Cổ tức là phần lợi nhuận được phân phối. <strong>Hội đồng quản trị quyết định</strong> có công bố cổ tức hay không và khi nào; toà tôn trọng quyền tự quyết đó trừ khi hội đồng hành động thiếu thiện chí hay lạm quyền.</li>
<li>Luật hạn chế nguồn chi trả: công ty nói chung không được trả cổ tức nếu đang mất khả năng thanh toán hoặc việc trả khiến nó không trả được nợ. Thành viên hội đồng quản trị chấp thuận cổ tức trái luật có thể phải chịu trách nhiệm cá nhân.</li>
<li>Khi <strong>cổ tức tiền mặt đã được công bố</strong>, nó trở thành khoản nợ của công ty với các cổ đông có tên vào ngày chốt danh sách.</li>
<li>Hình thức: <strong>tiền mặt</strong>, <strong>tài sản</strong>, <strong>cổ tức bằng cổ phiếu</strong> (thêm cổ phần). <strong>Chia tách cổ phiếu</strong> (vd 1 thành 2) không phải phân phối lợi nhuận: nó chỉ chia mỗi cổ phần thành nhiều cổ phần hơn.</li>
</ul>
<h3>5. Chuyển nhượng cổ phần</h3>
<p>Theo nguyên tắc, cổ phần được tự do chuyển nhượng. Công ty đóng thường hạn chế chuyển nhượng — vd <strong>quyền ưu tiên mua</strong> của công ty hay cổ đông khác — để giữ sở hữu trong một nhóm nhỏ. Các hạn chế nói chung hợp lệ nếu hợp lý và được ghi trên chứng chỉ hoặc được cho người mua biết. Giao dịch cổ phần của công ty đại chúng do luật chứng khoán liên bang và bang điều chỉnh.</p>
<div class="callout"><span class="badge">Đối chiếu Việt Nam</span> Theo Luật Doanh nghiệp 2020, công ty cổ phần phải có <strong>cổ phần phổ thông</strong> và có thể có <strong>cổ phần ưu đãi</strong>: ưu đãi cổ tức, ưu đãi hoàn lại, ưu đãi biểu quyết (giới hạn về người nắm giữ và điều kiện) và loại khác do điều lệ quy định. Cổ đông sở hữu cổ phần ưu đãi cổ tức nói chung không có quyền biểu quyết tại đại hội đồng cổ đông. Cổ tức cho cổ phần phổ thông chỉ được trả khi công ty đã hoàn thành nghĩa vụ thuế, nghĩa vụ tài chính và vẫn bảo đảm thanh toán đủ các khoản nợ đến hạn. Kiểm điều kiện chi tiết trong luật đang có hiệu lực trên vbpl.vn.</div>`,
  ]]);

const u12 = doc('law102-3-4-management-dissolution', '3.4 — Ch 34 · Management and dissolution of a corporation (Unit 12)|||3.4 — Ch 34 · Quản trị và giải thể công ty (Unit 12)',
  'Đại hội cổ đông, thông báo, quorum, uỷ quyền; quyền của cổ đông; bầu thẳng và bầu dồn phiếu (công thức); hội đồng quản trị, cán bộ quản lý và nghĩa vụ cẩn trọng, trung thành, quy tắc phán quyết kinh doanh; sáp nhập (merger) và hợp nhất (consolidation), quyền định giá của cổ đông phản đối; giải thể và thanh lý; đối chiếu Luật Doanh nghiệp 2020.',
  [[
    `<span class="eyebrow">LAW102 · Part 3 · Lesson 3.4</span>
<h2>Management and dissolution of a corporation</h2>
<p class="lead">Shareholders own, directors decide policy, officers run the day-to-day business. Most corporate-law disputes are about where the lines between these three groups lie and what each owes to the company.</p>
<h3>1. Shareholders' meetings</h3>
<ul>
<li><strong>Annual meetings</strong> elect directors and deal with ordinary business; <strong>special meetings</strong> may be called for matters such as a merger. Shareholders must receive proper <strong>notice</strong> of time, place and (for special meetings) purpose.</li>
<li><strong>Quorum</strong> — the minimum share presence required to act; the default in most statutes is a <strong>majority of the shares entitled to vote</strong>, which the articles may change within limits.</li>
<li>Shareholders may vote in person or by <strong>proxy</strong> (written authorisation for another to vote their shares). Groups may pool votes through voting agreements or <strong>voting trusts</strong>.</li>
</ul>
<h3>2. Shareholders' rights</h3>
<p>To vote; to receive dividends once declared; to <strong>inspect</strong> books and records for a proper purpose; <strong>pre-emptive rights</strong> to buy new shares in proportion to their holdings (in many states only if the articles grant them); to transfer shares; to share in assets on dissolution; and to <strong>sue</strong> — directly for harm to themselves, or by a <strong>derivative suit</strong> on behalf of the corporation when management will not act.</p>
<h3>3. Straight vs cumulative voting for directors</h3>
<p>Under <strong>straight voting</strong> each seat is voted separately, so a majority holder elects every director. <strong>Cumulative voting</strong> — mandatory in some states, optional in most — multiplies each shareholder's shares by the number of seats and lets the votes be concentrated on a few candidates, giving minority shareholders a chance of representation.</p>
<pre><code>Shares needed to elect N directors = [ S x N / (D + 1) ] + 1
S = shares voting at the meeting, D = directors to be elected
(take the whole-number part of the bracket, then add 1)</code></pre>
<h3>4. Directors and officers</h3>
<p>The <strong>board of directors</strong> sets policy, declares dividends, approves major transactions and appoints and supervises <strong>officers</strong> (president or CEO, vice-presidents, secretary, treasurer or CFO), who are agents of the corporation. The board acts as a body, at meetings with a quorum or by unanimous written consent. Directors and officers owe <strong>fiduciary duties</strong>:</p>
<table>
<tr><th>Duty</th><th>What it requires</th></tr>
<tr><td><strong>Duty of care</strong></td><td>Act in good faith, with the care an ordinarily prudent person would use in a like position, and on an informed basis (read the reports, ask questions)</td></tr>
<tr><td><strong>Duty of loyalty</strong></td><td>Put the corporation's interests first: no undisclosed self-dealing, no competing with the corporation, no taking a <em>corporate opportunity</em> for oneself; conflicts must be disclosed and approved by disinterested directors or shareholders, or the deal must be fair</td></tr>
</table>
<p>The <strong>business judgment rule</strong> protects directors from liability for honest mistakes: courts will not second-guess a decision made in good faith, on an informed basis, without a conflict of interest and with a rational business purpose — even if it loses money. It does not protect fraud, bad faith, conflicted decisions or a total failure to inform oneself.</p>
<h3>5. Merger, consolidation and dissolution</h3>
<table>
<tr><th></th><th>Merger</th><th>Consolidation</th></tr>
<tr><td>Result</td><td>One company absorbs another: A + B → A (B ceases to exist)</td><td>Both combine into a new company: A + B → C (A and B cease to exist)</td></tr>
<tr><td>Liabilities</td><td>The survivor takes all assets and liabilities</td><td>The new company takes all assets and liabilities</td></tr>
</table>
<p>Both normally require approval by each board and by the shareholders of each company; shareholders who vote against generally have <strong>appraisal rights</strong> — to be paid the fair value of their shares. Many states allow a <em>short-form merger</em> without shareholder votes when a parent owns a very large majority (commonly 90%) of a subsidiary.</p>
<p><strong>Dissolution</strong> ends the corporation's legal existence: <em>voluntary</em> (board resolution approved by shareholders), <em>administrative</em> (by the state, e.g. for failing to file reports or pay fees) or <em>judicial</em> (on petition by the state, shareholders — deadlock, oppression, waste of assets — or creditors of an insolvent firm). Dissolution is followed by <strong>winding up</strong> (liquidation): collect assets, pay creditors, then distribute the rest to shareholders — preferred first if they have a liquidation preference.</p>
<div class="callout"><span class="badge">Vietnam counterpart / Đối chiếu Việt Nam</span> Under the Law on Enterprises 2020, a joint-stock company is governed by the General Meeting of Shareholders, the Board of Directors (Hội đồng quản trị) and the Director or General Director, with either a Supervisory Board or an audit committee within a board that has independent members. The law sets <strong>quorum</strong> thresholds for the first, second and third convening of a general meeting, and provides that board members are elected by <strong>cumulative voting</strong> unless the charter provides otherwise. Vietnamese terms differ: <em>sáp nhập</em> = merger, <em>hợp nhất</em> = consolidation. Check the thresholds and procedures in the current text on vbpl.vn.</div>`,
    `<span class="eyebrow">LAW102 · Phần 3 · Bài 3.4</span>
<h2>Quản trị và giải thể công ty</h2>
<p class="lead">Cổ đông sở hữu, hội đồng quản trị quyết định chính sách, cán bộ quản lý điều hành hằng ngày. Phần lớn tranh chấp luật công ty xoay quanh ranh giới giữa ba nhóm này và nghĩa vụ của mỗi nhóm với công ty.</p>
<h3>1. Đại hội cổ đông</h3>
<ul>
<li><strong>Đại hội thường niên</strong> bầu hội đồng quản trị và giải quyết việc thường lệ; <strong>đại hội bất thường</strong> có thể được triệu tập cho các việc như sáp nhập. Cổ đông phải nhận <strong>thông báo</strong> hợp lệ về thời gian, địa điểm và (với đại hội bất thường) mục đích.</li>
<li><strong>Quorum (túc số)</strong> — mức cổ phần tối thiểu có mặt để đại hội được quyết định; mặc định trong phần lớn luật là <strong>đa số cổ phần có quyền biểu quyết</strong>, articles có thể thay đổi trong giới hạn.</li>
<li>Cổ đông có thể biểu quyết trực tiếp hoặc <strong>uỷ quyền (proxy)</strong> (văn bản cho người khác bỏ phiếu thay). Các nhóm có thể gộp phiếu qua thoả thuận biểu quyết hay <strong>uỷ thác biểu quyết (voting trust)</strong>.</li>
</ul>
<h3>2. Quyền của cổ đông</h3>
<p>Biểu quyết; nhận cổ tức khi đã được công bố; <strong>xem xét</strong> sổ sách, hồ sơ vì mục đích chính đáng; <strong>quyền ưu tiên mua</strong> cổ phần mới theo tỷ lệ sở hữu (ở nhiều bang chỉ khi articles trao quyền này); chuyển nhượng cổ phần; được chia tài sản khi giải thể; và <strong>khởi kiện</strong> — trực tiếp khi bản thân bị thiệt hại, hoặc bằng <strong>vụ kiện phái sinh</strong> nhân danh công ty khi ban quản lý không chịu hành động.</p>
<h3>3. Bầu thẳng và bầu dồn phiếu hội đồng quản trị</h3>
<p>Với <strong>bầu thẳng (straight voting)</strong>, mỗi ghế được bầu riêng, nên người nắm đa số bầu được mọi thành viên. <strong>Bầu dồn phiếu (cumulative voting)</strong> — bắt buộc ở một số bang, tuỳ chọn ở đa số bang — nhân số cổ phần của mỗi cổ đông với số ghế cần bầu và cho phép dồn phiếu cho một vài ứng viên, giúp cổ đông thiểu số có cơ hội có đại diện.</p>
<pre><code>Số cổ phần cần để bầu được N thành viên = [ S x N / (D + 1) ] + 1
S = số cổ phần tham gia biểu quyết, D = số thành viên cần bầu
(lấy phần nguyên của biểu thức trong ngoặc rồi cộng 1)</code></pre>
<h3>4. Hội đồng quản trị và cán bộ quản lý</h3>
<p><strong>Hội đồng quản trị (board of directors)</strong> định chính sách, công bố cổ tức, phê duyệt giao dịch lớn, bổ nhiệm và giám sát <strong>cán bộ quản lý (officers)</strong> (chủ tịch điều hành hay CEO, phó chủ tịch, thư ký, thủ quỹ hay CFO) — những người là đại diện của công ty. Hội đồng hành động như một tập thể, qua cuộc họp đủ túc số hoặc văn bản đồng thuận của tất cả thành viên. Thành viên hội đồng và cán bộ quản lý có <strong>nghĩa vụ tín thác</strong>:</p>
<table>
<tr><th>Nghĩa vụ</th><th>Đòi hỏi gì</th></tr>
<tr><td><strong>Nghĩa vụ cẩn trọng</strong></td><td>Hành động thiện chí, với sự cẩn trọng mà một người bình thường thận trọng sẽ dùng ở vị trí tương tự, và trên cơ sở có đủ thông tin (đọc báo cáo, đặt câu hỏi)</td></tr>
<tr><td><strong>Nghĩa vụ trung thành</strong></td><td>Đặt lợi ích công ty lên trước: không giao dịch tư lợi mà không công bố, không cạnh tranh với công ty, không chiếm <em>cơ hội kinh doanh của công ty</em> cho mình; xung đột lợi ích phải được công bố và được thành viên hội đồng hay cổ đông không liên quan chấp thuận, hoặc giao dịch phải công bằng</td></tr>
</table>
<p><strong>Quy tắc phán quyết kinh doanh (business judgment rule)</strong> bảo vệ thành viên hội đồng khỏi trách nhiệm vì sai lầm trung thực: toà không phán xét lại một quyết định được đưa ra thiện chí, trên cơ sở có thông tin, không có xung đột lợi ích và có mục đích kinh doanh hợp lý — kể cả khi nó gây lỗ. Quy tắc không che chắn gian lận, thiếu thiện chí, quyết định có xung đột lợi ích hay việc hoàn toàn không tìm hiểu thông tin.</p>
<h3>5. Sáp nhập, hợp nhất và giải thể</h3>
<table>
<tr><th></th><th>Sáp nhập (merger)</th><th>Hợp nhất (consolidation)</th></tr>
<tr><td>Kết quả</td><td>Một công ty hấp thụ công ty khác: A + B → A (B chấm dứt tồn tại)</td><td>Hai công ty kết hợp thành công ty mới: A + B → C (A và B chấm dứt tồn tại)</td></tr>
<tr><td>Trách nhiệm</td><td>Công ty còn lại nhận toàn bộ tài sản và nợ</td><td>Công ty mới nhận toàn bộ tài sản và nợ</td></tr>
</table>
<p>Cả hai thường cần hội đồng quản trị của mỗi công ty và cổ đông của mỗi công ty chấp thuận; cổ đông bỏ phiếu phản đối nói chung có <strong>quyền định giá (appraisal rights)</strong> — được trả giá trị hợp lý của cổ phần. Nhiều bang cho phép <em>sáp nhập rút gọn</em> không cần cổ đông biểu quyết khi công ty mẹ sở hữu đại đa số (thường là 90%) cổ phần của công ty con.</p>
<p><strong>Giải thể</strong> chấm dứt tư cách pháp lý của công ty: <em>tự nguyện</em> (nghị quyết của hội đồng được cổ đông thông qua), <em>hành chính</em> (do nhà nước, vd vì không nộp báo cáo hay lệ phí) hoặc <em>theo phán quyết toà</em> (theo yêu cầu của nhà nước, cổ đông — bế tắc, chèn ép, phung phí tài sản — hoặc chủ nợ của công ty mất khả năng thanh toán). Sau giải thể là <strong>thanh lý (winding up)</strong>: thu hồi tài sản, trả chủ nợ, rồi chia phần còn lại cho cổ đông — cổ đông ưu đãi trước nếu có quyền ưu tiên khi thanh lý.</p>
<div class="callout"><span class="badge">Đối chiếu Việt Nam</span> Theo Luật Doanh nghiệp 2020, công ty cổ phần được quản trị bởi Đại hội đồng cổ đông, Hội đồng quản trị và Giám đốc hoặc Tổng giám đốc, kèm Ban kiểm soát hoặc Uỷ ban kiểm toán thuộc một Hội đồng quản trị có thành viên độc lập. Luật quy định <strong>điều kiện tiến hành họp</strong> (túc số) cho lần triệu tập thứ nhất, thứ hai và thứ ba của đại hội, và quy định việc bầu thành viên Hội đồng quản trị thực hiện theo phương thức <strong>bầu dồn phiếu</strong>, trừ khi điều lệ có quy định khác. Thuật ngữ Việt Nam: <em>sáp nhập</em> = merger, <em>hợp nhất</em> = consolidation. Kiểm các ngưỡng và thủ tục trong văn bản đang có hiệu lực trên vbpl.vn.</div>`,
  ]]);

const ex2 = doc('law102-3-5-exercise', 'Exercise 2 — cumulative voting and preferred dividends at Gamma Corp.|||Bài tập 2 — bầu dồn phiếu và cổ tức ưu đãi tại Gamma Corp.',
  'Bài tập kiểu tự luận: tính số phiếu và số ghế hội đồng quản trị tối đa cổ đông thiểu số bảo đảm được bằng bầu dồn phiếu so với bầu thẳng, chiến lược dồn phiếu; tính cổ tức ưu đãi cộng dồn bị nợ 2 năm phải trả trước cổ đông phổ thông, so với ưu đãi không cộng dồn; kèm lời giải.',
  [[
    `<span class="eyebrow">LAW102 · Part 3 · Exercise</span>
<h2>Exercise 2 — cumulative voting and preferred dividends at Gamma Corp.</h2>
<div class="callout"><span class="badge">Problem</span> A fictional company with illustrative numbers. Gamma Corp. has 100,000 common shares outstanding, all voting, and 10,000 preferred shares (par $100, 6% dividend, non-voting). Five directors are elected at the annual meeting. Minority shareholder Minh holds 35,000 common shares; the majority group holds 65,000. (a) Under straight voting, how many seats can Minh win? (b) Under cumulative voting, how many votes does each side have, and how many seats can Minh be sure of? Verify with the formula and with the vote counts. (c) What happens if Minh spreads his votes over three candidates? (d) Gamma paid no dividends for the last two years. This year the board declares $300,000 in total dividends. How much goes to the preferred shareholders and how much per common share if the preferred is cumulative? And if it is non-cumulative?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Straight voting: each of the 5 seats is a separate contest.
    The majority (65,000) outvotes Minh (35,000) on every seat -> Minh wins 0 seats.

(b) Cumulative votes = shares x seats
    Minh:     35,000 x 5 = 175,000 votes
    Majority: 65,000 x 5 = 325,000 votes      (total 500,000)

    Shares needed for N seats = [S x N / (D + 1)] + 1,  S = 100,000, D = 5
    N = 1: [100,000 x 1 / 6] + 1 = 16,666 + 1 = 16,667
    N = 2: [100,000 x 2 / 6] + 1 = 33,333 + 1 = 33,334   &lt;= 35,000  OK
    N = 3: [100,000 x 3 / 6] + 1 = 50,000 + 1 = 50,001   &gt;  35,000  no
    -> Minh can be sure of 2 seats.

    Check: Minh puts 175,000 / 2 = 87,500 votes on each of 2 candidates.
    To win 4 seats the majority needs 4 candidates above 87,500
    -> more than 4 x 87,500 = 350,000 votes, but it has only 325,000. Impossible.
    Majority on 3 candidates: 325,000 / 3 = 108,333 each -> it wins 3 seats.
    Result: majority 3, Minh 2.

(c) Minh on 3 candidates: 175,000 / 3 = 58,333 each.
    Majority on 4 candidates: 325,000 / 4 = 81,250 each &gt; 58,333
    -> majority wins 4 seats, Minh only 1. Spreading votes too thin loses a seat.

(d) Preferred dividend per year = 10,000 x $100 x 6% = $60,000
    Cumulative:  arrears 2 x $60,000 = $120,000
                 + current year        $60,000
                 = preferred first     $180,000
                 left for common: $300,000 − $180,000 = $120,000
                 per common share: $120,000 / 100,000 = $1.20
    Non-cumulative: preferred gets only the current $60,000
                 common: $300,000 − $60,000 = $240,000 -> $2.40 per share</code></pre>
<p><strong>Why:</strong> cumulative voting turns the election into one pool of votes, so a minority that concentrates its votes can guarantee seats roughly in proportion to its holding — that is its purpose, and why majority groups sometimes prefer straight voting or fewer seats per election. On dividends, "cumulative" is a promise that skipped preferred dividends are only postponed: nothing reaches common shareholders until the arrears are cleared. Remember that no shareholder can force a dividend in the first place; the board declares it within the legal limits on distributions.</p>`,
    `<span class="eyebrow">LAW102 · Phần 3 · Bài tập</span>
<h2>Bài tập 2 — bầu dồn phiếu và cổ tức ưu đãi tại Gamma Corp.</h2>
<div class="callout"><span class="badge">Đề</span> Công ty giả định, số liệu minh hoạ. Gamma Corp. có 100.000 cổ phần phổ thông đang lưu hành, đều có quyền biểu quyết, và 10.000 cổ phần ưu đãi (mệnh giá 100 $, cổ tức 6%, không có quyền biểu quyết). Đại hội thường niên bầu năm thành viên hội đồng quản trị. Cổ đông thiểu số Minh nắm 35.000 cổ phần phổ thông; nhóm đa số nắm 65.000. (a) Với bầu thẳng, Minh giành được bao nhiêu ghế? (b) Với bầu dồn phiếu, mỗi bên có bao nhiêu phiếu, và Minh chắc chắn giành được bao nhiêu ghế? Kiểm lại bằng công thức và bằng số phiếu. (c) Điều gì xảy ra nếu Minh chia phiếu cho ba ứng viên? (d) Gamma không trả cổ tức trong hai năm qua. Năm nay hội đồng quản trị công bố tổng cổ tức 300.000 $. Cổ đông ưu đãi nhận bao nhiêu và mỗi cổ phần phổ thông nhận bao nhiêu nếu cổ phần ưu đãi là loại cộng dồn? Nếu là loại không cộng dồn thì sao?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Bầu thẳng: mỗi ghế trong 5 ghế là một cuộc bầu riêng.
    Nhóm đa số (65.000) thắng Minh (35.000) ở mọi ghế -> Minh được 0 ghế.

(b) Số phiếu dồn = số cổ phần x số ghế
    Minh:      35.000 x 5 = 175.000 phiếu
    Nhóm đa số: 65.000 x 5 = 325.000 phiếu      (tổng 500.000)

    Số cổ phần cần cho N ghế = [S x N / (D + 1)] + 1,  S = 100.000, D = 5
    N = 1: [100.000 x 1 / 6] + 1 = 16.666 + 1 = 16.667
    N = 2: [100.000 x 2 / 6] + 1 = 33.333 + 1 = 33.334   &lt;= 35.000  đạt
    N = 3: [100.000 x 3 / 6] + 1 = 50.000 + 1 = 50.001   &gt;  35.000  không
    -> Minh chắc chắn được 2 ghế.

    Kiểm: Minh dồn 175.000 / 2 = 87.500 phiếu cho mỗi ứng viên trong 2 ứng viên.
    Muốn giành 4 ghế, nhóm đa số cần 4 ứng viên trên 87.500
    -> cần hơn 4 x 87.500 = 350.000 phiếu, nhưng chỉ có 325.000. Không thể.
    Nhóm đa số dồn cho 3 ứng viên: 325.000 / 3 = 108.333 mỗi người -> được 3 ghế.
    Kết quả: đa số 3, Minh 2.

(c) Minh chia cho 3 ứng viên: 175.000 / 3 = 58.333 mỗi người.
    Nhóm đa số chia cho 4 ứng viên: 325.000 / 4 = 81.250 mỗi người &gt; 58.333
    -> đa số được 4 ghế, Minh chỉ 1. Chia phiếu quá mỏng làm mất một ghế.

(d) Cổ tức ưu đãi mỗi năm = 10.000 x 100 $ x 6% = 60.000 $
    Cộng dồn:     nợ đọng 2 x 60.000 $ = 120.000 $
                  + năm hiện tại           60.000 $
                  = trả ưu đãi trước      180.000 $
                  còn cho cổ phần phổ thông: 300.000 $ − 180.000 $ = 120.000 $
                  mỗi cổ phần phổ thông: 120.000 $ / 100.000 = 1,20 $
    Không cộng dồn: ưu đãi chỉ nhận 60.000 $ của năm hiện tại
                  phổ thông: 300.000 $ − 60.000 $ = 240.000 $ -> 2,40 $ mỗi cổ phần</code></pre>
<p><strong>Vì sao:</strong> bầu dồn phiếu biến cuộc bầu thành một "bể phiếu" chung, nên nhóm thiểu số biết dồn phiếu có thể bảo đảm số ghế gần tương xứng với tỷ lệ sở hữu — đó là mục đích của nó, và cũng là lý do nhóm đa số đôi khi thích bầu thẳng hoặc giảm số ghế mỗi lần bầu. Về cổ tức, "cộng dồn" là lời hứa rằng cổ tức ưu đãi bị bỏ qua chỉ bị hoãn: cổ đông phổ thông không nhận gì cho tới khi trả hết nợ đọng. Nhớ rằng không cổ đông nào buộc được công ty chia cổ tức ngay từ đầu; hội đồng quản trị công bố cổ tức trong giới hạn luật định về phân phối.</p>`,
  ]]);

const q3 = quiz('law102-quiz-3', 'Quiz 3 — Business organizations|||Quiz 3 — Tổ chức doanh nghiệp', [
  { id: 'q1', question: 'A corporation’s shareholders are generally liable for the corporation’s debts…|||Cổ đông của một corporation nói chung chịu trách nhiệm về nợ của công ty…', options: ['without limit, like general partners|||vô hạn, như thành viên hợp danh', 'only up to the amount they invested|||chỉ trong phạm vi số vốn đã góp', 'in proportion to their votes at the last meeting|||theo tỷ lệ phiếu biểu quyết ở đại hội gần nhất', 'only if they are also officers|||chỉ khi họ đồng thời là cán bộ quản lý'], correctIndex: 1, explanation: 'Limited liability is a defining feature of the corporation; courts disregard it only in exceptional veil-piercing cases.|||Trách nhiệm hữu hạn là đặc điểm xác định của corporation; toà chỉ bỏ qua nó trong trường hợp ngoại lệ xuyên thủng tấm màn công ty.' },
  { id: 'q2', question: 'At a meeting where 60,000 shares vote to elect 5 directors by cumulative voting, how many shares guarantee the election of one director?|||Tại một đại hội có 60.000 cổ phần biểu quyết để bầu 5 thành viên hội đồng quản trị theo phương thức bầu dồn phiếu, cần bao nhiêu cổ phần để chắc chắn bầu được một thành viên?', options: ['10,001|||10.001', '12,001|||12.001', '20,001|||20.001', '30,001|||30.001'], correctIndex: 0, explanation: '[60,000 x 1 / (5 + 1)] + 1 = 10,000 + 1 = 10,001.|||[60.000 x 1 / (5 + 1)] + 1 = 10.000 + 1 = 10.001.' },
  { id: 'q3', question: 'Alpha Inc. and Beta Inc. combine to form a brand-new company, Gamma Inc., and both Alpha and Beta cease to exist. This is a…|||Alpha Inc. và Beta Inc. kết hợp thành một công ty hoàn toàn mới là Gamma Inc., và cả Alpha lẫn Beta chấm dứt tồn tại. Đây là…', options: ['merger|||sáp nhập (merger)', 'short-form merger|||sáp nhập rút gọn', 'judicial dissolution|||giải thể theo phán quyết toà', 'consolidation|||hợp nhất (consolidation)'], correctIndex: 3, explanation: 'In a consolidation A + B = C, a new entity; in a merger A + B = A, one company survives.|||Hợp nhất là A + B = C, một thực thể mới; sáp nhập là A + B = A, một công ty còn tồn tại.' },
]);

const u13 = doc('law102-4-1-warranties-consumer-protection', '4.1 — Ch 19 · Warranties, product liability & consumer protection (Unit 13)|||4.1 — Ch 19 · Bảo đảm, trách nhiệm sản phẩm & bảo vệ người tiêu dùng (Unit 13)',
  'Bảo đảm rõ ràng (express) và ý kiến người bán (puffery); bảo đảm ngụ ý về khả năng bán được (chỉ thương nhân) và phù hợp mục đích riêng (mọi người bán); bảo đảm quyền sở hữu và không bị xâm phạm; loại trừ bảo đảm, Magnuson–Moss; trách nhiệm sản phẩm; bảo vệ người tiêu dùng ở Mỹ; đối chiếu nghĩa vụ bảo hành BLDS 2015 và Luật Bảo vệ quyền lợi người tiêu dùng 2023.',
  [[
    `<span class="eyebrow">LAW102 · Part 4 · Lesson 4.1</span>
<h2>Warranties, product liability &amp; consumer protection</h2>
<p class="lead">A <strong>warranty</strong> is an assurance by the seller about the goods — what they are, how they perform, who owns them. Warranty law sits where contract law meets ethics: it decides how much a buyer may rely on what a seller says, and on what the seller does not say.</p>
<h3>1. Express warranties (UCC §2-313)</h3>
<p>An express warranty is created by (a) an <strong>affirmation of fact or promise</strong> about the goods, (b) a <strong>description</strong> of the goods, or (c) a <strong>sample or model</strong> — when it becomes part of the basis of the bargain. The seller need not use the words "warrant" or "guarantee", and need not intend to create a warranty. "This jacket is 100% waterproof to 5,000 mm" is an express warranty.</p>
<p><strong>Puffery</strong> is not: a statement of the goods' value or the seller's <em>opinion</em> or commendation ("the best phone on the market", "a great deal") creates no warranty, because a reasonable buyer does not rely on sales talk. The line is between verifiable facts and vague praise.</p>
<h3>2. Implied warranties</h3>
<table>
<tr><th></th><th>Merchantability (§2-314)</th><th>Fitness for a particular purpose (§2-315)</th></tr>
<tr><td>Who gives it</td><td>Only a <strong>merchant</strong> who deals in goods of that kind</td><td><strong>Any seller</strong>, merchant or not</td></tr>
<tr><td>When it arises</td><td>Automatically in every sale by such a merchant</td><td>When the seller has reason to know the buyer's particular purpose <em>and</em> that the buyer relies on the seller's skill or judgment to select suitable goods</td></tr>
<tr><td>What it promises</td><td>Goods are fit for their <em>ordinary</em> purpose, pass without objection in the trade, and are adequately packaged and labelled</td><td>Goods are fit for the buyer's <em>specific</em> purpose</td></tr>
<tr><td>Example</td><td>A new refrigerator must keep food cold</td><td>A buyer asks a paint shop for paint for a boat hull; the clerk picks one that dissolves in sea water</td></tr>
</table>
<h3>3. Warranty of title and against infringement (§2-312)</h3>
<p>Every seller warrants that it has <strong>good title</strong>, that the transfer is rightful and that the goods are free of liens the buyer does not know about. A merchant regularly dealing in goods of the kind also warrants that they are delivered free of any rightful claim of <strong>infringement</strong> (e.g. of a patent or trademark).</p>
<h3>4. Disclaimers and limits (§2-316)</h3>
<ul>
<li>Express warranties are hard to disclaim: words that create a warranty and words that deny it are read consistently where possible; otherwise the disclaimer fails.</li>
<li>To exclude <strong>merchantability</strong>, the language must mention "merchantability" and, if written, be <strong>conspicuous</strong>. To exclude <strong>fitness</strong>, the disclaimer must be <strong>in writing and conspicuous</strong>.</li>
<li>Expressions such as "<strong>as is</strong>" or "with all faults" generally exclude all implied warranties. If the buyer examined the goods (or refused to), there is no implied warranty as to defects an examination should have revealed.</li>
<li>The federal <strong>Magnuson–Moss Warranty Act</strong> governs written warranties on consumer products: a written warranty (above a small price threshold) must be labelled "full" or "limited", and a seller who gives one cannot disclaim implied warranties (with a limited warranty it may limit their duration to that of the written warranty).</li>
<li>Under §2-318 states choose how far warranties extend beyond the buyer — at least to family, household members and guests.</li>
</ul>
<h3>5. Product liability and consumer protection</h3>
<p>A buyer injured by a product can combine a <strong>warranty claim</strong> with <strong>negligence</strong> and <strong>strict liability</strong> (Lesson 1.3). Beyond private lawsuits, consumer protection includes: the <strong>Federal Trade Commission</strong>, which polices unfair or deceptive acts and practices such as false advertising; the <strong>Consumer Product Safety Commission</strong>, which sets safety standards and orders recalls; state <strong>lemon laws</strong> for defective new cars; truth-in-lending disclosure rules; and the FTC's <strong>cooling-off rule</strong>, which lets buyers cancel certain door-to-door sales within three business days.</p>
<div class="callout"><span class="badge">Vietnam counterpart / Đối chiếu Việt Nam</span> The Civil Code 2015 obliges the seller to guarantee ownership of the property sold and its quality, and sets out the <strong>warranty obligation</strong> (nghĩa vụ bảo hành — the syllabus cites Articles 446–449): during the warranty period the buyer may require repair, replacement or return, and compensation for damage. The <strong>Law on Protection of Consumers' Rights 2023</strong>, which replaced the 2010 law, sets duties on product information, warranties, recalls of defective goods and liability for damage they cause. Check article numbers and details in the current texts on vbpl.vn.</div>`,
    `<span class="eyebrow">LAW102 · Phần 4 · Bài 4.1</span>
<h2>Bảo đảm, trách nhiệm sản phẩm &amp; bảo vệ người tiêu dùng</h2>
<p class="lead"><strong>Bảo đảm (warranty)</strong> là sự cam đoan của người bán về hàng hoá — hàng là gì, vận hành ra sao, thuộc sở hữu của ai. Luật về bảo đảm nằm ở chỗ luật hợp đồng gặp đạo đức: nó quyết định người mua được tin tới đâu vào điều người bán nói, và vào điều người bán không nói.</p>
<h3>1. Bảo đảm rõ ràng (UCC §2-313)</h3>
<p>Bảo đảm rõ ràng hình thành từ (a) một <strong>khẳng định về sự kiện hay lời hứa</strong> về hàng hoá, (b) một <strong>mô tả</strong> hàng hoá, hoặc (c) một <strong>mẫu hay mô hình</strong> — khi nó trở thành một phần cơ sở của thương vụ. Người bán không cần dùng từ "bảo đảm" hay "cam kết", và không cần có ý định tạo ra bảo đảm. "Chiếc áo khoác này chống nước 100% tới 5.000 mm" là một bảo đảm rõ ràng.</p>
<p><strong>Lời quảng cáo thổi phồng (puffery)</strong> thì không: câu nói về giá trị của hàng hay <em>ý kiến</em>, lời khen của người bán ("chiếc điện thoại tốt nhất thị trường", "một món hời") không tạo ra bảo đảm, vì người mua bình thường không dựa vào lời chào hàng. Ranh giới nằm giữa sự kiện kiểm chứng được và lời khen chung chung.</p>
<h3>2. Bảo đảm ngụ ý</h3>
<table>
<tr><th></th><th>Khả năng bán được — merchantability (§2-314)</th><th>Phù hợp mục đích riêng — fitness for a particular purpose (§2-315)</th></tr>
<tr><td>Ai đưa ra</td><td>Chỉ <strong>thương nhân</strong> kinh doanh loại hàng đó</td><td><strong>Mọi người bán</strong>, thương nhân hay không</td></tr>
<tr><td>Khi nào phát sinh</td><td>Tự động trong mọi giao dịch bán của thương nhân đó</td><td>Khi người bán có lý do biết mục đích riêng của người mua <em>và</em> biết người mua dựa vào kỹ năng, phán đoán của người bán để chọn hàng phù hợp</td></tr>
<tr><td>Cam đoan điều gì</td><td>Hàng phù hợp với mục đích <em>thông thường</em>, được giới kinh doanh chấp nhận, được đóng gói và ghi nhãn đầy đủ</td><td>Hàng phù hợp với mục đích <em>cụ thể</em> của người mua</td></tr>
<tr><td>Ví dụ</td><td>Tủ lạnh mới phải giữ lạnh được thực phẩm</td><td>Người mua nhờ cửa hàng sơn chọn sơn cho thân tàu; nhân viên chọn loại sơn tan trong nước biển</td></tr>
</table>
<h3>3. Bảo đảm quyền sở hữu và không bị xâm phạm (§2-312)</h3>
<p>Mọi người bán đều bảo đảm mình có <strong>quyền sở hữu hợp pháp</strong>, việc chuyển giao là đúng quyền và hàng không bị cầm giữ, thế chấp mà người mua không biết. Thương nhân thường xuyên kinh doanh loại hàng đó còn bảo đảm hàng được giao không bị bên nào có quyền khiếu nại về <strong>xâm phạm</strong> (vd sáng chế hay nhãn hiệu).</p>
<h3>4. Loại trừ và giới hạn bảo đảm (§2-316)</h3>
<ul>
<li>Bảo đảm rõ ràng khó loại trừ: lời tạo ra bảo đảm và lời phủ nhận nó được giải thích nhất quán nếu có thể; nếu không thì điều khoản loại trừ vô hiệu.</li>
<li>Muốn loại trừ bảo đảm <strong>khả năng bán được</strong>, câu chữ phải nhắc tới "merchantability" và, nếu bằng văn bản, phải <strong>dễ thấy</strong>. Muốn loại trừ bảo đảm <strong>phù hợp mục đích riêng</strong>, điều khoản phải <strong>bằng văn bản và dễ thấy</strong>.</li>
<li>Các cụm như "<strong>as is</strong>" (nguyên trạng) hay "with all faults" nói chung loại trừ mọi bảo đảm ngụ ý. Nếu người mua đã kiểm tra hàng (hoặc từ chối kiểm tra), không có bảo đảm ngụ ý về khuyết tật mà việc kiểm tra lẽ ra phát hiện được.</li>
<li><strong>Đạo luật Bảo đảm Magnuson–Moss</strong> của liên bang điều chỉnh bảo đảm bằng văn bản cho sản phẩm tiêu dùng: bảo đảm bằng văn bản (với sản phẩm trên một ngưỡng giá nhỏ) phải ghi là "full" (đầy đủ) hay "limited" (hạn chế), và người bán đã đưa ra bảo đảm bằng văn bản thì không được loại trừ bảo đảm ngụ ý (với bảo đảm hạn chế, có thể giới hạn thời hạn của chúng bằng thời hạn bảo đảm bằng văn bản).</li>
<li>Theo §2-318, các bang tự chọn mức mở rộng bảo đảm ra ngoài người mua — ít nhất tới gia đình, người trong hộ và khách tới nhà.</li>
</ul>
<h3>5. Trách nhiệm sản phẩm và bảo vệ người tiêu dùng</h3>
<p>Người mua bị thương vì sản phẩm có thể kết hợp <strong>yêu cầu dựa trên bảo đảm</strong> với <strong>cẩu thả</strong> và <strong>trách nhiệm nghiêm ngặt</strong> (Bài 1.3). Ngoài kiện tụng tư, bảo vệ người tiêu dùng gồm: <strong>Uỷ ban Thương mại Liên bang (FTC)</strong> xử lý hành vi không lành mạnh hay lừa dối như quảng cáo sai sự thật; <strong>Uỷ ban An toàn Sản phẩm Tiêu dùng (CPSC)</strong> đặt tiêu chuẩn an toàn và ra lệnh thu hồi; <strong>luật "xe chanh" (lemon laws)</strong> của các bang cho ô tô mới bị lỗi; quy định công bố điều kiện tín dụng; và <strong>quy tắc "nguội lại" (cooling-off rule)</strong> của FTC cho phép người mua huỷ một số giao dịch bán hàng tận nhà trong ba ngày làm việc.</p>
<div class="callout"><span class="badge">Đối chiếu Việt Nam</span> Bộ luật Dân sự 2015 buộc bên bán bảo đảm quyền sở hữu đối với tài sản bán và bảo đảm chất lượng vật mua bán, và quy định <strong>nghĩa vụ bảo hành</strong> (đề cương dẫn Điều 446–449): trong thời hạn bảo hành, bên mua có quyền yêu cầu sửa chữa, đổi, trả lại vật và bồi thường thiệt hại. <strong>Luật Bảo vệ quyền lợi người tiêu dùng 2023</strong> (thay luật 2010) quy định nghĩa vụ về thông tin sản phẩm, bảo hành, thu hồi hàng hoá có khuyết tật và trách nhiệm bồi thường thiệt hại do hàng hoá đó gây ra. Kiểm số điều và chi tiết trong văn bản đang có hiệu lực trên vbpl.vn.</div>`,
  ]]);

const u1415 = doc('law102-4-2-stakeholder-orientation', '4.2 — OpenStax Ch 3.1–3.2 · Adopting a stakeholder orientation & weighing claims (Units 14–15)|||4.2 — OpenStax Ch 3.1–3.2 · Định hướng bên liên quan & cân nhắc yêu sách (Unit 14–15)',
  'Bên liên quan là ai (bên trong, bên ngoài; chính, phụ); quan điểm ưu tiên cổ đông và thuyết bên liên quan; mức tối thiểu và tối đa về đạo đức, khế ước xã hội ngầm; vì sao yêu sách có trọng lượng khác nhau; ba cách tiếp cận mô tả, công cụ, chuẩn tắc; phân loại bên liên quan theo liên kết và bốn loại công chúng; đối chiếu Việt Nam.',
  [[
    `<span class="eyebrow">LAW102 · Part 4 · Lesson 4.2</span>
<h2>Adopting a stakeholder orientation &amp; weighing claims</h2>
<p class="lead">Law tells a company what it <em>must</em> do for others. Ethics asks what it <em>should</em> do. Units 14–15 follow OpenStax <em>Business Ethics</em> sections 3.1–3.2: who the stakeholders are, why the firm owes them more than the legal minimum, and how to weigh their competing claims.</p>
<h3>1. Who are stakeholders?</h3>
<p><strong>Stakeholders</strong> are individuals and groups, inside and outside the business, who have an interest in — or are affected by — its operations.</p>
<ul>
<li><strong>Internal:</strong> the board of directors, the CEO and executives, employees.</li>
<li><strong>External:</strong> customers, suppliers, creditors, governments and regulators, communities, the media, NGOs.</li>
<li>Many texts also distinguish <strong>primary</strong> stakeholders (directly tied to the firm's survival — owners, employees, customers, suppliers) from <strong>secondary</strong> ones (influence or are affected indirectly — media, activists, the wider public).</li>
</ul>
<h3>2. Shareholder primacy vs stakeholder orientation</h3>
<table>
<tr><th></th><th>Shareholder primacy</th><th>Stakeholder orientation</th></tr>
<tr><td>Core claim</td><td>Management's responsibility is to increase profits for the owners, within the law and ordinary ethical custom — Milton Friedman's well-known 1970 argument</td><td>The firm should create value for all groups whose support it depends on — associated with R. Edward Freeman's stakeholder theory (1984)</td></tr>
<tr><td>Risk</td><td>Short-termism; harms pushed onto others</td><td>Managers accountable to everyone may be accountable to no one; claims conflict</td></tr>
</table>
<p>Both camps accept that the firm must obey the law; they differ on how far beyond it the firm's duties reach. Business and stakeholders are <strong>interdependent</strong>: firms need employees, customers and communities, and those groups need firms. This <strong>implicit social contract</strong> is the moral basis for a stakeholder orientation.</p>
<h3>3. Why law is not enough: ethical minimums and maximums</h3>
<p>Laws are slow, general and minimal. An <strong>ethical minimum</strong> is the least a firm can do while complying with the law; an <strong>ethical maximum</strong> is the strongest ethical action available — e.g. recalling a risky product quickly and transparently before a regulator forces it, and compensating customers generously. Stakeholder welfare must be part of the decision itself, not an afterthought.</p>
<h3>4. Weighing stakeholder claims — three approaches</h3>
<table>
<tr><th>Approach</th><th>Why stakeholders matter</th></tr>
<tr><td><strong>Descriptive</strong></td><td>The firm <em>is</em> a set of groups with different interests that managers actually balance</td></tr>
<tr><td><strong>Instrumental</strong></td><td>Treating stakeholders well pays off — loyalty, trust and lower risk improve financial results</td></tr>
<tr><td><strong>Normative</strong></td><td>Stakeholders are ends in themselves; their interests have value regardless of any payoff</td></tr>
</table>
<p>Claims vary in importance because stakeholders differ in how closely they are linked to the firm and how much the decision affects them. One useful map groups them by <strong>linkage</strong>:</p>
<ul>
<li><strong>Enabling</strong> — provide authority and resources: shareholders, boards, legislatures, regulators.</li>
<li><strong>Functional</strong> — make the business run: employees, unions, suppliers (inputs); customers, distributors, retailers (outputs).</li>
<li><strong>Normative</strong> — share values or problems: competitors, industry peers, professional associations.</li>
<li><strong>Diffused</strong> — become involved when something happens: NGOs, media, voters, the public.</li>
</ul>
<p>Grunig and Hunt add that publics differ in <em>awareness</em> and <em>readiness to act</em>: <strong>non-publics</strong>, <strong>latent publics</strong> (affected but unaware), <strong>aware publics</strong> and <strong>active publics</strong> (organised to act). A latent public — e.g. residents who do not yet know about a pollution risk — can become an active one overnight.</p>
<div class="callout"><span class="badge">Vietnam counterpart / Đối chiếu Việt Nam</span> Several Vietnamese laws give stakeholders a formal voice: the Law on Enterprises 2020 (shareholder rights), the Labour Code 2019 (employee representative organisations and workplace dialogue), the Law on Environmental Protection 2020 (community consultation for projects) and the Law on Protection of Consumers' Rights 2023. As in the US, these set the legal minimum; the ethical maximum is the firm's choice. Check the current texts on vbpl.vn.</div>`,
    `<span class="eyebrow">LAW102 · Phần 4 · Bài 4.2</span>
<h2>Định hướng bên liên quan &amp; cân nhắc yêu sách</h2>
<p class="lead">Luật cho doanh nghiệp biết điều <em>phải</em> làm cho người khác. Đạo đức hỏi điều <em>nên</em> làm. Unit 14–15 theo OpenStax <em>Business Ethics</em> mục 3.1–3.2: bên liên quan là ai, vì sao doanh nghiệp nợ họ nhiều hơn mức tối thiểu của luật, và cân nhắc các yêu sách cạnh tranh nhau thế nào.</p>
<h3>1. Bên liên quan là ai?</h3>
<p><strong>Bên liên quan (stakeholder)</strong> là cá nhân và nhóm, bên trong và bên ngoài doanh nghiệp, có lợi ích gắn với — hoặc bị ảnh hưởng bởi — hoạt động của doanh nghiệp.</p>
<ul>
<li><strong>Bên trong:</strong> hội đồng quản trị, CEO và ban điều hành, người lao động.</li>
<li><strong>Bên ngoài:</strong> khách hàng, nhà cung cấp, chủ nợ, chính phủ và cơ quan quản lý, cộng đồng, báo chí, tổ chức phi chính phủ.</li>
<li>Nhiều sách còn phân biệt bên liên quan <strong>chính</strong> (gắn trực tiếp với sự tồn tại của doanh nghiệp — chủ sở hữu, người lao động, khách hàng, nhà cung cấp) và <strong>phụ</strong> (ảnh hưởng hay bị ảnh hưởng gián tiếp — báo chí, nhà hoạt động, công chúng).</li>
</ul>
<h3>2. Ưu tiên cổ đông và định hướng bên liên quan</h3>
<table>
<tr><th></th><th>Ưu tiên cổ đông</th><th>Định hướng bên liên quan</th></tr>
<tr><td>Luận điểm cốt lõi</td><td>Trách nhiệm của nhà quản lý là tăng lợi nhuận cho chủ sở hữu, trong khuôn khổ luật và tập quán đạo đức thông thường — lập luận nổi tiếng năm 1970 của Milton Friedman</td><td>Doanh nghiệp nên tạo giá trị cho mọi nhóm mà nó cần sự ủng hộ — gắn với thuyết bên liên quan của R. Edward Freeman (1984)</td></tr>
<tr><td>Rủi ro</td><td>Chạy theo ngắn hạn; đẩy tác hại sang người khác</td><td>Nhà quản lý chịu trách nhiệm trước tất cả có thể thành không chịu trách nhiệm trước ai; các yêu sách xung đột</td></tr>
</table>
<p>Cả hai phía đều chấp nhận doanh nghiệp phải tuân thủ luật; họ khác nhau ở chỗ nghĩa vụ vượt ra ngoài luật tới đâu. Doanh nghiệp và các bên liên quan <strong>phụ thuộc lẫn nhau</strong>: doanh nghiệp cần người lao động, khách hàng, cộng đồng, và các nhóm đó cần doanh nghiệp. <strong>Khế ước xã hội ngầm</strong> này là nền tảng đạo đức của định hướng bên liên quan.</p>
<h3>3. Vì sao luật chưa đủ: mức tối thiểu và mức tối đa về đạo đức</h3>
<p>Luật chậm, chung chung và tối thiểu. <strong>Mức tối thiểu về đạo đức</strong> là điều ít nhất doanh nghiệp làm mà vẫn tuân thủ luật; <strong>mức tối đa về đạo đức</strong> là hành động đạo đức mạnh nhất có thể — vd thu hồi sản phẩm rủi ro nhanh chóng, minh bạch trước khi cơ quan quản lý buộc phải làm, và bồi thường hào phóng cho khách hàng. Phúc lợi của các bên liên quan phải nằm trong chính quyết định, không phải chuyện nghĩ tới sau.</p>
<h3>4. Cân nhắc yêu sách của bên liên quan — ba cách tiếp cận</h3>
<table>
<tr><th>Cách tiếp cận</th><th>Vì sao bên liên quan quan trọng</th></tr>
<tr><td><strong>Mô tả (descriptive)</strong></td><td>Doanh nghiệp <em>là</em> tập hợp các nhóm có lợi ích khác nhau mà nhà quản lý thực tế phải cân bằng</td></tr>
<tr><td><strong>Công cụ (instrumental)</strong></td><td>Đối xử tốt với bên liên quan thì có lợi — lòng trung thành, niềm tin và rủi ro thấp hơn cải thiện kết quả tài chính</td></tr>
<tr><td><strong>Chuẩn tắc (normative)</strong></td><td>Bên liên quan là mục đích tự thân; lợi ích của họ có giá trị bất kể có đem lại lợi nhuận hay không</td></tr>
</table>
<p>Yêu sách có trọng lượng khác nhau vì các bên gắn với doanh nghiệp ở mức độ khác nhau và bị quyết định tác động khác nhau. Một cách lập bản đồ hữu ích nhóm họ theo <strong>liên kết</strong>:</p>
<ul>
<li><strong>Liên kết cho phép (enabling)</strong> — trao thẩm quyền và nguồn lực: cổ đông, hội đồng quản trị, cơ quan lập pháp, cơ quan quản lý.</li>
<li><strong>Liên kết chức năng (functional)</strong> — làm doanh nghiệp vận hành: người lao động, công đoàn, nhà cung cấp (đầu vào); khách hàng, nhà phân phối, nhà bán lẻ (đầu ra).</li>
<li><strong>Liên kết chuẩn mực (normative)</strong> — chia sẻ giá trị hay vấn đề: đối thủ cạnh tranh, doanh nghiệp cùng ngành, hiệp hội nghề nghiệp.</li>
<li><strong>Liên kết lan toả (diffused)</strong> — tham gia khi có chuyện xảy ra: tổ chức phi chính phủ, báo chí, cử tri, công chúng.</li>
</ul>
<p>Grunig và Hunt bổ sung rằng các nhóm công chúng khác nhau về <em>mức nhận biết</em> và <em>mức sẵn sàng hành động</em>: <strong>phi công chúng</strong>, <strong>công chúng tiềm ẩn</strong> (bị ảnh hưởng nhưng chưa biết), <strong>công chúng nhận biết</strong> và <strong>công chúng hành động</strong> (đã tổ chức để hành động). Một nhóm tiềm ẩn — vd cư dân chưa biết về một nguy cơ ô nhiễm — có thể trở thành nhóm hành động chỉ sau một đêm.</p>
<div class="callout"><span class="badge">Đối chiếu Việt Nam</span> Nhiều luật Việt Nam trao cho các bên liên quan tiếng nói chính thức: Luật Doanh nghiệp 2020 (quyền cổ đông), Bộ luật Lao động 2019 (tổ chức đại diện người lao động và đối thoại tại nơi làm việc), Luật Bảo vệ môi trường 2020 (tham vấn cộng đồng cho dự án) và Luật Bảo vệ quyền lợi người tiêu dùng 2023. Như ở Mỹ, các luật này đặt ra mức tối thiểu; mức tối đa về đạo đức là lựa chọn của doanh nghiệp. Kiểm văn bản đang có hiệu lực trên vbpl.vn.</div>`,
  ]]);

const u16 = doc('law102-4-3-prioritizing-corruption', '4.3 — OpenStax Ch 3.3 · Ethical decision-making, prioritizing stakeholders & corruption (Unit 16)|||4.3 — OpenStax Ch 3.3 · Ra quyết định đạo đức, ưu tiên bên liên quan & tham nhũng (Unit 16)',
  'Quy trình quản lý bên liên quan; ma trận quyền lực – mối quan tâm; mô hình mức độ nổi bật (quyền lực, tính chính đáng, tính cấp bách); các bước ra quyết định đạo đức; tham nhũng: định nghĩa, hình thức, nguyên nhân, hậu quả; FCPA và công ước UNCAC; đối chiếu pháp luật phòng, chống tham nhũng Việt Nam.',
  [[
    `<span class="eyebrow">LAW102 · Part 4 · Lesson 4.3</span>
<h2>Ethical decision-making, prioritizing stakeholders &amp; corruption</h2>
<p class="lead">No firm can satisfy every stakeholder at once. Unit 16 (OpenStax section 3.3) is about deciding whose claims come first — and about corruption, the clearest case of a "claim" that should never be honoured.</p>
<h3>1. The stakeholder management process</h3>
<ol>
<li><strong>Identify</strong> stakeholders and their expectations — through surveys, focus groups, customer and product-use data, social-media monitoring, meetings with communities and regulators.</li>
<li><strong>Assess</strong> their interest in the decision and their power to affect it.</li>
<li><strong>Prioritise</strong> claims that conflict, using ethical reasoning, not only power.</li>
<li><strong>Engage and communicate</strong> — show stakeholders how their concerns were considered, even when the answer is no.</li>
<li><strong>Monitor</strong> and update, because priorities change as events unfold.</li>
</ol>
<h3>2. Power/interest matrix</h3>
<table>
<tr><th></th><th>Low interest</th><th>High interest</th></tr>
<tr><td><strong>High power</strong></td><td>Keep satisfied — meet their needs</td><td>Manage closely — keep fully engaged</td></tr>
<tr><td><strong>Low power</strong></td><td>Monitor with minimal effort</td><td>Keep informed — respect their interests</td></tr>
</table>
<h3>3. Salience: power, legitimacy, urgency</h3>
<p>A widely used complementary model (Mitchell, Agle and Wood, 1997) asks three questions: does the stakeholder have <strong>power</strong> to influence the firm, a <strong>legitimate</strong> claim (legal, moral or contractual), and <strong>urgency</strong> (time-sensitive and critical)? A stakeholder with all three is <em>definitive</em> and gets top priority. One with power and urgency but no legitimacy is <em>dangerous</em> — an official demanding a bribe is an example; one with legitimacy and urgency but little power is <em>dependent</em> — often the people most exposed to harm, whose claims ethics says must not be ignored just because they are weak.</p>
<h3>4. Steps for an ethical decision</h3>
<ol>
<li>Establish the <strong>facts</strong> and the legal requirements.</li>
<li>Identify the <strong>stakeholders</strong> and what each stands to gain or lose.</li>
<li>List realistic <strong>options</strong>, including creative ones.</li>
<li>Test each option with several <strong>frameworks</strong> — consequences, duties and rights, justice, virtue — and the publicity test.</li>
<li><strong>Decide, act and explain</strong>; then review the outcome and learn.</li>
</ol>
<h3>5. Corruption</h3>
<p>A widely cited definition, used by Transparency International, describes corruption as <strong>the abuse of entrusted power for private gain</strong>. It can involve public officials or private-sector employees.</p>
<table>
<tr><th>Forms</th><th>Examples</th></tr>
<tr><td>Bribery</td><td>Offering or accepting money, gifts or favours to influence a decision</td></tr>
<tr><td>Facilitation ("grease") payments</td><td>Small payments to speed up a routine action such as customs clearance</td></tr>
<tr><td>Kickbacks</td><td>A supplier returns part of a contract price to the buyer's employee</td></tr>
<tr><td>Embezzlement, extortion</td><td>Stealing entrusted funds; demanding payment under threat</td></tr>
<tr><td>Nepotism, conflicts of interest</td><td>Awarding jobs or contracts to relatives or one's own company</td></tr>
</table>
<p><strong>Causes</strong> operate at several levels. For individuals, the <em>fraud triangle</em> is a useful lens: <strong>pressure</strong> (targets, debts), <strong>opportunity</strong> (weak controls, discretion without oversight) and <strong>rationalisation</strong> ("everyone does it", "it's just a fee"). Organisations add pressure through unrealistic targets and a culture that rewards results at any cost; institutions add complex procedures, broad discretion, low transparency and weak enforcement. <strong>Consequences:</strong> for the firm — criminal fines, prosecution of individuals, debarment from contracts, lost reputation, and an extortion cycle that raises costs; for society — distorted competition, wasted public money, unsafe products and buildings that passed "inspection", and lower trust and investment.</p>
<p><strong>US law:</strong> the <strong>Foreign Corrupt Practices Act (FCPA, 1977)</strong> prohibits paying or offering anything of value to a foreign official to obtain or retain business. It applies to companies with US-listed securities, US persons and businesses, and others acting within US territory; its accounting provisions require listed companies to keep accurate books and adequate internal controls. It contains only a narrow exception for facilitating payments for routine governmental actions — and such payments are often illegal under local law anyway. Internationally, the <strong>UN Convention against Corruption (UNCAC)</strong> sets common standards.</p>
<div class="callout"><span class="badge">Vietnam counterpart / Đối chiếu Việt Nam</span> Vietnam is a party to UNCAC. The Law on Anti-Corruption (2018 version) covers the public sector and extends certain measures to enterprises and organisations in the non-state sector; the Criminal Code penalises giving, receiving and brokering bribes, including certain conduct in the private sector. Check the current texts and scope on vbpl.vn.</div>`,
    `<span class="eyebrow">LAW102 · Phần 4 · Bài 4.3</span>
<h2>Ra quyết định đạo đức, ưu tiên bên liên quan &amp; tham nhũng</h2>
<p class="lead">Không doanh nghiệp nào làm hài lòng mọi bên liên quan cùng lúc. Unit 16 (OpenStax mục 3.3) bàn về việc quyết định yêu sách của ai được ưu tiên — và về tham nhũng, trường hợp rõ nhất của một "yêu sách" không bao giờ nên đáp ứng.</p>
<h3>1. Quy trình quản lý bên liên quan</h3>
<ol>
<li><strong>Nhận diện</strong> các bên liên quan và kỳ vọng của họ — qua khảo sát, nhóm tập trung, dữ liệu khách hàng và dữ liệu sử dụng sản phẩm, theo dõi mạng xã hội, gặp gỡ cộng đồng và cơ quan quản lý.</li>
<li><strong>Đánh giá</strong> mức quan tâm của họ tới quyết định và quyền lực để tác động tới nó.</li>
<li><strong>Ưu tiên</strong> các yêu sách xung đột bằng lập luận đạo đức, không chỉ bằng quyền lực.</li>
<li><strong>Gắn kết và truyền thông</strong> — cho các bên thấy mối quan tâm của họ đã được xem xét thế nào, kể cả khi câu trả lời là không.</li>
<li><strong>Theo dõi</strong> và cập nhật, vì thứ tự ưu tiên thay đổi khi sự việc diễn biến.</li>
</ol>
<h3>2. Ma trận quyền lực – mối quan tâm</h3>
<table>
<tr><th></th><th>Quan tâm thấp</th><th>Quan tâm cao</th></tr>
<tr><td><strong>Quyền lực cao</strong></td><td>Giữ hài lòng — đáp ứng nhu cầu của họ</td><td>Quản lý chặt — gắn kết đầy đủ</td></tr>
<tr><td><strong>Quyền lực thấp</strong></td><td>Theo dõi ở mức tối thiểu</td><td>Thông tin đầy đủ — tôn trọng lợi ích của họ</td></tr>
</table>
<h3>3. Mức độ nổi bật: quyền lực, tính chính đáng, tính cấp bách</h3>
<p>Một mô hình bổ trợ được dùng rộng rãi (Mitchell, Agle và Wood, 1997) đặt ba câu hỏi: bên liên quan có <strong>quyền lực</strong> tác động tới doanh nghiệp không, có yêu sách <strong>chính đáng</strong> (về pháp lý, đạo đức hay hợp đồng) không, và có tính <strong>cấp bách</strong> (gấp về thời gian và hệ trọng) không? Bên có đủ cả ba là bên <em>quyết định (definitive)</em> và được ưu tiên cao nhất. Bên có quyền lực và cấp bách nhưng không chính đáng là bên <em>nguy hiểm (dangerous)</em> — một quan chức đòi hối lộ là ví dụ; bên chính đáng và cấp bách nhưng ít quyền lực là bên <em>phụ thuộc (dependent)</em> — thường là những người dễ bị tổn hại nhất, mà đạo đức đòi hỏi không được bỏ qua chỉ vì họ yếu thế.</p>
<h3>4. Các bước ra một quyết định đạo đức</h3>
<ol>
<li>Xác lập <strong>sự kiện</strong> và yêu cầu pháp lý.</li>
<li>Nhận diện các <strong>bên liên quan</strong> và mỗi bên được hay mất gì.</li>
<li>Liệt kê các <strong>phương án</strong> khả thi, kể cả phương án sáng tạo.</li>
<li>Kiểm mỗi phương án bằng nhiều <strong>khung</strong> — hệ quả, nghĩa vụ và quyền, công bằng, đức hạnh — cùng phép thử công khai.</li>
<li><strong>Quyết định, hành động và giải thích</strong>; sau đó xem lại kết quả và rút kinh nghiệm.</li>
</ol>
<h3>5. Tham nhũng</h3>
<p>Một định nghĩa được trích dẫn rộng rãi, do Tổ chức Minh bạch Quốc tế (Transparency International) sử dụng, mô tả tham nhũng là <strong>lạm dụng quyền lực được giao để trục lợi riêng</strong>. Tham nhũng có thể liên quan tới công chức hoặc nhân viên khu vực tư.</p>
<table>
<tr><th>Hình thức</th><th>Ví dụ</th></tr>
<tr><td>Hối lộ</td><td>Đưa hoặc nhận tiền, quà, ân huệ để tác động tới một quyết định</td></tr>
<tr><td>Khoản "bôi trơn" (facilitation payment)</td><td>Khoản tiền nhỏ để đẩy nhanh một thủ tục thông thường như thông quan</td></tr>
<tr><td>Lại quả (kickback)</td><td>Nhà cung cấp trả lại một phần giá hợp đồng cho nhân viên bên mua</td></tr>
<tr><td>Tham ô, tống tiền</td><td>Chiếm đoạt tiền được giao quản lý; đòi tiền kèm đe doạ</td></tr>
<tr><td>Thiên vị người thân, xung đột lợi ích</td><td>Giao việc hay hợp đồng cho người nhà hoặc công ty của chính mình</td></tr>
</table>
<p><strong>Nguyên nhân</strong> nằm ở nhiều cấp. Với cá nhân, <em>tam giác gian lận</em> là lăng kính hữu ích: <strong>áp lực</strong> (chỉ tiêu, nợ nần), <strong>cơ hội</strong> (kiểm soát yếu, quyền tuỳ nghi không bị giám sát) và <strong>tự biện minh</strong> ("ai cũng làm", "chỉ là phí thôi"). Tổ chức thêm áp lực qua chỉ tiêu phi thực tế và văn hoá thưởng kết quả bằng mọi giá; thể chế thêm thủ tục phức tạp, quyền tuỳ nghi rộng, thiếu minh bạch và thực thi yếu. <strong>Hậu quả:</strong> với doanh nghiệp — phạt hình sự, truy tố cá nhân, bị cấm tham gia hợp đồng, mất uy tín, và vòng xoáy bị vòi vĩnh làm chi phí tăng; với xã hội — cạnh tranh méo mó, lãng phí tiền công, sản phẩm và công trình không an toàn mà vẫn "qua kiểm tra", niềm tin và đầu tư giảm sút.</p>
<p><strong>Luật Mỹ:</strong> <strong>Đạo luật Chống tham nhũng ở nước ngoài (FCPA, 1977)</strong> cấm trả hoặc hứa trả bất cứ thứ gì có giá trị cho công chức nước ngoài để có được hay giữ được việc kinh doanh. Luật áp dụng với công ty có chứng khoán niêm yết ở Mỹ, cá nhân và doanh nghiệp Mỹ, và người khác hành động trên lãnh thổ Mỹ; các điều khoản kế toán buộc công ty niêm yết giữ sổ sách chính xác và có kiểm soát nội bộ đầy đủ. Luật chỉ có ngoại lệ hẹp cho khoản "bôi trơn" nhằm thúc đẩy thủ tục hành chính thông thường — và các khoản đó dù sao cũng thường bất hợp pháp theo luật sở tại. Ở cấp quốc tế, <strong>Công ước Liên hợp quốc về chống tham nhũng (UNCAC)</strong> đặt ra chuẩn mực chung.</p>
<div class="callout"><span class="badge">Đối chiếu Việt Nam</span> Việt Nam là thành viên UNCAC. Luật Phòng, chống tham nhũng (bản 2018) điều chỉnh khu vực nhà nước và mở rộng một số biện pháp tới doanh nghiệp, tổ chức khu vực ngoài nhà nước; Bộ luật Hình sự xử lý tội đưa hối lộ, nhận hối lộ, môi giới hối lộ, kể cả một số hành vi trong khu vực tư. Kiểm văn bản và phạm vi áp dụng đang có hiệu lực trên vbpl.vn.</div>`,
  ]]);

const u17 = doc('law102-4-4-csr', '4.4 — OpenStax Ch 3.4 · Corporate social responsibility (Unit 17)|||4.4 — OpenStax Ch 3.4 · Trách nhiệm xã hội của doanh nghiệp (Unit 17)',
  'CSR là gì; kim tự tháp Carroll với bốn trách nhiệm kinh tế, pháp lý, đạo đức, từ thiện; ba trụ cột TBL; CSR thật và CSR làm quan hệ công chúng (tẩy xanh); lợi ích và giới hạn của CSR; trách nhiệm của doanh nghiệp trong phòng, chống tham nhũng và các yếu tố của chương trình tuân thủ; đối chiếu Việt Nam.',
  [[
    `<span class="eyebrow">LAW102 · Part 4 · Lesson 4.4</span>
<h2>Corporate social responsibility</h2>
<p class="lead"><strong>Corporate social responsibility (CSR)</strong> is the idea that a business should run in a way that benefits society as well as its owners: reliable products, fair prices and wages, care for the environment and attention to social concerns. Unit 17 follows OpenStax section 3.4.</p>
<h3>1. Carroll's pyramid of CSR</h3>
<p>Archie Carroll's widely taught model (1991) divides CSR into four layers. A responsible firm meets all four at the same time — the lower layers are not an excuse for ignoring the higher ones.</p>
<table>
<tr><th>Layer</th><th>Responsibility</th><th>In one phrase</th></tr>
<tr><td>4 (top) Philanthropic</td><td>Contribute resources to the community, improve quality of life</td><td>Be a good corporate citizen — <em>desired</em></td></tr>
<tr><td>3 Ethical</td><td>Do what is right, just and fair even when the law does not require it; avoid harm</td><td>Be ethical — <em>expected</em></td></tr>
<tr><td>2 Legal</td><td>Obey the law — society's codification of right and wrong</td><td>Obey the law — <em>required</em></td></tr>
<tr><td>1 (base) Economic</td><td>Produce goods and services people want, at a profit; the foundation for everything else</td><td>Be profitable — <em>required</em></td></tr>
</table>
<h3>2. The triple bottom line</h3>
<p>The <strong>triple bottom line (TBL)</strong>, a term coined by John Elkington in 1994, asks firms to measure performance on three lines, not one: <strong>people</strong> (social impact on employees, communities, customers), <strong>planet</strong> (environmental impact) and <strong>profit</strong> (economic results). Sustainability means operating in a way that preserves resources for the long term.</p>
<h3>3. Sincere CSR vs CSR as public relations</h3>
<p>CSR can be a genuine business philosophy or a marketing layer. <strong>Greenwashing</strong> — publicising small green or social initiatives while the core business keeps causing harm — creates the look of responsibility without systemic change. Tests of sincerity: Is the commitment embedded in core operations and incentives? Is it measured and independently reported? Would the firm keep it when it costs money?</p>
<h3>4. Benefits of CSR — and limits</h3>
<ul>
<li><strong>Reputation and trust</strong> — a buffer when things go wrong.</li>
<li><strong>Customer loyalty</strong> and willingness to buy from a trusted brand.</li>
<li><strong>Attracting and keeping employees</strong> who want meaningful work.</li>
<li><strong>Risk management and licence to operate</strong> — fewer conflicts with regulators and communities.</li>
<li><strong>Access to capital</strong> from investors who screen for environmental, social and governance (ESG) risks.</li>
<li><strong>Efficiency and innovation</strong> — e.g. cutting energy and waste lowers costs.</li>
</ul>
<p>These benefits are not automatic; CSR has costs, and claims made for PR purposes can backfire. The strongest case is the "ultimate stakeholder benefit": authentic CSR builds a business model that works for all the interdependent groups it relies on.</p>
<h3>5. Corporate responsibility in fighting corruption</h3>
<p>Refusing to bribe is the legal minimum; an ethical firm builds a system that makes corruption hard. Common elements of an anti-corruption compliance program:</p>
<ol>
<li><strong>Tone at the top</strong> — leaders state and model zero tolerance, including for facilitation payments.</li>
<li>A clear <strong>code of conduct</strong> with rules on gifts, hospitality, donations and conflicts of interest.</li>
<li><strong>Risk assessment</strong> and <strong>due diligence on third parties</strong> — agents, customs brokers and distributors, because a bribe paid through an intermediary is still a bribe.</li>
<li><strong>Financial controls</strong> — accurate books, no off-the-books cash, approvals for unusual payments.</li>
<li><strong>Training</strong> for staff in high-risk roles, and a plan for handling solicitations.</li>
<li><strong>Whistle-blowing channels</strong> with protection against retaliation, followed by investigation and discipline.</li>
<li><strong>Monitoring and review</strong>, and <strong>collective action</strong> with peers and associations to change industry norms. Principle 10 of the UN Global Compact states that businesses should work against corruption in all its forms, including extortion and bribery.</li>
</ol>
<div class="callout"><span class="badge">Vietnam counterpart / Đối chiếu Việt Nam</span> The Law on Anti-Corruption (2018 version) encourages enterprises in the non-state sector to build a business culture free of corruption, adopt codes of conduct and internal control mechanisms, and imposes specific duties on certain types of organisations. Environmental duties are set by the Law on Environmental Protection 2020. Check the exact obligations and the types of enterprise covered in the current texts on vbpl.vn.</div>`,
    `<span class="eyebrow">LAW102 · Phần 4 · Bài 4.4</span>
<h2>Trách nhiệm xã hội của doanh nghiệp</h2>
<p class="lead"><strong>Trách nhiệm xã hội của doanh nghiệp (CSR)</strong> là quan niệm rằng doanh nghiệp nên vận hành sao cho có lợi cho xã hội cũng như cho chủ sở hữu: sản phẩm tin cậy, giá và lương công bằng, quan tâm tới môi trường và các vấn đề xã hội. Unit 17 theo OpenStax mục 3.4.</p>
<h3>1. Kim tự tháp CSR của Carroll</h3>
<p>Mô hình được giảng dạy rộng rãi của Archie Carroll (1991) chia CSR thành bốn tầng. Doanh nghiệp có trách nhiệm đáp ứng cả bốn cùng lúc — tầng dưới không phải cái cớ để bỏ qua tầng trên.</p>
<table>
<tr><th>Tầng</th><th>Trách nhiệm</th><th>Một cụm từ</th></tr>
<tr><td>4 (đỉnh) Từ thiện</td><td>Đóng góp nguồn lực cho cộng đồng, nâng cao chất lượng sống</td><td>Là công dân doanh nghiệp tốt — <em>được mong muốn</em></td></tr>
<tr><td>3 Đạo đức</td><td>Làm điều đúng, công bằng kể cả khi luật không đòi hỏi; tránh gây hại</td><td>Có đạo đức — <em>được kỳ vọng</em></td></tr>
<tr><td>2 Pháp lý</td><td>Tuân thủ luật — sự luật hoá quan niệm đúng sai của xã hội</td><td>Tuân thủ luật — <em>bắt buộc</em></td></tr>
<tr><td>1 (đáy) Kinh tế</td><td>Sản xuất hàng hoá, dịch vụ mà xã hội cần, có lợi nhuận; nền móng cho mọi thứ khác</td><td>Có lợi nhuận — <em>bắt buộc</em></td></tr>
</table>
<h3>2. Ba trụ cột (triple bottom line)</h3>
<p><strong>Triple bottom line (TBL)</strong>, thuật ngữ do John Elkington đặt ra năm 1994, yêu cầu doanh nghiệp đo kết quả trên ba "dòng cuối" thay vì một: <strong>con người</strong> (tác động xã hội tới người lao động, cộng đồng, khách hàng), <strong>hành tinh</strong> (tác động môi trường) và <strong>lợi nhuận</strong> (kết quả kinh tế). Phát triển bền vững nghĩa là vận hành sao cho giữ gìn nguồn lực về lâu dài.</p>
<h3>3. CSR thật và CSR làm quan hệ công chúng</h3>
<p>CSR có thể là một triết lý kinh doanh thật hoặc chỉ là một lớp tiếp thị. <strong>Tẩy xanh (greenwashing)</strong> — quảng bá vài sáng kiến xanh hay xã hội nhỏ trong khi hoạt động cốt lõi vẫn gây hại — tạo vẻ ngoài có trách nhiệm mà không có thay đổi hệ thống. Phép thử độ thật: cam kết có gắn vào hoạt động cốt lõi và cơ chế thưởng không? Có được đo và báo cáo độc lập không? Doanh nghiệp có giữ cam kết khi nó tốn tiền không?</p>
<h3>4. Lợi ích của CSR — và giới hạn</h3>
<ul>
<li><strong>Uy tín và niềm tin</strong> — tấm đệm khi có sự cố.</li>
<li><strong>Lòng trung thành của khách hàng</strong> và sự sẵn lòng mua từ thương hiệu đáng tin.</li>
<li><strong>Thu hút và giữ chân người lao động</strong> muốn làm việc có ý nghĩa.</li>
<li><strong>Quản trị rủi ro và "giấy phép xã hội" để hoạt động</strong> — ít xung đột với cơ quan quản lý và cộng đồng.</li>
<li><strong>Tiếp cận vốn</strong> từ nhà đầu tư sàng lọc theo rủi ro môi trường, xã hội và quản trị (ESG).</li>
<li><strong>Hiệu quả và đổi mới</strong> — vd giảm năng lượng và chất thải làm giảm chi phí.</li>
</ul>
<p>Các lợi ích này không tự động có; CSR tốn chi phí, và tuyên bố chỉ để làm PR có thể phản tác dụng. Lập luận mạnh nhất là "lợi ích tối hậu cho các bên liên quan": CSR thật xây dựng một mô hình kinh doanh có lợi cho mọi nhóm phụ thuộc lẫn nhau mà doanh nghiệp dựa vào.</p>
<h3>5. Trách nhiệm của doanh nghiệp trong phòng, chống tham nhũng</h3>
<p>Không đưa hối lộ là mức tối thiểu của luật; doanh nghiệp có đạo đức xây dựng một hệ thống khiến tham nhũng khó xảy ra. Các yếu tố thường gặp của chương trình tuân thủ chống tham nhũng:</p>
<ol>
<li><strong>Làm gương từ lãnh đạo</strong> — lãnh đạo tuyên bố và thực hành không khoan nhượng, kể cả với khoản "bôi trơn".</li>
<li><strong>Bộ quy tắc ứng xử</strong> rõ ràng, có quy định về quà tặng, tiếp khách, tài trợ và xung đột lợi ích.</li>
<li><strong>Đánh giá rủi ro</strong> và <strong>thẩm định bên thứ ba</strong> — đại lý, người làm thủ tục hải quan, nhà phân phối, vì hối lộ qua trung gian vẫn là hối lộ.</li>
<li><strong>Kiểm soát tài chính</strong> — sổ sách chính xác, không có tiền mặt ngoài sổ, phê duyệt các khoản chi bất thường.</li>
<li><strong>Đào tạo</strong> cho nhân viên ở vị trí rủi ro cao, và kịch bản xử lý khi bị vòi vĩnh.</li>
<li><strong>Kênh tố giác</strong> có bảo vệ khỏi trả đũa, kèm điều tra và kỷ luật.</li>
<li><strong>Giám sát và rà soát</strong>, cùng <strong>hành động tập thể</strong> với doanh nghiệp cùng ngành và hiệp hội để thay đổi thói quen của cả ngành. Nguyên tắc 10 của Hiệp ước Toàn cầu Liên hợp quốc (UN Global Compact) nêu doanh nghiệp cần chống tham nhũng dưới mọi hình thức, kể cả tống tiền và hối lộ.</li>
</ol>
<div class="callout"><span class="badge">Đối chiếu Việt Nam</span> Luật Phòng, chống tham nhũng (bản 2018) khuyến khích doanh nghiệp khu vực ngoài nhà nước xây dựng văn hoá kinh doanh không tham nhũng, ban hành quy tắc ứng xử và cơ chế kiểm soát nội bộ, và đặt nghĩa vụ cụ thể cho một số loại tổ chức. Nghĩa vụ môi trường do Luật Bảo vệ môi trường 2020 quy định. Kiểm nghĩa vụ cụ thể và loại doanh nghiệp thuộc diện áp dụng trong văn bản đang có hiệu lực trên vbpl.vn.</div>`,
  ]]);

const ex3 = doc('law102-4-5-exercise', 'Exercise 3 — the unlabelled allergen and the express fee|||Bài tập 3 — chất gây dị ứng không ghi nhãn và khoản phí nhanh',
  'Bài tập tình huống đạo đức: nhận diện và ưu tiên bên liên quan theo quyền lực, tính chính đáng, tính cấp bách; nhận diện rủi ro pháp lý (trách nhiệm sản phẩm, bảo đảm ngụ ý, hối lộ); phân tích theo chủ nghĩa vị lợi, nghĩa vụ – quyền, công bằng và kim tự tháp Carroll; đề xuất quyết định và biện pháp phòng, chống tham nhũng; kèm lời giải.',
  [[
    `<span class="eyebrow">LAW102 · Part 4 · Exercise</span>
<h2>Exercise 3 — the unlabelled allergen and the express fee</h2>
<div class="callout"><span class="badge">Problem</span> A fictional case with illustrative numbers. Lotus Snacks, a Vietnamese snack maker, must deliver an export order to a US importer by 30 September; the contract charges $15,000 for late delivery. On 20 September the quality team finds that the seasoning supplier changed its recipe in August and added milk powder, so batch L-08 (20,000 packs) carries labels that do not declare milk, a common allergen. 8,000 packs are already on shelves in Vietnam; 12,000 packs are in the warehouse for the US order. A recall of the shelf stock would cost $60,000; relabelling the warehouse stock costs $0.25 per pack and takes five days, so the order would be late. The sales director proposes: relabel the warehouse stock quietly, leave the shelf stock ("no one has complained"), and pay the $2,000 "express fee" a customs officer hinted at — without a receipt — to win back the lost days. (a) Identify the stakeholders and rank them using power, legitimacy and urgency. (b) What legal risks does the proposal create? (c) Analyse the choice with three ethical frameworks and Carroll's pyramid. (d) Recommend a decision. (e) Propose anti-corruption measures.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Stakeholder            Power   Legitimacy  Urgency  Salience type   Priority
    Allergic consumers     low-med high        high     dependent       1 (risk to health)
    Food-safety regulators high    high        high     definitive      1
    US importer            high    high        high     definitive      2
    Retailers in Vietnam   med     high        med      dominant        3
    Shareholders/owners    high    high        med      dominant        3
    QA employees           low     high        med      dependent       4
    Seasoning supplier     low     med         low      discretionary   5 (and a party to claim against)
    Customs officer (demand) med   NONE        high     dangerous       not a claim to balance
    Power/interest grid alone would put consumers in "keep informed"; ethically their
    legitimate, urgent claim to safety ranks first.

(b) Legal risks (general rules):
    - US: food labels must declare major allergens such as milk; an unlabelled
      allergen makes the product defective for inadequate warning -> strict product
      liability for sellers in the chain; also breach of the implied warranty of
      merchantability (goods must be adequately labelled).
    - Vietnam: food-safety, labelling and consumer-protection rules (recall of
      defective goods, liability for damage) -> check current texts.
    - The "fee" without a receipt to an official = bribery under Vietnamese criminal
      law. FCPA reach depends on US links (US listing, US persons, acts in the US),
      but local law applies regardless. False booking of the payment adds a
      books-and-records problem.

(c) Costs (illustrative):
    Quiet plan  = relabel 12,000 x $0.25 + fee   = $3,000 + $2,000          = $5,000
    Honest plan = recall + relabel + late penalty = $60,000 + $3,000 + $15,000 = $78,000
    Short-term difference = $78,000 − $5,000 = $73,000
    - Utilitarian: the $73,000 saving must be set against possible severe, even
      fatal, allergic reactions, lawsuits, criminal exposure and a destroyed brand
      once the concealment surfaces -> the honest plan has the better expected result.
    - Duty/rights (Kant): consumers have a right to know what they eat; a maxim
      "hide safety defects until someone complains" cannot be universalised and
      uses consumers merely as means. A bribe cannot be universalised either.
    - Justice: the quiet plan puts the risk on the most vulnerable (allergic people,
      often children) and the savings on the firm -> unfair distribution.
    - Carroll: economic cost is real, but the plan fails the legal and ethical layers;
      profit cannot be bought by breaking the layers above it.

(d) Decision: stop sales of L-08; voluntary recall of the 8,000 shelf packs with a
    clear public notice; inform regulators; relabel the 12,000 packs ($3,000); tell
    the importer at once, explain, and ask for a short extension (if refused, accept
    the $15,000 penalty); refuse the fee and use only official, receipted procedures;
    claim recall costs from the supplier, whose unannounced recipe change is a
    likely breach of its supply contract.

(e) Anti-corruption: zero tolerance including facilitation payments; written script
    for refusing and reporting solicitations; no cash without receipts; due diligence
    on customs brokers; training for logistics staff; whistle-blowing channel with
    non-retaliation; record the incident and review customs routines; join industry
    collective action. (A payment under an immediate threat to personal safety is
    treated differently by most codes, but must be recorded and reported.)</code></pre>
<p><strong>Why:</strong> the quiet plan looks cheap only because it counts the firm's costs and ignores everyone else's. Once the stakeholders with legitimate and urgent claims are put first, and the hidden legal and reputational costs are counted, the recall is both the ethical and the prudent decision. The customs officer's demand shows why power alone cannot decide priority: a stakeholder can be powerful and urgent without having any legitimate claim at all.</p>`,
    `<span class="eyebrow">LAW102 · Phần 4 · Bài tập</span>
<h2>Bài tập 3 — chất gây dị ứng không ghi nhãn và khoản phí nhanh</h2>
<div class="callout"><span class="badge">Đề</span> Tình huống giả định, số liệu minh hoạ. Lotus Snacks, một nhà sản xuất đồ ăn vặt Việt Nam, phải giao một đơn hàng xuất khẩu cho nhà nhập khẩu Mỹ trước 30/9; hợp đồng phạt 15.000 $ nếu giao chậm. Ngày 20/9 bộ phận chất lượng phát hiện nhà cung cấp gia vị đã đổi công thức từ tháng 8 và thêm sữa bột, nên lô L-08 (20.000 gói) có nhãn không ghi sữa, một chất gây dị ứng phổ biến. 8.000 gói đã lên kệ ở Việt Nam; 12.000 gói còn trong kho chờ đơn hàng Mỹ. Thu hồi hàng trên kệ tốn 60.000 $; dán lại nhãn cho hàng trong kho tốn 0,25 $ mỗi gói và mất năm ngày, nên đơn hàng sẽ bị chậm. Giám đốc kinh doanh đề xuất: lặng lẽ dán lại nhãn hàng trong kho, để nguyên hàng trên kệ ("chưa ai phàn nàn"), và trả khoản "phí nhanh" 2.000 $ mà một cán bộ hải quan gợi ý — không có hoá đơn — để lấy lại số ngày bị mất. (a) Nhận diện các bên liên quan và xếp hạng theo quyền lực, tính chính đáng và tính cấp bách. (b) Đề xuất đó tạo ra những rủi ro pháp lý nào? (c) Phân tích lựa chọn bằng ba khung đạo đức và kim tự tháp Carroll. (d) Đề xuất quyết định. (e) Đề xuất biện pháp phòng, chống tham nhũng.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Bên liên quan          Quyền lực  Chính đáng  Cấp bách  Loại            Ưu tiên
    Người tiêu dùng dị ứng thấp-vừa   cao         cao       phụ thuộc       1 (rủi ro sức khoẻ)
    Cơ quan an toàn thực phẩm cao     cao         cao       quyết định      1
    Nhà nhập khẩu Mỹ       cao        cao         cao       quyết định      2
    Nhà bán lẻ Việt Nam    vừa        cao         vừa       thống trị       3
    Cổ đông/chủ sở hữu     cao        cao         vừa       thống trị       3
    Nhân viên chất lượng   thấp       cao         vừa       phụ thuộc       4
    Nhà cung cấp gia vị    thấp       vừa         thấp      tuỳ nghi        5 (và là bên bị đòi bồi hoàn)
    Cán bộ hải quan (đòi tiền) vừa    KHÔNG       cao       nguy hiểm       không phải yêu sách để cân bằng
    Chỉ dùng ma trận quyền lực – quan tâm thì người tiêu dùng rơi vào ô "thông tin đầy đủ";
    về đạo đức, yêu sách chính đáng và cấp bách về an toàn của họ đứng đầu.

(b) Rủi ro pháp lý (quy tắc chung):
    - Mỹ: nhãn thực phẩm phải ghi các chất gây dị ứng chính như sữa; thiếu thông tin
      này làm sản phẩm khuyết tật do thiếu cảnh báo -> trách nhiệm sản phẩm nghiêm ngặt
      cho người bán trong chuỗi; đồng thời vi phạm bảo đảm ngụ ý về khả năng bán được
      (hàng phải được ghi nhãn đầy đủ).
    - Việt Nam: quy định về an toàn thực phẩm, nhãn hàng hoá và bảo vệ người tiêu dùng
      (thu hồi hàng khuyết tật, bồi thường thiệt hại) -> kiểm văn bản hiện hành.
    - "Phí" không hoá đơn cho cán bộ = hối lộ theo luật hình sự Việt Nam. FCPA có với tới
      hay không tuỳ mối liên hệ với Mỹ (niêm yết ở Mỹ, chủ thể Mỹ, hành vi trên đất Mỹ),
      nhưng luật sở tại luôn áp dụng. Hạch toán sai khoản chi còn thêm vấn đề sổ sách.

(c) Chi phí (minh hoạ):
    Phương án lặng lẽ = dán nhãn 12.000 x 0,25 $ + phí = 3.000 $ + 2.000 $                = 5.000 $
    Phương án trung thực = thu hồi + dán nhãn + phạt chậm = 60.000 $ + 3.000 $ + 15.000 $ = 78.000 $
    Chênh lệch ngắn hạn = 78.000 $ − 5.000 $ = 73.000 $
    - Vị lợi: khoản tiết kiệm 73.000 $ phải đặt cạnh nguy cơ phản ứng dị ứng nặng, thậm
      chí tử vong, kiện tụng, rủi ro hình sự và thương hiệu sụp đổ khi việc che giấu lộ ra
      -> phương án trung thực có kết quả kỳ vọng tốt hơn.
    - Nghĩa vụ/quyền (Kant): người tiêu dùng có quyền biết mình ăn gì; châm ngôn "giấu
      khuyết tật an toàn cho tới khi có người phàn nàn" không thể phổ quát hoá và coi
      người tiêu dùng chỉ là phương tiện. Hối lộ cũng không thể phổ quát hoá.
    - Công bằng: phương án lặng lẽ đặt rủi ro lên người yếu thế nhất (người bị dị ứng,
      thường là trẻ em) còn khoản tiết kiệm về tay doanh nghiệp -> phân phối bất công.
    - Carroll: chi phí kinh tế là có thật, nhưng phương án thất bại ở tầng pháp lý và đạo
      đức; không thể mua lợi nhuận bằng cách phá vỡ các tầng phía trên.

(d) Quyết định: ngừng bán lô L-08; tự nguyện thu hồi 8.000 gói trên kệ kèm thông báo công
    khai rõ ràng; báo cơ quan quản lý; dán lại nhãn 12.000 gói (3.000 $); báo ngay cho nhà
    nhập khẩu, giải thích và xin gia hạn ngắn (nếu bị từ chối thì chấp nhận phạt 15.000 $);
    từ chối khoản phí và chỉ dùng thủ tục chính thức có hoá đơn; đòi nhà cung cấp bồi hoàn
    chi phí thu hồi, vì việc tự ý đổi công thức nhiều khả năng vi phạm hợp đồng cung ứng.

(e) Chống tham nhũng: không khoan nhượng kể cả khoản "bôi trơn"; kịch bản bằng văn bản để
    từ chối và báo cáo khi bị vòi vĩnh; không chi tiền mặt không hoá đơn; thẩm định người
    làm thủ tục hải quan; đào tạo nhân viên logistics; kênh tố giác có bảo vệ khỏi trả đũa;
    ghi nhận sự việc và rà soát quy trình hải quan; tham gia hành động tập thể trong ngành.
    (Khoản chi khi bị đe doạ trực tiếp tới an toàn thân thể được đa số bộ quy tắc xử lý
    khác, nhưng phải được ghi nhận và báo cáo.)</code></pre>
<p><strong>Vì sao:</strong> phương án lặng lẽ trông rẻ chỉ vì nó tính chi phí của doanh nghiệp và bỏ qua chi phí của mọi người khác. Khi đặt các bên có yêu sách chính đáng và cấp bách lên trước, và tính cả chi phí pháp lý, uy tín đang ẩn, thì thu hồi vừa là quyết định có đạo đức vừa là quyết định khôn ngoan. Yêu cầu của cán bộ hải quan cho thấy vì sao quyền lực một mình không quyết định thứ tự ưu tiên: một bên có thể có quyền lực và cấp bách mà không hề có yêu sách chính đáng nào.</p>`,
  ]]);

const q4 = quiz('law102-quiz-4', 'Quiz 4 — Warranties, stakeholders & CSR|||Quiz 4 — Bảo đảm, bên liên quan & CSR', [
  { id: 'q1', question: 'A salesperson says: "This is the best laptop money can buy." Under the UCC this statement is most likely…|||Nhân viên bán hàng nói: "Đây là chiếc laptop tốt nhất mà tiền có thể mua." Theo UCC, câu này nhiều khả năng là…', options: ['an express warranty|||một bảo đảm rõ ràng', 'an implied warranty of fitness for a particular purpose|||một bảo đảm ngụ ý phù hợp mục đích riêng', 'puffery (the seller’s opinion), not a warranty|||lời thổi phồng (ý kiến của người bán), không phải bảo đảm', 'a warranty of title|||một bảo đảm quyền sở hữu'], correctIndex: 2, explanation: 'Statements of the seller’s opinion or commendation of the goods do not create warranties; verifiable statements of fact do.|||Ý kiến hay lời khen của người bán về hàng hoá không tạo ra bảo đảm; khẳng định về sự kiện kiểm chứng được mới tạo ra bảo đảm.' },
  { id: 'q2', question: 'On a power/interest matrix, how should a firm treat stakeholders with HIGH power but LOW interest in a decision?|||Trên ma trận quyền lực – mối quan tâm, doanh nghiệp nên đối xử thế nào với bên liên quan có quyền lực CAO nhưng mức quan tâm THẤP tới một quyết định?', options: ['Manage closely and keep fully engaged|||Quản lý chặt và gắn kết đầy đủ', 'Monitor with minimal effort|||Theo dõi ở mức tối thiểu', 'Keep informed only|||Chỉ cần thông tin đầy đủ', 'Keep satisfied by meeting their needs|||Giữ hài lòng bằng cách đáp ứng nhu cầu của họ'], correctIndex: 3, explanation: 'High power, low interest = keep satisfied; high power, high interest = manage closely; low power, high interest = keep informed; low power, low interest = monitor.|||Quyền lực cao, quan tâm thấp = giữ hài lòng; quyền lực cao, quan tâm cao = quản lý chặt; quyền lực thấp, quan tâm cao = thông tin đầy đủ; quyền lực thấp, quan tâm thấp = theo dõi.' },
  { id: 'q3', question: 'In Carroll’s pyramid of corporate social responsibility, which responsibility forms the base?|||Trong kim tự tháp trách nhiệm xã hội của Carroll, trách nhiệm nào là tầng đáy?', options: ['Economic — be profitable|||Kinh tế — có lợi nhuận', 'Legal — obey the law|||Pháp lý — tuân thủ luật', 'Ethical — do what is right|||Đạo đức — làm điều đúng', 'Philanthropic — be a good corporate citizen|||Từ thiện — là công dân doanh nghiệp tốt'], correctIndex: 0, explanation: 'The order from base to top is economic, legal, ethical, philanthropic; a responsible firm meets all four at once.|||Thứ tự từ đáy lên đỉnh là kinh tế, pháp lý, đạo đức, từ thiện; doanh nghiệp có trách nhiệm đáp ứng cả bốn cùng lúc.' },
]);

const taiLieu = doc('law102-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">LAW102 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for studying US business law and business ethics: the official syllabus and slides, the two main books, free official legal sources, video channels, tools and a self-study roadmap.</p>
<div class="callout"><span class="badge">Educational content, not legal advice</span> This course explains general principles for learning purposes. For a real legal matter, consult a licensed lawyer, and always check the law in force in the relevant jurisdiction.</div>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official LAW102 syllabus (sylID 13718, approved by Decision 1318/QĐ-ĐHFPT of 27/11/2025) and the lecture slides. Key facts from the syllabus:</p>
<ul>
<li>3 credits, no prerequisite. <strong>US law is studied as the main system</strong>, with basic principles of Vietnamese law as the counterpart.</li>
<li>Main textbooks: Ashcroft, Ashcroft &amp; Patterson — <em>Law for Business</em>, 19th edition (Cengage, 2018; ISBN 9781305654921; the 17th edition, 2010, is also accepted) and Byars &amp; Stanberry — <em>Business Ethics</em> (OpenStax, 2018), Chapter 3.</li>
<li>Vietnamese references: <em>Luật Kinh tế chuyên khảo</em> (Hanoi Law University), the Civil Code 2015, the law on consumer protection (the syllabus cites the 2010 law; it has been replaced by the 2023 law) and teaching materials on anti-corruption.</li>
</ul>
<table>
<tr><th>Assessment component</th><th>Weight</th></tr>
<tr><td>Participation</td><td>10%</td></tr>
<tr><td>Essay test (Units 9–12: one short question + one case)</td><td>10%</td></tr>
<tr><td>Moot courts (three sessions on US cases)</td><td>25%</td></tr>
<tr><td>Individual assignment (summary and comment on a Vietnamese or US judgment)</td><td>10%</td></tr>
<tr><td>Three multiple-choice quizzes</td><td>15%</td></tr>
<tr><td>Final exam (50 multiple-choice questions on US law, 60 minutes)</td><td>30%</td></tr>
</table>
<h3>📗 Books</h3>
<ul>
<li><a href="https://www.cengageasia.com/TitleDetails/isbn/9781305654921" target="_blank" rel="noopener">Law for Business, 19th Edition</a> — John D. Ashcroft, Katherine M. Ashcroft &amp; Martha Patterson (Cengage) — main textbook; this course follows its Chapters 1–3, 5–7, 11–14, 19, 29, 32–34 and 39.</li>
<li><a href="https://openstax.org/details/books/business-ethics" target="_blank" rel="noopener">Business Ethics</a> — Stephen M. Byars &amp; Kurt Stanberry (OpenStax) — free, peer-reviewed; Chapter 3 is the basis of Units 14–17.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://www.law.cornell.edu/ucc" target="_blank" rel="noopener">Uniform Commercial Code — LII, Cornell Law School</a> — the text of UCC Article 2 (§2-201, 2-205, 2-207, 2-312 to 2-318) cited in Parts 2 and 4.</li>
<li><a href="https://www.uscourts.gov/about-federal-courts" target="_blank" rel="noopener">About Federal Courts — uscourts.gov</a> — how the district courts, courts of appeals and Supreme Court work.</li>
<li><a href="https://openstax.org/details/books/business-law-i-essentials-2e" target="_blank" rel="noopener">Business Law I Essentials (OpenStax)</a> — a free second explanation of courts, torts, contracts and business organizations.</li>
<li><a href="https://www.ftc.gov/" target="_blank" rel="noopener">Federal Trade Commission</a> — US consumer-protection and advertising rules (Lesson 4.1).</li>
<li><a href="https://www.unodc.org/unodc/en/corruption/uncac.html" target="_blank" rel="noopener">UN Convention against Corruption — UNODC</a> and <a href="https://unglobalcompact.org/" target="_blank" rel="noopener">UN Global Compact</a> — international anti-corruption and CSR standards (Lessons 4.3–4.4).</li>
<li><a href="https://vbpl.vn/" target="_blank" rel="noopener">vbpl.vn</a> — the national database of Vietnamese legal documents: check every Vietnamese provision here; <a href="https://congbobanan.toaan.gov.vn/" target="_blank" rel="noopener">congbobanan.toaan.gov.vn</a> — published Vietnamese court judgments, useful for the individual case-summary assignment.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@uscourts" target="_blank" rel="noopener">United States Courts</a> — official videos on the federal judiciary, jury service and court procedure.</li>
<li><a href="https://www.youtube.com/@CrashCourse" target="_blank" rel="noopener">CrashCourse</a> — the Government and Politics series explains the US Constitution and the court system.</li>
<li><a href="https://www.youtube.com/@khanacademy" target="_blank" rel="noopener">Khan Academy</a> — US government and civics lessons, including the judicial branch.</li>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — talks on governance, stakeholders and business ethics.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://scholar.google.com/" target="_blank" rel="noopener">Google Scholar</a> — choose "Case law" to find the text of US decisions for moot courts.</li>
<li><a href="https://www.law.cornell.edu/wex" target="_blank" rel="noopener">Wex — LII legal dictionary</a> — quick, reliable definitions of US legal terms.</li>
<li><a href="https://www.zotero.org/" target="_blank" rel="noopener">Zotero</a> — collect and cite cases and statutes in your assignments.</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — draw stakeholder maps and power/interest grids for Part 4.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations</strong> — Part 1: legal systems, sources of US law, courts; learn the elements of negligence and strict product liability.</li>
<li><strong>Exam core</strong> — Part 2 contracts and Part 3 corporations: make an element checklist for each rule and practise IRAC on short cases.</li>
<li><strong>Practise</strong> — redo the three exercises without looking, then read one real US decision on Google Scholar and summarise it (facts, issue, holding, reasoning).</li>
<li><strong>Apply</strong> — pick a Vietnamese company, map its stakeholders, and assess its CSR and anti-corruption policy with Carroll's pyramid.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">LAW102 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học luật kinh doanh Mỹ và đạo đức kinh doanh: đề cương &amp; slide chính thức, hai sách chính, nguồn pháp lý chính thức miễn phí, kênh video, công cụ và lộ trình tự học.</p>
<div class="callout"><span class="badge">Nội dung giáo dục, không phải tư vấn pháp lý</span> Môn học giải thích nguyên tắc chung cho mục đích học tập. Với vấn đề pháp lý thật, hãy hỏi luật sư có chứng chỉ hành nghề, và luôn kiểm văn bản đang có hiệu lực tại nơi liên quan.</div>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc đề cương chính thức của LAW102 (sylID 13718, ban hành theo Quyết định 1318/QĐ-ĐHFPT ngày 27/11/2025) và slide bài giảng. Thông tin chính từ đề cương:</p>
<ul>
<li>3 tín chỉ, không có môn tiên quyết. <strong>Luật Mỹ là hệ thống học chính</strong>, kèm các nguyên tắc cơ bản của luật Việt Nam để đối chiếu.</li>
<li>Sách chính: Ashcroft, Ashcroft &amp; Patterson — <em>Law for Business</em>, ấn bản 19 (Cengage, 2018; ISBN 9781305654921; ấn bản 17 năm 2010 cũng được chấp nhận) và Byars &amp; Stanberry — <em>Business Ethics</em> (OpenStax, 2018), Chương 3.</li>
<li>Tài liệu Việt Nam: <em>Luật Kinh tế chuyên khảo</em> (Trường Đại học Luật Hà Nội), Bộ luật Dân sự 2015, luật bảo vệ quyền lợi người tiêu dùng (đề cương ghi luật 2010; luật này đã được thay bằng luật 2023) và tài liệu giảng dạy về phòng, chống tham nhũng.</li>
</ul>
<table>
<tr><th>Thành phần đánh giá</th><th>Trọng số</th></tr>
<tr><td>Tham gia lớp</td><td>10%</td></tr>
<tr><td>Bài kiểm tra tự luận (Unit 9–12: một câu ngắn + một tình huống)</td><td>10%</td></tr>
<tr><td>Phiên toà giả định (ba phiên về án Mỹ)</td><td>25%</td></tr>
<tr><td>Bài cá nhân (tóm tắt và bình luận một bản án Việt Nam hoặc Mỹ)</td><td>10%</td></tr>
<tr><td>Ba bài quiz trắc nghiệm</td><td>15%</td></tr>
<tr><td>Thi cuối kỳ (50 câu trắc nghiệm luật Mỹ, 60 phút)</td><td>30%</td></tr>
</table>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://www.cengageasia.com/TitleDetails/isbn/9781305654921" target="_blank" rel="noopener">Law for Business, 19th Edition</a> — John D. Ashcroft, Katherine M. Ashcroft &amp; Martha Patterson (Cengage) — sách chính; môn học bám các Chương 1–3, 5–7, 11–14, 19, 29, 32–34 và 39.</li>
<li><a href="https://openstax.org/details/books/business-ethics" target="_blank" rel="noopener">Business Ethics</a> — Stephen M. Byars &amp; Kurt Stanberry (OpenStax) — miễn phí, có bình duyệt; Chương 3 là nền của Unit 14–17.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://www.law.cornell.edu/ucc" target="_blank" rel="noopener">Uniform Commercial Code — LII, Trường Luật Cornell</a> — toàn văn Điều khoản 2 của UCC (§2-201, 2-205, 2-207, 2-312 tới 2-318) được dẫn ở Phần 2 và Phần 4.</li>
<li><a href="https://www.uscourts.gov/about-federal-courts" target="_blank" rel="noopener">About Federal Courts — uscourts.gov</a> — cách toà quận, toà phúc thẩm và Toà án Tối cao liên bang vận hành.</li>
<li><a href="https://openstax.org/details/books/business-law-i-essentials-2e" target="_blank" rel="noopener">Business Law I Essentials (OpenStax)</a> — cách giải thích thứ hai, miễn phí, về toà án, tort, hợp đồng và tổ chức doanh nghiệp.</li>
<li><a href="https://www.ftc.gov/" target="_blank" rel="noopener">Federal Trade Commission</a> — quy định bảo vệ người tiêu dùng và quảng cáo của Mỹ (Bài 4.1).</li>
<li><a href="https://www.unodc.org/unodc/en/corruption/uncac.html" target="_blank" rel="noopener">Công ước Liên hợp quốc về chống tham nhũng — UNODC</a> và <a href="https://unglobalcompact.org/" target="_blank" rel="noopener">UN Global Compact</a> — chuẩn mực quốc tế về chống tham nhũng và CSR (Bài 4.3–4.4).</li>
<li><a href="https://vbpl.vn/" target="_blank" rel="noopener">vbpl.vn</a> — cơ sở dữ liệu quốc gia về văn bản pháp luật Việt Nam: kiểm mọi quy định Việt Nam ở đây; <a href="https://congbobanan.toaan.gov.vn/" target="_blank" rel="noopener">congbobanan.toaan.gov.vn</a> — cổng công bố bản án của toà án Việt Nam, hữu ích cho bài cá nhân tóm tắt bản án.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@uscourts" target="_blank" rel="noopener">United States Courts</a> — video chính thức về hệ thống toà án liên bang, nghĩa vụ bồi thẩm và thủ tục tố tụng.</li>
<li><a href="https://www.youtube.com/@CrashCourse" target="_blank" rel="noopener">CrashCourse</a> — loạt Government and Politics giải thích Hiến pháp Mỹ và hệ thống toà án.</li>
<li><a href="https://www.youtube.com/@khanacademy" target="_blank" rel="noopener">Khan Academy</a> — bài học về chính quyền và công dân Mỹ, gồm nhánh tư pháp.</li>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — bài nói về quản trị công ty, bên liên quan và đạo đức kinh doanh.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://scholar.google.com/" target="_blank" rel="noopener">Google Scholar</a> — chọn "Case law" để tìm toàn văn án Mỹ cho phiên toà giả định.</li>
<li><a href="https://www.law.cornell.edu/wex" target="_blank" rel="noopener">Wex — từ điển pháp lý của LII</a> — định nghĩa nhanh, đáng tin về thuật ngữ luật Mỹ.</li>
<li><a href="https://www.zotero.org/" target="_blank" rel="noopener">Zotero</a> — lưu và trích dẫn án, văn bản luật trong bài làm.</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — vẽ bản đồ bên liên quan và ma trận quyền lực – quan tâm cho Phần 4.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng</strong> — Phần 1: hệ thống pháp luật, nguồn luật Mỹ, toà án; nắm các yếu tố của cẩu thả và trách nhiệm sản phẩm nghiêm ngặt.</li>
<li><strong>Lõi thi</strong> — Phần 2 hợp đồng và Phần 3 công ty: lập danh sách yếu tố cho từng quy tắc và luyện IRAC trên tình huống ngắn.</li>
<li><strong>Luyện tập</strong> — làm lại ba bài tập mà không nhìn lời giải, rồi đọc một án Mỹ thật trên Google Scholar và tóm tắt (tình tiết, vấn đề, phán quyết, lập luận).</li>
<li><strong>Vận dụng</strong> — chọn một doanh nghiệp Việt Nam, lập bản đồ bên liên quan, và đánh giá chính sách CSR, chống tham nhũng của họ theo kim tự tháp Carroll.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'LAW102',
    slug: 'law102-business-law-and-ethics-fundamentals',
    title: 'Business Law and Ethics Fundamentals',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/LAW102.webp',
    shortDescription: 'US business law and ethics, following the FPTU syllabus: legal systems, courts, torts, property, contracts under common law and the UCC, corporations, warranties, stakeholders, corruption and CSR, with Vietnamese law as a counterpart. Bilingual, with cases and quizzes.|||Luật kinh doanh Mỹ và đạo đức theo đề cương FPTU: toà án, tort, tài sản, hợp đồng theo thông luật và UCC, công ty, bảo đảm, bên liên quan, tham nhũng, CSR; đối chiếu luật Việt Nam. Song ngữ, có bài tập, quiz.',
    description: 'Môn <strong>LAW102 — Business Law and Ethics Fundamentals (Luật và đạo đức kinh doanh)</strong> (khối Quản trị Kinh doanh, kỳ 5) bám đúng đề cương FLM (sylID 13718): <strong>luật Mỹ là hệ thống học chính</strong>, luật Việt Nam là phần đối chiếu ngắn cuối mỗi bài. Bốn phần, mười bảy unit: <strong>nền tảng luật kinh doanh</strong> (luật và đạo đức, thông luật và dân luật, bốn nguồn luật Mỹ, toà án và tố tụng, tort và trách nhiệm sản phẩm, động sản, gửi giữ, bất động sản) → <strong>hợp đồng</strong> (phân loại, năng lực, Statute of Frauds, đề nghị và chấp nhận, mailbox rule, bên thứ ba, chấm dứt và bồi thường thiệt hại) → <strong>tổ chức doanh nghiệp</strong> (hợp danh, LLC, corporation, promoter, cổ phần ưu đãi, bầu dồn phiếu, nghĩa vụ của hội đồng quản trị, sáp nhập, hợp nhất, giải thể) → <strong>đạo đức trong kinh doanh</strong> (bảo đảm theo UCC, bảo vệ người tiêu dùng, bên liên quan theo OpenStax Business Ethics Chương 3, tham nhũng và FCPA, CSR theo kim tự tháp Carroll). Sách chính: Ashcroft, Ashcroft &amp; Patterson — <em>Law for Business</em> (Cengage, ấn bản 19). Song ngữ Anh–Việt, tình huống giả định, số liệu đã kiểm bằng máy, ba bài tập kiểu moot court và tự luận, quiz trắc nghiệm cuối mỗi phần. <em>Nội dung giáo dục, không phải tư vấn pháp lý.</em>',
    whatYouLearn: 'Mô tả hệ thống pháp luật Mỹ (thông luật, bốn nguồn luật, toà án liên bang và bang, phiên toà có bồi thẩm đoàn) và đối chiếu với hệ thống pháp luật Việt Nam\nPhân biệt luật và đạo đức; vận dụng các nguyên tắc vị lợi, nghĩa vụ, công bằng, đức hạnh vào quyết định kinh doanh\nPhân tích trách nhiệm tort: tort cố ý, cẩu thả với bốn yếu tố, trách nhiệm nghiêm ngặt và trách nhiệm sản phẩm; phân biệt động sản, gửi giữ, fee simple và life estate\nXác định hợp đồng có hình thành không: đề nghị, lời mời đề nghị, chấp nhận, phản đề nghị, mailbox rule, năng lực giao kết, Statute of Frauds và UCC\nGiải quyết tranh chấp hợp đồng: người thụ hưởng thứ ba, chuyển nhượng, novation, chấm dứt, vi phạm và tính bồi thường thiệt hại (compensatory, consequential, liquidated)\nSo sánh các loại hình doanh nghiệp Mỹ và Việt Nam; giải thích thành lập công ty, cổ phần phổ thông và ưu đãi, quyền cổ đông, nghĩa vụ của hội đồng quản trị\nTính bầu dồn phiếu và cổ tức ưu đãi cộng dồn; phân biệt sáp nhập, hợp nhất và giải thể\nNhận diện bảo đảm hàng hoá, ưu tiên bên liên quan, phòng chống tham nhũng và thực hiện CSR theo kim tự tháp Carroll với thái độ tôn trọng pháp luật',
    requirements: 'Không có môn tiên quyết theo đề cương; cần đọc được tiếng Anh chuyên ngành ở mức cơ bản vì thuật ngữ và án là của Mỹ\nHiểu biết nhập môn về doanh nghiệp (công ty, cổ phần, lợi nhuận) giúp học Phần 3 nhanh hơn\nSẵn sàng đọc tình huống và lập luận theo IRAC; bài tập chỉ cần tính toán đơn giản (phép nhân, phần trăm)',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Vì sao học luật Mỹ, bản đồ 4 phần · 17 unit, IRAC, cách đánh giá.', lessons: [intro] },
    { title: 'Part 1 — Fundamentals of business law|||Phần 1 — Kiến thức nền tảng về luật kinh doanh', description: 'Unit 1–4: luật và đạo đức, toà án và tố tụng, tort, tài sản.', lessons: [u1, u2, u3, u4, q1] },
    { title: 'Part 2 — Business transactions & contracts|||Phần 2 — Giao dịch kinh doanh & hợp đồng', description: 'Unit 5–8: phân loại hợp đồng, đề nghị và chấp nhận, bên thứ ba, chấm dứt và bồi thường.', lessons: [u5, u6, u7, u8, ex1, q2] },
    { title: 'Part 3 — Business organization & structure|||Phần 3 — Tổ chức & cơ cấu doanh nghiệp', description: 'Unit 9–12: loại hình doanh nghiệp, bản chất công ty, sở hữu, quản trị và giải thể.', lessons: [u9, u10, u11, u12, ex2, q3] },
    { title: 'Part 4 — Ethics in doing business|||Phần 4 — Đạo đức trong kinh doanh', description: 'Unit 13–17: bảo đảm và bảo vệ người tiêu dùng, bên liên quan, tham nhũng, CSR.', lessons: [u13, u1415, u16, u17, ex3, q4] },
  ],
};
