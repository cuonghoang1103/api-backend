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

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/deploying" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Deploying</span><span class="lc-sub">Bản build production, tự-host, Docker, và các lựa chọn hosting.</span></span>
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
<div class="ml-en">
<span class="eyebrow">Chapter 20 · Lesson 20.2</span>
<h2>Config and secrets live in environment variables — but there are two kinds</h2>
<p class="lead">An <strong>environment variable</strong> (env var) is a setting kept outside your code — a database URL, an API key, a feature flag — so the same code can run in dev and production with different values, and secrets never sit in your source. In Next.js there are two very different kinds, and confusing them causes real bugs.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Server-only env (e.g. DATABASE_URL)</span><span class="v">Read at <em>runtime</em>, only on the server. The browser never sees it. This is where secrets belong — API keys, DB passwords.</span></div>
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
  <div class="kv"><span class="k">Env chỉ-server (ví dụ DATABASE_URL)</span><span class="v">Đọc lúc <em>chạy</em>, chỉ trên server. Trình duyệt không bao giờ thấy nó. Đây là nơi bí mật thuộc về — khoá API, mật khẩu DB.</span></div>
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

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/configuring/environment-variables" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Environment Variables</span><span class="lc-sub">Server vs NEXT_PUBLIC_, nướng lúc build, và file .env.</span></span>
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
RUN npm ci                 <span class="tok-comment"># install exact dependencies</span>
COPY . .
RUN npm run build          <span class="tok-comment"># next build → the production build</span>
CMD ["npm", "start"]       <span class="tok-comment"># next start when the container runs</span></code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">Image vs container</span><span class="v">The <em>image</em> is the built box (a template). A <em>container</em> is a running instance of that image. Build the image once, run many containers from it.</span></div>
  <div class="kv"><span class="k">Reproducible</span><span class="v">The same image runs the same on your laptop, a teammate's, and the server. No "works here, not there."</span></div>
  <div class="kv"><span class="k">Next standalone output</span><span class="v">Next can output a trimmed <em>standalone</em> build with only the files needed to run — a much smaller, faster Docker image. Enabled with <code>output: 'standalone'</code> in the config.</span></div>
</div>

<div class="callout ok">
<p><strong>Why cuongthai.com uses Docker:</strong> the site runs its Next.js frontend and its backend as containers on a VPS. Containerising means a deploy builds a fresh, self-contained image and swaps it in — the server never accumulates mismatched Node versions or half-installed packages. The whole app moves as one predictable box.</p>
</div>

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
RUN npm ci                 <span class="tok-comment"># cài đúng dependency</span>
COPY . .
RUN npm run build          <span class="tok-comment"># next build → bản build production</span>
CMD ["npm", "start"]       <span class="tok-comment"># next start khi container chạy</span></code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">Image vs container</span><span class="v"><em>Image</em> là cái hộp đã build (một khuôn). Một <em>container</em> là một bản đang chạy của image đó. Build image một lần, chạy nhiều container từ nó.</span></div>
  <div class="kv"><span class="k">Tái lập được</span><span class="v">Cùng image chạy giống nhau trên laptop bạn, của đồng đội, và server. Không "chạy đây, không chạy kia".</span></div>
  <div class="kv"><span class="k">Standalone output của Next</span><span class="v">Next có thể xuất một bản <em>standalone</em> gọn chỉ với file cần để chạy — một Docker image nhỏ và nhanh hơn nhiều. Bật bằng <code>output: 'standalone'</code> trong config.</span></div>
</div>

<div class="callout ok">
<p><strong>Vì sao cuongthai.com dùng Docker:</strong> site chạy frontend Next.js và backend của nó như các container trên một VPS. Container hoá nghĩa là một deploy build một image tươi, tự-chứa và tráo nó vào — server không bao giờ tích tụ phiên bản Node lệch hay package cài nửa chừng. Cả app di chuyển như một cái hộp đoán trước được.</p>
</div>

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

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/deploying#self-hosting" target="_blank" rel="noopener">
  <span class="lc-ico">🖧</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Self-hosting</span><span class="lc-sub">Tự chạy một server Next.js production, trên VPS hoặc container.</span></span>
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
<p>When a bad deploy reaches production, the clean recovery is to <code>git revert</code> the bad commit and deploy again — going forward to a known-good state, not hacking the server by hand. Never force-push over history to "undo" a deploy. And if that bad deploy ran a migration, discuss the data before reverting, per the rule above.</p>

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
<p>Khi một deploy xấu tới production, phục hồi gọn gàng là <code>git revert</code> commit xấu và deploy lại — đi tới một trạng thái tốt-đã-biết, không phải hack server bằng tay. Đừng bao giờ force-push đè lịch sử để "hoàn tác" một deploy. Và nếu deploy xấu đó đã chạy một migration, hãy bàn về dữ liệu trước khi revert, theo quy tắc trên.</p>

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
