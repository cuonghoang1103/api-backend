/**
 * CRM301 — Crisis Communication & Reputation Management. Truyền thông khủng
 * hoảng & Quản trị danh tiếng (ngành Truyền thông FPTU). Môn KHÔNG có FLM →
 * giáo trình chuẩn quốc tế: Coombs "Ongoing Crisis Communication", Fearn-Banks
 * "Crisis Communications", Regester & Larkin, PRSA, HBR. Song ngữ + mô hình +
 * ca thật. Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('crm301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách kinh điển (Coombs, Fearn-Banks, Regester & Larkin), tổ chức nghề (PRSA, IPRA), HBR, YouTube, công cụ social listening, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">CRM301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>crisis communication and reputation management</strong> — issues management, response strategy, planning, digital response and recovery — in one place. This subject has no FLM syllabus, so it follows the international standard texts and professional bodies.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://us.sagepub.com/en-us/nam/ongoing-crisis-communication/book259346" target="_blank" rel="noopener">W. Timothy Coombs — <em>Ongoing Crisis Communication</em> (the SCCT source)</a></li>
<li><a href="https://www.routledge.com/Crisis-Communications-A-Casebook-Approach/Fearn-Banks/p/book/9781138338111" target="_blank" rel="noopener">Kathleen Fearn-Banks — <em>Crisis Communications: A Casebook Approach</em></a></li>
<li><a href="https://www.koganpage.com/product/risk-issues-and-crisis-management-in-public-relations-9780749453930" target="_blank" rel="noopener">Regester &amp; Larkin — <em>Risk, Issues and Crisis Management in Public Relations</em></a></li>
</ul>
<h3>🌐 Professional bodies &amp; articles</h3>
<ul>
<li><a href="https://www.prsa.org/" target="_blank" rel="noopener">PRSA — Public Relations Society of America</a></li>
<li><a href="https://www.ipra.org/" target="_blank" rel="noopener">IPRA — International Public Relations Association</a></li>
<li><a href="https://hbr.org/topic/subject/crisis-management" target="_blank" rel="noopener">Harvard Business Review — Crisis Management</a></li>
</ul>
<h3>▶️ YouTube &amp; talks</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=crisis+communication+case+study" target="_blank" rel="noopener">Crisis communication case studies</a> — Tylenol, BP, United and more</li>
<li><a href="https://www.ted.com/topics/communication" target="_blank" rel="noopener">TED — communication &amp; trust talks</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.brandwatch.com/" target="_blank" rel="noopener">Brandwatch</a> — social listening &amp; sentiment</li>
<li><a href="https://mention.com/" target="_blank" rel="noopener">Mention</a> — real-time brand monitoring</li>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — spot spikes in attention early</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Understand</strong> — what a crisis is, crisis types, the crisis lifecycle and why reputation is an asset at risk.</li>
<li><strong>Prevent</strong> — issues management, early-warning scanning, risk assessment.</li>
<li><strong>Respond</strong> — SCCT strategy match, a crisis plan &amp; team, the first 24 hours, digital channels.</li>
<li><strong>Recover</strong> — apology &amp; trust rebuilding, post-crisis learning, ethics &amp; transparency.</li>
</ol></div>`,
    `<span class="eyebrow">CRM301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>truyền thông khủng hoảng và quản trị danh tiếng</strong> — quản trị vấn đề, chiến lược ứng phó, lập kế hoạch, ứng phó số và phục hồi — gom về một chỗ. Môn này không có giáo trình FLM nên bám theo sách chuẩn quốc tế và các tổ chức nghề.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://us.sagepub.com/en-us/nam/ongoing-crisis-communication/book259346" target="_blank" rel="noopener">W. Timothy Coombs — <em>Ongoing Crisis Communication</em> (nguồn của SCCT)</a></li>
<li><a href="https://www.routledge.com/Crisis-Communications-A-Casebook-Approach/Fearn-Banks/p/book/9781138338111" target="_blank" rel="noopener">Kathleen Fearn-Banks — <em>Crisis Communications: A Casebook Approach</em></a></li>
<li><a href="https://www.koganpage.com/product/risk-issues-and-crisis-management-in-public-relations-9780749453930" target="_blank" rel="noopener">Regester &amp; Larkin — <em>Risk, Issues and Crisis Management in Public Relations</em></a></li>
</ul>
<h3>🌐 Tổ chức nghề &amp; bài viết</h3>
<ul>
<li><a href="https://www.prsa.org/" target="_blank" rel="noopener">PRSA — Hiệp hội Quan hệ công chúng Hoa Kỳ</a></li>
<li><a href="https://www.ipra.org/" target="_blank" rel="noopener">IPRA — Hiệp hội Quan hệ công chúng Quốc tế</a></li>
<li><a href="https://hbr.org/topic/subject/crisis-management" target="_blank" rel="noopener">Harvard Business Review — Quản trị khủng hoảng</a></li>
</ul>
<h3>▶️ YouTube &amp; bài nói</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=crisis+communication+case+study" target="_blank" rel="noopener">Ca nghiên cứu truyền thông khủng hoảng</a> — Tylenol, BP, United…</li>
<li><a href="https://www.ted.com/topics/communication" target="_blank" rel="noopener">TED — bài nói về truyền thông &amp; niềm tin</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.brandwatch.com/" target="_blank" rel="noopener">Brandwatch</a> — lắng nghe mạng xã hội &amp; đo cảm xúc</li>
<li><a href="https://mention.com/" target="_blank" rel="noopener">Mention</a> — theo dõi thương hiệu thời gian thực</li>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — phát hiện đột biến chú ý sớm</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Hiểu</strong> — khủng hoảng là gì, các loại khủng hoảng, vòng đời và vì sao danh tiếng là tài sản có thể mất.</li>
<li><strong>Phòng ngừa</strong> — quản trị vấn đề, quét cảnh báo sớm, đánh giá rủi ro.</li>
<li><strong>Ứng phó</strong> — khớp chiến lược SCCT, kế hoạch &amp; đội khủng hoảng, 24 giờ đầu, kênh số.</li>
<li><strong>Phục hồi</strong> — xin lỗi &amp; xây lại niềm tin, học sau khủng hoảng, đạo đức &amp; minh bạch.</li>
</ol></div>`,
  ]]);

const intro = doc('crm301-0-1-overview', 'Course overview: crisis communication & reputation|||Tổng quan: truyền thông khủng hoảng & danh tiếng',
  'Môn học làm gì; khủng hoảng đe doạ danh tiếng thế nào; lộ trình 4 bước Hiểu → Phòng ngừa → Ứng phó → Phục hồi, bám Coombs & Fearn-Banks.',
  [[
    `<span class="eyebrow">CRM301 · Lesson 0.1 · Overview</span>
<h2>Crisis Communication &amp; Reputation Management</h2>
<p class="lead">This course teaches you to <strong>protect an organization's reputation before, during and after a crisis</strong>. A crisis is a sudden, unexpected event that threatens to harm an organization and its stakeholders — and the way you <em>communicate</em> often decides whether trust survives.</p>
<h3>Why it matters</h3>
<p>Reputation is an intangible asset built over years and lost in hours. Two organizations can face the same accident; the one that communicates quickly, honestly and with empathy keeps its customers, while the one that hides or blames loses them. Crisis communication is that difference, made deliberate.</p>
<h3>The four-step roadmap</h3>
<ul>
<li><strong>Understand</strong> — what counts as a crisis, its types and lifecycle (Ch. 1).</li>
<li><strong>Prevent</strong> — issues management and early warning (Ch. 2).</li>
<li><strong>Respond</strong> — SCCT theory, planning, the first 24 hours, digital &amp; social (Ch. 3–6).</li>
<li><strong>Recover</strong> — reputation repair, apology, ethics and cases (Ch. 7–8).</li>
</ul>
<div class="callout"><span class="badge">Core idea</span> You cannot always prevent a crisis, but you can almost always control your <strong>response</strong> — and the response is what stakeholders remember.</div>`,
    `<span class="eyebrow">CRM301 · Bài 0.1 · Tổng quan</span>
<h2>Truyền thông khủng hoảng &amp; Quản trị danh tiếng</h2>
<p class="lead">Môn này dạy bạn <strong>bảo vệ danh tiếng của tổ chức trước, trong và sau khủng hoảng</strong>. Khủng hoảng là sự kiện bất ngờ, đột ngột đe doạ gây hại cho tổ chức và các bên liên quan — và cách bạn <em>truyền thông</em> thường quyết định niềm tin có sống sót hay không.</p>
<h3>Vì sao quan trọng</h3>
<p>Danh tiếng là tài sản vô hình xây trong nhiều năm nhưng mất trong vài giờ. Hai tổ chức có thể gặp cùng một sự cố; bên truyền thông nhanh, trung thực và có sự đồng cảm giữ được khách hàng, còn bên che giấu hoặc đổ lỗi thì mất họ. Truyền thông khủng hoảng chính là sự khác biệt đó, được làm một cách chủ đích.</p>
<h3>Lộ trình bốn bước</h3>
<ul>
<li><strong>Hiểu</strong> — thế nào là khủng hoảng, loại và vòng đời (Ch. 1).</li>
<li><strong>Phòng ngừa</strong> — quản trị vấn đề và cảnh báo sớm (Ch. 2).</li>
<li><strong>Ứng phó</strong> — lý thuyết SCCT, lập kế hoạch, 24 giờ đầu, số &amp; mạng xã hội (Ch. 3–6).</li>
<li><strong>Phục hồi</strong> — phục hồi danh tiếng, xin lỗi, đạo đức và ca điển hình (Ch. 7–8).</li>
</ul>
<div class="callout"><span class="badge">Ý cốt lõi</span> Bạn không phải lúc nào cũng ngăn được khủng hoảng, nhưng gần như luôn kiểm soát được <strong>cách ứng phó</strong> — và đó là thứ các bên liên quan nhớ.</div>`,
  ]]);

const c1 = doc('crm301-1-1-what-is-crisis', '1.1 — What is a crisis & reputation|||1.1 — Khủng hoảng & danh tiếng là gì',
  'Định nghĩa khủng hoảng (Coombs), phân biệt sự cố/vấn đề/khủng hoảng; các loại khủng hoảng; vòng đời 3 giai đoạn; danh tiếng như tài sản.',
  [[
    `<span class="eyebrow">CRM301 · Chapter 1 · Lesson 1.1</span>
<h2>What is a crisis, and what is reputation?</h2>
<h3>Definition</h3>
<p>Coombs defines a <strong>crisis</strong> as "the perception of an unpredictable event that threatens important expectancies of stakeholders and can seriously impact an organization's performance." Note the word <em>perception</em>: a crisis exists when stakeholders believe it does.</p>
<h3>Incident vs. issue vs. crisis</h3>
<ul>
<li><strong>Incident</strong> — a small, localized disruption handled by routine.</li>
<li><strong>Issue</strong> — a gap between organizational practice and stakeholder expectation that builds over time.</li>
<li><strong>Crisis</strong> — a sudden threat demanding immediate response under uncertainty and time pressure.</li>
</ul>
<h3>Types of crisis</h3>
<p>Fearn-Banks and others sort crises into families: <strong>natural</strong> (flood, earthquake), <strong>technological</strong> (product failure, data breach), <strong>human-caused / organizational misdeeds</strong> (fraud, misconduct), and <strong>malevolence</strong> (sabotage, tampering).</p>
<h3>The crisis lifecycle</h3>
<pre><code>Pre-crisis   -> signals &amp; risk build up (prevention window)
Crisis event -> the trigger goes public (response window)
Post-crisis  -> recovery, learning &amp; reputation repair
</code></pre>
<div class="callout"><span class="badge">Reputation = asset at risk</span> Reputation is stakeholders' collective judgment of an organization. It lowers costs, attracts talent and buys goodwill — which is exactly why a crisis, by damaging it, is so expensive.</div>`,
    `<span class="eyebrow">CRM301 · Chương 1 · Bài 1.1</span>
<h2>Khủng hoảng là gì, và danh tiếng là gì?</h2>
<h3>Định nghĩa</h3>
<p>Coombs định nghĩa <strong>khủng hoảng</strong> là "nhận thức về một sự kiện khó lường đe doạ những kỳ vọng quan trọng của các bên liên quan và có thể tác động nghiêm trọng tới hoạt động của tổ chức". Chú ý từ <em>nhận thức</em>: khủng hoảng tồn tại khi các bên liên quan tin là có.</p>
<h3>Sự cố &amp; vấn đề &amp; khủng hoảng</h3>
<ul>
<li><strong>Sự cố (incident)</strong> — gián đoạn nhỏ, cục bộ, xử lý bằng quy trình thường ngày.</li>
<li><strong>Vấn đề (issue)</strong> — khoảng cách giữa cách tổ chức làm và kỳ vọng của các bên, tích tụ theo thời gian.</li>
<li><strong>Khủng hoảng (crisis)</strong> — mối đe doạ đột ngột đòi hỏi ứng phó tức thì trong bất định và áp lực thời gian.</li>
</ul>
<h3>Các loại khủng hoảng</h3>
<p>Fearn-Banks và các tác giả khác chia khủng hoảng thành nhóm: <strong>thiên tai</strong> (lũ, động đất), <strong>công nghệ</strong> (lỗi sản phẩm, rò rỉ dữ liệu), <strong>do con người / sai phạm tổ chức</strong> (gian lận, sai trái), và <strong>ác ý</strong> (phá hoại, đầu độc sản phẩm).</p>
<h3>Vòng đời khủng hoảng</h3>
<pre><code>Trước khủng hoảng -> tín hiệu &amp; rủi ro tích tụ (cửa sổ phòng ngừa)
Sự kiện khủng hoảng -> ngòi nổ ra công chúng (cửa sổ ứng phó)
Sau khủng hoảng    -> phục hồi, rút bài học &amp; sửa danh tiếng
</code></pre>
<div class="callout"><span class="badge">Danh tiếng = tài sản có thể mất</span> Danh tiếng là đánh giá tập thể của các bên liên quan về tổ chức. Nó hạ chi phí, thu hút nhân tài và tạo thiện chí — chính vì thế khủng hoảng, khi làm tổn hại nó, lại đắt đến vậy.</div>`,
  ]]);

const c1q = quiz('crm301-quiz-1', 'Quiz 1 — Crisis & reputation|||Quiz 1 — Khủng hoảng & danh tiếng', [
  { id: 'q1', question: 'In Coombs’ definition, a crisis exists primarily because of stakeholder…?|||Theo định nghĩa của Coombs, khủng hoảng tồn tại chủ yếu vì… của các bên liên quan?', options: ['Budget|||Ngân sách', 'Perception|||Nhận thức', 'Location|||Vị trí', 'Headcount|||Quy mô nhân sự'], correctIndex: 1, explanation: 'Coombs nhấn mạnh "perception" — khủng hoảng tồn tại khi các bên liên quan tin là có.' },
  { id: 'q2', question: 'A product recall due to a manufacturing defect is which crisis type?|||Thu hồi sản phẩm do lỗi sản xuất thuộc loại khủng hoảng nào?', options: ['Natural|||Thiên tai', 'Technological / product failure|||Công nghệ / lỗi sản phẩm', 'Malevolence|||Ác ý', 'Financial windfall|||Lộc tài chính'], correctIndex: 1, explanation: 'Lỗi sản xuất là khủng hoảng công nghệ / lỗi sản phẩm.' },
  { id: 'q3', question: 'The prevention window sits in which stage of the lifecycle?|||Cửa sổ phòng ngừa nằm ở giai đoạn nào của vòng đời?', options: ['Post-crisis|||Sau khủng hoảng', 'Pre-crisis|||Trước khủng hoảng', 'Crisis event|||Sự kiện khủng hoảng', 'It has no stages|||Không có giai đoạn nào'], correctIndex: 1, explanation: 'Phòng ngừa diễn ra ở giai đoạn trước khủng hoảng, khi tín hiệu và rủi ro còn tích tụ.' },
]);

const c2 = doc('crm301-2-1-issues-management', '2.1 — Issues management & prevention|||2.1 — Quản trị vấn đề & phòng ngừa',
  'Vấn đề tiến hoá thành khủng hoảng thế nào; quét cảnh báo sớm (environmental scanning); đánh giá rủi ro (khả năng × tác động); Regester & Larkin.',
  [[
    `<span class="eyebrow">CRM301 · Chapter 2 · Lesson 2.1</span>
<h2>Issues management &amp; prevention</h2>
<p class="lead">Most crises do not appear from nowhere — they grow from <strong>issues</strong> that were visible earlier. Issues management is the discipline of spotting and defusing them before they ignite.</p>
<h3>How an issue becomes a crisis</h3>
<p>Regester &amp; Larkin describe an <strong>issue lifecycle</strong>: latent (few notice) → emerging (media &amp; activists pick it up) → current (public debate) → crisis (it forces action). The earlier you intervene, the cheaper and quieter the fix.</p>
<h3>Early-warning scanning</h3>
<ul>
<li><strong>Environmental scanning</strong> — systematically monitor news, social media, regulators and industry trends.</li>
<li><strong>Stakeholder listening</strong> — track complaints, reviews and employee signals; they are leading indicators.</li>
<li><strong>Trend spotting</strong> — a rising volume of the same complaint is a warning, not noise.</li>
</ul>
<h3>Risk assessment</h3>
<pre><code>Risk priority = Likelihood  x  Impact

 High likelihood + High impact -> prepare a plan now
 Low  likelihood + High impact -> monitor, keep a playbook
 High likelihood + Low  impact -> fix the process
</code></pre>
<div class="callout"><span class="badge">Prevention beats response</span> A dollar spent on issues management is far cheaper than the reputation lost in a full-blown crisis. The best crisis is the one that never happens.</div>`,
    `<span class="eyebrow">CRM301 · Chương 2 · Bài 2.1</span>
<h2>Quản trị vấn đề &amp; phòng ngừa</h2>
<p class="lead">Phần lớn khủng hoảng không xuất hiện từ hư không — chúng lớn lên từ <strong>vấn đề</strong> vốn đã thấy trước đó. Quản trị vấn đề là kỷ luật phát hiện và tháo ngòi chúng trước khi bùng nổ.</p>
<h3>Vấn đề thành khủng hoảng thế nào</h3>
<p>Regester &amp; Larkin mô tả một <strong>vòng đời vấn đề</strong>: tiềm ẩn (ít ai chú ý) → nổi lên (báo chí &amp; nhà hoạt động để ý) → hiện hành (tranh luận công khai) → khủng hoảng (buộc phải hành động). Can thiệp càng sớm, cách sửa càng rẻ và êm.</p>
<h3>Quét cảnh báo sớm</h3>
<ul>
<li><strong>Quét môi trường</strong> — theo dõi có hệ thống tin tức, mạng xã hội, cơ quan quản lý và xu hướng ngành.</li>
<li><strong>Lắng nghe các bên liên quan</strong> — theo dõi khiếu nại, đánh giá và tín hiệu từ nhân viên; đó là chỉ báo sớm.</li>
<li><strong>Phát hiện xu hướng</strong> — cùng một khiếu nại tăng dần là cảnh báo, không phải nhiễu.</li>
</ul>
<h3>Đánh giá rủi ro</h3>
<pre><code>Ưu tiên rủi ro = Khả năng  x  Tác động

 Khả năng cao + Tác động cao -> lập kế hoạch ngay
 Khả năng thấp + Tác động cao -> theo dõi, giữ sẵn playbook
 Khả năng cao + Tác động thấp -> sửa quy trình
</code></pre>
<div class="callout"><span class="badge">Phòng hơn chống</span> Một đồng chi cho quản trị vấn đề rẻ hơn nhiều so với danh tiếng mất trong khủng hoảng bùng phát. Khủng hoảng tốt nhất là khủng hoảng không bao giờ xảy ra.</div>`,
  ]]);

const c2q = quiz('crm301-quiz-2', 'Quiz 2 — Issues management|||Quiz 2 — Quản trị vấn đề', [
  { id: 'q1', question: 'What is the goal of issues management?|||Mục tiêu của quản trị vấn đề là gì?', options: ['To apologize faster|||Xin lỗi nhanh hơn', 'To spot & defuse issues before they become crises|||Phát hiện & tháo ngòi vấn đề trước khi thành khủng hoảng', 'To hire more staff|||Tuyển thêm nhân sự', 'To increase ad spend|||Tăng chi quảng cáo'], correctIndex: 1, explanation: 'Quản trị vấn đề nhằm phát hiện và tháo ngòi vấn đề sớm, trước khi bùng thành khủng hoảng.' },
  { id: 'q2', question: 'In risk assessment, priority is a function of…?|||Trong đánh giá rủi ro, mức ưu tiên là hàm của…?', options: ['Likelihood × Impact|||Khả năng × Tác động', 'Budget × Headcount|||Ngân sách × Nhân sự', 'Followers × Likes|||Người theo dõi × Lượt thích', 'Time × Distance|||Thời gian × Khoảng cách'], correctIndex: 0, explanation: 'Ưu tiên rủi ro = Khả năng × Tác động.' },
  { id: 'q3', question: 'Systematically monitoring news, social media and regulators is called…?|||Theo dõi có hệ thống tin tức, mạng xã hội và cơ quan quản lý gọi là…?', options: ['A holding statement|||Tuyên bố tạm', 'Environmental scanning|||Quét môi trường', 'A dark site|||Dark site', 'An apology|||Lời xin lỗi'], correctIndex: 1, explanation: 'Đó là quét môi trường (environmental scanning) — nền của cảnh báo sớm.' },
]);

const c3 = doc('crm301-3-1-scct', '3.1 — SCCT: Situational Crisis Communication Theory|||3.1 — Lý thuyết SCCT',
  'SCCT của Coombs: gán trách nhiệm quyết định chiến lược; 3 nhóm crisis type (victim/accidental/preventable); các chiến lược ứng phó (deny/diminish/rebuild/bolster).',
  [[
    `<span class="eyebrow">CRM301 · Chapter 3 · Lesson 3.1</span>
<h2>SCCT — matching response to responsibility</h2>
<p class="lead"><strong>Situational Crisis Communication Theory (SCCT)</strong>, developed by W. Timothy Coombs, is the field's most-used framework. Its core claim: the <em>right</em> response depends on how much <strong>responsibility</strong> stakeholders attribute to the organization.</p>
<h3>Three crisis clusters (rising attribution)</h3>
<ul>
<li><strong>Victim cluster</strong> — the organization is also a victim (natural disaster, rumor, tampering). Low responsibility.</li>
<li><strong>Accidental cluster</strong> — unintentional acts (technical-error accident, product harm). Moderate responsibility.</li>
<li><strong>Preventable cluster</strong> — knowing misdeeds (management misconduct, violated laws). High responsibility.</li>
</ul>
<h3>Response strategies</h3>
<pre><code>Deny     -> attack accuser, deny, scapegoat   (only if truly not responsible)
Diminish -> excuse, justify                   (accidental: reduce attribution)
Rebuild  -> apology, compensation             (preventable: accept &amp; repair)
Bolster  -> remind, ingratiate, victimage     (supporting, never alone)
</code></pre>
<h3>The matching principle</h3>
<p>The more responsibility stakeholders assign, the more <strong>accommodative</strong> the response must be. Denying a preventable crisis enrages people; over-apologizing for a victim crisis needlessly accepts blame. Match the strategy to the cluster.</p>
<div class="callout"><span class="badge">Real case</span> When tampering hit a victim-cluster crisis, an organization that framed itself as a co-victim while protecting customers (recall + redesign) kept trust — the response fit the low-attribution situation.</div>`,
    `<span class="eyebrow">CRM301 · Chương 3 · Bài 3.1</span>
<h2>SCCT — khớp ứng phó với mức trách nhiệm</h2>
<p class="lead"><strong>Lý thuyết truyền thông khủng hoảng theo tình huống (SCCT)</strong>, do W. Timothy Coombs phát triển, là khung được dùng nhiều nhất trong ngành. Ý cốt lõi: ứng phó <em>đúng</em> tuỳ vào mức <strong>trách nhiệm</strong> mà các bên liên quan gán cho tổ chức.</p>
<h3>Ba nhóm khủng hoảng (trách nhiệm tăng dần)</h3>
<ul>
<li><strong>Nhóm nạn nhân</strong> — tổ chức cũng là nạn nhân (thiên tai, tin đồn, bị đầu độc sản phẩm). Trách nhiệm thấp.</li>
<li><strong>Nhóm tai nạn</strong> — hành vi vô ý (sự cố kỹ thuật, sản phẩm gây hại). Trách nhiệm vừa.</li>
<li><strong>Nhóm ngăn được</strong> — sai phạm có chủ ý (ban lãnh đạo sai trái, vi phạm luật). Trách nhiệm cao.</li>
</ul>
<h3>Các chiến lược ứng phó</h3>
<pre><code>Chối (deny)     -> phản công, phủ nhận, đổ lỗi   (chỉ khi thật sự vô can)
Giảm (diminish) -> biện minh, giải thích          (tai nạn: giảm quy trách)
Xây lại (rebuild) -> xin lỗi, đền bù              (ngăn được: nhận &amp; sửa)
Củng cố (bolster) -> nhắc công, tạo thiện cảm     (bổ trợ, không dùng một mình)
</code></pre>
<h3>Nguyên tắc khớp</h3>
<p>Các bên gán trách nhiệm càng nhiều, ứng phó càng phải <strong>nhận lỗi &amp; hoà giải</strong>. Chối một khủng hoảng ngăn được khiến công chúng phẫn nộ; xin lỗi quá mức cho khủng hoảng nạn nhân lại nhận tội một cách không cần thiết. Hãy khớp chiến lược với nhóm.</p>
<div class="callout"><span class="badge">Ca thật</span> Khi bị đầu độc sản phẩm — một khủng hoảng nhóm nạn nhân — tổ chức tự đặt mình là đồng nạn nhân trong khi bảo vệ khách hàng (thu hồi + thiết kế lại) đã giữ được niềm tin: ứng phó khớp với tình huống trách nhiệm thấp.</div>`,
  ]]);

const c3q = quiz('crm301-quiz-3', 'Quiz 3 — SCCT|||Quiz 3 — SCCT', [
  { id: 'q1', question: 'SCCT says the right response depends mainly on…?|||SCCT cho rằng ứng phó đúng phụ thuộc chủ yếu vào…?', options: ['Ad budget|||Ngân sách quảng cáo', 'Attributed responsibility|||Mức trách nhiệm được gán', 'Company age|||Tuổi công ty', 'Time of day|||Thời điểm trong ngày'], correctIndex: 1, explanation: 'SCCT khớp chiến lược với mức trách nhiệm mà các bên liên quan gán cho tổ chức.' },
  { id: 'q2', question: 'A preventable-cluster crisis (management misconduct) calls for which strategy?|||Khủng hoảng nhóm ngăn được (ban lãnh đạo sai trái) cần chiến lược nào?', options: ['Deny|||Chối', 'Rebuild (apology & compensation)|||Xây lại (xin lỗi & đền bù)', 'Ignore|||Phớt lờ', 'Attack the accuser|||Phản công người tố'], correctIndex: 1, explanation: 'Trách nhiệm cao đòi ứng phó nhận lỗi: xin lỗi và đền bù (rebuild).' },
  { id: 'q3', question: 'Bolstering strategies (remind, ingratiate) should be used…?|||Chiến lược củng cố (nhắc công, tạo thiện cảm) nên dùng…?', options: ['Alone, as the whole response|||Một mình, như toàn bộ ứng phó', 'As a supplement, never alone|||Như phần bổ trợ, không dùng một mình', 'Only to deny facts|||Chỉ để phủ nhận sự thật', 'Never|||Không bao giờ'], correctIndex: 1, explanation: 'Bolster chỉ là chiến lược bổ trợ, đi kèm chiến lược chính chứ không đứng một mình.' },
]);

const c4 = doc('crm301-4-1-planning', '4.1 — Crisis planning: plan, team & spokesperson|||4.1 — Lập kế hoạch: kế hoạch, đội & người phát ngôn',
  'Crisis Management Plan (CMP); crisis team & vai trò; chọn & huấn luyện người phát ngôn; chuẩn bị holding statement và cây leo thang.',
  [[
    `<span class="eyebrow">CRM301 · Chapter 4 · Lesson 4.1</span>
<h2>Crisis planning — prepare before you need it</h2>
<p class="lead">You write the plan on a calm day, not a burning one. A <strong>Crisis Management Plan (CMP)</strong> is a pre-agreed reference that removes guesswork when minutes matter.</p>
<h3>What a CMP contains</h3>
<ul>
<li><strong>Roles &amp; contacts</strong> — who is on the crisis team, reachable 24/7.</li>
<li><strong>Escalation ladder</strong> — what severity triggers whom.</li>
<li><strong>Pre-drafted templates</strong> — holding statements, stakeholder lists, channels.</li>
<li><strong>Decision authority</strong> — who may speak, approve, and act.</li>
</ul>
<h3>The crisis team</h3>
<p>A cross-functional team: a leader (decides), communications (messaging), legal (liability), operations (facts on the ground), and HR (employees). The mistake to avoid is a team that is <em>all</em> lawyers — legally safe silence is often reputational suicide.</p>
<h3>The spokesperson</h3>
<p>Pick and <strong>train</strong> spokespersons in advance. A good spokesperson is calm, credible, empathetic, and speaks in plain language. One voice, one message: multiple uncoordinated voices create contradiction.</p>
<pre><code>Holding statement (ready in advance):
 "We are aware of [event]. The safety of [stakeholders] is our
  priority. We are gathering facts and will update by [time]."
</code></pre>
<div class="callout"><span class="badge">Rehearse it</span> A plan never tested is a plan that fails. Run simulations so the team acts from memory, not from the binder, under pressure.</div>`,
    `<span class="eyebrow">CRM301 · Chương 4 · Bài 4.1</span>
<h2>Lập kế hoạch khủng hoảng — chuẩn bị trước khi cần</h2>
<p class="lead">Bạn viết kế hoạch vào ngày yên, không phải ngày cháy. <strong>Kế hoạch Quản trị Khủng hoảng (CMP)</strong> là tài liệu thống nhất trước, xoá đoán mò khi từng phút đều quý.</p>
<h3>CMP gồm những gì</h3>
<ul>
<li><strong>Vai trò &amp; liên hệ</strong> — ai trong đội khủng hoảng, gọi được 24/7.</li>
<li><strong>Cây leo thang</strong> — mức nghiêm trọng nào kích hoạt ai.</li>
<li><strong>Mẫu soạn sẵn</strong> — tuyên bố tạm, danh sách các bên, kênh.</li>
<li><strong>Thẩm quyền quyết định</strong> — ai được phát ngôn, phê duyệt và hành động.</li>
</ul>
<h3>Đội khủng hoảng</h3>
<p>Đội đa chức năng: người dẫn (quyết định), truyền thông (thông điệp), pháp lý (trách nhiệm), vận hành (sự việc thực địa), và nhân sự (nhân viên). Sai lầm cần tránh là đội <em>toàn</em> luật sư — im lặng an toàn về luật thường là tự sát về danh tiếng.</p>
<h3>Người phát ngôn</h3>
<p>Chọn và <strong>huấn luyện</strong> người phát ngôn từ trước. Người phát ngôn tốt thì bình tĩnh, đáng tin, đồng cảm và nói bằng ngôn ngữ dễ hiểu. Một tiếng nói, một thông điệp: nhiều tiếng nói không phối hợp sẽ tạo mâu thuẫn.</p>
<pre><code>Tuyên bố tạm (chuẩn bị sẵn):
 "Chúng tôi đã biết về [sự việc]. An toàn của [các bên] là ưu tiên
  của chúng tôi. Chúng tôi đang thu thập thông tin và sẽ cập nhật lúc [giờ]."
</code></pre>
<div class="callout"><span class="badge">Hãy diễn tập</span> Kế hoạch chưa thử là kế hoạch sẽ hỏng. Chạy diễn tập để đội hành động theo trí nhớ, không phải giở tài liệu, khi bị áp lực.</div>`,
  ]]);

const c4q = quiz('crm301-quiz-4', 'Quiz 4 — Crisis planning|||Quiz 4 — Lập kế hoạch', [
  { id: 'q1', question: 'When should a Crisis Management Plan be written?|||Kế hoạch Quản trị Khủng hoảng nên được viết khi nào?', options: ['During the crisis|||Trong lúc khủng hoảng', 'In advance, on a calm day|||Từ trước, vào ngày yên', 'After the crisis|||Sau khủng hoảng', 'Never|||Không bao giờ'], correctIndex: 1, explanation: 'CMP phải soạn trước, khi bình tĩnh, để dùng khi từng phút đều quý.' },
  { id: 'q2', question: 'A pre-drafted first message that buys time is called a…?|||Thông điệp đầu tiên soạn sẵn để câu giờ gọi là…?', options: ['Dark site|||Dark site', 'Holding statement|||Tuyên bố tạm', 'Press junket|||Chuyến báo chí', 'Bolstering|||Củng cố'], correctIndex: 1, explanation: 'Đó là holding statement (tuyên bố tạm) — thừa nhận biết sự việc và hẹn cập nhật.' },
  { id: 'q3', question: 'A common danger when the crisis team is all lawyers is…?|||Nguy cơ thường gặp khi đội khủng hoảng toàn luật sư là…?', options: ['Speaking too openly|||Nói quá cởi mở', 'Legally safe silence that damages reputation|||Im lặng an toàn về luật nhưng hại danh tiếng', 'Too much empathy|||Quá nhiều đồng cảm', 'Updating too often|||Cập nhật quá thường'], correctIndex: 1, explanation: 'Im lặng "an toàn pháp lý" thường là tự sát về danh tiếng — cần cân bằng với truyền thông.' },
]);

const c5 = doc('crm301-5-1-first-response', '5.1 — Responding: the first 24 hours|||5.1 — Ứng phó: 24 giờ đầu',
  'Vàng của tốc độ; nguyên tắc first 24h; holding statement → cập nhật; chọn kênh; nói gì / tránh gì (no comment, đầu cơ, đổ lỗi); STOP nguyên tắc.',
  [[
    `<span class="eyebrow">CRM301 · Chapter 5 · Lesson 5.1</span>
<h2>The first 24 hours</h2>
<p class="lead">In a crisis, <strong>speed and empathy</strong> beat perfection. The organization that speaks first frames the story; silence lets others fill the vacuum — usually with rumor.</p>
<h3>First-response principles</h3>
<ul>
<li><strong>Be quick</strong> — issue a holding statement fast, even before all facts are known.</li>
<li><strong>Be accurate</strong> — never speculate; say what you know and what you are doing.</li>
<li><strong>Be consistent</strong> — one voice across every channel.</li>
<li><strong>Show care first</strong> — address people harmed before defending the brand.</li>
</ul>
<h3>Sequence</h3>
<pre><code>Hour 0   -> acknowledge, express concern (holding statement)
Hour 1-3 -> verify facts, brief the spokesperson, alert stakeholders
Hour 3-24 -> regular updates, correct misinformation, show action
</code></pre>
<h3>What to avoid</h3>
<ul>
<li><strong>"No comment"</strong> — reads as guilt or contempt.</li>
<li><strong>Speculation</strong> — a wrong early claim becomes a second crisis.</li>
<li><strong>Blaming</strong> victims or partners before facts are in.</li>
</ul>
<div class="callout"><span class="badge">STOP</span> A useful checklist under pressure: <strong>S</strong>afety first, <strong>T</strong>ell the truth, <strong>O</strong>ffer care, <strong>P</strong>rovide updates.</div>`,
    `<span class="eyebrow">CRM301 · Chương 5 · Bài 5.1</span>
<h2>24 giờ đầu</h2>
<p class="lead">Trong khủng hoảng, <strong>tốc độ và đồng cảm</strong> thắng sự hoàn hảo. Tổ chức lên tiếng trước sẽ định khung câu chuyện; im lặng để người khác lấp khoảng trống — thường bằng tin đồn.</p>
<h3>Nguyên tắc ứng phó đầu</h3>
<ul>
<li><strong>Nhanh</strong> — ra tuyên bố tạm sớm, kể cả khi chưa đủ dữ kiện.</li>
<li><strong>Chính xác</strong> — không đầu cơ suy đoán; nói điều bạn biết và điều bạn đang làm.</li>
<li><strong>Nhất quán</strong> — một tiếng nói trên mọi kênh.</li>
<li><strong>Quan tâm trước</strong> — lo cho người bị hại trước khi bảo vệ thương hiệu.</li>
</ul>
<h3>Trình tự</h3>
<pre><code>Giờ 0    -> thừa nhận, bày tỏ quan ngại (tuyên bố tạm)
Giờ 1-3  -> xác minh dữ kiện, brief người phát ngôn, báo các bên
Giờ 3-24 -> cập nhật đều đặn, đính chính tin sai, cho thấy hành động
</code></pre>
<h3>Cần tránh</h3>
<ul>
<li><strong>"Miễn bình luận"</strong> — bị đọc là có tội hoặc coi thường.</li>
<li><strong>Suy đoán</strong> — một khẳng định sớm mà sai trở thành khủng hoảng thứ hai.</li>
<li><strong>Đổ lỗi</strong> cho nạn nhân hoặc đối tác khi chưa rõ sự việc.</li>
</ul>
<div class="callout"><span class="badge">STOP</span> Một checklist hữu ích khi bị áp lực: <strong>S</strong>afety (an toàn trước), <strong>T</strong>ell the truth (nói thật), <strong>O</strong>ffer care (bày tỏ quan tâm), <strong>P</strong>rovide updates (cập nhật đều).</div>`,
  ]]);

const c5q = quiz('crm301-quiz-5', 'Quiz 5 — First response|||Quiz 5 — Ứng phó đầu', [
  { id: 'q1', question: 'Why speak first in a crisis?|||Vì sao nên lên tiếng trước trong khủng hoảng?', options: ['To sell more|||Để bán được nhiều hơn', 'To frame the story before rumor fills the vacuum|||Để định khung câu chuyện trước khi tin đồn lấp khoảng trống', 'To avoid updates|||Để khỏi phải cập nhật', 'To blame partners|||Để đổ lỗi đối tác'], correctIndex: 1, explanation: 'Lên tiếng trước giúp định khung; im lặng để tin đồn lấp chỗ trống.' },
  { id: 'q2', question: 'Why is "No comment" a poor response?|||Vì sao "Miễn bình luận" là ứng phó dở?', options: ['It is too long|||Vì quá dài', 'It reads as guilt or contempt|||Vì bị đọc là có tội hoặc coi thường', 'It is too honest|||Vì quá trung thực', 'It costs money|||Vì tốn tiền'], correctIndex: 1, explanation: '"Miễn bình luận" thường bị hiểu là né tránh, có tội hoặc coi thường công chúng.' },
  { id: 'q3', question: 'In the STOP checklist, what comes first?|||Trong checklist STOP, điều gì đến trước?', options: ['Sales|||Doanh số', 'Safety|||An toàn', 'Strategy|||Chiến lược', 'Silence|||Im lặng'], correctIndex: 1, explanation: 'S = Safety: đặt an toàn con người lên trước tiên.' },
]);

const c6 = doc('crm301-6-1-digital-social', '6.1 — Digital & social media in a crisis|||6.1 — Truyền thông số & mạng xã hội',
  'Social listening; tốc độ viral & tin sai; dark site chờ sẵn; ứng xử trên nền tảng; quản lý cộng đồng; ví dụ khủng hoảng lan trên mạng.',
  [[
    `<span class="eyebrow">CRM301 · Chapter 6 · Lesson 6.1</span>
<h2>Digital &amp; social media in a crisis</h2>
<p class="lead">Social media both <strong>accelerates</strong> crises and gives you the fastest channel to respond. A single video can go viral globally in hours, so listening and speed matter more than ever.</p>
<h3>Social listening</h3>
<p>Monitor mentions, hashtags and sentiment in real time so you detect a spike early. Volume and sentiment together tell you whether an issue is igniting.</p>
<h3>Speed, virality &amp; misinformation</h3>
<ul>
<li>A crisis can trend before your team even meets — pre-approved templates buy back minutes.</li>
<li>Misinformation spreads faster than facts; correct it calmly and link to a source of truth.</li>
<li>Do not delete critical comments wholesale — it looks like a cover-up and fuels backlash.</li>
</ul>
<h3>The dark site</h3>
<p>A <strong>dark site</strong> is a pre-built, hidden web page (or holding section) you publish the moment a crisis hits — with facts, FAQs and updates. It gives you an owned channel that you control, instead of arguing only in others' comment sections.</p>
<pre><code>Digital response kit:
 - Listening dashboard (alerts on spikes)
 - Pre-approved holding posts per platform
 - Dark site / crisis page ready to publish
 - Community-management guidelines (tone, do/don't)
</code></pre>
<div class="callout"><span class="badge">Real case</span> When a passenger was dragged off an overbooked flight, the video went viral in hours; a first statement that sounded defensive ("re-accommodate") amplified the outrage. On social media, tone travels faster than facts.</div>`,
    `<span class="eyebrow">CRM301 · Chương 6 · Bài 6.1</span>
<h2>Truyền thông số &amp; mạng xã hội trong khủng hoảng</h2>
<p class="lead">Mạng xã hội vừa <strong>tăng tốc</strong> khủng hoảng vừa cho bạn kênh phản hồi nhanh nhất. Một video có thể viral toàn cầu trong vài giờ, nên lắng nghe và tốc độ quan trọng hơn bao giờ hết.</p>
<h3>Lắng nghe mạng xã hội</h3>
<p>Theo dõi lượt nhắc, hashtag và cảm xúc thời gian thực để phát hiện đột biến sớm. Khối lượng và cảm xúc cùng cho biết một vấn đề có đang bùng lên hay không.</p>
<h3>Tốc độ, viral &amp; tin sai</h3>
<ul>
<li>Khủng hoảng có thể lên xu hướng trước cả khi đội bạn kịp họp — mẫu duyệt sẵn giành lại từng phút.</li>
<li>Tin sai lan nhanh hơn sự thật; hãy đính chính bình tĩnh và dẫn về một nguồn sự thật.</li>
<li>Đừng xoá sạch bình luận chỉ trích — trông như che giấu và đổ thêm dầu vào phẫn nộ.</li>
</ul>
<h3>Dark site</h3>
<p><strong>Dark site</strong> là trang web dựng sẵn nhưng ẩn (hoặc mục chờ) mà bạn công bố ngay khi khủng hoảng nổ — kèm dữ kiện, FAQ và cập nhật. Nó cho bạn một kênh sở hữu và kiểm soát, thay vì chỉ tranh luận trong phần bình luận của người khác.</p>
<pre><code>Bộ ứng phó số:
 - Bảng lắng nghe (cảnh báo khi đột biến)
 - Bài chờ duyệt sẵn cho từng nền tảng
 - Dark site / trang khủng hoảng sẵn để công bố
 - Hướng dẫn quản lý cộng đồng (giọng, nên/không nên)
</code></pre>
<div class="callout"><span class="badge">Ca thật</span> Khi một hành khách bị lôi khỏi chuyến bay bán quá vé, video viral trong vài giờ; tuyên bố đầu nghe phòng thủ ("bố trí lại chỗ") càng khuếch đại phẫn nộ. Trên mạng xã hội, giọng điệu lan nhanh hơn dữ kiện.</div>`,
  ]]);

const c6q = quiz('crm301-quiz-6', 'Quiz 6 — Digital & social|||Quiz 6 — Số & mạng xã hội', [
  { id: 'q1', question: 'A pre-built hidden crisis page published the moment a crisis hits is a…?|||Trang khủng hoảng dựng sẵn nhưng ẩn, công bố ngay khi nổ, gọi là…?', options: ['Landing page|||Trang đích', 'Dark site|||Dark site', 'Paywall|||Tường phí', 'Press kit|||Bộ báo chí'], correctIndex: 1, explanation: 'Đó là dark site — kênh sở hữu, kiểm soát được, công bố ngay khi khủng hoảng nổ.' },
  { id: 'q2', question: 'Why avoid wholesale deleting of critical comments?|||Vì sao tránh xoá sạch bình luận chỉ trích?', options: ['It costs data|||Vì tốn dữ liệu', 'It looks like a cover-up and fuels backlash|||Vì trông như che giấu, đổ thêm dầu phẫn nộ', 'It is illegal everywhere|||Vì phạm luật ở mọi nơi', 'It is too slow|||Vì quá chậm'], correctIndex: 1, explanation: 'Xoá sạch chỉ trích bị nhìn như che giấu và làm phản ứng dữ dội hơn.' },
  { id: 'q3', question: 'The main purpose of social listening in a crisis is to…?|||Mục đích chính của lắng nghe mạng xã hội trong khủng hoảng là…?', options: ['Sell ads|||Bán quảng cáo', 'Detect spikes in mentions & sentiment early|||Phát hiện sớm đột biến lượt nhắc & cảm xúc', 'Delete accounts|||Xoá tài khoản', 'Increase followers|||Tăng người theo dõi'], correctIndex: 1, explanation: 'Lắng nghe giúp phát hiện sớm đột biến về khối lượng và cảm xúc để phản ứng kịp.' },
]);

const c7 = doc('crm301-7-1-recovery', '7.1 — Reputation recovery & the apology|||7.1 — Phục hồi danh tiếng & lời xin lỗi',
  'Giai đoạn hậu khủng hoảng; giải phẫu một lời xin lỗi thật (nhận, hối tiếc, sửa, đền, cam kết); xây lại niềm tin; học hệ thống; đo lường phục hồi.',
  [[
    `<span class="eyebrow">CRM301 · Chapter 7 · Lesson 7.1</span>
<h2>Reputation recovery &amp; the apology</h2>
<p class="lead">The crisis event ends, but reputation work continues. <strong>Recovery</strong> is where trust is either rebuilt or quietly lost, depending on whether words are matched by action.</p>
<h3>Anatomy of a real apology</h3>
<ul>
<li><strong>Acknowledge</strong> — name what happened, plainly.</li>
<li><strong>Accept responsibility</strong> — no "mistakes were made" passive voice.</li>
<li><strong>Express regret</strong> — empathy for those harmed, not for yourself.</li>
<li><strong>Repair</strong> — concrete remedy and compensation.</li>
<li><strong>Commit</strong> — what changes so it does not recur.</li>
</ul>
<h3>Rebuilding trust</h3>
<p>Trust returns when the organization <em>demonstrates</em> change — new safeguards, audits, transparency reports — not when it merely promises it. Actions are believed; press releases are discounted.</p>
<h3>Learn systematically</h3>
<pre><code>Post-crisis review:
 - What signals did we miss? (feed back to issues management)
 - Did the plan work? Update the CMP.
 - What did stakeholders need that we did not give?
</code></pre>
<div class="callout"><span class="badge">Measure it</span> Track sentiment, media tone, trust surveys and behavior (sales, churn) over months — recovery is a curve, not a press conference.</div>`,
    `<span class="eyebrow">CRM301 · Chương 7 · Bài 7.1</span>
<h2>Phục hồi danh tiếng &amp; lời xin lỗi</h2>
<p class="lead">Sự kiện khủng hoảng kết thúc, nhưng công việc danh tiếng còn tiếp. <strong>Phục hồi</strong> là nơi niềm tin được xây lại hoặc âm thầm mất đi, tuỳ vào lời nói có đi cùng hành động không.</p>
<h3>Giải phẫu một lời xin lỗi thật</h3>
<ul>
<li><strong>Thừa nhận</strong> — gọi tên điều đã xảy ra, rõ ràng.</li>
<li><strong>Nhận trách nhiệm</strong> — không nói bị động kiểu "đã có sai sót xảy ra".</li>
<li><strong>Bày tỏ hối tiếc</strong> — đồng cảm với người bị hại, không phải cho bản thân.</li>
<li><strong>Sửa chữa</strong> — biện pháp khắc phục và đền bù cụ thể.</li>
<li><strong>Cam kết</strong> — thay đổi gì để không tái diễn.</li>
</ul>
<h3>Xây lại niềm tin</h3>
<p>Niềm tin trở lại khi tổ chức <em>chứng minh</em> thay đổi — biện pháp bảo vệ mới, kiểm toán, báo cáo minh bạch — chứ không phải khi chỉ hứa. Hành động thì được tin; thông cáo báo chí thì bị chiết khấu.</p>
<h3>Học một cách hệ thống</h3>
<pre><code>Rà soát sau khủng hoảng:
 - Ta đã bỏ sót tín hiệu nào? (phản hồi về quản trị vấn đề)
 - Kế hoạch có hiệu quả không? Cập nhật CMP.
 - Các bên cần gì mà ta chưa đáp ứng?
</code></pre>
<div class="callout"><span class="badge">Hãy đo</span> Theo dõi cảm xúc, giọng báo chí, khảo sát niềm tin và hành vi (doanh số, rời bỏ) qua nhiều tháng — phục hồi là một đường cong, không phải một buổi họp báo.</div>`,
  ]]);

const c7q = quiz('crm301-quiz-7', 'Quiz 7 — Recovery & apology|||Quiz 7 — Phục hồi & xin lỗi', [
  { id: 'q1', question: 'What most restores trust after a crisis?|||Điều gì khôi phục niềm tin nhiều nhất sau khủng hoảng?', options: ['A bigger ad budget|||Ngân sách quảng cáo lớn hơn', 'Demonstrated change, not just promises|||Thay đổi được chứng minh, không chỉ là lời hứa', 'Deleting news articles|||Xoá các bài báo', 'Staying silent|||Giữ im lặng'], correctIndex: 1, explanation: 'Niềm tin trở lại khi tổ chức chứng minh thay đổi bằng hành động, không phải chỉ hứa.' },
  { id: 'q2', question: 'Which phrase weakens an apology?|||Cụm nào làm yếu lời xin lỗi?', options: ['"We are responsible"|||"Chúng tôi chịu trách nhiệm"', '"Mistakes were made"|||"Đã có sai sót xảy ra"', '"We are sorry for the harm"|||"Chúng tôi xin lỗi vì thiệt hại"', '"Here is what we will change"|||"Đây là điều chúng tôi sẽ thay đổi"'], correctIndex: 1, explanation: 'Câu bị động "đã có sai sót xảy ra" né trách nhiệm nên làm yếu lời xin lỗi.' },
  { id: 'q3', question: 'Recovery is best understood as…?|||Phục hồi nên được hiểu là…?', options: ['A single press conference|||Một buổi họp báo duy nhất', 'A curve tracked over months|||Một đường cong theo dõi qua nhiều tháng', 'Instant once you apologize|||Tức thì ngay khi xin lỗi', 'Unmeasurable|||Không đo được'], correctIndex: 1, explanation: 'Phục hồi là quá trình đo bằng cảm xúc, giọng báo chí, niềm tin và hành vi qua nhiều tháng.' },
]);

const c8 = doc('crm301-8-1-cases-ethics', '8.1 — Landmark cases & ethics|||8.1 — Ca điển hình & đạo đức',
  'Tylenol (chuẩn vàng), BP Deepwater Horizon (đổ lỗi), United Airlines (giọng phòng thủ viral); nguyên tắc đạo đức: minh bạch, trung thực, đặt an toàn con người trên hình ảnh.',
  [[
    `<span class="eyebrow">CRM301 · Chapter 8 · Lesson 8.1</span>
<h2>Landmark cases &amp; ethics</h2>
<p class="lead">Theory becomes real in cases. Three are taught worldwide — one as the gold standard, two as cautionary tales.</p>
<h3>Tylenol (1982) — the gold standard</h3>
<p>After cyanide-laced capsules killed several people, Johnson &amp; Johnson put <strong>public safety before profit</strong>: a nationwide recall (millions of bottles), open communication, and tamper-proof packaging afterward. A victim-cluster crisis handled with transparency; the brand recovered fully.</p>
<h3>BP Deepwater Horizon (2010) — deflection</h3>
<p>During a massive oil spill, the CEO's remark that he "would like his life back" centered the company's discomfort over the environmental and human damage. <strong>Downplaying and self-pity</strong> in a high-responsibility crisis deepened public anger.</p>
<h3>United Airlines (2017) — defensive tone</h3>
<p>A passenger was forcibly removed from an overbooked flight; the video went viral. The first statement used detached corporate language ("re-accommodate"), reading as defensive rather than human — and the backlash grew before a fuller apology followed.</p>
<h3>Ethics of crisis communication</h3>
<ul>
<li><strong>Transparency</strong> — do not hide material facts.</li>
<li><strong>Honesty</strong> — never lie; the cover-up is usually worse than the crisis.</li>
<li><strong>Care</strong> — human safety and dignity outrank brand image.</li>
</ul>
<div class="callout"><span class="badge">The through-line</span> Across every case, the organizations that put <strong>people and truth first</strong> recovered; those that protected image first paid more, for longer.</div>`,
    `<span class="eyebrow">CRM301 · Chương 8 · Bài 8.1</span>
<h2>Ca điển hình &amp; đạo đức</h2>
<p class="lead">Lý thuyết trở nên thật trong các ca. Ba ca được dạy khắp thế giới — một là chuẩn vàng, hai là bài học cảnh tỉnh.</p>
<h3>Tylenol (1982) — chuẩn vàng</h3>
<p>Sau khi các viên thuốc bị tẩm xyanua giết chết vài người, Johnson &amp; Johnson đặt <strong>an toàn công chúng trên lợi nhuận</strong>: thu hồi toàn quốc (hàng triệu lọ), truyền thông cởi mở, và bao bì chống giả mạo về sau. Khủng hoảng nhóm nạn nhân được xử lý minh bạch; thương hiệu phục hồi hoàn toàn.</p>
<h3>BP Deepwater Horizon (2010) — né tránh</h3>
<p>Trong vụ tràn dầu khổng lồ, câu nói của CEO rằng ông "muốn lấy lại cuộc sống của mình" lại đặt sự khó chịu của công ty lên trên thiệt hại môi trường và con người. <strong>Xem nhẹ và tự thương thân</strong> trong một khủng hoảng trách nhiệm cao càng làm công chúng phẫn nộ.</p>
<h3>United Airlines (2017) — giọng phòng thủ</h3>
<p>Một hành khách bị cưỡng chế khỏi chuyến bay bán quá vé; video viral. Tuyên bố đầu dùng ngôn ngữ doanh nghiệp xa cách ("bố trí lại chỗ"), nghe phòng thủ chứ không mang tính con người — và phản ứng dữ dội tăng lên trước khi có lời xin lỗi đầy đủ hơn.</p>
<h3>Đạo đức truyền thông khủng hoảng</h3>
<ul>
<li><strong>Minh bạch</strong> — không che giấu dữ kiện trọng yếu.</li>
<li><strong>Trung thực</strong> — không bao giờ nói dối; che giấu thường tệ hơn khủng hoảng.</li>
<li><strong>Quan tâm</strong> — an toàn và phẩm giá con người trên hình ảnh thương hiệu.</li>
</ul>
<div class="callout"><span class="badge">Sợi chỉ xuyên suốt</span> Qua mọi ca, tổ chức nào đặt <strong>con người và sự thật lên trước</strong> đều phục hồi; ai bảo vệ hình ảnh trước thì trả giá đắt hơn, lâu hơn.</div>`,
  ]]);

const c8q = quiz('crm301-quiz-8', 'Quiz 8 — Cases & ethics|||Quiz 8 — Ca điển hình & đạo đức', [
  { id: 'q1', question: 'Why is Tylenol (1982) taught as the gold standard?|||Vì sao Tylenol (1982) được dạy như chuẩn vàng?', options: ['It denied everything|||Vì phủ nhận mọi thứ', 'It put public safety before profit (recall & transparency)|||Vì đặt an toàn công chúng trên lợi nhuận (thu hồi & minh bạch)', 'It stayed silent|||Vì giữ im lặng', 'It blamed customers|||Vì đổ lỗi khách hàng'], correctIndex: 1, explanation: 'J&J thu hồi toàn quốc và truyền thông minh bạch, đặt an toàn trên lợi nhuận.' },
  { id: 'q2', question: 'The BP CEO’s "I’d like my life back" failed because it…?|||Câu "muốn lấy lại cuộc sống" của CEO BP thất bại vì…?', options: ['Was too technical|||Quá kỹ thuật', 'Centered the company’s discomfort over victims’ harm|||Đặt sự khó chịu của công ty lên trên thiệt hại của nạn nhân', 'Was too empathetic|||Quá đồng cảm', 'Was too short|||Quá ngắn'], correctIndex: 1, explanation: 'Câu nói tự thương thân đặt công ty lên trên nạn nhân, làm phẫn nộ tăng.' },
  { id: 'q3', question: 'A core ethical rule of crisis communication is…?|||Một nguyên tắc đạo đức cốt lõi của truyền thông khủng hoảng là…?', options: ['Image before people|||Hình ảnh trước con người', 'Transparency & honesty; human safety over brand image|||Minh bạch & trung thực; an toàn con người trên hình ảnh', 'Delete the news|||Xoá tin', 'Never apologize|||Không bao giờ xin lỗi'], correctIndex: 1, explanation: 'Đạo đức đòi minh bạch, trung thực, và đặt an toàn con người trên hình ảnh thương hiệu.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'CRM301',
    slug: 'crm301-crisis-communication-reputation-management',
    title: 'Crisis Communication & Reputation Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CRM301.webp',
    shortDescription: 'Crisis communication & reputation management: crisis types & lifecycle, issues management, Coombs SCCT strategies, crisis planning & spokesperson, first 24 hours, social media & dark sites, recovery & apology, ethics (Tylenol, BP, United).|||Truyền thông khủng hoảng & quản trị danh tiếng: loại & vòng đời khủng hoảng, quản trị vấn đề, chiến lược ứng phó SCCT (Coombs), lập kế hoạch & người phát ngôn, 24 giờ đầu, mạng xã hội & dark site, phục hồi & xin lỗi, đạo đức (Tylenol, BP, United).',
    description: 'Môn <strong>CRM301 — Crisis Communication &amp; Reputation Management</strong> (Truyền thông khủng hoảng &amp; Quản trị danh tiếng, kỳ 8) dạy cách <strong>bảo vệ danh tiếng trước, trong và sau khủng hoảng</strong>. Từ <strong>khủng hoảng &amp; danh tiếng là gì</strong> (định nghĩa, loại, vòng đời) → <strong>quản trị vấn đề &amp; phòng ngừa</strong> → <strong>lý thuyết SCCT</strong> (Coombs) → <strong>lập kế hoạch, đội &amp; người phát ngôn</strong> → <strong>24 giờ đầu</strong> → <strong>truyền thông số &amp; mạng xã hội</strong> → <strong>phục hồi danh tiếng &amp; xin lỗi</strong> → <strong>ca điển hình &amp; đạo đức</strong> (Tylenol, BP, United). Môn không có FLM nên bám sách chuẩn quốc tế (Coombs, Fearn-Banks, Regester &amp; Larkin, PRSA, HBR); song ngữ, có mô hình, ca thật và quiz mỗi chương.',
    whatYouLearn: 'Định nghĩa khủng hoảng (Coombs) & phân biệt sự cố/vấn đề/khủng hoảng; loại khủng hoảng & vòng đời 3 giai đoạn; quản trị vấn đề, quét môi trường, đánh giá rủi ro (khả năng × tác động); SCCT — 3 nhóm crisis type & chiến lược deny/diminish/rebuild/bolster; lập CMP, đội khủng hoảng & huấn luyện người phát ngôn; holding statement & quy tắc 24 giờ đầu (STOP); social listening, dark site & ứng xử mạng xã hội; giải phẫu lời xin lỗi thật & xây lại niềm tin; ca Tylenol/BP/United & đạo đức (minh bạch, trung thực, con người trên hình ảnh).',
    requirements: 'Không yêu cầu tiên quyết đặc biệt. Có nền quan hệ công chúng / truyền thông cơ bản là lợi thế. Nên biết dùng công cụ theo dõi mạng xã hội (Brandwatch, Mention, Google Trends).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách (Coombs, Fearn-Banks, Regester & Larkin), PRSA/IPRA, HBR, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Khủng hoảng, danh tiếng, lộ trình 4 bước.', lessons: [intro] },
    { title: 'Chương 1 — Khủng hoảng & danh tiếng|||Chapter 1 — Crisis & reputation', description: 'Định nghĩa, loại, vòng đời.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quản trị vấn đề & phòng ngừa|||Chapter 2 — Issues management', description: 'Cảnh báo sớm, đánh giá rủi ro.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Lý thuyết SCCT|||Chapter 3 — SCCT', description: 'Crisis types & chiến lược ứng phó.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Lập kế hoạch khủng hoảng|||Chapter 4 — Crisis planning', description: 'CMP, đội, người phát ngôn.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Ứng phó: 24 giờ đầu|||Chapter 5 — First 24 hours', description: 'Holding statement, kênh, STOP.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Truyền thông số & mạng xã hội|||Chapter 6 — Digital & social', description: 'Social listening, viral, dark site.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Phục hồi danh tiếng|||Chapter 7 — Reputation recovery', description: 'Hậu khủng hoảng, xin lỗi, niềm tin.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ca điển hình & đạo đức|||Chapter 8 — Cases & ethics', description: 'Tylenol, BP, United; minh bạch.', lessons: [c8, c8q] },
  ],
};
