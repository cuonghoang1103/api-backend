/**
 * Web Foundations — Chương 14: Đưa sản phẩm lên mạng (build, biến môi trường,
 * deploy, đo hiệu năng). Song ngữ EN/VI.
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong code escape thành \${.
 */

import { gallery } from './_slides.mjs';

export default {
  title: 'Chapter 14 — Shipping it|||Chương 14 — Đưa sản phẩm lên mạng',
  description: 'Mã chạy trên máy bạn chưa phải là sản phẩm. Chương này đi hết quãng còn lại: dựng bản production, quản lý biến môi trường và khoá bí mật, đưa lên hosting với tên miền và HTTPS, rồi đo xem nó có thật sự nhanh không.',
  lessons: [
    /* ─────────────────── 14.0 slide bài giảng ─────────────────── */
    {
      title: '14.0 — Shipping it in 12 slides|||14.0 — Đưa lên mạng trong 12 slide',
      slug: 'wf-14-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Build, biến môi trường, deploy và đo hiệu năng — 12 slide.',
      content: `
<div class="ml-en"><h2>📑 Shipping it in 12 slides</h2>
<p>Slide 5 is the one to read twice: a key in a frontend variable ships to every visitor.</p>
<p>Skim before the chapter to see what is coming, then come back afterwards to revise. If a slide still does not make sense, the lesson that teaches it is right below.</p></div>
<div class="ml-vi"><h2>📑 Đưa lên mạng trong 12 slide</h2>
<p>Slide 5 nên đọc hai lần: một cái khoá để trong biến frontend là đi tới mọi khách truy cập.</p>
<p>Lướt trước khi học chương để biết sắp học gì, rồi quay lại ôn sau. Slide nào còn chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${gallery('wf-ship', [
  [1, "Bìa"],
  [2, "Nội dung chương"],
  [3, "Dev server và bản build là HAI chương trình"],
  [4, "Đọc kết quả build"],
  [5, "Biến môi trường — chỗ gây sự cố thật ⭐⭐"],
  [6, "Đổi biến frontend thì phải DỰNG LẠI"],
  [7, "Nếu lỡ lộ khoá"],
  [8, "Deploy — chọn thứ đơn giản nhất"],
  [9, "Bẫy 404 khi tải lại trang ⭐"],
  [10, "Danh sách kiểm trước khi coi là xong"],
  [11, "Đo hiệu năng — Core Web Vitals"],
  [12, "Bốn cách sửa đáng làm trước"],
])}
`,
    },

    {
      title: '14.1 — What a production build actually does|||14.1 — Bản dựng production thật ra làm gì',
      slug: 'wf-14-1-build',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Khác biệt giữa dev server và bản build, bundling/minify/hashing, và vì sao "chạy trên máy em" không chứng minh được gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1</span>
<h2>The dev server and the build are two different programs</h2>
<div class="kv-grid">
  <div class="kv"><span class="k">npm start</span><span class="v">A server that recompiles on save. Readable code, helpful warnings, source maps, no optimisation. Never deploy this.</span></div>
  <div class="kv"><span class="k">npm run build</span><span class="v">Static files in <code>build/</code> or <code>dist/</code>. Minified, bundled, hashed, warnings stripped. This is what users get.</span></div>
</div>

<h3>What the build step performs</h3>
<pre><code>1. Bundling    — hundreds of modules become a few files (fewer requests)
2. Minifying   — comments and whitespace removed, names shortened
3. Hashing     — main.a80b38e9.js  ← the name changes when contents change
4. Tree-shaking— unused exports dropped
5. Splitting   — routes become separate chunks, loaded on demand</code></pre>
<p class="note-ct"><strong>Why the hash in the filename matters.</strong> It lets the CDN cache that file forever: the name can only refer to those exact bytes. Change one character of code and the name changes, so browsers fetch the new file immediately — you get aggressive caching and instant updates at the same time.</p>

<h3>Read the build output</h3>
<pre><code>File sizes after gzip:
  87.75 kB  build/static/js/main.b5d7f1ac.js
  31.87 kB  build/static/css/main.1f2a2a82.css</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Under ~150 kB JS</span><span class="v">Healthy for a small app.</span></div>
  <div class="kv"><span class="k">Over ~500 kB</span><span class="v">Something heavy slipped in — a date library, an icon set imported whole, a chart library you use once.</span></div>
</div>

<h3>Serve the build locally before you trust it</h3>
<pre><code>npm run build
npx serve -s build          # or: python3 -m http.server -d build 3000</code></pre>
<div class="pitfall"><strong>"It works on my machine" is not evidence.</strong> The dev server is forgiving in ways production is not: it resolves some paths differently, it does not minify (so a name-mangling bug never appears), and it skips the environment variables baked in at build time. Always open the built version once before deploying.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1</span>
<h2>Dev server và bản build là hai chương trình khác nhau</h2>
<div class="kv-grid">
  <div class="kv"><span class="k">npm start</span><span class="v">Một server dựng lại mỗi lần lưu. Mã dễ đọc, có cảnh báo hữu ích, có source map, không tối ưu gì. Đừng bao giờ đem cái này đi deploy.</span></div>
  <div class="kv"><span class="k">npm run build</span><span class="v">File tĩnh trong <code>build/</code> hoặc <code>dist/</code>. Đã rút gọn, gộp, gắn mã băm, bỏ cảnh báo. Đây mới là thứ người dùng nhận.</span></div>
</div>

<h3>Bước build làm những gì</h3>
<pre><code>1. Gộp gói (bundle) — hàng trăm module thành vài file (ít request hơn)
2. Rút gọn (minify) — bỏ chú thích và khoảng trắng, rút ngắn tên biến
3. Gắn mã băm      — main.a80b38e9.js  ← tên ĐỔI khi nội dung đổi
4. Rung cây        — bỏ những export không ai dùng
5. Tách gói        — mỗi route thành một mảnh, tải khi cần</code></pre>
<p class="note-ct"><strong>Vì sao mã băm trong tên file lại quan trọng.</strong> Nó cho phép CDN lưu đệm file đó VĨNH VIỄN: cái tên chỉ có thể trỏ tới đúng chuỗi byte ấy. Đổi một ký tự trong mã là tên đổi, nên trình duyệt tải bản mới ngay — bạn vừa được lưu đệm triệt để vừa được cập nhật tức thì.</p>

<h3>Đọc kết quả build</h3>
<pre><code>File sizes after gzip:
  87.75 kB  build/static/js/main.b5d7f1ac.js
  31.87 kB  build/static/css/main.1f2a2a82.css</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Dưới ~150 kB JS</span><span class="v">Lành mạnh cho một ứng dụng nhỏ.</span></div>
  <div class="kv"><span class="k">Trên ~500 kB</span><span class="v">Có thứ nặng lọt vào — một thư viện ngày tháng, một bộ icon import nguyên cụm, một thư viện biểu đồ dùng đúng một lần.</span></div>
</div>

<h3>Chạy thử bản build ở máy trước khi tin nó</h3>
<pre><code>npm run build
npx serve -s build          # hoặc: python3 -m http.server -d build 3000</code></pre>
<div class="pitfall"><strong>"Máy em chạy được" không phải bằng chứng.</strong> Dev server dễ tính ở những chỗ production thì không: nó phân giải vài đường dẫn khác đi, nó không rút gọn (nên lỗi do đổi tên biến không bao giờ lộ ra), và nó bỏ qua các biến môi trường vốn được nướng vào lúc build. Luôn mở bản đã build một lần trước khi deploy.</div>
</div>
`,
    },

    {
      title: '14.2 — Environment variables and secrets|||14.2 — Biến môi trường và khoá bí mật',
      slug: 'wf-14-2-env-secrets',
      type: 'DOCUMENT',
      description: 'Biến build-time và runtime, vì sao khoá API không bao giờ được vào bundle, và cách xử lý khi lỡ lộ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.2</span>
<h2>Configuration changes per environment; code should not</h2>
<pre><code># .env.local  — on your machine, NEVER committed
REACT_APP_API_URL=http://localhost:8080
DATABASE_URL=postgres://localhost:5432/dev</code></pre>
<pre><code># .env.example — committed, documents the shape, holds NO real values
REACT_APP_API_URL=
DATABASE_URL=</code></pre>
<p>The example file is what makes a project joinable: a new person copies it, fills in their own values, and runs. Without it they have to guess which variables exist.</p>

<h3>The distinction that causes real incidents</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Frontend (build-time)</span><span class="v">Anything prefixed <code>REACT_APP_</code>, <code>VITE_</code> or <code>NEXT_PUBLIC_</code> is <strong>baked into the bundle</strong>. It ships to every visitor and is readable with View Source.</span></div>
  <div class="kv"><span class="k">Backend (runtime)</span><span class="v">Read from <code>process.env</code> on the server. Never sent to the browser. This is the only safe place for a secret.</span></div>
</div>

<div class="pitfall"><strong>Never put an API key in a frontend variable.</strong> <code>REACT_APP_OPENAI_KEY</code> is not hidden — it is inside the JavaScript you hand to every visitor. The correct shape is a small backend route that holds the key and forwards the request. This is not theoretical: a real incident on this very site came from a browser-side key that was baked in at build time, then quietly fell back to a revoked public key when the variable was missing.</div>

<h3>Changing a frontend variable requires a REBUILD</h3>
<pre><code># ❌ does nothing — the old value is already compiled in
edit .env  →  restart the server

# ✅
edit .env  →  npm run build  →  redeploy</code></pre>
<p class="note-ct">Backend variables are the opposite: they are read when the process starts, so a restart is enough. Mixing up these two rules produces the classic "I changed the config and nothing happened".</p>

<h3>If a secret leaks</h3>
<pre><code>1. Rotate it first.  Revoke the old key at the provider, issue a new one.
   Do this BEFORE anything else — the clock is running.
2. Then clean the repo.  Removing the file in a new commit is not enough;
   the value stays in history and on any clone.
3. Add it to .gitignore so it cannot happen the same way twice.</code></pre>
<p>Point 1 is the one people get wrong: they spend an hour rewriting git history while the live key is still valid and already scraped.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.2</span>
<h2>Cấu hình đổi theo môi trường; mã nguồn thì không</h2>
<pre><code># .env.local  — nằm trên máy bạn, KHÔNG BAO GIỜ commit
REACT_APP_API_URL=http://localhost:8080
DATABASE_URL=postgres://localhost:5432/dev</code></pre>
<pre><code># .env.example — có commit, mô tả hình dáng, KHÔNG chứa giá trị thật
REACT_APP_API_URL=
DATABASE_URL=</code></pre>
<p>File ví dụ là thứ khiến một dự án có thể tham gia được: người mới chép nó ra, điền giá trị của họ, rồi chạy. Không có nó thì họ phải đoán xem dự án cần những biến gì.</p>

<h3>Phân biệt này gây ra sự cố thật</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Frontend (lúc build)</span><span class="v">Bất cứ biến nào có tiền tố <code>REACT_APP_</code>, <code>VITE_</code> hay <code>NEXT_PUBLIC_</code> đều được <strong>nướng thẳng vào bundle</strong>. Nó đi tới mọi người truy cập và đọc được bằng View Source.</span></div>
  <div class="kv"><span class="k">Backend (lúc chạy)</span><span class="v">Đọc từ <code>process.env</code> trên máy chủ. Không bao giờ gửi xuống trình duyệt. Đây là nơi DUY NHẤT an toàn cho khoá bí mật.</span></div>
</div>

<div class="pitfall"><strong>Đừng bao giờ để khoá API vào biến của frontend.</strong> <code>REACT_APP_OPENAI_KEY</code> không hề được giấu — nó nằm trong chính đoạn JavaScript bạn đưa cho mọi khách truy cập. Cách đúng là một route backend nhỏ giữ khoá và chuyển tiếp yêu cầu. Đây không phải chuyện lý thuyết: một sự cố có thật trên chính trang web này bắt nguồn từ một khoá phía trình duyệt được nướng vào lúc build, rồi âm thầm rơi về một khoá công khai đã bị thu hồi khi biến đó vắng mặt.</div>

<h3>Đổi biến của frontend thì PHẢI DỰNG LẠI</h3>
<pre><code># ❌ không có tác dụng gì — giá trị cũ đã biên dịch vào rồi
sửa .env  →  khởi động lại server

# ✅
sửa .env  →  npm run build  →  deploy lại</code></pre>
<p class="note-ct">Biến của backend thì ngược lại: chúng được đọc lúc tiến trình khởi động, nên khởi động lại là đủ. Lẫn lộn hai luật này sinh ra câu kinh điển "em đổi cấu hình rồi mà không thấy gì đổi".</p>

<h3>Nếu lỡ lộ khoá</h3>
<pre><code>1. Xoay khoá TRƯỚC.  Thu hồi khoá cũ ở nhà cung cấp, cấp khoá mới.
   Làm việc này TRƯỚC mọi thứ khác — đồng hồ đang chạy.
2. RỒI mới dọn repo.  Xoá file trong một commit mới là KHÔNG đủ;
   giá trị đó vẫn nằm trong lịch sử và trong mọi bản clone.
3. Thêm vào .gitignore để không thể lặp lại theo cùng một cách.</code></pre>
<p>Điểm 1 là chỗ người ta hay làm sai: họ bỏ cả tiếng đồng hồ viết lại lịch sử git trong khi khoá thật vẫn còn hiệu lực và đã bị quét mất từ lâu.</p>
</div>
`,
    },

    {
      title: '14.3 — Deploying|||14.3 — Đưa lên hosting',
      slug: 'wf-14-3-deploy',
      type: 'DOCUMENT',
      description: 'Trang tĩnh vs máy chủ, deploy tự động từ Git, tên miền và HTTPS, và cái bẫy 404 khi tải lại trang.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.3</span>
<h2>Pick the simplest thing that can host your app</h2>
<div class="kv-grid">
  <div class="kv"><span class="k">Static hosting</span><span class="v">Vercel, Netlify, GitHub Pages, Cloudflare Pages. For anything that builds to HTML/CSS/JS — including React. Free tiers are generous. Start here.</span></div>
  <div class="kv"><span class="k">Server hosting</span><span class="v">Railway, Render, Fly.io, or a plain VPS. Needed once you have a Node API, a database, background jobs.</span></div>
</div>

<h3>The whole deploy, on a static host</h3>
<pre><code>1. Push your code to GitHub
2. Connect the repo on Vercel/Netlify
3. Set the build command (npm run build) and output folder (build)
4. Add your environment variables in the dashboard
5. Every push to main now builds and deploys automatically</code></pre>
<p class="note-ct">Notice what this gives you for free: a preview URL for every pull request, instant rollback to any previous deploy, HTTPS with a certificate you never think about, and a global CDN. Doing all that by hand on a VPS is days of work.</p>

<h3>The 404-on-refresh trap</h3>
<pre><code>/            → works
/pizzas      → works when you click a link
/pizzas      → 404 when you RELOAD the page</code></pre>
<p>Single-page apps do their own routing in JavaScript. Clicking a link never asks the server. Reloading does — and the server looks for a file called <code>/pizzas</code>, which does not exist. The fix is to tell the host to serve <code>index.html</code> for every unknown path:</p>
<pre><code># netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200</code></pre>
<pre><code># nginx
location / { try_files $uri $uri/ /index.html; }</code></pre>

<h3>Before you call it done</h3>
<pre><code>☐ Open the deployed URL in a private window (no cached login)
☐ Reload a deep link — the 404 trap above
☐ Check it on a phone, not just a narrow desktop window
☐ Confirm the API calls point at production, not localhost
☐ Watch the Network tab for red rows and 4xx/5xx
☐ Check HTTPS shows a lock, not "Not secure"</code></pre>
<div class="pitfall"><strong>Green build does not mean working app.</strong> A build can succeed and still ship something broken — a wrong API URL, a missing environment variable, an image path that only exists on your machine. The deploy is finished when you have <em>opened the live URL and used it</em>, not when the log turns green.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.3</span>
<h2>Chọn thứ đơn giản nhất đủ để chứa ứng dụng của bạn</h2>
<div class="kv-grid">
  <div class="kv"><span class="k">Hosting tĩnh</span><span class="v">Vercel, Netlify, GitHub Pages, Cloudflare Pages. Cho mọi thứ build ra HTML/CSS/JS — kể cả React. Gói miễn phí khá rộng rãi. Bắt đầu từ đây.</span></div>
  <div class="kv"><span class="k">Hosting có máy chủ</span><span class="v">Railway, Render, Fly.io, hoặc một VPS thường. Cần khi bạn đã có API Node, cơ sở dữ liệu, việc chạy nền.</span></div>
</div>

<h3>Toàn bộ quy trình deploy trên hosting tĩnh</h3>
<pre><code>1. Đẩy mã lên GitHub
2. Nối repo đó trên Vercel/Netlify
3. Đặt lệnh build (npm run build) và thư mục kết quả (build)
4. Thêm biến môi trường trong bảng điều khiển
5. Từ giờ mỗi lần push lên main là nó tự build và tự deploy</code></pre>
<p class="note-ct">Để ý những thứ bạn được miễn phí: một URL xem thử cho MỖI pull request, lùi về bất kỳ bản deploy cũ nào chỉ bằng một cú bấm, HTTPS với chứng chỉ bạn không phải nghĩ tới, và một CDN toàn cầu. Tự làm hết ngần ấy trên VPS là công việc của nhiều ngày.</p>

<h3>Cái bẫy 404 khi tải lại trang</h3>
<pre><code>/            → chạy
/pizzas      → chạy khi bạn BẤM vào link
/pizzas      → 404 khi bạn TẢI LẠI trang</code></pre>
<p>Ứng dụng một trang (SPA) tự điều hướng bằng JavaScript. Bấm link thì không hỏi máy chủ lấy một lần. Tải lại thì có hỏi — và máy chủ đi tìm một file tên <code>/pizzas</code>, thứ không hề tồn tại. Cách chữa là bảo hosting trả <code>index.html</code> cho mọi đường dẫn lạ:</p>
<pre><code># netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200</code></pre>
<pre><code># nginx
location / { try_files $uri $uri/ /index.html; }</code></pre>

<h3>Trước khi coi là xong</h3>
<pre><code>☐ Mở URL đã deploy trong cửa sổ ẩn danh (không còn phiên đăng nhập cũ)
☐ Tải lại một đường dẫn sâu — đúng cái bẫy 404 ở trên
☐ Thử trên điện thoại thật, không chỉ thu hẹp cửa sổ máy tính
☐ Xác nhận các lời gọi API trỏ vào production, không phải localhost
☐ Nhìn tab Network xem có dòng đỏ, có 4xx/5xx không
☐ Kiểm HTTPS hiện ổ khoá, không phải chữ "Not secure"</code></pre>
<div class="pitfall"><strong>Build xanh không có nghĩa là ứng dụng chạy.</strong> Một bản build có thể thành công mà vẫn ship ra thứ hỏng — sai URL API, thiếu một biến môi trường, một đường dẫn ảnh chỉ tồn tại trên máy bạn. Việc deploy hoàn tất khi bạn <em>đã mở URL thật và dùng thử nó</em>, không phải khi cái log chuyển sang màu xanh.</div>
</div>
`,
    },

    {
      title: '14.4 — Measuring performance|||14.4 — Đo hiệu năng',
      slug: 'wf-14-4-performance',
      type: 'DOCUMENT',
      description: 'Core Web Vitals, Lighthouse, tìm thủ phạm trong tab Network, và bốn cách sửa đáng giá nhất.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.4</span>
<h2>Measure first — optimising by guesswork wastes days</h2>
<div class="kv-grid">
  <div class="kv"><span class="k">LCP</span><span class="v">Largest Contentful Paint — when the main content appears. Target under 2.5s.</span></div>
  <div class="kv"><span class="k">INP</span><span class="v">Interaction to Next Paint — how fast the page answers a click. Target under 200ms.</span></div>
  <div class="kv"><span class="k">CLS</span><span class="v">Cumulative Layout Shift — how much things jump while loading. Target under 0.1.</span></div>
</div>

<h3>The three tools, in the order you should use them</h3>
<pre><code>1. Network tab   — WHAT is being downloaded, how big, how slow
2. Lighthouse    — a score plus a ranked list of specific fixes
3. Performance   — a flame chart, when you need to find slow JavaScript</code></pre>
<p class="note-ct"><strong>Start with the Network tab, sorted by Size.</strong> The biggest single row is usually the whole problem. A real example from this site: a course listing page downloaded <strong>2.86 MB</strong> of JSON to render a grid of titles and thumbnails — the API was returning every chapter and lesson of every course. Nothing in the frontend needed it. Sorting by Size found that in about ten seconds; guessing would not have.</p>

<h3>The four fixes worth doing first</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Send less data</span><span class="v">Return only the fields the screen shows. The cheapest and biggest win, and it is a backend change, not a frontend one.</span></div>
  <div class="kv"><span class="k">Size your images</span><span class="v">A 4 MB photo displayed at 400px wide is 4 MB wasted. Resize, use WebP, and always set <code>width</code> and <code>height</code> so the layout does not jump (that is CLS).</span></div>
  <div class="kv"><span class="k">Split the bundle</span><span class="v"><code>React.lazy</code> per route. The first page stops paying for code it does not use.</span></div>
  <div class="kv"><span class="k">Cache the immutable</span><span class="v">Hashed filenames can be cached for a year. HTML must not be.</span></div>
</div>

<h3>Beware of measuring on your own laptop</h3>
<pre><code>DevTools → Network → throttling: "Fast 3G"
DevTools → Performance → CPU: 4x slowdown</code></pre>
<p>Your machine is fast and your connection is local. Most users have neither. Throttling turns "feels fine" into a number you can act on.</p>

<div class="pitfall"><strong>Do not optimise what you have not measured.</strong> Rewriting a component for speed feels productive and usually changes nothing, because the real cost was a 2 MB payload or an unsized image. Measure, fix the biggest number, measure again — and stop when it is fast enough, not when it is perfect.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.4</span>
<h2>Đo trước — tối ưu theo cảm tính là tốn ngày</h2>
<div class="kv-grid">
  <div class="kv"><span class="k">LCP</span><span class="v">Largest Contentful Paint — khi nội dung chính hiện ra. Nhắm dưới 2,5 giây.</span></div>
  <div class="kv"><span class="k">INP</span><span class="v">Interaction to Next Paint — trang đáp lại một cú bấm nhanh cỡ nào. Nhắm dưới 200ms.</span></div>
  <div class="kv"><span class="k">CLS</span><span class="v">Cumulative Layout Shift — mọi thứ nhảy nhót bao nhiêu trong lúc tải. Nhắm dưới 0,1.</span></div>
</div>

<h3>Ba công cụ, theo đúng thứ tự nên dùng</h3>
<pre><code>1. Tab Network   — ĐANG tải cái gì, nặng bao nhiêu, chậm cỡ nào
2. Lighthouse    — một điểm số kèm danh sách việc cần sửa, đã xếp hạng
3. Tab Performance — biểu đồ ngọn lửa, khi cần tìm đoạn JavaScript chậm</code></pre>
<p class="note-ct"><strong>Bắt đầu từ tab Network, sắp xếp theo Size.</strong> Dòng to nhất thường chính là toàn bộ vấn đề. Một ví dụ có thật trên chính trang này: trang danh sách khoá học tải về <strong>2,86 MB</strong> JSON chỉ để vẽ một lưới tên và ảnh — API đang trả về mọi chương và mọi bài của mọi khoá. Không có gì ở frontend cần tới chúng. Sắp xếp theo Size tìm ra điều đó trong khoảng mười giây; ngồi đoán thì không.</p>

<h3>Bốn cách sửa đáng làm trước</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Gửi ít dữ liệu đi</span><span class="v">Chỉ trả về những trường màn hình thật sự hiện. Rẻ nhất và lợi nhất — và đây là việc của BACKEND, không phải frontend.</span></div>
  <div class="kv"><span class="k">Chỉnh cỡ ảnh</span><span class="v">Một tấm ảnh 4 MB hiển thị ở bề ngang 400px là 4 MB ném đi. Thu nhỏ, dùng WebP, và luôn đặt <code>width</code> và <code>height</code> để bố cục không nhảy (đó chính là CLS).</span></div>
  <div class="kv"><span class="k">Tách gói JS</span><span class="v"><code>React.lazy</code> cho từng route. Trang đầu tiên thôi phải trả giá cho đoạn mã nó không dùng.</span></div>
  <div class="kv"><span class="k">Lưu đệm thứ bất biến</span><span class="v">File có mã băm trong tên thì lưu đệm được cả năm. Còn HTML thì tuyệt đối không.</span></div>
</div>

<h3>Cẩn thận khi đo trên chính máy của bạn</h3>
<pre><code>DevTools → Network → throttling: "Fast 3G"
DevTools → Performance → CPU: chậm 4 lần</code></pre>
<p>Máy bạn nhanh và đường mạng thì nội bộ. Phần lớn người dùng không có cả hai thứ đó. Bóp băng thông biến "thấy cũng ổn" thành một con số bạn hành động được.</p>

<div class="pitfall"><strong>Đừng tối ưu thứ bạn chưa đo.</strong> Viết lại một component cho nhanh nghe rất năng suất và thường chẳng đổi gì, vì chi phí thật nằm ở một payload 2 MB hoặc một tấm ảnh không đặt kích thước. Đo, sửa con số lớn nhất, rồi đo lại — và dừng khi đã đủ nhanh, không phải khi đã hoàn hảo.</div>
</div>
`,
    },

    {
      title: '14.5 — Chapter 14 quiz|||14.5 — Kiểm tra chương 14',
      slug: 'wf-14-5-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về build, biến môi trường, deploy SPA và đo hiệu năng.',
      content: `
<div class="ml-en"><p class="lead">Six questions on builds, environment variables, deploying a single-page app, and measuring performance.</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Frontend env vars are public</span><span class="lz-t">baked into the bundle at build time</span><span class="lz-d">A key in REACT_APP_* ships to every visitor. Secrets belong on the server, behind a proxy route.</span></div>
<div class="lz-node"><span class="lz-k">Changing them needs a rebuild</span><span class="lz-t">a restart is not enough</span><span class="lz-d">Backend variables are the opposite — read at process start, so restarting does the job.</span></div>
<div class="lz-node"><span class="lz-k">SPAs 404 on reload</span><span class="lz-t">until the host rewrites to index.html</span><span class="lz-d">Clicking a link never asks the server; reloading does, and the path is not a real file.</span></div>
<div class="lz-node"><span class="lz-k">Measure before optimising</span><span class="lz-t">Network tab sorted by Size</span><span class="lz-d">The biggest row is usually the whole problem. Guessing costs days and changes nothing.</span></div>
</div></div>
<div class="ml-vi"><p class="lead">Sáu câu về bản dựng, biến môi trường, deploy ứng dụng một trang và đo hiệu năng.</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Biến env của frontend là CÔNG KHAI</span><span class="lz-t">nướng vào bundle lúc build</span><span class="lz-d">Một khoá trong REACT_APP_* đi tới mọi khách truy cập. Khoá bí mật thuộc về máy chủ, sau một route proxy.</span></div>
<div class="lz-node"><span class="lz-k">Đổi chúng thì phải DỰNG LẠI</span><span class="lz-t">khởi động lại là không đủ</span><span class="lz-d">Biến của backend thì ngược lại — đọc lúc tiến trình khởi động, nên restart là xong.</span></div>
<div class="lz-node"><span class="lz-k">SPA trả 404 khi tải lại</span><span class="lz-t">tới khi hosting rewrite về index.html</span><span class="lz-d">Bấm link thì không hỏi máy chủ; tải lại thì có, mà đường dẫn đó không phải file thật.</span></div>
<div class="lz-node"><span class="lz-k">Đo trước khi tối ưu</span><span class="lz-t">tab Network, sắp theo Size</span><span class="lz-d">Dòng to nhất thường là toàn bộ vấn đề. Ngồi đoán thì tốn ngày mà không đổi gì.</span></div>
</div></div>
`,
      quiz: {
        timeLimitSeconds: 480,
        questions: [
          {
            question: 'Where is it safe to keep a third-party API key?|||Để khoá API của bên thứ ba ở đâu là an toàn?',
            options: [
              'On the server, behind a backend route that forwards the request|||Trên máy chủ, sau một route backend chuyển tiếp yêu cầu',
              'In a REACT_APP_ variable|||Trong một biến REACT_APP_',
              'In a comment in the source|||Trong một dòng chú thích ở mã nguồn',
              'In localStorage|||Trong localStorage',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You change REACT_APP_API_URL and restart the server, but nothing changes. Why?|||Bạn đổi REACT_APP_API_URL rồi khởi động lại server mà không thấy gì đổi. Vì sao?',
            options: [
              'Frontend variables are baked in at build time — you must rebuild|||Biến frontend được nướng vào lúc BUILD — phải dựng lại',
              'The variable name is wrong|||Tên biến bị sai',
              'Environment variables do not work in React|||React không dùng được biến môi trường',
              'You need to clear localStorage|||Phải xoá localStorage',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Your SPA works when clicking links, but reloading /pizzas gives 404. The fix?|||SPA của bạn chạy khi bấm link, nhưng tải lại /pizzas thì 404. Cách chữa?',
            options: [
              'Tell the host to serve index.html for unknown paths|||Bảo hosting trả index.html cho mọi đường dẫn lạ',
              'Add a pizzas.html file|||Thêm một file pizzas.html',
              'Switch from React Router to links|||Bỏ React Router, dùng thẻ a thường',
              'Disable HTTPS|||Tắt HTTPS',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does the hash in main.a80b38e9.js allow?|||Mã băm trong main.a80b38e9.js cho phép điều gì?',
            options: [
              'Caching that file forever, while new code gets a new name|||Lưu đệm file đó vĩnh viễn, còn mã mới thì có tên mới',
              'Encrypting the source code|||Mã hoá mã nguồn',
              'Making the file smaller|||Làm file nhỏ đi',
              'Preventing others from reading it|||Ngăn người khác đọc được nó',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A page feels slow. What do you open FIRST?|||Một trang thấy chậm. Bạn mở cái gì TRƯỚC?',
            options: [
              'The Network tab, sorted by Size|||Tab Network, sắp xếp theo Size',
              'The source code of the slowest component|||Mã nguồn của component chậm nhất',
              'A rewrite in a faster framework|||Một bản viết lại bằng framework nhanh hơn',
              'The database|||Cơ sở dữ liệu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which metric measures things jumping around while the page loads?|||Chỉ số nào đo việc mọi thứ nhảy nhót trong lúc trang tải?',
            options: ['CLS|||CLS', 'LCP|||LCP', 'INP|||INP', 'TTFB|||TTFB'],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
