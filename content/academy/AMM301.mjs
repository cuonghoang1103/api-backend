/**
 * AMM301 — Account Management (Quản trị khách hàng — agency). Ngành Truyền
 * thông FPTU. Môn KHÔNG có FLM → dựng theo giáo trình chuẩn quốc tế ngành
 * quảng cáo/agency: IPA/4A's account management, "Truth, Lies & Advertising"
 * (Jon Steel / APG), HBR on client management, AdAge/Campaign.
 * 8 chương: vai trò AM → quan hệ KH → brief & creative brief → quản lý dự án
 * → trình bày & thuyết phục → tài chính & thương mại → phát triển tài khoản
 * → xung đột & đạo đức nghề. Song ngữ + quy trình + ví dụ thật + quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('amm301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách kinh điển ngành, hiệp hội (IPA/4A\'s/APG), báo chuyên ngành (AdAge/Campaign), HBR, công cụ quản lý (Trello/Asana, brief template), lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">AMM301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to learn <strong>agency account management</strong> — the craft of managing advertising &amp; communications clients from brief to billing — in one place. There is no single FPTU textbook; instead we follow the industry-standard bodies of knowledge below.</p>
<h3>📗 Core books</h3>
<ul>
<li><a href="https://www.goodreads.com/book/show/288956.Truth_Lies_and_Advertising" target="_blank" rel="noopener"><em>Truth, Lies &amp; Advertising</em> — Jon Steel</a> — the classic on account planning &amp; the brief.</li>
<li><a href="https://www.goodreads.com/book/show/1633163.Perfect_Pitch" target="_blank" rel="noopener"><em>Perfect Pitch</em> — Jon Steel</a> — presenting &amp; winning the room.</li>
<li><a href="https://www.goodreads.com/book/show/23310374-hegarty-on-advertising" target="_blank" rel="noopener"><em>Hegarty on Advertising</em> — John Hegarty</a> — how great agency work is built.</li>
</ul>
<h3>🌐 Professional bodies</h3>
<ul>
<li><a href="https://ipa.co.uk/" target="_blank" rel="noopener">IPA (Institute of Practitioners in Advertising)</a> — account management standards &amp; qualifications.</li>
<li><a href="https://www.aaaa.org/" target="_blank" rel="noopener">4A's (American Association of Advertising Agencies)</a> — agency management resources.</li>
<li><a href="https://www.apg.org.uk/" target="_blank" rel="noopener">APG (Account Planning Group)</a> — the discipline of planning &amp; briefs.</li>
</ul>
<h3>📰 Industry press</h3>
<ul>
<li><a href="https://adage.com/" target="_blank" rel="noopener">AdAge</a> — US advertising news &amp; case studies.</li>
<li><a href="https://www.campaignlive.co.uk/" target="_blank" rel="noopener">Campaign</a> — global agency &amp; client news.</li>
<li><a href="https://hbr.org/topic/subject/client-management" target="_blank" rel="noopener">Harvard Business Review — client management</a>.</li>
</ul>
<h3>🛠️ Tools of the job</h3>
<ul>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> / <a href="https://asana.com/" target="_blank" rel="noopener">Asana</a> — traffic, tasks &amp; timelines.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — status reports, budget trackers, scope logs.</li>
<li>Brief templates — creative brief, contact report, scope-of-work &amp; timeline docs.</li>
</ul>
<div class="callout"><span class="badge">Self-study path (4 steps)</span>
<ol>
<li><strong>Understand the role</strong> — what account management is, how an agency is structured, AM vs planner vs creative.</li>
<li><strong>Master the brief</strong> — take a client brief, interrogate it, and write a sharp creative brief.</li>
<li><strong>Run the work</strong> — manage timelines, budgets, traffic and client presentations end-to-end.</li>
<li><strong>Grow the account</strong> — build trust, protect profitability, upsell/retain, and handle conflict professionally.</li>
</ol></div>`,
    `<span class="eyebrow">AMM301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>quản trị khách hàng trong agency</strong> — nghề dẫn dắt khách hàng quảng cáo &amp; truyền thông từ lúc nhận brief tới lúc xuất hoá đơn — gom về một chỗ. Môn không có một giáo trình FPTU cố định; thay vào đó ta bám các bộ kiến thức chuẩn ngành dưới đây.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><a href="https://www.goodreads.com/book/show/288956.Truth_Lies_and_Advertising" target="_blank" rel="noopener"><em>Truth, Lies &amp; Advertising</em> — Jon Steel</a> — kinh điển về account planning &amp; bản brief.</li>
<li><a href="https://www.goodreads.com/book/show/1633163.Perfect_Pitch" target="_blank" rel="noopener"><em>Perfect Pitch</em> — Jon Steel</a> — trình bày &amp; chinh phục phòng họp.</li>
<li><a href="https://www.goodreads.com/book/show/23310374-hegarty-on-advertising" target="_blank" rel="noopener"><em>Hegarty on Advertising</em> — John Hegarty</a> — cách dựng nên tác phẩm agency hay.</li>
</ul>
<h3>🌐 Hiệp hội nghề</h3>
<ul>
<li><a href="https://ipa.co.uk/" target="_blank" rel="noopener">IPA (Institute of Practitioners in Advertising)</a> — chuẩn &amp; chứng chỉ account management.</li>
<li><a href="https://www.aaaa.org/" target="_blank" rel="noopener">4A's (Hiệp hội các agency quảng cáo Mỹ)</a> — tài liệu quản trị agency.</li>
<li><a href="https://www.apg.org.uk/" target="_blank" rel="noopener">APG (Account Planning Group)</a> — bộ môn planning &amp; brief.</li>
</ul>
<h3>📰 Báo chuyên ngành</h3>
<ul>
<li><a href="https://adage.com/" target="_blank" rel="noopener">AdAge</a> — tin quảng cáo Mỹ &amp; case study.</li>
<li><a href="https://www.campaignlive.co.uk/" target="_blank" rel="noopener">Campaign</a> — tin agency &amp; khách hàng toàn cầu.</li>
<li><a href="https://hbr.org/topic/subject/client-management" target="_blank" rel="noopener">Harvard Business Review — quản trị khách hàng</a>.</li>
</ul>
<h3>🛠️ Công cụ hành nghề</h3>
<ul>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> / <a href="https://asana.com/" target="_blank" rel="noopener">Asana</a> — điều phối (traffic), đầu việc &amp; tiến độ.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — báo cáo trạng thái, bảng ngân sách, nhật ký scope.</li>
<li>Mẫu văn bản — creative brief, contact report, scope-of-work &amp; timeline.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học (4 bước)</span>
<ol>
<li><strong>Hiểu vai trò</strong> — account management là gì, agency cấu trúc thế nào, AM vs planner vs creative.</li>
<li><strong>Thạo bản brief</strong> — nhận brief khách, chất vấn nó, và viết creative brief sắc bén.</li>
<li><strong>Vận hành công việc</strong> — quản tiến độ, ngân sách, traffic và các buổi trình bày end-to-end.</li>
<li><strong>Phát triển tài khoản</strong> — xây niềm tin, giữ lợi nhuận, upsell/giữ chân, và xử lý xung đột chuyên nghiệp.</li>
</ol></div>`,
  ]]);

const intro = doc('amm301-0-1-overview', 'Course overview: Agency account management|||Tổng quan: Quản trị khách hàng agency',
  'Account management là gì; AM là "cầu nối" giữa khách hàng và agency; lộ trình 8 chương: vai trò → quan hệ → brief → dự án → trình bày → tài chính → phát triển tài khoản → xung đột & đạo đức.',
  [[
    `<span class="eyebrow">AMM301 · Lesson 0.1 · Overview</span>
<h2>Agency account management</h2>
<p class="lead">This course teaches <strong>account management</strong> — the discipline that runs the relationship between a client and a creative agency. The account manager (AM) is the person who understands the client's business, briefs the agency, sells the work back, keeps the project on time and on budget, and grows the account over years.</p>
<h3>The one-line definition</h3>
<p>An account manager is the <strong>bridge</strong> between the client and the agency: representing the client's business inside the agency, and representing the agency's thinking to the client — while owning timeline, budget and quality.</p>
<h3>Why it exists</h3>
<p>Creative teams make the work; planners find the strategic insight; but somebody has to translate a real business problem into a brief, orchestrate a dozen specialists, manage money and expectations, and be trusted enough that the client stays. That is account management — the commercial and relationship spine of the agency.</p>
<h3>Roadmap</h3>
<p>Role &amp; agency structure → client relationships &amp; trust → the brief &amp; creative brief → project &amp; process management → presenting &amp; persuading → finance &amp; commercials → account growth &amp; retention → conflict &amp; professional ethics. Bilingual, with real examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">AMM301 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị khách hàng agency</h2>
<p class="lead">Môn này dạy <strong>account management</strong> — bộ môn vận hành quan hệ giữa khách hàng và agency sáng tạo. Account manager (AM) là người hiểu công việc kinh doanh của khách, brief cho agency, "bán" lại tác phẩm, giữ dự án đúng hạn &amp; đúng ngân sách, và nuôi lớn tài khoản qua nhiều năm.</p>
<h3>Định nghĩa một dòng</h3>
<p>Account manager là <strong>cầu nối</strong> giữa khách hàng và agency: đại diện cho lợi ích kinh doanh của khách bên trong agency, và đại diện cho tư duy của agency trước mặt khách — đồng thời chịu trách nhiệm về tiến độ, ngân sách và chất lượng.</p>
<h3>Vì sao nghề này tồn tại</h3>
<p>Đội sáng tạo làm ra tác phẩm; planner tìm insight chiến lược; nhưng phải có người dịch một bài toán kinh doanh thật thành bản brief, điều phối cả chục chuyên gia, quản tiền và quản kỳ vọng, và đủ đáng tin để khách ở lại. Đó là account management — xương sống thương mại &amp; quan hệ của agency.</p>
<h3>Lộ trình</h3>
<p>Vai trò &amp; cấu trúc agency → quan hệ &amp; niềm tin → brief &amp; creative brief → quản lý dự án &amp; quy trình → trình bày &amp; thuyết phục → tài chính &amp; thương mại → phát triển &amp; giữ chân tài khoản → xung đột &amp; đạo đức nghề. Song ngữ, có ví dụ thật và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('amm301-1-1-role', '1.1 — What account management is & the agency|||1.1 — Account management là gì & cấu trúc agency',
  'Vai trò AM; cấu trúc agency (account, planning, creative, media, production); phân biệt AM vs planner vs creative; cấp bậc account (executive → manager → director).',
  [[
    `<span class="eyebrow">AMM301 · Chapter 1 · Lesson 1.1</span>
<h2>What account management is &amp; the agency</h2>
<h3>The account manager's job</h3>
<p>The AM owns the client relationship and the smooth running of the work. Day to day that means: taking briefs, writing them up, briefing internal teams, chasing timelines, managing budgets, presenting work, writing <strong>contact reports</strong> (a written record of every meeting and decision), and being the single point of contact the client trusts.</p>
<h3>How an agency is structured</h3>
<ul>
<li><strong>Account management</strong> — owns the client relationship, commercials and delivery.</li>
<li><strong>Account planning / strategy</strong> — finds the consumer insight and writes the strategic part of the brief.</li>
<li><strong>Creative</strong> — art directors &amp; copywriters who make the ideas.</li>
<li><strong>Media</strong> — plans &amp; buys where the work runs.</li>
<li><strong>Production / traffic</strong> — makes the assets and moves jobs through the studio.</li>
</ul>
<h3>AM vs planner vs creative</h3>
<pre><code>Planner  -> WHY  (the insight &amp; strategy: why this, why now)
Creative -> WHAT (the idea &amp; execution)
Account  -> HOW  (make it happen: brief, budget, timeline, client)
</code></pre>
<h3>The account ladder</h3>
<p>Typical path: <strong>Account Executive</strong> (does the doing) → <strong>Account Manager</strong> (owns a piece of business) → <strong>Account Director</strong> (owns the relationship &amp; commercials) → <strong>Group / Business Director</strong>.</p>
<div class="callout"><span class="badge">Real example</span> When Nike briefs its agency for a new campaign, the AM takes the brief, aligns planning &amp; creative internally, agrees a budget and timeline, and is the person Nike calls when anything changes — not the creative director.</div>`,
    `<span class="eyebrow">AMM301 · Chương 1 · Bài 1.1</span>
<h2>Account management là gì &amp; cấu trúc agency</h2>
<h3>Công việc của account manager</h3>
<p>AM sở hữu quan hệ khách hàng và sự trơn tru của công việc. Hằng ngày nghĩa là: nhận brief, viết lại brief, brief cho các đội nội bộ, đốc tiến độ, quản ngân sách, trình bày tác phẩm, viết <strong>contact report</strong> (bản ghi mọi cuộc họp và quyết định), và là đầu mối duy nhất mà khách tin.</p>
<h3>Agency được cấu trúc thế nào</h3>
<ul>
<li><strong>Account management</strong> — sở hữu quan hệ khách, thương mại và bàn giao.</li>
<li><strong>Account planning / chiến lược</strong> — tìm insight người tiêu dùng và viết phần chiến lược của brief.</li>
<li><strong>Creative</strong> — art director &amp; copywriter làm ra ý tưởng.</li>
<li><strong>Media</strong> — lên kế hoạch &amp; mua chỗ chạy tác phẩm.</li>
<li><strong>Production / traffic</strong> — sản xuất tài sản và luân chuyển việc qua studio.</li>
</ul>
<h3>AM vs planner vs creative</h3>
<pre><code>Planner  -> TẠI SAO (insight &amp; chiến lược: vì sao thứ này, vì sao lúc này)
Creative -> CÁI GÌ  (ý tưởng &amp; thể hiện)
Account  -> LÀM SAO (biến nó thành hiện thực: brief, ngân sách, tiến độ, khách)
</code></pre>
<h3>Nấc thang account</h3>
<p>Lộ trình điển hình: <strong>Account Executive</strong> (làm việc tay chân) → <strong>Account Manager</strong> (sở hữu một mảng việc) → <strong>Account Director</strong> (sở hữu quan hệ &amp; thương mại) → <strong>Group / Business Director</strong>.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Khi Nike brief agency cho một chiến dịch mới, AM nhận brief, gắn kết planning &amp; creative nội bộ, chốt ngân sách và tiến độ, và là người Nike gọi khi có bất kỳ thay đổi nào — không phải creative director.</div>`,
  ]]);

const c1q = quiz('amm301-quiz-1', 'Quiz 1 — Role & agency|||Quiz 1 — Vai trò & agency', [
  { id: 'q1', question: 'Account manager đóng vai trò chính là gì?', options: ['Người nghĩ ý tưởng sáng tạo', 'Cầu nối giữa khách hàng và agency', 'Người mua media', 'Người dựng phim'], correctIndex: 1, explanation: 'AM là cầu nối: đại diện khách trong agency và đại diện agency trước khách.' },
  { id: 'q2', question: 'Ai chịu trách nhiệm tìm insight & viết phần chiến lược của brief?', options: ['Account manager', 'Creative', 'Planner (account planning)', 'Traffic'], correctIndex: 2, explanation: 'Planner phụ trách "TẠI SAO" — insight và chiến lược.' },
  { id: 'q3', question: 'Contact report là gì?', options: ['Hoá đơn gửi khách', 'Bản ghi mọi cuộc họp và quyết định', 'Danh sách liên hệ khách', 'Báo cáo doanh thu'], correctIndex: 1, explanation: 'Contact report ghi lại nội dung họp và các quyết định, tránh hiểu lầm sau này.' },
]);

const c2 = doc('amm301-2-1-relationship', '2.1 — Client relationships & trust|||2.1 — Quan hệ khách hàng & niềm tin',
  'Xây niềm tin (độ tin cậy, năng lực, sự tận tâm); quản lý kỳ vọng; giao tiếp chủ động; "under-promise, over-deliver"; trở thành đối tác thay vì nhà cung cấp.',
  [[
    `<span class="eyebrow">AMM301 · Chapter 2 · Lesson 2.1</span>
<h2>Client relationships &amp; trust</h2>
<h3>Trust is the whole job</h3>
<p>Clients don't stay for the lowest price — they stay for trust. Trust is built from three things done consistently: <strong>competence</strong> (you do good work), <strong>reliability</strong> (you do what you said, when you said), and <strong>care</strong> (you act in their interest, not just the agency's).</p>
<h3>Managing expectations</h3>
<p>Most client "disasters" are expectation failures, not quality failures. The rule: <strong>under-promise and over-deliver</strong>. Agree what "done" looks like <em>up front</em>, put it in writing, and never let a client be surprised — a bad update delivered early beats a good one delivered late.</p>
<h3>Proactive vs reactive</h3>
<ul>
<li><strong>Reactive AM</strong> — waits for the client to ask, then answers. Feels like a supplier.</li>
<li><strong>Proactive AM</strong> — brings ideas, flags risks before they bite, knows the client's numbers. Feels like a partner.</li>
</ul>
<h3>From vendor to partner</h3>
<pre><code>Vendor  -> "What do you want us to make?"      (order-taker)
Partner -> "Here is a business problem worth
            solving, and how we'd solve it."    (trusted advisor)
</code></pre>
<div class="callout"><span class="badge">Real example</span> An AM notices a client's competitor just launched a price promotion. Instead of waiting for the panicked call, she emails the client that morning with a one-page reactive plan. That single proactive move is worth more than a year of on-time status reports — it says "I'm watching your business, not just my deadlines."</div>`,
    `<span class="eyebrow">AMM301 · Chương 2 · Bài 2.1</span>
<h2>Quan hệ khách hàng &amp; niềm tin</h2>
<h3>Niềm tin là toàn bộ công việc</h3>
<p>Khách không ở lại vì giá rẻ nhất — họ ở lại vì niềm tin. Niềm tin dựng từ ba thứ làm đều đặn: <strong>năng lực</strong> (bạn làm tốt), <strong>độ tin cậy</strong> (bạn làm đúng điều đã hứa, đúng lúc đã hẹn), và <strong>sự tận tâm</strong> (bạn hành động vì lợi ích của họ, không chỉ của agency).</p>
<h3>Quản lý kỳ vọng</h3>
<p>Hầu hết "thảm hoạ" với khách là lỗi kỳ vọng, không phải lỗi chất lượng. Nguyên tắc: <strong>hứa ít, làm nhiều hơn</strong>. Thống nhất "xong" trông thế nào <em>ngay từ đầu</em>, ghi ra giấy, và đừng bao giờ để khách bị bất ngờ — một tin xấu báo sớm còn hơn tin tốt báo trễ.</p>
<h3>Chủ động vs bị động</h3>
<ul>
<li><strong>AM bị động</strong> — chờ khách hỏi rồi mới trả lời. Giống một nhà cung cấp.</li>
<li><strong>AM chủ động</strong> — mang ý tưởng tới, cảnh báo rủi ro trước khi nó cắn, thuộc các con số của khách. Giống một đối tác.</li>
</ul>
<h3>Từ nhà cung cấp thành đối tác</h3>
<pre><code>Nhà cung cấp -> "Anh muốn tụi em làm gì?"          (người nhận đơn)
Đối tác      -> "Đây là một bài toán kinh doanh đáng
                giải, và cách tụi em sẽ giải."       (cố vấn đáng tin)
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> Một AM nhận ra đối thủ của khách vừa tung khuyến mãi giá. Thay vì chờ cú điện thoại hoảng loạn, sáng đó cô email cho khách một kế hoạch phản ứng gói gọn một trang. Chỉ một động thái chủ động đó đáng giá hơn cả năm báo cáo trạng thái đúng hạn — nó nói "em đang theo dõi công việc kinh doanh của anh, không chỉ deadline của em".</div>`,
  ]]);

const c2q = quiz('amm301-quiz-2', 'Quiz 2 — Relationship & trust|||Quiz 2 — Quan hệ & niềm tin', [
  { id: 'q1', question: 'Ba thành tố xây niềm tin với khách là?', options: ['Giá rẻ, nhanh, đẹp', 'Năng lực, độ tin cậy, sự tận tâm', 'Ngân sách, quà tặng, tiệc', 'Hợp đồng, phạt, thưởng'], correctIndex: 1, explanation: 'Niềm tin = competence + reliability + care, làm đều đặn.' },
  { id: 'q2', question: 'Nguyên tắc "under-promise, over-deliver" nghĩa là?', options: ['Hứa nhiều để chốt hợp đồng', 'Hứa ít, làm nhiều hơn kỳ vọng', 'Không hứa gì cả', 'Chỉ hứa khi có phụ phí'], correctIndex: 1, explanation: 'Đặt kỳ vọng thấp hợp lý rồi vượt nó — tránh thất vọng.' },
  { id: 'q3', question: 'AM "chủ động" khác AM "bị động" ở điểm nào?', options: ['Chờ khách hỏi rồi trả lời', 'Mang ý tưởng & cảnh báo rủi ro trước', 'Chỉ gửi hoá đơn đúng hạn', 'Không liên lạc giữa các dự án'], correctIndex: 1, explanation: 'AM chủ động flag rủi ro trước khi nó xảy ra, cư xử như đối tác.' },
]);

const c3 = doc('amm301-3-1-brief', '3.1 — The client brief & the creative brief|||3.1 — Client brief & tóm tắt sáng tạo',
  'Nhận & chất vấn (interrogate) brief khách; viết creative brief sắc bén (bối cảnh, mục tiêu, đối tượng, single-minded proposition, tone, mandatory); "a good brief is a springboard, not a cage".',
  [[
    `<span class="eyebrow">AMM301 · Chapter 3 · Lesson 3.1</span>
<h2>The client brief &amp; the creative brief</h2>
<h3>Two different briefs</h3>
<p>The <strong>client brief</strong> is what the client hands you — often vague, sometimes a solution disguised as a problem ("we need a TikTok video"). The <strong>creative brief</strong> is what the agency writes <em>from</em> it: a tight, inspiring document that points the creative team at the real problem.</p>
<h3>Interrogate the brief</h3>
<p>Never take a client brief at face value. Ask: What is the real business problem? Who exactly are we talking to? What do we want them to think, feel, do? What is the single most important thing to say? Jon Steel's rule: <strong>interrogate the product/problem until it confesses its strength</strong>.</p>
<h3>Anatomy of a creative brief</h3>
<ul>
<li><strong>Background / context</strong> — the business situation.</li>
<li><strong>Objective</strong> — what success looks like, measurably.</li>
<li><strong>Target audience</strong> — a real human, not a demographic.</li>
<li><strong>Single-minded proposition</strong> — the ONE thing to communicate.</li>
<li><strong>Support / reasons to believe</strong>.</li>
<li><strong>Tone of voice</strong> and <strong>mandatories</strong> (logo, legal, deadlines).</li>
</ul>
<pre><code>Weak proposition : "Our coffee is high quality and affordable."
Sharp proposition: "The good coffee you don't have to feel
                    guilty paying for."   (single-minded)
</code></pre>
<div class="callout"><span class="badge">A brief is a springboard, not a cage</span> The best creative brief is short and provocative — it gives the team a sharp problem and the freedom to solve it, not a checklist that dictates the answer.</div>`,
    `<span class="eyebrow">AMM301 · Chương 3 · Bài 3.1</span>
<h2>Client brief &amp; creative brief</h2>
<h3>Hai bản brief khác nhau</h3>
<p><strong>Client brief</strong> là thứ khách đưa cho bạn — thường mơ hồ, đôi khi là một giải pháp đội lốt vấn đề ("bọn anh cần một video TikTok"). <strong>Creative brief</strong> là thứ agency viết <em>từ</em> nó: một văn bản cô đọng, truyền cảm hứng, chỉ đội creative vào đúng vấn đề thật.</p>
<h3>Chất vấn (interrogate) bản brief</h3>
<p>Đừng bao giờ nhận client brief theo nghĩa đen. Hãy hỏi: Bài toán kinh doanh thật là gì? Ta đang nói với chính xác ai? Ta muốn họ nghĩ gì, cảm gì, làm gì? Điều quan trọng nhất cần nói là gì? Nguyên tắc của Jon Steel: <strong>tra khảo sản phẩm/vấn đề cho tới khi nó khai ra điểm mạnh</strong>.</p>
<h3>Giải phẫu một creative brief</h3>
<ul>
<li><strong>Bối cảnh</strong> — tình huống kinh doanh.</li>
<li><strong>Mục tiêu</strong> — thành công trông thế nào, đo được.</li>
<li><strong>Đối tượng</strong> — một con người thật, không phải một nhóm nhân khẩu.</li>
<li><strong>Single-minded proposition</strong> — MỘT điều duy nhất cần truyền đạt.</li>
<li><strong>Lý do để tin (support)</strong>.</li>
<li><strong>Tone of voice</strong> và <strong>mandatory</strong> (logo, pháp lý, deadline).</li>
</ul>
<pre><code>Proposition yếu : "Cà phê của tụi tôi chất lượng cao và giá tốt."
Proposition sắc: "Ly cà phê ngon mà bạn không phải áy náy
                 khi trả tiền."   (một-điều-duy-nhất)
</code></pre>
<div class="callout"><span class="badge">Brief là bàn đạp, không phải cái lồng</span> Creative brief hay nhất thì ngắn và khiêu khích — nó trao cho đội một vấn đề sắc và quyền tự do giải, không phải một danh sách áp đặt câu trả lời.</div>`,
  ]]);

const c3q = quiz('amm301-quiz-3', 'Quiz 3 — The brief|||Quiz 3 — Bản brief', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa client brief và creative brief?', options: ['Chúng giống hệt nhau', 'Client brief do khách đưa; creative brief do agency viết từ nó, sắc & truyền cảm hứng', 'Creative brief chỉ có logo', 'Client brief do creative viết'], correctIndex: 1, explanation: 'AM/planner "dịch" client brief thành creative brief để định hướng đội sáng tạo.' },
  { id: 'q2', question: '"Single-minded proposition" là gì?', options: ['Danh sách mọi tính năng sản phẩm', 'MỘT điều quan trọng nhất cần truyền đạt', 'Ngân sách chiến dịch', 'Tên khách hàng'], correctIndex: 1, explanation: 'Chọn một thông điệp duy nhất, đắt giá nhất — không nhồi mọi thứ.' },
  { id: 'q3', question: '"Interrogate the brief" nghĩa là?', options: ['Nhận brief đúng nguyên văn khách nói', 'Chất vấn để tìm ra vấn đề & điểm mạnh thật', 'Bỏ qua brief và tự sáng tạo', 'Gửi brief thẳng cho media'], correctIndex: 1, explanation: 'Không nhận theo nghĩa đen; đào tới bài toán thật trước khi viết creative brief.' },
]);

const c4 = doc('amm301-4-1-project', '4.1 — Project & process management|||4.1 — Quản lý dự án & quy trình',
  'Workflow agency (brief→concept→production→delivery); timeline & critical path; traffic/điều phối; quản ngân sách (estimate, cost control); status report & contact report; công cụ (Trello/Asana).',
  [[
    `<span class="eyebrow">AMM301 · Chapter 4 · Lesson 4.1</span>
<h2>Project &amp; process management</h2>
<h3>The agency workflow</h3>
<pre><code>Brief -> Strategy -> Creative concept -> Client approval
      -> Production -> Review/amends -> Final delivery -> Billing
</code></pre>
<p>The AM shepherds a job through every stage, catching bottlenecks before they cost time or money.</p>
<h3>Timeline &amp; the critical path</h3>
<p>Build a timeline backwards from the client's launch date. Identify the <strong>critical path</strong> — the chain of tasks where any slip delays everything (e.g. shoot → edit → client sign-off → media deadline). Protect that chain first.</p>
<h3>Traffic — moving work through the building</h3>
<p><strong>Traffic</strong> is the day-to-day flow of jobs between teams: who has the file, what's the next step, what's blocked. Tools like <strong>Trello</strong> or <strong>Asana</strong> make status visible so nothing sits unnoticed on someone's desk.</p>
<h3>Budget control</h3>
<ul>
<li><strong>Estimate</strong> up front and get it approved before work starts.</li>
<li><strong>Track</strong> actuals vs estimate as you go.</li>
<li><strong>Flag overruns early</strong> — a client will accept a heads-up; they will not accept a surprise invoice.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> A shoot runs one day over. A weak AM absorbs it silently and blows the margin; a strong AM calls the client that evening, explains why, and agrees who pays the extra day <em>before</em> the invoice — the same fact, handled two ways, keeps or loses the account.</div>`,
    `<span class="eyebrow">AMM301 · Chương 4 · Bài 4.1</span>
<h2>Quản lý dự án &amp; quy trình</h2>
<h3>Quy trình vận hành của agency</h3>
<pre><code>Brief -> Chiến lược -> Concept sáng tạo -> Khách duyệt
      -> Sản xuất -> Review/chỉnh sửa -> Bàn giao cuối -> Xuất hoá đơn
</code></pre>
<p>AM dẫn dắt một việc qua từng chặng, bắt các nút thắt trước khi chúng tốn thời gian hay tiền.</p>
<h3>Tiến độ &amp; đường găng (critical path)</h3>
<p>Dựng timeline ngược từ ngày ra mắt của khách. Xác định <strong>đường găng</strong> — chuỗi việc mà bất kỳ chậm trễ nào cũng làm trễ tất cả (vd quay → dựng → khách duyệt → deadline media). Bảo vệ chuỗi đó trước tiên.</p>
<h3>Traffic — luân chuyển việc trong toà nhà</h3>
<p><strong>Traffic</strong> là dòng chảy hằng ngày của các việc giữa các đội: ai đang giữ file, bước kế là gì, đang kẹt ở đâu. Công cụ như <strong>Trello</strong> hay <strong>Asana</strong> làm trạng thái hiện rõ để không việc nào nằm im vô hình trên bàn ai đó.</p>
<h3>Kiểm soát ngân sách</h3>
<ul>
<li><strong>Ước tính (estimate)</strong> từ đầu và được duyệt trước khi bắt đầu.</li>
<li><strong>Theo dõi</strong> chi thực tế so với ước tính trong lúc chạy.</li>
<li><strong>Cảnh báo vượt sớm</strong> — khách chấp nhận một lời báo trước; họ không chấp nhận một hoá đơn bất ngờ.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> Buổi quay kéo dài thêm một ngày. AM yếu âm thầm gánh và làm bay lợi nhuận; AM giỏi gọi khách ngay tối đó, giải thích lý do, và thống nhất ai trả ngày phát sinh <em>trước</em> khi ra hoá đơn — cùng một sự việc, xử hai cách, giữ hoặc mất tài khoản.</div>`,
  ]]);

const c4q = quiz('amm301-quiz-4', 'Quiz 4 — Project & process|||Quiz 4 — Dự án & quy trình', [
  { id: 'q1', question: '"Critical path" (đường găng) là gì?', options: ['Con đường tới văn phòng khách', 'Chuỗi việc mà chậm bất kỳ khâu nào cũng làm trễ cả dự án', 'Ngân sách lớn nhất', 'Danh sách khách VIP'], correctIndex: 1, explanation: 'Đường găng là chuỗi phụ thuộc quyết định ngày hoàn thành — cần bảo vệ trước.' },
  { id: 'q2', question: '"Traffic" trong agency nghĩa là?', options: ['Lưu lượng website', 'Kẹt xe khi đi gặp khách', 'Luân chuyển & theo dõi các đầu việc giữa các đội', 'Chi phí quảng cáo'], correctIndex: 2, explanation: 'Traffic là điều phối dòng công việc để không việc nào bị kẹt vô hình.' },
  { id: 'q3', question: 'Khi ngân sách sắp vượt, AM nên làm gì?', options: ['Âm thầm gánh để khách vui', 'Cảnh báo khách sớm & thống nhất ai trả trước khi ra hoá đơn', 'Chờ tới lúc xuất hoá đơn mới nói', 'Cắt chất lượng không báo'], correctIndex: 1, explanation: 'Flag overrun sớm; khách chấp nhận báo trước, không chấp nhận hoá đơn bất ngờ.' },
]);

const c5 = doc('amm301-5-1-presenting', '5.1 — Presenting & persuading the client|||5.1 — Trình bày & thuyết phục khách hàng',
  'Bán ý tưởng (không chỉ trình bày); cấu trúc buổi present (set-up → idea → rationale); xử lý phản hồi & bị từ chối (rejection); tách "ý kiến" khỏi "vấn đề thật"; Jon Steel "Perfect Pitch".',
  [[
    `<span class="eyebrow">AMM301 · Chapter 5 · Lesson 5.1</span>
<h2>Presenting &amp; persuading the client</h2>
<h3>Selling, not just showing</h3>
<p>Great creative dies in bad presentations. The AM's job is to <strong>sell the idea</strong> — to frame it so the client sees the problem it solves before they see the execution. Never open by revealing the ad; open by re-selling the problem and the strategy, so the work lands as the inevitable answer.</p>
<h3>Structure of a persuasive presentation</h3>
<pre><code>1. Set-up   -> restate the problem &amp; the brief (agreement)
2. Insight  -> the strategic thought behind the work
3. The idea -> reveal the creative
4. Rationale-> why it will work (tie back to the objective)
5. Next steps -> what you need from the client
</code></pre>
<h3>Handling feedback &amp; rejection</h3>
<ul>
<li><strong>Listen fully</strong> before defending — clients often express a real concern badly.</li>
<li><strong>Separate the problem from the prescription.</strong> "Make the logo bigger" is usually "I'm worried it won't be noticed" — solve the worry, not the literal instruction.</li>
<li><strong>Never argue in the room</strong> when emotions are high; take the note, understand it, come back with a considered response.</li>
</ul>
<div class="callout"><span class="badge">Perfect Pitch</span> Jon Steel's lesson: preparation and empathy win pitches, not slickness. Know the room, rehearse, anticipate objections — and make the client feel the idea is partly theirs.</div>`,
    `<span class="eyebrow">AMM301 · Chương 5 · Bài 5.1</span>
<h2>Trình bày &amp; thuyết phục khách hàng</h2>
<h3>Bán, không chỉ trình bày</h3>
<p>Tác phẩm hay chết trong buổi present dở. Việc của AM là <strong>bán ý tưởng</strong> — dựng khung để khách thấy vấn đề mà nó giải trước khi thấy phần thể hiện. Đừng mở màn bằng việc phô cái quảng cáo; hãy mở bằng việc bán lại vấn đề và chiến lược, để tác phẩm rơi xuống như câu trả lời tất yếu.</p>
<h3>Cấu trúc một buổi present thuyết phục</h3>
<pre><code>1. Set-up    -> nhắc lại vấn đề &amp; brief (tạo đồng thuận)
2. Insight   -> tư duy chiến lược đằng sau tác phẩm
3. Ý tưởng   -> hé lộ phần sáng tạo
4. Lý giải   -> vì sao nó sẽ hiệu quả (nối lại mục tiêu)
5. Bước kế   -> bạn cần gì từ khách
</code></pre>
<h3>Xử lý phản hồi &amp; bị từ chối</h3>
<ul>
<li><strong>Nghe trọn vẹn</strong> trước khi bảo vệ — khách thường diễn đạt một mối lo thật một cách vụng.</li>
<li><strong>Tách vấn đề khỏi đơn thuốc.</strong> "Làm logo to lên" thường là "tôi sợ nó không được để ý" — giải mối lo đó, không phải câu chữ.</li>
<li><strong>Đừng cãi ngay trong phòng</strong> khi cảm xúc dâng cao; ghi nhận note, hiểu nó, quay lại với phản hồi đã cân nhắc.</li>
</ul>
<div class="callout"><span class="badge">Perfect Pitch</span> Bài học của Jon Steel: chuẩn bị và thấu cảm thắng pitch, không phải sự bóng bẩy. Hiểu căn phòng, tập dượt, lường trước phản đối — và khiến khách cảm thấy ý tưởng có phần của họ.</div>`,
  ]]);

const c5q = quiz('amm301-quiz-5', 'Quiz 5 — Presenting & persuading|||Quiz 5 — Trình bày & thuyết phục', [
  { id: 'q1', question: 'Nên mở đầu buổi present ý tưởng thế nào?', options: ['Phô ngay cái quảng cáo', 'Bán lại vấn đề & chiến lược trước, để ý tưởng thành câu trả lời tất yếu', 'Nói về ngân sách trước', 'Đọc hết mọi tính năng'], correctIndex: 1, explanation: 'Set-up lại vấn đề & insight trước khi reveal, để tác phẩm landing tự nhiên.' },
  { id: 'q2', question: 'Khách nói "làm logo to lên" — cách hiểu đúng thường là?', options: ['Phóng to logo đúng nghĩa đen ngay', 'Một mối lo thật: "tôi sợ nó không được chú ý" — giải mối lo đó', 'Từ chối cả dự án', 'Đòi giảm giá'], correctIndex: 1, explanation: 'Tách vấn đề khỏi đơn thuốc: giải nỗi lo phía sau, không phải câu chữ.' },
  { id: 'q3', question: 'Khi bị phản hồi gay gắt trong phòng họp, AM nên?', options: ['Cãi tay đôi ngay lúc đó', 'Nghe trọn, ghi note, quay lại với phản hồi cân nhắc', 'Bỏ ý tưởng ngay lập tức', 'Đổ lỗi cho creative'], correctIndex: 1, explanation: 'Không tranh cãi lúc cảm xúc cao; tiếp thu rồi phản hồi có suy xét.' },
]);

const c6 = doc('amm301-6-1-finance', '6.1 — Finance & commercials|||6.1 — Tài chính & thương mại',
  'Scope of work (SOW); mô hình phí (fee, retainer, project, commission); profitability (thời gian đội × rate); scope creep; thương lượng (negotiation) win-win; đọc P&L của một tài khoản.',
  [[
    `<span class="eyebrow">AMM301 · Chapter 6 · Lesson 6.1</span>
<h2>Finance &amp; commercials</h2>
<h3>Scope of work (SOW)</h3>
<p>The <strong>SOW</strong> defines exactly what the agency will deliver, for how much, in what time. It is your single best defence against disputes: if it isn't in the SOW, it's a new conversation about money — not free extra work.</p>
<h3>How agencies get paid</h3>
<ul>
<li><strong>Retainer</strong> — a fixed monthly fee for ongoing work.</li>
<li><strong>Project fee</strong> — a price for a defined piece of work.</li>
<li><strong>Time &amp; materials</strong> — hours × rate + costs.</li>
<li><strong>Commission</strong> — a % of media spend (the traditional model).</li>
</ul>
<h3>Profitability &amp; scope creep</h3>
<p>An account is profitable when the fee exceeds the <strong>cost of the team's time</strong> plus expenses. The silent killer is <strong>scope creep</strong> — small "can you just…" requests that add up to unpaid work and destroy the margin. The AM protects profitability by logging every out-of-scope request and converting it into a change order.</p>
<pre><code>Fee charged          : $50,000
Team time (cost)     : $32,000
Third-party costs    : $ 8,000
--------------------------------
Gross profit         : $10,000  (20% margin)
Uncontrolled scope creep quietly turns this positive number negative.</code></pre>
<h3>Negotiation</h3>
<p>Aim for <strong>value, not just price</strong>. Trade concessions (faster timeline for a bigger budget; smaller fee for a longer contract). The goal is a deal both sides want to renew — win-win keeps clients; win-lose loses them at renewal.</p>
<div class="callout"><span class="badge">Real example</span> A client asks for "just two more versions" of a video, repeatedly, across a month. Individually trivial; together they're 30 unpaid hours. The AM who tracked them and raised a change order kept the account profitable; the one who didn't explains a loss to the finance director.</div>`,
    `<span class="eyebrow">AMM301 · Chương 6 · Bài 6.1</span>
<h2>Tài chính &amp; thương mại</h2>
<h3>Scope of work (SOW)</h3>
<p><strong>SOW</strong> định nghĩa chính xác agency sẽ bàn giao gì, với giá bao nhiêu, trong bao lâu. Đây là lá chắn tốt nhất chống tranh chấp: nếu không có trong SOW thì đó là một cuộc trao đổi mới về tiền — không phải việc phụ làm miễn phí.</p>
<h3>Agency được trả tiền thế nào</h3>
<ul>
<li><strong>Retainer</strong> — phí cố định hằng tháng cho công việc liên tục.</li>
<li><strong>Phí dự án</strong> — một giá cho một hạng mục việc xác định.</li>
<li><strong>Thời gian &amp; vật liệu</strong> — số giờ × đơn giá + chi phí.</li>
<li><strong>Hoa hồng (commission)</strong> — % trên chi phí media (mô hình truyền thống).</li>
</ul>
<h3>Lợi nhuận &amp; scope creep</h3>
<p>Một tài khoản có lãi khi phí thu vượt <strong>chi phí thời gian của đội</strong> cộng chi phí khác. Kẻ giết người thầm lặng là <strong>scope creep</strong> — những yêu cầu "làm giúp thêm chút…" nhỏ lẻ dồn lại thành việc không công và phá lợi nhuận. AM bảo vệ lợi nhuận bằng cách ghi nhật ký mọi yêu cầu ngoài scope và biến nó thành change order.</p>
<pre><code>Phí thu             : 50.000$
Thời gian đội (chi) : 32.000$
Chi phí bên thứ ba  :  8.000$
--------------------------------
Lãi gộp             : 10.000$  (biên 20%)
Scope creep không kiểm soát âm thầm biến số dương này thành âm.</code></pre>
<h3>Thương lượng</h3>
<p>Nhắm tới <strong>giá trị, không chỉ giá</strong>. Đổi nhượng bộ (tiến độ nhanh hơn đổi ngân sách lớn hơn; phí thấp hơn đổi hợp đồng dài hơn). Mục tiêu là một thoả thuận cả hai bên muốn gia hạn — win-win giữ khách; win-lose mất khách lúc tái ký.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Khách xin "chỉ thêm hai phiên bản nữa" của video, lặp lại suốt một tháng. Từng cái tưởng cỏn con; gộp lại là 30 giờ không công. AM có ghi nhận và lập change order giữ tài khoản có lãi; người không ghi thì phải giải trình khoản lỗ với giám đốc tài chính.</div>`,
  ]]);

const c6q = quiz('amm301-quiz-6', 'Quiz 6 — Finance & commercials|||Quiz 6 — Tài chính & thương mại', [
  { id: 'q1', question: 'Scope of work (SOW) dùng để làm gì?', options: ['Trang trí hợp đồng', 'Định nghĩa chính xác giao gì, giá bao nhiêu, trong bao lâu — chống tranh chấp', 'Danh sách nhân sự agency', 'Bảng lương'], correctIndex: 1, explanation: 'SOW là ranh giới rõ ràng: ngoài SOW = trao đổi mới về tiền, không phải việc miễn phí.' },
  { id: 'q2', question: '"Scope creep" là gì và vì sao nguy hiểm?', options: ['Khách trả chậm', 'Các yêu cầu nhỏ ngoài scope dồn lại thành việc không công, phá lợi nhuận', 'Giá media tăng', 'Đội nghỉ việc'], correctIndex: 1, explanation: 'Từng cái nhỏ nhưng cộng dồn ăn hết margin nếu không lập change order.' },
  { id: 'q3', question: 'Mục tiêu của thương lượng thương mại tốt là?', options: ['Ép giá thấp nhất bằng mọi cách (win-lose)', 'Thoả thuận win-win mà cả hai muốn gia hạn', 'Không nhượng bộ gì', 'Chỉ quan tâm phí, bỏ qua giá trị'], correctIndex: 1, explanation: 'Đổi giá trị theo giá trị; win-win giữ khách ở lần tái ký.' },
]);

const c7 = doc('amm301-7-1-growth', '7.1 — Account growth & retention|||7.1 — Phát triển & giữ chân tài khoản',
  'Land & expand; upsell (dịch vụ cao hơn) & cross-sell (dịch vụ khác); account plan hằng năm; đo sức khoẻ quan hệ; vì sao giữ chân > giành mới; dấu hiệu cảnh báo khách sắp rời.',
  [[
    `<span class="eyebrow">AMM301 · Chapter 7 · Lesson 7.1</span>
<h2>Account growth &amp; retention</h2>
<h3>Land and expand</h3>
<p>Winning a client is expensive; growing an existing one is where agencies actually make money. The AM's job doesn't end at delivery — it turns one project into an ongoing relationship and one service into many.</p>
<ul>
<li><strong>Upsell</strong> — more or higher-value work in the same area (a one-off film → a full content programme).</li>
<li><strong>Cross-sell</strong> — a different service (the client uses you for social; you win their brand strategy too).</li>
</ul>
<h3>The annual account plan</h3>
<p>Great AMs write a plan <em>for the client's business</em>: their goals for the year, where the agency can help, which new services to introduce and when. It turns you from an order-taker into a strategic partner with a point of view on their growth.</p>
<h3>Why retention beats acquisition</h3>
<p>Keeping a client is far cheaper than winning a new one, and a loyal client refers others. Retention comes from consistent value, trust, and results — plus catching problems early.</p>
<h3>Early warning signs</h3>
<pre><code>- Client goes quiet / stops sharing plans
- More people cc'd on emails (they're building a case)
- Briefs get smaller, approvals get slower
- They start asking about your rates / other agencies
</code></pre>
<div class="callout"><span class="badge">Real example</span> A client who used the agency only for print noticed their social was weak. The AM had already prepared a short social proposal for the quarterly review — cross-selling a new service and doubling the account value, because she was planning the client's year, not just this month's job.</div>`,
    `<span class="eyebrow">AMM301 · Chương 7 · Bài 7.1</span>
<h2>Phát triển &amp; giữ chân tài khoản</h2>
<h3>Land and expand</h3>
<p>Giành một khách rất tốn kém; nuôi lớn một khách sẵn có mới là chỗ agency thật sự kiếm tiền. Việc của AM không dừng ở lúc bàn giao — nó biến một dự án thành quan hệ lâu dài và một dịch vụ thành nhiều dịch vụ.</p>
<ul>
<li><strong>Upsell</strong> — việc nhiều hơn hoặc giá trị cao hơn cùng mảng (một phim lẻ → cả chương trình nội dung).</li>
<li><strong>Cross-sell</strong> — một dịch vụ khác (khách dùng bạn cho social; bạn giành thêm cả chiến lược thương hiệu).</li>
</ul>
<h3>Kế hoạch tài khoản hằng năm</h3>
<p>AM giỏi viết một kế hoạch <em>cho công việc kinh doanh của khách</em>: mục tiêu năm của họ, chỗ agency có thể giúp, dịch vụ mới nào giới thiệu và khi nào. Nó biến bạn từ người nhận đơn thành đối tác chiến lược có quan điểm về sự tăng trưởng của họ.</p>
<h3>Vì sao giữ chân thắng giành mới</h3>
<p>Giữ một khách rẻ hơn nhiều so với giành khách mới, và một khách trung thành sẽ giới thiệu người khác. Giữ chân đến từ giá trị đều đặn, niềm tin và kết quả — cộng với việc bắt vấn đề sớm.</p>
<h3>Dấu hiệu cảnh báo sớm</h3>
<pre><code>- Khách im lặng / ngừng chia sẻ kế hoạch
- Nhiều người bị cc trong email hơn (họ đang dựng hồ sơ)
- Brief nhỏ dần, phê duyệt chậm hơn
- Họ bắt đầu hỏi về đơn giá / các agency khác
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> Một khách chỉ dùng agency cho mảng in ấn nhận ra social của họ yếu. AM đã chuẩn bị sẵn một đề xuất social ngắn cho buổi review quý — cross-sell một dịch vụ mới và tăng gấp đôi giá trị tài khoản, bởi cô đang lập kế hoạch cho cả năm của khách, không chỉ việc của tháng này.</div>`,
  ]]);

const c7q = quiz('amm301-quiz-7', 'Quiz 7 — Growth & retention|||Quiz 7 — Phát triển & giữ chân', [
  { id: 'q1', question: 'Upsell khác cross-sell thế nào?', options: ['Giống nhau', 'Upsell = việc nhiều/cao hơn cùng mảng; cross-sell = một dịch vụ khác', 'Upsell = giảm giá; cross-sell = tăng giá', 'Cả hai đều là giành khách mới'], correctIndex: 1, explanation: 'Upsell mở rộng trong cùng dịch vụ; cross-sell bán thêm dịch vụ khác.' },
  { id: 'q2', question: 'Vì sao giữ chân (retention) quan trọng hơn giành khách mới?', options: ['Giữ chân tốn kém hơn', 'Giữ chân rẻ hơn nhiều, khách trung thành còn giới thiệu người khác', 'Khách mới luôn trả nhiều hơn', 'Không có khác biệt'], correctIndex: 1, explanation: 'Chi phí giữ < chi phí giành, và khách hài lòng mang lại referral.' },
  { id: 'q3', question: 'Đâu là dấu hiệu cảnh báo khách sắp rời?', options: ['Khách chia sẻ nhiều kế hoạch hơn', 'Brief nhỏ dần, phê duyệt chậm, bắt đầu hỏi về agency khác', 'Tăng ngân sách', 'Mời agency đi ăn mừng'], correctIndex: 1, explanation: 'Khách im lặng, cc thêm người, hỏi rate/agency khác là red flag.' },
]);

const c8 = doc('amm301-8-1-conflict-ethics', '8.1 — Conflict resolution & professional ethics|||8.1 — Xử lý xung đột & đạo đức nghề',
  'Xử lý xung đột (nội bộ agency & với khách); quản lý khủng hoảng tài khoản; xung đột lợi ích (client cạnh tranh); trung thực trong báo cáo; đạo đức quảng cáo (không phóng đại, dữ liệu thật); professionalism.',
  [[
    `<span class="eyebrow">AMM301 · Chapter 8 · Lesson 8.1</span>
<h2>Conflict resolution &amp; professional ethics</h2>
<h3>Handling conflict</h3>
<p>Conflict is normal — between agency and client, and inside the agency (account vs creative over a deadline). Handle it by <strong>separating people from the problem</strong>, focusing on interests not positions, and finding an option that serves the shared goal: good work, on time, that keeps the account.</p>
<h3>Managing an account crisis</h3>
<pre><code>1. Own it fast     -> acknowledge, don't hide or blame
2. Contain it      -> stop the damage, gather the facts
3. Communicate     -> tell the client before they find out
4. Fix &amp; follow up -> a plan, a timeline, and a review so it can't recur
</code></pre>
<p>A crisis handled with honesty and speed can actually deepen trust; one handled with spin destroys it.</p>
<h3>Ethics of the job</h3>
<ul>
<li><strong>Conflict of interest</strong> — an agency generally cannot serve two directly competing clients; declare and manage any overlap.</li>
<li><strong>Honesty in reporting</strong> — never inflate results or hide bad numbers; report the real performance.</li>
<li><strong>Truth in advertising</strong> — don't claim what the product can't do; unsupported claims are both unethical and often illegal.</li>
<li><strong>Confidentiality</strong> — client data and plans stay inside the agency.</li>
</ul>
<div class="callout"><span class="badge">Professionalism</span> The AM is the agency's reputation in the client's eyes. Reliability, honesty and grace under pressure — especially when delivering bad news — are what turn a job into a career and a client into an advocate.</div>`,
    `<span class="eyebrow">AMM301 · Chương 8 · Bài 8.1</span>
<h2>Xử lý xung đột &amp; đạo đức nghề</h2>
<h3>Xử lý xung đột</h3>
<p>Xung đột là bình thường — giữa agency và khách, và trong nội bộ agency (account vs creative về một deadline). Xử bằng cách <strong>tách con người khỏi vấn đề</strong>, tập trung vào lợi ích chứ không phải lập trường, và tìm một phương án phục vụ mục tiêu chung: tác phẩm tốt, đúng hạn, giữ được tài khoản.</p>
<h3>Quản lý một khủng hoảng tài khoản</h3>
<pre><code>1. Nhận trách nhiệm nhanh -> thừa nhận, không giấu hay đổ lỗi
2. Khoanh vùng           -> chặn thiệt hại, thu thập sự thật
3. Truyền đạt            -> báo khách trước khi họ tự phát hiện
4. Khắc phục &amp; theo dõi  -> kế hoạch, mốc thời gian, rà soát để không tái diễn
</code></pre>
<p>Một khủng hoảng xử bằng trung thực và tốc độ thực ra có thể làm sâu thêm niềm tin; xử bằng lấp liếm thì phá tan nó.</p>
<h3>Đạo đức của nghề</h3>
<ul>
<li><strong>Xung đột lợi ích</strong> — agency thường không thể phục vụ hai khách cạnh tranh trực tiếp; khai báo và quản lý mọi chồng lấn.</li>
<li><strong>Trung thực trong báo cáo</strong> — đừng bao giờ thổi phồng kết quả hay giấu số xấu; báo cáo hiệu quả thật.</li>
<li><strong>Sự thật trong quảng cáo</strong> — đừng nói sản phẩm làm được điều nó không làm được; tuyên bố không có căn cứ vừa phi đạo đức vừa thường phạm luật.</li>
<li><strong>Bảo mật</strong> — dữ liệu và kế hoạch của khách nằm trong agency.</li>
</ul>
<div class="callout"><span class="badge">Chuyên nghiệp</span> AM chính là uy tín của agency trong mắt khách. Sự tin cậy, trung thực và điềm tĩnh dưới áp lực — nhất là khi báo tin xấu — là thứ biến một công việc thành sự nghiệp và một khách hàng thành người ủng hộ.</div>`,
  ]]);

const c8q = quiz('amm301-quiz-8', 'Quiz 8 — Conflict & ethics|||Quiz 8 — Xung đột & đạo đức', [
  { id: 'q1', question: 'Cách xử lý xung đột hiệu quả là?', options: ['Đổ lỗi cho người gây ra', 'Tách con người khỏi vấn đề, tập trung vào lợi ích chung', 'Phớt lờ cho qua', 'Luôn nhường khách mọi thứ'], correctIndex: 1, explanation: 'Separate people from problem, tập trung interests không phải positions.' },
  { id: 'q2', question: 'Khi có khủng hoảng tài khoản, bước đầu nên là?', options: ['Giấu để khách không biết', 'Nhận trách nhiệm nhanh, chặn thiệt hại, báo khách trước khi họ tự phát hiện', 'Đổ lỗi cho bên thứ ba', 'Chờ khách phàn nàn rồi mới xử'], correctIndex: 1, explanation: 'Own it fast + contain + communicate sớm mới giữ được niềm tin.' },
  { id: 'q3', question: 'Vì sao agency thường không phục vụ hai khách cạnh tranh trực tiếp?', options: ['Vì bận', 'Vì xung đột lợi ích — phải khai báo & quản lý', 'Vì luật cấm mọi khách', 'Vì giá cao'], correctIndex: 1, explanation: 'Conflict of interest: dữ liệu & chiến lược của bên này không thể phục vụ đối thủ.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'AMM301',
    slug: 'amm301-account-management',
    title: 'Account management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/AMM301.webp',
    shortDescription: 'Agency account management — the bridge between client & agency: the role, client trust, the creative brief, project & budget management, presenting work, commercials & scope, account growth, conflict & ethics. Bilingual, real examples & quizzes.|||Quản trị khách hàng agency — cầu nối giữa khách & agency: vai trò AM, niềm tin, creative brief, quản dự án & ngân sách, trình bày, thương mại & scope, phát triển tài khoản, xung đột & đạo đức. Song ngữ, ví dụ thật & quiz.',
    description: 'Môn <strong>AMM301 — Account Management</strong> (Quản trị khách hàng, ngành Truyền thông, kỳ 7) dạy nghề <strong>account management</strong> trong agency quảng cáo — cầu nối giữa khách hàng và agency. Từ <strong>vai trò AM &amp; cấu trúc agency</strong> → <strong>quan hệ &amp; niềm tin</strong> → <strong>client brief &amp; creative brief</strong> → <strong>quản lý dự án, timeline &amp; ngân sách</strong> → <strong>trình bày &amp; thuyết phục</strong> → <strong>tài chính, scope &amp; thương lượng</strong> → <strong>phát triển &amp; giữ chân tài khoản</strong> → <strong>xung đột &amp; đạo đức nghề</strong>. Bám bộ kiến thức chuẩn ngành (IPA/4A\'s, APG, Jon Steel, HBR), song ngữ, có ví dụ thật và quiz mỗi chương.',
    whatYouLearn: 'Vai trò AM & cấu trúc agency (account/planning/creative/media); xây niềm tin & quản kỳ vọng; chất vấn client brief & viết creative brief (single-minded proposition); quản dự án, critical path, traffic & ngân sách; bán ý tưởng & xử lý phản hồi; SOW, mô hình phí, profitability & scope creep, thương lượng win-win; upsell/cross-sell, account plan & giữ chân; xử lý xung đột, khủng hoảng & đạo đức nghề (xung đột lợi ích, trung thực).',
    requirements: 'Không cần kiến thức chuyên môn trước. Nên có nền tảng marketing/truyền thông cơ bản và tiếng Anh đọc hiểu để dùng tài liệu ngành (IPA, AdAge, Campaign).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách ngành, hiệp hội (IPA/4A\'s/APG), báo chuyên ngành, HBR, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Account management là gì, AM là cầu nối, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Vai trò & agency|||Chapter 1 — Role & agency', description: 'AM làm gì, cấu trúc agency, AM vs planner vs creative.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quan hệ & niềm tin|||Chapter 2 — Relationship & trust', description: 'Xây niềm tin, quản kỳ vọng, chủ động, đối tác vs nhà cung cấp.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Brief & creative brief|||Chapter 3 — The brief', description: 'Nhận & chất vấn brief, viết creative brief, single-minded proposition.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Dự án & quy trình|||Chapter 4 — Project & process', description: 'Workflow, timeline, critical path, traffic, ngân sách.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Trình bày & thuyết phục|||Chapter 5 — Presenting', description: 'Bán ý tưởng, cấu trúc present, xử lý phản hồi & rejection.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Tài chính & thương mại|||Chapter 6 — Finance & commercials', description: 'SOW, mô hình phí, profitability, scope creep, thương lượng.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Phát triển tài khoản|||Chapter 7 — Account growth', description: 'Upsell/cross-sell, account plan, giữ chân, dấu hiệu cảnh báo.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Xung đột & đạo đức|||Chapter 8 — Conflict & ethics', description: 'Xử lý xung đột, khủng hoảng, xung đột lợi ích, đạo đức nghề.', lessons: [c8, c8q] },
  ],
};
