/**
 * SSG105 — Communication and In-Group Working Skills (Kỳ 4, SE FPTU).
 * Kỹ năng giao tiếp & làm việc nhóm: mô hình giao tiếp, lắng nghe chủ động,
 * giao tiếp văn bản, thuyết trình, làm việc nhóm (Belbin/Tuckman), giải quyết
 * xung đột (Thomas-Kilmann), lãnh đạo, họp hiệu quả, giao tiếp đa văn hoá & đạo đức.
 * Song ngữ + ví dụ tình huống + quiz. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ content PHẢI là STRING. KHÔNG backtick lồng / KHÔNG ${ } trong HTML; "&"→"&amp;".
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ssg105-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (Crucial Conversations, Carnegie, Covey — kèm link), tài liệu miễn phí (MindTools, Coursera, HBR), YouTube (TED, Alex Lyon), công cụ cộng tác, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">SSG105 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to build strong <strong>communication and teamwork skills</strong> — from the models behind good conversations to running effective meetings — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources you can start today.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for SSG105 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account to get the exact learning outcomes and assessment.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.harpercollins.com/products/crucial-conversations-third-edition-joseph-grannykerry-pattersonron-mcmillanal-switzleremily-gregory" target="_blank" rel="noopener"><em>Crucial Conversations</em> — Patterson, Grenny, McMillan &amp; Switzler (HarperCollins)</a> — talking when stakes are high.</li>
<li><a href="https://www.simonandschuster.com/books/How-to-Win-Friends-and-Influence-People/Dale-Carnegie/9780671027032" target="_blank" rel="noopener"><em>How to Win Friends and Influence People</em> — Dale Carnegie (Simon &amp; Schuster)</a> — timeless people skills.</li>
<li><a href="https://www.simonandschuster.com/books/The-7-Habits-of-Highly-Effective-People/Stephen-R-Covey/9781982137274" target="_blank" rel="noopener"><em>The 7 Habits of Highly Effective People</em> — Stephen R. Covey (Simon &amp; Schuster)</a> — "seek first to understand, then to be understood".</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.mindtools.com/pages/main/newMN_CS.htm" target="_blank" rel="noopener">MindTools — Communication skills</a> — bite-sized, practical articles.</li>
<li><a href="https://www.coursera.org/courses?query=soft%20skills" target="_blank" rel="noopener">Coursera — soft-skills courses</a> — audit for free (communication, teamwork, leadership).</li>
<li><a href="https://hbr.org/topic/communication" target="_blank" rel="noopener">Harvard Business Review — Communication</a> — case-driven articles from practitioners.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED &amp; TED Talks</a> — the best public speaking on earth; study delivery, structure, story.</li>
<li><a href="https://www.youtube.com/@AlexLyon" target="_blank" rel="noopener">Communication Coach Alex Lyon</a> — clear, actionable communication &amp; leadership tips.</li>
</ul>
<h3>🛠️ Collaboration tools</h3>
<ul>
<li><a href="https://slack.com/" target="_blank" rel="noopener">Slack</a> — team chat &amp; async communication.</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — shared task boards, who-does-what.</li>
<li><a href="https://meet.google.com/" target="_blank" rel="noopener">Google Meet</a> — video meetings &amp; remote collaboration.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the communication model (sender → message → receiver → feedback), verbal vs non-verbal, and active listening.</li>
<li><strong>Practice</strong> — write clearer emails and messages; record yourself giving a 3-minute talk and review it.</li>
<li><strong>Go deeper</strong> — team roles (Belbin), team stages (Tuckman), conflict styles (Thomas-Kilmann), running meetings.</li>
<li><strong>Job-ready</strong> — give constructive feedback, work across cultures, and lead a small group to a shared goal.</li>
</ol></div>`,
    `<span class="eyebrow">SSG105 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để rèn <strong>kỹ năng giao tiếp và làm việc nhóm</strong> — từ mô hình đằng sau một cuộc trò chuyện tốt đến cách điều hành cuộc họp hiệu quả — gom về một chỗ. Slide &amp; đề cương chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, bắt đầu học được ngay.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đề cương FPTU &amp; slide bài giảng chính thức của SSG105 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU để biết chuẩn đầu ra và cách đánh giá chính xác.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.harpercollins.com/products/crucial-conversations-third-edition-joseph-grannykerry-pattersonron-mcmillanal-switzleremily-gregory" target="_blank" rel="noopener"><em>Crucial Conversations</em> — Patterson, Grenny, McMillan &amp; Switzler (HarperCollins)</a> — nói chuyện khi tình huống căng thẳng, rủi ro cao.</li>
<li><a href="https://www.simonandschuster.com/books/How-to-Win-Friends-and-Influence-People/Dale-Carnegie/9780671027032" target="_blank" rel="noopener"><em>How to Win Friends and Influence People</em> — Dale Carnegie (Simon &amp; Schuster)</a> — kỹ năng đối nhân xử thế kinh điển.</li>
<li><a href="https://www.simonandschuster.com/books/The-7-Habits-of-Highly-Effective-People/Stephen-R-Covey/9781982137274" target="_blank" rel="noopener"><em>The 7 Habits of Highly Effective People</em> — Stephen R. Covey (Simon &amp; Schuster)</a> — "hiểu người trước, rồi mới mong được hiểu".</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.mindtools.com/pages/main/newMN_CS.htm" target="_blank" rel="noopener">MindTools — Kỹ năng giao tiếp</a> — bài viết ngắn gọn, thực dụng.</li>
<li><a href="https://www.coursera.org/courses?query=soft%20skills" target="_blank" rel="noopener">Coursera — khoá kỹ năng mềm</a> — học miễn phí dạng audit (giao tiếp, làm việc nhóm, lãnh đạo).</li>
<li><a href="https://hbr.org/topic/communication" target="_blank" rel="noopener">Harvard Business Review — Communication</a> — bài viết theo tình huống thực từ người làm nghề.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED &amp; TED Talks</a> — kho thuyết trình hay nhất thế giới; học cách trình bày, cấu trúc, kể chuyện.</li>
<li><a href="https://www.youtube.com/@AlexLyon" target="_blank" rel="noopener">Communication Coach Alex Lyon</a> — mẹo giao tiếp &amp; lãnh đạo rõ ràng, làm được ngay.</li>
</ul>
<h3>🛠️ Công cụ cộng tác</h3>
<ul>
<li><a href="https://slack.com/" target="_blank" rel="noopener">Slack</a> — chat nhóm &amp; giao tiếp bất đồng bộ.</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — bảng công việc chung, ai làm việc gì.</li>
<li><a href="https://meet.google.com/" target="_blank" rel="noopener">Google Meet</a> — họp video &amp; cộng tác từ xa.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — mô hình giao tiếp (người gửi → thông điệp → người nhận → phản hồi), lời &amp; phi ngôn ngữ, lắng nghe chủ động.</li>
<li><strong>Luyện tập</strong> — viết email và tin nhắn rõ ràng hơn; quay lại phần nói 3 phút của mình và tự xem lại.</li>
<li><strong>Đào sâu</strong> — vai trò nhóm (Belbin), giai đoạn nhóm (Tuckman), phong cách xung đột (Thomas-Kilmann), điều hành họp.</li>
<li><strong>Sẵn sàng đi làm</strong> — phản hồi mang tính xây dựng, làm việc đa văn hoá, dẫn dắt một nhóm nhỏ tới mục tiêu chung.</li>
</ol></div>`,
  ]]);

const intro = doc('ssg105-0-1-overview', 'Course overview: Communication & teamwork|||Tổng quan: Giao tiếp & làm việc nhóm',
  'Vì sao kỹ năng mềm quyết định sự nghiệp kỹ sư phần mềm; lộ trình 9 chương từ mô hình giao tiếp → lắng nghe → văn bản → thuyết trình → làm việc nhóm → xung đột → lãnh đạo → họp → đa văn hoá & đạo đức.',
  [[
    `<span class="eyebrow">SSG105 · Lesson 0.1 · Overview</span>
<h2>Communication &amp; In-Group Working Skills</h2>
<p class="lead">Technical skill gets you hired; <strong>communication and teamwork keep you promoted</strong>. Software is built by teams, and studies of engineering careers repeatedly find that the ability to explain ideas, listen well, and work with others predicts success as strongly as coding ability. This course makes those skills concrete and practiceable.</p>
<h3>Why this matters for a software engineer</h3>
<ul>
<li><strong>You never build alone.</strong> Requirements, code review, stand-ups, demos — every step is a conversation.</li>
<li><strong>Clarity is a feature.</strong> A clear email, ticket, or pull-request description saves hours of your teammates' time.</li>
<li><strong>Conflict is normal.</strong> The goal is not to avoid disagreement but to resolve it well and keep the team moving.</li>
</ul>
<h3>Roadmap — 9 chapters</h3>
<p>The communication model → active listening &amp; empathy → written communication → presentations → teamwork (roles &amp; stages) → conflict &amp; negotiation → leadership &amp; motivation → effective meetings → cross-cultural, ethical communication &amp; constructive feedback. Each chapter is bilingual, with real situations and a short quiz.</p>
<div class="callout"><span class="badge">How to get the most from it</span> Don't just read — practise. After every chapter, pick one small thing (a clearer message, one active-listening question) and use it the same day in a real group chat, class project, or stand-up.</div>`,
    `<span class="eyebrow">SSG105 · Bài 0.1 · Tổng quan</span>
<h2>Kỹ năng giao tiếp &amp; làm việc nhóm</h2>
<p class="lead">Kỹ năng kỹ thuật giúp bạn được nhận việc; <strong>giao tiếp và làm việc nhóm giúp bạn được thăng tiến</strong>. Phần mềm do đội ngũ làm ra, và nhiều nghiên cứu về sự nghiệp kỹ sư đều cho thấy: khả năng trình bày ý tưởng, lắng nghe tốt và phối hợp với người khác dự báo thành công mạnh không kém khả năng lập trình. Môn này biến những kỹ năng đó thành thứ cụ thể, luyện được.</p>
<h3>Vì sao điều này quan trọng với kỹ sư phần mềm</h3>
<ul>
<li><strong>Bạn không bao giờ làm một mình.</strong> Lấy yêu cầu, review code, họp stand-up, demo — bước nào cũng là một cuộc trò chuyện.</li>
<li><strong>Rõ ràng là một tính năng.</strong> Một email, ticket hay mô tả pull request rõ ràng tiết kiệm hàng giờ cho đồng đội.</li>
<li><strong>Xung đột là bình thường.</strong> Mục tiêu không phải né tránh bất đồng mà là giải quyết nó tốt và giữ nhóm tiến về phía trước.</li>
</ul>
<h3>Lộ trình — 9 chương</h3>
<p>Mô hình giao tiếp → lắng nghe chủ động &amp; đồng cảm → giao tiếp văn bản → thuyết trình → làm việc nhóm (vai trò &amp; giai đoạn) → xung đột &amp; thương lượng → lãnh đạo &amp; tạo động lực → họp hiệu quả → giao tiếp đa văn hoá, đạo đức &amp; phản hồi xây dựng. Mỗi chương song ngữ, có tình huống thực và một quiz ngắn.</p>
<div class="callout"><span class="badge">Học sao cho hiệu quả</span> Đừng chỉ đọc — hãy luyện. Sau mỗi chương, chọn một điều nhỏ (một tin nhắn rõ hơn, một câu hỏi lắng nghe chủ động) và dùng ngay trong ngày ở một nhóm chat thật, đồ án lớp hay buổi stand-up.</div>`,
  ]]);

// ── Chapter 1 — What is communication ──
const c1 = doc('ssg105-1-1-model', '1.1 — What is communication? The model|||1.1 — Giao tiếp là gì? Mô hình giao tiếp',
  'Mô hình sender-receiver: người gửi, mã hoá, thông điệp, kênh, giải mã, người nhận, phản hồi, nhiễu, ngữ cảnh; giao tiếp bằng lời & phi ngôn ngữ (7-38-55, giọng, ánh mắt, cử chỉ).',
  [[
    `<span class="eyebrow">SSG105 · Chapter 1 · Lesson 1.1</span>
<h2>What is communication? The sender–receiver model</h2>
<p><strong>Communication</strong> is the process of creating shared meaning. The classic model breaks it into parts you can inspect when something goes wrong:</p>
<table>
<tr><th>Element</th><th>What it is</th></tr>
<tr><td><strong>Sender</strong></td><td>The person with an idea to share.</td></tr>
<tr><td><strong>Encoding</strong></td><td>Turning the idea into words, tone, gestures.</td></tr>
<tr><td><strong>Message</strong></td><td>The encoded content itself.</td></tr>
<tr><td><strong>Channel</strong></td><td>The medium: face-to-face, call, email, chat.</td></tr>
<tr><td><strong>Decoding</strong></td><td>The receiver interpreting the message.</td></tr>
<tr><td><strong>Receiver</strong></td><td>The person making sense of it.</td></tr>
<tr><td><strong>Feedback</strong></td><td>The receiver's response — proof the loop closed.</td></tr>
<tr><td><strong>Noise</strong></td><td>Anything that distorts meaning (see below).</td></tr>
</table>
<h3>Noise — where meaning gets lost</h3>
<ul>
<li><strong>Physical noise</strong> — a bad connection, a loud room.</li>
<li><strong>Semantic noise</strong> — jargon or ambiguous words the receiver reads differently.</li>
<li><strong>Psychological noise</strong> — stress, bias, or assumptions the listener brings.</li>
</ul>
<h3>Verbal &amp; non-verbal</h3>
<p>Only part of a face-to-face message is the words. <strong>Non-verbal</strong> signals — tone of voice, facial expression, eye contact, posture, gestures, and distance — carry much of the emotional meaning. Mehrabian's often-quoted "7% words / 38% tone / 55% body language" applies specifically to feelings and attitudes, but the lesson holds: when words and body language disagree, people believe the body.</p>
<div class="callout"><span class="badge">Real situation</span> You type "Fine." to a teammate on Slack. You meant "okay, no problem" — they read cold annoyance, because chat strips out your tone and smile. That is <em>lost non-verbal channel</em>, and it is why an emoji or one extra sentence ("Fine by me — go ahead! 👍") prevents a needless conflict.</div>`,
    `<span class="eyebrow">SSG105 · Chương 1 · Bài 1.1</span>
<h2>Giao tiếp là gì? Mô hình người gửi–người nhận</h2>
<p><strong>Giao tiếp</strong> là quá trình tạo ra ý nghĩa chung. Mô hình kinh điển chia nó thành các phần để bạn soi ra khi có trục trặc:</p>
<table>
<tr><th>Thành phần</th><th>Là gì</th></tr>
<tr><td><strong>Người gửi</strong></td><td>Người có ý tưởng muốn chia sẻ.</td></tr>
<tr><td><strong>Mã hoá</strong></td><td>Biến ý tưởng thành lời, giọng, cử chỉ.</td></tr>
<tr><td><strong>Thông điệp</strong></td><td>Nội dung đã được mã hoá.</td></tr>
<tr><td><strong>Kênh</strong></td><td>Phương tiện: trực tiếp, gọi điện, email, chat.</td></tr>
<tr><td><strong>Giải mã</strong></td><td>Người nhận diễn giải thông điệp.</td></tr>
<tr><td><strong>Người nhận</strong></td><td>Người hiểu thông điệp.</td></tr>
<tr><td><strong>Phản hồi</strong></td><td>Phản ứng của người nhận — bằng chứng vòng lặp đã khép.</td></tr>
<tr><td><strong>Nhiễu</strong></td><td>Bất cứ thứ gì làm méo ý nghĩa (xem dưới).</td></tr>
</table>
<h3>Nhiễu — chỗ ý nghĩa bị mất</h3>
<ul>
<li><strong>Nhiễu vật lý</strong> — kết nối kém, phòng ồn.</li>
<li><strong>Nhiễu ngữ nghĩa</strong> — thuật ngữ hoặc từ mơ hồ mà người nhận hiểu khác đi.</li>
<li><strong>Nhiễu tâm lý</strong> — căng thẳng, định kiến, giả định mà người nghe mang theo.</li>
</ul>
<h3>Bằng lời &amp; phi ngôn ngữ</h3>
<p>Chỉ một phần thông điệp trực tiếp nằm ở từ ngữ. Tín hiệu <strong>phi ngôn ngữ</strong> — giọng nói, nét mặt, ánh mắt, tư thế, cử chỉ, khoảng cách — mang phần lớn ý nghĩa cảm xúc. Con số hay được trích của Mehrabian "7% lời / 38% giọng / 55% ngôn ngữ cơ thể" áp dụng riêng cho cảm xúc &amp; thái độ, nhưng bài học vẫn đúng: khi lời và ngôn ngữ cơ thể mâu thuẫn, người ta tin cơ thể.</p>
<div class="callout"><span class="badge">Tình huống thực</span> Bạn gõ "Ừ." cho đồng đội trên Slack. Bạn định nói "ổn, không sao" — họ đọc ra sự lạnh nhạt khó chịu, vì chat lược mất giọng và nụ cười của bạn. Đó là <em>mất kênh phi ngôn ngữ</em>, và vì thế một emoji hay thêm một câu ("Ừ, được mà — cứ làm nhé! 👍") ngăn được một xung đột không đáng có.</div>`,
  ]]);

const c1q = quiz('ssg105-quiz-1', 'Quiz 1 — The communication model|||Quiz 1 — Mô hình giao tiếp', [
  { id: 'q1', question: 'Trong mô hình giao tiếp, "phản hồi" (feedback) có vai trò gì?', options: ['Là kênh truyền tin', 'Là phản ứng của người nhận, cho biết vòng giao tiếp đã khép', 'Là nhiễu làm méo thông điệp', 'Là bước mã hoá ý tưởng'], correctIndex: 1, explanation: 'Feedback là phản ứng của người nhận, xác nhận thông điệp đã tới và được hiểu.' },
  { id: 'q2', question: 'Thuật ngữ khó hiểu khiến người nhận diễn giải sai là loại nhiễu nào?', options: ['Nhiễu vật lý', 'Nhiễu ngữ nghĩa (semantic)', 'Nhiễu tâm lý', 'Kênh giao tiếp'], correctIndex: 1, explanation: 'Nhiễu ngữ nghĩa đến từ từ ngữ/jargon mơ hồ, hiểu mỗi người một kiểu.' },
  { id: 'q3', question: 'Khi lời nói và ngôn ngữ cơ thể mâu thuẫn nhau, người nghe thường tin vào?', options: ['Từ ngữ', 'Ngôn ngữ cơ thể / phi ngôn ngữ', 'Kênh văn bản', 'Cả hai như nhau'], correctIndex: 1, explanation: 'Tín hiệu phi ngôn ngữ mang phần lớn ý nghĩa cảm xúc; người ta tin cơ thể hơn lời.' },
]);

// ── Chapter 2 — Active listening ──
const c2 = doc('ssg105-2-1-listening', '2.1 — Active listening, questioning & empathy|||2.1 — Lắng nghe chủ động, đặt câu hỏi & đồng cảm',
  'Nghe để hiểu (không phải để đáp); các cấp độ nghe; kỹ thuật lắng nghe chủ động (chú ý, diễn giải lại, tóm tắt, không ngắt lời); câu hỏi mở/đóng; đồng cảm khác cảm thông.',
  [[
    `<span class="eyebrow">SSG105 · Chapter 2 · Lesson 2.1</span>
<h2>Active listening, questioning &amp; empathy</h2>
<p>Most people listen to <em>reply</em>, not to <em>understand</em>. <strong>Active listening</strong> flips that: your goal is to fully receive the other person's meaning before you respond.</p>
<h3>Levels of listening</h3>
<ol>
<li><strong>Ignoring</strong> — not really listening.</li>
<li><strong>Pretending</strong> — nodding, but planning your reply.</li>
<li><strong>Selective</strong> — hearing only the parts you care about.</li>
<li><strong>Attentive</strong> — focusing on the words.</li>
<li><strong>Empathic</strong> — hearing the feeling and intent behind the words. This is the goal.</li>
</ol>
<h3>Active-listening techniques</h3>
<ul>
<li><strong>Give full attention</strong> — put the phone down, make eye contact, don't interrupt.</li>
<li><strong>Paraphrase</strong> — "So what you're saying is…" to check understanding.</li>
<li><strong>Summarise</strong> — restate the key points at the end.</li>
<li><strong>Reflect feelings</strong> — "It sounds like that deadline is stressing you out."</li>
</ul>
<h3>Asking better questions</h3>
<ul>
<li><strong>Open questions</strong> ("How did that go?") invite detail and open a conversation.</li>
<li><strong>Closed questions</strong> ("Did it work?") get a yes/no — good for confirming facts, bad for exploring.</li>
</ul>
<h3>Empathy vs sympathy</h3>
<p><strong>Empathy</strong> is feeling <em>with</em> someone ("I understand why that's frustrating"); <strong>sympathy</strong> is feeling <em>for</em> them from a distance ("that's too bad"). In teams, empathy builds trust; it does not mean you agree — it means the other person feels heard.</p>
<div class="callout"><span class="badge">Real situation</span> A teammate says "I can't finish the API by Friday." A poor listener jumps in: "Just work the weekend." An active listener asks an open question — "What's blocking you?" — learns a dependency is late, and the real fix (re-order the sprint) appears. Listening first found the true problem.</div>`,
    `<span class="eyebrow">SSG105 · Chương 2 · Bài 2.1</span>
<h2>Lắng nghe chủ động, đặt câu hỏi &amp; đồng cảm</h2>
<p>Đa số người nghe để <em>trả lời</em>, không phải để <em>hiểu</em>. <strong>Lắng nghe chủ động</strong> đảo ngược điều đó: mục tiêu của bạn là tiếp nhận trọn vẹn ý của người kia trước khi đáp.</p>
<h3>Các cấp độ nghe</h3>
<ol>
<li><strong>Phớt lờ</strong> — không thực sự nghe.</li>
<li><strong>Giả vờ nghe</strong> — gật đầu nhưng đang nghĩ câu đáp.</li>
<li><strong>Nghe chọn lọc</strong> — chỉ nghe phần mình quan tâm.</li>
<li><strong>Nghe chú tâm</strong> — tập trung vào lời nói.</li>
<li><strong>Nghe đồng cảm</strong> — nghe cả cảm xúc và ý định sau lời. Đây là đích đến.</li>
</ol>
<h3>Kỹ thuật lắng nghe chủ động</h3>
<ul>
<li><strong>Chú tâm hoàn toàn</strong> — đặt điện thoại xuống, giao tiếp bằng mắt, không ngắt lời.</li>
<li><strong>Diễn giải lại</strong> — "Vậy ý bạn là…" để kiểm tra mình hiểu đúng.</li>
<li><strong>Tóm tắt</strong> — nhắc lại các ý chính ở cuối.</li>
<li><strong>Phản chiếu cảm xúc</strong> — "Nghe như cái deadline đó đang làm bạn căng."</li>
</ul>
<h3>Đặt câu hỏi tốt hơn</h3>
<ul>
<li><strong>Câu hỏi mở</strong> ("Việc đó thế nào rồi?") mời gọi chi tiết, mở cuộc trò chuyện.</li>
<li><strong>Câu hỏi đóng</strong> ("Chạy được chưa?") nhận có/không — tốt để xác nhận sự việc, dở để khám phá.</li>
</ul>
<h3>Đồng cảm vs cảm thông</h3>
<p><strong>Đồng cảm</strong> là cảm nhận <em>cùng</em> người kia ("Mình hiểu vì sao điều đó bực bội"); <strong>cảm thông</strong> là thương <em>hộ</em> họ từ xa ("Tội thật"). Trong nhóm, đồng cảm xây dựng lòng tin; nó không có nghĩa là bạn đồng ý — nghĩa là người kia thấy mình được lắng nghe.</p>
<div class="callout"><span class="badge">Tình huống thực</span> Một đồng đội nói "Mình không xong API kịp thứ Sáu." Người nghe kém chen vào: "Làm luôn cuối tuần đi." Người nghe chủ động hỏi mở — "Cái gì đang chặn bạn?" — biết được một phần phụ thuộc bị trễ, và cách sửa thật (đổi thứ tự sprint) hiện ra. Lắng nghe trước tìm ra đúng vấn đề.</div>`,
  ]]);

const c2q = quiz('ssg105-quiz-2', 'Quiz 2 — Active listening|||Quiz 2 — Lắng nghe chủ động', [
  { id: 'q1', question: 'Cấp độ nghe cao nhất trong lắng nghe chủ động là?', options: ['Nghe chọn lọc', 'Giả vờ nghe', 'Nghe đồng cảm (empathic)', 'Phớt lờ'], correctIndex: 2, explanation: 'Nghe đồng cảm là nghe cả cảm xúc và ý định sau lời nói — mức cao nhất.' },
  { id: 'q2', question: 'Kỹ thuật "diễn giải lại" (paraphrase) dùng để làm gì?', options: ['Kết thúc nhanh cuộc nói chuyện', 'Kiểm tra rằng mình đã hiểu đúng ý người nói', 'Chứng minh mình giỏi hơn', 'Đổi chủ đề'], correctIndex: 1, explanation: 'Diễn giải lại ("Vậy ý bạn là…") xác nhận mình hiểu đúng trước khi đáp.' },
  { id: 'q3', question: 'Muốn mời người khác kể chi tiết và mở cuộc trò chuyện, nên dùng?', options: ['Câu hỏi đóng (yes/no)', 'Câu hỏi mở', 'Im lặng hoàn toàn', 'Ngắt lời để hỏi dồn'], correctIndex: 1, explanation: 'Câu hỏi mở ("Việc đó thế nào rồi?") khuyến khích trả lời chi tiết.' },
]);

// ── Chapter 3 — Written communication ──
const c3 = doc('ssg105-3-1-writing', '3.1 — Written communication: email, chat & docs|||3.1 — Giao tiếp văn bản: email, chat & tài liệu',
  'Viết chuyên nghiệp: cấu trúc email (subject, chào, thân, kết, CTA), giọng điệu, ngắn gọn & rõ; văn hoá chat công việc (Slack): kênh đúng, async, thread; nguyên tắc 7C.',
  [[
    `<span class="eyebrow">SSG105 · Chapter 3 · Lesson 3.1</span>
<h2>Written communication: email, work chat &amp; docs</h2>
<p>In a software job, most communication is <strong>written</strong> and <strong>asynchronous</strong>. Good writing respects the reader's time and removes ambiguity.</p>
<h3>The 7 C's of good writing</h3>
<p>Clear, Concise, Concrete, Correct, Coherent, Complete, Courteous. If a message fails one, rewrite it.</p>
<h3>Anatomy of a professional email</h3>
<ul>
<li><strong>Subject line</strong> — specific and scannable: "SSG105 group report — draft for review by Thu" beats "Hi".</li>
<li><strong>Greeting</strong> — appropriate to the relationship.</li>
<li><strong>Body</strong> — one idea per paragraph; put the ask first, context after.</li>
<li><strong>Call to action</strong> — say exactly what you need and by when.</li>
<li><strong>Sign-off</strong> — polite close and your name.</li>
</ul>
<h3>Work chat (Slack / Teams) etiquette</h3>
<ul>
<li><strong>Right channel</strong> — post in the topic channel, not a random DM, so the team has context.</li>
<li><strong>Async by default</strong> — don't expect an instant reply; write a complete message, not "hi" then waiting.</li>
<li><strong>Use threads</strong> — keep a discussion in one thread instead of flooding the channel.</li>
<li><strong>Write it once, well</strong> — a clear question with what you tried gets a faster, better answer.</li>
</ul>
<h3>Tone in text</h3>
<p>Text has no tone of voice, so it reads harsher than you mean. Add a courteous word, avoid ALL CAPS (it reads as shouting), and re-read once before sending as if you were the receiver.</p>
<div class="callout"><span class="badge">Real situation</span> Compare "fix the build it's broken" with "Hi Minh — the CI build is failing on <code>main</code> (log attached). Could you take a look when you get a chance? Blocking my PR. Thanks!" Same request; the second gets help faster because it is specific, courteous, and gives the reader what they need to act.</div>`,
    `<span class="eyebrow">SSG105 · Chương 3 · Bài 3.1</span>
<h2>Giao tiếp văn bản: email, chat công việc &amp; tài liệu</h2>
<p>Trong nghề phần mềm, phần lớn giao tiếp là <strong>văn bản</strong> và <strong>bất đồng bộ</strong>. Viết tốt là tôn trọng thời gian người đọc và loại bỏ mơ hồ.</p>
<h3>Nguyên tắc 7C của viết tốt</h3>
<p>Clear (rõ), Concise (súc tích), Concrete (cụ thể), Correct (đúng), Coherent (mạch lạc), Complete (đủ ý), Courteous (lịch sự). Nếu thiếu một chữ, viết lại.</p>
<h3>Cấu trúc một email chuyên nghiệp</h3>
<ul>
<li><strong>Dòng tiêu đề</strong> — cụ thể, đọc lướt hiểu ngay: "Báo cáo nhóm SSG105 — bản nháp cần review trước thứ Năm" hơn hẳn "Chào".</li>
<li><strong>Lời chào</strong> — hợp với mối quan hệ.</li>
<li><strong>Thân bài</strong> — mỗi đoạn một ý; nói yêu cầu trước, bối cảnh sau.</li>
<li><strong>Kêu gọi hành động</strong> — nói rõ cần gì và hạn khi nào.</li>
<li><strong>Kết</strong> — câu chào lịch sự và tên bạn.</li>
</ul>
<h3>Văn hoá chat công việc (Slack / Teams)</h3>
<ul>
<li><strong>Đúng kênh</strong> — đăng vào kênh đúng chủ đề, không nhắn riêng lung tung, để cả nhóm có bối cảnh.</li>
<li><strong>Mặc định bất đồng bộ</strong> — đừng chờ trả lời ngay; viết một tin đầy đủ, đừng gõ "chào" rồi đợi.</li>
<li><strong>Dùng thread</strong> — giữ một cuộc thảo luận trong một thread thay vì ngập cả kênh.</li>
<li><strong>Viết một lần cho gọn</strong> — câu hỏi rõ kèm những gì đã thử sẽ nhận câu trả lời nhanh &amp; tốt hơn.</li>
</ul>
<h3>Giọng điệu trong văn bản</h3>
<p>Văn bản không có giọng nói nên đọc ra gắt hơn ý bạn. Thêm một từ lịch sự, tránh VIẾT HOA TOÀN BỘ (nghe như quát), và đọc lại một lượt trước khi gửi như thể bạn là người nhận.</p>
<div class="callout"><span class="badge">Tình huống thực</span> So "sửa cái build hỏng rồi" với "Chào Minh — build CI trên <code>main</code> đang fail (log đính kèm). Khi nào rảnh bạn xem giúp nhé? Đang chặn PR của mình. Cảm ơn!" Cùng một yêu cầu; câu thứ hai được giúp nhanh hơn vì cụ thể, lịch sự và cho người đọc đủ thứ để hành động.</div>`,
  ]]);

const c3q = quiz('ssg105-quiz-3', 'Quiz 3 — Written communication|||Quiz 3 — Giao tiếp văn bản', [
  { id: 'q1', question: 'Một dòng tiêu đề email tốt nên?', options: ['Càng ngắn càng tốt, kiểu "Chào"', 'Cụ thể, đọc lướt là hiểu nội dung & việc cần', 'Viết hoa toàn bộ để gây chú ý', 'Bỏ trống để người nhận tự đoán'], correctIndex: 1, explanation: 'Tiêu đề cụ thể giúp người nhận biết ngay nội dung và việc cần làm.' },
  { id: 'q2', question: 'Trong 7C, chữ "Concise" nghĩa là?', options: ['Lịch sự', 'Súc tích, không thừa', 'Đúng chính tả', 'Đầy đủ mọi chi tiết'], correctIndex: 1, explanation: 'Concise = súc tích, nói đủ ý mà không dài dòng.' },
  { id: 'q3', question: 'Cách chat công việc (Slack) đúng là?', options: ['Gõ "hi" rồi đợi người kia hỏi lại', 'Nhắn riêng mọi thứ để khỏi làm phiền kênh', 'Đăng đúng kênh, viết tin đầy đủ, dùng thread', 'VIẾT HOA để được chú ý'], correctIndex: 2, explanation: 'Đăng đúng kênh, viết một tin đầy đủ và dùng thread giữ ngữ cảnh cho cả nhóm.' },
]);

// ── Chapter 4 — Presentations ──
const c4 = doc('ssg105-4-1-presentation', '4.1 — Presentations: prepare, structure, deliver|||4.1 — Thuyết trình: chuẩn bị, cấu trúc, trình bày',
  'Chuẩn bị (biết khán giả & mục tiêu), cấu trúc mở-thân-kết (tell-tell-tell), thiết kế slide (ít chữ, một ý/slide, hình ảnh), kiểm soát lo lắng, ngôn ngữ cơ thể & giọng nói, tập luyện.',
  [[
    `<span class="eyebrow">SSG105 · Chapter 4 · Lesson 4.1</span>
<h2>Presentations: prepare, structure &amp; deliver</h2>
<h3>1. Prepare — know your audience &amp; goal</h3>
<p>Before a single slide, answer: <strong>Who is listening?</strong> and <strong>What is the one thing they should remember?</strong> Everything else supports that one message.</p>
<h3>2. Structure — tell them three times</h3>
<ul>
<li><strong>Opening</strong> — hook + tell them what you'll cover (the "what &amp; why").</li>
<li><strong>Body</strong> — 3 main points, each with evidence or an example.</li>
<li><strong>Closing</strong> — summarise and end with a clear takeaway or call to action.</li>
</ul>
<h3>3. Slide design</h3>
<ul>
<li><strong>One idea per slide.</strong> Slides support you; they are not your script.</li>
<li><strong>Few words, big font.</strong> Bullet fragments, not paragraphs; visuals over walls of text.</li>
<li><strong>Consistent</strong> colours and layout so the audience focuses on content, not clutter.</li>
</ul>
<h3>4. Manage nerves</h3>
<p>Nervousness is normal — even experts feel it. Reduce it by <strong>rehearsing out loud</strong> (not just in your head), breathing slowly before you start, and remembering the audience wants you to succeed. Prepare your first 30 seconds word-for-word; once you're moving, nerves fade.</p>
<h3>5. Body language &amp; voice</h3>
<ul>
<li><strong>Eye contact</strong> — look at people, not the screen.</li>
<li><strong>Posture</strong> — stand balanced; open gestures, not crossed arms.</li>
<li><strong>Voice</strong> — vary pace and volume; pause instead of saying "um".</li>
</ul>
<div class="callout"><span class="badge">Real situation</span> Two students demo the same project. One reads dense slides in a monotone facing the wall; the other shows one screenshot per slide, faces the room, and tells the story of a bug they fixed. Same code — the second is remembered, because delivery and structure carried the message.</div>`,
    `<span class="eyebrow">SSG105 · Chương 4 · Bài 4.1</span>
<h2>Thuyết trình: chuẩn bị, cấu trúc &amp; trình bày</h2>
<h3>1. Chuẩn bị — hiểu khán giả &amp; mục tiêu</h3>
<p>Trước cả slide đầu tiên, hãy trả lời: <strong>Ai đang nghe?</strong> và <strong>Điều duy nhất họ nên nhớ là gì?</strong> Mọi thứ còn lại phục vụ thông điệp đó.</p>
<h3>2. Cấu trúc — nói ba lần</h3>
<ul>
<li><strong>Mở bài</strong> — câu dẫn dắt + báo trước sẽ nói gì ("cái gì &amp; vì sao").</li>
<li><strong>Thân bài</strong> — 3 ý chính, mỗi ý kèm bằng chứng hoặc ví dụ.</li>
<li><strong>Kết bài</strong> — tóm tắt và chốt bằng một điều rút ra hoặc lời kêu gọi hành động.</li>
</ul>
<h3>3. Thiết kế slide</h3>
<ul>
<li><strong>Một ý mỗi slide.</strong> Slide hỗ trợ bạn; nó không phải kịch bản.</li>
<li><strong>Ít chữ, cỡ to.</strong> Gạch đầu dòng ngắn, không phải đoạn văn; hình ảnh hơn tường chữ.</li>
<li><strong>Nhất quán</strong> màu và bố cục để khán giả tập trung vào nội dung, không rối mắt.</li>
</ul>
<h3>4. Kiểm soát lo lắng</h3>
<p>Hồi hộp là bình thường — cả chuyên gia cũng thấy. Giảm nó bằng cách <strong>tập nói thành tiếng</strong> (không chỉ nhẩm trong đầu), hít thở chậm trước khi bắt đầu, và nhớ rằng khán giả muốn bạn thành công. Chuẩn bị 30 giây đầu thuộc lòng từng chữ; khi đã chạy, lo lắng sẽ tan.</p>
<h3>5. Ngôn ngữ cơ thể &amp; giọng nói</h3>
<ul>
<li><strong>Giao tiếp bằng mắt</strong> — nhìn người, đừng nhìn màn hình.</li>
<li><strong>Tư thế</strong> — đứng cân bằng; cử chỉ mở, không khoanh tay.</li>
<li><strong>Giọng nói</strong> — thay đổi tốc độ và âm lượng; dừng một nhịp thay vì "ừm".</li>
</ul>
<div class="callout"><span class="badge">Tình huống thực</span> Hai sinh viên demo cùng một đồ án. Một người đọc slide dày chữ đều đều, mặt quay vào tường; người kia mỗi slide một ảnh chụp, quay mặt xuống lớp, kể câu chuyện về một lỗi họ đã sửa. Cùng một dòng code — người thứ hai được nhớ, vì cách trình bày và cấu trúc đã gánh thông điệp.</div>`,
  ]]);

const c4q = quiz('ssg105-quiz-4', 'Quiz 4 — Presentations|||Quiz 4 — Thuyết trình', [
  { id: 'q1', question: 'Nguyên tắc thiết kế slide tốt là?', options: ['Càng nhiều chữ càng đủ ý', 'Một ý mỗi slide, ít chữ, cỡ to, ưu tiên hình ảnh', 'Đọc nguyên văn slide cho khán giả', 'Dùng thật nhiều màu và hiệu ứng'], correctIndex: 1, explanation: 'Slide hỗ trợ người nói: một ý/slide, ít chữ, trực quan.' },
  { id: 'q2', question: 'Cách hiệu quả nhất để giảm lo lắng khi thuyết trình?', options: ['Đọc thầm trong đầu vài lần', 'Tập nói thành tiếng, thở chậm, thuộc 30 giây mở đầu', 'Uống thật nhiều cà phê', 'Tránh nhìn khán giả'], correctIndex: 1, explanation: 'Tập thành tiếng và chuẩn bị kỹ phần mở đầu giúp làm chủ và bớt hồi hộp.' },
  { id: 'q3', question: 'Cấu trúc "tell-tell-tell" của bài thuyết trình gồm?', options: ['Chỉ có thân bài', 'Mở (báo trước) → thân (3 ý) → kết (tóm tắt)', 'Ba slide bất kỳ', 'Hỏi đáp → nội dung → chào'], correctIndex: 1, explanation: 'Nói trước sẽ nói gì, nói nội dung, rồi tóm tắt lại — khán giả nhớ tốt hơn.' },
]);

// ── Chapter 5 — Teamwork: roles & stages ──
const c5 = doc('ssg105-5-1-teamwork', '5.1 — Teamwork: roles (Belbin) & stages (Tuckman)|||5.1 — Làm việc nhóm: vai trò (Belbin) & giai đoạn (Tuckman)',
  '9 vai trò nhóm Belbin (hành động/xã hội/tư duy); 5 giai đoạn Tuckman (forming, storming, norming, performing, adjourning); mục tiêu chung SMART, nội quy nhóm, phụ thuộc lẫn nhau.',
  [[
    `<span class="eyebrow">SSG105 · Chapter 5 · Lesson 5.1</span>
<h2>Teamwork: roles &amp; stages</h2>
<h3>Team roles — Belbin</h3>
<p>Meredith Belbin found that effective teams need a <strong>mix of roles</strong>, not clones. The nine roles fall into three groups:</p>
<table>
<tr><th>Group</th><th>Roles</th><th>Contribution</th></tr>
<tr><td><strong>Action</strong></td><td>Shaper, Implementer, Completer-Finisher</td><td>Drive, deliver, and check the details.</td></tr>
<tr><td><strong>People</strong></td><td>Coordinator, Teamworker, Resource Investigator</td><td>Organise, support, and connect outward.</td></tr>
<tr><td><strong>Thinking</strong></td><td>Plant, Monitor-Evaluator, Specialist</td><td>Generate ideas, judge them, provide deep knowledge.</td></tr>
</table>
<p>The lesson: a team of all "idea people" and no "finishers" ships nothing; balance beats sameness.</p>
<h3>Team stages — Tuckman</h3>
<ol>
<li><strong>Forming</strong> — polite, unsure, dependent on the leader; roles unclear.</li>
<li><strong>Storming</strong> — conflict over direction and roles; the hard, necessary stage.</li>
<li><strong>Norming</strong> — the team agrees on how to work; norms and trust form.</li>
<li><strong>Performing</strong> — high output, members self-organise.</li>
<li><strong>Adjourning</strong> — the project ends; wrap up and reflect.</li>
</ol>
<p>Knowing the model helps you not panic at <em>storming</em> — it is a normal phase, not a broken team.</p>
<h3>A shared goal</h3>
<p>Teams work when the goal is <strong>SMART</strong> (Specific, Measurable, Achievable, Relevant, Time-bound) and everyone knows who owns what. Agree simple <strong>ground rules</strong> early (how you'll decide, meet, and handle missed work).</p>
<div class="callout"><span class="badge">Real situation</span> A 5-person SSG105 project stalls in week 2 with arguments over the topic — classic <em>storming</em>. Instead of quitting, they set ground rules and a SMART goal ("ship a working demo + 10-slide deck by week 6"), assign clear roles, and reach <em>performing</em>. The conflict was a stage, not a failure.</div>`,
    `<span class="eyebrow">SSG105 · Chương 5 · Bài 5.1</span>
<h2>Làm việc nhóm: vai trò &amp; giai đoạn</h2>
<h3>Vai trò nhóm — Belbin</h3>
<p>Meredith Belbin phát hiện: nhóm hiệu quả cần một <strong>hỗn hợp vai trò</strong>, không phải bản sao của nhau. Chín vai trò chia ba nhóm:</p>
<table>
<tr><th>Nhóm</th><th>Vai trò</th><th>Đóng góp</th></tr>
<tr><td><strong>Hành động</strong></td><td>Người thúc đẩy, Người thực thi, Người hoàn thiện</td><td>Tạo động lực, làm ra sản phẩm, soát chi tiết.</td></tr>
<tr><td><strong>Xã hội</strong></td><td>Người điều phối, Người kết nối nội bộ, Người tìm nguồn lực</td><td>Tổ chức, hỗ trợ, kết nối ra ngoài.</td></tr>
<tr><td><strong>Tư duy</strong></td><td>Người sáng tạo, Người thẩm định, Chuyên gia</td><td>Sinh ý tưởng, đánh giá chúng, cung cấp kiến thức sâu.</td></tr>
</table>
<p>Bài học: một nhóm toàn "người ý tưởng" mà không có "người hoàn thiện" thì không ra được gì; cân bằng thắng đồng nhất.</p>
<h3>Giai đoạn nhóm — Tuckman</h3>
<ol>
<li><strong>Hình thành (Forming)</strong> — lịch sự, dè dặt, phụ thuộc trưởng nhóm; vai trò chưa rõ.</li>
<li><strong>Bão tố (Storming)</strong> — xung đột về hướng đi và vai trò; giai đoạn khó nhưng cần thiết.</li>
<li><strong>Ổn định (Norming)</strong> — nhóm thống nhất cách làm việc; nội quy và lòng tin hình thành.</li>
<li><strong>Vận hành (Performing)</strong> — năng suất cao, thành viên tự tổ chức.</li>
<li><strong>Kết thúc (Adjourning)</strong> — dự án xong; tổng kết và rút kinh nghiệm.</li>
</ol>
<p>Biết mô hình giúp bạn không hoảng khi tới <em>bão tố</em> — đó là giai đoạn bình thường, không phải nhóm hỏng.</p>
<h3>Mục tiêu chung</h3>
<p>Nhóm chạy tốt khi mục tiêu <strong>SMART</strong> (Cụ thể, Đo được, Khả thi, Liên quan, Có hạn thời gian) và ai cũng biết mình phụ trách gì. Thống nhất vài <strong>nội quy nhóm</strong> đơn giản từ sớm (cách ra quyết định, họp, xử lý khi trễ việc).</p>
<div class="callout"><span class="badge">Tình huống thực</span> Một đồ án SSG105 5 người khựng ở tuần 2 vì cãi nhau chọn đề tài — đúng kiểu <em>bão tố</em>. Thay vì bỏ cuộc, họ đặt nội quy và mục tiêu SMART ("ra demo chạy được + deck 10 slide trước tuần 6"), phân vai rõ, và tới <em>vận hành</em>. Xung đột là một giai đoạn, không phải thất bại.</div>`,
  ]]);

const c5q = quiz('ssg105-quiz-5', 'Quiz 5 — Teamwork roles & stages|||Quiz 5 — Vai trò & giai đoạn nhóm', [
  { id: 'q1', question: 'Theo Tuckman, giai đoạn nhóm hay có xung đột về hướng đi và vai trò là?', options: ['Forming (hình thành)', 'Storming (bão tố)', 'Performing (vận hành)', 'Adjourning (kết thúc)'], correctIndex: 1, explanation: 'Storming là giai đoạn xung đột — khó nhưng cần thiết trước khi ổn định.' },
  { id: 'q2', question: 'Ý chính của mô hình vai trò nhóm Belbin là?', options: ['Mọi thành viên nên giống hệt nhau', 'Nhóm hiệu quả cần một hỗn hợp cân bằng các vai trò', 'Chỉ cần người ý tưởng là đủ', 'Trưởng nhóm làm hết mọi việc'], correctIndex: 1, explanation: 'Belbin: cân bằng nhiều vai trò (hành động/xã hội/tư duy) hơn là đồng nhất.' },
  { id: 'q3', question: 'Mục tiêu nhóm "SMART" gồm các yếu tố?', options: ['Specific, Measurable, Achievable, Relevant, Time-bound', 'Simple, Modern, Agile, Rapid, Tested', 'Strong, Many, Advanced, Rich, True', 'Short, Manual, Automatic, Real, Total'], correctIndex: 0, explanation: 'SMART = Cụ thể, Đo được, Khả thi, Liên quan, Có hạn thời gian.' },
]);

// ── Chapter 6 — Conflict & negotiation ──
const c6 = doc('ssg105-6-1-conflict', '6.1 — Conflict resolution & negotiation|||6.1 — Giải quyết xung đột & thương lượng',
  'Nguồn gốc xung đột; 5 phong cách Thomas-Kilmann (competing, collaborating, compromising, avoiding, accommodating) theo hai trục quyết đoán/hợp tác; thương lượng win-win, tách người khỏi vấn đề.',
  [[
    `<span class="eyebrow">SSG105 · Chapter 6 · Lesson 6.1</span>
<h2>Conflict resolution &amp; negotiation</h2>
<p>Conflict is not the enemy — <em>unresolved</em> conflict is. Handled well, disagreement surfaces better ideas.</p>
<h3>The Thomas–Kilmann model</h3>
<p>Five styles for handling conflict, mapped on two axes: <strong>assertiveness</strong> (pursuing your own needs) and <strong>cooperativeness</strong> (pursuing others' needs).</p>
<table>
<tr><th>Style</th><th>Assertive?</th><th>Cooperative?</th><th>Use when…</th></tr>
<tr><td><strong>Competing</strong></td><td>High</td><td>Low</td><td>A fast, vital decision; safety.</td></tr>
<tr><td><strong>Accommodating</strong></td><td>Low</td><td>High</td><td>You're wrong, or the issue matters more to them.</td></tr>
<tr><td><strong>Avoiding</strong></td><td>Low</td><td>Low</td><td>Trivial issue, or emotions need to cool.</td></tr>
<tr><td><strong>Compromising</strong></td><td>Medium</td><td>Medium</td><td>Equal power, time pressure, "good enough".</td></tr>
<tr><td><strong>Collaborating</strong></td><td>High</td><td>High</td><td>Both sets of needs matter; seek win-win.</td></tr>
</table>
<p>No style is "best" — skilled people <strong>choose</strong> the style that fits the situation.</p>
<h3>Principled negotiation</h3>
<ul>
<li><strong>Separate the people from the problem</strong> — attack the issue, not the person.</li>
<li><strong>Focus on interests, not positions</strong> — ask "why do you want that?" to find the real need.</li>
<li><strong>Invent options for mutual gain</strong> — look for a bigger pie before splitting it.</li>
<li><strong>Use objective criteria</strong> — agree on a fair standard, not who shouts loudest.</li>
</ul>
<div class="callout"><span class="badge">Real situation</span> Two teammates argue over which framework to use — a <em>position</em> fight. A collaborating move asks the interest behind each: one wants fast delivery, the other maintainability. They agree on a criterion (ship the demo, then refactor) — a win-win neither "winning" would have found.</div>`,
    `<span class="eyebrow">SSG105 · Chương 6 · Bài 6.1</span>
<h2>Giải quyết xung đột &amp; thương lượng</h2>
<p>Xung đột không phải kẻ thù — xung đột <em>không được giải quyết</em> mới là. Xử lý tốt, bất đồng làm bật ra ý tưởng hay hơn.</p>
<h3>Mô hình Thomas–Kilmann</h3>
<p>Năm phong cách xử lý xung đột, đặt trên hai trục: <strong>quyết đoán</strong> (theo đuổi nhu cầu của mình) và <strong>hợp tác</strong> (theo đuổi nhu cầu người khác).</p>
<table>
<tr><th>Phong cách</th><th>Quyết đoán?</th><th>Hợp tác?</th><th>Dùng khi…</th></tr>
<tr><td><strong>Cạnh tranh</strong></td><td>Cao</td><td>Thấp</td><td>Quyết định nhanh, sống còn; an toàn.</td></tr>
<tr><td><strong>Nhường nhịn</strong></td><td>Thấp</td><td>Cao</td><td>Bạn sai, hoặc việc đó quan trọng với họ hơn.</td></tr>
<tr><td><strong>Né tránh</strong></td><td>Thấp</td><td>Thấp</td><td>Việc vặt, hoặc cần để cảm xúc nguội xuống.</td></tr>
<tr><td><strong>Thoả hiệp</strong></td><td>Vừa</td><td>Vừa</td><td>Quyền lực ngang nhau, gấp thời gian, "đủ tốt".</td></tr>
<tr><td><strong>Hợp tác</strong></td><td>Cao</td><td>Cao</td><td>Cả hai nhu cầu đều quan trọng; tìm win-win.</td></tr>
</table>
<p>Không phong cách nào "tốt nhất" — người khéo <strong>chọn</strong> phong cách hợp tình huống.</p>
<h3>Thương lượng dựa trên nguyên tắc</h3>
<ul>
<li><strong>Tách con người khỏi vấn đề</strong> — công vào vấn đề, không công vào người.</li>
<li><strong>Tập trung vào lợi ích, không vào lập trường</strong> — hỏi "vì sao bạn muốn thế?" để tìm nhu cầu thật.</li>
<li><strong>Nghĩ phương án đôi bên cùng lợi</strong> — làm chiếc bánh to hơn trước khi chia.</li>
<li><strong>Dùng tiêu chí khách quan</strong> — thống nhất một chuẩn công bằng, không phải ai to tiếng hơn.</li>
</ul>
<div class="callout"><span class="badge">Tình huống thực</span> Hai đồng đội cãi nhau chọn framework nào — cuộc chiến <em>lập trường</em>. Nước đi hợp tác hỏi lợi ích sau mỗi bên: một người muốn ra sản phẩm nhanh, người kia muốn dễ bảo trì. Họ thống nhất một tiêu chí (ra demo trước, rồi refactor) — một win-win mà "thắng thua" không tìm ra.</div>`,
  ]]);

const c6q = quiz('ssg105-quiz-6', 'Quiz 6 — Conflict & negotiation|||Quiz 6 — Xung đột & thương lượng', [
  { id: 'q1', question: 'Trong mô hình Thomas-Kilmann, phong cách vừa quyết đoán CAO vừa hợp tác CAO là?', options: ['Né tránh (avoiding)', 'Cạnh tranh (competing)', 'Hợp tác (collaborating)', 'Nhường nhịn (accommodating)'], correctIndex: 2, explanation: 'Collaborating: cả hai trục đều cao, hướng tới win-win.' },
  { id: 'q2', question: 'Nguyên tắc "tập trung vào lợi ích, không vào lập trường" nghĩa là?', options: ['Cứ giữ chặt yêu cầu ban đầu của mình', 'Hỏi nhu cầu thật đằng sau yêu cầu để tìm giải pháp chung', 'Tránh mọi thương lượng', 'Ai nói to hơn thì thắng'], correctIndex: 1, explanation: 'Tìm lợi ích thật (vì sao muốn thế) mở ra phương án đôi bên cùng lợi.' },
  { id: 'q3', question: 'Theo Thomas-Kilmann, khẳng định nào ĐÚNG?', options: ['Hợp tác luôn là lựa chọn tốt nhất mọi lúc', 'Né tránh luôn sai', 'Không phong cách nào tốt nhất; chọn theo tình huống', 'Chỉ nên dùng thoả hiệp'], correctIndex: 2, explanation: 'Người khéo chọn phong cách phù hợp bối cảnh, không có "một cỡ cho tất cả".' },
]);

// ── Chapter 7 — Leadership & motivation ──
const c7 = doc('ssg105-7-1-leadership', '7.1 — Leadership, motivation & group decisions|||7.1 — Lãnh đạo, tạo động lực & ra quyết định nhóm',
  'Lãnh đạo vs quản lý; phong cách lãnh đạo tình huống; tạo động lực (nội tại/ngoại tại, Maslow, autonomy-mastery-purpose); ra quyết định nhóm (đồng thuận, đa số, tránh groupthink).',
  [[
    `<span class="eyebrow">SSG105 · Chapter 7 · Lesson 7.1</span>
<h2>Leadership, motivation &amp; group decisions</h2>
<h3>Leadership is not a title</h3>
<p>You can lead without being "the boss". <strong>Management</strong> handles process and tasks; <strong>leadership</strong> sets direction and inspires people. In a student team, whoever keeps the group aligned and motivated is leading.</p>
<h3>Situational leadership</h3>
<p>Good leaders adapt their style to the team's readiness:</p>
<ul>
<li><strong>Directing</strong> — new members need clear instructions.</li>
<li><strong>Coaching</strong> — explain the "why" and build skill.</li>
<li><strong>Supporting</strong> — share decisions as confidence grows.</li>
<li><strong>Delegating</strong> — hand over ownership to a capable team.</li>
</ul>
<h3>Motivation</h3>
<ul>
<li><strong>Intrinsic</strong> — driven from within (interest, growth, purpose) — the most durable.</li>
<li><strong>Extrinsic</strong> — driven by external rewards (grades, praise, pay).</li>
</ul>
<p>Daniel Pink's <strong>Autonomy, Mastery, Purpose</strong> is a useful lens: people give their best when they have some control, are getting better, and see why the work matters. Recognising a teammate's effort costs nothing and motivates strongly.</p>
<h3>Group decision-making</h3>
<ul>
<li><strong>Consensus</strong> — everyone can live with it; slow but high buy-in.</li>
<li><strong>Majority vote</strong> — fast, but a minority may disengage.</li>
<li><strong>Leader decides (with input)</strong> — fast for urgent calls.</li>
</ul>
<p>Beware <strong>groupthink</strong> — the pressure to agree that silences doubts. Counter it by inviting dissent ("What are we missing?") and assigning a "devil's advocate".</p>
<div class="callout"><span class="badge">Real situation</span> A team leader notices the quiet member never speaks in meetings. Instead of deciding by loudest voice, she asks each person for one concern before the vote — surfacing a risk the group had missed. Good leadership makes it <em>safe</em> to disagree.</div>`,
    `<span class="eyebrow">SSG105 · Chương 7 · Bài 7.1</span>
<h2>Lãnh đạo, tạo động lực &amp; ra quyết định nhóm</h2>
<h3>Lãnh đạo không phải là chức danh</h3>
<p>Bạn có thể dẫn dắt mà không cần làm "sếp". <strong>Quản lý</strong> lo quy trình và công việc; <strong>lãnh đạo</strong> định hướng và truyền cảm hứng cho con người. Trong nhóm sinh viên, ai giữ nhóm cùng hướng và có động lực thì người đó đang lãnh đạo.</p>
<h3>Lãnh đạo theo tình huống</h3>
<p>Người dẫn dắt giỏi điều chỉnh phong cách theo mức sẵn sàng của nhóm:</p>
<ul>
<li><strong>Chỉ dẫn</strong> — thành viên mới cần hướng dẫn rõ ràng.</li>
<li><strong>Huấn luyện</strong> — giải thích "vì sao" và bồi kỹ năng.</li>
<li><strong>Hỗ trợ</strong> — chia sẻ quyết định khi sự tự tin tăng.</li>
<li><strong>Uỷ quyền</strong> — trao quyền làm chủ cho nhóm đã đủ năng lực.</li>
</ul>
<h3>Tạo động lực</h3>
<ul>
<li><strong>Nội tại</strong> — từ bên trong (hứng thú, phát triển, ý nghĩa) — bền nhất.</li>
<li><strong>Ngoại tại</strong> — từ phần thưởng bên ngoài (điểm, lời khen, tiền).</li>
</ul>
<p>Bộ ba <strong>Tự chủ, Tinh thông, Ý nghĩa</strong> của Daniel Pink là lăng kính hữu ích: người ta cống hiến hết mình khi có chút quyền chủ động, đang giỏi lên và thấy được vì sao công việc quan trọng. Ghi nhận nỗ lực của đồng đội không tốn gì mà tạo động lực rất mạnh.</p>
<h3>Ra quyết định nhóm</h3>
<ul>
<li><strong>Đồng thuận</strong> — ai cũng chấp nhận được; chậm nhưng gắn kết cao.</li>
<li><strong>Đa số biểu quyết</strong> — nhanh, nhưng thiểu số có thể mất gắn kết.</li>
<li><strong>Trưởng nhóm quyết (có lắng nghe)</strong> — nhanh cho việc gấp.</li>
</ul>
<p>Coi chừng <strong>tư duy bầy đàn (groupthink)</strong> — áp lực phải đồng ý làm im mọi nghi ngờ. Chống lại bằng cách mời phản biện ("Ta đang bỏ sót gì?") và cử một người "phản biện đối lập".</p>
<div class="callout"><span class="badge">Tình huống thực</span> Một trưởng nhóm để ý thành viên ít nói chưa từng phát biểu trong họp. Thay vì quyết theo người to tiếng nhất, cô hỏi mỗi người một mối lo trước khi biểu quyết — làm lộ một rủi ro cả nhóm đã bỏ sót. Lãnh đạo tốt khiến việc bất đồng trở nên <em>an toàn</em>.</div>`,
  ]]);

const c7q = quiz('ssg105-quiz-7', 'Quiz 7 — Leadership & motivation|||Quiz 7 — Lãnh đạo & động lực', [
  { id: 'q1', question: 'Động lực "nội tại" (intrinsic) đến từ đâu?', options: ['Điểm số và lời khen', 'Bên trong: hứng thú, phát triển, ý nghĩa', 'Tiền thưởng', 'Áp lực từ trưởng nhóm'], correctIndex: 1, explanation: 'Động lực nội tại đến từ bên trong (hứng thú/ý nghĩa) và bền hơn động lực ngoại tại.' },
  { id: 'q2', question: '"Groupthink" (tư duy bầy đàn) là gì và cách chống?', options: ['Nhóm quá đông; chia nhỏ ra', 'Áp lực phải đồng ý làm im nghi ngờ; mời phản biện, cử người phản biện đối lập', 'Nhóm không có trưởng; bầu trưởng', 'Họp quá dài; rút ngắn'], correctIndex: 1, explanation: 'Groupthink là áp lực đồng thuận bóp nghẹt nghi ngờ; chủ động mời bất đồng để chống lại.' },
  { id: 'q3', question: 'Theo lãnh đạo tình huống, với thành viên MỚI chưa quen việc nên?', options: ['Uỷ quyền hoàn toàn ngay', 'Chỉ dẫn rõ ràng (directing)', 'Bỏ mặc tự bơi', 'Chỉ động viên chung chung'], correctIndex: 1, explanation: 'Thành viên mới cần phong cách "chỉ dẫn" với hướng dẫn cụ thể.' },
]);

// ── Chapter 8 — Effective meetings ──
const c8 = doc('ssg105-8-1-meetings', '8.1 — Effective meetings, delegation & time|||8.1 — Họp hiệu quả, phân công & quản lý thời gian',
  'Họp có mục tiêu (agenda, đúng người, timebox, biên bản & action items); phân công rõ (RACI, ai làm gì hạn nào); quản lý thời gian nhóm (ưu tiên Eisenhower); công cụ cộng tác (Trello/Slack/Meet).',
  [[
    `<span class="eyebrow">SSG105 · Chapter 8 · Lesson 8.1</span>
<h2>Effective meetings, delegation &amp; time management</h2>
<h3>Meetings that don't waste time</h3>
<ul>
<li><strong>Agenda first</strong> — no agenda, no meeting. Share topics and a goal beforehand.</li>
<li><strong>Right people only</strong> — invite those who decide or contribute; others read the notes.</li>
<li><strong>Timebox</strong> — set a start and end; keep to it.</li>
<li><strong>Minutes &amp; action items</strong> — end with <em>who does what by when</em>. A meeting with no actions was a chat.</li>
</ul>
<h3>Delegation — who owns what</h3>
<p>Vague ownership kills projects ("I thought <em>you</em> were doing that"). The <strong>RACI</strong> model makes it explicit:</p>
<table>
<tr><th>Letter</th><th>Meaning</th></tr>
<tr><td><strong>R</strong> — Responsible</td><td>Does the work.</td></tr>
<tr><td><strong>A</strong> — Accountable</td><td>Owns the outcome (one person).</td></tr>
<tr><td><strong>C</strong> — Consulted</td><td>Gives input.</td></tr>
<tr><td><strong>I</strong> — Informed</td><td>Kept in the loop.</td></tr>
</table>
<h3>Managing the team's time</h3>
<p>Use the <strong>Eisenhower matrix</strong> to prioritise: do what's <em>urgent &amp; important</em> now, schedule what's <em>important but not urgent</em>, delegate the <em>urgent but not important</em>, and drop the rest. Track shared work on a <strong>Trello / kanban board</strong> so everyone sees status at a glance.</p>
<h3>Collaboration tools</h3>
<ul>
<li><strong>Trello</strong> — task board: To-do / Doing / Done, one owner per card.</li>
<li><strong>Slack</strong> — async discussion in topic channels.</li>
<li><strong>Google Meet</strong> — the live meeting, with the agenda open on screen.</li>
</ul>
<div class="callout"><span class="badge">Real situation</span> A group's weekly call runs 90 minutes with nothing decided. They add a 4-line agenda, a 30-minute timebox, and end each call by writing 3 action items with owners on Trello. Next week the project actually moves — same people, better process.</div>`,
    `<span class="eyebrow">SSG105 · Chương 8 · Bài 8.1</span>
<h2>Họp hiệu quả, phân công &amp; quản lý thời gian</h2>
<h3>Họp không phí thời gian</h3>
<ul>
<li><strong>Có agenda trước</strong> — không agenda thì không họp. Gửi trước chủ đề và mục tiêu.</li>
<li><strong>Chỉ đúng người</strong> — mời người quyết định hoặc đóng góp; còn lại đọc biên bản.</li>
<li><strong>Khống chế thời gian</strong> — đặt giờ bắt đầu và kết thúc; giữ đúng.</li>
<li><strong>Biên bản &amp; việc cần làm</strong> — kết thúc bằng <em>ai làm gì, hạn nào</em>. Họp không ra việc chỉ là buổi tán gẫu.</li>
</ul>
<h3>Phân công — ai phụ trách gì</h3>
<p>Phụ trách mập mờ giết dự án ("Tưởng <em>cậu</em> làm cái đó chứ"). Mô hình <strong>RACI</strong> làm nó rõ ràng:</p>
<table>
<tr><th>Chữ</th><th>Nghĩa</th></tr>
<tr><td><strong>R</strong> — Responsible</td><td>Người làm việc.</td></tr>
<tr><td><strong>A</strong> — Accountable</td><td>Người chịu trách nhiệm kết quả (một người).</td></tr>
<tr><td><strong>C</strong> — Consulted</td><td>Người được hỏi ý kiến.</td></tr>
<tr><td><strong>I</strong> — Informed</td><td>Người được cập nhật.</td></tr>
</table>
<h3>Quản lý thời gian của nhóm</h3>
<p>Dùng <strong>ma trận Eisenhower</strong> để ưu tiên: làm ngay việc <em>khẩn &amp; quan trọng</em>, lên lịch việc <em>quan trọng nhưng chưa khẩn</em>, uỷ thác việc <em>khẩn nhưng không quan trọng</em>, và bỏ phần còn lại. Theo dõi việc chung trên <strong>bảng Trello / kanban</strong> để ai cũng thấy trạng thái trong nháy mắt.</p>
<h3>Công cụ cộng tác</h3>
<ul>
<li><strong>Trello</strong> — bảng việc: Cần làm / Đang làm / Xong, mỗi thẻ một người phụ trách.</li>
<li><strong>Slack</strong> — thảo luận bất đồng bộ trong kênh theo chủ đề.</li>
<li><strong>Google Meet</strong> — buổi họp trực tiếp, mở agenda trên màn hình.</li>
</ul>
<div class="callout"><span class="badge">Tình huống thực</span> Buổi gọi hằng tuần của một nhóm kéo 90 phút mà chẳng quyết được gì. Họ thêm agenda 4 dòng, khống chế 30 phút, và kết thúc mỗi buổi bằng viết 3 việc kèm người phụ trách lên Trello. Tuần sau dự án thật sự nhúc nhích — cùng người, quy trình tốt hơn.</div>`,
  ]]);

const c8q = quiz('ssg105-quiz-8', 'Quiz 8 — Effective meetings|||Quiz 8 — Họp hiệu quả', [
  { id: 'q1', question: 'Một cuộc họp hiệu quả nên kết thúc bằng?', options: ['Một cuộc tán gẫu dài', 'Danh sách việc cần làm: ai làm gì, hạn nào', 'Không có gì, để lần sau tính', 'Chỉ một lời cảm ơn'], correctIndex: 1, explanation: 'Action items rõ ràng (ai/gì/hạn) biến cuộc họp thành hành động thật.' },
  { id: 'q2', question: 'Trong mô hình RACI, chữ "A" (Accountable) nghĩa là?', options: ['Người được hỏi ý kiến', 'Người chịu trách nhiệm cuối cùng cho kết quả (một người)', 'Người chỉ cần được thông báo', 'Tất cả cùng làm'], correctIndex: 1, explanation: 'Accountable là người duy nhất chịu trách nhiệm về kết quả cuối.' },
  { id: 'q3', question: 'Ma trận Eisenhower xử lý việc "khẩn nhưng KHÔNG quan trọng" bằng cách?', options: ['Làm ngay đầu tiên', 'Lên lịch làm sau', 'Uỷ thác cho người khác', 'Bỏ hẳn không làm'], correctIndex: 2, explanation: 'Việc khẩn mà không quan trọng nên được uỷ thác để dành sức cho việc quan trọng.' },
]);

// ── Chapter 9 — Cross-cultural, ethics & feedback ──
const c9 = doc('ssg105-9-1-culture-ethics', '9.1 — Cross-cultural, ethical communication & feedback|||9.1 — Giao tiếp đa văn hoá, đạo đức & phản hồi',
  'Giao tiếp đa văn hoá (high/low-context, khoảng cách quyền lực, trực tiếp/gián tiếp, múi giờ trong nhóm remote); đạo đức giao tiếp (trung thực, tôn trọng, riêng tư, tránh tin giả); phản hồi xây dựng (SBI, khen-góp ý cụ thể).',
  [[
    `<span class="eyebrow">SSG105 · Chapter 9 · Lesson 9.1</span>
<h2>Cross-cultural, ethical communication &amp; feedback</h2>
<h3>Communicating across cultures</h3>
<p>Software teams are global — your teammates or clients may be in another country. Culture shapes communication:</p>
<ul>
<li><strong>High-context vs low-context</strong> — some cultures rely on implied meaning &amp; relationship (high-context); others value explicit, direct words (low-context).</li>
<li><strong>Power distance</strong> — how freely people question a senior differs by culture.</li>
<li><strong>Direct vs indirect</strong> — "That won't work" vs "That's interesting, maybe we could also…" can mean the same thing.</li>
<li><strong>Practical basics</strong> — respect time zones, avoid idioms/slang that don't translate, and confirm understanding in writing.</li>
</ul>
<h3>Ethical communication</h3>
<ul>
<li><strong>Be honest</strong> — don't misrepresent status ("it's almost done" when it isn't) or take credit for others' work.</li>
<li><strong>Respect privacy &amp; confidentiality</strong> — don't share private messages or data.</li>
<li><strong>Be respectful &amp; inclusive</strong> — no discriminatory or demeaning language.</li>
<li><strong>Don't spread unverified information</strong> — check before you forward.</li>
</ul>
<h3>Constructive feedback — the SBI model</h3>
<p>Give feedback that helps, not hurts:</p>
<ul>
<li><strong>S — Situation:</strong> "In today's stand-up…"</li>
<li><strong>B — Behaviour:</strong> "…you interrupted Lan twice before she finished."</li>
<li><strong>I — Impact:</strong> "…and she stopped sharing her idea, which we needed."</li>
</ul>
<p>Feedback should be <strong>specific, timely, about behaviour not personality</strong>, and paired with what to do next. Praise the same way — specific praise ("your API docs made my part easy") means far more than "good job".</p>
<div class="callout"><span class="badge">Real situation</span> A reviewer writes "this code is bad." Useless and hurtful. Rewritten with SBI: "In this PR (S), the function does three things at once (B), which makes it hard to test and review (I) — could we split it into three?" Same concern, now it teaches instead of wounds.</div>`,
    `<span class="eyebrow">SSG105 · Chương 9 · Bài 9.1</span>
<h2>Giao tiếp đa văn hoá, đạo đức &amp; phản hồi</h2>
<h3>Giao tiếp giữa các nền văn hoá</h3>
<p>Đội ngũ phần mềm mang tính toàn cầu — đồng đội hay khách hàng của bạn có thể ở nước khác. Văn hoá định hình cách giao tiếp:</p>
<ul>
<li><strong>Ngữ cảnh cao vs thấp</strong> — một số văn hoá dựa vào ý ngầm &amp; quan hệ (ngữ cảnh cao); số khác coi trọng lời rõ ràng, trực tiếp (ngữ cảnh thấp).</li>
<li><strong>Khoảng cách quyền lực</strong> — mức độ người ta thoải mái chất vấn cấp trên khác nhau theo văn hoá.</li>
<li><strong>Trực tiếp vs gián tiếp</strong> — "Cái đó không được đâu" và "Thú vị đấy, hay là ta cũng thử…" có thể cùng một ý.</li>
<li><strong>Điều cơ bản</strong> — tôn trọng múi giờ, tránh thành ngữ/tiếng lóng khó dịch, và xác nhận lại bằng văn bản.</li>
</ul>
<h3>Đạo đức trong giao tiếp</h3>
<ul>
<li><strong>Trung thực</strong> — đừng khai gian tiến độ ("sắp xong" khi chưa) hay nhận công của người khác.</li>
<li><strong>Tôn trọng riêng tư &amp; bảo mật</strong> — không chia sẻ tin nhắn hay dữ liệu riêng.</li>
<li><strong>Tôn trọng &amp; bao dung</strong> — không dùng lời phân biệt hay hạ thấp.</li>
<li><strong>Không lan truyền thông tin chưa kiểm chứng</strong> — kiểm tra trước khi chuyển tiếp.</li>
</ul>
<h3>Phản hồi xây dựng — mô hình SBI</h3>
<p>Phản hồi để giúp, không phải để làm tổn thương:</p>
<ul>
<li><strong>S — Tình huống (Situation):</strong> "Trong buổi stand-up hôm nay…"</li>
<li><strong>B — Hành vi (Behaviour):</strong> "…bạn đã ngắt lời Lan hai lần khi bạn ấy chưa nói xong."</li>
<li><strong>I — Tác động (Impact):</strong> "…và bạn ấy ngừng chia sẻ ý tưởng mà nhóm đang cần."</li>
</ul>
<p>Phản hồi nên <strong>cụ thể, đúng lúc, nói về hành vi chứ không về tính cách</strong>, và kèm gợi ý làm gì tiếp theo. Khen cũng vậy — lời khen cụ thể ("tài liệu API của bạn làm phần mình dễ hẳn") có ý nghĩa hơn nhiều so với "làm tốt lắm".</p>
<div class="callout"><span class="badge">Tình huống thực</span> Một người review viết "code này dở." Vô ích và gây tổn thương. Viết lại theo SBI: "Trong PR này (S), hàm này làm ba việc cùng lúc (B), khiến khó test và review (I) — hay ta tách thành ba hàm nhé?" Cùng mối lo, giờ nó dạy thay vì đâm.</div>`,
  ]]);

const c9q = quiz('ssg105-quiz-9', 'Quiz 9 — Culture, ethics & feedback|||Quiz 9 — Văn hoá, đạo đức & phản hồi', [
  { id: 'q1', question: 'Trong mô hình phản hồi SBI, ba chữ S-B-I lần lượt là?', options: ['Speed - Budget - Impact', 'Situation - Behaviour - Impact (Tình huống - Hành vi - Tác động)', 'Story - Belief - Idea', 'Start - Break - Improve'], correctIndex: 1, explanation: 'SBI = Situation (tình huống), Behaviour (hành vi), Impact (tác động) — mô tả cụ thể, khách quan.' },
  { id: 'q2', question: 'Phản hồi mang tính xây dựng nên?', options: ['Nói về tính cách con người', 'Cụ thể, đúng lúc, nói về hành vi và kèm gợi ý tiếp theo', 'Càng chung chung càng an toàn', 'Chỉ nêu điểm xấu, không khen'], correctIndex: 1, explanation: 'Phản hồi tốt cụ thể, kịp thời, về hành vi (không phải con người), có hướng cải thiện.' },
  { id: 'q3', question: 'Trong nhóm làm việc đa văn hoá/remote, điều nào nên làm?', options: ['Dùng nhiều thành ngữ, tiếng lóng bản địa', 'Bỏ qua múi giờ của người khác', 'Tôn trọng múi giờ, nói rõ ràng, xác nhận lại bằng văn bản', 'Giả định ai cũng giao tiếp giống mình'], correctIndex: 2, explanation: 'Tôn trọng múi giờ, tránh idiom khó dịch, và xác nhận bằng văn bản giúp giảm hiểu lầm.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'SSG105',
    slug: 'ssg105-communication-and-in-group-working-skills',
    title: 'Communication and In-Group Working Skills',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SSG105.webp',
    shortDescription: 'Communication & teamwork for software engineers — the communication model, active listening, writing, presenting, team roles & stages, conflict, leadership, effective meetings and cross-cultural, ethical communication. Bilingual, with real situations & quizzes.|||Kỹ năng giao tiếp & làm việc nhóm cho kỹ sư phần mềm — mô hình giao tiếp, lắng nghe, viết, thuyết trình, vai trò & giai đoạn nhóm, xung đột, lãnh đạo, họp hiệu quả và giao tiếp đa văn hoá. Song ngữ, có tình huống thực & quiz.',
    description: 'Môn <strong>SSG105 — Communication and In-Group Working Skills</strong> (kỳ 4) rèn <strong>kỹ năng giao tiếp và làm việc nhóm</strong> — thứ quyết định sự nghiệp kỹ sư phần mềm không kém khả năng lập trình. Từ <strong>mô hình giao tiếp</strong> (người gửi–người nhận, kênh, nhiễu, phản hồi; lời &amp; phi ngôn ngữ) → <strong>lắng nghe chủ động &amp; đồng cảm</strong> → <strong>giao tiếp văn bản</strong> (email, chat công việc) → <strong>thuyết trình</strong> → <strong>làm việc nhóm</strong> (vai trò Belbin, giai đoạn Tuckman) → <strong>xung đột &amp; thương lượng</strong> (Thomas-Kilmann) → <strong>lãnh đạo &amp; tạo động lực</strong> → <strong>họp hiệu quả &amp; phân công</strong> → <strong>giao tiếp đa văn hoá, đạo đức &amp; phản hồi xây dựng</strong>. Bám giáo trình FLM, song ngữ, có tình huống thực và quiz mỗi chương.',
    whatYouLearn: 'Mô hình giao tiếp & các loại nhiễu; giao tiếp phi ngôn ngữ; lắng nghe chủ động (paraphrase, câu hỏi mở/đóng, đồng cảm); viết email & chat chuyên nghiệp (7C); thuyết trình (cấu trúc, slide, kiểm soát lo lắng, ngôn ngữ cơ thể); vai trò nhóm Belbin & giai đoạn Tuckman; mục tiêu SMART; giải quyết xung đột & thương lượng (Thomas-Kilmann, win-win); lãnh đạo tình huống, tạo động lực & tránh groupthink; họp hiệu quả (agenda, RACI, Eisenhower, Trello/Slack/Meet); giao tiếp đa văn hoá, đạo đức & phản hồi SBI.',
    requirements: 'Không cần kiến thức kỹ thuật trước. Tinh thần cởi mở luyện tập trong các đồ án/nhóm thực tế. Nên có một nhóm học tập để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu miễn phí, YouTube, công cụ cộng tác, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao kỹ năng mềm quan trọng; lộ trình 9 chương.', lessons: [intro] },
    { title: 'Chương 1 — Giao tiếp là gì|||Chapter 1 — What is communication', description: 'Mô hình sender-receiver, nhiễu, lời & phi ngôn ngữ.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Lắng nghe chủ động|||Chapter 2 — Active listening', description: 'Nghe để hiểu, câu hỏi mở/đóng, đồng cảm.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Giao tiếp văn bản|||Chapter 3 — Written communication', description: 'Email, chat công việc, 7C, giọng điệu.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thuyết trình|||Chapter 4 — Presentations', description: 'Chuẩn bị, cấu trúc, slide, lo lắng, ngôn ngữ cơ thể.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Làm việc nhóm|||Chapter 5 — Teamwork', description: 'Vai trò Belbin, giai đoạn Tuckman, mục tiêu SMART.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Xung đột & thương lượng|||Chapter 6 — Conflict & negotiation', description: 'Thomas-Kilmann, thương lượng win-win.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Lãnh đạo & động lực|||Chapter 7 — Leadership & motivation', description: 'Lãnh đạo tình huống, động lực, ra quyết định nhóm.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Họp hiệu quả|||Chapter 8 — Effective meetings', description: 'Agenda, RACI, Eisenhower, công cụ cộng tác.', lessons: [c8, c8q] },
    { title: 'Chương 9 — Đa văn hoá, đạo đức & phản hồi|||Chapter 9 — Culture, ethics & feedback', description: 'Giao tiếp đa văn hoá, đạo đức, phản hồi SBI.', lessons: [c9, c9q] },
  ],
};
