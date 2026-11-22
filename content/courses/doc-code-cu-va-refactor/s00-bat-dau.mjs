/**
 * Đọc code cũ và refactor — Mục 0: Bảo trì mới là công việc thật (soạn 22/11/2026).
 * Ba bài: Bắt đầu tại đây 1/2 (là gì, lịch sử, khác viết lại, nền cần có, học xong làm gì, chi phí thật, học kèm khoá nào),
 * Bắt đầu tại đây 2/2 (sửa mù: Knight Capital, Ariane 501, tình huống OJT, góc hacker trên repo lab, cách học),
 * 0.1 Dựng môi trường lab (repo legacy-thu-vien: Java 8 Servlet/JSP + MySQL 8.0, chạy bằng Docker Compose hoặc JDK 8 + Tomcat 9).
 * Slug + title chương giữ nguyên khung (doc-code-cu-va-refactor.mjs). Mọi output chạy thật — môi trường ở MOI_TRUONG.
 */
import { java, xml, sql, bash, out, tl, ml, lk, bai, thuatNgu, ZIP_LAB, MOI_TRUONG } from './_chung.mjs';

/* ═══════════════════ Bắt đầu tại đây (1/2) ═══════════════════ */
const BD1 = ml((en) => `
<span class="eyebrow">${en ? 'Section 0 · Start here (1/2)' : 'Mục 0 · Bắt đầu tại đây (1/2)'}</span>
<h2>${en ? 'Why your first job is mostly other people’s code' : 'Vì sao công việc đầu tiên chủ yếu là code của người khác'}</h2>
<p class="lead">${en
  ? 'At university almost every project starts from an empty folder. At work almost none do. On your first day of OJT you will most likely be given a repository that is older than your student ID, written by people who have left, with a README of three lines — and a ticket that says “small fix”. This course teaches the skill that ticket really needs: reading, running, protecting and safely improving code you did not write.'
  : 'Ở trường, gần như dự án nào cũng bắt đầu từ một thư mục trống. Đi làm thì gần như không dự án nào như vậy. Ngày đầu OJT, nhiều khả năng bạn nhận một repo còn nhiều tuổi hơn mã số sinh viên của bạn, do những người đã nghỉ việc viết, README đúng ba dòng — kèm một ticket ghi "sửa nhỏ". Khoá này dạy đúng kỹ năng mà cái ticket đó cần: đọc, dựng chạy, bảo vệ và cải thiện an toàn những dòng code không phải của mình.'}</p>

<h3>${en ? '1. What “legacy code” means — and where the word came from' : '1. "Code cũ" (legacy code) là gì — và từ này ở đâu ra'}</h3>
<p>${en
  ? 'In everyday talk “legacy” means “old”. Engineers use a sharper definition from Michael Feathers, whose book <em>Working Effectively with Legacy Code</em> (Prentice Hall/Pearson, 2004) is still the standard text: <strong>legacy code is code without tests</strong>. Age is not the point. A two-week-old service with no tests is already legacy, because nobody can change it and know they did not break something. A twenty-year-old COBOL program with a full regression suite is not.'
  : 'Trong lời nói thường ngày, "legacy" nghĩa là "cũ". Dân kỹ thuật dùng một định nghĩa sắc hơn của Michael Feathers — cuốn <em>Working Effectively with Legacy Code</em> (Prentice Hall/Pearson, 2004) đến giờ vẫn là sách gối đầu: <strong>legacy code là code không có test</strong>. Tuổi không phải là điểm mấu chốt. Một service mới viết hai tuần mà không có test đã là legacy, vì không ai sửa nó mà biết chắc mình không làm hỏng chỗ khác. Ngược lại, một chương trình COBOL hai mươi năm tuổi có đủ bộ test hồi quy thì không phải.'}</p>
<p>${en
  ? '<strong>Refactoring</strong> is the other half of the title. Martin Fowler defines it as “a controlled technique for improving the design of an existing code base” — small steps that change the structure while keeping the behaviour. The word appeared in print in a 1990 paper by William Opdyke and Ralph Johnson, became William Opdyke’s 1992 PhD thesis at the University of Illinois (“Refactoring Object-Oriented Frameworks”), and reached every programmer through Fowler’s book <em>Refactoring</em> (1999; second edition late 2018). Feathers then answered the question Fowler’s book assumed away: <em>what if there are no tests to keep you safe while you refactor?</em>'
  : '<strong>Refactoring (tái cấu trúc)</strong> là nửa còn lại của tên khoá. Martin Fowler định nghĩa nó là "một kỹ thuật có kiểm soát để cải thiện thiết kế của một codebase có sẵn" — những bước nhỏ đổi cấu trúc mà giữ nguyên hành vi. Từ này lần đầu lên giấy trong bài báo năm 1990 của William Opdyke và Ralph Johnson, thành luận án tiến sĩ của Opdyke năm 1992 tại Đại học Illinois ("Refactoring Object-Oriented Frameworks"), rồi tới tay mọi lập trình viên qua cuốn <em>Refactoring</em> của Fowler (1999; bản 2 cuối năm 2018). Feathers sau đó trả lời câu hỏi mà sách của Fowler mặc định là đã có: <em>nếu không có test để giữ an toàn trong lúc refactor thì làm thế nào?</em>'}</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1990</span><span class="lz-t">Opdyke &amp; Johnson</span><span class="lz-d">${en ? 'first paper using “refactoring”' : 'bài báo đầu tiên dùng chữ "refactoring"'}</span></div>
  <div class="lz-step"><span class="lz-k">1992</span><span class="lz-t">${en ? 'Opdyke’s thesis' : 'Luận án Opdyke'}</span><span class="lz-d">${en ? 'refactorings that provably keep behaviour' : 'các phép refactor được chứng minh giữ hành vi'}</span></div>
  <div class="lz-step"><span class="lz-k">1999</span><span class="lz-t">Fowler — Refactoring</span><span class="lz-d">${en ? 'a named catalogue: Extract Method, Move Method…' : 'danh mục có tên: Extract Method, Move Method…'}</span></div>
  <div class="lz-step"><span class="lz-k">2004</span><span class="lz-t">Feathers — Legacy Code</span><span class="lz-d">${en ? 'how to get tests around code that has none' : 'cách đưa test vào code chưa có test'}</span></div>
  <div class="lz-step"><span class="lz-k">2018</span><span class="lz-t">Refactoring 2nd ed.</span><span class="lz-d">${en ? 'same ideas, JavaScript examples, refactoring.com/catalog' : 'cùng ý tưởng, ví dụ JavaScript, refactoring.com/catalog'}</span></div>
</div>
<p>${en
  ? 'An everyday picture: you are asked to add a socket in an old house that has no wiring diagram. A good electrician does not start by knocking down the wall. They switch off the breaker, trace which circuit feeds the room, test the wire, mark what they found — and only then cut. Running the app, mapping it, pinning its behaviour with tests, then changing it in small steps is exactly that sequence.'
  : 'Liên tưởng đời thường: bạn được nhờ lắp thêm một ổ cắm trong một căn nhà cũ không có sơ đồ điện. Thợ giỏi không bắt đầu bằng việc đục tường. Họ ngắt cầu dao, dò xem phòng này ăn điện từ mạch nào, thử dây, đánh dấu những gì đã thấy — rồi mới cắt. Dựng chạy ứng dụng, vẽ bản đồ, khoá hành vi bằng test, rồi mới sửa từng bước nhỏ chính là trình tự đó.'}</p>

<h3>${en ? '2. Maintaining and refactoring is not the same as rewriting' : '2. Bảo trì và refactor KHÁC viết lại từ đầu'}</h3>
<table>
<thead><tr><th></th><th>${en ? 'Fix / maintain' : 'Sửa lỗi / bảo trì'}</th><th>Refactor</th><th>${en ? 'Rewrite from scratch' : 'Viết lại từ đầu (rewrite)'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Behaviour' : 'Hành vi'}</td><td>${en ? 'changes on purpose, a little' : 'đổi có chủ đích, một chút'}</td><td>${en ? 'stays exactly the same' : 'giữ nguyên tuyệt đối'}</td><td>${en ? 'meant to stay the same, rarely does' : 'định giữ nguyên, hiếm khi giữ được'}</td></tr>
<tr><td>${en ? 'Size of one step' : 'Cỡ một bước'}</td><td>${en ? 'one ticket, one small PR' : 'một ticket, một PR nhỏ'}</td><td>${en ? 'minutes; tests green after each' : 'vài phút; test xanh sau mỗi bước'}</td><td>${en ? 'months before anything ships' : 'nhiều tháng mới ra được gì'}</td></tr>
<tr><td>${en ? 'Risk' : 'Rủi ro'}</td><td>${en ? 'low if the fix is minimal' : 'thấp nếu bản sửa tối thiểu'}</td><td>${en ? 'low with tests, high without' : 'thấp khi có test, cao khi không'}</td><td>${en ? 'high: old bug fixes get lost' : 'cao: các bản vá cũ bị mất'}</td></tr>
<tr><td>${en ? 'Who approves' : 'Ai quyết'}</td><td>${en ? 'your lead, in review' : 'leader, khi review'}</td><td>${en ? 'you, as part of daily work' : 'chính bạn, trong việc hằng ngày'}</td><td>${en ? 'management and the client' : 'quản lý và khách hàng'}</td></tr>
</tbody>
</table>
<p>${en
  ? 'The best-known warning against rewrites is Joel Spolsky’s essay “Things You Should Never Do, Part I” (April 2000). Netscape decided to rewrite its browser from scratch; there was never a version 5.0, and when he wrote, the last major release (4.0) was almost three years old while competitors kept shipping. His key sentence about ugly-looking old code: “those are bug fixes”. Every strange <code>if</code> in an old file may be a fix for a real customer problem that took weeks to find. Throw the file away and you throw that knowledge away. That is why this course is about <em>refactoring in place</em>; a rewrite is a business decision you will not be making as an intern.'
  : 'Lời cảnh báo nổi tiếng nhất về chuyện viết lại là bài "Things You Should Never Do, Part I" của Joel Spolsky (04/2000). Netscape quyết định viết lại trình duyệt từ đầu; không bao giờ có bản 5.0, và lúc ông viết bài thì bản lớn gần nhất (4.0) đã gần ba năm tuổi trong khi đối thủ liên tục ra bản mới. Câu then chốt của ông về những đoạn code trông xấu xí: "đó là những bản vá lỗi". Mỗi cái <code>if</code> kỳ quặc trong một tệp cũ có thể là bản sửa cho một vấn đề thật của khách hàng mà người ta mất hàng tuần mới tìm ra. Vứt tệp đi là vứt luôn hiểu biết đó. Vì thế khoá này dạy <em>refactor ngay tại chỗ</em>; viết lại là quyết định kinh doanh, không phải việc một intern được quyết.'}</p>
<div class="pitfall co-tieu-de"><p><strong>${en ? 'Trap — “it would be faster to rewrite it”.' : 'Bẫy — "viết lại cho nhanh".'}</strong> ${en
  ? 'Almost every newcomer thinks this in week one, usually because they have not yet understood why the code is the way it is. Write the thought down, keep working, and re-read it after you finish Chapter 2. Most of the time the reasons will have appeared.'
  : 'Gần như người mới nào cũng nghĩ vậy ở tuần đầu, thường là vì chưa hiểu vì sao code lại như thế. Ghi ý nghĩ đó ra giấy, cứ làm tiếp, rồi đọc lại sau khi học xong Chương 2. Phần lớn trường hợp, lý do đã tự hiện ra.'}</p></div>

<h3>${en ? '3. What you need before you start' : '3. Cần nền gì trước khi học'}</h3>
<table>
<thead><tr><th>${en ? 'Background' : 'Nền'}</th><th>${en ? 'Why this course needs it' : 'Khoá này cần nó để làm gì'}</th><th>${en ? 'Where to get it' : 'Học ở đâu'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Java OOP (PRO192)' : 'Java hướng đối tượng (PRO192)'}</td><td>${en ? 'Read classes, interfaces, exceptions; follow a call from one class to another' : 'Đọc được class, interface, exception; lần theo một lời gọi từ lớp này sang lớp khác'}</td><td>Academy PRO192</td></tr>
<tr><td>${en ? 'Servlet/JSP + JDBC (PRJ301)' : 'Servlet/JSP + JDBC (PRJ301)'}</td><td>${en ? 'The lab app is a Servlet/JSP app: doGet/doPost, request/session, forward/redirect' : 'Ứng dụng lab là Servlet/JSP: doGet/doPost, request/session, forward/redirect'}</td><td>Academy PRJ301</td></tr>
<tr><td>Git</td><td>${en ? 'Clone, branch, commit; Chapter 2 reads history with log/blame' : 'Clone, nhánh, commit; Chương 2 đọc lịch sử bằng log/blame'}</td><td>${en ? 'Git course, Chapters 1–2' : 'Khoá Git, Chương 1–2'}</td></tr>
<tr><td>SQL</td><td>${en ? 'SELECT/JOIN, keys; reading a schema, a trigger, a stored procedure' : 'SELECT/JOIN, khoá; đọc schema, trigger, stored procedure'}</td><td>Academy DBI202</td></tr>
<tr><td>Spring Boot (${en ? 'optional now' : 'chưa bắt buộc'})</td><td>${en ? 'Chapter 7 upgrades Spring Boot 2 → 3; until then you only need to recognise @Controller/@Service' : 'Chương 7 nâng Spring Boot 2 → 3; trước đó chỉ cần nhận ra @Controller/@Service'}</td><td>${en ? 'Spring Boot course' : 'Khoá Spring Boot'}</td></tr>
<tr><td>Docker (${en ? 'nice to have' : 'nên có'})</td><td>${en ? 'Lesson 0.1 starts the whole old stack with one command' : 'Bài 0.1 dựng cả stack cũ bằng một lệnh'}</td><td>${en ? 'Docker course, Chapter 1' : 'Khoá Docker, Chương 1'}</td></tr>
</tbody>
</table>
<p>${en
  ? 'If you have done PRJ301 you already know more than enough Java web to start. You do not need to be good at it; reading slowly is fine. Writing a lot of code is not the skill here — <em>reading</em> it is.'
  : 'Đã học PRJ301 là bạn có thừa Java web để bắt đầu. Không cần giỏi; đọc chậm cũng được. Kỹ năng ở đây không phải viết thật nhiều code mà là <em>đọc</em> nó.'}</p>

<h3>${en ? '4. What you will be able to do afterwards' : '4. Học xong làm được gì'}</h3>
<ul>
<li>${en ? '<strong>At OJT / in an outsourcing company</strong> (FPT Software, and most companies that build for foreign clients): take a maintenance ticket on a Java/Spring/JSP project you have never seen, get it running on your machine the same day, find the code involved, and send a small PR your lead can review in five minutes.' : '<strong>Ở OJT / công ty outsourcing</strong> (FPT Software và phần lớn công ty làm phần mềm cho khách nước ngoài): nhận một ticket bảo trì trên dự án Java/Spring/JSP chưa từng thấy, dựng chạy được trên máy ngay trong ngày, tìm đúng chỗ code liên quan và gửi một PR nhỏ mà leader review trong năm phút.'}</li>
<li>${en ? '<strong>Before changing anything</strong>: write tests that pin today’s behaviour (Chapter 3), so that a change that breaks something turns a test red instead of turning a customer angry.' : '<strong>Trước khi sửa bất cứ gì</strong>: viết test khoá hành vi hiện tại (Chương 3), để một thay đổi làm hỏng chỗ khác thì test đỏ chứ không phải khách nổi giận.'}</li>
<li>${en ? '<strong>Name problems precisely</strong> — “this is Feature Envy, Move Method fixes it” — so code review becomes a conversation, not an argument (Chapters 4–5).' : '<strong>Gọi tên vấn đề chính xác</strong> — "đây là Feature Envy, Move Method giải được" — để review code thành trao đổi chứ không thành cãi nhau (Chương 4–5).'}</li>
<li>${en ? '<strong>Remove risk</strong>: dead code, vulnerable libraries, concatenated SQL (Chapter 6); upgrade Java 8 → 17/21 and Spring Boot 2 → 3 one safe step at a time (Chapter 7).' : '<strong>Gỡ rủi ro</strong>: code chết, thư viện có lỗ hổng, SQL nối chuỗi (Chương 6); nâng Java 8 → 17/21 và Spring Boot 2 → 3 từng bước an toàn (Chương 7).'}</li>
<li>${en ? '<strong>Answer the interview question</strong> every outsourcing company asks: “How do you approach a codebase you don’t know?” — with a real project you did, not a textbook answer (Chapter 9).' : '<strong>Trả lời câu phỏng vấn</strong> mà công ty outsourcing nào cũng hỏi: "Bạn tiếp cận một codebase lạ thế nào?" — bằng một dự án thật bạn đã làm, không phải câu trả lời sách vở (Chương 9).'}</li>
</ul>

<h3>${en ? '5. How expensive old code really is — numbers with sources' : '5. Code cũ tốn kém tới đâu — số liệu có nguồn'}</h3>
<p>${en
  ? 'The US Government Accountability Office audited federal IT in report GAO-16-468 (May 2016). The government spends more than <strong>80 billion dollars</strong> on IT every year, and about <strong>75%</strong> of the FY2015 IT budget went to operations and maintenance rather than new development. 5,233 of roughly 7,000 IT investments spent <em>all</em> their money on keeping existing systems alive. Some of the systems audited were about 50 years old, written in assembly or COBOL. Money for development, modernisation and enhancement fell by 7.3 billion dollars between FY2010 and FY2017.'
  : 'Văn phòng Kiểm toán Chính phủ Mỹ (GAO) kiểm toán CNTT liên bang trong báo cáo GAO-16-468 (05/2016). Chính phủ chi hơn <strong>80 tỷ đô la</strong> cho CNTT mỗi năm, và khoảng <strong>75%</strong> ngân sách CNTT năm tài khoá 2015 dành cho vận hành và bảo trì chứ không phải phát triển mới. 5.233 trên khoảng 7.000 khoản đầu tư CNTT dùng <em>toàn bộ</em> tiền để giữ hệ thống cũ chạy tiếp. Vài hệ thống được kiểm toán đã khoảng 50 tuổi, viết bằng assembly hoặc COBOL. Tiền cho phát triển, hiện đại hoá và nâng cấp giảm 7,3 tỷ đô từ năm tài khoá 2010 tới 2017.'}</p>
<p>${en
  ? 'You will not maintain COBOL. But the shape is the same everywhere: the bigger and older a system, the more of every budget — and every developer’s week — goes into understanding and changing what already exists. That is the work an outsourcing company sells, and the work interns are trusted with first.'
  : 'Bạn sẽ không bảo trì COBOL. Nhưng hình dạng thì ở đâu cũng vậy: hệ thống càng lớn và càng cũ, phần ngân sách — và phần thời gian mỗi tuần của lập trình viên — dành cho việc hiểu và sửa những gì đã có càng lớn. Đó là thứ công ty outsourcing bán, và là việc người ta giao cho intern đầu tiên.'}</p>
<div class="callout warn"><p>${en
  ? '<strong>Old code fails expensively, too.</strong> The next lesson tells two stories from official reports: a trading firm that lost more than 460 million dollars in about 45 minutes because unused old code was still callable on one server (SEC, 2013), and a rocket destroyed on its first flight by a reused function that was no longer needed (ESA inquiry, 1996).'
  : '<strong>Code cũ hỏng cũng rất đắt.</strong> Bài sau kể hai câu chuyện từ báo cáo chính thức: một công ty giao dịch mất hơn 460 triệu đô trong khoảng 45 phút vì một đoạn code cũ không còn dùng vẫn gọi được trên một máy chủ (SEC, 2013), và một tên lửa nổ ngay chuyến bay đầu vì một hàm dùng lại không còn cần thiết (uỷ ban điều tra ESA, 1996).'}</p></div>

<h3>${en ? '6. The route through this course — and which courses go with it' : '6. Lộ trình khoá — và nên học kèm khoá nào'}</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">0</span><span class="lz-t">${en ? 'Set up the lab' : 'Dựng lab'}</span><span class="lz-d">${en ? 'an old Java 8 library app' : 'ứng dụng thư viện Java 8 cũ'}</span></div>
  <div class="lz-step"><span class="lz-k">1–2</span><span class="lz-t">${en ? 'Run it, map it' : 'Dựng chạy, vẽ bản đồ'}</span><span class="lz-d">${en ? 'build, versions, data, history' : 'build, phiên bản, dữ liệu, lịch sử'}</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">${en ? 'Safety net' : 'Lưới an toàn'}</span><span class="lz-d">${en ? 'characterization tests, seams' : 'characterization test, seam'}</span></div>
  <div class="lz-step"><span class="lz-k">4–5</span><span class="lz-t">${en ? 'Smells → refactorings' : 'Smell → refactoring'}</span><span class="lz-d">${en ? 'with the IDE, in small steps' : 'bằng IDE, từng bước nhỏ'}</span></div>
  <div class="lz-step"><span class="lz-k">6–7</span><span class="lz-t">${en ? 'Dead code, CVEs, upgrades' : 'Code chết, CVE, nâng cấp'}</span><span class="lz-d">Java 8 → 17, Boot 2 → 3</span></div>
  <div class="lz-step"><span class="lz-k">8–9</span><span class="lz-t">${en ? 'Small PRs, capstone sprint' : 'PR nhỏ, sprint cuối khoá'}</span><span class="lz-d">${en ? 'hand the app over better than you found it' : 'bàn giao tốt hơn lúc nhận'}</span></div>
</div>
<p>${en
  ? 'This course links to, rather than repeats, what other courses on this site already teach. Take them alongside when the chapter points there:'
  : 'Khoá này dẫn link chứ không dạy lại những gì khoá khác trên trang đã dạy. Học kèm khi chương nào chỉ sang:'}</p>
${lk(bai('testing', 'tst-10-2-code-cu'), '🧪', en ? 'Testing 10.2 — Tests for legacy code' : 'Testing 10.2 — Test cho code cũ', en ? 'The idea of a characterization test; Chapter 3 here applies it to servlets and DAOs' : 'Khái niệm characterization test; Chương 3 ở đây áp nó lên servlet và DAO')}
${lk(bai('git', 'git-2-3-blame-va-pickaxe'), '🌿', en ? 'Git 2.3 — blame and pickaxe' : 'Git 2.3 — blame và pickaxe', en ? 'The commands behind lesson 2.4 (reading history for the “why”)' : 'Các lệnh dùng ở bài 2.4 (đọc lịch sử để hiểu "vì sao")')}
${lk(bai('inside-cuongthai', 'inside-cuongthai-2-1-cau-truc'), '🏗️', en ? 'Inside cuongthai.com, Chapter 2 — Touring a large codebase' : 'Bên trong cuongthai.com, Chương 2 — Đi tour một codebase lớn', en ? 'The same mapping method on a large real Node/TypeScript repository' : 'Cùng phương pháp vẽ bản đồ trên một repo Node/TypeScript lớn có thật')}
${lk('/courses/spring-boot', '🌱', 'Spring Boot', en ? 'Needed from Chapter 7 (Boot 2 → 3); the modern target the old app will move towards' : 'Cần từ Chương 7 (Boot 2 → 3); đích hiện đại mà ứng dụng cũ sẽ tiến dần tới')}
${lk('/courses/java-web-application-development', '☕', 'PRJ301 — Java Web Application Development (Academy)', en ? 'Servlet, JSP, JDBC — the stack of the lab app' : 'Servlet, JSP, JDBC — đúng stack của ứng dụng lab')}

<h3>🎤 ${en ? 'The interview question this course answers' : 'Câu phỏng vấn khoá này giúp bạn trả lời'}</h3>
<p>${en
  ? '<strong>“You join a project with 200,000 lines of code you have never seen. What do you do in your first week?”</strong> A weak answer: “I read the code.” A strong answer is a sequence: get it running locally and write down every step that was missing; find the entry points; trace one important request end to end; read the schema and the recent history of the files I must touch; ask a specific question with my notes in hand; pin behaviour with a test before my first change; keep that change small. By Chapter 9 you will be able to tell this as a story about a project you actually did.'
  : '<strong>"Bạn vào một dự án 200.000 dòng code chưa từng thấy. Tuần đầu bạn làm gì?"</strong> Câu trả lời yếu: "Em đọc code." Câu trả lời mạnh là một trình tự: dựng chạy được trên máy và ghi lại mọi bước còn thiếu; tìm các điểm vào; lần một request quan trọng từ đầu tới cuối; đọc schema và lịch sử gần đây của những tệp phải sửa; hỏi một câu cụ thể khi đã cầm sẵn ghi chép; khoá hành vi bằng test trước thay đổi đầu tiên; giữ thay đổi đó thật nhỏ. Tới Chương 9 bạn sẽ kể được trình tự này như câu chuyện về một dự án chính mình đã làm.'}</p>

<h3>🧪 ${en ? 'Practice (10 minutes)' : 'Thực hành (10 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Open the last project you wrote at university that is at least six months old. Do not run it yet.' : 'Mở dự án gần nhất bạn viết ở trường mà đã ít nhất sáu tháng tuổi. Chưa chạy vội.'}</li>
<li>${en ? 'Write down, from memory only: which JDK/Node version it needs, how the database is created, which account logs in, which file handles login.' : 'Chỉ bằng trí nhớ, ghi ra: cần JDK/Node bản nào, CSDL tạo bằng cách nào, tài khoản nào đăng nhập được, tệp nào xử lý đăng nhập.'}</li>
<li>${en ? 'Now check each answer in the code. Count how many you got wrong or could not answer.' : 'Giờ kiểm từng câu trong code. Đếm số câu bạn trả lời sai hoặc không trả lời được.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'you have a number. Most people miss at least two of four — on their <em>own</em> code. Keep the list; lesson 1.5 turns it into a README.' : 'bạn có một con số. Phần lớn mọi người sai ít nhất hai trên bốn — với chính code <em>của mình</em>. Giữ danh sách đó; bài 1.5 sẽ biến nó thành README.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Legacy code', 'code cũ / code kế thừa', 'Theo Feathers: code không có test, bất kể tuổi.', 'Per Feathers: code without tests, whatever its age.'],
  ['Refactoring', 'tái cấu trúc', 'Đổi cấu trúc code theo từng bước nhỏ mà giữ nguyên hành vi.', 'Changing the structure of code in small steps while keeping its behaviour.'],
  ['Rewrite', 'viết lại', 'Bỏ code cũ, viết hệ thống mới thay thế — rủi ro mất các bản vá cũ.', 'Throwing the old code away and building a replacement — risks losing old fixes.'],
  ['Maintenance', 'bảo trì', 'Sửa lỗi, thêm nhỏ, nâng cấp để hệ thống đang chạy tiếp tục chạy.', 'Fixing, small additions and upgrades that keep a running system running.'],
  ['Regression', 'hồi quy (lỗi tái phát)', 'Chức năng đang đúng bỗng sai sau một thay đổi ở chỗ khác.', 'Something that used to work breaks after a change elsewhere.'],
  ['Technical debt', 'nợ kỹ thuật', 'Cái giá phải trả thêm về sau vì đã chọn cách nhanh hôm nay.', 'The extra cost you pay later for taking the quick way today.'],
  ['OJT (On-the-Job Training)', 'thực tập tại doanh nghiệp', 'Kỳ thực tập của chương trình FPT — nơi bạn gặp code cũ đầu tiên.', 'FPT’s internship term — usually where you meet legacy code first.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Legacy code = code without tests (Feathers, 2004); age is secondary.' : 'Legacy code = code không có test (Feathers, 2004); tuổi chỉ là phụ.'}</li>
<li>${en ? 'Refactoring = small behaviour-preserving changes (Opdyke 1990/1992, Fowler 1999/2018).' : 'Refactoring = thay đổi nhỏ giữ nguyên hành vi (Opdyke 1990/1992, Fowler 1999/2018).'}</li>
<li>${en ? 'Rewriting throws away years of bug fixes; it is a business decision, not an intern’s.' : 'Viết lại là vứt đi nhiều năm bản vá; đó là quyết định kinh doanh, không phải của intern.'}</li>
<li>${en ? 'About 75% of a large IT budget can go to keeping existing systems alive (GAO-16-468).' : 'Khoảng 75% ngân sách CNTT lớn có thể dành để giữ hệ thống cũ chạy (GAO-16-468).'}</li>
<li>${en ? 'The course order is the job order: run → map → pin with tests → refactor → upgrade → small PRs.' : 'Thứ tự khoá chính là thứ tự công việc: dựng chạy → vẽ bản đồ → khoá bằng test → refactor → nâng cấp → PR nhỏ.'}</li>
</ul>

${tl('https://www.informit.com/store/working-effectively-with-legacy-code-9780131177055', '📕', 'Michael Feathers — Working Effectively with Legacy Code (Pearson, 2004)', en ? 'The book behind “legacy code is code without tests”' : 'Cuốn sách của định nghĩa "legacy code là code không có test"')}
${tl('https://martinfowler.com/books/refactoring.html', '📗', 'Martin Fowler — Refactoring (1999, 2nd ed. 2018)', en ? 'Definition, history of the book and the online catalogue' : 'Định nghĩa, lịch sử cuốn sách và danh mục trực tuyến')}
${tl('https://en.wikipedia.org/wiki/Code_refactoring', '📜', 'Wikipedia — Code refactoring (History)', 'Opdyke &amp; Johnson 1990, Opdyke 1992')}
${tl('https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/', '✍️', 'Joel Spolsky — Things You Should Never Do, Part I (2000)', en ? 'Netscape’s rewrite and why old code is full of bug fixes' : 'Netscape viết lại và vì sao code cũ đầy bản vá')}
${tl('https://www.gao.gov/products/gao-16-468', '🏛️', 'GAO-16-468 — Federal Agencies Need to Address Aging Legacy Systems (2016)', en ? '$80B+ per year, ~75% on operations and maintenance' : 'Hơn 80 tỷ đô/năm, ~75% cho vận hành và bảo trì')}
`
);

/* ═══════════════════ Bắt đầu tại đây (2/2) ═══════════════════ */
const O_SQLI = out(`
$ curl -s -o /dev/null -w "%{http_code}\\n" -d "username=admin&password=sai" localhost:18080/thuvien/login
200
$ curl -s -o /dev/null -w "%{http_code} %{redirect_url}\\n" \\
    --data-urlencode "username=admin' -- " --data-urlencode "password=gi-cung-duoc" \\
    localhost:18080/thuvien/login
302 http://localhost:18080/thuvien/books
`
);
const C_SQLI = java(`
rs = st.executeQuery("SELECT * FROM users WHERE username = '" + u + "' AND password = '" + p + "'");
// u = "admin' -- "  ⇒  SELECT * FROM users WHERE username = 'admin' -- ' AND password = '...'
//                                                            ^^ phần sau -- là chú thích, mật khẩu bị bỏ qua
`
);
const BD2 = ml((en) => `
<span class="eyebrow">${en ? 'Section 0 · Start here (2/2)' : 'Mục 0 · Bắt đầu tại đây (2/2)'}</span>
<h2>${en ? 'Editing blind: fix one thing, break three' : 'Sửa mù: sửa một chỗ, hỏng ba chỗ'}</h2>
<p class="lead">${en
  ? 'This lesson is about what happens when people change old code without the method this course teaches — in two famous incidents from official reports, in a typical OJT week, and in the lab app you will install next. Then it gives you a way to study that does not end in giving up.'
  : 'Bài này kể chuyện xảy ra khi người ta sửa code cũ mà không có phương pháp của khoá này — qua hai sự cố nổi tiếng trong báo cáo chính thức, qua một tuần OJT điển hình, và ngay trên ứng dụng lab bạn sắp cài. Rồi bài đưa ra một cách học để không bỏ cuộc giữa chừng.'}</p>

<h3>${en ? 'Three ways blind edits go wrong' : 'Ba kiểu sửa mù hay gặp'}</h3>
<ol>
<li><strong>${en ? 'No tests, so no warning.' : 'Không có test nên không có cảnh báo.'}</strong> ${en ? 'You change a fee calculation; the report page that shares a query breaks; nobody notices until the client does.' : 'Bạn sửa phép tính phí; trang báo cáo dùng chung một câu truy vấn bị hỏng; không ai biết cho tới khi khách hàng phát hiện.'}</li>
<li><strong>${en ? 'Refactoring and behaviour change in one commit.' : 'Refactor và đổi hành vi trong cùng một commit.'}</strong> ${en ? 'The diff is 900 lines; the one line that changed the behaviour is invisible in review; when it breaks, nobody can revert just that line.' : 'Diff 900 dòng; đúng một dòng đổi hành vi thì không ai thấy khi review; lúc hỏng, không ai revert riêng được dòng đó.'}</li>
<li><strong>${en ? 'Assumptions that were true for the old context.' : 'Giả định chỉ đúng trong bối cảnh cũ.'}</strong> ${en ? 'Code that worked for years is reused somewhere its hidden assumptions no longer hold. The two incidents below are exactly this.' : 'Code chạy đúng nhiều năm được đem dùng ở nơi mà các giả định ngầm của nó không còn đúng. Hai sự cố dưới đây chính là kiểu này.'}</li>
</ol>

<h3>${en ? 'Incident 1 — Knight Capital, 1 August 2012: dead code that was still alive' : 'Sự cố 1 — Knight Capital, 01/08/2012: code chết mà vẫn còn sống'}</h3>
<p>${en
  ? 'The facts below are from the SEC order against Knight Capital Americas (Release No. 34-70694, 16 October 2013, paragraphs 13–17). Knight’s order router contained an old feature called “Power Peg”, which the firm had stopped using in 2003 but never removed; it was still present and callable. In 2005 a piece of its logic (the counter that stops sending orders once a parent order is filled) was moved elsewhere, and Power Peg was not retested. In 2012 new code for a NYSE programme was meant to <em>replace</em> the unused Power Peg code and <em>reused the flag</em> that used to switch Power Peg on. A technician did not copy the new code to one of the eight servers, and no second person reviewed the deployment.'
  : 'Các dữ kiện dưới đây lấy từ quyết định của SEC (Uỷ ban Chứng khoán Mỹ) đối với Knight Capital Americas (Release No. 34-70694, 16/10/2013, đoạn 13–17). Bộ định tuyến lệnh của Knight còn một tính năng cũ tên "Power Peg" mà công ty đã thôi dùng từ 2003 nhưng không xoá; nó vẫn nằm đó và gọi được. Năm 2005, một phần logic của nó (bộ đếm dừng gửi lệnh khi lệnh mẹ đã khớp đủ) bị chuyển đi chỗ khác, và Power Peg không được test lại. Năm 2012, code mới cho một chương trình của sàn NYSE được định để <em>thay thế</em> đoạn Power Peg không dùng nữa và <em>dùng lại đúng cái cờ</em> trước kia bật Power Peg. Một kỹ thuật viên quên chép code mới lên một trong tám máy chủ, và không có người thứ hai kiểm lại việc triển khai.'}</p>
<p>${en
  ? 'On 1 August, orders carrying the reused flag reached the eighth server and woke up Power Peg — now without its stop counter. For 212 incoming orders the system sent millions of child orders: about 4 million executions in 154 stocks, more than 397 million shares in roughly 45 minutes, and a realised loss of about <strong>460 million dollars</strong>. Before the market opened, the system had even sent 97 automated e-mails mentioning “Power Peg disabled”; they were not designed as alerts and nobody read them. Knight paid a 12 million dollar penalty.'
  : 'Ngày 01/08, các lệnh mang cái cờ dùng lại tới máy chủ thứ tám và đánh thức Power Peg — lúc này đã mất bộ đếm dừng. Với 212 lệnh đầu vào, hệ thống bắn ra hàng triệu lệnh con: khoảng 4 triệu lượt khớp trên 154 mã cổ phiếu, hơn 397 triệu cổ phiếu trong khoảng 45 phút, và khoản lỗ thực tế khoảng <strong>460 triệu đô</strong>. Trước giờ mở cửa, hệ thống còn gửi 97 email tự động có dòng "Power Peg disabled"; chúng không được thiết kế làm cảnh báo nên không ai đọc. Knight nộp phạt 12 triệu đô.'}</p>
<table>
<thead><tr><th>${en ? 'What went wrong' : 'Chỗ sai'}</th><th>${en ? 'What this course does instead' : 'Khoá này làm gì thay thế'}</th><th>${en ? 'Chapter' : 'Chương'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Unused code left callable for 9 years' : 'Code không dùng vẫn gọi được suốt 9 năm'}</td><td>${en ? 'Find dead code with evidence, delete it (git keeps history)' : 'Tìm code chết có bằng chứng rồi xoá (git vẫn giữ lịch sử)'}</td><td>6.1</td></tr>
<tr><td>${en ? 'Logic moved without retesting' : 'Chuyển logic mà không test lại'}</td><td>${en ? 'Characterization tests before moving anything' : 'Characterization test trước khi chuyển bất cứ gì'}</td><td>3, 5</td></tr>
<tr><td>${en ? 'A flag reused for a new meaning' : 'Dùng lại cờ cho nghĩa mới'}</td><td>${en ? 'Read history before reusing a name; one name, one meaning' : 'Đọc lịch sử trước khi dùng lại một cái tên; một tên, một nghĩa'}</td><td>2.4</td></tr>
<tr><td>${en ? 'One of eight servers not updated, no review' : 'Một trên tám máy không được cập nhật, không ai kiểm'}</td><td>${en ? 'Reproducible environments; small reviewed PRs' : 'Môi trường dựng lại được; PR nhỏ có review'}</td><td>1.4, 8</td></tr>
</tbody>
</table>

<h3>${en ? 'Incident 2 — Ariane 5 flight 501, 4 June 1996: reused code outside its assumptions' : 'Sự cố 2 — Ariane 5 chuyến 501, 04/06/1996: code dùng lại ngoài giả định của nó'}</h3>
<p>${en
  ? 'The first Ariane 5 rocket veered off course about 40 seconds into the flight and was destroyed. ESA’s inquiry board blamed “specification and design errors in the software of the inertial reference system”. The navigation software was carried over from Ariane 4. One of its functions, an alignment routine, “served a purpose only before lift-off (but remained operative afterwards)”. Ariane 5 flew a faster early trajectory than Ariane 4, so a value in that routine (the horizontal bias) grew larger than ever before; converting it from a 64-bit floating-point number to a 16-bit integer overflowed, both inertial units shut down, and the guidance computer read diagnostic data as flight data. The code was not “wrong” for Ariane 4. It was wrong for the place it was reused in — and the tests never fed it Ariane 5’s trajectory.'
  : 'Tên lửa Ariane 5 đầu tiên lệch hướng khoảng 40 giây sau khi bay và bị phá huỷ. Uỷ ban điều tra của ESA (Cơ quan Vũ trụ châu Âu) kết luận nguyên nhân là "lỗi đặc tả và thiết kế trong phần mềm của hệ quy chiếu quán tính". Phần mềm định vị được mang nguyên từ Ariane 4 sang. Một hàm của nó — thủ tục căn chỉnh — "chỉ có tác dụng trước khi rời bệ phóng (nhưng vẫn tiếp tục chạy sau đó)". Ariane 5 bay quỹ đạo ban đầu nhanh hơn Ariane 4, nên một giá trị trong thủ tục đó (độ lệch ngang) lớn hơn bao giờ hết; đổi nó từ số thực 64 bit sang số nguyên 16 bit bị tràn, cả hai bộ quán tính tắt, và máy tính dẫn đường đọc dữ liệu chẩn đoán như dữ liệu bay. Code đó không "sai" với Ariane 4. Nó sai ở nơi người ta đem nó đi dùng lại — và bộ test chưa từng cho nó chạy với quỹ đạo của Ariane 5.'}</p>
<p>${en
  ? 'Lesson for you: when you reuse an old method in a new place (lesson 5.3), its hidden assumptions come along. A characterization test with the <em>new</em> inputs is how you find them before production does.'
  : 'Bài học cho bạn: khi đem một hàm cũ đi dùng ở chỗ mới (bài 5.3), các giả định ngầm của nó đi theo. Một characterization test với đầu vào <em>mới</em> là cách bạn tìm ra chúng trước khi môi trường thật tìm ra.'}</p>

<h3>${en ? 'A typical OJT week (illustration, not a real case)' : 'Một tuần OJT điển hình (tình huống minh hoạ, không phải chuyện thật)'}</h3>
<p>${en
  ? 'Monday: you get ticket LIB-112 — “Student readers should be able to borrow at most 3 books; one student has 4.” The servlet is 200 lines, there are no tests, the author left in 2019. Tuesday: you change <code>&gt;</code> to <code>&gt;=</code>, the borrowing rule now works, and while you are there you rename variables, reformat the file and move the SQL into a new class. Wednesday: the PR is 400 lines; your lead asks why the overdue report now shows different fines. You do not know — the report calls a stored procedure you never opened. Thursday: you split the PR. The real fix is one character plus one test.'
  : 'Thứ Hai: bạn nhận ticket LIB-112 — "Độc giả sinh viên chỉ được mượn tối đa 3 cuốn; có bạn đang mượn 4." Servlet dài 200 dòng, không có test, người viết đã nghỉ từ 2019. Thứ Ba: bạn đổi <code>&gt;</code> thành <code>&gt;=</code>, luật mượn chạy đúng, và tiện tay đổi tên biến, format lại cả tệp, chuyển SQL sang một lớp mới. Thứ Tư: PR dài 400 dòng; leader hỏi vì sao báo cáo quá hạn giờ hiện phí khác. Bạn không biết — báo cáo gọi một stored procedure bạn chưa từng mở. Thứ Năm: bạn tách PR. Bản sửa thật là một ký tự cộng một test.'}</p>
<p>${en
  ? 'This exact bug lives in the lab app you will install next (lesson 2.2 traces it; Chapter 3 pins it with a test). So does the report whose fees disagree with the Java code.'
  : 'Đúng con bug này đang nằm trong ứng dụng lab bạn sắp cài (bài 2.2 lần ra nó; Chương 3 khoá nó bằng test). Cả cái báo cáo có phí lệch với code Java cũng vậy.'}</p>

<h3>🕵️ ${en ? 'Hacker’s corner — the lab app accepts a password it never checks' : 'Góc hacker — ứng dụng lab nhận một mật khẩu mà nó không hề kiểm'}</h3>
<p>${en
  ? 'Old code is also where old security holes live. The lab app builds its login query by gluing strings together. Here is what that means, run for real against the lab (only ever try this on your own lab copy):'
  : 'Code cũ cũng là nơi trú ngụ của lỗ hổng cũ. Ứng dụng lab dựng câu truy vấn đăng nhập bằng cách nối chuỗi. Đây là hệ quả, chạy thật trên bản lab (chỉ bao giờ thử trên bản lab của chính bạn):'}</p>
${O_SQLI}
${C_SQLI}
<p>${en
  ? 'A wrong password returns the login page (200). A username ending in <code>\' -- </code> turns the rest of the query into a comment, so the password is never compared, and the server redirects to the books page (302) as admin. Chapter 6.3 fixes it with <code>PreparedStatement</code>; for now, notice that you found a serious bug just by <em>reading</em> one line.'
  : 'Sai mật khẩu thì quay lại trang đăng nhập (200). Tên đăng nhập kết thúc bằng <code>\' -- </code> biến phần còn lại của câu truy vấn thành chú thích, nên mật khẩu không bao giờ được so, và máy chủ chuyển hướng sang trang sách (302) với quyền admin. Bài 6.3 sửa nó bằng <code>PreparedStatement</code>; giờ chỉ cần để ý: bạn tìm ra một lỗi nghiêm trọng chỉ bằng cách <em>đọc</em> một dòng.'}</p>

<h3>${en ? 'How to study this course without giving up' : 'Cách học khoá này để không bỏ cuộc'}</h3>
<p>${en
  ? 'People quit legacy-code courses for three reasons: the old stack will not start and the errors look scary; reading feels slow and unproductive compared with writing; and there is no visible progress. The course is designed around each one.'
  : 'Người ta bỏ dở khoá về code cũ vì ba lý do: stack cũ không chịu chạy và lỗi trông đáng sợ; đọc code cảm giác chậm, không ra sản phẩm so với viết; và không thấy mình tiến bộ. Khoá được thiết kế để đỡ từng lý do.'}</p>
<ul>
<li>${en ? '<strong>Scary errors are the lesson.</strong> Chapter 1 shows you, on purpose, the five errors an old Java project throws on a new machine, with the real output and the fix. When you hit them at work, you will have seen them.' : '<strong>Lỗi đáng sợ chính là bài học.</strong> Chương 1 cố ý cho bạn xem năm lỗi mà một dự án Java cũ ném ra trên máy mới, với output thật và cách sửa. Đi làm gặp lại, bạn đã từng thấy rồi.'}</li>
<li>${en ? '<strong>Read with a question.</strong> Never “read the code”. Always “find where a book’s available count changes”. A question gives reading an end.' : '<strong>Đọc kèm một câu hỏi.</strong> Đừng bao giờ "đọc code". Luôn là "tìm chỗ số sách còn lại thay đổi". Có câu hỏi thì việc đọc có điểm kết thúc.'}</li>
<li>${en ? '<strong>Keep a lab notebook.</strong> A file <code>NHAT-KY.md</code> in the lab repo: each session, three lines — what I tried, what happened, what I learned. Re-reading it after a week is the visible progress.' : '<strong>Giữ nhật ký lab.</strong> Một tệp <code>NHAT-KY.md</code> trong repo lab: mỗi buổi ba dòng — đã thử gì, kết quả ra sao, học được gì. Đọc lại sau một tuần chính là tiến bộ nhìn thấy được.'}</li>
<li>${en ? '<strong>Rhythm per lesson (45–60 min):</strong> read the lesson → type the commands yourself (do not paste) → do the 🧪 → write the notebook lines. Chapter quiz at the end of each chapter.' : '<strong>Nhịp mỗi bài (45–60 phút):</strong> đọc bài → tự gõ lệnh (đừng dán) → làm 🧪 → ghi nhật ký. Cuối mỗi chương làm quiz.'}</li>
<li>${en ? '<strong>Minimum route (2 weeks before OJT):</strong> Section 0, Chapters 1–3 and 8. <strong>Full route:</strong> everything, about 6 weeks at 1 hour a day.' : '<strong>Lộ trình tối thiểu (2 tuần trước OJT):</strong> Mục 0, Chương 1–3 và 8. <strong>Lộ trình đầy đủ:</strong> tất cả, khoảng 6 tuần, mỗi ngày 1 giờ.'}</li>
<li>${en ? '<strong>When stuck for 20 minutes</strong>, write the question as you would to a colleague: what I want, what I ran, the exact error, what I already tried. Half the time, writing it answers it.' : '<strong>Bí quá 20 phút</strong> thì viết câu hỏi như gửi đồng nghiệp: muốn làm gì, đã chạy lệnh gì, lỗi nguyên văn, đã thử những gì. Một nửa số lần, viết xong là tự ra.'}</li>
</ul>

<h3>🧪 ${en ? 'Practice (10 minutes)' : 'Thực hành (10 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Create <code>NHAT-KY.md</code> anywhere for now (you will move it into the lab repo in lesson 0.1).' : 'Tạo tệp <code>NHAT-KY.md</code> ở đâu cũng được (bài 0.1 sẽ chuyển vào repo lab).'}</li>
<li>${en ? 'Write the three reasons blind edits go wrong in your own words, and one sentence about which incident above scared you more, and why.' : 'Viết lại ba kiểu sửa mù bằng lời của bạn, và một câu: sự cố nào ở trên làm bạn sợ hơn, vì sao.'}</li>
<li>${en ? 'Pick your route (2 weeks or 6 weeks) and write the date you will finish Chapter 1.' : 'Chọn lộ trình (2 tuần hay 6 tuần) và ghi ngày bạn sẽ học xong Chương 1.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'the notebook exists with a dated first entry and a deadline for Chapter 1.' : 'nhật ký đã có, mục đầu tiên có ngày, và có hạn chót cho Chương 1.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Dead code', 'code chết', 'Code không còn được dùng — nhưng nếu vẫn gọi được thì chưa thật sự chết (Knight Capital).', 'Code no longer used — but if it is still callable, it is not really dead (Knight Capital).'],
  ['Feature flag', 'cờ tính năng', 'Một giá trị bật/tắt một nhánh code; dùng lại cờ cũ cho nghĩa mới là rủi ro lớn.', 'A value that switches a code path on or off; reusing an old flag for a new meaning is dangerous.'],
  ['Deployment', 'triển khai', 'Đưa phiên bản mới lên máy chủ; phải giống nhau trên mọi máy.', 'Putting a new version on the servers; it must be identical on every machine.'],
  ['Overflow', 'tràn số', 'Giá trị vượt quá kiểu dữ liệu chứa nó (Ariane: 64-bit thực → 16-bit nguyên).', 'A value too large for its type (Ariane: 64-bit float → 16-bit integer).'],
  ['SQL injection', 'chèn SQL', 'Dữ liệu người dùng bị ghép vào câu SQL và trở thành lệnh.', 'User input glued into SQL becomes part of the command.'],
  ['Root cause', 'nguyên nhân gốc', 'Lý do sâu nhất mà nếu sửa thì lỗi không quay lại.', 'The deepest reason; fix it and the bug does not come back.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Blind edits fail in three ways: no tests, mixed commits, assumptions from an old context.' : 'Sửa mù hỏng theo ba kiểu: không có test, commit trộn lẫn, giả định từ bối cảnh cũ.'}</li>
<li>${en ? 'Knight Capital: unused code still callable + a reused flag + one server not updated ⇒ ~$460M in ~45 minutes (SEC, 2013).' : 'Knight Capital: code không dùng vẫn gọi được + cờ dùng lại + một máy không cập nhật ⇒ ~460 triệu đô trong ~45 phút (SEC, 2013).'}</li>
<li>${en ? 'Ariane 501: a reused function ran where it had no purpose and overflowed on new inputs (ESA, 1996).' : 'Ariane 501: một hàm dùng lại chạy ở chỗ không còn tác dụng và tràn số với đầu vào mới (ESA, 1996).'}</li>
<li>${en ? 'The lab app already contains an off-by-one bug, a fee mismatch and an SQL injection — found by reading.' : 'Ứng dụng lab đã có sẵn một lỗi lệch một, một chỗ lệch phí và một lỗ SQL injection — tìm ra bằng cách đọc.'}</li>
<li>${en ? 'Study with a question, a notebook and a deadline; scary errors are part of the syllabus.' : 'Học kèm câu hỏi, nhật ký và hạn chót; lỗi đáng sợ là một phần của giáo trình.'}</li>
</ul>

${tl('https://www.sec.gov/newsroom/press-releases/2013-222', '🏛️', 'SEC press release 2013-222 — Knight Capital', en ? 'Settlement, $12M penalty, 4 million orders for 212 customer orders' : 'Dàn xếp, phạt 12 triệu đô, 4 triệu lệnh cho 212 lệnh khách')}
${tl('https://www.sec.gov/files/litigation/admin/2013/34-70694.pdf', '📄', 'SEC Order Release No. 34-70694 (PDF)', en ? 'Paragraphs 13–17: Power Peg, the repurposed flag, the eighth server' : 'Đoạn 13–17: Power Peg, cờ dùng lại, máy chủ thứ tám')}
${tl('https://www.esa.int/Newsroom/Press_Releases/Ariane_501_-_Presentation_of_Inquiry_Board_report', '🚀', 'ESA — Ariane 501 Inquiry Board report (1996)', en ? 'Specification and design errors; the alignment function that kept running' : 'Lỗi đặc tả và thiết kế; hàm căn chỉnh vẫn chạy sau khi phóng')}
${tl('https://en.wikipedia.org/wiki/Ariane_flight_V88', '📜', 'Wikipedia — Ariane flight V88', en ? 'Reused Ariane 4 code, the 64-bit → 16-bit conversion' : 'Code Ariane 4 dùng lại, phép đổi 64 bit → 16 bit')}
`
);

/* ═══════════════════ 0.1 — Dựng môi trường lab ═══════════════════ */
const O_TAI = out(`
$ mkdir -p ~/lgc && cd ~/lgc
$ curl -sLO ${ZIP_LAB}
$ unzip -q legacy-thu-vien-v1.zip && cd legacy-thu-vien
$ git log --oneline | wc -l
      13
$ git log --format='%h %ad %an  %s' --date=short | tail -3
1d7ff47 2016-09-20 Nguyen Anh Tuan  fix loi so luong am (TV-23)
d48c4bb 2016-03-15 Nguyen Anh Tuan  them chuc nang doc gia
1133063 2016-03-02 Nguyen Anh Tuan  init project
$ cat README.md
# Thu vien

Phan mem quan ly thu vien.

Chay bang Tomcat. DB: xem file sql trong thu muc db.

Lien he: Tuan
`
);
const O_CAY = out(`
$ find . -path ./.git -prune -o -type f -print | sort
./.gitignore
./Dockerfile
./README.md
./db/thuvien.sql
./docker-compose.yml
./pom.xml
./src/main/java/com/thuvien/dao/BookDAO.java
./src/main/java/com/thuvien/model/Book.java
./src/main/java/com/thuvien/model/Loan.java
./src/main/java/com/thuvien/model/Reader.java
./src/main/java/com/thuvien/servlet/BookServlet.java
./src/main/java/com/thuvien/servlet/ExportServlet.java
./src/main/java/com/thuvien/servlet/LoginServlet.java
./src/main/java/com/thuvien/servlet/ReaderServlet.java
./src/main/java/com/thuvien/servlet/ReportServlet.java
./src/main/java/com/thuvien/util/Constants.java
./src/main/java/com/thuvien/util/DBUtil.java
./src/main/java/com/thuvien/util/TokenUtil.java
./src/main/resources/db.properties
./src/main/resources/log4j.properties
./src/main/webapp/WEB-INF/web.xml
./src/main/webapp/books.jsp
./src/main/webapp/error.jsp
./src/main/webapp/header.jsp
./src/main/webapp/index.jsp
./src/main/webapp/login.jsp
./src/main/webapp/readers.jsp
./src/main/webapp/report.jsp
./src/test/java/com/thuvien/util/TokenUtilTest.java
`
);
const O_COMPOSE = out(`
$ docker compose up -d --build
…
 Image lgc-thuvien-web Built
 Container lgc-thuvien-db-1 Started
 Container lgc-thuvien-db-1 Waiting
 Container lgc-thuvien-db-1 Healthy
 Container lgc-thuvien-web-1 Started
$ docker compose ps --format 'table {{.Service}}\\t{{.Status}}\\t{{.Ports}}'
SERVICE   STATUS                    PORTS
db        Up 14 seconds (healthy)   0.0.0.0:18306->3306/tcp, [::]:18306->3306/tcp
web       Up 4 seconds              0.0.0.0:18080->8080/tcp, [::]:18080->8080/tcp
$ curl -s -o /dev/null -w "%{http_code} %{redirect_url}\\n" localhost:18080/thuvien/books
302 http://localhost:18080/thuvien/login
$ curl -s -c cj -o /dev/null -w "%{http_code} %{redirect_url}\\n" -d "username=admin&password=admin123" localhost:18080/thuvien/login
302 http://localhost:18080/thuvien/books
`
);
const C_DOCKERFILE = bash(`
# Dockerfile (khoá học thêm — dự án gốc không có)
FROM maven:3.9-eclipse-temurin-8 AS build      # JDK 8: mã dùng javax.xml.bind, JDK 11+ không biên dịch được
WORKDIR /src
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B package -DskipTests

FROM tomcat:9.0-jdk8-temurin                    # Tomcat 9 = javax.servlet; Tomcat 10+ = jakarta.servlet
RUN rm -rf /usr/local/tomcat/webapps/*
COPY --from=build /src/target/thuvien.war /usr/local/tomcat/webapps/thuvien.war
`
);
const O_TAY_BUILD = out(`
$ export JAVA_HOME=<đường tới JDK 8 của bạn>   # máy soạn bài: Zulu 8.0.514
$ mvn -B package
…
[INFO] --- compiler:3.1:compile (default-compile) @ thuvien ---
[WARNING] File encoding has not been set, using platform encoding UTF-8, i.e. build is platform dependent!
[INFO] Compiling 12 source files to …/legacy-thu-vien/target/classes
…
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] --- war:2.2:war (default-war) @ thuvien ---
[INFO] Building war: …/legacy-thu-vien/target/thuvien.war
[INFO] BUILD SUCCESS
`
);
const O_TAY_RUN = out(`
$ mysql -uroot -p123456 -h127.0.0.1 -P18306 < db/thuvien.sql
$ cp target/thuvien.war ~/lgc/apache-tomcat-9.0.124/webapps/
$ export DB_URL='jdbc:mysql://127.0.0.1:18306/thuvien?useUnicode=true&characterEncoding=UTF-8&useSSL=false&allowPublicKeyRetrieval=true'
$ ~/lgc/apache-tomcat-9.0.124/bin/startup.sh
Tomcat started.
$ grep "Deployment of web application archive" ~/lgc/apache-tomcat-9.0.124/logs/catalina.out
… Deployment of web application archive [/…/webapps/thuvien.war] has finished in [270] ms
`
);
const O_MOJIBAKE = out(`
$ curl -s -b cj localhost:18080/thuvien/books | sed -n '10p;12p'
  <a style="color:#fff" href="books">SÃ¡ch</a> |
  <a style="color:#fff" href="report">QuÃ¡ háº¡n (3)</a> |
`
);

const LAB = ml((en) => `
<span class="eyebrow">${en ? 'Section 0 · Lab setup' : 'Mục 0 · Dựng lab'}</span>
<h2>${en ? '0.1 — Lab setup: an old Java 8 Servlet/JSP app (and how an old Express API fits in)' : '0.1 — Dựng môi trường lab: ứng dụng Java 8 Servlet/JSP cũ (và một API Express cũ đi kèm)'}</h2>
<p class="lead">${en
  ? 'The whole course works on one repository, <strong>legacy-thu-vien</strong>: a small library-management web app written the way many Vietnamese projects were written in 2016–2019 — Java 8, Servlet/JSP, hand-written JDBC, a MySQL dump, three authors, a README of five lines. It is fictional, but every smell in it is a real, common one, put there on purpose. In this lesson you install it and get to the login page — and you write down every step that the README did not tell you.'
  : 'Cả khoá làm trên một repo duy nhất, <strong>legacy-thu-vien</strong>: một ứng dụng web quản lý thư viện nhỏ viết theo kiểu rất nhiều dự án Việt Nam giai đoạn 2016–2019 — Java 8, Servlet/JSP, JDBC viết tay, một file dump MySQL, ba người viết, README đúng năm dòng. Nó là hư cấu, nhưng mọi "mùi" trong nó đều là thứ thật và phổ biến, được cố ý đặt vào. Bài này cài nó và đi tới trang đăng nhập — và ghi lại mọi bước mà README không nói.'}</p>
<p><em>${en ? 'Every output below was run for real on:' : 'Mọi output dưới đây chạy thật trên:'} ${MOI_TRUONG}.</em></p>

<h3>${en ? 'What is inside the lab app' : 'Bên trong ứng dụng lab có gì'}</h3>
<table>
<thead><tr><th>${en ? 'Part' : 'Phần'}</th><th>${en ? 'What it is' : 'Là gì'}</th><th>${en ? 'Why it is there (chapter)' : 'Vì sao có (chương)'}</th></tr></thead>
<tbody>
<tr><td><code>pom.xml</code></td><td>${en ? 'Maven POM from an old archetype; compiler plugin 3.1, war plugin 2.2' : 'POM Maven từ archetype cũ; compiler plugin 3.1, war plugin 2.2'}</td><td>${en ? 'Fails on modern JDKs (1.1, 1.2)' : 'Hỏng trên JDK mới (1.1, 1.2)'}</td></tr>
<tr><td><code>BookServlet</code></td><td>${en ? '193 lines: search, borrow, return, add, delete, SQL, fees' : '193 dòng: tìm, mượn, trả, thêm, xoá, SQL, tính phí'}</td><td>${en ? 'God Servlet (4.2, 5.6)' : 'God Servlet (4.2, 5.6)'}</td></tr>
<tr><td><code>TokenUtil</code></td><td><code>javax.xml.bind.DatatypeConverter</code></td><td>${en ? 'Removed from JDK 11 (1.2, 7.1)' : 'Bị gỡ khỏi JDK 11 (1.2, 7.1)'}</td></tr>
<tr><td><code>header.jsp</code></td><td>${en ? 'SQL inside a JSP scriptlet' : 'SQL nằm trong scriptlet JSP'}</td><td>${en ? 'Smell + a real encoding bug (below)' : 'Smell + một lỗi bảng mã thật (bên dưới)'}</td></tr>
<tr><td><code>db/thuvien.sql</code></td><td>${en ? 'mysqldump with a trigger and a stored procedure' : 'mysqldump có trigger và stored procedure'}</td><td>${en ? 'Logic hidden in the database (1.4, 2.3)' : 'Logic trốn trong CSDL (1.4, 2.3)'}</td></tr>
<tr><td>${en ? 'git history' : 'lịch sử git'}</td><td>${en ? '12 commits 2016–2019 by three (fictional) people, plus one course commit' : '12 commit 2016–2019 của ba người (hư cấu), cộng một commit của khoá học'}</td><td>${en ? 'Reading the “why” (2.4)' : 'Đọc "vì sao" (2.4)'}</td></tr>
<tr><td><code>Dockerfile</code>, <code>docker-compose.yml</code></td><td>${en ? 'Added by the course, clearly marked in git' : 'Khoá học thêm vào, ghi rõ trong git'}</td><td>${en ? 'One command to run the old stack (1.4)' : 'Một lệnh dựng cả stack cũ (1.4)'}</td></tr>
</tbody>
</table>
<div class="callout warn"><p>${en
  ? '<strong>About the Express API.</strong> The course outline also mentions an old Node/Express service. It is used only in lessons 1.2 (native modules) and 7.4 (Node upgrades), and is introduced there; Sections 0–6 work entirely on the Java app. Node examples in lesson 1.2 run in a throw-away folder.'
  : '<strong>Về API Express.</strong> Đề cương khoá có nhắc một service Node/Express cũ. Nó chỉ dùng ở bài 1.2 (module native) và 7.4 (nâng Node), và được giới thiệu ngay tại đó; Mục 0 tới Chương 6 làm hoàn toàn trên ứng dụng Java. Ví dụ Node ở bài 1.2 chạy trong một thư mục tạm.'}</p></div>

<h3>${en ? 'Step 1 — Download, look, do not run yet' : 'Bước 1 — Tải về, nhìn, chưa chạy vội'}</h3>
${O_TAI}
${O_CAY}
<p>${en
  ? 'Before running anything, write in your notebook what the README <em>does not</em> say: which JDK? which MySQL? which port? which account? how is the database created? Here, each answer is somewhere in the repo — <code>pom.xml</code> says Java 1.8, <code>db.properties</code> says MySQL on 3306 with user root, the dump contains the accounts. Finding them is the first skill.'
  : 'Trước khi chạy gì, ghi vào nhật ký những thứ README <em>không</em> nói: JDK nào? MySQL nào? cổng nào? tài khoản nào? CSDL tạo bằng cách nào? Ở đây câu trả lời nằm rải rác trong repo — <code>pom.xml</code> nói Java 1.8, <code>db.properties</code> nói MySQL cổng 3306 user root, file dump chứa sẵn tài khoản. Tìm ra chúng chính là kỹ năng đầu tiên.'}</p>

<h3>${en ? 'Step 2a — The fast path: Docker Compose (recommended)' : 'Bước 2a — Đường nhanh: Docker Compose (khuyên dùng)'}</h3>
<p>${en
  ? 'If Docker Desktop (Mac/Windows) or Docker Engine (Linux) is installed, one command builds the WAR with JDK 8 and starts MySQL 8.0 plus Tomcat 9. Host ports 18306 and 18080 were chosen so they do not collide with a MySQL or Tomcat you may already run on 3306/8080.'
  : 'Đã cài Docker Desktop (Mac/Windows) hoặc Docker Engine (Linux) thì một lệnh là dựng WAR bằng JDK 8 và chạy MySQL 8.0 cùng Tomcat 9. Cổng máy 18306 và 18080 được chọn để không đụng MySQL hay Tomcat bạn có thể đang chạy ở 3306/8080.'}</p>
${O_COMPOSE}
${C_DOCKERFILE}
<p>${en
  ? 'The first build downloads images and Maven dependencies (about two minutes on a home connection); later builds are faster. The database is loaded from <code>db/thuvien.sql</code> the first time the <code>mysql-data</code> volume is created. To start over from the original data: <code>docker compose down -v</code> (the <code>-v</code> deletes that volume) and <code>up</code> again.'
  : 'Lần build đầu tải ảnh và thư viện Maven (khoảng hai phút với mạng nhà); các lần sau nhanh hơn. CSDL được nạp từ <code>db/thuvien.sql</code> ở lần đầu tạo volume <code>mysql-data</code>. Muốn làm lại từ dữ liệu gốc: <code>docker compose down -v</code> (cờ <code>-v</code> xoá volume đó) rồi <code>up</code> lại.'}</p>

<h3>${en ? 'Step 2b — The company path: JDK 8 + Tomcat 9 + MySQL by hand' : 'Bước 2b — Đường công ty: JDK 8 + Tomcat 9 + MySQL cài tay'}</h3>
<p>${en
  ? 'Many client projects do not allow Docker on developer laptops, so learn this path too. You need three things side by side with whatever you use daily:'
  : 'Nhiều dự án của khách không cho dùng Docker trên máy dev, nên hãy biết cả đường này. Cần ba thứ chạy song song với những gì bạn đang dùng hằng ngày:'}</p>
<ul>
<li>${en ? '<strong>JDK 8.</strong> On a Mac with Apple silicon, Eclipse Temurin publishes no JDK 8 build for aarch64 (the Adoptium API returns an empty list) — use Azul Zulu or Amazon Corretto 8. With SDKMAN: <code>sdk list java | grep "8\\.0"</code>, then <code>sdk install java 8.0.xxx-zulu</code>. On Windows: install the MSI, then set <code>JAVA_HOME</code> per terminal instead of system-wide, so your Java 17/21 projects keep working.' : '<strong>JDK 8.</strong> Trên Mac chip Apple, Eclipse Temurin không có bản JDK 8 cho aarch64 (API của Adoptium trả về danh sách rỗng) — dùng Azul Zulu hoặc Amazon Corretto 8. Có SDKMAN: <code>sdk list java | grep "8\\.0"</code>, rồi <code>sdk install java 8.0.xxx-zulu</code>. Trên Windows: cài MSI, rồi đặt <code>JAVA_HOME</code> theo từng cửa sổ terminal thay vì toàn hệ thống, để các dự án Java 17/21 của bạn vẫn chạy.'}</li>
<li>${en ? '<strong>Tomcat 9.x</strong> (not 10 — lesson 1.1 shows why): unzip the tar.gz/zip from tomcat.apache.org; nothing to install.' : '<strong>Tomcat 9.x</strong> (không phải 10 — bài 1.1 giải thích): giải nén tar.gz/zip từ tomcat.apache.org; không cần cài.'}</li>
<li>${en ? '<strong>MySQL 8.0</strong> — any install; the commands below assume it listens on 18306 like the Docker path (change the port to yours).' : '<strong>MySQL 8.0</strong> — cài kiểu nào cũng được; các lệnh dưới giả định nó nghe ở 18306 giống đường Docker (đổi cổng theo máy bạn).'}</li>
</ul>
${O_TAY_BUILD}
${O_TAY_RUN}
<p>${en
  ? '<code>DB_URL</code> works because <code>DBUtil</code> reads that environment variable before falling back to <code>db.properties</code> (open the file and check — never trust a lesson’s word for it). <code>allowPublicKeyRetrieval=true</code> is explained in lesson 1.4; without it, the old MySQL driver fails every time MySQL has just restarted.'
  : '<code>DB_URL</code> dùng được vì <code>DBUtil</code> đọc biến môi trường đó trước khi rơi về <code>db.properties</code> (mở tệp ra kiểm — đừng bao giờ tin lời bài giảng). <code>allowPublicKeyRetrieval=true</code> được giải thích ở bài 1.4; thiếu nó, driver MySQL cũ hỏng mỗi khi MySQL vừa khởi động lại.'}</p>

<h3>${en ? 'Step 3 — Log in, and notice the first bug for free' : 'Bước 3 — Đăng nhập, và nhận miễn phí con bug đầu tiên'}</h3>
<p>${en
  ? 'Open <code>http://localhost:18080/thuvien/</code> and log in as <code>admin</code> / <code>admin123</code> (the accounts are in the dump, in plain text — that is a Chapter 6 problem). Look at the blue menu bar:'
  : 'Mở <code>http://localhost:18080/thuvien/</code> và đăng nhập <code>admin</code> / <code>admin123</code> (tài khoản nằm trong file dump, dạng chữ thường — đó là vấn đề của Chương 6). Nhìn thanh menu xanh:'}</p>
${O_MOJIBAKE}
<p>${en
  ? 'The table below the menu shows Vietnamese correctly, but the menu is garbled. <code>books.jsp</code> declares <code>pageEncoding="UTF-8"</code>; the included <code>header.jsp</code> declares nothing, and with a static <code>&lt;%@ include %&gt;</code> each file’s encoding is decided on its own — so Tomcat reads the header as ISO-8859-1. This was not planted as an exercise; it showed up when the lab was first run. Do not fix it yet: write it in your notebook as “known issue #1”. Lesson 1.6 asks you to file it as a ticket.'
  : 'Bảng phía dưới hiện tiếng Việt đúng, nhưng menu thì lỗi font. <code>books.jsp</code> khai <code>pageEncoding="UTF-8"</code>; tệp <code>header.jsp</code> được nhúng vào thì không khai gì, mà với <code>&lt;%@ include %&gt;</code> tĩnh, bảng mã của từng tệp được xác định riêng — nên Tomcat đọc header theo ISO-8859-1. Lỗi này không được cài làm bài tập; nó tự hiện ra lần đầu chạy lab. Chưa sửa vội: ghi vào nhật ký là "lỗi đã biết #1". Bài 1.6 sẽ yêu cầu bạn ghi nó thành ticket.'}</p>

<h3>${en ? 'Troubleshooting what we actually hit while preparing the lab' : 'Gỡ rối — những lỗi đã thật sự gặp khi soạn lab'}</h3>
<table>
<thead><tr><th>${en ? 'Symptom' : 'Triệu chứng'}</th><th>${en ? 'Cause' : 'Nguyên nhân'}</th><th>${en ? 'Fix / lesson' : 'Cách sửa / bài'}</th></tr></thead>
<tbody>
<tr><td><code>package javax.xml.bind does not exist</code></td><td>${en ? 'Building with JDK 11+' : 'Build bằng JDK 11+'}</td><td>${en ? 'Use JDK 8 (lesson 1.2)' : 'Dùng JDK 8 (bài 1.2)'}</td></tr>
<tr><td>${en ? 'All servlets 500, <code>ClassNotFoundException: javax.servlet.http.HttpServlet</code>' : 'Mọi servlet 500, <code>ClassNotFoundException: javax.servlet.http.HttpServlet</code>'}</td><td>${en ? 'WAR deployed on Tomcat 10+' : 'Đưa WAR lên Tomcat 10+'}</td><td>${en ? 'Tomcat 9 (lesson 1.1)' : 'Tomcat 9 (bài 1.1)'}</td></tr>
<tr><td><code>Public Key Retrieval is not allowed</code></td><td>${en ? 'Driver 5.1 + MySQL 8 auth, cache empty after restart' : 'Driver 5.1 + xác thực MySQL 8, bộ đệm rỗng sau khởi động lại'}</td><td>${en ? 'URL flag (lesson 1.4)' : 'Cờ trên URL (bài 1.4)'}</td></tr>
<tr><td><code>port is already allocated</code></td><td>${en ? 'Something already uses 18080/18306' : 'Có thứ khác đang dùng 18080/18306'}</td><td>${en ? 'Change the left side of <code>ports:</code> in the compose file' : 'Đổi vế trái của <code>ports:</code> trong compose'}</td></tr>
</tbody>
</table>

<h3>🧪 ${en ? 'Practice (20 minutes)' : 'Thực hành (20 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Get the app to the books page by path 2a or 2b. Move <code>NHAT-KY.md</code> into the repo.' : 'Đưa ứng dụng tới trang sách bằng đường 2a hoặc 2b. Chuyển <code>NHAT-KY.md</code> vào repo.'}</li>
<li>${en ? 'In the notebook, list every fact you needed that the README did not give (expect at least six: JDK, Tomcat version, MySQL version, port, how to load data, account).' : 'Trong nhật ký, liệt kê mọi thông tin bạn cần mà README không cho (ít nhất sáu: JDK, bản Tomcat, bản MySQL, cổng, cách nạp dữ liệu, tài khoản).'}</li>
<li>${en ? 'Click through Books, Readers and the “Quá hạn” report. Write one line about anything that looks wrong (you have one already: the menu).' : 'Bấm qua Sách, Độc giả và báo cáo "Quá hạn". Ghi một dòng cho mỗi thứ trông sai (đã có sẵn một: cái menu).'}</li>
<li>${en ? 'Run <code>docker compose down -v</code> then <code>up -d</code> again (or reload the dump) and check the data came back as it was.' : 'Chạy <code>docker compose down -v</code> rồi <code>up -d</code> lại (hoặc nạp lại dump) và kiểm dữ liệu đã về như cũ.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'the report page lists 3 overdue loans (Phạm Quốc Dũng 23 days, Lê Minh Châu 10, Nguyễn Văn An 6 — counted from the moment you loaded the data), and your notebook has the missing-facts list.' : 'trang báo cáo liệt kê 3 phiếu quá hạn (Phạm Quốc Dũng 23 ngày, Lê Minh Châu 10, Nguyễn Văn An 6 — tính từ lúc bạn nạp dữ liệu), và nhật ký có danh sách thông tin còn thiếu.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['WAR (Web Application Archive)', 'gói ứng dụng web', 'Tệp nén chứa class, JSP, thư viện; thả vào thư mục webapps của Tomcat là chạy.', 'A zip of classes, JSPs and libraries; drop it into Tomcat’s webapps folder to run it.'],
  ['Servlet container', 'bộ chứa servlet', 'Phần mềm chạy servlet/JSP — ở đây là Tomcat.', 'The server that runs servlets and JSPs — Tomcat here.'],
  ['Dump', 'bản kết xuất CSDL', 'Tệp .sql chứa lệnh tạo bảng và dữ liệu để dựng lại CSDL.', 'A .sql file of CREATE and INSERT statements that rebuilds a database.'],
  ['JAVA_HOME', 'biến chỉ JDK', 'Biến môi trường cho Maven/Tomcat biết dùng JDK nào.', 'The environment variable that tells Maven/Tomcat which JDK to use.'],
  ['Volume', 'ổ dữ liệu của container', 'Nơi Docker giữ dữ liệu MySQL qua các lần khởi động lại; xoá bằng down -v.', 'Where Docker keeps MySQL data across restarts; removed by down -v.'],
  ['Mojibake', 'lỗi font / sai bảng mã', 'Chữ bị hiển thị sai vì đọc bằng bảng mã khác lúc ghi.', 'Garbled text from reading bytes with a different encoding than they were written in.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'The lab is one repo: Java 8 Servlet/JSP + MySQL dump + 13 commits of history.' : 'Lab là một repo: Java 8 Servlet/JSP + dump MySQL + 13 commit lịch sử.'}</li>
<li>${en ? 'Look before you run: the README is wrong by omission; the facts are scattered in pom, properties and dump.' : 'Nhìn trước khi chạy: README sai vì thiếu; thông tin nằm rải trong pom, properties và dump.'}</li>
<li>${en ? 'Fast path: <code>docker compose up -d --build</code> → localhost:18080/thuvien.' : 'Đường nhanh: <code>docker compose up -d --build</code> → localhost:18080/thuvien.'}</li>
<li>${en ? 'Company path: JDK 8 (Zulu/Corretto on Apple silicon) + Tomcat 9 + MySQL 8.0, <code>DB_URL</code> to point at your database.' : 'Đường công ty: JDK 8 (Zulu/Corretto trên chip Apple) + Tomcat 9 + MySQL 8.0, <code>DB_URL</code> trỏ tới CSDL của bạn.'}</li>
<li>${en ? 'Write bugs down instead of fixing them on day one — the garbled menu is known issue #1.' : 'Ghi bug lại thay vì sửa ngay ngày đầu — menu lỗi font là lỗi đã biết #1.'}</li>
</ul>

${tl(ZIP_LAB, '📦', 'legacy-thu-vien-v1.zip', en ? 'The lab repository with its git history' : 'Repo lab kèm lịch sử git')}
${tl('https://tomcat.apache.org/migration-10.html', '🐱', 'Apache Tomcat — Migration guide to 10.x', en ? 'Why the javax → jakarta change matters (lesson 1.1)' : 'Vì sao đổi javax → jakarta quan trọng (bài 1.1)')}
${tl('https://sdkman.io/', '🧰', 'SDKMAN!', en ? 'Several JDKs side by side on Mac/Linux' : 'Nhiều JDK song song trên Mac/Linux')}
${lk('/courses/docker', '🐳', en ? 'Docker course' : 'Khoá Docker', en ? 'If docker compose is new to you, Chapter 1 there first' : 'Chưa quen docker compose thì học Chương 1 ở đó trước')}
`
);

export default {
  title: 'Section 0 — Maintenance is the real job|||Mục 0 — Bảo trì mới là công việc thật',
  description: 'Vì sao đọc và sửa code cũ là kỹ năng được trả tiền nhiều nhất của người mới.',
  lessons: [
    { title: 'Start here (1/2) — Why your first job is mostly other people\'s code|||Bắt đầu tại đây (1/2) — Vì sao công việc đầu tiên chủ yếu là code của người khác', slug: 'lgc-0-8-bat-dau-tai-day', type: 'LESSON', isFreePreview: true, description: 'Legacy code là gì (Feathers 2004), lịch sử refactoring (Opdyke 1990–92, Fowler 1999/2018), khác viết lại, nền cần có, học xong làm gì, chi phí thật (GAO-16-468), học kèm khoá nào.', content: BD1 },
    { title: 'Start here (2/2) — Editing blind: fix one thing, break three|||Bắt đầu tại đây (2/2) — Sửa mù: sửa một chỗ, hỏng ba chỗ', slug: 'lgc-0-9-bat-dau-khi-khong-co', type: 'LESSON', isFreePreview: true, description: 'Knight Capital 2012 (SEC), Ariane 501 1996 (ESA), một tuần OJT điển hình, SQL injection chạy thật trên repo lab, cách học không bỏ cuộc.', content: BD2 },
    { title: '0.1 — Lab setup: an old Java 8 Servlet/JSP app and an old Express API|||0.1 — Dựng môi trường lab: ứng dụng Java 8 Servlet/JSP cũ và một API Express cũ', slug: 'lgc-0-1-moi-truong-lab', type: 'LESSON', isFreePreview: true, description: 'Tải repo legacy-thu-vien, chạy bằng Docker Compose hoặc JDK 8 + Tomcat 9 + MySQL, đăng nhập, ghi lại mọi bước README thiếu và lỗi font đầu tiên.', content: LAB },
  ],
};
