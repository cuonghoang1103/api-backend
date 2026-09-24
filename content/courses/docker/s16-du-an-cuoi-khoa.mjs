/**
 * Docker — Chương 16 (MỚI 09/2026): Dự án cuối khoá — đóng gói và đưa "Đặt lịch phòng khám" lên production.
 * Đóng gói · Compose dev & prod · CI → GHCR → VPS · tuần đầu trên production + 8 sự cố · bài thi cuối khoá 20 câu.
 * LUẬT: backtick → &#96;; ${ → &#36;{; < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>.
 * KHÔNG dùng <svg>. Gạch chéo ngược PHẢI viết đôi (\\), xem scripts/course-content-check.mjs.
 *
 * Output CHẠY THẬT 24/09/2026 trên một bản thu nhỏ của app dựng trong thư mục scratch (Next.js 16.3.6,
 * Express 5.2 + Prisma 6.19.3, postgres:16.4-alpine, redis:7.4-alpine, nginx:1.27-alpine) — Docker Desktop 4.91 /
 * Engine 29.8 / Compose v5.5.1 (Mac M1, arm64); thí nghiệm bind mount + mv chạy trên Docker Engine 29.6 (Fedora, amd64).
 * Tên thật trong lúc đo mang tiền tố dk16- (luật an toàn của khoá); trong bài người học dùng tên ngắn.
 * "GHCR" trong phần diễn tập là registry:2 cục bộ có mật khẩu ở localhost:18165; workflow GitHub Actions viết đầy đủ,
 * qua actionlint 1.7.12, nhưng KHÔNG chạy lên GitHub.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 16 — Capstone: containerise and ship a real app|||Chương 16 — Dự án cuối khoá: đóng gói và đưa một ứng dụng thật lên production',
  description: 'Chương cuối: lấy một đồ án nhóm thật — "Đặt lịch phòng khám" (Next.js, Express + Prisma, PostgreSQL, Redis, nginx) — và đi trọn đường từ Dockerfile đầu tiên tới production: đóng gói đúng libc, Compose cho dev và prod, CI đẩy ảnh lên GHCR theo tag commit, deploy tự quay lui, sao lưu, tám sự cố kinh điển, rồi bài thi cuối khoá 20 câu.',
  lessons: [
    /* ─────────────────────────── 16.0 ─────────────────────────── */
    {
      title: '16.0 — Chapter 16 slides: the capstone, end to end|||16.0 — Slide Chương 16: dự án cuối khoá từ đầu tới cuối',
      slug: 'dk-16-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 29 slide của Chương 16: kiến trúc sáu dịch vụ hai mạng, Dockerfile ngày 0 nặng 2,2 GB và engine Prisma của Mac lọt vào ảnh, ba stage và luật libc, compose nền/dev/prod, workflow CI, tag theo commit, deploy tự quay lui trong 20 giây, sao lưu có khôi phục thử, tám sự cố đo thật, và bản đồ cả khoá cho bài thi cuối.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Slides</span>
<h2>The capstone in 29 slides</h2>
<p class="lead">Fifteen chapters taught one idea at a time. This one puts them all on a single real project — a clinic appointment app of the kind student teams build for SWP391 — and walks it from the first Dockerfile to a production server that rolls itself back when a bad release lands.</p>
<p>Slides 3–8 belong to Lesson 16.1 (packaging the API and the web app), 9–13 to 16.2 (Compose for development and production), 14–18 to 16.3 (CI, the registry and the deploy script), and 19–25 to 16.4 (the first week in production: backups and the eight classic incidents). Slide 26 maps the whole course for the final exam; the last three are the chapter's common mistakes, a cheat sheet and a 45-minute practice session. Every terminal is real output recorded on 24 September 2026 on a scaled-down but working copy of the app (Docker Desktop 4.91 on a Mac M1, plus Docker Engine 29.6 on a Linux machine for the bind-mount experiment). The "GHCR" in the rehearsal is a password-protected local <code>registry:2</code>; the GitHub Actions workflow is complete and lint-clean but was not pushed to GitHub — the slides say so where it matters.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Slide</span>
<h2>Cả dự án cuối khoá trong 29 slide</h2>
<p class="lead">Mười lăm chương trước dạy từng ý một. Chương này đặt tất cả lên MỘT dự án thật — app đặt lịch phòng khám, đúng kiểu đồ án nhóm SWP391 — và đưa nó đi trọn đường từ Dockerfile đầu tiên tới một máy chủ production biết tự quay lui khi một bản phát hành hỏng lọt lên.</p>
<p>Slide 3–8 thuộc Bài 16.1 (đóng gói API và web), 9–13 thuộc 16.2 (Compose cho dev và prod), 14–18 thuộc 16.3 (CI, registry và script deploy), 19–25 thuộc 16.4 (tuần đầu trên production: sao lưu và tám sự cố kinh điển). Slide 26 là bản đồ cả khoá cho bài thi cuối; ba slide cuối là những sai lầm hay gặp, bảng tra nhanh và một buổi thực hành 45 phút. Mọi terminal trên slide là output THẬT ghi ngày 24/09/2026 trên một bản thu nhỏ nhưng chạy được của app (Docker Desktop 4.91 trên Mac M1, và Docker Engine 29.6 trên máy Linux cho thí nghiệm bind mount). "GHCR" trong phần diễn tập là một <code>registry:2</code> cục bộ có mật khẩu; workflow GitHub Actions viết đầy đủ và qua bộ soát lỗi nhưng không đẩy lên GitHub — slide nào liên quan đều ghi rõ.</p>
</div>
${gallery('dk-16', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Sáu dịch vụ, hai mạng, một cổng'], [4, 'Ngày 0: Dockerfile nặng 2,2 GB'], [5, 'Quên .dockerignore: engine Prisma của Mac lọt vào'],
  [6, 'Ba stage: cài → dựng → mang phần chạy đi'], [7, 'Engine Prisma đi theo nơi chạy prisma generate'], [8, 'Trước và sau, không root, dừng 0,14 s'],
  [9, 'Ba file compose: nền, dev, prod'], [10, 'Hai mạng front/back'], [11, 'Thứ tự khởi động do healthcheck quyết định'],
  [12, 'Dev: watch 1,8 s và Mailpit'], [13, 'Prod: viết trong YAML, kiểm bằng inspect'],
  [14, 'Một commit qua sáu trạm'], [15, 'Workflow GitHub Actions'], [16, 'Tag theo commit, một tag hai kiến trúc'],
  [17, 'deploy.sh: kéo → lên → kiểm → quay lui'], [18, 'Bản hỏng lên, 20 giây sau đã quay lui'],
  [19, 'Sao lưu có khôi phục thử'], [20, 'Tám sự cố kinh điển'], [21, 'Hai kiểu chết: 137 và 1'],
  [22, 'Sửa cấu hình bằng mv'], [23, 'ports: và mạng internal'], [24, '.env và múi giờ UTC'], [25, 'Đĩa đầy: đo trước khi dọn'],
  [26, 'Cả khoá trong sáu cụm'], [27, 'Sai lầm hay gặp'], [28, 'Bảng tra nhanh'], [29, 'Thực hành chương 16'],
])}
`,
    },
    /* ─────────────────────────── 16.1 ─────────────────────────── */
    {
      title: '16.1 — Day 1: packaging the API and the web app|||16.1 — Ngày 1: đóng gói API và web',
      slug: 'dk-16-1-dong-goi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Từ Dockerfile "cho chạy được" nặng 2,2 GB tới ảnh ba stage 664 MB: .dockerignore, engine Prisma đúng libc, Next.js standalone 328 MB, chạy bằng user node, tini làm PID 1 và healthcheck — mọi con số đo trên app thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.1</span>
<h2>Day 1: packaging the API and the web app</h2>
<p class="lead">Your team's SWP391 project runs on everyone's laptop. The lecturer wants a demo URL by Friday, and the only thing between "works on my machine" and "works on a server" is a pair of images. This lesson builds them twice: first the way almost every team does it on day one, then the way that survives production — and measures the difference.</p>
<p>Nothing in this chapter is new in isolation. Every technique was taught somewhere between Chapter 4 and Chapter 12. What is new is doing all of them at once, on one app, in the right order — and seeing how a mistake in one place (a missing <code>.dockerignore</code>) surfaces somewhere completely different (a Prisma error at start-up).</p>

<h3>The project: a clinic appointment app</h3>
${slide('dk-16', 3, 'Sáu dịch vụ, hai mạng, đúng MỘT cổng mở ra ngoài')}
<p>The app is deliberately small but real, and every number in this chapter was measured on it: patients see the free slots for a day, book one, and get a confirmation e-mail; booking the same doctor at the same time twice returns <code>409</code>; the list of free slots is cached in Redis for 30 seconds. Six services:</p>
<table>
<tr><th>Service</th><th>What it is</th><th>Image</th></tr>
<tr><td><code>nginx</code></td><td>The only door: <code>/</code> goes to web, <code>/api/</code> goes to api</td><td><code>nginx:1.27-alpine</code></td></tr>
<tr><td><code>web</code></td><td>Next.js 16 (App Router), renders the slot list on the server</td><td>ours, built from <code>web/</code></td></tr>
<tr><td><code>api</code></td><td>Express 5 + Prisma 6.19, TypeScript compiled to <code>dist/</code></td><td>ours, built from <code>api/</code></td></tr>
<tr><td><code>migrate</code></td><td>The same API image running <code>prisma migrate deploy</code> once, then exiting</td><td>ours</td></tr>
<tr><td><code>db</code></td><td>PostgreSQL 16 with a named volume</td><td><code>postgres:16.4-alpine</code></td></tr>
<tr><td><code>cache</code></td><td>Redis 7 with append-only persistence</td><td><code>redis:7.4-alpine</code></td></tr>
</table>
<pre><code>phongkham/
├── api/        <span class="tok-comment"># Dockerfile, .dockerignore, package.json, prisma/, src/index.ts</span>
├── web/        <span class="tok-comment"># Dockerfile, .dockerignore, package.json, next.config.mjs, app/</span>
├── nginx/      <span class="tok-comment"># default.conf</span>
├── compose.yaml, compose.override.yaml, compose.prod.yaml   <span class="tok-comment"># Lesson 16.2</span>
├── deploy.sh, smoke.sh, .github/workflows/deploy.yml        <span class="tok-comment"># Lesson 16.3</span>
├── .env.example   <span class="tok-comment"># committed, no real values</span>
└── .env           <span class="tok-comment"># in .gitignore, never committed</span></code></pre>

<h3>Day 0: the Dockerfile that "just works"</h3>
${slide('dk-16', 4, 'Ngày 0: Dockerfile “cho chạy được” nặng 2,2 GB')}
<p>This is the Dockerfile most teams write first, copied from a tutorial. It is not stupid — every line does something reasonable — and both images build green:</p>
<pre><code class="language-dockerfile">FROM node:22.23-bookworm
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]</code></pre>
<p>Measured with <code>docker build --progress=plain</code> and <code>docker image ls</code> (Docker 29 shows two size columns: DISK USAGE is what the unpacked image takes on disk, CONTENT SIZE is the compressed amount a server downloads — Lesson 1.2):</p>
<table>
<tr><th></th><th>Build context sent</th><th>DISK USAGE</th><th>CONTENT SIZE</th></tr>
<tr><td>api, day 0</td><td>346.98 MB</td><td>2.2 GB</td><td>542 MB</td></tr>
<tr><td>web, day 0</td><td>315.84 MB</td><td>2.63 GB</td><td>685 MB</td></tr>
</table>
<p>Three separate costs are hiding in there. The base <code>node:22.23-bookworm</code> alone is 1.63 GB because it carries compilers and hundreds of Debian packages the app never calls (Lesson 6.2). <code>COPY . .</code> ships every file in the folder, including the 352 MB <code>node_modules</code> on your Mac (Lesson 4.1). And <code>npm start</code> makes npm, not your app, the PID 1 that receives <code>docker stop</code> (Lesson 1.3). The web image builds and even runs. The API does not.</p>

<h3>Forget .dockerignore and your Mac's Prisma engine ends up in the image</h3>
${slide('dk-16', 5, 'Quên .dockerignore: engine Prisma của Mac lọt vào container')}
<pre><code class="language-bash">docker build -f Dockerfile.ngay0 -t api:ngay0 ./api
docker run --rm --network thu -e DATABASE_URL=… api:ngay0</code></pre>
<div class="out">#4 transferring context: 346.98MB 3.7s done
#8 4.277 up to date, audited 126 packages in 4s
…
PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-arm64-openssl-3.0.x".

This happened because Prisma Client was generated for "darwin-arm64", but the actual deployment required "linux-arm64-openssl-3.0.x".
…
The following locations have been searched:
  /app/node_modules/.prisma/client
  /app/node_modules/@prisma/client
  /private/tmp/…/phongkham/api/node_modules/@prisma/client</div>
<p>Read it in order. <code>COPY . .</code> carried the Mac's <code>node_modules</code> into the image. <code>npm install</code> looked at it, found every package already present, printed <code>up to date</code> in four seconds and installed nothing. So the Prisma client inside the image is the one generated on macOS, with a query engine compiled for <code>darwin-arm64</code> — a macOS library that a Linux process cannot load. The last line even leaks the absolute path on the laptop that built it.</p>
<p>The fix is a <code>.dockerignore</code> next to the Dockerfile. It works like <code>.gitignore</code> but for the build context — the files Docker sends to the builder:</p>
<pre><code>node_modules      <span class="tok-comment"># installed INSIDE the image, for the image's OS</span>
dist              <span class="tok-comment"># built INSIDE the image</span>
.env*             <span class="tok-comment"># secrets never go into a layer (Lesson 1.2)</span>
!.env.example     <span class="tok-comment"># … except the template</span>
*.log
Dockerfile*       <span class="tok-comment"># editing the Dockerfile should not bust the COPY cache</span>
.dockerignore</code></pre>
<p>Rebuilt from a fresh copy of the folder (so BuildKit could not reuse an earlier transfer), the context dropped from <strong>346.98 MB to 59.94 kB</strong>. And now <code>npm ci</code> inside the image installs everything from scratch, for Linux.</p>

<h3>Three stages: install, build, ship only what runs</h3>
${slide('dk-16', 6, 'Ba stage: cài → dựng → chỉ mang phần chạy đi')}
<pre><code class="language-dockerfile"><span class="tok-comment"># syntax=docker/dockerfile:1</span>
FROM node:22.23-alpine3.24 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS dev
COPY tsconfig.json ./
COPY src ./src
RUN npm run build
CMD ["sh", "-c", "npx tsc -w --preserveWatchOutput &amp; exec node --watch dist/index.js"]

FROM dev AS build
RUN npm prune --omit=dev

FROM node:22.23-alpine3.24 AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN apk add --no-cache tini
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --chown=node:node package.json ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=3 \\
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]</code></pre>
<table>
<tr><th>Line</th><th>Why it is there</th><th>Chapter</th></tr>
<tr><td><code>FROM node:22.23-alpine3.24</code> in BOTH deps and runtime</td><td>The stage that runs <code>npm ci</code> (and therefore <code>prisma generate</code>) must use the same libc as the stage that runs the app. Pinning Node minor and Alpine version stops a silent jump under your feet.</td><td>3.2, 6.2</td></tr>
<tr><td><code>COPY package.json package-lock.json</code> then <code>COPY prisma</code>, then <code>npm ci</code></td><td>Only these files decide the installed packages, so editing <code>src/</code> keeps the <code>npm ci</code> layer cached. Prisma's postinstall needs <code>schema.prisma</code> to generate the client.</td><td>5.2, 10.3</td></tr>
<tr><td><code>RUN --mount=type=cache,target=/root/.npm</code></td><td>npm's download cache survives between builds without ending up in any layer.</td><td>5.3</td></tr>
<tr><td><code>FROM deps AS dev</code></td><td>A target Compose uses in development (Lesson 16.2). It has the source and the compiler.</td><td>6.1</td></tr>
<tr><td><code>npm prune --omit=dev</code></td><td>Drops TypeScript and the type packages from <code>node_modules</code> before it is copied out.</td><td>6.3</td></tr>
<tr><td><code>apk add --no-cache tini</code> + <code>ENTRYPOINT ["/sbin/tini", "--"]</code></td><td>A 10-line init as PID 1 that forwards <code>SIGTERM</code> and reaps zombies.</td><td>1.3</td></tr>
<tr><td><code>COPY --from=build --chown=node:node</code></td><td>Files belong to the non-root user without a slow <code>RUN chown -R</code> layer.</td><td>4.2, 6.4</td></tr>
<tr><td><code>USER node</code></td><td>The process runs as uid 1000. A bug that lets an attacker run code runs it without root.</td><td>6.4</td></tr>
<tr><td><code>HEALTHCHECK</code></td><td>"Healthy" means "answers <code>/health</code>", and <code>/health</code> itself runs <code>SELECT 1</code> on Postgres and <code>PING</code> on Redis.</td><td>2.5, 9.3</td></tr>
<tr><td><code>CMD ["node", "dist/index.js"]</code></td><td>Exec form, no npm in between.</td><td>4.3</td></tr>
</table>
<p>Build only the stage you ship with <code>--target runtime</code>. Without it, the builder still stops at the LAST stage in the file — which here happens to be <code>runtime</code> — but naming it makes the intent explicit and survives someone adding a stage at the bottom.</p>

<h3>Prisma and libc: the engine follows where prisma generate ran</h3>
${slide('dk-16', 7, 'Engine Prisma đi theo nơi chạy prisma generate')}
<p>Prisma 5 and 6 (the versions most student projects use; this chapter uses 6.19.3) ship a native query engine: a compiled library, one file per operating system, C library and OpenSSL version. <code>prisma generate</code> — which <code>npm ci</code> runs for you through Prisma's postinstall — downloads the engine for the machine it runs on, plus any extra targets listed in <code>binaryTargets</code>. Three real outcomes, all measured for this chapter:</p>
<table>
<tr><th>Where <code>prisma generate</code> ran</th><th>Engine produced</th><th>Runs on</th><th>Result</th></tr>
<tr><td>On the Mac (node_modules copied into the image)</td><td><code>darwin-arm64</code></td><td>Debian arm64</td><td>crashes at start-up (above)</td></tr>
<tr><td>In <code>node:22.23-bookworm-slim</code></td><td><code>linux-arm64-openssl-1.1.x</code></td><td>Alpine (musl)</td><td>API 502, restart loop (Lesson 16.4)</td></tr>
<tr><td>In <code>node:22.23-alpine3.24</code>, stage <code>deps</code></td><td><code>linux-musl-arm64-openssl-3.0.x</code></td><td>Alpine (musl)</td><td>runs, healthy</td></tr>
</table>
<p>The middle row deserves a second look. <code>bookworm-slim</code> has no <code>openssl</code> binary, so Prisma could not detect the OpenSSL version and silently fell back to guessing <code>1.1.x</code>. The warning it prints during postinstall is hidden by npm, so the build log is spotless. The image is doubly wrong — wrong libc and wrong OpenSSL — and nothing tells you until the first query.</p>
<pre><code>generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x", "linux-musl-arm64-openssl-3.0.x"]
}</code></pre>
<p><code>native</code> means "the machine running <code>generate</code>"; the two extra targets cover the amd64 VPS and an arm64 Mac, so the same <code>node_modules</code> works if it is ever generated on one and run on the other. Each extra engine costs 15–17.5 MB (measured: 15,712,408 bytes for musl-arm64, 17,556,136 for musl-amd64). But treat <code>binaryTargets</code> as a safety net, not the fix. The fix is the rule in the table: <strong>the stage that installs and the stage that runs share one base image.</strong></p>

<h3>The web image: Next.js standalone</h3>
<pre><code class="language-dockerfile"><span class="tok-comment"># syntax=docker/dockerfile:1</span>
FROM node:22.23-alpine3.24 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS dev
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
CMD ["npx", "next", "dev", "-H", "0.0.0.0", "-p", "3000"]

FROM deps AS build
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22.23-alpine3.24 AS runtime
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \\
  CMD wget -qO /dev/null http://127.0.0.1:3000/ || exit 1
CMD ["node", "server.js"]</code></pre>
<p>With <code>output: 'standalone'</code> in <code>next.config.mjs</code>, <code>next build</code> traces which files the server actually imports and copies only those into <code>.next/standalone</code>, together with a small <code>server.js</code>. Measured: that layer is <strong>68.4 MB</strong>, against 328 MB of <code>node_modules</code> in the project. Three details that bite (Lesson 10.4): <code>.next/static</code> is NOT inside standalone and must be copied separately, or every page loads without CSS and JavaScript; if you have a <code>public/</code> folder it must be copied too; and <code>HOSTNAME=0.0.0.0</code> makes the server listen on every interface of the container instead of only the container's own hostname address. <code>NEXT_PUBLIC_*</code> variables are baked in at <code>next build</code> time, so they belong to the build stage, not to the running container.</p>
<div class="callout warn"><strong>The web runtime has no tini, on purpose — and that is fine here.</strong> Measured: <code>docker stop</code> on the web container returned after 0.121 s with exit code <code>143</code> (128 + 15: ended by SIGTERM, which is normal). The Next.js server reacts to SIGTERM itself. If your own server did not, <code>docker stop</code> would wait the full grace period and end with <code>137</code> — then add tini like the API.</div>

<h3>Non-root, a real init, and a quick stop</h3>
${slide('dk-16', 8, 'Trước và sau: nhỏ hơn 3–8 lần, không root, dừng trong 0,14 s')}
<pre><code class="language-bash">docker exec api sh -c 'id; touch /app/x'
docker top api -o pid,user,args
time docker stop api
docker logs --tail 1 api</code></pre>
<div class="out">uid=1000(node) gid=1000(node) groups=1000(node)
touch: /app/x: Permission denied
PID                 USER                COMMAND
88789               1000                /sbin/tini -- node dist/index.js
88813               1000                node dist/index.js
docker stop …  0.143 total
SIGTERM — đóng server</div>
<p>Four facts in eight lines. The process is uid 1000 and cannot write to its own code directory (it can still write to <code>/tmp</code>). PID 1 is tini, and node is its child. <code>docker stop</code> took 0.143 s, not the ten-second grace period, because the API's own <code>SIGTERM</code> handler closed the HTTP server, disconnected Prisma and Redis, and exited with code 0. And the last log line is that handler speaking.</p>

<h3>Before and after, measured</h3>
<table>
<tr><th>Image</th><th>DISK USAGE</th><th>CONTENT SIZE (what a server pulls)</th><th>User</th></tr>
<tr><td>api, day 0 (bookworm, no ignore)</td><td>2.2 GB</td><td>542 MB</td><td>root</td></tr>
<tr><td>api, three stages (alpine)</td><td>664 MB</td><td>167 MB</td><td>node</td></tr>
<tr><td>web, day 0 (bookworm, <code>next start</code>)</td><td>2.63 GB</td><td>685 MB</td><td>root</td></tr>
<tr><td>web, standalone (alpine)</td><td>328 MB</td><td>85.6 MB</td><td>node</td></tr>
</table>
<p>Why is the API still 664 MB? <code>docker history</code> says 324 MB of it is <code>node_modules</code>, and <code>du</code> inside the image shows where: <code>@prisma</code> 110 MB, the <code>prisma</code> CLI 82 MB, and 23 MB of TypeScript that <code>npm prune</code> did NOT remove. Prisma 6 declares the CLI and TypeScript as peer dependencies of the client, so npm treats them as production packages. We keep the CLI deliberately — the <code>migrate</code> service runs <code>prisma migrate deploy</code> from this very image — and accept the size. The alternative, a second image just for migrations, doubles what CI builds and the VPS pulls; for a student project that is the wrong trade (Lesson 6.3 has the full analysis of those 60 MB).</p>

<h3>Step by step</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1 · measure day 0</span><span class="lz-t">docker build --progress=plain -f Dockerfile.ngay0 -t api:ngay0 ./api 2&gt;&amp;1 | grep "transferring context"</span><span class="lz-d">Write down the context size and, after the build, docker image ls api:ngay0.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2 · add .dockerignore</span><span class="lz-t">printf 'node_modules\\ndist\\n.env*\\n!.env.example\\n' &gt; api/.dockerignore</span><span class="lz-d">Rebuild: the context should fall to tens of kilobytes.</span></div>
  <div class="lz-step"><span class="lz-k">Step 3 · three stages</span><span class="lz-t">docker build --target runtime -t api:1 ./api</span><span class="lz-d">Same base image in deps and runtime.</span></div>
  <div class="lz-step"><span class="lz-k">Step 4 · check the engine</span><span class="lz-t">docker run --rm --entrypoint sh api:1 -c 'ls node_modules/.prisma/client | grep node'</span><span class="lz-d">You want linux-musl-…, never darwin- or debian- in an Alpine image.</span></div>
  <div class="lz-step"><span class="lz-k">Step 5 · check the user and the stop</span><span class="lz-t">docker run -d --name t api:1 &amp;&amp; docker exec t id &amp;&amp; time docker stop t</span><span class="lz-d">uid 1000, and well under a second if your app handles SIGTERM.</span></div>
</div>

<div class="pitfall co-tieu-de"><strong>"Build green" is not "image works".</strong> Every broken image in this lesson built green: the day-0 API with a macOS engine, and the bookworm-slim build with a guessed OpenSSL. The build only proves that each command exited 0. Make the last step of your build script <em>run</em> the image and ask it one real question — <code>node -e "require('@prisma/client')"</code> is not enough: measured on the broken Alpine image it prints <code>require OK</code>, because the engine is only loaded a moment later, asynchronously, once a <code>PrismaClient</code> is created or connects. Start the image against a throwaway database and hit <code>/health</code>, which runs a real <code>SELECT 1</code> (Lesson 12.4).</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your SWP391 team's backend (Express or NestJS + Prisma) "works in Docker" on the Mac of the one teammate who wrote the Dockerfile, but crashes on the lecturer's Linux server with a Prisma engine error. You have one evening.</p><ol>
<li>In <code>~/thu-docker/capstone</code>, copy your team's backend (or a minimal Express + Prisma app) and build it with its current Dockerfile. Record the <code>transferring context</code> line and the two sizes from <code>docker image ls</code>.</li>
<li>Add a <code>.dockerignore</code> with at least <code>node_modules</code>, <code>dist</code> and <code>.env*</code>. Rebuild and record the context size again.</li>
<li>Rewrite the Dockerfile into <code>deps</code> → <code>build</code> → <code>runtime</code> on one pinned Alpine (or one pinned Debian-slim with <code>openssl</code> installed — just the same one everywhere).</li>
<li>List the engine files in the image (Step 4 above) and write down the target name.</li>
<li>Run the image against a throwaway Postgres (<code>docker run --rm -d --name pg -e POSTGRES_PASSWORD=x postgres:16.4-alpine</code> on a user-defined network) and call <code>/health</code> or any route that queries the database.</li></ol>
<p><strong>Done when:</strong> the context is under 1 MB, the runtime image is at most a third of the day-0 size, the only engine for your OS in the image matches the image's libc, <code>docker exec … id</code> does not print <code>uid=0</code>, and a route that queries the database answers.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Build context</span><span class="v">The files Docker sends to the builder; <code>COPY</code> can only see these.</span></div>
  <div class="kv"><span class="k">.dockerignore</span><span class="v">Patterns excluded from the build context, like <code>.gitignore</code> for images.</span></div>
  <div class="kv"><span class="k">Multi-stage build</span><span class="v">Several <code>FROM</code>s in one Dockerfile; only the last (or <code>--target</code>) stage becomes the image you ship.</span></div>
  <div class="kv"><span class="k">Query engine / binaryTargets</span><span class="v">Prisma's native library, compiled per OS, libc and OpenSSL; the list of extra platforms to download it for.</span></div>
  <div class="kv"><span class="k">libc (musl / glibc)</span><span class="v">The C library every native program links against; Alpine uses musl, Debian and Ubuntu use glibc.</span></div>
  <div class="kv"><span class="k">Standalone output</span><span class="v">Next.js mode that copies only the files the server imports, plus a <code>server.js</code>.</span></div>
  <div class="kv"><span class="k">Init process (tini)</span><span class="v">A tiny PID 1 that forwards signals to your app and reaps zombie processes.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Write <code>.dockerignore</code> before the Dockerfile: here it cut the context from 347 MB to 60 kB and stopped a macOS Prisma engine from reaching Linux.</li>
<li>Three stages — deps, build, runtime — keep compilers and dev packages out of what you ship: 2.2 GB → 664 MB for the API, 2.63 GB → 328 MB for Next.js standalone.</li>
<li>Prisma's engine is chosen where <code>prisma generate</code> runs; install and run on the same base image, and treat <code>binaryTargets</code> as a safety net.</li>
<li>Run as a non-root user, put tini (or a signal-aware server) at PID 1, and write a HEALTHCHECK that touches the database.</li>
<li>Measure with <code>docker image ls</code> and <code>docker history</code>; a remaining big layer usually has a reason you can state.</li>
<li>A green build proves nothing about a working image — always run it against a real dependency before pushing.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/build/building/multi-stage/" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">Multi-stage builds</span><span class="lc-sub">Official guide to stages, <code>COPY --from</code> and <code>--target</code>.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/concepts/context/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Build context and .dockerignore</span><span class="lc-sub">What gets sent to the builder and the exact ignore-file syntax.</span></span>
</a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-schema-reference" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Prisma schema reference — binaryTargets</span><span class="lc-sub">Every engine target name (musl, OpenSSL versions, arm64).</span></span>
</a>
<a class="link-card" href="https://nextjs.org/docs/app/api-reference/config/next-config-js/output" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Next.js output: standalone</span><span class="lc-sub">What is traced into <code>.next/standalone</code> and what you must copy yourself.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practise in Code Lab</span><span class="lc-sub">Docker exercises with automatic grading.</span></span>
</a>
<p class="note-ct"><strong>Three things to remember.</strong> The build context is decided by <code>.dockerignore</code>, and a missing one poisons the image in ways that show up far from the cause. Install and run on the same base image. And the image is finished when it answers a real request, not when the build turns green.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.1</span>
<h2>Ngày 1: đóng gói API và web</h2>
<p class="lead">Đồ án SWP391 của nhóm bạn chạy ngon trên laptop của mọi người. Thầy muốn có một đường link demo trước thứ Sáu, và thứ duy nhất đứng giữa "máy tôi chạy được" với "máy chủ chạy được" là hai cái ảnh. Bài này dựng chúng hai lần: lần đầu theo đúng cách gần như nhóm nào cũng làm ở ngày đầu tiên, lần sau theo cách sống sót được trên production — và đo chênh lệch.</p>
<p>Không có kỹ thuật nào trong chương này là mới nếu đứng riêng. Mọi thứ đều đã dạy ở đâu đó từ Chương 4 tới Chương 12. Cái mới là làm TẤT CẢ cùng lúc, trên một app, theo đúng thứ tự — và thấy một sai sót ở chỗ này (thiếu <code>.dockerignore</code>) lại nổi lên ở một chỗ hoàn toàn khác (lỗi Prisma lúc khởi động).</p>

<h3>Dự án: app đặt lịch phòng khám</h3>
${slide('dk-16', 3, 'Sáu dịch vụ, hai mạng, đúng MỘT cổng mở ra ngoài')}
<p>App cố ý nhỏ nhưng là app thật, và mọi con số trong chương này đều đo trên nó: bệnh nhân xem các khung giờ còn trống trong ngày, đặt một khung, nhận thư xác nhận; đặt trùng bác sĩ trùng giờ thì nhận <code>409</code>; danh sách khung trống được cache trong Redis 30 giây. Sáu dịch vụ:</p>
<table>
<tr><th>Dịch vụ</th><th>Là gì</th><th>Ảnh</th></tr>
<tr><td><code>nginx</code></td><td>Cửa duy nhất: <code>/</code> sang web, <code>/api/</code> sang api</td><td><code>nginx:1.27-alpine</code></td></tr>
<tr><td><code>web</code></td><td>Next.js 16 (App Router), dựng danh sách khung giờ ở phía máy chủ</td><td>của mình, dựng từ <code>web/</code></td></tr>
<tr><td><code>api</code></td><td>Express 5 + Prisma 6.19, TypeScript biên dịch ra <code>dist/</code></td><td>của mình, dựng từ <code>api/</code></td></tr>
<tr><td><code>migrate</code></td><td>Chính ảnh API chạy <code>prisma migrate deploy</code> một lần rồi thoát</td><td>của mình</td></tr>
<tr><td><code>db</code></td><td>PostgreSQL 16 với volume có tên</td><td><code>postgres:16.4-alpine</code></td></tr>
<tr><td><code>cache</code></td><td>Redis 7, bật ghi nối đuôi (append-only) để không mất khi khởi động lại</td><td><code>redis:7.4-alpine</code></td></tr>
</table>
<pre><code>phongkham/
├── api/        <span class="tok-comment"># Dockerfile, .dockerignore, package.json, prisma/, src/index.ts</span>
├── web/        <span class="tok-comment"># Dockerfile, .dockerignore, package.json, next.config.mjs, app/</span>
├── nginx/      <span class="tok-comment"># default.conf</span>
├── compose.yaml, compose.override.yaml, compose.prod.yaml   <span class="tok-comment"># Bài 16.2</span>
├── deploy.sh, smoke.sh, .github/workflows/deploy.yml        <span class="tok-comment"># Bài 16.3</span>
├── .env.example   <span class="tok-comment"># có commit, không giá trị thật</span>
└── .env           <span class="tok-comment"># nằm trong .gitignore, không bao giờ commit</span></code></pre>

<h3>Ngày 0: Dockerfile "cho chạy được"</h3>
${slide('dk-16', 4, 'Ngày 0: Dockerfile “cho chạy được” nặng 2,2 GB')}
<p>Đây là Dockerfile mà phần lớn các nhóm viết đầu tiên, chép từ một bài hướng dẫn. Nó không ngớ ngẩn — dòng nào cũng làm một việc hợp lý — và cả hai ảnh đều build XANH:</p>
<pre><code class="language-dockerfile">FROM node:22.23-bookworm
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]</code></pre>
<p>Đo bằng <code>docker build --progress=plain</code> và <code>docker image ls</code> (Docker 29 có hai cột kích thước: DISK USAGE là chỗ ảnh chiếm trên đĩa sau khi bung, CONTENT SIZE là lượng dữ liệu nén mà máy chủ phải tải về — Bài 1.2):</p>
<table>
<tr><th></th><th>Ngữ cảnh gửi đi</th><th>DISK USAGE</th><th>CONTENT SIZE</th></tr>
<tr><td>api, ngày 0</td><td>346,98 MB</td><td>2,2 GB</td><td>542 MB</td></tr>
<tr><td>web, ngày 0</td><td>315,84 MB</td><td>2,63 GB</td><td>685 MB</td></tr>
</table>
<p>Có ba khoản tiền riêng rẽ giấu trong đó. Riêng ảnh nền <code>node:22.23-bookworm</code> đã 1,63 GB vì nó mang theo trình biên dịch và hàng trăm gói Debian mà app không bao giờ gọi (Bài 6.2). <code>COPY . .</code> chở mọi file trong thư mục đi, kể cả 352 MB <code>node_modules</code> trên máy Mac của bạn (Bài 4.1). Và <code>npm start</code> biến npm, chứ không phải app của bạn, thành PID 1 — tiến trình nhận tín hiệu khi <code>docker stop</code> (Bài 1.3). Ảnh web build xong và còn chạy được. Ảnh API thì không.</p>

<h3>Quên .dockerignore thì engine Prisma của máy Mac lọt vào ảnh</h3>
${slide('dk-16', 5, 'Quên .dockerignore: engine Prisma của Mac lọt vào container')}
<pre><code class="language-bash">docker build -f Dockerfile.ngay0 -t api:ngay0 ./api
docker run --rm --network thu -e DATABASE_URL=… api:ngay0</code></pre>
<div class="out">#4 transferring context: 346.98MB 3.7s done
#8 4.277 up to date, audited 126 packages in 4s
…
PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-arm64-openssl-3.0.x".

This happened because Prisma Client was generated for "darwin-arm64", but the actual deployment required "linux-arm64-openssl-3.0.x".
…
The following locations have been searched:
  /app/node_modules/.prisma/client
  /app/node_modules/@prisma/client
  /private/tmp/…/phongkham/api/node_modules/@prisma/client</div>
<p>Đọc theo thứ tự. <code>COPY . .</code> chở <code>node_modules</code> của máy Mac vào ảnh. <code>npm install</code> nhìn vào đó, thấy gói nào cũng có sẵn, in <code>up to date</code> sau bốn giây và không cài gì cả. Nên Prisma client bên trong ảnh là bản đã sinh trên macOS, với query engine (bộ máy truy vấn) biên dịch cho <code>darwin-arm64</code> — một thư viện của macOS mà tiến trình Linux không nạp được. Dòng cuối còn để lộ cả đường dẫn tuyệt đối trên chiếc laptop đã build nó.</p>
<p>Cách chữa là một file <code>.dockerignore</code> đặt cạnh Dockerfile. Nó giống <code>.gitignore</code> nhưng áp cho build context (ngữ cảnh dựng) — tập file Docker gửi sang cho bộ dựng:</p>
<pre><code>node_modules      <span class="tok-comment"># cài BÊN TRONG ảnh, cho đúng hệ điều hành của ảnh</span>
dist              <span class="tok-comment"># dựng BÊN TRONG ảnh</span>
.env*             <span class="tok-comment"># bí mật không bao giờ được vào một tầng ảnh (Bài 1.2)</span>
!.env.example     <span class="tok-comment"># … trừ file mẫu</span>
*.log
Dockerfile*       <span class="tok-comment"># sửa Dockerfile không nên làm hỏng cache của COPY</span>
.dockerignore</code></pre>
<p>Dựng lại từ một bản chép MỚI của thư mục (để BuildKit không dùng lại được lần gửi trước), ngữ cảnh giảm từ <strong>346,98 MB xuống 59,94 kB</strong>. Và giờ <code>npm ci</code> bên trong ảnh cài lại mọi thứ từ đầu, cho Linux.</p>

<h3>Ba stage: cài → dựng → chỉ mang phần chạy đi</h3>
${slide('dk-16', 6, 'Ba stage: cài → dựng → chỉ mang phần chạy đi')}
<pre><code class="language-dockerfile"><span class="tok-comment"># syntax=docker/dockerfile:1</span>
FROM node:22.23-alpine3.24 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS dev
COPY tsconfig.json ./
COPY src ./src
RUN npm run build
CMD ["sh", "-c", "npx tsc -w --preserveWatchOutput &amp; exec node --watch dist/index.js"]

FROM dev AS build
RUN npm prune --omit=dev

FROM node:22.23-alpine3.24 AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN apk add --no-cache tini
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --chown=node:node package.json ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=3 \\
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]</code></pre>
<table>
<tr><th>Dòng</th><th>Vì sao có nó</th><th>Chương</th></tr>
<tr><td><code>FROM node:22.23-alpine3.24</code> ở CẢ deps lẫn runtime</td><td>Stage chạy <code>npm ci</code> (tức là chạy <code>prisma generate</code>) phải dùng cùng libc với stage chạy app. Ghim số phụ của Node và phiên bản Alpine để không bị nhảy phiên bản âm thầm dưới chân.</td><td>3.2, 6.2</td></tr>
<tr><td><code>COPY package.json package-lock.json</code> rồi <code>COPY prisma</code>, rồi mới <code>npm ci</code></td><td>Chỉ những file này quyết định gói được cài, nên sửa <code>src/</code> vẫn giữ nguyên cache của tầng <code>npm ci</code>. Postinstall của Prisma cần <code>schema.prisma</code> để sinh client.</td><td>5.2, 10.3</td></tr>
<tr><td><code>RUN --mount=type=cache,target=/root/.npm</code></td><td>Kho tải về của npm sống qua các lần build mà không nằm trong tầng nào.</td><td>5.3</td></tr>
<tr><td><code>FROM deps AS dev</code></td><td>Target (đích dựng) mà Compose dùng lúc phát triển (Bài 16.2). Có mã nguồn và trình biên dịch.</td><td>6.1</td></tr>
<tr><td><code>npm prune --omit=dev</code></td><td>Bỏ TypeScript và các gói kiểu khỏi <code>node_modules</code> trước khi chép ra.</td><td>6.3</td></tr>
<tr><td><code>apk add --no-cache tini</code> + <code>ENTRYPOINT ["/sbin/tini", "--"]</code></td><td>Một init nhỏ làm PID 1: chuyển tiếp <code>SIGTERM</code> và dọn tiến trình zombie.</td><td>1.3</td></tr>
<tr><td><code>COPY --from=build --chown=node:node</code></td><td>File thuộc về user không-root mà không cần một tầng <code>RUN chown -R</code> chậm và nặng.</td><td>4.2, 6.4</td></tr>
<tr><td><code>USER node</code></td><td>Tiến trình chạy với uid 1000. Lỗ hổng nào cho kẻ tấn công chạy mã thì mã đó cũng không có quyền root.</td><td>6.4</td></tr>
<tr><td><code>HEALTHCHECK</code></td><td>"Khoẻ" nghĩa là "trả lời được <code>/health</code>", mà <code>/health</code> tự chạy <code>SELECT 1</code> vào Postgres và <code>PING</code> vào Redis.</td><td>2.5, 9.3</td></tr>
<tr><td><code>CMD ["node", "dist/index.js"]</code></td><td>Dạng exec, không có npm đứng giữa.</td><td>4.3</td></tr>
</table>
<p>Chỉ dựng stage bạn đem đi, bằng <code>--target runtime</code>. Không có cờ đó thì bộ dựng vẫn dừng ở stage CUỐI CÙNG trong file — ở đây tình cờ đúng là <code>runtime</code> — nhưng gọi tên nó làm ý định rõ ràng và không vỡ khi ai đó thêm một stage xuống cuối file.</p>

<h3>Prisma và libc: engine đi theo nơi chạy prisma generate</h3>
${slide('dk-16', 7, 'Engine Prisma đi theo nơi chạy prisma generate')}
<p>Prisma 5 và 6 (hai bản phần lớn đồ án sinh viên dùng; chương này dùng 6.19.3) mang theo một query engine dạng mã máy: một thư viện đã biên dịch, mỗi file cho một tổ hợp hệ điều hành, thư viện C và phiên bản OpenSSL. <code>prisma generate</code> — thứ mà <code>npm ci</code> tự chạy giùm bạn qua postinstall của Prisma — tải engine cho chính cái máy nó đang chạy, cộng thêm mọi đích liệt kê trong <code>binaryTargets</code>. Ba kết cục thật, đều đo cho chương này:</p>
<table>
<tr><th>Nơi chạy <code>prisma generate</code></th><th>Engine sinh ra</th><th>Chạy trên</th><th>Kết quả</th></tr>
<tr><td>Trên máy Mac (node_modules bị chở vào ảnh)</td><td><code>darwin-arm64</code></td><td>Debian arm64</td><td>sập ngay lúc khởi động (ở trên)</td></tr>
<tr><td>Trong <code>node:22.23-bookworm-slim</code></td><td><code>linux-arm64-openssl-1.1.x</code></td><td>Alpine (musl)</td><td>API 502, restart vòng lặp (Bài 16.4)</td></tr>
<tr><td>Trong <code>node:22.23-alpine3.24</code>, stage <code>deps</code></td><td><code>linux-musl-arm64-openssl-3.0.x</code></td><td>Alpine (musl)</td><td>chạy, healthy</td></tr>
</table>
<p>Hàng giữa đáng nhìn lần thứ hai. <code>bookworm-slim</code> không có chương trình <code>openssl</code>, nên Prisma không dò được phiên bản OpenSSL và lặng lẽ đoán là <code>1.1.x</code>. Lời cảnh báo nó in ra trong lúc postinstall bị npm giấu đi, nên log build sạch bong. Cái ảnh sai hai lần — sai libc và sai OpenSSL — và không có gì báo cho bạn biết cho tới câu truy vấn đầu tiên.</p>
<pre><code>generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x", "linux-musl-arm64-openssl-3.0.x"]
}</code></pre>
<p><code>native</code> nghĩa là "cái máy đang chạy <code>generate</code>"; hai đích thêm vào phủ VPS amd64 và máy Mac arm64, để cùng một <code>node_modules</code> vẫn chạy nếu lỡ sinh ở máy này mà chạy ở máy kia. Mỗi engine thêm tốn 15–17,5 MB (đo: 15.712.408 byte cho musl-arm64, 17.556.136 byte cho musl-amd64). Nhưng hãy coi <code>binaryTargets</code> là lưới đỡ, không phải cách chữa. Cách chữa là luật trong bảng: <strong>stage cài gói và stage chạy app dùng CHUNG một ảnh nền.</strong></p>

<h3>Ảnh web: Next.js standalone</h3>
<pre><code class="language-dockerfile"><span class="tok-comment"># syntax=docker/dockerfile:1</span>
FROM node:22.23-alpine3.24 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS dev
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
CMD ["npx", "next", "dev", "-H", "0.0.0.0", "-p", "3000"]

FROM deps AS build
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22.23-alpine3.24 AS runtime
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \\
  CMD wget -qO /dev/null http://127.0.0.1:3000/ || exit 1
CMD ["node", "server.js"]</code></pre>
<p>Có <code>output: 'standalone'</code> trong <code>next.config.mjs</code>, <code>next build</code> lần theo xem máy chủ thật sự import những file nào và chỉ chép đúng những file đó vào <code>.next/standalone</code>, kèm một <code>server.js</code> nhỏ. Đo được: tầng đó nặng <strong>68,4 MB</strong>, trong khi <code>node_modules</code> của dự án là 328 MB. Ba chi tiết hay cắn người (Bài 10.4): <code>.next/static</code> KHÔNG nằm trong standalone và phải chép riêng, nếu không mọi trang tải lên không có CSS lẫn JavaScript; nếu có thư mục <code>public/</code> thì cũng phải chép; và <code>HOSTNAME=0.0.0.0</code> bắt server nghe trên mọi giao diện mạng của container thay vì chỉ địa chỉ ứng với tên máy của container. Biến <code>NEXT_PUBLIC_*</code> được nướng cứng vào lúc <code>next build</code>, nên chúng thuộc về stage build, không phải container đang chạy.</p>
<div class="callout warn"><strong>Runtime của web không có tini, cố ý — và ở đây như thế là ổn.</strong> Đo được: <code>docker stop</code> container web trả về sau 0,121 giây với mã thoát <code>143</code> (128 + 15: kết thúc vì SIGTERM, bình thường). Server của Next.js tự phản ứng với SIGTERM. Nếu server của bạn không làm vậy, <code>docker stop</code> sẽ chờ hết thời gian ân hạn rồi kết thúc bằng <code>137</code> — lúc đó thêm tini như API.</div>

<h3>Không root, một init thật, và dừng thật nhanh</h3>
${slide('dk-16', 8, 'Trước và sau: nhỏ hơn 3–8 lần, không root, dừng trong 0,14 s')}
<pre><code class="language-bash">docker exec api sh -c 'id; touch /app/x'
docker top api -o pid,user,args
time docker stop api
docker logs --tail 1 api</code></pre>
<div class="out">uid=1000(node) gid=1000(node) groups=1000(node)
touch: /app/x: Permission denied
PID                 USER                COMMAND
88789               1000                /sbin/tini -- node dist/index.js
88813               1000                node dist/index.js
docker stop …  0.143 total
SIGTERM — đóng server</div>
<p>Bốn sự thật trong tám dòng. Tiến trình là uid 1000 và không ghi được vào thư mục mã của chính nó (vẫn ghi được vào <code>/tmp</code>). PID 1 là tini, còn node là con của nó. <code>docker stop</code> mất 0,143 giây chứ không phải mười giây ân hạn, vì hàm xử lý <code>SIGTERM</code> của chính API đã đóng server HTTP, ngắt Prisma và Redis rồi thoát với mã 0. Và dòng log cuối chính là hàm xử lý đó lên tiếng.</p>

<h3>Trước và sau, đo thật</h3>
<table>
<tr><th>Ảnh</th><th>DISK USAGE</th><th>CONTENT SIZE (máy chủ phải kéo)</th><th>User</th></tr>
<tr><td>api, ngày 0 (bookworm, không ignore)</td><td>2,2 GB</td><td>542 MB</td><td>root</td></tr>
<tr><td>api, ba stage (alpine)</td><td>664 MB</td><td>167 MB</td><td>node</td></tr>
<tr><td>web, ngày 0 (bookworm, <code>next start</code>)</td><td>2,63 GB</td><td>685 MB</td><td>root</td></tr>
<tr><td>web, standalone (alpine)</td><td>328 MB</td><td>85,6 MB</td><td>node</td></tr>
</table>
<p>Vì sao API vẫn còn 664 MB? <code>docker history</code> nói 324 MB trong đó là <code>node_modules</code>, và <code>du</code> bên trong ảnh chỉ rõ ở đâu: <code>@prisma</code> 110 MB, CLI <code>prisma</code> 82 MB, và 23 MB TypeScript mà <code>npm prune</code> KHÔNG gỡ. Prisma 6 khai CLI và TypeScript là peer dependency (phụ thuộc ngang hàng) của client, nên npm coi chúng là gói production. Ta cố ý giữ CLI — dịch vụ <code>migrate</code> chạy <code>prisma migrate deploy</code> từ chính ảnh này — và chấp nhận kích thước đó. Cách kia, một ảnh thứ hai chỉ để migrate, làm gấp đôi thứ CI phải dựng và VPS phải kéo; với một đồ án sinh viên đó là đổi chác sai (Bài 6.3 phân tích đủ 60 MB này).</p>

<h3>Chạy thử từng bước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1 · đo ngày 0</span><span class="lz-t">docker build --progress=plain -f Dockerfile.ngay0 -t api:ngay0 ./api 2&gt;&amp;1 | grep "transferring context"</span><span class="lz-d">Ghi lại kích thước ngữ cảnh và, sau khi build, docker image ls api:ngay0.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2 · thêm .dockerignore</span><span class="lz-t">printf 'node_modules\\ndist\\n.env*\\n!.env.example\\n' &gt; api/.dockerignore</span><span class="lz-d">Dựng lại: ngữ cảnh phải tụt xuống cỡ vài chục kilobyte.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3 · ba stage</span><span class="lz-t">docker build --target runtime -t api:1 ./api</span><span class="lz-d">Cùng một ảnh nền ở deps và runtime.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4 · kiểm engine</span><span class="lz-t">docker run --rm --entrypoint sh api:1 -c 'ls node_modules/.prisma/client | grep node'</span><span class="lz-d">Phải thấy linux-musl-…, không bao giờ darwin- hay debian- trong một ảnh Alpine.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 5 · kiểm user và cú dừng</span><span class="lz-t">docker run -d --name t api:1 &amp;&amp; docker exec t id &amp;&amp; time docker stop t</span><span class="lz-d">uid 1000, và dưới một giây nếu app của bạn bắt SIGTERM.</span></div>
</div>

<div class="pitfall co-tieu-de"><strong>"Build xanh" không phải "ảnh chạy được".</strong> Mọi ảnh hỏng trong bài này đều build xanh: API ngày 0 mang engine macOS, và bản build trên bookworm-slim với OpenSSL đoán mò. Build chỉ chứng minh rằng từng lệnh thoát với mã 0. Hãy cho bước cuối của script build <em>chạy</em> cái ảnh và hỏi nó một câu thật — <code>node -e "require('@prisma/client')"</code> là chưa đủ: đo trên chính ảnh Alpine hỏng, nó vẫn in <code>require OK</code>, vì engine chỉ được nạp một nhịp sau đó, bất đồng bộ, khi một <code>PrismaClient</code> được tạo hoặc kết nối. Hãy khởi động ảnh với một CSDL dùng-một-lần rồi gọi <code>/health</code>, nơi chạy một câu <code>SELECT 1</code> thật (Bài 12.4).</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> backend đồ án SWP391 của nhóm (Express hoặc NestJS + Prisma) "chạy được trong Docker" trên máy Mac của đúng một bạn đã viết Dockerfile, nhưng sập trên máy chủ Linux của thầy với lỗi engine Prisma. Bạn có đúng một buổi tối.</p><ol>
<li>Trong <code>~/thu-docker/capstone</code>, chép backend của nhóm (hoặc một app Express + Prisma tối giản) và build bằng Dockerfile hiện tại. Ghi lại dòng <code>transferring context</code> và hai cột kích thước trong <code>docker image ls</code>.</li>
<li>Thêm <code>.dockerignore</code> có ít nhất <code>node_modules</code>, <code>dist</code> và <code>.env*</code>. Build lại, ghi lại kích thước ngữ cảnh.</li>
<li>Viết lại Dockerfile thành <code>deps</code> → <code>build</code> → <code>runtime</code> trên một bản Alpine đã ghim (hoặc một bản Debian-slim đã ghim có cài <code>openssl</code> — miễn là CÙNG một bản ở mọi stage).</li>
<li>Liệt kê file engine trong ảnh (Bước 4 ở trên) và ghi lại tên đích.</li>
<li>Chạy ảnh với một Postgres dùng-một-lần (<code>docker run --rm -d --name pg -e POSTGRES_PASSWORD=x postgres:16.4-alpine</code> trên một mạng tự tạo) rồi gọi <code>/health</code> hoặc bất kỳ tuyến nào có truy vấn CSDL.</li></ol>
<p><strong>Đạt khi:</strong> ngữ cảnh dưới 1 MB, ảnh runtime nhỏ hơn hoặc bằng một phần ba ảnh ngày 0, engine cho hệ điều hành của bạn trong ảnh khớp với libc của ảnh, <code>docker exec … id</code> không in <code>uid=0</code>, và một tuyến có truy vấn CSDL trả lời được.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Build context (ngữ cảnh dựng)</span><span class="v">Tập file Docker gửi cho bộ dựng; <code>COPY</code> chỉ nhìn thấy những file này.</span></div>
  <div class="kv"><span class="k">.dockerignore (file bỏ qua)</span><span class="v">Các mẫu tên bị loại khỏi ngữ cảnh dựng, như <code>.gitignore</code> nhưng cho ảnh.</span></div>
  <div class="kv"><span class="k">Multi-stage build (dựng nhiều stage)</span><span class="v">Nhiều <code>FROM</code> trong một Dockerfile; chỉ stage cuối (hoặc stage chọn bằng <code>--target</code>) thành ảnh đem đi.</span></div>
  <div class="kv"><span class="k">Query engine / binaryTargets (bộ máy truy vấn / các đích nhị phân)</span><span class="v">Thư viện mã máy của Prisma, biên dịch riêng theo hệ điều hành, libc và OpenSSL; danh sách nền tảng tải thêm engine.</span></div>
  <div class="kv"><span class="k">libc — musl / glibc (thư viện C)</span><span class="v">Thư viện C mọi chương trình mã máy đều liên kết tới; Alpine dùng musl, Debian và Ubuntu dùng glibc.</span></div>
  <div class="kv"><span class="k">Standalone output (bản dựng độc lập)</span><span class="v">Chế độ của Next.js chỉ chép những file server thật sự import, kèm một <code>server.js</code>.</span></div>
  <div class="kv"><span class="k">Init process — tini (tiến trình khởi tạo)</span><span class="v">Một PID 1 tí hon chuyển tín hiệu cho app và dọn tiến trình zombie.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Viết <code>.dockerignore</code> trước Dockerfile: ở đây nó cắt ngữ cảnh từ 347 MB xuống 60 kB và chặn engine Prisma của macOS lọt sang Linux.</li>
<li>Ba stage — deps, build, runtime — giữ trình biên dịch và gói dev ngoài thứ đem đi: API 2,2 GB → 664 MB, Next.js standalone 2,63 GB → 328 MB.</li>
<li>Engine Prisma được chọn ở nơi chạy <code>prisma generate</code>; cài và chạy trên cùng một ảnh nền, coi <code>binaryTargets</code> là lưới đỡ.</li>
<li>Chạy bằng user không-root, đặt tini (hoặc một server biết bắt tín hiệu) làm PID 1, và viết HEALTHCHECK có chạm tới CSDL.</li>
<li>Đo bằng <code>docker image ls</code> và <code>docker history</code>; một tầng còn to thường có một lý do bạn nói ra được.</li>
<li>Build xanh không chứng minh ảnh chạy được — luôn chạy nó với một phụ thuộc thật trước khi đẩy lên.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/build/building/multi-stage/" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">Multi-stage builds — dựng nhiều stage</span><span class="lc-sub">Hướng dẫn chính thức về stage, <code>COPY --from</code> và <code>--target</code>.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/concepts/context/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Build context và .dockerignore</span><span class="lc-sub">Thứ gì được gửi cho bộ dựng, và cú pháp chính xác của file bỏ qua.</span></span>
</a>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-schema-reference" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Tra cứu schema Prisma — binaryTargets</span><span class="lc-sub">Mọi tên đích engine (musl, các bản OpenSSL, arm64).</span></span>
</a>
<a class="link-card" href="https://nextjs.org/docs/app/api-reference/config/next-config-js/output" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">Next.js output: standalone</span><span class="lc-sub">Thứ gì được lần vào <code>.next/standalone</code> và thứ gì bạn phải tự chép.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trong Code Lab</span><span class="lc-sub">Bài tập Docker có chấm tự động.</span></span>
</a>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Ngữ cảnh dựng do <code>.dockerignore</code> quyết định, và thiếu nó thì ảnh bị nhiễm độc theo những cách lộ ra ở rất xa nguyên nhân. Cài và chạy trên cùng một ảnh nền. Và cái ảnh chỉ xong khi nó trả lời được một request thật, không phải khi build chuyển xanh.</p>
</div>
`,
    },
    /* ─────────────────────────── 16.2 ─────────────────────────── */
    {
      title: '16.2 — Compose for development and for production|||16.2 — Compose cho dev và cho prod',
      slug: 'dk-16-2-compose-dev-prod',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một compose.yaml nền dùng chung, một file dev tự nạp (build target dev, watch, Mailpit, cổng loopback) và một file prod gọi tên (restart, trần RAM, xoay log); hai mạng front/back, migrate chạy một lần trước API, và kiểm mọi thứ bằng docker inspect.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.2</span>
<h2>Compose for development and for production</h2>
<p class="lead">You now have two images. The same six services must run in two very different places: on your laptop, where you want to save a file and see the change in two seconds and read every e-mail the app sends; and on a 2 GB VPS, where nothing may be rebuilt, nothing may listen on a port it does not need, and a container that dies must come back on its own. This lesson writes that as three Compose files and proves each promise with a command.</p>

<h3>Three files, one stack</h3>
${slide('dk-16', 9, 'Ba file compose: nền dùng chung, dev tự nạp, prod gọi tên')}
<p>The layout is the one from Lesson 9.5, applied to a real app:</p>
<table>
<tr><th>File</th><th>Holds</th><th>Loaded by</th></tr>
<tr><td><code>compose.yaml</code></td><td>Everything true in BOTH places: images, environment, healthchecks, <code>depends_on</code>, networks, volumes</td><td>every command</td></tr>
<tr><td><code>compose.override.yaml</code></td><td>Development only: <code>build</code> with <code>target: dev</code>, <code>develop.watch</code>, loopback ports, Mailpit</td><td>automatically, when you type plain <code>docker compose …</code></td></tr>
<tr><td><code>compose.prod.yaml</code></td><td>Production only: <code>restart</code>, memory limits, log rotation, nginx's port</td><td>only when named: <code>-f compose.yaml -f compose.prod.yaml</code></td></tr>
</table>
<pre><code class="language-bash"><span class="tok-comment"># laptop</span>
docker compose up -d --wait            <span class="tok-comment"># compose.yaml + compose.override.yaml</span>
<span class="tok-comment"># server</span>
docker compose -f compose.yaml -f compose.prod.yaml up -d --wait
<span class="tok-comment"># before every deploy: what will the server REALLY run?</span>
docker compose -f compose.yaml -f compose.prod.yaml config api | grep -A3 limits</code></pre>
<div class="out">        limits:
          memory: "268435456"</div>
<p>The override file must never reach the server. If someone copies the whole repository to the VPS, a plain <code>docker compose up</code> there silently merges development settings into production. That is why the deploy in Lesson 16.3 copies only the files it names.</p>

<h3>The base file, block by block</h3>
<pre><code class="language-yaml">name: phongkham

services:
  nginx:
    image: nginx:1.27-alpine
    volumes:
      - ./nginx:/etc/nginx/conf.d:ro     <span class="tok-comment"># a FOLDER, not a single file (Lesson 16.4)</span>
    depends_on:
      web: { condition: service_healthy }
      api: { condition: service_healthy }
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1/healthz"]
      interval: 10s
      timeout: 3s
      retries: 3
    networks: [front]

  web:
    image: ghcr.io/nhom/phongkham-web:&#36;{TAG:-dev}
    environment:
      INTERNAL_API_URL: http://api:3000
    healthcheck:
      test: ["CMD", "wget", "-qO", "/dev/null", "http://127.0.0.1:3000/"]
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 20s
    depends_on:
      api: { condition: service_healthy }
    networks: [front]

  api:
    image: ghcr.io/nhom/phongkham-api:&#36;{TAG:-dev}
    environment:
      DATABASE_URL: postgresql://phongkham:&#36;{POSTGRES_PASSWORD:?missing}@db:5432/phongkham
      REDIS_URL: redis://cache:6379
      APP_VERSION: &#36;{TAG:-dev}
      JWT_SECRET: &#36;{JWT_SECRET:?missing}
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3000/health"]
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 15s
    depends_on:
      db: { condition: service_healthy }
      cache: { condition: service_healthy }
      migrate: { condition: service_completed_successfully }
    networks: [front, back]

  migrate:
    image: ghcr.io/nhom/phongkham-api:&#36;{TAG:-dev}
    command: ["./node_modules/.bin/prisma", "migrate", "deploy"]
    environment:
      DATABASE_URL: postgresql://phongkham:&#36;{POSTGRES_PASSWORD}@db:5432/phongkham
    depends_on:
      db: { condition: service_healthy }
    restart: "no"
    networks: [back]

  db:
    image: postgres:16.4-alpine
    environment:
      POSTGRES_USER: phongkham
      POSTGRES_PASSWORD: &#36;{POSTGRES_PASSWORD}
      POSTGRES_DB: phongkham
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U phongkham -d phongkham"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s
    networks: [back]

  cache:
    image: redis:7.4-alpine
    command: ["redis-server", "--appendonly", "yes"]
    volumes:
      - redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 10
    networks: [back]

networks:
  front:
  back:
    internal: true

volumes:
  pgdata:
  redisdata:</code></pre>
<p>(In the measured run the project was called <code>dk16-phongkham</code> and the images lived at <code>localhost:18165/dk16-phongkham-…</code>, a local registry standing in for GHCR — see Lesson 16.3.)</p>
<table>
<tr><th>Choice</th><th>What it buys</th></tr>
<tr><td><code>image: …:&#36;{TAG:-dev}</code></td><td>The server runs exactly the tag written in its <code>.env</code>; rollback is changing one line (Lesson 16.3).</td></tr>
<tr><td><code>&#36;{POSTGRES_PASSWORD:?missing}</code></td><td>Compose refuses to start if the variable is empty, instead of starting Postgres with an empty password (Lesson 9.4).</td></tr>
<tr><td>Healthchecks in the COMPOSE file, not only in the Dockerfile</td><td>They apply to every build target — see the pitfall below.</td></tr>
<tr><td><code>migrate</code> with <code>service_completed_successfully</code></td><td>The schema is migrated exactly once per deploy, before any API process starts; if it fails, the API never starts on a half-migrated database (Lesson 10.3).</td></tr>
<tr><td><code>command: ["./node_modules/.bin/prisma", …]</code></td><td>Calls the CLI inside the image directly; <code>npx</code> prints npm's update notice and could try to download a package if one were missing.</td></tr>
<tr><td>Named volumes <code>pgdata</code>, <code>redisdata</code></td><td>Data survives <code>docker compose down</code>; only <code>down -v</code> deletes it (Lesson 7.1).</td></tr>
<tr><td><code>--appendonly yes</code> for Redis</td><td>The cache comes back after a restart; skip it if yours is truly disposable.</td></tr>
</table>

<h3>Two networks: nginx cannot see the database, the database cannot see the Internet</h3>
${slide('dk-16', 10, 'Hai mạng: nginx không thấy db, db không ra được Internet')}
<p>A service name resolves only on a network both containers share (Lesson 8.3). So splitting the stack into <code>front</code> (nginx, web, api) and <code>back</code> (api, migrate, db, cache) writes your security policy as something Docker enforces, not something you promise. <code>internal: true</code> on <code>back</code> goes one step further: that network has no route out at all.</p>
<pre><code class="language-bash">docker compose exec nginx wget -qO- -T 3 http://db:5432
docker compose exec db wget -qO- -T 3 http://example.com
docker compose exec api wget -qO- http://127.0.0.1:3000/health
docker network inspect phongkham_back -f 'internal={{.Internal}}'</code></pre>
<div class="out">wget: bad address 'db:5432'
wget: bad address 'example.com'
{"ok":true,"version":"4679b20"}
internal=true</div>
<p>nginx cannot even resolve <code>db</code>. The database cannot resolve anything outside, so a compromised Postgres extension cannot phone home. The API, sitting on both networks, is the only bridge — and it reports itself healthy with its version.</p>

<h3>Start-up order is decided by healthchecks, not by the order in the file</h3>
${slide('dk-16', 11, 'Thứ tự khởi động do healthcheck quyết định, không do thứ tự trong file')}
<p><code>docker compose up -d --wait</code> starts everything that can start, then waits until every service is healthy (or, for one-shot services, has exited successfully), and returns a non-zero exit code if any is not. The chain for this stack, as <code>--wait</code> printed it on the laptop (the <code>Waiting</code>/<code>Running</code> lines are left out):</p>
<div class="out"> Container dk16-phongkham-db-1 Healthy
 Container dk16-phongkham-migrate-1 Starting
 Container dk16-phongkham-migrate-1 Started
 Container dk16-phongkham-db-1 Healthy
 Container dk16-phongkham-cache-1 Healthy
 Container dk16-phongkham-migrate-1 Exited
 Container dk16-phongkham-api-1 Starting
 Container dk16-phongkham-api-1 Started
 Container dk16-phongkham-api-1 Healthy
 Container dk16-phongkham-web-1 Starting
 Container dk16-phongkham-web-1 Started
 Container dk16-phongkham-api-1 Healthy
 Container dk16-phongkham-web-1 Healthy
 Container dk16-phongkham-nginx-1 Starting
 Container dk16-phongkham-nginx-1 Started
 …
docker compose up -d --wait  … 25.558 total</div>
<p>Twenty-five and a half seconds with images already built; the first production start on the rehearsal "VPS", including pulls from the registry, took 29.2 seconds. nginx starts last for a reason: it resolves <code>web</code> and <code>api</code> when it loads its configuration, and exits with <code>host not found in upstream</code> if they do not exist yet.</p>
<div class="pitfall co-tieu-de"><strong>The first dev run failed: "has no healthcheck configured".</strong> The very first <code>docker compose up -d --build --wait</code> for this chapter ended like this:
<div class="out"> Container dk16-phongkham-migrate-1 Exited
 Container dk16-phongkham-api-1 Waiting
 Container dk16-phongkham-api-1 Error dependency api failed to start
dependency failed to start: container dk16-phongkham-api-1 has no healthcheck configured</div>
<p>The Dockerfile HAS a <code>HEALTHCHECK</code> — in the <code>runtime</code> stage. The development override builds <code>target: dev</code>, which stops before that line, so the dev image has no healthcheck and <code>web</code>'s <code>condition: service_healthy</code> can never be satisfied. Moving the healthcheck into <code>compose.yaml</code> fixed it for every target at once. Rule: a healthcheck that other services depend on belongs in the Compose file.</p></div>

<h3>Development: save a file, see the change; every e-mail goes to Mailpit</h3>
${slide('dk-16', 12, 'Dev: Lưu file → API chạy mã mới sau 1,8 giây; thư đi vào Mailpit')}
<pre><code class="language-yaml"><span class="tok-comment"># compose.override.yaml — loaded automatically by plain "docker compose"</span>
services:
  api:
    build: { context: ./api, target: dev }
    environment:
      SMTP_HOST: mailpit
      SMTP_PORT: "1025"
    ports: ["127.0.0.1:18162:3000"]
    develop:
      watch:
        - action: sync
          path: ./api/src
          target: /app/src
        - action: rebuild
          path: ./api/package.json

  web:
    build: { context: ./web, target: dev }
    ports: ["127.0.0.1:18161:3000"]
    develop:
      watch:
        - action: sync
          path: ./web/app
          target: /app/app
        - action: rebuild
          path: ./web/package.json

  migrate:
    build: { context: ./api, target: dev }

  nginx:
    ports: ["127.0.0.1:18160:80"]

  mailpit:
    image: axllent/mailpit:v1.27
    ports: ["127.0.0.1:18163:8025"]
    networks: [front]</code></pre>
<p>Three development-only ideas (Chapter 13 covers each in depth). <code>target: dev</code> builds the stage that has the source and the compiler; its command runs <code>tsc -w</code> and <code>node --watch</code> side by side. <code>develop.watch</code> with <code>action: sync</code> copies a changed file into the running container (no bind mount, so no <code>node_modules</code> clash between macOS and Linux), and <code>action: rebuild</code> rebuilds the image when dependencies change. And <code>SMTP_HOST: mailpit</code> sends every e-mail to a fake mail server with a web inbox, so the app can never mail a real patient from a laptop. Every port is bound to <code>127.0.0.1</code>: the classroom Wi-Fi cannot reach your API.</p>
<pre><code class="language-bash">docker compose watch --no-up
<span class="tok-comment"># edit api/src/index.ts, save</span>
docker compose logs api --since 30s
curl -s 127.0.0.1:18163/api/v1/messages | jq -r '.messages[] | "\\(.Subject) | \\(.From.Address) -&gt; \\(.To[0].Address)"'</code></pre>
<div class="out">Watch enabled
Syncing service "api" after 2 changes were detected
api-1  | 1:13:40 AM - File change detected. Starting incremental compilation...
api-1  | 1:13:40 AM - Found 0 errors. Watching for file changes.
api-1  | Restarting 'dist/index.js'
api-1  | SIGTERM — đóng server
api-1  | api dev nghe cổng 3000
Đã đặt lịch #7 | phongkham@example.test -&gt; benhnhan@example.test</div>
<p>From saving the file to <code>curl</code> seeing the new response: <strong>1.82 seconds</strong>, measured with a polling loop. (Notice the <code>1:13:40 AM</code>: it was 08:13 in Hanoi. The container lives in UTC — incident 8 in Lesson 16.4.)</p>
<div class="callout warn"><strong>Switching the same project from dev to prod leaves an orphan.</strong> Both setups share the project name, so after the dev run, starting the production files printed:
<div class="out">level=warning msg="Found orphan containers (dk16-phongkham-mailpit-1) for this project. If you removed or renamed this service in your compose file, you can run this command with the --remove-orphans flag to clean it up."</div>
Mailpit is not in the production files, so Compose leaves it running rather than guess. Add <code>--remove-orphans</code>, or give dev and prod different project names (<code>-p phongkham-dev</code>).</div>

<h3>Production: write it once, then check that Docker applied it</h3>
${slide('dk-16', 13, 'Prod: viết một lần trong compose.prod.yaml, kiểm lại bằng docker inspect')}
<pre><code class="language-yaml"><span class="tok-comment"># compose.prod.yaml — docker compose -f compose.yaml -f compose.prod.yaml …</span>
x-log: &amp;log
  driver: json-file
  options: { max-size: "10m", max-file: "3" }

services:
  nginx:
    ports: ["127.0.0.1:18160:80"]     <span class="tok-comment"># real VPS: "80:80" and "443:443"</span>
    restart: unless-stopped
    logging: *log
  web:
    restart: unless-stopped
    deploy: { resources: { limits: { memory: 256m } } }
    logging: *log
  api:
    restart: unless-stopped
    deploy: { resources: { limits: { memory: 256m } } }
    logging: *log
  migrate:
    logging: *log
  db:
    restart: unless-stopped
    deploy: { resources: { limits: { memory: 512m } } }
    logging: *log
  cache:
    restart: unless-stopped
    deploy: { resources: { limits: { memory: 128m } } }
    logging: *log</code></pre>
<table>
<tr><th>Key</th><th>Meaning</th><th>Chapter</th></tr>
<tr><td><code>x-log: &amp;log</code> … <code>logging: *log</code></td><td>A YAML anchor: write the log settings once, reuse them six times. Keys starting with <code>x-</code> are ignored by Compose, so they are free for this.</td><td>9.5</td></tr>
<tr><td><code>max-size: "10m"</code>, <code>max-file: "3"</code></td><td>At most 30 MB of logs per container. Without it a chatty container fills the disk (Lesson 11.3).</td><td>11.3</td></tr>
<tr><td><code>restart: unless-stopped</code></td><td>Restarted after a crash and after a reboot, unless you stopped it yourself. Not on <code>migrate</code>: a one-shot job must not loop.</td><td>11.1</td></tr>
<tr><td><code>deploy.resources.limits.memory</code></td><td>A hard ceiling; crossing it ends in exit 137. Pick it from <code>docker stats</code> under load, not by guessing.</td><td>11.2</td></tr>
<tr><td>Only nginx has <code>ports:</code></td><td>One door. The database has no <code>ports:</code> at all (Lesson 16.4 shows why).</td><td>8.2</td></tr>
</table>
<p>"It is in the YAML" is not "it is in effect". Two seconds with <code>docker inspect</code> settle it:</p>
<pre><code class="language-bash">for c in api web db cache nginx; do
  docker inspect -f '{{.Name}} mem={{.HostConfig.Memory}} restart={{.HostConfig.RestartPolicy.Name}} log={{.HostConfig.LogConfig.Type}} {{index .HostConfig.LogConfig.Config "max-size"}}x{{index .HostConfig.LogConfig.Config "max-file"}}' phongkham-$c-1
done</code></pre>
<div class="out">/dk16-phongkham-api-1 mem=268435456 restart=unless-stopped log=json-file 10mx3
/dk16-phongkham-web-1 mem=268435456 restart=unless-stopped log=json-file 10mx3
/dk16-phongkham-db-1 mem=536870912 restart=unless-stopped log=json-file 10mx3
/dk16-phongkham-cache-1 mem=134217728 restart=unless-stopped log=json-file 10mx3
/dk16-phongkham-nginx-1 mem=0 restart=unless-stopped log=json-file 10mx3</div>
<p>268435456 bytes is exactly 256 MiB; <code>mem=0</code> on nginx means "no limit", which is deliberate — it uses a few megabytes. On a 2 GB VPS these limits add up to 1.15 GB, leaving room for the operating system and for <code>docker pull</code> during a deploy.</p>

<h3>.env and .env.example: what goes where</h3>
<pre><code><span class="tok-comment"># .env.example — committed, a template with no real values</span>
POSTGRES_PASSWORD=doi-mat-khau-nay
JWT_SECRET=doi-bi-mat-nay
TAG=dev</code></pre>
<p>Compose reads <code>.env</code> in the project folder to fill in <code>&#36;{…}</code> in the YAML — and only for that. A variable in <code>.env</code> reaches a container only if the YAML passes it (<code>environment:</code> or <code>env_file:</code>). That distinction caused a real failed deploy in this chapter (Lesson 16.4, incident 7). On the server, <code>.env</code> lives only on the server, is readable only by the deploy user (<code>chmod 600</code>), and never enters git or an image.</p>

<h3>Step by step</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1 · read the merged dev config</span><span class="lz-t">docker compose config --services</span><span class="lz-d">Should list mailpit: the override was loaded.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2 · read the merged prod config</span><span class="lz-t">docker compose -f compose.yaml -f compose.prod.yaml config --services</span><span class="lz-d">No mailpit: the override was NOT loaded.</span></div>
  <div class="lz-step"><span class="lz-k">Step 3 · start dev and wait</span><span class="lz-t">docker compose up -d --build --wait &amp;&amp; docker compose ps</span><span class="lz-d">Every service healthy, migrate Exited (0).</span></div>
  <div class="lz-step"><span class="lz-k">Step 4 · prove the network policy</span><span class="lz-t">docker compose exec nginx wget -qO- -T 3 http://db:5432</span><span class="lz-d">bad address: nginx cannot see the database.</span></div>
  <div class="lz-step"><span class="lz-k">Step 5 · switch to prod and check the limits</span><span class="lz-t">docker compose -f compose.yaml -f compose.prod.yaml up -d --wait --remove-orphans</span><span class="lz-d">Then the docker inspect loop above.</span></div>
</div>

<h3>When to split into files — and when not</h3>
<table>
<tr><th>Situation</th><th>Do this</th></tr>
<tr><td>One team, one laptop setup, one server</td><td>Base + override + prod, exactly as above.</td></tr>
<tr><td>A throwaway demo that lives for a week</td><td>One <code>compose.yaml</code> is fine; add <code>restart</code> and log rotation to it directly.</td></tr>
<tr><td>Staging and production that differ only in domain and tag</td><td>Same files, different <code>.env</code> — not a fourth YAML.</td></tr>
<tr><td>Dev needs services prod never has (Mailpit, Adminer)</td><td>Put them in the override, or behind a profile (Lesson 9.4).</td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your group's <code>compose.yaml</code> is a single file with <code>ports: ["5432:5432"]</code> on Postgres, <code>build:</code> on every service, and no healthchecks. The lecturer's VPS has 2 GB of RAM and will run it for the whole semester.</p><ol>
<li>Split it into <code>compose.yaml</code> (images, env, healthchecks, networks, volumes), <code>compose.override.yaml</code> (build, watch, loopback ports) and <code>compose.prod.yaml</code> (restart, memory, log rotation).</li>
<li>Remove Postgres' <code>ports:</code> and put db and cache on an <code>internal: true</code> network; keep the API on both networks.</li>
<li>Add a one-shot <code>migrate</code> service and make the API depend on it with <code>service_completed_successfully</code>.</li>
<li>Run <code>docker compose -f compose.yaml -f compose.prod.yaml up -d --wait</code> and the <code>docker inspect</code> loop.</li></ol>
<p><strong>Done when:</strong> <code>--wait</code> returns 0; <code>config --services</code> differs between dev and prod; <code>docker compose ps</code> shows no <code>0.0.0.0</code> port except the web entry point; nginx gets <code>bad address</code> for <code>db</code>; and <code>docker inspect</code> shows your memory limits and <code>10mx3</code> on every service.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Override file</span><span class="v"><code>compose.override.yaml</code>, merged automatically on top of <code>compose.yaml</code> unless you pass <code>-f</code>.</span></div>
  <div class="kv"><span class="k">Build target</span><span class="v">The stage of a multi-stage Dockerfile that a build stops at.</span></div>
  <div class="kv"><span class="k">Internal network</span><span class="v">A Docker network with no route to the outside; published ports on it are ignored.</span></div>
  <div class="kv"><span class="k">One-shot service</span><span class="v">A service that does one job and exits, like <code>migrate</code>; others wait with <code>service_completed_successfully</code>.</span></div>
  <div class="kv"><span class="k">YAML anchor / extension field</span><span class="v"><code>&amp;name</code> … <code>*name</code> reuses a block; <code>x-…</code> keys are ignored by Compose.</span></div>
  <div class="kv"><span class="k">Log rotation</span><span class="v">Capping log files by size and count so they cannot fill the disk.</span></div>
  <div class="kv"><span class="k">Orphan container</span><span class="v">A container of the project whose service is no longer in the files you passed.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Base, dev override and prod file keep one truth for both places and make the differences explicit.</li>
<li>Two networks turn "the web must not reach the database" into something Docker enforces; <code>internal: true</code> also cuts the Internet.</li>
<li>Healthchecks that others depend on belong in the Compose file, so they work for every build target.</li>
<li>A one-shot <code>migrate</code> service runs before the API; <code>up --wait</code> fails loudly if anything is not healthy.</li>
<li>Development gets <code>watch</code> (1.82 s from save to response), Mailpit and loopback-only ports.</li>
<li>Production gets restart policies, memory limits and log rotation — and a <code>docker inspect</code> that proves they are applied.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/compose/how-tos/multiple-compose-files/merge/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Merge Compose files</span><span class="lc-sub">How <code>compose.override.yaml</code> and <code>-f</code> files are merged, key by key.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/production/" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">Use Compose in production</span><span class="lc-sub">Docker's own checklist for the production file.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/file-watch/" target="_blank" rel="noopener">
  <span class="lc-ico">👀</span>
  <span class="lc-body"><span class="lc-title">Compose Watch</span><span class="lc-sub"><code>sync</code>, <code>rebuild</code>, <code>sync+restart</code> and their rules.</span></span>
</a>
<a class="link-card" href="https://mailpit.axllent.org/" target="_blank" rel="noopener">
  <span class="lc-ico">📮</span>
  <span class="lc-body"><span class="lc-title">Mailpit</span><span class="lc-sub">The fake SMTP server and inbox used in development.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practise in Code Lab</span><span class="lc-sub">Docker exercises with automatic grading.</span></span>
</a>
<p class="note-ct"><strong>Three things to remember.</strong> One base file, one development override that loads itself, one production file you name on purpose. Put healthchecks where every target sees them and let <code>--wait</code> judge the start-up. And never trust a limit you have not read back with <code>docker inspect</code>.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.2</span>
<h2>Compose cho dev và cho prod</h2>
<p class="lead">Giờ bạn có hai cái ảnh. Cùng sáu dịch vụ đó phải chạy ở hai nơi rất khác nhau: trên laptop, nơi bạn muốn lưu file là hai giây sau thấy thay đổi và đọc được mọi thư app gửi đi; và trên một VPS 2 GB, nơi không được dựng lại gì, không cái gì được nghe ở cổng nó không cần, và container nào chết phải tự sống lại. Bài này viết điều đó thành ba file Compose và chứng minh từng lời hứa bằng một câu lệnh.</p>

<h3>Ba file, một stack</h3>
${slide('dk-16', 9, 'Ba file compose: nền dùng chung, dev tự nạp, prod gọi tên')}
<p>Bố cục lấy đúng từ Bài 9.5, áp vào một app thật:</p>
<table>
<tr><th>File</th><th>Chứa</th><th>Được nạp khi</th></tr>
<tr><td><code>compose.yaml</code></td><td>Mọi thứ đúng ở CẢ HAI nơi: ảnh, biến môi trường, healthcheck, <code>depends_on</code>, mạng, volume</td><td>mọi lệnh</td></tr>
<tr><td><code>compose.override.yaml</code></td><td>Chỉ cho dev: <code>build</code> với <code>target: dev</code>, <code>develop.watch</code>, cổng loopback, Mailpit</td><td>tự động, khi bạn gõ <code>docker compose …</code> trơn</td></tr>
<tr><td><code>compose.prod.yaml</code></td><td>Chỉ cho prod: <code>restart</code>, trần bộ nhớ, xoay log, cổng của nginx</td><td>chỉ khi gọi tên: <code>-f compose.yaml -f compose.prod.yaml</code></td></tr>
</table>
<pre><code class="language-bash"><span class="tok-comment"># laptop</span>
docker compose up -d --wait            <span class="tok-comment"># compose.yaml + compose.override.yaml</span>
<span class="tok-comment"># máy chủ</span>
docker compose -f compose.yaml -f compose.prod.yaml up -d --wait
<span class="tok-comment"># trước mỗi lần deploy: máy chủ THẬT SỰ sẽ chạy gì?</span>
docker compose -f compose.yaml -f compose.prod.yaml config api | grep -A3 limits</code></pre>
<div class="out">        limits:
          memory: "268435456"</div>
<p>File override không bao giờ được tới máy chủ. Nếu ai đó chép nguyên kho mã lên VPS, một lệnh <code>docker compose up</code> trơn ở đó sẽ lặng lẽ trộn cấu hình dev vào production. Đó là lý do lượt deploy ở Bài 16.3 chỉ chép đúng những file nó gọi tên.</p>

<h3>File nền, từng khối một</h3>
<pre><code class="language-yaml">name: phongkham

services:
  nginx:
    image: nginx:1.27-alpine
    volumes:
      - ./nginx:/etc/nginx/conf.d:ro     <span class="tok-comment"># gắn THƯ MỤC, không gắn file đơn (Bài 16.4)</span>
    depends_on:
      web: { condition: service_healthy }
      api: { condition: service_healthy }
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1/healthz"]
      interval: 10s
      timeout: 3s
      retries: 3
    networks: [front]

  web:
    image: ghcr.io/nhom/phongkham-web:&#36;{TAG:-dev}
    environment:
      INTERNAL_API_URL: http://api:3000
    healthcheck:
      test: ["CMD", "wget", "-qO", "/dev/null", "http://127.0.0.1:3000/"]
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 20s
    depends_on:
      api: { condition: service_healthy }
    networks: [front]

  api:
    image: ghcr.io/nhom/phongkham-api:&#36;{TAG:-dev}
    environment:
      DATABASE_URL: postgresql://phongkham:&#36;{POSTGRES_PASSWORD:?thiếu}@db:5432/phongkham
      REDIS_URL: redis://cache:6379
      APP_VERSION: &#36;{TAG:-dev}
      JWT_SECRET: &#36;{JWT_SECRET:?thiếu}
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3000/health"]
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 15s
    depends_on:
      db: { condition: service_healthy }
      cache: { condition: service_healthy }
      migrate: { condition: service_completed_successfully }
    networks: [front, back]

  migrate:
    image: ghcr.io/nhom/phongkham-api:&#36;{TAG:-dev}
    command: ["./node_modules/.bin/prisma", "migrate", "deploy"]
    environment:
      DATABASE_URL: postgresql://phongkham:&#36;{POSTGRES_PASSWORD}@db:5432/phongkham
    depends_on:
      db: { condition: service_healthy }
    restart: "no"
    networks: [back]

  db:
    image: postgres:16.4-alpine
    environment:
      POSTGRES_USER: phongkham
      POSTGRES_PASSWORD: &#36;{POSTGRES_PASSWORD}
      POSTGRES_DB: phongkham
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U phongkham -d phongkham"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s
    networks: [back]

  cache:
    image: redis:7.4-alpine
    command: ["redis-server", "--appendonly", "yes"]
    volumes:
      - redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 10
    networks: [back]

networks:
  front:
  back:
    internal: true

volumes:
  pgdata:
  redisdata:</code></pre>
<p>(Trong lượt đo thật, dự án tên là <code>dk16-phongkham</code> và ảnh nằm ở <code>localhost:18165/dk16-phongkham-…</code> — một registry cục bộ đóng vai GHCR, xem Bài 16.3.)</p>
<table>
<tr><th>Lựa chọn</th><th>Mua được gì</th></tr>
<tr><td><code>image: …:&#36;{TAG:-dev}</code></td><td>Máy chủ chạy đúng cái tag ghi trong <code>.env</code> của nó; quay lui là đổi một dòng (Bài 16.3).</td></tr>
<tr><td><code>&#36;{POSTGRES_PASSWORD:?thiếu}</code></td><td>Compose từ chối khởi động nếu biến rỗng, thay vì dựng Postgres với mật khẩu rỗng (Bài 9.4).</td></tr>
<tr><td>Healthcheck trong file COMPOSE, không chỉ trong Dockerfile</td><td>Áp cho mọi target build — xem cái bẫy bên dưới.</td></tr>
<tr><td><code>migrate</code> với <code>service_completed_successfully</code></td><td>Schema được migrate đúng một lần mỗi lượt deploy, trước khi có bất kỳ tiến trình API nào; nếu hỏng, API không bao giờ khởi động trên một CSDL migrate dở (Bài 10.3).</td></tr>
<tr><td><code>command: ["./node_modules/.bin/prisma", …]</code></td><td>Gọi thẳng CLI có sẵn trong ảnh; <code>npx</code> in thông báo cập nhật của npm và có thể tự tải gói nếu thiếu.</td></tr>
<tr><td>Volume có tên <code>pgdata</code>, <code>redisdata</code></td><td>Dữ liệu sống qua <code>docker compose down</code>; chỉ <code>down -v</code> mới xoá (Bài 7.1).</td></tr>
<tr><td><code>--appendonly yes</code> cho Redis</td><td>Cache quay lại sau khi khởi động lại; bỏ đi nếu cache của bạn đúng là dùng-xong-vứt.</td></tr>
</table>

<h3>Hai mạng: nginx không thấy CSDL, CSDL không thấy Internet</h3>
${slide('dk-16', 10, 'Hai mạng: nginx không thấy db, db không ra được Internet')}
<p>Tên dịch vụ chỉ phân giải được trên mạng mà cả hai container cùng ở (Bài 8.3). Nên chia stack thành <code>front</code> (nginx, web, api) và <code>back</code> (api, migrate, db, cache) là viết chính sách bảo mật thành thứ Docker THI HÀNH, chứ không phải thứ bạn hứa. <code>internal: true</code> trên <code>back</code> đi thêm một bước: mạng đó hoàn toàn không có đường ra ngoài.</p>
<pre><code class="language-bash">docker compose exec nginx wget -qO- -T 3 http://db:5432
docker compose exec db wget -qO- -T 3 http://example.com
docker compose exec api wget -qO- http://127.0.0.1:3000/health
docker network inspect phongkham_back -f 'internal={{.Internal}}'</code></pre>
<div class="out">wget: bad address 'db:5432'
wget: bad address 'example.com'
{"ok":true,"version":"4679b20"}
internal=true</div>
<p>nginx thậm chí không phân giải được <code>db</code>. CSDL không phân giải được gì bên ngoài, nên một extension Postgres bị chiếm quyền cũng không "gọi về nhà" được. API, đứng trên cả hai mạng, là cây cầu duy nhất — và nó tự báo khoẻ kèm phiên bản.</p>

<h3>Thứ tự khởi động do healthcheck quyết định, không do thứ tự trong file</h3>
${slide('dk-16', 11, 'Thứ tự khởi động do healthcheck quyết định, không do thứ tự trong file')}
<p><code>docker compose up -d --wait</code> khởi động mọi thứ có thể khởi động, rồi chờ tới khi mọi dịch vụ healthy (hoặc, với dịch vụ chạy-một-lần, đã thoát thành công), và trả mã thoát khác 0 nếu có cái nào không đạt. Chuỗi của stack này, đúng như <code>--wait</code> in ra trên laptop (đã lược các dòng <code>Waiting</code>/<code>Running</code>):</p>
<div class="out"> Container dk16-phongkham-db-1 Healthy
 Container dk16-phongkham-migrate-1 Starting
 Container dk16-phongkham-migrate-1 Started
 Container dk16-phongkham-db-1 Healthy
 Container dk16-phongkham-cache-1 Healthy
 Container dk16-phongkham-migrate-1 Exited
 Container dk16-phongkham-api-1 Starting
 Container dk16-phongkham-api-1 Started
 Container dk16-phongkham-api-1 Healthy
 Container dk16-phongkham-web-1 Starting
 Container dk16-phongkham-web-1 Started
 Container dk16-phongkham-api-1 Healthy
 Container dk16-phongkham-web-1 Healthy
 Container dk16-phongkham-nginx-1 Starting
 Container dk16-phongkham-nginx-1 Started
 …
docker compose up -d --wait  … 25.558 total</div>
<p>Hai mươi lăm giây rưỡi khi ảnh đã dựng sẵn; lần khởi động production đầu tiên trên "VPS" diễn tập, tính cả kéo ảnh từ registry, mất 29,2 giây. nginx khởi động cuối có lý do: nó phân giải <code>web</code> và <code>api</code> lúc nạp cấu hình, và thoát với <code>host not found in upstream</code> nếu hai tên đó chưa tồn tại.</p>
<div class="pitfall co-tieu-de"><strong>Lần chạy dev đầu tiên hỏng: "has no healthcheck configured".</strong> Lệnh <code>docker compose up -d --build --wait</code> đầu tiên của chương này kết thúc như sau:
<div class="out"> Container dk16-phongkham-migrate-1 Exited
 Container dk16-phongkham-api-1 Waiting
 Container dk16-phongkham-api-1 Error dependency api failed to start
dependency failed to start: container dk16-phongkham-api-1 has no healthcheck configured</div>
<p>Dockerfile CÓ <code>HEALTHCHECK</code> — ở stage <code>runtime</code>. File override của dev build <code>target: dev</code>, dừng trước dòng đó, nên ảnh dev không có healthcheck và điều kiện <code>condition: service_healthy</code> của <code>web</code> không bao giờ thoả được. Chuyển healthcheck vào <code>compose.yaml</code> sửa được cho mọi target cùng lúc. Luật: healthcheck mà dịch vụ khác phụ thuộc vào thì thuộc về file Compose.</p></div>

<h3>Dev: lưu file là thấy thay đổi; mọi thư đi vào Mailpit</h3>
${slide('dk-16', 12, 'Dev: Lưu file → API chạy mã mới sau 1,8 giây; thư đi vào Mailpit')}
<pre><code class="language-yaml"><span class="tok-comment"># compose.override.yaml — tự nạp khi gõ "docker compose" trơn</span>
services:
  api:
    build: { context: ./api, target: dev }
    environment:
      SMTP_HOST: mailpit
      SMTP_PORT: "1025"
    ports: ["127.0.0.1:18162:3000"]
    develop:
      watch:
        - action: sync
          path: ./api/src
          target: /app/src
        - action: rebuild
          path: ./api/package.json

  web:
    build: { context: ./web, target: dev }
    ports: ["127.0.0.1:18161:3000"]
    develop:
      watch:
        - action: sync
          path: ./web/app
          target: /app/app
        - action: rebuild
          path: ./web/package.json

  migrate:
    build: { context: ./api, target: dev }

  nginx:
    ports: ["127.0.0.1:18160:80"]

  mailpit:
    image: axllent/mailpit:v1.27
    ports: ["127.0.0.1:18163:8025"]
    networks: [front]</code></pre>
<p>Ba ý chỉ dành cho dev (Chương 13 đào sâu từng ý). <code>target: dev</code> build stage có mã nguồn và trình biên dịch; lệnh của nó chạy <code>tsc -w</code> và <code>node --watch</code> song song. <code>develop.watch</code> với <code>action: sync</code> chép file vừa đổi vào container đang chạy (không bind mount, nên không có chuyện <code>node_modules</code> của macOS đụng Linux), còn <code>action: rebuild</code> dựng lại ảnh khi phụ thuộc thay đổi. Và <code>SMTP_HOST: mailpit</code> gửi mọi thư tới một máy chủ thư giả có hộp thư trên web, nên app không bao giờ lỡ gửi thư cho bệnh nhân thật từ laptop. Mọi cổng đều gắn vào <code>127.0.0.1</code>: Wi-Fi phòng học không với tới API của bạn được.</p>
<pre><code class="language-bash">docker compose watch --no-up
<span class="tok-comment"># sửa api/src/index.ts, lưu</span>
docker compose logs api --since 30s
curl -s 127.0.0.1:18163/api/v1/messages | jq -r '.messages[] | "\\(.Subject) | \\(.From.Address) -&gt; \\(.To[0].Address)"'</code></pre>
<div class="out">Watch enabled
Syncing service "api" after 2 changes were detected
api-1  | 1:13:40 AM - File change detected. Starting incremental compilation...
api-1  | 1:13:40 AM - Found 0 errors. Watching for file changes.
api-1  | Restarting 'dist/index.js'
api-1  | SIGTERM — đóng server
api-1  | api dev nghe cổng 3000
Đã đặt lịch #7 | phongkham@example.test -&gt; benhnhan@example.test</div>
<p>Từ lúc lưu file tới lúc <code>curl</code> thấy phản hồi mới: <strong>1,82 giây</strong>, đo bằng một vòng lặp hỏi liên tục. (Để ý <code>1:13:40 AM</code>: ở Hà Nội lúc đó là 08:13. Container sống theo giờ UTC — sự cố 8 ở Bài 16.4.)</p>
<div class="callout warn"><strong>Đổi cùng một dự án từ dev sang prod để lại một container mồ côi.</strong> Hai cấu hình dùng chung tên dự án, nên sau lượt dev, khởi động bằng file prod in ra:
<div class="out">level=warning msg="Found orphan containers (dk16-phongkham-mailpit-1) for this project. If you removed or renamed this service in your compose file, you can run this command with the --remove-orphans flag to clean it up."</div>
Mailpit không có trong file prod, nên Compose để nó chạy tiếp chứ không đoán. Thêm <code>--remove-orphans</code>, hoặc đặt tên dự án khác nhau cho dev và prod (<code>-p phongkham-dev</code>).</div>

<h3>Prod: viết một lần, rồi kiểm Docker đã áp dụng chưa</h3>
${slide('dk-16', 13, 'Prod: viết một lần trong compose.prod.yaml, kiểm lại bằng docker inspect')}
<pre><code class="language-yaml"><span class="tok-comment"># compose.prod.yaml — docker compose -f compose.yaml -f compose.prod.yaml …</span>
x-log: &amp;log
  driver: json-file
  options: { max-size: "10m", max-file: "3" }

services:
  nginx:
    ports: ["127.0.0.1:18160:80"]     <span class="tok-comment"># VPS thật: "80:80" và "443:443"</span>
    restart: unless-stopped
    logging: *log
  web:
    restart: unless-stopped
    deploy: { resources: { limits: { memory: 256m } } }
    logging: *log
  api:
    restart: unless-stopped
    deploy: { resources: { limits: { memory: 256m } } }
    logging: *log
  migrate:
    logging: *log
  db:
    restart: unless-stopped
    deploy: { resources: { limits: { memory: 512m } } }
    logging: *log
  cache:
    restart: unless-stopped
    deploy: { resources: { limits: { memory: 128m } } }
    logging: *log</code></pre>
<table>
<tr><th>Khoá</th><th>Nghĩa</th><th>Chương</th></tr>
<tr><td><code>x-log: &amp;log</code> … <code>logging: *log</code></td><td>Neo YAML (anchor): viết cấu hình log một lần, dùng lại sáu lần. Khoá bắt đầu bằng <code>x-</code> bị Compose bỏ qua, nên dùng thoải mái cho việc này.</td><td>9.5</td></tr>
<tr><td><code>max-size: "10m"</code>, <code>max-file: "3"</code></td><td>Tối đa 30 MB log mỗi container. Thiếu nó, một container lắm lời sẽ lấp đầy đĩa (Bài 11.3).</td><td>11.3</td></tr>
<tr><td><code>restart: unless-stopped</code></td><td>Tự khởi động lại sau khi sập và sau khi máy khởi động lại, trừ khi chính bạn dừng nó. Không đặt cho <code>migrate</code>: việc chạy-một-lần không được lặp vòng.</td><td>11.1</td></tr>
<tr><td><code>deploy.resources.limits.memory</code></td><td>Trần cứng; vượt là kết thúc bằng mã 137. Chọn con số từ <code>docker stats</code> lúc có tải, đừng đoán.</td><td>11.2</td></tr>
<tr><td>Chỉ nginx có <code>ports:</code></td><td>Một cửa. CSDL hoàn toàn không có <code>ports:</code> (Bài 16.4 chỉ ra vì sao).</td><td>8.2</td></tr>
</table>
<p>"Có trong YAML" chưa phải "đang có hiệu lực". Hai giây với <code>docker inspect</code> là trả lời dứt khoát:</p>
<pre><code class="language-bash">for c in api web db cache nginx; do
  docker inspect -f '{{.Name}} mem={{.HostConfig.Memory}} restart={{.HostConfig.RestartPolicy.Name}} log={{.HostConfig.LogConfig.Type}} {{index .HostConfig.LogConfig.Config "max-size"}}x{{index .HostConfig.LogConfig.Config "max-file"}}' phongkham-$c-1
done</code></pre>
<div class="out">/dk16-phongkham-api-1 mem=268435456 restart=unless-stopped log=json-file 10mx3
/dk16-phongkham-web-1 mem=268435456 restart=unless-stopped log=json-file 10mx3
/dk16-phongkham-db-1 mem=536870912 restart=unless-stopped log=json-file 10mx3
/dk16-phongkham-cache-1 mem=134217728 restart=unless-stopped log=json-file 10mx3
/dk16-phongkham-nginx-1 mem=0 restart=unless-stopped log=json-file 10mx3</div>
<p>268435456 byte đúng bằng 256 MiB; <code>mem=0</code> ở nginx nghĩa là "không giới hạn", cố ý — nó chỉ dùng vài MB. Trên VPS 2 GB, các trần này cộng lại 1,15 GB, còn chỗ cho hệ điều hành và cho <code>docker pull</code> trong lúc deploy.</p>

<h3>.env và .env.example: cái gì nằm đâu</h3>
<pre><code><span class="tok-comment"># .env.example — có commit, là mẫu, không có giá trị thật</span>
POSTGRES_PASSWORD=doi-mat-khau-nay
JWT_SECRET=doi-bi-mat-nay
TAG=dev</code></pre>
<p>Compose đọc <code>.env</code> trong thư mục dự án để điền vào các chỗ <code>&#36;{…}</code> trong YAML — và CHỈ để làm việc đó. Một biến nằm trong <code>.env</code> chỉ tới được container nếu YAML truyền nó vào (<code>environment:</code> hoặc <code>env_file:</code>). Khác biệt này đã gây ra một lượt deploy hỏng thật trong chương này (Bài 16.4, sự cố 7). Trên máy chủ, <code>.env</code> chỉ sống trên máy chủ, chỉ user deploy đọc được (<code>chmod 600</code>), và không bao giờ vào git hay vào ảnh.</p>

<h3>Chạy thử từng bước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1 · đọc cấu hình dev đã trộn</span><span class="lz-t">docker compose config --services</span><span class="lz-d">Phải có mailpit: file override đã được nạp.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2 · đọc cấu hình prod đã trộn</span><span class="lz-t">docker compose -f compose.yaml -f compose.prod.yaml config --services</span><span class="lz-d">Không có mailpit: file override KHÔNG được nạp.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3 · lên dev và chờ</span><span class="lz-t">docker compose up -d --build --wait &amp;&amp; docker compose ps</span><span class="lz-d">Mọi dịch vụ healthy, migrate Exited (0).</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4 · chứng minh chính sách mạng</span><span class="lz-t">docker compose exec nginx wget -qO- -T 3 http://db:5432</span><span class="lz-d">bad address: nginx không thấy CSDL.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 5 · sang prod và kiểm trần</span><span class="lz-t">docker compose -f compose.yaml -f compose.prod.yaml up -d --wait --remove-orphans</span><span class="lz-d">Rồi chạy vòng docker inspect ở trên.</span></div>
</div>

<h3>Khi nào tách thành nhiều file — và khi nào không</h3>
<table>
<tr><th>Tình huống</th><th>Làm gì</th></tr>
<tr><td>Một nhóm, một kiểu dựng trên laptop, một máy chủ</td><td>Nền + override + prod, đúng như trên.</td></tr>
<tr><td>Một bản demo dùng-xong-vứt sống một tuần</td><td>Một <code>compose.yaml</code> là đủ; thêm thẳng <code>restart</code> và xoay log vào đó.</td></tr>
<tr><td>Staging và production chỉ khác tên miền và tag</td><td>Cùng các file, khác <code>.env</code> — không cần YAML thứ tư.</td></tr>
<tr><td>Dev cần dịch vụ mà prod không bao giờ có (Mailpit, Adminer)</td><td>Đặt trong override, hoặc sau một profile (Bài 9.4).</td></tr>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> <code>compose.yaml</code> của nhóm là một file duy nhất có <code>ports: ["5432:5432"]</code> cho Postgres, <code>build:</code> ở mọi dịch vụ, và không có healthcheck nào. VPS của thầy có 2 GB RAM và sẽ chạy nó suốt học kỳ.</p><ol>
<li>Tách thành <code>compose.yaml</code> (ảnh, env, healthcheck, mạng, volume), <code>compose.override.yaml</code> (build, watch, cổng loopback) và <code>compose.prod.yaml</code> (restart, bộ nhớ, xoay log).</li>
<li>Bỏ <code>ports:</code> của Postgres và đặt db, cache vào một mạng <code>internal: true</code>; giữ API ở cả hai mạng.</li>
<li>Thêm dịch vụ <code>migrate</code> chạy-một-lần và cho API phụ thuộc vào nó bằng <code>service_completed_successfully</code>.</li>
<li>Chạy <code>docker compose -f compose.yaml -f compose.prod.yaml up -d --wait</code> và vòng lặp <code>docker inspect</code>.</li></ol>
<p><strong>Đạt khi:</strong> <code>--wait</code> trả 0; <code>config --services</code> khác nhau giữa dev và prod; <code>docker compose ps</code> không có cổng <code>0.0.0.0</code> nào ngoài lối vào web; nginx nhận <code>bad address</code> với <code>db</code>; và <code>docker inspect</code> cho thấy trần bộ nhớ của bạn cùng <code>10mx3</code> ở mọi dịch vụ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Override file (file ghi đè)</span><span class="v"><code>compose.override.yaml</code>, tự trộn lên trên <code>compose.yaml</code> trừ khi bạn truyền <code>-f</code>.</span></div>
  <div class="kv"><span class="k">Build target (đích dựng)</span><span class="v">Stage của Dockerfile nhiều stage mà một lượt build dừng lại ở đó.</span></div>
  <div class="kv"><span class="k">Internal network (mạng nội bộ kín)</span><span class="v">Mạng Docker không có đường ra ngoài; cổng công bố trên nó bị bỏ qua.</span></div>
  <div class="kv"><span class="k">One-shot service (dịch vụ chạy-một-lần)</span><span class="v">Dịch vụ làm một việc rồi thoát, như <code>migrate</code>; dịch vụ khác chờ bằng <code>service_completed_successfully</code>.</span></div>
  <div class="kv"><span class="k">YAML anchor / extension field (neo YAML / trường mở rộng)</span><span class="v"><code>&amp;tên</code> … <code>*tên</code> dùng lại một khối; khoá <code>x-…</code> bị Compose bỏ qua.</span></div>
  <div class="kv"><span class="k">Log rotation (xoay vòng log)</span><span class="v">Giới hạn file log theo kích thước và số lượng để nó không lấp đầy đĩa.</span></div>
  <div class="kv"><span class="k">Orphan container (container mồ côi)</span><span class="v">Container của dự án mà dịch vụ của nó không còn trong các file bạn truyền vào.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>File nền, file override cho dev và file prod giữ một sự thật chung cho cả hai nơi và làm các khác biệt hiện rõ ra.</li>
<li>Hai mạng biến "web không được chạm CSDL" thành thứ Docker thi hành; <code>internal: true</code> cắt luôn đường ra Internet.</li>
<li>Healthcheck mà dịch vụ khác phụ thuộc vào thì đặt trong file Compose, để nó đúng cho mọi target build.</li>
<li>Dịch vụ <code>migrate</code> chạy-một-lần chạy trước API; <code>up --wait</code> báo lỗi to nếu có gì không healthy.</li>
<li>Dev có <code>watch</code> (1,82 giây từ lúc lưu tới lúc có phản hồi mới), Mailpit và cổng chỉ nghe loopback.</li>
<li>Prod có chính sách restart, trần bộ nhớ và xoay log — cùng một lệnh <code>docker inspect</code> chứng minh chúng đang có hiệu lực.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/compose/how-tos/multiple-compose-files/merge/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Trộn nhiều file Compose</span><span class="lc-sub"><code>compose.override.yaml</code> và các file <code>-f</code> được trộn thế nào, từng khoá một.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/production/" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">Dùng Compose trên production</span><span class="lc-sub">Danh sách kiểm của chính Docker cho file production.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/compose/how-tos/file-watch/" target="_blank" rel="noopener">
  <span class="lc-ico">👀</span>
  <span class="lc-body"><span class="lc-title">Compose Watch</span><span class="lc-sub"><code>sync</code>, <code>rebuild</code>, <code>sync+restart</code> và luật của chúng.</span></span>
</a>
<a class="link-card" href="https://mailpit.axllent.org/" target="_blank" rel="noopener">
  <span class="lc-ico">📮</span>
  <span class="lc-body"><span class="lc-title">Mailpit</span><span class="lc-sub">Máy chủ SMTP giả kèm hộp thư dùng lúc phát triển.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trong Code Lab</span><span class="lc-sub">Bài tập Docker có chấm tự động.</span></span>
</a>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Một file nền, một file override cho dev tự nạp, một file prod bạn gọi tên có chủ đích. Đặt healthcheck ở chỗ mọi target đều thấy và để <code>--wait</code> phán xử lúc khởi động. Và đừng bao giờ tin một cái trần bạn chưa đọc ngược lại bằng <code>docker inspect</code>.</p>
</div>
`,
    },
    /* ─────────────────────────── 16.3 ─────────────────────────── */
    {
      title: '16.3 — Shipping it: CI builds, GHCR, deploy and rollback|||16.3 — Đưa lên: CI build, GHCR, deploy và quay lui',
      slug: 'dk-16-3-ci-ghcr-deploy',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Workflow GitHub Actions build hai kiến trúc có cache rồi đẩy GHCR theo tag commit; VPS chỉ kéo ảnh, up --wait, nạp lại nginx và smoke test; bản hỏng tự quay về tag cũ trong chưa tới 20 giây — diễn tập thật với registry cục bộ có mật khẩu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.3</span>
<h2>Shipping it: CI builds, GHCR, deploy and rollback</h2>
<p class="lead">The images work and the Compose files are right. What is left is the part that goes wrong at 11 p.m. the night before the demo: getting a new version onto the server, noticing when it is broken, and going back. This lesson builds that path so that a bad commit costs you twenty seconds of degraded service instead of an evening.</p>
<p>Two courses on this site go deeper into the tools themselves — <a href="/courses/github-actions">GitHub Actions</a> and <a href="/courses/deploy-vps">deploying to a VPS</a>. Here we stay on the Docker side: which image, with which tag, pulled and started in which order, checked how.</p>

<h3>One commit, six stations</h3>
${slide('dk-16', 14, 'Một commit đi tới production qua sáu trạm')}
<ol>
<li><strong>git push</strong> to <code>main</code>.</li>
<li><strong>GitHub Actions</strong> builds the <code>runtime</code> stage of both images for <code>linux/amd64</code> and <code>linux/arm64</code>, with a build cache stored in GitHub.</li>
<li><strong>GHCR</strong> (GitHub Container Registry) receives them under two tags: the short commit hash and <code>main</code>.</li>
<li><strong>The VPS</strong>, over SSH, checks out only the deploy files of that commit and runs <code>./deploy.sh &lt;hash&gt;</code>.</li>
<li><strong>deploy.sh</strong> pulls, runs <code>up -d --wait</code>, reloads nginx and calls <code>smoke.sh</code>.</li>
<li><strong>If anything fails</strong>, it writes the previous tag back into <code>.env</code> and starts that again.</li>
</ol>
<p>Everything except the GitHub part was run for real for this chapter. A password-protected <code>registry:2</code> on the laptop played GHCR, and a folder containing only the deploy files played the VPS. The workflow file is complete and passes <code>actionlint</code> 1.7.12, but it was not pushed to GitHub.</p>

<h3>Tag by commit, not only latest</h3>
${slide('dk-16', 16, 'Tag theo commit: một tag, hai kiến trúc, và luôn có đường quay lui')}
<pre><code class="language-bash">git log --oneline</code></pre>
<div class="out">03c9ee3 nginx: gan thu muc; deploy.sh + smoke.sh
12c9b80 compose: dua JWT_SECRET vao api
0fa642f api: bat buoc JWT_SECRET (chuan bi dang nhap)
c2f59c1 api: them GET /api/doctors
4679b20 phongkham v1: dat lich + nginx + compose</div>
<p>Every image in the rehearsal was tagged with the commit it was built from. That one habit answers three questions that <code>:latest</code> never can: <em>which code is running?</em> (<code>git show 03c9ee3</code>), <em>what do I roll back to?</em> (the previous hash, still in the registry), and <em>will tomorrow's pull give me the same thing as today's?</em> (yes — nobody moves a commit tag, Lesson 3.2). The <code>main</code> tag is kept too, as a convenient "newest" pointer for humans, but the server never deploys it.</p>
<p>Use the same length everywhere. <code>git rev-parse --short HEAD</code> usually prints 7 characters but prints more when 7 would be ambiguous in a big repository; the workflow below uses <code>&#36;{GITHUB_SHA::7}</code> (the first seven characters of the full hash) so CI and the server always agree.</p>

<h3>The workflow, block by block</h3>
${slide('dk-16', 15, 'Workflow: build hai kiến trúc có cache, rồi gọi đúng một script trên VPS')}
<pre><code class="language-yaml"><span class="tok-comment"># .github/workflows/deploy.yml</span>
name: build-and-deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: production
  cancel-in-progress: false

permissions:
  contents: read
  packages: write

env:
  IMAGE: ghcr.io/&#36;{{ github.repository_owner }}/phongkham

jobs:
  build:
    runs-on: ubuntu-24.04
    strategy:
      matrix:
        service: [api, web]
    steps:
      - uses: actions/checkout@v7
      - uses: docker/setup-qemu-action@v4
      - uses: docker/setup-buildx-action@v4
      - uses: docker/login-action@v4
        with:
          registry: ghcr.io
          username: &#36;{{ github.actor }}
          password: &#36;{{ secrets.GITHUB_TOKEN }}
      - name: Tag theo commit
        id: tag
        run: echo "sha=&#36;{GITHUB_SHA::7}" &gt;&gt; "$GITHUB_OUTPUT"
      - uses: docker/build-push-action@v7
        with:
          context: ./&#36;{{ matrix.service }}
          target: runtime
          platforms: linux/amd64,linux/arm64
          push: true
          tags: |
            &#36;{{ env.IMAGE }}-&#36;{{ matrix.service }}:&#36;{{ steps.tag.outputs.sha }}
            &#36;{{ env.IMAGE }}-&#36;{{ matrix.service }}:main
          labels: org.opencontainers.image.revision=&#36;{{ github.sha }}
          cache-from: type=gha,scope=&#36;{{ matrix.service }}
          cache-to: type=gha,mode=max,scope=&#36;{{ matrix.service }}

  deploy:
    needs: build
    runs-on: ubuntu-24.04
    environment: production
    steps:
      - name: Tag theo commit
        id: tag
        run: echo "sha=&#36;{GITHUB_SHA::7}" &gt;&gt; "$GITHUB_OUTPUT"
      - uses: appleboy/ssh-action@v1.2.5
        with:
          host: &#36;{{ secrets.VPS_HOST }}
          username: &#36;{{ secrets.VPS_USER }}
          key: &#36;{{ secrets.VPS_SSH_KEY }}
          script: |
            set -e
            cd /srv/phongkham
            git fetch --quiet origin main
            git checkout --quiet &#36;{{ github.sha }} -- compose.yaml compose.prod.yaml nginx deploy.sh smoke.sh
            ./deploy.sh &#36;{{ steps.tag.outputs.sha }}</code></pre>
<table>
<tr><th>Block</th><th>What it does and why</th></tr>
<tr><td><code>concurrency: group: production</code></td><td>Two pushes a minute apart queue up instead of racing into the server. A student project once had two deploy workflows run in parallel on every push; one recreated the backend while the other was still starting it, and the API went down with <code>Exited (137)</code> and orphan containers.</td></tr>
<tr><td><code>permissions: packages: write</code></td><td>Lets the automatic <code>GITHUB_TOKEN</code> push to GHCR; no personal token stored in CI.</td></tr>
<tr><td><code>matrix: service: [api, web]</code></td><td>The two images build in parallel jobs.</td></tr>
<tr><td><code>setup-qemu-action</code> + <code>setup-buildx-action</code></td><td>QEMU emulates arm64 on GitHub's amd64 machines; Buildx is the BuildKit client that can build several platforms and use the GitHub cache.</td></tr>
<tr><td><code>target: runtime</code></td><td>Only the stage you ship (Lesson 16.1).</td></tr>
<tr><td><code>platforms: linux/amd64,linux/arm64</code></td><td>One tag, two architectures: the amd64 VPS and teammates' arm64 Macs pull the same name (Lesson 3.4). If nobody runs the images on arm64, drop it — emulated builds are much slower.</td></tr>
<tr><td><code>cache-to: type=gha,mode=max,scope=…</code></td><td>Layers are cached in GitHub's cache service, every stage included (<code>mode=max</code>); separate <code>scope</code>s keep api and web from overwriting each other (Lesson 5.4).</td></tr>
<tr><td><code>labels: org.opencontainers.image.revision</code></td><td><code>docker inspect</code> on the server can tell you the full commit an image came from.</td></tr>
<tr><td><code>needs: build</code></td><td>A failed build never deploys.</td></tr>
<tr><td><code>environment: production</code></td><td>In the repository settings you can require a manual approval here, or restrict which branches may deploy.</td></tr>
<tr><td><code>appleboy/ssh-action@v1.2.5</code></td><td>Runs a script on the VPS over SSH with a key stored as a secret. Pinned to an exact version: it holds your server key.</td></tr>
<tr><td><code>git checkout &lt;sha&gt; -- compose.yaml … nginx …</code></td><td>The server takes ONLY the deploy files of exactly this commit — never <code>compose.override.yaml</code>, never source code. It needs a checkout of the repository with a read-only deploy key.</td></tr>
</table>
<pre><code class="language-bash">docker run --rm -v "$PWD":/repo -w /repo rhysd/actionlint:latest -color=false; echo "exit=$?"</code></pre>
<div class="out">exit=0</div>
<p><code>actionlint</code> (1.7.12, run in a container — Lesson 14.1) checks the workflow's syntax, expressions and known action inputs; no output and exit 0 means it found nothing. What it cannot check is whether the secrets exist. Before the first run, add <code>VPS_HOST</code>, <code>VPS_USER</code> and <code>VPS_SSH_KEY</code> in the repository settings. If the GHCR packages stay private, log the VPS in once with a personal access token (classic) that has only <code>read:packages</code>: <code>echo "$TOKEN" | docker login ghcr.io -u &lt;user&gt; --password-stdin</code>.</p>

<h3>One tag, two architectures — measured</h3>
<pre><code class="language-bash">time docker buildx build --platform linux/amd64,linux/arm64 --target runtime \\
  -t localhost:18165/dk16-phongkham-api:12c9b80 --push ./api
docker buildx imagetools inspect localhost:18165/dk16-phongkham-api:12c9b80</code></pre>
<div class="out">… 43.520 total
Name:      localhost:18165/dk16-phongkham-api:12c9b80
MediaType: application/vnd.oci.image.index.v1+json
Digest:    sha256:7b89179752514b9e50856f1be678e5bd4c82a30ab902f35b5aca3eed8fdb60bc

Manifests:
  Name:        localhost:18165/dk16-phongkham-api:12c9b80@sha256:584409ff930f…
  Platform:    linux/amd64

  Name:        localhost:18165/dk16-phongkham-api:12c9b80@sha256:e88a2da2ddde…
  Platform:    linux/arm64

  Name:        localhost:18165/dk16-phongkham-api:12c9b80@sha256:853285a9c754…
  Platform:    unknown/unknown
  Annotations:
    vnd.docker.reference.type:   attestation-manifest</div>
<p>The tag points to an <em>index</em> (Lesson 3.4); inside are one manifest per architecture and one attestation manifest (build provenance, Lesson 6.5 — it shows as <code>unknown/unknown</code>). On the M1, Docker Desktop's default builder built both in 43.5 seconds, with the amd64 half emulated. Each half ran its own <code>npm ci</code>, so each got its own Prisma engine — <code>linux-musl-openssl-3.0.x</code> for amd64 and <code>linux-musl-arm64-openssl-3.0.x</code> for arm64. That is exactly why the "install and run on the same base" rule works even across architectures.</p>

<h3>Rehearsing it locally: a registry with a password</h3>
<p>You can practise the whole path without touching GitHub: a <code>registry:2</code> container with an <code>htpasswd</code> file behaves like GHCR from Docker's point of view (Lesson 3.3).</p>
<pre><code class="language-bash">docker run --rm --entrypoint htpasswd httpd:2-alpine -Bbn ci ci-matkhau-thu &gt; reg-auth/htpasswd
docker run -d --name reg -p 127.0.0.1:18165:5000 -v "$PWD/reg-auth":/auth:ro \\
  -e REGISTRY_AUTH=htpasswd -e REGISTRY_AUTH_HTPASSWD_REALM=thu \\
  -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd registry:2
curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:18165/v2/
echo ci-matkhau-thu | DOCKER_CONFIG=$PWD/docker-cfg docker login localhost:18165 -u ci --password-stdin
cat docker-cfg/config.json</code></pre>
<div class="out">401
Login Succeeded
{
	"auths": {
		"localhost:18165": {}
	},
	"credsStore": "osxkeychain"
}</div>
<p>Look at the last line. The rehearsal pointed <code>DOCKER_CONFIG</code> at an empty folder precisely to keep this throw-away password out of the real configuration — and Docker still wrote <code>"credsStore": "osxkeychain"</code> and put the password into the macOS Keychain. When a config file has no credential store, the CLI picks the platform's default helper if it finds one on the <code>PATH</code> (on Docker Desktop for Mac, <code>docker-credential-osxkeychain</code>). The rehearsal ran <code>docker logout</code> with the same <code>DOCKER_CONFIG</code> straight away, which removed the Keychain entry, and then logged in again with a <code>PATH</code> that did not contain the helper. That second login printed:</p>
<div class="out">WARNING! Your credentials are stored unencrypted in '…/docker-cfg/config.json'.
Configure a credential helper to remove this warning. See
https://docs.docker.com/go/credential-store/

Login Succeeded</div>
<p>This second behaviour is what you will see on a Linux VPS or CI runner without a helper: the password, base64-encoded (not encrypted), inside <code>~/.docker/config.json</code>. That is why the VPS gets a token that can ONLY read packages, and why the file must stay <code>chmod 600</code>.</p>

<h3>The server side: a folder, a script, a smoke test</h3>
${slide('dk-16', 17, 'deploy.sh: kéo → lên → kiểm → hỏng thì tự quay về tag cũ')}
<p>On the server there is no source code — only what <code>git checkout … --</code> brought and the secrets:</p>
<pre><code class="language-bash">ls -A /srv/phongkham</code></pre>
<div class="out">.env
compose.prod.yaml
compose.yaml
deploy.sh
nginx
smoke.sh</div>
<pre><code class="language-bash">#!/bin/sh
<span class="tok-comment"># deploy.sh &lt;tag&gt; — kéo ảnh theo tag, lên, kiểm; hỏng thì tự quay về tag cũ</span>
set -u
MOI=$1
CU=$(sed -n 's/^TAG=//p' .env)
C="-f compose.yaml -f compose.prod.yaml"
dat_tag() { sed -i.bak "s/^TAG=.*/TAG=$1/" .env &amp;&amp; rm -f .env.bak; }

echo "== deploy $MOI (đang chạy: $CU)"
TAG=$MOI docker compose $C pull -q &gt;/dev/null 2&gt;&amp;1 || { echo "!! không kéo được ảnh $MOI"; exit 1; }
dat_tag "$MOI"
if docker compose $C up -d --wait --wait-timeout 90 &gt;/dev/null 2&gt;&amp;1 \\
   &amp;&amp; docker compose $C exec -T nginx nginx -t -q &amp;&amp; docker compose $C exec -T nginx nginx -s reload \\
   &amp;&amp; ./smoke.sh; then
  echo "== OK: đang chạy $MOI"
else
  echo "!! $MOI hỏng — quay lui về $CU"
  docker compose $C logs --tail 5 api
  dat_tag "$CU"
  docker compose $C up -d --wait --wait-timeout 90 &gt;/dev/null 2&gt;&amp;1 &amp;&amp; ./smoke.sh &amp;&amp; echo "== đã quay lui: đang chạy $CU"
  exit 1
fi</code></pre>
<pre><code class="language-bash">#!/bin/sh
<span class="tok-comment"># smoke.sh — mọi tuyến phải trả mã mong đợi, sai một cái là exit 1</span>
BASE=&#36;{BASE:-http://127.0.0.1:18160}
fail=0
for pair in "healthz 200" "api/slots?day=2026-10-01 200" " 200"; do
  path=&#36;{pair% *}; want=&#36;{pair##* }
  got=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/$path")
  printf '%-28s %s (cần %s)\\n' "/$path" "$got" "$want"
  [ "$got" = "$want" ] || fail=1
done
exit $fail</code></pre>
<table>
<tr><th>Step</th><th>Why in this order</th></tr>
<tr><td><code>TAG=$MOI … pull</code> BEFORE touching <code>.env</code></td><td>If the image does not exist (typo, CI still running), the script stops and the old version keeps running untouched.</td></tr>
<tr><td><code>dat_tag</code> writes the tag into <code>.env</code></td><td>So a later <code>docker compose up</code> — after a reboot, or typed by hand — starts the same version, not <code>dev</code>.</td></tr>
<tr><td><code>up -d --wait --wait-timeout 90</code></td><td>Returns non-zero if any service is not healthy within 90 seconds (Lesson 11.4).</td></tr>
<tr><td><code>nginx -t</code> then <code>nginx -s reload</code></td><td><code>up</code> does NOT recreate nginx when only its mounted configuration changed; the image did not change. Test first, then reload — a broken config is rejected and the old one stays loaded.</td></tr>
<tr><td><code>smoke.sh</code> through the public entry</td><td>"Healthy inside" is not "reachable outside". nginx's own <code>/healthz</code> says 200 even when the API is dead, so the list must include a route that goes all the way to the API.</td></tr>
<tr><td>On failure: last 5 API log lines, old tag back, <code>up --wait</code>, smoke</td><td>The log explains what broke; the rollback restores service without waiting for you.</td></tr>
</table>

<h3>A bad release, rolled back by itself</h3>
${slide('dk-16', 18, 'Bản hỏng lên, chưa tới 20 giây sau bản cũ đã chạy lại')}
<p>Commit <code>0fa642f</code> made the API refuse to start without a new <code>JWT_SECRET</code> variable, and nobody had wired that variable into the Compose file yet — a very ordinary mistake. First, what a hand-deploy without checks looks like once that image is up:</p>
<pre><code class="language-bash">docker ps --filter name=phongkham-api --format '{{.Names}} {{.Status}}'
./smoke.sh; echo smoke=$?</code></pre>
<div class="out">dk16-phongkham-api-1 Restarting (1) Less than a second ago
/healthz                     200 (cần 200)
/api/slots?day=2026-10-01    502 (cần 200)
/                            504 (cần 200)
smoke=1</div>
<p>The same release through <code>deploy.sh</code>:</p>
<pre><code class="language-bash">time ./deploy.sh 0fa642f</code></pre>
<div class="out">== deploy 0fa642f (đang chạy: c2f59c1)
!! 0fa642f hỏng — quay lui về c2f59c1
api-1  | thiếu biến môi trường JWT_SECRET — dừng
api-1  | thiếu biến môi trường JWT_SECRET — dừng
api-1  | thiếu biến môi trường JWT_SECRET — dừng
/healthz                     200 (cần 200)
/api/slots?day=2026-10-01    200 (cần 200)
/                            200 (cần 200)
== đã quay lui: đang chạy c2f59c1
./deploy.sh 0fa642f  … 19.774 total</div>
<p>Under 20 seconds from "start deploying" to "old version serving again", with the reason printed in the middle. In CI the job ends red (exit 1), which is exactly the signal you want. A manual rollback — edit <code>TAG=</code> in <code>.env</code> and <code>up -d --wait</code> — measured 13.8 seconds. The fix for this particular release came as a Compose change, not a new image (Lesson 16.4, incident 7): once <code>compose.yaml</code> passed the variable, <code>./deploy.sh 0fa642f</code> — the very same image — printed <code>== OK: đang chạy 0fa642f</code>.</p>
<div class="pitfall co-tieu-de"><strong>Rolling back the code does not roll back the database.</strong> The rollback above is safe because <code>0fa642f</code> had no migration. If a release adds a column and the old code does not mind it, going back is still fine; if a release renames or drops something, the old image will crash against the new schema, and <code>deploy.sh</code> will happily "roll back" into a second failure. Write migrations that the previous version can live with (add first, remove one release later), and take a <code>pg_dump</code> before any deploy that migrates (Lesson 16.4).</div>

<h3>CI, or a script on your own machine?</h3>
<table>
<tr><th>Build in GitHub Actions when…</th><th>Build on your own machine and push when…</th></tr>
<tr><td>several people merge to <code>main</code> and every merge should deploy the same way</td><td>you are one or two people and want to see the build happen</td></tr>
<tr><td>you want the build cache and logs kept outside any laptop</td><td>GitHub's free minutes or emulated arm64 builds are too slow for you</td></tr>
<tr><td>the lecturer or teammates need to see which commit is live</td><td>you have a strong machine at home (one student project builds on a 12-core home PC in 3–6 minutes, against about 15 on its VPS)</td></tr>
</table>
<p>Either way, keep two rules: build somewhere OTHER than the production server (a VPS that builds keeps gigabytes of build cache on the same disk as Postgres — Lesson 16.4, incident 3), and let the server do exactly one thing: pull a tag, start it, check it.</p>

<h3>Step by step</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1 · a local registry</span><span class="lz-t">docker run -d --name reg -p 127.0.0.1:5001:5000 registry:2</span><span class="lz-d">Without a password is fine for a first try; localhost is allowed over plain HTTP.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2 · build and push by commit</span><span class="lz-t">TAG=$(git rev-parse --short HEAD); docker build --target runtime -t localhost:5001/api:$TAG ./api &amp;&amp; docker push localhost:5001/api:$TAG</span><span class="lz-d">Repeat after a second commit: two tags.</span></div>
  <div class="lz-step"><span class="lz-k">Step 3 · a "server" folder</span><span class="lz-t">mkdir ../vps &amp;&amp; cp compose.yaml compose.prod.yaml deploy.sh smoke.sh ../vps/ &amp;&amp; cp -R nginx ../vps/</span><span class="lz-d">Plus a .env with TAG= and the secrets. No source code.</span></div>
  <div class="lz-step"><span class="lz-k">Step 4 · deploy the first tag</span><span class="lz-t">cd ../vps &amp;&amp; ./deploy.sh &lt;first-tag&gt;</span><span class="lz-d">== OK and three 200s.</span></div>
  <div class="lz-step"><span class="lz-k">Step 5 · deploy something broken</span><span class="lz-t">./deploy.sh &lt;broken-tag&gt;; echo $?</span><span class="lz-d">The script rolls back and exits 1.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> two days before the SWP391 demo, a teammate pushes a commit that makes the API crash at start-up. The last time this happened, the team noticed only when the lecturer opened the site. You want the server to refuse the bad version by itself.</p><ol>
<li>Run a local <code>registry:2</code> on a loopback port and push your API image under two commit tags: one good, one where you add <code>process.exit(1)</code> at start-up.</li>
<li>Create a "server" folder containing only the Compose files, <code>nginx/</code>, <code>.env</code>, <code>deploy.sh</code> and <code>smoke.sh</code>; put at least one route in <code>smoke.sh</code> that reaches the database through the API.</li>
<li>Deploy the good tag, then the broken one. Time the second with <code>time</code>.</li>
<li>Write the GitHub Actions workflow for your repository and run <code>actionlint</code> on it in a container.</li></ol>
<p><strong>Done when:</strong> the broken deploy prints the API's error, ends with the good tag serving and exit code 1; <code>grep TAG .env</code> shows the good tag again; and <code>actionlint</code> exits 0.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">GHCR (GitHub Container Registry)</span><span class="v">GitHub's image registry at <code>ghcr.io</code>; CI pushes with the automatic <code>GITHUB_TOKEN</code>.</span></div>
  <div class="kv"><span class="k">Commit tag</span><span class="v">An image tag equal to the short commit hash; it never moves, so it can always be pulled again.</span></div>
  <div class="kv"><span class="k">Image index (multi-platform)</span><span class="v">One tag that points to one manifest per architecture; each machine pulls its own.</span></div>
  <div class="kv"><span class="k">Build cache backend (gha)</span><span class="v">Where Buildx stores layers between CI runs; <code>mode=max</code> keeps every stage.</span></div>
  <div class="kv"><span class="k">Smoke test</span><span class="v">A few quick requests after a deploy that prove the main paths answer.</span></div>
  <div class="kv"><span class="k">Rollback</span><span class="v">Going back to the previous image tag; here, one line in <code>.env</code> plus <code>up --wait</code>.</span></div>
  <div class="kv"><span class="k">Credential helper (credsStore)</span><span class="v">A program that keeps registry passwords in the OS keychain instead of the config file.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Tag every image with its commit; <code>main</code> or <code>latest</code> are for humans, the server deploys hashes.</li>
<li>CI builds only the <code>runtime</code> stage, for the architectures you really run, with a scoped GitHub cache and <code>concurrency</code> so deploys never race.</li>
<li>The server keeps no source: it checks out the deploy files of one commit and runs one script.</li>
<li><code>deploy.sh</code> pulls first, then <code>up --wait</code>, reloads nginx, runs a smoke test through the front door — and restores the old tag on any failure (under 20 s measured).</li>
<li>Rehearse with a local <code>registry:2</code>, and watch where <code>docker login</code> actually puts the password.</li>
<li>Code rollback is not database rollback: keep migrations compatible with the previous release and dump before migrating.</li>
</ul>

<a class="link-card" href="https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Working with the Container registry (GHCR)</span><span class="lc-sub">Authenticating with <code>GITHUB_TOKEN</code> or a token with <code>read:packages</code>.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/ci/github-actions/multi-platform/" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">Multi-platform images with GitHub Actions</span><span class="lc-sub">Docker's official workflow with QEMU and Buildx.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/cache/backends/gha/" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">GitHub Actions cache backend</span><span class="lc-sub"><code>type=gha</code>, <code>mode=max</code> and <code>scope</code>.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/control-the-concurrency-of-workflows-and-jobs" target="_blank" rel="noopener">
  <span class="lc-ico">🚦</span>
  <span class="lc-body"><span class="lc-title">Control the concurrency of workflows</span><span class="lc-sub">How <code>concurrency</code> groups queue runs.</span></span>
</a>
<a class="link-card" href="/courses/github-actions" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">Course: GitHub Actions</span><span class="lc-sub">Workflows, secrets, environments and runners in depth.</span></span>
</a>
<a class="link-card" href="/courses/deploy-vps" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">Course: Deploy to a VPS</span><span class="lc-sub">SSH keys, users, firewalls and domains for the server side.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practise in Code Lab</span><span class="lc-sub">Docker exercises with automatic grading.</span></span>
</a>
<p class="note-ct"><strong>Three things to remember.</strong> Deploy commit tags, never "latest". Let the server only pull, start and check — build elsewhere. And make the deploy script able to put the old version back on its own, because the bad release will come on the night you are not watching.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.3</span>
<h2>Đưa lên: CI build, GHCR, deploy và quay lui</h2>
<p class="lead">Ảnh đã chạy, file Compose đã đúng. Phần còn lại là phần hay hỏng lúc 11 giờ đêm trước buổi demo: đưa bản mới lên máy chủ, nhận ra khi nó hỏng, và quay về. Bài này dựng con đường đó để một commit hỏng chỉ tốn bạn hai mươi giây dịch vụ chập chờn thay vì cả một buổi tối.</p>
<p>Hai khoá trên site đi sâu vào chính các công cụ — <a href="/courses/github-actions">GitHub Actions</a> và <a href="/courses/deploy-vps">deploy lên VPS</a>. Ở đây ta đứng ở phía Docker: ảnh nào, tag nào, kéo và khởi động theo thứ tự nào, kiểm ra sao.</p>

<h3>Một commit, sáu trạm</h3>
${slide('dk-16', 14, 'Một commit đi tới production qua sáu trạm')}
<ol>
<li><strong>git push</strong> lên <code>main</code>.</li>
<li><strong>GitHub Actions</strong> build stage <code>runtime</code> của cả hai ảnh cho <code>linux/amd64</code> và <code>linux/arm64</code>, với cache build cất trong GitHub.</li>
<li><strong>GHCR</strong> (GitHub Container Registry — kho ảnh của GitHub) nhận chúng dưới hai tag: mã băm commit rút gọn và <code>main</code>.</li>
<li><strong>VPS</strong>, qua SSH, lấy về đúng các file deploy của commit đó và chạy <code>./deploy.sh &lt;mã-băm&gt;</code>.</li>
<li><strong>deploy.sh</strong> kéo ảnh, chạy <code>up -d --wait</code>, nạp lại nginx rồi gọi <code>smoke.sh</code>.</li>
<li><strong>Có gì hỏng</strong> thì nó ghi tag cũ trở lại vào <code>.env</code> và khởi động lại bản cũ.</li>
</ol>
<p>Mọi thứ trừ phần GitHub đã chạy thật cho chương này. Một <code>registry:2</code> có mật khẩu trên laptop đóng vai GHCR, và một thư mục chỉ chứa các file deploy đóng vai VPS. File workflow viết đầy đủ và qua <code>actionlint</code> 1.7.12, nhưng không đẩy lên GitHub.</p>

<h3>Tag theo commit, không chỉ latest</h3>
${slide('dk-16', 16, 'Tag theo commit: một tag, hai kiến trúc, và luôn có đường quay lui')}
<pre><code class="language-bash">git log --oneline</code></pre>
<div class="out">03c9ee3 nginx: gan thu muc; deploy.sh + smoke.sh
12c9b80 compose: dua JWT_SECRET vao api
0fa642f api: bat buoc JWT_SECRET (chuan bi dang nhap)
c2f59c1 api: them GET /api/doctors
4679b20 phongkham v1: dat lich + nginx + compose</div>
<p>Mọi ảnh trong buổi diễn tập đều được gắn tag bằng commit mà nó được dựng từ đó. Một thói quen đó trả lời được ba câu mà <code>:latest</code> không bao giờ trả lời nổi: <em>đang chạy mã nào?</em> (<code>git show 03c9ee3</code>), <em>quay lui về đâu?</em> (mã băm trước đó, vẫn nằm trong registry), và <em>kéo ngày mai có ra đúng thứ kéo hôm nay không?</em> (có — không ai dời một tag commit, Bài 3.2). Tag <code>main</code> vẫn được giữ như một con trỏ "mới nhất" cho người đọc, nhưng máy chủ không bao giờ deploy nó.</p>
<p>Dùng cùng một độ dài ở mọi nơi. <code>git rev-parse --short HEAD</code> thường in 7 ký tự nhưng sẽ in dài hơn khi 7 ký tự bị trùng trong một kho lớn; workflow bên dưới dùng <code>&#36;{GITHUB_SHA::7}</code> (bảy ký tự đầu của mã băm đầy đủ) để CI và máy chủ luôn khớp nhau.</p>

<h3>Workflow, từng khối một</h3>
${slide('dk-16', 15, 'Workflow: build hai kiến trúc có cache, rồi gọi đúng một script trên VPS')}
<pre><code class="language-yaml"><span class="tok-comment"># .github/workflows/deploy.yml</span>
name: build-and-deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: production
  cancel-in-progress: false

permissions:
  contents: read
  packages: write

env:
  IMAGE: ghcr.io/&#36;{{ github.repository_owner }}/phongkham

jobs:
  build:
    runs-on: ubuntu-24.04
    strategy:
      matrix:
        service: [api, web]
    steps:
      - uses: actions/checkout@v7
      - uses: docker/setup-qemu-action@v4
      - uses: docker/setup-buildx-action@v4
      - uses: docker/login-action@v4
        with:
          registry: ghcr.io
          username: &#36;{{ github.actor }}
          password: &#36;{{ secrets.GITHUB_TOKEN }}
      - name: Tag theo commit
        id: tag
        run: echo "sha=&#36;{GITHUB_SHA::7}" &gt;&gt; "$GITHUB_OUTPUT"
      - uses: docker/build-push-action@v7
        with:
          context: ./&#36;{{ matrix.service }}
          target: runtime
          platforms: linux/amd64,linux/arm64
          push: true
          tags: |
            &#36;{{ env.IMAGE }}-&#36;{{ matrix.service }}:&#36;{{ steps.tag.outputs.sha }}
            &#36;{{ env.IMAGE }}-&#36;{{ matrix.service }}:main
          labels: org.opencontainers.image.revision=&#36;{{ github.sha }}
          cache-from: type=gha,scope=&#36;{{ matrix.service }}
          cache-to: type=gha,mode=max,scope=&#36;{{ matrix.service }}

  deploy:
    needs: build
    runs-on: ubuntu-24.04
    environment: production
    steps:
      - name: Tag theo commit
        id: tag
        run: echo "sha=&#36;{GITHUB_SHA::7}" &gt;&gt; "$GITHUB_OUTPUT"
      - uses: appleboy/ssh-action@v1.2.5
        with:
          host: &#36;{{ secrets.VPS_HOST }}
          username: &#36;{{ secrets.VPS_USER }}
          key: &#36;{{ secrets.VPS_SSH_KEY }}
          script: |
            set -e
            cd /srv/phongkham
            git fetch --quiet origin main
            git checkout --quiet &#36;{{ github.sha }} -- compose.yaml compose.prod.yaml nginx deploy.sh smoke.sh
            ./deploy.sh &#36;{{ steps.tag.outputs.sha }}</code></pre>
<table>
<tr><th>Khối</th><th>Làm gì và vì sao</th></tr>
<tr><td><code>concurrency: group: production</code></td><td>Hai lần push cách nhau một phút sẽ xếp hàng thay vì đua nhau vào máy chủ. Một dự án sinh viên từng có hai workflow deploy chạy song song mỗi lần push; cái này tạo lại backend trong khi cái kia còn đang khởi động nó, và API sập với <code>Exited (137)</code> cùng mấy container mồ côi.</td></tr>
<tr><td><code>permissions: packages: write</code></td><td>Cho <code>GITHUB_TOKEN</code> tự động được đẩy lên GHCR; không phải cất token cá nhân nào trong CI.</td></tr>
<tr><td><code>matrix: service: [api, web]</code></td><td>Hai ảnh build trong hai job song song.</td></tr>
<tr><td><code>setup-qemu-action</code> + <code>setup-buildx-action</code></td><td>QEMU giả lập arm64 trên máy amd64 của GitHub; Buildx là trình khách BuildKit build được nhiều nền tảng và dùng được cache của GitHub.</td></tr>
<tr><td><code>target: runtime</code></td><td>Chỉ stage đem đi (Bài 16.1).</td></tr>
<tr><td><code>platforms: linux/amd64,linux/arm64</code></td><td>Một tag, hai kiến trúc: VPS amd64 và máy Mac arm64 của bạn cùng nhóm kéo cùng một tên (Bài 3.4). Nếu không ai chạy ảnh trên arm64 thì bỏ đi — build giả lập chậm hơn nhiều.</td></tr>
<tr><td><code>cache-to: type=gha,mode=max,scope=…</code></td><td>Tầng được cache trong dịch vụ cache của GitHub, tính cả mọi stage (<code>mode=max</code>); <code>scope</code> riêng để api và web không ghi đè nhau (Bài 5.4).</td></tr>
<tr><td><code>labels: org.opencontainers.image.revision</code></td><td><code>docker inspect</code> trên máy chủ cho bạn biết ảnh đến từ commit đầy đủ nào.</td></tr>
<tr><td><code>needs: build</code></td><td>Build hỏng thì không bao giờ deploy.</td></tr>
<tr><td><code>environment: production</code></td><td>Trong cài đặt kho mã bạn có thể bắt buộc duyệt tay ở đây, hoặc giới hạn nhánh nào được deploy.</td></tr>
<tr><td><code>appleboy/ssh-action@v1.2.5</code></td><td>Chạy một script trên VPS qua SSH bằng khoá cất trong secret. Ghim đúng phiên bản: nó cầm khoá máy chủ của bạn.</td></tr>
<tr><td><code>git checkout &lt;sha&gt; -- compose.yaml … nginx …</code></td><td>Máy chủ CHỈ lấy các file deploy của đúng commit này — không bao giờ <code>compose.override.yaml</code>, không bao giờ mã nguồn. Nó cần một bản checkout của kho với deploy key chỉ-đọc.</td></tr>
</table>
<pre><code class="language-bash">docker run --rm -v "$PWD":/repo -w /repo rhysd/actionlint:latest -color=false; echo "exit=$?"</code></pre>
<div class="out">exit=0</div>
<p><code>actionlint</code> (1.7.12, chạy trong container — Bài 14.1) soát cú pháp, biểu thức và tham số của các action quen thuộc; không in gì và thoát 0 nghĩa là không thấy lỗi. Thứ nó không kiểm được là secret có tồn tại hay không. Trước lần chạy đầu, thêm <code>VPS_HOST</code>, <code>VPS_USER</code> và <code>VPS_SSH_KEY</code> trong cài đặt kho. Nếu package trên GHCR để private, đăng nhập VPS một lần bằng personal access token (classic) chỉ có quyền <code>read:packages</code>: <code>echo "$TOKEN" | docker login ghcr.io -u &lt;user&gt; --password-stdin</code>.</p>

<h3>Một tag, hai kiến trúc — đo thật</h3>
<pre><code class="language-bash">time docker buildx build --platform linux/amd64,linux/arm64 --target runtime \\
  -t localhost:18165/dk16-phongkham-api:12c9b80 --push ./api
docker buildx imagetools inspect localhost:18165/dk16-phongkham-api:12c9b80</code></pre>
<div class="out">… 43.520 total
Name:      localhost:18165/dk16-phongkham-api:12c9b80
MediaType: application/vnd.oci.image.index.v1+json
Digest:    sha256:7b89179752514b9e50856f1be678e5bd4c82a30ab902f35b5aca3eed8fdb60bc

Manifests:
  Name:        localhost:18165/dk16-phongkham-api:12c9b80@sha256:584409ff930f…
  Platform:    linux/amd64

  Name:        localhost:18165/dk16-phongkham-api:12c9b80@sha256:e88a2da2ddde…
  Platform:    linux/arm64

  Name:        localhost:18165/dk16-phongkham-api:12c9b80@sha256:853285a9c754…
  Platform:    unknown/unknown
  Annotations:
    vnd.docker.reference.type:   attestation-manifest</div>
<p>Tag trỏ tới một <em>index</em> (chỉ mục, Bài 3.4); bên trong là một manifest cho mỗi kiến trúc và một manifest chứng thực (nguồn gốc bản dựng, Bài 6.5 — hiện ra là <code>unknown/unknown</code>). Trên máy M1, builder mặc định của Docker Desktop dựng cả hai trong 43,5 giây, nửa amd64 chạy giả lập. Mỗi nửa chạy <code>npm ci</code> của riêng nó, nên mỗi nửa có engine Prisma của riêng nó — <code>linux-musl-openssl-3.0.x</code> cho amd64 và <code>linux-musl-arm64-openssl-3.0.x</code> cho arm64. Đó chính là lý do luật "cài và chạy trên cùng một ảnh nền" đúng cả khi khác kiến trúc.</p>

<h3>Diễn tập ở máy mình: một registry có mật khẩu</h3>
<p>Bạn tập được trọn con đường mà không đụng tới GitHub: một container <code>registry:2</code> có file <code>htpasswd</code> hành xử y như GHCR trong mắt Docker (Bài 3.3).</p>
<pre><code class="language-bash">docker run --rm --entrypoint htpasswd httpd:2-alpine -Bbn ci ci-matkhau-thu &gt; reg-auth/htpasswd
docker run -d --name reg -p 127.0.0.1:18165:5000 -v "$PWD/reg-auth":/auth:ro \\
  -e REGISTRY_AUTH=htpasswd -e REGISTRY_AUTH_HTPASSWD_REALM=thu \\
  -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd registry:2
curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:18165/v2/
echo ci-matkhau-thu | DOCKER_CONFIG=$PWD/docker-cfg docker login localhost:18165 -u ci --password-stdin
cat docker-cfg/config.json</code></pre>
<div class="out">401
Login Succeeded
{
	"auths": {
		"localhost:18165": {}
	},
	"credsStore": "osxkeychain"
}</div>
<p>Nhìn dòng cuối. Buổi diễn tập trỏ <code>DOCKER_CONFIG</code> vào một thư mục rỗng chính là để giữ cái mật khẩu dùng-xong-vứt này ngoài cấu hình thật — vậy mà Docker vẫn ghi <code>"credsStore": "osxkeychain"</code> và cất mật khẩu vào Keychain của macOS. Khi file cấu hình chưa có kho mật khẩu (credential store) nào, CLI tự chọn trình trợ giúp mặc định của nền tảng nếu tìm thấy nó trong <code>PATH</code> (trên Docker Desktop cho Mac là <code>docker-credential-osxkeychain</code>). Buổi diễn tập chạy <code>docker logout</code> với cùng <code>DOCKER_CONFIG</code> ngay lập tức, lệnh đó xoá mục trong Keychain, rồi đăng nhập lại với một <code>PATH</code> không chứa trình trợ giúp. Lần đăng nhập thứ hai in ra:</p>
<div class="out">WARNING! Your credentials are stored unencrypted in '…/docker-cfg/config.json'.
Configure a credential helper to remove this warning. See
https://docs.docker.com/go/credential-store/

Login Succeeded</div>
<p>Hành vi thứ hai này là thứ bạn sẽ gặp trên một VPS Linux hay máy CI không có trình trợ giúp: mật khẩu, mã hoá base64 (KHÔNG phải mã hoá bảo mật), nằm trong <code>~/.docker/config.json</code>. Đó là lý do VPS chỉ được cấp một token CHỈ đọc được package, và file đó phải giữ <code>chmod 600</code>.</p>

<h3>Phía máy chủ: một thư mục, một script, một smoke test</h3>
${slide('dk-16', 17, 'deploy.sh: kéo → lên → kiểm → hỏng thì tự quay về tag cũ')}
<p>Trên máy chủ không có mã nguồn — chỉ có thứ <code>git checkout … --</code> mang về, cộng bí mật:</p>
<pre><code class="language-bash">ls -A /srv/phongkham</code></pre>
<div class="out">.env
compose.prod.yaml
compose.yaml
deploy.sh
nginx
smoke.sh</div>
<pre><code class="language-bash">#!/bin/sh
<span class="tok-comment"># deploy.sh &lt;tag&gt; — kéo ảnh theo tag, lên, kiểm; hỏng thì tự quay về tag cũ</span>
set -u
MOI=$1
CU=$(sed -n 's/^TAG=//p' .env)
C="-f compose.yaml -f compose.prod.yaml"
dat_tag() { sed -i.bak "s/^TAG=.*/TAG=$1/" .env &amp;&amp; rm -f .env.bak; }

echo "== deploy $MOI (đang chạy: $CU)"
TAG=$MOI docker compose $C pull -q &gt;/dev/null 2&gt;&amp;1 || { echo "!! không kéo được ảnh $MOI"; exit 1; }
dat_tag "$MOI"
if docker compose $C up -d --wait --wait-timeout 90 &gt;/dev/null 2&gt;&amp;1 \\
   &amp;&amp; docker compose $C exec -T nginx nginx -t -q &amp;&amp; docker compose $C exec -T nginx nginx -s reload \\
   &amp;&amp; ./smoke.sh; then
  echo "== OK: đang chạy $MOI"
else
  echo "!! $MOI hỏng — quay lui về $CU"
  docker compose $C logs --tail 5 api
  dat_tag "$CU"
  docker compose $C up -d --wait --wait-timeout 90 &gt;/dev/null 2&gt;&amp;1 &amp;&amp; ./smoke.sh &amp;&amp; echo "== đã quay lui: đang chạy $CU"
  exit 1
fi</code></pre>
<pre><code class="language-bash">#!/bin/sh
<span class="tok-comment"># smoke.sh — mọi tuyến phải trả mã mong đợi, sai một cái là exit 1</span>
BASE=&#36;{BASE:-http://127.0.0.1:18160}
fail=0
for pair in "healthz 200" "api/slots?day=2026-10-01 200" " 200"; do
  path=&#36;{pair% *}; want=&#36;{pair##* }
  got=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/$path")
  printf '%-28s %s (cần %s)\\n' "/$path" "$got" "$want"
  [ "$got" = "$want" ] || fail=1
done
exit $fail</code></pre>
<table>
<tr><th>Bước</th><th>Vì sao theo thứ tự này</th></tr>
<tr><td><code>TAG=$MOI … pull</code> TRƯỚC khi đụng vào <code>.env</code></td><td>Nếu ảnh không tồn tại (gõ nhầm, CI chưa chạy xong), script dừng và bản cũ vẫn chạy nguyên vẹn.</td></tr>
<tr><td><code>dat_tag</code> ghi tag vào <code>.env</code></td><td>Để một lệnh <code>docker compose up</code> về sau — sau khi khởi động lại máy, hay do ai gõ tay — khởi động đúng phiên bản này, không phải <code>dev</code>.</td></tr>
<tr><td><code>up -d --wait --wait-timeout 90</code></td><td>Trả mã khác 0 nếu có dịch vụ nào không healthy trong 90 giây (Bài 11.4).</td></tr>
<tr><td><code>nginx -t</code> rồi <code>nginx -s reload</code></td><td><code>up</code> KHÔNG tạo lại nginx khi chỉ có file cấu hình được gắn vào thay đổi; ảnh không đổi. Kiểm trước, nạp sau — cấu hình hỏng bị từ chối và cấu hình cũ vẫn nằm trong bộ nhớ.</td></tr>
<tr><td><code>smoke.sh</code> qua cửa trước</td><td>"Khoẻ bên trong" chưa phải "gọi được từ ngoài". <code>/healthz</code> của chính nginx vẫn báo 200 khi API đã chết, nên danh sách phải có một tuyến đi tới tận API.</td></tr>
<tr><td>Khi hỏng: 5 dòng log cuối của API, trả tag cũ, <code>up --wait</code>, smoke</td><td>Log giải thích cái gì vỡ; quay lui trả lại dịch vụ mà không cần chờ bạn.</td></tr>
</table>

<h3>Một bản hỏng, tự quay lui</h3>
${slide('dk-16', 18, 'Bản hỏng lên, chưa tới 20 giây sau bản cũ đã chạy lại')}
<p>Commit <code>0fa642f</code> khiến API từ chối khởi động nếu thiếu biến mới <code>JWT_SECRET</code>, và chưa ai nối biến đó vào file Compose — một sai sót rất bình thường. Trước hết, đây là lượt deploy tay không kiểm khi ảnh đó đã lên:</p>
<pre><code class="language-bash">docker ps --filter name=phongkham-api --format '{{.Names}} {{.Status}}'
./smoke.sh; echo smoke=$?</code></pre>
<div class="out">dk16-phongkham-api-1 Restarting (1) Less than a second ago
/healthz                     200 (cần 200)
/api/slots?day=2026-10-01    502 (cần 200)
/                            504 (cần 200)
smoke=1</div>
<p>Cùng bản phát hành đó, đi qua <code>deploy.sh</code>:</p>
<pre><code class="language-bash">time ./deploy.sh 0fa642f</code></pre>
<div class="out">== deploy 0fa642f (đang chạy: c2f59c1)
!! 0fa642f hỏng — quay lui về c2f59c1
api-1  | thiếu biến môi trường JWT_SECRET — dừng
api-1  | thiếu biến môi trường JWT_SECRET — dừng
api-1  | thiếu biến môi trường JWT_SECRET — dừng
/healthz                     200 (cần 200)
/api/slots?day=2026-10-01    200 (cần 200)
/                            200 (cần 200)
== đã quay lui: đang chạy c2f59c1
./deploy.sh 0fa642f  … 19.774 total</div>
<p>Chưa tới 20 giây từ "bắt đầu deploy" tới "bản cũ phục vụ trở lại", lý do được in ngay giữa. Trong CI, job kết thúc màu đỏ (exit 1) — đúng tín hiệu bạn muốn. Quay lui bằng tay — sửa <code>TAG=</code> trong <code>.env</code> rồi <code>up -d --wait</code> — đo được 13,8 giây. Cách chữa cho bản phát hành này là một thay đổi ở Compose, không phải một ảnh mới (Bài 16.4, sự cố 7): khi <code>compose.yaml</code> đã truyền biến vào, <code>./deploy.sh 0fa642f</code> — CHÍNH cái ảnh đó — in ra <code>== OK: đang chạy 0fa642f</code>.</p>
<div class="pitfall co-tieu-de"><strong>Quay lui mã không quay lui CSDL.</strong> Lượt quay lui ở trên an toàn vì <code>0fa642f</code> không có migration nào. Nếu bản phát hành thêm một cột và mã cũ không để ý tới cột đó, quay về vẫn ổn; nếu nó đổi tên hay xoá một thứ gì, ảnh cũ sẽ sập trên schema mới, và <code>deploy.sh</code> sẽ hớn hở "quay lui" vào một lần hỏng thứ hai. Viết migration mà bản trước còn sống chung được (thêm trước, xoá ở bản phát hành sau), và <code>pg_dump</code> trước mọi lượt deploy có migrate (Bài 16.4).</div>

<h3>CI, hay script trên máy của bạn?</h3>
<table>
<tr><th>Build trên GitHub Actions khi…</th><th>Build ở máy mình rồi đẩy lên khi…</th></tr>
<tr><td>nhiều người cùng merge vào <code>main</code> và lần merge nào cũng phải deploy theo cùng một cách</td><td>nhóm chỉ một hai người và muốn nhìn thấy quá trình build</td></tr>
<tr><td>bạn muốn cache build và log nằm ngoài mọi laptop</td><td>số phút miễn phí của GitHub hay build arm64 giả lập quá chậm với bạn</td></tr>
<tr><td>thầy hoặc bạn cùng nhóm cần thấy commit nào đang chạy</td><td>bạn có một máy mạnh ở nhà (một dự án sinh viên build trên PC 12 nhân ở nhà mất 3–6 phút, so với khoảng 15 phút trên chính VPS của nó)</td></tr>
</table>
<p>Cách nào cũng giữ hai luật: build ở nơi KHÁC máy chủ production (VPS tự build sẽ ôm hàng GB cache build trên cùng cái đĩa với Postgres — Bài 16.4, sự cố 3), và để máy chủ làm đúng một việc: kéo một tag, khởi động nó, kiểm nó.</p>

<h3>Chạy thử từng bước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1 · một registry cục bộ</span><span class="lz-t">docker run -d --name reg -p 127.0.0.1:5001:5000 registry:2</span><span class="lz-d">Không mật khẩu cũng được cho lần thử đầu; localhost được phép dùng HTTP trơn.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2 · build và đẩy theo commit</span><span class="lz-t">TAG=$(git rev-parse --short HEAD); docker build --target runtime -t localhost:5001/api:$TAG ./api &amp;&amp; docker push localhost:5001/api:$TAG</span><span class="lz-d">Làm lại sau commit thứ hai: có hai tag.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3 · một thư mục "máy chủ"</span><span class="lz-t">mkdir ../vps &amp;&amp; cp compose.yaml compose.prod.yaml deploy.sh smoke.sh ../vps/ &amp;&amp; cp -R nginx ../vps/</span><span class="lz-d">Cộng một .env có TAG= và các bí mật. Không mã nguồn.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4 · deploy tag đầu tiên</span><span class="lz-t">cd ../vps &amp;&amp; ./deploy.sh &lt;tag-đầu&gt;</span><span class="lz-d">== OK và ba mã 200.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 5 · deploy một thứ hỏng</span><span class="lz-t">./deploy.sh &lt;tag-hỏng&gt;; echo $?</span><span class="lz-d">Script quay lui và thoát 1.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> hai ngày trước buổi demo SWP391, một bạn trong nhóm đẩy lên một commit làm API sập lúc khởi động. Lần trước chuyện này xảy ra, cả nhóm chỉ biết khi thầy mở trang web. Bạn muốn máy chủ tự từ chối bản hỏng.</p><ol>
<li>Chạy một <code>registry:2</code> cục bộ ở cổng loopback và đẩy ảnh API của bạn dưới hai tag commit: một bản tốt, một bản bạn thêm <code>process.exit(1)</code> lúc khởi động.</li>
<li>Tạo một thư mục "máy chủ" chỉ chứa các file Compose, <code>nginx/</code>, <code>.env</code>, <code>deploy.sh</code> và <code>smoke.sh</code>; trong <code>smoke.sh</code> có ít nhất một tuyến đi qua API tới CSDL.</li>
<li>Deploy tag tốt, rồi tag hỏng. Bấm giờ lần thứ hai bằng <code>time</code>.</li>
<li>Viết workflow GitHub Actions cho kho của bạn và chạy <code>actionlint</code> trên nó trong một container.</li></ol>
<p><strong>Đạt khi:</strong> lượt deploy hỏng in ra lỗi của API, kết thúc với tag tốt đang phục vụ và mã thoát 1; <code>grep TAG .env</code> lại cho thấy tag tốt; và <code>actionlint</code> thoát 0.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">GHCR — GitHub Container Registry (kho ảnh của GitHub)</span><span class="v">Registry ảnh ở <code>ghcr.io</code>; CI đẩy lên bằng <code>GITHUB_TOKEN</code> tự động.</span></div>
  <div class="kv"><span class="k">Commit tag (tag theo commit)</span><span class="v">Tag ảnh bằng mã băm commit rút gọn; không bao giờ bị dời nên luôn kéo lại được.</span></div>
  <div class="kv"><span class="k">Image index (chỉ mục đa nền tảng)</span><span class="v">Một tag trỏ tới một manifest cho mỗi kiến trúc; máy nào kéo phần của máy đó.</span></div>
  <div class="kv"><span class="k">Build cache backend — gha (nơi cất cache build)</span><span class="v">Chỗ Buildx cất các tầng giữa các lượt CI; <code>mode=max</code> giữ mọi stage.</span></div>
  <div class="kv"><span class="k">Smoke test (kiểm khói)</span><span class="v">Vài request nhanh sau deploy chứng minh các đường chính trả lời được.</span></div>
  <div class="kv"><span class="k">Rollback (quay lui)</span><span class="v">Trở về tag ảnh trước; ở đây là một dòng trong <code>.env</code> cộng <code>up --wait</code>.</span></div>
  <div class="kv"><span class="k">Credential helper — credsStore (trình giữ mật khẩu)</span><span class="v">Chương trình cất mật khẩu registry vào keychain của hệ điều hành thay vì file cấu hình.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Gắn tag commit cho mọi ảnh; <code>main</code> hay <code>latest</code> là cho người đọc, máy chủ deploy mã băm.</li>
<li>CI chỉ build stage <code>runtime</code>, cho đúng những kiến trúc bạn thật sự chạy, với cache GitHub có <code>scope</code> và <code>concurrency</code> để các lượt deploy không bao giờ đua nhau.</li>
<li>Máy chủ không giữ mã nguồn: nó lấy các file deploy của một commit và chạy một script.</li>
<li><code>deploy.sh</code> kéo trước, rồi <code>up --wait</code>, nạp lại nginx, smoke test qua cửa trước — và trả tag cũ về khi có bất kỳ lỗi nào (đo được: dưới 20 giây).</li>
<li>Diễn tập bằng <code>registry:2</code> cục bộ, và để ý <code>docker login</code> thật ra cất mật khẩu ở đâu.</li>
<li>Quay lui mã không phải quay lui CSDL: giữ migration tương thích với bản trước và dump trước khi migrate.</li>
</ul>

<a class="link-card" href="https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Làm việc với Container registry (GHCR)</span><span class="lc-sub">Xác thực bằng <code>GITHUB_TOKEN</code> hoặc token có <code>read:packages</code>.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/ci/github-actions/multi-platform/" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">Ảnh đa nền tảng với GitHub Actions</span><span class="lc-sub">Workflow chính thức của Docker dùng QEMU và Buildx.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/cache/backends/gha/" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Cache build trên GitHub Actions</span><span class="lc-sub"><code>type=gha</code>, <code>mode=max</code> và <code>scope</code>.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/control-the-concurrency-of-workflows-and-jobs" target="_blank" rel="noopener">
  <span class="lc-ico">🚦</span>
  <span class="lc-body"><span class="lc-title">Điều khiển chạy đồng thời của workflow</span><span class="lc-sub">Nhóm <code>concurrency</code> xếp hàng các lượt chạy thế nào.</span></span>
</a>
<a class="link-card" href="/courses/github-actions" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">Khoá học: GitHub Actions</span><span class="lc-sub">Workflow, secret, environment và runner, đi sâu.</span></span>
</a>
<a class="link-card" href="/courses/deploy-vps" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">Khoá học: Deploy lên VPS</span><span class="lc-sub">Khoá SSH, user, tường lửa và tên miền cho phía máy chủ.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trong Code Lab</span><span class="lc-sub">Bài tập Docker có chấm tự động.</span></span>
</a>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Deploy tag commit, không bao giờ "latest". Để máy chủ chỉ kéo, khởi động và kiểm — build ở nơi khác. Và cho script deploy tự đặt được bản cũ trở lại, vì bản hỏng sẽ tới đúng cái đêm bạn không ngồi canh.</p>
</div>
`,
    },
    /* ─────────────────────────── 16.4 ─────────────────────────── */
    {
      title: '16.4 — The first week in production: backups, logs and eight classic incidents|||16.4 — Tuần đầu trên production: sao lưu, log và tám sự cố kinh điển',
      slug: 'dk-16-4-van-hanh-su-co',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đọc log đúng cách, sao lưu Postgres có khôi phục thử, rồi tám sự cố kinh điển dựng lại thật — OOM 137, sai libc 502, đĩa đầy, restart vòng lặp, cổng DB lộ, bind mount file đơn bị mv, .env không vào container, múi giờ UTC — mỗi cái: triệu chứng, lệnh chẩn đoán, cách cứu, cách phòng, chương liên quan.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.4</span>
<h2>The first week in production: backups, logs and eight classic incidents</h2>
<p class="lead">The demo went well and the app is live. Now it has to stay live while you sleep, sit exams and forget about it. This lesson covers the three habits a small production needs — reading logs, watching the disk, and backing up in a way you have actually restored — and then the eight incidents that hit Docker deployments again and again. Six of them were reproduced for real on the chapter's app; two are shown by measuring, not by breaking anything.</p>

<h3>Reading logs without drowning</h3>
<pre><code class="language-bash">docker compose logs -t --tail 3 api nginx         <span class="tok-comment"># last 3 lines each, with timestamps</span>
docker compose logs -t --since 10m api            <span class="tok-comment"># only the last ten minutes</span>
docker compose logs -f api                        <span class="tok-comment"># follow live; Ctrl+C to stop following</span></code></pre>
<div class="out">api-1  | 2026-09-24T01:29:32.869447543Z api 0fa642f nghe cổng 3000
nginx-1  | 2026-09-24T01:30:42.089414298Z 127.0.0.1 - - [24/Sep/2026:01:30:42 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
nginx-1  | 2026-09-24T01:30:52.128028177Z 127.0.0.1 - - [24/Sep/2026:01:30:52 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
nginx-1  | 2026-09-24T01:31:02.167226418Z 127.0.0.1 - - [24/Sep/2026:01:31:02 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"</div>
<p>The API's first line tells you which version is running — worth printing at every start. The three nginx lines are its own healthcheck, every ten seconds: 8,640 lines a day that bury the real traffic. One directive fixes it:</p>
<pre><code>location = /healthz { access_log off; return 200 "ok\\n"; }</code></pre>
<p>After that change, <code>docker compose logs -t --since 15s nginx api</code> taken right after one real request shows only that request:</p>
<div class="out">nginx-1  | 2026-09-24T01:57:57.111484971Z 172.21.0.1 - - [24/Sep/2026:01:57:57 +0000] "GET /api/slots?day=2026-10-01 HTTP/1.1" 200 248 "-" "curl/8.7.1" "-"</div>
<p>Everything a container writes to stdout and stderr is what <code>docker logs</code> shows; the files behind it are capped by the <code>max-size</code>/<code>max-file</code> of Lesson 16.2 (Lesson 11.3 explains where they live). All timestamps are UTC — incident 8.</p>

<h3>Backups you have restored at least once</h3>
${slide('dk-16', 19, 'Sao lưu chỉ có giá trị khi đã khôi phục thử thành công')}
<pre><code class="language-bash">docker compose exec -T db pg_dump -U phongkham -Fc phongkham &gt; backup/phongkham-2026-09-24.dump
ls -l backup/
<span class="tok-comment"># restore into a throw-away Postgres — never into production to "test"</span>
docker run -d --rm --name restore -e POSTGRES_PASSWORD=thu postgres:16.4-alpine
docker exec restore createdb -U postgres khoiphuc
docker exec -i restore pg_restore -U postgres -d khoiphuc --no-owner &lt; backup/phongkham-2026-09-24.dump
docker exec restore psql -U postgres -d khoiphuc -c 'select id, patient_name, doctor, slot from bookings order by id'</code></pre>
<div class="out">-rw-r--r--@ 1 admin  wheel  4699 Sep 24 08:24 phongkham-2026-09-24.dump
 id | patient_name |     doctor     |        slot
----+--------------+----------------+---------------------
  1 | Nguyễn Văn A | BS. Lan (Nhi)  | 2026-10-01 01:00:00
  3 | Bệnh nhân 09 | BS. Minh (Nội) | 2026-10-01 02:00:00
  4 | Bệnh nhân 10 | BS. Minh (Nội) | 2026-10-01 03:00:00
  5 | Bệnh nhân 14 | BS. Minh (Nội) | 2026-10-01 07:00:00
  6 | Bệnh nhân 15 | BS. Minh (Nội) | 2026-10-01 08:00:00
(5 rows)</div>
<table>
<tr><th>Detail</th><th>Why</th></tr>
<tr><td><code>exec -T</code></td><td>No pseudo-terminal: with a TTY, line endings get rewritten and a binary dump is silently corrupted (Lesson 7.5).</td></tr>
<tr><td><code>pg_dump -Fc</code></td><td>Postgres' compressed custom format; <code>pg_restore</code> can restore it selectively and in parallel.</td></tr>
<tr><td>Restore into a separate <code>--rm</code> container</td><td>Proves the file is usable without risking the live database; the production count was also 5.</td></tr>
<tr><td>Where is id 2?</td><td>The booking that got <code>409</code> (same doctor, same slot) had already taken number 2 from the sequence before the unique index refused it. A gap is normal; a dump that "looks wrong" usually reflects real history.</td></tr>
<tr><td><code>pg_dump</code>, not a copy of the volume</td><td>A dump is consistent while the database runs and restores into any Postgres version equal or newer; a <code>tar</code> of the volume needs the same major version and ideally a stopped database (Lesson 7.5).</td></tr>
</table>
<p>A small script turns that into a nightly job; it refuses to keep an empty file and keeps seven days:</p>
<pre><code class="language-bash">#!/bin/sh
<span class="tok-comment"># sao-luu.sh — dump Postgres ra file có ngày giờ, giữ 7 ngày, kiểm file đọc lại được</span>
set -eu
C="-f compose.yaml -f compose.prod.yaml"
mkdir -p backup
F=backup/phongkham-$(date +%F-%H%M).dump
docker compose $C exec -T db pg_dump -U phongkham -Fc phongkham &gt; "$F"
[ -s "$F" ] || { echo "!! file dump rỗng: $F"; exit 1; }
docker compose $C exec -T db pg_restore --list &lt; "$F" | grep -c "TABLE DATA" | sed "s#^#$F: #; s#\\$# bảng có dữ liệu#"
find backup -name 'phongkham-*.dump' -mtime +7 -print -delete
ls -l backup</code></pre>
<div class="out">backup/phongkham-2026-09-24-0857.dump: 2 bảng có dữ liệu
total 16
-rw-r--r--@ 1 admin  wheel  4723 Sep 24 08:57 phongkham-2026-09-24-0857.dump</div>
<p>"2 tables with data" are <code>bookings</code> and Prisma's <code>_prisma_migrations</code>. Run it from cron (<code>0 3 * * * cd /srv/phongkham &amp;&amp; ./sao-luu.sh</code>), and — this is the step people skip — copy the file OFF the server (your home machine, an S3-compatible bucket). A backup on the same disk as the database dies with the disk.</p>

<h3>Eight classic incidents: where to look first</h3>
${slide('dk-16', 20, 'Tám sự cố kinh điển: triệu chứng nào, gõ lệnh gì trước')}
<p>Each incident below follows the same pattern: <strong>symptom</strong> (what you see) → <strong>diagnose</strong> (the first command) → <strong>rescue</strong> (get service back now) → <strong>prevent</strong> (so it never comes back) → <strong>chapter</strong> (where the mechanism is explained). The general method is Lesson 12.1: read <code>STATUS</code> before logs, then the exit code, then the logs, then <code>inspect</code>.</p>

<h3>Incident 1 — exit 137: killed for memory</h3>
${slide('dk-16', 21, 'Hai kiểu chết: 137 là bị GIẾT, 1 là tự thoát')}
<pre><code class="language-bash">docker run --name oom --memory 128m --memory-swap 128m --entrypoint node &lt;api-image&gt; \\
  -e 'const a=[];let i=0;setInterval(()=&gt;{a.push(Buffer.alloc(20e6,1));console.log("đã giữ",(++i)*20,"MB")},100)'
docker inspect oom -f 'ExitCode={{.State.ExitCode}} OOMKilled={{.State.OOMKilled}}'</code></pre>
<div class="out">đã giữ 60 MB
đã giữ 80 MB
đã giữ 100 MB
đã giữ 120 MB
ExitCode=137 OOMKilled=true</div>
<table>
<tr><th>Symptom</th><td><code>Exited (137)</code> or a restart with no error in the app's log — the process never got the chance to write one.</td></tr>
<tr><th>Diagnose</th><td><code>docker inspect -f '{{.State.OOMKilled}}' &lt;c&gt;</code> → <code>true</code>; <code>docker stats --no-stream</code> to see how close the others are to their limits.</td></tr>
<tr><th>Rescue</th><td>Raise the limit in <code>compose.prod.yaml</code> and <code>up -d</code>, or reduce what the process holds (for Node, <code>NODE_OPTIONS=--max-old-space-size=…</code> below the container limit).</td></tr>
<tr><th>Prevent</th><td>Set limits from measurements under load, never build on the production server (a cold <code>next build</code> is the biggest memory spike most small projects ever have), and leave headroom for the OS.</td></tr>
<tr><th>Chapter</th><td>2.5, 11.2 — and 1.1 for why <code>--memory-swap</code> matters.</td></tr>
</table>
<p>A student project hit exactly this: two cold image builds in parallel on a 6 GB VPS, and <code>next build</code> was killed with 137. The fix was to build sequentially, then to stop building on the VPS at all.</p>

<h3>Incident 2 — build green, API 502: the wrong libc</h3>
<pre><code class="language-bash"><span class="tok-comment"># image built on Debian (bookworm-slim), running on Alpine</span>
docker compose ps api --format '{{.Service}} {{.Image}} {{.Status}}'
for i in 1 2 3; do curl -s -o /dev/null -w '%{http_code} ' "http://127.0.0.1:18160/api/slots?day=2026-10-01"; sleep 1; done
docker compose logs api
docker logs nginx 2&gt;&amp;1 | grep upstream | tail -2
docker inspect api -f 'RestartCount={{.RestartCount}}'</code></pre>
<div class="out">api localhost:18165/dk16-phongkham-api:sai-libc Restarting (1) 3 seconds ago
502 502 502
api sai-libc nghe cổng 3000
PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-arm64-openssl-3.0.x".
This happened because Prisma Client was generated for "linux-arm64-openssl-1.1.x", but the actual deployment required "linux-musl-arm64-openssl-3.0.x".
…
2026/09/24 01:26:17 [error] 22#22: *51 connect() failed (111: Connection refused) while connecting to upstream, … upstream: "http://172.21.0.2:3000/api/slots?day=2026-10-01" …
2026/09/24 01:26:33 [error] 22#22: *53 connect() failed (113: Host is unreachable) while connecting to upstream, … upstream: "http://172.21.0.2:3000/api/slots?day=2026-10-01" …
RestartCount=12</div>
<table>
<tr><th>Symptom</th><td>The build and push were green; the site answers 502; the API is <code>Restarting (1)</code>.</td></tr>
<tr><th>Diagnose</th><td><code>docker compose logs api</code> — the error names both targets. List the engines: <code>docker run --rm --entrypoint sh &lt;img&gt; -c 'ls node_modules/.prisma/client | grep node'</code>.</td></tr>
<tr><th>Rescue</th><td>Roll back to the previous tag (<code>deploy.sh</code> does it for you, Lesson 16.3).</td></tr>
<tr><th>Prevent</th><td>Install and run on the same base image (Lesson 16.1); make the build script start the image against a throw-away database before pushing.</td></tr>
<tr><th>Chapter</th><td>6.2, 12.4.</td></tr>
</table>
<p>The two nginx lines are two different moments of the loop: <code>111: Connection refused</code> — the container existed but nothing listened yet; <code>113: Host is unreachable</code> — the container was between restarts and its address was gone. Note also the order in the API log: the server printed "listening" first and died a moment later, when Prisma loaded its engine. A healthcheck that only asks "is the port open?" could have said healthy in between; one that runs <code>SELECT 1</code> could not. A student project lost its API for seven minutes to this exact mix — an Alpine image carrying a <code>debian-openssl-3.0.x</code> engine because a build used the default <code>Dockerfile</code> instead of the right one.</p>

<h3>Incident 3 — "no space left on device": the disk is full</h3>
${slide('dk-16', 25, 'Đĩa đầy: đo trước, dọn có chọn lọc, và đừng bao giờ -a trên máy chủ lúc hoảng')}
<p>This one was NOT reproduced — filling a real disk is exactly the kind of experiment this course forbids. What can be done safely is to measure. The laptop used to write this course:</p>
<pre><code class="language-bash">docker system df</code></pre>
<div class="out">TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          69        17        37.01GB   24.82GB (67%)
Containers      30        4         882.5MB   553.7MB (62%)
Local Volumes   70        23        9.125GB   4.086GB (44%)
Build Cache     587       15        36.45GB   20.26GB</div>
<p>The build cache (36 GB) is bigger than all images together. On a VPS that builds its own images, that cache sits on the same disk as Postgres. A student project's deploy died mid-build with <code>no space left on device</code> when the disk fell to 1.8 GB free during <code>next build</code>; 7.6 GB of it was build cache.</p>
<table>
<tr><th>Symptom</th><td><code>no space left on device</code> in a build or in Postgres' log; Postgres may refuse writes or crash.</td></tr>
<tr><th>Diagnose</th><td><code>df -h /</code> first (is it really Docker?), then <code>docker system df</code>, then <code>docker system df -v</code> for the big items.</td></tr>
<tr><th>Rescue</th><td>From safest to riskiest: <code>docker builder prune --filter until=168h</code>; <code>docker image prune --filter until=168h</code> (without <code>-a</code>, so older tagged images you may roll back to stay); old container logs if rotation was missing. Never <code>docker volume prune</code> on a server in a panic.</td></tr>
<tr><th>Prevent</th><td>Build elsewhere (Lesson 16.3), log rotation (16.2), a weekly cleanup job with filters, and an alert when the disk passes 80%.</td></tr>
<tr><th>Chapter</th><td>3.5, 11.3, 11.5.</td></tr>
</table>

<h3>Incident 4 — the restart loop</h3>
<pre><code class="language-bash">docker run -d --name loop --restart unless-stopped &lt;api-image:0fa642f&gt;   <span class="tok-comment"># JWT_SECRET not set</span>
sleep 25
docker ps --filter name=loop --format '{{.Names}} {{.Status}}'
docker inspect loop -f 'ExitCode={{.State.ExitCode}} RestartCount={{.RestartCount}} Restarting={{.State.Restarting}}'
docker logs --tail 2 loop
docker events --since 25s --until 0s --filter container=loop --filter event=die --format '{{.Time}} {{.Action}} exitCode={{.Actor.Attributes.exitCode}}' | tail -4</code></pre>
<div class="out">dk16-loop Restarting (1) 10 seconds ago
ExitCode=1 RestartCount=8 Restarting=true
thiếu biến môi trường JWT_SECRET — dừng
thiếu biến môi trường JWT_SECRET — dừng
1790215099 die exitCode=1
1790215101 die exitCode=1
1790215105 die exitCode=1
1790215112 die exitCode=1</div>
<p>Eight restarts in 25 seconds, and the gaps between the last deaths are 2, 4 and 7 seconds: Docker doubles the delay between restarts (up to a minute) so a broken container does not burn the CPU (Lesson 11.1). <code>Restarting (1)</code> tells you the app itself exited with 1 — read its log, not the kernel's.</p>
<table>
<tr><th>Symptom</th><td><code>Restarting (N)</code> in <code>docker ps</code>, a climbing <code>RestartCount</code>, 502s through nginx.</td></tr>
<tr><th>Diagnose</th><td>The exit code chooses the path (Lesson 12.1): 1 → the app's own log; 137 → incident 1; 127/126 → wrong command or permissions (Lesson 12.2).</td></tr>
<tr><th>Rescue</th><td>Roll back the tag, or fix the missing input (here: incident 7).</td></tr>
<tr><th>Prevent</th><td><code>up --wait</code> + smoke test in the deploy (Lesson 16.3) — a loop never survives a deploy unnoticed.</td></tr>
<tr><th>Chapter</th><td>11.1, 12.3.</td></tr>
</table>

<h3>Incident 5 — the database port open to the Internet</h3>
${slide('dk-16', 23, 'ports: không ghi IP là mở cho MỌI mạng — trừ khi dịch vụ chỉ ở mạng internal')}
<p>Not reproduced with a public port — the rehearsal only ever bound <code>127.0.0.1</code>. Reading the merged configuration shows the difference without opening anything:</p>
<pre><code class="language-bash"><span class="tok-comment"># lo-cong.yaml: ports: ["18166:5432"] — config only, NOT started</span>
docker compose -f compose.yaml -f compose.prod.yaml -f lo-cong.yaml config db | grep -A4 ' ports:'
<span class="tok-comment"># an-toan.yaml: ports: ["127.0.0.1:18166:5432"]</span>
docker compose -f compose.yaml -f compose.prod.yaml -f an-toan.yaml config db | grep host_ip</code></pre>
<div class="out">    ports:
      - mode: ingress
        target: 5432
        published: "18166"
        protocol: tcp
        host_ip: 127.0.0.1</div>
<p>No <code>host_ip</code> means every interface: <code>0.0.0.0</code> and <code>[::]</code>. On a Linux server, Docker writes its own iptables rules for published ports, and they are evaluated before <code>ufw</code>'s — so "the firewall blocks 5432" is not true (Lesson 8.2). The same pattern exists on the Mac used for this course, on a development database that is not part of this app:</p>
<pre><code class="language-bash">docker ps --filter name=cuong_pg_new --format '{{.Names}} [{{.Ports}}]'</code></pre>
<div class="out">cuong_pg_new [0.0.0.0:5434-&gt;5432/tcp, [::]:5434-&gt;5432/tcp]</div>
<p>That Postgres answers anyone on the same Wi-Fi who knows the password. And one more real finding: with the <code>127.0.0.1:18166:5432</code> override applied to the chapter's <code>db</code> — which lives only on the <code>internal: true</code> network — nothing was published at all:</p>
<pre><code class="language-bash">docker compose ps db --format '{{.Status}} [{{.Ports}}]'
nc -z -w 3 127.0.0.1 18166 || echo đóng</code></pre>
<div class="out">Up 9 seconds (healthy) [5432/tcp]
đóng</div>
<table>
<tr><th>Symptom</th><td>Usually none — until unknown logins appear in Postgres' log, or the data is gone and a ransom note table sits in its place.</td></tr>
<tr><th>Diagnose</th><td><code>docker ps --format '{{.Names}} {{.Ports}}'</code> and look for <code>0.0.0.0</code> on anything that is not your web entry.</td></tr>
<tr><th>Rescue</th><td>Remove the <code>ports:</code> line (or bind <code>127.0.0.1</code>), <code>up -d</code>, change the database password, and check the log for foreign connections.</td></tr>
<tr><th>Prevent</th><td>Databases on an <code>internal: true</code> network; for your own access, an SSH tunnel: <code>ssh -L 5432:&lt;db-ip&gt;:5432 vps</code>.</td></tr>
<tr><th>Chapter</th><td>8.2 (with a real incident), 8.4.</td></tr>
</table>

<h3>Incident 6 — edited the config with mv; reload said OK; nothing changed</h3>
${slide('dk-16', 22, 'Sửa file cấu hình bằng mv: reload “thành công”, không gì thay đổi')}
<p>Reproduced on the Linux machine (Docker Engine 29.6), with a single file bind-mounted into nginx:</p>
<pre><code class="language-bash">docker run -d --name ng -p 127.0.0.1:18167:80 -v $PWD/default.conf:/etc/nginx/conf.d/default.conf:ro nginx:1.27-alpine
sleep 2; curl -s 127.0.0.1:18167
<span class="tok-comment"># 1) edit by writing a new file and renaming it — what sed -i, vim and git do</span>
sed "s/phien-ban-1/phien-ban-2/" default.conf &gt; default.conf.moi &amp;&amp; mv default.conf.moi default.conf
docker exec ng nginx -t 2&gt;&amp;1 | tail -1; docker exec ng nginx -s reload 2&gt;/dev/null; sleep 1; curl -s 127.0.0.1:18167
echo "host      $(stat -c 'inode=%i' default.conf) $(sha256sum default.conf | cut -c1-12)"
echo "container $(docker exec ng stat -c 'inode=%i' /etc/nginx/conf.d/default.conf) $(docker exec ng sha256sum /etc/nginx/conf.d/default.conf | cut -c1-12)"
<span class="tok-comment"># 2) rescue: restart the container</span>
docker restart ng &gt;/dev/null; sleep 2; curl -s 127.0.0.1:18167
<span class="tok-comment"># 3) prevent: overwrite IN PLACE, then reload</span>
sed "s/phien-ban-2/phien-ban-3/" default.conf &gt; /tmp/moi &amp;&amp; cat /tmp/moi &gt; default.conf
docker exec ng nginx -s reload 2&gt;/dev/null; sleep 1; curl -s 127.0.0.1:18167</code></pre>
<div class="out">phien-ban-1
nginx: configuration file /etc/nginx/nginx.conf test is successful
phien-ban-1
host      inode=5516765 3155f529d56d
container inode=5516764 366391d755d7
phien-ban-2
phien-ban-3</div>
<p>A single-file bind mount is attached to the file's <em>inode</em> when the container starts, not to its path. <code>mv</code> points the path at a new inode; the container keeps reading the old one, so <code>nginx -t</code> tests the OLD file (valid), <code>reload</code> reloads the OLD file, and everything reports success. <code>docker restart</code> re-binds by path. Writing in place with <code>cat new &gt; file</code> keeps the inode. And <code>git</code> replaces files on every checkout — measured on the Mac: the inode of <code>nginx/default.conf</code> changed from 59098024 to 59098032 after one <code>git checkout --</code>. That is why the chapter's Compose file mounts the <em>folder</em> <code>./nginx</code>, and why <code>deploy.sh</code> can simply <code>git checkout</code> and reload.</p>
<table>
<tr><th>Symptom</th><td>You changed nginx's config, <code>nginx -t</code> and <code>reload</code> succeed, the site behaves as before.</td></tr>
<tr><th>Diagnose</th><td>Compare <code>sha256sum</code> of the file on the host and INSIDE the container. Different = stale inode.</td></tr>
<tr><th>Rescue</th><td><code>docker restart nginx</code> (or <code>docker compose up -d --force-recreate nginx</code>).</td></tr>
<tr><th>Prevent</th><td>Mount the directory, not the file; if you must mount a file, write it in place and check the hash from inside.</td></tr>
<tr><th>Chapter</th><td>7.3, 10.5.</td></tr>
</table>
<p>A student project lived this twice in a row: its deploy script replaced <code>nginx.conf</code> with <code>mv</code>, <code>nginx -t</code> and <code>reload</code> passed, the script printed OK, and HTTP/2 stayed off and every cache header stayed wrong — until someone compared the hash from inside the container.</p>

<h3>Incident 7 — the variable is in .env, but not in the container</h3>
${slide('dk-16', 24, '.env chỉ để Compose nội suy; container mặc định sống ở UTC')}
<pre><code class="language-bash"><span class="tok-comment"># .env on the server already contains JWT_SECRET=…</span>
docker compose -f compose.yaml -f compose.prod.yaml config | grep -c JWT
docker compose -f compose.yaml -f compose.prod.yaml config --environment | grep JWT
<span class="tok-comment"># add to compose.yaml, service api:   JWT_SECRET: &#36;{JWT_SECRET:?missing}</span>
./deploy.sh 0fa642f
docker compose -f compose.yaml -f compose.prod.yaml exec api printenv JWT_SECRET</code></pre>
<div class="out">0
JWT_SECRET=thu-bi-mat-64-ky-tu
== deploy 0fa642f (đang chạy: c2f59c1)
…
== OK: đang chạy 0fa642f
thu-bi-mat-64-ky-tu</div>
<p><code>config</code> prints the configuration the containers will get: no JWT anywhere. <code>config --environment</code> prints what Compose itself has available for interpolation: the variable IS there. The <code>.env</code> file next to <code>compose.yaml</code> feeds <code>&#36;{…}</code> substitutions and nothing else (Lesson 9.4). Once the YAML passed it — with <code>:?</code> so a missing value stops the deploy instead of starting a broken API — the very same image deployed fine.</p>
<table>
<tr><th>Symptom</th><td>The app reports a missing variable, or silently uses a default, although "it is in .env".</td></tr>
<tr><th>Diagnose</th><td><code>docker compose config</code> (what containers get) vs <code>config --environment</code> (what Compose knows); <code>exec &lt;svc&gt; printenv NAME</code> for the truth.</td></tr>
<tr><th>Rescue</th><td>Pass it via <code>environment:</code> (or <code>env_file:</code>) and <code>up -d</code> — no image rebuild needed.</td></tr>
<tr><th>Prevent</th><td>Every required variable written as <code>&#36;{NAME:?message}</code>; <code>.env.example</code> updated in the same commit.</td></tr>
<tr><th>Chapter</th><td>9.4.</td></tr>
</table>

<h3>Incident 8 — the container lives in UTC</h3>
<pre><code class="language-bash">date '+%F %T %Z'                                             <span class="tok-comment"># the Mac</span>
docker run --rm --entrypoint sh &lt;api-image&gt; -c 'date; node -e "console.log(new Date().toString())"'
docker run --rm -e TZ=Asia/Ho_Chi_Minh --entrypoint sh &lt;api-image&gt; -c 'date; node -e "console.log(new Date().toString())"; ls /usr/share/zoneinfo'
docker compose exec -T db psql -U phongkham -d phongkham -tAc "show timezone"
docker compose exec -T db psql -U phongkham -d phongkham -tAc "select slot, slot at time zone 'UTC' at time zone 'Asia/Ho_Chi_Minh' from bookings where id=1"</code></pre>
<div class="out">2026-09-24 08:24:41 +07
Thu Sep 24 01:24:41 UTC 2026
Thu Sep 24 2026 01:24:41 GMT+0000 (Coordinated Universal Time)
Thu Sep 24 01:24:41 UTC 2026
Thu Sep 24 2026 08:24:41 GMT+0700 (Indochina Time)
ls: /usr/share/zoneinfo: No such file or directory
UTC
2026-10-01 01:00:00|2026-10-01 08:00:00</div>
<p>Five lessons in five lines. The container's clock is the same instant but printed in UTC. <code>TZ</code> fixes Node (it carries its own time-zone data) but not busybox <code>date</code>, because Alpine has no <code>/usr/share/zoneinfo</code> until you <code>apk add tzdata</code>. Postgres also runs in UTC. And the 08:00 appointment is stored as 01:00 UTC — correct, as long as everything converts only when DISPLAYING. The bug appears when one part converts and another does not: an appointment booked at 06:30 in Vietnam is 23:30 the previous day in UTC, so a report "by day" computed in UTC puts it on the wrong date.</p>
<table>
<tr><th>Symptom</th><td>Logs seven hours behind, cron jobs at the wrong hour, appointments on the wrong day in reports.</td></tr>
<tr><th>Diagnose</th><td><code>docker compose exec &lt;svc&gt; date</code>, and <code>show timezone</code> in Postgres.</td></tr>
<tr><th>Rescue</th><td>Convert at display time (<code>toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })</code>, <code>AT TIME ZONE</code> in SQL).</td></tr>
<tr><th>Prevent</th><td>Store UTC, convert at the edges; set <code>TZ</code> (plus <code>tzdata</code> for non-Node tools) only for things that must "think" in local time, like a 07:30 daily job.</td></tr>
<tr><th>Chapter</th><td>2.4.</td></tr>
</table>

<h3>A first-week checklist</h3>
<ul>
<li>Every morning for a week: <code>docker compose ps</code> (all healthy, no restarts), <code>df -h /</code>, the size of last night's dump.</li>
<li>Once: restore last night's dump into a <code>--rm</code> container and count the rows.</li>
<li>Once: <code>docker ps --format '{{.Names}} {{.Ports}}'</code> — only nginx may show <code>0.0.0.0</code>.</li>
<li>Once: reboot the VPS on purpose and check everything comes back by itself (Lesson 11.1).</li>
<li>Once: deploy a deliberately broken tag and watch <code>deploy.sh</code> roll back.</li>
<li>Write down, next to <code>deploy.sh</code>, the last three good tags.</li>
</ul>

<h3>Step by step</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1 · status first</span><span class="lz-t">docker compose -f compose.yaml -f compose.prod.yaml ps</span><span class="lz-d">Restarting? Exited (137)? unhealthy? That decides which incident you are in.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2 · exit code and restarts</span><span class="lz-t">docker inspect &lt;c&gt; -f '{{.State.ExitCode}} {{.State.OOMKilled}} {{.RestartCount}}'</span><span class="lz-d">137 + true = memory; 1 = read the app's log.</span></div>
  <div class="lz-step"><span class="lz-k">Step 3 · the log, recent only</span><span class="lz-t">docker compose logs -t --since 10m api</span><span class="lz-d">Read from the bottom up (Lesson 0.6).</span></div>
  <div class="lz-step"><span class="lz-k">Step 4 · what the container really has</span><span class="lz-t">docker compose exec api printenv | sort; docker compose config api</span><span class="lz-d">Variables, mounts, limits as Docker applied them.</span></div>
  <div class="lz-step"><span class="lz-k">Step 5 · service back first, cause second</span><span class="lz-t">./deploy.sh &lt;last-good-tag&gt;</span><span class="lz-d">Then reproduce the failure calmly on your own machine.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the lecturer says the demo site "went down during the night" and has been slow since. You have SSH access and fifteen minutes before class.</p><ol>
<li>On your practice stack, run the four diagnostic commands in Step by step 1–4 and write down, for every service, its status, exit code, OOMKilled and RestartCount.</li>
<li>Reproduce incident 1 on a throw-away container (<code>--memory 128m --memory-swap 128m</code>) and incident 4 with a container that exits 1 at start-up; read both with <code>docker inspect</code>.</li>
<li>Run a nightly-style backup (<code>exec -T … pg_dump -Fc</code>), restore it into a <code>--rm</code> Postgres and compare the row count of your main table.</li>
<li>List every published port with <code>docker ps --format '{{.Names}} {{.Ports}}'</code> and fix any <code>0.0.0.0</code> that is not your web entry.</li></ol>
<p><strong>Done when:</strong> you can say, for each container, which of the eight incidents it is NOT in and why; the restored row count equals production's; and no database or admin port shows <code>0.0.0.0</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OOMKilled</span><span class="v">The container's process was killed by the kernel for exceeding its memory limit; exit code 137.</span></div>
  <div class="kv"><span class="k">Restart loop / backoff</span><span class="v">A container that keeps exiting and being restarted, with the delay doubling each time.</span></div>
  <div class="kv"><span class="k">pg_dump -Fc / pg_restore</span><span class="v">Postgres' consistent logical backup in compressed custom format, and the tool that restores it.</span></div>
  <div class="kv"><span class="k">Inode</span><span class="v">The file's identity on disk; a single-file bind mount follows the inode, not the path.</span></div>
  <div class="kv"><span class="k">host_ip</span><span class="v">The host address a published port listens on; empty means every interface.</span></div>
  <div class="kv"><span class="k">Interpolation</span><span class="v">Compose replacing <code>&#36;{NAME}</code> in YAML with values from the shell or <code>.env</code> — not the same as passing variables to containers.</span></div>
  <div class="kv"><span class="k">UTC / TZ / tzdata</span><span class="v">The default container clock zone, the variable that changes it, and the package that lets non-Node tools honour it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Logs: <code>-t</code>, <code>--tail</code>, <code>--since</code>; silence the healthcheck's access log so real traffic is visible.</li>
<li>A backup counts only after a restore: <code>pg_dump -Fc</code> with <code>exec -T</code>, restore into a <code>--rm</code> Postgres, compare counts, copy off the server.</li>
<li>Read status and exit code before logs: 137 + OOMKilled is memory, <code>Restarting (1)</code> is the app's own error.</li>
<li>Build green, API 502 is almost always a libc or engine mismatch — roll back, then fix the base image.</li>
<li>No database <code>ports:</code>, directory mounts instead of file mounts, <code>&#36;{VAR:?}</code> for every required variable.</li>
<li>Containers and Postgres live in UTC; store UTC, convert when displaying. And measure the disk — never "fix" it with <code>-a</code> or volume prune in a panic.</li>
</ul>

<a class="link-card" href="https://www.postgresql.org/docs/16/app-pgdump.html" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">pg_dump (PostgreSQL 16)</span><span class="lc-sub">Formats, consistency, and what a dump does and does not contain.</span></span>
</a>
<a class="link-card" href="https://www.postgresql.org/docs/16/app-pgrestore.html" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">pg_restore</span><span class="lc-sub"><code>--list</code>, <code>--no-owner</code>, selective and parallel restores.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/containers/resource_constraints/" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">Resource constraints</span><span class="lc-sub">Memory limits, swap and what happens at the ceiling.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/network/packet-filtering-firewalls/" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">Packet filtering and firewalls</span><span class="lc-sub">Why published ports bypass ufw, and how to restrict them.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/storage/bind-mounts/" target="_blank" rel="noopener">
  <span class="lc-ico">📂</span>
  <span class="lc-body"><span class="lc-title">Bind mounts</span><span class="lc-sub">How files and directories from the host are attached to a container.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/system/df/" target="_blank" rel="noopener">
  <span class="lc-ico">💽</span>
  <span class="lc-body"><span class="lc-title">docker system df</span><span class="lc-sub">Reading disk usage by images, containers, volumes and build cache.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practise in Code Lab</span><span class="lc-sub">Docker exercises with automatic grading.</span></span>
</a>
<p class="note-ct"><strong>Three things to remember.</strong> Status and exit code first, logs second, guesses never. A backup is a backup only after you have restored it. And every one of the eight incidents has a one-line prevention you can put in place this week, before it happens to you.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.4</span>
<h2>Tuần đầu trên production: sao lưu, log và tám sự cố kinh điển</h2>
<p class="lead">Buổi demo trơn tru và app đã lên mạng. Giờ nó phải sống tiếp trong khi bạn ngủ, đi thi và quên béng nó. Bài này dạy ba thói quen một hệ thống nhỏ cần có — đọc log, canh ổ đĩa, và sao lưu theo cách bạn ĐÃ từng khôi phục — rồi tới tám sự cố cứ lặp đi lặp lại với các bản deploy Docker. Sáu sự cố được dựng lại thật trên app của chương; hai sự cố còn lại được chỉ ra bằng cách đo, không phá thứ gì.</p>

<h3>Đọc log mà không bị ngập</h3>
<pre><code class="language-bash">docker compose logs -t --tail 3 api nginx         <span class="tok-comment"># 3 dòng cuối mỗi dịch vụ, kèm dấu thời gian</span>
docker compose logs -t --since 10m api            <span class="tok-comment"># chỉ mười phút gần nhất</span>
docker compose logs -f api                        <span class="tok-comment"># theo dõi trực tiếp; Ctrl+C để thôi theo dõi</span></code></pre>
<div class="out">api-1  | 2026-09-24T01:29:32.869447543Z api 0fa642f nghe cổng 3000
nginx-1  | 2026-09-24T01:30:42.089414298Z 127.0.0.1 - - [24/Sep/2026:01:30:42 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
nginx-1  | 2026-09-24T01:30:52.128028177Z 127.0.0.1 - - [24/Sep/2026:01:30:52 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"
nginx-1  | 2026-09-24T01:31:02.167226418Z 127.0.0.1 - - [24/Sep/2026:01:31:02 +0000] "GET /healthz HTTP/1.1" 200 3 "-" "Wget" "-"</div>
<p>Dòng đầu của API cho biết phiên bản nào đang chạy — đáng in ra ở mỗi lần khởi động. Ba dòng nginx là healthcheck của chính nó, mười giây một lần: 8.640 dòng mỗi ngày chôn vùi lưu lượng thật. Một chỉ thị là sửa xong:</p>
<pre><code>location = /healthz { access_log off; return 200 "ok\\n"; }</code></pre>
<p>Sau thay đổi đó, <code>docker compose logs -t --since 15s nginx api</code> chạy ngay sau một request thật chỉ còn đúng request đó:</p>
<div class="out">nginx-1  | 2026-09-24T01:57:57.111484971Z 172.21.0.1 - - [24/Sep/2026:01:57:57 +0000] "GET /api/slots?day=2026-10-01 HTTP/1.1" 200 248 "-" "curl/8.7.1" "-"</div>
<p>Mọi thứ container ghi ra stdout và stderr là thứ <code>docker logs</code> cho bạn xem; các file đứng sau nó bị giới hạn bởi <code>max-size</code>/<code>max-file</code> ở Bài 16.2 (Bài 11.3 giải thích chúng nằm ở đâu). Mọi dấu thời gian đều theo UTC — sự cố 8.</p>

<h3>Bản sao lưu bạn đã khôi phục thử ít nhất một lần</h3>
${slide('dk-16', 19, 'Sao lưu chỉ có giá trị khi đã khôi phục thử thành công')}
<pre><code class="language-bash">docker compose exec -T db pg_dump -U phongkham -Fc phongkham &gt; backup/phongkham-2026-09-24.dump
ls -l backup/
<span class="tok-comment"># khôi phục vào một Postgres dùng-một-lần — không bao giờ "thử" trên production</span>
docker run -d --rm --name restore -e POSTGRES_PASSWORD=thu postgres:16.4-alpine
docker exec restore createdb -U postgres khoiphuc
docker exec -i restore pg_restore -U postgres -d khoiphuc --no-owner &lt; backup/phongkham-2026-09-24.dump
docker exec restore psql -U postgres -d khoiphuc -c 'select id, patient_name, doctor, slot from bookings order by id'</code></pre>
<div class="out">-rw-r--r--@ 1 admin  wheel  4699 Sep 24 08:24 phongkham-2026-09-24.dump
 id | patient_name |     doctor     |        slot
----+--------------+----------------+---------------------
  1 | Nguyễn Văn A | BS. Lan (Nhi)  | 2026-10-01 01:00:00
  3 | Bệnh nhân 09 | BS. Minh (Nội) | 2026-10-01 02:00:00
  4 | Bệnh nhân 10 | BS. Minh (Nội) | 2026-10-01 03:00:00
  5 | Bệnh nhân 14 | BS. Minh (Nội) | 2026-10-01 07:00:00
  6 | Bệnh nhân 15 | BS. Minh (Nội) | 2026-10-01 08:00:00
(5 rows)</div>
<table>
<tr><th>Chi tiết</th><th>Vì sao</th></tr>
<tr><td><code>exec -T</code></td><td>Không cấp terminal giả: có TTY thì ký tự xuống dòng bị viết lại và bản dump nhị phân hỏng mà không báo gì (Bài 7.5).</td></tr>
<tr><td><code>pg_dump -Fc</code></td><td>Định dạng tuỳ biến có nén của Postgres; <code>pg_restore</code> khôi phục chọn lọc và song song được.</td></tr>
<tr><td>Khôi phục vào một container <code>--rm</code> riêng</td><td>Chứng minh file dùng được mà không liều với CSDL đang chạy; số dòng trên production cũng là 5.</td></tr>
<tr><td>id 2 đâu rồi?</td><td>Lượt đặt lịch bị <code>409</code> (trùng bác sĩ, trùng giờ) đã lấy mất số 2 của sequence trước khi chỉ mục unique từ chối nó. Có lỗ hổng là bình thường; một bản dump "trông sai" thường phản ánh lịch sử thật.</td></tr>
<tr><td><code>pg_dump</code>, không chép volume</td><td>Bản dump nhất quán ngay khi CSDL đang chạy và khôi phục được vào mọi Postgres cùng hoặc mới hơn; <code>tar</code> volume đòi đúng bản chính đó và tốt nhất là CSDL đã dừng (Bài 7.5).</td></tr>
</table>
<p>Một script nhỏ biến việc đó thành việc chạy mỗi đêm; nó từ chối giữ một file rỗng và giữ bảy ngày:</p>
<pre><code class="language-bash">#!/bin/sh
<span class="tok-comment"># sao-luu.sh — dump Postgres ra file có ngày giờ, giữ 7 ngày, kiểm file đọc lại được</span>
set -eu
C="-f compose.yaml -f compose.prod.yaml"
mkdir -p backup
F=backup/phongkham-$(date +%F-%H%M).dump
docker compose $C exec -T db pg_dump -U phongkham -Fc phongkham &gt; "$F"
[ -s "$F" ] || { echo "!! file dump rỗng: $F"; exit 1; }
docker compose $C exec -T db pg_restore --list &lt; "$F" | grep -c "TABLE DATA" | sed "s#^#$F: #; s#\\$# bảng có dữ liệu#"
find backup -name 'phongkham-*.dump' -mtime +7 -print -delete
ls -l backup</code></pre>
<div class="out">backup/phongkham-2026-09-24-0857.dump: 2 bảng có dữ liệu
total 16
-rw-r--r--@ 1 admin  wheel  4723 Sep 24 08:57 phongkham-2026-09-24-0857.dump</div>
<p>"2 bảng có dữ liệu" là <code>bookings</code> và <code>_prisma_migrations</code> của Prisma. Cho cron chạy nó (<code>0 3 * * * cd /srv/phongkham &amp;&amp; ./sao-luu.sh</code>), và — đây là bước người ta hay bỏ — chép file RA KHỎI máy chủ (máy ở nhà, một bucket kiểu S3). Bản sao lưu nằm cùng ổ đĩa với CSDL thì chết cùng ổ đĩa.</p>

<h3>Tám sự cố kinh điển: nhìn vào đâu trước</h3>
${slide('dk-16', 20, 'Tám sự cố kinh điển: triệu chứng nào, gõ lệnh gì trước')}
<p>Mỗi sự cố dưới đây đi theo cùng một khuôn: <strong>triệu chứng</strong> (thứ bạn thấy) → <strong>chẩn đoán</strong> (lệnh đầu tiên) → <strong>cứu</strong> (trả lại dịch vụ ngay) → <strong>phòng</strong> (để nó không quay lại) → <strong>chương</strong> (nơi giải thích cơ chế). Phương pháp chung là Bài 12.1: đọc <code>STATUS</code> trước log, rồi mã thoát, rồi log, rồi <code>inspect</code>.</p>

<h3>Sự cố 1 — mã 137: bị giết vì hết bộ nhớ</h3>
${slide('dk-16', 21, 'Hai kiểu chết: 137 là bị GIẾT, 1 là tự thoát')}
<pre><code class="language-bash">docker run --name oom --memory 128m --memory-swap 128m --entrypoint node &lt;ảnh-api&gt; \\
  -e 'const a=[];let i=0;setInterval(()=&gt;{a.push(Buffer.alloc(20e6,1));console.log("đã giữ",(++i)*20,"MB")},100)'
docker inspect oom -f 'ExitCode={{.State.ExitCode}} OOMKilled={{.State.OOMKilled}}'</code></pre>
<div class="out">đã giữ 60 MB
đã giữ 80 MB
đã giữ 100 MB
đã giữ 120 MB
ExitCode=137 OOMKilled=true</div>
<table>
<tr><th>Triệu chứng</th><td><code>Exited (137)</code> hoặc một lần restart mà log của app không có lỗi nào — tiến trình không kịp viết gì.</td></tr>
<tr><th>Chẩn đoán</th><td><code>docker inspect -f '{{.State.OOMKilled}}' &lt;c&gt;</code> → <code>true</code>; <code>docker stats --no-stream</code> để xem các container khác sát trần tới đâu.</td></tr>
<tr><th>Cứu</th><td>Nâng trần trong <code>compose.prod.yaml</code> rồi <code>up -d</code>, hoặc giảm thứ tiến trình giữ trong bộ nhớ (với Node, <code>NODE_OPTIONS=--max-old-space-size=…</code> thấp hơn trần container).</td></tr>
<tr><th>Phòng</th><td>Đặt trần từ số đo lúc có tải, không bao giờ build trên máy chủ production (một lần <code>next build</code> nguội là đỉnh bộ nhớ lớn nhất mà phần lớn dự án nhỏ từng có), chừa khoảng trống cho hệ điều hành.</td></tr>
<tr><th>Chương</th><td>2.5, 11.2 — và 1.1 cho chuyện vì sao <code>--memory-swap</code> quan trọng.</td></tr>
</table>
<p>Một dự án sinh viên dính đúng chuyện này: hai lượt build ảnh nguội chạy song song trên VPS 6 GB, và <code>next build</code> bị giết với mã 137. Cách chữa là build tuần tự, rồi sau đó thôi hẳn việc build trên VPS.</p>

<h3>Sự cố 2 — build xanh, API 502: sai libc</h3>
<pre><code class="language-bash"><span class="tok-comment"># ảnh build trên Debian (bookworm-slim), chạy trên Alpine</span>
docker compose ps api --format '{{.Service}} {{.Image}} {{.Status}}'
for i in 1 2 3; do curl -s -o /dev/null -w '%{http_code} ' "http://127.0.0.1:18160/api/slots?day=2026-10-01"; sleep 1; done
docker compose logs api
docker logs nginx 2&gt;&amp;1 | grep upstream | tail -2
docker inspect api -f 'RestartCount={{.RestartCount}}'</code></pre>
<div class="out">api localhost:18165/dk16-phongkham-api:sai-libc Restarting (1) 3 seconds ago
502 502 502
api sai-libc nghe cổng 3000
PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-arm64-openssl-3.0.x".
This happened because Prisma Client was generated for "linux-arm64-openssl-1.1.x", but the actual deployment required "linux-musl-arm64-openssl-3.0.x".
…
2026/09/24 01:26:17 [error] 22#22: *51 connect() failed (111: Connection refused) while connecting to upstream, … upstream: "http://172.21.0.2:3000/api/slots?day=2026-10-01" …
2026/09/24 01:26:33 [error] 22#22: *53 connect() failed (113: Host is unreachable) while connecting to upstream, … upstream: "http://172.21.0.2:3000/api/slots?day=2026-10-01" …
RestartCount=12</div>
<table>
<tr><th>Triệu chứng</th><td>Build và đẩy ảnh đều xanh; trang trả 502; API ở trạng thái <code>Restarting (1)</code>.</td></tr>
<tr><th>Chẩn đoán</th><td><code>docker compose logs api</code> — lỗi gọi tên cả hai đích. Liệt kê engine: <code>docker run --rm --entrypoint sh &lt;ảnh&gt; -c 'ls node_modules/.prisma/client | grep node'</code>.</td></tr>
<tr><th>Cứu</th><td>Quay về tag trước (<code>deploy.sh</code> làm giùm bạn, Bài 16.3).</td></tr>
<tr><th>Phòng</th><td>Cài và chạy trên cùng một ảnh nền (Bài 16.1); cho script build khởi động ảnh với một CSDL dùng-một-lần trước khi đẩy lên.</td></tr>
<tr><th>Chương</th><td>6.2, 12.4.</td></tr>
</table>
<p>Hai dòng nginx là hai khoảnh khắc khác nhau của vòng lặp: <code>111: Connection refused</code> — container còn đó nhưng chưa có gì lắng nghe; <code>113: Host is unreachable</code> — container đang ở giữa hai lần khởi động lại và địa chỉ của nó đã biến mất. Để ý thêm thứ tự trong log của API: server in "nghe cổng" trước rồi mới chết một nhịp sau, lúc Prisma nạp engine. Một healthcheck chỉ hỏi "cổng có mở không?" có thể báo healthy ở khoảng giữa; một healthcheck chạy <code>SELECT 1</code> thì không. Một dự án sinh viên từng mất API bảy phút vì đúng tổ hợp này — một ảnh Alpine mang engine <code>debian-openssl-3.0.x</code> vì một lượt build dùng <code>Dockerfile</code> mặc định thay vì file đúng.</p>

<h3>Sự cố 3 — "no space left on device": ổ đĩa đầy</h3>
${slide('dk-16', 25, 'Đĩa đầy: đo trước, dọn có chọn lọc, và đừng bao giờ -a trên máy chủ lúc hoảng')}
<p>Sự cố này KHÔNG được dựng lại — làm đầy một ổ đĩa thật đúng là loại thí nghiệm khoá này cấm. Việc làm được một cách an toàn là đo. Chính chiếc laptop dùng để soạn khoá:</p>
<pre><code class="language-bash">docker system df</code></pre>
<div class="out">TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          69        17        37.01GB   24.82GB (67%)
Containers      30        4         882.5MB   553.7MB (62%)
Local Volumes   70        23        9.125GB   4.086GB (44%)
Build Cache     587       15        36.45GB   20.26GB</div>
<p>Cache build (36 GB) lớn hơn tất cả ảnh cộng lại. Trên một VPS tự build ảnh của nó, đám cache đó nằm cùng ổ đĩa với Postgres. Một lượt deploy của một dự án sinh viên chết giữa chừng với <code>no space left on device</code> khi ổ đĩa tụt xuống còn trống 1,8 GB trong lúc <code>next build</code>; 7,6 GB trong số đó là cache build.</p>
<table>
<tr><th>Triệu chứng</th><td><code>no space left on device</code> trong lúc build hoặc trong log của Postgres; Postgres có thể từ chối ghi hoặc sập.</td></tr>
<tr><th>Chẩn đoán</th><td><code>df -h /</code> trước (có thật là do Docker không?), rồi <code>docker system df</code>, rồi <code>docker system df -v</code> để thấy từng thứ to.</td></tr>
<tr><th>Cứu</th><td>Từ an toàn nhất tới liều nhất: <code>docker builder prune --filter until=168h</code>; <code>docker image prune --filter until=168h</code> (không <code>-a</code>, để các ảnh có tag cũ — đường quay lui — còn đó); log container cũ nếu trước đó thiếu xoay log. Không bao giờ <code>docker volume prune</code> trên máy chủ lúc đang hoảng.</td></tr>
<tr><th>Phòng</th><td>Build ở nơi khác (Bài 16.3), xoay log (16.2), một việc dọn hằng tuần có filter, và cảnh báo khi đĩa vượt 80%.</td></tr>
<tr><th>Chương</th><td>3.5, 11.3, 11.5.</td></tr>
</table>

<h3>Sự cố 4 — restart vòng lặp</h3>
<pre><code class="language-bash">docker run -d --name loop --restart unless-stopped &lt;ảnh-api:0fa642f&gt;   <span class="tok-comment"># không đặt JWT_SECRET</span>
sleep 25
docker ps --filter name=loop --format '{{.Names}} {{.Status}}'
docker inspect loop -f 'ExitCode={{.State.ExitCode}} RestartCount={{.RestartCount}} Restarting={{.State.Restarting}}'
docker logs --tail 2 loop
docker events --since 25s --until 0s --filter container=loop --filter event=die --format '{{.Time}} {{.Action}} exitCode={{.Actor.Attributes.exitCode}}' | tail -4</code></pre>
<div class="out">dk16-loop Restarting (1) 10 seconds ago
ExitCode=1 RestartCount=8 Restarting=true
thiếu biến môi trường JWT_SECRET — dừng
thiếu biến môi trường JWT_SECRET — dừng
1790215099 die exitCode=1
1790215101 die exitCode=1
1790215105 die exitCode=1
1790215112 die exitCode=1</div>
<p>Tám lần khởi động lại trong 25 giây, và khoảng cách giữa mấy lần chết cuối là 2, 4 và 7 giây: Docker nhân đôi độ trễ giữa các lần khởi động lại (tối đa một phút) để một container hỏng không đốt CPU (Bài 11.1). <code>Restarting (1)</code> nói rằng chính app đã tự thoát với mã 1 — đọc log của nó, không phải log của nhân.</p>
<table>
<tr><th>Triệu chứng</th><td><code>Restarting (N)</code> trong <code>docker ps</code>, <code>RestartCount</code> cứ tăng, nginx trả 502.</td></tr>
<tr><th>Chẩn đoán</th><td>Mã thoát chọn đường đi (Bài 12.1): 1 → log của chính app; 137 → sự cố 1; 127/126 → sai lệnh hoặc sai quyền (Bài 12.2).</td></tr>
<tr><th>Cứu</th><td>Quay lui tag, hoặc bổ sung đầu vào còn thiếu (ở đây: sự cố 7).</td></tr>
<tr><th>Phòng</th><td><code>up --wait</code> + smoke test trong lượt deploy (Bài 16.3) — một vòng lặp không bao giờ lọt qua lượt deploy mà không ai hay.</td></tr>
<tr><th>Chương</th><td>11.1, 12.3.</td></tr>
</table>

<h3>Sự cố 5 — cổng CSDL mở ra Internet</h3>
${slide('dk-16', 23, 'ports: không ghi IP là mở cho MỌI mạng — trừ khi dịch vụ chỉ ở mạng internal')}
<p>Không dựng lại với một cổng công khai — buổi diễn tập chỉ bao giờ gắn vào <code>127.0.0.1</code>. Đọc cấu hình đã trộn là thấy khác biệt mà không phải mở gì:</p>
<pre><code class="language-bash"><span class="tok-comment"># lo-cong.yaml: ports: ["18166:5432"] — chỉ đọc config, KHÔNG khởi động</span>
docker compose -f compose.yaml -f compose.prod.yaml -f lo-cong.yaml config db | grep -A4 ' ports:'
<span class="tok-comment"># an-toan.yaml: ports: ["127.0.0.1:18166:5432"]</span>
docker compose -f compose.yaml -f compose.prod.yaml -f an-toan.yaml config db | grep host_ip</code></pre>
<div class="out">    ports:
      - mode: ingress
        target: 5432
        published: "18166"
        protocol: tcp
        host_ip: 127.0.0.1</div>
<p>Không có <code>host_ip</code> nghĩa là mọi giao diện: <code>0.0.0.0</code> và <code>[::]</code>. Trên máy chủ Linux, Docker tự viết luật iptables cho các cổng công bố, và chúng được xét TRƯỚC luật của <code>ufw</code> — nên câu "tường lửa chặn 5432 rồi" là sai (Bài 8.2). Cùng khuôn mẫu đó có ngay trên chiếc Mac dùng để soạn khoá, ở một CSDL phát triển không thuộc app này:</p>
<pre><code class="language-bash">docker ps --filter name=cuong_pg_new --format '{{.Names}} [{{.Ports}}]'</code></pre>
<div class="out">cuong_pg_new [0.0.0.0:5434-&gt;5432/tcp, [::]:5434-&gt;5432/tcp]</div>
<p>Postgres đó trả lời bất kỳ ai cùng mạng Wi-Fi mà biết mật khẩu. Và thêm một phát hiện thật: áp file ghi đè <code>127.0.0.1:18166:5432</code> cho <code>db</code> của chương — vốn chỉ ở mạng <code>internal: true</code> — thì không có gì được công bố cả:</p>
<pre><code class="language-bash">docker compose ps db --format '{{.Status}} [{{.Ports}}]'
nc -z -w 3 127.0.0.1 18166 || echo đóng</code></pre>
<div class="out">Up 9 seconds (healthy) [5432/tcp]
đóng</div>
<table>
<tr><th>Triệu chứng</th><td>Thường là không có gì — cho tới khi log Postgres hiện những lượt đăng nhập lạ, hoặc dữ liệu biến mất và một bảng "đòi tiền chuộc" nằm thế chỗ.</td></tr>
<tr><th>Chẩn đoán</th><td><code>docker ps --format '{{.Names}} {{.Ports}}'</code> rồi tìm <code>0.0.0.0</code> ở bất cứ thứ gì không phải lối vào web.</td></tr>
<tr><th>Cứu</th><td>Bỏ dòng <code>ports:</code> (hoặc gắn <code>127.0.0.1</code>), <code>up -d</code>, đổi mật khẩu CSDL, và rà log tìm kết nối lạ.</td></tr>
<tr><th>Phòng</th><td>CSDL nằm trong mạng <code>internal: true</code>; tự mình cần vào thì dùng đường hầm SSH: <code>ssh -L 5432:&lt;ip-db&gt;:5432 vps</code>.</td></tr>
<tr><th>Chương</th><td>8.2 (có một sự cố thật), 8.4.</td></tr>
</table>

<h3>Sự cố 6 — sửa cấu hình bằng mv; reload báo OK; không có gì thay đổi</h3>
${slide('dk-16', 22, 'Sửa file cấu hình bằng mv: reload “thành công”, không gì thay đổi')}
<p>Dựng lại trên máy Linux (Docker Engine 29.6), với một file đơn được bind mount vào nginx:</p>
<pre><code class="language-bash">docker run -d --name ng -p 127.0.0.1:18167:80 -v $PWD/default.conf:/etc/nginx/conf.d/default.conf:ro nginx:1.27-alpine
sleep 2; curl -s 127.0.0.1:18167
<span class="tok-comment"># 1) sửa bằng cách ghi file mới rồi đổi tên — đúng cách sed -i, vim và git làm</span>
sed "s/phien-ban-1/phien-ban-2/" default.conf &gt; default.conf.moi &amp;&amp; mv default.conf.moi default.conf
docker exec ng nginx -t 2&gt;&amp;1 | tail -1; docker exec ng nginx -s reload 2&gt;/dev/null; sleep 1; curl -s 127.0.0.1:18167
echo "host      $(stat -c 'inode=%i' default.conf) $(sha256sum default.conf | cut -c1-12)"
echo "container $(docker exec ng stat -c 'inode=%i' /etc/nginx/conf.d/default.conf) $(docker exec ng sha256sum /etc/nginx/conf.d/default.conf | cut -c1-12)"
<span class="tok-comment"># 2) cứu: khởi động lại container</span>
docker restart ng &gt;/dev/null; sleep 2; curl -s 127.0.0.1:18167
<span class="tok-comment"># 3) phòng: ghi đè TẠI CHỖ rồi reload</span>
sed "s/phien-ban-2/phien-ban-3/" default.conf &gt; /tmp/moi &amp;&amp; cat /tmp/moi &gt; default.conf
docker exec ng nginx -s reload 2&gt;/dev/null; sleep 1; curl -s 127.0.0.1:18167</code></pre>
<div class="out">phien-ban-1
nginx: configuration file /etc/nginx/nginx.conf test is successful
phien-ban-1
host      inode=5516765 3155f529d56d
container inode=5516764 366391d755d7
phien-ban-2
phien-ban-3</div>
<p>Bind mount một file đơn được gắn theo <em>inode</em> (số định danh của file trên đĩa) lúc container khởi động, không theo đường dẫn. <code>mv</code> trỏ đường dẫn sang một inode mới; container vẫn đọc inode cũ, nên <code>nginx -t</code> kiểm file CŨ (hợp lệ), <code>reload</code> nạp lại file CŨ, và mọi thứ báo thành công. <code>docker restart</code> gắn lại theo đường dẫn. Ghi tại chỗ bằng <code>cat mới &gt; file</code> giữ nguyên inode. Và <code>git</code> thay file ở mỗi lần checkout — đo trên máy Mac: inode của <code>nginx/default.conf</code> đổi từ 59098024 thành 59098032 sau một lệnh <code>git checkout --</code>. Đó là lý do file Compose của chương gắn <em>thư mục</em> <code>./nginx</code>, và vì sao <code>deploy.sh</code> cứ việc <code>git checkout</code> rồi reload.</p>
<table>
<tr><th>Triệu chứng</th><td>Bạn đổi cấu hình nginx, <code>nginx -t</code> và <code>reload</code> đều thành công, trang web vẫn hành xử như cũ.</td></tr>
<tr><th>Chẩn đoán</th><td>So <code>sha256sum</code> của file trên máy chủ và BÊN TRONG container. Khác nhau = inode cũ.</td></tr>
<tr><th>Cứu</th><td><code>docker restart nginx</code> (hoặc <code>docker compose up -d --force-recreate nginx</code>).</td></tr>
<tr><th>Phòng</th><td>Gắn thư mục, không gắn file; bắt buộc gắn file thì ghi tại chỗ và kiểm mã băm từ bên trong.</td></tr>
<tr><th>Chương</th><td>7.3, 10.5.</td></tr>
</table>
<p>Một dự án sinh viên dính chuyện này hai lần liền: script deploy thay <code>nginx.conf</code> bằng <code>mv</code>, <code>nginx -t</code> và <code>reload</code> đều qua, script in OK, vậy mà HTTP/2 vẫn tắt và mọi header cache vẫn sai — cho tới khi có người so mã băm từ bên trong container.</p>

<h3>Sự cố 7 — biến có trong .env, nhưng không có trong container</h3>
${slide('dk-16', 24, '.env chỉ để Compose nội suy; container mặc định sống ở UTC')}
<pre><code class="language-bash"><span class="tok-comment"># .env trên máy chủ đã có JWT_SECRET=…</span>
docker compose -f compose.yaml -f compose.prod.yaml config | grep -c JWT
docker compose -f compose.yaml -f compose.prod.yaml config --environment | grep JWT
<span class="tok-comment"># thêm vào compose.yaml, dịch vụ api:   JWT_SECRET: &#36;{JWT_SECRET:?thiếu}</span>
./deploy.sh 0fa642f
docker compose -f compose.yaml -f compose.prod.yaml exec api printenv JWT_SECRET</code></pre>
<div class="out">0
JWT_SECRET=thu-bi-mat-64-ky-tu
== deploy 0fa642f (đang chạy: c2f59c1)
…
== OK: đang chạy 0fa642f
thu-bi-mat-64-ky-tu</div>
<p><code>config</code> in ra cấu hình mà các container sẽ nhận: không có JWT ở đâu cả. <code>config --environment</code> in ra thứ chính Compose có trong tay để nội suy: biến CÓ ở đó. File <code>.env</code> nằm cạnh <code>compose.yaml</code> chỉ cấp giá trị cho các chỗ thay <code>&#36;{…}</code>, ngoài ra không làm gì khác (Bài 9.4). Khi YAML đã truyền nó vào — với <code>:?</code> để một giá trị bị thiếu làm dừng lượt deploy thay vì dựng lên một API hỏng — CHÍNH cái ảnh cũ deploy trơn tru.</p>
<table>
<tr><th>Triệu chứng</th><td>App báo thiếu biến, hoặc lặng lẽ dùng giá trị mặc định, dù "đã có trong .env rồi".</td></tr>
<tr><th>Chẩn đoán</th><td><code>docker compose config</code> (thứ container nhận) so với <code>config --environment</code> (thứ Compose biết); <code>exec &lt;svc&gt; printenv TÊN</code> cho sự thật.</td></tr>
<tr><th>Cứu</th><td>Truyền nó qua <code>environment:</code> (hoặc <code>env_file:</code>) rồi <code>up -d</code> — không cần build lại ảnh.</td></tr>
<tr><th>Phòng</th><td>Mọi biến bắt buộc viết dạng <code>&#36;{TÊN:?thông báo}</code>; <code>.env.example</code> cập nhật trong cùng commit.</td></tr>
<tr><th>Chương</th><td>9.4.</td></tr>
</table>

<h3>Sự cố 8 — container sống theo giờ UTC</h3>
<pre><code class="language-bash">date '+%F %T %Z'                                             <span class="tok-comment"># máy Mac</span>
docker run --rm --entrypoint sh &lt;ảnh-api&gt; -c 'date; node -e "console.log(new Date().toString())"'
docker run --rm -e TZ=Asia/Ho_Chi_Minh --entrypoint sh &lt;ảnh-api&gt; -c 'date; node -e "console.log(new Date().toString())"; ls /usr/share/zoneinfo'
docker compose exec -T db psql -U phongkham -d phongkham -tAc "show timezone"
docker compose exec -T db psql -U phongkham -d phongkham -tAc "select slot, slot at time zone 'UTC' at time zone 'Asia/Ho_Chi_Minh' from bookings where id=1"</code></pre>
<div class="out">2026-09-24 08:24:41 +07
Thu Sep 24 01:24:41 UTC 2026
Thu Sep 24 2026 01:24:41 GMT+0000 (Coordinated Universal Time)
Thu Sep 24 01:24:41 UTC 2026
Thu Sep 24 2026 08:24:41 GMT+0700 (Indochina Time)
ls: /usr/share/zoneinfo: No such file or directory
UTC
2026-10-01 01:00:00|2026-10-01 08:00:00</div>
<p>Năm bài học trong năm dòng. Đồng hồ của container là cùng một thời điểm nhưng in theo UTC. <code>TZ</code> sửa được Node (nó mang sẵn dữ liệu múi giờ) nhưng không sửa được <code>date</code> của busybox, vì Alpine không có <code>/usr/share/zoneinfo</code> cho tới khi bạn <code>apk add tzdata</code>. Postgres cũng chạy theo UTC. Và lịch hẹn 08:00 được lưu là 01:00 UTC — đúng, miễn là mọi thứ chỉ quy đổi lúc HIỂN THỊ. Lỗi xuất hiện khi một phần quy đổi còn phần kia thì không: một lịch hẹn đặt lúc 06:30 ở Việt Nam là 23:30 hôm trước theo UTC, nên một báo cáo "theo ngày" tính bằng UTC sẽ xếp nó vào sai ngày.</p>
<table>
<tr><th>Triệu chứng</th><td>Log chậm bảy tiếng, việc hẹn giờ chạy sai giờ, lịch hẹn rơi vào sai ngày trong báo cáo.</td></tr>
<tr><th>Chẩn đoán</th><td><code>docker compose exec &lt;svc&gt; date</code>, và <code>show timezone</code> trong Postgres.</td></tr>
<tr><th>Cứu</th><td>Quy đổi lúc hiển thị (<code>toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })</code>, <code>AT TIME ZONE</code> trong SQL).</td></tr>
<tr><th>Phòng</th><td>Lưu UTC, quy đổi ở rìa; chỉ đặt <code>TZ</code> (cộng <code>tzdata</code> cho công cụ không phải Node) cho những thứ phải "nghĩ" theo giờ địa phương, như một việc chạy lúc 07:30 mỗi ngày.</td></tr>
<tr><th>Chương</th><td>2.4.</td></tr>
</table>

<h3>Danh sách kiểm cho tuần đầu</h3>
<ul>
<li>Mỗi sáng trong một tuần: <code>docker compose ps</code> (mọi thứ healthy, không restart), <code>df -h /</code>, kích thước bản dump đêm qua.</li>
<li>Một lần: khôi phục bản dump đêm qua vào một container <code>--rm</code> và đếm dòng.</li>
<li>Một lần: <code>docker ps --format '{{.Names}} {{.Ports}}'</code> — chỉ nginx được phép có <code>0.0.0.0</code>.</li>
<li>Một lần: cố ý khởi động lại VPS và kiểm mọi thứ tự lên lại (Bài 11.1).</li>
<li>Một lần: deploy một tag cố ý hỏng và nhìn <code>deploy.sh</code> quay lui.</li>
<li>Ghi lại, ngay cạnh <code>deploy.sh</code>, ba tag tốt gần nhất.</li>
</ul>

<h3>Chạy thử từng bước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1 · trạng thái trước tiên</span><span class="lz-t">docker compose -f compose.yaml -f compose.prod.yaml ps</span><span class="lz-d">Restarting? Exited (137)? unhealthy? Điều đó quyết định bạn đang ở sự cố nào.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2 · mã thoát và số lần restart</span><span class="lz-t">docker inspect &lt;c&gt; -f '{{.State.ExitCode}} {{.State.OOMKilled}} {{.RestartCount}}'</span><span class="lz-d">137 + true = bộ nhớ; 1 = đọc log của app.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3 · log, chỉ phần gần đây</span><span class="lz-t">docker compose logs -t --since 10m api</span><span class="lz-d">Đọc từ dưới lên (Bài 0.6).</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4 · container thật sự có gì</span><span class="lz-t">docker compose exec api printenv | sort; docker compose config api</span><span class="lz-d">Biến, phép gắn, trần tài nguyên đúng như Docker đã áp.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 5 · trả dịch vụ trước, tìm nguyên nhân sau</span><span class="lz-t">./deploy.sh &lt;tag-tốt-gần-nhất&gt;</span><span class="lz-d">Rồi bình tĩnh dựng lại lỗi trên máy của bạn.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> thầy nhắn trang demo "sập trong đêm" và từ đó tới giờ cứ chậm. Bạn có quyền SSH và mười lăm phút trước giờ vào lớp.</p><ol>
<li>Trên stack luyện tập của bạn, chạy bốn lệnh chẩn đoán ở các bước 1–4 phần Chạy thử từng bước và ghi lại, cho từng dịch vụ: trạng thái, mã thoát, OOMKilled và RestartCount.</li>
<li>Dựng lại sự cố 1 trên một container dùng-một-lần (<code>--memory 128m --memory-swap 128m</code>) và sự cố 4 bằng một container thoát 1 lúc khởi động; đọc cả hai bằng <code>docker inspect</code>.</li>
<li>Chạy một lượt sao lưu kiểu hằng đêm (<code>exec -T … pg_dump -Fc</code>), khôi phục vào một Postgres <code>--rm</code> và so số dòng của bảng chính.</li>
<li>Liệt kê mọi cổng được công bố bằng <code>docker ps --format '{{.Names}} {{.Ports}}'</code> và sửa mọi <code>0.0.0.0</code> không phải lối vào web.</li></ol>
<p><strong>Đạt khi:</strong> với từng container, bạn nói được nó KHÔNG rơi vào sự cố nào trong tám sự cố và vì sao; số dòng khôi phục bằng số dòng trên production; và không cổng CSDL hay trang quản trị nào hiện <code>0.0.0.0</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OOMKilled (bị giết vì hết bộ nhớ)</span><span class="v">Tiến trình của container bị nhân giết vì vượt trần bộ nhớ; mã thoát 137.</span></div>
  <div class="kv"><span class="k">Restart loop / backoff (vòng lặp khởi động lại / giãn nhịp)</span><span class="v">Container cứ thoát rồi được khởi động lại, độ trễ giữa các lần nhân đôi dần.</span></div>
  <div class="kv"><span class="k">pg_dump -Fc / pg_restore (sao lưu / khôi phục)</span><span class="v">Bản sao lưu logic nhất quán của Postgres ở định dạng tuỳ biến có nén, và công cụ khôi phục nó.</span></div>
  <div class="kv"><span class="k">Inode (số định danh file)</span><span class="v">Danh tính của file trên đĩa; bind mount một file đơn đi theo inode, không theo đường dẫn.</span></div>
  <div class="kv"><span class="k">host_ip (địa chỉ nghe trên máy chủ)</span><span class="v">Địa chỉ của máy chủ mà một cổng công bố lắng nghe; để trống nghĩa là mọi giao diện.</span></div>
  <div class="kv"><span class="k">Interpolation (nội suy)</span><span class="v">Compose thay <code>&#36;{TÊN}</code> trong YAML bằng giá trị từ shell hoặc <code>.env</code> — không giống việc truyền biến vào container.</span></div>
  <div class="kv"><span class="k">UTC / TZ / tzdata (giờ quốc tế / biến múi giờ / dữ liệu múi giờ)</span><span class="v">Múi giờ mặc định của đồng hồ container, biến để đổi nó, và gói giúp các công cụ không phải Node hiểu biến đó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Log: <code>-t</code>, <code>--tail</code>, <code>--since</code>; tắt access log của healthcheck để thấy được lưu lượng thật.</li>
<li>Sao lưu chỉ được tính khi đã khôi phục: <code>pg_dump -Fc</code> với <code>exec -T</code>, khôi phục vào Postgres <code>--rm</code>, so số dòng, chép ra khỏi máy chủ.</li>
<li>Đọc trạng thái và mã thoát trước log: 137 + OOMKilled là bộ nhớ, <code>Restarting (1)</code> là lỗi của chính app.</li>
<li>Build xanh mà API 502 gần như luôn là lệch libc hoặc engine — quay lui trước, sửa ảnh nền sau.</li>
<li>CSDL không có <code>ports:</code>, gắn thư mục thay vì gắn file, <code>&#36;{BIẾN:?}</code> cho mọi biến bắt buộc.</li>
<li>Container và Postgres sống theo UTC; lưu UTC, quy đổi lúc hiển thị. Và đo ổ đĩa — đừng bao giờ "chữa" nó bằng <code>-a</code> hay volume prune lúc đang hoảng.</li>
</ul>

<a class="link-card" href="https://www.postgresql.org/docs/16/app-pgdump.html" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">pg_dump (PostgreSQL 16)</span><span class="lc-sub">Các định dạng, tính nhất quán, và bản dump chứa gì, không chứa gì.</span></span>
</a>
<a class="link-card" href="https://www.postgresql.org/docs/16/app-pgrestore.html" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">pg_restore</span><span class="lc-sub"><code>--list</code>, <code>--no-owner</code>, khôi phục chọn lọc và song song.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/containers/resource_constraints/" target="_blank" rel="noopener">
  <span class="lc-ico">🧠</span>
  <span class="lc-body"><span class="lc-title">Giới hạn tài nguyên</span><span class="lc-sub">Trần bộ nhớ, swap và chuyện gì xảy ra khi chạm trần.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/network/packet-filtering-firewalls/" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">Lọc gói tin và tường lửa</span><span class="lc-sub">Vì sao cổng công bố đi vòng qua ufw, và cách giới hạn chúng.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/storage/bind-mounts/" target="_blank" rel="noopener">
  <span class="lc-ico">📂</span>
  <span class="lc-body"><span class="lc-title">Bind mount</span><span class="lc-sub">File và thư mục của máy chủ được gắn vào container thế nào.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/system/df/" target="_blank" rel="noopener">
  <span class="lc-ico">💽</span>
  <span class="lc-body"><span class="lc-title">docker system df</span><span class="lc-sub">Đọc dung lượng dùng theo ảnh, container, volume và cache build.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trong Code Lab</span><span class="lc-sub">Bài tập Docker có chấm tự động.</span></span>
</a>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Trạng thái và mã thoát trước, log sau, đoán mò thì không bao giờ. Bản sao lưu chỉ là bản sao lưu sau khi bạn đã khôi phục nó. Và sự cố nào trong tám sự cố cũng có một dòng phòng ngừa bạn đặt được ngay tuần này, trước khi nó xảy ra với mình.</p>
</div>
`,
    },
    /* ─────────────────────────── 16.5 ─────────────────────────── */
    {
      title: '16.5 — Final exam: the whole course in 20 situations|||16.5 — Bài thi cuối khoá: cả khoá trong 20 tình huống',
      slug: 'dk-16-5-kiem-tra-cuoi-khoa',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Bài thi cuối khoá Docker: 20 câu tình huống trải đều từ Mục 0 tới Chương 16, 30 phút, mỗi câu có lời giải thích vì sao đúng và vì sao phương án hấp dẫn nhất lại sai.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Final exam</span>
<h2>The whole course in 20 situations</h2>
<p class="lead">This is the last page of the course. Twenty questions, thirty minutes, spread evenly from "what a container is" to "the deploy that rolled itself back". None of them asks for a definition. Each describes something that went wrong — most of them things that really went wrong while this course was being written — and asks what you would do.</p>
<p>How to take it: do it once without notes, in one sitting. Then read every explanation, including those of the questions you got right; the explanation says why the most tempting wrong answer is wrong, and that is where most of the learning is. If you score below 15, the checklist below tells you which part of the course to reread — use the "Chapter" column of the cheat sheet in slide 28 as your map.</p>
${slide('dk-16', 26, 'Cả khoá trong sáu cụm — bài thi cuối khoá phủ đều cả sáu')}
<h3>Self-check before you start</h3>
<p>Tick what you can do WITHOUT looking anything up. Every line is a skill the course built, grouped the way slide 26 groups the chapters.</p>
<ul>
<li><strong>Foundations (Section 0–3).</strong> I can explain a container as a process with namespaces and cgroups, say which kernel a container on my Mac really uses, read an image name into its four parts, pin by tag or digest, and fix <code>exec format error</code>.</li>
<li><strong>Building images (4–6).</strong> I can write a <code>.dockerignore</code> and a three-stage Dockerfile, order it for the cache, keep secrets out of layers and history, choose between Alpine and Debian knowing the musl/glibc trap, and run as non-root.</li>
<li><strong>Data and networks (7–8).</strong> I can choose between volume, bind mount and tmpfs, back up and restore a database, put services on user-defined networks, call them by name, and never publish a database to <code>0.0.0.0</code>.</li>
<li><strong>Compose and operations (9–12).</strong> I can write healthchecks and <code>depends_on</code> conditions, separate dev and prod files, set restart, memory and log limits, deploy by commit tag, roll back, and diagnose from <code>STATUS</code> and exit code before logs.</li>
<li><strong>Beyond (13–15).</strong> I can give my team a Dev Container or a <code>watch</code> loop, run a throw-away database for tests, borrow a tool with <code>docker run --rm -v "$PWD":/w</code>, and explain why the <code>docker</code> group is effectively root.</li>
<li><strong>The capstone (16).</strong> I can take an app from its first Dockerfile to a server that deploys by tag, checks itself and rolls back — and name the eight classic incidents with their first command.</li>
</ul>
${slide('dk-16', 28, 'Bảng tra nhanh Chương 16')}
<p class="note-ct">Thank you for coming this far. Docker is now a tool you can reason about, not a list of commands to copy — and the proof is in the next thirty minutes.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài thi cuối khoá</span>
<h2>Cả khoá trong 20 tình huống</h2>
<p class="lead">Đây là trang cuối của khoá học. Hai mươi câu, ba mươi phút, trải đều từ "container là gì" tới "lượt deploy tự quay lui". Không câu nào hỏi định nghĩa. Mỗi câu kể một chuyện đã hỏng — phần lớn là chuyện đã hỏng THẬT trong lúc soạn khoá này — và hỏi bạn sẽ làm gì.</p>
<p>Cách làm: làm một lượt, không mở tài liệu, ngồi một mạch. Rồi đọc mọi lời giải thích, kể cả của những câu bạn làm đúng; lời giải thích nói vì sao phương án hấp dẫn nhất lại sai, và phần lớn cái bạn học được nằm ở đó. Nếu dưới 15 câu, danh sách tự kiểm bên dưới chỉ cho bạn phần nào của khoá cần đọc lại — dùng cột "Chương" trong bảng tra nhanh ở slide 28 làm bản đồ.</p>
${slide('dk-16', 26, 'Cả khoá trong sáu cụm — bài thi cuối khoá phủ đều cả sáu')}
<h3>Tự kiểm trước khi làm</h3>
<p>Đánh dấu những gì bạn làm được mà KHÔNG phải tra cứu. Mỗi dòng là một năng lực khoá học đã xây, nhóm theo đúng cách slide 26 nhóm các chương.</p>
<ul>
<li><strong>Nền tảng (Mục 0–3).</strong> Tôi giải thích được container là một tiến trình có namespace và cgroup, nói được container trên máy Mac của tôi thật ra dùng nhân nào, tách một tên ảnh thành bốn phần, ghim bằng tag hoặc digest, và sửa được <code>exec format error</code>.</li>
<li><strong>Dựng ảnh (Chương 4–6).</strong> Tôi viết được <code>.dockerignore</code> và Dockerfile ba stage, sắp thứ tự cho cache, giữ bí mật ngoài tầng ảnh và ngoài lịch sử, chọn giữa Alpine và Debian khi đã biết bẫy musl/glibc, và chạy bằng user không-root.</li>
<li><strong>Dữ liệu và mạng (Chương 7–8).</strong> Tôi chọn đúng giữa volume, bind mount và tmpfs, sao lưu và khôi phục được một CSDL, đặt dịch vụ vào mạng tự tạo, gọi nhau bằng tên, và không bao giờ công bố CSDL ra <code>0.0.0.0</code>.</li>
<li><strong>Compose và vận hành (Chương 9–12).</strong> Tôi viết được healthcheck và điều kiện <code>depends_on</code>, tách file dev và prod, đặt trần restart, bộ nhớ và log, deploy theo tag commit, quay lui, và chẩn đoán từ <code>STATUS</code> với mã thoát trước khi đọc log.</li>
<li><strong>Mở rộng (Chương 13–15).</strong> Tôi cho nhóm một Dev Container hoặc một vòng <code>watch</code>, chạy CSDL dùng-một-lần cho test, mượn công cụ bằng <code>docker run --rm -v "$PWD":/w</code>, và giải thích được vì sao nhóm <code>docker</code> gần như là root.</li>
<li><strong>Dự án cuối khoá (Chương 16).</strong> Tôi đưa được một app từ Dockerfile đầu tiên tới một máy chủ deploy theo tag, tự kiểm và tự quay lui — và gọi tên được tám sự cố kinh điển cùng lệnh đầu tiên cho mỗi cái.</li>
</ul>
${slide('dk-16', 28, 'Bảng tra nhanh Chương 16')}
<p class="note-ct">Cảm ơn bạn đã đi tới tận đây. Giờ Docker là một công cụ bạn suy luận được, không còn là một danh sách lệnh để chép — và bằng chứng nằm trong ba mươi phút tới.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 1800,
        questions: [
          {
            question: 'A teammate asks: “My containers run on a Mac — which kernel are they actually using?”|||Bạn cùng nhóm hỏi: “Container của mình chạy trên máy Mac — thật ra chúng dùng nhân (kernel) nào?”',
            options: [
              'The macOS (Darwin) kernel, because containers always share the kernel of the computer they run on|||Nhân macOS (Darwin), vì container luôn dùng chung nhân của chiếc máy mà nó chạy trên đó',
              'The Linux kernel of the small virtual machine Docker Desktop runs in the background — all containers share it|||Nhân Linux của máy ảo nhỏ mà Docker Desktop chạy ngầm — mọi container cùng dùng chung nhân đó',
              'Each container boots its own Linux kernel, which is why a container behaves like a light virtual machine|||Mỗi container khởi động một nhân Linux của riêng nó, nên container mới hành xử như một máy ảo nhẹ',
              'No kernel at all: the Alpine or Debian image carries the kernel it needs inside its own layers|||Không có nhân nào cả: ảnh Alpine hay Debian tự mang theo nhân nó cần bên trong các tầng của mình',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Containers share the host kernel (Lesson 1.1) — but on macOS and Windows the “host” is the Linux VM Docker Desktop starts (Lesson 13.4); uname -r inside any container shows that VM’s kernel. Answer A is the tempting half-truth: sharing the host kernel is right, but Darwin cannot run Linux binaries, which is exactly why the VM exists. Images contain no kernel, and containers boot none.|||VI: Container dùng chung nhân của máy chủ (Bài 1.1) — nhưng trên macOS và Windows, “máy chủ” đó là máy ảo Linux mà Docker Desktop khởi động (Bài 13.4); uname -r trong bất kỳ container nào cũng in nhân của máy ảo đó. Phương án A là nửa sự thật hấp dẫn: dùng chung nhân của máy chủ là đúng, nhưng Darwin không chạy được chương trình Linux, và đó chính là lý do có cái máy ảo. Ảnh không chứa nhân, và container không khởi động nhân nào.',
          },
          {
            question: 'You ran docker rm -f db, then docker run -d --name db -e POSTGRES_PASSWORD=x postgres:16 again. The tables are gone. Where is the old data?|||Bạn chạy docker rm -f db, rồi docker run -d --name db -e POSTGRES_PASSWORD=x postgres:16 lần nữa. Các bảng biến mất. Dữ liệu cũ đang ở đâu?',
            options: [
              'Gone for good: it lived in the writable layer of the container you just removed|||Mất hẳn: nó nằm trong tầng ghi được của container vừa bị xoá',
              'Inside the postgres:16 image; pulling the image again brings the tables back|||Nằm trong ảnh postgres:16; kéo lại ảnh là các bảng quay về',
              'In /var/lib/postgresql/data on your own disk, which Docker bind-mounts automatically|||Trong /var/lib/postgresql/data trên ổ đĩa của bạn, được Docker tự bind mount',
              'In an anonymous volume the image declares with VOLUME; the new container got a NEW one, the old one is still there|||Trong một volume vô danh mà ảnh khai bằng VOLUME; container mới nhận một volume MỚI, volume cũ vẫn còn đó',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The postgres image declares VOLUME /var/lib/postgresql/data, so each container without -v gets a fresh anonymous volume; docker rm -f without -v leaves the old one behind, and docker volume ls plus docker run -v <id>:/var/lib/postgresql/data brings the data back (Lessons 1.4, 7.1). Answer A would be right for a file written anywhere else in the container — it is the natural guess, and the reason to always name your database volume.|||VI: Ảnh postgres khai VOLUME /var/lib/postgresql/data, nên mỗi container không có -v nhận một volume vô danh mới; docker rm -f không kèm -v để lại volume cũ, và docker volume ls cùng docker run -v <id>:/var/lib/postgresql/data mang dữ liệu về (Bài 1.4, 7.1). Phương án A sẽ đúng với một file ghi ở bất kỳ chỗ nào khác trong container — đó là cách đoán tự nhiên, và cũng là lý do luôn phải đặt tên cho volume CSDL.',
          },
          {
            question: 'The Dockerfile ends with CMD npm start. On the Linux VPS, docker stop api always takes ten seconds and the container exits with 137. Why?|||Dockerfile kết thúc bằng CMD npm start. Trên VPS Linux, docker stop api luôn mất mười giây và container thoát với mã 137. Vì sao?',
            options: [
              'PID 1 is a shell or npm, which does not pass SIGTERM on to node; Docker waits out the grace period, then SIGKILLs|||PID 1 là shell hoặc npm, không chuyển SIGTERM tới node; Docker chờ hết thời gian ân hạn rồi SIGKILL',
              'The VPS is short of RAM, so stopping is slow and the kernel finally kills the process for memory|||VPS thiếu RAM nên việc dừng bị chậm và cuối cùng nhân giết tiến trình vì hết bộ nhớ',
              'Docker always waits ten seconds before it sends SIGTERM, so every stop takes at least that long|||Docker luôn chờ mười giây rồi mới gửi SIGTERM, nên lần dừng nào cũng tốn ít nhất chừng đó',
              'Node cannot receive signals inside a container, so only SIGKILL can ever stop a Node process|||Node không nhận được tín hiệu bên trong container, nên chỉ có SIGKILL mới dừng được tiến trình Node',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Shell form wraps the command in /bin/sh -c, and npm itself does not forward signals reliably; SIGTERM reaches PID 1 and goes no further, so after the grace period (10 s on Linux) Docker sends SIGKILL: 128 + 9 = 137 (Lessons 1.3, 4.3). Use exec form CMD ["node","dist/index.js"] plus tini or a SIGTERM handler — Lesson 16.1 measured 0.143 s. Answer B confuses 137 with OOM: OOMKilled would be true, and the time would not be a steady ten seconds.|||VI: Dạng shell bọc lệnh trong /bin/sh -c, và bản thân npm không chuyển tín hiệu một cách tin cậy; SIGTERM tới PID 1 rồi dừng ở đó, nên hết thời gian ân hạn (10 giây trên Linux) Docker gửi SIGKILL: 128 + 9 = 137 (Bài 1.3, 4.3). Dùng dạng exec CMD ["node","dist/index.js"] cùng tini hoặc hàm xử lý SIGTERM — Bài 16.1 đo được 0,143 giây. Phương án B nhầm 137 với OOM: khi đó OOMKilled sẽ là true, và thời gian không đều đặn mười giây.',
          },
          {
            question: 'The api container has a HEALTHCHECK and docker ps has shown (unhealthy) for 20 minutes. It was started with docker run -d --restart unless-stopped — no Compose, no Swarm. What will Docker do about it?|||Container api có HEALTHCHECK và docker ps báo (unhealthy) đã 20 phút. Nó được chạy bằng docker run -d --restart unless-stopped — không Compose, không Swarm. Docker sẽ làm gì với nó?',
            options: [
              'Restart it, because the restart policy reacts to a failing healthcheck the same way it reacts to a crash|||Khởi động lại nó, vì chính sách restart phản ứng với healthcheck hỏng giống như với một lần sập',
              'Remove the container and create a fresh one from the same image, keeping its name and ports|||Xoá container và tạo một cái mới từ cùng ảnh, giữ nguyên tên và cổng',
              'Nothing beyond the label: restart policies react only when the process exits, never to health status|||Không làm gì ngoài cái nhãn: chính sách restart chỉ phản ứng khi tiến trình thoát, không bao giờ theo trạng thái health',
              'Stop sending it traffic and route requests to another healthy container of the same image|||Ngừng gửi lưu lượng tới nó và chuyển request sang một container khoẻ khác cùng ảnh',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Plain Docker only records the health state (Lesson 2.5). What reads it is someone else: Compose’s depends_on condition: service_healthy, up --wait, Swarm, or your own monitoring (Lesson 11.5). Answer A is the most common belief; if you want a restart on unhealthy, you must build it (a watchdog, or an orchestrator). There is no built-in load balancer to route around it either.|||VI: Docker thuần chỉ ghi lại trạng thái health (Bài 2.5). Thứ đọc nó là thứ khác: điều kiện condition: service_healthy của Compose, up --wait, Swarm, hoặc hệ giám sát của bạn (Bài 11.5). Phương án A là niềm tin phổ biến nhất; muốn restart khi unhealthy thì bạn phải tự dựng (một watchdog, hoặc một bộ điều phối). Cũng không có bộ cân bằng tải dựng sẵn nào để lái lưu lượng đi vòng.',
          },
          {
            question: 'The VPS must run exactly the image that passed testing, even if someone later pushes over the same tag. What do you write in compose.yaml?|||VPS phải chạy đúng cái ảnh đã qua kiểm thử, kể cả khi sau đó có người đẩy đè lên cùng tag. Bạn ghi gì trong compose.yaml?',
            options: [
              'image: ghcr.io/nhom/api:latest, and run docker compose pull before every start|||image: ghcr.io/nhom/api:latest, và chạy docker compose pull trước mỗi lần khởi động',
              'image: ghcr.io/nhom/api:stable, a tag the team promises to move only after testing|||image: ghcr.io/nhom/api:stable, một tag cả nhóm hứa chỉ dời sau khi đã kiểm thử',
              'image: ghcr.io/nhom/api@sha256:<digest> — the digest is the hash of the content and cannot move|||image: ghcr.io/nhom/api@sha256:<digest> — digest là mã băm của nội dung và không thể bị dời',
              'image: ghcr.io/nhom/api with pull_policy: always, so the newest tested build is always used|||image: ghcr.io/nhom/api kèm pull_policy: always, để lúc nào cũng dùng bản mới nhất đã kiểm thử',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: A tag is a movable pointer; a digest is the SHA-256 of the manifest, so the same digest can only ever mean the same bytes (Lesson 3.2). Commit-hash tags (Lesson 16.3) are the practical everyday version, and tag@digest gives both readability and immutability. Answer B relies on a promise, which is exactly what “even if someone pushes over it” rules out; A and D make things worse by pulling whatever the tag points to right now.|||VI: Tag là con trỏ dời được; digest là SHA-256 của manifest, nên cùng một digest chỉ có thể là cùng những byte đó (Bài 3.2). Tag bằng mã băm commit (Bài 16.3) là phiên bản thực dụng hằng ngày, còn tag@digest cho cả dễ đọc lẫn bất biến. Phương án B dựa vào một lời hứa, đúng thứ mà “kể cả khi có người đẩy đè” đã loại; A và D còn làm tệ hơn vì kéo bất cứ thứ gì tag đang trỏ tới lúc đó.',
          },
          {
            question: 'An image built on your M1 Mac with docker build -t api . and pushed to the amd64 VPS fails there with exec format error. What fixes it?|||Một ảnh build trên máy Mac M1 bằng docker build -t api . rồi đẩy lên VPS amd64 báo exec format error ở đó. Cách nào sửa được?',
            options: [
              'Build for the server’s architecture: --platform linux/amd64, or linux/amd64,linux/arm64 for a multi-platform tag|||Build cho kiến trúc của máy chủ: --platform linux/amd64, hoặc linux/amd64,linux/arm64 cho một tag đa nền tảng',
              'Reinstall Docker on the VPS, because exec format error means the engine binary itself is damaged|||Cài lại Docker trên VPS, vì exec format error nghĩa là chính chương trình engine đã bị hỏng',
              'Switch the base image to Alpine, whose binaries are small enough to run on both architectures|||Đổi ảnh nền sang Alpine, vì chương trình của nó đủ gọn để chạy trên cả hai kiến trúc',
              'Add RUN chmod +x to the entrypoint script, since the kernel refuses files without the execute bit|||Thêm RUN chmod +x cho script entrypoint, vì nhân từ chối những file không có quyền thực thi',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: On an M1 a plain build produces linux/arm64 binaries; an amd64 kernel cannot execute them (Lesson 3.4). Build with --platform, and let one tag carry both manifests (Lesson 16.3 built both in 43.5 s). Answer D is tempting because it is the other classic start-up failure, but a missing execute bit gives permission denied (exit 126), not exec format error (Lesson 12.2).|||VI: Trên M1, một lệnh build trơn tạo ra chương trình linux/arm64; nhân amd64 không thực thi được chúng (Bài 3.4). Build với --platform, và để một tag mang cả hai manifest (Bài 16.3 dựng cả hai trong 43,5 giây). Phương án D hấp dẫn vì đó là lỗi khởi động kinh điển còn lại, nhưng thiếu quyền thực thi cho ra permission denied (mã 126), không phải exec format error (Bài 12.2).',
          },
          {
            question: 'To install a private npm package the team writes ARG NPM_TOKEN, then RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc && npm ci && rm .npmrc. Is the token safe?|||Để cài một gói npm private, nhóm viết ARG NPM_TOKEN, rồi RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc && npm ci && rm .npmrc. Token có an toàn không?',
            options: [
              'Yes: .npmrc is deleted in the same RUN, so no layer ever contains the file with the token|||Có: .npmrc bị xoá ngay trong cùng lệnh RUN, nên không tầng nào chứa file có token',
              'Yes: build arguments only exist during the build and are never stored anywhere in the image|||Có: build argument chỉ tồn tại trong lúc build và không bao giờ được lưu ở đâu trong ảnh',
              'Only unsafe if the image is pushed to a public registry; on a private GHCR package it is fine|||Chỉ không an toàn nếu ảnh được đẩy lên registry công khai; với package GHCR private thì ổn',
              'No: the ARG value used by RUN is recorded in the image’s build history, readable by anyone who pulls it; use RUN --mount=type=secret|||Không: giá trị ARG được RUN dùng bị ghi vào lịch sử build của ảnh, ai kéo ảnh cũng đọc được; dùng RUN --mount=type=secret',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Deleting the file in the same RUN does keep it out of the layer — that part of A is true — but the build argument itself ends up in the image metadata (docker history shows it next to the RUN), so the token leaks anyway (Lesson 4.4). A secret mount exists only for the duration of that one RUN and is never written into the image (Lessons 5.3, 6.1). “Private registry” only narrows who can read it; everyone with pull rights still can.|||VI: Xoá file trong cùng lệnh RUN đúng là giữ nó ngoài tầng — phần đó của A là đúng — nhưng chính build argument lại nằm trong siêu dữ liệu của ảnh (docker history hiện nó cạnh lệnh RUN), nên token vẫn lộ (Bài 4.4). Secret mount chỉ tồn tại trong đúng lệnh RUN đó và không bao giờ được ghi vào ảnh (Bài 5.3, 6.1). “Registry private” chỉ thu hẹp ai đọc được; mọi người có quyền pull vẫn đọc được.',
          },
          {
            question: 'Every time you change one line in src/, the build spends four minutes in npm ci. The Dockerfile says COPY . . and then RUN npm ci. What is the fix?|||Mỗi lần sửa một dòng trong src/, build lại tốn bốn phút ở npm ci. Dockerfile ghi COPY . . rồi RUN npm ci. Sửa thế nào?',
            options: [
              'Build with --no-cache, so that stale layers can never slow the npm ci step down again|||Build với --no-cache, để các tầng cũ không bao giờ làm chậm bước npm ci nữa',
              'COPY package.json and package-lock.json first, RUN npm ci, then COPY the rest — editing src/ keeps the npm ci layer cached|||COPY package.json và package-lock.json trước, RUN npm ci, rồi mới COPY phần còn lại — sửa src/ vẫn giữ cache của tầng npm ci',
              'Replace npm ci with npm install, which only installs the packages that changed since last time|||Thay npm ci bằng npm install, lệnh này chỉ cài những gói đã thay đổi so với lần trước',
              'Merge every instruction into a single RUN so that Docker builds only one layer for the whole app|||Gộp mọi chỉ thị vào một RUN duy nhất để Docker chỉ dựng một tầng cho cả app',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: A layer’s cache key includes the files its COPY brought in; COPY . . changes whenever any file changes, so everything after it reruns (Lessons 5.1, 5.2 — measured there: 138 s against 4.8 s). Copying only the lockfile first makes npm ci depend on dependencies alone. Answer C sounds plausible, but in a fresh build layer there is no previous node_modules for npm install to compare with; --no-cache makes every build slow.|||VI: Khoá cache của một tầng gồm cả các file mà COPY của nó mang vào; COPY . . đổi mỗi khi có bất kỳ file nào đổi, nên mọi thứ sau nó chạy lại (Bài 5.1, 5.2 — đo ở đó: 138 giây so với 4,8 giây). Chép riêng file khoá trước khiến npm ci chỉ phụ thuộc vào danh sách gói. Phương án C nghe hợp lý, nhưng trong một tầng build mới không có node_modules cũ nào để npm install so; còn --no-cache làm lần build nào cũng chậm.',
          },
          {
            question: 'The Dockerfile has RUN apt-get install -y build-essential, and on the next line RUN apt-get purge -y build-essential. The image did not get any smaller. Why, and what do you do?|||Dockerfile có RUN apt-get install -y build-essential, và dòng ngay sau là RUN apt-get purge -y build-essential. Ảnh không nhỏ đi chút nào. Vì sao, và làm gì?',
            options: [
              'Each RUN is a layer; deleting in a later layer only hides the files — compile in a build stage and COPY only the result into the runtime stage|||Mỗi RUN là một tầng; xoá ở tầng sau chỉ che file đi — biên dịch trong stage build và chỉ COPY kết quả sang stage runtime',
              'The deleted packages stay in Docker’s cache until you run docker image prune on the build machine|||Các gói đã xoá nằm lại trong cache của Docker cho tới khi bạn chạy docker image prune trên máy build',
              'apt-get purge does not work inside containers, because the package database is read-only there|||apt-get purge không chạy được trong container, vì cơ sở dữ liệu gói ở đó là chỉ-đọc',
              'The size is right but displayed wrong: Docker compresses images, so the number shown never changes|||Kích thước đúng nhưng hiển thị sai: Docker nén ảnh, nên con số hiển thị không bao giờ thay đổi',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Layers only add; a later deletion is a whiteout on top, and the bytes still ship in the earlier layer (Lessons 1.2, 6.3). Either install-use-remove inside ONE RUN, or better, a multi-stage build where compilers never reach the final stage (Lesson 6.1; Lesson 16.1 went from 2.2 GB to 664 MB this way). Answer B mixes up image size with the builder cache on disk, which prune affects but the pushed image does not.|||VI: Tầng chỉ cộng thêm; xoá ở tầng sau là một “whiteout” phủ lên trên, còn byte vẫn đi theo tầng trước (Bài 1.2, 6.3). Hoặc cài-dùng-xoá trong MỘT lệnh RUN, hoặc tốt hơn là dựng nhiều stage để trình biên dịch không bao giờ tới stage cuối (Bài 6.1; Bài 16.1 đi từ 2,2 GB xuống 664 MB theo cách này). Phương án B nhầm kích thước ảnh với cache build trên đĩa — prune tác động tới cache, không tới cái ảnh đã đẩy lên.',
          },
          {
            question: 'Someone ran docker compose down -v “to clean up”, and the whole team lost its development Postgres data. What happened?|||Có người chạy docker compose down -v “cho sạch”, và cả nhóm mất hết dữ liệu Postgres dùng để phát triển. Chuyện gì đã xảy ra?',
            options: [
              'down always deletes volumes; -v only makes it print what it removes, so the flag changed nothing|||down luôn xoá volume; -v chỉ khiến nó in ra những gì bị xoá, nên cờ đó không làm thay đổi gì',
              '-v removes only anonymous volumes; the data was lost because Postgres wipes its folder when stopped|||-v chỉ xoá volume vô danh; dữ liệu mất vì Postgres tự xoá thư mục của nó khi bị dừng',
              '-v removes the volumes declared in the Compose file — named ones like pgdata included — plus anonymous ones; the data lived there|||-v xoá các volume khai trong file Compose — kể cả volume có tên như pgdata — cùng volume vô danh; dữ liệu nằm đúng trong đó',
              '-v removes the postgres image, so the next up pulls a fresh image that starts with an empty database|||-v xoá ảnh postgres, nên lần up sau kéo ảnh mới và khởi động với một CSDL rỗng',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Plain down removes containers and networks and keeps volumes; -v also removes the named volumes declared in the file and anonymous ones (Lesson 9.1; Lesson 7.2 on deleting safely). Answer B is the tempting one because it is half right about anonymous volumes, but named volumes are exactly what -v adds. Postgres never wipes its data directory on stop, and images are removed by --rmi, not -v.|||VI: down trơn xoá container và mạng, giữ volume; -v xoá thêm các volume có tên khai trong file cùng volume vô danh (Bài 9.1; Bài 7.2 về xoá an toàn). Phương án B là phương án hấp dẫn vì nó đúng một nửa về volume vô danh, nhưng volume có tên chính là thứ -v thêm vào. Postgres không bao giờ tự xoá thư mục dữ liệu khi dừng, còn ảnh bị xoá bằng --rmi chứ không phải -v.',
          },
          {
            question: 'In the api container, DATABASE_URL=postgresql://…@localhost:5432/… fails with ECONNREFUSED, although db runs in the same Compose project. What is the right fix?|||Trong container api, DATABASE_URL=postgresql://…@localhost:5432/… báo ECONNREFUSED, dù db chạy trong cùng dự án Compose. Cách sửa đúng là gì?',
            options: [
              'Publish db’s port with ports: ["5432:5432"], so that localhost:5432 reaches the database from anywhere|||Công bố cổng của db bằng ports: ["5432:5432"], để localhost:5432 tới được CSDL từ bất cứ đâu',
              'Use host.docker.internal as the host, so the API goes out to the machine and back into db|||Dùng host.docker.internal làm host, để API đi ra máy chủ rồi vòng lại vào db',
              'Put every service on network_mode: host, so they all share one localhost like on a laptop|||Đặt mọi dịch vụ ở network_mode: host, để tất cả dùng chung một localhost như trên laptop',
              'Use the service name db as the host — inside a container, localhost is that container itself|||Dùng tên dịch vụ db làm host — bên trong container, localhost chính là container đó',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Each container has its own network namespace, so localhost is the api container, where nothing listens on 5432 (Lesson 8.4). Compose’s embedded DNS resolves the service name db on the shared network (Lesson 8.3). Answers A and B can appear to work, but they route through the host and publish the database — incident 5 of Lesson 16.4. Host networking throws away the isolation this course built.|||VI: Mỗi container có network namespace riêng, nên localhost là chính container api, nơi không có gì lắng nghe ở 5432 (Bài 8.4). DNS nhúng của Compose phân giải tên dịch vụ db trên mạng dùng chung (Bài 8.3). Phương án A và B có thể trông như chạy được, nhưng chúng đi vòng qua máy chủ và công bố CSDL ra ngoài — sự cố 5 ở Bài 16.4. Mạng host thì vứt bỏ sự cô lập mà khoá này đã dựng.',
          },
          {
            question: 'The API crashes at start-up because Postgres is not accepting connections yet, even though compose.yaml says depends_on: [db]. What fixes it properly?|||API sập lúc khởi động vì Postgres chưa nhận kết nối, dù compose.yaml đã ghi depends_on: [db]. Cách sửa đúng là gì?',
            options: [
              'restart: always on the API, so it keeps crashing until Postgres happens to be ready|||restart: always cho API, để nó cứ sập cho tới khi Postgres tình cờ sẵn sàng',
              'The list form only waits for db to be STARTED; add a pg_isready healthcheck to db and use condition: service_healthy|||Dạng danh sách chỉ chờ db được KHỞI ĐỘNG; thêm healthcheck pg_isready cho db và dùng condition: service_healthy',
              'Move the db service above api in compose.yaml, because Compose starts services from top to bottom|||Chuyển dịch vụ db lên trên api trong compose.yaml, vì Compose khởi động dịch vụ từ trên xuống',
              'Prefix the API command with sleep 10, which is always enough for Postgres to finish starting|||Thêm sleep 10 trước lệnh của API, luôn đủ để Postgres khởi động xong',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: depends_on without a condition means service_started: the db process exists, nothing more (Lesson 9.3). A healthcheck turns “started” into “ready”, and service_healthy makes the API wait for it; Lesson 16.2 adds service_completed_successfully for the migrate job. Answer A “works” by crashing repeatedly and hides real start-up errors; the order of services in the file means nothing; a fixed sleep is too long on a fast machine and too short on a slow one.|||VI: depends_on không có điều kiện nghĩa là service_started: tiến trình db tồn tại, không hơn (Bài 9.3). Healthcheck biến “đã khởi động” thành “đã sẵn sàng”, và service_healthy bắt API chờ điều đó; Bài 16.2 thêm service_completed_successfully cho việc migrate. Phương án A “chạy được” bằng cách sập liên tục và che mất lỗi khởi động thật; thứ tự dịch vụ trong file không có nghĩa gì; một cái sleep cố định thì quá dài trên máy nhanh và quá ngắn trên máy chậm.',
          },
          {
            question: 'On the VPS you edited nginx/nginx.conf with vim. nginx -t and nginx -s reload both succeed, yet nothing changes. The file is mounted as ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro.|||Trên VPS bạn sửa nginx/nginx.conf bằng vim. nginx -t và nginx -s reload đều thành công, vậy mà không có gì thay đổi. File được gắn là ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro.',
            options: [
              'nginx caches its configuration for 24 hours, so the change will appear by itself tomorrow|||nginx cache cấu hình 24 giờ, nên ngày mai thay đổi sẽ tự xuất hiện',
              'A single-file bind mount follows the inode; vim wrote a new file and renamed it, so the container still reads the old one — restart it, and mount the folder instead|||Bind mount một file đơn đi theo inode; vim ghi file mới rồi đổi tên, nên container vẫn đọc bản cũ — khởi động lại nó, và chuyển sang gắn thư mục',
              'The :ro flag prevents nginx from reading any version of the file that is newer than the container|||Cờ :ro ngăn nginx đọc bất kỳ phiên bản nào của file mới hơn container',
              'nginx configuration is baked into the image, so you must docker compose build nginx after every edit|||Cấu hình nginx được nướng vào ảnh, nên phải docker compose build nginx sau mỗi lần sửa',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The mount is resolved to an inode when the container starts. Editors, sed -i and git replace the file with a new inode, so nginx -t tests the OLD file and reload reloads it (Lesson 16.4 measured host inode 5516765 vs container 5516764; Lessons 7.3, 10.5). Compare sha256sum inside and outside to confirm. Answer D is wrong because this is a bind mount — the image is not involved; :ro only stops the container from writing.|||VI: Phép gắn được quy về một inode lúc container khởi động. Trình soạn thảo, sed -i và git thay file bằng một inode mới, nên nginx -t kiểm file CŨ và reload nạp lại file đó (Bài 16.4 đo được inode trên máy chủ 5516765 so với trong container 5516764; Bài 7.3, 10.5). So sha256sum bên trong và bên ngoài để xác nhận. Phương án D sai vì đây là bind mount — ảnh không liên quan; :ro chỉ ngăn container ghi.',
          },
          {
            question: 'On a 2 GB VPS the web container restarts again and again. docker inspect shows ExitCode=137 and OOMKilled=true, and the app’s log ends without any error. What is going on?|||Trên VPS 2 GB, container web khởi động lại liên tục. docker inspect cho thấy ExitCode=137 và OOMKilled=true, còn log của app kết thúc mà không có lỗi nào. Chuyện gì đang xảy ra?',
            options: [
              'A bug in the code: read the stack trace at the end of the log, fix it and deploy again|||Một lỗi trong mã: đọc stack trace ở cuối log, sửa rồi deploy lại',
              'The restart policy is too aggressive; change it to on-failure:3 so the container stops looping|||Chính sách restart quá hung hăng; đổi thành on-failure:3 để container thôi lặp vòng',
              'The app ignores SIGTERM, so Docker has to SIGKILL it every time the healthcheck fails|||App bỏ qua SIGTERM, nên Docker phải SIGKILL nó mỗi lần healthcheck hỏng',
              'It hit its memory ceiling and the kernel killed it — raise the limit from real measurements or use less, and never build on this VPS|||Nó chạm trần bộ nhớ và bị nhân giết — nâng trần theo số đo thật hoặc giảm lượng dùng, và không bao giờ build trên VPS này',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: 137 is 128 + 9, SIGKILL; OOMKilled=true says who sent it: the kernel, for memory (Lessons 2.5, 11.2; reproduced in Lesson 16.4). The log has no error because the process never got to write one. Answer C is the attractive alternative — a stop timeout also ends in 137 — but then OOMKilled would be false, and plain Docker does not kill on failed healthchecks anyway. Changing the restart policy only hides the symptom.|||VI: 137 là 128 + 9, SIGKILL; OOMKilled=true cho biết ai gửi nó: nhân, vì bộ nhớ (Bài 2.5, 11.2; dựng lại ở Bài 16.4). Log không có lỗi vì tiến trình không kịp viết. Phương án C là lựa chọn hấp dẫn — hết thời gian dừng cũng kết thúc bằng 137 — nhưng khi đó OOMKilled sẽ là false, và Docker thuần cũng không giết container vì healthcheck hỏng. Đổi chính sách restart chỉ che triệu chứng.',
          },
          {
            question: 'A container exits right after starting, and docker ps -a shows Exited (127). What do you check first?|||Một container thoát ngay sau khi khởi động, và docker ps -a hiện Exited (127). Bạn kiểm gì trước tiên?',
            options: [
              '127 means “command not found”: check CMD/ENTRYPOINT and PATH with docker inspect, then look inside with docker run --entrypoint sh|||127 nghĩa là “không tìm thấy lệnh”: kiểm CMD/ENTRYPOINT và PATH bằng docker inspect, rồi nhìn vào trong bằng docker run --entrypoint sh',
              '127 means the container ran out of memory: raise the memory limit and look at docker stats|||127 nghĩa là container hết bộ nhớ: nâng trần bộ nhớ rồi xem docker stats',
              '127 means the volume is corrupt: remove the volume and let the container create a clean one|||127 nghĩa là volume bị hỏng: xoá volume và để container tạo một cái sạch',
              '127 means the port is already taken on the host: change the published port in ports:|||127 nghĩa là cổng trên máy chủ đã bị chiếm: đổi cổng công bố trong ports:',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Exit codes pick the path before logs do (Lesson 12.1): 127 is the shell’s “command not found” — a typo in CMD, a binary missing from a slim image, or a CRLF shebang (Lesson 12.2). 126 would be “found but not executable”; memory kills are 137. A busy port never produces an exit code at all: docker run fails before the container starts.|||VI: Mã thoát chọn đường đi trước cả log (Bài 12.1): 127 là “không tìm thấy lệnh” của shell — gõ sai CMD, một chương trình không có trong ảnh gọn, hoặc dòng shebang kiểu CRLF (Bài 12.2). 126 mới là “tìm thấy nhưng không thực thi được”; bị giết vì bộ nhớ là 137. Cổng bận thì không bao giờ sinh ra mã thoát: docker run hỏng trước khi container kịp khởi động.',
          },
          {
            question: 'A teammate on Windows keeps the project under C:\\Users\\… and bind-mounts it into a container running next dev: hot reload is slow and sometimes misses changes. What do you advise?|||Một bạn dùng Windows để dự án trong C:\\Users\\… và bind mount nó vào container chạy next dev: nạp nóng chậm và thỉnh thoảng không nhận thay đổi. Bạn khuyên gì?',
            options: [
              'Turn WSL2 off in Docker Desktop, because the Hyper-V backend handles file sharing much better|||Tắt WSL2 trong Docker Desktop, vì backend Hyper-V xử lý chia sẻ file tốt hơn nhiều',
              'Run the dev container with --privileged, so it can watch the Windows drive directly|||Chạy container dev với --privileged, để nó theo dõi được ổ đĩa Windows trực tiếp',
              'Move the project into the WSL2 filesystem (e.g. ~/project in Ubuntu) and work from there — mounts from C: cross a slow sharing layer that does not pass change events reliably|||Chuyển dự án vào hệ file của WSL2 (vd ~/project trong Ubuntu) và làm việc từ đó — gắn từ ổ C: phải đi qua một lớp chia sẻ chậm, không chuyển sự kiện thay đổi một cách tin cậy',
              'Copy the files into the image with COPY and rebuild after every change instead of mounting|||Chép file vào ảnh bằng COPY và build lại sau mỗi lần sửa thay vì gắn thư mục',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Docker Desktop runs containers in a Linux VM; files under C:\\ reach it through a Windows-to-Linux sharing layer that is slow for many small files and unreliable for file-change notifications, while files inside the WSL2 filesystem are native to it (Lesson 13.4). Answer A goes backwards: WSL2 is the recommended backend. Rebuilding on every save (D) is what watch or a mount is meant to avoid (Lesson 13.2).|||VI: Docker Desktop chạy container trong một máy ảo Linux; file dưới C:\\ tới được đó qua một lớp chia sẻ Windows-sang-Linux vừa chậm với nhiều file nhỏ vừa không tin cậy với thông báo thay đổi file, còn file nằm trong hệ file của WSL2 là file “nhà” của nó (Bài 13.4). Phương án A đi ngược: WSL2 là backend được khuyên dùng. Build lại mỗi lần lưu (D) đúng là thứ watch hay phép gắn sinh ra để tránh (Bài 13.2).',
          },
          {
            question: 'On a Linux machine you ran docker run --rm -v "$PWD":/w -w /w pandoc/minimal:3.11 bao-cao.md -o bao-cao.html. Now you cannot edit or delete bao-cao.html: Permission denied. Why, and what next?|||Trên máy Linux bạn chạy docker run --rm -v "$PWD":/w -w /w pandoc/minimal:3.11 bao-cao.md -o bao-cao.html. Giờ bạn không sửa hay xoá được bao-cao.html: Permission denied. Vì sao, và làm gì tiếp?',
            options: [
              'The container ran as root, so the file belongs to root — rerun with -u "$(id -u):$(id -g)", and chown the existing file from a root container|||Container chạy bằng root nên file thuộc về root — chạy lại với -u "$(id -u):$(id -g)", còn file đã lỡ thì chown bằng một container root',
              'pandoc wrote the file with a Windows line-ending format that Linux refuses to open for writing|||pandoc ghi file theo định dạng xuống dòng của Windows mà Linux từ chối mở để ghi',
              'The mount should have been :ro; without it Docker locks every file the container touches|||Phép gắn lẽ ra phải là :ro; thiếu nó Docker khoá mọi file mà container đã chạm vào',
              'The file is still open in the stopped container; wait a minute for Docker to release the lock|||File vẫn đang mở trong container đã dừng; chờ một phút để Docker nhả khoá',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: On Linux a bind mount shows the same UID numbers on both sides, and most tool images run as UID 0, so their output belongs to root (Lessons 14.1, 7.3). -u "$(id -u):$(id -g)" runs the tool as you; a one-off root container can chown what already exists. On a Mac you would not notice, because Docker Desktop maps ownership to your user — which is why teammates on Linux hit this first. :ro would make the write fail, not fix ownership.|||VI: Trên Linux, bind mount cho thấy cùng những con số UID ở cả hai phía, mà phần lớn ảnh công cụ chạy bằng UID 0, nên kết quả thuộc về root (Bài 14.1, 7.3). -u "$(id -u):$(id -g)" chạy công cụ bằng chính bạn; một container root dùng-một-lần chown được những file đã lỡ. Trên máy Mac bạn sẽ không để ý, vì Docker Desktop quy quyền sở hữu về user của bạn — đó là lý do bạn dùng Linux gặp trước. :ro chỉ khiến lệnh ghi hỏng, không sửa quyền sở hữu.',
          },
          {
            question: 'To avoid typing sudo, the team adds all five student accounts to the docker group on the shared VPS. What is the risk?|||Để khỏi gõ sudo, nhóm thêm cả năm tài khoản sinh viên vào nhóm docker trên VPS dùng chung. Rủi ro là gì?',
            options: [
              'None: members of the docker group can only start and stop containers, nothing on the host|||Không có: thành viên nhóm docker chỉ khởi động và dừng được container, không đụng gì tới máy chủ',
              'Anyone in the group commands a daemon that runs as root: docker run -v /:/host … reads and changes every host file — it is effectively root|||Ai trong nhóm cũng ra lệnh được cho một daemon chạy bằng root: docker run -v /:/host … đọc và sửa được mọi file của máy chủ — thực chất là root',
              'Only a risk with --privileged; as long as nobody passes that flag, the host is fully protected|||Chỉ rủi ro khi dùng --privileged; miễn không ai truyền cờ đó thì máy chủ được bảo vệ hoàn toàn',
              'Docker gets slower, because every member’s containers share the same daemon and its locks|||Docker sẽ chậm đi, vì container của mọi thành viên dùng chung một daemon và các khoá của nó',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The docker socket accepts any request from a group member, and dockerd runs as root, so mounting / into a container you control is enough to edit /etc/shadow or authorized_keys — no --privileged needed (Chapter 15, lesson on rootless and Podman; Lesson 0.2 on running without sudo). Answer C is the tempting half-truth: --privileged is dangerous too, but a plain bind mount already hands over the host. Give real root only to the people who should have it, or use rootless Docker or Podman.|||VI: Socket của docker nhận mọi yêu cầu từ thành viên nhóm, mà dockerd chạy bằng root, nên chỉ cần gắn / vào một container do mình điều khiển là sửa được /etc/shadow hay authorized_keys — không cần --privileged (Chương 15, bài về rootless và Podman; Bài 0.2 về chạy không cần sudo). Phương án C là nửa sự thật hấp dẫn: --privileged cũng nguy hiểm, nhưng một bind mount thường đã trao cả máy chủ. Chỉ cấp root thật cho người đáng có nó, hoặc dùng Docker rootless hay Podman.',
          },
          {
            question: 'JWT_SECRET was added to the .env file next to compose.yaml on the VPS, but the API still says the variable is missing, and docker compose config | grep JWT prints nothing. What is the fix?|||JWT_SECRET đã được thêm vào file .env cạnh compose.yaml trên VPS, nhưng API vẫn báo thiếu biến, và docker compose config | grep JWT không in gì. Cách sửa là gì?',
            options: [
              'Rebuild the API image, because environment variables are baked in at build time|||Build lại ảnh API, vì biến môi trường được nướng cứng vào lúc build',
              'Move .env into the api/ folder, next to the Dockerfile, where the container can read it|||Chuyển .env vào thư mục api/, cạnh Dockerfile, nơi container đọc được nó',
              'Restart the Docker daemon, because Compose only rereads .env when dockerd starts|||Khởi động lại daemon Docker, vì Compose chỉ đọc lại .env khi dockerd khởi động',
              '.env only feeds ${…} interpolation in the YAML; add JWT_SECRET: ${JWT_SECRET:?missing} under the api service’s environment and run up -d|||.env chỉ cấp giá trị cho các chỗ ${…} trong YAML; thêm JWT_SECRET: ${JWT_SECRET:?thiếu} vào environment của dịch vụ api rồi up -d',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured in Lesson 16.4: config showed 0 JWT lines while config --environment showed the variable — Compose had it, the container did not. A variable reaches a container only through environment: or env_file: (Lesson 9.4); :? makes a missing value stop the deploy. The very same image then deployed fine, so answer A is wrong here — only NEXT_PUBLIC_* style build-time values need a rebuild. The container never reads .env by itself, wherever it is.|||VI: Đo ở Bài 16.4: config cho 0 dòng JWT trong khi config --environment có biến đó — Compose có, container thì không. Một biến chỉ tới container qua environment: hoặc env_file: (Bài 9.4); :? khiến một giá trị bị thiếu làm dừng lượt deploy. Sau đó CHÍNH cái ảnh cũ deploy trơn tru, nên phương án A sai ở đây — chỉ những giá trị lúc build kiểu NEXT_PUBLIC_* mới cần build lại. Container không bao giờ tự đọc .env, dù nó nằm ở đâu.',
          },
          {
            question: 'After a hand deploy with docker compose up -d, the team checked /healthz (200) and went to bed. Twenty minutes later the lecturer reports 502 on every API page. What would have caught it and limited the damage?|||Sau một lượt deploy tay bằng docker compose up -d, nhóm kiểm /healthz (200) rồi đi ngủ. Hai mươi phút sau thầy báo mọi trang API đều 502. Điều gì đã có thể bắt được lỗi và hạn chế thiệt hại?',
            options: [
              'Nothing: /healthz returned 200, so the stack was healthy and the 502 came from the lecturer’s network|||Không gì cả: /healthz trả 200 nên stack đã khoẻ, còn 502 là do mạng của thầy',
              'restart: always on the API, which would have brought it back automatically within seconds|||restart: always cho API, thứ sẽ tự đưa nó trở lại trong vài giây',
              'up -d --wait plus a smoke test that reaches the API itself (e.g. /api/slots), with automatic rollback to the previous tag — nginx’s /healthz says 200 even when the API is dead|||up -d --wait cộng một smoke test gọi tới tận API (vd /api/slots), kèm tự quay về tag trước — /healthz của nginx vẫn trả 200 khi API đã chết',
              'A longer healthcheck interval on the API, so a slow start is not mistaken for a failure|||Một khoảng healthcheck dài hơn cho API, để khởi động chậm không bị nhầm là hỏng',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Exactly what Lesson 16.3 measured: with the broken release up, /healthz answered 200 while /api/slots gave 502; through deploy.sh the same release was rejected and the old tag was serving again in under 20 seconds. --wait fails when a service is not healthy, and the smoke test checks the path users actually take. Answer B is tempting, but the API was already restarting in a loop — restarting a program that exits 1 at start-up changes nothing.|||VI: Đúng thứ Bài 16.3 đã đo: khi bản hỏng đang chạy, /healthz trả 200 trong khi /api/slots trả 502; đi qua deploy.sh thì cùng bản đó bị từ chối và tag cũ phục vụ trở lại trong chưa tới 20 giây. --wait báo lỗi khi có dịch vụ không healthy, còn smoke test kiểm đúng con đường người dùng đi. Phương án B hấp dẫn, nhưng API vốn đã restart vòng lặp — khởi động lại một chương trình thoát 1 ngay lúc khởi động không thay đổi được gì.',
          },
        ],
      },
    },
  ],
};
