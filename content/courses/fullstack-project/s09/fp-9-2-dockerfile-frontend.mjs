/**
 * 9.2 — Dockerfile cho frontend (soạn 25/11/2026, phiên Mac tiếp quản agent fsp).
 * Output THẬT (máy nhà, compose dự án fsp-chiase, cổng 41830): dựng ảnh web hỏng vì tsc của web kiểm kiểu hợp đồng API mà
 * zod chỉ cài cho api (npm ci -w apps/web) ⇒ thêm zod 4.6.7 vào devDependencies của web; ảnh nginx 103 MB chứa 400 kB tệp tĩnh;
 * định tuyến SPA; tệp thiếu trả index.html 200 (trước) ⇒ 404 (sau, khối regex + ^~); thiếu ^~ ⇒ ảnh /chiase/ 404;
 * try_files ⇒ /index.html rơi vào khối regex mất no-cache ⇒ location = /index.html; WebSocket qua Nginx: đủ header ⇒ nâng cấp
 * sau 147 ms, thiếu Upgrade/Connection ⇒ kẹt polling, KHÔNG báo lỗi.
 * Nguồn: Vite "Env Variables and Modes" (GET 200 25/11/2026).
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const DOCKERFILE = `# syntax=docker/dockerfile:1
# Ảnh web ChiaSe (bài 9.2): Vite dựng ra tệp tĩnh ⇒ Nginx phục vụ + chuyển tiếp /api, /socket.io (một origin như lúc dev).
# Dựng từ GỐC repo:  docker build -f apps/web/Dockerfile -t chiase-web .
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
RUN --mount=type=cache,target=/root/.npm npm ci -w apps/web --ignore-scripts
COPY apps/web/ apps/web/
# Web import KIỂU từ hai tệp hợp đồng của API (bài 6.1, 7.1)
COPY apps/api/src/schemas/error.schema.ts apps/api/src/schemas/
COPY apps/api/src/realtime/hop-dong.ts apps/api/src/realtime/
RUN npm run build -w apps/web

FROM nginx:1.30-alpine AS runtime
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html`;

const NGINX = `# Nginx trong ảnh web (bài 9.2). Trình duyệt chỉ thấy MỘT origin: trang tĩnh, /api, /socket.io, /chiase (ảnh) đều qua đây.
server {
  listen 80;
  root /usr/share/nginx/html;

  # API: Nginx gọi container "api" trong mạng compose. X-Forwarded-For mang IP người dùng thật (bài 9.3: trust proxy).
  location ^~ /api/ {
    proxy_pass http://api:41810;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # Socket.IO: thiếu hai header Upgrade/Connection ⇒ kẹt long-polling (bài 7.1 đo trên Vite, bài 9.2 đo trên Nginx).
  location ^~ /socket.io/ {
    proxy_pass http://api:41810;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  # Kho ảnh (MinIO trong compose): xem ảnh (MEDIA_BASE_URL=…/chiase) VÀ tải ảnh lên bằng URL ký sẵn (S3_PUBLIC_ENDPOINT).
  location ^~ /chiase/ {
    proxy_pass http://kho:9000;
    # GIỮ NGUYÊN Host cả cổng: chữ ký SigV4 của URL tải lên tính trên "localhost:41830". $host bỏ mất cổng
    # ⇒ kho tính lại chữ ký khác ⇒ 403 SignatureDoesNotMatch (bài 9.3 đo).
    proxy_set_header Host $http_host;
    # Mặc định Nginx chỉ nhận thân request 1 MB ⇒ ảnh 1–5 MiB bị 413 TRƯỚC KHI tới kho (bài 9.3 đo). API cho tối đa 5 MiB.
    client_max_body_size 6m;
    proxy_request_buffering off; # chuyển thẳng luồng tải lên cho kho, không ghi tạm ra đĩa của Nginx
  }

  # Tệp có băm trong tên (assets/index-B1x….js): đổi nội dung là đổi tên ⇒ cache 1 năm an toàn.
  location ^~ /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    try_files $uri =404;
  }

  # Đường có đuôi tệp (.png, .js, .ico…) mà không có tệp ⇒ 404 thật. Thiếu khối này, /logo-cu.png trả index.html
  # với 200 text/html ⇒ thẻ &lt;img&gt; vỡ âm thầm, script cũ trong cache báo "Unexpected token '&lt;'" (bài 9.2 đo).
  # Khối regex THẮNG mọi khối tiền tố thường ⇒ các khối /api/, /socket.io/, /chiase/, /assets/ phải có ^~ (tệp thiếu).
  location ~ \\.[a-zA-Z0-9]+$ {
    try_files $uri =404;
  }

  # try_files bên dưới chuyển /bai/123 sang /index.html — mà "index.html" có đuôi ⇒ rơi vào khối regex trên, MẤT header
  # no-cache (bài 9.2 đo). Khối "=" (khớp chính xác) thắng regex ⇒ giữ được no-cache cho trang gốc.
  location = /index.html {
    add_header Cache-Control "no-cache";
  }

  # Ứng dụng một trang: /bai/123 không phải tệp ⇒ trả index.html để React Router lo. index.html KHÔNG cache lâu:
  # nó trỏ tới tên tệp băm của bản mới nhất.
  location / {
    add_header Cache-Control "no-cache";
    try_files $uri /index.html;
  }
}`;

const THIEU_ZOD = `$ docker compose up -d --build --wait
2.891 &gt; web@0.0.0 build
2.891 &gt; tsc -b &amp;&amp; vite build
3.303 ../api/src/schemas/error.schema.ts(1,19): error TS2307: Cannot find module 'zod' or its corresponding type declarations.
3.320 npm error Lifecycle script \`build\` failed with error:
target web: failed to solve: process "/bin/sh -c npm run build -w apps/web" did not complete successfully: exit code: 1`;

const NPM_LS = `$ npm ls zod
chiase@ ~/chiase
\`-- api@0.0.0 -&gt; ./apps/api
  \`-- zod@4.6.7`;

const ANH_WEB = `$ docker images chiase-web
chiase-web:latest	103MB
$ docker run --rm chiase-web sh -c "du -sh /usr/share/nginx/html; ls /usr/share/nginx/html/assets"
400.0K	/usr/share/nginx/html
index-C6rmR8vW.js
index-TZ1GqKq9.css`;

const DINH_TUYEN = `$ curl -sI localhost:41830/
HTTP/1.1 200 OK
Content-Type: text/html
Cache-Control: no-cache
$ curl -sI localhost:41830/bai/0199-khong-co-that
HTTP/1.1 200 OK
Content-Type: text/html
Cache-Control: no-cache
$ curl -sI localhost:41830/assets/index-C6rmR8vW.js
HTTP/1.1 200 OK
Content-Type: application/javascript
Cache-Control: public, max-age=31536000, immutable
$ curl -sI localhost:41830/api/health
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
$ curl -sI localhost:41830/khong-co.png
HTTP/1.1 200 OK
Content-Type: text/html
Cache-Control: no-cache`;

const TEP_THIEU = `# Trước khi thêm khối tệp thiếu:
$ curl -sI localhost:41830/khong-co.png
HTTP/1.1 200 OK
Content-Type: text/html
Cache-Control: no-cache

# Sau khi thêm khối regex + ^~:
$ curl -sI localhost:41830/khong-co.png
HTTP/1.1 404 Not Found
Content-Type: text/html
$ curl -sI localhost:41830/bai/0199-khong-co-that
HTTP/1.1 200 OK
Content-Type: text/html
$ curl -sI localhost:41830/chiase/posts/da4a5f1a-2558-49b4-b3e9-cc086da45c5c.webp
HTTP/1.1 200 OK
Content-Type: image/webp
Cache-Control: public, max-age=31536000, immutable`;

const THIEU_MU = `# Thử sai: khối /chiase/ KHÔNG có ^~ (khối regex đuôi tệp thắng)
$ curl -sI localhost:41830/chiase/posts/da4a5f1a-2558-49b4-b3e9-cc086da45c5c.webp
HTTP/1.1 404 Not Found
Content-Type: text/html`;

const INDEX_CACHE = `# Bản có khối regex nhưng CHƯA có location = /index.html:
$ curl -sI localhost:41830/bai/0199-khong-co-that
HTTP/1.1 200 OK
Content-Type: text/html
(không còn Cache-Control)

# Thêm location = /index.html:
$ curl -sI localhost:41830/
HTTP/1.1 200 OK
Content-Type: text/html
Cache-Control: no-cache
$ curl -sI localhost:41830/bai/0199-khong-co-that
HTTP/1.1 200 OK
Content-Type: text/html
Cache-Control: no-cache
$ curl -sI localhost:41830/khong-co.png
HTTP/1.1 404 Not Found
Content-Type: text/html`;

const WS_DUNG = `$ node scripts/ws-thu.mjs $TOKEN      # nginx.conf đầy đủ
connect sau 45 ms, kiểu truyền: polling
nâng cấp lên websocket sau 147 ms
sau 3 s: websocket`;

const WS_THIEU = `# Bỏ hai dòng Upgrade/Connection trong location /socket.io/
$ node scripts/ws-thu.mjs $TOKEN
connect sau 31 ms, kiểu truyền: polling
sau 3 s: polling`;


const NGUON = [
  nguon('⚡', 'Vite — Env Variables and Modes (mục "Protecting secrets")', 'vite.dev', 'https://vite.dev/guide/env-and-mode'),
  nguon('🌐', 'nginx — location (thứ tự chọn: =, ^~, regex, tiền tố)', 'nginx.org', 'https://nginx.org/en/docs/http/ngx_http_core_module.html#location'),
].join('\n');

const THE = [
  lienKet({ khoa: 'nginx', bai: 'nginx-3-5-websocket', title: 'Nginx 3.5 — WebSocket: cú nâng cấp mà Nginx CỐ Ý gỡ đi', sub: 'Vì sao Upgrade/Connection phải ghi tay.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nginx', bai: 'nginx-4-5-khoi-tinh-production', title: 'Nginx 4.5 — Một khối tĩnh cho production', sub: 'Cache, nén, ETag cho tệp có băm trong tên.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nginx', bai: 'nginx-3-1-proxy-pass', title: 'Nginx 3.1 — proxy_pass và dấu gạch chéo', sub: 'Dấu "/" cuối proxy_pass viết lại đường dẫn.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-10-4-frontend', title: 'Docker 10.4 — Frontend trong container', sub: 'Cùng bài toán với Next.js (có máy chủ Node).', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-10-5-nginx-lap-rap', title: 'Docker 10.5 — nginx đứng trước, và cả cái file', sub: 'Nginx trong compose, ráp cả stack.', cta: 'Mở bài →' }),
].join('\n');

const MERMAID = `flowchart LR
  B["Trình duyệt localhost:41830"] --> N["Nginx (ảnh web)"]
  N -->|"/ , /bai/…"| H["index.html + /assets (tĩnh)"]
  N -->|"/api/"| A["api:41810"]
  N -->|"/socket.io/ (Upgrade)"| A
  N -->|"/chiase/"| K["kho:9000 (MinIO)"]`;

export default {
  title: '9.2 — A Dockerfile for the frontend|||9.2 — Dockerfile cho frontend',
  slug: 'fp-9-2-dockerfile-frontend',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vite dựng React ra tệp tĩnh; ảnh web chỉ cần Nginx (103 MB, 400 kB tệp ứng dụng), không cần Node lúc chạy. Nginx giữ đúng mô hình MỘT origin của lúc dev: trang tĩnh, /api, /socket.io và kho ảnh /chiase đi qua cùng một cổng ⇒ không CORS, cookie refresh vẫn chạy. Đo thật: bản dựng đầu hỏng vì web kiểm kiểu hợp đồng của API mà zod chỉ cài cho API; tệp thiếu trả index.html với 200; thêm khối regex thì ảnh 404 vì thiếu ^~, rồi index.html mất no-cache; thiếu hai header Upgrade/Connection thì Socket.IO âm thầm kẹt ở long-polling.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Dockerize</span>
<h2>The frontend image is just Nginx and some files</h2>
<p class="lead">After <code>vite build</code>, ChiaSe's frontend is an <code>index.html</code>, one JS file and one CSS file. No Node process is needed to serve them. The image therefore has two stages — Node to build, Nginx to serve — and Nginx takes over the job the Vite dev proxy did in Chapter 6: one origin for pages, API, WebSocket and images.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">build</span><span class="lz-d">node:22-slim · npm ci -w apps/web · tsc -b && vite build</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">runtime</span><span class="lz-d">nginx:1.30-alpine · dist ⇒ /usr/share/nginx/html</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">one origin</span><span class="lz-d">/ · /api/ · /socket.io/ · /chiase/ through the same port</span></div>
</div>
<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. The Dockerfile</h3>
<pre><code class="language-dockerfile">${DOCKERFILE}</code></pre>
<p>Same cache idea as 9.1: manifests, <code>npm ci</code>, then source. The two extra <code>COPY</code> lines exist because the web imports <em>types</em> from two API contract files (error shape, realtime events) — lessons 6.1 and 7.1.</p>

<h3>2. First build: a hidden dependency surfaces</h3>
<div class="out">${THIEU_ZOD}</div>
<div class="out">${NPM_LS}</div>
<p><code>error.schema.ts</code> imports <code>zod</code>; to type-check it, the web's <code>tsc</code> needs zod's type declarations. On your laptop that worked by accident: the root <code>node_modules</code> held zod because the <em>API</em> depends on it. <code>npm ci -w apps/web</code> installs only the web's dependencies, so the accident disappears. Fix: declare what you use — <code>npm i -D -E zod@4.6.7 -w apps/web</code> (same exact version as the API, dev-only, nothing goes to the browser because the import is <code>import type</code>). Docker is a good detector of undeclared dependencies: it starts from nothing every time.</p>

<h3>3. Nginx: one origin</h3>
<pre><code class="language-nginx">${NGINX}</code></pre>
<div class="out">${ANH_WEB}</div>
<div class="out">${DINH_TUYEN}</div>
<p><code>/bai/…</code> is not a file; <code>try_files $uri /index.html</code> hands it to React Router. <code>index.html</code> is <code>no-cache</code> (it names the newest hashed bundle); hashed assets are cached a year. Because the browser sees only <code>localhost:41830</code>, there is still no CORS and the refresh cookie (<code>SameSite=Strict</code>, <code>Path=/api/auth</code>) works exactly as in dev.</p>

<h3>4. Three Nginx traps, measured</h3>
<p><strong>Trap A — a missing file returns 200.</strong> The last line of the routing output: <code>/khong-co.png</code> answered <code>200 text/html</code>. An <code>&lt;img&gt;</code> breaks silently; a stale cached page that asks for an old JS file gets HTML and throws <code>Unexpected token '&lt;'</code>. Fix: a regex location for paths with an extension, <code>try_files $uri =404</code>.</p>
<div class="out">${TEP_THIEU}</div>
<p><strong>Trap B — regex beats prefix.</strong> Nginx checks prefix locations, then regex locations, and a matching regex wins unless the prefix is marked <code>^~</code>. Without <code>^~</code> on <code>/chiase/</code>, every image (they end in <code>.webp</code>) went to the regex block:</p>
<div class="out">${THIEU_MU}</div>
<p><strong>Trap C — the fix broke caching.</strong> <code>try_files … /index.html</code> is an internal redirect; <code>index.html</code> has an extension, so it landed in the regex block and lost <code>Cache-Control: no-cache</code>. Browsers may then cache it heuristically and keep users on yesterday's bundle after a deploy. An exact match <code>location = /index.html</code> wins over regex:</p>
<div class="out">${INDEX_CACHE}</div>
<p>Moral: every change to <code>nginx.conf</code> gets the same five <code>curl -I</code> lines afterwards. Checkpoint 9 runs them.</p>

<h3>5. WebSocket through Nginx</h3>
<div class="out">${WS_DUNG}</div>
<p>Socket.IO connects with HTTP long-polling, then upgrades. Remove the two <code>Upgrade</code>/<code>Connection</code> lines (Nginx deliberately strips these hop-by-hop headers):</p>
<div class="out">${WS_THIEU}</div>
<p>No error, no warning, the app still "works" — every event now costs an HTTP request per poll, and with several API instances polling breaks without sticky sessions (lesson 7.3). Only measuring the transport reveals it.</p>

<div class="pitfall co-tieu-de"><p><strong>Hacker's corner — the bundle is public.</strong> Everything <code>vite build</code> inlines is downloaded by every visitor. Vite's docs say it plainly: <em>VITE_* variables should not contain sensitive information such as API keys.</em> cuongthai.com learned it on 02/07/2026: a GIPHY key shipped as a public build-time variable, then a fallback to a revoked public key broke the GIF picker; the fix was a backend proxy route holding the key at runtime. ChiaSe's web image has no secrets by design: no <code>VITE_*</code> values at all, configuration lives in the API.</p></div>

${spring(true, 'In the SWP391 setup (React + Spring Boot) the frontend image is the same: Node builds, Nginx serves, and proxies /api to the Spring container so the browser sees one origin (no CORS configuration needed in production).', [
  ['sb-21-1-kien-truc-spa', 'Spring Boot 21.1 — SPA architecture and the proxy'],
  ['sb-17-4-checkpoint-9', 'Spring Boot 17.4 — Checkpoint: the whole system with one command'],
])}

<h3>Everyday analogy</h3>
<p>Nginx is a building receptionist: visitors only know the front desk. "Room 101?" — here is the brochure (static files). "Accounts?" — sent up to the API. "A long call?" — a direct line is connected (WebSocket), but only if the receptionist is told to keep the line open.</p>

<h3>On the job</h3>
<p>A classic outsourcing ticket: "after deploy, some users see a white page until they press Ctrl+F5". Nine times out of ten it is <code>index.html</code> being cached, exactly trap C. Check with <code>curl -I</code> before touching code.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"How do you serve a React SPA in production?"</strong> — Build to static files, serve with Nginx/CDN, <code>try_files</code> fallback to index.html, long cache for hashed assets, no-cache for index.html.</li>
<li><strong>"Why proxy the API through the same origin?"</strong> — No CORS, cookies with SameSite=Strict work, one TLS certificate.</li>
<li><strong>"WebSocket works locally but not behind Nginx — why?"</strong> — Upgrade/Connection headers and HTTP/1.1 must be set explicitly.</li>
<li><strong>"Can a frontend hold an API key?"</strong> — No; anything in the bundle is public. Use a backend route.</li>
</ol>

<h3>🧪 Lab 9.2</h3>
<div class="callout ok">
<ol>
<li>Build the web image with <code>npm ci -w apps/web</code> and reproduce the zod error; fix it by declaring the dependency.</li>
<li>Run the stack (lesson 9.3) and run the five <code>curl -I</code> checks of section 3.</li>
<li>Reproduce traps A, B, C one by one by editing <code>nginx.conf</code> inside the container (<code>docker compose exec web vi …</code> then <code>nginx -s reload</code>), each time with the same curls.</li>
<li>Write a 15-line script that connects Socket.IO to port 41830 and prints the transport after 3 s; remove the Upgrade headers and run it again.</li>
</ol>
<p><strong>Done when:</strong> <code>/</code> and <code>/bai/x</code> are 200 no-cache, a missing <code>.png</code> is 404, images under <code>/chiase/</code> are 200 <code>image/webp</code>, assets are immutable, and the transport is <code>websocket</code>.</p>
</div>
<details><summary>Solution</summary>
<p><code>apps/web/Dockerfile</code> and <code>apps/web/nginx.conf</code> as printed above; zod in <code>apps/web/package.json</code> devDependencies. The Socket.IO script is the same check as step 3 of <code>scripts/checkpoint-9.mjs</code>.</p>
</details>

<div class="kv-grid">
  <div class="kv"><span class="k">static build</span><span class="v">vite build ⇒ HTML/JS/CSS; no server process.</span></div>
  <div class="kv"><span class="k">try_files</span><span class="v">Try the file, else fall back (SPA: /index.html; files: =404).</span></div>
  <div class="kv"><span class="k">^~</span><span class="v">Prefix location that stops Nginx from checking regex locations.</span></div>
  <div class="kv"><span class="k">location =</span><span class="v">Exact match; beats everything.</span></div>
  <div class="kv"><span class="k">hop-by-hop header</span><span class="v">Upgrade/Connection: not forwarded by proxies unless set.</span></div>
  <div class="kv"><span class="k">same origin</span><span class="v">Same scheme+host+port ⇒ no CORS, Strict cookies work.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Two stages: Node builds, Nginx serves; 103 MB image, 400 kB of app.</li>
<li>Docker exposes undeclared dependencies: declare zod for the web's type check.</li>
<li>Nginx keeps the single origin: /, /api/, /socket.io/, /chiase/.</li>
<li>Missing files must 404; prefix blocks need ^~ next to a regex; index.html needs its own exact block.</li>
<li>Without Upgrade/Connection, Socket.IO silently stays on polling.</li>
<li>The bundle is public: no secrets in VITE_*.</li>
</ul>
${NGUON}
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Docker hoá</span>
<h2>Ảnh frontend chỉ là Nginx và vài tệp</h2>
<p class="lead">Sau <code>vite build</code>, frontend của ChiaSe là một <code>index.html</code>, một tệp JS và một tệp CSS. Không cần tiến trình Node nào để phục vụ chúng. Vì thế ảnh có hai tầng — Node để dựng, Nginx để phục vụ — và Nginx nhận lại đúng việc proxy của Vite đã làm ở Chương 6: một origin duy nhất cho trang, API, WebSocket và ảnh.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">build</span><span class="lz-d">node:22-slim · npm ci -w apps/web · tsc -b && vite build</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">runtime</span><span class="lz-d">nginx:1.30-alpine · dist ⇒ /usr/share/nginx/html</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">một origin</span><span class="lz-d">/ · /api/ · /socket.io/ · /chiase/ qua cùng một cổng</span></div>
</div>
<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Dockerfile</h3>
<pre><code class="language-dockerfile">${DOCKERFILE}</code></pre>
<p>Cùng ý tưởng cache như 9.1: manifest, <code>npm ci</code>, rồi mới tới mã nguồn. Hai dòng <code>COPY</code> thêm là vì web import <em>kiểu</em> từ hai tệp hợp đồng của API (hình dạng lỗi, sự kiện realtime) — bài 6.1 và 7.1.</p>

<h3>2. Lần dựng đầu: một phụ thuộc ngầm lộ ra</h3>
<div class="out">${THIEU_ZOD}</div>
<div class="out">${NPM_LS}</div>
<p><code>error.schema.ts</code> import <code>zod</code>; để kiểm kiểu tệp đó, <code>tsc</code> của web cần khai báo kiểu của zod. Trên máy bạn nó chạy được là nhờ <em>may</em>: <code>node_modules</code> ở gốc có zod vì <em>API</em> dùng nó. <code>npm ci -w apps/web</code> chỉ cài thư viện của web ⇒ cái may biến mất. Cách sửa: dùng gì khai nấy — <code>npm i -D -E zod@4.6.7 -w apps/web</code> (đúng phiên bản của API, chỉ là devDependency; không có gì tới trình duyệt vì đó là <code>import type</code>). Docker là máy dò phụ thuộc chưa khai rất tốt: lần nào nó cũng bắt đầu từ con số không.</p>

<h3>3. Nginx: một origin</h3>
<pre><code class="language-nginx">${NGINX}</code></pre>
<div class="out">${ANH_WEB}</div>
<div class="out">${DINH_TUYEN}</div>
<p><code>/bai/…</code> không phải tệp; <code>try_files $uri /index.html</code> trao nó cho React Router. <code>index.html</code> là <code>no-cache</code> (nó trỏ tới gói JS mới nhất có băm trong tên); tệp có băm được cache một năm. Vì trình duyệt chỉ thấy <code>localhost:41830</code>, vẫn không cần CORS và cookie refresh (<code>SameSite=Strict</code>, <code>Path=/api/auth</code>) chạy y như lúc dev.</p>

<h3>4. Ba cái bẫy của Nginx, có số đo</h3>
<p><strong>Bẫy A — tệp thiếu trả 200.</strong> Dòng cuối của phần định tuyến: <code>/khong-co.png</code> trả <code>200 text/html</code>. Thẻ <code>&lt;img&gt;</code> vỡ âm thầm; một trang cũ trong cache xin tệp JS cũ thì nhận về HTML và văng <code>Unexpected token '&lt;'</code>. Sửa: một khối regex cho đường có đuôi tệp, <code>try_files $uri =404</code>.</p>
<div class="out">${TEP_THIEU}</div>
<p><strong>Bẫy B — regex thắng tiền tố.</strong> Nginx xét các khối tiền tố, rồi tới các khối regex, và regex khớp thì thắng — trừ khi khối tiền tố có <code>^~</code>. Thiếu <code>^~</code> ở <code>/chiase/</code>, mọi ảnh (đuôi <code>.webp</code>) chạy vào khối regex:</p>
<div class="out">${THIEU_MU}</div>
<p><strong>Bẫy C — bản sửa làm hỏng cache.</strong> <code>try_files … /index.html</code> là một lần chuyển hướng nội bộ; <code>index.html</code> có đuôi ⇒ rơi vào khối regex và mất <code>Cache-Control: no-cache</code>. Trình duyệt có thể tự cache nó theo phỏng đoán, giữ người dùng ở gói JS của hôm qua sau khi deploy. Khối khớp chính xác <code>location = /index.html</code> thắng regex:</p>
<div class="out">${INDEX_CACHE}</div>
<p>Rút ra: mọi lần sửa <code>nginx.conf</code> đều kèm đúng năm dòng <code>curl -I</code> ngay sau đó. Checkpoint 9 chạy chúng.</p>

<h3>5. WebSocket qua Nginx</h3>
<div class="out">${WS_DUNG}</div>
<p>Socket.IO nối bằng HTTP long-polling rồi nâng cấp. Bỏ hai dòng <code>Upgrade</code>/<code>Connection</code> (Nginx CỐ Ý gỡ các header hop-by-hop này):</p>
<div class="out">${WS_THIEU}</div>
<p>Không lỗi, không cảnh báo, ứng dụng vẫn "chạy" — chỉ là mỗi sự kiện giờ tốn một request HTTP mỗi lượt hỏi, và khi có nhiều instance API thì polling hỏng nếu không có sticky session (bài 7.3). Chỉ đo kiểu truyền mới thấy.</p>

<div class="pitfall co-tieu-de"><p><strong>Góc hacker — gói JS là công khai.</strong> Mọi thứ <code>vite build</code> nhúng vào đều được mọi người truy cập tải về. Tài liệu Vite nói thẳng: <em>VITE_* variables should not contain sensitive information such as API keys.</em> Chính cuongthai.com đã học điều này ngày 02/07/2026: khoá GIPHY đi theo biến công khai lúc dựng, rồi rơi về một khoá công khai đã bị thu hồi làm hỏng bộ chọn GIF; cách sửa là một route backend giữ khoá lúc chạy. Ảnh web của ChiaSe không có bí mật nào theo thiết kế: không có giá trị <code>VITE_*</code> nào, cấu hình nằm ở API.</p></div>

${spring(false, 'Ở bộ SWP391 (React + Spring Boot), ảnh frontend y hệt: Node dựng, Nginx phục vụ và chuyển /api sang container Spring để trình duyệt chỉ thấy một origin (production không cần cấu hình CORS).', [
  ['sb-21-1-kien-truc-spa', 'Spring Boot 21.1 — Kiến trúc SPA và proxy'],
  ['sb-17-4-checkpoint-9', 'Spring Boot 17.4 — Checkpoint: cả hệ thống chạy bằng một lệnh'],
])}

<h3>Liên hệ đời thường</h3>
<p>Nginx là lễ tân toà nhà: khách chỉ biết quầy lễ tân. "Phòng 101?" — đây là tờ giới thiệu (tệp tĩnh). "Phòng kế toán?" — mời lên tầng API. "Cuộc gọi dài?" — nối máy thẳng (WebSocket), nhưng chỉ khi lễ tân được dặn là phải giữ đường dây.</p>

<h3>Tình huống đi làm thật</h3>
<p>Một ticket kinh điển ở dự án outsourcing: "sau khi deploy, vài người dùng thấy trang trắng tới khi bấm Ctrl+F5". Mười lần thì chín lần là <code>index.html</code> bị cache, đúng bẫy C. Kiểm bằng <code>curl -I</code> trước khi động vào mã.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Phục vụ SPA React trên production thế nào?"</strong> — Dựng ra tệp tĩnh, phục vụ bằng Nginx/CDN, <code>try_files</code> về index.html, cache dài cho tệp có băm, no-cache cho index.html.</li>
<li><strong>"Vì sao cho API đi chung origin?"</strong> — Không CORS, cookie SameSite=Strict chạy được, một chứng chỉ TLS.</li>
<li><strong>"WebSocket chạy ở máy mà sau Nginx thì không — vì sao?"</strong> — Phải đặt rõ header Upgrade/Connection và HTTP/1.1.</li>
<li><strong>"Frontend giữ API key được không?"</strong> — Không; mọi thứ trong gói JS là công khai. Dùng route backend.</li>
</ol>

<h3>🧪 Lab 9.2</h3>
<div class="callout ok">
<ol>
<li>Dựng ảnh web với <code>npm ci -w apps/web</code> và tái hiện lỗi zod; sửa bằng cách khai phụ thuộc.</li>
<li>Chạy stack (bài 9.3) và chạy năm phép <code>curl -I</code> ở mục 3.</li>
<li>Tái hiện lần lượt bẫy A, B, C bằng cách sửa <code>nginx.conf</code> trong container (<code>docker compose exec web vi …</code> rồi <code>nginx -s reload</code>), mỗi lần chạy lại đúng các lệnh curl.</li>
<li>Viết script 15 dòng nối Socket.IO vào cổng 41830 và in kiểu truyền sau 3 s; bỏ header Upgrade rồi chạy lại.</li>
</ol>
<p><strong>Xong khi:</strong> <code>/</code> và <code>/bai/x</code> là 200 no-cache, <code>.png</code> không có là 404, ảnh dưới <code>/chiase/</code> là 200 <code>image/webp</code>, tệp có băm là immutable, và kiểu truyền là <code>websocket</code>.</p>
</div>
<details><summary>Lời giải</summary>
<p><code>apps/web/Dockerfile</code> và <code>apps/web/nginx.conf</code> in ở trên; zod trong devDependencies của <code>apps/web/package.json</code>. Script Socket.IO chính là phép kiểm ở bước 3 của <code>scripts/checkpoint-9.mjs</code>.</p>
</details>

<div class="kv-grid">
  <div class="kv"><span class="k">dựng tĩnh</span><span class="v">vite build ⇒ HTML/JS/CSS; không có tiến trình máy chủ.</span></div>
  <div class="kv"><span class="k">try_files</span><span class="v">Thử tệp, không có thì lùi (SPA: /index.html; tệp: =404).</span></div>
  <div class="kv"><span class="k">^~</span><span class="v">Khối tiền tố khiến Nginx không xét khối regex nữa.</span></div>
  <div class="kv"><span class="k">location =</span><span class="v">Khớp chính xác; thắng mọi khối khác.</span></div>
  <div class="kv"><span class="k">header hop-by-hop</span><span class="v">Upgrade/Connection: proxy không chuyển tiếp nếu không đặt.</span></div>
  <div class="kv"><span class="k">cùng origin</span><span class="v">Cùng scheme+host+cổng ⇒ không CORS, cookie Strict chạy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hai tầng: Node dựng, Nginx phục vụ; ảnh 103 MB, ứng dụng 400 kB.</li>
<li>Docker làm lộ phụ thuộc chưa khai: khai zod cho bước kiểm kiểu của web.</li>
<li>Nginx giữ một origin: /, /api/, /socket.io/, /chiase/.</li>
<li>Tệp thiếu phải 404; khối tiền tố cần ^~ khi có regex; index.html cần khối khớp chính xác.</li>
<li>Thiếu Upgrade/Connection, Socket.IO âm thầm ở lại polling.</li>
<li>Gói JS là công khai: không có bí mật trong VITE_*.</li>
</ul>
${NGUON}
${THE}
</div>
`,
};
