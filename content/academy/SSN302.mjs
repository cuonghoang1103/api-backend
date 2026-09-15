/**
 * SSN302 — Negotiation.
 * Giáo trình (trích dẫn, không upload PDF): "Getting to Yes" (Fisher & Ury),
 * "Negotiation" (Lewicki/Barry/Saunders), "Bargaining for Advantage" (Shell).
 * Khung 8 chương song ngữ + tài liệu + giới thiệu. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ssn302-0-0-tai-lieu', 'Course materials & references|||Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">SSN302 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Negotiation — distributive &amp; integrative bargaining, preparation, power, psychology, multiparty and cross-cultural negotiation — in one place. The official slides live on <strong>FLM</strong>; below are widely-cited references and free resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for SSN302 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Getting_to_Yes" target="_blank" rel="noopener"><em>Getting to Yes</em> — Roger Fisher &amp; William Ury</a></li>
<li><a href="https://en.wikipedia.org/wiki/Negotiation" target="_blank" rel="noopener"><em>Negotiation</em> — Lewicki, Barry &amp; Saunders (overview)</a></li>
<li><a href="https://en.wikipedia.org/wiki/Bargaining_for_Advantage" target="_blank" rel="noopener"><em>Bargaining for Advantage</em> — G. Richard Shell</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.pon.harvard.edu/" target="_blank" rel="noopener">Harvard Program on Negotiation (pon.harvard.edu)</a> — research &amp; free articles</li>
<li><a href="https://www.mindtools.com/pages/article/newLDR_96.htm" target="_blank" rel="noopener">MindTools — negotiation skills</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@HarvardPON" target="_blank" rel="noopener">Harvard Program on Negotiation</a> — talks &amp; case studies</li>
<li><a href="https://www.ted.com/talks" target="_blank" rel="noopener">TED Talks — search "negotiation"</a> — short, well-illustrated talks</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — negotiation types, BATNA/ZOPA, the four Fisher &amp; Ury principles.</li>
<li><strong>Practice</strong> — run a distributive AND an integrative role-play with a classmate; write your target/reservation before starting.</li>
<li><strong>Go deeper</strong> — strategy &amp; power, communication &amp; biases, multiparty/mediated negotiation.</li>
<li><strong>Job-ready</strong> — apply the planning checklist (Chapter 4) to a real negotiation: salary, a purchase, a vendor contract.</li>
</ol></div>`,
    `<span class="eyebrow">SSN302 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Đàm phán — phân phối &amp; tích hợp, chuẩn bị, quyền lực, tâm lý, đàm phán đa bên và xuyên văn hoá — gom về một chỗ. Slide chính thức nằm trên <strong>FLM</strong>; bên dưới là các nguồn được trích dẫn rộng rãi và tài liệu miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của SSN302 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Getting_to_Yes" target="_blank" rel="noopener"><em>Getting to Yes</em> — Roger Fisher &amp; William Ury</a></li>
<li><a href="https://en.wikipedia.org/wiki/Negotiation" target="_blank" rel="noopener"><em>Negotiation</em> — Lewicki, Barry &amp; Saunders (tổng quan)</a></li>
<li><a href="https://en.wikipedia.org/wiki/Bargaining_for_Advantage" target="_blank" rel="noopener"><em>Bargaining for Advantage</em> — G. Richard Shell</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.pon.harvard.edu/" target="_blank" rel="noopener">Harvard Program on Negotiation (pon.harvard.edu)</a> — nghiên cứu &amp; bài viết miễn phí</li>
<li><a href="https://www.mindtools.com/pages/article/newLDR_96.htm" target="_blank" rel="noopener">MindTools — kỹ năng đàm phán</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@HarvardPON" target="_blank" rel="noopener">Harvard Program on Negotiation</a> — bài giảng &amp; tình huống thực tế</li>
<li><a href="https://www.ted.com/talks" target="_blank" rel="noopener">TED Talks — tìm "negotiation"</a> — các bài nói ngắn, minh hoạ tốt</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — các loại đàm phán, BATNA/ZOPA, bốn nguyên tắc Fisher &amp; Ury.</li>
<li><strong>Luyện tập</strong> — chạy thử một tình huống phân phối VÀ một tình huống tích hợp với bạn học; viết mục tiêu/giá rút lui trước khi bắt đầu.</li>
<li><strong>Đào sâu</strong> — chiến lược &amp; quyền lực, giao tiếp &amp; định kiến, đàm phán đa bên/qua trung gian.</li>
<li><strong>Sẵn sàng đi làm</strong> — áp dụng danh sách chuẩn bị (Chương 4) vào một đàm phán thật: lương, một giao dịch mua, hợp đồng nhà cung cấp.</li>
</ol></div>`,
  ]]);

const intro = doc('ssn302-0-1-overview', 'Course overview: Negotiation|||Tổng quan: Đàm phán',
  'Định nghĩa đàm phán, khi nào nó xảy ra, và lộ trình 8 chương bám theo Fisher & Ury, Lewicki/Barry/Saunders và Shell.',
  [[
    `<span class="eyebrow">SSN302 · Lesson 0.1 · Overview</span>
<h2>Negotiation</h2>
<p class="lead">This course builds practical negotiation skills you will use in business, career and daily life — from asking for a raise to closing a multi-million-dollar deal. You will learn to read the underlying interests behind stated positions, defend your walk-away point, and grow the pie before dividing it.</p>
<h3>What negotiation really is</h3>
<p>Negotiation is a process where two or more interdependent parties, with both shared and conflicting interests, try to reach an agreement that is better than what each side could get on its own.</p>
<h3>Roadmap</h3>
<p>Overview &amp; negotiation types → distributive negotiation (BATNA/ZOPA) → integrative negotiation (value creation) → preparation &amp; planning → strategy, tactics &amp; power → communication, emotion &amp; psychology → multiparty &amp; mediated negotiation → cross-cultural &amp; ethical negotiation. Grounded in <em>Getting to Yes</em> (Fisher &amp; Ury), <em>Negotiation</em> (Lewicki/Barry/Saunders) and <em>Bargaining for Advantage</em> (Shell).</p>`,
    `<span class="eyebrow">SSN302 · Bài 0.1 · Tổng quan</span>
<h2>Đàm phán (Negotiation)</h2>
<p class="lead">Môn này xây kỹ năng đàm phán thực dụng dùng được trong kinh doanh, sự nghiệp và đời sống — từ xin tăng lương đến chốt một hợp đồng triệu đô. Bạn sẽ học đọc ra lợi ích thật sau các lập trường tuyên bố, giữ vững điểm rút lui của mình, và làm "to" cái bánh trước khi chia nó.</p>
<h3>Đàm phán thật ra là gì</h3>
<p>Đàm phán là quá trình hai hay nhiều bên phụ thuộc lẫn nhau, vừa có lợi ích chung vừa có lợi ích xung đột, cùng tìm một thoả thuận tốt hơn những gì mỗi bên có thể tự đạt được.</p>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; các loại đàm phán → đàm phán phân phối (BATNA/ZOPA) → đàm phán tích hợp (tạo giá trị) → chuẩn bị &amp; lập kế hoạch → chiến lược, chiến thuật &amp; quyền lực → giao tiếp, cảm xúc &amp; tâm lý → đàm phán đa bên &amp; qua trung gian → đàm phán xuyên văn hoá &amp; đạo đức. Bám theo <em>Getting to Yes</em> (Fisher &amp; Ury), <em>Negotiation</em> (Lewicki/Barry/Saunders) và <em>Bargaining for Advantage</em> (Shell).</p>`,
  ]]);

const c1 = doc('ssn302-1-1-overview-types', '1.1 — Negotiation overview & types|||1.1 — Tổng quan đàm phán & các loại đàm phán',
  'Khi nào đàm phán xảy ra; hai nhóm đàm phán (phân phối vs. tích hợp); lập trường vs. nguyên tắc (4 quy tắc Fisher & Ury).',
  [[
    `<span class="eyebrow">SSN302 · Chapter 1 · Lesson 1.1</span>
<h2>Negotiation overview &amp; types</h2>
<h3>When does negotiation happen?</h3>
<ul>
<li><strong>Interdependence</strong> — neither side can get what it wants alone.</li>
<li><strong>Perceived conflict of interest</strong> — goals are not identical.</li>
<li><strong>Opportunity for a joint decision</strong> — an agreement can beat each side's best unilateral option.</li>
</ul>
<h3>Two families of negotiation</h3>
<ul>
<li><strong>Distributive (win-lose)</strong> — the "pie" is treated as fixed; each side tries to claim as much value as possible. Typical of one-shot deals (e.g. buying a used car).</li>
<li><strong>Integrative (win-win)</strong> — parties look for trade-offs that grow the pie before dividing it, using differing priorities and multiple issues.</li>
</ul>
<h3>Positional vs. principled negotiation</h3>
<p>Fisher &amp; Ury (<em>Getting to Yes</em>) contrast <strong>positional bargaining</strong> (stating and defending fixed demands) with <strong>principled negotiation</strong>, built on four rules:</p>
<pre><code>1. Separate the PEOPLE from the PROBLEM
2. Focus on INTERESTS, not positions
3. Invent OPTIONS for mutual gain
4. Insist on OBJECTIVE criteria
</code></pre>
<div class="callout"><span class="badge">Positions vs. interests</span> A position is what someone says they want ("I want $500"). An interest is why they want it ("I need to cover next month's rent"). Negotiating on interests opens far more possible solutions.</div>`,
    `<span class="eyebrow">SSN302 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan đàm phán &amp; các loại đàm phán</h2>
<h3>Khi nào có đàm phán?</h3>
<ul>
<li><strong>Phụ thuộc lẫn nhau</strong> — không bên nào một mình đạt được điều mình muốn.</li>
<li><strong>Có xung đột lợi ích (cảm nhận được)</strong> — mục tiêu hai bên không giống nhau.</li>
<li><strong>Có cơ hội ra quyết định chung</strong> — một thoả thuận có thể tốt hơn phương án đơn phương tốt nhất của mỗi bên.</li>
</ul>
<h3>Hai nhóm đàm phán</h3>
<ul>
<li><strong>Phân phối (win-lose)</strong> — coi "cái bánh" là cố định; mỗi bên cố giành phần nhiều nhất có thể. Thường gặp ở giao dịch một lần (vd mua xe cũ).</li>
<li><strong>Tích hợp (win-win)</strong> — các bên tìm cách đánh đổi để làm "to" cái bánh trước khi chia, dựa vào mức độ ưu tiên khác nhau và nhiều vấn đề cùng lúc.</li>
</ul>
<h3>Đàm phán theo lập trường vs. theo nguyên tắc</h3>
<p>Fisher &amp; Ury (<em>Getting to Yes</em>) đối lập <strong>đàm phán theo lập trường</strong> (nêu và bảo vệ yêu cầu cố định) với <strong>đàm phán theo nguyên tắc</strong>, dựa trên bốn quy tắc:</p>
<pre><code>1. Tách CON NGƯỜI khỏi VẤN ĐỀ
2. Tập trung vào LỢI ÍCH, không phải lập trường
3. Sáng tạo CÁC PHƯƠNG ÁN cùng có lợi
4. Kiên trì dùng tiêu chí KHÁCH QUAN
</code></pre>
<div class="callout"><span class="badge">Lập trường vs. lợi ích</span> Lập trường là điều ai đó NÓI họ muốn ("Tôi muốn 500 đô"). Lợi ích là LÝ DO họ muốn điều đó ("Tôi cần trả tiền thuê nhà tháng sau"). Đàm phán theo lợi ích mở ra nhiều giải pháp hơn hẳn.</div>`,
  ]]);

const c1q = quiz('ssn302-quiz-1', 'Quiz 1 — Overview & types|||Quiz 1 — Tổng quan & các loại', [
  { id: 'q1', question: 'Đàm phán CHỈ xảy ra khi các bên có...?', options: ['Lợi ích hoàn toàn giống nhau', 'Phụ thuộc lẫn nhau & có xung đột lợi ích', 'Không ai cần ai', 'Đã có hợp đồng ký sẵn'], correctIndex: 1, explanation: 'Đàm phán cần vừa phụ thuộc lẫn nhau, vừa có xung đột lợi ích cảm nhận được.' },
  { id: 'q2', question: 'Đàm phán "phân phối" (distributive) coi giá trị cái bánh là?', options: ['Có thể mở rộng', 'Cố định (fixed pie)', 'Không tồn tại', 'Luôn chia đôi'], correctIndex: 1, explanation: 'Phân phối coi tổng giá trị cố định, mỗi bên giành phần của mình.' },
  { id: 'q3', question: 'Theo Fisher & Ury, nguyên tắc đầu tiên của đàm phán theo nguyên tắc là?', options: ['Tập trung vào lập trường', 'Tách con người khỏi vấn đề', 'Giữ bí mật BATNA', 'Luôn nhượng bộ trước'], correctIndex: 1, explanation: 'Bốn nguyên tắc bắt đầu bằng "tách người khỏi vấn đề".' },
]);

const c2 = doc('ssn302-2-1-distributive', '2.1 — Distributive negotiation|||2.1 — Đàm phán phân phối',
  'Target point, reservation price, BATNA, bargaining range, ZOPA; chiến thuật neo giá & nhượng bộ.',
  [[
    `<span class="eyebrow">SSN302 · Chapter 2 · Lesson 2.1</span>
<h2>Distributive negotiation</h2>
<h3>Key reference points</h3>
<ul>
<li><strong>Target point</strong> — the outcome you'd like to achieve.</li>
<li><strong>Reservation price (resistance point)</strong> — the worst deal you'll still accept; beyond it, you walk away.</li>
<li><strong>BATNA</strong> — Best Alternative To a Negotiated Agreement: what you'll do if no deal is reached. A strong BATNA sets a strong reservation price.</li>
<li><strong>Bargaining range</strong> — the space between both sides' reservation prices.</li>
<li><strong>ZOPA</strong> — Zone Of Possible Agreement: exists only when the buyer's maximum is ABOVE the seller's minimum.</li>
</ul>
<pre><code>Seller's reservation price:  min 8,000
Buyer's reservation price:   max 10,000
ZOPA = [8,000 ; 10,000]   -&gt; a deal is possible
If buyer's max were 7,000 -&gt; NO ZOPA, no deal possible
</code></pre>
<h3>Tactics</h3>
<ul>
<li><strong>Anchoring</strong> — the first credible number said tends to pull the final agreement toward it.</li>
<li><strong>Concessions</strong> — give them in shrinking increments, and only paired with a reason or a reciprocal ask.</li>
</ul>
<div class="callout"><span class="badge">Never reveal your reservation price</span> Improving your BATNA before the table — not bluffing at it — is what actually raises your outcome.</div>`,
    `<span class="eyebrow">SSN302 · Chương 2 · Bài 2.1</span>
<h2>Đàm phán phân phối (Distributive)</h2>
<h3>Các điểm mốc quan trọng</h3>
<ul>
<li><strong>Điểm mục tiêu (target point)</strong> — kết quả bạn muốn đạt được.</li>
<li><strong>Giá rút lui (reservation price / resistance point)</strong> — thoả thuận tệ nhất bạn còn chấp nhận; vượt qua nó thì bỏ đàm phán.</li>
<li><strong>BATNA</strong> — Phương án tốt nhất khi KHÔNG đạt thoả thuận (Best Alternative To a Negotiated Agreement): bạn sẽ làm gì nếu không có deal. BATNA mạnh cho giá rút lui mạnh.</li>
<li><strong>Khoảng đàm phán (bargaining range)</strong> — khoảng giữa giá rút lui của hai bên.</li>
<li><strong>ZOPA</strong> — Vùng có thể thoả thuận (Zone Of Possible Agreement): chỉ tồn tại khi mức tối đa của người mua CAO HƠN mức tối thiểu của người bán.</li>
</ul>
<pre><code>Giá rút lui người bán:  tối thiểu 8.000
Giá rút lui người mua:  tối đa   10.000
ZOPA = [8.000 ; 10.000]   -&gt; có thể chốt deal
Nếu người mua tối đa chỉ 7.000 -&gt; KHÔNG có ZOPA, không thể chốt
</code></pre>
<h3>Chiến thuật</h3>
<ul>
<li><strong>Neo giá (anchoring)</strong> — con số đáng tin đầu tiên được nói ra thường kéo kết quả cuối về phía nó.</li>
<li><strong>Nhượng bộ</strong> — nhượng theo bước nhỏ dần, và luôn kèm một lý do hoặc một yêu cầu đáp lại.</li>
</ul>
<div class="callout"><span class="badge">Đừng bao giờ để lộ giá rút lui</span> Thứ thật sự nâng kết quả của bạn là CẢI THIỆN BATNA trước khi vào bàn — không phải bịp trên bàn.</div>`,
  ]]);

const c2q = quiz('ssn302-quiz-2', 'Quiz 2 — Distributive negotiation|||Quiz 2 — Đàm phán phân phối', [
  { id: 'q1', question: 'BATNA là gì?', options: ['Giá mục tiêu cao nhất', 'Phương án tốt nhất nếu KHÔNG đạt thoả thuận', 'Mức nhượng bộ cuối cùng', 'Tên chiến thuật neo giá'], correctIndex: 1, explanation: 'BATNA = Best Alternative To a Negotiated Agreement.' },
  { id: 'q2', question: 'ZOPA tồn tại khi nào?', options: ['Khi hai bên giữ bí mật giá', 'Khi mức tối đa người mua cao hơn mức tối thiểu người bán', 'Khi không ai có BATNA', 'Khi luôn chia đôi phần chênh lệch'], correctIndex: 1, explanation: 'ZOPA là phần chồng lấn giữa giá rút lui của người mua và người bán.' },
  { id: 'q3', question: 'Vì sao "neo giá" (anchoring) hiệu quả?', options: ['Vì nó luôn đúng sự thật', 'Vì con số đầu tiên đáng tin có xu hướng kéo kết quả cuối về nó', 'Vì luật pháp yêu cầu bên ra giá trước thắng', 'Vì nó thay được BATNA'], correctIndex: 1, explanation: 'Hiệu ứng neo (anchoring) kéo kết quả cuối về gần con số nêu đầu tiên.' },
]);

const c3 = doc('ssn302-3-1-integrative', '3.1 — Integrative negotiation|||3.1 — Đàm phán tích hợp',
  'Log-rolling, bridging, cost-cutting, thoả thuận có điều kiện; tảng băng lợi ích (position vs. interest).',
  [[
    `<span class="eyebrow">SSN302 · Chapter 3 · Lesson 3.1</span>
<h2>Integrative negotiation</h2>
<h3>Growing the pie before dividing it</h3>
<p>Integrative (win-win) negotiation works when parties have <strong>multiple issues</strong> and <strong>different priorities</strong> on them — the trade-offs create value that a single-issue price fight can never reach.</p>
<h3>Value-creating techniques</h3>
<ul>
<li><strong>Log-rolling</strong> — I give you what matters most to you on issue A, you give me what matters most to me on issue B.</li>
<li><strong>Bridging</strong> — invent a brand-new option that satisfies both sides' underlying interests, not either side's original position.</li>
<li><strong>Cost-cutting</strong> — one side gets what it wants while the cost to the other side is minimized (e.g. flexible delivery dates instead of a lower price).</li>
<li><strong>Contingent agreements (a bet on the future)</strong> — the parties disagree on a forecast, so they let the actual outcome decide (e.g. a royalty tied to real sales instead of a fixed price).</li>
</ul>
<h3>The interest iceberg</h3>
<pre><code>          POSITION   (visible: "I want the corner office")
           /    \\
   INTEREST      INTEREST   (hidden: status, natural light,
                              proximity to the team...)
</code></pre>
<div class="callout"><span class="badge">Ask "why", not just "what"</span> Uncovering the interests below a stated position is what turns a fixed-pie fight into a value-creating deal.</div>`,
    `<span class="eyebrow">SSN302 · Chương 3 · Bài 3.1</span>
<h2>Đàm phán tích hợp (Integrative)</h2>
<h3>Làm "to" cái bánh trước khi chia</h3>
<p>Đàm phán tích hợp (win-win) hiệu quả khi các bên có <strong>nhiều vấn đề</strong> và <strong>mức ưu tiên khác nhau</strong> trên từng vấn đề — việc đánh đổi tạo ra giá trị mà một cuộc đấu giá đơn vấn đề không bao giờ chạm tới.</p>
<h3>Kỹ thuật tạo giá trị</h3>
<ul>
<li><strong>Log-rolling (đánh đổi qua lại)</strong> — tôi nhường bạn điều bạn coi trọng nhất ở vấn đề A, bạn nhường tôi điều tôi coi trọng nhất ở vấn đề B.</li>
<li><strong>Bridging (cầu nối)</strong> — sáng tạo một phương án hoàn toàn mới thoả cả lợi ích ngầm của hai bên, không phải lập trường ban đầu của bên nào.</li>
<li><strong>Cost-cutting (giảm chi phí cho đối phương)</strong> — một bên đạt điều mình muốn, còn chi phí bên kia phải trả được giảm tối đa (vd đổi lịch giao hàng linh hoạt thay vì giảm giá).</li>
<li><strong>Thoả thuận có điều kiện (cược vào tương lai)</strong> — hai bên bất đồng về dự báo, nên để kết quả THẬT quyết định (vd tiền bản quyền theo doanh số thật thay vì giá cố định).</li>
</ul>
<h3>Tảng băng lợi ích</h3>
<pre><code>         LẬP TRƯỜNG   (nhìn thấy: "Tôi muốn phòng góc")
           /    \\
   LỢI ÍCH      LỢI ÍCH   (ẩn: địa vị, nhiều ánh sáng,
                            gần nhóm làm việc...)
</code></pre>
<div class="callout"><span class="badge">Hỏi "vì sao", không chỉ "cái gì"</span> Khám phá lợi ích ẩn dưới lập trường tuyên bố là thứ biến một cuộc đấu cái-bánh-cố-định thành một deal tạo giá trị.</div>`,
  ]]);

const c3q = quiz('ssn302-quiz-3', 'Quiz 3 — Integrative negotiation|||Quiz 3 — Đàm phán tích hợp', [
  { id: 'q1', question: 'Đàm phán tích hợp hoạt động tốt nhất khi có?', options: ['Chỉ một vấn đề duy nhất', 'Nhiều vấn đề & mức ưu tiên khác nhau giữa hai bên', 'Không ai có lợi ích chung', 'Một bên phải thua'], correctIndex: 1, explanation: 'Nhiều vấn đề + ưu tiên khác nhau mới mở ra chỗ đánh đổi tạo giá trị.' },
  { id: 'q2', question: '"Log-rolling" là kỹ thuật gì?', options: ['Giữ bí mật lợi ích', 'Đánh đổi: nhường điều đối phương coi trọng để nhận lại điều mình coi trọng', 'Neo giá thật cao', 'Kéo dài thời gian đàm phán'], correctIndex: 1, explanation: 'Log-rolling là đánh đổi qua lại giữa các vấn đề có mức ưu tiên khác nhau.' },
  { id: 'q3', question: '"Bridging" khác gì so với thoả hiệp thông thường?', options: ['Nó chia đôi khác biệt', 'Nó sáng tạo phương án MỚI thoả lợi ích ngầm hai bên, không dừng ở lập trường cũ', 'Nó chỉ áp dụng khi có bên thứ ba', 'Nó luôn tốn thêm tiền'], correctIndex: 1, explanation: 'Bridging tạo phương án hoàn toàn mới, không phải chỉ nhượng theo lập trường ban đầu.' },
]);

const c4 = doc('ssn302-4-1-preparation', '4.1 — Preparation & planning|||4.1 — Chuẩn bị & lập kế hoạch',
  'Danh sách 8 bước chuẩn bị: mục tiêu, vấn đề, ưu tiên, BATNA, nghiên cứu đối phương, ZOPA, mục tiêu & giá mở đầu.',
  [[
    `<span class="eyebrow">SSN302 · Chapter 4 · Lesson 4.1</span>
<h2>Preparation &amp; planning</h2>
<p class="lead">Negotiation research consistently finds that outcomes are decided more by <strong>preparation before the table</strong> than by tactics used at it.</p>
<h3>A planning checklist</h3>
<pre><code>1. Define YOUR goals & underlying interests (not just a position)
2. Identify all the ISSUES on the table (not just price)
3. Rank issues by priority; note which you can trade
4. Assess YOUR BATNA -&gt; derive your reservation point
5. Research THEIR likely interests, issues, priorities, BATNA
6. Estimate the ZOPA (or where you suspect it sits)
7. Set an ambitious but justifiable TARGET, and an opening offer
8. Plan your agenda, who negotiates, and where/when
</code></pre>
<h3>Multiple issues = more room to create value</h3>
<p>List every issue that could be part of the deal (price, timeline, quality, payment terms, exclusivity, support, warranty...) — the more issues on the table, the more opportunities for log-rolling and bridging described in Chapter 3.</p>
<div class="callout"><span class="badge">Prepare a walk-away line, in writing, before you sit down</span> Under time pressure at the table, an unwritten reservation point erodes fast.</div>`,
    `<span class="eyebrow">SSN302 · Chương 4 · Bài 4.1</span>
<h2>Chuẩn bị &amp; lập kế hoạch đàm phán</h2>
<p class="lead">Nghiên cứu về đàm phán luôn cho thấy: kết quả được quyết định nhiều hơn bởi <strong>sự chuẩn bị trước khi vào bàn</strong>, hơn là chiến thuật dùng TRÊN bàn.</p>
<h3>Danh sách chuẩn bị</h3>
<pre><code>1. Xác định MỤC TIÊU & lợi ích ngầm của BẠN (không chỉ lập trường)
2. Liệt kê MỌI VẤN ĐỀ sẽ đàm phán (không chỉ giá)
3. Xếp hạng ưu tiên các vấn đề; ghi rõ vấn đề nào có thể đánh đổi
4. Đánh giá BATNA của BẠN -&gt; suy ra giá rút lui
5. Tìm hiểu lợi ích, vấn đề, ưu tiên, BATNA có thể có của ĐỐI PHƯƠNG
6. Ước lượng ZOPA (hoặc nghi vấn nó nằm ở đâu)
7. Đặt MỤC TIÊU tham vọng nhưng có căn cứ, và giá mở đầu
8. Lên kế hoạch chương trình làm việc, ai đàm phán, ở đâu/khi nào
</code></pre>
<h3>Nhiều vấn đề = nhiều đất tạo giá trị</h3>
<p>Liệt kê mọi vấn đề có thể nằm trong deal (giá, tiến độ, chất lượng, điều khoản thanh toán, độc quyền, hỗ trợ, bảo hành...) — càng nhiều vấn đề trên bàn, càng nhiều cơ hội log-rolling và bridging như ở Chương 3.</p>
<div class="callout"><span class="badge">Viết ra giá rút lui TRƯỚC khi ngồi vào bàn</span> Dưới áp lực thời gian tại bàn đàm phán, một giá rút lui không được viết ra rất dễ bị xói mòn.</div>`,
  ]]);

const c4q = quiz('ssn302-quiz-4', 'Quiz 4 — Preparation & planning|||Quiz 4 — Chuẩn bị & lập kế hoạch', [
  { id: 'q1', question: 'Theo nghiên cứu đàm phán, điều quyết định kết quả nhiều hơn là?', options: ['Chiến thuật dùng trên bàn', 'Sự chuẩn bị trước khi vào bàn', 'May rủi', 'Ai nói to hơn'], correctIndex: 1, explanation: 'Chuẩn bị trước bàn quyết định kết quả nhiều hơn chiến thuật tại bàn.' },
  { id: 'q2', question: 'Bước ĐẦU TIÊN khi lập kế hoạch đàm phán là?', options: ['Ra giá mở đầu ngay', 'Xác định mục tiêu & lợi ích ngầm của mình', 'Đoán BATNA của đối phương trước', 'Ký hợp đồng nháp'], correctIndex: 1, explanation: 'Danh sách chuẩn bị bắt đầu từ mục tiêu & lợi ích của chính mình.' },
  { id: 'q3', question: 'Vì sao nên liệt kê NHIỀU vấn đề, không chỉ giá?', options: ['Để kéo dài thời gian đàm phán', 'Vì nhiều vấn đề mở ra cơ hội đánh đổi (log-rolling) và tạo giá trị', 'Để đối phương rối', 'Vì luật yêu cầu vậy'], correctIndex: 1, explanation: 'Nhiều vấn đề trên bàn tạo nhiều cơ hội đánh đổi tích hợp.' },
]);

const c5 = doc('ssn302-5-1-strategy-power', '5.1 — Strategy, tactics & power|||5.1 — Chiến lược, chiến thuật & quyền lực',
  'Mô hình quan tâm kép (5 chiến lược); chiến thuật đóng khung/thời hạn/im lặng; 5 nguồn quyền lực.',
  [[
    `<span class="eyebrow">SSN302 · Chapter 5 · Lesson 5.1</span>
<h2>Strategy, tactics &amp; power</h2>
<h3>Dual concern model — four negotiation strategies</h3>
<ul>
<li><strong>Competing</strong> — high concern for own outcomes, low for the other side's. Fits pure distributive, one-shot deals.</li>
<li><strong>Collaborating</strong> — high concern for both sides. Fits integrative deals with an ongoing relationship.</li>
<li><strong>Accommodating</strong> — high concern for the other side, low for own. Used to preserve a relationship over a small stake.</li>
<li><strong>Avoiding</strong> — low concern for both; used when the cost of negotiating outweighs the stake.</li>
<li><strong>Compromising</strong> — moderate concern for both; a quick, "split the difference" fallback.</li>
</ul>
<h3>Common tactics</h3>
<ul>
<li><strong>Framing</strong> — presenting the same offer to sound like a gain rather than a loss.</li>
<li><strong>Deadlines &amp; time pressure</strong> — a real or manufactured time limit that pushes concessions.</li>
<li><strong>Good-cop / bad-cop</strong> — one negotiator plays tough, the other plays reasonable, to make the "reasonable" offer look better by contrast.</li>
<li><strong>Silence</strong> — an unanswered offer creates pressure to fill the gap, often with a concession.</li>
</ul>
<h3>Five sources of power at the table</h3>
<pre><code>1. Alternatives  (your BATNA -- the biggest lever)
2. Information   (knowing their reservation point/priorities)
3. Legitimacy    (objective standards, precedent, authority)
4. Relationship  (trust built over time)
5. Time          (who can walk away / wait longer)
</code></pre>
<div class="callout"><span class="badge">Power is mostly perceived, not absolute</span> A weaker BATNA that is well hidden can out-negotiate a strong one that is telegraphed carelessly.</div>`,
    `<span class="eyebrow">SSN302 · Chương 5 · Bài 5.1</span>
<h2>Chiến lược, chiến thuật &amp; quyền lực</h2>
<h3>Mô hình quan tâm kép — bốn chiến lược đàm phán</h3>
<ul>
<li><strong>Cạnh tranh (competing)</strong> — quan tâm cao đến kết quả của mình, thấp đến đối phương. Phù hợp deal phân phối thuần, một lần.</li>
<li><strong>Hợp tác (collaborating)</strong> — quan tâm cao đến cả hai bên. Phù hợp deal tích hợp có quan hệ lâu dài.</li>
<li><strong>Nhượng bộ (accommodating)</strong> — quan tâm cao đến đối phương, thấp đến mình. Dùng để giữ quan hệ khi giá trị vấn đề nhỏ.</li>
<li><strong>Né tránh (avoiding)</strong> — quan tâm thấp cả hai bên; dùng khi chi phí đàm phán lớn hơn lợi ích thu được.</li>
<li><strong>Thoả hiệp (compromising)</strong> — quan tâm vừa phải cả hai bên; phương án dự phòng nhanh, "chia đôi khác biệt".</li>
</ul>
<h3>Các chiến thuật phổ biến</h3>
<ul>
<li><strong>Đóng khung (framing)</strong> — trình bày cùng một đề nghị sao cho nghe như một khoản LỢI thay vì một khoản MẤT.</li>
<li><strong>Thời hạn &amp; áp lực thời gian</strong> — một giới hạn thời gian thật hoặc dựng lên để thúc nhượng bộ.</li>
<li><strong>Cảnh sát tốt / cảnh sát xấu</strong> — một người đàm phán cứng rắn, người kia hợp lý, để đề nghị "hợp lý" trông tốt hơn khi so sánh.</li>
<li><strong>Im lặng</strong> — một đề nghị không được đáp lại tạo áp lực phải lấp khoảng trống, thường bằng một nhượng bộ.</li>
</ul>
<h3>Năm nguồn quyền lực trên bàn đàm phán</h3>
<pre><code>1. Phương án thay thế  (BATNA của bạn -- lá bài lớn nhất)
2. Thông tin           (biết giá rút lui/ưu tiên của đối phương)
3. Chính danh          (tiêu chuẩn khách quan, tiền lệ, thẩm quyền)
4. Quan hệ             (niềm tin xây theo thời gian)
5. Thời gian           (ai chờ được lâu hơn / bỏ đi được)
</code></pre>
<div class="callout"><span class="badge">Quyền lực phần lớn là CẢM NHẬN, không tuyệt đối</span> Một BATNA yếu nhưng giữ kín có thể đàm phán tốt hơn một BATNA mạnh nhưng để lộ bất cẩn.</div>`,
  ]]);

const c5q = quiz('ssn302-quiz-5', 'Quiz 5 — Strategy, tactics & power|||Quiz 5 — Chiến lược, chiến thuật & quyền lực', [
  { id: 'q1', question: 'Chiến lược "hợp tác" (collaborating) trong mô hình quan tâm kép phù hợp nhất khi?', options: ['Chỉ có một lần giao dịch duy nhất', 'Deal tích hợp và có quan hệ lâu dài giữa hai bên', 'Không ai cần thoả thuận', 'Giá trị vấn đề bằng không'], correctIndex: 1, explanation: 'Hợp tác quan tâm cao đến cả hai bên, phù hợp deal tích hợp dài hạn.' },
  { id: 'q2', question: 'Chiến thuật "im lặng" tạo áp lực bằng cách nào?', options: ['Kết thúc đàm phán ngay', 'Khiến đối phương muốn lấp khoảng trống, thường bằng một nhượng bộ', 'Chứng minh mình đúng luật', 'Tăng BATNA của mình'], correctIndex: 1, explanation: 'Sự im lặng sau một đề nghị tạo áp lực tâm lý phải lấp khoảng trống.' },
  { id: 'q3', question: 'Nguồn quyền lực LỚN NHẤT trên bàn đàm phán thường là?', options: ['Giọng nói to', 'Phương án thay thế tốt (BATNA mạnh)', 'Ăn mặc trang trọng', 'Ngồi ghế cao hơn'], correctIndex: 1, explanation: 'BATNA mạnh là lá bài quyền lực lớn nhất trong 5 nguồn quyền lực.' },
]);

const c6 = doc('ssn302-6-1-communication-psychology', '6.1 — Communication, emotion & psychology|||6.1 — Giao tiếp, cảm xúc & tâm lý',
  'Lắng nghe chủ động, câu hỏi mở, reframing; cảm xúc tích cực/tiêu cực; 4 định kiến nhận thức thường gặp.',
  [[
    `<span class="eyebrow">SSN302 · Chapter 6 · Lesson 6.1</span>
<h2>Communication, emotion &amp; psychology</h2>
<h3>Listening &amp; questioning</h3>
<ul>
<li><strong>Active listening</strong> — paraphrase what you heard before responding; it surfaces interests and lowers defensiveness.</li>
<li><strong>Open questions</strong> ("What matters most to you about the timeline?") uncover interests; closed questions only confirm facts.</li>
<li><strong>Reframing</strong> — restate a demand as an underlying interest to open new options ("So the real issue is cash flow, not price").</li>
</ul>
<h3>Emotion at the table</h3>
<p>Positive affect tends to expand the pie searched for (more creative, integrative outcomes); negative affect (anger, anxiety) narrows attention and pushes parties toward defensive, distributive moves — but a controlled expression of firmness can also signal a real limit.</p>
<h3>Cognitive biases that distort negotiators</h3>
<ul>
<li><strong>Anchoring bias</strong> — over-weighting the first number heard, even an arbitrary one.</li>
<li><strong>Fixed-pie bias</strong> — assuming the other side's interests are the exact opposite of yours, missing integrative trades.</li>
<li><strong>Overconfidence</strong> — overestimating the odds that the other side will simply accept your position.</li>
<li><strong>Reactive devaluation</strong> — devaluing an offer for the sole reason that it came from the other side.</li>
</ul>
<div class="callout"><span class="badge">Name the bias to beat it</span> Negotiators who explicitly check for fixed-pie thinking find integrative trades far more often than those who don't.</div>`,
    `<span class="eyebrow">SSN302 · Chương 6 · Bài 6.1</span>
<h2>Giao tiếp, cảm xúc &amp; tâm lý trong đàm phán</h2>
<h3>Lắng nghe &amp; đặt câu hỏi</h3>
<ul>
<li><strong>Lắng nghe chủ động</strong> — diễn giải lại điều nghe được trước khi phản hồi; giúp lộ ra lợi ích thật và giảm phòng thủ.</li>
<li><strong>Câu hỏi mở</strong> ("Điều gì quan trọng nhất với bạn về tiến độ?") khai lộ lợi ích; câu hỏi đóng chỉ xác nhận sự kiện.</li>
<li><strong>Đóng khung lại (reframing)</strong> — diễn lại một yêu cầu thành lợi ích ngầm để mở phương án mới ("Vậy vấn đề thật là dòng tiền, không phải giá").</li>
</ul>
<h3>Cảm xúc trên bàn đàm phán</h3>
<p>Cảm xúc tích cực thường mở rộng phạm vi tìm kiếm giải pháp (kết quả sáng tạo, tích hợp hơn); cảm xúc tiêu cực (giận, lo lắng) thu hẹp sự chú ý và đẩy các bên về hướng phòng thủ, phân phối — nhưng thể hiện sự cứng rắn có kiểm soát cũng có thể báo hiệu một giới hạn thật.</p>
<h3>Các định kiến nhận thức làm lệch lạc người đàm phán</h3>
<ul>
<li><strong>Định kiến neo giá</strong> — đặt trọng số quá lớn vào con số đầu tiên nghe được, dù nó tuỳ tiện.</li>
<li><strong>Định kiến "cái bánh cố định"</strong> — mặc định lợi ích của đối phương hoàn toàn ngược với mình, bỏ lỡ cơ hội đánh đổi tích hợp.</li>
<li><strong>Quá tự tin</strong> — đánh giá quá cao khả năng đối phương sẽ chấp nhận lập trường của mình.</li>
<li><strong>Hạ giá phản ứng</strong> — hạ thấp giá trị một đề nghị chỉ vì nó đến từ đối phương.</li>
</ul>
<div class="callout"><span class="badge">Gọi tên định kiến để vượt qua nó</span> Người đàm phán chủ động kiểm tra tư duy "cái bánh cố định" tìm ra cơ hội tích hợp nhiều hơn hẳn người không làm vậy.</div>`,
  ]]);

const c6q = quiz('ssn302-quiz-6', 'Quiz 6 — Communication & psychology|||Quiz 6 — Giao tiếp & tâm lý', [
  { id: 'q1', question: '"Lắng nghe chủ động" giúp gì trong đàm phán?', options: ['Chỉ để lịch sự', 'Khai lộ lợi ích thật và giảm phòng thủ của đối phương', 'Kéo dài đàm phán', 'Thay thế được BATNA'], correctIndex: 1, explanation: 'Lắng nghe chủ động giúp lộ ra lợi ích thật và giảm phòng thủ.' },
  { id: 'q2', question: 'Định kiến "cái bánh cố định" (fixed-pie bias) là gì?', options: ['Tin rằng deal luôn có lợi cho cả hai', 'Mặc định lợi ích đối phương ngược hoàn toàn với mình, bỏ lỡ cơ hội tích hợp', 'Tin BATNA không quan trọng', 'Luôn đúng khi ước lượng ZOPA'], correctIndex: 1, explanation: 'Fixed-pie bias khiến người đàm phán bỏ lỡ các cơ hội đánh đổi tích hợp.' },
  { id: 'q3', question: '"Hạ giá phản ứng" (reactive devaluation) nghĩa là?', options: ['Giảm giá vì lạm phát', 'Hạ thấp giá trị đề nghị chỉ vì nó đến từ đối phương', 'Giảm giá theo thời gian đàm phán', 'Tăng giá khi có bên thứ ba'], correctIndex: 1, explanation: 'Reactive devaluation là hạ giá trị đề nghị chỉ vì nguồn gốc của nó.' },
]);

const c7 = doc('ssn302-7-1-multiparty-mediation', '7.1 — Multiparty, mediated negotiation & conflict|||7.1 — Đàm phán đa bên, qua trung gian & xung đột',
  'Liên minh trong đàm phán đa bên; trung gian hoà giải vs. trọng tài vs. điều giải; phong cách xử lý xung đột.',
  [[
    `<span class="eyebrow">SSN302 · Chapter 7 · Lesson 7.1</span>
<h2>Multiparty, mediated negotiation &amp; conflict</h2>
<h3>Multiparty negotiation</h3>
<p>With three or more parties, complexity jumps: <strong>coalitions</strong> can form (subgroups aligning on shared interests), the number of possible agreements explodes, and process matters as much as content — who speaks when, how a decision is finalized (unanimity vs. majority).</p>
<h3>Third-party intervention</h3>
<ul>
<li><strong>Mediation</strong> — a neutral third party helps the parties communicate and generate options but has NO power to impose a decision.</li>
<li><strong>Arbitration</strong> — a neutral third party hears both sides and imposes a binding decision, like a private judge.</li>
<li><strong>Conciliation</strong> — a lighter form of mediation focused mainly on restoring communication between hostile parties.</li>
</ul>
<h3>Conflict-handling styles (Thomas-Kilmann)</h3>
<p>The same five strategies from Chapter 5 (competing, collaborating, accommodating, avoiding, compromising) describe how people handle interpersonal <strong>conflict</strong> in general, not only formal negotiation — useful for reading a counterpart's default style at the table.</p>
<div class="callout"><span class="badge">Mediation ≠ arbitration</span> If you need a party to hold binding power over the outcome, mediation is the wrong tool — pick arbitration (or litigation) instead.</div>`,
    `<span class="eyebrow">SSN302 · Chương 7 · Bài 7.1</span>
<h2>Đàm phán đa bên, qua trung gian &amp; xung đột</h2>
<h3>Đàm phán đa bên</h3>
<p>Khi có từ ba bên trở lên, độ phức tạp tăng vọt: <strong>liên minh (coalition)</strong> có thể hình thành (các nhóm nhỏ liên kết theo lợi ích chung), số phương án thoả thuận khả dĩ tăng theo cấp số, và QUY TRÌNH quan trọng không kém nội dung — ai nói lúc nào, quyết định được chốt ra sao (đồng thuận tuyệt đối vs. đa số).</p>
<h3>Sự can thiệp của bên thứ ba</h3>
<ul>
<li><strong>Trung gian hoà giải (mediation)</strong> — bên thứ ba trung lập giúp các bên giao tiếp và tạo phương án nhưng KHÔNG có quyền áp đặt quyết định.</li>
<li><strong>Trọng tài (arbitration)</strong> — bên thứ ba trung lập nghe cả hai bên và áp đặt một quyết định có tính ràng buộc, như một "thẩm phán tư".</li>
<li><strong>Điều giải (conciliation)</strong> — một hình thức trung gian nhẹ hơn, chủ yếu để khôi phục giao tiếp giữa các bên đang căng thẳng.</li>
</ul>
<h3>Phong cách xử lý xung đột (Thomas-Kilmann)</h3>
<p>Năm chiến lược ở Chương 5 (cạnh tranh, hợp tác, nhượng bộ, né tránh, thoả hiệp) cũng mô tả cách con người xử lý <strong>xung đột</strong> giữa người với người nói chung, không chỉ trong đàm phán chính thức — hữu ích để đọc phong cách mặc định của đối phương trên bàn.</p>
<div class="callout"><span class="badge">Trung gian ≠ trọng tài</span> Nếu bạn cần một bên có quyền ràng buộc lên kết quả, trung gian hoà giải là công cụ SAI — hãy chọn trọng tài (hoặc kiện tụng) thay vào đó.</div>`,
  ]]);

const c7q = quiz('ssn302-quiz-7', 'Quiz 7 — Multiparty & mediated negotiation|||Quiz 7 — Đàm phán đa bên & qua trung gian', [
  { id: 'q1', question: 'Khác biệt CHÍNH giữa trung gian hoà giải và trọng tài là?', options: ['Không khác gì cả', 'Trung gian KHÔNG có quyền áp đặt quyết định, trọng tài CÓ', 'Trọng tài luôn miễn phí', 'Trung gian chỉ dùng trong toà án'], correctIndex: 1, explanation: 'Trung gian chỉ hỗ trợ giao tiếp; trọng tài áp đặt quyết định ràng buộc.' },
  { id: 'q2', question: 'Trong đàm phán đa bên (từ ba bên trở lên), điều gì thường xuất hiện thêm?', options: ['Luôn dễ hơn đàm phán hai bên', 'Liên minh (coalition) giữa các nhóm nhỏ có lợi ích chung', 'Không cần chuẩn bị', 'BATNA biến mất'], correctIndex: 1, explanation: 'Đa bên thường sinh ra liên minh và tăng độ phức tạp của quy trình.' },
  { id: 'q3', question: 'Năm phong cách xử lý xung đột Thomas-Kilmann trùng với?', options: ['Năm nguồn quyền lực ở Chương 5', 'Năm chiến lược trong mô hình quan tâm kép ở Chương 5', 'Năm bước lập kế hoạch ở Chương 4', 'Năm loại BATNA'], correctIndex: 1, explanation: 'Cạnh tranh/hợp tác/nhượng bộ/né tránh/thoả hiệp là cùng một mô hình.' },
]);

const c8 = doc('ssn302-8-1-cross-cultural-ethics', '8.1 — Cross-cultural, ethics & international negotiation|||8.1 — Đàm phán xuyên văn hoá, đạo đức & quốc tế',
  'Văn hoá cá nhân/tập thể, ngữ cảnh cao/thấp; đạo đức đàm phán (mập mờ, nói dối im lặng/hành động); thực tế quốc tế.',
  [[
    `<span class="eyebrow">SSN302 · Chapter 8 · Lesson 8.1</span>
<h2>Cross-cultural, ethical &amp; international negotiation</h2>
<h3>Culture shapes the table</h3>
<ul>
<li><strong>Individualist vs. collectivist</strong> cultures — negotiating for personal gain vs. for the group's/family's standing.</li>
<li><strong>High-context vs. low-context communication</strong> — meaning carried by relationship, silence and indirect cues, vs. meaning stated explicitly in words.</li>
<li><strong>Attitude to time</strong> — a rigid deadline in one culture can be a mere suggestion in another.</li>
</ul>
<h3>Ethics in negotiation</h3>
<p>Most negotiation ethics frameworks separate:</p>
<ul>
<li><strong>Puffery / strategic ambiguity</strong> — not revealing your reservation point — widely considered acceptable.</li>
<li><strong>Lying by omission</strong> — not correcting a false belief the other side already holds — a grey zone, contested.</li>
<li><strong>Lying by commission</strong> — actively stating a false fact (e.g. inventing a competing offer that doesn't exist) — considered unethical, and often illegal (fraud) in a signed contract.</li>
</ul>
<h3>International negotiation, practically</h3>
<p>Beyond culture: different legal systems governing the contract, currency &amp; exchange risk, time-zone-constrained communication, and a longer relationship-building phase before substantive talk even starts in high-context cultures.</p>
<div class="callout"><span class="badge">"They negotiate differently" is not an excuse</span> Adapting style is smart; abandoning your own reservation point or ethics because "that's how it's done there" is not the same thing.</div>`,
    `<span class="eyebrow">SSN302 · Chương 8 · Bài 8.1</span>
<h2>Đàm phán xuyên văn hoá, đạo đức &amp; quốc tế</h2>
<h3>Văn hoá định hình bàn đàm phán</h3>
<ul>
<li><strong>Văn hoá cá nhân vs. tập thể</strong> — đàm phán vì lợi ích cá nhân so với vì vị thế của nhóm/gia đình.</li>
<li><strong>Giao tiếp ngữ cảnh cao vs. ngữ cảnh thấp</strong> — nghĩa được truyền qua quan hệ, sự im lặng, tín hiệu gián tiếp, so với nghĩa được nói ra rõ ràng bằng lời.</li>
<li><strong>Quan niệm về thời gian</strong> — một thời hạn cứng ở văn hoá này có thể chỉ là gợi ý ở văn hoá khác.</li>
</ul>
<h3>Đạo đức trong đàm phán</h3>
<p>Hầu hết khung đạo đức đàm phán tách ra:</p>
<ul>
<li><strong>Nói phóng đại / mập mờ chiến lược</strong> — không để lộ giá rút lui — được xem là chấp nhận được rộng rãi.</li>
<li><strong>Nói dối bằng cách im lặng</strong> — không cải chính một niềm tin sai mà đối phương đã có sẵn — vùng xám, còn tranh cãi.</li>
<li><strong>Nói dối bằng hành động</strong> — chủ động khẳng định một sự thật giả (vd bịa ra một đề nghị cạnh tranh không tồn tại) — bị xem là phi đạo đức, và thường phi pháp (gian lận) nếu đã ký hợp đồng.</li>
</ul>
<h3>Đàm phán quốc tế, trên thực tế</h3>
<p>Ngoài văn hoá: hệ thống pháp luật khác nhau chi phối hợp đồng, rủi ro tiền tệ &amp; tỷ giá, giao tiếp bị giới hạn bởi múi giờ, và giai đoạn xây quan hệ dài hơn trước khi bàn nội dung thật ở các văn hoá ngữ cảnh cao.</p>
<div class="callout"><span class="badge">"Họ đàm phán khác" không phải cái cớ</span> Điều chỉnh phong cách là khôn ngoan; từ bỏ giá rút lui hoặc đạo đức của chính mình vì "ở đây người ta làm vậy" là chuyện khác hẳn.</div>`,
  ]]);

const c8q = quiz('ssn302-quiz-8', 'Quiz 8 — Cross-cultural & ethical negotiation|||Quiz 8 — Xuyên văn hoá & đạo đức', [
  { id: 'q1', question: 'Giao tiếp "ngữ cảnh cao" (high-context) khác gì ngữ cảnh thấp?', options: ['Luôn nói to hơn', 'Nghĩa truyền qua quan hệ/tín hiệu gián tiếp thay vì lời nói rõ ràng', 'Không cần ngôn ngữ chung', 'Chỉ dùng trong đàm phán online'], correctIndex: 1, explanation: 'Ngữ cảnh cao dựa nhiều vào quan hệ và tín hiệu gián tiếp hơn lời nói.' },
  { id: 'q2', question: 'Theo khung đạo đức đàm phán, hành vi nào bị xem là phi đạo đức RÕ RÀNG NHẤT?', options: ['Không để lộ giá rút lui', 'Nói dối bằng hành động — bịa ra một sự thật giả (vd đề nghị cạnh tranh không có thật)', 'Đặt câu hỏi mở', 'Giữ im lặng khi chờ phản hồi'], correctIndex: 1, explanation: 'Nói dối bằng hành động (chủ động bịa sự thật giả) là vi phạm đạo đức rõ nhất.' },
  { id: 'q3', question: 'Trong đàm phán quốc tế, điều nào KHÔNG nên làm chỉ vì "văn hoá đối phương khác"?', options: ['Điều chỉnh phong cách giao tiếp', 'Từ bỏ giá rút lui hoặc chuẩn đạo đức của chính mình', 'Tìm hiểu quan niệm thời gian của họ', 'Dành thời gian xây quan hệ trước'], correctIndex: 1, explanation: 'Thích nghi phong cách khác với từ bỏ giá rút lui hay đạo đức của mình.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'SSN302',
    slug: 'ssn302-negotiation',
    title: 'Negotiation',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SSN302.webp',
    shortDescription: 'Negotiation: distributive (BATNA/ZOPA) vs. integrative bargaining, preparation & planning, strategy/tactics/power, communication & psychology, multiparty/mediated negotiation, cross-cultural & ethical negotiation. Bilingual, with examples & quizzes.|||Đàm phán: phân phối (BATNA/ZOPA) vs. tích hợp, chuẩn bị & lập kế hoạch, chiến lược/chiến thuật/quyền lực, giao tiếp & tâm lý, đàm phán đa bên/qua trung gian, đàm phán xuyên văn hoá & đạo đức. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>SSN302 — Negotiation</strong> (kỳ 5, khối Quản trị Kinh doanh) xây kỹ năng <strong>đàm phán thực dụng</strong>. Từ <strong>tổng quan &amp; các loại đàm phán</strong> → <strong>phân phối</strong> (BATNA/ZOPA) → <strong>tích hợp</strong> (tạo giá trị, log-rolling, bridging) → <strong>chuẩn bị &amp; lập kế hoạch</strong> → <strong>chiến lược, chiến thuật &amp; quyền lực</strong> → <strong>giao tiếp, cảm xúc &amp; tâm lý</strong> → <strong>đàm phán đa bên &amp; qua trung gian</strong> → <strong>đàm phán xuyên văn hoá &amp; đạo đức</strong>. Bám theo "Getting to Yes" (Fisher &amp; Ury), "Negotiation" (Lewicki/Barry/Saunders) và "Bargaining for Advantage" (Shell); song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Định nghĩa đàm phán & khi nào nó xảy ra; đàm phán phân phối vs. tích hợp; BATNA, giá rút lui, ZOPA, khoảng đàm phán; log-rolling, bridging, cost-cutting, thoả thuận có điều kiện; danh sách chuẩn bị & lập kế hoạch 8 bước; mô hình quan tâm kép (5 chiến lược) & 5 nguồn quyền lực; lắng nghe chủ động, reframing, định kiến nhận thức (anchoring, fixed-pie, quá tự tin, hạ giá phản ứng); đàm phán đa bên, trung gian hoà giải vs. trọng tài; văn hoá cá nhân/tập thể, ngữ cảnh cao/thấp, đạo đức đàm phán.',
    requirements: 'Không yêu cầu kiến thức trước. Nên đọc song song "Getting to Yes" (Fisher & Ury) để có ví dụ thực tế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Đàm phán là gì, khi nào xảy ra, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & các loại đàm phán|||Chapter 1 — Overview & types', description: 'Phân phối vs. tích hợp; lập trường vs. nguyên tắc.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Đàm phán phân phối|||Chapter 2 — Distributive negotiation', description: 'BATNA, giá rút lui, ZOPA, neo giá.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Đàm phán tích hợp|||Chapter 3 — Integrative negotiation', description: 'Log-rolling, bridging, cost-cutting.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Chuẩn bị & lập kế hoạch|||Chapter 4 — Preparation & planning', description: 'Danh sách chuẩn bị 8 bước.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Chiến lược, chiến thuật & quyền lực|||Chapter 5 — Strategy, tactics & power', description: 'Mô hình quan tâm kép, 5 nguồn quyền lực.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Giao tiếp, cảm xúc & tâm lý|||Chapter 6 — Communication, emotion & psychology', description: 'Lắng nghe chủ động, định kiến nhận thức.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Đàm phán đa bên & qua trung gian|||Chapter 7 — Multiparty & mediated negotiation', description: 'Liên minh, trung gian vs. trọng tài, xung đột.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Xuyên văn hoá, đạo đức & quốc tế|||Chapter 8 — Cross-cultural, ethics & international', description: 'Văn hoá, đạo đức đàm phán, thực tế quốc tế.', lessons: [c8, c8q] },
  ],
};
