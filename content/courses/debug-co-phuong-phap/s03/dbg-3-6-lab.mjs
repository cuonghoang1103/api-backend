/**
 * 3.6 — Lab: Bốn lỗi Node.js chỉ bằng debugger, cấm console.log (soạn 24/11/2026).
 * Mã + output THẬT (Node v22.22.2, Linux): _ma-3-6.mjs sinh từ ~/dbg-lab/ch3/lab; bản sửa chạy ở ch3/lab-sua. Đáp án ở cuối bài, khối riêng.
 * Phiên đáp án: node inspect (điều kiện, logpoint dạng điều kiện in rồi false, attach -p PID sau SIGUSR1) + cdp.mjs (ngoại lệ caught).
 */
import { nguon, lienKet } from '../_chung.mjs';
import { TAO, L1, L2, L3, L4 } from './_ma-3-6.mjs';

const ma = (s) => `<pre><code class="language-js">${s}</code></pre>`;

const TRIEU_CHUNG = `<div class="out">$ node tao-du-lieu.js
$ node 1-phi-tre.js
tổng phút trễ: 1469521512193101718152261320411182916071421512193101718152261320411182916071421512193101…   (a few thousand digits)
tổng phí     : 22011000
$ node 2-xep-hang.js
1. Lab 401  42 giờ
2. Lab 402  97 giờ
3. Lab 403  15 giờ
4. Lab 404  63 giờ
5. Lab 405  88 giờ
6. Lab 406  21 giờ
$ node 3-thong-ke.js
số lượt đọc được: 4
{ '2026-11-20': 2, '2026-11-21': 1, '2026-11-22': 1 }
$ node 4-may-chu.js &amp;
may-chu: http://127.0.0.1:43010
$ curl -s '127.0.0.1:43010/?nguoi=7';  curl -s '127.0.0.1:43010/?nguoi=42';  curl -s '127.0.0.1:43010/?nguoi=12'
{"nguoiId":7,"ten":"An","luc":"2026-11-23T20:29:40.002Z"}
{"nguoiId":7,"ten":"An","luc":"2026-11-23T20:29:40.002Z"}
{"nguoiId":7,"ten":"An","luc":"2026-11-23T20:29:40.002Z"}</div>`;

const DA1 = `<div class="out">$ node inspect 1-phi-tre.js
debug&gt; sb('1-phi-tre.js', 15, "typeof l.phutTre !== 'number'")
debug&gt; cont
break in 1-phi-tre.js:15
 13   let tong = 0;
 14   for (const l of luot) {
&gt;15     tong += l.phutTre;
debug&gt; exec l
{ id: 1337, nguoiId: 105, phutTre: '21' }
debug&gt; exec tong
14695
debug&gt; exec luot.indexOf(l)
1336</div>`;

const DA2 = `<div class="out">debug&gt; sb('2-xep-hang.js', 8, "console.log(a.ten, 'vs', b.ten, '-&gt;', a.gio &lt; b.gio), false")
debug&gt; cont
&lt; Lab 402 vs Lab 401 -&gt; false
&lt; Lab 403 vs Lab 402 -&gt; true
&lt; Lab 404 vs Lab 403 -&gt; false
&lt; Lab 405 vs Lab 404 -&gt; false
&lt; Lab 406 vs Lab 405 -&gt; true
&lt; 1. Lab 401  42 giờ
…</div>`;

const DA3 = `<div class="out">dừng ở ngoại lệ: all                       (Caught Exceptions ticked)
⏸  dừng (exception) tại 3-thong-ke.js:9  — hàm docLichSu
   ngoại lệ: RangeError: Invalid time value
  › dong
    "{\\"phong\\":\\"Lab 403\\",\\"luc\\":\\"2026-11-21T25:00:00Z\\"}"
  › b.luc
    "2026-11-21T25:00:00Z"
--- only Uncaught Exceptions ticked:
  [Debug Console] số lượt đọc được: 4       ← never stops</div>`;

const DA4 = `<div class="out">$ kill -USR1 &lt;PID of 4-may-chu.js&gt;          (or VS Code: Attach to Node Process)
Debugger listening on ws://127.0.0.1:9229/a5f050d9-4eab-4fd9-8b96-99c4ee669f03
$ node inspect -p &lt;PID&gt;
debug&gt; sb('4-may-chu.js', 14)
debug&gt;                                         # curl -s '127.0.0.1:43010/?nguoi=42'
break in 4-may-chu.js:14
&gt;14   if (!boDem[khoa]) boDem[khoa] = traCham(Number(khoa.nguoi));
debug&gt; exec khoa
{ nguoi: '42' }
debug&gt; exec String(khoa)
'[object Object]'
debug&gt; exec Object.keys(boDem)
[ '[object Object]' ]</div>`;

const SUA = `<div class="out"># 1 — tong += Number(l.phutTre);   (better: validate when loading luot.json, reject non-numbers with the id)
tổng phút trễ: 22011
tổng phí     : 22011000
# 2 — return b.gio - a.gio;   // negative / 0 / positive, most hours first
1. Lab 402  97 giờ
2. Lab 405  88 giờ
3. Lab 404  63 giờ
4. Lab 401  42 giờ
5. Lab 406  21 giờ
6. Lab 403  15 giờ
# 3 — the catch now reports what it skips
bỏ dòng 4: RangeError: Invalid time value — {"phong":"Lab 403","luc":"2026-11-21T25:00:00Z"}
số lượt đọc được: 4
# 4 — const khoa = 'nguoi:' + id;  const boDem = new Map();
{"nguoiId":7,"ten":"An","luc":"2026-11-23T20:40:39.667Z"}
{"nguoiId":42,"ten":"Chi","luc":"2026-11-23T20:40:39.679Z"}
{"nguoiId":12,"ten":"Bình","luc":"2026-11-23T20:40:39.689Z"}</div>`;

const NGUON = [
  nguon('🟦', 'VS Code — Node.js debugging', 'Tra lại cách đặt từng loại breakpoint và attach khi làm lab.', 'https://code.visualstudio.com/docs/nodejs/nodejs-debugging'),
  nguon('📘', 'MDN — Array.prototype.sort (compareFn)', 'Hàm so sánh phải trả số âm / 0 / dương, không phải true/false.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort'),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-0-9-bat-dau-khi-khong-co', title: 'Mẫu nhật ký gỡ lỗi năm dòng', sub: 'Mỗi lỗi trong lab nộp đúng mẫu này.', cta: 'Ôn lại →' }),
].join('\n');

export default {
  title: '3.6 — Lab: Four Node.js bugs with the debugger only (no console.log allowed)|||3.6 — Lab: Bốn lỗi Node.js chỉ bằng debugger (cấm console.log)',
  slug: 'dbg-3-6-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bốn chương trình LabFlow có lỗi thật, mỗi lỗi bắt buộc một kỹ thuật: breakpoint điều kiện (tổng phút thành chuỗi vì một bản ghi kiểu chuỗi), logpoint (sắp xếp sai vì hàm so sánh trả true/false), breakpoint ngoại lệ caught (try/catch nuốt mất một dòng ngày giờ 25:00), attach vào tiến trình đang chạy (bộ đệm dùng object làm khoá ⇒ "[object Object]", ai cũng nhận dữ liệu người đầu tiên). Gợi ý ba bậc, rubric, câu hỏi phỏng vấn, mốc dự án, đáp án có output thật ở cuối.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lab</span>
<h2>Four bugs, four techniques, zero console.log</h2>
<p class="lead">Each program below has one real bug. The rule of this lab: you may <strong>not</strong> add <code>console.log</code> or edit the code until you have found the cause — only the debugger. Each bug is chosen so that one technique from this chapter finds it in minutes and the others are clumsy. Answers with real debugger output are at the very end; do not scroll there first.</p>

<h3>Setup (5 min)</h3>
<p>Create <code>~/dbg-lab/ch3/lab</code>, type the five files below, run <code>node tao-du-lieu.js</code> once (it writes <code>luot.json</code> with 2000 bookings and <code>lich-su.jsonl</code> with 5 lines). Open the folder in VS Code; use a JavaScript Debug Terminal or a launch configuration per file.</p>
${ma(TAO)}
<p>The symptoms, as the tester reported them:</p>
${TRIEU_CHUNG}

<h3>Bug 1 — the late-minute total is a giant number (technique: conditional breakpoint)</h3>
${ma(L1)}
<p>The fee looks right; the minutes are thousands of digits long. <strong>Required:</strong> one conditional breakpoint that stops exactly on the record that causes it, without knowing its index.</p>
<details><summary>Hint 1 (where to look)</summary><p>A number that turns into a very long string of digits: what does <code>+</code> do when one side is a string?</p></details>
<details><summary>Hint 2 (which tool)</summary><p>Put the symptom in the condition: stop when the value you are about to add is not a number.</p></details>
<details><summary>Hint 3 (almost the answer)</summary><p>Line <code>tong += l.phutTre;</code>, condition <code>typeof l.phutTre !== 'number'</code>. Then ask: why is the fee correct?</p></details>

<h3>Bug 2 — the ranking does not rank (technique: logpoint)</h3>
${ma(L2)}
<p><strong>Required:</strong> a logpoint inside <code>soSanh</code> that prints both rooms and the returned value for every comparison. No pausing.</p>
<details><summary>Hint 1</summary><p>What does <code>sort</code> expect the compare function to return? Look at what it actually returns.</p></details>
<details><summary>Hint 2</summary><p>Logpoint message: <code>{a.ten} vs {b.ten} -&gt; {a.gio &lt; b.gio}</code>. Does any comparison ever return a negative number?</p></details>

<h3>Bug 3 — five lines in, four out, no error (technique: exception breakpoint)</h3>
${ma(L3)}
<p><strong>Required:</strong> find the swallowed error using the Exception breakpoint checkboxes only. Write down what happens with only "Uncaught" ticked and with "Caught" ticked too.</p>
<details><summary>Hint 1</summary><p>Something is thrown and caught. Which checkbox makes the debugger stop at caught throws?</p></details>
<details><summary>Hint 2</summary><p>When it stops, read <code>dong</code> in Variables. Is that a real time of day?</p></details>

<h3>Bug 4 — everyone is user 7 (technique: attach to the running process)</h3>
${ma(L4)}
<p>The bug only appears after the first request filled the cache. <strong>Required:</strong> start the server normally (no <code>--inspect</code>), call it as user 7, then attach to the running process (VS Code "Attach to Node Process", or <code>kill -USR1</code> + attach to 9229) <em>without restarting it</em>, and inspect the cache.</p>
<details><summary>Hint 1</summary><p>Restarting empties the cache — that is why you must attach.</p></details>
<details><summary>Hint 2</summary><p>Pause on the <code>if (!boDem[khoa])</code> line and evaluate <code>Object.keys(boDem)</code> and <code>String(khoa)</code>.</p></details>

<h3>What to hand in</h3>
<ul>
<li>One five-line debugging log per bug (template from Start here 2/2) naming the technique and the observation that proved the cause.</li>
<li>A screenshot of the debugger at the decisive moment (paused line + Variables/Debug Console).</li>
<li>The fix and one test per bug that is red before and green after.</li>
</ul>

<h3>Rubric (100 points)</h3>
<table>
<thead><tr><th>Criterion</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Each bug found with the required technique, no console.log (4 × 10)</td><td>40</td></tr>
<tr><td>Root cause stated in one correct sentence (4 × 5)</td><td>20</td></tr>
<tr><td>Fix removes the cause, not the symptom (4 × 5)</td><td>20</td></tr>
<tr><td>Regression test red → green (4 × 3)</td><td>12</td></tr>
<tr><td>Screenshots + logs readable by a teammate</td><td>8</td></tr>
</tbody>
</table>
<p><strong>Extra challenge:</strong> Bug 1's fee was correct while the minutes were wrong. Write in two sentences why, and add an import-time validation that rejects the record with its id. Bug 3: should the program skip broken lines or stop? Argue both sides for a booking-history import.</p>

<h3>🎤 What an interviewer will ask</h3>
<ol>
<li><strong>"How do you debug a bug that only happens for one customer out of thousands?"</strong> — Reproduce with that customer's data, then a conditional breakpoint on the customer id or on the symptom; never stop a shared server for everyone.</li>
<li><strong>"What is the difference between a breakpoint and a logpoint, and when do you prefer the second?"</strong> — A logpoint prints without pausing: for timing-sensitive code, values over time, or environments you must not pause.</li>
<li><strong>"An API returns success but data is missing; there are no errors in the log. Where do you start?"</strong> — Suspect a swallowed exception: break on caught exceptions, then fix the catch to report what it skipped.</li>
<li><strong>"How do you debug a Node app in Docker / on a test server? Any security concerns?"</strong> — --inspect inside, publish only on 127.0.0.1 or tunnel over SSH, map remoteRoot; an open inspector port is remote code execution.</li>
<li><strong>"Why can't you step into an async function with Restart Frame?"</strong> — V8 cannot rewind a suspended async function; set the breakpoint earlier and resend the request.</li>
</ol>

<h3>🛠 Project milestone</h3>
<p>Apply this to your own course project: add a committed (or documented) <code>launch.json</code> with launch + attach configurations, <code>skipFiles</code>, and one README line "how to debug". Pick one real bug from your project's backlog and solve it debugger-only, with a log.</p>
${NGUON}

<h3>Answers (check only after writing yours)</h3>
<div class="callout">
<p><strong>Bug 1.</strong> Record id 1337 came from the old mobile app with <code>phutTre: '21'</code> (a string). <code>14695 + '21'</code> is the string <code>'1469521'</code>; every later <code>+=</code> appends digits. The fee is correct because <code>'21' * 1000</code> converts to a number — <code>*</code> never concatenates. Root fix: convert/validate at the boundary where the data enters.</p>
${DA1}
<p><strong>Bug 2.</strong> <code>sort</code> wants a negative number, 0 or a positive number. The function returns <code>true</code>/<code>false</code>, which become 1/0 — it never says "a goes first", so the order is effectively random (here: unchanged). Fix: <code>return b.gio - a.gio;</code>.</p>
${DA2}
<p><strong>Bug 3.</strong> Line 4 contains <code>25:00</code>; <code>new Date(…)</code> gives Invalid Date and <code>toISOString()</code> throws a RangeError, which the empty <code>catch</code> swallows. Only "Caught Exceptions" stops there. Fix: at minimum report skipped lines with their number and error; for a history import, consider rejecting the whole file.</p>
${DA3}
<p><strong>Bug 4.</strong> Object keys are strings; an object used as a key becomes <code>"[object Object]"</code>, so every user shares one cache slot, filled by the first caller (user 7). Attaching was required because a restart empties the cache and hides the bug until the next request. Fix: a string key per user, preferably a <code>Map</code>; for a real cache also add expiry.</p>
${DA4}
<p>All four fixes, run:</p>
${SUA}
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Lab</span>
<h2>Bốn lỗi, bốn kỹ thuật, không một dòng console.log</h2>
<p class="lead">Mỗi chương trình dưới đây có một lỗi thật. Luật của lab: bạn <strong>không</strong> được thêm <code>console.log</code> hay sửa code cho tới khi tìm ra nguyên nhân — chỉ dùng debugger. Mỗi lỗi được chọn sao cho một kỹ thuật của chương này tìm ra trong vài phút còn các kỹ thuật khác thì vụng về. Đáp án kèm output debugger thật ở cuối cùng; đừng kéo xuống đó trước.</p>

<h3>Chuẩn bị (5 phút)</h3>
<p>Tạo <code>~/dbg-lab/ch3/lab</code>, gõ năm tệp dưới đây, chạy <code>node tao-du-lieu.js</code> một lần (nó ghi <code>luot.json</code> với 2000 lượt đặt và <code>lich-su.jsonl</code> với 5 dòng). Mở thư mục trong VS Code; dùng JavaScript Debug Terminal hoặc một cấu hình launch cho mỗi tệp.</p>
${ma(TAO)}
<p>Triệu chứng, đúng như tester báo:</p>
${TRIEU_CHUNG}

<h3>Lỗi 1 — tổng phút trễ là một con số khổng lồ (kỹ thuật: breakpoint điều kiện)</h3>
${ma(L1)}
<p>Phí trông đúng; số phút dài hàng nghìn chữ số. <strong>Bắt buộc:</strong> một breakpoint điều kiện dừng đúng ở bản ghi gây ra nó, mà không biết chỉ số của bản ghi đó.</p>
<details><summary>Gợi ý 1 (nhìn vào đâu)</summary><p>Một con số biến thành chuỗi chữ số rất dài: <code>+</code> làm gì khi một vế là chuỗi?</p></details>
<details><summary>Gợi ý 2 (dùng công cụ nào)</summary><p>Đưa triệu chứng vào điều kiện: dừng khi giá trị sắp cộng không phải số.</p></details>
<details><summary>Gợi ý 3 (gần như đáp án)</summary><p>Dòng <code>tong += l.phutTre;</code>, điều kiện <code>typeof l.phutTre !== 'number'</code>. Rồi tự hỏi: vì sao phí lại đúng?</p></details>

<h3>Lỗi 2 — bảng xếp hạng không xếp (kỹ thuật: logpoint)</h3>
${ma(L2)}
<p><strong>Bắt buộc:</strong> một logpoint trong <code>soSanh</code> in ra hai phòng và giá trị trả về ở mỗi lần so sánh. Không dừng.</p>
<details><summary>Gợi ý 1</summary><p><code>sort</code> chờ hàm so sánh trả về cái gì? Nhìn xem nó thật sự trả về gì.</p></details>
<details><summary>Gợi ý 2</summary><p>Thông điệp logpoint: <code>{a.ten} vs {b.ten} -&gt; {a.gio &lt; b.gio}</code>. Có lần so nào trả về số âm không?</p></details>

<h3>Lỗi 3 — vào năm dòng, ra bốn, không lỗi gì (kỹ thuật: breakpoint ngoại lệ)</h3>
${ma(L3)}
<p><strong>Bắt buộc:</strong> tìm lỗi bị nuốt chỉ bằng các ô Exception breakpoint. Ghi lại chuyện gì xảy ra khi chỉ tích "Uncaught" và khi tích thêm "Caught".</p>
<details><summary>Gợi ý 1</summary><p>Có thứ bị ném ra rồi bị bắt. Ô nào làm debugger dừng ở những lần ném đã được bắt?</p></details>
<details><summary>Gợi ý 2</summary><p>Khi dừng, đọc <code>dong</code> trong Variables. Đó có phải một giờ có thật trong ngày không?</p></details>

<h3>Lỗi 4 — ai cũng thành người 7 (kỹ thuật: attach vào tiến trình đang chạy)</h3>
${ma(L4)}
<p>Lỗi chỉ xuất hiện sau khi request đầu tiên đã đổ dữ liệu vào bộ đệm. <strong>Bắt buộc:</strong> chạy server bình thường (không <code>--inspect</code>), gọi với tư cách người 7, rồi gắn vào tiến trình đang chạy (VS Code "Attach to Node Process", hoặc <code>kill -USR1</code> + attach vào 9229) <em>mà không khởi động lại</em>, và soi bộ đệm.</p>
<details><summary>Gợi ý 1</summary><p>Khởi động lại là bộ đệm trống — vì vậy bắt buộc phải attach.</p></details>
<details><summary>Gợi ý 2</summary><p>Dừng ở dòng <code>if (!boDem[khoa])</code> rồi tính <code>Object.keys(boDem)</code> và <code>String(khoa)</code>.</p></details>

<h3>Nộp gì</h3>
<ul>
<li>Mỗi lỗi một nhật ký gỡ lỗi năm dòng (mẫu ở Bắt đầu tại đây 2/2), ghi kỹ thuật đã dùng và quan sát chứng minh nguyên nhân.</li>
<li>Một ảnh chụp debugger ở khoảnh khắc quyết định (dòng đang dừng + Variables/Debug Console).</li>
<li>Bản sửa và mỗi lỗi một test đỏ trước, xanh sau.</li>
</ul>

<h3>Rubric (100 điểm)</h3>
<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Mỗi lỗi tìm bằng đúng kỹ thuật bắt buộc, không console.log (4 × 10)</td><td>40</td></tr>
<tr><td>Nguyên nhân gốc nói đúng trong một câu (4 × 5)</td><td>20</td></tr>
<tr><td>Bản sửa gỡ nguyên nhân, không vá triệu chứng (4 × 5)</td><td>20</td></tr>
<tr><td>Test chặn tái phát đỏ → xanh (4 × 3)</td><td>12</td></tr>
<tr><td>Ảnh chụp + nhật ký mà bạn cùng nhóm đọc hiểu được</td><td>8</td></tr>
</tbody>
</table>
<p><strong>Thử thách thêm:</strong> ở Lỗi 1, phí đúng trong khi số phút sai. Viết trong hai câu vì sao, và thêm bước kiểm lúc nạp dữ liệu để từ chối bản ghi kèm id của nó. Lỗi 3: chương trình nên bỏ qua dòng hỏng hay dừng hẳn? Lập luận cả hai phía cho việc nhập lịch sử đặt phòng.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Bạn gỡ một lỗi chỉ xảy ra với một khách trong hàng nghìn khách thế nào?"</strong> — Tái hiện bằng dữ liệu của khách đó, rồi breakpoint điều kiện theo id khách hoặc theo triệu chứng; không bao giờ dừng server dùng chung của cả nhóm.</li>
<li><strong>"Breakpoint và logpoint khác nhau gì, khi nào bạn chọn cái sau?"</strong> — Logpoint in ra mà không dừng: cho code nhạy thời gian, cho giá trị theo thời gian, hoặc môi trường không được phép dừng.</li>
<li><strong>"API trả thành công nhưng thiếu dữ liệu; log không có lỗi. Bạn bắt đầu từ đâu?"</strong> — Nghi ngoại lệ bị nuốt: dừng ở ngoại lệ caught, rồi sửa catch để báo lại những gì nó bỏ qua.</li>
<li><strong>"Bạn debug ứng dụng Node trong Docker / trên máy test thế nào? Có lo ngại bảo mật gì?"</strong> — --inspect bên trong, chỉ publish 127.0.0.1 hoặc đi qua đường hầm SSH, ánh xạ remoteRoot; cổng inspector mở là chạy mã từ xa.</li>
<li><strong>"Vì sao Restart Frame không dùng được với hàm async?"</strong> — V8 không tua lại được hàm async đang treo; đặt breakpoint sớm hơn rồi gửi lại request.</li>
</ol>

<h3>🛠 Mốc dự án</h3>
<p>Áp vào dự án cuối khoá của bạn: thêm <code>launch.json</code> (commit hoặc ghi trong tài liệu) có cấu hình launch + attach, <code>skipFiles</code>, và một dòng README "cách debug". Chọn một lỗi thật trong backlog dự án của bạn và giải nó chỉ bằng debugger, có nhật ký.</p>
${NGUON}

<h3>Đáp án (chỉ xem sau khi đã viết câu trả lời của mình)</h3>
<div class="callout">
<p><strong>Lỗi 1.</strong> Bản ghi id 1337 đến từ ứng dụng di động cũ với <code>phutTre: '21'</code> (một chuỗi). <code>14695 + '21'</code> là chuỗi <code>'1469521'</code>; mọi lần <code>+=</code> sau đó nối thêm chữ số. Phí đúng vì <code>'21' * 1000</code> tự đổi sang số — <code>*</code> không bao giờ nối chuỗi. Sửa gốc: đổi kiểu/kiểm ở ranh giới nơi dữ liệu đi vào.</p>
${DA1}
<p><strong>Lỗi 2.</strong> <code>sort</code> cần số âm, 0 hoặc số dương. Hàm trả <code>true</code>/<code>false</code>, thành 1/0 — nó không bao giờ nói "a đứng trước", nên thứ tự coi như ngẫu nhiên (ở đây: giữ nguyên). Sửa: <code>return b.gio - a.gio;</code>.</p>
${DA2}
<p><strong>Lỗi 3.</strong> Dòng 4 chứa <code>25:00</code>; <code>new Date(…)</code> cho Invalid Date và <code>toISOString()</code> ném RangeError, bị <code>catch</code> rỗng nuốt mất. Chỉ "Caught Exceptions" dừng được ở đó. Sửa: tối thiểu báo các dòng bị bỏ kèm số dòng và lỗi; với việc nhập lịch sử, cân nhắc từ chối cả tệp.</p>
${DA3}
<p><strong>Lỗi 4.</strong> Khoá của object luôn là chuỗi; một object dùng làm khoá trở thành <code>"[object Object]"</code>, nên mọi người dùng chung một ô bộ đệm, do người gọi đầu tiên (người 7) đổ vào. Bắt buộc attach vì khởi động lại là bộ đệm trống và lỗi trốn tới request kế tiếp. Sửa: khoá chuỗi riêng cho từng người, tốt nhất dùng <code>Map</code>; bộ đệm thật còn cần thời hạn hết hạn.</p>
${DA4}
<p>Cả bốn bản sửa, chạy thật:</p>
${SUA}
</div>
</div>
`,
};
