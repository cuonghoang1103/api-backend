/**
 * 11.4 — Checklist tổng kết: "xong" trông như thế nào (soạn 25/11/2026, agent trên Mac tiếp quản fsp).
 * Gồm Checkpoint 11 (scripts/checkpoint-11.mjs — 26 tiêu chí, chạy THẬT từ "laptop" mô phỏng vào VPS mô phỏng: lần 1 25/26 vì root
 * còn đăng nhập được bằng khoá, lần 2 26/26 sau PermitRootLogin no), bảng năng lực cả khoá, việc mở rộng tiếp theo,
 * nơi tìm lời giải mẫu, và gợi ý bảo vệ dự án (đồ án SWP391 / phỏng vấn OJT).
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const CP1 = `$ NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/pebble-root.crt node scripts/checkpoint-11.mjs --mien chiase.test --ssh deployer@chiase.test
== 1. Từ chỗ người dùng đứng (https://chiase.test)
  ✔ DNS: chiase.test ⇒ 172.27.0.4
  ✔ http:// ⇒ 301 sang https:// GIỮ nguyên đường dẫn
  ✔ chứng chỉ được kho CA của máy tin (curl không cần -k) và đi HTTP/2
  ✔ chứng chỉ còn 90 ngày (≥ 7 — hết hạn mà gia hạn tự động hỏng là cả trang chết)
  ✔ chứng chỉ phủ cả chiase.test lẫn www.chiase.test
  ✔ có Strict-Transport-Security
  ✔ CSP: default-src 'self', script-src không có 'unsafe-inline'
  ✔ API, web và máy chủ cùng khai một mã commit 40 ký tự (f707cca91135)
  ✔ chỉ 22, 80, 443 trả lời từ Internet (CSDL, kho ảnh, API, cổng web nội bộ đều đóng)
  ✔ GET /.env không lộ tệp (404 text/html)
  ✔ GET /chiase/.env không lộ tệp (403 application/xml)
  ✔ GET /.git/HEAD không lộ tệp (200 text/html)
  ✔ giới hạn đọc ở Nginx: 40 GET dồn dập ⇒ 19 lần 429, không lần nào 5xx
== 2. Trên máy chủ (deployer@chiase.test)
  ✔ SSH không nhận mật khẩu (máy chủ chỉ mời "publickey")
  ✘ root không đăng nhập được, kể cả bằng khoá
      ⇒ root vẫn vào được — PermitRootLogin no
  ✔ .env trên máy chủ mode 600 (đang: 600)
  ✔ container của ChiaSe chạy ảnh gắn tag SHA đang chạy (2 ảnh, không "latest")
  ✔ API trong container không chạy bằng root (uid 1000)
  ✔ TRUST_PROXY = số lớp proxy thật (Nginx máy chủ + Nginx ảnh web = 2): TRUST_PROXY: "2"
  ✔ log container có trần (local 20m)
  ✔ cron hằng đêm dọn refresh token (don-refresh.sh)
  ✔ bản sao lưu mới nhất: 1 phút trước, mode 600
  ✔ diễn tập phục hồi: 3 người dùng · 3 bài · 10 migration
  ✔ smoke test (có lượt GHI bằng tài khoản smoke) xanh
== 3. Diễn tập: lùi về bản trước, rồi tiến lại
  ✔ deploy.sh --lui xanh, người dùng thấy bản ebaa62d02607 (50 s)
  ✔ deploy lại f707cca91135 xanh (40 s)

Checkpoint 11: 25/26 tiêu chí đạt`;

const CP2 = `$ ssh root@chiase.test "sed -i s/^PermitRootLogin.*/PermitRootLogin\\ no/ /etc/ssh/sshd_config.d/01-chiase.conf &amp;&amp; sshd -t &amp;&amp; kill -HUP \\$(cat /run/sshd.pid); sleep 1; sshd -T | grep ^permitrootlogin"
permitrootlogin no
$ ssh root@chiase.test true
root@chiase.test: Permission denied (publickey).

$ NODE_EXTRA_CA_CERTS=… node scripts/checkpoint-11.mjs --mien chiase.test --ssh deployer@chiase.test
== 1. Từ chỗ người dùng đứng (https://chiase.test)
  ✔ DNS: chiase.test ⇒ 172.27.0.4
  ✔ http:// ⇒ 301 sang https:// GIỮ nguyên đường dẫn
  ✔ chứng chỉ được kho CA của máy tin (curl không cần -k) và đi HTTP/2
  ✔ chứng chỉ còn 90 ngày (≥ 7 — hết hạn mà gia hạn tự động hỏng là cả trang chết)
  ✔ chứng chỉ phủ cả chiase.test lẫn www.chiase.test
  ✔ có Strict-Transport-Security
  ✔ CSP: default-src 'self', script-src không có 'unsafe-inline'
  ✔ API, web và máy chủ cùng khai một mã commit 40 ký tự (f707cca91135)
  ✔ chỉ 22, 80, 443 trả lời từ Internet (CSDL, kho ảnh, API, cổng web nội bộ đều đóng)
  ✔ GET /.env không lộ tệp (404 text/html)
  ✔ GET /chiase/.env không lộ tệp (403 application/xml)
  ✔ GET /.git/HEAD không lộ tệp (200 text/html)
  ✔ giới hạn đọc ở Nginx: 40 GET dồn dập ⇒ 19 lần 429, không lần nào 5xx
== 2. Trên máy chủ (deployer@chiase.test)
  ✔ SSH không nhận mật khẩu (máy chủ chỉ mời "publickey")
  ✔ root không đăng nhập được, kể cả bằng khoá
  ✔ .env trên máy chủ mode 600 (đang: 600)
  ✔ container của ChiaSe chạy ảnh gắn tag SHA đang chạy (2 ảnh, không "latest")
  ✔ API trong container không chạy bằng root (uid 1000)
  ✔ TRUST_PROXY = số lớp proxy thật (Nginx máy chủ + Nginx ảnh web = 2): TRUST_PROXY: "2"
  ✔ log container có trần (local 20m)
  ✔ cron hằng đêm dọn refresh token (don-refresh.sh)
  ✔ bản sao lưu mới nhất: 1 phút trước, mode 600
  ✔ diễn tập phục hồi: 3 người dùng · 3 bài · 10 migration
  ✔ smoke test (có lượt GHI bằng tài khoản smoke) xanh
== 3. Diễn tập: lùi về bản trước, rồi tiến lại
  ✔ deploy.sh --lui xanh, người dùng thấy bản ebaa62d02607 (29 s)
  ✔ deploy lại f707cca91135 xanh (29 s)

Checkpoint 11: 26/26 tiêu chí đạt`;

const CP_MA = `const mk = chay('ssh', [
  '-o',
  'BatchMode=yes',
  '-o',
  'PubkeyAuthentication=no',
  '-o',
  'PreferredAuthentications=password,keyboard-interactive',
  SSH,
  'true',
]);
kiem(
  'SSH không nhận mật khẩu (máy chủ chỉ mời "publickey")',
  mk.status !== 0 &amp;&amp; /Permission denied \\(publickey\\)/.test(mk.stderr),
  mk.stderr.trim(),
);
const goc = chay('ssh', ['-o', 'BatchMode=yes', \`root@\${MIEN}\`, 'true']);
kiem(
  'root không đăng nhập được, kể cả bằng khoá',
  goc.status !== 0,
  'root vẫn vào được — PermitRootLogin no',
);
const sshdT = tren(
  "sudo -n sshd -T 2&gt;/dev/null | grep -E '^(passwordauthentication|permitrootlogin) ' || true",
).stdout;
if (sshdT)
  kiem(
    'sshd -T (giá trị ĐANG HIỆU LỰC): passwordauthentication no, permitrootlogin no',
    /passwordauthentication no/.test(sshdT) &amp;&amp; /permitrootlogin no/.test(sshdT),
    sshdT,
  );

const st = tren('stat -c %a chiase/.env').stdout.trim();
kiem(\`.env trên máy chủ mode 600 (đang: \${st})\`, st === '600');
const anh = tren("docker ps --format '{{.Image}}' | grep chiase- || true")
  .stdout.trim()
  .split('\\n')
  .filter(Boolean);
kiem(
  \`container của ChiaSe chạy ảnh gắn tag SHA đang chạy (\${anh.length} ảnh, không "latest")\`,
  anh.length &gt;= 2 &amp;&amp; anh.every((a) =&gt; a.endsWith(\`:\${banMay}\`)),
  anh.join(' '),
);
const uid = tren('docker exec chiase-api-1 id -u').stdout.trim();
kiem(\`API trong container không chạy bằng root (uid \${uid})\`, uid !== '' &amp;&amp; uid !== '0');
const tp = tren(
  'cd chiase &amp;&amp; TAG=$(cat .ban-dang-chay) docker compose -f compose.prod.yaml config | grep -m1 TRUST_PROXY',
).stdout.trim();
kiem(
  \`TRUST_PROXY = số lớp proxy thật (Nginx máy chủ + Nginx ảnh web = 2): \${tp}\`,
  /TRUST_PROXY: "?2"?$/.test(tp),
);
const logDrv = tren("docker info --format '{{.LoggingDriver}} {{json .}}' | head -c 30").stdout.trim();
const logCt = tren(
  'docker inspect chiase-api-1 --format \\'{{.HostConfig.LogConfig.Type}} {{index .HostConfig.LogConfig.Config "max-size"}}\\'',
).stdout.trim();
kiem(
  \`log container có trần (\${logCt || logDrv})\`,
  /^local|max-size|\\d+m$/.test(logCt) || logDrv.startsWith('local'),
);
const cron = tren('crontab -l 2&gt;/dev/null').stdout;
kiem('cron hằng đêm dọn refresh token (don-refresh.sh)', /don-refresh\\.sh/.test(cron));
const sl = tren(
  'cd chiase &amp;&amp; f=$(ls -t sao-luu/*.dump | head -1) &amp;&amp; echo $(( $(date +%s) - $(stat -c %Y $f) )) $(stat -c %a $f)',
)`;


const NGUON = [
  nguon('🧰', 'Node.js — tls.connect / getPeerCertificate (đọc hạn chứng chỉ)', 'nodejs.org', 'https://nodejs.org/api/tls.html#tlssocketgetpeercertificatedetailed'),
  nguon('🔐', 'Node.js — NODE_EXTRA_CA_CERTS', 'nodejs.org', 'https://nodejs.org/api/cli.html#node_extra_ca_certsfile'),
  nguon('📘', 'GitHub Docs — Managing environments for deployment (người duyệt trước khi deploy)', 'docs.github.com', 'https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-deployments/managing-environments-for-deployment'),
].join('\n');

const THE = [
  lienKet({ khoa: 'deploy-vps', bai: 'deploy-13-3-github-actions-deploy', title: 'Deploy VPS 13.3 — Deploy từ GitHub Actions qua SSH: một khoá, một lệnh', sub: 'Bước tiếp theo tự nhiên của deploy.sh.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-9-4-moi-truong', title: 'GitHub Actions 9.4 — Environment, và CON NGƯỜI như một biện pháp kiểm soát', sub: 'Người duyệt trước khi production đổi.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'deploy-vps', bai: 'deploy-9-5-cua-truoc', title: 'Deploy VPS 9.5 — Kiểm từ CHỖ NGƯỜI DÙNG ĐỨNG', sub: 'Biến phần 1 của checkpoint thành giám sát mỗi phút.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'deploy-vps', bai: 'deploy-14-1-staging-preview', title: 'Deploy VPS 14.1 — Dev, staging và production: một ảnh, nhiều cấu hình', sub: 'Thêm môi trường staging cho ChiaSe.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'deploy-vps', bai: 'deploy-15-4-ra-mat-tuan-dau', title: 'Deploy VPS 15.4 — Ra mắt và tuần đầu: runbook một trang', sub: 'Viết runbook cho ChiaSe theo mẫu này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nginx', bai: 'nginx-9-5-deploy-khong-rot-request', title: 'Nginx 9.5 — Deploy mà không rớt một request nào', sub: 'Xoá chín giây 502 của bài 11.3.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-16-4-van-hanh-su-co', title: 'Docker 16.4 — Tuần đầu trên production: sao lưu, log và tám sự cố', sub: 'Tám sự cố để luyện tay trên ChiaSe.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '11.4 — Capstone checklist: what "done" looks like|||11.4 — Checklist tổng kết: "xong" trông như thế nào',
  slug: 'fp-11-4-tong-ket',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Checkpoint 11 — 26 tiêu chí tự chấm từ máy của bạn: từ chỗ người dùng đứng (DNS, 301 giữ đường dẫn, chứng chỉ tin được + còn hạn + phủ www, HSTS, CSP, bản đang chạy khai đúng SHA, chỉ 22/80/443 trả lời, không lộ .env, giới hạn đọc), trên máy chủ (không mật khẩu, không root, .env 600, ảnh gắn tag SHA, không chạy root, TRUST_PROXY, trần log, cron, sao lưu 600 + diễn tập phục hồi, smoke có lượt ghi) và diễn tập lùi rồi tiến. Lần chạy đầu 25/26 (root vẫn vào được bằng khoá). Rồi tổng kết cả khoá: bảng năng lực theo chương, mười việc mở rộng tiếp, lời giải mẫu nằm đâu, và cách bảo vệ dự án trong 10 phút.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Capstone</span>
<h2>"Done" is a list of claims, each with a command that proves it</h2>
<p class="lead">You started Chapter 0 with an empty folder. ChiaSe now runs on a server you configured, under a name with a valid certificate, deployed by SHA from images CI built, with a smoke test that can roll it back by itself. This lesson does two things: Checkpoint 11 proves all of that from the outside in one command, and the rest of the page turns eleven chapters into something you can show — in a project defence, an internship interview, or your own README.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">outside</span><span class="lz-d">what any visitor or scanner can observe</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">server</span><span class="lz-d">what only the key holder can check</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">drill</span><span class="lz-d">roll back, roll forward, both green</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">show</span><span class="lz-d">README table, demo, one number, one bug</span></div>
</div>


<h3>1. Checkpoint 11</h3>
<pre><code class="language-bash"># on YOUR laptop, in the repo; needs node ≥ 22, curl, ssh access with your key
node scripts/checkpoint-11.mjs --mien your-domain --ssh deployer@your-domain
node scripts/checkpoint-11.mjs --mien your-domain --ssh deployer@your-domain --bo-lui   # skip the rollback drill</code></pre>
<p>Three parts: <strong>1</strong> what anyone on the Internet can observe; <strong>2</strong> what only someone with the key can check; <strong>3</strong> a rollback drill — deploy the previous SHA, then the current one, both with a green smoke test. Part 3 really swaps production (about 9 s of 502 each way, lesson 11.3), so run it when nobody is using the site, or skip it with <code>--bo-lui</code>.</p>
<p>(In the simulation the CA is Pebble, whose root is not in Node's built-in list, hence <code>NODE_EXTRA_CA_CERTS</code>. On a real domain with Let's Encrypt you need nothing.)</p>
<h4>First run: 25/26</h4>
<div class="out">${CP1}</div>
<p>The one failure is real and was left on purpose by 11.1: root could still log in <em>with a key</em> (<code>prohibit-password</code>). Keys are not the problem; the problem is that every action as root is anonymous and unlimited. Fix, and run again:</p>
<div class="out">${CP2}</div>
<h4>How part 2 asks the server</h4>
<pre><code class="language-js">${CP_MA}</code></pre>
<p>Each check is the question a reviewer would ask, written as a command whose output can be compared. A few are deliberately behavioural rather than configuration reads — password login is <em>attempted</em> (<code>BatchMode=yes</code> so it cannot hang), backups are <em>restored</em>, the rollback is <em>performed</em> — because 11.1 showed that a config file and the running program can disagree.</p>
<div class="callout ok"><p><strong>Prove the checkpoint does not pretend.</strong> (1) Publish <code>5432:5432</code> on the db service and redeploy — which criterion turns red? (2) <code>chmod 644 ~/chiase/.env</code> — two criteria react; which, and why does <code>deploy.sh</code> refuse to run? (3) Comment out <code>limit_req</code> and reload Nginx. (4) Delete the newest backup's content (<code>: &gt; file.dump</code>). Every sabotage must turn at least one ✔ into ✘.</p></div>
<details><summary>Solution</summary>
<ol>
<li>"only 22, 80, 443 answer…" lists 5432 — and the port probe catches it even though ufw "denies" it (11.1).</li>
<li>".env mode 600" fails; <code>deploy.sh</code> stops at its own check, so the rollback drill of part 3 fails too.</li>
<li>"read limit: 40 requests ⇒ 0 × 429" fails.</li>
<li>The restore drill fails (<code>pg_restore</code> exits non-zero on an empty file) — a backup that exists but cannot be restored is caught here, not on the day you need it.</li>
</ol>
</details>

<h3>2. What you can now do — by chapter</h3>
<table>
<tr><th>Ch.</th><th>Capability</th><th>Evidence in your repo</th></tr>
<tr><td>0–1</td><td>Scope a product as user stories, design a schema before code, set up a monorepo</td><td><code>docs/</code>, ERD, tag <code>ch1</code></td></tr>
<tr><td>2</td><td>Layered Express 5 + TypeScript API, Prisma migrations, health with a deadline</td><td><code>apps/api/src</code>, migrations</td></tr>
<tr><td>3</td><td>argon2, short JWT + rotating refresh with reuse detection, route-by-route auth, rate-limited login</td><td><code>checkpoint-3</code> (forged/none/expired tokens)</td></tr>
<tr><td>4</td><td>Presigned uploads to S3-compatible storage, image processing, IDOR prevention</td><td><code>checkpoint-4</code></td></tr>
<tr><td>5</td><td>Relations, cursor pagination, N+1 found by counting queries, one error shape</td><td><code>checkpoint-5</code></td></tr>
<tr><td>6</td><td>React 19 + Vite calling the API through one origin, auth in the client without storing tokens in localStorage, forms with server validation</td><td><code>checkpoint-6</code></td></tr>
<tr><td>7</td><td>Socket.IO with auth, rooms, reconnect and catch-up</td><td><code>checkpoint-7</code> (two browsers)</td></tr>
<tr><td>8</td><td>Unit, integration (real Postgres) and API tests that fail for the right reason</td><td><code>npm test</code>, <code>checkpoint-8</code> (planted bugs)</td></tr>
<tr><td>9</td><td>Multi-stage images, non-root, compose with health-gated startup, Nginx in front</td><td><code>checkpoint-9</code> (clean clone)</td></tr>
<tr><td>10</td><td>CI that blocks red PRs, images tagged by SHA, pinned actions, least privilege</td><td><code>checkpoint-10</code> (planted IDOR)</td></tr>
<tr><td>11</td><td>Hardened VPS, TLS via ACME, deploy by SHA with backup + migrate + smoke + automatic rollback, restore drills</td><td><code>checkpoint-11</code> 26/26, <code>lich-su.log</code></td></tr>
</table>

<h3>3. Where the sample solution is</h3>
<p>There is no hidden answer repository to copy: every file that matters is printed in full in the lesson that builds it, and every lab has its solution under a <em>Solution</em> fold. Quick index — <code>compose.yaml</code>, Dockerfiles, web <code>nginx.conf</code>: 9.1–9.3 · <code>ci.yml</code>: 10.4 · <code>compose.prod.yaml</code>, VPS <code>nginx</code> config, <code>tao-env.sh</code>: 11.2 · <code>deploy.sh</code>, <code>smoke.sh</code>, <code>thu-phuc-hoi.sh</code>, <code>don-refresh.sh</code>: 11.3 · every <code>checkpoint-N.mjs</code>: lesson N.4. If you are stuck, the order is the one from lesson 0.9: re-read the lesson, run the checkpoint, read the failing criterion, then open the solution — and retype it rather than paste it.</p>

<h3>4. Ten next steps, roughly in order of value</h3>
<ol>
<li><strong>Uptime check from outside</strong> every minute (part 1 of the checkpoint, on a schedule, alert to your phone).</li>
<li><strong>Deploy from CI</strong>: a manual <code>workflow_dispatch</code> job with <code>environment: production</code> (a required reviewer) that SSHes <code>~/chiase/deploy.sh \${{ github.sha }}</code> with a deploy-only key.</li>
<li><strong>Logs off the container</strong> (journald driver or a collector), so a rollback no longer deletes the evidence (11.3 §5).</li>
<li><strong>Off-site backups on a schedule</strong> + a weekly automatic restore drill with an alert.</li>
<li><strong>Zero-downtime swap</strong>: two API containers behind an upstream — removes the 9 s of 502.</li>
<li><strong>Staging</strong>: same images, another <code>.env</code>, another subdomain.</li>
<li><strong>R2 + CDN</strong> for images (11.2 §12): CORS on the bucket, CSP extended.</li>
<li><strong>Redis</strong> for the login limiter and Socket.IO adapter, before you run a second API instance (promise of 3.3/7.3).</li>
<li><strong>Email verification and password reset</strong> — the features real users ask for first.</li>
<li><strong>Observability</strong>: request latency percentiles and error rate, not averages.</li>
</ol>

<h3>5. Defending the project in ten minutes</h3>
<p>For a capstone defence (SWP391) or an internship interview, structure beats volume:</p>
<ol>
<li><strong>1 min — the problem and the user.</strong> One user story, one screen.</li>
<li><strong>3 min — live demo on the real domain.</strong> Register, post with an image, a second browser sees the like arrive in real time. Rehearse it; have a recorded backup.</li>
<li><strong>2 min — architecture.</strong> The diagram of 11.2: two Nginx, why; what runs where.</li>
<li><strong>2 min — one decision you can defend with a number.</strong> "Login limit per IP needed TRUST_PROXY=2 — with 1, an attacker locked out a real user; here is the test." Or the rollback that lied.</li>
<li><strong>2 min — what broke and how you know it can't silently break again.</strong> A checkpoint that went red, and the criterion you added.</li>
</ol>
<p>Questions you will get, with the lesson that answers them: <em>"How do you store passwords?"</em> (3.1) · <em>"What if someone steals a refresh token?"</em> (3.2) · <em>"Can user A delete user B's post?"</em> (4.1, the IDOR test) · <em>"Why not localStorage?"</em> (6.2) · <em>"How do you know tests are meaningful?"</em> (8.4) · <em>"Which version is in production right now?"</em> (11.2) · <em>"How do you roll back a migration?"</em> (11.3). For a team project, also say who did what — the git history and CI are your evidence.</p>

${spring(true, 'The Spring Boot course ends with its own capstone (LabFlow) built on the same skeleton; if your SWP391 team uses Spring, use its checklist for the code and this chapter\'s Checkpoint 11 for the server — it does not care which language answers on 443.', [
  ['sb-18-1-thiet-ke-capstone', 'Spring Boot 18.1 — Specification and domain design'],
  ['sb-18-4-tong-ket', 'Spring Boot 18.4 — Final checklist and comparison with Node.js'],
  ['sb-18-5-thi-thuc-hanh', 'Spring Boot 18.5 — Timed practical exam'],
])}

<h3>On the job</h3>
<p>At an outsourcing company you will rarely set up a whole system alone. You will be asked to "add a column", "check why login is slow", "help with the release". This course is why those tickets will not scare you: you know where the column's migration can hurt a rollback, where the login limit counts IPs, and what a release must prove before anyone goes home.</p>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>"Walk me through what happens when you deploy."</strong> — SHA ⇒ pull ⇒ verify label ⇒ backup ⇒ migrate ⇒ swap ⇒ smoke ⇒ record or roll back.</li>
<li><strong>"What would you improve first?"</strong> — Uptime check from outside and off-container logs: today I would learn about an outage from a user.</li>
<li><strong>"Tell me about a bug you found in your own tooling."</strong> — The smoke test that failed the first deploy (wrong WebSocket key), or the cleanup report that counted a pre-delete snapshot.</li>
</ol>

<div class="kv-grid">
  <div class="kv"><span class="k">definition of done</span><span class="v">Claims + the commands that prove them.</span></div>
  <div class="kv"><span class="k">behavioural check</span><span class="v">Try the action (login, restore) rather than read the config.</span></div>
  <div class="kv"><span class="k">runbook</span><span class="v">One page: what to do when X breaks.</span></div>
  <div class="kv"><span class="k">capstone</span><span class="v">The project that shows everything together.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Checkpoint 11: 26 criteria from outside, on the server, and a real rollback drill — 25/26 first, 26/26 after <code>PermitRootLogin no</code>.</li>
<li>Every chapter left evidence in the repo; the table of section 2 is your project README.</li>
<li>Next: monitoring from outside, deploy from CI with approval, logs off the container.</li>
<li>Defend with one demo, one diagram, one number, one bug you caught.</li>
</ul>
${NGUON}
${THE}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Tổng kết</span>
<h2>"Xong" là một danh sách lời khẳng định, cái nào cũng có lệnh chứng minh</h2>
<p class="lead">Bạn bắt đầu Chương 0 với một thư mục trống. Giờ ChiaSe chạy trên một máy chủ do bạn cấu hình, dưới một cái tên có chứng chỉ hợp lệ, được deploy theo SHA từ ảnh CI dựng, có smoke test tự lùi được khi hỏng. Bài này làm hai việc: Checkpoint 11 chứng minh tất cả những điều đó từ bên ngoài bằng một lệnh, và phần còn lại biến mười một chương thành thứ bạn TRÌNH BÀY được — khi bảo vệ đồ án, khi phỏng vấn thực tập, hay trong README của chính bạn.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">bên ngoài</span><span class="lz-d">thứ mọi người truy cập hay máy quét thấy được</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">máy chủ</span><span class="lz-d">thứ chỉ người giữ khoá kiểm được</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">diễn tập</span><span class="lz-d">lùi, tiến lại, cả hai xanh</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">trình bày</span><span class="lz-d">bảng README, demo, một con số, một con bọ</span></div>
</div>


<h3>1. Checkpoint 11</h3>
<pre><code class="language-bash"># trên LAPTOP của bạn, trong repo; cần node ≥ 22, curl, ssh vào được bằng khoá
node scripts/checkpoint-11.mjs --mien ten-mien-cua-ban --ssh deployer@ten-mien-cua-ban
node scripts/checkpoint-11.mjs --mien ten-mien-cua-ban --ssh deployer@ten-mien-cua-ban --bo-lui   # bỏ diễn tập lùi bản</code></pre>
<p>Ba phần: <strong>1</strong> thứ bất kỳ ai trên Internet quan sát được; <strong>2</strong> thứ chỉ người có khoá kiểm được; <strong>3</strong> diễn tập lùi bản — deploy SHA trước, rồi SHA hiện tại, cả hai smoke xanh. Phần 3 tráo production THẬT (mỗi chiều khoảng 9 giây 502, bài 11.3), nên chạy lúc không ai dùng trang, hoặc bỏ bằng <code>--bo-lui</code>.</p>
<p>(Trong mô phỏng CA là Pebble, CA gốc của nó không có trong danh sách sẵn của Node, nên cần <code>NODE_EXTRA_CA_CERTS</code>. Tên miền thật dùng Let's Encrypt thì không cần gì.)</p>
<h4>Lần chạy đầu: 25/26</h4>
<div class="out">${CP1}</div>
<p>Tiêu chí trượt duy nhất là thật, và được bài 11.1 cố ý để lại: root vẫn đăng nhập được <em>bằng khoá</em> (<code>prohibit-password</code>). Khoá không phải vấn đề; vấn đề là mọi thao tác bằng root đều vô danh và vô hạn. Sửa, chạy lại:</p>
<div class="out">${CP2}</div>
<h4>Phần 2 hỏi máy chủ như thế nào</h4>
<pre><code class="language-js">${CP_MA}</code></pre>
<p>Mỗi phép kiểm là đúng câu người review sẽ hỏi, viết thành một lệnh có output so sánh được. Vài phép cố ý kiểm bằng HÀNH VI chứ không đọc cấu hình — đăng nhập bằng mật khẩu được <em>thử thật</em> (<code>BatchMode=yes</code> để không treo), bản sao lưu được <em>phục hồi thật</em>, cú lùi được <em>làm thật</em> — vì bài 11.1 đã cho thấy tệp cấu hình và chương trình đang chạy có thể nói hai điều khác nhau.</p>
<div class="callout ok"><p><strong>Chứng minh checkpoint không giả vờ.</strong> (1) Công bố <code>5432:5432</code> cho dịch vụ db rồi deploy lại — tiêu chí nào đỏ? (2) <code>chmod 644 ~/chiase/.env</code> — hai tiêu chí phản ứng; cái nào, và vì sao <code>deploy.sh</code> từ chối chạy? (3) Tắt <code>limit_req</code> rồi reload Nginx. (4) Xoá rỗng bản sao lưu mới nhất (<code>: &gt; tep.dump</code>). Mỗi lần phá phải biến ít nhất một ✔ thành ✘.</p></div>
<details><summary>Lời giải</summary>
<ol>
<li>"chỉ 22, 80, 443 trả lời…" liệt kê 5432 — phép dò cổng bắt được dù ufw "deny" (11.1).</li>
<li>".env mode 600" trượt; <code>deploy.sh</code> dừng ở phép kiểm của chính nó, nên diễn tập lùi ở phần 3 cũng trượt theo.</li>
<li>"giới hạn đọc: 40 request ⇒ 0 lần 429" trượt.</li>
<li>Diễn tập phục hồi trượt (<code>pg_restore</code> thoát khác 0 với tệp rỗng) — bản sao lưu có tồn tại mà không phục hồi được bị bắt ở đây, không phải vào ngày bạn cần nó.</li>
</ol>
</details>

<h3>2. Giờ bạn làm được gì — theo từng chương</h3>
<table>
<tr><th>Ch.</th><th>Năng lực</th><th>Bằng chứng trong repo</th></tr>
<tr><td>0–1</td><td>Chốt phạm vi bằng user story, thiết kế lược đồ trước khi viết mã, dựng monorepo</td><td><code>docs/</code>, ERD, tag <code>ch1</code></td></tr>
<tr><td>2</td><td>API Express 5 + TypeScript phân tầng, migration Prisma, health có hạn chót</td><td><code>apps/api/src</code>, migrations</td></tr>
<tr><td>3</td><td>argon2, JWT ngắn + refresh xoay vòng có phát hiện dùng lại, bảo vệ từng tuyến, giới hạn đăng nhập</td><td><code>checkpoint-3</code> (token giả/none/hết hạn)</td></tr>
<tr><td>4</td><td>Tải ảnh bằng URL ký sẵn lên kho tương thích S3, xử lý ảnh, chặn IDOR</td><td><code>checkpoint-4</code></td></tr>
<tr><td>5</td><td>Quan hệ, phân trang cursor, bắt N+1 bằng cách đếm truy vấn, một hình dạng lỗi</td><td><code>checkpoint-5</code></td></tr>
<tr><td>6</td><td>React 19 + Vite gọi API qua một origin, xác thực phía client không cất token vào localStorage, form có kiểm phía máy chủ</td><td><code>checkpoint-6</code></td></tr>
<tr><td>7</td><td>Socket.IO có xác thực, phòng, nối lại và bắt kịp</td><td><code>checkpoint-7</code> (hai trình duyệt)</td></tr>
<tr><td>8</td><td>Test đơn vị, tích hợp (Postgres thật) và API hỏng vì đúng lý do</td><td><code>npm test</code>, <code>checkpoint-8</code> (cài lỗi)</td></tr>
<tr><td>9</td><td>Ảnh nhiều tầng, không root, compose khởi động theo healthcheck, Nginx đứng trước</td><td><code>checkpoint-9</code> (clone sạch)</td></tr>
<tr><td>10</td><td>CI chặn PR đỏ, ảnh gắn tag SHA, action ghim mã, quyền tối thiểu</td><td><code>checkpoint-10</code> (cài IDOR)</td></tr>
<tr><td>11</td><td>VPS đã gia cố, TLS qua ACME, deploy theo SHA có sao lưu + migrate + smoke + tự lùi, diễn tập phục hồi</td><td><code>checkpoint-11</code> 26/26, <code>lich-su.log</code></td></tr>
</table>

<h3>3. Lời giải mẫu nằm đâu</h3>
<p>Không có kho đáp án giấu đâu đó để chép: mọi tệp quan trọng đều in TOÀN VĂN ở chính bài dựng ra nó, và lab nào cũng có lời giải trong khối <em>Lời giải</em>. Mục lục nhanh — <code>compose.yaml</code>, các Dockerfile, <code>nginx.conf</code> của web: 9.1–9.3 · <code>ci.yml</code>: 10.4 · <code>compose.prod.yaml</code>, cấu hình Nginx của VPS, <code>tao-env.sh</code>: 11.2 · <code>deploy.sh</code>, <code>smoke.sh</code>, <code>thu-phuc-hoi.sh</code>, <code>don-refresh.sh</code>: 11.3 · mọi <code>checkpoint-N.mjs</code>: bài N.4. Khi kẹt, đi đúng thứ tự của bài 0.9: đọc lại bài, chạy checkpoint, đọc tiêu chí trượt, rồi mới mở lời giải — và gõ lại chứ đừng dán.</p>

<h3>4. Mười việc tiếp theo, đại khái theo giá trị</h3>
<ol>
<li><strong>Kiểm "còn sống" từ bên ngoài</strong> mỗi phút (phần 1 của checkpoint, chạy theo lịch, báo về điện thoại).</li>
<li><strong>Deploy từ CI</strong>: một job <code>workflow_dispatch</code> bấm tay với <code>environment: production</code> (bắt buộc có người duyệt), SSH vào chạy <code>~/chiase/deploy.sh \${{ github.sha }}</code> bằng một khoá chỉ dùng để deploy.</li>
<li><strong>Đẩy log ra khỏi container</strong> (driver journald hoặc bộ gom log), để một lần lùi không còn xoá mất bằng chứng (11.3 mục 5).</li>
<li><strong>Sao lưu ra ngoài máy theo lịch</strong> + diễn tập phục hồi tự động hằng tuần có báo động.</li>
<li><strong>Tráo không gián đoạn</strong>: hai container API sau một upstream — xoá chín giây 502.</li>
<li><strong>Staging</strong>: cùng ảnh, <code>.env</code> khác, tên miền con khác.</li>
<li><strong>R2 + CDN</strong> cho ảnh (11.2 mục 12): CORS trên bucket, mở rộng CSP.</li>
<li><strong>Redis</strong> cho bộ giới hạn đăng nhập và adapter Socket.IO, trước khi chạy bản API thứ hai (lời hứa bài 3.3/7.3).</li>
<li><strong>Xác thực email và đặt lại mật khẩu</strong> — hai tính năng người dùng thật hỏi đầu tiên.</li>
<li><strong>Quan sát</strong>: phân vị độ trễ và tỉ lệ lỗi, không phải trung bình.</li>
</ol>

<h3>5. Bảo vệ dự án trong mười phút</h3>
<p>Khi bảo vệ đồ án (SWP391) hay phỏng vấn thực tập, bố cục thắng khối lượng:</p>
<ol>
<li><strong>1 phút — bài toán và người dùng.</strong> Một user story, một màn hình.</li>
<li><strong>3 phút — demo trực tiếp trên tên miền thật.</strong> Đăng ký, đăng bài có ảnh, trình duyệt thứ hai thấy lượt thích tới theo thời gian thực. Tập trước; có sẵn video quay dự phòng.</li>
<li><strong>2 phút — kiến trúc.</strong> Sơ đồ của 11.2: hai Nginx, vì sao; cái gì chạy ở đâu.</li>
<li><strong>2 phút — một quyết định bảo vệ được bằng một con số.</strong> "Giới hạn đăng nhập theo IP cần TRUST_PROXY=2 — đặt 1 thì kẻ tấn công khoá luôn người dùng thật; đây là phép thử." Hoặc cú lùi nói dối.</li>
<li><strong>2 phút — cái gì đã hỏng, và sao biết nó không thể hỏng âm thầm lần nữa.</strong> Một checkpoint từng đỏ, và tiêu chí bạn đã thêm vào.</li>
</ol>
<p>Câu hỏi sẽ gặp, kèm bài trả lời: <em>"Lưu mật khẩu thế nào?"</em> (3.1) · <em>"Bị trộm refresh token thì sao?"</em> (3.2) · <em>"A xoá được bài của B không?"</em> (4.1, phép thử IDOR) · <em>"Sao không dùng localStorage?"</em> (6.2) · <em>"Sao biết test có ý nghĩa?"</em> (8.4) · <em>"Production đang chạy bản nào?"</em> (11.2) · <em>"Lùi một migration thế nào?"</em> (11.3). Với đồ án nhóm, nói rõ ai làm gì — lịch sử git và CI là bằng chứng.</p>

${spring(false, 'Khoá Spring Boot kết thúc bằng dự án cuối khoá riêng (LabFlow) dựng trên cùng bộ khung; nếu nhóm SWP391 của bạn dùng Spring, dùng checklist của khoá đó cho phần mã và Checkpoint 11 của chương này cho phần máy chủ — nó không quan tâm ngôn ngữ nào trả lời ở cổng 443.', [
  ['sb-18-1-thiet-ke-capstone', 'Spring Boot 18.1 — Đặc tả và thiết kế domain'],
  ['sb-18-4-tong-ket', 'Spring Boot 18.4 — Checklist cuối khoá và so sánh Node.js'],
  ['sb-18-5-thi-thuc-hanh', 'Spring Boot 18.5 — Bài thi thực hành có giờ'],
])}

<h3>Tình huống đi làm thật</h3>
<p>Ở công ty outsourcing hiếm khi bạn dựng cả một hệ thống một mình. Bạn sẽ được giao "thêm một cột", "xem sao đăng nhập chậm", "hỗ trợ đợt phát hành". Khoá này là lý do những phiếu việc đó không làm bạn sợ: bạn biết migration của cái cột có thể làm hỏng cú lùi ở đâu, bộ giới hạn đăng nhập đếm IP ở đâu, và một bản phát hành phải chứng minh được gì trước khi mọi người về nhà.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Kể tôi nghe chuyện gì xảy ra khi bạn deploy."</strong> — SHA ⇒ kéo ảnh ⇒ kiểm nhãn ⇒ sao lưu ⇒ migrate ⇒ tráo ⇒ smoke ⇒ ghi sổ hoặc lùi.</li>
<li><strong>"Bạn sẽ cải thiện gì đầu tiên?"</strong> — Kiểm từ bên ngoài và đẩy log ra khỏi container: hôm nay tôi sẽ biết trang sập qua lời người dùng.</li>
<li><strong>"Kể một con bọ bạn tìm thấy trong chính công cụ của mình."</strong> — Smoke test làm lần deploy đầu đỏ oan (khoá WebSocket sai), hoặc báo cáo dọn token đếm trên ảnh chụp trước khi xoá.</li>
</ol>

<div class="kv-grid">
  <div class="kv"><span class="k">định nghĩa "xong"</span><span class="v">Các lời khẳng định + lệnh chứng minh chúng.</span></div>
  <div class="kv"><span class="k">kiểm bằng hành vi</span><span class="v">Thử chính hành động (đăng nhập, phục hồi) thay vì đọc cấu hình.</span></div>
  <div class="kv"><span class="k">runbook</span><span class="v">Một trang: X hỏng thì làm gì.</span></div>
  <div class="kv"><span class="k">capstone</span><span class="v">Dự án cho thấy mọi thứ ghép lại cùng nhau.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Checkpoint 11: 26 tiêu chí từ bên ngoài, trên máy chủ, và một lần diễn tập lùi thật — lần đầu 25/26, sau <code>PermitRootLogin no</code> là 26/26.</li>
<li>Chương nào cũng để lại bằng chứng trong repo; bảng ở mục 2 chính là README dự án của bạn.</li>
<li>Tiếp theo: giám sát từ bên ngoài, deploy từ CI có người duyệt, log ra khỏi container.</li>
<li>Bảo vệ bằng một demo, một sơ đồ, một con số, một con bọ bạn đã bắt.</li>
</ul>
${NGUON}
${THE}
</div>
`,
};
