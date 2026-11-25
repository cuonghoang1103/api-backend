/**
 * 10.3 — Check bắt buộc và bảo vệ nhánh (soạn 25/11/2026, agent trên Mac tiếp quản fsp).
 * Phần GitHub (ruleset/branch protection) dạy theo GitHub Docs (GET 200 25/11/2026) — KHÔNG chạy được trong khoá vì không dùng
 * tài khoản GitHub nào. Phần chạy THẬT: "máy chủ git" cục bộ = repo trần + hook pre-receive gọi act (scripts/cong-main),
 * hook tự từ chối xoá/force push trước CI (git chỉ xét receive.denyNonFastForwards/denyDeletes SAU hook — Checkpoint 10 bắt được); output: push xanh nhận, push đỏ bị từ chối, force push/xoá bị từ chối,
 * nhánh tính năng nhận. Job tổng ci-xanh (if: always()) vì GitHub tính "skipped" là ĐẠT.
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const CI_TONG = `  # Bài 10.3 — MỘT check tổng duy nhất để branch protection bắt buộc. Vì sao không bắt buộc thẳng "image":
  # job bị bỏ qua (skipped) được GitHub tính là ĐẠT ⇒ test đỏ ⇒ image skipped ⇒ PR vẫn merge được.
  # if: always() ⇒ job này LUÔN chạy và tự đỏ nếu có job nào phía trước không "success".
  ci-xanh:
    name: ci-xanh
    if: always()
    needs: [check, test, image]
    runs-on: ubuntu-latest
    timeout-minutes: 2
    steps:
      - name: Mọi job phía trước phải success
        run: |
          echo "check=\${{ needs.check.result }} test=\${{ needs.test.result }} image=\${{ needs.image.result }}"
          [ "\${{ needs.check.result }}" = success ] &amp;&amp; [ "\${{ needs.test.result }}" = success ] &amp;&amp; [ "\${{ needs.image.result }}" = success ]`;

const HOOK = `#!/usr/bin/env bash
# Cổng giữ main — bản CỤC BỘ của "branch protection + required check" (bài 10.3, Checkpoint 10).
# Gắn vào một repo git TRẦN làm "máy chủ" (scripts/cong-main/dung-cong.sh). Mỗi lần ai đó push:
#   - nhánh khác main: nhận ngay (CI vẫn nên chạy, nhưng không chặn);
#   - main: chạy CI bằng act trên ĐÚNG commit được đẩy, chỉ nhận khi mọi job xanh (exit 0 của act).
#   - main bị xoá hoặc bị đè bằng lịch sử không nối tiếp (force push): từ chối NGAY, không chạy CI.
# receive.denyNonFastForwards / receive.denyDeletes (dung-cong.sh) là lớp thứ hai — nhưng git chỉ xét chúng SAU hook này
# (đo ở Checkpoint 10: bản đầu của hook đã chạy CI cho cả lệnh xoá main).
# Biến: ACT (lệnh act, mặc định "act"), CONG_LOG (thư mục giữ log, mặc định thư mục repo trần).
set -u
Z=0000000000000000000000000000000000000000
SU_KIEN="$(dirname "$(readlink -f "$0")")/su-kien-pr.json"
tu_choi=0
while read -r cu moi ref; do
  if [ "$ref" != refs/heads/main ]; then echo "cổng: \${ref#refs/heads/} — nhánh không bảo vệ, nhận."; continue; fi
  if [ "$moi" = "$Z" ]; then echo "cổng: TỪ CHỐI xoá main"; tu_choi=1; continue; fi
  if [ "$cu" != "$Z" ] &amp;&amp; ! git merge-base --is-ancestor "$cu" "$moi"; then
    echo "cổng: TỪ CHỐI force push — \${moi:0:12} không nối tiếp main hiện tại \${cu:0:12}"
    tu_choi=1
    continue
  fi
  tmp=$(mktemp -d)
  git archive "$moi" | tar -x -C "$tmp" # commit đang ở vùng cách ly của lượt push — hook vẫn đọc được
  (
    unset $(env | grep -o '^GIT_[A-Z_]*') # act/git bên dưới không được thấy GIT_DIR của repo trần
    cd "$tmp" &amp;&amp; git init -q -b main &amp;&amp; git add -A &amp;&amp;
      git -c user.name=cong -c user.email=cong@vi-du.invalid commit -qm "CI cho $moi" &amp;&amp;
      echo "cổng: chạy CI cho \${moi:0:12} (act, sự kiện pull_request)…" &amp;&amp;
      \${ACT:-act} pull_request --rm -P ubuntu-latest=catthehacker/ubuntu:act-24.04 -e "$SU_KIEN" &gt;"$tmp/log.txt" 2&gt;&amp;1
  )
  ma=$?
  grep -E '🏁  Job (succeeded|failed)' "$tmp/log.txt" | sed -E 's/^\\[CI\\/([^]]*[^ ]) *\\] *🏁  Job /  \\1: /; s/-[0-9]+: /: /'
  cp "$tmp/log.txt" "\${CONG_LOG:-$PWD}/ci-\${moi:0:12}.log"
  rm -rf "$tmp"
  if [ $ma -eq 0 ]; then
    echo "cổng: ci-xanh ✅ ⇒ NHẬN \${moi:0:12} vào main"
  else
    echo "cổng: ci-xanh ❌ ⇒ TỪ CHỐI \${moi:0:12}, main giữ nguyên \${cu:0:12} (log: ci-\${moi:0:12}.log)"
    tu_choi=1
  fi
done
exit $tu_choi`;

const DUNG = `#!/usr/bin/env bash
# dung-cong.sh &lt;thư-mục&gt; — dựng một "máy chủ git" cục bộ có cổng giữ main (bài 10.3). In ra đường của repo trần.
# Dùng: git remote add cong "$(bash scripts/cong-main/dung-cong.sh /tmp/cong)"; git push cong main
set -eu
dich="$1/chiase.git"
git init -q --bare -b main "$dich"
git -C "$dich" config receive.denyNonFastForwards true # = "Block force pushes"
git -C "$dich" config receive.denyDeletes true         # = "Restrict deletions"
ln -sf "$(readlink -f "$(dirname "$0")")/pre-receive" "$dich/hooks/pre-receive"
echo "$dich"`;

const CONG = `$ git remote add cong "$(bash scripts/cong-main/dung-cong.sh /tmp/fsp-cong)" &amp;&amp; git remote -v | head -1
cong	/tmp/fsp-cong/chiase.git (fetch)
(mã thoát 0)

$ git push cong main
remote: cổng: chạy CI cho e96913ce83d0 (act, sự kiện pull_request)…
remote:   check: succeeded
remote:   test: succeeded
remote:   image (web)-3: succeeded
remote:   image (api)-1: succeeded
remote:   image (api-migrate)-2: succeeded
remote:   ci-xanh: succeeded
remote: cổng: ci-xanh ✅ ⇒ NHẬN e96913ce83d0 vào main
To /tmp/fsp-cong/chiase.git
 * [new branch]      main -&gt; main
(mã thoát 0)

$ git commit -qam "sửa bài: gọn điều kiện where" &amp;&amp; git log --oneline -2
efa4184 sửa bài: gọn điều kiện where
e96913c ChiaSe sau Chương 10
(mã thoát 0)

$ git push cong main
remote: cổng: chạy CI cho efa418451772 (act, sự kiện pull_request)…
remote:   check: succeeded
remote:   test: failed
remote:   ci-xanh: failed
remote: cổng: ci-xanh ❌ ⇒ TỪ CHỐI efa418451772, main giữ nguyên e96913ce83d0 (log: ci-efa418451772.log)
To /tmp/fsp-cong/chiase.git
 ! [remote rejected] main -&gt; main (pre-receive hook declined)
error: failed to push some refs to '/tmp/fsp-cong/chiase.git'
(mã thoát 1)

$ git push cong main:tinh-nang
remote: cổng: tinh-nang — nhánh không bảo vệ, nhận.
To /tmp/fsp-cong/chiase.git
 * [new branch]      main -&gt; tinh-nang
(mã thoát 0)

$ git checkout -q --orphan viet-lai &amp;&amp; git commit -qm "viết lại lịch sử"
(mã thoát 0)

$ git push -f cong viet-lai:main
remote: cổng: TỪ CHỐI force push — 7d8ed490d06f không nối tiếp main hiện tại e96913ce83d0
To /tmp/fsp-cong/chiase.git
 ! [remote rejected] viet-lai -&gt; main (pre-receive hook declined)
error: failed to push some refs to '/tmp/fsp-cong/chiase.git'
(mã thoát 1)

$ git push cong :main
remote: cổng: TỪ CHỐI xoá main
To /tmp/fsp-cong/chiase.git
 ! [remote rejected] main (pre-receive hook declined)
error: failed to push some refs to '/tmp/fsp-cong/chiase.git'
(mã thoát 1)

$ git ls-remote cong
e96913ce83d04a82b6debdd980bf20e78289c42c	HEAD
e96913ce83d04a82b6debdd980bf20e78289c42c	refs/heads/main
efa418451772c967204cbfc3c4186b98d0ac1491	refs/heads/tinh-nang
(mã thoát 0)`;

const BO_QUA = `[CI/check] 🏁  Job succeeded
[CI/test ]   |       Tests  2 failed | 104 passed (106)
[CI/test ]   ❌  Failure - Main npm test [15.495614284s]
[CI/test ] 🏁  Job failed
[CI/ci-xanh              ]   | check=success test=failure image=skipped
[CI/ci-xanh              ]   ❌  Failure - Main Mọi job phía trước phải success [82.808641ms]
[CI/ci-xanh              ] 🏁  Job failed
Error: Job 'test' failed`;


const NGUON = [
  nguon('📘', 'GitHub Docs — About protected branches', 'docs.github.com', 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches'),
  nguon('📘', 'GitHub Docs — About rulesets', 'docs.github.com', 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets'),
  nguon('📘', 'GitHub Docs — Troubleshooting required status checks (skipped = đạt, 7 ngày, nguồn lạ)', 'docs.github.com', 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks'),
].join('\n');

const THE = [
  lienKet({ khoa: 'testing', bai: 'tst-9-3-bat-buoc', title: 'Testing 9.3 — Check bắt buộc và bảo vệ nhánh', sub: 'Cùng ý, nhìn từ phía người viết test.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-14-1-cong-chat-luong', title: 'GitHub Actions 14.1 — Cổng chất lượng: check bắt buộc, job tổng hợp, paths', sub: 'Job tổng hợp và bẫy paths: đo kỹ hơn.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-1-4-merge-commit', title: 'GitHub Actions 1.4 — pull_request chạy trên một commit KHÔNG nằm trên nhánh', sub: 'Vì sao "up to date before merging" tồn tại.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-9-4-moi-truong', title: 'GitHub Actions 9.4 — Environment, và CON NGƯỜI như một biện pháp kiểm soát', sub: 'Chương 11 dùng environment để duyệt trước khi deploy.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'git', bai: 'git-12-4-chinh-sach-may-chu', title: 'Git 12.3 — Cưỡng chế thật: hook phía máy chủ, ruleset và CI', sub: 'pre-receive chạy ở đâu, khi nào, và vì sao nó chặn được push.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '10.3 — Required checks and branch protection|||10.3 — Check bắt buộc và bảo vệ nhánh',
  slug: 'fp-10-3-bat-buoc-check',
  type: 'LESSON',
  isFreePreview: true,
  description: 'CI chỉ báo đỏ thì vẫn có người bấm merge. Biến kết quả CI thành LUẬT: ruleset trên main (cấm force push, cấm xoá, bắt buộc PR + review, bắt buộc check xanh trên commit mới nhất, không ai được vượt — kể cả admin). Ba cái bẫy theo GitHub Docs: tên check phải khớp tên job, job bị bỏ qua được tính là ĐẠT (nên ChiaSe có job tổng ci-xanh chạy với if: always()), workflow bị lọc theo paths làm check treo "Pending". Rồi dựng THẬT một cổng giữ main cục bộ (repo git trần + hook pre-receive gọi act): push commit đỏ bị từ chối, force push và xoá main bị từ chối trước cả khi chạy CI, nhánh tính năng vẫn nhận.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Branch protection</span>
<h2>A red check that does not block is just a suggestion</h2>
<p class="lead">After 10.1 and 10.2 every PR shows ✅ or ❌. Nothing stops anyone from clicking "Merge" on ❌ at 11 pm before a demo, or from pushing straight to <code>main</code>. Branch protection turns the CI result into a rule the server enforces — for everyone, the repository owner included.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">PR opened</span><span class="lz-d">direct pushes to main are refused</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">checks</span><span class="lz-d">ci-xanh must be success on the PR's LATEST commit</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">review</span><span class="lz-d">one approval; a new push dismisses old approvals</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">merge</span><span class="lz-d">button enabled only now; no force push, no deletion, no bypass</span></div>
</div>

<h3>1. On GitHub: a ruleset for <code>main</code></h3>
<p>Settings → <strong>Rules → Rulesets → New branch ruleset</strong>. Target: the default branch. Enforcement: Active. Then tick:</p>
<ul>
<li><strong>Restrict deletions</strong> and <strong>Block force pushes</strong> — nobody rewrites or deletes the shared history.</li>
<li><strong>Require a pull request before merging</strong> — 1 approval, <em>dismiss stale approvals when new commits are pushed</em> (otherwise "approve, then push something else" passes).</li>
<li><strong>Require status checks to pass</strong> — add <code>ci-xanh</code>, choose <em>GitHub Actions</em> as the expected source, and tick <em>require branches to be up to date before merging</em>.</li>
<li><strong>Bypass list: empty.</strong> With classic branch protection the equivalent is "Do not allow bypassing the above settings": by default, the Docs say, the rules <em>don't apply to people with admin permissions</em> — which on a student repo is you.</li>
</ul>
<p>Rulesets are the newer form of branch protection: several can apply at once, they can be read by anyone with read access, and <code>gh ruleset check main</code> lists what applies to a branch. Classic "Branches → Add rule" does the same job; pick one and do not mix them on the same branch. These settings were <strong>not</strong> clicked for this course (no GitHub account was used); they are taken from GitHub Docs, linked below.</p>

<h3>2. Which check to require — three traps</h3>
<p><strong>Trap 1 — names.</strong> A required check is matched by <em>name</em>: the job's <code>name:</code>, and for a matrix <code>image (api)</code>, <code>image (web)</code>… Rename a job and the rule waits forever for a check that will never report ("Expected — Waiting for status to be reported"). The Docs add: the check must have run successfully in the repository during the past seven days before you can pick it.</p>
<p><strong>Trap 2 — skipped counts as passed.</strong> From the Docs: <em>"Successful check statuses are success, skipped, and neutral"</em>, and when <em>"a job depends on a failed job, the dependent job is skipped and may not block merging"</em>. If we required only <code>image</code>: tests red ⇒ <code>image</code> skipped ⇒ skipped is "successful" ⇒ merge allowed. Our run of exactly that situation (IDOR mutation from 10.1):</p>
<div class="out">${BO_QUA}</div>
<p>Hence one aggregate job that <em>always</em> runs and is red unless every job before it is <code>success</code>:</p>
<pre><code class="language-yaml">${CI_TONG}</code></pre>
<p>One required name (<code>ci-xanh</code>) that never changes, however many jobs you add later: add the new job to <code>needs:</code> and the rule follows.</p>
<p><strong>Trap 3 — path filters.</strong> If the workflow had <code>on: pull_request: paths: ['apps/**']</code>, a PR that only edits the README would not start it, and the required check would stay <em>Pending</em> — blocking forever. Keep required workflows unfiltered; skip work <em>inside</em> jobs if you must.</p>

<div class="pitfall co-tieu-de"><p><strong>Pitfall — "up to date" is not paranoia.</strong> PR checks run on a temporary merge of the PR into <code>main</code> <em>as it was then</em>. PR A renames a function, PR B adds a new call to the old name; each is green alone, both merged ⇒ <code>main</code> is red. "Require branches to be up to date" forces B to rebase onto A and run again. For busy repos the merge queue does this automatically.</p></div>

<h3>3. Running it for real, without GitHub: a server that says no</h3>
<p>Branch protection is just the <em>server</em> refusing an update of <code>refs/heads/main</code>. Git has had that power forever: a <code>pre-receive</code> hook in the repository you push <em>to</em> runs before any ref moves, and a non-zero exit rejects the whole push. ChiaSe ships a small one in <code>scripts/cong-main/</code>:</p>
<pre><code class="language-bash">${HOOK}</code></pre>
<pre><code class="language-bash">${DUNG}</code></pre>
<p>A real session — a bare repo as "GitHub", a green commit, then the IDOR mutation, then two attempts to cheat:</p>
<div class="out">${CONG}</div>
<p>Each line maps to a ruleset switch: CI red ⇒ <em>require status checks</em>; "force push — not a continuation of main" ⇒ <em>block force pushes</em>; "refuse deleting main" ⇒ <em>restrict deletions</em>; <code>tinh-nang</code> accepted ⇒ only <code>main</code> is protected. The first version of this hook relied on <code>receive.denyNonFastForwards</code>/<code>denyDeletes</code> for the last two — and Checkpoint 10 caught that git evaluates those <em>after</em> the pre-receive hook, so the hook ran CI on a deletion (lesson 10.4 shows the log). Both cases are now refused by the hook itself, before any CI; the git settings stay as a second layer. What the hook cannot give you is the review step and the merge button — that is the part GitHub adds. GitLab, Gitea and Bitbucket expose the same three switches under other names; once you understand the hook you understand all of them.</p>

<div class="pitfall co-tieu-de"><p><strong>Hacker's corner — a green tick anyone can paint.</strong> A "check" is just a status with a name on a commit. Any integration with permission to write statuses can post one called <code>ci-xanh</code> with state <code>success</code>, whatever your workflow said. GitHub's Docs describe the defence: pick the <em>expected source</em> app for each required check (here: GitHub Actions); then "Required status check … was not set by the expected GitHub App" and merging is refused. Same family: let only humans approve PRs (the repository setting that allows GitHub Actions to create and approve pull requests stays off), and never give a CI token <code>pull-requests: write</code> unless a job truly needs it.</p></div>

${spring(true, 'Nothing changes for a Spring project: the rule protects main, the required check is the name of your aggregate job (for example the one running mvn -B verify).', [
  ['sb-17-3-github-actions-spring', 'Spring Boot 17.3 — CI with GitHub Actions'],
])}

<h3>Everyday analogy</h3>
<p>A bank vault with a time lock and two keys: the manager cannot open it alone at night, however trusted. Branch protection is that lock for <code>main</code>. It is not about distrusting you; it is about the night when you are tired.</p>

<h3>On the job</h3>
<p>In an outsourcing team the client's repo usually has these rules already, and new joiners discover them by having a push to <code>main</code> refused. The right reaction is a branch + PR, never asking an admin to "turn it off for a minute". If you set up a repo for your SWP391 group, set the ruleset on day one: four people pushing to <code>main</code> two days before the demo is how a working build disappears.</p>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>"How do you stop broken code reaching main?"</strong> — Protected branch: PR + review, required CI check on the latest commit, no force push, no bypass.</li>
<li><strong>"Why one aggregate check instead of requiring every job?"</strong> — Skipped jobs count as passed, and job names change; one <code>if: always()</code> job with <code>needs:</code> fixes both.</li>
<li><strong>"What does 'require branches to be up to date' protect against?"</strong> — Two PRs green alone, red together.</li>
<li><strong>"Can an admin merge a red PR?"</strong> — With classic protection, yes by default; you must disable bypass explicitly.</li>
<li><strong>"How would you enforce this on a self-hosted git server?"</strong> — A <code>pre-receive</code> hook that refuses deletions and non-fast-forward updates and runs CI, plus <code>receive.denyNonFastForwards</code>/<code>denyDeletes</code> as a second layer — what the platforms do for you.</li>
</ol>

<h3>🧪 Lab 10.3</h3>
<div class="callout ok">
<ol>
<li>Add the <code>ci-xanh</code> job and run the IDOR mutation: confirm <code>image</code> is skipped and <code>ci-xanh</code> is red.</li>
<li>Build the local gate: <code>git remote add cong "$(bash scripts/cong-main/dung-cong.sh /tmp/cong)"</code>, push a green <code>main</code>, then a red one, then <code>git push -f</code> of a rewritten history, then <code>git push cong :main</code>.</li>
<li>If you have a GitHub repo: create the ruleset of section 1, open a PR with the IDOR change, and screenshot the disabled merge button. Then try to push to <code>main</code> directly.</li>
<li>Rename the job <code>check</code> to <code>lint</code> on a branch: what happens to a ruleset that required <code>check</code>?</li>
</ol>
<p><strong>Done when:</strong> a red commit cannot reach <code>main</code> by any route you can think of (PR, direct push, force push, deletion), and a green one can only via a PR.</p>
</div>
<details><summary>Solution</summary>
<p>Step 4: the PR shows <code>check</code> as "Expected — Waiting for status to be reported" and cannot be merged — another reason to require only <code>ci-xanh</code>, whose name never changes.</p>
</details>

<div class="kv-grid">
  <div class="kv"><span class="k">ruleset</span><span class="v">Named set of rules on branches/tags; the newer branch protection.</span></div>
  <div class="kv"><span class="k">required check</span><span class="v">A check name that must be successful on the PR's latest commit.</span></div>
  <div class="kv"><span class="k">aggregate job</span><span class="v">if: always() + needs: all jobs; red unless all succeed.</span></div>
  <div class="kv"><span class="k">bypass</span><span class="v">Who may ignore the rules; keep it empty.</span></div>
  <div class="kv"><span class="k">pre-receive</span><span class="v">Server-side git hook; non-zero exit rejects the push.</span></div>
  <div class="kv"><span class="k">expected source</span><span class="v">The app allowed to set a required check.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A check only blocks when a rule requires it.</li>
<li>Ruleset on main: PR + review, required ci-xanh, up to date, no force push, no deletion, no bypass.</li>
<li>Skipped = passed; names must match; no path filters on required workflows.</li>
<li>The server-side mechanism is a pre-receive hook — demonstrated for real.</li>
<li>Pin the expected source so nobody can paint a green tick.</li>
</ul>
${NGUON}
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bảo vệ nhánh</span>
<h2>Check đỏ mà không chặn thì chỉ là lời khuyên</h2>
<p class="lead">Sau 10.1 và 10.2, PR nào cũng có ✅ hoặc ❌. Không có gì ngăn ai đó bấm "Merge" lên ❌ lúc 11 giờ đêm trước buổi demo, hay push thẳng lên <code>main</code>. Bảo vệ nhánh biến kết quả CI thành một luật do máy chủ thi hành — với tất cả mọi người, kể cả chủ repo.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">mở PR</span><span class="lz-d">push thẳng lên main bị từ chối</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">check</span><span class="lz-d">ci-xanh phải success trên commit MỚI NHẤT của PR</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">review</span><span class="lz-d">một người duyệt; push mới làm mất duyệt cũ</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">merge</span><span class="lz-d">nút chỉ sáng lúc này; không force push, không xoá, không ai vượt</span></div>
</div>

<h3>1. Trên GitHub: một ruleset cho <code>main</code></h3>
<p>Settings → <strong>Rules → Rulesets → New branch ruleset</strong>. Target: nhánh mặc định. Enforcement: Active. Rồi tick:</p>
<ul>
<li><strong>Restrict deletions</strong> và <strong>Block force pushes</strong> — không ai viết lại hay xoá lịch sử chung.</li>
<li><strong>Require a pull request before merging</strong> — 1 người duyệt, <em>dismiss stale approvals when new commits are pushed</em> (không thì "duyệt xong, push thứ khác" vẫn lọt).</li>
<li><strong>Require status checks to pass</strong> — thêm <code>ci-xanh</code>, chọn nguồn <em>GitHub Actions</em>, và tick <em>require branches to be up to date before merging</em>.</li>
<li><strong>Danh sách bypass: để trống.</strong> Với branch protection kiểu cũ, tương đương là "Do not allow bypassing the above settings": theo Docs, mặc định luật <em>không áp dụng cho người có quyền admin</em> — mà repo của sinh viên thì admin chính là bạn.</li>
</ul>
<p>Ruleset là dạng mới của branch protection: nhiều bộ áp cùng lúc được, ai có quyền đọc repo cũng đọc được luật, và <code>gh ruleset check main</code> liệt kê luật nào đang áp lên một nhánh. Kiểu cũ "Branches → Add rule" làm cùng việc; chọn một kiểu, đừng trộn trên cùng nhánh. Các thiết lập này <strong>không</strong> được bấm thật trong khoá (không dùng tài khoản GitHub nào); chúng lấy từ GitHub Docs, liên kết ở cuối bài.</p>

<h3>2. Bắt buộc check nào — ba cái bẫy</h3>
<p><strong>Bẫy 1 — tên.</strong> Check bắt buộc được so theo <em>tên</em>: <code>name:</code> của job, và với matrix là <code>image (api)</code>, <code>image (web)</code>… Đổi tên job là luật chờ mãi một check không bao giờ báo về ("Expected — Waiting for status to be reported"). Docs thêm: check phải từng chạy thành công trong repo trong bảy ngày qua thì mới chọn được.</p>
<p><strong>Bẫy 2 — bị bỏ qua được tính là đạt.</strong> Theo Docs: <em>"Successful check statuses are success, skipped, and neutral"</em>, và khi <em>"một job phụ thuộc vào job hỏng, job phụ thuộc bị bỏ qua và có thể không chặn merge"</em>. Nếu ta chỉ bắt buộc <code>image</code>: test đỏ ⇒ <code>image</code> bị bỏ qua ⇒ bỏ qua là "thành công" ⇒ cho merge. Lượt chạy đúng tình huống đó của ta (đột biến IDOR của 10.1):</p>
<div class="out">${BO_QUA}</div>
<p>Vì thế có một job tổng <em>luôn</em> chạy và đỏ trừ khi mọi job trước nó đều <code>success</code>:</p>
<pre><code class="language-yaml">${CI_TONG}</code></pre>
<p>Một cái tên bắt buộc duy nhất (<code>ci-xanh</code>) không bao giờ đổi, dù sau này thêm bao nhiêu job: thêm job mới vào <code>needs:</code> là luật tự theo.</p>
<p><strong>Bẫy 3 — lọc theo đường dẫn.</strong> Nếu workflow có <code>on: pull_request: paths: ['apps/**']</code>, một PR chỉ sửa README sẽ không khởi động nó, và check bắt buộc nằm mãi ở <em>Pending</em> — chặn vĩnh viễn. Workflow bắt buộc thì đừng lọc; muốn bỏ bớt việc thì bỏ <em>bên trong</em> job.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — "up to date" không phải đa nghi.</strong> Check của PR chạy trên một bản ghép tạm của PR vào <code>main</code> <em>ở thời điểm đó</em>. PR A đổi tên một hàm, PR B thêm một lời gọi tên cũ; mỗi cái đứng riêng đều xanh, merge cả hai ⇒ <code>main</code> đỏ. "Require branches to be up to date" buộc B rebase lên A và chạy lại. Repo đông người thì merge queue làm việc đó tự động.</p></div>

<h3>3. Chạy thật, không cần GitHub: một máy chủ biết nói "không"</h3>
<p>Bảo vệ nhánh chỉ là <em>máy chủ</em> từ chối cập nhật <code>refs/heads/main</code>. Git có quyền đó từ xưa: hook <code>pre-receive</code> trong repo mà bạn push <em>tới</em> chạy trước khi bất kỳ ref nào dịch chuyển, và thoát khác 0 là từ chối cả lượt push. ChiaSe kèm một hook nhỏ trong <code>scripts/cong-main/</code>:</p>
<pre><code class="language-bash">${HOOK}</code></pre>
<pre><code class="language-bash">${DUNG}</code></pre>
<p>Một phiên thật — repo trần đóng vai "GitHub", một commit xanh, rồi đột biến IDOR, rồi hai lần định lách:</p>
<div class="out">${CONG}</div>
<p>Mỗi dòng ứng với một công tắc của ruleset: CI đỏ ⇒ <em>require status checks</em>; "force push — không nối tiếp main" ⇒ <em>block force pushes</em>; "từ chối xoá main" ⇒ <em>restrict deletions</em>; <code>tinh-nang</code> được nhận ⇒ chỉ <code>main</code> được bảo vệ. Bản đầu của hook dựa vào <code>receive.denyNonFastForwards</code>/<code>denyDeletes</code> cho hai việc sau — và Checkpoint 10 bắt được rằng git chỉ xét hai thiết lập đó <em>sau</em> hook pre-receive, nên hook đã chạy CI cho cả một lệnh xoá (bài 10.4 in log). Giờ hook tự từ chối cả hai trường hợp, trước mọi CI; thiết lập git giữ làm lớp thứ hai. Thứ hook không cho được là bước review và nút merge — phần GitHub thêm vào. GitLab, Gitea, Bitbucket có đúng ba công tắc này dưới tên khác; hiểu cái hook là hiểu tất cả.</p>

<div class="pitfall co-tieu-de"><p><strong>Góc hacker — dấu tích xanh ai cũng tô được.</strong> Một "check" chỉ là một trạng thái có tên gắn vào commit. Bất kỳ tích hợp nào có quyền ghi trạng thái đều đăng được một cái tên <code>ci-xanh</code> với trạng thái <code>success</code>, mặc kệ workflow của bạn nói gì. GitHub Docs mô tả cách phòng: chọn ứng dụng <em>nguồn dự kiến</em> cho từng check bắt buộc (ở đây: GitHub Actions); khi đó "Required status check … was not set by the expected GitHub App" và merge bị từ chối. Cùng họ: chỉ con người được duyệt PR (thiết lập cho phép GitHub Actions tạo và duyệt pull request để tắt), và đừng bao giờ cho token CI <code>pull-requests: write</code> nếu không có job thật sự cần.</p></div>

${spring(false, 'Dự án Spring không khác gì: luật bảo vệ main, check bắt buộc là tên job tổng của bạn (ví dụ job chạy mvn -B verify).', [
  ['sb-17-3-github-actions-spring', 'Spring Boot 17.3 — CI với GitHub Actions'],
])}

<h3>Liên hệ đời thường</h3>
<p>Két ngân hàng có khoá hẹn giờ và hai chìa: giám đốc dù đáng tin cỡ nào cũng không tự mở một mình lúc nửa đêm. Bảo vệ nhánh là cái khoá đó cho <code>main</code>. Không phải vì nghi ngờ bạn; mà vì cái đêm bạn mệt.</p>

<h3>Tình huống đi làm thật</h3>
<p>Ở đội outsourcing, repo của khách thường đã có sẵn các luật này, và người mới phát hiện ra khi push lên <code>main</code> bị từ chối. Cách phản ứng đúng là tạo nhánh + PR, không bao giờ nhờ admin "tắt một phút". Nếu bạn dựng repo cho nhóm SWP391, đặt ruleset ngay ngày đầu: bốn người cùng push lên <code>main</code> hai ngày trước demo là cách một bản dựng đang chạy biến mất.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Làm sao chặn mã hỏng vào main?"</strong> — Nhánh được bảo vệ: PR + review, check CI bắt buộc trên commit mới nhất, không force push, không ai vượt.</li>
<li><strong>"Sao dùng một check tổng thay vì bắt buộc từng job?"</strong> — Job bị bỏ qua tính là đạt, và tên job hay đổi; một job <code>if: always()</code> có <code>needs:</code> sửa được cả hai.</li>
<li><strong>"'Require branches to be up to date' chống được gì?"</strong> — Hai PR đứng riêng thì xanh, gộp lại thì đỏ.</li>
<li><strong>"Admin có merge được PR đỏ không?"</strong> — Với branch protection kiểu cũ thì mặc định là có; phải tắt bypass rõ ràng.</li>
<li><strong>"Trên máy chủ git tự dựng thì thi hành thế nào?"</strong> — Hook <code>pre-receive</code> từ chối xoá và cập nhật không nối tiếp rồi chạy CI, cộng <code>receive.denyNonFastForwards</code>/<code>denyDeletes</code> làm lớp thứ hai — đúng thứ các nền tảng làm hộ bạn.</li>
</ol>

<h3>🧪 Lab 10.3</h3>
<div class="callout ok">
<ol>
<li>Thêm job <code>ci-xanh</code> rồi chạy đột biến IDOR: xác nhận <code>image</code> bị bỏ qua và <code>ci-xanh</code> đỏ.</li>
<li>Dựng cổng cục bộ: <code>git remote add cong "$(bash scripts/cong-main/dung-cong.sh /tmp/cong)"</code>, push một <code>main</code> xanh, rồi một cái đỏ, rồi <code>git push -f</code> một lịch sử viết lại, rồi <code>git push cong :main</code>.</li>
<li>Nếu có repo GitHub: tạo ruleset như mục 1, mở PR chứa thay đổi IDOR, chụp nút merge bị khoá. Rồi thử push thẳng lên <code>main</code>.</li>
<li>Đổi tên job <code>check</code> thành <code>lint</code> trên một nhánh: một ruleset đang bắt buộc <code>check</code> sẽ ra sao?</li>
</ol>
<p><strong>Xong khi:</strong> một commit đỏ không vào được <code>main</code> bằng bất kỳ đường nào bạn nghĩ ra (PR, push thẳng, force push, xoá), còn commit xanh chỉ vào được qua PR.</p>
</div>
<details><summary>Lời giải</summary>
<p>Bước 4: PR hiện <code>check</code> là "Expected — Waiting for status to be reported" và không merge được — thêm một lý do để chỉ bắt buộc <code>ci-xanh</code>, cái tên không bao giờ đổi.</p>
</details>

<div class="kv-grid">
  <div class="kv"><span class="k">ruleset</span><span class="v">Bộ luật có tên trên nhánh/tag; dạng mới của branch protection.</span></div>
  <div class="kv"><span class="k">check bắt buộc</span><span class="v">Tên check phải thành công trên commit mới nhất của PR.</span></div>
  <div class="kv"><span class="k">job tổng</span><span class="v">if: always() + needs: mọi job; đỏ trừ khi tất cả thành công.</span></div>
  <div class="kv"><span class="k">bypass</span><span class="v">Ai được phép phớt lờ luật; để trống.</span></div>
  <div class="kv"><span class="k">pre-receive</span><span class="v">Hook git phía máy chủ; thoát khác 0 là từ chối push.</span></div>
  <div class="kv"><span class="k">nguồn dự kiến</span><span class="v">Ứng dụng duy nhất được đặt một check bắt buộc.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Check chỉ chặn khi có luật bắt buộc nó.</li>
<li>Ruleset cho main: PR + review, bắt buộc ci-xanh, up to date, cấm force push, cấm xoá, không bypass.</li>
<li>Bỏ qua = đạt; tên phải khớp; workflow bắt buộc không lọc paths.</li>
<li>Cơ chế phía máy chủ là hook pre-receive — đã chạy thật.</li>
<li>Ghim nguồn dự kiến để không ai tô được dấu tích xanh.</li>
</ul>
${NGUON}
${THE}
</div>
`,
};
