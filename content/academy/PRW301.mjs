/**
 * PRW301 — Professional Public Relations Writing (Viết chuyên nghiệp trong
 * Quan hệ công chúng). Khối Công nghệ Truyền thông FPTU, Kỳ 4. Khung chất lượng
 * theo giáo trình chuẩn quốc tế: Treadwell "PR Writing: Principles in Practice",
 * Newsom & Haynes "PR Writing: Form & Style", AP Stylebook, PRSA, Purdue OWL.
 * 8 chương: nguyên tắc → nghiên cứu → thông cáo báo chí → media kit & pitch →
 * viết cho lãnh đạo → nội dung số & MXH → khủng hoảng & nội bộ → biên tập.
 * Song ngữ + mẫu/khuôn viết + ví dụ thật. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick/${ trong HTML; "&"→"&amp;" trong content; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('prw301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Treadwell, Newsom & Haynes), AP Stylebook, PRSA, Purdue OWL, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">PRW301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to write like a PR professional — principles, research, press releases, media kits, executive writing, digital content, crisis and internal communication, and editing — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, credible references.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for PRW301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Treadwell &amp; Treadwell — <em>Public Relations Writing: Principles in Practice</em></li>
<li>Newsom &amp; Haynes — <em>Public Relations Writing: Form &amp; Style</em></li>
<li>Zappala &amp; Carden — <em>Public Relations Writing Worktext</em></li>
<li><a href="https://www.apstylebook.com/" target="_blank" rel="noopener">The Associated Press Stylebook (AP Style)</a> — the newsroom standard PR writers follow</li>
</ul>
<h3>🌐 Official / free resources</h3>
<ul>
<li><a href="https://www.prsa.org/" target="_blank" rel="noopener">PRSA — Public Relations Society of America</a> (ethics code, resources)</li>
<li><a href="https://owl.purdue.edu/" target="_blank" rel="noopener">Purdue OWL</a> — AP style, grammar &amp; professional writing guides</li>
<li><a href="https://www.prnewswire.com/" target="_blank" rel="noopener">PR Newswire</a> — real press releases to model</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=public+relations+writing" target="_blank" rel="noopener">"Public relations writing" tutorials</a></li>
<li><a href="https://www.youtube.com/results?search_query=how+to+write+a+press+release" target="_blank" rel="noopener">"How to write a press release" walkthroughs</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://hemingwayapp.com/" target="_blank" rel="noopener">Hemingway Editor</a> — flags long, dense, passive sentences</li>
<li><a href="https://www.grammarly.com/" target="_blank" rel="noopener">Grammarly</a> — grammar &amp; clarity checks</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — principles of PR writing (audience, purpose, clarity, ethics) and message research.</li>
<li><strong>Core formats</strong> — press release, fact sheet, backgrounder, pitch, in AP style.</li>
<li><strong>Go wider</strong> — executive speeches, web &amp; social copy, crisis and internal comms.</li>
<li><strong>Job-ready</strong> — edit ruthlessly, verify facts, and build a portfolio of clips.</li>
</ol></div>`,
    `<span class="eyebrow">PRW301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để viết như một người làm PR chuyên nghiệp — nguyên tắc, nghiên cứu, thông cáo báo chí, bộ tài liệu báo chí, viết cho lãnh đạo, nội dung số, truyền thông khủng hoảng và nội bộ, biên tập — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn tham khảo uy tín, miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của PRW301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Treadwell &amp; Treadwell — <em>Public Relations Writing: Principles in Practice</em></li>
<li>Newsom &amp; Haynes — <em>Public Relations Writing: Form &amp; Style</em></li>
<li>Zappala &amp; Carden — <em>Public Relations Writing Worktext</em></li>
<li><a href="https://www.apstylebook.com/" target="_blank" rel="noopener">The Associated Press Stylebook (AP Style)</a> — chuẩn phòng tin mà người làm PR bám theo</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.prsa.org/" target="_blank" rel="noopener">PRSA — Hội Quan hệ công chúng Hoa Kỳ</a> (bộ quy tắc đạo đức, tài nguyên)</li>
<li><a href="https://owl.purdue.edu/" target="_blank" rel="noopener">Purdue OWL</a> — hướng dẫn AP style, ngữ pháp &amp; viết chuyên nghiệp</li>
<li><a href="https://www.prnewswire.com/" target="_blank" rel="noopener">PR Newswire</a> — thông cáo báo chí thật để học theo</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=public+relations+writing" target="_blank" rel="noopener">Hướng dẫn "public relations writing"</a></li>
<li><a href="https://www.youtube.com/results?search_query=how+to+write+a+press+release" target="_blank" rel="noopener">Hướng dẫn "how to write a press release"</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://hemingwayapp.com/" target="_blank" rel="noopener">Hemingway Editor</a> — soi câu dài, rối, bị động</li>
<li><a href="https://www.grammarly.com/" target="_blank" rel="noopener">Grammarly</a> — kiểm ngữ pháp &amp; độ rõ</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — nguyên tắc viết PR (đối tượng, mục đích, rõ ràng, đạo đức) và nghiên cứu thông điệp.</li>
<li><strong>Định dạng lõi</strong> — thông cáo báo chí, fact sheet, backgrounder, pitch, theo AP style.</li>
<li><strong>Mở rộng</strong> — bài phát biểu lãnh đạo, nội dung web &amp; mạng xã hội, khủng hoảng và nội bộ.</li>
<li><strong>Sẵn sàng đi làm</strong> — biên tập không nương tay, kiểm chứng dữ kiện, dựng hồ sơ bài đã đăng.</li>
</ol></div>`,
  ]]);

const intro = doc('prw301-0-1-overview', 'Course overview: Professional PR Writing|||Tổng quan: Viết chuyên nghiệp trong PR',
  'PR writing làm gì; khác báo chí & quảng cáo; lộ trình: nguyên tắc → nghiên cứu → thông cáo → media kit & pitch → viết cho lãnh đạo → nội dung số → khủng hoảng & nội bộ → biên tập.',
  [[
    `<span class="eyebrow">PRW301 · Lesson 0.1 · Overview</span>
<h2>Professional Public Relations Writing</h2>
<p class="lead">This course teaches you to <strong>write for organizations that want to be understood, trusted and talked about</strong> — press releases journalists will actually run, pitches editors open, executive speeches, web and social copy, crisis statements and internal memos. You write in <strong>AP style</strong>, for a defined audience, with a clear purpose, honestly.</p>
<h3>PR writing vs. journalism vs. advertising</h3>
<ul>
<li><strong>Journalism</strong> serves the public; the reporter is independent of the subject.</li>
<li><strong>Advertising</strong> is paid, controlled space that openly sells.</li>
<li><strong>PR writing</strong> earns attention: you write material a third party (a journalist, a follower) chooses to carry, so it must be newsworthy and true, not a sales pitch in disguise.</li>
</ul>
<h3>Roadmap</h3>
<p>Principles (audience, purpose, clarity, ethics) → research &amp; message prep → the press release → media kit &amp; pitch → executive &amp; organizational writing → digital &amp; social content → crisis &amp; internal comms → editing &amp; publication-ready quality. Bilingual, with templates and real examples.</p>
<div class="callout"><span class="badge">One rule above all</span> If it is not <strong>accurate</strong>, nothing else you do as a PR writer matters — a single wrong fact costs the credibility that is your only real asset.</div>`,
    `<span class="eyebrow">PRW301 · Bài 0.1 · Tổng quan</span>
<h2>Viết chuyên nghiệp trong Quan hệ công chúng</h2>
<p class="lead">Môn này dạy bạn <strong>viết cho tổ chức muốn được hiểu, được tin và được nhắc tới</strong> — thông cáo báo chí mà nhà báo chịu đăng, pitch mà biên tập viên chịu mở, bài phát biểu lãnh đạo, nội dung web và mạng xã hội, tuyên bố khủng hoảng và thông báo nội bộ. Bạn viết theo <strong>AP style</strong>, cho một đối tượng xác định, với mục đích rõ, và trung thực.</p>
<h3>Viết PR khác báo chí &amp; quảng cáo</h3>
<ul>
<li><strong>Báo chí</strong> phục vụ công chúng; nhà báo độc lập với đối tượng đưa tin.</li>
<li><strong>Quảng cáo</strong> là không gian trả tiền, kiểm soát được, công khai bán hàng.</li>
<li><strong>Viết PR</strong> giành sự chú ý: bạn viết thứ mà một bên thứ ba (nhà báo, người theo dõi) tự chọn để lan tỏa, nên nó phải có tính tin tức và đúng sự thật, không phải quảng cáo trá hình.</li>
</ul>
<h3>Lộ trình</h3>
<p>Nguyên tắc (đối tượng, mục đích, rõ ràng, đạo đức) → nghiên cứu &amp; chuẩn bị thông điệp → thông cáo báo chí → media kit &amp; pitch → viết cho lãnh đạo &amp; tổ chức → nội dung số &amp; mạng xã hội → khủng hoảng &amp; nội bộ → biên tập &amp; chuẩn xuất bản. Song ngữ, có khuôn mẫu và ví dụ thật.</p>
<div class="callout"><span class="badge">Một quy tắc trên hết</span> Nếu không <strong>chính xác</strong>, mọi thứ khác bạn làm với tư cách người viết PR đều vô nghĩa — một dữ kiện sai làm mất đi uy tín, thứ tài sản thật duy nhất của bạn.</div>`,
  ]]);

const c1 = doc('prw301-1-1-principles', '1.1 — What PR writing is & its principles|||1.1 — Viết PR là gì & nguyên tắc',
  'Đối tượng, mục đích; phong cách rõ-ngắn-đúng (clear, concise, correct); văn phong tổ chức; đạo đức PRSA (trung thực, minh bạch, không bịa).',
  [[
    `<span class="eyebrow">PRW301 · Chapter 1 · Lesson 1.1</span>
<h2>What PR writing is &amp; its principles</h2>
<h3>Start with audience and purpose</h3>
<p>Before writing a word, answer two questions: <strong>Who am I writing to?</strong> (a journalist, an employee, a customer, an investor — each reads differently) and <strong>What do I want them to know, feel or do?</strong> Every choice of word, length and channel follows from those two answers.</p>
<h3>The style: clear, concise, correct</h3>
<ul>
<li><strong>Clear</strong> — short sentences, plain words, one idea per sentence; write for a busy reader who skims.</li>
<li><strong>Concise</strong> — cut every word that does no work. Prefer verbs over noun phrases ("decided", not "made a decision").</li>
<li><strong>Correct</strong> — facts, names, titles, numbers and grammar exact; use active voice and AP style.</li>
</ul>
<pre>Weak:  "It was decided by the company that a reduction in prices would be implemented."
Strong: "The company cut prices 10%."</pre>
<h3>Ethics — the PR writer's floor</h3>
<p>The <strong>PRSA Code of Ethics</strong> requires honesty, accuracy, transparency and disclosure. You may advocate for your organization, but you may <em>not</em> lie, invent quotes or hide who is paying for the message. Credibility is a one-way door: easy to lose, hard to earn back.</p>
<div class="callout"><span class="badge">Advocacy, not deception</span> PR writing is persuasive by design — but it persuades with true, verifiable, well-framed facts, never with fabrication.</div>`,
    `<span class="eyebrow">PRW301 · Chương 1 · Bài 1.1</span>
<h2>Viết PR là gì &amp; nguyên tắc</h2>
<h3>Bắt đầu từ đối tượng và mục đích</h3>
<p>Trước khi viết chữ nào, hãy trả lời hai câu: <strong>Mình viết cho ai?</strong> (nhà báo, nhân viên, khách hàng, nhà đầu tư — mỗi người đọc mỗi khác) và <strong>Mình muốn họ biết, cảm nhận hay làm gì?</strong> Mọi lựa chọn về từ ngữ, độ dài và kênh đều bắt nguồn từ hai câu trả lời đó.</p>
<h3>Phong cách: rõ, ngắn, đúng</h3>
<ul>
<li><strong>Rõ (clear)</strong> — câu ngắn, từ giản dị, mỗi câu một ý; viết cho người bận đọc lướt.</li>
<li><strong>Ngắn (concise)</strong> — cắt mọi từ không làm việc. Ưu tiên động từ hơn cụm danh từ ("quyết định", không "đưa ra quyết định").</li>
<li><strong>Đúng (correct)</strong> — dữ kiện, tên, chức danh, con số và ngữ pháp chính xác; dùng thể chủ động và AP style.</li>
</ul>
<pre>Yếu:  "Việc giảm giá đã được công ty đưa ra quyết định thực hiện."
Mạnh: "Công ty giảm giá 10%."</pre>
<h3>Đạo đức — sàn của người viết PR</h3>
<p><strong>Bộ quy tắc đạo đức PRSA</strong> đòi hỏi trung thực, chính xác, minh bạch và công khai. Bạn được phép bênh vực tổ chức của mình, nhưng <em>không</em> được nói dối, bịa lời trích dẫn hay giấu ai đang chi tiền cho thông điệp. Uy tín là cánh cửa một chiều: mất thì dễ, lấy lại thì khó.</p>
<div class="callout"><span class="badge">Bênh vực, không lừa dối</span> Viết PR vốn có tính thuyết phục — nhưng thuyết phục bằng dữ kiện thật, kiểm chứng được, được đóng khung khéo, chứ không bao giờ bằng bịa đặt.</div>`,
  ]]);

const c1q = quiz('prw301-quiz-1', 'Quiz 1 — Principles|||Quiz 1 — Nguyên tắc', [
  { id: 'q1', question: 'Hai câu phải trả lời TRƯỚC khi viết PR là?|||The two questions to answer BEFORE writing PR content are?', options: ['Dài bao nhiêu & màu gì|||Length & color', 'Viết cho AI & muốn họ làm GÌ|||WHO is the audience & what do I want them to do', 'Đăng lúc nào & giá bao nhiêu|||When to post & the price', 'Font nào & ảnh nào|||Which font & which image'], correctIndex: 1, explanation: 'Đối tượng (ai) + mục đích (muốn gì) định hình mọi lựa chọn còn lại.' },
  { id: 'q2', question: 'Bộ ba phong cách của viết PR là?|||The PR writing style triad is?', options: ['Dài, hoa mỹ, trang trọng|||Long, ornate, formal', 'Rõ, ngắn, đúng (clear, concise, correct)|||Clear, concise, correct', 'Vui, giật gân, cảm xúc|||Fun, sensational, emotional', 'Bị động, kỹ thuật, vòng vo|||Passive, technical, roundabout'], correctIndex: 1, explanation: 'Rõ - ngắn - đúng: câu ngắn, cắt từ thừa, dữ kiện và ngữ pháp chính xác.' },
  { id: 'q3', question: 'Bộ quy tắc đạo đức PRSA cho phép người viết PR?|||The PRSA Code of Ethics lets a PR writer?', options: ['Bịa lời trích dẫn nếu nghe hay|||Invent quotes if they sound good', 'Bênh vực tổ chức bằng dữ kiện thật, không nói dối|||Advocate with true facts, never lie', 'Giấu ai trả tiền cho thông điệp|||Hide who paid for the message', 'Phóng đại số liệu để gây chú ý|||Exaggerate numbers for attention'], correctIndex: 1, explanation: 'PR được bênh vực nhưng phải trung thực, minh bạch, công khai — không bịa, không giấu nguồn tài trợ.' },
]);

const c2 = doc('prw301-2-1-research', '2.1 — Research & message preparation|||2.1 — Nghiên cứu & chuẩn bị viết',
  'Thu thập thông tin (nguồn sơ cấp/thứ cấp), phỏng vấn để lấy quote, kiểm chứng dữ kiện; xác định thông điệp cốt lõi (key message); khung 5W1H.',
  [[
    `<span class="eyebrow">PRW301 · Chapter 2 · Lesson 2.1</span>
<h2>Research &amp; message preparation</h2>
<h3>Gather before you write</h3>
<p>Good PR writing rests on facts you gathered, not adjectives you invented. Collect from <strong>primary sources</strong> (interviews, internal data, documents, direct observation) and <strong>secondary sources</strong> (reports, prior coverage, statistics) — then <strong>verify</strong> every name, title, date and number against a second source.</p>
<h3>Interviewing for quotes</h3>
<ul>
<li>Prepare open questions ("What changed for customers?") that invite a usable sentence, not a yes/no.</li>
<li>Capture the exact words; read a quote back to confirm accuracy and approval.</li>
<li>A strong quote adds a <em>human voice or opinion</em> the facts alone cannot — never use it to repeat a fact you already stated.</li>
</ul>
<h3>Find the core message, then frame it with 5W1H</h3>
<p>Distill everything to <strong>one core message</strong> — the single idea the reader must leave with. Then make sure the writing answers the reporter's checklist:</p>
<pre>Who   - who is involved / announcing
What  - what happened / is new
When  - date, time, timeline
Where - place, market, scope
Why   - why it matters to the reader
How   - how it works / how it was done</pre>
<div class="callout"><span class="badge">Message first</span> If you cannot state your core message in one plain sentence, you are not ready to write — you are still researching.</div>`,
    `<span class="eyebrow">PRW301 · Chương 2 · Bài 2.1</span>
<h2>Nghiên cứu &amp; chuẩn bị viết</h2>
<h3>Thu thập trước khi viết</h3>
<p>Viết PR tốt dựa trên dữ kiện bạn thu thập, không phải tính từ bạn bịa. Lấy từ <strong>nguồn sơ cấp</strong> (phỏng vấn, dữ liệu nội bộ, tài liệu, quan sát trực tiếp) và <strong>nguồn thứ cấp</strong> (báo cáo, bài đăng trước, số liệu thống kê) — rồi <strong>kiểm chứng</strong> mọi tên, chức danh, ngày và con số bằng một nguồn thứ hai.</p>
<h3>Phỏng vấn để lấy trích dẫn</h3>
<ul>
<li>Chuẩn bị câu hỏi mở ("Điều gì thay đổi với khách hàng?") để mời một câu dùng được, không phải có/không.</li>
<li>Ghi đúng nguyên văn; đọc lại lời trích cho người nói xác nhận độ chính xác và sự đồng ý.</li>
<li>Một trích dẫn mạnh thêm <em>giọng người hoặc quan điểm</em> mà dữ kiện đơn thuần không có — đừng dùng nó để lặp lại một dữ kiện đã nêu.</li>
</ul>
<h3>Tìm thông điệp cốt lõi, rồi đóng khung bằng 5W1H</h3>
<p>Chắt lọc mọi thứ về <strong>một thông điệp cốt lõi</strong> — ý duy nhất người đọc phải mang theo. Rồi bảo đảm bài viết trả lời được checklist của nhà báo:</p>
<pre>Who   - ai liên quan / ai công bố
What  - chuyện gì xảy ra / có gì mới
When  - ngày, giờ, mốc thời gian
Where - nơi chốn, thị trường, phạm vi
Why   - vì sao quan trọng với người đọc
How   - vận hành ra sao / làm thế nào</pre>
<div class="callout"><span class="badge">Thông điệp trước</span> Nếu chưa nói được thông điệp cốt lõi trong một câu giản dị, bạn chưa sẵn sàng viết — bạn vẫn đang nghiên cứu.</div>`,
  ]]);

const c2q = quiz('prw301-quiz-2', 'Quiz 2 — Research|||Quiz 2 — Nghiên cứu', [
  { id: 'q1', question: 'Nguồn nào là nguồn SƠ CẤP?|||Which is a PRIMARY source?', options: ['Bài báo đã đăng trước|||A prior published article', 'Phỏng vấn trực tiếp & dữ liệu nội bộ|||A direct interview & internal data', 'Báo cáo ngành của bên thứ ba|||A third-party industry report', 'Thống kê trên Wikipedia|||Wikipedia statistics'], correctIndex: 1, explanation: 'Sơ cấp = bạn tự thu (phỏng vấn, quan sát, dữ liệu gốc); thứ cấp = tổng hợp/đã công bố.' },
  { id: 'q2', question: 'Vai trò tốt nhất của một trích dẫn (quote) là?|||The best use of a quote is to?', options: ['Lặp lại dữ kiện đã nêu|||Repeat a fact already stated', 'Thêm giọng người / quan điểm mà dữ kiện không có|||Add a human voice / opinion facts cannot', 'Kéo dài bài cho đủ chữ|||Pad the length', 'Thay cho phần kiểm chứng|||Replace fact-checking'], correctIndex: 1, explanation: 'Quote mạnh mang quan điểm/cảm xúc con người, không lặp lại thông tin đã có.' },
  { id: 'q3', question: 'Khung 5W1H gồm?|||The 5W1H framework is?', options: ['Who, What, When, Where, Why, How', 'Who, Why, Wow, Win, Wait, How', 'What, Which, Whose, When, Where, How', 'Who, What, When, Where, Which, Help'], correctIndex: 0, explanation: 'Who/What/When/Where/Why/How — checklist bảo đảm tin đầy đủ dữ kiện.' },
]);

const c3 = doc('prw301-3-1-press-release', '3.1 — The press release|||3.1 — Thông cáo báo chí',
  'Cấu trúc kim tự tháp ngược; headline & dateline; lead trả lời 5W1H; thân bài & quote; boilerplate; thông tin liên hệ; theo AP style. Có mẫu thật.',
  [[
    `<span class="eyebrow">PRW301 · Chapter 3 · Lesson 3.1</span>
<h2>The press release</h2>
<h3>Inverted pyramid: most important first</h3>
<p>A press release is written in the <strong>inverted pyramid</strong> — the essential news in the first paragraph, supporting detail next, background last. A busy editor must get the whole story from the opening lines, and can cut from the bottom without losing the point.</p>
<h3>The parts</h3>
<ul>
<li><strong>Headline</strong> — a short, factual, active line stating the news.</li>
<li><strong>Dateline</strong> — CITY, Date — opens the first paragraph.</li>
<li><strong>Lead</strong> — the first sentence answers the key 5W1H.</li>
<li><strong>Body</strong> — detail, context, and a <strong>quote</strong> from a named spokesperson.</li>
<li><strong>Boilerplate</strong> — a standing "About [Organization]" paragraph.</li>
<li><strong>Contact</strong> — name, email, phone; and "###" to mark the end.</li>
</ul>
<pre>FOR IMMEDIATE RELEASE

CuongThai Launches Free AI Academy for FPT Students

HANOI, Sept. 13, 2026 — CuongThai today launched Academy, a free
bilingual learning platform covering 210 FPT University courses, giving
students AI-assisted lessons and quizzes at no cost.

"Students learn faster when the material speaks their language," said
Cuong Hoang, founder of CuongThai. "Academy meets them where they are."

The platform ... [supporting detail, context] ...

About CuongThai
CuongThai builds education technology for Vietnamese learners ...

Contact: press@cuongthai.com · +84 ...
###</pre>
<div class="callout"><span class="badge">If it is not news, do not send it</span> Editors bin releases that are really ads. Lead with what is genuinely new or useful to the reader, not with praise for your organization.</div>`,
    `<span class="eyebrow">PRW301 · Chương 3 · Bài 3.1</span>
<h2>Thông cáo báo chí</h2>
<h3>Kim tự tháp ngược: quan trọng nhất lên đầu</h3>
<p>Thông cáo viết theo <strong>kim tự tháp ngược</strong> — tin cốt lõi ở đoạn đầu, chi tiết bổ trợ tiếp theo, bối cảnh sau cùng. Biên tập viên bận phải nắm được cả câu chuyện chỉ từ những dòng mở, và có thể cắt từ dưới lên mà không mất ý chính.</p>
<h3>Các thành phần</h3>
<ul>
<li><strong>Headline (tít)</strong> — dòng ngắn, đúng sự thật, chủ động, nêu thẳng tin.</li>
<li><strong>Dateline</strong> — THÀNH PHỐ, Ngày — mở đầu đoạn thứ nhất.</li>
<li><strong>Lead (sa-pô)</strong> — câu đầu trả lời các 5W1H then chốt.</li>
<li><strong>Thân bài</strong> — chi tiết, bối cảnh và một <strong>trích dẫn</strong> từ người phát ngôn có tên.</li>
<li><strong>Boilerplate</strong> — đoạn "Về [Tổ chức]" cố định.</li>
<li><strong>Liên hệ</strong> — tên, email, điện thoại; và "###" đánh dấu kết thúc.</li>
</ul>
<pre>PHÁT HÀNH NGAY

CuongThai ra mắt Học viện AI miễn phí cho sinh viên FPT

HÀ NỘI, 13/9/2026 — CuongThai hôm nay ra mắt Academy, nền tảng học
song ngữ miễn phí phủ 210 môn của Đại học FPT, mang đến bài học và quiz
có AI hỗ trợ mà không tốn phí.

"Sinh viên học nhanh hơn khi tài liệu nói đúng ngôn ngữ của họ," ông
Hoàng Cường, nhà sáng lập CuongThai, nói. "Academy đến với các em ở
đúng nơi các em đang đứng."

Nền tảng ... [chi tiết bổ trợ, bối cảnh] ...

Về CuongThai
CuongThai xây dựng công nghệ giáo dục cho người học Việt ...

Liên hệ: press@cuongthai.com · +84 ...
###</pre>
<div class="callout"><span class="badge">Không phải tin thì đừng gửi</span> Biên tập viên vứt các thông cáo thực chất là quảng cáo. Hãy mở bài bằng điều thật sự mới hoặc hữu ích cho người đọc, không phải lời khen tổ chức của bạn.</div>`,
  ]]);

const c3q = quiz('prw301-quiz-3', 'Quiz 3 — Press release|||Quiz 3 — Thông cáo báo chí', [
  { id: 'q1', question: 'Cấu trúc "kim tự tháp ngược" nghĩa là?|||The "inverted pyramid" means?', options: ['Bối cảnh trước, tin sau|||Background first, news last', 'Tin quan trọng nhất ở đoạn đầu|||Most important news in the first paragraph', 'Xếp theo thứ tự thời gian|||Chronological order', 'Kết luận ở cuối như bài luận|||Conclusion at the end like an essay'], correctIndex: 1, explanation: 'Kim tự tháp ngược: cốt lõi lên đầu, chi tiết & bối cảnh xuống dưới, cắt từ dưới không mất ý.' },
  { id: 'q2', question: 'Đoạn "boilerplate" trong thông cáo là?|||The "boilerplate" in a release is?', options: ['Tít chính|||The headline', 'Câu lead đầu tiên|||The opening lead', 'Đoạn "Về [Tổ chức]" cố định|||The standing "About [Organization]" paragraph', 'Dòng liên hệ|||The contact line'], correctIndex: 2, explanation: 'Boilerplate = đoạn giới thiệu tổ chức dùng lại ở cuối mọi thông cáo.' },
  { id: 'q3', question: 'Câu "lead" của thông cáo nên?|||The release "lead" should?', options: ['Khen tổ chức thật kêu|||Praise the organization loudly', 'Trả lời các 5W1H then chốt|||Answer the key 5W1H', 'Bắt đầu bằng một câu hỏi tu từ|||Start with a rhetorical question', 'Liệt kê mọi chi tiết kỹ thuật|||List every technical detail'], correctIndex: 1, explanation: 'Lead nén tin chính (ai/gì/khi nào/ở đâu/vì sao) vào câu mở đầu.' },
]);

const c4 = doc('prw301-4-1-media-kit-pitch', '4.1 — Media kit & the pitch|||4.1 — Bộ tài liệu báo chí & pitch',
  'Media kit (press kit): fact sheet, backgrounder, tiểu sử, ảnh, FAQ; pitch email cho nhà báo (dòng subject, cá nhân hoá, ngắn, đúng góc tin). Có mẫu pitch.',
  [[
    `<span class="eyebrow">PRW301 · Chapter 4 · Lesson 4.1</span>
<h2>Media kit &amp; the pitch</h2>
<h3>The media kit (press kit)</h3>
<p>A <strong>media kit</strong> gives a journalist everything needed to write about you, in one package:</p>
<ul>
<li><strong>Fact sheet</strong> — key facts in scannable bullets (founded, size, product, numbers).</li>
<li><strong>Backgrounder</strong> — a longer narrative: history, mission, context.</li>
<li><strong>Bios</strong> — short profiles of leaders/spokespeople.</li>
<li><strong>Assets</strong> — logo, photos, FAQ, and recent releases.</li>
</ul>
<h3>The pitch: a short, targeted email</h3>
<p>A <strong>pitch</strong> is a personal email asking a specific journalist to cover a story. It is not a press release — it is the reason <em>this reporter, on this beat,</em> should care. Keep it under ~150 words.</p>
<pre>Subject: Free AI academy now covers all 210 FPT courses

Hi [Reporter name],

I read your piece on EdTech access last week. You might find this a fit:
CuongThai just made its bilingual AI academy free for every FPT course
— 210 of them — the day before the semester starts.

Happy to share data on early usage or set up a 15-min interview with the
founder this week.

Thanks,
[Your name] · [phone] · [email]</pre>
<div class="callout"><span class="badge">Personalize or perish</span> Reporters delete mass blasts. Name the journalist, reference their beat or recent work, and pitch the ONE angle that fits them.</div>`,
    `<span class="eyebrow">PRW301 · Chương 4 · Bài 4.1</span>
<h2>Bộ tài liệu báo chí &amp; pitch</h2>
<h3>Media kit (press kit)</h3>
<p>Một <strong>media kit</strong> đưa cho nhà báo mọi thứ cần để viết về bạn, gói gọn một chỗ:</p>
<ul>
<li><strong>Fact sheet</strong> — dữ kiện then chốt dạng gạch đầu dòng dễ lướt (thành lập, quy mô, sản phẩm, con số).</li>
<li><strong>Backgrounder</strong> — bản tường thuật dài hơn: lịch sử, sứ mệnh, bối cảnh.</li>
<li><strong>Tiểu sử (bios)</strong> — hồ sơ ngắn của lãnh đạo/người phát ngôn.</li>
<li><strong>Tài nguyên</strong> — logo, ảnh, FAQ, và các thông cáo gần đây.</li>
</ul>
<h3>Pitch: email ngắn, đúng đối tượng</h3>
<p>Một <strong>pitch</strong> là email cá nhân đề nghị một nhà báo cụ thể đưa tin. Nó không phải thông cáo — mà là lý do vì sao <em>chính phóng viên này, ở mảng này,</em> nên quan tâm. Giữ dưới ~150 chữ.</p>
<pre>Tiêu đề: Học viện AI miễn phí nay phủ đủ 210 môn của FPT

Chào [Tên phóng viên],

Tôi đọc bài của anh/chị về khả năng tiếp cận EdTech tuần trước. Có thể
điều này hợp: CuongThai vừa miễn phí học viện AI song ngữ cho mọi môn
của FPT — 210 môn — đúng một ngày trước khi vào học kỳ.

Rất vui được chia sẻ dữ liệu sử dụng ban đầu hoặc sắp xếp phỏng vấn
15 phút với nhà sáng lập trong tuần.

Cảm ơn,
[Tên bạn] · [điện thoại] · [email]</pre>
<div class="callout"><span class="badge">Cá nhân hoá hoặc bị xoá</span> Phóng viên xoá email gửi hàng loạt. Hãy gọi tên nhà báo, nhắc mảng hoặc bài gần đây của họ, và pitch ĐÚNG MỘT góc tin hợp với họ.</div>`,
  ]]);

const c4q = quiz('prw301-quiz-4', 'Quiz 4 — Media kit & pitch|||Quiz 4 — Media kit & pitch', [
  { id: 'q1', question: 'Trong media kit, "fact sheet" là?|||In a media kit, the "fact sheet" is?', options: ['Bản tường thuật dài về lịch sử|||A long narrative of history', 'Dữ kiện then chốt dạng gạch đầu dòng dễ lướt|||Key facts in scannable bullets', 'Thư pitch gửi nhà báo|||The pitch email', 'Tiểu sử lãnh đạo|||The leader bios'], correctIndex: 1, explanation: 'Fact sheet nén dữ kiện chính thành bullet dễ lướt; backgrounder mới là bản tường thuật dài.' },
  { id: 'q2', question: 'Điểm khác biệt cốt lõi của một "pitch"?|||The core difference of a "pitch" is?', options: ['Nó dài hơn thông cáo|||It is longer than a release', 'Nó cá nhân hoá, nêu lý do CHÍNH nhà báo này nên quan tâm|||It is personalized to why THIS reporter should care', 'Nó gửi hàng loạt cho mọi phóng viên|||It is blasted to every reporter', 'Nó không cần dòng subject|||It needs no subject line'], correctIndex: 1, explanation: 'Pitch là email nhắm đúng một nhà báo/góc tin, không phải bản phát tán đại trà.' },
  { id: 'q3', question: 'Vì sao gửi pitch hàng loạt, không cá nhân hoá thường thất bại?|||Why do mass, un-personalized pitches usually fail?', options: ['Vì quá ngắn|||They are too short', 'Vì phóng viên xoá email không đúng mảng/không nhắm họ|||Reporters delete blasts not matched to their beat', 'Vì thiếu logo|||They lack a logo', 'Vì gửi buổi sáng|||They are sent in the morning'], correctIndex: 1, explanation: 'Không nhắm đúng mảng/nhà báo → bị coi là spam và bị xoá.' },
]);

const c5 = doc('prw301-5-1-executive-writing', '5.1 — Writing for executives & the organization|||5.1 — Viết cho lãnh đạo & tổ chức',
  'Bài phát biểu (speech): viết cho TAI nghe không phải mắt đọc; thư ngỏ (open letter); key messages & talking points; chuẩn bị Q&A cho phỏng vấn.',
  [[
    `<span class="eyebrow">PRW301 · Chapter 5 · Lesson 5.1</span>
<h2>Writing for executives &amp; the organization</h2>
<h3>Speeches — write for the ear, not the eye</h3>
<p>A speech is heard once, not re-read. Write it the way people <em>speak</em>: short sentences, one idea at a time, concrete images, natural rhythm. Open with a hook, deliver a small number of clear points, and close with a line the audience will remember.</p>
<ul>
<li>Read every draft <strong>aloud</strong> — if you stumble, the speaker will too.</li>
<li>Write in the leader's real voice, not corporate jargon.</li>
<li>Use signposts ("First... Second... Finally...") so listeners can follow without a page.</li>
</ul>
<h3>Open letters, key messages, talking points</h3>
<p>An <strong>open letter</strong> (e.g. a CEO to customers) states a position plainly and signs it with accountability. <strong>Key messages</strong> are the two or three sentences the organization wants repeated everywhere; <strong>talking points</strong> arm a spokesperson to stay on message.</p>
<h3>Prepare the Q&amp;A</h3>
<pre>For each likely question, prepare:
  - the honest short answer
  - one supporting fact
  - the bridge back to a key message
Anticipate the HARD questions first — silence on those reads as hiding.</pre>
<div class="callout"><span class="badge">Consistency is the point</span> Executive writing exists so the whole organization says the same true thing in the same voice — align the speech, the letter and the talking points before anyone speaks.</div>`,
    `<span class="eyebrow">PRW301 · Chương 5 · Bài 5.1</span>
<h2>Viết cho lãnh đạo &amp; tổ chức</h2>
<h3>Bài phát biểu — viết cho TAI nghe, không cho mắt đọc</h3>
<p>Bài phát biểu được nghe một lần, không đọc lại. Hãy viết theo cách người ta <em>nói</em>: câu ngắn, mỗi lúc một ý, hình ảnh cụ thể, nhịp tự nhiên. Mở bằng một cái móc, đưa vài điểm rõ ràng, và kết bằng một câu khán giả sẽ nhớ.</p>
<ul>
<li>Đọc <strong>to</strong> mọi bản nháp — bạn vấp chỗ nào thì người nói cũng vấp.</li>
<li>Viết đúng giọng thật của lãnh đạo, không dùng biệt ngữ doanh nghiệp.</li>
<li>Dùng cột mốc dẫn dắt ("Thứ nhất... Thứ hai... Cuối cùng...") để người nghe theo được mà không cần trang giấy.</li>
</ul>
<h3>Thư ngỏ, key messages, talking points</h3>
<p>Một <strong>thư ngỏ</strong> (vd CEO gửi khách hàng) nêu lập trường rõ ràng và ký tên nhận trách nhiệm. <strong>Key messages</strong> là hai ba câu tổ chức muốn được lặp lại ở khắp nơi; <strong>talking points</strong> trang bị cho người phát ngôn để bám thông điệp.</p>
<h3>Chuẩn bị Q&amp;A</h3>
<pre>Với mỗi câu hỏi có khả năng gặp, hãy chuẩn bị:
  - câu trả lời ngắn, trung thực
  - một dữ kiện hỗ trợ
  - nhịp cầu quay về key message
Lường trước các câu KHÓ trước tiên — im lặng trước chúng bị hiểu là giấu.</pre>
<div class="callout"><span class="badge">Nhất quán là mấu chốt</span> Viết cho lãnh đạo tồn tại để cả tổ chức nói cùng một điều đúng, cùng một giọng — hãy khớp bài phát biểu, thư ngỏ và talking points trước khi có ai lên tiếng.</div>`,
  ]]);

const c5q = quiz('prw301-quiz-5', 'Quiz 5 — Executive writing|||Quiz 5 — Viết cho lãnh đạo', [
  { id: 'q1', question: 'Nguyên tắc số một khi viết bài phát biểu?|||The number-one rule for writing a speech?', options: ['Viết cho tai nghe: câu ngắn, đọc to để thử|||Write for the ear: short sentences, read aloud to test', 'Nhồi càng nhiều số liệu càng tốt|||Pack in as many statistics as possible', 'Dùng biệt ngữ doanh nghiệp cho trang trọng|||Use corporate jargon to sound formal', 'Viết câu dài, phức tạp|||Write long, complex sentences'], correctIndex: 0, explanation: 'Speech được nghe một lần → viết như nói, câu ngắn, thử bằng cách đọc to.' },
  { id: 'q2', question: '"Key messages" là gì?|||What are "key messages"?', options: ['Danh sách phóng viên|||A list of reporters', 'Hai-ba câu tổ chức muốn được lặp lại khắp nơi|||The two-three sentences the org wants repeated everywhere', 'Tiêu đề thông cáo|||A press release headline', 'Đoạn boilerplate|||The boilerplate'], correctIndex: 1, explanation: 'Key messages = thông điệp cốt lõi được nhất quán lặp lại; talking points hỗ trợ bám nó.' },
  { id: 'q3', question: 'Khi chuẩn bị Q&A, nên xử lý câu hỏi KHÓ thế nào?|||Preparing Q&A, how to handle the HARD questions?', options: ['Lờ đi, chỉ chuẩn bị câu dễ|||Ignore them, prep only easy ones', 'Lường trước chúng vì im lặng bị hiểu là giấu|||Anticipate them first — silence reads as hiding', 'Trả lời bằng "miễn bình luận" mọi lúc|||Answer "no comment" every time', 'Đổ lỗi cho phóng viên|||Blame the reporter'], correctIndex: 1, explanation: 'Chuẩn bị câu khó trước: trả lời ngắn thật + dữ kiện + bắc cầu về key message.' },
]);

const c6 = doc('prw301-6-1-digital-social', '6.1 — Digital & social content|||6.1 — Nội dung số & mạng xã hội',
  'Web copy (F-pattern, mobile), blog post, social post (viết riêng theo nền tảng), email newsletter, SEO cơ bản (từ khoá, tiêu đề, meta, liên kết).',
  [[
    `<span class="eyebrow">PRW301 · Chapter 6 · Lesson 6.1</span>
<h2>Digital &amp; social content</h2>
<h3>Web copy — people scan, they do not read</h3>
<p>Online readers scan in an <strong>F-pattern</strong>. Front-load the point, use short paragraphs, meaningful headings, and bullet lists. Put the key action or link where the eye lands. Write for mobile: one thumb, small screen, little patience.</p>
<h3>Social posts — one message per platform, in its native voice</h3>
<ul>
<li><strong>Do not cross-post identically</strong> — rewrite for each platform's length, tone and audience.</li>
<li>Lead with the hook in the first line (the rest may be hidden behind "more").</li>
<li>One clear call to action; a few relevant hashtags, not a wall of them.</li>
</ul>
<h3>Email newsletter &amp; basic SEO</h3>
<pre>Newsletter: subject line earns the open; one main idea; scannable; clear CTA.

Basic SEO for PR writers:
  - target ONE keyword phrase per page
  - put it in the title, first paragraph and a heading
  - write a compelling meta description (the search snippet)
  - link to your own related pages and credible sources
Write for humans FIRST; search engines reward clear, useful pages.</pre>
<div class="callout"><span class="badge">Native, not recycled</span> A tweet is not a caption is not a LinkedIn post. Same core message, re-authored for how each audience actually reads.</div>`,
    `<span class="eyebrow">PRW301 · Chương 6 · Bài 6.1</span>
<h2>Nội dung số &amp; mạng xã hội</h2>
<h3>Web copy — người ta lướt, không đọc</h3>
<p>Người đọc online lướt theo <strong>hình chữ F</strong>. Đặt ý chính lên trước, đoạn ngắn, tiêu đề có nghĩa, và danh sách gạch đầu dòng. Đặt hành động hoặc liên kết then chốt ở nơi mắt dừng. Viết cho di động: một ngón cái, màn hình nhỏ, ít kiên nhẫn.</p>
<h3>Social post — một thông điệp mỗi nền tảng, đúng giọng bản địa</h3>
<ul>
<li><strong>Đừng đăng lại y hệt khắp nơi</strong> — viết lại theo độ dài, giọng và đối tượng của từng nền tảng.</li>
<li>Mở bằng cái móc ngay dòng đầu (phần sau có thể bị giấu sau "xem thêm").</li>
<li>Một lời kêu gọi hành động rõ; vài hashtag liên quan, không phải một bức tường.</li>
</ul>
<h3>Email newsletter &amp; SEO cơ bản</h3>
<pre>Newsletter: dòng tiêu đề giành cú mở; một ý chính; dễ lướt; CTA rõ.

SEO cơ bản cho người viết PR:
  - nhắm MỘT cụm từ khoá mỗi trang
  - đưa nó vào tiêu đề, đoạn đầu và một heading
  - viết meta description hấp dẫn (đoạn hiện trên kết quả tìm)
  - liên kết tới trang liên quan của mình và nguồn uy tín
Viết cho CON NGƯỜI trước; máy tìm kiếm thưởng cho trang rõ ràng, hữu ích.</pre>
<div class="callout"><span class="badge">Bản địa, không tái chế</span> Một tweet không phải một caption không phải một bài LinkedIn. Cùng thông điệp cốt lõi, viết lại theo cách mỗi đối tượng thật sự đọc.</div>`,
  ]]);

const c6q = quiz('prw301-quiz-6', 'Quiz 6 — Digital & social|||Quiz 6 — Nội dung số & MXH', [
  { id: 'q1', question: 'Người đọc web thường lướt theo mẫu nào?|||Web readers usually scan in which pattern?', options: ['Hình chữ F|||An F-pattern', 'Từ dưới lên|||Bottom to top', 'Đọc từng chữ như sách|||Word-by-word like a book', 'Theo đường chéo phải sang trái|||Diagonally right to left'], correctIndex: 0, explanation: 'F-pattern → đặt ý chính lên đầu, đoạn ngắn, heading & bullet.' },
  { id: 'q2', question: 'Cách đúng để đăng cùng một tin lên nhiều nền tảng?|||The right way to post one story across platforms?', options: ['Sao chép y hệt khắp nơi|||Copy it identically everywhere', 'Viết lại theo độ dài/giọng/đối tượng từng nền tảng|||Rewrite for each platform length/tone/audience', 'Chỉ đăng nơi nào dài nhất|||Post only where length is largest', 'Nhồi thật nhiều hashtag|||Stuff in many hashtags'], correctIndex: 1, explanation: 'Cùng thông điệp cốt lõi nhưng viết lại bản địa cho từng nền tảng.' },
  { id: 'q3', question: 'Nguyên tắc SEO cơ bản cho người viết PR?|||A basic SEO rule for PR writers?', options: ['Nhồi từ khoá càng dày càng tốt|||Stuff keywords as densely as possible', 'Viết cho con người trước, nhắm MỘT cụm từ khoá/trang|||Write for humans first, target ONE keyword phrase per page', 'Bỏ hẳn tiêu đề & meta|||Drop titles & meta entirely', 'Không liên kết đi đâu cả|||Never link out'], correctIndex: 1, explanation: 'Viết rõ, hữu ích cho người; mỗi trang một cụm từ khoá đặt ở title/đoạn đầu/heading.' },
]);

const c7 = doc('prw301-7-1-crisis-internal', '7.1 — Crisis & internal communication|||7.1 — Viết cho khủng hoảng & nội bộ',
  'Holding statement (phản hồi đầu, nhanh); crisis statement (thừa nhận, đồng cảm, hành động); nguyên tắc trung thực & kịp thời; internal memo & employee communication.',
  [[
    `<span class="eyebrow">PRW301 · Chapter 7 · Lesson 7.1</span>
<h2>Crisis &amp; internal communication</h2>
<h3>The holding statement — buy time honestly</h3>
<p>When something goes wrong, silence is read as guilt. A <strong>holding statement</strong> is a short, immediate first response: acknowledge you are aware, say you are gathering facts, show you care, and promise an update by a stated time. It never speculates and never assigns blame before the facts are in.</p>
<h3>The full crisis statement</h3>
<pre>A credible crisis statement:
  1. States the facts you have confirmed (no spin, no jargon)
  2. Shows genuine empathy for those affected
  3. Explains the concrete action you are taking
  4. Says what happens next and how to get updates
Be FIRST, be RIGHT, be HONEST. Correcting fast beats staying silent.</pre>
<h3>Internal communication comes first</h3>
<p>Employees should hear it from you before they read it in the news — a workforce blindsided by external reports loses trust fast. An <strong>internal memo</strong> is clear, calm and specific: what happened, what it means for them, what to do, and who to ask. Internal and external messages must not contradict each other.</p>
<div class="callout"><span class="badge">Empathy before defense</span> In a crisis, acknowledge the human impact first. Legal caution matters, but a statement that sounds like it is dodging responsibility deepens the crisis.</div>`,
    `<span class="eyebrow">PRW301 · Chương 7 · Bài 7.1</span>
<h2>Viết cho khủng hoảng &amp; nội bộ</h2>
<h3>Holding statement — câu giờ một cách trung thực</h3>
<p>Khi có chuyện, im lặng bị hiểu là có lỗi. Một <strong>holding statement</strong> là phản hồi đầu tiên ngắn, tức thì: thừa nhận bạn đã biết, nói đang thu thập dữ kiện, thể hiện sự quan tâm, và hứa cập nhật vào một mốc thời gian cụ thể. Nó không suy đoán và không quy trách nhiệm khi dữ kiện chưa rõ.</p>
<h3>Tuyên bố khủng hoảng đầy đủ</h3>
<pre>Một tuyên bố khủng hoảng đáng tin:
  1. Nêu dữ kiện đã xác nhận (không tô vẽ, không biệt ngữ)
  2. Thể hiện sự đồng cảm thật với người bị ảnh hưởng
  3. Giải thích hành động cụ thể đang làm
  4. Nói bước tiếp theo và cách nhận cập nhật
Hãy NHANH nhất, ĐÚNG, và TRUNG THỰC. Sửa nhanh hơn hẳn im lặng.</pre>
<h3>Truyền thông nội bộ đi trước</h3>
<p>Nhân viên nên nghe từ bạn trước khi đọc trên báo — một lực lượng bị bất ngờ bởi tin bên ngoài mất niềm tin rất nhanh. Một <strong>memo nội bộ</strong> phải rõ, bình tĩnh và cụ thể: chuyện gì xảy ra, nghĩa là gì với họ, phải làm gì, và hỏi ai. Thông điệp nội bộ và bên ngoài không được mâu thuẫn nhau.</p>
<div class="callout"><span class="badge">Đồng cảm trước phòng thủ</span> Trong khủng hoảng, hãy thừa nhận tác động con người trước. Thận trọng pháp lý là cần, nhưng một tuyên bố nghe như né trách nhiệm sẽ làm khủng hoảng sâu thêm.</div>`,
  ]]);

const c7q = quiz('prw301-quiz-7', 'Quiz 7 — Crisis & internal|||Quiz 7 — Khủng hoảng & nội bộ', [
  { id: 'q1', question: 'Mục đích của một "holding statement" là?|||The purpose of a "holding statement" is?', options: ['Chối bỏ mọi trách nhiệm|||Deny all responsibility', 'Phản hồi đầu nhanh: đã biết, đang thu dữ kiện, sẽ cập nhật|||A fast first response: aware, gathering facts, will update', 'Đổ lỗi cho bên khác|||Blame another party', 'Im lặng chờ tự lắng|||Stay silent and wait it out'], correctIndex: 1, explanation: 'Holding statement câu giờ trung thực: thừa nhận, đang xử lý, hứa cập nhật — không suy đoán/đổ lỗi.' },
  { id: 'q2', question: 'Nguyên tắc vàng khi phát ngôn khủng hoảng?|||The golden rule for crisis messaging?', options: ['Chậm, mơ hồ, phòng thủ|||Slow, vague, defensive', 'Nhanh nhất, đúng, trung thực (be first, right, honest)|||Be first, be right, be honest', 'Chỉ nói qua luật sư|||Speak only through lawyers', 'Phủ nhận đến khi hết đường|||Deny until forced'], correctIndex: 1, explanation: 'Be first/right/honest: sửa nhanh và trung thực tốt hơn im lặng hay né tránh.' },
  { id: 'q3', question: 'Vì sao truyền thông nội bộ nên đi TRƯỚC báo chí?|||Why should internal comms go BEFORE the press?', options: ['Để nhân viên khỏi bị bất ngờ và mất niềm tin|||So employees are not blindsided and lose trust', 'Vì nhân viên không quan trọng|||Because employees do not matter', 'Để giấu tin với công chúng|||To hide the news from the public', 'Vì memo dễ viết hơn|||Because memos are easier'], correctIndex: 0, explanation: 'Nghe từ tổ chức trước khi đọc trên báo giữ được niềm tin; nội bộ & ngoài phải không mâu thuẫn.' },
]);

const c8 = doc('prw301-8-1-editing', '8.1 — Editing & publication-ready quality|||8.1 — Biên tập & chuẩn xuất bản',
  'Editing (cấu trúc, độ rõ) vs proofreading (lỗi vặt); dùng số liệu đúng & có ngữ cảnh; tránh sáo rỗng & biệt ngữ; kiểm chứng dữ kiện; checklist chất lượng trước khi gửi.',
  [[
    `<span class="eyebrow">PRW301 · Chapter 8 · Lesson 8.1</span>
<h2>Editing &amp; publication-ready quality</h2>
<h3>Editing is not proofreading</h3>
<ul>
<li><strong>Editing</strong> fixes the big things: structure, clarity, order, tone, and cutting what does not earn its place.</li>
<li><strong>Proofreading</strong> is the last pass: typos, grammar, spelling, punctuation, names and numbers.</li>
</ul>
<p>Do them in that order — never polish sentences you may delete.</p>
<h3>Use numbers well; drop the clichés</h3>
<pre>Numbers:  give context, not just a figure.
  Weak:   "sales grew significantly"
  Strong: "sales grew 32%, from 1.1M to 1.45M users"
Kill filler: "world-class", "cutting-edge", "leading provider",
  "revolutionary", "synergy", "leverage" — say what actually happened.</pre>
<h3>Verify, then a final checklist</h3>
<p>Every fact gets checked against a source; every name and title spelled right. Then run the pre-send checklist:</p>
<ul>
<li>Is the core message clear in the first lines?</li>
<li>Is it accurate, and free of unsupported claims?</li>
<li>Is it in AP style, active voice, tight?</li>
<li>Are contact details, links and the date correct?</li>
<li>Would the intended reader find it genuinely useful?</li>
</ul>
<div class="callout"><span class="badge">Read it once more, aloud</span> Reading the final draft aloud catches the awkward, the unclear and the wrong that your eye slides past on screen — the cheapest quality check there is.</div>`,
    `<span class="eyebrow">PRW301 · Chương 8 · Bài 8.1</span>
<h2>Biên tập &amp; chuẩn xuất bản</h2>
<h3>Biên tập không phải soát lỗi</h3>
<ul>
<li><strong>Biên tập (editing)</strong> sửa những thứ lớn: cấu trúc, độ rõ, trình tự, giọng, và cắt thứ không xứng đáng có mặt.</li>
<li><strong>Soát lỗi (proofreading)</strong> là lượt cuối: lỗi đánh máy, ngữ pháp, chính tả, dấu câu, tên và con số.</li>
</ul>
<p>Làm theo đúng thứ tự đó — đừng gọt câu mà bạn có thể sẽ xoá.</p>
<h3>Dùng số liệu khéo; bỏ sáo rỗng</h3>
<pre>Số liệu:  cho ngữ cảnh, không chỉ một con số trơ.
  Yếu:   "doanh số tăng đáng kể"
  Mạnh:  "doanh số tăng 32%, từ 1,1 triệu lên 1,45 triệu người dùng"
Diệt từ rỗng: "đẳng cấp thế giới", "tiên phong", "nhà cung cấp hàng đầu",
  "cách mạng", "cộng hưởng", "tận dụng" — hãy nói điều thật sự đã xảy ra.</pre>
<h3>Kiểm chứng, rồi checklist cuối</h3>
<p>Mọi dữ kiện phải đối chiếu với nguồn; mọi tên và chức danh viết đúng. Rồi chạy checklist trước khi gửi:</p>
<ul>
<li>Thông điệp cốt lõi có rõ ở những dòng đầu không?</li>
<li>Có chính xác, và không có khẳng định thiếu căn cứ không?</li>
<li>Có theo AP style, thể chủ động, gọn không?</li>
<li>Thông tin liên hệ, liên kết và ngày tháng có đúng không?</li>
<li>Người đọc mục tiêu có thấy nó thật sự hữu ích không?</li>
</ul>
<div class="callout"><span class="badge">Đọc lại một lần, thành tiếng</span> Đọc to bản cuối bắt được chỗ vụng, chỗ tối nghĩa và chỗ sai mà mắt lướt qua trên màn hình — phép kiểm chất lượng rẻ nhất có được.</div>`,
  ]]);

const c8q = quiz('prw301-quiz-8', 'Quiz 8 — Editing|||Quiz 8 — Biên tập', [
  { id: 'q1', question: 'Khác biệt giữa editing và proofreading?|||The difference between editing and proofreading?', options: ['Giống hệt nhau|||They are identical', 'Editing sửa cấu trúc/độ rõ; proofreading bắt lỗi vặt cuối|||Editing fixes structure/clarity; proofreading catches final typos', 'Proofreading làm trước editing|||Proofreading comes before editing', 'Cả hai chỉ đổi font|||Both only change fonts'], correctIndex: 1, explanation: 'Biên tập lo cấu trúc/độ rõ trước; soát lỗi là lượt cuối bắt typo/chính tả/số.' },
  { id: 'q2', question: 'Cách dùng số liệu tốt trong bài PR?|||How to use numbers well in PR writing?', options: ['Chỉ nói "tăng đáng kể"|||Just say "grew significantly"', 'Cho con số kèm ngữ cảnh (32%, từ 1,1M lên 1,45M)|||Give the figure with context (32%, 1.1M to 1.45M)', 'Bỏ hết số cho gọn|||Drop all numbers for brevity', 'Làm tròn thật mạnh tay|||Round very aggressively'], correctIndex: 1, explanation: 'Số liệu cần ngữ cảnh để có nghĩa; tránh trạng từ mơ hồ như "đáng kể".' },
  { id: 'q3', question: 'Đâu là mẹo kiểm chất lượng rẻ nhất trước khi gửi?|||The cheapest quality check before sending?', options: ['Đọc to bản cuối một lần|||Read the final draft aloud once', 'Thêm nhiều tính từ hoa mỹ|||Add more flowery adjectives', 'Gửi ngay không đọc lại|||Send immediately without re-reading', 'Nhờ máy viết lại toàn bộ|||Have a machine rewrite everything'], correctIndex: 0, explanation: 'Đọc to bắt chỗ vụng/tối nghĩa/sai mà mắt lướt qua — rẻ và hiệu quả.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'PRW301',
    slug: 'prw301-professional-public-relations-writing',
    title: 'Professional Public Relations Writing',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PRW301.webp',
    shortDescription: 'Write like a PR pro — principles & ethics, research, press releases (AP style), media kits & pitches, executive speeches, digital & social copy, crisis & internal comms, and editing. Bilingual, with templates & quizzes.|||Viết như dân PR chuyên nghiệp — nguyên tắc & đạo đức, nghiên cứu, thông cáo báo chí (AP style), media kit & pitch, bài phát biểu lãnh đạo, nội dung số & MXH, khủng hoảng & nội bộ, biên tập. Song ngữ, có mẫu & quiz.',
    description: 'Môn <strong>PRW301 — Professional Public Relations Writing</strong> (khối Công nghệ Truyền thông, kỳ 4) dạy bạn viết cho tổ chức theo chuẩn nghề. Từ <strong>nguyên tắc &amp; đạo đức</strong> (đối tượng, mục đích, rõ-ngắn-đúng, PRSA) → <strong>nghiên cứu &amp; thông điệp cốt lõi</strong> (5W1H) → <strong>thông cáo báo chí</strong> (kim tự tháp ngược, AP style) → <strong>media kit &amp; pitch</strong> → <strong>viết cho lãnh đạo</strong> (speech, thư ngỏ, Q&amp;A) → <strong>nội dung số &amp; mạng xã hội</strong> → <strong>khủng hoảng &amp; nội bộ</strong> → <strong>biên tập &amp; chuẩn xuất bản</strong>. Bám giáo trình chuẩn (Treadwell; Newsom &amp; Haynes; AP Stylebook), song ngữ, có khuôn mẫu, ví dụ thật và quiz mỗi chương.',
    whatYouLearn: 'Nguyên tắc & đạo đức PR (đối tượng, mục đích, rõ-ngắn-đúng, PRSA); nghiên cứu, phỏng vấn lấy quote, xác định key message & 5W1H; viết thông cáo báo chí theo kim tự tháp ngược & AP style; dựng media kit (fact sheet, backgrounder, bio) và pitch nhà báo; viết speech, thư ngỏ, talking points, Q&A cho lãnh đạo; web copy, social post theo nền tảng, newsletter & SEO cơ bản; holding statement, crisis statement & memo nội bộ; biên tập, soát lỗi, dùng số liệu, tránh sáo rỗng & checklist chất lượng.',
    requirements: 'Kỹ năng viết tiếng Việt & tiếng Anh cơ bản. Không cần kiến thức PR trước. Xem điều kiện tiên quyết trong khung chương trình khối Công nghệ Truyền thông trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, AP Stylebook, PRSA, Purdue OWL, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'PR writing là gì; khác báo chí & quảng cáo; lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Viết PR & nguyên tắc|||Chapter 1 — PR writing & principles', description: 'Đối tượng, mục đích, rõ-ngắn-đúng, đạo đức.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nghiên cứu & chuẩn bị|||Chapter 2 — Research & preparation', description: 'Thu thập, phỏng vấn, key message, 5W1H.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thông cáo báo chí|||Chapter 3 — The press release', description: 'Kim tự tháp ngược, lead, boilerplate, AP style.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Media kit & pitch|||Chapter 4 — Media kit & pitch', description: 'Fact sheet, backgrounder, pitch nhà báo.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Viết cho lãnh đạo|||Chapter 5 — Executive writing', description: 'Speech, thư ngỏ, key messages, Q&A.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nội dung số & MXH|||Chapter 6 — Digital & social', description: 'Web copy, social, newsletter, SEO cơ bản.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Khủng hoảng & nội bộ|||Chapter 7 — Crisis & internal', description: 'Holding/crisis statement, memo nội bộ.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Biên tập & xuất bản|||Chapter 8 — Editing & quality', description: 'Editing, proofreading, số liệu, checklist.', lessons: [c8, c8q] },
  ],
};
