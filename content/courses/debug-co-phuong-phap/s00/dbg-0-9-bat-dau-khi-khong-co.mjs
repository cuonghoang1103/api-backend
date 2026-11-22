/**
 * Bắt đầu tại đây (2/2) — Gỡ lỗi không phương pháp (soạn 22/11/2026).
 * Output: chạy THẬT /tmp/dbg-lab/muc0 (diem-tb*.js, regex-cham.js · macOS arm64 · Node v26.8.1).
 * Nguồn: Cloudflare blog 12/07/2019 (sự cố 02/07/2019); SEC press release 2013-222 + lệnh 34-70694 (Knight Capital) —
 * khung ghi "440 triệu USD", nguồn SEC ghi "more than $460 million" ⇒ dùng số của SEC.
 */
import { nguon } from '../_chung.mjs';

const NGUON = [
  nguon('☁️', 'Cloudflare — Details of the Cloudflare outage on July 2, 2019', 'Bài phân tích của chính Cloudflare: regex, CPU 100%, 27 phút, "global terminate".', 'https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/'),
  nguon('⚖️', 'SEC — Press release 2013-222: Knight Capital', 'Uỷ ban Chứng khoán Mỹ: lỗi phần mềm, hơn 460 triệu USD, 45 phút, phạt 12 triệu USD.', 'https://www.sec.gov/news/press-release/2013-222'),
  nguon('⚖️', 'SEC — Order 34-70694 (Knight Capital, PDF)', 'Chi tiết: mã Power Peg cũ, cờ bị dùng lại, một trong tám máy chủ không được cập nhật.', 'https://www.sec.gov/files/litigation/admin/2013/34-70694.pdf'),
].join('\n');

const NHAT_KY = `<pre><code class="language-markdown">## Lỗi: &lt;một câu triệu chứng&gt;
- Mong đợi / thực tế:
- Tái hiện (lệnh hoặc các bước, chạy lại được):
- Đã thử | Kết quả        (mỗi dòng MỘT thay đổi)
- Kết luận nguyên nhân gốc:
- Bản sửa + test chặn tái phát:</code></pre>`;

export default {
  title: 'Start here (2/2) — Debugging without a method: endless console.log, random edits|||Bắt đầu tại đây (2/2) — Gỡ lỗi không phương pháp: console.log hàng giờ, sửa bừa',
  slug: 'dbg-0-9-bat-dau-khi-khong-co',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ba kiểu gỡ lỗi tốn cả ngày (đoán rồi sửa, sửa nhiều chỗ một lúc, không ghi lại) chạy thật trên một chương trình nhỏ; hai sự cố thật có nguồn: Cloudflare 2019 (regex làm CPU 100%) và Knight Capital 2012 (cờ cũ, hơn 460 triệu USD trong 45 phút); tình huống đồ án nhóm; mẫu nhật ký gỡ lỗi và cách học không nản.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>What debugging without a method costs — on your laptop and at real companies</h2>
<p class="lead">Part 1 said what debugging is. This part shows what happens without a method — first on a ten-line program you can run, then in two real incidents that cost a global CDN 27 minutes of outage and a trading firm more than 460 million dollars. Then we fix the habit with one small tool you will use for every bug in this course: the debugging log.</p>

<h3>Three habits that eat whole days</h3>
<ol>
<li><strong>Guess, then edit.</strong> You see a symptom, you change the line where it shows, and if the red text disappears you call it fixed. You never learned the cause.</li>
<li><strong>Change several things at once.</strong> You edit the loop, the type and the config in one go. It works — but which change fixed it, and did the other two break something else?</li>
<li><strong>Do not write anything down.</strong> After two hours you no longer remember what you have already tried, so you try it again. Your teammate tries it a third time.</li>
</ol>

<h3>Watch habit 1 happen: a fix that makes things worse</h3>
<p>An average-score function prints <code>NaN</code>. A tempting "fix" is to add <code>|| 0</code> so the <code>NaN</code> goes away.</p>
<pre><code class="language-js">const diem = [8, 7, 9];
let tong = 0, dem = 0;
for (let i = 0; i &lt;= diem.length; i++) {   // planted bug
  tong += diem[i];
  dem++;
}
console.log('Điểm trung bình:', tong / dem);</code></pre>
<div class="out">$ node diem-tb.js
Điểm trung bình: NaN
$ node diem-tb-sua-bua.js        # tong += diem[i] || 0;
Điểm trung bình: 6
$ node diem-tb-sua-goc.js        # i &lt; diem.length
Điểm trung bình: 8</div>
<p>Read those three lines slowly. The "fix" removed the error and produced a <strong>wrong number with no error at all</strong>: (8 + 7 + 9 + 0) / 4 = 6. A loud bug became a silent one — the worst trade in software. The real cause is <code>&lt;=</code>: the loop runs one step past the end, reads <code>diem[3]</code>, which is <code>undefined</code>, and <code>24 + undefined</code> is <code>NaN</code>. Fixing the cause gives 8.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "the error is gone" is not "the bug is fixed".</strong> Before you call it fixed, say the cause in one sentence and check the result against a value you computed by hand.</p></div>

<h3>Real incident 1 — Cloudflare, 2 July 2019: one regular expression, the whole network</h3>
<p>At 13:42 UTC an automatic deployment pushed a small rule change to Cloudflare's Web Application Firewall. The rule contained a regular expression that <strong>backtracked</strong> enormously. Every server worldwide spent its CPU on that one regex, and Cloudflare's own write-up says the service "went down for 27 minutes". At 14:07 an engineer ran a "global terminate" that switched the firewall off everywhere; traffic recovered by 14:09. Their analysis names the critical part, <code>.*(?:.*=.*)</code>, simplified to <code>.*.*=.*</code>.</p>
<p>You can feel the problem on your own laptop. The script below runs <code>/.*.*=.*/</code> against a string of <code>x</code> characters that contains no <code>=</code>, so the engine tries every way to split the string before giving up:</p>
<pre><code class="language-js">const re = /.*.*=.*/;
for (const n of [250, 500, 1000, 2000]) {
  const s = 'x'.repeat(n);
  const t0 = process.hrtime.bigint();
  re.test(s);
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  console.log(&#96;n=&#36;{String(n).padStart(5)}  &#36;{ms.toFixed(1).padStart(8)} ms&#96;);
}</code></pre>
<div class="out">$ node regex-cham.js
n=  250      18.9 ms
n=  500      67.0 ms
n= 1000     527.4 ms
n= 2000    4214.4 ms</div>
<p>Doubling the input multiplies the time by about eight: 0.5 seconds at 1,000 characters, 4.2 seconds at 2,000. A web request is often longer than that. What a methodical team does next is visible in their post: <strong>restore service first</strong> (the global kill switch), then reproduce the regex in isolation, then fix the class of problem (they planned to move to a regex engine that cannot backtrack and to re-add a CPU guard). You will learn "restore first, investigate after" in Chapter 10.</p>

<h3>Real incident 2 — Knight Capital, 1 August 2012: an old flag woke up</h3>
<p>According to the U.S. Securities and Exchange Commission, Knight Capital prepared new code for a NYSE programme. The new code <strong>reused a flag</strong> that years earlier had switched on an old feature called "Power Peg" — code that was no longer used but was still present and callable. During the deployment, a technician <strong>did not copy the new code to one of the eight servers</strong>, and no second person reviewed the deployment. On the morning of 1 August, orders carrying the reused flag reached that eighth server and woke up Power Peg. In about 45 minutes the router sent <strong>more than 4 million orders</strong> while trying to fill 212 customer orders, and Knight lost <strong>more than 460 million dollars</strong>. The SEC later fined the firm 12 million dollars.</p>
<p>Three debugging lessons sit inside that story, and each has a chapter in this course: dead code and old flags are time bombs (Chapter 10, feature flags); "it works on seven machines" means you must check <em>which version is actually running</em> on each (Chapter 8, stale state); and a written, reviewed procedure would have caught one missing copy (Chapter 11).</p>

<h3>A scene from a student team project (illustrative)</h3>
<p>The night before the SWP391 demo, the login page stops working. Four teammates each open the code and start changing things: one renames a variable, one downgrades a library, one edits the database by hand, one rewrites the controller. At 3 a.m. it works. Nobody knows why, two other pages are now broken, and on demo day the bug comes back in front of the lecturer. Not one of them was lazy — they had no shared method and nothing written down. One person reproducing, one hypothesis at a time and one shared log would likely have finished before midnight.</p>

<h3>The fix for the habit: a debugging log, for every bug</h3>
<p>From now on, every bug in this course gets five lines. It takes two minutes, and it is exactly what your lead will ask for and what makes the interview answer "the hardest bug I fixed" easy.</p>
${NHAT_KY}
<p>The "Tried | Result" lines force habit 2 away: one change per line. The "Reproduce" line forces you to have a command that shows the bug before you start guessing.</p>

<h3>How to learn this without giving up</h3>
<ul>
<li><strong>Why people quit:</strong> long red English text looks frightening, and lessons about "method" feel slow when you just want the fix. The cure is small wins: every lesson has a 10–20 minute practice that is built to succeed.</li>
<li><strong>Rhythm of one session (45–60 min):</strong> read the lesson → run every command yourself → do 🧪 → write the debugging log → quiz at the end of the chapter.</li>
<li><strong>Weak English?</strong> Each lesson has 🗂 Key terms. Error messages repeat the same 40 words — after Chapter 2 you will recognise most of them.</li>
<li><strong>The 30-minute rule:</strong> stuck for 30 minutes with no new information? Ask — with your debugging log attached (lesson 1.4 shows how).</li>
<li><strong>Minimum path (2 weeks):</strong> Section 0, Chapters 1–4, then the capstone bugs 1–5. <strong>Full path:</strong> all 12 chapters.</li>
</ul>

<h3>🧪 Practice (15 min) — refuse the symptom fix</h3>
<div class="callout ok">
<ol>
<li>In <code>~/dbg-lab/muc0</code>, type <code>diem-tb.js</code> from above and run it: you see <code>NaN</code>.</li>
<li>Start a debugging log. Write expected (8) and actual (<code>NaN</code>) and the reproduce command <code>node diem-tb.js</code>.</li>
<li>Test the hypothesis "the loop reads one element too many" without fixing: add a single temporary line <code>console.log(i, diem[i])</code> inside the loop and read the last line it prints.</li>
<li>Copy the file to <code>diem-tb-sua-bua.js</code> and apply the <code>|| 0</code> "fix". Write in your log what it prints and why that is worse.</li>
<li>Fix the cause in <code>diem-tb.js</code>, remove the temporary line, run again.</li>
</ol>
<p><strong>Done when:</strong> your log shows <code>3 undefined</code> as the evidence line, the symptom fix printing 6 with the arithmetic (24 / 4), and the root fix printing 8.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">symptom fix</span><span class="v">A change that hides what you see without removing the cause.</span></div>
  <div class="kv"><span class="k">silent failure</span><span class="v">A wrong result with no error — harder to notice than a crash.</span></div>
  <div class="kv"><span class="k">backtracking</span><span class="v">A regex engine retrying other ways to match; can grow explosively.</span></div>
  <div class="kv"><span class="k">kill switch</span><span class="v">A switch that turns a feature off without a deploy.</span></div>
  <div class="kv"><span class="k">dead code</span><span class="v">Code that is no longer used but is still present and can be triggered.</span></div>
  <div class="kv"><span class="k">debugging log</span><span class="v">The five-line record of one bug: symptom, reproduce, tried, cause, fix.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Guessing, changing many things at once and not writing down are what turn one-hour bugs into one-day bugs.</li>
<li>A symptom fix can turn a loud bug into a silent wrong answer — always state the cause and check against a hand-computed value.</li>
<li>Cloudflare 2019: one backtracking regex took a global network down for 27 minutes; they restored first, then investigated.</li>
<li>Knight Capital 2012: a reused flag, dead code and one un-updated server cost more than 460 million dollars in 45 minutes.</li>
<li>Every bug in this course gets a five-line debugging log; ask for help after 30 minutes without new information.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Gỡ lỗi không có phương pháp tốn gì — trên máy bạn và ở công ty thật</h2>
<p class="lead">Phần 1 nói gỡ lỗi là gì. Phần này cho bạn thấy chuyện gì xảy ra khi không có phương pháp — trước hết trên một chương trình mười dòng bạn tự chạy được, rồi qua hai sự cố có thật: một mạng CDN toàn cầu sập 27 phút, và một công ty chứng khoán mất hơn 460 triệu USD. Sau đó ta sửa thói quen bằng một công cụ nhỏ dùng cho mọi lỗi trong khoá: nhật ký gỡ lỗi.</p>

<h3>Ba thói quen ăn mất cả ngày</h3>
<ol>
<li><strong>Đoán rồi sửa.</strong> Thấy triệu chứng, sửa đúng dòng nó hiện ra, chữ đỏ biến mất là coi như xong. Bạn chưa bao giờ biết nguyên nhân.</li>
<li><strong>Sửa nhiều chỗ một lúc.</strong> Bạn sửa vòng lặp, kiểu dữ liệu và cấu hình trong một lần. Nó chạy — nhưng chỗ nào làm nó chạy, và hai chỗ kia có làm hỏng gì khác không?</li>
<li><strong>Không ghi lại gì.</strong> Sau hai tiếng bạn không còn nhớ mình đã thử gì, nên thử lại. Bạn cùng nhóm thử lần thứ ba.</li>
</ol>

<h3>Xem thói quen 1 diễn ra: một bản sửa làm mọi thứ tệ hơn</h3>
<p>Hàm tính điểm trung bình in ra <code>NaN</code> (Not a Number — không phải số). "Cách sửa" hấp dẫn là thêm <code>|| 0</code> cho <code>NaN</code> biến mất.</p>
<pre><code class="language-js">const diem = [8, 7, 9];
let tong = 0, dem = 0;
for (let i = 0; i &lt;= diem.length; i++) {   // lỗi cài sẵn
  tong += diem[i];
  dem++;
}
console.log('Điểm trung bình:', tong / dem);</code></pre>
<div class="out">$ node diem-tb.js
Điểm trung bình: NaN
$ node diem-tb-sua-bua.js        # tong += diem[i] || 0;
Điểm trung bình: 6
$ node diem-tb-sua-goc.js        # i &lt; diem.length
Điểm trung bình: 8</div>
<p>Đọc chậm ba dòng đó. "Bản sửa" xoá được lỗi và cho ra một <strong>con số sai mà không báo lỗi gì</strong>: (8 + 7 + 9 + 0) / 4 = 6. Một lỗi ồn ào biến thành lỗi câm — cuộc đổi chác tệ nhất trong phần mềm. Nguyên nhân thật là <code>&lt;=</code>: vòng lặp chạy quá cuối mảng một bước, đọc <code>diem[3]</code> là <code>undefined</code>, mà <code>24 + undefined</code> là <code>NaN</code>. Sửa đúng gốc thì ra 8.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "hết báo lỗi" không có nghĩa là "hết lỗi".</strong> Trước khi gọi là đã sửa, hãy nói nguyên nhân bằng một câu và so kết quả với một giá trị bạn tự tính tay.</p></div>

<h3>Sự cố thật 1 — Cloudflare, 2/7/2019: một biểu thức chính quy, cả mạng lưới</h3>
<p>Lúc 13:42 UTC, một lượt triển khai tự động đẩy một thay đổi nhỏ trong luật của tường lửa ứng dụng web (WAF) của Cloudflare. Luật đó chứa một regular expression (biểu thức chính quy, regex) bị <strong>backtracking (quay lui)</strong> dữ dội. Mọi máy chủ trên thế giới dồn CPU cho đúng một regex đó, và bài phân tích của chính Cloudflare ghi dịch vụ "went down for 27 minutes" (sập 27 phút). Lúc 14:07 một kỹ sư chạy lệnh "global terminate" tắt tường lửa ở mọi nơi; lưu lượng hồi phục lúc 14:09. Bài viết chỉ ra phần mấu chốt là <code>.*(?:.*=.*)</code>, rút gọn thành <code>.*.*=.*</code>.</p>
<p>Bạn cảm được vấn đề ngay trên laptop. Đoạn dưới chạy <code>/.*.*=.*/</code> trên một chuỗi toàn chữ <code>x</code> không có dấu <code>=</code>, nên bộ máy regex thử mọi cách chia chuỗi trước khi chịu thua:</p>
<pre><code class="language-js">const re = /.*.*=.*/;
for (const n of [250, 500, 1000, 2000]) {
  const s = 'x'.repeat(n);
  const t0 = process.hrtime.bigint();
  re.test(s);
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  console.log(&#96;n=&#36;{String(n).padStart(5)}  &#36;{ms.toFixed(1).padStart(8)} ms&#96;);
}</code></pre>
<div class="out">$ node regex-cham.js
n=  250      18.9 ms
n=  500      67.0 ms
n= 1000     527.4 ms
n= 2000    4214.4 ms</div>
<p>Đầu vào gấp đôi thì thời gian gấp khoảng tám lần: 0,5 giây với 1.000 ký tự, 4,2 giây với 2.000. Một request web thường dài hơn thế. Việc một đội có phương pháp làm tiếp theo hiện rõ trong bài của họ: <strong>khôi phục dịch vụ trước</strong> (công tắc tắt toàn cầu), rồi tái hiện regex riêng lẻ, rồi sửa cả loại vấn đề (họ lên kế hoạch chuyển sang bộ máy regex không quay lui và lắp lại chốt chặn CPU). "Khôi phục trước, điều tra sau" bạn sẽ học ở Chương 10.</p>

<h3>Sự cố thật 2 — Knight Capital, 1/8/2012: một lá cờ cũ thức dậy</h3>
<p>Theo Uỷ ban Chứng khoán và Giao dịch Mỹ (SEC), Knight Capital chuẩn bị code mới cho một chương trình của sàn NYSE. Code mới <strong>dùng lại một flag (cờ)</strong> mà nhiều năm trước từng bật một tính năng cũ tên "Power Peg" — đoạn code không còn dùng nhưng vẫn nằm đó và vẫn gọi được. Khi triển khai, một kỹ thuật viên <strong>không chép code mới lên một trong tám máy chủ</strong>, và không có người thứ hai rà lại lượt triển khai. Sáng 1/8, các lệnh mang lá cờ được dùng lại tới máy chủ thứ tám và đánh thức Power Peg. Trong khoảng 45 phút, bộ định tuyến gửi <strong>hơn 4 triệu lệnh</strong> trong khi chỉ cần khớp 212 lệnh của khách, và Knight mất <strong>hơn 460 triệu USD</strong>. Sau đó SEC phạt công ty 12 triệu USD.</p>
<p>Ba bài học gỡ lỗi nằm trong câu chuyện đó, và mỗi bài có một chương trong khoá: code chết và cờ cũ là bom hẹn giờ (Chương 10, feature flag); "chạy được trên bảy máy" nghĩa là phải kiểm <em>phiên bản nào đang thật sự chạy</em> trên từng máy (Chương 8, trạng thái cũ); và một quy trình có ghi chép, có người rà, đã bắt được một lần chép thiếu (Chương 11).</p>

<h3>Một cảnh trong đồ án nhóm (tình huống minh hoạ)</h3>
<p>Đêm trước buổi demo SWP391, trang đăng nhập ngừng chạy. Bốn bạn cùng mở code và bắt đầu sửa: một bạn đổi tên biến, một bạn hạ phiên bản thư viện, một bạn sửa tay cơ sở dữ liệu, một bạn viết lại controller. 3 giờ sáng nó chạy. Không ai biết vì sao, hai trang khác giờ hỏng, và hôm demo lỗi quay lại ngay trước mặt giảng viên. Không ai trong bốn bạn lười cả — chỉ là không có phương pháp chung và không có gì được ghi lại. Một người tái hiện, mỗi lần một giả thuyết, một nhật ký chung — nhiều khả năng đã xong trước nửa đêm.</p>

<h3>Thuốc chữa thói quen: nhật ký gỡ lỗi, cho mọi lỗi</h3>
<p>Từ giờ, mỗi lỗi trong khoá có năm dòng. Mất hai phút, và đó đúng là thứ trưởng nhóm sẽ hỏi, cũng là thứ làm câu phỏng vấn "lỗi khó nhất bạn từng sửa" trở nên dễ.</p>
${NHAT_KY}
<p>Các dòng "Đã thử | Kết quả" ép bạn bỏ thói quen 2: mỗi dòng một thay đổi. Dòng "Tái hiện" ép bạn phải có một lệnh cho thấy lỗi trước khi bắt đầu đoán.</p>

<h3>Học thế nào để không nản</h3>
<ul>
<li><strong>Vì sao người ta bỏ:</strong> dòng chữ đỏ tiếng Anh dài trông đáng sợ, và bài về "phương pháp" có vẻ chậm khi bạn chỉ muốn sửa cho xong. Thuốc là những chiến thắng nhỏ: bài nào cũng có phần thực hành 10–20 phút được thiết kế để làm được.</li>
<li><strong>Nhịp một buổi (45–60 phút):</strong> đọc bài → tự chạy mọi lệnh → làm 🧪 → viết nhật ký gỡ lỗi → cuối chương làm quiz.</li>
<li><strong>Yếu tiếng Anh?</strong> Bài nào cũng có ô 🗂 Thuật ngữ. Thông báo lỗi lặp lại khoảng 40 từ — học xong Chương 2 bạn sẽ nhận ra gần hết.</li>
<li><strong>Quy tắc 30 phút:</strong> bí 30 phút mà không có thông tin mới? Hỏi — kèm nhật ký gỡ lỗi (bài 1.4 chỉ cách hỏi).</li>
<li><strong>Lộ trình tối thiểu (2 tuần):</strong> Mục 0, Chương 1–4, rồi lỗi 1–5 của dự án cuối khoá. <strong>Đầy đủ:</strong> cả 12 chương.</li>
</ul>

<h3>🧪 Thực hành (15 phút) — từ chối bản sửa triệu chứng</h3>
<div class="callout ok">
<ol>
<li>Trong <code>~/dbg-lab/muc0</code>, gõ lại <code>diem-tb.js</code> ở trên và chạy: bạn thấy <code>NaN</code>.</li>
<li>Mở nhật ký gỡ lỗi. Ghi mong đợi (8), thực tế (<code>NaN</code>) và lệnh tái hiện <code>node diem-tb.js</code>.</li>
<li>Kiểm giả thuyết "vòng lặp đọc thừa một phần tử" mà chưa sửa: thêm đúng một dòng tạm <code>console.log(i, diem[i])</code> trong vòng lặp, đọc dòng cuối nó in ra.</li>
<li>Chép tệp thành <code>diem-tb-sua-bua.js</code> và áp "bản sửa" <code>|| 0</code>. Ghi vào nhật ký nó in gì và vì sao như thế còn tệ hơn.</li>
<li>Sửa đúng nguyên nhân trong <code>diem-tb.js</code>, xoá dòng tạm, chạy lại.</li>
</ol>
<p><strong>Đạt khi:</strong> nhật ký có dòng bằng chứng <code>3 undefined</code>, bản sửa triệu chứng in 6 kèm phép tính (24 / 4), và bản sửa gốc in 8.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">symptom fix (sửa triệu chứng)</span><span class="v">Thay đổi che cái bạn thấy mà không bỏ được nguyên nhân.</span></div>
  <div class="kv"><span class="k">silent failure (lỗi câm)</span><span class="v">Kết quả sai mà không báo lỗi — khó phát hiện hơn sập hẳn.</span></div>
  <div class="kv"><span class="k">backtracking (quay lui)</span><span class="v">Bộ máy regex thử lại các cách khớp khác; có thể tăng bùng nổ.</span></div>
  <div class="kv"><span class="k">kill switch (công tắc ngắt)</span><span class="v">Công tắc tắt một tính năng mà không cần deploy.</span></div>
  <div class="kv"><span class="k">dead code (code chết)</span><span class="v">Code không còn dùng nhưng vẫn nằm đó và vẫn kích hoạt được.</span></div>
  <div class="kv"><span class="k">debugging log (nhật ký gỡ lỗi)</span><span class="v">Năm dòng ghi một lỗi: triệu chứng, tái hiện, đã thử, nguyên nhân, bản sửa.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đoán mò, sửa nhiều chỗ một lúc và không ghi lại là thứ biến lỗi một giờ thành lỗi một ngày.</li>
<li>Sửa triệu chứng có thể biến lỗi ồn ào thành đáp án sai câm lặng — luôn nói được nguyên nhân và so với số tính tay.</li>
<li>Cloudflare 2019: một regex quay lui làm sập mạng toàn cầu 27 phút; họ khôi phục trước, điều tra sau.</li>
<li>Knight Capital 2012: cờ dùng lại, code chết và một máy chủ không được cập nhật — hơn 460 triệu USD trong 45 phút.</li>
<li>Mỗi lỗi trong khoá có nhật ký năm dòng; bí 30 phút không có thông tin mới thì hỏi.</li>
</ul>
${NGUON}
</div>
`,
};
