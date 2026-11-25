/**
 * 2.4 — Checkpoint 2 (soạn 24/11/2026, agent fsp).
 * Output THẬT của scripts/checkpoint-2.mjs (Node 22.22.2, Prisma 7.10.1, PostgreSQL 18.7) trong ba tình huống: chưa commit (14/15),
 * đã commit (15/15), clone sạch + npm ci (282 gói, postinstall sinh client không cần .env) + Postgres MỚI (13/15 → db:migrate → 15/15).
 * Prisma Studio 7.10.1 chạy thật cổng 41816 (HTTP 200). Repo scratchpad/fsp/chiase, tag ch2 = merge 36c6a1a.
 */
import { lienKet, spring } from '../_chung.mjs';

const SCRIPT = `// Checkpoint 2 — tự chấm: CSDL + migration + Prisma + API có /api/health thật.
// Cần: Postgres đang chạy (bài 2.2) và apps/api/.env có DATABASE_URL.
// Chạy ở thư mục gốc repo (Windows, macOS, Linux):  node scripts/checkpoint-2.mjs
import { execSync, spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
let dat = 0;
let truot = 0;
const kiem = (moTa, dung) =&gt; {
  console.log(\`  \${dung ? '✔' : '✘'} \${moTa}\`);
  dung ? dat++ : truot++;
};
const chay = (lenh, cwd = '.') =&gt; {
  try {
    return { ok: true, ra: execSync(lenh, { cwd, encoding: 'utf8', stdio: 'pipe' }) };
  } catch (e) {
    return { ok: false, ra: \`\${e.stdout ?? ''}\${e.stderr ?? ''}\` };
  }
};
const ngu = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));
const API = 'apps/api';

console.log('== 0. Checkpoint 1 vẫn đạt (không làm hỏng cái cũ)');
const cp1 = spawnSync(process.execPath, ['scripts/checkpoint-1.mjs'], { encoding: 'utf8' });
const dongKq = cp1.stdout.trim().split('\\n').at(-1);
kiem(\`checkpoint-1: \${dongKq}\`, cp1.status === 0);

console.log('== 1. Prisma ghim đúng phiên bản');
const ls = JSON.parse(
  chay('npm ls prisma @prisma/client @prisma/adapter-pg --json --depth=0 -w apps/api').ra || '{}',
);
const goi = ls.dependencies?.api?.dependencies ?? {};
const ban = ['prisma', '@prisma/client', '@prisma/adapter-pg'].map((g) =&gt; goi[g]?.version ?? 'thiếu');
kiem(\`prisma / client / adapter-pg = \${ban.join(' / ')}\`, new Set(ban).size === 1 &amp;&amp; !ban[0].includes('rc'));
const pkgApi = JSON.parse(readFileSync(\`\${API}/package.json\`, 'utf8'));
kiem('apps/api có script postinstall "prisma generate"', pkgApi.scripts?.postinstall === 'prisma generate');

console.log('== 2. Migration nằm trong git, mã sinh ra thì không');
const mig = existsSync(\`\${API}/prisma/migrations\`)
  ? readdirSync(\`\${API}/prisma/migrations\`).filter((t) =&gt; /^\\d{14}_/.test(t))
  : [];
kiem(\`\${mig.length} migration: \${mig.join(', ')}\`, mig.length &gt;= 1);
const trongGit = chay('git ls-files apps/api/prisma').ra;
kiem(
  'migration + migration_lock.toml đã commit',
  mig.every((m) =&gt; trongGit.includes(m)) &amp;&amp; trongGit.includes('migration_lock.toml'),
);
kiem('src/generated KHÔNG nằm trong git', chay('git ls-files apps/api/src/generated').ra.trim() === '');
kiem('.env.example có DATABASE_URL', readFileSync(\`\${API}/.env.example\`, 'utf8').includes('DATABASE_URL='));

console.log('== 3. CSDL khớp migration');
if (!existsSync(\`\${API}/.env\`)) {
  kiem('thiếu apps/api/.env — chép từ .env.example rồi sửa DATABASE_URL', false);
} else {
  const st = chay('npx prisma migrate status', API);
  const lyDo = st.ra
    .split('\\n')
    .filter((l) =&gt; /not yet been applied|^\\d{14}_|Error|P1\\d{3}|reach/.test(l))
    .join(' ');
  kiem(
    st.ok
      ? 'prisma migrate status: Database schema is up to date!'
      : \`CSDL chưa khớp: \${lyDo || st.ra.trim()} ⇒ chạy: npm run db:migrate -w apps/api\`,
    st.ok &amp;&amp; st.ra.includes('up to date'),
  );
  const s1 = chay('npx prisma db seed', API);
  const s2 = chay('npx prisma db seed', API);
  kiem('seed chạy 2 lần liền không lỗi (upsert)', s1.ok &amp;&amp; s2.ok);
}

console.log('== 4. Chất lượng mã');
for (const s of ['lint', 'typecheck', 'format:check']) kiem(\`npm run \${s}\`, chay(\`npm run \${s}\`).ok);

console.log('== 5. API sống và dùng được');
const cong = readFileSync(\`\${API}/.env\`, 'utf8').match(/^PORT=(\\d+)/m)?.[1] ?? '41810';
const laWin = process.platform === 'win32';
const api = spawn('npm', ['run', 'dev', '-w', API], { shell: laWin, detached: !laWin, stdio: 'ignore' });
const lay = async (duong) =&gt; {
  try {
    const r = await fetch(\`http://localhost:\${cong}\${duong}\`, { signal: AbortSignal.timeout(5000) });
    return { ma: r.status, h: r.headers, json: await r.json().catch(() =&gt; null) };
  } catch {
    return { ma: 0, h: new Headers(), json: null };
  }
};
let h = { ma: 0 };
for (let i = 0; i &lt; 40 &amp;&amp; h.ma === 0; i++) {
  await ngu(1000);
  h = await lay('/api/health');
}
kiem(\`GET /api/health → \${h.ma} \${JSON.stringify(h.json)}\`, h.ma === 200 &amp;&amp; h.json?.db === 'ok');
kiem('không có header X-Powered-By', h.ma !== 0 &amp;&amp; !h.h.has('x-powered-by'));
const nf = await lay('/api/khong-co-route-nay');
kiem(
  \`route lạ → \${nf.ma} JSON (\${nf.json?.error?.code})\`,
  nf.ma === 404 &amp;&amp; nf.json?.error?.code === 'KHONG_CO_ROUTE',
);
if (laWin) chay(\`taskkill /pid \${api.pid} /T /F\`);
else
  try {
    process.kill(-api.pid, 'SIGTERM');
  } catch {}

console.log(\`\\nKẾT QUẢ: \${dat} đạt, \${truot} trượt\`);
process.exit(truot === 0 ? 0 : 1);`;

const OUT_TRUOC = `$ node scripts/checkpoint-2.mjs      # TRƯỚC khi commit
== 0. Checkpoint 1 vẫn đạt (không làm hỏng cái cũ)
  ✔ checkpoint-1: KẾT QUẢ: 17 đạt, 0 trượt
== 1. Prisma ghim đúng phiên bản
  ✔ prisma / client / adapter-pg = 7.10.1 / 7.10.1 / 7.10.1
  ✔ apps/api có script postinstall "prisma generate"
== 2. Migration nằm trong git, mã sinh ra thì không
  ✔ 2 migration: 20261124120000_init_users, 20261124120015_users_db_defaults
  ✘ migration + migration_lock.toml đã commit
  ✔ src/generated KHÔNG nằm trong git
  ✔ .env.example có DATABASE_URL
== 3. CSDL khớp migration
  ✔ prisma migrate status: Database schema is up to date!
  ✔ seed chạy 2 lần liền không lỗi (upsert)
== 4. Chất lượng mã
  ✔ npm run lint
  ✔ npm run typecheck
  ✔ npm run format:check
== 5. API sống và dùng được
  ✔ GET /api/health → 200 {"status":"ok","db":"ok","dbMs":131,"uptimeS":1}
  ✔ không có header X-Powered-By
  ✔ route lạ → 404 JSON (KHONG_CO_ROUTE)

KẾT QUẢ: 14 đạt, 1 trượt`;

const OUT_SAU = `$ node scripts/checkpoint-2.mjs      # SAU khi commit
  ✔ npm run lint
  ✔ npm run typecheck
  ✔ npm run format:check
== 5. API sống và dùng được
  ✔ GET /api/health → 200 {"status":"ok","db":"ok","dbMs":116,"uptimeS":2}
  ✔ không có header X-Powered-By
  ✔ route lạ → 404 JSON (KHONG_CO_ROUTE)

KẾT QUẢ: 15 đạt, 0 trượt`;

const OUT_NPM_CI = `$ git clone … &amp;&amp; cd chiase &amp;&amp; npm ci
added 282 packages, and audited 285 packages in 8s
found 0 vulnerabilities`;

const OUT_MAY_SACH = `$ node scripts/checkpoint-2.mjs      # clone sạch + Postgres mới tinh
  ✔ checkpoint-1: KẾT QUẢ: 17 đạt, 0 trượt
== 3. CSDL khớp migration
  ✘ CSDL chưa khớp: Following migrations have not yet been applied: 20261124120000_init_users 20261124120015_users_db_defaults ⇒ chạy: npm run db:migrate -w apps/api
  ✘ seed chạy 2 lần liền không lỗi (upsert)
KẾT QUẢ: 13 đạt, 2 trượt
$ npm run db:migrate -w apps/api
Applying migration \`20261124120000_init_users\`
Applying migration \`20261124120015_users_db_defaults\`
Your database is now in sync with your schema.
$ node scripts/checkpoint-2.mjs
KẾT QUẢ: 15 đạt, 0 trượt`;

const OUT_STUDIO = `$ npm run db:studio -w apps/api

&gt; api@0.0.0 db:studio
&gt; prisma studio --port 41816 --browser none

Loaded Prisma config from prisma.config.ts.

Prisma Studio is running at: http://localhost:41816
$ curl -s -o /dev/null -w "studio: %{http_code}\\n" localhost:41816/
studio: 200`;

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-moc-7', title: 'Node.js — Mốc dự án 7: Cơ sở dữ liệu thật', sub: 'Cùng chặng đường ở khoá Node.js: schema, migration, một repository.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-0-3-nam-phut', title: 'Prisma ORM 0.3 — Năm phút đầu tiên của bạn', sub: 'Prisma Studio và vòng sửa schema → migrate → generate, chậm rãi hơn.', cta: 'Mở bài →' }),
].join('\n');

const BANG_LOI = [
  ['✘ prisma / client / adapter-pg = 8.0.0-rc… / 7.10.1 / …', 'Installed without a version', 'Cài không ghi phiên bản', 'npm i -D -w apps/api --save-exact prisma@7.10.1 (và hai gói kia cùng bản)'],
  ['✘ CSDL chưa khớp: … not yet been applied', 'New database, or a teammate added a migration', 'CSDL mới, hoặc đồng đội vừa thêm migration', 'npm run db:migrate -w apps/api'],
  ['✘ CSDL chưa khớp: P1001 Can\'t reach database server', 'Container stopped / wrong port in DATABASE_URL', 'Container đã dừng / sai cổng trong DATABASE_URL', 'docker start chiase-pg; kiểm cổng 41812'],
  ['✘ migration + migration_lock.toml đã commit', 'Forgot git add on prisma/', 'Quên git add thư mục prisma/', 'git add apps/api/prisma &amp;&amp; git commit'],
  ['✘ src/generated KHÔNG nằm trong git', 'Committed generated client', 'Lỡ commit client sinh ra', 'git rm -r --cached apps/api/src/generated + thêm vào .gitignore'],
  ['✘ GET /api/health → 503', 'API up, database not reachable from API', 'API chạy nhưng không tới được CSDL', 'Đọc dòng [health] CSDL lỗi: … trong log API'],
  ['✘ GET /api/health → 0', 'API did not start (EADDRINUSE, missing variable)', 'API không khởi động (EADDRINUSE, thiếu biến)', 'npm run dev -w apps/api và đọc dòng lỗi đầu tiên'],
];
const bang = (en) => `<table><thead><tr><th>${en ? 'Line you see' : 'Dòng bạn thấy'}</th><th>${en ? 'Usual cause' : 'Nguyên nhân thường gặp'}</th><th>${en ? 'Fix' : 'Cách sửa'}</th></tr></thead><tbody>` +
  BANG_LOI.map(([d, ce, cv, s]) => `<tr><td><code>${d}</code></td><td>${en ? ce : cv}</td><td><code>${s}</code></td></tr>`).join('') + '</tbody></table>';

const DONG = `git add -A
git commit -m "feat(api): Prisma + PostgreSQL, model User, /api/health, Checkpoint 2"
node scripts/checkpoint-2.mjs            # phải là 15 đạt, 0 trượt
git switch main
git merge --no-ff ch2/nen-backend -m "Merge ch2/nen-backend: Checkpoint 2 đạt 15/15"
git tag ch2
git push origin main --tags              # nếu repo của bạn có remote`;

export default {
  title: '2.4 — Checkpoint 2: migration applies, /health returns 200|||2.4 — Checkpoint 2: migration chạy được, /health trả 200',
  slug: 'fp-2-4-checkpoint-2',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Script checkpoint-2.mjs tự chấm 15 tiêu chí: Checkpoint 1 vẫn đạt, Prisma ghim đúng bản, migration trong git còn client sinh ra thì không, CSDL khớp migration, seed chạy hai lần, lint/kiểu/định dạng, /api/health 200 kèm db ok, không X-Powered-By, 404 JSON. Ba lần chạy thật: chưa commit (14/15), đã commit (15/15), clone sạch + CSDL mới (13/15 → db:migrate → 15/15). Prisma Studio để nhìn bảng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Checkpoint</span>
<h2>Fifteen checks that prove the backend foundation is done — on your machine and on a machine that has never seen it</h2>
<p class="lead">Chapter 2 is finished when a script, not a feeling, says so. <code>scripts/checkpoint-2.mjs</code> re-runs Checkpoint 1 (so nothing old broke), then checks Prisma, migrations, the database, code quality and the live API. Below: the script, three real runs, Prisma Studio, and a table of the failures you are most likely to see.</p>

<h3>Everyday picture: the building inspection</h3>
<p>Before people move into a new floor, the inspector does not ask the builders whether they are confident. He checks the list: wiring, exits, water pressure — and he re-checks the floor below, because new work can crack old work. That is why check 0 runs Checkpoint 1 again.</p>

<h3>What Checkpoint 2 checks, and why</h3>
<table>
<thead><tr><th>#</th><th>Check</th><th>Why it matters</th></tr></thead>
<tbody>
<tr><td>0</td><td>Checkpoint 1 still passes</td><td>Regression: Chapter 2 must not break lint, env files or one-command dev</td></tr>
<tr><td>1</td><td>prisma = @prisma/client = adapter-pg, not a release candidate; postinstall present</td><td>The dist-tag trap of 2.2; teammates and CI get a client automatically</td></tr>
<tr><td>2</td><td>Migrations committed, generated client not; DATABASE_URL in .env.example</td><td>Source of truth in Git, build output out of it</td></tr>
<tr><td>3</td><td><code>migrate status</code> up to date; seed twice</td><td>Your DB matches the history; seed is idempotent</td></tr>
<tr><td>4</td><td>lint, typecheck, format</td><td>Same bar as Chapter 1</td></tr>
<tr><td>5</td><td>/api/health 200 with <code>db: ok</code>; no X-Powered-By; unknown route 404 JSON</td><td>The API is alive <em>and</em> able, and errors keep the contract</td></tr>
</tbody>
</table>

<h3>The script</h3>
<pre><code class="language-js">${SCRIPT}</code></pre>
<p>New techniques compared with Checkpoint 1: <code>spawnSync</code> to run another Node script and read its last line; <code>npm ls --json</code> to read installed versions without parsing text; filtering Prisma's output for the lines that explain <em>why</em> (the first version printed "Prisma schema loaded from …", which explains nothing — see run 3); <code>r.headers.has('x-powered-by')</code> to check a header is absent.</p>

<h3>Real runs</h3>
<p><strong>Run 1 — everything works, nothing committed yet:</strong></p>
<div class="out">${OUT_TRUOC}</div>
<p>One red line, and it is the right one: the migrations exist on disk but not in Git, so a teammate who pulls would have code that expects a <code>users</code> table and no way to create it.</p>
<p><strong>Run 2 — after committing:</strong></p>
<div class="out">${OUT_SAU}</div>
<p><strong>Run 3 — a clean clone on a brand-new database</strong> (a second Postgres container on another port, simulating a teammate's laptop or a CI runner):</p>
<div class="out">${OUT_NPM_CI}</div>
<div class="out">${OUT_MAY_SACH}</div>
<p><code>npm ci</code> regenerated the Prisma Client through <code>postinstall</code> without any <code>.env</code> (the config fix of 2.2 paying off). The empty database fails check 3 with the exact migrations missing and the command to run; after <code>db:migrate</code>, 15/15. This is the workflow every teammate follows after <code>git pull</code> when someone added a migration.</p>

<h3>Look at your data: Prisma Studio</h3>
<div class="out">${OUT_STUDIO}</div>
<p>Open <code>http://localhost:41816</code>: a table view of <code>User</code> with the two seed rows. You can edit cells — handy for testing a screen, dangerous habit on shared data. Notice that Studio shows <code>passwordHash</code>: global omit is a rule of <em>your client</em>, not of the database. We bound Studio to a fixed port (<code>--port 41816</code>) and told it not to open a browser (<code>--browser none</code>), so it also works over SSH or in a container. Stop it with Ctrl+C when done — it holds a database connection.</p>

<h3>When a line is red</h3>
${bang(true)}

<h3>Close the chapter</h3>
<pre><code class="language-bash">${DONG}</code></pre>
<p>Then stop what you no longer need: <code>docker stop chiase-pg</code> (the named volume keeps your data for Chapter 3), Ctrl+C on Studio and dev servers.</p>

${spring(true, 'In the Spring Boot course the matching milestone is a Flyway-managed schema with JPA entities; its "checkpoint" is a test run (./mvnw verify) plus /actuator/health returning UP. Same idea: a command, not a feeling.', [
  ['sb-moc-7', 'Spring Boot — Project milestone 7: real data with JPA entities'],
  ['sb-moc-9', 'Spring Boot — Project milestone 9: schema with history, Flyway migrations'],
  ['sb-moc-16', 'Spring Boot — Project milestone 16: health, metrics and logs'],
])}

<h3>🎤 Interview corner</h3>
<ol>
<li><strong>"A teammate pulls your branch and the app crashes with 'relation users does not exist'. What happened and what is the fix?"</strong> — Their database has not run the new migration; they run <code>migrate dev</code> (dev) — and the team documents it, or CI catches it with <code>migrate status</code>.</li>
<li><strong>"How do you prove a project works on a machine other than yours?"</strong> — Fresh clone, <code>npm ci</code>, fresh database, scripted checks. Exactly what CI will do in Chapter 10.</li>
<li><strong>"Why re-run old checks?"</strong> — Regression: new work breaks old guarantees more often than it fails on its own.</li>
<li><strong>"Is it OK to edit data in Prisma Studio / a DB GUI?"</strong> — On your dev database yes; on shared or production data only through reviewed scripts or the application, with an audit trail.</li>
</ol>

<h3>🧪 Lab — Checkpoint 2 (60 min)</h3>
<div class="callout ok">
<ol>
<li>Copy the script into <code>scripts/checkpoint-2.mjs</code> (or write your own with the same checks). Run it before committing; you should see exactly the migration line red.</li>
<li>Commit, run again: 15/15.</li>
<li>Clean-clone test: <code>git clone</code> into a new folder, start a second Postgres on another port (<code>-p 127.0.0.1:41819:5432</code>), point that clone's <code>.env</code> to it, <code>npm ci</code>, run the checkpoint, read the red lines, fix with one command, run again. Remove the second container afterwards.</li>
<li>Open Prisma Studio; find the two seed users; close it.</li>
<li>Merge to <code>main</code> and tag <code>ch2</code>.</li>
</ol>
<p><strong>Done when:</strong> <code>KẾT QUẢ: 15 đạt, 0 trượt</code> in both the original folder and the clean clone, and <code>git tag</code> lists <code>ch2</code>.</p>
<p><strong>Rubric (10 pts):</strong> 15/15 in your repo (4) · clean-clone run with its failing lines and fix written down (3) · Studio opened, port and browser flags explained (1) · merged and tagged (2).</p>
</div>
<details><summary>Solution</summary>
<p>The script above is the file in the ChiaSe repo, tag <code>ch2</code>. On Windows, run it from PowerShell or Git Bash at the repo root; the script uses <code>shell: true</code> and <code>taskkill</code> there. If check 0 fails only in the clean clone, it is usually Checkpoint 1's port: the clone's <code>.env</code> must use a free <code>PORT</code> (we used 41817 for the clone while the original used 41815).</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">regression</span><span class="v">Something that used to work and broke after a change.</span></div>
  <div class="kv"><span class="k">clean clone</span><span class="v">Fresh git clone + npm ci — no files that exist only on your machine.</span></div>
  <div class="kv"><span class="k">migrate status</span><span class="v">Compares the migrations folder with the database's _prisma_migrations table.</span></div>
  <div class="kv"><span class="k">Prisma Studio</span><span class="v">Local web GUI to browse and edit the database through your schema.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Checkpoint 2 = Checkpoint 1 again + Prisma versions + migrations in Git + DB in sync + quality + live health.</li>
<li>Three real runs: 14/15 uncommitted, 15/15 committed, 13/15 → one command → 15/15 on a clean clone with a new DB.</li>
<li>A good check prints the reason and the fix, not just ✘.</li>
<li>Prisma Studio shows raw data (including omitted fields); keep it local.</li>
</ul>
${THE}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Checkpoint</span>
<h2>Mười lăm phép kiểm chứng minh nền backend đã xong — trên máy bạn và trên một máy chưa từng thấy nó</h2>
<p class="lead">Chương 2 chỉ xong khi một script, không phải cảm giác, nói vậy. <code>scripts/checkpoint-2.mjs</code> chạy lại Checkpoint 1 (để chắc không có gì cũ bị hỏng), rồi kiểm Prisma, migration, CSDL, chất lượng mã và API đang chạy. Bên dưới: script, ba lần chạy thật, Prisma Studio, và bảng những lỗi bạn dễ gặp nhất.</p>

<h3>Liên tưởng đời thường: nghiệm thu công trình</h3>
<p>Trước khi người ta dọn vào tầng mới, người nghiệm thu không hỏi thợ có tự tin không. Ông ấy kiểm theo danh sách: điện, lối thoát hiểm, áp lực nước — và kiểm lại cả tầng dưới, vì việc mới có thể làm nứt việc cũ. Đó là lý do phép kiểm số 0 chạy lại Checkpoint 1.</p>

<h3>Checkpoint 2 kiểm gì, và vì sao</h3>
<table>
<thead><tr><th>#</th><th>Kiểm</th><th>Vì sao quan trọng</th></tr></thead>
<tbody>
<tr><td>0</td><td>Checkpoint 1 vẫn đạt</td><td>Hồi quy: Chương 2 không được làm hỏng lint, tệp môi trường hay lệnh dev một phát</td></tr>
<tr><td>1</td><td>prisma = @prisma/client = adapter-pg, không phải bản thử nghiệm; có postinstall</td><td>Bẫy dist-tag ở 2.2; đồng đội và CI tự có client</td></tr>
<tr><td>2</td><td>Migration đã commit, client sinh ra thì không; .env.example có DATABASE_URL</td><td>Nguồn sự thật trong Git, sản phẩm build ở ngoài</td></tr>
<tr><td>3</td><td><code>migrate status</code> khớp; seed hai lần</td><td>CSDL của bạn khớp lịch sử; seed idempotent</td></tr>
<tr><td>4</td><td>lint, kiểm kiểu, định dạng</td><td>Cùng chuẩn với Chương 1</td></tr>
<tr><td>5</td><td>/api/health 200 với <code>db: ok</code>; không X-Powered-By; route lạ 404 JSON</td><td>API còn sống <em>và</em> làm được việc, lỗi vẫn giữ đúng hợp đồng</td></tr>
</tbody>
</table>

<h3>Script</h3>
<pre><code class="language-js">${SCRIPT}</code></pre>
<p>Kỹ thuật mới so với Checkpoint 1: <code>spawnSync</code> để chạy một script Node khác và đọc dòng cuối của nó; <code>npm ls --json</code> để đọc phiên bản đã cài mà không phải bóc chữ; lọc output của Prisma lấy đúng những dòng giải thích <em>vì sao</em> (bản đầu in "Prisma schema loaded from …", chẳng giải thích gì — xem lần chạy 3); <code>r.headers.has('x-powered-by')</code> để kiểm một header vắng mặt.</p>

<h3>Chạy thật</h3>
<p><strong>Lần 1 — mọi thứ chạy, chưa commit gì:</strong></p>
<div class="out">${OUT_TRUOC}</div>
<p>Một dòng đỏ, và đúng là dòng cần đỏ: migration có trên đĩa nhưng chưa vào Git, nên đồng đội pull về sẽ có mã đòi bảng <code>users</code> mà không có cách nào tạo ra nó.</p>
<p><strong>Lần 2 — sau khi commit:</strong></p>
<div class="out">${OUT_SAU}</div>
<p><strong>Lần 3 — clone sạch trên một CSDL mới tinh</strong> (container Postgres thứ hai ở cổng khác, giả làm laptop của đồng đội hay máy CI):</p>
<div class="out">${OUT_NPM_CI}</div>
<div class="out">${OUT_MAY_SACH}</div>
<p><code>npm ci</code> đã sinh lại Prisma Client qua <code>postinstall</code> mà không cần <code>.env</code> nào (cách sửa cấu hình ở 2.2 phát huy tác dụng). CSDL trống trượt phép kiểm 3, kèm đúng tên các migration còn thiếu và lệnh cần chạy; sau <code>db:migrate</code>, 15/15. Đây chính là quy trình mọi đồng đội làm sau <code>git pull</code> khi có người thêm migration.</p>

<h3>Nhìn dữ liệu của bạn: Prisma Studio</h3>
<div class="out">${OUT_STUDIO}</div>
<p>Mở <code>http://localhost:41816</code>: bảng <code>User</code> với hai dòng seed. Bạn sửa được từng ô — tiện để thử một màn hình, nhưng là thói quen nguy hiểm trên dữ liệu dùng chung. Để ý Studio vẫn hiện <code>passwordHash</code>: omit toàn cục là luật của <em>client của bạn</em>, không phải của CSDL. Chúng tôi cố định cổng (<code>--port 41816</code>) và bảo nó không tự mở trình duyệt (<code>--browser none</code>), để dùng được cả qua SSH hay trong container. Xong thì Ctrl+C — nó đang giữ một kết nối CSDL.</p>

<h3>Khi có dòng đỏ</h3>
${bang(false)}

<h3>Đóng chương</h3>
<pre><code class="language-bash">${DONG}</code></pre>
<p>Rồi tắt những gì không cần nữa: <code>docker stop chiase-pg</code> (volume có tên giữ dữ liệu cho Chương 3), Ctrl+C Studio và máy chủ dev.</p>

${spring(false, 'Ở khoá Spring Boot, mốc tương ứng là lược đồ do Flyway quản lý cùng entity JPA; "checkpoint" của nó là một lượt test (./mvnw verify) cộng /actuator/health trả UP. Cùng một ý: một lệnh, không phải một cảm giác.', [
  ['sb-moc-7', 'Spring Boot — Mốc dự án 7: Dữ liệu thật, entity JPA'],
  ['sb-moc-9', 'Spring Boot — Mốc dự án 9: Schema có lịch sử, migration với Flyway'],
  ['sb-moc-16', 'Spring Boot — Mốc dự án 16: health, số đo và log'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Đồng đội pull nhánh của bạn và ứng dụng sập với 'relation users does not exist'. Chuyện gì, sửa sao?"</strong> — CSDL của họ chưa chạy migration mới; họ chạy <code>migrate dev</code> (môi trường dev) — và đội ghi điều này vào tài liệu, hoặc CI bắt bằng <code>migrate status</code>.</li>
<li><strong>"Chứng minh dự án chạy trên máy khác máy bạn bằng cách nào?"</strong> — Clone mới, <code>npm ci</code>, CSDL mới, phép kiểm bằng script. Đúng điều CI sẽ làm ở Chương 10.</li>
<li><strong>"Vì sao chạy lại phép kiểm cũ?"</strong> — Hồi quy: việc mới làm hỏng bảo đảm cũ thường xuyên hơn là tự nó hỏng.</li>
<li><strong>"Sửa dữ liệu trong Prisma Studio / công cụ GUI của CSDL có được không?"</strong> — Trên CSDL dev của bạn thì được; với dữ liệu dùng chung hay production thì chỉ qua script đã review hoặc qua ứng dụng, có lưu vết.</li>
</ol>

<h3>🧪 Lab — Checkpoint 2 (60 phút)</h3>
<div class="callout ok">
<ol>
<li>Chép script vào <code>scripts/checkpoint-2.mjs</code> (hoặc tự viết với cùng các phép kiểm). Chạy trước khi commit; bạn phải thấy đúng dòng migration bị đỏ.</li>
<li>Commit, chạy lại: 15/15.</li>
<li>Thử clone sạch: <code>git clone</code> sang thư mục mới, chạy Postgres thứ hai ở cổng khác (<code>-p 127.0.0.1:41819:5432</code>), trỏ <code>.env</code> của bản clone vào nó, <code>npm ci</code>, chạy checkpoint, đọc các dòng đỏ, sửa bằng một lệnh, chạy lại. Xong thì xoá container thứ hai.</li>
<li>Mở Prisma Studio; tìm hai user seed; đóng lại.</li>
<li>Merge vào <code>main</code> và gắn tag <code>ch2</code>.</li>
</ol>
<p><strong>Xong khi:</strong> <code>KẾT QUẢ: 15 đạt, 0 trượt</code> ở cả thư mục gốc lẫn bản clone sạch, và <code>git tag</code> có <code>ch2</code>.</p>
<p><strong>Thang điểm (10):</strong> 15/15 trong repo của bạn (4) · chạy trên bản clone sạch, ghi lại các dòng trượt và cách sửa (3) · mở được Studio, giải thích cờ cổng và trình duyệt (1) · đã merge và gắn tag (2).</p>
</div>
<details><summary>Lời giải</summary>
<p>Script ở trên chính là tệp trong repo ChiaSe, tag <code>ch2</code>. Trên Windows, chạy bằng PowerShell hoặc Git Bash ở thư mục gốc repo; ở đó script dùng <code>shell: true</code> và <code>taskkill</code>. Nếu phép kiểm 0 chỉ trượt ở bản clone sạch, thường là do cổng của Checkpoint 1: <code>.env</code> của bản clone phải dùng một <code>PORT</code> còn trống (chúng tôi dùng 41817 cho bản clone, bản gốc dùng 41815).</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">regression</span><span class="v">Hồi quy: thứ từng chạy bị hỏng sau một thay đổi.</span></div>
  <div class="kv"><span class="k">clean clone</span><span class="v">Bản clone sạch: git clone mới + npm ci — không có tệp nào chỉ tồn tại trên máy bạn.</span></div>
  <div class="kv"><span class="k">migrate status</span><span class="v">So thư mục migrations với bảng _prisma_migrations trong CSDL.</span></div>
  <div class="kv"><span class="k">Prisma Studio</span><span class="v">Giao diện web cục bộ để xem và sửa CSDL theo schema của bạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Checkpoint 2 = Checkpoint 1 lần nữa + phiên bản Prisma + migration trong Git + CSDL khớp + chất lượng + health đang chạy.</li>
<li>Ba lần chạy thật: 14/15 khi chưa commit, 15/15 khi đã commit, 13/15 → một lệnh → 15/15 trên bản clone sạch với CSDL mới.</li>
<li>Phép kiểm tốt in ra lý do và cách sửa, không chỉ một dấu ✘.</li>
<li>Prisma Studio hiện dữ liệu thô (kể cả trường bị omit); chỉ dùng cục bộ.</li>
</ul>
${THE}
</div>
`,
};
