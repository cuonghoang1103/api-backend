/**
 * Docker — Chương 6: ảnh nhỏ và an toàn.
 * Dựng nhiều tầng · chọn ảnh nền · làm nhỏ · chạy an toàn · quét & chuỗi cung ứng · quiz.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 *
 * Nâng cấp 09/2026: bài 6.0 slide (deck dk-06, 31 slide) + slide/🧪/🗂/📌 + phần đào sâu trong 6.1–6.5
 * (dựng lại THẬT sự cố 502 musl/glibc bằng một API TypeScript + Prisma 5.22; chốt kiểm libc ↔ engine;
 * quét Trivy 0.74.0 / Grype 0.119.0 ngày 23/09/2026); quiz 10 câu. Output MỚI chạy thật 23/09/2026 trên
 * Docker Engine 29.6 (Fedora 44, amd64, kho ảnh containerd) và Docker Desktop 4.91 / Engine 29.8 (Mac M1).
 * Luật thoát MỚI: \${ trong nội dung viết là &#36;{ (bộ kiểm dk-ghep-chuong chặn mọi \${ còn lại).
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 6 — Small and safe images|||Chương 6 — Ảnh nhỏ và an toàn',
  description: 'Cắt một ảnh 1,2GB xuống dưới 200MB mà không bỏ đi thứ gì bạn cần, chọn đúng ảnh nền (và hiểu cái bẫy musl với glibc), chạy không phải root với hệ thống file chỉ đọc, và biết cái ảnh mình đem đi có những lỗ hổng nào.',
  lessons: [
    /* ─────────────────────────── 6.0 ─────────────────────────── */
    {
      title: '6.0 — Chapter 6 slides: small and safe images in pictures|||6.0 — Slide Chương 6: ảnh nhỏ và an toàn bằng hình',
      slug: 'dk-6-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 31 slide của Chương 6: hai chồng tầng build/prod, đo 1,88 GB → 337 MB trên một API TypeScript + Prisma thật, dựng lại sự cố 502 musl/glibc cùng chốt kiểm libc ↔ engine, các lớp khoá khi chạy container, và quét Trivy/SBOM với số liệu ngày 23/09/2026.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Slides</span>
<h2>The whole chapter in 31 slides</h2>
<p class="lead">Skim these before the lessons to see where the bytes and the risks in an image come from, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: the build and prod stacks with their COPY --from arrows, the size ladder of one real app, the 502 outage timeline, the locks around a running process, and the supply chain an image is assembled from.</p>
<p>Slides 3–7 belong to Lesson 6.1, 8–13 to 6.2, 14–18 to 6.3, 19–23 to 6.4 and 24–28 to 6.5. The last three are the chapter's common mistakes, a cheat sheet, and a 45-minute practice session. Every terminal on the slides is real output, recorded on 23 September 2026 on Docker Engine 29.6 (Linux, amd64) and Docker Desktop 4.91 (Mac M1); vulnerability counts come from Trivy 0.74.0 with that day's database and will be different when you scan. The slides are in Vietnamese; the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Slide</span>
<h2>Cả chương trong 31 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy byte và rủi ro trong một cái ảnh đến từ đâu, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó: hai chồng tầng build và prod với mũi tên COPY --from, cái thang giảm cân của một app thật, dòng thời gian sự cố 502, các lớp khoá quanh một tiến trình đang chạy, và chuỗi cung ứng mà một cái ảnh được ráp từ đó.</p>
<p>Slide 3–7 thuộc Bài 6.1, 8–13 thuộc 6.2, 14–18 thuộc 6.3, 19–23 thuộc 6.4 và 24–28 thuộc 6.5. Ba slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh và một buổi thực hành 45 phút. Mọi terminal trên slide là output THẬT, ghi ngày 23/09/2026 trên Docker Engine 29.6 (Linux, amd64) và Docker Desktop 4.91 (Mac M1); số lỗ hổng lấy từ Trivy 0.74.0 với CSDL của ngày đó và sẽ khác khi bạn quét — quy luật thì không.</p>
</div>
${gallery('dk-06', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Stage sau bắt đầu trống'], [4, 'Đo thật: 1,88 GB → 467 MB'], [5, '--target: stage không cần thì bỏ qua'],
  [6, 'COPY --from lấy từ stage, ảnh khác, ngữ cảnh có tên'], [7, 'Bí mật ở stage dựng và lệnh kiểm đúng Docker 29'],
  [8, 'Ảnh nền: kích thước và khi nào dùng'], [9, 'musl ≠ glibc'], [10, 'File có thật mà báo no such file'],
  [11, 'Sự cố 502 bảy phút'], [12, 'Dựng lại sự cố với Prisma'], [13, 'Chốt kiểm libc ↔ engine'],
  [14, 'docker history chỉ ra byte ở đâu'], [15, 'Xoá ở RUN sau: 667 MB thay vì 243 MB'], [16, 'npm prune giữ 60 MB Prisma CLI'],
  [17, 'Thang giảm cân 1,88 GB → 337 MB'], [18, 'Docker 29: .Size là bản nén'],
  [19, 'Các lớp khoá quanh tiến trình'], [20, '--read-only và tmpfs cho nginx'], [21, 'Capability: 14 → 0'],
  [22, 'Trọn bộ cờ an toàn và vòng lặp kiểm'], [23, '--privileged và docker.sock = root'],
  [24, 'Chuỗi cung ứng'], [25, 'Quét thật: 12 → 1'], [26, '11/12 lỗi nằm trong npm'], [27, 'Cổng CI hợp lý'], [28, 'SBOM'],
  [29, 'Sai lầm hay gặp'], [30, 'Bảng tra nhanh'], [31, 'Thực hành chương 6'],
])}
`,
    },
    /* ─────────────────────────── 6.1 ─────────────────────────── */
    {
      title: '6.1 — Multi-stage builds, properly|||6.1 — Dựng nhiều tầng, cho tử tế',
      slug: 'dk-6-1-multi-stage',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một Dockerfile nhiều stage, --target để dừng ở giữa, COPY --from lấy từ stage hay từ một ảnh khác, các stage chạy song song, một biến thể :debug từ cùng một file, và cách bí mật biến mất.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Multi-stage builds, properly</h2>
<p class="lead">A multi-stage build is one Dockerfile with several <code>FROM</code> lines. Each starts a fresh filesystem; only the last one becomes your image; and <code>COPY --from</code> reaches back to pull out exactly what you want. Everything else — the compiler, the dev dependencies, the source code, the secret you needed for one step — is simply not in the result.</p>

<h3>The shape</h3>
${slide('dk-06', 3, 'Stage sau bắt đầu trống — chỉ thứ COPY --from mới sang')}
<pre><code># syntax=docker/dockerfile:1

FROM node:22-alpine AS build          <span class="tok-comment"># stage 1: has everything</span>
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build                     <span class="tok-comment"># → /app/dist</span>
RUN npm prune --omit=dev              <span class="tok-comment"># strip dev deps in place</span>

FROM node:22-alpine                   <span class="tok-comment"># stage 2: starts EMPTY of stage 1</span>
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]</code></pre>
<pre><code>docker build -t app:multi .
docker build -t app:single -f Dockerfile.single .
docker images app --format '{{.Tag}}\\t{{.Size}}'</code></pre>
<div class="out">multi	196MB
single	1.24GB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">What disappeared</span><span class="v">The TypeScript compiler, 700 dev dependencies, the source tree, the npm cache, and any build tools. None of it was deleted — the second stage simply never had it.</span></div>
  <div class="kv"><span class="k">Deleting would not have worked</span><span class="v"><code>RUN rm -rf src node_modules/.cache</code> in a single-stage build frees nothing, because lower layers are immutable and a delete is a whiteout (Lesson 1.2). A new stage is the only way to actually not ship something.</span></div>
  <div class="kv"><span class="k">The build stage is still cached</span><span class="v">It is a normal set of layers in the build cache, so the next build reuses it. Multi-stage costs nothing in build time — and often saves it, because independent stages run in parallel (Lesson 5.5).</span></div>
  <div class="kv"><span class="k">Smaller means faster deploys</span><span class="v">196MB versus 1.24GB is a pull that takes seconds instead of minutes, on every server, on every deploy. And a smaller attack surface, which Lesson 6.4 makes concrete.</span></div>
</div>


<h3>Run it step by step: split a real TypeScript + Prisma API</h3>
${slide('dk-06', 4, 'Đo thật cùng một app: 1,88 GB → 467 MB chỉ bằng tách stage')}
<p>The numbers above come from an app you cannot see. Here is one you can rebuild: a small Express API in TypeScript with Prisma 5.22 and PostgreSQL — the same stack as a typical student project, shrunk to four files. It was built three ways on the course's Linux machine (Docker Engine 29.6, amd64, the same architecture as a VPS).</p>
<pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
FROM node:22-slim AS build
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends openssl &amp;&amp; rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci                                   <span class="tok-comment"># everything, including typescript, @types, prisma CLI</span>
COPY . .
RUN npx prisma generate &amp;&amp; npm run build      <span class="tok-comment"># → node_modules/.prisma + dist/</span>
RUN npm prune --omit=dev                     <span class="tok-comment"># drop dev dependencies in place</span>

FROM node:22-slim AS prod
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends openssl &amp;&amp; rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]</code></pre>
<pre><code class="language-bash">docker build -f Dockerfile.single -t dk06-api:single .   <span class="tok-comment"># FROM node:22, COPY . ., npm ci, build — one stage</span>
docker build -f Dockerfile.naive  -t dk06-api:naive  .   <span class="tok-comment"># two stages, but copies node_modules unpruned</span>
docker build                      -t dk06-api:multi  .   <span class="tok-comment"># the file above</span>
docker images dk06-api</code></pre>
<div class="out">IMAGE                 ID             DISK USAGE   CONTENT SIZE   EXTRA
dk06-api:multi        fc0b12148a84        467MB          122MB
dk06-api:naive        8ee9610a128a        487MB          124MB
dk06-api:single       dd89daa3d63b       1.88GB          489MB</div>
<table>
<tr><th>Column</th><th>What it means on Docker 29</th><th>Why you care</th></tr>
<tr><td><code>CONTENT SIZE</code></td><td>The compressed layers — the bytes a server downloads on <code>docker pull</code>.</td><td>Deploy time. 489MB → 122MB means a fresh VPS pulls four times less.</td></tr>
<tr><td><code>DISK USAGE</code></td><td>Compressed <em>plus</em> unpacked copy, because the containerd image store keeps both (Lesson 1.2).</td><td>Disk space on the host. This is the number that filled a VPS disk once.</td></tr>
<tr><td>Older numbers (1.24GB / 196MB above)</td><td>Docker ≤ 27 showed only the unpacked size in a column called <code>SIZE</code>.</td><td>Do not compare numbers across Docker versions without checking which column they came from.</td></tr>
</table>
<pre><code class="language-bash">docker history dk06-api:single --format '{{.Size}}  {{.CreatedBy}}' | grep npm</code></pre>
<div class="out">12.3kB  RUN /bin/sh -c npm run build # buildkit
170MB  RUN /bin/sh -c npm ci # buildkit</div>
<p>Read it slowly: <code>npm ci</code> installed 170MB, and the single-stage image ships all of it plus the 1.2GB <code>node:22</code> toolchain it was built on. Splitting stages removed most of that. Notice also how little <em>naive</em> (487MB) loses compared with <em>multi</em> (467MB): in this app the dev dependencies are only ~25MB, and — as Lesson 6.3 shows — <code>npm prune</code> silently keeps 60MB of Prisma CLI. The big win is the base image and the source/toolchain that never reach the final stage; the pruning details come after.</p>
<table>
<tr><th>Flag</th><th>Meaning</th></tr>
<tr><td><code>-f Dockerfile.single</code></td><td>Use this file instead of <code>./Dockerfile</code>. Forget it and you silently build a different image — exactly the start of the 502 outage in Lesson 6.2.</td></tr>
<tr><td><code>-t dk06-api:multi</code></td><td>Name and tag the result. Without it you get an untagged image you can only address by ID.</td></tr>
<tr><td><code>.</code></td><td>The build context: the folder sent to the builder, filtered by <code>.dockerignore</code> (Lesson 4.1).</td></tr>
<tr><td><code>-q</code></td><td>Quiet: print only the image ID. Handy in scripts.</td></tr>
</table>

<h3>COPY --from can reach anywhere</h3>
${slide('dk-06', 6, 'COPY --from lấy từ stage, từ ảnh khác, từ ngữ cảnh có tên')}
<pre><code><span class="tok-comment"># From a named stage</span>
COPY --from=build /app/dist ./dist

<span class="tok-comment"># From a stage index (works, but fragile — prefer names)</span>
COPY --from=0 /app/dist ./dist

<span class="tok-comment"># From an image that is not a stage at all</span>
COPY --from=nginx:1.27-alpine /etc/nginx/mime.types /etc/nginx/
COPY --from=ghcr.io/jqlang/jq:latest /jq /usr/local/bin/jq

<span class="tok-comment"># From a build context you name on the CLI</span>
docker build --build-context assets=./shared-assets -t app .
<span class="tok-comment"># then in the Dockerfile:</span>
COPY --from=assets logo.svg ./public/</code></pre>
<div class="callout ok"><strong><code>COPY --from=&lt;image&gt;</code> is the neatest way to add a single tool to an image.</strong> Rather than <code>RUN apk add jq</code> — which pulls a package index and its dependencies — you copy one static binary out of an image that already has it. Two lines, a few megabytes, no package manager involved. It works for anything statically linked: <code>jq</code>, <code>dockerize</code>, <code>grpc_health_probe</code>, <code>migrate</code>, <code>tini</code>.</div>


<pre><code class="language-bash"><span class="tok-comment"># Real run (Linux, Docker 29.6): the prod stage of Dockerfile.targets adds</span>
<span class="tok-comment">#   COPY --from=ghcr.io/jqlang/jq:1.8.1 /jq /usr/local/bin/jq</span>
docker run --rm --entrypoint sh dk06-api:prod -c 'jq --version; ls -l /usr/local/bin/jq'</code></pre>
<div class="out">jq-1.8.1
-rwxr-xr-x. 1 root root 2255816 Jul  1  2025 /usr/local/bin/jq</div>
<p>One 2.2MB file, no <code>apk</code> or <code>apt</code> index, no extra layer of package metadata. Pin the source image's tag (<code>jq:1.8.1</code>, not <code>latest</code>) for the same reason you pin a base image: the next build must copy the same bytes.</p>

<h3>--target: stop partway</h3>
${slide('dk-06', 5, '--target: stage không cần thì bỏ qua')}
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

FROM base AS deps
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS dev                      <span class="tok-comment"># ← for local development</span>
COPY . .
CMD ["npm", "run", "dev"]

FROM deps AS test                     <span class="tok-comment"># ← for CI</span>
COPY . .
RUN npm run lint &amp;&amp; npm test

FROM deps AS build
COPY . .
RUN npm run build &amp;&amp; npm prune --omit=dev

FROM node:22-alpine AS prod           <span class="tok-comment"># ← the default: last stage</span>
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]</code></pre>
<pre><code>docker build --target dev   -t app:dev  .
docker build --target test  -t app:test .    <span class="tok-comment"># fails the build if tests fail</span>
docker build                -t app:prod .    <span class="tok-comment"># the last stage</span>
docker images app --format '{{.Tag}} {{.Size}}'</code></pre>
<div class="out">dev 1.19GB
test 1.19GB
prod 196MB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">One file, several outputs</span><span class="v">Development, test and production images from one Dockerfile that cannot drift apart. Compose picks a target with <code>build: { target: dev }</code> (Chapter 9).</span></div>
  <div class="kv"><span class="k">Tests as a build stage</span><span class="v">A failing test fails the build, so a broken image cannot be produced at all. Note the trade-off: it also means you cannot build the image to debug why the tests failed — use <code>--target deps</code> for that.</span></div>
  <div class="kv"><span class="k">Stages inherit from stages</span><span class="v"><code>FROM deps AS dev</code> starts from the <code>deps</code> stage, not from a registry image. That is how <code>base</code> and <code>deps</code> are shared by everything below without repeating themselves.</span></div>
  <div class="kv"><span class="k">Unused stages are skipped</span><span class="v"><code>--target dev</code> never runs the <code>build</code> or <code>test</code> stages at all — BuildKit only executes what the target depends on. So extra stages cost nothing when you do not ask for them.</span></div>
</div>


<h3>What BuildKit actually ran for --target dev</h3>
<p>"Unused stages are skipped" is easy to say and easy to check. Build with <code>--progress=plain</code> (print every step as plain text instead of the collapsing progress display) and look at which stage names appear:</p>
<pre><code class="language-bash">docker build --target dev -t dk06-api:dev --progress=plain . 2&gt;&amp;1 \\
  | grep -E "^#[0-9]+ \\[(base|deps|dev|test|build|prod)" | sort -u -k2,2
docker images --format '{{.Tag}}\\t{{.Size}}' dk06-api | grep -E "^(dev|test|prod)"</code></pre>
<div class="out">#6 [base 1/4] FROM docker.io/library/node:22-slim@sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9
#11 [deps 1/1] RUN npm ci
#12 [dev 1/2] COPY . .
prod	470MB
test	602MB
dev	602MB</div>
<p>Only <code>base</code>, <code>deps</code> and <code>dev</code> appear: <code>test</code>, <code>build</code> and <code>prod</code> never ran. The <code>dev</code> and <code>test</code> images are the same 602MB because both sit on top of <code>deps</code>, which holds every dev dependency; <code>prod</code> is smaller because it starts again from <code>base</code> and copies in only the pruned result. (The numbers are DISK USAGE on the Linux machine.)</p>
<table>
<tr><th>You type</th><th>BuildKit builds</th><th>Typical use</th></tr>
<tr><td><code>docker build --target dev .</code></td><td>base → deps → dev</td><td>Local development with Compose <code>build: { target: dev }</code></td></tr>
<tr><td><code>docker build --target test .</code></td><td>base → deps → test</td><td>CI: the build fails if type-check or tests fail</td></tr>
<tr><td><code>docker build .</code></td><td>base → deps → build → prod</td><td>The image you ship (the last stage is the default target)</td></tr>
</table>

<h3>A :debug variant of the same image</h3>
<pre><code>FROM gcr.io/distroless/nodejs22-debian12 AS prod
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
CMD ["/app/dist/index.js"]

FROM node:22-alpine AS prod-debug       <span class="tok-comment"># same content, plus a shell</span>
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
RUN apk add --no-cache curl jq
CMD ["node", "/app/dist/index.js"]</code></pre>
<pre><code>docker build --target prod       -t app:1.4.2 .
docker build --target prod-debug -t app:1.4.2-debug .</code></pre>
<div class="callout"><strong>This is the answer to "distroless is great until something breaks".</strong> Ship <code>prod</code>, which has no shell and no package manager for an attacker to use. Keep <code>prod-debug</code> built from the same artifacts, and when you need to look inside, run that instead — or use the sidecar technique from Lesson 2.3. What you must not do is add a shell to the production image "just in case"; that is trading a permanent weakness for an occasional convenience you have a better answer for.</div>

<h3>Secrets really do disappear</h3>
${slide('dk-06', 7, 'Bí mật ở stage dựng không lên ảnh — và lệnh kiểm đúng cho Docker 29')}
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json .npmrc ./     <span class="tok-comment"># private registry token</span>
RUN npm ci &amp;&amp; rm .npmrc
COPY . .
RUN npm run build

FROM node:22-alpine
COPY --from=build /app/dist ./dist                <span class="tok-comment"># ONLY dist is copied</span>
CMD ["node", "dist/index.js"]</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># Docker 25+ (and every Docker 29): layers live in blobs/sha256/, not */layer.tar</span>
mkdir out &amp;&amp; docker save app:multi | tar -x -C out
for f in out/blobs/sha256/*; do tar -tf "\$f" 2&gt;/dev/null; done | grep -cE '^app/(\\.wh\\.)?\\.npmrc&#36;'</code></pre>
<div class="out">0</div>
<div class="callout warn"><strong>This check used to be written differently — and the old version checks nothing on today's Docker.</strong> Earlier editions of this lesson searched <code>'*/layer.tar'</code> inside <code>docker save</code>. Since Docker 25, <code>docker save</code> writes an OCI layout: each layer is a file in <code>blobs/sha256/</code> named by its hash, and there is no <code>layer.tar</code> at all. The old pipeline therefore printed <code>0</code> for <em>every</em> image. Measured on the course Mac (Docker 29.8) with two images built from the same <code>.npmrc</code>: the old command printed <code>0</code> for both; the loop above printed <code>2</code> for the single-stage image (the file plus its <code>.wh..npmrc</code> whiteout) and <code>0</code> for the multi-stage one. A check that cannot fail is worse than no check, because you believe it. Grep for the exact path, too: a bare <code>grep npmrc</code> on any <code>node</code> image also matches npm's own <code>.npmrc</code>, <code>npmrc.md</code>, <code>npmrc.html</code> and <code>man5/npmrc.5</code> — four false hits measured on <code>node:22-slim</code>. The pattern above counts only <code>app/.npmrc</code> and its whiteout <code>app/.wh..npmrc</code>.</div>
<p>The <code>.npmrc</code> exists in a layer of the <em>build</em> stage — which is never published, because only the final stage's layers are exported. That is a genuine improvement over single-stage, where <code>rm .npmrc</code> leaves the file in an earlier layer (Lesson 1.2). It is still not the best answer: <code>RUN --mount=type=secret</code> keeps the value out of <em>every</em> layer including the build stage's, and out of the build cache you might export to a registry (Lesson 5.4). Use the mount when you can, and multi-stage as the fallback.</p>

<h3>What to put where</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Build stage: everything</span><span class="lz-t">compilers, dev dependencies, source, test fixtures, secrets</span><span class="lz-d">Size does not matter here at all. Optimise this stage for cache hits (Chapter 5), not for bytes.</span></div>
  <div class="lz-step"><span class="lz-k">Final stage: the runtime and the artifact</span><span class="lz-t">the interpreter or nothing, plus dist/ and production node_modules</span><span class="lz-d">Ask of every line: does the running process need this? If not, it belongs in an earlier stage.</span></div>
  <div class="lz-step"><span class="lz-k">Never COPY . . into the final stage</span><span class="lz-t">it undoes the whole exercise</span><span class="lz-d">Copy named artifacts from named stages. A <code>COPY . .</code> at the end brings the source tree, the tests and the <code>.env</code> back in.</span></div>
  <div class="lz-step"><span class="lz-k">Put USER, ENV and CMD last</span><span class="lz-t">after the COPYs that need root</span><span class="lz-d">They are free metadata and belong where they are easiest to read (Lesson 4.2).</span></div>
  <div class="lz-step"><span class="lz-k">Name every stage</span><span class="lz-t">AS base, AS deps, AS build, AS prod</span><span class="lz-d">Indexes break when you insert a stage; names do not, and they make <code>--target</code> and <code>--cache-from</code> readable.</span></div>
</div>


<h3>When multi-stage is worth it — and when it is not</h3>
<table>
<tr><th>Situation</th><th>Multi-stage?</th><th>Why</th></tr>
<tr><td>TypeScript, Next.js, Go, Java, Rust — anything with a build step</td><td>Yes, always</td><td>The compiler and source never need to ship. This is where the 60–85% savings come from.</td></tr>
<tr><td>Native modules (bcrypt, sharp, Prisma engines) that need <code>g++</code> to install</td><td>Yes</td><td>Compilers stay in the build stage; the runtime only needs the compiled <code>.node</code> files — on the <em>same libc</em> (Lesson 6.2).</td></tr>
<tr><td>A plain JavaScript script with two runtime dependencies</td><td>Optional</td><td>With <code>npm ci --omit=dev</code> on a <code>-slim</code> base there is little to leave behind. One stage is fine and easier to read.</td></tr>
<tr><td>A throwaway tool image you run once</td><td>No</td><td>Size does not matter for something that is never deployed.</td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your SWP391 team's API image is 1.2GB, and the free VPS takes four minutes to pull it on every deploy. A teammate also committed an <code>.npmrc</code> with a GitHub token "only for the build". Make the image small and prove the token is not in it.</p><ol>
<li><code>mkdir -p ~/thu-docker/ch06-multi &amp;&amp; cd ~/thu-docker/ch06-multi</code>. Create a tiny TypeScript project: <code>npm init -y &amp;&amp; npm i express &amp;&amp; npm i -D typescript @types/express @types/node</code>, a <code>src/index.ts</code> that listens on 8080, <code>"build": "tsc --esModuleInterop --outDir dist src/index.ts"</code> in <code>package.json</code>, and a fake <code>.npmrc</code> (block below).</li>
<li>Write <code>Dockerfile.single</code> (<code>FROM node:22</code>, <code>COPY . .</code>, <code>npm ci</code>, <code>npm run build</code>) and build it as <code>thu-api:single</code>.</li>
<li>Write a two-stage <code>Dockerfile</code> in the shape of this lesson (build stage copies <code>.npmrc</code>, runs <code>npm ci</code>, build, <code>npm prune --omit=dev</code>; final stage <code>node:22-slim</code> copies only <code>node_modules</code> and <code>dist</code>). Build <code>thu-api:multi</code>.</li>
<li><code>docker images thu-api</code> — write down both CONTENT SIZE numbers. Then run the <code>blobs/sha256</code> loop from "Secrets really do disappear" against both images (the <code>grep -cE '^app/(\\.wh\\.)?\\.npmrc&#36;'</code> version).</li>
<li>Clean up: <code>docker rmi thu-api:single thu-api:multi</code>.</li></ol>
<pre><code class="language-bash">printf '//npm.pkg.github.com/:_authToken=ghp_GIA_thu123\\n' &gt; .npmrc
cat &gt; src/index.ts &lt;&lt;'EOF'
import express from 'express';
express().get('/', (_q, r) =&gt; { r.send('ok'); }).listen(8080);
EOF</code></pre>
<p><strong>Done when:</strong> the multi-stage CONTENT SIZE is at least 60% smaller than the single-stage one, the loop prints a number ≥ 1 for <code>thu-api:single</code> and <code>0</code> for <code>thu-api:multi</code>, and you can say why deleting <code>.npmrc</code> in a later <code>RUN</code> would not have helped.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Stage</span><span class="v">One <code>FROM</code> and the lines under it. Each stage starts from its own base with an empty history.</span></div>
  <div class="kv"><span class="k">Multi-stage build</span><span class="v">A Dockerfile with several stages where only the last (or the <code>--target</code>) becomes the image.</span></div>
  <div class="kv"><span class="k">COPY --from</span><span class="v">Copy files out of another stage, another image, or a named build context.</span></div>
  <div class="kv"><span class="k">--target</span><span class="v">Stop the build at a named stage; stages it does not depend on are not run.</span></div>
  <div class="kv"><span class="k">Artifact</span><span class="v">The thing a build produces and the runtime needs: <code>dist/</code>, a binary, production <code>node_modules</code>.</span></div>
  <div class="kv"><span class="k">npm prune --omit=dev</span><span class="v">Remove packages that are only needed for development from an existing <code>node_modules</code>.</span></div>
  <div class="kv"><span class="k">OCI layout</span><span class="v">The folder format <code>docker save</code> writes since Docker 25: <code>index.json</code> plus <code>blobs/sha256/</code>, one file per layer.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A later <code>FROM</code> starts from an empty filesystem: anything you do not <code>COPY --from</code> is simply not in the image.</li>
<li>On a real TypeScript + Prisma API, splitting stages took DISK USAGE from 1.88GB to 467MB and the download from 489MB to 122MB.</li>
<li><code>--target</code> builds one stage and everything it depends on; unrelated stages are not executed at all.</li>
<li><code>COPY --from=&lt;image&gt;</code> adds one static tool in two lines without a package manager — pin its tag.</li>
<li>A secret used only in the build stage does not reach the published image, but <code>RUN --mount=type=secret</code> is still the better tool.</li>
<li>Check for leaked files by listing <code>blobs/sha256/*</code> from <code>docker save</code>; the old <code>*/layer.tar</code> check finds nothing on Docker 25+.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/build/building/multi-stage/" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">Multi-stage builds</span><span class="lc-sub">The official guide: naming stages, stopping at a target, copying from external images, and the differences from the old builder-pattern workaround.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/context/#named-contexts" target="_blank" rel="noopener">
  <span class="lc-ico">📎</span>
  <span class="lc-body"><span class="lc-title">Named build contexts</span><span class="lc-sub"><code>--build-context name=path</code> — how to bring in a directory outside your context, or pin a stage to a specific image at build time without editing the Dockerfile.</span></span>
</a>
<a class="link-card" href="https://github.com/wagoodman/dive" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">dive</span><span class="lc-sub">Browse the final image layer by layer and confirm nothing from the build stage leaked in. The fastest way to check that a multi-stage refactor did what you think.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: split the stages</span><span class="lc-sub">Graded exercises: convert a 1.2GB single-stage image to multi-stage and measure, add a <code>test</code> stage that fails the build, produce a <code>:debug</code> variant, and prove a secret is absent from the published layers.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> copying <code>node_modules</code> from the build stage without pruning it first. The build stage installed <em>everything</em>, so <code>COPY --from=build /app/node_modules</code> brings 700 dev dependencies into your production image and the multi-stage build saves you almost nothing. Two fixes: run <code>npm prune --omit=dev</code> at the end of the build stage, or keep a separate <code>deps</code> stage that only ever ran <code>npm ci --omit=dev</code> and copy from that one. The same trap exists for Python (<code>pip install --prefix=/install</code> in the build stage) and for anything where the build and runtime dependency sets differ.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A later <code>FROM</code> starts a completely fresh filesystem, so things you do not copy forward are not in the image — which is the only reliable way to <em>not</em> ship something, since deleting leaves a whiteout. <code>COPY --from</code> reaches into a named stage, an external image or a named context, which makes adding a single static binary a two-line operation. And name every stage: it makes <code>--target</code> readable, survives insertions, and lets one Dockerfile produce dev, test, prod and debug images that cannot drift apart.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Dựng nhiều tầng, cho tử tế</h2>
<p class="lead">Một lượt dựng nhiều tầng là MỘT Dockerfile với NHIỀU dòng <code>FROM</code>. Mỗi cái bắt đầu một hệ thống file mới tinh; chỉ cái cuối cùng trở thành ảnh của bạn; và <code>COPY --from</code> với ngược lại lôi ra đúng thứ bạn muốn. Mọi thứ khác — trình biên dịch, thư viện dev, mã nguồn, cái bí mật bạn cần cho một bước — đơn giản là KHÔNG có mặt trong kết quả.</p>

<h3>Hình hài</h3>
${slide('dk-06', 3, 'Stage sau bắt đầu trống — chỉ thứ COPY --from mới sang')}
<pre><code># syntax=docker/dockerfile:1

FROM node:22-alpine AS build          <span class="tok-comment"># stage 1: có tất cả</span>
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build                     <span class="tok-comment"># → /app/dist</span>
RUN npm prune --omit=dev              <span class="tok-comment"># cắt thư viện dev tại chỗ</span>

FROM node:22-alpine                   <span class="tok-comment"># stage 2: bắt đầu TRỐNG so với stage 1</span>
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]</code></pre>
<pre><code>docker build -t app:multi .
docker build -t app:single -f Dockerfile.single .
docker images app --format '{{.Tag}}\\t{{.Size}}'</code></pre>
<div class="out">multi	196MB
single	1.24GB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Thứ đã biến mất</span><span class="v">Trình biên dịch TypeScript, 700 thư viện dev, cây mã nguồn, bộ đệm npm, và mọi công cụ dựng. Không cái nào bị XOÁ cả — stage thứ hai đơn giản là CHƯA BAO GIỜ CÓ chúng.</span></div>
  <div class="kv"><span class="k">Xoá đi thì đã không được</span><span class="v"><code>RUN rm -rf src node_modules/.cache</code> trong một lượt dựng một tầng chẳng giải phóng được gì, vì tầng dưới là bất biến và một lần xoá chỉ là một whiteout (Bài 1.2). Một stage mới là cách DUY NHẤT để thật sự không đem theo một thứ gì đó.</span></div>
  <div class="kv"><span class="k">Stage dựng vẫn nằm trong cache</span><span class="v">Nó là một bộ tầng bình thường trong bộ đệm dựng, nên lượt dựng sau dùng lại nó. Dựng nhiều tầng KHÔNG tốn thêm thời gian dựng — và thường còn tiết kiệm, vì các stage độc lập chạy song song (Bài 5.5).</span></div>
  <div class="kv"><span class="k">Nhỏ hơn nghĩa là deploy nhanh hơn</span><span class="v">196MB so với 1,24GB là một lượt kéo mất vài giây thay vì vài phút, trên mọi máy chủ, ở mọi bản deploy. Và một bề mặt tấn công nhỏ hơn, thứ mà Bài 6.4 cụ thể hoá.</span></div>
</div>


<h3>Chạy thử từng bước: tách stage cho một API TypeScript + Prisma thật</h3>
${slide('dk-06', 4, 'Đo thật cùng một app: 1,88 GB → 467 MB chỉ bằng tách stage')}
<p>Những con số ở trên đến từ một ứng dụng bạn không nhìn thấy. Đây là một ứng dụng bạn dựng lại được: một API Express viết bằng TypeScript, dùng Prisma 5.22 và PostgreSQL — đúng bộ công nghệ của một đồ án sinh viên điển hình, thu nhỏ còn bốn file. Nó được dựng theo ba cách trên máy Linux của khoá (Docker Engine 29.6, amd64 — cùng kiến trúc với VPS).</p>
<pre><code class="language-dockerfile"># syntax=docker/dockerfile:1
FROM node:22-slim AS build
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends openssl &amp;&amp; rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci                                   <span class="tok-comment"># mọi thứ, kể cả typescript, @types, prisma CLI</span>
COPY . .
RUN npx prisma generate &amp;&amp; npm run build      <span class="tok-comment"># → node_modules/.prisma + dist/</span>
RUN npm prune --omit=dev                     <span class="tok-comment"># bỏ thư viện dev tại chỗ</span>

FROM node:22-slim AS prod
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends openssl &amp;&amp; rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]</code></pre>
<pre><code class="language-bash">docker build -f Dockerfile.single -t dk06-api:single .   <span class="tok-comment"># FROM node:22, COPY . ., npm ci, build — một stage</span>
docker build -f Dockerfile.naive  -t dk06-api:naive  .   <span class="tok-comment"># hai stage, nhưng chép node_modules chưa tỉa</span>
docker build                      -t dk06-api:multi  .   <span class="tok-comment"># file ở trên</span>
docker images dk06-api</code></pre>
<div class="out">IMAGE                 ID             DISK USAGE   CONTENT SIZE   EXTRA
dk06-api:multi        fc0b12148a84        467MB          122MB
dk06-api:naive        8ee9610a128a        487MB          124MB
dk06-api:single       dd89daa3d63b       1.88GB          489MB</div>
<table>
<tr><th>Cột</th><th>Nghĩa trên Docker 29</th><th>Vì sao bạn cần quan tâm</th></tr>
<tr><td><code>CONTENT SIZE</code> (kích thước nội dung)</td><td>Các tầng ở dạng NÉN — số byte máy chủ phải tải khi <code>docker pull</code>.</td><td>Thời gian deploy. 489MB → 122MB nghĩa là một VPS mới kéo ít đi bốn lần.</td></tr>
<tr><td><code>DISK USAGE</code> (dung lượng trên đĩa)</td><td>Bản nén <em>CỘNG</em> bản đã giải nén, vì kho ảnh containerd giữ cả hai (Bài 1.2).</td><td>Chỗ trống trên đĩa máy chủ. Đây là con số từng làm đầy đĩa một VPS.</td></tr>
<tr><td>Số cũ (1.24GB / 196MB ở trên)</td><td>Docker ≤ 27 chỉ hiện kích thước đã giải nén trong một cột tên <code>SIZE</code>.</td><td>Đừng so số giữa các phiên bản Docker khi chưa biết nó lấy từ cột nào.</td></tr>
</table>
<pre><code class="language-bash">docker history dk06-api:single --format '{{.Size}}  {{.CreatedBy}}' | grep npm</code></pre>
<div class="out">12.3kB  RUN /bin/sh -c npm run build # buildkit
170MB  RUN /bin/sh -c npm ci # buildkit</div>
<p>Đọc chậm thôi: <code>npm ci</code> cài 170MB, và ảnh một stage chở TẤT CẢ số đó cộng bộ công cụ 1,2GB của <code>node:22</code> mà nó được dựng lên trên. Tách stage đã bỏ được phần lớn. Để ý nữa: bản <em>naive</em> (487MB) chỉ thua bản <em>multi</em> (467MB) rất ít: trong app này thư viện dev chỉ khoảng 25MB, và — như Bài 6.3 sẽ chỉ ra — <code>npm prune</code> lặng lẽ GIỮ LẠI 60MB Prisma CLI. Cái lợi lớn nằm ở ảnh nền cùng mã nguồn/bộ công cụ không bao giờ tới stage cuối; chuyện tỉa tót để sau.</p>
<table>
<tr><th>Cờ</th><th>Nghĩa</th></tr>
<tr><td><code>-f Dockerfile.single</code></td><td>Dùng file này thay cho <code>./Dockerfile</code>. Quên nó là bạn lặng lẽ dựng ra một ảnh KHÁC — đúng điểm khởi đầu của sự cố 502 ở Bài 6.2.</td></tr>
<tr><td><code>-t dk06-api:multi</code></td><td>Đặt tên và tag cho kết quả. Không có nó thì bạn nhận một ảnh không tên, chỉ gọi được bằng ID.</td></tr>
<tr><td><code>.</code></td><td>Ngữ cảnh dựng (build context): thư mục gửi cho builder, đã lọc qua <code>.dockerignore</code> (Bài 4.1).</td></tr>
<tr><td><code>-q</code></td><td>Im lặng: chỉ in ID ảnh. Tiện khi viết script.</td></tr>
</table>

<h3>COPY --from với tới được mọi nơi</h3>
${slide('dk-06', 6, 'COPY --from lấy từ stage, từ ảnh khác, từ ngữ cảnh có tên')}
<pre><code><span class="tok-comment"># Từ một stage có tên</span>
COPY --from=build /app/dist ./dist

<span class="tok-comment"># Từ chỉ số của stage (chạy được, nhưng dễ vỡ — nên dùng TÊN)</span>
COPY --from=0 /app/dist ./dist

<span class="tok-comment"># Từ một cái ảnh hoàn toàn không phải stage nào</span>
COPY --from=nginx:1.27-alpine /etc/nginx/mime.types /etc/nginx/
COPY --from=ghcr.io/jqlang/jq:latest /jq /usr/local/bin/jq

<span class="tok-comment"># Từ một ngữ cảnh dựng bạn đặt tên trên dòng lệnh</span>
docker build --build-context assets=./shared-assets -t app .
<span class="tok-comment"># rồi trong Dockerfile:</span>
COPY --from=assets logo.svg ./public/</code></pre>
<div class="callout ok"><strong><code>COPY --from=&lt;ảnh&gt;</code> là cách gọn gàng nhất để thêm MỘT công cụ vào một cái ảnh.</strong> Thay vì <code>RUN apk add jq</code> — thứ kéo về một danh mục gói cùng đám phụ thuộc của nó — bạn chép MỘT chương trình tĩnh ra khỏi một cái ảnh vốn đã có nó. Hai dòng, vài megabyte, không dính tới trình quản lý gói nào. Nó chạy với mọi thứ liên kết tĩnh: <code>jq</code>, <code>dockerize</code>, <code>grpc_health_probe</code>, <code>migrate</code>, <code>tini</code>.</div>


<pre><code class="language-bash"><span class="tok-comment"># Chạy thật (Linux, Docker 29.6): stage prod của Dockerfile.targets có thêm</span>
<span class="tok-comment">#   COPY --from=ghcr.io/jqlang/jq:1.8.1 /jq /usr/local/bin/jq</span>
docker run --rm --entrypoint sh dk06-api:prod -c 'jq --version; ls -l /usr/local/bin/jq'</code></pre>
<div class="out">jq-1.8.1
-rwxr-xr-x. 1 root root 2255816 Jul  1  2025 /usr/local/bin/jq</div>
<p>Một file 2,2MB, không có danh mục gói <code>apk</code> hay <code>apt</code>, không có thêm tầng siêu dữ liệu gói nào. Hãy ghim tag của ảnh nguồn (<code>jq:1.8.1</code>, không phải <code>latest</code>) vì cùng lý do bạn ghim ảnh nền: lần dựng sau phải chép ĐÚNG những byte đó.</p>

<h3>--target: dừng lại giữa chừng</h3>
${slide('dk-06', 5, '--target: stage không cần thì bỏ qua')}
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

FROM base AS deps
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS dev                      <span class="tok-comment"># ← để phát triển cục bộ</span>
COPY . .
CMD ["npm", "run", "dev"]

FROM deps AS test                     <span class="tok-comment"># ← cho CI</span>
COPY . .
RUN npm run lint &amp;&amp; npm test

FROM deps AS build
COPY . .
RUN npm run build &amp;&amp; npm prune --omit=dev

FROM node:22-alpine AS prod           <span class="tok-comment"># ← mặc định: stage cuối</span>
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]</code></pre>
<pre><code>docker build --target dev   -t app:dev  .
docker build --target test  -t app:test .    <span class="tok-comment"># test hỏng thì lượt dựng hỏng</span>
docker build                -t app:prod .    <span class="tok-comment"># stage cuối</span>
docker images app --format '{{.Tag}} {{.Size}}'</code></pre>
<div class="out">dev 1.19GB
test 1.19GB
prod 196MB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Một file, nhiều đầu ra</span><span class="v">Ảnh phát triển, ảnh test và ảnh production từ MỘT Dockerfile không thể lệch nhau. Compose chọn một target bằng <code>build: { target: dev }</code> (Chương 9).</span></div>
  <div class="kv"><span class="k">Test làm một stage dựng</span><span class="v">Một test hỏng thì lượt dựng hỏng, nên một cái ảnh hỏng hoàn toàn không được tạo ra. Chú ý cái đánh đổi: nó cũng nghĩa là bạn không dựng được cái ảnh để gỡ lỗi xem vì sao test hỏng — hãy dùng <code>--target deps</code> cho việc đó.</span></div>
  <div class="kv"><span class="k">Stage kế thừa từ stage</span><span class="v"><code>FROM deps AS dev</code> bắt đầu từ stage <code>deps</code>, không phải từ một ảnh trong registry. Đó là cách <code>base</code> và <code>deps</code> được dùng chung bởi mọi thứ bên dưới mà không phải lặp lại.</span></div>
  <div class="kv"><span class="k">Stage không dùng tới thì bị BỎ QUA</span><span class="v"><code>--target dev</code> hoàn toàn không chạy stage <code>build</code> hay <code>test</code> — BuildKit chỉ thực thi những gì cái target phụ thuộc vào. Nên các stage thừa không tốn gì khi bạn không yêu cầu chúng.</span></div>
</div>


<h3>BuildKit thật sự đã chạy những gì với --target dev</h3>
<p>"Stage không dùng thì bị bỏ qua" nói thì dễ, và kiểm cũng dễ. Dựng với <code>--progress=plain</code> (in từng bước ra dạng chữ thường thay vì màn hình tiến độ tự thu gọn) rồi xem những tên stage nào xuất hiện:</p>
<pre><code class="language-bash">docker build --target dev -t dk06-api:dev --progress=plain . 2&gt;&amp;1 \\
  | grep -E "^#[0-9]+ \\[(base|deps|dev|test|build|prod)" | sort -u -k2,2
docker images --format '{{.Tag}}\\t{{.Size}}' dk06-api | grep -E "^(dev|test|prod)"</code></pre>
<div class="out">#6 [base 1/4] FROM docker.io/library/node:22-slim@sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9
#11 [deps 1/1] RUN npm ci
#12 [dev 1/2] COPY . .
prod	470MB
test	602MB
dev	602MB</div>
<p>Chỉ có <code>base</code>, <code>deps</code> và <code>dev</code> xuất hiện: <code>test</code>, <code>build</code> và <code>prod</code> hoàn toàn không chạy. Ảnh <code>dev</code> và <code>test</code> cùng 602MB vì cả hai nằm trên <code>deps</code>, nơi chứa mọi thư viện dev; <code>prod</code> nhỏ hơn vì nó bắt đầu lại từ <code>base</code> rồi chỉ chép vào kết quả đã tỉa. (Các số là DISK USAGE trên máy Linux.)</p>
<table>
<tr><th>Bạn gõ</th><th>BuildKit dựng</th><th>Dùng khi</th></tr>
<tr><td><code>docker build --target dev .</code></td><td>base → deps → dev</td><td>Phát triển ở máy, Compose đặt <code>build: { target: dev }</code></td></tr>
<tr><td><code>docker build --target test .</code></td><td>base → deps → test</td><td>CI: kiểm kiểu hoặc test hỏng thì lượt dựng hỏng</td></tr>
<tr><td><code>docker build .</code></td><td>base → deps → build → prod</td><td>Ảnh đem đi chạy (stage cuối là target mặc định)</td></tr>
</table>

<h3>Một biến thể :debug từ cùng cái ảnh</h3>
<pre><code>FROM gcr.io/distroless/nodejs22-debian12 AS prod
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
CMD ["/app/dist/index.js"]

FROM node:22-alpine AS prod-debug       <span class="tok-comment"># cùng nội dung, thêm một cái shell</span>
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
RUN apk add --no-cache curl jq
CMD ["node", "/app/dist/index.js"]</code></pre>
<pre><code>docker build --target prod       -t app:1.4.2 .
docker build --target prod-debug -t app:1.4.2-debug .</code></pre>
<div class="callout"><strong>Đây là câu trả lời cho "distroless thì tuyệt cho tới khi có thứ gì hỏng".</strong> Hãy đem đi bản <code>prod</code>, thứ không có shell và không có trình quản lý gói nào cho kẻ tấn công dùng. Giữ lại <code>prod-debug</code> dựng từ CÙNG những hiện vật đó, và khi cần nhìn vào bên trong thì chạy cái đó — hoặc dùng kỹ thuật container phụ ở Bài 2.3. Thứ bạn KHÔNG được làm là thêm một cái shell vào ảnh production "để phòng khi cần"; đó là đánh đổi một điểm yếu vĩnh viễn lấy một sự tiện lợi thi thoảng mà bạn vốn đã có câu trả lời tốt hơn.</div>

<h3>Bí mật thật sự biến mất</h3>
${slide('dk-06', 7, 'Bí mật ở stage dựng không lên ảnh — và lệnh kiểm đúng cho Docker 29')}
<pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json .npmrc ./     <span class="tok-comment"># token registry riêng</span>
RUN npm ci &amp;&amp; rm .npmrc
COPY . .
RUN npm run build

FROM node:22-alpine
COPY --from=build /app/dist ./dist                <span class="tok-comment"># CHỈ dist được chép</span>
CMD ["node", "dist/index.js"]</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># Docker 25+ (và mọi Docker 29): tầng nằm ở blobs/sha256/, không phải */layer.tar</span>
mkdir out &amp;&amp; docker save app:multi | tar -x -C out
for f in out/blobs/sha256/*; do tar -tf "\$f" 2&gt;/dev/null; done | grep -cE '^app/(\\.wh\\.)?\\.npmrc&#36;'</code></pre>
<div class="out">0</div>
<div class="callout warn"><strong>Lệnh kiểm này trước đây được viết khác — và bản cũ chẳng kiểm được gì trên Docker bây giờ.</strong> Bản trước của bài tìm <code>'*/layer.tar'</code> bên trong <code>docker save</code>. Từ Docker 25, <code>docker save</code> ghi ra bố cục OCI: mỗi tầng là một file trong <code>blobs/sha256/</code> đặt tên theo mã băm, và KHÔNG còn <code>layer.tar</code> nào. Nên đường ống cũ in <code>0</code> với <em>MỌI</em> ảnh. Đo trên máy Mac của khoá (Docker 29.8) với hai ảnh dựng từ cùng một <code>.npmrc</code>: lệnh cũ in <code>0</code> cho cả hai; vòng lặp ở trên in <code>2</code> cho ảnh một stage (file đó cộng dấu xoá <code>.wh..npmrc</code>) và <code>0</code> cho ảnh nhiều stage. Một phép kiểm không thể hỏng còn tệ hơn không kiểm, vì bạn TIN nó. Hãy grep ĐÚNG đường dẫn nữa: một lệnh <code>grep npmrc</code> trần trên bất kỳ ảnh <code>node</code> nào cũng khớp luôn <code>.npmrc</code>, <code>npmrc.md</code>, <code>npmrc.html</code> và <code>man5/npmrc.5</code> của chính npm — bốn kết quả giả, đo trên <code>node:22-slim</code>. Mẫu ở trên chỉ đếm <code>app/.npmrc</code> và dấu xoá <code>app/.wh..npmrc</code> của nó.</div>
<p>File <code>.npmrc</code> có tồn tại trong một tầng của stage <em>DỰNG</em> — và stage đó không bao giờ được công bố, vì chỉ những tầng của stage CUỐI mới được xuất ra. Đó là một cải thiện có thật so với một tầng, nơi <code>rm .npmrc</code> để lại cái file trong một tầng trước đó (Bài 1.2). Nó vẫn chưa phải câu trả lời tốt nhất: <code>RUN --mount=type=secret</code> giữ giá trị đó nằm ngoài <em>MỌI</em> tầng kể cả của stage dựng, và nằm ngoài cả cái cache dựng mà bạn có thể xuất lên registry (Bài 5.4). Hãy dùng cái mount khi có thể, và dùng nhiều tầng làm phương án dự phòng.</p>

<h3>Đặt cái gì vào đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Stage dựng: mọi thứ</span><span class="lz-t">trình biên dịch, thư viện dev, mã nguồn, dữ liệu test, bí mật</span><span class="lz-d">Kích thước ở đây hoàn toàn không quan trọng. Hãy tối ưu stage này cho việc TRÚNG CACHE (Chương 5), không phải cho số byte.</span></div>
  <div class="lz-step"><span class="lz-k">Stage cuối: môi trường chạy và hiện vật</span><span class="lz-t">trình thông dịch hoặc không gì cả, cộng dist/ và node_modules production</span><span class="lz-d">Hãy hỏi ở mọi dòng: tiến trình đang chạy có CẦN cái này không? Không thì nó thuộc về một stage trước đó.</span></div>
  <div class="lz-step"><span class="lz-k">Đừng bao giờ COPY . . vào stage cuối</span><span class="lz-t">nó phá tan toàn bộ bài tập này</span><span class="lz-d">Hãy chép những hiện vật CÓ TÊN từ những stage CÓ TÊN. Một lệnh <code>COPY . .</code> ở cuối sẽ lôi cây mã nguồn, đám test và cái <code>.env</code> quay trở lại.</span></div>
  <div class="lz-step"><span class="lz-k">Đặt USER, ENV và CMD sau cùng</span><span class="lz-t">sau những lệnh COPY cần quyền root</span><span class="lz-d">Chúng là siêu dữ liệu miễn phí và thuộc về chỗ dễ đọc nhất (Bài 4.2).</span></div>
  <div class="lz-step"><span class="lz-k">Đặt TÊN cho mọi stage</span><span class="lz-t">AS base, AS deps, AS build, AS prod</span><span class="lz-d">Chỉ số vỡ khi bạn chèn thêm một stage; tên thì không, và tên làm cho <code>--target</code> với <code>--cache-from</code> đọc được.</span></div>
</div>


<h3>Khi nào dựng nhiều stage là đáng — và khi nào KHÔNG</h3>
<table>
<tr><th>Tình huống</th><th>Nhiều stage?</th><th>Vì sao</th></tr>
<tr><td>TypeScript, Next.js, Go, Java, Rust — mọi thứ có bước build</td><td>Có, luôn luôn</td><td>Trình biên dịch và mã nguồn không bao giờ cần đem đi. Khoản tiết kiệm 60–85% đến từ đây.</td></tr>
<tr><td>Module native (bcrypt, sharp, engine Prisma) cần <code>g++</code> để cài</td><td>Có</td><td>Trình biên dịch ở lại stage dựng; lúc chạy chỉ cần file <code>.node</code> đã biên dịch — trên <em>CÙNG libc</em> (Bài 6.2).</td></tr>
<tr><td>Một script JavaScript thuần với hai thư viện lúc chạy</td><td>Tuỳ</td><td>Với <code>npm ci --omit=dev</code> trên nền <code>-slim</code> thì chẳng còn gì để bỏ lại. Một stage là ổn và dễ đọc hơn.</td></tr>
<tr><td>Một ảnh công cụ dùng một lần rồi thôi</td><td>Không</td><td>Kích thước không quan trọng với thứ không bao giờ được deploy.</td></tr>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> ảnh API của nhóm SWP391 nặng 1,2GB, và con VPS miễn phí mất bốn phút để kéo nó ở mỗi lần deploy. Một bạn còn commit một file <code>.npmrc</code> có token GitHub "chỉ để build thôi". Hãy làm ảnh nhỏ lại và CHỨNG MINH token không nằm trong đó.</p><ol>
<li><code>mkdir -p ~/thu-docker/ch06-multi &amp;&amp; cd ~/thu-docker/ch06-multi</code>. Tạo một dự án TypeScript nhỏ: <code>npm init -y &amp;&amp; npm i express &amp;&amp; npm i -D typescript @types/express @types/node</code>, một file <code>src/index.ts</code> nghe cổng 8080, thêm <code>"build": "tsc --esModuleInterop --outDir dist src/index.ts"</code> vào <code>package.json</code>, và một <code>.npmrc</code> giả (khối bên dưới).</li>
<li>Viết <code>Dockerfile.single</code> (<code>FROM node:22</code>, <code>COPY . .</code>, <code>npm ci</code>, <code>npm run build</code>) rồi dựng thành <code>thu-api:single</code>.</li>
<li>Viết một <code>Dockerfile</code> hai stage theo đúng hình hài của bài (stage dựng chép <code>.npmrc</code>, chạy <code>npm ci</code>, build, <code>npm prune --omit=dev</code>; stage cuối <code>node:22-slim</code> chỉ chép <code>node_modules</code> và <code>dist</code>). Dựng thành <code>thu-api:multi</code>.</li>
<li><code>docker images thu-api</code> — ghi lại hai con số CONTENT SIZE. Rồi chạy vòng lặp <code>blobs/sha256</code> ở mục "Bí mật thật sự biến mất" cho cả hai ảnh (bản có <code>grep -cE '^app/(\\.wh\\.)?\\.npmrc&#36;'</code>).</li>
<li>Dọn dẹp: <code>docker rmi thu-api:single thu-api:multi</code>.</li></ol>
<pre><code class="language-bash">printf '//npm.pkg.github.com/:_authToken=ghp_GIA_thu123\\n' &gt; .npmrc
cat &gt; src/index.ts &lt;&lt;'EOF'
import express from 'express';
express().get('/', (_q, r) =&gt; { r.send('ok'); }).listen(8080);
EOF</code></pre>
<p><strong>Đạt khi:</strong> CONTENT SIZE của bản nhiều stage nhỏ hơn bản một stage ít nhất 60%, vòng lặp in một số ≥ 1 với <code>thu-api:single</code> và <code>0</code> với <code>thu-api:multi</code>, và bạn nói được vì sao xoá <code>.npmrc</code> ở một <code>RUN</code> phía sau sẽ không cứu được gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Stage (giai đoạn dựng)</span><span class="v">Một dòng <code>FROM</code> cùng các dòng bên dưới nó. Mỗi stage bắt đầu từ ảnh nền riêng với lịch sử trống.</span></div>
  <div class="kv"><span class="k">Multi-stage build (dựng nhiều stage)</span><span class="v">Một Dockerfile có nhiều stage, trong đó chỉ stage cuối (hoặc stage <code>--target</code>) trở thành ảnh.</span></div>
  <div class="kv"><span class="k">COPY --from (chép từ nơi khác)</span><span class="v">Chép file ra từ một stage khác, một ảnh khác, hoặc một ngữ cảnh dựng có tên.</span></div>
  <div class="kv"><span class="k">--target (đích dựng)</span><span class="v">Dừng lượt dựng ở một stage có tên; những stage nó không phụ thuộc thì không được chạy.</span></div>
  <div class="kv"><span class="k">Artifact (hiện vật dựng)</span><span class="v">Thứ lượt dựng tạo ra và lúc chạy cần: <code>dist/</code>, một file nhị phân, <code>node_modules</code> production.</span></div>
  <div class="kv"><span class="k">npm prune --omit=dev (tỉa thư viện dev)</span><span class="v">Gỡ khỏi một <code>node_modules</code> có sẵn những gói chỉ cần khi phát triển.</span></div>
  <div class="kv"><span class="k">OCI layout (bố cục OCI)</span><span class="v">Dạng thư mục mà <code>docker save</code> ghi ra từ Docker 25: <code>index.json</code> cộng <code>blobs/sha256/</code>, mỗi tầng một file.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một <code>FROM</code> phía sau bắt đầu từ hệ thống file trống: thứ gì bạn không <code>COPY --from</code> thì đơn giản là không có trong ảnh.</li>
<li>Với một API TypeScript + Prisma thật, tách stage đưa DISK USAGE từ 1,88GB xuống 467MB và lượng tải về từ 489MB xuống 122MB.</li>
<li><code>--target</code> dựng một stage cùng mọi thứ nó phụ thuộc; stage không liên quan hoàn toàn không chạy.</li>
<li><code>COPY --from=&lt;ảnh&gt;</code> thêm một công cụ tĩnh bằng hai dòng, không cần trình quản lý gói — nhớ ghim tag.</li>
<li>Bí mật chỉ dùng ở stage dựng không tới được ảnh đã công bố, nhưng <code>RUN --mount=type=secret</code> vẫn là công cụ tốt hơn.</li>
<li>Kiểm file bị lộ bằng cách liệt kê <code>blobs/sha256/*</code> của <code>docker save</code>; phép kiểm <code>*/layer.tar</code> cũ không tìm thấy gì trên Docker 25+.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/build/building/multi-stage/" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">Dựng nhiều tầng</span><span class="lc-sub">Hướng dẫn chính thức: đặt tên stage, dừng ở một target, chép từ ảnh bên ngoài, và khác biệt so với cái mẹo builder-pattern thời trước.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/context/#named-contexts" target="_blank" rel="noopener">
  <span class="lc-ico">📎</span>
  <span class="lc-body"><span class="lc-title">Ngữ cảnh dựng có tên</span><span class="lc-sub"><code>--build-context tên=đường/dẫn</code> — cách đưa vào một thư mục nằm ngoài ngữ cảnh, hoặc ghim một stage vào một ảnh cụ thể lúc dựng mà không phải sửa Dockerfile.</span></span>
</a>
<a class="link-card" href="https://github.com/wagoodman/dive" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">dive</span><span class="lc-sub">Duyệt ảnh cuối theo từng tầng và xác nhận không có gì từ stage dựng lọt vào. Cách nhanh nhất để kiểm rằng một lượt tái cấu trúc nhiều tầng đã làm đúng thứ bạn nghĩ.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: tách các stage ra</span><span class="lc-sub">Bài chấm điểm: chuyển một ảnh một tầng 1,2GB sang nhiều tầng rồi đo, thêm một stage <code>test</code> làm hỏng lượt dựng, tạo một biến thể <code>:debug</code>, và chứng minh một bí mật vắng mặt khỏi những tầng đã công bố.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> chép <code>node_modules</code> từ stage dựng mà chưa tỉa nó. Stage dựng đã cài <em>MỌI THỨ</em>, nên <code>COPY --from=build /app/node_modules</code> lôi 700 thư viện dev vào ảnh production của bạn và lượt dựng nhiều tầng gần như chẳng tiết kiệm được gì. Hai cách chữa: chạy <code>npm prune --omit=dev</code> ở cuối stage dựng, hoặc giữ một stage <code>deps</code> riêng vốn chỉ từng chạy <code>npm ci --omit=dev</code> rồi chép từ cái đó. Cùng cái bẫy tồn tại với Python (<code>pip install --prefix=/install</code> trong stage dựng) và với mọi thứ mà bộ thư viện lúc dựng khác bộ thư viện lúc chạy.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Một lệnh <code>FROM</code> phía sau bắt đầu một hệ thống file HOÀN TOÀN MỚI, nên những thứ bạn không chép sang thì không có trong ảnh — và đó là cách đáng tin duy nhất để KHÔNG đem theo một thứ gì đó, vì xoá chỉ để lại một whiteout. <code>COPY --from</code> với được vào một stage có tên, một ảnh bên ngoài hoặc một ngữ cảnh có tên, và điều đó biến việc thêm MỘT chương trình tĩnh thành một thao tác hai dòng. Và hãy đặt TÊN cho mọi stage: nó làm <code>--target</code> đọc được, sống sót qua việc chèn thêm, và cho phép một Dockerfile sinh ra ảnh dev, test, prod và debug không thể lệch nhau.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.2 ─────────────────────────── */
    {
      title: '6.2 — Choosing a base image, and the musl trap|||6.2 — Chọn ảnh nền, và cái bẫy musl',
      slug: 'dk-6-2-chon-anh-nen',
      type: 'LESSON',
      description: 'So kích thước thật của full, slim, alpine, distroless và scratch; musl khác glibc ở đâu và nó phá cái gì; vì sao Prisma với wheel Python hay vỡ trên Alpine; và một bảng chọn dứt khoát.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Choosing a base image, and the musl trap</h2>
<p class="lead">The base image decides most of your image size, most of your vulnerability count, and — through one detail almost nobody mentions until it bites — whether your native dependencies work at all. This lesson measures the options and then spends most of its length on the detail: Alpine uses a different C library from everything else.</p>

<h3>The sizes, measured</h3>
${slide('dk-06', 8, 'Ảnh nền quyết định phần lớn kích thước — và khi nào dùng cái nào')}
<pre><code>for t in 22 22-slim 22-alpine; do docker pull -q node:\$t &gt;/dev/null; done
docker pull -q gcr.io/distroless/nodejs22-debian12 &gt;/dev/null
docker images --format '{{.Repository}}:{{.Tag}}\\t{{.Size}}' \\
  | grep -E 'node|distroless' | sort -k2 -hr</code></pre>
<div class="out">node:22	1.13GB
node:22-slim	224MB
node:22-alpine	185MB
gcr.io/distroless/nodejs22-debian12:latest	152MB</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">node:22 — the full image (1.13GB)</span><span class="lz-lnote">Debian with build-essential, git, curl, python3 and a full toolchain. Right as a <strong>build stage</strong>, where you want compilers available and size is irrelevant. Almost never right as a final image.</span></div>
  <div class="lz-layer"><span class="lz-lname">node:22-slim — Debian, trimmed (224MB)</span><span class="lz-lnote">Same glibc-based Debian, with docs, man pages and the toolchain removed. The <strong>safe default</strong> for a final image: everything works exactly as it does on a normal Linux, and it is only 40MB more than Alpine.</span></div>
  <div class="lz-layer"><span class="lz-lname">node:22-alpine — musl (185MB)</span><span class="lz-lnote">Smallest of the ones with a shell and a package manager, and the source of every problem in the rest of this lesson. Excellent when your dependencies are pure JavaScript; a trap when they are not.</span></div>
  <div class="lz-layer"><span class="lz-lname">distroless — runtime only (152MB)</span><span class="lz-lnote">glibc, the Node runtime, CA certificates. No shell, no package manager, no <code>ls</code>. Smallest sensible option for a Node app and the best security posture, at the cost of needing Lesson 2.3's debugging techniques.</span></div>
  <div class="lz-layer"><span class="lz-lname">scratch — nothing at all (0 bytes)</span><span class="lz-lnote">Only for a fully static binary: Go with <code>CGO_ENABLED=0</code>, Rust with musl. Note it has no CA certificates, so any HTTPS call fails until you <code>COPY --from</code> them in.</span></div>
</div>


<h3>The same four images on Docker 29 (measured 23/09/2026)</h3>
<p>The table above is the classic Docker ≤ 27 view (unpacked size only), and its lines were printed in the wrong order for a <code>sort -hr</code> in earlier editions — fixed now. Here is what the course's Linux machine (Docker Engine 29.6, amd64) shows today, with both columns:</p>
<pre><code class="language-bash">docker images node; docker images gcr.io/distroless/nodejs22-debian12</code></pre>
<div class="out">IMAGE            ID             DISK USAGE   CONTENT SIZE   EXTRA
node:22          dd5847a04b0d       1.63GB          425MB
node:22-slim     48e4b67d85f8        327MB         82.6MB
node:22-alpine   b6f26b36c8ff        237MB         61.2MB
IMAGE                                        ID             DISK USAGE   CONTENT SIZE   EXTRA
gcr.io/distroless/nodejs22-debian12:latest   8a3e96fe3345        205MB         52.6MB</div>
<p>(The four rows came from one <code>docker images</code> call each for <code>node</code> and distroless; the <code>node:22</code> row is from a second call after its pull finished.) The ranking is unchanged, but notice how small the gap between <code>-slim</code> and <code>-alpine</code> is where it matters for deploys: <strong>82.6MB versus 61.2MB to download — about 21MB</strong>. That is the whole price of avoiding every musl problem in the rest of this lesson.</p>
<pre><code class="language-bash">docker run --rm node:22-alpine sh -c 'cat /etc/alpine-release; node --version'
docker run --rm node:22-slim sh -c 'cat /etc/debian_version'</code></pre>
<div class="out">3.24.2
v22.23.2
12.15</div>

<h3>musl versus glibc: the actual difference</h3>
${slide('dk-06', 9, 'musl ≠ glibc: cùng chuẩn C, không cùng nhị phân')}
<pre><code>docker run --rm node:22-slim   sh -c 'ldd --version 2&gt;&amp;1 | head -1'
docker run --rm node:22-alpine sh -c 'ldd 2&gt;&amp;1 | head -1'
docker run --rm node:22-slim   sh -c 'ls /lib/x86_64-linux-gnu/libc.so.6'
docker run --rm node:22-alpine sh -c 'ls /lib/ld-musl-x86_64.so.1'</code></pre>
<div class="out">ldd (Debian GLIBC 2.36-9+deb12u8) 2.36
musl libc (x86_64)
/lib/x86_64-linux-gnu/libc.so.6
/lib/ld-musl-x86_64.so.1</div>
<p>Alpine uses <strong>musl</strong>, a small clean-room C library. Debian, Ubuntu, RHEL and every distroless variant use <strong>glibc</strong>. Both implement the same standard; they are not binary-compatible. A compiled shared object built against glibc will not load on musl, and the error message is usually unhelpful.</p>

<h3>What "not binary-compatible" means: the loader is missing</h3>
${slide('dk-06', 10, 'File có thật mà báo no such file — dấu vân tay của lệch libc')}
<p>Every dynamically linked Linux program carries, inside its own file, the path of the <strong>dynamic loader</strong> (the small program the kernel runs first to load the C library and start yours). On glibc that is <code>/lib64/ld-linux-x86-64.so.2</code>; on musl it is <code>/lib/ld-musl-x86_64.so.1</code>. Copy a glibc program onto Alpine and watch what the kernel says:</p>
<pre><code class="language-dockerfile">FROM alpine:3.22
COPY --from=node:22-slim /usr/local/bin/node /usr/local/bin/node
CMD ["node", "--version"]</code></pre>
<pre><code class="language-bash">docker build -t dk06-glibc-tren-alpine .
docker run --rm dk06-glibc-tren-alpine; echo "exit=\$?"
docker run --rm dk06-glibc-tren-alpine ls -l /usr/local/bin/node
docker run --rm dk06-glibc-tren-alpine sh -c 'ls /lib/ld-*; ls /lib64 2&gt;&amp;1'
docker run --rm node:22-slim sh -c 'ls -l /lib64/ld-linux-x86-64.so.2'</code></pre>
<div class="out">exec /usr/local/bin/node: no such file or directory
exit=255
-rwxr-xr-x    1 root     root     124836408 Jul 28 22:23 /usr/local/bin/node
/lib/ld-musl-x86_64.so.1
ls: /lib64: No such file or directory
lrwxrwxrwx. 1 root root 42 Apr 27 20:14 /lib64/ld-linux-x86-64.so.2 -&gt; /lib/x86_64-linux-gnu/ld-linux-x86-64.so.2</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · The file exists</span><span class="lz-t">124MB, executable</span><span class="lz-d"><code>ls -l</code> finds it. So "no such file" is not about <code>node</code>.</span></div>
  <div class="lz-step"><span class="lz-k">2 · The kernel reads the file's header</span><span class="lz-t">"interpreter: /lib64/ld-linux-x86-64.so.2"</span><span class="lz-d">That path is baked in at compile time for glibc.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Alpine has no /lib64</span><span class="lz-t">only /lib/ld-musl-x86_64.so.1</span><span class="lz-d">The missing file is the loader — the kernel reports ENOENT, which prints as "no such file or directory".</span></div>
</div>
<p>This is the same failure, one level lower, as a Prisma engine or a native <code>.node</code> module built for glibc: they are shared libraries that expect glibc symbols, and musl does not provide them. On the Mac M1 the paths are <code>/lib/ld-musl-aarch64.so.1</code> and <code>/lib/aarch64-linux-gnu/libc.so.6</code> — same story, different architecture.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Prebuilt native modules</span><span class="v">npm packages ship prebuilt binaries for <code>linux-x64-glibc</code>. On Alpine, either a musl build exists and is downloaded, or npm falls back to compiling from source — which needs <code>python3 make g++</code> in the image and takes minutes.</span></div>
  <div class="kv"><span class="k">Python wheels</span><span class="v">PyPI wheels are <code>manylinux</code>, which means glibc. On Alpine, <code>pip install</code> compiles <em>everything</em> from source: numpy, pandas, cryptography, psycopg2. A 20-second install becomes 10 minutes, and sometimes fails. This is why Lesson 4.5 says <code>python:3.12-slim</code>, not alpine.</span></div>
  <div class="kv"><span class="k">Prisma engines</span><span class="v">Prisma downloads a query engine binary matched to the platform. Alpine needs <code>binaryTargets = ["linux-musl-openssl-3.0.x"]</code> in <code>schema.prisma</code>; get it wrong and the container starts, connects to nothing, and restarts forever.</span></div>
  <div class="kv"><span class="k">DNS behaves differently</span><span class="v">musl's resolver queries all nameservers in parallel and historically had gaps in <code>search</code>-domain and TCP fallback handling. Symptom: intermittent DNS failures inside Kubernetes that vanish on a Debian base.</span></div>
  <div class="kv"><span class="k">Performance</span><span class="v">musl's malloc is simpler and slower under heavy multithreaded allocation. For most web apps it is unmeasurable; for allocation-heavy workloads it has been measured at double-digit percentages.</span></div>
</div>
<div class="callout warn"><strong>This project's own outage was exactly this.</strong> A deploy script built with the default <code>Dockerfile</code> instead of <code>Dockerfile.backend</code>, which put a <code>debian-openssl-3.0.x</code> Prisma engine — glibc — onto a <code>node:22-alpine</code> base. The build was green, the push was green, the swap was green, and then the backend restarted forever and the API returned 502 for seven minutes. The lesson recorded afterwards was: <em>a green build does not mean a runnable image</em>. A libc-versus-engine check now runs before the push.</div>
<pre><code><span class="tok-comment"># Detect the mismatch before it reaches production</span>
docker run --rm --entrypoint sh app:latest -c '
  echo -n "libc: "; ( ldd --version 2&gt;&amp;1 | head -1 ) || true
  echo -n "prisma engines: "; ls node_modules/.prisma/client/ 2&gt;/dev/null | grep -o "engine.*" | head -2
'</code></pre>
<div class="out">libc: musl libc (x86_64)
prisma engines: libquery_engine-linux-musl-openssl-3.0.x.so.node</div>


<h3>Reproduce the 502 outage, for real</h3>
${slide('dk-06', 11, 'Sự cố thật: build xanh, đẩy xanh, tráo xanh — rồi API 502 bảy phút')}
<p>Reading about an outage teaches less than causing one on purpose. This rebuilds the exact mistake with the Prisma app from Lesson 6.1: the build stage is Debian (<code>node:22-slim</code>), so <code>prisma generate</code> downloads the <code>debian-openssl-3.0.x</code> engine; the runtime stage is <code>node:22-alpine</code>. Nothing warns you at build time.</p>
<pre><code class="language-dockerfile"># Dockerfile.trap — the mistake, on purpose
FROM node:22-slim AS build
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends openssl &amp;&amp; rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate &amp;&amp; npm run build
RUN npm prune --omit=dev

FROM node:22-alpine                         <span class="tok-comment"># ← musl. The engine copied below is glibc.</span>
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]</code></pre>
<pre><code class="language-bash">docker build -f Dockerfile.trap -t dk06-api:trap .        <span class="tok-comment"># green</span>
docker run -d --name dk06-trap --restart unless-stopped \\
  -e DATABASE_URL=postgresql://u:p@db:5432/app dk06-api:trap
sleep 12
docker ps -a --filter name=dk06-trap --format '{{.Names}}  {{.Status}}'
docker inspect -f 'RestartCount={{.RestartCount}} ExitCode={{.State.ExitCode}}' dk06-trap
docker logs dk06-trap 2&gt;&amp;1 | head -22</code></pre>
<div class="out">dk06-trap  Restarting (1) 4 seconds ago
RestartCount=7 ExitCode=1
prisma:warn Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-1.1.x".
Please manually install OpenSSL and try installing Prisma again.
PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl".

This happened because Prisma Client was generated for "debian-openssl-3.0.x", but the actual deployment required "linux-musl".
Add "linux-musl" to &#96;binaryTargets&#96; in the "schema.prisma" file and run &#96;prisma generate&#96; after saving it:

generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl"]
}

The following locations have been searched:
  /app/node_modules/.prisma/client
  /app/node_modules/@prisma/client
  /tmp/prisma-engines
    at za (/app/node_modules/@prisma/client/runtime/library.js:64:805)
    …
    at async main (/app/dist/index.js:13:5) {
  clientVersion: '5.22.0',
  errorCode: undefined
}</div>
${slide('dk-06', 12, 'Dựng lại y hệt: engine debian-openssl-3.0.x trên nền musl')}
<table>
<tr><th>Line</th><th>What it tells you</th></tr>
<tr><td><code>Restarting (1)</code></td><td>The main process exited with code 1 and the restart policy is starting it again. Seven restarts in twelve seconds, and the delay grows each time.</td></tr>
<tr><td><code>Prisma failed to detect the libssl/openssl version</code></td><td>A second, smaller problem: <code>node:22-alpine</code> has no OpenSSL library, so Prisma guesses. Even a musl engine would need <code>apk add openssl</code>.</td></tr>
<tr><td><code>generated for "debian-openssl-3.0.x" … required "linux-musl"</code></td><td>The whole diagnosis in one sentence: the engine file on disk is for glibc, the system is musl.</td></tr>
<tr><td><code>at async main (/app/dist/index.js:13:5)</code></td><td>The failure happens at <code>prisma.$connect()</code> — before the HTTP server ever listens. That is why nginx answers <strong>502 Bad Gateway</strong>: there is nobody on the port.</td></tr>
</table>
<div class="callout"><strong>Why every check was green.</strong> <code>docker build</code> only proves the Dockerfile's commands exited 0. <code>docker push</code> only proves bytes were uploaded. <code>compose up -d</code> only proves a container was <em>created</em>. None of them runs your first database query. The only check that would have caught this is one that <em>starts the image</em> or <em>inspects what is inside it</em> — before the push.</div>

<h3>A libc ↔ engine guard that runs before every push</h3>
${slide('dk-06', 13, 'Chốt kiểm libc ↔ engine: 1 giây, chạy trước docker push')}
<p>The detection snippet above prints the facts; a guard has to <em>decide</em> and return a non-zero exit code so a deploy script stops. This one runs in about a second and needs nothing inside the image except <code>sh</code> and <code>ls</code>:</p>
<pre><code class="language-bash">#!/bin/sh
# check-libc.sh &lt;image&gt; — run BEFORE docker push: does the image's libc match the Prisma engine?
IMG="\$1"
docker run --rm --entrypoint sh "\$IMG" -c '
  if ls /lib/ld-musl-* &gt;/dev/null 2&gt;&amp;1; then LIBC=musl; else LIBC=glibc; fi
  ENG=\$(ls node_modules/.prisma/client 2&gt;/dev/null | grep -o "libquery_engine-[^ ]*\\.so\\.node" | tr "\\n" " ")
  echo "libc:    \$LIBC"
  echo "engines: \$ENG"
  case "\$LIBC:\$ENG" in
    musl:*musl*)  echo "OK";   exit 0 ;;
    glibc:*debian*|glibc:*rhel*) echo "OK"; exit 0 ;;
    *) echo "LỆCH: libc \$LIBC nhưng không có engine cho nó"; exit 1 ;;
  esac'</code></pre>
<pre><code class="language-bash">./check-libc.sh dk06-api:trap;  echo "exit=\$?"
./check-libc.sh dk06-api:multi; echo "exit=\$?"</code></pre>
<div class="out">libc:    musl
engines: libquery_engine-debian-openssl-3.0.x.so.node
LỆCH: libc musl nhưng không có engine cho nó
exit=1
libc:    glibc
engines: libquery_engine-debian-openssl-3.0.x.so.node
OK
exit=0</div>
<table>
<tr><th>Piece</th><th>Why it is written this way</th></tr>
<tr><td><code>--entrypoint sh</code></td><td>Replace the image's normal command (<code>node dist/index.js</code>) with a shell, so the check never starts the app or needs a database.</td></tr>
<tr><td><code>ls /lib/ld-musl-*</code></td><td>The musl loader exists only on musl systems — more reliable than parsing <code>ldd</code> output, which differs between the two and exits non-zero on Alpine.</td></tr>
<tr><td><code>case "\$LIBC:\$ENG"</code></td><td>One string such as <code>musl:libquery_engine-debian…</code>, matched against the two safe patterns. Anything else — including "no engine at all" — fails closed.</td></tr>
<tr><td><code>exit 1</code></td><td>In a deploy script with <code>set -e</code>, the push line after it never runs.</td></tr>
</table>
<p><strong>The fix</strong> is one of two, and both were verified on the same machine. Either keep Alpine and generate the right engine:</p>
<pre><code class="language-dockerfile"># schema.prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}

# runtime stage
FROM node:22-alpine
RUN apk add --no-cache openssl</code></pre>
<pre><code class="language-bash">./check-libc.sh dk06-api:fix; echo "exit=\$?"
docker logs dk06-fix           <span class="tok-comment"># same app, real PostgreSQL next to it on network dk06-net</span></code></pre>
<div class="out">libc:    musl
engines: libquery_engine-debian-openssl-3.0.x.so.node libquery_engine-linux-musl-openssl-3.0.x.so.node
OK
exit=0
db connected
listening on 8080</div>
<p>…or use <code>-slim</code> for both stages, which is what the student project did afterwards: 21MB more to download, and the whole class of problem is gone. Either way, keep the guard: the next person who edits the Dockerfile will not have read this lesson.</p>

<h3>When each base is right</h3>
<div class="lz-map">
  <div class="lz-stage">Use -slim (Debian)</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The default for a final image</span><span class="lz-nsub">Anything with native modules, Python, Prisma, or an unfamiliar dependency tree. Costs about 40MB over Alpine and removes a whole class of problem. If you are not sure, this is the answer.</span></div></div>
  <div class="lz-stage">Use -alpine</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Pure-JS dependencies, or you have verified it</span><span class="lz-nsub">A Node API with no compiled modules, an nginx image, a small Go tool that wants a shell. Verify with a real run, not a green build.</span></div></div>
  <div class="lz-stage">Use distroless</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Production, once the app is stable</span><span class="lz-nsub">glibc, so no musl surprises; no shell, so a much smaller attack surface; and a <code>:debug</code> sibling from the same Dockerfile for when you need to look (Lesson 6.1).</span></div></div>
  <div class="lz-stage">Use scratch</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A single static binary, nothing else</span><span class="lz-nsub">Go or Rust. Remember CA certificates and timezone data are absent — copy them from a real image if the program needs them.</span></div></div>
  <div class="lz-stage">Use the full image</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">As a build stage only</span><span class="lz-nsub">Compilers already present, nothing to install, and its size never reaches the final image (Lesson 6.1).</span></div></div>
</div>

<h3>Reading a base image's real cost</h3>
<pre><code>docker scout quickview node:22-slim 2&gt;/dev/null | head -8
docker scout quickview node:22-alpine 2&gt;/dev/null | head -6</code></pre>
<div class="out">  Target             │  node:22-slim         │    0C     2H     8M    41L
    digest           │  a1b2c3d4e5f6         │
  Base image         │  debian:bookworm-slim │    0C     0H     2M    31L

  Target             │  node:22-alpine       │    0C     0H     1M     6L
    digest           │  9f8e7d6c5b4a         │
  Base image         │  alpine:3.20          │    0C     0H     0M     3L</div>

<div class="callout warn"><strong>About the output above (checked 23/09/2026).</strong> <code>docker scout quickview</code> now refuses to run without a Docker ID login ("Log in with your Docker ID or email address to use docker scout"), so this course could not re-run it; the digests shown are placeholders and the counts are illustrative. Here is a measurement anyone can repeat without an account — Trivy 0.74.0 run as a container, vulnerability database of 23/09/2026, OS packages only, all severities:</div>
<pre><code class="language-bash">for i in node:22 node:22-slim node:22-alpine gcr.io/distroless/nodejs22-debian12; do
  docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest \\
    image -q --scanners vuln "\$i" | grep -E "^Total" | head -1
done</code></pre>
<div class="out">Total: 3983 (UNKNOWN: 91, LOW: 1295, MEDIUM: 2112, HIGH: 453, CRITICAL: 32)
Total: 225 (UNKNOWN: 1, LOW: 72, MEDIUM: 96, HIGH: 52, CRITICAL: 4)
Total: 19 (UNKNOWN: 0, LOW: 1, MEDIUM: 7, HIGH: 10, CRITICAL: 1)
Total: 54 (UNKNOWN: 0, LOW: 25, MEDIUM: 23, HIGH: 5, CRITICAL: 1)</div>
<p>Read the third line carefully: for <code>node:22-alpine</code> the OS section was <strong>0</strong>, so the first <code>Total</code> printed is the next section — the 19 findings in the <code>npm</code> that ships inside every official Node image (Lesson 6.5 comes back to this). So by OS packages: full Debian 3,983, slim 225, Alpine 0, distroless 54. That is the real case for Alpine and distroless — and the numbers are those of one day; scan again next week and they will differ.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Alpine genuinely has fewer CVEs</span><span class="v">Because it has far fewer packages. That is a real advantage and it is why the security-minded reach for it — but count the ones that actually apply to your process, not the raw total.</span></div>
  <div class="kv"><span class="k">Most low-severity findings are unreachable</span><span class="v">A CVE in <code>libtiff</code> in an image that never decodes an image is not a risk you have. Lesson 6.5 covers triaging rather than counting.</span></div>
  <div class="kv"><span class="k">Distroless is the real winner here</span><span class="v">Fewer packages than Alpine <em>and</em> glibc. If the CVE count is what you are optimising, distroless beats both.</span></div>
  <div class="kv"><span class="k">The number moves without you</span><span class="v">A base image's CVE count grows as new ones are published against packages it already had. A rebuild cadence matters more than the number on the day you chose (Lesson 3.2).</span></div>
</div>

<h3>Pinning the base</h3>
<pre><code><span class="tok-comment"># Good: minor version + variant, patches still arrive</span>
FROM node:22-alpine

<span class="tok-comment"># Better: also pin the Alpine or Debian release, so a base OS bump is deliberate</span>
FROM node:22-alpine3.20
FROM python:3.12-bookworm

<span class="tok-comment"># Best for production: readable tag AND immutable digest (Lesson 3.2)</span>
FROM node:22-alpine3.20@sha256:b8f2c1a4e9d3f7a6b5c4d3e2f1908877665544332211aabbccddeeff0011223344</code></pre>

<pre><code class="language-bash"><span class="tok-comment"># Get the real digest to pin (the one above is a placeholder)</span>
docker buildx imagetools inspect node:22-alpine3.24 | head -3</code></pre>
<div class="out">Name:      docker.io/library/node:22-alpine3.24
MediaType: application/vnd.oci.image.index.v1+json
Digest:    sha256:b6f26b36c8ff49624cfdac716b8ea1138d606df02586a77d364bb5536a634f85</div>
<p>This is the digest of the multi-platform <em>index</em>, so the same pin works on your Mac (arm64) and the VPS (amd64). Today <code>node:22-alpine</code> is Alpine 3.24; the <code>3.20</code> in the examples above is from when this lesson was first written.</p>

<div class="callout ok"><strong>Pin the OS release, not just the language version.</strong> <code>node:22-alpine</code> silently moved from Alpine 3.19 to 3.20 to 3.21 over a year, and each move changes system library versions underneath you. <code>node:22-alpine3.20</code> keeps that stable until you choose otherwise — which turns "our build broke and nothing changed" into a decision you make on purpose.</div>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate "optimised" the group's Dockerfile by changing only the last <code>FROM</code> to <code>node:22-alpine</code>. The build passes on GitHub Actions. Before it reaches the demo server, prove it is broken and add a guard so it cannot happen again.</p><ol>
<li><code>mkdir -p ~/thu-docker/ch06-musl &amp;&amp; cd ~/thu-docker/ch06-musl</code>. Reproduce the loader failure first (no Prisma needed): the three-line <code>Dockerfile</code> from "What not binary-compatible means", built as <code>thu-glibc</code>. Run it and read the error.</li>
<li>Prove the file exists with <code>ls -l</code>, and find which loader Alpine actually has with <code>ls /lib/ld-*</code>.</li>
<li>If you have a Prisma project (your SWP391 backend, or the app from 6.1), build it with a Debian build stage and an Alpine runtime stage as <code>thu-trap</code>. Save <code>check-libc.sh</code> from this lesson and run it: it must print <code>LỆCH</code> and exit 1.</li>
<li>Fix it one of the two ways (<code>binaryTargets</code> + <code>apk add openssl</code>, or <code>-slim</code> in both stages), rebuild, and run the guard again.</li>
<li>Clean up: <code>docker rmi thu-glibc thu-trap</code>.</li></ol>
<p><strong>Done when:</strong> you can explain in one sentence why <code>exec …: no such file or directory</code> appears for a file that <code>ls</code> can see, and <code>check-libc.sh</code> returns exit 1 for the broken image and exit 0 for the fixed one.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Base image</span><span class="v">The image named in <code>FROM</code>; it decides the OS, the C library and most of the size.</span></div>
  <div class="kv"><span class="k">glibc</span><span class="v">The GNU C library used by Debian, Ubuntu, RHEL and distroless.</span></div>
  <div class="kv"><span class="k">musl</span><span class="v">A small C library used by Alpine; same standard, different binary interface.</span></div>
  <div class="kv"><span class="k">Dynamic loader</span><span class="v">The program named inside every dynamically linked binary that loads its libraries; missing loader = "no such file".</span></div>
  <div class="kv"><span class="k">Native module</span><span class="v">Compiled code shipped in a package (<code>.node</code>, Prisma engines, Python wheels) — tied to one libc.</span></div>
  <div class="kv"><span class="k">binaryTargets</span><span class="v">The Prisma setting that lists which platforms' engines <code>prisma generate</code> downloads.</span></div>
  <div class="kv"><span class="k">distroless</span><span class="v">Images with only a runtime and its libraries: no shell, no package manager.</span></div>
  <div class="kv"><span class="k">Digest pin</span><span class="v"><code>image@sha256:…</code> — refers to exact bytes, unlike a tag that can move.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>On Docker 29 the download difference between <code>node:22-slim</code> and <code>node:22-alpine</code> is about 21MB (82.6MB vs 61.2MB).</li>
<li>musl and glibc implement the same C standard but are not binary-compatible; a glibc binary on Alpine fails with "no such file or directory" because its loader is missing.</li>
<li>A Prisma engine generated for <code>debian-openssl-3.0.x</code> on a musl runtime gives green build, push and deploy — then <code>Restarting (1)</code> and 502.</li>
<li>Only a check that starts or inspects the image catches it; a one-second libc ↔ engine guard before <code>docker push</code> is enough.</li>
<li>Fix with <code>binaryTargets</code> + <code>apk add openssl</code>, or use <code>-slim</code> for both stages.</li>
<li>Pin the OS release in the tag and the index digest for production; re-measure CVE counts, they change every day.</li>
</ul>

<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-schema-reference" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Prisma schema reference — binaryTargets</span><span class="lc-sub">The list of engine targets (<code>linux-musl-openssl-3.0.x</code>, <code>debian-openssl-3.0.x</code>, <code>linux-arm64-openssl-3.0.x</code> …) and what <code>native</code> means. Look up your runtime image here before you change the base.</span></span>
</a>
<a class="link-card" href="https://hub.docker.com/_/node" target="_blank" rel="noopener">
  <span class="lc-ico">🟩</span>
  <span class="lc-body"><span class="lc-title">The official node image documentation</span><span class="lc-sub">The tag list explained — what <code>-slim</code>, <code>-alpine</code> and the bare tags contain — plus the maintainers' own notes on when Alpine is a bad idea.</span></span>
</a>
<a class="link-card" href="https://wiki.musl-libc.org/functional-differences-from-glibc.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">musl — functional differences from glibc</span><span class="lc-sub">The maintainers' own list, including the DNS resolver behaviour and the stack-size default that breaks some threaded programs. The primary source when Alpine behaves oddly.</span></span>
</a>
<a class="link-card" href="https://github.com/GoogleContainerTools/distroless" target="_blank" rel="noopener">
  <span class="lc-ico">🪶</span>
  <span class="lc-body"><span class="lc-title">distroless</span><span class="lc-sub">Which variant contains what, the <code>:nonroot</code> and <code>:debug</code> tags, and worked examples per language. Read before your first distroless image.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: pick the base</span><span class="lc-sub">Graded exercises: choose a base for four different applications and justify it, diagnose a native module that fails only on Alpine, detect a libc/engine mismatch before deploying, and pin a base three ways.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> switching to Alpine "to make the image smaller" and shipping it because the build passed. The install step succeeds — npm found a musl prebuild, or silently compiled from source — and the failure appears at run time, on the server, as a module that will not load or an engine that cannot start. Worse, some libraries degrade instead of failing: a slightly different DNS resolver produces intermittent lookup failures under load that never reproduce locally. The rule: changing the base image is a change that needs a real run, not a green build. Start the container, hit a real endpoint, and check the logs — and if the app uses Prisma, native modules or Python wheels, budget an afternoon or just use <code>-slim</code>.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Alpine uses musl and everything else uses glibc; they are not binary-compatible, which is why native modules, Python wheels and Prisma engines break there specifically. <code>-slim</code> is the safe default for a final image — about 40MB more than Alpine and none of the surprises — and distroless is the better production answer once the app is stable. And pin the OS release in the tag, not just the language version, so a base OS bump is a decision rather than an incident.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Chọn ảnh nền, và cái bẫy musl</h2>
<p class="lead">Ảnh nền quyết định phần lớn kích thước ảnh của bạn, phần lớn số lỗ hổng, và — qua một chi tiết mà gần như chẳng ai nhắc tới cho tới lúc nó cắn — quyết định luôn cả việc thư viện native của bạn có chạy được hay không. Bài này ĐO các lựa chọn rồi dành phần lớn độ dài cho cái chi tiết đó: Alpine dùng một thư viện C KHÁC với mọi thứ còn lại.</p>

<h3>Kích thước, đo thật</h3>
${slide('dk-06', 8, 'Ảnh nền quyết định phần lớn kích thước — và khi nào dùng cái nào')}
<pre><code>for t in 22 22-slim 22-alpine; do docker pull -q node:\$t &gt;/dev/null; done
docker pull -q gcr.io/distroless/nodejs22-debian12 &gt;/dev/null
docker images --format '{{.Repository}}:{{.Tag}}\\t{{.Size}}' \\
  | grep -E 'node|distroless' | sort -k2 -hr</code></pre>
<div class="out">node:22	1.13GB
node:22-slim	224MB
node:22-alpine	185MB
gcr.io/distroless/nodejs22-debian12:latest	152MB</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">node:22 — ảnh đầy đủ (1,13GB)</span><span class="lz-lnote">Debian kèm build-essential, git, curl, python3 và trọn bộ công cụ biên dịch. Đúng khi làm <strong>STAGE DỰNG</strong>, nơi bạn muốn có sẵn trình biên dịch và kích thước không quan trọng. Gần như không bao giờ đúng khi làm ảnh cuối.</span></div>
  <div class="lz-layer"><span class="lz-lname">node:22-slim — Debian đã tỉa (224MB)</span><span class="lz-lnote">Vẫn Debian nền glibc, đã gỡ tài liệu, trang man và bộ công cụ biên dịch. <strong>MẶC ĐỊNH AN TOÀN</strong> cho một ảnh cuối: mọi thứ chạy đúng như trên một máy Linux bình thường, và nó chỉ nặng hơn Alpine 40MB.</span></div>
  <div class="lz-layer"><span class="lz-lname">node:22-alpine — musl (185MB)</span><span class="lz-lnote">Nhỏ nhất trong nhóm còn có shell và trình quản lý gói, và là nguồn gốc của mọi vấn đề trong phần còn lại của bài này. Tuyệt vời khi thư viện của bạn thuần JavaScript; là cái bẫy khi không phải vậy.</span></div>
  <div class="lz-layer"><span class="lz-lname">distroless — chỉ môi trường chạy (152MB)</span><span class="lz-lnote">glibc, môi trường chạy Node, chứng chỉ CA. Không shell, không trình quản lý gói, không cả <code>ls</code>. Lựa chọn nhỏ nhất hợp lý cho một ứng dụng Node và tư thế an ninh tốt nhất, đổi lại là cần tới kỹ thuật gỡ lỗi ở Bài 2.3.</span></div>
  <div class="lz-layer"><span class="lz-lname">scratch — không có gì cả (0 byte)</span><span class="lz-lnote">Chỉ dành cho một chương trình tĩnh hoàn toàn: Go với <code>CGO_ENABLED=0</code>, Rust với musl. Lưu ý nó KHÔNG có chứng chỉ CA, nên mọi lời gọi HTTPS đều hỏng cho tới khi bạn <code>COPY --from</code> chúng vào.</span></div>
</div>


<h3>Vẫn bốn ảnh đó, trên Docker 29 (đo 23/09/2026)</h3>
<p>Bảng ở trên là cách nhìn kinh điển của Docker ≤ 27 (chỉ kích thước đã giải nén), và ở bản trước của bài các dòng của nó bị in SAI thứ tự so với một lệnh <code>sort -hr</code> — nay đã sửa. Đây là những gì máy Linux của khoá (Docker Engine 29.6, amd64) cho thấy hôm nay, đủ cả hai cột:</p>
<pre><code class="language-bash">docker images node; docker images gcr.io/distroless/nodejs22-debian12</code></pre>
<div class="out">IMAGE            ID             DISK USAGE   CONTENT SIZE   EXTRA
node:22          dd5847a04b0d       1.63GB          425MB
node:22-slim     48e4b67d85f8        327MB         82.6MB
node:22-alpine   b6f26b36c8ff        237MB         61.2MB
IMAGE                                        ID             DISK USAGE   CONTENT SIZE   EXTRA
gcr.io/distroless/nodejs22-debian12:latest   8a3e96fe3345        205MB         52.6MB</div>
<p>(Các dòng đến từ một lệnh <code>docker images</code> cho <code>node</code> và một cho distroless; dòng <code>node:22</code> lấy ở lần gọi thứ hai sau khi kéo xong.) Thứ hạng không đổi, nhưng hãy để ý khoảng cách giữa <code>-slim</code> và <code>-alpine</code> nhỏ tới mức nào ở chỗ quan trọng với deploy: <strong>82,6MB so với 61,2MB phải tải — chừng 21MB</strong>. Đó là TOÀN BỘ cái giá để tránh mọi rắc rối musl trong phần còn lại của bài.</p>
<pre><code class="language-bash">docker run --rm node:22-alpine sh -c 'cat /etc/alpine-release; node --version'
docker run --rm node:22-slim sh -c 'cat /etc/debian_version'</code></pre>
<div class="out">3.24.2
v22.23.2
12.15</div>

<h3>musl so với glibc: khác biệt THẬT</h3>
${slide('dk-06', 9, 'musl ≠ glibc: cùng chuẩn C, không cùng nhị phân')}
<pre><code>docker run --rm node:22-slim   sh -c 'ldd --version 2&gt;&amp;1 | head -1'
docker run --rm node:22-alpine sh -c 'ldd 2&gt;&amp;1 | head -1'
docker run --rm node:22-slim   sh -c 'ls /lib/x86_64-linux-gnu/libc.so.6'
docker run --rm node:22-alpine sh -c 'ls /lib/ld-musl-x86_64.so.1'</code></pre>
<div class="out">ldd (Debian GLIBC 2.36-9+deb12u8) 2.36
musl libc (x86_64)
/lib/x86_64-linux-gnu/libc.so.6
/lib/ld-musl-x86_64.so.1</div>
<p>Alpine dùng <strong>musl</strong>, một thư viện C nhỏ gọn viết mới hoàn toàn. Debian, Ubuntu, RHEL và mọi biến thể distroless đều dùng <strong>glibc</strong>. Cả hai đều hiện thực cùng một chuẩn; chúng KHÔNG tương thích ở mức nhị phân. Một thư viện chia sẻ đã biên dịch theo glibc sẽ không nạp được trên musl, và thông báo lỗi thường chẳng giúp được gì.</p>

<h3>"Không tương thích nhị phân" nghĩa là gì: thiếu trình nạp</h3>
${slide('dk-06', 10, 'File có thật mà báo no such file — dấu vân tay của lệch libc')}
<p>Mọi chương trình Linux liên kết động đều mang, ngay trong file của nó, đường dẫn tới <strong>trình nạp động</strong> (dynamic loader — chương trình nhỏ mà nhân chạy TRƯỚC để nạp thư viện C rồi mới khởi động chương trình của bạn). Với glibc đó là <code>/lib64/ld-linux-x86-64.so.2</code>; với musl là <code>/lib/ld-musl-x86_64.so.1</code>. Chép một chương trình glibc sang Alpine rồi xem nhân nói gì:</p>
<pre><code class="language-dockerfile">FROM alpine:3.22
COPY --from=node:22-slim /usr/local/bin/node /usr/local/bin/node
CMD ["node", "--version"]</code></pre>
<pre><code class="language-bash">docker build -t dk06-glibc-tren-alpine .
docker run --rm dk06-glibc-tren-alpine; echo "exit=\$?"
docker run --rm dk06-glibc-tren-alpine ls -l /usr/local/bin/node
docker run --rm dk06-glibc-tren-alpine sh -c 'ls /lib/ld-*; ls /lib64 2&gt;&amp;1'
docker run --rm node:22-slim sh -c 'ls -l /lib64/ld-linux-x86-64.so.2'</code></pre>
<div class="out">exec /usr/local/bin/node: no such file or directory
exit=255
-rwxr-xr-x    1 root     root     124836408 Jul 28 22:23 /usr/local/bin/node
/lib/ld-musl-x86_64.so.1
ls: /lib64: No such file or directory
lrwxrwxrwx. 1 root root 42 Apr 27 20:14 /lib64/ld-linux-x86-64.so.2 -&gt; /lib/x86_64-linux-gnu/ld-linux-x86-64.so.2</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · File CÓ tồn tại</span><span class="lz-t">124MB, chạy được</span><span class="lz-d"><code>ls -l</code> thấy nó. Vậy "no such file" không phải nói về <code>node</code>.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Nhân đọc phần đầu file</span><span class="lz-t">"trình nạp: /lib64/ld-linux-x86-64.so.2"</span><span class="lz-d">Đường dẫn đó được ghi cứng lúc biên dịch cho glibc.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Alpine không có /lib64</span><span class="lz-t">chỉ có /lib/ld-musl-x86_64.so.1</span><span class="lz-d">File bị thiếu là TRÌNH NẠP — nhân báo ENOENT, in ra thành "no such file or directory".</span></div>
</div>
<p>Đây chính là cú hỏng đó, chỉ thấp hơn một tầng, so với một engine Prisma hay một module native <code>.node</code> dựng cho glibc: chúng là thư viện chia sẻ đòi các ký hiệu (symbol) của glibc, mà musl không cung cấp. Trên Mac M1 các đường dẫn là <code>/lib/ld-musl-aarch64.so.1</code> và <code>/lib/aarch64-linux-gnu/libc.so.6</code> — cùng một chuyện, khác kiến trúc.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Mô-đun native dựng sẵn</span><span class="v">Các gói npm đem theo chương trình dựng sẵn cho <code>linux-x64-glibc</code>. Trên Alpine, hoặc là có sẵn một bản musl và nó được tải về, hoặc npm lùi về biên dịch từ mã nguồn — thứ cần <code>python3 make g++</code> trong ảnh và mất vài phút.</span></div>
  <div class="kv"><span class="k">Wheel của Python</span><span class="v">Wheel trên PyPI là <code>manylinux</code>, tức là glibc. Trên Alpine, <code>pip install</code> biên dịch <em>MỌI THỨ</em> từ mã nguồn: numpy, pandas, cryptography, psycopg2. Một lượt cài 20 giây thành 10 phút, và đôi khi hỏng hẳn. Đó là lý do Bài 4.5 nói <code>python:3.12-slim</code>, chứ không phải alpine.</span></div>
  <div class="kv"><span class="k">Engine của Prisma</span><span class="v">Prisma tải về một chương trình query engine khớp với nền tảng. Alpine cần <code>binaryTargets = ["linux-musl-openssl-3.0.x"]</code> trong <code>schema.prisma</code>; sai chỗ đó thì container khởi động, không nối được vào đâu, rồi khởi động lại mãi mãi.</span></div>
  <div class="kv"><span class="k">DNS hành xử khác</span><span class="v">Trình phân giải của musl hỏi mọi máy chủ tên SONG SONG và trong lịch sử có những chỗ hổng ở việc xử lý miền <code>search</code> với dự phòng TCP. Triệu chứng: những cú hỏng DNS chập chờn bên trong Kubernetes rồi biến mất khi đổi sang nền Debian.</span></div>
  <div class="kv"><span class="k">Hiệu năng</span><span class="v">malloc của musl đơn giản hơn và chậm hơn dưới áp lực cấp phát đa luồng nặng. Với phần lớn ứng dụng web thì không đo nổi; với những tải nặng về cấp phát thì đã có phép đo cho ra mức chênh hai chữ số phần trăm.</span></div>
</div>
<div class="callout warn"><strong>Cú sự cố của chính dự án này chính xác là chuyện đó.</strong> Một script deploy đã dựng bằng <code>Dockerfile</code> mặc định thay vì <code>Dockerfile.backend</code>, và điều đó đặt một engine Prisma <code>debian-openssl-3.0.x</code> — glibc — lên một cái nền <code>node:22-alpine</code>. Lượt dựng xanh, lượt đẩy xanh, lượt tráo xanh, rồi backend khởi động lại vô tận và API trả 502 trong bảy phút. Bài học ghi lại sau đó là: <em>một lượt dựng xanh KHÔNG có nghĩa là một cái ảnh chạy được</em>. Giờ có một chốt kiểm libc ↔ engine chạy TRƯỚC lúc đẩy.</div>
<pre><code><span class="tok-comment"># Phát hiện chỗ lệch TRƯỚC KHI nó tới production</span>
docker run --rm --entrypoint sh app:latest -c '
  echo -n "libc: "; ( ldd --version 2&gt;&amp;1 | head -1 ) || true
  echo -n "prisma engines: "; ls node_modules/.prisma/client/ 2&gt;/dev/null | grep -o "engine.*" | head -2
'</code></pre>
<div class="out">libc: musl libc (x86_64)
prisma engines: libquery_engine-linux-musl-openssl-3.0.x.so.node</div>


<h3>Dựng lại sự cố 502, làm thật</h3>
${slide('dk-06', 11, 'Sự cố thật: build xanh, đẩy xanh, tráo xanh — rồi API 502 bảy phút')}
<p>Đọc về một sự cố dạy được ít hơn là cố ý gây ra nó. Phần này dựng lại ĐÚNG lỗi đó với app Prisma ở Bài 6.1: stage dựng là Debian (<code>node:22-slim</code>), nên <code>prisma generate</code> tải về engine <code>debian-openssl-3.0.x</code>; stage chạy lại là <code>node:22-alpine</code>. Lúc build không có gì cảnh báo bạn cả.</p>
<pre><code class="language-dockerfile"># Dockerfile.trap — cố ý mắc lỗi
FROM node:22-slim AS build
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends openssl &amp;&amp; rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate &amp;&amp; npm run build
RUN npm prune --omit=dev

FROM node:22-alpine                         <span class="tok-comment"># ← musl. Engine chép xuống dưới lại là glibc.</span>
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]</code></pre>
<pre><code class="language-bash">docker build -f Dockerfile.trap -t dk06-api:trap .        <span class="tok-comment"># xanh</span>
docker run -d --name dk06-trap --restart unless-stopped \\
  -e DATABASE_URL=postgresql://u:p@db:5432/app dk06-api:trap
sleep 12
docker ps -a --filter name=dk06-trap --format '{{.Names}}  {{.Status}}'
docker inspect -f 'RestartCount={{.RestartCount}} ExitCode={{.State.ExitCode}}' dk06-trap
docker logs dk06-trap 2&gt;&amp;1 | head -22</code></pre>
<div class="out">dk06-trap  Restarting (1) 4 seconds ago
RestartCount=7 ExitCode=1
prisma:warn Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-1.1.x".
Please manually install OpenSSL and try installing Prisma again.
PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl".

This happened because Prisma Client was generated for "debian-openssl-3.0.x", but the actual deployment required "linux-musl".
Add "linux-musl" to &#96;binaryTargets&#96; in the "schema.prisma" file and run &#96;prisma generate&#96; after saving it:

generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl"]
}

The following locations have been searched:
  /app/node_modules/.prisma/client
  /app/node_modules/@prisma/client
  /tmp/prisma-engines
    at za (/app/node_modules/@prisma/client/runtime/library.js:64:805)
    …
    at async main (/app/dist/index.js:13:5) {
  clientVersion: '5.22.0',
  errorCode: undefined
}</div>
${slide('dk-06', 12, 'Dựng lại y hệt: engine debian-openssl-3.0.x trên nền musl')}
<table>
<tr><th>Dòng</th><th>Nó nói gì với bạn</th></tr>
<tr><td><code>Restarting (1)</code></td><td>Tiến trình chính thoát với mã 1 và chính sách khởi động lại đang chạy nó lần nữa. Bảy lần khởi động lại trong mười hai giây, và khoảng chờ dài dần mỗi lần.</td></tr>
<tr><td><code>Prisma failed to detect the libssl/openssl version</code></td><td>Một vấn đề thứ hai, nhỏ hơn: <code>node:22-alpine</code> không có thư viện OpenSSL, nên Prisma phải đoán. Kể cả engine musl cũng cần <code>apk add openssl</code>.</td></tr>
<tr><td><code>generated for "debian-openssl-3.0.x" … required "linux-musl"</code></td><td>Toàn bộ chẩn đoán trong một câu: file engine trên đĩa là cho glibc, hệ thống lại là musl.</td></tr>
<tr><td><code>at async main (/app/dist/index.js:13:5)</code></td><td>Cú hỏng xảy ra ở <code>prisma.$connect()</code> — TRƯỚC khi máy chủ HTTP kịp nghe cổng. Vì vậy nginx trả <strong>502 Bad Gateway</strong>: không có ai ở cổng đó cả.</td></tr>
</table>
<div class="callout"><strong>Vì sao mọi phép kiểm đều xanh.</strong> <code>docker build</code> chỉ chứng minh các lệnh trong Dockerfile thoát với mã 0. <code>docker push</code> chỉ chứng minh byte đã được tải lên. <code>compose up -d</code> chỉ chứng minh một container đã được <em>TẠO</em>. Không cái nào chạy câu truy vấn CSDL đầu tiên của bạn. Phép kiểm duy nhất bắt được lỗi này là phép kiểm <em>KHỞI ĐỘNG ảnh</em> hoặc <em>SOI bên trong nó</em> — trước khi đẩy.</div>

<h3>Chốt kiểm libc ↔ engine chạy trước MỌI lần đẩy</h3>
${slide('dk-06', 13, 'Chốt kiểm libc ↔ engine: 1 giây, chạy trước docker push')}
<p>Đoạn phát hiện ở trên chỉ in ra dữ kiện; một cái chốt phải <em>RA QUYẾT ĐỊNH</em> và trả mã thoát khác 0 để script deploy dừng lại. Cái dưới đây chạy trong khoảng một giây và không cần gì trong ảnh ngoài <code>sh</code> và <code>ls</code>:</p>
<pre><code class="language-bash">#!/bin/sh
# check-libc.sh &lt;ảnh&gt; — chạy TRƯỚC docker push: libc của ảnh có khớp engine Prisma không?
IMG="\$1"
docker run --rm --entrypoint sh "\$IMG" -c '
  if ls /lib/ld-musl-* &gt;/dev/null 2&gt;&amp;1; then LIBC=musl; else LIBC=glibc; fi
  ENG=\$(ls node_modules/.prisma/client 2&gt;/dev/null | grep -o "libquery_engine-[^ ]*\\.so\\.node" | tr "\\n" " ")
  echo "libc:    \$LIBC"
  echo "engines: \$ENG"
  case "\$LIBC:\$ENG" in
    musl:*musl*)  echo "OK";   exit 0 ;;
    glibc:*debian*|glibc:*rhel*) echo "OK"; exit 0 ;;
    *) echo "LỆCH: libc \$LIBC nhưng không có engine cho nó"; exit 1 ;;
  esac'</code></pre>
<pre><code class="language-bash">./check-libc.sh dk06-api:trap;  echo "exit=\$?"
./check-libc.sh dk06-api:multi; echo "exit=\$?"</code></pre>
<div class="out">libc:    musl
engines: libquery_engine-debian-openssl-3.0.x.so.node
LỆCH: libc musl nhưng không có engine cho nó
exit=1
libc:    glibc
engines: libquery_engine-debian-openssl-3.0.x.so.node
OK
exit=0</div>
<table>
<tr><th>Mảnh</th><th>Vì sao viết như vậy</th></tr>
<tr><td><code>--entrypoint sh</code></td><td>Thay lệnh bình thường của ảnh (<code>node dist/index.js</code>) bằng một shell, để phép kiểm không bao giờ khởi động app hay cần tới CSDL.</td></tr>
<tr><td><code>ls /lib/ld-musl-*</code></td><td>Trình nạp musl chỉ có trên hệ musl — đáng tin hơn việc đọc output của <code>ldd</code>, vốn khác nhau giữa hai bên và thoát với mã khác 0 trên Alpine.</td></tr>
<tr><td><code>case "\$LIBC:\$ENG"</code></td><td>Một chuỗi dạng <code>musl:libquery_engine-debian…</code>, đem so với hai mẫu an toàn. Mọi thứ khác — kể cả "không có engine nào" — đều bị CHẶN.</td></tr>
<tr><td><code>exit 1</code></td><td>Trong một script deploy có <code>set -e</code>, dòng push phía sau sẽ không bao giờ chạy.</td></tr>
</table>
<p><strong>Cách sửa</strong> là một trong hai, và cả hai đã được kiểm trên cùng máy. Hoặc giữ Alpine và sinh đúng engine:</p>
<pre><code class="language-dockerfile"># schema.prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}

# stage chạy
FROM node:22-alpine
RUN apk add --no-cache openssl</code></pre>
<pre><code class="language-bash">./check-libc.sh dk06-api:fix; echo "exit=\$?"
docker logs dk06-fix           <span class="tok-comment"># cùng app, cạnh một PostgreSQL thật trên mạng dk06-net</span></code></pre>
<div class="out">libc:    musl
engines: libquery_engine-debian-openssl-3.0.x.so.node libquery_engine-linux-musl-openssl-3.0.x.so.node
OK
exit=0
db connected
listening on 8080</div>
<p>…hoặc dùng <code>-slim</code> cho cả hai stage, đúng như dự án sinh viên đó đã làm sau sự cố: tải thêm 21MB, và cả một lớp vấn đề biến mất. Cách nào thì cũng hãy GIỮ cái chốt: người tiếp theo sửa Dockerfile sẽ không đọc bài này.</p>

<h3>Khi nào từng cái nền là đúng</h3>
<div class="lz-map">
  <div class="lz-stage">Dùng -slim (Debian)</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Mặc định cho một ảnh cuối</span><span class="lz-nsub">Mọi thứ có mô-đun native, Python, Prisma, hoặc một cây thư viện bạn chưa quen. Tốn khoảng 40MB hơn Alpine và loại bỏ trọn một lớp vấn đề. Nếu bạn không chắc thì đây là câu trả lời.</span></div></div>
  <div class="lz-stage">Dùng -alpine</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Thư viện thuần JS, hoặc bạn đã KIỂM CHỨNG</span><span class="lz-nsub">Một API Node không có mô-đun biên dịch, một ảnh nginx, một công cụ Go nhỏ muốn có shell. Hãy kiểm bằng một lượt CHẠY THẬT, không phải bằng một lượt dựng xanh.</span></div></div>
  <div class="lz-stage">Dùng distroless</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Production, khi ứng dụng đã ổn định</span><span class="lz-nsub">glibc, nên không có bất ngờ musl nào; không shell, nên bề mặt tấn công nhỏ hơn nhiều; và một người anh em <code>:debug</code> từ cùng một Dockerfile cho lúc bạn cần nhìn (Bài 6.1).</span></div></div>
  <div class="lz-stage">Dùng scratch</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một chương trình tĩnh duy nhất, không gì khác</span><span class="lz-nsub">Go hoặc Rust. Nhớ rằng chứng chỉ CA và dữ liệu múi giờ đều VẮNG MẶT — hãy chép chúng từ một ảnh thật vào nếu chương trình cần.</span></div></div>
  <div class="lz-stage">Dùng ảnh đầy đủ</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">CHỈ làm stage dựng</span><span class="lz-nsub">Trình biên dịch đã có sẵn, không phải cài gì, và kích thước của nó không bao giờ tới được ảnh cuối (Bài 6.1).</span></div></div>
</div>

<h3>Đọc cái giá thật của một ảnh nền</h3>
<pre><code>docker scout quickview node:22-slim 2&gt;/dev/null | head -8
docker scout quickview node:22-alpine 2&gt;/dev/null | head -6</code></pre>
<div class="out">  Target             │  node:22-slim         │    0C     2H     8M    41L
    digest           │  a1b2c3d4e5f6         │
  Base image         │  debian:bookworm-slim │    0C     0H     2M    31L

  Target             │  node:22-alpine       │    0C     0H     1M     6L
    digest           │  9f8e7d6c5b4a         │
  Base image         │  alpine:3.20          │    0C     0H     0M     3L</div>

<div class="callout warn"><strong>Về output ở trên (kiểm ngày 23/09/2026).</strong> <code>docker scout quickview</code> nay từ chối chạy khi chưa đăng nhập Docker ID ("Log in with your Docker ID or email address to use docker scout"), nên khoá không chạy lại được; các digest in ra chỉ là chỗ giữ chỗ và các con số mang tính minh hoạ. Đây là phép đo ai cũng lặp lại được mà không cần tài khoản — Trivy 0.74.0 chạy bằng container, CSDL lỗ hổng ngày 23/09/2026, chỉ gói hệ điều hành, mọi mức độ:</div>
<pre><code class="language-bash">for i in node:22 node:22-slim node:22-alpine gcr.io/distroless/nodejs22-debian12; do
  docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest \\
    image -q --scanners vuln "\$i" | grep -E "^Total" | head -1
done</code></pre>
<div class="out">Total: 3983 (UNKNOWN: 91, LOW: 1295, MEDIUM: 2112, HIGH: 453, CRITICAL: 32)
Total: 225 (UNKNOWN: 1, LOW: 72, MEDIUM: 96, HIGH: 52, CRITICAL: 4)
Total: 19 (UNKNOWN: 0, LOW: 1, MEDIUM: 7, HIGH: 10, CRITICAL: 1)
Total: 54 (UNKNOWN: 0, LOW: 25, MEDIUM: 23, HIGH: 5, CRITICAL: 1)</div>
<p>Đọc kỹ dòng thứ ba: với <code>node:22-alpine</code> phần hệ điều hành là <strong>0</strong>, nên dòng <code>Total</code> đầu tiên in ra lại là của phần kế tiếp — 19 phát hiện trong cái <code>npm</code> đi kèm mọi ảnh Node chính thức (Bài 6.5 quay lại chuyện này). Vậy tính theo gói hệ điều hành: Debian đủ bộ 3.983, slim 225, Alpine 0, distroless 54. Đó là lý lẽ THẬT cho Alpine và distroless — và đó là số của MỘT ngày; tuần sau quét lại sẽ khác.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Alpine thật sự có ít CVE hơn</span><span class="v">Vì nó có ít gói hơn hẳn. Đó là một lợi thế CÓ THẬT và là lý do những người coi trọng an ninh với tay tới nó — nhưng hãy đếm những cái THẬT SỰ áp cho tiến trình của bạn, đừng đếm con số thô.</span></div>
  <div class="kv"><span class="k">Phần lớn phát hiện mức thấp là không với tới được</span><span class="v">Một CVE trong <code>libtiff</code> nằm trong một cái ảnh chẳng bao giờ giải mã ảnh thì không phải rủi ro bạn đang có. Bài 6.5 nói về việc PHÂN LOẠI thay vì đếm.</span></div>
  <div class="kv"><span class="k">Distroless mới là kẻ thắng thật ở đây</span><span class="v">Ít gói hơn Alpine <em>VÀ</em> dùng glibc. Nếu thứ bạn đang tối ưu là số CVE thì distroless thắng cả hai.</span></div>
  <div class="kv"><span class="k">Con số đó thay đổi mà không cần bạn</span><span class="v">Số CVE của một ảnh nền tăng lên khi có CVE mới được công bố cho những gói nó vốn đã có. Nhịp DỰNG LẠI quan trọng hơn con số vào cái ngày bạn chọn (Bài 3.2).</span></div>
</div>

<h3>Ghim cái nền</h3>
<pre><code><span class="tok-comment"># Tốt: bản phụ + biến thể, bản vá vẫn tới</span>
FROM node:22-alpine

<span class="tok-comment"># Tốt hơn: ghim luôn bản phát hành Alpine hay Debian, để nâng OS nền là có chủ ý</span>
FROM node:22-alpine3.20
FROM python:3.12-bookworm

<span class="tok-comment"># Tốt nhất cho production: tag đọc được VÀ digest bất biến (Bài 3.2)</span>
FROM node:22-alpine3.20@sha256:b8f2c1a4e9d3f7a6b5c4d3e2f1908877665544332211aabbccddeeff0011223344</code></pre>

<pre><code class="language-bash"><span class="tok-comment"># Lấy digest THẬT để ghim (cái ở trên chỉ là chỗ giữ chỗ)</span>
docker buildx imagetools inspect node:22-alpine3.24 | head -3</code></pre>
<div class="out">Name:      docker.io/library/node:22-alpine3.24
MediaType: application/vnd.oci.image.index.v1+json
Digest:    sha256:b6f26b36c8ff49624cfdac716b8ea1138d606df02586a77d364bb5536a634f85</div>
<p>Đây là digest của <em>index</em> đa nền tảng, nên cùng một lần ghim chạy được trên Mac của bạn (arm64) lẫn VPS (amd64). Hôm nay <code>node:22-alpine</code> là Alpine 3.24; con số <code>3.20</code> trong các ví dụ ở trên là từ lúc bài được viết lần đầu.</p>

<div class="callout ok"><strong>Hãy ghim BẢN PHÁT HÀNH CỦA HỆ ĐIỀU HÀNH, không chỉ phiên bản ngôn ngữ.</strong> <code>node:22-alpine</code> đã âm thầm dịch từ Alpine 3.19 sang 3.20 rồi 3.21 trong vòng một năm, và mỗi lần dịch là đổi phiên bản thư viện hệ thống ngay dưới chân bạn. <code>node:22-alpine3.20</code> giữ chuyện đó ổn định cho tới khi bạn chọn khác — và điều đó biến "bản dựng của chúng tôi hỏng mà chẳng có gì thay đổi" thành một quyết định bạn đưa ra một cách có chủ ý.</div>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn trong nhóm "tối ưu" Dockerfile của nhóm bằng cách chỉ đổi dòng <code>FROM</code> cuối thành <code>node:22-alpine</code>. Build trên GitHub Actions vẫn xanh. Trước khi nó tới máy chủ demo, hãy chứng minh nó hỏng và thêm một cái chốt để chuyện này không lặp lại.</p><ol>
<li><code>mkdir -p ~/thu-docker/ch06-musl &amp;&amp; cd ~/thu-docker/ch06-musl</code>. Tái hiện cú hỏng trình nạp trước (không cần Prisma): <code>Dockerfile</code> ba dòng ở mục "Không tương thích nhị phân nghĩa là gì", dựng thành <code>thu-glibc</code>. Chạy nó và đọc lỗi.</li>
<li>Chứng minh file có tồn tại bằng <code>ls -l</code>, và tìm xem Alpine thật ra có trình nạp nào bằng <code>ls /lib/ld-*</code>.</li>
<li>Nếu bạn có một dự án Prisma (backend SWP391, hoặc app ở 6.1), dựng nó với stage dựng Debian và stage chạy Alpine thành <code>thu-trap</code>. Lưu <code>check-libc.sh</code> của bài này rồi chạy: nó phải in <code>LỆCH</code> và thoát mã 1.</li>
<li>Sửa theo một trong hai cách (<code>binaryTargets</code> + <code>apk add openssl</code>, hoặc <code>-slim</code> cho cả hai stage), dựng lại, rồi chạy lại cái chốt.</li>
<li>Dọn dẹp: <code>docker rmi thu-glibc thu-trap</code>.</li></ol>
<p><strong>Đạt khi:</strong> bạn giải thích được trong một câu vì sao <code>exec …: no such file or directory</code> hiện ra với một file mà <code>ls</code> vẫn thấy, và <code>check-libc.sh</code> trả mã 1 với ảnh hỏng, mã 0 với ảnh đã sửa.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Base image (ảnh nền)</span><span class="v">Ảnh ghi ở dòng <code>FROM</code>; nó quyết định hệ điều hành, thư viện C và phần lớn kích thước.</span></div>
  <div class="kv"><span class="k">glibc (thư viện C của GNU)</span><span class="v">Thư viện C mà Debian, Ubuntu, RHEL và distroless dùng.</span></div>
  <div class="kv"><span class="k">musl (thư viện C gọn nhẹ)</span><span class="v">Thư viện C nhỏ mà Alpine dùng; cùng chuẩn, khác giao diện nhị phân.</span></div>
  <div class="kv"><span class="k">Dynamic loader (trình nạp động)</span><span class="v">Chương trình được ghi tên trong mọi file nhị phân liên kết động để nạp thư viện; thiếu nó = "no such file".</span></div>
  <div class="kv"><span class="k">Native module (module biên dịch sẵn)</span><span class="v">Mã đã biên dịch đi kèm một gói (<code>.node</code>, engine Prisma, wheel Python) — gắn chặt với một libc.</span></div>
  <div class="kv"><span class="k">binaryTargets (đích nhị phân)</span><span class="v">Thiết lập của Prisma liệt kê engine cho những nền tảng nào sẽ được <code>prisma generate</code> tải về.</span></div>
  <div class="kv"><span class="k">distroless (ảnh không bản phân phối)</span><span class="v">Ảnh chỉ có môi trường chạy và thư viện của nó: không shell, không trình quản lý gói.</span></div>
  <div class="kv"><span class="k">Digest pin (ghim theo mã băm)</span><span class="v"><code>ảnh@sha256:…</code> — trỏ tới đúng những byte đó, khác với tag có thể bị dời đi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Trên Docker 29, chênh lệch dung lượng tải giữa <code>node:22-slim</code> và <code>node:22-alpine</code> chỉ khoảng 21MB (82,6MB so với 61,2MB).</li>
<li>musl và glibc cùng hiện thực chuẩn C nhưng không tương thích nhị phân; chương trình glibc trên Alpine hỏng với "no such file or directory" vì thiếu trình nạp.</li>
<li>Engine Prisma sinh cho <code>debian-openssl-3.0.x</code> trên nền musl cho build, push, deploy đều xanh — rồi <code>Restarting (1)</code> và 502.</li>
<li>Chỉ phép kiểm KHỞI ĐỘNG hoặc SOI ảnh mới bắt được; một cái chốt libc ↔ engine một giây trước <code>docker push</code> là đủ.</li>
<li>Sửa bằng <code>binaryTargets</code> + <code>apk add openssl</code>, hoặc dùng <code>-slim</code> cho cả hai stage.</li>
<li>Ghim bản phát hành hệ điều hành trong tag và digest của index cho production; đo lại số CVE, nó đổi mỗi ngày.</li>
</ul>

<a class="link-card" href="https://www.prisma.io/docs/orm/reference/prisma-schema-reference" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Tham chiếu schema Prisma — binaryTargets</span><span class="lc-sub">Danh sách đích engine (<code>linux-musl-openssl-3.0.x</code>, <code>debian-openssl-3.0.x</code>, <code>linux-arm64-openssl-3.0.x</code> …) và <code>native</code> nghĩa là gì. Tra ảnh chạy của bạn ở đây TRƯỚC khi đổi ảnh nền.</span></span>
</a>
<a class="link-card" href="https://hub.docker.com/_/node" target="_blank" rel="noopener">
  <span class="lc-ico">🟩</span>
  <span class="lc-body"><span class="lc-title">Tài liệu ảnh node chính thức</span><span class="lc-sub">Giải thích danh sách tag — <code>-slim</code>, <code>-alpine</code> và những tag trần chứa gì — cộng ghi chú của chính người bảo trì về những lúc Alpine là một ý tồi.</span></span>
</a>
<a class="link-card" href="https://wiki.musl-libc.org/functional-differences-from-glibc.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">musl — khác biệt chức năng so với glibc</span><span class="lc-sub">Danh sách của chính người bảo trì, gồm hành vi của trình phân giải DNS và kích thước ngăn xếp mặc định làm hỏng vài chương trình đa luồng. Nguồn gốc khi Alpine hành xử lạ.</span></span>
</a>
<a class="link-card" href="https://github.com/GoogleContainerTools/distroless" target="_blank" rel="noopener">
  <span class="lc-ico">🪶</span>
  <span class="lc-body"><span class="lc-title">distroless</span><span class="lc-sub">Biến thể nào chứa gì, các tag <code>:nonroot</code> với <code>:debug</code>, và ví dụ đầy đủ theo từng ngôn ngữ. Hãy đọc trước cái ảnh distroless đầu tiên của bạn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: chọn cái nền</span><span class="lc-sub">Bài chấm điểm: chọn ảnh nền cho bốn ứng dụng khác nhau và biện luận, chẩn đoán một mô-đun native chỉ hỏng trên Alpine, phát hiện lệch libc/engine trước khi deploy, và ghim một ảnh nền theo ba cách.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> chuyển sang Alpine "cho ảnh nhỏ đi" rồi đem đi vì lượt dựng đã qua. Bước cài THÀNH CÔNG — npm tìm thấy một bản dựng sẵn cho musl, hoặc âm thầm biên dịch từ mã nguồn — và cú hỏng hiện ra lúc CHẠY, trên máy chủ, dưới dạng một mô-đun không nạp được hoặc một engine không khởi động nổi. Tệ hơn, vài thư viện không hỏng hẳn mà chỉ SUY GIẢM: một trình phân giải DNS hơi khác tạo ra những cú tra cứu hỏng chập chờn dưới tải mà chẳng bao giờ tái hiện được ở máy. Cái luật: đổi ảnh nền là một thay đổi cần một lượt CHẠY THẬT, không phải một lượt dựng xanh. Hãy khởi động container, gọi một endpoint thật, và đọc log — còn nếu ứng dụng dùng Prisma, mô-đun native hay wheel Python thì hãy dành sẵn một buổi chiều, hoặc đơn giản là dùng <code>-slim</code>.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Alpine dùng musl còn mọi thứ khác dùng glibc; chúng KHÔNG tương thích nhị phân, và đó là lý do mô-đun native, wheel Python và engine Prisma vỡ đúng ở đó. <code>-slim</code> là mặc định an toàn cho một ảnh cuối — hơn Alpine chừng 40MB và không có bất ngờ nào — còn distroless là câu trả lời production tốt hơn khi ứng dụng đã ổn định. Và hãy ghim bản phát hành hệ điều hành ngay trong tag, không chỉ phiên bản ngôn ngữ, để việc nâng OS nền là một QUYẾT ĐỊNH chứ không phải một sự cố.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.3 ─────────────────────────── */
    {
      title: '6.3 — Finding and removing the megabytes|||6.3 — Tìm ra và cắt đi những megabyte',
      slug: 'dk-6-3-cat-kich-thuoc',
      type: 'LESSON',
      description: 'Đo xem byte nằm ở đâu bằng docker history và dive, tám việc thật sự có tác dụng theo thứ tự hiệu quả, những gì riêng Node và Python, và ba thứ KHÔNG đáng bận tâm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Finding and removing the megabytes</h2>
<p class="lead">Image size is worth caring about for concrete reasons: pull time on every deploy, storage on every host and in the registry, and attack surface. But it is easy to spend an afternoon shaving 8MB while a 400MB directory sits in plain sight. Measure first, then work down the list in order of effect.</p>

<h3>Where the bytes are</h3>
${slide('dk-06', 14, 'Đo trước khi cắt: docker history chỉ ra byte nằm ở đâu')}
<pre><code>docker history app:1.0 --format 'table {{.Size}}\\t{{.CreatedBy}}' --no-trunc \\
  | head -8 | cut -c1-110</code></pre>
<div class="out">SIZE      CREATED BY
0B        CMD ["node" "dist/index.js"]
412MB     COPY /app/node_modules ./node_modules # buildkit
2.11MB    COPY /app/dist ./dist # buildkit
0B        ENV NODE_ENV=production
188MB     RUN /bin/sh -c apk add --no-cache python3 make g++ # buildkit
185MB     /bin/sh -c #(nop) ADD file:… in /</div>
<pre><code><span class="tok-comment"># dive gives the same answer with a file tree — install it once, use it forever</span>
docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock \\
  wagoodman/dive:latest app:1.0 --ci 2&gt;&amp;1 | tail -8</code></pre>
<div class="out">Analyzing image
  efficiency: 71.4 %
  wastedBytes: 214088142 bytes (214 MB)
  userWastedPercent: 28.6 %
Inefficient Files:
Count  Wasted Space  File Path
    2        188 MB  /usr/lib/python3.12
    2         14 MB  /var/cache/apk
    3        9.1 MB  /root/.npm</div>
<p>Two findings in ten seconds: <code>node_modules</code> is 412MB, and a Python toolchain that was installed and then removed is still occupying 188MB in a lower layer. Neither would have been obvious from reading the Dockerfile.</p>


<h3>Read docker history column by column, on an image you can rebuild</h3>
<p>The output above is from a larger app. Here is the single-stage image of the course's TypeScript + Prisma API from Lesson 6.1, measured on the Linux machine:</p>
<pre><code class="language-bash">docker history dk06-api:single --format 'table {{.Size}}\\t{{.CreatedBy}}' | cut -c1-100 | head -20</code></pre>
<div class="out">SIZE      CREATED BY
0B        CMD ["node" "dist/index.js"]
12.3kB    RUN /bin/sh -c npm run build # buildkit
16.3MB    RUN /bin/sh -c npx prisma generate # buildkit
170MB     RUN /bin/sh -c npm ci # buildkit
81.9kB    COPY . . # buildkit
0B        WORKDIR /app
0B        CMD ["node"]
0B        ENTRYPOINT ["docker-entrypoint.sh"]
4.1kB     COPY docker-entrypoint.sh /usr/local/bin/ # …
5.38MB    RUN /bin/sh -c set -ex   &amp;&amp; export GNUPGHOME…
0B        ENV YARN_VERSION=1.22.22
208MB     RUN /bin/sh -c ARCH= &amp;&amp; dpkgArch="&#36;(dpkg --p…
0B        ENV NODE_VERSION=22.23.2
53.2kB    RUN /bin/sh -c groupadd --gid 1000 node   &amp;&amp;…
618MB     RUN /bin/sh -c set -ex;  apt-get update;  ap…
191MB     RUN /bin/sh -c set -eux;  apt-get update;  a…
52.7MB    RUN /bin/sh -c set -eux;  apt-get update;  a…
132MB     # debian.sh --arch 'amd64' out/ 'bookworm' '…</div>
<table>
<tr><th>Piece</th><th>What it does</th></tr>
<tr><td><code>--format 'table {{.Size}}\\t{{.CreatedBy}}'</code></td><td>Print only two columns: the layer size (unpacked) and the instruction that made it. <code>table</code> adds the header row; <code>\\t</code> is a tab.</td></tr>
<tr><td><code>cut -c1-100</code></td><td>Cut every line at 100 characters so long <code>RUN</code> commands do not wrap. The <code>…</code> is Docker's own truncation.</td></tr>
<tr><td>Rows read <strong>bottom-up</strong></td><td>The bottom row is the first layer of <code>debian:bookworm</code>; the top is your last instruction. Everything below <code>WORKDIR /app</code> came with <code>FROM node:22</code>.</td></tr>
<tr><td><code>0B</code> rows</td><td>Metadata only (<code>ENV</code>, <code>CMD</code>, <code>WORKDIR</code>): they change the image config, not the filesystem.</td></tr>
</table>
<p>Add it up: the four Debian/toolchain layers (132 + 52.7 + 191 + 618MB) plus Node itself (208MB) are about 1.2GB — <strong>about 85% of the unpacked image is the base</strong>, and the single biggest layer (618MB of compilers and headers from <code>node:22</code>) is something the running API never uses. That is why step 2 of the list below ("the right base") is worth more than any clever trick in your own layers.</p>

<h3>Eight things that work, in order of effect</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Multi-stage</span><span class="lz-t">typically 60–85% off</span><span class="lz-d">Compilers, dev dependencies and source simply never reach the final image (Lesson 6.1). Nothing else comes close, and everything below is a rounding error until you have done this.</span></div>
  <div class="lz-step"><span class="lz-k">2 · The right base</span><span class="lz-t">1.13GB → 224MB → 152MB</span><span class="lz-d">Full → slim → distroless. Free, and one line (Lesson 6.2). Do not trade correctness for it.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Prune production dependencies</span><span class="lz-t">often 50–70% of node_modules</span><span class="lz-d"><code>npm ci --omit=dev</code> in a dedicated stage, or <code>npm prune --omit=dev</code> at the end of the build. The single biggest remaining item in most Node images.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Clean caches inside the same RUN</span><span class="lz-t">10–200MB depending on package manager</span><span class="lz-d"><code>rm -rf /var/lib/apt/lists/*</code>, <code>--no-cache</code> for apk, <code>--no-cache-dir</code> for pip. Must be the same <code>RUN</code>, or the bytes stay in the earlier layer (Lesson 1.2).</span></div>
  <div class="lz-step"><span class="lz-k">5 · .dockerignore</span><span class="lz-t">whatever COPY . . was dragging in</span><span class="lz-d">Prevents <code>node_modules</code>, <code>.git</code> and build output from being copied at all. Also fixes build speed (Lesson 4.1).</span></div>
  <div class="lz-step"><span class="lz-k">6 · --no-install-recommends</span><span class="lz-t">30–150MB on Debian</span><span class="lz-d">apt pulls in a surprising amount of suggested software by default. One flag, no downside.</span></div>
  <div class="lz-step"><span class="lz-k">7 · COPY --chown instead of RUN chown -R</span><span class="lz-t">up to the size of what you copied</span><span class="lz-d">A recursive chown rewrites every file into a new layer, doubling that part of the image (Lesson 4.2).</span></div>
  <div class="lz-step"><span class="lz-k">8 · Framework-specific output modes</span><span class="lz-t">Next.js standalone: ~1GB off</span><span class="lz-d">Next's <code>output: 'standalone'</code>, Vite's build output, Go's <code>-ldflags="-s -w"</code>. Check whether your framework has one — it is usually a single config line (Lesson 4.5).</span></div>
</div>

<h3>Node specifics</h3>
${slide('dk-06', 16, 'npm prune vẫn giữ 60 MB Prisma CLI — vì nó là devOptional')}
<pre><code><span class="tok-comment"># What is actually in node_modules?</span>
docker run --rm app:1.0 sh -c 'du -sh node_modules; du -sh node_modules/* | sort -hr | head -5'</code></pre>
<div class="out">412M	node_modules
118M	node_modules/@swc
64M	node_modules/typescript
41M	node_modules/@esbuild
22M	node_modules/prisma
19M	node_modules/@prisma</div>
<p><code>@swc</code>, <code>typescript</code> and <code>@esbuild</code> are build tools — 223MB of compiler that the running server never loads. They are in the image because the build stage's <code>node_modules</code> was copied wholesale (Lesson 6.1's pitfall). Note <code>prisma</code> versus <code>@prisma</code>: the CLI is a dev dependency and the client is not, so pruning removes 22MB and keeps the 19MB you need.</p>
<pre><code><span class="tok-comment"># The fix, as a separate stage</span>
FROM node:22-alpine AS proddeps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

FROM node:22-alpine
COPY --from=proddeps /app/node_modules ./node_modules
COPY --from=build    /app/dist ./dist</code></pre>
<div class="out">app:1.0  612MB
app:1.1  196MB</div>


<h3>The 60MB that npm prune keeps: Prisma CLI is "devOptional"</h3>
<p>Run the same <code>du</code> on the course app's multi-stage image — the one that already did <code>npm prune --omit=dev</code>:</p>
<pre><code class="language-bash">docker run --rm --entrypoint sh dk06-api:multi -c \\
  'du -sh node_modules; du -sh node_modules/* node_modules/.prisma 2&gt;/dev/null | sort -hr | head -5'
docker run --rm --entrypoint sh dk06-api:multi -c \\
  'du -sh node_modules/@prisma/* node_modules/.prisma/client/* 2&gt;/dev/null | sort -hr | head -5'</code></pre>
<div class="out">89M	node_modules
44M	node_modules/@prisma
26M	node_modules/prisma
16M	node_modules/.prisma
396K	node_modules/iconv-lite
284K	node_modules/qs
34M	node_modules/@prisma/engines
16M	node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node
8.2M	node_modules/@prisma/client
1008K	node_modules/@prisma/fetch-engine
696K	node_modules/@prisma/get-platform</div>
<p><code>prisma</code> (the CLI, 26MB) and <code>@prisma/engines</code> (its engines, 34MB) are listed under <code>devDependencies</code> — and they survived the prune. The running API only needs <code>@prisma/client</code> and the 16MB engine in <code>.prisma/client</code>. Why?</p>
<pre><code class="language-bash">npm ls prisma --omit=dev
grep -A4 '"node_modules/prisma"' package-lock.json | grep devOptional</code></pre>
<div class="out">dk06-api@1.0.0 /…/app
└─┬ @prisma/client@5.22.0
  └─┬ prisma@5.22.0
    └── @prisma/engines@5.22.0
      "devOptional": true,</div>
<p><code>@prisma/client</code> declares <code>prisma</code> as an <em>optional peer dependency</em>. npm therefore marks it <code>devOptional</code> — "dev, but also optionally needed by a production package" — and <code>--omit=dev</code> keeps it. Nothing is broken; it is just 60MB you ship on every deploy. If migrations run from a separate step (they should — Chapter 11), drop the CLI explicitly:</p>
<pre><code class="language-dockerfile">RUN npm prune --omit=dev \\
 &amp;&amp; rm -rf node_modules/prisma node_modules/@prisma/engines node_modules/.bin/prisma</code></pre>
<p>Measured: <code>node_modules</code> in the final image went from 93MB to 30.7MB, and the app still answered <code>{"ok":true}</code> with a real PostgreSQL next to it. The general lesson is bigger than Prisma: <strong>"I ran prune" is not a measurement</strong>. <code>du</code> is.</p>

<h3>Python specifics</h3>
<pre><code>FROM python:3.12-slim AS build
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends build-essential libpq-dev \\
 &amp;&amp; rm -rf /var/lib/apt/lists/*
COPY requirements.txt ./
RUN --mount=type=cache,target=/root/.cache/pip \\
    pip install --prefix=/install --no-compile -r requirements.txt

FROM python:3.12-slim
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends libpq5 \\
 &amp;&amp; rm -rf /var/lib/apt/lists/*
COPY --from=build /install /usr/local
COPY . .</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">--prefix=/install</span><span class="v">Installs into a directory you can copy as one unit, rather than scattering files across the image. The standard Python multi-stage pattern.</span></div>
  <div class="kv"><span class="k">build-essential in the build stage only</span><span class="v">150MB of compilers that only mattered while wheels were being built. The final stage installs the <em>runtime</em> library (<code>libpq5</code>), not the development one (<code>libpq-dev</code>).</span></div>
  <div class="kv"><span class="k">--no-compile</span><span class="v">Skips writing <code>.pyc</code> files, which are regenerated at run time anyway. Saves 10–20% of the site-packages tree, at the cost of a slower first import.</span></div>
  <div class="kv"><span class="k">PYTHONDONTWRITEBYTECODE=1</span><span class="v">Stops the running container writing <code>.pyc</code> into its writable layer. Small, and it keeps <code>docker diff</code> readable (Lesson 2.2).</span></div>
</div>

<h3>Three things not to bother with</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Squashing layers</span><span class="v"><code>--squash</code> is experimental, and it destroys layer sharing: two squashed images from the same base share nothing, so five services that used to share a 185MB base now cost 925MB on the host. Multi-stage achieves the real goal without this cost.</span></div>
  <div class="kv"><span class="k">Minimising the layer count</span><span class="v">Layers are nearly free. Chaining fifteen commands into one unreadable <code>RUN</code> to save a few kilobytes of metadata costs you cache granularity (Lesson 5.2) and readability. Group by change frequency instead.</span></div>
  <div class="kv"><span class="k">Alpine when it costs correctness</span><span class="v">40MB is not worth an afternoon of musl debugging, a source-compiled numpy, or an intermittent DNS failure in production (Lesson 6.2). Take the 40MB.</span></div>
  <div class="kv"><span class="k">And one thing that IS worth it</span><span class="v">Checking the number in CI. <code>docker image inspect app --format '{{.Size}}'</code> with a threshold catches the day someone adds a 300MB dependency, which is when it is cheap to fix.</span></div>
</div>
<pre><code><span class="tok-comment"># A size gate for CI</span>
MAX=\$((250 * 1024 * 1024))
SIZE=\$(docker image inspect app:ci --format '{{.Size}}')
echo "image size: \$((SIZE / 1024 / 1024))MB"
[ "\$SIZE" -gt "\$MAX" ] &amp;&amp; { echo "image exceeds \$((MAX/1024/1024))MB" &gt;&amp;2; exit 1; }
echo "size ok"</code></pre>
<div class="out">image size: 196MB
size ok</div>

<h3>Docker 29 changed what .Size measures — re-check your gate</h3>
${slide('dk-06', 18, 'Docker 29: .Size là bản nén — cổng kích thước phải biết mình đo gì')}
<p>The gate above was written when <code>{{.Size}}</code> meant the unpacked size. On Docker 29 with the containerd image store it is the <strong>compressed</strong> size — the same number as CONTENT SIZE. Measured on the Linux machine:</p>
<pre><code class="language-bash">docker image inspect -f '{{.Size}}' dk06-api:single
docker images dk06-api:single
MAX=\$((250 * 1024 * 1024))
SIZE=\$(docker image inspect dk06-api:gon --format '{{.Size}}')
echo "image size: \$((SIZE / 1024 / 1024))MB"
[ "\$SIZE" -gt "\$MAX" ] &amp;&amp; echo over || echo "size ok"</code></pre>
<div class="out">489064150
IMAGE             ID             DISK USAGE   CONTENT SIZE   EXTRA
dk06-api:single   dd89daa3d63b       1.88GB          489MB
image size: 90MB
size ok</div>
<p>The same script on the same image reports roughly a quarter of what it reported on Docker 27, so a 250MB threshold that used to be tight is now very loose. That is not wrong — compressed bytes are what a deploy downloads — but <strong>after upgrading Docker, re-derive the threshold</strong> from today's numbers instead of trusting last year's.</p>


<h3>A worked before and after</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Start: 1.24GB</span><span class="lz-lnote">Single stage, <code>node:22</code>, <code>COPY . .</code>, all dependencies, npm cache, source, build tools.</span></div>
  <div class="lz-layer"><span class="lz-lname">Multi-stage: 612MB</span><span class="lz-lnote">Compilers and source gone. Still carrying the build stage's full <code>node_modules</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Separate proddeps stage: 196MB</span><span class="lz-lnote">Only production dependencies. The single biggest remaining win, and three lines of Dockerfile.</span></div>
  <div class="lz-layer"><span class="lz-lname">Distroless base: 152MB</span><span class="lz-lnote">No shell, no package manager, no <code>apk</code>. Plus a <code>:debug</code> sibling for when you need to look (Lesson 6.1).</span></div>
  <div class="lz-layer"><span class="lz-lname">Where it stops</span><span class="lz-lnote">The remaining 152MB is the Node runtime and your dependencies. Going further means changing the application, not the Dockerfile — which is a different conversation and usually not worth having.</span></div>
</div>


<h3>The same ladder, measured on the course app</h3>
<table>
<tr><th>Step</th><th>DISK USAGE</th><th>CONTENT SIZE (download)</th><th>What changed</th></tr>
<tr><td><code>single</code> — <code>node:22</code>, one stage</td><td>1.88GB</td><td>489MB</td><td>Everything: toolchain, source, all dependencies</td></tr>
<tr><td><code>naive</code> — two stages, whole <code>node_modules</code></td><td>487MB</td><td>124MB</td><td>Base <code>node:22-slim</code>, no source, no compilers</td></tr>
<tr><td><code>multi</code> — plus <code>npm prune</code></td><td>467MB</td><td>122MB</td><td>typescript and @types gone (Prisma CLI kept)</td></tr>
<tr><td><code>gon</code> — plus drop Prisma CLI and npm</td><td>377MB</td><td>94.4MB</td><td>node_modules 93MB → 30.7MB</td></tr>
<tr><td><code>distroless</code> — <code>nodejs22-debian12:nonroot</code></td><td>337MB</td><td>91.6MB</td><td>No shell, no apt (still carries the Prisma CLI)</td></tr>
</table>
${slide('dk-06', 17, 'Thang giảm cân của cùng một app: 1,88 GB → 337 MB')}
<p>Two steps did almost all the work: separating stages and changing the base. Everything after that is tens of megabytes. When you reach that point, stop optimising the image and look at something else.</p>

<h3>Run it step by step: install in one RUN, delete in the next</h3>
${slide('dk-06', 15, 'Cài ở RUN này, xoá ở RUN sau: ảnh 667 MB thay vì 243 MB')}
<p>The pitfall below says deleting in a later layer never shrinks anything. Here is the proof, with two three-line Dockerfiles on the Linux machine:</p>
<pre><code class="language-dockerfile"># Dockerfile.hai — two RUNs
FROM node:22-alpine
RUN apk add python3 make g++
RUN apk del python3 make g++

# Dockerfile.mot — one RUN
FROM node:22-alpine
RUN apk add python3 make g++ &amp;&amp; apk del python3 make g++</code></pre>
<pre><code class="language-bash">docker build -f Dockerfile.hai -t dk06-waste:hai .
docker build -f Dockerfile.mot -t dk06-waste:mot .
docker images --format 'table {{.Repository}}:{{.Tag}}\\t{{.Size}}' | grep -E 'REPO|dk06-waste|^node:22-alpine'
docker history dk06-waste:hai --format 'table {{.Size}}\\t{{.CreatedBy}}' | head -4</code></pre>
<div class="out">REPOSITORY:TAG                                                SIZE
dk06-waste:mot                                                243MB
dk06-waste:hai                                                667MB
node:22-alpine                                                237MB
SIZE      CREATED BY
41kB      RUN /bin/sh -c apk del python3 make g++ # bu…
315MB     RUN /bin/sh -c apk add python3 make g++ # bu…
0B        CMD ["node"]</div>
<pre><code class="language-bash">docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
  wagoodman/dive:latest dk06-waste:hai --ci</code></pre>
<div class="out">Image Source: docker://dk06-waste:hai
Extracting image from docker-engine... (this can take a while for large images)
Analyzing image...
  efficiency: 83.3305 %
  wastedBytes: 115089598 bytes (115 MB)
  userWastedPercent: 24.6195 %
Inefficient Files:
Count  Wasted Space  File Path
    2         41 MB  /usr/bin/lto-dump
    2        9.4 MB  /usr/lib/libc.a
    2        7.0 MB  /usr/lib/libstdc++.a
    2        5.4 MB  /usr/lib/libpython3.14.so.1.0
    2        5.0 MB  /var/cache/apk/APKINDEX.9c5ff2cc.tar.gz
…</div>
<table>
<tr><th>Number</th><th>How to read it</th></tr>
<tr><td>667MB vs 243MB</td><td>DISK USAGE: the <code>apk del</code> layer is 41kB of whiteouts; the 315MB below it is still in the image, pushed and pulled on every deploy.</td></tr>
<tr><td>243MB for the one-RUN image</td><td>Only 6MB above <code>node:22-alpine</code>: install and delete cancelled out inside a single layer. (What remains is mostly the apk index, because <code>--no-cache</code> was not used — one more lesson in the same picture.)</td></tr>
<tr><td><code>wastedBytes: 115 MB</code></td><td>dive counts files that appear in two layers (added, then removed or overwritten). It is a <em>lower bound</em>: it lists 115MB while the real difference between the two images is over 300MB unpacked.</td></tr>
<tr><td><code>--ci</code></td><td>Non-interactive mode: print the analysis and exit with a pass/fail code, so it can run in a pipeline.</td></tr>
</table>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the group's deploy to a 20GB VPS failed with <code>no space left on device</code>, and the backend image turns out to be 1.1GB. Your job: find where the bytes are before touching anything, then cut in order of effect.</p><ol>
<li>Pick your own backend image, or rebuild <code>thu-api:single</code> from the 6.1 practice. Run <code>docker history &lt;image&gt; --format 'table {{.Size}}\\t{{.CreatedBy}}'</code> and write down the three biggest layers and which ones came from the base.</li>
<li>Run <code>dive &lt;image&gt; --ci</code> (the container command in this lesson) and note <code>wastedBytes</code>.</li>
<li>Inside the image run <code>du -sh node_modules/* | sort -hr | head</code>. Is anything there only a build tool (typescript, @swc, prisma CLI, esbuild)?</li>
<li>Apply the two biggest fixes only — multi-stage and <code>-slim</code> — rebuild, and compare CONTENT SIZE before and after.</li>
<li>Add the size gate from this lesson with a threshold 20% above your new <code>.Size</code>, and confirm it prints <code>size ok</code>.</li></ol>
<p><strong>Done when:</strong> you have a before/after table with CONTENT SIZE and DISK USAGE, you can name the biggest layer and whether it came from the base, and the size gate passes on the new image and fails if you set the threshold below it.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">docker history</span><span class="v">Lists an image's layers from newest to oldest with the size and the instruction that created each.</span></div>
  <div class="kv"><span class="k">dive</span><span class="v">A tool that browses an image layer by layer and reports files added in one layer and removed or overwritten in another.</span></div>
  <div class="kv"><span class="k">Wasted bytes</span><span class="v">dive's estimate of bytes shipped but not visible in the final filesystem — a lower bound.</span></div>
  <div class="kv"><span class="k">Whiteout</span><span class="v">A marker file that hides a path from lower layers; deleting never removes bytes (Lesson 1.2).</span></div>
  <div class="kv"><span class="k">devOptional</span><span class="v">npm's flag for a dev dependency that a production package may also need; <code>--omit=dev</code> keeps it.</span></div>
  <div class="kv"><span class="k">Content size vs disk usage</span><span class="v">Compressed bytes to download vs compressed + unpacked bytes on the host (Docker 29).</span></div>
  <div class="kv"><span class="k">Size gate</span><span class="v">A CI step that fails the build when the image grows past a threshold.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Measure first: <code>docker history</code> showed that about 85% of a single-stage <code>node:22</code> image is the base, not the app.</li>
<li>Installing in one <code>RUN</code> and deleting in the next produced a 667MB image; the same work in one <code>RUN</code> produced 243MB.</li>
<li><code>npm prune --omit=dev</code> kept 60MB of Prisma CLI because it is <code>devOptional</code>; check with <code>du</code>, not with faith.</li>
<li>On the course app, multi-stage plus <code>-slim</code> took the download from 489MB to 122MB; everything after that was tens of MB.</li>
<li>On Docker 29, <code>{{.Size}}</code> is the compressed size — re-derive size-gate thresholds after upgrading.</li>
<li>dive's wasted-bytes figure is a lower bound; compare whole images when you want the real cost.</li>
</ul>

<a class="link-card" href="https://github.com/wagoodman/dive" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">dive</span><span class="lc-sub">Layer-by-layer file browser with an efficiency score and a "wasted bytes" figure. <code>--ci</code> mode makes it usable as a build gate. The single most useful tool in this lesson.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/best-practices/#minimize-the-number-of-layers" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">Best practices — image size</span><span class="lc-sub">Docker's own guidance, including the nuanced position on layer count that this lesson agrees with: group by purpose, not by count.</span></span>
</a>
<a class="link-card" href="https://github.com/slimtoolkit/slim" target="_blank" rel="noopener">
  <span class="lc-ico">✂️</span>
  <span class="lc-body"><span class="lc-title">slim (formerly docker-slim)</span><span class="lc-sub">Runs your container, observes which files are actually touched, and rebuilds a minimal image. Impressive results and a real risk of removing something only used on a rare code path — treat its output as something to test hard, not to trust.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: cut it down</span><span class="lc-sub">Graded exercises: find the 188MB nobody expected with <code>dive</code>, take a 1.2GB image under 250MB, add a size gate to CI, and explain why <code>--squash</code> would make the host use more disk, not less.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> deleting files in a later <code>RUN</code> and expecting the image to shrink. <code>RUN apk add python3 make g++</code> followed by <code>RUN apk del python3 make g++</code> leaves the full 188MB in the earlier layer, adds a whiteout layer on top, and makes the image very slightly <em>larger</em> (Lesson 1.2). The same applies to <code>RUN rm -rf /var/lib/apt/lists/*</code> as its own instruction, and to deleting a secret you copied in. Two correct answers: do the install and the cleanup in the <strong>same</strong> <code>RUN</code>, so they net out within one layer; or use a build stage and never copy the tools forward at all — which is better, because it also keeps the cache granularity you would otherwise lose.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Measure before you optimise: <code>docker history</code> and <code>dive</code> find the 400MB directory in ten seconds, and it is usually not where you expected. Multi-stage and pruning production dependencies account for most of the achievable saving; everything after those two is a rounding error. And deleting in a later layer never shrinks anything — clean up inside the same <code>RUN</code>, or never bring the thing into the final stage.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Tìm ra và cắt đi những megabyte</h2>
<p class="lead">Kích thước ảnh đáng quan tâm vì những lý do cụ thể: thời gian kéo ở mọi lần deploy, dung lượng lưu trên mọi máy chủ và trong registry, và bề mặt tấn công. Nhưng rất dễ ném cả một buổi chiều để gọt đi 8MB trong khi một thư mục 400MB nằm chình ình ngay đó. Hãy ĐO trước, rồi đi từ trên xuống theo thứ tự hiệu quả.</p>

<h3>Byte nằm ở đâu</h3>
${slide('dk-06', 14, 'Đo trước khi cắt: docker history chỉ ra byte nằm ở đâu')}
<pre><code>docker history app:1.0 --format 'table {{.Size}}\\t{{.CreatedBy}}' --no-trunc \\
  | head -8 | cut -c1-110</code></pre>
<div class="out">SIZE      CREATED BY
0B        CMD ["node" "dist/index.js"]
412MB     COPY /app/node_modules ./node_modules # buildkit
2.11MB    COPY /app/dist ./dist # buildkit
0B        ENV NODE_ENV=production
188MB     RUN /bin/sh -c apk add --no-cache python3 make g++ # buildkit
185MB     /bin/sh -c #(nop) ADD file:… in /</div>
<pre><code><span class="tok-comment"># dive cho cùng câu trả lời kèm một cây file — cài một lần, dùng mãi</span>
docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock \\
  wagoodman/dive:latest app:1.0 --ci 2&gt;&amp;1 | tail -8</code></pre>
<div class="out">Analyzing image
  efficiency: 71.4 %
  wastedBytes: 214088142 bytes (214 MB)
  userWastedPercent: 28.6 %
Inefficient Files:
Count  Wasted Space  File Path
    2        188 MB  /usr/lib/python3.12
    2         14 MB  /var/cache/apk
    3        9.1 MB  /root/.npm</div>
<p>Hai phát hiện trong mười giây: <code>node_modules</code> nặng 412MB, và một bộ công cụ Python đã được cài rồi gỡ vẫn đang chiếm 188MB ở một tầng bên dưới. Không phát hiện nào hiển nhiên nếu chỉ đọc Dockerfile.</p>


<h3>Đọc docker history từng cột, trên một ảnh bạn dựng lại được</h3>
<p>Output ở trên là của một app lớn hơn. Đây là ảnh một stage của API TypeScript + Prisma ở Bài 6.1, đo trên máy Linux của khoá:</p>
<pre><code class="language-bash">docker history dk06-api:single --format 'table {{.Size}}\\t{{.CreatedBy}}' | cut -c1-100 | head -20</code></pre>
<div class="out">SIZE      CREATED BY
0B        CMD ["node" "dist/index.js"]
12.3kB    RUN /bin/sh -c npm run build # buildkit
16.3MB    RUN /bin/sh -c npx prisma generate # buildkit
170MB     RUN /bin/sh -c npm ci # buildkit
81.9kB    COPY . . # buildkit
0B        WORKDIR /app
0B        CMD ["node"]
0B        ENTRYPOINT ["docker-entrypoint.sh"]
4.1kB     COPY docker-entrypoint.sh /usr/local/bin/ # …
5.38MB    RUN /bin/sh -c set -ex   &amp;&amp; export GNUPGHOME…
0B        ENV YARN_VERSION=1.22.22
208MB     RUN /bin/sh -c ARCH= &amp;&amp; dpkgArch="&#36;(dpkg --p…
0B        ENV NODE_VERSION=22.23.2
53.2kB    RUN /bin/sh -c groupadd --gid 1000 node   &amp;&amp;…
618MB     RUN /bin/sh -c set -ex;  apt-get update;  ap…
191MB     RUN /bin/sh -c set -eux;  apt-get update;  a…
52.7MB    RUN /bin/sh -c set -eux;  apt-get update;  a…
132MB     # debian.sh --arch 'amd64' out/ 'bookworm' '…</div>
<table>
<tr><th>Mảnh</th><th>Làm gì</th></tr>
<tr><td><code>--format 'table {{.Size}}\\t{{.CreatedBy}}'</code></td><td>Chỉ in hai cột: kích thước tầng (đã giải nén) và chỉ thị tạo ra nó. <code>table</code> thêm dòng tiêu đề; <code>\\t</code> là một dấu tab.</td></tr>
<tr><td><code>cut -c1-100</code></td><td>Cắt mỗi dòng ở ký tự thứ 100 để lệnh <code>RUN</code> dài không bị xuống dòng. Dấu <code>…</code> là Docker tự cắt.</td></tr>
<tr><td>Đọc các dòng <strong>TỪ DƯỚI LÊN</strong></td><td>Dòng dưới cùng là tầng đầu tiên của <code>debian:bookworm</code>; dòng trên cùng là chỉ thị cuối của bạn. Mọi thứ bên dưới <code>WORKDIR /app</code> đến cùng với <code>FROM node:22</code>.</td></tr>
<tr><td>Dòng <code>0B</code></td><td>Chỉ là siêu dữ liệu (<code>ENV</code>, <code>CMD</code>, <code>WORKDIR</code>): chúng đổi cấu hình của ảnh, không đổi hệ thống file.</td></tr>
</table>
<p>Cộng lại: bốn tầng Debian/bộ công cụ (132 + 52,7 + 191 + 618MB) cộng chính Node (208MB) là khoảng 1,2GB — <strong>khoảng 85% ảnh đã giải nén là ẢNH NỀN</strong>, và tầng to nhất (618MB trình biên dịch và file header của <code>node:22</code>) là thứ API đang chạy không bao giờ dùng. Đó là lý do bước 2 trong danh sách dưới đây ("đúng ảnh nền") đáng giá hơn mọi mẹo khéo léo trong tầng của chính bạn.</p>

<h3>Tám việc có tác dụng, xếp theo hiệu quả</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Dựng nhiều tầng</span><span class="lz-t">thường cắt 60–85%</span><span class="lz-d">Trình biên dịch, thư viện dev và mã nguồn đơn giản là KHÔNG BAO GIỜ tới được ảnh cuối (Bài 6.1). Không gì sánh được, và mọi thứ bên dưới chỉ là con số làm tròn cho tới khi bạn làm xong cái này.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Đúng ảnh nền</span><span class="lz-t">1,13GB → 224MB → 152MB</span><span class="lz-d">Đầy đủ → slim → distroless. Miễn phí, và tốn một dòng (Bài 6.2). Nhưng đừng đánh đổi tính đúng đắn lấy nó.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Tỉa thư viện production</span><span class="lz-t">thường là 50–70% của node_modules</span><span class="lz-d"><code>npm ci --omit=dev</code> trong một stage riêng, hoặc <code>npm prune --omit=dev</code> ở cuối stage dựng. Là món lớn nhất còn sót lại trong hầu hết ảnh Node.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Dọn bộ đệm NGAY TRONG cùng lệnh RUN</span><span class="lz-t">10–200MB tuỳ trình quản lý gói</span><span class="lz-d"><code>rm -rf /var/lib/apt/lists/*</code>, <code>--no-cache</code> cho apk, <code>--no-cache-dir</code> cho pip. PHẢI là cùng một <code>RUN</code>, không thì mấy byte đó nằm lại ở tầng trước (Bài 1.2).</span></div>
  <div class="lz-step"><span class="lz-k">5 · .dockerignore</span><span class="lz-t">bằng đúng cái mà COPY . . đang lôi vào</span><span class="lz-d">Ngăn <code>node_modules</code>, <code>.git</code> và kết quả build khỏi bị chép vào ngay từ đầu. Đồng thời chữa luôn tốc độ dựng (Bài 4.1).</span></div>
  <div class="lz-step"><span class="lz-k">6 · --no-install-recommends</span><span class="lz-t">30–150MB trên Debian</span><span class="lz-d">apt mặc định kéo về một lượng phần mềm gợi ý đáng ngạc nhiên. Một cái cờ, không có nhược điểm nào.</span></div>
  <div class="lz-step"><span class="lz-k">7 · COPY --chown thay cho RUN chown -R</span><span class="lz-t">tốn tới bằng kích thước thứ bạn vừa chép</span><span class="lz-d">Một lệnh chown đệ quy ghi lại MỌI file vào một tầng mới, làm phình gấp đôi phần đó của ảnh (Bài 4.2).</span></div>
  <div class="lz-step"><span class="lz-k">8 · Chế độ output riêng của framework</span><span class="lz-t">Next.js standalone: cắt ~1GB</span><span class="lz-d"><code>output: 'standalone'</code> của Next, output build của Vite, <code>-ldflags="-s -w"</code> của Go. Hãy kiểm xem framework của bạn có cái nào không — thường chỉ là một dòng cấu hình (Bài 4.5).</span></div>
</div>

<h3>Những gì riêng Node</h3>
${slide('dk-06', 16, 'npm prune vẫn giữ 60 MB Prisma CLI — vì nó là devOptional')}
<pre><code><span class="tok-comment"># Trong node_modules thật ra có gì?</span>
docker run --rm app:1.0 sh -c 'du -sh node_modules; du -sh node_modules/* | sort -hr | head -5'</code></pre>
<div class="out">412M	node_modules
118M	node_modules/@swc
64M	node_modules/typescript
41M	node_modules/@esbuild
22M	node_modules/prisma
19M	node_modules/@prisma</div>
<p><code>@swc</code>, <code>typescript</code> và <code>@esbuild</code> là CÔNG CỤ DỰNG — 223MB trình biên dịch mà máy chủ đang chạy chẳng bao giờ nạp. Chúng nằm trong ảnh vì <code>node_modules</code> của stage dựng đã bị chép nguyên khối (cái bẫy của Bài 6.1). Chú ý <code>prisma</code> so với <code>@prisma</code>: cái CLI là thư viện dev còn cái client thì không, nên tỉa đi là bớt 22MB và giữ lại 19MB bạn cần.</p>
<pre><code><span class="tok-comment"># Cách chữa, dưới dạng một stage riêng</span>
FROM node:22-alpine AS proddeps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

FROM node:22-alpine
COPY --from=proddeps /app/node_modules ./node_modules
COPY --from=build    /app/dist ./dist</code></pre>
<div class="out">app:1.0  612MB
app:1.1  196MB</div>


<h3>60MB mà npm prune vẫn giữ: Prisma CLI là "devOptional"</h3>
<p>Chạy đúng lệnh <code>du</code> đó trên ảnh nhiều stage của app mẫu — cái đã chạy <code>npm prune --omit=dev</code> rồi:</p>
<pre><code class="language-bash">docker run --rm --entrypoint sh dk06-api:multi -c \\
  'du -sh node_modules; du -sh node_modules/* node_modules/.prisma 2&gt;/dev/null | sort -hr | head -5'
docker run --rm --entrypoint sh dk06-api:multi -c \\
  'du -sh node_modules/@prisma/* node_modules/.prisma/client/* 2&gt;/dev/null | sort -hr | head -5'</code></pre>
<div class="out">89M	node_modules
44M	node_modules/@prisma
26M	node_modules/prisma
16M	node_modules/.prisma
396K	node_modules/iconv-lite
284K	node_modules/qs
34M	node_modules/@prisma/engines
16M	node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node
8.2M	node_modules/@prisma/client
1008K	node_modules/@prisma/fetch-engine
696K	node_modules/@prisma/get-platform</div>
<p><code>prisma</code> (CLI, 26MB) và <code>@prisma/engines</code> (engine của CLI, 34MB) nằm trong <code>devDependencies</code> — vậy mà chúng SỐNG SÓT qua lượt tỉa. API đang chạy chỉ cần <code>@prisma/client</code> và engine 16MB trong <code>.prisma/client</code>. Vì sao?</p>
<pre><code class="language-bash">npm ls prisma --omit=dev
grep -A4 '"node_modules/prisma"' package-lock.json | grep devOptional</code></pre>
<div class="out">dk06-api@1.0.0 /…/app
└─┬ @prisma/client@5.22.0
  └─┬ prisma@5.22.0
    └── @prisma/engines@5.22.0
      "devOptional": true,</div>
<p><code>@prisma/client</code> khai <code>prisma</code> là một <em>peer dependency tuỳ chọn</em> (gói ngang hàng tuỳ chọn). Nên npm đánh dấu nó <code>devOptional</code> — "của dev, nhưng cũng có thể được một gói production cần tới" — và <code>--omit=dev</code> GIỮ nó lại. Chẳng có gì hỏng; chỉ là 60MB bạn chở theo ở mọi lần deploy. Nếu migration chạy ở một bước riêng (nên như vậy — Chương 11), hãy tự tay bỏ CLI:</p>
<pre><code class="language-dockerfile">RUN npm prune --omit=dev \\
 &amp;&amp; rm -rf node_modules/prisma node_modules/@prisma/engines node_modules/.bin/prisma</code></pre>
<p>Đo thật: <code>node_modules</code> trong ảnh cuối từ 93MB xuống 30,7MB, và app vẫn trả <code>{"ok":true}</code> khi có một PostgreSQL thật bên cạnh. Bài học chung lớn hơn chuyện Prisma: <strong>"tôi đã chạy prune" không phải là một phép đo</strong>. <code>du</code> mới là phép đo.</p>

<h3>Những gì riêng Python</h3>
<pre><code>FROM python:3.12-slim AS build
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends build-essential libpq-dev \\
 &amp;&amp; rm -rf /var/lib/apt/lists/*
COPY requirements.txt ./
RUN --mount=type=cache,target=/root/.cache/pip \\
    pip install --prefix=/install --no-compile -r requirements.txt

FROM python:3.12-slim
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends libpq5 \\
 &amp;&amp; rm -rf /var/lib/apt/lists/*
COPY --from=build /install /usr/local
COPY . .</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">--prefix=/install</span><span class="v">Cài vào một thư mục mà bạn chép được như MỘT khối, thay vì rải file khắp cái ảnh. Mẫu dựng nhiều tầng tiêu chuẩn của Python.</span></div>
  <div class="kv"><span class="k">build-essential CHỈ ở stage dựng</span><span class="v">150MB trình biên dịch chỉ có ý nghĩa trong lúc dựng wheel. Stage cuối cài thư viện <em>LÚC CHẠY</em> (<code>libpq5</code>), không phải bản dành cho phát triển (<code>libpq-dev</code>).</span></div>
  <div class="kv"><span class="k">--no-compile</span><span class="v">Bỏ qua việc ghi file <code>.pyc</code>, thứ dù sao cũng được sinh lại lúc chạy. Tiết kiệm 10–20% cây site-packages, đổi lại lần import đầu tiên chậm hơn.</span></div>
  <div class="kv"><span class="k">PYTHONDONTWRITEBYTECODE=1</span><span class="v">Chặn container đang chạy ghi <code>.pyc</code> vào tầng ghi được của nó. Nhỏ thôi, và nó giữ cho <code>docker diff</code> còn đọc được (Bài 2.2).</span></div>
</div>

<h3>Ba thứ KHÔNG đáng bận tâm</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ép phẳng các tầng</span><span class="v"><code>--squash</code> là thử nghiệm, và nó PHÁ việc dùng chung tầng: hai ảnh đã ép phẳng từ cùng một nền không chia sẻ gì cả, nên năm dịch vụ vốn dùng chung một nền 185MB giờ ngốn 925MB trên máy chủ. Dựng nhiều tầng đạt được mục tiêu thật mà không phải trả cái giá này.</span></div>
  <div class="kv"><span class="k">Giảm tối đa số tầng</span><span class="v">Tầng gần như miễn phí. Xâu mười lăm câu lệnh vào một <code>RUN</code> không đọc nổi để tiết kiệm vài kilobyte siêu dữ liệu là bạn mất độ mịn của cache (Bài 5.2) và mất luôn khả năng đọc. Hãy gộp theo TẦN SUẤT THAY ĐỔI thay vào đó.</span></div>
  <div class="kv"><span class="k">Alpine khi nó đánh đổi tính đúng đắn</span><span class="v">40MB không đáng một buổi chiều gỡ lỗi musl, một cái numpy biên dịch từ mã nguồn, hay một cú hỏng DNS chập chờn trên production (Bài 6.2). Cứ lấy 40MB đó đi.</span></div>
  <div class="kv"><span class="k">Và MỘT thứ thì ĐÁNG</span><span class="v">Kiểm con số đó trong CI. <code>docker image inspect app --format '{{.Size}}'</code> kèm một ngưỡng sẽ bắt được cái ngày có người thêm một thư viện 300MB, và đó là lúc sửa còn rẻ.</span></div>
</div>
<pre><code><span class="tok-comment"># Một cổng chặn kích thước cho CI</span>
MAX=\$((250 * 1024 * 1024))
SIZE=\$(docker image inspect app:ci --format '{{.Size}}')
echo "kích thước ảnh: \$((SIZE / 1024 / 1024))MB"
[ "\$SIZE" -gt "\$MAX" ] &amp;&amp; { echo "ảnh vượt \$((MAX/1024/1024))MB" &gt;&amp;2; exit 1; }
echo "kích thước ổn"</code></pre>
<div class="out">kích thước ảnh: 196MB
kích thước ổn</div>

<h3>Docker 29 đổi ý nghĩa của .Size — hãy kiểm lại cổng chặn</h3>
${slide('dk-06', 18, 'Docker 29: .Size là bản nén — cổng kích thước phải biết mình đo gì')}
<p>Cổng chặn ở trên được viết khi <code>{{.Size}}</code> còn nghĩa là kích thước đã giải nén. Trên Docker 29 với kho ảnh containerd, nó là kích thước <strong>ĐÃ NÉN</strong> — đúng con số CONTENT SIZE. Đo trên máy Linux:</p>
<pre><code class="language-bash">docker image inspect -f '{{.Size}}' dk06-api:single
docker images dk06-api:single
MAX=\$((250 * 1024 * 1024))
SIZE=\$(docker image inspect dk06-api:gon --format '{{.Size}}')
echo "image size: \$((SIZE / 1024 / 1024))MB"
[ "\$SIZE" -gt "\$MAX" ] &amp;&amp; echo over || echo "size ok"</code></pre>
<div class="out">489064150
IMAGE             ID             DISK USAGE   CONTENT SIZE   EXTRA
dk06-api:single   dd89daa3d63b       1.88GB          489MB
image size: 90MB
size ok</div>
<p>Cùng một script trên cùng một ảnh báo con số chỉ khoảng một phần tư so với trên Docker 27, nên một ngưỡng 250MB từng là chặt nay rất lỏng. Không phải là sai — số byte nén mới là thứ một lượt deploy phải tải — nhưng <strong>sau khi nâng cấp Docker, hãy tính lại ngưỡng</strong> từ số đo hôm nay thay vì tin số của năm ngoái.</p>


<h3>Một ví dụ trước và sau</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Bắt đầu: 1,24GB</span><span class="lz-lnote">Một tầng, <code>node:22</code>, <code>COPY . .</code>, mọi thư viện, bộ đệm npm, mã nguồn, công cụ dựng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nhiều tầng: 612MB</span><span class="lz-lnote">Trình biên dịch và mã nguồn biến mất. Vẫn còn mang theo trọn <code>node_modules</code> của stage dựng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Stage proddeps riêng: 196MB</span><span class="lz-lnote">Chỉ còn thư viện production. Thắng lợi lớn nhất còn lại, và tốn ba dòng Dockerfile.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nền distroless: 152MB</span><span class="lz-lnote">Không shell, không trình quản lý gói, không cả <code>apk</code>. Cộng một người anh em <code>:debug</code> cho lúc bạn cần nhìn (Bài 6.1).</span></div>
  <div class="lz-layer"><span class="lz-lname">Chỗ nó dừng lại</span><span class="lz-lnote">152MB còn lại là môi trường chạy Node và thư viện của bạn. Đi xa hơn nghĩa là đổi ỨNG DỤNG chứ không phải Dockerfile — và đó là một cuộc trò chuyện khác, thường là không đáng có.</span></div>
</div>


<h3>Vẫn cái thang đó, đo trên app mẫu của khoá</h3>
<table>
<tr><th>Bước</th><th>DISK USAGE</th><th>CONTENT SIZE (phải tải)</th><th>Cái gì thay đổi</th></tr>
<tr><td><code>single</code> — <code>node:22</code>, một stage</td><td>1,88GB</td><td>489MB</td><td>Mọi thứ: bộ công cụ, mã nguồn, mọi thư viện</td></tr>
<tr><td><code>naive</code> — hai stage, nguyên <code>node_modules</code></td><td>487MB</td><td>124MB</td><td>Nền <code>node:22-slim</code>, không mã nguồn, không trình biên dịch</td></tr>
<tr><td><code>multi</code> — thêm <code>npm prune</code></td><td>467MB</td><td>122MB</td><td>Mất typescript và @types (Prisma CLI vẫn còn)</td></tr>
<tr><td><code>gon</code> — bỏ thêm Prisma CLI và npm</td><td>377MB</td><td>94,4MB</td><td>node_modules 93MB → 30,7MB</td></tr>
<tr><td><code>distroless</code> — <code>nodejs22-debian12:nonroot</code></td><td>337MB</td><td>91,6MB</td><td>Không shell, không apt (vẫn chở Prisma CLI)</td></tr>
</table>
${slide('dk-06', 17, 'Thang giảm cân của cùng một app: 1,88 GB → 337 MB')}
<p>Hai bước làm gần hết việc: tách stage và đổi ảnh nền. Mọi thứ sau đó chỉ còn vài chục megabyte. Khi tới điểm đó, hãy thôi tối ưu ảnh và nhìn sang chỗ khác.</p>

<h3>Chạy thử từng bước: cài ở RUN này, xoá ở RUN sau</h3>
${slide('dk-06', 15, 'Cài ở RUN này, xoá ở RUN sau: ảnh 667 MB thay vì 243 MB')}
<p>Cái bẫy bên dưới nói xoá ở tầng sau chẳng bao giờ làm nhỏ được gì. Đây là bằng chứng, với hai Dockerfile ba dòng trên máy Linux:</p>
<pre><code class="language-dockerfile"># Dockerfile.hai — hai RUN
FROM node:22-alpine
RUN apk add python3 make g++
RUN apk del python3 make g++

# Dockerfile.mot — một RUN
FROM node:22-alpine
RUN apk add python3 make g++ &amp;&amp; apk del python3 make g++</code></pre>
<pre><code class="language-bash">docker build -f Dockerfile.hai -t dk06-waste:hai .
docker build -f Dockerfile.mot -t dk06-waste:mot .
docker images --format 'table {{.Repository}}:{{.Tag}}\\t{{.Size}}' | grep -E 'REPO|dk06-waste|^node:22-alpine'
docker history dk06-waste:hai --format 'table {{.Size}}\\t{{.CreatedBy}}' | head -4</code></pre>
<div class="out">REPOSITORY:TAG                                                SIZE
dk06-waste:mot                                                243MB
dk06-waste:hai                                                667MB
node:22-alpine                                                237MB
SIZE      CREATED BY
41kB      RUN /bin/sh -c apk del python3 make g++ # bu…
315MB     RUN /bin/sh -c apk add python3 make g++ # bu…
0B        CMD ["node"]</div>
<pre><code class="language-bash">docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
  wagoodman/dive:latest dk06-waste:hai --ci</code></pre>
<div class="out">Image Source: docker://dk06-waste:hai
Extracting image from docker-engine... (this can take a while for large images)
Analyzing image...
  efficiency: 83.3305 %
  wastedBytes: 115089598 bytes (115 MB)
  userWastedPercent: 24.6195 %
Inefficient Files:
Count  Wasted Space  File Path
    2         41 MB  /usr/bin/lto-dump
    2        9.4 MB  /usr/lib/libc.a
    2        7.0 MB  /usr/lib/libstdc++.a
    2        5.4 MB  /usr/lib/libpython3.14.so.1.0
    2        5.0 MB  /var/cache/apk/APKINDEX.9c5ff2cc.tar.gz
…</div>
<table>
<tr><th>Con số</th><th>Đọc thế nào</th></tr>
<tr><td>667MB so với 243MB</td><td>DISK USAGE: tầng <code>apk del</code> chỉ là 41kB dấu xoá (whiteout); 315MB bên dưới nó VẪN nằm trong ảnh, được đẩy và kéo ở mọi lần deploy.</td></tr>
<tr><td>243MB của ảnh một RUN</td><td>Chỉ hơn <code>node:22-alpine</code> 6MB: cài và xoá triệt tiêu nhau ngay trong một tầng. (Phần còn lại chủ yếu là danh mục apk, vì không dùng <code>--no-cache</code> — thêm một bài học nữa trong cùng một bức tranh.)</td></tr>
<tr><td><code>wastedBytes: 115 MB</code></td><td>dive đếm những file xuất hiện ở hai tầng (thêm vào rồi bị xoá hoặc ghi đè). Đó là <em>CẬN DƯỚI</em>: nó liệt kê 115MB trong khi chênh lệch thật giữa hai ảnh là hơn 300MB đã giải nén.</td></tr>
<tr><td><code>--ci</code></td><td>Chế độ không tương tác: in phân tích rồi thoát với mã đạt/không đạt, để chạy được trong pipeline.</td></tr>
</table>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> lượt deploy của nhóm lên một VPS 20GB hỏng với <code>no space left on device</code>, và hoá ra ảnh backend nặng 1,1GB. Việc của bạn: tìm xem byte nằm ở đâu TRƯỚC khi đụng vào bất cứ thứ gì, rồi cắt theo thứ tự hiệu quả.</p><ol>
<li>Chọn ảnh backend của chính bạn, hoặc dựng lại <code>thu-api:single</code> ở bài thực hành 6.1. Chạy <code>docker history &lt;ảnh&gt; --format 'table {{.Size}}\\t{{.CreatedBy}}'</code> và ghi lại ba tầng to nhất, tầng nào đến từ ảnh nền.</li>
<li>Chạy <code>dive &lt;ảnh&gt; --ci</code> (lệnh container trong bài này) và ghi lại <code>wastedBytes</code>.</li>
<li>Bên trong ảnh chạy <code>du -sh node_modules/* | sort -hr | head</code>. Có thứ gì chỉ là công cụ build không (typescript, @swc, prisma CLI, esbuild)?</li>
<li>Chỉ áp hai cách sửa lớn nhất — nhiều stage và <code>-slim</code> — dựng lại, rồi so CONTENT SIZE trước và sau.</li>
<li>Thêm cổng chặn kích thước của bài với ngưỡng cao hơn <code>.Size</code> mới của bạn 20%, và xác nhận nó in <code>size ok</code>.</li></ol>
<p><strong>Đạt khi:</strong> bạn có bảng trước/sau gồm CONTENT SIZE và DISK USAGE, gọi được tên tầng to nhất và nó có phải từ ảnh nền không, và cổng chặn qua được với ảnh mới nhưng hỏng nếu bạn đặt ngưỡng thấp hơn nó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">docker history (lịch sử tầng)</span><span class="v">Liệt kê các tầng của ảnh từ mới tới cũ, kèm kích thước và chỉ thị đã tạo ra từng tầng.</span></div>
  <div class="kv"><span class="k">dive (công cụ soi tầng)</span><span class="v">Công cụ duyệt ảnh theo từng tầng và báo những file thêm ở tầng này rồi bị xoá hoặc ghi đè ở tầng khác.</span></div>
  <div class="kv"><span class="k">Wasted bytes (byte lãng phí)</span><span class="v">Ước lượng của dive về số byte được chở đi nhưng không còn thấy trong hệ thống file cuối — chỉ là cận dưới.</span></div>
  <div class="kv"><span class="k">Whiteout (dấu xoá)</span><span class="v">File đánh dấu che một đường dẫn của tầng dưới; xoá không bao giờ gỡ được byte (Bài 1.2).</span></div>
  <div class="kv"><span class="k">devOptional (dev-tuỳ-chọn)</span><span class="v">Cờ của npm cho một gói dev mà một gói production cũng có thể cần; <code>--omit=dev</code> vẫn giữ nó.</span></div>
  <div class="kv"><span class="k">Content size / disk usage (dung lượng nén / trên đĩa)</span><span class="v">Số byte nén phải tải so với byte nén + đã giải nén nằm trên máy chủ (Docker 29).</span></div>
  <div class="kv"><span class="k">Size gate (cổng chặn kích thước)</span><span class="v">Một bước CI làm hỏng lượt dựng khi ảnh lớn quá một ngưỡng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đo trước đã: <code>docker history</code> cho thấy khoảng 85% một ảnh <code>node:22</code> một stage là ẢNH NỀN, không phải app.</li>
<li>Cài ở một <code>RUN</code> rồi xoá ở <code>RUN</code> sau cho ảnh 667MB; cùng việc đó trong một <code>RUN</code> cho 243MB.</li>
<li><code>npm prune --omit=dev</code> giữ lại 60MB Prisma CLI vì nó là <code>devOptional</code>; kiểm bằng <code>du</code>, đừng kiểm bằng niềm tin.</li>
<li>Với app mẫu, nhiều stage cộng <code>-slim</code> đưa dung lượng tải từ 489MB xuống 122MB; mọi thứ sau đó chỉ còn vài chục MB.</li>
<li>Trên Docker 29, <code>{{.Size}}</code> là kích thước ĐÃ NÉN — hãy tính lại ngưỡng cổng chặn sau khi nâng cấp.</li>
<li>Con số byte lãng phí của dive là cận dưới; muốn biết giá thật thì so nguyên hai ảnh.</li>
</ul>

<a class="link-card" href="https://github.com/wagoodman/dive" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">dive</span><span class="lc-sub">Trình duyệt file theo từng tầng kèm điểm hiệu quả và con số "byte lãng phí". Chế độ <code>--ci</code> khiến nó dùng được làm một cổng chặn lúc dựng. Công cụ hữu ích nhất trong bài này.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/best-practices/#minimize-the-number-of-layers" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">Thực hành tốt — kích thước ảnh</span><span class="lc-sub">Hướng dẫn của chính Docker, gồm cả lập trường tinh tế về số tầng mà bài này đồng tình: gộp theo MỤC ĐÍCH, không theo số lượng.</span></span>
</a>
<a class="link-card" href="https://github.com/slimtoolkit/slim" target="_blank" rel="noopener">
  <span class="lc-ico">✂️</span>
  <span class="lc-body"><span class="lc-title">slim (trước là docker-slim)</span><span class="lc-sub">Chạy container của bạn, quan sát xem những file nào thật sự bị đụng tới, rồi dựng lại một cái ảnh tối giản. Kết quả ấn tượng và có rủi ro THẬT là gỡ mất thứ chỉ dùng ở một nhánh mã hiếm gặp — hãy coi output của nó là thứ phải TEST kỹ, không phải thứ để tin.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: cắt nó xuống</span><span class="lc-sub">Bài chấm điểm: tìm ra 188MB không ai ngờ tới bằng <code>dive</code>, đưa một ảnh 1,2GB xuống dưới 250MB, thêm một cổng chặn kích thước vào CI, và giải thích vì sao <code>--squash</code> lại khiến máy chủ tốn NHIỀU đĩa hơn chứ không ít đi.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> xoá file ở một lệnh <code>RUN</code> phía sau rồi mong cái ảnh nhỏ đi. <code>RUN apk add python3 make g++</code> rồi tới <code>RUN apk del python3 make g++</code> để lại trọn 188MB ở tầng trước, thêm một tầng whiteout lên trên, và làm cho ảnh LỚN HƠN một chút (Bài 1.2). Điều tương tự áp cho <code>RUN rm -rf /var/lib/apt/lists/*</code> đứng riêng một chỉ thị, và cho việc xoá một bí mật bạn vừa chép vào. Hai câu trả lời đúng: làm phần cài và phần dọn trong <strong>CÙNG</strong> một <code>RUN</code>, để chúng bù trừ trong một tầng; hoặc dùng một stage dựng và HOÀN TOÀN không chép mấy công cụ đó sang — cái này tốt hơn, vì nó còn giữ được độ mịn của cache mà cách kia làm bạn mất.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Hãy ĐO trước khi tối ưu: <code>docker history</code> và <code>dive</code> tìm ra cái thư mục 400MB trong mười giây, và nó thường không nằm ở chỗ bạn tưởng. Dựng nhiều tầng và tỉa thư viện production chiếm phần lớn khoản tiết kiệm khả dĩ; mọi thứ sau hai cái đó chỉ là con số làm tròn. Và xoá ở một tầng phía sau KHÔNG BAO GIỜ làm nhỏ được thứ gì — hãy dọn ngay trong cùng lệnh <code>RUN</code>, hoặc đừng bao giờ đem cái thứ đó vào stage cuối.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.4 ─────────────────────────── */
    {
      title: '6.4 — Running a container safely|||6.4 — Chạy một container cho an toàn',
      slug: 'dk-6-4-chay-an-toan',
      type: 'LESSON',
      description: 'Chạy dưới người dùng không phải root, hệ thống file gốc chỉ đọc, bỏ capability, no-new-privileges, seccomp, và chính xác thì --privileged với việc gắn docker.sock trao đi cái gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Running a container safely</h2>
<p class="lead">By default a container runs as root, can write anywhere in its filesystem, and holds a set of Linux capabilities most applications never use. None of that stops the app working — and each is a step an attacker who gets code execution would otherwise have to earn. Six flags remove them, and none of them cost anything.</p>

<h3>Start with the user</h3>
${slide('dk-06', 19, 'Năm lớp khoá quanh tiến trình — mỗi lớp chặn một bước của kẻ tấn công')}
<pre><code>docker run --rm alpine id
docker run --rm -u 1000:1000 alpine id
docker run --rm node:22-alpine id node</code></pre>
<div class="out">uid=0(root) gid=0(root) groups=0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)
uid=1000 gid=1000 groups=1000
uid=1000(node) gid=1000(node) groups=1000(node)</div>
<pre><code># In the Dockerfile — the durable fix (Lesson 4.2)
FROM node:22-alpine
<span class="tok-comment"># … build steps that need root …</span>
USER node
CMD ["node", "dist/index.js"]

<span class="tok-comment"># Or create one explicitly, with a fixed numeric UID</span>
RUN addgroup -g 10001 app &amp;&amp; adduser -u 10001 -G app -D -H app
USER 10001:10001</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Why it matters despite the container boundary</span><span class="v">There is no user namespace by default (Lesson 1.1), so UID 0 inside is UID 0 outside. A container escape from a root process lands on the host as root; from UID 10001 it lands as a user that owns nothing.</span></div>
  <div class="kv"><span class="k">Use a numeric UID</span><span class="v"><code>USER 10001:10001</code> rather than <code>USER app</code>. Kubernetes' <code>runAsNonRoot</code> check reads the numeric value from the image config and rejects a name it cannot resolve; numeric also survives being run with a different <code>--user</code>.</span></div>
  <div class="kv"><span class="k">Pick a high UID</span><span class="v">Above 10000 avoids colliding with a host user, which matters for bind-mounted files (Lesson 2.4). Official images use 1000, which is also the first human user on most Linux systems.</span></div>
  <div class="kv"><span class="k">Ports below 1024 need a capability</span><span class="v">A non-root process cannot bind port 80. Listen on 8080 and publish it as <code>-p 80:8080</code>, which is better anyway — or add <code>--cap-add=NET_BIND_SERVICE</code> if you truly must.</span></div>
  <div class="kv"><span class="k">Directories must be writable by that UID</span><span class="v"><code>COPY --chown=10001:10001</code> as you copy (Lesson 4.2). A container that starts as root and then drops is a different, worse pattern — use <code>USER</code> and get it right at build time.</span></div>
</div>

<h3>A read-only root filesystem</h3>
<pre><code>docker run --rm --read-only alpine sh -c 'touch /tmp/x' 2&gt;&amp;1 | head -1
docker run --rm --read-only --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  alpine sh -c 'touch /tmp/x &amp;&amp; echo writable'</code></pre>
<div class="out">touch: /tmp/x: Read-only file system
writable</div>
<pre><code><span class="tok-comment"># A real service: read-only, with writable paths declared explicitly</span>
docker run -d --name web \\
  --read-only \\
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  --tmpfs /var/cache/nginx:rw,size=32m \\
  --tmpfs /var/run:rw,size=8m \\
  -p 8080:80 nginx:1.27-alpine
curl -s -o /dev/null -w '%{http_code}\\n' localhost:8080
docker inspect web --format 'readonly={{.HostConfig.ReadonlyRootfs}}'</code></pre>
<div class="out">200
readonly=true</div>

<h3>Run it step by step: find the paths nginx must write</h3>
${slide('dk-06', 20, '--read-only: nginx chết vì không ghi được — tmpfs khai đúng chỗ là sống')}
<p>Where did the three <code>--tmpfs</code> paths above come from? Not from a blog post — from letting the container fail and reading the error. On the course Mac (Docker Desktop 4.91), ports in this chapter's range:</p>
<pre><code class="language-bash">docker run -d --name dk06-web2 --read-only -p 18062:80 nginx:1.27-alpine
sleep 2
docker ps -a --filter name=dk06-web2 --format '{{.Names}} {{.Status}}'
docker logs dk06-web2 2&gt;&amp;1 | tail -2</code></pre>
<div class="out">dk06-web2 Exited (1) 2 seconds ago
2026/09/23 15:11:57 [emerg] 1#1: mkdir() "/var/cache/nginx/client_temp" failed (30: Read-only file system)
nginx: [emerg] mkdir() "/var/cache/nginx/client_temp" failed (30: Read-only file system)</div>
<p>First missing path: <code>/var/cache/nginx</code>. Add a tmpfs for it, run again, read the next error; repeat until it starts. For nginx the list ends at three:</p>
<pre><code class="language-bash">docker run -d --name dk06-web --read-only \\
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  --tmpfs /var/cache/nginx:rw,size=32m \\
  --tmpfs /var/run:rw,size=8m \\
  -p 18061:80 nginx:1.27-alpine
curl -s -o /dev/null -w '%{http_code}\\n' localhost:18061
docker logs dk06-web 2&gt;&amp;1 | grep -i "read-only"</code></pre>
<div class="out">200
10-listen-on-ipv6-by-default.sh: info: can not modify /etc/nginx/conf.d/default.conf (read-only file system?)</div>
<table>
<tr><th>Option</th><th>Meaning</th></tr>
<tr><td><code>--read-only</code></td><td>Mount the container's root filesystem read-only. Volumes and tmpfs mounts stay writable.</td></tr>
<tr><td><code>--tmpfs /tmp:rw,noexec,nosuid,size=64m</code></td><td>A RAM-backed folder at <code>/tmp</code>: writable (<code>rw</code>), nothing in it can be executed (<code>noexec</code>), setuid bits are ignored (<code>nosuid</code>), and it cannot grow past 64MB (<code>size</code>). Contents vanish when the container stops.</td></tr>
<tr><td>The <code>info: can not modify …</code> line</td><td>Harmless: nginx's entrypoint tries to add an IPv6 listen line, notices the file is read-only, and carries on. Read-only flushes out every such "helpful" write — decide for each whether it matters.</td></tr>
</table>
<p>Two rules for your own app: logs go to stdout (never to a file in the image), and anything that must survive a restart goes to a <strong>volume</strong>, not a tmpfs (Chapter 7). If you would rather list the paths than discover them one by one, run the app normally for a while and use <code>docker diff</code> (Lesson 2.2) — every <code>A</code> and <code>C</code> line is a path it writes.</p>

<div class="callout ok"><strong><code>--read-only</code> is the highest-value hardening flag after non-root.</strong> Most attacks need to write something: a web shell, a downloaded binary, a modified config. A read-only root filesystem blocks all of that, and the cost is enumerating the handful of paths your application legitimately writes — which is a useful exercise in itself, because the answer is often "nothing, once logs go to stdout". Find them with <code>docker diff</code> after a normal run (Lesson 2.2).</div>

<h3>Capabilities</h3>
${slide('dk-06', 21, 'Capability: mặc định 14 cái, --cap-drop=ALL còn 0')}
<pre><code>docker run --rm alpine sh -c 'apk add -q libcap; capsh --print | head -2' 2&gt;/dev/null
docker run --rm --cap-drop=ALL alpine sh -c 'apk add -q libcap; capsh --print | head -2' 2&gt;/dev/null</code></pre>
<div class="out">Current: cap_chown,cap_dac_override,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_net_bind_service,cap_net_raw,cap_sys_chroot,cap_mknod,cap_audit_write,cap_setfcap=ep
Current: =</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Docker already drops most of them</span><span class="v">Of Linux's ~40 capabilities, a container gets 14. That default is a large part of why containers are safer than running as root on the host.</span></div>
  <div class="kv"><span class="k">--cap-drop=ALL is the right starting point</span><span class="v">Then add back only what fails. Most web applications need none at all — they open a socket above 1024 and read files they own.</span></div>
  <div class="kv"><span class="k">CAP_NET_BIND_SERVICE</span><span class="v">The one you might genuinely need: binding a port below 1024 as a non-root user. Prefer publishing a high port instead.</span></div>
  <div class="kv"><span class="k">CAP_NET_RAW is worth dropping specifically</span><span class="v">It allows raw sockets — ARP spoofing and packet crafting on the container network. It is in the default set and almost nothing needs it. <em>Correction (measured 09/2026):</em> dropping it no longer costs you <code>ping</code> — Docker sets <code>net.ipv4.ping_group_range</code> in every container so ping uses an unprivileged ICMP socket. It costs <code>tcpdump</code> and other raw-packet tools, which is exactly what you want.</span></div>
  <div class="kv"><span class="k">CAP_SYS_ADMIN is the dangerous one</span><span class="v">Often described as "almost root". Anything asking for it deserves scrutiny — it is the capability most container escapes rely on.</span></div>
</div>


<h3>Check it yourself: what a process actually holds, in /proc</h3>
<p>Flags on the command line are intentions; <code>/proc/self/status</code> inside the container is what the kernel actually enforces. Three lines matter:</p>
<pre><code class="language-bash">docker run --rm alpine grep -E "CapEff|NoNewPrivs|Seccomp:" /proc/self/status
docker run --rm --cap-drop=ALL --security-opt no-new-privileges:true \\
  alpine grep -E "CapEff|NoNewPrivs|Seccomp:" /proc/self/status
docker run --rm --security-opt seccomp=unconfined alpine grep "Seccomp:" /proc/self/status</code></pre>
<div class="out">CapEff:	00000000a80425fb
NoNewPrivs:	0
Seccomp:	2
CapEff:	0000000000000000
NoNewPrivs:	1
Seccomp:	2
Seccomp:	0</div>
<table>
<tr><th>Field</th><th>How to read it</th></tr>
<tr><td><code>CapEff</code></td><td>The effective capabilities as a hex bitmask. <code>a80425fb</code> is Docker's default 14; all zeros means none. <code>capsh --decode=00000000a80425fb</code> turns it back into names.</td></tr>
<tr><td><code>NoNewPrivs: 1</code></td><td>No process in this container can gain privileges through a setuid binary. It is <strong>0 by default</strong> — you must ask for it.</td></tr>
<tr><td><code>Seccomp: 2</code></td><td>A seccomp filter is active (2 = filter mode). <code>0</code> means no filter at all — what <code>seccomp=unconfined</code> gives you.</td></tr>
</table>
<p>And the <code>ping</code> surprise, on the Linux machine: with <code>NET_RAW</code> dropped, ping still works, while a real raw-socket tool does not.</p>
<pre><code class="language-bash">docker run --rm --cap-drop=NET_RAW alpine sh -c 'ping -c1 -W2 1.1.1.1 | tail -1; cat /proc/sys/net/ipv4/ping_group_range'
docker run --rm --cap-drop=NET_RAW alpine sh -c 'apk add -q tcpdump &gt;/dev/null 2&gt;&amp;1; tcpdump -c1 -i eth0 2&gt;&amp;1 | tail -1'</code></pre>
<div class="out">round-trip min/avg/max = 30.325/30.325/30.325 ms
0	2147483647
(Attempt to create packet socket failed - CAP_NET_RAW may be required)</div>

<h3>The whole set, together</h3>
${slide('dk-06', 22, 'Trọn bộ cờ an toàn — và vòng lặp kiểm mọi container')}
<pre><code>docker run -d --name hardened \\
  --user 10001:10001 \\
  --read-only \\
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  --cap-drop=ALL \\
  --security-opt no-new-privileges:true \\
  --pids-limit 200 \\
  --memory 512m --cpus 1 \\
  -p 127.0.0.1:8080:8080 \\
  app:1.4.2

docker inspect hardened --format \\
  'user={{.Config.User}} ro={{.HostConfig.ReadonlyRootfs}} caps={{.HostConfig.CapDrop}} opts={{.HostConfig.SecurityOpt}}'</code></pre>
<div class="out">user=10001:10001 ro=true caps=[ALL] opts=[no-new-privileges:true]</div>
<pre><code><span class="tok-comment"># The same thing in Compose (Chapter 9)</span>
services:
  api:
    image: app:1.4.2
    user: "10001:10001"
    read_only: true
    tmpfs: [ "/tmp:rw,noexec,nosuid,size=64m" ]
    cap_drop: [ ALL ]
    security_opt: [ "no-new-privileges:true" ]
    pids_limit: 200
    ports: [ "127.0.0.1:8080:8080" ]</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">no-new-privileges</span><span class="v">Prevents a process gaining privileges through a setuid binary, which is how many privilege-escalation exploits work. No downside for a normal application; turn it on everywhere.</span></div>
  <div class="kv"><span class="k">seccomp is on by default</span><span class="v">Docker applies a profile blocking about 44 syscalls, including <code>mount</code>, <code>kexec_load</code> and <code>ptrace</code> (until 20.10 relaxed the last one). Never pass <code>--security-opt seccomp=unconfined</code> in production; if a tool needs it, that tool needs scrutiny.</span></div>
  <div class="kv"><span class="k">Limits are security too</span><span class="v"><code>--memory</code>, <code>--cpus</code> and <code>--pids-limit</code> stop one compromised or buggy container from denying service to everything else on the host (Lesson 2.5).</span></div>
  <div class="kv"><span class="k">Bind to loopback</span><span class="v"><code>-p 127.0.0.1:8080:8080</code> so a reverse proxy is the only way in, and Docker's iptables rules cannot accidentally expose it past your firewall (Lesson 2.1).</span></div>
</div>


<h3>Every flag of the hardened run, explained — and proven</h3>
<table>
<tr><th>Flag</th><th>What it stops</th><th>Cost</th></tr>
<tr><td><code>--user 10001:10001</code></td><td>An escape landing on the host as root; writing to root-owned files in the image</td><td>Files the app writes must be owned by that UID</td></tr>
<tr><td><code>--read-only</code></td><td>Dropping a web shell, replacing a binary, editing config</td><td>List the paths that need writes as tmpfs/volumes</td></tr>
<tr><td><code>--tmpfs /tmp:…noexec…</code></td><td>Running anything downloaded into <code>/tmp</code></td><td>None for normal apps</td></tr>
<tr><td><code>--cap-drop=ALL</code></td><td>chown, raw sockets, binding &lt; 1024, changing UID…</td><td>Add back one by one if something fails</td></tr>
<tr><td><code>--security-opt no-new-privileges:true</code></td><td>Privilege gain through setuid binaries</td><td>None</td></tr>
<tr><td><code>--pids-limit 200</code></td><td>A fork bomb taking down the host</td><td>None unless the app spawns hundreds of processes</td></tr>
<tr><td><code>--memory</code> · <code>--cpus</code></td><td>One container starving the others (Lesson 1.1)</td><td>Pick numbers from real usage</td></tr>
<tr><td><code>-p 127.0.0.1:…</code></td><td>Exposure past the firewall through Docker's own iptables rules</td><td>Only a proxy on the same host can reach it</td></tr>
</table>
<p>Proof on the course Mac, with a one-line Node server standing in for the app (the <code>app:1.4.2</code> above is illustrative):</p>
<pre><code class="language-bash">docker run -d --name dk06-hardened \\
  --user 10001:10001 --read-only --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  --cap-drop=ALL --security-opt no-new-privileges:true --pids-limit 200 \\
  --memory 256m --cpus 1 -p 127.0.0.1:18060:8080 \\
  node:22-alpine node -e "require('http').createServer((q,r)=&gt;r.end('ok\\n')).listen(8080)"
curl -s localhost:18060
docker inspect dk06-hardened --format 'user={{.Config.User}} ro={{.HostConfig.ReadonlyRootfs}} caps={{.HostConfig.CapDrop}} opts={{.HostConfig.SecurityOpt}} pids={{.HostConfig.PidsLimit}} mem={{.HostConfig.Memory}}'
docker exec dk06-hardened sh -c 'id; touch /app.txt; touch /tmp/ok &amp;&amp; echo tmp-ok'</code></pre>
<div class="out">ok
user=10001:10001 ro=true caps=[ALL] opts=[no-new-privileges:true] pids=200 mem=268435456
uid=10001 gid=10001 groups=10001
touch: /app.txt: Read-only file system
tmp-ok</div>
<p>The app works; the attacker's first two moves (write somewhere, become root) do not.</p>

<h3>The two things that give everything away</h3>
${slide('dk-06', 23, '--privileged hay gắn docker.sock = trao chìa khoá root của máy chủ')}
<pre><code><span class="tok-comment"># 1 · --privileged: all capabilities, all devices, no seccomp, no AppArmor</span>
docker run --rm --privileged alpine sh -c 'ls /dev | wc -l; head -c 40 /dev/sda1' 2&gt;&amp;1 | head -2

<span class="tok-comment"># 2 · the Docker socket: control of the daemon is control of the host</span>
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock docker:cli \\
  run --rm -v /:/host alpine chroot /host id</code></pre>
<div class="out">436
uid=0(root) gid=0(root) groups=0(root)</div>
<div class="callout warn"><strong>Both of those are root on the host, with extra steps.</strong> <code>--privileged</code> hands the container every capability and every device — it can read the raw disk, load kernel modules, and reconfigure the network. Mounting <code>docker.sock</code> is arguably worse because it looks harmless: any process that can talk to the daemon can start a new container that mounts <code>/</code> and gives itself a root shell, which is exactly what the second command demonstrates. Both are sometimes necessary — a CI runner that builds images, a monitoring agent — and both should be treated as "this container is root on this machine", with the same care you would give a root shell. For the CI case, a rootless builder or a socket proxy that whitelists API endpoints is a real alternative.</div>


<p><strong>Re-run on the course Mac (09/2026).</strong> On Docker Desktop the "host" is the Linux VM that runs the engine, so these numbers describe that VM:</p>
<pre><code class="language-bash">docker run --rm alpine sh -c 'ls /dev | wc -l'
docker run --rm --privileged alpine sh -c 'ls /dev | wc -l; ls /dev | grep -E "^(vda|sda|nvme)" | head -3'
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock docker:cli \\
  run --rm -v /:/host alpine chroot /host sh -c 'id'</code></pre>
<div class="out">15
169
vda
vda1
uid=0(root) gid=0(root) groups=0(root),1(daemon),2(bin),3(sys),4(adm),6(disk),10(uucp),11,20(dialout),26(tape),27(sudo)</div>
<table>
<tr><th>Use case that asks for it</th><th>Safer alternative</th></tr>
<tr><td>CI job that runs <code>docker build</code></td><td>BuildKit in rootless mode, or a remote builder; never mount the socket of a production host into CI</td></tr>
<tr><td>Traefik / a dashboard that lists containers</td><td><code>docker-socket-proxy</code> allowing read-only <code>GET /containers</code> only</td></tr>
<tr><td>"The tool says it needs --privileged"</td><td>Find the one capability or device it really needs (<code>--cap-add</code>, <code>--device</code>) and grant only that</td></tr>
</table>

<h3>A checklist you can run</h3>
<pre><code>for c in \$(docker ps --format '{{.Names}}'); do
  docker inspect "\$c" --format '{{.Name}}
    user:      {{if .Config.User}}{{.Config.User}}{{else}}ROOT (!){{end}}
    readonly:  {{.HostConfig.ReadonlyRootfs}}
    privileged:{{.HostConfig.Privileged}}
    capdrop:   {{.HostConfig.CapDrop}}
    secopt:    {{.HostConfig.SecurityOpt}}
    memory:    {{.HostConfig.Memory}}
    sock:      {{range .Mounts}}{{if eq .Source "/var/run/docker.sock"}}MOUNTED (!){{end}}{{end}}'
done</code></pre>
<div class="out">/api
    user:      10001:10001
    readonly:  true
    privileged:false
    capdrop:   [ALL]
    secopt:    [no-new-privileges:true]
    memory:    536870912
    sock:
/legacy-worker
    user:      ROOT (!)
    readonly:  false
    privileged:false
    capdrop:   []
    secopt:    []
    memory:    0
    sock:      MOUNTED (!)</div>


<p>Real output of the same loop on the course Mac, restricted to this chapter's containers with <code>docker ps --filter name=dk06-</code> (a deliberately bad <code>dk06-legacy</code> with the socket mounted, the hardened one, and the read-only nginx):</p>
<div class="out">/dk06-legacy
    user:      ROOT (!)
    readonly:  false
    privileged:false
    capdrop:   []
    secopt:    []
    memory:    0
    sock:      MOUNTED (!)
/dk06-hardened
    user:      10001:10001
    readonly:  true
    privileged:false
    capdrop:   [ALL]
    secopt:    [no-new-privileges:true]
    memory:    268435456
    sock:
/dk06-web
    user:      ROOT (!)
    readonly:  true
    privileged:false
    capdrop:   []
    secopt:    []
    memory:    0
    sock:      </div>
<p>Notice <code>dk06-web</code>: read-only, yet flagged ROOT. The official nginx image starts its master process as root and drops to the <code>nginx</code> user only for workers. That is a real finding, and the fix is an image built to run unprivileged (for example <code>nginxinc/nginx-unprivileged</code>, listening on 8080), not a flag.</p>

<h3>Reducing what a compromised container can reach</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Drop root first</span><span class="lz-d"><code>USER node</code>. A process that is not root cannot write outside its own files, load kernel modules, or bind a privileged port — most of the escalation paths close here.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Make the root filesystem read-only</span><span class="lz-d"><code>--read-only</code> plus a <code>tmpfs</code> for the paths that genuinely need writes. An attacker who lands cannot leave anything behind.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Drop capabilities to what is used</span><span class="lz-d"><code>--cap-drop ALL</code>, then add back the one or two the process actually needs. Most application containers need none.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Then check what you left open</span><span class="lz-d"><code>--privileged</code>, a mounted Docker socket, or the host network each undo everything above in one flag.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> before the SWP391 final demo, your lecturer asks "if someone finds an RCE in your API, what can they do to the server?" Answer with evidence, not opinions.</p><ol>
<li>Run your API image (or <code>node:22-alpine</code> with the one-line server from this lesson) normally, and audit it with the checklist loop. Write down every <code>(!)</code>.</li>
<li>Read <code>/proc/self/status</code> inside it: <code>docker exec &lt;c&gt; grep -E "CapEff|NoNewPrivs|Seccomp:" /proc/self/status</code>.</li>
<li>Start it again with <code>--read-only</code> only. If it fails, read the log, add a <code>--tmpfs</code> for the path it names, and repeat until it runs.</li>
<li>Add <code>--user 10001:10001 --cap-drop=ALL --security-opt no-new-privileges:true --pids-limit 200</code>, then prove the app still answers with <code>curl</code> and that <code>touch /x</code> inside it fails.</li>
<li>Clean up with <code>docker rm -f</code> on the names you used.</li></ol>
<p><strong>Done when:</strong> the audit shows no <code>ROOT (!)</code> and no <code>MOUNTED (!)</code> for your container, <code>CapEff</code> is all zeros, <code>NoNewPrivs</code> is 1, the app still returns 200, and you can list the exact paths it needed as tmpfs.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Non-root user</span><span class="v">Running the main process with a UID other than 0, set by <code>USER</code> or <code>--user</code>.</span></div>
  <div class="kv"><span class="k">Read-only root filesystem</span><span class="v"><code>--read-only</code>: nothing in the image can be modified; only tmpfs and volumes are writable.</span></div>
  <div class="kv"><span class="k">tmpfs</span><span class="v">A RAM-backed mount; fast, size-limited, and emptied when the container stops.</span></div>
  <div class="kv"><span class="k">Capability</span><span class="v">One slice of root's power (bind low ports, raw sockets, chown…); Docker grants 14 by default.</span></div>
  <div class="kv"><span class="k">no-new-privileges</span><span class="v">A kernel flag that stops setuid binaries from raising privileges; off by default.</span></div>
  <div class="kv"><span class="k">seccomp</span><span class="v">A filter on system calls; Docker's default profile blocks about 44 of 300+.</span></div>
  <div class="kv"><span class="k">--privileged</span><span class="v">All capabilities, all devices, no seccomp or AppArmor — effectively root on the host.</span></div>
  <div class="kv"><span class="k">docker.sock</span><span class="v">The daemon's API socket; whoever can talk to it can start a container that mounts <code>/</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>No user namespace by default: root in the container is root on the host, so use a high numeric <code>USER</code>.</li>
<li>Find the paths an app must write by running it with <code>--read-only</code> and reading the errors; nginx needed exactly three tmpfs mounts.</li>
<li>Docker's default is 14 capabilities; <code>--cap-drop=ALL</code> makes <code>CapEff</code> all zeros, and dropping <code>NET_RAW</code> no longer breaks ping.</li>
<li><code>NoNewPrivs</code> is 0 unless you ask; seccomp is on (<code>Seccomp: 2</code>) unless you disable it.</li>
<li><code>--privileged</code> exposed 169 device nodes instead of 15; a mounted <code>docker.sock</code> gave <code>uid=0</code> on the host in one command.</li>
<li>Check <code>/proc/self/status</code> and <code>docker inspect</code> — flags you meant to set are not proof they are set.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/security/seccomp/" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Seccomp security profiles for Docker</span><span class="lc-sub">The default profile, the list of blocked system calls ("around 44 system calls out of 300+"), and how to run with a custom profile instead of <code>unconfined</code>.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/capabilities.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">capabilities(7) — Linux manual page</span><span class="lc-sub">What every capability allows. Look up any <code>--cap-add</code> a tool asks for before you grant it.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/security/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">Docker security</span><span class="lc-sub">The default capability set, the seccomp profile, what the daemon attack surface is, and an honest account of what the container boundary does and does not protect.</span></span>
</a>
<a class="link-card" href="https://github.com/docker/docker-bench-security" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">docker-bench-security</span><span class="lc-sub">A script that audits a host and its containers against the CIS Docker Benchmark. Run it once on any server you own; the output is a to-do list.</span></span>
</a>
<a class="link-card" href="https://github.com/Tecnativa/docker-socket-proxy" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">docker-socket-proxy</span><span class="lc-sub">If something genuinely needs the socket — Traefik, a monitoring agent — this fronts it and allows only the endpoints you list. Much better than handing over root.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: harden it</span><span class="lc-sub">Graded exercises: make a container run read-only and find the paths it actually writes, drop all capabilities and add back only what breaks, audit five running containers, and demonstrate why a mounted socket is root.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> adding <code>USER node</code> to an image whose application writes to a directory owned by root. The build succeeds, the image is smaller and safer on paper, and the container dies at start with <code>EACCES: permission denied, open '/app/logs/app.log'</code> — or worse, starts fine and fails hours later on the first write. Two things prevent it: <code>COPY --chown</code> every path the app owns, and run the container once with <code>--read-only</code> before shipping, because anything that needs to write will fail immediately and visibly rather than at 3am. <code>docker diff</code> on a normally-running container lists exactly which paths to declare.</div>
<p class="note-ct"><strong>Three things to remember.</strong> There is no user namespace by default, so root in the container is root on the host — <code>USER</code> with a high numeric UID is the single most valuable line in a Dockerfile after the base image. <code>--read-only</code> plus a <code>--tmpfs</code> for the few paths that need writing blocks most of what an attacker would do next, and costs only the exercise of listing them. And <code>--privileged</code> or a mounted <code>docker.sock</code> is root on the host: sometimes necessary, never casual.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Chạy một container cho an toàn</h2>
<p class="lead">Mặc định thì một container chạy dưới quyền root, ghi được vào bất cứ đâu trong hệ thống file của nó, và giữ một bộ capability của Linux mà phần lớn ứng dụng chẳng bao giờ dùng tới. Không cái nào trong đó ngăn ứng dụng chạy — và mỗi cái đều là một bước mà một kẻ tấn công chiếm được quyền chạy mã lẽ ra phải tự giành lấy. Sáu cái cờ gỡ chúng đi, và không cái nào tốn gì.</p>

<h3>Bắt đầu từ người dùng</h3>
${slide('dk-06', 19, 'Năm lớp khoá quanh tiến trình — mỗi lớp chặn một bước của kẻ tấn công')}
<pre><code>docker run --rm alpine id
docker run --rm -u 1000:1000 alpine id
docker run --rm node:22-alpine id node</code></pre>
<div class="out">uid=0(root) gid=0(root) groups=0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)
uid=1000 gid=1000 groups=1000
uid=1000(node) gid=1000(node) groups=1000(node)</div>
<pre><code># Trong Dockerfile — cách chữa bền vững (Bài 4.2)
FROM node:22-alpine
<span class="tok-comment"># … những bước dựng cần quyền root …</span>
USER node
CMD ["node", "dist/index.js"]

<span class="tok-comment"># Hoặc tự tạo một người dùng, với UID số cố định</span>
RUN addgroup -g 10001 app &amp;&amp; adduser -u 10001 -G app -D -H app
USER 10001:10001</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Vì sao nó quan trọng dù đã có ranh giới container</span><span class="v">Mặc định KHÔNG có user namespace nào (Bài 1.1), nên UID 0 bên trong là UID 0 bên ngoài. Một cú thoát container từ tiến trình root đáp xuống máy chủ với quyền root; từ UID 10001 thì đáp xuống với một người dùng chẳng sở hữu gì.</span></div>
  <div class="kv"><span class="k">Hãy dùng UID dạng SỐ</span><span class="v"><code>USER 10001:10001</code> chứ không phải <code>USER app</code>. Phép kiểm <code>runAsNonRoot</code> của Kubernetes đọc giá trị số từ cấu hình ảnh và TỪ CHỐI một cái tên nó không phân giải được; số cũng sống sót khi ảnh được chạy với một <code>--user</code> khác.</span></div>
  <div class="kv"><span class="k">Chọn một UID CAO</span><span class="v">Trên 10000 thì tránh đụng với một người dùng của máy chủ, điều đó quan trọng với những file được bind mount (Bài 2.4). Ảnh chính thức dùng 1000, và đó cũng là người dùng thật đầu tiên trên hầu hết hệ thống Linux.</span></div>
  <div class="kv"><span class="k">Cổng dưới 1024 cần một capability</span><span class="v">Một tiến trình không phải root thì không bind được cổng 80. Hãy lắng nghe ở 8080 rồi publish thành <code>-p 80:8080</code>, đằng nào cũng tốt hơn — hoặc thêm <code>--cap-add=NET_BIND_SERVICE</code> nếu bạn thật sự bắt buộc.</span></div>
  <div class="kv"><span class="k">Thư mục phải ghi được bởi cái UID đó</span><span class="v"><code>COPY --chown=10001:10001</code> ngay lúc chép (Bài 4.2). Một container khởi động dưới quyền root rồi mới hạ xuống là một mẫu KHÁC và tệ hơn — hãy dùng <code>USER</code> và làm đúng ngay từ lúc dựng.</span></div>
</div>

<h3>Hệ thống file gốc chỉ đọc</h3>
<pre><code>docker run --rm --read-only alpine sh -c 'touch /tmp/x' 2&gt;&amp;1 | head -1
docker run --rm --read-only --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  alpine sh -c 'touch /tmp/x &amp;&amp; echo ghi được'</code></pre>
<div class="out">touch: /tmp/x: Read-only file system
ghi được</div>
<pre><code><span class="tok-comment"># Một dịch vụ thật: chỉ đọc, với những đường dẫn ghi được khai báo TƯỜNG MINH</span>
docker run -d --name web \\
  --read-only \\
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  --tmpfs /var/cache/nginx:rw,size=32m \\
  --tmpfs /var/run:rw,size=8m \\
  -p 8080:80 nginx:1.27-alpine
curl -s -o /dev/null -w '%{http_code}\\n' localhost:8080
docker inspect web --format 'readonly={{.HostConfig.ReadonlyRootfs}}'</code></pre>
<div class="out">200
readonly=true</div>

<h3>Chạy thử từng bước: tìm những đường dẫn nginx phải ghi</h3>
${slide('dk-06', 20, '--read-only: nginx chết vì không ghi được — tmpfs khai đúng chỗ là sống')}
<p>Ba đường dẫn <code>--tmpfs</code> ở trên từ đâu ra? Không phải chép từ một bài blog — mà từ việc để container hỏng rồi ĐỌC lỗi. Trên máy Mac của khoá (Docker Desktop 4.91), cổng trong dải của chương này:</p>
<pre><code class="language-bash">docker run -d --name dk06-web2 --read-only -p 18062:80 nginx:1.27-alpine
sleep 2
docker ps -a --filter name=dk06-web2 --format '{{.Names}} {{.Status}}'
docker logs dk06-web2 2&gt;&amp;1 | tail -2</code></pre>
<div class="out">dk06-web2 Exited (1) 2 seconds ago
2026/09/23 15:11:57 [emerg] 1#1: mkdir() "/var/cache/nginx/client_temp" failed (30: Read-only file system)
nginx: [emerg] mkdir() "/var/cache/nginx/client_temp" failed (30: Read-only file system)</div>
<p>Đường dẫn thiếu đầu tiên: <code>/var/cache/nginx</code>. Thêm một tmpfs cho nó, chạy lại, đọc lỗi tiếp theo; lặp lại tới khi nó chạy. Với nginx danh sách dừng ở ba:</p>
<pre><code class="language-bash">docker run -d --name dk06-web --read-only \\
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  --tmpfs /var/cache/nginx:rw,size=32m \\
  --tmpfs /var/run:rw,size=8m \\
  -p 18061:80 nginx:1.27-alpine
curl -s -o /dev/null -w '%{http_code}\\n' localhost:18061
docker logs dk06-web 2&gt;&amp;1 | grep -i "read-only"</code></pre>
<div class="out">200
10-listen-on-ipv6-by-default.sh: info: can not modify /etc/nginx/conf.d/default.conf (read-only file system?)</div>
<table>
<tr><th>Tuỳ chọn</th><th>Nghĩa</th></tr>
<tr><td><code>--read-only</code></td><td>Gắn hệ thống file gốc của container ở chế độ chỉ đọc. Volume và tmpfs vẫn ghi được.</td></tr>
<tr><td><code>--tmpfs /tmp:rw,noexec,nosuid,size=64m</code></td><td>Một thư mục nằm trong RAM tại <code>/tmp</code>: ghi được (<code>rw</code>), không chạy được file nào trong đó (<code>noexec</code>), bỏ qua bit setuid (<code>nosuid</code>), và không lớn quá 64MB (<code>size</code>). Nội dung biến mất khi container dừng.</td></tr>
<tr><td>Dòng <code>info: can not modify …</code></td><td>Vô hại: entrypoint của nginx thử thêm một dòng nghe IPv6, thấy file chỉ đọc, rồi đi tiếp. Chế độ chỉ đọc lôi ra MỌI lần ghi "tiện tay" kiểu này — hãy quyết từng cái xem có quan trọng không.</td></tr>
</table>
<p>Hai luật cho app của chính bạn: log đi ra stdout (không bao giờ vào một file trong ảnh), và thứ gì phải sống qua lần khởi động lại thì vào <strong>volume</strong>, không vào tmpfs (Chương 7). Nếu muốn liệt kê thay vì dò từng cái, hãy chạy app bình thường một lúc rồi dùng <code>docker diff</code> (Bài 2.2) — mỗi dòng <code>A</code> và <code>C</code> là một đường dẫn nó ghi.</p>

<div class="callout ok"><strong><code>--read-only</code> là cái cờ gia cố có giá trị cao nhất sau việc không-chạy-root.</strong> Phần lớn cuộc tấn công đều cần GHI một thứ gì đó: một web shell, một chương trình vừa tải về, một cấu hình bị sửa. Một hệ thống file gốc chỉ đọc chặn tất cả những cái đó, và cái giá là phải liệt kê ra một nhúm đường dẫn mà ứng dụng của bạn thật sự ghi vào — bản thân đó đã là một bài tập hữu ích, vì câu trả lời thường là "chẳng cái nào, một khi log đi ra stdout". Hãy tìm chúng bằng <code>docker diff</code> sau một lượt chạy bình thường (Bài 2.2).</div>

<h3>Capability</h3>
${slide('dk-06', 21, 'Capability: mặc định 14 cái, --cap-drop=ALL còn 0')}
<pre><code>docker run --rm alpine sh -c 'apk add -q libcap; capsh --print | head -2' 2&gt;/dev/null
docker run --rm --cap-drop=ALL alpine sh -c 'apk add -q libcap; capsh --print | head -2' 2&gt;/dev/null</code></pre>
<div class="out">Current: cap_chown,cap_dac_override,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_net_bind_service,cap_net_raw,cap_sys_chroot,cap_mknod,cap_audit_write,cap_setfcap=ep
Current: =</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Docker vốn đã bỏ đi phần lớn</span><span class="v">Trong khoảng 40 capability của Linux, một container chỉ được 14. Cái mặc định đó là một phần lớn lý do container an toàn hơn việc chạy root ngay trên máy chủ.</span></div>
  <div class="kv"><span class="k">--cap-drop=ALL là điểm khởi đầu ĐÚNG</span><span class="v">Rồi thêm lại đúng thứ nào bị hỏng. Phần lớn ứng dụng web KHÔNG cần cái nào cả — chúng mở một socket trên 1024 và đọc những file chúng sở hữu.</span></div>
  <div class="kv"><span class="k">CAP_NET_BIND_SERVICE</span><span class="v">Cái bạn có thể thật sự cần: bind một cổng dưới 1024 dưới danh nghĩa người dùng không phải root. Hãy ưu tiên publish một cổng cao thay vào đó.</span></div>
  <div class="kv"><span class="k">CAP_NET_RAW đáng bỏ một cách cụ thể</span><span class="v">Nó cho phép socket thô — giả mạo ARP và chế tác gói tin trên mạng container. Nó nằm TRONG bộ mặc định và gần như không gì cần nó. <em>Đính chính (đo 09/2026):</em> bỏ nó KHÔNG còn làm mất lệnh <code>ping</code> — Docker đặt <code>net.ipv4.ping_group_range</code> trong mọi container nên ping dùng socket ICMP không cần đặc quyền. Cái mất là <code>tcpdump</code> và các công cụ gói tin thô khác, đúng thứ bạn muốn chặn.</span></div>
  <div class="kv"><span class="k">CAP_SYS_ADMIN mới là cái nguy hiểm</span><span class="v">Thường được mô tả là "gần như root". Bất cứ thứ gì đòi nó đều đáng bị soi kỹ — nó là capability mà phần lớn cú thoát container dựa vào.</span></div>
</div>


<h3>Tự kiểm: một tiến trình thật sự nắm những quyền gì, trong /proc</h3>
<p>Cờ trên dòng lệnh chỉ là Ý ĐỊNH; <code>/proc/self/status</code> bên trong container mới là thứ nhân thật sự thi hành. Ba dòng đáng xem:</p>
<pre><code class="language-bash">docker run --rm alpine grep -E "CapEff|NoNewPrivs|Seccomp:" /proc/self/status
docker run --rm --cap-drop=ALL --security-opt no-new-privileges:true \\
  alpine grep -E "CapEff|NoNewPrivs|Seccomp:" /proc/self/status
docker run --rm --security-opt seccomp=unconfined alpine grep "Seccomp:" /proc/self/status</code></pre>
<div class="out">CapEff:	00000000a80425fb
NoNewPrivs:	0
Seccomp:	2
CapEff:	0000000000000000
NoNewPrivs:	1
Seccomp:	2
Seccomp:	0</div>
<table>
<tr><th>Trường</th><th>Đọc thế nào</th></tr>
<tr><td><code>CapEff</code></td><td>Capability đang hiệu lực, dạng mặt nạ bit hệ 16. <code>a80425fb</code> là 14 cái mặc định của Docker; toàn số 0 là không có cái nào. <code>capsh --decode=00000000a80425fb</code> đổi nó lại thành tên.</td></tr>
<tr><td><code>NoNewPrivs: 1</code></td><td>Không tiến trình nào trong container này nâng được quyền qua một file setuid. Nó <strong>MẶC ĐỊNH LÀ 0</strong> — bạn phải tự yêu cầu.</td></tr>
<tr><td><code>Seccomp: 2</code></td><td>Có bộ lọc seccomp đang bật (2 = chế độ lọc). <code>0</code> là không lọc gì cả — đúng thứ <code>seccomp=unconfined</code> đem lại.</td></tr>
</table>
<p>Và cái bất ngờ về <code>ping</code>, trên máy Linux: bỏ <code>NET_RAW</code> rồi mà ping vẫn chạy, còn một công cụ socket thô thật sự thì không.</p>
<pre><code class="language-bash">docker run --rm --cap-drop=NET_RAW alpine sh -c 'ping -c1 -W2 1.1.1.1 | tail -1; cat /proc/sys/net/ipv4/ping_group_range'
docker run --rm --cap-drop=NET_RAW alpine sh -c 'apk add -q tcpdump &gt;/dev/null 2&gt;&amp;1; tcpdump -c1 -i eth0 2&gt;&amp;1 | tail -1'</code></pre>
<div class="out">round-trip min/avg/max = 30.325/30.325/30.325 ms
0	2147483647
(Attempt to create packet socket failed - CAP_NET_RAW may be required)</div>

<h3>Trọn bộ, gộp lại</h3>
${slide('dk-06', 22, 'Trọn bộ cờ an toàn — và vòng lặp kiểm mọi container')}
<pre><code>docker run -d --name hardened \\
  --user 10001:10001 \\
  --read-only \\
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  --cap-drop=ALL \\
  --security-opt no-new-privileges:true \\
  --pids-limit 200 \\
  --memory 512m --cpus 1 \\
  -p 127.0.0.1:8080:8080 \\
  app:1.4.2

docker inspect hardened --format \\
  'user={{.Config.User}} ro={{.HostConfig.ReadonlyRootfs}} caps={{.HostConfig.CapDrop}} opts={{.HostConfig.SecurityOpt}}'</code></pre>
<div class="out">user=10001:10001 ro=true caps=[ALL] opts=[no-new-privileges:true]</div>
<pre><code><span class="tok-comment"># Vẫn thứ đó, viết trong Compose (Chương 9)</span>
services:
  api:
    image: app:1.4.2
    user: "10001:10001"
    read_only: true
    tmpfs: [ "/tmp:rw,noexec,nosuid,size=64m" ]
    cap_drop: [ ALL ]
    security_opt: [ "no-new-privileges:true" ]
    pids_limit: 200
    ports: [ "127.0.0.1:8080:8080" ]</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">no-new-privileges</span><span class="v">Ngăn một tiến trình giành thêm đặc quyền qua một chương trình setuid, và đó là cách nhiều cuộc leo thang đặc quyền hoạt động. Không có nhược điểm nào với một ứng dụng bình thường; hãy bật nó ở mọi nơi.</span></div>
  <div class="kv"><span class="k">seccomp mặc định đã BẬT</span><span class="v">Docker áp một hồ sơ chặn khoảng 44 lời gọi hệ thống, gồm <code>mount</code>, <code>kexec_load</code> và <code>ptrace</code> (tới bản 20.10 thì cái cuối được nới ra). Đừng bao giờ truyền <code>--security-opt seccomp=unconfined</code> trên production; nếu một công cụ cần nó thì chính công cụ đó cần bị soi kỹ.</span></div>
  <div class="kv"><span class="k">Giới hạn cũng là an ninh</span><span class="v"><code>--memory</code>, <code>--cpus</code> và <code>--pids-limit</code> ngăn MỘT container bị chiếm hoặc lỗi làm tê liệt mọi thứ khác trên máy chủ (Bài 2.5).</span></div>
  <div class="kv"><span class="k">Gắn vào loopback</span><span class="v"><code>-p 127.0.0.1:8080:8080</code> để một reverse proxy là đường vào DUY NHẤT, và để luật iptables của Docker không vô tình phơi nó ra vượt qua tường lửa của bạn (Bài 2.1).</span></div>
</div>


<h3>Từng cờ của lượt chạy đã siết, giải thích — và chứng minh</h3>
<table>
<tr><th>Cờ</th><th>Chặn được gì</th><th>Cái giá</th></tr>
<tr><td><code>--user 10001:10001</code></td><td>Thoát ra máy chủ trong vai root; ghi vào file của root trong ảnh</td><td>File app cần ghi phải thuộc UID đó</td></tr>
<tr><td><code>--read-only</code></td><td>Thả web shell, thay một file chạy, sửa cấu hình</td><td>Liệt kê những đường dẫn cần ghi thành tmpfs/volume</td></tr>
<tr><td><code>--tmpfs /tmp:…noexec…</code></td><td>Chạy bất cứ thứ gì được tải về <code>/tmp</code></td><td>Không có với app bình thường</td></tr>
<tr><td><code>--cap-drop=ALL</code></td><td>chown, socket thô, mở cổng &lt; 1024, đổi UID…</td><td>Thêm lại từng cái nếu có gì hỏng</td></tr>
<tr><td><code>--security-opt no-new-privileges:true</code></td><td>Nâng quyền qua file setuid</td><td>Không có</td></tr>
<tr><td><code>--pids-limit 200</code></td><td>Một quả bom fork làm sập máy chủ</td><td>Không có, trừ khi app đẻ hàng trăm tiến trình</td></tr>
<tr><td><code>--memory</code> · <code>--cpus</code></td><td>Một container bỏ đói những cái khác (Bài 1.1)</td><td>Chọn số theo mức dùng thật</td></tr>
<tr><td><code>-p 127.0.0.1:…</code></td><td>Lộ ra ngoài tường lửa qua chính luật iptables của Docker</td><td>Chỉ proxy trên cùng máy mới vào được</td></tr>
</table>
<p>Chứng minh trên máy Mac của khoá, với một máy chủ Node một dòng đóng vai app (<code>app:1.4.2</code> ở trên chỉ là minh hoạ):</p>
<pre><code class="language-bash">docker run -d --name dk06-hardened \\
  --user 10001:10001 --read-only --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  --cap-drop=ALL --security-opt no-new-privileges:true --pids-limit 200 \\
  --memory 256m --cpus 1 -p 127.0.0.1:18060:8080 \\
  node:22-alpine node -e "require('http').createServer((q,r)=&gt;r.end('ok\\n')).listen(8080)"
curl -s localhost:18060
docker inspect dk06-hardened --format 'user={{.Config.User}} ro={{.HostConfig.ReadonlyRootfs}} caps={{.HostConfig.CapDrop}} opts={{.HostConfig.SecurityOpt}} pids={{.HostConfig.PidsLimit}} mem={{.HostConfig.Memory}}'
docker exec dk06-hardened sh -c 'id; touch /app.txt; touch /tmp/ok &amp;&amp; echo tmp-ok'</code></pre>
<div class="out">ok
user=10001:10001 ro=true caps=[ALL] opts=[no-new-privileges:true] pids=200 mem=268435456
uid=10001 gid=10001 groups=10001
touch: /app.txt: Read-only file system
tmp-ok</div>
<p>App vẫn chạy; hai nước đi đầu tiên của kẻ tấn công (ghi vào đâu đó, trở thành root) thì không.</p>

<h3>Hai thứ trao đi TẤT CẢ</h3>
${slide('dk-06', 23, '--privileged hay gắn docker.sock = trao chìa khoá root của máy chủ')}
<pre><code><span class="tok-comment"># 1 · --privileged: mọi capability, mọi thiết bị, không seccomp, không AppArmor</span>
docker run --rm --privileged alpine sh -c 'ls /dev | wc -l; head -c 40 /dev/sda1' 2&gt;&amp;1 | head -2

<span class="tok-comment"># 2 · socket của Docker: điều khiển tiến trình nền là điều khiển cả máy chủ</span>
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock docker:cli \\
  run --rm -v /:/host alpine chroot /host id</code></pre>
<div class="out">436
uid=0(root) gid=0(root) groups=0(root)</div>
<div class="callout warn"><strong>Cả hai đều là quyền ROOT TRÊN MÁY CHỦ, chỉ thêm vài bước.</strong> <code>--privileged</code> trao cho container mọi capability và mọi thiết bị — nó đọc được đĩa thô, nạp được mô-đun nhân, và cấu hình lại được mạng. Gắn <code>docker.sock</code> còn tệ hơn ở chỗ nó TRÔNG vô hại: bất kỳ tiến trình nào nói chuyện được với tiến trình nền cũng khởi chạy được một container mới gắn <code>/</code> vào rồi tự cấp cho mình một shell root, và đó chính xác là điều câu lệnh thứ hai vừa chứng minh. Cả hai đôi khi là CẦN THIẾT — một máy chạy CI dựng ảnh, một agent giám sát — và cả hai nên được đối xử như "container này là root trên cái máy này", với đúng sự cẩn trọng bạn dành cho một shell root. Với trường hợp CI thì một bộ dựng rootless hoặc một proxy socket chỉ cho phép vài endpoint API là một lựa chọn thật.</div>


<p><strong>Chạy lại trên máy Mac của khoá (09/2026).</strong> Trên Docker Desktop, "máy chủ" là máy ảo Linux chạy engine, nên các con số này mô tả máy ảo đó:</p>
<pre><code class="language-bash">docker run --rm alpine sh -c 'ls /dev | wc -l'
docker run --rm --privileged alpine sh -c 'ls /dev | wc -l; ls /dev | grep -E "^(vda|sda|nvme)" | head -3'
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock docker:cli \\
  run --rm -v /:/host alpine chroot /host sh -c 'id'</code></pre>
<div class="out">15
169
vda
vda1
uid=0(root) gid=0(root) groups=0(root),1(daemon),2(bin),3(sys),4(adm),6(disk),10(uucp),11,20(dialout),26(tape),27(sudo)</div>
<table>
<tr><th>Việc đòi nó</th><th>Phương án an toàn hơn</th></tr>
<tr><td>Job CI chạy <code>docker build</code></td><td>BuildKit chế độ rootless, hoặc builder từ xa; đừng bao giờ gắn socket của máy chủ production vào CI</td></tr>
<tr><td>Traefik / bảng điều khiển liệt kê container</td><td><code>docker-socket-proxy</code> chỉ cho phép <code>GET /containers</code> chỉ đọc</td></tr>
<tr><td>"Công cụ bảo nó cần --privileged"</td><td>Tìm ĐÚNG một capability hay thiết bị nó cần (<code>--cap-add</code>, <code>--device</code>) và chỉ cấp cái đó</td></tr>
</table>

<h3>Một danh sách kiểm chạy được</h3>
<pre><code>for c in \$(docker ps --format '{{.Names}}'); do
  docker inspect "\$c" --format '{{.Name}}
    user:      {{if .Config.User}}{{.Config.User}}{{else}}ROOT (!){{end}}
    readonly:  {{.HostConfig.ReadonlyRootfs}}
    privileged:{{.HostConfig.Privileged}}
    capdrop:   {{.HostConfig.CapDrop}}
    secopt:    {{.HostConfig.SecurityOpt}}
    memory:    {{.HostConfig.Memory}}
    sock:      {{range .Mounts}}{{if eq .Source "/var/run/docker.sock"}}ĐÃ GẮN (!){{end}}{{end}}'
done</code></pre>
<div class="out">/api
    user:      10001:10001
    readonly:  true
    privileged:false
    capdrop:   [ALL]
    secopt:    [no-new-privileges:true]
    memory:    536870912
    sock:
/legacy-worker
    user:      ROOT (!)
    readonly:  false
    privileged:false
    capdrop:   []
    secopt:    []
    memory:    0
    sock:      ĐÃ GẮN (!)</div>


<p>Output thật của đúng vòng lặp đó trên máy Mac của khoá, giới hạn vào các container của chương bằng <code>docker ps --filter name=dk06-</code> (một <code>dk06-legacy</code> cố tình làm sai có gắn socket, cái đã siết, và nginx chỉ đọc):</p>
<div class="out">/dk06-legacy
    user:      ROOT (!)
    readonly:  false
    privileged:false
    capdrop:   []
    secopt:    []
    memory:    0
    sock:      MOUNTED (!)
/dk06-hardened
    user:      10001:10001
    readonly:  true
    privileged:false
    capdrop:   [ALL]
    secopt:    [no-new-privileges:true]
    memory:    268435456
    sock:
/dk06-web
    user:      ROOT (!)
    readonly:  true
    privileged:false
    capdrop:   []
    secopt:    []
    memory:    0
    sock:      </div>
<p>Để ý <code>dk06-web</code>: chỉ đọc, vậy mà vẫn bị gắn cờ ROOT. Ảnh nginx chính thức khởi động tiến trình master bằng root và chỉ hạ xuống user <code>nginx</code> cho các worker. Đó là một phát hiện THẬT, và cách sửa là một ảnh được dựng để chạy không đặc quyền (ví dụ <code>nginxinc/nginx-unprivileged</code>, nghe cổng 8080), chứ không phải một cờ.</p>

<h3>Thu hẹp thứ mà một container bị chiếm với tới được</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bỏ quyền root trước tiên</span><span class="lz-d"><code>USER node</code>. Một tiến trình không phải root thì không ghi được ra ngoài phạm vi file của nó, không nạp được module nhân, không gắn được cổng đặc quyền — phần lớn đường leo thang đóng lại ngay ở đây.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cho hệ tệp gốc thành chỉ-đọc</span><span class="lz-d"><code>--read-only</code> cộng một <code>tmpfs</code> cho những đường thật sự cần ghi. Kẻ tấn công vào được cũng chẳng để lại được gì.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Bỏ hết capability, chỉ giữ cái đang dùng</span><span class="lz-d"><code>--cap-drop ALL</code>, rồi thêm lại một hai cái mà tiến trình thật sự cần. Phần lớn container ứng dụng chẳng cần cái nào.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Rồi kiểm xem bạn còn để hở cái gì</span><span class="lz-d"><code>--privileged</code>, một socket Docker được mount vào, hay mạng của host — mỗi cái đều huỷ sạch mọi thứ ở trên chỉ bằng một cờ.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trước buổi demo cuối kỳ SWP391, giảng viên hỏi "nếu có người tìm ra lỗi RCE trong API của em, họ làm được gì với máy chủ?". Hãy trả lời bằng bằng chứng, không phải bằng ý kiến.</p><ol>
<li>Chạy ảnh API của bạn (hoặc <code>node:22-alpine</code> với máy chủ một dòng trong bài) theo kiểu bình thường, rồi kiểm nó bằng vòng lặp danh sách kiểm. Ghi lại mọi dấu <code>(!)</code>.</li>
<li>Đọc <code>/proc/self/status</code> bên trong nó: <code>docker exec &lt;c&gt; grep -E "CapEff|NoNewPrivs|Seccomp:" /proc/self/status</code>.</li>
<li>Khởi động lại với riêng <code>--read-only</code>. Nếu hỏng, đọc log, thêm một <code>--tmpfs</code> cho đường dẫn nó nêu tên, lặp lại tới khi chạy.</li>
<li>Thêm <code>--user 10001:10001 --cap-drop=ALL --security-opt no-new-privileges:true --pids-limit 200</code>, rồi chứng minh app vẫn trả lời bằng <code>curl</code> và lệnh <code>touch /x</code> bên trong thì hỏng.</li>
<li>Dọn dẹp bằng <code>docker rm -f</code> với đúng những tên bạn đã dùng.</li></ol>
<p><strong>Đạt khi:</strong> vòng kiểm không còn <code>ROOT (!)</code> hay <code>MOUNTED (!)</code> nào cho container của bạn, <code>CapEff</code> toàn số 0, <code>NoNewPrivs</code> là 1, app vẫn trả 200, và bạn liệt kê được ĐÚNG những đường dẫn nó cần làm tmpfs.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Non-root user (người dùng không phải root)</span><span class="v">Chạy tiến trình chính với UID khác 0, đặt bằng <code>USER</code> hoặc <code>--user</code>.</span></div>
  <div class="kv"><span class="k">Read-only root filesystem (hệ thống file gốc chỉ đọc)</span><span class="v"><code>--read-only</code>: không sửa được gì trong ảnh; chỉ tmpfs và volume là ghi được.</span></div>
  <div class="kv"><span class="k">tmpfs (thư mục trong RAM)</span><span class="v">Một điểm gắn nằm trong RAM; nhanh, có giới hạn dung lượng, và bị xoá sạch khi container dừng.</span></div>
  <div class="kv"><span class="k">Capability (năng lực đặc quyền)</span><span class="v">Một mảnh quyền lực của root (mở cổng thấp, socket thô, chown…); Docker cấp mặc định 14 cái.</span></div>
  <div class="kv"><span class="k">no-new-privileges (cấm nâng quyền)</span><span class="v">Cờ của nhân chặn file setuid nâng quyền; mặc định TẮT.</span></div>
  <div class="kv"><span class="k">seccomp (bộ lọc lời gọi hệ thống)</span><span class="v">Bộ lọc các system call; hồ sơ mặc định của Docker chặn khoảng 44 trong hơn 300 cái.</span></div>
  <div class="kv"><span class="k">--privileged (đặc quyền toàn phần)</span><span class="v">Mọi capability, mọi thiết bị, không seccomp hay AppArmor — thực chất là root trên máy chủ.</span></div>
  <div class="kv"><span class="k">docker.sock (ổ cắm API của Docker)</span><span class="v">Socket API của daemon; ai nói chuyện được với nó là khởi động được một container gắn <code>/</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mặc định không có user namespace: root trong container là root trên máy chủ, nên hãy dùng <code>USER</code> số cao.</li>
<li>Tìm những đường dẫn app phải ghi bằng cách chạy nó với <code>--read-only</code> rồi đọc lỗi; nginx cần đúng ba điểm gắn tmpfs.</li>
<li>Mặc định Docker cấp 14 capability; <code>--cap-drop=ALL</code> làm <code>CapEff</code> về toàn 0, và bỏ <code>NET_RAW</code> không còn làm hỏng ping.</li>
<li><code>NoNewPrivs</code> là 0 nếu bạn không yêu cầu; seccomp BẬT (<code>Seccomp: 2</code>) trừ khi bạn tắt nó.</li>
<li><code>--privileged</code> lộ ra 169 nút thiết bị thay vì 15; một <code>docker.sock</code> được gắn cho ra <code>uid=0</code> trên máy chủ chỉ bằng một lệnh.</li>
<li>Kiểm <code>/proc/self/status</code> và <code>docker inspect</code> — cờ bạn ĐỊNH đặt chưa phải bằng chứng là nó đã được đặt.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/security/seccomp/" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Hồ sơ bảo mật seccomp cho Docker</span><span class="lc-sub">Hồ sơ mặc định, danh sách system call bị chặn ("around 44 system calls out of 300+"), và cách chạy với một hồ sơ tự viết thay cho <code>unconfined</code>.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/capabilities.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">capabilities(7) — trang hướng dẫn Linux</span><span class="lc-sub">Mỗi capability cho phép làm gì. Tra mọi <code>--cap-add</code> một công cụ đòi hỏi TRƯỚC khi cấp nó.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/security/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">An ninh của Docker</span><span class="lc-sub">Bộ capability mặc định, hồ sơ seccomp, bề mặt tấn công của tiến trình nền là gì, và một bản tường thuật trung thực về việc ranh giới container bảo vệ và không bảo vệ được gì.</span></span>
</a>
<a class="link-card" href="https://github.com/docker/docker-bench-security" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">docker-bench-security</span><span class="lc-sub">Một script soát một máy chủ cùng các container của nó theo CIS Docker Benchmark. Hãy chạy nó một lần trên bất kỳ máy chủ nào bạn sở hữu; output chính là một danh sách việc cần làm.</span></span>
</a>
<a class="link-card" href="https://github.com/Tecnativa/docker-socket-proxy" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">docker-socket-proxy</span><span class="lc-sub">Nếu có thứ thật sự cần cái socket — Traefik, một agent giám sát — thì cái này đứng chắn phía trước và chỉ cho phép những endpoint bạn liệt kê. Tốt hơn hẳn việc trao đi quyền root.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: gia cố nó lại</span><span class="lc-sub">Bài chấm điểm: làm cho một container chạy chỉ-đọc rồi tìm ra những đường dẫn nó thật sự ghi, bỏ hết capability rồi thêm lại đúng cái nào hỏng, soát năm container đang chạy, và chứng minh vì sao một cái socket được gắn vào chính là root.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> thêm <code>USER node</code> vào một cái ảnh mà ứng dụng ghi vào một thư mục thuộc sở hữu root. Lượt dựng thành công, cái ảnh trên giấy tờ thì nhỏ hơn và an toàn hơn, và container chết lúc khởi động với <code>EACCES: permission denied, open '/app/logs/app.log'</code> — hoặc tệ hơn, khởi động ngon lành rồi hỏng vài giờ sau ở lần ghi đầu tiên. Hai thứ ngăn được nó: <code>COPY --chown</code> cho MỌI đường dẫn ứng dụng sở hữu, và chạy container một lần với <code>--read-only</code> TRƯỚC khi đem đi, vì khi đó bất cứ thứ gì cần ghi sẽ hỏng ngay lập tức và lộ ra thay vì hỏng lúc 3 giờ sáng. <code>docker diff</code> trên một container đang chạy bình thường liệt kê chính xác những đường dẫn cần khai báo.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Mặc định KHÔNG có user namespace, nên root trong container là root trên máy chủ — <code>USER</code> với một UID số cao là dòng giá trị nhất trong một Dockerfile, chỉ sau dòng chọn ảnh nền. <code>--read-only</code> cộng một <code>--tmpfs</code> cho vài đường dẫn cần ghi chặn được phần lớn thứ mà kẻ tấn công sẽ làm tiếp theo, và chỉ tốn công liệt kê chúng ra. Và <code>--privileged</code> hay một cái <code>docker.sock</code> được gắn vào chính là root trên máy chủ: đôi khi cần thiết, không bao giờ được tuỳ tiện.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.5 ─────────────────────────── */
    {
      title: '6.5 — Scanning, SBOMs and supply chain|||6.5 — Quét lỗ hổng, SBOM và chuỗi cung ứng',
      slug: 'dk-6-5-quet-chuoi-cung-ung',
      type: 'LESSON',
      description: 'Quét một cái ảnh bằng docker scout và trivy, đọc kết quả mà không hoảng, phân loại cái nào thật sự quan trọng, sinh SBOM và chứng thực xuất xứ, và một cổng chặn CI hợp lý.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>Scanning, SBOMs and supply chain</h2>
<p class="lead">Every image you ship contains software you did not write: a base OS, a language runtime, and a few hundred dependencies. Scanning tells you which of those have known vulnerabilities. The hard part is not running the scanner — it is reading the output without either panicking at 400 findings or ignoring the three that matter.</p>

<h3>Scan an image</h3>
${slide('dk-06', 24, 'Chuỗi cung ứng: phần lớn thứ trong ảnh bạn không tự viết')}
<pre><code>docker scout cves app:1.4.2 2&gt;/dev/null | head -14</code></pre>
<div class="out">    ✓ Image stored for indexing
    ✓ Indexed 214 packages
    ✗ Detected 3 vulnerable packages with 5 vulnerabilities

## Overview
                    │              Analyzed Image
────────────────────┼──────────────────────────────
  Target            │  app:1.4.2
    digest          │  7f3a2b1c9d8e
    platform        │ linux/amd64
    provenance      │ https://github.com/me/app
    vulnerabilities │    0C     2H     3M     0L
    size            │ 196 MB
    packages        │ 214</div>
<pre><code><span class="tok-comment"># trivy — the other one everyone uses; no account needed</span>
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
  aquasec/trivy:latest image --severity HIGH,CRITICAL --ignore-unfixed app:1.4.2 2&gt;/dev/null \\
  | tail -8</code></pre>
<div class="out">app:1.4.2 (alpine 3.20.3)
Total: 0 (HIGH: 0, CRITICAL: 0)

Node.js (node-pkg)
Total: 2 (HIGH: 2, CRITICAL: 0)

┌──────────────┬────────────────┬──────────┬────────┬───────────────┬───────────────┐
│   Library    │ Vulnerability  │ Severity │ Status │ Installed Ver │  Fixed Ver    │
│ tar-fs       │ CVE-2026-31145 │ HIGH     │ fixed  │ 2.1.1         │ 2.1.2, 3.0.7  │
│ cross-spawn  │ CVE-2026-21538 │ HIGH     │ fixed  │ 7.0.3         │ 7.0.5         │
└──────────────┴────────────────┴──────────┴────────┴───────────────┴───────────────┘</div>
<div class="callout warn"><strong>About the two outputs above (checked 23/09/2026).</strong> They are illustrative: <code>docker scout</code> now requires a Docker ID login before it runs at all, and the Trivy table shows made-up package versions and CVE numbers. Everything below is a real run — Trivy 0.74.0 as a container on the Linux machine, vulnerability database updated 2026-09-23 12:53 UTC. <strong>The counts are those of that day</strong>; run the same command next week and they will be different, because new CVEs are published every day against packages that have not changed.</div>
<h3>A real scan, on the course app</h3>
${slide('dk-06', 25, 'Quét thật: cùng một app, 12 lỗi HIGH/CRITICAL có bản vá → còn 1')}
<pre><code class="language-bash">docker volume create dk06-trivy-cache          <span class="tok-comment"># keep the 60MB+ database between runs</span>
T() { docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
        -v dk06-trivy-cache:/root/.cache aquasec/trivy:latest "\$@"; }
T --version | head -4
T image -q --scanners vuln dk06-api:multi | grep -E "^Total|^dk06|^Node"</code></pre>
<div class="out">Version: 0.74.0
Vulnerability DB:
  Version: 2
  UpdatedAt: 2026-09-23 12:53:55.964849051 +0000 UTC
dk06-api:multi (debian 12.15)
Total: 239 (UNKNOWN: 1, LOW: 82, MEDIUM: 100, HIGH: 52, CRITICAL: 4)
Node.js (node-pkg)
Total: 25 (UNKNOWN: 0, LOW: 3, MEDIUM: 10, HIGH: 11, CRITICAL: 1)</div>
<p>264 findings. Now the only filter that matters for a build gate — serious and <em>fixable</em>:</p>
<pre><code class="language-bash">T image -q --scanners vuln --severity HIGH,CRITICAL --ignore-unfixed dk06-api:multi | grep -E "^Total"</code></pre>
<div class="out">Total: 12 (HIGH: 11, CRITICAL: 1)</div>
<table>
<tr><th>Flag</th><th>Meaning</th></tr>
<tr><td><code>-v /var/run/docker.sock:…</code></td><td>Lets the Trivy container read images from your local Docker. (Yes, this is the "socket = root" of Lesson 6.4 — acceptable for a tool you run by hand, not for something left running.)</td></tr>
<tr><td><code>-v dk06-trivy-cache:/root/.cache</code></td><td>A named volume for the vulnerability database, so the second scan does not download it again.</td></tr>
<tr><td><code>-q</code> · <code>--scanners vuln</code></td><td>Quiet logs; look for vulnerabilities only (Trivy also scans for secrets and misconfiguration).</td></tr>
<tr><td><code>--severity HIGH,CRITICAL</code></td><td>Hide LOW and MEDIUM.</td></tr>
<tr><td><code>--ignore-unfixed</code></td><td>Hide findings with no fixed version yet — nothing you can do about them today.</td></tr>
</table>
<p>A second scanner on the same image, Grype 0.119.0, counted <strong>258</strong> matches against Trivy's 264, and classified them differently (Grype: 10 Critical, 70 High; Trivy: 5 Critical, 63 High across both sections). Neither is wrong: they use different databases and different rules for matching a Debian package version to an advisory. Pick one tool for the gate so the signal stays consistent.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">docker scout</span><span class="v">Built into Docker Desktop and the CLI. Best integration — <code>compare</code>, <code>recommendations</code>, and it understands provenance. Requires a Docker Hub account for some features.</span></div>
  <div class="kv"><span class="k">trivy</span><span class="v">Open source, no account, runs anywhere, and scans images, filesystems, Git repos and Kubernetes manifests with the same tool. The most common choice in CI.</span></div>
  <div class="kv"><span class="k">grype</span><span class="v">Anchore's scanner, pairs with <code>syft</code> for SBOMs. Worth knowing about; its output format is easy to script against.</span></div>
  <div class="kv"><span class="k">Scanners disagree</span><span class="v">Different vulnerability databases and different matching heuristics. Two scanners reporting different counts on the same image is normal, not a bug in either.</span></div>
</div>

<h3>Reading the output without panicking</h3>
${slide('dk-06', 27, 'Cổng CI hợp lý: chỉ chặn HIGH/CRITICAL đã có bản vá')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Filter to fixable</span><span class="lz-t">--ignore-unfixed</span><span class="lz-d">A finding with no fixed version is not actionable today. It belongs on a watch list, not in a build gate — otherwise your gate fails for reasons nobody can resolve, and people start skipping it.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Separate base from application</span><span class="lz-t">alpine 3.20.3 versus node-pkg</span><span class="lz-d">Base OS findings are fixed by bumping the base image; dependency findings by bumping a package in your lockfile. Different owners, different fixes, different urgency.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Ask whether it is reachable</span><span class="lz-t">does your process ever call that code?</span><span class="lz-d">A CVE in an image-decoding library in an API that never decodes images is real but not exploitable in your context. Record the reasoning; do not silently ignore it.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Fix the cheap ones immediately</span><span class="lz-t">npm audit fix, or a base image bump</span><span class="lz-d">Most findings are fixed by a patch release that changes nothing else. Doing those routinely keeps the list short enough that the remaining ones get attention.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Track what you accept</span><span class="lz-t">.trivyignore with an expiry date and a reason</span><span class="lz-d">An accepted risk with a written reason and a review date is engineering. An ignored scanner is not.</span></div>
</div>
<pre><code><span class="tok-comment"># What would a newer base image fix?</span>
docker scout recommendations app:1.4.2 2&gt;/dev/null | head -10</code></pre>
<div class="out">  Recommended fixes for image app:1.4.2
  Base image is  node:22-alpine3.20

  │ Tag              │ Details                    │ Pushed  │ Vulnerabilities
  │ 22-alpine3.21    │ Newer base, same major     │ 6 days  │  0C  0H  0M  2L
  │ 22-alpine3.20    │ Current                    │ 3 weeks │  0C  0H  1M  6L
  Refresh base image · fixes 1 medium, 4 low</div>

<p class="note-ct">The <code>docker scout recommendations</code> and <code>cosign verify</code> outputs in this lesson are illustrative (placeholder digests, a made-up repository). Scout needs a Docker ID login; cosign needs an image in a registry you own and a CI identity. The commands are correct as written — run them against your own GHCR image when you set up CI in Chapter 11.</p>



<h3>Run it step by step: 12 findings, and 11 of them are in npm</h3>
${slide('dk-06', 26, '11/12 lỗi nằm trong npm — thứ app không bao giờ chạy')}
<p>Step 2 above says "separate base from application". Trivy's table groups by <em>type</em>, not by <em>who owns it</em>, so ask for JSON and print the path of each package:</p>
<pre><code class="language-bash">T image -q --scanners vuln --severity HIGH,CRITICAL --ignore-unfixed \\
  --pkg-types library --format json dk06-api:multi &gt; tv-lib.json
node -e 'const j=require("./tv-lib.json");
  for (const r of j.Results||[]) for (const v of r.Vulnerabilities||[])
    console.log(v.PkgName, v.VulnerabilityID, v.Severity, (v.PkgPath||"").replace(/\\/package.json&#36;/,""))'</code></pre>
<div class="out">brace-expansion CVE-2026-13149 HIGH usr/local/lib/node_modules/npm/node_modules/brace-expansion
brace-expansion CVE-2026-14257 HIGH usr/local/lib/node_modules/npm/node_modules/brace-expansion
brace-expansion CVE-2026-69152 HIGH usr/local/lib/node_modules/npm/node_modules/brace-expansion
ip-address CVE-2026-69192 HIGH usr/local/lib/node_modules/npm/node_modules/ip-address
pacote CVE-2026-9496 HIGH usr/local/lib/node_modules/npm/node_modules/pacote
pacote CVE-2026-9496 HIGH usr/local/lib/node_modules/npm/node_modules/@npmcli/metavuln-calculator/node_modules/pacote
path-to-regexp CVE-2026-4867 HIGH app/node_modules/path-to-regexp
picomatch CVE-2026-33671 HIGH usr/local/lib/node_modules/npm/node_modules/picomatch
sigstore CVE-2026-48815 HIGH usr/local/lib/node_modules/npm/node_modules/sigstore
tar CVE-2026-59873 CRITICAL usr/local/lib/node_modules/npm/node_modules/tar
tar CVE-2026-59874 HIGH usr/local/lib/node_modules/npm/node_modules/tar
tar CVE-2026-73566 HIGH usr/local/lib/node_modules/npm/node_modules/tar</div>
<p>(Real output: Trivy on the Linux machine, the <code>node -e</code> on the Mac reading the same JSON.) Eleven of the twelve live in <code>/usr/local/lib/node_modules/npm</code> — the <code>npm</code> that ships inside every official <code>node</code> image. Your API never runs <code>npm</code> in production: <code>CMD ["node", "dist/index.js"]</code>. Only <code>path-to-regexp</code> (pulled in by Express 4) is really yours. So the cheapest fix is not a version bump at all — it is to not ship npm in the runtime stage:</p>
<pre><code class="language-dockerfile">FROM node:22-slim AS prod
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx</code></pre>
<pre><code class="language-bash">T image -q --scanners vuln --severity HIGH,CRITICAL --ignore-unfixed dk06-api:gon | grep -E "^Total"
T image -q --scanners vuln --severity HIGH,CRITICAL --ignore-unfixed dk06-api:distroless | grep -E "^Total"</code></pre>
<div class="out">Total: 1 (HIGH: 1, CRITICAL: 0)
Total: 6 (HIGH: 5, CRITICAL: 1)
Total: 1 (HIGH: 1, CRITICAL: 0)</div>
<p>From 12 to 1 without touching a line of application code. The distroless image has no npm either (1 finding in the app), but it shows 6 more in its OS section: that day, the distroless base was still on Debian 12.13 while <code>node:22-slim</code> was on 12.15. "Distroless" does not mean "patched" — it means fewer packages, rebuilt on its own schedule. One honest caveat about the <code>rm</code>: in a <code>-slim</code> image npm lives in a base layer, so deleting it adds a whiteout and <strong>does not make the image smaller</strong> (Lesson 1.2) — but the running filesystem, the scanner and any attacker no longer see it.</p>

<h3>An SBOM: what is actually in there</h3>
${slide('dk-06', 28, 'SBOM: danh sách thành phần — hỏi ta có đóng gói X không trong 1 giây')}
<pre><code><span class="tok-comment"># Generate one at build time and attach it to the image</span>
docker buildx build --sbom=true --provenance=mode=max \\
  -t ghcr.io/me/app:1.4.2 --push .

<span class="tok-comment"># Or read one from an existing image</span>
docker scout sbom --format list app:1.4.2 2&gt;/dev/null | head -6
docker buildx imagetools inspect ghcr.io/me/app:1.4.2 --format '{{ json .SBOM.SPDX.packages }}' \\
  | jq -r '.[] | "\\(.name) \\(.versionInfo)"' | head -5</code></pre>
<div class="out">Name              Version      Type
alpine-baselayout 3.6.5-r0     apk
busybox           1.36.1-r29   apk
express           4.21.1       npm
node              22.11.0      binary
openssl           3.3.2-r0     apk</div>

<p><strong>Real run (the output above is illustrative).</strong> Trivy writes an SBOM too, in CycloneDX or SPDX, without any account:</p>
<pre><code class="language-bash">T image -q --format cyclonedx dk06-api:multi &gt; sbom.cdx.json
ls -l sbom.cdx.json | awk '{print \$5}'
node -e 'const c=require("./sbom.cdx.json").components||[]; const t={};
  for (const x of c) { const k=(x.purl||"").split(":")[1]?.split("/")[0]||x.type; t[k]=(t[k]||0)+1 }
  console.log("components:", c.length); console.log(t);
  for (const x of c) if (/^(openssl|libssl3|express|zlib1g)&#36;/.test(x.name)) console.log(x.name, x.version)'</code></pre>
<div class="out">512825
components: 367
{ npm: 276, 'operating-system': 1, deb: 90 }
libssl3 3.0.20-1~deb12u2
openssl 3.0.20-1~deb12u2
zlib1g 1:1.2.13.dfsg-1
express 4.21.2</div>
<p>367 components in a four-file API: 90 Debian packages, 276 npm packages (including npm's own), one OS entry. When the next OpenSSL advisory lands, "are we affected?" is a <code>grep</code> over the SBOMs of every image you shipped — no rebuild, no rescan.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">What an SBOM is for</span><span class="v">The question "are we affected by the new <code>libxyz</code> vulnerability?" answered in seconds across every image you have shipped, without rebuilding or re-scanning anything.</span></div>
  <div class="kv"><span class="k">Attached, not stored separately</span><span class="v"><code>--sbom=true</code> attaches it to the image in the registry as an attestation. It travels with the image, so whoever pulls it can verify what is inside.</span></div>
  <div class="kv"><span class="k">Provenance</span><span class="v"><code>--provenance=mode=max</code> records how the image was built: the source repository, the commit, the builder, the Dockerfile. This is what <code>docker scout</code> printed as <code>provenance</code> in the overview above.</span></div>
  <div class="kv"><span class="k">The unknown/unknown manifest</span><span class="v">Attestations appear in the image index as a platform-less entry (Lesson 3.4). Harmless, and the reason some older tooling needs <code>--provenance=false</code>.</span></div>
  <div class="kv"><span class="k">syft, if you are not on Docker</span><span class="v"><code>syft app:1.4.2 -o spdx-json</code> produces the same thing as a standalone tool, in whichever standard format your policy requires.</span></div>
</div>

<h3>Signing, briefly</h3>
<pre><code><span class="tok-comment"># Sign with cosign, keyless (identity comes from the CI's OIDC token)</span>
cosign sign --yes ghcr.io/me/app@sha256:7f3a2b1c9d8e…

<span class="tok-comment"># Verify before deploying — this is the half that matters</span>
cosign verify \\
  --certificate-identity-regexp 'https://github.com/me/app/.github/workflows/.*' \\
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \\
  ghcr.io/me/app@sha256:7f3a2b1c9d8e… | jq -r '.[0].optional.Subject'</code></pre>
<div class="out">https://github.com/me/app/.github/workflows/build.yml@refs/heads/main</div>
<p>A signature answers "was this image built by our pipeline from our repository?" — which a tag cannot, since anyone with push access can move a tag. Keyless signing means there is no key to manage or leak: the identity is the CI workflow itself. Note that <strong>signing without verifying achieves nothing</strong>; the verification step belongs in the deploy, not in the build.</p>

<h3>A sensible CI gate</h3>
<pre><code>- name: Scan image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ghcr.io/&#36;{{ github.repository }}:&#36;{{ github.sha }}
    severity: HIGH,CRITICAL
    ignore-unfixed: true
    exit-code: '1'
    trivyignores: .trivyignore</code></pre>
<pre><code><span class="tok-comment"># .trivyignore — accepted risks, with a reason and an expiry</span>
# CVE-2026-31145 — tar-fs, only reachable from the CLI which we do not ship.
# Review by 2026-10-01, or when tar-fs 3.x lands upstream.
CVE-2026-31145</code></pre>

<p><strong>What actually happens with the ignore file (real run, Linux).</strong> The one fixable HIGH left in <code>dk06-api:gon</code> is <code>CVE-2026-4867</code> in <code>path-to-regexp</code>. With <code>--exit-code 1</code> the gate fails; with a <code>.trivyignore</code> in the directory Trivy runs from, it passes — Trivy reads that file automatically, you do not have to name it:</p>
<pre><code class="language-bash">cat .trivyignore
T image -q --scanners vuln --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 dk06-api:gon &gt;/dev/null 2&gt;&amp;1
echo "không có .trivyignore: exit=\$?"
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v dk06-trivy-cache:/root/.cache \\
  -v "\$PWD:/w" -w /w aquasec/trivy:latest \\
  image -q --scanners vuln --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 dk06-api:gon &gt;/dev/null 2&gt;&amp;1
echo "có .trivyignore trong thư mục: exit=\$?"</code></pre>
<div class="out"># CVE-2026-4867 — path-to-regexp 0.1.12 (express 4). Chỉ đường route tĩnh, không nhận mẫu từ người dùng.
# Xem lại trước 2026-10-15 hoặc khi lên express 4.22.
CVE-2026-4867
không có .trivyignore: exit=1
có .trivyignore trong thư mục: exit=0</div>
<div class="callout warn"><strong>That automatic read cuts both ways.</strong> While testing this lesson, a scan run from the folder that held the <code>.trivyignore</code> reported the finding as gone, and it took a second look to realise why. A stale <code>.trivyignore</code> lying in the repo root silently hides findings from every scan run there. Keep a review date in each comment, and treat the file as code: reviewed in pull requests, pruned when the date passes. (The <code>CVE-2026-31145</code> line in the block above is an illustrative ID.)</div>

<div class="callout ok"><strong>Fail on HIGH and CRITICAL <em>that have a fix</em>, and nothing else.</strong> A gate that fails on everything gets disabled within a month; a gate that fails only on actionable, serious findings gets fixed. Pair it with a weekly scheduled rebuild (Lesson 3.2) so base-image patches arrive without anyone pushing code, and with a scan of the <em>running</em> production image, not just the one CI just built — those drift apart the moment a deploy is skipped.</div>

<h3>The habits that matter more than the tool</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rebuild on a schedule</span><span class="v">Most base-image CVEs are fixed upstream within days. A weekly <code>--pull</code> rebuild collects those fixes with no human involvement, and is worth more than any scanner.</span></div>
  <div class="kv"><span class="k">Keep the image small</span><span class="v">Fewer packages, fewer CVEs — mechanically. The 152MB distroless image from Lesson 6.3 has a fraction of the findings of the 1.24GB one, for the same application.</span></div>
  <div class="kv"><span class="k">Pin with a bot, not by hand</span><span class="v">Digest pinning plus Renovate (Lesson 3.2) gives you reproducibility <em>and</em> updates. Pinning without the bot is how an image ends up two years old.</span></div>
  <div class="kv"><span class="k">Scan the lockfile too</span><span class="v"><code>npm audit</code>, <code>pip-audit</code>, <code>govulncheck</code> run in seconds and catch things earlier than an image scan, because they run before the image exists.</span></div>
  <div class="kv"><span class="k">Watch what you copy in</span><span class="v"><code>COPY --from=some/image</code> and <code>curl | sh</code> in a <code>RUN</code> are supply-chain entry points that no scanner will question. Pin them by digest and verify checksums (Lesson 4.2).</span></div>
</div>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the university asks every SWP391 team for a one-page "security status" of their deployed image. A teammate pasted "Trivy: 264 vulnerabilities" and the group panicked. Turn that number into a triage you can defend.</p><ol>
<li>Create the cache volume and the <code>T()</code> helper from "A real scan". Record <code>T --version | head -4</code> — the database date is part of your answer.</li>
<li>Scan your image (or the one from the 6.1 practice) without filters, then with <code>--severity HIGH,CRITICAL --ignore-unfixed</code>. Write both totals down.</li>
<li>Use the JSON + <code>node -e</code> snippet from "12 findings, and 11 of them are in npm" to split the fixable findings into <em>base/runtime</em> versus <em>your app</em>.</li>
<li>Fix one cheaply (remove npm from the runtime stage, or bump the one dependency of yours), rebuild, rescan. For anything you accept, write a <code>.trivyignore</code> line with a reason and a review date.</li>
<li>Generate an SBOM with <code>--format cyclonedx</code> and answer: which OpenSSL version does the image ship?</li></ol>
<p><strong>Done when:</strong> you have a short table — total, fixable HIGH/CRITICAL before and after, how many were in the base vs your app, the scan date — plus a reviewed <code>.trivyignore</code> (or none needed), and you can name the OpenSSL version from the SBOM. Clean up with <code>docker volume rm</code> on your cache volume when finished.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CVE</span><span class="v">A public ID for one known vulnerability (CVE-year-number); scanners match your packages against lists of them.</span></div>
  <div class="kv"><span class="k">Severity</span><span class="v">LOW / MEDIUM / HIGH / CRITICAL — the database's estimate of impact, not a statement about your app.</span></div>
  <div class="kv"><span class="k">Fixable / unfixed</span><span class="v">Whether a patched version of the package exists yet; <code>--ignore-unfixed</code> hides the second kind.</span></div>
  <div class="kv"><span class="k">Reachability</span><span class="v">Whether your running process ever executes the vulnerable code — npm inside a Node API usually does not.</span></div>
  <div class="kv"><span class="k">SBOM</span><span class="v">Software Bill of Materials: the list of every package and version inside an image (CycloneDX or SPDX).</span></div>
  <div class="kv"><span class="k">Provenance</span><span class="v">A signed record of how an image was built: source, commit, builder.</span></div>
  <div class="kv"><span class="k">.trivyignore</span><span class="v">A file of accepted CVE IDs; Trivy reads it automatically from the current directory.</span></div>
  <div class="kv"><span class="k">Supply chain</span><span class="v">Everything between other people's code and your server: base image, packages, build, registry, deploy.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Scan counts belong to a date: Trivy 0.74.0 on 23/09/2026 found 264 issues in the course app; next week will differ.</li>
<li>Filter to <code>--severity HIGH,CRITICAL --ignore-unfixed</code> first — 264 became 12.</li>
<li>Split by owner: 11 of those 12 were in the npm bundled with the Node image, which the app never runs.</li>
<li>Removing npm from the runtime stage took fixable HIGH/CRITICAL from 12 to 1 without touching application code.</li>
<li>Two scanners disagreeing (Grype 258 vs Trivy 264) is normal — pick one for the gate.</li>
<li>An SBOM answers "do we ship OpenSSL X?" instantly; a <code>.trivyignore</code> needs a reason and an expiry, because Trivy applies it silently.</li>
</ul>

<a class="link-card" href="https://trivy.dev/latest/docs/configuration/filtering/" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">Trivy — filtering findings</span><span class="lc-sub"><code>--severity</code>, <code>--ignore-unfixed</code>, <code>.trivyignore</code> and its expiry syntax, and ignore policies. The page to read before you write your first gate.</span></span>
</a>
<a class="link-card" href="https://github.com/anchore/grype" target="_blank" rel="noopener">
  <span class="lc-ico">🦅</span>
  <span class="lc-body"><span class="lc-title">Grype</span><span class="lc-sub">A second opinion: Anchore's scanner, which pairs with <code>syft</code> for SBOMs. Useful when Trivy's verdict on a finding looks surprising.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/scout/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">Docker Scout</span><span class="lc-sub"><code>cves</code>, <code>compare</code>, <code>recommendations</code> and policy evaluation. The <code>compare</code> subcommand — diffing two images' vulnerabilities — is genuinely useful before a base-image bump.</span></span>
</a>
<a class="link-card" href="https://trivy.dev/" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Trivy</span><span class="lc-sub">Images, filesystems, repositories, IaC and secrets in one scanner, with a GitHub Action and sensible defaults. The pragmatic choice for CI.</span></span>
</a>
<a class="link-card" href="https://docs.sigstore.dev/cosign/signing/overview/" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">cosign — signing container images</span><span class="lc-sub">Keyless signing with OIDC, and — more importantly — the verification policies that make a signature mean something at deploy time.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: scan and triage</span><span class="lc-sub">Graded exercises: scan an image and separate base findings from dependency findings, decide which of five CVEs to fix today, write a <code>.trivyignore</code> entry that a reviewer would accept, and read an SBOM to answer "do we ship openssl 3.3?".</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> treating the CVE count as the score. Chasing zero produces two bad outcomes: people switch to a base image that is smaller but wrong for their dependencies (Lesson 6.2), and people add blanket ignores to make a red build green. Neither improves security. The count is a starting point for a conversation, and the questions that matter are: is there a fix available, is the vulnerable code path reachable from our application, and how long has this been in production. An image with 40 unfixable low-severity findings in libraries you never call is in better shape than one with 3 findings you have been ignoring for eight months because the build gate was too noisy to keep on.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Filter to <em>fixable</em> HIGH and CRITICAL before you form an opinion — a gate that fires on unfixable findings gets switched off, and then nothing is checked. Separate base-image findings (fixed by bumping the base) from dependency findings (fixed in your lockfile), because they have different owners and different fixes. And a scheduled rebuild with <code>--pull</code> plus a digest-pinning bot delivers more security than any scanner, because it fixes things without anyone having to notice.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Quét lỗ hổng, SBOM và chuỗi cung ứng</h2>
<p class="lead">Mỗi cái ảnh bạn đẩy lên đều chứa phần mềm bạn không viết: một hệ điều hành nền, một bộ chạy ngôn ngữ, và vài trăm gói phụ thuộc. Quét lỗ hổng cho bạn biết cái nào trong số đó có lỗ hổng đã công bố. Phần khó không phải chạy máy quét — mà là đọc kết quả mà không hoảng loạn trước 400 phát hiện, cũng không bỏ qua ba cái thật sự quan trọng.</p>

<h3>Quét một cái ảnh</h3>
${slide('dk-06', 24, 'Chuỗi cung ứng: phần lớn thứ trong ảnh bạn không tự viết')}
<pre><code>docker scout cves app:1.4.2 2&gt;/dev/null | head -14</code></pre>
<div class="out">    ✓ Image stored for indexing
    ✓ Indexed 214 packages
    ✗ Detected 3 vulnerable packages with 5 vulnerabilities

## Overview
                    │              Analyzed Image
────────────────────┼──────────────────────────────
  Target            │  app:1.4.2
    digest          │  7f3a2b1c9d8e
    platform        │ linux/amd64
    provenance      │ https://github.com/me/app
    vulnerabilities │    0C     2H     3M     0L
    size            │ 196 MB
    packages        │ 214</div>
<pre><code><span class="tok-comment"># trivy — cái còn lại ai cũng dùng; không cần tài khoản</span>
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
  aquasec/trivy:latest image --severity HIGH,CRITICAL --ignore-unfixed app:1.4.2 2&gt;/dev/null \\
  | tail -8</code></pre>
<div class="out">app:1.4.2 (alpine 3.20.3)
Total: 0 (HIGH: 0, CRITICAL: 0)

Node.js (node-pkg)
Total: 2 (HIGH: 2, CRITICAL: 0)

┌──────────────┬────────────────┬──────────┬────────┬───────────────┬───────────────┐
│   Library    │ Vulnerability  │ Severity │ Status │ Installed Ver │  Fixed Ver    │
│ tar-fs       │ CVE-2026-31145 │ HIGH     │ fixed  │ 2.1.1         │ 2.1.2, 3.0.7  │
│ cross-spawn  │ CVE-2026-21538 │ HIGH     │ fixed  │ 7.0.3         │ 7.0.5         │
└──────────────┴────────────────┴──────────┴────────┴───────────────┴───────────────┘</div>
<div class="callout warn"><strong>Về hai output ở trên (kiểm ngày 23/09/2026).</strong> Chúng chỉ mang tính minh hoạ: <code>docker scout</code> nay đòi đăng nhập Docker ID mới chịu chạy, và bảng Trivy dùng phiên bản gói và số CVE bịa ra. Mọi thứ dưới đây là chạy THẬT — Trivy 0.74.0 chạy bằng container trên máy Linux, CSDL lỗ hổng cập nhật 2026-09-23 12:53 UTC. <strong>Các con số là của NGÀY ĐÓ</strong>; tuần sau chạy đúng lệnh này sẽ ra số khác, vì mỗi ngày đều có CVE mới được công bố cho những gói không hề thay đổi.</div>
<h3>Một lượt quét thật, trên app mẫu của khoá</h3>
${slide('dk-06', 25, 'Quét thật: cùng một app, 12 lỗi HIGH/CRITICAL có bản vá → còn 1')}
<pre><code class="language-bash">docker volume create dk06-trivy-cache          <span class="tok-comment"># giữ CSDL 60MB+ giữa các lần chạy</span>
T() { docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
        -v dk06-trivy-cache:/root/.cache aquasec/trivy:latest "\$@"; }
T --version | head -4
T image -q --scanners vuln dk06-api:multi | grep -E "^Total|^dk06|^Node"</code></pre>
<div class="out">Version: 0.74.0
Vulnerability DB:
  Version: 2
  UpdatedAt: 2026-09-23 12:53:55.964849051 +0000 UTC
dk06-api:multi (debian 12.15)
Total: 239 (UNKNOWN: 1, LOW: 82, MEDIUM: 100, HIGH: 52, CRITICAL: 4)
Node.js (node-pkg)
Total: 25 (UNKNOWN: 0, LOW: 3, MEDIUM: 10, HIGH: 11, CRITICAL: 1)</div>
<p>264 phát hiện. Giờ tới bộ lọc duy nhất quan trọng với một cổng chặn — nghiêm trọng và <em>ĐÃ CÓ BẢN VÁ</em>:</p>
<pre><code class="language-bash">T image -q --scanners vuln --severity HIGH,CRITICAL --ignore-unfixed dk06-api:multi | grep -E "^Total"</code></pre>
<div class="out">Total: 12 (HIGH: 11, CRITICAL: 1)</div>
<table>
<tr><th>Cờ</th><th>Nghĩa</th></tr>
<tr><td><code>-v /var/run/docker.sock:…</code></td><td>Cho container Trivy đọc ảnh từ Docker trên máy bạn. (Đúng, đây chính là "socket = root" ở Bài 6.4 — chấp nhận được với một công cụ bạn chạy tay, không chấp nhận với thứ để chạy thường trực.)</td></tr>
<tr><td><code>-v dk06-trivy-cache:/root/.cache</code></td><td>Một volume có tên cho CSDL lỗ hổng, để lần quét thứ hai không phải tải lại.</td></tr>
<tr><td><code>-q</code> · <code>--scanners vuln</code></td><td>Bớt log; chỉ tìm lỗ hổng (Trivy còn quét bí mật và cấu hình sai).</td></tr>
<tr><td><code>--severity HIGH,CRITICAL</code></td><td>Ẩn mức LOW và MEDIUM.</td></tr>
<tr><td><code>--ignore-unfixed</code></td><td>Ẩn những phát hiện chưa có phiên bản vá — hôm nay bạn chẳng làm gì được với chúng.</td></tr>
</table>
<p>Một máy quét thứ hai trên cùng ảnh, Grype 0.119.0, đếm được <strong>258</strong> kết quả so với 264 của Trivy, và xếp mức khác hẳn (Grype: 10 Critical, 70 High; Trivy: 5 Critical, 63 High tính cả hai phần). Không bên nào sai: chúng dùng CSDL khác nhau và luật khác nhau để khớp một phiên bản gói Debian với một bản tin lỗ hổng. Hãy chọn MỘT công cụ làm cổng chặn để tín hiệu nhất quán.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">docker scout</span><span class="v">Có sẵn trong Docker Desktop và CLI. Tích hợp tốt nhất — <code>compare</code>, <code>recommendations</code>, và nó hiểu được xuất xứ (provenance). Vài tính năng cần tài khoản Docker Hub.</span></div>
  <div class="kv"><span class="k">trivy</span><span class="v">Mã nguồn mở, không cần tài khoản, chạy được ở mọi nơi, và quét ảnh, hệ thống file, kho Git lẫn manifest Kubernetes bằng cùng một công cụ. Lựa chọn phổ biến nhất trong CI.</span></div>
  <div class="kv"><span class="k">grype</span><span class="v">Máy quét của Anchore, đi cặp với <code>syft</code> để sinh SBOM. Đáng biết; định dạng kết quả của nó dễ viết script để xử lý.</span></div>
  <div class="kv"><span class="k">Các máy quét bất đồng nhau</span><span class="v">Cơ sở dữ liệu lỗ hổng khác nhau và cách đối chiếu khác nhau. Hai máy quét báo số khác nhau trên cùng một cái ảnh là chuyện bình thường, không phải lỗi của bên nào.</span></div>
</div>

<h3>Đọc kết quả mà không hoảng</h3>
${slide('dk-06', 27, 'Cổng CI hợp lý: chỉ chặn HIGH/CRITICAL đã có bản vá')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Lọc lấy cái sửa được</span><span class="lz-t">--ignore-unfixed</span><span class="lz-d">Một phát hiện chưa có phiên bản vá thì hôm nay bạn không làm gì được. Nó thuộc về danh sách theo dõi, không thuộc về cổng chặn build — nếu không cổng của bạn sẽ đỏ vì lý do không ai giải quyết nổi, rồi người ta bắt đầu bỏ qua nó.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Tách nền khỏi ứng dụng</span><span class="lz-t">alpine 3.20.3 so với node-pkg</span><span class="lz-d">Lỗi ở hệ điều hành nền sửa bằng cách nâng ảnh nền; lỗi ở gói phụ thuộc sửa bằng cách nâng một gói trong lockfile. Khác người chịu trách nhiệm, khác cách sửa, khác độ gấp.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Hỏi xem có với tới được không</span><span class="lz-t">tiến trình của bạn có bao giờ gọi vào đoạn mã đó không?</span><span class="lz-d">Một CVE trong thư viện giải mã ảnh, nằm trong một API không bao giờ giải mã ảnh, là có thật nhưng không khai thác được trong ngữ cảnh của bạn. Hãy ghi lại lập luận đó; đừng lặng lẽ bỏ qua.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Sửa ngay những cái rẻ</span><span class="lz-t">npm audit fix, hoặc nâng ảnh nền</span><span class="lz-d">Phần lớn phát hiện được vá bằng một bản patch không đổi gì khác. Làm đều đặn việc đó giữ cho danh sách đủ ngắn để những cái còn lại được chú ý.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Ghi lại cái bạn chấp nhận</span><span class="lz-t">.trivyignore kèm ngày hết hạn và lý do</span><span class="lz-d">Một rủi ro được chấp nhận có lý do viết ra và ngày xem lại là kỹ thuật. Một máy quét bị phớt lờ thì không.</span></div>
</div>
<pre><code><span class="tok-comment"># Một ảnh nền mới hơn sẽ vá được những gì?</span>
docker scout recommendations app:1.4.2 2&gt;/dev/null | head -10</code></pre>
<div class="out">  Recommended fixes for image app:1.4.2
  Base image is  node:22-alpine3.20

  │ Tag              │ Details                    │ Pushed  │ Vulnerabilities
  │ 22-alpine3.21    │ Newer base, same major     │ 6 days  │  0C  0H  0M  2L
  │ 22-alpine3.20    │ Current                    │ 3 weeks │  0C  0H  1M  6L
  Refresh base image · fixes 1 medium, 4 low</div>

<p class="note-ct">Output của <code>docker scout recommendations</code> và <code>cosign verify</code> trong bài này chỉ mang tính minh hoạ (digest giữ chỗ, repository bịa). Scout cần đăng nhập Docker ID; cosign cần một ảnh trong registry của chính bạn và một danh tính CI. Các lệnh được viết đúng — hãy chạy chúng với ảnh GHCR của bạn khi dựng CI ở Chương 11.</p>



<h3>Chạy thử từng bước: 12 phát hiện, và 11 cái nằm trong npm</h3>
${slide('dk-06', 26, '11/12 lỗi nằm trong npm — thứ app không bao giờ chạy')}
<p>Bước 2 ở trên bảo "tách nền khỏi ứng dụng". Bảng của Trivy nhóm theo <em>LOẠI</em>, không theo <em>AI SỞ HỮU</em>, nên hãy xin JSON rồi in đường dẫn của từng gói:</p>
<pre><code class="language-bash">T image -q --scanners vuln --severity HIGH,CRITICAL --ignore-unfixed \\
  --pkg-types library --format json dk06-api:multi &gt; tv-lib.json
node -e 'const j=require("./tv-lib.json");
  for (const r of j.Results||[]) for (const v of r.Vulnerabilities||[])
    console.log(v.PkgName, v.VulnerabilityID, v.Severity, (v.PkgPath||"").replace(/\\/package.json&#36;/,""))'</code></pre>
<div class="out">brace-expansion CVE-2026-13149 HIGH usr/local/lib/node_modules/npm/node_modules/brace-expansion
brace-expansion CVE-2026-14257 HIGH usr/local/lib/node_modules/npm/node_modules/brace-expansion
brace-expansion CVE-2026-69152 HIGH usr/local/lib/node_modules/npm/node_modules/brace-expansion
ip-address CVE-2026-69192 HIGH usr/local/lib/node_modules/npm/node_modules/ip-address
pacote CVE-2026-9496 HIGH usr/local/lib/node_modules/npm/node_modules/pacote
pacote CVE-2026-9496 HIGH usr/local/lib/node_modules/npm/node_modules/@npmcli/metavuln-calculator/node_modules/pacote
path-to-regexp CVE-2026-4867 HIGH app/node_modules/path-to-regexp
picomatch CVE-2026-33671 HIGH usr/local/lib/node_modules/npm/node_modules/picomatch
sigstore CVE-2026-48815 HIGH usr/local/lib/node_modules/npm/node_modules/sigstore
tar CVE-2026-59873 CRITICAL usr/local/lib/node_modules/npm/node_modules/tar
tar CVE-2026-59874 HIGH usr/local/lib/node_modules/npm/node_modules/tar
tar CVE-2026-73566 HIGH usr/local/lib/node_modules/npm/node_modules/tar</div>
<p>(Output thật: Trivy chạy trên máy Linux, <code>node -e</code> chạy trên Mac đọc cùng file JSON đó.) Mười một trên mười hai nằm trong <code>/usr/local/lib/node_modules/npm</code> — cái <code>npm</code> đi kèm mọi ảnh <code>node</code> chính thức. API của bạn không bao giờ chạy <code>npm</code> trên production: <code>CMD ["node", "dist/index.js"]</code>. Chỉ <code>path-to-regexp</code> (Express 4 kéo vào) mới thật sự là của bạn. Nên cách sửa rẻ nhất hoàn toàn không phải nâng phiên bản — mà là ĐỪNG chở npm vào stage chạy:</p>
<pre><code class="language-dockerfile">FROM node:22-slim AS prod
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx</code></pre>
<pre><code class="language-bash">T image -q --scanners vuln --severity HIGH,CRITICAL --ignore-unfixed dk06-api:gon | grep -E "^Total"
T image -q --scanners vuln --severity HIGH,CRITICAL --ignore-unfixed dk06-api:distroless | grep -E "^Total"</code></pre>
<div class="out">Total: 1 (HIGH: 1, CRITICAL: 0)
Total: 6 (HIGH: 5, CRITICAL: 1)
Total: 1 (HIGH: 1, CRITICAL: 0)</div>
<p>Từ 12 xuống 1 mà không đụng một dòng mã ứng dụng nào. Ảnh distroless cũng không có npm (1 phát hiện trong app), nhưng nó hiện thêm 6 cái ở phần hệ điều hành: hôm đó nền distroless vẫn ở Debian 12.13 trong khi <code>node:22-slim</code> đã ở 12.15. "Distroless" không có nghĩa là "đã vá" — nó nghĩa là ít gói hơn, được dựng lại theo lịch riêng của nó. Một lưu ý thật thà về lệnh <code>rm</code>: trong ảnh <code>-slim</code>, npm nằm ở một tầng nền, nên xoá nó chỉ thêm một dấu whiteout và <strong>KHÔNG làm ảnh nhỏ đi</strong> (Bài 1.2) — nhưng hệ thống file lúc chạy, máy quét và kẻ tấn công đều không còn thấy nó.</p>

<h3>SBOM: bên trong thật sự có gì</h3>
${slide('dk-06', 28, 'SBOM: danh sách thành phần — hỏi ta có đóng gói X không trong 1 giây')}
<pre><code><span class="tok-comment"># Sinh lúc build và gắn kèm vào ảnh</span>
docker buildx build --sbom=true --provenance=mode=max \\
  -t ghcr.io/me/app:1.4.2 --push .

<span class="tok-comment"># Hoặc đọc từ một cái ảnh đã có</span>
docker scout sbom --format list app:1.4.2 2&gt;/dev/null | head -6
docker buildx imagetools inspect ghcr.io/me/app:1.4.2 --format '{{ json .SBOM.SPDX.packages }}' \\
  | jq -r '.[] | "\\(.name) \\(.versionInfo)"' | head -5</code></pre>
<div class="out">Name              Version      Type
alpine-baselayout 3.6.5-r0     apk
busybox           1.36.1-r29   apk
express           4.21.1       npm
node              22.11.0      binary
openssl           3.3.2-r0     apk</div>

<p><strong>Chạy thật (output ở trên chỉ minh hoạ).</strong> Trivy cũng xuất được SBOM, dạng CycloneDX hoặc SPDX, không cần tài khoản:</p>
<pre><code class="language-bash">T image -q --format cyclonedx dk06-api:multi &gt; sbom.cdx.json
ls -l sbom.cdx.json | awk '{print \$5}'
node -e 'const c=require("./sbom.cdx.json").components||[]; const t={};
  for (const x of c) { const k=(x.purl||"").split(":")[1]?.split("/")[0]||x.type; t[k]=(t[k]||0)+1 }
  console.log("components:", c.length); console.log(t);
  for (const x of c) if (/^(openssl|libssl3|express|zlib1g)&#36;/.test(x.name)) console.log(x.name, x.version)'</code></pre>
<div class="out">512825
components: 367
{ npm: 276, 'operating-system': 1, deb: 90 }
libssl3 3.0.20-1~deb12u2
openssl 3.0.20-1~deb12u2
zlib1g 1:1.2.13.dfsg-1
express 4.21.2</div>
<p>367 thành phần trong một API bốn file: 90 gói Debian, 276 gói npm (kể cả của chính npm), một mục hệ điều hành. Khi bản tin lỗ hổng OpenSSL tiếp theo được công bố, câu "chúng ta có bị ảnh hưởng không?" chỉ là một lệnh <code>grep</code> trên SBOM của mọi ảnh bạn đã đem đi — không dựng lại, không quét lại.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">SBOM để làm gì</span><span class="v">Câu hỏi "chúng ta có dính lỗ hổng <code>libxyz</code> mới công bố không?" được trả lời trong vài giây, trên mọi cái ảnh đã từng đẩy lên, mà không phải dựng lại hay quét lại thứ gì.</span></div>
  <div class="kv"><span class="k">Gắn kèm, không lưu rời</span><span class="v"><code>--sbom=true</code> gắn nó vào cái ảnh trong registry dưới dạng chứng thực (attestation). Nó đi theo cái ảnh, nên ai kéo về cũng kiểm được bên trong có gì.</span></div>
  <div class="kv"><span class="k">Xuất xứ (provenance)</span><span class="v"><code>--provenance=mode=max</code> ghi lại cái ảnh được dựng thế nào: kho nguồn, commit, máy dựng, Dockerfile. Đó chính là dòng <code>provenance</code> mà <code>docker scout</code> in ra ở bảng tổng quan phía trên.</span></div>
  <div class="kv"><span class="k">Manifest unknown/unknown</span><span class="v">Chứng thực xuất hiện trong chỉ mục ảnh dưới dạng một mục không có nền tảng (Bài 3.4). Vô hại, và đó là lý do vài công cụ cũ cần <code>--provenance=false</code>.</span></div>
  <div class="kv"><span class="k">syft, nếu bạn không dùng Docker</span><span class="v"><code>syft app:1.4.2 -o spdx-json</code> cho ra đúng thứ đó dưới dạng công cụ độc lập, theo định dạng chuẩn nào mà chính sách của bạn yêu cầu.</span></div>
</div>

<h3>Ký ảnh, nói ngắn</h3>
<pre><code><span class="tok-comment"># Ký bằng cosign, không cần khoá (danh tính lấy từ token OIDC của CI)</span>
cosign sign --yes ghcr.io/me/app@sha256:7f3a2b1c9d8e…

<span class="tok-comment"># Kiểm chữ ký trước khi triển khai — đây mới là nửa quan trọng</span>
cosign verify \\
  --certificate-identity-regexp 'https://github.com/me/app/.github/workflows/.*' \\
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \\
  ghcr.io/me/app@sha256:7f3a2b1c9d8e… | jq -r '.[0].optional.Subject'</code></pre>
<div class="out">https://github.com/me/app/.github/workflows/build.yml@refs/heads/main</div>
<p>Một chữ ký trả lời câu "cái ảnh này có phải do đường ống của chúng ta dựng từ kho của chúng ta không?" — điều mà một cái nhãn không trả lời được, vì ai có quyền đẩy cũng dời được nhãn. Ký không khoá nghĩa là không có khoá nào để quản hay để lộ: danh tính chính là cái workflow CI. Nhớ rằng <strong>ký mà không kiểm thì chẳng được gì</strong>; bước kiểm thuộc về lúc triển khai, không phải lúc dựng.</p>

<h3>Một cổng chặn CI hợp lý</h3>
<pre><code>- name: Scan image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ghcr.io/&#36;{{ github.repository }}:&#36;{{ github.sha }}
    severity: HIGH,CRITICAL
    ignore-unfixed: true
    exit-code: '1'
    trivyignores: .trivyignore</code></pre>
<pre><code><span class="tok-comment"># .trivyignore — rủi ro đã chấp nhận, kèm lý do và hạn xem lại</span>
# CVE-2026-31145 — tar-fs, chỉ với tới được từ CLI mà chúng ta không đóng gói.
# Xem lại trước 01/10/2026, hoặc khi tar-fs 3.x lên bản chính thức.
CVE-2026-31145</code></pre>

<p><strong>Chuyện gì thật sự xảy ra với file bỏ qua (chạy thật, Linux).</strong> Phát hiện HIGH có bản vá duy nhất còn lại trong <code>dk06-api:gon</code> là <code>CVE-2026-4867</code> trong <code>path-to-regexp</code>. Với <code>--exit-code 1</code> cổng chặn hỏng; có một <code>.trivyignore</code> trong thư mục Trivy đang chạy thì nó qua — Trivy TỰ ĐỌC file đó, bạn không cần chỉ tên:</p>
<pre><code class="language-bash">cat .trivyignore
T image -q --scanners vuln --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 dk06-api:gon &gt;/dev/null 2&gt;&amp;1
echo "không có .trivyignore: exit=\$?"
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v dk06-trivy-cache:/root/.cache \\
  -v "\$PWD:/w" -w /w aquasec/trivy:latest \\
  image -q --scanners vuln --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 dk06-api:gon &gt;/dev/null 2&gt;&amp;1
echo "có .trivyignore trong thư mục: exit=\$?"</code></pre>
<div class="out"># CVE-2026-4867 — path-to-regexp 0.1.12 (express 4). Chỉ đường route tĩnh, không nhận mẫu từ người dùng.
# Xem lại trước 2026-10-15 hoặc khi lên express 4.22.
CVE-2026-4867
không có .trivyignore: exit=1
có .trivyignore trong thư mục: exit=0</div>
<div class="callout warn"><strong>Việc tự đọc đó là con dao hai lưỡi.</strong> Khi kiểm bài này, một lượt quét chạy từ thư mục có sẵn <code>.trivyignore</code> báo phát hiện đã biến mất, và phải nhìn lần hai mới hiểu vì sao. Một file <code>.trivyignore</code> cũ nằm ở gốc repo sẽ lặng lẽ giấu phát hiện khỏi MỌI lượt quét chạy ở đó. Hãy ghi ngày xem lại trong từng dòng chú thích, và coi file đó là mã: được review trong pull request, được dọn khi quá hạn. (Dòng <code>CVE-2026-31145</code> ở khối trên là một ID minh hoạ.)</div>

<div class="callout ok"><strong>Chỉ chặn ở HIGH và CRITICAL <em>đã có bản vá</em>, không chặn gì khác.</strong> Một cổng chặn mọi thứ sẽ bị tắt trong vòng một tháng; một cổng chỉ đỏ khi có phát hiện nghiêm trọng và làm được gì đó thì sẽ được sửa. Ghép nó với một lượt dựng lại theo lịch hằng tuần (Bài 3.2) để bản vá của ảnh nền tự về mà không cần ai đẩy mã, và với một lượt quét chính cái ảnh <em>đang chạy</em> trên production, chứ không chỉ cái CI vừa dựng — hai cái đó lệch nhau ngay từ lần đầu có người bỏ qua một lượt deploy.</div>

<h3>Những thói quen quan trọng hơn công cụ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dựng lại theo lịch</span><span class="v">Phần lớn CVE của ảnh nền được vá ở thượng nguồn trong vài ngày. Một lượt dựng lại <code>--pull</code> mỗi tuần gom hết chỗ vá đó mà không cần người can thiệp, và đáng giá hơn mọi máy quét.</span></div>
  <div class="kv"><span class="k">Giữ ảnh nhỏ</span><span class="v">Ít gói hơn thì ít CVE hơn — thuần cơ học. Cái ảnh distroless 152MB ở Bài 6.3 có số phát hiện chỉ bằng một phần nhỏ so với cái 1,24GB, cho cùng một ứng dụng.</span></div>
  <div class="kv"><span class="k">Ghim bằng bot, đừng ghim tay</span><span class="v">Ghim theo digest cộng với Renovate (Bài 3.2) cho bạn cả tính tái lập <em>lẫn</em> bản cập nhật. Ghim mà không có bot là cách một cái ảnh nằm nguyên hai năm.</span></div>
  <div class="kv"><span class="k">Quét cả lockfile</span><span class="v"><code>npm audit</code>, <code>pip-audit</code>, <code>govulncheck</code> chạy trong vài giây và bắt được sớm hơn quét ảnh, vì chúng chạy trước cả khi cái ảnh tồn tại.</span></div>
  <div class="kv"><span class="k">Để ý thứ bạn chép vào</span><span class="v"><code>COPY --from=some/image</code> và <code>curl | sh</code> trong một lệnh <code>RUN</code> là cửa vào của chuỗi cung ứng mà không máy quét nào chất vấn. Ghim chúng theo digest và kiểm checksum (Bài 4.2).</span></div>
</div>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trường yêu cầu mỗi nhóm SWP391 nộp một trang "tình trạng an ninh" của ảnh đã deploy. Một bạn dán vào "Trivy: 264 lỗ hổng" và cả nhóm hoảng. Hãy biến con số đó thành một bảng phân loại mà bạn bảo vệ được.</p><ol>
<li>Tạo volume cache và hàm <code>T()</code> ở mục "Một lượt quét thật". Ghi lại <code>T --version | head -4</code> — ngày của CSDL là một phần câu trả lời.</li>
<li>Quét ảnh của bạn (hoặc ảnh ở bài thực hành 6.1) không lọc gì, rồi với <code>--severity HIGH,CRITICAL --ignore-unfixed</code>. Ghi lại cả hai tổng.</li>
<li>Dùng đoạn JSON + <code>node -e</code> ở mục "12 phát hiện, và 11 cái nằm trong npm" để tách các phát hiện có bản vá thành <em>nền/môi trường chạy</em> và <em>app của bạn</em>.</li>
<li>Sửa rẻ một cái (bỏ npm khỏi stage chạy, hoặc nâng đúng một thư viện của bạn), dựng lại, quét lại. Cái nào bạn chấp nhận thì viết một dòng <code>.trivyignore</code> có lý do và ngày xem lại.</li>
<li>Sinh SBOM bằng <code>--format cyclonedx</code> và trả lời: ảnh đang chở OpenSSL phiên bản nào?</li></ol>
<p><strong>Đạt khi:</strong> bạn có một bảng ngắn — tổng số, số HIGH/CRITICAL có bản vá trước và sau, bao nhiêu cái ở nền và bao nhiêu ở app, ngày quét — cộng một <code>.trivyignore</code> đã xem xét (hoặc không cần), và nêu được phiên bản OpenSSL từ SBOM. Xong thì dọn volume cache bằng <code>docker volume rm</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CVE (mã lỗ hổng công khai)</span><span class="v">Một mã công khai cho một lỗ hổng đã biết (CVE-năm-số); máy quét đối chiếu gói của bạn với danh sách này.</span></div>
  <div class="kv"><span class="k">Severity (mức nghiêm trọng)</span><span class="v">LOW / MEDIUM / HIGH / CRITICAL — ước lượng tác động của CSDL, không phải nhận định về app của bạn.</span></div>
  <div class="kv"><span class="k">Fixable / unfixed (có bản vá / chưa có)</span><span class="v">Đã có phiên bản gói được vá hay chưa; <code>--ignore-unfixed</code> ẩn loại thứ hai.</span></div>
  <div class="kv"><span class="k">Reachability (khả năng với tới)</span><span class="v">Tiến trình đang chạy có bao giờ thực thi đoạn mã dính lỗi không — npm trong một API Node thường là không.</span></div>
  <div class="kv"><span class="k">SBOM (bảng kê thành phần phần mềm)</span><span class="v">Danh sách mọi gói và phiên bản bên trong một ảnh (CycloneDX hoặc SPDX).</span></div>
  <div class="kv"><span class="k">Provenance (chứng thực xuất xứ)</span><span class="v">Bản ghi có chữ ký về cách ảnh được dựng: mã nguồn, commit, builder.</span></div>
  <div class="kv"><span class="k">.trivyignore (file bỏ qua của Trivy)</span><span class="v">Một file liệt kê CVE đã chấp nhận; Trivy tự đọc nó từ thư mục đang đứng.</span></div>
  <div class="kv"><span class="k">Supply chain (chuỗi cung ứng)</span><span class="v">Mọi thứ nằm giữa mã của người khác và máy chủ của bạn: ảnh nền, gói, lượt dựng, registry, deploy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Số liệu quét gắn với một ngày: Trivy 0.74.0 ngày 23/09/2026 tìm thấy 264 vấn đề trong app mẫu; tuần sau sẽ khác.</li>
<li>Lọc <code>--severity HIGH,CRITICAL --ignore-unfixed</code> trước tiên — 264 thành 12.</li>
<li>Tách theo người sở hữu: 11 trong 12 cái nằm ở npm đi kèm ảnh Node, thứ app không bao giờ chạy.</li>
<li>Bỏ npm khỏi stage chạy đưa số HIGH/CRITICAL có bản vá từ 12 xuống 1 mà không đụng mã ứng dụng.</li>
<li>Hai máy quét lệch nhau (Grype 258, Trivy 264) là bình thường — chọn một cái làm cổng chặn.</li>
<li>SBOM trả lời "ta có chở OpenSSL X không?" ngay lập tức; <code>.trivyignore</code> cần lý do và hạn, vì Trivy áp nó một cách im lặng.</li>
</ul>

<a class="link-card" href="https://trivy.dev/latest/docs/configuration/filtering/" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">Trivy — lọc phát hiện</span><span class="lc-sub"><code>--severity</code>, <code>--ignore-unfixed</code>, <code>.trivyignore</code> cùng cú pháp đặt hạn, và chính sách bỏ qua. Trang nên đọc trước khi viết cổng chặn đầu tiên.</span></span>
</a>
<a class="link-card" href="https://github.com/anchore/grype" target="_blank" rel="noopener">
  <span class="lc-ico">🦅</span>
  <span class="lc-body"><span class="lc-title">Grype</span><span class="lc-sub">Ý kiến thứ hai: máy quét của Anchore, đi cặp với <code>syft</code> để sinh SBOM. Hữu ích khi phán quyết của Trivy về một phát hiện trông lạ.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/scout/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">Docker Scout</span><span class="lc-sub"><code>cves</code>, <code>compare</code>, <code>recommendations</code> và đánh giá theo chính sách. Lệnh con <code>compare</code> — so lỗ hổng của hai cái ảnh — thật sự hữu ích trước khi nâng ảnh nền.</span></span>
</a>
<a class="link-card" href="https://trivy.dev/" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Trivy</span><span class="lc-sub">Ảnh, hệ thống file, kho mã, IaC và bí mật trong cùng một máy quét, có sẵn GitHub Action và mặc định hợp lý. Lựa chọn thực dụng cho CI.</span></span>
</a>
<a class="link-card" href="https://docs.sigstore.dev/cosign/signing/overview/" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">cosign — ký ảnh container</span><span class="lc-sub">Ký không khoá bằng OIDC, và — quan trọng hơn — những chính sách kiểm chữ ký khiến một chữ ký thật sự có ý nghĩa lúc triển khai.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: quét và phân loại</span><span class="lc-sub">Bài chấm điểm: quét một cái ảnh rồi tách phát hiện của nền khỏi phát hiện của gói phụ thuộc, quyết định trong năm CVE cái nào sửa hôm nay, viết một dòng <code>.trivyignore</code> mà người review chấp nhận được, và đọc SBOM để trả lời "chúng ta có đóng gói openssl 3.3 không?".</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> coi số lượng CVE là điểm số. Đuổi theo con số 0 đẻ ra hai hậu quả tồi: người ta đổi sang một cái ảnh nền nhỏ hơn nhưng sai với gói phụ thuộc của mình (Bài 6.2), và người ta thêm những dòng bỏ qua vơ đũa cả nắm để build đỏ thành xanh. Không cái nào cải thiện an toàn cả. Con số chỉ là điểm khởi đầu cho một cuộc trao đổi, còn những câu hỏi thật sự quan trọng là: đã có bản vá chưa, đoạn mã dính lỗ hổng có với tới được từ ứng dụng của chúng ta không, và thứ này đã nằm trên production bao lâu rồi. Một cái ảnh có 40 phát hiện mức thấp chưa có bản vá nằm trong những thư viện bạn không bao giờ gọi tới thì lành mạnh hơn một cái ảnh có 3 phát hiện mà bạn đã ngó lơ tám tháng vì cổng chặn ồn quá nên bị tắt.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Lọc lấy HIGH và CRITICAL <em>đã có bản vá</em> trước khi bạn có ý kiến — một cổng chặn nổ vì những phát hiện không vá được sẽ bị tắt, và rồi chẳng còn gì được kiểm. Tách phát hiện của ảnh nền (sửa bằng cách nâng nền) khỏi phát hiện của gói phụ thuộc (sửa trong lockfile), vì chúng khác người chịu trách nhiệm và khác cách sửa. Và một lượt dựng lại theo lịch có <code>--pull</code> cộng với một con bot ghim digest mang lại nhiều an toàn hơn mọi máy quét, vì nó vá mà không cần ai phải để ý.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.6 ─────────────────────────── */
    {
      title: '6.6 — Quiz: small, safe images|||6.6 — Trắc nghiệm: ảnh nhỏ, ảnh an toàn',
      slug: 'dk-6-6-quiz',
      type: 'QUIZ',
      description: 'Mười câu tình huống thật về multi-stage, bẫy musl/glibc với Prisma, whiteout, devOptional, .Size trên Docker 29, --read-only, capability và phân loại kết quả quét.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions, each built from something that really happened while this chapter was being measured: a green build that restarts forever, a check that cannot fail, a prune that keeps 60MB, a gate that measures a different number after an upgrade, and a scan where 11 of 12 findings sit in a tool the app never runs. Aim for 8/10.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can split a Dockerfile into build and runtime stages and measure the result with DISK USAGE and CONTENT SIZE.</li>
<li>I can explain why a glibc binary on Alpine says "no such file or directory", and add a libc ↔ engine guard before a push.</li>
<li>I can find where an image's bytes are with <code>docker history</code>, <code>dive</code> and <code>du</code>, and cut them in order of effect.</li>
<li>I can run a container as non-root, read-only, with no capabilities, and prove it from <code>/proc/self/status</code>.</li>
<li>I can turn a raw scanner count into a triage: fixable, base versus app, reachable, accepted with an expiry.</li>
</ul>
${slide('dk-06', 30, 'Bảng tra nhanh Chương 6')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Mười câu, mỗi câu dựng từ một chuyện đã thật sự xảy ra khi đo đạc cho chương này: một bản dựng xanh rồi khởi động lại vô tận, một phép kiểm không thể hỏng, một lượt tỉa vẫn giữ 60MB, một cổng chặn đo con số khác sau khi nâng cấp, và một lượt quét mà 11 trên 12 phát hiện nằm trong một công cụ app không bao giờ chạy. Nhắm 8/10.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi tách được một Dockerfile thành stage dựng và stage chạy, và đo kết quả bằng DISK USAGE và CONTENT SIZE.</li>
<li>Tôi giải thích được vì sao một chương trình glibc trên Alpine báo "no such file or directory", và thêm được chốt kiểm libc ↔ engine trước khi đẩy.</li>
<li>Tôi tìm được byte của một ảnh nằm ở đâu bằng <code>docker history</code>, <code>dive</code> và <code>du</code>, rồi cắt theo thứ tự hiệu quả.</li>
<li>Tôi chạy được container không phải root, chỉ đọc, không capability, và chứng minh điều đó từ <code>/proc/self/status</code>.</li>
<li>Tôi biến được một con số thô của máy quét thành một bảng phân loại: có bản vá, nền hay app, có với tới được, chấp nhận kèm hạn.</li>
</ul>
${slide('dk-06', 30, 'Bảng tra nhanh Chương 6')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Build, push and deploy are all green. On the VPS the api container shows “Restarting (1)” and nginx returns 502. The log says: Prisma Client could not locate the Query Engine for runtime “linux-musl” … generated for “debian-openssl-3.0.x”. What happened, and what is the right fix?|||Build, push và deploy đều xanh. Trên VPS container api hiện “Restarting (1)” và nginx trả 502. Log ghi: Prisma Client could not locate the Query Engine for runtime “linux-musl” … generated for “debian-openssl-3.0.x”. Chuyện gì đã xảy ra, và cách sửa đúng là gì?',
            options: [
              'PostgreSQL was not ready yet; add a longer restart delay so the API waits until the database answers|||PostgreSQL chưa sẵn sàng; tăng thời gian chờ khởi động lại để API đợi tới khi CSDL trả lời',
              'The build stage generated a glibc engine and the runtime is Alpine (musl): add a musl binaryTarget plus OpenSSL, or use -slim in both stages, and guard it before push|||Stage dựng sinh engine glibc còn stage chạy là Alpine (musl): thêm binaryTarget musl cùng OpenSSL, hoặc dùng -slim cho cả hai stage, và chốt kiểm trước khi đẩy',
              'The node:22-alpine image does not include Node.js itself, so the entrypoint fails; switch to a tag that bundles the runtime|||Ảnh node:22-alpine không kèm chính Node.js nên entrypoint hỏng; đổi sang một tag có kèm môi trường chạy',
              'Migrations were never applied on production; run prisma migrate deploy once and the engine will be found|||Migration chưa từng được áp trên production; chạy prisma migrate deploy một lần là engine sẽ được tìm thấy',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: The log states the whole diagnosis: the engine on disk is for debian-openssl-3.0.x (glibc) and the system is linux-musl. Nothing at build time runs the first query, so every step was green; the process exits at prisma.$connect() before listening, hence 502. A database that is not ready gives a connection error, not a missing-engine error, and migrations have nothing to do with which engine file exists.|||VI: Log nói trọn chẩn đoán: engine trên đĩa là cho debian-openssl-3.0.x (glibc) còn hệ thống là linux-musl. Không bước nào lúc build chạy câu truy vấn đầu tiên, nên bước nào cũng xanh; tiến trình thoát ở prisma.$connect() trước khi kịp nghe cổng, vì vậy 502. CSDL chưa sẵn sàng thì cho lỗi kết nối chứ không phải lỗi thiếu engine, còn migration chẳng liên quan gì tới việc file engine nào tồn tại.',
          },
          {
            question: 'You COPY the node binary from node:22-slim into an alpine:3.22 image. Running it prints “exec /usr/local/bin/node: no such file or directory”, yet ls -l shows the 124MB file with execute permission. Why?|||Bạn COPY file node từ node:22-slim sang một ảnh alpine:3.22. Chạy nó in “exec /usr/local/bin/node: no such file or directory”, vậy mà ls -l vẫn thấy file 124MB có quyền chạy. Vì sao?',
            options: [
              'The COPY truncated the binary, because BuildKit only copies the first layer of a file taken from another image|||Lệnh COPY làm cụt file, vì BuildKit chỉ chép tầng đầu tiên của một file lấy từ ảnh khác',
              '/usr/local/bin is missing from PATH on Alpine, so the shell cannot find the program even though it exists|||/usr/local/bin không có trong PATH trên Alpine, nên shell không tìm được chương trình dù nó tồn tại',
              'Alpine mounts /usr/local with noexec by default, and the kernel reports that refusal as a missing file|||Alpine mặc định gắn /usr/local với noexec, và nhân báo lời từ chối đó thành file bị thiếu',
              'The binary names a glibc loader, /lib64/ld-linux-x86-64.so.2, that Alpine does not have; the missing file is the loader|||File đó ghi tên trình nạp glibc /lib64/ld-linux-x86-64.so.2 mà Alpine không có; file bị thiếu là trình nạp',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Measured: Alpine has only /lib/ld-musl-x86_64.so.1 and no /lib64 at all. The kernel reads the interpreter path from the binary, cannot open it, and returns ENOENT. PATH is irrelevant because the error names the full path, and nothing was truncated or mounted noexec.|||VI: Đo thật: Alpine chỉ có /lib/ld-musl-x86_64.so.1 và hoàn toàn không có /lib64. Nhân đọc đường dẫn trình nạp trong file, không mở được, và trả ENOENT. PATH không liên quan vì lỗi đã nêu đường dẫn đầy đủ, và chẳng có gì bị cụt hay bị gắn noexec.',
          },
          {
            question: 'A teammate runs docker save app:single | tar -xO --wildcards ’*/layer.tar’ | tar -t | grep -c npmrc on a single-stage image that did COPY .npmrc then RUN rm .npmrc. It prints 0. What should you conclude on Docker 29?|||Một bạn chạy docker save app:single | tar -xO --wildcards ’*/layer.tar’ | tar -t | grep -c npmrc với một ảnh một stage đã COPY .npmrc rồi RUN rm .npmrc. Nó in 0. Trên Docker 29 bạn nên kết luận gì?',
            options: [
              'Nothing: since Docker 25 docker save writes an OCI layout with layers in blobs/sha256/ and no layer.tar, so the check finds nothing on any image|||Chưa kết luận được gì: từ Docker 25 docker save ghi bố cục OCI, tầng nằm ở blobs/sha256/ và không có layer.tar, nên phép kiểm không thấy gì với mọi ảnh',
              'The token is gone, because RUN rm in the following instruction removes the file from the layer that added it|||Token đã biến mất, vì RUN rm ở chỉ thị kế tiếp gỡ file khỏi chính tầng đã thêm nó',
              'The token is gone, because BuildKit squashes consecutive COPY and RUN layers before the image is saved|||Token đã biến mất, vì BuildKit ép gộp các tầng COPY và RUN liền nhau trước khi lưu ảnh',
              'The token is gone, because files starting with a dot are skipped by docker save unless you pass --all|||Token đã biến mất, vì docker save bỏ qua file bắt đầu bằng dấu chấm trừ khi truyền --all',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: On the course Mac the old command printed 0 for both the single-stage and the multi-stage image, while looping over blobs/sha256/* printed 2 (the file and its .wh. whiteout) for the single-stage one. A check that cannot fail proves nothing. rm only adds a whiteout, BuildKit does not squash, and docker save has no dot-file filter.|||VI: Trên máy Mac của khoá, lệnh cũ in 0 cho cả ảnh một stage lẫn ảnh nhiều stage, còn vòng lặp qua blobs/sha256/* in 2 (file và dấu xoá .wh.) cho ảnh một stage. Một phép kiểm không thể hỏng thì chẳng chứng minh gì. rm chỉ thêm whiteout, BuildKit không ép gộp tầng, và docker save không có bộ lọc file chấm.',
          },
          {
            question: 'A Dockerfile has stages base → deps → dev, deps → test, deps → build → prod (in that file order). You run docker build --target dev. Which stages does BuildKit execute?|||Một Dockerfile có các stage base → deps → dev, deps → test, deps → build → prod (theo đúng thứ tự trong file). Bạn chạy docker build --target dev. BuildKit thực thi những stage nào?',
            options: [
              'All six stages, because BuildKit always builds the whole file and then tags only the stage you named|||Cả sáu stage, vì BuildKit luôn dựng cả file rồi chỉ gắn tag cho stage bạn gọi tên',
              'Every stage up to dev in file order, plus prod, because the last stage is always the default output|||Mọi stage đứng trước dev trong file, cộng thêm prod, vì stage cuối luôn là đầu ra mặc định',
              'Only base, deps and dev — the stages dev depends on; test, build and prod never run|||Chỉ base, deps và dev — những stage mà dev phụ thuộc; test, build và prod hoàn toàn không chạy',
              'dev and every stage that depends on dev, so that nothing downstream is left with a stale cache|||dev và mọi stage phụ thuộc vào dev, để không stage phía sau nào bị cache cũ',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: With --progress=plain the build log showed only [base 1/4], [deps 1/1] and [dev 1/2]. BuildKit walks the dependency graph from the target backwards; file order and the default target do not matter, and nothing downstream is built.|||VI: Với --progress=plain, log dựng chỉ có [base 1/4], [deps 1/1] và [dev 1/2]. BuildKit đi ngược đồ thị phụ thuộc từ target; thứ tự trong file và target mặc định không quan trọng, và không stage phía sau nào được dựng.',
          },
          {
            question: 'Dockerfile A does RUN apk add python3 make g++ and then, as a separate instruction, RUN apk del python3 make g++. Dockerfile B does both in one RUN. On the course machine A is 667MB and B is 243MB. Why?|||Dockerfile A chạy RUN apk add python3 make g++ rồi, ở một chỉ thị riêng, RUN apk del python3 make g++. Dockerfile B làm cả hai trong một RUN. Trên máy của khoá A nặng 667MB còn B 243MB. Vì sao?',
            options: [
              'apk del failed silently in A because the packages were still in use by the build, so nothing was removed|||apk del ở A hỏng âm thầm vì các gói vẫn đang được build sử dụng, nên chẳng gì bị gỡ',
              'A kept apk’s download cache in a hidden layer that B avoided by running apk in a single process|||A giữ bộ đệm tải của apk trong một tầng ẩn mà B tránh được nhờ chạy apk trong một tiến trình',
              'Layers are immutable: the 315MB add-layer stays and the del-layer only adds 41kB of whiteouts|||Tầng là bất biến: tầng add 315MB vẫn còn, tầng del chỉ thêm 41kB dấu xoá (whiteout)',
              'docker images counts the build cache of A as part of the image, which B does not have|||docker images tính cả cache dựng của A vào ảnh, thứ mà B không có',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: docker history showed 315MB for the apk add layer and 41kB for apk del. Deleting in a later layer only hides files; to really not ship them, clean up in the same RUN or use a build stage. The packages were removed from the final view (so apk del did work), and docker images does not count build cache.|||VI: docker history cho thấy tầng apk add 315MB và tầng apk del 41kB. Xoá ở tầng sau chỉ che file đi; muốn thật sự không chở chúng, hãy dọn trong cùng RUN hoặc dùng stage dựng. Các gói đã biến khỏi cái nhìn cuối (nên apk del có chạy), và docker images không tính cache dựng.',
          },
          {
            question: 'After npm prune --omit=dev in the build stage, du inside the final image still shows node_modules/prisma (26M) and node_modules/@prisma/engines (34M), although prisma is in devDependencies. What is going on?|||Sau npm prune --omit=dev ở stage dựng, du trong ảnh cuối vẫn thấy node_modules/prisma (26M) và node_modules/@prisma/engines (34M), dù prisma nằm trong devDependencies. Chuyện gì đang xảy ra?',
            options: [
              '@prisma/client declares prisma as an optional peer, so npm marks it devOptional and --omit=dev keeps it; remove the CLI explicitly if migrations run elsewhere|||@prisma/client khai prisma là peer tuỳ chọn, nên npm đánh dấu devOptional và --omit=dev giữ nó; hãy tự tay bỏ CLI nếu migration chạy ở chỗ khác',
              'npm prune only removes top-level folders it created itself and never touches packages installed by npm ci|||npm prune chỉ gỡ những thư mục cấp đầu do chính nó tạo, không bao giờ đụng gói mà npm ci đã cài',
              'Inside Docker, npm ignores --omit=dev unless NODE_ENV=production is also set in the same stage|||Trong Docker, npm bỏ qua --omit=dev trừ khi cùng stage đó cũng đặt NODE_ENV=production',
              'The layer cache restored the unpruned node_modules from a previous build, so the prune never ran|||Cache tầng đã khôi phục node_modules chưa tỉa từ lượt dựng trước, nên lệnh prune chưa từng chạy',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: npm ls prisma --omit=dev showed @prisma/client → prisma → @prisma/engines, and package-lock.json marks prisma "devOptional": true. Removing the CLI took node_modules from 93MB to 30.7MB and the app still answered. Prune did run (typescript and @types were gone), and NODE_ENV is not required for --omit=dev.|||VI: npm ls prisma --omit=dev cho thấy @prisma/client → prisma → @prisma/engines, và package-lock.json đánh dấu prisma "devOptional": true. Bỏ CLI đưa node_modules từ 93MB xuống 30,7MB và app vẫn trả lời. Prune có chạy (typescript và @types đã mất), và --omit=dev không cần NODE_ENV.',
          },
          {
            question: 'After upgrading to Docker 29, your CI size gate (docker image inspect --format ’{{.Size}}’ with a 250MB limit) reports 90MB for an image that docker images lists at 377MB DISK USAGE. Which explanation is right?|||Sau khi nâng lên Docker 29, cổng chặn kích thước trong CI (docker image inspect --format ’{{.Size}}’ với ngưỡng 250MB) báo 90MB cho một ảnh mà docker images ghi DISK USAGE 377MB. Giải thích nào đúng?',
            options: [
              'The shell arithmetic overflowed because 377MB in bytes is larger than a 32-bit integer can hold|||Phép tính của shell bị tràn vì 377MB tính ra byte lớn hơn sức chứa của số nguyên 32 bit',
              '.Size now excludes the base image layers, so it only measures what your own Dockerfile added|||.Size giờ bỏ qua các tầng của ảnh nền, nên nó chỉ đo phần Dockerfile của bạn thêm vào',
              '.Size now measures only the writable layer of the last container started from the image|||.Size giờ chỉ đo tầng ghi được của container gần nhất khởi chạy từ ảnh đó',
              'With the containerd image store .Size is the compressed content size; re-derive the threshold after upgrading|||Với kho ảnh containerd, .Size là kích thước nội dung đã nén; hãy tính lại ngưỡng sau khi nâng cấp',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Measured: dk06-api:single gives .Size 489064150 bytes, exactly its CONTENT SIZE of 489MB, while DISK USAGE is 1.88GB. Compressed bytes are what a deploy downloads, so the gate is not wrong, but a threshold chosen for unpacked sizes is now four times looser. Base layers are included, and bash arithmetic is 64-bit.|||VI: Đo thật: dk06-api:single cho .Size 489064150 byte, đúng bằng CONTENT SIZE 489MB, trong khi DISK USAGE là 1,88GB. Byte nén là thứ một lượt deploy phải tải, nên cổng chặn không sai, nhưng ngưỡng chọn theo kích thước giải nén giờ lỏng gấp bốn. Tầng nền vẫn được tính, và phép tính của bash là 64 bit.',
          },
          {
            question: 'docker run --read-only nginx:1.27-alpine exits with code 1: mkdir() "/var/cache/nginx/client_temp" failed (30: Read-only file system). You want to keep the root filesystem read-only. What do you do?|||docker run --read-only nginx:1.27-alpine thoát với mã 1: mkdir() "/var/cache/nginx/client_temp" failed (30: Read-only file system). Bạn muốn giữ hệ thống file gốc chỉ đọc. Bạn làm gì?',
            options: [
              'Remove --read-only for nginx only, since a proxy has no data worth protecting from being modified|||Bỏ --read-only riêng cho nginx, vì một proxy chẳng có dữ liệu nào đáng bảo vệ khỏi bị sửa',
              'Add a tmpfs for each path it must write — /var/cache/nginx, /var/run, /tmp — found by reading the errors|||Thêm tmpfs cho từng đường dẫn nó phải ghi — /var/cache/nginx, /var/run, /tmp — tìm ra bằng cách đọc lỗi',
              'Run it with --privileged so the entrypoint can remount the root filesystem read-write when it starts|||Chạy với --privileged để entrypoint gắn lại hệ thống file gốc ở chế độ ghi được khi khởi động',
              'Add --cap-add SYS_ADMIN so nginx is allowed to create directories on a read-only filesystem|||Thêm --cap-add SYS_ADMIN để nginx được phép tạo thư mục trên hệ thống file chỉ đọc',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: With three tmpfs mounts (/tmp, /var/cache/nginx, /var/run) the same image returned HTTP 200 on the course Mac. Read-only matters for a proxy too: it stops an attacker from rewriting its config. --privileged and SYS_ADMIN give away far more than they fix, and no capability makes a read-only mount writable.|||VI: Với ba tmpfs (/tmp, /var/cache/nginx, /var/run), cùng ảnh đó trả HTTP 200 trên máy Mac của khoá. Chỉ đọc vẫn quan trọng với proxy: nó chặn kẻ tấn công viết lại cấu hình. --privileged và SYS_ADMIN trao đi nhiều hơn hẳn thứ chúng sửa được, và không capability nào biến một điểm gắn chỉ đọc thành ghi được.',
          },
          {
            question: 'A container runs with --cap-drop=ALL. Inside it, ping 1.1.1.1 still succeeds, but tcpdump fails with “Attempt to create packet socket failed - CAP_NET_RAW may be required”. Why the difference?|||Một container chạy với --cap-drop=ALL. Bên trong, ping 1.1.1.1 vẫn thành công, nhưng tcpdump hỏng với “Attempt to create packet socket failed - CAP_NET_RAW may be required”. Vì sao khác nhau?',
            options: [
              'Docker sets net.ipv4.ping_group_range in containers, so ping uses an unprivileged ICMP socket; tcpdump needs a raw packet socket|||Docker đặt net.ipv4.ping_group_range trong container, nên ping dùng socket ICMP không đặc quyền; tcpdump cần socket gói thô',
              '--cap-drop=ALL never drops NET_RAW, because networking capabilities can only be removed one by one|||--cap-drop=ALL không bao giờ bỏ NET_RAW, vì capability mạng chỉ bỏ được từng cái một',
              'ping is a setuid-root program in Alpine, so it regains NET_RAW every time it is executed in the container|||ping là chương trình setuid-root trong Alpine, nên nó lấy lại NET_RAW mỗi lần được chạy trong container',
              'Docker Desktop ignores capability flags, so the result would be different on a real Linux server|||Docker Desktop phớt lờ cờ capability, nên trên máy chủ Linux thật kết quả sẽ khác',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: /proc/sys/net/ipv4/ping_group_range read 0 2147483647 inside the container, and CapEff was all zeros, so no capability was regained. The same result appeared on the Linux machine, not only on Docker Desktop. Dropping NET_RAW therefore no longer costs you ping — it costs raw-packet tools, which is the point.|||VI: /proc/sys/net/ipv4/ping_group_range đọc được 0 2147483647 trong container, và CapEff toàn số 0, nên không capability nào được lấy lại. Kết quả y hệt trên máy Linux, không chỉ trên Docker Desktop. Vì vậy bỏ NET_RAW không còn làm mất ping — nó làm mất các công cụ gói tin thô, đúng mục đích.',
          },
          {
            question: 'Trivy reports 264 findings for your Node API image; with --severity HIGH,CRITICAL --ignore-unfixed it is 12, and 11 of them are under /usr/local/lib/node_modules/npm. What is the cheapest effective action?|||Trivy báo 264 phát hiện cho ảnh API Node của bạn; với --severity HIGH,CRITICAL --ignore-unfixed còn 12, và 11 cái nằm dưới /usr/local/lib/node_modules/npm. Hành động rẻ mà hiệu quả nhất là gì?',
            options: [
              'Switch the runtime to node:22-alpine, because its OS section scanned at zero and that clears everything|||Đổi stage chạy sang node:22-alpine, vì phần hệ điều hành của nó quét ra 0 và thế là sạch hết',
              'Add all twelve CVE IDs to .trivyignore so the CI gate passes, and review them again next quarter|||Thêm cả mười hai mã CVE vào .trivyignore để cổng CI qua được, rồi quý sau xem lại',
              'Stop shipping npm in the runtime stage (or use distroless); only the app’s own path-to-regexp remains|||Ngừng chở npm trong stage chạy (hoặc dùng distroless); chỉ còn lại path-to-regexp của chính app',
              'Fail the build on all 264 findings until the count reaches zero, so nothing slips through again|||Làm hỏng build với cả 264 phát hiện cho tới khi về 0, để không gì lọt qua nữa',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: The app runs CMD ["node", "dist/index.js"] and never executes npm. Removing npm took fixable HIGH/CRITICAL from 12 to 1 without touching code. node:22-alpine still ships the same npm (its first Total line, 19, is npm’s), blanket ignores hide real risk, and a gate that fails on everything gets switched off.|||VI: App chạy CMD ["node", "dist/index.js"] và không bao giờ thực thi npm. Bỏ npm đưa số HIGH/CRITICAL có bản vá từ 12 xuống 1 mà không đụng mã. node:22-alpine vẫn chở đúng cái npm đó (dòng Total đầu tiên của nó, 19, là của npm), bỏ qua vơ đũa cả nắm thì giấu rủi ro thật, còn cổng chặn đỏ với mọi thứ sẽ bị tắt.',
          },
        ],
      },
    },
  ],
};
