/**
 * 5.3 — Sources: breakpoint, breakpoint DOM, fetch/XHR, event listener, local overrides (soạn 24/11/2026).
 * Output THẬT: Chrome 150 headless + CDP (DOMDebugger.setXHRBreakpoint / setDOMBreakpoint / setEventListenerBreakpoint,
 * Debugger.setBlackboxPatterns, Fetch.fulfillRequest = cơ chế tương đương Local overrides). Tập lệnh: lab/ch5/tools/c53-*.mjs.
 * Dòng dừng đầu tiên "listener" không có URL trong phiên event-listener là listener của chính Playwright (công cụ lái) — đã lược và ghi chú.
 */
import { nguon, lienKet } from '../_chung.mjs';
import { WIDGET, WIDGET_SUA } from './_ma-5.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;

const OUT_FETCH = `<div class="out"># Sources → XHR/fetch Breakpoints → + "URL contains": /api/dat-cho     (CDP: DOMDebugger.setXHRBreakpoint)
# type 18:00, click "Lưu" once
+ 1728ms ⏸ pause #1  reason=XHR  url~/api/dat-cho
      goi          api.js:5
      luu          App.52.jsx:25
      onClick      App.52.jsx:39
      executeDispatch … dispatchDiscreteEvent        react-dom-client.development.js   (ignore-listed)
      — &lt;button&gt; —                                   ← React 19 owner stack: the JSX element that owns this handler
      DatChoForm   App.52.jsx:39
+ 1733ms ⏸ pause #2  reason=XHR  url~/api/dat-cho
      goi          api.js:5
      luu          App.52.jsx:25
      executeDispatch … dispatchDiscreteEvent        react-dom-client.development.js   (ignore-listed)
      — &lt;form&gt; —
      DatChoForm   App.52.jsx:37</div>`;

const OUT_DOM = `<div class="out"># Elements → right-click &lt;div id="thong-bao"&gt; → Break on → node removal   (CDP: DOMDebugger.setDOMBreakpoint node-removed)
+  475ms ● DOM breakpoint: #thong-bao — node removal
+ 1662ms ⏸ pause #1  reason=DOM  type=node-removed
      donCho       widget-ho-tro.js:5          ← not React, not our code: the chat widget
      (anonymous)  widget-ho-tro.js:9          ← setTimeout(donCho, 1500)
      › cu.className = "thong-bao"             ← evaluated in the paused frame</div>`;

const OUT_SUKIEN = `<div class="out"># Sources → Event Listener Breakpoints → Mouse → click     (CDP: DOMDebugger.setEventListenerBreakpoint "click")
# without Ignore list — one click on "Lưu":
⏸ #1 reason=EventListener event=listener:click   dispatchDiscreteEvent   react-dom-client.development.js:26105
⏸ #2 reason=EventListener event=listener:click   noop$1                  react-dom-client.development.js:3353
⏸ #3 reason=EventListener event=listener:click   dispatchDiscreteEvent   react-dom-client.development.js:26105
⏸ #4 reason=EventListener event=listener:click   noop$1                  react-dom-client.development.js:3353
                                                  ← four stops, none in your code
# with Ignore list "/node_modules/":
⏸ #1 reason=EventListener event=listener:click   onClick                 App.52.jsx:39     ← straight to the handler
(one extra stop per run, a listener installed by the automation tool we used to click, is omitted)</div>`;

const OUT_GHIDE = `<div class="out"># Sources → Overrides → select folder; Network → right-click widget-ho-tro.js → Override content; edit line 4; reload
# (here done with CDP Fetch.fulfillRequest — the same "serve my local copy instead" mechanism)
+   74ms ↺ widget-ho-tro.js served from overrides/widget-ho-tro.js (446 bytes)
+ 2717ms #thong-bao still on the page: true            ← fix confirmed in the real page before anyone deploys</div>`;

const OUT_XOA = `<div class="out"># logged out, page shows only "Đăng nhập" and "Lưu" — no delete button anywhere
&gt; $$('button').map((b) =&gt; b.textContent)
&lt; ["Đăng nhập","Lưu"]
&gt; (await fetch('/api/dat-cho/1', { method: 'DELETE' })).status
&lt; 204                                       ← someone else's booking, deleted without logging in
&gt; (await (await fetch('/api/dat-cho?phong=401')).json()).items.map((d) =&gt; d.id)
&lt; [2]

# after the API checks the session and the owner (SUA=quyen):
&gt; (await fetch('/api/dat-cho/1', { method: 'DELETE' })).status
&lt; 401
&gt; (await (await fetch('/api/dat-cho?phong=401')).json()).items.map((d) =&gt; d.id)
&lt; [1,2]</div>`;

const MA_QUYEN = ma(`if (req.method === 'DELETE' &amp;&amp; mXoa) {
  const i = datCho.findIndex((x) =&gt; x.id === Number(mXoa[1]));
  if (i &lt; 0) return json(res, 404, { loi: 'Không có lượt này' });
  const ten = phien.get(cookieCua(req).sid);                    // who is calling? (server side, every time)
  if (!ten) return json(res, 401, { loi: 'Chưa đăng nhập' });
  if (datCho[i].nguoiDat !== ten) return json(res, 403, { loi: 'Không phải lượt của bạn' });
  datCho.splice(i, 1); res.writeHead(204); res.end(); return;
}`);

const NGUON = [
  nguon('🧷', 'Chrome DevTools — Pause your code with breakpoints', 'Line, conditional, logpoint, DOM change, XHR/fetch, event listener, exception, function breakpoints.', 'https://developer.chrome.com/docs/devtools/javascript/breakpoints'),
  nguon('📝', 'Chrome DevTools — Local overrides', 'Ghi đè nội dung và header response bằng tệp cục bộ, giữ qua các lần tải lại.', 'https://developer.chrome.com/docs/devtools/overrides'),
  nguon('🙈', 'Chrome DevTools — Ignore list', 'Bỏ qua mã thư viện khi step, khi dừng ở ngoại lệ và trong call stack.', 'https://developer.chrome.com/docs/devtools/settings/ignore-list'),
  nguon('🔓', 'OWASP Top 10 2021 — A01 Broken Access Control', 'Hạng 1: kiểm quyền thiếu ở server, IDOR, dựa vào giao diện để giấu chức năng.', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'),
  nguon('📰', 'KrebsOnSecurity — First American Financial leaked 885 million records (05/2019)', 'Đổi số trong URL là xem được hồ sơ của người khác — không có kiểm quyền phía server.', 'https://krebsonsecurity.com/2019/05/first-american-financial-corp-leaked-hundreds-of-millions-of-title-insurance-records/'),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-3-5-trinh-duyet', title: 'Bài 3.5 — breakpoint trong component React bằng VS Code', sub: 'Source map Vite, đặt breakpoint ở dòng .jsx gốc, Next.js server/client.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-3-2-breakpoint', title: 'Bài 3.2 — breakpoint điều kiện, đếm lượt, logpoint', sub: 'Cùng các loại breakpoint, phía Node.js — DevTools có đúng những loại đó.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '5.3 — Sources: breakpoints, DOM, fetch/XHR and event-listener breakpoints, local overrides|||5.3 — Sources: breakpoint, breakpoint DOM, fetch/XHR, event listener, local overrides',
  slug: 'dbg-5-3-sources',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Breakpoint fetch "URL chứa /api/dat-cho" dừng hai lần cho một lần bấm — call stack và owner stack React 19 chỉ ra <button> onClick và <form> onSubmit; DOM breakpoint "node removal" bắt widget chat bên thứ ba xoá nhầm thông báo; event listener breakpoint dừng 4 lần trong React, có Ignore list thì vào thẳng onClick; Local overrides sửa thử widget ngay trên trang; góc hacker: ẩn nút Xoá không phải phân quyền (DELETE từ Console ra 204), OWASP A01, First American 2019.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Stop the page at the moment something happens — not at a line you guess</h2>
<p class="lead">A line breakpoint needs you to know <em>where</em> to look. Front-end bugs often start with "something happened and I do not know which code did it": a request went out twice, an element vanished, a click did something odd. Sources has breakpoints that trigger on the <em>event</em> instead of on a line: a request to a URL, a change to a DOM node, a kind of DOM event. Then you read the call stack and arrive at the line.</p>

<h3>An everyday picture: three kinds of alarms</h3>
<p>A line breakpoint is a guard you post at one door. A fetch breakpoint is the post office calling you whenever a letter to a certain address is sent — you then ask who wrote it. A DOM breakpoint is a motion sensor on one specific shelf — whoever touches it, the alarm rings with their face on camera. An event-listener breakpoint is a doorbell that rings for any visitor of a type — useful, but at a busy door (React) it rings for the receptionist first.</p>

<h3>0. The basics you already know</h3>
<p>Everything from chapter 3 works the same in DevTools: Ctrl+P (⌘P) opens a file by name, Ctrl+Shift+F searches all sources, click a line number for a breakpoint, right-click it for a <em>conditional breakpoint</em> or a <em>logpoint</em>, Watch, Scope, Call Stack, step over/into/out. With Vite or Next.js, source maps show your original <code>.jsx</code>/<code>.tsx</code>. Breakpoints in React components and VS Code's "type: chrome" launch were covered in lesson 3.5; this lesson is about the breakpoints that do not need a line.</p>

<h3>1. fetch/XHR breakpoint: who sent this request?</h3>
<p>The double-POST bug from 5.2, caught from the other side. Sources → <em>XHR/fetch Breakpoints</em> → <code>+</code> → "URL contains" <code>/api/dat-cho</code> (an empty value = every request). Click Lưu once:</p>
${OUT_FETCH}
<p>The debugger stops <em>before</em> the request is sent, inside <code>goi()</code>, so you can still inspect <code>tuyChon.body</code>. The call stacks differ in exactly one place: pause #1 goes through <code>onClick</code> owned by <code>&lt;button&gt;</code>; pause #2 goes straight from React's dispatcher to <code>luu</code>, owned by <code>&lt;form&gt;</code> — that is <code>onSubmit</code>. The "— &lt;button&gt; —" lines are React 19's <strong>owner stacks</strong>: as an async-style part of the stack, React records which JSX element created the handler, so you see your component tree, not only React's internals. With <code>/node_modules/</code> on the Ignore list, the internal frames collapse and the stack reads like your code.</p>
<p>When is a fetch breakpoint better than the Initiator column? When you need the <em>state at that moment</em> (variables, the request body, why a guard did not stop it), or when the request is fired from deep in a library (an SDK, a retry helper) and you need to step back up.</p>

<h3>2. DOM breakpoint: who removed my element?</h3>
<p>Report: "The yellow banner 'Đăng nhập để đặt phòng' appears for a second, then disappears". Nothing in <code>App.jsx</code> touches it — it lives in <code>index.html</code>, outside React. In Elements, right-click the <code>&lt;div id="thong-bao"&gt;</code> → <strong>Break on</strong> → <em>node removal</em> (other options: <em>subtree modifications</em>, <em>attribute modifications</em> — e.g. "who sets <code>style="display:none"</code>"). Reload:</p>
${OUT_DOM}
${ma(WIDGET)}
<p>The culprit is the third-party chat widget: it removes "its" old notice with <code>document.querySelector('.thong-bao')</code> — and our banner has the same class name. Nobody would have found this by reading our code. Fixes, in order of how much you control: give our element a namespaced class/id (<code>labflow-thong-bao</code>); ask the vendor to scope their selectors; load the widget in an iframe if it keeps misbehaving.</p>
<p>The DOM breakpoint is equally good for React: "who re-renders this node?" (subtree modifications) — in our run the stack went <code>removeChild</code> ← <code>commitRoot</code>, then the owner stack <code>— &lt;li&gt; —</code> ← <code>LichPhong App.sua.jsx:18</code>: the component that rendered the list.</p>

<h3>3. Event listener breakpoints — and why React needs the Ignore list</h3>
${OUT_SUKIEN}
<p>Event Listener Breakpoints (Mouse → click, Keyboard → keydown, Control → submit, Timer → setTimeout fired, …) stop in the first listener that runs. In a React app that is React's root dispatcher (<code>dispatchDiscreteEvent</code>, capture then bubble) and the empty <code>noop$1</code> on the element — as you saw with <code>getEventListeners</code> in 5.1. Add <code>/node_modules/</code> to the Ignore list and DevTools skips those, stopping at your <code>onClick</code>. The same trick is essential for "Timer → setTimeout fired" or "Script → Script first statement" in any app with libraries. The Elements → Event Listeners pane has a "Framework listeners" checkbox for the same reason.</p>

<h3>4. Local overrides: try a fix on the real page</h3>
<p>You think you know the fix for the widget, but the widget is served from someone else's CDN, or the build takes 10 minutes. <strong>Local overrides</strong> let DevTools serve your edited copy of any response:</p>
<ol>
<li>Sources → Overrides → <em>Select folder for overrides</em> → allow access.</li>
<li>Network (or Sources) → right-click <code>widget-ho-tro.js</code> → <em>Override content</em>. Edit, save (Ctrl+S). A purple dot marks overridden files.</li>
<li>Reload: the browser now uses your file, every time, until you disable overrides.</li>
</ol>
${ma(WIDGET_SUA)}
${OUT_GHIDE}
<p>Overrides also work for <strong>response headers</strong> (e.g. add <code>Access-Control-Allow-Origin</code> to test a CORS fix before the backend deploys) and, in recent Chrome versions, for fetch/XHR <strong>response bodies</strong> (simulate the API v2 change from 5.1 without touching the API). Remember to turn them off — "it works only in my browser" is the next bug you will create. Keep the overrides folder out of git.</p>

<h3>Hacker corner: hiding a button is not authorization</h3>
<p>The page offers no delete button for other people's bookings. Overrides (or just the Console) let anyone do what the UI does not offer:</p>
${OUT_XOA}
<p>Anything the browser can do, a user can do — edit JS, re-enable a disabled button, change a hidden field, replay a request with another id. This is <strong>Broken Access Control</strong>, number 1 of the OWASP Top 10 (2021). A famous case: in May 2019 First American Financial exposed about 885 million mortgage records — changing a number in a document URL showed other customers' files, because the server never checked who was asking (KrebsOnSecurity). Fix on the server, every request:</p>
${MA_QUYEN}
<p>Front-end checks are for user experience; server checks are for security. When you debug with DevTools and notice the UI is the only thing preventing an action, write it up as a security bug — that is a valuable finding in any OJT.</p>

<h3>On the job</h3>
<p>Your project uses a vendor's payment or chat script and something on your page breaks only when that script is present. Before arguing with the vendor: DOM breakpoint on the element that breaks, read the stack, then build a minimal page that reproduces it with their script. Send them the stack, the selector they used, and the reproduction. Vendors fix concrete reports quickly; "your widget breaks our site" sits in a queue for weeks.</p>

<h3>🧪 Practice (35 min)</h3>
<div class="callout ok">
<ol>
<li>Set a fetch breakpoint on <code>/api/dat-cho</code>, click Lưu once, and write down the two stacks; read <code>tuyChon.body</code> at each pause.</li>
<li>Find who removes <code>#thong-bao</code> with a DOM breakpoint; then (fixed app) put <em>subtree modifications</em> on the <code>&lt;ul&gt;</code> of the list, switch to Lab 402, and follow the stack from <code>removeChild</code> through <code>commitRoot</code> to the owner stack <code>— &lt;li&gt; —</code> ⇒ <code>LichPhong</code>.</li>
<li>Click breakpoint with and without the Ignore list; count the pauses.</li>
<li>Override <code>widget-ho-tro.js</code> with the fix; then override the API's <code>/api/dat-cho</code> response to <code>{"lich": []}</code> and watch the 5.1 bug come back.</li>
<li>From the Console, try deleting booking 1 while logged out; write the security bug report (title, steps, impact, fix).</li>
</ol>
<p><strong>Done when:</strong> you found each culprit from a breakpoint that was <em>not</em> on a line you guessed, and you can explain why the Ignore list changes where DevTools stops.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">XHR/fetch breakpoint</span><span class="v">Pause before a request whose URL contains a string is sent.</span></div>
  <div class="kv"><span class="k">DOM breakpoint</span><span class="v">Pause when a node is removed, its subtree changes, or an attribute changes.</span></div>
  <div class="kv"><span class="k">Event listener breakpoint</span><span class="v">Pause in the first listener for a type of event (click, keydown, timer…).</span></div>
  <div class="kv"><span class="k">Owner stack</span><span class="v">React 19's record of which JSX element/component created the code that runs.</span></div>
  <div class="kv"><span class="k">Local overrides</span><span class="v">DevTools serves your local copy of a response (body or headers) on every load.</span></div>
  <div class="kv"><span class="k">Broken Access Control</span><span class="v">Server lets users act beyond their rights; hiding UI does not prevent it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Do not guess a line: break on the request, the DOM change or the event, then read the stack.</li>
<li>A fetch breakpoint shows the state just before the request; owner stacks map the stack to JSX.</li>
<li>DOM breakpoints catch code outside your framework — third-party scripts included.</li>
<li>In React, event-listener breakpoints need the Ignore list to reach your handler.</li>
<li>Overrides let you test a fix on the real page; the server must still enforce every permission.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Dừng trang đúng lúc sự việc xảy ra — không phải ở dòng mình đoán</h2>
<p class="lead">Breakpoint dòng đòi bạn biết phải nhìn ở <em>đâu</em>. Lỗi giao diện hay bắt đầu bằng "có chuyện xảy ra mà không biết mã nào làm": một request bị gửi hai lần, một phần tử biến mất, một cú bấm làm điều lạ. Tab Sources có những breakpoint kích hoạt theo <em>sự kiện</em> chứ không theo dòng: request tới một URL, thay đổi ở một nút DOM, một loại sự kiện DOM. Rồi bạn đọc call stack và tới được dòng mã.</p>

<h3>Liên tưởng đời thường: ba kiểu chuông báo</h3>
<p>Breakpoint dòng là cắt một bảo vệ đứng ở một cửa. Breakpoint fetch là bưu điện gọi cho bạn mỗi khi có thư gửi tới một địa chỉ — rồi bạn hỏi ai viết thư. Breakpoint DOM là cảm biến chuyển động trên đúng một kệ hàng — ai chạm vào, chuông kêu và camera chụp mặt người đó. Breakpoint event listener là chuông cửa reo cho mọi vị khách thuộc một loại — có ích, nhưng ở cửa đông người (React) thì nó reo cho cô lễ tân trước.</p>

<h3>0. Những thứ bạn đã biết</h3>
<p>Mọi thứ ở chương 3 dùng y hệt trong DevTools: Ctrl+P (⌘P) mở tệp theo tên, Ctrl+Shift+F tìm trong mọi nguồn, bấm số dòng để đặt breakpoint, chuột phải để có <em>breakpoint điều kiện</em> hoặc <em>logpoint</em>, Watch, Scope, Call Stack, step over/into/out. Với Vite hay Next.js, source map cho thấy <code>.jsx</code>/<code>.tsx</code> gốc. Breakpoint trong component React và cấu hình "type: chrome" của VS Code đã học ở bài 3.5; bài này nói về những breakpoint không cần biết dòng.</p>

<h3>1. Breakpoint fetch/XHR: ai đã gửi request này?</h3>
<p>Lỗi hai POST của bài 5.2, bắt từ phía bên kia. Sources → <em>XHR/fetch Breakpoints</em> → <code>+</code> → "URL contains" <code>/api/dat-cho</code> (để trống = mọi request). Bấm Lưu một lần:</p>
${OUT_FETCH}
<p>Debugger dừng <em>trước khi</em> request được gửi, ngay trong <code>goi()</code>, nên bạn vẫn xem được <code>tuyChon.body</code>. Hai call stack khác nhau đúng một chỗ: lần #1 đi qua <code>onClick</code> thuộc <code>&lt;button&gt;</code>; lần #2 đi thẳng từ bộ phân phối của React vào <code>luu</code>, thuộc <code>&lt;form&gt;</code> — tức là <code>onSubmit</code>. Các dòng "— &lt;button&gt; —" là <strong>owner stack</strong> của React 19: như một đoạn stack kiểu async, React ghi lại phần tử JSX nào đã tạo ra handler, nên bạn thấy cây component của mình chứ không chỉ ruột React. Có <code>/node_modules/</code> trong Ignore list thì các frame bên trong co lại và stack đọc như mã của chính bạn.</p>
<p>Khi nào breakpoint fetch hơn cột Initiator? Khi cần <em>trạng thái ở đúng lúc đó</em> (biến, body của request, vì sao điều kiện chặn không chặn), hoặc khi request bắn ra từ sâu trong thư viện (một SDK, một hàm thử lại) và bạn cần step ngược lên.</p>

<h3>2. Breakpoint DOM: ai xoá phần tử của tôi?</h3>
<p>Bug report: "Dải vàng 'Đăng nhập để đặt phòng' hiện một giây rồi biến mất". Trong <code>App.jsx</code> không có gì đụng tới nó — nó nằm ở <code>index.html</code>, ngoài React. Ở tab Elements, chuột phải <code>&lt;div id="thong-bao"&gt;</code> → <strong>Break on</strong> → <em>node removal</em> (các lựa chọn khác: <em>subtree modifications</em>, <em>attribute modifications</em> — ví dụ "ai đặt <code>style="display:none"</code>"). Tải lại:</p>
${OUT_DOM}
${ma(WIDGET)}
<p>Thủ phạm là widget chat của bên thứ ba: nó xoá thông báo cũ "của nó" bằng <code>document.querySelector('.thong-bao')</code> — mà dải của mình trùng đúng tên lớp. Đọc mã của mình thì không ai tìm ra. Cách sửa, theo mức mình kiểm soát được: đặt lớp/id có tiền tố riêng cho phần tử của mình (<code>labflow-thong-bao</code>); đề nghị bên bán widget giới hạn selector; nhốt widget trong iframe nếu nó cứ phá.</p>
<p>Breakpoint DOM dùng cho React cũng tốt: "ai render lại nút này?" (subtree modifications) — ở lần chạy của chúng tôi stack đi <code>removeChild</code> ← <code>commitRoot</code>, rồi owner stack <code>— &lt;li&gt; —</code> ← <code>LichPhong App.sua.jsx:18</code>: đúng component render danh sách.</p>

<h3>3. Breakpoint event listener — và vì sao React cần Ignore list</h3>
${OUT_SUKIEN}
<p>Event Listener Breakpoints (Mouse → click, Keyboard → keydown, Control → submit, Timer → setTimeout fired, …) dừng ở listener đầu tiên chạy. Trong ứng dụng React đó là bộ phân phối ở root (<code>dispatchDiscreteEvent</code>, capture rồi bubble) và hàm rỗng <code>noop$1</code> trên phần tử — đúng như bạn thấy bằng <code>getEventListeners</code> ở bài 5.1. Thêm <code>/node_modules/</code> vào Ignore list thì DevTools bỏ qua chúng và dừng ở <code>onClick</code> của bạn. Mẹo này cũng thiết yếu với "Timer → setTimeout fired" hay "Script → Script first statement" ở mọi ứng dụng có thư viện. Khung Elements → Event Listeners có ô "Framework listeners" cũng vì lý do đó.</p>

<h3>4. Local overrides: thử bản sửa trên chính trang thật</h3>
<p>Bạn nghĩ đã biết cách sửa widget, nhưng widget nằm trên CDN của người khác, hoặc build mất 10 phút. <strong>Local overrides</strong> cho DevTools trả bản bạn đã sửa thay cho bất kỳ response nào:</p>
<ol>
<li>Sources → Overrides → <em>Select folder for overrides</em> → cho phép truy cập.</li>
<li>Network (hoặc Sources) → chuột phải <code>widget-ho-tro.js</code> → <em>Override content</em>. Sửa, lưu (Ctrl+S). Chấm tím đánh dấu tệp đã ghi đè.</li>
<li>Tải lại: trình duyệt dùng tệp của bạn, mọi lần, cho tới khi tắt overrides.</li>
</ol>
${ma(WIDGET_SUA)}
${OUT_GHIDE}
<p>Overrides còn dùng được cho <strong>header của response</strong> (ví dụ thêm <code>Access-Control-Allow-Origin</code> để thử bản sửa CORS trước khi backend deploy) và, ở các bản Chrome gần đây, cho <strong>body response</strong> của fetch/XHR (giả lập đúng thay đổi API v2 ở bài 5.1 mà không đụng API). Nhớ tắt đi — "chỉ chạy được trên trình duyệt của em" sẽ là lỗi tiếp theo bạn tự tạo. Đừng đưa thư mục overrides vào git.</p>

<h3>Góc hacker: giấu nút không phải là phân quyền</h3>
<p>Trang không có nút xoá lượt đặt của người khác. Overrides (hay chỉ cần Console) cho bất kỳ ai làm điều giao diện không cho:</p>
${OUT_XOA}
<p>Thứ gì trình duyệt làm được thì người dùng làm được — sửa JS, bật lại nút bị disable, đổi trường ẩn, gửi lại request với id khác. Đó là <strong>Broken Access Control</strong>, hạng 1 của OWASP Top 10 (2021). Vụ nổi tiếng: tháng 5/2019 First American Financial để lộ khoảng 885 triệu hồ sơ thế chấp — đổi một con số trong URL tài liệu là xem được hồ sơ của khách khác, vì server không bao giờ kiểm ai đang hỏi (KrebsOnSecurity). Sửa ở server, ở mọi request:</p>
${MA_QUYEN}
<p>Kiểm ở front-end là để trải nghiệm người dùng; kiểm ở server là để bảo mật. Khi debug bằng DevTools mà thấy chỉ có giao diện đang ngăn một hành động, hãy viết nó thành bug bảo mật — đó là phát hiện rất giá trị trong kỳ OJT.</p>

<h3>Tình huống đi làm</h3>
<p>Dự án dùng script thanh toán hay chat của bên thứ ba, và một thứ trên trang chỉ hỏng khi có script đó. Trước khi cãi với nhà cung cấp: đặt breakpoint DOM lên phần tử bị hỏng, đọc stack, rồi dựng một trang tối giản tái hiện được với script của họ. Gửi họ stack, selector họ đã dùng, và trang tái hiện. Nhà cung cấp sửa báo cáo cụ thể rất nhanh; "widget của anh phá trang của em" thì nằm hàng đợi hàng tuần.</p>

<h3>🧪 Thực hành (35 phút)</h3>
<div class="callout ok">
<ol>
<li>Đặt breakpoint fetch cho <code>/api/dat-cho</code>, bấm Lưu một lần, ghi lại hai stack; xem <code>tuyChon.body</code> ở mỗi lần dừng.</li>
<li>Tìm ai xoá <code>#thong-bao</code> bằng breakpoint DOM; rồi (bản đã sửa) đặt <em>subtree modifications</em> lên <code>&lt;ul&gt;</code> của danh sách, chọn Lab 402, và lần theo stack từ <code>removeChild</code> qua <code>commitRoot</code> tới owner stack <code>— &lt;li&gt; —</code> ⇒ <code>LichPhong</code>.</li>
<li>Breakpoint click khi có và không có Ignore list; đếm số lần dừng.</li>
<li>Ghi đè <code>widget-ho-tro.js</code> bằng bản sửa; rồi ghi đè response <code>/api/dat-cho</code> thành <code>{"lich": []}</code> và xem lỗi của bài 5.1 quay lại.</li>
<li>Từ Console, thử xoá lượt 1 khi chưa đăng nhập; viết bug report bảo mật (tiêu đề, các bước, tác động, cách sửa).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tìm ra mỗi thủ phạm từ một breakpoint <em>không</em> đặt ở dòng mình đoán, và giải thích được vì sao Ignore list đổi chỗ DevTools dừng.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Breakpoint XHR/fetch</span><span class="v">Dừng trước khi gửi request có URL chứa một chuỗi.</span></div>
  <div class="kv"><span class="k">Breakpoint DOM</span><span class="v">Dừng khi một nút bị xoá, cây con thay đổi, hoặc thuộc tính thay đổi.</span></div>
  <div class="kv"><span class="k">Breakpoint event listener</span><span class="v">Dừng ở listener đầu tiên của một loại sự kiện (click, keydown, timer…).</span></div>
  <div class="kv"><span class="k">Owner stack</span><span class="v">Bản ghi của React 19: phần tử JSX/component nào đã tạo ra đoạn mã đang chạy.</span></div>
  <div class="kv"><span class="k">Local overrides</span><span class="v">DevTools trả bản cục bộ của một response (body hoặc header) ở mọi lần tải.</span></div>
  <div class="kv"><span class="k">Broken Access Control</span><span class="v">Server để người dùng làm vượt quyền; giấu giao diện không ngăn được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đừng đoán dòng: dừng theo request, thay đổi DOM hoặc sự kiện, rồi đọc stack.</li>
<li>Breakpoint fetch cho thấy trạng thái ngay trước request; owner stack nối stack với JSX.</li>
<li>Breakpoint DOM bắt được cả mã ngoài framework — kể cả script bên thứ ba.</li>
<li>Với React, breakpoint event listener cần Ignore list mới tới được handler của bạn.</li>
<li>Overrides cho thử bản sửa trên trang thật; server vẫn phải kiểm mọi quyền.</li>
</ul>
${NGUON}
</div>
`,
};
