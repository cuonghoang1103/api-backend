/**
 * 1.4 — Checkpoint 1 (soạn 24/11/2026, agent fsp).
 * Output THẬT của scripts/checkpoint-1.mjs (Node 22.22.2) trong bốn tình huống: đã add chưa commit (/tmp/fsp-moi), lỡ git add -f .env,
 * một chương trình khác giữ cổng 41810 (socket Python LISTEN 0.0.0.0:41810), clone sạch + npm ci (135 gói). Repo: scratchpad/fsp/chiase, tag ch1.
 * Nội dung script (hằng SCRIPT) chèn nguyên văn từ chiase/scripts/checkpoint-1.mjs bằng python (thoát HTML rồi thoát template literal).
 */
import { lienKet, spring } from '../_chung.mjs';

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-moc-4', title: 'Node.js — Mốc dự án 4: Dự án ai clone về cũng chạy được', sub: 'Cùng tinh thần: kiểm trên bản clone sạch, không tin máy mình.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-3-5-http-server', title: 'Node.js 3.5 — Server HTTP không dùng framework', sub: 'Nếu muốn hiểu fetch/HTTP mà script checkpoint dùng ở mức thấp hơn.', cta: 'Mở bài →' }),
].join('\n');

const SCRIPT = `// Checkpoint 1 — tự chấm: repo chạy được và kế hoạch đã viết ra giấy.
// Chạy ở thư mục gốc repo (Windows, macOS, Linux):  node scripts/checkpoint-1.mjs
import { execSync, spawn } from 'node:child_process';
import { existsSync, readFileSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
let dat = 0;
let truot = 0;
const ok = (m) =&gt; {
  console.log(\`  ✔ \${m}\`);
  dat++;
};
const hong = (m) =&gt; {
  console.log(\`  ✘ \${m}\`);
  truot++;
};
const chay = (lenh) =&gt; {
  try {
    execSync(lenh, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
};
const kiem = (moTa, dung) =&gt; (dung ? ok(moTa) : hong(moTa));
const coChu = (tep, chu) =&gt; existsSync(tep) &amp;&amp; readFileSync(tep, 'utf8').includes(chu);
const ngu = (ms) =&gt; new Promise((r) =&gt; setTimeout(r, ms));

console.log('== 1. Môi trường');
const major = process.versions.node.split('.')[0];
kiem(major === '22' ? \`Node \${process.version}\` : \`Cần Node 22, đang là \${process.version}\`, major === '22');
kiem('có package-lock.json (cài được bằng npm ci)', existsSync('package-lock.json'));

console.log('== 2. Kế hoạch đã viết ra');
kiem('README có bảng user story', coChu('README.md', 'User story'));
kiem('README có Definition of Done', coChu('README.md', 'Definition of Done'));
kiem('README có bảng API dự kiến', coChu('README.md', '/api/posts'));
kiem('có docs/erd.md với erDiagram', coChu('docs/erd.md', 'erDiagram'));
kiem('có SQL nháp đã thử', coChu('docs/schema-nhap.sql', 'CREATE TABLE'));

console.log('== 3. Bí mật không vào git');
kiem('apps/api/.env.example được commit', chay('git ls-files --error-unmatch apps/api/.env.example'));
kiem('apps/web/.env.example được commit', chay('git ls-files --error-unmatch apps/web/.env.example'));
const tepEnv = execSync('git ls-files', { encoding: 'utf8' })
  .split('\\n')
  .filter((t) =&gt; /(^|\\/)\\.env(\\.local)?$/.test(t));
kiem(
  tepEnv.length
    ? \`CÓ tệp .env trong git (\${tepEnv.join(', ')}) — xoá khỏi index: git rm --cached &lt;tệp&gt;\`
    : 'không có .env nào trong git',
  tepEnv.length === 0,
);
kiem('.gitignore chặn .env', chay('git check-ignore -q apps/api/.env'));

console.log('== 4. Chất lượng mã');
kiem('npm run lint', chay('npm run lint'));
kiem('npm run typecheck', chay('npm run typecheck'));
kiem('npm run format:check', chay('npm run format:check'));

console.log('== 5. Chạy được');
if (!existsSync('apps/api/.env')) copyFileSync('apps/api/.env.example', 'apps/api/.env');
if (!existsSync('apps/web/.env.local')) copyFileSync('apps/web/.env.example', 'apps/web/.env.local');
const congApi = readFileSync('apps/api/.env', 'utf8').match(/^PORT=(\\d+)/m)?.[1] ?? '41810';
const laWin = process.platform === 'win32';
const dev = spawn('npm', ['run', 'dev'], { shell: laWin, detached: !laWin, stdio: 'ignore' });
const lay = async (url) =&gt; {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(2000) });
    return { ma: r.status, than: await r.text() };
  } catch {
    return { ma: 0, than: '' };
  }
};
let api = { ma: 0, than: '' };
let web = { ma: 0, than: '' };
for (let i = 0; i &lt; 60; i++) {
  [api, web] = await Promise.all([lay(\`http://localhost:\${congApi}/api\`), lay('http://localhost:41811/')]);
  if (api.ma === 200 &amp;&amp; web.ma === 200) break;
  await ngu(1000);
}
kiem(
  api.than.includes('"ten":"chiase-api"')
    ? \`API trả: \${api.than}\`
    : \`API cổng \${congApi} không trả JSON mong đợi — chạy "npm run dev" xem lỗi (EADDRINUSE? đổi PORT trong apps/api/.env)\`,
  api.than.includes('"ten":"chiase-api"'),
);
kiem(\`Web trả HTTP \${web.ma}\`, web.ma === 200);
if (laWin) chay(\`taskkill /pid \${dev.pid} /T /F\`);
else
  try {
    process.kill(-dev.pid, 'SIGTERM');
  } catch {}

console.log('== 6. Đã commit');
let soCommit = 0;
try {
  soCommit = Number(execSync('git rev-list --count HEAD', { encoding: 'utf8', stdio: 'pipe' }));
} catch {}
kiem(
  soCommit
    ? \`\${soCommit} commit, mới nhất: \${execSync('git log -1 --format="%h %s"', { encoding: 'utf8' }).trim()}\`
    : 'chưa có commit nào',
  soCommit &gt;= 1,
);

console.log(\`\\nKẾT QUẢ: \${dat} đạt, \${truot} trượt\`);
process.exit(truot === 0 ? 0 : 1);`;

const OUT_CHUA_COMMIT = `$ node scripts/checkpoint-1.mjs      # đã git add, CHƯA commit
== 1. Môi trường
  ✔ Node v22.22.2
  ✔ có package-lock.json (cài được bằng npm ci)
== 2. Kế hoạch đã viết ra
  ✔ README có bảng user story
  ✔ README có Definition of Done
  ✔ README có bảng API dự kiến
  ✔ có docs/erd.md với erDiagram
  ✔ có SQL nháp đã thử
== 3. Bí mật không vào git
  ✔ apps/api/.env.example được commit
  ✔ apps/web/.env.example được commit
  ✔ không có .env nào trong git
  ✔ .gitignore chặn .env
== 4. Chất lượng mã
  ✔ npm run lint
  ✔ npm run typecheck
  ✔ npm run format:check
== 5. Chạy được
  ✔ API trả: {"ten":"chiase-api","phienBan":"0.1.0"}
  ✔ Web trả HTTP 200
== 6. Đã commit
  ✘ chưa có commit nào

KẾT QUẢ: 16 đạt, 1 trượt`;

const OUT_ENV = `$ git add -f apps/api/.env          # cố tình làm sai
$ node scripts/checkpoint-1.mjs
…
== 3. Bí mật không vào git
  ✔ apps/api/.env.example được commit
  ✔ apps/web/.env.example được commit
  ✘ CÓ tệp .env trong git (apps/api/.env) — xoá khỏi index: git rm --cached &lt;tệp&gt;
  ✘ .gitignore chặn .env
…
KẾT QUẢ: 15 đạt, 2 trượt
$ git rm --cached apps/api/.env`;

const OUT_CONG = `$ node scripts/checkpoint-1.mjs      # một chương trình khác đang giữ cổng 41810
…
== 5. Chạy được
  ✘ API cổng 41810 không trả JSON mong đợi — chạy "npm run dev" xem lỗi (EADDRINUSE? đổi PORT trong apps/api/.env)
  ✔ Web trả HTTP 200
…
KẾT QUẢ: 16 đạt, 1 trượt`;

const OUT_SACH = `$ git clone &lt;repo&gt; chiase-sach &amp;&amp; cd chiase-sach
$ npm ci
added 135 packages, and audited 138 packages in 3s
found 0 vulnerabilities
$ node scripts/checkpoint-1.mjs
…
== 5. Chạy được
  ✔ API trả: {"ten":"chiase-api","phienBan":"0.1.0"}
  ✔ Web trả HTTP 200
== 6. Đã commit
  ✔ 4 commit, mới nhất: 2648198 chore: checkpoint 1 viết bằng Node để chạy được trên mọi hệ điều hành

KẾT QUẢ: 17 đạt, 0 trượt`;

const KHUNG = `// scripts/checkpoint-1.mjs — khung để bạn tự điền
import { execSync, spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

let dat = 0, truot = 0;
const kiem = (moTa, dung) =&gt; { console.log(\`  \${dung ? '✔' : '✘'} \${moTa}\`); dung ? dat++ : truot++; };
const chay = (lenh) =&gt; { try { execSync(lenh, { stdio: 'pipe' }); return true; } catch { return false; } };

console.log('== 1. Môi trường');
// TODO: Node 22? có package-lock.json?
console.log('== 2. Kế hoạch đã viết ra');
// TODO: README có user story, Definition of Done, bảng API; docs/erd.md có erDiagram
console.log('== 3. Bí mật không vào git');
// TODO: hai .env.example đã commit; KHÔNG có .env nào trong git ls-files; git check-ignore chặn .env
console.log('== 4. Chất lượng mã');
// TODO: npm run lint / typecheck / format:check
console.log('== 5. Chạy được');
// TODO: spawn "npm run dev", chờ tối đa 60 s, fetch /api và trang web, rồi tắt tiến trình
console.log('== 6. Đã commit');
// TODO: git rev-list --count HEAD &gt;= 1

console.log(\`\\nKẾT QUẢ: \${dat} đạt, \${truot} trượt\`);
process.exit(truot === 0 ? 0 : 1);`;

const CHOT = `git add -A
git commit -m "chore: checkpoint 1 tự chấm"
git switch main
git merge --no-ff ch1/ke-hoach -m "Merge chương 1: kế hoạch và khung repo"
git tag -a ch1 -m "Checkpoint 1: repo chạy được, kế hoạch đã viết"
git push origin main --follow-tags     # nếu đã có remote trên GitHub`;

export default {
  title: '1.4 — Checkpoint 1: the repo runs and the plan is written down|||1.4 — Checkpoint 1: repo chạy được và kế hoạch đã viết ra giấy',
  slug: 'fp-1-4-checkpoint-1',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tự viết script checkpoint bằng Node (chạy được trên Windows/macOS/Linux): 17 phép kiểm từ README tới npm run dev; output thật trong bốn tình huống — chưa commit, lỡ add .env, cổng bị chiếm, clone sạch + npm ci; rồi merge, gắn tag ch1.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Checkpoint</span>
<h2>Write the check that proves Chapter 1 is done — then make it pass on a clean clone</h2>
<p class="lead">Checkpoint 1 is not "I think it works". It is a script, <code>scripts/checkpoint-1.mjs</code>, that answers 17 yes/no questions about your repository and exits with code 0 only when all are yes. You write it yourself in this lesson. It is plain Node — no Bash — so it runs the same on Windows, macOS and Linux, and it keeps running in later chapters to make sure Chapter 1 never silently breaks.</p>

<h3>Everyday picture: a pilot's pre-flight checklist</h3>
<p>Experienced pilots still read the checklist aloud before take-off — not because they forgot how to fly, but because memory fails under routine. A checkpoint script is your pre-flight checklist: it checks the boring things (is <code>.env</code> out of Git? does a fresh clone install?) that experienced developers still get wrong.</p>

<h3>What Checkpoint 1 checks, and why</h3>
<table>
<thead><tr><th>Group</th><th>Checks</th><th>Why it matters</th></tr></thead>
<tbody>
<tr><td>1. Environment</td><td>Node 22; <code>package-lock.json</code> exists</td><td>Same versions everywhere; <code>npm ci</code> needs the lockfile</td></tr>
<tr><td>2. Plan written</td><td>README has user stories, Definition of Done, API table; <code>docs/erd.md</code>; SQL draft</td><td>Lessons 1.1–1.2 produced something durable</td></tr>
<tr><td>3. Secrets</td><td>both <code>.env.example</code> committed; <strong>no</strong> <code>.env</code> in Git; <code>.gitignore</code> blocks it</td><td>Uber 2016 started in a repository</td></tr>
<tr><td>4. Code quality</td><td>lint, typecheck, format:check</td><td>The three tools from 1.3 actually pass</td></tr>
<tr><td>5. It runs</td><td>start <code>npm run dev</code>, <code>/api</code> returns the JSON, the web returns 200, then stop</td><td>"Runs" is checked, not assumed</td></tr>
<tr><td>6. Committed</td><td>at least one commit</td><td>A checkpoint you cannot return to is not a checkpoint</td></tr>
</tbody>
</table>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Static checks</span><span class="lz-d">files, Git index, lint, typecheck, format — exit codes</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Start</span><span class="lz-d">spawn npm run dev in its own process group</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Probe</span><span class="lz-d">fetch /api and the web page, up to 60 s, 2 s timeout each</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Stop</span><span class="lz-d">kill the group (taskkill /T on Windows)</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Verdict</span><span class="lz-d">print ✔/✘, exit 0 only if 0 failed</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — checking only on your own machine.</strong> Your folder has files Git does not track (.env, build output, a global tool). Passing there proves little; pass on a clean clone.</p></div>
<h3>The techniques inside the script</h3>
<ul>
<li><code>execSync(cmd, { stdio: 'pipe' })</code> inside <code>try/catch</code>: a command "passes" when its exit code is 0 — the same rule CI uses.</li>
<li><code>git ls-files</code> lists what Git tracks; filtering it for <code>.env</code> catches a secret even if someone used <code>git add -f</code>.</li>
<li><code>spawn('npm', ['run', 'dev'], { detached: true })</code> starts the dev servers in their own process group, so <code>process.kill(-pid)</code> stops the whole group (API, Vite, watchers). Windows has no process groups: <code>taskkill /pid … /T /F</code> kills the tree.</li>
<li><code>fetch(url, { signal: AbortSignal.timeout(2000) })</code>: built into Node 22, with a timeout so a hung server does not hang the check. The loop waits up to 60 s — on a busy laptop the first start can be slow.</li>
<li>The port is read from <code>apps/api/.env</code>, so if you change <code>PORT</code> (Trap 3 in 1.3), the check follows.</li>
<li><code>process.exit(truot === 0 ? 0 : 1)</code>: the exit code is the real result; the ✔/✘ lines are for humans.</li>
</ul>
<p>Start from this skeleton and fill in each TODO:</p>
<pre><code class="language-js">${KHUNG}</code></pre>

<h3>Real runs: four situations</h3>
<p><strong>A. Everything staged, nothing committed yet</strong> — exactly one check fails, for the right reason:</p>
<div class="out">${OUT_CHUA_COMMIT}</div>
<p><strong>B. Someone force-added the secret file</strong> — two checks fail and the message tells you the fix:</p>
<div class="out">${OUT_ENV}</div>
<p><strong>C. Another program holds the API port</strong> — the check does not hang, it fails within 60 s and points at the likely cause:</p>
<div class="out">${OUT_CONG}</div>
<p><strong>D. The real test: a fresh clone</strong>, the way a teammate, a CI runner or an interviewer will meet your project:</p>
<div class="out">${OUT_SACH}</div>
<p>D is the one that counts. "Works on my machine" passes A–C while forgetting a file in <code>.gitignore</code> or a dependency installed globally; only a clean clone catches that.</p>

<h3>Close the chapter</h3>
<pre><code class="language-bash">${CHOT}</code></pre>

${spring(true, 'The Spring Boot course has the same "day 0" milestone: a skeleton that starts, in one Git repository, checked from a clean clone. With Maven the "npm ci" step becomes ./mvnw -q verify.', [
  ['sb-moc-1', 'Spring Boot — Project milestone 1: day 0, a skeleton that starts, in one Git repo'],
])}

<h3>🎤 Interview corner</h3>
<ol>
<li><strong>"How do you make sure your project runs on someone else's machine?"</strong> — Lockfile + <code>npm ci</code>, <code>.env.example</code>, pinned Node version, and an automated check run on a fresh clone (later: in CI and Docker).</li>
<li><strong>"Why does a script's exit code matter?"</strong> — CI, Git hooks and <code>&amp;&amp;</code> chains only see the exit code; printing "error" with exit 0 is a passing step.</li>
<li><strong>"What does npm ci do differently from npm install?"</strong> — Installs exactly what the lockfile says, deletes <code>node_modules</code> first, fails if <code>package.json</code> and the lockfile disagree.</li>
</ol>

<h3>🧪 Lab — Checkpoint 1 (60–90 min)</h3>
<div class="callout ok">
<ol>
<li>Write <code>scripts/checkpoint-1.mjs</code> from the skeleton. Run it until it prints <code>0 trượt</code>.</li>
<li>Prove it catches mistakes: reproduce situations A, B and C on purpose and save each output in <code>docs/nhat-ky.md</code>. Undo each.</li>
<li>Clone your repository into a new folder, <code>npm ci</code>, run the checkpoint there (situation D).</li>
<li>Merge, tag <code>ch1</code>, push if you have a GitHub remote.</li>
</ol>
<p><strong>Rubric (10 pts):</strong> 17 checks implemented, readable messages (3) · exit code 0/1 correct (1) · dev servers are always stopped afterwards — no orphan process on the ports (2) · A, B, C reproduced and recorded (2) · clean clone passes (2).</p>
</div>
<details><summary>Solution — the full script used for ChiaSe</summary>
<pre><code class="language-js">${SCRIPT}</code></pre>
<p>After it finishes, check with <code>ss -ltn | grep 4181</code> (Windows: <code>netstat -ano | findstr 4181</code>) that nothing is left listening.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">exit code</span><span class="v">The number a process returns: 0 = success, anything else = failure.</span></div>
  <div class="kv"><span class="k">npm ci</span><span class="v">Clean install exactly from the lockfile.</span></div>
  <div class="kv"><span class="k">process group</span><span class="v">A set of processes that can be signalled together (POSIX).</span></div>
  <div class="kv"><span class="k">clean clone</span><span class="v">A fresh copy of the repository with nothing from your machine.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Checkpoint 1 = 17 automated yes/no checks in plain Node; exit code 0 only when all pass.</li>
<li>Verified in four real situations: uncommitted, leaked .env, busy port, clean clone.</li>
<li>The clean clone is the test that matters; then merge and tag <code>ch1</code>.</li>
</ul>
${THE}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Checkpoint</span>
<h2>Tự viết phép kiểm chứng minh Chương 1 đã xong — rồi làm nó đạt trên một bản clone sạch</h2>
<p class="lead">Checkpoint 1 không phải "mình nghĩ là chạy rồi". Nó là một script, <code>scripts/checkpoint-1.mjs</code>, trả lời 17 câu hỏi có/không về repo của bạn và chỉ thoát với mã 0 khi tất cả là "có". Bạn tự viết nó trong bài này. Nó là Node thuần — không cần Bash — nên chạy giống nhau trên Windows, macOS và Linux, và vẫn chạy ở các chương sau để Chương 1 không bao giờ hỏng âm thầm.</p>

<h3>Liên tưởng đời thường: danh sách kiểm trước khi cất cánh của phi công</h3>
<p>Phi công lâu năm vẫn đọc to danh sách kiểm trước khi cất cánh — không phải vì quên cách lái, mà vì trí nhớ hay hụt trước những việc lặp đi lặp lại. Script checkpoint là danh sách kiểm của bạn: nó soát những thứ nhàm chán (<code>.env</code> có nằm ngoài Git không? bản clone mới có cài được không?) mà lập trình viên lâu năm vẫn làm sai.</p>

<h3>Checkpoint 1 kiểm gì, và vì sao</h3>
<table>
<thead><tr><th>Nhóm</th><th>Kiểm</th><th>Vì sao quan trọng</th></tr></thead>
<tbody>
<tr><td>1. Môi trường</td><td>Node 22; có <code>package-lock.json</code></td><td>Cùng phiên bản ở mọi nơi; <code>npm ci</code> cần lockfile</td></tr>
<tr><td>2. Kế hoạch đã viết</td><td>README có user story, Definition of Done, bảng API; <code>docs/erd.md</code>; SQL nháp</td><td>Bài 1.1–1.2 để lại thứ bền vững</td></tr>
<tr><td>3. Bí mật</td><td>hai <code>.env.example</code> đã commit; <strong>không</strong> có <code>.env</code> trong Git; <code>.gitignore</code> chặn nó</td><td>Vụ Uber 2016 bắt đầu từ một repo</td></tr>
<tr><td>4. Chất lượng mã</td><td>lint, typecheck, format:check</td><td>Ba công cụ ở 1.3 thật sự đạt</td></tr>
<tr><td>5. Chạy được</td><td>khởi động <code>npm run dev</code>, <code>/api</code> trả JSON, web trả 200, rồi tắt</td><td>"Chạy được" phải được kiểm, không được giả định</td></tr>
<tr><td>6. Đã commit</td><td>ít nhất một commit</td><td>Checkpoint không quay về được thì không phải checkpoint</td></tr>
</tbody>
</table>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Kiểm tĩnh</span><span class="lz-d">tệp, chỉ mục Git, lint, typecheck, định dạng — theo mã thoát</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Khởi động</span><span class="lz-d">spawn npm run dev trong nhóm tiến trình riêng</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Thăm dò</span><span class="lz-d">fetch /api và trang web, tối đa 60 giây, mỗi lần hạn 2 giây</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Tắt</span><span class="lz-d">giết cả nhóm (Windows: taskkill /T)</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Kết luận</span><span class="lz-d">in ✔/✘, chỉ thoát 0 khi 0 trượt</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chỉ kiểm trên máy mình.</strong> Thư mục của bạn có những tệp Git không theo dõi (.env, thư mục build, công cụ cài toàn cục). Đạt ở đó chẳng chứng minh được mấy; phải đạt trên bản clone sạch.</p></div>
<h3>Các kỹ thuật bên trong script</h3>
<ul>
<li><code>execSync(lenh, { stdio: 'pipe' })</code> trong <code>try/catch</code>: một lệnh "đạt" khi mã thoát là 0 — đúng luật mà CI dùng.</li>
<li><code>git ls-files</code> liệt kê những gì Git đang theo dõi; lọc tìm <code>.env</code> trong đó bắt được bí mật kể cả khi ai đó dùng <code>git add -f</code>.</li>
<li><code>spawn('npm', ['run', 'dev'], { detached: true })</code> chạy server dev trong nhóm tiến trình riêng, nên <code>process.kill(-pid)</code> tắt cả nhóm (API, Vite, trình theo dõi tệp). Windows không có nhóm tiến trình: <code>taskkill /pid … /T /F</code> giết cả cây.</li>
<li><code>fetch(url, { signal: AbortSignal.timeout(2000) })</code>: có sẵn trong Node 22, kèm thời hạn để server treo không làm phép kiểm treo theo. Vòng lặp chờ tối đa 60 giây — laptop đang bận thì lần khởi động đầu có thể chậm.</li>
<li>Cổng đọc từ <code>apps/api/.env</code>, nên khi bạn đổi <code>PORT</code> (Bẫy 3 ở bài 1.3), phép kiểm đi theo.</li>
<li><code>process.exit(truot === 0 ? 0 : 1)</code>: mã thoát mới là kết quả thật; các dòng ✔/✘ là để người đọc.</li>
</ul>
<p>Bắt đầu từ bộ khung này và điền từng TODO:</p>
<pre><code class="language-js">${KHUNG}</code></pre>

<h3>Chạy thật: bốn tình huống</h3>
<p><strong>A. Đã add hết, chưa commit gì</strong> — đúng một mục trượt, và trượt đúng lý do:</p>
<div class="out">${OUT_CHUA_COMMIT}</div>
<p><strong>B. Ai đó cố tình add tệp bí mật</strong> — hai mục trượt và thông báo chỉ luôn cách sửa:</p>
<div class="out">${OUT_ENV}</div>
<p><strong>C. Một chương trình khác giữ cổng API</strong> — phép kiểm không treo, nó trượt trong vòng 60 giây và chỉ ra nguyên nhân khả dĩ:</p>
<div class="out">${OUT_CONG}</div>
<p><strong>D. Phép thử thật: một bản clone sạch</strong>, đúng cách đồng đội, máy CI hay nhà tuyển dụng sẽ gặp dự án của bạn:</p>
<div class="out">${OUT_SACH}</div>
<p>D mới là cái tính điểm. "Máy tôi chạy được" vẫn qua A–C trong khi quên một tệp nằm trong <code>.gitignore</code> hay một gói cài toàn cục; chỉ bản clone sạch mới bắt được.</p>

<h3>Đóng chương</h3>
<pre><code class="language-bash">${CHOT}</code></pre>

${spring(false, 'Khoá Spring Boot có đúng mốc "ngày 0" này: bộ khung khởi động được, nằm trong một repo Git, kiểm từ bản clone sạch. Với Maven, bước "npm ci" thành ./mvnw -q verify.', [
  ['sb-moc-1', 'Spring Boot — Mốc dự án 1: ngày 0, bộ khung khởi động được, nằm trong một repo Git'],
])}

<h3>🎤 Góc phỏng vấn</h3>
<ol>
<li><strong>"Làm sao bạn chắc dự án chạy được trên máy người khác?"</strong> — Lockfile + <code>npm ci</code>, <code>.env.example</code>, ghim phiên bản Node, và một phép kiểm tự động chạy trên bản clone sạch (về sau: trong CI và Docker).</li>
<li><strong>"Mã thoát của script quan trọng gì?"</strong> — CI, Git hook và chuỗi <code>&amp;&amp;</code> chỉ nhìn mã thoát; in "lỗi" mà thoát 0 thì vẫn là bước đạt.</li>
<li><strong>"npm ci khác npm install chỗ nào?"</strong> — Cài đúng y lockfile, xoá <code>node_modules</code> trước, và báo lỗi nếu <code>package.json</code> lệch lockfile.</li>
</ol>

<h3>🧪 Lab — Checkpoint 1 (60–90 phút)</h3>
<div class="callout ok">
<ol>
<li>Viết <code>scripts/checkpoint-1.mjs</code> từ bộ khung. Chạy cho tới khi in <code>0 trượt</code>.</li>
<li>Chứng minh nó bắt được lỗi: cố tình tái hiện tình huống A, B và C, lưu từng output vào <code>docs/nhat-ky.md</code>. Hoàn tác từng cái.</li>
<li>Clone repo của bạn sang một thư mục mới, <code>npm ci</code>, chạy checkpoint ở đó (tình huống D).</li>
<li>Merge, gắn tag <code>ch1</code>, push nếu đã có remote trên GitHub.</li>
</ol>
<p><strong>Thang chấm (10 điểm):</strong> đủ 17 phép kiểm, thông báo dễ đọc (3) · mã thoát 0/1 đúng (1) · server dev luôn được tắt sau khi kiểm — không còn tiến trình mồ côi trên cổng (2) · tái hiện và ghi lại A, B, C (2) · bản clone sạch đạt (2).</p>
</div>
<details><summary>Lời giải — script đầy đủ dùng cho ChiaSe</summary>
<pre><code class="language-js">${SCRIPT}</code></pre>
<p>Chạy xong, kiểm bằng <code>ss -ltn | grep 4181</code> (Windows: <code>netstat -ano | findstr 4181</code>) rằng không còn gì đang nghe.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">exit code (mã thoát)</span><span class="v">Con số tiến trình trả về: 0 = thành công, khác 0 = thất bại.</span></div>
  <div class="kv"><span class="k">npm ci</span><span class="v">Cài sạch, đúng y lockfile.</span></div>
  <div class="kv"><span class="k">process group (nhóm tiến trình)</span><span class="v">Tập tiến trình nhận tín hiệu cùng lúc (POSIX).</span></div>
  <div class="kv"><span class="k">clean clone (bản clone sạch)</span><span class="v">Bản sao mới của repo, không mang theo thứ gì từ máy bạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Checkpoint 1 = 17 phép kiểm có/không tự động bằng Node thuần; chỉ thoát 0 khi tất cả đạt.</li>
<li>Đã kiểm trong bốn tình huống thật: chưa commit, lộ .env, cổng bận, clone sạch.</li>
<li>Bản clone sạch là phép thử tính điểm; sau đó merge và gắn tag <code>ch1</code>.</li>
</ul>
${THE}
</div>
`,
};
