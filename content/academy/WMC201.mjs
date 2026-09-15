/**
 * WMC201 — Media Writing. Giáo trình FLM (syl): viết cho truyền thông —
 * nguyên tắc, ngữ pháp & AP style, tin tức (kim tự tháp ngược), tường thuật &
 * feature, broadcast, PR, digital/social, đạo đức & kiểm chứng. Nguồn: "Writing
 * and Reporting News" (Rich); "Media Writing: Print, Broadcast, and Public
 * Relations" (Whitaker/Ramsey/Smith); "The Associated Press Stylebook".
 * Song ngữ + ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb.
 * KHÔNG backtick lồng nhau/${}; không nháy đơn thừa trong string 1 nháy.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('wmc201-0-0-tai-lieu', 'Course materials & references|||Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">WMC201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn media writing — news, feature, broadcast, PR and digital writing — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal references used across journalism programs.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giao trinh &amp; lecture slides for WMC201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Writing and Reporting News: A Coaching Method</em> — Carole Rich</li>
<li><em>Media Writing: Print, Broadcast, and Public Relations</em> — Whitaker, Ramsey &amp; Smith</li>
<li><em>The Associated Press Stylebook</em> — the industry-standard style guide for American news writing</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.poynter.org/" target="_blank" rel="noopener">Poynter Institute</a> — journalism training, ethics &amp; writing craft, free articles</li>
<li><a href="https://owl.purdue.edu/owl/subject_specific_writing/journalism_and_journalistic_writing/index.html" target="_blank" rel="noopener">Purdue OWL — Journalism &amp; Journalistic Writing</a> — free AP style &amp; news writing guide</li>
<li><a href="https://www.apstylebook.com/" target="_blank" rel="noopener">AP Stylebook (apstylebook.com)</a> — official AP style reference (subscription; free sample entries)</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@Poynter" target="_blank" rel="noopener">Poynter</a> — reporting, writing &amp; media-literacy training</li>
<li><a href="https://www.youtube.com/@AP" target="_blank" rel="noopener">The Associated Press</a> — real newsroom output to study lead &amp; structure</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://hemingwayapp.com/" target="_blank" rel="noopener">Hemingway Editor</a> — flags long sentences &amp; complex words, free to use online</li>
<li><a href="https://www.grammarly.com/" target="_blank" rel="noopener">Grammarly</a> — grammar &amp; clarity checking</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — clarity/accuracy/brevity, AP style grammar &amp; punctuation, inverted pyramid &amp; the lead.</li>
<li><strong>Practice</strong> — rewrite a raw event into a news lead, then a 200-word inverted-pyramid story.</li>
<li><strong>Go deeper</strong> — interviews &amp; feature writing, broadcast scripts, press releases, SEO/social copy.</li>
<li><strong>Job-ready</strong> — fact-check every claim, run an AP style pass, and proofread for legal/libel risk before publishing.</li>
</ol></div>`,
    `<span class="eyebrow">WMC201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học viết cho truyền thông — tin tức, tường thuật, broadcast, PR và digital — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn tham khảo miễn phí, hợp pháp, dùng chung trong các chương trình báo chí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của WMC201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Writing and Reporting News: A Coaching Method</em> — Carole Rich</li>
<li><em>Media Writing: Print, Broadcast, and Public Relations</em> — Whitaker, Ramsey &amp; Smith</li>
<li><em>The Associated Press Stylebook</em> — sổ tay chuẩn văn phong dùng trong báo chí Mỹ</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.poynter.org/" target="_blank" rel="noopener">Poynter Institute</a> — đào tạo báo chí, đạo đức nghề &amp; kỹ năng viết, bài viết miễn phí</li>
<li><a href="https://owl.purdue.edu/owl/subject_specific_writing/journalism_and_journalistic_writing/index.html" target="_blank" rel="noopener">Purdue OWL — Journalism &amp; Journalistic Writing</a> — hướng dẫn AP style &amp; viết tin miễn phí</li>
<li><a href="https://www.apstylebook.com/" target="_blank" rel="noopener">AP Stylebook (apstylebook.com)</a> — nguồn AP style chính thức (có phí; một số mục mẫu miễn phí)</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Poynter" target="_blank" rel="noopener">Poynter</a> — đưa tin, viết bài &amp; đào tạo hiểu biết truyền thông</li>
<li><a href="https://www.youtube.com/@AP" target="_blank" rel="noopener">The Associated Press</a> — sản phẩm phòng tin thật để soi lead &amp; cấu trúc</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://hemingwayapp.com/" target="_blank" rel="noopener">Hemingway Editor</a> — bắt câu dài &amp; từ phức tạp, dùng trực tuyến miễn phí</li>
<li><a href="https://www.grammarly.com/" target="_blank" rel="noopener">Grammarly</a> — kiểm tra ngữ pháp &amp; độ rõ</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — rõ ràng/chính xác/súc tích, ngữ pháp &amp; dấu câu AP style, kim tự tháp ngược &amp; lead.</li>
<li><strong>Luyện tập</strong> — viết lại một sự kiện thô thành lead, rồi thành tin 200 chữ theo kim tự tháp ngược.</li>
<li><strong>Đào sâu thực tế</strong> — phỏng vấn &amp; viết feature, kịch bản broadcast, thông cáo báo chí, bài SEO/social.</li>
<li><strong>Sẵn sàng đi làm</strong> — kiểm chứng mọi thông tin, rà theo AP style, và soát rủi ro pháp lý/vu khống trước khi đăng.</li>
</ol></div>`,
  ]]);

const intro = doc('wmc201-0-1-overview', 'Course overview: Media Writing|||Tổng quan: Viết cho truyền thông',
  'Viết cho truyền thông là gì; 3 nguyên tắc lõi (rõ ràng, chính xác, súc tích); lộ trình 8 chương từ nguyên tắc → AP style → tin tức → feature → broadcast → PR → digital → đạo đức.',
  [[
    `<span class="eyebrow">WMC201 · Lesson 0.1 · Overview</span>
<h2>Media Writing</h2>
<p class="lead">This course teaches you to write for the media across every format a media professional actually works in: <strong>news</strong>, <strong>feature stories</strong>, <strong>broadcast scripts</strong>, <strong>public relations</strong>, and <strong>digital/social content</strong>. Every format shares the same three principles; only the packaging changes.</p>
<h3>The three core principles</h3>
<ul>
<li><strong>Clarity</strong> — one idea per sentence, plain words, no jargon the reader has to decode.</li>
<li><strong>Accuracy</strong> — every fact, name, number and quote checked against a source before it is published.</li>
<li><strong>Brevity</strong> — say it in as few words as the meaning allows; readers and viewers do not have unlimited attention.</li>
</ul>
<h3>Roadmap</h3>
<p>Principles &amp; audience (Ch.1) → grammar, style &amp; AP style editing standards (Ch.2) → news writing: inverted pyramid &amp; lead (Ch.3) → reporting, interviews &amp; feature writing (Ch.4) → broadcast writing (Ch.5) → public relations writing (Ch.6) → digital &amp; social writing (Ch.7) → ethics, verification &amp; final editing (Ch.8). Bilingual, with worked examples and quizzes.</p>
<div class="callout"><span class="badge">Why this matters</span> Whether you end up in a newsroom, a corporate comms team, or a marketing agency, the person who can turn a messy set of facts into a clear, accurate, brief piece of writing — fast, and under deadline — is the person editors and employers keep hiring.</div>`,
    `<span class="eyebrow">WMC201 · Bài 0.1 · Tổng quan</span>
<h2>Viết cho truyền thông</h2>
<p class="lead">Môn này dạy bạn viết cho truyền thông trên mọi định dạng mà người làm nghề thực sự dùng: <strong>tin tức</strong>, <strong>bài tường thuật/feature</strong>, <strong>kịch bản phát thanh - truyền hình</strong>, <strong>quan hệ công chúng</strong>, và <strong>nội dung digital/social</strong>. Mọi định dạng đều dùng chung ba nguyên tắc; chỉ cách đóng gói khác nhau.</p>
<h3>Ba nguyên tắc lõi</h3>
<ul>
<li><strong>Rõ ràng</strong> — mỗi câu một ý, dùng từ đơn giản, không thuật ngữ khiến người đọc phải "dịch".</li>
<li><strong>Chính xác</strong> — mọi tên riêng, số liệu, sự kiện và câu trích dẫn phải được kiểm chứng với nguồn trước khi đăng.</li>
<li><strong>Súc tích</strong> — nói vừa đủ ý bằng ít từ nhất có thể; người đọc/người xem không có sự chú ý vô hạn.</li>
</ul>
<h3>Lộ trình</h3>
<p>Nguyên tắc &amp; công chúng (Chg.1) → ngữ pháp, văn phong &amp; chuẩn biên tập AP style (Chg.2) → viết tin: kim tự tháp ngược &amp; lead (Chg.3) → tường thuật, phỏng vấn &amp; feature (Chg.4) → viết cho phát thanh - truyền hình (Chg.5) → viết quan hệ công chúng (Chg.6) → viết digital &amp; mạng xã hội (Chg.7) → đạo đức, kiểm chứng &amp; biên tập hoàn thiện (Chg.8). Song ngữ, có ví dụ mẫu và quiz.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Dù bạn làm ở phòng tin, phòng truyền thông doanh nghiệp, hay agency marketing, người biến được một mớ thông tin lộn xộn thành một bài viết rõ ràng, chính xác, súc tích — nhanh, đúng deadline — luôn là người biên tập viên và nhà tuyển dụng muốn giữ lại.</div>`,
  ]]);

const c1 = doc('wmc201-1-1-principles', '1.1 — Overview & principles of media writing|||1.1 — Tổng quan & nguyên tắc viết cho truyền thông',
  'Viết cho truyền thông khác viết học thuật; công chúng & mục đích quyết định cách viết; 3C (rõ ràng, chính xác, súc tích); kiểm tra "đọc thành tiếng".',
  [[
    `<span class="eyebrow">WMC201 · Chapter 1 · Lesson 1.1</span>
<h2>Overview &amp; principles of media writing</h2>
<h3>Media writing is not essay writing</h3>
<p>Academic writing builds toward a conclusion at the end. <strong>Media writing front-loads the point</strong> — the reader may stop after one paragraph, so the most important information has to come first. The reader is also busy, distracted, and free to leave at any moment; the writer has to earn attention line by line.</p>
<h3>Know your audience &amp; purpose first</h3>
<p>Before writing a single sentence, a media writer answers: <strong>who is this for</strong>, and <strong>what do I want them to do or know</strong> after reading/watching/listening? A press release for investors reads differently from a social caption for teenagers, even about the same event.</p>
<h3>The 3 C's</h3>
<ul>
<li><strong>Clear</strong> — plain words, one idea per sentence, no unexplained jargon.</li>
<li><strong>Correct</strong> — names, titles, numbers, dates and quotes are all verified, not assumed.</li>
<li><strong>Concise</strong> — every sentence earns its place; cut words that do not add meaning.</li>
</ul>
<pre><code>Before: The meeting, which was held on Tuesday afternoon at the
company headquarters, was attended by a total of approximately
fifty employees who came together to discuss the new policy.

After:  About 50 employees met Tuesday at headquarters to discuss
the new policy.
</code></pre>
<div class="callout"><span class="badge">Read it aloud</span> If a sentence is hard to say in one breath, it is hard to read. Reading your own draft aloud is the fastest way to catch bloated, unclear writing before an editor does.</div>`,
    `<span class="eyebrow">WMC201 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan &amp; nguyên tắc viết cho truyền thông</h2>
<h3>Viết cho truyền thông không phải viết luận</h3>
<p>Văn học thuật dồn kết luận về cuối bài. <strong>Viết cho truyền thông đưa ý quan trọng nhất lên đầu</strong> — người đọc có thể dừng sau đoạn đầu tiên, nên thông tin quan trọng nhất phải đến trước. Người đọc cũng đang bận, dễ mất tập trung, và có thể rời đi bất cứ lúc nào; người viết phải "giữ" được sự chú ý ở từng câu.</p>
<h3>Xác định công chúng &amp; mục đích trước</h3>
<p>Trước khi viết một câu nào, người viết truyền thông phải trả lời: <strong>bài này viết cho ai</strong>, và <strong>muốn họ làm gì hoặc biết gì</strong> sau khi đọc/xem/nghe? Một thông cáo báo chí cho nhà đầu tư viết khác một caption mạng xã hội cho học sinh, dù cùng một sự kiện.</p>
<h3>3 nguyên tắc "C"</h3>
<ul>
<li><strong>Rõ ràng (Clear)</strong> — từ đơn giản, mỗi câu một ý, không thuật ngữ chưa giải thích.</li>
<li><strong>Chính xác (Correct)</strong> — tên, chức danh, số liệu, ngày tháng và câu trích phải được xác minh, không phải đoán.</li>
<li><strong>Súc tích (Concise)</strong> — mỗi câu phải "đáng có mặt"; cắt những từ không thêm nghĩa.</li>
</ul>
<pre><code>Trước: Cuộc họp, được tổ chức vào chiều thứ Ba tại trụ sở công ty,
có sự tham dự của tổng cộng khoảng năm mươi nhân viên, những người
đã cùng nhau thảo luận về chính sách mới.

Sau:  Khoảng 50 nhân viên họp chiều thứ Ba tại trụ sở để thảo luận
chính sách mới.
</code></pre>
<div class="callout"><span class="badge">Đọc thành tiếng</span> Nếu một câu khó nói hết trong một hơi thở, nó cũng khó đọc. Đọc to bản thảo của mình là cách nhanh nhất để bắt lỗi câu dài dòng, không rõ ý trước khi biên tập viên phát hiện.</div>`,
  ]]);

const c1q = quiz('wmc201-quiz-1', 'Quiz 1 — Overview & principles|||Quiz 1 — Tổng quan & nguyên tắc', [
  { id: 'q1', question: 'Điểm khác biệt lớn nhất giữa viết truyền thông và viết luận học thuật là gì?', options: ['Viết truyền thông dùng câu dài hơn', 'Viết truyền thông đưa ý quan trọng nhất lên đầu', 'Viết truyền thông không cần kiểm chứng thông tin', 'Viết truyền thông không có công chúng cụ thể'], correctIndex: 1, explanation: 'Người đọc có thể dừng sau đoạn đầu, nên thông tin quan trọng phải đến trước, khác với văn luận dồn kết luận về cuối.' },
  { id: 'q2', question: '3 nguyên tắc "C" trong viết truyền thông là?', options: ['Clear, Correct, Concise', 'Clear, Creative, Colorful', 'Correct, Complex, Complete', 'Concise, Casual, Catchy'], correctIndex: 0, explanation: 'Rõ ràng (Clear), chính xác (Correct), súc tích (Concise) — ba nguyên tắc lõi xuyên suốt mọi định dạng.' },
  { id: 'q3', question: 'Vì sao nên đọc thành tiếng bản thảo trước khi nộp?', options: ['Để đếm số từ', 'Để bắt lỗi chính tả duy nhất', 'Vì câu khó nói trong một hơi thường cũng khó đọc, khó hiểu', 'Vì quy định của AP Stylebook'], correctIndex: 2, explanation: 'Đọc to lộ ra câu dài dòng, rối nghĩa — cách kiểm tra nhanh độ rõ ràng của câu.' },
]);

const c2 = doc('wmc201-2-1-grammar-ap-style', '2.1 — Grammar, style & editing standards (AP style)|||2.1 — Ngữ pháp, văn phong & chuẩn biên tập (AP style)',
  'Câu chủ động, câu ngắn; quy tắc AP style: số, ngày giờ, chức danh, viết tắt, dấu câu trích dẫn; vì sao một chuẩn dùng chung cho cả toà soạn.',
  [[
    `<span class="eyebrow">WMC201 · Chapter 2 · Lesson 2.1</span>
<h2>Grammar, style &amp; editing standards</h2>
<h3>Active voice, short sentences</h3>
<p>Media writing strongly prefers the <strong>active voice</strong> (subject does the action) over passive voice — it is shorter, clearer, and names who is responsible.</p>
<pre><code>Passive: The new policy was announced by the mayor.
Active:  The mayor announced the new policy.

Passive: Mistakes were made.
Active:  The department made three mistakes.
</code></pre>
<h3>What is a style guide, and why AP style</h3>
<p>A <strong>style guide</strong> is a shared rulebook so an entire newsroom writes numbers, titles and dates the same way — a reader should never notice ten different writers wrote a publication. <strong>The Associated Press Stylebook</strong> is the standard reference for American news writing.</p>
<h3>Common AP style rules</h3>
<ul>
<li><strong>Numbers</strong> — spell out one through nine (<em>three cars</em>); use numerals from 10 up (<em>12 cars</em>). Always use numerals for ages, percentages and dollar amounts.</li>
<li><strong>Titles</strong> — capitalize a formal title directly before a name (<em>President Tran</em>), lowercase when it follows or stands alone (<em>the president, Tran, said</em>).</li>
<li><strong>Dates</strong> — abbreviate the month when used with a specific day (<em>Jan. 5</em>), spell it out with no day (<em>January 2026</em>).</li>
<li><strong>Attribution punctuation</strong> — the comma goes inside the quotation mark: <em>"The results were strong," she said.</em></li>
</ul>
<div class="callout"><span class="badge">Consistency is the point</span> AP style is not about one rule being objectively better — it is about every writer in the same publication following one rule, so the reader is never distracted by inconsistency.</div>`,
    `<span class="eyebrow">WMC201 · Chương 2 · Bài 2.1</span>
<h2>Ngữ pháp, văn phong &amp; chuẩn biên tập</h2>
<h3>Câu chủ động, câu ngắn</h3>
<p>Viết truyền thông ưu tiên mạnh <strong>câu chủ động</strong> (chủ ngữ thực hiện hành động) hơn câu bị động — ngắn hơn, rõ hơn, và chỉ rõ ai chịu trách nhiệm.</p>
<pre><code>Bị động: Chính sách mới được thị trưởng công bố.
Chủ động: Thị trưởng công bố chính sách mới.

Bị động: Đã có những sai sót xảy ra.
Chủ động: Bộ phận này đã mắc ba sai sót.
</code></pre>
<h3>Style guide là gì, và vì sao dùng AP style</h3>
<p>Một <strong>style guide</strong> (sổ tay văn phong) là bộ quy tắc dùng chung để cả toà soạn viết số, chức danh và ngày tháng theo đúng một cách — người đọc không nên nhận ra một ấn phẩm do mười người viết khác nhau. <strong>The Associated Press Stylebook</strong> là chuẩn tham chiếu cho viết tin tiếng Anh ở Mỹ.</p>
<h3>Một số quy tắc AP style thường gặp</h3>
<ul>
<li><strong>Số</strong> — viết chữ cho một đến chín (<em>ba chiếc xe</em>); dùng số từ 10 trở lên (<em>12 chiếc xe</em>). Luôn dùng số cho tuổi, phần trăm và số tiền.</li>
<li><strong>Chức danh</strong> — viết hoa chức danh chính thức ngay trước tên (<em>Chủ tịch Trần</em>), viết thường khi đứng sau hoặc đứng riêng (<em>chủ tịch, ông Trần, nói</em>).</li>
<li><strong>Ngày tháng</strong> — viết tắt tên tháng khi đi kèm ngày cụ thể (<em>Jan. 5</em>), viết đầy đủ khi không kèm ngày (<em>January 2026</em>).</li>
<li><strong>Dấu câu khi trích dẫn</strong> — dấu phẩy đặt trong dấu ngoặc kép: <em>"Kết quả rất tốt," bà nói.</em></li>
</ul>
<div class="callout"><span class="badge">Nhất quán là mục đích</span> AP style không phải vì một quy tắc "đúng hơn" khách quan — mà vì mọi người viết trong cùng một ấn phẩm theo đúng một quy tắc, để người đọc không bị phân tâm bởi sự thiếu nhất quán.</div>`,
  ]]);

const c2q = quiz('wmc201-quiz-2', 'Quiz 2 — Grammar & AP style|||Quiz 2 — Ngữ pháp & AP style', [
  { id: 'q1', question: 'Câu nào viết theo lối chủ động?', options: ['Chính sách được công bố bởi thị trưởng.', 'Thị trưởng công bố chính sách.', 'Chính sách đã được công bố.', 'Việc công bố chính sách đã diễn ra.'], correctIndex: 1, explanation: 'Câu chủ động: chủ ngữ (thị trưởng) trực tiếp thực hiện hành động (công bố).' },
  { id: 'q2', question: 'Vì sao toà soạn dùng chung một style guide như AP Stylebook?', options: ['Vì luật pháp bắt buộc', 'Để mọi bài viết trông như do một người viết, nhất quán về số/ngày/chức danh', 'Để bài viết dài hơn', 'Để tránh phải kiểm chứng thông tin'], correctIndex: 1, explanation: 'Style guide đảm bảo tính nhất quán trong toàn ấn phẩm, không phải quy định "đúng" tuyệt đối.' },
  { id: 'q3', question: 'Theo AP style, dấu phẩy trong câu trích dẫn nên đặt ở đâu?', options: ['Ngoài dấu ngoặc kép', 'Trong dấu ngoặc kép', 'Không cần dấu phẩy', 'Thay bằng dấu chấm'], correctIndex: 1, explanation: 'Ví dụ AP style: "Kết quả rất tốt," bà nói — dấu phẩy nằm trong dấu ngoặc kép.' },
]);

const c3 = doc('wmc201-3-1-inverted-pyramid-lead', '3.1 — News writing: the inverted pyramid & the lead|||3.1 — Viết tin tức: kim tự tháp ngược & lead',
  'Kim tự tháp ngược (quan trọng nhất trước); 5W1H; lead tóm tắt (summary lead); nut graph; vì sao cấu trúc này giúp cắt bài từ dưới lên mà không mất ý chính.',
  [[
    `<span class="eyebrow">WMC201 · Chapter 3 · Lesson 3.1</span>
<h2>The inverted pyramid &amp; the lead</h2>
<h3>The inverted pyramid</h3>
<p>News stories are structured as an <strong>inverted pyramid</strong>: the most newsworthy information comes first, supporting details come next, and background/least-important details come last. This lets an editor cut a story from the bottom under a tight deadline without losing the point.</p>
<pre><code>MOST IMPORTANT   -> Lead (who/what/when/where/why/how)
                 -> Key supporting details, best quote
                 -> More context, secondary details
LEAST IMPORTANT  -> Background, minor details (safe to cut)
</code></pre>
<h3>The 5W1H</h3>
<p>Before writing the lead, a reporter answers: <strong>Who, What, When, Where, Why, How</strong>. Not every question needs to be in the lead sentence — only the most newsworthy 1-2 answer the "so what" of the story.</p>
<h3>The summary lead</h3>
<p>A <strong>summary lead</strong> is one clear sentence (ideally under 30 words) that tells readers the single most important fact.</p>
<pre><code>Weak:  A fire happened yesterday. It was at a warehouse. No one
       was hurt, which is good news for the city.

Strong: A warehouse fire in District 7 caused an estimated $2
       million in damage Tuesday night, but no injuries were
       reported, fire officials said.
</code></pre>
<h3>The nut graph</h3>
<p>When the lead cannot carry every fact, the second paragraph — the <strong>nut graph</strong> — explains why the story matters or fills in the next-most-important fact.</p>
<div class="callout"><span class="badge">One story, one lead</span> If you cannot summarize your story in one sentence, you have not decided yet what the story is actually about — go back to your notes before you write.</div>`,
    `<span class="eyebrow">WMC201 · Chương 3 · Bài 3.1</span>
<h2>Kim tự tháp ngược &amp; lead</h2>
<h3>Kim tự tháp ngược</h3>
<p>Tin tức được cấu trúc theo <strong>kim tự tháp ngược</strong>: thông tin đáng đưa tin nhất đến trước, chi tiết bổ trợ đến sau, và thông tin nền/ít quan trọng nhất đến cuối. Cách này giúp biên tập viên cắt bài từ dưới lên khi gấp deadline mà không mất ý chính.</p>
<pre><code>QUAN TRỌNG NHẤT  -> Lead (ai/gì/khi nào/ở đâu/vì sao/thế nào)
                 -> Chi tiết bổ trợ chính, câu trích hay nhất
                 -> Thêm bối cảnh, chi tiết thứ cấp
ÍT QUAN TRỌNG    -> Thông tin nền, chi tiết nhỏ (cắt được an toàn)
</code></pre>
<h3>5W1H</h3>
<p>Trước khi viết lead, phóng viên trả lời: <strong>Ai, Gì, Khi nào, Ở đâu, Vì sao, Thế nào</strong>. Không phải câu hỏi nào cũng cần vào câu lead — chỉ 1-2 câu trả lời đáng tin nhất trả lời được "vậy thì sao" của câu chuyện.</p>
<h3>Lead tóm tắt (summary lead)</h3>
<p>Một <strong>lead tóm tắt</strong> là một câu rõ ràng (lý tưởng dưới 30 từ) cho người đọc biết ngay sự thật quan trọng nhất.</p>
<pre><code>Yếu:   Hôm qua có một vụ cháy. Nó xảy ra ở một nhà kho. Không ai
       bị thương, đó là tin tốt cho thành phố.

Tốt:  Một vụ cháy nhà kho ở Quận 7 gây thiệt hại ước tính 2 triệu
       đô la tối thứ Ba, nhưng không có báo cáo thương vong, theo
       cơ quan phòng cháy.
</code></pre>
<h3>Nut graph</h3>
<p>Khi lead không đủ chỗ cho mọi sự thật, đoạn thứ hai — <strong>nut graph</strong> — giải thích vì sao câu chuyện quan trọng hoặc bổ sung sự thật quan trọng kế tiếp.</p>
<div class="callout"><span class="badge">Một tin, một lead</span> Nếu bạn không tóm được câu chuyện của mình trong một câu, có nghĩa bạn vẫn chưa quyết định câu chuyện thực sự nói về điều gì — quay lại ghi chú trước khi viết.</div>`,
  ]]);

const c3q = quiz('wmc201-quiz-3', 'Quiz 3 — Inverted pyramid & lead|||Quiz 3 — Kim tự tháp ngược & lead', [
  { id: 'q1', question: 'Trong cấu trúc kim tự tháp ngược, phần nào được đặt ở CUỐI bài?', options: ['Thông tin quan trọng nhất', 'Lead tóm tắt', 'Thông tin nền, chi tiết ít quan trọng nhất', 'Câu trích hay nhất'], correctIndex: 2, explanation: 'Cấu trúc này để chi tiết ít quan trọng nhất ở cuối, giúp biên tập viên cắt bài từ dưới lên khi thiếu chỗ.' },
  { id: 'q2', question: '5W1H gồm những yếu tố nào?', options: ['Ai, Gì, Khi nào, Ở đâu, Vì sao, Thế nào', 'Ai, Ở đâu, Bao lâu, Bao nhiêu, Thế nào, Gì', 'Gì, Vì sao, Thế nào, Ai, Bao nhiêu, Khi nào', 'Chỉ Ai và Gì'], correctIndex: 0, explanation: '5W1H = Who/What/When/Where/Why/How — bộ câu hỏi phóng viên trả lời trước khi viết lead.' },
  { id: 'q3', question: 'Nut graph dùng để làm gì?', options: ['Kết thúc bài viết', 'Giải thích vì sao câu chuyện quan trọng hoặc bổ sung sự thật kế tiếp sau lead', 'Ghi tên tác giả', 'Thay cho tiêu đề'], correctIndex: 1, explanation: 'Nut graph là đoạn (thường thứ hai) bổ sung ý nghĩa/chi tiết quan trọng mà lead không chứa hết.' },
]);

const c4 = doc('wmc201-4-1-reporting-interviews-feature', '4.1 — Reporting, interviews & feature writing|||4.1 — Viết bài tường thuật, phỏng vấn & feature',
  'Kỹ thuật phỏng vấn (câu hỏi mở, hỏi tiếp, ghi trích dẫn chính xác); lead tường thuật vs lead tin tức; kể chuyện bằng chi tiết, cảnh, chân dung nhân vật.',
  [[
    `<span class="eyebrow">WMC201 · Chapter 4 · Lesson 4.1</span>
<h2>Reporting, interviews &amp; feature writing</h2>
<h3>Interview technique</h3>
<ul>
<li><strong>Open-ended questions</strong> — ask "How did that make you feel?" instead of "Were you scared?"; open questions produce usable quotes, yes/no questions do not.</li>
<li><strong>Follow-up questions</strong> — the best quote often comes from the second or third question on a topic, not the first.</li>
<li><strong>Record accurately</strong> — a quote must match exactly what the source said; you may trim for length but never change meaning or wording.</li>
</ul>
<h3>Feature leads vs. news leads</h3>
<p>A news lead states the main fact immediately. A <strong>feature lead</strong> can be narrative — opening on a scene, a person, or an anecdote — before revealing the point, as long as it earns the reader's patience within a paragraph or two.</p>
<pre><code>News lead:    A local bakery closed permanently Monday after 40
              years, its owner said, citing rising rent.

Feature lead: Every morning at 5 a.m. for forty years, Mrs. Lan
              opened the same wooden door on Le Loi Street. On
              Monday, for the last time, she locked it instead.
</code></pre>
<h3>Storytelling elements &amp; the profile</h3>
<p>Feature writing uses <strong>scene-setting</strong> (concrete, sensory detail), <strong>anecdotes</strong> (a small true story that illustrates a larger point), and quotes that reveal character, not just facts. A <strong>profile</strong> builds a portrait of one person through their own words, actions and telling details rather than a list of biographical facts.</p>
<div class="callout"><span class="badge">Show, then tell</span> A quote or a concrete detail proving a point ("she still keeps the shop key on her keychain") is stronger than the writer simply asserting it ("she is sentimental about the shop").</div>`,
    `<span class="eyebrow">WMC201 · Chương 4 · Bài 4.1</span>
<h2>Viết bài tường thuật, phỏng vấn &amp; feature</h2>
<h3>Kỹ thuật phỏng vấn</h3>
<ul>
<li><strong>Câu hỏi mở</strong> — hỏi "Cảm giác của bạn lúc đó thế nào?" thay vì "Bạn có sợ không?"; câu hỏi mở tạo ra câu trích dùng được, câu hỏi có/không thì không.</li>
<li><strong>Câu hỏi hỏi tiếp (follow-up)</strong> — câu trích tốt nhất thường đến từ câu hỏi thứ hai, thứ ba về một chủ đề, không phải câu đầu tiên.</li>
<li><strong>Ghi chính xác</strong> — câu trích phải khớp đúng với điều nguồn nói; bạn có thể cắt gọn cho ngắn nhưng không được đổi nghĩa hay đổi từ ngữ.</li>
</ul>
<h3>Lead tường thuật so với lead tin tức</h3>
<p>Lead tin tức nói ngay sự thật chính. <strong>Lead tường thuật/feature</strong> có thể mang tính kể chuyện — mở đầu bằng một cảnh, một người, hoặc một mẩu chuyện nhỏ — trước khi bộc lộ ý chính, miễn là "xứng đáng" với sự kiên nhẫn của người đọc trong một hai đoạn đầu.</p>
<pre><code>Lead tin tức:   Một tiệm bánh địa phương đóng cửa vĩnh viễn hôm
                thứ Hai sau 40 năm, chủ tiệm cho biết, do tiền
                thuê tăng.

Lead tường thuật: Mỗi sáng 5 giờ trong suốt bốn mươi năm, bà Lan
                mở đúng cánh cửa gỗ ấy trên đường Lê Lợi. Thứ Hai
                này, lần cuối cùng, bà khoá nó lại.
</code></pre>
<h3>Yếu tố kể chuyện &amp; bài chân dung</h3>
<p>Viết feature dùng <strong>tả cảnh</strong> (chi tiết cụ thể, cảm giác), <strong>mẩu chuyện nhỏ (anecdote)</strong> (một câu chuyện có thật nhỏ minh hoạ cho ý lớn hơn), và câu trích bộc lộ tính cách, không chỉ dữ kiện. Một <strong>bài chân dung</strong> dựng bức tranh về một người qua chính lời họ nói, hành động và chi tiết đắt giá, thay vì liệt kê tiểu sử.</p>
<div class="callout"><span class="badge">Cho thấy, rồi mới kể</span> Một câu trích hoặc chi tiết cụ thể chứng minh một ý ("bà vẫn giữ chìa khoá tiệm trên vòng chìa khoá") mạnh hơn việc người viết tự khẳng định ("bà rất tình cảm với tiệm").</div>`,
  ]]);

const c4q = quiz('wmc201-quiz-4', 'Quiz 4 — Reporting, interviews & feature|||Quiz 4 — Tường thuật, phỏng vấn & feature', [
  { id: 'q1', question: 'Vì sao câu hỏi mở tốt hơn câu hỏi có/không khi phỏng vấn?', options: ['Vì hỏi nhanh hơn', 'Vì tạo ra câu trích dùng được, giàu chi tiết hơn', 'Vì nguồn dễ trả lời hơn', 'Vì không cần ghi âm'], correctIndex: 1, explanation: 'Câu hỏi mở (Cảm giác thế nào?) mời nguồn kể chi tiết, tạo câu trích hữu ích, khác câu hỏi có/không chỉ nhận "có" hoặc "không".' },
  { id: 'q2', question: 'Khi rút gọn một câu trích dẫn để đăng, người viết được phép làm gì?', options: ['Đổi từ ngữ cho hay hơn', 'Thêm ý mà nguồn chưa nói', 'Cắt cho ngắn nhưng không đổi nghĩa hay từ ngữ đã nói', 'Sửa lại toàn bộ câu theo văn phong của mình'], correctIndex: 2, explanation: 'Câu trích phải khớp đúng điều nguồn nói; chỉ được cắt gọn, không đổi nghĩa hoặc từ ngữ.' },
  { id: 'q3', question: 'Điểm khác chính giữa lead tin tức và lead tường thuật/feature là gì?', options: ['Lead tường thuật luôn ngắn hơn', 'Lead tin tức nói ngay sự thật chính; lead tường thuật có thể mở bằng cảnh/mẩu chuyện trước khi vào ý chính', 'Lead tin tức không cần chính xác', 'Không có khác biệt'], correctIndex: 1, explanation: 'Lead tin tức đưa thông tin quan trọng ngay; lead feature có thể kể chuyện, tả cảnh trước khi bộc lộ ý chính.' },
]);

const c5 = doc('wmc201-5-1-broadcast-writing', '5.1 — Writing for radio & television (broadcast writing)|||5.1 — Viết cho phát thanh - truyền hình',
  'Viết cho tai nghe: hiện tại, câu ngắn, chủ động; định dạng kịch bản (anchor intro, VO, SOT); tốc độ đọc & kiểm tra bằng đọc thành tiếng.',
  [[
    `<span class="eyebrow">WMC201 · Chapter 5 · Lesson 5.1</span>
<h2>Writing for radio &amp; television</h2>
<h3>Write for the ear, not the eye</h3>
<p>A print reader can re-read a confusing sentence; a broadcast viewer hears a script exactly once. Broadcast writing therefore uses: <strong>short sentences</strong> (one idea each), <strong>present or present-perfect tense</strong> where possible (sounds immediate: "Firefighters are battling..." rather than "Firefighters were battling..."), and simple <strong>subject-verb-object</strong> order — no long clauses the ear has to hold in memory.</p>
<h3>Script format</h3>
<p>Broadcast scripts mark who speaks and what plays, using conventions such as:</p>
<pre><code>ANCHOR (on cam):
  A warehouse fire tore through District 7 overnight.

VO (voice-over, video rolls, no anchor on screen):
  Firefighters arrived just after midnight and battled the blaze
  for nearly three hours.

SOT (sound on tape — a recorded interview clip plays):
  [Fire Chief Nguyen, 00:08] "We got everyone out safely, that
  was our first priority."

ANCHOR (on cam):
  No injuries were reported. Damage is estimated at two million
  dollars.
</code></pre>
<h3>Timing &amp; the read-aloud test</h3>
<p>Broadcast writers time scripts to seconds, not words — an average newsreader speaks roughly 150 words per minute. The only reliable way to check a script works is to <strong>read it aloud at speaking pace</strong>: if you stumble, the audience will hear it stumble too.</p>
<div class="callout"><span class="badge">One idea, one breath</span> If a sentence needs a comma to hold two ideas together, break it into two sentences — the ear cannot pause and re-parse the way the eye can.</div>`,
    `<span class="eyebrow">WMC201 · Chương 5 · Bài 5.1</span>
<h2>Viết cho phát thanh &amp; truyền hình</h2>
<h3>Viết cho tai nghe, không phải cho mắt đọc</h3>
<p>Người đọc báo in có thể đọc lại một câu khó hiểu; người xem truyền hình chỉ nghe kịch bản đúng một lần. Vì vậy viết broadcast dùng: <strong>câu ngắn</strong> (mỗi câu một ý), <strong>thời hiện tại hoặc hiện tại hoàn thành</strong> khi có thể (nghe tức thời hơn: "Lính cứu hoả đang chiến đấu..." thay vì "Lính cứu hoả đã chiến đấu..."), và trật tự <strong>chủ ngữ-động từ-tân ngữ</strong> đơn giản — không mệnh đề dài mà tai phải "giữ" trong đầu.</p>
<h3>Định dạng kịch bản</h3>
<p>Kịch bản broadcast đánh dấu ai nói và cái gì đang chạy, theo các quy ước như:</p>
<pre><code>ANCHOR (lên hình):
  Một vụ cháy nhà kho lan khắp Quận 7 trong đêm.

VO (voice-over, video chạy, không có người dẫn lên hình):
  Lính cứu hoả có mặt ngay sau nửa đêm và chiến đấu với ngọn lửa
  gần ba giờ.

SOT (sound on tape — đoạn phỏng vấn ghi hình được phát):
  [Trưởng phòng PCCC Nguyễn, 00:08] "Chúng tôi đưa được mọi người
  ra an toàn, đó là ưu tiên số một."

ANCHOR (lên hình):
  Không có báo cáo thương vong. Thiệt hại ước tính hai triệu đô.
</code></pre>
<h3>Tốc độ &amp; kiểm tra bằng đọc thành tiếng</h3>
<p>Người viết broadcast tính giờ kịch bản theo giây, không theo số từ — người đọc tin trung bình nói khoảng 150 từ/phút. Cách duy nhất đáng tin để kiểm tra kịch bản là <strong>đọc to theo tốc độ nói</strong>: nếu bạn vấp, người nghe cũng sẽ nghe thấy vấp.</p>
<div class="callout"><span class="badge">Một ý, một hơi</span> Nếu một câu cần dấu phẩy để giữ hai ý cùng nhau, hãy tách thành hai câu — tai không thể dừng lại và phân tích lại như mắt.</div>`,
  ]]);

const c5q = quiz('wmc201-quiz-5', 'Quiz 5 — Broadcast writing|||Quiz 5 — Viết cho phát thanh - truyền hình', [
  { id: 'q1', question: 'Vì sao broadcast writing ưu tiên câu ngắn, một ý mỗi câu?', options: ['Vì kịch bản phải ngắn để tiết kiệm giấy', 'Vì người nghe chỉ nghe kịch bản một lần, không thể "đọc lại" như báo in', 'Vì luật truyền hình quy định', 'Vì câu ngắn dễ dịch sang ngôn ngữ khác'], correctIndex: 1, explanation: 'Người xem/nghe chỉ tiếp nhận một lần, nên câu phải ngắn, rõ, một ý để tai dễ theo kịp.' },
  { id: 'q2', question: 'Trong kịch bản broadcast, "SOT" nghĩa là gì?', options: ['Người dẫn đọc trên hình, không có video', 'Đoạn video chạy không có tiếng người dẫn', 'Đoạn ghi âm/ghi hình phỏng vấn được phát (sound on tape)', 'Phần kết thúc bản tin'], correctIndex: 2, explanation: 'SOT = sound on tape, đoạn phỏng vấn/âm thanh ghi sẵn được phát trong bản tin.' },
  { id: 'q3', question: 'Cách kiểm tra đáng tin nhất để biết một kịch bản broadcast "chạy được" là gì?', options: ['Đếm số từ bằng máy', 'Đọc to kịch bản theo tốc độ nói thực tế', 'So sánh với kịch bản của đài khác', 'Kiểm tra ngữ pháp bằng Grammarly'], correctIndex: 1, explanation: 'Đọc to theo tốc độ nói là cách duy nhất phát hiện chỗ vấp mà người nghe thực sự sẽ nghe thấy.' },
]);

const c6 = doc('wmc201-6-1-pr-writing', '6.1 — Public relations writing (the press release)|||6.1 — Viết cho quan hệ công chúng (thông cáo báo chí)',
  'Cấu trúc thông cáo báo chí: tiêu đề, dateline, lead, thân bài kim tự tháp ngược, câu trích phát ngôn viên, boilerplate, thông tin liên hệ; pitch cho nhà báo.',
  [[
    `<span class="eyebrow">WMC201 · Chapter 6 · Lesson 6.1</span>
<h2>Public relations writing</h2>
<h3>The press release still uses the inverted pyramid</h3>
<p>A <strong>press release</strong> is written the same way as a news story — because a journalist may copy the lead almost unchanged. It needs a clear news angle, not just a company announcement dressed up as news.</p>
<pre><code>HEADLINE: States the news in one line.

DATELINE: CITY, Month Day, Year —

LEAD: The single most newsworthy fact, in one sentence.

BODY: Supporting details, in order of importance (inverted
      pyramid), including at least one quote from a company
      spokesperson that adds perspective, not just praise.

BOILERPLATE: A short, standard paragraph describing the company,
      reused release after release.

CONTACT: Name, title, email, phone — for a journalist to follow up.
</code></pre>
<h3>Quotes in a press release</h3>
<p>A useful spokesperson quote explains <em>why</em> something matters, not just that the company is happy. "This partnership lets us reach three times as many rural patients" is usable; "We are thrilled about this exciting milestone" is not — it says nothing a journalist can use.</p>
<h3>Pitching journalists</h3>
<p>A <strong>pitch</strong> (a short email to a specific journalist) states the news angle in the first line, explains in one line why it matters to that journalist's audience, and attaches the full release — it is never the release copy-pasted as the email body.</p>
<div class="callout"><span class="badge">PR still needs a real story</span> A press release that reads like an advertisement gets deleted. A press release that reads like a real news story gets covered.</div>`,
    `<span class="eyebrow">WMC201 · Chương 6 · Bài 6.1</span>
<h2>Viết cho quan hệ công chúng</h2>
<h3>Thông cáo báo chí vẫn dùng kim tự tháp ngược</h3>
<p>Một <strong>thông cáo báo chí</strong> được viết theo cách giống một tin tức — vì một nhà báo có thể sao gần như nguyên vẹn phần lead. Nó cần một góc tin thật, không chỉ là thông báo của công ty được "khoác áo" tin tức.</p>
<pre><code>TIÊU ĐỀ: Nêu tin chính trong một dòng.

DATELINE: THÀNH PHỐ, Ngày Tháng, Năm —

LEAD: Sự thật đáng đưa tin nhất, trong một câu.

THÂN BÀI: Chi tiết bổ trợ, theo thứ tự quan trọng (kim tự tháp
      ngược), gồm ít nhất một câu trích của phát ngôn viên công
      ty góp thêm góc nhìn, không chỉ là lời khen.

BOILERPLATE: Một đoạn ngắn, chuẩn hoá mô tả công ty, dùng lại
      cho mọi thông cáo.

LIÊN HỆ: Tên, chức danh, email, điện thoại — để nhà báo hỏi thêm.
</code></pre>
<h3>Câu trích trong thông cáo báo chí</h3>
<p>Một câu trích phát ngôn viên có ích giải thích <em>vì sao</em> điều đó quan trọng, không chỉ nói công ty đang vui. "Sự hợp tác này giúp chúng tôi tiếp cận gấp ba số bệnh nhân vùng nông thôn" là dùng được; "Chúng tôi rất phấn khích về cột mốc thú vị này" thì không — nó không nói được điều gì nhà báo có thể dùng.</p>
<h3>Pitch cho nhà báo</h3>
<p>Một <strong>pitch</strong> (email ngắn gửi cho một nhà báo cụ thể) nêu góc tin ngay dòng đầu, giải thích trong một câu vì sao nó quan trọng với công chúng của nhà báo đó, và đính kèm thông cáo đầy đủ — không bao giờ dán nguyên thông cáo làm nội dung email.</p>
<div class="callout"><span class="badge">PR vẫn cần một câu chuyện thật</span> Một thông cáo đọc như quảng cáo sẽ bị xoá. Một thông cáo đọc như tin tức thật sẽ được đưa tin.</div>`,
  ]]);

const c6q = quiz('wmc201-quiz-6', 'Quiz 6 — PR writing|||Quiz 6 — Viết PR', [
  { id: 'q1', question: 'Vì sao thông cáo báo chí nên viết theo cấu trúc kim tự tháp ngược?', options: ['Vì quy định pháp luật', 'Vì nhà báo có thể sao gần nguyên vẹn phần lead để dùng', 'Vì thông cáo phải càng dài càng tốt', 'Vì không cần thông tin liên hệ'], correctIndex: 1, explanation: 'Viết như tin tức giúp nhà báo dễ sử dụng lại nội dung, tăng khả năng được đưa tin.' },
  { id: 'q2', question: 'Câu trích phát ngôn viên nào HỮU ÍCH nhất cho một thông cáo báo chí?', options: ['"Chúng tôi rất phấn khích về cột mốc thú vị này."', '"Sự hợp tác này giúp chúng tôi tiếp cận gấp ba số bệnh nhân vùng nông thôn."', '"Cảm ơn tất cả mọi người đã hỗ trợ."', '"Đây là một ngày tuyệt vời của công ty."'], correctIndex: 1, explanation: 'Câu trích hữu ích giải thích vì sao sự kiện quan trọng, có số liệu/góc nhìn cụ thể, không chỉ là lời khen chung.' },
  { id: 'q3', question: 'Một pitch gửi nhà báo nên bắt đầu bằng gì?', options: ['Toàn văn thông cáo báo chí dán vào email', 'Lời chào dài giới thiệu công ty', 'Góc tin chính ngay dòng đầu', 'Danh sách các thông cáo trước đó'], correctIndex: 2, explanation: 'Pitch hiệu quả nêu góc tin ngay dòng đầu, giải thích ngắn vì sao quan trọng với công chúng của nhà báo đó, rồi đính kèm thông cáo đầy đủ.' },
]);

const c7 = doc('wmc201-7-1-digital-social-writing', '7.1 — Writing for digital & social media|||7.1 — Viết cho digital & mạng xã hội',
  'Viết SEO (từ khoá, meta description), tối ưu headline, microcontent (caption, thông báo đẩy), giọng theo từng nền tảng, viết dễ lướt (subhead, bullet, đoạn ngắn).',
  [[
    `<span class="eyebrow">WMC201 · Chapter 7 · Lesson 7.1</span>
<h2>Writing for digital &amp; social media</h2>
<h3>Writing for search (SEO)</h3>
<p>SEO writing puts the words a reader would actually type into a search bar into the <strong>headline</strong>, the <strong>first paragraph</strong>, and the <strong>meta description</strong> (the short summary shown under a search result) — without turning the sentence into an awkward list of keywords.</p>
<pre><code>Weak SEO headline: Big News About A Popular App Update

Better SEO headline: [App Name] 2.0 Update: What's New, and How
                     to Download It
</code></pre>
<h3>Headlines that inform, not just bait</h3>
<p>A headline should tell readers enough to know whether the article is relevant to them. <strong>Clickbait</strong> (a headline that withholds the point to force a click, e.g. "You Won't Believe What Happened Next") damages a publication's trust over time; an <strong>informative headline</strong> earns clicks from readers who actually want the story.</p>
<h3>Microcontent &amp; platform tone</h3>
<p>A social caption, a push notification, and a video title are all <strong>microcontent</strong> — a few words that have to work on their own, often before the full piece is even seen. Tone shifts by platform (a professional network reads differently from a short-video app), but the underlying rule stays the same: lead with the one fact or hook that matters most.</p>
<h3>Writing to be scanned</h3>
<p>Most web readers scan rather than read line by line. Use <strong>short paragraphs</strong>, <strong>subheadings</strong>, and <strong>bullet lists</strong> so a reader can find the part relevant to them without reading everything.</p>
<div class="callout"><span class="badge">The click is not the goal</span> A headline that earns a click but disappoints the reader loses trust for the next headline. Write headlines that are accurate first, compelling second.</div>`,
    `<span class="eyebrow">WMC201 · Chương 7 · Bài 7.1</span>
<h2>Viết cho digital &amp; mạng xã hội</h2>
<h3>Viết cho tìm kiếm (SEO)</h3>
<p>Viết SEO đặt những từ mà người đọc thực sự sẽ gõ vào ô tìm kiếm vào <strong>tiêu đề</strong>, <strong>đoạn đầu</strong>, và <strong>meta description</strong> (đoạn tóm tắt ngắn hiện dưới kết quả tìm kiếm) — mà không biến câu văn thành một danh sách từ khoá gượng gạo.</p>
<pre><code>Tiêu đề SEO yếu: Tin Lớn Về Bản Cập Nhật Của Một Ứng Dụng Phổ Biến

Tiêu đề SEO tốt hơn: Cập nhật [Tên app] 2.0: Có gì mới và cách
                     tải về
</code></pre>
<h3>Tiêu đề nên thông tin, không chỉ "câu view"</h3>
<p>Một tiêu đề nên cho người đọc biết đủ để họ quyết định bài viết có liên quan đến mình không. <strong>Clickbait</strong> (tiêu đề giữ lại ý chính để buộc người đọc phải bấm vào, ví dụ "Bạn Sẽ Không Tin Điều Xảy Ra Tiếp Theo") làm giảm niềm tin vào ấn phẩm theo thời gian; một <strong>tiêu đề thông tin</strong> thu hút cú click từ người thực sự muốn đọc câu chuyện.</p>
<h3>Microcontent &amp; giọng theo nền tảng</h3>
<p>Một caption mạng xã hội, một thông báo đẩy, hay tên một video đều là <strong>microcontent</strong> — vài từ phải "tự đứng vững", thường trước khi người đọc thấy toàn bộ nội dung. Giọng viết thay đổi theo nền tảng (một mạng xã hội chuyên nghiệp đọc khác một app video ngắn), nhưng quy tắc nền vẫn vậy: đưa lên trước sự thật hoặc điểm nhấn quan trọng nhất.</p>
<h3>Viết để được lướt qua</h3>
<p>Hầu hết người đọc web lướt qua chứ không đọc từng dòng. Dùng <strong>đoạn văn ngắn</strong>, <strong>tiêu đề phụ (subhead)</strong>, và <strong>danh sách gạch đầu dòng</strong> để người đọc tìm đúng phần liên quan đến mình mà không cần đọc hết.</p>
<div class="callout"><span class="badge">Cú click không phải mục tiêu cuối</span> Một tiêu đề "câu" được click nhưng làm người đọc thất vọng sẽ làm mất niềm tin cho tiêu đề tiếp theo. Viết tiêu đề chính xác trước, hấp dẫn sau.</div>`,
  ]]);

const c7q = quiz('wmc201-quiz-7', 'Quiz 7 — Digital & social writing|||Quiz 7 — Viết digital & mạng xã hội', [
  { id: 'q1', question: 'Viết SEO nên đặt từ khoá người đọc thực sự tìm ở đâu?', options: ['Chỉ trong đường link URL', 'Tiêu đề, đoạn đầu và meta description', 'Chỉ trong ảnh minh hoạ', 'Ở cuối bài, sau khi đã trình bày hết nội dung'], correctIndex: 1, explanation: 'SEO writing đặt từ khoá tự nhiên vào tiêu đề, đoạn đầu và meta description để bài dễ được tìm thấy.' },
  { id: 'q2', question: 'Vì sao clickbait gây hại cho ấn phẩm về lâu dài?', options: ['Vì tốn nhiều chữ hơn', 'Vì tiêu đề giữ lại ý chính khiến người đọc thất vọng, làm giảm niềm tin', 'Vì SEO không thích từ dài', 'Vì clickbait luôn sai sự thật'], correctIndex: 1, explanation: 'Clickbait câu click bằng cách che ý chính; người đọc cảm thấy bị "lừa" và mất niềm tin vào các tiêu đề sau.' },
  { id: 'q3', question: 'Cách viết nào giúp người đọc web LƯỚT bài dễ hơn?', options: ['Một đoạn văn dài liên tục, không xuống dòng', 'Đoạn ngắn, tiêu đề phụ, danh sách gạch đầu dòng', 'Bỏ hết tiêu đề phụ để bài "gọn"', 'Viết toàn bộ bài bằng chữ in hoa'], correctIndex: 1, explanation: 'Đoạn ngắn, subhead và bullet list giúp người đọc tìm nhanh phần liên quan mà không phải đọc hết.' },
]);

const c8 = doc('wmc201-8-1-ethics-verification-editing', '8.1 — Ethics, fact-checking & final editing|||8.1 — Đạo đức, kiểm chứng thông tin & biên tập hoàn thiện',
  'Nguyên tắc đạo đức báo chí (chính xác, công bằng, không đạo văn); kiểm chứng bằng nhiều nguồn độc lập; danh sách kiểm biên tập cuối trước khi đăng.',
  [[
    `<span class="eyebrow">WMC201 · Chapter 8 · Lesson 8.1</span>
<h2>Ethics, fact-checking &amp; final editing</h2>
<h3>Core ethical principles</h3>
<ul>
<li><strong>Accuracy</strong> — never publish a fact you have not verified, even under deadline pressure.</li>
<li><strong>Fairness</strong> — give every party mentioned in a controversy a genuine opportunity to respond before publication.</li>
<li><strong>No plagiarism</strong> — every fact, phrase or idea taken from another source is attributed; copying someone else's words or reporting as your own is a firing offense in any newsroom.</li>
<li><strong>Attribution</strong> — a claim you did not witness or verify yourself needs a named, credible source (<em>"police said"</em>, <em>"according to the report"</em>) — not left to sound like your own knowledge.</li>
</ul>
<h3>Verifying information</h3>
<p>A single source is rarely enough for a significant claim. Reporters look for <strong>at least two independent sources</strong> that confirm the same fact without having copied each other, and check original documents (records, reports, data) instead of trusting a secondhand summary.</p>
<h3>Final editing checklist</h3>
<pre><code>Before publishing, check:
[ ] Every name, title, number and date verified against a source
[ ] Every quote matches exactly what was said
[ ] AP style applied consistently (numbers, titles, dates, punctuation)
[ ] Read aloud once for clarity and flow
[ ] Legal/libel risk: any claim that could defame someone has
    solid, documented evidence behind it
[ ] Headline accurately reflects the story body
</code></pre>
<div class="callout"><span class="badge">Correcting mistakes</span> Every credible publication corrects errors publicly and promptly rather than quietly editing them away — the correction itself is part of maintaining trust.</div>`,
    `<span class="eyebrow">WMC201 · Chương 8 · Bài 8.1</span>
<h2>Đạo đức, kiểm chứng thông tin &amp; biên tập hoàn thiện</h2>
<h3>Nguyên tắc đạo đức lõi</h3>
<ul>
<li><strong>Chính xác</strong> — không bao giờ đăng một sự thật chưa được kiểm chứng, dù đang gấp deadline.</li>
<li><strong>Công bằng</strong> — cho mọi bên được nêu trong một vấn đề tranh cãi cơ hội thực sự để phản hồi trước khi đăng.</li>
<li><strong>Không đạo văn</strong> — mọi sự thật, câu chữ hay ý tưởng lấy từ nguồn khác đều phải ghi nguồn; chép lời hoặc bài viết của người khác thành của mình là lỗi có thể bị đuổi việc ở bất kỳ toà soạn nào.</li>
<li><strong>Ghi nguồn (attribution)</strong> — một thông tin bạn không tận mắt kiểm chứng cần một nguồn có tên, đáng tin (<em>"cảnh sát cho biết"</em>, <em>"theo báo cáo"</em>) — không để nghe như kiến thức của chính bạn.</li>
</ul>
<h3>Kiểm chứng thông tin</h3>
<p>Một nguồn duy nhất hiếm khi đủ cho một tuyên bố quan trọng. Phóng viên tìm <strong>ít nhất hai nguồn độc lập</strong> xác nhận cùng một sự thật mà không sao chép lẫn nhau, và kiểm tra tài liệu gốc (hồ sơ, báo cáo, dữ liệu) thay vì tin vào một bản tóm tắt gián tiếp.</p>
<h3>Danh sách kiểm biên tập cuối cùng</h3>
<pre><code>Trước khi đăng, kiểm tra:
[ ] Mọi tên, chức danh, số liệu, ngày tháng đã được xác minh với nguồn
[ ] Mọi câu trích khớp đúng với điều đã nói
[ ] Đã áp dụng AP style nhất quán (số, chức danh, ngày, dấu câu)
[ ] Đọc to một lần để kiểm độ rõ và mạch văn
[ ] Rủi ro pháp lý/vu khống: mọi tuyên bố có thể xúc phạm ai đó
    đều có bằng chứng vững, có ghi lại
[ ] Tiêu đề phản ánh đúng nội dung bài viết
</code></pre>
<div class="callout"><span class="badge">Sửa lỗi công khai</span> Mọi ấn phẩm đáng tin đều sửa lỗi công khai và nhanh chóng, không lặng lẽ chỉnh sửa rồi thôi — chính việc sửa lỗi công khai là một phần giữ niềm tin của người đọc.</div>`,
  ]]);

const c8q = quiz('wmc201-quiz-8', 'Quiz 8 — Ethics & final editing|||Quiz 8 — Đạo đức & biên tập hoàn thiện', [
  { id: 'q1', question: 'Vì sao một nguồn duy nhất thường không đủ cho một tuyên bố quan trọng?', options: ['Vì luật pháp cấm dùng một nguồn', 'Vì cần ít nhất hai nguồn độc lập xác nhận để giảm rủi ro sai sự thật', 'Vì một nguồn luôn nói dối', 'Vì độc giả không tin một nguồn'], correctIndex: 1, explanation: 'Hai nguồn độc lập không sao chép lẫn nhau giúp xác nhận sự thật đáng tin hơn một nguồn duy nhất.' },
  { id: 'q2', question: 'Khi phát hiện một bài đã đăng có lỗi sai sự thật, cách xử lý đúng là gì?', options: ['Lặng lẽ sửa lại, không nói gì', 'Xoá bài để không ai thấy lỗi', 'Sửa lỗi công khai và nhanh chóng', 'Chờ đến khi có ai phàn nàn mới sửa'], correctIndex: 2, explanation: 'Ấn phẩm đáng tin công khai sửa lỗi và thông báo rõ, việc này giúp giữ niềm tin của người đọc.' },
  { id: 'q3', question: 'Dùng lại câu chữ hoặc thông tin của người khác mà không ghi nguồn gọi là gì, và hậu quả thường thấy trong nghề?', options: ['Biên tập; không có hậu quả', 'Đạo văn; có thể bị đuổi việc ở toà soạn', 'Kiểm chứng; được khen ngợi', 'Attribution; là yêu cầu bắt buộc và tốt'], correctIndex: 1, explanation: 'Đây là đạo văn (plagiarism) — vi phạm đạo đức nghề nghiêm trọng, có thể dẫn đến bị đuổi việc.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'WMC201',
    slug: 'wmc201-media-writing',
    title: 'Media Writing',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/WMC201.webp',
    shortDescription: 'How to write for the media: clarity/accuracy/brevity, AP style grammar & editing, news writing (inverted pyramid & lead), interviews & feature writing, broadcast scripts, PR press releases, digital/social & SEO, ethics & fact-checking.|||Viết cho truyền thông: rõ ràng/chính xác/súc tích, ngữ pháp & biên tập AP style, viết tin (kim tự tháp ngược & lead), phỏng vấn & feature, kịch bản broadcast, thông cáo PR, digital/social & SEO, đạo đức & kiểm chứng thông tin.',
    description: 'Môn <strong>WMC201 — Media Writing</strong> (kỳ 3, khối Quản trị Kinh doanh) dạy viết cho truyền thông từ gốc: <strong>nguyên tắc rõ ràng/chính xác/súc tích</strong> → <strong>ngữ pháp &amp; AP style</strong> → <strong>viết tin theo kim tự tháp ngược &amp; lead</strong> → <strong>tường thuật, phỏng vấn &amp; feature</strong> → <strong>viết cho phát thanh - truyền hình</strong> → <strong>viết quan hệ công chúng (PR)</strong> → <strong>viết digital &amp; mạng xã hội</strong> → <strong>đạo đức, kiểm chứng thông tin &amp; biên tập hoàn thiện</strong>. Bám giáo trình FLM và các sách tham khảo kinh điển của ngành (Rich; Whitaker/Ramsey/Smith; AP Stylebook), song ngữ, có ví dụ mẫu và quiz mỗi chương.',
    whatYouLearn: 'Nguyên tắc 3C (rõ ràng, chính xác, súc tích); câu chủ động & chuẩn AP style (số, chức danh, ngày, dấu câu); kim tự tháp ngược, 5W1H, lead tóm tắt, nut graph; kỹ thuật phỏng vấn & lead tường thuật/feature, kể chuyện bằng chi tiết; viết kịch bản broadcast (anchor/VO/SOT), viết cho tai nghe; viết thông cáo báo chí & pitch nhà báo; viết SEO, headline, microcontent & viết dễ lướt cho web/social; đạo đức báo chí, kiểm chứng đa nguồn, danh sách kiểm biên tập cuối.',
    requirements: 'Không yêu cầu kiến thức chuyên ngành trước đó. Nên đọc trước một vài bài báo/thông cáo báo chí thật để quan sát cấu trúc trong thực tế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách tham khảo, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Viết cho truyền thông là gì, 3 nguyên tắc lõi, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & nguyên tắc|||Chapter 1 — Overview & principles', description: 'Công chúng & mục đích, 3C, đọc thành tiếng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Ngữ pháp & AP style|||Chapter 2 — Grammar & AP style', description: 'Câu chủ động, quy tắc AP style.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Viết tin tức|||Chapter 3 — News writing', description: 'Kim tự tháp ngược, 5W1H, lead, nut graph.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tường thuật, phỏng vấn & feature|||Chapter 4 — Reporting, interviews & feature', description: 'Kỹ thuật phỏng vấn, lead feature, kể chuyện.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Viết cho phát thanh - truyền hình|||Chapter 5 — Broadcast writing', description: 'Viết cho tai nghe, định dạng kịch bản, tốc độ đọc.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Viết quan hệ công chúng|||Chapter 6 — Public relations writing', description: 'Thông cáo báo chí, câu trích, pitch nhà báo.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Viết digital & mạng xã hội|||Chapter 7 — Digital & social writing', description: 'SEO, headline, microcontent, viết dễ lướt.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đạo đức & biên tập hoàn thiện|||Chapter 8 — Ethics & final editing', description: 'Kiểm chứng đa nguồn, danh sách kiểm biên tập.', lessons: [c8, c8q] },
  ],
};
