/**
 * Bắt đầu tại đây (1/2) — khoá debug-co-phuong-phap (soạn 22/11/2026).
 * Output: chạy THẬT trong /tmp/dbg-lab/muc0 (macOS arm64 · Node v26.8.1). Nguồn lịch sử: Computer History Museum (tdih 9/9),
 * Google SRE Book ch12 + ch15, AWS Post-Event Summaries, Cloudflare blog 12/07/2019 — đều GET 200 ngày 22/11/2026.
 * Không trùng: web-foundations 10.2 (đọc lỗi nhập môn) — ở đây chỉ dẫn link.
 */
import { nguon, lienKet } from '../_chung.mjs';

const THE = [
  lienKet({ khoa: 'web-foundations', bai: 'wf-10-2-reading-errors-debugging', title: 'Web Foundations 10.2 — Reading errors and debugging', sub: 'Mới học lập trình? Bài nhập môn đọc lỗi + breakpoint đầu tiên. Khoá này là bản chuyên sâu của nó.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-1-2-giai-phau', title: 'Log từ A đến Z — Giải phẫu một dòng log', sub: 'Đọc log là kỹ năng riêng, dạy sâu ở khoá đó. Ở đây ta chỉ dùng log làm bằng chứng.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'observability-monitoring', bai: 'obs-11-1-nam-phut-dau', title: 'Observability — Năm phút đầu sau cảnh báo', sub: 'Khi lỗi xảy ra trên hệ thống đang chạy: từ cảnh báo tới nguyên nhân bằng số đo.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🏛️', 'Computer History Museum — September 9, 1947: first actual computer bug', 'Con bướm đêm trong rơ-le máy Harvard Mark II và dòng chữ trong sổ nhật ký.', 'https://www.computerhistory.org/tdih/september/9/'),
  nguon('📘', 'Google SRE Book — Chapter 12: Effective Troubleshooting', 'Quy trình 5 bước của Google: báo lỗi → phân loại → quan sát → chẩn đoán → kiểm và chữa.', 'https://sre.google/sre-book/effective-troubleshooting/'),
  nguon('📘', 'Google SRE Book — Chapter 15: Postmortem Culture', 'Postmortem không đổ lỗi và khi nào phải viết.', 'https://sre.google/sre-book/postmortem-culture/'),
  nguon('☁️', 'AWS — Post-Event Summaries', 'AWS công bố bản tổng kết công khai sau các sự cố lớn.', 'https://aws.amazon.com/premiumsupport/technology/pes/'),
].join('\n');

export default {
  title: 'Start here (1/2) — Why debugging is most of the job, and what this course gives you|||Bắt đầu tại đây (1/2) — Vì sao gỡ lỗi là phần lớn công việc, và khoá này cho bạn điều gì',
  slug: 'dbg-0-8-bat-dau-tai-day',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Gỡ lỗi là gì, chữ "bug" từ đâu ra (con bướm đêm 9/9/1947), khác log/test/monitoring ra sao, Google/AWS/Cloudflare làm gỡ lỗi và postmortem thế nào, cần nền gì, học xong làm được gì, học kèm khoá nào — và lần gỡ lỗi đầu tiên trong 10 phút.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>Hello. Most of your first job will be making broken things work — let us learn to do it on purpose</h2>
<p class="lead">Welcome. If you have ever stared at a red error for an hour, added <code>console.log</code> on every line, changed three things at once and then could not say which one fixed it — this course is for you. Nobody is born good at debugging. Experienced developers are not people who make fewer bugs; they are people who have a <strong>method</strong>: reproduce the bug, narrow down where it lives, form one hypothesis, test it, fix the cause, and add a test so it never comes back. This course teaches that method first, then the tools (VS Code, IntelliJ, browser DevTools, curl, SQL, git bisect) that make each step fast.</p>

<h3>An everyday picture: the good doctor</h3>
<p>A bad doctor hears "I have a headache" and immediately prescribes antibiotics. A good doctor asks: since when? Does it happen every morning or only after screens? Any fever? Then orders one test that splits the possibilities in half, reads the result, and only then prescribes. Debugging is the same job on code. <strong>Symptom</strong> (what the user sees) → <strong>examination</strong> (reproduce, look at real values) → <strong>diagnosis</strong> (the root cause) → <strong>treatment</strong> (the fix) → <strong>follow-up</strong> (a test that would catch a relapse). Writing <code>|| 0</code> to make a <code>NaN</code> disappear is the antibiotic prescribed without a diagnosis — Part 2 shows you exactly how that goes wrong.</p>

<h3>What a bug and debugging actually are</h3>
<ul>
<li>A <strong>bug</strong> is any difference between what the program does and what it should do. It is not always an error message: a total that is wrong by 10%, a button that does nothing, a page that is slow only on Mondays — all bugs.</li>
<li><strong>Debugging</strong> is finding the <em>root cause</em> of that difference, fixing it, and proving the fix. "Proving" matters: a fix you cannot explain is a guess that happened to work today.</li>
</ul>

<h3>Where the word "bug" comes from</h3>
<p>Engineers were calling hardware faults "bugs" long before computers — the Computer History Museum traces the term to Thomas Edison in the 1800s. The famous moment came on <strong>9 September 1947</strong>: the team running the <strong>Harvard Mark II</strong> computer found a moth stuck between the contacts of a relay, taped it into the machine's logbook and wrote: <em>"First actual case of bug being found."</em> Grace Hopper, a programmer on that team, made the story famous in her many talks. Notice the word <em>actual</em>: the joke only works because "bug" already meant "fault". And notice what the team did — they <strong>wrote it down</strong> in a log with the evidence attached. Seventy-nine years later that is still the habit this course will build.</p>

<h3>A day of an intern, honestly</h3>
<table>
<thead><tr><th>Time</th><th>What actually happens</th><th>Skill from this course</th></tr></thead>
<tbody>
<tr><td>09:00</td><td>A tester files "Booking page shows 500 sometimes"</td><td>Reproduce reliably (1.2)</td></tr>
<tr><td>10:00</td><td>Spring Boot will not start after you merge <code>main</code></td><td>Read the "Caused by" chain (2.2)</td></tr>
<tr><td>13:30</td><td>The API works in Postman but not from the React page</td><td>Isolate by layer (1.3), HTTP debugging (Ch6)</td></tr>
<tr><td>15:00</td><td>The monthly report shows double revenue</td><td>See the real SQL, JOIN multiplying rows (Ch7)</td></tr>
<tr><td>17:00</td><td>Your lead asks: "what was the root cause, and how do we know it will not come back?"</td><td>Debugging log + regression test (Ch1, Ch11)</td></tr>
</tbody>
</table>
<p>Writing new features is the part people talk about. Understanding why existing code misbehaves is the part that fills the day — and it is what your mentor will judge you on first.</p>

<h3>Debugging is not logging, testing or monitoring — but uses all three</h3>
<table>
<thead><tr><th></th><th>Question it answers</th><th>When</th><th>Where taught</th></tr></thead>
<tbody>
<tr><td><strong>Logging</strong></td><td>What happened, in what order?</td><td>Written before the bug, read after</td><td>log-tu-a-den-z</td></tr>
<tr><td><strong>Testing</strong></td><td>Does the code still do what we promised?</td><td>Before merging, in CI</td><td>Testing courses</td></tr>
<tr><td><strong>Monitoring</strong></td><td>Is the system healthy right now? Since when not?</td><td>Continuously in production</td><td>observability-monitoring</td></tr>
<tr><td><strong>Debugging</strong></td><td><strong>Why</strong> does it behave this way, and what is the smallest correct fix?</td><td>When any of the three says "something is wrong"</td><td>This course</td></tr>
</tbody>
</table>
<p>Logs and monitoring give you <em>evidence</em>; tests give you a way to <em>prove</em> the fix and prevent relapse; debugging is the reasoning that connects them.</p>

<h3>How large companies do it — the same loop, written down</h3>
<ul>
<li><strong>Google</strong> publishes its troubleshooting method in the SRE Book, chapter 12 "Effective Troubleshooting": problem report → triage → examine → diagnose → test and treat, and it warns that "correlation is not causation". Chapter 15 describes <strong>blameless postmortems</strong>: a write-up after an incident that "assumes that everyone involved in an incident had good intentions" and looks for system causes, written whenever there is user impact, data loss, a rollback, or a slow resolution.</li>
<li><strong>AWS</strong> commits to publishing a public <strong>Post-Event Summary</strong> after issues above certain impact thresholds — the most recent one listed is the DynamoDB disruption in us-east-1 on 19 October 2025.</li>
<li><strong>Cloudflare</strong> published a detailed account of its 2 July 2019 outage ten days later, including the exact regular expression that caused it. You will read it in Part 2.</li>
</ul>
<p>The lesson for you: professionals do not "just know". They follow a loop and write it down so that the next person — or they themselves in three months — can learn from it.</p>

<h3>What you need before starting</h3>
<ul>
<li>Read basic Java and JavaScript (variables, functions, classes, arrays/objects). Python is used only for reading tracebacks — no Python course needed.</li>
<li>A terminal: <code>cd</code>, <code>ls</code>, run a program. Git: commit, branch, log. HTTP/REST and SQL at an introductory level.</li>
<li>Very new to programming? Do Web Foundations lesson 10.2 first (link below); this course assumes you have seen an error message and a breakpoint once.</li>
</ul>

<h3>After this course you can…</h3>
<ul>
<li>Apply reproduce → isolate → hypothesise → test to any bug and keep a short debugging log.</li>
<li>Read Java, JavaScript/TypeScript and Python stack traces and find your line in under a minute.</li>
<li>Use conditional breakpoints, logpoints, watches and attach to running processes in VS Code and IntelliJ, including remote JVM debugging — safely.</li>
<li>Debug the browser, HTTP, SQL, race conditions, time-zone and cache bugs; recognise memory leaks; find a breaking commit with <code>git bisect run</code>.</li>
<li>Debug production without causing a second incident, and write bug reports and mini postmortems people can act on.</li>
<li>Answer the interview question "tell me about the hardest bug you fixed" with a real story and a real log — the capstone (Chapter 12) gives you ten.</li>
</ul>

<h3>Courses to take alongside</h3>
<p>This course never re-teaches what other courses own. When a lesson needs it, it links to: Web Foundations 10.2 (first contact with errors), Log from A to Z (reading logs) and Observability &amp; Monitoring (from an alert to a cause in a live system).</p>

<h3>🧪 Practice (10 min) — your first debug, guaranteed to succeed</h3>
<div class="callout ok">
<ol>
<li>Create a folder <code>~/dbg-lab/muc0</code> and a file <code>tong-tien.js</code> with the code below (type it, do not paste — your fingers learn too).</li>
<li>Run it. <strong>Before changing anything</strong>, write one sentence: what did you expect, what did you see?</li>
<li>Hypothesis: "the prices are strings, so <code>+</code> joins text instead of adding". Test it <em>without fixing</em>: run <code>node -e "console.log(0 + '120000', typeof (0 + '120000'))"</code>.</li>
<li>Only now fix the cause: <code>tong = tong + Number(g)</code>. Run again.</li>
</ol>
<pre><code class="language-js">// Cart: prices come from a form input, so they are STRINGS
const gia = ['120000', '45000', '30000'];
let tong = 0;
for (const g of gia) tong = tong + g;
console.log('Tổng tiền:', tong);</code></pre>
<div class="out">$ node tong-tien.js
Tổng tiền: 01200004500030000
$ node -e "console.log(0 + '120000', typeof (0 + '120000'))"
0120000 string</div>
<p><strong>Done when:</strong> the program prints <code>195000</code>, and you have three written lines: expected/actual, the hypothesis, and the one command that confirmed it before you fixed anything.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">bug</span><span class="v">Any difference between what the program does and what it should do.</span></div>
  <div class="kv"><span class="k">root cause</span><span class="v">The underlying reason, not the place where the symptom shows.</span></div>
  <div class="kv"><span class="k">reproduce</span><span class="v">Make the bug happen again on demand.</span></div>
  <div class="kv"><span class="k">hypothesis</span><span class="v">One testable guess about the cause.</span></div>
  <div class="kv"><span class="k">regression test</span><span class="v">A test that fails if this bug ever comes back.</span></div>
  <div class="kv"><span class="k">postmortem</span><span class="v">A written review after an incident: what happened, why, what we change.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A bug is any gap between actual and expected behaviour — not only red errors.</li>
<li>Debugging = find the root cause, fix it, prove the fix; a fix you cannot explain is a guess.</li>
<li>"Bug" predates computers; the 1947 Mark II moth is famous because the team wrote it down with evidence.</li>
<li>Logs, tests and monitoring supply evidence and proof; debugging is the reasoning that connects them.</li>
<li>Google, AWS and Cloudflare follow a written loop and publish postmortems — the same loop this course teaches.</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Chào bạn. Phần lớn công việc đầu tiên của bạn là làm cho thứ đang hỏng chạy lại — ta học làm việc đó có chủ đích</h2>
<p class="lead">Chào mừng bạn. Nếu bạn từng nhìn một dòng lỗi đỏ suốt một tiếng, rắc <code>console.log</code> lên từng dòng, sửa ba chỗ một lúc rồi không biết chỗ nào làm nó chạy — khoá này dành cho bạn. Không ai sinh ra đã giỏi gỡ lỗi (debug). Người có kinh nghiệm không phải là người ít lỗi hơn; họ là người có <strong>phương pháp</strong>: tái hiện lỗi, khoanh vùng nơi nó sống, đặt một giả thuyết, kiểm nó, sửa đúng nguyên nhân, rồi thêm một test để lỗi không quay lại. Khoá này dạy phương pháp đó trước, rồi tới công cụ (VS Code, IntelliJ, DevTools của trình duyệt, curl, SQL, git bisect) giúp mỗi bước nhanh hơn.</p>

<h3>Liên tưởng đời thường: một bác sĩ giỏi</h3>
<p>Bác sĩ kém nghe "tôi đau đầu" là kê kháng sinh ngay. Bác sĩ giỏi hỏi: từ bao giờ? Sáng nào cũng đau hay chỉ sau khi nhìn màn hình? Có sốt không? Rồi cho làm MỘT xét nghiệm chia đôi khả năng, đọc kết quả, rồi mới kê đơn. Gỡ lỗi là đúng công việc đó, làm trên code. <strong>Triệu chứng</strong> (người dùng thấy gì) → <strong>khám</strong> (tái hiện, nhìn giá trị thật) → <strong>chẩn đoán</strong> (nguyên nhân gốc) → <strong>chữa</strong> (bản sửa) → <strong>tái khám</strong> (một test bắt được nếu bệnh tái phát). Viết <code>|| 0</code> cho mất chữ <code>NaN</code> chính là kê kháng sinh khi chưa chẩn đoán — Phần 2 cho bạn thấy nó hỏng thế nào.</p>

<h3>Bug là gì, gỡ lỗi là gì</h3>
<ul>
<li><strong>Bug (lỗi)</strong> là bất kỳ chỗ nào chương trình làm khác với điều nó phải làm. Không phải lúc nào cũng có dòng lỗi đỏ: tổng tiền sai 10%, nút bấm không phản ứng, trang chỉ chậm vào thứ Hai — đều là bug.</li>
<li><strong>Debugging (gỡ lỗi)</strong> là tìm ra <em>root cause (nguyên nhân gốc)</em> của sự khác biệt đó, sửa nó, và chứng minh bản sửa đúng. "Chứng minh" là chỗ quan trọng: bản sửa mà bạn không giải thích được chỉ là một lần đoán tình cờ trúng hôm nay.</li>
</ul>

<h3>Chữ "bug" từ đâu ra</h3>
<p>Kỹ sư đã gọi lỗi phần cứng là "bug" (con bọ) từ lâu trước khi có máy tính — Bảo tàng Lịch sử Máy tính (Computer History Museum) lần chữ này về Thomas Edison từ thế kỷ 19. Khoảnh khắc nổi tiếng là ngày <strong>9/9/1947</strong>: nhóm vận hành máy tính <strong>Harvard Mark II</strong> tìm thấy một con bướm đêm kẹt giữa hai tiếp điểm của rơ-le, dán nó vào sổ nhật ký của máy và ghi: <em>"First actual case of bug being found"</em> (lần đầu tìm thấy một con bọ thật sự). Grace Hopper, một lập trình viên trong nhóm, làm câu chuyện nổi tiếng qua rất nhiều bài nói chuyện của bà. Để ý chữ <em>actual</em> (thật sự): câu đùa chỉ buồn cười vì "bug" vốn đã có nghĩa là "lỗi". Và để ý điều nhóm đã làm — họ <strong>ghi lại</strong> vào sổ, kèm cả bằng chứng. 79 năm sau, đó vẫn là thói quen khoá này sẽ rèn cho bạn.</p>

<h3>Một ngày thật của intern</h3>
<table>
<thead><tr><th>Giờ</th><th>Chuyện thật sự xảy ra</th><th>Kỹ năng trong khoá</th></tr></thead>
<tbody>
<tr><td>09:00</td><td>Tester báo "Trang đặt lịch thỉnh thoảng trả 500"</td><td>Tái hiện chắc chắn (1.2)</td></tr>
<tr><td>10:00</td><td>Spring Boot không khởi động sau khi bạn merge <code>main</code></td><td>Đọc chuỗi "Caused by" (2.2)</td></tr>
<tr><td>13:30</td><td>API gọi bằng Postman chạy, gọi từ trang React thì không</td><td>Khoanh vùng theo tầng (1.3), gỡ lỗi HTTP (Ch6)</td></tr>
<tr><td>15:00</td><td>Báo cáo tháng hiện doanh thu gấp đôi</td><td>Nhìn SQL thật, JOIN nhân dòng (Ch7)</td></tr>
<tr><td>17:00</td><td>Trưởng nhóm hỏi: "nguyên nhân gốc là gì, và sao biết nó không quay lại?"</td><td>Nhật ký gỡ lỗi + test chặn tái phát (Ch1, Ch11)</td></tr>
</tbody>
</table>
<p>Viết tính năng mới là phần người ta hay kể. Hiểu vì sao code đang có lại chạy sai mới là phần lấp đầy cả ngày — và là thứ người hướng dẫn (mentor) đánh giá bạn đầu tiên.</p>

<h3>Gỡ lỗi không phải log, test hay monitoring — nhưng dùng cả ba</h3>
<table>
<thead><tr><th></th><th>Trả lời câu hỏi</th><th>Khi nào</th><th>Học ở đâu</th></tr></thead>
<tbody>
<tr><td><strong>Logging (ghi log)</strong></td><td>Chuyện gì đã xảy ra, theo thứ tự nào?</td><td>Viết trước khi có lỗi, đọc sau khi có lỗi</td><td>log-tu-a-den-z</td></tr>
<tr><td><strong>Testing (kiểm thử)</strong></td><td>Code còn làm đúng điều đã hứa không?</td><td>Trước khi merge, trong CI</td><td>Các khoá kiểm thử</td></tr>
<tr><td><strong>Monitoring (giám sát)</strong></td><td>Hệ thống có khoẻ ngay lúc này không? Hỏng từ khi nào?</td><td>Liên tục trên production</td><td>observability-monitoring</td></tr>
<tr><td><strong>Debugging (gỡ lỗi)</strong></td><td><strong>Vì sao</strong> nó chạy như vậy, và bản sửa nhỏ nhất mà đúng là gì?</td><td>Khi một trong ba thứ trên báo "có gì đó sai"</td><td>Khoá này</td></tr>
</tbody>
</table>
<p>Log và monitoring cho bạn <em>bằng chứng</em>; test cho bạn cách <em>chứng minh</em> bản sửa và chặn tái phát; gỡ lỗi là phần suy luận nối chúng lại.</p>

<h3>Công ty lớn làm thế nào — cùng một vòng lặp, và họ ghi lại</h3>
<ul>
<li><strong>Google</strong> công bố cách họ xử lý sự cố trong sách SRE, chương 12 "Effective Troubleshooting": báo lỗi → phân loại mức độ (triage) → quan sát (examine) → chẩn đoán (diagnose) → kiểm và chữa (test and treat), kèm lời cảnh báo "correlation is not causation" (tương quan không phải nhân quả). Chương 15 mô tả <strong>blameless postmortem (bản tổng kết không đổ lỗi)</strong>: viết sau sự cố, "giả định mọi người liên quan đều có ý tốt" và đi tìm nguyên nhân ở hệ thống; phải viết khi có ảnh hưởng tới người dùng, mất dữ liệu, phải rollback, hoặc xử lý quá lâu.</li>
<li><strong>AWS</strong> cam kết công bố một <strong>Post-Event Summary</strong> công khai sau các sự cố vượt ngưỡng ảnh hưởng — bản mới nhất trong danh sách là sự cố DynamoDB ở vùng us-east-1 ngày 19/10/2025.</li>
<li><strong>Cloudflare</strong> công bố bài phân tích chi tiết sự cố ngày 2/7/2019 chỉ mười ngày sau, kèm đúng biểu thức chính quy đã gây ra nó. Bạn sẽ đọc nó ở Phần 2.</li>
</ul>
<p>Bài học cho bạn: dân chuyên nghiệp không "tự nhiên biết". Họ đi theo một vòng lặp và ghi lại, để người sau — hoặc chính họ ba tháng sau — học được từ đó.</p>

<h3>Cần nền gì trước khi học</h3>
<ul>
<li>Đọc được Java và JavaScript cơ bản (biến, hàm, lớp, mảng/đối tượng). Python chỉ dùng để đọc traceback — không cần học khoá Python.</li>
<li>Dùng terminal: <code>cd</code>, <code>ls</code>, chạy một chương trình. Git: commit, branch, log. HTTP/REST và SQL mức nhập môn.</li>
<li>Mới tinh với lập trình? Học bài 10.2 của khoá Nền tảng Web trước (link bên dưới); khoá này giả định bạn đã gặp một thông báo lỗi và một breakpoint ít nhất một lần.</li>
</ul>

<h3>Học xong bạn làm được gì</h3>
<ul>
<li>Áp vòng tái hiện → khoanh vùng → giả thuyết → kiểm cho mọi lỗi, kèm một nhật ký gỡ lỗi ngắn.</li>
<li>Đọc stack trace Java, JavaScript/TypeScript và Python, tìm ra dòng của mình trong dưới một phút.</li>
<li>Dùng breakpoint điều kiện, logpoint, watch, gắn (attach) vào tiến trình đang chạy trong VS Code và IntelliJ, kể cả debug JVM từ xa — một cách an toàn.</li>
<li>Gỡ lỗi giao diện, HTTP, SQL, race condition, múi giờ, cache; nhận biết rò rỉ bộ nhớ; tìm commit gây lỗi bằng <code>git bisect run</code>.</li>
<li>Gỡ lỗi trên production mà không gây thêm sự cố thứ hai; viết bug report và postmortem nhỏ mà người khác làm theo được.</li>
<li>Trả lời câu phỏng vấn "kể về lỗi khó nhất bạn từng sửa" bằng chuyện thật, nhật ký thật — dự án cuối khoá (Chương 12) cho bạn mười chuyện như thế.</li>
</ul>

<h3>Học kèm khoá nào</h3>
<p>Khoá này không dạy lại thứ khoá khác đã dạy. Bài nào cần thì dẫn link sang: Nền tảng Web 10.2 (lần đầu gặp lỗi), Log từ A đến Z (đọc log) và Observability &amp; Monitoring (từ cảnh báo tới nguyên nhân trên hệ thống đang chạy).</p>

<h3>🧪 Thực hành (10 phút) — lần gỡ lỗi đầu tiên, chắc chắn thành công</h3>
<div class="callout ok">
<ol>
<li>Tạo thư mục <code>~/dbg-lab/muc0</code> và tệp <code>tong-tien.js</code> với đoạn code dưới (tự gõ, đừng dán — ngón tay cũng cần học).</li>
<li>Chạy nó. <strong>Trước khi sửa gì</strong>, viết một câu: bạn mong thấy gì, bạn thấy gì?</li>
<li>Giả thuyết: "giá là chuỗi, nên <code>+</code> nối chữ chứ không cộng số". Kiểm nó <em>mà chưa sửa</em>: chạy <code>node -e "console.log(0 + '120000', typeof (0 + '120000'))"</code>.</li>
<li>Bây giờ mới sửa đúng gốc: <code>tong = tong + Number(g)</code>. Chạy lại.</li>
</ol>
<pre><code class="language-js">// Giỏ hàng: giá lấy từ ô nhập trên form nên là CHUỖI
const gia = ['120000', '45000', '30000'];
let tong = 0;
for (const g of gia) tong = tong + g;
console.log('Tổng tiền:', tong);</code></pre>
<div class="out">$ node tong-tien.js
Tổng tiền: 01200004500030000
$ node -e "console.log(0 + '120000', typeof (0 + '120000'))"
0120000 string</div>
<p><strong>Đạt khi:</strong> chương trình in <code>195000</code>, và bạn có ba dòng viết tay: mong đợi/thực tế, giả thuyết, và đúng một lệnh đã xác nhận giả thuyết TRƯỚC khi bạn sửa.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">bug (lỗi)</span><span class="v">Bất kỳ chỗ nào chương trình làm khác điều nó phải làm.</span></div>
  <div class="kv"><span class="k">root cause (nguyên nhân gốc)</span><span class="v">Lý do thật bên dưới, không phải chỗ triệu chứng lộ ra.</span></div>
  <div class="kv"><span class="k">reproduce (tái hiện)</span><span class="v">Làm lỗi xảy ra lại khi mình muốn.</span></div>
  <div class="kv"><span class="k">hypothesis (giả thuyết)</span><span class="v">Một phỏng đoán về nguyên nhân mà kiểm được.</span></div>
  <div class="kv"><span class="k">regression test (test chặn tái phát)</span><span class="v">Test sẽ đỏ nếu lỗi này quay lại.</span></div>
  <div class="kv"><span class="k">postmortem (bản tổng kết sau sự cố)</span><span class="v">Bài viết sau sự cố: chuyện gì, vì sao, ta đổi gì.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bug là mọi khoảng cách giữa hành vi thật và hành vi mong đợi — không chỉ dòng lỗi đỏ.</li>
<li>Gỡ lỗi = tìm nguyên nhân gốc, sửa, chứng minh; bản sửa không giải thích được chỉ là đoán.</li>
<li>Chữ "bug" có trước máy tính; con bướm đêm của Mark II năm 1947 nổi tiếng vì nhóm đã ghi lại kèm bằng chứng.</li>
<li>Log, test, monitoring cho bằng chứng và cách chứng minh; gỡ lỗi là phần suy luận nối chúng.</li>
<li>Google, AWS, Cloudflare đi theo vòng lặp có ghi chép và công bố postmortem — đúng vòng lặp khoá này dạy.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
