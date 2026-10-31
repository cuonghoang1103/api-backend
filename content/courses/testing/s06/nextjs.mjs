/**
 * Testing · Chương 6 · 6.4 — Test trong Next.js (client và server component, route handler). Slug giữ từ khung: tst-6-4-nextjs.
 * Chạy thật (không cài next): route handler GET(Request) → Response trong môi trường node; async Server Component: render(await Page(props)) xanh,
 * render(<Page />) đỏ với "is an async Client Component"; component con async lồng bên trong cũng đỏ (đã đo). Nguồn: hướng dẫn Vitest của Next.js.
 */
import G from '../giang/tst-06-4.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const gon = (t) => t.split('\n').filter((l) => /^\$ |✓|×|Tests /.test(l)).join('\n');
const ROUTE_OUT = OUT['64-route'].split('\n').filter((l) => /^\$ |✓|×|Tests |Duration/.test(l)).join('\n');
const SERVER = OUT['64-server'].split('\n').filter((l) => /^\$ |✓|×|async Client Component|Unable to find|Tests /.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');

const BANG_EN = `<table>
<thead><tr><th>Code</th><th>Where it runs</th><th>How to test it</th></tr></thead>
<tbody>
<tr><td><code>'use client'</code> component (BookingForm, AdminBookings)</td><td>browser</td><td>Testing Library in jsdom — lessons 6.1–6.3</td></tr>
<tr><td>Route handler (<code>app/api/slots/route.js</code>)</td><td>server</td><td>call <code>GET(new Request(…))</code> in the node environment</td></tr>
<tr><td>Pure helpers (<code>lib/slots.js</code>)</td><td>anywhere</td><td>plain unit tests — Chapter 1</td></tr>
<tr><td>Synchronous Server Component</td><td>server</td><td><code>render(&lt;Page /&gt;)</code></td></tr>
<tr><td>Async Server Component</td><td>server</td><td><code>render(await Page(props))</code> — top level only</td></tr>
<tr><td>Routing, layouts, middleware, <code>notFound()</code>, streaming</td><td>Next.js itself</td><td>end-to-end in a real browser — Chapter 7</td></tr>
</tbody></table>`;
const BANG_VI = `<table>
<thead><tr><th>Code</th><th>Chạy ở đâu</th><th>Test thế nào</th></tr></thead>
<tbody>
<tr><td>Component <code>'use client'</code> (BookingForm, AdminBookings)</td><td>trình duyệt</td><td>Testing Library trong jsdom — bài 6.1–6.3</td></tr>
<tr><td>Route handler (<code>app/api/slots/route.js</code>)</td><td>máy chủ</td><td>gọi <code>GET(new Request(…))</code> trong môi trường node</td></tr>
<tr><td>Hàm phụ thuần (<code>lib/slots.js</code>)</td><td>ở đâu cũng được</td><td>unit test thường — Chương 1</td></tr>
<tr><td>Server Component đồng bộ</td><td>máy chủ</td><td><code>render(&lt;Page /&gt;)</code></td></tr>
<tr><td>Server Component bất đồng bộ</td><td>máy chủ</td><td><code>render(await Page(props))</code> — chỉ tầng ngoài cùng</td></tr>
<tr><td>Định tuyến, layout, middleware, <code>notFound()</code>, streaming</td><td>chính Next.js</td><td>test đầu-cuối trên trình duyệt thật — Chương 7</td></tr>
</tbody></table>`;

export default {
  title: '6.4 — Testing in Next.js: client components, server components and route handlers|||6.4 — Test trong Next.js: client component, server component và route handler',
  slug: 'tst-6-4-nextjs',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bản đồ test cho một app Next.js: client component (Testing Library), route handler là hàm Request → Response test trong môi trường node với MSW đóng vai API, hàm thuần freeSlots test như Chương 1; async Server Component: render(await Page(props)) chạy, render(<Page />) đỏ với thông báo thật của React, component con async lồng bên trong cũng đỏ; phần còn lại để Playwright (Chương 7).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Testing in Next.js</h2>
<p class="lead">LabFlow’s real web app is a Next.js App Router project. Some of its code runs in the browser, some on the server, and some only exists once Next.js assembles a page. This lesson sorts the code by where it runs and tests each piece at the cheapest level that can catch its bugs. We do not install Next.js: route handlers and server components are plain functions, and that is precisely what makes them testable.</p>

<h3>The map</h3>
${BANG_EN}
<p>The Next.js testing guide says it plainly: Vitest does not support async Server Components; unit-test synchronous Server and Client Components, and use end-to-end tests for async ones (<a href="https://nextjs.org/docs/app/guides/testing/vitest" target="_blank" rel="noopener">How to set up Vitest with Next.js</a>). Below we measure exactly where that line is.</p>

<h3>Logic first: a pure function</h3>
${ma('javascript', CODE.slots)}
<p>Which half-hour slots of a lab are still free on a day? This is business logic, so it lives in a pure function next to the Chapter 1 rules it reuses (<code>OPEN</code>, <code>CLOSE</code>, <code>STEP</code>, <code>parseTime</code>). It needs no DOM, no server and no Next.js — the practice tests it at its edges.</p>

<h3>A route handler is a function from Request to Response</h3>
${ma('javascript', CODE.bookingsLib)}
${ma('javascript', CODE.route)}
${ma('javascript', CODE.routeTest)}
${ra(ROUTE_OUT)}
<ul>
<li><code>// @vitest-environment node</code> on the first line runs this file without a DOM: the handler runs on the server, so its test should too. The Duration line of this run shows no “environment” share at all.</li>
<li>The handler is called with a standard <code>Request</code> and returns a standard <code>Response</code>; the test reads <code>res.status</code> and <code>await res.json()</code> — the same Web APIs a browser uses.</li>
<li>MSW plays the LabFlow API that <code>listBookings</code> calls; <code>vi.stubEnv</code> sets <code>LABFLOW_API_URL</code> for the test.</li>
<li>Expected free slots: bookings 07:00–09:00 and 10:00–20:30 leave 09:00, 09:30 and 20:30. The 09:00–10:00 booking belongs to another lab and must not count.</li>
</ul>

<h3>An async Server Component</h3>
${ma('javascript', CODE.page)}
${ma('javascript', CODE.serverTest)}
${ra(SERVER)}
<p>An async Server Component is just an async function that returns markup. Awaited like a function, it gives back React elements that <code>render</code> can display — the first two tests pass. Rendered as a normal element, React’s client renderer meets an async component and refuses with its own message, quoted above. We also measured a page that returns an <em>async child</em> inside its markup: the same error, this time about the child. So the trick covers the top level only; <code>notFound()</code>, redirects and layouts need the framework. Keep server components thin — data in <code>lib/</code>, logic in pure functions — and test the assembled page in a browser in Chapter 7.</p>

${lienKet({ khoa: 'nextjs', bai: 'nextjs-19-2-unit-test-vitest', title: 'Also in the Next.js course — 19.2: unit tests with Vitest', sub: 'The Next.js side of the same setup; this lesson measures where unit tests stop for server components.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-11-3-route-handlers', title: 'Also in the Next.js course — 11.3: route handlers', sub: 'How route handlers are written; here each one is called directly with a Request in a test.', cta: 'OPEN LESSON →' })}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li><code>freeSlots([])</code>: 28 slots, from 07:00 to 20:30.</li>
<li>Around a booking 08:00–10:00: 07:30 and 10:00 are free (touching is allowed, as in lesson 4.1), 08:00 and 09:30 are not.</li>
<li>The route answers 400 without a lab.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th64)}
${ra(gon(OUT['64-th']))}
<p>Twenty-eight is 14 hours × 2 slots per hour. Boundary values once more: the slots on either side of a booking are where an off-by-one in <code>t &lt; end &amp;&amp; t + STEP &gt; start</code> would show.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">App Router</span><span class="v">The Next.js routing system based on the <code>app/</code> folder: pages, layouts and route handlers.</span></div>
  <div class="kv"><span class="k">route handler</span><span class="v">A file <code>route.js</code> exporting functions such as <code>GET(request)</code> that return a <code>Response</code>.</span></div>
  <div class="kv"><span class="k">Server Component</span><span class="v">A component rendered on the server only; it may be async and fetch data directly.</span></div>
  <div class="kv"><span class="k">Client Component</span><span class="v">A component marked <code>'use client'</code>; it runs in the browser and may use state and events.</span></div>
</div>

<!-- SODO-TST -->
<h3>🗺 Next.js code by test level</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Assembled pages, routing, middleware</span><span class="lz-lnote">Playwright — Chapter 7</span></div>
  <div class="lz-layer"><span class="lz-lname">Async Server Components</span><span class="lz-lnote">render(await Page(props)) — top level only</span></div>
  <div class="lz-layer"><span class="lz-lname">Route handlers</span><span class="lz-lnote">GET(new Request(…)) in the node environment</span></div>
  <div class="lz-layer"><span class="lz-lname">Client components</span><span class="lz-lnote">Testing Library in jsdom</span></div>
  <div class="lz-layer"><span class="lz-lname">Pure helpers</span><span class="lz-lnote">plain unit tests</span></div>
</div>
<div class="pitfall"><strong>Rendering an async Server Component as an element.</strong> <code>render(&lt;BookingPage /&gt;)</code> makes React treat it as an async client component and refuse. Await it as a function and render the result — and remember that an async child inside it fails the same way.</div>
<h3>📌 Summary</h3>
<ul>
<li>Sort code by where it runs, then test each piece at the cheapest level.</li>
<li>Route handlers: build a <code>Request</code>, check the <code>Response</code>, in the node environment.</li>
<li>Async Server Components: <code>render(await Page(props))</code>, top level only.</li>
<li>Move logic into pure functions; keep pages and handlers thin.</li>
<li>Routing and the assembled page belong to end-to-end tests.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Test trong Next.js</h2>
<p class="lead">Web app thật của LabFlow là một dự án Next.js App Router. Một phần code chạy trên trình duyệt, một phần trên máy chủ, và một phần chỉ tồn tại khi Next.js ráp trang lại. Bài này xếp code theo nơi nó chạy và test mỗi phần ở cấp rẻ nhất bắt được bug của nó. Ta không cài Next.js: route handler và server component chỉ là hàm thường, và chính điều đó khiến chúng test được.</p>

<h3>Bản đồ</h3>
${BANG_VI}
<p>Hướng dẫn test của Next.js nói thẳng: Vitest không hỗ trợ Server Component bất đồng bộ; hãy unit test Server và Client Component đồng bộ, còn component bất đồng bộ thì dùng test đầu-cuối (<a href="https://nextjs.org/docs/app/guides/testing/vitest" target="_blank" rel="noopener">How to set up Vitest with Next.js</a>). Dưới đây ta đo chính xác ranh giới đó nằm ở đâu.</p>

<h3>Logic trước: một hàm thuần</h3>
${ma('javascript', CODE.slots)}
<p>Những khung nửa giờ nào của một phòng còn trống trong ngày? Đây là logic nghiệp vụ, nên nó sống trong một hàm thuần cạnh các luật của Chương 1 mà nó dùng lại (<code>OPEN</code>, <code>CLOSE</code>, <code>STEP</code>, <code>parseTime</code>). Nó không cần DOM, máy chủ hay Next.js — phần thực hành test nó tại các biên.</p>

<h3>Route handler là hàm từ Request sang Response</h3>
${ma('javascript', CODE.bookingsLib)}
${ma('javascript', CODE.route)}
${ma('javascript', CODE.routeTest)}
${ra(ROUTE_OUT)}
<ul>
<li><code>// @vitest-environment node</code> ở dòng đầu cho file này chạy không có DOM: handler chạy trên máy chủ, nên test của nó cũng vậy. Dòng Duration của lần chạy này không có phần “environment” nào.</li>
<li>Handler được gọi với một <code>Request</code> chuẩn và trả về một <code>Response</code> chuẩn; test đọc <code>res.status</code> và <code>await res.json()</code> — đúng các Web API mà trình duyệt dùng.</li>
<li>MSW đóng vai API LabFlow mà <code>listBookings</code> gọi; <code>vi.stubEnv</code> đặt <code>LABFLOW_API_URL</code> cho test.</li>
<li>Khung trống mong đợi: các lượt đặt 07:00–09:00 và 10:00–20:30 để lại 09:00, 09:30 và 20:30. Lượt 09:00–10:00 thuộc phòng khác và không được tính.</li>
</ul>

<h3>Một Server Component bất đồng bộ</h3>
${ma('javascript', CODE.page)}
${ma('javascript', CODE.serverTest)}
${ra(SERVER)}
<p>Server Component bất đồng bộ chỉ là một hàm async trả về phần giao diện. Await nó như một hàm, ta nhận lại các React element mà <code>render</code> hiển thị được — hai test đầu qua. Render nó như một phần tử bình thường, bộ render phía client của React gặp component async và từ chối bằng chính thông báo của nó, trích ở trên. Ta cũng đã đo một trang trả về một <em>component con async</em> trong phần giao diện: cùng lỗi đó, lần này nói về component con. Vậy mẹo này chỉ phủ tầng ngoài cùng; <code>notFound()</code>, chuyển hướng và layout cần tới framework. Giữ server component mỏng — dữ liệu trong <code>lib/</code>, logic trong hàm thuần — và test trang đã ráp trên trình duyệt ở Chương 7.</p>

${lienKet({ khoa: 'nextjs', bai: 'nextjs-19-2-unit-test-vitest', title: 'Gặp lại ở khoá Next.js — 19.2: unit test với Vitest', sub: 'Cùng cách cài đặt nhìn từ phía Next.js; bài này đo chỗ unit test dừng lại với server component.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-11-3-route-handlers', title: 'Gặp lại ở khoá Next.js — 11.3: route handler', sub: 'Route handler được viết thế nào; ở đây mỗi handler được gọi thẳng với một Request trong test.', cta: 'MỞ BÀI →' })}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li><code>freeSlots([])</code>: 28 khung, từ 07:00 tới 20:30.</li>
<li>Quanh một lượt đặt 08:00–10:00: 07:30 và 10:00 còn trống (chạm nhau được phép, như bài 4.1), 08:00 và 09:30 thì không.</li>
<li>Route trả 400 khi thiếu lab.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th64)}
${ra(gon(OUT['64-th']))}
<p>Hai mươi tám là 14 giờ × 2 khung mỗi giờ. Lại là giá trị biên: các khung ở hai bên một lượt đặt là nơi một lỗi lệch một trong <code>t &lt; end &amp;&amp; t + STEP &gt; start</code> sẽ lộ ra.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">App Router</span><span class="v">Hệ thống định tuyến của Next.js dựa trên thư mục <code>app/</code>: trang, layout và route handler.</span></div>
  <div class="kv"><span class="k">route handler</span><span class="v">File <code>route.js</code> xuất các hàm như <code>GET(request)</code> trả về một <code>Response</code>.</span></div>
  <div class="kv"><span class="k">Server Component</span><span class="v">Component chỉ render trên máy chủ; có thể async và lấy dữ liệu trực tiếp.</span></div>
  <div class="kv"><span class="k">Client Component</span><span class="v">Component đánh dấu <code>'use client'</code>; chạy trên trình duyệt, dùng được state và sự kiện.</span></div>
</div>

<h3>🗺 Code Next.js theo cấp test</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Trang đã ráp, định tuyến, middleware</span><span class="lz-lnote">Playwright — Chương 7</span></div>
  <div class="lz-layer"><span class="lz-lname">Server Component bất đồng bộ</span><span class="lz-lnote">render(await Page(props)) — chỉ tầng ngoài</span></div>
  <div class="lz-layer"><span class="lz-lname">Route handler</span><span class="lz-lnote">GET(new Request(…)) trong môi trường node</span></div>
  <div class="lz-layer"><span class="lz-lname">Client component</span><span class="lz-lnote">Testing Library trong jsdom</span></div>
  <div class="lz-layer"><span class="lz-lname">Hàm phụ thuần</span><span class="lz-lnote">unit test thường</span></div>
</div>
<div class="pitfall"><strong>Render Server Component bất đồng bộ như một phần tử.</strong> <code>render(&lt;BookingPage /&gt;)</code> khiến React coi nó là client component bất đồng bộ và từ chối. Hãy await nó như một hàm rồi render kết quả — và nhớ rằng component con bất đồng bộ bên trong cũng hỏng y như vậy.</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Xếp code theo nơi nó chạy, rồi test mỗi phần ở cấp rẻ nhất.</li>
<li>Route handler: dựng <code>Request</code>, kiểm <code>Response</code>, trong môi trường node.</li>
<li>Server Component bất đồng bộ: <code>render(await Page(props))</code>, chỉ tầng ngoài cùng.</li>
<li>Đẩy logic vào hàm thuần; giữ trang và handler mỏng.</li>
<li>Định tuyến và trang đã ráp thuộc về test đầu-cuối.</li>
</ul>
</div>
`,
};
