import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 14 (MỚI, 09/2026): Cổng chất lượng, bảo mật chuỗi cung ứng & phát hành.
 * Nối tiếp 3.1 (ranh giới biểu thức / injection), 4.2 (ghim SHA, tj-actions), 6.x (token, OIDC, zizmor), 12.4 (Dependabot
 * github-actions) — KHÔNG lặp lại, chỉ dẫn lại rồi đi tiếp.
 * Mọi log là run THẬT 24/09/2026 (UTC 23:49–23:56) trên sân tập công khai github.com/cuonghoang1103/ga-san-tap,
 * nhánh ch14-chat-luong (+ PR #5–#9), ch14-phat-hanh, ch14-mono (runner 2.337.0, ubuntu-24.04 image 20260920.314.1).
 * Docs kiểm từ mã nguồn github/docs (commit f71cc2a và d5e9a63, 24/09/2026). actionlint 1.7.12 · zizmor 1.30.1 ·
 * CodeQL 2.27.1 · semantic-release 25.0.9 · dorny/paths-filter v4.0.3 · actions/attest v4.2.2.
 */

const RUN = (id, t) => `<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/${id}" target="_blank" rel="noopener">${t || id}</a>`;
const PR = (n) => `<a href="https://github.com/cuonghoang1103/ga-san-tap/pull/${n}" target="_blank" rel="noopener">PR #${n}</a>`;

export default {
  title: 'Chapter 14 — Quality gates, supply-chain security & releases|||Chương 14 — Cổng chất lượng, bảo mật chuỗi cung ứng & phát hành',
  slug: 'ga-ch14-chat-luong-phat-hanh',
  description: 'Check bắt buộc, job tổng hợp, ruleset và merge queue; pull_request_target, injection, actionlint/zizmor/CodeQL, Dependabot; release tự động, GHCR, npm và attestation; CI cho monorepo — mọi hành vi chạy thật trên sân tập: job tổng hợp thiếu always() bị skip ngay cả khi mọi thứ xanh, paths-filter so với nhánh mặc định, notes tự sinh so với thẻ của dòng khác, sửa một byte là mất bằng chứng.',
  sortOrder: 15,
  lessons: [

    /* ─────────────────────────── 14.0 ─────────────────────────── */
    {
      title: '14.0 — Chapter 14 slides: quality gates, supply chain and releases in pictures|||14.0 — Slide Chương 14: cổng chất lượng, chuỗi cung ứng và phát hành bằng hình',
      slug: 'ga-14-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 29 slide của Chương 14: check bắt buộc là tên job, job tổng hợp bị skip vẫn tính là đạt, paths làm check treo, ruleset và merge queue, pull_request_target, tiêm lệnh qua tiêu đề PR, ba máy quét tĩnh, SARIF, Dependabot và dependency review, hai cách đánh số bản, GHCR và attestation, paths-filter so với git diff, ma trận động và một check duy nhất cho monorepo.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Slides</span>
<h2>The whole chapter in 29 slides</h2>
<p class="lead">Up to now the course has asked "does the pipeline run, and run fast?". This chapter asks the question a team lead asks before trusting it: can a red check actually stop a merge, can a stranger make the pipeline run their commands, and can a user prove that the image they pulled was built by your workflow from your commit? Skim the slides first; come back after the quiz.</p>
<p>Slides 3–8 belong to Lesson 14.1 (quality gates), 9–15 to 14.2 (supply-chain security), 16–21 to 14.3 (releases, GHCR and attestations) and 22–26 to 14.4 (CI for a monorepo). The last three are the chapter&#39;s common mistakes, a cheat sheet and a 60-minute practice session. Every log is real: recorded on 24 September 2026 on GitHub-hosted runners (runner 2.337.0, <code>ubuntu-24.04</code>) in the public sandbox <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch14-chat-luong" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, branches <code>ch14-chat-luong</code>, <code>ch14-phat-hanh</code> and <code>ch14-mono</code>, plus five pull requests (#5–#9). Four results surprise most people who have only read about these features — a "summary" job that is skipped even when everything is green, a popular action that compares against the wrong branch, auto-generated release notes that compare against another tool&#39;s tag, and a one-byte change that makes a signed artifact unverifiable — and each slide names the run that proves it. Three things could not be switched on from the build session (rulesets, the dependency graph, Dependabot on the default branch); the lessons say so plainly and give you the exact steps to run them yourself.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Slide</span>
<h2>Cả chương trong 29 slide</h2>
<p class="lead">Tới giờ khoá học hỏi "pipeline có chạy không, có nhanh không?". Chương này hỏi câu mà trưởng nhóm hỏi trước khi dám tin nó: một check đỏ có thật sự chặn được việc merge không, người lạ có khiến pipeline chạy lệnh của họ được không, và người dùng có chứng minh được cái ảnh họ vừa kéo về là do workflow của bạn dựng từ commit của bạn không? Lướt slide trước; làm xong bài kiểm tra thì quay lại ôn.</p>
<p>Slide 3–8 thuộc Bài 14.1 (cổng chất lượng), 9–15 thuộc 14.2 (bảo mật chuỗi cung ứng), 16–21 thuộc 14.3 (phát hành, GHCR và attestation), 22–26 thuộc 14.4 (CI cho monorepo). Ba slide cuối là sai lầm hay gặp, bảng tra nhanh và một buổi thực hành 60 phút. Mọi log đều THẬT: ghi ngày 24/09/2026 trên runner của GitHub (runner 2.337.0, <code>ubuntu-24.04</code>) trong kho sân tập công khai <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch14-chat-luong" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, các nhánh <code>ch14-chat-luong</code>, <code>ch14-phat-hanh</code>, <code>ch14-mono</code>, cùng năm pull request (#5–#9). Có bốn kết quả làm bất ngờ hầu hết những ai mới chỉ đọc về các tính năng này — một job "tổng hợp" bị skip ngay cả khi mọi thứ xanh, một action rất phổ biến so sánh với nhầm nhánh, release notes tự sinh so với thẻ của một công cụ khác, và sửa đúng một byte là một sản phẩm đã ký trở thành không kiểm chứng được — slide nào cũng ghi run chứng minh. Có ba thứ phiên dựng bài không bật được (ruleset, dependency graph, Dependabot ở nhánh mặc định); bài học nói thẳng điều đó và đưa bạn đúng các bước để tự chạy.</p>
</div>
${gallery('ga-14', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Check bắt buộc là tên job'], [4, 'Job tổng hợp thiếu always() bị skip'], [5, 'cong-tong đọc needs'],
  [6, 'paths làm check bắt buộc treo'], [7, 'Branch protection, ruleset, merge queue'], [8, 'Ba tầng kiểm'],
  [9, 'pull_request vs pull_request_target'], [10, 'Tiêm lệnh qua tiêu đề PR'], [11, 'Ba máy quét tĩnh'],
  [12, 'SARIF và code scanning'], [13, 'Dependabot và dependency review'], [14, 'Secret scanning và push protection'],
  [15, 'Phòng thủ nhiều lớp'],
  [16, 'Hai cách đánh số bản'], [17, 'semantic-release từ trong log'], [18, 'Notes tự sinh so với thẻ dòng khác'],
  [19, 'GHCR bằng GITHUB_TOKEN'], [20, 'Attestation đi qua đâu'], [21, 'Sửa một byte, và gói npm'],
  [22, 'api-backend là monorepo'], [23, 'paths-filter so với git diff'], [24, 'Ma trận động và mảng rỗng'],
  [25, 'Một check bắt buộc cho monorepo'], [26, 'Áp vào ci-lint.yml'],
  [27, 'Sai lầm hay gặp'], [28, 'Bảng tra nhanh'], [29, 'Thực hành chương 14'],
])}
`,
    },

    /* ─────────────────────────── 14.1 ─────────────────────────── */
    {
      title: '14.1 — Quality gates: required checks, the summary job, paths, rulesets and merge queues|||14.1 — Cổng chất lượng: check bắt buộc, job tổng hợp, paths, ruleset và merge queue',
      slug: 'ga-14-1-cong-chat-luong',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Một check đỏ chỉ chặn được merge khi có luật đòi nó — và luật đòi theo TÊN JOB. Đo thật trên năm PR: job tổng hợp thiếu always() bị skip cả khi mọi thứ xanh (và skip được tính là đạt), paths ở mức workflow khiến check bắt buộc treo, hai check trùng tên; rồi ruleset, merge queue và ba tầng kiểm theo thời gian.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1</span>
<h2>Quality gates: required checks, the summary job, paths, rulesets and merge queues</h2>
<p class="lead">A red check does not stop anything by itself. It stops a merge only when a rule on the target branch says "this named check must pass" — and the name it matches is a job name, not a workflow, not a file. Almost every broken quality gate in real repositories is a mismatch between what the rule asks for and what the pipeline actually reports.</p>

<p>Chapter 1 showed which events start a workflow; Chapter 8 showed how to read a red run. This lesson connects the two to the merge button. The sandbox branch <code>ch14-chat-luong</code> holds a small three-package project (backend, frontend, desktop — the same shape as api-backend) and a CI workflow, <code>ch14-cong.yml</code>, with three kinds of jobs: real checks, a job that is skipped unless a label is set, and two "summary" jobs written two different ways. Five pull requests were opened against that branch: one green (${PR(5)}), one with a failing test (${PR(6)}), one touching only documentation (${PR(7)}), and two used in Lesson 14.2. What each one showed is below.</p>

<h3>What a check is, and what a required check matches</h3>
${slide('ga-14', 3, 'A required check is matched by job name — PR #6 had two checks called “zizmor”')}
<p>Every job in every workflow that runs for a pull request becomes one <strong>check run</strong> on the pull request&#39;s head commit. Other tools add their own. The API listed twelve for ${PR(6)}:</p>
<div class="out">zizmor                        success   (code scanning, from an uploaded SARIF file)
cong-ngay-tho                 skipped
cong-tong                     failure
GitGuardian Security Checks   success   (a third-party app installed on the account)
e2e-dem                       skipped
lint                          success
test (24)                     failure
test (22)                     failure
actionlint                    failure
zizmor                        success   (a job in ch14-kiem-tinh.yml)
tieu-de                       success
xem-phu-thuoc                 failure</div>
<ul>
<li><strong>The name is the job&#39;s <code>name:</code></strong> (or its id when there is none), plus the matrix values in brackets: <code>test (22)</code>. A job inside a reusable workflow is named <code>caller / inner</code>, as Lesson 12.1 showed. The workflow&#39;s own name appears nowhere.</li>
<li><strong>Two checks can share a name.</strong> Here, <code>zizmor</code> is both a job and the code-scanning result that job uploaded. The docs are explicit: required status checks "do not take workflow, matrix, or event trigger types into account", and the branch-protection page advises making job names unique across all workflows because duplicates "can cause ambiguous status check results". If you required <code>zizmor</code>, you could not say which of the two you meant.</li>
<li><strong>Red is not blocked.</strong> The pull request object for ${PR(6)} reported <code>"mergeable_state": "unstable"</code>: some checks failed, but nothing required them, so the merge button stayed available. That is the state of every repository that has CI but no rule — including, today, api-backend&#39;s <code>main</code>.</li>
</ul>
<p>Rulesets add one defence against name collisions: when you add a required check you can pick an <em>expected source</em>, a GitHub App (GitHub Actions is one) that must be the one reporting it. A job in some other tool that happens to be called <code>lint</code> then cannot satisfy the rule.</p>

<h3>The summary job, and why the obvious version lies</h3>
${slide('ga-14', 4, 'A summary job without always() is skipped — and skipped counts as passing')}
<p>Requiring every job by name is fragile: rename a job, add a Node version to a matrix, or split a job in two, and the rule silently asks for a check that no longer exists. The usual answer is one <strong>summary job</strong> that <code>needs</code> all the others, and a rule that requires only that one. The sandbox wrote it the obvious way first:</p>
<pre><code class="language-yaml">  e2e-dem:
    if: contains(github.event.pull_request.labels.*.name, 'can-e2e')   # skipped unless labelled
    runs-on: ubuntu-24.04
    steps:
      - run: echo "e2e gia lap"

  cong-ngay-tho:              # the obvious summary job
    needs: [lint, test, e2e-dem]
    runs-on: ubuntu-24.04
    steps:
      - run: echo "moi thu deu xanh?"</code></pre>
<p>Results, straight from the jobs API:</p>
<table>
<thead><tr><th>Pull request</th><th>lint</th><th>test (22) / (24)</th><th>e2e-dem</th><th>cong-ngay-tho</th><th>cong-tong</th></tr></thead>
<tbody>
<tr><td>${PR(5)} — green (${RUN(36074689448, 'run')})</td><td>success</td><td>success / success</td><td>skipped</td><td><strong>skipped</strong></td><td>success</td></tr>
<tr><td>${PR(6)} — failing test (${RUN(36074691713, 'run')})</td><td>success</td><td>failure / failure</td><td>skipped</td><td><strong>skipped</strong></td><td>failure</td></tr>
</tbody>
</table>
<p>The obvious summary job was <strong>skipped in both pull requests</strong> — not because a test failed, but because one of the jobs it needs (<code>e2e-dem</code>) was skipped. A job whose dependency did not succeed is skipped unless its <code>if:</code> says otherwise, and "skipped" is not "failed". Then the docs deliver the second half of the trap: "A job that is skipped will report its status as <em>Success</em>. It will not prevent a pull request from merging, even if it is a required check." Make <code>cong-ngay-tho</code> the required check and ${PR(6)}, with two red test jobs, is mergeable. The gate is decoration.</p>

<div class="pitfall co-tieu-de"><strong>Trap — a summary job that can never fail.</strong> A summary job without <code>if: always()</code> has only two outcomes: success (everything it needs succeeded) or skipped (anything else). Skipped reports as success to branch protection. So the job is green or "green". Search your repository for jobs that <code>needs</code> several others and have no <code>if:</code>; if one of them is a required check, your gate is open.</div>

<h3>A summary job that tells the truth</h3>
${slide('ga-14', 5, 'cong-tong always runs, reads needs, and fails only on failure or cancelled')}
<p>The second summary job always runs and decides for itself:</p>
<pre><code class="language-yaml">  cong-tong:
    if: always()                          # run even when a dependency failed or was skipped
    needs: [lint, test, e2e-dem]
    runs-on: ubuntu-24.04
    steps:
      - name: Doc ket qua cac job
        env:
          KQ: &#36;{{ toJSON(needs) }}          # every dependency&#39;s result, as JSON
        run: |
          echo "$KQ" | jq -r 'to_entries[] | "\\(.key) = \\(.value.result)"'
          if echo "$KQ" | jq -e 'any(.[]; .result == "failure" or .result == "cancelled")' &gt; /dev/null; then
            echo "::error title=cong-tong::co job do hoac bi huy"
            exit 1
          fi</code></pre>
<p>In ${PR(6)} (${RUN(36074691713)}) it printed exactly what it saw and failed:</p>
<div class="out">KQ: {
  "lint":    { "result": "success", "outputs": {} },
  "test":    { "result": "failure", "outputs": {} },
  "e2e-dem": { "result": "skipped", "outputs": {} }
}
lint = success
test = failure
e2e-dem = skipped
##[error]co job do hoac bi huy
##[error]Process completed with exit code 1.</div>
<p>In ${PR(5)} the same job printed "khong co job nao do (skipped duoc tinh la dat)" and passed. Three details make this version correct:</p>
<ul>
<li><strong><code>needs.test.result</code> is one value for the whole matrix.</strong> Two matrix jobs failed; <code>needs</code> shows a single <code>failure</code>. You do not have to list <code>test (22)</code> and <code>test (24)</code>, and adding Node 26 later does not touch the rule.</li>
<li><strong>Skipped is treated as acceptable on purpose.</strong> <code>e2e-dem</code> is skipped whenever the label is absent; treating that as a failure would block every normal pull request. If a job must <em>run</em> — not merely not fail — check for <code>success</code> explicitly for that one job.</li>
<li><strong><code>cancelled</code> counts as a failure.</strong> A job killed by <code>timeout-minutes</code> or by a newer push (the <code>concurrency</code> block at the top of the file) must not turn into a green gate.</li>
</ul>
<p>A shorter form you will see in many repositories uses the expression functions instead of <code>jq</code>: <code>if: always() &amp;&amp; (contains(needs.*.result, 'failure') || contains(needs.*.result, 'cancelled'))</code> on a step that runs <code>exit 1</code>. It is equivalent; the <code>jq</code> version prints a readable table, which is what you want when the gate is red and someone asks why.</p>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: Your pipeline has fifteen jobs and a matrix. How do you make branch protection require "all of CI" without listing fifteen names?</strong><br>A: One summary job with <code>if: always()</code> and <code>needs</code> on every other job, which fails when any result is <code>failure</code> or <code>cancelled</code>; require only that job. Renaming or adding jobs then never breaks the rule.</p>
<p><strong>Q: A required check shows "Skipped" on a pull request whose tests are red. Can it be merged?</strong><br>A: Yes. GitHub reports a skipped job as success for required checks. That is exactly why a summary job needs <code>if: always()</code>: without it, a failed dependency makes it skip instead of fail.</p>
</div>

<h3>Path filters, and the check that never arrives</h3>
${slide('ga-14', 6, 'paths on a workflow: no run means no report, and a required check waits forever')}
<p>Path filters save minutes: <code>ch14-paths.yml</code> runs the backend tests only when a pull request touches <code>ch14/backend/**</code>.</p>
<pre><code class="language-yaml">on:
  pull_request:
    branches: [ch14-chat-luong]
    paths: ['ch14/backend/**']
jobs:
  backend-test:
    runs-on: ubuntu-24.04
    steps: [ ... npm test in ch14/backend ... ]</code></pre>
<p>${PR(5)} changed <code>ch14/backend/src/lich.js</code> and got a run (${RUN(36074689474)}). ${PR(7)} changed only <code>ch14/docs/README.md</code>: the list of runs for that pull request contains <code>ch14-cong</code>, <code>ch14-tiem</code>, <code>ch14-kiem-tinh</code> and <code>ch14-phu-thuoc</code> — and no <code>ch14-paths</code> at all. Not skipped, not green: the workflow was never created, so its job never reported.</p>
<p>With no rule, nobody notices. With <code>backend-test</code> required, the docs describe what happens: "If a workflow is skipped due to path filtering, branch filtering or a commit message, then checks associated with that workflow will remain in a 'Pending' state. A pull request that requires those checks to be successful will be blocked from merging." In the pull request it reads "Expected — Waiting for status to be reported", and it waits forever. The same happens with <code>[skip ci]</code> in a commit message.</p>
<p>Three ways out, in order of how much to trust them:</p>
<ol>
<li><strong>Filter at the job level, not the workflow level.</strong> Let the workflow always start; decide inside it which jobs run (Lesson 14.4 builds this). A job skipped by its own <code>if:</code> reports success, which is exactly what "not affected" should mean.</li>
<li><strong>Require only the summary job</strong>, which always runs. Path-filtered jobs underneath it are free to be skipped.</li>
<li><strong>A twin workflow</strong> with the same job name and the opposite filter (<code>paths-ignore</code>) that does nothing and passes. It works, and it is the pattern GitHub itself documented for years, but two files must be kept in sync forever. Do not start here.</li>
</ol>
<p>api-backend is a live example of the split. Its <code>ci-lint.yml</code> has a <code>paths:</code> list on <code>push</code> (eleven patterns) but none on <code>pull_request</code>. So every pull request runs the full type check and every push to <code>main</code> that touches only, say, <code>desktop/</code> runs nothing. That is a reasonable choice today, when nothing is required. The day someone turns on a rule for <code>main</code>, the paths list is the first thing to move into the jobs.</p>

<h3>Branch protection, rulesets and merge queues: what exists where</h3>
${slide('ga-14', 7, 'Branch protection, rulesets and merge queues — availability in 09/2026')}
<p>There are two ways to attach rules to a branch, and they coexist.</p>
<table>
<thead><tr><th></th><th>Branch protection rule</th><th>Ruleset</th></tr></thead>
<tbody>
<tr><td>Public repository, Free plan</td><td>yes</td><td>yes</td></tr>
<tr><td>Private repository</td><td>Pro, Team, Enterprise</td><td>Pro, Team, Enterprise Cloud</td></tr>
<tr><td>Several apply to one branch</td><td>no — exactly one rule matches</td><td>yes — rules are aggregated, and where two versions of the same rule differ, "the most restrictive version of the rule applies"</td></tr>
<tr><td>Switch off without deleting</td><td>no</td><td>enforcement status Active / Disabled (Evaluate only on Enterprise)</td></tr>
<tr><td>Who can read the rules</td><td>admins</td><td>anyone with read access to the repository</td></tr>
<tr><td>Limit</td><td>—</td><td>75 rulesets per repository</td></tr>
</tbody>
</table>
<p>Inside either one, "Require status checks to pass" has two modes. <strong>Strict</strong> (the default, "Require branches to be up to date before merging") makes a pull request re-run CI after anyone else merges — safe, but it multiplies builds on a busy branch. <strong>Loose</strong> merges without being up to date, so two pull requests that are each green can break <code>main</code> together. On GitHub Enterprise Cloud, rulesets also offer "Do not require status checks on creation", so creating a new branch that matches the pattern is not blocked by checks that could not have run yet (the docs gate this option to Enterprise; a personal public repository does not show it).</p>
<p>The <strong>merge queue</strong> fixes the strict/loose dilemma: instead of asking every author to update and re-run, GitHub builds a temporary branch with the queued pull requests merged on top of <code>main</code>, runs the required checks there, and merges only if they pass. Two consequences for workflows:</p>
<ul>
<li>Workflows that report required checks must also trigger on <code>merge_group</code>; otherwise the queue waits for a check that never comes. That is why <code>ch14-cong.yml</code> lists <code>merge_group:</code> next to <code>pull_request</code>.</li>
<li>Availability is narrow: "any public repository owned by an organization, or private repositories owned by organizations using GitHub Enterprise Cloud". A personal repository — the sandbox, or <code>cuonghoang1103/api-backend</code> — cannot use it at all.</li>
</ul>
<div class="callout warn">
<p><strong>⏳ Not run on the cloud yet: switching a ruleset on.</strong> The sandbox is public and personal, so rulesets are available, but creating one needs the repository administrator (settings page or the rulesets API), and the build session had neither. Everything above about checks, skips and "unstable" was measured; the effect of a rule on the merge button is quoted from the docs. The exact steps to reproduce it are in "Run it step by step" below.</p>
</div>
<!-- CHAY-O-MAY: Trên kho ga-san-tap, Settings → Rules → Rulesets → New branch ruleset: tên "ch14-cong", Enforcement Active, target branch "ch14-chat-luong", bật "Require a pull request before merging" + "Require status checks to pass" với check "cong-tong" (nguồn GitHub Actions). Mở lại PR #6 (đang đóng) hoặc tạo PR mới làm đỏ test → chụp nút merge ("Merging is blocked"). Đổi check sang "cong-ngay-tho" → PR đỏ mà merge được (skipped = success). Thêm "backend-test" → PR #7 (chỉ sửa docs) hiện "Expected — Waiting for status to be reported". Xong thì Disable ruleset. Ghi run ID + ảnh vào bài 14.1. -->

<h3>Three tiers of checks: fast on every pull request, blocking at the queue, nightly and informative</h3>
${slide('ga-14', 8, 'Three tiers: the PR tier blocks, the queue tier blocks, the nightly tier reports')}
<p>A gate that takes forty minutes will be bypassed; a gate that checks nothing is worse. Most teams settle on tiers:</p>
<ul>
<li><strong>Every pull request</strong>: lint, type check, unit tests, the static security scanners of Lesson 14.2. Target: under ten minutes of critical path (Chapter 7 showed how to measure it). This tier is required.</li>
<li><strong>The merge queue</strong>, when you have one: the same checks, re-run on the merged result. It catches "green alone, red together".</li>
<li><strong>Nightly</strong> (<code>on: schedule</code>): long end-to-end suites, a wide matrix of operating systems and versions, full dependency and CodeQL scans. It blocks nothing; a red night opens an issue or pings a channel.</li>
</ul>
<p>Two facts from earlier chapters matter here. Scheduled workflows run on the default branch only, so a nightly job tests <code>main</code>, never a pull request. And Lesson 1.3 measured how late and how irregular <code>schedule</code> is — a nightly check is for trends, not for gating. The rule of thumb: if a failure should stop a merge, it belongs in the pull-request tier; if it should start a conversation, it belongs at night.</p>

<h3>Run it step by step: a gate on your own repository</h3>
<ol>
<li>In your CI workflow, add <code>name:</code> to every job so the check names are stable and unique across all workflows (<code>grep -h "^  [a-z-]*:$" .github/workflows/*.yml | sort | uniq -d</code> lists duplicate job ids).</li>
<li>Add the <code>cong-tong</code> job above (rename it, for example, <code>ci-xanh</code>) with <code>needs</code> on every other job in the file.</li>
<li>Push a branch, open a pull request, and confirm the new check appears with the name you expect.</li>
<li>Settings → Rules → Rulesets → New branch ruleset. Target <code>main</code>; enable "Require a pull request before merging" and "Require status checks to pass"; add <code>ci-xanh</code> with GitHub Actions as its source. Leave "Require branches to be up to date" on unless builds are slow.</li>
<li>Push a commit that breaks one test. The pull request should show "Merging is blocked"; <code>gh pr checks &lt;N&gt;</code> should list <code>ci-xanh</code> as failing.</li>
<li>If any workflow has <code>on.pull_request.paths</code>, open a pull request that does not match it and look for "Expected — Waiting" before you require anything from that workflow.</li>
</ol>

<h3>When to use each gate — and when not</h3>
<table>
<thead><tr><th>Tool</th><th>Use it when</th><th>Do not, when</th></tr></thead>
<tbody>
<tr><td>Required check on each job</td><td>a small repository with two or three stable jobs</td><td>matrices or jobs that are renamed; the rule breaks silently</td></tr>
<tr><td>Summary job (<code>if: always()</code>)</td><td>almost always — it is the one name the rule depends on</td><td>never without <code>always()</code>; that version cannot fail</td></tr>
<tr><td><code>on.*.paths</code></td><td>workflows that nothing requires (a docs site build, a desktop release)</td><td>any workflow that reports a required check</td></tr>
<tr><td>Strict "up to date"</td><td>low traffic, fast CI</td><td>ten merges a day and twenty-minute CI — use a merge queue if you can</td></tr>
<tr><td>Merge queue</td><td>organisation repositories with many merges a day</td><td>personal repositories (not available)</td></tr>
</tbody>
</table>

<div class="callout">
<p><strong>Common interview question.</strong></p>
<p><strong>Q: A monorepo uses path filters so each team&#39;s workflow runs only for its folder. After branch protection is enabled, pull requests that touch only documentation cannot be merged. Why, and how do you fix it?</strong><br>A: A workflow skipped by path filtering never creates its check, so a required check stays "Expected — Waiting" forever. Move the filtering into the jobs (skipped jobs report success) or require only a summary job that always runs.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your repository has CI but nothing stops a red pull request from being merged. Build the gate, then try to break it.</p><ol>
<li>Add two summary jobs to your CI: one without <code>if:</code>, one with <code>if: always()</code> reading <code>toJSON(needs)</code>, and a job that is skipped unless a label is present.</li>
<li>Open a pull request that breaks one test. Before looking, write down the conclusion you expect for each summary job.</li>
<li>Create a ruleset on a test branch that requires the <code>always()</code> version; check that the merge button is blocked.</li>
<li>Change the ruleset to require the other summary job instead and look at the merge button again. Then switch it back.</li>
</ol><p><strong>Done when:</strong> you can show the check list of the pull request with one summary job <code>skipped</code> and the other <code>failure</code>; the pull request shows "Merging is blocked" with the correct rule; and you can explain in one sentence why the other rule let a red pull request through.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">check run</span><span class="v">one reported result on a commit — every job of every triggered workflow is one; apps and code scanning add more</span></div>
<div class="kv"><span class="k">required status check</span><span class="v">a check name a rule demands to pass before merging; matched by name, not by workflow or event</span></div>
<div class="kv"><span class="k">summary job</span><span class="v">a job that <code>needs</code> all others and turns their results into one required check</span></div>
<div class="kv"><span class="k"><code>mergeable_state: unstable</code></span><span class="v">some checks failed but none is required — the merge button still works</span></div>
<div class="kv"><span class="k">ruleset</span><span class="v">a named, layerable set of branch or tag rules; several can apply and the strictest wins</span></div>
<div class="kv"><span class="k">strict / loose checks</span><span class="v">whether a pull request must be up to date with its base before merging</span></div>
<div class="kv"><span class="k">merge queue / <code>merge_group</code></span><span class="v">GitHub tests queued pull requests merged together; workflows must listen to <code>merge_group</code></span></div>
<div class="kv"><span class="k">Expected — Waiting</span><span class="v">a required check that no workflow reported, typically because of <code>paths</code> or <code>[skip ci]</code></span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A red check blocks nothing until a rule requires it, and the rule matches the job name — keep job names unique across workflows.</li>
<li>A summary job without <code>if: always()</code> is skipped whenever anything it needs is skipped or fails; skipped reports as success. Measured: skipped in both the green and the red pull request.</li>
<li>The correct summary job always runs, reads <code>toJSON(needs)</code>, and fails on <code>failure</code> or <code>cancelled</code>.</li>
<li><code>paths</code> on a workflow means no run, no check, and a required check that waits forever; filter inside jobs instead.</li>
<li>Rulesets layer (strictest wins), can be disabled and are readable by everyone; merge queues need an organisation and <code>merge_group</code>.</li>
<li>Fast checks gate every pull request; long checks run at night on the default branch and only report.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Control jobs with conditions</span><span class="lc-sub">docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-jobs-with-conditions — "A job that is skipped will report its status as Success … even if it is a required check."</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: paths and paths-ignore</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax — the "Pending" note for workflows skipped by path, branch or commit-message filters.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About rulesets; Available rules for rulesets; Troubleshooting rules</span><span class="lc-sub">docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets — layering, enforcement statuses, strict vs loose checks, expected source, check-name format.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Managing a merge queue</span><span class="lc-sub">docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue — availability, <code>merge_group</code>, build concurrency and merge limits.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sandbox — branch ch14-chat-luong and pull requests #5–#7</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch14-chat-luong — <code>ch14-cong.yml</code>, <code>ch14-paths.yml</code> and the runs quoted in this lesson.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1</span>
<h2>Cổng chất lượng: check bắt buộc, job tổng hợp, paths, ruleset và merge queue</h2>
<p class="lead">Một check đỏ tự nó không chặn được gì. Nó chỉ chặn việc merge khi trên nhánh đích có một luật nói "check tên này phải qua" — và cái tên luật đem ra so là tên JOB, không phải tên workflow, không phải tên tệp. Gần như mọi cổng chất lượng hỏng trong kho thật đều là chuyện lệch giữa thứ luật đòi và thứ pipeline thật sự báo về.</p>

<p>Chương 1 đã chỉ ra sự kiện nào khởi động workflow; Chương 8 dạy đọc một run đỏ. Bài này nối hai thứ đó vào nút merge. Nhánh sân tập <code>ch14-chat-luong</code> chứa một dự án nhỏ ba gói (backend, frontend, desktop — đúng hình dạng của api-backend) và một workflow CI, <code>ch14-cong.yml</code>, có ba loại job: các phép kiểm thật, một job bị skip trừ khi PR có nhãn, và hai job "tổng hợp" viết theo hai cách khác nhau. Năm pull request được mở vào nhánh đó: một PR xanh (${PR(5)}), một PR làm hỏng test (${PR(6)}), một PR chỉ sửa tài liệu (${PR(7)}), và hai PR dùng ở Bài 14.2. Mỗi PR cho thấy gì, xem dưới đây.</p>

<h3>Check là gì, và một check bắt buộc được so bằng gì</h3>
${slide('ga-14', 3, 'Check bắt buộc so theo tên job — PR #6 có hai check tên “zizmor”')}
<p>Mọi job của mọi workflow chạy cho một pull request đều thành một <strong>check run</strong> (một kết quả được báo) trên commit đầu của PR. Các công cụ khác thêm check của riêng chúng. API liệt kê mười hai check cho ${PR(6)}:</p>
<div class="out">zizmor                        success   (code scanning, từ tệp SARIF được tải lên)
cong-ngay-tho                 skipped
cong-tong                     failure
GitGuardian Security Checks   success   (một app bên thứ ba cài trên tài khoản)
e2e-dem                       skipped
lint                          success
test (24)                     failure
test (22)                     failure
actionlint                    failure
zizmor                        success   (một job trong ch14-kiem-tinh.yml)
tieu-de                       success
xem-phu-thuoc                 failure</div>
<ul>
<li><strong>Tên là <code>name:</code> của job</strong> (không có thì là id của job), cộng giá trị ma trận trong ngoặc: <code>test (22)</code>. Job nằm trong reusable workflow tên là <code>bên-gọi / bên-trong</code>, như Bài 12.1 đã thấy. Tên của workflow không xuất hiện ở đâu cả.</li>
<li><strong>Hai check có thể trùng tên.</strong> Ở đây <code>zizmor</code> vừa là một job, vừa là kết quả code scanning mà job đó tải lên. Docs nói rõ: check bắt buộc "không tính tới loại workflow, ma trận hay sự kiện kích hoạt", và trang branch protection khuyên đặt tên job khác nhau trên mọi workflow vì trùng tên "có thể gây ra kết quả check mơ hồ". Nếu bạn bắt buộc <code>zizmor</code>, bạn không thể nói mình muốn cái nào trong hai cái.</li>
<li><strong>Đỏ không có nghĩa là bị chặn.</strong> Đối tượng pull request của ${PR(6)} báo <code>"mergeable_state": "unstable"</code>: có check hỏng, nhưng không luật nào đòi chúng, nên nút merge vẫn bấm được. Đó là trạng thái của mọi kho có CI mà không có luật — kể cả <code>main</code> của api-backend hôm nay.</li>
</ul>
<p>Ruleset có thêm một lớp chống trùng tên: khi thêm một check bắt buộc, bạn có thể chọn <em>nguồn mong đợi</em> — một GitHub App (GitHub Actions cũng là một app) buộc phải là bên báo check đó. Một job ở công cụ khác tình cờ cũng tên <code>lint</code> khi đó không thể làm luật hài lòng.</p>

<h3>Job tổng hợp, và vì sao phiên bản hiển nhiên nói dối</h3>
${slide('ga-14', 4, 'Job tổng hợp thiếu always() bị skip — và skip được tính là đạt')}
<p>Bắt buộc từng job theo tên rất mong manh: đổi tên một job, thêm một bản Node vào ma trận, hay tách một job làm hai, là luật lặng lẽ đòi một check không còn tồn tại. Cách thường dùng là một <strong>job tổng hợp</strong> <code>needs</code> tất cả các job khác, và luật chỉ đòi đúng job đó. Sân tập viết theo cách hiển nhiên trước:</p>
<pre><code class="language-yaml">  e2e-dem:
    if: contains(github.event.pull_request.labels.*.name, 'can-e2e')   # skip trừ khi có nhãn
    runs-on: ubuntu-24.04
    steps:
      - run: echo "e2e gia lap"

  cong-ngay-tho:              # job tổng hợp "hiển nhiên"
    needs: [lint, test, e2e-dem]
    runs-on: ubuntu-24.04
    steps:
      - run: echo "moi thu deu xanh?"</code></pre>
<p>Kết quả, lấy thẳng từ API danh sách job:</p>
<table>
<thead><tr><th>Pull request</th><th>lint</th><th>test (22) / (24)</th><th>e2e-dem</th><th>cong-ngay-tho</th><th>cong-tong</th></tr></thead>
<tbody>
<tr><td>${PR(5)} — xanh (${RUN(36074689448, 'run')})</td><td>success</td><td>success / success</td><td>skipped</td><td><strong>skipped</strong></td><td>success</td></tr>
<tr><td>${PR(6)} — test đỏ (${RUN(36074691713, 'run')})</td><td>success</td><td>failure / failure</td><td>skipped</td><td><strong>skipped</strong></td><td>failure</td></tr>
</tbody>
</table>
<p>Job tổng hợp hiển nhiên <strong>bị skip ở cả hai PR</strong> — không phải vì test đỏ, mà vì một job nó <code>needs</code> (<code>e2e-dem</code>) bị skip. Job có cha không thành công sẽ bị skip trừ khi <code>if:</code> của nó nói khác, và "skipped" không phải "failed". Rồi docs trao nốt nửa sau của cái bẫy: "Một job bị skip sẽ báo trạng thái là <em>Success</em>. Nó không ngăn pull request được merge, kể cả khi nó là check bắt buộc." Đặt <code>cong-ngay-tho</code> làm check bắt buộc thì ${PR(6)}, với hai job test đỏ, vẫn merge được. Cổng chỉ còn là đồ trang trí.</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — một job tổng hợp không bao giờ đỏ được.</strong> Job tổng hợp thiếu <code>if: always()</code> chỉ có hai kết cục: success (mọi cha đều thành công) hoặc skipped (mọi trường hợp còn lại). Với branch protection, skipped được báo là success. Vậy job đó hoặc xanh, hoặc "xanh". Hãy tìm trong kho của bạn những job <code>needs</code> nhiều job khác mà không có <code>if:</code>; nếu một trong số đó là check bắt buộc, cổng của bạn đang mở toang.</div>

<h3>Một job tổng hợp nói thật</h3>
${slide('ga-14', 5, 'cong-tong luôn chạy, đọc needs, chỉ đỏ khi có failure hoặc cancelled')}
<p>Job tổng hợp thứ hai luôn chạy và tự quyết:</p>
<pre><code class="language-yaml">  cong-tong:
    if: always()                          # chạy cả khi có cha đỏ hoặc bị skip
    needs: [lint, test, e2e-dem]
    runs-on: ubuntu-24.04
    steps:
      - name: Doc ket qua cac job
        env:
          KQ: &#36;{{ toJSON(needs) }}          # kết quả của mọi cha, dạng JSON
        run: |
          echo "$KQ" | jq -r 'to_entries[] | "\\(.key) = \\(.value.result)"'
          if echo "$KQ" | jq -e 'any(.[]; .result == "failure" or .result == "cancelled")' &gt; /dev/null; then
            echo "::error title=cong-tong::co job do hoac bi huy"
            exit 1
          fi</code></pre>
<p>Ở ${PR(6)} (${RUN(36074691713)}) nó in đúng thứ nó thấy và đỏ:</p>
<div class="out">KQ: {
  "lint":    { "result": "success", "outputs": {} },
  "test":    { "result": "failure", "outputs": {} },
  "e2e-dem": { "result": "skipped", "outputs": {} }
}
lint = success
test = failure
e2e-dem = skipped
##[error]co job do hoac bi huy
##[error]Process completed with exit code 1.</div>
<p>Ở ${PR(5)} cùng job đó in "khong co job nao do (skipped duoc tinh la dat)" và xanh. Ba chi tiết làm phiên bản này đúng:</p>
<ul>
<li><strong><code>needs.test.result</code> là MỘT giá trị cho cả ma trận.</strong> Hai job ma trận đỏ; <code>needs</code> chỉ hiện một <code>failure</code>. Bạn không phải liệt kê <code>test (22)</code> và <code>test (24)</code>, và sau này thêm Node 26 cũng không phải đụng vào luật.</li>
<li><strong>Skipped được coi là chấp nhận được — cố ý.</strong> <code>e2e-dem</code> bị skip mỗi khi PR không có nhãn; coi đó là hỏng sẽ chặn mọi PR bình thường. Nếu có job bắt buộc phải <em>chạy</em> — chứ không chỉ là không hỏng — thì kiểm <code>success</code> tường minh cho riêng job đó.</li>
<li><strong><code>cancelled</code> bị tính là hỏng.</strong> Một job bị <code>timeout-minutes</code> giết, hay bị một lần push mới huỷ (khối <code>concurrency</code> ở đầu tệp), không được phép biến thành một cổng xanh.</li>
</ul>
<p>Một dạng ngắn hơn bạn sẽ gặp ở nhiều kho dùng hàm biểu thức thay cho <code>jq</code>: <code>if: always() &amp;&amp; (contains(needs.*.result, 'failure') || contains(needs.*.result, 'cancelled'))</code> đặt trên một bước chạy <code>exit 1</code>. Hai cách tương đương; bản <code>jq</code> in ra một bảng đọc được, đúng thứ bạn cần khi cổng đỏ và có người hỏi vì sao.</p>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Pipeline có mười lăm job và một ma trận. Làm sao để branch protection đòi "toàn bộ CI" mà không liệt kê mười lăm cái tên?</strong><br>Đ: Một job tổng hợp có <code>if: always()</code> và <code>needs</code> mọi job khác, đỏ khi có bất kỳ kết quả nào là <code>failure</code> hoặc <code>cancelled</code>; luật chỉ đòi job đó. Đổi tên hay thêm job không bao giờ làm hỏng luật.</p>
<p><strong>H: Một check bắt buộc hiện "Skipped" trên một PR mà test đang đỏ. Merge được không?</strong><br>Đ: Được. GitHub báo job bị skip là success đối với check bắt buộc. Đó chính là lý do job tổng hợp phải có <code>if: always()</code>: không có nó, một cha đỏ làm nó skip thay vì đỏ.</p>
</div>

<h3>Lọc theo đường dẫn, và cái check không bao giờ tới</h3>
${slide('ga-14', 6, 'paths ở mức workflow: không chạy là không báo, và check bắt buộc chờ mãi')}
<p>Lọc theo đường dẫn tiết kiệm phút: <code>ch14-paths.yml</code> chỉ chạy test backend khi PR đụng vào <code>ch14/backend/**</code>.</p>
<pre><code class="language-yaml">on:
  pull_request:
    branches: [ch14-chat-luong]
    paths: ['ch14/backend/**']
jobs:
  backend-test:
    runs-on: ubuntu-24.04
    steps: [ ... npm test trong ch14/backend ... ]</code></pre>
<p>${PR(5)} sửa <code>ch14/backend/src/lich.js</code> và có một run (${RUN(36074689474)}). ${PR(7)} chỉ sửa <code>ch14/docs/README.md</code>: danh sách run của PR đó có <code>ch14-cong</code>, <code>ch14-tiem</code>, <code>ch14-kiem-tinh</code>, <code>ch14-phu-thuoc</code> — và hoàn toàn không có <code>ch14-paths</code>. Không phải skip, không phải xanh: workflow không hề được tạo, nên job của nó không bao giờ báo gì.</p>
<p>Không có luật thì không ai để ý. Có <code>backend-test</code> là check bắt buộc thì docs mô tả chuyện xảy ra: "Nếu một workflow bị bỏ qua vì lọc đường dẫn, lọc nhánh hay commit message, các check gắn với workflow đó sẽ nằm ở trạng thái 'Pending'. Pull request đòi các check đó thành công sẽ bị chặn merge." Trên PR nó hiện "Expected — Waiting for status to be reported", và chờ mãi mãi. Commit message có <code>[skip ci]</code> cũng gây y như vậy.</p>
<p>Ba lối thoát, xếp theo độ đáng tin:</p>
<ol>
<li><strong>Lọc ở mức JOB, không ở mức workflow.</strong> Để workflow luôn khởi động; bên trong mới quyết job nào chạy (Bài 14.4 dựng đúng cái này). Job bị <code>if:</code> của chính nó skip sẽ báo success — đúng nghĩa của "không bị ảnh hưởng".</li>
<li><strong>Chỉ bắt buộc job tổng hợp</strong>, vốn luôn chạy. Các job có lọc đường dẫn bên dưới được tự do bị skip.</li>
<li><strong>Một workflow "anh em"</strong> cùng tên job với bộ lọc ngược lại (<code>paths-ignore</code>), không làm gì và luôn xanh. Cách này chạy được, và chính GitHub từng hướng dẫn nó nhiều năm, nhưng hai tệp phải giữ khớp nhau mãi mãi. Đừng bắt đầu từ đây.</li>
</ol>
<p>api-backend là một ví dụ sống của sự lệch này. <code>ci-lint.yml</code> có danh sách <code>paths:</code> cho <code>push</code> (mười một mẫu) nhưng KHÔNG có cho <code>pull_request</code>. Vậy mọi PR đều chạy trọn kiểm kiểu, còn một lần push vào <code>main</code> chỉ đụng, chẳng hạn, <code>desktop/</code> thì không chạy gì. Hôm nay, khi chưa có gì bắt buộc, đó là lựa chọn hợp lý. Ngày ai đó bật luật cho <code>main</code>, danh sách paths là thứ đầu tiên phải chuyển vào trong các job.</p>

<h3>Branch protection, ruleset và merge queue: cái gì có ở đâu</h3>
${slide('ga-14', 7, 'Branch protection, ruleset và merge queue — có ở đâu, tính đến 09/2026')}
<p>Có hai cách gắn luật vào một nhánh, và chúng tồn tại song song.</p>
<table>
<thead><tr><th></th><th>Branch protection rule</th><th>Ruleset</th></tr></thead>
<tbody>
<tr><td>Kho public, gói Free</td><td>có</td><td>có</td></tr>
<tr><td>Kho private</td><td>Pro, Team, Enterprise</td><td>Pro, Team, Enterprise Cloud</td></tr>
<tr><td>Nhiều luật cùng áp một nhánh</td><td>không — đúng một luật khớp</td><td>có — các luật được gộp, và khi hai phiên bản của cùng một luật khác nhau thì "phiên bản chặt nhất được áp dụng"</td></tr>
<tr><td>Tắt tạm mà không xoá</td><td>không</td><td>trạng thái Active / Disabled (Evaluate chỉ có ở Enterprise)</td></tr>
<tr><td>Ai đọc được luật</td><td>admin</td><td>bất kỳ ai có quyền đọc kho</td></tr>
<tr><td>Giới hạn</td><td>—</td><td>75 ruleset mỗi kho</td></tr>
</tbody>
</table>
<p>Trong cả hai, "Require status checks to pass" có hai chế độ. <strong>Strict</strong> (mặc định, "Require branches to be up to date before merging") bắt PR chạy lại CI mỗi khi có người khác merge — an toàn, nhưng nhân số lần build trên một nhánh bận rộn. <strong>Loose</strong> cho merge mà không cần cập nhật, nên hai PR mỗi cái xanh riêng có thể cùng nhau làm hỏng <code>main</code>. Trên GitHub Enterprise Cloud, ruleset còn có "Do not require status checks on creation", để việc tạo một nhánh mới khớp mẫu không bị chặn bởi những check chưa thể nào chạy (docs chỉ bật tuỳ chọn này cho Enterprise; kho public cá nhân không thấy nó).</p>
<p><strong>Merge queue</strong> (hàng đợi merge) gỡ thế khó strict/loose: thay vì bắt từng tác giả cập nhật và chạy lại, GitHub dựng một nhánh tạm có các PR trong hàng được gộp lên trên <code>main</code>, chạy các check bắt buộc ở đó, và chỉ merge nếu chúng qua. Hai hệ quả cho workflow:</p>
<ul>
<li>Workflow báo check bắt buộc phải kích hoạt thêm trên <code>merge_group</code>; nếu không, hàng đợi chờ một check không bao giờ tới. Vì thế <code>ch14-cong.yml</code> có <code>merge_group:</code> cạnh <code>pull_request</code>.</li>
<li>Phạm vi rất hẹp: "mọi kho public thuộc một tổ chức, hoặc kho private thuộc tổ chức dùng GitHub Enterprise Cloud". Kho cá nhân — sân tập, hay <code>cuonghoang1103/api-backend</code> — hoàn toàn không dùng được.</li>
</ul>
<div class="callout warn">
<p><strong>⏳ Chưa chạy thật trên cloud: bật một ruleset.</strong> Sân tập là kho public của tài khoản cá nhân nên có ruleset, nhưng tạo ruleset cần quyền quản trị kho (trang cài đặt hoặc API rulesets), mà phiên dựng bài không có cả hai. Mọi điều ở trên về check, skip và "unstable" đều đo thật; tác động của luật lên nút merge thì trích từ docs. Các bước để tự tái hiện nằm trong "Chạy thử từng bước" ngay dưới.</p>
</div>

<h3>Ba tầng kiểm: nhanh ở mỗi PR, chặn ở hàng đợi, ban đêm thì chỉ báo</h3>
${slide('ga-14', 8, 'Ba tầng: tầng PR chặn, tầng hàng đợi chặn, tầng đêm chỉ báo')}
<p>Một cổng mất bốn mươi phút sẽ bị lách; một cổng không kiểm gì còn tệ hơn. Đa số đội chia tầng:</p>
<ul>
<li><strong>Mỗi pull request</strong>: lint, kiểm kiểu, unit test, các máy quét bảo mật tĩnh của Bài 14.2. Mục tiêu: đường tới hạn dưới mười phút (Chương 7 đã dạy cách đo). Tầng này là bắt buộc.</li>
<li><strong>Hàng đợi merge</strong>, nếu có: cùng các check đó, chạy lại trên kết quả đã gộp. Nó bắt được "xanh khi đứng riêng, đỏ khi đứng chung".</li>
<li><strong>Ban đêm</strong> (<code>on: schedule</code>): bộ e2e dài, ma trận rộng nhiều hệ điều hành và phiên bản, quét phụ thuộc và CodeQL đầy đủ. Nó không chặn gì; một đêm đỏ thì mở issue hoặc báo vào kênh.</li>
</ul>
<p>Hai sự thật từ các chương trước quan trọng ở đây. Workflow theo lịch chỉ chạy trên nhánh mặc định, nên job ban đêm kiểm <code>main</code>, không bao giờ kiểm một PR. Và Bài 1.3 đã đo <code>schedule</code> trễ và thất thường ra sao — check ban đêm để xem xu hướng, không để làm cổng. Quy tắc ngón tay cái: nếu một lỗi phải chặn việc merge, nó thuộc tầng PR; nếu nó chỉ cần mở ra một cuộc trao đổi, nó thuộc ban đêm.</p>

<h3>Chạy thử từng bước: một cổng trên kho của chính bạn</h3>
<ol>
<li>Trong workflow CI, thêm <code>name:</code> cho mọi job để tên check ổn định và không trùng giữa các workflow (<code>grep -h "^  [a-z-]*:$" .github/workflows/*.yml | sort | uniq -d</code> liệt kê id job bị trùng).</li>
<li>Thêm job <code>cong-tong</code> ở trên (đặt tên lại, ví dụ <code>ci-xanh</code>) với <code>needs</code> mọi job khác trong tệp.</li>
<li>Push một nhánh, mở PR, và xác nhận check mới hiện ra đúng tên bạn mong đợi.</li>
<li>Settings → Rules → Rulesets → New branch ruleset. Nhắm <code>main</code>; bật "Require a pull request before merging" và "Require status checks to pass"; thêm <code>ci-xanh</code> với nguồn là GitHub Actions. Để nguyên "Require branches to be up to date" trừ khi build chậm.</li>
<li>Push một commit làm hỏng một test. PR phải hiện "Merging is blocked"; <code>gh pr checks &lt;N&gt;</code> phải liệt kê <code>ci-xanh</code> là failing.</li>
<li>Nếu có workflow nào dùng <code>on.pull_request.paths</code>, mở một PR không khớp với nó và tìm dòng "Expected — Waiting" trước khi bắt buộc bất cứ thứ gì từ workflow đó.</li>
</ol>

<h3>Khi nào dùng từng loại cổng — và khi nào KHÔNG</h3>
<table>
<thead><tr><th>Công cụ</th><th>Dùng khi</th><th>Đừng dùng khi</th></tr></thead>
<tbody>
<tr><td>Bắt buộc từng job</td><td>kho nhỏ, hai ba job ổn định</td><td>có ma trận hoặc job hay đổi tên; luật hỏng mà không ai hay</td></tr>
<tr><td>Job tổng hợp (<code>if: always()</code>)</td><td>gần như luôn luôn — nó là cái tên duy nhất luật phụ thuộc</td><td>không bao giờ thiếu <code>always()</code>; bản đó không thể đỏ</td></tr>
<tr><td><code>on.*.paths</code></td><td>workflow không ai bắt buộc (build trang tài liệu, phát hành desktop)</td><td>mọi workflow báo một check bắt buộc</td></tr>
<tr><td>Strict "up to date"</td><td>ít người merge, CI nhanh</td><td>mười lần merge mỗi ngày và CI hai mươi phút — dùng merge queue nếu có</td></tr>
<tr><td>Merge queue</td><td>kho của tổ chức, merge nhiều mỗi ngày</td><td>kho cá nhân (không có)</td></tr>
</tbody>
</table>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Một monorepo dùng lọc đường dẫn để workflow của mỗi đội chỉ chạy cho thư mục của đội đó. Sau khi bật branch protection, PR chỉ sửa tài liệu không merge được. Vì sao, và sửa thế nào?</strong><br>Đ: Workflow bị bỏ qua vì lọc đường dẫn không bao giờ tạo check của nó, nên check bắt buộc nằm mãi ở "Expected — Waiting". Chuyển việc lọc vào trong job (job bị skip báo success) hoặc chỉ bắt buộc một job tổng hợp luôn chạy.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> kho của bạn có CI nhưng không gì ngăn một PR đỏ bị merge. Dựng cổng, rồi thử phá nó.</p><ol>
<li>Thêm hai job tổng hợp vào CI: một cái không có <code>if:</code>, một cái có <code>if: always()</code> đọc <code>toJSON(needs)</code>, và một job bị skip trừ khi PR có nhãn.</li>
<li>Mở một PR làm hỏng một test. Trước khi nhìn, ghi ra kết luận bạn đoán cho từng job tổng hợp.</li>
<li>Tạo một ruleset trên một nhánh thử, đòi bản có <code>always()</code>; kiểm tra nút merge bị chặn.</li>
<li>Đổi ruleset sang đòi job tổng hợp còn lại rồi nhìn lại nút merge. Sau đó đổi về.</li>
</ol><p><strong>Đạt khi:</strong> bạn chỉ ra được danh sách check của PR với một job tổng hợp <code>skipped</code> và cái kia <code>failure</code>; PR hiện "Merging is blocked" khi luật đúng; và bạn giải thích được trong một câu vì sao luật kia để lọt một PR đỏ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">check run</span><span class="v">một kết quả được báo lên một commit — mỗi job của mỗi workflow là một; app và code scanning thêm cái khác</span></div>
<div class="kv"><span class="k">required status check (check bắt buộc)</span><span class="v">tên check mà luật đòi phải qua trước khi merge; so theo tên, không theo workflow hay sự kiện</span></div>
<div class="kv"><span class="k">job tổng hợp</span><span class="v">job <code>needs</code> mọi job khác và gom kết quả của chúng thành một check bắt buộc</span></div>
<div class="kv"><span class="k"><code>mergeable_state: unstable</code></span><span class="v">có check hỏng nhưng không cái nào bắt buộc — nút merge vẫn bấm được</span></div>
<div class="kv"><span class="k">ruleset (bộ luật)</span><span class="v">tập luật có tên cho nhánh/thẻ, chồng được lên nhau; nhiều bộ cùng áp thì luật chặt nhất thắng</span></div>
<div class="kv"><span class="k">strict / loose</span><span class="v">PR có phải cập nhật theo nhánh đích trước khi merge hay không</span></div>
<div class="kv"><span class="k">merge queue / <code>merge_group</code></span><span class="v">GitHub kiểm các PR trong hàng khi đã gộp chung; workflow phải nghe <code>merge_group</code></span></div>
<div class="kv"><span class="k">Expected — Waiting</span><span class="v">check bắt buộc mà không workflow nào báo, thường do <code>paths</code> hoặc <code>[skip ci]</code></span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Check đỏ không chặn gì cho tới khi có luật đòi nó, và luật so theo tên job — giữ tên job không trùng giữa các workflow.</li>
<li>Job tổng hợp thiếu <code>if: always()</code> bị skip mỗi khi có cha bị skip hoặc đỏ; skipped được báo là success. Đo thật: skip ở cả PR xanh lẫn PR đỏ.</li>
<li>Job tổng hợp đúng luôn chạy, đọc <code>toJSON(needs)</code>, đỏ khi có <code>failure</code> hoặc <code>cancelled</code>.</li>
<li><code>paths</code> trên workflow nghĩa là không run, không check, và check bắt buộc chờ mãi; hãy lọc bên trong job.</li>
<li>Ruleset chồng lên nhau (chặt nhất thắng), tắt tạm được và ai cũng đọc được; merge queue cần một tổ chức và <code>merge_group</code>.</li>
<li>Check nhanh làm cổng cho mọi PR; check dài chạy ban đêm trên nhánh mặc định và chỉ báo.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Control jobs with conditions</span><span class="lc-sub">docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-jobs-with-conditions — "A job that is skipped will report its status as Success … even if it is a required check."</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax: paths và paths-ignore</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax — ghi chú "Pending" cho workflow bị bỏ qua vì lọc đường dẫn, nhánh hoặc commit message.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About rulesets; Available rules for rulesets; Troubleshooting rules</span><span class="lc-sub">docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets — chồng luật, trạng thái thực thi, strict/loose, nguồn mong đợi, dạng tên check.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Managing a merge queue</span><span class="lc-sub">docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue — phạm vi, <code>merge_group</code>, build concurrency và giới hạn merge.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sân tập — nhánh ch14-chat-luong và PR #5–#7</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch14-chat-luong — <code>ch14-cong.yml</code>, <code>ch14-paths.yml</code> và các run được dẫn trong bài.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git — pull request, review và bảo vệ nhánh</span><span class="lc-sub">/courses/git/learn${REF} — nếu bạn cần ôn lại luồng PR trước khi đặt luật lên nó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 14.2 ─────────────────────────── */
    {
      title: '14.2 — Supply-chain security: pull_request_target, injection, scanners, Dependabot|||14.2 — Bảo mật chuỗi cung ứng: pull_request_target, tiêm lệnh, máy quét, Dependabot',
      slug: 'ga-14-2-bao-mat-chuoi-cung-ung',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Pipeline là một chuỗi cung ứng: mã của bạn, phụ thuộc, action và chính workflow. Góc phòng thủ, đo thật: pull_request_target ở nhánh không mặc định chạy 0 lần, tiêm lệnh vô hại qua tiêu đề PR và cách vá bằng env, actionlint + zizmor + CodeQL bắt được gì, SARIF thành check "No new alerts", dependency review đòi dependency graph, và các lớp secret scanning.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.2</span>
<h2>Supply-chain security: pull_request_target, injection, static scanners, Dependabot and secret scanning</h2>
<p class="lead">Your pipeline runs four kinds of code you did not write in the same minute: the workflow file, the actions it pulls in, the dependencies it installs, and — on a pull request — whatever the author of that pull request put in the branch. A supply-chain attack is any path by which one of those four gets to act with your pipeline&#39;s credentials. This lesson is written from the defender&#39;s side: how each path works in one sentence, a harmless reconstruction in the sandbox, and then the fix and the tool that detects it.</p>

<p>Three chapters already cover pieces of this. Lesson 3.1 showed the boundary between an expression and a shell script, using a branch name; Lesson 4.2 counted the actions api-backend depends on and told the tj-actions/changed-files story; Chapter 6 covered the token, OIDC and a zizmor run on api-backend. This lesson does not repeat them. It adds the trigger that causes most real incidents (<code>pull_request_target</code>), a second injection field, three scanners running <em>as checks</em> in CI, and the services GitHub provides around dependencies and secrets.</p>

<h3><code>pull_request_target</code>: the trigger that runs with your secrets</h3>
${slide('ga-14', 9, 'pull_request_target runs the default branch’s workflow, with secrets')}
<p>For a pull request from a fork, <code>pull_request</code> runs the workflow file from the pull request&#39;s merge commit — code written by someone without write access — so GitHub makes it safe by giving it a read-only token and no secrets. <code>pull_request_target</code> makes the opposite trade. In the words of the docs page "Securely using pull_request_target": "the workflow, and any subsequent <code>actions/checkout</code> call that does not specify a <code>ref</code>, is taken from the base repository&#39;s default branch, not from the pull request. Because only trusted code from the default branch runs, it is safe to grant secrets and a read/write token."</p>
<p>It stays safe exactly until the workflow runs the pull request&#39;s code. The pattern the docs call a <strong>pwn request</strong> is short: <code>pull_request_target</code>, then <code>actions/checkout</code> with <code>ref:</code> pointing at the pull request head, then any step that <em>executes</em> what was checked out — <code>npm install</code> (install scripts), <code>make test</code>, a build script, even a config file a tool loads. The checkout alone runs nothing; the next step does, with the base repository&#39;s secrets in reach.</p>
<p>The sandbox added a workflow, <code>ch14-prt.yml</code>, that only prints where it runs from, on <code>pull_request_target</code> for the branch <code>ch14-chat-luong</code>. Five pull requests were then opened against that branch. The list of runs filtered by the event <code>pull_request_target</code> returned <code>"total_count": 0</code>. Not a failure: the file lives only on <code>ch14-chat-luong</code>, and a <code>pull_request_target</code> workflow is read from the default branch, where it does not exist. That is the whole security model in one measurement — and also why you cannot "test" a change to such a workflow in a pull request.</p>
<p>Two newer defences are worth knowing, both checked in the docs source of September 2026:</p>
<ul>
<li><strong>A default event policy.</strong> For public repositories without their own Actions event policy, GitHub adds one that blocks <code>pull_request_target</code>. It "currently runs in <strong>evaluate</strong> mode" (runs continue, insights show what would be blocked) and GitHub "will enforce the default policy" on <strong>2 November 2026</strong>. After that, a public repository that still needs the trigger must allow it explicitly.</li>
<li><strong><code>allow-unsafe-pr-checkout</code></strong>, an <code>actions/checkout</code> input that must be set to <code>true</code> before it will check out a fork&#39;s pull-request head under this trigger. The name is chosen "to be easy to spot in code review and static analysis". It covers only <code>actions/checkout</code>; <code>git fetch</code>, <code>gh pr checkout</code> or a downloaded artifact are not covered.</li>
</ul>
<p>The same page adds two hardening facts: a <code>pull_request_target</code> run has read-only access to the default branch&#39;s cache (so it cannot poison it), and the rule is not specific to this trigger — <code>issue_comment</code> or <code>workflow_run</code> workflows that fetch and run a fork&#39;s code are pwn requests too.</p>

<div class="pitfall co-tieu-de"><strong>Trap — "I need secrets for fork pull requests, so I switched to pull_request_target".</strong> That is the sentence that precedes most incidents. Split the work instead: build and test the fork&#39;s code under <code>pull_request</code> with no secrets and upload the result as an artifact; do the privileged part (a comment, a label, a deploy preview) in a second workflow that treats that artifact as <em>data</em> and never executes it.</div>

<h3>Command injection through a pull-request title, rebuilt harmlessly</h3>
${slide('ga-14', 10, 'Injection through a PR title — a harmless reconstruction with permissions: {}')}
<p>Lesson 3.1 showed that <code>&#36;{{ … }}</code> in a <code>run:</code> block is substituted into the script text <em>before</em> the shell reads it. Any field a stranger controls therefore becomes shell code: the pull-request title and body, a branch name, a commit message, an issue comment. The sandbox reproduced it with the title, using a payload whose only effect is to print a word. Workflow <code>ch14-tiem.yml</code>, with no permissions at all:</p>
<pre><code class="language-yaml">permissions: {}
jobs:
  tieu-de:
    runs-on: ubuntu-24.04
    steps:
      - name: CACH SAI - bieu thuc dan thang vao script
        run: echo "Tieu de PR la - &#36;{{ github.event.pull_request.title }}"
      - name: CACH DUNG - qua bien moi truong
        env:
          TIEU_DE: &#36;{{ github.event.pull_request.title }}
        run: echo "Tieu de PR la - $TIEU_DE"</code></pre>
<p>${PR(8)} was opened with the title <code>ch14: thu tieu de $(echo DA-CHAY-LENH-TU-TIEU-DE)</code>. Run ${RUN(36074698667)}:</p>
<div class="out">GITHUB_TOKEN Permissions
  Metadata: read
##[group]Run echo "Tieu de PR la - ch14: thu tieu de $(echo DA-CHAY-LENH-TU-TIEU-DE)"
shell: /usr/bin/bash -e {0}
Tieu de PR la - ch14: thu tieu de DA-CHAY-LENH-TU-TIEU-DE

##[group]Run echo "Tieu de PR la - $TIEU_DE"
env:
  TIEU_DE: ch14: thu tieu de $(echo DA-CHAY-LENH-TU-TIEU-DE)
Tieu de PR la - ch14: thu tieu de $(echo DA-CHAY-LENH-TU-TIEU-DE)</div>
<p>The first step printed <code>DA-CHAY-LENH-TU-TIEU-DE</code> without the <code>$(echo …)</code> around it: bash ran the command substitution that came from the title. The second step printed the title literally, because an environment variable reaches bash as data and double quotes stop it from being re-parsed. The group header of the first step shows the script <em>after</em> substitution — the attacker&#39;s text is already part of it before anything runs. That is the whole mechanism; this course deliberately does not go further than a harmless <code>echo</code>.</p>
<p>The second line of defence is in the log too: <code>permissions: {}</code> left the job with <code>Metadata: read</code> only. Had the injected command tried to do something with the token, there was nothing to do it with. In a <code>pull_request</code> run from a fork that is already the case; in a <code>pull_request_target</code>, <code>issue_comment</code> or <code>push</code> run it is not, which is why the same bug there is critical.</p>

<h3>Three static scanners, running as checks</h3>
${slide('ga-14', 11, 'Three static scanners, each catching a different kind of problem')}
<p>Reviewers miss injection because the vulnerable line looks like every other line. Machines do not. The workflow <code>ch14-kiem-tinh.yml</code> runs two scanners on every push and pull request: actionlint (downloaded from its release and checked against the published <code>checksums.txt</code>) and zizmor (through <code>pipx</code>, pinned to 1.30.1, <code>--offline</code>). On ${PR(6)}, run ${RUN(36074691722)}:</p>
<div class="out">$ ./actionlint -color .github/workflows/ch14-*.yml
.github/workflows/ch14-tiem.yml:15:40: "github.event.pull_request.title" is potentially untrusted.
  avoid using it directly in inline scripts. instead, pass it through an environment variable. [expression]
##[error]Process completed with exit code 1.

$ pipx run zizmor==1.30.1 --offline .github/workflows/ch14-*.yml
error[dangerous-triggers]: use of fundamentally insecure workflow trigger
 --&gt; .github/workflows/ch14-prt.yml:3:1
  = pull_request_target is almost always used insecurely
error[template-injection]: code injection via template expansion
 --&gt; .github/workflows/ch14-tiem.yml:15:40
  = note: audit confidence → High
  = note: this finding has an auto-fix
21 findings (19 suppressed, 1 unsafe fixes): 0 informational, 0 low, 0 medium, 2 high
##[error]Process completed with exit code 14.</div>
<table>
<thead><tr><th>Scanner</th><th>What it found here</th><th>What it is good at</th><th>Cost in the sandbox</th></tr></thead>
<tbody>
<tr><td>actionlint 1.7.12</td><td>the title in <code>run:</code></td><td>syntax, expression types, unknown properties, untrusted inputs in scripts, shellcheck on <code>run:</code></td><td>about 5 s including the download</td></tr>
<tr><td>zizmor 1.30.1</td><td>the title in <code>run:</code> <strong>and</strong> the <code>pull_request_target</code> trigger</td><td>security-specific audits: dangerous triggers, excessive permissions, unpinned <code>uses:</code>, <code>persist-credentials</code>, cache poisoning</td><td>about 5 s through <code>pipx</code></td></tr>
<tr><td>CodeQL, language <code>actions</code></td><td>(results live in the Security tab — see below)</td><td>data-flow queries: code injection, untrusted checkout, artifact and cache poisoning, known-vulnerable actions</td><td>16 s init + 18 s analyse</td></tr>
</tbody>
</table>
<p>Two measured details matter when you wire them in. zizmor exits with <strong>14</strong> when the highest finding is high — not 1 — so a gate that tests for "exit code 1" would miss it; test for non-zero. And zizmor&#39;s default persona hides most of what it knows: the same files under <code>--persona=pedantic</code> on the build machine reported 21 findings, of which 19 were suppressed by default (<code>anonymous-definition</code>, <code>concurrency-limits</code>, <code>undocumented-permissions</code>). Start with the default; tighten later.</p>
<p>CodeQL now has a language for workflows. The run ${RUN(36074649064)} (CodeQL 2.27.1, query pack <code>codeql/actions-queries</code> 0.6.36) printed the queries it evaluated — among them <code>actions/code-injection/critical</code>, <code>actions/untrusted-checkout/high</code>, <code>actions/artifact-poisoning/critical</code>, <code>actions/cache-poisoning/code-injection</code>, <code>actions/missing-workflow-permissions</code> and <code>actions/vulnerable-action</code> — and ended with "CodeQL scanned 7 out of 7 GitHub Actions files in this invocation". A second matrix job analysed the JavaScript of the three packages with <code>build-mode: none</code> in 35 seconds.</p>
<p>None of the three replaces another. actionlint does not consider <code>pull_request_target</code> dangerous; zizmor does not type-check expressions the way actionlint does; CodeQL follows data across steps and jobs but is slower and reports into the Security tab rather than the log.</p>

<h3>SARIF: turning scan results into alerts and into a check</h3>
${slide('ga-14', 12, 'SARIF: scan results become alerts, and a check on the pull request')}
<p>SARIF is the JSON format code scanning accepts from any tool. The zizmor job writes it with <code>--format sarif</code> and uploads it with <code>github/codeql-action/upload-sarif</code>, which needs <code>security-events: write</code>. The log of ${RUN(36074691722)}:</p>
<div class="out">Post-processing sarif files: ["zizmor.sarif"]
Validating zizmor.sarif
Adding fingerprints to SARIF file.
Uploading results
Successfully uploaded results
Analysis upload status is complete.</div>
<p>Two things came out of that upload. On the branch, the findings become code-scanning alerts, de-duplicated across runs by the fingerprints. On the pull request, code scanning added its own check — the second <code>zizmor</code> in Lesson 14.1&#39;s list — whose page reads: "GitHub Advanced Security / zizmor succeeded … No new alerts in code changed by this pull request". It was green although the file had two high findings, because those findings already existed on the base branch (the push run uploaded them first). That is the intended behaviour: the code-scanning check fails only on alerts the pull request <em>introduces</em>, so an old backlog does not block every new change. The raw zizmor job, which exits 14 on any finding, is the stricter of the two; choose deliberately which one you require.</p>
<div class="callout warn">
<p><strong>⏳ Not run on the cloud yet: reading the alerts themselves.</strong> The Security tab and the code-scanning alerts API need an authenticated user with access to security results; the build session had neither, so the number and text of the alerts CodeQL raised on <code>ch14-chat-luong</code> are not quoted here. The uploads themselves ("Successfully uploaded results", "Analysis upload status is complete") are in the logs above.</p>
</div>
<!-- CHAY-O-MAY: Mở github.com/cuonghoang1103/ga-san-tap/security/code-scanning?query=branch:ch14-chat-luong (đăng nhập chủ kho): ghi số cảnh báo của tool "zizmor" và "CodeQL", tên rule (mong đợi: template-injection, dangerous-triggers; CodeQL actions/code-injection/medium cho ch14-tiem.yml), mức độ; chụp một cảnh báo. Bổ sung vào mục SARIF của bài 14.2. -->

<h3>Dependabot and dependency review: the old dependencies and the new ones</h3>
${slide('ga-14', 13, 'Dependabot fixes old dependencies; dependency review blocks new ones')}
<p>Dependencies are the largest part of the supply chain, and GitHub splits the work into four features that people often confuse:</p>
<table>
<thead><tr><th>Feature</th><th>What it does</th><th>Where it is switched on</th></tr></thead>
<tbody>
<tr><td>Dependency graph</td><td>parses manifests and lock files; everything below depends on it</td><td>repository settings</td></tr>
<tr><td>Dependabot alerts</td><td>an alert for each vulnerable dependency already in the graph</td><td>repository settings</td></tr>
<tr><td>Dependabot security updates</td><td>for each alert, a pull request to "the minimum version that includes the patch"; also fixes vulnerable <em>actions</em> in workflows</td><td>repository settings</td></tr>
<tr><td>Dependabot version updates</td><td>scheduled pull requests to the latest version, security or not</td><td><code>.github/dependabot.yml</code> on the default branch</td></tr>
<tr><td>Dependency review</td><td>on a pull request, the diff of dependencies and any known vulnerabilities in what is being <em>added</em></td><td>the <code>actions/dependency-review-action</code> in a workflow</td></tr>
</tbody>
</table>
<p>The first four look backwards at what the repository already uses. Dependency review looks at the pull request: it is the only one that can stop a vulnerable package <em>before</em> it lands. The sandbox tried it. ${PR(9)} added <code>lodash</code> 4.17.20 (a version with published advisories) to the backend package, with a lock file, and <code>ch14-phu-thuoc.yml</code> ran the action pinned to v5.0.0 with <code>fail-on-severity: moderate</code>. Run ${RUN(36074699591)}:</p>
<div class="out">##[error]Dependency review is not supported on this repository. Please ensure that Dependency graph
is enabled, see https://github.com/cuonghoang1103/ga-san-tap/settings/security_analysis</div>
<p>Every pull request got the same red, including the green one (${RUN(36074689504)}). The action is a thin client of the dependency review API, and that API needs the dependency graph — which is a repository setting, off in the sandbox. That is itself worth remembering: a gate built on this action fails closed on a repository where the graph is off, and it fails for every pull request, not just the vulnerable one.</p>
<div class="callout warn">
<p><strong>⏳ Not run on the cloud yet: the vulnerable-dependency verdict, and Dependabot pull requests.</strong> Enabling the dependency graph, alerts and security updates needs the repository administrator; version updates need <code>dependabot.yml</code> on <code>main</code>, which this chapter may not touch. The workflow and the pull request are in place and will show the real verdict the moment the setting is on.</p>
</div>
<!-- CHAY-O-MAY: (1) ga-san-tap Settings → Code security → bật Dependency graph (+ Dependabot alerts, Dependabot security updates). (2) Re-run job xem-phu-thuoc của PR #9 (mở lại PR nếu cần) → ghi bảng lỗ hổng mà dependency-review-action in ra cho lodash 4.17.20 (GHSA, mức độ) và kết luận; ghi run ID. (3) Tuỳ chọn: tạo .github/dependabot.yml trên nhánh chNN-* KHÔNG có tác dụng (Dependabot chỉ đọc nhánh mặc định) — nếu người dùng cho phép đặt tạm lên main thì ghi PR Dependabot đầu tiên rồi gỡ. -->
<p>One more behaviour to plan for: workflows triggered by a Dependabot pull request run with a read-only <code>GITHUB_TOKEN</code>, and secrets come from the separate <strong>Dependabot secrets</strong> store, not from Actions secrets. A CI job that needs a registry password will fail on Dependabot&#39;s pull requests until that secret is added in the Dependabot section too.</p>

<h3>Secret scanning and push protection: block before, not after</h3>
${slide('ga-14', 14, 'Secret scanning blocks the push instead of reporting the leak')}
<p>Chapter 6 covered what to do once a secret has leaked (revoke first, clean history second). GitHub&#39;s secret scanning tries to stop the leak at the door. The docs describe two kinds of push protection:</p>
<ul>
<li><strong>Push protection for users</strong> — tied to your GitHub account, "enabled by default", blocks you from pushing supported secrets to public repositories.</li>
<li><strong>Push protection for repositories</strong> — "disabled by default", enabled by an administrator, blocks everyone pushing to that repository; bypasses are recorded as alerts.</li>
</ul>
<p>Both block secrets in command-line pushes, commits made in the web UI, file uploads, REST API calls and — for public repositories — changes made through GitHub&#39;s MCP server. Secret scanning alerts, separately, report secrets already in history. Third-party scanners add their own checks; the account behind the sandbox has GitGuardian installed, which is why <code>GitGuardian Security Checks</code> appeared on every pull request in Lesson 14.1.</p>
<p>The sandbox deliberately did not try to push a secret, not even a fake one in a real format: realistic test secrets end up in forks, caches and screenshots, and the habit is the risk. If you want to see the block yourself, use a throwaway private repository with push protection turned on and a token you create and revoke within the minute.</p>

<h3>Defence in depth: one layer per place</h3>
${slide('ga-14', 15, 'Supply-chain defence in depth — each layer has its place')}
<p>No single control stops all of this. What works is one cheap layer in each place an attack can enter:</p>
<ul>
<li><strong>Actions</strong>: pin every <code>uses:</code> to a full SHA with a version comment (Lesson 4.2 — in March 2025 the tags of tj-actions/changed-files were moved to malicious code, and SHA pins were unaffected), and let Dependabot for <code>github-actions</code> keep them fresh (Lesson 12.4).</li>
<li><strong>Token</strong>: <code>permissions: {}</code> at the top of every workflow, and each job asks for exactly what it uses. The injection above could do nothing because of this line.</li>
<li><strong>Untrusted text</strong>: never <code>&#36;{{ github.event.* }}</code> inside <code>run:</code>; always <code>env:</code> and a quoted variable.</li>
<li><strong>Triggers</strong>: no <code>pull_request_target</code> unless the job only labels or comments and never executes pull-request code.</li>
<li><strong>Detection</strong>: actionlint and zizmor as pull-request checks; CodeQL for <code>actions</code> and your language on the default branch and nightly.</li>
<li><strong>Dependencies and secrets</strong>: dependency graph on, dependency review on pull requests, push protection on.</li>
</ul>

<h3>Run it step by step: a static-analysis gate for your workflows</h3>
<ol>
<li>Locally, run <code>actionlint</code> and <code>uvx zizmor --offline .github/workflows</code> (or <code>pipx run zizmor</code>) on your repository and read every finding before changing anything.</li>
<li>Fix every <code>template-injection</code>: move the expression into <code>env:</code> and use <code>"$NAME"</code> in the script.</li>
<li>Add <code>permissions: {}</code> at the top of each workflow and the minimum per job; re-run zizmor until <code>excessive-permissions</code> is gone.</li>
<li>Copy the <code>ch14-kiem-tinh.yml</code> jobs into <code>.github/workflows/kiem-tinh.yml</code>, with job names that do not collide with anything else (for example <code>workflow-lint</code> and <code>workflow-audit</code>).</li>
<li>Open a pull request that deliberately adds <code>run: echo "&#36;{{ github.event.pull_request.title }}"</code> to a workflow; confirm both jobs fail and point at that line; then close it.</li>
<li>Add the job names to your summary job&#39;s <code>needs</code> from Lesson 14.1, so the gate covers them.</li>
</ol>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: What is the difference between <code>pull_request</code> and <code>pull_request_target</code>, and when is the second one dangerous?</strong><br>A: <code>pull_request</code> runs the pull request&#39;s version of the workflow with a read-only token and no secrets for forks; <code>pull_request_target</code> runs the default branch&#39;s version with secrets and a write token. It becomes dangerous when the job checks out and executes the pull request&#39;s code (a "pwn request").</p>
<p><strong>Q: How do you prevent script injection in GitHub Actions?</strong><br>A: Never put <code>&#36;{{ }}</code> expressions that contain user-controlled data inside <code>run:</code>; pass them through <code>env:</code> and quote the variable. Limit the token with <code>permissions:</code>, and catch regressions with actionlint, zizmor or CodeQL for Actions.</p>
<p><strong>Q: Dependabot alerts versus dependency review?</strong><br>A: Alerts report vulnerabilities in dependencies already in the repository; dependency review runs on a pull request and can fail it for vulnerabilities in the dependencies being added. Both need the dependency graph.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> audit the workflows of your own repository (api-backend if you like — read-only) and make the audit a permanent check.</p><ol>
<li>Run actionlint and zizmor locally; count the findings by rule and write the numbers down.</li>
<li>Fix every <code>template-injection</code> and add <code>permissions:</code> blocks; run both tools again.</li>
<li>Add the two-job static-analysis workflow from "Run it step by step" and open a pull request.</li>
<li>In a throwaway branch, reintroduce one injection and open a second pull request; look at which checks go red.</li>
</ol><p><strong>Done when:</strong> the first pull request is green with both new checks; the second pull request has both checks red, each pointing at the same file and line; and you can say which of your workflows (if any) use <code>pull_request_target</code>, <code>issue_comment</code> or <code>workflow_run</code> and whether any of them executes pull-request code.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">supply chain</span><span class="v">everything your build runs that you did not write: actions, dependencies, the workflow, pull-request code</span></div>
<div class="kv"><span class="k"><code>pull_request_target</code></span><span class="v">trigger that runs the default branch&#39;s workflow for a pull request, with secrets and a write token</span></div>
<div class="kv"><span class="k">pwn request</span><span class="v">a privileged workflow that checks out and executes a pull request&#39;s code</span></div>
<div class="kv"><span class="k">script injection</span><span class="v">untrusted text substituted into a <code>run:</code> script by <code>&#36;{{ }}</code> and executed by the shell</span></div>
<div class="kv"><span class="k">zizmor</span><span class="v">security-focused static analyser for workflows; exit code 14 means high-severity findings</span></div>
<div class="kv"><span class="k">SARIF</span><span class="v">JSON format for static-analysis results; uploaded to become code-scanning alerts and a pull-request check</span></div>
<div class="kv"><span class="k">dependency review</span><span class="v">pull-request diff of dependencies with known vulnerabilities; needs the dependency graph</span></div>
<div class="kv"><span class="k">push protection</span><span class="v">secret scanning that rejects a push containing a supported secret before it reaches the repository</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>pull_request_target</code> runs the default branch&#39;s file with secrets; measured: zero runs from a non-default branch. It is dangerous only when it executes pull-request code — so never do that.</li>
<li>Public repositories get a default policy blocking <code>pull_request_target</code>, enforced from 2 November 2026; <code>actions/checkout</code> needs <code>allow-unsafe-pr-checkout</code> to fetch a fork head.</li>
<li>A pull-request title reached bash as code through <code>&#36;{{ }}</code> and as data through <code>env:</code> — same run, two steps.</li>
<li>actionlint, zizmor and CodeQL for <code>actions</code> catch different things; run the first two on every pull request (zizmor exits 14 on high findings).</li>
<li>SARIF uploads become alerts and a check that fails only on new alerts.</li>
<li>Dependency review is the only dependency feature that blocks before merge, and it needs the dependency graph switched on.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Securely using pull_request_target</span><span class="lc-sub">docs.github.com/en/actions/reference/security/securely-using-pull_request_target — pwn requests, the default policy (evaluate mode, enforcement 2 November 2026), <code>allow-unsafe-pr-checkout</code>, hardening.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Secure use reference</span><span class="lc-sub">docs.github.com/en/actions/reference/security/secure-use — script injection, good practices for untrusted input.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About dependency review; Dependabot security updates; Push protection</span><span class="lc-sub">docs.github.com/en/code-security/concepts — what each feature does, what it needs, and its defaults.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">zizmor — audit documentation</span><span class="lc-sub">docs.zizmor.sh/audits — the audits named in this lesson: <code>template-injection</code>, <code>dangerous-triggers</code>, <code>excessive-permissions</code>, <code>unpinned-uses</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sandbox — branch ch14-chat-luong, pull requests #8 and #9</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch14-chat-luong — <code>ch14-tiem.yml</code>, <code>ch14-prt.yml</code>, <code>ch14-kiem-tinh.yml</code>, <code>ch14-codeql.yml</code>, <code>ch14-phu-thuoc.yml</code>.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.2</span>
<h2>Bảo mật chuỗi cung ứng: pull_request_target, tiêm lệnh, máy quét tĩnh, Dependabot và secret scanning</h2>
<p class="lead">Trong cùng một phút, pipeline của bạn chạy bốn loại mã không do bạn viết: chính tệp workflow, các action nó kéo về, các phụ thuộc nó cài, và — với một pull request — bất cứ thứ gì tác giả PR đặt vào nhánh. Tấn công chuỗi cung ứng là bất kỳ con đường nào để một trong bốn thứ đó được hành động bằng quyền của pipeline. Bài này viết từ phía người phòng thủ: mỗi con đường hoạt động thế nào trong một câu, một bản dựng lại vô hại trên sân tập, rồi cách vá và công cụ phát hiện.</p>

<p>Ba chương đã chạm vào từng mảnh. Bài 3.1 cho thấy ranh giới giữa biểu thức và script shell, dùng tên nhánh; Bài 4.2 đếm các action api-backend phụ thuộc và kể vụ tj-actions/changed-files; Chương 6 nói về token, OIDC và một lần chạy zizmor trên api-backend. Bài này không lặp lại chúng. Nó thêm bộ kích hoạt gây ra phần lớn sự cố thật (<code>pull_request_target</code>), một trường tiêm lệnh thứ hai, ba máy quét chạy <em>như các check</em> trong CI, và các dịch vụ GitHub cung cấp quanh phụ thuộc và secret.</p>

<h3><code>pull_request_target</code>: bộ kích hoạt chạy cùng secret của bạn</h3>
${slide('ga-14', 9, 'pull_request_target chạy tệp workflow của nhánh mặc định, có secret')}
<p>Với PR từ một fork, <code>pull_request</code> chạy tệp workflow lấy từ merge commit của PR — mã do người không có quyền ghi viết ra — nên GitHub làm nó an toàn bằng cách cho token chỉ đọc và không cho secret. <code>pull_request_target</code> đổi chác theo chiều ngược lại. Theo trang docs "Securely using pull_request_target": "workflow, và mọi lời gọi <code>actions/checkout</code> sau đó không ghi <code>ref</code>, được lấy từ nhánh mặc định của kho gốc, không phải từ pull request. Vì chỉ mã tin cậy của nhánh mặc định được chạy, việc cấp secret và token đọc/ghi là an toàn."</p>
<p>Nó an toàn đúng cho tới lúc workflow chạy mã của PR. Mẫu hình docs gọi là <strong>pwn request</strong> rất ngắn: <code>pull_request_target</code>, rồi <code>actions/checkout</code> với <code>ref:</code> trỏ vào đầu nhánh PR, rồi bất kỳ bước nào <em>thực thi</em> thứ vừa checkout — <code>npm install</code> (script cài đặt), <code>make test</code>, một script build, kể cả một tệp cấu hình mà công cụ nạp vào. Riêng bước checkout không chạy gì; bước kế tiếp mới chạy, trong tầm với của secret kho gốc.</p>
<p>Sân tập thêm workflow <code>ch14-prt.yml</code> chỉ in ra nó chạy từ đâu, trên <code>pull_request_target</code> cho nhánh <code>ch14-chat-luong</code>. Rồi năm PR được mở vào nhánh đó. Danh sách run lọc theo sự kiện <code>pull_request_target</code> trả về <code>"total_count": 0</code>. Không phải lỗi: tệp chỉ nằm ở <code>ch14-chat-luong</code>, mà workflow <code>pull_request_target</code> được đọc từ nhánh mặc định, nơi nó không tồn tại. Đó là toàn bộ mô hình an ninh trong một phép đo — và cũng là lý do bạn không thể "thử" một thay đổi của workflow kiểu này bằng một PR.</p>
<p>Có hai lớp phòng thủ mới đáng biết, cả hai kiểm trong mã nguồn docs tháng 09/2026:</p>
<ul>
<li><strong>Chính sách sự kiện mặc định.</strong> Với kho public chưa có chính sách sự kiện Actions riêng, GitHub thêm một chính sách chặn <code>pull_request_target</code>. Hiện nó "chạy ở chế độ <strong>evaluate</strong>" (run vẫn chạy, trang insights cho thấy cái gì sẽ bị chặn) và GitHub "sẽ thực thi chính sách mặc định" từ <strong>02/11/2026</strong>. Sau ngày đó, kho public nào còn cần bộ kích hoạt này phải cho phép nó một cách tường minh.</li>
<li><strong><code>allow-unsafe-pr-checkout</code></strong>, một input của <code>actions/checkout</code> phải đặt <code>true</code> thì nó mới chịu checkout đầu nhánh PR từ fork dưới bộ kích hoạt này. Cái tên được chọn "để dễ nhìn thấy khi review và khi phân tích tĩnh". Nó chỉ phủ <code>actions/checkout</code>; <code>git fetch</code>, <code>gh pr checkout</code> hay một artifact tải về thì không.</li>
</ul>
<p>Cùng trang đó thêm hai điều siết chặt: run <code>pull_request_target</code> chỉ được đọc cache của nhánh mặc định (nên không đầu độc được nó), và luật này không riêng gì bộ kích hoạt này — workflow <code>issue_comment</code> hay <code>workflow_run</code> mà tải và chạy mã từ fork cũng là pwn request.</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — "Tôi cần secret cho PR từ fork, nên tôi đổi sang pull_request_target".</strong> Đó là câu nói đứng trước phần lớn sự cố. Hãy tách việc ra: build và test mã của fork bằng <code>pull_request</code>, không secret, rồi tải kết quả lên thành artifact; phần có đặc quyền (bình luận, gắn nhãn, bản xem trước deploy) làm ở workflow thứ hai, coi artifact đó là <em>dữ liệu</em> và không bao giờ thực thi nó.</div>

<h3>Tiêm lệnh qua tiêu đề pull request, dựng lại vô hại</h3>
${slide('ga-14', 10, 'Tiêm lệnh qua tiêu đề PR — dựng lại vô hại với permissions: {}')}
<p>Bài 3.1 đã cho thấy <code>&#36;{{ … }}</code> trong khối <code>run:</code> được thay vào văn bản script <em>trước</em> khi shell đọc nó. Vì thế mọi trường do người lạ kiểm soát đều thành mã shell: tiêu đề và thân PR, tên nhánh, commit message, bình luận issue. Sân tập tái hiện bằng tiêu đề, với một chuỗi mà tác dụng duy nhất là in ra một chữ. Workflow <code>ch14-tiem.yml</code>, không có quyền gì cả:</p>
<pre><code class="language-yaml">permissions: {}
jobs:
  tieu-de:
    runs-on: ubuntu-24.04
    steps:
      - name: CACH SAI - bieu thuc dan thang vao script
        run: echo "Tieu de PR la - &#36;{{ github.event.pull_request.title }}"
      - name: CACH DUNG - qua bien moi truong
        env:
          TIEU_DE: &#36;{{ github.event.pull_request.title }}
        run: echo "Tieu de PR la - $TIEU_DE"</code></pre>
<p>${PR(8)} được mở với tiêu đề <code>ch14: thu tieu de $(echo DA-CHAY-LENH-TU-TIEU-DE)</code>. Run ${RUN(36074698667)}:</p>
<div class="out">GITHUB_TOKEN Permissions
  Metadata: read
##[group]Run echo "Tieu de PR la - ch14: thu tieu de $(echo DA-CHAY-LENH-TU-TIEU-DE)"
shell: /usr/bin/bash -e {0}
Tieu de PR la - ch14: thu tieu de DA-CHAY-LENH-TU-TIEU-DE

##[group]Run echo "Tieu de PR la - $TIEU_DE"
env:
  TIEU_DE: ch14: thu tieu de $(echo DA-CHAY-LENH-TU-TIEU-DE)
Tieu de PR la - ch14: thu tieu de $(echo DA-CHAY-LENH-TU-TIEU-DE)</div>
<p>Bước đầu in ra <code>DA-CHAY-LENH-TU-TIEU-DE</code> mà không còn <code>$(echo …)</code> bao quanh: bash đã chạy phép thay lệnh đến từ tiêu đề. Bước hai in tiêu đề nguyên văn, vì biến môi trường tới bash dưới dạng dữ liệu và dấu nháy kép ngăn nó bị phân tích lại. Dòng tiêu đề nhóm của bước đầu cho thấy script <em>sau</em> phép thay — chữ của kẻ tấn công đã là một phần của script trước khi bất cứ gì chạy. Đó là toàn bộ cơ chế; khoá học cố ý không đi xa hơn một lệnh <code>echo</code> vô hại.</p>
<p>Lớp phòng thủ thứ hai cũng nằm trong log: <code>permissions: {}</code> để lại cho job đúng <code>Metadata: read</code>. Giả sử lệnh bị tiêm muốn làm gì đó bằng token, nó chẳng có gì để dùng. Với run <code>pull_request</code> từ fork, điều đó vốn đã đúng; với run <code>pull_request_target</code>, <code>issue_comment</code> hay <code>push</code> thì không — vì thế cùng một lỗi ở đó là nghiêm trọng.</p>

<h3>Ba máy quét tĩnh, chạy như các check</h3>
${slide('ga-14', 11, 'Ba máy quét tĩnh, mỗi cái bắt một kiểu lỗi')}
<p>Người review bỏ sót injection vì dòng có lỗi trông giống mọi dòng khác. Máy thì không. Workflow <code>ch14-kiem-tinh.yml</code> chạy hai máy quét ở mỗi push và PR: actionlint (tải từ bản phát hành, đối chiếu với <code>checksums.txt</code> được công bố) và zizmor (qua <code>pipx</code>, ghim 1.30.1, <code>--offline</code>). Trên ${PR(6)}, run ${RUN(36074691722)}:</p>
<div class="out">$ ./actionlint -color .github/workflows/ch14-*.yml
.github/workflows/ch14-tiem.yml:15:40: "github.event.pull_request.title" is potentially untrusted.
  avoid using it directly in inline scripts. instead, pass it through an environment variable. [expression]
##[error]Process completed with exit code 1.

$ pipx run zizmor==1.30.1 --offline .github/workflows/ch14-*.yml
error[dangerous-triggers]: use of fundamentally insecure workflow trigger
 --&gt; .github/workflows/ch14-prt.yml:3:1
  = pull_request_target is almost always used insecurely
error[template-injection]: code injection via template expansion
 --&gt; .github/workflows/ch14-tiem.yml:15:40
  = note: audit confidence → High
  = note: this finding has an auto-fix
21 findings (19 suppressed, 1 unsafe fixes): 0 informational, 0 low, 0 medium, 2 high
##[error]Process completed with exit code 14.</div>
<table>
<thead><tr><th>Máy quét</th><th>Tìm thấy gì ở đây</th><th>Giỏi việc gì</th><th>Tốn bao nhiêu trên sân tập</th></tr></thead>
<tbody>
<tr><td>actionlint 1.7.12</td><td>tiêu đề trong <code>run:</code></td><td>cú pháp, kiểu biểu thức, thuộc tính lạ, input không tin cậy trong script, shellcheck cho <code>run:</code></td><td>khoảng 5 giây kể cả tải về</td></tr>
<tr><td>zizmor 1.30.1</td><td>tiêu đề trong <code>run:</code> <strong>và</strong> bộ kích hoạt <code>pull_request_target</code></td><td>kiểm an ninh chuyên biệt: trigger nguy hiểm, quyền thừa, <code>uses:</code> chưa ghim, <code>persist-credentials</code>, đầu độc cache</td><td>khoảng 5 giây qua <code>pipx</code></td></tr>
<tr><td>CodeQL, ngôn ngữ <code>actions</code></td><td>(kết quả nằm ở tab Security — xem dưới)</td><td>truy vấn luồng dữ liệu: tiêm mã, checkout mã không tin cậy, đầu độc artifact và cache, action có lỗ hổng đã biết</td><td>16 giây init + 18 giây phân tích</td></tr>
</tbody>
</table>
<p>Hai chi tiết đo được quan trọng khi bạn nối chúng vào. zizmor thoát với mã <strong>14</strong> khi phát hiện cao nhất ở mức high — không phải 1 — nên một cổng kiểm "mã thoát 1" sẽ bỏ lọt; hãy kiểm "khác 0". Và persona mặc định của zizmor giấu phần lớn thứ nó biết: cùng các tệp đó chạy <code>--persona=pedantic</code> trên máy dựng bài báo 21 phát hiện, trong đó 19 bị ẩn theo mặc định (<code>anonymous-definition</code>, <code>concurrency-limits</code>, <code>undocumented-permissions</code>). Bắt đầu bằng mặc định; siết dần sau.</p>
<p>CodeQL giờ có một ngôn ngữ dành cho workflow. Run ${RUN(36074649064)} (CodeQL 2.27.1, gói truy vấn <code>codeql/actions-queries</code> 0.6.36) in ra các truy vấn nó chạy — trong đó có <code>actions/code-injection/critical</code>, <code>actions/untrusted-checkout/high</code>, <code>actions/artifact-poisoning/critical</code>, <code>actions/cache-poisoning/code-injection</code>, <code>actions/missing-workflow-permissions</code> và <code>actions/vulnerable-action</code> — và kết thúc bằng "CodeQL scanned 7 out of 7 GitHub Actions files in this invocation". Một job ma trận thứ hai phân tích JavaScript của ba gói với <code>build-mode: none</code> trong 35 giây.</p>
<p>Không cái nào thay được cái nào. actionlint không coi <code>pull_request_target</code> là nguy hiểm; zizmor không kiểm kiểu biểu thức kỹ như actionlint; CodeQL lần theo dữ liệu qua các bước và job nhưng chậm hơn và báo vào tab Security thay vì vào log.</p>

<h3>SARIF: biến kết quả quét thành cảnh báo và thành một check</h3>
${slide('ga-14', 12, 'SARIF: kết quả quét thành cảnh báo, và thành một check trên PR')}
<p>SARIF là định dạng JSON mà code scanning nhận từ bất kỳ công cụ nào. Job zizmor ghi nó bằng <code>--format sarif</code> và tải lên bằng <code>github/codeql-action/upload-sarif</code>, cần quyền <code>security-events: write</code>. Log của ${RUN(36074691722)}:</p>
<div class="out">Post-processing sarif files: ["zizmor.sarif"]
Validating zizmor.sarif
Adding fingerprints to SARIF file.
Uploading results
Successfully uploaded results
Analysis upload status is complete.</div>
<p>Lần tải lên đó sinh ra hai thứ. Trên nhánh, các phát hiện thành cảnh báo code scanning, được chống trùng giữa các run nhờ "vân tay". Trên PR, code scanning thêm check riêng của nó — cái <code>zizmor</code> thứ hai trong danh sách ở Bài 14.1 — mà trang của nó ghi: "GitHub Advanced Security / zizmor succeeded … No new alerts in code changed by this pull request". Nó xanh dù tệp có hai phát hiện mức high, vì các phát hiện đó đã có sẵn trên nhánh đích (run push đã tải lên trước). Đó là hành vi có chủ đích: check của code scanning chỉ đỏ với cảnh báo mà PR <em>đưa vào</em>, để một đống tồn đọng cũ không chặn mọi thay đổi mới. Job zizmor thô, thoát 14 với bất kỳ phát hiện nào, là cái chặt hơn trong hai cái; hãy chọn có chủ ý cái nào làm check bắt buộc.</p>
<div class="callout warn">
<p><strong>⏳ Chưa chạy thật trên cloud: đọc chính các cảnh báo.</strong> Tab Security và API cảnh báo code scanning cần một người dùng đã đăng nhập có quyền xem kết quả an ninh; phiên dựng bài không có, nên số lượng và nội dung các cảnh báo CodeQL đưa ra trên <code>ch14-chat-luong</code> không được trích ở đây. Bản thân các lần tải lên ("Successfully uploaded results", "Analysis upload status is complete") nằm trong log ở trên.</p>
</div>

<h3>Dependabot và dependency review: phụ thuộc cũ và phụ thuộc mới</h3>
${slide('ga-14', 13, 'Dependabot sửa phụ thuộc cũ; dependency review chặn phụ thuộc mới')}
<p>Phụ thuộc là phần lớn nhất của chuỗi cung ứng, và GitHub chia việc ra các tính năng mà người ta hay nhầm với nhau:</p>
<table>
<thead><tr><th>Tính năng</th><th>Làm gì</th><th>Bật ở đâu</th></tr></thead>
<tbody>
<tr><td>Dependency graph (đồ thị phụ thuộc)</td><td>đọc manifest và lockfile; mọi thứ bên dưới đều cần nó</td><td>cài đặt của kho</td></tr>
<tr><td>Dependabot alerts</td><td>một cảnh báo cho mỗi phụ thuộc có lỗ hổng đang nằm trong đồ thị</td><td>cài đặt của kho</td></tr>
<tr><td>Dependabot security updates</td><td>với mỗi cảnh báo, một PR lên "phiên bản thấp nhất có bản vá"; sửa cả <em>action</em> có lỗ hổng trong workflow</td><td>cài đặt của kho</td></tr>
<tr><td>Dependabot version updates</td><td>PR theo lịch lên bản mới nhất, dù có lỗ hổng hay không</td><td><code>.github/dependabot.yml</code> ở nhánh mặc định</td></tr>
<tr><td>Dependency review</td><td>trên một PR: phần chênh lệch phụ thuộc và lỗ hổng đã biết trong những gì đang được <em>thêm vào</em></td><td><code>actions/dependency-review-action</code> trong một workflow</td></tr>
</tbody>
</table>
<p>Bốn cái đầu nhìn ngược về những gì kho đang dùng. Dependency review nhìn vào PR: nó là cái duy nhất chặn được một gói có lỗ hổng <em>trước khi</em> nó vào kho. Sân tập đã thử. ${PR(9)} thêm <code>lodash</code> 4.17.20 (một phiên bản đã có advisory công bố) vào gói backend, kèm lockfile, và <code>ch14-phu-thuoc.yml</code> chạy action ghim v5.0.0 với <code>fail-on-severity: moderate</code>. Run ${RUN(36074699591)}:</p>
<div class="out">##[error]Dependency review is not supported on this repository. Please ensure that Dependency graph
is enabled, see https://github.com/cuonghoang1103/ga-san-tap/settings/security_analysis</div>
<p>PR nào cũng đỏ y như vậy, kể cả PR xanh (${RUN(36074689504)}). Action này chỉ là một client mỏng của API dependency review, và API đó cần dependency graph — một cài đặt của kho, đang tắt ở sân tập. Chính điều này đáng nhớ: một cổng dựng trên action này sẽ "đóng" khi đồ thị bị tắt, và nó đỏ với mọi PR, không chỉ PR có lỗ hổng.</p>
<div class="callout warn">
<p><strong>⏳ Chưa chạy thật trên cloud: phán quyết về phụ thuộc có lỗ hổng, và PR của Dependabot.</strong> Bật dependency graph, alerts và security updates cần quyền quản trị kho; version updates cần <code>dependabot.yml</code> trên <code>main</code>, mà chương này không được đụng vào. Workflow và PR đã sẵn sàng, và sẽ cho phán quyết thật ngay khi cài đặt được bật.</p>
</div>
<p>Thêm một hành vi cần tính trước: workflow được kích hoạt bởi PR của Dependabot chạy với <code>GITHUB_TOKEN</code> chỉ đọc, và secret lấy từ kho riêng <strong>Dependabot secrets</strong>, không phải Actions secrets. Một job CI cần mật khẩu registry sẽ đỏ trên PR của Dependabot cho tới khi secret đó được thêm cả vào mục Dependabot.</p>

<h3>Secret scanning và push protection: chặn trước, không báo sau</h3>
${slide('ga-14', 14, 'Secret scanning chặn lần push thay vì báo vụ rò rỉ')}
<p>Chương 6 đã nói phải làm gì khi một secret đã rò (thu hồi trước, dọn lịch sử sau). Secret scanning của GitHub cố chặn vụ rò ngay ở cửa. Docs mô tả hai loại push protection:</p>
<ul>
<li><strong>Push protection cho người dùng</strong> — gắn với tài khoản GitHub của bạn, "bật sẵn theo mặc định", chặn chính bạn đẩy các loại secret được hỗ trợ lên kho public.</li>
<li><strong>Push protection cho kho</strong> — "tắt theo mặc định", admin bật, chặn mọi người đẩy vào kho đó; mỗi lần vượt qua được ghi lại thành cảnh báo.</li>
</ul>
<p>Cả hai chặn secret trong lần push từ dòng lệnh, commit làm trên giao diện web, tệp tải lên, lời gọi REST API và — với kho public — thay đổi làm qua MCP server của GitHub. Tách riêng, secret scanning alerts báo các secret đã nằm trong lịch sử. Máy quét bên thứ ba thêm check của riêng chúng; tài khoản chủ sân tập có cài GitGuardian, vì thế <code>GitGuardian Security Checks</code> xuất hiện trên mọi PR ở Bài 14.1.</p>
<p>Sân tập cố ý không thử đẩy một secret lên, kể cả secret giả đúng định dạng: secret thử trông như thật rồi sẽ nằm trong fork, cache và ảnh chụp màn hình, và chính thói quen đó là rủi ro. Nếu muốn tự thấy cảnh bị chặn, hãy dùng một kho private bỏ đi có bật push protection và một token bạn tạo rồi thu hồi trong vòng một phút.</p>

<h3>Phòng thủ nhiều lớp: mỗi chỗ một lớp</h3>
${slide('ga-14', 15, 'Phòng thủ nhiều lớp cho chuỗi cung ứng — mỗi lớp một chỗ đặt')}
<p>Không một biện pháp nào chặn được tất cả. Cái hiệu quả là một lớp rẻ ở mỗi chỗ mà tấn công có thể lọt vào:</p>
<ul>
<li><strong>Action</strong>: ghim mọi <code>uses:</code> vào SHA đầy đủ kèm chú thích phiên bản (Bài 4.2 — tháng 03/2025 các thẻ của tj-actions/changed-files bị dời sang mã độc, còn ghim SHA thì không bị ảnh hưởng), và để Dependabot cho <code>github-actions</code> giữ chúng luôn mới (Bài 12.4).</li>
<li><strong>Token</strong>: <code>permissions: {}</code> ở đầu mọi workflow, và mỗi job xin đúng cái nó dùng. Lệnh bị tiêm ở trên không làm được gì chính nhờ dòng này.</li>
<li><strong>Chữ không tin cậy</strong>: không bao giờ <code>&#36;{{ github.event.* }}</code> trong <code>run:</code>; luôn <code>env:</code> và biến có nháy kép.</li>
<li><strong>Bộ kích hoạt</strong>: không <code>pull_request_target</code>, trừ khi job chỉ gắn nhãn hoặc bình luận và không bao giờ thực thi mã của PR.</li>
<li><strong>Phát hiện</strong>: actionlint và zizmor làm check cho PR; CodeQL cho <code>actions</code> và ngôn ngữ của bạn trên nhánh mặc định và ban đêm.</li>
<li><strong>Phụ thuộc và secret</strong>: bật dependency graph, dependency review trên PR, bật push protection.</li>
</ul>

<h3>Chạy thử từng bước: một cổng phân tích tĩnh cho workflow của bạn</h3>
<ol>
<li>Trên máy, chạy <code>actionlint</code> và <code>uvx zizmor --offline .github/workflows</code> (hoặc <code>pipx run zizmor</code>) trên kho của bạn và đọc hết mọi phát hiện trước khi sửa gì.</li>
<li>Vá mọi <code>template-injection</code>: chuyển biểu thức vào <code>env:</code> và dùng <code>"$TEN"</code> trong script.</li>
<li>Thêm <code>permissions: {}</code> ở đầu mỗi workflow và quyền tối thiểu cho từng job; chạy lại zizmor tới khi hết <code>excessive-permissions</code>.</li>
<li>Chép các job của <code>ch14-kiem-tinh.yml</code> sang <code>.github/workflows/kiem-tinh.yml</code>, đặt tên job không trùng với thứ gì khác (ví dụ <code>workflow-lint</code> và <code>workflow-audit</code>).</li>
<li>Mở một PR cố ý thêm <code>run: echo "&#36;{{ github.event.pull_request.title }}"</code> vào một workflow; xác nhận cả hai job đỏ và chỉ đúng dòng đó; rồi đóng PR.</li>
<li>Thêm tên các job đó vào <code>needs</code> của job tổng hợp ở Bài 14.1, để cổng bao luôn chúng.</li>
</ol>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: <code>pull_request</code> khác <code>pull_request_target</code> thế nào, và khi nào cái sau nguy hiểm?</strong><br>Đ: <code>pull_request</code> chạy phiên bản workflow của PR, với fork thì token chỉ đọc và không có secret; <code>pull_request_target</code> chạy phiên bản của nhánh mặc định, có secret và token ghi. Nó nguy hiểm khi job checkout và thực thi mã của PR (một "pwn request").</p>
<p><strong>H: Làm sao chặn script injection trong GitHub Actions?</strong><br>Đ: Không bao giờ đặt biểu thức <code>&#36;{{ }}</code> chứa dữ liệu người dùng kiểm soát bên trong <code>run:</code>; đưa qua <code>env:</code> và đặt biến trong nháy kép. Giới hạn token bằng <code>permissions:</code>, và bắt các lần tái phạm bằng actionlint, zizmor hoặc CodeQL cho Actions.</p>
<p><strong>H: Dependabot alerts khác dependency review ra sao?</strong><br>Đ: Alerts báo lỗ hổng trong phụ thuộc đã có trong kho; dependency review chạy trên PR và có thể làm PR đỏ vì lỗ hổng ở phụ thuộc đang được thêm vào. Cả hai đều cần dependency graph.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> kiểm toán workflow của chính kho bạn (api-backend cũng được — chỉ đọc) và biến việc kiểm toán thành một check thường trực.</p><ol>
<li>Chạy actionlint và zizmor trên máy; đếm số phát hiện theo từng rule và ghi lại.</li>
<li>Vá mọi <code>template-injection</code> và thêm các khối <code>permissions:</code>; chạy lại cả hai công cụ.</li>
<li>Thêm workflow phân tích tĩnh hai job ở phần "Chạy thử từng bước" và mở một PR.</li>
<li>Trên một nhánh bỏ đi, đưa lại một chỗ injection và mở PR thứ hai; nhìn xem check nào đỏ.</li>
</ol><p><strong>Đạt khi:</strong> PR đầu xanh với cả hai check mới; PR thứ hai có cả hai check đỏ, cùng chỉ vào một tệp và một dòng; và bạn nói được workflow nào của mình (nếu có) dùng <code>pull_request_target</code>, <code>issue_comment</code> hay <code>workflow_run</code>, và cái nào trong số đó có thực thi mã của PR.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">chuỗi cung ứng (supply chain)</span><span class="v">mọi thứ bản build chạy mà bạn không tự viết: action, phụ thuộc, workflow, mã của PR</span></div>
<div class="kv"><span class="k"><code>pull_request_target</code></span><span class="v">bộ kích hoạt chạy workflow của nhánh mặc định cho một PR, có secret và token ghi</span></div>
<div class="kv"><span class="k">pwn request</span><span class="v">workflow có đặc quyền mà checkout và thực thi mã của PR</span></div>
<div class="kv"><span class="k">script injection (tiêm lệnh)</span><span class="v">chữ không tin cậy được <code>&#36;{{ }}</code> thay vào script <code>run:</code> và shell thực thi</span></div>
<div class="kv"><span class="k">zizmor</span><span class="v">bộ phân tích tĩnh chuyên về an ninh workflow; mã thoát 14 nghĩa là có phát hiện mức high</span></div>
<div class="kv"><span class="k">SARIF</span><span class="v">định dạng JSON cho kết quả phân tích tĩnh; tải lên để thành cảnh báo code scanning và một check trên PR</span></div>
<div class="kv"><span class="k">dependency review</span><span class="v">chênh lệch phụ thuộc của PR kèm lỗ hổng đã biết; cần dependency graph</span></div>
<div class="kv"><span class="k">push protection</span><span class="v">secret scanning từ chối một lần push có secret được hỗ trợ trước khi nó vào kho</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>pull_request_target</code> chạy tệp của nhánh mặc định, có secret; đo thật: 0 run khi tệp chỉ nằm ở nhánh khác. Nó chỉ nguy hiểm khi thực thi mã của PR — vậy đừng bao giờ làm thế.</li>
<li>Kho public có chính sách mặc định chặn <code>pull_request_target</code>, thực thi từ 02/11/2026; <code>actions/checkout</code> cần <code>allow-unsafe-pr-checkout</code> mới chịu lấy đầu nhánh của fork.</li>
<li>Một tiêu đề PR tới bash như MÃ qua <code>&#36;{{ }}</code> và như DỮ LIỆU qua <code>env:</code> — cùng một run, hai bước.</li>
<li>actionlint, zizmor và CodeQL cho <code>actions</code> bắt những thứ khác nhau; chạy hai cái đầu ở mọi PR (zizmor thoát 14 khi có phát hiện high).</li>
<li>SARIF tải lên thành cảnh báo và thành một check chỉ đỏ với cảnh báo mới.</li>
<li>Dependency review là tính năng phụ thuộc duy nhất chặn được trước khi merge, và nó cần bật dependency graph.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Securely using pull_request_target</span><span class="lc-sub">docs.github.com/en/actions/reference/security/securely-using-pull_request_target — pwn request, chính sách mặc định (evaluate, thực thi 02/11/2026), <code>allow-unsafe-pr-checkout</code>, siết chặt.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Secure use reference</span><span class="lc-sub">docs.github.com/en/actions/reference/security/secure-use — script injection, thực hành tốt với dữ liệu không tin cậy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — About dependency review; Dependabot security updates; Push protection</span><span class="lc-sub">docs.github.com/en/code-security/concepts — mỗi tính năng làm gì, cần gì, mặc định ra sao.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">zizmor — tài liệu các audit</span><span class="lc-sub">docs.zizmor.sh/audits — các audit nhắc trong bài: <code>template-injection</code>, <code>dangerous-triggers</code>, <code>excessive-permissions</code>, <code>unpinned-uses</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sân tập — nhánh ch14-chat-luong, PR #8 và #9</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch14-chat-luong — <code>ch14-tiem.yml</code>, <code>ch14-prt.yml</code>, <code>ch14-kiem-tinh.yml</code>, <code>ch14-codeql.yml</code>, <code>ch14-phu-thuoc.yml</code>.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — ảnh nhỏ, ghim digest</span><span class="lc-sub">/courses/docker/learn${REF} — cùng tư duy "ghim thứ bạn không tự viết" áp cho ảnh nền của Dockerfile.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 14.3 ─────────────────────────── */
    {
      title: '14.3 — Releases: GitHub Releases, semantic-release, GHCR, npm, attestations|||14.3 — Phát hành: GitHub Release, semantic-release, GHCR, npm và attestation',
      slug: 'ga-14-3-phat-hanh',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Phát hành chỉ bằng GITHUB_TOKEN, chạy thật ba lượt: gh release create mỗi push, semantic-release đọc commit (1.0.0 → 1.0.1 → không phát hành), notes tự sinh so nhầm với thẻ của dòng khác, ảnh busybox lên GHCR trong 4 giây, gói npm lên GitHub Packages, attestation qua Sigstore + Rekor, và sửa một byte là gh attestation verify trả 404.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.3</span>
<h2>Releases: tags and GitHub Releases, semantic-release, GHCR, npm and artifact attestations</h2>
<p class="lead">A release is four things: a tag that pins a commit, notes that say what changed, artifacts people can download, and — increasingly — proof of where those artifacts came from. All four can be produced inside a workflow with nothing but the job&#39;s own <code>GITHUB_TOKEN</code>. This lesson does it three times in the sandbox and shows two places where the obvious setup quietly does the wrong thing.</p>

<p>Everything here ran on the sandbox branch <code>ch14-phat-hanh</code>, which has two workflows triggered by pushes to that branch only: <code>ch14-phat-hanh.yml</code> (two ways of creating a release) and <code>ch14-anh.yml</code> (a container image on GitHub Container Registry, an npm package on GitHub Packages, and an attestation for each). Three commits were pushed: <code>feat(phat-hanh): …</code>, <code>fix(anh): …</code> and <code>chore: …</code>. The session could not push tags itself — the proxy refuses tag pushes — so every tag and release on this page was created by a workflow job, which is how you would do it anyway.</p>

<h3>Two ways to number a release</h3>
${slide('ga-14', 16, 'Two numbering schemes: by run, or by what the commits say')}
<p>The two jobs in <code>ch14-phat-hanh.yml</code> ran on the same three pushes and numbered them differently:</p>
<table>
<thead><tr><th>Commit</th><th>Job <code>gh-release</code> (by run number)</th><th>Job <code>semantic-release</code> (by commit message)</th></tr></thead>
<tbody>
<tr><td><code>25e8f3f</code> feat(phat-hanh): …</td><td><code>ch14-v0.1.1</code></td><td><code>ch14-sr-v1.0.0</code> — first release</td></tr>
<tr><td><code>d5ff3f5</code> fix(anh): …</td><td><code>ch14-v0.1.2</code></td><td><code>ch14-sr-v1.0.1</code> — patch</td></tr>
<tr><td><code>7c3e444</code> chore: …</td><td><code>ch14-v0.1.3</code></td><td>no release</td></tr>
</tbody>
</table>
<p>Numbering by run is simple and always produces something, including a release for a commit that changed only a comment. Numbering by content needs a convention in commit messages — <a href="https://www.conventionalcommits.org/en/v1.0.0/" target="_blank" rel="noopener">Conventional Commits</a> — and in return the version number carries meaning: <code>fix:</code> is a patch, <code>feat:</code> a minor version, a <code>BREAKING CHANGE:</code> footer (or <code>feat!:</code>) a major one, and <code>chore:</code>, <code>docs:</code>, <code>ci:</code> nothing at all. Libraries other people depend on want the second; an internal app deployed on every merge can live with the first.</p>

<h3>A release from a job: <code>gh release create</code></h3>
<p>The first job is five lines of shell. The GitHub CLI is preinstalled on GitHub-hosted runners and reads its token from <code>GH_TOKEN</code>:</p>
<pre><code class="language-yaml">permissions: {}
concurrency:
  group: ch14-phat-hanh          # two releases must never race
  cancel-in-progress: false
jobs:
  gh-release:
    runs-on: ubuntu-24.04
    permissions:
      contents: write            # create the tag and the release
    steps:
      - env:
          GH_TOKEN: &#36;{{ github.token }}
          GH_REPO: &#36;{{ github.repository }}
          TAG: ch14-v0.1.&#36;{{ github.run_number }}
        run: |
          gh release create "$TAG" --target "$GITHUB_SHA" \\
            --title "ch14 ban thu $TAG" --generate-notes --prerelease
          gh release view "$TAG" --json tagName,name,isPrerelease,targetCommitish,url,body</code></pre>
<p>Run ${RUN(36074744064)}, one second of work:</p>
<div class="out">GITHUB_TOKEN Permissions
  Contents: write
  Metadata: read
https://github.com/cuonghoang1103/ga-san-tap/releases/tag/ch14-v0.1.1
{"body":"**Full Changelog**: https://github.com/cuonghoang1103/ga-san-tap/commits/ch14-v0.1.1",
 "isPrerelease":true,"name":"ch14 ban thu ch14-v0.1.1","tagName":"ch14-v0.1.1",
 "targetCommitish":"25e8f3f545c2780cbd983da2b658dce9b646d920", ...}</div>
<ul>
<li><strong>No checkout was needed.</strong> <code>gh release create</code> with <code>--target</code> asks the API to create the tag on that commit; the job never cloned the repository.</li>
<li><strong><code>--target "$GITHUB_SHA"</code> matters.</strong> Without it, the tag is created on the tip of the default branch — not on the commit this workflow tested.</li>
<li><strong>The release is authored by <code>@github-actions</code></strong>, the identity behind <code>GITHUB_TOKEN</code>. One consequence from the docs, relevant if you planned a "build on release" workflow: events caused by <code>GITHUB_TOKEN</code> (other than <code>workflow_dispatch</code> and <code>repository_dispatch</code>) do not start new workflow runs. A tag pushed this way will not trigger your <code>on: push: tags:</code> workflow. Do the building in the same workflow, or dispatch explicitly.</li>
<li><strong><code>concurrency</code> with <code>cancel-in-progress: false</code></strong> queues a second release behind the first instead of killing it half-way. api-backend&#39;s <code>desktop-release.yml</code> learned the other half in August 2026: queuing alone is not enough when two runs build the same version (v0.5.40 was built twice), so it also refuses to rebuild a version that is already published.</li>
</ul>

<h3>semantic-release: the version comes from the commits</h3>
${slide('ga-14', 17, 'semantic-release reads the commits, picks the number, creates the tag and release')}
<p>Two well-known tools implement "version from commits": release-please (opens a "release pull request" that you merge) and semantic-release (releases directly from the pipeline). The sandbox uses semantic-release, for a practical reason: release-please needs the workflow token to open pull requests, which is a separate repository setting ("Allow GitHub Actions to create and approve pull requests"), while semantic-release needs only <code>contents: write</code>. The configuration, <code>.releaserc.json</code> at the root of the branch:</p>
<pre><code class="language-yaml">{ "branches": ["ch14-phat-hanh"],
  "tagFormat": "ch14-sr-v&#36;{version}",
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/github", { "successComment": false, "failComment": false, "releasedLabels": false }]
  ] }</code></pre>
<p>and the job:</p>
<pre><code class="language-yaml">  semantic-release:
    permissions:
      contents: write
      issues: read
      pull-requests: read
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          fetch-depth: 0              # the whole history and every tag
          persist-credentials: false
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: 24
      - env:
          GITHUB_TOKEN: &#36;{{ github.token }}
        run: npx --yes -p semantic-release@25.0.9 -p @semantic-release/github@12.0.10 semantic-release</code></pre>
<p>The three runs, trimmed to the lines that decide the outcome:</p>
<div class="out"># run 36074744064 (commit 25e8f3f)
Running semantic-release version 25.0.9
Allowed to push to the Git repository
No git tag version found on branch ch14-phat-hanh
Found 7 commits since last release
Analyzing commit: feat(phat-hanh): quy trinh phat hanh ch14 (gh release, semantic-release, GHCR, npm)
The release type for the commit is minor
Analyzing commit: ch01: xoa cron do tre khoi main (...)      The commit should not trigger a release
There is no previous release, the next release version is 1.0.0
Created tag ch14-sr-v1.0.0
Published GitHub release: https://github.com/cuonghoang1103/ga-san-tap/releases/tag/ch14-sr-v1.0.0

# run 36074930320 (commit d5ff3f5)
Found git tag ch14-sr-v1.0.0 associated with version 1.0.0 on branch ch14-phat-hanh
Found 1 commits since last release
Analyzing commit: fix(anh): in ket qua gh attestation verify dang JSON
The release type for the commit is patch
The next release version is 1.0.1
Created tag ch14-sr-v1.0.1

# run 36075147042 (commit 7c3e444)
Analyzing commit: chore: them ghi chu (khong phat hanh)
The commit should not trigger a release
There are no relevant changes, so no new version is released.</div>
<p>The release notes it wrote for 1.0.1 are generated from the commit messages: "1.0.1 (2026-09-24) — Bug Fixes — <strong>anh:</strong> in ket qua gh attestation verify dang JSON (d5ff3f5)". What to take from the log:</p>
<ul>
<li><strong>Give it the whole history.</strong> The tool finds the previous release by walking the tags reachable from the branch, and semantic-release&#39;s own CI recipes ask for <code>fetch-depth: 0</code>. The default checkout (depth 1, no tags) hands it a history with nothing to walk.</li>
<li><strong>The six older commits of the sandbox</strong> ("ch01: …", "khởi tạo sân tập") do not follow the convention, so they were ignored rather than rejected. Adopting the convention later is cheap.</li>
<li><strong>The first run spent 10 of its 17 seconds in <code>npx</code></strong> downloading the tool. Pinning the versions in <code>-p</code> keeps that reproducible; a <code>package.json</code> with a lock file would be the stricter form.</li>
<li><strong>Two deprecation warnings</strong> appeared: "'false' for 'successComment' is deprecated … Use 'successCommentCondition' instead". Tools move; read the warnings in your release job, because it runs rarely and is the last place anyone looks.</li>
</ul>

<h3>Generated notes compare against the newest tag — even another tool&#39;s</h3>
${slide('ga-14', 18, 'Auto-generated notes compare with the “latest” tag, even one from another release line')}
<p>On the second push, the <code>gh-release</code> job created <code>ch14-v0.1.2</code> with <code>--generate-notes</code>. The release page reads:</p>
<div class="out">ch14 ban thu ch14-v0.1.2        Pre-release
Full Changelog: ch14-sr-v1.0.0...ch14-v0.1.2</div>
<p>The "previous" release GitHub chose was <code>ch14-sr-v1.0.0</code> — the tag semantic-release had created twenty seconds earlier on the first push — not <code>ch14-v0.1.1</code>, the previous release of this line. Automatically generated notes pick a previous tag for you, and they know nothing about naming schemes. Two release lines in one repository are common (an app and a library, a desktop client and a web service), so this happens in real projects, and the notes look plausible enough that nobody checks.</p>
<p>The fixes, in order of preference: give each release line its own tool and prefix and pass <code>--notes-start-tag</code> explicitly (<code>gh release create "$TAG" --generate-notes --notes-start-tag "$PREVIOUS_TAG_OF_THIS_LINE"</code>); or configure release-note categories in <code>.github/release.yml</code> and never mix lines in one repository.</p>
<p>api-backend already publishes releases, and its <code>desktop-release.yml</code> shows two further good habits. It creates the release as a <strong>draft</strong>, uploads every file, verifies the list of files, and only then publishes — the order the docs recommend for <em>immutable releases</em>, where the tag and assets are locked the moment a release is published. And it publishes to a <em>different</em> repository (<code>cuonghoang1103/cuongthai-desktop</code>, public so that the auto-updater can download without a token), which <code>GITHUB_TOKEN</code> cannot write to — hence the <code>RELEASE_TOKEN</code> secret there. Same-repository releases never need a personal token.</p>

<div class="pitfall co-tieu-de"><strong>Trap — a tag that does not point at what you tested.</strong> <code>gh release create v1.2.0</code> without <code>--target</code> tags the tip of the default branch at the moment the command runs. If someone merged in between, the release contains code that this run never tested. Always pass <code>--target "$GITHUB_SHA"</code> (or create the tag from the checked-out commit).</div>

<h3>A container image on GHCR with nothing but <code>GITHUB_TOKEN</code></h3>
${slide('ga-14', 19, 'Pushing to GHCR with GITHUB_TOKEN alone — no personal access token')}
<p>The job <code>dung-anh</code> in <code>ch14-anh.yml</code> builds the smallest useful image — <code>busybox:1.37</code> plus one text file — and pushes it to <code>ghcr.io/cuonghoang1103/ga-san-tap</code> with a <code>ch14-anh-&lt;run number&gt;</code> tag:</p>
<pre><code class="language-yaml">    permissions:
      contents: read
      packages: write          # push to GHCR
      id-token: write          # for the attestation below
      attestations: write
      artifact-metadata: write
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with: { persist-credentials: false }
      - uses: docker/login-action@dbcb813823bdd20940b903addbd779551569679f # v4.6.0
        with:
          registry: ghcr.io
          username: &#36;{{ github.actor }}
          password: &#36;{{ github.token }}
      - id: dung
        uses: docker/build-push-action@c3c9e263c25d99ce0380d002d59b67737d91b0dc # v7.4.0
        with:
          context: ch14/anh
          push: true
          tags: ghcr.io/cuonghoang1103/ga-san-tap:ch14-anh-&#36;{{ github.run_number }}
          build-args: PHIEN_BAN=ch14-anh-&#36;{{ github.run_number }}</code></pre>
<p>Run ${RUN(36074744157)}:</p>
<div class="out">Logging into ghcr.io...
Login Succeeded!
#6 [1/3] FROM docker.io/library/busybox:1.37@sha256:bdf57e528e45e4433820e045b29b4597825a1c9e38353532d90a01445013f82e
#7 [2/3] COPY chao.txt /chao.txt
#8 [3/3] RUN echo "phien ban: ch14-anh-1" &gt;&gt; /chao.txt
#11 pushing ghcr.io/cuonghoang1103/ga-san-tap:ch14-anh-1 with docker
#11 DONE 4.0s
Digest
sha256:979f5f0d4eda8cda436a97d47685e1f83efd7e38b0524f88954f22fe1a5bdb13</div>
<p>A second job, <code>kiem-anh</code>, pulled the image by digest and ran it <strong>without logging in</strong>:</p>
<div class="out">Unable to find image 'ghcr.io/cuonghoang1103/ga-san-tap@sha256:979f5f0d…' locally
Status: Downloaded newer image for ghcr.io/cuonghoang1103/ga-san-tap@sha256:979f5f0d…
Xin chao tu anh ch14 tren GHCR
phien ban: ch14-anh-1</div>
<ul>
<li><strong><code>packages: write</code> is the only extra permission for the push.</strong> The package is created on first push, linked to the repository, and — as its package page shows — public, like the repository. The anonymous pull in the second job is the proof.</li>
<li><strong>Use the digest, not the tag, downstream.</strong> <code>build-push-action</code> exposes <code>steps.dung.outputs.digest</code>; the second job received it through a job output and pulled exactly that image. Tags can be moved; digests cannot.</li>
<li><strong>The package page also lists tags you did not create</strong>: <code>sha256-979f5f0d…</code> and <code>sha256-35e48f0f…</code>. Those are where the attestation step stored its signed statements next to each image (next section).</li>
</ul>
<p>api-backend&#39;s <code>deploy-ghcr.yml</code> does the same push with the same permission (<code>packages: write</code>) for two images, backend and frontend. What it does not do yet is the next section. Chapter 15 builds a full multi-stage, multi-platform image; the <a href="/courses/docker/learn${REF}">Docker course</a> covers what goes into the image.</p>

<h3>An npm package on GitHub Packages</h3>
<p>The job <code>goi-npm</code> publishes <code>@cuonghoang1103/ch14-chao</code>, version <code>0.1.&lt;run number&gt;</code>. <code>actions/setup-node</code> with <code>registry-url: https://npm.pkg.github.com</code> writes an <code>.npmrc</code> that reads the token from <code>NODE_AUTH_TOKEN</code>:</p>
<div class="out">npm notice 📦  @cuonghoang1103/ch14-chao@0.1.1
npm notice package size: 394 B
npm notice Publishing to https://npm.pkg.github.com/ with tag latest and default access
+ @cuonghoang1103/ch14-chao@0.1.1</div>
<p>Two rules make or break it: the package name must be scoped to the owner of the repository (<code>@cuonghoang1103/…</code>), and a version can be published only once — which is why the version is derived from the run number here, and from semantic-release&#39;s output in a real library.</p>

<h3>Artifact attestations: proof of where it was built</h3>
${slide('ga-14', 20, 'An attestation: signed proof of which workflow and commit built the image')}
<p>A digest proves that you have the same bytes as someone else. It does not prove who produced them. An <strong>artifact attestation</strong> does: a signed statement, in the SLSA provenance format, that says "this digest was built by this workflow file, at this commit, on this kind of runner". The step is short:</p>
<pre><code class="language-yaml">      - uses: actions/attest@1e69f48acb82d1966a394da916b4c1698aa569d6 # v4.2.2
        with:
          subject-name: ghcr.io/cuonghoang1103/ga-san-tap      # no tag
          subject-digest: &#36;{{ steps.dung.outputs.digest }}
          push-to-registry: true</code></pre>
<p>(<code>actions/attest-build-provenance</code>, which older guides use, is since v4 "simply a wrapper on top of <code>actions/attest</code>"; the docs now show <code>actions/attest</code>.) What the step did, in five seconds of run ${RUN(36074744157)}:</p>
<div class="out">Attestation type: Build Provenance
Attestation created for ghcr.io/cuonghoang1103/ga-san-tap@sha256:979f5f0d4eda8cda436a97d47685e1f83efd7e38b0524f88954f22fe1a5bdb13
Attestation signed using certificate from Public Good Sigstore instance
-----BEGIN CERTIFICATE----- … (valid 23:51:13 → 00:01:13)
Attestation signature uploaded to Rekor transparency log
https://search.sigstore.dev?logIndex=2946211424
Attestation uploaded to repository
https://github.com/cuonghoang1103/ga-san-tap/attestations/50029606
Attestation uploaded to registry
ghcr.io/cuonghoang1103/ga-san-tap@sha256:d72977a417de076bdab2a25021d7b10327ef6a1353afb9316bf30673464be138</div>
<ol>
<li>The job used <code>id-token: write</code> to get an OIDC token (Lesson 6.3) describing itself: repository, workflow, ref, commit.</li>
<li>Sigstore exchanged it for a signing certificate valid for <strong>ten minutes</strong> — long enough to sign, useless to steal.</li>
<li>The signature was written to Rekor, a public append-only log anyone can search.</li>
<li>The attestation was stored in two places: the repository&#39;s attestations API, and the registry next to the image (the extra <code>sha256-…</code> tag).</li>
</ol>
<p>Verification uses the GitHub CLI. After the second push, <code>kiem-anh</code> (run ${RUN(36074930318)}) verified the new image and printed the parts of the answer that matter:</p>
<div class="out">$ gh attestation verify "oci://ghcr.io/cuonghoang1103/ga-san-tap@sha256:35e48f0f…" \\
    --repo cuonghoang1103/ga-san-tap --format json &gt; kq.json
verify exit=0
{
  "sourceRepositoryRef": "refs/heads/ch14-phat-hanh",
  "sourceRepositoryDigest": "d5ff3f5ab01cb041a1c15677c04e773cffb3ed6b",
  "buildSignerURI": "https://github.com/cuonghoang1103/ga-san-tap/.github/workflows/ch14-anh.yml@refs/heads/ch14-phat-hanh",
  "runnerEnvironment": "github-hosted"
}</div>
<p>Without <code>--format json</code>, the first run&#39;s verification printed nothing at all and exited 0 — fine for a gate, useless for a person. In a deploy script you would add <code>--signer-workflow</code> or check <code>buildSignerURI</code> so that only images built by <em>your release workflow on main</em> pass, not any workflow in the repository.</p>
<p>Availability, from the action&#39;s README and the docs: attestations are available for public repositories on every current plan; private and internal repositories need GitHub Enterprise Cloud. That puts them within reach of any open-source project — and of the sandbox — but not of a private repository on a personal plan.</p>

<h3>Change one byte and the proof is gone</h3>
${slide('ga-14', 21, 'Change one byte and the attestation no longer matches — plus the npm package')}
<p>The npm job also attested its tarball (<code>subject-path: ch14/goi-npm/*.tgz</code>), then verified it, then appended a single <code>x</code> to a copy and verified that. Run ${RUN(36074930318)}:</p>
<div class="out">cuonghoang1103-ch14-chao-0.1.2.tgz b55162b2f2feb81a8c4a8b292aa6dc3fd4284deaa628c75e7739bf73f0580a1e
b55162b2f2feb81a8c4a8b292aa6dc3fd4284deaa628c75e7739bf73f0580a1e  ./cuonghoang1103-ch14-chao-0.1.2.tgz
3afdf3c191a8e3e7b7d36d1f7ca7eb34243bbff13db936db33093d256c54ee25  sua.tgz
Error: HTTP 404: Not Found (https://api.github.com/repos/cuonghoang1103/ga-san-tap/attestations/sha256:3afdf3c1…?per_page=30&amp;predicate_type=https%3A%2F%2Fslsa.dev%2Fprovenance%2Fv1)
=&gt; tep bi sua: KHONG co attestation khop (dung nhu mong doi)</div>
<p>The verifier computed the digest of the modified file and asked for attestations of that digest; there are none. Attestations are looked up by content, never by name: <code>sua.tgz</code> could have been renamed to the original file name and the answer would be the same.</p>
<p>One limit to keep straight. An attestation proves <em>provenance</em> — which workflow built these bytes — not <em>correctness</em>. api-backend learned the second half on 18 August 2026, when an image built green, pushed green and deployed green, then crash-looped because a musl base carried a glibc Prisma engine. An attestation would have signed that broken image perfectly. Smoke tests and runtime checks (Chapter 10) remain necessary; attestations answer a different question.</p>

<h3>Run it step by step: release, image and proof in one workflow</h3>
<ol>
<li>Create <code>.github/workflows/phat-hanh.yml</code> on a branch of your own repository, triggered by <code>push</code> to that branch only, with <code>permissions: {}</code> at the top.</li>
<li>Job 1 (<code>contents: write</code>): <code>gh release create "thu-v0.0.&#36;{{ github.run_number }}" --target "$GITHUB_SHA" --generate-notes --prerelease</code>.</li>
<li>Job 2 (<code>packages: write</code>, <code>id-token: write</code>, <code>attestations: write</code>, <code>artifact-metadata: write</code>): log in to GHCR with <code>github.token</code>, build a two-line Dockerfile (<code>FROM busybox</code> + <code>COPY</code>), push, and run <code>actions/attest</code> with the digest output.</li>
<li>Job 3 (<code>needs</code> job 2, <code>attestations: read</code>, <code>packages: read</code>): <code>gh attestation verify oci://ghcr.io/&lt;you&gt;/&lt;repo&gt;@&lt;digest&gt; --repo &lt;you&gt;/&lt;repo&gt; --format json | jq '.[0].verificationResult.signature.certificate.buildSignerURI'</code>.</li>
<li>Push twice. Open the Releases page and read the "Full Changelog" line of the second release — is it comparing with the release you expect?</li>
<li>Open the package page and find the <code>sha256-…</code> tag next to your image.</li>
</ol>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: How do you push an image to GHCR from GitHub Actions without a personal access token?</strong><br>A: Give the job <code>packages: write</code>, log in to <code>ghcr.io</code> with <code>github.actor</code> and <code>github.token</code>, and push. The package is linked to the repository. A PAT is needed only to publish into a different repository or organisation.</p>
<p><strong>Q: What is an artifact attestation, and what does it not prove?</strong><br>A: A Sigstore-signed statement binding an artifact&#39;s digest to the workflow, commit and runner that built it, verifiable with <code>gh attestation verify</code>. It proves provenance, not that the artifact is correct or free of vulnerabilities.</p>
<p><strong>Q: Semantic versioning in CI — how does a pipeline decide the next version?</strong><br>A: From commit messages following Conventional Commits: <code>fix</code> → patch, <code>feat</code> → minor, <code>BREAKING CHANGE</code> → major, others → no release. Tools such as semantic-release or release-please read history since the last tag, so the job needs full history (<code>fetch-depth: 0</code>).</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your project has never had a real release. Produce one, with proof, from a workflow.</p><ol>
<li>Do the six steps of "Run it step by step" above on a branch of your own repository.</li>
<li>Change one line of the Dockerfile and push again; compare the two digests and the two <code>sourceRepositoryDigest</code> values.</li>
<li>Download the image by tag with <code>docker pull</code>, then try <code>gh attestation verify</code> on it by tag and by digest.</li>
<li>Delete the releases and the package versions you created (Releases page, package settings) when you are done.</li>
</ol><p><strong>Done when:</strong> the Releases page lists two releases created by <code>github-actions</code>; <code>gh attestation verify</code> exits 0 for your image and prints a <code>buildSignerURI</code> that names your workflow file; and you can explain why the "Full Changelog" link of the second release compares the tags it compares.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">release</span><span class="v">a tag plus notes plus downloadable assets on the Releases page</span></div>
<div class="kv"><span class="k">Conventional Commits</span><span class="v">commit-message convention (<code>feat:</code>, <code>fix:</code>, <code>BREAKING CHANGE</code>) that tools turn into version numbers</span></div>
<div class="kv"><span class="k">semantic-release</span><span class="v">tool that computes the next version from commits since the last tag and creates tag and release</span></div>
<div class="kv"><span class="k">GHCR</span><span class="v">GitHub Container Registry, <code>ghcr.io</code>; push with <code>packages: write</code> and <code>GITHUB_TOKEN</code></span></div>
<div class="kv"><span class="k">digest</span><span class="v">the SHA-256 of an image or file; unlike a tag it cannot be moved</span></div>
<div class="kv"><span class="k">artifact attestation</span><span class="v">signed SLSA provenance binding a digest to the workflow, commit and runner that built it</span></div>
<div class="kv"><span class="k">Sigstore / Rekor</span><span class="v">the service that issues short-lived signing certificates, and the public log where signatures are recorded</span></div>
<div class="kv"><span class="k">immutable release</span><span class="v">a published release whose tag and assets can no longer be changed; publish from a draft</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>All of it — tag, release, image, package, attestation — ran with <code>GITHUB_TOKEN</code> and per-job permissions; a PAT is only for other repositories.</li>
<li>Numbering by run always releases; numbering by Conventional Commits released 1.0.0, then 1.0.1, then nothing for a <code>chore</code>.</li>
<li><code>--generate-notes</code> compared with another line&#39;s tag (<code>ch14-sr-v1.0.0...ch14-v0.1.2</code>); pass <code>--notes-start-tag</code>.</li>
<li>Always <code>--target "$GITHUB_SHA"</code>; tags created by <code>GITHUB_TOKEN</code> do not trigger further workflows.</li>
<li>The GHCR push took 4 seconds; the package inherited the repository&#39;s public visibility; downstream jobs should use the digest.</li>
<li><code>actions/attest</code> signs via OIDC → Sigstore (10-minute certificate) → Rekor; <code>gh attestation verify</code> finds attestations by digest, so one changed byte gives 404.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using artifact attestations to establish provenance for builds</span><span class="lc-sub">docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations — permissions, binaries and images, SBOM attestations, verification.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/attest — README (v4.2.2)</span><span class="lc-sub">github.com/actions/attest — modes, inputs, outputs, availability by plan.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Immutable releases</span><span class="lc-sub">docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases — locked tags and assets, publish from a draft, release attestations.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Conventional Commits 1.0.0</span><span class="lc-sub">conventionalcommits.org/en/v1.0.0 — the message format semantic-release reads.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sandbox — branch ch14-phat-hanh, releases and package</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/releases · /pkgs/container/ga-san-tap — <code>ch14-phat-hanh.yml</code>, <code>ch14-anh.yml</code>, <code>.releaserc.json</code>.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.3</span>
<h2>Phát hành: thẻ và GitHub Release, semantic-release, GHCR, npm và artifact attestation</h2>
<p class="lead">Một bản phát hành gồm bốn thứ: một thẻ (tag) ghim một commit, ghi chú nói cái gì đã đổi, các sản phẩm người ta tải về được, và — ngày càng phổ biến — bằng chứng về nguồn gốc của các sản phẩm đó. Cả bốn đều làm được trong một workflow chỉ với <code>GITHUB_TOKEN</code> của chính job. Bài này làm ba lượt trên sân tập và chỉ ra hai chỗ mà cách thiết lập hiển nhiên lặng lẽ làm sai.</p>

<p>Mọi thứ ở đây chạy trên nhánh sân tập <code>ch14-phat-hanh</code>, có hai workflow chỉ kích hoạt bởi push vào đúng nhánh đó: <code>ch14-phat-hanh.yml</code> (hai cách tạo release) và <code>ch14-anh.yml</code> (một ảnh container lên GitHub Container Registry, một gói npm lên GitHub Packages, và một attestation cho mỗi thứ). Ba commit được đẩy lên: <code>feat(phat-hanh): …</code>, <code>fix(anh): …</code> và <code>chore: …</code>. Phiên dựng bài không tự đẩy thẻ được — proxy từ chối push thẻ — nên mọi thẻ và release trong trang này đều do một job của workflow tạo ra, mà vốn dĩ bạn cũng nên làm như thế.</p>

<h3>Hai cách đánh số một bản phát hành</h3>
${slide('ga-14', 16, 'Hai cách đánh số: theo lần chạy, hay theo nội dung commit')}
<p>Hai job trong <code>ch14-phat-hanh.yml</code> chạy trên cùng ba lần push và đánh số khác nhau:</p>
<table>
<thead><tr><th>Commit</th><th>Job <code>gh-release</code> (theo số lần chạy)</th><th>Job <code>semantic-release</code> (theo commit message)</th></tr></thead>
<tbody>
<tr><td><code>25e8f3f</code> feat(phat-hanh): …</td><td><code>ch14-v0.1.1</code></td><td><code>ch14-sr-v1.0.0</code> — bản đầu tiên</td></tr>
<tr><td><code>d5ff3f5</code> fix(anh): …</td><td><code>ch14-v0.1.2</code></td><td><code>ch14-sr-v1.0.1</code> — bản vá</td></tr>
<tr><td><code>7c3e444</code> chore: …</td><td><code>ch14-v0.1.3</code></td><td>không phát hành</td></tr>
</tbody>
</table>
<p>Đánh số theo lần chạy thì đơn giản và lúc nào cũng ra một bản, kể cả cho commit chỉ sửa một dòng chú thích. Đánh số theo nội dung cần một quy ước cho commit message — <a href="https://www.conventionalcommits.org/en/v1.0.0/" target="_blank" rel="noopener">Conventional Commits</a> — và đổi lại, số phiên bản mang ý nghĩa: <code>fix:</code> là bản vá (patch), <code>feat:</code> là bản nhỏ (minor), chân trang <code>BREAKING CHANGE:</code> (hoặc <code>feat!:</code>) là bản lớn (major), còn <code>chore:</code>, <code>docs:</code>, <code>ci:</code> thì không ra gì cả. Thư viện mà người khác phụ thuộc vào cần cách thứ hai; một app nội bộ deploy mỗi lần merge thì sống được với cách thứ nhất.</p>

<h3>Tạo release từ một job: <code>gh release create</code></h3>
<p>Job đầu chỉ là năm dòng shell. GitHub CLI có sẵn trên runner của GitHub và đọc token từ <code>GH_TOKEN</code>:</p>
<pre><code class="language-yaml">permissions: {}
concurrency:
  group: ch14-phat-hanh          # hai lần phát hành không được đua nhau
  cancel-in-progress: false
jobs:
  gh-release:
    runs-on: ubuntu-24.04
    permissions:
      contents: write            # tạo thẻ và release
    steps:
      - env:
          GH_TOKEN: &#36;{{ github.token }}
          GH_REPO: &#36;{{ github.repository }}
          TAG: ch14-v0.1.&#36;{{ github.run_number }}
        run: |
          gh release create "$TAG" --target "$GITHUB_SHA" \\
            --title "ch14 ban thu $TAG" --generate-notes --prerelease
          gh release view "$TAG" --json tagName,name,isPrerelease,targetCommitish,url,body</code></pre>
<p>Run ${RUN(36074744064)}, một giây làm việc:</p>
<div class="out">GITHUB_TOKEN Permissions
  Contents: write
  Metadata: read
https://github.com/cuonghoang1103/ga-san-tap/releases/tag/ch14-v0.1.1
{"body":"**Full Changelog**: https://github.com/cuonghoang1103/ga-san-tap/commits/ch14-v0.1.1",
 "isPrerelease":true,"name":"ch14 ban thu ch14-v0.1.1","tagName":"ch14-v0.1.1",
 "targetCommitish":"25e8f3f545c2780cbd983da2b658dce9b646d920", ...}</div>
<ul>
<li><strong>Không cần checkout.</strong> <code>gh release create</code> với <code>--target</code> nhờ API tạo thẻ trên commit đó; job chưa từng clone kho.</li>
<li><strong><code>--target "$GITHUB_SHA"</code> quan trọng.</strong> Thiếu nó, thẻ được tạo ở đầu nhánh mặc định — không phải commit mà workflow này đã kiểm.</li>
<li><strong>Release do <code>@github-actions</code> tạo</strong>, danh tính đứng sau <code>GITHUB_TOKEN</code>. Một hệ quả từ docs, đáng nhớ nếu bạn định làm workflow "build khi có release": sự kiện do <code>GITHUB_TOKEN</code> gây ra (trừ <code>workflow_dispatch</code> và <code>repository_dispatch</code>) không khởi động run mới. Thẻ đẩy theo cách này sẽ không kích hoạt workflow <code>on: push: tags:</code> của bạn. Hãy build ngay trong cùng workflow, hoặc dispatch một cách tường minh.</li>
<li><strong><code>concurrency</code> với <code>cancel-in-progress: false</code></strong> xếp lần phát hành thứ hai vào hàng sau lần đầu thay vì giết nó giữa chừng. <code>desktop-release.yml</code> của api-backend học nốt nửa kia vào tháng 08/2026: chỉ xếp hàng là chưa đủ khi hai lượt cùng dựng một số phiên bản (v0.5.40 bị dựng hai lần), nên nó còn từ chối dựng lại một phiên bản đã công bố.</li>
</ul>

<h3>semantic-release: phiên bản lấy từ commit</h3>
${slide('ga-14', 17, 'semantic-release đọc commit, tự chọn số, tự tạo thẻ và release')}
<p>Có hai công cụ nổi tiếng làm "phiên bản từ commit": release-please (mở một "release PR" để bạn merge) và semantic-release (phát hành thẳng từ pipeline). Sân tập dùng semantic-release, vì một lý do thực tế: release-please cần token của workflow mở được PR, đó là một cài đặt riêng của kho ("Allow GitHub Actions to create and approve pull requests"), còn semantic-release chỉ cần <code>contents: write</code>. Cấu hình, tệp <code>.releaserc.json</code> ở gốc nhánh:</p>
<pre><code class="language-yaml">{ "branches": ["ch14-phat-hanh"],
  "tagFormat": "ch14-sr-v&#36;{version}",
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/github", { "successComment": false, "failComment": false, "releasedLabels": false }]
  ] }</code></pre>
<p>và job:</p>
<pre><code class="language-yaml">  semantic-release:
    permissions:
      contents: write
      issues: read
      pull-requests: read
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          fetch-depth: 0              # toàn bộ lịch sử và mọi thẻ
          persist-credentials: false
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: 24
      - env:
          GITHUB_TOKEN: &#36;{{ github.token }}
        run: npx --yes -p semantic-release@25.0.9 -p @semantic-release/github@12.0.10 semantic-release</code></pre>
<p>Ba lần chạy, rút gọn còn những dòng quyết định kết quả:</p>
<div class="out"># run 36074744064 (commit 25e8f3f)
Running semantic-release version 25.0.9
Allowed to push to the Git repository
No git tag version found on branch ch14-phat-hanh
Found 7 commits since last release
Analyzing commit: feat(phat-hanh): quy trinh phat hanh ch14 (gh release, semantic-release, GHCR, npm)
The release type for the commit is minor
Analyzing commit: ch01: xoa cron do tre khoi main (...)      The commit should not trigger a release
There is no previous release, the next release version is 1.0.0
Created tag ch14-sr-v1.0.0
Published GitHub release: https://github.com/cuonghoang1103/ga-san-tap/releases/tag/ch14-sr-v1.0.0

# run 36074930320 (commit d5ff3f5)
Found git tag ch14-sr-v1.0.0 associated with version 1.0.0 on branch ch14-phat-hanh
Found 1 commits since last release
Analyzing commit: fix(anh): in ket qua gh attestation verify dang JSON
The release type for the commit is patch
The next release version is 1.0.1
Created tag ch14-sr-v1.0.1

# run 36075147042 (commit 7c3e444)
Analyzing commit: chore: them ghi chu (khong phat hanh)
The commit should not trigger a release
There are no relevant changes, so no new version is released.</div>
<p>Release notes nó viết cho 1.0.1 sinh từ commit message: "1.0.1 (2026-09-24) — Bug Fixes — <strong>anh:</strong> in ket qua gh attestation verify dang JSON (d5ff3f5)". Rút ra gì từ log:</p>
<ul>
<li><strong>Đưa cho nó toàn bộ lịch sử.</strong> Công cụ tìm bản phát hành trước bằng cách đi dọc các thẻ với tới được từ nhánh, và chính các công thức CI của semantic-release đòi <code>fetch-depth: 0</code>. Checkout mặc định (độ sâu 1, không thẻ) trao cho nó một lịch sử chẳng có gì để đi.</li>
<li><strong>Sáu commit cũ của sân tập</strong> ("ch01: …", "khởi tạo sân tập") không theo quy ước, nên chúng bị bỏ qua chứ không bị từ chối. Áp dụng quy ước muộn cũng rẻ.</li>
<li><strong>Lần đầu tốn 10 trong 17 giây cho <code>npx</code></strong> tải công cụ. Ghim phiên bản trong <code>-p</code> giữ cho nó tái lập được; một <code>package.json</code> có lockfile là dạng chặt hơn.</li>
<li><strong>Có hai cảnh báo ngưng hỗ trợ</strong>: "'false' for 'successComment' is deprecated … Use 'successCommentCondition' instead". Công cụ thay đổi; hãy đọc cảnh báo trong job phát hành, vì nó hiếm khi chạy và là chỗ cuối cùng người ta nhìn vào.</li>
</ul>

<h3>Notes tự sinh so với thẻ mới nhất — kể cả thẻ của công cụ khác</h3>
${slide('ga-14', 18, 'Notes tự sinh so với thẻ “mới nhất”, kể cả thẻ của một dòng phát hành khác')}
<p>Ở lần push thứ hai, job <code>gh-release</code> tạo <code>ch14-v0.1.2</code> với <code>--generate-notes</code>. Trang release ghi:</p>
<div class="out">ch14 ban thu ch14-v0.1.2        Pre-release
Full Changelog: ch14-sr-v1.0.0...ch14-v0.1.2</div>
<p>"Bản trước" mà GitHub chọn là <code>ch14-sr-v1.0.0</code> — thẻ semantic-release tạo hai mươi giây trước đó ở lần push đầu — không phải <code>ch14-v0.1.1</code>, bản trước của chính dòng này. Notes tự sinh tự chọn thẻ trước cho bạn, và chúng không biết gì về quy ước đặt tên. Hai dòng phát hành trong một kho là chuyện thường (app và thư viện, client desktop và dịch vụ web), nên chuyện này xảy ra ở dự án thật, và notes trông đủ hợp lý để không ai kiểm lại.</p>
<p>Cách vá, theo thứ tự nên dùng: mỗi dòng phát hành một công cụ, một tiền tố, và truyền <code>--notes-start-tag</code> tường minh (<code>gh release create "$TAG" --generate-notes --notes-start-tag "$THE_TRUOC_CUA_DONG_NAY"</code>); hoặc cấu hình nhóm ghi chú trong <code>.github/release.yml</code> và không bao giờ trộn hai dòng trong một kho.</p>
<p>api-backend đã phát hành thật, và <code>desktop-release.yml</code> của nó cho thấy thêm hai thói quen tốt. Nó tạo release ở dạng <strong>nháp</strong>, tải mọi tệp lên, kiểm lại danh sách tệp, rồi mới công bố — đúng trình tự docs khuyên cho <em>immutable releases</em> (bản phát hành bất biến), nơi thẻ và tệp bị khoá ngay khi release được công bố. Và nó công bố sang một kho <em>khác</em> (<code>cuonghoang1103/cuongthai-desktop</code>, public để trình tự cập nhật tải được mà không cần token), nơi <code>GITHUB_TOKEN</code> không ghi được — vì thế ở đó có secret <code>RELEASE_TOKEN</code>. Release trong cùng kho thì không bao giờ cần token cá nhân.</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — một thẻ không trỏ vào thứ bạn đã kiểm.</strong> <code>gh release create v1.2.0</code> không có <code>--target</code> sẽ gắn thẻ vào đầu nhánh mặc định ở đúng lúc lệnh chạy. Nếu ai đó vừa merge xen giữa, bản phát hành chứa mã mà run này chưa từng kiểm. Luôn truyền <code>--target "$GITHUB_SHA"</code> (hoặc tạo thẻ từ commit đã checkout).</div>

<h3>Một ảnh container lên GHCR chỉ với <code>GITHUB_TOKEN</code></h3>
${slide('ga-14', 19, 'Đẩy lên GHCR chỉ bằng GITHUB_TOKEN — không cần token cá nhân')}
<p>Job <code>dung-anh</code> trong <code>ch14-anh.yml</code> dựng ảnh nhỏ nhất còn có ích — <code>busybox:1.37</code> cộng một tệp chữ — và đẩy lên <code>ghcr.io/cuonghoang1103/ga-san-tap</code> với thẻ <code>ch14-anh-&lt;số lần chạy&gt;</code>:</p>
<pre><code class="language-yaml">    permissions:
      contents: read
      packages: write          # đẩy lên GHCR
      id-token: write          # cho attestation ở dưới
      attestations: write
      artifact-metadata: write
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with: { persist-credentials: false }
      - uses: docker/login-action@dbcb813823bdd20940b903addbd779551569679f # v4.6.0
        with:
          registry: ghcr.io
          username: &#36;{{ github.actor }}
          password: &#36;{{ github.token }}
      - id: dung
        uses: docker/build-push-action@c3c9e263c25d99ce0380d002d59b67737d91b0dc # v7.4.0
        with:
          context: ch14/anh
          push: true
          tags: ghcr.io/cuonghoang1103/ga-san-tap:ch14-anh-&#36;{{ github.run_number }}
          build-args: PHIEN_BAN=ch14-anh-&#36;{{ github.run_number }}</code></pre>
<p>Run ${RUN(36074744157)}:</p>
<div class="out">Logging into ghcr.io...
Login Succeeded!
#6 [1/3] FROM docker.io/library/busybox:1.37@sha256:bdf57e528e45e4433820e045b29b4597825a1c9e38353532d90a01445013f82e
#7 [2/3] COPY chao.txt /chao.txt
#8 [3/3] RUN echo "phien ban: ch14-anh-1" &gt;&gt; /chao.txt
#11 pushing ghcr.io/cuonghoang1103/ga-san-tap:ch14-anh-1 with docker
#11 DONE 4.0s
Digest
sha256:979f5f0d4eda8cda436a97d47685e1f83efd7e38b0524f88954f22fe1a5bdb13</div>
<p>Job thứ hai, <code>kiem-anh</code>, kéo ảnh về theo digest và chạy nó <strong>mà không đăng nhập</strong>:</p>
<div class="out">Unable to find image 'ghcr.io/cuonghoang1103/ga-san-tap@sha256:979f5f0d…' locally
Status: Downloaded newer image for ghcr.io/cuonghoang1103/ga-san-tap@sha256:979f5f0d…
Xin chao tu anh ch14 tren GHCR
phien ban: ch14-anh-1</div>
<ul>
<li><strong><code>packages: write</code> là quyền thêm duy nhất cho việc đẩy.</strong> Gói được tạo ở lần đẩy đầu, gắn với kho, và — như trang gói cho thấy — public, giống kho. Lần kéo ẩn danh ở job thứ hai là bằng chứng.</li>
<li><strong>Phía sau hãy dùng digest, không dùng thẻ.</strong> <code>build-push-action</code> xuất <code>steps.dung.outputs.digest</code>; job thứ hai nhận nó qua output của job và kéo đúng ảnh đó. Thẻ dời được; digest thì không.</li>
<li><strong>Trang gói còn liệt kê những thẻ bạn không tạo</strong>: <code>sha256-979f5f0d…</code> và <code>sha256-35e48f0f…</code>. Đó là chỗ bước attestation cất các tuyên bố đã ký ngay cạnh từng ảnh (phần tiếp theo).</li>
</ul>
<p><code>deploy-ghcr.yml</code> của api-backend làm đúng việc đẩy này với đúng quyền đó (<code>packages: write</code>) cho hai ảnh, backend và frontend. Thứ nó chưa làm là phần tiếp theo. Chương 15 dựng một ảnh multi-stage, đa nền tảng hoàn chỉnh; <a href="/courses/docker/learn${REF}">khoá Docker</a> nói về những gì nằm trong ảnh.</p>

<h3>Một gói npm lên GitHub Packages</h3>
<p>Job <code>goi-npm</code> công bố <code>@cuonghoang1103/ch14-chao</code>, phiên bản <code>0.1.&lt;số lần chạy&gt;</code>. <code>actions/setup-node</code> với <code>registry-url: https://npm.pkg.github.com</code> ghi một tệp <code>.npmrc</code> đọc token từ <code>NODE_AUTH_TOKEN</code>:</p>
<div class="out">npm notice 📦  @cuonghoang1103/ch14-chao@0.1.1
npm notice package size: 394 B
npm notice Publishing to https://npm.pkg.github.com/ with tag latest and default access
+ @cuonghoang1103/ch14-chao@0.1.1</div>
<p>Hai luật quyết định thành hay bại: tên gói phải có scope là chủ của kho (<code>@cuonghoang1103/…</code>), và mỗi phiên bản chỉ công bố được một lần — vì thế ở đây phiên bản lấy từ số lần chạy, còn ở một thư viện thật thì lấy từ kết quả của semantic-release.</p>

<h3>Artifact attestation: bằng chứng về nơi nó được dựng</h3>
${slide('ga-14', 20, 'Attestation: bằng chứng đã ký về workflow và commit đã dựng ra ảnh')}
<p>Một digest chứng minh bạn có cùng những byte với người khác. Nó không chứng minh ai đã tạo ra chúng. Một <strong>artifact attestation</strong> (chứng thực sản phẩm) thì có: một tuyên bố đã ký, theo định dạng SLSA provenance, nói rằng "digest này được dựng bởi tệp workflow này, ở commit này, trên loại runner này". Bước làm rất ngắn:</p>
<pre><code class="language-yaml">      - uses: actions/attest@1e69f48acb82d1966a394da916b4c1698aa569d6 # v4.2.2
        with:
          subject-name: ghcr.io/cuonghoang1103/ga-san-tap      # không kèm thẻ
          subject-digest: &#36;{{ steps.dung.outputs.digest }}
          push-to-registry: true</code></pre>
<p>(<code>actions/attest-build-provenance</code>, mà các hướng dẫn cũ dùng, từ v4 "chỉ là một lớp bọc trên <code>actions/attest</code>"; docs hiện dùng <code>actions/attest</code>.) Bước này đã làm gì, trong năm giây của run ${RUN(36074744157)}:</p>
<div class="out">Attestation type: Build Provenance
Attestation created for ghcr.io/cuonghoang1103/ga-san-tap@sha256:979f5f0d4eda8cda436a97d47685e1f83efd7e38b0524f88954f22fe1a5bdb13
Attestation signed using certificate from Public Good Sigstore instance
-----BEGIN CERTIFICATE----- … (hiệu lực 23:51:13 → 00:01:13)
Attestation signature uploaded to Rekor transparency log
https://search.sigstore.dev?logIndex=2946211424
Attestation uploaded to repository
https://github.com/cuonghoang1103/ga-san-tap/attestations/50029606
Attestation uploaded to registry
ghcr.io/cuonghoang1103/ga-san-tap@sha256:d72977a417de076bdab2a25021d7b10327ef6a1353afb9316bf30673464be138</div>
<ol>
<li>Job dùng <code>id-token: write</code> để xin một token OIDC (Bài 6.3) mô tả chính nó: kho, workflow, ref, commit.</li>
<li>Sigstore đổi token đó lấy một chứng chỉ ký có hiệu lực <strong>mười phút</strong> — đủ để ký, vô dụng nếu bị lấy trộm.</li>
<li>Chữ ký được ghi vào Rekor, một nhật ký công khai chỉ-ghi-thêm mà ai cũng tra được.</li>
<li>Attestation được cất ở hai nơi: API attestations của kho, và registry ngay cạnh ảnh (thẻ <code>sha256-…</code> thừa ra).</li>
</ol>
<p>Kiểm chứng dùng GitHub CLI. Sau lần push thứ hai, <code>kiem-anh</code> (run ${RUN(36074930318)}) kiểm ảnh mới và in ra những phần quan trọng của câu trả lời:</p>
<div class="out">$ gh attestation verify "oci://ghcr.io/cuonghoang1103/ga-san-tap@sha256:35e48f0f…" \\
    --repo cuonghoang1103/ga-san-tap --format json &gt; kq.json
verify exit=0
{
  "sourceRepositoryRef": "refs/heads/ch14-phat-hanh",
  "sourceRepositoryDigest": "d5ff3f5ab01cb041a1c15677c04e773cffb3ed6b",
  "buildSignerURI": "https://github.com/cuonghoang1103/ga-san-tap/.github/workflows/ch14-anh.yml@refs/heads/ch14-phat-hanh",
  "runnerEnvironment": "github-hosted"
}</div>
<p>Không có <code>--format json</code>, lần kiểm ở run đầu không in ra gì cả và thoát 0 — đủ cho một cổng, vô dụng cho con người. Trong script deploy, bạn nên thêm <code>--signer-workflow</code> hoặc kiểm <code>buildSignerURI</code> để chỉ ảnh do <em>workflow phát hành của bạn trên main</em> dựng mới qua, chứ không phải bất kỳ workflow nào trong kho.</p>
<p>Phạm vi, theo README của action và docs: attestation có cho kho public ở mọi gói hiện hành; kho private và internal cần GitHub Enterprise Cloud. Nghĩa là mọi dự án mã nguồn mở — và sân tập — dùng được, còn kho private ở gói cá nhân thì không.</p>

<h3>Sửa một byte là bằng chứng biến mất</h3>
${slide('ga-14', 21, 'Sửa một byte là attestation không còn khớp — và gói npm')}
<p>Job npm cũng chứng thực tệp nén của nó (<code>subject-path: ch14/goi-npm/*.tgz</code>), kiểm nó, rồi nối thêm đúng một chữ <code>x</code> vào một bản sao và kiểm bản sao đó. Run ${RUN(36074930318)}:</p>
<div class="out">cuonghoang1103-ch14-chao-0.1.2.tgz b55162b2f2feb81a8c4a8b292aa6dc3fd4284deaa628c75e7739bf73f0580a1e
b55162b2f2feb81a8c4a8b292aa6dc3fd4284deaa628c75e7739bf73f0580a1e  ./cuonghoang1103-ch14-chao-0.1.2.tgz
3afdf3c191a8e3e7b7d36d1f7ca7eb34243bbff13db936db33093d256c54ee25  sua.tgz
Error: HTTP 404: Not Found (https://api.github.com/repos/cuonghoang1103/ga-san-tap/attestations/sha256:3afdf3c1…?per_page=30&amp;predicate_type=https%3A%2F%2Fslsa.dev%2Fprovenance%2Fv1)
=&gt; tep bi sua: KHONG co attestation khop (dung nhu mong doi)</div>
<p>Bộ kiểm tính digest của tệp đã sửa rồi hỏi attestation cho digest đó; không có cái nào. Attestation được tra theo nội dung, không bao giờ theo tên: đổi tên <code>sua.tgz</code> thành tên tệp gốc thì câu trả lời vẫn y như vậy.</p>
<p>Một giới hạn cần nắm cho thẳng. Attestation chứng minh <em>nguồn gốc</em> — workflow nào dựng ra các byte này — không chứng minh <em>tính đúng</em>. api-backend học nửa sau vào ngày 18/08/2026, khi một ảnh build xanh, đẩy xanh, tráo xanh, rồi khởi động lại vô tận vì nền musl mang engine Prisma glibc. Một attestation hẳn đã ký cái ảnh hỏng đó hoàn hảo. Smoke test và kiểm tra lúc chạy (Chương 10) vẫn cần; attestation trả lời một câu hỏi khác.</p>

<h3>Chạy thử từng bước: release, ảnh và bằng chứng trong một workflow</h3>
<ol>
<li>Tạo <code>.github/workflows/phat-hanh.yml</code> trên một nhánh của kho bạn, chỉ kích hoạt bởi <code>push</code> vào nhánh đó, có <code>permissions: {}</code> ở đầu.</li>
<li>Job 1 (<code>contents: write</code>): <code>gh release create "thu-v0.0.&#36;{{ github.run_number }}" --target "$GITHUB_SHA" --generate-notes --prerelease</code>.</li>
<li>Job 2 (<code>packages: write</code>, <code>id-token: write</code>, <code>attestations: write</code>, <code>artifact-metadata: write</code>): đăng nhập GHCR bằng <code>github.token</code>, dựng một Dockerfile hai dòng (<code>FROM busybox</code> + <code>COPY</code>), đẩy lên, và chạy <code>actions/attest</code> với output digest.</li>
<li>Job 3 (<code>needs</code> job 2, <code>attestations: read</code>, <code>packages: read</code>): <code>gh attestation verify oci://ghcr.io/&lt;bạn&gt;/&lt;kho&gt;@&lt;digest&gt; --repo &lt;bạn&gt;/&lt;kho&gt; --format json | jq '.[0].verificationResult.signature.certificate.buildSignerURI'</code>.</li>
<li>Push hai lần. Mở trang Releases và đọc dòng "Full Changelog" của bản thứ hai — nó có so với bản bạn mong đợi không?</li>
<li>Mở trang gói và tìm thẻ <code>sha256-…</code> nằm cạnh ảnh của bạn.</li>
</ol>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Làm sao đẩy ảnh lên GHCR từ GitHub Actions mà không cần personal access token?</strong><br>Đ: Cho job quyền <code>packages: write</code>, đăng nhập <code>ghcr.io</code> bằng <code>github.actor</code> và <code>github.token</code>, rồi đẩy. Gói được gắn với kho. PAT chỉ cần khi công bố sang một kho hoặc tổ chức khác.</p>
<p><strong>H: Artifact attestation là gì, và nó KHÔNG chứng minh điều gì?</strong><br>Đ: Một tuyên bố ký bằng Sigstore, gắn digest của sản phẩm với workflow, commit và runner đã dựng nó, kiểm được bằng <code>gh attestation verify</code>. Nó chứng minh nguồn gốc, không chứng minh sản phẩm đúng hay không có lỗ hổng.</p>
<p><strong>H: Semantic versioning trong CI — pipeline quyết định phiên bản kế tiếp thế nào?</strong><br>Đ: Từ commit message theo Conventional Commits: <code>fix</code> → patch, <code>feat</code> → minor, <code>BREAKING CHANGE</code> → major, còn lại → không phát hành. Các công cụ như semantic-release hay release-please đọc lịch sử từ thẻ gần nhất, nên job cần toàn bộ lịch sử (<code>fetch-depth: 0</code>).</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> dự án của bạn chưa từng có một bản phát hành thật. Tạo một bản, kèm bằng chứng, từ một workflow.</p><ol>
<li>Làm sáu bước ở phần "Chạy thử từng bước" trên một nhánh của kho bạn.</li>
<li>Đổi một dòng trong Dockerfile rồi push lại; so hai digest và hai giá trị <code>sourceRepositoryDigest</code>.</li>
<li>Kéo ảnh về theo thẻ bằng <code>docker pull</code>, rồi thử <code>gh attestation verify</code> trên nó theo thẻ và theo digest.</li>
<li>Xoá các release và các phiên bản gói bạn đã tạo (trang Releases, cài đặt gói) khi xong.</li>
</ol><p><strong>Đạt khi:</strong> trang Releases liệt kê hai bản do <code>github-actions</code> tạo; <code>gh attestation verify</code> thoát 0 với ảnh của bạn và in ra một <code>buildSignerURI</code> nêu đúng tệp workflow của bạn; và bạn giải thích được vì sao liên kết "Full Changelog" của bản thứ hai so sánh đúng hai thẻ mà nó so.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">release (bản phát hành)</span><span class="v">một thẻ cộng ghi chú cộng các tệp tải về được, trên trang Releases</span></div>
<div class="kv"><span class="k">Conventional Commits</span><span class="v">quy ước commit message (<code>feat:</code>, <code>fix:</code>, <code>BREAKING CHANGE</code>) mà công cụ đổi thành số phiên bản</span></div>
<div class="kv"><span class="k">semantic-release</span><span class="v">công cụ tính phiên bản kế tiếp từ các commit kể từ thẻ gần nhất, rồi tạo thẻ và release</span></div>
<div class="kv"><span class="k">GHCR</span><span class="v">GitHub Container Registry, <code>ghcr.io</code>; đẩy bằng <code>packages: write</code> và <code>GITHUB_TOKEN</code></span></div>
<div class="kv"><span class="k">digest</span><span class="v">SHA-256 của một ảnh hay tệp; khác thẻ, nó không dời được</span></div>
<div class="kv"><span class="k">artifact attestation (chứng thực sản phẩm)</span><span class="v">SLSA provenance đã ký, gắn một digest với workflow, commit và runner đã dựng nó</span></div>
<div class="kv"><span class="k">Sigstore / Rekor</span><span class="v">dịch vụ cấp chứng chỉ ký sống ngắn, và nhật ký công khai nơi chữ ký được ghi lại</span></div>
<div class="kv"><span class="k">immutable release (bản bất biến)</span><span class="v">bản đã công bố mà thẻ và tệp không đổi được nữa; nên công bố từ bản nháp</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tất cả — thẻ, release, ảnh, gói, attestation — chạy bằng <code>GITHUB_TOKEN</code> với quyền theo từng job; PAT chỉ để ghi sang kho khác.</li>
<li>Đánh số theo lần chạy thì lúc nào cũng phát hành; theo Conventional Commits thì ra 1.0.0, rồi 1.0.1, rồi không gì cả với một commit <code>chore</code>.</li>
<li><code>--generate-notes</code> so với thẻ của dòng khác (<code>ch14-sr-v1.0.0...ch14-v0.1.2</code>); hãy truyền <code>--notes-start-tag</code>.</li>
<li>Luôn <code>--target "$GITHUB_SHA"</code>; thẻ do <code>GITHUB_TOKEN</code> tạo không kích hoạt thêm workflow nào.</li>
<li>Đẩy lên GHCR mất 4 giây; gói thừa hưởng chế độ public của kho; job phía sau nên dùng digest.</li>
<li><code>actions/attest</code> ký qua OIDC → Sigstore (chứng chỉ 10 phút) → Rekor; <code>gh attestation verify</code> tra theo digest, nên đổi một byte là 404.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using artifact attestations to establish provenance for builds</span><span class="lc-sub">docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations — quyền, tệp nhị phân và ảnh, SBOM, kiểm chứng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/attest — README (v4.2.2)</span><span class="lc-sub">github.com/actions/attest — các chế độ, input, output, phạm vi theo gói.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Immutable releases</span><span class="lc-sub">docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases — khoá thẻ và tệp, công bố từ bản nháp, release attestation.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Conventional Commits 1.0.0</span><span class="lc-sub">conventionalcommits.org/en/v1.0.0 — định dạng message mà semantic-release đọc.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sân tập — nhánh ch14-phat-hanh, các release và gói</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/releases · /pkgs/container/ga-san-tap — <code>ch14-phat-hanh.yml</code>, <code>ch14-anh.yml</code>, <code>.releaserc.json</code>.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — kéo ảnh theo digest khi deploy</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — nơi "kiểm attestation trước khi tráo ảnh" sẽ được đặt vào quy trình thật.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 14.4 ─────────────────────────── */
    {
      title: '14.4 — CI for a monorepo: detecting what changed, dynamic matrices and one required check|||14.4 — CI cho monorepo: phát hiện gói bị đổi, ma trận động và một check bắt buộc',
      slug: 'ga-14-4-monorepo',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'CI cho kho nhiều gói như api-backend (backend + frontend + desktop), đo thật qua năm lần push: dorny/paths-filter mặc định so với nhánh MẶC ĐỊNH nên báo "đổi hết" trên nhánh sống lâu, git diff before..sha báo đúng gói, ma trận động từ JSON, mảng rỗng làm job hỏng lúc đánh giá strategy, và một job ket-luan duy nhất làm check bắt buộc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.4</span>
<h2>CI for a monorepo: detecting what changed, dynamic matrices and one required check</h2>
<p class="lead">A monorepo is one repository holding several things that are built and shipped separately. Running every check for every package on every change is simple and slow; running only what changed is fast and full of edge cases. This lesson builds the fast version on a copy of api-backend&#39;s shape and measures, push by push, where each way of "detecting what changed" gets it right and where it does not.</p>

<p>api-backend is a monorepo whether or not anyone calls it one: an Express/TypeScript backend at the root (<code>src/</code>, <code>prisma/</code>), a Next.js frontend in <code>frontend/</code>, an Electron desktop app in <code>desktop/</code>, each with its own <code>package.json</code>. The sandbox branch <code>ch14-mono</code> reproduces that shape in miniature — <code>ch14/backend</code>, <code>ch14/frontend</code>, <code>ch14/desktop</code>, a shared lint script <code>ch14/kiem-ma.js</code> used by all three, and <code>ch14/docs</code> — and one workflow, <code>ch14-mono.yml</code>, that decides which packages to check. Five commits were pushed one by one.</p>

<h3>Where api-backend stands today</h3>
${slide('ga-14', 22, 'api-backend is a monorepo: three packages, one CI workflow that runs everything')}
<p><code>ci-lint.yml</code> in api-backend has two jobs, "Backend Type Check" and "Frontend Type Check". Both run on every pull request to <code>main</code> — there is no path filter on <code>pull_request</code>. On <code>push</code> to <code>main</code> there is a list of eleven path patterns at the workflow level. The desktop app has no CI job at all; its checks live in its own release script. That gives four options for doing better:</p>
<table>
<thead><tr><th>Approach</th><th>Where the decision happens</th><th>Strength</th><th>Weakness</th></tr></thead>
<tbody>
<tr><td><code>on.*.paths</code> per workflow</td><td>before the workflow starts</td><td>zero cost when nothing matches</td><td>no run means no check — a required check waits forever (Lesson 14.1)</td></tr>
<tr><td><code>dorny/paths-filter</code></td><td>a "changes" job, then <code>if:</code> on jobs</td><td>readable YAML filters, many options</td><td>its default base is the default branch — measured below</td></tr>
<tr><td><code>git diff --name-only</code> + <code>jq</code></td><td>a "changes" job</td><td>no third-party action, total control</td><td>you handle new branches, force-pushes and shared files yourself</td></tr>
<tr><td>Nx, Turborepo "affected"</td><td>the build tool</td><td>knows the real dependency graph between packages</td><td>another tool to adopt and keep upgraded</td></tr>
</tbody>
</table>
<p>The middle two are what most teams use with GitHub Actions. The sandbox runs both side by side in the same job, so every push produces two answers to compare.</p>

<h3>The "changes" job: two ways to answer the same question</h3>
<pre><code class="language-yaml">  thay-doi:
    runs-on: ubuntu-24.04
    outputs:
      goi: &#36;{{ steps.tu-lam.outputs.goi }}
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          fetch-depth: 0              # history is needed to compare commits
          persist-credentials: false
      - name: Cach 1 - dorny/paths-filter
        id: loc
        uses: dorny/paths-filter@ceb8a2b8f2d89434be7ff52d3de7ec3738c5cc9d # v4.0.3
        with:
          filters: |
            backend:  ['ch14/backend/**', 'ch14/kiem-ma.js']
            frontend: ['ch14/frontend/**', 'ch14/kiem-ma.js']
            desktop:  ['ch14/desktop/**', 'ch14/kiem-ma.js']
      - name: Cach 2 - tu lam bang git diff
        id: tu-lam
        env:
          TRUOC: &#36;{{ github.event.before }}
        run: |
          if [ "$TRUOC" = "0000000000000000000000000000000000000000" ] || ! git cat-file -e "$TRUOC" 2&gt;/dev/null; then
            echo "Nhanh moi / khong co commit truoc -&gt; coi nhu doi het"
            goi='["backend","desktop","frontend"]'
          else
            git diff --name-only "$TRUOC" "$GITHUB_SHA" | tee doi.txt
            goi=$(jq -R -s -c '
              split("\\n") | map(select(length &gt; 0)) as $f
              | if any($f[]; . == "ch14/kiem-ma.js") then ["backend","desktop","frontend"]
                else [$f[] | select(test("^ch14/(backend|frontend|desktop)/")) | split("/")[1]] | unique end' doi.txt)
          fi
          echo "goi=$goi" | tee -a "$GITHUB_OUTPUT"</code></pre>
<p>Three things in the hand-written version are the edge cases every monorepo script must handle:</p>
<ul>
<li><strong>A new branch has no "before".</strong> On the first push of a branch, <code>github.event.before</code> is forty zeros. Comparing against it fails, so the script treats a new branch as "everything changed".</li>
<li><strong>A force-push can leave "before" unreachable.</strong> <code>git cat-file -e "$TRUOC"</code> checks that the old commit still exists in the clone; if not, same fallback.</li>
<li><strong>Shared files change everything.</strong> <code>ch14/kiem-ma.js</code> is used by all three packages, so a change to it selects all three. In api-backend the equivalents are the root <code>package-lock.json</code>, <code>tsconfig.json</code> and the workflow file itself.</li>
</ul>
<p>The output is a JSON array such as <code>["backend"]</code> — the format a dynamic matrix needs.</p>

<h3>Five pushes, two answers</h3>
${slide('ga-14', 23, 'Five pushes: paths-filter says “everything”, git diff names the right package')}
<table>
<thead><tr><th>Push to <code>ch14-mono</code></th><th><code>git diff before..sha</code></th><th><code>dorny/paths-filter</code> (defaults)</th><th>Matrix jobs that ran</th><th>Run</th></tr></thead>
<tbody>
<tr><td><code>ci(mono)</code> — first push, <code>before</code> = 000…0</td><td>["backend","desktop","frontend"] (fallback)</td><td>all three</td><td>backend, desktop, frontend</td><td>${RUN(36074983305)}</td></tr>
<tr><td><code>feat(backend)</code></td><td><strong>["backend"]</strong></td><td><strong>all three</strong></td><td>backend</td><td>${RUN(36075010880)}</td></tr>
<tr><td><code>feat(frontend,desktop)</code></td><td>["desktop","frontend"]</td><td>all three</td><td>desktop, frontend</td><td>${RUN(36075040711)}</td></tr>
<tr><td><code>docs</code></td><td>[]</td><td>all three</td><td>none (<code>kiem</code> skipped)</td><td>${RUN(36075069166)}</td></tr>
<tr><td><code>chore</code> — edits <code>ch14/kiem-ma.js</code></td><td>all three</td><td>all three</td><td>backend, desktop, frontend</td><td>${RUN(36075097613)}</td></tr>
</tbody>
</table>
<p>The hand-written diff named exactly the packages each commit touched. paths-filter said "all three" every time. Its own log explains why:</p>
<div class="out">Changes will be detected between main and ch14-mono
##[group]Searching for merge-base main...ch14-mono
b20acea652aff973e74d413154cd7e44150142bc
[command]/usr/bin/git diff --no-renames --name-status -z refs/remotes/origin/main...refs/remotes/origin/ch14-mono
Detected 20 changed files
Changes output set to ["backend","frontend","desktop"]</div>
<p>On a <code>push</code> event, paths-filter compares the branch with the <strong>merge-base of the repository&#39;s default branch</strong>, not with the previous commit. That is documented behaviour — its README says the <code>base</code> input defaults to the repository default branch, and that "if it references the same branch it was pushed to, changes are detected against the most recent commit before the push". On a feature branch that answers "what does this branch change compared with main?", which is often what you want for a pull request. On a long-lived branch (<code>develop</code>, <code>release/*</code>, or <code>main</code> itself) where you want "what did <em>this push</em> change?", set <code>base: &#36;{{ github.ref }}</code>. On <code>pull_request</code> events the action uses the pull request&#39;s base and head, and the question does not arise.</p>

<div class="pitfall co-tieu-de"><strong>Trap — "the filter works, everything always runs anyway".</strong> A path-filter step that silently says "everything changed" does not fail; it just saves nothing. The only way to notice is to print its outputs next to what you expected, as the sandbox&#39;s "So hai cach" step does. Do that for the first week of any change-detection setup.</div>

<h3>A dynamic matrix from JSON — and what an empty one does</h3>
${slide('ga-14', 24, 'A dynamic matrix from JSON — and an empty array breaks the job')}
<p>The check job turns the JSON array into a matrix with <code>fromJSON</code>:</p>
<pre><code class="language-yaml">  kiem:
    needs: thay-doi
    if: needs.thay-doi.outputs.goi != '[]'
    runs-on: ubuntu-24.04
    strategy:
      fail-fast: false
      matrix:
        goi: &#36;{{ fromJSON(needs.thay-doi.outputs.goi) }}
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with: { persist-credentials: false }
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: 24
      - name: Lint + test mot goi
        working-directory: ch14/&#36;{{ matrix.goi }}
        run: npm run -s lint &amp;&amp; npm test</code></pre>
<p>The <code>if:</code> line is not decoration. A second workflow, <code>ch14-mono-rong.yml</code>, builds the same matrix without it. On the <code>docs</code> push, when the array was <code>[]</code>, that run failed before any job started (${RUN(36075069163)}):</p>
<div class="out">Error when evaluating 'strategy' for job 'kiem-khong-chan'. .github/workflows/ch14-mono-rong.yml (Line: 24, Col: 14):
Matrix vector 'goi' does not contain any values</div>
<p>An empty matrix is an error, not "zero jobs". The main workflow on the same push behaved correctly: <code>kiem</code> was skipped as a whole, and the summary job reported it (${RUN(36075069166)}):</p>
<div class="out">goi bi doi: []
thay-doi=success kiem=skipped
ket-luan: DAT</div>
<p>Two smaller notes on dynamic matrices. The job names come from the values — <code>kiem (backend)</code>, <code>kiem (desktop)</code> — so a required check on one of them breaks the moment the list changes; require the summary job instead. And a matrix computed at run time is invisible to static tools: actionlint cannot know which values <code>goi</code> will take, so a typo in a package name surfaces as a failed <code>working-directory</code> at run time.</p>

<h3>One required check for the whole repository</h3>
${slide('ga-14', 25, 'A monorepo needs only one required check: ket-luan')}
<pre><code class="language-yaml">  ket-luan:
    if: always()
    needs: [thay-doi, kiem]
    runs-on: ubuntu-24.04
    steps:
      - env:
          GOI: &#36;{{ needs.thay-doi.outputs.goi }}
          KQ_DOI: &#36;{{ needs.thay-doi.result }}
          KQ_KIEM: &#36;{{ needs.kiem.result }}
        run: |
          echo "goi bi doi: $GOI"
          echo "thay-doi=$KQ_DOI kiem=$KQ_KIEM"
          [ "$KQ_DOI" = success ] || { echo "::error::khong xac dinh duoc goi bi doi"; exit 1; }
          case "$KQ_KIEM" in success|skipped) echo "ket-luan: DAT";; *) echo "::error::kiem = $KQ_KIEM"; exit 1;; esac</code></pre>
<p>This is Lesson 14.1&#39;s summary job with one monorepo-specific rule: if the change-detection job itself failed, the result is red — you cannot claim "nothing needed checking" when you failed to find out. On the <code>feat(backend)</code> push (${RUN(36075010880)}) the graph had exactly three jobs: <code>thay-doi</code>, <code>kiem (backend)</code>, <code>ket-luan</code>. The frontend and desktop matrix entries did not exist at all — not skipped, not listed — so they cost nothing. A ruleset that requires only <code>ket-luan</code> keeps working when a fourth package is added, when a package is renamed, and when the matrix is empty.</p>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: How would you set up CI for a monorepo so that only affected packages are tested, without breaking branch protection?</strong><br>A: A first job computes the changed packages (<code>git diff</code> or a paths-filter action with the right base) and outputs a JSON list; a matrix job uses <code>fromJSON</code> on it, guarded by <code>if: … != '[]'</code>; a final summary job with <code>if: always()</code> is the only required check. Shared files select everything; a new branch selects everything.</p>
<p><strong>Q: What happens if a dynamic matrix receives an empty list?</strong><br>A: The workflow fails while evaluating <code>strategy</code> ("Matrix vector … does not contain any values"). Skip the job with an <code>if:</code> on the list instead.</p>
</div>

<h3>Applying it to api-backend</h3>
${slide('ga-14', 26, 'Applying the chapter to ci-lint.yml: five changes, in order')}
<p>Everything in this chapter lands on one file. In the order that keeps <code>main</code> safe at every step:</p>
<ol>
<li><strong><code>permissions: contents: read</code></strong> at the top of <code>ci-lint.yml</code>. Today it declares none, so its token has the repository&#39;s default permissions.</li>
<li><strong>Pin the <code>@v4</code> actions</strong> to SHAs and add Dependabot for <code>github-actions</code> (Lessons 4.2 and 12.4 list the SHAs).</li>
<li><strong>Add a <code>thay-doi</code> job and turn the two jobs into a matrix</strong> over <code>backend</code>, <code>frontend</code> (and, later, <code>desktop</code>), with the root <code>package-lock.json</code>, <code>tsconfig.json</code>, <code>prisma/**</code> and <code>.github/workflows/**</code> as "shared" files that select everything. Then delete the workflow-level <code>paths:</code> list on <code>push</code>.</li>
<li><strong>Add a summary job</strong> (<code>ci-xanh</code>, <code>if: always()</code>).</li>
<li><strong>Add the static-analysis jobs</strong> of Lesson 14.2 to its <code>needs</code>.</li>
</ol>
<p>Only after a few days of green runs, create the ruleset on <code>main</code> requiring <code>ci-xanh</code>. A required check with a wrong name is worse than none: every pull request waits for it.</p>

<h3>Run it step by step: change detection you can trust</h3>
<ol>
<li>On a branch of your own repository, add the <code>thay-doi</code> job with both methods and a step that prints both results side by side.</li>
<li>Push a commit that touches one package only. Compare the two answers in the log.</li>
<li>If paths-filter says "everything", add <code>base: &#36;{{ github.ref }}</code> and push again.</li>
<li>Add the <code>kiem</code> matrix with <code>fromJSON</code> and its <code>if:</code> guard, and the <code>ket-luan</code> summary.</li>
<li>Push a documentation-only commit. Check that <code>kiem</code> is skipped and <code>ket-luan</code> is green.</li>
<li>Push a change to a shared file (lock file, shared config). Check that every package runs.</li>
</ol>

<h3>When to split CI by package — and when not</h3>
<table>
<thead><tr><th>Situation</th><th>Recommendation</th></tr></thead>
<tbody>
<tr><td>Full CI takes under 5 minutes</td><td>run everything; the complexity is not worth it</td></tr>
<tr><td>One package dominates the time (a Next.js build, an Electron bundle)</td><td>split that one; keep the rest together</td></tr>
<tr><td>Packages import each other</td><td>use a tool that knows the graph (Nx, Turborepo) or list the dependants by hand in the jq filter</td></tr>
<tr><td>Required checks on the branch</td><td>always a summary job; never workflow-level <code>paths</code></td></tr>
</tbody>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your repository has a backend and a frontend in one place, and CI runs both on every change.</p><ol>
<li>Add the <code>thay-doi</code> job (git diff version) and make the existing check jobs a matrix over its output.</li>
<li>Add the <code>ket-luan</code> summary with the rule "change detection must succeed".</li>
<li>Push four commits: backend only, frontend only, docs only, shared lock file.</li>
<li>Temporarily remove the <code>if:</code> guard on the matrix job and push a docs-only commit; then put it back.</li>
</ol><p><strong>Done when:</strong> the four pushes show exactly one, one, zero and all packages checked; the unguarded run shows "Matrix vector … does not contain any values"; and <code>ket-luan</code> is green on the docs-only push with the guard in place.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">monorepo</span><span class="v">one repository with several separately built parts — api-backend has three</span></div>
<div class="kv"><span class="k">affected packages</span><span class="v">the packages a change touches, directly or through a shared file</span></div>
<div class="kv"><span class="k"><code>github.event.before</code></span><span class="v">the commit the branch pointed at before this push; forty zeros for a new branch</span></div>
<div class="kv"><span class="k">merge-base</span><span class="v">the common ancestor of two branches; what paths-filter compares with by default on push</span></div>
<div class="kv"><span class="k">dynamic matrix</span><span class="v">a matrix built at run time with <code>fromJSON</code> from another job&#39;s output</span></div>
<div class="kv"><span class="k">empty matrix</span><span class="v">an error when <code>strategy</code> is evaluated — guard the job with <code>if:</code></span></div>
<div class="kv"><span class="k">shared file</span><span class="v">a file several packages depend on (lock file, config, workflow); changing it selects them all</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>api-backend is already a monorepo; its CI runs everything on pull requests and filters paths at the workflow level on push.</li>
<li>Detect changes in a job, not in <code>on.*.paths</code>, so required checks always report.</li>
<li>Measured: on a long-lived branch, paths-filter with defaults said "all three" for every push because it compares with the default branch; <code>git diff before..sha</code> named the right package. Use <code>base: &#36;{{ github.ref }}</code> there.</li>
<li>Handle new branches (<code>before</code> = zeros), force-pushes and shared files explicitly.</li>
<li>A matrix built from <code>[]</code> fails at evaluation; guard it with <code>if: … != '[]'</code>.</li>
<li>One always-running summary job is the only required check; it must fail if change detection failed.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">dorny/paths-filter — README (v4.0.3)</span><span class="lc-sub">github.com/dorny/paths-filter — the <code>base</code> input, "Long lived branches", outputs and filter syntax.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Running variations of jobs in a workflow (matrix)</span><span class="lc-sub">docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations — matrices, <code>fromJSON</code>, <code>fail-fast</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Events that trigger workflows: push</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows — the <code>before</code> and <code>after</code> fields of the push payload.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sandbox — branch ch14-mono</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch14-mono — <code>ch14-mono.yml</code>, <code>ch14-mono-rong.yml</code> and the five pushes.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.4</span>
<h2>CI cho monorepo: phát hiện gói bị đổi, ma trận động và một check bắt buộc</h2>
<p class="lead">Monorepo là một kho chứa nhiều thứ được build và phát hành riêng. Chạy mọi phép kiểm cho mọi gói ở mọi thay đổi thì đơn giản và chậm; chỉ chạy phần bị đổi thì nhanh và đầy trường hợp biên. Bài này dựng bản nhanh trên một bản sao hình dạng của api-backend và đo, từng lần push một, chỗ nào mỗi cách "phát hiện cái gì đã đổi" làm đúng và chỗ nào không.</p>

<p>api-backend là một monorepo dù có ai gọi nó như thế hay không: backend Express/TypeScript ở gốc (<code>src/</code>, <code>prisma/</code>), frontend Next.js trong <code>frontend/</code>, app desktop Electron trong <code>desktop/</code>, mỗi phần một <code>package.json</code>. Nhánh sân tập <code>ch14-mono</code> tái hiện hình dạng đó ở cỡ nhỏ — <code>ch14/backend</code>, <code>ch14/frontend</code>, <code>ch14/desktop</code>, một script lint dùng chung <code>ch14/kiem-ma.js</code> mà cả ba gói đều dùng, và <code>ch14/docs</code> — cùng một workflow, <code>ch14-mono.yml</code>, quyết định gói nào cần kiểm. Năm commit được đẩy lên lần lượt từng cái.</p>

<h3>api-backend hôm nay đang đứng ở đâu</h3>
${slide('ga-14', 22, 'api-backend là monorepo: ba gói, một workflow CI chạy mọi thứ')}
<p><code>ci-lint.yml</code> của api-backend có hai job, "Backend Type Check" và "Frontend Type Check". Cả hai chạy ở mọi PR vào <code>main</code> — không có lọc đường dẫn cho <code>pull_request</code>. Với <code>push</code> vào <code>main</code> thì có một danh sách mười một mẫu đường dẫn ở mức workflow. App desktop không có job CI nào; phép kiểm của nó nằm trong script phát hành riêng. Vậy có bốn lựa chọn để làm tốt hơn:</p>
<table>
<thead><tr><th>Cách</th><th>Quyết định ở đâu</th><th>Mạnh</th><th>Yếu</th></tr></thead>
<tbody>
<tr><td><code>on.*.paths</code> theo workflow</td><td>trước khi workflow khởi động</td><td>không tốn gì khi không khớp</td><td>không run là không check — check bắt buộc chờ mãi (Bài 14.1)</td></tr>
<tr><td><code>dorny/paths-filter</code></td><td>một job "thay đổi", rồi <code>if:</code> trên các job</td><td>bộ lọc YAML dễ đọc, nhiều tuỳ chọn</td><td>base mặc định là nhánh mặc định — đo ở dưới</td></tr>
<tr><td><code>git diff --name-only</code> + <code>jq</code></td><td>một job "thay đổi"</td><td>không dùng action bên thứ ba, toàn quyền kiểm soát</td><td>tự lo nhánh mới, force-push và tệp dùng chung</td></tr>
<tr><td>Nx, Turborepo "affected"</td><td>công cụ build</td><td>biết đồ thị phụ thuộc thật giữa các gói</td><td>thêm một công cụ phải học và nâng cấp</td></tr>
</tbody>
</table>
<p>Hai cách ở giữa là thứ đa số đội dùng với GitHub Actions. Sân tập chạy cả hai cạnh nhau trong cùng một job, để mỗi lần push cho ra hai câu trả lời để so.</p>

<h3>Job "thay đổi": hai cách trả lời cùng một câu hỏi</h3>
<pre><code class="language-yaml">  thay-doi:
    runs-on: ubuntu-24.04
    outputs:
      goi: &#36;{{ steps.tu-lam.outputs.goi }}
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          fetch-depth: 0              # cần lịch sử để so các commit
          persist-credentials: false
      - name: Cach 1 - dorny/paths-filter
        id: loc
        uses: dorny/paths-filter@ceb8a2b8f2d89434be7ff52d3de7ec3738c5cc9d # v4.0.3
        with:
          filters: |
            backend:  ['ch14/backend/**', 'ch14/kiem-ma.js']
            frontend: ['ch14/frontend/**', 'ch14/kiem-ma.js']
            desktop:  ['ch14/desktop/**', 'ch14/kiem-ma.js']
      - name: Cach 2 - tu lam bang git diff
        id: tu-lam
        env:
          TRUOC: &#36;{{ github.event.before }}
        run: |
          if [ "$TRUOC" = "0000000000000000000000000000000000000000" ] || ! git cat-file -e "$TRUOC" 2&gt;/dev/null; then
            echo "Nhanh moi / khong co commit truoc -&gt; coi nhu doi het"
            goi='["backend","desktop","frontend"]'
          else
            git diff --name-only "$TRUOC" "$GITHUB_SHA" | tee doi.txt
            goi=$(jq -R -s -c '
              split("\\n") | map(select(length &gt; 0)) as $f
              | if any($f[]; . == "ch14/kiem-ma.js") then ["backend","desktop","frontend"]
                else [$f[] | select(test("^ch14/(backend|frontend|desktop)/")) | split("/")[1]] | unique end' doi.txt)
          fi
          echo "goi=$goi" | tee -a "$GITHUB_OUTPUT"</code></pre>
<p>Ba điều trong bản tự viết là những trường hợp biên mà script monorepo nào cũng phải xử lý:</p>
<ul>
<li><strong>Nhánh mới không có "trước".</strong> Ở lần push đầu của một nhánh, <code>github.event.before</code> là bốn mươi chữ số 0. So với nó thì hỏng, nên script coi nhánh mới là "đổi hết".</li>
<li><strong>Force-push có thể làm "trước" không còn với tới được.</strong> <code>git cat-file -e "$TRUOC"</code> kiểm commit cũ còn trong bản clone; không còn thì dùng cùng cách lùi.</li>
<li><strong>Tệp dùng chung đổi là đổi hết.</strong> <code>ch14/kiem-ma.js</code> được cả ba gói dùng, nên đổi nó là chọn cả ba. Ở api-backend, các tệp tương đương là <code>package-lock.json</code> ở gốc, <code>tsconfig.json</code> và chính tệp workflow.</li>
</ul>
<p>Đầu ra là một mảng JSON như <code>["backend"]</code> — đúng định dạng mà ma trận động cần.</p>

<h3>Năm lần push, hai câu trả lời</h3>
${slide('ga-14', 23, 'Năm lần push: paths-filter nói “đổi hết”, git diff nói đúng gói')}
<table>
<thead><tr><th>Push vào <code>ch14-mono</code></th><th><code>git diff before..sha</code></th><th><code>dorny/paths-filter</code> (mặc định)</th><th>Job ma trận đã chạy</th><th>Run</th></tr></thead>
<tbody>
<tr><td><code>ci(mono)</code> — push đầu, <code>before</code> = 000…0</td><td>["backend","desktop","frontend"] (lùi)</td><td>cả ba</td><td>backend, desktop, frontend</td><td>${RUN(36074983305)}</td></tr>
<tr><td><code>feat(backend)</code></td><td><strong>["backend"]</strong></td><td><strong>cả ba</strong></td><td>backend</td><td>${RUN(36075010880)}</td></tr>
<tr><td><code>feat(frontend,desktop)</code></td><td>["desktop","frontend"]</td><td>cả ba</td><td>desktop, frontend</td><td>${RUN(36075040711)}</td></tr>
<tr><td><code>docs</code></td><td>[]</td><td>cả ba</td><td>không có (<code>kiem</code> bị skip)</td><td>${RUN(36075069166)}</td></tr>
<tr><td><code>chore</code> — sửa <code>ch14/kiem-ma.js</code></td><td>cả ba</td><td>cả ba</td><td>backend, desktop, frontend</td><td>${RUN(36075097613)}</td></tr>
</tbody>
</table>
<p>Bản diff tự viết gọi đúng tên những gói mà mỗi commit đụng tới. paths-filter lần nào cũng nói "cả ba". Chính log của nó giải thích vì sao:</p>
<div class="out">Changes will be detected between main and ch14-mono
##[group]Searching for merge-base main...ch14-mono
b20acea652aff973e74d413154cd7e44150142bc
[command]/usr/bin/git diff --no-renames --name-status -z refs/remotes/origin/main...refs/remotes/origin/ch14-mono
Detected 20 changed files
Changes output set to ["backend","frontend","desktop"]</div>
<p>Với sự kiện <code>push</code>, paths-filter so nhánh với <strong>merge-base của nhánh mặc định</strong>, không phải với commit trước đó. Đây là hành vi có ghi trong tài liệu — README của nó nói input <code>base</code> mặc định là nhánh mặc định của kho, và "nếu nó trỏ vào đúng nhánh vừa được push, thay đổi được tính so với commit gần nhất trước lần push". Trên một nhánh tính năng, nó trả lời "nhánh này đổi gì so với main?", thường đúng thứ bạn muốn cho một PR. Trên nhánh sống lâu (<code>develop</code>, <code>release/*</code>, hay chính <code>main</code>) nơi bạn muốn "<em>lần push này</em> đổi gì?", hãy đặt <code>base: &#36;{{ github.ref }}</code>. Với sự kiện <code>pull_request</code>, action dùng base và head của PR, và câu hỏi này không đặt ra.</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — "bộ lọc chạy tốt, mà lần nào cũng chạy hết".</strong> Một bước lọc đường dẫn lặng lẽ nói "đổi hết" thì không đỏ; nó chỉ không tiết kiệm được gì. Cách duy nhất để thấy là in đầu ra của nó cạnh thứ bạn mong đợi, như bước "So hai cach" của sân tập. Hãy làm vậy trong tuần đầu của bất kỳ thiết lập phát hiện thay đổi nào.</div>

<h3>Ma trận động từ JSON — và một ma trận rỗng thì sao</h3>
${slide('ga-14', 24, 'Ma trận động từ JSON — và mảng rỗng làm job hỏng')}
<p>Job kiểm biến mảng JSON thành ma trận bằng <code>fromJSON</code>:</p>
<pre><code class="language-yaml">  kiem:
    needs: thay-doi
    if: needs.thay-doi.outputs.goi != '[]'
    runs-on: ubuntu-24.04
    strategy:
      fail-fast: false
      matrix:
        goi: &#36;{{ fromJSON(needs.thay-doi.outputs.goi) }}
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with: { persist-credentials: false }
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: 24
      - name: Lint + test mot goi
        working-directory: ch14/&#36;{{ matrix.goi }}
        run: npm run -s lint &amp;&amp; npm test</code></pre>
<p>Dòng <code>if:</code> không phải để trang trí. Workflow thứ hai, <code>ch14-mono-rong.yml</code>, dựng cùng ma trận đó mà không có nó. Ở lần push <code>docs</code>, khi mảng là <code>[]</code>, run đó hỏng trước khi bất kỳ job nào khởi động (${RUN(36075069163)}):</p>
<div class="out">Error when evaluating 'strategy' for job 'kiem-khong-chan'. .github/workflows/ch14-mono-rong.yml (Line: 24, Col: 14):
Matrix vector 'goi' does not contain any values</div>
<p>Ma trận rỗng là một lỗi, không phải "không job nào". Workflow chính ở cùng lần push đó cư xử đúng: <code>kiem</code> bị skip nguyên khối, và job tổng hợp báo lại điều đó (${RUN(36075069166)}):</p>
<div class="out">goi bi doi: []
thay-doi=success kiem=skipped
ket-luan: DAT</div>
<p>Hai ghi chú nhỏ về ma trận động. Tên job sinh từ giá trị — <code>kiem (backend)</code>, <code>kiem (desktop)</code> — nên bắt buộc một trong số đó là luật hỏng ngay khi danh sách đổi; hãy bắt buộc job tổng hợp. Và ma trận tính lúc chạy thì công cụ tĩnh không nhìn thấy: actionlint không thể biết <code>goi</code> sẽ nhận giá trị nào, nên gõ sai tên gói chỉ lộ ra thành một <code>working-directory</code> hỏng lúc chạy.</p>

<h3>Một check bắt buộc cho cả kho</h3>
${slide('ga-14', 25, 'Monorepo chỉ cần một check bắt buộc: ket-luan')}
<pre><code class="language-yaml">  ket-luan:
    if: always()
    needs: [thay-doi, kiem]
    runs-on: ubuntu-24.04
    steps:
      - env:
          GOI: &#36;{{ needs.thay-doi.outputs.goi }}
          KQ_DOI: &#36;{{ needs.thay-doi.result }}
          KQ_KIEM: &#36;{{ needs.kiem.result }}
        run: |
          echo "goi bi doi: $GOI"
          echo "thay-doi=$KQ_DOI kiem=$KQ_KIEM"
          [ "$KQ_DOI" = success ] || { echo "::error::khong xac dinh duoc goi bi doi"; exit 1; }
          case "$KQ_KIEM" in success|skipped) echo "ket-luan: DAT";; *) echo "::error::kiem = $KQ_KIEM"; exit 1;; esac</code></pre>
<p>Đây là job tổng hợp của Bài 14.1 cộng một luật riêng cho monorepo: nếu chính job phát hiện thay đổi hỏng, kết quả là đỏ — bạn không thể tuyên bố "không có gì cần kiểm" khi bạn đã không tìm ra được. Ở lần push <code>feat(backend)</code> (${RUN(36075010880)}), đồ thị có đúng ba job: <code>thay-doi</code>, <code>kiem (backend)</code>, <code>ket-luan</code>. Phần tử ma trận frontend và desktop hoàn toàn không tồn tại — không skip, không có trong danh sách — nên chúng không tốn gì. Một ruleset chỉ đòi <code>ket-luan</code> vẫn chạy đúng khi thêm gói thứ tư, khi đổi tên một gói, và khi ma trận rỗng.</p>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Bạn dựng CI cho một monorepo thế nào để chỉ kiểm các gói bị ảnh hưởng mà không làm hỏng branch protection?</strong><br>Đ: Job đầu tính các gói bị đổi (<code>git diff</code> hoặc một action lọc đường dẫn với base đúng) và xuất một danh sách JSON; một job ma trận dùng <code>fromJSON</code> trên nó, có <code>if: … != '[]'</code> canh; một job tổng hợp cuối có <code>if: always()</code> là check bắt buộc duy nhất. Tệp dùng chung chọn tất cả; nhánh mới chọn tất cả.</p>
<p><strong>H: Chuyện gì xảy ra nếu ma trận động nhận một danh sách rỗng?</strong><br>Đ: Workflow hỏng khi đánh giá <code>strategy</code> ("Matrix vector … does not contain any values"). Hãy skip job bằng một <code>if:</code> trên danh sách.</p>
</div>

<h3>Áp vào api-backend</h3>
${slide('ga-14', 26, 'Áp chương này vào ci-lint.yml: năm thay đổi, theo thứ tự')}
<p>Mọi thứ trong chương này đổ về một tệp. Theo thứ tự giữ <code>main</code> an toàn ở mọi bước:</p>
<ol>
<li><strong><code>permissions: contents: read</code></strong> ở đầu <code>ci-lint.yml</code>. Hôm nay nó không khai gì, nên token của nó mang quyền mặc định của kho.</li>
<li><strong>Ghim các action <code>@v4</code></strong> sang SHA và thêm Dependabot cho <code>github-actions</code> (Bài 4.2 và 12.4 đã tra sẵn SHA).</li>
<li><strong>Thêm job <code>thay-doi</code> và biến hai job thành một ma trận</strong> trên <code>backend</code>, <code>frontend</code> (và sau này <code>desktop</code>), với <code>package-lock.json</code> gốc, <code>tsconfig.json</code>, <code>prisma/**</code> và <code>.github/workflows/**</code> là tệp "dùng chung" chọn tất cả. Rồi xoá danh sách <code>paths:</code> ở mức workflow của <code>push</code>.</li>
<li><strong>Thêm một job tổng hợp</strong> (<code>ci-xanh</code>, <code>if: always()</code>).</li>
<li><strong>Thêm các job phân tích tĩnh</strong> của Bài 14.2 vào <code>needs</code> của nó.</li>
</ol>
<p>Chỉ sau vài ngày run xanh ổn định mới tạo ruleset trên <code>main</code> đòi <code>ci-xanh</code>. Một check bắt buộc sai tên còn tệ hơn không có: mọi PR đều phải chờ nó.</p>

<h3>Chạy thử từng bước: phát hiện thay đổi mà bạn tin được</h3>
<ol>
<li>Trên một nhánh của kho bạn, thêm job <code>thay-doi</code> với cả hai cách và một bước in hai kết quả cạnh nhau.</li>
<li>Push một commit chỉ đụng một gói. So hai câu trả lời trong log.</li>
<li>Nếu paths-filter nói "đổi hết", thêm <code>base: &#36;{{ github.ref }}</code> rồi push lại.</li>
<li>Thêm ma trận <code>kiem</code> với <code>fromJSON</code> và <code>if:</code> canh, cùng job tổng hợp <code>ket-luan</code>.</li>
<li>Push một commit chỉ sửa tài liệu. Kiểm <code>kiem</code> bị skip và <code>ket-luan</code> xanh.</li>
<li>Push một thay đổi ở tệp dùng chung (lockfile, cấu hình chung). Kiểm mọi gói đều chạy.</li>
</ol>

<h3>Khi nào tách CI theo gói — và khi nào KHÔNG</h3>
<table>
<thead><tr><th>Tình huống</th><th>Khuyên</th></tr></thead>
<tbody>
<tr><td>CI đầy đủ chạy dưới 5 phút</td><td>chạy hết; độ phức tạp không đáng</td></tr>
<tr><td>Một gói chiếm phần lớn thời gian (build Next.js, đóng gói Electron)</td><td>tách riêng gói đó; phần còn lại để chung</td></tr>
<tr><td>Các gói import lẫn nhau</td><td>dùng công cụ biết đồ thị (Nx, Turborepo) hoặc tự liệt kê gói phụ thuộc trong bộ lọc jq</td></tr>
<tr><td>Nhánh có check bắt buộc</td><td>luôn có job tổng hợp; không bao giờ <code>paths</code> ở mức workflow</td></tr>
</tbody>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> kho của bạn có backend và frontend ở cùng một chỗ, và CI chạy cả hai ở mọi thay đổi.</p><ol>
<li>Thêm job <code>thay-doi</code> (bản git diff) và biến các job kiểm hiện có thành một ma trận trên đầu ra của nó.</li>
<li>Thêm job tổng hợp <code>ket-luan</code> với luật "phát hiện thay đổi phải thành công".</li>
<li>Push bốn commit: chỉ backend, chỉ frontend, chỉ tài liệu, lockfile dùng chung.</li>
<li>Tạm bỏ <code>if:</code> canh trên job ma trận và push một commit chỉ sửa tài liệu; rồi đặt lại.</li>
</ol><p><strong>Đạt khi:</strong> bốn lần push cho thấy đúng một, một, không, và tất cả các gói được kiểm; run không có canh hiện "Matrix vector … does not contain any values"; và <code>ket-luan</code> xanh ở lần push chỉ sửa tài liệu khi có canh.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">monorepo</span><span class="v">một kho có nhiều phần được build riêng — api-backend có ba</span></div>
<div class="kv"><span class="k">gói bị ảnh hưởng (affected)</span><span class="v">những gói mà thay đổi đụng tới, trực tiếp hoặc qua tệp dùng chung</span></div>
<div class="kv"><span class="k"><code>github.event.before</code></span><span class="v">commit mà nhánh trỏ vào trước lần push này; bốn mươi số 0 với nhánh mới</span></div>
<div class="kv"><span class="k">merge-base</span><span class="v">tổ tiên chung của hai nhánh; thứ paths-filter so theo mặc định khi push</span></div>
<div class="kv"><span class="k">ma trận động</span><span class="v">ma trận dựng lúc chạy bằng <code>fromJSON</code> từ output của job khác</span></div>
<div class="kv"><span class="k">ma trận rỗng</span><span class="v">một lỗi khi đánh giá <code>strategy</code> — canh job bằng <code>if:</code></span></div>
<div class="kv"><span class="k">tệp dùng chung</span><span class="v">tệp mà nhiều gói phụ thuộc (lockfile, cấu hình, workflow); đổi nó là chọn tất cả</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>api-backend vốn đã là monorepo; CI của nó chạy hết cho PR và lọc đường dẫn ở mức workflow khi push.</li>
<li>Phát hiện thay đổi trong một job, không ở <code>on.*.paths</code>, để check bắt buộc lúc nào cũng được báo.</li>
<li>Đo thật: trên nhánh sống lâu, paths-filter để mặc định nói "cả ba" ở mọi lần push vì nó so với nhánh mặc định; <code>git diff before..sha</code> gọi đúng gói. Ở đó hãy dùng <code>base: &#36;{{ github.ref }}</code>.</li>
<li>Xử lý tường minh nhánh mới (<code>before</code> toàn số 0), force-push và tệp dùng chung.</li>
<li>Ma trận dựng từ <code>[]</code> hỏng lúc đánh giá; canh bằng <code>if: … != '[]'</code>.</li>
<li>Một job tổng hợp luôn chạy là check bắt buộc duy nhất; nó phải đỏ nếu việc phát hiện thay đổi hỏng.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">dorny/paths-filter — README (v4.0.3)</span><span class="lc-sub">github.com/dorny/paths-filter — input <code>base</code>, mục "Long lived branches", output và cú pháp bộ lọc.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Running variations of jobs in a workflow (matrix)</span><span class="lc-sub">docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations — ma trận, <code>fromJSON</code>, <code>fail-fast</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Events that trigger workflows: push</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows — trường <code>before</code> và <code>after</code> của payload push.</span></span></div>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Sân tập — nhánh ch14-mono</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch14-mono — <code>ch14-mono.yml</code>, <code>ch14-mono-rong.yml</code> và năm lần push.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git — lịch sử, merge-base và diff giữa hai commit</span><span class="lc-sub">/courses/git/learn${REF} — nền tảng để hiểu vì sao "so với cái gì" quyết định mọi thứ ở bài này.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 14.5 ─────────────────────────── */
    {
      title: '14.5 — Chapter 14 quiz|||14.5 — Kiểm tra Chương 14',
      slug: 'ga-14-5-kiem-tra',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống trên đúng những gì Chương 14 đã chạy thật: job tổng hợp thiếu always(), paths và check treo, tiêm lệnh qua tiêu đề PR, pull_request_target ở nhánh khác, mã thoát của zizmor, dependency review, notes tự sinh, quyền đẩy GHCR, attestation khi sửa một byte, và paths-filter trên nhánh sống lâu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Quiz</span>
<h2>What Chapter 14 measured</h2>
<p class="lead">Ten questions, fifteen minutes. Each answer comes from a run in the sandbox, and several of the wrong options are what a reasonable reading of a tutorial predicts. If you are unsure, the run is linked in the lesson.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write a summary job that is the only required check and still fails when any job fails or is cancelled.</li>
<li>I can explain why a workflow-level <code>paths</code> filter can leave a pull request waiting forever, and how to avoid it.</li>
<li>I can explain the difference between <code>pull_request</code> and <code>pull_request_target</code>, and fix script injection with <code>env:</code>.</li>
<li>I can run actionlint and zizmor as checks, upload SARIF, and say what dependency review needs.</li>
<li>I can create a release, push an image to GHCR and attest it using only <code>GITHUB_TOKEN</code>, and verify the attestation.</li>
<li>I can build change detection for a monorepo with a dynamic matrix that survives an empty list.</li>
</ul>
${slide('ga-14', 28, 'Chapter 14 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Kiểm tra</span>
<h2>Chương 14 đã đo được gì</h2>
<p class="lead">Mười câu, mười lăm phút. Đáp án nào cũng lấy từ một run trên sân tập, và vài phương án sai chính là điều mà một cách đọc hợp lý các bài hướng dẫn sẽ đoán. Nếu không chắc, run đã được dẫn trong bài.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được một job tổng hợp là check bắt buộc duy nhất mà vẫn đỏ khi có job nào hỏng hoặc bị huỷ.</li>
<li>Tôi giải thích được vì sao lọc <code>paths</code> ở mức workflow có thể làm một PR chờ mãi, và cách tránh.</li>
<li>Tôi phân biệt được <code>pull_request</code> với <code>pull_request_target</code>, và vá được script injection bằng <code>env:</code>.</li>
<li>Tôi chạy được actionlint và zizmor như các check, tải SARIF lên, và nói được dependency review cần gì.</li>
<li>Tôi tạo được release, đẩy ảnh lên GHCR và chứng thực nó chỉ bằng <code>GITHUB_TOKEN</code>, rồi kiểm được attestation.</li>
<li>Tôi dựng được phát hiện thay đổi cho monorepo với ma trận động sống sót qua danh sách rỗng.</li>
</ul>
${slide('ga-14', 28, 'Bảng tra nhanh Chương 14')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A summary job has needs: [lint, test, e2e-dem] and no if:. On a pull request, test fails and e2e-dem is skipped because the PR has no label. The summary job is the only required check. What happens?|||Một job tổng hợp có needs: [lint, test, e2e-dem] và không có if:. Trên một PR, test đỏ và e2e-dem bị skip vì PR không có nhãn. Job tổng hợp là check bắt buộc duy nhất. Chuyện gì xảy ra?',
            options: [
              'The summary job fails, so the pull request is blocked|||Job tổng hợp đỏ, nên PR bị chặn',
              'The summary job is skipped, which counts as success, so the pull request can be merged|||Job tổng hợp bị skip, được tính là thành công, nên PR merge được',
              'The summary job succeeds because lint passed first|||Job tổng hợp xanh vì lint đã qua trước',
              'The summary job is cancelled and the check stays pending|||Job tổng hợp bị huỷ và check nằm ở trạng thái chờ',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: A job whose dependency did not succeed is skipped unless its if: says otherwise, and GitHub reports a skipped job as Success for required checks. In runs 36074689448 and 36074691713 the naive summary job was skipped in both the green and the red PR. “It fails” is the tempting answer because that is what a summary job is for — but only with if: always() and an explicit check of needs.*.result.|||VI: Job có cha không thành công sẽ bị skip trừ khi if: nói khác, và GitHub báo job bị skip là Success đối với check bắt buộc. Ở run 36074689448 và 36074691713, job tổng hợp ngây thơ bị skip ở cả PR xanh lẫn PR đỏ. “Nó đỏ” là đáp án hấp dẫn vì job tổng hợp sinh ra để làm vậy — nhưng chỉ khi có if: always() và kiểm needs.*.result tường minh.',
          },
          {
            question: 'backend-test is a required check. It comes from a workflow with on.pull_request.paths: [\"ch14/backend/**\"]. A pull request changes only ch14/docs/README.md. What does the pull request show?|||backend-test là check bắt buộc. Nó đến từ một workflow có on.pull_request.paths: [\"ch14/backend/**\"]. Một PR chỉ sửa ch14/docs/README.md. PR hiện gì?',
            options: [
              'backend-test: Skipped — the pull request can be merged|||backend-test: Skipped — PR merge được',
              'backend-test: Success, because nothing relevant changed|||backend-test: Success, vì không có gì liên quan bị đổi',
              'Expected — Waiting for status to be reported; the pull request cannot be merged|||Expected — Waiting for status to be reported; PR không merge được',
              'The workflow runs anyway because required checks override path filters|||Workflow vẫn chạy vì check bắt buộc đè lên bộ lọc đường dẫn',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: A workflow filtered out by paths is never created, so its job never reports (PR #7 had no ch14-paths run at all). The docs: checks of such a workflow “will remain in a Pending state” and a PR that requires them is blocked. “Skipped” is tempting because a job skipped by its own if: does report success — the difference is job-level versus workflow-level filtering.|||VI: Workflow bị paths lọc ra thì không bao giờ được tạo, nên job của nó không bao giờ báo (PR #7 hoàn toàn không có run ch14-paths). Docs: check của workflow đó “sẽ nằm ở trạng thái Pending” và PR đòi chúng bị chặn. “Skipped” hấp dẫn vì job bị if: của chính nó skip thì CÓ báo success — khác biệt nằm ở lọc mức job so với lọc mức workflow.',
          },
          {
            question: 'A step must print the pull-request title, which anyone opening a PR can set. Which version is safe?|||Một bước cần in tiêu đề PR, thứ mà ai mở PR cũng đặt được. Cách viết nào an toàn?',
            options: [
              'env: { TIEU_DE: ${{ github.event.pull_request.title }} } and run: echo "Tieu de - $TIEU_DE"|||env: { TIEU_DE: ${{ github.event.pull_request.title }} } và run: echo "Tieu de - $TIEU_DE"',
              'run: echo "Tieu de - ${{ github.event.pull_request.title }}" with the expression inside double quotes|||run: echo "Tieu de - ${{ github.event.pull_request.title }}" với biểu thức nằm trong nháy kép',
              'run: echo \"Tieu de - ${{ toJSON(github.event.pull_request.title) }}\"|||run: echo \"Tieu de - ${{ toJSON(github.event.pull_request.title) }}\"',
              'Any form is safe as long as the job has permissions: {}|||Cách nào cũng an toàn miễn là job có permissions: {}',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: ${{ }} is substituted into the script text before bash reads it, so quotes around it do not help: in run 36074698667 the title “$(echo DA-CHAY-LENH-TU-TIEU-DE)” was executed in the quoted version and printed literally only in the env: version. toJSON adds quotes but not shell escaping. permissions: {} limits the damage (the job had Metadata: read only) but does not stop the command from running.|||VI: ${{ }} được thay vào văn bản script trước khi bash đọc, nên nháy bao quanh không giúp gì: ở run 36074698667, tiêu đề “$(echo DA-CHAY-LENH-TU-TIEU-DE)” bị chạy ở bản có nháy và chỉ được in nguyên văn ở bản env:. toJSON thêm nháy nhưng không thoát ký tự cho shell. permissions: {} hạn chế thiệt hại (job chỉ có Metadata: read) nhưng không ngăn lệnh chạy.',
          },
          {
            question: 'ch14-prt.yml uses on: pull_request_target with branches: [ch14-chat-luong] and exists only on that branch, not on main. Five pull requests are opened into ch14-chat-luong. How many pull_request_target runs appear?|||ch14-prt.yml dùng on: pull_request_target với branches: [ch14-chat-luong] và chỉ tồn tại ở nhánh đó, không có ở main. Năm PR được mở vào ch14-chat-luong. Có bao nhiêu run pull_request_target?',
            options: [
              'Five — one per pull request, with secrets available|||Năm — mỗi PR một run, có secret',
              'Five, but each fails with a startup error about the default branch|||Năm, nhưng run nào cũng hỏng lúc khởi động với lỗi về nhánh mặc định',
              'One — pull_request_target runs only for the first pull request|||Một — pull_request_target chỉ chạy cho PR đầu tiên',
              'Zero — the workflow is read from the default branch, where it does not exist|||Không — workflow được đọc từ nhánh mặc định, nơi nó không tồn tại',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: pull_request_target takes the workflow file from the default branch; that is what makes granting it secrets safe. The runs list filtered by event pull_request_target returned total_count 0. “Five with secrets” is tempting because the branches: filter matches — but the file that would be evaluated is the one on main. It also means you cannot test such a workflow from a pull request.|||VI: pull_request_target lấy tệp workflow từ nhánh mặc định; chính điều đó làm việc cấp secret cho nó an toàn. Danh sách run lọc theo sự kiện pull_request_target trả về total_count 0. “Năm run có secret” hấp dẫn vì bộ lọc branches: khớp — nhưng tệp được đánh giá là tệp ở main. Điều đó cũng có nghĩa bạn không thể thử một workflow như thế bằng một PR.',
          },
          {
            question: 'A gate runs zizmor and then checks [ $? -eq 1 ] to decide whether to fail. On a workflow with a template-injection finding, what happens?|||Một cổng chạy zizmor rồi kiểm [ $? -eq 1 ] để quyết có đỏ không. Với một workflow có phát hiện template-injection, chuyện gì xảy ra?',
            options: [
              'The gate fails correctly, because any finding exits with 1|||Cổng đỏ đúng, vì phát hiện nào cũng thoát với mã 1',
              'The gate passes — zizmor exited with 14 for a high-severity finding, not 1|||Cổng xanh — zizmor thoát với mã 14 cho phát hiện mức high, không phải 1',
              'The gate passes because zizmor only reports, it never exits non-zero|||Cổng xanh vì zizmor chỉ báo, không bao giờ thoát khác 0',
              'The gate fails, but only if --persona=pedantic is set|||Cổng đỏ, nhưng chỉ khi đặt --persona=pedantic',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: In run 36074691722 zizmor 1.30.1 printed “2 high” and “Process completed with exit code 14”. The exit code encodes the highest severity, so a check for exactly 1 lets it through; test for non-zero. “Any finding exits 1” is tempting because that is what actionlint (and most linters) do — actionlint exited 1 in the same run.|||VI: Ở run 36074691722, zizmor 1.30.1 in “2 high” và “Process completed with exit code 14”. Mã thoát mã hoá mức nghiêm trọng cao nhất, nên kiểm đúng bằng 1 sẽ để lọt; hãy kiểm khác 0. “Phát hiện nào cũng thoát 1” hấp dẫn vì actionlint (và đa số linter) làm vậy — actionlint thoát 1 trong cùng run đó.',
          },
          {
            question: 'actions/dependency-review-action fails on every pull request, including ones that change no dependency, with “Dependency review is not supported on this repository”. What is the fix?|||actions/dependency-review-action đỏ ở mọi PR, kể cả PR không đổi phụ thuộc nào, với “Dependency review is not supported on this repository”. Sửa thế nào?',
            options: [
              'Enable the dependency graph in the repository’s security settings|||Bật dependency graph trong phần cài đặt bảo mật của kho',
              'Add a .github/dependabot.yml file on the default branch|||Thêm tệp .github/dependabot.yml ở nhánh mặc định',
              'Give the job permissions: pull-requests: write|||Cho job quyền permissions: pull-requests: write',
              'Pin the action to a SHA instead of a tag|||Ghim action vào SHA thay vì thẻ',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The action is a client of the dependency review API, which needs the dependency graph; the error message itself links to settings/security_analysis (runs 36074689504 and 36074699591). dependabot.yml is tempting because it is the other “Dependabot” file, but it configures version updates and does not turn the graph on.|||VI: Action là client của API dependency review, API này cần dependency graph; chính thông báo lỗi dẫn tới settings/security_analysis (run 36074689504 và 36074699591). dependabot.yml hấp dẫn vì nó là tệp “Dependabot” còn lại, nhưng nó cấu hình version updates và không bật đồ thị.',
          },
          {
            question: 'A repository has two release lines: semantic-release tags ch14-sr-vX and a job that runs gh release create ch14-v0.1.N --generate-notes. The notes of ch14-v0.1.2 read “Full Changelog: ch14-sr-v1.0.0...ch14-v0.1.2”. What is the right fix?|||Một kho có hai dòng phát hành: semantic-release gắn thẻ ch14-sr-vX và một job chạy gh release create ch14-v0.1.N --generate-notes. Notes của ch14-v0.1.2 ghi “Full Changelog: ch14-sr-v1.0.0...ch14-v0.1.2”. Sửa đúng là gì?',
            options: [
              'Add --latest so GitHub knows which release is newest|||Thêm --latest để GitHub biết bản nào mới nhất',
              'Mark the gh releases as pre-releases so they are compared separately|||Đánh dấu các release của gh là pre-release để chúng được so riêng',
              'Pass --notes-start-tag with the previous tag of the same line|||Truyền --notes-start-tag là thẻ trước của cùng dòng',
              'Use fetch-depth: 0 in the release job|||Dùng fetch-depth: 0 trong job phát hành',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Generated notes pick a previous tag automatically and know nothing about naming schemes; in run 36074930320 they compared with the other tool’s tag. --notes-start-tag makes the range explicit. Pre-release is tempting, but the measured releases were already pre-releases and were still compared across lines. fetch-depth is irrelevant: gh creates the notes on the server.|||VI: Notes tự sinh tự chọn thẻ trước và không biết gì về quy ước đặt tên; ở run 36074930320 chúng so với thẻ của công cụ kia. --notes-start-tag làm khoảng so sánh tường minh. Pre-release hấp dẫn, nhưng các release đo được vốn đã là pre-release mà vẫn bị so chéo dòng. fetch-depth không liên quan: gh tạo notes ở phía máy chủ.',
          },
          {
            question: 'A job logs in to ghcr.io with github.actor and github.token and runs docker/build-push-action with push: true, in the same repository. Which permission must the job have for the push?|||Một job đăng nhập ghcr.io bằng github.actor và github.token rồi chạy docker/build-push-action với push: true, trong cùng kho. Job phải có quyền nào để đẩy được?',
            options: [
              'contents: write|||contents: write',
              'A personal access token with write:packages stored as a secret|||Một personal access token có write:packages lưu trong secret',
              'id-token: write|||id-token: write',
              'packages: write|||packages: write',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: packages: write is all the push needs; run 36074744157 pushed in 4 seconds with GITHUB_TOKEN and no PAT, and a later job pulled the image anonymously because the package inherited the repository’s public visibility. A PAT is tempting because older guides used one, but it is needed only to publish into another repository or organisation. id-token: write is for the attestation, not the push.|||VI: packages: write là tất cả những gì việc đẩy cần; run 36074744157 đẩy trong 4 giây bằng GITHUB_TOKEN, không PAT, và một job sau kéo ảnh về ẩn danh vì gói thừa hưởng chế độ public của kho. PAT hấp dẫn vì các hướng dẫn cũ dùng nó, nhưng nó chỉ cần khi công bố sang kho hoặc tổ chức khác. id-token: write là cho attestation, không phải cho việc đẩy.',
          },
          {
            question: 'An npm tarball was attested with actions/attest. Someone copies it, appends one byte, renames the copy back to the original file name, and runs gh attestation verify on it. What is the result?|||Một tệp tarball npm đã được chứng thực bằng actions/attest. Ai đó chép nó, nối thêm một byte, đổi tên bản sao về đúng tên tệp gốc, rồi chạy gh attestation verify trên nó. Kết quả là gì?',
            options: [
              'Verification fails: no attestation exists for the new digest (HTTP 404)|||Kiểm chứng thất bại: không có attestation nào cho digest mới (HTTP 404)',
              'Verification succeeds, because attestations are looked up by file name|||Kiểm chứng thành công, vì attestation được tra theo tên tệp',
              'Verification succeeds with a warning that the signature is stale|||Kiểm chứng thành công kèm cảnh báo chữ ký đã cũ',
              'Verification fails with “certificate expired”, because the certificate lived ten minutes|||Kiểm chứng thất bại với “certificate expired”, vì chứng chỉ chỉ sống mười phút',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: gh computes the digest of the file and asks the API for attestations of that digest. In run 36074930318 the modified copy (sha256:3afdf3c1…) returned “HTTP 404: Not Found”, while the original verified. The name plays no part. The ten-minute certificate is tempting, but verification checks that the signature was made while the certificate was valid (recorded in Rekor), which is why the original still verifies long afterwards.|||VI: gh tính digest của tệp và hỏi API các attestation cho digest đó. Ở run 36074930318, bản sao đã sửa (sha256:3afdf3c1…) nhận “HTTP 404: Not Found”, còn bản gốc thì qua. Tên tệp không có vai trò gì. Chứng chỉ mười phút hấp dẫn, nhưng việc kiểm chứng xét chữ ký có được tạo trong lúc chứng chỉ còn hiệu lực hay không (đã ghi ở Rekor), vì thế bản gốc vẫn kiểm được rất lâu sau đó.',
          },
          {
            question: 'On pushes to a long-lived branch, dorny/paths-filter with default settings reports backend, frontend and desktop as changed every time, even for a commit that touches only the backend. Why?|||Với các lần push vào một nhánh sống lâu, dorny/paths-filter để mặc định lần nào cũng báo backend, frontend và desktop đều đổi, kể cả với commit chỉ đụng backend. Vì sao?',
            options: [
              'fetch-depth: 1 hides the previous commit, so everything looks new|||fetch-depth: 1 giấu commit trước, nên mọi thứ trông như mới',
              'On push its base defaults to the default branch, so it compares the whole branch with main; set base: ${{ github.ref }}|||Khi push, base mặc định là nhánh mặc định, nên nó so cả nhánh với main; hãy đặt base: ${{ github.ref }}',
              'The shared file ch14/kiem-ma.js is listed in every filter, so any change selects all three|||Tệp dùng chung ch14/kiem-ma.js nằm trong mọi bộ lọc, nên thay đổi nào cũng chọn cả ba',
              'paths-filter only works on pull_request events and returns true for everything on push|||paths-filter chỉ chạy với sự kiện pull_request và trả true cho mọi thứ khi push',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The action’s own log in run 36075010880 said “Changes will be detected between main and ch14-mono” and found 20 changed files, while git diff before..sha found only ch14/backend/src/lich.js. Its README documents base defaulting to the default branch and base: ${{ github.ref }} for long-lived branches. The shared-file option is tempting, but that commit did not touch kiem-ma.js, and the job used fetch-depth: 0.|||VI: Chính log của action ở run 36075010880 ghi “Changes will be detected between main and ch14-mono” và thấy 20 tệp đổi, trong khi git diff before..sha chỉ thấy ch14/backend/src/lich.js. README của nó ghi base mặc định là nhánh mặc định và base: ${{ github.ref }} cho nhánh sống lâu. Phương án tệp dùng chung hấp dẫn, nhưng commit đó không đụng kiem-ma.js, và job đã dùng fetch-depth: 0.',
          },
        ],
      },
    },
  ],
};
