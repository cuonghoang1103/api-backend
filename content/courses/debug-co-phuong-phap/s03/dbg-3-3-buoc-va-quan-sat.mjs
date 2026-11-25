/**
 * 3.3 — Đi từng bước và quan sát (soạn 24/11/2026). Output chạy THẬT trên Linux · Node v22.22.2 · Express 5.3.0 · Prisma 6.19.3.
 * Phiên debugger: client CDP cdp.mjs (gửi đúng Debugger.stepInto/stepOver/stepOut/setBlackboxPatterns/restartFrame như VS Code)
 * + `node inspect` (watch, next). Restart frame bị V8 từ chối trên hàm async ("Restarting frame failed") — chạy thật.
 * Mã: scratchpad/dbg/lab/app (LabFlow) + ch3/3-2/nhap-phong.js.
 */
import { nguon, lienKet } from '../_chung.mjs';

const MA_ROUTE = `<pre><code class="language-ts">// src/routes/phong.ts
phongRouter.get('/phong/:id/lich', async (req, res) =&gt; {
  const phongId = Number(req.params.id);
  const ngay = String(req.query.ngay);
  const ds = await lichTrongNgay(phongId, ngay);          // line 9
  res.json({ phongId, ngay, soLuot: ds.length, ds });
});

// src/services/lichPhong.ts
export async function lichTrongNgay(phongId: number, ngay: string) {
  const tuLuc = new Date(ngay);                            // line 5
  const denLuc = new Date(ngay);                           // line 6
  return prisma.datLich.findMany({                         // line 7
    where: { phongId, batDau: { gte: tuLuc, lt: denLuc } },
    orderBy: { batDau: 'asc' },
  });
}</code></pre>`;

const OUT_BUOC = `<div class="out">● breakpoint src/routes/phong.ts:9  → dist/routes/phong.js:10 (1 vị trí)
$ curl -s 'http://127.0.0.1:43000/api/phong/1/lich?ngay=2026-11-25'
⏸  dừng (other) tại src/routes/phong.ts:9  — hàm (ẩn danh)
  › phongId
    1
  › ngay
    "2026-11-25"
  [step into]                                   F11
⏸  dừng (step) tại src/services/lichPhong.ts:5  — hàm lichTrongNgay
  [step over]                                   F10
⏸  dừng (step) tại src/services/lichPhong.ts:6  — hàm lichTrongNgay
  [step over]                                   F10
⏸  dừng (step) tại src/services/lichPhong.ts:7  — hàm lichTrongNgay
  › tuLuc.toISOString()
    "2026-11-25T00:00:00.000Z"
  › denLuc.toISOString()
    "2026-11-25T00:00:00.000Z"</div>`;

const OUT_PRISMA = `<div class="out">  [step into]                                   F11 on "return prisma.datLich.findMany(…)"
⏸  dừng (step) tại node_modules/@prisma/client/runtime/library.js:29  — hàm get
  #0 get  node_modules/@prisma/client/runtime/library.js:29
  #1 lichTrongNgay  src/services/lichPhong.ts:7
  #2 (ẩn danh)  src/routes/phong.ts:9
  [step out]                                    Shift+F11
⏸  dừng (step) tại node_modules/@prisma/client/runtime/library.js:29  — hàm get
$ wc -c node_modules/@prisma/client/runtime/library.js;  awk 'NR==29{print length($0)}' …
202499          ← one file, 200 KB
16591           ← line 29 alone is 16,591 characters (minified)</div>`;

const OUT_SKIP = `<div class="out">skipFiles → setBlackboxPatterns ["/node_modules/","^node:"]
● breakpoint src/services/lichPhong.ts:7  → dist/services/lichPhong.js:9 (1 vị trí)
$ curl -s 'http://127.0.0.1:43000/api/phong/1/lich?ngay=2026-11-25'
⏸  dừng (other) tại src/services/lichPhong.ts:7  — hàm lichTrongNgay
  [step into]                                   F11 — library frames are skipped
⏸  dừng (step) tại src/services/lichPhong.ts:10  — hàm lichTrongNgay
  #0 lichTrongNgay  src/services/lichPhong.ts:10
  #1 (ẩn danh)  src/routes/phong.ts:9
  › new Date(new Date(ngay).getTime() + 24*3600*1000).toISOString()
    "2026-11-26T00:00:00.000Z"</div>`;

const SKIP_JSON = `<pre><code class="language-json">// in each configuration of launch.json
"skipFiles": [
  "&lt;node_internals&gt;/**",                  // Node's own code: node:events, node:internal/…
  "\${workspaceFolder}/node_modules/**"     // every library
]</code></pre>`;

const OUT_SUA = `<div class="out"># fix in lichPhong.ts — the range is [00:00 of that day, 00:00 of the next day)
  const denLuc = new Date(tuLuc.getTime() + 24 * 60 * 60 * 1000);   // start of the NEXT day (exclusive)
$ npx tsc &amp;&amp; node dist/app.js &amp;
$ curl -s 'http://127.0.0.1:43000/api/phong/1/lich?ngay=2026-11-25'
{"phongId":1,"ngay":"2026-11-25","soLuot":2,"ds":[{"id":1,"phongId":1,"nguoiId":7,"batDau":"2026-11-25T01:00:00.000Z",…},{"id":2,…,"batDau":"2026-11-25T06:00:00.000Z",…}]}</div>`;

const OUT_WATCH = `<div class="out">debug&gt; sb('nhap-phong.js', 13, 'i &gt;= 498')
debug&gt; cont
break in nhap-phong.js:13
debug&gt; watch('i')
debug&gt; watch('p.sucChua')
debug&gt; watch('tong')
debug&gt; next
step in nhap-phong.js:11
Watchers:
  0: i = 498
  1: p.sucChua =
    ReferenceError: p is not defined        ← on the "for" line, p does not exist yet
  2: tong = 14970
debug&gt; next
step in nhap-phong.js:12
Watchers:
  0: i = 499
  1: p.sucChua = '30'                       ← line 12 has not run yet: this is still the previous row (P499)
  2: tong = 14970
debug&gt; next
step in nhap-phong.js:13
Watchers:
  0: i = 499
  1: p.sucChua = '30 chỗ'
  2: tong = 14970</div>`;

const OUT_EVAL = `<div class="out">⏸  dừng (other) tại nhap-phong.js:13  — hàm tongChoNgoi
  › tongChoNgoi(dsPhong.slice(0, 499))
    lỗi: ReferenceError: tongChoNgoi is not defined          ← evaluated in frame #0
  › [frame #1] tongChoNgoi(ds.slice(0, 499))
    14970                                                    ← same call, from the caller's frame
  › [frame #1] tongChoNgoi(ds.filter(x =&gt; x.ma !== "P500"))
    29960                                                    ← hypothesis test: without row 500 the total is a number</div>`;

const OUT_RESTART = `<div class="out"># sync function: works
⏸  dừng (other) tại nhap-phong.js:13  — hàm tongChoNgoi
  › tong
    14970
  [restart frame]
⏸  dừng (step) tại nhap-phong.js:10  — hàm tongChoNgoi       ← back to "let tong = 0", same arguments
# async function (lichTrongNgay in LabFlow): refused by V8
  [restart frame] BỊ TỪ CHỐI: Restarting frame failed</div>`;

const NGUON = [
  nguon('🟦', 'VS Code — Debug actions, Call Stack, Watch, Debug Console', 'F10/F11/Shift+F11, chọn frame, Watch, Debug Console REPL.', 'https://code.visualstudio.com/docs/debugtest/debugging#_debug-actions'),
  nguon('🟦', 'VS Code — Skipping uninteresting code (skipFiles)', 'Mẫu glob, <node_internals>, bật/tắt bỏ qua ngay trong Call Stack.', 'https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_skipping-uninteresting-code'),
  nguon('📜', 'CDP — Debugger.setBlackboxPatterns, restartFrame', 'Hai lệnh nằm dưới skipFiles và Restart Frame.', 'https://chromedevtools.github.io/devtools-protocol/v8/Debugger/#method-setBlackboxPatterns'),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-1-3-khoanh-vung', title: 'Bài 1.3 — khoanh vùng theo tầng', sub: 'Step into/over là khoanh vùng theo tầng làm bằng tay: route → service → ORM.', cta: 'Ôn lại →' }),
].join('\n');

export default {
  title: '3.3 — Stepping and inspecting: step into/over/out, watch, debug console|||3.3 — Đi từng bước và quan sát: step into/over/out, watch, debug console',
  slug: 'dbg-3-3-buoc-va-quan-sat',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lần một request LabFlow từ route xuống service rồi tới Prisma: khi nào F11 (step into), F10 (step over), Shift+F11 (step out); step into rơi vào 200 KB mã Prisma đã nén ⇒ skipFiles (setBlackboxPatterns) đưa bạn về code của mình; Variables, Watch, Debug Console — kiểm giả thuyết bằng một biểu thức trước khi sửa; gọi hàm khi đang dừng và vì sao "is not defined" (chọn frame cha); Restart Frame chạy với hàm thường, bị từ chối với hàm async. Sửa lỗi lịch rỗng (khoảng ngày [00:00, 00:00)).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Walk a request from the route down to the database — one step at a time</h2>
<p class="lead">You paused. Now what? Three buttons move you through the code, three panels show you its state, and one console lets you ask questions in the middle of execution. Used well, they turn "where does correct become wrong?" (Chapter 1's isolate step) into a few minutes of walking. Used badly, you get lost in 200 KB of library code. This lesson does both on LabFlow's empty-schedule bug, then fixes it.</p>

<h3>An everyday picture: following a parcel through the post</h3>
<p>Your parcel did not arrive. You can ask each post office in turn, "did it arrive here, did it leave?" (step over: one office at a time), go into one office and check each counter (step into), or say "I have seen enough of this office, show me where it went next" (step out). You do not inspect the conveyor belts of the airline that carried it — that is someone else's system (skipFiles).</p>

<h3>The three step buttons</h3>
<table>
<thead><tr><th>Button</th><th>Key</th><th>Does</th><th>Use when</th></tr></thead>
<tbody>
<tr><td>Continue</td><td>F5</td><td>Run until the next breakpoint</td><td>You are done here</td></tr>
<tr><td>Step Over</td><td>F10</td><td>Run this line completely, stop at the next line</td><td>You trust the function called on this line</td></tr>
<tr><td>Step Into</td><td>F11</td><td>Go inside the function called on this line</td><td>The wrong value comes <em>out of</em> that function</td></tr>
<tr><td>Step Out</td><td>Shift+F11</td><td>Finish this function, stop in the caller</td><td>You went in by mistake, or you have seen enough</td></tr>
</tbody>
</table>
<p>Rule of thumb: step over by default; step into only when the value <em>after</em> a line is already wrong and the line calls your own code.</p>

<h3>Walking the empty-schedule bug</h3>
${MA_ROUTE}
<p>Breakpoint on the route line that calls the service, then the curl from the ticket:</p>
${OUT_BUOC}
<p>Isolation done in four steps: the route receives the right input (room 1, "2026-11-25"); inside the service, the two ends of the range are <em>the same instant</em>. A range <code>batDau &gt;= T AND batDau &lt; T</code> is empty by definition. Hypothesis: <code>denLuc</code> should be the start of the next day.</p>

<h3>Stepping into a library: the trap</h3>
<p>Curious what Prisma does with the range, you press F11 on line 7:</p>
${OUT_PRISMA}
<p>You land in a minified 200 KB file whose line 29 is sixteen thousand characters long, inside a property getter. Step out does not help — you just land in the next getter. This is how many interns lose an afternoon. Two facts: (1) you almost never need to debug a popular library — the bug is in what you <em>pass</em> to it; (2) VS Code can skip library frames for you.</p>

<h3>skipFiles: stay in your own code</h3>
${SKIP_JSON}
<p>VS Code turns <code>skipFiles</code> into a CDP <code>Debugger.setBlackboxPatterns</code> call. Same step, now with library code skipped:</p>
${OUT_SKIP}
<p>F11 now passes over Prisma and stops at the next line of <em>your</em> code. Library frames are also greyed out in the Call Stack and exceptions thrown inside them no longer stop "Caught Exceptions". In the Call Stack you can right-click a frame → <em>Toggle Skipping this File</em> to change it on the fly. Note the last line of the output: the hypothesis tested <em>while paused</em>, before touching the code — the next day's midnight is exactly what we want as the exclusive end.</p>
${OUT_SUA}
<p>Two bookings, as in the seed data. (Which "day" — UTC or Vietnam time, 7 hours apart — is a separate trap; Chapter 8 handles it.)</p>

<h3>The three panels: Variables, Watch, Call Stack</h3>
<ul>
<li><strong>Variables</strong>: everything in scope at the selected frame — Local, Closure, Global. Expand objects; right-click → <em>Set Value</em> to change a value and continue (useful to test "what if this were not null?").</li>
<li><strong>Watch</strong>: expressions re-evaluated at every stop. Put the 2–3 values your hypothesis is about there instead of re-hovering.</li>
<li><strong>Call Stack</strong>: the chain of callers (Chapter 2's stack trace, live). Clicking a lower frame shows <em>its</em> variables — the single most useful click when a bad argument came from the caller.</li>
</ul>
<p>Watch expressions are evaluated in the current frame on every step, which produces confusing moments — know them before they confuse you:</p>
${OUT_WATCH}
<p>On the <code>for</code> line, the loop body's <code>p</code> does not exist yet, so the watch shows an error; on line 12 the assignment has not run yet, so you still see the previous row. Neither is a bug in your code — a watch shows the value <em>before</em> the highlighted line runs.</p>

<h3>Debug Console: ask questions, call functions</h3>
<p>The Debug Console (Ctrl+Shift+Y) evaluates any expression in the selected frame. You can call your own functions to test a hypothesis on the spot:</p>
${OUT_EVAL}
<p>Why "<code>tongChoNgoi is not defined</code>" inside <code>tongChoNgoi</code>? V8 only keeps the outer variables a function actually uses; this function never refers to itself, so from its frame the name is invisible. Select the caller's frame (#1) in the Call Stack and the same call works. Remember: a function you call from the console really runs — if it writes to the database or sends an email, that happens.</p>

<h3>Restart Frame</h3>
<p>Stepped past the interesting line? Right-click a frame → <em>Restart Frame</em> re-runs that function from the top with the same arguments, without restarting the app. Side effects already done (rows inserted, counters increased) are not undone.</p>
${OUT_RESTART}
<p>V8 cannot rewind an <code>async</code> function (its state lives in a suspended promise), so in Express/Prisma code — almost all async — Restart Frame usually fails. Use it on synchronous helpers; for async code, set the breakpoint earlier and send the request again.</p>

<h3>On the job</h3>
<p>Ticket: "Schedule page empty for 25/11". A good intern's comment after 15 minutes: "Paused in <code>lichTrongNgay</code> with room 1 / 2026-11-25: <code>tuLuc</code> and <code>denLuc</code> are both 2026-11-25T00:00Z, so the Prisma filter <code>gte/lt</code> is an empty range. Fix: end = next day 00:00 (exclusive). Test added for a day with 2 bookings." That comment shows the path (route → service), the evidence (two values), the cause and the prevention — and it was produced without a single <code>console.log</code>.</p>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<ol>
<li>Without skipFiles: breakpoint on <code>phong.ts:9</code>, F11 into the service, F11 on the Prisma line. How deep is the Call Stack? Write down the first file you land in.</li>
<li>Add the <code>skipFiles</code> above, repeat. Where does F11 stop now?</li>
<li>Put <code>tuLuc</code>, <code>denLuc</code> and <code>denLuc - tuLuc</code> in Watch. Test the fix expression in the Debug Console before editing.</li>
<li>Apply the fix and write a test (Prisma against the test database, or extract a pure function <code>khoangNgay(ngay)</code> that returns the range and test that — which is easier to test, and why?).</li>
<li>In <code>nhap-phong.js</code>, pause at row 500, try Restart Frame; then try it inside <code>lichTrongNgay</code>. Note the difference.</li>
</ol>
<p><strong>Done when:</strong> the schedule shows 2 bookings, a test protects the range, and your log explains in one sentence why stepping into Prisma was not needed.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">step over / into / out</span><span class="v">Next line / inside the called function / finish this function.</span></div>
  <div class="kv"><span class="k">skipFiles (blackboxing)</span><span class="v">Glob patterns of code the debugger steps over and hides.</span></div>
  <div class="kv"><span class="k">frame</span><span class="v">One function call in the call stack, with its own variables.</span></div>
  <div class="kv"><span class="k">watch expression</span><span class="v">Expression re-evaluated at every pause.</span></div>
  <div class="kv"><span class="k">Debug Console</span><span class="v">REPL running in the selected frame of the paused program.</span></div>
  <div class="kv"><span class="k">restart frame</span><span class="v">Re-run the selected function from its start; not for async functions.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Step over by default, step into only your own code whose result is already wrong, step out when lost.</li>
<li>Library bugs are rare; skipFiles keeps you in your code.</li>
<li>Test the hypothesis in the Debug Console before editing.</li>
<li>"is not defined" while paused: select the frame that actually sees the name.</li>
<li>Restart Frame works for sync functions only; side effects stay done.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Lần một request từ route xuống tận cơ sở dữ liệu — từng bước một</h2>
<p class="lead">Đã dừng được. Giờ làm gì? Ba nút đưa bạn đi qua code, ba khung cho bạn thấy trạng thái, và một console cho bạn hỏi ngay giữa lúc chương trình đang chạy. Dùng đúng, chúng biến câu hỏi "đúng biến thành sai ở đâu?" (bước khoanh vùng của Chương 1) thành vài phút đi bộ. Dùng sai, bạn lạc trong 200 KB mã thư viện. Bài này làm cả hai trên lỗi lịch trống của LabFlow, rồi sửa nó.</p>

<h3>Liên tưởng đời thường: lần theo bưu kiện qua bưu điện</h3>
<p>Bưu kiện của bạn không tới. Bạn có thể hỏi lần lượt từng bưu cục "tới đây chưa, đi chưa?" (step over: từng bưu cục một), vào hẳn một bưu cục kiểm từng quầy (step into), hoặc nói "bưu cục này xem đủ rồi, cho tôi biết nó đi đâu tiếp" (step out). Bạn không đi soi băng chuyền của hãng bay chở nó — đó là hệ thống của người khác (skipFiles).</p>

<h3>Ba nút bước</h3>
<table>
<thead><tr><th>Nút</th><th>Phím</th><th>Làm gì</th><th>Dùng khi</th></tr></thead>
<tbody>
<tr><td>Continue</td><td>F5</td><td>Chạy tới breakpoint kế tiếp</td><td>Chỗ này xem xong</td></tr>
<tr><td>Step Over</td><td>F10</td><td>Chạy trọn dòng này, dừng ở dòng sau</td><td>Bạn tin hàm được gọi trên dòng này</td></tr>
<tr><td>Step Into</td><td>F11</td><td>Đi vào trong hàm được gọi trên dòng này</td><td>Giá trị sai <em>đi ra từ</em> hàm đó</td></tr>
<tr><td>Step Out</td><td>Shift+F11</td><td>Chạy hết hàm này, dừng ở nơi gọi</td><td>Lỡ đi vào, hoặc đã xem đủ</td></tr>
</tbody>
</table>
<p>Quy tắc dễ nhớ: mặc định step over; chỉ step into khi giá trị <em>sau</em> một dòng đã sai và dòng đó gọi code của chính bạn.</p>

<h3>Đi bộ qua lỗi lịch trống</h3>
${MA_ROUTE}
<p>Đặt breakpoint ở dòng route gọi service, rồi chạy lệnh curl trong ticket:</p>
${OUT_BUOC}
<p>Khoanh vùng xong trong bốn bước: route nhận đúng đầu vào (phòng 1, "2026-11-25"); trong service, hai đầu khoảng thời gian là <em>cùng một thời điểm</em>. Khoảng <code>batDau &gt;= T AND batDau &lt; T</code> rỗng theo định nghĩa. Giả thuyết: <code>denLuc</code> phải là đầu ngày hôm sau.</p>

<h3>Step into vào thư viện: cái bẫy</h3>
<p>Tò mò Prisma làm gì với khoảng thời gian, bạn bấm F11 ở dòng 7:</p>
${OUT_PRISMA}
<p>Bạn rơi vào một tệp đã nén 200 KB mà dòng 29 dài mười sáu nghìn ký tự, bên trong một hàm getter. Step out không cứu được — chỉ rơi sang getter kế tiếp. Nhiều thực tập sinh mất cả buổi chiều kiểu này. Hai sự thật: (1) hầu như không bao giờ bạn cần debug một thư viện phổ biến — lỗi nằm ở thứ bạn <em>truyền vào</em> nó; (2) VS Code bỏ qua khung thư viện giúp bạn được.</p>

<h3>skipFiles: ở lại trong code của mình</h3>
${SKIP_JSON}
<p>VS Code biến <code>skipFiles</code> thành lệnh CDP <code>Debugger.setBlackboxPatterns</code>. Cùng bước đó, giờ có bỏ qua code thư viện:</p>
${OUT_SKIP}
<p>F11 giờ đi qua Prisma và dừng ở dòng kế tiếp trong code <em>của bạn</em>. Khung thư viện cũng bị làm mờ trong Call Stack, và ngoại lệ ném bên trong chúng không còn làm "Caught Exceptions" dừng. Trong Call Stack bạn có thể chuột phải một khung → <em>Toggle Skipping this File</em> để đổi ngay lúc đang chạy. Để ý dòng cuối output: giả thuyết được kiểm <em>khi đang dừng</em>, trước khi đụng vào code — nửa đêm ngày hôm sau đúng là đầu mút loại trừ ta cần.</p>
${OUT_SUA}
<p>Hai lượt đặt, đúng như dữ liệu mẫu. ("Ngày" nào — giờ UTC hay giờ Việt Nam, lệch nhau 7 tiếng — là một cái bẫy khác; Chương 8 xử lý.)</p>

<h3>Ba khung: Variables, Watch, Call Stack</h3>
<ul>
<li><strong>Variables</strong>: mọi thứ trong phạm vi ở khung đang chọn — Local, Closure, Global. Mở rộng object; chuột phải → <em>Set Value</em> để đổi giá trị rồi chạy tiếp (hữu ích để thử "nếu cái này không null thì sao?").</li>
<li><strong>Watch</strong>: biểu thức được tính lại ở mỗi lần dừng. Đặt 2–3 giá trị mà giả thuyết của bạn nói tới vào đây thay vì rê chuột lại từng lần.</li>
<li><strong>Call Stack</strong>: chuỗi nơi gọi (stack trace ở Chương 2, nhưng đang sống). Bấm vào khung bên dưới để thấy biến <em>của nó</em> — cú bấm hữu ích nhất khi đối số sai đến từ nơi gọi.</li>
</ul>
<p>Biểu thức Watch được tính ở khung hiện tại sau mỗi bước, nên có những lúc khó hiểu — biết trước để khỏi bối rối:</p>
${OUT_WATCH}
<p>Ở dòng <code>for</code>, biến <code>p</code> của thân vòng lặp chưa tồn tại nên watch báo lỗi; ở dòng 12 phép gán chưa chạy nên bạn vẫn thấy dòng trước. Cả hai đều không phải lỗi trong code của bạn — watch cho thấy giá trị <em>trước khi</em> dòng đang tô sáng chạy.</p>

<h3>Debug Console: đặt câu hỏi, gọi hàm</h3>
<p>Debug Console (Ctrl+Shift+Y) tính bất kỳ biểu thức nào trong khung đang chọn. Bạn gọi được hàm của chính mình để kiểm giả thuyết tại chỗ:</p>
${OUT_EVAL}
<p>Vì sao "<code>tongChoNgoi is not defined</code>" ngay trong <code>tongChoNgoi</code>? V8 chỉ giữ những biến bên ngoài mà hàm thật sự dùng; hàm này không hề nhắc tới chính nó, nên từ khung của nó cái tên đó vô hình. Chọn khung nơi gọi (#1) trong Call Stack thì cùng lời gọi chạy được. Nhớ: hàm bạn gọi từ console chạy thật — nếu nó ghi cơ sở dữ liệu hay gửi email thì việc đó xảy ra thật.</p>

<h3>Restart Frame</h3>
<p>Lỡ bước qua dòng quan trọng? Chuột phải một khung → <em>Restart Frame</em> chạy lại hàm đó từ đầu với cùng đối số, không cần khởi động lại ứng dụng. Tác dụng phụ đã xảy ra (dòng đã chèn, bộ đếm đã tăng) không được hoàn lại.</p>
${OUT_RESTART}
<p>V8 không tua lại được hàm <code>async</code> (trạng thái của nó nằm trong một promise đang treo), nên trong code Express/Prisma — gần như toàn async — Restart Frame thường thất bại. Dùng nó cho hàm phụ đồng bộ; với code async, đặt breakpoint sớm hơn rồi gửi lại request.</p>

<h3>Tình huống đi làm</h3>
<p>Ticket: "Trang lịch trống ngày 25/11". Bình luận của một thực tập sinh giỏi sau 15 phút: "Dừng trong <code>lichTrongNgay</code> với phòng 1 / 2026-11-25: <code>tuLuc</code> và <code>denLuc</code> đều là 2026-11-25T00:00Z, nên bộ lọc Prisma <code>gte/lt</code> là khoảng rỗng. Sửa: đầu mút = 00:00 ngày hôm sau (loại trừ). Đã thêm test cho một ngày có 2 lượt." Bình luận đó cho thấy đường đi (route → service), bằng chứng (hai giá trị), nguyên nhân và cách chặn tái phát — và không có một dòng <code>console.log</code> nào.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<ol>
<li>Chưa có skipFiles: breakpoint ở <code>phong.ts:9</code>, F11 vào service, F11 ở dòng Prisma. Call Stack sâu bao nhiêu? Ghi lại tệp đầu tiên bạn rơi vào.</li>
<li>Thêm <code>skipFiles</code> như trên, làm lại. F11 giờ dừng ở đâu?</li>
<li>Đưa <code>tuLuc</code>, <code>denLuc</code> và <code>denLuc - tuLuc</code> vào Watch. Thử biểu thức sửa trong Debug Console trước khi sửa code.</li>
<li>Áp bản sửa và viết test (Prisma với cơ sở dữ liệu test, hoặc tách hàm thuần <code>khoangNgay(ngay)</code> trả về khoảng rồi test hàm đó — cách nào dễ test hơn, vì sao?).</li>
<li>Trong <code>nhap-phong.js</code>, dừng ở dòng 500, thử Restart Frame; rồi thử bên trong <code>lichTrongNgay</code>. Ghi lại khác biệt.</li>
</ol>
<p><strong>Đạt khi:</strong> trang lịch hiện 2 lượt, có test bảo vệ khoảng ngày, và nhật ký giải thích trong một câu vì sao không cần step vào Prisma.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">step over / into / out</span><span class="v">Sang dòng sau / vào trong hàm được gọi / chạy hết hàm này.</span></div>
  <div class="kv"><span class="k">skipFiles (blackboxing)</span><span class="v">Mẫu glob của code mà debugger bước qua và làm mờ.</span></div>
  <div class="kv"><span class="k">frame (khung)</span><span class="v">Một lời gọi hàm trong call stack, có biến riêng.</span></div>
  <div class="kv"><span class="k">watch expression</span><span class="v">Biểu thức được tính lại ở mỗi lần dừng.</span></div>
  <div class="kv"><span class="k">Debug Console</span><span class="v">REPL chạy trong khung đang chọn của chương trình đang dừng.</span></div>
  <div class="kv"><span class="k">restart frame</span><span class="v">Chạy lại hàm đang chọn từ đầu; không dùng được cho hàm async.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mặc định step over, chỉ step into code của mình khi kết quả của nó đã sai, step out khi lạc.</li>
<li>Lỗi trong thư viện rất hiếm; skipFiles giữ bạn ở trong code của mình.</li>
<li>Kiểm giả thuyết trong Debug Console trước khi sửa code.</li>
<li>"is not defined" khi đang dừng: chọn khung thật sự nhìn thấy cái tên đó.</li>
<li>Restart Frame chỉ chạy với hàm đồng bộ; tác dụng phụ vẫn đã xảy ra.</li>
</ul>
${NGUON}
</div>
`,
};
