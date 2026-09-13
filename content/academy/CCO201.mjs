/**
 * CCO201 — Corporate Communication (Truyền thông doanh nghiệp).
 * Ngành Truyền thông Đa phương tiện FPTU. Môn KHÔNG có trong khung FLM đã tải
 * → dựng KHUNG chất lượng theo giáo trình chuẩn quốc tế: Cornelissen
 * "Corporate Communication: A Guide to Theory and Practice" và Argenti
 * "Corporate Communication". Song ngữ VI+EN, 8 chương, mỗi chương 1 outline +
 * 1 quiz 3 câu. Giữ NGUYÊN slug/semester/courseCode/thumbnailUrl.
 * ⚠️ KHÔNG backtick lồng / ${ } trong HTML; "&"→"&amp;" chỉ trong content.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

// ── Tài liệu ────────────────────────────────────────────────────────────────
const taiLieu = doc('cco201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Sách nền (Cornelissen, Argenti), tổ chức nghề (PRSA/IABC), HBR, công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">CCO201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Corporate Communication</strong> — reputation, strategy, PR, internal comms, crisis, CSR and digital measurement — in one place. Corporate communication is a management function that coordinates <em>all</em> internal and external communication to build a favourable reputation with the groups an organization depends on.</p>
<h3>📗 Core textbooks</h3>
<ul>
<li><a href="https://uk.sagepub.com/en-gb/eur/corporate-communication/book270074" target="_blank" rel="noopener">Joep Cornelissen — <em>Corporate Communication: A Guide to Theory and Practice</em></a> (the standard European text).</li>
<li><a href="https://www.routledge.com/Corporate-Communication-A-Guide-to-Theory-and-Practice/Argenti/p/book/9781260259070" target="_blank" rel="noopener">Paul Argenti — <em>Corporate Communication</em></a> (strategy-led, US case-driven).</li>
</ul>
<h3>🌐 Professional bodies &amp; free reading</h3>
<ul>
<li><a href="https://www.prsa.org/" target="_blank" rel="noopener">PRSA — Public Relations Society of America</a> (ethics code, resources).</li>
<li><a href="https://www.iabc.com/" target="_blank" rel="noopener">IABC — International Association of Business Communicators</a> (internal-comms standards).</li>
<li><a href="https://hbr.org/topic/subject/business-communication" target="_blank" rel="noopener">Harvard Business Review — Business Communication</a> (short strategic articles &amp; cases).</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.prnewswire.com/" target="_blank" rel="noopener">PR Newswire</a> / <a href="https://www.businesswire.com/" target="_blank" rel="noopener">Business Wire</a> — press-release distribution.</li>
<li><a href="https://mention.com/" target="_blank" rel="noopener">Mention</a> / <a href="https://www.google.com/alerts" target="_blank" rel="noopener">Google Alerts</a> — media monitoring &amp; listening.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — what corporate communication is, its stakeholders, identity vs image vs reputation.</li>
<li><strong>Strategy</strong> — set objectives, craft a core message, choose channels; align with the business strategy.</li>
<li><strong>Practice</strong> — write a press release, an internal announcement, and a holding statement for a crisis.</li>
<li><strong>Measure</strong> — track share of voice, sentiment and reputation, and report outcomes not outputs.</li>
</ol></div>`,
    `<span class="eyebrow">CCO201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Truyền thông doanh nghiệp</strong> — danh tiếng, chiến lược, PR, truyền thông nội bộ, khủng hoảng, CSR và đo lường số — gom về một chỗ. Truyền thông doanh nghiệp là một chức năng quản trị điều phối <em>toàn bộ</em> truyền thông đối nội và đối ngoại để xây dựng danh tiếng thuận lợi với các nhóm mà tổ chức phụ thuộc.</p>
<h3>📗 Sách nền</h3>
<ul>
<li><a href="https://uk.sagepub.com/en-gb/eur/corporate-communication/book270074" target="_blank" rel="noopener">Joep Cornelissen — <em>Corporate Communication: A Guide to Theory and Practice</em></a> (giáo trình chuẩn châu Âu).</li>
<li><a href="https://www.routledge.com/Corporate-Communication-A-Guide-to-Theory-and-Practice/Argenti/p/book/9781260259070" target="_blank" rel="noopener">Paul Argenti — <em>Corporate Communication</em></a> (thiên chiến lược, nhiều ca Mỹ).</li>
</ul>
<h3>🌐 Tổ chức nghề &amp; đọc miễn phí</h3>
<ul>
<li><a href="https://www.prsa.org/" target="_blank" rel="noopener">PRSA — Hiệp hội Quan hệ công chúng Hoa Kỳ</a> (bộ quy tắc đạo đức, tài nguyên).</li>
<li><a href="https://www.iabc.com/" target="_blank" rel="noopener">IABC — Hiệp hội Truyền thông viên Doanh nghiệp Quốc tế</a> (chuẩn truyền thông nội bộ).</li>
<li><a href="https://hbr.org/topic/subject/business-communication" target="_blank" rel="noopener">Harvard Business Review — Business Communication</a> (bài chiến lược ngắn &amp; ca thực tế).</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.prnewswire.com/" target="_blank" rel="noopener">PR Newswire</a> / <a href="https://www.businesswire.com/" target="_blank" rel="noopener">Business Wire</a> — phát hành thông cáo báo chí.</li>
<li><a href="https://mention.com/" target="_blank" rel="noopener">Mention</a> / <a href="https://www.google.com/alerts" target="_blank" rel="noopener">Google Alerts</a> — theo dõi &amp; lắng nghe truyền thông.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — truyền thông doanh nghiệp là gì, các nhóm hữu quan, phân biệt bản sắc / hình ảnh / danh tiếng.</li>
<li><strong>Chiến lược</strong> — đặt mục tiêu, xây thông điệp lõi, chọn kênh; gắn với chiến lược kinh doanh.</li>
<li><strong>Thực hành</strong> — viết một thông cáo báo chí, một thông báo nội bộ, và một tuyên bố cầm chừng cho khủng hoảng.</li>
<li><strong>Đo lường</strong> — bám share of voice, cảm xúc và danh tiếng; báo cáo kết quả chứ không phải sản lượng.</li>
</ol></div>`,
  ]]);

// ── Giới thiệu ──────────────────────────────────────────────────────────────
const intro = doc('cco201-0-1-overview', 'Course overview: Corporate Communication|||Tổng quan: Truyền thông doanh nghiệp',
  'Truyền thông doanh nghiệp là gì, vì sao là chức năng quản trị, và lộ trình 8 chương.',
  [[
    `<span class="eyebrow">CCO201 · Lesson 0.1 · Overview</span>
<h2>Corporate Communication</h2>
<p class="lead">This course explains <strong>how organizations communicate with the world and with themselves</strong> to earn trust. Corporate communication is not "the marketing of products" — it is the management of <strong>reputation</strong> across every audience: customers, employees, investors, media, government and communities.</p>
<h3>Why it is a management function</h3>
<p>When a CEO speaks to investors, an HR team announces layoffs, a brand answers a scandal on social media, and a sustainability report is published — these must tell <strong>one consistent story</strong>. Corporate communication is the discipline that <em>coordinates</em> them so the organization speaks with one voice.</p>
<h3>Roadmap — 8 chapters</h3>
<ul>
<li>Ch1 What corporate communication is &amp; its stakeholders → Ch2 identity, image &amp; reputation → Ch3 communication strategy.</li>
<li>Ch4 PR &amp; media relations → Ch5 internal communication → Ch6 crisis &amp; issues management.</li>
<li>Ch7 CSR &amp; ESG communication → Ch8 digital, social &amp; measurement.</li>
</ul>
<div class="callout"><span class="badge">Big idea</span> Reputation is an asset you cannot buy — it is <em>earned</em> through consistent behaviour and consistent communication, and lost far faster than it is built.</div>`,
    `<span class="eyebrow">CCO201 · Bài 0.1 · Tổng quan</span>
<h2>Truyền thông doanh nghiệp</h2>
<p class="lead">Môn này giải thích <strong>tổ chức truyền thông với thế giới bên ngoài và với chính mình thế nào</strong> để giành được niềm tin. Truyền thông doanh nghiệp không phải "tiếp thị sản phẩm" — nó là việc quản trị <strong>danh tiếng</strong> trên mọi công chúng: khách hàng, nhân viên, nhà đầu tư, báo chí, chính quyền và cộng đồng.</p>
<h3>Vì sao là một chức năng quản trị</h3>
<p>Khi CEO nói với nhà đầu tư, phòng nhân sự thông báo cắt giảm, một thương hiệu phản hồi scandal trên mạng xã hội, và một báo cáo bền vững được công bố — tất cả phải kể <strong>một câu chuyện nhất quán</strong>. Truyền thông doanh nghiệp là bộ môn <em>điều phối</em> chúng để tổ chức nói bằng một tiếng nói duy nhất.</p>
<h3>Lộ trình — 8 chương</h3>
<ul>
<li>Ch1 truyền thông doanh nghiệp là gì &amp; các nhóm hữu quan → Ch2 bản sắc, hình ảnh &amp; danh tiếng → Ch3 chiến lược truyền thông.</li>
<li>Ch4 PR &amp; quan hệ báo chí → Ch5 truyền thông nội bộ → Ch6 khủng hoảng &amp; quản trị vấn đề.</li>
<li>Ch7 CSR &amp; truyền thông ESG → Ch8 số, mạng xã hội &amp; đo lường.</li>
</ul>
<div class="callout"><span class="badge">Ý lớn</span> Danh tiếng là tài sản không mua được — nó được <em>gây dựng</em> qua hành vi và truyền thông nhất quán, và mất đi nhanh hơn nhiều so với lúc xây.</div>`,
  ]]);

// ── Chương 1 ────────────────────────────────────────────────────────────────
const c1 = doc('cco201-1-1-what-is', '1.1 — What corporate communication is|||1.1 — Truyền thông doanh nghiệp là gì',
  'Định nghĩa, phạm vi (marketing + management + organizational comms), và bản đồ stakeholder.',
  [[
    `<span class="eyebrow">CCO201 · Chapter 1 · Lesson 1.1</span>
<h2>What corporate communication is</h2>
<p><strong>Corporate communication</strong> is the management function that plans, coordinates and executes all communication — internal and external — to establish and maintain a <strong>favourable reputation</strong> with stakeholder groups (Cornelissen).</p>
<h3>Its scope: three streams brought together</h3>
<ul>
<li><strong>Management communication</strong> — leaders to employees and key audiences (vision, direction).</li>
<li><strong>Marketing communication</strong> — advertising, promotion, sponsorship aimed at customers.</li>
<li><strong>Organizational communication</strong> — PR, public affairs, investor relations, internal comms, CSR.</li>
</ul>
<p>The shift is from many departments each with their own voice to <strong>one integrated function</strong> aligning them all.</p>
<h3>Stakeholders — who we communicate with</h3>
<p>A <strong>stakeholder</strong> is any group that affects or is affected by the organization: customers, employees, shareholders/investors, media, government &amp; regulators, suppliers, local communities, NGOs. Freeman's <em>stakeholder model</em> replaced the old "shareholders only" view.</p>
<div class="callout"><span class="badge">Real case</span> When <strong>Apple</strong> launches a product, it speaks to customers (keynote), investors (earnings call), developers (WWDC) and media (press kit) at once — different messages, one identity. That coordination <em>is</em> corporate communication.</div>`,
    `<span class="eyebrow">CCO201 · Chương 1 · Bài 1.1</span>
<h2>Truyền thông doanh nghiệp là gì</h2>
<p><strong>Truyền thông doanh nghiệp</strong> là chức năng quản trị hoạch định, điều phối và thực thi toàn bộ truyền thông — đối nội và đối ngoại — nhằm thiết lập và duy trì <strong>danh tiếng thuận lợi</strong> với các nhóm hữu quan (Cornelissen).</p>
<h3>Phạm vi: gộp ba dòng lại làm một</h3>
<ul>
<li><strong>Truyền thông quản trị</strong> — lãnh đạo tới nhân viên và các công chúng then chốt (tầm nhìn, định hướng).</li>
<li><strong>Truyền thông marketing</strong> — quảng cáo, khuyến mãi, tài trợ hướng tới khách hàng.</li>
<li><strong>Truyền thông tổ chức</strong> — PR, quan hệ công quyền, quan hệ nhà đầu tư, nội bộ, CSR.</li>
</ul>
<p>Chuyển dịch là từ nhiều phòng ban ai nói tiếng nấy sang <strong>một chức năng tích hợp</strong> gắn kết tất cả.</p>
<h3>Nhóm hữu quan — ta truyền thông với ai</h3>
<p><strong>Nhóm hữu quan (stakeholder)</strong> là mọi nhóm tác động hoặc chịu tác động bởi tổ chức: khách hàng, nhân viên, cổ đông/nhà đầu tư, báo chí, chính quyền &amp; cơ quan quản lý, nhà cung cấp, cộng đồng địa phương, NGO. <em>Mô hình stakeholder</em> của Freeman thay cho quan niệm cũ "chỉ vì cổ đông".</p>
<div class="callout"><span class="badge">Ca thực tế</span> Khi <strong>Apple</strong> ra mắt sản phẩm, họ nói với khách hàng (keynote), nhà đầu tư (earnings call), lập trình viên (WWDC) và báo chí (press kit) cùng lúc — thông điệp khác nhau, một bản sắc. Sự điều phối đó <em>chính là</em> truyền thông doanh nghiệp.</div>`,
  ]]);
const c1q = quiz('cco201-quiz-1', 'Quiz 1 — What & who|||Quiz 1 — Là gì & với ai', [
  { id: 'q1', question: 'Mục tiêu cốt lõi của truyền thông doanh nghiệp là gì?|||What is the core aim of corporate communication?', options: ['Bán được nhiều sản phẩm nhất|||Sell the most products', 'Xây & giữ danh tiếng thuận lợi với các nhóm hữu quan|||Build & keep a favourable reputation with stakeholders', 'Giảm chi phí quảng cáo|||Cut advertising cost', 'Thay thế phòng nhân sự|||Replace the HR department'], correctIndex: 1, explanation: 'Đó là chức năng quản trị danh tiếng với mọi stakeholder, không chỉ bán hàng.' },
  { id: 'q2', question: '"Stakeholder" nghĩa là?|||A "stakeholder" is?', options: ['Chỉ cổ đông của công ty|||Only the shareholders', 'Mọi nhóm tác động hoặc chịu tác động bởi tổ chức|||Any group that affects or is affected by the organization', 'Đối thủ cạnh tranh|||A competitor', 'Nhà cung cấp phần mềm|||A software vendor'], correctIndex: 1, explanation: 'Mô hình Freeman: khách hàng, nhân viên, nhà đầu tư, báo chí, cộng đồng…' },
  { id: 'q3', question: 'Dòng nào KHÔNG thuộc phạm vi truyền thông doanh nghiệp?|||Which stream is NOT part of corporate communication?', options: ['Truyền thông quản trị|||Management communication', 'Truyền thông marketing|||Marketing communication', 'Truyền thông tổ chức (PR, IR, nội bộ)|||Organizational communication', 'Kế toán thuế|||Tax accounting'], correctIndex: 3, explanation: 'Kế toán thuế là chức năng tài chính, không phải truyền thông.' },
]);

// ── Chương 2 ────────────────────────────────────────────────────────────────
const c2 = doc('cco201-2-1-reputation', '2.1 — Identity, image & reputation|||2.1 — Bản sắc, hình ảnh & danh tiếng',
  'Phân biệt corporate identity / image / reputation; khoảng cách identity–image; đo danh tiếng.',
  [[
    `<span class="eyebrow">CCO201 · Chapter 2 · Lesson 2.1</span>
<h2>Identity, image &amp; reputation</h2>
<p>These three words are often confused but mean different things:</p>
<ul>
<li><strong>Corporate identity</strong> — who the organization <em>is</em>: its values, behaviour, and visual symbols (logo, name, design). It is projected <em>outward</em> by the company.</li>
<li><strong>Corporate image</strong> — the <em>immediate</em> picture a single audience holds in mind at one moment (can shift with one ad or one news story).</li>
<li><strong>Corporate reputation</strong> — the <em>lasting</em> collective judgement built up over time across all audiences from repeated experiences.</li>
</ul>
<h3>The identity–image gap</h3>
<p>Trouble starts when what the company <em>says it is</em> (identity) differs from what people <em>believe it is</em> (image). Closing that gap is a central job of corporate communication.</p>
<h3>Measuring reputation</h3>
<p>Frameworks like the <strong>RepTrak</strong> model score reputation on drivers such as products, innovation, workplace, governance, citizenship, leadership and performance.</p>
<div class="callout"><span class="badge">Real case</span> <strong>Patagonia</strong> has a strong reputation because its identity (environmental activism) matches its behaviour — donating profits, "Don't Buy This Jacket". Identity and image line up, so trust compounds.</div>`,
    `<span class="eyebrow">CCO201 · Chương 2 · Bài 2.1</span>
<h2>Bản sắc, hình ảnh &amp; danh tiếng</h2>
<p>Ba từ này hay bị lẫn nhưng nghĩa khác nhau:</p>
<ul>
<li><strong>Bản sắc doanh nghiệp (identity)</strong> — tổ chức <em>là ai</em>: giá trị, hành vi, và biểu tượng thị giác (logo, tên, thiết kế). Do công ty chủ động phóng chiếu <em>ra ngoài</em>.</li>
<li><strong>Hình ảnh doanh nghiệp (image)</strong> — bức tranh <em>tức thời</em> một công chúng giữ trong đầu tại một thời điểm (đổi được chỉ sau một quảng cáo hay một tin).</li>
<li><strong>Danh tiếng doanh nghiệp (reputation)</strong> — phán xét tập thể <em>bền lâu</em> tích luỹ theo thời gian trên mọi công chúng qua trải nghiệm lặp lại.</li>
</ul>
<h3>Khoảng cách bản sắc – hình ảnh</h3>
<p>Rắc rối nảy sinh khi công ty <em>tự nhận là gì</em> (bản sắc) lệch với điều người ta <em>tin nó là gì</em> (hình ảnh). Thu hẹp khoảng cách đó là nhiệm vụ trung tâm của truyền thông doanh nghiệp.</p>
<h3>Đo danh tiếng</h3>
<p>Các khung như mô hình <strong>RepTrak</strong> chấm điểm danh tiếng theo các trụ: sản phẩm, đổi mới, môi trường làm việc, quản trị, trách nhiệm công dân, lãnh đạo và hiệu quả.</p>
<div class="callout"><span class="badge">Ca thực tế</span> <strong>Patagonia</strong> có danh tiếng mạnh vì bản sắc (hoạt động vì môi trường) khớp với hành vi — trích lợi nhuận, chiến dịch "Don't Buy This Jacket". Bản sắc và hình ảnh trùng khớp nên niềm tin cộng dồn.</div>`,
  ]]);
const c2q = quiz('cco201-quiz-2', 'Quiz 2 — Reputation|||Quiz 2 — Danh tiếng', [
  { id: 'q1', question: 'Điểm khác biệt chính giữa "image" và "reputation"?|||Key difference between image and reputation?', options: ['Không khác gì|||No difference', 'Image tức thời của một công chúng; reputation bền lâu, tập thể|||Image is immediate & single-audience; reputation is lasting & collective', 'Reputation chỉ là logo|||Reputation is just the logo', 'Image chỉ dành cho nhà đầu tư|||Image is only for investors'], correctIndex: 1, explanation: 'Image đổi nhanh theo một sự kiện; reputation tích luỹ theo thời gian qua nhiều công chúng.' },
  { id: 'q2', question: '"Corporate identity" chỉ điều gì?|||"Corporate identity" refers to?', options: ['Điều người ngoài tin về công ty|||What outsiders believe', 'Tổ chức là ai: giá trị, hành vi, biểu tượng thị giác|||Who the org is: values, behaviour, visual symbols', 'Doanh thu quý|||Quarterly revenue', 'Số nhân viên|||Headcount'], correctIndex: 1, explanation: 'Bản sắc do công ty phóng chiếu ra: giá trị + hành vi + logo/tên/thiết kế.' },
  { id: 'q3', question: '"Identity–image gap" là gì?|||What is the identity–image gap?', options: ['Chênh lệch giữa tự nhận và điều công chúng tin|||Gap between what the firm claims and what audiences believe', 'Khoảng cách địa lý|||A geographic distance', 'Chênh lệch giá cổ phiếu|||A share-price spread', 'Lỗi in logo|||A logo printing error'], correctIndex: 0, explanation: 'Thu hẹp khoảng cách này là nhiệm vụ trung tâm của truyền thông doanh nghiệp.' },
]);

// ── Chương 3 ────────────────────────────────────────────────────────────────
const c3 = doc('cco201-3-1-strategy', '3.1 — Communication strategy|||3.1 — Chiến lược truyền thông',
  'Từ mục tiêu kinh doanh → mục tiêu truyền thông (SMART), công chúng, thông điệp lõi, chọn kênh.',
  [[
    `<span class="eyebrow">CCO201 · Chapter 3 · Lesson 3.1</span>
<h2>Communication strategy</h2>
<p>A <strong>communication strategy</strong> connects the business goal to what you say, to whom, and how. It is a chain, not a poster:</p>
<pre><code>Business objective
  -> Communication objective (SMART: specific, measurable, time-bound)
  -> Audience (which stakeholders, what they think now)
  -> Core message (one idea, repeated)
  -> Channels (owned / earned / paid / shared)
  -> Evaluation (did belief/behaviour move?)</code></pre>
<h3>The core message</h3>
<p>Strong campaigns say <strong>one thing</strong> and repeat it. A message platform keeps every spokesperson, press release and post on the same idea — this is what makes an organization sound like it has one voice.</p>
<h3>Choosing channels — the PESO model</h3>
<ul>
<li><strong>Paid</strong> — advertising, sponsored posts.</li>
<li><strong>Earned</strong> — press coverage, word of mouth (credible, not controlled).</li>
<li><strong>Shared</strong> — social media, community.</li>
<li><strong>Owned</strong> — website, blog, newsletter (fully controlled).</li>
</ul>
<div class="callout"><span class="badge">Real case</span> <strong>Dove</strong>'s "Real Beauty" set one message — widen the definition of beauty — and carried it across paid ads, earned press and shared social for years. One idea, many channels, a decade of consistency.</div>`,
    `<span class="eyebrow">CCO201 · Chương 3 · Bài 3.1</span>
<h2>Chiến lược truyền thông</h2>
<p>Một <strong>chiến lược truyền thông</strong> nối mục tiêu kinh doanh với việc nói gì, với ai, bằng cách nào. Nó là một chuỗi, không phải một tấm áp phích:</p>
<pre><code>Mục tiêu kinh doanh
  -> Mục tiêu truyền thông (SMART: cụ thể, đo được, có thời hạn)
  -> Công chúng (nhóm hữu quan nào, họ đang nghĩ gì)
  -> Thông điệp lõi (một ý, lặp lại)
  -> Kênh (owned / earned / paid / shared)
  -> Đánh giá (niềm tin/hành vi có dịch chuyển?)</code></pre>
<h3>Thông điệp lõi</h3>
<p>Chiến dịch mạnh nói <strong>một điều</strong> và lặp lại nó. Một nền tảng thông điệp giữ mọi người phát ngôn, thông cáo và bài đăng bám cùng một ý — đó là thứ khiến tổ chức nghe như có một tiếng nói.</p>
<h3>Chọn kênh — mô hình PESO</h3>
<ul>
<li><strong>Paid (trả tiền)</strong> — quảng cáo, bài tài trợ.</li>
<li><strong>Earned (giành được)</strong> — báo chí đưa tin, truyền miệng (đáng tin, không kiểm soát).</li>
<li><strong>Shared (chia sẻ)</strong> — mạng xã hội, cộng đồng.</li>
<li><strong>Owned (sở hữu)</strong> — website, blog, bản tin (kiểm soát hoàn toàn).</li>
</ul>
<div class="callout"><span class="badge">Ca thực tế</span> Chiến dịch "Real Beauty" của <strong>Dove</strong> đặt một thông điệp — mở rộng định nghĩa cái đẹp — và mang nó qua quảng cáo trả tiền, báo chí giành được và mạng xã hội suốt nhiều năm. Một ý, nhiều kênh, một thập kỷ nhất quán.</div>`,
  ]]);
const c3q = quiz('cco201-quiz-3', 'Quiz 3 — Strategy|||Quiz 3 — Chiến lược', [
  { id: 'q1', question: 'Mục tiêu truyền thông tốt nên theo tiêu chí nào?|||A good communication objective should be?', options: ['Càng chung chung càng tốt|||As vague as possible', 'SMART: cụ thể, đo được, có thời hạn|||SMART: specific, measurable, time-bound', 'Chỉ do CEO quyết|||Decided by the CEO only', 'Không cần đo|||No need to measure'], correctIndex: 1, explanation: 'Mục tiêu SMART cho phép đánh giá cuối chiến dịch.' },
  { id: 'q2', question: 'Trong mô hình PESO, kênh nào KHÔNG do công ty kiểm soát nhưng đáng tin nhất?|||In PESO, which channel is not controlled but most credible?', options: ['Paid — trả tiền|||Paid', 'Owned — sở hữu|||Owned', 'Earned — báo chí giành được|||Earned', 'Shared — chia sẻ|||Shared'], correctIndex: 2, explanation: 'Earned media (báo chí, truyền miệng) đáng tin vì bên thứ ba nói, dù ta không kiểm soát.' },
  { id: 'q3', question: 'Vì sao cần "thông điệp lõi" (core message)?|||Why have a core message?', options: ['Để mỗi kênh nói một ý khác nhau|||So each channel says something different', 'Để mọi người phát ngôn & kênh bám một ý, tạo một tiếng nói|||So spokespeople & channels stay on one idea — one voice', 'Để tiết kiệm giấy|||To save paper', 'Để tránh đo lường|||To avoid measurement'], correctIndex: 1, explanation: 'Một ý lặp lại trên mọi kênh chính là thứ tạo tính nhất quán.' },
]);

// ── Chương 4 ────────────────────────────────────────────────────────────────
const c4 = doc('cco201-4-1-pr-media', '4.1 — PR & media relations|||4.1 — Quan hệ công chúng & báo chí',
  'PR là gì so với quảng cáo; media relations; cấu trúc thông cáo báo chí (ngược tháp); news value.',
  [[
    `<span class="eyebrow">CCO201 · Chapter 4 · Lesson 4.1</span>
<h2>PR &amp; media relations</h2>
<p><strong>Public relations (PR)</strong> builds mutually beneficial relationships between an organization and its publics, mainly through <em>earned</em> attention. Unlike advertising (paid, controlled), PR coverage is credible <em>because</em> a journalist chose to run it.</p>
<h3>Media relations</h3>
<p>Working with journalists: knowing their beat, offering genuine <strong>news value</strong> (timeliness, impact, prominence, novelty, conflict, human interest), and being a reliable source. The output tools are the <strong>press release</strong>, media kit, and the spokesperson interview.</p>
<h3>The press release — inverted pyramid</h3>
<pre><code>Headline        -> the story in one line
Lead paragraph  -> who / what / when / where / why (most important first)
Body            -> supporting detail, quotes
Boilerplate     -> one paragraph about the company
Contact         -> name, email, phone</code></pre>
<p>Put the most important fact <strong>first</strong> — editors cut from the bottom.</p>
<div class="callout"><span class="badge">Real case</span> <strong>Tesla</strong> famously spends almost nothing on traditional ads; product reveals and Musk's announcements generate huge <em>earned</em> media. That is PR-driven visibility — powerful, but hard to control when the news turns negative.</div>`,
    `<span class="eyebrow">CCO201 · Chương 4 · Bài 4.1</span>
<h2>Quan hệ công chúng &amp; báo chí</h2>
<p><strong>Quan hệ công chúng (PR)</strong> xây quan hệ đôi bên cùng lợi giữa tổ chức và các công chúng, chủ yếu qua sự chú ý <em>giành được</em>. Khác quảng cáo (trả tiền, kiểm soát), tin PR đáng tin <em>chính vì</em> nhà báo chọn đăng nó.</p>
<h3>Quan hệ báo chí (media relations)</h3>
<p>Làm việc với nhà báo: hiểu mảng họ phụ trách, đưa <strong>giá trị tin tức</strong> thật (tính thời sự, tác động, tầm nổi bật, mới lạ, xung đột, chất người), và là nguồn tin đáng tin. Công cụ đầu ra là <strong>thông cáo báo chí</strong>, media kit, và phỏng vấn người phát ngôn.</p>
<h3>Thông cáo báo chí — tháp ngược</h3>
<pre><code>Tiêu đề       -> câu chuyện trong một dòng
Đoạn dẫn      -> ai / gì / khi nào / ở đâu / vì sao (quan trọng nhất trước)
Thân bài      -> chi tiết bổ trợ, trích dẫn
Boilerplate   -> một đoạn giới thiệu công ty
Liên hệ       -> tên, email, điện thoại</code></pre>
<p>Đặt sự thật quan trọng nhất lên <strong>đầu</strong> — biên tập viên cắt từ dưới lên.</p>
<div class="callout"><span class="badge">Ca thực tế</span> <strong>Tesla</strong> nổi tiếng gần như không chi quảng cáo truyền thống; các buổi ra mắt và phát ngôn của Musk tạo lượng báo chí <em>giành được</em> khổng lồ. Đó là độ phủ nhờ PR — mạnh, nhưng khó kiểm soát khi tin xoay chiều xấu.</div>`,
  ]]);
const c4q = quiz('cco201-quiz-4', 'Quiz 4 — PR & media|||Quiz 4 — PR & báo chí', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa PR và quảng cáo?|||Core difference between PR and advertising?', options: ['Không khác gì|||No difference', 'PR là earned/đáng tin do nhà báo chọn đăng; quảng cáo là paid/kiểm soát|||PR is earned & credible; advertising is paid & controlled', 'PR luôn đắt hơn|||PR is always more expensive', 'Quảng cáo không cần thông điệp|||Ads need no message'], correctIndex: 1, explanation: 'PR giành sự chú ý (earned) nên đáng tin; quảng cáo mua chỗ (paid) nên kiểm soát được.' },
  { id: 'q2', question: 'Cấu trúc "tháp ngược" của thông cáo báo chí nghĩa là?|||The inverted pyramid means?', options: ['Đặt kết luận ở cuối|||Put the conclusion last', 'Đặt thông tin quan trọng nhất lên đầu|||Put the most important info first', 'Viết từ ngắn tới dài|||Write shortest to longest', 'Không cần tiêu đề|||No headline needed'], correctIndex: 1, explanation: 'Biên tập viên cắt từ dưới, nên fact quan trọng nhất phải ở đoạn dẫn.' },
  { id: 'q3', question: 'Yếu tố nào KHÔNG phải là "news value"?|||Which is NOT a news value?', options: ['Tính thời sự (timeliness)|||Timeliness', 'Tác động (impact)|||Impact', 'Giá cổ phiếu của nhà báo|||The journalist share price', 'Chất người (human interest)|||Human interest'], correctIndex: 2, explanation: 'News value gồm thời sự, tác động, nổi bật, mới lạ, xung đột, chất người.' },
]);

// ── Chương 5 ────────────────────────────────────────────────────────────────
const c5 = doc('cco201-5-1-internal', '5.1 — Internal communication|||5.1 — Truyền thông nội bộ',
  'Vì sao truyền thông nội bộ quan trọng; employee engagement; kênh nội bộ; nhân viên là đại sứ.',
  [[
    `<span class="eyebrow">CCO201 · Chapter 5 · Lesson 5.1</span>
<h2>Internal communication</h2>
<p><strong>Internal communication</strong> is how an organization talks <em>with its own employees</em>. It is not "sending memos" — it is the flow that makes people understand strategy, feel informed, and act as one team.</p>
<h3>Why it matters</h3>
<ul>
<li><strong>Engagement</strong> — engaged employees are more productive and stay longer; disengagement is expensive.</li>
<li><strong>Alignment</strong> — people can only support a strategy they understand.</li>
<li><strong>Ambassadors</strong> — employees are the most credible voice of a company; they speak to customers, friends and social media.</li>
</ul>
<h3>Channels &amp; direction</h3>
<p>Intranet, town halls, team meetings, email, enterprise chat (Slack/Teams). Good internal comms is <strong>two-way</strong>: not just top-down announcements but upward feedback and lateral sharing.</p>
<div class="callout"><span class="badge">Real case</span> During major change, firms like <strong>Microsoft</strong> under Satya Nadella used a clear internal narrative ("growth mindset") repeated in town halls and email to shift culture. Internal message first, external reputation followed.</div>`,
    `<span class="eyebrow">CCO201 · Chương 5 · Bài 5.1</span>
<h2>Truyền thông nội bộ</h2>
<p><strong>Truyền thông nội bộ</strong> là cách tổ chức trò chuyện <em>với chính nhân viên của mình</em>. Không phải "gửi thông báo" — nó là dòng chảy giúp mọi người hiểu chiến lược, thấy được cập nhật, và hành động như một đội.</p>
<h3>Vì sao quan trọng</h3>
<ul>
<li><strong>Gắn kết (engagement)</strong> — nhân viên gắn kết làm việc năng suất hơn và ở lại lâu hơn; thờ ơ thì tốn kém.</li>
<li><strong>Đồng bộ</strong> — người ta chỉ ủng hộ được chiến lược mà họ hiểu.</li>
<li><strong>Đại sứ</strong> — nhân viên là tiếng nói đáng tin nhất của công ty; họ nói với khách hàng, bạn bè và mạng xã hội.</li>
</ul>
<h3>Kênh &amp; chiều truyền</h3>
<p>Intranet, town hall, họp nhóm, email, chat nội bộ (Slack/Teams). Truyền thông nội bộ tốt là <strong>hai chiều</strong>: không chỉ thông báo từ trên xuống mà còn phản hồi từ dưới lên và chia sẻ ngang hàng.</p>
<div class="callout"><span class="badge">Ca thực tế</span> Khi thay đổi lớn, những công ty như <strong>Microsoft</strong> dưới Satya Nadella dùng một tự sự nội bộ rõ ("growth mindset") lặp trong town hall và email để chuyển văn hoá. Thông điệp nội bộ trước, danh tiếng bên ngoài theo sau.</div>`,
  ]]);
const c5q = quiz('cco201-quiz-5', 'Quiz 5 — Internal comms|||Quiz 5 — Nội bộ', [
  { id: 'q1', question: 'Vì sao nhân viên được gọi là "đại sứ" của công ty?|||Why are employees called company "ambassadors"?', options: ['Vì họ ký hợp đồng ngoại giao|||They sign diplomatic treaties', 'Vì họ là tiếng nói đáng tin, nói với khách hàng & mạng xã hội|||They are a credible voice to customers & social media', 'Vì luật bắt buộc|||It is a legal rule', 'Vì họ sở hữu công ty|||They own the company'], correctIndex: 1, explanation: 'Nhân viên gắn kết lan toả thông điệp đáng tin ra bên ngoài.' },
  { id: 'q2', question: 'Truyền thông nội bộ tốt nên là?|||Good internal communication should be?', options: ['Chỉ một chiều từ trên xuống|||One-way top-down only', 'Hai chiều: có phản hồi lên & chia sẻ ngang|||Two-way: upward feedback & lateral sharing', 'Chỉ qua email|||Email only', 'Bí mật với nhân viên|||Kept secret from staff'], correctIndex: 1, explanation: 'Hai chiều giúp lắng nghe, không chỉ thông báo.' },
  { id: 'q3', question: '"Employee engagement" cao dẫn tới?|||High employee engagement leads to?', options: ['Năng suất & giữ chân tốt hơn|||Higher productivity & retention', 'Chi phí quảng cáo tăng|||Higher ad spend', 'Giá cổ phiếu giảm chắc chắn|||Guaranteed lower share price', 'Không ảnh hưởng gì|||No effect'], correctIndex: 0, explanation: 'Gắn kết cao gắn với năng suất và tỉ lệ ở lại cao hơn.' },
]);

// ── Chương 6 ────────────────────────────────────────────────────────────────
const c6 = doc('cco201-6-1-crisis', '6.1 — Crisis & issues management|||6.1 — Quản trị khủng hoảng & vấn đề',
  'Issues management (phòng); khủng hoảng là gì; nguyên tắc phản ứng; SCCT; holding statement.',
  [[
    `<span class="eyebrow">CCO201 · Chapter 6 · Lesson 6.1</span>
<h2>Crisis &amp; issues management</h2>
<h3>Issues management — prevention</h3>
<p>An <strong>issue</strong> is a problem building up (a trend, a complaint, a regulation) that could become a crisis. <strong>Issues management</strong> spots and defuses it early — cheaper and calmer than reacting to a full crisis.</p>
<h3>A crisis</h3>
<p>A <strong>crisis</strong> is a sudden, threatening event that can damage reputation and demands an immediate response — a recall, an accident, a data breach, a scandal.</p>
<h3>Principles of crisis response</h3>
<ul>
<li><strong>Be quick</strong> — a holding statement in the first hour beats silence.</li>
<li><strong>Be honest &amp; consistent</strong> — one set of facts, no cover-up.</li>
<li><strong>Show concern</strong> — acknowledge people affected first, defend the company second.</li>
<li><strong>One voice</strong> — a trained spokesperson, agreed messages.</li>
</ul>
<p>Coombs' <strong>SCCT</strong> (Situational Crisis Communication Theory) matches the response (deny / diminish / rebuild) to how much the public blames the organization.</p>
<div class="callout"><span class="badge">Real case</span> The 1982 <strong>Johnson &amp; Johnson</strong> Tylenol recall is the textbook model: it pulled 31 million bottles, put safety first over profit, and communicated openly — reputation recovered. Contrast poorly-handled crises where denial deepened the damage.</div>`,
    `<span class="eyebrow">CCO201 · Chương 6 · Bài 6.1</span>
<h2>Quản trị khủng hoảng &amp; vấn đề</h2>
<h3>Quản trị vấn đề — phòng ngừa</h3>
<p>Một <strong>vấn đề (issue)</strong> là rắc rối đang tích tụ (một xu hướng, một khiếu nại, một quy định) có thể thành khủng hoảng. <strong>Quản trị vấn đề</strong> phát hiện và tháo ngòi sớm — rẻ và bình tĩnh hơn là chữa cháy khi đã bùng.</p>
<h3>Khủng hoảng</h3>
<p>Một <strong>khủng hoảng</strong> là sự cố bất ngờ, đe doạ, có thể phá danh tiếng và đòi phản ứng tức thì — thu hồi sản phẩm, tai nạn, rò rỉ dữ liệu, scandal.</p>
<h3>Nguyên tắc phản ứng khủng hoảng</h3>
<ul>
<li><strong>Nhanh</strong> — một tuyên bố cầm chừng trong giờ đầu hơn hẳn im lặng.</li>
<li><strong>Trung thực &amp; nhất quán</strong> — một bộ sự thật, không che giấu.</li>
<li><strong>Thể hiện quan tâm</strong> — thừa nhận người bị ảnh hưởng trước, bảo vệ công ty sau.</li>
<li><strong>Một tiếng nói</strong> — người phát ngôn được huấn luyện, thông điệp đã thống nhất.</li>
</ul>
<p><strong>SCCT</strong> của Coombs (Lý thuyết Truyền thông Khủng hoảng theo Tình huống) khớp phản ứng (chối / giảm nhẹ / tái dựng) với mức độ công chúng quy trách nhiệm cho tổ chức.</p>
<div class="callout"><span class="badge">Ca thực tế</span> Vụ thu hồi Tylenol của <strong>Johnson &amp; Johnson</strong> năm 1982 là mẫu kinh điển: rút 31 triệu lọ, đặt an toàn trên lợi nhuận, truyền thông cởi mở — danh tiếng hồi phục. Ngược lại, các khủng hoảng xử lý kém khi chối bỏ chỉ làm tổn hại nặng hơn.</div>`,
  ]]);
const c6q = quiz('cco201-quiz-6', 'Quiz 6 — Crisis|||Quiz 6 — Khủng hoảng', [
  { id: 'q1', question: 'Khác biệt giữa "issue" và "crisis"?|||Difference between an issue and a crisis?', options: ['Giống hệt nhau|||They are identical', 'Issue tích tụ dần (phòng được); crisis bất ngờ, đòi phản ứng tức thì|||An issue builds up (preventable); a crisis is sudden & needs immediate response', 'Crisis luôn nhỏ hơn|||A crisis is always smaller', 'Issue chỉ về tài chính|||An issue is only financial'], correctIndex: 1, explanation: 'Quản trị vấn đề là phòng ngừa sớm; khủng hoảng là sự cố bùng phát.' },
  { id: 'q2', question: 'Nguyên tắc phản ứng khủng hoảng nào là ĐÚNG?|||Which crisis-response principle is correct?', options: ['Im lặng đến khi có đủ thông tin|||Stay silent until you know everything', 'Nhanh, trung thực, một tiếng nói, quan tâm người bị ảnh hưởng trước|||Be quick, honest, one voice, care for the affected first', 'Đổ lỗi cho báo chí|||Blame the press', 'Xoá mọi bài đăng|||Delete all posts'], correctIndex: 1, explanation: 'Tuyên bố cầm chừng sớm + trung thực + một người phát ngôn.' },
  { id: 'q3', question: 'Vụ Tylenol 1982 của J&J được xem là mẫu vì?|||The 1982 J&J Tylenol case is a model because?', options: ['Họ chối trách nhiệm|||They denied responsibility', 'Đặt an toàn trên lợi nhuận, thu hồi & truyền thông cởi mở|||They put safety over profit, recalled & communicated openly', 'Họ im lặng|||They stayed silent', 'Họ kiện khách hàng|||They sued customers'], correctIndex: 1, explanation: 'Thu hồi 31 triệu lọ, minh bạch → danh tiếng hồi phục.' },
]);

// ── Chương 7 ────────────────────────────────────────────────────────────────
const c7 = doc('cco201-7-1-csr-esg', '7.1 — CSR & sustainability communication|||7.1 — Trách nhiệm xã hội & bền vững',
  'CSR là gì; ESG (Environmental, Social, Governance); báo cáo bền vững; nguy cơ greenwashing.',
  [[
    `<span class="eyebrow">CCO201 · Chapter 7 · Lesson 7.1</span>
<h2>CSR &amp; sustainability communication</h2>
<p><strong>Corporate Social Responsibility (CSR)</strong> is a company's commitment to operate ethically and contribute to society and the environment, beyond just making profit. Communicating it well builds reputation and trust — communicating it <em>badly</em> destroys both.</p>
<h3>From CSR to ESG</h3>
<p>Investors now assess companies on <strong>ESG</strong>:</p>
<ul>
<li><strong>Environmental</strong> — emissions, waste, climate impact.</li>
<li><strong>Social</strong> — labour, diversity, community, human rights.</li>
<li><strong>Governance</strong> — board ethics, transparency, anti-corruption.</li>
</ul>
<p>Firms publish a <strong>sustainability / ESG report</strong> (often to GRI standards) for investors, regulators and the public.</p>
<h3>The greenwashing trap</h3>
<p><strong>Greenwashing</strong> is claiming to be greener/more responsible than you are. It is the fastest way to wreck reputation, because the identity–image gap becomes visible and the media punish it. Rule: <em>do first, then say</em> — communication must follow real behaviour.</p>
<div class="callout"><span class="badge">Real case</span> <strong>Unilever</strong>'s Sustainable Living plan tied brand growth to real environmental &amp; social targets and reported progress publicly. Because action backed the claims, the communication strengthened trust rather than inviting a greenwashing backlash.</div>`,
    `<span class="eyebrow">CCO201 · Chương 7 · Bài 7.1</span>
<h2>Trách nhiệm xã hội &amp; truyền thông bền vững</h2>
<p><strong>Trách nhiệm xã hội doanh nghiệp (CSR)</strong> là cam kết của công ty vận hành có đạo đức và đóng góp cho xã hội, môi trường, vượt trên chuyện chỉ kiếm lợi nhuận. Truyền thông tốt xây danh tiếng và niềm tin — truyền thông <em>tệ</em> phá cả hai.</p>
<h3>Từ CSR tới ESG</h3>
<p>Nhà đầu tư nay đánh giá công ty theo <strong>ESG</strong>:</p>
<ul>
<li><strong>Môi trường (Environmental)</strong> — phát thải, rác thải, tác động khí hậu.</li>
<li><strong>Xã hội (Social)</strong> — lao động, đa dạng, cộng đồng, nhân quyền.</li>
<li><strong>Quản trị (Governance)</strong> — đạo đức hội đồng, minh bạch, chống tham nhũng.</li>
</ul>
<p>Doanh nghiệp công bố <strong>báo cáo bền vững / ESG</strong> (thường theo chuẩn GRI) cho nhà đầu tư, cơ quan quản lý và công chúng.</p>
<h3>Bẫy greenwashing</h3>
<p><strong>Greenwashing</strong> là tự nhận xanh/có trách nhiệm hơn thực tế. Đó là cách nhanh nhất phá danh tiếng, vì khoảng cách bản sắc–hình ảnh lộ ra và báo chí trừng phạt. Nguyên tắc: <em>làm trước, nói sau</em> — truyền thông phải bám hành vi thật.</p>
<div class="callout"><span class="badge">Ca thực tế</span> Kế hoạch Sustainable Living của <strong>Unilever</strong> gắn tăng trưởng thương hiệu với mục tiêu môi trường &amp; xã hội thật và công bố tiến độ công khai. Vì hành động chống lưng cho tuyên bố, truyền thông củng cố niềm tin thay vì hứng phản ứng greenwashing.</div>`,
  ]]);
const c7q = quiz('cco201-quiz-7', 'Quiz 7 — CSR & ESG|||Quiz 7 — CSR & ESG', [
  { id: 'q1', question: 'Ba trụ của ESG là?|||The three pillars of ESG are?', options: ['Economy, Sales, Growth', 'Environmental, Social, Governance', 'Ethics, Safety, Green', 'Energy, Society, Government'], correctIndex: 1, explanation: 'ESG = Environmental (môi trường), Social (xã hội), Governance (quản trị).' },
  { id: 'q2', question: '"Greenwashing" là gì?|||What is greenwashing?', options: ['Rửa sạch sản phẩm|||Cleaning products', 'Tự nhận xanh/có trách nhiệm hơn thực tế|||Claiming to be greener/more responsible than you really are', 'Một chuẩn báo cáo|||A reporting standard', 'Một loại thuế môi trường|||An environmental tax'], correctIndex: 1, explanation: 'Nói vượt hành vi thật → lộ khoảng cách identity–image, phá danh tiếng.' },
  { id: 'q3', question: 'Nguyên tắc an toàn khi truyền thông CSR?|||The safe rule for CSR communication?', options: ['Nói trước, làm sau|||Say first, do later', 'Làm trước, nói sau — truyền thông bám hành vi thật|||Do first, then say — communication follows real behaviour', 'Không bao giờ báo cáo|||Never report anything', 'Chỉ nói điều tốt|||Only ever say good things'], correctIndex: 1, explanation: 'Truyền thông CSR phải được hành động thật chống lưng, nếu không thành greenwashing.' },
]);

// ── Chương 8 ────────────────────────────────────────────────────────────────
const c8 = doc('cco201-8-1-digital', '8.1 — Digital communication & measurement|||8.1 — Truyền thông số & đo lường',
  'Mạng xã hội & owned media; social listening; đo hiệu quả (outputs vs outcomes); media monitoring & KPI.',
  [[
    `<span class="eyebrow">CCO201 · Chapter 8 · Lesson 8.1</span>
<h2>Digital communication &amp; measurement</h2>
<h3>Digital &amp; social</h3>
<p>Digital channels turned communication from a broadcast into a <strong>conversation</strong>. Audiences now reply, share and criticise in public and in real time. This means faster reach but also less control — a single tweet can start or end a crisis.</p>
<h3>Social listening &amp; monitoring</h3>
<p><strong>Media monitoring / social listening</strong> tracks what is being said about the organization, by whom, and in what tone (<em>sentiment</em>). It is the early-warning radar for issues management and the feedback loop for strategy.</p>
<h3>Measuring: outputs vs outcomes</h3>
<pre><code>Outputs  -> what we produced   (posts, releases, reach, impressions)
Outtakes -> what audiences did  (engagement, clicks, saves)
Outcomes -> what changed        (awareness, trust, reputation, behaviour)</code></pre>
<p>Weak measurement counts <strong>outputs</strong> ("we posted 40 times"); strong measurement proves <strong>outcomes</strong> ("sentiment rose, share of voice grew, trust improved"). Modern frameworks (AMEC's integrated evaluation) demand outcomes.</p>
<div class="callout"><span class="badge">Real case</span> <strong>Starbucks</strong> uses social listening to catch complaints and trends early, replies publicly, and tracks sentiment and share of voice — turning millions of daily mentions into an outcome-based reputation dashboard rather than a vanity count of likes.</div>`,
    `<span class="eyebrow">CCO201 · Chương 8 · Bài 8.1</span>
<h2>Truyền thông số &amp; đo lường</h2>
<h3>Số &amp; mạng xã hội</h3>
<p>Kênh số biến truyền thông từ phát một chiều thành <strong>đối thoại</strong>. Công chúng nay trả lời, chia sẻ và phê phán công khai, tức thời. Nghĩa là phủ nhanh hơn nhưng ít kiểm soát hơn — một dòng tweet có thể mở đầu hoặc kết thúc một khủng hoảng.</p>
<h3>Lắng nghe &amp; theo dõi mạng xã hội</h3>
<p><strong>Theo dõi truyền thông / social listening</strong> bám việc gì đang được nói về tổ chức, do ai, và với sắc thái nào (<em>sentiment</em>). Đó là radar cảnh báo sớm cho quản trị vấn đề và vòng phản hồi cho chiến lược.</p>
<h3>Đo lường: sản lượng vs kết quả</h3>
<pre><code>Outputs  -> ta sản xuất gì    (bài đăng, thông cáo, reach, hiển thị)
Outtakes -> công chúng làm gì  (tương tác, click, lưu)
Outcomes -> điều gì thay đổi   (nhận biết, niềm tin, danh tiếng, hành vi)</code></pre>
<p>Đo yếu thì đếm <strong>sản lượng</strong> ("ta đăng 40 lần"); đo mạnh thì chứng minh <strong>kết quả</strong> ("sắc thái tăng, share of voice lên, niềm tin cải thiện"). Các khung hiện đại (đánh giá tích hợp của AMEC) đòi kết quả.</p>
<div class="callout"><span class="badge">Ca thực tế</span> <strong>Starbucks</strong> dùng social listening để bắt khiếu nại và xu hướng sớm, trả lời công khai, và bám sentiment cùng share of voice — biến hàng triệu lượt nhắc mỗi ngày thành bảng đo danh tiếng theo kết quả, thay vì đếm like phù phiếm.</div>`,
  ]]);
const c8q = quiz('cco201-quiz-8', 'Quiz 8 — Digital & measure|||Quiz 8 — Số & đo lường', [
  { id: 'q1', question: 'Khác biệt giữa "outputs" và "outcomes" trong đo lường?|||Difference between outputs and outcomes?', options: ['Không khác gì|||No difference', 'Outputs là thứ ta sản xuất; outcomes là điều thay đổi (niềm tin, danh tiếng, hành vi)|||Outputs are what we produced; outcomes are what changed (trust, reputation, behaviour)', 'Outputs quan trọng hơn outcomes|||Outputs matter more than outcomes', 'Outcomes chỉ là số bài đăng|||Outcomes are just the post count'], correctIndex: 1, explanation: 'Đo mạnh chứng minh outcomes, không dừng ở việc đếm outputs.' },
  { id: 'q2', question: '"Social listening" dùng để làm gì?|||What is social listening used for?', options: ['Nghe nhạc trong văn phòng|||Playing office music', 'Theo dõi ai nói gì về tổ chức & sắc thái, làm radar cảnh báo sớm|||Tracking what is said about the org & sentiment as an early-warning radar', 'Xoá bình luận xấu|||Deleting bad comments', 'Tự động đăng bài|||Auto-posting content'], correctIndex: 1, explanation: 'Social listening là radar cho quản trị vấn đề và vòng phản hồi chiến lược.' },
  { id: 'q3', question: 'Kênh số thay đổi truyền thông theo hướng nào?|||How did digital change communication?', options: ['Từ đối thoại thành phát một chiều|||From conversation to one-way broadcast', 'Từ phát một chiều thành đối thoại hai chiều, thời gian thực, ít kiểm soát hơn|||From broadcast to two-way, real-time conversation with less control', 'Không thay đổi gì|||No change', 'Chỉ dành cho quảng cáo|||Only for advertising'], correctIndex: 1, explanation: 'Công chúng nay phản hồi công khai tức thời — nhanh hơn nhưng khó kiểm soát hơn.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'CCO201',
    slug: 'cco201-corporate-communication',
    title: 'Corporate Communication',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CCO201.webp',
    shortDescription: 'How organizations manage reputation & communication — stakeholders, corporate identity & image, strategy, PR & media relations, internal comms, crisis management, CSR & ESG, digital & measurement. Bilingual, real cases & quizzes.|||Doanh nghiệp quản trị danh tiếng & truyền thông thế nào — stakeholder, bản sắc & hình ảnh, chiến lược, PR & quan hệ báo chí, nội bộ, khủng hoảng, CSR & ESG, số & đo lường. Song ngữ, ca thật & quiz.',
    description: 'Môn <strong>CCO201 — Corporate Communication</strong> (Truyền thông doanh nghiệp, kỳ 4) dạy cách tổ chức <strong>quản trị danh tiếng và truyền thông</strong> với mọi nhóm hữu quan. Từ <strong>định nghĩa &amp; stakeholder</strong> → <strong>bản sắc, hình ảnh &amp; danh tiếng</strong> → <strong>chiến lược truyền thông</strong> (mục tiêu, thông điệp lõi, kênh PESO) → <strong>PR &amp; quan hệ báo chí</strong> → <strong>truyền thông nội bộ</strong> → <strong>quản trị khủng hoảng</strong> → <strong>CSR &amp; ESG</strong> → <strong>truyền thông số &amp; đo lường</strong>. Dựng theo giáo trình chuẩn quốc tế (Cornelissen, Argenti), song ngữ, có ca doanh nghiệp thật và quiz mỗi chương.',
    whatYouLearn: 'Truyền thông doanh nghiệp là gì & các nhóm hữu quan; phân biệt bản sắc / hình ảnh / danh tiếng (RepTrak, identity–image gap); xây chiến lược truyền thông SMART, thông điệp lõi, mô hình kênh PESO; PR & media relations, viết thông cáo báo chí (tháp ngược); truyền thông nội bộ & employee engagement; quản trị vấn đề & khủng hoảng (SCCT, holding statement, ca Tylenol); CSR & ESG, tránh greenwashing; truyền thông số, social listening & đo lường theo outcomes.',
    requirements: 'Không cần kiến thức chuyên sâu. Nên có hiểu biết cơ bản về marketing/kinh doanh và quan tâm tới thương hiệu, báo chí, mạng xã hội.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách nền (Cornelissen, Argenti), PRSA/IABC, HBR, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Truyền thông doanh nghiệp là gì, vì sao là chức năng quản trị.', lessons: [intro] },
    { title: 'Chương 1 — TTDN là gì & stakeholder|||Chapter 1 — What & stakeholders', description: 'Định nghĩa, phạm vi, bản đồ nhóm hữu quan.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Bản sắc, hình ảnh & danh tiếng|||Chapter 2 — Identity, image & reputation', description: 'Identity/image/reputation, identity–image gap, RepTrak.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chiến lược truyền thông|||Chapter 3 — Communication strategy', description: 'Mục tiêu SMART, thông điệp lõi, kênh PESO.', lessons: [c3, c3q] },
    { title: 'Chương 4 — PR & quan hệ báo chí|||Chapter 4 — PR & media relations', description: 'PR vs quảng cáo, media relations, thông cáo báo chí.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Truyền thông nội bộ|||Chapter 5 — Internal communication', description: 'Engagement, kênh nội bộ, nhân viên đại sứ.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Quản trị khủng hoảng|||Chapter 6 — Crisis management', description: 'Issues management, nguyên tắc phản ứng, SCCT.', lessons: [c6, c6q] },
    { title: 'Chương 7 — CSR & bền vững|||Chapter 7 — CSR & sustainability', description: 'CSR, ESG, báo cáo bền vững, greenwashing.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Truyền thông số & đo lường|||Chapter 8 — Digital & measurement', description: 'Social listening, outputs vs outcomes, KPI danh tiếng.', lessons: [c8, c8q] },
  ],
};
