/**
 * Next.js & React — Chương 20: Build & Deploy (Docker/VPS). KHÉP KHOÁ (mốc PT3).
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Viết cho người mới — định nghĩa build/deploy/container/env/CDN khi gặp. Capstone:
 * dồn nhiều sự cố THẬT cuongthai.com. Nối [[project_vps_deploy_infra]],
 * [[feedback_deploy_ships_code_not_data]], [[feedback_cdn_caches_404_too]],
 * [[project_gif404_stale_dist_and_recoverable_delete]]. Xem
 * [[feedback_nextjs_course_beginner_first]]. Không có output console để chạy.
 */

import G20_1 from './giang/nxj-20-1.mjs';
import G20_2 from './giang/nxj-20-2.mjs';
import G20_3 from './giang/nxj-20-3.mjs';
import G20_4 from './giang/nxj-20-4.mjs';
import G20_5 from './giang/nxj-20-5.mjs';
export default {
  title: 'Chapter 20 — Build and deploy to production|||Chương 20 — Build và deploy lên production',
  description: 'Đưa app từ máy bạn ra internet: next build tạo bản production, biến môi trường và bẫy NEXT_PUBLIC bake-lúc-build, đóng gói bằng Docker, deploy lên VPS, và cả một họ bug "build cũ/thiếu" cùng sự cố thật của cuongthai.com. Chương khép khoá.',
  lessons: [
    /* ─────────────────────────── 20.1 ─────────────────────────── */
    {
      title: '20.1 — What deploying means: build vs start|||20.1 — Deploy nghĩa là gì: build vs start',
      slug: 'nextjs-20-1-build-vs-start',
      type: 'VIDEO',
      isFreePreview: true,
      // Video: "Dockerize Next.js 16 & Deploy To VPS (+ Custom Domain, SSL, CDN Cloudflare, Docker Compose)" — ByteGrad (oEmbed verified).
      video: { url: 'https://youtu.be/DCJiQBag6Fs', durationSeconds: 0 },
      description: 'Suốt khoá bạn chạy npm run dev. Nhưng dev không phải thứ đưa cho người dùng. "Deploy" là đưa app lên một máy chủ trên internet. Trước tiên, hiểu next build (đóng gói) khác next start (chạy bản đóng gói).',
      content: `
${G20_1}
<div class="ml-en">
<span class="eyebrow">Chapter 20 · Lesson 20.1 · Course finale</span>
<h2>From "runs on my machine" to "runs for the world"</h2>
<p class="lead">All course long you ran <code>npm run dev</code> — the development server, built for fast editing with instant reloads. That is not what real users get. <strong>Deploying</strong> means putting your app on a server on the internet so anyone can visit it. The first step is understanding the two production commands.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">npm run dev</span><span class="v">Development mode. Recompiles as you edit, shows detailed errors, is intentionally <em>not</em> optimised. Only for you, while building. Never serve users with this.</span></div>
  <div class="kv"><span class="k">next build</span><span class="v">Creates the optimised <em>production build</em>: it compiles, minifies, splits code, pre-renders static pages, and produces a <code>.next</code> folder ready to run. You run this once per release.</span></div>
  <div class="kv"><span class="k">next start</span><span class="v">Runs the production build you just made. This is the server real users hit. Fast, optimised, no dev tooling.</span></div>
</div>

<h3>The lifecycle, end to end</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">You write code and test locally with <code>npm run dev</code>.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><code>next build</code> turns your source into an optimised production build (the static pages, the bundles from Chapter 18, everything decided here).</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">The build is copied to a server, where <code>next start</code> (or a container) serves it to visitors.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb">New release? Build again, ship again. Production always runs a <em>build</em>, never your raw source.</div></div>
</div>

<div class="callout warn">
<p><strong>The most important idea in this chapter:</strong> production runs the <em>build</em>, not your source files. A lot of confusing production bugs come from this gap — something is true in your source but was decided at build time and frozen (the next lesson's env vars, the static pages from Chapter 17). "It works in dev but not in production" almost always means: dev re-reads your source live; production is serving a build that was made at a specific moment. Keep that distinction in mind and half of deploy mysteries dissolve.</p>
</div>

<h3>The three commands, and what each one is for</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>next dev</b> — Compiles on demand, hot-reloads, ships unminified code with development React. Never run this in production.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>next build</b> — Type-checks, bundles, and pre-renders every static route (Next.js 16 no longer lints during the build — run ESLint yourself or in CI). It prints the route table — the only authoritative answer about what is static.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>next start</b> — Serves what &#96;build&#96; produced. It does not compile anything. With no build output it prints “✓ Ready”, then exits (measured below); with a <em>stale</em> build it does not fail at all — it quietly serves the old release.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>So the pair is the deploy</b> — Build, then start. A deploy that only restarts the process is running the previous build.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a deploy that restarts the container without rebuilding.</strong> The process comes back up, the health check passes, and it is serving the previous build — so your fix is not there, and the route you just added returns 404. It looks like the code did not push. This repo&#39;s own history has exactly this: a &#96;--no-build&#96; deploy left production running a stale &#96;dist/&#96; that never mounted a new route, and the symptom was diagnosed as a data problem for hours. The reliable check is an unauthenticated &#96;curl&#96; against a route only the new build has: 404 means stale build, 401 or 200 means it is live.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/next-cli" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — CLI reference</span><span class="lc-sub">Every command and flag, including what build actually does.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/deploying" target="_blank" rel="noopener">
  <span class="lc-ico">🚢</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Deploying</span><span class="lc-sub">The supported deployment shapes, and the build output each one needs.</span></span>
</a>


<h3>🔬 Measured: build, start, and the gap between them (Next.js 16.4.6 · Mac of the course)</h3>
<p><strong>1 · next build</strong> — compile, TypeScript, static pages, the route table — and no lint step:</p>
<div class="out">$ npm run build
▲ Next.js 16.4.6 (Turbopack)
  Creating an optimized production build ...
✓ Compiled successfully in 9.0s
  Running TypeScript ...
  Finished TypeScript in 1436ms ...
  Collecting page data using 9 workers ...
✓ Generating static pages using 9 workers (11/11) in 162ms
  Finalizing page optimization ...
ƒ /gio
○ /ver
real 12.03
$ du -sh .next | awk '{print ".next: " $1}'; ls .next | tr '\\n' ' '; echo
.next: 33M
app-path-routes-manifest.json build BUILD_ID build-manifest.json cache diagnostics export-marker.json fallback-build-manifest.json images-manifest.json next-minimal-server.js.nft.json next-server.js.nft.json package.json prerender-manifest.json required-server-files.js required-server-files.json routes-manifest.json server static trace trace-build turbopack types </div>
<p><strong>2 · next start with no build</strong> — the log says Ready; the URL says nothing is there:</p>
<div class="out">$ npx next start -p 3000   # no build yet
- Network:       http://127.0.0.1:19341
✓ Ready in 113ms

✓ Running next.config.ts took 22ms
Error: Could not find a production build in the '.next' directory. Try building your app with 'next build' before starting the production server. https://nextjs.org/docs/messages/production-start-no-build-id
    at ignore-listed frames
$ curl -s -o /dev/null -w '%{http_code}' localhost:3000/ver
HTTP 000
Error: Could not find a production build in the '.next' directory. Try building your app with 'next build' before starting the production server. https://nextjs</div>
<p><strong>3 · Production runs the build, not the source</strong> — change the source to v2 and restart: still v1, until a real build:</p>
<div class="out">$ curl -s http://127.0.0.1:19341/ver | grep -o 'Release v[0-9]' | head -1
Release v1
$ sed -i 's/Release v1/Release v2/' src/app/ver/page.tsx   # change the SOURCE, restart, no build
source: Release v2
$ curl -s localhost:3000/ver | grep -o 'Release v[0-9]'   # after restart
Release v1
$ npm run build &amp;&amp; npx next start   # after a real build
Release v2</div>
<p><strong>4 · A type error dev serves and build refuses</strong>:</p>
<pre><code class="language-typescript">const total: number = 'one hundred';</code></pre>
<div class="out">$ npm run dev   →   curl localhost:3000/sai
next dev /sai → HTTP 200
Total: one hundred
$ npm run build
✓ Compiled successfully in 569ms
src/app/sai/page.tsx(3,9): error TS2322: Type 'string' is not assignable to type 'number'.
Failed to type check.</div>
<p><strong>5 · Dev is a different program</strong> — the same dynamic page:</p>
<div class="out">$ for s in "next start" "next dev"; do curl -w '%{time_total}' …/gio (first, second); done
next start /gio: 1st 46 ms · 2nd 7 ms
next dev   /gio: 1st 2894 ms · 2nd 29 ms
$ ps -o rss= -p &lt;pid&gt;   # memory of each server
next start RSS 102 MB
next dev   RSS 502 MB</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ grep -n "output: 'standalone'" frontend/next.config.js; grep -nE '^RUN npm run build|^CMD ' frontend/Dockerfile
6:  output: 'standalone',
140:RUN npm run build
175:CMD ["node", "server.js"]
$ grep -n 'Smoke-testing core API routes' deploy.sh deploy-nha.sh | head -3
deploy.sh:1010:info "Smoke-testing core API routes are mounted..."
$ grep -n '2026-07-02 | GIF picker dead' CLAUDE.md | cut -c1-160
817:| 2026-07-02 | GIF picker dead + "chats disappearing" together, survived re-login. Root cause: prod ran a **stale &#96;dist/index.js&#96;** that never mounted &#96;/api</div>The image runs <code>npm run build</code> once (standalone output); the container runs <code>node server.js</code>. After the 02/07/2026 stale-build outage, the deploy script smoke-tests core routes and fails on any 404.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">rm -rf .next &amp;&amp; npx next start -p 3000      <span class="tok-comment">  # read the log, then curl</span>
curl -s -o /dev/null -w "%{http_code}\\n" localhost:3000/
npm run build &amp;&amp; npx next start -p 3000
<span class="tok-comment"># edit a page, restart WITHOUT building, curl again — then build and compare</span></code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">“I pushed the fix and it is not live” — the server restarted on the old <code>.next/</code>; nobody ran the build.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">…you serve users with <code>next dev</code>? About 5× the memory, seconds on first visits, development React for everyone.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">A dev server on a public port leaks stack traces with file paths and source maps — a map of your code for free.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Build locally before every deploy; run <code>next start</code> (or <code>node server.js</code>) in production; smoke-test URLs, not log lines.</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-17-2-tinh-vs-dong" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 17.2 — Static vs dynamic</span><span class="lc-sub">Decided at build time</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-17-6-deploy-hong-quay-lui" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 17.6 — When a deploy lies</span><span class="lc-sub">Stale builds, smoke tests, rollback</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-20-2-env-next-public" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 20.2 — Env vars and NEXT_PUBLIC</span><span class="lc-sub">What else is frozen at build</span></span></a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Run <code>next build</code> and read the output: the route table and which routes are static vs dynamic.</li>
<li>Run <code>next start</code> and confirm it serves the built output (production), unlike <code>dev</code>.</li>
<li>Break something that only fails in build (a type error dev tolerated) and see the build catch it.</li>
</ol>
<p><strong>Done when:</strong> you can produce a production build and explain why it, not dev, is the source of truth.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">next build</span><span class="v">Produces the optimised production output and type-checks.</span></div>
  <div class="kv"><span class="k">next start</span><span class="v">Serves the built output — this is production.</span></div>
  <div class="kv"><span class="k">Route table</span><span class="v">The list of routes and their static/dynamic status in the build.</span></div>
  <div class="kv"><span class="k">Static vs dynamic</span><span class="v">The build decides how each route is rendered.</span></div>
  <div class="kv"><span class="k">Dev vs build</span><span class="v">Dev is lenient and slow; the build is the source of truth.</span></div>
  <div class="kv"><span class="k">Standalone output</span><span class="v">A self-contained server bundle for deployment.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>next build</code> produces the optimised, type-checked production output; <code>next start</code> serves it.</li><li>The build prints a route table showing which routes are static and which are dynamic.</li><li>Dev is lenient and slow — the build is the source of truth for what ships.</li><li>Reproduce any pre-deploy surprise with <code>build</code> + <code>start</code>, not dev.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/deploying" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Deploying</span><span class="lc-sub">Production builds, self-hosting, Docker, and hosting options.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 20 · Bài 20.1 · Khép khoá</span>
<h2>Từ "chạy trên máy tôi" tới "chạy cho cả thế giới"</h2>
<p class="lead">Suốt khoá bạn chạy <code>npm run dev</code> — server phát triển, dựng cho sửa nhanh với reload tức thì. Đó không phải thứ người dùng thật nhận. <strong>Deploy</strong> nghĩa là đặt app của bạn lên một server trên internet để ai cũng vào được. Bước đầu là hiểu hai lệnh production.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">npm run dev</span><span class="v">Chế độ phát triển. Biên dịch lại khi bạn sửa, hiện lỗi chi tiết, cố tình <em>không</em> tối ưu. Chỉ cho bạn, lúc đang dựng. Đừng bao giờ phục vụ người dùng bằng cái này.</span></div>
  <div class="kv"><span class="k">next build</span><span class="v">Tạo <em>bản build production</em> đã tối ưu: nó biên dịch, minify, chẻ code, pre-render trang tĩnh, và tạo một thư mục <code>.next</code> sẵn chạy. Bạn chạy cái này một lần mỗi bản phát hành.</span></div>
  <div class="kv"><span class="k">next start</span><span class="v">Chạy bản build production bạn vừa tạo. Đây là server người dùng thật chạm. Nhanh, tối ưu, không có đồ nghề dev.</span></div>
</div>

<h3>Vòng đời, từ đầu tới cuối</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">Bạn viết code và test cục bộ với <code>npm run dev</code>.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><code>next build</code> biến nguồn của bạn thành một bản build tối ưu (trang tĩnh, các bundle từ Chương 18, mọi thứ quyết ở đây).</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">Bản build được chép tới một server, nơi <code>next start</code> (hoặc một container) phục vụ nó cho khách.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb">Bản phát hành mới? Build lại, ship lại. Production luôn chạy một <em>bản build</em>, không bao giờ nguồn thô của bạn.</div></div>
</div>

<div class="callout warn">
<p><strong>Ý quan trọng nhất chương này:</strong> production chạy <em>bản build</em>, không phải file nguồn của bạn. Rất nhiều bug production khó hiểu tới từ khoảng cách này — một thứ đúng trong nguồn nhưng đã bị quyết lúc build và đóng băng (biến env của bài sau, trang tĩnh từ Chương 17). "Chạy ở dev mà không chạy ở production" gần như luôn nghĩa là: dev đọc lại nguồn của bạn trực tiếp; production đang phục vụ một bản build được tạo ở một thời điểm cụ thể. Giữ phân biệt đó trong đầu và một nửa bí ẩn deploy tan biến.</p>
</div>

<h3>Ba lệnh, và mỗi lệnh dùng để làm gì</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>next dev</b> — Biên dịch theo yêu cầu, nạp nóng, ship mã chưa nén với React bản phát triển. Đừng bao giờ chạy cái này trên production.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>next build</b> — Kiểm kiểu, đóng gói, và dựng sẵn mọi route tĩnh (Next.js 16 không còn chạy lint trong build — hãy tự chạy ESLint hoặc chạy trong CI). Nó in ra bảng route — câu trả lời có thẩm quyền duy nhất về việc cái gì là tĩnh.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>next start</b> — Phục vụ thứ mà &#96;build&#96; đã tạo ra. Nó không biên dịch gì cả. Không có đầu ra build thì nó in “✓ Ready” rồi mới thoát (đo bên dưới); còn với bản build <em>cũ</em> thì nó chẳng hỏng gì — nó lặng lẽ phục vụ bản phát hành cũ.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nên cặp đôi đó chính là lần deploy</b> — Build, rồi start. Một lần deploy chỉ khởi động lại tiến trình là đang chạy bản build trước đó.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một lần deploy khởi động lại container mà không dựng lại.</strong> Tiến trình sống lại, phép kiểm sức khoẻ qua, và nó đang phục vụ bản build trước đó — nên bản sửa của bạn không có ở đó, và cái route bạn vừa thêm trả về 404. Nó trông như mã chưa được push. Lịch sử của chính kho này có đúng chuyện đó: một lần deploy &#96;--no-build&#96; để production chạy một thư mục &#96;dist/&#96; cũ chưa từng gắn route mới, và triệu chứng bị chẩn đoán nhầm thành vấn đề dữ liệu suốt mấy tiếng. Phép kiểm đáng tin là một lệnh &#96;curl&#96; không xác thực vào một route chỉ bản build mới có: 404 nghĩa là build cũ, 401 hay 200 nghĩa là nó đang sống.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/next-cli" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Tra cứu CLI</span><span class="lc-sub">Mọi lệnh và cờ, gồm cả việc build thật sự làm gì.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/deploying" target="_blank" rel="noopener">
  <span class="lc-ico">🚢</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Triển khai</span><span class="lc-sub">Các hình thức triển khai được hỗ trợ, và mỗi cái cần đầu ra build nào.</span></span>
</a>


<h3>🔬 Đo thật: build, start, và khoảng hở giữa chúng (Next.js 16.4.6 · máy của khoá)</h3>
<p><strong>1 · next build</strong> — biên dịch, TypeScript, dựng trang tĩnh, bảng route — và không có bước lint:</p>
<div class="out">$ npm run build
▲ Next.js 16.4.6 (Turbopack)
  Creating an optimized production build ...
✓ Compiled successfully in 9.0s
  Running TypeScript ...
  Finished TypeScript in 1436ms ...
  Collecting page data using 9 workers ...
✓ Generating static pages using 9 workers (11/11) in 162ms
  Finalizing page optimization ...
ƒ /gio
○ /ver
real 12.03
$ du -sh .next | awk '{print ".next: " $1}'; ls .next | tr '\\n' ' '; echo
.next: 33M
app-path-routes-manifest.json build BUILD_ID build-manifest.json cache diagnostics export-marker.json fallback-build-manifest.json images-manifest.json next-minimal-server.js.nft.json next-server.js.nft.json package.json prerender-manifest.json required-server-files.js required-server-files.json routes-manifest.json server static trace trace-build turbopack types </div>
<p><strong>2 · next start khi chưa build</strong> — log nói Ready; địa chỉ nói chẳng có gì ở đó:</p>
<div class="out">$ npx next start -p 3000   # no build yet
- Network:       http://127.0.0.1:19341
✓ Ready in 113ms

✓ Running next.config.ts took 22ms
Error: Could not find a production build in the '.next' directory. Try building your app with 'next build' before starting the production server. https://nextjs.org/docs/messages/production-start-no-build-id
    at ignore-listed frames
$ curl -s -o /dev/null -w '%{http_code}' localhost:3000/ver
HTTP 000
Error: Could not find a production build in the '.next' directory. Try building your app with 'next build' before starting the production server. https://nextjs</div>
<p><strong>3 · Production chạy bản build, không chạy mã nguồn</strong> — sửa nguồn thành v2 rồi khởi động lại: vẫn v1, cho tới khi build thật:</p>
<div class="out">$ curl -s http://127.0.0.1:19341/ver | grep -o 'Release v[0-9]' | head -1
Release v1
$ sed -i 's/Release v1/Release v2/' src/app/ver/page.tsx   # change the SOURCE, restart, no build
source: Release v2
$ curl -s localhost:3000/ver | grep -o 'Release v[0-9]'   # after restart
Release v1
$ npm run build &amp;&amp; npx next start   # after a real build
Release v2</div>
<p><strong>4 · Lỗi kiểu mà dev phục vụ còn build từ chối</strong>:</p>
<pre><code class="language-typescript">const total: number = 'one hundred';</code></pre>
<div class="out">$ npm run dev   →   curl localhost:3000/sai
next dev /sai → HTTP 200
Total: one hundred
$ npm run build
✓ Compiled successfully in 569ms
src/app/sai/page.tsx(3,9): error TS2322: Type 'string' is not assignable to type 'number'.
Failed to type check.</div>
<p><strong>5 · Dev là một chương trình khác</strong> — cùng một trang động:</p>
<div class="out">$ for s in "next start" "next dev"; do curl -w '%{time_total}' …/gio (first, second); done
next start /gio: 1st 46 ms · 2nd 7 ms
next dev   /gio: 1st 2894 ms · 2nd 29 ms
$ ps -o rss= -p &lt;pid&gt;   # memory of each server
next start RSS 102 MB
next dev   RSS 502 MB</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ grep -n "output: 'standalone'" frontend/next.config.js; grep -nE '^RUN npm run build|^CMD ' frontend/Dockerfile
6:  output: 'standalone',
140:RUN npm run build
175:CMD ["node", "server.js"]
$ grep -n 'Smoke-testing core API routes' deploy.sh deploy-nha.sh | head -3
deploy.sh:1010:info "Smoke-testing core API routes are mounted..."
$ grep -n '2026-07-02 | GIF picker dead' CLAUDE.md | cut -c1-160
817:| 2026-07-02 | GIF picker dead + "chats disappearing" together, survived re-login. Root cause: prod ran a **stale &#96;dist/index.js&#96;** that never mounted &#96;/api</div>Ảnh chạy <code>npm run build</code> một lần (đầu ra standalone); container chạy <code>node server.js</code>. Sau sự cố build cũ 02/07/2026, script deploy smoke-test các tuyến chính và hỏng ngay khi gặp 404.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">rm -rf .next &amp;&amp; npx next start -p 3000      <span class="tok-comment">  # đọc log, rồi curl</span>
curl -s -o /dev/null -w "%{http_code}\\n" localhost:3000/
npm run build &amp;&amp; npx next start -p 3000
<span class="tok-comment"># sửa một trang, khởi động lại KHÔNG build, curl lại — rồi build và so</span></code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">“Đẩy bản sửa rồi mà không thấy” — máy chủ khởi động lại trên <code>.next/</code> cũ; không ai chạy build.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">…bạn phục vụ người dùng bằng <code>next dev</code>? Khoảng 5× bộ nhớ, lần mở đầu tính bằng giây, React bản dev cho mọi người.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Một máy chủ dev trên cổng công khai để lộ dấu vết lỗi kèm đường dẫn tệp và source map — tấm bản đồ mã nguồn miễn phí.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Build ở máy trước mỗi lần deploy; production chạy <code>next start</code> (hoặc <code>node server.js</code>); smoke-test bằng địa chỉ, không bằng dòng log.</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-17-2-tinh-vs-dong" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 17.2 — Tĩnh vs động</span><span class="lc-sub">Được quyết lúc build</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-17-6-deploy-hong-quay-lui" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 17.6 — Khi deploy nói dối</span><span class="lc-sub">Build cũ, smoke test, quay lui</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-20-2-env-next-public" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 20.2 — Biến môi trường và NEXT_PUBLIC</span><span class="lc-sub">Thứ khác bị đóng băng lúc build</span></span></a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>next build</code> và đọc output: bảng route và route nào tĩnh vs động.</li>
<li>Chạy <code>next start</code> và xác nhận nó phục vụ bản đã build (production), khác <code>dev</code>.</li>
<li>Làm hỏng một thứ chỉ lỗi lúc build (một lỗi kiểu mà dev bỏ qua) và thấy build bắt nó.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tạo được một bản build production và giải thích vì sao nó, không phải dev, là nguồn sự thật.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">next build</span><span class="v">Tạo bản production tối ưu và kiểm kiểu.</span></div>
  <div class="kv"><span class="k">next start</span><span class="v">Phục vụ bản đã build — đây là production.</span></div>
  <div class="kv"><span class="k">Bảng route</span><span class="v">Danh sách route và trạng thái tĩnh/động của chúng trong build.</span></div>
  <div class="kv"><span class="k">Tĩnh vs động</span><span class="v">Build quyết định mỗi route render thế nào.</span></div>
  <div class="kv"><span class="k">Dev vs build</span><span class="v">Dev dễ tính và chậm; build là nguồn sự thật.</span></div>
  <div class="kv"><span class="k">Output standalone</span><span class="v">Một bundle server tự-chứa để deploy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>next build</code> tạo bản production tối ưu, đã kiểm kiểu; <code>next start</code> phục vụ nó.</li><li>Build in ra một bảng route cho thấy route nào tĩnh và route nào động.</li><li>Dev dễ tính và chậm — build là nguồn sự thật cho cái được ship.</li><li>Tái hiện mọi bất ngờ trước-deploy bằng <code>build</code> + <code>start</code>, không phải dev.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/deploying" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Deploying</span><span class="lc-sub">Bản build production, tự-host, Docker, và các lựa chọn hosting.</span></span>
</a>
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-14-1-build" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 14.1 — What a production build does</span><span class="lc-sub">Dev 225 KB vs build 1.4 KB, measured; bundle, minify, tree-shake, hash</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-14-1-build" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 14.1 — Bản dựng production làm gì</span><span class="lc-sub">Dev 225 KB so với build 1,4 KB, đo thật; gộp gói, thu gọn, rung cây, băm tên</span></span>
  <span class="lc-cta">Mở bài</span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 20.2 ─────────────────────────── */
    {
      title: '20.2 — Environment variables and the NEXT_PUBLIC trap|||20.2 — Biến môi trường và bẫy NEXT_PUBLIC',
      slug: 'nextjs-20-2-env-next-public',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Biến môi trường (env) giữ cấu hình và bí mật ngoài code. Trong Next có hai loại rất khác: env server (bí mật, đọc lúc chạy) và NEXT_PUBLIC_ (công khai, NƯỚNG VÀO lúc build). Nhầm là lộ khoá hoặc "đổi mà không thấy đổi".',
      content: `
${G20_2}
<div class="ml-en">
<span class="eyebrow">Chapter 20 · Lesson 20.2</span>
<h2>Config and secrets live in environment variables — but there are two kinds</h2>
<p class="lead">An <strong>environment variable</strong> (env var) is a setting kept outside your code — a database URL, an API key, a feature flag — so the same code can run in dev and production with different values, and secrets never sit in your source. In Next.js there are two very different kinds, and confusing them causes real bugs.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Server-only env (e.g. DATABASE_URL)</span><span class="v">Read only on the server — at <em>runtime</em> on a dynamic page, but <em>once, at build time</em> on a static (○) page, where the value is frozen into the HTML (measured below). The browser never sees it. This is where secrets belong — API keys, DB passwords.</span></div>
  <div class="kv"><span class="k">NEXT_PUBLIC_* (e.g. NEXT_PUBLIC_SITE_URL)</span><span class="v">Prefixed with <code>NEXT_PUBLIC_</code>. These are <em>baked into the JavaScript bundle at build time</em> and shipped to the browser. Public by definition — anyone can read them in the client code.</span></div>
</div>

<h3>Two consequences that trip everyone up</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>NEXT_PUBLIC vars are frozen at build.</b> Changing one and just restarting the server does nothing — the old value is already baked into the bundle. You must <em>rebuild</em>. (This is the "production runs the build" idea from 20.1, made concrete.)</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>NEXT_PUBLIC vars are public.</b> Anything with that prefix ends up readable in the browser. Never, ever put a secret key behind <code>NEXT_PUBLIC_</code>.</div></div>
</div>

<div class="note-ct">
<p><strong>A real cuongthai.com bug that hit both at once.</strong> The GIF picker called a third-party API (GIPHY) directly from the browser using a <code>NEXT_PUBLIC_GIPHY_API_KEY</code>. Two problems collided: the key was baked in at <em>build</em> time, so when the env was missing at build the client silently fell back to a revoked public key and got HTTP 403; and putting a third-party key in a <code>NEXT_PUBLIC_</code> var shipped it to the browser in the first place. The fix set the rule the project now follows: <strong>browser-facing third-party APIs go through a small backend proxy</strong> — the key stays a server-side runtime env var (no rebuild to rotate it, never in the client bundle), and the browser calls your own endpoint instead. Two takeaways: third-party keys are never <code>NEXT_PUBLIC_</code>; and changing a <code>NEXT_PUBLIC_</code> value requires a rebuild, not a restart.</p>
</div>

<div class="callout warn">
<p><strong>Where env values live in production matters too.</strong> On a self-hosted setup, production env vars live on the server (for cuongthai.com, in a file the deploy script loads every deploy). If you add a var while a deploy is already running, that deploy loaded env <em>before</em> your change — you must recreate the container or redeploy for it to take effect. Again: the running process captured a snapshot; changing the source of the snapshot later does not update what is already running.</p>
</div>

<h3>Environment variables, and which ones reach the browser</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Server-only by default</b> — &#96;process.env.DATABASE_URL&#96; in a Server Component or an action never leaves the server. This is the safe default.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>NEXT_PUBLIC_ ships to the client</b> — The prefix is the opt-in. The value is substituted into the JavaScript bundle, where any visitor can read it.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Public variables are baked at build time</b> — Not read at startup. Changing one requires a rebuild, not a restart — a restart appears to do nothing.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Add it in three places</b> — Local &#96;.env&#96;, &#96;.env.example&#96;, and the deployment environment. Missing the third is the most common deploy failure there is.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a third-party API key with the &#96;NEXT_PUBLIC_&#96; prefix.</strong> It fixes the &quot;undefined&quot; error instantly, and it publishes the key: the value is substituted into a JavaScript file that every visitor downloads, and bots scrape those files continuously. This exact failure is in this repo&#39;s history — a GIPHY key shipped in the client bundle, which then fell back to a revoked public key and started returning 403. The fix recorded there is the general one: put the key in a server-side environment variable and add a small authenticated proxy route, so the key stays on the server and rotating it is a restart rather than a rebuild.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/configuring/environment-variables" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Environment variables</span><span class="lc-sub">Load order, the NEXT_PUBLIC rule, and build-time substitution.</span></span>
</a>
<a class="link-card dl" href="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">OWASP — Secrets management</span><span class="lc-sub">Where secrets belong, and what to do the moment one leaks.</span></span>
</a>


<h3>🔬 Measured: build with “Alpha”, start with “Beta” (Next.js 16.4.6 · Chromium)</h3>
<p>Four pages read <code>SHOP_NAME</code> / <code>NEXT_PUBLIC_SHOP_NAME</code>: a dynamic Server Component, a static one, a Client Component, and a client button using <code>NEXT_PUBLIC_PAY_KEY</code> (a fake lab key). Build with Alpha:</p>
<pre><code class="language-typescript">'use client';
<span class="tok-comment">// app/env/khach/Hi.tsx — a Client Component reads one public and one server-only var</span>
export default function Hi() {
  return (
    &lt;div&gt;
      &lt;p id="pub"&gt;NEXT_PUBLIC_SHOP_NAME = {process.env.NEXT_PUBLIC_SHOP_NAME}&lt;/p&gt;
      &lt;p id="srv"&gt;SHOP_NAME = {String(process.env.SHOP_NAME)}&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">$ SHOP_NAME=Alpha NEXT_PUBLIC_SHOP_NAME=Alpha NEXT_PUBLIC_PAY_KEY=pay_demo_K3Y_42 npm run build
✓ Compiled successfully in 1715ms
ƒ /env/dong
○ /env/key
○ /env/khach
○ /env/tinh</div>
<p>Start the <em>same build</em> with Beta:</p>
<div class="out">$ SHOP_NAME=Beta NEXT_PUBLIC_SHOP_NAME=Beta npx next start   # same build, NEW values at start
dynamic page · SHOP_NAME = Beta
static page · SHOP_NAME = Alpha
client page (HTML) · NEXT_PUBLIC_SHOP_NAME = Alpha
client page (HTML) · SHOP_NAME = Alpha
$ grep -rl … .next/static   # what ships to every browser?
"Alpha" in .next/static: 2 file(s)
"Beta" in .next/static: 0 file(s)
"pay_demo_K3Y_42" in .next/static: 1 file(s)
$ curl the page, find its JS chunks, grep them for the key
anyone can download: /_next/static/chunks/3ztadq6kq3r9l.js</div>
<p>Only the dynamic page says Beta. The static page froze the <em>server</em> variable at build. The Client Component&#39;s HTML says Alpha too — and in Chromium the same element says <code>undefined</code>, with <code>Minified React error #418</code> (hydration text mismatch): the browser has no server variables. And the public key is in a chunk any visitor can download.</p>
<p>Rebuild with Beta:</p>
<div class="out">$ SHOP_NAME=Beta NEXT_PUBLIC_SHOP_NAME=Beta npm run build &amp;&amp; npx next start   # REBUILD
dynamic page · SHOP_NAME = Beta
static page · SHOP_NAME = Beta
client page (HTML) · NEXT_PUBLIC_SHOP_NAME = Beta</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ grep -rhoE "NEXT_PUBLIC_[A-Z_]+" frontend/src | sort -u | wc -l | sed 's/^ */biến NEXT_PUBLIC_ khác nhau trong frontend\\/src: /'
biến NEXT_PUBLIC_ khác nhau trong frontend/src: 10
$ grep -n "use client\\|NEXT_PUBLIC_REVALIDATE_SECRET" frontend/src/app/admin/shop/page.tsx | head -2; grep -n "REVALIDATE_SECRET ??" frontend/src/app/api/revalidate/route.ts | head -1
1:'use client';
21:const REVALIDATE_SECRET = process.env.NEXT_PUBLIC_REVALIDATE_SECRET ?? '';
21:const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? '';
$ echo "frontend/Dockerfile ARG NEXT_PUBLIC_GIPHY_API_KEY: $(grep -c 'NEXT_PUBLIC_GIPHY_API_KEY' frontend/Dockerfile) dòng · dùng trong frontend/src: $(grep -rl NEXT_PUBLIC_GIPHY frontend/src | wc -l | tr -d ' ') tệp"
frontend/Dockerfile ARG NEXT_PUBLIC_GIPHY_API_KEY: 2 dòng · dùng trong frontend/src: 0 tệp</div>A <code>&#39;use client&#39;</code> admin page reads <code>NEXT_PUBLIC_REVALIDATE_SECRET</code>: if that variable is ever set at build, the secret ships inside that page&#39;s JavaScript. The Dockerfile also still passes <code>NEXT_PUBLIC_GIPHY_API_KEY</code>, which no source file uses since the GIF proxy.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">SHOP_NAME=Alpha NEXT_PUBLIC_SHOP_NAME=Alpha npm run build
SHOP_NAME=Beta NEXT_PUBLIC_SHOP_NAME=Beta npx next start <span class="tok-comment">  # curl a ○ page and a ƒ page</span>
grep -rl "&lt;your-secret&gt;" .next/static                   <span class="tok-comment">  # must print nothing</span></code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">“I changed the env and restarted” — only dynamic pages notice; static pages and the JS keep the build&#39;s value.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">…a public variable is missing at build? It becomes <code>undefined</code> in the JS — the GIPHY 403 of 02/07/2026.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">Bots download <code>/_next/static/**/*.js</code> and grep for keys and tokens. <code>NEXT_PUBLIC_</code> means published.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Secrets server-only behind a proxy route; grep the build output before deploying; rotate any key that ever shipped.</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/docker/learn?lessonSlug=dk-4-4-arg-env" target="_blank" rel="noopener"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Docker · 4.4 — ARG and ENV</span><span class="lc-sub">Build time vs run time, in images</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-9-4-props-serialize" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 9.4 — Props across the boundary</span><span class="lc-sub">Pass the value, not the variable</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-20-3-docker" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 20.3 — Docker</span><span class="lc-sub">NEXT_PUBLIC_ as build arguments</span></span></a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Add a server-only env var and read it in a Server Component; confirm it is NOT in the browser bundle.</li>
<li>Add a <code>NEXT_PUBLIC_</code> var, use it in a client component, and confirm it is baked into the bundle at build time.</li>
<li>Change a <code>NEXT_PUBLIC_</code> value and prove it only takes effect after a rebuild, not a restart.</li>
</ol>
<p><strong>Done when:</strong> you can tell server env from NEXT_PUBLIC env and know NEXT_PUBLIC is baked at build time.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Server env</span><span class="v">Secrets read only on the server, never shipped to the client.</span></div>
  <div class="kv"><span class="k">NEXT_PUBLIC_</span><span class="v">Prefix that exposes a var to the browser bundle.</span></div>
  <div class="kv"><span class="k">Baked at build</span><span class="v"><code>NEXT_PUBLIC_</code> values are inlined at build time.</span></div>
  <div class="kv"><span class="k">Rebuild, not restart</span><span class="v">Changing a public var needs a rebuild to take effect.</span></div>
  <div class="kv"><span class="k">No secrets in client</span><span class="v">Never put secrets behind <code>NEXT_PUBLIC_</code>.</span></div>
  <div class="kv"><span class="k">Backend proxy</span><span class="v">Keep third-party keys server-side behind a proxy route.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Only <code>NEXT_PUBLIC_</code> vars reach the browser — everything else stays server-side.</li><li><code>NEXT_PUBLIC_</code> values are baked into the bundle at build time, so changing one needs a rebuild, not a restart.</li><li>Never expose a secret via <code>NEXT_PUBLIC_</code>; keep third-party keys behind a backend proxy route.</li><li>This is a real cuongthai.com trap — a missing public key baked at build broke the GIF picker.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/configuring/environment-variables" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Environment Variables</span><span class="lc-sub">Server vs NEXT_PUBLIC_, build-time inlining, and .env files.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 20 · Bài 20.2</span>
<h2>Cấu hình và bí mật sống trong biến môi trường — nhưng có hai loại</h2>
<p class="lead">Một <strong>biến môi trường</strong> (env var) là một thiết lập giữ ngoài code — một URL database, một khoá API, một cờ tính năng — để cùng một code chạy ở dev và production với giá trị khác nhau, và bí mật không bao giờ nằm trong nguồn. Trong Next.js có hai loại rất khác, và nhầm chúng gây bug thật.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Env chỉ-server (ví dụ DATABASE_URL)</span><span class="v">Chỉ đọc trên server — lúc <em>chạy</em> ở trang động, nhưng <em>một lần, lúc build</em> ở trang tĩnh (○), giá trị bị chốt vào HTML (đo bên dưới). Trình duyệt không bao giờ thấy nó. Đây là nơi bí mật thuộc về — khoá API, mật khẩu DB.</span></div>
  <div class="kv"><span class="k">NEXT_PUBLIC_* (ví dụ NEXT_PUBLIC_SITE_URL)</span><span class="v">Có tiền tố <code>NEXT_PUBLIC_</code>. Chúng bị <em>nướng vào bundle JavaScript lúc build</em> và gửi xuống trình duyệt. Công khai theo định nghĩa — ai cũng đọc được trong code client.</span></div>
</div>

<h3>Hai hệ quả khiến ai cũng vấp</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Biến NEXT_PUBLIC đóng băng lúc build.</b> Đổi một cái rồi chỉ khởi động lại server thì chẳng làm gì — giá trị cũ đã nướng vào bundle. Bạn phải <em>build lại</em>. (Đây là ý "production chạy bản build" ở 20.1, cụ thể hoá.)</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Biến NEXT_PUBLIC là công khai.</b> Bất cứ gì có tiền tố đó cuối cùng đọc được trong trình duyệt. Đừng bao giờ đặt một khoá bí mật sau <code>NEXT_PUBLIC_</code>.</div></div>
</div>

<div class="note-ct">
<p><strong>Một bug thật của cuongthai.com dính cả hai cùng lúc.</strong> Bộ chọn GIF gọi một API bên thứ ba (GIPHY) thẳng từ trình duyệt bằng một <code>NEXT_PUBLIC_GIPHY_API_KEY</code>. Hai vấn đề đụng nhau: khoá bị nướng vào lúc <em>build</em>, nên khi env thiếu lúc build client âm thầm rơi về một khoá công khai đã bị thu hồi và nhận HTTP 403; và đặt một khoá bên thứ ba trong một biến <code>NEXT_PUBLIC_</code> đã gửi nó xuống trình duyệt ngay từ đầu. Cách sửa đặt ra quy tắc dự án nay theo: <strong>API bên thứ ba hướng-trình-duyệt đi qua một proxy backend nhỏ</strong> — khoá ở lại là một env runtime phía server (không phải build lại để xoay nó, không bao giờ trong bundle client), và trình duyệt gọi endpoint của chính bạn thay vì thế. Hai điều rút ra: khoá bên thứ ba không bao giờ là <code>NEXT_PUBLIC_</code>; và đổi một giá trị <code>NEXT_PUBLIC_</code> cần build lại, không phải khởi động lại.</p>
</div>

<div class="callout warn">
<p><strong>Nơi giá trị env sống ở production cũng quan trọng.</strong> Trên một bố trí tự-host, biến env production sống trên server (với cuongthai.com, trong một file mà script deploy nạp mỗi lần deploy). Nếu bạn thêm một biến trong khi một deploy đang chạy, deploy đó đã nạp env <em>trước</em> thay đổi của bạn — bạn phải tạo lại container hoặc deploy lại để nó có hiệu lực. Lại là: tiến trình đang chạy đã chụp một ảnh; đổi nguồn của ảnh sau đó không cập nhật cái đang chạy.</p>
</div>

<h3>Biến môi trường, và cái nào tới được trình duyệt</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Mặc định là chỉ-máy-chủ</b> — &#96;process.env.DATABASE_URL&#96; trong một Server Component hay một action chẳng bao giờ rời khỏi máy chủ. Đây là mặc định an toàn.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>NEXT_PUBLIC_ thì đi tới client</b> — Cái tiền tố chính là phép đồng ý. Giá trị được thay thẳng vào gói JavaScript, nơi mọi khách đều đọc được.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Biến công khai được nướng sẵn lúc build</b> — Không phải đọc lúc khởi động. Đổi một cái đòi phải dựng lại, chứ không phải khởi động lại — khởi động lại trông như chẳng làm gì cả.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Thêm nó ở ba chỗ</b> — File &#96;.env&#96; ở máy, &#96;.env.example&#96;, và môi trường triển khai. Thiếu chỗ thứ ba là nguyên nhân hỏng deploy phổ biến nhất.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một khoá API của bên thứ ba mang tiền tố &#96;NEXT_PUBLIC_&#96;.</strong> Nó chữa cái lỗi &quot;undefined&quot; ngay tức thì, và nó CÔNG BỐ cái khoá: giá trị được thay thẳng vào một file JavaScript mà mọi khách đều tải về, và bot quét những file đó liên tục. Đúng cú hỏng này có trong lịch sử kho này — một khoá GIPHY ship trong gói phía client, rồi rơi về một khoá công khai đã bị thu hồi và bắt đầu trả 403. Cách chữa được ghi lại ở đó cũng là cách chữa tổng quát: đặt khoá vào một biến môi trường phía máy chủ và thêm một route proxy nhỏ có xác thực, để khoá ở lại máy chủ và việc xoay khoá chỉ là một lần khởi động lại chứ không phải một lần dựng lại.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/configuring/environment-variables" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Biến môi trường</span><span class="lc-sub">Thứ tự nạp, luật NEXT_PUBLIC, và phép thay thế lúc build.</span></span>
</a>
<a class="link-card dl" href="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">OWASP — Quản lý bí mật</span><span class="lc-sub">Bí mật thuộc về đâu, và phải làm gì ngay khi một cái bị rò.</span></span>
</a>


<h3>🔬 Đo thật: build với “Alpha”, chạy với “Beta” (Next.js 16.4.6 · Chromium)</h3>
<p>Bốn trang đọc <code>SHOP_NAME</code> / <code>NEXT_PUBLIC_SHOP_NAME</code>: một Server Component động, một tĩnh, một Client Component, và một nút client dùng <code>NEXT_PUBLIC_PAY_KEY</code> (khoá giả của lab). Build với Alpha:</p>
<pre><code class="language-typescript">'use client';
<span class="tok-comment">// app/env/khach/Hi.tsx — a Client Component reads one public and one server-only var</span>
export default function Hi() {
  return (
    &lt;div&gt;
      &lt;p id="pub"&gt;NEXT_PUBLIC_SHOP_NAME = {process.env.NEXT_PUBLIC_SHOP_NAME}&lt;/p&gt;
      &lt;p id="srv"&gt;SHOP_NAME = {String(process.env.SHOP_NAME)}&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">$ SHOP_NAME=Alpha NEXT_PUBLIC_SHOP_NAME=Alpha NEXT_PUBLIC_PAY_KEY=pay_demo_K3Y_42 npm run build
✓ Compiled successfully in 1715ms
ƒ /env/dong
○ /env/key
○ /env/khach
○ /env/tinh</div>
<p>Chạy <em>cùng bản build</em> với Beta:</p>
<div class="out">$ SHOP_NAME=Beta NEXT_PUBLIC_SHOP_NAME=Beta npx next start   # same build, NEW values at start
dynamic page · SHOP_NAME = Beta
static page · SHOP_NAME = Alpha
client page (HTML) · NEXT_PUBLIC_SHOP_NAME = Alpha
client page (HTML) · SHOP_NAME = Alpha
$ grep -rl … .next/static   # what ships to every browser?
"Alpha" in .next/static: 2 file(s)
"Beta" in .next/static: 0 file(s)
"pay_demo_K3Y_42" in .next/static: 1 file(s)
$ curl the page, find its JS chunks, grep them for the key
anyone can download: /_next/static/chunks/3ztadq6kq3r9l.js</div>
<p>Chỉ trang động nói Beta. Trang tĩnh đã chốt biến <em>server</em> lúc build. HTML của Client Component cũng nói Alpha — còn trong Chromium chính phần tử đó ra <code>undefined</code>, kèm <code>Minified React error #418</code> (lệch chữ khi hydrate): trình duyệt không có biến server nào. Và khoá công khai nằm trong một chunk mà người truy cập nào cũng tải được.</p>
<p>Build lại với Beta:</p>
<div class="out">$ SHOP_NAME=Beta NEXT_PUBLIC_SHOP_NAME=Beta npm run build &amp;&amp; npx next start   # REBUILD
dynamic page · SHOP_NAME = Beta
static page · SHOP_NAME = Beta
client page (HTML) · NEXT_PUBLIC_SHOP_NAME = Beta</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ grep -rhoE "NEXT_PUBLIC_[A-Z_]+" frontend/src | sort -u | wc -l | sed 's/^ */biến NEXT_PUBLIC_ khác nhau trong frontend\\/src: /'
biến NEXT_PUBLIC_ khác nhau trong frontend/src: 10
$ grep -n "use client\\|NEXT_PUBLIC_REVALIDATE_SECRET" frontend/src/app/admin/shop/page.tsx | head -2; grep -n "REVALIDATE_SECRET ??" frontend/src/app/api/revalidate/route.ts | head -1
1:'use client';
21:const REVALIDATE_SECRET = process.env.NEXT_PUBLIC_REVALIDATE_SECRET ?? '';
21:const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? '';
$ echo "frontend/Dockerfile ARG NEXT_PUBLIC_GIPHY_API_KEY: $(grep -c 'NEXT_PUBLIC_GIPHY_API_KEY' frontend/Dockerfile) dòng · dùng trong frontend/src: $(grep -rl NEXT_PUBLIC_GIPHY frontend/src | wc -l | tr -d ' ') tệp"
frontend/Dockerfile ARG NEXT_PUBLIC_GIPHY_API_KEY: 2 dòng · dùng trong frontend/src: 0 tệp</div>Một trang quản trị <code>&#39;use client&#39;</code> đọc <code>NEXT_PUBLIC_REVALIDATE_SECRET</code>: nếu biến đó từng được đặt lúc build, bí mật sẽ nằm trong JavaScript của trang đó. Dockerfile cũng vẫn truyền <code>NEXT_PUBLIC_GIPHY_API_KEY</code>, thứ không tệp nguồn nào dùng nữa từ khi có proxy GIF.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">SHOP_NAME=Alpha NEXT_PUBLIC_SHOP_NAME=Alpha npm run build
SHOP_NAME=Beta NEXT_PUBLIC_SHOP_NAME=Beta npx next start <span class="tok-comment">  # curl một trang ○ và một trang ƒ</span>
grep -rl "&lt;your-secret&gt;" .next/static                   <span class="tok-comment">  # phải không in gì</span></code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">“Đổi env rồi khởi động lại” — chỉ trang động thấy; trang tĩnh và JS giữ giá trị lúc build.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">…một biến công khai thiếu lúc build? Nó thành <code>undefined</code> trong JS — sự cố GIPHY 403 ngày 02/07/2026.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Bot tải <code>/_next/static/**/*.js</code> rồi grep tìm khoá và token. <code>NEXT_PUBLIC_</code> nghĩa là đã công bố.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Bí mật chỉ ở server sau một tuyến proxy; grep đầu ra build trước khi deploy; đổi ngay khoá nào từng bị gửi đi.</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/docker/learn?lessonSlug=dk-4-4-arg-env" target="_blank" rel="noopener"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Docker · 4.4 — ARG và ENV</span><span class="lc-sub">Lúc dựng so với lúc chạy, trong ảnh</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-9-4-props-serialize" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 9.4 — Props qua ranh giới</span><span class="lc-sub">Truyền giá trị, không truyền biến</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-20-3-docker" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 20.3 — Docker</span><span class="lc-sub">NEXT_PUBLIC_ là tham số lúc dựng</span></span></a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm một env var chỉ-server và đọc nó trong một Server Component; xác nhận nó KHÔNG có trong bundle trình duyệt.</li>
<li>Thêm một var <code>NEXT_PUBLIC_</code>, dùng nó trong một client component, và xác nhận nó được bake vào bundle lúc build.</li>
<li>Đổi một giá trị <code>NEXT_PUBLIC_</code> và chứng minh nó chỉ có hiệu lực sau một lần build lại, không phải restart.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn phân biệt được env server với env NEXT_PUBLIC và biết NEXT_PUBLIC bị bake lúc build.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Env server</span><span class="v">Secret chỉ đọc trên server, không bao giờ gửi tới client.</span></div>
  <div class="kv"><span class="k">NEXT_PUBLIC_</span><span class="v">Tiền tố lộ một var ra bundle trình duyệt.</span></div>
  <div class="kv"><span class="k">Bake lúc build</span><span class="v">Giá trị <code>NEXT_PUBLIC_</code> được inline lúc build.</span></div>
  <div class="kv"><span class="k">Build lại, không restart</span><span class="v">Đổi một var public cần build lại mới có hiệu lực.</span></div>
  <div class="kv"><span class="k">Không secret ở client</span><span class="v">Đừng bao giờ đặt secret sau <code>NEXT_PUBLIC_</code>.</span></div>
  <div class="kv"><span class="k">Proxy backend</span><span class="v">Giữ khoá bên thứ ba phía server sau một route proxy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Chỉ var <code>NEXT_PUBLIC_</code> mới tới trình duyệt — mọi thứ khác ở lại phía server.</li><li>Giá trị <code>NEXT_PUBLIC_</code> bị bake vào bundle lúc build, nên đổi một cái cần build lại, không phải restart.</li><li>Đừng bao giờ lộ secret qua <code>NEXT_PUBLIC_</code>; giữ khoá bên thứ ba sau một route proxy backend.</li><li>Đây là một bẫy thật của cuongthai.com — một khoá public thiếu bị bake lúc build làm hỏng trình chọn GIF.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/configuring/environment-variables" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Environment Variables</span><span class="lc-sub">Server vs NEXT_PUBLIC_, nướng lúc build, và file .env.</span></span>
</a>
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-14-2-env-secrets" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 14.2 — Environment variables and secrets</span><span class="lc-sub">A VITE_ secret found in the built bundle, fail-fast config, rotate before cleaning history</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-14-2-env-secrets" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 14.2 — Biến môi trường và bí mật</span><span class="lc-sub">Bí mật VITE_ nằm trong bundle đã dựng, cấu hình chết sớm, xoay khoá trước khi dọn lịch sử</span></span>
  <span class="lc-cta">Mở bài</span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 20.3 ─────────────────────────── */
    {
      title: '20.3 — Docker: packaging the app to run anywhere|||20.3 — Docker: đóng gói app để chạy ở đâu cũng được',
      slug: 'nextjs-20-3-docker',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Một container gói app CÙNG mọi thứ nó cần (Node, thư viện, bản build) thành một hộp chạy giống hệt trên mọi máy — hết cảnh "máy tôi chạy được". Dockerfile là công thức; standalone output làm image gọn.',
      content: `
${G20_3}
<div class="ml-en">
<span class="eyebrow">Chapter 20 · Lesson 20.3</span>
<h2>Ship the app and its whole environment as one box</h2>
<p class="lead">"It works on my machine" happens because your machine has the right Node version, the right libraries, the right settings — and the server might not. A <strong>container</strong> solves this: it packages your app <em>together with</em> everything it needs to run, into one sealed box that behaves identically everywhere. <strong>Docker</strong> is the standard tool for building and running these boxes.</p>

<h3>The shipping-container analogy</h3>
<p>Before shipping containers, cargo was loaded piece by piece and every port handled it differently. The standard steel container changed that: pack it once, and any ship, crane, or truck can move it without caring what is inside. A software container is the same idea — pack your app once, and any machine with Docker runs it the same way, no per-server surprises.</p>

<h3>The Dockerfile: a recipe for the box</h3>
<p>A <code>Dockerfile</code> is a step-by-step recipe telling Docker how to build your app's image (the box). For Next.js it roughly does: start from a Node base, install dependencies, run <code>next build</code>, and set the command to start the server.</p>
<pre><code><span class="tok-comment"># simplified — real Next Dockerfiles use multiple stages</span>
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
<span class="tok-comment"># install exact dependencies</span>
RUN npm ci
COPY . .
<span class="tok-comment"># next build → the production build</span>
RUN npm run build
<span class="tok-comment"># next start when the container runs (a Dockerfile has no end-of-line comments)</span>
CMD ["npm", "start"]</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">Image vs container</span><span class="v">The <em>image</em> is the built box (a template). A <em>container</em> is a running instance of that image. Build the image once, run many containers from it.</span></div>
  <div class="kv"><span class="k">Reproducible</span><span class="v">The same image runs the same on your laptop, a teammate's, and the server. No "works here, not there."</span></div>
  <div class="kv"><span class="k">Next standalone output</span><span class="v">Next can output a trimmed <em>standalone</em> build with only the files needed to run — a much smaller, faster Docker image. Enabled with <code>output: 'standalone'</code> in the config.</span></div>
</div>

<div class="callout ok">
<p><strong>Why cuongthai.com uses Docker:</strong> the site runs its Next.js frontend and its backend as containers on a VPS. Containerising means a deploy builds a fresh, self-contained image and swaps it in — the server never accumulates mismatched Node versions or half-installed packages. The whole app moves as one predictable box.</p>
</div>

<h3>A Next.js image that is small and correct</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Multi-stage build</b> — Dependencies, build, runtime. Only the last stage ships, so the toolchain and the source do not go to production.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Use output: 'standalone'</b> — Next traces exactly the files the server needs and copies them. The result is hundreds of megabytes smaller than the whole &#96;node_modules&#96;.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Copy the lockfile and npm ci</b> — Deterministic installs, and the layer caches until the lockfile changes.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Build-time args for NEXT_PUBLIC_</b> — They are baked in at build, so they must be present when the image is built, not when it starts.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a build that is green and an image that cannot run.</strong> Building the image against a base whose libc does not match the one the native dependencies were compiled for produces exactly this: the build succeeds, the push succeeds, the swap succeeds, and then the container restarts forever. This repo has the measured case — an image built from the wrong Dockerfile put glibc Prisma engines on a musl Alpine base, and the API returned 502 for seven minutes until the previous image was re-tagged. The lesson recorded there is the general one: <em>a green build does not mean a runnable image</em>. Run the container locally, hit a route, and only then push.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/next-config-js/output" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — output: 'standalone'</span><span class="lc-sub">What it traces, what it copies, and the caveats for static files.</span></span>
</a>
<a class="link-card dl" href="https://github.com/vercel/next.js/tree/canary/examples/with-docker" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Next.js — with-docker example</span><span class="lc-sub">The official multi-stage Dockerfile, kept current with each release.</span></span>
</a>


<div class="callout warn"><p><strong>Measured: the Dockerfile above, as it was first written with comments at the end of each line, builds — and the container never starts.</strong> Docker has no end-of-line comments: <code>CMD ["npm", "start"]   # …</code> is no longer valid JSON, so Docker falls back to the shell form and runs the whole line as a command. The comments are now on their own lines.</p>
<div class="out">$ docker build -f Dockerfile.simple -t nxj-simple .
built nxj-simple in 149 s
$ docker ps -a --filter name=nxj-simple-c --format '{{.Names}}: {{.Status}}'; docker logs nxj-simple-c 2&gt;&amp;1 | tail -1; docker inspect -f 'CMD as Docker read it: {{json .Config.Cmd}}' nxj-simple
nxj-simple-c: Exited (127) 6 seconds ago
/bin/sh: [npm,: not found
CMD as Docker read it: ["/bin/sh","-c","[\\"npm\\", \\"start\\"]       # next start when the container runs"]</div></div>
<h3>🔬 Measured: two Dockerfiles, one forgotten argument, two libcs (Docker Desktop 29.8 · node:22-alpine · Next.js 16.4.6)</h3>
<p><strong>1 · The fixed single-stage Dockerfile runs — and ships everything</strong>:</p>
<div class="out">$ S=$(date +%s); docker build -q -f Dockerfile.simple -t nxj-simple . &gt;/dev/null 2&gt;&amp;1 &amp;&amp; echo "rebuilt nxj-simple in $(( $(date +%s) - S )) s"; docker inspect -f 'CMD as Docker read it: {{json .Config.Cmd}}' nxj-simple
rebuilt nxj-simple in 58 s
CMD as Docker read it: ["npm","start"]
$ docker run -d --name nxj-simple-c -p 127.0.0.1:19344:3000 nxj-simple &gt;/dev/null; sleep 6; echo "19344 /ver: $(curl -s http://127.0.0.1:19344/ver | grep -o 'Release v[0-9]' | head -1)"; echo "nxj-simple-c: $(docker exec nxj-simple-c du -sh /app | cut -f1) in /app · $(docker exec nxj-simple-c sh -c 'ls node_modules | wc -l' | tr -d ' ') packages in node_modules"
19344 /ver: Release v1
nxj-simple-c: 851.6M in /app · 387 packages in node_modules
$ docker images --format '{{.Repository}}  {{.Size}}' | grep -E '^nxj-(simple|std) ' | sort
nxj-simple  1.84GB
nxj-std  331MB</div>
<p><strong>2 · Multi-stage + <code>output: &#39;standalone&#39;</code></strong>:</p>
<pre><code class="language-bash"><span class="tok-comment"># Dockerfile — multi-stage + output: 'standalone'</span>
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SHOP_NAME
ENV NEXT_PUBLIC_SHOP_NAME=$NEXT_PUBLIC_SHOP_NAME
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER node
CMD ["node", "server.js"]</code></pre>
<div class="out">$ docker build -t nxj-std --build-arg NEXT_PUBLIC_SHOP_NAME=Alpha .
built nxj-std in 118 s
$ docker build -t nxj-noarg .   # forgot the build arg
built nxj-noarg in 10 s (layers cached)
$ docker images --format '{{.Repository}}  {{.Size}}' | grep -E '^nxj-(simple|std|noarg) ' | sort
nxj-noarg  331MB
nxj-simple  1.84GB
nxj-std  331MB
$ for c in nxj-std-c; do echo "$c: $(docker exec $c du -sh /app | cut -f1) in /app · $(docker exec $c sh -c 'ls node_modules 2&gt;/dev/null | wc -l' | tr -d ' ') packages in node_modules"; done
nxj-std-c: 67.8M in /app · 12 packages in node_modules</div>
<p><strong>3 · NEXT_PUBLIC_ needs <code>--build-arg</code></strong> — port 19345 was built with <code>--build-arg NEXT_PUBLIC_SHOP_NAME=Alpha</code>; 19346 was built without it and started with <code>-e NEXT_PUBLIC_SHOP_NAME=Beta</code>:</p>
<div class="out">$ curl localhost:3002/env/khach   # image built WITHOUT the arg, container started with -e NEXT_PUBLIC_SHOP_NAME=Beta
19345: NEXT_PUBLIC_SHOP_NAME = Alpha
19346: NEXT_PUBLIC_SHOP_NAME = </div>
<p><strong>4 · alpine is musl, slim is glibc</strong>:</p>
<div class="out">$ for i in node:22-alpine node:22-slim; do echo "$i: glibc $(docker run --rm $i node -p 'process.report.getReport().header.glibcVersionRuntime || "none (musl)"')"; done
node:22-alpine: glibc none (musl)
node:22-slim: glibc 2.36
$ docker run --rm nxj-std sh -c 'ls node_modules/@next 2&gt;/dev/null; ls /app/node_modules/@next 2&gt;/dev/null' | head -3; docker run --rm nxj-simple sh -c 'ls node_modules/@next | grep swc'
env
env
swc-linux-arm64-gnu
swc-linux-arm64-musl</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ grep -n '^FROM' frontend/Dockerfile Dockerfile.backend | head -6
frontend/Dockerfile:10:FROM node:22-slim AS deps
frontend/Dockerfile:42:FROM node:22-slim AS builder
frontend/Dockerfile:145:FROM node:22-slim AS runner
Dockerfile.backend:7:FROM node:22-slim AS builder
Dockerfile.backend:92:FROM node:22-slim AS runner
$ grep -n 'build xanh không có' CLAUDE.md | cut -c1-140
280:thêm chốt kiểm libc ↔ engine **trước khi đẩy**. Bài học: *build xanh không có</div>Both images use <code>node:22-slim</code> (glibc) in every stage. On 18/08/2026 an image built on alpine carried a Prisma engine for glibc: build, push and swap were green, then the backend restarted forever (API 502 for seven minutes). The deploy script now checks libc ↔ engine before pushing.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">docker build -t app --build-arg NEXT_PUBLIC_SITE=… .
docker run -d --name app -p 3000:3000 app &amp;&amp; sleep 3
docker ps -a --filter name=app    <span class="tok-comment">  # Up, or Exited?</span>
docker logs app; curl -s -o /dev/null -w "%{http_code}\\n" localhost:3000/
docker images app                 <span class="tok-comment">  # size</span></code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">“It builds on CI” — and the container exits with 127, because nobody ran it before pushing.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">…you <code>COPY . .</code> without a <code>.dockerignore</code>? Source, tests and <code>.env</code> files end up inside the image.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">An image is an archive: <code>docker history</code> shows build arguments of a single-stage build, and layers keep files you deleted in a later step.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v"><code>.dockerignore</code>, multi-stage, <code>USER node</code>; run + curl before pushing; secrets injected at run time.</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/docker/learn?lessonSlug=dk-6-1-multi-stage" target="_blank" rel="noopener"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Docker · 6.1 — Multi-stage builds, done right</span><span class="lc-sub">The pattern in depth</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-17-1-anh-docker" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 17.1 — Docker image: 440MB to 58.8MB</span><span class="lc-sub">The same diet for a Node backend</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-20-4-vps-stale-build" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 20.4 — VPS and stale builds</span><span class="lc-sub">Shipping the image</span></span></a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Enable <code>output: 'standalone'</code> and build a multi-stage Dockerfile that copies the standalone server.</li>
<li>Build the image locally and run it, confirming the app serves on the expected port.</li>
<li>Note which env vars must be present at build vs at runtime (NEXT_PUBLIC at build, secrets at runtime).</li>
</ol>
<p><strong>Done when:</strong> you can containerise a Next.js app with a standalone multi-stage Docker build.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">output: standalone</span><span class="v">A self-contained server bundle ideal for Docker.</span></div>
  <div class="kv"><span class="k">Multi-stage build</span><span class="v">Build in one stage, copy only what runs into a small final image.</span></div>
  <div class="kv"><span class="k">Image</span><span class="v">The packaged app that runs the same anywhere.</span></div>
  <div class="kv"><span class="k">Build vs runtime env</span><span class="v">NEXT_PUBLIC at build; secrets injected at runtime.</span></div>
  <div class="kv"><span class="k">Layer caching</span><span class="v">Order Dockerfile steps so installs cache between builds.</span></div>
  <div class="kv"><span class="k">Small final image</span><span class="v">Copy only the standalone output, not the whole repo.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Set <code>output: 'standalone'</code> and use a multi-stage Dockerfile that copies only the standalone server.</li><li>A built image runs the same anywhere — this is how cuongthai.com deploys.</li><li><code>NEXT_PUBLIC_</code> vars must be present at build; secrets are injected at runtime.</li><li>Order Dockerfile steps for layer caching and keep the final image small.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/deploying#docker-image" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Docker</span><span class="lc-sub">The standalone output and the official Docker example.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 20 · Bài 20.3</span>
<h2>Gửi app cùng cả môi trường của nó như một cái hộp</h2>
<p class="lead">"Máy tôi chạy được" xảy ra vì máy bạn có đúng phiên bản Node, đúng thư viện, đúng thiết lập — và server có thể không. Một <strong>container</strong> giải điều này: nó gói app của bạn <em>cùng với</em> mọi thứ nó cần để chạy, thành một cái hộp kín hành xử y hệt ở mọi nơi. <strong>Docker</strong> là công cụ chuẩn để build và chạy những cái hộp này.</p>

<h3>Ví von container hàng hải</h3>
<p>Trước container vận chuyển, hàng được bốc từng món và mỗi cảng xử lý khác nhau. Chiếc container thép chuẩn đổi điều đó: đóng một lần, và bất kỳ tàu, cần cẩu, hay xe tải nào cũng chuyển được mà không cần biết bên trong là gì. Một container phần mềm cùng ý tưởng — đóng app một lần, và bất kỳ máy nào có Docker chạy nó cùng cách, không bất ngờ theo từng server.</p>

<h3>Dockerfile: công thức cho cái hộp</h3>
<p>Một <code>Dockerfile</code> là công thức từng-bước nói cho Docker biết cách build image (cái hộp) của app bạn. Với Next.js nó đại khái: bắt đầu từ một base Node, cài dependency, chạy <code>next build</code>, và đặt lệnh khởi động server.</p>
<pre><code><span class="tok-comment"># đơn giản hoá — Dockerfile Next thật dùng nhiều stage</span>
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
<span class="tok-comment"># cài đúng dependency</span>
RUN npm ci
COPY . .
<span class="tok-comment"># next build → bản build production</span>
RUN npm run build
<span class="tok-comment"># next start khi container chạy (Dockerfile không có chú thích cuối dòng)</span>
CMD ["npm", "start"]</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">Image vs container</span><span class="v"><em>Image</em> là cái hộp đã build (một khuôn). Một <em>container</em> là một bản đang chạy của image đó. Build image một lần, chạy nhiều container từ nó.</span></div>
  <div class="kv"><span class="k">Tái lập được</span><span class="v">Cùng image chạy giống nhau trên laptop bạn, của đồng đội, và server. Không "chạy đây, không chạy kia".</span></div>
  <div class="kv"><span class="k">Standalone output của Next</span><span class="v">Next có thể xuất một bản <em>standalone</em> gọn chỉ với file cần để chạy — một Docker image nhỏ và nhanh hơn nhiều. Bật bằng <code>output: 'standalone'</code> trong config.</span></div>
</div>

<div class="callout ok">
<p><strong>Vì sao cuongthai.com dùng Docker:</strong> site chạy frontend Next.js và backend của nó như các container trên một VPS. Container hoá nghĩa là một deploy build một image tươi, tự-chứa và tráo nó vào — server không bao giờ tích tụ phiên bản Node lệch hay package cài nửa chừng. Cả app di chuyển như một cái hộp đoán trước được.</p>
</div>

<h3>Một ảnh Next.js nhỏ và đúng</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Dựng nhiều tầng</b> — Phụ thuộc, build, runtime. Chỉ tầng cuối được ship, nên bộ công cụ và mã nguồn không lên production.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Dùng output: 'standalone'</b> — Next lần ra chính xác những file máy chủ cần rồi chép chúng. Kết quả nhỏ hơn cả thư mục &#96;node_modules&#96; hàng trăm megabyte.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Chép file lock rồi npm ci</b> — Cài đặt tất định, và cái tầng đó nằm trong đệm cho tới khi file lock đổi.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Đối số lúc build cho NEXT_PUBLIC_</b> — Chúng được nướng sẵn lúc build, nên chúng phải có mặt khi ảnh được DỰNG, không phải khi nó KHỞI ĐỘNG.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một bản build xanh và một cái ảnh không chạy nổi.</strong> Dựng ảnh trên một nền có libc không khớp với libc mà các phụ thuộc bản địa đã biên dịch cho sẽ cho ra đúng chuyện này: build xanh, đẩy xanh, tráo xanh, rồi container khởi động lại vô tận. Kho này có ca đo được — một ảnh dựng từ nhầm Dockerfile đã đặt engine Prisma bản glibc lên một nền Alpine dùng musl, và API trả 502 suốt bảy phút cho tới khi ảnh cũ được gắn nhãn lại. Bài học ghi ở đó cũng là bài học tổng quát: <em>build xanh không có nghĩa là ảnh chạy được</em>. Hãy chạy container ở máy, gọi thử một route, rồi mới đẩy.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/next-config-js/output" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — output: 'standalone'</span><span class="lc-sub">Nó lần ra cái gì, chép cái gì, và những lưu ý về file tĩnh.</span></span>
</a>
<a class="link-card dl" href="https://github.com/vercel/next.js/tree/canary/examples/with-docker" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Next.js — ví dụ with-docker</span><span class="lc-sub">Dockerfile nhiều tầng chính thức, được cập nhật theo từng bản phát hành.</span></span>
</a>


<div class="callout warn"><p><strong>Đo thật: Dockerfile ở trên, khi còn viết chú thích ở cuối mỗi dòng, build được — mà container không bao giờ khởi động.</strong> Dockerfile không có chú thích cuối dòng: <code>CMD ["npm", "start"]   # …</code> không còn là JSON hợp lệ, nên Docker lùi về dạng shell và chạy cả dòng như một lệnh. Giờ chú thích đã nằm trên dòng riêng.</p>
<div class="out">$ docker build -f Dockerfile.simple -t nxj-simple .
built nxj-simple in 149 s
$ docker ps -a --filter name=nxj-simple-c --format '{{.Names}}: {{.Status}}'; docker logs nxj-simple-c 2&gt;&amp;1 | tail -1; docker inspect -f 'CMD as Docker read it: {{json .Config.Cmd}}' nxj-simple
nxj-simple-c: Exited (127) 6 seconds ago
/bin/sh: [npm,: not found
CMD as Docker read it: ["/bin/sh","-c","[\\"npm\\", \\"start\\"]       # next start when the container runs"]</div></div>
<h3>🔬 Đo thật: hai Dockerfile, một tham số quên, hai thư viện C (Docker Desktop 29.8 · node:22-alpine · Next.js 16.4.6)</h3>
<p><strong>1 · Dockerfile một tầng đã sửa chạy được — và gửi đi mọi thứ</strong>:</p>
<div class="out">$ S=$(date +%s); docker build -q -f Dockerfile.simple -t nxj-simple . &gt;/dev/null 2&gt;&amp;1 &amp;&amp; echo "rebuilt nxj-simple in $(( $(date +%s) - S )) s"; docker inspect -f 'CMD as Docker read it: {{json .Config.Cmd}}' nxj-simple
rebuilt nxj-simple in 58 s
CMD as Docker read it: ["npm","start"]
$ docker run -d --name nxj-simple-c -p 127.0.0.1:19344:3000 nxj-simple &gt;/dev/null; sleep 6; echo "19344 /ver: $(curl -s http://127.0.0.1:19344/ver | grep -o 'Release v[0-9]' | head -1)"; echo "nxj-simple-c: $(docker exec nxj-simple-c du -sh /app | cut -f1) in /app · $(docker exec nxj-simple-c sh -c 'ls node_modules | wc -l' | tr -d ' ') packages in node_modules"
19344 /ver: Release v1
nxj-simple-c: 851.6M in /app · 387 packages in node_modules
$ docker images --format '{{.Repository}}  {{.Size}}' | grep -E '^nxj-(simple|std) ' | sort
nxj-simple  1.84GB
nxj-std  331MB</div>
<p><strong>2 · Nhiều tầng + <code>output: &#39;standalone&#39;</code></strong>:</p>
<pre><code class="language-bash"><span class="tok-comment"># Dockerfile — multi-stage + output: 'standalone'</span>
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SHOP_NAME
ENV NEXT_PUBLIC_SHOP_NAME=$NEXT_PUBLIC_SHOP_NAME
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER node
CMD ["node", "server.js"]</code></pre>
<div class="out">$ docker build -t nxj-std --build-arg NEXT_PUBLIC_SHOP_NAME=Alpha .
built nxj-std in 118 s
$ docker build -t nxj-noarg .   # forgot the build arg
built nxj-noarg in 10 s (layers cached)
$ docker images --format '{{.Repository}}  {{.Size}}' | grep -E '^nxj-(simple|std|noarg) ' | sort
nxj-noarg  331MB
nxj-simple  1.84GB
nxj-std  331MB
$ for c in nxj-std-c; do echo "$c: $(docker exec $c du -sh /app | cut -f1) in /app · $(docker exec $c sh -c 'ls node_modules 2&gt;/dev/null | wc -l' | tr -d ' ') packages in node_modules"; done
nxj-std-c: 67.8M in /app · 12 packages in node_modules</div>
<p><strong>3 · NEXT_PUBLIC_ cần <code>--build-arg</code></strong> — cổng 19345 build có <code>--build-arg NEXT_PUBLIC_SHOP_NAME=Alpha</code>; 19346 build thiếu nó và chạy với <code>-e NEXT_PUBLIC_SHOP_NAME=Beta</code>:</p>
<div class="out">$ curl localhost:3002/env/khach   # image built WITHOUT the arg, container started with -e NEXT_PUBLIC_SHOP_NAME=Beta
19345: NEXT_PUBLIC_SHOP_NAME = Alpha
19346: NEXT_PUBLIC_SHOP_NAME = </div>
<p><strong>4 · alpine là musl, slim là glibc</strong>:</p>
<div class="out">$ for i in node:22-alpine node:22-slim; do echo "$i: glibc $(docker run --rm $i node -p 'process.report.getReport().header.glibcVersionRuntime || "none (musl)"')"; done
node:22-alpine: glibc none (musl)
node:22-slim: glibc 2.36
$ docker run --rm nxj-std sh -c 'ls node_modules/@next 2&gt;/dev/null; ls /app/node_modules/@next 2&gt;/dev/null' | head -3; docker run --rm nxj-simple sh -c 'ls node_modules/@next | grep swc'
env
env
swc-linux-arm64-gnu
swc-linux-arm64-musl</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ grep -n '^FROM' frontend/Dockerfile Dockerfile.backend | head -6
frontend/Dockerfile:10:FROM node:22-slim AS deps
frontend/Dockerfile:42:FROM node:22-slim AS builder
frontend/Dockerfile:145:FROM node:22-slim AS runner
Dockerfile.backend:7:FROM node:22-slim AS builder
Dockerfile.backend:92:FROM node:22-slim AS runner
$ grep -n 'build xanh không có' CLAUDE.md | cut -c1-140
280:thêm chốt kiểm libc ↔ engine **trước khi đẩy**. Bài học: *build xanh không có</div>Cả hai ảnh dùng <code>node:22-slim</code> (glibc) ở mọi tầng. Ngày 18/08/2026 một ảnh dựng trên alpine mang engine Prisma cho glibc: build, đẩy, tráo đều xanh, rồi backend khởi động lại vô tận (API 502 bảy phút). Script deploy giờ kiểm libc ↔ engine trước khi đẩy.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">docker build -t app --build-arg NEXT_PUBLIC_SITE=… .
docker run -d --name app -p 3000:3000 app &amp;&amp; sleep 3
docker ps -a --filter name=app    <span class="tok-comment">  # Up, hay Exited?</span>
docker logs app; curl -s -o /dev/null -w "%{http_code}\\n" localhost:3000/
docker images app                 <span class="tok-comment">  # kích thước</span></code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">“CI build xanh mà” — và container thoát mã 127, vì không ai chạy thử trước khi đẩy.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">…bạn <code>COPY . .</code> mà không có <code>.dockerignore</code>? Mã nguồn, test và tệp <code>.env</code> nằm luôn trong ảnh.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Ảnh là một kho lưu trữ: <code>docker history</code> lộ tham số build của ảnh một tầng, và các tầng giữ cả tệp bạn xoá ở bước sau.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v"><code>.dockerignore</code>, nhiều tầng, <code>USER node</code>; chạy + curl trước khi đẩy; bí mật đưa vào lúc chạy.</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/docker/learn?lessonSlug=dk-6-1-multi-stage" target="_blank" rel="noopener"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Docker · 6.1 — Dựng nhiều tầng, cho tử tế</span><span class="lc-sub">Khuôn này, đi sâu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-17-1-anh-docker" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 17.1 — Ảnh Docker: 440MB xuống 58,8MB</span><span class="lc-sub">Cùng cách giảm cân cho backend Node</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-20-4-vps-stale-build" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 20.4 — VPS và build cũ</span><span class="lc-sub">Đưa ảnh lên máy chủ</span></span></a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Bật <code>output: 'standalone'</code> và dựng một Dockerfile đa-tầng chép server standalone.</li>
<li>Build ảnh cục bộ và chạy nó, xác nhận app phục vụ ở cổng mong đợi.</li>
<li>Để ý env var nào phải có lúc build vs lúc chạy (NEXT_PUBLIC lúc build, secret lúc chạy).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đóng gói được một app Next.js bằng một Docker build đa-tầng standalone.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">output: standalone</span><span class="v">Một bundle server tự-chứa, lý tưởng cho Docker.</span></div>
  <div class="kv"><span class="k">Build đa-tầng</span><span class="v">Build ở một tầng, chép chỉ cái chạy vào một ảnh cuối nhỏ.</span></div>
  <div class="kv"><span class="k">Image (ảnh)</span><span class="v">App đã đóng gói chạy như nhau ở mọi nơi.</span></div>
  <div class="kv"><span class="k">Env build vs runtime</span><span class="v">NEXT_PUBLIC lúc build; secret tiêm lúc chạy.</span></div>
  <div class="kv"><span class="k">Cache tầng</span><span class="v">Sắp bước Dockerfile để cài đặt được cache giữa các lần build.</span></div>
  <div class="kv"><span class="k">Ảnh cuối nhỏ</span><span class="v">Chép chỉ output standalone, không phải cả repo.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Đặt <code>output: 'standalone'</code> và dùng một Dockerfile đa-tầng chép chỉ server standalone.</li><li>Một ảnh đã build chạy như nhau ở mọi nơi — đây là cách cuongthai.com deploy.</li><li>Var <code>NEXT_PUBLIC_</code> phải có lúc build; secret tiêm lúc chạy.</li><li>Sắp các bước Dockerfile cho cache tầng và giữ ảnh cuối nhỏ.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/deploying#docker-image" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Docker</span><span class="lc-sub">Standalone output và ví dụ Docker chính thức.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 20.4 ─────────────────────────── */
    {
      title: '20.4 — Deploying to a VPS, and the "stale build" bugs|||20.4 — Deploy lên VPS, và họ bug "build cũ"',
      slug: 'nextjs-20-4-vps-stale-build',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'VPS là một server bạn thuê. Deploy = build image mới rồi tráo container. Cả một họ bug khó chịu tới từ một bản build CŨ/THIẾU vẫn chạy: route 404, public/ chốt lúc start rồi 404, CDN cache cả 404. Cách phát hiện và tránh.',
      content: `
${G20_4}
<div class="ml-en">
<span class="eyebrow">Chapter 20 · Lesson 20.4</span>
<h2>A server you rent, and the bugs of shipping the wrong build</h2>
<p class="lead">A <strong>VPS</strong> (Virtual Private Server) is just a computer you rent in a data centre, always on, with a public IP. Deploying to it means: build a fresh image (Docker, last lesson), copy it up, and swap the running container for the new one. Simple in theory — but a whole family of confusing bugs comes from accidentally running an <em>old or partial</em> build. These are worth memorising because they waste days.</p>

<div class="pitfall">
<p><strong>Stale / partial build → routes return 404.</strong> If a deploy copies files but does not fully rebuild (for example a "sync only, no build" shortcut), the container keeps running the <em>old</em> image. New pages and API routes you added simply 404, because the running build never included them. cuongthai.com hit this exactly: a feature's routes 404'd while the code was clearly in the repo — the fix was a full clean rebuild. How to diagnose a route quickly: hit it with an unauthenticated request — <code>401</code> or <code>200</code> means it is mounted (the build has it); <code>404</code> means it is not (stale build). The rule the project adopted: always do a FULL build on deploy, and run a post-deploy smoke-test that fails if core routes 404.</p>
</div>

<div class="pitfall">
<p><strong>public/ is locked when the server starts → 404 after a rebuild.</strong> Next.js decides the list of files in <code>public/</code> at server <em>startup</em>. On cuongthai.com's 3D playground, a rebuild produced JavaScript with new (content-hashed) names; the already-running server returned <code>404</code> for those files even though they existed on disk — so no JavaScript ran, and the page hung forever on a loading screen with <em>no error to see</em>. The lesson: change anything under <code>public/</code> and you must restart the server (in production, a fresh container does this automatically since each deploy is a new container). If you ever debug a "loads forever, no errors" page after touching <code>public/</code>, suspect this.</p>
</div>

<div class="pitfall">
<p><strong>A CDN caches 404s too.</strong> A <strong>CDN</strong> (Content Delivery Network, like Cloudflare) is a global cache that sits in front of your server to serve files fast. But it can cache a <em>404</em> — so if you request a URL <em>before</em> the file exists, the CDN may keep returning "not found" for that exact URL for hours, even after you upload the file. The tell: the file is on disk but the URL still 404s. Workarounds cuongthai.com uses: verify with a cache-busting query (<code>?cb=timestamp</code>), and if a URL is already poisoned, change the URL (e.g. add <code>?v=2</code>) rather than waiting the cache out. Do not curl a URL to "check" it right before uploading — you may cache its 404.</p>
</div>

<div class="callout warn">
<p><strong>The thread tying these together:</strong> each is a version of "what is running is not what you think." The container runs an old image; the server captured an old file list; the CDN cached an old (missing) response. When production behaves impossibly given your code, ask "is this actually running my latest build?" before debugging the code itself.</p>
</div>

<h3>Proving what production is actually running</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Ask a route, not the console</b> — &#96;curl -s -o /dev/null -w &quot;%{http_code}&quot; https://site/api/v1/&lt;new-route&gt;&#96;. 404 means stale build; 401 or 200 means it is mounted.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Check the image, not the repo</b> — The commit being on &#96;main&#96; proves nothing about what the container was built from.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Smoke-test after every deploy</b> — A handful of unauthenticated GETs that must not return 404. Automate it in the deploy script so it cannot be skipped.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Keep the previous image</b> — A rollback is then a re-tag and a restart — about forty seconds, instead of a fifteen-minute rebuild.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — diagnosing a stale build as a data problem.</strong> Two features break at once — a picker stops working, a list appears empty — and both look like the database. The actual cause was one deploy that copied files without rebuilding, so the running bundle never included the new route: it returned 404 while a neighbouring route returned 401, and the difference is invisible in a browser, which shows a generic failure either way. This is recorded in this repo&#39;s history, and the fix it left behind is the habit above: diagnose route health with an unauthenticated curl before you touch data, and never deploy without a rebuild.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/deploying#self-hosting" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Self-hosting</span><span class="lc-sub">Running a build on your own server, with the caching and file-serving notes.</span></span>
</a>
<a class="link-card dl" href="https://docs.docker.com/engine/reference/commandline/image_ls/" target="_blank" rel="noopener">
  <span class="lc-ico">🔖</span>
  <span class="lc-body"><span class="lc-title">docker image ls</span><span class="lc-sub">Finding the previous image by size and id, which is what makes a fast rollback possible.</span></span>
</a>


<h3>🔬 Measured: a stale build, a smoke test, a bind-mounted file, a cached 404 (Docker Desktop 29.8 as the “VPS” · cuongthai.com)</h3>
<p><strong>1 · Commit a route, restart without building</strong>:</p>
<div class="out">$ docker run -d --name prod -p 8080:3000 nxj-std   # "the VPS", running release v1
/ver → 200
/api/hello → 404
$ git commit -am "add /api/hello" &amp;&amp; ./deploy --no-build   # copy files, restart the container, skip the build
/ver → 200
/api/hello → 404
$ docker inspect -f 'image {{.Image}}' nxj-prod | cut -c1-25; echo "source has: $(ls src/app/api/hello/route.ts)"
image sha256:6ff8e07407ee
source has: src/app/api/hello/route.ts</div>
<p><strong>2 · A smoke test that fails the deploy</strong>:</p>
<pre><code class="language-bash"><span class="tok-comment">#!/bin/sh</span>
<span class="tok-comment"># smoke.sh — after every deploy: these routes must NOT be 404</span>
BASE=\${1:-http://127.0.0.1:8080}
fail=0
for r in / /ver /api/hello; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE$r")
  echo "$r → $code"
  [ "$code" = 404 ] &amp;&amp; fail=1
done
[ $fail = 0 ] &amp;&amp; echo "SMOKE OK" || { echo "SMOKE FAILED: stale or partial build"; exit 1; }</code></pre>
<div class="out">$ sh smoke.sh http://localhost:8080
/ → 200
/ver → 200
/api/hello → 404
SMOKE FAILED: stale or partial build
exit 1
$ docker build -t nxj-std:v2 . &amp;&amp; docker rm -f prod &amp;&amp; docker run -d --name prod … nxj-std:v2   # a FULL deploy
/ → 200
/ver → 200
/api/hello → 200
SMOKE OK
exit 0</div>
<p><strong>3 · A bind-mounted single file, replaced with <code>mv</code> vs written in place</strong> — <code>mv</code> (and editors, rsync, <code>sed -i</code>) create a new inode; the container keeps the old one. On Docker Desktop it vanished; on a Linux VPS the container keeps reading the old content:</p>
<div class="out">$ docker run -d --name nxj-bind -v "$PWD/site.conf:/etc/site.conf" alpine:3 sleep 600 &gt;/dev/null; echo "container reads: $(docker exec nxj-bind cat /etc/site.conf) · host inode $(stat -f %i site.conf)"
container reads: release=v1 · host inode 158954408
$ printf 'release=v2\\n' &gt; site.conf.new &amp;&amp; mv site.conf.new site.conf   # how editors and rsync save
host: release=v2 · inode 158954412
container reads: 
cat: can't open '/etc/site.conf': No such file or directory
$ printf 'release=v3\\n' &gt; site.conf   # write IN PLACE (same inode)
host: release=v3 · inode 158954412
container reads: release=v3</div>
<p><strong>4 · A 404 marked “cache for a year”</strong> — cuongthai.com, asked twice for a chunk that does not exist, and the nginx rule behind it (<code>always</code> also applies to errors):</p>
<div class="out">$ curl -sI https://cuongthai.com/_next/static/chunks/&lt;a file that does not exist yet&gt;.js   # twice
request 1: HTTP/2 404  cache-control: public, max-age=31536000, immutable 
request 2: HTTP/2 404  cache-control: public, max-age=31536000, immutable 
$ grep -n 'location ^~ /_next/static/\\|immutable" always' nginx/nginx.conf
215:        location ^~ /_next/static/ {
228:            add_header Cache-Control "public, max-age=31536000, immutable" always;
453:            add_header Cache-Control "public, max-age=31536000, immutable" always;
510:            add_header Cache-Control "public, max-age=31536000, immutable" always;</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ sed -n '931,934p' deploy-nha.sh; grep -c "SMOKE_ROUTES\\|/api/v1/" deploy-nha.sh | sed 's/^/dòng nhắc route trong deploy-nha.sh: /'
info "Smoke-test các route lõi..."
# ⚠️ Đọc danh sách route từ &#96;deploy.sh&#96; CỦA ĐÚNG COMMIT ĐANG DEPLOY
# (&#96;git show \${SHA}:deploy.sh&#96;), KHÔNG phải file trong cây làm việc.
#
dòng nhắc route trong deploy-nha.sh: 4
$ grep -n "Ghi ĐÈ TẠI CHỖ" CLAUDE.md | cut -c1-120
827:| 2026-08-25 | Bước 6c mới thêm báo &#96;KQ=OK&#96; — &#96;nginx -t&#96; xanh, &#96;reload&#96; xanh — nhưng **HTTP/2 vẫn tắt và mọi header </div>The deploy reads its smoke-test route list from the commit being deployed. The inode lesson came from nginx (25/08/2026): <code>nginx -t</code> and reload both OK while the container still read the old config.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">docker run -d --name prod -p 8080:3000 app:v1
<span class="tok-comment"># add a route, then: docker restart prod  (no build)</span>
sh smoke.sh http://localhost:8080; echo $?
docker inspect -f "{{.Image}}" prod    <span class="tok-comment">  # which build is running?</span>
curl -sI https://your-site/_next/static/chunks/missing.js | grep -i cache-control</code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">“It is on main but not live” — and two broken features look like a database problem (02/07/2026).</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">…nobody smoke-tests? Users find the 404 first, and you debug the wrong layer for hours.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">Stale also means unpatched: your security fix is “deployed” while the old vulnerable build keeps answering.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">A smoke test that fails the deploy; compare the running image id / BUILD_ID after every swap; never cache errors as immutable.</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/docker/learn?lessonSlug=dk-7-3-bind-mount" target="_blank" rel="noopener"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Docker · 7.3 — Bind mounts and four traps</span><span class="lc-sub">The inode trap and others</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-5-2-cai-gi-duoc-cache" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nginx · 5.2 — What gets cached</span><span class="lc-sub">Headers on errors, and leaks</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-17-6-deploy-hong-quay-lui" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 17.6 — When a deploy lies</span><span class="lc-sub">Stale builds and rollback, backend side</span></span></a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Deploy an image, then change code and redeploy WITHOUT rebuilding; confirm the old behaviour persists (a stale build).</li>
<li>Diagnose a route with an unauthenticated <code>curl</code>: 401/200 = mounted, 404 = stale/partial build.</li>
<li>Do a full clean rebuild and re-check the route returns non-404.</li>
</ol>
<p><strong>Done when:</strong> you can recognise a stale-build deploy and diagnose route health with curl.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Stale build</span><span class="v">Running an old image because a deploy skipped the rebuild.</span></div>
  <div class="kv"><span class="k">Partial deploy</span><span class="v">Only some files updated, leaving a broken mix.</span></div>
  <div class="kv"><span class="k">curl diagnosis</span><span class="v">401/200 = route mounted; 404 = not mounted (stale build).</span></div>
  <div class="kv"><span class="k">Full rebuild</span><span class="v">Rebuild from clean to guarantee the new code ships.</span></div>
  <div class="kv"><span class="k">Smoke test</span><span class="v">Hit core routes after deploy; a 404 means a stale build.</span></div>
  <div class="kv"><span class="k">Immutable image</span><span class="v">A fresh image per deploy avoids partial-update bugs.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A stale build ships old behaviour because a deploy skipped the rebuild or updated only some files.</li><li>Diagnose route health with an unauthenticated <code>curl</code>: 401/200 = mounted, 404 = stale/partial build.</li><li>Fix it with a full clean rebuild, and smoke-test core routes after every deploy.</li><li>A fresh immutable image per deploy avoids this whole class of bug (as cuongthai.com learned).</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/deploying#self-hosting" target="_blank" rel="noopener">
  <span class="lc-ico">🖧</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Self-hosting</span><span class="lc-sub">Running a production Next.js server yourself, on a VPS or container.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 20 · Bài 20.4</span>
<h2>Một server bạn thuê, và những bug của việc ship nhầm build</h2>
<p class="lead">Một <strong>VPS</strong> (Virtual Private Server) chỉ là một máy tính bạn thuê trong một trung tâm dữ liệu, luôn bật, có IP công khai. Deploy lên nó nghĩa là: build một image tươi (Docker, bài trước), chép lên, và tráo container đang chạy bằng cái mới. Lý thuyết thì đơn giản — nhưng cả một họ bug khó hiểu tới từ việc vô tình chạy một bản build <em>cũ hoặc thiếu</em>. Đáng thuộc lòng vì chúng tốn cả ngày.</p>

<div class="pitfall">
<p><strong>Build cũ/thiếu → route trả 404.</strong> Nếu một deploy chép file nhưng không build lại đầy đủ (ví dụ một lối tắt "chỉ sync, không build"), container tiếp tục chạy image <em>cũ</em>. Trang và route API mới bạn thêm đơn giản là 404, vì bản build đang chạy chưa bao giờ có chúng. cuongthai.com dính đúng cái này: route của một tính năng 404 dù code rõ ràng trong repo — cách sửa là một bản build lại sạch, đầy đủ. Cách chẩn đoán một route nhanh: gọi nó bằng một request không xác thực — <code>401</code> hoặc <code>200</code> nghĩa là nó đã mount (bản build có nó); <code>404</code> nghĩa là không (build cũ). Quy tắc dự án theo: luôn build ĐẦY ĐỦ khi deploy, và chạy một smoke-test sau-deploy rớt nếu route cốt lõi 404.</p>
</div>

<div class="pitfall">
<p><strong>public/ bị chốt khi server khởi động → 404 sau khi build lại.</strong> Next.js quyết danh sách file trong <code>public/</code> lúc server <em>khởi động</em>. Trên sân chơi 3D của cuongthai.com, một bản build lại tạo JavaScript với tên mới (băm theo nội dung); server đang chạy trả <code>404</code> cho những file đó dù chúng có trên đĩa — nên không JavaScript nào chạy, và trang treo mãi ở màn hình tải mà <em>không lỗi nào để thấy</em>. Bài học: đổi bất cứ gì trong <code>public/</code> thì bạn phải khởi động lại server (ở production, một container tươi làm việc này tự động vì mỗi deploy là một container mới). Nếu bạn từng gỡ một trang "tải mãi, không lỗi" sau khi động vào <code>public/</code>, hãy nghi cái này.</p>
</div>

<div class="pitfall">
<p><strong>CDN cache cả 404.</strong> Một <strong>CDN</strong> (Content Delivery Network, như Cloudflare) là một cache toàn cầu đứng trước server bạn để phục vụ file nhanh. Nhưng nó có thể cache một <em>404</em> — nên nếu bạn gọi một URL <em>trước khi</em> file tồn tại, CDN có thể cứ trả "không tìm thấy" cho đúng URL đó hàng giờ, kể cả sau khi bạn upload file. Dấu hiệu: file có trên đĩa nhưng URL vẫn 404. Cách lách cuongthai.com dùng: kiểm bằng một query phá cache (<code>?cb=timestamp</code>), và nếu một URL đã nhiễm, đổi URL (ví dụ thêm <code>?v=2</code>) thay vì ngồi chờ cache hết. Đừng curl một URL để "kiểm" ngay trước khi upload — bạn có thể cache cái 404 của nó.</p>
</div>

<div class="callout warn">
<p><strong>Sợi chỉ nối chúng lại:</strong> mỗi cái là một biến thể của "cái đang chạy không phải cái bạn nghĩ." Container chạy image cũ; server chụp danh sách file cũ; CDN cache một phản hồi cũ (thiếu). Khi production hành xử bất khả thi so với code của bạn, hãy hỏi "cái này có thật sự chạy bản build mới nhất không?" trước khi gỡ chính code.</p>
</div>

<h3>Chứng minh production đang chạy thứ gì</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Hãy hỏi một route, đừng hỏi console</b> — &#96;curl -s -o /dev/null -w &quot;%{http_code}&quot; https://site/api/v1/&lt;route-mới&gt;&#96;. 404 nghĩa là build cũ; 401 hay 200 nghĩa là nó đã được gắn.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Kiểm cái ảnh, đừng kiểm cái kho</b> — Việc commit đã nằm trên &#96;main&#96; chẳng chứng minh gì về thứ mà container được dựng từ đó.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Kiểm nhanh sau mỗi lần deploy</b> — Một nhúm lời gọi GET không xác thực mà KHÔNG được phép trả 404. Hãy tự động hoá nó trong script deploy để không thể bỏ qua.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Giữ lại ảnh trước đó</b> — Khi đó quay lui chỉ là gắn nhãn lại rồi khởi động lại — chừng bốn mươi giây, thay vì mười lăm phút dựng lại.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — chẩn đoán một bản build cũ thành một vấn đề dữ liệu.</strong> Hai tính năng hỏng cùng lúc — một bộ chọn thôi chạy, một danh sách trông trống trơn — và cả hai đều trông như lỗi cơ sở dữ liệu. Nguyên nhân thật là một lần deploy chép file mà không dựng lại, nên cái gói đang chạy chưa từng có route mới: nó trả 404 trong khi một route hàng xóm trả 401, và khác biệt đó vô hình trong trình duyệt, thứ hiện ra một cú hỏng chung chung ở cả hai trường hợp. Chuyện này có trong lịch sử kho này, và cách chữa nó để lại chính là thói quen ở trên: hãy chẩn đoán sức khoẻ route bằng một lệnh curl không xác thực TRƯỚC khi động vào dữ liệu, và đừng bao giờ deploy mà không dựng lại.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/deploying#self-hosting" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Tự vận hành</span><span class="lc-sub">Chạy một bản build trên máy chủ của chính bạn, kèm ghi chú về nhớ đệm và phục vụ file.</span></span>
</a>
<a class="link-card dl" href="https://docs.docker.com/engine/reference/commandline/image_ls/" target="_blank" rel="noopener">
  <span class="lc-ico">🔖</span>
  <span class="lc-body"><span class="lc-title">docker image ls</span><span class="lc-sub">Tìm lại ảnh trước đó theo kích thước và id, thứ làm cho việc quay lui nhanh trở nên khả thi.</span></span>
</a>


<h3>🔬 Đo thật: build cũ, smoke test, tệp gắn vào container, lỗi 404 bị cache (Docker Desktop 29.8 đóng vai “VPS” · cuongthai.com)</h3>
<p><strong>1 · Commit một tuyến, khởi động lại không build</strong>:</p>
<div class="out">$ docker run -d --name prod -p 8080:3000 nxj-std   # "the VPS", running release v1
/ver → 200
/api/hello → 404
$ git commit -am "add /api/hello" &amp;&amp; ./deploy --no-build   # copy files, restart the container, skip the build
/ver → 200
/api/hello → 404
$ docker inspect -f 'image {{.Image}}' nxj-prod | cut -c1-25; echo "source has: $(ls src/app/api/hello/route.ts)"
image sha256:6ff8e07407ee
source has: src/app/api/hello/route.ts</div>
<p><strong>2 · Smoke test làm deploy thất bại</strong>:</p>
<pre><code class="language-bash"><span class="tok-comment">#!/bin/sh</span>
<span class="tok-comment"># smoke.sh — after every deploy: these routes must NOT be 404</span>
BASE=\${1:-http://127.0.0.1:8080}
fail=0
for r in / /ver /api/hello; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE$r")
  echo "$r → $code"
  [ "$code" = 404 ] &amp;&amp; fail=1
done
[ $fail = 0 ] &amp;&amp; echo "SMOKE OK" || { echo "SMOKE FAILED: stale or partial build"; exit 1; }</code></pre>
<div class="out">$ sh smoke.sh http://localhost:8080
/ → 200
/ver → 200
/api/hello → 404
SMOKE FAILED: stale or partial build
exit 1
$ docker build -t nxj-std:v2 . &amp;&amp; docker rm -f prod &amp;&amp; docker run -d --name prod … nxj-std:v2   # a FULL deploy
/ → 200
/ver → 200
/api/hello → 200
SMOKE OK
exit 0</div>
<p><strong>3 · Một tệp gắn vào container, thay bằng <code>mv</code> so với ghi tại chỗ</strong> — <code>mv</code> (và trình soạn thảo, rsync, <code>sed -i</code>) tạo inode mới; container giữ cái cũ. Trên Docker Desktop tệp biến mất; trên VPS Linux container lặng lẽ đọc nội dung cũ:</p>
<div class="out">$ docker run -d --name nxj-bind -v "$PWD/site.conf:/etc/site.conf" alpine:3 sleep 600 &gt;/dev/null; echo "container reads: $(docker exec nxj-bind cat /etc/site.conf) · host inode $(stat -f %i site.conf)"
container reads: release=v1 · host inode 158954408
$ printf 'release=v2\\n' &gt; site.conf.new &amp;&amp; mv site.conf.new site.conf   # how editors and rsync save
host: release=v2 · inode 158954412
container reads: 
cat: can't open '/etc/site.conf': No such file or directory
$ printf 'release=v3\\n' &gt; site.conf   # write IN PLACE (same inode)
host: release=v3 · inode 158954412
container reads: release=v3</div>
<p><strong>4 · Một lỗi 404 kèm “cache một năm”</strong> — cuongthai.com, hỏi hai lần một chunk không tồn tại, và quy tắc nginx phía sau (<code>always</code> áp cả cho lỗi):</p>
<div class="out">$ curl -sI https://cuongthai.com/_next/static/chunks/&lt;a file that does not exist yet&gt;.js   # twice
request 1: HTTP/2 404  cache-control: public, max-age=31536000, immutable 
request 2: HTTP/2 404  cache-control: public, max-age=31536000, immutable 
$ grep -n 'location ^~ /_next/static/\\|immutable" always' nginx/nginx.conf
215:        location ^~ /_next/static/ {
228:            add_header Cache-Control "public, max-age=31536000, immutable" always;
453:            add_header Cache-Control "public, max-age=31536000, immutable" always;
510:            add_header Cache-Control "public, max-age=31536000, immutable" always;</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ sed -n '931,934p' deploy-nha.sh; grep -c "SMOKE_ROUTES\\|/api/v1/" deploy-nha.sh | sed 's/^/dòng nhắc route trong deploy-nha.sh: /'
info "Smoke-test các route lõi..."
# ⚠️ Đọc danh sách route từ &#96;deploy.sh&#96; CỦA ĐÚNG COMMIT ĐANG DEPLOY
# (&#96;git show \${SHA}:deploy.sh&#96;), KHÔNG phải file trong cây làm việc.
#
dòng nhắc route trong deploy-nha.sh: 4
$ grep -n "Ghi ĐÈ TẠI CHỖ" CLAUDE.md | cut -c1-120
827:| 2026-08-25 | Bước 6c mới thêm báo &#96;KQ=OK&#96; — &#96;nginx -t&#96; xanh, &#96;reload&#96; xanh — nhưng **HTTP/2 vẫn tắt và mọi header </div>Script deploy đọc danh sách tuyến smoke test từ đúng commit đang deploy. Bài học inode đến từ nginx (25/08/2026): <code>nginx -t</code> và reload đều OK trong khi container vẫn đọc cấu hình cũ.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">docker run -d --name prod -p 8080:3000 app:v1
<span class="tok-comment"># thêm một tuyến, rồi: docker restart prod  (không build)</span>
sh smoke.sh http://localhost:8080; echo $?
docker inspect -f "{{.Image}}" prod    <span class="tok-comment">  # đang chạy bản build nào?</span>
curl -sI https://your-site/_next/static/chunks/missing.js | grep -i cache-control</code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">“Lên main rồi mà chưa chạy” — và hai tính năng cùng hỏng trông như lỗi cơ sở dữ liệu (02/07/2026).</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">…không ai smoke test? Người dùng thấy 404 trước, và bạn gỡ lỗi nhầm tầng hàng giờ.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Build cũ cũng là chưa vá: bản sửa bảo mật “đã deploy” trong khi bản cũ có lỗ hổng vẫn trả lời.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Smoke test làm deploy thất bại; so mã ảnh / BUILD_ID đang chạy sau mỗi lần tráo; đừng cache lỗi như tệp bất biến.</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/docker/learn?lessonSlug=dk-7-3-bind-mount" target="_blank" rel="noopener"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Docker · 7.3 — Bind mount, và bốn cái bẫy</span><span class="lc-sub">Bẫy inode và những bẫy khác</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nginx/learn?lessonSlug=nginx-5-2-cai-gi-duoc-cache" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nginx · 5.2 — Cái gì được cache</span><span class="lc-sub">Header trên lỗi, và rò rỉ</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-17-6-deploy-hong-quay-lui" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 17.6 — Khi deploy nói dối</span><span class="lc-sub">Build cũ và quay lui, phía máy chủ</span></span></a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Deploy một ảnh, rồi đổi code và deploy lại mà KHÔNG build lại; xác nhận hành vi cũ vẫn còn (một build cũ).</li>
<li>Chẩn một route bằng <code>curl</code> không xác thực: 401/200 = đã mount, 404 = build cũ/dở.</li>
<li>Làm một build lại sạch hoàn toàn và kiểm lại route trả về khác-404.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nhận ra được một deploy build-cũ và chẩn sức khoẻ route bằng curl.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Build cũ (stale)</span><span class="v">Chạy một ảnh cũ vì một deploy bỏ qua build lại.</span></div>
  <div class="kv"><span class="k">Deploy dở (partial)</span><span class="v">Chỉ vài file cập nhật, để lại một mớ hỏng.</span></div>
  <div class="kv"><span class="k">Chẩn bằng curl</span><span class="v">401/200 = route đã mount; 404 = chưa mount (build cũ).</span></div>
  <div class="kv"><span class="k">Build lại đầy đủ</span><span class="v">Build lại từ sạch để đảm bảo code mới được ship.</span></div>
  <div class="kv"><span class="k">Smoke test</span><span class="v">Gọi các route lõi sau deploy; một 404 nghĩa là build cũ.</span></div>
  <div class="kv"><span class="k">Ảnh immutable</span><span class="v">Một ảnh mới mỗi deploy tránh bug cập nhật dở.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một build cũ ship hành vi cũ vì một deploy bỏ qua build lại hoặc chỉ cập nhật vài file.</li><li>Chẩn sức khoẻ route bằng <code>curl</code> không xác thực: 401/200 = đã mount, 404 = build cũ/dở.</li><li>Sửa bằng một build lại sạch hoàn toàn, và smoke-test các route lõi sau mỗi deploy.</li><li>Một ảnh immutable mới mỗi deploy tránh cả họ bug này (như cuongthai.com đã học).</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/deploying#self-hosting" target="_blank" rel="noopener">
  <span class="lc-ico">🖧</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Self-hosting</span><span class="lc-sub">Tự chạy một server Next.js production, trên VPS hoặc container.</span></span>
</a>
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-14-3-deploy" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 14.3 — Deploying</span><span class="lc-sub">SPA fallback, cache headers and a smoke test, run against a real static server</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-14-3-deploy" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 14.3 — Deploy</span><span class="lc-sub">SPA fallback, header lưu đệm và smoke-test, chạy với một máy chủ tĩnh thật</span></span>
  <span class="lc-cta">Mở bài</span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 20.5 ─────────────────────────── */
    {
      title: '20.5 — After deploy: migrations, rollback, and a safe flow|||20.5 — Sau deploy: migration, rollback, và một quy trình an toàn',
      slug: 'nextjs-20-5-quy-trinh-an-toan',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Deploy không chỉ là đẩy code: còn migration database, cách quay lui khi hỏng, và một quy trình chắc chắn. Kèm bài học lớn nhất của cuongthai: deploy đẩy MÃ NGUỒN chứ không đẩy DỮ LIỆU. Chương khép khoá.',
      content: `
${G20_5}
<div class="ml-en">
<span class="eyebrow">Chapter 20 · Lesson 20.5 · Course finale</span>
<h2>Shipping code is only part of shipping a change</h2>
<p class="lead">A real deploy is more than pushing new JavaScript. If you changed the database shape you must migrate it; if the deploy goes wrong you need a way back; and a repeatable, safe flow prevents most disasters. This lesson closes the loop — and the course.</p>

<h3>Database migrations</h3>
<p>When your data model changes (a new column, a renamed field), the database must change to match — that change is a <strong>migration</strong>. Migrations run as part of deploy, and they are the riskiest step because, unlike code, <em>data cannot simply be un-changed</em>. Two rules that save you: never auto-"fix" a failed migration by forcing it through (you can silently corrupt data — stop and diagnose); and remember that <em>reverting code does not revert the database</em> — if a bad deploy included a migration, rolling back the code leaves the changed schema behind, so a rollback needs a plan for the data too.</p>

<div class="note-ct">
<p><strong>The single biggest deploy lesson from cuongthai.com: a deploy ships your CODE, not your DATA.</strong> A developer seeded a batch of content into the <em>local</em> database, then deployed and expected it on production — but the deploy only shipped code; production's database stayed empty. It was only caught by actually checking production with a curl. The takeaway, now built into the deploy process: if content needs to exist on production, the deploy must include a step that <em>seeds it into the production database</em> — pushing code alone never carries data across. Code and data travel by different means; never assume one brings the other.</p>
</div>

<h3>Rollback: the way back</h3>
<p>When a bad deploy reaches production, the clean recovery is to <code>git revert</code> the bad commit and deploy again — going forward to a known-good state, not hacking the server by hand. To stop the bleeding <em>first</em>, swap back to the previous image you kept (measured below: 2.6 s, versus a ~2-minute rebuild), then revert so the source matches what runs. Never force-push over history to "undo" a deploy. And if that bad deploy ran a migration, discuss the data before reverting, per the rule above.</p>

<h3>A safe, repeatable flow</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Verify locally</b> — type-check, build, run tests (Chapter 19). Green before you go near production.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Deploy with a full build</b> — never a partial/sync-only shortcut (lesson 20.4). Let it run migrations and a post-deploy smoke-test.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Verify production</b> — actually visit it, curl the routes, confirm the change is live (remember: production runs the build, and code ≠ data).</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Then sync your source of truth</b> — push to your shared branch once production is confirmed good.</div></div>
</div>
<p>Note also the useful separation cuongthai.com settled on: <em>continuous integration</em> (CI — the automated type-check/lint on every push) is kept separate from deploy, so a push cannot accidentally trigger a production deploy and race itself into an outage. CI guards quality; a deliberate deploy step ships. Keeping them apart is what makes the flow calm.</p>

<div class="callout ok">
<p><strong>You made it — the whole course, in one breath.</strong> You started with React (JSX, components, state, hooks), learned how it renders and re-renders, then wrapped it in Next.js: the App Router, Server vs Client Components, data fetching and caching, advanced routing, Server Actions, styling, state management, auth, forms and uploads, and finally rendering strategy, performance, testing, and this — build and deploy. You now have the full arc from an empty folder to a running production app, complete with the real-world traps that a running site like cuongthai.com paid to learn. Go build something, deploy it, and when production surprises you, you will know where to look.</p>
</div>

<h3>A deploy sequence that is hard to get wrong</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Check locally first</b> — Type-check, build, run the built app once. A build that fails on the server has already cost you a deploy window.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Deploy with one script</b> — The same command every time, with the checks inside it. A sequence people remember is a sequence people skip.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Verify before announcing</b> — Hit the new route, log in once, look at the logs. &quot;It deployed&quot; and &quot;it works&quot; are different claims.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Keep a rollback ready</b> — Know the previous image id before you swap. The time to work that out is not during an outage.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a deploy started from a working tree with uncommitted changes.</strong> What ships is whatever the deploy mechanism collects, which may be your working directory, another session&#39;s half-saved file, or the last commit — and the three can differ. Both failure directions are real: a fix you have not committed silently reaches production, or a fix you can see on your screen is missing from it. This repo&#39;s own tooling asks for confirmation when the tree is dirty for exactly that reason, and pushes only committed content. The habit that removes the whole class of problem is to commit first, deploy second, and verify the running build against a commit id rather than against your editor.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/deploying" target="_blank" rel="noopener">
  <span class="lc-ico">🚢</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Deploying</span><span class="lc-sub">Build outputs, self-hosting and the checklist per platform.</span></span>
</a>
<a class="link-card dl" href="https://docs.github.com/en/actions/deployment/about-deployments" target="_blank" rel="noopener">
  <span class="lc-ico">🤖</span>
  <span class="lc-body"><span class="lc-title">GitHub — About deployments</span><span class="lc-sub">Wiring the sequence into CI, so the checks cannot be skipped by hand.</span></span>
</a>


<h3>🔬 Measured: code vs data, a rollback after a migration, an image swap, a dirty tree (sqlite3 · Docker Desktop 29.8)</h3>
<p><strong>1 · A deploy ships code, not data</strong>:</p>
<div class="out">$ sqlite3 local.db "CREATE TABLE posts(id INTEGER PRIMARY KEY, title TEXT); INSERT INTO posts(title) VALUES ('Lesson 1'),('Lesson 2'),('Lesson 3');" &amp;&amp; echo "local.db posts: $(sqlite3 local.db 'SELECT count(*) FROM posts')"
local.db posts: 3
$ deploy = new image (code) — production keeps its OWN database
prod.db posts after deploy: 0
what the image carries: node_modules package.json public server.js </div>
<p><strong>2 · Migrate, then roll the code back</strong> — v1 reads <code>users.name</code>; v2 ships with this migration:</p>
<pre><code class="language-sql">-- migration shipped with v2
ALTER TABLE users RENAME COLUMN name TO full_name;</code></pre>
<div class="out">$ cd mig &amp;&amp; sqlite3 prod.db "CREATE TABLE users(id INTEGER PRIMARY KEY, name TEXT); INSERT INTO users(name) VALUES ('An'),('Binh');" &amp;&amp; sh app-v1.sh prod.db
v1 sees: An
v1 sees: Binh
$ deploy v2: run the migration, then start app v2
v2 sees: An
v2 sees: Binh
$ v2 has a bug → roll back the CODE to v1 (git revert / old image)
Parse error in 2nd command line argument: no such column: name
  SELECT 'v1 sees: ' || name FROM users ORDER BY id LIMIT 2;
$ cd mig &amp;&amp; sqlite3 prod.db ".schema users"
CREATE TABLE users(id INTEGER PRIMARY KEY, full_name TEXT);</div>
<p>Reverting code does not revert the database: the rollback brought the outage back. Do renames as <em>expand → contract</em>: add the new column and keep the old one, deploy code that writes both, backfill, and only much later drop the old column — every step can be rolled back.</p>
<p><strong>3 · Keep the previous image</strong>:</p>
<div class="out">$ docker run -d --name nxj-prod -p 127.0.0.1:19347:3000 nxj-std:v2 &gt;/dev/null; sleep 4; echo "running v2: /api/hello → $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:19347/api/hello)"
running v2: /api/hello → 200
$ rollback: the previous image is still here — swap back
rolled back to the old image in 2.6 s · /api/hello → 404 · /ver → 200
$ docker images --format '{{.Repository}}:{{.Tag}} {{.ID}} {{.CreatedSince}}' | grep '^nxj-std'
nxj-std:v2 03a0ca7398cb 38 seconds ago
nxj-std:latest 6ff8e07407ee 3 minutes ago</div>
<p><strong>4 · Deploy a commit, not your working tree</strong>:</p>
<div class="out">$ edit a file, do NOT commit, deploy
 M src/app/ver/page.tsx
$ echo "working tree:  $(grep -o 'Release v[0-9a-z-]*' src/app/ver/page.tsx)"; echo "committed HEAD: $(git show HEAD:src/app/ver/page.tsx | grep -o 'Release v[0-9a-z-]*')"
working tree:  Release v1-hotfix
committed HEAD: Release v1</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ grep -n '^info "' deploy-nha.sh | sed -E 's/^([0-9]+):info "/\\1: /; s/\\.\\.\\."$//' | head -16
507: Kiểm máy nhà
552: Gửi mã (commit \${SHA}) sang máy nhà
577: Build backend + frontend SONG SONG ở máy nhà (đo trước: ~6 phút)
633: Kiểm ảnh backend có chạy nổi không (libc ↔ engine Prisma)
676: Đẩy ảnh lên GHCR
708: Tráo container trên VPS (có khoá chống hai phiên cùng tráo)
789: Nạp lại nginx ngay (tráo container có thể đã đổi IP upstream)
807: Kiểm từ NGOÀI (qua nginx, đúng đường người dùng đi)
827: Chạy migration
866: Chạy seed nội dung (Step 3.5→3.17 từ deploy.sh)
911: Chờ backend khoẻ
931: Smoke-test các route lõi
953:   \${SO_ROUTE} route"
994: Kiểm nginx.conf trên VPS
1161: Dọn ảnh deploy CŨ trên VPS (giữ \${SHA} + latest)
1273: Kiểm lại: container có đang chạy đúng ảnh vừa tráo không
$ grep -n "git revert &lt;bad_commit_sha&gt;\\|NEVER.*migrate reset" CLAUDE.md | cut -c1-110 | head -2
50:- **NEVER** run &#96;npx prisma migrate reset&#96; — it wipes ALL data
350:git revert &lt;bad_commit_sha&gt;</div>One script, with the checks inside it: build the exact commit, check libc ↔ engine, push, swap with a lock, reload nginx, check from outside, migrate, seed content, smoke-test, prune old images (keeping the previous one), and verify the running image.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">sqlite3 prod.db "CREATE TABLE users(id INTEGER PRIMARY KEY, name TEXT)"
sqlite3 prod.db "ALTER TABLE users RENAME COLUMN name TO full_name"
sqlite3 prod.db "SELECT name FROM users"      <span class="tok-comment">  # the old code, after the migration</span>
docker tag app:latest app:prev &amp;&amp; docker build -t app:latest .
docker rm -f prod &amp;&amp; docker run -d --name prod -p 8080:3000 app:prev <span class="tok-comment">  # time the swap back</span></code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">“I deployed — where is my content?” Local seed data never ships; production stays empty until someone checks.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">…you roll back right after a migration? Old code meets the new schema: the rollback <em>is</em> the outage.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">A dirty working tree is a supply-chain hole: whatever is on disk — a debug flag, another session&#39;s file — can ship.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Deploy a SHA; migrate with expand → contract; smoke-test after the swap; keep the previous image and practise swapping back.</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/postgresql/learn?lessonSlug=postgresql-16-1-prisma-migration" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL · 16.1 — Prisma and migrations</span><span class="lc-sub">Migrations from the database side</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/github-actions/learn?lessonSlug=ga-15-3-deploy-an-toan" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">GitHub Actions · 15.3 — Safe deploys</span><span class="lc-sub">Environments, SSH, smoke tests</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-17-6-deploy-hong-quay-lui" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 17.6 — When a deploy lies</span><span class="lc-sub">Stale builds, smoke tests, rollback</span></span></a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write a short pre-deploy checklist: type-check, build, run the smoke test, confirm env vars.</li>
<li>Practise a rollback: redeploy the previous image/commit and confirm the site recovers.</li>
<li>Note that reverting code does not revert a database migration — plan migrations separately.</li>
</ol>
<p><strong>Done when:</strong> you can follow a safe deploy flow and perform a rollback.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pre-deploy checklist</span><span class="v">Type-check, build, smoke test, env check before shipping.</span></div>
  <div class="kv"><span class="k">Smoke test</span><span class="v">Hit core routes post-deploy to catch a broken build.</span></div>
  <div class="kv"><span class="k">Rollback</span><span class="v">Redeploy the previous good image/commit to recover fast.</span></div>
  <div class="kv"><span class="k">Migration</span><span class="v">A database schema change — not undone by reverting code.</span></div>
  <div class="kv"><span class="k">Forward-only migrations</span><span class="v">Plan DB changes so they are safe and reversible by plan.</span></div>
  <div class="kv"><span class="k">Safe flow</span><span class="v">A repeatable order of steps that prevents outages.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Follow a repeatable pre-deploy checklist: type-check, build, smoke test, confirm env vars.</li><li>Smoke-test core routes after every deploy to catch a broken or stale build.</li><li>Keep a fast rollback: redeploy the previous good image/commit.</li><li>Reverting code does not revert a database migration — plan migrations separately and carefully.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/deploying/production-checklist" target="_blank" rel="noopener">
  <span class="lc-ico">🏁</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Production Checklist</span><span class="lc-sub">Everything to verify before and after going live.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 20 · Bài 20.5 · Khép khoá</span>
<h2>Ship code chỉ là một phần của ship một thay đổi</h2>
<p class="lead">Một deploy thật hơn là đẩy JavaScript mới. Nếu bạn đổi hình dạng database thì phải migrate nó; nếu deploy hỏng thì cần một đường quay lui; và một quy trình lặp lại được, an toàn ngăn phần lớn thảm hoạ. Bài này khép vòng lặp — và khoá học.</p>

<h3>Migration database</h3>
<p>Khi mô hình dữ liệu của bạn đổi (một cột mới, một trường đổi tên), database phải đổi để khớp — thay đổi đó là một <strong>migration</strong>. Migration chạy như một phần của deploy, và là bước rủi ro nhất vì, khác code, <em>dữ liệu không thể đơn giản hoàn-tác</em>. Hai quy tắc cứu bạn: đừng bao giờ tự "sửa" một migration hỏng bằng cách ép nó qua (bạn có thể âm thầm làm hỏng dữ liệu — dừng và chẩn đoán); và nhớ rằng <em>revert code không revert database</em> — nếu một deploy xấu có kèm một migration, quay lui code để lại schema đã đổi, nên một rollback cần một kế hoạch cho dữ liệu nữa.</p>

<div class="note-ct">
<p><strong>Bài học deploy lớn nhất của cuongthai.com: một deploy đẩy MÃ NGUỒN của bạn, không phải DỮ LIỆU.</strong> Một lập trình viên seed một lô nội dung vào database <em>cục bộ</em>, rồi deploy và tưởng nó có trên production — nhưng deploy chỉ đẩy code; database của production vẫn trống. Chỉ phát hiện nhờ thật sự kiểm production bằng một curl. Điều rút ra, nay xây vào quy trình deploy: nếu nội dung cần tồn tại trên production, deploy phải kèm một bước <em>seed nó vào database production</em> — đẩy code một mình không bao giờ mang dữ liệu sang. Code và dữ liệu đi bằng phương tiện khác nhau; đừng bao giờ giả định cái này mang cái kia.</p>
</div>

<h3>Rollback: đường quay lui</h3>
<p>Khi một deploy xấu tới production, phục hồi gọn gàng là <code>git revert</code> commit xấu và deploy lại — đi tới một trạng thái tốt-đã-biết, không phải hack server bằng tay. Để cầm máu <em>trước</em>, hãy tráo về ảnh trước mà bạn đã giữ (đo bên dưới: 2.6 s, so với ~2 phút build lại), rồi mới revert để mã nguồn khớp với thứ đang chạy. Đừng bao giờ force-push đè lịch sử để "hoàn tác" một deploy. Và nếu deploy xấu đó đã chạy một migration, hãy bàn về dữ liệu trước khi revert, theo quy tắc trên.</p>

<h3>Một quy trình an toàn, lặp lại được</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Verify cục bộ</b> — type-check, build, chạy test (Chương 19). Xanh trước khi lại gần production.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Deploy với build đầy đủ</b> — không bao giờ lối tắt partial/chỉ-sync (bài 20.4). Để nó chạy migration và một smoke-test sau-deploy.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Verify production</b> — thật sự vào nó, curl các route, xác nhận thay đổi đã live (nhớ: production chạy bản build, và code ≠ dữ liệu).</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Rồi đồng bộ nguồn sự thật</b> — push lên nhánh chung một khi production đã xác nhận tốt.</div></div>
</div>
<p>Cũng để ý sự tách biệt hữu ích mà cuongthai.com chốt: <em>continuous integration</em> (CI — type-check/lint tự động ở mỗi push) được giữ tách khỏi deploy, để một push không vô tình kích hoạt một deploy production và tự đua vào một sự cố. CI gác chất lượng; một bước deploy có chủ đích mới ship. Giữ chúng tách nhau là điều làm quy trình êm.</p>

<div class="callout ok">
<p><strong>Bạn đã tới đích — cả khoá học, trong một hơi thở.</strong> Bạn bắt đầu với React (JSX, component, state, hook), học cách nó render và render lại, rồi bọc nó trong Next.js: App Router, Server vs Client Component, fetch và cache dữ liệu, định tuyến chuyên sâu, Server Actions, styling, quản lý state, auth, form và upload, và cuối cùng chiến lược render, hiệu năng, kiểm thử, và cái này — build và deploy. Bạn giờ có cả cung đường từ một thư mục trống tới một app production đang chạy, đầy đủ những cái bẫy thực tế mà một site đang chạy như cuongthai.com đã trả giá để học. Hãy dựng một thứ gì đó, deploy nó, và khi production làm bạn bất ngờ, bạn sẽ biết nhìn đâu.</p>
</div>

<h3>Một trình tự deploy khó làm sai</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Kiểm ở máy trước đã</b> — Kiểm kiểu, build, chạy thử bản đã build một lần. Một bản build hỏng trên máy chủ là đã tốn của bạn một cửa sổ deploy rồi.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Deploy bằng MỘT script</b> — Cùng một lệnh ở mọi lần, với các phép kiểm nằm bên trong nó. Một trình tự mà người ta phải nhớ là một trình tự người ta sẽ bỏ qua.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Xác minh trước khi thông báo</b> — Gọi thử route mới, đăng nhập một lần, nhìn vào log. &quot;Đã deploy&quot; và &quot;nó chạy&quot; là hai khẳng định khác nhau.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Giữ sẵn đường quay lui</b> — Hãy biết id của ảnh trước đó TRƯỚC khi tráo. Lúc đang có sự cố không phải lúc để đi tìm cái đó.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một lần deploy khởi động từ một cây làm việc còn thay đổi chưa commit.</strong> Thứ được ship là bất cứ thứ gì cơ chế deploy gom được, và nó có thể là thư mục làm việc của bạn, một file lưu dở của phiên làm việc khác, hoặc commit gần nhất — và ba thứ đó có thể khác nhau. Cả hai chiều hỏng đều có thật: một bản sửa bạn chưa commit lặng lẽ lên tới production, hoặc một bản sửa bạn nhìn thấy trên màn hình lại vắng mặt trên đó. Bộ công cụ của chính kho này hỏi xác nhận khi cây làm việc còn bẩn đúng vì lẽ đó, và nó chỉ đẩy đi phần nội dung đã commit. Thói quen gỡ bỏ cả họ vấn đề này là: commit trước, deploy sau, và xác minh bản đang chạy dựa trên một id commit chứ không dựa trên trình soạn thảo của bạn.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/deploying" target="_blank" rel="noopener">
  <span class="lc-ico">🚢</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Triển khai</span><span class="lc-sub">Các dạng đầu ra build, tự vận hành và danh sách kiểm cho từng nền tảng.</span></span>
</a>
<a class="link-card dl" href="https://docs.github.com/en/actions/deployment/about-deployments" target="_blank" rel="noopener">
  <span class="lc-ico">🤖</span>
  <span class="lc-body"><span class="lc-title">GitHub — Về deployment</span><span class="lc-sub">Đấu trình tự đó vào CI, để các phép kiểm không thể bị bỏ qua bằng tay.</span></span>
</a>


<h3>🔬 Đo thật: mã và dữ liệu, quay lui sau migration, tráo ảnh, cây làm việc bẩn (sqlite3 · Docker Desktop 29.8)</h3>
<p><strong>1 · Deploy đẩy mã, không đẩy dữ liệu</strong>:</p>
<div class="out">$ sqlite3 local.db "CREATE TABLE posts(id INTEGER PRIMARY KEY, title TEXT); INSERT INTO posts(title) VALUES ('Lesson 1'),('Lesson 2'),('Lesson 3');" &amp;&amp; echo "local.db posts: $(sqlite3 local.db 'SELECT count(*) FROM posts')"
local.db posts: 3
$ deploy = new image (code) — production keeps its OWN database
prod.db posts after deploy: 0
what the image carries: node_modules package.json public server.js </div>
<p><strong>2 · Migrate, rồi quay lui mã</strong> — v1 đọc <code>users.name</code>; v2 đi kèm migration này:</p>
<pre><code class="language-sql">-- migration shipped with v2
ALTER TABLE users RENAME COLUMN name TO full_name;</code></pre>
<div class="out">$ cd mig &amp;&amp; sqlite3 prod.db "CREATE TABLE users(id INTEGER PRIMARY KEY, name TEXT); INSERT INTO users(name) VALUES ('An'),('Binh');" &amp;&amp; sh app-v1.sh prod.db
v1 sees: An
v1 sees: Binh
$ deploy v2: run the migration, then start app v2
v2 sees: An
v2 sees: Binh
$ v2 has a bug → roll back the CODE to v1 (git revert / old image)
Parse error in 2nd command line argument: no such column: name
  SELECT 'v1 sees: ' || name FROM users ORDER BY id LIMIT 2;
$ cd mig &amp;&amp; sqlite3 prod.db ".schema users"
CREATE TABLE users(id INTEGER PRIMARY KEY, full_name TEXT);</div>
<p>Quay lui mã không quay lui cơ sở dữ liệu: lần quay lui mang sự cố trở lại. Hãy đổi tên theo kiểu <em>mở rộng → thu hẹp</em>: thêm cột mới và giữ cột cũ, deploy mã ghi cả hai, chép dữ liệu sang, rất lâu sau mới xoá cột cũ — bước nào cũng quay lui được.</p>
<p><strong>3 · Giữ ảnh trước</strong>:</p>
<div class="out">$ docker run -d --name nxj-prod -p 127.0.0.1:19347:3000 nxj-std:v2 &gt;/dev/null; sleep 4; echo "running v2: /api/hello → $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:19347/api/hello)"
running v2: /api/hello → 200
$ rollback: the previous image is still here — swap back
rolled back to the old image in 2.6 s · /api/hello → 404 · /ver → 200
$ docker images --format '{{.Repository}}:{{.Tag}} {{.ID}} {{.CreatedSince}}' | grep '^nxj-std'
nxj-std:v2 03a0ca7398cb 38 seconds ago
nxj-std:latest 6ff8e07407ee 3 minutes ago</div>
<p><strong>4 · Deploy một commit, không deploy cây làm việc</strong>:</p>
<div class="out">$ edit a file, do NOT commit, deploy
 M src/app/ver/page.tsx
$ echo "working tree:  $(grep -o 'Release v[0-9a-z-]*' src/app/ver/page.tsx)"; echo "committed HEAD: $(git show HEAD:src/app/ver/page.tsx | grep -o 'Release v[0-9a-z-]*')"
working tree:  Release v1-hotfix
committed HEAD: Release v1</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ grep -n '^info "' deploy-nha.sh | sed -E 's/^([0-9]+):info "/\\1: /; s/\\.\\.\\."$//' | head -16
507: Kiểm máy nhà
552: Gửi mã (commit \${SHA}) sang máy nhà
577: Build backend + frontend SONG SONG ở máy nhà (đo trước: ~6 phút)
633: Kiểm ảnh backend có chạy nổi không (libc ↔ engine Prisma)
676: Đẩy ảnh lên GHCR
708: Tráo container trên VPS (có khoá chống hai phiên cùng tráo)
789: Nạp lại nginx ngay (tráo container có thể đã đổi IP upstream)
807: Kiểm từ NGOÀI (qua nginx, đúng đường người dùng đi)
827: Chạy migration
866: Chạy seed nội dung (Step 3.5→3.17 từ deploy.sh)
911: Chờ backend khoẻ
931: Smoke-test các route lõi
953:   \${SO_ROUTE} route"
994: Kiểm nginx.conf trên VPS
1161: Dọn ảnh deploy CŨ trên VPS (giữ \${SHA} + latest)
1273: Kiểm lại: container có đang chạy đúng ảnh vừa tráo không
$ grep -n "git revert &lt;bad_commit_sha&gt;\\|NEVER.*migrate reset" CLAUDE.md | cut -c1-110 | head -2
50:- **NEVER** run &#96;npx prisma migrate reset&#96; — it wipes ALL data
350:git revert &lt;bad_commit_sha&gt;</div>Một script, có sẵn các phép kiểm: build đúng commit, kiểm libc ↔ engine, đẩy, tráo có khoá, nạp lại nginx, kiểm từ bên ngoài, migrate, seed nội dung, smoke test, dọn ảnh cũ (giữ ảnh trước), và kiểm lại ảnh đang chạy.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">sqlite3 prod.db "CREATE TABLE users(id INTEGER PRIMARY KEY, name TEXT)"
sqlite3 prod.db "ALTER TABLE users RENAME COLUMN name TO full_name"
sqlite3 prod.db "SELECT name FROM users"      <span class="tok-comment">  # mã cũ, sau migration</span>
docker tag app:latest app:prev &amp;&amp; docker build -t app:latest .
docker rm -f prod &amp;&amp; docker run -d --name prod -p 8080:3000 app:prev <span class="tok-comment">  # bấm giờ lần tráo lại</span></code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">“Deploy rồi — nội dung đâu?” Dữ liệu seed ở máy không bao giờ được gửi đi; production trống cho tới khi có người kiểm.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">…bạn quay lui ngay sau một migration? Mã cũ gặp hình dạng dữ liệu mới: chính lần quay lui <em>là</em> sự cố.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Cây làm việc bẩn là lỗ hổng chuỗi cung ứng: thứ gì trên đĩa — một cờ debug, tệp của phiên khác — cũng có thể bị gửi đi.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Deploy một SHA; migrate theo mở rộng → thu hẹp; smoke test sau khi tráo; giữ ảnh trước và tập tráo lại.</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/postgresql/learn?lessonSlug=postgresql-16-1-prisma-migration" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL · 16.1 — Prisma và migration</span><span class="lc-sub">Migration nhìn từ phía cơ sở dữ liệu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/github-actions/learn?lessonSlug=ga-15-3-deploy-an-toan" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">GitHub Actions · 15.3 — Deploy an toàn</span><span class="lc-sub">Environment, SSH, smoke test</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-17-6-deploy-hong-quay-lui" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 17.6 — Khi deploy nói dối</span><span class="lc-sub">Build cũ, smoke test, quay lui</span></span></a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết một checklist ngắn trước-deploy: kiểm kiểu, build, chạy smoke test, xác nhận env var.</li>
<li>Tập một lần rollback: deploy lại ảnh/commit trước và xác nhận site phục hồi.</li>
<li>Để ý revert code không revert một migration database — hãy lên kế hoạch migration riêng.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn theo được một luồng deploy an toàn và thực hiện được một rollback.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Checklist trước-deploy</span><span class="v">Kiểm kiểu, build, smoke test, kiểm env trước khi ship.</span></div>
  <div class="kv"><span class="k">Smoke test</span><span class="v">Gọi các route lõi sau deploy để bắt một build hỏng.</span></div>
  <div class="kv"><span class="k">Rollback</span><span class="v">Deploy lại ảnh/commit tốt trước đó để phục hồi nhanh.</span></div>
  <div class="kv"><span class="k">Migration</span><span class="v">Một thay đổi schema database — không được hoàn tác bởi revert code.</span></div>
  <div class="kv"><span class="k">Migration một chiều</span><span class="v">Lên kế hoạch thay đổi DB để an toàn và lùi được theo kế hoạch.</span></div>
  <div class="kv"><span class="k">Luồng an toàn</span><span class="v">Một thứ tự bước lặp lại được, ngăn sự cố.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Theo một checklist trước-deploy lặp lại được: kiểm kiểu, build, smoke test, xác nhận env var.</li><li>Smoke-test các route lõi sau mỗi deploy để bắt một build hỏng hoặc cũ.</li><li>Giữ một rollback nhanh: deploy lại ảnh/commit tốt trước đó.</li><li>Revert code không revert một migration database — hãy lên kế hoạch migration riêng và cẩn thận.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/deploying/production-checklist" target="_blank" rel="noopener">
  <span class="lc-ico">🏁</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Production Checklist</span><span class="lc-sub">Mọi thứ cần verify trước và sau khi go-live.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 20.6 QUIZ ─────────────────────────── */
    {
      title: '20.6 — Chapter 20 quiz|||20.6 — Kiểm tra chương 20',
      slug: 'nextjs-20-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về build & deploy: dev vs build vs start, NEXT_PUBLIC bake-lúc-build + không đặt khoá bí mật, Docker container, họ bug build-cũ (route 404/public chốt lúc start/CDN cache 404), migration + code≠data, rollback. Mốc PT3, khép khoá.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 20: dev vs build vs start, the NEXT_PUBLIC trap, Docker, the stale-build bugs, migrations and code-vs-data, and rollback. This is the PT3 milestone — the end of the course.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 20: dev vs build vs start, bẫy NEXT_PUBLIC, Docker, các bug build-cũ, migration và code-vs-data, và rollback. Đây là mốc PT3 — kết thúc khoá học.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does next build do?|||next build làm gì?',
            options: [
              'starts the dev server|||khởi động dev server',
              'creates the optimised production build (compiled, minified, pre-rendered) in .next|||tạo bản build production tối ưu (biên dịch, minify, pre-render) trong .next',
              'deploys to a server|||deploy lên server',
              'runs the tests|||chạy test',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The big mental model of this chapter is…|||Mô hình tư duy lớn của chương này là…',
            options: [
              'production runs your raw source files|||production chạy file nguồn thô của bạn',
              'production runs the BUILD, not your source — some things are frozen at build time|||production chạy BẢN BUILD, không phải nguồn — vài thứ đóng băng lúc build',
              'dev and production are identical|||dev và production y hệt',
              'you never need to rebuild|||không bao giờ cần build lại',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A variable named NEXT_PUBLIC_X is…|||Một biến tên NEXT_PUBLIC_X là…',
            options: [
              'a server-only secret|||một bí mật chỉ-server',
              'baked into the browser bundle at build time and readable by anyone — never put secrets here|||nướng vào bundle trình duyệt lúc build và ai cũng đọc được — đừng bao giờ đặt bí mật ở đây',
              'read fresh at runtime|||đọc tươi lúc chạy',
              'automatically encrypted|||tự động mã hoá',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You changed a NEXT_PUBLIC_ value and restarted the server, but the old value persists. Why?|||Bạn đổi một giá trị NEXT_PUBLIC_ và khởi động lại server, nhưng giá trị cũ vẫn còn. Vì sao?',
            options: [
              'the browser cached it|||trình duyệt cache nó',
              'NEXT_PUBLIC_ values are baked in at build — you must rebuild, not just restart|||giá trị NEXT_PUBLIC_ nướng vào lúc build — phải build lại, không chỉ khởi động lại',
              'the variable name is wrong|||tên biến sai',
              'restarting always fixes it|||khởi động lại luôn sửa được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Where should a third-party API key (e.g. GIPHY) go?|||Một khoá API bên thứ ba (ví dụ GIPHY) nên đặt ở đâu?',
            options: [
              'in a NEXT_PUBLIC_ variable for the client|||trong một biến NEXT_PUBLIC_ cho client',
              'server-side, behind a small backend proxy the browser calls|||phía server, sau một proxy backend nhỏ mà trình duyệt gọi',
              'hard-coded in the component|||ghi cứng trong component',
              'in localStorage|||trong localStorage',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is a Docker container?|||Một Docker container là gì?',
            options: [
              'a type of database|||một loại database',
              'a sealed box packaging the app with everything it needs, so it runs the same everywhere|||một cái hộp kín gói app cùng mọi thứ nó cần, để nó chạy giống nhau ở mọi nơi',
              'a CSS framework|||một framework CSS',
              'a testing tool|||một công cụ test',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A newly added route returns 404 on production though the code is in the repo. Likely cause?|||Một route mới thêm trả 404 trên production dù code trong repo. Nguyên nhân có thể?',
            options: [
              'the route name is wrong|||tên route sai',
              'a stale/partial build — the running container is an old image; do a full rebuild|||một build cũ/thiếu — container đang chạy là image cũ; hãy build lại đầy đủ',
              'React is broken|||React hỏng',
              'the database is down|||database sập',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A page hangs forever after changing files in public/, with no errors. The cause?|||Một trang treo mãi sau khi đổi file trong public/, không lỗi nào. Nguyên nhân?',
            options: [
              'a CSS bug|||một bug CSS',
              'Next locks the public/ file list at server startup; renamed files 404 until you restart|||Next chốt danh sách file public/ lúc khởi động; file đổi tên 404 tới khi khởi động lại',
              'too much JavaScript|||quá nhiều JavaScript',
              'the browser is old|||trình duyệt cũ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The biggest deploy lesson from cuongthai.com is…|||Bài học deploy lớn nhất của cuongthai.com là…',
            options: [
              'always deploy on Friday|||luôn deploy vào thứ Sáu',
              'a deploy ships CODE, not DATA — content must be seeded into the production DB, not assumed to travel with code|||một deploy đẩy CODE, không phải DATA — nội dung phải seed vào DB production, đừng giả định nó đi cùng code',
              'never use a database|||đừng bao giờ dùng database',
              'code and data are the same|||code và dữ liệu là một',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The safe way to undo a bad deploy is…|||Cách an toàn để hoàn tác một deploy xấu là…',
            options: [
              'git push --force over history|||git push --force đè lịch sử',
              'git revert the bad commit and deploy again (and plan for the data if a migration ran)|||git revert commit xấu và deploy lại (và tính cho dữ liệu nếu có migration)',
              'edit files directly on the server|||sửa file thẳng trên server',
              'delete the database|||xoá database',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
