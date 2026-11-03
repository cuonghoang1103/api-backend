/**
 * Bài 14.3 — Đưa lên hosting (nâng cấp 01/11/2026). Output: máy chủ tĩnh tí hon + smoke test + curl, Node 22.23.3, chạy thật
 * trên dist/ của dự án _demo/_t14. Deck: scripts/slides-src/wf-14-3.mjs (11 slide).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-14-3', 'Deploying', 'Đưa lên hosting', [
  [1, 'Deploying',
    '<p>You have a <code>dist/</code> folder. Deploying means making it reachable by anyone, at an address, over HTTPS, with the right rules — and knowing it worked. This lesson shows what a host actually does by building a tiny one yourself.</p>',
    '<p>Bạn đã có thư mục <code>dist/</code>. Deploy nghĩa là làm cho nó truy cập được bởi bất kỳ ai, ở một địa chỉ, qua HTTPS, với đúng luật — và biết chắc là đã thành công. Bài này cho thấy một máy chủ hosting thật sự làm gì bằng cách tự dựng một cái nhỏ.</p>'],
  [2, 'After this lesson you can…',
    '<p>Five skills. Two of them fix the most common first-deploy surprises: the single-page app that shows 404 when you refresh a page, and the site that keeps showing the old version after a deploy.</p>',
    '<p>Năm kỹ năng. Hai trong số đó sửa những bất ngờ hay gặp nhất ở lần deploy đầu: ứng dụng một trang báo 404 khi bạn tải lại một trang, và trang web vẫn hiện bản cũ sau khi deploy.</p>'],
  [3, 'Four steps',
    '<p>Build on a clean machine, upload the right folder, serve it with the right rules, and verify the live site. Each step fails in its own way, so each needs its own check.</p>',
    '<p>Build trên một máy sạch, tải lên đúng thư mục, phục vụ nó với đúng luật, và kiểm trang thật. Mỗi bước hỏng theo kiểu riêng, nên mỗi bước cần phép kiểm riêng.</p>'],
  [4, 'Where to host',
    '<p>Static hosts serve files only and are perfect for portfolios and single-page apps. Platforms such as Vercel add server functions. Your own server gives full control at the cost of maintenance. Under the hood they all do the same four steps.</p>',
    '<p>Máy chủ tĩnh chỉ phục vụ file và hoàn hảo cho portfolio và ứng dụng một trang. Các nền tảng như Vercel thêm hàm chạy phía máy chủ. Máy chủ riêng cho toàn quyền nhưng tốn công bảo trì. Bên dưới, tất cả đều làm cùng bốn bước.</p>'],
  [5, 'A tiny host',
    '<p>Thirty lines of Node.js that do what a static host does: find the requested file inside <code>dist/</code>, optionally fall back to <code>index.html</code> for application routes, and send a cache header that depends on the kind of file.</p>',
    '<p>Ba mươi dòng Node.js làm đúng việc một máy chủ tĩnh làm: tìm file được yêu cầu trong <code>dist/</code>, tuỳ chọn lùi về <code>index.html</code> cho các đường dẫn của ứng dụng, và gửi header lưu đệm tuỳ loại file.</p>'],
  [6, 'The SPA trap',
    '<p>The smoke test ran against both modes. Without the fallback, the client-side route <code>/products/42</code> returns 404: no file has that name. With the fallback, the host returns <code>index.html</code>, your JavaScript router reads the address, and the page works. Every static host has a setting for this.</p>',
    '<p>Smoke test chạy trên cả hai chế độ. Không có fallback, đường dẫn phía client <code>/products/42</code> trả 404: không file nào có tên đó. Có fallback, máy chủ trả <code>index.html</code>, router JavaScript của bạn đọc địa chỉ, và trang chạy. Máy chủ tĩnh nào cũng có cài đặt cho việc này.</p>'],
  [7, 'Cache headers',
    '<p>Two real responses. The HTML is sent with <code>no-cache</code>, so the browser always checks for a new version. The hashed JavaScript file is sent with a one-year, immutable cache, which is safe because its name changes whenever its content does.</p>',
    '<p>Hai phản hồi thật. HTML được gửi với <code>no-cache</code>, nên trình duyệt luôn kiểm tra bản mới. File JavaScript có mã băm được gửi với bộ đệm một năm, không đổi — an toàn vì tên của nó đổi mỗi khi nội dung đổi.</p>'],
  [8, 'Smoke test',
    '<p>A smoke test is a handful of cheap requests run right after a deploy: the home page, a static file, an application route. It exits with 1 if anything is wrong, so a script or CI can stop or roll back. "The deploy command finished" is not proof; a green smoke test is.</p>',
    '<p>Smoke test là vài request rẻ chạy ngay sau deploy: trang chủ, một file tĩnh, một đường dẫn của ứng dụng. Nó thoát với mã 1 nếu có gì sai, để script hay CI dừng lại hoặc quay lui. "Lệnh deploy đã chạy xong" không phải bằng chứng; smoke test xanh mới là.</p>'],
  [9, 'HTTPS and a domain',
    '<p>Point your domain’s DNS at the host, let it issue a free certificate, and redirect HTTP to HTTPS. Public environment variables are set in the host’s dashboard — and because they are baked in at build time, changing one means rebuilding.</p>',
    '<p>Trỏ DNS của tên miền tới máy chủ, để nó cấp chứng chỉ miễn phí, và chuyển hướng HTTP sang HTTPS. Biến môi trường công khai đặt trong bảng điều khiển của máy chủ — và vì chúng được nướng vào lúc dựng, đổi một biến nghĩa là phải build lại.</p>'],
  [10, 'Deploy traps',
    '<p>Four classic mistakes, each with a one-line fix: upload <code>dist/</code>, not the source; rebuild after changing build-time variables; never cache the HTML for long; and define success as a green smoke test.</p>',
    '<p>Bốn lỗi kinh điển, mỗi lỗi một dòng sửa: tải lên <code>dist/</code>, không phải mã nguồn; build lại sau khi đổi biến lúc dựng; không bao giờ lưu đệm HTML lâu; và coi thành công là smoke test xanh.</p>'],
  [11, 'Summary & practice',
    '<p>The practice is a real deploy to a free static host. The two "Done when" checks — refreshing a client route and reading the headers with <code>curl</code> — catch the two problems this lesson is about.</p>',
    '<p>Bài luyện là một lần deploy thật lên một máy chủ tĩnh miễn phí. Hai phép kiểm "Xong khi" — tải lại một đường dẫn phía client và đọc header bằng <code>curl</code> — bắt đúng hai vấn đề bài này nói tới.</p>'],
]);

export default {
  title: '14.3 — Deploying|||14.3 — Đưa lên hosting',
  slug: 'wf-14-3-deploy',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Deploy = build → tải lên → phục vụ → kiểm chứng, chọn nơi hosting, tự dựng máy chủ tĩnh tí hon, bẫy 404 khi tải lại trang của ứng dụng một trang (smoke test thật), header lưu đệm cho HTML và file có mã băm (curl thật), smoke test sau mỗi lần deploy, HTTPS và tên miền.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.3</span>
<h2>Getting dist/ onto the internet — and proving it works</h2>
<p class="lead">After this lesson you can describe what any host does with your build, choose between a static host, a platform and your own server, fix the "404 when I refresh a page" problem of single-page apps, set cache headers that make repeat visits instant without ever showing a stale version, and verify a deploy with a smoke test instead of hoping. Why it matters: "deployed" is the moment your work reaches people. The two bugs taught here — the refresh 404 and the stale old version — are the most common surprises of a first deploy, and both are invisible on your laptop.</p>

<h3>Step 1 — deploy is four steps</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Build</span><span class="lz-d">On a clean machine: <code>npm ci &amp;&amp; npm run build</code>. Hosts and CI do this, not your laptop.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Upload</span><span class="lz-d">The <code>dist/</code> folder — not the source, not <code>node_modules</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Serve</span><span class="lz-d">At a domain, over HTTPS, with rules: fallback for app routes, cache headers, redirects.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Verify</span><span class="lz-d">Run a smoke test against the live address. Only a green check means "deployed".</span></div>
</div>

<h3>Step 2 — where to host</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Static host</span><span class="v">GitHub Pages, Netlify, Cloudflare Pages. Files only (HTML/CSS/JS). Free tiers are generous; ideal for portfolios and single-page apps.</span></div>
  <div class="kv"><span class="k">Platform (PaaS)</span><span class="v">Vercel, Render, Railway. Static files plus server functions/APIs; the natural home of Next.js.</span></div>
  <div class="kv"><span class="k">Your own server</span><span class="v">A VPS with nginx (the Deploy course). Full control, but security updates, certificates and restarts are your job.</span></div>
</div>
<p>Different dashboards, same job. To see what that job is, here is a host small enough to read in one minute.</p>

<h3>Step 3 — a static host in thirty lines</h3>
${ma('javascript', CODE['_t14/server.mjs'])}
<p>It does three things: maps the URL path to a file inside <code>dist/</code> (refusing paths that escape the folder), falls back to <code>index.html</code> for paths without a file extension when started with <code>--spa</code>, and sends a cache header that depends on whether the file is a hashed asset. Real hosts do exactly this, plus compression and HTTPS.</p>

<h3>Step 4 — the single-page-app trap: 404 on refresh</h3>
${ma('javascript', CODE['_t14/smoke.mjs'])}
${ra(OUT['_t14/out/smoke-nospa'])}
${ra(OUT['_t14/out/smoke-spa'])}
<p>In a single-page app (React Router, Vue Router), <code>/products/42</code> is not a file — it is a state of your JavaScript. Clicking a link inside the app works because no request reaches the server. But refreshing the page, or opening a shared link, asks the server for a file called <code>products/42</code>; a plain static server has none and answers 404 (first run). With the fallback the server answers with <code>index.html</code>, the app starts, the router reads the address and shows product 42 (second run).</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — testing only by clicking.</strong> Navigation inside the app never asks the server, so everything looks fine until a user refreshes or opens a link from a chat. Always test a deep link directly. Host settings: Netlify <code>_redirects</code> with <code>/* /index.html 200</code>, Vercel <code>rewrites</code>, nginx <code>try_files $uri /index.html</code>, GitHub Pages a copy of <code>index.html</code> named <code>404.html</code>.</p></div>

<h3>Step 5 — cache headers: fast and never stale</h3>
${ra(OUT['_t14/out/headers'])}
<div class="kv-grid">
  <div class="kv"><span class="k">index.html → no-cache</span><span class="v">The browser may keep a copy but must ask the server "is it still current?" every time. So a new deploy is seen on the next visit.</span></div>
  <div class="kv"><span class="k">/assets/index-27wt_Xcd.js → max-age=31536000, immutable</span><span class="v">Keep it for a year and do not even ask. Safe because a changed file gets a new name (lesson 14.1), and the fresh HTML points at the new name.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — caching the HTML for a long time.</strong> If <code>index.html</code> is cached for a day, users keep loading yesterday's HTML, which points at yesterday's asset names. After you delete old assets, they get a blank page; if you keep them, they see the old site and report "your fix doesn't work". HTML: <code>no-cache</code>; hashed assets: long and immutable. Many hosts do this by default — check with <code>curl -sI</code>, never assume.</p></div>

<h3>Step 6 — HTTPS, a domain, and environment variables on the host</h3>
<ol>
<li>Buy a domain and add a DNS record (<code>CNAME</code> or <code>A</code>) that points at the host, as the host's documentation says.</li>
<li>The host issues a free TLS certificate (usually Let's Encrypt) — your site now works on <code>https://</code>. Turn on the HTTP → HTTPS redirect.</li>
<li>Set public build variables (<code>VITE_API_URL</code>) in the host's dashboard. They are baked in at build time (lesson 14.2), so after changing one, trigger a new build — restarting is not enough.</li>
<li>Run the smoke test against the real domain.</li>
</ol>
<div class="pitfall co-tieu-de"><p><strong>Trap — "the deploy succeeded" because the command finished.</strong> A deploy command can report success while the site serves an old build, a 404 for a route, or a blank page because of a missing variable. The definition of done is a green smoke test against the live URL — and in a team, a deploy script that runs it automatically and stops (or rolls back) when it is red.</p></div>

<div class="callout ok">
<p><strong>🧪 Practice (30 minutes)</strong></p>
<p>Take the Vite project from lesson 14.1, add a client-side route (for example, show a different heading when <code>location.pathname === '/about'</code>), and deploy it to Netlify or GitHub Pages (both free). Configure the SPA fallback. Then run the smoke test from this lesson against your live URL, with <code>/about</code> in the list of checks.</p>
<p><strong>Done when:</strong> opening <code>https://your-site/about</code> directly (and pressing refresh) shows the about heading, not a 404; <code>curl -sI https://your-site/</code> shows a no-cache style header and <code>curl -sI</code> on the JS file shows a long max-age; and <code>node smoke.mjs https://your-site</code> prints "all checks passed" with exit code 0. Code Lab module 14.3 grades a fallback resolver and a cache-header policy.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">deploy</span><span class="v">triển khai — đưa bản dựng lên nơi người dùng truy cập được.</span></div>
  <div class="kv"><span class="k">static host / PaaS / VPS</span><span class="v">máy chủ tĩnh / nền tảng dịch vụ / máy chủ ảo riêng.</span></div>
  <div class="kv"><span class="k">SPA fallback (rewrite)</span><span class="v">lùi về index.html — cho đường dẫn của ứng dụng một trang.</span></div>
  <div class="kv"><span class="k">client-side route</span><span class="v">đường dẫn phía client — do JavaScript xử lý, không phải file.</span></div>
  <div class="kv"><span class="k">Cache-Control</span><span class="v">header lưu đệm — no-cache, max-age, immutable.</span></div>
  <div class="kv"><span class="k">smoke test</span><span class="v">kiểm khói — vài request nhanh xác nhận trang thật sự chạy.</span></div>
  <div class="kv"><span class="k">TLS certificate</span><span class="v">chứng chỉ TLS — cho phép HTTPS.</span></div>
  <div class="kv"><span class="k">DNS record</span><span class="v">bản ghi DNS — trỏ tên miền tới máy chủ.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Deploy = build on a clean machine → upload <code>dist/</code> → serve with rules over HTTPS → verify.</li>
  <li>Static hosts, platforms and VPSs differ in effort and power, not in these four steps.</li>
  <li>Single-page apps need a fallback to <code>index.html</code>, or refreshing a route gives 404.</li>
  <li><code>index.html</code>: <code>no-cache</code>; hashed assets: one year, immutable — fast and never stale.</li>
  <li>Changing build-time variables needs a rebuild; "deployed" means a green smoke test on the live URL.</li>
</ul>
${nguon('📗', 'Vite — Deploying a Static Site', 'Step-by-step guides for GitHub Pages, Netlify, Vercel, Cloudflare and more', 'https://vite.dev/guide/static-deploy.html')}
${nguon('📘', 'MDN — HTTP caching', 'Cache-Control, revalidation and the "cache busting" pattern', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching')}
${lienKet({ khoa: 'git', bai: 'git-15-2-github-pages', title: 'Git & GitHub 15.2 — GitHub Pages: publishing a React/Vite portfolio', sub: 'A free first deploy, including the 404.html trick', cta: 'Open lesson' })}
${lienKet({ khoa: 'deploy-vps', bai: 'deploy-0-1-bon-buoc', title: 'Deploy 0.1 — four steps, and four ways they break', sub: 'The same four steps on your own server, done by hand and then automated', cta: 'Open lesson' })}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-20-4-vps-stale-build', title: 'Next.js 20.4 — deploying to a VPS, and the "stale build" family of bugs', sub: 'What happens when the server keeps serving an old build', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.3</span>
<h2>Đưa dist/ lên Internet — và chứng minh nó chạy</h2>
<p class="lead">Học xong bài này bạn mô tả được bất kỳ máy chủ hosting nào làm gì với bản dựng của bạn, chọn giữa máy chủ tĩnh, nền tảng và máy chủ riêng, sửa được lỗi "404 khi tải lại trang" của ứng dụng một trang, đặt header lưu đệm làm lần truy cập sau tức thì mà không bao giờ hiện bản cũ, và kiểm chứng một lần deploy bằng smoke test thay vì cầu may. Vì sao cần: "đã deploy" là khoảnh khắc công sức của bạn tới tay mọi người. Hai bug dạy ở đây — 404 khi tải lại và bản cũ không chịu đi — là những bất ngờ phổ biến nhất của lần deploy đầu, và cả hai đều vô hình trên laptop của bạn.</p>

<h3>Bước 1 — deploy gồm bốn bước</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Build</span><span class="lz-d">Trên một máy sạch: <code>npm ci &amp;&amp; npm run build</code>. Máy chủ hosting và CI làm việc này, không phải laptop của bạn.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tải lên</span><span class="lz-d">Thư mục <code>dist/</code> — không phải mã nguồn, không phải <code>node_modules</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Phục vụ</span><span class="lz-d">Ở một tên miền, qua HTTPS, với luật: fallback cho đường dẫn ứng dụng, header lưu đệm, chuyển hướng.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Kiểm chứng</span><span class="lz-d">Chạy smoke test vào địa chỉ thật. Chỉ dấu xanh mới nghĩa là "đã deploy".</span></div>
</div>

<h3>Bước 2 — hosting ở đâu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Máy chủ tĩnh</span><span class="v">GitHub Pages, Netlify, Cloudflare Pages. Chỉ file (HTML/CSS/JS). Gói miễn phí rộng rãi; lý tưởng cho portfolio và ứng dụng một trang.</span></div>
  <div class="kv"><span class="k">Nền tảng (PaaS)</span><span class="v">Vercel, Render, Railway. File tĩnh cộng hàm/API chạy phía máy chủ; ngôi nhà tự nhiên của Next.js.</span></div>
  <div class="kv"><span class="k">Máy chủ riêng</span><span class="v">Một VPS với nginx (khoá Deploy). Toàn quyền, nhưng cập nhật bảo mật, chứng chỉ và khởi động lại là việc của bạn.</span></div>
</div>
<p>Bảng điều khiển khác nhau, công việc như nhau. Để thấy công việc đó là gì, đây là một máy chủ đủ nhỏ để đọc trong một phút.</p>

<h3>Bước 3 — một máy chủ tĩnh trong ba mươi dòng</h3>
${ma('javascript', CODE['_t14/server.mjs'])}
<p>Nó làm ba việc: ánh xạ đường dẫn URL tới một file trong <code>dist/</code> (từ chối đường dẫn thoát ra ngoài thư mục), lùi về <code>index.html</code> cho các đường dẫn không có đuôi file khi khởi động với <code>--spa</code>, và gửi header lưu đệm tuỳ theo file có phải asset có mã băm hay không. Máy chủ thật làm đúng những việc này, cộng thêm nén và HTTPS.</p>

<h3>Bước 4 — bẫy của ứng dụng một trang: 404 khi tải lại</h3>
${ma('javascript', CODE['_t14/smoke.mjs'])}
${ra(OUT['_t14/out/smoke-nospa'])}
${ra(OUT['_t14/out/smoke-spa'])}
<p>Trong ứng dụng một trang (React Router, Vue Router), <code>/products/42</code> không phải một file — nó là một trạng thái của JavaScript. Bấm link bên trong ứng dụng thì chạy, vì không có request nào tới máy chủ. Nhưng tải lại trang, hay mở một link được chia sẻ, là hỏi máy chủ một file tên <code>products/42</code>; máy chủ tĩnh thường không có và trả 404 (lần chạy đầu). Có fallback, máy chủ trả về <code>index.html</code>, ứng dụng khởi động, router đọc địa chỉ và hiện sản phẩm 42 (lần chạy thứ hai).</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chỉ test bằng cách bấm.</strong> Điều hướng bên trong ứng dụng không bao giờ hỏi máy chủ, nên mọi thứ trông ổn cho tới khi người dùng tải lại hay mở link từ một đoạn chat. Luôn test một link sâu bằng cách mở trực tiếp. Cài đặt theo từng nơi: Netlify file <code>_redirects</code> với <code>/* /index.html 200</code>, Vercel <code>rewrites</code>, nginx <code>try_files $uri /index.html</code>, GitHub Pages một bản sao <code>index.html</code> đặt tên <code>404.html</code>.</p></div>

<h3>Bước 5 — header lưu đệm: nhanh mà không bao giờ cũ</h3>
${ra(OUT['_t14/out/headers'])}
<div class="kv-grid">
  <div class="kv"><span class="k">index.html → no-cache</span><span class="v">Trình duyệt được giữ bản sao nhưng phải hỏi máy chủ "còn mới không?" mỗi lần. Nên lần deploy mới được thấy ngay ở lần truy cập tiếp theo.</span></div>
  <div class="kv"><span class="k">/assets/index-27wt_Xcd.js → max-age=31536000, immutable</span><span class="v">Giữ một năm và đừng hỏi lại. An toàn vì file đổi sẽ có tên mới (bài 14.1), và HTML mới trỏ tới tên mới.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — lưu đệm HTML lâu.</strong> Nếu <code>index.html</code> được lưu đệm một ngày, người dùng cứ nạp HTML của hôm qua, vốn trỏ tới tên asset của hôm qua. Bạn xoá asset cũ thì họ thấy trang trắng; bạn giữ thì họ thấy trang cũ và báo "bản sửa của anh không ăn". HTML: <code>no-cache</code>; asset có mã băm: lâu và immutable. Nhiều máy chủ làm sẵn như vậy — hãy kiểm bằng <code>curl -sI</code>, đừng bao giờ giả định.</p></div>

<h3>Bước 6 — HTTPS, tên miền, và biến môi trường trên máy chủ</h3>
<ol>
<li>Mua tên miền và thêm một bản ghi DNS (<code>CNAME</code> hoặc <code>A</code>) trỏ tới máy chủ, theo đúng tài liệu của máy chủ.</li>
<li>Máy chủ cấp chứng chỉ TLS miễn phí (thường là Let's Encrypt) — trang của bạn giờ chạy trên <code>https://</code>. Bật chuyển hướng HTTP → HTTPS.</li>
<li>Đặt các biến công khai lúc dựng (<code>VITE_API_URL</code>) trong bảng điều khiển của máy chủ. Chúng được nướng vào lúc dựng (bài 14.2), nên đổi một biến xong phải kích một lần build mới — khởi động lại là không đủ.</li>
<li>Chạy smoke test vào tên miền thật.</li>
</ol>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "deploy thành công" vì lệnh chạy xong.</strong> Một lệnh deploy có thể báo thành công trong khi trang đang phục vụ bản build cũ, trả 404 cho một đường dẫn, hoặc trang trắng vì thiếu biến. Định nghĩa của "xong" là smoke test xanh trên URL thật — và trong nhóm, là một script deploy tự chạy nó và dừng (hoặc quay lui) khi đỏ.</p></div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (30 phút)</strong></p>
<p>Lấy dự án Vite ở bài 14.1, thêm một đường dẫn phía client (ví dụ hiện tiêu đề khác khi <code>location.pathname === '/about'</code>), và deploy lên Netlify hoặc GitHub Pages (đều miễn phí). Cấu hình fallback cho ứng dụng một trang. Rồi chạy smoke test của bài này vào URL thật, có <code>/about</code> trong danh sách kiểm.</p>
<p><strong>Xong khi:</strong> mở thẳng <code>https://trang-của-bạn/about</code> (và bấm tải lại) hiện tiêu đề about, không phải 404; <code>curl -sI https://trang-của-bạn/</code> cho header kiểu no-cache và <code>curl -sI</code> vào file JS cho max-age dài; và <code>node smoke.mjs https://trang-của-bạn</code> in "all checks passed" với mã thoát 0. Code Lab module 14.3 chấm một bộ giải fallback và một chính sách header lưu đệm.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">deploy</span><span class="v">triển khai — đưa bản dựng lên nơi người dùng truy cập được.</span></div>
  <div class="kv"><span class="k">static host / PaaS / VPS</span><span class="v">máy chủ tĩnh / nền tảng dịch vụ / máy chủ ảo riêng.</span></div>
  <div class="kv"><span class="k">SPA fallback (rewrite)</span><span class="v">lùi về index.html — cho đường dẫn của ứng dụng một trang.</span></div>
  <div class="kv"><span class="k">client-side route</span><span class="v">đường dẫn phía client — do JavaScript xử lý, không phải file.</span></div>
  <div class="kv"><span class="k">Cache-Control</span><span class="v">header lưu đệm — no-cache, max-age, immutable.</span></div>
  <div class="kv"><span class="k">smoke test</span><span class="v">kiểm khói — vài request nhanh xác nhận trang thật sự chạy.</span></div>
  <div class="kv"><span class="k">TLS certificate</span><span class="v">chứng chỉ TLS — cho phép HTTPS.</span></div>
  <div class="kv"><span class="k">DNS record</span><span class="v">bản ghi DNS — trỏ tên miền tới máy chủ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Deploy = build trên máy sạch → tải <code>dist/</code> lên → phục vụ với luật qua HTTPS → kiểm chứng.</li>
  <li>Máy chủ tĩnh, nền tảng và VPS khác nhau ở công sức và sức mạnh, không khác ở bốn bước này.</li>
  <li>Ứng dụng một trang cần fallback về <code>index.html</code>, nếu không tải lại một đường dẫn sẽ ra 404.</li>
  <li><code>index.html</code>: <code>no-cache</code>; asset có mã băm: một năm, immutable — nhanh mà không bao giờ cũ.</li>
  <li>Đổi biến lúc dựng thì phải build lại; "đã deploy" nghĩa là smoke test xanh trên URL thật.</li>
</ul>
${nguon('📗', 'Vite — Deploying a Static Site', 'Hướng dẫn từng bước cho GitHub Pages, Netlify, Vercel, Cloudflare và nhiều nơi khác', 'https://vite.dev/guide/static-deploy.html')}
${nguon('📘', 'MDN — HTTP caching', 'Cache-Control, xác thực lại và mẫu "cache busting"', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching')}
${lienKet({ khoa: 'git', bai: 'git-15-2-github-pages', title: 'Git & GitHub 15.2 — GitHub Pages: xuất bản portfolio React/Vite', sub: 'Một lần deploy đầu tiên miễn phí, kèm mẹo 404.html', cta: 'Mở bài' })}
${lienKet({ khoa: 'deploy-vps', bai: 'deploy-0-1-bon-buoc', title: 'Deploy 0.1 — bốn bước, và bốn kiểu hỏng', sub: 'Cùng bốn bước đó trên máy chủ riêng, làm tay rồi tự động hoá', cta: 'Mở bài' })}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-20-4-vps-stale-build', title: 'Next.js 20.4 — deploy lên VPS, và họ bug "build cũ"', sub: 'Chuyện gì xảy ra khi máy chủ cứ phục vụ một bản build cũ', cta: 'Mở bài' })}
</div>
`,
};
