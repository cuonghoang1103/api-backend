/**
 * Next.js & React — Mục 0: Giới thiệu khoá học & Hướng dẫn học.
 * Song ngữ EN/VI qua .ml-en / .ml-vi. KHÔNG dùng backtick trần trong content
 * (dùng &#96;), và mọi `${` trong code mẫu phải escape thành \${.
 */
import G00_8 from './giang/nxj-00-8.mjs';
import G00_9 from './giang/nxj-00-9.mjs';
import G00_1 from './giang/nxj-00-1.mjs';
import G00_2 from './giang/nxj-00-2.mjs';
import G00_3 from './giang/nxj-00-3.mjs';
import G00_4 from './giang/nxj-00-4.mjs';
const REF = '?ref=%2Fcourses%2Fnextjs%2Flearn&reflabel=Next.js';

export default {
  title: 'Section 0 — Introduction & How to Study|||Mục 0 — Giới thiệu khoá học & Hướng dẫn học',
  description: 'Đọc trước tiên: khoá học này dạy gì, React và Next.js khác nhau ra sao, cài đặt thế nào và dự án xuyên suốt là gì.',
  lessons: [
    /* ───────────────── Bắt đầu tại đây 1/2 ───────────────── */
    {
      title: 'Start here (1/2) — What Next.js is, and why it is worth your time|||Bắt đầu tại đây (1/2) — Next.js là gì, và vì sao đáng để bạn học',
      slug: 'nextjs-0-0-bat-dau-1',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bức tranh một trang trước khi vào chi tiết: vấn đề Next.js giải quyết, các mảnh ghép, và vì sao kỹ năng này đáng thời gian của bạn.',
      content: `
${G00_8}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (1/2)</span>
<h2>Next.js in one picture</h2>
<p class="lead">Before any code, hold the whole thing in your head. A web app shows data on a screen; the hard part is keeping the screen in sync with the data, making the first load fast, and shipping it somewhere real. React solves the first problem. Next.js wraps React to solve the rest.</p>

<h3>The short story</h3>
<p>In the old web you updated the page by hand every time the data changed — find an element, change it, repeat — and on a busy page humans always miss a spot. <strong>React</strong> (2013) ended that: you describe what the UI should look like for the current data, and React updates the screen for you. But React on its own runs entirely in the browser, which means a slow first paint and a page search engines see as empty. <strong>Next.js</strong> (first release on npm: October 2016) wraps React with a server, folder-based routing and a build system, so pages render on the server — fast, SEO-friendly — while staying interactive.</p>

<h3>The pieces, at a glance</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">React</span><span class="v">Turns data into UI: components, props, state, hooks. Chapters 1–7.</span></div>
  <div class="kv"><span class="k">Routing</span><span class="v">A folder under <code>app/</code> becomes a URL. No router to configure. Chapter 8.</span></div>
  <div class="kv"><span class="k">Server rendering</span><span class="v">Most components run on the server and ship no JavaScript. Chapter 9.</span></div>
  <div class="kv"><span class="k">Data &amp; mutations</span><span class="v">Fetch with caching, write with Server Actions — no hand-written API needed. Chapters 10–12.</span></div>
  <div class="kv"><span class="k">Build &amp; deploy</span><span class="v">Bundling, optimisation, and a production build you ship in Docker. Chapters 17–20.</span></div>
</div>

<h3>Why it is worth your time</h3>
<ul>
  <li><strong>Jobs.</strong> React and Next.js are among the most-requested frontend skills worldwide and in Vietnam.</li>
  <li><strong>Reach.</strong> It builds dashboards, social apps, e-commerce, admin panels, SaaS — anything with a screen.</li>
  <li><strong>Transfer.</strong> The React you learn here also powers React Native (mobile). Learn once, ship to web and phone.</li>
  <li><strong>Real.</strong> This very site, cuongthai.com, is a Next.js App Router app — the course is a tour of how it works.</li>
</ul>

<div class="callout ok"><p><strong>What &quot;done&quot; looks like for a beginner.</strong> By the end of Stage 1 you can build and reason about React components; by the end you can open a real App Router codebase and say why each page renders the way it does. You do not need to memorise APIs — you need the mental model, and that is what these first lessons install.</p></div>

<h3>🧪 Practice (10–15 min)</h3>
<div class="callout ok"><ol>
<li>In one sentence each, say what React does and what Next.js adds on top of it.</li>
<li>Open any web app you use daily and point to one thing that must render on the server (for SEO or speed) and one that must be interactive in the browser.</li>
<li>Write down your reason for learning this — a job, a product idea, a project — and keep it somewhere visible.</li>
</ol>
<p><strong>Done when:</strong> you can explain the React-vs-Next.js split in your own words and have a concrete reason to finish the course.</p></div>

<h3>🔬 Measured: what the server actually sends</h3>
<p>The same shopping cart (three items and a total) built twice — React alone with Vite 8.3.8, and Next.js 16.4.6 — then asked with <code>curl</code> and opened in a real browser (Chromium via Playwright) with JavaScript switched off.</p>
<p><strong>React alone (Vite SPA):</strong></p>
<pre><code class="language-bash">$ curl -s localhost:19301/</code></pre>
<div class="out">&lt;!doctype html&gt;
&lt;html lang="en"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8" /&gt;
    &lt;link rel="icon" type="image/svg+xml" href="/favicon.svg" /&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;
    &lt;title&gt;spa&lt;/title&gt;
    &lt;script type="module" crossorigin src="/assets/index-C5OXsyV8.js"&gt;&lt;/script&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;div id="root"&gt;&lt;/div&gt;
  &lt;/body&gt;
&lt;/html&gt;</div>
<p><strong>Next.js:</strong></p>
<pre><code class="language-bash">$ curl -s localhost:19300/ | grep -o '&lt;h1&gt;.*&lt;/p&gt;'</code></pre>
<div class="out">&lt;h1&gt;Giỏ hàng của An&lt;/h1&gt;&lt;ul&gt;&lt;li&gt;Bàn phím cơ — 890.000 đ&lt;/li&gt;&lt;li&gt;Chuột không dây — 350.000 đ&lt;/li&gt;&lt;li&gt;Lót chuột — 120.000 đ&lt;/li&gt;&lt;/ul&gt;&lt;p&gt;Tổng: &lt;b&gt;1.360.000 đ&lt;/b&gt;&lt;/p&gt;</div>
<div class="kv-grid">
  <div class="kv"><span class="k">HTML sent</span><span class="v">Vite SPA: 379 bytes, an empty <code>&lt;div id="root"&gt;</code> · Next.js: 7,228 bytes with the whole cart inside.</span></div>
  <div class="kv"><span class="k">JavaScript off</span><span class="v">Vite SPA: a blank page · Next.js: heading, three items and the total, all visible.</span></div>
  <div class="kv"><span class="k">JavaScript downloaded</span><span class="v">Vite SPA: 1 file, 220,005 bytes · Next.js: 5 files, 457,070 bytes (uncompressed, measured in the browser).</span></div>
</div>
<div class="callout warn"><p><strong>Honest reading.</strong> Next.js wins the <em>first paint</em> — the content is in the HTML, so people and crawlers see it before any script runs. It does <em>not</em> win the byte count on a tiny page: it still ships the React runtime to make the page interactive (hydration). Chapters 9 and 18 are about cutting that JavaScript down.</p></div>
<h3>📅 The history, checked against npm</h3>
<p>Dates are the publish times recorded by the npm registry (<code>npm view next time</code>), not memory. React was open-sourced in May 2013; the first <code>next</code> release is 1.0.0 on 25 October 2016 (ZEIT, now Vercel, was founded in 2015).</p>
<pre><code class="language-bash">$ npm view next time --json | grep -E '"(1\\.0\\.0|9\\.0\\.0|13\\.0\\.0|13\\.4\\.0|15\\.0\\.0|16\\.0\\.0|16\\.4\\.6)"'</code></pre>
<div class="out">  "1.0.0": "2016-10-25T15:11:17.819Z",
  "9.0.0": "2019-07-08T06:52:28.593Z",
  "13.0.0": "2022-10-25T17:31:20.550Z",
  "13.4.0": "2023-05-04T16:47:51.733Z",
  "15.0.0": "2024-10-21T18:22:34.996Z",
  "16.0.0": "2025-10-22T00:12:16.323Z",
  "16.4.6": "2026-11-09T20:33:38.821Z",</div>
<p>One week of downloads from the same registry (5–11 Nov 2026): <code>next</code> 91,355,769 · <code>react</code> 252,219,874.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># 1) React alone (Vite)</span>
npm create vite@latest spa -- --template react-ts --no-interactive
cd spa &amp;&amp; npm install &amp;&amp; npm run build &amp;&amp; npx vite preview --port 19301 &amp;
<span class="tok-comment"># 2) Next.js (the same cart component in src/app/page.tsx)</span>
npx create-next-app@latest ban-next    <span class="tok-comment">  # answer as in lesson 0.3</span>
cd ban-next &amp;&amp; npm run build &amp;&amp; npx next start -p 19300 &amp;
<span class="tok-comment"># 3) ask both with curl</span>
curl -s localhost:19301/
curl -s localhost:19300/ | grep -o '&lt;h1&gt;.*&lt;/p&gt;' </code></pre>
<p>Then open both pages, switch JavaScript off in DevTools (Command Menu → "Disable JavaScript") and reload.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-0-8-bat-dau-tai-day" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · Start here (1/2)</span><span class="lc-sub">What React is, how it was born, why companies still hire for it — the base of everything here</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-1-1-fullstack-react" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 1.1 — Fullstack with React</span><span class="lc-sub">The university-course view: where React sits in a full-stack app</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">React</span><span class="v">A library that turns data into UI and keeps the screen in sync.</span></div>
  <div class="kv"><span class="k">Next.js</span><span class="v">A framework around React adding routing, server rendering, data and build.</span></div>
  <div class="kv"><span class="k">Framework vs library</span><span class="v">A framework sets the structure and calls you; a library is code you call.</span></div>
  <div class="kv"><span class="k">App Router</span><span class="v">Next.js routing under <code>app/</code> — the modern model this course teaches.</span></div>
  <div class="kv"><span class="k">SSR / SEO</span><span class="v">Server rendering gives a fast first paint and content search engines can read.</span></div>
  <div class="kv"><span class="k">cuongthai.com</span><span class="v">The real Next.js app this course uses as its running example.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>React turns data into UI; Next.js wraps it with routing, server rendering, data handling and a build system.</li><li>The course is five stages: React first (1–7), then Next.js (8–20).</li><li>These skills are in high demand and transfer to mobile via React Native.</li><li>The goal is the mental model, not memorising APIs — enough to read a real codebase.</li></ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (1/2)</span>
<h2>Next.js trong một bức tranh</h2>
<p class="lead">Trước khi vào code, hãy nắm cả bức tranh trong đầu. Một ứng dụng web hiện dữ liệu lên màn hình; phần khó là giữ màn hình đồng bộ với dữ liệu, làm first paint nhanh, và ship nó tới một nơi thật. React giải quyết phần đầu. Next.js bọc React để lo phần còn lại.</p>

<h3>Câu chuyện ngắn</h3>
<p>Ở web cũ, bạn cập nhật trang bằng tay mỗi khi dữ liệu đổi — tìm một phần tử, sửa nó, lặp lại — và trên một trang bận rộn con người luôn sót một chỗ. <strong>React</strong> (2013) chấm dứt điều đó: bạn mô tả giao diện NÊN trông thế nào với dữ liệu hiện tại, còn React tự cập nhật màn hình hộ bạn. Nhưng React một mình chạy hoàn toàn trong trình duyệt, nghĩa là first paint chậm và một trang mà công cụ tìm kiếm thấy trống rỗng. <strong>Next.js</strong> (bản đầu tiên trên npm: tháng 10/2016) bọc React bằng một server, định tuyến theo thư mục và một hệ thống build, để trang render trên server — nhanh, thân thiện SEO — mà vẫn tương tác được.</p>

<h3>Các mảnh ghép, nhìn một lượt</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">React</span><span class="v">Biến dữ liệu thành UI: component, props, state, hooks. Chương 1–7.</span></div>
  <div class="kv"><span class="k">Định tuyến</span><span class="v">Một thư mục dưới <code>app/</code> trở thành một URL. Không cần cấu hình router. Chương 8.</span></div>
  <div class="kv"><span class="k">Render trên server</span><span class="v">Phần lớn component chạy trên server và không gửi JavaScript. Chương 9.</span></div>
  <div class="kv"><span class="k">Dữ liệu &amp; mutate</span><span class="v">Fetch có cache, ghi bằng Server Actions — không cần tự viết API. Chương 10–12.</span></div>
  <div class="kv"><span class="k">Build &amp; deploy</span><span class="v">Đóng gói, tối ưu, và một bản build production bạn ship bằng Docker. Chương 17–20.</span></div>
</div>

<h3>Vì sao đáng thời gian của bạn</h3>
<ul>
  <li><strong>Việc làm.</strong> React và Next.js thuộc nhóm kỹ năng frontend được tuyển nhiều nhất trên thế giới lẫn ở Việt Nam.</li>
  <li><strong>Phạm vi.</strong> Nó dựng dashboard, app xã hội, thương mại điện tử, trang quản trị, SaaS — bất cứ thứ gì có màn hình.</li>
  <li><strong>Chuyển giao.</strong> React bạn học ở đây cũng chạy React Native (di động). Học một lần, ship cho cả web lẫn điện thoại.</li>
  <li><strong>Thật.</strong> Chính trang này, cuongthai.com, là một app Next.js App Router — khoá học là chuyến tham quan cách nó hoạt động.</li>
</ul>

<div class="callout ok"><p><strong>&quot;Học xong&quot; với người mới trông thế nào.</strong> Hết Giai đoạn 1 bạn dựng và lý giải được component React; học xong bạn mở được một codebase App Router thật và nói được vì sao mỗi trang render như vậy. Bạn không cần học thuộc API — bạn cần mô hình tư duy, và đó là thứ những bài đầu này cài vào.</p></div>

<h3>🧪 Thực hành (10–15 phút)</h3>
<div class="callout ok"><ol>
<li>Mỗi cái một câu, nói React làm gì và Next.js thêm gì lên trên nó.</li>
<li>Mở một app web bạn dùng hằng ngày và chỉ ra một thứ phải render trên server (vì SEO hoặc tốc độ) và một thứ phải tương tác trong trình duyệt.</li>
<li>Viết ra lý do bạn học thứ này — một công việc, một ý tưởng sản phẩm, một dự án — và để chỗ dễ thấy.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được sự phân chia React-với-Next.js bằng lời của mình và có một lý do cụ thể để học hết khoá.</p></div>

<h3>🔬 Đo thật: máy chủ thật sự gửi gì</h3>
<p>Cùng một giỏ hàng (ba món và một dòng tổng) dựng hai lần — React một mình với Vite 8.3.8, và Next.js 16.4.6 — rồi hỏi bằng <code>curl</code> và mở trong trình duyệt thật (Chromium qua Playwright) đã tắt JavaScript.</p>
<p><strong>React một mình (Vite, SPA):</strong></p>
<pre><code class="language-bash">$ curl -s localhost:19301/</code></pre>
<div class="out">&lt;!doctype html&gt;
&lt;html lang="en"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8" /&gt;
    &lt;link rel="icon" type="image/svg+xml" href="/favicon.svg" /&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;
    &lt;title&gt;spa&lt;/title&gt;
    &lt;script type="module" crossorigin src="/assets/index-C5OXsyV8.js"&gt;&lt;/script&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;div id="root"&gt;&lt;/div&gt;
  &lt;/body&gt;
&lt;/html&gt;</div>
<p><strong>Next.js:</strong></p>
<pre><code class="language-bash">$ curl -s localhost:19300/ | grep -o '&lt;h1&gt;.*&lt;/p&gt;'</code></pre>
<div class="out">&lt;h1&gt;Giỏ hàng của An&lt;/h1&gt;&lt;ul&gt;&lt;li&gt;Bàn phím cơ — 890.000 đ&lt;/li&gt;&lt;li&gt;Chuột không dây — 350.000 đ&lt;/li&gt;&lt;li&gt;Lót chuột — 120.000 đ&lt;/li&gt;&lt;/ul&gt;&lt;p&gt;Tổng: &lt;b&gt;1.360.000 đ&lt;/b&gt;&lt;/p&gt;</div>
<div class="kv-grid">
  <div class="kv"><span class="k">HTML gửi về</span><span class="v">Vite SPA: 379 byte, một <code>&lt;div id="root"&gt;</code> rỗng · Next.js: 7.228 byte, cả giỏ hàng nằm trong đó.</span></div>
  <div class="kv"><span class="k">Tắt JavaScript</span><span class="v">Vite SPA: trang trắng · Next.js: tiêu đề, ba món và tổng tiền đều hiện.</span></div>
  <div class="kv"><span class="k">JavaScript tải về</span><span class="v">Vite SPA: 1 tệp, 220.005 byte · Next.js: 5 tệp, 457.070 byte (chưa nén, đo trong trình duyệt).</span></div>
</div>
<div class="callout warn"><p><strong>Đọc cho trung thực.</strong> Next.js thắng ở <em>lần vẽ đầu</em> (first paint) — nội dung nằm sẵn trong HTML nên người dùng và công cụ tìm kiếm thấy trước khi script nào chạy. Nó <em>không</em> thắng về số byte ở một trang nhỏ: nó vẫn gửi bộ chạy React để trang tương tác được (hydration). Chương 9 và 18 nói về việc cắt bớt lượng JavaScript đó.</p></div>
<h3>📅 Lịch sử, kiểm bằng npm</h3>
<p>Ngày tháng là thời điểm phát hành do sổ đăng ký npm ghi lại (<code>npm view next time</code>), không phải nhớ lại. React mở mã nguồn tháng 5/2013; bản <code>next</code> đầu tiên là 1.0.0 ngày 25/10/2016 (công ty ZEIT, nay là Vercel, thành lập năm 2015).</p>
<pre><code class="language-bash">$ npm view next time --json | grep -E '"(1\\.0\\.0|9\\.0\\.0|13\\.0\\.0|13\\.4\\.0|15\\.0\\.0|16\\.0\\.0|16\\.4\\.6)"'</code></pre>
<div class="out">  "1.0.0": "2016-10-25T15:11:17.819Z",
  "9.0.0": "2019-07-08T06:52:28.593Z",
  "13.0.0": "2022-10-25T17:31:20.550Z",
  "13.4.0": "2023-05-04T16:47:51.733Z",
  "15.0.0": "2024-10-21T18:22:34.996Z",
  "16.0.0": "2025-10-22T00:12:16.323Z",
  "16.4.6": "2026-11-09T20:33:38.821Z",</div>
<p>Lượt tải một tuần từ cùng sổ đăng ký đó (05–11/11/2026): <code>next</code> 91.355.769 · <code>react</code> 252.219.874.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># 1) React một mình (Vite)</span>
npm create vite@latest spa -- --template react-ts --no-interactive
cd spa &amp;&amp; npm install &amp;&amp; npm run build &amp;&amp; npx vite preview --port 19301 &amp;
<span class="tok-comment"># 2) Next.js (cùng component giỏ hàng trong src/app/page.tsx)</span>
npx create-next-app@latest ban-next    <span class="tok-comment">  # chọn như bài 0.3</span>
cd ban-next &amp;&amp; npm run build &amp;&amp; npx next start -p 19300 &amp;
<span class="tok-comment"># 3) hỏi cả hai bằng curl</span>
curl -s localhost:19301/
curl -s localhost:19300/ | grep -o '&lt;h1&gt;.*&lt;/p&gt;' </code></pre>
<p>Rồi mở cả hai trang, tắt JavaScript trong DevTools (Command Menu → "Disable JavaScript") và tải lại.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-0-8-bat-dau-tai-day" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · Bắt đầu tại đây (1/2)</span><span class="lc-sub">React là gì, ra đời thế nào, vì sao công ty vẫn tuyển — nền của mọi thứ trong khoá này</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-1-1-fullstack-react" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 1.1 — Fullstack với React</span><span class="lc-sub">Góc nhìn môn học ở trường: React đứng ở đâu trong một ứng dụng fullstack</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">React</span><span class="v">Một thư viện biến dữ liệu thành UI và giữ màn hình đồng bộ.</span></div>
  <div class="kv"><span class="k">Next.js</span><span class="v">Một framework quanh React thêm định tuyến, render server, dữ liệu và build.</span></div>
  <div class="kv"><span class="k">Framework vs library</span><span class="v">Framework định sẵn cấu trúc và gọi bạn; library là mã bạn gọi.</span></div>
  <div class="kv"><span class="k">App Router</span><span class="v">Định tuyến Next.js dưới <code>app/</code> — mô hình hiện đại khoá này dạy.</span></div>
  <div class="kv"><span class="k">SSR / SEO</span><span class="v">Render server cho first paint nhanh và nội dung công cụ tìm kiếm đọc được.</span></div>
  <div class="kv"><span class="k">cuongthai.com</span><span class="v">App Next.js thật mà khoá này dùng làm ví dụ xuyên suốt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>React biến dữ liệu thành UI; Next.js bọc nó bằng định tuyến, render server, xử lý dữ liệu và một hệ build.</li><li>Khoá có năm giai đoạn: React trước (1–7), rồi Next.js (8–20).</li><li>Các kỹ năng này được tuyển nhiều và chuyển giao được sang di động qua React Native.</li><li>Mục tiêu là mô hình tư duy, không phải học thuộc API — đủ để đọc một codebase thật.</li></ul>
</div>
`,
    },

    /* ───────────────── Bắt đầu tại đây 2/2 ───────────────── */
    {
      title: 'Start here (2/2) — How to learn this without drowning|||Bắt đầu tại đây (2/2) — Cách học thứ này mà không chết đuối',
      slug: 'nextjs-0-0-bat-dau-2',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Lộ trình, tư duy và nhịp học: vì sao học React trước, dựng song song thay vì ngồi xem, và dùng AI như công cụ chứ không phải cái nạng.',
      content: `
${G00_9}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (2/2)</span>
<h2>How to actually learn this</h2>
<p class="lead">The material is not hard one piece at a time; people drown by taking the pieces in the wrong order, or by watching instead of building. This lesson is the study plan that keeps that from happening to you.</p>

<h3>Learn in order — React before the framework</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>React first (Chapters 1–7)</b><br/>Almost every error in your first week with Next.js is a React error wearing a framework hat: a stale closure, a missing key, an effect that re-runs. Learn the model with no framework in the way.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Then the App Router (8–12)</b><br/>Now &quot;this component runs on the server&quot; means something, because you know what a component is.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Then build and ship (13–20)</b><br/>Styling, state, auth, performance, deploy — the 95% beyond a to-do list.</div></div>
</div>

<h3>The mindset that works</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Build alongside</span><span class="v">Type the code, do not paste it. Reading feels like understanding; the keyboard reveals the truth.</span></div>
  <div class="kv"><span class="k">Errors are the lesson</span><span class="v">React and Next errors are unusually good — read the whole message, it usually names the fix.</span></div>
  <div class="kv"><span class="k">Measure, do not guess</span><span class="v">For performance and bugs alike, check the real behaviour (build output, a curl, the profiler) before theorising.</span></div>
  <div class="kv"><span class="k">Finish each chapter</span><span class="v">Do the quiz and the Code Lab exercise — they catch the exact misunderstandings this course targets.</span></div>
</div>

<div class="pitfall"><p><strong>A word about asking an AI to write your code.</strong> An AI will happily produce a component that renders and is quietly wrong — a missing effect dependency, an index used as a key, a <code>'use client'</code> that drags half the app into the browser. It compiles, it runs, the bug ships. The point of this course is the judgement the AI does not have. Use it to go faster on what you already understand; never use it to skip understanding.</p></div>

<h3>🧪 Practice (10–15 min)</h3>
<div class="callout ok"><ol>
<li>Commit to the order: write &quot;React 1–7 before Next.js 8–20&quot; where you will see it, and resist jumping ahead.</li>
<li>Set up your study loop: create a dev app now, and plan to type (not paste) every snippet and read every error in full.</li>
<li>Find this course's Exam Room and Code Lab and bookmark where the Chapter 1 material lives.</li>
</ol>
<p><strong>Done when:</strong> you have a dev app ready, a plan to build alongside, and you know where the exercises are.</p></div>

<h3>⚠️ Three real incidents — reproduced on Next.js 16.4.6</h3>
<p>Each of these "worked on my machine". Two happened on this very site (they are in the project's incident log); the third is public. All three were re-run for this course on Next.js 16.4.6.</p>
<p><strong>1 · A new file in <code>public/</code> returns 404 (cuongthai.com, 30 Jul 2026).</strong> The 3D playground was rebuilt and its JavaScript files got new names; the running server answered 404 for files that existed on disk, no script ran, and the loading screen spun forever with no error. <code>next start</code> reads the file list of <code>public/</code> when it starts:</p>
<pre><code class="language-bash">$ npm run start -- -p 19304</code></pre><pre><code class="language-bash">$ curl -s -o /dev/null -w 'next.svg (có sẵn từ đầu) → %{http_code}\\n' localhost:19304/next.svg</code></pre><div class="out">next.svg (có sẵn từ đầu) → 200</div><pre><code class="language-bash">$ echo 'bài tập mới' &gt; public/moi.txt</code></pre><pre><code class="language-bash">$ curl -s -o /dev/null -w 'moi.txt vừa thêm → %{http_code}\\n' localhost:19304/moi.txt</code></pre><div class="out">moi.txt vừa thêm → 404</div><pre><code class="language-bash">$ ls public/</code></pre><div class="out">file.svg
globe.svg
moi.txt
next.svg
vercel.svg
window.svg
# khởi động lại server (Ctrl+C rồi npm run start)</div><pre><code class="language-bash">$ curl -s -o /dev/null -w 'moi.txt sau khi khởi động lại → %{http_code}\\n' localhost:19304/moi.txt</code></pre><div class="out">moi.txt sau khi khởi động lại → 200</div>
<p><strong>2 · <code>NEXT_PUBLIC_*</code> is baked in at build time (cuongthai.com, 2 Jul 2026).</strong> The GIF picker called GIPHY from the browser with a <code>NEXT_PUBLIC_</code> key; a build without the variable shipped a revoked fallback key. Built with <code>khoa-cu</code>, started with <code>khoa-moi</code>:</p>
<pre><code class="language-typescript">'use client';

export default function Khoa() {
  const khoa = process.env.NEXT_PUBLIC_GIF_KEY;
  return &lt;p&gt;Khoá GIF đang dùng: {khoa ?? '(trống)'}&lt;/p&gt;;
}</code></pre>
<pre><code class="language-bash">$ NEXT_PUBLIC_GIF_KEY=khoa-moi npm run start -- -p 19304</code></pre><pre><code class="language-bash">$ curl -s localhost:19304/khoa | grep -o 'Khoá GIF[^&lt;]*&lt;!-- --&gt;[^&lt;]*' | sed 's/&lt;!-- --&gt;//'</code></pre><div class="out">Khoá GIF đang dùng: khoa-cu</div><pre><code class="language-bash">$ grep -rl 'khoa-cu' .next/static/chunks/ | head -2</code></pre><div class="out">.next/static/chunks/03gwiic12gi_0.js</div>
<p><strong>3 · Middleware is not a wall (CVE-2025-29927, March 2025).</strong> One request header let anyone skip middleware on Next.js 15.0.0–15.2.2, and many apps checked login only there. <code>npm audit</code> on that version:</p>
<pre><code class="language-bash">$ npm audit --json | (lọc: lỗ hổng có chữ middleware)</code></pre><div class="out">moderate  Next.js Improper Middleware Redirect Handling Leads to SSRF 
          https://github.com/advisories/GHSA-4342-x723-ch2f · ảnh hưởng &gt;=15.0.0-canary.0 &lt;15.4.7
critical  Authorization Bypass in Next.js Middleware 
          https://github.com/advisories/GHSA-f82v-jwr5-mffw · ảnh hưởng &gt;=15.0.0 &lt;15.2.3
low       Next.js's Middleware / Proxy redirects can be cache-poisoned 
          https://github.com/advisories/GHSA-3g8h-86w9-wvmq · ảnh hưởng &gt;=12.2.0 &lt;15.5.16
high      Next.js has a Middleware / Proxy bypass in App Router applications via segment-prefetch routes 
          https://github.com/advisories/GHSA-267c-6grr-h53f · ảnh hưởng &gt;=15.2.0 &lt;15.5.16
high      Next.js has a Middleware / Proxy bypass in Pages Router applications using i18n 
          https://github.com/advisories/GHSA-36qx-fr4f-26g5 · ảnh hưởng &gt;=12.2.0 &lt;15.5.16
high      Next.js has a Middleware / Proxy bypass in App Router applications via segment-prefetch routes - Incomplete Fix Follow-Up 
          https://github.com/advisories/GHSA-26hh-7cqf-hhc6 · ảnh hưởng &gt;=15.2.0 &lt;15.5.18</div>
<div class="callout warn"><p><strong>What all three teach:</strong> "it worked" is not evidence. Reproduce with <code>npm run build &amp;&amp; npm run start</code>, measure what really arrives (curl, the build table, the Network tab), read the whole message — and check auth again where the data is read (Chapter 15).</p></div>
<h3>🧭 Two paths, and one study session</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Minimal path</span><span class="v">Chapters 1–12 + 20: build and deploy a working App Router app. About 6–8 weeks at five 50-minute sessions a week.</span></div>
  <div class="kv"><span class="k">Full path</span><span class="v">All 20 chapters: add auth, SEO, tests and speed. About 12–14 weeks at the same pace. A guide, not a rule.</span></div>
  <div class="kv"><span class="k">One session (50 min)</span><span class="v">10 read · 20 type the code · 10 change and break it · 10 quiz or Code Lab.</span></div>
</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npm run start -- -p 3000 &amp;
echo hi &gt; public/moi.txt
curl -s -o /dev/null -w '%{http_code}\\n' localhost:3000/moi.txt <span class="tok-comment">  # 404</span>
<span class="tok-comment"># restart the server, then ask again                              # 200</span>
NEXT_PUBLIC_GIF_KEY=old npm run build
NEXT_PUBLIC_GIF_KEY=new npm run start                          <span class="tok-comment">  # the page still says old</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-0-9-bat-dau-khi-khong-co" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · Start here (2/2)</span><span class="lc-sub">Unstructured frontends, and learning React without burning out</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-4-2-luc-dung-va-luc-chay" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy to a VPS · 4.2 — BUILD time and RUN time are two different moments</span><span class="lc-sub">Why a build-time variable cannot change at run time — incident 2 from the deploy side</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Learn in order</span><span class="v">Each stage depends on the last; React underlies everything in Next.js.</span></div>
  <div class="kv"><span class="k">Build alongside</span><span class="v">Active learning — type and break code instead of only reading.</span></div>
  <div class="kv"><span class="k">Read the error</span><span class="v">React/Next messages usually point straight at the fix.</span></div>
  <div class="kv"><span class="k">Measure, do not guess</span><span class="v">Check real behaviour before theorising about a bug or slow page.</span></div>
  <div class="kv"><span class="k">Exam Room &amp; Code Lab</span><span class="v">The graded tests and hands-on exercises that make it stick.</span></div>
  <div class="kv"><span class="k">AI as a tool</span><span class="v">Speed on what you understand, never a substitute for understanding.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Learn in order: React (1–7) before the App Router, because most early Next.js errors are really React errors.</li><li>Build alongside — type the code, change one thing, predict, then read the full error.</li><li>Measure real behaviour instead of guessing, for both bugs and performance.</li><li>Use AI to go faster on what you know, not to skip the understanding this course exists to give you.</li></ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (2/2)</span>
<h2>Cách thật sự học được thứ này</h2>
<p class="lead">Kiến thức không khó khi lấy từng mảnh một; người ta chết đuối vì lấy các mảnh sai thứ tự, hoặc vì ngồi xem thay vì dựng. Bài này là kế hoạch học giữ cho điều đó không xảy ra với bạn.</p>

<h3>Học theo thứ tự — React trước framework</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>React trước (Chương 1–7)</b><br/>Gần như mọi lỗi trong tuần đầu với Next.js đều là lỗi React đội mũ framework: một closure cũ, một key thiếu, một effect chạy lại. Hãy học mô hình khi chưa có framework chắn đường.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Rồi App Router (8–12)</b><br/>Giờ &quot;component này chạy trên server&quot; mới có nghĩa, vì bạn đã biết component là gì.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Rồi dựng và ship (13–20)</b><br/>Styling, state, auth, hiệu năng, deploy — 95% nằm ngoài một danh sách việc-cần-làm.</div></div>
</div>

<h3>Tư duy hiệu quả</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dựng song song</span><span class="v">Gõ code, đừng dán. Đọc thì thấy như hiểu; bàn phím mới lộ ra sự thật.</span></div>
  <div class="kv"><span class="k">Lỗi là bài học</span><span class="v">Lỗi React và Next tốt lạ thường — đọc trọn thông báo, nó thường nói thẳng cách sửa.</span></div>
  <div class="kv"><span class="k">Đo, đừng đoán</span><span class="v">Cả hiệu năng lẫn bug, hãy kiểm hành vi thật (output build, một curl, profiler) trước khi suy diễn.</span></div>
  <div class="kv"><span class="k">Học hết mỗi chương</span><span class="v">Làm quiz và bài Code Lab — chúng bắt đúng những hiểu lầm khoá này nhắm tới.</span></div>
</div>

<div class="pitfall"><p><strong>Một lời về việc nhờ AI viết code hộ.</strong> AI sẽ vui vẻ đẻ ra một component render được mà sai âm thầm — một effect thiếu phụ thuộc, một chỉ số dùng làm key, một <code>'use client'</code> kéo nửa ứng dụng xuống trình duyệt. Nó biên dịch được, chạy được, và bug lên production. Mục đích khoá này là cái phán đoán mà AI không có. Dùng nó để đi nhanh hơn ở chỗ bạn đã hiểu; đừng bao giờ dùng để nhảy qua phần hiểu.</p></div>

<h3>🧪 Thực hành (10–15 phút)</h3>
<div class="callout ok"><ol>
<li>Cam kết thứ tự: viết &quot;React 1–7 trước Next.js 8–20&quot; ở chỗ bạn sẽ thấy, và đừng nhảy cóc.</li>
<li>Dựng vòng lặp học của bạn: tạo một app dev ngay bây giờ, và định bụng sẽ gõ (không dán) mọi đoạn code và đọc trọn mọi lỗi.</li>
<li>Tìm Phòng thi và Code Lab của khoá này và đánh dấu nơi có phần Chương 1.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã có một app dev sẵn sàng, một kế hoạch dựng song song, và biết bài tập nằm ở đâu.</p></div>

<h3>⚠️ Ba sự cố thật — dựng lại trên Next.js 16.4.6</h3>
<p>Cả ba đều từng "chạy được trên máy mình". Hai sự cố xảy ra trên chính trang này (có trong nhật ký sự cố của dự án); sự cố thứ ba là công khai. Cả ba được chạy lại cho khoá học trên Next.js 16.4.6.</p>
<p><strong>1 · Tệp mới trong <code>public/</code> trả 404 (cuongthai.com, 30/07/2026).</strong> Sân chơi 3D được build lại, các tệp JavaScript đổi tên; máy chủ đang chạy trả 404 cho tệp có thật trên đĩa, không đoạn mã nào chạy, màn hình tải quay mãi mà không có lỗi nào. <code>next start</code> đọc danh sách tệp của <code>public/</code> lúc khởi động:</p>
<pre><code class="language-bash">$ npm run start -- -p 19304</code></pre><pre><code class="language-bash">$ curl -s -o /dev/null -w 'next.svg (có sẵn từ đầu) → %{http_code}\\n' localhost:19304/next.svg</code></pre><div class="out">next.svg (có sẵn từ đầu) → 200</div><pre><code class="language-bash">$ echo 'bài tập mới' &gt; public/moi.txt</code></pre><pre><code class="language-bash">$ curl -s -o /dev/null -w 'moi.txt vừa thêm → %{http_code}\\n' localhost:19304/moi.txt</code></pre><div class="out">moi.txt vừa thêm → 404</div><pre><code class="language-bash">$ ls public/</code></pre><div class="out">file.svg
globe.svg
moi.txt
next.svg
vercel.svg
window.svg
# khởi động lại server (Ctrl+C rồi npm run start)</div><pre><code class="language-bash">$ curl -s -o /dev/null -w 'moi.txt sau khi khởi động lại → %{http_code}\\n' localhost:19304/moi.txt</code></pre><div class="out">moi.txt sau khi khởi động lại → 200</div>
<p><strong>2 · <code>NEXT_PUBLIC_*</code> bị "nướng" vào lúc build (cuongthai.com, 02/07/2026).</strong> Ô chọn GIF gọi GIPHY từ trình duyệt bằng một khoá <code>NEXT_PUBLIC_</code>; một bản build thiếu biến đó mang theo khoá dự phòng đã bị thu hồi. Build với <code>khoa-cu</code>, chạy với <code>khoa-moi</code>:</p>
<pre><code class="language-typescript">'use client';

export default function Khoa() {
  const khoa = process.env.NEXT_PUBLIC_GIF_KEY;
  return &lt;p&gt;Khoá GIF đang dùng: {khoa ?? '(trống)'}&lt;/p&gt;;
}</code></pre>
<pre><code class="language-bash">$ NEXT_PUBLIC_GIF_KEY=khoa-moi npm run start -- -p 19304</code></pre><pre><code class="language-bash">$ curl -s localhost:19304/khoa | grep -o 'Khoá GIF[^&lt;]*&lt;!-- --&gt;[^&lt;]*' | sed 's/&lt;!-- --&gt;//'</code></pre><div class="out">Khoá GIF đang dùng: khoa-cu</div><pre><code class="language-bash">$ grep -rl 'khoa-cu' .next/static/chunks/ | head -2</code></pre><div class="out">.next/static/chunks/03gwiic12gi_0.js</div>
<p><strong>3 · Middleware không phải bức tường (CVE-2025-29927, 3/2025).</strong> Chỉ một header của request là bỏ qua được middleware trên Next.js 15.0.0–15.2.2, mà nhiều ứng dụng chỉ kiểm đăng nhập ở đó. <code>npm audit</code> trên bản đó:</p>
<pre><code class="language-bash">$ npm audit --json | (lọc: lỗ hổng có chữ middleware)</code></pre><div class="out">moderate  Next.js Improper Middleware Redirect Handling Leads to SSRF 
          https://github.com/advisories/GHSA-4342-x723-ch2f · ảnh hưởng &gt;=15.0.0-canary.0 &lt;15.4.7
critical  Authorization Bypass in Next.js Middleware 
          https://github.com/advisories/GHSA-f82v-jwr5-mffw · ảnh hưởng &gt;=15.0.0 &lt;15.2.3
low       Next.js's Middleware / Proxy redirects can be cache-poisoned 
          https://github.com/advisories/GHSA-3g8h-86w9-wvmq · ảnh hưởng &gt;=12.2.0 &lt;15.5.16
high      Next.js has a Middleware / Proxy bypass in App Router applications via segment-prefetch routes 
          https://github.com/advisories/GHSA-267c-6grr-h53f · ảnh hưởng &gt;=15.2.0 &lt;15.5.16
high      Next.js has a Middleware / Proxy bypass in Pages Router applications using i18n 
          https://github.com/advisories/GHSA-36qx-fr4f-26g5 · ảnh hưởng &gt;=12.2.0 &lt;15.5.16
high      Next.js has a Middleware / Proxy bypass in App Router applications via segment-prefetch routes - Incomplete Fix Follow-Up 
          https://github.com/advisories/GHSA-26hh-7cqf-hhc6 · ảnh hưởng &gt;=15.2.0 &lt;15.5.18</div>
<div class="callout warn"><p><strong>Cả ba dạy cùng một điều:</strong> "chạy được" không phải bằng chứng. Tái hiện bằng <code>npm run build &amp;&amp; npm run start</code>, đo thứ thật sự tới nơi (curl, bảng build, tab Network), đọc trọn thông báo — và kiểm lại quyền ở nơi đọc dữ liệu (Chương 15).</p></div>
<h3>🧭 Hai lộ trình, và một buổi học</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Lộ trình tối thiểu</span><span class="v">Chương 1–12 + 20: dựng và deploy được một ứng dụng App Router. Khoảng 6–8 tuần nếu học năm buổi 50 phút mỗi tuần.</span></div>
  <div class="kv"><span class="k">Lộ trình đầy đủ</span><span class="v">Cả 20 chương: thêm xác thực, SEO, test và tốc độ. Khoảng 12–14 tuần cùng nhịp. Chỉ là gợi ý, không phải luật.</span></div>
  <div class="kv"><span class="k">Một buổi (50 phút)</span><span class="v">10 phút đọc · 20 phút gõ mã · 10 phút sửa và phá thử · 10 phút quiz hoặc Code Lab.</span></div>
</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npm run start -- -p 3000 &amp;
echo hi &gt; public/moi.txt
curl -s -o /dev/null -w '%{http_code}\\n' localhost:3000/moi.txt <span class="tok-comment">  # 404</span>
<span class="tok-comment"># khởi động lại server rồi hỏi lại                                  # 200</span>
NEXT_PUBLIC_GIF_KEY=cu npm run build
NEXT_PUBLIC_GIF_KEY=moi npm run start                          <span class="tok-comment">  # trang vẫn in "cu" </span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-0-9-bat-dau-khi-khong-co" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · Bắt đầu tại đây (2/2)</span><span class="lc-sub">Frontend không cấu trúc, và học React không kiệt sức</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/deploy-vps/learn?lessonSlug=deploy-4-2-luc-dung-va-luc-chay" target="_blank" rel="noopener"><span class="lc-ico">🚀</span><span class="lc-body"><span class="lc-title">Deploy lên VPS · 4.2 — Lúc DỰNG và lúc CHẠY là hai thời điểm khác nhau</span><span class="lc-sub">Vì sao một biến lúc build không đổi được lúc chạy — sự cố 2 nhìn từ phía deploy</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Học theo thứ tự</span><span class="v">Mỗi giai đoạn dựa trên giai đoạn trước; React là nền cho mọi thứ trong Next.js.</span></div>
  <div class="kv"><span class="k">Dựng song song</span><span class="v">Học chủ động — gõ và làm hỏng code thay vì chỉ đọc.</span></div>
  <div class="kv"><span class="k">Đọc lỗi</span><span class="v">Thông báo của React/Next thường chỉ thẳng cách sửa.</span></div>
  <div class="kv"><span class="k">Đo, đừng đoán</span><span class="v">Kiểm hành vi thật trước khi suy diễn về một bug hay trang chậm.</span></div>
  <div class="kv"><span class="k">Phòng thi &amp; Code Lab</span><span class="v">Bài kiểm tra có chấm và bài tập thực hành giúp kiến thức bám lại.</span></div>
  <div class="kv"><span class="k">AI là công cụ</span><span class="v">Nhanh hơn ở chỗ bạn đã hiểu, không bao giờ thay cho việc hiểu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Học theo thứ tự: React (1–7) trước App Router, vì phần lớn lỗi Next.js lúc đầu thật ra là lỗi React.</li><li>Dựng song song — gõ code, đổi một thứ, đoán, rồi đọc trọn lỗi.</li><li>Đo hành vi thật thay vì đoán, cho cả bug lẫn hiệu năng.</li><li>Dùng AI để đi nhanh hơn ở chỗ bạn biết, không phải để nhảy qua cái hiểu mà khoá này sinh ra để trao cho bạn.</li></ul>
</div>
`,
    },

    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — About this course & the full roadmap|||0.1 — Về khoá học này & bản đồ toàn khoá',
      slug: 'nextjs-0-1-gioi-thieu',
      type: 'VIDEO',
      isFreePreview: true,
      // Video mở đầu: "React in 100 Seconds" (Fireship) — 100 giây nắm React là gì.
      video: { url: 'https://youtu.be/Tn6-PIqc4UM', durationSeconds: 0 },
      description: 'React & Next.js là gì, sinh ra để giải quyết vấn đề gì, thay thế cái gì, dùng ở đâu trong công việc — và bản đồ 20 chương.',
      content: `
${G00_1}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Next.js &amp; React — from zero to production</h2>
<p class="lead">This course teaches you to build a <strong>real frontend</strong>: an app that renders on the server, hydrates in the browser, holds real users and real data, survives a page refresh, ranks on Google, and keeps its bundle small enough to load on a phone. Not a toy counter that lives in one file and forgets everything the moment you reload.</p>

<h3>What makes this course different</h3>
<p>Most React tutorials stop at <code>useState</code> and a to-do list. That is roughly 5% of the job. The other 95% — the part that decides whether your app survives contact with real users and a real deploy — is what we spend most of our time on:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Typical tutorial</span><span class="v">"Use useEffect to fetch data."</span></div>
  <div class="kv"><span class="k">This course</span><span class="v">Why that fetch runs twice in dev, races itself when the user types fast, leaks when the component unmounts, and why a Server Component fetches without an effect at all.</span></div>
  <div class="kv"><span class="k">Typical tutorial</span><span class="v">"Next.js does SSR, it's faster."</span></div>
  <div class="kv"><span class="k">This course</span><span class="v">What actually runs on the server vs the browser, why <code>'use client'</code> is a boundary not a file flag, and how a single <code>useState</code> in the wrong place ships 200KB of JavaScript you didn't need.</span></div>
  <div class="kv"><span class="k">Typical tutorial</span><span class="v">"Deploy to Vercel, click deploy."</span></div>
  <div class="kv"><span class="k">This course</span><span class="v">Build the standalone output, put it in a Docker image, and understand why this exact site once showed an <em>infinite loading screen with no error</em> after a rebuild — because Next locks the <code>public/</code> file list at server start.</span></div>
</div>
<p>Every chapter ends with the same question: <em>what does this look like in an app that is actually running?</em> The examples are taken from a production Next.js app — <strong>cuongthai.com</strong>, the site you are reading this on — including its outages, its bad decisions and its fixes. When we say "a stale bundle 404'd and the whole page hung", that happened here, and we show you the log.</p>

<h3>What you will be able to build</h3>
<ul>
  <li>A multi-page app with the App Router: nested layouts, loading and error states, dynamic routes.</li>
  <li>Pages that render on the server (fast first paint, good SEO) and stay interactive in the browser.</li>
  <li>Data fetching with caching and revalidation — and mutations with Server Actions, no hand-written API route needed.</li>
  <li>Auth with cookies and middleware, forms with validation, file uploads, realtime UI.</li>
  <li>A themed, accessible, fast design system in Tailwind — and a build you can ship in Docker to a server you own.</li>
</ul>

<h3>Why does React even exist? What did it replace?</h3>
<p>For a beginner this is the missing piece: <em>why was this invented, and what was so painful before it?</em> In the 2000s, a web page's data and its HTML were kept in sync <strong>by hand</strong> — with jQuery or raw DOM calls, you found an element and mutated it every time something changed (Chapter 1 shows this code). On a page with hundreds of moving parts, humans forget a spot, the screen drifts out of sync with the data, and bugs multiply. React's founding idea, from Facebook in 2011, was to end that: <strong>you describe what the UI should look like for the current data, and React updates the DOM for you.</strong> It replaced manual DOM manipulation and the tangle of jQuery/Backbone/Angular-1 "keep it in sync yourself" code.</p>
<p><strong>And Next.js?</strong> Plain React runs entirely in the browser, which means a slow first paint and a page search engines see as empty. Next.js (from Vercel — then ZEIT — first released October 2016) wraps React with a server, file-based routing and a build system so pages render on the server — fast, SEO-friendly — while staying interactive. The full history and the people behind both is the next lesson.</p>

<h3>Where you actually use this at work</h3>
<p>React is the most widely used way to build user interfaces on the web, and Next.js is the most popular React framework — together they are the default frontend stack at a huge share of companies, from startups to Netflix, TikTok and Notion. Learning them is not academic:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">The job market</span><span class="v">"React developer" and "Next.js" are among the most-requested frontend skills in job listings worldwide and in Vietnam.</span></div>
  <div class="kv"><span class="k">What you build with it</span><span class="v">Dashboards, social apps, e-commerce, admin panels, marketing sites, SaaS products — anything with a screen a user clicks.</span></div>
  <div class="kv"><span class="k">It transfers</span><span class="v">React Native (mobile apps) uses the same components and hooks. Learn React once, ship to web and phone.</span></div>
  <div class="kv"><span class="k">This very site</span><span class="v">cuongthai.com — the app you are reading — is a Next.js + React frontend. This course is a tour of how it really works.</span></div>
</div>

<h3>The roadmap — 5 stages, 20 chapters</h3>
<p>Each stage assumes the one before it. Do not skip ahead: chapter 9 (Server vs Client Components) is unreadable if chapter 3 (state &amp; re-renders) never clicked, and chapter 12 (Server Actions) needs chapter 5 (effects) so you know what you are <em>not</em> doing anymore.</p>
<div class="lz-map">
  <div class="lz-stage">Stage 1 · React foundations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">JSX &amp; the rendering model</div><div class="lz-nsub">What React actually does: elements, the virtual tree, describe-don't-command</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Components, props &amp; composition</div><div class="lz-nsub">One-way data flow, children, lifting state, thinking in components</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">State &amp; the re-render model</div><div class="lz-nsub">useState, snapshots, batching, why "state is a snapshot" explains every bug</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Events &amp; controlled forms</div><div class="lz-nsub">Handlers, controlled vs uncontrolled inputs, the single source of truth</div></div></div>
  <div class="lz-stage">Stage 2 · Thinking in React (hooks)</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">useEffect &amp; synchronising with the outside</div><div class="lz-nsub">Deps, cleanup, the double-run in dev, races, the effects you shouldn't write</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">The hooks toolbox</div><div class="lz-nsub">useRef, useMemo, useCallback, useReducer, useContext, custom hooks</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Lists, keys &amp; render performance</div><div class="lz-nsub">Reconciliation, why the index key corrupts state, memo &amp; when it's useless</div></div></div>
  <div class="lz-stage">Stage 3 · Next.js App Router</div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Next.js &amp; the App Router</div><div class="lz-nsub">Routing by the file system, the project layout, dev vs build vs start</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Server vs Client Components</div><div class="lz-nsub">The boundary, <code>'use client'</code>, what ships to the browser and what doesn't</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Data fetching, caching &amp; revalidation</div><div class="lz-nsub">fetch on the server, the cache, revalidate, streaming with Suspense</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Routing in depth</div><div class="lz-nsub">Layouts, loading, error, dynamic segments, parallel &amp; intercepting routes</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Server Actions &amp; mutations</div><div class="lz-nsub">Forms without an API route, progressive enhancement, revalidatePath</div></div></div>
  <div class="lz-stage">Stage 4 · Building the real app</div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">Styling &amp; design systems</div><div class="lz-nsub">Tailwind, CSS variables, dark mode — and the theme trap that broke this site</div></div></div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Client &amp; server state</div><div class="lz-nsub">Zustand for client state, TanStack Query for server state, hydration</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">Auth, middleware, cookies &amp; sessions</div><div class="lz-nsub">Reading cookies on the server, protecting routes, the refresh-token dance</div></div></div>
  <div class="lz-node"><div class="lz-badge">16</div><div class="lz-nbody"><div class="lz-ntitle">Forms, validation &amp; uploads</div><div class="lz-nsub">react-hook-form, zod, optimistic UI, files to object storage</div></div></div>
  <div class="lz-stage">Stage 5 · Production</div>
  <div class="lz-node"><div class="lz-badge">17</div><div class="lz-nbody"><div class="lz-ntitle">Rendering strategies, SEO &amp; metadata</div><div class="lz-nsub">SSG, SSR, ISR, PPR — when each one, metadata, Open Graph, sitemaps</div></div></div>
  <div class="lz-node"><div class="lz-badge">18</div><div class="lz-nbody"><div class="lz-ntitle">Performance</div><div class="lz-nsub">Bundle analysis, code splitting, streaming, next/image, next/font</div></div></div>
  <div class="lz-node"><div class="lz-badge">19</div><div class="lz-nbody"><div class="lz-ntitle">Testing</div><div class="lz-nsub">React Testing Library, user-event, Playwright end-to-end</div></div></div>
  <div class="lz-node"><div class="lz-badge">20</div><div class="lz-nbody"><div class="lz-ntitle">Build &amp; deploy</div><div class="lz-nsub">standalone output, Docker, env vars baked at build, the traps that took this site down</div></div></div>
</div>

<div class="callout ok">
<p><strong>By the end</strong> you will not just "know React". You will be able to open the source of cuongthai.com — a real Next.js App Router codebase — read any page, and know why it renders the way it does. That is the bar.</p>
</div>

<div class="pitfall"><p><strong>Trap — starting with Next.js before React, because the tutorial you found did.</strong> Next.js is a framework <em>around</em> React, so almost every error you hit in the first week is a React error wearing a Next.js hat: a stale closure, a missing key, an effect that re-runs, state copied from a prop. Without the React model underneath, those read as framework quirks and you learn workarounds instead of causes. That is why this course spends its first seven chapters on React with no framework involved. If you already know React, skim them and check you can answer the traps; if you do not, they are the part that makes the rest cheap.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Open cuongthai.com (the site you are on) and look at one page; write one sentence guessing which parts render on the server and which stay interactive in the browser.</li>
<li>Map the 20 chapters onto the 5 stages from memory, then check against the roadmap above — note any chapter you could not place.</li>
<li>Write your own one-line goal for the course (for example: &quot;ship a Dockerised Next.js app I can read end to end&quot;) and keep it where you will see it.</li>
</ol>
<p><strong>Done when:</strong> you can name the 5 stages, place every chapter, and have written a goal you actually care about.</p></div>

<h3>🔬 Seen in a real browser: server HTML, then hydration</h3>
<p>A page with a heading, a paragraph and one Client Component — a click counter — built and served with Next.js 16.4.6:</p>
<pre><code class="language-typescript">'use client';
import { useState } from 'react';

export default function Dem() {
  const [n, setN] = useState(0);
  return &lt;button onClick={() =&gt; setN(n + 1)}&gt;Đã bấm: {n} lần&lt;/button&gt;;
}</code></pre>
<pre><code class="language-typescript">import Dem from './dem';

export default function Page() {
  return (
    &lt;main style={{ fontFamily: 'sans-serif', padding: 32 }}&gt;
      &lt;h1&gt;Bài 0.1 — HTML dựng ở máy chủ&lt;/h1&gt;
      &lt;p&gt;Đoạn chữ này có sẵn trong HTML.&lt;/p&gt;
      &lt;Dem /&gt;
    &lt;/main&gt;
  );
}</code></pre>
<pre><code class="language-bash">$ curl -s localhost:19305/ | grep -o '&lt;h1&gt;.*&lt;/button&gt;' | sed 's/&lt;!-- --&gt;//g'</code></pre><div class="out">&lt;h1&gt;Bài 0.1 — HTML dựng ở máy chủ&lt;/h1&gt;&lt;p&gt;Đoạn chữ này có sẵn trong HTML.&lt;/p&gt;&lt;button&gt;Đã bấm: 0 lần&lt;/button&gt;</div>
<p>The button is already in the HTML ("0 lần"). Opened in Chromium (Playwright) and clicked twice: with JavaScript <strong>on</strong> it reads <strong>2</strong>; with JavaScript <strong>off</strong> it still reads <strong>0</strong>. The button exists, but nothing attached its click handler — that attaching step is <strong>hydration</strong>.</p>
<p><strong>The practice task, done on this site:</strong> the headline is in cuongthai.com's HTML —</p>
<pre><code class="language-bash">$ curl -s https://cuongthai.com/ | grep -o '&lt;h1[^&gt;]*&gt;[^&lt;]*'</code></pre><div class="out">&lt;h1 class="landing-hero-title"&gt;Learn it.</div><pre><code class="language-bash">$ curl -s https://cuongthai.com/ | wc -c</code></pre><div class="out">  126878</div>
<p>— yet with JavaScript off a full-screen splash covers the page, and with JavaScript on the browser downloads 62 script files (2,858,921 bytes, uncompressed). "Server-rendered" does not automatically mean "visible without JavaScript" — Chapters 9 and 18 are about these trade-offs.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npm run start -- -p 3000
curl -s localhost:3000/ | grep -o '&lt;h1&gt;.*&lt;/button&gt;'
<span class="tok-comment"># then open the page, DevTools → Command Menu → "Disable JavaScript", click the button</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-4-5-dom-events" target="_blank" rel="noopener"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">Web Foundations · 4.5 — DOM and events</span><span class="lc-sub">The "keep it in sync by hand" code React replaced — from the ground up</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-0-2-jsx" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 0.2 — JSX, explained</span><span class="lc-sub">What React alone turns JSX into, and what appears on screen</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SPA</span><span class="v">Single-Page App: React alone runs in the browser; the server sends near-empty HTML.</span></div>
  <div class="kv"><span class="k">SSR</span><span class="v">Server-Side Rendering: pages render to HTML on the server for a fast first paint and SEO.</span></div>
  <div class="kv"><span class="k">Hydration</span><span class="v">The browser attaching event handlers to server-rendered HTML so it becomes interactive.</span></div>
  <div class="kv"><span class="k">Server Component</span><span class="v">A component that runs only on the server and never ships its JavaScript to the browser.</span></div>
  <div class="kv"><span class="k">App Router</span><span class="v">The modern Next.js routing system under <code>app/</code>; the one this course teaches.</span></div>
  <div class="kv"><span class="k">Bundle</span><span class="v">The JavaScript sent to the browser; keeping it small is a recurring theme of the course.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>This course covers the 95% beyond a to-do list: what runs where, why effects misbehave, and how a deploy really works.</li><li>Examples come from a real production app (cuongthai.com), including its outages and fixes.</li><li>20 chapters across 5 stages, built so each stage depends on the one before — do them in order.</li><li>The bar is being able to open a real App Router codebase and explain why each page renders the way it does.</li></ul>

<h3>📚 Learn deeper</h3>
<p>The 100-second video above is the fastest possible overview. To go further, these are the primary sources — bookmark them, this course sends you back to them often:</p>
<a class="link-card dl" href="https://react.dev/learn" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">react.dev — the official React docs</span><span class="lc-sub">Rewritten in 2023 and genuinely excellent; the "Learn React" path is the canonical tutorial.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">nextjs.org/docs — the official Next.js docs</span><span class="lc-sub">The App Router reference. Make sure any tutorial you follow uses the App Router, not the old Pages Router.</span></span>
</a>
<a class="link-card dl" href="https://roadmap.sh/react" target="_blank" rel="noopener">
  <span class="lc-ico">🗺️</span>
  <span class="lc-body"><span class="lc-title">roadmap.sh/react — the React learning roadmap</span><span class="lc-sub">A visual map of everything a React developer learns, and in what order. Good for seeing the whole forest.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Next.js &amp; React — từ số 0 đến production</h2>
<p class="lead">Khoá học này dạy bạn xây một <strong>frontend thật</strong>: một ứng dụng render trên server, hydrate trong trình duyệt, có người dùng thật và dữ liệu thật, sống sót qua một lần tải lại trang, lên top Google, và giữ gói JavaScript đủ nhẹ để tải trên điện thoại. Không phải cái counter đồ chơi nằm gọn trong một file và quên sạch mọi thứ ngay khi bạn reload.</p>

<h3>Khoá này khác gì</h3>
<p>Phần lớn tutorial React dừng ở <code>useState</code> và một danh sách việc-cần-làm. Đó mới chừng 5% công việc. 95% còn lại — phần quyết định ứng dụng của bạn có sống nổi khi gặp người dùng thật và một lần deploy thật hay không — mới là chỗ chúng ta dành phần lớn thời gian:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tutorial thường thấy</span><span class="v">"Dùng useEffect để fetch dữ liệu."</span></div>
  <div class="kv"><span class="k">Khoá này</span><span class="v">Vì sao fetch đó chạy hai lần ở môi trường dev, tự đua với chính nó khi người dùng gõ nhanh, rò rỉ khi component bị gỡ, và vì sao một Server Component fetch mà chẳng cần effect nào cả.</span></div>
  <div class="kv"><span class="k">Tutorial thường thấy</span><span class="v">"Next.js có SSR, nhanh hơn."</span></div>
  <div class="kv"><span class="k">Khoá này</span><span class="v">Cái gì THẬT SỰ chạy trên server so với trên trình duyệt, vì sao <code>'use client'</code> là một RANH GIỚI chứ không phải cờ đánh dấu file, và làm sao một <code>useState</code> đặt sai chỗ đẩy 200KB JavaScript bạn không cần xuống máy người dùng.</span></div>
  <div class="kv"><span class="k">Tutorial thường thấy</span><span class="v">"Deploy lên Vercel, bấm deploy."</span></div>
  <div class="kv"><span class="k">Khoá này</span><span class="v">Dựng bản standalone, bỏ vào ảnh Docker, và hiểu vì sao chính site này từng hiện <em>màn hình tải xoay mãi mà không một lỗi nào</em> sau một lần build lại — vì Next chốt danh sách file trong <code>public/</code> ngay lúc server khởi động.</span></div>
</div>
<p>Mỗi chương đều kết bằng cùng một câu hỏi: <em>thứ này trông ra sao trong một ứng dụng đang thật sự chạy?</em> Các ví dụ lấy từ một ứng dụng Next.js đang chạy production — <strong>cuongthai.com</strong>, chính trang bạn đang đọc — kể cả những lần sập, những quyết định sai và cách sửa. Khi chúng ta nói "một bundle cũ trả 404 và cả trang treo", chuyện đó xảy ra ở đây, và chúng ta cho bạn xem log.</p>

<h3>Bạn sẽ làm được gì</h3>
<ul>
  <li>Một ứng dụng nhiều trang với App Router: layout lồng nhau, trạng thái loading và error, route động.</li>
  <li>Trang render trên server (first paint nhanh, SEO tốt) mà vẫn tương tác được trong trình duyệt.</li>
  <li>Fetch dữ liệu có cache và revalidate — và mutate bằng Server Actions, không cần tự viết API route.</li>
  <li>Xác thực bằng cookie và middleware, form có validation, upload file, UI realtime.</li>
  <li>Một hệ thiết kế Tailwind có theme, dễ tiếp cận, nhanh — và một bản build bạn ship bằng Docker lên máy chủ của chính mình.</li>
</ul>

<h3>Vì sao React ra đời? Nó thay thế cái gì?</h3>
<p>Với người mới, đây là mảnh còn thiếu: <em>vì sao người ta phát minh ra nó, và trước đó khổ ở chỗ nào?</em> Những năm 2000, dữ liệu của một trang web và HTML của nó được giữ đồng bộ <strong>bằng tay</strong> — với jQuery hay lệnh DOM trần, bạn tìm một phần tử rồi tự sửa nó mỗi khi có gì thay đổi (Chương 1 cho bạn xem đoạn code đó). Trên một trang có hàng trăm bộ phận động, con người quên một chỗ, màn hình trôi lệch khỏi dữ liệu, và bug nhân lên. Ý tưởng khai sinh React, từ Facebook năm 2011, là chấm dứt điều đó: <strong>bạn mô tả giao diện NÊN trông thế nào với dữ liệu hiện tại, còn React tự cập nhật DOM hộ bạn.</strong> Nó thay thế việc thao tác DOM bằng tay và mớ code "tự đi mà giữ đồng bộ" của jQuery/Backbone/Angular-1.</p>
<p><strong>Còn Next.js?</strong> React thuần chạy hoàn toàn trong trình duyệt, nghĩa là first paint chậm và một trang mà công cụ tìm kiếm nhìn thấy trống rỗng. Next.js (từ Vercel — khi đó là ZEIT — bản đầu tiên tháng 10/2016) bọc React bằng một server, định tuyến theo file và một hệ thống build để trang render trên server — nhanh, thân thiện SEO — mà vẫn tương tác được. Toàn bộ lịch sử và những con người đứng sau cả hai là bài học ngay sau đây.</p>

<h3>Bạn dùng thứ này ở đâu trong công việc</h3>
<p>React là cách được dùng rộng rãi nhất để dựng giao diện người dùng trên web, và Next.js là framework React phổ biến nhất — cùng nhau chúng là bộ frontend mặc định ở một lượng lớn công ty, từ startup tới Netflix, TikTok và Notion. Học chúng không phải chuyện hàn lâm:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Thị trường việc làm</span><span class="v">"React developer" và "Next.js" thuộc nhóm kỹ năng frontend được tuyển nhiều nhất trên thế giới lẫn ở Việt Nam.</span></div>
  <div class="kv"><span class="k">Bạn xây gì với nó</span><span class="v">Dashboard, ứng dụng xã hội, thương mại điện tử, trang quản trị, trang marketing, sản phẩm SaaS — bất cứ thứ gì có màn hình để người dùng bấm.</span></div>
  <div class="kv"><span class="k">Nó chuyển giao được</span><span class="v">React Native (app di động) dùng cùng component và hooks. Học React một lần, ship cho cả web lẫn điện thoại.</span></div>
  <div class="kv"><span class="k">Chính trang này</span><span class="v">cuongthai.com — ứng dụng bạn đang đọc — là một frontend Next.js + React. Khoá này là chuyến tham quan cách nó thật sự hoạt động.</span></div>
</div>

<h3>Bản đồ — 5 giai đoạn, 20 chương</h3>
<p>Mỗi giai đoạn giả định bạn đã qua giai đoạn trước. Đừng nhảy cóc: chương 9 (Server vs Client Component) không đọc nổi nếu chương 3 (state &amp; re-render) chưa thông, và chương 12 (Server Actions) cần chương 5 (effect) để bạn biết mình <em>không còn</em> phải làm gì nữa.</p>
<div class="lz-map">
  <div class="lz-stage">Giai đoạn 1 · Nền tảng React</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">JSX &amp; mô hình render</div><div class="lz-nsub">React thật sự làm gì: element, cây ảo, mô tả-đừng-ra-lệnh</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Component, props &amp; ghép</div><div class="lz-nsub">Dòng dữ liệu một chiều, children, nâng state lên, tư duy theo component</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">State &amp; mô hình render lại</div><div class="lz-nsub">useState, ảnh chụp, gộp lô, vì sao "state là ảnh chụp" giải thích mọi bug</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Sự kiện &amp; form có kiểm soát</div><div class="lz-nsub">Handler, input controlled vs uncontrolled, một nguồn sự thật duy nhất</div></div></div>
  <div class="lz-stage">Giai đoạn 2 · Tư duy React (hooks)</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">useEffect &amp; đồng bộ với bên ngoài</div><div class="lz-nsub">Mảng phụ thuộc, dọn dẹp, chạy hai lần ở dev, đua, những effect không nên viết</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Bộ đồ nghề hooks</div><div class="lz-nsub">useRef, useMemo, useCallback, useReducer, useContext, hook tự viết</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Danh sách, key &amp; hiệu năng render</div><div class="lz-nsub">Reconciliation, vì sao key theo chỉ số làm hỏng state, memo &amp; khi nào vô ích</div></div></div>
  <div class="lz-stage">Giai đoạn 3 · Next.js App Router</div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Next.js &amp; App Router</div><div class="lz-nsub">Định tuyến theo hệ thống file, bố cục dự án, dev vs build vs start</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Server vs Client Component</div><div class="lz-nsub">Ranh giới, <code>'use client'</code>, cái gì xuống trình duyệt và cái gì không</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Fetch, cache &amp; revalidate</div><div class="lz-nsub">fetch trên server, bộ nhớ đệm, revalidate, streaming với Suspense</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Định tuyến chuyên sâu</div><div class="lz-nsub">Layout, loading, error, đoạn động, route song song &amp; chặn</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Server Actions &amp; mutate</div><div class="lz-nsub">Form không cần API route, cải tiến tiệm tiến, revalidatePath</div></div></div>
  <div class="lz-stage">Giai đoạn 4 · Dựng app thật</div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">Styling &amp; hệ thiết kế</div><div class="lz-nsub">Tailwind, biến CSS, dark mode — và cái bẫy theme từng làm hỏng site này</div></div></div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">State client &amp; server</div><div class="lz-nsub">Zustand cho state client, TanStack Query cho state server, hydration</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">Auth, middleware, cookie &amp; phiên</div><div class="lz-nsub">Đọc cookie trên server, chặn route, điệu nhảy refresh-token</div></div></div>
  <div class="lz-node"><div class="lz-badge">16</div><div class="lz-nbody"><div class="lz-ntitle">Form, validation &amp; upload</div><div class="lz-nsub">react-hook-form, zod, UI lạc quan, đưa file lên object storage</div></div></div>
  <div class="lz-stage">Giai đoạn 5 · Production</div>
  <div class="lz-node"><div class="lz-badge">17</div><div class="lz-nbody"><div class="lz-ntitle">Chiến lược render, SEO &amp; metadata</div><div class="lz-nsub">SSG, SSR, ISR, PPR — khi nào dùng cái nào, metadata, Open Graph, sitemap</div></div></div>
  <div class="lz-node"><div class="lz-badge">18</div><div class="lz-nbody"><div class="lz-ntitle">Hiệu năng</div><div class="lz-nsub">Phân tích bundle, tách mã, streaming, next/image, next/font</div></div></div>
  <div class="lz-node"><div class="lz-badge">19</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm thử</div><div class="lz-nsub">React Testing Library, user-event, Playwright end-to-end</div></div></div>
  <div class="lz-node"><div class="lz-badge">20</div><div class="lz-nbody"><div class="lz-ntitle">Build &amp; deploy</div><div class="lz-nsub">bản standalone, Docker, env bake lúc build, những cái bẫy từng hạ site này</div></div></div>
</div>

<div class="callout ok">
<p><strong>Học xong</strong> bạn sẽ không chỉ "biết React". Bạn sẽ mở được mã nguồn cuongthai.com — một codebase Next.js App Router thật — đọc bất kỳ trang nào, và biết vì sao nó render theo cách nó render. Đó là cái chuẩn.</p>
</div>

<div class="pitfall"><p><strong>Bẫy — bắt đầu với Next.js trước khi biết React, vì bài hướng dẫn bạn tìm được làm thế.</strong> Next.js là một framework bọc <em>quanh</em> React, nên gần như mọi lỗi bạn gặp trong tuần đầu đều là lỗi React đội mũ Next.js: một closure cũ, một key bị thiếu, một effect chạy lại, state chép từ một prop. Thiếu mô hình React ở bên dưới thì chúng đọc lên như những nét kỳ quặc của framework, và bạn học được các mẹo lách thay vì học nguyên nhân. Đó là lý do khoá này dành bảy chương đầu cho React mà chẳng dính framework nào. Nếu bạn đã biết React thì hãy lướt qua và kiểm xem mình trả lời được các cái bẫy không; nếu chưa thì đó chính là phần làm cho mọi thứ còn lại trở nên rẻ.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở cuongthai.com (chính trang bạn đang xem) và nhìn một trang; viết một câu đoán phần nào render trên server, phần nào tương tác trong trình duyệt.</li>
<li>Nhớ lại và ánh xạ 20 chương vào 5 giai đoạn, rồi đối chiếu với bản đồ phía trên — ghi lại chương nào bạn chưa xếp được.</li>
<li>Viết mục tiêu một dòng của riêng bạn cho khoá (ví dụ: &quot;ship một app Next.js chạy Docker mà tôi đọc hiểu từ đầu đến cuối&quot;) và để chỗ dễ thấy.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn gọi tên được 5 giai đoạn, xếp được mọi chương, và đã viết một mục tiêu mình thật sự quan tâm.</p></div>

<h3>🔬 Nhìn trong trình duyệt thật: HTML từ máy chủ, rồi hydration</h3>
<p>Một trang có tiêu đề, đoạn chữ và một Client Component — nút đếm số lần bấm — build và chạy bằng Next.js 16.4.6:</p>
<pre><code class="language-typescript">'use client';
import { useState } from 'react';

export default function Dem() {
  const [n, setN] = useState(0);
  return &lt;button onClick={() =&gt; setN(n + 1)}&gt;Đã bấm: {n} lần&lt;/button&gt;;
}</code></pre>
<pre><code class="language-typescript">import Dem from './dem';

export default function Page() {
  return (
    &lt;main style={{ fontFamily: 'sans-serif', padding: 32 }}&gt;
      &lt;h1&gt;Bài 0.1 — HTML dựng ở máy chủ&lt;/h1&gt;
      &lt;p&gt;Đoạn chữ này có sẵn trong HTML.&lt;/p&gt;
      &lt;Dem /&gt;
    &lt;/main&gt;
  );
}</code></pre>
<pre><code class="language-bash">$ curl -s localhost:19305/ | grep -o '&lt;h1&gt;.*&lt;/button&gt;' | sed 's/&lt;!-- --&gt;//g'</code></pre><div class="out">&lt;h1&gt;Bài 0.1 — HTML dựng ở máy chủ&lt;/h1&gt;&lt;p&gt;Đoạn chữ này có sẵn trong HTML.&lt;/p&gt;&lt;button&gt;Đã bấm: 0 lần&lt;/button&gt;</div>
<p>Cái nút đã có sẵn trong HTML ("0 lần"). Mở bằng Chromium (Playwright) và bấm hai lần: <strong>bật</strong> JavaScript thì ghi <strong>2</strong>; <strong>tắt</strong> JavaScript thì vẫn <strong>0</strong>. Nút có đó, nhưng chưa ai gắn trình xử lý sự kiện cho nó — bước gắn đó chính là <strong>hydration</strong>.</p>
<p><strong>Bài thực hành, làm thử trên chính trang này:</strong> dòng chữ lớn có trong HTML của cuongthai.com —</p>
<pre><code class="language-bash">$ curl -s https://cuongthai.com/ | grep -o '&lt;h1[^&gt;]*&gt;[^&lt;]*'</code></pre><div class="out">&lt;h1 class="landing-hero-title"&gt;Learn it.</div><pre><code class="language-bash">$ curl -s https://cuongthai.com/ | wc -c</code></pre><div class="out">  126878</div>
<p>— nhưng tắt JavaScript thì một màn tải che kín trang, còn bật lên thì trình duyệt tải 62 tệp script (2.858.921 byte, chưa nén). "Render ở máy chủ" không tự động nghĩa là "nhìn thấy khi không có JavaScript" — Chương 9 và 18 bàn về những đánh đổi này.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run build &amp;&amp; npm run start -- -p 3000
curl -s localhost:3000/ | grep -o '&lt;h1&gt;.*&lt;/button&gt;'
<span class="tok-comment"># rồi mở trang, DevTools → Command Menu → "Disable JavaScript", bấm nút</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-4-5-dom-events" target="_blank" rel="noopener"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">Nền tảng Lập trình Web · 4.5 — DOM và sự kiện</span><span class="lc-sub">Đoạn mã "giữ khớp bằng tay" mà React thay thế — học từ gốc</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-0-2-jsx" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 0.2 — JSX, giải thích cho rõ</span><span class="lc-sub">React một mình biến JSX thành gì, và cái gì hiện lên màn hình</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SPA</span><span class="v">Ứng dụng một trang: React một mình chạy trong trình duyệt; server gửi HTML gần như rỗng.</span></div>
  <div class="kv"><span class="k">SSR</span><span class="v">Render trên server: trang dựng ra HTML ở server để first paint nhanh và SEO tốt.</span></div>
  <div class="kv"><span class="k">Hydration</span><span class="v">Trình duyệt gắn handler sự kiện vào HTML server render để nó tương tác được.</span></div>
  <div class="kv"><span class="k">Server Component</span><span class="v">Component chỉ chạy trên server và không bao giờ gửi JavaScript của nó xuống trình duyệt.</span></div>
  <div class="kv"><span class="k">App Router</span><span class="v">Hệ định tuyến Next.js hiện đại nằm dưới <code>app/</code>; cái khoá này dạy.</span></div>
  <div class="kv"><span class="k">Bundle</span><span class="v">Gói JavaScript gửi xuống trình duyệt; giữ nó nhỏ là chủ đề lặp lại suốt khoá.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Khoá này dạy 95% nằm ngoài một danh sách việc-cần-làm: cái gì chạy ở đâu, vì sao effect cư xử sai, và một lần deploy thật diễn ra thế nào.</li><li>Ví dụ lấy từ một app production thật (cuongthai.com), kể cả các lần sập và cách sửa.</li><li>20 chương trong 5 giai đoạn, dựng sao cho mỗi giai đoạn dựa trên giai đoạn trước — hãy học theo thứ tự.</li><li>Cái chuẩn là mở được một codebase App Router thật và giải thích được vì sao mỗi trang render như vậy.</li></ul>

<h3>📚 Học sâu thêm</h3>
<p>Video 100 giây phía trên là bản tổng quan nhanh nhất có thể. Muốn đi xa hơn, đây là các nguồn gốc — hãy lưu lại, khoá này sẽ gửi bạn quay về chúng thường xuyên:</p>
<a class="link-card dl" href="https://react.dev/learn" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">react.dev — tài liệu React chính thức</span><span class="lc-sub">Viết lại năm 2023 và thật sự xuất sắc; lộ trình "Learn React" là tutorial chuẩn mực.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">nextjs.org/docs — tài liệu Next.js chính thức</span><span class="lc-sub">Tham chiếu App Router. Hãy chắc mọi tutorial bạn theo dùng App Router, không phải Pages Router cũ.</span></span>
</a>
<a class="link-card dl" href="https://roadmap.sh/react" target="_blank" rel="noopener">
  <span class="lc-ico">🗺️</span>
  <span class="lc-body"><span class="lc-title">roadmap.sh/react — lộ trình học React</span><span class="lc-sub">Bản đồ trực quan mọi thứ một React developer học, và theo thứ tự nào. Tốt để thấy toàn cảnh khu rừng.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — React vs Next.js: what each one is|||0.2 — React vs Next.js: mỗi cái là gì',
      slug: 'nextjs-0-2-react-vs-nextjs',
      type: 'VIDEO',
      isFreePreview: true,
      // Video lịch sử: Pete Hunt "React: Rethinking best practices" — JSConf EU 2013,
      // chính talk giới thiệu React ra thế giới lần đầu.
      video: { url: 'https://youtu.be/x7cQ3mrcKaY', durationSeconds: 0 },
      description: 'React là thư viện; Next.js là framework bọc quanh nó. Ai tạo ra chúng, năm nào, vì sao — và vì sao cần cả hai.',
      content: `
${G00_2}
<div class="ml-en">
<div class="callout ok"><strong>Next.js is a framework FOR React, not a separate library.</strong> React is the library that draws the UI (components, props, state, hooks). Next.js is a framework built on top of it that adds routing by folders, Server Components, data caching, SEO and deployment. So the recommended order on CuongThai is: <a href="/courses/react">React</a> first, then this course. If you already know React, Chapters 1&ndash;7 are a refresher you can skim.</div>
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>React is a library. Next.js is a framework.</h2>
<p class="lead">People say "React or Next.js?" as if they compete. They don't. React is the engine that turns your data into a user interface. Next.js is the car built around that engine — it adds the routing, the server, the build system and the deployment story that React deliberately leaves out.</p>

<h3>A short history: who built these, and why</h3>
<p><strong>React — Facebook, 2011 → open-sourced 2013.</strong> A Facebook engineer named <strong>Jordan Walke</strong> built the first version (an internal prototype called "FaxJS") to tame Facebook's increasingly complex UI — the News Feed and ads interfaces were becoming impossible to keep in sync by hand. Facebook used it internally from 2011, then <strong>open-sourced React in May 2013</strong>. The developer world was sceptical at first: putting HTML-like markup inside JavaScript looked wrong. The talk that changed minds — <strong>Pete Hunt's "React: Rethinking best practices" at JSConf EU 2013</strong>, the video at the top of this lesson — argued that separating "markup" from "logic" was the wrong separation, and that a component (markup + logic together) was the right unit. React is maintained today by <strong>Meta</strong> and a large open-source community.</p>
<p><strong>Next.js — Vercel, 2016.</strong> React solved the UI, but every team re-invented the same things around it: routing, server rendering, bundling. <strong>Guillermo Rauch</strong> and his company (then ZEIT, now <strong>Vercel</strong>) released <strong>Next.js 1.0 on 25 October 2016</strong> (the company itself dates from 2015; the date is the first <code>next</code> release in the npm registry) to package those decisions into one framework. Its big leap came in 2020–2023 with the App Router and React Server Components — the model this course teaches.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">2011</span><span class="v">Jordan Walke builds React inside Facebook.</span></div>
  <div class="kv"><span class="k">May 2013</span><span class="v">React open-sourced; Pete Hunt's JSConf talk introduces it to the world.</span></div>
  <div class="kv"><span class="k">Oct 2016</span><span class="v">Guillermo Rauch releases Next.js at ZEIT/Vercel.</span></div>
  <div class="kv"><span class="k">2022–23</span><span class="v">Next.js App Router + React Server Components — the modern model.</span></div>
</div>

<h3>What React gives you, and what it doesn't</h3>
<p>React answers exactly one question: <em>given this data, what should the UI look like?</em> You write components; React renders them, and re-renders them efficiently when the data changes. That is the whole job.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">React DOES</span><span class="v">Components, JSX, state, hooks, the reconciler that updates the DOM efficiently.</span></div>
  <div class="kv"><span class="k">React does NOT</span><span class="v">Routing (which URL shows which page), server rendering, data fetching conventions, a build system, or how you deploy.</span></div>
</div>
<p>Left to itself, React runs entirely in the browser: the server sends a nearly-empty HTML file, the browser downloads a JavaScript bundle, and only then does the page appear. That is a <strong>Single-Page App (SPA)</strong>. It works, but the first paint is slow, and search engines see an empty page.</p>

<h3>What Next.js adds</h3>
<p>Next.js is a <strong>framework</strong>: it makes the decisions React left open, so a team doesn't reinvent them on every project.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>File-system routing</b><br/>A file at <code>app/blog/page.tsx</code> becomes the route <code>/blog</code>. No router config.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Server rendering by default</b><br/>Components run on the server and send finished HTML — fast first paint, real SEO.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Server Components</b><br/>Most of your UI never ships to the browser at all — less JavaScript, direct database access.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Data &amp; mutations</b><br/>fetch with caching, Server Actions for writes, no separate API layer required.</div></div>
  <div class="lz-step"><div class="lz-si">5</div><div class="lz-sb"><b>Build &amp; optimise</b><br/>Bundling, code-splitting, image and font optimisation, the production build.</div></div>
</div>
<p>Everything you learn about React in Stages 1–2 is still true inside Next.js — a component is a component. Next.js changes <em>where</em> it runs and <em>when</em>, not what it is. That is why this course teaches React first and Next.js second: you cannot understand "this component runs on the server" until you understand what a component is.</p>

<h3>App Router, not Pages Router</h3>
<p>Next.js has two routing systems. The old one lives in a <code>pages/</code> folder; the current one — the one this course teaches, and the one cuongthai.com uses — lives in <code>app/</code> and is called the <strong>App Router</strong>. It introduced React Server Components and a new mental model. Tutorials from before 2023 usually mean the old system; when something online contradicts this course, check which router it assumes first.</p>

<div class="note-ct">
<p><strong>How cuongthai.com is built</strong> — this site is a Next.js App Router app in the <code>frontend/</code> folder, talking to a separate Node.js + Express API in the project root. The frontend renders pages (some on the server, some in the browser); the backend owns the database, auth and file storage. Chapters 8–20 are essentially a guided tour of how the <code>frontend/</code> folder actually works.</p>
</div>

<div class="pitfall"><p><strong>Trap — following an App Router tutorial that is actually written for the Pages Router.</strong> The two live in the same framework and share most of their vocabulary, so the difference is easy to miss: &#96;getServerSideProps&#96;, &#96;_app.tsx&#96;, &#96;next/router&#96; and an &#96;api/&#96; folder all belong to the older Pages Router, and none of them do anything in &#96;app/&#96;. On Next.js 16.4.6 the build at least stops you — a &#96;getServerSideProps&#96; export in an &#96;app/&#96; page fails with <em>"getServerSideProps" is not supported in app/</em>, and &#96;next/router&#96; fails with <em>NextRouter was not mounted</em> (both measured below). Older advice says the export is silently ignored; on this version it is not. The real cost is the time you lose copying a whole tutorial written for the other router. Check the date and the imports before trusting an example: anything using &#96;next/router&#96; rather than &#96;next/navigation&#96; predates the split.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>List three jobs React does and three jobs it deliberately leaves out; check them against the lesson.</li>
<li>Find any Next.js tutorial online and decide in 30 seconds whether it is App Router or Pages Router — look for <code>next/navigation</code> (new) vs <code>next/router</code> (old) and <code>getServerSideProps</code>.</li>
<li>Write the one-line difference between a library and a framework in your own words, then place React and Next.js on each side.</li>
</ol>
<p><strong>Done when:</strong> you can say what React does not do, and you can spot a Pages-Router tutorial from its imports in seconds.</p></div>

<h3>🔬 Measured: a library you call, a framework that calls you</h3>
<p><strong>React is functions you call</strong> — no framework, straight from Node:</p>
<pre><code class="language-bash">$ node -e "…React.createElement('h1', null, 'Xin chào') → renderToString…"</code></pre><div class="out">&lt;h1&gt;Xin chào&lt;/h1&gt;</div>
<p><strong>Next.js calls you</strong> — put <code>src/app/blog/page.tsx</code> in place, no router configuration, and the build lists the route:</p>
<pre><code class="language-bash">$ npm run build 2&gt;&amp;1 | grep -A6 'Route (app)'</code></pre><div class="out">Route (app)
┌ ○ /
├ ○ /_not-found
└ ○ /blog


○  (Static)  prerendered as static content</div>
<p><strong>The trap, run on Next.js 16.4.6.</strong> A Pages Router <code>getServerSideProps</code> pasted into <code>app/blog/page.tsx</code>:</p>
<pre><code class="language-bash">$ npm run build 2&gt;&amp;1 | tail -14</code></pre><div class="out">&gt; Build error occurred
Error: Turbopack build failed with 1 error:
./src/app/blog/page.tsx:1:23
Error: "getServerSideProps" is not supported in app/. Read more: https://nextjs.org/docs/app/building-your-application/data-fetching
&gt; 1 | export async function getServerSideProps() {
    |                       ^^^^^^^^^^^^^^^^^^
  2 |   return { props: { tieuDe: 'Từ getServerSideProps' } };
  3 | }
  4 |

Ecmascript file had an error


    at ignore-listed frames</div>
<p>And <code>useRouter</code> from <code>next/router</code> in a Client Component under <code>app/</code>:</p>
<pre><code class="language-typescript">'use client';
import { useRouter } from 'next/router';

export default function Blog() {
  const router = useRouter();
  return &lt;h1&gt;Đang ở: {router.pathname}&lt;/h1&gt;;
}</code></pre>
<pre><code class="language-bash">$ npm run build 2&gt;&amp;1 | tail -14</code></pre><div class="out">Error occurred prerendering page "/blog". Read more: https://nextjs.org/docs/messages/prerender-error
Error: NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted
    at &lt;unknown&gt; (src/app/blog/page.tsx:5:18)
  3 |
  4 | export default function Blog() {
&gt; 5 |   const router = useRouter();
    |                  ^
  6 |   return &lt;h1&gt;Đang ở: {router.pathname}&lt;/h1&gt;;
  7 | }
  8 | {
  digest: '230069296'
}
Export encountered an error on /blog/page: /blog, exiting the build.
⨯ Next.js build worker exited with code: 1 and signal: null</div>
<p>The fix is <code>next/navigation</code> (Chapter 8). Both messages name the problem and link to the docs — read them whole.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-1-router" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.1 — React Router basics</span><span class="lc-sub">The routing React leaves open — done with a separate library</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-9-1-router" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 9.1 — Router</span><span class="lc-sub">The university-course view of routing in React</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Library</span><span class="v">Code you call for one job (React draws the UI); you keep control of the structure.</span></div>
  <div class="kv"><span class="k">Framework</span><span class="v">Code that calls you and sets the structure (Next.js owns routing, build, server).</span></div>
  <div class="kv"><span class="k">Reconciler</span><span class="v">React's engine that computes the minimal DOM update when data changes.</span></div>
  <div class="kv"><span class="k">App Router</span><span class="v">Next.js routing under <code>app/</code> with Server Components — the modern model.</span></div>
  <div class="kv"><span class="k">Pages Router</span><span class="v">The older Next.js system under <code>pages/</code> (<code>getServerSideProps</code>, <code>next/router</code>).</span></div>
  <div class="kv"><span class="k">Guillermo Rauch</span><span class="v">Founder of Vercel (then ZEIT) who released Next.js in October 2016.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>React (2013, Meta) is a library that turns data into UI; Next.js (2016, Vercel) is a framework around it.</li><li>React leaves routing, server rendering, data conventions, build and deploy to you — Next.js decides them.</li><li>Everything you learn about React still holds inside Next.js; the framework changes where and when it runs.</li><li>This course uses the App Router (<code>app/</code>), not the old Pages Router — check which one any tutorial assumes.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://github.com/facebook/react/releases" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">github.com/facebook/react — the source &amp; release history</span><span class="lc-sub">Every version since 2013. Reading the release notes is the truest history of the library.</span></span>
</a>
<a class="link-card dl" href="https://github.com/vercel/next.js/releases" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">github.com/vercel/next.js — the Next.js source &amp; releases</span><span class="lc-sub">See how the App Router landed and how the framework evolved release by release.</span></span>
</a>
</div>

<div class="ml-vi">
<div class="callout ok"><strong>Next.js là framework CHO React, không phải một thư viện tách biệt.</strong> React là thư viện vẽ giao diện (component, props, state, hook). Next.js là framework dựng trên nó, thêm định tuyến theo thư mục, Server Component, cache dữ liệu, SEO và deploy. Nên thứ tự học trên CuongThai là: khoá <a href="/courses/react">React</a> trước, rồi khoá này. Đã biết React thì Chương 1&ndash;7 là phần ôn, đọc lướt được.</div>
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>React là một THƯ VIỆN. Next.js là một FRAMEWORK.</h2>
<p class="lead">Người ta hay hỏi "React hay Next.js?" như thể chúng cạnh tranh nhau. Không hề. React là cỗ máy biến dữ liệu của bạn thành giao diện. Next.js là chiếc xe dựng quanh cỗ máy đó — nó bổ sung router, server, hệ thống build và câu chuyện triển khai mà React cố tình để trống.</p>

<h3>Một chút lịch sử: ai tạo ra chúng, và vì sao</h3>
<p><strong>React — Facebook, 2011 → mã nguồn mở 2013.</strong> Một kỹ sư Facebook tên <strong>Jordan Walke</strong> dựng phiên bản đầu tiên (một bản thử nghiệm nội bộ tên "FaxJS") để thuần hoá giao diện ngày càng phức tạp của Facebook — News Feed và các giao diện quảng cáo trở nên bất khả thi để giữ đồng bộ bằng tay. Facebook dùng nội bộ từ 2011, rồi <strong>mở mã nguồn React vào tháng 5/2013</strong>. Giới lập trình ban đầu hoài nghi: nhét markup giống HTML vào trong JavaScript trông thật sai. Bài talk làm đổi suy nghĩ — <strong>"React: Rethinking best practices" của Pete Hunt tại JSConf EU 2013</strong>, chính video đầu bài này — lập luận rằng tách "markup" khỏi "logic" là kiểu tách SAI, và một component (markup + logic đi cùng nhau) mới là đơn vị đúng. React ngày nay được <strong>Meta</strong> và một cộng đồng mã nguồn mở lớn duy trì.</p>
<p><strong>Next.js — Vercel, 2016.</strong> React giải quyết phần giao diện, nhưng mỗi nhóm lại tự phát minh lại cùng những thứ quanh nó: định tuyến, render trên server, đóng gói. <strong>Guillermo Rauch</strong> và công ty của ông (khi đó là ZEIT, nay là <strong>Vercel</strong>) ra mắt <strong>Next.js 1.0 ngày 25/10/2016</strong> (công ty có từ 2015; ngày này là bản <code>next</code> đầu tiên trong sổ đăng ký npm) để gói những quyết định đó vào một framework. Bước nhảy lớn của nó đến vào 2020–2023 với App Router và React Server Components — mô hình khoá này dạy.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">2011</span><span class="v">Jordan Walke dựng React bên trong Facebook.</span></div>
  <div class="kv"><span class="k">5/2013</span><span class="v">React mở mã nguồn; talk JSConf của Pete Hunt giới thiệu nó ra thế giới.</span></div>
  <div class="kv"><span class="k">10/2016</span><span class="v">Guillermo Rauch ra mắt Next.js tại ZEIT/Vercel.</span></div>
  <div class="kv"><span class="k">2022–23</span><span class="v">Next.js App Router + React Server Components — mô hình hiện đại.</span></div>
</div>

<h3>React cho bạn gì, và KHÔNG cho gì</h3>
<p>React trả lời đúng một câu hỏi: <em>với dữ liệu này, giao diện nên trông thế nào?</em> Bạn viết component; React render chúng, và render lại một cách hiệu quả khi dữ liệu đổi. Đó là toàn bộ nhiệm vụ của nó.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">React CÓ lo</span><span class="v">Component, JSX, state, hooks, bộ reconciler cập nhật DOM hiệu quả.</span></div>
  <div class="kv"><span class="k">React KHÔNG lo</span><span class="v">Định tuyến (URL nào hiện trang nào), render trên server, quy ước fetch dữ liệu, hệ thống build, hay cách bạn deploy.</span></div>
</div>
<p>Để một mình, React chạy hoàn toàn trong trình duyệt: server gửi một file HTML gần như rỗng, trình duyệt tải về một gói JavaScript, rồi trang mới hiện. Đó là <strong>ứng dụng một trang (SPA)</strong>. Chạy được, nhưng first paint chậm, và công cụ tìm kiếm nhìn thấy một trang trống.</p>

<h3>Next.js bổ sung gì</h3>
<p>Next.js là một <strong>framework</strong>: nó quyết sẵn những chỗ React để ngỏ, để cả nhóm khỏi phải phát minh lại trên mỗi dự án.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Định tuyến theo hệ thống file</b><br/>File tại <code>app/blog/page.tsx</code> trở thành route <code>/blog</code>. Không cần cấu hình router.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Render trên server mặc định</b><br/>Component chạy trên server và gửi HTML hoàn chỉnh — first paint nhanh, SEO thật.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Server Component</b><br/>Phần lớn UI không bao giờ xuống trình duyệt — ít JavaScript hơn, truy cập DB trực tiếp.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Dữ liệu &amp; mutate</b><br/>fetch có cache, Server Actions cho thao tác ghi, không cần tầng API riêng.</div></div>
  <div class="lz-step"><div class="lz-si">5</div><div class="lz-sb"><b>Build &amp; tối ưu</b><br/>Đóng gói, tách mã, tối ưu ảnh và font, bản build production.</div></div>
</div>
<p>Mọi thứ bạn học về React ở Giai đoạn 1–2 vẫn đúng bên trong Next.js — một component vẫn là một component. Next.js đổi <em>nơi</em> nó chạy và <em>khi nào</em>, chứ không đổi nó là gì. Vì thế khoá này dạy React trước, Next.js sau: bạn không thể hiểu "component này chạy trên server" khi chưa hiểu component là gì.</p>

<h3>App Router, không phải Pages Router</h3>
<p>Next.js có hai hệ định tuyến. Cái cũ nằm trong thư mục <code>pages/</code>; cái hiện hành — cái khoá này dạy, và cái cuongthai.com dùng — nằm trong <code>app/</code> và gọi là <strong>App Router</strong>. Nó mang theo React Server Components và một mô hình tư duy mới. Tutorial trước 2023 thường nói về hệ cũ; khi có gì trên mạng mâu thuẫn với khoá này, hãy kiểm xem nó đang giả định router nào trước đã.</p>

<div class="note-ct">
<p><strong>cuongthai.com được dựng thế nào</strong> — site này là một app Next.js App Router trong thư mục <code>frontend/</code>, nói chuyện với một API Node.js + Express riêng ở gốc dự án. Frontend render các trang (một số trên server, một số trong trình duyệt); backend nắm database, xác thực và lưu trữ file. Chương 8–20 về cơ bản là một chuyến tham quan có hướng dẫn xem thư mục <code>frontend/</code> thật sự hoạt động ra sao.</p>
</div>

<div class="pitfall"><p><strong>Bẫy — làm theo một bài hướng dẫn App Router mà thật ra viết cho Pages Router.</strong> Hai cái sống trong cùng một framework và dùng chung phần lớn từ vựng, nên khác biệt rất dễ bị bỏ sót: &#96;getServerSideProps&#96;, &#96;_app.tsx&#96;, &#96;next/router&#96; và một thư mục &#96;api/&#96; đều thuộc về Pages Router cũ, và chẳng cái nào làm gì trong &#96;app/&#96;. Trên Next.js 16.4.6 lệnh build ít ra còn chặn bạn lại — một export &#96;getServerSideProps&#96; trong trang thuộc &#96;app/&#96; làm build hỏng với <em>"getServerSideProps" is not supported in app/</em>, còn &#96;next/router&#96; hỏng với <em>NextRouter was not mounted</em> (cả hai đo ở dưới). Lời khuyên cũ nói export đó bị lờ đi trong im lặng; với bản này thì không. Cái giá thật là thời gian bạn mất khi chép cả một bài hướng dẫn viết cho router kia. Hãy kiểm ngày đăng và các dòng import trước khi tin một ví dụ: thứ gì dùng &#96;next/router&#96; thay vì &#96;next/navigation&#96; là có trước lần tách đó.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Liệt kê ba việc React làm và ba việc nó cố tình để ngỏ; đối chiếu với bài.</li>
<li>Tìm một tutorial Next.js bất kỳ trên mạng và trong 30 giây quyết định nó là App Router hay Pages Router — nhìn <code>next/navigation</code> (mới) so với <code>next/router</code> (cũ) và <code>getServerSideProps</code>.</li>
<li>Viết khác biệt một dòng giữa thư viện và framework bằng lời của bạn, rồi xếp React và Next.js về mỗi bên.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được React KHÔNG lo gì, và nhận ra một tutorial Pages Router qua các dòng import trong vài giây.</p></div>

<h3>🔬 Đo thật: thư viện bạn gọi, framework gọi bạn</h3>
<p><strong>React là các hàm bạn gọi</strong> — không framework nào, gọi thẳng từ Node:</p>
<pre><code class="language-bash">$ node -e "…React.createElement('h1', null, 'Xin chào') → renderToString…"</code></pre><div class="out">&lt;h1&gt;Xin chào&lt;/h1&gt;</div>
<p><strong>Next.js gọi bạn</strong> — đặt <code>src/app/blog/page.tsx</code> vào đúng chỗ, không cấu hình router nào, và bản build liệt kê route:</p>
<pre><code class="language-bash">$ npm run build 2&gt;&amp;1 | grep -A6 'Route (app)'</code></pre><div class="out">Route (app)
┌ ○ /
├ ○ /_not-found
└ ○ /blog


○  (Static)  prerendered as static content</div>
<p><strong>Cái bẫy, chạy trên Next.js 16.4.6.</strong> Một hàm <code>getServerSideProps</code> kiểu Pages Router chép vào <code>app/blog/page.tsx</code>:</p>
<pre><code class="language-bash">$ npm run build 2&gt;&amp;1 | tail -14</code></pre><div class="out">&gt; Build error occurred
Error: Turbopack build failed with 1 error:
./src/app/blog/page.tsx:1:23
Error: "getServerSideProps" is not supported in app/. Read more: https://nextjs.org/docs/app/building-your-application/data-fetching
&gt; 1 | export async function getServerSideProps() {
    |                       ^^^^^^^^^^^^^^^^^^
  2 |   return { props: { tieuDe: 'Từ getServerSideProps' } };
  3 | }
  4 |

Ecmascript file had an error


    at ignore-listed frames</div>
<p>Và <code>useRouter</code> lấy từ <code>next/router</code> trong một Client Component dưới <code>app/</code>:</p>
<pre><code class="language-typescript">'use client';
import { useRouter } from 'next/router';

export default function Blog() {
  const router = useRouter();
  return &lt;h1&gt;Đang ở: {router.pathname}&lt;/h1&gt;;
}</code></pre>
<pre><code class="language-bash">$ npm run build 2&gt;&amp;1 | tail -14</code></pre><div class="out">Error occurred prerendering page "/blog". Read more: https://nextjs.org/docs/messages/prerender-error
Error: NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted
    at &lt;unknown&gt; (src/app/blog/page.tsx:5:18)
  3 |
  4 | export default function Blog() {
&gt; 5 |   const router = useRouter();
    |                  ^
  6 |   return &lt;h1&gt;Đang ở: {router.pathname}&lt;/h1&gt;;
  7 | }
  8 | {
  digest: '230069296'
}
Export encountered an error on /blog/page: /blog, exiting the build.
⨯ Next.js build worker exited with code: 1 and signal: null</div>
<p>Cách sửa là <code>next/navigation</code> (Chương 8). Cả hai thông báo đều gọi tên vấn đề và dẫn tới tài liệu — hãy đọc trọn.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-1-router" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.1 — React Router căn bản</span><span class="lc-sub">Định tuyến mà React để trống — dựng bằng thư viện riêng</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-9-1-router" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · 9.1 — Router</span><span class="lc-sub">Góc nhìn môn học ở trường về định tuyến trong React</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Library (thư viện)</span><span class="v">Mã bạn gọi để làm một việc (React vẽ UI); bạn giữ quyền về cấu trúc.</span></div>
  <div class="kv"><span class="k">Framework</span><span class="v">Mã gọi ngược lại bạn và định sẵn cấu trúc (Next.js nắm định tuyến, build, server).</span></div>
  <div class="kv"><span class="k">Reconciler</span><span class="v">Cỗ máy của React tính ra bản cập nhật DOM tối thiểu khi dữ liệu đổi.</span></div>
  <div class="kv"><span class="k">App Router</span><span class="v">Định tuyến Next.js dưới <code>app/</code> kèm Server Components — mô hình hiện đại.</span></div>
  <div class="kv"><span class="k">Pages Router</span><span class="v">Hệ Next.js cũ dưới <code>pages/</code> (<code>getServerSideProps</code>, <code>next/router</code>).</span></div>
  <div class="kv"><span class="k">Guillermo Rauch</span><span class="v">Người sáng lập Vercel (khi đó ZEIT), ra mắt Next.js tháng 10/2016.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>React (2013, Meta) là thư viện biến dữ liệu thành UI; Next.js (2016, Vercel) là framework bọc quanh nó.</li><li>React để ngỏ định tuyến, render server, quy ước dữ liệu, build và deploy cho bạn — Next.js quyết thay.</li><li>Mọi thứ bạn học về React vẫn đúng trong Next.js; framework chỉ đổi nơi và thời điểm nó chạy.</li><li>Khoá này dùng App Router (<code>app/</code>), không phải Pages Router cũ — luôn kiểm tutorial giả định cái nào.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://github.com/facebook/react/releases" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">github.com/facebook/react — mã nguồn &amp; lịch sử phát hành</span><span class="lc-sub">Mọi phiên bản từ 2013. Đọc release notes là cách xem lịch sử thật nhất của thư viện.</span></span>
</a>
<a class="link-card dl" href="https://github.com/vercel/next.js/releases" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">github.com/vercel/next.js — mã nguồn &amp; phát hành Next.js</span><span class="lc-sub">Xem App Router ra đời thế nào và framework tiến hoá qua từng bản phát hành.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — Setting up & the dev loop|||0.3 — Cài đặt & vòng lặp phát triển',
      slug: 'nextjs-0-3-cai-dat',
      type: 'VIDEO',
      isFreePreview: true,
      // Video: "Next.js in 100 Seconds" (Fireship) — xem một app Next dựng ra sao.
      video: { url: 'https://youtu.be/Sklc_fQBmcs', durationSeconds: 0 },
      description: 'Cài Node 22, tạo app bằng create-next-app, hiểu ba lệnh dev/build/start và cây thư mục.',
      content: `
${G00_3}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Set up once, then get out of the terminal</h2>
<p class="lead">You need three things: a recent Node.js, a package manager (npm ships with Node), and one command to scaffold the project. After that, almost everything happens in <code>npm run dev</code> and your editor.</p>

<h3>1 · Node.js 22 LTS</h3>
<p>Next.js runs on Node. Install the <strong>LTS</strong> (long-term support) version — 22.x at the time of writing. Check it:</p>
<pre><code class="language-bash">node --version
<span class="out">v22.23.3</span></code></pre>
<p>If you juggle projects on different Node versions, use <code>nvm</code> (Node Version Manager) and put the version in a <code>.nvmrc</code> file. This site pins Node 22 that way.</p>

<h3>2 · Create the app</h3>
<p>One command scaffolds a complete App Router project with TypeScript, Tailwind and ESLint wired up:</p>
<pre><code class="language-bash">npx create-next-app@latest my-app</code></pre>
<p>With <code>@latest</code> = 16.4.6 (13 Nov 2026) it first asks whether to use the <em>recommended defaults</em> — those put code outside <code>src/</code> and turn <b>Cache Components on</b>, which changes how caching works (this course teaches the classic model first, Chapter 10). Choose <b>No, customize settings</b> and answer: <b>TypeScript Yes</b>, linter <b>ESLint</b>, <b>React Compiler No</b>, <b>Tailwind Yes</b>, <b>src/ Yes</b> (like cuongthai.com), <b>App Router Yes</b>, <b>Cache Components No</b>, import alias default, AGENTS.md as you like. The full real transcript is in “Measured” below. Then:</p>
<pre><code class="language-bash">cd my-app
npm run dev
<span class="out">▲ Next.js 16.4.6 (Turbopack)
- Local:         http://localhost:3000
✓ Ready in 332ms</span></code></pre>
<p>Open <code>http://localhost:3000</code>. Edit <code>src/app/page.tsx</code>, save, and the browser updates without a reload — that is <strong>Fast Refresh</strong>, and it keeps your component state across edits. This is where you will live.</p>

<h3>3 · The three commands you must not confuse</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">npm run dev</span><span class="v">Development server. Fast Refresh, detailed errors, source maps. NEVER what users hit — it is slow and unminified.</span></div>
  <div class="kv"><span class="k">npm run build</span><span class="v">Produces the optimised production output: minified bundles, static pages pre-rendered, the <code>.next/</code> folder. Run this before every deploy.</span></div>
  <div class="kv"><span class="k">npm run start</span><span class="v">Serves what <code>build</code> produced. This is production. If it breaks here but works in dev, the build is the source of truth — trust it.</span></div>
</div>
<div class="callout warn">
<p><strong>Dev lies, sometimes helpfully, sometimes not.</strong> Code that works under <code>npm run dev</code> can fail under <code>build</code> (a type error dev tolerated, a Server/Client boundary dev was lenient about) and vice-versa. Whenever behaviour surprises you near a deploy, reproduce it with <code>npm run build &amp;&amp; npm run start</code>, not dev.</p>
</div>

<h3>4 · The folder that matters: <code>app/</code></h3>
<pre><code>my-app/
  src/
    app/
      layout.tsx      <span class="tok-comment">// wraps every page (html, body, providers)</span>
      page.tsx        <span class="tok-comment">// the route "/"</span>
      globals.css     <span class="tok-comment">// global styles + Tailwind directives</span>
      about/
        page.tsx      <span class="tok-comment">// the route "/about"</span>
  public/             <span class="tok-comment">// static files served as-is (images, fonts)</span>
  next.config.ts      <span class="tok-comment">// framework config (TypeScript since Next.js 15)</span>
  package.json
  tsconfig.json</code></pre>
<p>The rule you will use a hundred times: <strong>a folder under <code>app/</code> is a URL segment, and a <code>page.tsx</code> inside it is the page shown at that URL.</strong> We unpack this fully in Chapter 8.</p>

<h3>Checking the toolchain before writing any code</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Node version first</b> — Next.js has a minimum, and being below it produces syntax errors in library code that look like your mistake. &#96;node --version&#96; before anything else.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Create the app, then read what it made</b> — &#96;npx create-next-app@latest&#96;. Open &#96;app/layout.tsx&#96; and &#96;app/page.tsx&#96; — those two files are the whole starting point.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Run the dev server and change one word</b> — If the browser updates without a reload, hot reloading works and the toolchain is sound.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Then run a production build once</b> — &#96;next build&#96;. It type-checks the whole project and prints the route table, so you know both work before you have any code to debug.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a project created inside a folder whose path contains a space or a non-ASCII character.</strong> Measured on Next.js 16.4.6: &#96;next build&#96; itself works fine inside &#96;Tài liệu/my app/&#96;. What breaks is everything around it that forgets quotes — a shell script doing &#96;cd $DIR&#96; split the path at the space and failed with &#96;cd: ~/lab/Tài: No such file or directory&#96; (output below); Docker mounts, CI steps and older tools fail in the same way, each naming something else, so the real cause is hard to guess. Keep project paths plain ASCII with no spaces — this is a five-second decision at creation time that removes a category of unexplainable problems later.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Run <code>node --version</code> and confirm it is 22.x; if not, install the LTS build (or switch with <code>nvm</code>).</li>
<li>Scaffold a project with <code>npx create-next-app@latest my-app</code> (TypeScript, ESLint, Tailwind, App Router, src/), then open <code>src/app/layout.tsx</code> and <code>src/app/page.tsx</code>.</li>
<li>Run <code>npm run dev</code>, change one word in <code>page.tsx</code> and watch Fast Refresh update without a reload; then add a folder <code>app/about/page.tsx</code> and visit <code>/about</code>.</li>
<li>Run <code>npm run build</code> once and read the printed route table; note it type-checks the whole project.</li>
</ol>
<p><strong>Done when:</strong> you scaffolded an app, saw Fast Refresh, added an <code>/about</code> route, and produced a clean production build.</p></div>

<h3>🔬 Measured: the whole loop on Next.js 16.4.6</h3>
<p>Run on a Mac with Node 22.23.3 / npm 10.9.9. The interactive <code>create-next-app</code> session, answered as this course recommends (each ✔ line shows the option that was chosen):</p>
<pre><code class="language-bash">$ npx create-next-app@latest my-app</code></pre><div class="out">✔ Would you like to use the recommended Next.js defaults? › No, customize settings
✔ Would you like to use TypeScript? … Yes
✔ Which linter would you like to use? › ESLint
✔ Would you like to use React Compiler? … No
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a &#96;src/&#96; directory? … Yes
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to use Cache Components? … No
✔ Would you like to customize the import alias (&#96;@/*&#96; by default)? … No
✔ Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? … No
✔ Would you like to help improve Next.js by letting agents prepare anonymized feedback for your review as you code? (Disable anytime with &#96;experimental.agentFeedback: false&#96;.) … No
Creating a new Next.js app in ~/my-app.
Using npm.
Initializing project with template: app-tw
Installing dependencies:
- next
- react
- react-dom
Installing devDependencies:
- @tailwindcss/turbopack
- @types/node
- @types/react
- @types/react-dom
- eslint
- eslint-config-next
- tailwindcss
- typescript
npm warn deprecated eslint@9.39.5: This version is no longer supported. Please see https://eslint.org/version-support for other options.
added 360 packages, and audited 361 packages in 19s
8 moderate severity vulnerabilities
To address all issues (including breaking changes), run:
Generating route types...
✓ Types generated successfully
Initialized a git repository.
Success! Created my-app at ~/my-app</div>
<p><code>npm run dev</code> — note the last line: Next.js 16.4 <strong>generated an AGENTS.md</strong> for AI coding agents on the first dev run, even though we answered No (turn it off with <code>agentRules: false</code> in <code>next.config.ts</code>):</p>
<pre><code class="language-bash">$ npm run dev</code></pre><div class="out">$ npm run dev -- -p 19306
▲ Next.js 16.4.6 (Turbopack)
- Local:         http://127.0.0.1:19306
- Network:       http://127.0.0.1:19306
✓ Ready in 332ms
✓ Running next.config.ts took 1251ms
✓ Generated AGENTS.md for AI agents. Set &#96;agentRules: false&#96; in next.config to disable.
 GET / 200 in 219ms (next.js: 125ms, application-code: 94ms)</div>
<p><strong>Fast Refresh, in a real browser (Chromium via Playwright):</strong> the counter was clicked 3 times, then the heading in <code>page.tsx</code> was edited and saved — the new heading appeared without a reload and the counter still read <strong>3</strong>.</p>
<p>Adding <code>src/app/about/page.tsx</code> made <code>/about</code> answer 200 with no router config. Then the production build:</p>
<pre><code class="language-bash">$ npm run build</code></pre><div class="out">
&gt; my-app@0.1.0 build
&gt; next build

▲ Next.js 16.4.6 (Turbopack)
✓ Running next.config.ts took 20ms

  Creating an optimized production build ...
✓ Compiled successfully in 2.4s
  Running TypeScript ...
  Finished TypeScript in 1083ms ...
  Collecting page data using 6 workers ...
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
└ ○ /about


○  (Static)  prerendered as static content</div>
<p>And the path trap, measured — Next.js builds fine in a path with a space and Vietnamese letters; the unquoted shell variable is what breaks:</p>
<pre><code class="language-bash">$ cd "Tài liệu/my app" &amp;&amp; npm run build 2&gt;&amp;1 | tail -7</code></pre><div class="out">Route (app)
┌ ○ /
└ ○ /_not-found


○  (Static)  prerendered as static content</div><pre><code class="language-bash">$ DIR="$HOME/lab/Tài liệu/my app"; cd $DIR  <span class="tok-comment">  # quên dấu nháy</span></code></pre><div class="out">bash: line 0: cd: ~/lab/Tài: No such file or directory</div><pre><code class="language-bash">$ cd "$DIR" &amp;&amp; pwd  <span class="tok-comment">  # có dấu nháy</span></code></pre><div class="out">~/lab/Tài liệu/my app</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">node --version                     <span class="tok-comment">  # v22.x</span>
npx create-next-app@latest my-app  <span class="tok-comment">  # No, customize · src/ Yes · Cache Components No</span>
cd my-app &amp;&amp; npm run dev           <span class="tok-comment">  # edit src/app/page.tsx, save, watch the browser</span>
mkdir src/app/about                <span class="tok-comment">  # then create src/app/about/page.tsx</span>
npm run build &amp;&amp; npm run start     <span class="tok-comment">  # read the route table</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/linux-bash/learn?lessonSlug=lnx-6-2-dau-nhay" target="_blank" rel="noopener"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Linux & Bash · 6.2 — Quoting</span><span class="lc-sub">The one rule that stops scripts from breaking — exactly the path trap above</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-0-1-cai-dat" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 0.1 — Setup with Vite and TypeScript</span><span class="lc-sub">A React-only project, to compare with create-next-app</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Node.js LTS</span><span class="v">The long-term-support runtime (22.x here) that Next.js runs on.</span></div>
  <div class="kv"><span class="k">create-next-app</span><span class="v">The official scaffolder that wires TypeScript, Tailwind and the App Router.</span></div>
  <div class="kv"><span class="k">Fast Refresh</span><span class="v">Dev feature that updates the browser on save while keeping component state.</span></div>
  <div class="kv"><span class="k">npm run dev</span><span class="v">The development server — fast, verbose, NOT what users should ever hit.</span></div>
  <div class="kv"><span class="k">npm run build / start</span><span class="v"><code>build</code> produces the optimised output; <code>start</code> serves it — this is production.</span></div>
  <div class="kv"><span class="k">app/ routing</span><span class="v">A folder under <code>app/</code> is a URL segment; its <code>page.tsx</code> is the page shown there.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Install Node 22 LTS, then scaffold with <code>create-next-app@latest</code> — TypeScript, Tailwind and the App Router in one command.</li><li>Three commands you must not confuse: <code>dev</code> (develop), <code>build</code> (make production output), <code>start</code> (serve it).</li><li>When behaviour surprises you near a deploy, trust <code>build</code> + <code>start</code>, not <code>dev</code>.</li><li>The rule you reuse forever: a folder under <code>app/</code> is a URL segment, and its <code>page.tsx</code> is that route.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nodejs.org/en/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">nodejs.org — download Node.js 22 LTS</span><span class="lc-sub">The official installer for macOS, Windows and Linux. Pick the LTS build.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/cli/create-next-app" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">create-next-app — the official scaffolding docs</span><span class="lc-sub">Every question the setup wizard asks, explained, and all the flags.</span></span>
</a>
<a class="link-card dl" href="https://code.visualstudio.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">VS Code — the editor most React devs use</span><span class="lc-sub">Free. Add the "ES7+ React" and "Tailwind CSS IntelliSense" extensions and you're set.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Cài một lần, rồi thoát khỏi terminal</h2>
<p class="lead">Bạn cần ba thứ: một bản Node.js gần đây, một trình quản lý gói (npm đi kèm Node), và một lệnh để dựng khung dự án. Sau đó, gần như mọi thứ diễn ra trong <code>npm run dev</code> và trình soạn thảo của bạn.</p>

<h3>1 · Node.js 22 LTS</h3>
<p>Next.js chạy trên Node. Cài bản <strong>LTS</strong> (hỗ trợ dài hạn) — 22.x ở thời điểm viết. Kiểm tra:</p>
<pre><code class="language-bash">node --version
<span class="out">v22.23.3</span></code></pre>
<p>Nếu bạn xoay nhiều dự án ở các bản Node khác nhau, dùng <code>nvm</code> (Node Version Manager) và ghi bản cần dùng vào file <code>.nvmrc</code>. Site này ghim Node 22 theo cách đó.</p>

<h3>2 · Tạo app</h3>
<p>Một lệnh dựng nguyên một dự án App Router hoàn chỉnh có sẵn TypeScript, Tailwind và ESLint:</p>
<pre><code class="language-bash">npx create-next-app@latest my-app</code></pre>
<p>Với <code>@latest</code> = 16.4.6 (13/11/2026) câu đầu tiên hỏi có dùng <em>cấu hình khuyên dùng</em> không — cấu hình đó để mã ngoài <code>src/</code> và <b>bật Cache Components</b>, làm đổi cách cache hoạt động (khoá này dạy mô hình cổ điển trước, Chương 10). Chọn <b>No, customize settings</b> rồi trả lời: <b>TypeScript Yes</b>, linter <b>ESLint</b>, <b>React Compiler No</b>, <b>Tailwind Yes</b>, <b>src/ Yes</b> (giống cuongthai.com), <b>App Router Yes</b>, <b>Cache Components No</b>, bí danh import mặc định, AGENTS.md tuỳ bạn. Transcript thật đầy đủ nằm ở mục “Đo thật” bên dưới. Rồi:</p>
<pre><code class="language-bash">cd my-app
npm run dev
<span class="out">▲ Next.js 16.4.6 (Turbopack)
- Local:         http://localhost:3000
✓ Ready in 332ms</span></code></pre>
<p>Mở <code>http://localhost:3000</code>. Sửa <code>src/app/page.tsx</code>, lưu, và trình duyệt cập nhật mà không tải lại — đó là <strong>Fast Refresh</strong>, nó giữ nguyên state component qua các lần sửa. Đây là nơi bạn sẽ sống.</p>

<h3>3 · Ba lệnh không được lẫn lộn</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">npm run dev</span><span class="v">Server phát triển. Fast Refresh, lỗi chi tiết, source map. KHÔNG BAO GIỜ là cái người dùng chạm tới — nó chậm và không nén.</span></div>
  <div class="kv"><span class="k">npm run build</span><span class="v">Tạo bản production đã tối ưu: bundle nén nhỏ, trang tĩnh render sẵn, thư mục <code>.next/</code>. Chạy lệnh này trước mỗi lần deploy.</span></div>
  <div class="kv"><span class="k">npm run start</span><span class="v">Phục vụ cái mà <code>build</code> tạo ra. Đây là production. Nếu chỗ này hỏng mà dev thì chạy, bản build mới là nguồn sự thật — tin nó.</span></div>
</div>
<div class="callout warn">
<p><strong>Dev nói dối, có lúc có ích, có lúc không.</strong> Mã chạy được dưới <code>npm run dev</code> có thể hỏng dưới <code>build</code> (một lỗi kiểu mà dev bỏ qua, một ranh giới Server/Client mà dev dễ tính) và ngược lại. Mỗi khi hành vi khiến bạn bất ngờ gần lúc deploy, hãy tái hiện bằng <code>npm run build &amp;&amp; npm run start</code>, đừng dùng dev.</p>
</div>

<h3>4 · Thư mục quan trọng: <code>app/</code></h3>
<pre><code>my-app/
  src/
    app/
      layout.tsx      <span class="tok-comment">// bọc mọi trang (html, body, provider)</span>
      page.tsx        <span class="tok-comment">// route "/"</span>
      globals.css     <span class="tok-comment">// style toàn cục + chỉ thị Tailwind</span>
      about/
        page.tsx      <span class="tok-comment">// route "/about"</span>
  public/             <span class="tok-comment">// file tĩnh phục vụ nguyên trạng (ảnh, font)</span>
  next.config.ts      <span class="tok-comment">// cấu hình framework (dạng TypeScript từ Next.js 15)</span>
  package.json
  tsconfig.json</code></pre>
<p>Quy tắc bạn sẽ dùng cả trăm lần: <strong>một thư mục dưới <code>app/</code> là một đoạn URL, và một <code>page.tsx</code> bên trong nó là trang hiện ở URL đó.</strong> Chương 8 sẽ mổ xẻ trọn vẹn điều này.</p>

<h3>Kiểm bộ công cụ trước khi viết dòng mã nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Phiên bản Node trước tiên</b> — Next.js có một mức tối thiểu, và ở dưới mức đó sẽ sinh ra lỗi cú pháp trong mã của thư viện, trông y như bạn làm sai. Hãy &#96;node --version&#96; trước mọi thứ.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Tạo ứng dụng, rồi đọc thứ nó vừa tạo</b> — &#96;npx create-next-app@latest&#96;. Hãy mở &#96;app/layout.tsx&#96; và &#96;app/page.tsx&#96; — hai file đó chính là toàn bộ điểm khởi đầu.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Chạy dev server rồi đổi một chữ</b> — Nếu trình duyệt cập nhật mà không cần tải lại thì nạp nóng chạy tốt và bộ công cụ lành lặn.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Rồi chạy một bản build production một lần</b> — &#96;next build&#96;. Nó kiểm kiểu cả dự án và in ra bảng route, nên bạn biết cả hai đều chạy được từ khi chưa có mã nào để gỡ lỗi.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một dự án tạo trong một thư mục có đường dẫn chứa dấu cách hoặc ký tự ngoài ASCII.</strong> Đo trên Next.js 16.4.6: bản thân &#96;next build&#96; chạy tốt trong &#96;Tài liệu/my app/&#96;. Cái hỏng là mọi thứ xung quanh mà quên dấu nháy — một script shell làm &#96;cd $DIR&#96; tách đường dẫn ở dấu cách và hỏng với &#96;cd: ~/lab/Tài: No such file or directory&#96; (output bên dưới); mount Docker, bước CI và công cụ cũ hỏng theo cùng kiểu, mỗi lỗi gọi tên một thứ khác, nên nguyên nhân thật rất khó đoán. Hãy giữ đường dẫn dự án thuần ASCII và không có dấu cách — đây là một quyết định năm giây lúc tạo dự án, và nó gỡ bỏ cả một họ vấn đề không giải thích nổi về sau.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>node --version</code> và xác nhận là 22.x; nếu chưa thì cài bản LTS (hoặc chuyển bằng <code>nvm</code>).</li>
<li>Dựng dự án bằng <code>npx create-next-app@latest my-app</code> (TypeScript, ESLint, Tailwind, App Router, src/), rồi mở <code>src/app/layout.tsx</code> và <code>src/app/page.tsx</code>.</li>
<li>Chạy <code>npm run dev</code>, đổi một chữ trong <code>page.tsx</code> và xem Fast Refresh cập nhật mà không tải lại; rồi thêm thư mục <code>app/about/page.tsx</code> và vào <code>/about</code>.</li>
<li>Chạy <code>npm run build</code> một lần và đọc bảng route in ra; để ý nó kiểm kiểu cả dự án.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã dựng app, thấy Fast Refresh, thêm route <code>/about</code>, và tạo một bản build production sạch.</p></div>

<h3>🔬 Đo thật: trọn vòng lặp trên Next.js 16.4.6</h3>
<p>Chạy trên Mac với Node 22.23.3 / npm 10.9.9. Phiên <code>create-next-app</code> tương tác, trả lời theo khuyến nghị của khoá (mỗi dòng ✔ ghi lựa chọn đã chọn):</p>
<pre><code class="language-bash">$ npx create-next-app@latest my-app</code></pre><div class="out">✔ Would you like to use the recommended Next.js defaults? › No, customize settings
✔ Would you like to use TypeScript? … Yes
✔ Which linter would you like to use? › ESLint
✔ Would you like to use React Compiler? … No
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a &#96;src/&#96; directory? … Yes
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to use Cache Components? … No
✔ Would you like to customize the import alias (&#96;@/*&#96; by default)? … No
✔ Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? … No
✔ Would you like to help improve Next.js by letting agents prepare anonymized feedback for your review as you code? (Disable anytime with &#96;experimental.agentFeedback: false&#96;.) … No
Creating a new Next.js app in ~/my-app.
Using npm.
Initializing project with template: app-tw
Installing dependencies:
- next
- react
- react-dom
Installing devDependencies:
- @tailwindcss/turbopack
- @types/node
- @types/react
- @types/react-dom
- eslint
- eslint-config-next
- tailwindcss
- typescript
npm warn deprecated eslint@9.39.5: This version is no longer supported. Please see https://eslint.org/version-support for other options.
added 360 packages, and audited 361 packages in 19s
8 moderate severity vulnerabilities
To address all issues (including breaking changes), run:
Generating route types...
✓ Types generated successfully
Initialized a git repository.
Success! Created my-app at ~/my-app</div>
<p><code>npm run dev</code> — để ý dòng cuối: Next.js 16.4 <strong>tự sinh AGENTS.md</strong> cho trợ lý AI ở lần chạy dev đầu, dù lúc cài ta đã chọn No (tắt bằng <code>agentRules: false</code> trong <code>next.config.ts</code>):</p>
<pre><code class="language-bash">$ npm run dev</code></pre><div class="out">$ npm run dev -- -p 19306
▲ Next.js 16.4.6 (Turbopack)
- Local:         http://127.0.0.1:19306
- Network:       http://127.0.0.1:19306
✓ Ready in 332ms
✓ Running next.config.ts took 1251ms
✓ Generated AGENTS.md for AI agents. Set &#96;agentRules: false&#96; in next.config to disable.
 GET / 200 in 219ms (next.js: 125ms, application-code: 94ms)</div>
<p><strong>Fast Refresh, trong trình duyệt thật (Chromium qua Playwright):</strong> bấm nút đếm 3 lần, rồi sửa tiêu đề trong <code>page.tsx</code> và lưu — tiêu đề mới hiện ra không cần tải lại, và nút vẫn ghi <strong>3</strong>.</p>
<p>Thêm <code>src/app/about/page.tsx</code> là <code>/about</code> trả 200, không cấu hình router nào. Rồi bản build production:</p>
<pre><code class="language-bash">$ npm run build</code></pre><div class="out">
&gt; my-app@0.1.0 build
&gt; next build

▲ Next.js 16.4.6 (Turbopack)
✓ Running next.config.ts took 20ms

  Creating an optimized production build ...
✓ Compiled successfully in 2.4s
  Running TypeScript ...
  Finished TypeScript in 1083ms ...
  Collecting page data using 6 workers ...
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
└ ○ /about


○  (Static)  prerendered as static content</div>
<p>Và cái bẫy đường dẫn, đo thật — Next.js build tốt trong đường dẫn có dấu cách và chữ có dấu; biến shell không có dấu nháy mới là thứ hỏng:</p>
<pre><code class="language-bash">$ cd "Tài liệu/my app" &amp;&amp; npm run build 2&gt;&amp;1 | tail -7</code></pre><div class="out">Route (app)
┌ ○ /
└ ○ /_not-found


○  (Static)  prerendered as static content</div><pre><code class="language-bash">$ DIR="$HOME/lab/Tài liệu/my app"; cd $DIR  <span class="tok-comment">  # quên dấu nháy</span></code></pre><div class="out">bash: line 0: cd: ~/lab/Tài: No such file or directory</div><pre><code class="language-bash">$ cd "$DIR" &amp;&amp; pwd  <span class="tok-comment">  # có dấu nháy</span></code></pre><div class="out">~/lab/Tài liệu/my app</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">node --version                     <span class="tok-comment">  # v22.x</span>
npx create-next-app@latest my-app  <span class="tok-comment">  # No, customize · src/ Yes · Cache Components No</span>
cd my-app &amp;&amp; npm run dev           <span class="tok-comment">  # sửa src/app/page.tsx, lưu, nhìn trình duyệt</span>
mkdir src/app/about                <span class="tok-comment">  # rồi tạo src/app/about/page.tsx</span>
npm run build &amp;&amp; npm run start     <span class="tok-comment">  # đọc bảng route</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/linux-bash/learn?lessonSlug=lnx-6-2-dau-nhay" target="_blank" rel="noopener"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Linux & Bash · 6.2 — Dấu nháy</span><span class="lc-sub">Luật duy nhất làm script thôi vỡ — đúng cái bẫy đường dẫn ở trên</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-0-1-cai-dat" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 0.1 — Cài đặt với Vite và TypeScript</span><span class="lc-sub">Dựng một dự án React một mình, để so với create-next-app</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Node.js LTS</span><span class="v">Môi trường chạy hỗ trợ dài hạn (22.x ở đây) mà Next.js chạy trên đó.</span></div>
  <div class="kv"><span class="k">create-next-app</span><span class="v">Trình dựng khung chính thức, cắm sẵn TypeScript, Tailwind và App Router.</span></div>
  <div class="kv"><span class="k">Fast Refresh</span><span class="v">Tính năng dev cập nhật trình duyệt khi lưu mà vẫn giữ state component.</span></div>
  <div class="kv"><span class="k">npm run dev</span><span class="v">Server phát triển — nhanh, nhiều thông tin, KHÔNG BAO GIỜ là cái người dùng chạm.</span></div>
  <div class="kv"><span class="k">npm run build / start</span><span class="v"><code>build</code> tạo bản tối ưu; <code>start</code> phục vụ nó — đây là production.</span></div>
  <div class="kv"><span class="k">Định tuyến app/</span><span class="v">Một thư mục dưới <code>app/</code> là một đoạn URL; <code>page.tsx</code> của nó là trang hiện ở đó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Cài Node 22 LTS, rồi dựng bằng <code>create-next-app@latest</code> — TypeScript, Tailwind và App Router trong một lệnh.</li><li>Ba lệnh không được lẫn: <code>dev</code> (phát triển), <code>build</code> (tạo bản production), <code>start</code> (phục vụ bản đó).</li><li>Khi hành vi khiến bạn bất ngờ gần lúc deploy, hãy tin <code>build</code> + <code>start</code>, không phải <code>dev</code>.</li><li>Quy tắc dùng mãi: một thư mục dưới <code>app/</code> là một đoạn URL, và <code>page.tsx</code> của nó là route đó.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nodejs.org/en/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">nodejs.org — tải Node.js 22 LTS</span><span class="lc-sub">Bộ cài chính thức cho macOS, Windows và Linux. Chọn bản LTS.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/cli/create-next-app" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">create-next-app — tài liệu dựng khung chính thức</span><span class="lc-sub">Mọi câu hỏi trình cài đặt hỏi, giải thích rõ, và tất cả các cờ.</span></span>
</a>
<a class="link-card dl" href="https://code.visualstudio.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">VS Code — trình soạn thảo hầu hết React dev dùng</span><span class="lc-sub">Miễn phí. Thêm extension "ES7+ React" và "Tailwind CSS IntelliSense" là xong.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — How to study this course|||0.4 — Cách học khoá này',
      slug: 'nextjs-0-4-cach-hoc',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Học chủ động: gõ lại code, đọc lỗi, dùng Phòng thi và Code Lab, và một cảnh báo về việc hỏi AI.',
      content: `
${G00_4}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>How to get the most out of this</h2>
<p class="lead">This is a course you build alongside, not one you watch. Every chapter has runnable code. If you only read it, you will feel like you understand and discover at the keyboard that you don't. Type it. Break it. Read the error.</p>

<h3>The loop that works</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Read the lesson once</b>, for the shape of the idea — don't memorise.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Type the code yourself</b> into your dev app. Not copy-paste — typing forces you to read every token.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Change one thing</b> and predict what happens before you save. Being wrong is the lesson.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Read the whole error message.</b> React and Next errors are unusually good — they usually tell you the fix.</div></div>
  <div class="lz-step"><div class="lz-si">5</div><div class="lz-sb"><b>Do the Code Lab exercise</b> for that chapter to make it stick.</div></div>
</div>

<h3>What each icon in the course means</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">.lead / examples</span><span class="v">The core idea and code with real output shown in an <code>out</code> block. Read the output — it's the point.</span></div>
  <div class="kv"><span class="k">Pitfall</span><span class="v">A mistake that is easy to make and hard to debug. These are worth more than the happy path.</span></div>
  <div class="kv"><span class="k">"How cuongthai.com does it"</span><span class="v">The same idea, seen in a production codebase — including the bugs it caused here.</span></div>
  <div class="kv"><span class="k">Quiz &amp; Exam Room</span><span class="v">Each chapter ends with a quiz; the course has Progress Tests, Final Exams and practical exams in the Exam Room.</span></div>
</div>

<h3>Use the Exam Room and Code Lab</h3>
<p>Reading proves nothing. This course ships with a full assessment set in the <strong>Exam Room</strong>: <b>3 Progress Tests</b> (after chapters 4, 12 and 20), <b>5 Final Exams</b> (50 questions each, the whole course), and <b>10 Practical Exams</b> where you build something and it is graded. The <strong>Code Lab</strong> has hands-on exercises with solutions. Do them; the questions are written to catch the exact misunderstandings this course is trying to fix.</p>

<div class="pitfall">
<p><strong>A word about asking an AI to write your React.</strong> An AI will happily produce a component that renders correctly and is quietly wrong — an effect with a missing dependency, an index used as a key, a <code>'use client'</code> at the top of a file that pulls half the app into the browser. It compiles, it runs, the bug ships. The whole point of this course is to give you the judgement the AI doesn't have. Use it to go faster on things you already understand; do not use it to skip understanding. Chapter 5 alone will show you three AI-favourite effects that are bugs.</p>
</div>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Take one code snippet from Chapter 1, type it (do not paste) into your dev app, change one line, and predict the result before saving.</li>
<li>Deliberately break something (remove a <code>key</code>, misspell a prop) and read the full error message — write down the one line that names the fix.</li>
<li>Open the Exam Room and the Code Lab for this course and bookmark where the Chapter 1 exercise lives.</li>
</ol>
<p><strong>Done when:</strong> you have typed and broken real code, read an error end to end, and know where the exercises are.</p></div>

<h3>🔬 Break it on purpose — three real errors (Next.js 16.4.6)</h3>
<p>The practice task, done for real in a fresh <code>my-app</code>. The page renders a list without keys, and a second page reads a value that can be <code>undefined</code>:</p>
<pre><code class="language-typescript">const MON = ['Bàn phím cơ', 'Chuột không dây', 'Lót chuột'];

function The({ tieuDe }: { tieuDe: string }) {
  return &lt;h2 className="text-xl font-bold"&gt;{tieuDe}&lt;/h2&gt;;
}

export default function Home() {
  return (
    &lt;main className="p-10 font-sans"&gt;
      &lt;The tieuDe="Giỏ hàng" /&gt;
      &lt;ul className="list-disc pl-6"&gt;
        {MON.map((m) =&gt; &lt;li&gt;{m}&lt;/li&gt;)}
      &lt;/ul&gt;
    &lt;/main&gt;
  );
}</code></pre>
<pre><code class="language-typescript">export default function Loi() {
  const ten = ['An', 'Bình'].find((x) =&gt; x === 'Cường');
  return &lt;h1&gt;Xin chào {ten!.toUpperCase()}&lt;/h1&gt;;
}</code></pre>
<p><strong>1 · Missing key.</strong> The page still renders fine — the warning only shows in the dev terminal and the browser console (and as a red "1 Issue" badge):</p>
<pre><code class="language-bash">$ npm run dev</code></pre><div class="out">✓ Ready in 674ms
Each child in a list should have a unique "key" prop.
Check the top-level render call using &lt;li&gt;. See https://react.dev/link/warning-keys for more information.
 GET / 200 in 244ms (next.js: 132ms, application-code: 112ms)</div>
<p><strong>2 · Runtime error.</strong> Opening <code>/loi</code> shows the dev error overlay. Read it top to bottom: the type (<em>Runtime TypeError</em>, on the <em>Server</em>), the message (<em>Cannot read properties of undefined (reading 'toUpperCase')</em>), the place (<code>src/app/loi/page.tsx (3:29)</code>), and the exact line with a caret. The fix follows: <code>find</code> can return <code>undefined</code>.</p>
<p><strong>3 · A typo in a prop name</strong> (<code>tieude</code> instead of <code>tieuDe</code>) — TypeScript catches it before the browser, and the last words name the fix:</p>
<pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/app/page.tsx(10,12): error TS2322: Type '{ tieude: string; }' is not assignable to type 'IntrinsicAttributes &amp; { tieuDe: string; }'.
  Property 'tieude' does not exist on type 'IntrinsicAttributes &amp; { tieuDe: string; }'. Did you mean 'tieuDe'?</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm run dev              <span class="tok-comment">  # remove a key in a .map() and watch the terminal</span>
<span class="tok-comment"># open a page that throws, and read the overlay top to bottom</span>
npx tsc --noEmit         <span class="tok-comment">  # after misspelling a prop name</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-0-2-cach-hoc" target="_blank" rel="noopener"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">TypeScript · 0.2 — How to study: let the compiler teach you</span><span class="lc-sub">Reading compiler errors as a teacher — the same spirit as this lesson</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-3-danh-sach" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.3 — Lists and keys</span><span class="lc-sub">Why a missing key (or key={index}) breaks state — error no. 1 above</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Active learning</span><span class="v">Typing and breaking code, not just reading — the only way the ideas stick.</span></div>
  <div class="kv"><span class="k">Fast Refresh loop</span><span class="v">Edit, save, see the change instantly; the tight loop you learn inside.</span></div>
  <div class="kv"><span class="k">Error message</span><span class="v">React/Next errors usually name the fix — read the whole thing before guessing.</span></div>
  <div class="kv"><span class="k">Exam Room</span><span class="v">The assessment set: Progress Tests, Final Exams, Practical Exams.</span></div>
  <div class="kv"><span class="k">Code Lab</span><span class="v">Hands-on exercises with solutions, tied to each chapter.</span></div>
  <div class="kv"><span class="k">AI judgement gap</span><span class="v">An AI writes code that compiles but is subtly wrong; this course builds the judgement it lacks.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Build alongside: read once for shape, then type the code, change one thing, and predict before you save.</li><li>Read the whole error message — React and Next errors usually tell you the fix.</li><li>Use the Exam Room (Progress Tests, Final and Practical Exams) and Code Lab — reading proves nothing.</li><li>Use AI to go faster on what you already understand, never to skip understanding.</li></ul>

<h3>📚 Keep these open while you study</h3>
<p>You do not need to read these cover to cover — use them the way a working developer does: to look something up the moment you need it.</p>
<a class="link-card dl" href="https://react.dev/reference/react" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">react.dev/reference — the hooks &amp; API reference</span><span class="lc-sub">When you forget exactly what useEffect or useMemo does, this is the page to open.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/learn" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">nextjs.org/learn — the official interactive Next.js course</span><span class="lc-sub">A free, hands-on companion straight from the Next.js team. Great to do alongside our Stage 3.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">MDN Web Docs — the web platform itself</span><span class="lc-sub">HTML, CSS, JavaScript, the DOM, fetch. React sits on top of all of this; MDN is the ground truth.</span></span>
</a>

<div class="callout ok">
<p><strong>Ready?</strong> Chapter 1 starts where every React app starts: with JSX, and the single most important idea in the whole framework — that you <em>describe</em> the UI you want, and React figures out how to get the screen there.</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Làm sao học được nhiều nhất</h2>
<p class="lead">Đây là khoá bạn dựng song song, không phải khoá bạn ngồi xem. Mỗi chương đều có code chạy được. Nếu chỉ đọc, bạn sẽ thấy như đã hiểu rồi ngồi vào bàn phím mới phát hiện là chưa. Gõ lại. Làm cho hỏng. Đọc lỗi.</p>

<h3>Vòng lặp hiệu quả</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Đọc bài một lượt</b>, để nắm hình dạng ý tưởng — đừng học thuộc.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Tự gõ lại code</b> vào app dev của bạn. Không copy-paste — gõ buộc bạn đọc từng token.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Đổi một thứ</b> và đoán trước chuyện gì xảy ra trước khi lưu. Đoán sai chính là bài học.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Đọc trọn thông báo lỗi.</b> Lỗi của React và Next tốt lạ thường — thường nói thẳng cách sửa.</div></div>
  <div class="lz-step"><div class="lz-si">5</div><div class="lz-sb"><b>Làm bài Code Lab</b> của chương đó cho nhớ lâu.</div></div>
</div>

<h3>Mỗi ký hiệu trong khoá nghĩa là gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">.lead / ví dụ</span><span class="v">Ý cốt lõi và code có kết quả thật hiện trong khối <code>out</code>. Đọc kết quả — đó mới là điểm chính.</span></div>
  <div class="kv"><span class="k">Bẫy</span><span class="v">Lỗi dễ mắc mà khó dò. Những cái này đáng giá hơn con đường suôn sẻ.</span></div>
  <div class="kv"><span class="k">"cuongthai.com làm thế nào"</span><span class="v">Cùng ý tưởng đó, nhìn trong một codebase production — kể cả những bug nó gây ra ở đây.</span></div>
  <div class="kv"><span class="k">Quiz &amp; Phòng thi</span><span class="v">Mỗi chương kết bằng một quiz; khoá có Bài kiểm tra tiến độ, Thi cuối khoá và thi thực hành trong Phòng thi.</span></div>
</div>

<h3>Dùng Phòng thi và Code Lab</h3>
<p>Đọc không chứng minh được gì. Khoá này đi kèm nguyên một bộ đánh giá trong <strong>Phòng thi</strong>: <b>3 Bài kiểm tra tiến độ</b> (sau chương 4, 12 và 20), <b>5 đề Thi cuối khoá</b> (mỗi đề 50 câu, phủ cả khoá), và <b>10 đề Thực hành</b> nơi bạn dựng một thứ và được chấm. <strong>Code Lab</strong> có bài tập thực hành kèm lời giải. Hãy làm; các câu hỏi được viết để bắt đúng những hiểu lầm khoá này đang cố sửa.</p>

<div class="pitfall">
<p><strong>Một lời về việc nhờ AI viết React hộ.</strong> AI sẽ vui vẻ đẻ ra một component render đúng mà sai một cách âm thầm — một effect thiếu phụ thuộc, một chỉ số dùng làm key, một <code>'use client'</code> đặt đầu file kéo nửa ứng dụng xuống trình duyệt. Nó biên dịch được, chạy được, và bug lên production. Toàn bộ mục đích khoá này là cho bạn cái phán đoán mà AI không có. Dùng nó để đi nhanh hơn ở những chỗ bạn đã hiểu; đừng dùng nó để nhảy qua phần hiểu. Riêng Chương 5 sẽ cho bạn xem ba effect AI-hay-viết mà đều là bug.</p>
</div>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy một đoạn code ở Chương 1, tự gõ (đừng dán) vào app dev, đổi một dòng, và đoán kết quả trước khi lưu.</li>
<li>Cố tình làm hỏng một thứ (bỏ một <code>key</code>, gõ sai tên prop) và đọc trọn thông báo lỗi — ghi lại đúng dòng nói cách sửa.</li>
<li>Mở Phòng thi và Code Lab của khoá và đánh dấu nơi có bài tập Chương 1.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã gõ và làm hỏng code thật, đọc một lỗi từ đầu đến cuối, và biết bài tập nằm ở đâu.</p></div>

<h3>🔬 Cố ý làm hỏng — ba lỗi thật (Next.js 16.4.6)</h3>
<p>Bài thực hành, làm thật trên một <code>my-app</code> mới. Trang vẽ danh sách không có key, và trang thứ hai đọc một giá trị có thể là <code>undefined</code>:</p>
<pre><code class="language-typescript">const MON = ['Bàn phím cơ', 'Chuột không dây', 'Lót chuột'];

function The({ tieuDe }: { tieuDe: string }) {
  return &lt;h2 className="text-xl font-bold"&gt;{tieuDe}&lt;/h2&gt;;
}

export default function Home() {
  return (
    &lt;main className="p-10 font-sans"&gt;
      &lt;The tieuDe="Giỏ hàng" /&gt;
      &lt;ul className="list-disc pl-6"&gt;
        {MON.map((m) =&gt; &lt;li&gt;{m}&lt;/li&gt;)}
      &lt;/ul&gt;
    &lt;/main&gt;
  );
}</code></pre>
<pre><code class="language-typescript">export default function Loi() {
  const ten = ['An', 'Bình'].find((x) =&gt; x === 'Cường');
  return &lt;h1&gt;Xin chào {ten!.toUpperCase()}&lt;/h1&gt;;
}</code></pre>
<p><strong>1 · Thiếu key.</strong> Trang vẫn hiện bình thường — cảnh báo chỉ nằm ở terminal của máy chủ dev và console trình duyệt (cùng huy hiệu đỏ "1 Issue"):</p>
<pre><code class="language-bash">$ npm run dev</code></pre><div class="out">✓ Ready in 674ms
Each child in a list should have a unique "key" prop.
Check the top-level render call using &lt;li&gt;. See https://react.dev/link/warning-keys for more information.
 GET / 200 in 244ms (next.js: 132ms, application-code: 112ms)</div>
<p><strong>2 · Lỗi lúc chạy.</strong> Mở <code>/loi</code> là thấy lớp phủ lỗi của dev. Đọc từ trên xuống: loại lỗi (<em>Runtime TypeError</em>, ở <em>Server</em>), thông điệp (<em>Cannot read properties of undefined (reading 'toUpperCase')</em>), vị trí (<code>src/app/loi/page.tsx (3:29)</code>), và đúng dòng mã có dấu mũ. Cách sửa tự lộ ra: <code>find</code> có thể trả về <code>undefined</code>.</p>
<p><strong>3 · Gõ sai tên prop</strong> (<code>tieude</code> thay vì <code>tieuDe</code>) — TypeScript bắt được trước cả trình duyệt, và những chữ cuối nói thẳng cách sửa:</p>
<pre><code class="language-bash">$ npx tsc --noEmit</code></pre><div class="out">src/app/page.tsx(10,12): error TS2322: Type '{ tieude: string; }' is not assignable to type 'IntrinsicAttributes &amp; { tieuDe: string; }'.
  Property 'tieude' does not exist on type 'IntrinsicAttributes &amp; { tieuDe: string; }'. Did you mean 'tieuDe'?</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm run dev              <span class="tok-comment">  # bỏ key trong một .map() rồi nhìn terminal</span>
<span class="tok-comment"># mở một trang ném lỗi, đọc lớp phủ từ trên xuống</span>
npx tsc --noEmit         <span class="tok-comment">  # sau khi gõ sai tên một prop</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-0-2-cach-hoc" target="_blank" rel="noopener"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">TypeScript · 0.2 — Cách học: để trình biên dịch dạy bạn</span><span class="lc-sub">Đọc lỗi của trình biên dịch như một người thầy — cùng tinh thần với bài này</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-3-danh-sach" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.3 — Danh sách và key</span><span class="lc-sub">Vì sao thiếu key (hay key={index}) làm hỏng state — lỗi số 1 ở trên</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Học chủ động</span><span class="v">Gõ và làm hỏng code, không chỉ đọc — cách duy nhất để ý tưởng bám lại.</span></div>
  <div class="kv"><span class="k">Vòng Fast Refresh</span><span class="v">Sửa, lưu, thấy thay đổi ngay; vòng lặp chặt bạn học bên trong.</span></div>
  <div class="kv"><span class="k">Thông báo lỗi</span><span class="v">Lỗi React/Next thường nói thẳng cách sửa — đọc trọn trước khi đoán.</span></div>
  <div class="kv"><span class="k">Phòng thi</span><span class="v">Bộ đánh giá: Kiểm tra tiến độ, Thi cuối khoá, Thi thực hành.</span></div>
  <div class="kv"><span class="k">Code Lab</span><span class="v">Bài tập thực hành kèm lời giải, gắn với từng chương.</span></div>
  <div class="kv"><span class="k">Khoảng trống phán đoán của AI</span><span class="v">AI viết code biên dịch được mà sai âm thầm; khoá này xây cái phán đoán nó thiếu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Dựng song song: đọc một lượt để nắm hình dạng, rồi gõ code, đổi một thứ, và đoán trước khi lưu.</li><li>Đọc trọn thông báo lỗi — lỗi React và Next thường nói thẳng cách sửa.</li><li>Dùng Phòng thi (Kiểm tra tiến độ, Thi cuối khoá và Thực hành) và Code Lab — đọc không chứng minh được gì.</li><li>Dùng AI để đi nhanh hơn ở chỗ bạn đã hiểu, đừng bao giờ dùng để nhảy qua phần hiểu.</li></ul>

<h3>📚 Hãy mở sẵn những thứ này khi học</h3>
<p>Bạn không cần đọc hết từ đầu tới cuối — hãy dùng chúng như một lập trình viên đang làm việc: tra cứu đúng lúc cần.</p>
<a class="link-card dl" href="https://react.dev/reference/react" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">react.dev/reference — tra cứu hooks &amp; API</span><span class="lc-sub">Khi bạn quên chính xác useEffect hay useMemo làm gì, đây là trang cần mở.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/learn" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">nextjs.org/learn — khoá Next.js tương tác chính thức</span><span class="lc-sub">Một người bạn đồng hành thực hành miễn phí thẳng từ đội Next.js. Rất hợp làm song song với Giai đoạn 3 của ta.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">MDN Web Docs — chính nền tảng web</span><span class="lc-sub">HTML, CSS, JavaScript, DOM, fetch. React nằm trên tất cả những thứ này; MDN là nguồn sự thật gốc.</span></span>
</a>

<div class="callout ok">
<p><strong>Sẵn sàng chưa?</strong> Chương 1 bắt đầu ở nơi mọi app React bắt đầu: với JSX, và ý tưởng quan trọng nhất của cả framework — rằng bạn <em>mô tả</em> giao diện mình muốn, còn React tự lo cách đưa màn hình tới đó.</p>
</div>
</div>
`,
    },
  ],
};
