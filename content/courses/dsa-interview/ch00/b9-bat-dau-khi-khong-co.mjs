/** Bắt đầu tại đây (2/2) — vì sao người ta trượt, và lộ trình luyện bền. Tình huống SV ghi rõ là minh hoạ; số liệu có nguồn ở thẻ cuối bài. */
import { nguon, lienKet, lc, baiNay } from '../_chung.mjs';

const THE = (k, t, d) => `<div class="lz-step"><span class="lz-k">${k}</span><span class="lz-t">${t}</span><span class="lz-d">${d}</span></div>`;

export default {
  title: 'Start here (2/2) — Why people fail it, and a practice plan that sticks|||Bắt đầu tại đây (2/2) — Vì sao người ta trượt, và lộ trình luyện bền',
  slug: 'dsa-0-9-bat-dau-khi-khong-co',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bảy kiểu trượt hay gặp (kèm cách tránh và chương chữa), lộ trình tối thiểu 4 tuần kịp hạn OJT và lộ trình đầy đủ 6 tuần, nhịp một buổi luyện, sổ lỗi, và cách không bỏ cuộc.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (2/2)</span>
<h2>Why people fail it, and a practice plan that sticks</h2>
<p class="lead">Most people who fail a coding round are not "bad at algorithms". They fail in a handful of very predictable ways — and almost every one of those ways is a <em>habit</em>, not a talent. This lesson lists the seven most common ones, each with the chapter that fixes it, then gives you two practice plans (a 4-week minimum that fits an application deadline in mid-December, and the full 6 weeks), the rhythm of one practice session, and the tricks that keep you going when an "Easy" problem takes you an hour.</p>
<p>The situations below are <strong>illustrative</strong> — composites of what students typically report, not stories about specific people. Where a number or an event is real, the source is linked at the bottom.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (2/2)</span>
<h2>Vì sao người ta trượt, và lộ trình luyện bền</h2>
<p class="lead">Phần lớn người trượt vòng coding không phải vì "kém thuật toán". Họ trượt theo vài cách rất dễ đoán — và gần như cách nào cũng là một <em>thói quen</em>, không phải năng khiếu. Bài này liệt kê bảy kiểu trượt hay gặp nhất, mỗi kiểu kèm chương chữa nó, rồi đưa bạn hai lộ trình (bản tối thiểu 4 tuần vừa kịp hạn hồ sơ giữa tháng 12, và bản đầy đủ 6 tuần), nhịp của một buổi luyện, và những mẹo giữ bạn đi tiếp khi một bài "Easy" ngốn của bạn cả tiếng.</p>
<p>Các tình huống dưới đây là <strong>minh hoạ</strong> — ghép từ những gì sinh viên hay kể, không phải chuyện của một người cụ thể. Chỗ nào là con số hay sự kiện có thật thì nguồn nằm ở cuối bài.</p>
</div>

<div class="ml-en">
<h3>Seven ways to fail — and the fix for each</h3>
<div class="lz-flow">
${THE('1', 'Memorising problems', 'You solved 300 problems by reading solutions. The interviewer changes the wording of one you "know" (pairs with a difference k instead of a sum) and you freeze. <em>Fix:</em> learn the pattern and its signal, not the answer — every chapter starts with "signals". Ch1–9.')}
${THE('2', 'Coding in silence', 'You think for 15 minutes without a word, then type. The interviewer cannot score what they cannot hear, and cannot give you a hint when you go the wrong way. <em>Fix:</em> the six-step framework (0.2) and the sample conversations in every lesson; Ch10.1 for phrases.')}
${THE('3', 'Not testing', '"Done!" — and the code crashes on an empty array. Testing is a whole quarter of the score. <em>Fix:</em> trace one normal example and two edge cases before saying done. Ch10.3.')}
${THE('4', 'Optimising before anything works', 'You chase the O(n) idea for 30 minutes and end with nothing that runs. <em>Fix:</em> say the brute force first, with its complexity; improve only from a working baseline. Lesson 0.2.')}
${THE('5', 'Losing the OA to input/output', 'The algorithm is right, but you read the input wrongly, or Java Scanner is too slow on 10⁶ numbers and you get Time Limit Exceeded. <em>Fix:</em> Ch10.4 — reading stdin in Node and Java, measured.')}
${THE('6', 'Panicking when stuck', 'You stall, apologise, and stop talking. <em>Fix:</em> a stuck-protocol — re-read the constraints, try a smaller example, name the brute force, ask for a hint in a way that still scores. Ch10.1.')}
${THE('7', 'Not knowing your own language', 'You choose JavaScript and only then remember it has no built-in heap; or you write Java and blank on the <code>PriorityQueue</code> comparator. <em>Fix:</em> every lesson shows both languages; Ch6.1 gives a 25-line heap you can write from memory.')}
</div>
</div>
<div class="ml-vi">
<h3>Bảy kiểu trượt — và cách chữa từng kiểu</h3>
<div class="lz-flow">
${THE('1', 'Học thuộc đề', 'Bạn "giải" 300 đề bằng cách đọc lời giải. Người phỏng vấn đổi chữ một đề bạn "biết" (cặp có HIỆU bằng k thay vì tổng) và bạn đứng hình. <em>Chữa:</em> học mẫu bài và dấu hiệu của nó, không học đáp án — chương nào cũng mở đầu bằng "dấu hiệu nhận ra". Ch1–9.')}
${THE('2', 'Code trong im lặng', 'Bạn nghĩ 15 phút không nói một lời rồi gõ. Người phỏng vấn không chấm được thứ họ không nghe thấy, và không gợi ý được khi bạn đi sai hướng. <em>Chữa:</em> khung 6 bước (0.2) và đoạn hội thoại mẫu ở mọi bài; câu mẫu ở Ch10.1.')}
${THE('3', 'Không test', '"Xong rồi ạ!" — và code sập với mảng rỗng. Kiểm thử chiếm trọn một phần tư số điểm. <em>Chữa:</em> chạy tay một ví dụ thường và hai trường hợp biên trước khi nói xong. Ch10.3.')}
${THE('4', 'Tối ưu khi chưa có gì chạy', 'Bạn đuổi theo ý tưởng O(n) 30 phút và kết thúc với… không gì chạy được. <em>Chữa:</em> nói vét cạn trước, kèm độ phức tạp; chỉ cải tiến từ một mốc đã chạy. Bài 0.2.')}
${THE('5', 'Mất bài OA vì đọc vào/ghi ra', 'Thuật toán đúng, nhưng bạn đọc sai định dạng input, hoặc Scanner của Java quá chậm với 10⁶ con số và bị Time Limit Exceeded (quá giờ). <em>Chữa:</em> Ch10.4 — đọc stdin trong Node và Java, có số đo.')}
${THE('6', 'Hoảng khi bí', 'Bạn khựng lại, xin lỗi, rồi im luôn. <em>Chữa:</em> một "quy trình khi bí" — đọc lại ràng buộc, thử ví dụ nhỏ hơn, gọi tên lời giải vét cạn, xin gợi ý theo cách vẫn được điểm. Ch10.1.')}
${THE('7', 'Không nắm ngôn ngữ của chính mình', 'Bạn chọn JavaScript rồi mới nhớ ra nó không có heap sẵn; hoặc viết Java mà quên cú pháp comparator của <code>PriorityQueue</code>. <em>Chữa:</em> bài nào cũng có cả hai ngôn ngữ; Ch6.1 cho bạn một heap 25 dòng viết lại được từ trí nhớ.')}
</div>
</div>

<div class="ml-en">
<h3>Two stories that are real</h3>
<p><strong>The famous rejection.</strong> In June 2015 Max Howell — who wrote Homebrew, the package manager a huge share of Mac developers install on day one — tweeted that Google had rejected him after asking him to invert a binary tree on a whiteboard. The internet took his side, and the tweet is still quoted whenever someone argues that coding interviews are broken. Two lessons for you, and they are not "interviews are unfair": first, even brilliant engineers fail rounds they did not prepare for, so preparing is not an admission of weakness; second, inverting a binary tree is a ten-line recursion you will write in Chapter 5 — the format rewards a specific, learnable kind of practice.</p>
<p><strong>The AI shortcut that backfired.</strong> In 2025 a student publicised a tool that fed AI answers into remote coding interviews. The response from companies was not to give up on coding rounds but to move at least one round back into the room: Google's CEO said so publicly, and other firms followed. Practically, this means the version of you that cannot code without an assistant is exactly what the new rounds are designed to find. Use AI to <em>explain</em> a pattern you are stuck on — not to produce the answer you then copy.</p>
</div>
<div class="ml-vi">
<h3>Hai câu chuyện có thật</h3>
<p><strong>Lần bị từ chối nổi tiếng.</strong> Tháng 6/2015, Max Howell — tác giả Homebrew, trình quản lý gói mà rất nhiều lập trình viên dùng Mac cài ngay ngày đầu — đăng tweet rằng Google đã từ chối anh sau khi bắt anh đảo ngược một cây nhị phân trên bảng trắng. Cả mạng đứng về phía anh, và dòng tweet vẫn được trích mỗi khi ai đó muốn nói phỏng vấn coding là hỏng. Hai bài học cho bạn, và nó không phải "phỏng vấn bất công": một, kỹ sư giỏi tới đâu cũng trượt vòng mà mình không chuẩn bị, nên chuẩn bị không phải là thừa nhận mình yếu; hai, đảo ngược cây nhị phân là một hàm đệ quy mười dòng bạn sẽ viết ở Chương 5 — hình thức thi này thưởng cho một kiểu luyện tập cụ thể, học được.</p>
<p><strong>Lối tắt bằng AI phản tác dụng.</strong> Năm 2025 một sinh viên quảng bá công cụ bơm câu trả lời của AI vào buổi phỏng vấn coding online. Các công ty không bỏ vòng coding — họ đưa ít nhất một vòng trở lại phòng họp: CEO Google nói công khai như vậy, và nhiều công ty khác làm theo. Thực tế mà nói: phiên bản "không có trợ lý thì không code được" của bạn chính là thứ các vòng phỏng vấn mới được thiết kế để tìm ra. Hãy dùng AI để <em>giải thích</em> một mẫu bài bạn đang kẹt — không phải để sinh ra đáp án rồi chép.</p>
</div>

<div class="ml-en">
<h3>How much practice is enough?</h3>
<p>The Tech Interview Handbook estimates about <strong>30 hours</strong> to cover the bare minimum and <strong>~100 hours</strong> to be well prepared, and suggests about three months at 2–3 hours a day for a relaxed schedule. It also warns that grinding thousands of problems is a poor use of time: at 30 minutes per problem and 3 hours a day you complete only about 160 problems in 3–4 weeks — so <em>which</em> problems you do matters more than how many. This course gives you roughly 250 hand-picked problems; you do not need all of them.</p>
<p>Your real constraint is the calendar: today is mid-November and your OJT application closes in mid-December. That is about four weeks. So there are two plans.</p>
</div>
<div class="ml-vi">
<h3>Luyện bao nhiêu là đủ?</h3>
<p>Tech Interview Handbook ước lượng khoảng <strong>30 giờ</strong> để phủ mức tối thiểu và <strong>~100 giờ</strong> để chuẩn bị tốt, và gợi ý khoảng ba tháng, mỗi ngày 2–3 giờ nếu muốn thong thả. Họ cũng cảnh báo "cày" hàng nghìn đề là dùng thời gian kém: 30 phút một đề, mỗi ngày 3 giờ thì 3–4 tuần cũng chỉ được khoảng 160 đề — nên làm <em>đề nào</em> quan trọng hơn làm bao nhiêu. Khoá này cho bạn khoảng 250 đề chọn lọc; bạn không cần làm hết.</p>
<p>Ràng buộc thật của bạn là lịch: hôm nay là giữa tháng 11, hồ sơ OJT đóng giữa tháng 12. Tức khoảng bốn tuần. Vậy có hai lộ trình.</p>
</div>

<div class="ml-en">
<h3>Plan A — 4-week minimum (fits the December deadline)</h3>
<table>
<thead><tr><th>Week</th><th>Learn</th><th>Practise (per day, ~1.5–2 h)</th></tr></thead>
<tbody>
<tr><td>1</td><td>Section 0 · Ch1 (hashing, prefix sum, sorting) · Ch2 (two pointers, sliding window)</td><td>2 new problems + 1 review; say every solution out loud</td></tr>
<tr><td>2</td><td>Ch3 (stack, queue, linked list) · Ch4 (binary search) · Ch5 (trees)</td><td>2 new + 1 review; first timed Easy (15′)</td></tr>
<tr><td>3</td><td>Ch6 (heap, intervals) · Ch7 (graphs: BFS/DFS, topo) · Ch9.1–9.2 (DP basics)</td><td>2 new + 2 review; timed Mediums (25′)</td></tr>
<tr><td>4</td><td>Ch10 (talking, testing, OA) · Ch11 mock interviews 1–2</td><td>1 OA-style set + 1 mock interview every other day; review the error log</td></tr>
</tbody></table>
<p>What Plan A skips for now: Ch8 (backtracking), most of Ch9 (2-D DP, greedy) and the hardest practice sets. They are rarer in internship rounds; come back to them after you submit the application, before the actual interviews.</p>
<h3>Plan B — the full 6 weeks</h3>
<p>Chapter 11.1 lays it out day by day: one chapter every 3–4 days, a review day each week, three mock interviews in weeks 5–6. Follow it if you have the time, or after Plan A.</p>
${lienKet({ khoa: 'dsa-interview', bai: 'dsa-11-1-lo-trinh', title: '11.1 — The 6-week plan, day by day', sub: 'Spaced review, the error log, mock interview dates', cta: 'Open' })}
</div>
<div class="ml-vi">
<h3>Lộ trình A — tối thiểu 4 tuần (kịp hạn tháng 12)</h3>
<table>
<thead><tr><th>Tuần</th><th>Học</th><th>Luyện (mỗi ngày ~1,5–2 giờ)</th></tr></thead>
<tbody>
<tr><td>1</td><td>Mục 0 · Ch1 (băm, tổng tiền tố, sắp xếp) · Ch2 (hai con trỏ, cửa sổ trượt)</td><td>2 đề mới + 1 đề ôn; nói to mọi lời giải</td></tr>
<tr><td>2</td><td>Ch3 (stack, queue, danh sách liên kết) · Ch4 (tìm kiếm nhị phân) · Ch5 (cây)</td><td>2 mới + 1 ôn; lần đầu bấm giờ đề Easy (15′)</td></tr>
<tr><td>3</td><td>Ch6 (heap, khoảng) · Ch7 (đồ thị: BFS/DFS, tô-pô) · Ch9.1–9.2 (DP cơ bản)</td><td>2 mới + 2 ôn; bấm giờ đề Medium (25′)</td></tr>
<tr><td>4</td><td>Ch10 (nói, test, OA) · Ch11 phỏng vấn thử 1–2</td><td>Cách ngày một bộ đề kiểu OA + một buổi phỏng vấn thử; ôn sổ lỗi</td></tr>
</tbody></table>
<p>Lộ trình A tạm bỏ qua: Ch8 (quay lui), phần lớn Ch9 (DP hai chiều, tham lam) và các bộ luyện khó nhất. Chúng ít gặp hơn ở vòng thực tập; quay lại học sau khi nộp hồ sơ, trước buổi phỏng vấn thật.</p>
<h3>Lộ trình B — đủ 6 tuần</h3>
<p>Bài 11.1 trải từng ngày: mỗi chương 3–4 ngày, mỗi tuần một ngày ôn, ba buổi phỏng vấn thử ở tuần 5–6. Theo nó nếu bạn có thời gian, hoặc sau lộ trình A.</p>
${lienKet({ khoa: 'dsa-interview', bai: 'dsa-11-1-lo-trinh', title: '11.1 — Lộ trình 6 tuần, từng ngày', sub: 'Ôn cách quãng, sổ lỗi, ngày phỏng vấn thử', cta: 'Mở' })}
</div>

<div class="ml-en">
<h3>The rhythm of one session (90 minutes)</h3>
<div class="lz-flow">
${THE('10′', 'Review', 'Re-solve one old problem from memory (spaced: 1, 3, 7, 14 days after you first solved it). If you cannot, it goes back into the error log.')}
${THE('20′', 'Learn', 'Read one lesson section: signals, template, the state table. Open the simulation and step through it.')}
${THE('25′', 'Problem 1', 'Timer on. Six steps, out loud. Stuck at 15′? Read hint 1. At 25′? Read the solution, close it, write it yourself.')}
${THE('25′', 'Problem 2', 'Same pattern, different "costume". This is where the pattern sticks.')}
${THE('10′', 'Log', 'One line per problem in the error log: signal → pattern → the mistake I made → the fix.')}
</div>
<p>Reading the solution after 25 minutes is <strong>not</strong> cheating — it is the fastest way to learn a pattern you did not know. The rule is: after reading, close it and write the solution yourself, then put the problem on the review schedule.</p>
<h3>The error log</h3>
<p>A plain table (notebook, Notion, a spreadsheet) with five columns: <em>date · problem · pattern · what went wrong · next review date</em>. After two weeks it tells you exactly what to study: if "off-by-one in binary search" appears four times, Chapter 4.1 is your next evening.</p>
</div>
<div class="ml-vi">
<h3>Nhịp của một buổi luyện (90 phút)</h3>
<div class="lz-flow">
${THE('10′', 'Ôn', 'Giải lại từ trí nhớ một đề cũ (cách quãng: 1, 3, 7, 14 ngày sau lần đầu giải được). Không giải được thì nó quay lại sổ lỗi.')}
${THE('20′', 'Học', 'Đọc một phần của bài: dấu hiệu, khung lời giải, bảng vết. Mở mô phỏng và bấm từng bước.')}
${THE('25′', 'Đề 1', 'Bật đồng hồ. Sáu bước, nói thành tiếng. Kẹt ở phút 15? Mở gợi ý 1. Tới phút 25? Đọc lời giải, đóng lại, tự viết.')}
${THE('25′', 'Đề 2', 'Cùng mẫu, khác "vỏ". Đây là lúc mẫu bài bám vào đầu.')}
${THE('10′', 'Ghi sổ', 'Mỗi đề một dòng vào sổ lỗi: dấu hiệu → mẫu → lỗi mình mắc → cách sửa.')}
</div>
<p>Đọc lời giải sau 25 phút <strong>không phải</strong> gian lận — đó là cách nhanh nhất để học một mẫu bạn chưa biết. Luật chỉ là: đọc xong thì đóng lại, tự viết lại lời giải, rồi đưa đề đó vào lịch ôn.</p>
<h3>Sổ lỗi</h3>
<p>Một bảng đơn giản (sổ tay, Notion, bảng tính) năm cột: <em>ngày · đề · mẫu · sai ở đâu · ngày ôn tiếp</em>. Sau hai tuần nó nói chính xác bạn cần học gì: "lệch một trong tìm kiếm nhị phân" xuất hiện bốn lần thì tối mai là bài 4.1.</p>
</div>

<div class="ml-en">
<h3>Why beginners give up, and what to do instead</h3>
<ul>
<li><strong>"An Easy took me an hour, I'm not cut out for this."</strong> Everyone's first Easy takes long. Measure progress per pattern: the third sliding-window problem usually takes half the time of the first.</li>
<li><strong>English problem statements.</strong> Every lesson keeps problem names in English but explains them in Vietnamese; the 🗂 box gives the vocabulary. Ch10.1 has the 30 phrases you actually need to speak.</li>
<li><strong>Red error messages.</strong> Read the first line and the line number; in Java the top of the stack trace, in Node the line under the caret. Most are one of five: index out of bounds, null/undefined, infinite loop, wrong type, off-by-one.</li>
<li><strong>Studying alone.</strong> Pair with a classmate who is also applying: twice a week, one is the interviewer (Chapter 11 has the scripts), the other solves out loud. It is the closest thing to the real round and it is free.</li>
<li><strong>Milestones.</strong> Mark them: first Accepted, first Medium alone, first Medium under 25′, first mock interview passed. Small wins keep the streak alive.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Vì sao người mới bỏ cuộc, và nên làm gì thay vào đó</h3>
<ul>
<li><strong>"Một bài Easy mất cả tiếng, chắc mình không hợp."</strong> Bài Easy đầu tiên của ai cũng lâu. Đo tiến bộ theo từng mẫu: bài cửa sổ trượt thứ ba thường chỉ mất nửa thời gian bài thứ nhất.</li>
<li><strong>Đề bằng tiếng Anh.</strong> Mọi bài giữ tên đề tiếng Anh nhưng giải thích bằng tiếng Việt; ô 🗂 cho bạn từ vựng. Bài 10.1 có 30 câu bạn thật sự cần để nói.</li>
<li><strong>Thông báo lỗi đỏ lòm.</strong> Đọc dòng đầu và số dòng; Java thì đầu stack trace, Node thì dòng dưới dấu mũ ^. Phần lớn rơi vào năm loại: chỉ số vượt mảng, null/undefined, lặp vô hạn, sai kiểu, lệch một.</li>
<li><strong>Học một mình.</strong> Ghép cặp với một bạn cùng lớp cũng đang nộp hồ sơ: mỗi tuần hai buổi, một người làm người phỏng vấn (Chương 11 có kịch bản), người kia giải và nói to. Đó là thứ gần với vòng thật nhất, và miễn phí.</li>
<li><strong>Cột mốc.</strong> Đánh dấu chúng: Accepted đầu tiên, Medium đầu tiên tự giải, Medium đầu tiên dưới 25′, buổi phỏng vấn thử đầu tiên qua. Chiến thắng nhỏ giữ cho chuỗi ngày luyện không đứt.</li>
</ul>
</div>

<div class="ml-en">
<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
<li>Choose Plan A or B. Put the four (or six) week blocks in your calendar now, with the time of day you will practise.</li>
<li>Create the error log with its five columns.</li>
<li>Solve ${lc(217, 'contains-duplicate', 'Contains Duplicate', 'Easy')} with a timer, saying each step out loud (even alone — especially alone). Log it.</li>
<li>Message one classmate who is also applying and agree on a first mock-interview date in week 3.</li>
</ol>
<p><strong>Done when:</strong> a calendar with blocks, an error log with one line, one accepted submission, and a mock date agreed.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">spaced repetition</span><span class="v">Reviewing at growing intervals (1, 3, 7, 14 days) so memory lasts.</span></div>
  <div class="kv"><span class="k">error log</span><span class="v">Your table of mistakes; the best guide to what to study next.</span></div>
  <div class="kv"><span class="k">TLE (Time Limit Exceeded)</span><span class="v">The judge stopped your program: right answer, too slow.</span></div>
  <div class="kv"><span class="k">mock interview</span><span class="v">A practice interview with a timer and someone playing the interviewer.</span></div>
  <div class="kv"><span class="k">hint</span><span class="v">A nudge from the interviewer; asking well still scores.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>People fail coding rounds through habits — memorising, silence, not testing, premature optimisation, I/O, panic, not knowing their language.</li>
<li>Each habit has a fixing chapter in this course.</li>
<li>Which problems you practise matters more than how many.</li>
<li>Four weeks is enough for the core (Plan A); six weeks covers everything (Plan B).</li>
<li>A session is review → learn → two problems → log; reading a solution after 25′ is fine if you rewrite it.</li>
<li>Practise with a partner, track milestones, and keep the streak.</li>
</ul>
${nguon('📗', 'Tech Interview Handbook — how long to prepare', 'The 30 h / 100 h estimate and the "160 problems in 3–4 weeks" arithmetic', 'https://www.techinterviewhandbook.org/coding-interview-prep/')}
${nguon('📗', 'Grind 75 — a customisable study plan', 'By the author of Blind 75; pick weeks and hours per week', 'https://www.techinterviewhandbook.org/grind75/')}
${nguon('📗', 'NeetCode practice list', 'Problems grouped by pattern with video solutions', 'https://neetcode.io/practice')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn lộ trình A hoặc B. Đặt ngay bốn (hoặc sáu) khối tuần vào lịch, kèm giờ trong ngày bạn sẽ luyện.</li>
<li>Tạo sổ lỗi với năm cột.</li>
<li>Giải ${lc(217, 'contains-duplicate', 'Contains Duplicate', 'Easy')} có bấm giờ, nói to từng bước (kể cả ngồi một mình — nhất là khi ngồi một mình). Ghi sổ.</li>
<li>Nhắn một bạn cùng lớp cũng đang nộp hồ sơ, hẹn ngày phỏng vấn thử đầu tiên vào tuần 3.</li>
</ol>
<p><strong>Đạt khi:</strong> có lịch với các khối giờ, sổ lỗi có một dòng, một lượt Accepted, và đã hẹn ngày phỏng vấn thử.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">spaced repetition (ôn cách quãng)</span><span class="v">Ôn lại sau những khoảng tăng dần (1, 3, 7, 14 ngày) để nhớ lâu.</span></div>
  <div class="kv"><span class="k">error log (sổ lỗi)</span><span class="v">Bảng ghi lỗi của bạn; chỉ dẫn tốt nhất cho việc học gì tiếp.</span></div>
  <div class="kv"><span class="k">TLE — Time Limit Exceeded (quá giờ)</span><span class="v">Máy chấm dừng chương trình: đúng đáp án nhưng quá chậm.</span></div>
  <div class="kv"><span class="k">mock interview (phỏng vấn thử)</span><span class="v">Buổi phỏng vấn tập có bấm giờ và có người đóng vai người phỏng vấn.</span></div>
  <div class="kv"><span class="k">hint (gợi ý)</span><span class="v">Một cú hích từ người phỏng vấn; xin đúng cách vẫn được điểm.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Người ta trượt vì thói quen — học thuộc, im lặng, không test, tối ưu quá sớm, vào/ra, hoảng, không nắm ngôn ngữ.</li>
<li>Mỗi thói quen có một chương chữa trong khoá.</li>
<li>Luyện đề nào quan trọng hơn luyện bao nhiêu đề.</li>
<li>Bốn tuần đủ cho phần lõi (lộ trình A); sáu tuần phủ hết (lộ trình B).</li>
<li>Một buổi = ôn → học → hai đề → ghi sổ; đọc lời giải sau 25′ là ổn nếu bạn tự viết lại.</li>
<li>Luyện cùng bạn, đánh dấu cột mốc, giữ chuỗi ngày.</li>
</ul>
${nguon('📗', 'Tech Interview Handbook — chuẩn bị bao lâu', 'Ước lượng 30 giờ / 100 giờ và phép tính "160 đề trong 3–4 tuần" (tiếng Anh)', 'https://www.techinterviewhandbook.org/coding-interview-prep/')}
${nguon('📗', 'Grind 75 — lộ trình tuỳ chỉnh', 'Của tác giả Blind 75; chọn số tuần và số giờ mỗi tuần', 'https://www.techinterviewhandbook.org/grind75/')}
${nguon('📗', 'NeetCode — danh sách luyện theo mẫu', 'Đề chia theo mẫu bài, có video lời giải', 'https://neetcode.io/practice')}
</div>
`,
};
