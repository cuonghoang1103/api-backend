/**
 * CSB201 — Celebrity, Social Media Influencers and Brands. Môn KHÔNG có FLM →
 * khung dựng theo giáo trình chuẩn quốc tế về influencer marketing: "Influencer"
 * (Brittany Hennessy), Influencer Marketing Hub, báo cáo Meltwater/Emplifi,
 * FTC Endorsement Guides. 8 chương: định nghĩa & phân loại → vì sao dùng →
 * chọn người → chiến dịch → nội dung & đồng sáng tạo → đo lường → rủi ro & đạo
 * đức → xu hướng. Song ngữ + ví dụ KOL/chiến dịch thật + quiz mỗi chương.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "&"→&amp; trong content.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('csb201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách nền, Influencer Marketing Hub, báo cáo ngành, quy định FTC, công cụ phân tích influencer, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">CSB201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study <strong>celebrities, social-media influencers and brands</strong> in one place. This subject has no single FPTU textbook, so the course is built from the <strong>standard international literature</strong> on celebrity endorsement and influencer marketing — free and legal resources below.</p>
<h3>📘 Core book</h3>
<ul>
<li><a href="https://www.goodreads.com/book/show/36204712-influencer" target="_blank" rel="noopener"><em>Influencer: Building Your Personal Brand in the Age of Social Media</em> — Brittany Hennessy</a> — the practitioner's guide to how brands and creators actually deal.</li>
</ul>
<h3>🌐 Industry knowledge bases</h3>
<ul>
<li><a href="https://influencermarketinghub.com/" target="_blank" rel="noopener">Influencer Marketing Hub</a> — benchmark reports, tier definitions, rate cards, glossary.</li>
<li><a href="https://www.meltwater.com/en/blog" target="_blank" rel="noopener">Meltwater blog</a> &amp; <a href="https://emplifi.io/resources" target="_blank" rel="noopener">Emplifi resources</a> — annual social &amp; creator-economy reports.</li>
</ul>
<h3>⚖️ Rules &amp; disclosure</h3>
<ul>
<li><a href="https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers" target="_blank" rel="noopener">FTC — Disclosures 101 for Social Media Influencers</a> — when and how sponsorship must be labelled.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://hypeauditor.com/" target="_blank" rel="noopener">HypeAuditor</a> — audience quality &amp; fake-follower checks.</li>
<li><a href="https://later.com/influencer-marketing/" target="_blank" rel="noopener">Later Influencer</a> &amp; <a href="https://www.upfluence.com/" target="_blank" rel="noopener">Upfluence</a> — discovery, outreach, campaign tracking.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — who influencers are (nano→mega, KOL vs KOC) and why they persuade (credibility, parasocial trust).</li>
<li><strong>Plan</strong> — pick the right fit, write a brief, choose a deal type (gifting/paid/affiliate/ambassador).</li>
<li><strong>Run &amp; measure</strong> — co-create content, then track reach, engagement, EMV, conversion and ROI.</li>
<li><strong>Stay safe</strong> — disclose sponsorship (FTC), guard brand safety, and read the trends (creator economy, live commerce, virtual &amp; AI influencers).</li>
</ol></div>`,
    `<span class="eyebrow">CSB201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học về <strong>người nổi tiếng, KOL/influencer và thương hiệu</strong> gom về một chỗ. Môn này không có một giáo trình FPTU riêng, nên khoá được dựng từ <strong>tài liệu chuẩn quốc tế</strong> về celebrity endorsement và influencer marketing — nguồn miễn phí, hợp pháp bên dưới.</p>
<h3>📘 Sách nền</h3>
<ul>
<li><a href="https://www.goodreads.com/book/show/36204712-influencer" target="_blank" rel="noopener"><em>Influencer: Building Your Personal Brand in the Age of Social Media</em> — Brittany Hennessy</a> — sách nghề, kể cách thương hiệu và nhà sáng tạo thực sự "chốt kèo".</li>
</ul>
<h3>🌐 Kho tri thức ngành</h3>
<ul>
<li><a href="https://influencermarketinghub.com/" target="_blank" rel="noopener">Influencer Marketing Hub</a> — báo cáo benchmark, định nghĩa các bậc, bảng giá, thuật ngữ.</li>
<li><a href="https://www.meltwater.com/en/blog" target="_blank" rel="noopener">Meltwater blog</a> &amp; <a href="https://emplifi.io/resources" target="_blank" rel="noopener">Emplifi resources</a> — báo cáo thường niên về mạng xã hội &amp; creator economy.</li>
</ul>
<h3>⚖️ Quy định &amp; công bố tài trợ</h3>
<ul>
<li><a href="https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers" target="_blank" rel="noopener">FTC — Disclosures 101 cho Influencer</a> — khi nào và cách gắn nhãn tài trợ.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://hypeauditor.com/" target="_blank" rel="noopener">HypeAuditor</a> — soi chất lượng khán giả &amp; follower ảo.</li>
<li><a href="https://later.com/influencer-marketing/" target="_blank" rel="noopener">Later Influencer</a> &amp; <a href="https://www.upfluence.com/" target="_blank" rel="noopener">Upfluence</a> — tìm người, liên hệ, theo dõi chiến dịch.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền</strong> — influencer là ai (nano→mega, KOL vs KOC) và vì sao họ thuyết phục (uy tín, niềm tin cận xã hội).</li>
<li><strong>Lập kế hoạch</strong> — chọn đúng người, viết brief, chọn kiểu hợp tác (gifting/paid/affiliate/ambassador).</li>
<li><strong>Chạy &amp; đo</strong> — đồng sáng tạo nội dung, rồi theo dõi reach, engagement, EMV, chuyển đổi và ROI.</li>
<li><strong>Giữ an toàn</strong> — công bố tài trợ (FTC), bảo vệ brand safety, và đọc xu hướng (creator economy, live commerce, virtual &amp; AI influencer).</li>
</ol></div>`,
  ]]);

const intro = doc('csb201-0-1-overview', 'Course overview: celebrities, influencers & brands|||Tổng quan: người nổi tiếng, influencer & thương hiệu',
  'Vì sao thương hiệu "mượn" người có ảnh hưởng; từ celebrity endorsement cổ điển đến influencer marketing hiện đại; lộ trình 8 chương.',
  [[
    `<span class="eyebrow">CSB201 · Lesson 0.1 · Overview</span>
<h2>Celebrities, influencers &amp; brands</h2>
<p class="lead">Brands have always borrowed the trust and attention of admired people — from a movie star on a perfume ad to a nano-creator reviewing skincare for 4,000 followers. This course explains <strong>who these people are, why their word moves buyers, and how brands work with them</strong> without wasting money or getting burned.</p>
<h3>From endorsement to the creator economy</h3>
<p>Classic <strong>celebrity endorsement</strong> rented fame: a famous face lent status to a product (Nike + Michael Jordan, 1984). Today <strong>influencer marketing</strong> is bigger and more granular — millions of ordinary creators build niche audiences that trust them like a friend. The logic is the same (borrowed trust); the scale, targeting and measurability are new.</p>
<h3>Roadmap — 8 chapters</h3>
<ol>
<li><strong>Who</strong> — celebrities, KOLs, influencers; nano→mega; KOL vs KOC.</li>
<li><strong>Why it works</strong> — source credibility, meaning transfer, parasocial trust.</li>
<li><strong>Choosing</strong> — brand fit, audience match, real vs fake engagement.</li>
<li><strong>Campaigns</strong> — brief, deliverables, gifting/paid/affiliate/ambassador.</li>
<li><strong>Content</strong> — co-creation, authenticity, brand safety.</li>
<li><strong>Measurement</strong> — reach, engagement, EMV, conversion, ROI.</li>
<li><strong>Risk &amp; ethics</strong> — crises, fake followers, FTC disclosure.</li>
<li><strong>Trends</strong> — creator economy, live commerce, virtual &amp; AI influencers.</li>
</ol>
<div class="callout"><span class="badge">Big idea</span> An influencer is not a billboard — it's a <em>relationship</em> a brand rents. Respect the relationship and it converts; abuse it and both the creator and the brand lose the audience's trust.</div>`,
    `<span class="eyebrow">CSB201 · Bài 0.1 · Tổng quan</span>
<h2>Người nổi tiếng, influencer &amp; thương hiệu</h2>
<p class="lead">Thương hiệu luôn "mượn" niềm tin và sự chú ý của những người được ngưỡng mộ — từ ngôi sao điện ảnh trên quảng cáo nước hoa đến một nano-creator review mỹ phẩm cho 4.000 người theo dõi. Môn này giải thích <strong>họ là ai, vì sao lời họ lay chuyển người mua, và thương hiệu hợp tác thế nào</strong> mà không phí tiền hay "dính phốt".</p>
<h3>Từ endorsement đến creator economy</h3>
<p><strong>Celebrity endorsement</strong> cổ điển là thuê danh tiếng: một gương mặt nổi tiếng cho sản phẩm mượn địa vị (Nike + Michael Jordan, 1984). Ngày nay <strong>influencer marketing</strong> lớn hơn và chi tiết hơn — hàng triệu nhà sáng tạo bình thường xây khán giả ngách tin họ như tin một người bạn. Logic vẫn thế (mượn niềm tin); cái mới là quy mô, khả năng nhắm mục tiêu và đo lường.</p>
<h3>Lộ trình — 8 chương</h3>
<ol>
<li><strong>Là ai</strong> — celebrity, KOL, influencer; nano→mega; KOL vs KOC.</li>
<li><strong>Vì sao hiệu quả</strong> — uy tín nguồn, chuyển nghĩa, niềm tin cận xã hội.</li>
<li><strong>Chọn người</strong> — hợp thương hiệu, khớp khán giả, engagement thật vs ảo.</li>
<li><strong>Chiến dịch</strong> — brief, deliverables, gifting/paid/affiliate/ambassador.</li>
<li><strong>Nội dung</strong> — đồng sáng tạo, tính chân thực, brand safety.</li>
<li><strong>Đo lường</strong> — reach, engagement, EMV, chuyển đổi, ROI.</li>
<li><strong>Rủi ro &amp; đạo đức</strong> — khủng hoảng, follower ảo, công bố FTC.</li>
<li><strong>Xu hướng</strong> — creator economy, live commerce, virtual &amp; AI influencer.</li>
</ol>
<div class="callout"><span class="badge">Ý lớn</span> Influencer không phải tấm biển quảng cáo — đó là một <em>mối quan hệ</em> mà thương hiệu thuê lại. Tôn trọng mối quan hệ thì nó chuyển đổi; lạm dụng thì cả nhà sáng tạo lẫn thương hiệu đều mất niềm tin của khán giả.</div>`,
  ]]);

const c1 = doc('csb201-1-1-who', '1.1 — Celebrities, KOLs & influencers|||1.1 — Người nổi tiếng, KOL & influencer',
  'Định nghĩa celebrity / KOL / influencer; phân bậc nano/micro/macro/mega; phân biệt KOL vs KOC; đánh đổi quy mô ↔ độ tin.',
  [[
    `<span class="eyebrow">CSB201 · Chapter 1 · Lesson 1.1</span>
<h2>Who's who: celebrities, KOLs &amp; influencers</h2>
<h3>Three overlapping terms</h3>
<ul>
<li><strong>Celebrity</strong> — famous <em>first</em> (actor, athlete, singer); fame comes from outside social media. E.g. Cristiano Ronaldo, Sơn Tùng M-TP.</li>
<li><strong>KOL (Key Opinion Leader)</strong> — an expert whose opinion carries weight in a field (a doctor, a chef, a tech reviewer). Authority comes from <em>expertise</em>.</li>
<li><strong>Influencer</strong> — famous <em>because of</em> social media; built an audience by posting. Authority comes from the <em>relationship</em> with followers.</li>
</ul>
<h3>Tiers by audience size</h3>
<pre><code>Nano    1K – 10K     highest engagement, hyper-niche, cheap
Micro   10K – 100K   strong trust, still affordable
Macro   100K – 1M    broad reach, semi-pro
Mega    1M+          celebrity scale, mass reach, expensive
</code></pre>
<p>Rule of thumb: <strong>engagement rate falls as audience grows</strong>. A nano-creator often out-converts a mega-star per follower, because the audience feels personally known.</p>
<h3>KOL vs KOC</h3>
<p>A <strong>KOC (Key Opinion Consumer)</strong> is an ordinary buyer who reviews products honestly — smaller reach, but read as a peer, not an ad. In Vietnam, TikTok reviewers like <em>Call Me Duy</em> or livestream sellers such as <em>Võ Hà Linh</em> show how KOC-style content drives sales harder than a distant celebrity.</p>
<div class="callout"><span class="badge">Pick by goal</span> Awareness → macro/mega for reach. Trust &amp; conversion → micro/nano + KOC. The best campaigns mix tiers.</div>`,
    `<span class="eyebrow">CSB201 · Chương 1 · Bài 1.1</span>
<h2>Ai là ai: celebrity, KOL &amp; influencer</h2>
<h3>Ba khái niệm chồng lấn</h3>
<ul>
<li><strong>Celebrity (người nổi tiếng)</strong> — nổi tiếng <em>trước</em> (diễn viên, vận động viên, ca sĩ); danh tiếng đến từ ngoài mạng xã hội. VD Cristiano Ronaldo, Sơn Tùng M-TP.</li>
<li><strong>KOL (Key Opinion Leader)</strong> — chuyên gia có ý kiến nặng ký trong một lĩnh vực (bác sĩ, đầu bếp, reviewer công nghệ). Quyền uy đến từ <em>chuyên môn</em>.</li>
<li><strong>Influencer</strong> — nổi tiếng <em>nhờ</em> mạng xã hội; xây khán giả bằng cách đăng bài. Quyền uy đến từ <em>mối quan hệ</em> với người theo dõi.</li>
</ul>
<h3>Phân bậc theo lượng khán giả</h3>
<pre><code>Nano    1K – 10K     engagement cao nhất, siêu ngách, rẻ
Micro   10K – 100K   độ tin mạnh, vẫn phải chăng
Macro   100K – 1M    phủ rộng, bán chuyên
Mega    1M+          cỡ người nổi tiếng, phủ đại chúng, đắt
</code></pre>
<p>Quy tắc kinh nghiệm: <strong>tỉ lệ tương tác giảm khi khán giả tăng</strong>. Một nano-creator thường chuyển đổi tốt hơn ngôi sao mega tính trên mỗi follower, vì khán giả thấy được "quen mặt".</p>
<h3>KOL vs KOC</h3>
<p><strong>KOC (Key Opinion Consumer)</strong> là người mua bình thường review sản phẩm thật lòng — phủ nhỏ hơn, nhưng được đọc như một người ngang hàng chứ không phải quảng cáo. Ở Việt Nam, các reviewer TikTok như <em>Call Me Duy</em> hay người bán livestream như <em>Võ Hà Linh</em> cho thấy nội dung kiểu KOC đẩy doanh số mạnh hơn một celebrity xa cách.</p>
<div class="callout"><span class="badge">Chọn theo mục tiêu</span> Nhận biết → macro/mega để phủ. Niềm tin &amp; chuyển đổi → micro/nano + KOC. Chiến dịch tốt nhất trộn nhiều bậc.</div>`,
  ]]);

const c1q = quiz('csb201-quiz-1', 'Quiz 1 — Who is who|||Quiz 1 — Ai là ai', [
  { id: 'q1', question: 'Điểm khác cốt lõi giữa "celebrity" và "influencer"?', options: ['Không có gì khác', 'Celebrity nổi tiếng từ ngoài MXH; influencer nổi nhờ chính MXH', 'Influencer luôn nhiều follower hơn', 'Celebrity không được nhận tài trợ'], correctIndex: 1, explanation: 'Celebrity nổi tiếng trước/ngoài MXH; influencer xây khán giả BẰNG việc đăng nội dung.' },
  { id: 'q2', question: 'Một nhà sáng tạo có 30.000 follower thuộc bậc nào?', options: ['Nano', 'Micro', 'Macro', 'Mega'], correctIndex: 1, explanation: 'Micro ≈ 10K–100K; độ tin cao mà chi phí còn phải chăng.' },
  { id: 'q3', question: 'KOC (Key Opinion Consumer) khác KOL ở chỗ?', options: ['Là người mua bình thường review thật, được đọc như người ngang hàng', 'Luôn là chuyên gia có bằng cấp', 'Chỉ xuất hiện trên truyền hình', 'Không bao giờ bán hàng'], correctIndex: 0, explanation: 'KOC là người tiêu dùng review sản phẩm; nội dung đọc như bạn bè, không như quảng cáo.' },
]);

const c2 = doc('csb201-2-1-why', '2.1 — Why influencers persuade|||2.1 — Vì sao influencer thuyết phục',
  'Ba cơ chế: source credibility (uy tín nguồn), meaning transfer (chuyển nghĩa), parasocial relationship (quan hệ cận xã hội).',
  [[
    `<span class="eyebrow">CSB201 · Chapter 2 · Lesson 2.1</span>
<h2>Why their word moves buyers</h2>
<h3>1) Source credibility</h3>
<p>People believe a message more when the source is <strong>trustworthy, expert and attractive</strong> (the classic Hovland source-credibility model). A dermatologist reviewing sunscreen is <em>expert</em>; a friend-like creator is <em>trustworthy</em>. Credibility, not fame alone, is what transfers.</p>
<h3>2) Meaning transfer</h3>
<p>McCracken's <strong>meaning-transfer model</strong>: a celebrity carries cultural meanings (cool, athletic, luxurious) that flow into the brand, then to the consumer who buys it. Nike didn't just rent Michael Jordan's face — it rented "excellence" and "winning", which became part of the shoe.</p>
<h3>3) Parasocial relationships</h3>
<p>Followers form a <strong>one-sided sense of friendship</strong> with a creator they watch daily (Horton &amp; Wohl's "parasocial" idea). It feels like a personal recommendation from a friend — which is why a micro-creator's "I actually use this" beats a polished TV spot.</p>
<pre><code>Source credibility  -> "I believe this person"
Meaning transfer    -> "This brand means what they mean"
Parasocial trust    -> "A friend told me to buy it"
</code></pre>
<div class="callout"><span class="badge">Example</span> Dove's "Real Beauty" used relatable, non-celebrity women — high credibility + parasocial warmth — to sell trust rather than glamour.</div>`,
    `<span class="eyebrow">CSB201 · Chương 2 · Bài 2.1</span>
<h2>Vì sao lời họ lay chuyển người mua</h2>
<h3>1) Uy tín nguồn (source credibility)</h3>
<p>Người ta tin thông điệp hơn khi nguồn <strong>đáng tin, có chuyên môn và cuốn hút</strong> (mô hình uy tín nguồn cổ điển của Hovland). Một bác sĩ da liễu review kem chống nắng là <em>chuyên môn</em>; một creator thân thiện như bạn bè là <em>đáng tin</em>. Thứ chuyển giao là uy tín, không phải mỗi danh tiếng.</p>
<h3>2) Chuyển nghĩa (meaning transfer)</h3>
<p><strong>Mô hình chuyển nghĩa</strong> của McCracken: người nổi tiếng mang những ý nghĩa văn hoá (ngầu, thể thao, sang) chảy vào thương hiệu, rồi tới người tiêu dùng khi họ mua. Nike không chỉ thuê gương mặt Michael Jordan — họ thuê "sự xuất sắc" và "chiến thắng", biến nó thành một phần của đôi giày.</p>
<h3>3) Quan hệ cận xã hội (parasocial)</h3>
<p>Người theo dõi hình thành <strong>cảm giác thân thiết một chiều</strong> với creator họ xem hằng ngày (khái niệm "parasocial" của Horton &amp; Wohl). Nó như một lời khuyên cá nhân từ bạn bè — nên câu "tôi thật sự đang dùng cái này" của một micro-creator thắng cả một TVC bóng bẩy.</p>
<pre><code>Uy tín nguồn      -> "Tôi tin người này"
Chuyển nghĩa      -> "Thương hiệu này mang nghĩa họ mang"
Niềm tin cận XH   -> "Một người bạn bảo tôi mua"
</code></pre>
<div class="callout"><span class="badge">Ví dụ</span> Chiến dịch "Real Beauty" của Dove dùng những phụ nữ đời thường, không nổi tiếng — uy tín cao + sự ấm áp cận xã hội — để bán niềm tin thay vì hào nhoáng.</div>`,
  ]]);

const c2q = quiz('csb201-quiz-2', 'Quiz 2 — Why it works|||Quiz 2 — Vì sao hiệu quả', [
  { id: 'q1', question: 'Mô hình "meaning transfer" (McCracken) mô tả điều gì?', options: ['Người nổi tiếng chuyển ý nghĩa văn hoá sang thương hiệu rồi tới người mua', 'Chuyển tiền cho influencer', 'Chuyển follower giữa các tài khoản', 'Dịch nội dung sang ngôn ngữ khác'], correctIndex: 0, explanation: 'Ý nghĩa (ngầu, sang, thắng cuộc) chảy từ celebrity → thương hiệu → người tiêu dùng.' },
  { id: 'q2', question: 'Ba yếu tố của "source credibility" theo Hovland là?', options: ['Giá, khuyến mãi, bao bì', 'Đáng tin, chuyên môn, cuốn hút', 'Reach, engagement, ROI', 'Nano, micro, macro'], correctIndex: 1, explanation: 'Uy tín nguồn gồm trustworthiness, expertise và attractiveness.' },
  { id: 'q3', question: 'Vì sao lời "tôi thật sự dùng cái này" của micro-creator lại mạnh?', options: ['Vì họ có nhiều follower nhất', 'Vì quan hệ cận xã hội khiến nó như lời khuyên của bạn bè', 'Vì luôn rẻ hơn TVC', 'Vì thuật toán ép hiển thị'], correctIndex: 1, explanation: 'Parasocial relationship tạo cảm giác thân thiết một chiều → như bạn bè giới thiệu.' },
]);

const c3 = doc('csb201-3-1-choosing', '3.1 — Choosing the right influencer|||3.1 — Chọn influencer phù hợp',
  'Ba bộ lọc: brand fit (hợp giá trị/hình ảnh), audience match (khớp khán giả mục tiêu), engagement thật vs ảo (soi follower ảo).',
  [[
    `<span class="eyebrow">CSB201 · Chapter 3 · Lesson 3.1</span>
<h2>Choosing the right influencer</h2>
<h3>Fit before followers</h3>
<p>The biggest account is rarely the right one. Screen on three filters:</p>
<ul>
<li><strong>Brand fit</strong> — do their values, tone and past posts match the brand? A luxury watch beside a rowdy prank channel damages both.</li>
<li><strong>Audience match</strong> — is <em>their</em> audience <em>your</em> customer (age, location, interest)? Reach is useless if it's the wrong people.</li>
<li><strong>Real engagement</strong> — are likes/comments genuine, or bought?</li>
</ul>
<h3>Reading engagement honestly</h3>
<pre><code>Engagement rate = (likes + comments) / followers x 100%
Healthy micro range ~ 3-8%
Red flags: <1% ER on a big account, generic "nice!" comments,
follower spikes overnight, audience in unrelated countries
</code></pre>
<p>Tools like <strong>HypeAuditor</strong> estimate fake-follower share and audience geography — check before you pay.</p>
<h3>Fit failure — a classic</h3>
<p>The 2017 <strong>Pepsi + Kendall Jenner</strong> ad is a fit disaster: a mega-celebrity with no credibility on protest was dropped into a social-justice theme. Wrong meaning, wrong messenger — pulled within a day.</p>
<div class="callout"><span class="badge">Checklist</span> Values match? Audience overlap? Engagement real? Past brand safety clean? Only then talk price.</div>`,
    `<span class="eyebrow">CSB201 · Chương 3 · Bài 3.1</span>
<h2>Chọn influencer phù hợp</h2>
<h3>Hợp trước, follower sau</h3>
<p>Tài khoản lớn nhất hiếm khi là đúng nhất. Sàng lọc qua ba bộ lọc:</p>
<ul>
<li><strong>Hợp thương hiệu (brand fit)</strong> — giá trị, giọng điệu và bài cũ của họ có khớp thương hiệu? Một chiếc đồng hồ sang cạnh kênh prank ồn ào làm hại cả hai.</li>
<li><strong>Khớp khán giả (audience match)</strong> — khán giả của <em>họ</em> có phải khách của <em>bạn</em> (tuổi, nơi ở, sở thích)? Phủ rộng vô ích nếu sai người.</li>
<li><strong>Tương tác thật</strong> — like/comment là thật hay mua?</li>
</ul>
<h3>Đọc engagement một cách trung thực</h3>
<pre><code>Tỉ lệ tương tác = (like + comment) / follower x 100%
Micro khoẻ mạnh ~ 3-8%
Cờ đỏ: ER <1% trên tài khoản lớn, comment chung chung "đẹp quá!",
follower tăng vọt qua đêm, khán giả ở nước không liên quan
</code></pre>
<p>Công cụ như <strong>HypeAuditor</strong> ước lượng tỉ lệ follower ảo và địa lý khán giả — hãy soi trước khi chi tiền.</p>
<h3>Sai "fit" — một ca kinh điển</h3>
<p>Quảng cáo <strong>Pepsi + Kendall Jenner</strong> năm 2017 là thảm hoạ về fit: một mega-celebrity không có uy tín gì về đấu tranh xã hội bị đặt vào chủ đề công bằng xã hội. Sai nghĩa, sai người truyền tin — bị gỡ trong vòng một ngày.</p>
<div class="callout"><span class="badge">Bảng kiểm</span> Hợp giá trị? Trùng khán giả? Tương tác thật? Lịch sử brand safety sạch? Rồi mới bàn giá.</div>`,
  ]]);

const c3q = quiz('csb201-quiz-3', 'Quiz 3 — Choosing|||Quiz 3 — Chọn người', [
  { id: 'q1', question: 'Vì sao "audience match" quan trọng hơn con số follower thô?', options: ['Vì follower nhiều luôn xấu', 'Vì reach chỉ có giá trị khi đúng nhóm khách mục tiêu', 'Vì thuật toán ghét tài khoản lớn', 'Vì follower ít thì rẻ hơn'], correctIndex: 1, explanation: 'Phủ rộng vô nghĩa nếu khán giả không phải khách hàng của bạn (tuổi/nơi ở/sở thích).' },
  { id: 'q2', question: 'Dấu hiệu nào gợi ý follower/engagement ẢO?', options: ['ER 5% với comment cụ thể', 'Follower tăng vọt qua đêm, comment chung chung, khán giả ở nước không liên quan', 'Bài đăng đều đặn', 'Có tick xanh'], correctIndex: 1, explanation: 'Tăng đột biến + comment sáo rỗng + địa lý lệch là cờ đỏ của follower mua.' },
  { id: 'q3', question: 'Bài học từ quảng cáo Pepsi + Kendall Jenner (2017)?', options: ['Càng nổi tiếng càng an toàn', 'Sai "fit" giữa người truyền tin và thông điệp gây phản tác dụng', 'Nên dùng nhiều celebrity cùng lúc', 'Không cần đo brand fit'], correctIndex: 1, explanation: 'Người nổi tiếng không có uy tín về chủ đề + thông điệp nhạy cảm → phản ứng ngược, bị gỡ.' },
]);

const c4 = doc('csb201-4-1-campaign', '4.1 — Running an influencer campaign|||4.1 — Chạy chiến dịch influencer',
  'Brief & deliverables; bốn kiểu hợp tác: gifting (tặng sản phẩm), paid (trả phí), affiliate (hoa hồng), ambassador (đại sứ dài hạn).',
  [[
    `<span class="eyebrow">CSB201 · Chapter 4 · Lesson 4.1</span>
<h2>Running an influencer campaign</h2>
<h3>The brief</h3>
<p>A good <strong>brief</strong> gives creative freedom inside clear guardrails: goal, key message, must-say/must-not-say, hashtags &amp; disclosure, timeline, and <strong>deliverables</strong> (e.g. "2 Reels + 3 Stories + 1 static post, usage rights 90 days").</p>
<h3>Four deal types</h3>
<ul>
<li><strong>Gifting</strong> — send free product, hope for an organic post. Cheap, low control, good for seeding many nano/micro creators.</li>
<li><strong>Paid</strong> — a fixed fee for defined deliverables. Predictable, full control of timing/message.</li>
<li><strong>Affiliate</strong> — commission per sale via a unique code/link. Pay-for-performance; ties spend to revenue.</li>
<li><strong>Ambassador</strong> — a long-term partnership (months/years). Deepest trust; the creator becomes associated with the brand.</li>
</ul>
<pre><code>Gifting     -> awareness / seeding, low cost
Paid        -> control &amp; guaranteed output
Affiliate   -> conversions, measurable ROI
Ambassador  -> lasting brand association
</code></pre>
<h3>Examples</h3>
<p><strong>Daniel Wellington</strong> grew globally on gifting + affiliate codes with thousands of micro-creators. <strong>Gymshark</strong> built a fitness empire on long-term <em>ambassadors</em> ("Gymshark athletes").</p>
<div class="callout"><span class="badge">Mix deals</span> Seed widely with gifting, pay for hero content, drive sales with affiliate codes, and lock in a few ambassadors for continuity.</div>`,
    `<span class="eyebrow">CSB201 · Chương 4 · Bài 4.1</span>
<h2>Chạy chiến dịch influencer</h2>
<h3>Bản brief</h3>
<p>Một <strong>brief</strong> tốt cho tự do sáng tạo trong khung rõ ràng: mục tiêu, thông điệp chính, điều phải nói/không được nói, hashtag &amp; công bố tài trợ, thời hạn, và <strong>deliverables</strong> (vd "2 Reels + 3 Stories + 1 bài tĩnh, quyền sử dụng 90 ngày").</p>
<h3>Bốn kiểu hợp tác</h3>
<ul>
<li><strong>Gifting (tặng quà)</strong> — gửi sản phẩm miễn phí, mong một bài tự nhiên. Rẻ, ít kiểm soát, hợp để gieo nhiều nano/micro creator.</li>
<li><strong>Paid (trả phí)</strong> — phí cố định cho deliverables đã định. Dễ đoán, kiểm soát trọn thời điểm/thông điệp.</li>
<li><strong>Affiliate (hoa hồng)</strong> — hoa hồng mỗi đơn qua mã/link riêng. Trả theo hiệu quả; buộc chi phí vào doanh thu.</li>
<li><strong>Ambassador (đại sứ)</strong> — hợp tác dài hạn (tháng/năm). Niềm tin sâu nhất; creator gắn liền với thương hiệu.</li>
</ul>
<pre><code>Gifting     -> nhận biết / gieo hạt, chi phí thấp
Paid        -> kiểm soát &amp; đầu ra bảo đảm
Affiliate   -> chuyển đổi, ROI đo được
Ambassador  -> gắn kết thương hiệu lâu dài
</code></pre>
<h3>Ví dụ</h3>
<p><strong>Daniel Wellington</strong> lớn mạnh toàn cầu nhờ gifting + mã affiliate với hàng nghìn micro-creator. <strong>Gymshark</strong> dựng đế chế thể hình bằng các <em>ambassador</em> dài hạn ("Gymshark athletes").</p>
<div class="callout"><span class="badge">Trộn các kiểu</span> Gieo rộng bằng gifting, trả phí cho nội dung "hero", đẩy doanh số bằng mã affiliate, và khoá vài ambassador để duy trì liên tục.</div>`,
  ]]);

const c4q = quiz('csb201-quiz-4', 'Quiz 4 — Campaign|||Quiz 4 — Chiến dịch', [
  { id: 'q1', question: 'Kiểu hợp tác nào trả theo HIỆU QUẢ (hoa hồng mỗi đơn qua mã riêng)?', options: ['Gifting', 'Paid', 'Affiliate', 'Ambassador'], correctIndex: 2, explanation: 'Affiliate = hoa hồng theo đơn, buộc chi phí vào doanh thu, ROI đo được.' },
  { id: 'q2', question: 'Một bản "brief" tốt nên gồm gì?', options: ['Chỉ số tiền trả', 'Mục tiêu, thông điệp chính, điều phải/không được nói, hashtag & công bố, deliverables', 'Chỉ danh sách hashtag', 'Chỉ hạn chót'], correctIndex: 1, explanation: 'Brief cho tự do sáng tạo trong khung rõ ràng + liệt kê deliverables cụ thể.' },
  { id: 'q3', question: 'Hợp tác kiểu "ambassador" đặc trưng bởi?', options: ['Một bài đăng duy nhất', 'Chỉ tặng sản phẩm miễn phí', 'Quan hệ dài hạn, creator gắn liền với thương hiệu', 'Không có hợp đồng'], correctIndex: 2, explanation: 'Ambassador là hợp tác dài hạn (tháng/năm), tạo niềm tin và gắn kết sâu nhất.' },
]);

const c5 = doc('csb201-5-1-content', '5.1 — Content & co-creation|||5.1 — Nội dung & đồng sáng tạo',
  'Đồng sáng tạo (creator giữ giọng riêng); tính chân thực (authenticity) là tài sản; brand safety — bảo vệ thương hiệu khỏi nội dung/ngữ cảnh rủi ro.',
  [[
    `<span class="eyebrow">CSB201 · Chapter 5 · Lesson 5.1</span>
<h2>Content &amp; co-creation</h2>
<h3>Co-creation beats dictation</h3>
<p>The creator knows their audience's language better than the brand does. <strong>Co-creation</strong> means agreeing the message, then letting the creator write it in <em>their</em> voice. Over-scripted, ad-like posts get ignored; native-feeling posts convert.</p>
<h3>Authenticity is the asset</h3>
<p>Audiences reward honesty — including honest limits ("this isn't for oily skin"). A creator who only ever gushes loses credibility, and with it the value the brand paid for. Protect authenticity even when it means a less glowing post.</p>
<h3>Brand safety</h3>
<p><strong>Brand safety</strong> = keeping the brand away from content or context that could damage it. Two directions:</p>
<ul>
<li><strong>Creator-side</strong> — vet past posts, values, controversies before signing.</li>
<li><strong>Context-side</strong> — control where the content sits (avoid pairing with hate/violence/misinformation).</li>
</ul>
<pre><code>Co-creation   -> brand sets message, creator sets voice
Authenticity  -> honest, incl. honest limits
Brand safety  -> vet the creator + control the context
</code></pre>
<div class="callout"><span class="badge">Example</span> GoPro thrives on user &amp; athlete co-created footage — the brand supplies the camera and the frame; creators supply the authentic thrill.</div>`,
    `<span class="eyebrow">CSB201 · Chương 5 · Bài 5.1</span>
<h2>Nội dung &amp; đồng sáng tạo</h2>
<h3>Đồng sáng tạo thắng ra lệnh</h3>
<p>Creator hiểu ngôn ngữ của khán giả họ hơn thương hiệu. <strong>Đồng sáng tạo (co-creation)</strong> nghĩa là thống nhất thông điệp, rồi để creator viết bằng giọng của <em>họ</em>. Bài quá kịch bản, giống quảng cáo thì bị lướt qua; bài tự nhiên thì chuyển đổi.</p>
<h3>Tính chân thực là tài sản</h3>
<p>Khán giả thưởng cho sự trung thực — kể cả giới hạn trung thực ("cái này không hợp da dầu"). Creator lúc nào cũng khen lấy khen để sẽ mất uy tín, kéo theo mất luôn giá trị thương hiệu đã trả. Hãy bảo vệ tính chân thực dù đôi khi bài viết bớt long lanh.</p>
<h3>Brand safety (an toàn thương hiệu)</h3>
<p><strong>Brand safety</strong> = giữ thương hiệu tránh xa nội dung hoặc ngữ cảnh có thể làm tổn hại nó. Hai hướng:</p>
<ul>
<li><strong>Phía creator</strong> — soi bài cũ, giá trị, lùm xùm trước khi ký.</li>
<li><strong>Phía ngữ cảnh</strong> — kiểm soát nơi nội dung xuất hiện (tránh đứng cạnh thù ghét/bạo lực/tin giả).</li>
</ul>
<pre><code>Đồng sáng tạo -> thương hiệu đặt thông điệp, creator đặt giọng
Chân thực     -> trung thực, kể cả giới hạn
Brand safety  -> soi creator + kiểm soát ngữ cảnh
</code></pre>
<div class="callout"><span class="badge">Ví dụ</span> GoPro sống nhờ cảnh quay do người dùng &amp; vận động viên đồng sáng tạo — thương hiệu cấp máy quay và khung, creator cấp cảm giác phấn khích chân thật.</div>`,
  ]]);

const c5q = quiz('csb201-quiz-5', 'Quiz 5 — Content|||Quiz 5 — Nội dung', [
  { id: 'q1', question: 'Vì sao "đồng sáng tạo" thường hiệu quả hơn kịch bản cứng?', options: ['Vì rẻ hơn', 'Vì creator hiểu ngôn ngữ khán giả của họ, bài tự nhiên chuyển đổi tốt hơn', 'Vì thương hiệu không cần thông điệp', 'Vì thuật toán ưu tiên video dài'], correctIndex: 1, explanation: 'Brand đặt thông điệp, creator đặt giọng → nội dung native, ít bị lướt qua.' },
  { id: 'q2', question: '"Brand safety" nghĩa là gì?', options: ['Bảo mật mật khẩu tài khoản', 'Giữ thương hiệu tránh xa nội dung/ngữ cảnh gây tổn hại', 'Chạy quảng cáo giá rẻ', 'Tăng follower nhanh'], correctIndex: 1, explanation: 'Brand safety = soi creator + kiểm soát ngữ cảnh để thương hiệu không đứng cạnh nội dung độc hại.' },
  { id: 'q3', question: 'Vì sao creator "lúc nào cũng khen" lại hại thương hiệu?', options: ['Vì mất tính chân thực và uy tín — thứ thương hiệu đã trả tiền để mua', 'Vì vi phạm bản quyền', 'Vì tốn nhiều dung lượng', 'Vì thuật toán phạt'], correctIndex: 0, explanation: 'Authenticity là tài sản; khen mù quáng làm sụt uy tín, kéo theo giá trị chiến dịch.' },
]);

const c6 = doc('csb201-6-1-measure', '6.1 — Measuring performance|||6.1 — Đo lường hiệu quả',
  'Thang đo từ nhận biết đến doanh thu: reach/impressions, engagement rate, EMV (earned media value), conversion (mã/UTM), và ROI.',
  [[
    `<span class="eyebrow">CSB201 · Chapter 6 · Lesson 6.1</span>
<h2>Measuring performance</h2>
<h3>The metric ladder</h3>
<ul>
<li><strong>Reach / impressions</strong> — how many people saw it (awareness).</li>
<li><strong>Engagement rate</strong> — likes + comments + shares + saves ÷ reach (resonance).</li>
<li><strong>EMV (Earned Media Value)</strong> — an <em>estimate</em> of what the organic exposure would have cost as paid media. Useful for comparison, but it's a modelled number, not cash.</li>
<li><strong>Conversion</strong> — clicks, sign-ups, sales tied to a <strong>unique promo code or UTM link</strong>.</li>
<li><strong>ROI</strong> — revenue attributed ÷ campaign cost.</li>
</ul>
<pre><code>ROI = (revenue attributed - cost) / cost x 100%
Attribute conversions with:
  - unique discount codes per creator
  - UTM-tagged links
  - "how did you hear about us?" prompts
</code></pre>
<h3>Match the metric to the goal</h3>
<p>An <strong>awareness</strong> campaign is judged on reach + engagement; a <strong>performance</strong> campaign on conversion + ROI. Judging a nano seeding push on raw reach — or a sales push on likes — leads to the wrong conclusion.</p>
<div class="callout"><span class="badge">Watch out</span> Engagement can be vanity. A viral post with zero sales failed a performance brief. Always tie spend to a trackable action.</div>`,
    `<span class="eyebrow">CSB201 · Chương 6 · Bài 6.1</span>
<h2>Đo lường hiệu quả</h2>
<h3>Thang đo</h3>
<ul>
<li><strong>Reach / impressions</strong> — bao nhiêu người đã thấy (nhận biết).</li>
<li><strong>Engagement rate</strong> — like + comment + share + save ÷ reach (độ cộng hưởng).</li>
<li><strong>EMV (Earned Media Value)</strong> — <em>ước lượng</em> số tiền mà mức lan toả tự nhiên đó đáng giá nếu mua bằng quảng cáo trả phí. Hữu ích để so sánh, nhưng là con số mô hình hoá, không phải tiền mặt.</li>
<li><strong>Conversion (chuyển đổi)</strong> — click, đăng ký, đơn hàng gắn với <strong>mã khuyến mãi hoặc link UTM riêng</strong>.</li>
<li><strong>ROI</strong> — doanh thu quy cho chiến dịch ÷ chi phí.</li>
</ul>
<pre><code>ROI = (doanh thu quy cho - chi phí) / chi phí x 100%
Quy chuyển đổi bằng:
  - mã giảm giá riêng cho từng creator
  - link gắn thẻ UTM
  - câu hỏi "bạn biết đến chúng tôi từ đâu?"
</code></pre>
<h3>Khớp thước đo với mục tiêu</h3>
<p>Chiến dịch <strong>nhận biết</strong> chấm theo reach + engagement; chiến dịch <strong>hiệu suất</strong> chấm theo conversion + ROI. Chấm một đợt gieo nano bằng reach thô — hay chấm một đợt bán hàng bằng like — sẽ dẫn tới kết luận sai.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Engagement có thể là "phù phiếm". Một bài viral nhưng không có đơn nào là đã trượt brief hiệu suất. Luôn buộc chi phí vào một hành động đo được.</div>`,
  ]]);

const c6q = quiz('csb201-quiz-6', 'Quiz 6 — Measurement|||Quiz 6 — Đo lường', [
  { id: 'q1', question: 'EMV (Earned Media Value) thực chất là?', options: ['Số tiền mặt influencer nhận', 'Ước lượng giá trị lan toả tự nhiên nếu mua bằng quảng cáo trả phí', 'Số follower mới', 'Doanh thu thực đã chốt'], correctIndex: 1, explanation: 'EMV là con số MÔ HÌNH HOÁ để so sánh, không phải tiền mặt hay doanh thu thật.' },
  { id: 'q2', question: 'Cách quy chuyển đổi (conversion) cho từng creator?', options: ['Đếm like', 'Mã giảm giá riêng hoặc link gắn UTM cho từng người', 'Đoán theo cảm tính', 'Đo số story'], correctIndex: 1, explanation: 'Mã khuyến mãi/UTM riêng gắn doanh số về đúng creator → đo được ROI.' },
  { id: 'q3', question: 'Một chiến dịch HIỆU SUẤT (bán hàng) nên chấm chủ yếu bằng?', options: ['Reach thô', 'Số like', 'Conversion và ROI', 'Số hashtag'], correctIndex: 2, explanation: 'Khớp thước đo với mục tiêu: bán hàng → conversion + ROI, không phải reach/like.' },
]);

const c7 = doc('csb201-7-1-risk', '7.1 — Risk, ethics & disclosure|||7.1 — Rủi ro, đạo đức & công bố tài trợ',
  'Khủng hoảng influencer; follower/engagement ảo; công bố tài trợ theo FTC (#ad); minh bạch để giữ niềm tin — ca Fyre Festival.',
  [[
    `<span class="eyebrow">CSB201 · Chapter 7 · Lesson 7.1</span>
<h2>Risk, ethics &amp; disclosure</h2>
<h3>Influencer crises</h3>
<p>A brand tied to a creator inherits their scandals. Plan for it: a <strong>morality/behaviour clause</strong> in the contract, a monitoring plan, and a pre-agreed response (pause, statement, or cut ties). Speed and honesty limit the damage.</p>
<h3>Fake followers &amp; bought engagement</h3>
<p>Paying for reach that isn't real wastes budget and, once exposed, damages trust. Audit audience quality (Ch.3) <em>before</em> signing, and again during the campaign.</p>
<h3>Disclosure — the law, not a suggestion</h3>
<p>The US <strong>FTC</strong> requires sponsored content to be <strong>clearly disclosed</strong> — a visible "#ad" / "Paid partnership", not a buried tag. Many countries (and Vietnam's advertising rules) require the same. Non-disclosure is deceptive and increasingly penalised.</p>
<pre><code>Disclosure done right:
  - clear word ("Ad" / "Paid partnership"), up front
  - visible without tapping "more"
  - in the same language as the post
Not enough: "#sp" buried in 30 hashtags
</code></pre>
<h3>The cautionary tale</h3>
<p><strong>Fyre Festival</strong> (2017): top influencers posted a mysterious orange tile with <em>no</em> disclosure; the event was a fraud. It became the textbook case for why undisclosed, unvetted promotion is both unethical and dangerous.</p>
<div class="callout"><span class="badge">Ethics = durability</span> Transparency isn't a tax on performance — it's what keeps the audience's trust, which is the entire asset being rented.</div>`,
    `<span class="eyebrow">CSB201 · Chương 7 · Bài 7.1</span>
<h2>Rủi ro, đạo đức &amp; công bố tài trợ</h2>
<h3>Khủng hoảng influencer</h3>
<p>Thương hiệu gắn với một creator sẽ thừa hưởng cả scandal của họ. Hãy dự phòng: một <strong>điều khoản đạo đức/hành vi</strong> trong hợp đồng, kế hoạch giám sát, và phản ứng đã thống nhất trước (tạm dừng, ra thông cáo, hoặc cắt hợp tác). Nhanh và trung thực sẽ giảm thiệt hại.</p>
<h3>Follower ảo &amp; tương tác mua</h3>
<p>Trả tiền cho lượng phủ không có thật vừa phí ngân sách, vừa làm sụt niềm tin khi bị phát hiện. Hãy soi chất lượng khán giả (Ch.3) <em>trước</em> khi ký, và soi lại trong lúc chạy.</p>
<h3>Công bố tài trợ — là luật, không phải gợi ý</h3>
<p><strong>FTC</strong> (Mỹ) yêu cầu nội dung tài trợ phải được <strong>công bố rõ ràng</strong> — một dòng "#ad" / "Hợp tác trả phí" dễ thấy, không phải một thẻ giấu kín. Nhiều nước (và quy định quảng cáo của Việt Nam) cũng yêu cầu tương tự. Không công bố là lừa dối và ngày càng bị phạt.</p>
<pre><code>Công bố đúng cách:
  - từ ngữ rõ ("Quảng cáo" / "Hợp tác trả phí"), ở đầu
  - thấy được mà không cần bấm "xem thêm"
  - cùng ngôn ngữ với bài đăng
Chưa đủ: "#sp" giấu trong 30 hashtag
</code></pre>
<h3>Bài học cảnh tỉnh</h3>
<p><strong>Fyre Festival</strong> (2017): loạt influencer hàng đầu đăng một ô màu cam bí ẩn mà <em>không</em> công bố tài trợ; sự kiện là một cú lừa. Nó trở thành ca kinh điển cho thấy quảng bá không công bố, không thẩm định là vừa vô đạo đức vừa nguy hiểm.</p>
<div class="callout"><span class="badge">Đạo đức = bền vững</span> Minh bạch không phải khoản thuế đánh vào hiệu suất — nó là thứ giữ niềm tin của khán giả, mà niềm tin chính là toàn bộ tài sản đang được thuê.</div>`,
  ]]);

const c7q = quiz('csb201-quiz-7', 'Quiz 7 — Risk & ethics|||Quiz 7 — Rủi ro & đạo đức', [
  { id: 'q1', question: 'Theo FTC, công bố tài trợ đúng cách là?', options: ['Giấu "#sp" trong 30 hashtag cuối', 'Dòng rõ ràng ("Quảng cáo"/"Hợp tác trả phí") dễ thấy, đặt ở đầu', 'Không cần công bố nếu là quà tặng', 'Chỉ nói khi có người hỏi'], correctIndex: 1, explanation: 'Công bố phải rõ, thấy ngay không cần bấm "xem thêm", cùng ngôn ngữ bài đăng.' },
  { id: 'q2', question: 'Điều khoản nào trong hợp đồng giúp phòng khủng hoảng scandal của creator?', options: ['Điều khoản đạo đức/hành vi + phản ứng thống nhất trước', 'Điều khoản giảm giá', 'Điều khoản độc quyền hashtag', 'Không cần điều khoản nào'], correctIndex: 0, explanation: 'Morality/behaviour clause + kế hoạch giám sát + phản ứng có sẵn giới hạn thiệt hại.' },
  { id: 'q3', question: 'Vì sao Fyre Festival (2017) là ca kinh điển về đạo đức influencer?', options: ['Vì có quá nhiều nano-creator', 'Vì loạt influencer quảng bá không công bố tài trợ cho một sự kiện lừa đảo', 'Vì dùng affiliate', 'Vì đo ROI sai'], correctIndex: 1, explanation: 'Quảng bá không công bố + không thẩm định cho một cú lừa → bài học về minh bạch và brand safety.' },
]);

const c8 = doc('csb201-8-1-trends', '8.1 — Trends: creator economy & beyond|||8.1 — Xu hướng: creator economy & hơn nữa',
  'Creator economy (nhà sáng tạo là doanh nghiệp một người); live commerce (bán qua livestream); virtual influencer; và AI trong sáng tạo/ghép nội dung.',
  [[
    `<span class="eyebrow">CSB201 · Chapter 8 · Lesson 8.1</span>
<h2>Trends: the creator economy &amp; beyond</h2>
<h3>The creator economy</h3>
<p>Creators are now <strong>one-person businesses</strong> with multiple income streams — brand deals, subscriptions, merch, affiliate, their own products. Brands increasingly treat them as partners and channels, not just ad space.</p>
<h3>Live commerce</h3>
<p><strong>Live commerce</strong> merges entertainment and shopping: a host demos products live and viewers buy in one tap (huge on Douyin/Taobao, and on TikTok Shop). In Vietnam, marathon livestream sales by creators like <em>Võ Hà Linh</em> have moved enormous volumes in a single session.</p>
<h3>Virtual &amp; AI influencers</h3>
<ul>
<li><strong>Virtual influencers</strong> — CGI characters with real followings (e.g. <em>Lil Miquela</em>). Total brand control, no scandal risk from a human — but authenticity questions remain.</li>
<li><strong>AI</strong> — AI-generated personas (e.g. <em>Aitana Lopez</em>) and AI tools for scripting, editing and translation are lowering the cost of content and raising new disclosure questions ("is this a real person?").</li>
</ul>
<pre><code>Creator economy   -> creators as businesses &amp; partners
Live commerce     -> watch + buy in one tap
Virtual influencer-> full control, authenticity debate
AI                 -> cheaper content, new disclosure duties
</code></pre>
<div class="callout"><span class="badge">Where it's going</span> More granular (nano/KOC), more shoppable (live commerce), and more synthetic (virtual/AI). The constant is trust — the tools change, the reason people buy does not.</div>`,
    `<span class="eyebrow">CSB201 · Chương 8 · Bài 8.1</span>
<h2>Xu hướng: creator economy &amp; hơn nữa</h2>
<h3>Creator economy</h3>
<p>Nhà sáng tạo giờ là <strong>doanh nghiệp một người</strong> với nhiều nguồn thu — hợp đồng thương hiệu, thuê bao, merch, affiliate, sản phẩm riêng. Thương hiệu ngày càng coi họ là đối tác và kênh, không chỉ là chỗ đặt quảng cáo.</p>
<h3>Live commerce</h3>
<p><strong>Live commerce</strong> hoà trộn giải trí và mua sắm: người dẫn demo sản phẩm trực tiếp, người xem mua chỉ bằng một chạm (bùng nổ trên Douyin/Taobao, và TikTok Shop). Ở Việt Nam, các phiên livestream bán hàng marathon của creator như <em>Võ Hà Linh</em> đã đẩy khối lượng khổng lồ chỉ trong một buổi.</p>
<h3>Virtual &amp; AI influencer</h3>
<ul>
<li><strong>Virtual influencer</strong> — nhân vật CGI có lượng follower thật (vd <em>Lil Miquela</em>). Thương hiệu kiểm soát trọn vẹn, không lo scandal từ con người — nhưng vẫn còn câu hỏi về tính chân thực.</li>
<li><strong>AI</strong> — nhân vật do AI tạo (vd <em>Aitana Lopez</em>) và công cụ AI viết kịch bản, dựng, dịch đang hạ chi phí nội dung và làm nảy câu hỏi công bố mới ("đây có phải người thật không?").</li>
</ul>
<pre><code>Creator economy   -> creator là doanh nghiệp &amp; đối tác
Live commerce     -> vừa xem vừa mua một chạm
Virtual influencer-> kiểm soát trọn, tranh luận chân thực
AI                 -> nội dung rẻ hơn, nghĩa vụ công bố mới
</code></pre>
<div class="callout"><span class="badge">Hướng đi</span> Chi tiết hơn (nano/KOC), mua được hơn (live commerce), và tổng hợp hơn (virtual/AI). Điều bất biến là niềm tin — công cụ đổi, còn lý do người ta mua thì không.</div>`,
  ]]);

const c8q = quiz('csb201-quiz-8', 'Quiz 8 — Trends|||Quiz 8 — Xu hướng', [
  { id: 'q1', question: '"Live commerce" là gì?', options: ['Quảng cáo truyền hình trực tiếp', 'Hoà trộn giải trí và mua sắm: xem demo trực tiếp rồi mua ngay trong một chạm', 'Bán hàng qua email', 'Đấu giá ngoại tuyến'], correctIndex: 1, explanation: 'Người dẫn demo live, người xem mua ngay — bùng nổ trên TikTok Shop/Douyin.' },
  { id: 'q2', question: 'Ưu điểm và tranh cãi của "virtual influencer" (vd Lil Miquela)?', options: ['Rẻ nhất và luôn thật', 'Thương hiệu kiểm soát trọn, không scandal từ người — nhưng gây tranh luận về tính chân thực', 'Không có follower', 'Chỉ dùng cho game'], correctIndex: 1, explanation: 'Nhân vật CGI cho kiểm soát tuyệt đối nhưng đặt ra câu hỏi authenticity và công bố.' },
  { id: 'q3', question: 'Trong "creator economy", thương hiệu nên coi nhà sáng tạo là?', options: ['Chỉ là chỗ đặt quảng cáo', 'Đối tác và kênh — doanh nghiệp một người với nhiều nguồn thu', 'Nhân viên toàn thời gian', 'Đối thủ cạnh tranh'], correctIndex: 1, explanation: 'Creator là doanh nghiệp một người (deal, thuê bao, merch, affiliate) → đối tác, không chỉ ad space.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'CSB201',
    slug: 'csb201-celebrity-social-media-influencers-and-brand-performance',
    title: 'Celebrity, Social Media Influencers and Brand Performance',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CSB201.webp',
    shortDescription: 'How brands work with influencers: nano→mega, KOL vs KOC, why they persuade, choosing the right fit, campaign types (gifting/paid/affiliate/ambassador), co-creation, measuring engagement/EMV/ROI, disclosure & ethics, and trends (live commerce, AI influencers).|||Thương hiệu hợp tác influencer thế nào: nano→mega, KOL vs KOC, vì sao thuyết phục, chọn đúng người, kiểu chiến dịch, đồng sáng tạo, đo engagement/EMV/ROI, minh bạch & đạo đức, xu hướng (live commerce, AI influencer).',
    description: 'Môn <strong>CSB201 — Celebrity, Social Media Influencers and Brands</strong> (kỳ 4, khối Công nghệ Truyền thông) dạy cách thương hiệu làm việc với người nổi tiếng, KOL và influencer. Từ <strong>định nghĩa &amp; phân bậc</strong> (nano→mega, KOL vs KOC) → <strong>vì sao thuyết phục</strong> (uy tín nguồn, chuyển nghĩa, quan hệ cận xã hội) → <strong>chọn người</strong> (brand fit, khớp khán giả, engagement thật/ảo) → <strong>chạy chiến dịch</strong> (brief, gifting/paid/affiliate/ambassador) → <strong>nội dung &amp; đồng sáng tạo</strong> → <strong>đo lường</strong> (reach, EMV, ROI) → <strong>rủi ro &amp; đạo đức</strong> (FTC, follower ảo) → <strong>xu hướng</strong> (creator economy, live commerce, virtual &amp; AI). Môn không có giáo trình FLM riêng nên khung dựng theo tài liệu chuẩn quốc tế; song ngữ, ví dụ chiến dịch thật và quiz mỗi chương.',
    whatYouLearn: 'Phân biệt celebrity/KOL/influencer và bậc nano/micro/macro/mega, KOL vs KOC; ba cơ chế thuyết phục (source credibility, meaning transfer, parasocial); chọn influencer theo brand fit + audience match + soi engagement ảo; viết brief và chọn kiểu hợp tác (gifting/paid/affiliate/ambassador); đồng sáng tạo, authenticity, brand safety; đo reach/engagement/EMV/conversion/ROI bằng mã & UTM; công bố tài trợ theo FTC và xử lý khủng hoảng; xu hướng creator economy, live commerce, virtual &amp; AI influencer.',
    requirements: 'Không cần tiên quyết đặc biệt — nên có hiểu biết cơ bản về marketing/mạng xã hội. Nội dung song ngữ Anh–Việt.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách nền, Influencer Marketing Hub, báo cáo ngành, FTC, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Từ celebrity endorsement đến influencer marketing; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Celebrity, KOL & influencer|||Chapter 1 — Celebrity, KOL & influencer', description: 'Định nghĩa, nano→mega, KOL vs KOC.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Vì sao dùng influencer|||Chapter 2 — Why influencers persuade', description: 'Uy tín nguồn, chuyển nghĩa, cận xã hội.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chọn influencer phù hợp|||Chapter 3 — Choosing the right fit', description: 'Brand fit, khớp khán giả, engagement thật/ảo.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Chiến dịch influencer|||Chapter 4 — Running a campaign', description: 'Brief, gifting/paid/affiliate/ambassador.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nội dung & đồng sáng tạo|||Chapter 5 — Content & co-creation', description: 'Co-creation, authenticity, brand safety.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đo lường|||Chapter 6 — Measurement', description: 'Reach, engagement, EMV, conversion, ROI.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Rủi ro & đạo đức|||Chapter 7 — Risk & ethics', description: 'Khủng hoảng, follower ảo, công bố FTC.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Xu hướng|||Chapter 8 — Trends', description: 'Creator economy, live commerce, virtual & AI.', lessons: [c8, c8q] },
  ],
};
