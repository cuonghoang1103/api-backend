/**
 * 2.3 — JavaScript và Node: trace bất đồng bộ, promise bị từ chối, source map (soạn 22/11/2026).
 * Output chạy THẬT /tmp/dbg-lab/ch2/2-3 (Node v26.8.1; TypeScript 5.9.3 của repo để biên dịch; Express 4.22.2 cài vào thư mục lab,
 * cổng 127.0.0.1:18230). Phát hiện khi chạy: lỗi trong route async của Express 4 KHÔNG tới error handler mà làm SẬP cả server
 * (curl exit 52 "empty reply") — đưa vào bài thay cho "request treo" như khung dự kiến.
 */
import { nguon } from '../_chung.mjs';

const MA_ASYNC = `<pre><code class="language-js">// async.js
const cho = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));

async function docHoSo(id) {
  await cho(10);                         // pretend to call the database
  throw new Error(&#96;Không tìm thấy hồ sơ &#36;{id}&#96;);
}
async function xuLyYeuCau() {
  await docHoSo(42);
}
function kieuCu() {                      // old-style callback
  setTimeout(function hetGio() {
    throw new Error('Lỗi trong callback hẹn giờ');
  }, 10);
}

const che = process.argv[2];
if (che === 'await') xuLyYeuCau().catch((e) =&gt; console.log(e.stack));
if (che === 'callback') kieuCu();
if (che === 'quen-catch') xuLyYeuCau();          // nobody catches this promise</code></pre>`;

const OUT_ASYNC = `<div class="out">$ node async.js await
Error: Không tìm thấy hồ sơ 42
    at docHoSo (/private/tmp/dbg-lab/ch2/2-3/async.js:5:9)
    at async xuLyYeuCau (/private/tmp/dbg-lab/ch2/2-3/async.js:8:3)
$ node async.js callback
/private/tmp/dbg-lab/ch2/2-3/async.js:12
    throw new Error('Lỗi trong callback hẹn giờ');
    ^

Error: Lỗi trong callback hẹn giờ
    at Timeout.hetGio [as _onTimeout] (/private/tmp/dbg-lab/ch2/2-3/async.js:12:11)
    at listOnTimeout (node:internal/timers:685:17)
    at process.processTimers (node:internal/timers:618:7)

Node.js v26.8.1</div>`;

const OUT_REJ = `<div class="out">$ node async.js quen-catch; echo "exit=$?"
/private/tmp/dbg-lab/ch2/2-3/async.js:5
  throw new Error(&#96;Không tìm thấy hồ sơ &#36;{id}&#96;);
        ^

Error: Không tìm thấy hồ sơ 42
    at docHoSo (/private/tmp/dbg-lab/ch2/2-3/async.js:5:9)
    at async xuLyYeuCau (/private/tmp/dbg-lab/ch2/2-3/async.js:8:3)

Node.js v26.8.1
exit=1
$ node -e "Promise.reject('het-han-token')"
node:internal/process/promises:322
      new UnhandledPromiseRejection(reason);
      ^

UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "het-han-token".
    at throwUnhandledRejectionsMode (node:internal/process/promises:322:7)
    at processPromiseRejections (node:internal/process/promises:405:17)
    at process.processTicksAndRejections (node:internal/process/task_queues:106:37) {
  code: 'ERR_UNHANDLED_REJECTION'
}</div>`;

const MA_EX = `<pre><code class="language-js">// app.js — Express 4.22.2
const express = require('express');
const app = express();

async function timPhong(ma) {
  if (ma === 'X') throw new Error(&#96;Phòng &#36;{ma} không tồn tại&#96;);
  return { ma, sucChua: 30 };
}

app.get('/phong/:ma', async (req, res) =&gt; {          // async route, NO try/catch
  const phong = await timPhong(req.params.ma);
  res.json(phong);
});

app.use((err, req, res, next) =&gt; {                   // the project's error handler
  console.error('[error handler]', err.message);
  res.status(500).json({ loi: 'Có lỗi, mã tham chiếu ABC123' });
});

app.listen(18230, '127.0.0.1', () =&gt; console.log('Express 4 ở http://127.0.0.1:18230'));</code></pre>`;

const OUT_EX = `<div class="out">$ curl -s http://127.0.0.1:18230/phong/A101
{"ma":"A101","sucChua":30}
$ curl -s -m 5 -w '\\nexit curl=%{exitcode} http=%{http_code}\\n' http://127.0.0.1:18230/phong/X

exit curl=52 http=000
$ cat app.log
Express 4 ở http://127.0.0.1:18230
/private/tmp/dbg-lab/ch2/2-3/express/app.js:5
  if (ma === 'X') throw new Error(&#96;Phòng &#36;{ma} không tồn tại&#96;);
                        ^

Error: Phòng X không tồn tại
    at timPhong (/private/tmp/dbg-lab/ch2/2-3/express/app.js:5:25)
    at /private/tmp/dbg-lab/ch2/2-3/express/app.js:10:23
    at Layer.handle [as handle_request] (/private/tmp/dbg-lab/ch2/2-3/express/node_modules/express/lib/router/layer.js:95:5)
    at next (/private/tmp/dbg-lab/ch2/2-3/express/node_modules/express/lib/router/route.js:149:13)
…

Node.js v26.8.1
$ pgrep -f "node app.js" || echo "server đã chết"
server đã chết</div>`;

const MA_EX_SUA = `<pre><code class="language-js">app.get('/phong/:ma', async (req, res, next) =&gt; {    // fixed: the error goes to the error handler
  try {
    res.json(await timPhong(req.params.ma));
  } catch (err) {
    next(err);
  }
});</code></pre>
<div class="out">$ curl -s -w '  [http=%{http_code}]\\n' http://127.0.0.1:18230/phong/X
{"loi":"Có lỗi, mã tham chiếu ABC123"}  [http=500]
$ curl -s -w '  [http=%{http_code}]\\n' http://127.0.0.1:18230/phong/A101
{"ma":"A101","sucChua":30}  [http=200]
$ cat sua.log
Express 4 ở http://127.0.0.1:18230
[error handler] Phòng X không tồn tại</div>`;

const MA_TS = `<pre><code class="language-ts">// src/tinh-diem.ts
interface BaiNop {
  sinhVien: string;
  diem?: number;            // not graded yet ⇒ no score
}

function hienDiem(diem: number): string {
  return diem.toFixed(1);
}

export function bangDiem(ds: BaiNop[]): string[] {
  return ds.map((b) =&gt; &#96;&#36;{b.sinhVien}: &#36;{hienDiem(b.diem!)}&#96;);
}

console.log(bangDiem([{ sinhVien: 'An', diem: 8.25 }, { sinhVien: 'Binh' }]));</code></pre>
<p><code>tsconfig.json</code> has <code>"outDir": "dist"</code>, <code>"rootDir": "src"</code>, <code>"sourceMap": true</code>; <code>npx tsc -p .</code> writes <code>dist/tinh-diem.js</code> and <code>dist/tinh-diem.js.map</code>.</p>`;

const OUT_TS = `<div class="out">$ node dist/tinh-diem.js
/private/tmp/dbg-lab/ch2/2-3/ts/dist/tinh-diem.js:5
    return diem.toFixed(1);
                ^

TypeError: Cannot read properties of undefined (reading 'toFixed')
    at hienDiem (/private/tmp/dbg-lab/ch2/2-3/ts/dist/tinh-diem.js:5:17)
    at /private/tmp/dbg-lab/ch2/2-3/ts/dist/tinh-diem.js:8:44
    at Array.map (&lt;anonymous&gt;)
    at bangDiem (/private/tmp/dbg-lab/ch2/2-3/ts/dist/tinh-diem.js:8:15)
…
$ node --enable-source-maps dist/tinh-diem.js
/private/tmp/dbg-lab/ch2/2-3/ts/src/tinh-diem.ts:7
  return diem.toFixed(1);
              ^

TypeError: Cannot read properties of undefined (reading 'toFixed')
    at hienDiem (/private/tmp/dbg-lab/ch2/2-3/ts/src/tinh-diem.ts:7:15)
    at &lt;anonymous&gt; (/private/tmp/dbg-lab/ch2/2-3/ts/src/tinh-diem.ts:11:42)
    at Array.map (&lt;anonymous&gt;)
    at bangDiem (/private/tmp/dbg-lab/ch2/2-3/ts/src/tinh-diem.ts:11:13)
    at Object.&lt;anonymous&gt; (/private/tmp/dbg-lab/ch2/2-3/ts/src/tinh-diem.ts:14:13)</div>`;

const NGUON = [
  nguon('🟢', 'Node.js CLI — --unhandled-rejections', 'Chế độ mặc định "throw": promise bị từ chối mà không ai bắt sẽ làm tiến trình thoát.', 'https://nodejs.org/api/cli.html#--unhandled-rejectionsmode'),
  nguon('🟢', 'Node.js CLI — --enable-source-maps', 'Bật source map để stack trace trỏ về tệp gốc (.ts).', 'https://nodejs.org/api/cli.html#--enable-source-maps'),
  nguon('🚂', 'Express — Error handling', 'Express 4 phải chuyển lỗi async bằng next(err); Express 5 tự bắt promise bị từ chối.', 'https://expressjs.com/en/guide/error-handling.html'),
].join('\n');

export default {
  title: '2.3 — JavaScript and Node: async traces, unhandled rejections, source maps|||2.3 — JavaScript và Node: trace bất đồng bộ, promise bị từ chối, source map',
  slug: 'dbg-2-3-javascript',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vì sao await giữ được khung gọi còn callback hẹn giờ thì mất; promise bị từ chối không ai bắt làm sập tiến trình (exit 1); lỗi trong route async của Express 4 không tới error handler mà làm chết cả server — chạy thật, kèm bản sửa; TypeScript: trace trỏ về .js cho tới khi bật --enable-source-maps.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>JavaScript traces lie by omission — learn what they leave out</h2>
<p class="lead">Java prints everything; JavaScript prints only what is on the stack <em>right now</em>. With asynchronous code, the function that started the work may have finished long ago, so it is simply not there. Add TypeScript compiled to JavaScript and the line numbers point to a file you never wrote. This lesson shows each gap on real Node.js output, and the switch or habit that closes it — including an Express bug that kills a whole server.</p>

<h3>An everyday picture: a parcel handed between couriers</h3>
<p>You give a parcel to courier A, who hands it to B at the depot, who gives it to C for delivery. If C drops it, C's report says "dropped at your door" — it does not list A and B unless the company records the hand-offs. A callback is a hand-off without a record. <code>await</code> is a hand-off that Node does record.</p>

<h3>1. Async traces: await keeps the chain, callbacks lose it</h3>
${MA_ASYNC}
${OUT_ASYNC}
<p>With <code>await</code>, Node adds <code>at async xuLyYeuCau</code> — the caller is still visible even though it was suspended. With the timer callback, the trace starts at <code>Timeout.hetGio</code> and goes straight into Node's timer internals: <code>kieuCu</code>, which scheduled the timer, is gone. When you see a trace whose only frame of yours is a callback, ask "who registered this callback?" and search for its name. Prefer <code>async</code>/<code>await</code> in new code partly for this reason.</p>

<h3>2. Unhandled rejections crash the process</h3>
<p>A promise that rejects with nobody listening (no <code>await</code> in a try, no <code>.catch()</code>) is an <strong>unhandled rejection</strong>. Since Node 15 the default mode is <code>throw</code>: the whole process exits.</p>
${OUT_REJ}
<p>Two shapes to recognise. If the rejection reason is an <code>Error</code>, Node prints its stack, so you see where it was <em>thrown</em>. If it is anything else — a string, as in the second run — you get <code>UnhandledPromiseRejection … rejected with the reason "het-han-token"</code> and a stack made only of Node internals: no file of yours at all. That is one more reason to always reject with <code>new Error(…)</code>, never with a bare string.</p>

<h3>3. The OJT classic: an Express error that never reaches the error handler</h3>
<p>Many Node projects you will join still run Express 4. Here is a typical route plus the project's error handler, which is supposed to log and return a friendly 500:</p>
${MA_EX}
${OUT_EX}
<p>Read the evidence in order. The client did not get a 500 — it got <strong>nothing</strong> (curl exit code 52, "empty reply from server"). The <code>[error handler]</code> line never appears in the log. Instead the log shows the error's stack and <code>Node.js v26.8.1</code> — the signature of a crash — and the server process is gone. Every other user was disconnected too. Cause: Express 4 calls your handler but does not look at the promise it returns, so a rejection inside an <code>async</code> handler becomes an unhandled rejection (section 2). The fix is to pass the error to <code>next</code> (or upgrade to Express 5, which forwards rejected promises to the error handler itself):</p>
${MA_EX_SUA}
<div class="pitfall co-tieu-de"><p><strong>Trap — "the error handler is broken".</strong> The error handler is fine; it was never called. When an expected log line is missing, ask "was this code reached at all?" before asking "why did it behave wrongly?".</p></div>

<h3>4. TypeScript: traces point to the compiled file until you turn on source maps</h3>
${MA_TS}
${OUT_TS}
<p>Without source maps the trace says <code>dist/tinh-diem.js:5:17</code>: a generated file, with the interface removed and lines shifted. With <code>--enable-source-maps</code>, Node reads the <code>.map</code> file and every frame points to <code>src/tinh-diem.ts</code> — line 7 is exactly <code>return diem.toFixed(1);</code>. Notice also the real cause: the <code>!</code> in <code>b.diem!</code> told the compiler "trust me, this is not undefined", and it was a lie for Binh, who has not been graded. Tools like <code>tsx</code> and <code>ts-node</code> enable source maps for you; a plain <code>node dist/…</code> in production does not.</p>
<p>The browser has the same problem with minified bundles (a whole app on one line, <code>a.b is undefined at main.4f3c.js:1:58231</code>). DevTools applies source maps automatically when the build provides them — Chapter 5 shows it.</p>
<div class="callout warn"><p><strong>🕵️ Hacker's corner — public source maps.</strong> A <code>.map</code> file contains your original source code. If your production server serves <code>main.js.map</code> publicly, anyone can read your front-end code, comments included — helpful for an attacker looking for hidden admin routes or keys you should not have put there. Common practice: generate source maps, upload them to your error-reporting tool, and do not serve them publicly (or accept that front-end code is public anyway and never put secrets in it).</p></div>

<h3>🧪 Practice (20 min) — four gaps, four fixes</h3>
<div class="callout ok">
<ol>
<li>Run <code>async.js</code> with <code>await</code> and <code>callback</code>. Write which of your functions is missing from the second trace, and why.</li>
<li>Run <code>quen-catch</code> and the string rejection. Change the string rejection to <code>Promise.reject(new Error('het-han-token'))</code>: what appears in the trace now?</li>
<li>In <code>~/dbg-lab/ch2/2-3/express</code>, run <code>npm init -y &amp;&amp; npm install express@4</code>, create <code>app.js</code>, reproduce the crash with curl, then apply the <code>next(err)</code> fix and prove the server survives.</li>
<li>Compile <code>tinh-diem.ts</code> with source maps and compare both traces. Then fix the real cause (handle missing scores) without using <code>!</code>.</li>
</ol>
<p><strong>Done when:</strong> you can say why <code>kieuCu</code> is missing; your Error-based rejection now shows where it was created (<code>at [eval]:1:16</code> for <code>node -e</code>); curl to <code>/phong/X</code> returns <code>500</code> with the friendly body and a second request still gets <code>200</code>; and the TypeScript trace points to <code>src/tinh-diem.ts:7</code> before your final fix.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">async stack trace</span><span class="v">A trace that includes <code>at async …</code> frames for awaited callers.</span></div>
  <div class="kv"><span class="k">callback</span><span class="v">A function you hand over to be called later; its caller is not in the trace.</span></div>
  <div class="kv"><span class="k">unhandled rejection</span><span class="v">A rejected promise nobody catches; Node exits by default.</span></div>
  <div class="kv"><span class="k">error-handling middleware</span><span class="v">Express function <code>(err, req, res, next)</code> that turns errors into responses.</span></div>
  <div class="kv"><span class="k">source map</span><span class="v">A <code>.map</code> file linking generated code back to the original source.</span></div>
  <div class="kv"><span class="k">non-null assertion (!)</span><span class="v">TypeScript "trust me, not null/undefined" — unchecked at run time.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>JavaScript traces show only the current stack: <code>await</code> keeps <code>at async</code> callers, callbacks do not.</li>
<li>An unhandled rejection exits the process; reject with <code>Error</code> objects so the trace shows your file.</li>
<li>Express 4 does not catch errors from <code>async</code> handlers: use <code>try/catch</code> + <code>next(err)</code> or Express 5.</li>
<li>A missing expected log line means "not reached", not "behaved wrongly".</li>
<li>TypeScript: <code>--enable-source-maps</code> makes traces point to <code>.ts</code>; do not serve source maps publicly by accident.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Trace JavaScript nói dối bằng cách bỏ sót — học xem nó bỏ sót gì</h2>
<p class="lead">Java in tất cả; JavaScript chỉ in những gì đang nằm trên ngăn xếp <em>ngay lúc này</em>. Với code bất đồng bộ (async), hàm khởi động công việc có thể đã kết thúc từ lâu, nên đơn giản là nó không có mặt. Thêm TypeScript biên dịch sang JavaScript nữa thì số dòng trỏ vào một tệp bạn chưa bao giờ viết. Bài này cho thấy từng lỗ hổng trên output Node.js thật, cùng công tắc hoặc thói quen lấp nó — kể cả một lỗi Express giết chết cả server.</p>

<h3>Liên tưởng đời thường: bưu kiện chuyển qua nhiều shipper</h3>
<p>Bạn đưa bưu kiện cho shipper A, A giao cho B ở kho, B đưa cho C đi phát. Nếu C làm rơi, biên bản của C ghi "rơi trước cửa nhà bạn" — không có A và B, trừ khi công ty ghi lại các lần bàn giao. Một callback là một lần bàn giao không ghi sổ. <code>await</code> là lần bàn giao mà Node có ghi lại.</p>

<h3>1. Trace bất đồng bộ: await giữ được chuỗi, callback thì mất</h3>
${MA_ASYNC}
${OUT_ASYNC}
<p>Với <code>await</code>, Node thêm dòng <code>at async xuLyYeuCau</code> — nơi gọi vẫn hiện ra dù nó đã tạm dừng. Với callback hẹn giờ, trace bắt đầu ở <code>Timeout.hetGio</code> và đi thẳng vào phần hẹn giờ nội bộ của Node: <code>kieuCu</code>, hàm đã đặt hẹn giờ, biến mất. Khi thấy một trace mà frame duy nhất của bạn là một callback, hãy hỏi "ai đã đăng ký callback này?" rồi tìm theo tên nó. Code mới nên dùng <code>async</code>/<code>await</code>, một phần vì lý do này.</p>

<h3>2. Promise bị từ chối không ai bắt làm sập tiến trình</h3>
<p>Một promise bị từ chối (reject) mà không ai lắng nghe (không <code>await</code> trong try, không <code>.catch()</code>) là một <strong>unhandled rejection</strong>. Từ Node 15, chế độ mặc định là <code>throw</code>: cả tiến trình thoát.</p>
${OUT_REJ}
<p>Hai hình dạng cần nhận ra. Nếu lý do từ chối là một <code>Error</code>, Node in stack của nó, nên bạn thấy chỗ nó bị <em>ném ra</em>. Nếu là thứ khác — một chuỗi, như lần chạy thứ hai — bạn nhận <code>UnhandledPromiseRejection … rejected with the reason "het-han-token"</code> và một stack toàn nội bộ của Node: không có tệp nào của bạn. Thêm một lý do để luôn reject bằng <code>new Error(…)</code>, không bao giờ bằng một chuỗi trần.</p>

<h3>3. Kinh điển khi OJT: lỗi Express không bao giờ tới error handler</h3>
<p>Nhiều dự án Node bạn sẽ vào vẫn chạy Express 4. Đây là một route điển hình cùng error handler của dự án, thứ được kỳ vọng sẽ ghi log và trả về một lỗi 500 thân thiện:</p>
${MA_EX}
${OUT_EX}
<p>Đọc bằng chứng theo thứ tự. Client không nhận 500 — nó nhận <strong>không gì cả</strong> (curl mã thoát 52, "empty reply from server"). Dòng <code>[error handler]</code> không bao giờ xuất hiện trong log. Thay vào đó log hiện stack của lỗi và dòng <code>Node.js v26.8.1</code> — dấu hiệu của một lần sập — và tiến trình server đã mất. Mọi người dùng khác cũng bị ngắt. Nguyên nhân: Express 4 gọi handler của bạn nhưng không nhìn vào promise nó trả về, nên lỗi bên trong một handler <code>async</code> thành unhandled rejection (mục 2). Cách sửa là chuyển lỗi cho <code>next</code> (hoặc nâng lên Express 5, bản tự chuyển promise bị từ chối tới error handler):</p>
${MA_EX_SUA}
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "error handler bị hỏng".</strong> Error handler không sao cả; nó chưa từng được gọi. Khi một dòng log đáng lẽ phải có mà không có, hãy hỏi "đoạn code này có được chạy tới không?" trước khi hỏi "vì sao nó chạy sai?".</p></div>

<h3>4. TypeScript: trace trỏ vào tệp đã biên dịch cho tới khi bật source map</h3>
${MA_TS}
${OUT_TS}
<p>Không có source map, trace ghi <code>dist/tinh-diem.js:5:17</code>: một tệp sinh ra, interface đã bị xoá và các dòng bị dịch đi. Với <code>--enable-source-maps</code>, Node đọc tệp <code>.map</code> và frame nào cũng trỏ về <code>src/tinh-diem.ts</code> — dòng 7 đúng là <code>return diem.toFixed(1);</code>. Để ý cả nguyên nhân thật: dấu <code>!</code> trong <code>b.diem!</code> đã nói với trình biên dịch "tin tôi đi, nó không undefined", và đó là lời nói dối với Binh, người chưa được chấm điểm. Các công cụ như <code>tsx</code> và <code>ts-node</code> tự bật source map; còn <code>node dist/…</code> trần trên production thì không.</p>
<p>Trình duyệt gặp đúng vấn đề này với bundle đã nén (cả ứng dụng trên một dòng, <code>a.b is undefined at main.4f3c.js:1:58231</code>). DevTools tự áp source map khi bản build có cung cấp — Chương 5 sẽ chỉ.</p>
<div class="callout warn"><p><strong>🕵️ Góc hacker — source map công khai.</strong> Tệp <code>.map</code> chứa mã nguồn gốc của bạn. Nếu server production phục vụ công khai <code>main.js.map</code>, ai cũng đọc được code front-end của bạn, kể cả chú thích — rất tiện cho kẻ tấn công đang tìm route admin ẩn hay khoá lẽ ra không được để ở đó. Cách làm phổ biến: sinh source map, tải lên công cụ báo lỗi, và không phục vụ chúng công khai (hoặc chấp nhận rằng code front-end vốn đã công khai và không bao giờ để bí mật trong đó).</p></div>

<h3>🧪 Thực hành (20 phút) — bốn lỗ hổng, bốn cách lấp</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>async.js</code> với <code>await</code> và <code>callback</code>. Ghi hàm nào của bạn biến mất khỏi trace thứ hai, và vì sao.</li>
<li>Chạy <code>quen-catch</code> và lần reject bằng chuỗi. Đổi lần reject bằng chuỗi thành <code>Promise.reject(new Error('het-han-token'))</code>: trace giờ hiện thêm gì?</li>
<li>Trong <code>~/dbg-lab/ch2/2-3/express</code>, chạy <code>npm init -y &amp;&amp; npm install express@4</code>, tạo <code>app.js</code>, tái hiện lần sập bằng curl, rồi áp bản sửa <code>next(err)</code> và chứng minh server sống sót.</li>
<li>Biên dịch <code>tinh-diem.ts</code> có source map, so hai trace. Rồi sửa nguyên nhân thật (xử lý bài chưa có điểm) mà không dùng <code>!</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được vì sao <code>kieuCu</code> biến mất; lần reject bằng Error giờ cho thấy nơi nó được tạo (<code>at [eval]:1:16</code> với <code>node -e</code>); curl tới <code>/phong/X</code> trả <code>500</code> với thân thông báo thân thiện và một request tiếp theo vẫn nhận <code>200</code>; và trace TypeScript trỏ vào <code>src/tinh-diem.ts:7</code> trước bản sửa cuối của bạn.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">async stack trace (trace bất đồng bộ)</span><span class="v">Trace có các frame <code>at async …</code> cho những nơi gọi đã await.</span></div>
  <div class="kv"><span class="k">callback (hàm gọi lại)</span><span class="v">Hàm bạn giao đi để được gọi sau; nơi đăng ký nó không có trong trace.</span></div>
  <div class="kv"><span class="k">unhandled rejection (từ chối không ai bắt)</span><span class="v">Promise bị reject mà không ai bắt; Node mặc định thoát.</span></div>
  <div class="kv"><span class="k">error-handling middleware</span><span class="v">Hàm Express <code>(err, req, res, next)</code> biến lỗi thành phản hồi.</span></div>
  <div class="kv"><span class="k">source map (bản đồ nguồn)</span><span class="v">Tệp <code>.map</code> nối code sinh ra về mã nguồn gốc.</span></div>
  <div class="kv"><span class="k">non-null assertion (!)</span><span class="v">Câu "tin tôi đi, không null/undefined" của TypeScript — không được kiểm lúc chạy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Trace JavaScript chỉ có ngăn xếp hiện tại: <code>await</code> giữ được nơi gọi <code>at async</code>, callback thì không.</li>
<li>Unhandled rejection làm tiến trình thoát; reject bằng đối tượng <code>Error</code> để trace có tệp của bạn.</li>
<li>Express 4 không bắt lỗi từ handler <code>async</code>: dùng <code>try/catch</code> + <code>next(err)</code> hoặc Express 5.</li>
<li>Thiếu một dòng log đáng lẽ phải có nghĩa là "không chạy tới", không phải "chạy sai".</li>
<li>TypeScript: <code>--enable-source-maps</code> làm trace trỏ về <code>.ts</code>; đừng vô tình phục vụ source map công khai.</li>
</ul>
${NGUON}
</div>
`,
};
