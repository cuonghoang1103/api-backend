/**
 * node-17-1 — Node.js · Chapter 17 · Lesson 17.1 "The image: 430 MB down to 65.5 MB" (slide EN, đợt 12 — 08/11/2026). MỘT deck, MỘT tập node-17-1.
 * Nguồn: nodejs-17-1-anh-docker. Output THẬT: that/c17/{images, inside, arch, nodeenv, prod-image} (Docker 29.8.0 Desktop, linux/arm64, node:22 = v22.23.4,
 *   app mẫu that/c17/app: express 5.3.0 + pg 8.23.1 + zod 4.6.7, devDeps typescript 5.9.3 + vitest 3.2.7).
 * Khác web: cỡ ảnh đo theo CỘT "download (compressed)" của `docker images` (containerd store): node:22 416 / slim 82,6 / alpine 61,5 MB; ảnh build naive 430 · slim 84,3 ·
 *   alpine 65,5 · multi 81,7 MB (web 440 / 79,6 / 58,8 / 77,5 — máy + ngày khác) ⇒ 6,6× (web 7,5×). Thêm: cột "on disk", npm cache 19 MB, bẫy bcrypt Mach-O chạy thật.
 */
import { lamDeck, two, box, cards, flow, bang, TT, thanh, steps, sql, tep } from './_c9-chung.mjs';

export const deck = { key: 'node-17-1', code: 'NODE 17.1', title: 'The image: 430 MB down to 65.5 MB', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const D = (src, o = {}) => sql(src, { lang: 'dockerfile', sm: o.sm ?? true, hl: o.hl });

export const slides = lamDeck({ chuong: 'Chapter 17 — Docker and deployment', bai: '17.1' }, [
  { cover: true, t: 'The image:<br>430 MB down to 65.5 MB', sub: 'The image is downloaded on every deploy, stored on every host and scanned by every security tool. Same app, four Dockerfiles, every size measured.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>What an image is, and why its size is not a packaging detail</li>
<li>Four Dockerfiles for one app: 430 MB, 84.3 MB, 65.5 MB, 81.7 MB</li>
<li>What is actually inside the naive image — and the alpine trap</li>
<li>Multi-stage: build somewhere, then throw that place away</li>
<li>Three lines that are not about size: NODE_ENV, USER, npm ci</li>
</ul>` + box('Why it matters to you', 'The image size is the difference between a rollback that takes ten seconds and one that takes four minutes while the site is down.', 'lam') },

  { t: 'An image is what travels', to: true, giua: true, body: flow([{ t: 'Dockerfile', s: 'the recipe', mau: TIM }, { t: 'image', s: 'a stack of layers', mau: LAM }, { t: 'registry', s: 'GHCR, Docker Hub', mau: CAM }, { t: 'server: pull', s: 'every deploy', mau: NODE }, { t: 'container', s: 'a running copy', mau: NODE }], { h: 130 }) +
    cards([['Downloaded on every deploy', 'and on every new server. Every megabyte is waiting time while you are trying to ship — or to roll back.'], ['Stored on every host', 'old versions pile up on the same disk the database lives on (chapter 15 met the full disk).'], ['Scanned by every tool', 'every package inside is something a vulnerability scanner reports and an attacker can use (chapter 4).']], 3) },

  { t: 'The app: deliberately ordinary', to: true, giua: true, body: two(sql(tep('c17/app/package.json', 11, 19), { lang: 'json', sm: false, hl: [2, 3, 4, 7, 8] }),
    box('Runtime vs build-time', '<b>dependencies</b>: express, pg, zod — needed while the app RUNS.<br><b>devDependencies</b>: typescript, vitest — needed only to BUILD and TEST.', 'lam') +
    box('How big is the app itself?', 'src/index.js + package.json = <b>1,990 bytes</b>. Everything else in every image below is somebody else\'s code.', 'cam')) },

  { t: 'Base images, measured', to: true, giua: true, body: TT('c17/images', 4, 7, 'docker images · Docker 29.8.0 · linux/arm64 · real', { n: 104, sm: false }) +
    cards([['node:22', 'Full Debian + gcc, make, python, git, curl. 416 MB to download before you write a line.'], ['node:22-slim', 'Minimal Debian, NO toolchain. 82.6 MB. The right default for most projects.'], ['node:22-alpine', '61.5 MB. The smallest — but musl libc instead of glibc. Native modules can break.'], ['distroless', 'Node + your app, NO shell at all. Safest; docker exec … sh no longer works.']], 4) +
    box('A tag is not a version', 'node:22 pulled today is v22.23.4; next month it is something else. Pin the exact tag (node:22.23.4-slim) or a digest, so a rebuild next month builds the same thing.', 'lam') },

  { t: 'Four Dockerfiles, one app', to: true, giua: true, body: thanh([['naive', 430, DO, '430 MB'], ['slim', 84.3, CAM, '84.3 MB'], ['alpine', 65.5, NODE, '65.5 MB'], ['multi', 81.7, LAM, '81.7 MB']], { w: 1100, x0: 160, wMax: 760, h0: 50, chu: 22, ghi: 'download size (compressed) · same source code · real' }) +
    TT('c17/images', 9, 13, 'docker build ×4, then docker images · real', { n: 104, hl: [2, 4], sm: true }) +
    box('430 MB against 65.5 MB: 6.6×', 'for an app whose own code is under two kilobytes. Almost the whole difference is the base image, and what you left inside it.', 'cam') },

  { t: 'Two sizes: what you download, what you store', to: true, giua: true, body: bang(['image', 'download (compressed)', 'on disk (unpacked)', 'matters when'], [
    ['node:22', '416 MB', '1.63 GB', ''], ['naive', '430 MB', '1.73 GB', 'pulling on deploy, rollback, a new server'], ['slim', '84.3 MB', '371 MB', 'disk space on the host'], ['alpine', '65.5 MB', '259 MB', ''], ['multi', '81.7 MB', '362 MB', 'both, every day'],
  ], { co: 22, hl: [1] }) + two(box('Download size', 'Layers travel compressed. This is what a deploy waits for, and what a registry stores per tag.', 'lam'), box('On disk', 'Unpacked onto the host. Ten old versions of the naive image is 17 GB on the server\'s disk.', 'do2')) },

  { t: 'The naive Dockerfile: four lines, four mistakes', to: true, giua: true, body: D(`FROM node:22            # 416 MB: gcc, make, python, git included
WORKDIR /app
COPY . .                # copies YOUR node_modules too (wrong OS!)
RUN npm install         # installs devDependencies: typescript, vitest
CMD ["npm", "start"]    # lesson 17.3: this line loses requests`, { sm: false, hl: [1, 3, 4, 5] }) +
    cards([['FROM node:22', 'a build toolchain nobody will use at runtime'], ['COPY . .', 'whatever is in the folder — node_modules, .git, .env (lesson 17.2)'], ['npm install', 'devDependencies + npm\'s download cache, shipped'], ['CMD npm start', 'npm becomes PID 1 and eats the shutdown signal (17.3)']], 4) +
    box('Each line is copied from a tutorial', 'and each one is fine on a laptop. Together they ship 430 MB, a compiler, your local node_modules, and a shutdown that loses requests.', 'do2') },

  { t: 'What is actually inside the naive image', to: true, giua: true, body: two(TT('c17/inside', 2, 14, 'docker run … du -sm · real', { n: 64, hl: [2, 7], sm: true }),
    box('121 packages vs 85', 'The naive image carries 36 more packages and 49 MB more node_modules: a compiler, a test runner and their bundlers.', 'do2') +
    box('Shipped to production, never run there', 'typescript alone is 23 MB. Nothing in production will ever compile or test anything.', 'cam') +
    box('Not just dead weight', 'Every package is one more thing a scanner reports and a supply-chain attacker can use (chapter 4).', 'lam')) },

  { t: 'The toolchain and the cache came along too', to: true, giua: true, body: TT('c17/inside', 16, 19, 'which … inside each base image · real', { n: 104, hl: [2], sm: false }) +
    TT('c17/inside', 37, 40, 'npm\'s download cache left inside each image · real', { n: 104, hl: [2], sm: false }) +
    two(box('gcc, make, python, git, curl', 'Handy for an attacker who gets a shell. Useless for serving requests.', 'do2'), box('npm install leaves ~/.npm behind', '19 MB of tarballs in the naive image. multi copies only node_modules: 0 MB.', 'cam')) },

  { t: 'The alpine trap: musl, not glibc', to: true, giua: true, body: TT('c17/inside', 26, 28, 'the C library each base image uses · real', { n: 104, sm: false }) +
    cards([['Pure JavaScript', 'express, zod, pg: does not care which libc. alpine works.'], ['Native modules', 'sharp, bcrypt, canvas — anything with a .node binary. They need a binary built for musl.'], ['How it fails', 'fails to install, silently falls back to a slower path, or crashes at runtime on a path you did not test.']], 3) +
    box('The rule', 'On a project with sharp or other native modules, choose slim. The 19 MB you save with alpine is real; so is the afternoon spent on "Error loading shared library".', 'cam') },

  { t: 'A real trap: your Mac\'s node_modules in a Linux image', to: true, giua: true, body: TT('c17/arch', 2, 14, 'bcrypt 5.1.1 installed on the Mac, then COPY . . + npm install · real', { n: 104, hl: [3, 6, 12], sm: false }) +
    two(box('The build said OK', 'npm install saw bcrypt already in node_modules and did not rebuild it. The Mach-O binary from macOS went into a Linux image.', 'do2'), box('One line fixes it', 'node_modules in .dockerignore: the image installs its own Linux binary. Measured in detail in lesson 17.2.', 'xanh')) },

  { t: 'Multi-stage: build somewhere you then throw away', to: true, giua: true, body: D(tep('c17/app/Dockerfile.multi').replace(/\n\n/g, '\n'), { sm: true, hl: [2, 5, 7, 9, 12, 14, 16, 17, 18, 20, 22] }) },

  { t: 'Only the last stage becomes the image', to: true, giua: true, body: flow([{ t: 'builder', s: 'npm ci + build · can be 500 MB', mau: CAM }, { t: 'deps', s: 'npm ci --omit=dev', mau: LAM }, { t: 'runner', s: 'node_modules + dist', mau: NODE }, { t: 'the image', s: '81.7 MB', mau: NODE }], { h: 130 }) +
    cards([['builder', 'toolchain, devDependencies, source. Big is FINE — it is thrown away.'], ['deps', 'only npm ci --omit=dev. Separate, so this layer caches on its own.'], ['runner', 'base + production node_modules + dist. The ONLY thing that reaches the server.']], 3) +
    box('81.7 MB, smaller than single-stage slim (84.3 MB)', 'It copies dist/ instead of src/, and no npm download cache. The compiler never ships.', 'xanh') },

  { t: 'Three lines that are not about size', to: true, giua: true, body: two(TT('c17/nodeenv', 2, 12, 'the same error, two images · curl · real', { n: 58, hl: [3, 11], sm: true }),
    box('ENV NODE_ENV=production', 'Express stops sending stack traces — the leaked "password" above. Many libraries change behaviour on it.', 'do2') +
    box('USER node', 'naive and slim run as <b>root</b>, multi as <b>node</b> (measured with whoami). Root plus an escape is root on the host.', 'cam') +
    box('npm ci, not npm install', 'ci follows the lockfile exactly and fails on drift; install can silently bump a version (chapter 4).', 'lam')) },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: TT('c17/prod-image', 1, 13, 'grep in the website\'s Dockerfile.backend · real', { n: 104, hl: [4, 5, 6, 9, 12, 13], sm: true }) +
    two(box('Multi-stage on node:22-slim', 'The toolchain (python3, make, g++, libvips-dev) lives only in the builder: sharp has to compile there when its prebuilt download fails.', 'xanh'), box('A case where alpine would be wrong', 'sharp is a native module. The runner adds only runtime libs: tini, ffmpeg, libvips42 — and runs as user nodejs.', 'lam')) },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'A teammate\'s Dockerfile is FROM node:22, COPY . ., RUN npm install, CMD ["npm","start"]. The image is 430 MB and production uses sharp. (1) Which base image do you choose, and why not alpine? (2) Rewrite it so typescript and vitest never reach the server. (3) Which two lines change behaviour rather than size?', '') +
    box('Hint', 'Slides 11, 13 and 15.', 'lam') +
    `<div data-k="dapan">${box('Answer', '(1) node:22-slim: sharp is native, alpine\'s musl can break it. (2) Multi-stage: builder runs npm ci + build, deps runs npm ci --omit=dev, runner copies only node_modules + dist. (3) ENV NODE_ENV=production (no stack traces) and USER node (not root); npm ci instead of npm install is the third.', 'xanh')}</div>` },

  { t: 'Lesson 17.1 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['naive → alpine', '430 → 65.5 MB (6.6×)', 'size is the base + what you leave in'],
    ['naive image', '121 packages · 63 MB node_modules · 19 MB npm cache', 'devDependencies never ship'],
    ['Mac node_modules', 'build OK, run: invalid ELF header', 'node_modules in .dockerignore'],
    ['multi-stage', '81.7 MB, no compiler, user node', 'build, then throw the builder away'],
    ['NODE_ENV', '889-byte stack trace → 148 bytes', 'set it in the runner'],
  ], { co: 22 }) + box('Next: 17.2 — the layer cache, and the line order that makes builds 9.3× slower', '.dockerignore, cache invalidation, and building for a machine that is not yours.', 'lam') },
]);
