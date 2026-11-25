/**
 * 11.1 — Dockerfile production cho Nest: nhiều tầng, không chạy root, ảnh nhỏ (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Docker BuildKit, node:22 / node:22-alpine — Node 22.23.5, npm 10.9.9, Nest 12.6.0, Prisma 7.10.1):
 * scratchpad/nst/lab/c11/moc11 (Dockerfile, Dockerfile.ngay-tho, .dockerignore) ⇒ lab/c11/o/111-*.txt, do-stop.sh (SIGTERM).
 * Nguồn đã GET 24/11/2026: NVD CVE-2019-5736 (runc, công bố 11/02/2019, CVSS 8.6). Ghép: gen.mjs rồi ghep.sh 111 nst-11-1-docker.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'docker', bai: 'dk-6-1-multi-stage', title: 'Docker 6.1 — Dựng nhiều tầng, cho tử tế', sub: 'Nền multi-stage, không gắn framework — bài này chỉ thêm phần riêng của Nest + Prisma.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-6-4-chay-an-toan', title: 'Docker 6.4 — Chạy một container cho an toàn', sub: 'USER, gốc chỉ đọc, capability — nền của mục "không chạy root".', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-1-3-vong-doi', title: 'Docker 1.3 — Vòng đời container, và PID 1', sub: 'Vì sao PID 1 bỏ qua SIGTERM khi không tự bắt.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-17-1-anh-docker', title: 'Node.js 17.1 — Ảnh Docker: từ 440MB xuống 58,8MB', sub: 'Cùng ý cho một app Node thường; Nest + Prisma có thêm ba bẫy ở bài này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-5-2-bi-mat', title: 'NestJS 5.2 — Bí mật', sub: 'Vì sao JWT_SECRET không nằm trong ảnh mà do môi trường cấp.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🛡', 'NVD — CVE-2019-5736 (runc, 11/02/2019, CVSS 8.6)', 'Lệnh chạy bằng root trong container ghi đè được runc của máy chủ ⇒ root máy chủ. Chạy USER không phải root chặn đúng điều kiện này.', 'https://nvd.nist.gov/vuln/detail/CVE-2019-5736'),
  nguon('📘', 'Docker docs — Multi-stage builds', 'Tầng, --target, COPY --from.', 'https://docs.docker.com/build/building/multi-stage/'),
  nguon('📘', 'npm docs — npm ci (--omit)', 'Các loại phụ thuộc bị bỏ: dev, optional, peer.', 'https://docs.npmjs.com/cli/commands/npm-ci'),
].join('\n');
const MA_NGAY = "# Dockerfile.ngay-tho — bản \"chạy được trên máy tôi\": một tầng, đủ mọi thứ\nFROM node:22\nWORKDIR /app\nCOPY . .\nRUN npm install\nRUN npm run build\nEXPOSE 3000\nCMD npm run start:prod";
const MA_DF = "# syntax=docker/dockerfile:1\n# Dockerfile — lab-booking (Nest 12 ESM + Prisma 7). Bốn tầng: deps → build → prod-deps → runtime (+ migrate)\nARG NODE=22-alpine\n\n# 1) cài ĐỦ (cả devDeps: nest CLI, typescript, prisma) — chỉ đổi khi package*.json đổi ⇒ cache trúng khi sửa mã\nFROM node:${NODE} AS deps\nWORKDIR /app\nCOPY package.json package-lock.json ./\nRUN --mount=type=cache,target=/root/.npm npm ci\n\n# 2) sinh Prisma Client + biên dịch TypeScript\nFROM deps AS build\nCOPY prisma.config.ts tsconfig.json tsconfig.build.json nest-cli.json ./\nCOPY prisma ./prisma\nCOPY src ./src\n# prisma.config.ts đòi DATABASE_URL (env()) dù generate KHÔNG kết nối DB ⇒ URL giả, chỉ sống trong lệnh này\nRUN DATABASE_URL=postgresql://build:build@localhost:5432/build npx prisma generate && npm run build\n\n# 3) chỉ dependencies chạy thật\nFROM node:${NODE} AS prod-deps\nWORKDIR /app\nCOPY package.json package-lock.json ./\n# chỉ --omit=dev là CHƯA đủ: prisma CLI + typescript là peer tuỳ chọn của @prisma/client/@nestjs/swagger VÀ là devDependency\n# ⇒ lockfile ghi \"devOptional\" ⇒ npm chỉ bỏ khi bỏ cả dev lẫn optional (đo: 464 MB → xem bài 11.1)\nRUN --mount=type=cache,target=/root/.npm npm ci --omit=dev --omit=optional\n\n# migrate: chạy MỘT lần trước khi tráo bản (job riêng / service compose) — có prisma CLI, không phục vụ request\nFROM deps AS migrate\nCOPY prisma.config.ts ./\nCOPY prisma ./prisma\nUSER node\nCMD [\"npx\", \"prisma\", \"migrate\", \"deploy\"]\n\n# 4) ảnh chạy — đặt CUỐI: `docker build` không --target dựng tầng cuối cùng: không trình biên dịch, không mã nguồn TS, không chạy root\nFROM node:${NODE} AS runtime\nENV NODE_ENV=production\nWORKDIR /app\nCOPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules\nCOPY --from=build --chown=node:node /app/dist ./dist\nCOPY --chown=node:node package.json ./\nUSER node\nEXPOSE 3000\nCMD [\"node\", \"dist/main.js\"]";
const MA_DI = "# chỉ gửi vào ngữ cảnh dựng những gì cần để build — node_modules máy bạn (glibc, có devDeps) KHÔNG được lọt vào\nnode_modules\ndist\n*.tsbuildinfo\ncoverage\n.git\n.env\n.env.*\n!.env.example\nsrc/generated\nDockerfile*\ncompose*.yaml\n.github\nlb";
const OUT_NGAY = "#4 [1/5] FROM docker.io/library/node:22\n#4 [1/5] FROM docker.io/library/node:22\n#4 [1/5] FROM docker.io/library/node:22\n#4 [1/5] FROM docker.io/library/node:22\n#4 [1/5] FROM docker.io/library/node:22\n#4 [1/5] FROM docker.io/library/node:22\n#4 [1/5] FROM docker.io/library/node:22\n#4 [1/5] FROM docker.io/library/node:22\n#7 [4/5] RUN npm install\n#7 20.96 \n#7 20.96 added 546 packages, and audited 547 packages in 20s\n#7 20.96 \n#7 20.96 115 packages are looking for funding\n#7 20.96   run `npm fund` for details\n#7 21.03 \n#7 21.03 3 high severity vulnerabilities\n#7 21.03 \n#7 21.03 To address all issues (including breaking changes), run:\n#7 21.03   npm audit fix --force\n#7 21.03 \n#7 21.03 Run `npm audit` for details.\n#7 21.03 npm notice\n#7 21.03 npm notice New major version of npm available! 10.9.9 -> 12.2.3\n#7 21.03 npm notice Changelog: https://github.com/npm/cli/releases/tag/v12.2.3\n#7 21.03 npm notice To update run: npm install -g npm@12.2.3\n#7 21.03 npm notice\n#8 [5/5] RUN npm run build\n - JSONArgsRecommended: JSON arguments recommended for CMD to prevent unintended behavior related to OS signals (line 8)\ndocker build --progress=plain -f Dockerfile.ngay-tho -t nst-lb:ngay-tho .  0.24s user 0.13s system 0% cpu 1:51.70 total";
const OUT_CUOI = "$ docker build -t nst-lb:1 .        # Dockerfile có tầng migrate đứng CUỐI\n$ docker images nst-lb\n1          1.01GB      ← không phải ảnh runtime: là tầng migrate (đủ devDeps + prisma CLI)";
const OUT_GEN = "#15 [build 4/4] RUN npx prisma generate && npm run build\n#15 1.336 Failed to load config file \"/app\" as a TypeScript/JavaScript module. Error: PrismaConfigEnvError: Cannot resolve environment variable: DATABASE_URL.\n#15 ERROR: process \"/bin/sh -c npx prisma generate && npm run build\" did not complete successfully: exit code: 1\n1.336 Failed to load config file \"/app\" as a TypeScript/JavaScript module. Error: PrismaConfigEnvError: Cannot resolve environment variable: DATABASE_URL.";
const OUT_LS = "464.2M\tnode_modules\nlab-booking@0.11.0 /app\n+-- @nestjs/swagger@12.1.2\n| `-- typescript@6.0.3\n`-- @prisma/client@7.10.1\n  +-- prisma@7.10.1\n  | +-- @prisma/dev@0.24.17\n  | | `-- valibot@1.4.2\n  | |   `-- typescript@6.0.3 deduped";
const OUT_SAU = "192.0M\tnode_modules\nls: node_modules/prisma: No such file or directory\nls: node_modules/typescript: No such file or directory\nls: node_modules/effect: No such file or directory";
const OUT_THIEU = "[Nest] 1  ERROR [ExceptionHandler] Error: Config validation error: JWT_SECRET: Invalid input: expected string, received undefined\nDATABASE_URL: Invalid input: expected string, received undefined\nREDIS_URL: Invalid input: expected string, received undefined";
const OUT_SIG = "PID                 COMMAND\n665970              /bin/sh -c npm run start:prod\n666312              npm run start:prod\n666633              sh -c node dist/main.js\nngay-tho (node:22 Debian): CMD npm run start:prod    docker stop 10.4 s, ExitCode=137\nPID                 COMMAND\n714112              sh -c echo x && node dist/main.js\n714672              node dist/main.js\nnode:22 Debian: sh -c \"echo x && node dist/main.js\"  docker stop 10.5 s, ExitCode=137";

const BANG_ANH_EN = `<table>
<tr><th>Variant</th><th><code>docker images</code></th><th>Pulled (compressed)</th><th>node_modules</th></tr>
<tr><td>Naive: <code>node:22</code>, <code>COPY . .</code>, <code>npm install</code></td><td>2.75 GB</td><td>715 MB</td><td>all, incl. dev</td></tr>
<tr><td>4 stages, <code>npm ci --omit=dev</code></td><td>840 MB</td><td>—</td><td>464 MB</td></tr>
<tr><td>… <code>--omit=dev --omit=peer</code></td><td>830 MB</td><td>—</td><td>456 MB</td></tr>
<tr><td>… <code>--omit=dev --omit=optional</code></td><td><strong>484 MB</strong></td><td><strong>106 MB</strong></td><td><strong>192 MB</strong></td></tr>
<tr><td>(base <code>node:22-alpine</code> alone)</td><td>238 MB</td><td>62 MB</td><td>—</td></tr>
</table>`;
const BANG_ANH_VI = `<table>
<tr><th>Bản</th><th><code>docker images</code></th><th>Khi kéo về (nén)</th><th>node_modules</th></tr>
<tr><td>Ngây thơ: <code>node:22</code>, <code>COPY . .</code>, <code>npm install</code></td><td>2,75 GB</td><td>715 MB</td><td>tất cả, kể cả dev</td></tr>
<tr><td>4 tầng, <code>npm ci --omit=dev</code></td><td>840 MB</td><td>—</td><td>464 MB</td></tr>
<tr><td>… <code>--omit=dev --omit=peer</code></td><td>830 MB</td><td>—</td><td>456 MB</td></tr>
<tr><td>… <code>--omit=dev --omit=optional</code></td><td><strong>484 MB</strong></td><td><strong>106 MB</strong></td><td><strong>192 MB</strong></td></tr>
<tr><td>(riêng ảnh nền <code>node:22-alpine</code>)</td><td>238 MB</td><td>62 MB</td><td>—</td></tr>
</table>`;
const BANG_SIG_EN = `<table>
<tr><th>How the process is started</th><th>Image</th><th><code>docker stop</code></th><th>ExitCode</th></tr>
<tr><td><code>CMD npm run start:prod</code> (shell form)</td><td>node:22 (Debian)</td><td>10.4 s</td><td>137 (SIGKILL)</td></tr>
<tr><td><code>sh -c "echo x &amp;&amp; node dist/main.js"</code></td><td>node:22 (Debian)</td><td>10.5 s</td><td>137</td></tr>
<tr><td><code>sh -c "echo khoi-dong &amp;&amp; node dist/main.js"</code></td><td>node:22-alpine</td><td>0.2 s</td><td>0 — busybox <code>sh</code> execs the last command</td></tr>
<tr><td><code>CMD ["npm","run","start:prod"]</code></td><td>node:22-alpine</td><td>0.8 s</td><td>1 + <code>npm error</code> in the log</td></tr>
<tr><td><code>CMD ["node","dist/main.js"]</code> + <code>enableShutdownHooks()</code></td><td>node:22-alpine</td><td>0.2 s</td><td>0</td></tr>
<tr><td><code>node -e "setInterval(()=&gt;{},1000)"</code> (no SIGTERM handler)</td><td>node:22-alpine</td><td>10.2 s</td><td>137</td></tr>
<tr><td>same, <code>docker run --init</code></td><td>node:22-alpine</td><td>0.2 s</td><td>143</td></tr>
</table>`;
const BANG_SIG_VI = `<table>
<tr><th>Cách khởi động tiến trình</th><th>Ảnh</th><th><code>docker stop</code></th><th>ExitCode</th></tr>
<tr><td><code>CMD npm run start:prod</code> (dạng shell)</td><td>node:22 (Debian)</td><td>10,4 s</td><td>137 (SIGKILL)</td></tr>
<tr><td><code>sh -c "echo x &amp;&amp; node dist/main.js"</code></td><td>node:22 (Debian)</td><td>10,5 s</td><td>137</td></tr>
<tr><td><code>sh -c "echo khoi-dong &amp;&amp; node dist/main.js"</code></td><td>node:22-alpine</td><td>0,2 s</td><td>0 — <code>sh</code> của busybox exec luôn lệnh cuối</td></tr>
<tr><td><code>CMD ["npm","run","start:prod"]</code></td><td>node:22-alpine</td><td>0,8 s</td><td>1 + dòng <code>npm error</code> trong log</td></tr>
<tr><td><code>CMD ["node","dist/main.js"]</code> + <code>enableShutdownHooks()</code></td><td>node:22-alpine</td><td>0,2 s</td><td>0</td></tr>
<tr><td><code>node -e "setInterval(()=&gt;{},1000)"</code> (không bắt SIGTERM)</td><td>node:22-alpine</td><td>10,2 s</td><td>137</td></tr>
<tr><td>như trên, <code>docker run --init</code></td><td>node:22-alpine</td><td>0,2 s</td><td>143</td></tr>
</table>`;

export default {
  title: '11.1 — A production Dockerfile for Nest: multi-stage, non-root, small image|||11.1 — Dockerfile production cho Nest: nhiều tầng, không chạy root, ảnh nhỏ',
  slug: 'nst-11-1-docker',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đóng gói lab-booking (Nest 12 ESM + Prisma 7) đo thật: bản ngây thơ 2,75 GB; bốn tầng deps → build → prod-deps → runtime còn 106 MB khi kéo về. Ba bẫy riêng của Nest + Prisma gặp thật: không --target thì Docker dựng tầng CUỐI; prisma generate hỏng vì prisma.config.ts đòi DATABASE_URL; npm ci --omit=dev vẫn chở prisma CLI + typescript (464 MB) vì lockfile ghi devOptional. Rồi USER node, và bảng đo SIGTERM: dạng shell trên Debian bị SIGKILL sau 10,4 s.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>11.1 — Packaging lab-booking: from 2.75 GB to 106 MB, and three traps only a Nest + Prisma project hits</h2>
<p class="lead">Docker itself — layers, multi-stage, non-root, PID 1 — is taught in the Docker course (links below). This lesson packages <em>this</em> project: Nest 12 ESM, Prisma 7 with a generated client in <code>src/generated</code>, a CLI build step, devDependencies that are also optional peers. Every number is from a real build on the home machine.</p>

<h3>Everyday analogy: shipping a product, not the factory</h3>
<p>A furniture workshop ships a table, not the saw, the glue and the offcuts. A naive Dockerfile ships the workshop: compiler, TypeScript sources, test tools, the Prisma CLI. The multi-stage file below builds in one box and copies only the finished table into a clean one.</p>

<h3>1. Starting point: the Dockerfile that "works on my machine"</h3>
<pre><code class="language-dockerfile">${esc(MA_NGAY)}</code></pre>
<pre><code class="language-text">${esc(OUT_NGAY)}</code></pre>
<p>It builds and runs: 2.75 GB on disk, 715 MB to pull, and it only built because <code>src/generated</code> happened to be in the folder — a fresh clone does not have it (it is in <code>.gitignore</code>, lesson 11.3 shows CI failing on exactly that). Docker itself warns about the shell-form <code>CMD</code>; section 5 measures why.</p>

<h3>2. Four stages</h3>
<pre><code class="language-dockerfile">${esc(MA_DF)}</code></pre>
<pre><code class="language-text">${esc(MA_DI)}</code></pre>
<ul>
<li><strong>deps</strong> copies only <code>package*.json</code>, so editing code reuses the 24 s <code>npm ci</code> layer; the cache mount keeps the npm cache between builds.</li>
<li><strong>build</strong> runs <code>prisma generate</code> then <code>nest build</code>. The generated client is TypeScript inside <code>src/</code>, so it is compiled into <code>dist/</code> together with your code — nothing from Prisma has to be generated at runtime.</li>
<li><strong>prod-deps</strong> installs runtime dependencies from scratch instead of pruning the build stage — nothing compiled for the build leaks in.</li>
<li><strong>runtime</strong> gets <code>node_modules</code> + <code>dist</code> + <code>package.json</code> (needed for <code>"type": "module"</code>), owned by <code>node</code>, run as <code>node</code>, started with exec-form <code>CMD</code>.</li>
<li><strong>migrate</strong> is a separate target with the Prisma CLI; it runs once before new API containers start (lesson 11.5 wires it into Compose).</li>
</ul>

<h3>3. Three traps, all hit for real</h3>
<p><strong>Trap 1 — the default target is the last stage.</strong> The first version had <code>migrate</code> written after <code>runtime</code>:</p>
<pre><code class="language-text">${esc(OUT_CUOI)}</code></pre>
<p><code>docker build</code> without <code>--target</code> builds the last stage. Either keep <code>runtime</code> last (done above) or always pass <code>--target runtime</code> in CI and Compose.</p>
<p><strong>Trap 2 — <code>prisma generate</code> wants a database URL it never uses.</strong></p>
<pre><code class="language-text">${esc(OUT_GEN)}</code></pre>
<p><code>prisma.config.ts</code> reads <code>env('DATABASE_URL')</code>, which throws when the variable is missing — even for <code>generate</code>, which does not connect. The fix is a dummy URL that lives only in that one <code>RUN</code>. Do not use <code>ARG</code>/<code>ENV</code> with a real URL: it would be stored in the image history.</p>
<p><strong>Trap 3 — <code>--omit=dev</code> still ships the Prisma CLI and TypeScript.</strong> The first runtime image had 464 MB of <code>node_modules</code>:</p>
<pre><code class="language-text">${esc(OUT_LS)}</code></pre>
<p><code>@prisma/client</code> declares <code>prisma</code> and <code>typescript</code> as <em>optional peers</em>; <code>@nestjs/swagger</code> also pulls <code>typescript</code>. Both are your devDependencies too, so the lockfile marks them <code>"devOptional": true</code> — and npm drops a devOptional package only when <em>both</em> dev and optional are omitted. <code>--omit=peer</code> removed 3 packages (464 → 456 MB). <code>--omit=dev --omit=optional</code>:</p>
<pre><code class="language-text">${esc(OUT_SAU)}</code></pre>
<p>Cost checked: the only pure optional runtime packages dropped are <code>msgpackr-extract</code> (BullMQ falls back to plain JS) and <code>pg-cloudflare</code> (Workers only). Prisma 7 uses the <code>pg</code> driver adapter — no Rust engine, so the classic "built on glibc, crashes on musl" Prisma trap of older versions is gone; <code>argon2</code> ships both glibc and musl prebuilds.</p>
${BANG_ANH_EN}

<h3>4. Non-root, and failing loudly</h3>
<p><code>docker exec … id</code> in the runtime container prints <code>uid=1000(node)</code>. Started with no environment, the app refuses to boot — the schema from lesson 5.1 does its job:</p>
<pre><code class="language-text">${esc(OUT_THIEU)}</code></pre>
<p><strong>🕵️ Hacker corner — CVE-2019-5736 (runc, 11/02/2019, CVSS 8.6).</strong> A process running as <em>root inside</em> a container could overwrite the host's <code>runc</code> binary and become root on the host; NVD lists "the ability to execute a command as root within" the container as the precondition. An RCE in your API (a bad dependency, an <code>eval</code>) gives the attacker whatever user your app runs as. <code>USER node</code> removes that precondition; patched runtimes remove the bug. Do both.</p>

<h3>5. SIGTERM: who is PID 1</h3>
<p><code>docker stop</code> sends SIGTERM, waits 10 s, then SIGKILL. Measured with <code>do-stop.sh</code> on the real image:</p>
${BANG_SIG_EN}
<pre><code class="language-text">${esc(OUT_SIG)}</code></pre>
<p>Read it as rules: on Debian, <code>/bin/sh -c</code> stays PID 1 and does not forward the signal — 10 s later everything is killed and your shutdown hooks never run. On Alpine the same line <em>looks</em> fine because busybox <code>sh</code> replaces itself with the last command — a trap that appears the day someone switches the base image. <code>npm</code> forwards the signal but exits 1 and prints <code>npm error</code>, so every deploy looks like a crash. A Node process without a SIGTERM handler as PID 1 ignores SIGTERM (Linux does not apply the default action to PID 1). Nest's <code>enableShutdownHooks()</code> installs the handler; after the hooks it re-raises the signal, which PID 1 ignores, so the exit code is 0 (outside a container you would see 143).</p>

<h3>🧪 Lab (25 min) — package your own project</h3>
<ol>
<li>Copy the four-stage Dockerfile into your project. Build twice; change one line in a controller, build again — which stages re-run?</li>
<li>Print the size of <code>node_modules</code> in the runtime image with <code>--omit=dev</code> alone, then with <code>--omit=optional</code> added. Find which packages made the difference with <code>npm ls &lt;name&gt;</code>.</li>
<li>Run the container without environment variables, then with them. Then <code>docker stop</code> it and record time + <code>ExitCode</code>.</li>
</ol>
<details><summary>Show answers</summary>
<ol>
<li>Changing a controller: <code>deps</code> and <code>prod-deps</code> are cached (only <code>package*.json</code> was copied into them); <code>build</code> re-runs from <code>COPY src</code>; <code>runtime</code> re-runs only the <code>COPY --from=build</code> line. Measured here: 54 s for the first build; 22 s when only the <code>prod-deps</code> line changed (the other stages came from cache).</li>
<li>Expect hundreds of MB from <code>prisma</code>, <code>@prisma/studio-core</code>, <code>@prisma/engines</code>, <code>effect</code>, <code>@electric-sql/pglite</code>, <code>typescript</code>; <code>npm ls prisma --omit=dev</code> shows them under <code>@prisma/client</code>. If your project uses TypeORM instead, the list differs — measure, do not copy the number.</li>
<li>Without env: exit 1 with a list of missing variables. With env: <code>docker stop</code> ≈ 0.2 s and <code>ExitCode=0</code> if CMD is exec form and you call <code>enableShutdownHooks()</code>; ≈ 10 s and 137 otherwise.</li>
</ol>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>Why multi-stage for a Nest app?</strong> The build needs the CLI, TypeScript and the Prisma generator; runtime needs only <code>dist</code> and production dependencies. Measured: 715 MB → 106 MB to pull.</li>
<li><strong>Exec form vs shell form CMD?</strong> Shell form makes <code>/bin/sh</code> PID 1, which does not forward SIGTERM (Debian: 10.4 s then SIGKILL). Exec form makes Node PID 1 and lets Nest's shutdown hooks run.</li>
<li><strong>Why not <code>npm start</code> in the container?</strong> npm forwards the signal but exits non-zero and adds a process and a log line; run <code>node dist/main.js</code>.</li>
<li><strong>Where do migrations run?</strong> Not in the API's CMD — a separate one-shot job/target before new API containers start, so two replicas never migrate at once.</li>
</ol>

<h3>💼 On the job</h3>
<p>In outsourcing projects the Dockerfile is often copied from the previous project and nobody remembers why it is 1.5 GB. A quick, low-risk win on your first week: run <code>docker history</code> and <code>du -sm node_modules/*</code> in the image, write down the three biggest items with numbers, and propose the change in a merge request with before/after sizes and a passing smoke test. Numbers make a junior's proposal easy to accept.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Stage / target</span><span class="v">A <code>FROM … AS name</code> block; <code>--target</code> picks which to build, default the last.</span></div>
  <div class="kv"><span class="k">devOptional</span><span class="v">Lockfile flag: dev dependency that is also an optional peer; dropped only with <code>--omit=dev --omit=optional</code>.</span></div>
  <div class="kv"><span class="k">Exec form</span><span class="v"><code>CMD ["node","dist/main.js"]</code> — no shell, Node is PID 1.</span></div>
  <div class="kv"><span class="k">PID 1</span><span class="v">First process in the container; signals with default action are ignored unless it installs a handler.</span></div>
  <div class="kv"><span class="k">Exit code 137 / 143</span><span class="v">Killed by SIGKILL / terminated by SIGTERM (128 + signal number).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Measured on lab-booking: naive 2.75 GB (715 MB pulled) → four stages 484 MB (106 MB pulled), runtime <code>node_modules</code> 192 MB.</li>
<li>Nest + Prisma traps: default target = last stage; <code>prisma generate</code> needs a dummy <code>DATABASE_URL</code>; <code>--omit=dev</code> keeps devOptional peers — add <code>--omit=optional</code>.</li>
<li>Run as <code>node</code>; keep secrets out of the image; fail at boot when env is missing.</li>
<li>Exec-form <code>CMD ["node","dist/main.js"]</code> + <code>enableShutdownHooks()</code>: stop in 0.2 s with code 0. Shell form on Debian: 10.4 s and SIGKILL.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>11.1 — Đóng gói lab-booking: từ 2,75 GB xuống 106 MB, và ba cái bẫy chỉ dự án Nest + Prisma mới gặp</h2>
<p class="lead">Bản thân Docker — tầng ảnh, multi-stage, không chạy root, PID 1 — đã có ở khoá Docker (liên kết bên dưới). Bài này đóng gói <em>chính dự án này</em>: Nest 12 ESM, Prisma 7 với client sinh ra trong <code>src/generated</code>, một bước build bằng CLI, và các devDependency đồng thời là peer tuỳ chọn. Mọi con số đều từ lượt dựng thật trên máy nhà.</p>

<h3>Liên hệ đời thường: gửi đi cái bàn, không gửi cả xưởng</h3>
<p>Xưởng mộc giao cho khách cái bàn, không giao kèm cưa, keo và mùn gỗ. Dockerfile ngây thơ thì giao cả xưởng: trình biên dịch, mã TypeScript, công cụ test, Prisma CLI. Tệp nhiều tầng bên dưới làm bàn trong một thùng, rồi chỉ chép cái bàn đã xong sang thùng sạch.</p>

<h3>1. Điểm xuất phát: Dockerfile "máy em chạy được"</h3>
<pre><code class="language-dockerfile">${esc(MA_NGAY)}</code></pre>
<pre><code class="language-text">${esc(OUT_NGAY)}</code></pre>
<p>Nó dựng được và chạy được: 2,75 GB trên đĩa, 715 MB khi kéo về, và nó dựng được chỉ vì <code>src/generated</code> tình cờ nằm sẵn trong thư mục — bản clone mới thì không có (thư mục đó nằm trong <code>.gitignore</code>; bài 11.3 cho thấy CI đỏ đúng vì chuyện này). Chính Docker đã cảnh báo về <code>CMD</code> dạng shell; mục 5 đo vì sao.</p>

<h3>2. Bốn tầng</h3>
<pre><code class="language-dockerfile">${esc(MA_DF)}</code></pre>
<pre><code class="language-text">${esc(MA_DI)}</code></pre>
<ul>
<li><strong>deps</strong> chỉ chép <code>package*.json</code>, nên sửa mã vẫn dùng lại tầng <code>npm ci</code> 24 giây; cache mount giữ cache npm giữa các lượt dựng.</li>
<li><strong>build</strong> chạy <code>prisma generate</code> rồi <code>nest build</code>. Client sinh ra là TypeScript nằm trong <code>src/</code>, nên được biên dịch vào <code>dist/</code> cùng mã của bạn — lúc chạy không phải sinh gì của Prisma nữa.</li>
<li><strong>prod-deps</strong> cài lại phụ thuộc chạy thật từ đầu thay vì cắt tỉa tầng build — không gì biên dịch cho bước build lọt sang.</li>
<li><strong>runtime</strong> nhận <code>node_modules</code> + <code>dist</code> + <code>package.json</code> (cần cho <code>"type": "module"</code>), chủ sở hữu là <code>node</code>, chạy bằng <code>node</code>, khởi động bằng <code>CMD</code> dạng exec.</li>
<li><strong>migrate</strong> là một target riêng có Prisma CLI; chạy một lần trước khi các container API mới khởi động (bài 11.5 nối nó vào Compose).</li>
</ul>

<h3>3. Ba cái bẫy, đều gặp thật</h3>
<p><strong>Bẫy 1 — target mặc định là tầng cuối.</strong> Bản đầu tiên viết <code>migrate</code> sau <code>runtime</code>:</p>
<pre><code class="language-text">${esc(OUT_CUOI)}</code></pre>
<p><code>docker build</code> không có <code>--target</code> sẽ dựng tầng cuối cùng. Hoặc giữ <code>runtime</code> ở cuối (đã làm ở trên), hoặc luôn truyền <code>--target runtime</code> trong CI và Compose.</p>
<p><strong>Bẫy 2 — <code>prisma generate</code> đòi URL cơ sở dữ liệu mà nó không hề dùng.</strong></p>
<pre><code class="language-text">${esc(OUT_GEN)}</code></pre>
<p><code>prisma.config.ts</code> đọc <code>env('DATABASE_URL')</code>, hàm này ném lỗi khi thiếu biến — kể cả với <code>generate</code>, lệnh không kết nối DB. Cách sửa là một URL giả chỉ sống trong đúng một lệnh <code>RUN</code>. Đừng dùng <code>ARG</code>/<code>ENV</code> với URL thật: nó bị lưu vào lịch sử ảnh.</p>
<p><strong>Bẫy 3 — <code>--omit=dev</code> vẫn chở Prisma CLI và TypeScript.</strong> Ảnh runtime đầu tiên có 464 MB <code>node_modules</code>:</p>
<pre><code class="language-text">${esc(OUT_LS)}</code></pre>
<p><code>@prisma/client</code> khai <code>prisma</code> và <code>typescript</code> là <em>peer tuỳ chọn</em>; <code>@nestjs/swagger</code> cũng kéo <code>typescript</code>. Hai gói này đồng thời là devDependency của bạn, nên lockfile ghi <code>"devOptional": true</code> — và npm chỉ bỏ gói devOptional khi bỏ <em>cả</em> dev lẫn optional. <code>--omit=peer</code> chỉ bỏ được 3 gói (464 → 456 MB). Với <code>--omit=dev --omit=optional</code>:</p>
<pre><code class="language-text">${esc(OUT_SAU)}</code></pre>
<p>Đã kiểm cái giá: gói optional thuần của runtime bị bỏ theo chỉ có <code>msgpackr-extract</code> (BullMQ lùi về JS thuần) và <code>pg-cloudflare</code> (chỉ dùng trên Workers). Prisma 7 dùng driver adapter <code>pg</code> — không còn engine Rust, nên bẫy kinh điển của Prisma bản cũ "dựng trên glibc, chết trên musl" không còn; <code>argon2</code> có sẵn bản dựng cho cả glibc lẫn musl.</p>
${BANG_ANH_VI}

<h3>4. Không chạy root, và hỏng thì hỏng to</h3>
<p><code>docker exec … id</code> trong container runtime in ra <code>uid=1000(node)</code>. Khởi động không có biến môi trường, ứng dụng từ chối chạy — schema của bài 5.1 làm đúng việc:</p>
<pre><code class="language-text">${esc(OUT_THIEU)}</code></pre>
<p><strong>🕵️ Góc hacker — CVE-2019-5736 (runc, 11/02/2019, CVSS 8.6).</strong> Một tiến trình chạy bằng <em>root bên trong</em> container có thể ghi đè tệp <code>runc</code> của máy chủ và thành root trên máy chủ; NVD ghi điều kiện là "khả năng chạy lệnh bằng root bên trong" container. Một lỗ RCE trong API của bạn (gói phụ thuộc xấu, một lệnh <code>eval</code>) trao cho kẻ tấn công đúng user mà ứng dụng đang chạy. <code>USER node</code> gỡ điều kiện đó; runtime đã vá gỡ chính lỗi. Làm cả hai.</p>

<h3>5. SIGTERM: ai là PID 1</h3>
<p><code>docker stop</code> gửi SIGTERM, chờ 10 giây, rồi SIGKILL. Đo bằng <code>do-stop.sh</code> trên chính ảnh thật:</p>
${BANG_SIG_VI}
<pre><code class="language-text">${esc(OUT_SIG)}</code></pre>
<p>Đọc thành luật: trên Debian, <code>/bin/sh -c</code> ở lại làm PID 1 và không chuyển tín hiệu — 10 giây sau mọi thứ bị giết, hook tắt của bạn không bao giờ chạy. Trên Alpine, cùng dòng đó <em>trông</em> ổn vì <code>sh</code> của busybox tự thay mình bằng lệnh cuối — cái bẫy hiện ra vào ngày ai đó đổi ảnh nền. <code>npm</code> có chuyển tín hiệu nhưng thoát mã 1 và in <code>npm error</code>, nên lần deploy nào trông cũng như sập. Tiến trình Node không bắt SIGTERM mà làm PID 1 thì lờ SIGTERM đi (Linux không áp hành động mặc định cho PID 1). <code>enableShutdownHooks()</code> của Nest cài trình bắt; chạy hook xong nó phát lại tín hiệu, PID 1 lờ đi, nên mã thoát là 0 (ngoài container bạn sẽ thấy 143).</p>

<h3>🧪 Lab (25 phút) — đóng gói dự án của bạn</h3>
<ol>
<li>Chép Dockerfile bốn tầng vào dự án. Dựng hai lần; sửa một dòng trong controller, dựng lại — tầng nào chạy lại?</li>
<li>In cỡ <code>node_modules</code> trong ảnh runtime khi chỉ có <code>--omit=dev</code>, rồi khi thêm <code>--omit=optional</code>. Tìm gói tạo ra khác biệt bằng <code>npm ls &lt;tên&gt;</code>.</li>
<li>Chạy container không có biến môi trường, rồi có. Sau đó <code>docker stop</code> và ghi lại thời gian + <code>ExitCode</code>.</li>
</ol>
<details><summary>Xem đáp án</summary>
<ol>
<li>Sửa controller: <code>deps</code> và <code>prod-deps</code> trúng cache (chỉ <code>package*.json</code> được chép vào chúng); <code>build</code> chạy lại từ <code>COPY src</code>; <code>runtime</code> chỉ chạy lại dòng <code>COPY --from=build</code>. Đo ở đây: lượt dựng đầu 54 giây; 22 giây khi chỉ sửa dòng của tầng <code>prod-deps</code> (các tầng khác lấy từ cache).</li>
<li>Chờ thấy hàng trăm MB từ <code>prisma</code>, <code>@prisma/studio-core</code>, <code>@prisma/engines</code>, <code>effect</code>, <code>@electric-sql/pglite</code>, <code>typescript</code>; <code>npm ls prisma --omit=dev</code> cho thấy chúng nằm dưới <code>@prisma/client</code>. Dự án dùng TypeORM thì danh sách khác — hãy đo, đừng chép số.</li>
<li>Không có biến: thoát mã 1 kèm danh sách biến thiếu. Có biến: <code>docker stop</code> ≈ 0,2 giây và <code>ExitCode=0</code> nếu CMD dạng exec và có gọi <code>enableShutdownHooks()</code>; ngược lại ≈ 10 giây và mã 137.</li>
</ol>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Vì sao ứng dụng Nest nên dựng nhiều tầng?</strong> Bước build cần CLI, TypeScript và bộ sinh Prisma; lúc chạy chỉ cần <code>dist</code> và phụ thuộc production. Đo được: 715 MB → 106 MB khi kéo về.</li>
<li><strong>CMD dạng exec khác dạng shell thế nào?</strong> Dạng shell làm <code>/bin/sh</code> thành PID 1, không chuyển SIGTERM (Debian: 10,4 giây rồi SIGKILL). Dạng exec làm Node thành PID 1, để hook tắt của Nest chạy.</li>
<li><strong>Sao không dùng <code>npm start</code> trong container?</strong> npm có chuyển tín hiệu nhưng thoát mã khác 0, thêm một tiến trình và một dòng log rác; hãy chạy <code>node dist/main.js</code>.</li>
<li><strong>Migration chạy ở đâu?</strong> Không nằm trong CMD của API — là một job/target chạy một lần trước khi container API mới khởi động, để hai bản không bao giờ migrate cùng lúc.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Ở dự án outsourcing, Dockerfile thường được chép từ dự án trước và chẳng ai nhớ vì sao nó nặng 1,5 GB. Một việc nhỏ, ít rủi ro cho tuần đầu: chạy <code>docker history</code> và <code>du -sm node_modules/*</code> trong ảnh, ghi ba thứ nặng nhất kèm con số, rồi đề xuất thay đổi bằng một merge request có cỡ trước/sau và smoke test xanh. Có số liệu thì đề xuất của người mới dễ được nhận.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tầng / target</span><span class="v">Một khối <code>FROM … AS tên</code>; <code>--target</code> chọn tầng để dựng, mặc định là tầng cuối.</span></div>
  <div class="kv"><span class="k">devOptional</span><span class="v">Cờ trong lockfile: devDependency đồng thời là peer tuỳ chọn; chỉ bị bỏ khi <code>--omit=dev --omit=optional</code>.</span></div>
  <div class="kv"><span class="k">Dạng exec</span><span class="v"><code>CMD ["node","dist/main.js"]</code> — không có shell, Node là PID 1.</span></div>
  <div class="kv"><span class="k">PID 1</span><span class="v">Tiến trình đầu tiên trong container; tín hiệu có hành động mặc định bị bỏ qua nếu nó không tự bắt.</span></div>
  <div class="kv"><span class="k">Mã thoát 137 / 143</span><span class="v">Bị SIGKILL giết / kết thúc bởi SIGTERM (128 + số hiệu tín hiệu).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đo trên lab-booking: ngây thơ 2,75 GB (kéo về 715 MB) → bốn tầng 484 MB (kéo về 106 MB), <code>node_modules</code> runtime 192 MB.</li>
<li>Bẫy riêng Nest + Prisma: target mặc định là tầng cuối; <code>prisma generate</code> cần <code>DATABASE_URL</code> giả; <code>--omit=dev</code> giữ lại peer devOptional — thêm <code>--omit=optional</code>.</li>
<li>Chạy bằng <code>node</code>; bí mật không nằm trong ảnh; thiếu biến môi trường thì hỏng ngay lúc khởi động.</li>
<li><code>CMD ["node","dist/main.js"]</code> dạng exec + <code>enableShutdownHooks()</code>: dừng trong 0,2 giây, mã 0. Dạng shell trên Debian: 10,4 giây và SIGKILL.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
