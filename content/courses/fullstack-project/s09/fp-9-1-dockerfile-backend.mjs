/**
 * 9.1 — Dockerfile cho backend (soạn 24–25/11/2026, agent fsp; phiên Mac tiếp quản 25/11 hoàn tất phần đo + bài).
 * Output THẬT trên máy nhà (Docker 29, BuildKit): bản Dockerfile ngây thơ (ngữ cảnh 599 MB, ảnh 2,44 GB, chạy bằng root,
 * .env + 6 công cụ dev nằm trong ảnh, npm làm PID 1 ⇒ docker stop thoát mã 1); bản nhiều tầng (563 MB slim / 477 MB alpine),
 * postinstall "prisma generate" hỏng ở tầng deps, bẫy devOptional (npm --omit=dev vẫn để prisma CLI + Prisma Studio + react-dom
 * trong ảnh), argon2/sharp trên glibc vs musl, tắt êm 1,20 s mã 0, cache: đổi lockfile ở web ⇒ npm ci của API chạy lại.
 * Nguồn: Codecov "Bash Uploader Security Update" (04/2021, GET 200 25/11/2026).
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const NGAY_THO = `# Bản NGÂY THƠ — viết như tutorial đầu tiên trên mạng. Đừng dùng: bài 9.1 đo từng vấn đề của nó.
FROM node:22-slim
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build -w apps/api
EXPOSE 41810
CMD ["npm", "start", "-w", "apps/api"]`;

const NGAY_THO_OUT = `$ docker build -f Dockerfile.ngay-tho -t chiase-api:ngay-tho .
#5 [internal] load build context
#5 transferring context: 599.26MB 4.3s done
…
#8 [4/5] RUN npm ci
#8 26.73 added 424 packages, and audited 427 packages in 26s
#9 [5/5] RUN npm run build -w apps/api
#9 DONE 1.2s
#10 exporting layers 28.5s done
(tổng 72,5 s)

$ docker images chiase-api
IMAGE                 ID             DISK USAGE   CONTENT SIZE
chiase-api:ngay-tho   86735c63b94a       2.44GB          650MB

$ docker history --format '{{.Size}}\\t{{.CreatedBy}}' chiase-api:ngay-tho | head -5
0B	CMD ["npm" "start" "-w" "apps/api"]
0B	EXPOSE [41810/tcp]
541kB	RUN /bin/sh -c npm run build -w apps/api
874MB	RUN /bin/sh -c npm ci
671MB	COPY . .`;

const NT_BEN_TRONG = `$ docker run --rm chiase-api:ngay-tho sh -c 'id; ls -A /app/apps/api; du -sh /app/node_modules /app/apps/web /app/.git'
uid=0(root) gid=0(root) groups=0(root)
.env .env.example dist node_modules package.json prisma prisma.config.ts scripts src test tsconfig.json tsconfig.test.json vitest.config.ts
627M	/app/node_modules
3.3M	/app/apps/web
2.8M	/app/.git

$ docker run --rm chiase-api:ngay-tho grep -E 'JWT|SECRET' /app/apps/api/.env      # giá trị đã che khi chép vào bài
JWT_ACCESS_SECRET=…(đã che giá trị)
S3_SECRET_ACCESS_KEY=…(đã che giá trị)

$ docker run --rm chiase-api:ngay-tho ls /app/node_modules | grep -cE '^(vitest|typescript|prisma|oxlint|playwright-core|vite)$'
6`;

const DOCKERIGNORE = `# Ngữ cảnh dựng = cả repo (Dockerfile của api và web đều cần package-lock.json ở gốc).
# Thứ gì không có ở đây thì KHÔNG THỂ lọt vào ảnh — kể cả khi ai đó viết "COPY . ." (bài 9.1 đo: 599 MB và tệp .env).
**/node_modules
**/dist
coverage
.git
**/*.log

# Bí mật: .env của máy dev không bao giờ được rời máy dev
**/.env
**/.env.*
!**/.env.example

# Mã sinh ra — dựng lại trong ảnh bằng "prisma generate"
apps/api/src/generated`;

const DOCKERFILE = `# syntax=docker/dockerfile:1
# Ảnh API ChiaSe (bài 9.1). Dựng từ GỐC repo — ngữ cảnh cần package-lock.json của workspace:
#   docker build -f apps/api/Dockerfile -t chiase-api .
# Ba tầng dựng + một tầng chạy. Chỉ tầng "runtime" thành ảnh chạy production; "cong-cu" dùng cho migrate (bài 9.3).
# Ảnh nền: slim (Debian, glibc). Bài 9.1 đo cả node:22-alpine (musl): --build-arg NODE_IMAGE=node:22-alpine
ARG NODE_IMAGE=node:22-slim
FROM \${NODE_IMAGE} AS base
WORKDIR /app

# ── 1. deps: CHỈ tệp khai báo gói ⇒ tầng npm ci dùng lại cache tới khi package*.json đổi ──
# --ignore-scripts: postinstall "prisma generate" cần prisma/schema.prisma, lúc này CHƯA chép (bài 9.1 đo lỗi).
# argon2 và sharp không cần script: gói đã kèm sẵn bản nhị phân dựng trước cho linux-x64 (glibc lẫn musl).
FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
RUN --mount=type=cache,target=/root/.npm npm ci -w apps/api --ignore-scripts

# ── 2. build: mã nguồn + công cụ dev (tsc, prisma CLI) ──
FROM deps AS build
COPY apps/api/ apps/api/
RUN npm exec -w apps/api -- prisma generate &amp;&amp; npm run build -w apps/api

# ── 3. prod-deps: chỉ dependencies ──
# @prisma/client khai prisma + typescript là peer TUỲ CHỌN; vì chúng cũng là devDependency nên lockfile ghi
# "devOptional": true — và npm --omit=dev KHÔNG bỏ gói devOptional (bài 9.1 đo: prisma CLI, Prisma Studio, typescript
# vẫn nằm trong ảnh). Bước 2 xoá đúng các gói devOptional theo lockfile. Gói "optional" thường (bản nhị phân sharp) giữ nguyên.
FROM base AS prod-deps
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
RUN --mount=type=cache,target=/root/.npm npm ci -w apps/api --omit=dev --omit=peer --ignore-scripts \\
 &amp;&amp; node -e "const fs=require('fs');for(const[k,v]of Object.entries(require('./package-lock.json').packages))if(v.devOptional&amp;&amp;k.startsWith('node_modules/'))fs.rmSync(k,{recursive:true,force:true})"

# ── cong-cu: tầng build + migrations + scripts — compose chạy "prisma migrate deploy", "kho:chuan-bi" bằng nó ──
FROM build AS cong-cu
WORKDIR /app/apps/api
USER node
CMD ["npx", "prisma", "migrate", "deploy"]

# ── 4. runtime: ảnh production ──
FROM base AS runtime
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules node_modules
COPY --from=build /app/apps/api/dist apps/api/dist
COPY apps/api/package.json apps/api/
# Không chạy bằng root: ảnh node có sẵn người dùng "node" (uid 1000)
USER node
EXPOSE 41810
# Ảnh slim không có curl/wget ⇒ hỏi /api/health bằng chính node (fetch có sẵn từ Node 18)
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \\
  CMD ["node", "-e", "fetch('http://127.0.0.1:'+(process.env.PORT||41810)+'/api/health').then(r=&gt;process.exit(r.ok?0:1),()=&gt;process.exit(1))"]
# node là PID 1, nhận thẳng SIGTERM của "docker stop" (KHÔNG qua npm — bài 9.1 đo). Không --env-file: cấu hình đến từ môi trường.
CMD ["node", "apps/api/dist/server.js"]`;

const POSTINSTALL = `$ docker build -f apps/api/Dockerfile --target build -t chiase-api:thu .
#11 [deps 3/3] RUN npm ci -w apps/api
npm error code 1
npm error command sh -c prisma generate
npm error prisma:warn Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-1.1.x".
npm error Error: Could not find Prisma Schema that is required for this command.
npm error schema.prisma: file not found
npm error prisma/schema.prisma: file not found
ERROR: failed to solve: process "/bin/sh -c npm ci -w apps/api" did not complete successfully: exit code: 1`;

const PEER = `$ docker run --rm --entrypoint sh chiase-api:slim -c "du -sh /app/node_modules; du -s /app/node_modules/@prisma/* | sort -rn | head -4"
406M	/app/node_modules
72856	/app/node_modules/@prisma/client
43200	/app/node_modules/@prisma/studio-core
18764	/app/node_modules/@prisma/dev
5068	/app/node_modules/@prisma/query-plan-executor

$ docker run --rm chiase-api:prod-deps npm explain prisma
prisma@7.10.1
node_modules/prisma
  peerOptional prisma@"*" from @prisma/client@7.10.1
  node_modules/@prisma/client
    @prisma/client@"7.10.1" from api@0.0.0
    apps/api
      api@0.0.0

$ docker run --rm chiase-api:prod-deps npm explain react-dom
react-dom@19.3.1 peer
node_modules/react-dom
  peer react-dom@"^18.0.0 || ^19.0.0" from @prisma/studio-core@0.33.0
  node_modules/@prisma/studio-core
    @prisma/studio-core@"0.33.0" from prisma@7.10.1
    node_modules/prisma
      peerOptional prisma@"*" from @prisma/client@7.10.1`;

const CO_ANH = `$ docker images --format "table {{.Repository}}:{{.Tag}}\\t{{.Size}}" | grep chiase-api
chiase-api:cuoi (compose)	563MB
chiase-api:alpine	477MB
chiase-api:slim	563MB
chiase-api:prod-deps	864MB
chiase-api:ngay-tho	2.44GB`;

const BEN_TRONG = `$ docker run --rm --entrypoint sh chiase-api -c "id; ls -A /app/apps/api; du -sh /app/node_modules; ls /app/node_modules/.bin"
uid=1000(node) gid=1000(node) groups=1000(node)
dist
package.json
176M	/app/node_modules
cross-env cross-env-shell giget jiti node-gyp-build node-gyp-build-optional node-gyp-build-test node-which pglite-server prisma safe-regex2 semver tsc 
$ docker run --rm --entrypoint sh chiase-api -c "ls node_modules | grep -cE \\"^(typescript|prisma|vitest|tsx|oxlint|vite)$\\""
0`;

const NATIVE = `$ docker run --rm -w /app chiase-api:slim node --input-type=module -e '…argon2 ×7 + sharp ×5…'   # chiase-api:slim
argon2id trung vị 33.3 ms · sharp 5 ảnh webp 1600×1200 597 ms · libc glibc 2.36
$ docker run --rm -w /app chiase-api:alpine node --input-type=module -e '…argon2 ×7 + sharp ×5…'   # chiase-api:alpine
argon2id trung vị 36.2 ms · sharp 5 ảnh webp 1600×1200 702 ms · libc musl`;

const NPM_PID1 = `$ docker run -d --name api-thu --env-file env-thu.txt chiase-api:ngay-tho
$ docker top api-thu -o pid,args
PID                 COMMAND
2262941             npm start
2263115             sh -c node --env-file-if-exists=.env dist/server.js
2263116             node --env-file-if-exists=.env dist/server.js

$ docker stop api-thu &amp;&amp; docker logs api-thu
&gt; api@0.0.0 start
&gt; node --env-file-if-exists=.env dist/server.js

API ChiaSe đang nghe http://localhost:41815 (cho phép web http://localhost:41811)
npm error Lifecycle script \`start\` failed with error:
npm error path /app/apps/api
npm error workspace api@0.0.0
npm error command failed
npm error signal SIGTERM
npm error command sh -c node --env-file-if-exists=.env dist/server.js

$ docker inspect -f 'ExitCode={{.State.ExitCode}}' api-thu
ExitCode=1`;

const TAT_EM = `$ time docker compose stop api
real 1.20 s
$ docker compose logs api | tail -3
2026-11-25T03:15:10.583Z 6688454c-aabe-45d9-973f-aa44a8b78549 GET /api/health 200 15.9ms
Nhận SIGTERM, đang tắt…
Đã đóng HTTP và kết nối CSDL.
$ docker inspect -f 'ExitCode={{.State.ExitCode}}' fsp-chiase-api-1
ExitCode=0`;

const CACHE = `# Lượt A — vừa thêm zod vào apps/web/package.json (package-lock.json ở GỐC đổi theo). Mã API không đổi một dòng:
$ docker compose up -d --build --wait
[chuan-bi deps 3/3] RUN npm ci -w apps/api --ignore-scripts  ⇒ DONE 30.6s
[api prod-deps 3/3] RUN npm ci -w apps/api --omit=dev --omit=p  ⇒ DONE 29.8s
[api build 2/2] RUN npm exec -w apps/api -- prisma generate &amp;&amp;  ⇒ DONE 18.3s
(cả stack 244 s)

# Lượt B — chỉ sửa 4 tệp trong apps/api/src + nginx.conf:
$ docker compose up -d --build --wait
[api deps 3/3] RUN npm ci -w apps/api --ignore-scripts  ⇒ CACHED
[api prod-deps 3/3] RUN npm ci -w apps/api --omit=dev --omit=p  ⇒ CACHED
[chuan-bi build 2/2] RUN npm exec -w apps/api -- prisma genera  ⇒ DONE 9.1s
[web build 9/9] RUN npm run build -w apps/web  ⇒ DONE 4.1s
(cả stack 55 s)`;


const NGUON = [
  nguon('🛡️', 'Codecov — Bash Uploader Security Update (04/2021)', 'about.codecov.io', 'https://about.codecov.io/security-update/'),
  nguon('🐳', 'Docker — Multi-stage builds', 'docs.docker.com', 'https://docs.docker.com/build/building/multi-stage/'),
  nguon('🐳', 'Docker — Build secrets (không bao giờ ARG/ENV cho bí mật)', 'docs.docker.com', 'https://docs.docker.com/build/building/secrets/'),
].join('\n');

const THE = [
  lienKet({ khoa: 'docker', bai: 'dk-4-1-dockerfile-dau-tien', title: 'Docker 4.1 — Dockerfile đầu tiên, và ngữ cảnh dựng', sub: 'Vì sao "COPY . ." gửi 599 MB cho Docker trước cả khi dựng.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-6-1-multi-stage', title: 'Docker 6.1 — Dựng nhiều tầng, cho tử tế', sub: 'Nền của bốn tầng deps / build / prod-deps / runtime.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-6-2-chon-anh-nen', title: 'Docker 6.2 — Chọn ảnh nền, và cái bẫy musl', sub: 'slim hay alpine: đo chứ đừng tin lời đồn.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-1-3-vong-doi', title: 'Docker 1.3 — Vòng đời container, và PID 1', sub: 'Vì sao npm start làm docker stop thoát mã 1.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-17-4-bi-mat-cau-hinh', title: 'Node.js 17.4 — Bí mật: vẫn còn nguyên sau khi bị xoá', sub: 'rm ở tầng sau không xoá được tệp ở tầng trước.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '9.1 — A Dockerfile for the backend|||9.1 — Dockerfile cho backend',
  slug: 'fp-9-1-dockerfile-backend',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đóng gói API ChiaSe thành một ảnh Docker chạy được ở bất cứ đâu. Bắt đầu bằng bản Dockerfile "như tutorial" rồi đo từng vấn đề của nó: ngữ cảnh 599 MB, ảnh 2,44 GB, chạy bằng root, tệp .env và 6 công cụ dev nằm trong ảnh, npm làm PID 1 nên docker stop thoát mã 1. Sửa bằng .dockerignore + bốn tầng (deps, build, prod-deps, runtime): 563 MB, người dùng node, tắt êm 1,20 s mã 0. Ba cái bẫy đo thật: postinstall chạy prisma generate khi chưa có schema, npm --omit=dev vẫn để Prisma Studio trong ảnh (devOptional), và đổi lockfile ở web làm npm ci của API chạy lại. So slim với alpine cho argon2 + sharp.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Dockerize</span>
<h2>From "works on my machine" to an image that works anywhere</h2>
<p class="lead">Until now ChiaSe ran because <em>your</em> laptop had Node 22, the right <code>node_modules</code> and a <code>.env</code>. Chapter 11 runs it on a VPS that has none of that. An image packs the runtime, the dependencies and the compiled code into one thing that starts the same way everywhere. Writing one is easy; writing one that is small, has no secrets and stops cleanly is the work of this lesson.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">deps</span><span class="lz-d">only package*.json ⇒ npm ci (cached until they change)</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">build</span><span class="lz-d">source + prisma generate + tsc ⇒ dist/</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">prod-deps</span><span class="lz-d">npm ci --omit=dev, then remove devOptional packages</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">runtime</span><span class="lz-d">node_modules + dist only, USER node, HEALTHCHECK, CMD node</span></div>
</div>

<h3>1. The tutorial Dockerfile, measured</h3>
<pre><code class="language-dockerfile">${NGAY_THO}</code></pre>
<div class="out">${NGAY_THO_OUT}</div>
<p>It builds and runs. Now look inside:</p>
<div class="out">${NT_BEN_TRONG}</div>
<p>Four problems, each measured: the <strong>build context</strong> is 599 MB because <code>COPY . .</code> sends everything (your <code>node_modules</code>, the web app, <code>.git</code>) to Docker; the image is 2.44 GB on disk; it runs as <strong>root</strong>; and <code>apps/api/.env</code> — your real JWT key — is now inside an artifact you are about to push to a registry. Plus six dev tools (vitest, typescript, prisma CLI, oxlint, playwright, vite) that production never runs.</p>

<div class="pitfall co-tieu-de"><p><strong>Hacker's corner — Codecov, 2021.</strong> Codecov's own write-up: an error in their <em>Docker image creation process</em> let an attacker extract a credential from the image, and with it modify the Bash Uploader that thousands of CI pipelines downloaded. The tampered script ran from 31 January to 1 April 2021 and sent the environment variables of customers' CI jobs to the attacker. Anything inside an image belongs to everyone who can pull it — and deleting a file in a later layer does not remove it from the earlier one (Node.js 17.4 shows this). Defence: secrets never enter the build context at all.</p></div>

<h3>2. <code>.dockerignore</code>: what is not sent cannot leak</h3>
<pre><code>${DOCKERIGNORE}</code></pre>
<p>This file is the first line of defence, not <code>COPY</code> discipline: the day someone writes <code>COPY . .</code> again, <code>.env</code> is still not in the context. The context dropped from 599 MB to 16 kB.</p>

<h3>3. Four stages</h3>
<pre><code class="language-dockerfile">${DOCKERFILE}</code></pre>
<p><strong>Order is cache.</strong> Docker reuses a layer while its inputs are unchanged. Copying only <code>package.json</code> + <code>package-lock.json</code> first means editing a <code>.ts</code> file does not reinstall 393 packages. Measured on two rebuilds:</p>
<div class="out">${CACHE}</div>
<p>Run B is the everyday case: dependencies CACHED, only <code>tsc</code> and <code>vite build</code> rerun, 55 s for the whole stack. Run A is the monorepo trap: adding a package to the <em>web</em> app changed the one root lockfile, so the API's <code>npm ci</code> reran too (30.6 s + 29.8 s). Acceptable here; in a big monorepo it is why teams use <code>turbo prune</code> or per-app lockfiles.</p>

<p><strong>Trap 1 — postinstall.</strong> <code>apps/api/package.json</code> has <code>"postinstall": "prisma generate"</code> (handy in dev). In the deps stage the schema is not copied yet:</p>
<div class="out">${POSTINSTALL}</div>
<p>Hence <code>--ignore-scripts</code> in deps, and an explicit <code>prisma generate</code> in build once the source is there. argon2 and sharp do not need install scripts: both ship prebuilt binaries for linux-x64 glibc and musl.</p>

<p><strong>Trap 2 — <code>--omit=dev</code> keeps "devOptional".</strong> The first prod-deps stage was 864 MB. Asking npm why Prisma's CLI was still there:</p>
<div class="out">${PEER}</div>
<p><code>@prisma/client</code> declares <code>prisma</code> as an <em>optional peer</em>; since <code>prisma</code> is also our devDependency, the lockfile marks it <code>"devOptional": true</code>, and <code>--omit=dev</code> keeps such packages. That dragged in Prisma Studio and through it React. The stage now deletes every <code>devOptional</code> package listed in the lockfile — a rule read from data, not a hand-written list that rots.</p>

<h3>4. Results</h3>
<div class="out">${CO_ANH}</div>
<div class="out">${BEN_TRONG}</div>
<p>uid 1000, only <code>dist</code> and <code>package.json</code>, no source, no <code>.env</code>, 176 MB of runtime dependencies, zero dev tools. The names left in <code>.bin</code> (<code>prisma</code>, <code>tsc</code>) are dangling links to packages that were removed — they cannot run. 2.44 GB ⇒ 563 MB.</p>

<h3>5. slim or alpine?</h3>
<p>Alpine is smaller (477 vs 563 MB) but uses musl instead of glibc, and our two hot paths are native code. Same machine, same commands:</p>
<div class="out">${NATIVE}</div>
<p>Both work (prebuilt binaries exist for both libcs); musl is 9% slower on argon2 and 18% slower on sharp here. 86 MB is not worth a slower login for every user, so ChiaSe stays on <code>node:22-slim</code>; the <code>NODE_IMAGE</code> build arg keeps the experiment one flag away. The real danger with alpine is a native module whose binary was built for glibc: it builds green and crashes at start — exactly what took cuongthai.com's API down with 502s for seven minutes on 18/08/2026 (a Prisma engine for <code>debian-openssl-3.0.x</code> inside a musl image). Lesson: a green build does not prove the image runs; start it.</p>

<h3>6. PID 1 and SIGTERM</h3>
<p><code>docker stop</code> sends SIGTERM to PID 1, waits 10 s, then SIGKILL. With <code>CMD npm start</code>, PID 1 is npm:</p>
<div class="out">${NPM_PID1}</div>
<p>Three processes, npm reports a failure, exit code 1 — an orchestrator reads that as a crash. With <code>CMD ["node", "apps/api/dist/server.js"]</code> (exec form, no shell, no npm) node receives the signal itself and the shutdown code from Chapter 7 runs:</p>
<div class="out">${TAT_EM}</div>
<p>1.20 s, exit 0, both log lines from <code>server.ts</code>. The <code>HEALTHCHECK</code> uses <code>node -e "fetch(...)"</code> because the slim image has no curl; lesson 9.3 measures what it does when the database dies.</p>

${spring(true, 'Spring Boot has the same four ideas: a build stage (Maven/Gradle) and a JRE-only runtime stage, layered jars so dependencies cache separately from your classes, a non-root user, and java as PID 1 (exec form) so SIGTERM triggers graceful shutdown.', [
  ['sb-17-1-dockerfile-spring', 'Spring Boot 17.1 — Dockerfile for a Spring Boot app'],
  ['sb-17-2-application-properties-docker', 'Spring Boot 17.2 — Configuration for containers'],
])}

<h3>Everyday analogy</h3>
<p>Moving house: the tutorial Dockerfile throws the whole flat into the truck — including the drawer with your bank PIN. The real one packs only what the new place needs, in labelled boxes (stages), and the box with the furniture (dependencies) is packed once and reused for every move until the furniture changes.</p>

<h3>On the job</h3>
<p>On an outsourcing project you will often inherit a Dockerfile like section 1. Before you change anything, measure it with the same four commands (<code>docker images</code>, <code>docker history</code>, <code>id</code>, <code>ls</code>) and put the numbers in the pull request: "2.44 GB ⇒ 563 MB, no longer root, .env no longer in the image". Reviewers merge numbers faster than opinions.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"Why multi-stage builds?"</strong> — Build tools stay in build stages; the runtime image carries only what runs: smaller, fewer CVEs, nothing to leak.</li>
<li><strong>"Why copy package.json before the source?"</strong> — Layer cache: dependencies reinstall only when the manifest/lockfile changes.</li>
<li><strong>"Why not <code>CMD npm start</code>?"</strong> — npm becomes PID 1 and does not forward SIGTERM cleanly; the app gets killed instead of shutting down (exit 1 measured).</li>
<li><strong>"How do you keep secrets out of images?"</strong> — .dockerignore, runtime environment variables, BuildKit secret mounts for build-time needs; never ARG/ENV/COPY.</li>
<li><strong>"Alpine or slim?"</strong> — Measure: musl vs glibc matters for native modules; size is not the only cost.</li>
</ol>

<h3>🧪 Lab 9.1</h3>
<div class="callout ok">
<ol>
<li>Build the tutorial version (<code>docker build -f Dockerfile.ngay-tho -t chiase-api:ngay-tho .</code>) and record context size, image size, <code>id</code>, and whether <code>.env</code> is inside.</li>
<li>Write <code>.dockerignore</code>, then the four-stage Dockerfile. Reproduce trap 1 by removing <code>--ignore-scripts</code>.</li>
<li>Build the prod-deps stage alone (<code>--target prod-deps</code>) and find, with <code>npm explain</code>, why <code>prisma</code> is there.</li>
<li>Edit one <code>.ts</code> file and rebuild: which steps are CACHED?</li>
<li>Run the image with an env file, then <code>docker stop</code> it: time and exit code.</li>
</ol>
<p><strong>Done when:</strong> image ≤ 600 MB, <code>id</code> is not root, no <code>.env</code>/<code>src</code>/dev tools inside, <code>docker stop</code> under 2 s with exit 0, and a source-only change leaves both <code>npm ci</code> steps CACHED.</p>
</div>
<details><summary>Solution</summary>
<p>Files <code>.dockerignore</code> and <code>apps/api/Dockerfile</code> as printed above (branch <code>ch9/docker</code>). The devOptional cleanup is the <code>node -e</code> line at the end of the prod-deps stage.</p>
</details>

<div class="kv-grid">
  <div class="kv"><span class="k">build context</span><span class="v">The files sent to the builder; .dockerignore filters it.</span></div>
  <div class="kv"><span class="k">multi-stage build</span><span class="v">Several FROM stages; the final image copies only results.</span></div>
  <div class="kv"><span class="k">layer cache</span><span class="v">A step is reused while its inputs are byte-identical.</span></div>
  <div class="kv"><span class="k">devOptional</span><span class="v">Lockfile flag: dev and optional-peer at once; --omit=dev keeps it.</span></div>
  <div class="kv"><span class="k">PID 1</span><span class="v">The process that receives docker stop's SIGTERM.</span></div>
  <div class="kv"><span class="k">exec form</span><span class="v">CMD ["node", "…"]: no shell in between.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Measure the naive image first: context, size, user, secrets, tools.</li>
<li>.dockerignore keeps .env and node_modules out of the context for good.</li>
<li>Four stages; manifests before source so dependencies stay cached.</li>
<li>--ignore-scripts in deps; delete devOptional packages for a real production install.</li>
<li>node as PID 1 in exec form: 1.20 s graceful stop, exit 0.</li>
<li>slim over alpine here, by measurement; a green build is not a running image.</li>
</ul>
${NGUON}
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Docker hoá</span>
<h2>Từ "máy em chạy được" tới một ảnh chạy ở đâu cũng được</h2>
<p class="lead">Tới giờ ChiaSe chạy được là nhờ máy <em>của bạn</em> có Node 22, có đúng <code>node_modules</code> và có tệp <code>.env</code>. Chương 11 sẽ chạy nó trên một VPS chẳng có thứ nào trong số đó. Ảnh Docker gói môi trường chạy, thư viện và mã đã biên dịch thành một khối, khởi động giống hệt nhau ở mọi nơi. Viết một Dockerfile thì dễ; viết một cái nhỏ, không chứa bí mật và tắt êm mới là việc của bài này.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">deps</span><span class="lz-d">chỉ package*.json ⇒ npm ci (dùng cache tới khi chúng đổi)</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">build</span><span class="lz-d">mã nguồn + prisma generate + tsc ⇒ dist/</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">prod-deps</span><span class="lz-d">npm ci --omit=dev, rồi xoá gói devOptional</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">runtime</span><span class="lz-d">chỉ node_modules + dist, USER node, HEALTHCHECK, CMD node</span></div>
</div>

<h3>1. Dockerfile "như tutorial", đem đi đo</h3>
<pre><code class="language-dockerfile">${NGAY_THO}</code></pre>
<div class="out">${NGAY_THO_OUT}</div>
<p>Dựng được, chạy được. Giờ nhìn vào trong:</p>
<div class="out">${NT_BEN_TRONG}</div>
<p>Bốn vấn đề, cái nào cũng có số: <strong>ngữ cảnh dựng</strong> 599 MB vì <code>COPY . .</code> gửi mọi thứ (<code>node_modules</code> của bạn, cả ứng dụng web, thư mục <code>.git</code>) cho Docker; ảnh nặng 2,44 GB trên đĩa; chạy bằng <strong>root</strong>; và <code>apps/api/.env</code> — khoá JWT thật của bạn — giờ nằm trong một thứ bạn sắp đẩy lên registry. Thêm sáu công cụ dev (vitest, typescript, prisma CLI, oxlint, playwright, vite) mà production không bao giờ chạy.</p>

<div class="pitfall co-tieu-de"><p><strong>Góc hacker — Codecov, 2021.</strong> Theo chính bài công bố của Codecov: một lỗi trong <em>quy trình dựng ảnh Docker</em> của họ cho phép kẻ tấn công lấy ra một thông tin xác thực từ ảnh, rồi dùng nó sửa script Bash Uploader mà hàng nghìn pipeline CI tải về mỗi ngày. Bản script bị sửa chạy từ 31/01 tới 01/04/2021 và gửi biến môi trường trong job CI của khách hàng về cho kẻ tấn công. Thứ gì nằm trong ảnh là của bất kỳ ai kéo được ảnh — và xoá tệp ở tầng sau KHÔNG gỡ nó khỏi tầng trước (bài Node.js 17.4 đo điều này). Cách phòng: bí mật không bao giờ được vào ngữ cảnh dựng ngay từ đầu.</p></div>

<h3>2. <code>.dockerignore</code>: không gửi thì không thể lộ</h3>
<pre><code>${DOCKERIGNORE}</code></pre>
<p>Tệp này là lớp phòng thủ đầu tiên, không phải sự cẩn thận khi viết <code>COPY</code>: hôm nào có người viết lại <code>COPY . .</code>, <code>.env</code> vẫn không có trong ngữ cảnh. Ngữ cảnh giảm từ 599 MB xuống 16 kB.</p>

<h3>3. Bốn tầng</h3>
<pre><code class="language-dockerfile">${DOCKERFILE}</code></pre>
<p><strong>Thứ tự dòng chính là cache.</strong> Docker dùng lại một tầng khi đầu vào của nó không đổi. Chép <code>package.json</code> + <code>package-lock.json</code> trước, mã nguồn sau ⇒ sửa một tệp <code>.ts</code> không cài lại 393 gói. Đo trên hai lượt dựng lại:</p>
<div class="out">${CACHE}</div>
<p>Lượt B là chuyện hằng ngày: thư viện CACHED, chỉ <code>tsc</code> và <code>vite build</code> chạy lại, cả stack 55 s. Lượt A là cái bẫy của monorepo: thêm một gói cho ứng dụng <em>web</em> làm đổi tệp lockfile duy nhất ở gốc ⇒ <code>npm ci</code> của API cũng chạy lại (30,6 s + 29,8 s) dù API không đổi gì. Ở cỡ ChiaSe thì chấp nhận được; monorepo lớn thì đây là lý do người ta dùng <code>turbo prune</code> hoặc lockfile riêng cho từng ứng dụng.</p>

<p><strong>Bẫy 1 — postinstall.</strong> <code>apps/api/package.json</code> có <code>"postinstall": "prisma generate"</code> (tiện lúc dev). Ở tầng deps, schema chưa được chép vào:</p>
<div class="out">${POSTINSTALL}</div>
<p>Vì thế tầng deps có <code>--ignore-scripts</code>, còn <code>prisma generate</code> được gọi rõ ràng ở tầng build khi mã nguồn đã có. argon2 và sharp không cần script cài đặt: cả hai đều kèm sẵn bản nhị phân dựng trước cho linux-x64, cả glibc lẫn musl.</p>

<p><strong>Bẫy 2 — <code>--omit=dev</code> vẫn giữ gói "devOptional".</strong> Bản prod-deps đầu tiên nặng 864 MB. Hỏi npm vì sao prisma CLI vẫn còn đó:</p>
<div class="out">${PEER}</div>
<p><code>@prisma/client</code> khai <code>prisma</code> là <em>peer tuỳ chọn</em>; mà <code>prisma</code> cũng là devDependency của ta ⇒ lockfile ghi <code>"devOptional": true</code>, và <code>--omit=dev</code> giữ lại loại gói này. Nó kéo theo Prisma Studio, và qua Studio là cả React. Tầng prod-deps giờ xoá mọi gói <code>devOptional</code> mà lockfile liệt kê — luật đọc từ dữ liệu, không phải một danh sách viết tay sẽ cũ dần.</p>

<h3>4. Kết quả</h3>
<div class="out">${CO_ANH}</div>
<div class="out">${BEN_TRONG}</div>
<p>uid 1000, chỉ có <code>dist</code> và <code>package.json</code>, không mã nguồn, không <code>.env</code>, 176 MB thư viện chạy, 0 công cụ dev. Mấy cái tên còn lại trong <code>.bin</code> (<code>prisma</code>, <code>tsc</code>) là liên kết chết tới gói đã bị xoá — không chạy được. 2,44 GB ⇒ 563 MB.</p>

<h3>5. slim hay alpine?</h3>
<p>Alpine nhỏ hơn (477 so với 563 MB) nhưng dùng musl thay cho glibc, mà hai đường nóng nhất của ta là mã native. Cùng máy, cùng lệnh:</p>
<div class="out">${NATIVE}</div>
<p>Cả hai đều chạy (có bản nhị phân dựng sẵn cho cả hai loại libc); ở đây musl chậm hơn 9% với argon2 và 18% với sharp. 86 MB không đáng để mọi lượt đăng nhập chậm đi, nên ChiaSe giữ <code>node:22-slim</code>; build-arg <code>NODE_IMAGE</code> để thí nghiệm chỉ cách một cờ. Nguy hiểm thật của alpine là một gói native có bản nhị phân dựng cho glibc: dựng xanh, khởi động là chết — đúng chuyện đã làm API của chính cuongthai.com trả 502 bảy phút ngày 18/08/2026 (engine Prisma bản <code>debian-openssl-3.0.x</code> trong ảnh musl). Bài học: dựng xanh không chứng minh ảnh chạy được; phải khởi động nó.</p>

<h3>6. PID 1 và SIGTERM</h3>
<p><code>docker stop</code> gửi SIGTERM cho PID 1, chờ 10 s rồi SIGKILL. Với <code>CMD npm start</code>, PID 1 là npm:</p>
<div class="out">${NPM_PID1}</div>
<p>Ba tiến trình, npm báo lỗi, mã thoát 1 — hệ thống điều phối đọc đó là "sập". Với <code>CMD ["node", "apps/api/dist/server.js"]</code> (dạng exec, không shell, không npm) chính node nhận tín hiệu và đoạn tắt êm của Chương 7 chạy:</p>
<div class="out">${TAT_EM}</div>
<p>1,20 s, mã 0, đủ hai dòng log của <code>server.ts</code>. <code>HEALTHCHECK</code> dùng <code>node -e "fetch(...)"</code> vì ảnh slim không có curl; bài 9.3 đo xem nó làm gì khi CSDL chết.</p>

${spring(false, 'Spring Boot có đúng bốn ý này: tầng dựng (Maven/Gradle) và tầng chạy chỉ có JRE, layered jar để thư viện được cache tách khỏi class của bạn, người dùng không phải root, và java là PID 1 (dạng exec) để SIGTERM kích hoạt graceful shutdown.', [
  ['sb-17-1-dockerfile-spring', 'Spring Boot 17.1 — Dockerfile cho ứng dụng Spring Boot'],
  ['sb-17-2-application-properties-docker', 'Spring Boot 17.2 — Cấu hình cho môi trường container'],
])}

<h3>Liên hệ đời thường</h3>
<p>Chuyển nhà: Dockerfile "như tutorial" bê cả căn phòng lên xe — kể cả ngăn kéo có mã PIN ngân hàng. Bản thật chỉ đóng thứ nhà mới cần, vào những thùng có dán nhãn (các tầng), và thùng đồ gỗ (thư viện) đóng một lần rồi dùng lại cho mọi lần chuyển, tới khi đồ gỗ thay đổi.</p>

<h3>Tình huống đi làm thật</h3>
<p>Ở dự án outsourcing bạn sẽ hay thừa hưởng một Dockerfile giống mục 1. Trước khi sửa gì, đo nó bằng đúng bốn lệnh (<code>docker images</code>, <code>docker history</code>, <code>id</code>, <code>ls</code>) và ghi số vào pull request: "2,44 GB ⇒ 563 MB, không còn root, .env không còn trong ảnh". Reviewer duyệt con số nhanh hơn duyệt ý kiến.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Vì sao dựng nhiều tầng?"</strong> — Công cụ dựng ở lại tầng dựng; ảnh chạy chỉ mang thứ cần chạy: nhỏ hơn, ít CVE hơn, không có gì để lộ.</li>
<li><strong>"Vì sao chép package.json trước mã nguồn?"</strong> — Cache tầng: thư viện chỉ cài lại khi manifest/lockfile đổi.</li>
<li><strong>"Sao không dùng <code>CMD npm start</code>?"</strong> — npm thành PID 1 và không chuyển SIGTERM tử tế; ứng dụng bị giết thay vì tự tắt (đo: mã thoát 1).</li>
<li><strong>"Giữ bí mật khỏi ảnh thế nào?"</strong> — .dockerignore, biến môi trường lúc chạy, BuildKit secret mount nếu bước dựng cần; không bao giờ ARG/ENV/COPY.</li>
<li><strong>"Alpine hay slim?"</strong> — Đo: musl hay glibc quan trọng với gói native; cỡ ảnh không phải cái giá duy nhất.</li>
</ol>

<h3>🧪 Lab 9.1</h3>
<div class="callout ok">
<ol>
<li>Dựng bản tutorial (<code>docker build -f Dockerfile.ngay-tho -t chiase-api:ngay-tho .</code>), ghi lại cỡ ngữ cảnh, cỡ ảnh, <code>id</code>, và <code>.env</code> có nằm trong ảnh không.</li>
<li>Viết <code>.dockerignore</code>, rồi Dockerfile bốn tầng. Tái hiện bẫy 1 bằng cách bỏ <code>--ignore-scripts</code>.</li>
<li>Dựng riêng tầng prod-deps (<code>--target prod-deps</code>) và dùng <code>npm explain</code> tìm vì sao <code>prisma</code> còn đó.</li>
<li>Sửa một tệp <code>.ts</code> rồi dựng lại: bước nào CACHED?</li>
<li>Chạy ảnh với một tệp env, rồi <code>docker stop</code>: mất bao lâu, mã thoát bao nhiêu.</li>
</ol>
<p><strong>Xong khi:</strong> ảnh ≤ 600 MB, <code>id</code> không phải root, không có <code>.env</code>/<code>src</code>/công cụ dev trong ảnh, <code>docker stop</code> dưới 2 s với mã 0, và sửa riêng mã nguồn thì cả hai bước <code>npm ci</code> đều CACHED.</p>
</div>
<details><summary>Lời giải</summary>
<p>Tệp <code>.dockerignore</code> và <code>apps/api/Dockerfile</code> in ở trên (nhánh <code>ch9/docker</code>). Phần dọn devOptional là dòng <code>node -e</code> cuối tầng prod-deps.</p>
</details>

<div class="kv-grid">
  <div class="kv"><span class="k">ngữ cảnh dựng</span><span class="v">Các tệp gửi cho bộ dựng; .dockerignore lọc nó.</span></div>
  <div class="kv"><span class="k">dựng nhiều tầng</span><span class="v">Nhiều FROM; ảnh cuối chỉ chép kết quả.</span></div>
  <div class="kv"><span class="k">cache tầng</span><span class="v">Một bước được dùng lại khi đầu vào giống hệt từng byte.</span></div>
  <div class="kv"><span class="k">devOptional</span><span class="v">Cờ trong lockfile: vừa dev vừa peer tuỳ chọn; --omit=dev giữ lại.</span></div>
  <div class="kv"><span class="k">PID 1</span><span class="v">Tiến trình nhận SIGTERM của docker stop.</span></div>
  <div class="kv"><span class="k">dạng exec</span><span class="v">CMD ["node", "…"]: không có shell chen giữa.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đo ảnh ngây thơ trước: ngữ cảnh, cỡ, người dùng, bí mật, công cụ.</li>
<li>.dockerignore chặn .env và node_modules khỏi ngữ cảnh, vĩnh viễn.</li>
<li>Bốn tầng; manifest trước mã nguồn để thư viện luôn được cache.</li>
<li>--ignore-scripts ở deps; xoá gói devOptional để có bản cài production thật.</li>
<li>node là PID 1 dạng exec: tắt êm 1,20 s, mã 0.</li>
<li>Chọn slim thay alpine ở đây, theo số đo; dựng xanh chưa phải ảnh chạy được.</li>
</ul>
${NGUON}
${THE}
</div>
`,
};
