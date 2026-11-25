/**
 * 9.3 — docker compose: cả hệ thống bằng một lệnh (soạn 25/11/2026, phiên Mac tiếp quản agent fsp).
 * Output THẬT (máy nhà, dự án compose fsp-chiase, cổng 41830): thiếu .env ⇒ compose từ chối ngay; URL ký sẵn trỏ http://kho:9000
 * ⇒ "Could not resolve host: kho" ⇒ S3_PUBLIC_ENDPOINT + Nginx /chiase/; Host $host ⇒ 403 SignatureDoesNotMatch; mặc định 1m ⇒ 413;
 * không trust proxy ⇒ ERR_ERL_UNEXPECTED_X_FORWARDED_FOR + kẻ dò mật khẩu khoá luôn người dùng khác (429 cho người đăng nhập đúng
 * lần đầu); TRUST_PROXY=1 ⇒ đúng người, X-Forwarded-For giả không lách; TRUST_PROXY=2 (dư một lớp) ⇒ 200/200 lần thử không bị chặn;
 * CSDL dừng ⇒ /api/health 503 ngay, container "unhealthy" sau ~46 s, KHÔNG tự khởi động lại; restart api ⇒ 502 ~1,2 s.
 * Nguồn: Docker docs "Packet filtering and firewalls" (cổng công bố đi vòng qua ufw), Express "Express behind proxies",
 * express-rate-limit error codes (GET 200 25/11/2026).
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const COMPOSE = `# ChiaSe chạy cả hệ thống bằng một lệnh (bài 9.3):   cp .env.example .env  (điền khoá)  rồi   docker compose up -d --build --wait
# Trình duyệt chỉ cần MỘT cổng: http://localhost:41830 (Nginx trong ảnh web). CSDL, kho ảnh, API không mở cổng ra máy.
name: chiase

x-gioi-han: &amp;gioi-han # Luật của máy dựng bài: mọi container có trần RAM/CPU
  mem_limit: 1g
  memswap_limit: 1g
  cpus: 1

x-api-env: &amp;api-env
  WEB_ORIGIN: http://localhost:41830
  DATABASE_URL: postgresql://chiase:\${POSTGRES_PASSWORD:?đặt trong .env}@db:5432/chiase
  JWT_ACCESS_SECRET: \${JWT_ACCESS_SECRET:?đặt trong .env — sinh bằng lệnh ghi trong .env.example}
  S3_ENDPOINT: http://kho:9000 # API gọi kho bằng tên dịch vụ trong mạng compose
  S3_PUBLIC_ENDPOINT: http://localhost:41830 # trình duyệt tải ảnh lên qua Nginx (/chiase/ ⇒ kho) — URL ký bằng địa chỉ này
  S3_REGION: auto
  S3_BUCKET: chiase
  S3_ACCESS_KEY_ID: chiase
  S3_SECRET_ACCESS_KEY: \${MINIO_ROOT_PASSWORD:?đặt trong .env}
  MEDIA_BASE_URL: http://localhost:41830/chiase
  TRUST_PROXY: 1 # đúng MỘT lớp proxy (Nginx của ảnh web) ⇒ req.ip là IP người dùng thật, giới hạn đăng nhập tính đúng người

services:
  db:
    image: postgres:18-alpine
    &lt;&lt;: *gioi-han
    environment:
      POSTGRES_USER: chiase
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:?đặt trong .env}
      POSTGRES_DB: chiase
    volumes:
      - pgdata:/var/lib/postgresql
    healthcheck: # hỏi qua TCP, không qua socket: initdb tạm lúc đầu trả lời socket rồi khởi động lại (bài 8.2)
      test: ['CMD', 'pg_isready', '-h', '127.0.0.1', '-U', 'chiase', '-d', 'chiase']
      interval: 2s
      timeout: 3s
      retries: 30
    restart: unless-stopped

  kho:
    image: cgr.dev/chainguard/minio:latest
    &lt;&lt;: *gioi-han
    command: ['server', '/data']
    environment:
      MINIO_ROOT_USER: chiase
      MINIO_ROOT_PASSWORD: \${MINIO_ROOT_PASSWORD:?đặt trong .env}
      MC_HOST_local: http://chiase:\${MINIO_ROOT_PASSWORD}@127.0.0.1:9000 # cho lệnh healthcheck "mc ready"
    volumes:
      - kho:/data
    healthcheck:
      test: ['CMD', 'mc', 'ready', 'local']
      interval: 2s
      timeout: 3s
      retries: 30
    restart: unless-stopped

  # Việc MỘT LẦN: migrate CSDL + chuẩn bị bucket. Chạy xong thoát 0 ⇒ api mới được bật.
  chuan-bi:
    build: { context: ., dockerfile: apps/api/Dockerfile, target: cong-cu }
    &lt;&lt;: *gioi-han
    environment: *api-env
    command: ['sh', '-c', 'npx prisma migrate deploy &amp;&amp; npm run kho:chuan-bi']
    depends_on:
      db: { condition: service_healthy }
      kho: { condition: service_healthy }

  api:
    build: { context: ., dockerfile: apps/api/Dockerfile }
    &lt;&lt;: *gioi-han
    environment: *api-env
    depends_on:
      chuan-bi: { condition: service_completed_successfully }
    restart: unless-stopped

  web:
    build: { context: ., dockerfile: apps/web/Dockerfile }
    &lt;&lt;: *gioi-han
    ports:
      - 127.0.0.1:41830:80
    depends_on:
      api: { condition: service_healthy }
    restart: unless-stopped

volumes:
  pgdata:
  kho:`;

const ENV_MAU = `# Biến cho docker compose (bài 9.3). Chép thành .env ở GỐC repo — .env bị .gitignore và .dockerignore chặn.
# Mỗi máy một bộ giá trị riêng. Sinh chuỗi ngẫu nhiên:
#   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
POSTGRES_PASSWORD=
MINIO_ROOT_PASSWORD=
JWT_ACCESS_SECRET=`;

const THIEU_ENV = `$ docker compose up -d     # chưa có .env
error while interpolating x-api-env.S3_SECRET_ACCESS_KEY: required variable MINIO_ROOT_PASSWORD is missing a value: đặt trong .env
$ echo $?
1`;

const VE_KHO = `$ curl -s localhost:41830/api/uploads -H "Authorization: Bearer $T" … -d {"contentType":"image/jpeg","size":29992}
{
 "key": "tmp/01a210b0-65ea-7ca1-8d15-a3b201b04c21/3a65bed0-d06a-4c29-9a58-7bdde2030f6e",
 "url": "http://kho:9000/chiase/tmp/01a210b0-65ea-7ca1-8d15-a3b201b04c21/3a65bed0-d06a-4c29-9a58-7bdde2030f6e?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sh…"
}

$ curl -X PUT --data-binary @dien-thoai.jpg "$URL"      # trình duyệt cũng làm đúng thế này
curl: (6) Could not resolve host: kho
(exit 6)`;

const CAU_HINH = `// Bài 9.3: số lớp proxy ĐÁNG TIN đứng trước API (1 = Nginx của ảnh web). Sau proxy, mọi request đến từ IP của Nginx;
// IP thật nằm trong X-Forwarded-For. Đặt ĐÚNG số lớp: thừa một lớp là tin luôn phần do người gửi tự ghi ⇒ giả IP lách
// giới hạn đăng nhập (đo thật). "true" = tin mọi lớp ⇒ từ chối.
function soLopProxy(): number {
  const v = process.env.TRUST_PROXY ?? '0';
  if (!/^\\d+$/.test(v)) throw new Error(\`TRUST_PROXY phải là số lớp proxy (0, 1, 2…), không phải "\${v}"\`);
  return Number(v);
}

export const config = {
  port: Number(process.env.PORT ?? 41810),
  webOrigin: batBuoc('WEB_ORIGIN'),
  databaseUrl: batBuoc('DATABASE_URL'),
  jwtAccessSecret: khoaBiMat('JWT_ACCESS_SECRET'),
  accessTtlS: Number(process.env.ACCESS_TTL_S ?? 15 * 60), // 15 phút
  refreshTtlS: Number(process.env.REFRESH_TTL_S ?? 30 * 24 * 3600), // 30 ngày
  trustProxy: soLopProxy(),
  s3: {
    endpoint: batBuoc('S3_ENDPOINT'),
    // Địa chỉ kho mà TRÌNH DUYỆT tới được — dùng để ký URL tải lên. Compose: API gọi http://kho:9000 (tên trong mạng
    // Docker), trình duyệt chỉ thấy http://localhost:41830 (Nginx chuyển /chiase/ ⇒ kho). Dev và R2: bỏ trống = S3_ENDPOINT.
    publicEndpoint: process.env.S3_PUBLIC_ENDPOINT || batBuoc('S3_ENDPOINT'),
    region: process.env.S3_REGION ?? 'auto', // R2 dùng "auto"; MinIO chấp nhận mọi giá trị`;

const KY = `// Client CHỈ để ký URL cho trình duyệt (không gửi request nào). Chữ ký SigV4 tính trên Host ⇒ phải ký bằng đúng địa chỉ
// trình duyệt sẽ gọi (bài 9.3: ký bằng http://kho:9000 ⇒ "Could not resolve host: kho").
export const s3Ky =
  config.s3.publicEndpoint === config.s3.endpoint ? s3 : taoClient(config.s3.publicEndpoint);`;

const ANH_NGINX = `# Sau khi sửa: URL ký bằng S3_PUBLIC_ENDPOINT, Nginx chuyển /chiase/ ⇒ kho
$ curl -X PUT --data-binary @dien-thoai.jpg "$URL"      # URL bắt đầu bằng http://localhost:41830/chiase/tmp/01a210…
HTTP 200
$ curl -s localhost:41830/api/posts -d {…imageKey…} | jq .imageUrl
http://localhost:41830/chiase/posts/da4a5f1a-2558-49b4-b3e9-cc086da45c5c.webp
$ curl -sI "$imageUrl" | grep -iE '^(HTTP|content-type|content-length)'
HTTP/1.1 200 OK
Content-Type: image/webp
Content-Length: 6936`;

const SAI_HOST = `# Thử sai 1: trong location /chiase/ dùng "proxy_set_header Host $host;" (bỏ mất ":41830")
$ curl -X PUT … "$URL"
HTTP 403
&lt;Code&gt;SignatureDoesNotMatch&lt;/Code&gt;`;

const SAI_1M = `# Thử sai 2: bỏ client_max_body_size (mặc định 1m), ảnh điện thoại 3677776 byte
$ curl -X PUT --data-binary @dt-4000.jpg "$URL"
HTTP 413
&lt;title&gt;413 Request Entity Too Large&lt;/title&gt;
$ docker compose logs web | grep "too large"
[error] 83#83: *15 client intended to send too large body: 3677776 bytes, client: …, server: , request: "PUT /chiase/tmp/01a210b0-65ea-7ca1-8d15-a3b201b04c21/1c791cb7-5758-4c68-8e9b-28b80a73061c?X-A
# Bản đúng, cùng ảnh 3677776 byte:
HTTP 200`;

const CHUNG = `# Kẻ dò mật khẩu ở máy A (máy chủ Docker, IP 172.x.0.1) thử 12 lần:
$ for i in $(seq 12); do curl -s -o /dev/null -w "%{http_code} " localhost:41830/api/auth/login -d {…sai…}; done
401 401 401 401 401 401 401 429 429 429 429 429 

# Người dùng THẬT ở máy B (một container khác, IP khác) đăng nhập ĐÚNG mật khẩu, lần đầu tiên:
$ docker run --rm --network fsp-chiase_default node:22-slim node -e "fetch('http://web/api/auth/login', …)"
429 {"error":{"code":"QUA_NHIEU_LAN","message":"Thử quá nhiều lần, hãy đợi 15 phút","requestId":"5e5c97c3-346a-430`;

const TRUST1 = `# TRUST_PROXY=1. Máy A dò mật khẩu 12 lần:
401 401 401 401 401 401 401 401 401 401 429 429 
# Máy B (container khác) đăng nhập đúng, lần đầu:
200 {"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWI…

# Máy A đổi chiêu: mỗi lần tự ghi một X-Forwarded-For giả khác nhau
$ for i in $(seq 12); do curl … -H "X-Forwarded-For: 10.0.0.$i" …; done
429 429 429 429 429 429 429 429 429 429 429 429 `;

const TRUST2 = `# Đặt "dư cho chắc": TRUST_PROXY=2 (thật ra chỉ có 1 lớp Nginx). Máy A, X-Forwarded-For giả mỗi lần:
401 401 401 401 401 401 401 401 401 401 401 401 
$ for i in $(seq 200); do …X-Forwarded-For: 10.1.$i.7…; done | sort | uniq -c
    200 401`;

const TRUST_TRUE = `$ docker run --rm -e TRUST_PROXY=true … chiase-api
        throw new Error(\`TRUST_PROXY phải là số lớp proxy (0, 1, 2…), không phải "\${v}"\`);`;

const DB_CHET = `$ docker compose stop db
db: exited
sau 10 s: api healthy · GET /api/health ⇒ {"status":"loi","db":"loi","dbMs":1584,"uptimeS":244} 503
sau 22 s: api healthy · GET /api/health ⇒ {"status":"loi","db":"loi","dbMs":1965,"uptimeS":256} 503
sau 34 s: api healthy · GET /api/health ⇒ {"status":"loi","db":"loi","dbMs":2001,"uptimeS":268} 503
sau 46 s: api unhealthy · GET /api/health ⇒ {"status":"loi","db":"loi","dbMs":2002,"uptimeS":280} 503
$ docker compose start db
sau 12 s: api healthy · GET /api/health ⇒ {"status":"ok","db":"ok","dbMs":1,"uptimeS":292} 200`;

const KHOI_DONG_LAI = `$ docker compose restart api        # rồi hỏi /api/health mỗi 0,5 s
502@0.0s 502@0.5s 200@1.2s
$ docker compose up -d --force-recreate api
502@0.0s 502@0.5s 200@1.2s`;


const NGUON = [
  nguon('🐳', 'Docker — Packet filtering and firewalls (cổng công bố đi vòng qua ufw)', 'docs.docker.com', 'https://docs.docker.com/engine/network/packet-filtering-firewalls/'),
  nguon('🚂', 'Express — Express behind proxies (trust proxy)', 'expressjs.com', 'https://expressjs.com/en/guide/behind-proxies.html'),
  nguon('🚦', 'express-rate-limit — Error codes (ERR_ERL_UNEXPECTED_X_FORWARDED_FOR, …PERMISSIVE_TRUST_PROXY)', 'express-rate-limit', 'https://express-rate-limit.mintlify.app/reference/error-codes'),
].join('\n');

const THE = [
  lienKet({ khoa: 'docker', bai: 'dk-9-3-thu-tu-khoi-dong', title: 'Docker 9.3 — depends_on, healthcheck, thứ tự khởi động', sub: 'service_healthy và service_completed_successfully.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-9-4-bien-profile', title: 'Docker 9.4 — Biến, .env, và profile', sub: '${VAR:?…} bắt buộc biến, nội suy lúc nào.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-8-2-cong-bo-cong', title: 'Docker 8.2 — Công bố cổng, và cái bẫy tường lửa', sub: 'Vì sao 127.0.0.1: và vì sao db không có ports.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-10-3-api-migration', title: 'Docker 10.3 — API, worker, và migration', sub: 'Việc một lần chạy trước API.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-7-2-volume', title: 'Docker 7.2 — Volume, đào sâu', sub: 'Dữ liệu sống qua down, chết với down -v.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nginx', bai: 'nginx-7-4-kich-thuoc-request', title: 'Nginx 7.4 — Kích thước request', sub: 'client_max_body_size và lỗi 413.', cta: 'Mở bài →' }),
].join('\n');

const MERMAID = `flowchart LR
  DB["db (postgres:18) healthy"] --> CB["chuan-bi: migrate + bucket, thoát 0"]
  KHO["kho (MinIO) healthy"] --> CB
  CB --> API["api healthy"]
  API --> WEB["web (Nginx) cổng 41830"]`;

export default {
  title: '9.3 — docker compose: the whole system with one command|||9.3 — docker compose: cả hệ thống bằng một lệnh',
  slug: 'fp-9-3-docker-compose',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một compose.yaml ráp năm dịch vụ: Postgres, MinIO, việc một lần (migrate + chuẩn bị kho), API, web — đúng thứ tự nhờ healthcheck và depends_on, chỉ MỘT cổng mở ra máy. Chạy thật lộ ra những thứ dev không bao giờ thấy: URL ký sẵn trỏ vào tên dịch vụ "kho" mà trình duyệt không phân giải được; Nginx đổi Host làm chữ ký sai (403), giới hạn 1 MB chặn ảnh điện thoại (413); sau proxy, giới hạn đăng nhập tính chung một IP nên kẻ dò mật khẩu khoá luôn người khác; đặt trust proxy dư một lớp thì X-Forwarded-For giả lách được 200/200 lần. Cuối cùng: CSDL chết thì healthcheck báo gì, và vì sao Docker không tự cứu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Dockerize</span>
<h2>One command, five services, one open port</h2>
<p class="lead">Two images are not a system. ChiaSe also needs PostgreSQL, an S3-compatible store, a migration run before the API starts, and the right order. <code>compose.yaml</code> describes all of it so that a teammate (or the VPS in Chapter 11) types <code>docker compose up</code> and gets the same thing you have. Running it honestly — through the browser's only door, port 41830 — exposed four bugs the dev setup could never show.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">db + kho</span><span class="lz-d">start, healthcheck pg_isready / mc ready</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">chuan-bi</span><span class="lz-d">migrate deploy + bucket; must exit 0</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">api</span><span class="lz-d">starts only after chuan-bi succeeded; HEALTHCHECK</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">web</span><span class="lz-d">after api is healthy; the ONLY published port</span></div>
</div>
<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. The file</h3>
<pre><code class="language-yaml">${COMPOSE}</code></pre>
<p>Decisions worth defending: services talk by name (<code>db</code>, <code>kho</code>, <code>api</code>) on the compose network; only <code>web</code> publishes a port, and only on <code>127.0.0.1</code>; data lives in named volumes; migrations run in a one-shot service from the <code>cong-cu</code> target (it has the Prisma CLI that the runtime image deliberately lacks), so the API never starts against an old schema; every service has a memory ceiling.</p>

<h3>2. Secrets: .env, required</h3>
<pre><code>${ENV_MAU}</code></pre>
<div class="out">${THIEU_ENV}</div>
<p><code>\${VAR:?message}</code> makes compose refuse to start without the value, instead of starting Postgres with an empty password. Same principle as <code>config.ts</code> in Chapter 2: fail at startup, loudly.</p>

<h3>3. Bug 1 — the upload URL points at a name only Docker knows</h3>
<div class="out">${VE_KHO}</div>
<p>The API signs upload URLs with its S3 endpoint, <code>http://kho:9000</code>. That name resolves inside the compose network, not in a browser. In dev both sides used <code>localhost:41813</code>, so nobody noticed. Two addresses are now needed: the one the API calls, and the one the browser calls.</p>
<pre><code class="language-ts">${CAU_HINH}</code></pre>
<pre><code class="language-ts">${KY}</code></pre>
<p>…and Nginx forwards <code>/chiase/</code> to the store (see <code>nginx.conf</code> in 9.2). After the fix:</p>
<div class="out">${ANH_NGINX}</div>
<p>Two measured ways to break it again. Use <code>$host</code> (drops the port) instead of <code>$http_host</code>: the signature was computed over <code>localhost:41830</code>, MinIO recomputes it over <code>localhost</code>:</p>
<div class="out">${SAI_HOST}</div>
<p>Forget <code>client_max_body_size</code> (Nginx default: 1 MB) and upload a phone photo:</p>
<div class="out">${SAI_1M}</div>

<h3>4. Bug 2 — behind a proxy, everybody has the same IP</h3>
<p>The login limiter counts per IP. Behind Nginx, every request arrives from Nginx's container IP. express-rate-limit even warned in the API log (<code>ERR_ERL_UNEXPECTED_X_FORWARDED_FOR</code>). What that means in practice:</p>
<div class="out">${CHUNG}</div>
<p>An attacker on machine A burned the shared budget; a real user on machine B, correct password, first attempt, got 429. A password-guessing bot becomes a lock-out-everyone button. Fix: tell Express exactly how many proxies to trust (<code>TRUST_PROXY=1</code> in compose); <code>req.ip</code> becomes the address Nginx appended to <code>X-Forwarded-For</code>:</p>
<div class="out">${TRUST1}</div>
<p>B gets in; A is limited even when it forges <code>X-Forwarded-For</code>, because with one trusted hop Express takes the right-most entry — the one Nginx wrote.</p>

<div class="pitfall co-tieu-de"><p><strong>Hacker's corner — "trust a bit more, to be safe".</strong> Set <code>TRUST_PROXY=2</code> when there is only one proxy, and Express trusts one entry the <em>client</em> wrote:</p>
<div class="out">${TRUST2}</div>
<p>200 of 200 guesses, never limited — brute force with a rotating fake header. <code>trust proxy: true</code> is worse (trust everything), so <code>config.ts</code> refuses it at startup:</p>
<div class="out">${TRUST_TRUE}</div>
<p>Second door to check: Docker's own docs warn that published ports are handled before ufw's rules, so a firewall "denying 5432" does not protect a <code>-p 5432:5432</code> database. ChiaSe publishes no port for <code>db</code>, <code>kho</code> or <code>api</code>, and binds <code>web</code> to <code>127.0.0.1</code>; Chapter 11 puts a host Nginx with TLS in front.</p></div>

<h3>5. When the database dies</h3>
<div class="out">${DB_CHET}</div>
<p><code>/api/health</code> answers 503 immediately (the 2-second race from Chapter 2), but Docker marks the container <code>unhealthy</code> only after three failed checks (~46 s), and <code>restart: unless-stopped</code> does <strong>not</strong> restart an unhealthy container — Docker restarts on exit, not on health. Health status is a signal for whoever watches (compose <code>--wait</code>, the deploy script in Chapter 11, an orchestrator). When the database came back, the API recovered by itself: the connection pool reconnects. Restarting the API costs about a second of 502s through Nginx:</p>
<div class="out">${KHOI_DONG_LAI}</div>
<p>Chapter 11 turns that second into a smoke test and a rollback plan.</p>

${spring(true, 'With Spring Boot the compose file is the same shape: postgres with healthcheck, the Spring container with SPRING_DATASOURCE_URL pointing at the service name, Flyway migrations at startup (or a one-shot job), server.forward-headers-strategy=framework for the X-Forwarded-For problem of section 4.', [
  ['sb-17-2-application-properties-docker', 'Spring Boot 17.2 — Configuration for containers'],
  ['sb-17-4-checkpoint-9', 'Spring Boot 17.4 — Checkpoint: the whole system with one command'],
  ['sb-17-5-lab-17', 'Spring Boot 17.5 — Lab 17 + interview questions'],
])}

<h3>Everyday analogy</h3>
<p>A restaurant opening: the kitchen (database) and the cold room (store) must be running before the chef (API) starts, the chef starts only after the morning prep (migrations) is done, and guests only ever see the front door (port 41830). If the doorman writes every guest down as "came from the door", you cannot ban one rowdy guest without banning everyone.</p>

<h3>On the job</h3>
<p>The first task on many outsourcing projects is "make the project run on the new developer's laptop". A <code>compose.yaml</code> + <code>.env.example</code> that works from a clean clone turns two days of onboarding into one command — and it is the same file CI and staging use, so "works on my machine" stops being an argument.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"How do you make the API wait for the database?"</strong> — healthcheck on the db + <code>depends_on: condition: service_healthy</code>; migrations as a one-shot service with <code>service_completed_successfully</code>.</li>
<li><strong>"Where do migrations run?"</strong> — Before the new code serves traffic, once, from an image that has the migration tool; never "on first request".</li>
<li><strong>"What is trust proxy?"</strong> — How many proxy hops Express believes in X-Forwarded-For; must equal the real number.</li>
<li><strong>"Does restart: unless-stopped restart an unhealthy container?"</strong> — No; only on exit.</li>
<li><strong>"How do you keep the database private?"</strong> — No published port; services talk on the internal network; published ports bind to 127.0.0.1 behind a reverse proxy.</li>
</ol>

<h3>🧪 Lab 9.3</h3>
<div class="callout ok">
<ol>
<li><code>cp .env.example .env</code>, fill it with three random strings, <code>docker compose up -d --build --wait</code>; open <code>http://localhost:41830</code>, register, post with an image, comment from a second browser.</li>
<li>Reproduce bug 1: remove <code>S3_PUBLIC_ENDPOINT</code>, rebuild, try uploading from the browser (DevTools → Network).</li>
<li>Reproduce bug 2: set <code>TRUST_PROXY: 0</code>, 12 wrong logins from the host, then a correct login from <code>docker run --rm --network &lt;project&gt;_default node:22-slim node -e "fetch('http://web/api/auth/login',…)"</code>.</li>
<li>Stop <code>db</code> for a minute: watch <code>docker compose ps</code> and <code>/api/health</code>; start it again.</li>
<li><code>docker compose down</code> then <code>up</code>: is your post still there? Then <code>down -v</code>: is it?</li>
</ol>
<p><strong>Done when:</strong> the whole app works through port 41830 only, an upload of a 3–5 MB photo succeeds, a forged <code>X-Forwarded-For</code> does not bypass the login limit, and you can explain each healthcheck state you saw.</p>
</div>
<details><summary>Solution</summary>
<p><code>compose.yaml</code>, <code>.env.example</code>, <code>apps/web/nginx.conf</code> (location <code>^~ /chiase/</code>), <code>apps/api/src/config.ts</code> (<code>trustProxy</code>, <code>s3.publicEndpoint</code>), <code>apps/api/src/lib/storage.ts</code> (<code>s3Ky</code>), <code>apps/api/src/app.ts</code> (<code>app.set('trust proxy', …)</code>) — branch <code>ch9/docker</code>.</p>
</details>

<div class="kv-grid">
  <div class="kv"><span class="k">service name</span><span class="v">DNS name inside the compose network (db, kho, api).</span></div>
  <div class="kv"><span class="k">service_healthy</span><span class="v">Start after the dependency's healthcheck passes.</span></div>
  <div class="kv"><span class="k">one-shot service</span><span class="v">Runs a job and exits; others wait for exit 0.</span></div>
  <div class="kv"><span class="k">named volume</span><span class="v">Data outside the container; survives down, removed by down -v.</span></div>
  <div class="kv"><span class="k">X-Forwarded-For</span><span class="v">List of client IPs appended by each proxy; the left part is client-controlled.</span></div>
  <div class="kv"><span class="k">trust proxy</span><span class="v">Number of trusted hops Express skips from the right.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Five services, ordered by healthchecks and a one-shot migration job; one published port on 127.0.0.1.</li>
<li>Required variables with <code>\${VAR:?}</code>; secrets only in an uncommitted .env.</li>
<li>Presigned URLs must be signed for the address the browser uses; keep Host with its port; raise the 1 MB body limit.</li>
<li>Behind a proxy set trust proxy to the exact hop count — 0 locks everyone out together, one too many lets attackers forge IPs.</li>
<li>Unhealthy is a signal, not a restart; restarts cost ~1 s of 502.</li>
</ul>
${NGUON}
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Docker hoá</span>
<h2>Một lệnh, năm dịch vụ, một cổng mở</h2>
<p class="lead">Hai ảnh chưa phải một hệ thống. ChiaSe còn cần PostgreSQL, một kho tương thích S3, một lượt migrate chạy trước khi API lên, và đúng thứ tự. <code>compose.yaml</code> mô tả tất cả để đồng đội (hay VPS ở Chương 11) gõ <code>docker compose up</code> là có đúng thứ bạn đang có. Chạy nó một cách trung thực — qua cánh cửa duy nhất của trình duyệt, cổng 41830 — làm lộ ra bốn lỗi mà cách chạy dev không bao giờ cho thấy.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">db + kho</span><span class="lz-d">khởi động, healthcheck pg_isready / mc ready</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">chuan-bi</span><span class="lz-d">migrate deploy + bucket; phải thoát 0</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">api</span><span class="lz-d">chỉ lên sau khi chuan-bi thành công; HEALTHCHECK</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">web</span><span class="lz-d">sau khi api healthy; cổng DUY NHẤT mở ra máy</span></div>
</div>
<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Tệp compose</h3>
<pre><code class="language-yaml">${COMPOSE}</code></pre>
<p>Những quyết định đáng bảo vệ: các dịch vụ gọi nhau bằng tên (<code>db</code>, <code>kho</code>, <code>api</code>) trong mạng của compose; chỉ <code>web</code> mở cổng, và chỉ trên <code>127.0.0.1</code>; dữ liệu nằm trong volume có tên; migrate chạy ở một dịch vụ một lần, dựng từ target <code>cong-cu</code> (có Prisma CLI mà ảnh runtime cố tình không có), nên API không bao giờ chạy với lược đồ cũ; dịch vụ nào cũng có trần RAM.</p>

<h3>2. Bí mật: .env, bắt buộc</h3>
<pre><code>${ENV_MAU}</code></pre>
<div class="out">${THIEU_ENV}</div>
<p><code>\${VAR:?câu báo}</code> khiến compose từ chối chạy khi thiếu giá trị, thay vì bật Postgres với mật khẩu rỗng. Cùng nguyên tắc với <code>config.ts</code> ở Chương 2: hỏng ngay lúc khởi động, và hỏng to.</p>

<h3>3. Lỗi 1 — URL tải ảnh trỏ vào một cái tên chỉ Docker biết</h3>
<div class="out">${VE_KHO}</div>
<p>API ký URL tải lên bằng địa chỉ kho của nó, <code>http://kho:9000</code>. Tên đó chỉ phân giải được trong mạng compose, không phải trong trình duyệt. Lúc dev cả hai phía cùng dùng <code>localhost:41813</code> nên chẳng ai thấy. Giờ cần hai địa chỉ: địa chỉ API gọi, và địa chỉ trình duyệt gọi.</p>
<pre><code class="language-ts">${CAU_HINH}</code></pre>
<pre><code class="language-ts">${KY}</code></pre>
<p>…và Nginx chuyển <code>/chiase/</code> sang kho (xem <code>nginx.conf</code> ở 9.2). Sau khi sửa:</p>
<div class="out">${ANH_NGINX}</div>
<p>Hai cách làm hỏng lại, có số đo. Dùng <code>$host</code> (mất cổng) thay vì <code>$http_host</code>: chữ ký được tính trên <code>localhost:41830</code>, MinIO tính lại trên <code>localhost</code>:</p>
<div class="out">${SAI_HOST}</div>
<p>Quên <code>client_max_body_size</code> (mặc định của Nginx: 1 MB) rồi tải một ảnh chụp bằng điện thoại:</p>
<div class="out">${SAI_1M}</div>

<h3>4. Lỗi 2 — sau proxy, ai cũng chung một IP</h3>
<p>Bộ giới hạn đăng nhập đếm theo IP. Sau Nginx, mọi request đều đến từ IP container của Nginx. express-rate-limit đã cảnh báo ngay trong log API (<code>ERR_ERL_UNEXPECTED_X_FORWARDED_FOR</code>). Ngoài đời điều đó nghĩa là:</p>
<div class="out">${CHUNG}</div>
<p>Kẻ tấn công ở máy A đốt hết "quỹ" dùng chung; người dùng thật ở máy B, mật khẩu đúng, lần đầu tiên, nhận 429. Một con bot dò mật khẩu biến thành nút "khoá cửa tất cả mọi người". Sửa: nói cho Express biết CHÍNH XÁC có bao nhiêu proxy đáng tin (<code>TRUST_PROXY=1</code> trong compose); <code>req.ip</code> thành địa chỉ mà Nginx ghi thêm vào <code>X-Forwarded-For</code>:</p>
<div class="out">${TRUST1}</div>
<p>B vào được; A vẫn bị chặn kể cả khi tự ghi <code>X-Forwarded-For</code> giả, vì với một lớp đáng tin Express lấy mục ngoài cùng bên phải — mục do Nginx ghi.</p>

<div class="pitfall co-tieu-de"><p><strong>Góc hacker — "tin thêm một chút cho chắc".</strong> Đặt <code>TRUST_PROXY=2</code> trong khi chỉ có một proxy, Express sẽ tin một mục do chính <em>người gửi</em> viết:</p>
<div class="out">${TRUST2}</div>
<p>200 trên 200 lần đoán, không lần nào bị chặn — dò mật khẩu bằng một header giả đổi liên tục. <code>trust proxy: true</code> còn tệ hơn (tin tất cả), nên <code>config.ts</code> từ chối nó ngay lúc khởi động:</p>
<div class="out">${TRUST_TRUE}</div>
<p>Cửa thứ hai cần kiểm: chính tài liệu Docker cảnh báo cổng công bố được xử lý TRƯỚC luật của ufw, nên một tường lửa "chặn 5432" không bảo vệ được CSDL chạy <code>-p 5432:5432</code>. ChiaSe không mở cổng nào cho <code>db</code>, <code>kho</code>, <code>api</code>, và gắn <code>web</code> vào <code>127.0.0.1</code>; Chương 11 đặt Nginx của máy chủ có TLS đứng trước.</p></div>

<h3>5. Khi CSDL chết</h3>
<div class="out">${DB_CHET}</div>
<p><code>/api/health</code> trả 503 ngay (nhờ cuộc đua 2 giây từ Chương 2), nhưng Docker chỉ đánh dấu container <code>unhealthy</code> sau ba lần kiểm hỏng (~46 s), và <code>restart: unless-stopped</code> KHÔNG khởi động lại container unhealthy — Docker khởi động lại khi tiến trình thoát, không phải khi sức khoẻ kém. Trạng thái sức khoẻ là tín hiệu cho ai đang theo dõi (compose <code>--wait</code>, script deploy ở Chương 11, một hệ điều phối). Khi CSDL quay lại, API tự hồi phục: pool kết nối tự nối lại. Khởi động lại API thì mất khoảng một giây 502 qua Nginx:</p>
<div class="out">${KHOI_DONG_LAI}</div>
<p>Chương 11 biến một giây đó thành smoke test và kế hoạch quay lui.</p>

${spring(false, 'Với Spring Boot tệp compose cùng hình dạng: postgres có healthcheck, container Spring với SPRING_DATASOURCE_URL trỏ vào tên dịch vụ, Flyway migrate lúc khởi động (hoặc một job một lần), và server.forward-headers-strategy=framework cho đúng bài toán X-Forwarded-For ở mục 4.', [
  ['sb-17-2-application-properties-docker', 'Spring Boot 17.2 — Cấu hình cho môi trường container'],
  ['sb-17-4-checkpoint-9', 'Spring Boot 17.4 — Checkpoint: cả hệ thống chạy bằng một lệnh'],
  ['sb-17-5-lab-17', 'Spring Boot 17.5 — Lab chương 17 + câu hỏi phỏng vấn'],
])}

<h3>Liên hệ đời thường</h3>
<p>Một nhà hàng mở cửa: bếp (CSDL) và kho lạnh (kho ảnh) phải chạy trước khi đầu bếp (API) vào ca, đầu bếp chỉ vào sau khi khâu sơ chế buổi sáng (migrate) xong, còn khách chỉ thấy cửa chính (cổng 41830). Nếu người gác cửa ghi mọi vị khách là "đến từ cửa chính", bạn không thể cấm một vị khách quậy mà không cấm cả nhà hàng.</p>

<h3>Tình huống đi làm thật</h3>
<p>Việc đầu tiên ở nhiều dự án outsourcing là "làm cho dự án chạy được trên máy của bạn mới vào". Một <code>compose.yaml</code> + <code>.env.example</code> chạy được từ bản clone sạch biến hai ngày làm quen thành một lệnh — và đó cũng là tệp mà CI và môi trường staging dùng, nên "máy em chạy được" không còn là lý lẽ.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Làm sao để API đợi CSDL?"</strong> — healthcheck cho db + <code>depends_on: condition: service_healthy</code>; migrate là dịch vụ một lần với <code>service_completed_successfully</code>.</li>
<li><strong>"Migrate chạy ở đâu?"</strong> — Trước khi mã mới nhận lưu lượng, một lần, từ ảnh có công cụ migrate; không bao giờ "ở request đầu tiên".</li>
<li><strong>"trust proxy là gì?"</strong> — Số lớp proxy mà Express tin trong X-Forwarded-For; phải bằng đúng số thật.</li>
<li><strong>"restart: unless-stopped có khởi động lại container unhealthy không?"</strong> — Không; chỉ khi tiến trình thoát.</li>
<li><strong>"Giữ CSDL kín thế nào?"</strong> — Không mở cổng; dịch vụ nói chuyện qua mạng nội bộ; cổng mở thì gắn vào 127.0.0.1 sau reverse proxy.</li>
</ol>

<h3>🧪 Lab 9.3</h3>
<div class="callout ok">
<ol>
<li><code>cp .env.example .env</code>, điền ba chuỗi ngẫu nhiên, <code>docker compose up -d --build --wait</code>; mở <code>http://localhost:41830</code>, đăng ký, đăng bài có ảnh, bình luận từ một trình duyệt thứ hai.</li>
<li>Tái hiện lỗi 1: bỏ <code>S3_PUBLIC_ENDPOINT</code>, dựng lại, thử tải ảnh từ trình duyệt (DevTools → Network).</li>
<li>Tái hiện lỗi 2: đặt <code>TRUST_PROXY: 0</code>, 12 lần đăng nhập sai từ máy, rồi đăng nhập đúng từ <code>docker run --rm --network &lt;dự-án&gt;_default node:22-slim node -e "fetch('http://web/api/auth/login',…)"</code>.</li>
<li>Dừng <code>db</code> một phút: xem <code>docker compose ps</code> và <code>/api/health</code>; bật lại.</li>
<li><code>docker compose down</code> rồi <code>up</code>: bài của bạn còn không? Rồi <code>down -v</code>: còn không?</li>
</ol>
<p><strong>Xong khi:</strong> cả ứng dụng chạy chỉ qua cổng 41830, tải được ảnh 3–5 MB, <code>X-Forwarded-For</code> giả không lách được giới hạn đăng nhập, và bạn giải thích được từng trạng thái healthcheck đã thấy.</p>
</div>
<details><summary>Lời giải</summary>
<p><code>compose.yaml</code>, <code>.env.example</code>, <code>apps/web/nginx.conf</code> (khối <code>^~ /chiase/</code>), <code>apps/api/src/config.ts</code> (<code>trustProxy</code>, <code>s3.publicEndpoint</code>), <code>apps/api/src/lib/storage.ts</code> (<code>s3Ky</code>), <code>apps/api/src/app.ts</code> (<code>app.set('trust proxy', …)</code>) — nhánh <code>ch9/docker</code>.</p>
</details>

<div class="kv-grid">
  <div class="kv"><span class="k">tên dịch vụ</span><span class="v">Tên DNS trong mạng compose (db, kho, api).</span></div>
  <div class="kv"><span class="k">service_healthy</span><span class="v">Chỉ khởi động khi healthcheck của phụ thuộc đã đạt.</span></div>
  <div class="kv"><span class="k">dịch vụ một lần</span><span class="v">Chạy một việc rồi thoát; dịch vụ khác đợi mã 0.</span></div>
  <div class="kv"><span class="k">volume có tên</span><span class="v">Dữ liệu ngoài container; sống qua down, mất với down -v.</span></div>
  <div class="kv"><span class="k">X-Forwarded-For</span><span class="v">Danh sách IP mỗi proxy ghi thêm; phần bên trái do người gửi tự viết.</span></div>
  <div class="kv"><span class="k">trust proxy</span><span class="v">Số lớp đáng tin Express bỏ qua tính từ bên phải.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Năm dịch vụ, xếp thứ tự bằng healthcheck và một job migrate một lần; một cổng duy nhất trên 127.0.0.1.</li>
<li>Biến bắt buộc bằng <code>\${VAR:?}</code>; bí mật chỉ nằm trong .env không commit.</li>
<li>URL ký sẵn phải ký bằng địa chỉ trình duyệt dùng; giữ Host kèm cổng; nâng giới hạn 1 MB.</li>
<li>Sau proxy, đặt trust proxy bằng đúng số lớp — 0 thì khoá chung mọi người, dư một lớp thì kẻ tấn công giả được IP.</li>
<li>Unhealthy là tín hiệu, không phải lệnh khởi động lại; khởi động lại tốn ~1 s 502.</li>
</ul>
${NGUON}
${THE}
</div>
`,
};
