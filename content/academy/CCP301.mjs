/**
 * CCP301 — Competition Law and Consumer Protection / Luật cạnh tranh và bảo vệ
 * quyền lợi người tiêu dùng (khối Công nghệ Truyền thông FPTU, Kỳ 7).
 * Góc nhìn truyền thông/marketing. Nguồn chuẩn: Luật Cạnh tranh 2018, Luật
 * Bảo vệ quyền lợi NTD 2023, Luật Quảng cáo 2012 + nghị định, Uỷ ban Cạnh
 * tranh Quốc gia; nguyên lý competition/antitrust & consumer protection quốc tế.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ccp301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: văn bản luật gốc VN, cơ quan quản lý (Uỷ ban Cạnh tranh Quốc gia), hướng dẫn quốc tế (FTC/ICC), giáo trình FLM, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">CCP301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study Vietnam's <strong>competition law</strong> and <strong>consumer-protection law</strong> — from a media &amp; marketing angle — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, primary legal sources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>Official giáo trình &amp; lecture slides for CCP301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>⚖️ Primary Vietnamese law (must-read)</h3>
<ul>
<li><strong>Luật Cạnh tranh 2018</strong> (Law on Competition No. 23/2018/QH14, in force 01/07/2019).</li>
<li><strong>Luật Bảo vệ quyền lợi người tiêu dùng 2023</strong> (Law No. 19/2023/QH15, in force 01/07/2024).</li>
<li><strong>Luật Quảng cáo 2012</strong> (Law on Advertising No. 16/2012/QH13) &amp; guiding decrees.</li>
<li><strong>Nghị định 13/2023/NĐ-CP</strong> — bảo vệ dữ liệu cá nhân (personal data protection).</li>
</ul>
<h3>🏛️ Regulators &amp; guidance</h3>
<ul>
<li><a href="https://www.moit.gov.vn/" target="_blank" rel="noopener">Uỷ ban Cạnh tranh Quốc gia / Bộ Công Thương</a> — enforcement in Vietnam.</li>
<li><a href="https://www.ftc.gov/" target="_blank" rel="noopener">US FTC</a> — competition &amp; consumer-protection guidance.</li>
<li><a href="https://iccwbo.org/" target="_blank" rel="noopener">ICC</a> — Advertising &amp; Marketing Communications Code.</li>
</ul>
<div class="callout"><span class="badge">4-step study path</span>
<ol>
<li><strong>Foundations</strong> — why competition &amp; consumer law exist; who enforces them in Vietnam.</li>
<li><strong>The rules</strong> — anti-competitive practices, unfair competition, advertising limits.</li>
<li><strong>The consumer</strong> — the 8 rights, seller duties, digital-era protection.</li>
<li><strong>Enforcement</strong> — complaints, mediation, arbitration, court, penalties &amp; damages.</li>
</ol></div>`,
    `<span class="eyebrow">CCP301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>luật cạnh tranh</strong> và <strong>luật bảo vệ người tiêu dùng</strong> Việt Nam — dưới góc độ truyền thông &amp; marketing — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn luật gốc miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của CCP301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>⚖️ Văn bản luật Việt Nam (bắt buộc đọc)</h3>
<ul>
<li><strong>Luật Cạnh tranh 2018</strong> (số 23/2018/QH14, hiệu lực 01/07/2019).</li>
<li><strong>Luật Bảo vệ quyền lợi người tiêu dùng 2023</strong> (số 19/2023/QH15, hiệu lực 01/07/2024).</li>
<li><strong>Luật Quảng cáo 2012</strong> (số 16/2012/QH13) &amp; các nghị định hướng dẫn.</li>
<li><strong>Nghị định 13/2023/NĐ-CP</strong> — bảo vệ dữ liệu cá nhân.</li>
</ul>
<h3>🏛️ Cơ quan quản lý &amp; hướng dẫn</h3>
<ul>
<li><a href="https://www.moit.gov.vn/" target="_blank" rel="noopener">Uỷ ban Cạnh tranh Quốc gia / Bộ Công Thương</a> — thực thi tại Việt Nam.</li>
<li><a href="https://www.ftc.gov/" target="_blank" rel="noopener">FTC (Mỹ)</a> — hướng dẫn cạnh tranh &amp; bảo vệ NTD.</li>
<li><a href="https://iccwbo.org/" target="_blank" rel="noopener">ICC</a> — Bộ quy tắc Quảng cáo &amp; Truyền thông tiếp thị.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình 4 bước</span>
<ol>
<li><strong>Nền tảng</strong> — vì sao cần luật cạnh tranh &amp; bảo vệ NTD; ai thực thi ở Việt Nam.</li>
<li><strong>Các quy tắc</strong> — hành vi hạn chế cạnh tranh, cạnh tranh không lành mạnh, giới hạn quảng cáo.</li>
<li><strong>Người tiêu dùng</strong> — 8 quyền, trách nhiệm bên bán, bảo vệ trên môi trường số.</li>
<li><strong>Thực thi</strong> — khiếu nại, hoà giải, trọng tài, toà án, xử phạt &amp; bồi thường.</li>
</ol></div>`,
  ]]);

const intro = doc('ccp301-0-1-overview', 'Course overview: Competition law & consumer protection|||Tổng quan: Luật cạnh tranh & bảo vệ NTD',
  'Môn học nói về gì; hai trục luật (cạnh tranh & bảo vệ NTD) và vì sao chúng gắn với truyền thông/marketing; khung 8 chương.',
  [[
    `<span class="eyebrow">CCP301 · Lesson 0.1 · Overview</span>
<h2>Competition law &amp; consumer protection</h2>
<p class="lead">This course gives media &amp; marketing students the <strong>legal rules of the market</strong>: how businesses may (and may not) compete, and how the law protects the people who buy from them. You'll read <strong>Vietnamese statutes</strong> and see how they bite on advertising, promotions and everyday marketing decisions.</p>
<h3>Two connected axes</h3>
<ul>
<li><strong>Competition law</strong> — keeps markets open: it bans cartels, abuse of market power, and dishonest tactics that harm rivals (unfair competition).</li>
<li><strong>Consumer protection</strong> — keeps the buyer safe and informed: rights to accurate information, safety, choice, and redress.</li>
</ul>
<p>They meet exactly where marketing lives: <strong>advertising, comparison claims, promotions and product information</strong> can be both an unfair-competition issue AND a consumer-rights issue at the same time.</p>
<h3>Roadmap — 8 chapters</h3>
<p>Foundations &amp; regulators → anti-competitive practices → unfair competition → advertising &amp; competition → consumer rights → seller duties → digital-era protection → dispute resolution &amp; penalties. Bilingual, with the specific Vietnamese articles and real cases.</p>`,
    `<span class="eyebrow">CCP301 · Bài 0.1 · Tổng quan</span>
<h2>Luật cạnh tranh &amp; bảo vệ NTD</h2>
<p class="lead">Môn này trao cho sinh viên truyền thông &amp; marketing <strong>luật chơi của thị trường</strong>: doanh nghiệp được và không được cạnh tranh thế nào, và pháp luật bảo vệ người mua ra sao. Bạn đọc <strong>văn bản luật Việt Nam</strong> và thấy chúng chạm tới quảng cáo, khuyến mại và quyết định marketing hằng ngày như thế nào.</p>
<h3>Hai trục gắn với nhau</h3>
<ul>
<li><strong>Luật cạnh tranh</strong> — giữ thị trường mở: cấm thoả thuận thông đồng, lạm dụng sức mạnh thị trường, và thủ đoạn gian dối làm hại đối thủ (cạnh tranh không lành mạnh).</li>
<li><strong>Bảo vệ người tiêu dùng</strong> — giữ người mua an toàn và được thông tin: quyền có thông tin chính xác, an toàn, lựa chọn, và đòi bồi thường.</li>
</ul>
<p>Chúng gặp nhau đúng chỗ marketing sống: <strong>quảng cáo, so sánh, khuyến mại và thông tin sản phẩm</strong> có thể vừa là chuyện cạnh tranh không lành mạnh VỪA là chuyện quyền NTD cùng lúc.</p>
<h3>Lộ trình — 8 chương</h3>
<p>Nền tảng &amp; cơ quan → hành vi hạn chế cạnh tranh → cạnh tranh không lành mạnh → quảng cáo &amp; cạnh tranh → quyền NTD → trách nhiệm bên bán → bảo vệ trên môi trường số → giải quyết tranh chấp &amp; chế tài. Song ngữ, kèm điều luật VN cụ thể và vụ việc thật.</p>`,
  ]]);

const c1 = doc('ccp301-1-1-foundations', '1.1 — Foundations & regulators|||1.1 — Tổng quan luật & cơ quan quản lý',
  'Vì sao cần luật cạnh tranh & bảo vệ NTD; vai trò trong kinh tế thị trường; hai đạo luật trụ cột của VN và cơ quan thực thi (Uỷ ban Cạnh tranh Quốc gia).',
  [[
    `<span class="eyebrow">CCP301 · Chapter 1 · Lesson 1.1</span>
<h2>Foundations &amp; regulators</h2>
<h3>Why these laws exist</h3>
<p>A market economy works only when competition is <strong>fair</strong> and buyers can <strong>trust</strong> what they're told. Without rules, powerful firms fix prices or crush rivals, and sellers mislead buyers. Two bodies of law answer this: <strong>competition law</strong> (protects the competitive process) and <strong>consumer-protection law</strong> (protects the weaker buyer).</p>
<h3>Vietnam's two pillars</h3>
<ul>
<li><strong>Luật Cạnh tranh 2018</strong> — replaced the 2004 law; covers anti-competitive agreements, abuse of dominance/monopoly, economic concentration (M&amp;A control) and unfair competition. Applies even to firms abroad whose conduct harms competition in Vietnam.</li>
<li><strong>Luật Bảo vệ quyền lợi người tiêu dùng 2023</strong> — replaced the 2010 law; strengthens rights, seller duties, product recall, standard-form contracts and digital transactions.</li>
</ul>
<h3>Who enforces it</h3>
<p>The <strong>Uỷ ban Cạnh tranh Quốc gia (National Competition Commission)</strong>, under the Ministry of Industry and Trade, investigates competition cases and consumer complaints. It merged the roles of the former VCCA and Competition Council.</p>
<div class="callout"><span class="badge">Marketing lens</span> Almost every campaign touches these laws: a comparison ad, a "biggest sale ever" claim, or a data-collecting sign-up form can each trigger a rule.</div>`,
    `<span class="eyebrow">CCP301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan luật &amp; cơ quan quản lý</h2>
<h3>Vì sao cần các luật này</h3>
<p>Kinh tế thị trường chỉ vận hành khi cạnh tranh <strong>lành mạnh</strong> và người mua <strong>tin</strong> được điều họ được nghe. Không có luật, doanh nghiệp mạnh sẽ ấn định giá hoặc bóp chết đối thủ, còn người bán thì gạt người mua. Hai nhánh luật trả lời điều này: <strong>luật cạnh tranh</strong> (bảo vệ quá trình cạnh tranh) và <strong>luật bảo vệ NTD</strong> (bảo vệ người mua yếu thế).</p>
<h3>Hai trụ cột của Việt Nam</h3>
<ul>
<li><strong>Luật Cạnh tranh 2018</strong> — thay Luật 2004; điều chỉnh thoả thuận hạn chế cạnh tranh, lạm dụng vị trí thống lĩnh/độc quyền, tập trung kinh tế (kiểm soát M&amp;A) và cạnh tranh không lành mạnh. Áp dụng cả với doanh nghiệp nước ngoài có hành vi gây tác động tại Việt Nam.</li>
<li><strong>Luật Bảo vệ quyền lợi người tiêu dùng 2023</strong> — thay Luật 2010; tăng cường quyền, trách nhiệm bên bán, thu hồi sản phẩm, hợp đồng theo mẫu và giao dịch số.</li>
</ul>
<h3>Ai thực thi</h3>
<p><strong>Uỷ ban Cạnh tranh Quốc gia</strong>, thuộc Bộ Công Thương, điều tra vụ việc cạnh tranh và khiếu nại của NTD. Cơ quan này hợp nhất vai trò của Cục Quản lý cạnh tranh (VCCA) và Hội đồng Cạnh tranh trước đây.</p>
<div class="callout"><span class="badge">Góc marketing</span> Gần như mọi chiến dịch đều chạm các luật này: một quảng cáo so sánh, một câu "giảm giá lớn nhất từ trước tới nay", hay một form đăng ký thu thập dữ liệu đều có thể kích hoạt một quy tắc.</div>`,
  ]]);

const c1q = quiz('ccp301-quiz-1', 'Quiz 1 — Foundations|||Quiz 1 — Nền tảng', [
  { id: 'q1', question: 'Cơ quan nào thực thi luật cạnh tranh và xử lý vụ việc tại Việt Nam?|||Which body enforces competition law in Vietnam?', options: ['Toà án nhân dân tối cao|||Supreme court', 'Uỷ ban Cạnh tranh Quốc gia (Bộ Công Thương)|||National Competition Commission', 'Ngân hàng Nhà nước|||Central bank', 'Bộ Tư pháp|||Ministry of Justice'], correctIndex: 1, explanation: 'Uỷ ban Cạnh tranh Quốc gia thuộc Bộ Công Thương, hợp nhất VCCA và Hội đồng Cạnh tranh.' },
  { id: 'q2', question: 'Luật Cạnh tranh hiện hành của Việt Nam là năm nào?|||Vietnam\'s current Law on Competition is from?', options: ['2004', '2010', '2018', '2023'], correctIndex: 2, explanation: 'Luật Cạnh tranh 2018 (hiệu lực 01/07/2019) thay cho Luật 2004.' },
  { id: 'q3', question: 'Hai nhánh luật của môn học bảo vệ điều gì?|||The two axes protect what?', options: ['Quá trình cạnh tranh và người mua yếu thế|||The competitive process and the weaker buyer', 'Chỉ lợi nhuận doanh nghiệp|||Only business profit', 'Chỉ ngân sách nhà nước|||Only state budget', 'Chỉ nhà quảng cáo|||Only advertisers'], correctIndex: 0, explanation: 'Luật cạnh tranh bảo vệ quá trình cạnh tranh; luật bảo vệ NTD bảo vệ người mua.' },
]);

const c2 = doc('ccp301-2-1-restrictive', '2.1 — Anti-competitive practices|||2.1 — Hành vi hạn chế cạnh tranh',
  'Ba nhóm: thoả thuận hạn chế cạnh tranh (cartel), lạm dụng vị trí thống lĩnh/độc quyền, tập trung kinh tế; ngưỡng thị phần và ví dụ vụ việc VN.',
  [[
    `<span class="eyebrow">CCP301 · Chapter 2 · Lesson 2.1</span>
<h2>Anti-competitive practices</h2>
<p>Luật Cạnh tranh 2018 targets three ways firms can damage the market itself:</p>
<h3>1. Anti-competitive agreements (Điều 11–12)</h3>
<p>Rivals secretly <strong>agree</strong> instead of competing — fixing prices, sharing markets, limiting output, or rigging bids (a <strong>cartel</strong>). The hard-core ones (price fixing, bid rigging, market allocation) are prohibited outright.</p>
<h3>2. Abuse of dominance / monopoly (Điều 24–27)</h3>
<p>A firm is presumed <strong>dominant</strong> at roughly <strong>30%+ market share</strong> (or with real market power). Being dominant is legal — <em>abusing</em> it is not: predatory below-cost pricing, imposing unfair terms, or refusing to deal to exclude rivals.</p>
<h3>3. Economic concentration (Điều 28–36)</h3>
<p>Mergers, acquisitions and joint ventures that would <strong>significantly restrict competition</strong> must be notified and can be blocked or conditioned.</p>
<pre><code>Rule of thumb:
  Agree with a rival    -> agreement (cartel) risk
  Have big market power  -> abuse-of-dominance risk
  Buy/merge a rival      -> concentration control (notify)
</code></pre>
<div class="callout"><span class="badge">Real VN cases</span> <strong>Vinapco (2008)</strong> — the monopoly aviation-fuel supplier cut off Jetstar Pacific: Vietnam's first abuse-of-dominance ruling. <strong>19 insurers (2008)</strong> — fined for a cartel fixing motor-insurance premiums. <strong>Grab–Uber (2018)</strong> — investigated as an economic concentration.</div>`,
    `<span class="eyebrow">CCP301 · Chương 2 · Bài 2.1</span>
<h2>Hành vi hạn chế cạnh tranh</h2>
<p>Luật Cạnh tranh 2018 nhắm ba cách doanh nghiệp làm tổn hại chính thị trường:</p>
<h3>1. Thoả thuận hạn chế cạnh tranh (Điều 11–12)</h3>
<p>Đối thủ ngầm <strong>thoả thuận</strong> thay vì cạnh tranh — ấn định giá, phân chia thị trường, hạn chế sản lượng, hoặc thông thầu (<strong>cartel</strong>). Nhóm nghiêm trọng (ấn định giá, thông thầu, phân chia thị trường) bị cấm tuyệt đối.</p>
<h3>2. Lạm dụng vị trí thống lĩnh / độc quyền (Điều 24–27)</h3>
<p>Doanh nghiệp bị coi là <strong>thống lĩnh</strong> khi thị phần khoảng <strong>từ 30% trở lên</strong> (hoặc có sức mạnh thị trường đáng kể). Thống lĩnh là hợp pháp — <em>lạm dụng</em> nó thì không: bán dưới giá thành để loại đối thủ, áp đặt điều kiện bất lợi, hoặc từ chối giao dịch nhằm loại trừ.</p>
<h3>3. Tập trung kinh tế (Điều 28–36)</h3>
<p>Sáp nhập, mua lại, liên doanh có khả năng <strong>gây hạn chế cạnh tranh đáng kể</strong> phải thông báo và có thể bị cấm hoặc kèm điều kiện.</p>
<pre><code>Quy tắc nhớ nhanh:
  Thoả thuận với đối thủ  -> rủi ro cartel
  Có sức mạnh thị trường   -> rủi ro lạm dụng thống lĩnh
  Mua/sáp nhập đối thủ    -> kiểm soát tập trung (thông báo)
</code></pre>
<div class="callout"><span class="badge">Vụ việc VN thật</span> <strong>Vinapco (2008)</strong> — nhà cung cấp xăng dầu hàng không độc quyền ngừng bơm cho Jetstar Pacific: vụ lạm dụng vị trí độc quyền đầu tiên. <strong>19 doanh nghiệp bảo hiểm (2008)</strong> — bị phạt vì thoả thuận ấn định phí bảo hiểm xe cơ giới. <strong>Grab–Uber (2018)</strong> — bị điều tra tập trung kinh tế.</div>`,
  ]]);

const c2q = quiz('ccp301-quiz-2', 'Quiz 2 — Restrictive practices|||Quiz 2 — Hạn chế cạnh tranh', [
  { id: 'q1', question: 'Ngưỡng thị phần thường dùng để coi một doanh nghiệp là "thống lĩnh"?|||Usual share threshold for "dominant"?', options: ['5%', 'Từ 30% trở lên|||30% or more', '80%', '100%'], correctIndex: 1, explanation: 'Luật 2018 lấy mốc khoảng 30% thị phần (hoặc sức mạnh thị trường đáng kể).' },
  { id: 'q2', question: 'Các đối thủ ngầm ấn định giá với nhau tạo thành?|||Rivals secretly fixing prices form a?', options: ['Tập trung kinh tế|||Economic concentration', 'Thoả thuận hạn chế cạnh tranh (cartel)|||Anti-competitive agreement (cartel)', 'Quảng cáo so sánh|||Comparative ad', 'Hợp đồng mẫu|||Standard contract'], correctIndex: 1, explanation: 'Ấn định giá giữa đối thủ là thoả thuận hạn chế cạnh tranh bị cấm.' },
  { id: 'q3', question: 'Vụ Vinapco 2008 nổi tiếng vì điều gì?|||The Vinapco 2008 case is known for?', options: ['Quảng cáo gian dối|||False advertising', 'Vụ lạm dụng vị trí độc quyền đầu tiên ở VN|||First abuse-of-dominance ruling in VN', 'Rò rỉ dữ liệu|||Data breach', 'Hàng giả|||Counterfeit goods'], correctIndex: 1, explanation: 'Vinapco ngừng cung cấp xăng dầu cho Jetstar Pacific — vụ lạm dụng độc quyền đầu tiên.' },
]);

const c3 = doc('ccp301-3-1-unfair', '3.1 — Unfair competition|||3.1 — Cạnh tranh không lành mạnh',
  'Điều 45 Luật Cạnh tranh 2018: chỉ dẫn gây nhầm lẫn, gièm pha doanh nghiệp khác, gây rối hoạt động kinh doanh, xâm phạm bí mật kinh doanh, lôi kéo khách hàng bất chính.',
  [[
    `<span class="eyebrow">CCP301 · Chapter 3 · Lesson 3.1</span>
<h2>Unfair competition</h2>
<p>Chapter 2 was about harming the <em>market</em>. <strong>Unfair competition (Điều 45, Luật Cạnh tranh 2018)</strong> is about dishonest tactics that harm a <em>specific rival</em> or mislead customers. Key prohibited acts:</p>
<ul>
<li><strong>Misleading indications</strong> — trade dress, packaging or names that make buyers confuse your product with a rival's (free-riding on their reputation).</li>
<li><strong>Denigration</strong> — spreading untrue information that damages a competitor's reputation or products.</li>
<li><strong>Disruption</strong> — interfering with a rival's lawful business activity (e.g. sabotaging their operations).</li>
<li><strong>Trade-secret infringement</strong> — obtaining or using a competitor's confidential business information unlawfully.</li>
<li><strong>Improper customer enticement</strong> — luring customers by dishonest means.</li>
</ul>
<pre><code>Test: does the tactic compete on merit,
      or does it cheat / lie / free-ride?
  Better product, price, service -> fair
  Copy the look, smear the rival -> UNFAIR
</code></pre>
<div class="callout"><span class="badge">Marketing lens</span> A "review" campaign that posts fake negative reviews of a competitor is denigration; a lookalike package that copies a famous brand's trade dress is a misleading indication. Both are unfair competition, not clever marketing.</div>`,
    `<span class="eyebrow">CCP301 · Chương 3 · Bài 3.1</span>
<h2>Cạnh tranh không lành mạnh</h2>
<p>Chương 2 nói về làm hại <em>thị trường</em>. <strong>Cạnh tranh không lành mạnh (Điều 45, Luật Cạnh tranh 2018)</strong> nói về thủ đoạn gian dối làm hại một <em>đối thủ cụ thể</em> hoặc gạt khách hàng. Các hành vi bị cấm chính:</p>
<ul>
<li><strong>Chỉ dẫn gây nhầm lẫn</strong> — kiểu dáng, bao bì hay tên gọi khiến người mua nhầm sản phẩm của bạn với của đối thủ (ăn theo uy tín của họ).</li>
<li><strong>Gièm pha</strong> — tung thông tin không trung thực làm hại uy tín hoặc sản phẩm của đối thủ.</li>
<li><strong>Gây rối</strong> — cản trở hoạt động kinh doanh hợp pháp của đối thủ (vd phá hoại vận hành của họ).</li>
<li><strong>Xâm phạm bí mật kinh doanh</strong> — thu thập hoặc sử dụng trái phép thông tin mật của đối thủ.</li>
<li><strong>Lôi kéo khách hàng bất chính</strong> — dụ khách bằng thủ đoạn gian dối.</li>
</ul>
<pre><code>Câu hỏi kiểm: thủ đoạn cạnh tranh bằng thực lực,
      hay bằng gian dối / ăn cắp / ăn theo?
  Sản phẩm, giá, dịch vụ tốt hơn -> lành mạnh
  Nhái kiểu dáng, bôi nhọ đối thủ -> KHÔNG LÀNH MẠNH
</code></pre>
<div class="callout"><span class="badge">Góc marketing</span> Một chiến dịch "đánh giá" đăng review giả tiêu cực về đối thủ là gièm pha; một bao bì nhái kiểu dáng thương hiệu nổi tiếng là chỉ dẫn gây nhầm lẫn. Cả hai đều là cạnh tranh không lành mạnh, không phải marketing khôn ngoan.</div>`,
  ]]);

const c3q = quiz('ccp301-quiz-3', 'Quiz 3 — Unfair competition|||Quiz 3 — Cạnh tranh không lành mạnh', [
  { id: 'q1', question: 'Tung thông tin sai làm hại uy tín đối thủ là hành vi?|||Spreading false info harming a rival is?', options: ['Gièm pha|||Denigration', 'Tập trung kinh tế|||Concentration', 'Bảo hành|||Warranty', 'Khuyến mại|||Promotion'], correctIndex: 0, explanation: 'Gièm pha doanh nghiệp khác là một hành vi cạnh tranh không lành mạnh (Điều 45).' },
  { id: 'q2', question: 'Bao bì nhái làm người mua nhầm với thương hiệu khác là?|||Lookalike packaging causing confusion is?', options: ['Chỉ dẫn gây nhầm lẫn|||Misleading indication', 'Quảng cáo so sánh hợp pháp|||Lawful comparative ad', 'Thu hồi sản phẩm|||Product recall', 'Hợp đồng mẫu|||Standard contract'], correctIndex: 0, explanation: 'Gây nhầm lẫn để ăn theo uy tín đối thủ là chỉ dẫn gây nhầm lẫn.' },
  { id: 'q3', question: 'Cạnh tranh không lành mạnh khác hành vi hạn chế cạnh tranh ở chỗ?|||Unfair competition differs from restrictive practices in?', options: ['Nhắm vào đối thủ/khách hàng cụ thể bằng gian dối|||Targets a specific rival/customer by dishonesty', 'Luôn hợp pháp|||Always legal', 'Chỉ áp dụng cho nhà nước|||Only applies to the state', 'Không có chế tài|||Has no penalty'], correctIndex: 0, explanation: 'Hạn chế cạnh tranh hại cả thị trường; cạnh tranh không lành mạnh dùng gian dối hại đối thủ/khách cụ thể.' },
]);

const c4 = doc('ccp301-4-1-advertising', '4.1 — Advertising & competition|||4.1 — Quảng cáo & cạnh tranh',
  'Luật Quảng cáo 2012: quảng cáo so sánh trực tiếp bị cấm; quảng cáo gian dối/gây nhầm lẫn về chất lượng-công dụng; khuyến mại nhằm cạnh tranh không lành mạnh.',
  [[
    `<span class="eyebrow">CCP301 · Chapter 4 · Lesson 4.1</span>
<h2>Advertising &amp; competition</h2>
<p>Advertising is where competition law and consumer law meet marketing head-on. The core rules sit in <strong>Luật Quảng cáo 2012 (Điều 8)</strong> plus the competition and consumer laws.</p>
<h3>Comparative advertising</h3>
<p>Vietnam <strong>prohibits directly comparing</strong> your product with a named competitor's like product (Điều 8, Luật Quảng cáo). You may say your product is good — you may not run "better than Brand X" ads that name or clearly identify a rival.</p>
<h3>False &amp; misleading advertising</h3>
<p>Ads must not be <strong>untrue or misleading</strong> about origin, quality, features, price or use. Overstated "cures", fake "No. 1" claims and invented statistics are all caught — and also breach the consumer's right to accurate information.</p>
<h3>Promotions as unfair competition</h3>
<p>Sales promotions (khuyến mại) are lawful, but a promotion designed to <strong>harm competition unfairly</strong> — e.g. deceptive prize games or promotions used to dump below cost — is prohibited.</p>
<div class="callout"><span class="badge">Real angle</span> The 2016 "arsenic in fish sauce" scare showed how <strong>false comparative information</strong> can devastate rivals — misinformation about a competitor's product quality is both denigration and misleading advertising.</div>`,
    `<span class="eyebrow">CCP301 · Chương 4 · Bài 4.1</span>
<h2>Quảng cáo &amp; cạnh tranh</h2>
<p>Quảng cáo là nơi luật cạnh tranh và luật NTD đối mặt trực tiếp với marketing. Quy tắc lõi nằm ở <strong>Luật Quảng cáo 2012 (Điều 8)</strong> cùng luật cạnh tranh và bảo vệ NTD.</p>
<h3>Quảng cáo so sánh</h3>
<p>Việt Nam <strong>cấm so sánh trực tiếp</strong> sản phẩm của mình với sản phẩm cùng loại của tổ chức/cá nhân khác (Điều 8, Luật Quảng cáo). Bạn được nói sản phẩm mình tốt — nhưng không được chạy quảng cáo "tốt hơn hãng X" nêu tên hoặc chỉ rõ đối thủ.</p>
<h3>Quảng cáo gian dối &amp; gây nhầm lẫn</h3>
<p>Quảng cáo không được <strong>sai sự thật hoặc gây nhầm lẫn</strong> về xuất xứ, chất lượng, tính năng, giá hay công dụng. "Thần dược", danh hiệu "số 1" giả, số liệu bịa đều bị cấm — đồng thời vi phạm quyền được thông tin chính xác của NTD.</p>
<h3>Khuyến mại nhằm cạnh tranh không lành mạnh</h3>
<p>Khuyến mại là hợp pháp, nhưng khuyến mại được dựng để <strong>hại cạnh tranh một cách bất chính</strong> — vd trò chơi trúng thưởng gian dối, hoặc khuyến mại để bán phá giá — thì bị cấm.</p>
<div class="callout"><span class="badge">Góc thực tế</span> Vụ "nước mắm nhiễm arsen" 2016 cho thấy <strong>thông tin so sánh sai sự thật</strong> có thể tàn phá đối thủ — thông tin sai về chất lượng sản phẩm của đối thủ vừa là gièm pha vừa là quảng cáo gây nhầm lẫn.</div>`,
  ]]);

const c4q = quiz('ccp301-quiz-4', 'Quiz 4 — Advertising|||Quiz 4 — Quảng cáo', [
  { id: 'q1', question: 'Theo Luật Quảng cáo 2012, quảng cáo so sánh trực tiếp với sản phẩm cùng loại của đối thủ được nêu tên là?|||Directly comparing with a named rival\'s like product is?', options: ['Được khuyến khích|||Encouraged', 'Bị cấm|||Prohibited', 'Bắt buộc|||Mandatory', 'Chỉ cần xin phép|||Just needs a permit'], correctIndex: 1, explanation: 'Điều 8 Luật Quảng cáo cấm quảng cáo so sánh trực tiếp với sản phẩm cùng loại của bên khác.' },
  { id: 'q2', question: 'Câu "sản phẩm số 1" bịa đặt trong quảng cáo vi phạm điều gì?|||A fake "No.1" claim breaches?', options: ['Không vi phạm gì|||Nothing', 'Quảng cáo gian dối & quyền được thông tin của NTD|||False advertising & consumer\'s right to information', 'Luật lao động|||Labour law', 'Luật đất đai|||Land law'], correctIndex: 1, explanation: 'Quảng cáo sai sự thật vừa vi phạm Luật Quảng cáo vừa xâm phạm quyền được thông tin chính xác.' },
  { id: 'q3', question: 'Một khuyến mại dựng để bán phá giá loại đối thủ có thể bị coi là?|||A promotion used to dump below cost may be?', options: ['Cạnh tranh không lành mạnh|||Unfair competition', 'Bảo hành|||Warranty', 'Hợp đồng mẫu|||Standard contract', 'Quyền của NTD|||A consumer right'], correctIndex: 0, explanation: 'Khuyến mại nhằm hại cạnh tranh bất chính (vd phá giá) bị cấm.' },
]);

const c5 = doc('ccp301-5-1-consumer-rights', '5.1 — Consumer rights|||5.1 — Quyền của người tiêu dùng',
  'Luật BVQLNTD 2023 Điều 4: 8 quyền cơ bản của NTD; nghĩa vụ của NTD (Điều 5); nguyên tắc thông tin minh bạch, trung thực.',
  [[
    `<span class="eyebrow">CCP301 · Chapter 5 · Lesson 5.1</span>
<h2>Consumer rights</h2>
<p><strong>Luật Bảo vệ quyền lợi người tiêu dùng 2023 (Điều 4)</strong> guarantees consumers a set of core rights. The eight essentials:</p>
<ol>
<li><strong>Safety</strong> — of life, health, property when using goods/services.</li>
<li><strong>Accurate information</strong> — truthful, sufficient information about goods, services and the seller.</li>
<li><strong>Free choice</strong> — of goods, services and trading partner.</li>
<li><strong>Feedback</strong> — on price, quality and service.</li>
<li><strong>Participation</strong> — in building consumer-protection policy.</li>
<li><strong>Compensation</strong> — for damage from defective goods/services or false information.</li>
<li><strong>Complaint, denunciation, litigation</strong> — to defend their interests.</li>
<li><strong>Advice &amp; support</strong> — including protection of their personal information.</li>
</ol>
<h3>Consumers also have duties (Điều 5)</h3>
<p>Check goods, follow usage instructions, and inform authorities of unsafe products or violations — protection is a two-way street.</p>
<div class="callout"><span class="badge">Marketing lens</span> The right to accurate information is the one marketers touch daily: labels, product pages and ad claims must be truthful and complete, or they breach it directly.</div>`,
    `<span class="eyebrow">CCP301 · Chương 5 · Bài 5.1</span>
<h2>Quyền của người tiêu dùng</h2>
<p><strong>Luật Bảo vệ quyền lợi người tiêu dùng 2023 (Điều 4)</strong> bảo đảm cho NTD một loạt quyền cơ bản. Tám quyền cốt lõi:</p>
<ol>
<li><strong>An toàn</strong> — tính mạng, sức khoẻ, tài sản khi dùng hàng hoá/dịch vụ.</li>
<li><strong>Thông tin chính xác</strong> — trung thực, đầy đủ về hàng hoá, dịch vụ và bên bán.</li>
<li><strong>Tự do lựa chọn</strong> — hàng hoá, dịch vụ và đối tác giao dịch.</li>
<li><strong>Góp ý</strong> — về giá, chất lượng và cung cách phục vụ.</li>
<li><strong>Tham gia</strong> — xây dựng chính sách bảo vệ NTD.</li>
<li><strong>Bồi thường</strong> — thiệt hại do hàng hoá/dịch vụ khuyết tật hoặc thông tin sai.</li>
<li><strong>Khiếu nại, tố cáo, khởi kiện</strong> — để bảo vệ quyền lợi của mình.</li>
<li><strong>Tư vấn &amp; hỗ trợ</strong> — gồm cả bảo vệ thông tin cá nhân.</li>
</ol>
<h3>NTD cũng có nghĩa vụ (Điều 5)</h3>
<p>Kiểm tra hàng hoá, làm theo hướng dẫn sử dụng, và thông tin cho cơ quan chức năng về sản phẩm không an toàn hoặc vi phạm — bảo vệ là con đường hai chiều.</p>
<div class="callout"><span class="badge">Góc marketing</span> Quyền được thông tin chính xác là quyền marketer chạm hằng ngày: nhãn, trang sản phẩm và câu quảng cáo phải trung thực và đầy đủ, nếu không là vi phạm trực tiếp.</div>`,
  ]]);

const c5q = quiz('ccp301-quiz-5', 'Quiz 5 — Consumer rights|||Quiz 5 — Quyền NTD', [
  { id: 'q1', question: 'Quyền nào của NTD mà marketer chạm tới hằng ngày qua nhãn & quảng cáo?|||Which right do marketers touch daily?', options: ['Quyền được thông tin chính xác|||Right to accurate information', 'Quyền bầu cử|||Right to vote', 'Quyền sở hữu đất|||Right to own land', 'Quyền tác giả|||Copyright'], correctIndex: 0, explanation: 'Nhãn, trang sản phẩm, câu quảng cáo phải trung thực — đó là quyền được thông tin chính xác.' },
  { id: 'q2', question: 'Luật Bảo vệ quyền lợi người tiêu dùng hiện hành là năm nào?|||Current consumer-protection law year?', options: ['1999', '2010', '2018', '2023'], correctIndex: 3, explanation: 'Luật BVQLNTD 2023 (hiệu lực 01/07/2024) thay Luật 2010.' },
  { id: 'q3', question: 'Người tiêu dùng có nghĩa vụ nào sau đây?|||Which is a consumer duty?', options: ['Kiểm tra hàng & báo sản phẩm không an toàn|||Check goods & report unsafe products', 'Đặt giá bán|||Set the selling price', 'Cấp phép quảng cáo|||License advertisements', 'Điều tra cartel|||Investigate cartels'], correctIndex: 0, explanation: 'Điều 5 quy định NTD kiểm tra hàng, làm theo hướng dẫn, báo sản phẩm không an toàn/vi phạm.' },
]);

const c6 = doc('ccp301-6-1-seller-duties', '6.1 — Duties of businesses|||6.1 — Trách nhiệm của bên kinh doanh',
  'Luật BVQLNTD 2023: nghĩa vụ cung cấp thông tin, bảo hành, thu hồi sản phẩm khuyết tật, hợp đồng theo mẫu và điều khoản bất lợi không có hiệu lực.',
  [[
    `<span class="eyebrow">CCP301 · Chapter 6 · Lesson 6.1</span>
<h2>Duties of businesses</h2>
<p>Consumer rights only work if sellers carry matching duties. <strong>Luật BVQLNTD 2023</strong> imposes:</p>
<ul>
<li><strong>Provide information</strong> — accurate, sufficient details on goods/services, price, warranty and the seller's identity.</li>
<li><strong>Warranty</strong> — honour the promised warranty terms; the burden of a defective product doesn't fall on the buyer.</li>
<li><strong>Recall defective products</strong> — when a product has a defect that can harm consumers, the business must publicly recall it and bear the cost.</li>
<li><strong>Standard-form contracts &amp; general conditions</strong> — must be clear, registered where required, and interpreted in the consumer's favour when ambiguous.</li>
</ul>
<h3>Unfair terms are void</h3>
<p>Clauses that <strong>exclude the seller's liability, let the seller change terms unilaterally, or force the consumer to waive rights</strong> have <strong>no legal effect</strong> — even if the buyer signed. The law voids the term, not necessarily the whole contract.</p>
<div class="callout"><span class="badge">Marketing lens</span> "By clicking you accept everything and we're not responsible for anything" is exactly the kind of one-sided clause the law strikes down. Terms &amp; conditions are a legal document, not a formality.</div>`,
    `<span class="eyebrow">CCP301 · Chương 6 · Bài 6.1</span>
<h2>Trách nhiệm của bên kinh doanh</h2>
<p>Quyền của NTD chỉ có nghĩa khi bên bán gánh nghĩa vụ tương ứng. <strong>Luật BVQLNTD 2023</strong> đặt ra:</p>
<ul>
<li><strong>Cung cấp thông tin</strong> — chính xác, đầy đủ về hàng hoá/dịch vụ, giá, bảo hành và danh tính bên bán.</li>
<li><strong>Bảo hành</strong> — thực hiện đúng điều kiện bảo hành đã hứa; gánh nặng sản phẩm lỗi không đổ lên người mua.</li>
<li><strong>Thu hồi sản phẩm khuyết tật</strong> — khi sản phẩm có khuyết tật có thể gây hại, bên kinh doanh phải công khai thu hồi và chịu chi phí.</li>
<li><strong>Hợp đồng theo mẫu &amp; điều kiện chung</strong> — phải rõ ràng, đăng ký nơi bắt buộc, và giải thích theo hướng có lợi cho NTD khi mập mờ.</li>
</ul>
<h3>Điều khoản bất lợi thì vô hiệu</h3>
<p>Điều khoản <strong>loại trừ trách nhiệm bên bán, cho bên bán đơn phương thay đổi điều kiện, hoặc buộc NTD từ bỏ quyền</strong> thì <strong>không có hiệu lực</strong> — dù người mua đã ký. Luật vô hiệu điều khoản đó, không nhất thiết cả hợp đồng.</p>
<div class="callout"><span class="badge">Góc marketing</span> "Bấm là bạn chấp nhận mọi thứ và chúng tôi không chịu trách nhiệm gì" đúng là loại điều khoản một chiều mà luật gạt bỏ. Điều khoản &amp; điều kiện là văn bản pháp lý, không phải thủ tục cho có.</div>`,
  ]]);

const c6q = quiz('ccp301-quiz-6', 'Quiz 6 — Seller duties|||Quiz 6 — Trách nhiệm bên bán', [
  { id: 'q1', question: 'Khi sản phẩm có khuyết tật gây hại, bên kinh doanh phải?|||With a harmful defect, the business must?', options: ['Im lặng|||Stay silent', 'Công khai thu hồi và chịu chi phí|||Publicly recall & bear the cost', 'Đổ lỗi người mua|||Blame the buyer', 'Tăng giá|||Raise the price'], correctIndex: 1, explanation: 'Luật BVQLNTD 2023 buộc thu hồi công khai sản phẩm khuyết tật và chịu chi phí.' },
  { id: 'q2', question: 'Điều khoản hợp đồng mẫu loại trừ hoàn toàn trách nhiệm bên bán thì?|||A clause fully excluding seller liability is?', options: ['Có hiệu lực nếu đã ký|||Valid if signed', 'Không có hiệu lực (vô hiệu)|||Void / no legal effect', 'Chỉ áp dụng ban đêm|||Only applies at night', 'Bắt buộc mọi hợp đồng|||Mandatory'], correctIndex: 1, explanation: 'Điều khoản bất lợi kiểu loại trừ trách nhiệm không có hiệu lực dù đã ký.' },
  { id: 'q3', question: 'Hợp đồng theo mẫu mập mờ được giải thích theo hướng?|||Ambiguous standard contracts are read?', options: ['Có lợi cho NTD|||In the consumer\'s favour', 'Có lợi cho bên bán|||In the seller\'s favour', 'Bỏ qua|||Ignored', 'Do toà tự viết lại|||Rewritten by the court'], correctIndex: 0, explanation: 'Khi mập mờ, hợp đồng mẫu giải thích theo hướng có lợi cho người tiêu dùng.' },
]);

const c7 = doc('ccp301-7-1-digital', '7.1 — Consumer protection in the digital space|||7.1 — Bảo vệ NTD trên môi trường số',
  'Giao dịch từ xa & thương mại điện tử (Luật BVQLNTD 2023), nền tảng số trung gian, và bảo vệ dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP.',
  [[
    `<span class="eyebrow">CCP301 · Chapter 7 · Lesson 7.1</span>
<h2>Consumer protection in the digital space</h2>
<p>The 2023 law modernised protection for online buyers — the area media &amp; marketing students will work in most.</p>
<h3>Distance &amp; e-commerce transactions</h3>
<p>For <strong>distance transactions</strong> (online, app, phone), the seller must give clear pre-contract information, the total price, and terms <em>before</em> the buyer commits — and must confirm the order. Dark patterns that hide costs or trap subscriptions breach this.</p>
<h3>Digital intermediary platforms</h3>
<p>Marketplaces and platforms carry <strong>their own duties</strong>: publish rules, let consumers rate/report, and cooperate in resolving disputes — they can't hide behind "we're just the platform".</p>
<h3>Personal data — Nghị định 13/2023/NĐ-CP</h3>
<p>Vietnam's <strong>Personal Data Protection Decree</strong> requires a lawful basis and, generally, the data subject's <strong>consent</strong> before processing personal data. Marketing databases, retargeting pixels and email lists all fall under it.</p>
<div class="callout"><span class="badge">Marketing lens</span> A "free trial" that silently auto-charges, or an email list built without consent, is now a legal violation — not a growth hack.</div>`,
    `<span class="eyebrow">CCP301 · Chương 7 · Bài 7.1</span>
<h2>Bảo vệ NTD trên môi trường số</h2>
<p>Luật 2023 hiện đại hoá việc bảo vệ người mua trực tuyến — chính là môi trường sinh viên truyền thông &amp; marketing sẽ làm việc nhiều nhất.</p>
<h3>Giao dịch từ xa &amp; thương mại điện tử</h3>
<p>Với <strong>giao dịch từ xa</strong> (trực tuyến, app, điện thoại), bên bán phải cung cấp thông tin trước giao kết rõ ràng, tổng giá và điều khoản <em>trước khi</em> người mua cam kết — và phải xác nhận đơn hàng. Các "dark pattern" giấu chi phí hay bẫy gia hạn là vi phạm.</p>
<h3>Nền tảng số trung gian</h3>
<p>Sàn và nền tảng có <strong>nghĩa vụ riêng</strong>: công bố quy tắc, cho NTD đánh giá/phản ánh, và phối hợp giải quyết tranh chấp — không được núp sau câu "chúng tôi chỉ là nền tảng".</p>
<h3>Dữ liệu cá nhân — Nghị định 13/2023/NĐ-CP</h3>
<p><strong>Nghị định bảo vệ dữ liệu cá nhân</strong> yêu cầu có căn cứ hợp pháp và, thông thường, <strong>sự đồng ý</strong> của chủ thể dữ liệu trước khi xử lý dữ liệu cá nhân. Cơ sở dữ liệu marketing, pixel retarget và danh sách email đều thuộc phạm vi này.</p>
<div class="callout"><span class="badge">Góc marketing</span> Một "dùng thử miễn phí" âm thầm tự thu tiền, hay một danh sách email dựng không có đồng ý, giờ là vi phạm pháp luật — không phải mẹo tăng trưởng.</div>`,
  ]]);

const c7q = quiz('ccp301-quiz-7', 'Quiz 7 — Digital protection|||Quiz 7 — Bảo vệ trên môi trường số', [
  { id: 'q1', question: 'Nghị định 13/2023/NĐ-CP điều chỉnh vấn đề gì?|||What does Decree 13/2023 govern?', options: ['Bảo vệ dữ liệu cá nhân|||Personal data protection', 'Thuế thu nhập|||Income tax', 'Giao thông|||Traffic', 'Bản quyền âm nhạc|||Music copyright'], correctIndex: 0, explanation: 'Nghị định 13/2023/NĐ-CP là nghị định bảo vệ dữ liệu cá nhân của Việt Nam.' },
  { id: 'q2', question: 'Trong giao dịch từ xa, bên bán phải cung cấp giá & điều khoản khi nào?|||In distance sales, terms must be given when?', options: ['Sau khi thu tiền|||After charging', 'Trước khi người mua cam kết|||Before the buyer commits', 'Không cần|||Not required', 'Chỉ khi có tranh chấp|||Only in a dispute'], correctIndex: 1, explanation: 'Thông tin, tổng giá, điều khoản phải rõ ràng trước khi người mua cam kết.' },
  { id: 'q3', question: 'Sàn thương mại điện tử trung gian có thể chối bỏ trách nhiệm bằng "chúng tôi chỉ là nền tảng"?|||Can a marketplace hide behind "just a platform"?', options: ['Có, luôn được|||Yes, always', 'Không — nền tảng có nghĩa vụ riêng|||No — platforms carry their own duties', 'Chỉ ngày lễ|||Only on holidays', 'Tuỳ đối thủ|||Depends on rivals'], correctIndex: 1, explanation: 'Nền tảng số trung gian có nghĩa vụ công bố quy tắc, xử lý phản ánh và phối hợp giải quyết tranh chấp.' },
]);

const c8 = doc('ccp301-8-1-disputes', '8.1 — Dispute resolution & penalties|||8.1 — Giải quyết tranh chấp & chế tài',
  'Bốn phương thức giải quyết tranh chấp NTD (thương lượng, hoà giải, trọng tài, toà án), khiếu nại tới Uỷ ban Cạnh tranh Quốc gia, xử phạt hành chính và trách nhiệm bồi thường.',
  [[
    `<span class="eyebrow">CCP301 · Chapter 8 · Lesson 8.1</span>
<h2>Dispute resolution &amp; penalties</h2>
<h3>Four ways to resolve a consumer dispute</h3>
<p>Luật BVQLNTD 2023 offers an escalating ladder:</p>
<ol>
<li><strong>Negotiation</strong> — buyer and seller settle directly.</li>
<li><strong>Mediation</strong> — a neutral third party helps them agree.</li>
<li><strong>Arbitration</strong> — a binding decision from an arbitrator, where agreed.</li>
<li><strong>Court</strong> — litigation; simple, low-value consumer claims can use a simplified procedure.</li>
</ol>
<h3>Competition-law enforcement</h3>
<p>Competition violations are investigated by the <strong>National Competition Commission</strong>, which can impose <strong>administrative fines</strong> (a percentage of the violator's relevant turnover for serious breaches) and corrective measures.</p>
<h3>Penalties &amp; compensation</h3>
<p>Alongside fines under decrees (e.g. Nghị định 75/2019 for competition, Nghị định 98/2020 for trade), a business must <strong>compensate</strong> consumers for damage caused by defective goods or false information. Serious cases can carry criminal liability.</p>
<div class="callout"><span class="badge">Takeaway</span> Compliance is cheaper than the fine: build truthful campaigns, honest comparisons, clear terms and lawful data practices from the start.</div>`,
    `<span class="eyebrow">CCP301 · Chương 8 · Bài 8.1</span>
<h2>Giải quyết tranh chấp &amp; chế tài</h2>
<h3>Bốn cách giải quyết tranh chấp NTD</h3>
<p>Luật BVQLNTD 2023 đưa ra một thang leo dần:</p>
<ol>
<li><strong>Thương lượng</strong> — người mua và người bán tự giải quyết.</li>
<li><strong>Hoà giải</strong> — bên thứ ba trung lập giúp hai bên thoả thuận.</li>
<li><strong>Trọng tài</strong> — quyết định có tính ràng buộc của trọng tài viên, khi có thoả thuận.</li>
<li><strong>Toà án</strong> — khởi kiện; vụ NTD đơn giản, giá trị nhỏ có thể dùng thủ tục rút gọn.</li>
</ol>
<h3>Thực thi luật cạnh tranh</h3>
<p>Vi phạm cạnh tranh do <strong>Uỷ ban Cạnh tranh Quốc gia</strong> điều tra, có thể <strong>phạt tiền hành chính</strong> (tính theo tỷ lệ phần trăm doanh thu liên quan của bên vi phạm đối với vi phạm nghiêm trọng) và áp dụng biện pháp khắc phục.</p>
<h3>Chế tài &amp; bồi thường</h3>
<p>Bên cạnh phạt theo nghị định (vd Nghị định 75/2019 về cạnh tranh, Nghị định 98/2020 về thương mại), bên kinh doanh phải <strong>bồi thường</strong> thiệt hại do hàng hoá khuyết tật hoặc thông tin sai gây ra cho NTD. Trường hợp nghiêm trọng có thể bị truy cứu trách nhiệm hình sự.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Tuân thủ rẻ hơn tiền phạt: dựng chiến dịch trung thực, so sánh minh bạch, điều khoản rõ ràng và thực hành dữ liệu hợp pháp ngay từ đầu.</div>`,
  ]]);

const c8q = quiz('ccp301-quiz-8', 'Quiz 8 — Disputes & penalties|||Quiz 8 — Tranh chấp & chế tài', [
  { id: 'q1', question: 'Phương thức nào KHÔNG nằm trong bốn cách giải quyết tranh chấp NTD?|||Which is NOT one of the four dispute methods?', options: ['Thương lượng|||Negotiation', 'Hoà giải|||Mediation', 'Trọng tài|||Arbitration', 'Đấu giá|||Auction'], correctIndex: 3, explanation: 'Bốn cách là thương lượng, hoà giải, trọng tài, toà án — không có đấu giá.' },
  { id: 'q2', question: 'Với vi phạm cạnh tranh nghiêm trọng, mức phạt tiền có thể tính theo?|||Serious competition fines can be based on?', options: ['Số nhân viên|||Headcount', 'Tỷ lệ phần trăm doanh thu liên quan|||A percentage of relevant turnover', 'Diện tích văn phòng|||Office size', 'Tuổi doanh nghiệp|||Company age'], correctIndex: 1, explanation: 'Phạt vi phạm cạnh tranh nghiêm trọng có thể tính theo tỷ lệ phần trăm doanh thu liên quan.' },
  { id: 'q3', question: 'Ngoài bị phạt, doanh nghiệp gây thiệt hại cho NTD còn phải?|||Beyond fines, a harming business must also?', options: ['Bồi thường thiệt hại|||Compensate for damage', 'Không làm gì thêm|||Do nothing more', 'Đổi tên|||Rename itself', 'Tăng quảng cáo|||Advertise more'], correctIndex: 0, explanation: 'Doanh nghiệp phải bồi thường thiệt hại do hàng khuyết tật hoặc thông tin sai gây ra.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'CCP301',
    slug: 'ccp301-luat-canh-tranh-va-bao-ve-quyen-loi-nguoi-tieu-dung',
    title: 'Luật cạnh tranh và bảo vệ quyền lợi người tiêu dùng',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CCP301.webp',
    shortDescription: 'Vietnam competition & consumer-protection law for media & marketing — anti-competitive practices, unfair competition, ad law, the 8 consumer rights, seller duties, digital protection & disputes. Bilingual + real VN cases.|||Luật cạnh tranh & bảo vệ NTD cho truyền thông & marketing — hạn chế cạnh tranh, cạnh tranh không lành mạnh, luật quảng cáo, 8 quyền NTD, trách nhiệm bên bán, môi trường số & tranh chấp. Song ngữ + vụ việc thật.',
    description: 'Môn <strong>CCP301 — Competition Law and Consumer Protection (Luật cạnh tranh và bảo vệ quyền lợi người tiêu dùng)</strong> thuộc khối Công nghệ Truyền thông (kỳ 7), nhìn dưới góc độ <strong>truyền thông &amp; marketing</strong>. Từ <strong>nền tảng &amp; cơ quan quản lý</strong> (Luật Cạnh tranh 2018, Luật BVQLNTD 2023, Uỷ ban Cạnh tranh Quốc gia) → <strong>hành vi hạn chế cạnh tranh</strong> (cartel, lạm dụng thống lĩnh, tập trung kinh tế) → <strong>cạnh tranh không lành mạnh</strong> → <strong>quảng cáo &amp; cạnh tranh</strong> (so sánh, gian dối, khuyến mại) → <strong>quyền NTD</strong> → <strong>trách nhiệm bên bán</strong> → <strong>bảo vệ trên môi trường số</strong> → <strong>giải quyết tranh chấp &amp; chế tài</strong>. Song ngữ, kèm điều luật VN cụ thể, vụ việc thật và quiz mỗi chương.',
    whatYouLearn: 'Vai trò luật cạnh tranh &amp; bảo vệ NTD trong kinh tế thị trường; ba nhóm hành vi hạn chế cạnh tranh và ngưỡng thị phần thống lĩnh; năm hành vi cạnh tranh không lành mạnh (Điều 45); giới hạn quảng cáo so sánh &amp; quảng cáo gian dối (Luật Quảng cáo 2012); 8 quyền cơ bản của NTD (Luật BVQLNTD 2023); trách nhiệm cung cấp thông tin, bảo hành, thu hồi, hợp đồng mẫu &amp; điều khoản vô hiệu; bảo vệ NTD trên TMĐT và dữ liệu cá nhân (NĐ 13/2023); bốn phương thức giải quyết tranh chấp, xử phạt &amp; bồi thường.',
    requirements: 'Không cần kiến thức pháp lý trước. Nên đọc song song văn bản gốc: Luật Cạnh tranh 2018, Luật BVQLNTD 2023, Luật Quảng cáo 2012 trên FLM / cổng pháp luật.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Luật gốc VN, cơ quan quản lý, hướng dẫn quốc tế, giáo trình FLM, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Hai trục luật & vì sao gắn với marketing.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & cơ quan|||Chapter 1 — Foundations & regulators', description: 'Vì sao cần luật; hai đạo luật trụ cột; Uỷ ban Cạnh tranh Quốc gia.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hạn chế cạnh tranh|||Chapter 2 — Anti-competitive practices', description: 'Cartel, lạm dụng thống lĩnh, tập trung kinh tế.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Cạnh tranh không lành mạnh|||Chapter 3 — Unfair competition', description: 'Chỉ dẫn gây nhầm lẫn, gièm pha, gây rối, bí mật kinh doanh.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Quảng cáo & cạnh tranh|||Chapter 4 — Advertising & competition', description: 'Quảng cáo so sánh, gian dối, khuyến mại cạnh tranh.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Quyền của NTD|||Chapter 5 — Consumer rights', description: '8 quyền cơ bản, nghĩa vụ, thông tin minh bạch.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Trách nhiệm bên bán|||Chapter 6 — Duties of businesses', description: 'Thông tin, bảo hành, thu hồi, hợp đồng mẫu, điều khoản vô hiệu.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Môi trường số|||Chapter 7 — Digital space', description: 'TMĐT, giao dịch từ xa, dữ liệu cá nhân (NĐ 13/2023).', lessons: [c7, c7q] },
    { title: 'Chương 8 — Tranh chấp & chế tài|||Chapter 8 — Disputes & penalties', description: 'Thương lượng, hoà giải, trọng tài, toà án, xử phạt, bồi thường.', lessons: [c8, c8q] },
  ],
};
