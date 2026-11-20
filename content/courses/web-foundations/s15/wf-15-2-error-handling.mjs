/**
 * Bài 15.2 — Lỗi là một phần của thiết kế (soạn 20/11/2026).
 * Mã + output: ../_ma.mjs — _demo/15-2/(tất cả) chạy bằng scripts/wf/chay-demo.mjs (Chromium thật).
 * Không trùng: 6.3 (HttpError + messageFor theo mã HTTP), 10.2 (đọc thông báo lỗi, 6 tên lỗi, breakpoint),
 * 5.2/5.3 (catch trong chuỗi promise, try/catch với await). Bài này: thiết kế lỗi — lớp lỗi riêng, cause,
 * finally, cái try/catch không bắt được, lưới an toàn toàn cục, nuốt lỗi, lộ thông tin qua lỗi.
 * Chưa có deck slide wf-15-2.
 */
import { ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

export default {
  title: '15.2 — Errors as part of the design: throw, wrap, clean up, report|||15.2 — Lỗi là một phần của thiết kế: ném, bọc, dọn dẹp, báo cáo',
  slug: 'wf-15-2-error-handling',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Giải phẫu đối tượng Error, vì sao không throw chuỗi; lớp lỗi riêng (ValidationError, NotFoundError) và rẽ nhánh bằng instanceof; bọc lỗi giữ nguyên gốc bằng cause; finally để dọn dẹp và bẫy return trong finally; những lỗi try/catch KHÔNG bắt được (hẹn giờ, promise không await); lưới an toàn window error / unhandledrejection; nuốt lỗi làm giao diện nói dối; góc hacker: thông báo lỗi lộ thông tin. Mọi ví dụ chạy thật trong Chromium.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.2</span>
<h2>Errors are part of the design, not an accident to hide</h2>
<p class="lead">Lesson 10.2 taught you to <em>read</em> an error. This lesson teaches you to <em>design</em> them: throw errors that carry the information the next layer needs, catch them only where you can do something useful, wrap a low-level error without losing it, always clean up, catch the errors that <code>try/catch</code> cannot see, and never let the UI lie to the user. These are the habits a reviewer checks first in a pull request — and the ones that decide whether a production bug takes ten minutes or two days to find.</p>

<h3>An everyday picture: the fire alarm in a building</h3>
<p>A smoke detector on floor 3 does not put out fires; it <strong>raises the alarm</strong> (throw). The alarm travels up the building (the call stack) until it reaches someone whose job is to act: the floor warden who knows where the extinguisher is, or the security desk that calls the fire brigade (catch). Two things go badly wrong in real buildings. Someone on every floor switches the alarm off "so it does not bother people" — the fire spreads in silence (swallowing errors). Or the alarm only says "something happened" — nobody knows which floor or why (throwing a bare string, losing the cause). Keep this picture; every rule below is one of these two failures.</p>

<h3>Step 1 — what an Error object carries (and why never to throw a string)</h3>
${ma('javascript', CODE['15-2/anatomy.js'])}
${ra(OUT['15-2/anatomy'])}
<p>An <code>Error</code> carries a <strong>name</strong> (its kind), a <strong>message</strong> (for humans), and a <strong>stack</strong> — the chain of calls that led here, down to the exact file, line and column (<code>anatomy.js:3:8</code> is the line that read <code>cart.items</code>). JavaScript lets you throw anything, but a thrown string has no name, no message property and no stack. Whoever catches it gets a bare sentence and no idea where it came from.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>throw 'Something failed'</code>.</strong> It works in the demo and costs you hours in production: error-reporting tools group by name and stack, and a string has neither. Always throw an <code>Error</code> (or a subclass). Linters have a rule for this (<code>no-throw-literal</code>).</p></div>

<h3>Step 2 — your own error classes: the catcher can tell kinds apart</h3>
<p>Lesson 6.3 built one class, <code>HttpError</code>, to carry an HTTP status. The same idea scales to the whole app: a small family of error classes lets the code that catches decide what to do <em>by kind</em> instead of by parsing message text.</p>
${ma('javascript', CODE['15-2/custom.js'])}
${ra(OUT['15-2/custom'])}
<p>Three details make this work. <code>this.name = this.constructor.name</code> gives every subclass its real name in logs. <code>ValidationError</code> carries extra data — <code>field</code> — that the form needs to put a red message under the right input. And the last branch matters most: an error the code did not expect (<code>null.price</code>) is <strong>not</strong> turned into a friendly form message. It is reported, and the user gets an honest "Something went wrong".</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — deciding by message text.</strong> <code>if (err.message.includes('not found'))</code> breaks the day someone fixes a typo in the message or translates it into Vietnamese. Messages are for people; <code>instanceof</code> and fields like <code>status</code> or <code>field</code> are for code.</p></div>

<h3>Step 3 — wrap without losing the original: <code>cause</code></h3>
<p>Low-level errors ("Unexpected token at position 17") mean nothing to the layer above. You want to rethrow something meaningful ("Could not read saved settings") — without throwing away the original, which is what you need when debugging. Since ES2022, every <code>Error</code> accepts <code>{ cause }</code>:</p>
${ma('javascript', CODE['15-2/cause.js'])}
${ra(OUT['15-2/cause'])}
<p>The wrapped error has a message the UI can use and keeps the exact <code>SyntaxError</code> — with its position — in <code>err.cause</code>. The lossy version gives the same friendly message and nothing else: the next person to debug it has to reproduce the bug to learn that a trailing comma broke the JSON. DevTools and Node both print the cause chain when an error with a cause is logged.</p>

<h3>Step 4 — <code>finally</code>: clean up on every path</h3>
<p>Every "loading" state needs to end, whether the request succeeded or failed: hide the spinner, re-enable the button, release a lock. Writing that cleanup twice (once in <code>try</code>, once in <code>catch</code>) is how one copy gets forgotten. <code>finally</code> runs after <code>try</code> finishes, after <code>catch</code> finishes, and even after a <code>return</code>:</p>
${ma('javascript', CODE['15-2/finally.js'])}
${ra(OUT['15-2/finally'])}
<p>On success and on failure, the spinner went off and the button came back. That is the guarantee you want for every "Save" button: the classic bug report "the button stays disabled forever after a network error" is a missing <code>finally</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>return</code> inside <code>finally</code>.</strong> The last line of the output shows it: a <code>return</code> in <code>finally</code> replaces whatever was happening — including an error being thrown. The error vanishes without a trace. Use <code>finally</code> only to clean up; never return or throw from it.</p></div>

<h3>Step 5 — what <code>try/catch</code> cannot catch</h3>
<p><code>try/catch</code> only catches errors thrown <strong>while the <code>try</code> block is running</strong>. Code that runs later — a timer callback, a promise that rejects after the block has finished — is outside it, even though it is written inside it:</p>
${ma('javascript', CODE['15-2/uncatchable.js'])}
${ra(OUT['15-2/uncatchable'])}
<p>Lines 1 and 2 show the <code>try</code> blocks finishing happily; the errors arrive afterwards and nobody catches them, so the browser reports them as <code>Uncaught</code>. Line 3 shows the fix for promises: <code>await</code> makes the async function pause <em>inside</em> the <code>try</code>, so the rejection is thrown there and caught (lesson 5.3 covered this from the promise side). For timers and event handlers, the <code>try/catch</code> has to be <em>inside</em> the callback.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">try { … } runs</span><span class="lz-d">It schedules a timer / starts a promise, then finishes. The <code>catch</code> is now gone.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Event loop moves on</span><span class="lz-d">Other code runs. Lesson 5.1: the callback waits in a queue.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Callback throws later</span><span class="lz-d">There is no <code>try</code> around it any more ⇒ "Uncaught" in the console.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Fix</span><span class="lz-d"><code>await</code> the promise inside the <code>try</code>, or put the <code>try/catch</code> inside the callback.</span></div>
</div>

<h3>Step 6 — the safety net: <code>error</code> and <code>unhandledrejection</code></h3>
<p>Some errors will always slip through — that is what bugs are. The browser fires two events on <code>window</code> for them, and every serious app listens to both to <strong>report</strong> them (to Sentry, to your own <code>/api/client-errors</code>, anywhere a developer will see them):</p>
${ma('html', CODE['15-2/safety-net.html'], [10, 35])}
${ra(OUT['15-2/safety-net'])}
<p>The lines starting with <code>Uncaught</code> are what the DevTools console shows in red; the <code>[report]</code> lines are our handlers. Without them, these two bugs would exist only in the consoles of users who never open DevTools — you would hear about them as "the profile button does nothing sometimes". Note the last line: one broken handler did not stop the rest of the page.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — using the safety net as the plan.</strong> A global handler can only report; it cannot know which button to re-enable or which message to show. Catch where you can act (Step 2, Step 4), and keep the global handler for the leftovers. In React, the equivalent of "catch where you can act" for rendering errors is an error boundary (React course, lesson 11.4).</p></div>

<h3>Step 7 — swallowing errors makes the UI lie</h3>
${ma('javascript', CODE['15-2/swallow.js'])}
${ra(OUT['15-2/swallow'])}
<p>The "safe default" <code>catch { return [] }</code> turned a server outage into a <em>false statement</em> to the user ("You have no orders yet") and into silence for the team. The user may now place the order again. The honest version shows an error state with a retry and reports the real reason. Empty, loading and error are three different states (lesson 5.4); never collapse "error" into "empty".</p>

<h3>When to catch — a decision table</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">You can fix it here</span><span class="v">Retry once, use a cached copy, fall back to a default that is <em>true</em> (e.g. default theme when settings are corrupt). Catch.</span></div>
  <div class="kv"><span class="k">You can explain it here</span><span class="v">The form layer shows "price must be a number" under the field. Catch the specific kind; rethrow the rest.</span></div>
  <div class="kv"><span class="k">You can add context</span><span class="v">Wrap with a meaningful message and <code>{ cause }</code>, then throw again.</span></div>
  <div class="kv"><span class="k">You can only log it</span><span class="v">Do not catch. Let it reach the layer that can act, or the global reporter.</span></div>
  <div class="kv"><span class="k">Cleanup is needed either way</span><span class="v"><code>finally</code> — not a catch.</span></div>
</div>

<h3>🕵️ Hacker's corner — error messages that tell an attacker too much</h3>
<p>Attackers read error messages carefully. A response like <code>error: relation "users" does not exist at /srv/app/node_modules/pg/lib/…</code> tells them which database you use, your table names, your folder layout and library versions — free reconnaissance for SQL injection or a known vulnerability. On the front end the same leak happens when the UI shows <code>err.message</code> from the server verbatim, or puts it into <code>innerHTML</code> (which turns an error message containing <code>&lt;img onerror=…&gt;</code> into XSS — lesson 4.5).</p>
<p><strong>How to defend:</strong> the server returns a generic message plus an error <em>id</em> to the client and writes the details (stack, cause) to its own logs (Node.js course, lesson 9.4); the front end maps error kinds to its own fixed sentences (lesson 6.3's <code>messageFor</code>), shows them with <code>textContent</code>, and sends the details to the reporting endpoint, not to the screen. The OWASP Error Handling Cheat Sheet is the reference checklist.</p>

<div class="callout ok">
<p><strong>🧪 Lab (30 minutes) — a loader that fails well</strong></p>
<p>Write <code>async function loadSettings(url)</code> for a settings page, in a page served from a local server with three files next to it: <code>good.json</code> (valid), <code>broken.json</code> (a trailing comma), and a URL that does not exist.</p>
<ol>
  <li>Create <code>AppError</code>, <code>NotFoundError</code> and <code>CorruptSettingsError</code> as in Step 2.</li>
  <li>404 ⇒ throw <code>NotFoundError</code>. Invalid JSON ⇒ throw <code>CorruptSettingsError</code> with the <code>SyntaxError</code> as its <code>cause</code>.</li>
  <li>The caller shows a spinner, and in <code>finally</code> hides it. It shows a different fixed sentence for each kind, using <code>textContent</code>; a <code>CorruptSettingsError</code> falls back to default settings (a <em>true</em> default) and reports the cause.</li>
  <li>Add the two global handlers from Step 6, then add one deliberate bug (call a method on <code>undefined</code> in a click handler) and check it gets reported.</li>
</ol>
<p><strong>Done when:</strong> the three URLs produce three different messages; for <code>broken.json</code> the console shows the original <code>SyntaxError</code> through <code>err.cause</code>; the spinner is hidden in all three cases; the deliberate bug prints a <code>[report]</code> line; and no <code>catch</code> in your code is empty.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">throw / catch</span><span class="v">ném lỗi / bắt lỗi.</span></div>
  <div class="kv"><span class="k">stack trace</span><span class="v">dấu vết ngăn xếp — chuỗi lời gọi dẫn tới lỗi, kèm tệp:dòng:cột.</span></div>
  <div class="kv"><span class="k">custom error class</span><span class="v">lớp lỗi riêng — <code>class X extends Error</code> để phân loại lỗi.</span></div>
  <div class="kv"><span class="k">cause</span><span class="v">nguyên nhân gốc — lỗi ban đầu được giữ khi bọc lỗi.</span></div>
  <div class="kv"><span class="k">finally</span><span class="v">khối luôn chạy — dùng để dọn dẹp, dù thành công hay thất bại.</span></div>
  <div class="kv"><span class="k">unhandled rejection</span><span class="v">promise bị từ chối mà không ai bắt.</span></div>
  <div class="kv"><span class="k">swallowing an error</span><span class="v">nuốt lỗi — bắt rồi im lặng, không xử lý, không báo.</span></div>
  <div class="kv"><span class="k">information disclosure</span><span class="v">lộ thông tin — lỗi kể cho kẻ tấn công cấu trúc hệ thống.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Throw <code>Error</code> objects (name, message, stack), never strings.</li>
  <li>A small family of error classes lets catchers decide by <code>instanceof</code> and fields, not by message text.</li>
  <li>Wrap low-level errors with <code>new Error(msg, { cause })</code> — friendly on top, the original underneath.</li>
  <li><code>finally</code> is for cleanup on every path; never <code>return</code> from it.</li>
  <li><code>try/catch</code> cannot see errors thrown later (timers, un-awaited promises): <code>await</code> inside the try, or catch inside the callback.</li>
  <li>Listen to <code>error</code> and <code>unhandledrejection</code> to report what slipped through; do not use them for control flow.</li>
  <li>Never turn "error" into "empty"; never show raw server errors to users.</li>
</ul>
${nguon('📗', 'MDN — Error', 'The Error object, its properties, and cause', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error')}
${nguon('📘', 'javascript.info — Custom errors, extending Error', 'Error hierarchies and wrapping exceptions, step by step', 'https://javascript.info/custom-errors')}
${nguon('📗', 'MDN — Window: unhandledrejection event', 'Reporting promise rejections nobody handled', 'https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event')}
${nguon('🛡️', 'OWASP — Error Handling Cheat Sheet', 'What to show users, what to log, and what never to reveal', 'https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html')}
${lienKet({ khoa: 'web-foundations', bai: 'wf-6-3-status-codes', title: 'Lesson 6.3 — status codes', sub: 'HttpError and one function that turns every HTTP outcome into a message', cta: 'Open lesson' })}
${lienKet({ khoa: 'web-foundations', bai: 'wf-10-2-reading-errors-debugging', title: 'Lesson 10.2 — reading errors and the debugging loop', sub: 'The other half: reading a stack trace, six error names, breakpoints', cta: 'Open lesson' })}
${lienKet({ khoa: 'react', bai: 'rx-11-4-portal-error-boundary', title: 'React 11.4 — portals and error boundaries', sub: 'Catching rendering errors so one component does not blank the page', cta: 'Open lesson' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-5-4-xu-ly-loi', title: 'Node.js 5.4 — centralised error handling', sub: 'The same design on the server: one error handler, errors with a status', cta: 'Open lesson' })}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-7-1-loi-khong-phai-log', title: 'Observability 7.1 — an error is not a log line', sub: 'Where the reports from your global handler should go, and how they are grouped', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.2</span>
<h2>Lỗi là một phần của thiết kế, không phải tai nạn cần giấu</h2>
<p class="lead">Bài 10.2 dạy bạn <em>đọc</em> một lỗi. Bài này dạy bạn <em>thiết kế</em> lỗi: ném ra lỗi mang đủ thông tin tầng kế tiếp cần, chỉ bắt ở nơi làm được việc gì đó có ích, bọc một lỗi tầng thấp mà không làm mất nó, luôn dọn dẹp, bắt được những lỗi mà <code>try/catch</code> không nhìn thấy, và không bao giờ để giao diện nói dối người dùng. Đây là những thói quen người review soát đầu tiên trong một pull request — và là thứ quyết định một lỗi trên production mất mười phút hay hai ngày để tìm ra.</p>

<h3>Liên tưởng đời thường: chuông báo cháy trong một toà nhà</h3>
<p>Đầu báo khói ở tầng 3 không dập lửa; nó <strong>kích chuông</strong> (throw). Tiếng chuông truyền lên khắp toà nhà (ngăn xếp lời gọi) cho tới khi gặp người có nhiệm vụ hành động: tổ trưởng tầng biết bình chữa cháy ở đâu, hoặc bàn bảo vệ gọi cứu hoả (catch). Ngoài đời có hai chuyện rất tệ. Tầng nào cũng có người tắt chuông "cho đỡ phiền" — đám cháy lan trong im lặng (nuốt lỗi). Hoặc chuông chỉ báo "có chuyện" — không ai biết tầng nào, vì sao (ném một chuỗi trần, làm mất nguyên nhân). Giữ bức tranh này; mỗi luật bên dưới là một trong hai thất bại đó.</p>

<h3>Bước 1 — một đối tượng Error mang theo gì (và vì sao đừng bao giờ throw một chuỗi)</h3>
${ma('javascript', CODE['15-2/anatomy.js'])}
${ra(OUT['15-2/anatomy'])}
<p>Một <code>Error</code> mang <strong>name</strong> (loại lỗi), <strong>message</strong> (cho người đọc) và <strong>stack</strong> — chuỗi lời gọi dẫn tới đây, tới đúng tệp, dòng và cột (<code>anatomy.js:3:8</code> là dòng đọc <code>cart.items</code>). JavaScript cho phép bạn throw bất cứ thứ gì, nhưng một chuỗi bị throw không có name, không có thuộc tính message và không có stack. Ai bắt được nó chỉ nhận một câu trơ trọi và không biết nó từ đâu ra.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>throw 'Có lỗi rồi'</code>.</strong> Chạy được trong demo và làm bạn mất hàng giờ trên production: các công cụ báo lỗi gom nhóm theo name và stack, mà chuỗi thì không có cả hai. Luôn throw một <code>Error</code> (hoặc lớp con). Linter có luật cho việc này (<code>no-throw-literal</code>).</p></div>

<h3>Bước 2 — lớp lỗi của riêng bạn: bên bắt phân biệt được loại</h3>
<p>Bài 6.3 đã dựng một lớp, <code>HttpError</code>, để mang mã trạng thái HTTP. Ý tưởng đó mở rộng được cho cả ứng dụng: một họ lớp lỗi nhỏ giúp code bắt lỗi quyết định làm gì <em>theo loại</em> thay vì đi phân tích chữ trong message.</p>
${ma('javascript', CODE['15-2/custom.js'])}
${ra(OUT['15-2/custom'])}
<p>Ba chi tiết làm nó chạy được. <code>this.name = this.constructor.name</code> cho mỗi lớp con tên thật của nó trong log. <code>ValidationError</code> mang thêm dữ liệu — <code>field</code> — mà biểu mẫu cần để đặt dòng chữ đỏ dưới đúng ô nhập. Và nhánh cuối quan trọng nhất: một lỗi mà code không lường trước (<code>null.price</code>) <strong>không</strong> bị biến thành thông báo biểu mẫu thân thiện. Nó được báo cáo, còn người dùng nhận một câu thật thà "Đã có lỗi xảy ra".</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — quyết định theo chữ trong message.</strong> <code>if (err.message.includes('not found'))</code> sẽ hỏng vào ngày ai đó sửa lỗi chính tả trong message hoặc dịch nó sang tiếng Việt. Message dành cho người; <code>instanceof</code> và các trường như <code>status</code>, <code>field</code> dành cho code.</p></div>

<h3>Bước 3 — bọc lỗi mà không mất bản gốc: <code>cause</code></h3>
<p>Lỗi tầng thấp ("Unexpected token at position 17") chẳng có nghĩa gì với tầng trên. Bạn muốn ném lại một lỗi có nghĩa ("Không đọc được cài đặt đã lưu") — mà không vứt bản gốc, thứ bạn cần khi gỡ lỗi. Từ ES2022, mọi <code>Error</code> nhận <code>{ cause }</code>:</p>
${ma('javascript', CODE['15-2/cause.js'])}
${ra(OUT['15-2/cause'])}
<p>Lỗi đã bọc có message giao diện dùng được và giữ nguyên <code>SyntaxError</code> gốc — kèm vị trí — trong <code>err.cause</code>. Bản "mất mát" cho cùng câu thân thiện và không gì khác: người gỡ lỗi kế tiếp phải tái hiện lại lỗi mới biết một dấu phẩy thừa đã làm hỏng JSON. DevTools và Node đều in cả chuỗi cause khi log một lỗi có cause.</p>

<h3>Bước 4 — <code>finally</code>: dọn dẹp trên mọi đường đi</h3>
<p>Trạng thái "đang tải" nào cũng phải kết thúc, dù request thành công hay thất bại: ẩn spinner, bật lại nút, nhả khoá. Viết phần dọn dẹp hai lần (một trong <code>try</code>, một trong <code>catch</code>) là cách một bản bị quên. <code>finally</code> chạy sau khi <code>try</code> xong, sau khi <code>catch</code> xong, và cả sau một lệnh <code>return</code>:</p>
${ma('javascript', CODE['15-2/finally.js'])}
${ra(OUT['15-2/finally'])}
<p>Khi thành công lẫn khi thất bại, spinner đều tắt và nút đều bật lại. Đó là bảo đảm bạn muốn cho mọi nút "Lưu": báo lỗi kinh điển "mất mạng một lần là nút bị khoá mãi" chính là thiếu <code>finally</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>return</code> trong <code>finally</code>.</strong> Dòng output cuối cho thấy: một <code>return</code> trong <code>finally</code> thay thế mọi thứ đang diễn ra — kể cả một lỗi đang được ném. Lỗi biến mất không dấu vết. Chỉ dùng <code>finally</code> để dọn dẹp; không bao giờ return hay throw từ trong đó.</p></div>

<h3>Bước 5 — những gì <code>try/catch</code> không bắt được</h3>
<p><code>try/catch</code> chỉ bắt lỗi được ném ra <strong>trong lúc khối <code>try</code> đang chạy</strong>. Code chạy về sau — callback của hẹn giờ, một promise bị từ chối sau khi khối đã xong — nằm ngoài nó, dù được viết bên trong:</p>
${ma('javascript', CODE['15-2/uncatchable.js'])}
${ra(OUT['15-2/uncatchable'])}
<p>Dòng 1 và 2 cho thấy các khối <code>try</code> chạy xong vui vẻ; lỗi tới sau đó và không ai bắt, nên trình duyệt báo chúng là <code>Uncaught</code>. Dòng 3 là cách sửa cho promise: <code>await</code> khiến hàm async dừng <em>bên trong</em> <code>try</code>, nên việc từ chối được ném ra ngay tại đó và bị bắt (bài 5.3 đã nói điều này từ phía promise). Với hẹn giờ và handler sự kiện, <code>try/catch</code> phải nằm <em>bên trong</em> callback.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">try { … } chạy</span><span class="lz-d">Nó hẹn một timer / khởi động một promise, rồi xong. Lúc này <code>catch</code> đã không còn.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Event loop chạy tiếp</span><span class="lz-d">Code khác chạy. Bài 5.1: callback chờ trong hàng đợi.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Callback ném lỗi về sau</span><span class="lz-d">Không còn <code>try</code> nào bao quanh ⇒ "Uncaught" trong console.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Cách sửa</span><span class="lz-d"><code>await</code> promise bên trong <code>try</code>, hoặc đặt <code>try/catch</code> bên trong callback.</span></div>
</div>

<h3>Bước 6 — lưới an toàn: <code>error</code> và <code>unhandledrejection</code></h3>
<p>Luôn có lỗi lọt lưới — đó là bản chất của bug. Trình duyệt bắn hai sự kiện trên <code>window</code> cho chúng, và mọi ứng dụng nghiêm túc đều nghe cả hai để <strong>báo cáo</strong> (lên Sentry, lên <code>/api/client-errors</code> của bạn, bất cứ đâu lập trình viên sẽ nhìn thấy):</p>
${ma('html', CODE['15-2/safety-net.html'], [10, 35])}
${ra(OUT['15-2/safety-net'])}
<p>Các dòng bắt đầu bằng <code>Uncaught</code> là thứ console của DevTools hiện màu đỏ; các dòng <code>[report]</code> là handler của ta. Không có chúng, hai bug này chỉ tồn tại trong console của những người dùng không bao giờ mở DevTools — bạn sẽ nghe về chúng dưới dạng "nút hồ sơ thỉnh thoảng bấm không ăn". Để ý dòng cuối: một handler hỏng không làm phần còn lại của trang dừng.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — lấy lưới an toàn làm kế hoạch chính.</strong> Handler toàn cục chỉ báo cáo được; nó không biết phải bật lại nút nào hay hiện câu gì. Bắt ở nơi hành động được (Bước 2, Bước 4), để handler toàn cục lo phần sót. Trong React, thứ tương đương "bắt ở nơi hành động được" cho lỗi lúc render là error boundary (khoá React, bài 11.4).</p></div>

<h3>Bước 7 — nuốt lỗi làm giao diện nói dối</h3>
${ma('javascript', CODE['15-2/swallow.js'])}
${ra(OUT['15-2/swallow'])}
<p>"Giá trị mặc định an toàn" <code>catch { return [] }</code> đã biến một sự cố máy chủ thành một <em>câu sai sự thật</em> với người dùng ("Bạn chưa có đơn hàng nào") và thành sự im lặng với cả nhóm. Người dùng giờ có thể đặt lại đơn hàng lần nữa. Bản thật thà hiện trạng thái lỗi kèm nút thử lại và báo lý do thật. Trống, đang tải và lỗi là ba trạng thái khác nhau (bài 5.4); đừng bao giờ gộp "lỗi" vào "trống".</p>

<h3>Khi nào nên bắt — bảng quyết định</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Sửa được ngay tại đây</span><span class="v">Thử lại một lần, dùng bản đã lưu đệm, lùi về mặc định ĐÚNG SỰ THẬT (vd giao diện mặc định khi cài đặt bị hỏng). Bắt.</span></div>
  <div class="kv"><span class="k">Giải thích được tại đây</span><span class="v">Tầng biểu mẫu hiện "giá phải là số" dưới ô nhập. Bắt đúng loại đó; ném lại phần còn lại.</span></div>
  <div class="kv"><span class="k">Thêm được ngữ cảnh</span><span class="v">Bọc bằng message có nghĩa và <code>{ cause }</code>, rồi ném tiếp.</span></div>
  <div class="kv"><span class="k">Chỉ log được thôi</span><span class="v">Đừng bắt. Để nó lên tới tầng hành động được, hoặc tới bộ báo cáo toàn cục.</span></div>
  <div class="kv"><span class="k">Dù sao cũng phải dọn dẹp</span><span class="v"><code>finally</code> — không phải catch.</span></div>
</div>

<h3>🕵️ Góc hacker — thông báo lỗi kể cho kẻ tấn công quá nhiều</h3>
<p>Kẻ tấn công đọc thông báo lỗi rất kỹ. Một response kiểu <code>error: relation "users" does not exist at /srv/app/node_modules/pg/lib/…</code> cho họ biết bạn dùng cơ sở dữ liệu gì, tên bảng, cấu trúc thư mục và phiên bản thư viện — trinh sát miễn phí cho SQL injection hay một lỗ hổng đã công bố. Ở front-end, chuyện lộ y hệt xảy ra khi giao diện hiện nguyên văn <code>err.message</code> từ máy chủ, hoặc nhét nó vào <code>innerHTML</code> (biến một thông báo lỗi chứa <code>&lt;img onerror=…&gt;</code> thành XSS — bài 4.5).</p>
<p><strong>Cách phòng:</strong> máy chủ trả cho client một thông báo chung kèm <em>mã</em> lỗi và ghi chi tiết (stack, cause) vào log của chính nó (khoá Node.js, bài 9.4); front-end ánh xạ loại lỗi sang các câu cố định của mình (hàm <code>messageFor</code> ở bài 6.3), hiện bằng <code>textContent</code>, và gửi chi tiết tới điểm báo cáo chứ không lên màn hình. OWASP Error Handling Cheat Sheet là bảng kiểm tham chiếu.</p>

<div class="callout ok">
<p><strong>🧪 Lab (30 phút) — một bộ nạp thất bại cho đàng hoàng</strong></p>
<p>Viết <code>async function loadSettings(url)</code> cho trang cài đặt, trong một trang chạy bằng máy chủ cục bộ, cạnh đó có ba tệp: <code>good.json</code> (hợp lệ), <code>broken.json</code> (thừa một dấu phẩy cuối), và một URL không tồn tại.</p>
<ol>
  <li>Tạo <code>AppError</code>, <code>NotFoundError</code> và <code>CorruptSettingsError</code> như Bước 2.</li>
  <li>404 ⇒ ném <code>NotFoundError</code>. JSON hỏng ⇒ ném <code>CorruptSettingsError</code> với <code>SyntaxError</code> làm <code>cause</code>.</li>
  <li>Bên gọi hiện spinner, và ẩn nó trong <code>finally</code>. Mỗi loại lỗi hiện một câu cố định khác nhau, bằng <code>textContent</code>; <code>CorruptSettingsError</code> thì lùi về cài đặt mặc định (một mặc định ĐÚNG) và báo cáo cause.</li>
  <li>Thêm hai handler toàn cục ở Bước 6, rồi cài một bug cố ý (gọi method trên <code>undefined</code> trong một handler click) và kiểm tra nó được báo cáo.</li>
</ol>
<p><strong>Xong khi:</strong> ba URL cho ra ba thông báo khác nhau; với <code>broken.json</code> console hiện được <code>SyntaxError</code> gốc qua <code>err.cause</code>; spinner được ẩn trong cả ba trường hợp; bug cố ý in ra một dòng <code>[report]</code>; và không có <code>catch</code> nào trong code của bạn để trống.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">throw / catch</span><span class="v">ném lỗi / bắt lỗi.</span></div>
  <div class="kv"><span class="k">stack trace</span><span class="v">dấu vết ngăn xếp — chuỗi lời gọi dẫn tới lỗi, kèm tệp:dòng:cột.</span></div>
  <div class="kv"><span class="k">custom error class</span><span class="v">lớp lỗi riêng — <code>class X extends Error</code> để phân loại lỗi.</span></div>
  <div class="kv"><span class="k">cause</span><span class="v">nguyên nhân gốc — lỗi ban đầu được giữ khi bọc lỗi.</span></div>
  <div class="kv"><span class="k">finally</span><span class="v">khối luôn chạy — dùng để dọn dẹp, dù thành công hay thất bại.</span></div>
  <div class="kv"><span class="k">unhandled rejection</span><span class="v">promise bị từ chối mà không ai bắt.</span></div>
  <div class="kv"><span class="k">swallowing an error</span><span class="v">nuốt lỗi — bắt rồi im lặng, không xử lý, không báo.</span></div>
  <div class="kv"><span class="k">information disclosure</span><span class="v">lộ thông tin — lỗi kể cho kẻ tấn công cấu trúc hệ thống.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Throw đối tượng <code>Error</code> (name, message, stack), không bao giờ throw chuỗi.</li>
  <li>Một họ lớp lỗi nhỏ giúp bên bắt quyết định bằng <code>instanceof</code> và các trường, không bằng chữ trong message.</li>
  <li>Bọc lỗi tầng thấp bằng <code>new Error(msg, { cause })</code> — bên trên thân thiện, bên dưới còn nguyên bản gốc.</li>
  <li><code>finally</code> để dọn dẹp trên mọi đường đi; không bao giờ <code>return</code> từ trong đó.</li>
  <li><code>try/catch</code> không thấy lỗi ném ra về sau (timer, promise không await): <code>await</code> trong try, hoặc bắt bên trong callback.</li>
  <li>Nghe <code>error</code> và <code>unhandledrejection</code> để báo cáo phần lọt lưới; đừng dùng chúng để điều khiển luồng.</li>
  <li>Đừng bao giờ biến "lỗi" thành "trống"; đừng bao giờ hiện lỗi thô của máy chủ cho người dùng.</li>
</ul>
${nguon('📗', 'MDN — Error', 'Đối tượng Error, các thuộc tính, và cause', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error')}
${nguon('📘', 'javascript.info — Custom errors, extending Error', 'Họ lớp lỗi và bọc ngoại lệ, từng bước', 'https://javascript.info/custom-errors')}
${nguon('📗', 'MDN — Window: unhandledrejection event', 'Báo cáo các promise bị từ chối mà không ai xử lý', 'https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event')}
${nguon('🛡️', 'OWASP — Error Handling Cheat Sheet', 'Hiện gì cho người dùng, log gì, và điều gì không bao giờ được lộ', 'https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html')}
${lienKet({ khoa: 'web-foundations', bai: 'wf-6-3-status-codes', title: 'Bài 6.3 — mã trạng thái', sub: 'HttpError và một hàm biến mọi kết quả HTTP thành câu thông báo', cta: 'Mở bài' })}
${lienKet({ khoa: 'web-foundations', bai: 'wf-10-2-reading-errors-debugging', title: 'Bài 10.2 — đọc lỗi và vòng lặp gỡ lỗi', sub: 'Nửa còn lại: đọc stack trace, sáu tên lỗi, breakpoint', cta: 'Mở bài' })}
${lienKet({ khoa: 'react', bai: 'rx-11-4-portal-error-boundary', title: 'React 11.4 — portal và error boundary', sub: 'Bắt lỗi lúc render để một component không làm trắng cả trang', cta: 'Mở bài' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-5-4-xu-ly-loi', title: 'Node.js 5.4 — xử lý lỗi tập trung', sub: 'Cùng thiết kế đó ở máy chủ: một error handler, lỗi mang mã trạng thái', cta: 'Mở bài' })}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-7-1-loi-khong-phai-log', title: 'Observability 7.1 — lỗi không phải một dòng log', sub: 'Báo cáo từ handler toàn cục nên đi đâu, và được gom nhóm thế nào', cta: 'Mở bài' })}
</div>
`,
};
