/**
 * 3.5 — Gỡ lỗi front-end từ VS Code: React (Vite) và Next.js server + client (soạn 24/11/2026).
 * Output chạy THẬT trên Linux · Chrome headless (google-chrome) qua CDP · Vite 8.3.8 · React 19.3.1 · Next.js 16.4.6 (Turbopack).
 * Breakpoint đặt theo dòng .jsx GỐC bằng source map nội tuyến của Vite (cdp-web.mjs — đúng việc cấu hình "type": "chrome" làm).
 * launch.json Next.js chép từ tài liệu đi kèm gói next (node_modules/next/dist/docs/01-app/02-guides/debugging.md).
 * Mã: scratchpad/dbg/lab/web + lab/next.
 */
import { nguon, lienKet } from '../_chung.mjs';

const MA_REACT = `<pre><code class="language-jsx">// ~/dbg-lab/web/src/LichPhong.jsx — Vite + React 19
import { useState } from 'react';

export default function LichPhong() {
  const [ds, setDs] = useState([{ id: 1, gio: '08:00–10:00' }]);

  function themLuot() {
    ds.push({ id: ds.length + 1, gio: '13:00–15:00' });      // line 7
    setDs(ds);                                               // line 8
  }

  return (
    &lt;div&gt;
      &lt;h1&gt;Lab 401 — {ds.length} lượt đặt&lt;/h1&gt;
      &lt;ul&gt;{ds.map((l) =&gt; &lt;li key={l.id}&gt;{l.gio}&lt;/li&gt;)}&lt;/ul&gt;
      &lt;button onClick={themLuot}&gt;Thêm lượt&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>`;

const LAUNCH_CHROME = `<pre><code class="language-json">{
  "name": "Chrome: Vite :45173",
  "type": "chrome",                 // "msedge" for Edge
  "request": "launch",
  "url": "http://127.0.0.1:45173",
  "webRoot": "\${workspaceFolder}"  // where the URL /src/… lives on disk
}</code></pre>`;

const OUT_VITE = `<div class="out">$ curl -s http://127.0.0.1:45173/src/LichPhong.jsx | head -12      # what the browser really runs
import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = …
var _jsxFileName = "/tmp/dbg-lab/web/src/LichPhong.jsx";
…
var _s = $RefreshSig$();
export default function LichPhong() {
	_s();
	const [ds, setDs] = useState([{
		id: 1,
		gio: "08:00–10:00"
	}]);
…   (ends with  //# sourceMappingURL=data:application/json;base64,…  — the map is inside the file)</div>`;

const OUT_BUG = `<div class="out">$ node cdp-web.mjs http://127.0.0.1:45173/ LichPhong.jsx 8
trang đã tải; &lt;h1&gt; = "Lab 401 — 1 lượt đặt"
● breakpoint LichPhong.jsx:8 → dòng 16 của mã Vite đã biến đổi (1 vị trí)
bấm nút "Thêm lượt"
⏸  dừng tại LichPhong.jsx:8 — hàm themLuot
  › ds.length
    2
  › ds.map(x =&gt; x.gio)
    ["08:00–10:00","13:00–15:00"]
▶  tiếp tục; &lt;h1&gt; = "Lab 401 — 1 lượt đặt", số &lt;li&gt; = 1</div>`;

const OUT_FIX = `<div class="out">    setDs([...ds, { id: ds.length + 1, gio: '13:00–15:00' }]);   // a NEW array   (line 7)
$ node cdp-web.mjs http://127.0.0.1:45173/ LichPhong.jsx 7
trang đã tải; &lt;h1&gt; = "Lab 401 — 1 lượt đặt"
● breakpoint LichPhong.jsx:7 → dòng 12 của mã Vite đã biến đổi (1 vị trí)
bấm nút "Thêm lượt"
⏸  dừng tại LichPhong.jsx:7 — hàm themLuot
  › ds.length
    1
▶  tiếp tục; &lt;h1&gt; = "Lab 401 — 2 lượt đặt", số &lt;li&gt; = 2</div>`;

const MA_NEXT = `<pre><code class="language-jsx">// app/page.js — Server Component: runs in Node, on the server
import NutDat from './NutDat';
export default async function Trang() {
  const phong = { ten: 'Lab 401', sucChua: 30 };
  console.log('[server] render Trang, phong =', phong.ten);
  return &lt;main&gt;&lt;h1&gt;{phong.ten}&lt;/h1&gt;&lt;NutDat sucChua={phong.sucChua} /&gt;&lt;/main&gt;;
}

// app/NutDat.js — Client Component: rendered once on the server, then runs in the browser
'use client';
import { useState } from 'react';
export default function NutDat({ sucChua }) {
  const [daDat, setDaDat] = useState(0);
  console.log('[client] render NutDat, daDat =', daDat);
  return &lt;button onClick={() =&gt; setDaDat(daDat + 1)}&gt;Đặt chỗ ({daDat}/{sucChua})&lt;/button&gt;;
}</code></pre>`;

const OUT_NEXT = `<div class="out">$ npx next dev --inspect=127.0.0.1:49231 -p 43002 -H 127.0.0.1
Debugger listening on ws://127.0.0.1:49231/74c69a66-188e-4857-a3d8-6f2cc981190f
▲ Next.js 16.4.6 (Turbopack)
- Local:         http://127.0.0.1:43002
- Debugger port: 49231
✓ Ready in 329ms
[server] render Trang, phong = Lab 401          ← terminal (Node)
[client] render NutDat, daDat = 0                ← ALSO terminal: the client component's first render happens on the server
 GET / 200 in 235ms

# browser console of the same page (headless Chrome), then one click:
  [trình duyệt] [server] render Trang, phong = Lab 401   (shown with a grey "Server" badge — Next replays server logs in dev)
  [trình duyệt] [client] render NutDat, daDat = 0
  [trình duyệt] [client] render NutDat, daDat = 0        ← twice: React Strict Mode renders twice in development
— bấm nút —
  [trình duyệt] [client] render NutDat, daDat = 1
  [trình duyệt] [client] render NutDat, daDat = 1
  nút giờ ghi: Đặt chỗ (1/30)</div>`;

const LAUNCH_NEXT = `<pre><code class="language-json">// from the Next.js 16 debugging guide (node_modules/next/dist/docs/01-app/02-guides/debugging.md)
{
  "name": "Next.js: debug server-side",
  "type": "node-terminal",
  "request": "launch",
  "command": "npm run dev -- --inspect"
},
{
  "name": "Next.js: debug client-side",
  "type": "chrome",
  "request": "launch",
  "url": "http://localhost:3000"
},
{
  "name": "Next.js: debug full stack",
  "type": "node",
  "request": "launch",
  "program": "\${workspaceFolder}/node_modules/next/dist/bin/next",
  "runtimeArgs": ["--inspect"],
  "skipFiles": ["&lt;node_internals&gt;/**"],
  "serverReadyAction": {
    "action": "debugWithEdge",          // change to "debugWithChrome" if you use Chrome
    "killOnServerStop": true,
    "pattern": "- Local:.+(https?://.+)",
    "uriFormat": "%s",
    "webRoot": "\${workspaceFolder}"
  }
}</code></pre>`;

const NGUON = [
  nguon('🟦', 'VS Code — Browser debugging', 'Cấu hình type chrome/msedge, launch và attach, webRoot, source map.', 'https://code.visualstudio.com/docs/nodejs/browser-debugging'),
  nguon('▲', 'Next.js — Debugging', 'Ba cấu hình server-side / client-side / full stack; next dev --inspect.', 'https://nextjs.org/docs/app/guides/debugging'),
  nguon('⚛️', 'React — Updating arrays in state', 'Không sửa mảng state tại chỗ; tạo mảng mới bằng spread, map, filter.', 'https://react.dev/learn/updating-arrays-in-state'),
  nguon('⚛️', 'React — StrictMode', 'Vì sao component render hai lần khi phát triển.', 'https://react.dev/reference/react/StrictMode'),
  lienKet({ khoa: 'react', bai: 'rx-2-1-use-state', title: 'React 2.1 — useState và render lại', sub: 'Ảnh chụp state, cập nhật theo hàm; bài này chỉ phần bắt lỗi bằng debugger.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '3.5 — Debugging front-end code from VS Code: React and Next.js (server + client)|||3.5 — Gỡ lỗi front-end từ VS Code: React và Next.js (server + client)',
  slug: 'dbg-3-5-trinh-duyet',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cấu hình "type": "chrome" mở trình duyệt từ VS Code và đặt breakpoint thẳng trong tệp .jsx (Vite trả mã đã biến đổi kèm source map nội tuyến). Bắt lỗi "bấm nút mà giao diện không đổi": push vào mảng state rồi setState cùng mảng ⇒ React so Object.is thấy không đổi ⇒ không render. Next.js 16: phần nào chạy trên server (terminal), phần nào trong trình duyệt, vì sao client component in log ở cả hai nơi và in hai lần; ba cấu hình launch.json chính thức.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>One editor, two runtimes: breakpoints in React components and in Next.js</h2>
<p class="lead">Front-end code runs in the browser, but you write it in VS Code. Switching to Chrome DevTools for every bug works (Chapter 5 teaches it in depth), yet VS Code can drive the browser directly: same breakpoints, same keys, your own files. With Next.js it gets trickier — part of your React code runs in Node on the server and part in the browser, and a breakpoint in the wrong place never hits. This lesson catches a classic React bug from VS Code, then maps exactly where Next.js code runs.</p>

<h3>An everyday picture: a restaurant kitchen and the dining room</h3>
<p>In Next.js, a Server Component is cooked in the kitchen (Node): the guest never sees the cook. A Client Component is a dish finished at the table (the browser) — but it is first prepared in the kitchen too, then the waiter finishes it in front of the guest. If the sauce is wrong, you need to know whether to stand in the kitchen or in the dining room to watch it happen.</p>

<h3>Launching Chrome from VS Code</h3>
<p>VS Code's JavaScript debugger speaks the same CDP to Chrome or Edge that it speaks to Node. A configuration:</p>
${LAUNCH_CHROME}
<p>F5 opens a <em>separate</em> browser profile (no extensions, no saved logins) with the debugger attached; start your dev server first (<code>npm run dev</code>). Breakpoints go into your <code>.jsx</code>/<code>.tsx</code> files. That works because the browser does not run your file — it runs what Vite produced, with a source map inside:</p>
${OUT_VITE}

<h3>The bug: the button does nothing</h3>
${MA_REACT}
<p>Click "Thêm lượt" (add a booking): nothing changes on screen. No error in the console. Put a breakpoint on line 8 (<code>setDs(ds)</code>) and click — the output below is real, produced by sending the same CDP requests VS Code sends (breakpoint by the original <code>.jsx</code> line, mapped through Vite's source map, then a click):</p>
${OUT_BUG}
<p>Paused on line 8, the array <em>already has two items</em> — the data changed. Yet after continuing, the page still shows one. Hypothesis: React does not know anything changed. Exactly: <code>setDs(x)</code> compares the new value with the current one using <code>Object.is</code>. <code>ds.push(…)</code> modified the <em>same</em> array object, so <code>Object.is(ds, ds)</code> is true and React skips the re-render. The data is right, the screen is stale — and the next unrelated re-render will suddenly show both items, which makes this bug look random in a bigger app.</p>
${OUT_FIX}
<p>A new array (<code>[...ds, item]</code>) is a different object, React re-renders, the page shows two bookings. The same rule holds for objects: <code>setX({ ...x, field: v })</code>, never <code>x.field = v; setX(x)</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — breakpoint in a component "hits too often".</strong> A breakpoint in the component body stops on every render — React may render many times (and twice in development, see below). Put it inside the event handler or the <code>useEffect</code> you care about, or make it conditional (<code>ds.length &gt; 1</code>).</p></div>

<h3>Next.js: which side does this line run on?</h3>
${MA_NEXT}
${OUT_NEXT}
<p>What this real run shows:</p>
<ul>
<li><strong>Server Components</strong> (<code>page.js</code> without <code>'use client'</code>) run only in Node. Their breakpoints need the <em>Node</em> debugger (<code>next dev --inspect</code> or the server-side configuration). In development, Next also replays their logs in the browser console with a "Server" badge — seeing a log in the browser does <em>not</em> mean the code ran there.</li>
<li><strong>Client Components</strong> run twice as far: once on the server (to produce the HTML — the <code>[client]</code> line in the terminal), then in the browser (hydration and every later render). A bug in the first HTML ("hydration mismatch") is caught by the Node debugger; a bug after a click is caught by the browser debugger.</li>
<li><strong>Logged twice</strong> in the browser: React Strict Mode renders components twice in development to expose impure render code. Not a bug; it does not happen in production builds.</li>
</ul>
<p>The three configurations from the Next.js 16 guide:</p>
${LAUNCH_NEXT}
<p>"Full stack" starts the Node debugger on Next's server, and when the terminal prints <code>- Local: http://…</code>, <code>serverReadyAction</code> opens the browser with the second debugger attached — one F5, breakpoints on both sides.</p>

<h3>On the job</h3>
<p>Ticket: "After adding a booking, the list does not update until I switch tabs." That sentence is the signature of the mutated-state bug (the tab switch causes an unrelated re-render). Pause in the handler, check whether the array/object passed to the setter is the same object as before (<code>Object.is(oldValue, newValue)</code> in the Debug Console), fix with a copy. In code review, <code>.push(</code>, <code>.splice(</code>, <code>.sort(</code> on state followed by a setter are worth a comment.</p>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<ol>
<li>Create the Vite app (<code>npm create vite@latest web -- --template react</code>), replace the component with <code>LichPhong.jsx</code>, run <code>npm run dev</code>.</li>
<li>Add the Chrome configuration, F5, set the breakpoint on <code>setDs(ds)</code>, click. Confirm <code>ds.length</code> is 2 while the page says 1. In the Debug Console, run <code>Object.is(ds, ds)</code> and explain the result.</li>
<li>Fix with a new array; also break the same way with <code>ds.sort(…)</code> to sort by time and fix it (<code>[...ds].sort(…)</code> or <code>toSorted</code>).</li>
<li>Create the Next.js page and client component. With "debug full stack", put a breakpoint in <code>page.js</code> and one in the click handler of <code>NutDat.js</code>. Which debugger session stops for each? Where is the first render of <code>NutDat</code>?</li>
</ol>
<p><strong>Done when:</strong> the list updates on every click, and you can say for any line of a Next.js component whether it runs on the server, in the browser or both.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"type": "chrome"</span><span class="v">VS Code configuration that launches/attaches to Chrome over CDP.</span></div>
  <div class="kv"><span class="k">webRoot</span><span class="v">Folder on disk that matches the URL paths the dev server serves.</span></div>
  <div class="kv"><span class="k">mutating state</span><span class="v">Changing the existing array/object in place — React cannot see it.</span></div>
  <div class="kv"><span class="k">Object.is</span><span class="v">The comparison React uses to decide whether state changed.</span></div>
  <div class="kv"><span class="k">Server / Client Component</span><span class="v">Runs only in Node / rendered on the server then runs in the browser.</span></div>
  <div class="kv"><span class="k">hydration</span><span class="v">The browser attaching React to HTML that the server produced.</span></div>
  <div class="kv"><span class="k">Strict Mode</span><span class="v">Development-only double rendering to expose impure code.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>VS Code debugs Chrome/Edge with the same keys; breakpoints in .jsx work through the dev server's source maps.</li>
<li>"Data correct, screen stale" = state mutated in place; always pass a new array/object to the setter.</li>
<li>Next.js: Server Components need the Node debugger, Client Components both (server first render, then browser).</li>
<li>Logs in the browser may be server logs replayed; double logs in dev are Strict Mode.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Một editor, hai môi trường chạy: breakpoint trong component React và trong Next.js</h2>
<p class="lead">Code giao diện chạy trong trình duyệt, nhưng bạn viết nó trong VS Code. Chuyển sang Chrome DevTools cho mỗi lỗi cũng được (Chương 5 dạy sâu), nhưng VS Code điều khiển thẳng được trình duyệt: cùng breakpoint, cùng phím, ngay trên tệp của bạn. Với Next.js thì rối hơn — một phần code React chạy trong Node trên server, một phần trong trình duyệt, và breakpoint đặt nhầm phía thì không bao giờ dừng. Bài này bắt một lỗi React kinh điển từ VS Code, rồi vẽ rõ code Next.js chạy ở đâu.</p>

<h3>Liên tưởng đời thường: bếp nhà hàng và phòng ăn</h3>
<p>Trong Next.js, Server Component được nấu trong bếp (Node): khách không bao giờ thấy đầu bếp. Client Component là món hoàn thiện tại bàn (trình duyệt) — nhưng nó cũng được sơ chế trong bếp trước, rồi phục vụ hoàn thiện trước mặt khách. Nước sốt sai thì bạn phải biết nên đứng trong bếp hay ngoài phòng ăn để thấy lúc nó sai.</p>

<h3>Mở Chrome từ VS Code</h3>
<p>Debugger JavaScript của VS Code nói cùng giao thức CDP với Chrome hay Edge như với Node. Một cấu hình:</p>
${LAUNCH_CHROME}
<p>F5 mở một hồ sơ trình duyệt <em>riêng</em> (không tiện ích, không đăng nhập sẵn) đã gắn debugger; nhớ chạy dev server trước (<code>npm run dev</code>). Breakpoint đặt thẳng trong tệp <code>.jsx</code>/<code>.tsx</code> của bạn. Làm được vậy vì trình duyệt không chạy tệp của bạn — nó chạy thứ Vite sinh ra, kèm source map ngay bên trong:</p>
${OUT_VITE}

<h3>Lỗi: bấm nút không có gì xảy ra</h3>
${MA_REACT}
<p>Bấm "Thêm lượt": màn hình không đổi. Console không có lỗi. Đặt breakpoint ở dòng 8 (<code>setDs(ds)</code>) rồi bấm — output dưới đây là thật, tạo ra bằng cách gửi đúng các request CDP mà VS Code gửi (breakpoint theo dòng <code>.jsx</code> gốc, tra qua source map của Vite, rồi bấm nút):</p>
${OUT_BUG}
<p>Dừng ở dòng 8, mảng <em>đã có hai phần tử</em> — dữ liệu đã đổi. Vậy mà chạy tiếp, trang vẫn hiện một. Giả thuyết: React không biết có gì thay đổi. Chính xác: <code>setDs(x)</code> so giá trị mới với giá trị hiện tại bằng <code>Object.is</code>. <code>ds.push(…)</code> sửa <em>chính</em> object mảng đó, nên <code>Object.is(ds, ds)</code> đúng và React bỏ qua lần render lại. Dữ liệu đúng, màn hình cũ — và lần render lại vì lý do khác sau đó sẽ bỗng hiện đủ cả hai, khiến lỗi này trông như ngẫu nhiên trong ứng dụng lớn.</p>
${OUT_FIX}
<p>Mảng mới (<code>[...ds, item]</code>) là một object khác, React render lại, trang hiện hai lượt. Quy tắc y hệt với object: <code>setX({ ...x, truong: v })</code>, không bao giờ <code>x.truong = v; setX(x)</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — breakpoint trong component "dừng quá nhiều".</strong> Breakpoint trong thân component dừng ở mỗi lần render — React có thể render nhiều lần (và hai lần khi phát triển, xem bên dưới). Đặt nó trong hàm xử lý sự kiện hay <code>useEffect</code> bạn quan tâm, hoặc cho nó điều kiện (<code>ds.length &gt; 1</code>).</p></div>

<h3>Next.js: dòng này chạy ở phía nào?</h3>
${MA_NEXT}
${OUT_NEXT}
<p>Lần chạy thật này cho thấy:</p>
<ul>
<li><strong>Server Component</strong> (<code>page.js</code> không có <code>'use client'</code>) chỉ chạy trong Node. Breakpoint của nó cần debugger <em>Node</em> (<code>next dev --inspect</code> hoặc cấu hình server-side). Khi phát triển, Next còn phát lại log của nó trong console trình duyệt với nhãn "Server" — thấy log trong trình duyệt <em>không</em> có nghĩa code đã chạy ở đó.</li>
<li><strong>Client Component</strong> chạy ở cả hai nơi: một lần trên server (để sinh HTML — dòng <code>[client]</code> trong terminal), rồi trong trình duyệt (hydration và mọi lần render sau). Lỗi ở HTML đầu tiên ("hydration mismatch") bắt bằng debugger Node; lỗi sau khi bấm nút bắt bằng debugger trình duyệt.</li>
<li><strong>In hai lần</strong> trong trình duyệt: React Strict Mode render component hai lần khi phát triển để lộ code render không thuần. Không phải lỗi; bản build production không có.</li>
</ul>
<p>Ba cấu hình theo hướng dẫn của Next.js 16:</p>
${LAUNCH_NEXT}
<p>"Full stack" chạy debugger Node trên server của Next, và khi terminal in <code>- Local: http://…</code>, <code>serverReadyAction</code> mở trình duyệt kèm debugger thứ hai — một lần F5, breakpoint ở cả hai phía.</p>

<h3>Tình huống đi làm</h3>
<p>Ticket: "Thêm lượt đặt xong, danh sách không cập nhật cho tới khi em chuyển tab." Câu đó là chữ ký của lỗi sửa state tại chỗ (chuyển tab gây một lần render lại không liên quan). Dừng trong hàm xử lý, kiểm mảng/object truyền cho hàm set có phải chính object cũ không (<code>Object.is(giaTriCu, giaTriMoi)</code> trong Debug Console), sửa bằng bản sao. Khi review code, <code>.push(</code>, <code>.splice(</code>, <code>.sort(</code> trên state rồi gọi hàm set là chỗ đáng bình luận.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<ol>
<li>Tạo ứng dụng Vite (<code>npm create vite@latest web -- --template react</code>), thay component bằng <code>LichPhong.jsx</code>, chạy <code>npm run dev</code>.</li>
<li>Thêm cấu hình Chrome, F5, đặt breakpoint ở <code>setDs(ds)</code>, bấm nút. Xác nhận <code>ds.length</code> là 2 trong khi trang ghi 1. Trong Debug Console, chạy <code>Object.is(ds, ds)</code> và giải thích kết quả.</li>
<li>Sửa bằng mảng mới; rồi làm hỏng cùng kiểu bằng <code>ds.sort(…)</code> để sắp theo giờ và sửa nó (<code>[...ds].sort(…)</code> hoặc <code>toSorted</code>).</li>
<li>Tạo trang Next.js và client component. Với "debug full stack", đặt một breakpoint trong <code>page.js</code> và một trong hàm bấm nút của <code>NutDat.js</code>. Phiên debugger nào dừng cho từng cái? Lần render đầu của <code>NutDat</code> ở đâu?</li>
</ol>
<p><strong>Đạt khi:</strong> danh sách cập nhật sau mỗi lần bấm, và với bất kỳ dòng nào của một component Next.js, bạn nói được nó chạy trên server, trong trình duyệt hay cả hai.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"type": "chrome"</span><span class="v">Cấu hình VS Code mở/gắn vào Chrome qua CDP.</span></div>
  <div class="kv"><span class="k">webRoot</span><span class="v">Thư mục trên đĩa khớp với đường dẫn URL mà dev server phục vụ.</span></div>
  <div class="kv"><span class="k">mutating state (sửa state tại chỗ)</span><span class="v">Đổi chính mảng/object đang có — React không thấy được.</span></div>
  <div class="kv"><span class="k">Object.is</span><span class="v">Phép so React dùng để quyết định state có đổi không.</span></div>
  <div class="kv"><span class="k">Server / Client Component</span><span class="v">Chỉ chạy trong Node / render trên server rồi chạy trong trình duyệt.</span></div>
  <div class="kv"><span class="k">hydration</span><span class="v">Trình duyệt gắn React vào HTML do server sinh ra.</span></div>
  <div class="kv"><span class="k">Strict Mode</span><span class="v">Render hai lần chỉ khi phát triển để lộ code không thuần.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>VS Code debug Chrome/Edge bằng cùng phím; breakpoint trong .jsx chạy nhờ source map của dev server.</li>
<li>"Dữ liệu đúng, màn hình cũ" = sửa state tại chỗ; luôn truyền mảng/object mới cho hàm set.</li>
<li>Next.js: Server Component cần debugger Node, Client Component cần cả hai (render đầu trên server, sau đó trình duyệt).</li>
<li>Log trong trình duyệt có thể là log server được phát lại; log đôi khi phát triển là do Strict Mode.</li>
</ul>
${NGUON}
</div>
`,
};
