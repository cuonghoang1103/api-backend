/**
 * 5.1 — Console hơn cả console.log (soạn 24/11/2026 trên máy nhà Linux).
 * Output THẬT: Google Chrome 150.0.7871.128 headless, lái bằng Playwright 1.65.1 + phiên CDP (đúng giao thức bảng DevTools dùng:
 * Runtime.consoleAPICalled / exceptionThrown, Log.entryAdded, Debugger.setPauseOnExceptions, Runtime.evaluate includeCommandLineAPI).
 * Ứng dụng mẫu LabFlow web Chương 5 (React 19.3 + Vite 8.3, API node:http) — mã ở s05/_ma-5.mjs; lab ở vbg-dp/scratchpad/dbg/lab/ch5.
 * Máy soạn không có màn hình: không có ảnh chụp giao diện DevTools; thao tác UI theo tài liệu developer.chrome.com.
 */
import { nguon, lienKet } from '../_chung.mjs';
import { APP, API, API_JS, MAIN, VITE, INDEX, CHAY } from './_ma-5.mjs';

const ma = (s, lang = 'jsx') => `<pre><code class="language-${lang}">${s}</code></pre>`;

const OUT_TRANG = `<div class="out">$ open http://localhost:41511/          # page is blank; DevTools → Console, all levels ("Verbose" ticked)
+  140ms [console.debug] [vite] connecting...                                     client:934
+  151ms [console.debug] [vite] connected.                                        client:1043
+  224ms [console.info] Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
+  252ms [console.warning] An error occurred in the &lt;LichPhong&gt; component.
         Consider adding an error boundary to your tree to customize error handling behavior.
         Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
+  252ms [network/error] Failed to load resource: the server responded with a status of 404 (Not Found)  http://localhost:41511/favicon.ico
+  254ms [Uncaught] TypeError: Cannot read properties of undefined (reading 'map')   App.jsx:13
             at LichPhong (App.jsx:13)
             at react_stack_bottom_frame (react-dom-client.development.js:28571)
             at renderWithHooks (react-dom-client.development.js:8030)
             at updateFunctionComponent (react-dom-client.development.js:10569)
+  254ms [network/error] Failed to load resource: the server responded with a status of 401 (Unauthorized)  http://127.0.0.1:41510/api/toi
+  254ms [network/error] Failed to load resource: the server responded with a status of 401 (Unauthorized)  http://127.0.0.1:41510/api/toi
+ 2653ms #root has 0 child elements; body text: "💬"</div>`;

const MA_LOI = ma(`function LichPhong({ phong }) {
  const [phongDangXem] = useState(phong);
  const [lich, setLich] = useState([]);
  useEffect(() =&gt; {
    goi(\`/api/dat-cho?phong=\${phongDangXem}\`).then((data) =&gt; setLich(data.lich));   // line 8
  }, []);
  return (
    &lt;section&gt;
      &lt;h2&gt;Lịch phòng {phongDangXem}&lt;/h2&gt;
      &lt;ul&gt;{lich.map((d) =&gt; &lt;li key={d.id}&gt;…&lt;/li&gt;)}&lt;/ul&gt;                      // line 13
    &lt;/section&gt;
  );
}`);

const OUT_JSON = `<div class="out">&gt; await (await fetch('http://127.0.0.1:41510/api/dat-cho?phong=401')).json()
&lt; {items: Array(2)}                    ← the API (v2) renamed "lich" to "items"; data.lich is undefined</div>`;

const MA_SUA = ma(`goi(\`/api/dat-cho?phong=\${phong}\`)
  .then((data) =&gt; { if (!huy) setLich(data.items ?? []); })
  .catch((e) =&gt; { if (!huy) setLoi(e.message); });          // show the error instead of a blank page`);

const OUT_REPL = `<div class="out">&gt; $$('li').length
&lt; 2
&gt; $$('li').map((li) =&gt; li.textContent)
&lt; ["#1 08:00 — SE1801","#2 13:00 — SE1802"]
&gt; Object.keys(getEventListeners(document.querySelector('button')))
&lt; ["click"]
&gt; getEventListeners(document.querySelector('button')).click[0].listener.name
&lt; "noop$1"                                  ← not your onClick: an empty function React puts there
&gt; getEventListeners(document.getElementById('root')).click.map((l) =&gt; [l.useCapture ? 'capture' : 'bubble', l.listener.name])
&lt; [["bubble","bound dispatchDiscreteEvent"],["capture","bound dispatchDiscreteEvent"],["bubble","noop$1"]]
                                           ← React 17+ listens once on the root and dispatches to your handlers
&gt; const r = await (await fetch('/api/dat-cho?phong=401')).json(); console.table(r.items.map(({ id, nguoiDat, batDau }) =&gt; ({ id, nguoiDat, batDau })))
  (index) │ id │ nguoiDat │ batDau
  0       │ 1  │ SE1801   │ 2026-11-25T08:00:00+07:00
  1       │ 2  │ SE1802   │ 2026-11-25T13:00:00+07:00
&gt; console.count('luu'); console.count('luu'); console.countReset('luu'); console.count('luu')
  luu: 1
  luu: 2
  luu: 1
&gt; console.assert(r.items.length === 3, 'phòng 401 phải có 3 lượt, có', r.items.length)
  Assertion failed: phòng 401 phải có 3 lượt, có 2      ← prints only when the condition is false</div>`;

const MA_GOPY = ma(`&lt;form id="f" action="/phien-ban.json"&gt;&lt;input name="noi_dung" value="Máy 12 hỏng chuột"&gt;&lt;button&gt;Gửi&lt;/button&gt;&lt;/form&gt;
&lt;script&gt;
document.getElementById('f').addEventListener('submit', (e) =&gt; {
  const dl = new FormData(e.target);
  console.log('gửi góp ý', Object.fromEntries(dl));
  if (!dl.get('email')) console.error('thiếu email — lẽ ra phải chặn gửi');   // bug: forgot e.preventDefault()
});
&lt;/script&gt;`, 'html');

const OUT_GIU = `<div class="out">$ (click "Gửi" on /gop-y.html)
+  123ms [console.log] gửi góp ý {noi_dung: 'Máy 12 hỏng chuột'}
+  123ms [console.error] thiếu email — lẽ ra phải chặn gửi
+  138ms Runtime.executionContextsCleared     ← new document: without "Preserve log" the Console is wiped here
+  141ms Page.frameNavigated → http://localhost:41511/phien-ban.json?noi_dung=M%C3%A1y+12+h%E1%BB%8Fng+chu%E1%BB%99t</div>`;

const OUT_PAUSE = `<div class="out"># Sources → ⏸ "Pause on caught exceptions" ticked (CDP: Debugger.setPauseOnExceptions {state: "caught"}), reload
+  236ms ⏸ pause #1 reason=exception  TypeError: Cannot read properties of undefined (reading 'map')
      LichPhong                  App.jsx:13
      react_stack_bottom_frame   react-dom-client.development.js:28571
      — async: &lt;LichPhong&gt; — exports.jsxDEV … ← App App.jsx:67          ← React 19 "owner stack": who rendered LichPhong
+  245ms ⏸ pause #2 reason=exception  Error
      DetermineComponentFrameRoot  react-dom-client.development.js:783     ← React throws on purpose to build component stacks
+  250ms ⏸ pause #3 reason=exception  TypeError: Cannot destructure property 'phong' of 'undefined' as it is undefined.
      LichPhong                  App.jsx:4                                 ← React calling your component with no props, same reason
+  254ms ⏸ pause #4 … #6         Error / TypeError: Cannot read properties of null (reading 'useState')   (all inside React)
+  271ms ⏸ pause #7 reason=exception  TypeError: Cannot read properties of undefined (reading 'map')   App.jsx:13
+  452ms ⏸ pause #8 reason=promiseRejection  Error: Chưa đăng nhập
      goi                        api.js:7
      — async: await — (anonymous) App.jsx:52                            ← the 401 that App swallows with .catch(() =&gt; …)
+  454ms ⏸ pause #9 reason=promiseRejection  Error: Chưa đăng nhập

# same, plus Ignore list (Settings → Ignore list → "/node_modules/"):  9 pauses → 6, none inside React's own throw-and-catch</div>`;

const OUT_KHONG_DUNG = `<div class="out"># API stopped (node api.mjs killed), pause on caught + uncaught, reload
+  218ms [network/error] Failed to load resource: net::ERR_CONNECTION_REFUSED  http://127.0.0.1:41510/api/phong
+  219ms [network/error] Failed to load resource: net::ERR_CONNECTION_REFUSED  http://127.0.0.1:41510/api/toi
+  278ms [Uncaught] TypeError: Failed to fetch   api.js:5
+ 2152ms &lt;option&gt; elements in the room picker: 0            ← and the debugger never paused</div>`;

const NGUON = [
  nguon('📖', 'Chrome DevTools — Console features reference', 'Mức log, bộ lọc (kể cả lọc phủ định -text, url:), Preserve log, Selected context only, Group similar.', 'https://developer.chrome.com/docs/devtools/console/reference'),
  nguon('🧰', 'Chrome DevTools — Console Utilities API', '$0–$4, $_, $(), $$(), $x(), copy(), getEventListeners(), monitorEvents(), queryObjects().', 'https://developer.chrome.com/docs/devtools/console/utilities'),
  nguon('👁', 'Chrome DevTools — Live expressions', 'Biểu thức được tính lại liên tục trên đầu Console.', 'https://developer.chrome.com/docs/devtools/console/live-expressions'),
  nguon('⏸', 'Chrome DevTools — Pause on exceptions', 'Dừng ở ngoại lệ caught/uncaught; Ignore list để bỏ qua mã thư viện.', 'https://developer.chrome.com/docs/devtools/javascript/breakpoints#exceptions'),
  nguon('⚛', 'React — Error boundaries', 'Lỗi khi render không được bắt sẽ gỡ cả cây; error boundary hiện giao diện dự phòng.', 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary'),
  lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-9-1-console', title: 'Khoá Log từ A đến Z — 9.1 Console', sub: 'Đọc Console như đọc log: mức, nguồn, gom lỗi phía người dùng (Sentry…).', cta: 'Mở bài →' }),
  lienKet({ khoa: 'web-foundations', bai: 'wf-10-2-reading-errors-debugging', title: 'Nền tảng Web 10.2 — đọc lỗi và gỡ lỗi', sub: 'Bản nhập môn; bài này là bản chuyên sâu.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '5.1 — Console beyond console.log: levels, $0, preserve log, pause on exceptions|||5.1 — Console hơn cả console.log: mức log, $0, giữ log khi chuyển trang, dừng ở ngoại lệ',
  slug: 'dbg-5-1-console',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Trang trắng trong ứng dụng React thật: lọc nhiễu (Verbose, 401 bình thường, favicon) để thấy lỗi Uncaught đầu tiên ở App.jsx:13; vì sao React 19 gỡ cả cây; Console làm REPL ($$, getEventListeners cho thấy React gắn sự kiện ở #root, console.table/count/assert); Preserve log khi form điều hướng; Pause on caught exceptions dừng 9 lần (6 lần nằm trong React) và Ignore list; fetch thất bại thì debugger không dừng. Output Chrome 150 thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>The page is blank. Open the Console — and read the right line</h2>
<p class="lead">Front-end bugs rarely announce themselves on screen. A button does nothing, a list is empty, the page is white. The browser almost always knows why and has written it down — in the Console. This lesson is about reading the Console like a log (noise vs signal), using it as a live REPL into the page, keeping it across navigations, and making the debugger stop exactly where an exception is thrown.</p>

<h3>An everyday picture: the warning lights on a dashboard</h3>
<p>When a car breaks down, the dashboard lights up like a Christmas tree. The mechanic does not read them left to right; he asks "which light came on <em>first</em>?" — the others are consequences (engine off ⇒ battery light, oil light…). The Console is the same: one real error, then a cascade of consequences and some lights that are always on (normal 401s, favicon 404, framework banners).</p>

<h3>The sample app for this chapter</h3>
<p>LabFlow web: a React 19 page (Vite dev server on <code>localhost:41511</code>) that calls a small API on <code>127.0.0.1:41510</code> to list and book lab rooms. Two origins on purpose — chapter 5.2 and 5.4 need it. It contains several real bugs; each lesson of the chapter catches one or two of them. Full code:</p>
<details><summary>api.mjs — the API (node:http, no framework)</summary>${ma(API, 'js')}</details>
<details><summary>web/src/App.jsx — the page (with bugs)</summary>${ma(APP)}</details>
<details><summary>web/src/api.js, main.jsx, index.html, vite.config.mjs, chay.sh</summary>${ma(API_JS, 'js')}${ma(MAIN)}${ma(INDEX, 'html')}${ma(VITE, 'js')}${ma(CHAY, 'bash')}</details>
<p>Run it: Node 22, then <code>cd web &amp;&amp; npm install</code> (react 19.3, vite 8.3, @vitejs/plugin-react 6.3), <code>bash chay.sh</code>, open <code>http://localhost:41511</code>. The outputs below were captured from Google Chrome 150 driven through the Chrome DevTools Protocol — the same events the DevTools Console renders. Timestamps (<code>+252ms</code>) are ours, added to show order.</p>

<h3>1. The blank page: filter the noise, find the first <em>Uncaught</em></h3>
${OUT_TRANG}
<p>Eleven lines; only one is the cause. Go through them like the mechanic:</p>
<ul>
<li><code>[vite] connecting…</code> — level <strong>Verbose</strong> (<code>console.debug</code>). DevTools hides Verbose by default ("Default levels"); you only see it if you ticked it.</li>
<li>"Download the React DevTools" — an info banner, always there in development.</li>
<li><code>favicon.ico 404</code> — the page has no icon. Harmless.</li>
<li><code>401 /api/toi</code> ×2 — "who am I?" before logging in. 401 is the <em>expected</em> answer. Twice because React Strict Mode runs effects twice in development. Not a bug — yet it is red, and many juniors start "fixing" it.</li>
<li><strong><code>Uncaught TypeError: Cannot read properties of undefined (reading 'map')</code> at <code>App.jsx:13</code></strong> — the real one. <em>Uncaught</em> means nobody caught it; the file is ours, not a library; the first frame is our component <code>LichPhong</code>. React's warning just before it even names the component.</li>
</ul>
<p>Practical filters (Console toolbar): uncheck <em>Verbose</em>; type <code>-favicon</code> or <code>-url:/api/toi</code> to hide lines (a minus means "not"); tick "Hide network" to drop the "Failed to load resource" lines when you hunt a JS error; "Group similar messages" folds repetitions. Click <code>App.jsx:13</code> and Sources opens the original line (Vite serves source maps — chapter 3.5).</p>
${MA_LOI}
<p>Line 13 calls <code>.map</code> on <code>lich</code>. <code>lich</code> came from <code>data.lich</code> on line 8. Is <code>data.lich</code> really undefined? Ask the Console itself:</p>
${OUT_JSON}
<p><strong>Why the whole page is white, not just the list:</strong> since React 18 (and still in 19), an error thrown while rendering that no error boundary catches unmounts the <em>entire</em> root — React prefers "nothing" to a half-correct UI. That is why <code>#root</code> has 0 children. Two fixes, both needed in real projects: read the new field (<code>data.items ?? []</code>) and show errors instead of crashing; wrap risky areas in an error boundary so one broken widget does not blank the whole app.</p>
${MA_SUA}
<p><em>The 💬 left on the page is the chat widget's bubble (a script outside React) — we will meet it again in 5.3.</em></p>

<h3>2. The Console as a REPL into the page</h3>
<p>The Console runs JavaScript in the page's own context, with extra helpers (the "Console Utilities API") that exist <em>only</em> when typed there: <code>$0</code> (the element selected in Elements; <code>$1…$4</code> the previous ones), <code>$('sel')</code> / <code>$$('sel')</code> (querySelector / querySelectorAll as an array), <code>$x('//xpath')</code>, <code>copy(obj)</code> (to clipboard as JSON — perfect for pasting into a bug report), <code>getEventListeners(el)</code>, <code>monitorEvents(el, 'click')</code>, <code>queryObjects(Constructor)</code>. Top-level <code>await</code> works too. Real session on the fixed page:</p>
${OUT_REPL}
<p>Two lessons hide in that output. First: the button's own <code>click</code> listener is React's empty <code>noop$1</code> (a trick for old iOS Safari); your real <code>onClick</code> is reached through <code>dispatchDiscreteEvent</code> attached once on <code>#root</code>. So "Event Listeners" in Elements will never show your handler for a React element — you will use a different route in 5.3. Second: <code>console.table</code>, <code>console.count</code> and <code>console.assert</code> beat a wall of <code>console.log</code> when you debug data: a table you can read, a counter that tells you "this ran 2 times, not 1", an assertion that is silent until the assumption breaks.</p>
<p><strong>Live expression</strong> (the eye icon at the top of the Console): pin an expression such as <code>document.activeElement</code> or <code>$$('li').length</code>; DevTools re-evaluates it continuously while you click around. It is the browser cousin of the Watch panel.</p>

<h3>3. "The log disappeared": Preserve log</h3>
<p>A feedback form that "sends nothing, shows nothing":</p>
${MA_GOPY}
${OUT_GIU}
<p>The handler did log an error — then the browser submitted the form (no <code>e.preventDefault()</code>), navigated, and DevTools cleared the Console on the new document. You saw a flash at best. Tick <strong>Preserve log</strong> (Console settings; Network has its own checkbox) whenever the bug involves a redirect, a login, a form post or a full reload. Logs from the old page stay, with a "Navigated to …" separator.</p>

<h3>4. Pause on exceptions — and why it stops nine times</h3>
<p>The Console tells you <em>where</em> it crashed but by then the stack has unwound: you cannot inspect <code>data</code> any more. In Sources, the ⏸ panel has <em>Pause on uncaught exceptions</em> and <em>Pause on caught exceptions</em>; the debugger then stops at the <code>throw</code>, with all variables alive. We ticked "caught" and reloaded:</p>
${OUT_PAUSE}
<ul>
<li>Pause #1 is our crash, with variables alive — hover <code>lich</code>, see <code>undefined</code>; look at the async part: React 19 even shows the "owner stack" (App rendered LichPhong at App.jsx:67).</li>
<li>Pauses #2–#6 are React itself: in development it deliberately throws and catches errors (<code>DetermineComponentFrameRoot</code>) and even calls your component with no props to compute pretty component stacks. That is noise. Add <code>/node_modules/</code> to the <strong>Ignore list</strong> and the debugger only stops in your code: 9 pauses became 6 in our run.</li>
<li>Pause #8–#9 are the swallowed 401: <code>throw new Error('Chưa đăng nhập')</code> in <code>api.js</code>, caught by <code>.catch(() =&gt; setToi(null))</code>. "Caught" mode is how you find the errors that someone hid with an empty <code>catch</code> — the browser twin of the IntelliJ exception breakpoint of lesson 4.2.</li>
</ul>
<p><strong>A limit we measured:</strong> when the API is down, <code>fetch</code> rejects with "Failed to fetch" — and the debugger did <em>not</em> pause, in either mode:</p>
${OUT_KHONG_DUNG}
<p>The rejection is created by the browser's network layer, not by a <code>throw</code> in JavaScript, so V8 has no throw site to stop at. For network failures your tools are the Network panel (5.2) and a fetch/XHR breakpoint (5.3).</p>

<h3>On the job: "the page is white" tickets</h3>
<p>At an outsourcing company, the tester or the client often reports "màn hình trắng" with a screenshot of… a white screen. Reply with a short, polite checklist they can follow: F12 → Console → tick <em>Preserve log</em> → reload → screenshot the <strong>first red line</strong> and the line before it, plus the URL and the time. You will save a day of "cannot reproduce". When you report upward yourself, write the sentence a lead wants: "White page on /dat-phong since API v2 renamed <code>lich</code> → <code>items</code>; LichPhong throws at App.jsx:13; fix + error boundary in PR #…".</p>

<h3>Hacker corner: self-XSS through the Console</h3>
<p>The Console runs anything you paste with your session. Scammers exploit that: "paste this code in F12 to get free coins / see who viewed your profile" — the code reads your page, posts as you, or steals what JavaScript can reach (localStorage tokens; not HttpOnly cookies — lesson 5.4). This is why Facebook prints a huge red <em>"Stop!"</em> in its Console, and why recent Chrome versions make first-time users type <code>allow pasting</code> before a paste into the Console works. Rules: never paste code you do not understand; in your own apps, never keep secrets where page JavaScript can read them.</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<ol>
<li>Run the sample, open the blank page, and with filters (no scrolling) get the Console down to the one line that matters. Write which filters you used.</li>
<li>From the Console only, prove what <code>/api/dat-cho</code> returns; fix <code>App.jsx</code>; add an error boundary around <code>LichPhong</code> and make it show "Không tải được lịch".</li>
<li>Use <code>$$</code>, <code>console.table</code> and <code>copy()</code> to put the room list into a bug report as JSON.</li>
<li>Open <code>/gop-y.html</code>, reproduce the vanishing log, then catch it with Preserve log.</li>
<li>Turn on "Pause on caught exceptions": count the pauses with and without <code>/node_modules/</code> in the Ignore list.</li>
</ol>
<p><strong>Done when:</strong> you can explain each red line of the first output as "cause", "consequence" or "normal", and your fixed page shows an error message instead of turning white when the API changes.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Uncaught</span><span class="v">An exception nobody caught — usually the cause, especially the first one from your files.</span></div>
  <div class="kv"><span class="k">Log levels</span><span class="v">Verbose (debug), Info, Warnings, Errors — Verbose hidden by default.</span></div>
  <div class="kv"><span class="k">Console Utilities API</span><span class="v">$0, $$, copy, getEventListeners… — helpers available only in the Console.</span></div>
  <div class="kv"><span class="k">Live expression</span><span class="v">An expression pinned on top of the Console, re-evaluated continuously.</span></div>
  <div class="kv"><span class="k">Preserve log</span><span class="v">Keep Console/Network entries across navigations and reloads.</span></div>
  <div class="kv"><span class="k">Pause on caught exceptions</span><span class="v">Stop at every throw, even those caught — finds swallowed errors.</span></div>
  <div class="kv"><span class="k">Ignore list</span><span class="v">Scripts the debugger skips (node_modules) — fewer pauses, cleaner stacks.</span></div>
  <div class="kv"><span class="k">Error boundary</span><span class="v">React component that catches render errors below it and shows a fallback.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Read the Console like a dashboard: first <em>Uncaught</em> error from your own file; the rest is consequence or normal noise.</li>
<li>Filters (levels, <code>-text</code>, <code>url:</code>, hide network) beat scrolling.</li>
<li>A render error without an error boundary blanks the whole React root.</li>
<li>The Console is a REPL with helpers; React handlers live on <code>#root</code>, not on the button.</li>
<li>Preserve log for anything that navigates; Pause on caught exceptions + Ignore list for swallowed errors; network failures need the Network panel.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Trang trắng tinh. Mở Console — và đọc đúng dòng</h2>
<p class="lead">Lỗi giao diện hiếm khi tự hiện lên màn hình. Nút bấm không làm gì, danh sách trống, trang trắng tinh. Trình duyệt gần như luôn biết vì sao và đã ghi lại — trong Console. Bài này dạy đọc Console như đọc log (đâu là nhiễu, đâu là tín hiệu), dùng nó làm REPL chạy thẳng trong trang, giữ log qua các lần chuyển trang, và bắt debugger dừng đúng chỗ ngoại lệ bị ném.</p>

<h3>Liên tưởng đời thường: đèn cảnh báo trên táp-lô xe</h3>
<p>Xe chết máy, táp-lô sáng như cây thông Noel. Thợ sửa không đọc từ trái sang phải; anh hỏi "đèn nào sáng <em>đầu tiên</em>?" — mấy đèn kia là hệ quả (tắt máy ⇒ đèn ắc quy, đèn dầu…). Console cũng thế: một lỗi thật, theo sau là một loạt hệ quả, cộng vài đèn lúc nào cũng sáng (401 bình thường, favicon 404, dòng quảng cáo của framework).</p>

<h3>Ứng dụng mẫu của chương</h3>
<p>LabFlow web: một trang React 19 (Vite dev server ở <code>localhost:41511</code>) gọi một API nhỏ ở <code>127.0.0.1:41510</code> để xem và đặt phòng lab. Cố ý để hai origin — bài 5.2 và 5.4 cần điều đó. Ứng dụng có sẵn nhiều lỗi thật; mỗi bài trong chương bắt một hai lỗi. Mã đầy đủ:</p>
<details><summary>api.mjs — API (node:http, không framework)</summary>${ma(API, 'js')}</details>
<details><summary>web/src/App.jsx — trang (còn lỗi)</summary>${ma(APP)}</details>
<details><summary>web/src/api.js, main.jsx, index.html, vite.config.mjs, chay.sh</summary>${ma(API_JS, 'js')}${ma(MAIN)}${ma(INDEX, 'html')}${ma(VITE, 'js')}${ma(CHAY, 'bash')}</details>
<p>Chạy: Node 22, rồi <code>cd web &amp;&amp; npm install</code> (react 19.3, vite 8.3, @vitejs/plugin-react 6.3), <code>bash chay.sh</code>, mở <code>http://localhost:41511</code>. Các output dưới đây lấy từ Google Chrome 150 điều khiển qua Chrome DevTools Protocol — chính các sự kiện mà bảng Console của DevTools vẽ ra. Mốc thời gian (<code>+252ms</code>) do chúng tôi thêm để thấy thứ tự.</p>

<h3>1. Trang trắng: lọc nhiễu, tìm dòng <em>Uncaught</em> đầu tiên</h3>
${OUT_TRANG}
<p>Mười một dòng; chỉ một dòng là nguyên nhân. Đi qua từng dòng như anh thợ:</p>
<ul>
<li><code>[vite] connecting…</code> — mức <strong>Verbose</strong> (<code>console.debug</code>). DevTools mặc định ẩn Verbose ("Default levels"); bạn chỉ thấy nếu đã tích nó.</li>
<li>"Download the React DevTools" — dòng giới thiệu, lúc nào cũng có ở môi trường dev.</li>
<li><code>favicon.ico 404</code> — trang không có biểu tượng. Vô hại.</li>
<li><code>401 /api/toi</code> ×2 — hỏi "tôi là ai?" trước khi đăng nhập. 401 là câu trả lời <em>đúng mong đợi</em>. Hai lần vì Strict Mode của React chạy effect hai lần ở dev. Không phải lỗi — nhưng nó đỏ, và nhiều bạn mới đi làm lao vào "sửa" nó.</li>
<li><strong><code>Uncaught TypeError: Cannot read properties of undefined (reading 'map')</code> ở <code>App.jsx:13</code></strong> — dòng thật. <em>Uncaught</em> nghĩa là không ai bắt; tệp là của mình, không phải thư viện; frame đầu là component <code>LichPhong</code> của mình. Cảnh báo của React ngay trước đó còn gọi đúng tên component.</li>
</ul>
<p>Bộ lọc dùng hằng ngày (thanh công cụ Console): bỏ tích <em>Verbose</em>; gõ <code>-favicon</code> hoặc <code>-url:/api/toi</code> để ẩn dòng (dấu trừ nghĩa là "không phải"); tích "Hide network" để bỏ các dòng "Failed to load resource" khi đang săn lỗi JS; "Group similar messages" gộp dòng lặp. Bấm <code>App.jsx:13</code> là Sources mở đúng dòng gốc (Vite phục vụ source map — bài 3.5).</p>
${MA_LOI}
<p>Dòng 13 gọi <code>.map</code> trên <code>lich</code>. <code>lich</code> lấy từ <code>data.lich</code> ở dòng 8. <code>data.lich</code> có thật là undefined? Hỏi luôn Console:</p>
${OUT_JSON}
<p><strong>Vì sao cả trang trắng chứ không riêng danh sách:</strong> từ React 18 (và vẫn thế ở 19), lỗi ném ra trong lúc render mà không có error boundary nào bắt sẽ gỡ <em>toàn bộ</em> root — React thà hiện "không gì" còn hơn giao diện đúng một nửa. Vì vậy <code>#root</code> có 0 phần tử con. Hai cách sửa, dự án thật cần cả hai: đọc trường mới (<code>data.items ?? []</code>) và hiện lỗi thay vì sập; bọc vùng rủi ro bằng error boundary để một widget hỏng không làm trắng cả ứng dụng.</p>
${MA_SUA}
<p><em>Hình 💬 còn sót trên trang là bong bóng của widget chat (một script nằm ngoài React) — gặp lại nó ở bài 5.3.</em></p>

<h3>2. Console là REPL chạy thẳng trong trang</h3>
<p>Console chạy JavaScript trong ngữ cảnh của chính trang, kèm bộ trợ giúp ("Console Utilities API") <em>chỉ</em> có khi gõ ở đó: <code>$0</code> (phần tử đang chọn ở tab Elements; <code>$1…$4</code> là các phần tử chọn trước), <code>$('sel')</code> / <code>$$('sel')</code> (querySelector / querySelectorAll trả về mảng), <code>$x('//xpath')</code>, <code>copy(obj)</code> (chép vào clipboard dạng JSON — dán thẳng vào bug report), <code>getEventListeners(el)</code>, <code>monitorEvents(el, 'click')</code>, <code>queryObjects(Constructor)</code>. <code>await</code> ở cấp ngoài cùng cũng chạy. Phiên thật trên trang đã sửa:</p>
${OUT_REPL}
<p>Có hai bài học trong output đó. Một: listener <code>click</code> của chính nút bấm là hàm rỗng <code>noop$1</code> của React (mẹo cho Safari iOS cũ); <code>onClick</code> thật của bạn được gọi qua <code>dispatchDiscreteEvent</code> gắn một lần ở <code>#root</code>. Nên mục "Event Listeners" ở tab Elements sẽ không bao giờ chỉ ra handler của bạn với phần tử React — bài 5.3 dùng đường khác. Hai: <code>console.table</code>, <code>console.count</code>, <code>console.assert</code> hơn hẳn một bức tường <code>console.log</code> khi soi dữ liệu: bảng đọc được ngay, bộ đếm nói "chạy 2 lần chứ không phải 1", assertion im lặng cho tới khi giả định bị phá.</p>
<p><strong>Live expression</strong> (biểu tượng con mắt trên đầu Console): ghim một biểu thức như <code>document.activeElement</code> hay <code>$$('li').length</code>; DevTools tính lại liên tục trong lúc bạn bấm qua lại. Nó là anh em phía trình duyệt của bảng Watch.</p>

<h3>3. "Log biến mất": Preserve log</h3>
<p>Một form góp ý "gửi không được, không báo gì":</p>
${MA_GOPY}
${OUT_GIU}
<p>Handler có ghi lỗi thật — rồi trình duyệt gửi form (thiếu <code>e.preventDefault()</code>), chuyển trang, và DevTools xoá Console khi sang tài liệu mới. Cùng lắm bạn thấy chớp một cái. Tích <strong>Preserve log</strong> (trong cài đặt Console; tab Network có ô riêng) mỗi khi lỗi dính tới chuyển hướng, đăng nhập, gửi form hay tải lại cả trang. Log của trang cũ được giữ, có dòng ngăn "Navigated to …".</p>

<h3>4. Pause on exceptions — và vì sao nó dừng chín lần</h3>
<p>Console nói lỗi ở <em>đâu</em> nhưng lúc đó stack đã tháo hết: bạn không xem được <code>data</code> nữa. Ở tab Sources, khung ⏸ có <em>Pause on uncaught exceptions</em> và <em>Pause on caught exceptions</em>; debugger sẽ dừng ngay ở chỗ <code>throw</code>, mọi biến còn sống. Chúng tôi tích "caught" rồi tải lại:</p>
${OUT_PAUSE}
<ul>
<li>Lần #1 là chỗ sập của mình, biến còn sống — rê chuột vào <code>lich</code> thấy <code>undefined</code>; nhìn phần async: React 19 còn cho "owner stack" (App render LichPhong ở App.jsx:67).</li>
<li>Lần #2–#6 là chính React: ở dev nó cố ý ném rồi bắt lỗi (<code>DetermineComponentFrameRoot</code>), thậm chí gọi component của bạn không có props, chỉ để dựng component stack cho đẹp. Đó là nhiễu. Thêm <code>/node_modules/</code> vào <strong>Ignore list</strong> là debugger chỉ dừng trong mã của mình: lần chạy của chúng tôi từ 9 lần còn 6.</li>
<li>Lần #8–#9 là cái 401 bị nuốt: <code>throw new Error('Chưa đăng nhập')</code> trong <code>api.js</code>, bị <code>.catch(() =&gt; setToi(null))</code> bắt. Chế độ "caught" là cách tìm những lỗi ai đó giấu bằng <code>catch</code> rỗng — anh em phía trình duyệt của exception breakpoint IntelliJ ở bài 4.2.</li>
</ul>
<p><strong>Một giới hạn chúng tôi đo được:</strong> khi API tắt, <code>fetch</code> bị reject với "Failed to fetch" — và debugger <em>không</em> dừng, ở cả hai chế độ:</p>
${OUT_KHONG_DUNG}
<p>Lời từ chối đó do tầng mạng của trình duyệt tạo ra, không phải một câu <code>throw</code> trong JavaScript, nên V8 không có chỗ ném nào để dừng. Với lỗi mạng, công cụ của bạn là tab Network (5.2) và breakpoint fetch/XHR (5.3).</p>

<h3>Tình huống đi làm: ticket "màn hình trắng"</h3>
<p>Ở công ty outsourcing, tester hoặc khách hay báo "màn hình trắng" kèm ảnh chụp… một màn hình trắng. Hãy trả lời bằng một danh sách ngắn, lịch sự để họ làm theo: F12 → Console → tích <em>Preserve log</em> → tải lại → chụp <strong>dòng đỏ đầu tiên</strong> và dòng ngay trước nó, kèm URL và giờ. Bạn tiết kiệm được cả ngày "không tái hiện được". Khi chính bạn báo cáo lên, viết đúng câu trưởng nhóm muốn đọc: "Trang /dat-phong trắng từ khi API v2 đổi <code>lich</code> → <code>items</code>; LichPhong ném lỗi ở App.jsx:13; sửa + thêm error boundary ở PR #…".</p>

<h3>Góc hacker: self-XSS qua Console</h3>
<p>Console chạy bất cứ thứ gì bạn dán vào, với phiên đăng nhập của bạn. Kẻ lừa đảo lợi dụng đúng điều đó: "dán đoạn mã này vào F12 để nhận xu miễn phí / xem ai vào trang cá nhân" — đoạn mã đọc trang, đăng bài dưới tên bạn, hoặc lấy mọi thứ JavaScript với tới được (token trong localStorage; cookie HttpOnly thì không — bài 5.4). Vì vậy Facebook in một chữ <em>"Stop!"</em> đỏ thật to trong Console, và các bản Chrome gần đây bắt người dùng lần đầu gõ <code>allow pasting</code> trước khi cho dán vào Console. Luật: không bao giờ dán mã mình không hiểu; trong ứng dụng của mình, đừng để bí mật ở chỗ JavaScript của trang đọc được.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy ứng dụng mẫu, mở trang trắng, dùng bộ lọc (không cuộn) thu Console về đúng một dòng quan trọng. Ghi lại bạn đã dùng bộ lọc nào.</li>
<li>Chỉ dùng Console, chứng minh <code>/api/dat-cho</code> trả về gì; sửa <code>App.jsx</code>; thêm error boundary bọc <code>LichPhong</code> và cho nó hiện "Không tải được lịch".</li>
<li>Dùng <code>$$</code>, <code>console.table</code> và <code>copy()</code> để đưa danh sách phòng vào bug report dạng JSON.</li>
<li>Mở <code>/gop-y.html</code>, tái hiện cảnh log biến mất, rồi bắt lại bằng Preserve log.</li>
<li>Bật "Pause on caught exceptions": đếm số lần dừng khi có và không có <code>/node_modules/</code> trong Ignore list.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được mỗi dòng đỏ của output đầu tiên là "nguyên nhân", "hệ quả" hay "bình thường", và trang đã sửa hiện thông báo lỗi thay vì trắng tinh khi API đổi.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Uncaught</span><span class="v">Ngoại lệ không ai bắt — thường là nguyên nhân, nhất là dòng đầu tiên từ tệp của mình.</span></div>
  <div class="kv"><span class="k">Mức log</span><span class="v">Verbose (debug), Info, Warnings, Errors — Verbose mặc định bị ẩn.</span></div>
  <div class="kv"><span class="k">Console Utilities API</span><span class="v">$0, $$, copy, getEventListeners… — trợ giúp chỉ có trong Console.</span></div>
  <div class="kv"><span class="k">Live expression</span><span class="v">Biểu thức ghim trên đầu Console, tính lại liên tục.</span></div>
  <div class="kv"><span class="k">Preserve log</span><span class="v">Giữ dòng Console/Network qua các lần chuyển trang và tải lại.</span></div>
  <div class="kv"><span class="k">Pause on caught exceptions</span><span class="v">Dừng ở mọi lần ném, kể cả lỗi đã bị bắt — tìm lỗi bị nuốt.</span></div>
  <div class="kv"><span class="k">Ignore list</span><span class="v">Các script debugger bỏ qua (node_modules) — ít lần dừng, stack sạch.</span></div>
  <div class="kv"><span class="k">Error boundary</span><span class="v">Component React bắt lỗi render của cây con và hiện giao diện dự phòng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc Console như táp-lô: lỗi <em>Uncaught</em> đầu tiên trong tệp của mình; còn lại là hệ quả hoặc nhiễu bình thường.</li>
<li>Bộ lọc (mức, <code>-chữ</code>, <code>url:</code>, ẩn network) nhanh hơn cuộn.</li>
<li>Lỗi render không có error boundary làm trắng cả root React.</li>
<li>Console là REPL có trợ giúp; handler React nằm ở <code>#root</code>, không nằm trên nút.</li>
<li>Preserve log cho mọi thứ có chuyển trang; Pause on caught exceptions + Ignore list cho lỗi bị nuốt; lỗi mạng cần tab Network.</li>
</ul>
${NGUON}
</div>
`,
};
