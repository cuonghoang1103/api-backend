/**
 * 8.3 — Trạng thái cũ: "sửa rồi mà vẫn lỗi" — tiến trình cũ, ảnh Docker cũ, CDN, cache ứng dụng (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: Node 22 node:http (41831/41832), git, Docker Compose v5.3.1 (dbg-c8-web 41835), nginx 1.27 làm CDN (dbg-c8-cdn 41830, proxy_cache),
 * Redis 7 (dbg-c8-redis 46379), PostgreSQL 16 — scratchpad/dbg/lab/ch8 (c83/, tools/c83-*.sh; o-83-*.txt).
 */
import { nguon, lienKet } from '../_chung.mjs';
import { WEB_SRV, NGINX, DOCKERFILE, COMPOSE } from './_ma-8.mjs';
import { TIEN_TRINH, DOCKER, HTML, TOI, GIA } from './_ra-8.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;

const MA_HEALTH = ma(`// /health (hay /version) trả lời câu "ai đang trả lời tôi?" — thêm vào MỌI dịch vụ ngay từ ngày đầu
//   commit lúc BUILD (không phải lúc chạy), thời điểm khởi động, pid/hostname
//   Dockerfile:  ARG BUILD_SHA  →  ENV BUILD_SHA=$BUILD_SHA      build: --build-arg BUILD_SHA=$(git rev-parse --short HEAD)
if (url.pathname === '/health') return gui(res, 200, { phienBan: PHIEN_BAN, commit: SHA, pid: process.pid, batDau: BAT_DAU });

// Spring Boot: spring-boot-maven-plugin goal build-info + git-commit-id-maven-plugin
//   ⇒ /actuator/info có "git": { "commit": { "id": "759111c" } } và "build": { "time": … }`);

const MA_CACHE_HEADER = ma(`# Quy tắc Cache-Control cho một ứng dụng web có bundle băm tên (Vite, webpack, Next.js)
/index.html, /                → Cache-Control: no-cache          # được lưu, nhưng PHẢI hỏi lại server mỗi lần (ETag/304)
/assets/app.8b27e4.js         → Cache-Control: public, max-age=31536000, immutable   # tên đổi khi nội dung đổi
/api/toi, mọi dữ liệu cá nhân → Cache-Control: private, no-store  # CDN/proxy dùng chung KHÔNG được lưu
/api/gia/401 (dữ liệu chung)  → Cache-Control: public, max-age=30  # chấp nhận cũ tối đa 30 giây — viết rõ con số`, 'bash');

const MA_REDIS = ma(`// Cache-aside với Redis: đọc cache → trượt thì đọc DB và ghi cache có HẠN; GHI DB thì XOÁ khoá
async function layGia(phong) {
  const c = await redis.get(\`gia:\${phong}\`);
  if (c) return JSON.parse(c);
  const r = await db.query('SELECT phong, gia FROM gia_phong WHERE phong = $1', [phong]);
  await redis.set(\`gia:\${phong}\`, JSON.stringify(r.rows[0]), { EX: 3600 });   // luôn có TTL: lưới an toàn khi quên xoá
  return r.rows[0];
}
async function doiGia(phong, gia) {
  await db.query('UPDATE gia_phong SET gia = $2 WHERE phong = $1', [phong, gia]);
  await redis.del(\`gia:\${phong}\`);          // xoá SAU khi ghi DB; mọi đường ghi (API, job, SQL tay) phải làm bước này
}`);

const BANG_LOP_EN = `<table>
<thead><tr><th>Layer</th><th>Question that proves it</th><th>How to clear it</th></tr></thead>
<tbody>
<tr><td>Your editor / unsaved file, wrong branch</td><td><code>git status</code>, <code>git log -1</code></td><td>save, checkout</td></tr>
<tr><td>Build output (<code>dist/</code>, <code>target/</code>, <code>.next/</code>)</td><td>timestamp of the built file vs the source</td><td>rebuild; <code>tsc</code>, <code>mvn clean package</code></td></tr>
<tr><td>The running process</td><td><code>/health</code> commit + start time; <code>ss -ltnp</code>; <code>ps -o lstart</code></td><td>stop the old one, check the new one actually started</td></tr>
<tr><td>Docker image / container</td><td>container's image id vs the tag's image id</td><td><code>docker compose up -d --build</code> (or <code>--force-recreate</code>)</td></tr>
<tr><td>Kubernetes / deploy</td><td>pod image digest, rollout status</td><td>see the <em>kubernetes</em> course, chapter 9</td></tr>
<tr><td>CDN / reverse proxy cache</td><td><code>X-Cache-Status</code> / <code>Age</code> / <code>CF-Cache-Status</code> headers</td><td>purge the URL, fix <code>Cache-Control</code></td></tr>
<tr><td>Application cache (Map, Redis, Caffeine)</td><td>a <code>nguon</code>/source field, <code>redis-cli GET / TTL</code></td><td>delete the key; invalidate on every write path</td></tr>
<tr><td>Browser: HTTP cache, service worker, localStorage</td><td>DevTools Network "(disk cache)", Application tab</td><td>lesson 5.4</td></tr>
</tbody></table>`;

const BANG_LOP_VI = `<table>
<thead><tr><th>Lớp</th><th>Câu hỏi để chứng minh</th><th>Cách dọn</th></tr></thead>
<tbody>
<tr><td>Trình soạn thảo / tệp chưa lưu, sai nhánh</td><td><code>git status</code>, <code>git log -1</code></td><td>lưu, checkout</td></tr>
<tr><td>Kết quả build (<code>dist/</code>, <code>target/</code>, <code>.next/</code>)</td><td>giờ sửa của tệp build so với tệp nguồn</td><td>build lại; <code>tsc</code>, <code>mvn clean package</code></td></tr>
<tr><td>Tiến trình đang chạy</td><td>commit + giờ khởi động ở <code>/health</code>; <code>ss -ltnp</code>; <code>ps -o lstart</code></td><td>dừng tiến trình cũ, kiểm tiến trình mới THẬT SỰ đã lên</td></tr>
<tr><td>Ảnh / container Docker</td><td>image id của container so với image id của tag</td><td><code>docker compose up -d --build</code> (hoặc <code>--force-recreate</code>)</td></tr>
<tr><td>Kubernetes / deploy</td><td>digest ảnh của pod, trạng thái rollout</td><td>xem khoá <em>kubernetes</em>, chương 9</td></tr>
<tr><td>Cache CDN / reverse proxy</td><td>header <code>X-Cache-Status</code> / <code>Age</code> / <code>CF-Cache-Status</code></td><td>purge URL, sửa <code>Cache-Control</code></td></tr>
<tr><td>Cache ứng dụng (Map, Redis, Caffeine)</td><td>trường <code>nguon</code>, <code>redis-cli GET / TTL</code></td><td>xoá khoá; vô hiệu hoá ở MỌI đường ghi</td></tr>
<tr><td>Trình duyệt: HTTP cache, service worker, localStorage</td><td>DevTools Network "(disk cache)", tab Application</td><td>bài 5.4</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('📜', 'RFC 9111 — HTTP Caching', 'Định nghĩa chuẩn của public/private, no-cache/no-store, max-age, Age, và khi nào cache dùng chung được lưu phản hồi.', 'https://www.rfc-editor.org/rfc/rfc9111'),
  nguon('🟩', 'nginx — ngx_http_proxy_module (proxy_cache)', 'proxy_cache_path, proxy_cache_key, $upstream_cache_status; nginx tôn trọng Cache-Control của upstream.', 'https://nginx.org/en/docs/http/ngx_http_proxy_module.html'),
  nguon('🧯', 'Ars Technica — Valve explains caching problem that led to Steam info leak (12/2015)', 'Ngày 25/12/2015 cấu hình cache sai khiến khoảng 34.000 người dùng Steam thấy trang tài khoản của người khác (trang chặn bot tự động — mở bằng trình duyệt).', 'https://arstechnica.com/gaming/2015/12/valve-explains-ddos-induced-caching-problem-that-led-to-steam-info-leak/'),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-5-4-storage-react', title: 'Bài 5.4 — Service worker cũ giữ bản cũ', sub: 'Lớp cache trong trình duyệt: SW cache-first, cookie, storage.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-9-1-bisect-run', title: 'Bài 9.1 — git bisect run', sub: 'Khi bản đang chạy ĐÚNG là bản mới mà vẫn lỗi: tìm commit gây lỗi.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '8.3 — Stale state: "I fixed it but it still fails" — browser, CDN, Redis, old builds|||8.3 — Trạng thái cũ: "sửa rồi mà vẫn lỗi" — trình duyệt, CDN, Redis, bản build cũ',
  slug: 'dbg-8-3-cache',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bước đầu của mọi ticket "sửa rồi mà vẫn lỗi": hỏi chính tiến trình đang trả lời là ai (/health có commit lúc build). Tái hiện thật: bản v1 chạy từ trước giữ cổng, bản v2 chết vì EADDRINUSE trong log không ai đọc ⇒ /bao-cao 404; docker compose up -d không build lại, compose build xong container vẫn chạy ảnh 8587e3a… trong khi tag đã trỏ ảnh d533636…; nginx làm CDN giữ index.html cũ 10 phút ⇒ bundle cũ 404 ⇒ trang trắng, sửa bằng no-cache + immutable; Cache-Control public trên /api/toi ⇒ người lạ thấy tên, mã SV, email của An (Steam 2015); cache trong tiến trình ở hai instance cho giá 50.000/65.000 xen kẽ, Redis chung + xoá khoá khi ghi, và SQL tay quên xoá khoá. Bảng các lớp cache và cách chứng minh từng lớp.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>"I fixed it, I deployed it, it still fails"</h2>
<p class="lead">Sometimes the bug is not in the code you are reading — because the code you are reading is not the code that is running. Between your editor and the user there are many copies: the build output, the running process, the Docker image, the container, a CDN, an application cache, the browser. Any of them can be old. This lesson's rule saves hours: <strong>before debugging a "still broken" fix, prove which version answered the request</strong>, layer by layer. Five real reproductions follow.</p>

<h3>An everyday picture: the old menu in the window</h3>
<p>A café changes its prices and prints a new menu for the counter — but the old menu is still taped to the window, the delivery app still shows last month's photo, and a regular customer remembers the old price. "We changed the price" is true in the kitchen and false everywhere the customer looks. Fixing the price was only half the job; the other half is finding every copy of the old menu.</p>

<h3>1. The old process still owns the port</h3>
<details><summary>c83/server-v2.mjs — the small web app used in this lesson</summary>${ma(WEB_SRV)}</details>
${ra(TIEN_TRINH)}
<p>Version 1 had been running in the background since this morning. The developer pulled version 2 (which adds <code>/bao-cao</code>) and started it the same way, with output redirected to a log file nobody opened. The new process died immediately — <code>EADDRINUSE</code> — and the old one kept answering. <code>/bao-cao</code> gives 404 and the developer starts "debugging the route". One request to <code>/health</code> ends it: <code>commit 4d3519e</code> while <code>git rev-parse</code> says <code>759111c</code>. <code>ss -ltnp</code> names the process that owns the port and <code>ps -o lstart</code> shows it started before the fix. The same story exists with <code>nodemon</code>/<code>tsx watch</code> crashed silently, a second terminal running <code>npm start</code>, or a Spring Boot app still running inside IntelliJ while you start another from Maven.</p>
${MA_HEALTH}

<h3>2. The container runs yesterday's image</h3>
<details><summary>c83/docker — Dockerfile and compose.yaml</summary>${ma(DOCKERFILE, 'docker')}${ma(COMPOSE, 'yaml')}</details>
${ra(DOCKER)}
<p>Two habits, two traps. <code>docker compose up -d</code> after editing code does not rebuild: Compose sees a container that is already running with an image it has, and answers <code>Running</code>. Then <code>docker compose build</code> builds a new image and moves the <code>:latest</code> tag to it — but the running container keeps the image it was <em>created</em> from (<code>8587e3a…</code> vs <code>d533636…</code>); <code>docker ps</code> even shows the bare id because the old image no longer has a tag. Only <code>up -d --build</code> (or <code>--force-recreate</code>) recreates the container. On a server with <code>image: myapp:latest</code> pulled from a registry, the equivalent mistake is not pulling; in Kubernetes it is <code>imagePullPolicy</code> with a mutable tag. Deploy with immutable tags (the commit hash) and the question disappears.</p>

<h3>3. A CDN keeps the old HTML — blank page after deploy</h3>
<details><summary>c83/nginx/nginx.conf — nginx playing a CDN in front of two app instances</summary>${ma(NGINX, 'nginx')}</details>
${ra(HTML)}
<p>The app sent <code>Cache-Control: public, max-age=600</code> for <code>index.html</code>, so the CDN stored it for 10 minutes (<code>MISS</code>, then <code>HIT</code>). After deploying version 2, the CDN keeps serving the old HTML, which points to <code>app.3f9a1c.js</code> — a bundle the new server no longer has. Asking the origin directly (bypassing the CDN) shows the correct new HTML: that comparison proves the layer. Users get a blank page with a 404 for a JS file, and the developer cannot reproduce it on localhost. The fix is in the headers, not in the code:</p>
${MA_CACHE_HEADER}
<p>After the change and one purge, <code>index.html</code> is <code>MISS</code> every time (with ETag the server can still answer 304 cheaply), while hashed bundles stay cached for a year — their name changes whenever their content does.</p>

<h3>4. 🛡 Hacker's corner: a shared cache serving someone else's account</h3>
${ra(TOI)}
<p>The profile endpoint <code>/api/toi</code> returned <code>Cache-Control: public, max-age=60</code> ("it is a GET, let's cache it"). The CDN's key is the URL; the cookie is not part of it. Bình logged in and received An's name, student ID and e-mail; a stranger without any cookie got them too. With <code>private, no-store</code> each user gets their own data and the stranger gets 401. This is exactly what happened to Steam on 25 December 2015: during a traffic spike a caching configuration change made about 34,000 users see account pages of other users — billing address, e-mail, purchase history, the last two digits of a card number (Ars Technica, Valve's statement). A related attack, <em>web cache deception</em>, tricks a CDN into caching a private page by appending a fake <code>/x.css</code>. Rules: personal responses are <code>private</code> or <code>no-store</code>; if a CDN must vary by user, put the user dimension in the cache key or do not cache; review CDN rules like code.</p>

<h3>5. Application cache: two instances, two truths</h3>
${MA_REDIS}
${ra(GIA)}
<p>With an in-process <code>Map</code>, each of the two instances behind the load balancer has its own copy. The admin's price change went to instance 41831, which cleared <em>its</em> cache; instance 41832 kept serving 50,000. Users refreshing the page see 50,000 and 65,000 alternating — a perfect "sometimes" bug, and invisible on a laptop with one instance. Watch the <code>instance</code> and <code>nguon</code> fields: making the source of each answer visible is what turns this from a mystery into a two-minute diagnosis. With a shared Redis and a delete on write, both instances agree immediately. The last block shows the remaining trap: a price changed directly in SQL (a script, a colleague in DBeaver, a nightly job) does not delete the key, so Redis serves 65,000 until someone deletes it — or until the TTL expires (3600 s here). Every write path must invalidate, and every key needs a TTL as a safety net.</p>
${BANG_LOP_EN}

<h3>On the job</h3>
<p>The message <em>"Anh ơi em sửa rồi mà trên dev vẫn lỗi"</em> is the most common Slack message of an intern's first month. Train yourself to answer it with evidence, in this order: what does <code>/health</code> (or <code>/actuator/info</code>) say about the commit and start time; does the container image match the tag; does a request to the origin (bypassing CDN / proxy) give the new behaviour; what does the cache say (headers, <code>redis-cli</code>); does a private window behave differently. Write the answer in the ticket: "dev was running image 8587e3a from yesterday; recreated with --build; fixed". On a customer project, ask on day one how to see the running version of every service — if nobody knows, adding <code>/health</code> with the commit is a valuable first pull request.</p>

<h3>🧪 Practice (45 min)</h3>
<div class="callout ok">
<ol>
<li>Run <code>tools/c83-tien-trinh.sh</code>, then make your own app print the commit and start time at <code>/health</code>, injected at build time.</li>
<li>Run <code>tools/c83-docker.sh</code> (inside the heavy-task lock). Explain to a classmate, using the two image ids, why <code>compose build</code> was not enough.</li>
<li>Run <code>tools/c83-cdn.sh</code>. Change <code>/api/gia</code> to <code>public, max-age=30</code> behind the CDN: what is the longest a user can now see an old price? Measure it.</li>
<li>Add a <code>nguon</code> (source) field or an <code>X-Cache</code> header to one cached endpoint in your project.</li>
<li>List every write path to one cached table in your project (API, admin page, job, migration, manual SQL). Which ones delete the cache key?</li>
</ol>
<p><strong>Done when:</strong> for a "still broken" report you can show, with one command per layer, which version and which cached copy produced the response.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Stale</span><span class="v">A copy (process, image, cached response) older than the source of truth.</span></div>
  <div class="kv"><span class="k">/health with commit</span><span class="v">Endpoint that reports the build's commit and start time.</span></div>
  <div class="kv"><span class="k">Origin</span><span class="v">The real server behind a CDN or proxy.</span></div>
  <div class="kv"><span class="k">Cache key</span><span class="v">What a cache uses to decide two requests are "the same".</span></div>
  <div class="kv"><span class="k">no-cache vs no-store</span><span class="v">Store but revalidate every time / never store.</span></div>
  <div class="kv"><span class="k">Cache-aside</span><span class="v">Read cache, on miss read DB and fill; on write update DB then delete the key.</span></div>
  <div class="kv"><span class="k">Immutable tag</span><span class="v">An image tag that never moves (a commit hash), unlike <code>:latest</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>"Still broken after the fix": first prove which version answered — <code>/health</code> with the build commit.</li>
<li>A failed start can leave the old process serving; check the port owner and start time.</li>
<li>Compose does not rebuild on <code>up -d</code>; a rebuilt tag does not change a running container.</li>
<li>HTML <code>no-cache</code>, hashed assets <code>immutable</code>, personal data <code>private, no-store</code>.</li>
<li>Compare through-CDN vs origin to locate a caching layer.</li>
<li>In-process caches diverge across instances; shared cache + delete on every write + TTL.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>"Em sửa rồi, deploy rồi, mà vẫn lỗi"</h2>
<p class="lead">Có khi lỗi không nằm trong đoạn mã bạn đang đọc — vì đoạn mã bạn đang đọc không phải đoạn mã đang chạy. Giữa trình soạn thảo của bạn và người dùng có rất nhiều bản sao: kết quả build, tiến trình đang chạy, ảnh Docker, container, CDN, cache ứng dụng, trình duyệt. Bản nào cũng có thể cũ. Luật của bài này tiết kiệm hàng giờ: <strong>trước khi gỡ lỗi một bản sửa "vẫn hỏng", hãy chứng minh phiên bản nào đã trả lời request</strong>, từng lớp một. Sau đây là năm lần tái hiện thật.</p>

<h3>Liên tưởng đời thường: thực đơn cũ dán ngoài cửa kính</h3>
<p>Một quán cà phê đổi giá và in thực đơn mới để ở quầy — nhưng thực đơn cũ vẫn dán ngoài cửa kính, ứng dụng giao hàng vẫn hiện ảnh tháng trước, và khách quen vẫn nhớ giá cũ. "Quán đổi giá rồi" là đúng trong bếp và sai ở mọi chỗ khách nhìn vào. Đổi giá mới là một nửa công việc; nửa còn lại là tìm mọi bản sao của thực đơn cũ.</p>

<h3>1. Tiến trình cũ vẫn giữ cổng</h3>
<details><summary>c83/server-v2.mjs — ứng dụng web nhỏ dùng trong bài</summary>${ma(WEB_SRV)}</details>
${ra(TIEN_TRINH)}
<p>Phiên bản 1 đã chạy nền từ sáng. Bạn dev pull phiên bản 2 (thêm <code>/bao-cao</code>) và chạy y như cũ, output chuyển vào một tệp log không ai mở. Tiến trình mới chết ngay — <code>EADDRINUSE</code> — và tiến trình cũ tiếp tục trả lời. <code>/bao-cao</code> ra 404 và bạn dev bắt đầu "gỡ lỗi route". Một request tới <code>/health</code> là xong: <code>commit 4d3519e</code> trong khi <code>git rev-parse</code> nói <code>759111c</code>. <code>ss -ltnp</code> gọi tên tiến trình đang giữ cổng và <code>ps -o lstart</code> cho thấy nó khởi động trước khi có bản sửa. Câu chuyện y hệt xảy ra khi <code>nodemon</code>/<code>tsx watch</code> chết âm thầm, một cửa sổ terminal thứ hai đang chạy <code>npm start</code>, hay một ứng dụng Spring Boot vẫn chạy trong IntelliJ trong khi bạn chạy thêm một bản từ Maven.</p>
${MA_HEALTH}

<h3>2. Container chạy ảnh của hôm qua</h3>
<details><summary>c83/docker — Dockerfile và compose.yaml</summary>${ma(DOCKERFILE, 'docker')}${ma(COMPOSE, 'yaml')}</details>
${ra(DOCKER)}
<p>Hai thói quen, hai cái bẫy. <code>docker compose up -d</code> sau khi sửa mã không build lại: Compose thấy một container đang chạy với ảnh nó đã có, và trả lời <code>Running</code>. Tiếp đó <code>docker compose build</code> build ảnh mới và chuyển tag <code>:latest</code> sang ảnh đó — nhưng container đang chạy vẫn giữ ảnh mà nó được <em>tạo ra</em> từ đó (<code>8587e3a…</code> so với <code>d533636…</code>); <code>docker ps</code> còn hiện id trơn vì ảnh cũ không còn tag. Chỉ <code>up -d --build</code> (hoặc <code>--force-recreate</code>) mới tạo lại container. Trên server dùng <code>image: myapp:latest</code> kéo từ registry, lỗi tương đương là quên pull; trong Kubernetes là <code>imagePullPolicy</code> với một tag thay đổi được. Deploy bằng tag bất biến (mã commit) thì câu hỏi này biến mất.</p>

<h3>3. CDN giữ HTML cũ — trang trắng sau deploy</h3>
<details><summary>c83/nginx/nginx.conf — nginx đóng vai CDN trước hai instance ứng dụng</summary>${ma(NGINX, 'nginx')}</details>
${ra(HTML)}
<p>Ứng dụng gửi <code>Cache-Control: public, max-age=600</code> cho <code>index.html</code>, nên CDN lưu nó 10 phút (<code>MISS</code>, rồi <code>HIT</code>). Sau khi deploy phiên bản 2, CDN vẫn trả HTML cũ, trỏ tới <code>app.3f9a1c.js</code> — một bundle mà server mới không còn. Hỏi thẳng origin (bỏ qua CDN) cho ra HTML mới đúng: phép so sánh đó chứng minh lớp gây lỗi. Người dùng thấy trang trắng kèm một lỗi 404 cho tệp JS, còn dev thì không tái hiện được trên localhost. Cách sửa nằm ở header, không nằm ở mã:</p>
${MA_CACHE_HEADER}
<p>Sau khi đổi và purge một lần, <code>index.html</code> lần nào cũng là <code>MISS</code> (có ETag thì server vẫn trả 304 rất rẻ), trong khi bundle có hash vẫn được cache một năm — tên của chúng đổi mỗi khi nội dung đổi.</p>

<h3>4. 🛡 Góc hacker: cache dùng chung trả tài khoản của người khác</h3>
${ra(TOI)}
<p>Endpoint hồ sơ <code>/api/toi</code> trả <code>Cache-Control: public, max-age=60</code> ("GET mà, cache cho nhanh"). Khoá cache của CDN là URL; cookie không nằm trong đó. Bình đăng nhập và nhận được tên, mã sinh viên và email của An; một người lạ không có cookie nào cũng nhận được. Với <code>private, no-store</code>, mỗi người nhận đúng dữ liệu của mình và người lạ nhận 401. Đây chính là điều đã xảy ra với Steam ngày 25/12/2015: giữa một đợt lưu lượng tăng vọt, một thay đổi cấu hình cache khiến khoảng 34.000 người dùng thấy trang tài khoản của người khác — địa chỉ thanh toán, email, lịch sử mua, hai chữ số cuối của thẻ (Ars Technica, theo thông báo của Valve). Một kiểu tấn công liên quan, <em>web cache deception</em>, lừa CDN cache một trang riêng tư bằng cách gắn thêm đuôi giả <code>/x.css</code>. Luật: phản hồi cá nhân là <code>private</code> hoặc <code>no-store</code>; nếu CDN buộc phải phân biệt theo người dùng thì đưa chiều người dùng vào khoá cache hoặc đừng cache; review luật CDN như review mã.</p>

<h3>5. Cache ứng dụng: hai instance, hai sự thật</h3>
${MA_REDIS}
${ra(GIA)}
<p>Với một <code>Map</code> trong tiến trình, mỗi instance trong hai instance sau load balancer giữ một bản riêng. Lần đổi giá của admin rơi vào instance 41831, nó xoá cache <em>của nó</em>; instance 41832 vẫn trả 50.000. Người dùng tải lại trang thấy 50.000 và 65.000 xen kẽ — một lỗi "thỉnh thoảng" hoàn hảo, và vô hình trên laptop chỉ chạy một instance. Hãy để ý trường <code>instance</code> và <code>nguon</code>: làm cho nguồn của mỗi câu trả lời hiện ra là điều biến bí ẩn này thành một chẩn đoán hai phút. Với Redis dùng chung và xoá khoá khi ghi, hai instance thống nhất ngay. Khối cuối cho thấy cái bẫy còn lại: giá đổi thẳng bằng SQL (một script, một đồng nghiệp trong DBeaver, một job ban đêm) không xoá khoá, nên Redis vẫn trả 65.000 cho tới khi có người xoá — hoặc tới khi TTL hết (ở đây 3600 s). Mọi đường ghi đều phải vô hiệu hoá cache, và mọi khoá cần một TTL làm lưới an toàn.</p>
${BANG_LOP_VI}

<h3>Tình huống đi làm</h3>
<p>Tin nhắn <em>"Anh ơi em sửa rồi mà trên dev vẫn lỗi"</em> là tin nhắn Slack phổ biến nhất trong tháng đầu của một intern. Hãy luyện cách trả lời nó bằng bằng chứng, theo thứ tự này: <code>/health</code> (hoặc <code>/actuator/info</code>) nói commit và giờ khởi động là gì; ảnh của container có khớp tag không; request thẳng tới origin (bỏ qua CDN / proxy) có cho hành vi mới không; cache nói gì (header, <code>redis-cli</code>); cửa sổ ẩn danh có khác không. Viết câu trả lời vào ticket: "dev đang chạy ảnh 8587e3a từ hôm qua; tạo lại bằng --build; đã hết". Ở dự án cho khách, ngay ngày đầu hãy hỏi cách xem phiên bản đang chạy của từng dịch vụ — nếu không ai biết, thêm <code>/health</code> kèm commit là một pull request đầu tiên rất có giá trị.</p>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>tools/c83-tien-trinh.sh</code>, rồi cho ứng dụng của bạn in commit và giờ khởi động ở <code>/health</code>, nạp vào lúc build.</li>
<li>Chạy <code>tools/c83-docker.sh</code> (trong khoá việc nặng). Giải thích cho một bạn cùng lớp, dựa vào hai image id, vì sao <code>compose build</code> chưa đủ.</li>
<li>Chạy <code>tools/c83-cdn.sh</code>. Đổi <code>/api/gia</code> thành <code>public, max-age=30</code> sau CDN: người dùng có thể thấy giá cũ lâu nhất bao lâu? Đo thử.</li>
<li>Thêm trường <code>nguon</code> hoặc header <code>X-Cache</code> vào một endpoint có cache trong dự án của bạn.</li>
<li>Liệt kê mọi đường ghi vào một bảng có cache trong dự án của bạn (API, trang admin, job, migration, SQL tay). Đường nào xoá khoá cache?</li>
</ol>
<p><strong>Đạt khi:</strong> với một báo cáo "vẫn hỏng", bạn chỉ ra được — mỗi lớp một lệnh — phiên bản nào và bản cache nào đã tạo ra phản hồi.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cũ (stale)</span><span class="v">Một bản sao (tiến trình, ảnh, phản hồi đã cache) cũ hơn nguồn sự thật.</span></div>
  <div class="kv"><span class="k">/health kèm commit</span><span class="v">Endpoint báo commit của bản build và giờ khởi động.</span></div>
  <div class="kv"><span class="k">Origin</span><span class="v">Server thật phía sau CDN hoặc proxy.</span></div>
  <div class="kv"><span class="k">Khoá cache</span><span class="v">Thứ cache dùng để quyết định hai request là "giống nhau".</span></div>
  <div class="kv"><span class="k">no-cache vs no-store</span><span class="v">Được lưu nhưng phải hỏi lại mỗi lần / không bao giờ lưu.</span></div>
  <div class="kv"><span class="k">Cache-aside</span><span class="v">Đọc cache, trượt thì đọc DB rồi lấp; ghi thì cập nhật DB rồi xoá khoá.</span></div>
  <div class="kv"><span class="k">Tag bất biến</span><span class="v">Tag ảnh không bao giờ dịch chuyển (mã commit), khác <code>:latest</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>"Sửa rồi vẫn hỏng": trước tiên chứng minh phiên bản nào đã trả lời — <code>/health</code> kèm commit lúc build.</li>
<li>Khởi động thất bại có thể để tiến trình cũ tiếp tục phục vụ; kiểm ai giữ cổng và giờ khởi động.</li>
<li>Compose không build lại khi <code>up -d</code>; tag được build lại không đổi container đang chạy.</li>
<li>HTML <code>no-cache</code>, tài nguyên có hash <code>immutable</code>, dữ liệu cá nhân <code>private, no-store</code>.</li>
<li>So qua CDN với gọi thẳng origin để định vị lớp cache.</li>
<li>Cache trong tiến trình lệch nhau giữa các instance; cache dùng chung + xoá ở mọi đường ghi + TTL.</li>
</ul>
${NGUON}
</div>
`,
};
