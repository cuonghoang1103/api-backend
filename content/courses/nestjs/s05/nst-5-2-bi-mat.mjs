/**
 * 5.2 — Bí mật và môi trường: thứ không bao giờ vào git, và các vụ lộ thật (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: scratchpad/nst/lab/c5/g52 — chay.sh (git 2.x trên máy nhà, danh tính giả "SV Demo", kho tạm: .env commit rồi "xoá" vẫn còn
 * trong lịch sử, .gitignore không gỡ tệp đã theo dõi, hook pre-commit tự viết chặn bí mật), docker.sh (ảnh nst-52-* dựng dưới khoá nặng:
 * ENV/ARG nằm trong docker history, secret mount BuildKit thì không; -e đọc được qua docker inspect và /proc/1/environ), bt.sh (hook chặn
 * tệp .env*). Sự cố: Uber 2016 (FTC, phân tích bản sửa đổi 2018), Toyota T-Connect 12/2017–09/2022 (TechCrunch 12/10/2022).
 * Liên kết chéo: nodejs 17.4 và git 8.3 dạy sâu việc gỡ bí mật khỏi lịch sử — bài này không lặp lại.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-17-4-bi-mat-cau-hinh', title: 'Node.js 17.4 — Bí mật: vẫn còn nguyên sau khi bạn đã xoá', sub: 'Bí mật trong lịch sử git, trong image, trong log — phần nền chung cho mọi dự án Node.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'git', bai: 'git-8-3-go-bi-mat', title: 'Git 8.3 — Gỡ một bí mật bị lộ khỏi toàn bộ lịch sử', sub: 'git filter-repo, force push, và vì sao vẫn phải xoay khoá.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'git', bai: 'git-12-1-hooks', title: 'Git 12.1 — Hook: bắt lỗi trước khi nó tồn tại', sub: 'pre-commit, husky, chia sẻ hook cho cả đội.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-7-4-tmpfs-bi-mat', title: 'Docker 7.4 — tmpfs, gốc chỉ đọc, và bí mật', sub: 'Đưa bí mật vào container mà không qua biến môi trường.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🏛', 'FTC — Uber Technologies, phân tích thoả thuận sửa đổi (2018)', 'Khoá truy cập AWS dạng chữ thường trong kho GitHub riêng; 2016 kẻ xâm nhập tải dữ liệu 25,6 triệu tên + email.', 'https://www.ftc.gov/system/files/documents/cases/1523054_uber_technologies_revised_analysis.pdf'),
  nguon('📰', 'TechCrunch — Toyota customer email addresses exposed (12/10/2022)', 'Mã nguồn T-Connect kèm khoá truy cập máy chủ dữ liệu công khai trên GitHub từ 12/2017 tới 09/2022; 296.019 email.', 'https://techcrunch.com/2022/10/12/toyota-customer-email-addresses-exposed/'),
  nguon('📘', 'Docker Docs — Build secrets', 'RUN --mount=type=secret: bí mật dùng lúc build, không nằm trong lớp image.', 'https://docs.docker.com/build/building/secrets/'),
  nguon('📘', 'GitHub Docs — Push protection', 'GitHub chặn push có chuỗi giống khoá của nhà cung cấp đã biết.', 'https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection'),
  nguon('🛠', 'gitleaks (GitHub)', 'Công cụ quét bí mật mã nguồn mở, dùng làm hook pre-commit hoặc bước CI.', 'https://github.com/gitleaks/gitleaks'),
].join('\n');
const OUT_GIT = "## 1. Lỡ commit .env, rồi \"xoá\" ở commit sau\n$ git add . && git commit -qm \"khởi tạo dự án\" && git log --oneline\n8f70bfe khởi tạo dự án\n$ git rm -q --cached .env && echo .env > .gitignore && git add .gitignore && git commit -qm \"xoá .env\" && git log --oneline\n7c322d8 xoá .env\n8f70bfe khởi tạo dự án\n$ git ls-files\n.gitignore\nmain.js\n$ git show HEAD~1:.env\nDATABASE_URL=postgres://app:Lab-Pg-2026!@db.fpt.test:5432/lab\nJWT_SECRET=9f2c7a1e5b8d4f60a3c9e1b7d5f2a8c4\n$ git log --all -p -S JWT_SECRET --format=\"commit %h %s\" | grep -E \"^(commit|[+-]JWT)\"\ncommit 7c322d8 xoá .env\n-JWT_SECRET=9f2c7a1e5b8d4f60a3c9e1b7d5f2a8c4\ncommit 8f70bfe khởi tạo dự án\n+JWT_SECRET=9f2c7a1e5b8d4f60a3c9e1b7d5f2a8c4\n\n## 2. .gitignore không gỡ được tệp ĐÃ được theo dõi\n$ echo \"API_KEY=sk_live_51Hx0demo0key0\" > config.local && git add config.local && git commit -qm \"thêm cấu hình máy\" && echo config.local >> .gitignore\n$ echo \"API_KEY=sk_live_51Hx0demo0key1\" > config.local && git status --short\n M .gitignore\n M config.local\n\n## 3. Hook pre-commit tự viết chặn bí mật trước khi vào lịch sử\n$ printf \"JWT_SECRET=a8f3e9c2d7b14f6e\\nAWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE\\n\" > src.env.ts && git add src.env.ts && git commit -qm \"thêm cấu hình\"; echo \"exit=$?\"\npre-commit: CHẶN — phát hiện chuỗi giống bí mật:\n1:+JWT_SECRET=a8f3…\n2:+AWS_ACCESS_KEY_ID=AKIA…\nĐưa giá trị vào .env (đã .gitignore), commit .env.example với giá trị rỗng.\nexit=1\n$ git reset -q src.env.ts && rm src.env.ts && printf \"DATABASE_URL=\\nJWT_SECRET=\\nPORT=3000\\n\" > .env.example && git add .env.example && git commit -qm \"thêm .env.example\" && git log --oneline -1\n251ec56 thêm .env.example";
const MA_HOOK = "#!/usr/bin/env bash\n# chặn commit nếu phần THÊM MỚI có dạng bí mật (bản tối giản — dự án thật dùng gitleaks/trufflehog)\nmau='(AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|sk_live_[0-9A-Za-z]+|(SECRET|PASSWORD|TOKEN|_KEY)[A-Z_]*=[^[:space:]]{8,})'\ntrung=$(git diff --cached -U0 --no-color | grep -E '^\\+[^+]' | grep -nE \"$mau\")\nif [ -n \"$trung\" ]; then\n  echo \"pre-commit: CHẶN — phát hiện chuỗi giống bí mật:\" >&2\n  echo \"$trung\" | sed -E 's/(=.{4}).*/\\1…/' >&2\n  echo \"Đưa giá trị vào .env (đã .gitignore), commit .env.example với giá trị rỗng.\" >&2\n  exit 1\nfi";
const OUT_DOCKER = "## 4. ENV và ARG nằm lại trong lịch sử image\n$ cat Dockerfile.sai\nFROM nst-node:22\nARG NPM_TOKEN\nENV JWT_SECRET=9f2c7a1e5b8d4f60a3c9e1b7d5f2a8c4\nRUN echo \"//registry.npmjs.org/:_authToken=${NPM_TOKEN}\" > /tmp/.npmrc && echo \"cài gói riêng…\" && rm /tmp/.npmrc\n$ docker history --no-trunc --format \"{{.CreatedBy}}\" nst-52-sai | head -3 | cut -c1-150\nRUN |1 NPM_TOKEN=npm_Xy7DemoToken0000 /bin/sh -c echo \"//registry.npmjs.org/:_authToken=${NPM_TOKEN}\" > /tmp/.npmrc && echo \"cài gói riêng…\" && r\nENV JWT_SECRET=9f2c7a1e5b8d4f60a3c9e1b7d5f2a8c4\nARG NPM_TOKEN=npm_Xy7DemoToken0000\n\n## 5. Secret mount của BuildKit: dùng lúc build, không nằm lại\n$ cat Dockerfile.dung\nFROM nst-node:22\nRUN --mount=type=secret,id=npm_token,env=NPM_TOKEN \\\n    echo \"//registry.npmjs.org/:_authToken=${NPM_TOKEN}\" > /tmp/.npmrc && echo \"cài gói riêng…\" && rm /tmp/.npmrc\n$ docker history --no-trunc --format \"{{.CreatedBy}}\" nst-52-dung | head -1 | cut -c1-150\nRUN /bin/sh -c echo \"//registry.npmjs.org/:_authToken=${NPM_TOKEN}\" > /tmp/.npmrc && echo \"cài gói riêng…\" && rm /tmp/.npmrc # buildkit\n\n## 6. -e lúc chạy: ai có quyền docker là đọc được\n$ docker inspect --format '{{range .Config.Env}}{{println .}}{{end}}' nst-run-52 | grep SECRET\nJWT_SECRET=9f2c7a1e5b8d4f60a3c9e1b7d5f2a8c4\n$ docker exec nst-run-52 sh -c 'tr \"\\\\0\" \"\\\\n\" < /proc/1/environ | grep SECRET'\nJWT_SECRET=9f2c7a1e5b8d4f60a3c9e1b7d5f2a8c4";
const MA_BT = "#!/usr/bin/env bash\ncam=$(git diff --cached --name-only --diff-filter=AR | grep -E '(^|/)\\.env(\\..+)?$' | grep -vE '\\.env\\.example$')\nif [ -n \"$cam\" ]; then echo \"pre-commit: CHẶN — không commit tệp môi trường: $cam\" >&2; exit 1; fi";
const OUT_BT = "$ echo \"DB_HOST=db\" > .env.staging && git add .env.staging && git commit -qm \"staging\"; echo \"exit=$?\"\npre-commit: CHẶN — không commit tệp môi trường: .env.staging\nexit=1\n$ git rm -q --cached .env.staging && echo \"DB_HOST=\" > .env.example && git add .env.example && git commit -qm \"mẫu biến\" && git log --oneline\n47c43e3 mẫu biến";

export default {
  title: '5.2 — Secrets and environments: what never goes into git, and real leaks|||5.2 — Bí mật và môi trường: thứ không bao giờ vào git, và các vụ lộ thật',
  slug: 'nst-5-2-bi-mat',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bí mật (mật khẩu DB, khoá JWT, token npm) là cấu hình mà lộ ra thì phải xoay. Chạy thật: .env đã commit rồi "xoá" vẫn đọc lại được bằng git show; .gitignore không gỡ tệp đã theo dõi; hook pre-commit tự viết chặn chuỗi giống khoá; ENV và ARG nằm nguyên trong docker history còn secret mount thì không; biến -e đọc được qua docker inspect và /proc. Sự cố Uber 2016 (FTC) và Toyota 2017–2022. Quy trình khi lộ: xoay khoá trước, dọn lịch sử sau.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>5.2 — Secrets: configuration that must be rotated when seen</h2>
<p class="lead">A <strong>secret</strong> is any configuration value that gives access: the database password, the JWT signing key, an npm or cloud token, an API key of a payment gateway. The test is simple — if a stranger reads it, do you have to change it? Lesson 5.1 put configuration in the environment; this lesson follows a secret through the places it escapes from in a Nest project: git, the Docker image, the running container. The general theory (rewriting git history) is in Node.js 17.4 and Git 8.3; here we run the Nest/Docker-specific parts and build guards.</p>

<h3>Everyday analogy: the spare house key</h3>
<p>You give a copy of your house key to a friend, then take it back. Did they copy it? You cannot know — so you change the lock. A secret that has been seen is the same: deleting the commit is "taking the key back"; <strong>rotating</strong> the secret is changing the lock. Only the second one makes you safe.</p>

<h3>Experiment 1 — git remembers everything</h3>
<div class="out">${esc(OUT_GIT)}</div>
<h4>"Deleted" is not deleted</h4>
<p>Section 1: after <code>git rm --cached .env</code> and a commit called "remove .env", the working tree is clean — and <code>git show HEAD~1:.env</code> prints the database password and JWT key. <code>git log -S</code> finds the commit that added it in seconds; bots that watch public GitHub do the same within minutes of a push. If the repository was ever public (or the laptop with the clone is stolen), assume the secret is known.</p>
<h4><code>.gitignore</code> is not retroactive</h4>
<p>Section 2: <code>config.local</code> was committed first and ignored afterwards; the next edit still shows <code>M config.local</code> and would be committed. <code>.gitignore</code> only affects untracked files. Add the ignore rules <strong>before</strong> the first commit — <code>nest new</code> already ignores <code>.env</code>, and the course projects use <code>.env*</code> plus <code>!.env.example</code>.</p>
<h4>A guard before history: a pre-commit hook</h4>
<pre><code class="language-bash">${esc(MA_HOOK)}</code></pre>
<p>Section 3: the hook rejected a staged file containing a JWT-looking value and an AWS access key id (the documented example <code>AKIAIOSFODNN7EXAMPLE</code>), printing only the first four characters. The <code>.env.example</code> with empty values passed. This 10-line hook is for understanding; real teams use <code>gitleaks</code> or <code>trufflehog</code> as a hook and again in CI (hooks can be skipped with <code>--no-verify</code>, CI cannot), and GitHub's push protection blocks known provider key formats on the server.</p>

<h3>Experiment 2 — secrets inside Docker images and containers</h3>
<div class="out">${esc(OUT_DOCKER)}</div>
<h4>4. <code>ENV</code> and <code>ARG</code> are part of the image</h4>
<p><code>docker history</code> shows <code>ENV JWT_SECRET=…</code> in clear and, worse, the build argument <code>NPM_TOKEN=npm_Xy7…</code> inside the <code>RUN</code> line — even though the script deleted <code>.npmrc</code> afterwards. Anyone who can pull the image (a registry with weak permissions, a customer you ship it to) can read both. Nest projects hit this when a private npm package needs a token during <code>npm ci</code>.</p>
<h4>5. BuildKit secret mounts leave nothing</h4>
<p>With <code>RUN --mount=type=secret,id=npm_token,env=NPM_TOKEN</code> and <code>docker build --secret id=npm_token,src=…</code>, the history only shows the variable name. The secret exists inside that single <code>RUN</code> step and is never written to a layer.</p>
<h4>6. Runtime variables are visible to whoever runs Docker</h4>
<p><code>docker run -e JWT_SECRET=…</code> is the normal way to pass configuration (Lesson 5.1), but <code>docker inspect</code> prints it and any process in the container can read <code>/proc/1/environ</code>. That is acceptable for most projects — access to the Docker daemon is already root on that machine — but it explains two rules: do not give developers production Docker access "just to look", and for high-value keys use a secret manager or files mounted from a secret store (Docker 7.4).</p>

<h3>🕵️ Real incidents</h3>
<p><strong>Uber, 2016.</strong> According to the FTC's analysis of the revised settlement (2018): (1) an Uber engineer had put an AWS access key in plain text in code stored in a <em>private</em> GitHub repository; (2) attackers got into GitHub using engineers' credentials — the accounts were not protected by multi-factor authentication; (3) with the key they downloaded from Amazon S3 the names and emails of 25.6 million riders and drivers, 22.1 million names and phone numbers and 607,000 driver's licence numbers; (4) Uber paid the attackers $100,000 through its bug bounty and did not tell the FTC until November 2017. A private repository is not a secret store.</p>
<p><strong>Toyota T-Connect, 2017–2022.</strong> In October 2022 Toyota disclosed that a subcontractor building the T-Connect site had published part of its source code on public GitHub in December 2017, including an access key to the data server. The code stayed public until 15 September 2022; 296,019 email addresses and customer numbers were exposed. Toyota made the repository private, changed the key, and said it could not confirm whether anyone had used it (TechCrunch, 12/10/2022). Five years — because nobody scanned.</p>
<p>The common pattern: the key was in source, the key was valid for years, and nobody knew where it had been copied. Schema + environment (5.1), scanning (this lesson) and rotation fix all three.</p>

<h3>When a secret leaks: the order matters</h3>
<ol>
<li><strong>Rotate first</strong>: create a new key, deploy it, revoke the old one. Minutes count; history cleanup can wait.</li>
<li><strong>Check usage</strong>: provider logs (AWS CloudTrail, database login logs) for the period the key was exposed.</li>
<li><strong>Clean up</strong>: rewrite history (Git 8.3), purge image tags, invalidate CI caches.</li>
<li><strong>Prevent</strong>: add the scanner to CI, shorten key lifetime, write a short incident note.</li>
</ol>
<p>Design for step 1: if your app reads <code>API_KEYS</code> as a list (Lesson 5.6 does), you can deploy "old,new", move clients, then remove the old one — rotation with no downtime.</p>

<h3>🧪 Exercise (15 min) — block environment files, not just values</h3>
<p>The content scan misses an <code>.env.staging</code> whose values look harmless. Write a hook that rejects adding any <code>.env*</code> file except <code>.env.example</code>.</p>
<details><summary>Show solution</summary>
<pre><code class="language-bash">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>--diff-filter=AR</code> checks only added or renamed files, so editing an already tracked example still works. Combine both hooks (name rule + content rule) and run the same script in CI.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>You pushed a secret to GitHub by mistake. What do you do first?</strong> Rotate/revoke it immediately; then check logs for use; then remove it from history. Deleting the commit alone is not enough.</li>
<li><strong>Is a private repository a safe place for keys?</strong> No — Uber 2016: attackers entered through engineers' accounts. Access to code is wider and longer-lived than access to production.</li>
<li><strong>How do you pass a token needed only during <code>docker build</code>?</strong> BuildKit <code>--mount=type=secret</code>; never <code>ARG</code>/<code>ENV</code>, which stay in the image history.</li>
<li><strong>What goes into <code>.env.example</code>?</strong> Every variable name, safe defaults, empty secrets and a comment — it is documentation that cannot go stale if the schema test checks it.</li>
</ol>

<h3>💼 On the job</h3>
<p>At FPT Software and similar companies, customer projects usually have their own rule: secrets come from the customer's vault (Azure Key Vault, AWS Secrets Manager, HashiCorp Vault), developers get only development keys, and a security scan in the pipeline blocks the merge. Expect a checklist at onboarding: no customer data or keys on personal machines, no personal GitHub copies of customer code. Breaking it is a contract issue, not just a technical one.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Secret</span><span class="v">Configuration that grants access; if seen, it must be rotated.</span></div>
  <div class="kv"><span class="k">Rotation</span><span class="v">Issue a new secret, deploy it, revoke the old one. The only real fix after a leak.</span></div>
  <div class="kv"><span class="k">.env.example</span><span class="v">Committed list of variable names with empty secrets — the hand-over document.</span></div>
  <div class="kv"><span class="k">pre-commit hook</span><span class="v">Script git runs before a commit; can be skipped, so repeat the check in CI.</span></div>
  <div class="kv"><span class="k">Build secret mount</span><span class="v">BuildKit RUN --mount=type=secret: available during one step, not stored in layers.</span></div>
  <div class="kv"><span class="k">Push protection</span><span class="v">GitHub server-side check that blocks pushes containing known key formats.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A deleted commit still contains the secret; <code>.gitignore</code> does not untrack files.</li>
<li>Scan before history (hook) and again in CI; GitHub push protection is a third layer.</li>
<li><code>ENV</code>/<code>ARG</code> are readable in <code>docker history</code>; use build secret mounts.</li>
<li>Runtime env vars are visible to anyone with Docker access — control that access.</li>
<li>After a leak: rotate first, investigate, then clean history (Uber 2016, Toyota 2017–2022).</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>5.2 — Bí mật: cấu hình mà ai đó thấy là phải đổi</h2>
<p class="lead"><strong>Bí mật</strong> là mọi giá trị cấu hình cho quyền truy cập: mật khẩu cơ sở dữ liệu, khoá ký JWT, token npm hay cloud, khoá API của cổng thanh toán. Phép thử đơn giản — nếu người lạ đọc được, bạn có phải đổi nó không? Bài 5.1 đưa cấu hình vào môi trường; bài này lần theo một bí mật qua những chỗ nó thoát ra trong dự án Nest: git, image Docker, container đang chạy. Lý thuyết chung (viết lại lịch sử git) nằm ở Node.js 17.4 và Git 8.3; ở đây ta chạy phần riêng của Nest/Docker và dựng hàng rào chặn.</p>

<h3>Liên hệ đời thường: chìa khoá nhà dự phòng</h3>
<p>Bạn đưa bạn mình một chìa khoá nhà, rồi lấy lại. Họ có đánh thêm chìa không? Bạn không thể biết — nên bạn thay ổ khoá. Bí mật đã bị thấy cũng vậy: xoá commit là "lấy lại chìa"; <strong>xoay</strong> bí mật là thay ổ khoá. Chỉ việc thứ hai làm bạn an toàn.</p>

<h3>Thí nghiệm 1 — git nhớ mọi thứ</h3>
<div class="out">${esc(OUT_GIT)}</div>
<h4>"Đã xoá" chưa phải là xoá</h4>
<p>Phần 1: sau <code>git rm --cached .env</code> và commit "xoá .env", thư mục làm việc sạch — vậy mà <code>git show HEAD~1:.env</code> in ra mật khẩu cơ sở dữ liệu và khoá JWT. <code>git log -S</code> tìm ra commit đã thêm nó trong vài giây; bot theo dõi GitHub công khai làm đúng như vậy chỉ vài phút sau khi bạn push. Nếu kho từng công khai (hoặc laptop chứa bản clone bị mất), hãy coi như bí mật đã bị biết.</p>
<h4><code>.gitignore</code> không có hiệu lực ngược</h4>
<p>Phần 2: <code>config.local</code> được commit trước rồi mới bị ignore; lần sửa sau vẫn hiện <code>M config.local</code> và sẽ bị commit. <code>.gitignore</code> chỉ tác dụng với tệp chưa được theo dõi. Thêm luật ignore <strong>trước</strong> commit đầu tiên — <code>nest new</code> đã ignore sẵn <code>.env</code>, còn dự án trong khoá dùng <code>.env*</code> kèm <code>!.env.example</code>.</p>
<h4>Chặn trước khi vào lịch sử: hook pre-commit</h4>
<pre><code class="language-bash">${esc(MA_HOOK)}</code></pre>
<p>Phần 3: hook từ chối một tệp đã stage có giá trị giống JWT và một mã khoá truy cập AWS (đúng ví dụ trong tài liệu AWS, <code>AKIAIOSFODNN7EXAMPLE</code>), và chỉ in bốn ký tự đầu. <code>.env.example</code> với giá trị rỗng thì qua. Hook 10 dòng này để hiểu cơ chế; đội thật dùng <code>gitleaks</code> hoặc <code>trufflehog</code> làm hook và chạy lại trong CI (hook bỏ qua được bằng <code>--no-verify</code>, CI thì không), còn push protection của GitHub chặn các dạng khoá đã biết ngay ở máy chủ.</p>

<h3>Thí nghiệm 2 — bí mật trong image và container Docker</h3>
<div class="out">${esc(OUT_DOCKER)}</div>
<h4>4. <code>ENV</code> và <code>ARG</code> là một phần của image</h4>
<p><code>docker history</code> hiện rõ <code>ENV JWT_SECRET=…</code> và, tệ hơn, tham số build <code>NPM_TOKEN=npm_Xy7…</code> ngay trong dòng <code>RUN</code> — dù script đã xoá <code>.npmrc</code> sau đó. Ai kéo được image (registry phân quyền lỏng, khách hàng bạn giao image) đều đọc được cả hai. Dự án Nest dính chuyện này khi một gói npm riêng cần token lúc <code>npm ci</code>.</p>
<h4>5. Secret mount của BuildKit không để lại gì</h4>
<p>Với <code>RUN --mount=type=secret,id=npm_token,env=NPM_TOKEN</code> và <code>docker build --secret id=npm_token,src=…</code>, lịch sử chỉ còn tên biến. Bí mật chỉ tồn tại trong đúng bước <code>RUN</code> đó và không bao giờ được ghi vào lớp image.</p>
<h4>6. Biến lúc chạy: ai chạy được Docker là thấy</h4>
<p><code>docker run -e JWT_SECRET=…</code> là cách bình thường để truyền cấu hình (Bài 5.1), nhưng <code>docker inspect</code> in nó ra và mọi tiến trình trong container đọc được <code>/proc/1/environ</code>. Với đa số dự án điều đó chấp nhận được — quyền dùng Docker daemon vốn đã là quyền root trên máy đó — nhưng nó giải thích hai luật: đừng cấp cho lập trình viên quyền Docker production "để xem thôi", và với khoá giá trị cao thì dùng trình quản lý bí mật hoặc tệp gắn từ kho bí mật (Docker 7.4).</p>

<h3>🕵️ Sự cố thật</h3>
<p><strong>Uber, 2016.</strong> Theo phân tích của FTC về thoả thuận sửa đổi (2018): (1) một kỹ sư Uber đặt khoá truy cập AWS dạng chữ thường trong mã lưu ở kho GitHub <em>riêng tư</em>; (2) kẻ tấn công vào được GitHub bằng thông tin đăng nhập của kỹ sư — các tài khoản không bật xác thực nhiều lớp; (3) dùng khoá đó, chúng tải từ Amazon S3 tên và email của 25,6 triệu người dùng và tài xế, 22,1 triệu tên kèm số điện thoại, 607.000 số bằng lái; (4) Uber trả kẻ tấn công 100.000 USD qua chương trình bug bounty và tới tháng 11/2017 mới báo FTC. Kho riêng tư không phải là kho bí mật.</p>
<p><strong>Toyota T-Connect, 2017–2022.</strong> Tháng 10/2022, Toyota công bố một nhà thầu phụ làm trang T-Connect đã đưa một phần mã nguồn lên GitHub công khai từ tháng 12/2017, trong đó có khoá truy cập máy chủ dữ liệu. Mã ở chế độ công khai tới ngày 15/09/2022; 296.019 địa chỉ email và mã khách hàng bị phơi ra. Toyota chuyển kho sang riêng tư, đổi khoá, và nói không thể xác nhận có ai đã dùng nó hay chưa (TechCrunch, 12/10/2022). Năm năm — vì không ai quét.</p>
<p>Điểm chung: khoá nằm trong mã nguồn, khoá còn hiệu lực nhiều năm, và không ai biết nó đã bị chép đi đâu. Schema + môi trường (5.1), quét (bài này) và xoay khoá sửa được cả ba.</p>

<h3>Khi bí mật bị lộ: thứ tự quan trọng</h3>
<ol>
<li><strong>Xoay trước</strong>: tạo khoá mới, triển khai, thu hồi khoá cũ. Từng phút đều quý; dọn lịch sử để sau.</li>
<li><strong>Kiểm việc sử dụng</strong>: log của nhà cung cấp (AWS CloudTrail, log đăng nhập cơ sở dữ liệu) trong khoảng thời gian khoá bị lộ.</li>
<li><strong>Dọn dẹp</strong>: viết lại lịch sử (Git 8.3), xoá tag image, làm mất hiệu lực cache CI.</li>
<li><strong>Phòng ngừa</strong>: thêm trình quét vào CI, rút ngắn thời hạn khoá, viết một ghi chú sự cố ngắn.</li>
</ol>
<p>Thiết kế sẵn cho bước 1: nếu ứng dụng đọc <code>API_KEYS</code> dạng danh sách (Bài 5.6 làm vậy), bạn triển khai "cũ,mới", chuyển client sang, rồi bỏ khoá cũ — xoay khoá không phải dừng dịch vụ.</p>

<h3>🧪 Bài tập (15 phút) — chặn tệp môi trường, không chỉ chặn giá trị</h3>
<p>Quét nội dung bỏ sót một tệp <code>.env.staging</code> có giá trị trông vô hại. Viết hook từ chối thêm mọi tệp <code>.env*</code> trừ <code>.env.example</code>.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-bash">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>--diff-filter=AR</code> chỉ xét tệp mới thêm hoặc đổi tên, nên sửa tệp mẫu đã theo dõi vẫn được. Ghép cả hai hook (luật tên + luật nội dung) và chạy cùng script đó trong CI.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Bạn lỡ push một bí mật lên GitHub. Việc đầu tiên là gì?</strong> Xoay/thu hồi ngay; rồi kiểm log xem có bị dùng không; rồi mới gỡ khỏi lịch sử. Chỉ xoá commit là không đủ.</li>
<li><strong>Kho riêng tư có phải chỗ an toàn để để khoá không?</strong> Không — Uber 2016: kẻ tấn công vào qua tài khoản kỹ sư. Quyền đọc mã rộng hơn và tồn tại lâu hơn quyền vào production.</li>
<li><strong>Truyền token chỉ cần lúc <code>docker build</code> thế nào?</strong> BuildKit <code>--mount=type=secret</code>; không bao giờ dùng <code>ARG</code>/<code>ENV</code>, vì chúng nằm lại trong lịch sử image.</li>
<li><strong><code>.env.example</code> chứa gì?</strong> Tên mọi biến, giá trị mặc định an toàn, bí mật để rỗng và một dòng chú thích — đó là tài liệu không thể lỗi thời nếu có test schema kiểm nó.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Ở FPT Software và các công ty tương tự, dự án của khách thường có luật riêng: bí mật lấy từ vault của khách (Azure Key Vault, AWS Secrets Manager, HashiCorp Vault), lập trình viên chỉ có khoá môi trường phát triển, và bước quét bảo mật trong pipeline chặn merge. Lúc nhận dự án sẽ có bảng cam kết: không để dữ liệu hay khoá của khách trên máy cá nhân, không chép mã của khách lên GitHub cá nhân. Vi phạm là chuyện hợp đồng, không chỉ là chuyện kỹ thuật.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bí mật (secret)</span><span class="v">Cấu hình cho quyền truy cập; đã bị thấy thì phải xoay.</span></div>
  <div class="kv"><span class="k">Xoay khoá (rotation)</span><span class="v">Cấp bí mật mới, triển khai, thu hồi cái cũ. Cách sửa thật sự duy nhất sau khi lộ.</span></div>
  <div class="kv"><span class="k">.env.example</span><span class="v">Danh sách tên biến được commit, bí mật để rỗng — tài liệu bàn giao.</span></div>
  <div class="kv"><span class="k">Hook pre-commit</span><span class="v">Script git chạy trước mỗi commit; bỏ qua được, nên phải kiểm lại trong CI.</span></div>
  <div class="kv"><span class="k">Secret mount lúc build</span><span class="v">BuildKit RUN --mount=type=secret: có trong một bước, không lưu vào lớp image.</span></div>
  <div class="kv"><span class="k">Push protection</span><span class="v">Kiểm tra phía máy chủ GitHub, chặn push chứa dạng khoá đã biết.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Commit đã xoá vẫn chứa bí mật; <code>.gitignore</code> không gỡ tệp đã theo dõi.</li>
<li>Quét trước khi vào lịch sử (hook) và quét lại trong CI; push protection của GitHub là lớp thứ ba.</li>
<li><code>ENV</code>/<code>ARG</code> đọc được trong <code>docker history</code>; dùng secret mount lúc build.</li>
<li>Biến môi trường lúc chạy ai có quyền Docker cũng thấy — hãy kiểm soát quyền đó.</li>
<li>Sau khi lộ: xoay trước, điều tra, rồi mới dọn lịch sử (Uber 2016, Toyota 2017–2022).</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
