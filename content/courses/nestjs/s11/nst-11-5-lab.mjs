/**
 * 11.5 — Lab: Đưa lên — stack compose, CI xanh, khởi động lại không rớt request (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà): moc11/compose.yaml (db, redis, migrate, api1, api2, worker, nginx 1.29.8 lb :42150, HAProxy 3.2 lbh :42151),
 * tải bằng lab/c11/k115.mjs (autocannon 9.0.0, 20 kết nối) trong lúc restart theo 3 cách ⇒ lab/c11/o/115-*.txt.
 * Ghép: gen.mjs rồi ghep.sh 115 nst-11-5-lab.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'docker', bai: 'dk-10-5-nginx-lap-rap', title: 'Docker 10.5 — nginx đứng trước, và cả cái file', sub: 'nginx reverse proxy nói chung.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-11-4-cap-nhat-quay-lui', title: 'Docker 11.4 — Cập nhật, CI/CD, và quay lui', sub: 'Chiến lược cập nhật trên một máy.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-11-2-health', title: 'NestJS 11.2 — Health check và tắt êm', sub: 'Thứ tự hook và grace — lab này kiểm nó dưới tải thật.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-7-5-throttler-helmet', title: 'NestJS 7.5 — Throttler', sub: 'Nơi giới hạn 100/phút được thêm — lab này thấy nó nhân đôi khi có hai bản.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'nginx docs — ngx_http_upstream_module (server … resolve)', 'Từ 1.27.3 bản OSS có tham số resolve + zone: hỏi lại DNS cho tên upstream.', 'https://nginx.org/en/docs/http/ngx_http_upstream_module.html#resolve'),
  nguon('📘', 'nginx docs — proxy_next_upstream', 'Request không idempotent (POST…) không được chuyển sang server khác sau khi đã gửi đi.', 'https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_next_upstream'),
  nguon('📘', 'HAProxy docs — option httpchk, retries, option redispatch', 'Kiểm sức khoẻ chủ động và thử lại sang server khác.', 'https://docs.haproxy.org/3.2/configuration.html'),
].join('\n');
const MA_COMPOSE = "# compose.yaml — lab-booking chạy như production trên một máy: db, redis, migrate (chạy một lần), 2 bản API, worker, nginx\n# Chạy: echo \"JWT_SECRET=$(openssl rand -base64 33)\" > .env && docker compose up -d --build --wait\nname: nst-lb\nx-app: &app\n  image: ${IMAGE:-lab-booking:local}\n  restart: unless-stopped\n  stop_grace_period: 20s            # > SHUTDOWN_GRACE_MS + thời gian request dài nhất; hết hạn Docker mới SIGKILL\n  environment: &env\n    NODE_ENV: production\n    DATABASE_URL: postgresql://lab:lab@db:5432/lab\n    REDIS_URL: redis://redis:6379\n    JWT_SECRET: ${JWT_SECRET:?đặt JWT_SECRET trong .env}\n    TRUST_PROXY: 1\n    LOG_LEVEL: info\n    RATE_LIMIT_PER_MIN: ${RATE_LIMIT_PER_MIN:-100}\n  depends_on:\n    migrate: { condition: service_completed_successfully }\n    redis: { condition: service_healthy }\n\nservices:\n  db:\n    image: postgres:16\n    environment: { POSTGRES_USER: lab, POSTGRES_PASSWORD: lab, POSTGRES_DB: lab }\n    volumes: [pgdata:/var/lib/postgresql/data]\n    healthcheck: { test: [CMD, pg_isready, -U, lab], interval: 2s, timeout: 3s, retries: 20 }\n  redis:\n    image: redis:7-alpine\n    healthcheck: { test: [CMD, redis-cli, ping], interval: 2s, timeout: 3s, retries: 20 }\n  migrate:\n    build: { context: ., target: migrate }\n    environment: { DATABASE_URL: postgresql://lab:lab@db:5432/lab }\n    depends_on: { db: { condition: service_healthy } }\n    restart: 'no'\n  api1: &api\n    <<: *app\n    build: { context: ., target: runtime }\n    environment:                    # ${…} trong mapping { … } làm vỡ YAML ⇒ dạng khối\n      <<: *env\n      APP_ROLE: api\n      SHUTDOWN_GRACE_MS: ${GRACE:-3000}\n    healthcheck:\n      test: [CMD, wget, -qO-, http://127.0.0.1:3000/health/ready]\n      interval: 2s\n      timeout: 2s\n      retries: 3\n      start_period: 20s\n  api2: *api\n  worker:\n    <<: *app\n    command: [node, dist/main-worker.js]\n    environment: { <<: *env, APP_ROLE: worker }\n  lb:\n    image: nginx:1.29-alpine\n    volumes: [./lb/nginx.conf:/etc/nginx/nginx.conf:ro]\n    ports: ['127.0.0.1:42150:80']\n    depends_on: { api1: { condition: service_healthy }, api2: { condition: service_healthy } }\n  lbh:                              # bài 11.5: cùng vai trò với lb nhưng kiểm /health/ready chủ động\n    image: haproxy:3.2-alpine\n    volumes: [./lb/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg:ro]\n    ports: ['127.0.0.1:42151:80']\n    depends_on: { api1: { condition: service_healthy }, api2: { condition: service_healthy } }\nvolumes: { pgdata: {} }";
const MA_NGINX = "# nginx.conf — một cổng vào, hai bản API. Bản đang tắt từ chối kết nối ⇒ nginx thử bản kia (proxy_next_upstream)\nworker_processes 1;\nevents { worker_connections 1024; }\nhttp {\n  access_log off;\n  # tên api1/api2 chỉ được phân giải MỘT lần lúc nginx khởi động — container tạo lại có IP mới ⇒ nginx gửi vào IP chết (502).\n  # resolver = DNS nội bộ của Docker; 'resolve' + zone (nginx OSS ≥ 1.27.3) ⇒ hỏi lại DNS theo valid=.\n  resolver 127.0.0.11 valid=2s ipv6=off;\n  upstream api {\n    zone api 64k;\n    server api1:3000 resolve max_fails=1 fail_timeout=5s;\n    server api2:3000 resolve max_fails=1 fail_timeout=5s;\n    keepalive 16;\n  }\n  map $http_upgrade $ket_noi { default upgrade; '' ''; }\n  server {\n    listen 80;\n    location /health/ { return 404; }                 # chi tiết sức khoẻ chỉ cho mạng nội bộ, không ra ngoài\n    location / {\n      proxy_pass http://api;\n      proxy_http_version 1.1;\n      proxy_set_header Connection $ket_noi;            # rỗng ⇒ giữ keep-alive tới upstream; \"upgrade\" ⇒ WebSocket\n      proxy_set_header Upgrade $http_upgrade;\n      proxy_set_header Host $host;\n      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n      proxy_set_header X-Request-Id $request_id;\n      proxy_next_upstream error timeout http_502 http_503;\n      proxy_connect_timeout 2s;\n    }\n  }\n}";
const MA_HAP = "# haproxy.cfg — LB kiểm sức khoẻ CHỦ ĐỘNG: hỏi /health/ready mỗi giây; một lần 503 ⇒ rút bản đó khỏi vòng (nginx OSS không làm được)\nglobal\n  log stdout format raw local0 warning\ndefaults\n  mode http\n  timeout connect 2s\n  timeout client 30s\n  timeout server 30s\n  retries 2\n  option redispatch\nresolvers docker\n  nameserver dns 127.0.0.11:53\n  hold valid 2s\nfrontend vao\n  bind :80\n  http-request deny deny_status 404 if { path_beg /health/ }\n  default_backend api\nbackend api\n  balance roundrobin\n  option httpchk GET /health/ready\n  http-check expect status 200\n  default-server check inter 1s fall 1 rise 2 resolvers docker init-addr none\n  server api1 api1:3000\n  server api2 api2:3000";
const MA_TATEM = "// tat-em.ts — mốc 11: từ lúc nhận SIGTERM, mọi phản hồi mang \"Connection: close\" ⇒ nginx/LB bỏ kết nối keep-alive tới bản này.\n// Không có nó: kết nối keep-alive luôn bận dưới tải ⇒ server.close() chờ mãi ⇒ Docker hết stop_grace_period thì SIGKILL.\n// onModuleDestroy là hook ĐẦU TIÊN của app.close() — chạy trước thời gian chờ SHUTDOWN_GRACE_MS của terminus (beforeApplicationShutdown).\nimport { Injectable, OnModuleDestroy } from '@nestjs/common';\nimport type { NextFunction, Request, Response } from 'express';\n\n@Injectable()\nexport class TatEm implements OnModuleDestroy {\n  dangTat = false;\n  onModuleDestroy() { this.dangTat = true; }\n  middleware = (_req: Request, res: Response, next: NextFunction) => {\n    if (this.dangTat) res.setHeader('Connection', 'close');\n    next();\n  };\n}";
const MA_K115 = "// k115.mjs <giây> <lệnh shell…> — bắn tải GET /rooms (hoặc POST, xem POST=1) qua nginx (autocannon), sau 3 s chạy <lệnh> (restart kiểu nào đó), đếm lỗi\nimport autocannon from '/home/sv/app/node_modules/autocannon/autocannon.js';\nimport { spawn } from 'node:child_process';\nconst [giay, ...lenh] = process.argv.slice(2);\nconst ma = {};\n// POST=1 ⇒ bắn POST /auth/refresh (token sai ⇒ 401 — rẻ, KHÔNG idempotent ⇒ nginx không tự thử lại sang bản kia)\nconst post = process.env.POST === '1';\nconst inst = autocannon({ url: 'http://127.0.0.1:' + (process.env.CONG ?? 42150) + (post ? '/auth/refresh' : '/rooms'), connections: 20, duration: Number(giay),\n  ...(post ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ refreshToken: 'x'.repeat(43) }) } : {}) });\ninst.on('response', (_c, status) => { ma[status] = (ma[status] ?? 0) + 1; });\nsetTimeout(() => {\n  const t = Date.now();\n  const p = spawn('bash', ['-c', lenh.join(' ')], { stdio: ['ignore', 'ignore', 'inherit'] });\n  p.on('exit', (code) => console.log(`lệnh xong sau ${((Date.now() - t) / 1000).toFixed(1)} s (mã ${code})`));\n}, 3000);\nconst r = await new Promise((res) => inst.on('done', res));\nconsole.log(`tổng ${r.requests.total} request trong ${giay} s · theo mã:`, JSON.stringify(ma), `· lỗi kết nối/timeout: ${r.errors} (${r.timeouts} timeout) · p99 ${r.latency.p99} ms`);";
const OUT_UP = " Container nst-lb-api1-1 Healthy \n Container nst-lb-redis-1 Healthy \n Container nst-lb-api1-1 Healthy \n Container nst-lb-lb-1 Healthy \n Container nst-lb-migrate-1 Exited \n Container nst-lb-db-1 Healthy \n Container nst-lb-worker-1 Healthy \n Container nst-lb-api2-1 Healthy \ndocker compose up -d --build --wait --wait-timeout 180  0.24s user 0.09s system 1% cpu 25.470 total";
const OUT_THR2 = "lệnh xong sau 0.0 s (mã 0)\ntổng 46129 request trong 8 s · theo mã: {\"200\":199,\"429\":45930} · lỗi kết nối/timeout: 0 (0 timeout) · p99 19 ms";
const OUT_NEN = "lệnh xong sau 0.0 s (mã 0)\ntổng 16350 request trong 8 s · theo mã: {\"200\":16350} · lỗi kết nối/timeout: 0 (0 timeout) · p99 20 ms";
const OUT_Y_CU = "## lần lượt từng bản (force-recreate), nginx.conf cũ\ntổng 1473013 request trong 30 s · theo mã: {\"200\":11681,\"502\":1461332} · lỗi kết nối/timeout: 0 (0 timeout) · p99 32 ms\nlệnh xong sau 35.2 s (mã 0)";
const OUT_STOP = "tổng 36436 request trong 15 s · theo mã: {\"200\":36436} · lỗi kết nối/timeout: 0 (0 timeout) · p99 25 ms\nstop api1 dưới tải: 15.021393794 s, ExitCode=0\nlệnh xong sau 15.0 s (mã 0)";
const OUT_STOP_SUA = "stop api1 dưới tải: 3.329223134 s, ExitCode=0\nlệnh xong sau 3.4 s (mã 0)\ntổng 29257 request trong 15 s · theo mã: {\"200\":29257} · lỗi kết nối/timeout: 0 (0 timeout) · p99 27 ms";
const OUT_XYZ = "## X — docker compose restart api1 api2\nlệnh xong sau 3.5 s (mã 0)\ntổng 345531 request trong 20 s · theo mã: {\"200\":41968,\"502\":303563} · lỗi kết nối/timeout: 0 (0 timeout) · p99 151 ms\n## Y — lần lượt, SHUTDOWN_GRACE_MS=3000\nlệnh xong sau 18.1 s (mã 0)\ntổng 81211 request trong 30 s · theo mã: {\"200\":81211} · lỗi kết nối/timeout: 0 (0 timeout) · p99 47 ms\n## Z — lần lượt, SHUTDOWN_GRACE_MS=0\nlệnh xong sau 19.5 s (mã 0)\ntổng 67742 request trong 30 s · theo mã: {\"200\":67742} · lỗi kết nối/timeout: 0 (0 timeout) · p99 49 ms";
const OUT_POST = "## nginx, POST, grace 3000 (2 lượt)\ntổng 67543 request trong 30 s · theo mã: {\"401\":67536,\"502\":7} · lỗi kết nối/timeout: 0 (0 timeout) · p99 43 ms\ntổng 97851 request trong 30 s · theo mã: {\"401\":97841,\"502\":10} · lỗi kết nối/timeout: 0 (0 timeout) · p99 35 ms\n## nginx, POST, grace 0 (2 lượt)\ntổng 76390 request trong 30 s · theo mã: {\"401\":76370,\"502\":20} · lỗi kết nối/timeout: 0 (0 timeout) · p99 42 ms\ntổng 75501 request trong 30 s · theo mã: {\"401\":75480,\"502\":21} · lỗi kết nối/timeout: 0 (0 timeout) · p99 60 ms";
const OUT_HPOST = "## HAProxy, POST, grace 3000\ntổng 57678 request trong 30 s · theo mã: {\"401\":57678} · lỗi kết nối/timeout: 0 (0 timeout) · p99 31 ms\n## HAProxy, POST, grace 0\ntổng 69596 request trong 30 s · theo mã: {\"401\":69596} · lỗi kết nối/timeout: 0 (0 timeout) · p99 22 ms";
const OUT_HLOG = "[WARNING]  (8) : Server api/api1 is DOWN, reason: Layer7 wrong status, code: 503, info: \"Service Unavailable\", check duration: 31ms. 1 active and 0 ba …\n[WARNING]  (8) : Server api/api1 is UP, reason: Layer7 check passed, code: 200, check duration: 3ms. 2 active and 0 backup servers online. 0 sessions  …\n[WARNING]  (8) : Server api/api2 is DOWN, reason: Layer7 wrong status, code: 503, info: \"Service Unavailable\", check duration: 6ms. 1 active and 0 bac …\n[WARNING]  (8) : Server api/api2 is UP, reason: Layer7 check passed, code: 200, check duration: 3ms. 2 active and 0 backup servers online. 0 sessions  …";
const OUT_HOOK = "GOI onApplicationShutdown, redis.status = ready\nGOI onApplicationShutdown, redis.status = ready\n{\"level\":50,\"context\":\"Error: Connection is closed.\\n    at close (/home/sv/app/node_modules/ioredis/built/redis/event_handler.js:214:25)\\n    at Socket.<anonymous> (…/ioredis/built/redis/event_handler.js:181:20) …\",\"err\":{\"type\":\"Error\",\"message\":\"Connection is closed.\"},\"msg\":\"Connection is closed.\"}";

const BANG_EN = `<table>
<tr><th>Scenario (load during restart)</th><th>Result</th></tr>
<tr><td>Both replicas restarted at once</td><td>303,563 × 502 out of 345,531</td></tr>
<tr><td>One at a time, old nginx.conf (names resolved once)</td><td>1,461,332 × 502 — nginx kept the dead IP</td></tr>
<tr><td>One at a time, <code>resolve</code>, GET, grace 3000 / 0</td><td>0 errors / 0 errors (nginx retries GET)</td></tr>
<tr><td>One at a time, nginx, POST, grace 3000 / 0</td><td>7 and 10 × 502 / 20 and 21 × 502</td></tr>
<tr><td>One at a time, HAProxy (readiness every 1 s), POST, grace 3000 / 0</td><td>0 / 0</td></tr>
<tr><td><code>docker compose stop api1</code> under load, before / after <code>TatEm</code></td><td>15.0 s / 3.3 s, both ExitCode 0</td></tr>
</table>`;
const BANG_VI = `<table>
<tr><th>Kịch bản (có tải trong lúc khởi động lại)</th><th>Kết quả</th></tr>
<tr><td>Khởi động lại cả hai bản cùng lúc</td><td>303.563 × 502 trên 345.531</td></tr>
<tr><td>Lần lượt từng bản, nginx.conf cũ (tên chỉ phân giải một lần)</td><td>1.461.332 × 502 — nginx giữ IP đã chết</td></tr>
<tr><td>Lần lượt, có <code>resolve</code>, GET, grace 3000 / 0</td><td>0 lỗi / 0 lỗi (nginx tự thử lại GET)</td></tr>
<tr><td>Lần lượt, nginx, POST, grace 3000 / 0</td><td>7 và 10 × 502 / 20 và 21 × 502</td></tr>
<tr><td>Lần lượt, HAProxy (kiểm readiness mỗi 1 giây), POST, grace 3000 / 0</td><td>0 / 0</td></tr>
<tr><td><code>docker compose stop api1</code> khi có tải, trước / sau <code>TatEm</code></td><td>15,0 s / 3,3 s, đều ExitCode 0</td></tr>
</table>`;

export default {
  title: '11.5 — Lab: Ship it — compose stack, green CI, zero-downtime restart|||11.5 — Lab: Đưa lên — stack compose, CI xanh, khởi động lại không rớt request',
  slug: 'nst-11-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dựng lab-booking như production trên một máy: PostgreSQL, Redis, migrate chạy một lần, hai bản API, worker, nginx — rồi bắn tải liên tục trong lúc khởi động lại. Năm phát hiện thật: throttler đếm trong RAM nên hai bản cho 199 request/phút thay vì 100; nginx giữ IP cũ sau khi container được tạo lại ⇒ 1,46 triệu lỗi 502; dừng một bản dưới tải mất 15 giây vì kết nối keep-alive không bao giờ rảnh; POST qua nginx vẫn rớt 7–21 request; HAProxy kiểm readiness chủ động thì 0.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lab</span>
<h2>11.5 — Lab: two API replicas behind a load balancer, restarted under load until nothing is dropped</h2>
<p class="lead">This lab joins 11.1–11.3: the image, the health endpoints, the CI smoke test. The goal is the khung's pass criteria — image under 200 MB to pull, non-root, health green, CI running e2e — plus one hard one: restart the API while traffic flows and drop nothing. Every finding below came from running it, and most of them were not predicted.</p>

<h3>Pass criteria</h3>
<ol>
<li><code>docker compose up -d --build --wait</code> reaches healthy for every service; <code>migrate</code> exits 0 before any API starts.</li>
<li>Runtime image under 200 MB to pull, runs as <code>node</code> (11.1: 106 MB, uid 1000).</li>
<li><code>/health/*</code> is not reachable from outside the load balancer.</li>
<li>Rate limit is one limit for the whole API, not one per replica.</li>
<li>A one-at-a-time restart under constant load: 0 failed requests for GET; explain any POST failures.</li>
</ol>

<h3>1. The stack</h3>
<pre><code class="language-yaml">${esc(MA_COMPOSE)}</code></pre>
<pre><code class="language-text">${esc(OUT_UP)}</code></pre>
<p>Order is enforced by conditions, not by hope: <code>migrate</code> waits for a healthy DB and must <em>complete successfully</em>; APIs and worker wait for it; the load balancers wait for healthy APIs (whose healthcheck is <code>/health/ready</code>, 11.2). The worker is the same image with another command (9.x). Secrets come from <code>.env</code>, never from the file.</p>
<p>Load generator — 20 connections for N seconds, runs a shell command at t = 3 s, counts status codes:</p>
<pre><code class="language-js">${esc(MA_K115)}</code></pre>

<h3>2. Finding 1 — two replicas, two rate limits</h3>
<pre><code class="language-text">${esc(OUT_THR2)}</code></pre>
<p>199 requests passed in the first minute instead of 100: <code>@nestjs/throttler</code> counts in each process's memory, so each replica gave the client its own 100. Every horizontally scaled Nest API with the default storage has this. Milestone 11.6 adds a Redis storage and a test proving request 101 is refused whichever replica it reaches. (For the load tests below <code>RATE_LIMIT_PER_MIN</code> is raised; otherwise we would be measuring 429s.)</p>

<h3>3. Finding 2 — nginx remembers dead IP addresses</h3>
<pre><code class="language-text">${esc(OUT_Y_CU)}</code></pre>
<p><code>--force-recreate</code> creates a new container with a new IP. nginx resolved <code>api1</code>/<code>api2</code> once at startup and kept sending to the old addresses until the end of the test. The fix (nginx OSS ≥ 1.27.3) is in the config below: Docker's DNS as <code>resolver</code>, a shared <code>zone</code>, and <code>resolve</code> on each server.</p>
<pre><code class="language-nginx">${esc(MA_NGINX)}</code></pre>

<h3>4. Finding 3 — shutdown waits forever under load</h3>
<pre><code class="language-text">${esc(OUT_STOP)}</code></pre>
<p>Stopping one replica took 15.0 s — exactly until the load generator stopped. <code>server.close()</code> waits for open connections, and nginx's keep-alive connections never become idle while traffic flows. Under longer load Docker would SIGKILL at <code>stop_grace_period</code> and cut requests in flight. Fix: from the first shutdown hook, every response carries <code>Connection: close</code>, so nginx drops those connections one by one during the grace period:</p>
<pre><code class="language-ts">${esc(MA_TATEM)}</code></pre>
<pre><code class="language-text">${esc(OUT_STOP_SUA)}</code></pre>

<h3>5. The restart experiments</h3>
<pre><code class="language-text">${esc(OUT_XYZ)}</code></pre>
<p>Restarting both at once is an outage, as expected. One at a time is clean for GET — even with grace 0, because nginx retries a GET on the other server when a connection is refused. POST is where the load balancer's behaviour shows:</p>
<pre><code class="language-text">${esc(OUT_POST)}</code></pre>
<p>nginx OSS never reads <code>/health/ready</code>; it learns that a server is gone only when a request fails, and it will not resend a POST that already went out (it might not be idempotent). The grace period cut failures roughly in half, but nginx kept choosing the replica that was shutting down. HAProxy with an active readiness check:</p>
<pre><code class="language-text">${esc(MA_HAP)}</code></pre>
<pre><code class="language-text">${esc(OUT_HPOST)}</code></pre>
<pre><code class="language-text">${esc(OUT_HLOG)}</code></pre>
<p>HAProxy saw the 503 <code>shutting_down</code> within a second, took the replica out, and its <code>retries</code> + <code>redispatch</code> covered connection failures. Honest reading: with HAProxy even grace 0 gave 0 errors in these runs, so here the load balancer's configuration mattered more than the grace period; the grace period is what makes readiness-based balancers (HAProxy, Kubernetes Services) safe when a slow request or a slow probe is involved.</p>
${BANG_EN}

<h3>6. Finding 4 — a shutdown hook that ran twice</h3>
<pre><code class="language-text">${esc(OUT_HOOK)}</code></pre>
<p>The new Redis throttler storage logged "Connection is closed" on every shutdown. A <code>console.log</code> in the hook showed why: the same instance is registered under two tokens — its class, and <code>ThrottlerStorage</code> from <code>ThrottlerModule.forRootAsync</code> — so Nest calls <code>onApplicationShutdown</code> twice, concurrently, and the second <code>quit()</code> fails. Make hooks idempotent (11.6 keeps the first promise).</p>

<h3>🧪 Your turn (60 min)</h3>
<ol>
<li>Bring the stack up from a clean state (<code>docker compose down -v</code>). Check every pass criterion and write the command that proves each.</li>
<li>Reproduce finding 2: start with the old nginx config (servers without <code>resolve</code>), recreate <code>api1</code>, watch the 502s. Then fix it.</li>
<li>Run the POST experiment against nginx and HAProxy. Then change nginx to <code>proxy_next_upstream … non_idempotent</code> and explain why that is dangerous for <code>POST /bookings</code>.</li>
<li>Write a <code>deploy.sh</code> that updates the API with zero failed GETs: build, migrate, then replace replicas one at a time and wait for health.</li>
</ol>
<details><summary>Show answers</summary>
<ol>
<li>(1) <code>docker compose ps</code> all healthy, <code>docker compose ps -a migrate</code> "Exited (0)"; (2) <code>docker image inspect -f '{{.Size}} {{.Config.User}}'</code>; (3) <code>curl -s -o /dev/null -w '%{http_code}' 127.0.0.1:42150/health/ready</code> ⇒ 404; (4) 101 requests to <code>/rooms</code> through the LB ⇒ last one 429; (5) <code>k115.mjs</code> with the one-at-a-time command.</li>
<li>Old config: 502 for every request routed to the recreated replica until nginx restarts. With <code>resolver 127.0.0.11 valid=2s</code> + <code>zone</code> + <code>resolve</code>, new IPs are picked up within seconds.</li>
<li><code>non_idempotent</code> lets nginx resend a POST after a timeout or a reset — the first replica may already have committed the booking, so the user gets two bookings or a confusing 409. Safe retries for writes need an idempotency key (the API stores the key and returns the first result for a repeat), not a proxy flag.</li>
<li><pre><code class="language-bash">#!/usr/bin/env bash
set -euo pipefail
docker compose build
docker compose run --rm migrate
for s in api1 api2; do
  docker compose up -d --no-deps --force-recreate --wait "$s"   # --wait = healthy (readiness)
done
docker compose up -d --no-deps --force-recreate worker
</code></pre>Migrations must be backward compatible with the old code still running (add column first, drop later — prisma-orm course), because during the loop both versions serve traffic.</li>
</ol>
</details>

<h3>💼 On the job</h3>
<p>"Deploy at night so nobody notices the errors" is a common habit on small teams. With the numbers from this lab you can propose a better default: one replica at a time, readiness-based LB, <code>Connection: close</code> on shutdown, a deploy script that waits for health — and a five-minute load test that proves it, attached to the proposal.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rolling restart</span><span class="v">Replace replicas one at a time, waiting for each to be ready.</span></div>
  <div class="kv"><span class="k">Passive vs active health check</span><span class="v">Passive: notice failures on real requests (nginx OSS). Active: poll a health URL (HAProxy, Kubernetes).</span></div>
  <div class="kv"><span class="k">Idempotent</span><span class="v">Repeating the request has the same effect as once — GET yes, POST not by default.</span></div>
  <div class="kv"><span class="k">Keep-alive</span><span class="v">Reusing one TCP connection for many requests; must be closed deliberately on shutdown.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Compose order by conditions: healthy DB → migrate completed → APIs/worker → healthy APIs → LB.</li>
<li>Found by running it: per-replica rate limit (199/min), nginx stale IP (1.46 M × 502), shutdown blocked by keep-alive (15 s), shutdown hook called twice.</li>
<li>One at a time + <code>resolve</code>: GET 0 errors. POST via nginx 7–21 × 502; HAProxy with readiness checks 0.</li>
<li>Write retries need idempotency keys, not <code>non_idempotent</code>.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Lab</span>
<h2>11.5 — Lab: hai bản API sau một bộ cân bằng tải, khởi động lại dưới tải cho tới khi không rớt request nào</h2>
<p class="lead">Lab này ghép 11.1–11.3: ảnh, endpoint sức khoẻ, smoke test của CI. Mục tiêu là tiêu chí đạt của khung — ảnh kéo về dưới 200 MB, không chạy root, health xanh, CI chạy e2e — cộng một tiêu chí khó: khởi động lại API trong khi request vẫn chảy mà không rớt cái nào. Mọi phát hiện dưới đây đến từ việc chạy thật, và phần lớn không đoán trước được.</p>

<h3>Tiêu chí đạt</h3>
<ol>
<li><code>docker compose up -d --build --wait</code> đưa mọi dịch vụ về healthy; <code>migrate</code> thoát 0 trước khi API nào khởi động.</li>
<li>Ảnh runtime kéo về dưới 200 MB, chạy bằng <code>node</code> (11.1: 106 MB, uid 1000).</li>
<li><code>/health/*</code> không gọi được từ ngoài bộ cân bằng tải.</li>
<li>Giới hạn tần suất là một giới hạn cho cả API, không phải mỗi bản một giới hạn.</li>
<li>Khởi động lại lần lượt từng bản dưới tải liên tục: 0 request GET hỏng; giải thích được mọi lỗi POST.</li>
</ol>

<h3>1. Stack</h3>
<pre><code class="language-yaml">${esc(MA_COMPOSE)}</code></pre>
<pre><code class="language-text">${esc(OUT_UP)}</code></pre>
<p>Thứ tự được ép bằng điều kiện, không trông vào may mắn: <code>migrate</code> chờ DB healthy và phải <em>hoàn tất thành công</em>; API và worker chờ nó; bộ cân bằng tải chờ API healthy (healthcheck của API là <code>/health/ready</code>, 11.2). Worker là cùng ảnh với lệnh khác (9.x). Bí mật lấy từ <code>.env</code>, không bao giờ nằm trong tệp.</p>
<p>Bộ bắn tải — 20 kết nối trong N giây, chạy một lệnh shell ở t = 3 giây, đếm mã trạng thái:</p>
<pre><code class="language-js">${esc(MA_K115)}</code></pre>

<h3>2. Phát hiện 1 — hai bản, hai giới hạn</h3>
<pre><code class="language-text">${esc(OUT_THR2)}</code></pre>
<p>Phút đầu có 199 request lọt thay vì 100: <code>@nestjs/throttler</code> đếm trong bộ nhớ của từng tiến trình, nên mỗi bản cho client 100 của riêng nó. API Nest nào mở rộng ngang mà dùng kho mặc định cũng dính. Mốc 11.6 thêm kho Redis và một test chứng minh request thứ 101 bị từ chối dù rơi vào bản nào. (Ở các lượt bắn tải bên dưới, <code>RATE_LIMIT_PER_MIN</code> được nâng lên; không thì ta chỉ đo được 429.)</p>

<h3>3. Phát hiện 2 — nginx nhớ địa chỉ IP đã chết</h3>
<pre><code class="language-text">${esc(OUT_Y_CU)}</code></pre>
<p><code>--force-recreate</code> tạo container mới với IP mới. nginx phân giải <code>api1</code>/<code>api2</code> một lần lúc khởi động và cứ gửi vào địa chỉ cũ tới hết bài đo. Cách sửa (nginx OSS ≥ 1.27.3) nằm trong cấu hình dưới: DNS của Docker làm <code>resolver</code>, một <code>zone</code> dùng chung, và <code>resolve</code> trên từng server.</p>
<pre><code class="language-nginx">${esc(MA_NGINX)}</code></pre>

<h3>4. Phát hiện 3 — tắt dưới tải thì chờ mãi</h3>
<pre><code class="language-text">${esc(OUT_STOP)}</code></pre>
<p>Dừng một bản mất 15,0 giây — đúng tới lúc bộ bắn tải ngừng. <code>server.close()</code> chờ các kết nối đang mở, mà kết nối keep-alive của nginx không bao giờ rảnh khi request vẫn chảy. Tải dài hơn thì Docker sẽ SIGKILL khi hết <code>stop_grace_period</code> và cắt ngang request đang chạy. Cách sửa: từ hook tắt đầu tiên, mọi phản hồi mang <code>Connection: close</code>, để nginx bỏ dần từng kết nối đó trong thời gian chờ:</p>
<pre><code class="language-ts">${esc(MA_TATEM)}</code></pre>
<pre><code class="language-text">${esc(OUT_STOP_SUA)}</code></pre>

<h3>5. Các lượt khởi động lại</h3>
<pre><code class="language-text">${esc(OUT_XYZ)}</code></pre>
<p>Khởi động lại cả hai cùng lúc là sập, đúng như dự đoán. Lần lượt từng bản thì sạch với GET — kể cả grace 0, vì nginx tự thử lại GET sang server kia khi bị từ chối kết nối. Hành vi của bộ cân bằng tải lộ ra ở POST:</p>
<pre><code class="language-text">${esc(OUT_POST)}</code></pre>
<p>nginx OSS không bao giờ đọc <code>/health/ready</code>; nó chỉ biết một server đã đi khi một request hỏng, và nó không gửi lại POST đã đi ra (có thể không idempotent). Grace giảm lỗi chừng một nửa, nhưng nginx vẫn chọn trúng bản đang tắt. HAProxy với kiểm readiness chủ động:</p>
<pre><code class="language-text">${esc(MA_HAP)}</code></pre>
<pre><code class="language-text">${esc(OUT_HPOST)}</code></pre>
<pre><code class="language-text">${esc(OUT_HLOG)}</code></pre>
<p>HAProxy thấy 503 <code>shutting_down</code> trong vòng một giây, rút bản đó ra, và <code>retries</code> + <code>redispatch</code> che các lần hỏng kết nối. Đọc cho thật: với HAProxy, cả grace 0 cũng cho 0 lỗi ở các lượt này, nên ở đây cấu hình bộ cân bằng tải quan trọng hơn grace; grace là thứ làm cho các bộ cân bằng dựa trên readiness (HAProxy, Service của Kubernetes) an toàn khi có request chậm hay lần kiểm chậm.</p>
${BANG_VI}

<h3>6. Phát hiện 4 — hook tắt chạy hai lần</h3>
<pre><code class="language-text">${esc(OUT_HOOK)}</code></pre>
<p>Kho throttler Redis mới ghi "Connection is closed" mỗi lần tắt. Một dòng <code>console.log</code> trong hook cho thấy lý do: cùng một instance được đăng ký dưới hai token — lớp của nó, và <code>ThrottlerStorage</code> của <code>ThrottlerModule.forRootAsync</code> — nên Nest gọi <code>onApplicationShutdown</code> hai lần, song song, và lần <code>quit()</code> thứ hai hỏng. Viết hook sao cho gọi lại cũng không sao (11.6 giữ lại promise đầu tiên).</p>

<h3>🧪 Tới lượt bạn (60 phút)</h3>
<ol>
<li>Dựng stack từ trạng thái sạch (<code>docker compose down -v</code>). Kiểm từng tiêu chí đạt và viết lệnh chứng minh mỗi tiêu chí.</li>
<li>Tái hiện phát hiện 2: chạy cấu hình nginx cũ (server không có <code>resolve</code>), tạo lại <code>api1</code>, xem 502. Rồi sửa.</li>
<li>Chạy thí nghiệm POST với nginx và HAProxy. Sau đó đổi nginx sang <code>proxy_next_upstream … non_idempotent</code> và giải thích vì sao điều đó nguy hiểm với <code>POST /bookings</code>.</li>
<li>Viết <code>deploy.sh</code> cập nhật API mà không hỏng GET nào: dựng ảnh, migrate, rồi thay từng bản một và chờ healthy.</li>
</ol>
<details><summary>Xem đáp án</summary>
<ol>
<li>(1) <code>docker compose ps</code> mọi dịch vụ healthy, <code>docker compose ps -a migrate</code> "Exited (0)"; (2) <code>docker image inspect -f '{{.Size}} {{.Config.User}}'</code>; (3) <code>curl -s -o /dev/null -w '%{http_code}' 127.0.0.1:42150/health/ready</code> ⇒ 404; (4) 101 request tới <code>/rooms</code> qua bộ cân bằng tải ⇒ cái cuối 429; (5) <code>k115.mjs</code> với lệnh thay lần lượt.</li>
<li>Cấu hình cũ: mọi request được chia vào bản vừa tạo lại đều 502 cho tới khi khởi động lại nginx. Với <code>resolver 127.0.0.11 valid=2s</code> + <code>zone</code> + <code>resolve</code>, IP mới được nhận trong vài giây.</li>
<li><code>non_idempotent</code> cho nginx gửi lại POST sau timeout hay bị reset — bản đầu có thể đã commit lịch, nên người dùng nhận hai lịch hoặc một lỗi 409 khó hiểu. Thử lại an toàn cho lệnh ghi cần khoá idempotency (API lưu khoá và trả kết quả lần đầu cho lần lặp), không phải một cờ của proxy.</li>
<li><pre><code class="language-bash">#!/usr/bin/env bash
set -euo pipefail
docker compose build
docker compose run --rm migrate
for s in api1 api2; do
  docker compose up -d --no-deps --force-recreate --wait "$s"   # --wait = healthy (readiness)
done
docker compose up -d --no-deps --force-recreate worker
</code></pre>Migration phải tương thích ngược với mã cũ còn đang chạy (thêm cột trước, xoá sau — khoá prisma-orm), vì trong vòng lặp cả hai phiên bản cùng phục vụ request.</li>
</ol>
</details>

<h3>💼 Tình huống đi làm</h3>
<p>"Deploy lúc nửa đêm cho không ai thấy lỗi" là thói quen hay gặp ở đội nhỏ. Với số đo của lab này, bạn đề xuất được một mặc định tốt hơn: thay từng bản, bộ cân bằng tải dựa trên readiness, <code>Connection: close</code> lúc tắt, script deploy chờ healthy — kèm một bài bắn tải năm phút chứng minh, đính vào đề xuất.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Khởi động lại cuốn chiếu</span><span class="v">Thay từng bản một, chờ bản đó sẵn sàng rồi mới sang bản kế.</span></div>
  <div class="kv"><span class="k">Kiểm sức khoẻ bị động / chủ động</span><span class="v">Bị động: chỉ biết hỏng khi request thật hỏng (nginx OSS). Chủ động: hỏi URL sức khoẻ định kỳ (HAProxy, Kubernetes).</span></div>
  <div class="kv"><span class="k">Idempotent</span><span class="v">Lặp lại request có cùng tác dụng như một lần — GET có, POST mặc định không.</span></div>
  <div class="kv"><span class="k">Keep-alive</span><span class="v">Dùng lại một kết nối TCP cho nhiều request; lúc tắt phải chủ động đóng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Thứ tự Compose bằng điều kiện: DB healthy → migrate hoàn tất → API/worker → API healthy → bộ cân bằng tải.</li>
<li>Tìm ra nhờ chạy thật: giới hạn tần suất mỗi bản một (199/phút), nginx giữ IP cũ (1,46 triệu × 502), tắt bị keep-alive giữ (15 giây), hook tắt bị gọi hai lần.</li>
<li>Thay lần lượt + <code>resolve</code>: GET 0 lỗi. POST qua nginx 7–21 × 502; HAProxy có kiểm readiness: 0.</li>
<li>Thử lại lệnh ghi cần khoá idempotency, không phải <code>non_idempotent</code>.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
