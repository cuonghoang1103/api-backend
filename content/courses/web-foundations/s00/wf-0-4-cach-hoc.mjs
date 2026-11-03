/**
 * Bài 0.4 — Cách học khoá này (nâng cấp 02/11/2026). Output thật: _demo/0-4 (Chromium — đọc lỗi + stack, in giá trị,
 * thu nhỏ lỗi, đoán-chạy-so, lịch ôn giãn cách). Deck: scripts/slides-src/wf-0-4.mjs (10 slide, WF/v1/wf-0-4). Giữ video YouTube cũ.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-0-4', 'How to study this course', 'Cách học khoá này', [
  [1, 'How to study this course',
    '<p>Talent is overrated; method is what separates people who finish from people who quit. This lesson gives you seven habits and shows them on real code, so you can start using them today — even before you know much JavaScript.</p>',
    '<p>Năng khiếu được đánh giá quá cao; phương pháp mới là thứ phân biệt người học xong với người bỏ cuộc. Bài này đưa ra bảy thói quen và minh hoạ chúng trên mã thật, để bạn dùng được ngay hôm nay — kể cả khi chưa biết nhiều JavaScript.</p>'],
  [2, 'After this lesson you can…',
    '<p>The goal is not motivation; it is a routine that works on the days you are tired. Each outcome here is a small, concrete action: predict before running, read the error from the top, print the value you are sure about, shrink the problem, ask a good question, review on a schedule.</p>',
    '<p>Mục tiêu không phải là động lực; mà là một nề nếp vẫn chạy được vào những ngày bạn mệt. Mỗi kết quả ở đây là một hành động nhỏ, cụ thể: đoán trước khi chạy, đọc lỗi từ trên xuống, in giá trị bạn đang chắc chắn, thu nhỏ vấn đề, đặt câu hỏi tốt, ôn theo lịch.</p>'],
  [3, 'Predict, run, compare',
    '<p>Before you press run, say what will happen. Five real lines from Chromium: most beginners miss at least two of them. A wrong prediction is the most useful thing that can happen to you, because the surprise shows exactly where your mental model is wrong.</p>',
    '<p>Trước khi bấm chạy, hãy nói điều gì sẽ xảy ra. Năm dòng thật từ Chromium: đa số người mới đoán sai ít nhất hai dòng. Đoán sai là điều hữu ích nhất có thể xảy ra, vì sự bất ngờ chỉ đúng chỗ hình dung của bạn đang sai.</p>'],
  [4, 'An error is a direction',
    '<p>Read it in order: the type of error, the message, then the stack from the top. Here the message says it tried to read <code>city</code> from <code>null</code>, and the first stack line says file, line 3, column 23. That is the answer, written down for free.</p>',
    '<p>Đọc theo thứ tự: loại lỗi, thông điệp, rồi ngăn xếp từ trên xuống. Ở đây thông điệp nói nó cố đọc <code>city</code> từ <code>null</code>, và dòng ngăn xếp đầu tiên nói tệp, dòng 3, cột 23. Đó là đáp án, được viết sẵn miễn phí.</p>'],
  [5, 'Print what you are sure about',
    '<p>The total should be 250 but it printed a long string of digits. Instead of guessing, print the thing you are certain about: the type of each price. It says string, not number. The bug was never in the loop; it was an assumption you had not checked.</p>',
    '<p>Tổng phải là 250 mà nó in ra một chuỗi số dài. Thay vì đoán, hãy in cái bạn đang chắc chắn: kiểu của từng giá. Nó nói string, không phải number. Lỗi chưa bao giờ nằm ở vòng lặp; nó là một giả định bạn chưa kiểm.</p>'],
  [6, 'Shrink it until it is tiny',
    '<p>A leaderboard prints the wrong top three. Delete everything that does not matter and one line still shows the bug: <code>sort()</code> compares numbers as text. A small reproduction often reveals the answer, and if it does not, it is exactly what you paste into a question.</p>',
    '<p>Một bảng xếp hạng in sai ba người đầu. Xoá hết những gì không liên quan, một dòng vẫn còn lỗi: <code>sort()</code> so sánh số như chữ. Một bản tái hiện nhỏ thường tự lộ đáp án, và nếu chưa, nó chính là thứ bạn dán vào câu hỏi.</p>'],
  [7, 'Stuck? Follow this order',
    '<p>Read the error, check one assumption, shrink it, search with the exact message, and only then ask. Give yourself twenty minutes on each problem. Ask too early and you learn nothing; wait three days and you learn to hate it.</p>',
    '<p>Đọc lỗi, kiểm một giả định, thu nhỏ, tìm với đúng thông điệp, rồi mới hỏi. Cho mỗi vấn đề hai mươi phút. Hỏi quá sớm thì chẳng học được gì; chờ ba ngày thì chỉ học được cách ghét nó.</p>'],
  [8, 'Ask a good question',
    '<p>A good question has four parts: what you expected, what happened, what you tried, and a small piece of code that shows it. The same four parts work for a friend, a forum or an AI. Ask the AI to explain the cause first, then type the fix yourself.</p>',
    '<p>Một câu hỏi tốt có bốn phần: bạn mong gì, điều gì đã xảy ra, bạn đã thử gì, và một đoạn mã nhỏ cho thấy lỗi. Bốn phần này dùng được cho bạn bè, diễn đàn hay AI. Hãy bảo AI giải thích nguyên nhân trước, rồi tự gõ cách sửa.</p>'],
  [9, 'Remember it: recall and spacing',
    '<p>Re-reading feels good and fades fast. Recalling from an empty page is harder and lasts. This small script prints a review schedule — 1, 3, 7, 14 and 30 days — for today’s lesson. Each review is five minutes of "what do I remember?", not a full re-read.</p>',
    '<p>Đọc lại thì dễ chịu và quên nhanh. Nhớ lại từ trang trắng thì khó hơn và bền hơn. Script nhỏ này in lịch ôn — sau 1, 3, 7, 14 và 30 ngày — cho bài hôm nay. Mỗi lần ôn là năm phút tự hỏi "mình còn nhớ gì?", không phải đọc lại cả bài.</p>'],
  [10, 'Summary & practice',
    '<p>The practice uses all the habits on the broken leaderboard. Your deliverable is a question written in the four-part form plus review dates in your calendar — things you can check, so you know the habits have started rather than just been read about.</p>',
    '<p>Bài luyện dùng mọi thói quen trên cái bảng xếp hạng bị lỗi. Sản phẩm là một câu hỏi viết theo bốn phần cộng các ngày ôn trong lịch — những thứ kiểm được, để bạn biết các thói quen đã bắt đầu chứ không chỉ mới được đọc.</p>'],
]);

export default {
  title: '0.4 — How to study this course (and not give up)|||0.4 — Cách học khoá này (và không bỏ cuộc)',
  slug: 'wf-0-4-cach-hoc',
  type: 'VIDEO',
  // "Harvard CS50 – Full Computer Science University Course" — freeCodeCamp/CS50.
  video: { url: 'https://youtu.be/8mAITcNt710', durationSeconds: 0 },
  description: 'Bảy thói quen áp dụng trên mã thật: đoán-chạy-so, đọc lỗi và stack trace, in giá trị để kiểm giả định, thu nhỏ lỗi, đặt câu hỏi bốn phần (kể cả với AI), nhớ lại + ôn giãn cách (lịch 1-3-7-14-30 ngày). Thứ tự khi bị kẹt, quy tắc 20 phút, các bẫy tutorial và AI.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>The habits that separate people who finish from people who quit</h2>
<p class="lead">After this lesson you can use a daily study loop, read a red error message from top to bottom and find the exact line it points to, check an assumption with one <code>console.log</code>, shrink a broken program until the bug is obvious, ask a question that actually gets answered, and plan reviews so that what you learn this week is still there next month. You need these because talent is overrated and method is everything: everyone gets stuck in programming, every day, for their whole career. The difference is what you do in the next ten minutes.</p>

<h3>The loop for every lesson</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Skim the slides</span><span class="lz-d">Five minutes to see the shape of the lesson.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Read and type</span><span class="lz-d">Type every example yourself. Predict the output before you run it.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Break it on purpose</span><span class="lz-d">Change one thing, predict, run, compare. This is where understanding forms.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Do the practice</span><span class="lz-d">Stop only when "Done when" is true, then Code Lab.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Recall from memory</span><span class="lz-d">Close the page. Write what you remember. Schedule a review.</span></div>
</div>

<h3>Habit 1 — predict, run, compare</h3>
<p>Do not run code to see what it does. First <em>say</em> what it will do, ideally in writing, then run it. Try it now with these five lines; cover the output and guess each one:</p>
${ma('javascript', CODE['0-4/du-doan.js'])}
${ra(OUT['0-4/du-doan'])}
<p>Most beginners miss at least two. That is the point: <code>'5' + 1</code> joins text; <code>'5' - 1</code> does arithmetic; <code>0.1 + 0.2</code> is not exactly 0.3 in almost every programming language; and <code>typeof null</code> being "object" is a famous old bug in JavaScript. A wrong prediction is the most useful thing that can happen, because the surprise points exactly at the gap in your mental model. Running code without predicting gives you the answer and teaches you nothing.</p>

<h3>Habit 2 — an error is a direction, not a failure</h3>
<p>Beginners see red and panic. Professionals read it. Here is a real error, as Chromium reports it:</p>
${ma('javascript', CODE['0-4/doc-loi.js'])}
${ra(OUT['0-4/doc-loi'])}
<p>Line 3 ran; line 4 threw; line 5 never ran. JavaScript stops at the first uncaught error, so <strong>everything after it is irrelevant</strong> until it is fixed. The error also tells you where it happened, in the <em>stack trace</em> printed under the red line:</p>
${ma('javascript', CODE['0-4/doc-loi-stack.js'])}
${ra(OUT['0-4/doc-loi-stack'])}
<div class="kv-grid">
  <div class="kv"><span class="k">TypeError</span><span class="v">The <strong>kind</strong> of error: you used a value in a way its type does not allow.</span></div>
  <div class="kv"><span class="k">Cannot read properties of null (reading 'city')</span><span class="v">The <strong>message</strong>: something was <code>null</code> and you asked it for <code>city</code>. So look at whatever comes <em>before</em> <code>.city</code>: <code>user.profile</code>.</span></div>
  <div class="kv"><span class="k">at showCity (…js:3:23)</span><span class="v">The <strong>top of the stack</strong>: the function, the file, line 3, column 23. Start here.</span></div>
  <div class="kv"><span class="k">at renderPage (…js:7:10)</span><span class="v">Who called it. Read downward to see how the program got there — often the real mistake is in the caller.</span></div>
</div>
<p>In DevTools, the file name on the right of the error is a link: click it and the Sources tab opens on that exact line. Lesson 10.2 goes deeper; for now, the rule is: <strong>read the first line, go to the location it names</strong>.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — fixing the last error instead of the first.</strong> One mistake often produces a cascade of red. Beginners scroll to the bottom and start there. Errors are written in order, so the first one is usually the cause and the others are consequences. Fix the first, run again, and many of the rest disappear on their own.</p></div>

<h3>Habit 3 — print what you are sure about</h3>
<p>Most bugs are not in the line you are staring at; they are in an assumption you never checked. "The total is wrong." Look at this:</p>
${ma('javascript', CODE['0-4/in-gia-tri.js'])}
${ra(OUT['0-4/in-gia-tri'])}
<p>We expected 250 and got 01208050. Staring at the loop would not reveal anything; the loop is fine. One print — <code>typeof prices[0]</code> — shows the assumption was wrong: the values are <strong>strings</strong>, so <code>+</code> joined them instead of adding. Values from a form input always arrive as strings, as Chapter 4 will show. Fix: <code>Number(p)</code>.</p>
<p>When you are sure about something, print it anyway: <code>console.log('here', value)</code>. When a page looks wrong, open DevTools → Elements. When a request fails, open DevTools → Network. <strong>You debug by looking, not by guessing.</strong></p>

<h3>Habit 4 — shrink it until it is tiny</h3>
<p>A bug hiding in 500 lines is hard. The same bug in 3 lines is usually obvious. Here is a leaderboard with a wrong result:</p>
${ma('javascript', CODE['0-4/thu-nho-truoc.js'])}
${ra(OUT['0-4/thu-nho-truoc'])}
<p>Now delete everything that is unrelated: the players, the names, the function, the reverse. Keep deleting while the wrong behaviour stays. What is left:</p>
${ma('javascript', CODE['0-4/thu-nho-sau.js'])}
${ra(OUT['0-4/thu-nho-sau'])}
<p>One line, and the surprise is plain: <code>[9, 100, 25, 8].sort()</code> gives <code>[100, 25, 8, 9]</code>. By default <code>sort()</code> compares values as <em>text</em>, and "100" comes before "25". That small version is called a <strong>minimal reproduction</strong>. Either making it shows you the cause — as here — or it is the perfect thing to paste into a question. If the bug disappears as you delete something, the last thing you deleted was involved.</p>

<h3>When you are stuck, in this order</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Read the actual error</span><span class="lz-d">All of it, with the file and line. The error is usually the answer, written down.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Check one assumption with a print</span><span class="lz-d">You believe a variable holds something. Print it. Half of all bugs die here.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Shrink it</span><span class="lz-d">Delete until the bug disappears or fits in ten lines.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Search with the exact message</span><span class="lz-d">Paste the message without your own file names. "my code does not work" finds nothing; the exact text finds the person who hit it years ago.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Ask, with the four parts below</span><span class="lz-d">After about 20 minutes of honest effort.</span></div>
</div>
<p>The <strong>20-minute rule</strong>: struggle for around twenty minutes, because the struggle is where you learn. Then ask, because being stuck for three days teaches nothing except that you hate this.</p>

<h3>Habit 5 — ask a question that gets answered</h3>
<table>
<thead><tr><th>Bad</th><th>Good</th></tr></thead>
<tbody>
<tr><td>"sort is broken, help"</td><td>
<strong>Expected:</strong> <code>[8, 9, 25, 100]</code><br>
<strong>Actual:</strong> <code>[100, 25, 8, 9]</code><br>
<strong>Tried:</strong> printed the array before sorting (it is correct); read the MDN page for <code>sort</code>.<br>
<strong>Code:</strong> <code>console.log([9, 100, 25, 8].sort());</code> in Chrome.
</td></tr>
</tbody>
</table>
<p>Expected, actual, tried, code. These four parts work for a friend, a forum, and an AI assistant, and writing them down often makes you solve the problem before you press Send. For exact error text, copy it instead of retyping or taking a photo of the screen.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — asking an AI for the answer before you have a question.</strong> Pasting a whole file with "fix this" usually gets working code back, and that is the problem: you now have a solution you cannot maintain, in a program you understand slightly less than before. It also fails silently when the model guesses, and beginners cannot yet tell a correct answer from a confident wrong one. Use it like a patient senior: give the four parts, ask it to <em>explain the cause</em> before it writes a fix, then type the fix yourself and predict what it will do.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — tutorial hell.</strong> You finish one course and feel unsure, so you start another, on the same topic. Each one feels productive and none makes you able to build anything. If you have watched three tutorials on a subject, the next step is not a fourth — it is a small thing you build alone, however ugly. Every chapter's practice here exists to break this loop.</p></div>

<h3>Habit 6 — remember it: recall and spacing</h3>
<p>Two findings from learning research explain most of what works. <strong>Active recall</strong>: pulling an idea out of your memory strengthens it far more than reading it again. <strong>Spacing</strong>: reviewing across several days beats the same time in one sitting. Re-reading feels easy, which is exactly why it does little.</p>
<p>This tiny script prints a review schedule for a lesson learned on 2 November:</p>
${ma('javascript', CODE['0-4/lich-on.js'])}
${ra(OUT['0-4/lich-on'])}
<p>A review is five minutes: open a blank note, write everything you remember about the lesson, then compare. Where the gaps are, re-read just that part. Keep a short personal notebook with your own words and your own mistakes; a line like "<code>sort()</code> sorts as text unless I pass a compare function" written after you hit the bug stays with you for years.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — seven hours on Sunday.</strong> Long weekend sessions feel heroic, and they end with skipped weeks. Your brain consolidates skills <em>between</em> sessions, during sleep. One focused hour a day beats a ten-hour weekend, and a thirty-minute session on a bad day keeps the chain alive. Tie it to a fixed time and place, and stop while you still know what comes next: starting tomorrow will be easy.</p></div>

<h3>Habit 7 — use the documentation</h3>
<p>Nobody memorises all of this. Real developers look things up all day. Your first stop for anything about the web is <strong>MDN</strong> (MDN Web Docs): searching "MDN array sort" is what professionals do. An MDN page always has the same shape: a short description, an interactive example, the syntax, then the details. Read the first paragraph and the examples; you do not need to read it all. For each tool, the official documentation is the second stop, because it matches the version you run.</p>

<div class="callout ok">
<p><strong>🧪 Practice (25 minutes) — use all the habits on one bug</strong></p>
<ol>
<li>Create <code>top.js</code> with the leaderboard program from Habit 4. Before running it, write down what you <em>expect</em> it to print.</li>
<li>Run it with <code>node top.js</code> and compare. Note what surprised you.</li>
<li>Add one <code>console.log</code> that checks an assumption inside <code>topThree</code>.</li>
<li>Shrink it to the smallest program that still shows the wrong order.</li>
<li>Write a question in the four-part form: Expected, Actual, Tried, Code. Do not send it.</li>
<li>Fix the program with the compare function <code>(a, b) =&gt; b - a</code> and remove the <code>reverse()</code>.</li>
<li>Put the five review dates for this lesson into your calendar.</li>
</ol>
<p>Hint: MDN's page for <code>Array.prototype.sort</code> explains the default order in its first paragraphs.</p>
<p><strong>Done when:</strong> your fixed program prints <code>top 3 scores: [ 100, 25, 9 ]</code> and <code>winner: Binh</code> (Node prints arrays with spaces); your question fits on one screen; and the review dates are in your calendar.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">bug</span><span class="v">lỗi — chương trình làm khác điều bạn muốn.</span></div>
  <div class="kv"><span class="k">debug</span><span class="v">gỡ lỗi — tìm và sửa nguyên nhân.</span></div>
  <div class="kv"><span class="k">error message</span><span class="v">thông báo lỗi — loại lỗi và mô tả.</span></div>
  <div class="kv"><span class="k">stack trace</span><span class="v">vết ngăn xếp — chuỗi lời gọi dẫn tới lỗi, kèm tệp:dòng:cột.</span></div>
  <div class="kv"><span class="k">assumption</span><span class="v">giả định — điều bạn tin là đúng nhưng chưa kiểm.</span></div>
  <div class="kv"><span class="k">minimal reproduction</span><span class="v">bản tái hiện tối thiểu — chương trình nhỏ nhất còn lỗi.</span></div>
  <div class="kv"><span class="k">active recall</span><span class="v">chủ động nhớ lại — tự viết ra từ trí nhớ.</span></div>
  <div class="kv"><span class="k">spaced repetition</span><span class="v">lặp lại giãn cách — ôn sau những khoảng tăng dần.</span></div>
  <div class="kv"><span class="k">tutorial hell</span><span class="v">"địa ngục hướng dẫn" — học mãi mà không tự làm được.</span></div>
  <div class="kv"><span class="k">documentation</span><span class="v">tài liệu chính thức (docs) — MDN cho web.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Loop: skim → type → break it → practice → recall.</li>
  <li>Predict before you run; a wrong guess is the most useful result.</li>
  <li>Read errors from the first line, and go to the location in the top of the stack.</li>
  <li>Print the value you are sure about — bugs hide in unchecked assumptions.</li>
  <li>Shrink the bug; the small version gives the answer or makes the perfect question.</li>
  <li>Stuck order: error → print → shrink → search → ask, after about 20 minutes.</li>
  <li>A good question has four parts: expected, actual, tried, code. With AI: ask for the cause, then type the fix.</li>
  <li>Recall from memory and review on a 1-3-7-14-30 day schedule; little and often.</li>
</ul>
${nguon('📗', 'MDN Web Docs', 'The reference to bookmark first', 'https://developer.mozilla.org/en-US/')}
${nguon('📘', 'javascript.info', 'JavaScript from basics to deep, with tasks after every chapter', 'https://javascript.info/')}
${nguon('📙', 'Stack Overflow — How do I ask a good question?', 'The classic guide; the four-part form comes from the same idea', 'https://stackoverflow.com/help/how-to-ask')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-0-2-cach-hoc', title: 'Node.js 0.2 — the study loop for the backend course', sub: 'The same habits, applied to servers and databases', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Những thói quen phân biệt người học xong với người bỏ cuộc</h2>
<p class="lead">Học xong bài này bạn dùng được một vòng học mỗi ngày, đọc được thông báo lỗi đỏ từ trên xuống và tìm ra đúng dòng nó chỉ, kiểm một giả định bằng một <code>console.log</code>, thu nhỏ chương trình hỏng tới khi lỗi lộ rõ, đặt được câu hỏi thật sự có người trả lời, và lên lịch ôn để thứ học tuần này tháng sau vẫn còn. Bạn cần những điều này vì năng khiếu được đánh giá quá cao còn phương pháp mới là tất cả: trong lập trình ai cũng bị kẹt, mỗi ngày, suốt cả sự nghiệp. Khác biệt nằm ở việc bạn làm gì trong mười phút tiếp theo.</p>

<h3>Vòng lặp cho mỗi bài</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Lướt slide</span><span class="lz-d">Năm phút để thấy hình hài của bài.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đọc và gõ</span><span class="lz-d">Tự gõ mọi ví dụ. Đoán output trước khi chạy.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cố tình làm hỏng</span><span class="lz-d">Đổi một thứ, đoán, chạy, so sánh. Đây là chỗ sự hiểu hình thành.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Làm bài luyện</span><span class="lz-d">Chỉ dừng khi "Xong khi" đúng, rồi sang Code Lab.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Nhớ lại</span><span class="lz-d">Đóng trang. Viết ra những gì còn nhớ. Đặt lịch ôn.</span></div>
</div>

<h3>Thói quen 1 — đoán, chạy, so sánh</h3>
<p>Đừng chạy mã để xem nó làm gì. Trước hết hãy <em>nói</em> nó sẽ làm gì, tốt nhất là viết ra, rồi mới chạy. Thử ngay với năm dòng này; che output lại và đoán từng dòng:</p>
${ma('javascript', CODE['0-4/du-doan.js'])}
${ra(OUT['0-4/du-doan'])}
<p>Đa số người mới đoán sai ít nhất hai dòng. Đó chính là mục đích: <code>'5' + 1</code> nối chữ; <code>'5' - 1</code> làm phép tính; <code>0.1 + 0.2</code> không đúng bằng 0,3 trong gần như mọi ngôn ngữ lập trình; còn <code>typeof null</code> là "object" là một lỗi cổ nổi tiếng của JavaScript. Đoán sai là điều hữu ích nhất có thể xảy ra, vì sự bất ngờ chỉ đúng vào lỗ hổng trong hình dung của bạn. Chạy mã mà không đoán thì cho bạn đáp án và chẳng dạy gì cả.</p>

<h3>Thói quen 2 — lỗi là chỉ đường, không phải thất bại</h3>
<p>Người mới thấy màu đỏ là hoảng. Người chuyên nghiệp đọc nó. Đây là một lỗi thật, như Chromium báo:</p>
${ma('javascript', CODE['0-4/doc-loi.js'])}
${ra(OUT['0-4/doc-loi'])}
<p>Dòng 3 chạy; dòng 4 ném lỗi; dòng 5 không bao giờ chạy. JavaScript dừng ở lỗi đầu tiên không được bắt, nên <strong>mọi thứ phía sau đều không liên quan</strong> cho tới khi sửa xong. Lỗi cũng cho biết nó xảy ra ở đâu, trong <em>stack trace</em> (vết ngăn xếp) in dưới dòng đỏ:</p>
${ma('javascript', CODE['0-4/doc-loi-stack.js'])}
${ra(OUT['0-4/doc-loi-stack'])}
<div class="kv-grid">
  <div class="kv"><span class="k">TypeError</span><span class="v"><strong>Loại</strong> lỗi: bạn dùng một giá trị theo cách kiểu của nó không cho phép.</span></div>
  <div class="kv"><span class="k">Cannot read properties of null (reading 'city')</span><span class="v"><strong>Thông điệp</strong>: có gì đó là <code>null</code> mà bạn đòi <code>city</code> từ nó. Vậy hãy nhìn thứ đứng <em>trước</em> <code>.city</code>: <code>user.profile</code>.</span></div>
  <div class="kv"><span class="k">at showCity (…js:3:23)</span><span class="v"><strong>Đỉnh ngăn xếp</strong>: hàm, tệp, dòng 3, cột 23. Bắt đầu từ đây.</span></div>
  <div class="kv"><span class="k">at renderPage (…js:7:10)</span><span class="v">Ai đã gọi nó. Đọc xuống để thấy chương trình đi tới đó thế nào — sai lầm thật thường nằm ở bên gọi.</span></div>
</div>
<p>Trong DevTools, tên tệp bên phải dòng lỗi là một liên kết: bấm vào là thẻ Sources mở đúng dòng đó. Bài 10.2 đi sâu hơn; giờ chỉ cần nhớ luật: <strong>đọc dòng đầu, tới đúng vị trí nó nêu</strong>.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — sửa lỗi cuối thay vì lỗi đầu.</strong> Một sai lầm thường đẻ ra cả thác lỗi đỏ. Người mới cuộn xuống cuối và bắt đầu từ đó. Lỗi được viết theo thứ tự, nên cái đầu tiên thường là nguyên nhân, còn lại là hệ quả. Sửa cái đầu, chạy lại, nhiều lỗi còn lại tự biến mất.</p></div>

<h3>Thói quen 3 — in ra thứ bạn đang chắc chắn</h3>
<p>Đa số lỗi không nằm ở dòng bạn đang nhìn chằm chằm; chúng nằm trong một giả định bạn chưa bao giờ kiểm. "Tổng tính sai." Xem này:</p>
${ma('javascript', CODE['0-4/in-gia-tri.js'])}
${ra(OUT['0-4/in-gia-tri'])}
<p>Ta mong 250 và nhận 01208050. Nhìn chằm chằm vào vòng lặp chẳng thấy gì; vòng lặp ổn. Một lần in — <code>typeof prices[0]</code> — cho thấy giả định đã sai: các giá trị là <strong>chuỗi (string)</strong>, nên <code>+</code> nối chúng thay vì cộng. Giá trị từ ô nhập liệu trên form luôn tới dưới dạng chuỗi, Chương 4 sẽ cho thấy. Cách sửa: <code>Number(p)</code>.</p>
<p>Khi chắc chắn về điều gì, cứ in nó ra: <code>console.log('tới đây', value)</code>. Khi trang trông sai, mở DevTools → Elements. Khi request hỏng, mở DevTools → Network. <strong>Bạn gỡ lỗi bằng cách nhìn, không bằng cách đoán.</strong></p>

<h3>Thói quen 4 — thu nhỏ tới khi nó tí hon</h3>
<p>Một lỗi trốn trong 500 dòng thì khó. Cùng lỗi đó trong 3 dòng thường lộ ngay. Đây là một bảng xếp hạng cho kết quả sai:</p>
${ma('javascript', CODE['0-4/thu-nho-truoc.js'])}
${ra(OUT['0-4/thu-nho-truoc'])}
<p>Giờ xoá mọi thứ không liên quan: người chơi, tên, hàm, lệnh đảo. Cứ xoá chừng nào hành vi sai vẫn còn. Thứ còn lại:</p>
${ma('javascript', CODE['0-4/thu-nho-sau.js'])}
${ra(OUT['0-4/thu-nho-sau'])}
<p>Một dòng, và sự bất ngờ lộ rõ: <code>[9, 100, 25, 8].sort()</code> cho ra <code>[100, 25, 8, 9]</code>. Mặc định <code>sort()</code> so sánh giá trị như <em>chữ</em>, và "100" đứng trước "25". Bản nhỏ đó gọi là <strong>minimal reproduction (bản tái hiện tối thiểu)</strong>. Hoặc làm nó xong là thấy nguyên nhân — như ở đây — hoặc nó là thứ hoàn hảo để dán vào câu hỏi. Nếu lỗi biến mất khi bạn xoá một thứ, thì thứ vừa xoá có liên quan.</p>

<h3>Khi bị kẹt, làm theo thứ tự này</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đọc đúng lỗi</span><span class="lz-d">Đọc hết, cả tệp và dòng. Lỗi thường chính là đáp án, được viết sẵn.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Kiểm một giả định bằng một lần in</span><span class="lz-d">Bạn tin một biến đang giữ gì đó. In nó ra. Một nửa số lỗi chết ở đây.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Thu nhỏ</span><span class="lz-d">Xoá tới khi lỗi biến mất hoặc gói trong mười dòng.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Tìm với đúng thông điệp</span><span class="lz-d">Dán thông điệp, bỏ tên tệp riêng của bạn. "code không chạy" chẳng tìm được gì; đúng chữ của lỗi sẽ tìm ra người gặp nó từ nhiều năm trước.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Hỏi, với bốn phần bên dưới</span><span class="lz-d">Sau khoảng 20 phút cố gắng thật sự.</span></div>
</div>
<p><strong>Quy tắc 20 phút</strong>: vật lộn khoảng hai mươi phút, vì sự vật lộn là chỗ bạn học. Rồi hãy hỏi, vì kẹt ba ngày chẳng dạy gì ngoài việc bạn ghét nó.</p>

<h3>Thói quen 5 — đặt câu hỏi sẽ được trả lời</h3>
<table>
<thead><tr><th>Dở</th><th>Tốt</th></tr></thead>
<tbody>
<tr><td>"sort bị hỏng, cứu"</td><td>
<strong>Mong đợi:</strong> <code>[8, 9, 25, 100]</code><br>
<strong>Thực tế:</strong> <code>[100, 25, 8, 9]</code><br>
<strong>Đã thử:</strong> in mảng trước khi sắp xếp (đúng); đọc trang MDN của <code>sort</code>.<br>
<strong>Mã:</strong> <code>console.log([9, 100, 25, 8].sort());</code> trên Chrome.
</td></tr>
</tbody>
</table>
<p>Mong đợi, thực tế, đã thử, mã. Bốn phần này dùng được cho bạn bè, diễn đàn, và trợ lý AI, và chính việc viết chúng ra thường khiến bạn tự giải được trước khi bấm Gửi. Với lỗi, hãy chép đúng chữ thay vì gõ lại hay chụp ảnh màn hình.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — xin AI đáp án trước khi có câu hỏi.</strong> Dán cả tệp kèm "sửa giúp" thường nhận lại mã chạy được, và đó mới là vấn đề: bạn có một lời giải mình không bảo trì nổi, trong một chương trình mình hiểu ít đi một chút so với trước. Nó còn hỏng thầm lặng khi mô hình đoán mò, và người mới chưa phân biệt được câu trả lời đúng với câu sai đầy tự tin. Hãy dùng nó như một đàn anh kiên nhẫn: đưa đủ bốn phần, bảo nó <em>giải thích nguyên nhân</em> trước khi viết cách sửa, rồi tự gõ cách sửa và đoán xem nó sẽ làm gì.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — địa ngục hướng dẫn (tutorial hell).</strong> Học xong một khoá vẫn thấy chưa chắc, bạn mở khoá khác, cùng chủ đề. Khoá nào cũng có vẻ hiệu quả mà không khoá nào giúp bạn tự làm được gì. Nếu đã xem ba hướng dẫn về một chủ đề, bước tiếp theo không phải cái thứ tư — mà là một thứ nhỏ bạn tự làm một mình, dù xấu đến đâu. Bài luyện của mỗi chương ở đây tồn tại để phá vòng lặp này.</p></div>

<h3>Thói quen 6 — nhớ lâu: nhớ lại và giãn cách</h3>
<p>Hai phát hiện của khoa học về học tập giải thích phần lớn những gì hiệu quả. <strong>Active recall (chủ động nhớ lại)</strong>: lôi một ý ra từ trí nhớ củng cố nó mạnh hơn nhiều so với đọc lại. <strong>Spacing (giãn cách)</strong>: ôn trải qua nhiều ngày hơn hẳn dồn cùng lượng thời gian vào một lần. Đọc lại có cảm giác dễ, và đó chính là lý do nó ít tác dụng.</p>
<p>Script tí hon này in lịch ôn cho một bài học ngày 2 tháng 11:</p>
${ma('javascript', CODE['0-4/lich-on.js'])}
${ra(OUT['0-4/lich-on'])}
<p>Một lần ôn là năm phút: mở một trang trắng, viết mọi thứ còn nhớ về bài, rồi đối chiếu. Hổng chỗ nào, đọc lại đúng chỗ đó. Giữ một sổ tay ngắn bằng lời của chính bạn và những lỗi của chính bạn; một dòng như "<code>sort()</code> sắp theo chữ trừ khi mình đưa hàm so sánh" viết ngay sau khi gặp lỗi sẽ ở lại với bạn nhiều năm.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — bảy tiếng ngày Chủ nhật.</strong> Những buổi học dài cuối tuần nghe rất oai, và kết thúc bằng những tuần bỏ trống. Não củng cố kỹ năng <em>giữa</em> các buổi, trong lúc ngủ. Một giờ tập trung mỗi ngày hơn mười giờ cuối tuần, và ba mươi phút trong một ngày tệ vẫn giữ được chuỗi. Gắn nó với một giờ và một chỗ cố định, và dừng khi vẫn biết bước tiếp theo là gì: ngày mai bắt đầu sẽ dễ.</p></div>

<h3>Thói quen 7 — dùng tài liệu</h3>
<p>Không ai thuộc hết những thứ này. Lập trình viên thật tra cứu cả ngày. Điểm dừng đầu tiên cho mọi thứ về web là <strong>MDN</strong> (MDN Web Docs): tìm "MDN array sort" là việc người chuyên nghiệp làm. Trang MDN nào cũng cùng khuôn: mô tả ngắn, ví dụ tương tác, cú pháp, rồi chi tiết. Đọc đoạn đầu và các ví dụ; không cần đọc hết. Với mỗi công cụ, tài liệu chính thức là điểm dừng thứ hai, vì nó khớp phiên bản bạn chạy.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (25 phút) — dùng mọi thói quen trên một lỗi</strong></p>
<ol>
<li>Tạo <code>top.js</code> với chương trình bảng xếp hạng ở Thói quen 4. Trước khi chạy, viết ra bạn <em>mong</em> nó in gì.</li>
<li>Chạy bằng <code>node top.js</code> và so sánh. Ghi lại điều làm bạn bất ngờ.</li>
<li>Thêm một <code>console.log</code> kiểm một giả định bên trong <code>topThree</code>.</li>
<li>Thu nhỏ thành chương trình nhỏ nhất vẫn cho thứ tự sai.</li>
<li>Viết một câu hỏi theo bốn phần: Mong đợi, Thực tế, Đã thử, Mã. Đừng gửi.</li>
<li>Sửa chương trình bằng hàm so sánh <code>(a, b) =&gt; b - a</code> và bỏ <code>reverse()</code>.</li>
<li>Đưa năm ngày ôn của bài này vào lịch.</li>
</ol>
<p>Gợi ý: trang MDN của <code>Array.prototype.sort</code> giải thích thứ tự mặc định ngay những đoạn đầu.</p>
<p><strong>Xong khi:</strong> chương trình đã sửa in <code>top 3 scores: [ 100, 25, 9 ]</code> và <code>winner: Binh</code> (Node in mảng có dấu cách); câu hỏi của bạn gói trong một màn hình; và các ngày ôn đã nằm trong lịch.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">bug</span><span class="v">lỗi — chương trình làm khác điều bạn muốn.</span></div>
  <div class="kv"><span class="k">debug</span><span class="v">gỡ lỗi — tìm và sửa nguyên nhân.</span></div>
  <div class="kv"><span class="k">error message</span><span class="v">thông báo lỗi — loại lỗi và mô tả.</span></div>
  <div class="kv"><span class="k">stack trace</span><span class="v">vết ngăn xếp — chuỗi lời gọi dẫn tới lỗi, kèm tệp:dòng:cột.</span></div>
  <div class="kv"><span class="k">assumption</span><span class="v">giả định — điều bạn tin là đúng nhưng chưa kiểm.</span></div>
  <div class="kv"><span class="k">minimal reproduction</span><span class="v">bản tái hiện tối thiểu — chương trình nhỏ nhất còn lỗi.</span></div>
  <div class="kv"><span class="k">active recall</span><span class="v">chủ động nhớ lại — tự viết ra từ trí nhớ.</span></div>
  <div class="kv"><span class="k">spaced repetition</span><span class="v">lặp lại giãn cách — ôn sau những khoảng tăng dần.</span></div>
  <div class="kv"><span class="k">tutorial hell</span><span class="v">"địa ngục hướng dẫn" — học mãi mà không tự làm được.</span></div>
  <div class="kv"><span class="k">documentation</span><span class="v">tài liệu chính thức (docs) — MDN cho web.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Vòng lặp: lướt → gõ → làm hỏng → luyện → nhớ lại.</li>
  <li>Đoán trước khi chạy; đoán sai là kết quả hữu ích nhất.</li>
  <li>Đọc lỗi từ dòng đầu, và tới vị trí ở đỉnh ngăn xếp.</li>
  <li>In giá trị bạn đang chắc chắn — lỗi trốn trong giả định chưa kiểm.</li>
  <li>Thu nhỏ lỗi; bản nhỏ cho đáp án hoặc thành câu hỏi hoàn hảo.</li>
  <li>Thứ tự khi kẹt: lỗi → in → thu nhỏ → tìm → hỏi, sau khoảng 20 phút.</li>
  <li>Câu hỏi tốt có bốn phần: mong đợi, thực tế, đã thử, mã. Với AI: hỏi nguyên nhân, rồi tự gõ cách sửa.</li>
  <li>Nhớ lại từ trí nhớ và ôn theo lịch 1-3-7-14-30 ngày; ít mà đều.</li>
</ul>
${nguon('📗', 'MDN Web Docs', 'Tài liệu tham chiếu đáng đánh dấu đầu tiên', 'https://developer.mozilla.org/en-US/')}
${nguon('📘', 'javascript.info', 'JavaScript từ cơ bản tới sâu, có bài tập sau mỗi chương', 'https://javascript.info/')}
${nguon('📙', 'Stack Overflow — How do I ask a good question?', 'Hướng dẫn kinh điển; dạng bốn phần xuất phát từ cùng ý tưởng', 'https://stackoverflow.com/help/how-to-ask')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-0-2-cach-hoc', title: 'Node.js 0.2 — vòng học cho khoá backend', sub: 'Cùng những thói quen đó, áp dụng cho máy chủ và cơ sở dữ liệu', cta: 'Mở bài' })}
</div>
`,
};
