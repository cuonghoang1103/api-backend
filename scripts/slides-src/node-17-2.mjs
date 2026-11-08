/**
 * node-17-2 — Node.js · Chapter 17 · Lesson 17.2 "Layer cache: the line order that makes builds 9.3× slower" (slide EN, đợt 12 — 08/11/2026). MỘT deck, MỘT tập node-17-2.
 * Nguồn: nodejs-17-2-cache-tang. Output THẬT: that/c17/{cache, ignore, argtop, glob, platform, prod-deploy} (Docker Desktop 29.8.0, BuildKit, arm64, máy bận ⇒ trung vị 5).
 * Khác web: rebuild 4,36 / 0,47 / 1,34 s ⇒ 9,3× (web 3,00 / 0,54 / 1,13 ⇒ 5,6×) · context 66,16 MB → 465 B, build 10,76 → 5,98 s (1,8×), ảnh 103 → 84,3 MB
 *   (web 64,27 MB → 235 B, 2,1×, 97,2 → 79,6) · THÊM: .env GIẢ lọt vào ảnh khi thiếu .dockerignore; ARG đầu tệp làm npm ci chạy lại (6,53 vs 1,79 s); amd64 giả lập 12,5× chậm.
 *   Website: từ 18/08/2026 ảnh build ở MÁY NHÀ song song (deploy-nha.sh), VPS chỉ kéo + tráo — bài web còn ghi "build trên VPS, tuần tự" (đã sửa ở nguồn).
 */
import { lamDeck, two, box, cards, flow, bang, TT, thanh, steps, sql, vsd } from './_c9-chung.mjs';

export const deck = { key: 'node-17-2', code: 'NODE 17.2', title: 'Layer cache: the line order that makes builds 9.3× slower', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const D = (src, o = {}) => sql(src, { lang: 'dockerfile', sm: o.sm ?? true, hl: o.hl });
const B = (src, o = {}) => sql(src, { lang: 'bash', sm: o.sm ?? true, hl: o.hl });

export const slides = lamDeck({ chuong: 'Chapter 17 — Docker and deployment', bai: '17.2' }, [
  { cover: true, t: 'Layer cache: the line order<br>that makes builds 9.3× slower', sub: 'Docker reuses every layer whose inputs did not change. The order of lines in your Dockerfile decides how long every future build takes.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The cache rule in one sentence — and the order it implies</li>
<li>One swap of two lines: 4.36 s against 0.47 s, measured</li>
<li>.dockerignore: 66 MB of context, and a .env inside the image</li>
<li>Three ways a cached build silently stops being cached</li>
<li>Building for a machine that is not yours: arm64 vs amd64</li>
</ul>` + box('Why it matters to you', 'You rebuild on every commit, forever. On a real backend the difference is seconds against minutes — on every deploy.', 'lam') },

  { t: 'The rule, in one sentence', to: true, giua: true, body: box('When an instruction\'s inputs change', 'that layer AND EVERY LAYER AFTER IT is rebuilt. Everything above it is reused from the cache.', 'cam') +
    flow([{ t: 'FROM', s: 'base image', mau: LAM }, { t: 'COPY package*', s: 'changes monthly', mau: NODE }, { t: 'RUN npm ci', s: 'the expensive one', mau: CAM }, { t: 'COPY src', s: 'changes every commit', mau: DO }, { t: 'RUN build', s: 'work you must redo', mau: TIM }], { h: 130 }) +
    box('So', 'Put what rarely changes at the TOP and what changes on every commit at the BOTTOM. Your source changes every commit; package.json about once a month.', 'xanh') +
    box('What the cache compares', 'For COPY: a checksum of the files being copied. For RUN: the command text plus the layer below it. Never the clock, never the network.', 'lam') },

  { t: 'One swap of two lines', to: true, giua: true, body: vsd(D(`FROM node:22-slim
WORKDIR /app
COPY . .               # any file changed?
RUN npm ci --omit=dev  # then npm ci again
CMD ["node", "src/index.js"]`, { sm: false, hl: [3, 4] }), D(`FROM node:22-slim
WORKDIR /app
COPY package*.json ./  # just these two
RUN npm ci --omit=dev  # cached
COPY src ./src         # code, AFTER
CMD ["node", "src/index.js"]`, { sm: false, hl: [3, 5] }), '✗ Every edit reinstalls', '✓ Edits skip the install') +
    box('Same files, same result, different order', 'The image contents are identical. Only how much work the next build repeats is different.', 'lam') +
    box('Who pays for the left one', 'Every commit, every developer, every CI run and every deploy pays a full npm ci — for a change that touched one source file.', 'do2') },

  { t: 'Measured: change one line, rebuild', to: true, giua: true, body: thanh([['COPY . . first', 4.36, DO, '4.36 s · npm ci re-ran'], ['package*.json first', 0.47, NODE, '0.47 s · cached'], ['multi-stage', 1.34, LAM, '1.34 s · cached, build re-ran']], { w: 1100, x0: 290, wMax: 520, h0: 60, chu: 22, ghi: 'rebuild after editing src/index.js · warm cache · median of 5 · real' }) +
    TT('c17/cache', 2, 6, 'node cache.mjs · Docker 29.8.0 BuildKit · real', { n: 104, hl: [2, 5], sm: true }) +
    box('9.3× on a three-package app', 'Here npm ci takes ~4 s. On a real backend with native modules it is minutes — on every deploy, purely because of line order. The web lesson measured 5.6× on another machine.', 'cam') },

  { t: 'The order, layer by layer', to: true, giua: true, body: steps([
    '<b>FROM + system packages</b> (apt-get) — changes every few months',
    '<b>COPY package*.json ./</b> — ONLY these two files; nothing else copied yet',
    '<b>RUN npm ci</b> — the most expensive layer, cached until the lockfile changes',
    '<b>COPY the source</b> — changes every commit, so it must come AFTER the expensive layer',
    '<b>RUN build</b> — re-runs on every code change, but that is work you genuinely have to do',
  ]) + box('Multi-stage keeps the same order inside each stage', 'In 17.1\'s Dockerfile both npm ci layers stayed cached; only the build step re-ran (1.34 s).', 'lam') +
    TT('c17/argtop', 7, 11, 'what a well-ordered rebuild looks like: everything above the change says CACHED · real', { n: 104, sm: true }) },

  { t: 'A real trap: a COPY that matches nothing', to: true, giua: true, body: TT('c17/glob', 2, 8, 'package.json is in ./api, the Dockerfile in the root · real', { n: 104, hl: [3, 4, 5], sm: false }) +
    two(box('COPY with a glob does not complain', 'package*.json matched zero files and the step finished in 0.0 s — "DONE".', 'do2'), box('The error arrives one step later', 'npm ci says it needs a lockfile, and everyone starts blaming npm. Check the build context first.', 'cam')) },

  { t: '.dockerignore: the file everyone forgets', to: true, giua: true, body: flow([{ t: 'your project folder', s: 'node_modules, .git, .env…', mau: TIM }, { t: 'build context', s: 'uploaded BEFORE line 1', mau: CAM }, { t: 'BuildKit', s: 'runs the Dockerfile', mau: LAM }, { t: 'COPY . .', s: 'copies what was sent', mau: DO }], { h: 130 }) +
    box('The build context', 'Before Docker runs a single instruction, it sends the folder you pointed at to the build engine. With COPY . . in the Dockerfile, whatever was sent ends up in the image.', 'lam') +
    box('.dockerignore is the filter', 'Same syntax as .gitignore. What it lists is never sent, so it can never be copied.', 'xanh') +
    box('On a Mac it also crosses a VM', 'Docker Desktop runs the build engine inside a Linux virtual machine. The context is copied into that VM on every build.', 'cam') },

  { t: 'With and without it, measured', to: true, giua: true, body: TT('c17/ignore', 2, 14, 'the same COPY . . Dockerfile · project with the Mac\'s node_modules and a FAKE .env · real', { n: 104, hl: [3, 6, 7, 11, 12], sm: true }) +
    bang(['', 'context sent', 'build (no cache)', 'image'], [['without', '66.16 MB', '10.76 s', '103 MB'], ['with', '465 B', '5.98 s', '84.3 MB']], { co: 22, hl: [1] }) },

  { t: 'Four lines, and why each one', to: true, giua: true, body: two(sql(`# .dockerignore
node_modules
.git
.env
dist`, { lang: 'bash', sm: false }), box('No reason not to have it', 'Four lines. Commit it on day one, next to the Dockerfile.', 'xanh')) +
    cards([['node_modules', 'Wrong OS (17.1: invalid ELF header), large, and npm ci reinstalls it anyway.'], ['.git', 'The whole history — including the secret you deleted in a later commit.'], ['.env', 'Measured: the FAKE database URL was readable inside the image.'], ['dist', 'Rebuilt inside the image. Your machine\'s copy only confuses.']], 4) +
    B(`docker build --progress=plain . 2>&1 | grep 'transferring context'   # what did I just send?`, { sm: false }) },

  { t: 'Why the context can look small anyway', to: true, giua: true, body: two(box('BuildKit only sends what is referenced', 'With COPY package*.json + COPY src, only those paths travel — even with no .dockerignore. The 66 MB appeared only with COPY . .', 'lam'),
    box('Useful to know, bad to rely on', 'Selective COPY and .dockerignore protect against different mistakes. The second one keeps working after someone adds COPY . . in six months.', 'cam')) +
    box('Two separate guards', 'Selective COPY: decides what goes INTO the image. .dockerignore: decides what may ever LEAVE your machine for the builder.', 'xanh') +
    D(`COPY package*.json ./     # selective: only these travel and land
RUN npm ci --omit=dev
COPY src ./src            # … and only this folder`, { sm: false }) },

  { t: 'Cache invalidation you did not intend', to: true, giua: true, body: cards([['A moving base tag', 'node:22-slim re-pulled with a new patch release is a new bottom layer: everything above rebuilds. Pin it (17.1).'], ['An empty CI cache', 'A fresh runner every run is a cold cache every run. Without --cache-from pointed at a registry, "optimising layer order" does nothing in CI.'], ['An ARG placed too high', 'A build arg that changes every build (a timestamp) invalidates every RUN after its ARG line. Declare it as late as possible.'], ['COPY . . before installing', 'The mistake at the top of this lesson: any change to any file re-runs the install.']], 2) +
    box('How to see it', 'docker build --progress=plain prints CACHED next to every reused step. If npm ci is not CACHED after a code-only change, something above it changed.', 'lam') },

  { t: 'An ARG at the top, measured', to: true, giua: true, body: TT('c17/argtop', 2, 11, 'second build with a new BUILD_TIME · docker build --progress=plain · real', { n: 104, hl: [3, 8], sm: false }) +
    two(box('ARG at the top: 6.53 s', 'npm ci ran again, and everything after it.', 'do2'), box('ARG right before its RUN: 1.79 s', 'Only the one step that uses it re-ran.', 'xanh')) },

  { t: 'Building for a machine that is not yours', to: true, giua: true, body: B(`# build the architecture of the target machine
docker build --platform linux/amd64 -t app:1.4.2 .

# or build both and push straight to the registry
docker buildx build --platform linux/amd64,linux/arm64 \\
  -t ghcr.io/me/app:1.4.2 --push .`, { sm: false }) +
    two(box('Your Mac is arm64', 'An Apple Silicon Mac builds linux/arm64 images. A typical VPS is linux/amd64.', 'lam'), box('The wrong one either refuses', 'with "exec format error" — or runs through emulation, several times slower.', 'do2')) +
    B(`docker image inspect -f '{{.Os}}/{{.Architecture}}' app:1.4.2    # check before you push`, { sm: false }) },

  { t: 'Emulation, measured', to: true, giua: true, body: TT('c17/platform', 4, 12, 'the same image built and run as arm64 and as amd64 on this arm64 Mac · real', { n: 104, hl: [3, 7, 9], sm: false }) +
    two(box('CPU work: 12.5× slower', 'The same JavaScript loop: 369 ms native, 4,609 ms emulated.', 'do2'), box('Build: about the same', 'npm ci waits on the network, not the CPU. Emulation hurts what COMPUTES.', 'cam')) },

  { t: 'Or do not build on your laptop at all', to: true, giua: true, body: cards([['Build on the target', 'No architecture question at all. Costs the server\'s CPU and RAM while it is also serving traffic.'], ['Build on a machine of the same architecture', 'A CI runner or a spare box. Push to a registry; the server only pulls.'], ['buildx, multi-platform', 'One tag, both architectures. Each server pulls the one it needs.']], 3) +
    box('The trade on a small VPS', 'Building there competes with live traffic for 6 GB of RAM. Parallel cold builds there once had next build OOM-killed (exit 137).', 'cam') +
    flow([{ t: 'build machine', s: 'same arch as the server', mau: TIM }, { t: 'registry', s: 'app:&lt;git sha&gt;', mau: CAM }, { t: 'server', s: 'docker pull, swap', mau: NODE }], { h: 120 }) },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: TT('c17/prod-deploy', 1, 13, 'grep in Dockerfile.backend and deploy-nha.sh · real', { n: 104, hl: [2, 3, 4, 7, 8, 10, 11, 13], sm: true }) +
    box('Right order, and built at home (since 18/08/2026)', 'package*.json line 25 → npm ci 51 → COPY . . 69; the one ARG that changes daily sits right before its own RUN (167). deploy-nha.sh builds both images in parallel on a 12-core machine and pushes to GHCR; the VPS only pulls and swaps.', 'xanh') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'Your Dockerfile: FROM node:22-slim · ARG GIT_SHA · WORKDIR /app · COPY . . · RUN npm ci --omit=dev · RUN echo $GIT_SHA > version.txt. There is no .dockerignore. (1) Name the two reasons every commit reinstalls everything. (2) Reorder it. (3) What can end up inside the image without .dockerignore?', '') +
    box('Hint', 'Slides 4, 9 and 13.', 'lam') +
    `<div data-k="dapan">${box('Answer', '(1) COPY . . sits before npm ci, and ARG GIT_SHA (new every commit) sits above every RUN. (2) FROM · WORKDIR · COPY package*.json ./ · RUN npm ci --omit=dev · COPY src ./src · ARG GIT_SHA · RUN echo $GIT_SHA > version.txt. (3) The Mac\'s node_modules (wrong OS), .git with its history, and .env with real secrets.', 'xanh')}</div>` },

  { t: 'Lesson 17.2 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['line order', '4.36 → 0.47 s per rebuild (9.3×)', 'package*.json + npm ci before the source'],
    ['.dockerignore', '66.16 MB → 465 B · 10.76 → 5.98 s', 'node_modules, .git, .env, dist'],
    ['without it', 'the FAKE .env readable in the image', 'the context is what can leak'],
    ['ARG at the top', '6.53 s vs 1.79 s', 'declare build args as late as possible'],
    ['amd64 on arm64', 'CPU loop 12.5× slower', 'build for the target, or on it'],
  ], { co: 22 }) + box('Next: 17.3 — PID 1, and the CMD line that loses every in-flight request', 'Three ways to write CMD, measured with a deploy in the middle of a request.', 'lam') },
]);
