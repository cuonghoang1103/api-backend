/**
 * 1.3 — Dựng khung repo và công cụ (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà (Node 22.22.2, npm 10.9.7): create-vite 9.3.4 (sinh oxlint + TypeScript ~7.0.2), npm ERESOLVE khi thêm
 * typescript-eslint 8.74.0 (peer typescript <6.1.0), oxlint 1.90.0, tsc 7.0.2, Prettier 3.10.1, concurrently 10.0.7, Vite 8.3.8, Express 5.3.0.
 * Repo: scratchpad/fsp/chiase (tag ch1). Bẫy 3 (EADDRINUSE do cổng tạm của kết nối đi ra + Express 5 truyền lỗi listen vào callback) gặp THẬT 24/11 18:40. Sự cố có nguồn (GET 200, 24/11/2026): Wikipedia "Uber" — vụ 2016 công bố 11/2017.
 */
import { nguon, lienKet, spring, esc } from '../_chung.mjs';

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-4-1-package-json', title: 'Node.js 4.1 — package.json và npm scripts', sub: 'Mọi trường trong package.json dùng ở bài này, giải thích kỹ.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-4-2-semver-lockfile', title: 'Node.js 4.2 — Semver và lockfile', sub: 'Vì sao ~7.0.2 khác ^7.0.2, và vì sao package-lock.json phải được commit.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'typescript', bai: 'typescript-9-1-tsc-and-tsconfig', title: 'TypeScript 9.1 — tsc làm gì & tsconfig căn bản', sub: 'Từng tuỳ chọn trong tsconfig của API.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-9-4-bi-mat-va-phu-thuoc', title: 'Node.js 9.4 — Bí mật, phụ thuộc, và những gì lỗi của bạn khai ra', sub: 'Đào sâu chuyện cất bí mật và quét phụ thuộc.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📖', 'Wikipedia — Uber (2016 data breach)', 'Mật khẩu nhân viên bị lộ ⇒ vào repo GitHub riêng ⇒ thấy khoá AWS ⇒ dữ liệu 57 triệu khách và 600.000 tài xế.', 'https://en.wikipedia.org/wiki/Uber'),
  nguon('📘', 'npm Docs — workspaces', 'Một repo, nhiều gói; npm install một lần ở gốc.', 'https://docs.npmjs.com/cli/v10/using-npm/workspaces'),
  nguon('📘', 'Vite — Env Variables and Modes', 'Chỉ biến bắt đầu bằng VITE_ được đưa vào mã phía trình duyệt.', 'https://vite.dev/guide/env-and-mode'),
].join('\n');

const CAY = `chiase/
├── package.json          # gốc: workspaces + script chung
├── package-lock.json     # PHẢI commit — ai cài cũng ra đúng phiên bản
├── .nvmrc                # 22
├── .editorconfig  .prettierrc.json  .prettierignore  .oxlintrc.json
├── .gitignore            # chặn .env, node_modules, dist
├── README.md  docs/  scripts/
└── apps/
    ├── api/              # Express 5 + TypeScript
    │   ├── package.json  tsconfig.json  .env.example
    │   └── src/ app.ts  config.ts  server.ts
    └── web/              # React 19 + Vite 8 + TypeScript
        ├── package.json  vite.config.ts  tsconfig*.json  .env.example
        └── src/ App.tsx  main.tsx  index.css`;

const OUT_VITE = `$ cd apps &amp;&amp; npm create vite@9.3.4 web -- --template react-ts
npm warn exec The following package was not found and will be installed: create-vite@9.3.4

create-vite v9.3.4

│
◇  Scaffolding project in /home/…/chiase/apps/web...
│
└  Done. Now run:

  cd web
  npm install
  npm run dev`;

const PKG_WEB_GOC = `"scripts": { "dev": "vite", "build": "tsc -b &amp;&amp; vite build", "lint": "oxlint", "preview": "vite preview" },
"devDependencies": {
  "@types/node": "^24.19.2", "@types/react": "^19.3.0", "@types/react-dom": "^19.3.0",
  "@vitejs/plugin-react": "^6.1.2", "oxlint": "^1.90.0", "typescript": "~7.0.2", "vite": "^8.3.6"
}`;

const OUT_ERESOLVE = `$ npm install -D -w apps/web eslint@10 typescript-eslint@8.74.0
npm error code ERESOLVE
npm error ERESOLVE unable to resolve dependency tree
npm error
npm error While resolving: web@0.0.0
npm error Found: typescript@7.0.2
npm error node_modules/typescript
npm error   dev typescript@"~7.0.2" from web@0.0.0
…
npm error Could not resolve dependency:
npm error peer typescript@">=4.8.4 &lt;6.1.0" from typescript-eslint@8.74.0
…
npm error Fix the upstream dependency conflict, or retry
npm error this command with --force or --legacy-peer-deps
npm error to accept an incorrect (and potentially broken) dependency resolution.`;

const PKG_GOC = `{
  "name": "chiase",
  "private": true,
  "workspaces": ["apps/api", "apps/web"],
  "engines": { "node": "&gt;=22.12" },
  "scripts": {
    "dev": "concurrently -n api,web -c blue,magenta \\"npm run dev -w apps/api\\" \\"npm run dev -w apps/web\\"",
    "lint": "oxlint --deny-warnings apps",
    "typecheck": "npm run typecheck --workspaces",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "check": "npm run lint &amp;&amp; npm run typecheck &amp;&amp; npm run format:check"
  },
  "devDependencies": { "concurrently": "^10.0.7", "oxlint": "^1.90.0", "prettier": "^3.10.1" }
}`;

const PKG_API = `{
  "name": "api",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch --env-file-if-exists=.env src/server.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node --env-file-if-exists=.env dist/server.js",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": { "express": "^5.3.0" },
  "devDependencies": { "@types/express": "^5.0.6", "@types/node": "^22.20.5", "tsx": "^4.23.15", "typescript": "~7.0.2" }
}`;

const TSCONFIG = `{
  "compilerOptions": {
    "target": "es2023",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "types": ["node"]
  },
  "include": ["src"]
}`;

const CONFIG_TS = `// Đọc cấu hình MỘT lần, ở MỘT chỗ. Thiếu biến bắt buộc ⇒ dừng ngay lúc khởi động, không đợi tới request đầu tiên.
function batBuoc(ten: string): string {
  const v = process.env[ten];
  if (!v) throw new Error(\`Thiếu biến môi trường \${ten} — chép .env.example thành .env rồi điền\`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 41810),
  webOrigin: batBuoc('WEB_ORIGIN'),
};`;

const APP_TS = `import express from 'express';

// Tách app (định nghĩa route) khỏi server (mở cổng) để Chương 8 test bằng Supertest mà không cần mở cổng thật.
export function taoApp() {
  const app = express();
  app.use(express.json({ limit: '100kb' }));

  app.get('/api', (_req, res) => {
    res.json({ ten: 'chiase-api', phienBan: '0.1.0' });
  });

  return app;
}`;

const SERVER_TS = `import { config } from './config.js';
import { taoApp } from './app.js';

const app = taoApp();
// Express 5: nếu mở cổng thất bại (cổng bị chiếm, không có quyền…), lỗi được TRUYỀN VÀO callback này.
// Bỏ qua tham số err ⇒ in "đang nghe" dù không nghe gì, rồi tiến trình thoát với mã 0.
app.listen(config.port, (err?: Error) => {
  if (err) {
    console.error(\`Không mở được cổng \${config.port}: \${err.message}\`);
    process.exit(1);
  }
  console.log(\`API ChiaSe đang nghe http://localhost:\${config.port} (cho phép web \${config.webOrigin})\`);
});`;

const OUT_EADDR = `$ npx tsx --env-file-if-exists=.env src/server.ts
Không mở được cổng 41810: listen EADDRINUSE: address already in use :::41810
$ ss -ltnp | grep :41810            # có ai LISTEN không?
$                                   # (không có dòng nào)
$ ss -tanp | grep :41810
ESTAB  0  0  192.168.0.x:41810  160.79.104.10:443  users:(("claude",pid=2319488,fd=25))
$ cat /proc/sys/net/ipv4/ip_local_port_range
32768	60999`;

const ENV_API = `# Chép thành .env (KHÔNG commit .env). Giá trị ở đây là mẫu cho máy dev, không phải bí mật thật.
PORT=41810
WEB_ORIGIN=http://localhost:41811
# Chương 2 thêm: DATABASE_URL=postgresql://chiase:chiase@localhost:41812/chiase
# Chương 3 thêm: JWT_ACCESS_SECRET=  (sinh bằng: node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))")`;

const ENV_WEB = `# Chép thành .env.local. MỌI biến VITE_* bị nhúng vào JavaScript gửi cho trình duyệt ⇒ ai cũng đọc được. KHÔNG để bí mật ở đây.
VITE_API_URL=http://localhost:41810`;

const GITIGNORE = `node_modules
dist
dist-ssr
coverage
*.log
*.local
.DS_Store

# Bí mật: .env KHÔNG BAO GIỜ vào git; .env.example thì CÓ
.env
.env.*
!.env.example

# Editor
.vscode/*
!.vscode/extensions.json
.idea`;

const OUT_THIEU_ENV = `$ npx tsx src/server.ts            # chưa có .env
/home/…/chiase/apps/api/src/config.ts:4
  if (!v) throw new Error(\`Thiếu biến môi trường \${ten} — chép .env.example thành .env rồi điền\`);
                ^

Error: Thiếu biến môi trường WEB_ORIGIN — chép .env.example thành .env rồi điền
    at batBuoc (/home/…/chiase/apps/api/src/config.ts:4:17)
    at &lt;anonymous&gt; (/home/…/chiase/apps/api/src/config.ts:10:14)
    …
Node.js v22.22.2`;

const OUT_LINT = `$ npm run lint      # tệp thử có debugger và a == NaN

&gt; lint
&gt; oxlint --deny-warnings apps

apps/api/src/thu-lint.ts:2:3: warning eslint(no-debugger): \`debugger\` statement is not allowed help: Remove the debugger statement
apps/api/src/thu-lint.ts:3:12: warning eslint(use-isnan): Checking equality with NaN will always return false help: Use the \`isNaN\` function to compare with NaN.
$ echo $?
1`;

const OUT_TSC = `$ npm run typecheck -w apps/api     # tệp thử: const cong: string = config.port;

&gt; api@0.0.0 typecheck
&gt; tsc -p tsconfig.json --noEmit

src/thu-kieu.ts(2,14): error TS2322: Type 'number' is not assignable to type 'string'.
npm error Lifecycle script \`typecheck\` failed with error:
npm error code 1`;

const OUT_PRETTIER = `$ npm run format:check
Checking formatting...
[warn] apps/web/src/App.css
[warn] apps/web/src/App.tsx
[warn] apps/web/src/index.css
[warn] apps/web/src/main.tsx
[warn] apps/web/tsconfig.json
[warn] apps/web/vite.config.ts
[warn] Code style issues found in 6 files. Run Prettier with --write to fix.
$ npx prettier --write . &gt;/dev/null &amp;&amp; npm run format:check
Checking formatting...
All matched files use Prettier code style!`;

const OUT_WS = `$ npm run dev --workspaces          # ĐỪNG làm thế này
&gt; api@0.0.0 dev
&gt; tsx watch --env-file-if-exists=.env src/server.ts

API ChiaSe đang nghe http://localhost:41810 (cho phép web http://localhost:41811)
$ curl -s -o /dev/null -w "web 41811: %{http_code}\\n" localhost:41811/
web 41811: 000`;

const OUT_DEV = `$ npm run dev
&gt; concurrently -n api,web -c blue,magenta "npm run dev -w apps/api" "npm run dev -w apps/web"

[web] &gt; web@0.0.0 dev
[web] &gt; vite
[api] &gt; api@0.0.0 dev
[api] &gt; tsx watch --env-file-if-exists=.env src/server.ts
[web]   VITE v8.3.8  ready in 396 ms
[web]   ➜  Local:   http://localhost:41811/
[web]   ➜  Network: use --host to expose
[api] API ChiaSe đang nghe http://localhost:41810 (cho phép web http://localhost:41811)

$ curl -s localhost:41810/api
{"ten":"chiase-api","phienBan":"0.1.0"}
$ curl -s -o /dev/null -w "%{http_code}\\n" localhost:41811/
200`;

const OUT_CONG = `[web] error when starting dev server:
[web] Error: Port 41811 is already in use
$ ss -ltnp | grep 41811
LISTEN 0  511  [::1]:41811  [::]:*  users:(("node",pid=2169957,fd=20))
$ ps -o pid,ppid,args -p 2169957
    PID    PPID COMMAND
2169957 2169199 node /home/…/chiase/node_modules/.bin/vite`;

export default {
  title: '1.3 — Scaffolding the repo and tooling|||1.3 — Dựng khung repo và công cụ',
  slug: 'fp-1-3-dung-khung',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một repo hai ứng dụng bằng npm workspaces; create-vite 9.3.4 sinh sẵn oxlint + TypeScript 7 (và vì sao thêm typescript-eslint bị ERESOLVE); khung API Express 5 + TS chạy bằng tsx; lint, kiểm kiểu, Prettier bắt lỗi thật; .env.example từ ngày đầu, biến VITE_ là công khai; chạy cả hai bằng một lệnh — kèm vụ Uber 2016 và hai cái bẫy "npm run dev --workspaces" và cổng bị chiếm.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Scaffolding</span>
<h2>One repository, two apps, one command to run them, and three tools that catch mistakes before you do</h2>
<p class="lead">Now you create the skeleton every later chapter builds on: a single Git repository holding the API and the web app, TypeScript everywhere, a linter, a formatter, environment files that keep secrets out of Git, and <code>npm run dev</code> that starts both. Everything below was run on a real machine on 24/11/2026 — including the two mistakes we made, because you will make them too.</p>

<h3>Everyday picture: setting up a kitchen before cooking</h3>
<p>Chefs call it <em>mise en place</em>: knives sharpened, ingredients in bowls, bins in reach, before the first order. Ten minutes of setup saves an evening of chaos. Lint, typecheck and formatting are your sharp knives; <code>.gitignore</code> is the bin that keeps the rubbish (secrets, <code>node_modules</code>) out of the dish.</p>

<h3>One repository or two?</h3>
<table>
<thead><tr><th></th><th>One repo (monorepo) — chosen</th><th>Two repos</th></tr></thead>
<tbody>
<tr><td>Change API + page together</td><td>One commit, one pull request</td><td>Two PRs that must be merged in order</td></tr>
<tr><td>Run everything</td><td><code>npm run dev</code> at the root</td><td>Two terminals, two clones</td></tr>
<tr><td>CI</td><td>One pipeline (can still test only what changed)</td><td>Two pipelines to keep in sync</td></tr>
<tr><td>When two repos win</td><td colspan="2">Separate teams with separate release cycles, or a mobile app and a web app sharing one public API</td></tr>
</tbody>
</table>
<p><strong>npm workspaces</strong> make a monorepo cheap: the root <code>package.json</code> lists <code>apps/api</code> and <code>apps/web</code>; one <code>npm install</code> at the root installs both, with one <code>package-lock.json</code>.</p>
<pre><code class="language-text">${CAY}</code></pre>

<h3>Step 1 — The web app: what the generator gives you in 2026</h3>
<div class="out">${OUT_VITE}</div>
<p>Open the generated <code>apps/web/package.json</code> before you trust it:</p>
<pre><code class="language-json">${PKG_WEB_GOC}</code></pre>
<p>Two things changed compared with older tutorials. The template now ships <strong>oxlint</strong> (a fast linter written in Rust) instead of ESLint, and <strong>TypeScript 7</strong> (the new native compiler). If you follow an older tutorial and add ESLint's TypeScript plugin, this is what happens:</p>
<div class="out">${OUT_ERESOLVE}</div>
<p>Read it from the bottom: <code>typescript-eslint@8.74.0</code> declares a <strong>peer dependency</strong> on TypeScript <code>&lt;6.1.0</code>, but the project has 7.0.2. npm refuses. <code>--force</code> would install it anyway and you would get a linter that may crash or silently skip rules. The right reactions are: (a) use the tool the template chose (oxlint works with TS 7), or (b) pin TypeScript to <code>6.0.x</code> on purpose and write down why. We choose (a) for this course; at a company you follow the project's existing setup. Either way: <strong>read peer-dependency errors, never paper over them with --force.</strong></p>
<p>We also changed <code>@types/node</code> from <code>^24</code> to <code>^22</code> — the types should match the Node version you actually run — moved oxlint to the root (one config for both apps), deleted the demo assets, and set Vite's port in <code>vite.config.ts</code> with <code>strictPort: true</code> so it fails loudly instead of silently picking another port.</p>

<h3>Step 2 — The API skeleton</h3>
<pre><code class="language-bash">mkdir -p apps/api/src
npm install -w apps/api express@5.3.0
npm install -D -w apps/api typescript@~7.0.2 tsx@4.23.15 @types/express@5.0.6 @types/node@22</code></pre>
<pre><code class="language-json">${PKG_API}</code></pre>
<ul>
<li><code>"type": "module"</code>: real ES modules (<code>import</code>), the modern default.</li>
<li><strong>tsx</strong> runs <code>.ts</code> directly and restarts on save (<code>watch</code>) — no build step during development. <code>tsc</code> is used for checking (<code>typecheck</code>) and for the production build.</li>
<li><code>--env-file-if-exists=.env</code>: Node 22 reads the <code>.env</code> file itself; no extra library needed.</li>
</ul>
<pre><code class="language-json">${TSCONFIG}</code></pre>
<p><code>strict</code> turns on all the checks that catch null/undefined bugs; <code>noUncheckedIndexedAccess</code> makes <code>arr[0]</code> possibly <code>undefined</code>, which it really is; <code>module: nodenext</code> is why imports end in <code>.js</code> even in <code>.ts</code> files.</p>
<p>Three small files, each with one job:</p>
<pre><code class="language-ts">${esc(CONFIG_TS)}</code></pre>
<pre><code class="language-ts">${esc(APP_TS)}</code></pre>
<pre><code class="language-ts">${esc(SERVER_TS)}</code></pre>
<p>Every route lives under <code>/api</code> from day one (decided in 0.1). Separating <code>app.ts</code> from <code>server.ts</code> costs nothing now and lets Chapter 8 test the app without opening a port. And because configuration is read once at startup, a missing variable fails immediately and clearly:</p>
<div class="out">${OUT_THIEU_ENV}</div>

<h3>Step 3 — Environment files from day one</h3>
<pre><code class="language-ini">${esc(ENV_API)}</code></pre>
<pre><code class="language-ini">${esc(ENV_WEB)}</code></pre>
<pre><code class="language-text">${GITIGNORE}</code></pre>
<ul>
<li><code>.env.example</code> is committed: it documents every variable, with safe example values. <code>.env</code> is never committed: it holds the real values on each machine.</li>
<li><strong>Anything starting with <code>VITE_</code> is compiled into the JavaScript sent to every browser.</strong> The API URL is fine there. A secret key is not — anyone can open DevTools and read it.</li>
</ul>

<h3>⚠️ Real incident: credentials in a "private" repository — Uber, 2016</h3>
<p>In 2016 attackers used passwords of Uber employees that had leaked in earlier breaches to get into a <strong>private GitHub repository</strong> used by Uber's developers. In the repository files they found credentials for Uber's Amazon Web Services account, and from there reached data of <strong>57 million customers and 600,000 drivers</strong>. Uber paid the attackers $100,000 and did not disclose the breach until November 2017 (Wikipedia, "Uber"). Lessons that apply from your very first commit:</p>
<ul>
<li>"Private repository" is not a safe. Secrets never go into Git — private or public.</li>
<li>If a secret was ever committed, deleting the file is not enough: it stays in history. <strong>Rotate</strong> the secret (make a new one, revoke the old one).</li>
<li>Use 2FA on GitHub; the attack started with reused passwords.</li>
</ul>

<h3>Step 4 — Three tools that catch mistakes</h3>
<pre><code class="language-json">${PKG_GOC}</code></pre>
<p><strong>Lint</strong> finds code that is legal but almost certainly wrong. We planted a file with <code>debugger</code> and <code>a == NaN</code>:</p>
<div class="out">${OUT_LINT}</div>
<p>Without <code>--deny-warnings</code> oxlint reports warnings but exits with 0 — CI would stay green. With it, exit code 1 fails the check.</p>
<p><strong>Typecheck</strong> finds values of the wrong type:</p>
<div class="out">${OUT_TSC}</div>
<p><strong>Prettier</strong> ends style arguments. The first run found 6 template files in a different style; one <code>--write</code> fixed them:</p>
<div class="out">${OUT_PRETTIER}</div>
<p><code>.editorconfig</code> (2 spaces, LF, UTF-8, final newline) keeps editors consistent between Windows and macOS; <code>.nvmrc</code> containing <code>22</code> lets <code>nvm use</code> pick the right Node; <code>engines</code> documents the minimum.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">npm run dev (root)</span><span class="lz-d">concurrently starts two labelled commands in parallel</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">[api] tsx watch</span><span class="lz-d">reads .env, runs src/server.ts, restarts on save → :41810/api</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">[web] vite</span><span class="lz-d">serves React with hot reload → :41811</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Ctrl+C</span><span class="lz-d">concurrently stops both; nothing left on the ports</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — "--force will fix it".</strong> --force and --legacy-peer-deps silence npm, not the incompatibility. The crash moves from install time (clear) to run time (confusing).</p></div>
<h3>Step 5 — Run both with one command (and two traps we fell into)</h3>
<p>Trap 1: <code>npm run dev --workspaces</code> looks right but runs the workspaces <strong>one after another</strong>. The API's dev server never exits, so the web app never starts:</p>
<div class="out">${OUT_WS}</div>
<p>The fix is a small tool that runs commands in parallel with labelled output: <strong>concurrently</strong>.</p>
<div class="out">${OUT_DEV}</div>
<p>Trap 2: the first time we ran it, Vite said the port was taken. The cause was our own earlier run: stopping <code>npm run dev --workspaces</code> killed the API, then npm went on and started Vite — which kept running in the background. Find the owner of a port before killing anything:</p>
<div class="out">${OUT_CONG}</div>
<p>On Windows: <code>netstat -ano | findstr :41811</code>, then <code>tasklist /FI "PID eq &lt;pid&gt;"</code>. Kill it only if it is yours.</p>
<p>Trap 3 — the strangest one, and it happened while writing this course. Our first <code>server.ts</code> called <code>app.listen(port, () =&gt; console.log(…))</code>. One afternoon the API printed "đang nghe" (listening) and then the process <strong>exited with code 0</strong>; curl got "connection refused". In <strong>Express 5</strong>, if opening the port fails, the error is <em>passed to the callback</em> — our callback ignored it and printed success. After handling <code>err</code> (the version shown in Step 2), the real cause appeared:</p>
<div class="out">${OUT_EADDR}</div>
<p>Nobody was <em>listening</em> on 41810, but an <strong>outgoing</strong> connection of another program on the same machine had been given 41810 as its temporary local port. Linux hands out such "ephemeral" ports from 32768–60999 (Windows and macOS: 49152–65535), so a dev port inside that range can occasionally be taken. Fixes: pick another port in <code>.env</code> (we used <code>PORT=41815</code> and the checkpoint passed 17/17), or on your own machine prefer ports below 32768 such as 4000 and 5173. The bigger lesson: <strong>never ignore an error parameter</strong> — a callback that prints "OK" without checking is a lie the program tells you.</p>

${spring(true, 'With Spring Boot the backend skeleton comes from Spring Initializr (Maven/Gradle instead of npm, application.properties/yaml instead of .env, profiles for environments). The repo can still be one monorepo with apps/api (Spring) and apps/web (React).', [
  ['sb-0-1-cai-dat', 'Spring Boot 0.1 — Install the JDK and create a project with Spring Initializr'],
  ['sb-0-2-cau-truc-du-an', 'Spring Boot 0.2 — Anatomy of a Spring Boot project'],
  ['sb-3-7-profile-config', 'Spring Boot 3.7 — Profiles and typed configuration'],
])}

<h3>🎤 Interview corner</h3>
<ol>
<li><strong>"Why commit package-lock.json?"</strong> — It pins the exact version of every package, direct and indirect, so every machine and CI installs the same tree (<code>npm ci</code>).</li>
<li><strong>"A secret was pushed to GitHub. What do you do?"</strong> — Rotate it immediately, then remove it from history if needed, check access logs; deleting the file alone does nothing.</li>
<li><strong>"What is a peer dependency?"</strong> — A package saying "I work with your copy of X in this version range", e.g. a TypeScript plugin with TypeScript. Conflicts mean real incompatibility.</li>
<li><strong>"Lint vs typecheck vs format?"</strong> — Suspicious patterns; wrong types; whitespace and style. Three different questions, all automated.</li>
<li><strong>"EADDRINUSE but nothing is listening on that port — how?"</strong> — The port is in use as the local end of an outgoing connection (ephemeral port range). Check <code>ss -tanp</code>, not only <code>ss -ltnp</code>; choose a port outside the range.</li>
</ol>

<h3>🧪 Lab 1.3 (60 min) — build the skeleton yourself</h3>
<div class="callout ok">
<ol>
<li>Create the root <code>package.json</code> with workspaces; scaffold <code>apps/web</code> with <code>npm create vite@latest web -- --template react-ts</code>; create <code>apps/api</code> as above.</li>
<li>Add <code>.gitignore</code>, <code>.editorconfig</code>, <code>.nvmrc</code>, Prettier, oxlint at the root; <code>.env.example</code> in both apps; set Vite to port 41811 with <code>strictPort</code>.</li>
<li>Prove each tool works by breaking it once: a <code>debugger</code> (lint fails), a type error (typecheck fails), a missing <code>.env</code> (API exits with your message). Undo each.</li>
<li><code>npm run dev</code> → <code>curl localhost:41810/api</code> returns JSON and <code>localhost:41811</code> returns 200.</li>
<li>Commit on your <code>ch1/ke-hoach</code> branch: <code>chore: dựng khung repo, TypeScript, oxlint, Prettier</code>.</li>
</ol>
<p><strong>Rubric (10 pts):</strong> workspaces + lockfile committed (2) · <code>npm run check</code> passes (2) · each tool demonstrably fails on a planted mistake (3) · no <code>.env</code> in Git, both <code>.env.example</code> present (2) · one-command dev works (1).</p>
</div>
<details><summary>Solution</summary>
<p>All files are shown above exactly as in the ChiaSe repo (tag <code>ch1</code>). If <code>git status --short --ignored</code> does not list <code>apps/api/.env</code> with <code>!!</code>, your ignore rules are wrong. If Vite starts on another port, you forgot <code>strictPort</code>. If <code>npm run lint</code> prints warnings and <code>echo $?</code> says 0, add <code>--deny-warnings</code>.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">monorepo</span><span class="v">One repository containing several apps/packages.</span></div>
  <div class="kv"><span class="k">npm workspaces</span><span class="v">npm feature that installs and runs scripts for several packages from one root.</span></div>
  <div class="kv"><span class="k">peer dependency</span><span class="v">"I need your copy of X in this range" — e.g. a TS plugin needs TS.</span></div>
  <div class="kv"><span class="k">linter</span><span class="v">Tool that flags suspicious code (oxlint, ESLint).</span></div>
  <div class="kv"><span class="k">.env.example</span><span class="v">Committed list of required variables with safe example values.</span></div>
  <div class="kv"><span class="k">secret rotation</span><span class="v">Replacing a leaked secret with a new one and revoking the old one.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>One repo, two apps, npm workspaces, one lockfile, one <code>npm run dev</code> via concurrently.</li>
<li>Generators change: create-vite 9.3.4 gives oxlint + TS 7; a peer conflict is information, not an obstacle to --force past.</li>
<li>Config read once at startup; missing variables fail immediately.</li>
<li>Secrets: .env ignored, .env.example committed, VITE_ is public; Uber 2016 shows "private repo" is not a safe.</li>
<li>Lint (with --deny-warnings), typecheck and Prettier each proven by breaking them once.</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Dựng khung</span>
<h2>Một repo, hai ứng dụng, một lệnh để chạy, và ba công cụ bắt lỗi trước cả bạn</h2>
<p class="lead">Giờ bạn dựng bộ khung mà mọi chương sau xây lên: một repo Git chứa cả API lẫn web, TypeScript ở mọi nơi, một linter, một công cụ định dạng, các tệp môi trường giữ bí mật ngoài Git, và <code>npm run dev</code> chạy cả hai. Mọi thứ dưới đây đã chạy trên máy thật ngày 24/11/2026 — kể cả hai lỗi chúng tôi mắc, vì bạn cũng sẽ mắc.</p>

<h3>Liên tưởng đời thường: sắp bếp trước khi nấu</h3>
<p>Đầu bếp gọi là <em>mise en place</em>: dao đã mài, nguyên liệu đã vào bát, thùng rác trong tầm tay, trước khi có đơn đầu tiên. Mười phút chuẩn bị cứu cả buổi tối khỏi hỗn loạn. Lint, kiểm kiểu và định dạng là con dao sắc của bạn; <code>.gitignore</code> là thùng rác giữ rác (bí mật, <code>node_modules</code>) khỏi rơi vào món ăn.</p>

<h3>Một repo hay hai repo?</h3>
<table>
<thead><tr><th></th><th>Một repo (monorepo) — chọn cái này</th><th>Hai repo</th></tr></thead>
<tbody>
<tr><td>Sửa API + trang cùng lúc</td><td>Một commit, một pull request</td><td>Hai PR phải merge đúng thứ tự</td></tr>
<tr><td>Chạy mọi thứ</td><td><code>npm run dev</code> ở thư mục gốc</td><td>Hai terminal, hai bản clone</td></tr>
<tr><td>CI</td><td>Một pipeline (vẫn có thể chỉ test phần đổi)</td><td>Hai pipeline phải giữ khớp nhau</td></tr>
<tr><td>Khi nào hai repo thắng</td><td colspan="2">Hai đội riêng với lịch phát hành riêng, hoặc app di động và web dùng chung một API công khai</td></tr>
</tbody>
</table>
<p><strong>npm workspaces</strong> làm monorepo rẻ: <code>package.json</code> ở gốc liệt kê <code>apps/api</code> và <code>apps/web</code>; một lần <code>npm install</code> ở gốc cài cho cả hai, với một <code>package-lock.json</code>.</p>
<pre><code class="language-text">${CAY}</code></pre>

<h3>Bước 1 — Ứng dụng web: trình sinh mã cho bạn gì vào năm 2026</h3>
<div class="out">${OUT_VITE}</div>
<p>Mở <code>apps/web/package.json</code> vừa sinh ra trước khi tin nó:</p>
<pre><code class="language-json">${PKG_WEB_GOC}</code></pre>
<p>Có hai thay đổi so với tutorial cũ. Mẫu giờ đi kèm <strong>oxlint</strong> (linter rất nhanh viết bằng Rust) thay vì ESLint, và <strong>TypeScript 7</strong> (trình biên dịch native mới). Nếu bạn theo một tutorial cũ và thêm plugin TypeScript của ESLint, đây là chuyện xảy ra:</p>
<div class="out">${OUT_ERESOLVE}</div>
<p>Đọc từ dưới lên: <code>typescript-eslint@8.74.0</code> khai báo <strong>peer dependency</strong> (phụ thuộc ngang hàng) với TypeScript <code>&lt;6.1.0</code>, nhưng dự án có 7.0.2. npm từ chối. <code>--force</code> sẽ cài bất chấp và bạn nhận một linter có thể sập hoặc âm thầm bỏ luật. Phản ứng đúng là: (a) dùng công cụ mẫu đã chọn (oxlint chạy được với TS 7), hoặc (b) cố ý ghim TypeScript ở <code>6.0.x</code> và ghi lý do. Khoá này chọn (a); ở công ty bạn theo cấu hình sẵn có của dự án. Dù thế nào: <strong>đọc lỗi peer dependency, đừng bao giờ lấp nó bằng --force.</strong></p>
<p>Chúng tôi còn đổi <code>@types/node</code> từ <code>^24</code> về <code>^22</code> — kiểu phải khớp phiên bản Node bạn thật sự chạy — chuyển oxlint lên thư mục gốc (một cấu hình cho cả hai ứng dụng), xoá ảnh demo, và đặt cổng Vite trong <code>vite.config.ts</code> kèm <code>strictPort: true</code> để nó báo lỗi rõ ràng thay vì âm thầm chọn cổng khác.</p>

<h3>Bước 2 — Khung API</h3>
<pre><code class="language-bash">mkdir -p apps/api/src
npm install -w apps/api express@5.3.0
npm install -D -w apps/api typescript@~7.0.2 tsx@4.23.15 @types/express@5.0.6 @types/node@22</code></pre>
<pre><code class="language-json">${PKG_API}</code></pre>
<ul>
<li><code>"type": "module"</code>: dùng ES module thật (<code>import</code>), mặc định hiện đại.</li>
<li><strong>tsx</strong> chạy thẳng tệp <code>.ts</code> và tự khởi động lại khi lưu (<code>watch</code>) — không cần bước build lúc phát triển. <code>tsc</code> dùng để kiểm (<code>typecheck</code>) và để build production.</li>
<li><code>--env-file-if-exists=.env</code>: Node 22 tự đọc tệp <code>.env</code>; không cần thư viện thêm.</li>
</ul>
<pre><code class="language-json">${TSCONFIG}</code></pre>
<p><code>strict</code> bật mọi phép kiểm bắt lỗi null/undefined; <code>noUncheckedIndexedAccess</code> coi <code>arr[0]</code> có thể là <code>undefined</code> — đúng sự thật; <code>module: nodenext</code> là lý do import kết thúc bằng <code>.js</code> dù tệp là <code>.ts</code>.</p>
<p>Ba tệp nhỏ, mỗi tệp một việc:</p>
<pre><code class="language-ts">${esc(CONFIG_TS)}</code></pre>
<pre><code class="language-ts">${esc(APP_TS)}</code></pre>
<pre><code class="language-ts">${esc(SERVER_TS)}</code></pre>
<p>Mọi route nằm dưới <code>/api</code> ngay từ ngày đầu (đã chốt ở 0.1). Tách <code>app.ts</code> khỏi <code>server.ts</code> bây giờ chẳng tốn gì, mà giúp Chương 8 test ứng dụng không cần mở cổng. Và vì cấu hình được đọc một lần lúc khởi động, thiếu biến là hỏng ngay, rõ ràng:</p>
<div class="out">${OUT_THIEU_ENV}</div>

<h3>Bước 3 — Tệp môi trường từ ngày đầu</h3>
<pre><code class="language-ini">${esc(ENV_API)}</code></pre>
<pre><code class="language-ini">${esc(ENV_WEB)}</code></pre>
<pre><code class="language-text">${GITIGNORE}</code></pre>
<ul>
<li><code>.env.example</code> được commit: nó ghi lại mọi biến, với giá trị mẫu an toàn. <code>.env</code> không bao giờ commit: nó chứa giá trị thật trên từng máy.</li>
<li><strong>Mọi biến bắt đầu bằng <code>VITE_</code> bị biên dịch vào JavaScript gửi tới mọi trình duyệt.</strong> Địa chỉ API để đó thì được. Khoá bí mật thì không — ai cũng mở DevTools đọc được.</li>
</ul>

<h3>⚠️ Sự cố thật: thông tin đăng nhập trong repo "riêng tư" — Uber, 2016</h3>
<p>Năm 2016, kẻ tấn công dùng mật khẩu của nhân viên Uber đã bị lộ từ các vụ rò rỉ trước để vào một <strong>repo GitHub riêng tư</strong> mà lập trình viên Uber dùng. Trong các tệp của repo, chúng tìm thấy thông tin đăng nhập tài khoản Amazon Web Services của Uber, và từ đó với tới dữ liệu của <strong>57 triệu khách hàng và 600.000 tài xế</strong>. Uber trả kẻ tấn công 100.000 USD và tới tháng 11/2017 mới công bố (Wikipedia, "Uber"). Bài học áp dụng từ commit đầu tiên của bạn:</p>
<ul>
<li>"Repo riêng tư" không phải két sắt. Bí mật không bao giờ vào Git — riêng tư hay công khai.</li>
<li>Nếu bí mật đã từng bị commit, xoá tệp là chưa đủ: nó vẫn nằm trong lịch sử. Phải <strong>xoay vòng</strong> (rotate) bí mật: tạo cái mới, thu hồi cái cũ.</li>
<li>Bật xác thực hai lớp trên GitHub; vụ này bắt đầu từ mật khẩu dùng lại.</li>
</ul>

<h3>Bước 4 — Ba công cụ bắt lỗi</h3>
<pre><code class="language-json">${PKG_GOC}</code></pre>
<p><strong>Lint</strong> tìm mã hợp lệ nhưng gần như chắc chắn sai. Chúng tôi cài sẵn một tệp có <code>debugger</code> và <code>a == NaN</code>:</p>
<div class="out">${OUT_LINT}</div>
<p>Không có <code>--deny-warnings</code>, oxlint báo cảnh báo nhưng thoát với mã 0 — CI vẫn xanh. Có nó, mã thoát 1 làm phép kiểm thất bại.</p>
<p><strong>Kiểm kiểu</strong> tìm giá trị sai kiểu:</p>
<div class="out">${OUT_TSC}</div>
<p><strong>Prettier</strong> chấm dứt tranh cãi về kiểu viết. Lần chạy đầu tìm ra 6 tệp mẫu viết khác kiểu; một lần <code>--write</code> là sửa xong:</p>
<div class="out">${OUT_PRETTIER}</div>
<p><code>.editorconfig</code> (2 dấu cách, LF, UTF-8, xuống dòng cuối tệp) giữ trình soạn thảo thống nhất giữa Windows và macOS; <code>.nvmrc</code> chứa <code>22</code> để <code>nvm use</code> chọn đúng Node; <code>engines</code> ghi lại phiên bản tối thiểu.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">npm run dev (gốc)</span><span class="lz-d">concurrently chạy song song hai lệnh có nhãn</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">[api] tsx watch</span><span class="lz-d">đọc .env, chạy src/server.ts, tự khởi động lại khi lưu → :41810/api</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">[web] vite</span><span class="lz-d">phục vụ React, nạp nóng → :41811</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Ctrl+C</span><span class="lz-d">concurrently tắt cả hai; không còn gì giữ cổng</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "--force là xong".</strong> --force và --legacy-peer-deps chỉ bịt miệng npm, không bịt được sự không tương thích. Lỗi chuyển từ lúc cài (rõ ràng) sang lúc chạy (khó hiểu).</p></div>
<h3>Bước 5 — Chạy cả hai bằng một lệnh (và hai cái bẫy chúng tôi đã rơi vào)</h3>
<p>Bẫy 1: <code>npm run dev --workspaces</code> trông có vẻ đúng nhưng chạy các workspace <strong>lần lượt từng cái</strong>. Server dev của API không bao giờ kết thúc, nên web không bao giờ được chạy:</p>
<div class="out">${OUT_WS}</div>
<p>Cách sửa là một công cụ nhỏ chạy các lệnh song song, output có nhãn: <strong>concurrently</strong>.</p>
<div class="out">${OUT_DEV}</div>
<p>Bẫy 2: lần đầu chạy, Vite báo cổng đã bị chiếm. Thủ phạm là chính lần chạy trước của chúng tôi: dừng <code>npm run dev --workspaces</code> đã giết API, rồi npm đi tiếp và khởi động Vite — tiến trình đó cứ thế chạy ngầm. Tìm chủ của cổng trước khi giết bất cứ thứ gì:</p>
<div class="out">${OUT_CONG}</div>
<p>Trên Windows: <code>netstat -ano | findstr :41811</code>, rồi <code>tasklist /FI "PID eq &lt;pid&gt;"</code>. Chỉ giết khi đúng là của bạn.</p>
<p>Bẫy 3 — lạ nhất, và xảy ra ngay lúc soạn khoá này. Bản <code>server.ts</code> đầu tiên của chúng tôi gọi <code>app.listen(port, () =&gt; console.log(…))</code>. Một buổi chiều, API in "đang nghe" rồi tiến trình <strong>thoát với mã 0</strong>; curl nhận "connection refused". Ở <strong>Express 5</strong>, nếu mở cổng thất bại, lỗi được <em>truyền vào callback</em> — callback của chúng tôi bỏ qua nó và in thành công. Sau khi xử lý <code>err</code> (bản ở Bước 2), nguyên nhân thật lộ ra:</p>
<div class="out">${OUT_EADDR}</div>
<p>Không ai <em>LISTEN</em> ở 41810, nhưng một kết nối <strong>đi ra</strong> của chương trình khác trên cùng máy đã được cấp 41810 làm cổng cục bộ tạm thời. Linux cấp các cổng "tạm" (ephemeral) này trong khoảng 32768–60999 (Windows và macOS: 49152–65535), nên cổng dev nằm trong khoảng đó thỉnh thoảng bị chiếm. Cách sửa: chọn cổng khác trong <code>.env</code> (chúng tôi dùng <code>PORT=41815</code> và checkpoint đạt 17/17), hoặc trên máy riêng của bạn ưu tiên cổng dưới 32768 như 4000 và 5173. Bài học lớn hơn: <strong>đừng bao giờ bỏ qua tham số lỗi</strong> — callback in "OK" mà không kiểm là lời nói dối chương trình nói với bạn.</p>

${spring(false, 'Với Spring Boot, khung backend lấy từ Spring Initializr (Maven/Gradle thay npm, application.properties/yaml thay .env, profile cho từng môi trường). Repo vẫn có thể là một monorepo với apps/api (Spring) và apps/web (React).', [
  ['sb-0-1-cai-dat', 'Spring Boot 0.1 — Cài JDK và tạo dự án bằng Spring Initializr'],
  ['sb-0-2-cau-truc-du-an', 'Spring Boot 0.2 — Giải phẫu một dự án Spring Boot'],
  ['sb-3-7-profile-config', 'Spring Boot 3.7 — Profile và cấu hình có kiểu'],
])}

<h3>🎤 Góc phỏng vấn</h3>
<ol>
<li><strong>"Sao phải commit package-lock.json?"</strong> — Nó ghim đúng phiên bản của mọi gói, trực tiếp lẫn gián tiếp, để mọi máy và CI cài ra cùng một cây (<code>npm ci</code>).</li>
<li><strong>"Lỡ đẩy bí mật lên GitHub. Bạn làm gì?"</strong> — Xoay vòng nó ngay, rồi xoá khỏi lịch sử nếu cần, kiểm nhật ký truy cập; chỉ xoá tệp thì không có tác dụng gì.</li>
<li><strong>"Peer dependency là gì?"</strong> — Một gói nói "tôi chạy với bản X của bạn trong khoảng phiên bản này", vd plugin TypeScript với TypeScript. Xung đột nghĩa là không tương thích thật.</li>
<li><strong>"Lint, kiểm kiểu, định dạng khác nhau thế nào?"</strong> — Mẫu mã đáng ngờ; sai kiểu; khoảng trắng và kiểu viết. Ba câu hỏi khác nhau, đều tự động.</li>
<li><strong>"Báo EADDRINUSE mà không ai LISTEN cổng đó — sao vậy?"</strong> — Cổng đang là đầu cục bộ của một kết nối đi ra (khoảng cổng tạm). Kiểm <code>ss -tanp</code>, không chỉ <code>ss -ltnp</code>; chọn cổng ngoài khoảng đó.</li>
</ol>

<h3>🧪 Lab 1.3 (60 phút) — tự dựng bộ khung</h3>
<div class="callout ok">
<ol>
<li>Tạo <code>package.json</code> gốc có workspaces; sinh <code>apps/web</code> bằng <code>npm create vite@latest web -- --template react-ts</code>; tạo <code>apps/api</code> như trên.</li>
<li>Thêm <code>.gitignore</code>, <code>.editorconfig</code>, <code>.nvmrc</code>, Prettier, oxlint ở gốc; <code>.env.example</code> ở cả hai ứng dụng; đặt Vite cổng 41811 kèm <code>strictPort</code>.</li>
<li>Chứng minh từng công cụ chạy bằng cách làm hỏng một lần: một <code>debugger</code> (lint hỏng), một lỗi kiểu (typecheck hỏng), thiếu <code>.env</code> (API thoát với thông báo của bạn). Hoàn tác từng cái.</li>
<li><code>npm run dev</code> → <code>curl localhost:41810/api</code> trả JSON và <code>localhost:41811</code> trả 200.</li>
<li>Commit trên nhánh <code>ch1/ke-hoach</code>: <code>chore: dựng khung repo, TypeScript, oxlint, Prettier</code>.</li>
</ol>
<p><strong>Thang chấm (10 điểm):</strong> workspaces + lockfile đã commit (2) · <code>npm run check</code> đạt (2) · mỗi công cụ được chứng minh hỏng đúng khi có lỗi cài sẵn (3) · không có <code>.env</code> trong Git, có đủ hai <code>.env.example</code> (2) · chạy dev một lệnh được (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Mọi tệp đã hiện ở trên đúng như trong repo ChiaSe (tag <code>ch1</code>). Nếu <code>git status --short --ignored</code> không liệt kê <code>apps/api/.env</code> với <code>!!</code>, luật ignore của bạn sai. Nếu Vite chạy ở cổng khác, bạn quên <code>strictPort</code>. Nếu <code>npm run lint</code> in cảnh báo mà <code>echo $?</code> ra 0, thêm <code>--deny-warnings</code>.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">monorepo</span><span class="v">Một repo chứa nhiều ứng dụng/gói.</span></div>
  <div class="kv"><span class="k">npm workspaces</span><span class="v">Tính năng npm cài và chạy script cho nhiều gói từ một thư mục gốc.</span></div>
  <div class="kv"><span class="k">peer dependency</span><span class="v">"Tôi cần bản X của bạn trong khoảng này" — vd plugin TS cần TS.</span></div>
  <div class="kv"><span class="k">linter</span><span class="v">Công cụ chỉ ra mã đáng ngờ (oxlint, ESLint).</span></div>
  <div class="kv"><span class="k">.env.example</span><span class="v">Danh sách biến bắt buộc được commit, kèm giá trị mẫu an toàn.</span></div>
  <div class="kv"><span class="k">secret rotation</span><span class="v">Xoay vòng bí mật: thay bí mật bị lộ bằng cái mới và thu hồi cái cũ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một repo, hai ứng dụng, npm workspaces, một lockfile, một <code>npm run dev</code> qua concurrently.</li>
<li>Trình sinh mã thay đổi: create-vite 9.3.4 cho oxlint + TS 7; xung đột peer là thông tin, không phải chướng ngại để --force vượt qua.</li>
<li>Cấu hình đọc một lần lúc khởi động; thiếu biến là hỏng ngay.</li>
<li>Bí mật: .env bị ignore, .env.example được commit, VITE_ là công khai; Uber 2016 cho thấy "repo riêng tư" không phải két sắt.</li>
<li>Lint (có --deny-warnings), kiểm kiểu và Prettier — mỗi cái được chứng minh bằng một lần làm hỏng.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
