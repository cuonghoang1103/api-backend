/**
 * 3.2 — Breakpoint chuyên sâu (soạn 24/11/2026). Output chạy THẬT trên Linux · Node v22.22.2 · VS Code 1.129.0 / js-debug 1.117.0.
 * Phiên debugger: `node inspect` (client có sẵn của Node, cùng giao thức CDP với VS Code) + client CDP nhỏ cdp.mjs (tra source map như VS Code).
 * Sự thật về js-debug lấy từ chính mã extension: supportsFunctionBreakpoints = false, hitCondition khớp /^(>|>=|={1,3}|<|<=|%)?\s*([0-9]+)$/,
 * bộ lọc ngoại lệ "Caught Exceptions"/"Uncaught Exceptions" có điều kiện. Mã: scratchpad/dbg/lab/ch3/3-2 + app.
 */
import { nguon, lienKet } from '../_chung.mjs';

const MA_GIO = `<pre><code class="language-ts">// src/services/gioSuDung.ts — total booked hours of one user
export async function tongGio(nguoiId: number) {
  const ds = await prisma.datLich.findMany({ where: { nguoiId } });
  let tong = 0;
  for (const d of ds) {
    const gio = (d.ketThuc!.getTime() - d.batDau.getTime()) / 3_600_000;   // line 8
    tong += gio;
  }
  return Math.round(tong * 10) / 10;
}</code></pre>`;

const OUT_DK = `<div class="out">● breakpoint src/services/gioSuDung.ts:8 [điều kiện: nguoiId === 42]  → dist/services/gioSuDung.js:10 (1 vị trí)
$ curl -s http://127.0.0.1:43000/api/nguoi-dung/7/tong-gio    # An: does NOT pause
$ curl -s http://127.0.0.1:43000/api/nguoi-dung/42/tong-gio   # Chi: pauses
⏸  dừng (other) tại src/services/gioSuDung.ts:8  — hàm tongGio
  › nguoiId
    42
  › ds.length
    2
  › ds.map(x =&gt; x.ketThuc &amp;&amp; x.ketThuc.toISOString())
    ["2026-11-24T04:00:00.000Z",null]
  › d.id
    3
▶  tiếp tục (F5)</div>`;

const OUT_SUA_GIO = `<div class="out">$ npx tsc        # first attempt: just delete the "!" …
src/services/gioSuDung.ts(8,18): error TS18047: 'd.ketThuc' is possibly 'null'.
# … the compiler knew all along. The fix: decide what an open booking means, then say it in code
    if (d.ketThuc === null) continue;   // still checked in: counted when they check out
$ npx tsc &amp;&amp; node dist/app.js &amp;
$ for u in 7 12 42; do curl -s http://127.0.0.1:43000/api/nguoi-dung/$u/tong-gio; echo; done
{"nguoiId":7,"tongGio":3}
{"nguoiId":12,"tongGio":2.5}
{"nguoiId":42,"tongGio":2}</div>`;

const MA_NHAP = `<pre><code class="language-js">// ~/dbg-lab/ch3/3-2/nhap-phong.js — import 1000 rooms from a CSV exported by the admin office
const fs = require('fs');

function docCsv(tep) {
  const [dau, ...dong] = fs.readFileSync(tep, 'utf8').trim().split('\\n');
  const cot = dau.split(',');
  return dong.map((d) =&gt; Object.fromEntries(d.split(',').map((v, i) =&gt; [cot[i], v])));
}

function tongChoNgoi(dsPhong) {
  let tong = 0;
  for (let i = 0; i &lt; dsPhong.length; i++) {
    const p = dsPhong[i];
    tong += Number(p.sucChua);                  // line 13
  }
  return tong;
}

const ds = docCsv('phong.csv');
console.log('số phòng:', ds.length, '| tổng chỗ ngồi:', tongChoNgoi(ds));</code></pre>
<div class="out">$ node tao-csv.js &amp;&amp; node nhap-phong.js
số phòng: 1000 | tổng chỗ ngồi: NaN</div>`;

const OUT_500 = `<div class="out">$ node inspect nhap-phong.js
debug&gt; sb('nhap-phong.js', 13, 'i === 499')
debug&gt; cont
break in nhap-phong.js:13
 11   for (let i = 0; i &lt; dsPhong.length; i++) {
 12     const p = dsPhong[i];
&gt;13     tong += Number(p.sucChua);
 14   }
debug&gt; exec i
499
debug&gt; exec p
{ ma: 'P500', ten: 'Phong 500', sucChua: '30 chỗ' }
debug&gt; exec tong
14970
debug&gt; exec Number(p.sucChua)
NaN</div>`;

const OUT_TRIEU = `<div class="out">debug&gt; sb('nhap-phong.js', 13, 'Number.isNaN(Number(p.sucChua))')
debug&gt; cont
break in nhap-phong.js:13
debug&gt; exec [i, p.sucChua]
[ 499, '30 chỗ' ]</div>`;

const OUT_LOG = `<div class="out">debug&gt; sb('nhap-phong.js', 13, "(i % 100 === 99 || i === 499) &amp;&amp; console.log('i =', i, '| sucChua =', p.sucChua, '| tong =', tong), false")
debug&gt; cont
&lt; i = 99 | sucChua = 30 | tong = 2970
&lt; i = 199 | sucChua = 40 | tong = 5970
&lt; i = 299 | sucChua = 20 | tong = 8980
&lt; i = 399 | sucChua = 30 | tong = 11970
&lt; i = 499 | sucChua = 30 chỗ | tong = 14970
&lt; i = 599 | sucChua = 20 | tong = NaN
&lt; i = 699 | sucChua = 30 | tong = NaN
…
&lt; số phòng: 1000 | tổng chỗ ngồi: NaN</div>`;

const MA_CH = `<pre><code class="language-js">// ~/dbg-lab/ch3/3-2/dat-phong.js — can this booking request be accepted?
const fs = require('fs');

function docCauHinh() {
  try {
    return JSON.parse(fs.readFileSync('cau-hinh.json', 'utf8'));
  } catch {
    return { gioMoCua: 8, gioDongCua: 17, toiDaGioMoiLuot: 2 };   // fallback "just in case"
  }
}

const ch = docCauHinh();
const xin = { batDau: 18, soGio: 3 };
if (xin.batDau + xin.soGio &gt; ch.gioDongCua || xin.soGio &gt; ch.toiDaGioMoiLuot) {
  console.log('Từ chối: ngoài giờ mở cửa hoặc quá số giờ cho phép', ch);
} else {
  console.log('Đặt được');
}</code></pre>
<pre><code class="language-json">// cau-hinh.json — the lab opens until 21:00 and allows 3 hours per booking
{
  "gioMoCua": 7,
  "gioDongCua": 21,
  "toiDaGioMoiLuot": 3,
}</code></pre>
<div class="out">$ node dat-phong.js
Từ chối: ngoài giờ mở cửa hoặc quá số giờ cho phép { gioMoCua: 8, gioDongCua: 17, toiDaGioMoiLuot: 2 }</div>`;

const OUT_EX = `<div class="out"># Only "Uncaught Exceptions" ticked: nothing stops — the error is caught, so to the debugger nothing went wrong
debug&gt; breakOnUncaught
debug&gt; cont
&lt; Từ chối: ngoài giờ mở cửa hoặc quá số giờ cho phép { gioMoCua: 8, gioDongCua: 17, toiDaGioMoiLuot: 2 }

# "Caught Exceptions" ticked as well: stops at the throw, even though a catch is waiting
dừng ở ngoại lệ: all
⏸  dừng (exception) tại dat-phong.js:5  — hàm docCauHinh
   ngoại lệ: SyntaxError: Expected double-quoted property name in JSON at position 63 (line 5 column 1)
  #0 docCauHinh  dat-phong.js:5
  #1 (ẩn danh)  dat-phong.js:11</div>`;

const NGUON = [
  nguon('🟦', 'VS Code — Breakpoints (conditional, hit count, logpoints, triggered)', 'Cách đặt từng loại breakpoint trong giao diện.', 'https://code.visualstudio.com/docs/debugtest/debugging#_breakpoints'),
  nguon('🟢', 'Node.js — Debugger (node inspect)', 'setBreakpoint(file, line, condition), breakOnException, watch, exec.', 'https://nodejs.org/api/debugger.html'),
  nguon('📜', 'CDP — Debugger.setBreakpointByUrl / setPauseOnExceptions', 'Điều kiện breakpoint được V8 tự đánh giá; ngoại lệ "caught" = trạng thái all.', 'https://chromedevtools.github.io/devtools-protocol/v8/Debugger/#method-setBreakpointByUrl'),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-1-2-tai-hien', title: 'Bài 1.2 — tái hiện tối giản', sub: 'Breakpoint điều kiện là cách "thu nhỏ" một lỗi chỉ xảy ra với một đầu vào trong hàng nghìn.', cta: 'Ôn lại →' }),
].join('\n');

export default {
  title: '3.2 — Breakpoints in depth: conditional, hit count, logpoints, exception and function breakpoints|||3.2 — Breakpoint chuyên sâu: điều kiện, đếm lượt, logpoint, ngoại lệ, hàm',
  slug: 'dbg-3-2-breakpoint',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Sáu loại breakpoint và khi nào dùng: dừng chỉ khi nguoiId === 42 (sửa lỗi 500 của LabFlow — dấu ! của TypeScript đã bịt miệng trình biên dịch), bắt dòng thứ 500 trong 1000 bằng điều kiện theo chỉ số và theo triệu chứng, đếm lượt (cú pháp và vì sao chậm hơn), logpoint in log mà không sửa code, dừng ở ngoại lệ caught/uncaught (lộ cấu hình JSON hỏng bị try/catch nuốt), breakpoint hàm không có trong VS Code cho Node — dùng debugger;. Bẫy: = thay vì ===, điều kiện ném lỗi không bao giờ dừng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Make the debugger stop only where the bug is</h2>
<p class="lead">A plain breakpoint stops every time a line runs. On a line inside a loop of 1000, or in a route hit by every user, that is useless: you press F5 hundreds of times and miss the one case that matters. This lesson teaches the five other kinds of breakpoint, each one a way of telling the debugger <em>which</em> moment you care about — and uses them to fix two bugs for real.</p>

<h3>An everyday picture: the camera trap</h3>
<p>Wildlife researchers do not film the forest 24 hours a day and watch it all. They put a camera trap that fires only when something warm and big walks past. A plain breakpoint is filming everything; a conditional breakpoint is the camera trap; a logpoint is a counter at the gate that writes down who passed without stopping anyone.</p>

<h3>The six kinds — what each one answers</h3>
<table>
<thead><tr><th>Kind (VS Code: right-click the gutter)</th><th>Stops when</th><th>Use it for</th></tr></thead>
<tbody>
<tr><td>Line breakpoint</td><td>The line runs</td><td>Code that runs once per request/test</td></tr>
<tr><td>Conditional (Expression)</td><td>The line runs <em>and</em> the expression is truthy</td><td>One user, one id, one bad value among thousands</td></tr>
<tr><td>Hit count</td><td>The line has run N times (<code>500</code>, <code>&gt;= 500</code>, <code>% 100</code>)</td><td>"It breaks on the 500th call" when you have nothing else to filter on</td></tr>
<tr><td>Logpoint</td><td>Never — prints a message (<code>i={i} tong={tong}</code>)</td><td>Watching values over time without stopping or editing code</td></tr>
<tr><td>Exception (Caught / Uncaught)</td><td>An error is thrown</td><td>Errors swallowed by try/catch; crashes you cannot locate</td></tr>
<tr><td>Function</td><td>A named function is called</td><td>Not available for Node in VS Code — see below</td></tr>
</tbody>
</table>

<h3>1. Conditional: stop only for user 42</h3>
<p>Back to the LabFlow 500 from lesson 3.1. The code:</p>
${MA_GIO}
<p>A plain breakpoint on line 8 would stop for every user and every booking. Right-click line 8 → <em>Add Conditional Breakpoint</em> → Expression → <code>nguoiId === 42</code>:</p>
${OUT_DK}
<p>The first request (user 7) passes straight through; the second stops. In the Debug Console you ask what you would otherwise have printed: user 42 has two bookings, the second one has no end time. That is the root cause: a booking that is still open. Notice the <code>!</code> in <code>d.ketThuc!</code> — TypeScript's "trust me, it is not null". Remove it and the compiler shows it knew all along:</p>
${OUT_SUA_GIO}
<p>The fix is a product decision written in code (open bookings are counted when the person checks out), not "add a try/catch". In a real ticket you confirm that rule with the BA before merging.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>=</code> instead of <code>===</code>.</strong> The condition <code>nguoiId = 42</code> is an <em>assignment</em>: it is always truthy, so it stops every time — and it really sets <code>nguoiId</code> to 42 inside the running program, so the next lines read user 42's data for whoever called. Conditions run in your program; keep them free of side effects.</p></div>

<h3>2. The 500th of 1000: condition on the index, or on the symptom</h3>
${MA_NHAP}
<p>One row in a thousand turns the total into <code>NaN</code>. Two ways to stop at the right row. If you know <em>when</em> (row 500, index 499), put the index in the condition:</p>
${OUT_500}
<p>Better when you do not know when: put the <em>symptom</em> in the condition. Here the symptom is "this row produces NaN":</p>
${OUT_TRIEU}
<p>The admin typed <code>30 chỗ</code> ("30 seats") in Excel. The fix belongs where the data enters (validate when importing, reject the row with its line number), not at the sum.</p>
<p><strong>Hit count vs condition.</strong> In VS Code, <em>Hit Count</em> accepts <code>500</code>, <code>== 500</code>, <code>&gt;= 500</code>, <code>&lt; 3</code> or <code>% 100</code> (that is the exact pattern js-debug 1.117 accepts; anything else is rejected with "Invalid hit condition"). Two things to know: the counting is done by VS Code, so V8 has to pause and resume on <em>every</em> hit — noticeably slower in a hot loop than a condition, which V8 evaluates itself; and in this version, if a breakpoint has both an expression and a hit count, the expression is used. Prefer a condition on <code>i</code> when you have an index.</p>

<h3>3. Logpoint: print without editing, without stopping</h3>
<p>Right-click → <em>Add Logpoint</em> → message <code>i={i} sucChua={p.sucChua} tong={tong}</code>. Expressions in <code>{}</code> are evaluated each time; the line is printed in the Debug Console; the program never stops. Under the hood a logpoint is a conditional breakpoint whose condition prints and returns false — you can see it in the CLI equivalent:</p>
${OUT_LOG}
<p>Reading the log is a bisection in itself: the total is a number at 499 and NaN from 500. Use logpoints when stopping would change the behaviour (timeouts, a WebSocket that would disconnect, a race) or when you need the history of a value, not a snapshot. Nothing to remove before committing — logpoints live in VS Code, not in the code.</p>

<h3>4. Exception breakpoints: catch what try/catch hides</h3>
${MA_CH}
<p>The rule says "open until 21:00, up to 3 hours", yet the request 18:00 + 3 h is rejected with a config that says 17:00 and 2 hours — the fallback. No error printed anywhere. In the BREAKPOINTS panel there are two boxes:</p>
${OUT_EX}
<ul>
<li><strong>Uncaught Exceptions</strong>: stops only when no <code>catch</code> handles the error (or a promise rejection nobody handles). Leave it on while developing.</li>
<li><strong>Caught Exceptions</strong>: stops on every <code>throw</code>, even caught ones. This is the tool for "it silently does the wrong thing". It can be noisy (libraries throw and catch internally); both boxes accept a condition such as <code>error.name == "SyntaxError"</code>, and lesson 3.3's skipFiles hides library throws.</li>
</ul>
<p>Root cause: a trailing comma after <code>"toiDaGioMoiLuot": 3</code> — JSON is not JavaScript. Root fix: do not swallow the error; fail loudly at start-up (<code>throw new Error('cau-hinh.json hỏng: ' + e.message)</code>), because running with a wrong config is worse than not running.</p>

<h3>5. Function breakpoints — and what to use instead</h3>
<p>Java and C# debuggers can stop "whenever <code>tinhTien</code> is called" without opening the file. VS Code's JavaScript debugger does not offer this for Node: its capabilities list <code>supportsFunctionBreakpoints: false</code> (checked in js-debug 1.117). Alternatives: open the function (Ctrl+T / Go to Symbol) and put a line breakpoint on its first line; or temporarily write <code>debugger;</code> — the statement pauses whenever a debugger is attached and does nothing otherwise. Remove it before committing (ESLint's <code>no-debugger</code> rule catches forgotten ones).</p>

<h3>Silent failures of conditions</h3>
<ul>
<li>A condition that <em>throws</em> (refers to a variable that does not exist at that line) is treated as false. VS Code wraps your condition in <code>try { … } catch</code> and prints <code>Breakpoint condition error: …</code> to the Debug Console — easy to miss among other output; raw tools such as <code>node inspect</code> print nothing at all. If a conditional breakpoint never stops, look for that line, or test the expression in the Debug Console while paused on a plain breakpoint at the same line.</li>
<li>Put conditional breakpoints on a line <em>inside</em> the loop body, not on the <code>for (…)</code> header — on the header, loop variables may not exist yet.</li>
</ul>

<h3>On the job</h3>
<p>Support forwards: "Customer #18342 sees a wrong invoice total; other customers are fine." On a shared dev/staging environment you must not stop the server for everyone. A conditional breakpoint <code>customerId === 18342</code> on your local copy with a copy of that customer's data, or a logpoint on staging if the team allows attaching there, finds it without disturbing anyone. Write the condition into the ticket comment; the next person can reuse it.</p>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<ol>
<li>In LabFlow, set the conditional breakpoint <code>nguoiId === 42</code>, reproduce the 500, find the booking with <code>ketThuc = null</code>, apply the fix and add a test (user with one open booking ⇒ only closed hours are counted).</li>
<li>Create <code>tao-csv.js</code>, <code>nhap-phong.js</code> in <code>~/dbg-lab/ch3/3-2</code>. Stop at row 500 three ways: condition on <code>i</code>, hit count <code>500</code>, condition on the symptom. Which one would still work if the bad row moved to 731?</li>
<li>Add a logpoint that prints every 100th row plus any row where <code>sucChua</code> is not a number. Did you edit the file?</li>
<li>Run <code>dat-phong.js</code> with only Uncaught, then with Caught as well. Write the root cause and the root fix in two sentences.</li>
</ol>
<p><strong>Done when:</strong> user 42 returns <code>{"tongGio":2}</code> with a test, and your log names which breakpoint kind found each of the three bugs and why that kind.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">conditional breakpoint</span><span class="v">Stops only when an expression is truthy; evaluated by V8 in your program.</span></div>
  <div class="kv"><span class="k">hit count</span><span class="v">Stops on the N-th hit; counted by the debugger, so slower in hot loops.</span></div>
  <div class="kv"><span class="k">logpoint</span><span class="v">Prints a message with {expressions} instead of stopping.</span></div>
  <div class="kv"><span class="k">caught / uncaught exception</span><span class="v">Stop on every throw / only when nothing catches it.</span></div>
  <div class="kv"><span class="k">debugger;</span><span class="v">Statement that pauses when a debugger is attached.</span></div>
  <div class="kv"><span class="k">non-null assertion (!)</span><span class="v">TypeScript "trust me" that silences a null warning — a common hiding place for bugs.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Choose the breakpoint by the question: which user, which row, how did the value evolve, where was it thrown.</li>
<li>Condition on the symptom when you do not know the index.</li>
<li>Logpoints give history without stopping and without editing code.</li>
<li>Caught-exception breakpoints reveal errors that try/catch swallows.</li>
<li>Conditions run inside your program: no <code>=</code>, no side effects; a throwing condition never stops (VS Code only logs "Breakpoint condition error").</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Bắt debugger chỉ dừng đúng chỗ có lỗi</h2>
<p class="lead">Breakpoint thường dừng mỗi lần dòng đó chạy. Ở một dòng trong vòng lặp 1000 lượt, hay trong một route mọi người dùng đều gọi, thì vô dụng: bạn bấm F5 hàng trăm lần và lỡ mất đúng trường hợp cần xem. Bài này dạy năm loại breakpoint còn lại, mỗi loại là một cách nói với debugger <em>khoảnh khắc nào</em> bạn quan tâm — và dùng chúng để sửa thật hai lỗi.</p>

<h3>Liên tưởng đời thường: bẫy ảnh trong rừng</h3>
<p>Nhà nghiên cứu động vật không quay cả khu rừng 24 giờ rồi ngồi xem hết. Họ đặt bẫy ảnh chỉ chụp khi có vật to và ấm đi qua. Breakpoint thường là quay mọi thứ; breakpoint điều kiện là bẫy ảnh; logpoint là người đếm ở cổng, ghi lại ai đi qua mà không chặn ai.</p>

<h3>Sáu loại — mỗi loại trả lời câu hỏi nào</h3>
<table>
<thead><tr><th>Loại (VS Code: chuột phải vào lề trái)</th><th>Dừng khi</th><th>Dùng cho</th></tr></thead>
<tbody>
<tr><td>Breakpoint dòng</td><td>Dòng đó chạy</td><td>Code chạy một lần mỗi request/test</td></tr>
<tr><td>Điều kiện (Expression)</td><td>Dòng chạy <em>và</em> biểu thức đúng</td><td>Một người dùng, một id, một giá trị hỏng giữa hàng nghìn</td></tr>
<tr><td>Đếm lượt (Hit Count)</td><td>Dòng đã chạy N lần (<code>500</code>, <code>&gt;= 500</code>, <code>% 100</code>)</td><td>"Lỗi ở lần gọi thứ 500" khi không có gì khác để lọc</td></tr>
<tr><td>Logpoint</td><td>Không bao giờ — in một thông điệp (<code>i={i} tong={tong}</code>)</td><td>Theo dõi giá trị theo thời gian mà không dừng, không sửa code</td></tr>
<tr><td>Ngoại lệ (Caught / Uncaught)</td><td>Có lỗi bị ném ra</td><td>Lỗi bị try/catch nuốt; chương trình sập mà không biết ở đâu</td></tr>
<tr><td>Hàm (Function)</td><td>Một hàm theo tên được gọi</td><td>Không có cho Node trong VS Code — xem bên dưới</td></tr>
</tbody>
</table>

<h3>1. Điều kiện: chỉ dừng với người dùng 42</h3>
<p>Quay lại lỗi 500 của LabFlow ở bài 3.1. Code:</p>
${MA_GIO}
<p>Breakpoint thường ở dòng 8 sẽ dừng với mọi người dùng, mọi lượt đặt. Chuột phải dòng 8 → <em>Add Conditional Breakpoint</em> → Expression → <code>nguoiId === 42</code>:</p>
${OUT_DK}
<p>Request đầu (người 7) chạy thẳng qua; request thứ hai dừng. Trong Debug Console bạn hỏi đúng những gì lẽ ra phải in ra: người 42 có hai lượt đặt, lượt thứ hai chưa có giờ kết thúc. Đó là nguyên nhân gốc: một lượt đặt còn đang mở. Để ý dấu <code>!</code> trong <code>d.ketThuc!</code> — cách TypeScript nói "tin tôi đi, không null đâu". Bỏ nó ra thì thấy trình biên dịch đã biết từ đầu:</p>
${OUT_SUA_GIO}
<p>Bản sửa là một quyết định nghiệp vụ viết thành code (lượt đang mở được tính khi người đó trả phòng), không phải "thêm try/catch". Trong ticket thật, bạn xác nhận quy tắc đó với BA trước khi merge.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>=</code> thay vì <code>===</code>.</strong> Điều kiện <code>nguoiId = 42</code> là phép <em>gán</em>: luôn đúng, nên lần nào cũng dừng — và nó gán thật <code>nguoiId</code> bằng 42 trong chương trình đang chạy, nên các dòng sau đọc dữ liệu người 42 cho bất kỳ ai gọi. Điều kiện chạy bên trong chương trình của bạn; đừng để nó có tác dụng phụ.</p></div>

<h3>2. Dòng thứ 500 trong 1000: điều kiện theo chỉ số, hoặc theo triệu chứng</h3>
${MA_NHAP}
<p>Một dòng trong một nghìn làm tổng thành <code>NaN</code>. Hai cách dừng đúng dòng. Nếu biết <em>khi nào</em> (dòng 500, chỉ số 499), đưa chỉ số vào điều kiện:</p>
${OUT_500}
<p>Tốt hơn khi không biết khi nào: đưa <em>triệu chứng</em> vào điều kiện. Ở đây triệu chứng là "dòng này sinh ra NaN":</p>
${OUT_TRIEU}
<p>Phòng hành chính gõ <code>30 chỗ</code> trong Excel. Chỗ sửa đúng là nơi dữ liệu đi vào (kiểm khi nhập, từ chối dòng đó kèm số dòng), không phải ở phép cộng.</p>
<p><strong>Đếm lượt hay điều kiện.</strong> Trong VS Code, <em>Hit Count</em> nhận <code>500</code>, <code>== 500</code>, <code>&gt;= 500</code>, <code>&lt; 3</code> hoặc <code>% 100</code> (đúng mẫu js-debug 1.117 chấp nhận; khác đi sẽ bị từ chối với "Invalid hit condition"). Hai điều cần biết: việc đếm do VS Code làm, nên V8 phải dừng rồi chạy lại ở <em>mỗi</em> lượt — chậm hẳn trong vòng lặp nóng so với điều kiện do V8 tự đánh giá; và ở phiên bản này, nếu một breakpoint có cả biểu thức lẫn đếm lượt thì biểu thức được dùng. Có chỉ số thì ưu tiên điều kiện theo <code>i</code>.</p>

<h3>3. Logpoint: in ra mà không sửa code, không dừng</h3>
<p>Chuột phải → <em>Add Logpoint</em> → thông điệp <code>i={i} sucChua={p.sucChua} tong={tong}</code>. Biểu thức trong <code>{}</code> được tính mỗi lần; dòng in ra Debug Console; chương trình không bao giờ dừng. Bên dưới, logpoint là một breakpoint điều kiện mà điều kiện vừa in vừa trả về false — nhìn thấy rõ ở bản tương đương dòng lệnh:</p>
${OUT_LOG}
<p>Đọc log đã là một lần chia đôi: tổng còn là số ở 499 và thành NaN từ 500. Dùng logpoint khi việc dừng làm đổi hành vi (timeout, WebSocket bị ngắt, race) hoặc khi bạn cần lịch sử của một giá trị chứ không phải một ảnh chụp. Không có gì phải xoá trước khi commit — logpoint nằm trong VS Code, không nằm trong code.</p>

<h3>4. Breakpoint ngoại lệ: bắt thứ try/catch giấu đi</h3>
${MA_CH}
<p>Quy định là "mở tới 21 giờ, tối đa 3 giờ", vậy mà yêu cầu 18 giờ + 3 giờ bị từ chối với cấu hình nói 17 giờ và 2 giờ — cấu hình dự phòng. Không có lỗi nào được in ra. Trong khung BREAKPOINTS có hai ô:</p>
${OUT_EX}
<ul>
<li><strong>Uncaught Exceptions</strong>: chỉ dừng khi không có <code>catch</code> nào xử lý lỗi (hoặc promise bị từ chối mà không ai bắt). Cứ bật nó khi phát triển.</li>
<li><strong>Caught Exceptions</strong>: dừng ở mọi <code>throw</code>, kể cả đã được bắt. Đây là công cụ cho "nó lặng lẽ làm sai". Có thể ồn (thư viện tự ném rồi tự bắt bên trong); cả hai ô đều nhận điều kiện kiểu <code>error.name == "SyntaxError"</code>, và skipFiles ở bài 3.3 giấu các lần ném trong thư viện.</li>
</ul>
<p>Nguyên nhân gốc: dấu phẩy thừa sau <code>"toiDaGioMoiLuot": 3</code> — JSON không phải JavaScript. Sửa gốc: đừng nuốt lỗi; báo lỗi rõ ngay khi khởi động (<code>throw new Error('cau-hinh.json hỏng: ' + e.message)</code>), vì chạy với cấu hình sai còn tệ hơn không chạy.</p>

<h3>5. Breakpoint hàm — và dùng gì thay</h3>
<p>Debugger Java và C# dừng được "mỗi khi <code>tinhTien</code> được gọi" mà không cần mở tệp. Debugger JavaScript của VS Code không có tính năng này cho Node: danh sách khả năng của nó ghi <code>supportsFunctionBreakpoints: false</code> (đã kiểm ở js-debug 1.117). Cách thay: mở hàm (Ctrl+T / Go to Symbol) và đặt breakpoint dòng ở dòng đầu thân hàm; hoặc tạm viết <code>debugger;</code> — câu lệnh này dừng khi có debugger gắn vào và không làm gì khi không có. Xoá trước khi commit (luật <code>no-debugger</code> của ESLint bắt những chỗ quên).</p>

<h3>Những lần điều kiện hỏng im lặng</h3>
<ul>
<li>Điều kiện mà <em>ném lỗi</em> (dùng biến chưa tồn tại ở dòng đó) bị coi là false. VS Code bọc điều kiện của bạn trong <code>try { … } catch</code> và in <code>Breakpoint condition error: …</code> ra Debug Console — rất dễ lẫn giữa các output khác; công cụ trần như <code>node inspect</code> thì không in gì. Nếu breakpoint điều kiện không bao giờ dừng, tìm dòng đó, hoặc thử biểu thức trong Debug Console khi đang dừng ở một breakpoint thường cùng dòng.</li>
<li>Đặt breakpoint điều kiện ở một dòng <em>trong</em> thân vòng lặp, không đặt ở dòng <code>for (…)</code> — ở dòng đầu vòng lặp, biến của vòng lặp có thể chưa tồn tại.</li>
</ul>

<h3>Tình huống đi làm</h3>
<p>Bộ phận hỗ trợ chuyển tới: "Khách #18342 thấy tổng hoá đơn sai; khách khác bình thường." Trên môi trường dev/staging dùng chung, bạn không được dừng server của cả nhóm. Breakpoint điều kiện <code>customerId === 18342</code> trên bản chạy ở máy mình với bản sao dữ liệu của khách đó, hoặc logpoint trên staging nếu nhóm cho phép gắn debugger ở đó, tìm ra lỗi mà không làm phiền ai. Ghi điều kiện vào bình luận ticket; người sau dùng lại được.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<ol>
<li>Trong LabFlow, đặt breakpoint điều kiện <code>nguoiId === 42</code>, tái hiện lỗi 500, tìm lượt đặt có <code>ketThuc = null</code>, áp bản sửa và thêm một test (người có một lượt đang mở ⇒ chỉ tính giờ của các lượt đã đóng).</li>
<li>Tạo <code>tao-csv.js</code>, <code>nhap-phong.js</code> trong <code>~/dbg-lab/ch3/3-2</code>. Dừng ở dòng 500 theo ba cách: điều kiện theo <code>i</code>, đếm lượt <code>500</code>, điều kiện theo triệu chứng. Cách nào vẫn dùng được nếu dòng hỏng chuyển sang 731?</li>
<li>Thêm một logpoint in mỗi dòng thứ 100 và mọi dòng mà <code>sucChua</code> không phải số. Bạn có sửa tệp không?</li>
<li>Chạy <code>dat-phong.js</code> chỉ với Uncaught, rồi thêm Caught. Viết nguyên nhân gốc và cách sửa gốc trong hai câu.</li>
</ol>
<p><strong>Đạt khi:</strong> người 42 trả về <code>{"tongGio":2}</code> và có test, và nhật ký ghi loại breakpoint nào tìm ra mỗi lỗi trong ba lỗi, vì sao chọn loại đó.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">conditional breakpoint (breakpoint điều kiện)</span><span class="v">Chỉ dừng khi biểu thức đúng; V8 tự đánh giá trong chương trình của bạn.</span></div>
  <div class="kv"><span class="k">hit count (đếm lượt)</span><span class="v">Dừng ở lượt thứ N; debugger đếm nên chậm trong vòng lặp nóng.</span></div>
  <div class="kv"><span class="k">logpoint</span><span class="v">In một thông điệp có {biểu thức} thay vì dừng.</span></div>
  <div class="kv"><span class="k">caught / uncaught exception</span><span class="v">Dừng ở mọi lần ném / chỉ khi không ai bắt.</span></div>
  <div class="kv"><span class="k">debugger;</span><span class="v">Câu lệnh tạm dừng khi có debugger gắn vào.</span></div>
  <div class="kv"><span class="k">non-null assertion (!)</span><span class="v">"Tin tôi đi" của TypeScript, bịt cảnh báo null — chỗ lỗi hay trốn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chọn loại breakpoint theo câu hỏi: người dùng nào, dòng nào, giá trị biến đổi ra sao, lỗi bị ném ở đâu.</li>
<li>Không biết chỉ số thì đặt điều kiện theo triệu chứng.</li>
<li>Logpoint cho lịch sử giá trị mà không dừng, không sửa code.</li>
<li>Breakpoint ngoại lệ "caught" lộ ra lỗi mà try/catch nuốt mất.</li>
<li>Điều kiện chạy bên trong chương trình: không dùng <code>=</code>, không tác dụng phụ; điều kiện ném lỗi thì không bao giờ dừng (VS Code chỉ ghi "Breakpoint condition error").</li>
</ul>
${NGUON}
</div>
`,
};
