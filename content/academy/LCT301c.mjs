/**
 * LCT301c — Leadership and Critical Thinking (Lãnh đạo và Tư duy phản biện).
 * Ngành Khoa học Máy tính, Kỳ 6 (FPTU). Song ngữ VI+EN, 8 chương.
 * Giáo trình trích dẫn (KHÔNG upload PDF): Sinek "Leaders Eat Last" &
 * "Start With Why"; Covey "7 Habits"; Kahneman "Thinking, Fast and Slow";
 * Moore/Parker "Critical Thinking"; Goleman "Emotional Intelligence".
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('lct301c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách nền tảng (Sinek, Covey, Kahneman, Goleman, Moore/Parker), tài liệu miễn phí, TED talks, công cụ, lộ trình.',
  [[
    `<span class="eyebrow">LCT301c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to grow as a <strong>leader</strong> and a <strong>critical thinker</strong> — from emotional intelligence and team motivation to logic, cognitive bias and systems thinking — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for LCT301c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Foundational books</h3>
<ul>
<li><a href="https://simonsinek.com/books/start-with-why/" target="_blank" rel="noopener"><em>Start With Why</em> — Simon Sinek</a></li>
<li><a href="https://simonsinek.com/books/leaders-eat-last/" target="_blank" rel="noopener"><em>Leaders Eat Last</em> — Simon Sinek</a></li>
<li><a href="https://www.franklincovey.com/the-7-habits/" target="_blank" rel="noopener"><em>The 7 Habits of Highly Effective People</em> — Stephen Covey</a></li>
<li><a href="https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow" target="_blank" rel="noopener"><em>Thinking, Fast and Slow</em> — Daniel Kahneman</a></li>
<li><a href="https://en.wikipedia.org/wiki/Emotional_Intelligence_(book)" target="_blank" rel="noopener"><em>Emotional Intelligence</em> — Daniel Goleman</a></li>
</ul>
<h3>🌐 Free logic &amp; thinking resources</h3>
<ul>
<li><a href="https://yourlogicalfallacyis.com/" target="_blank" rel="noopener">Your Logical Fallacy Is — a field guide to fallacies</a></li>
<li><a href="https://yourbias.is/" target="_blank" rel="noopener">Your Bias Is — a field guide to cognitive biases</a></li>
</ul>
<h3>▶️ Talks &amp; videos</h3>
<ul>
<li><a href="https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action" target="_blank" rel="noopener">Simon Sinek — How great leaders inspire action</a></li>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED — talks on leadership, decisions &amp; thinking</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.mindtools.com/" target="_blank" rel="noopener">MindTools — leadership &amp; decision frameworks</a></li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro — mind maps, fishbone &amp; systems diagrams</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what leadership is, styles, and self-leadership (emotional intelligence).</li>
<li><strong>People</strong> — communication, motivation, decisions and conflict.</li>
<li><strong>Thinking</strong> — arguments, fallacies, cognitive bias, problem-solving and systems thinking.</li>
<li><strong>Applied</strong> — leading in tech teams, ethics, and change management.</li>
</ol></div>`,
    `<span class="eyebrow">LCT301c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để trưởng thành thành một <strong>người lãnh đạo</strong> và một <strong>người tư duy phản biện</strong> — từ trí tuệ cảm xúc, tạo động lực đội nhóm đến logic, thiên kiến nhận thức và tư duy hệ thống — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của LCT301c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><a href="https://simonsinek.com/books/start-with-why/" target="_blank" rel="noopener"><em>Start With Why</em> — Simon Sinek</a></li>
<li><a href="https://simonsinek.com/books/leaders-eat-last/" target="_blank" rel="noopener"><em>Leaders Eat Last</em> — Simon Sinek</a></li>
<li><a href="https://www.franklincovey.com/the-7-habits/" target="_blank" rel="noopener"><em>The 7 Habits of Highly Effective People</em> — Stephen Covey</a></li>
<li><a href="https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow" target="_blank" rel="noopener"><em>Thinking, Fast and Slow</em> — Daniel Kahneman</a></li>
<li><a href="https://en.wikipedia.org/wiki/Emotional_Intelligence_(book)" target="_blank" rel="noopener"><em>Emotional Intelligence</em> — Daniel Goleman</a></li>
</ul>
<h3>🌐 Tài liệu logic &amp; tư duy miễn phí</h3>
<ul>
<li><a href="https://yourlogicalfallacyis.com/" target="_blank" rel="noopener">Your Logical Fallacy Is — cẩm nang nguỵ biện</a></li>
<li><a href="https://yourbias.is/" target="_blank" rel="noopener">Your Bias Is — cẩm nang thiên kiến nhận thức</a></li>
</ul>
<h3>▶️ Bài nói &amp; video</h3>
<ul>
<li><a href="https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action" target="_blank" rel="noopener">Simon Sinek — Người lãnh đạo giỏi truyền cảm hứng hành động thế nào</a></li>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED — các bài nói về lãnh đạo, ra quyết định &amp; tư duy</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.mindtools.com/" target="_blank" rel="noopener">MindTools — khung lãnh đạo &amp; ra quyết định</a></li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro — sơ đồ tư duy, xương cá &amp; sơ đồ hệ thống</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — lãnh đạo là gì, các phong cách, và lãnh đạo bản thân (trí tuệ cảm xúc).</li>
<li><strong>Con người</strong> — giao tiếp, tạo động lực, ra quyết định và giải quyết xung đột.</li>
<li><strong>Tư duy</strong> — lập luận, nguỵ biện, thiên kiến, giải quyết vấn đề và tư duy hệ thống.</li>
<li><strong>Ứng dụng</strong> — lãnh đạo trong đội công nghệ, đạo đức, và quản lý thay đổi.</li>
</ol></div>`,
  ]]);

const intro = doc('lct301c-0-1-overview', 'Course overview: Leadership & Critical Thinking|||Tổng quan: Lãnh đạo & Tư duy phản biện',
  'Vì sao kỹ sư cần lãnh đạo & tư duy phản biện; hai trụ cột của môn; lộ trình 8 chương: từ phong cách lãnh đạo, trí tuệ cảm xúc, giao tiếp, ra quyết định đến logic, nguỵ biện, tư duy hệ thống và lãnh đạo trong công nghệ.',
  [[
    `<span class="eyebrow">LCT301c · Lesson 0.1 · Overview</span>
<h2>Leadership &amp; Critical Thinking</h2>
<p class="lead">Great engineers are not just good at code — they <strong>lead people</strong> and <strong>think clearly under pressure</strong>. This course builds two skills that decide whether your technical talent turns into real impact: <strong>leadership</strong> (moving a team toward a goal) and <strong>critical thinking</strong> (judging claims and choices on evidence, not on gut or noise).</p>
<h3>Two pillars</h3>
<ul>
<li><strong>Leadership</strong> — self-awareness, communication, motivation, decisions and conflict. Not a title; a set of behaviours anyone can learn.</li>
<li><strong>Critical thinking</strong> — arguments &amp; evidence, spotting fallacies and biases, structured problem-solving and systems thinking.</li>
</ul>
<h3>Why it matters for a CS student</h3>
<p>You will run standups, review pull requests, argue for a design, estimate under uncertainty, and mediate disagreement. Every one of those is a leadership or a thinking task — the compiler will not do it for you.</p>
<h3>Roadmap — 8 chapters</h3>
<pre><code>Ch1  What leadership is + leadership styles
Ch2  Emotional intelligence + self-leadership
Ch3  Communication, inspiration + team motivation
Ch4  Decision-making + conflict resolution
Ch5  Intro to critical thinking + arguments
Ch6  Fallacies + cognitive biases
Ch7  Problem-solving + systems thinking
Ch8  Leading in tech: ethics + change management
</code></pre>
<div class="callout"><span class="badge">How to study</span> Each chapter pairs a bilingual reading with a 3-question quiz. Read actively — try each framework on a real situation from your own team or project.</div>`,
    `<span class="eyebrow">LCT301c · Bài 0.1 · Tổng quan</span>
<h2>Lãnh đạo &amp; Tư duy phản biện</h2>
<p class="lead">Kỹ sư giỏi không chỉ giỏi code — họ <strong>dẫn dắt con người</strong> và <strong>tư duy sáng rõ dưới áp lực</strong>. Môn này rèn hai kỹ năng quyết định việc tài năng kỹ thuật của bạn có biến thành ảnh hưởng thật hay không: <strong>lãnh đạo</strong> (đưa một đội tới mục tiêu) và <strong>tư duy phản biện</strong> (xét đoán khẳng định và lựa chọn dựa trên bằng chứng, không theo cảm tính hay ồn ào).</p>
<h3>Hai trụ cột</h3>
<ul>
<li><strong>Lãnh đạo</strong> — tự nhận thức, giao tiếp, tạo động lực, ra quyết định và xử lý xung đột. Không phải một chức danh; là tập hợp hành vi ai cũng học được.</li>
<li><strong>Tư duy phản biện</strong> — lập luận &amp; bằng chứng, nhận diện nguỵ biện và thiên kiến, giải quyết vấn đề có cấu trúc và tư duy hệ thống.</li>
</ul>
<h3>Vì sao quan trọng với sinh viên CNTT</h3>
<p>Bạn sẽ chủ trì standup, review pull request, bảo vệ một thiết kế, ước lượng trong bất định, và hoà giải bất đồng. Mỗi việc đó đều là một bài toán lãnh đạo hoặc tư duy — trình biên dịch không làm hộ bạn.</p>
<h3>Lộ trình — 8 chương</h3>
<pre><code>Ch1  Lãnh đạo là gì + các phong cách lãnh đạo
Ch2  Trí tuệ cảm xúc + lãnh đạo bản thân
Ch3  Giao tiếp, truyền cảm hứng + tạo động lực đội
Ch4  Ra quyết định + giải quyết xung đột
Ch5  Nhập môn tư duy phản biện + lập luận
Ch6  Nguỵ biện + thiên kiến nhận thức
Ch7  Giải quyết vấn đề + tư duy hệ thống
Ch8  Lãnh đạo trong công nghệ: đạo đức + quản lý thay đổi
</code></pre>
<div class="callout"><span class="badge">Cách học</span> Mỗi chương gồm một bài đọc song ngữ và một quiz 3 câu. Hãy đọc chủ động — thử mỗi khung lên một tình huống thật từ đội hoặc dự án của bạn.</div>`,
  ]]);

const c1 = doc('lct301c-1-1-what-is-leadership', '1.1 — What leadership is & leadership styles|||1.1 — Lãnh đạo là gì & các phong cách lãnh đạo',
  'Lãnh đạo vs quản lý; lãnh đạo là hành vi không phải chức danh; các phong cách (chuyên quyền, dân chủ, buông lơi, phục vụ, chuyển hoá); lãnh đạo tình huống — chọn phong cách theo bối cảnh & mức trưởng thành của đội.',
  [[
    `<span class="eyebrow">LCT301c · Chapter 1 · Lesson 1.1</span>
<h2>What leadership is &amp; leadership styles</h2>
<h3>Leadership vs management</h3>
<p>They overlap but are not the same. <strong>Management</strong> is about systems — plans, budgets, tasks, control — doing things right. <strong>Leadership</strong> is about people and direction — vision, alignment, motivation — doing the right things. A good tech lead needs both, but the two ask different questions.</p>
<h3>It is a behaviour, not a title</h3>
<p>You do not need "manager" on your badge to lead. A junior who unblocks teammates, names the real problem in a meeting, or sets a standard by example is leading. Leadership is influence, earned — the title only grants authority.</p>
<h3>Common leadership styles</h3>
<ul>
<li><strong>Autocratic</strong> — the leader decides alone. Fast; good in a crisis, poor for engagement.</li>
<li><strong>Democratic / participative</strong> — decisions with the team's input. Slower, but higher buy-in and better ideas.</li>
<li><strong>Laissez-faire</strong> — hands-off, high autonomy. Works with expert, self-driven people; fails with juniors.</li>
<li><strong>Servant leadership</strong> — the leader serves the team's needs first (Sinek: "Leaders Eat Last"). Builds trust and safety.</li>
<li><strong>Transformational</strong> — inspires around a shared vision and growth; raises the whole team's ambition.</li>
</ul>
<h3>Situational leadership</h3>
<p>There is no single best style. <strong>Situational leadership</strong> says: match your style to the situation and the team's maturity.</p>
<pre><code>Follower readiness      -> Best leader style
Low skill,  low will    -> Directing  (tell)
Low skill,  high will    -> Coaching   (sell)
High skill, low will    -> Supporting (participate)
High skill, high will    -> Delegating (hand off)
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Great leaders read the room and change their approach — a new intern and a senior architect should not be led the same way.</div>`,
    `<span class="eyebrow">LCT301c · Chương 1 · Bài 1.1</span>
<h2>Lãnh đạo là gì &amp; các phong cách lãnh đạo</h2>
<h3>Lãnh đạo và quản lý</h3>
<p>Hai thứ chồng lấn nhưng không giống nhau. <strong>Quản lý</strong> nói về hệ thống — kế hoạch, ngân sách, đầu việc, kiểm soát — làm việc cho đúng cách. <strong>Lãnh đạo</strong> nói về con người và phương hướng — tầm nhìn, đồng thuận, động lực — làm đúng việc cần làm. Một tech lead giỏi cần cả hai, nhưng hai vai đặt ra những câu hỏi khác nhau.</p>
<h3>Là hành vi, không phải chức danh</h3>
<p>Bạn không cần chữ "quản lý" trên thẻ để lãnh đạo. Một bạn junior gỡ vướng cho đồng đội, gọi tên đúng vấn đề trong cuộc họp, hay nêu chuẩn bằng chính việc mình làm — đều đang lãnh đạo. Lãnh đạo là ảnh hưởng, phải giành được — chức danh chỉ trao quyền lực.</p>
<h3>Các phong cách lãnh đạo phổ biến</h3>
<ul>
<li><strong>Chuyên quyền</strong> — người lãnh đạo tự quyết một mình. Nhanh; hợp lúc khủng hoảng, kém về gắn kết.</li>
<li><strong>Dân chủ / có tham gia</strong> — quyết định có ý kiến của đội. Chậm hơn, nhưng đồng thuận cao và ý tưởng tốt hơn.</li>
<li><strong>Buông lơi (laissez-faire)</strong> — ít can thiệp, tự chủ cao. Hợp với người giỏi, tự thân vận động; hỏng với junior.</li>
<li><strong>Lãnh đạo phục vụ</strong> — người lãnh đạo lo nhu cầu của đội trước (Sinek: "Leaders Eat Last"). Xây niềm tin và an toàn.</li>
<li><strong>Chuyển hoá (transformational)</strong> — truyền cảm hứng quanh một tầm nhìn chung và sự trưởng thành; nâng tầm khát vọng cả đội.</li>
</ul>
<h3>Lãnh đạo tình huống</h3>
<p>Không có một phong cách tốt nhất duy nhất. <strong>Lãnh đạo tình huống</strong> nói: hãy khớp phong cách với bối cảnh và mức trưởng thành của đội.</p>
<pre><code>Mức sẵn sàng của thành viên  -> Phong cách hợp
Kém kỹ năng, kém ý chí        -> Chỉ đạo   (tell)
Kém kỹ năng, cao ý chí        -> Kèm cặp   (sell)
Giỏi kỹ năng, kém ý chí        -> Hỗ trợ    (participate)
Giỏi kỹ năng, cao ý chí        -> Giao phó  (delegate)
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Người lãnh đạo giỏi đọc được tình huống và đổi cách tiếp cận — một intern mới và một kiến trúc sư kỳ cựu không nên được dẫn dắt giống nhau.</div>`,
  ]]);

const c1q = quiz('lct301c-quiz-1', 'Quiz 1 — Leadership & styles|||Quiz 1 — Lãnh đạo & phong cách', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa lãnh đạo và quản lý là gì?', options: ['Chúng hoàn toàn giống nhau', 'Quản lý lo hệ thống/quy trình (làm đúng cách), lãnh đạo lo con người/phương hướng (làm đúng việc)', 'Lãnh đạo chỉ dành cho người có chức danh giám đốc', 'Quản lý không cần kế hoạch'], correctIndex: 1, explanation: 'Quản lý nghiêng về hệ thống và kiểm soát; lãnh đạo nghiêng về tầm nhìn, con người và động lực.' },
  { id: 'q2', question: 'Theo lãnh đạo tình huống, với một đội giỏi kỹ năng và cao ý chí thì phong cách hợp nhất là?', options: ['Chỉ đạo sát sao (directing)', 'Giao phó (delegating)', 'Chuyên quyền tuyệt đối', 'Không giao việc gì'], correctIndex: 1, explanation: 'Người vừa giỏi vừa có động lực nên được giao phó và trao quyền tự chủ, không cần chỉ đạo từng bước.' },
  { id: 'q3', question: 'Phong cách "lãnh đạo phục vụ" (servant leadership) theo Simon Sinek nhấn mạnh điều gì?', options: ['Người lãnh đạo hưởng lợi trước tiên', 'Người lãnh đạo lo cho nhu cầu của đội trước, xây niềm tin và an toàn', 'Ra quyết định một mình cho nhanh', 'Buông lơi hoàn toàn để đội tự lo'], correctIndex: 1, explanation: '"Leaders Eat Last" — người lãnh đạo đặt nhu cầu đội lên trước, tạo môi trường tin cậy và an toàn.' },
]);

const c2 = doc('lct301c-2-1-emotional-intelligence', '2.1 — Emotional intelligence & self-leadership|||2.1 — Trí tuệ cảm xúc & lãnh đạo bản thân',
  'Trí tuệ cảm xúc (EQ) theo Goleman: tự nhận thức, tự điều chỉnh, động lực nội tại, đồng cảm, kỹ năng xã hội; vì sao EQ dự báo lãnh đạo tốt hơn IQ; lãnh đạo bản thân — thói quen chủ động của Covey.',
  [[
    `<span class="eyebrow">LCT301c · Chapter 2 · Lesson 2.1</span>
<h2>Emotional intelligence &amp; self-leadership</h2>
<h3>What EQ is</h3>
<p><strong>Emotional intelligence (EQ)</strong> is the ability to recognise and manage your own emotions and to read and respond to others'. Daniel Goleman argues that in leadership roles, <strong>EQ predicts success better than IQ</strong> — smart people who cannot manage themselves or connect with others rarely lead well.</p>
<h3>Goleman's five components</h3>
<pre><code>Inward (managing yourself)
  1. Self-awareness   - knowing what you feel and why
  2. Self-regulation  - pausing instead of reacting
  3. Motivation       - inner drive beyond reward/fear
Outward (managing relationships)
  4. Empathy          - sensing what others feel
  5. Social skill     - building rapport and trust
</code></pre>
<h3>Self-leadership first</h3>
<p>You cannot lead others if you cannot lead yourself. This is where Covey's <em>7 Habits</em> begins:</p>
<ul>
<li><strong>Be proactive</strong> — you choose your response; you are not just a product of what happens to you.</li>
<li><strong>Begin with the end in mind</strong> — act from your goals and values, not the loudest urgency.</li>
<li><strong>Put first things first</strong> — spend time on what is important, not only what is urgent.</li>
</ul>
<h3>The pause between trigger and response</h3>
<p>Between a stimulus (a harsh code review, a broken build at 5pm) and your response there is a gap. Self-regulation is the skill of <em>using</em> that gap — naming the emotion, breathing, then choosing — instead of firing off the angry Slack message.</p>
<div class="callout"><span class="badge">Try it</span> Next time you feel a flash of anger in a review, wait 60 seconds and rewrite. That single habit is self-regulation in action.</div>`,
    `<span class="eyebrow">LCT301c · Chương 2 · Bài 2.1</span>
<h2>Trí tuệ cảm xúc &amp; lãnh đạo bản thân</h2>
<h3>EQ là gì</h3>
<p><strong>Trí tuệ cảm xúc (EQ)</strong> là khả năng nhận ra và điều tiết cảm xúc của chính mình, đồng thời đọc và phản hồi cảm xúc người khác. Daniel Goleman lập luận rằng ở vai trò lãnh đạo, <strong>EQ dự báo thành công tốt hơn IQ</strong> — người thông minh nhưng không quản được bản thân hay không kết nối được với người khác hiếm khi dẫn dắt tốt.</p>
<h3>Năm thành phần của Goleman</h3>
<pre><code>Hướng vào trong (quản lý bản thân)
  1. Tự nhận thức     - biết mình đang cảm thấy gì và vì sao
  2. Tự điều chỉnh    - dừng lại thay vì phản ứng bộc phát
  3. Động lực         - động lực nội tại, vượt trên thưởng/phạt
Hướng ra ngoài (quản lý quan hệ)
  4. Đồng cảm         - cảm nhận điều người khác đang trải qua
  5. Kỹ năng xã hội   - tạo thiện cảm và niềm tin
</code></pre>
<h3>Lãnh đạo bản thân trước tiên</h3>
<p>Bạn không thể dẫn người khác nếu chưa dẫn được chính mình. Đây là chỗ <em>7 Thói quen</em> của Covey bắt đầu:</p>
<ul>
<li><strong>Chủ động (be proactive)</strong> — bạn chọn cách phản ứng; bạn không chỉ là sản phẩm của điều xảy đến với mình.</li>
<li><strong>Bắt đầu từ đích đến</strong> — hành động theo mục tiêu và giá trị, không theo việc gấp ồn ào nhất.</li>
<li><strong>Ưu tiên việc quan trọng</strong> — dành thời gian cho việc quan trọng, không chỉ việc khẩn cấp.</li>
</ul>
<h3>Khoảng lặng giữa kích thích và phản ứng</h3>
<p>Giữa một kích thích (một review gay gắt, một bản build hỏng lúc 5 giờ chiều) và phản ứng của bạn có một khoảng trống. Tự điều chỉnh là kỹ năng <em>tận dụng</em> khoảng trống ấy — gọi tên cảm xúc, hít thở, rồi chọn — thay vì bắn ra tin nhắn Slack đầy tức giận.</p>
<div class="callout"><span class="badge">Thử ngay</span> Lần tới thấy tức giận bùng lên trong một review, hãy chờ 60 giây rồi viết lại. Chỉ một thói quen đó chính là tự điều chỉnh trong thực tế.</div>`,
  ]]);

const c2q = quiz('lct301c-quiz-2', 'Quiz 2 — EQ & self-leadership|||Quiz 2 — EQ & lãnh đạo bản thân', [
  { id: 'q1', question: 'Theo Goleman, ở vai trò lãnh đạo thì yếu tố nào thường dự báo thành công tốt hơn?', options: ['IQ (chỉ số thông minh)', 'EQ (trí tuệ cảm xúc)', 'Chiều cao', 'Số năm kinh nghiệm code'], correctIndex: 1, explanation: 'Goleman lập luận rằng trong lãnh đạo, EQ dự báo thành công tốt hơn IQ.' },
  { id: 'q2', question: 'Yếu tố nào sau đây KHÔNG nằm trong 5 thành phần EQ của Goleman?', options: ['Tự nhận thức', 'Đồng cảm', 'Trí nhớ hình ảnh', 'Tự điều chỉnh'], correctIndex: 2, explanation: 'Năm thành phần là: tự nhận thức, tự điều chỉnh, động lực, đồng cảm, kỹ năng xã hội. Trí nhớ hình ảnh không thuộc nhóm này.' },
  { id: 'q3', question: 'Thói quen "chủ động" (be proactive) của Covey có nghĩa là?', options: ['Luôn làm mọi việc thật nhanh', 'Bạn chọn cách phản ứng của mình, không chỉ bị hoàn cảnh chi phối', 'Không bao giờ hỏi ý kiến ai', 'Chỉ làm việc khi được giao'], correctIndex: 1, explanation: 'Chủ động nghĩa là chịu trách nhiệm và chọn phản ứng của mình giữa kích thích và hành động, thay vì phản ứng thụ động.' },
]);

const c3 = doc('lct301c-3-1-communication-motivation', '3.1 — Communication, inspiration & team motivation|||3.1 — Giao tiếp, truyền cảm hứng & tạo động lực đội',
  'Lắng nghe chủ động & giao tiếp rõ ràng; "Start With Why" và vòng tròn vàng của Sinek; động lực nội tại vs bên ngoài (tự chủ, tinh thông, mục đích); phản hồi mang tính xây dựng.',
  [[
    `<span class="eyebrow">LCT301c · Chapter 3 · Lesson 3.1</span>
<h2>Communication, inspiration &amp; team motivation</h2>
<h3>Communication is two-way</h3>
<p>Most people think communication is talking. The leadership half is <strong>active listening</strong> — fully attending, reflecting back what you heard, asking before advising. Clear communication also means saying the same message to the whole team, being specific, and closing the loop.</p>
<h3>Start With Why — the Golden Circle</h3>
<p>Sinek observed that inspiring leaders and companies communicate from the inside out — <strong>Why → How → What</strong> — not the other way round. People do not buy what you do; they buy <em>why</em> you do it.</p>
<pre><code>          WHY   (the purpose, the belief)  <- start here
        HOW   (the process, the values)
      WHAT  (the product, the task)        <- most people start here
</code></pre>
<h3>What actually motivates people</h3>
<p>Beyond a fair salary, money is a weak long-term motivator for knowledge work. <strong>Intrinsic motivation</strong> rests on three drivers:</p>
<ul>
<li><strong>Autonomy</strong> — control over how you do the work.</li>
<li><strong>Mastery</strong> — getting visibly better at something that matters.</li>
<li><strong>Purpose</strong> — connecting the work to a "why" bigger than the task.</li>
</ul>
<h3>Feedback that builds</h3>
<p>Good feedback is specific, timely, and about behaviour not identity. A simple frame: <strong>Situation → Behaviour → Impact</strong> ("In standup [S], when you cut Lan off [B], she stopped sharing blockers [I]"). It gives the person something concrete to change.</p>
<div class="callout"><span class="badge">Leader move</span> Open a project by explaining the WHY, not the ticket list — a team that understands purpose makes better small decisions without you.</div>`,
    `<span class="eyebrow">LCT301c · Chương 3 · Bài 3.1</span>
<h2>Giao tiếp, truyền cảm hứng &amp; tạo động lực đội</h2>
<h3>Giao tiếp là hai chiều</h3>
<p>Đa số nghĩ giao tiếp là nói. Nửa mang tính lãnh đạo lại là <strong>lắng nghe chủ động</strong> — tập trung hoàn toàn, nhắc lại điều mình nghe được, hỏi trước khi khuyên. Giao tiếp rõ ràng còn nghĩa là nói cùng một thông điệp cho cả đội, cụ thể, và chốt lại vòng phản hồi.</p>
<h3>Start With Why — Vòng tròn vàng</h3>
<p>Sinek nhận thấy các nhà lãnh đạo và công ty truyền cảm hứng giao tiếp từ trong ra ngoài — <strong>Tại sao → Thế nào → Cái gì</strong> — chứ không ngược lại. Người ta không mua thứ bạn làm; họ mua <em>lý do</em> bạn làm nó.</p>
<pre><code>          WHY   (mục đích, niềm tin)        <- bắt đầu từ đây
        HOW   (cách làm, giá trị)
      WHAT  (sản phẩm, đầu việc)           <- đa số bắt đầu từ đây
</code></pre>
<h3>Điều thật sự tạo động lực</h3>
<p>Ngoài mức lương công bằng, tiền là động lực dài hạn yếu với công việc trí óc. <strong>Động lực nội tại</strong> dựa trên ba trụ:</p>
<ul>
<li><strong>Tự chủ (autonomy)</strong> — được kiểm soát cách mình làm việc.</li>
<li><strong>Tinh thông (mastery)</strong> — thấy mình giỏi lên rõ rệt ở việc có ý nghĩa.</li>
<li><strong>Mục đích (purpose)</strong> — nối công việc với một "tại sao" lớn hơn đầu việc.</li>
</ul>
<h3>Phản hồi mang tính xây dựng</h3>
<p>Phản hồi tốt thì cụ thể, kịp thời, và nói về hành vi chứ không về con người. Một khung đơn giản: <strong>Tình huống → Hành vi → Tác động</strong> ("Trong standup [tình huống], khi bạn cắt lời Lan [hành vi], bạn ấy ngừng chia sẻ vướng mắc [tác động]"). Nó cho người nghe một thứ cụ thể để thay đổi.</p>
<div class="callout"><span class="badge">Nước đi của người dẫn dắt</span> Mở đầu một dự án bằng cách giải thích WHY, không phải danh sách ticket — một đội hiểu mục đích sẽ tự ra quyết định nhỏ tốt hơn mà không cần bạn.</div>`,
  ]]);

const c3q = quiz('lct301c-quiz-3', 'Quiz 3 — Communication & motivation|||Quiz 3 — Giao tiếp & động lực', [
  { id: 'q1', question: 'Theo "Start With Why" của Sinek, người lãnh đạo truyền cảm hứng giao tiếp theo thứ tự nào?', options: ['Cái gì → Thế nào → Tại sao', 'Tại sao → Thế nào → Cái gì', 'Thế nào → Cái gì → Tại sao', 'Không theo thứ tự nào'], correctIndex: 1, explanation: 'Vòng tròn vàng đi từ trong ra ngoài: WHY (tại sao) → HOW (thế nào) → WHAT (cái gì).' },
  { id: 'q2', question: 'Ba trụ cột của động lực nội tại trong công việc trí óc là gì?', options: ['Lương, thưởng, phạt', 'Tự chủ, tinh thông, mục đích', 'Quyền lực, danh tiếng, tiền', 'Tốc độ, số lượng, deadline'], correctIndex: 1, explanation: 'Động lực nội tại dựa trên tự chủ (autonomy), tinh thông (mastery) và mục đích (purpose).' },
  { id: 'q3', question: 'Yếu tố nào là cốt lõi của "lắng nghe chủ động"?', options: ['Nói nhiều hơn để dẫn dắt câu chuyện', 'Tập trung hoàn toàn và nhắc lại điều mình nghe được để xác nhận', 'Vừa nghe vừa trả lời email', 'Ngắt lời để tiết kiệm thời gian'], correctIndex: 1, explanation: 'Lắng nghe chủ động là chú tâm hoàn toàn, phản chiếu lại nội dung để hiểu đúng, hỏi trước khi khuyên.' },
]);

const c4 = doc('lct301c-4-1-decisions-conflict', '4.1 — Decision-making & conflict resolution',
  'Ra quyết định có cấu trúc (định nghĩa vấn đề, phương án, tiêu chí, chọn); quyết định theo dữ liệu vs cảm tính; ma trận xung đột Thomas-Kilmann; hoà giải để đi tới win-win.',
  [[
    `<span class="eyebrow">LCT301c · Chapter 4 · Lesson 4.1</span>
<h2>Decision-making &amp; conflict resolution</h2>
<h3>A structured decision process</h3>
<p>Under pressure people jump to the first option. A structured process protects you from that:</p>
<pre><code>1. Define the real problem     (not the symptom)
2. Gather relevant information  (facts, not opinions)
3. List options                 (at least 3)
4. Set criteria and weigh them  (cost, risk, time, value)
5. Decide, then commit
6. Review the outcome           (learn for next time)
</code></pre>
<h3>Data vs gut, reversible vs not</h3>
<p>Not every decision deserves the full process. A useful test: is it <strong>reversible</strong>? Reversible "two-way door" decisions should be made fast and cheaply. Irreversible "one-way door" decisions deserve data, more options and a second opinion.</p>
<h3>Conflict is normal — and useful</h3>
<p>Disagreement about ideas makes decisions better; it only turns toxic when it becomes personal. The <strong>Thomas-Kilmann</strong> model maps five ways to handle conflict on two axes — how <em>assertive</em> (pushing your goal) and how <em>cooperative</em> (caring for the relationship) you are:</p>
<pre><code>                 Cooperative ->
  Assertive  Competing        Collaborating
     |       (I win)          (we both win)
     v       Compromising
             Avoiding         Accommodating
             (no one acts)    (you win)
</code></pre>
<h3>Toward win-win</h3>
<p><strong>Collaborating</strong> — solving so both sides get what they truly need — is usually the goal, but it costs time. Sometimes a quick <strong>compromise</strong> or a deliberate <strong>accommodate</strong> is the mature choice. The skill is separating <em>positions</em> ("I want X") from <em>interests</em> ("because I need Y"); shared interests are where win-win lives.</p>
<div class="callout"><span class="badge">Try it</span> In your next design argument, ask each side "what do you actually need here?" — you often find the positions clash but the interests do not.</div>`,
    `<span class="eyebrow">LCT301c · Chương 4 · Bài 4.1</span>
<h2>Ra quyết định &amp; giải quyết xung đột</h2>
<h3>Quy trình ra quyết định có cấu trúc</h3>
<p>Dưới áp lực, người ta nhảy ngay tới phương án đầu tiên. Một quy trình có cấu trúc bảo vệ bạn khỏi điều đó:</p>
<pre><code>1. Định nghĩa vấn đề thật    (không phải triệu chứng)
2. Thu thập thông tin liên quan (sự thật, không phải ý kiến)
3. Liệt kê phương án          (ít nhất 3)
4. Đặt tiêu chí và cân nhắc   (chi phí, rủi ro, thời gian, giá trị)
5. Quyết định, rồi cam kết
6. Xem lại kết quả            (học cho lần sau)
</code></pre>
<h3>Dữ liệu vs cảm tính, đảo được vs không</h3>
<p>Không phải quyết định nào cũng cần quy trình đầy đủ. Một phép thử hữu ích: nó có <strong>đảo ngược được</strong> không? Quyết định "cửa hai chiều" đảo được nên làm nhanh và rẻ. Quyết định "cửa một chiều" không đảo được thì xứng đáng có dữ liệu, nhiều phương án hơn và một ý kiến thứ hai.</p>
<h3>Xung đột là bình thường — và có ích</h3>
<p>Bất đồng về ý tưởng làm quyết định tốt hơn; nó chỉ độc hại khi trở thành công kích cá nhân. Mô hình <strong>Thomas-Kilmann</strong> vẽ năm cách xử lý xung đột trên hai trục — mức <em>quyết đoán</em> (theo đuổi mục tiêu của mình) và mức <em>hợp tác</em> (quan tâm đến quan hệ):</p>
<pre><code>                 Hợp tác ->
  Quyết đoán  Cạnh tranh       Cộng tác
     |        (tôi thắng)      (cả hai cùng thắng)
     v        Thoả hiệp
              Né tránh         Nhường nhịn
              (không ai làm)   (bạn thắng)
</code></pre>
<h3>Hướng tới win-win</h3>
<p><strong>Cộng tác</strong> — giải quyết sao cho cả hai bên đạt điều mình thật sự cần — thường là mục tiêu, nhưng tốn thời gian. Đôi khi một <strong>thoả hiệp</strong> nhanh hay một cú <strong>nhường nhịn</strong> có chủ đích lại là lựa chọn chín chắn. Kỹ năng nằm ở việc tách <em>lập trường</em> ("tôi muốn X") khỏi <em>lợi ích</em> ("vì tôi cần Y"); lợi ích chung là nơi win-win tồn tại.</p>
<div class="callout"><span class="badge">Thử ngay</span> Lần tranh luận thiết kế tới, hãy hỏi mỗi bên "bạn thật sự cần gì ở đây?" — bạn thường thấy lập trường chọi nhau nhưng lợi ích thì không.</div>`,
  ]]);

const c4q = quiz('lct301c-quiz-4', 'Quiz 4 — Decisions & conflict|||Quiz 4 — Quyết định & xung đột', [
  { id: 'q1', question: 'Với một quyết định "cửa hai chiều" (đảo ngược được), cách xử lý hợp lý là?', options: ['Dành nhiều tuần phân tích như quyết định lớn', 'Làm nhanh và rẻ vì có thể đảo lại nếu sai', 'Luôn cần ý kiến của cả hội đồng', 'Không bao giờ ra quyết định'], correctIndex: 1, explanation: 'Quyết định đảo ngược được nên làm nhanh; nếu sai vẫn quay lại được. Chỉ quyết định "cửa một chiều" mới cần quy trình nặng.' },
  { id: 'q2', question: 'Trong mô hình Thomas-Kilmann, phong cách "cộng tác" (collaborating) là?', options: ['Cao quyết đoán, thấp hợp tác — tôi thắng bạn thua', 'Cao quyết đoán, cao hợp tác — tìm giải pháp cả hai cùng thắng', 'Thấp cả hai — né tránh xung đột', 'Thấp quyết đoán, cao hợp tác — nhường hết cho bên kia'], correctIndex: 1, explanation: 'Cộng tác vừa quyết đoán vừa hợp tác cao: tìm giải pháp win-win đáp ứng nhu cầu thật của cả hai bên.' },
  { id: 'q3', question: 'Để đi tới win-win, người hoà giải cần phân biệt điều gì?', options: ['Lập trường ("tôi muốn X") với lợi ích ("vì tôi cần Y")', 'Ai nói to hơn với ai nói nhỏ hơn', 'Người mới với người cũ', 'Deadline với ngân sách'], correctIndex: 0, explanation: 'Tách lập trường khỏi lợi ích: lập trường có thể chọi nhau nhưng lợi ích chung là nơi tìm được giải pháp cả hai cùng thắng.' },
]);

const c5 = doc('lct301c-5-1-critical-thinking-arguments', '5.1 — Intro to critical thinking & arguments|||5.1 — Nhập môn tư duy phản biện & lập luận',
  'Tư duy phản biện là gì; cấu trúc lập luận (tiền đề → kết luận); phân biệt sự thật/ý kiến; suy diễn vs quy nạp; đánh giá tính đúng (valid/sound) và độ mạnh của bằng chứng.',
  [[
    `<span class="eyebrow">LCT301c · Chapter 5 · Lesson 5.1</span>
<h2>Intro to critical thinking &amp; arguments</h2>
<h3>What critical thinking is</h3>
<p><strong>Critical thinking</strong> is the disciplined habit of judging claims by reasons and evidence rather than by authority, emotion or how often you have heard them. Moore &amp; Parker define it as evaluating whether we should <em>accept, reject, or suspend judgement</em> on a claim.</p>
<h3>The anatomy of an argument</h3>
<p>An <strong>argument</strong> is not a fight — it is a set of statements where some (<strong>premises</strong>) are offered as support for another (the <strong>conclusion</strong>).</p>
<pre><code>Premise 1: All services with no tests break silently.
Premise 2: This service has no tests.
Conclusion: This service will break silently.
</code></pre>
<h3>Fact vs opinion, deduction vs induction</h3>
<ul>
<li><strong>Fact</strong> — can in principle be verified true or false. <strong>Opinion</strong> — a judgement or preference.</li>
<li><strong>Deductive</strong> — if the premises are true, the conclusion <em>must</em> be true (logic, maths).</li>
<li><strong>Inductive</strong> — the premises make the conclusion <em>likely</em> but not certain (evidence, patterns, most real-world reasoning).</li>
</ul>
<h3>Valid, sound, strong</h3>
<p>For deductive arguments: an argument is <strong>valid</strong> if the conclusion follows from the premises, and <strong>sound</strong> if it is valid AND the premises are actually true. A valid argument can still be false if a premise is wrong — so always check the premises, not just the logic.</p>
<div class="callout"><span class="badge">Habit</span> When someone makes a claim, ask two questions: "What is the conclusion?" and "What reasons support it?" — that alone separates thinking from reacting.</div>`,
    `<span class="eyebrow">LCT301c · Chương 5 · Bài 5.1</span>
<h2>Nhập môn tư duy phản biện &amp; lập luận</h2>
<h3>Tư duy phản biện là gì</h3>
<p><strong>Tư duy phản biện</strong> là thói quen kỷ luật xét đoán các khẳng định bằng lý lẽ và bằng chứng, thay vì bằng uy quyền, cảm xúc hay việc bạn nghe nó bao nhiêu lần. Moore &amp; Parker định nghĩa nó là đánh giá xem ta nên <em>chấp nhận, bác bỏ, hay tạm hoãn phán xét</em> một khẳng định.</p>
<h3>Giải phẫu một lập luận</h3>
<p>Một <strong>lập luận</strong> không phải cuộc cãi vã — nó là tập các mệnh đề, trong đó vài mệnh đề (<strong>tiền đề</strong>) được đưa ra để chống đỡ cho một mệnh đề khác (<strong>kết luận</strong>).</p>
<pre><code>Tiền đề 1: Mọi service không có test đều hỏng âm thầm.
Tiền đề 2: Service này không có test.
Kết luận:  Service này sẽ hỏng âm thầm.
</code></pre>
<h3>Sự thật vs ý kiến, suy diễn vs quy nạp</h3>
<ul>
<li><strong>Sự thật</strong> — về nguyên tắc kiểm chứng được đúng hay sai. <strong>Ý kiến</strong> — một phán xét hay sở thích.</li>
<li><strong>Suy diễn (deductive)</strong> — nếu các tiền đề đúng thì kết luận <em>tất yếu</em> đúng (logic, toán).</li>
<li><strong>Quy nạp (inductive)</strong> — các tiền đề khiến kết luận <em>có khả năng</em> đúng nhưng không chắc chắn (bằng chứng, quy luật, phần lớn lập luận đời thực).</li>
</ul>
<h3>Đúng-hình-thức, đúng-vững, mạnh</h3>
<p>Với lập luận suy diễn: một lập luận <strong>đúng-hình-thức (valid)</strong> nếu kết luận rút ra được từ tiền đề, và <strong>đúng-vững (sound)</strong> nếu vừa valid VỪA có các tiền đề thật sự đúng. Một lập luận valid vẫn có thể cho kết luận sai nếu một tiền đề sai — nên hãy luôn kiểm tra tiền đề, không chỉ kiểm tra logic.</p>
<div class="callout"><span class="badge">Thói quen</span> Khi ai đó nêu một khẳng định, hãy hỏi hai câu: "Kết luận là gì?" và "Lý lẽ nào chống đỡ nó?" — chỉ vậy thôi đã tách tư duy khỏi phản ứng.</div>`,
  ]]);

const c5q = quiz('lct301c-quiz-5', 'Quiz 5 — Critical thinking & arguments|||Quiz 5 — Tư duy phản biện & lập luận', [
  { id: 'q1', question: 'Trong một lập luận, "tiền đề" (premise) là gì?', options: ['Mệnh đề được chống đỡ (điều cần chứng minh)', 'Các mệnh đề đưa ra để chống đỡ cho kết luận', 'Một câu hỏi tu từ', 'Cảm xúc của người nói'], correctIndex: 1, explanation: 'Tiền đề là các lý lẽ/bằng chứng được đưa ra để hỗ trợ cho kết luận.' },
  { id: 'q2', question: 'Khác biệt giữa lập luận suy diễn và quy nạp là gì?', options: ['Suy diễn luôn sai, quy nạp luôn đúng', 'Suy diễn: tiền đề đúng thì kết luận tất yếu đúng; quy nạp: kết luận chỉ có khả năng đúng', 'Cả hai giống hệt nhau', 'Quy nạp chỉ dùng trong toán học'], correctIndex: 1, explanation: 'Suy diễn cho kết luận tất yếu nếu tiền đề đúng; quy nạp cho kết luận có xác suất cao nhưng không chắc chắn.' },
  { id: 'q3', question: 'Một lập luận "valid" nhưng có tiền đề sai thì?', options: ['Vẫn là "sound" (đúng-vững)', 'Không sound, và kết luận có thể sai — phải kiểm tra cả tiền đề', 'Luôn cho kết luận đúng', 'Không thể tồn tại'], correctIndex: 1, explanation: 'Valid chỉ nói kết luận rút ra hợp lý từ tiền đề; muốn sound thì tiền đề cũng phải thật sự đúng, nếu không kết luận có thể sai.' },
]);

const c6 = doc('lct301c-6-1-fallacies-biases', '6.1 — Fallacies & cognitive biases|||6.1 — Nguỵ biện & thiên kiến nhận thức',
  'Nguỵ biện phổ biến (công kích cá nhân, người rơm, uy quyền, trượt dốc, đánh lạc hướng); Hệ 1 vs Hệ 2 của Kahneman; thiên kiến xác nhận, mỏ neo, sẵn có, hiệu ứng bầy đàn.',
  [[
    `<span class="eyebrow">LCT301c · Chapter 6 · Lesson 6.1</span>
<h2>Fallacies &amp; cognitive biases</h2>
<h3>Fallacies — broken arguments</h3>
<p>A <strong>fallacy</strong> is a reasoning error that makes an argument look convincing while it is actually invalid. Common ones:</p>
<ul>
<li><strong>Ad hominem</strong> — attacking the person instead of their argument.</li>
<li><strong>Straw man</strong> — distorting someone's position into a weaker one, then knocking that down.</li>
<li><strong>Appeal to authority</strong> — "X is true because a famous person said so" (when they are not a relevant expert).</li>
<li><strong>Slippery slope</strong> — claiming one small step must lead to an extreme outcome, with no evidence for the chain.</li>
<li><strong>False dilemma</strong> — presenting only two options when more exist.</li>
</ul>
<h3>Two systems of thought</h3>
<p>Kahneman describes the mind as two systems:</p>
<pre><code>System 1: fast, automatic, intuitive, emotional  (jumps to answers)
System 2: slow, effortful, logical, deliberate   (checks the work)
</code></pre>
<p>Most errors come from letting System 1 answer a question that needed System 2. Critical thinking is largely the discipline of <em>switching System 2 on</em> when the stakes are high.</p>
<h3>Cognitive biases</h3>
<ul>
<li><strong>Confirmation bias</strong> — seeking evidence that confirms what you already believe.</li>
<li><strong>Anchoring</strong> — the first number/idea you hear drags your estimate toward it.</li>
<li><strong>Availability</strong> — judging likelihood by how easily examples come to mind (recent, dramatic events feel more common).</li>
<li><strong>Bandwagon</strong> — believing something because many others do.</li>
</ul>
<div class="callout"><span class="badge">Defence</span> Ask "what evidence would prove me WRONG?" — deliberately hunting for disconfirming evidence is the single best guard against confirmation bias.</div>`,
    `<span class="eyebrow">LCT301c · Chương 6 · Bài 6.1</span>
<h2>Nguỵ biện &amp; thiên kiến nhận thức</h2>
<h3>Nguỵ biện — những lập luận hỏng</h3>
<p>Một <strong>nguỵ biện</strong> là lỗi suy luận khiến lập luận trông thuyết phục trong khi thực ra không hợp lệ. Vài loại phổ biến:</p>
<ul>
<li><strong>Công kích cá nhân (ad hominem)</strong> — tấn công con người thay vì lập luận của họ.</li>
<li><strong>Người rơm (straw man)</strong> — bóp méo quan điểm của ai đó thành phiên bản yếu hơn rồi đánh đổ nó.</li>
<li><strong>Viện dẫn uy quyền</strong> — "X đúng vì một người nổi tiếng nói vậy" (khi họ không phải chuyên gia liên quan).</li>
<li><strong>Trượt dốc (slippery slope)</strong> — cho rằng một bước nhỏ tất yếu dẫn tới hậu quả cực đoan, mà không có bằng chứng cho chuỗi đó.</li>
<li><strong>Lưỡng nan giả (false dilemma)</strong> — chỉ đưa ra hai lựa chọn trong khi còn nhiều lựa chọn khác.</li>
</ul>
<h3>Hai hệ thống tư duy</h3>
<p>Kahneman mô tả tâm trí như hai hệ thống:</p>
<pre><code>Hệ 1: nhanh, tự động, trực giác, cảm xúc  (nhảy tới đáp án)
Hệ 2: chậm, tốn sức, logic, có chủ ý      (kiểm lại bài làm)
</code></pre>
<p>Phần lớn sai lầm đến từ việc để Hệ 1 trả lời một câu hỏi lẽ ra cần Hệ 2. Tư duy phản biện phần lớn là kỷ luật <em>bật Hệ 2 lên</em> khi tình huống có nhiều rủi ro.</p>
<h3>Thiên kiến nhận thức</h3>
<ul>
<li><strong>Thiên kiến xác nhận</strong> — chỉ tìm bằng chứng khẳng định điều mình đã tin.</li>
<li><strong>Mỏ neo (anchoring)</strong> — con số/ý tưởng đầu tiên nghe được kéo ước lượng của bạn về phía nó.</li>
<li><strong>Sẵn có (availability)</strong> — đánh giá khả năng theo mức dễ nghĩ ra ví dụ (sự kiện gần đây, kịch tính thấy có vẻ phổ biến hơn).</li>
<li><strong>Bầy đàn (bandwagon)</strong> — tin một điều vì nhiều người khác cũng tin.</li>
</ul>
<div class="callout"><span class="badge">Phòng vệ</span> Hãy hỏi "bằng chứng nào sẽ chứng minh mình SAI?" — chủ động săn bằng chứng phản bác là cách chống thiên kiến xác nhận tốt nhất.</div>`,
  ]]);

const c6q = quiz('lct301c-quiz-6', 'Quiz 6 — Fallacies & biases|||Quiz 6 — Nguỵ biện & thiên kiến', [
  { id: 'q1', question: '"Ý kiến của bạn về kiến trúc này sai, vì bạn còn là junior" — đây là nguỵ biện nào?', options: ['Người rơm (straw man)', 'Công kích cá nhân (ad hominem)', 'Trượt dốc (slippery slope)', 'Lưỡng nan giả'], correctIndex: 1, explanation: 'Công kích cá nhân: bác bỏ lập luận bằng cách tấn công con người (là junior) thay vì xét chính lập luận.' },
  { id: 'q2', question: 'Theo Kahneman, "Hệ 1" (System 1) có đặc điểm gì?', options: ['Chậm, tốn sức, logic có chủ ý', 'Nhanh, tự động, trực giác, dễ mắc lỗi khi cần suy nghĩ kỹ', 'Chỉ hoạt động khi ngủ', 'Luôn cho kết quả chính xác'], correctIndex: 1, explanation: 'Hệ 1 nhanh và tự động; sai lầm thường xảy ra khi để Hệ 1 trả lời câu hỏi cần Hệ 2 (chậm, có chủ ý).' },
  { id: 'q3', question: 'Cách phòng vệ tốt nhất trước "thiên kiến xác nhận" là?', options: ['Chỉ đọc nguồn đồng ý với mình', 'Chủ động tìm bằng chứng có thể chứng minh mình SAI', 'Tin theo số đông', 'Lấy con số đầu tiên nghe được làm chuẩn'], correctIndex: 1, explanation: 'Chủ động săn bằng chứng phản bác (disconfirming evidence) là biện pháp mạnh nhất chống thiên kiến xác nhận.' },
]);

const c7 = doc('lct301c-7-1-problem-solving-systems', '7.1 — Problem-solving & systems thinking|||7.1 — Giải quyết vấn đề & tư duy hệ thống',
  'Quy trình giải quyết vấn đề có cấu trúc; phân tích nguyên nhân gốc (5 Whys, xương cá Ishikawa); tư duy hệ thống — vòng phản hồi, hệ quả ngoài ý muốn, tối ưu cục bộ vs toàn cục.',
  [[
    `<span class="eyebrow">LCT301c · Chapter 7 · Lesson 7.1</span>
<h2>Problem-solving &amp; systems thinking</h2>
<h3>Solve the right problem</h3>
<p>The most expensive mistake is solving the wrong problem well. Structured problem-solving forces you to slow down at the start:</p>
<pre><code>1. Frame the problem   - what is really wrong, for whom?
2. Find root causes    - not just symptoms
3. Generate options    - diverge before you converge
4. Evaluate + choose   - against clear criteria
5. Act + measure       - did it actually fix it?
</code></pre>
<h3>Root-cause tools</h3>
<ul>
<li><strong>5 Whys</strong> — ask "why?" about five times to drill from symptom to cause.</li>
<li><strong>Fishbone (Ishikawa)</strong> — map possible causes across categories (people, process, tools, environment).</li>
</ul>
<pre><code>Symptom: the deploy failed.
  Why? -> the container ran the wrong Prisma engine
  Why? -> the image was built from the wrong Dockerfile
  Why? -> the build command had no -f flag
  Why? -> the script assumed a default file
  Why? -> no check compared libc to the engine  <- ROOT CAUSE
</code></pre>
<h3>Systems thinking</h3>
<p>A <strong>system</strong> is a set of parts whose connections matter more than the parts. Systems thinking looks at the whole:</p>
<ul>
<li><strong>Feedback loops</strong> — outputs feed back as inputs (reinforcing loops accelerate; balancing loops stabilise).</li>
<li><strong>Unintended consequences</strong> — a fix in one place creates a problem elsewhere (add a cache, get stale data).</li>
<li><strong>Local vs global optimum</strong> — making one team faster can slow the whole delivery pipeline.</li>
</ul>
<div class="callout"><span class="badge">Engineer's edge</span> Before you "fix" a flaky system, draw the loop. Many production incidents are a fast local fix that broke a slower global balance.</div>`,
    `<span class="eyebrow">LCT301c · Chương 7 · Bài 7.1</span>
<h2>Giải quyết vấn đề &amp; tư duy hệ thống</h2>
<h3>Giải đúng vấn đề</h3>
<p>Sai lầm đắt nhất là giải rất giỏi một vấn đề sai. Giải quyết vấn đề có cấu trúc buộc bạn chậm lại ở phần đầu:</p>
<pre><code>1. Đóng khung vấn đề  - thực sự sai chỗ nào, với ai?
2. Tìm nguyên nhân gốc - không chỉ triệu chứng
3. Sinh phương án      - mở rộng trước khi thu hẹp
4. Đánh giá + chọn     - theo tiêu chí rõ ràng
5. Hành động + đo      - nó có thật sự khắc phục không?
</code></pre>
<h3>Công cụ tìm nguyên nhân gốc</h3>
<ul>
<li><strong>5 Whys (5 Tại sao)</strong> — hỏi "tại sao?" khoảng năm lần để khoan từ triệu chứng xuống nguyên nhân.</li>
<li><strong>Xương cá (Ishikawa)</strong> — vẽ các nguyên nhân khả dĩ theo nhóm (con người, quy trình, công cụ, môi trường).</li>
</ul>
<pre><code>Triệu chứng: bản deploy hỏng.
  Tại sao? -> container chạy nhầm engine Prisma
  Tại sao? -> ảnh được dựng từ nhầm Dockerfile
  Tại sao? -> lệnh build thiếu cờ -f
  Tại sao? -> script mặc định lấy file mặc định
  Tại sao? -> không có chốt so libc với engine  <- NGUYÊN NHÂN GỐC
</code></pre>
<h3>Tư duy hệ thống</h3>
<p>Một <strong>hệ thống</strong> là tập các phần mà mối nối giữa chúng quan trọng hơn từng phần. Tư duy hệ thống nhìn vào tổng thể:</p>
<ul>
<li><strong>Vòng phản hồi</strong> — đầu ra quay lại làm đầu vào (vòng tăng cường thì gia tốc; vòng cân bằng thì ổn định hoá).</li>
<li><strong>Hệ quả ngoài ý muốn</strong> — vá một chỗ lại sinh vấn đề chỗ khác (thêm cache thì gặp dữ liệu cũ).</li>
<li><strong>Tối ưu cục bộ vs toàn cục</strong> — làm một đội nhanh hơn có thể làm chậm cả dây chuyền giao hàng.</li>
</ul>
<div class="callout"><span class="badge">Lợi thế của kỹ sư</span> Trước khi "vá" một hệ thống chập chờn, hãy vẽ vòng phản hồi. Nhiều sự cố production là một cú vá cục bộ nhanh đã phá vỡ một cân bằng toàn cục chậm hơn.</div>`,
  ]]);

const c7q = quiz('lct301c-quiz-7', 'Quiz 7 — Problem-solving & systems|||Quiz 7 — Giải quyết vấn đề & hệ thống', [
  { id: 'q1', question: 'Kỹ thuật "5 Whys" dùng để làm gì?', options: ['Sinh ra năm phương án khác nhau', 'Hỏi "tại sao" nhiều lần để khoan từ triệu chứng xuống nguyên nhân gốc', 'Chia đội thành năm nhóm', 'Đặt năm deadline'], correctIndex: 1, explanation: '5 Whys hỏi "tại sao" liên tiếp để đi từ triệu chứng bề mặt xuống nguyên nhân gốc thật sự.' },
  { id: 'q2', question: '"Tối ưu cục bộ vs tối ưu toàn cục" trong tư duy hệ thống nghĩa là gì?', options: ['Cải thiện một phần luôn cải thiện tổng thể', 'Làm một phần tốt lên có thể khiến cả hệ thống kém đi', 'Chỉ nên tối ưu phần nhỏ nhất', 'Hệ thống không có mối liên hệ nào'], correctIndex: 1, explanation: 'Tối ưu một bộ phận (cục bộ) có thể gây hại cho tổng thể (toàn cục) — ví dụ làm một đội nhanh hơn nhưng nghẽn cả dây chuyền.' },
  { id: 'q3', question: '"Hệ quả ngoài ý muốn" (unintended consequences) trong hệ thống là?', options: ['Kết quả luôn đúng như dự đoán', 'Một giải pháp ở chỗ này lại sinh ra vấn đề mới ở chỗ khác', 'Lỗi cú pháp trong code', 'Không liên quan đến tư duy hệ thống'], correctIndex: 1, explanation: 'Trong hệ thống có liên kết, một cú vá ở một điểm thường tạo ra vấn đề ở nơi khác (ví dụ thêm cache gây dữ liệu cũ).' },
]);

const c8 = doc('lct301c-8-1-leading-tech-ethics-change', '8.1 — Leading in tech, ethics & change management|||8.1 — Lãnh đạo trong công nghệ, đạo đức & quản lý thay đổi',
  'Lãnh đạo đội công nghệ (an toàn tâm lý, tech lead phục vụ); đạo đức nghề (quyền riêng tư, thiên kiến thuật toán, trách nhiệm); mô hình quản lý thay đổi ADKAR & 8 bước Kotter.',
  [[
    `<span class="eyebrow">LCT301c · Chapter 8 · Lesson 8.1</span>
<h2>Leading in tech, ethics &amp; change management</h2>
<h3>Leading a tech team</h3>
<p>Technical teams are led less by command and more by <strong>trust and clarity</strong>. Google's research on effective teams found the top factor was <strong>psychological safety</strong> — people feel safe to ask questions, admit mistakes and disagree. A good tech lead removes blockers, shields the team from noise, and lets engineers own decisions — servant leadership applied to code.</p>
<h3>Ethics in technology</h3>
<p>Engineers build systems that touch millions. Critical thinking here becomes a duty:</p>
<ul>
<li><strong>Privacy &amp; data</strong> — collect the minimum, be transparent, protect it.</li>
<li><strong>Algorithmic bias</strong> — a model trained on biased data reproduces the bias at scale; question the data, not just the accuracy.</li>
<li><strong>Responsibility</strong> — "the spec said so" is not an ethical defence; ask who is harmed if this works exactly as designed.</li>
</ul>
<h3>Change management</h3>
<p>People resist change even when it is good — because change means uncertainty. Two well-known models:</p>
<pre><code>ADKAR (individual change):
  Awareness  -> Desire -> Knowledge -> Ability -> Reinforcement

Kotter 8 steps (organisational change):
  1 Urgency  2 Coalition  3 Vision  4 Communicate
  5 Remove barriers  6 Short-term wins  7 Sustain  8 Anchor
</code></pre>
<h3>Bringing it together</h3>
<p>Leadership and critical thinking meet here: you use clear reasoning to decide <em>what</em> should change, and leadership skills — communication, empathy, motivation — to bring people through it. Neither alone is enough.</p>
<div class="callout"><span class="badge">Capstone idea</span> A technically correct change that no one adopts has failed. Plan the human side (ADKAR) with the same rigour you plan the migration.</div>`,
    `<span class="eyebrow">LCT301c · Chương 8 · Bài 8.1</span>
<h2>Lãnh đạo trong công nghệ, đạo đức &amp; quản lý thay đổi</h2>
<h3>Dẫn dắt một đội công nghệ</h3>
<p>Đội kỹ thuật được dẫn dắt ít bằng mệnh lệnh, nhiều hơn bằng <strong>niềm tin và sự rõ ràng</strong>. Nghiên cứu của Google về đội hiệu quả tìm ra yếu tố hàng đầu là <strong>an toàn tâm lý</strong> — mọi người thấy an toàn để đặt câu hỏi, nhận sai và bất đồng. Một tech lead giỏi gỡ vướng, che chắn đội khỏi ồn ào, và để kỹ sư làm chủ quyết định — lãnh đạo phục vụ áp dụng vào code.</p>
<h3>Đạo đức trong công nghệ</h3>
<p>Kỹ sư dựng nên hệ thống chạm tới hàng triệu người. Ở đây tư duy phản biện trở thành một bổn phận:</p>
<ul>
<li><strong>Quyền riêng tư &amp; dữ liệu</strong> — thu thập tối thiểu, minh bạch, bảo vệ nó.</li>
<li><strong>Thiên kiến thuật toán</strong> — một mô hình học trên dữ liệu thiên lệch sẽ tái tạo thiên lệch ở quy mô lớn; hãy chất vấn dữ liệu, không chỉ độ chính xác.</li>
<li><strong>Trách nhiệm</strong> — "spec ghi vậy" không phải một lời biện hộ đạo đức; hãy hỏi ai bị tổn hại nếu nó chạy đúng như thiết kế.</li>
</ul>
<h3>Quản lý thay đổi</h3>
<p>Con người kháng cự thay đổi ngay cả khi nó tốt — vì thay đổi mang theo bất định. Hai mô hình nổi tiếng:</p>
<pre><code>ADKAR (thay đổi ở cá nhân):
  Nhận biết -> Mong muốn -> Kiến thức -> Khả năng -> Củng cố

Kotter 8 bước (thay đổi ở tổ chức):
  1 Cấp bách  2 Liên minh  3 Tầm nhìn  4 Truyền thông
  5 Gỡ rào cản  6 Thắng lợi ngắn hạn  7 Duy trì  8 Neo vào văn hoá
</code></pre>
<h3>Ghép mọi thứ lại</h3>
<p>Lãnh đạo và tư duy phản biện gặp nhau ở đây: bạn dùng lập luận sáng rõ để quyết định <em>cái gì</em> nên thay đổi, và kỹ năng lãnh đạo — giao tiếp, đồng cảm, tạo động lực — để đưa con người vượt qua nó. Chỉ một trong hai thì không đủ.</p>
<div class="callout"><span class="badge">Ý tưởng tổng kết</span> Một thay đổi đúng về kỹ thuật mà không ai áp dụng là một thay đổi thất bại. Hãy lên kế hoạch cho phần con người (ADKAR) kỹ như bạn lên kế hoạch cho việc migration.</div>`,
  ]]);

const c8q = quiz('lct301c-quiz-8', 'Quiz 8 — Tech leadership & change|||Quiz 8 — Lãnh đạo công nghệ & thay đổi', [
  { id: 'q1', question: 'Theo nghiên cứu của Google, yếu tố hàng đầu của một đội công nghệ hiệu quả là gì?', options: ['Lương cao nhất', 'An toàn tâm lý (psychological safety)', 'Số lượng thành viên đông', 'Công nghệ mới nhất'], correctIndex: 1, explanation: 'An toàn tâm lý — mọi người thấy an toàn để hỏi, nhận sai và bất đồng — là yếu tố hàng đầu quyết định hiệu quả đội.' },
  { id: 'q2', question: 'Vì sao "thiên kiến thuật toán" (algorithmic bias) là vấn đề đạo đức?', options: ['Vì mô hình chạy chậm', 'Vì mô hình học trên dữ liệu thiên lệch sẽ tái tạo và khuếch đại thiên lệch ở quy mô lớn', 'Vì mô hình tốn điện', 'Vì nó không liên quan đến đạo đức'], correctIndex: 1, explanation: 'Mô hình huấn luyện trên dữ liệu thiên lệch sẽ tái tạo thiên lệch đó cho hàng triệu người — nên phải chất vấn cả dữ liệu, không chỉ độ chính xác.' },
  { id: 'q3', question: 'Trong mô hình ADKAR, bước đầu tiên của thay đổi ở cá nhân là gì?', options: ['Củng cố (Reinforcement)', 'Nhận biết (Awareness) rằng cần thay đổi', 'Khả năng (Ability)', 'Kiến thức (Knowledge)'], correctIndex: 1, explanation: 'ADKAR bắt đầu bằng Awareness (nhận biết vì sao cần thay đổi), rồi mới tới Desire, Knowledge, Ability, Reinforcement.' },
]);

export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    courseCode: 'LCT301c',
    slug: 'lct301c-leadership-and-critical-thinking',
    title: 'Leadership and Critical Thinking',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/LCT301c.webp',
    shortDescription: 'Become a leader and a critical thinker: leadership styles, emotional intelligence, communication & motivation, decisions & conflict, arguments, fallacies & cognitive bias, systems thinking, plus ethics & change in tech. Bilingual, with quizzes.|||Trở thành người lãnh đạo và tư duy phản biện: phong cách lãnh đạo, trí tuệ cảm xúc, giao tiếp & động lực, ra quyết định & xung đột, lập luận, nguỵ biện & thiên kiến, tư duy hệ thống, đạo đức & thay đổi trong công nghệ. Song ngữ, có quiz.',
    description: 'Môn <strong>LCT301c — Leadership and Critical Thinking</strong> (ngành Khoa học Máy tính, kỳ 6) rèn hai kỹ năng quyết định việc tài năng kỹ thuật biến thành ảnh hưởng thật: <strong>lãnh đạo</strong> và <strong>tư duy phản biện</strong>. Từ <strong>phong cách lãnh đạo &amp; lãnh đạo tình huống</strong> → <strong>trí tuệ cảm xúc</strong> (Goleman) &amp; lãnh đạo bản thân (Covey) → <strong>giao tiếp, "Start With Why" &amp; tạo động lực</strong> (Sinek) → <strong>ra quyết định &amp; giải quyết xung đột</strong> → <strong>lập luận, nguỵ biện &amp; thiên kiến</strong> (Kahneman, Moore/Parker) → <strong>giải quyết vấn đề &amp; tư duy hệ thống</strong> → <strong>lãnh đạo trong công nghệ, đạo đức &amp; quản lý thay đổi</strong>. Song ngữ, có khung/mô hình và quiz mỗi chương.',
    whatYouLearn: 'Phân biệt lãnh đạo &amp; quản lý; các phong cách và lãnh đạo tình huống; trí tuệ cảm xúc (5 thành phần Goleman) &amp; lãnh đạo bản thân; lắng nghe chủ động, vòng tròn vàng WHY, động lực nội tại (tự chủ/tinh thông/mục đích); ra quyết định có cấu trúc &amp; mô hình xung đột Thomas-Kilmann; cấu trúc lập luận, suy diễn/quy nạp, valid/sound; nhận diện nguỵ biện &amp; thiên kiến (Hệ 1/Hệ 2, xác nhận, mỏ neo); giải quyết vấn đề (5 Whys, xương cá) &amp; tư duy hệ thống; lãnh đạo đội công nghệ, đạo đức nghề &amp; quản lý thay đổi (ADKAR, Kotter).',
    requirements: 'Không cần kiến thức kỹ thuật đặc thù. Nên có trải nghiệm làm việc nhóm/dự án để áp dụng các khung vào tình huống thật.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách nền tảng, tài liệu miễn phí, TED, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Hai trụ cột, vì sao kỹ sư cần, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Lãnh đạo & phong cách|||Chapter 1 — Leadership & styles', description: 'Lãnh đạo vs quản lý, các phong cách, lãnh đạo tình huống.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Trí tuệ cảm xúc|||Chapter 2 — Emotional intelligence', description: '5 thành phần EQ Goleman, lãnh đạo bản thân, Covey.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Giao tiếp & động lực|||Chapter 3 — Communication & motivation', description: 'Lắng nghe, Start With Why, động lực nội tại, phản hồi.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Quyết định & xung đột|||Chapter 4 — Decisions & conflict', description: 'Quy trình quyết định, Thomas-Kilmann, win-win.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tư duy phản biện & lập luận|||Chapter 5 — Critical thinking & arguments', description: 'Lập luận, suy diễn/quy nạp, valid/sound.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nguỵ biện & thiên kiến|||Chapter 6 — Fallacies & biases', description: 'Nguỵ biện, Hệ 1/Hệ 2 Kahneman, thiên kiến nhận thức.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Giải quyết vấn đề & hệ thống|||Chapter 7 — Problem-solving & systems', description: '5 Whys, xương cá, tư duy hệ thống, vòng phản hồi.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Lãnh đạo công nghệ & thay đổi|||Chapter 8 — Tech leadership & change', description: 'An toàn tâm lý, đạo đức, ADKAR & Kotter.', lessons: [c8, c8q] },
  ],
};
