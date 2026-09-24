import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 11: Ôn tổng giữa khoá (Chương 1–10).
 * (Nâng cấp 24/09/2026: khoá có thêm Ch12–15, thi cuối khoá chuyển sang ga-15-5-thi-cuoi-khoa;
 *  bài đầu vẫn là ga-11-1-chot để seeder neo chương khi đổi tiêu đề — xem _HOP-DONG.md mục 4c.)
 * Số đo: một bản chốt các luật đo được của cả cuốn, và mười hai câu
 * kỳ thi bao trọn mười chương.
 */

export default {
  title: 'Chapter 11 — Mid-course review: Chapters 1–10|||Chương 11 — Ôn tổng giữa khoá: Chương 1–10',
  slug: 'ga-ch11-on-thi',
  description: 'Ôn tổng giữa khoá: bản đồ Chương 1–10, mỗi chương một trang điều cốt lõi có số đo thật, 10 lỗi hay gặp nhất, checklist tự kiểm, 15 câu phỏng vấn nền tảng, lộ trình Chương 12–15 — và một bài kiểm tra giữa khoá mười câu.',
  sortOrder: 12,
  lessons: [

    /* ─────────────────────────── 11.1 ─────────────────────────── */
    {
      title: '11.1 — What survived measurement: the first half in one lesson|||11.1 — Cái sống sót qua đo đạc: nửa khoá đầu trong một bài',
      slug: 'ga-11-1-chot',
      type: 'VIDEO',
      description: 'Bản chốt: các luật MẶC ĐỊNH đúng, các luật CHỈ đúng khi có số đo, và các cú tự-vá TRÔNG có ích và HỎNG âm thầm. Không phải một checklist — một cấu trúc kiến thức để đọc lại mỗi khi CI trên một kho MỚI khiến bạn không chắc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>What survived measurement</h2>
<p class="lead">Ten chapters of measurements collapse into three columns: what is true by default, what is true only when measured, and what is comfortable to believe and always wrong. Reading them in that shape makes it possible to apply this course to a repository you have never seen.</p>

<h3>Where you are: the map of the first half</h3>
<p>You have finished ten chapters. Before the three columns below, step back and look at what those ten chapters actually built. They were not ten separate topics. They were five abilities that a working engineer is expected to have with CI/CD (continuous integration / continuous delivery — the habit of testing every change automatically, and shipping it by a repeatable path):</p>
<ol>
<li><strong>Write</strong> a workflow that runs on the right event, on the right commit, with the right jobs (Chapters 1–3).</li>
<li><strong>Reuse</strong> other people’s code — actions — without handing them the keys (Chapter 4).</li>
<li><strong>Speed it up</strong> with numbers, not with folklore (Chapters 5 and 7).</li>
<li><strong>Keep it safe</strong>: secrets, token permissions, OIDC (Chapter 6).</li>
<li><strong>Fix it when it is red, ship it, and diagnose production</strong> (Chapters 8–10).</li>
</ol>
${slide('ga-11', 2, 'Nửa khoá đầu là năm năng lực, không phải mười chương rời')}
<p>The second picture is the one worth keeping in your head during an interview or an incident. A single run of a workflow passes through eight "boxes" in order, and each box is the subject of one chapter. When something goes wrong, the first useful question is not "how do I fix it?" but "<em>which box did it go wrong in?</em>" — because each box has its own evidence and its own tools.</p>
${slide('ga-11', 3, 'Một lần chạy đi qua tám ô — mỗi ô là một chương')}
<table>
<thead><tr><th>Box</th><th>What happens there</th><th>Where the evidence is</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td>Event</td><td>push, pull_request, schedule, workflow_dispatch… decide whether a run exists at all</td><td>the run list — a run that never appears is the only symptom</td><td>1</td></tr>
<tr><td>Filters + <code>if:</code></td><td><code>branches</code>/<code>paths</code> and job-level expressions are evaluated on GitHub, before any machine</td><td>"skipped" jobs, a check stuck on "Expected"</td><td>1, 3</td></tr>
<tr><td>Job asks for a machine</td><td><code>runs-on</code>, <code>needs</code>, matrix expansion; every job gets a brand-new runner (machine)</td><td>queue time, the job graph</td><td>2</td></tr>
<tr><td>Set up job</td><td>actions are resolved to a SHA and downloaded; token permissions are printed</td><td>the "Set up job" group — read it first when CI "changed by itself"</td><td>4, 6</td></tr>
<tr><td>Steps run</td><td>each step is a new shell process; exit code 0 = green; cache and artifacts move files</td><td>step log, <code>Post</code> steps, cache lines</td><td>2, 5</td></tr>
<tr><td>Secrets + token</td><td>masking in the log, <code>GITHUB_TOKEN</code> scope, OIDC tokens</td><td>masked <code>***</code> in the log, 403 errors</td><td>6</td></tr>
<tr><td>Log + annotation</td><td>the failure is summarised at the bottom of the run page with an exit code</td><td>annotations, <code>gh run view --log-failed</code></td><td>8</td></tr>
<tr><td>Deploy + check</td><td>a single deploy path, a lock, a health check, a rollback</td><td>deployments API, smoke-test output, what production is really running</td><td>9, 10</td></tr>
</tbody></table>
<p>Chapter 7 is not a box: it is a lens over all of them — the critical path (the chain of jobs that decides how long you wait), concurrency groups, variance between identical runs, and the price per minute.</p>

<h3>Skill → chapter: what to revise for which job</h3>
<p>Interviewers do not ask "what is in Chapter 5". They ask "our CI takes twelve minutes, what would you do?" This table turns the course around: start from the skill, find the chapter, and check that you have the <em>evidence</em> — a number you measured or a run you read — not just the definition.</p>
${slide('ga-11', 4, 'Muốn làm được việc này thì ôn chương nào')}
<table>
<thead><tr><th>Skill a team expects</th><th>Chapter</th><th>The evidence you already have</th></tr></thead>
<tbody>
<tr><td>Make a workflow run on the right event, branch and files</td><td>1</td><td>filters measured on the sandbox; on api-backend <code>src/*</code> matches 1 file and <code>src/**</code> matches 353</td></tr>
<tr><td>Split work into jobs, pass data between them, run a matrix</td><td>2</td><td>outputs travel in four hops; <code>2×3 − 1 + 1 = 6</code> jobs; 8 jobs used 6 different runners</td></tr>
<tr><td>Write conditions that neither always pass nor silently die</td><td>3</td><td>only five values are false; text outside <code>&#36;{{ }}</code> makes a condition always true</td></tr>
<tr><td>Use third-party actions safely</td><td>4</td><td>full 40-character SHA pins; the tj-actions/changed-files tag move of March 2025</td></tr>
<tr><td>Make CI faster and know when a cache loses money</td><td>5, 7</td><td>node_modules cache −79% (17.5 s → 3.6 s); break-even at ~26% hit rate; critical path</td></tr>
<tr><td>Protect secrets, least privilege, no stored cloud keys</td><td>6</td><td><code>permissions:</code> blocks, OIDC token with <code>exp − iat = 300</code> seconds</td></tr>
<tr><td>Read a red run and tell a flake from a real failure</td><td>8</td><td>four-level reading order; a 20% flake passes four re-runs 41% of the time</td></tr>
<tr><td>Deploy with a gate, a lock and a rollback</td><td>9</td><td>sandbox rollback in 12.6 s of downtime; environment approve / reject / branch rule</td></tr>
<tr><td>Diagnose a production incident with one cheap measurement</td><td>10</td><td>unauthenticated <code>curl</code>: 401/200 = route exists, 404 = stale build</td></tr>
</tbody></table>
<div class="callout"><p><strong>How to use this table.</strong> Cover the right-hand column and try to say the evidence out loud. If you can only say the definition ("a cache stores files between runs"), go back to that chapter’s 📌 summary and its quiz. If you can say the number and what it means, move on.</p></div>


<h3>Column 1 — always true</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">a workflow is only what its YAML says</span><span class="lz-lnote">Ch 1 — the file is the whole contract; if the behaviour on push differs from the file, the file wins and something else is broken (the runner, the trigger, an override)</span></div>
<div class="lz-layer"><span class="lz-lname">an action pinned to a moving ref is a supply-chain surface you do not own</span><span class="lz-lnote">Ch 4, Ch 6 — <code>@main</code> and <code>@v3</code> both move; only a full-SHA pin cannot be rewritten silently</span></div>
<div class="lz-layer"><span class="lz-lname">a secret in <code>echo</code> is a secret in the log</span><span class="lz-lnote">Ch 6 — the mask is a display filter, not a data guarantee; anything derived from a secret must not reach stdout</span></div>
<div class="lz-layer"><span class="lz-lname">a checker that has never been red is not a checker</span><span class="lz-lnote">Ch 8, Ch 10 — verify the checker before trusting it; break the thing checked and confirm the check turns red</span></div>
<div class="lz-layer"><span class="lz-lname">deploying is not a side effect of pushing</span><span class="lz-lnote">Ch 9 — the two July 2026 outages here started from workflows racing on <code>push:</code>; dispatch-only removes the whole class</span></div>
</div>

<h3>Column 2 — true only when you have measured</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">cache hits save time</span><span class="lz-lnote">Ch 5 — sometimes true. In this repo <code>node_modules/.cache</code> never existed, so the "cache tsc incremental" step ran on a never-created path. Measure before believing</span></div>
<div class="lz-layer"><span class="lz-lname">matrix jobs are faster</span><span class="lz-lnote">Ch 7 — for embarrassingly parallel work, yes. For work with a shared bottleneck (npm registry, docker layer cache upload) they can be slower AND more expensive. Measure the wall-clock, not the CPU-time</span></div>
<div class="lz-layer"><span class="lz-lname">a flaky test is infrastructure noise</span><span class="lz-lnote">Ch 8 — sometimes true, more often the test has a race the harness surfaces intermittently. A green re-run proves nothing on its own — Re-run reuses the same commit, and a 20% flake passes four re-runs in a row 41% of the time (8.2). Run it many times and count; a failure that repeats is real</span></div>
<div class="lz-layer"><span class="lz-lname">this action is safe because it has stars</span><span class="lz-lnote">Ch 4, Ch 6 — reputation is a prior, not a proof. Read the source, or pin to a reviewed SHA</span></div>
</div>

<h3>Column 3 — comfortable to believe and always wrong</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>|| true</code> makes the step "safe"</span><span class="lz-lnote">Ch 6, Ch 10 — it swallows the signal you needed. A step whose failure is invisible is worse than no step</span></div>
<div class="lz-layer"><span class="lz-lname">exit code 0 means success</span><span class="lz-lnote">Ch 6, Ch 10 — pkill returned 0 with the wrong process left alive; grep -c counted lines not matches; a pipe-fed <code>set -e</code> lost the exit status. Exit codes need a POST-CONDITION check</span></div>
<div class="lz-layer"><span class="lz-lname">the build being green means the image works</span><span class="lz-lnote">Ch 9 — 2026-08-18: build green, image bad, 7 minutes of 502. Add a libc-versus-engine check BEFORE push</span></div>
<div class="lz-layer"><span class="lz-lname">a failed migration is fixable with one command</span><span class="lz-lnote">Ch 10 — <code>--rolled-back</code> and <code>--applied</code> are both wrong in the middle state. The fix is a six-step protocol, not a flag</span></div>
</div>

<h3>Two operating rules on top of the columns</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">A</span><span class="lz-t">measure before you believe</span><span class="lz-d">Column 2 exists because most "obvious" optimisations are wrong on <em>this specific repository</em>. The measurement is often one command; the belief without it costs hours or a bad deploy.</span></div>
<div class="lz-step"><span class="lz-k">B</span><span class="lz-t">the auto-fix that fits the error is usually wrong</span><span class="lz-d">Column 3 is the same shape everywhere: the tool prints a solution, and the solution assumes the tool understood the problem. It did not. Read the error, list what ran, propose a fix, get it approved. Slow beats silently corrupt.</span></div>
</div>

<h3>The classes of failure this chapter catalogued</h3>
<p>Chapter 10 dated six real incidents. Each collapses to a class you can recognise on a new repo:</p>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">stale artifact</span><span class="lz-nsub">10.1</span></span>
<span class="lz-nbody">the code you see is not the code that ran. 404 with the file on disk, wrong bundle hash cached in the CDN, an image tag that was reused. Diagnose with an unauthenticated <code>curl</code>.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">checklist gap</span><span class="lz-nsub">10.2</span></span>
<span class="lz-nbody">the checklist ran what it configured to run. The failure happened in what it excluded. Widen the checklist against the concrete thing that broke.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">checker that cannot fire</span><span class="lz-nsub">10.3</span></span>
<span class="lz-nbody">a step that always passes is not a check. Break the thing checked and watch the step go red; if it does not, the step is decoration.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">name-based signalling in a renamed process</span><span class="lz-nsub">10.4</span></span>
<span class="lz-nbody">tool matches by a name the target can rewrite. Match by an invariant instead — port for daemons, container name for services, PID for tracked processes.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">state error mistaken for a command error</span><span class="lz-nsub">10.5</span></span>
<span class="lz-nbody">a failed migration is a question about the database's state, not about which flag to pass. Measure with <code>migrate diff</code> before choosing a resolve action.</span>
</div>
</div>

<h3>What to do on a NEW repository</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">read the workflow files first</span><span class="lz-lnote">not the README. The workflow files are the ground truth for what the CI actually does. Grep for <code>secrets.</code>, <code>uses:</code>, <code>run: |</code> — the concrete surface</span></div>
<div class="lz-layer"><span class="lz-lname">count SHA-pinned actions vs branch-pinned</span><span class="lz-lnote">the ratio tells you how much of your build's supply chain has already been reviewed. A low ratio is the norm, not the exception: api-backend itself had 0 SHA pins out of 24 <code>uses:</code> lines on 24/09/2026 — which is exactly why the number is worth measuring</span></div>
<div class="lz-layer"><span class="lz-lname">grep for <code>|| true</code>, <code>continue-on-error</code>, <code>|| sleep</code></span><span class="lz-lnote">these are the shapes of silent-failure passes. Each is a place a checker might not fire</span></div>
<div class="lz-layer"><span class="lz-lname">look at the last five failed runs</span><span class="lz-lnote"><code>gh run list --status failure --limit 5</code>. Are they the same failure? Then something is being ignored. Are they different? Then people are pushing broken code and cleaning up after — measure how often</span></div>
<div class="lz-layer"><span class="lz-lname">measure one build's cache hit rate</span><span class="lz-lnote">enable debug logging (<code>ACTIONS_STEP_DEBUG=true</code>) on one run. Read the actual cache-miss lines. Believe those, not the intent of the yaml</span></div>
</div>

<div class="callout">
<p><strong>One sentence.</strong> This course is not a set of rules to memorise — it is a habit: every time a CI step surprises you, ask what the step MEASURED, decide whether it MEASURED what you thought, and if it did not, fix the measurement before you fix the code.</p>
</div>

<div class="pitfall">
<p><strong>Trap — treating the course as complete.</strong> Every repository has its own incident log, and every incident log adds a class this catalogue does not cover. The correct way to use this chapter is as a starter — the second time you diagnose a novel failure, add it to your own <code>CLAUDE.md</code>-shaped notes, with a date and a measurement.</p>
</div>


<h3>Ten chapters, one page each</h3>
<p>The columns above are the <em>habits</em>. This section is the <em>content</em>: for each chapter, the few facts that are worth remembering a year from now, the one trap that catches most people, and one real run you can open to see it happen. Every number here was measured in that chapter — on this repository or on the public sandbox <a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a> — so if a number surprises you, the chapter shows how it was measured.</p>

<h3>Chapter 1 — the workflow file, and the traps that come from YAML</h3>
${slide('ga-11', 5, 'Ch 1 — YAML đọc khác bạn nghĩ; trigger là một chính sách')}
<ul>
<li>A workflow answers four questions: WHEN (<code>on:</code>), WHAT (<code>jobs:</code>), WHERE (<code>runs-on:</code>), HOW (<code>steps:</code> with <code>uses:</code> or <code>run:</code>).</li>
<li>YAML (the file format) reads differently from your eyes: unquoted <code>18.20</code> becomes the number <code>18.2</code> and installs Node 18.2.0 without any error; <code>run: &gt;</code> folds two lines into ONE command, so the second command silently disappears (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986150275" target="_blank" rel="noopener">run 35986150275</a>, job <code>gap-dong</code>). Quote every version, use <code>|</code> for multi-line scripts.</li>
<li>A trigger is a <strong>policy</strong>: "runs on push" means "anyone who can push can start it" — including a deploy. <code>types:</code> <em>replaces</em> the default list (for <code>pull_request</code>: opened, synchronize, reopened).</li>
<li><code>pull_request</code> runs on a merge commit GitHub builds (<code>refs/pull/N/merge</code>), not on your branch — two green branches can still make a red PR.</li>
<li><code>schedule</code> means "not earlier than": 14 real Sundays, 0 on time, delays of 41 minutes to 5.8 hours.</li>
<li>Filters: <code>*</code> stops at <code>/</code>; never filter a <em>required</em> check at the trigger — a skipped workflow never reports and the PR waits forever on "Expected".</li>
</ul>

<h3>Chapter 2 — jobs, runners, and the machines that sit waiting</h3>
${slide('ga-11', 6, 'Ch 2 — Mỗi job là một cỗ máy mới; needs: là thứ tự duy nhất')}
<ul>
<li>Every job gets a fresh machine: 8 jobs used 6 runner IDs (the 2 skipped jobs never asked for one). Nothing crosses a job boundary by itself — not files, not <code>node_modules</code>, not environment variables.</li>
<li><code>needs:</code> is the only ordering tool. A value travels in four hops: <code>$GITHUB_OUTPUT</code> → a step with an <code>id</code> → the job’s <code>outputs:</code> → <code>needs.&lt;job&gt;.outputs</code>. A wrong name gives an empty string, not an error.</li>
<li>A failed parent makes its children SKIP, and skipping spreads. Any <code>if:</code> without a status function secretly means <code>success() &amp;&amp; …</code>.</li>
<li>Default shell on Linux/macOS is <code>bash -e {0}</code> — <strong>without</strong> <code>pipefail</code>; <code>shell: bash</code> adds it. On Windows the default is <code>pwsh</code>, where a failing external command in the middle of a script does not turn the step red. The step-condition table ran for real in <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945632" target="_blank" rel="noopener">run 35989945632</a>.</li>
<li>Matrix: cross product → <code>exclude</code> → <code>include</code>. <code>fail-fast</code> is true by default and cancels the other legs, which then finish with no result.</li>
<li>A mistyped <code>runs-on</code> label does not error — the job queues forever. actionlint catches it before you push.</li>
</ul>

<h3>Chapter 3 — expressions, contexts, and when things exist</h3>
${slide('ga-11', 7, 'Ch 3 — Biểu thức được thay thành chữ TRƯỚC khi shell tồn tại')}
<ul>
<li><code>&#36;{{ }}</code> is replaced by text <em>before</em> the shell exists; the shell only ever sees the finished script. That is why untrusted values (PR titles, branch names) must go through <code>env:</code> and be read as <code>"$VAR"</code>.</li>
<li>Only five values are false: <code>false</code>, <code>0</code>, <code>-0</code>, <code>''</code>, <code>null</code>. The string <code>'false'</code>, <code>'0'</code> and an empty array are all <em>true</em>.</li>
<li>Text outside the braces turns the whole condition into a non-empty string — always true. <code>github.event.inputs.x</code> is a string; <code>inputs.x</code> keeps the boolean.</li>
<li>A misspelled or unavailable context evaluates to an empty string, never an error — the exact shape of a bug that survives review.</li>
<li><code>hashFiles()</code> returns an empty string when nothing matches, so a cache key ending in a dash means the glob missed (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179987" target="_blank" rel="noopener">run 36000179987</a> produced <code>cache-Linux-</code>).</li>
<li>After a failure, <code>failure()</code>, <code>always()</code> and <code>!cancelled()</code> run; after a cancel, only <code>always()</code> and <code>cancelled()</code>.</li>
</ul>

<h3>Chapter 4 — actions, and running somebody else’s code</h3>
${slide('ga-11', 8, 'Ch 4 — @v4 là một con trỏ; chỉ SHA 40 ký tự là đứng yên')}
<ul>
<li>A <code>uses:</code> line is resolved to a commit SHA and downloaded during "Set up job", before step 1. An action can reach your workspace, the network and <code>$GITHUB_ENV</code>.</li>
<li><code>@v4</code> is a pointer: fifteen checkout releases have sat under it. In March 2025 the tags of tj-actions/changed-files were moved to a malicious commit; workflows pinned to a tag printed their secrets into public logs, workflows pinned to a SHA did not.</li>
<li>Pin with the full 40-character SHA plus a <code># vX.Y.Z</code> comment, and let Dependabot (<code>package-ecosystem: github-actions</code>) move the pins, or they age into unpatched dependencies. Measured on api-backend on 24/09/2026: 24 <code>uses:</code> lines, 0 SHA pins.</li>
<li><code>actions/checkout</code> fetches depth 1: no <code>origin/main</code>, no tags — <code>git diff origin/main...HEAD</code> fails with "ambiguous argument". <code>persist-credentials: false</code> removes the stored token.</li>
<li>A local action (<code>uses: ./.github/actions/x</code>) is read from disk, so it only exists after checkout (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000264372" target="_blank" rel="noopener">run 36000264372</a>).</li>
</ul>

<h3>Chapter 5 — cache and artifacts, measured</h3>
${slide('ga-11', 9, 'Ch 5 — Cache là tối ưu có thể biến mất; artifact là bàn giao')}
<ul>
<li>On a GitHub runner, <code>cache: npm</code> cut the install from 17.5 s to 13.7 s (−22%); caching <code>node_modules</code> and skipping <code>npm ci</code> on a hit cut it to 3.6 s (−79%). The first run with any cache is slower: it does all the work and then saves.</li>
<li>A cache entry is written once per key; a constant key freezes on run one; a key containing <code>github.sha</code> misses and saves on every run.</li>
<li>A key is also matched as a prefix: <code>restore-keys</code> can restore files while <code>cache-hit</code> says false (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36005610825" target="_blank" rel="noopener">run 36005610825</a>). End keys with a hash.</li>
<li>A dead cache prints a yellow warning in a green job; an <em>empty</em> cache is worse — no warning, "hit" every time, only <code>Cache Size: ~0 MB</code> gives it away.</li>
<li>Artifact = guaranteed hand-over (90 days by default); cache = an optimisation that can vanish (7 days unused, 10 GB per repository by default). The same name uploaded twice fails with 409; zip drops the executable bit.</li>
<li>Break-even: the node_modules cache pays when more than about 26% of runs hit.</li>
</ul>

<h3>Chapter 6 — secrets, permissions, and the token</h3>
${slide('ga-11', 10, 'Ch 6 — Che bí mật chỉ phủ ĐÚNG chuỗi đã lưu, trong LOG')}
<ul>
<li>Masking replaces the exact registered strings <strong>in the log</strong>. Measured with fake values: the value, its plain base64 and each line of a multi-line secret are masked; an upper-cased copy, a substitution, a prefix, a JSON field, files, artifacts and network requests are not.</li>
<li>If a secret leaks: <strong>rotate first</strong>, delete the log second.</li>
<li><code>GITHUB_TOKEN</code> is minted per job, for one repository, and dies with the job. Listing one permission sets all others to <code>none</code>; a job-level block <em>replaces</em> the workflow-level one.</li>
<li>OIDC replaces a stored cloud key with a signed token that lives five minutes (<code>exp − iat = 300</code>); the job needs <code>id-token: write</code>, and the real security is the cloud’s trust policy matching <code>sub</code>.</li>
<li>A script that audits the whole repository, plus actionlint and zizmor, ran on Linux and macOS in <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36007044889" target="_blank" rel="noopener">run 36007044889</a>. zizmor found four template injections on api-backend that grep missed.</li>
</ul>

<h3>Chapter 7 — speed, concurrency, and its price</h3>
${slide('ga-11', 11, 'Ch 7 — Chỉ job trên đường tới hạn làm run nhanh hơn')}
<ul>
<li>A run has three numbers: machine-seconds (money), wall-clock (waiting) and the critical path (the floor of the wall-clock). Only jobs on the critical path change how long you wait: halving api-backend’s Linux build saves 0 s because it has 199 s of slack.</li>
<li>Removing a <code>needs:</code> edge that is not a real data dependency was the best measured change: median 124 s → 95 s on the sandbox, same machine-seconds.</li>
<li>Concurrency, three pushes: <code>cancel-in-progress: true</code> finished the last commit at +154 s; <code>false</code> at +183 s and silently dropped commit 2; <code>queue: max</code> at +274 s and ran every commit. Cancelling kills a step in the middle (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009923442" target="_blank" rel="noopener">run 36009923442</a>) — never use it on deploys.</li>
<li>The same commit took 37–77 s over 14 runs (2.08×). Compare medians, in pairs.</li>
<li>Prices (09/2026, private repositories): Linux $0.006, Windows $0.010, macOS $0.062 per minute, each job rounded up to a whole minute. Public repositories on standard runners are free.</li>
</ul>

<h3>Chapter 8 — when CI is red</h3>
${slide('ga-11', 12, 'Ch 8 — Đọc mã thoát trước, đọc log sau')}
<ul>
<li>Read the annotation at the bottom of the run page first: it already shows each failed job’s exit code. 1 is a tool’s verdict; 2, 126 and 127 mean the shell could not run the program; 134 is V8 giving up loudly on its heap; 137 is the kernel killing silently (out of memory). The fixes for 134 and 137 are opposite.</li>
<li>Reading order: annotation → first red job (grey jobs are consequences of <code>needs:</code>) → red step → the real error line above <code>##[error]</code>.</li>
<li>"It failed, I re-ran it, it passed" proves nothing: a test that fails 20% of the time passes four re-runs in a row 0.8⁴ ≈ 41% of the time (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011087956" target="_blank" rel="noopener">run 36011087956</a>). Re-run uses the SAME commit. Run it many times and count.</li>
<li>Reproduce locally before pushing "debug" commits: <code>docker run</code> with the failing image, or <code>act</code> — but <code>act</code> is not GitHub’s image, OS or services.</li>
<li>A fix is verified as a pair: red without the fix, green with it, under the same conditions.</li>
</ul>

<h3>Chapter 9 — deploying from CI, and why this repository stopped</h3>
${slide('ga-11', 13, 'Ch 9 — Deploy an toàn cần một đường, một khoá, và rollback')}
<ul>
<li>Before 6 July 2026 one push to <code>main</code> here started four workflows, three of which touched the VPS, because two <code>paths:</code> filters overlapped. On 6 July three runs modified the same containers within 74 seconds.</li>
<li>A shared concurrency group removes overlap but not correctness: a group keeps one pending run, so the run carrying the migration was replaced while waiting.</li>
<li>Safe push-to-deploy needs one deploy path, idempotent deploys and a rollback on the deploy path. This repository chose a human-run script (<code>bash deploy-nha.sh</code>, which pushes to GitHub at the end) until those exist; 12 of 14 workflows are manual-only.</li>
<li>Rollback on the sandbox: a broken image, five health checks, automatic rollback — 12.6 s of downtime, 2.2 s of it the rollback itself, and the job stays RED (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36017616624" target="_blank" rel="noopener">run 36017616624</a>).</li>
<li>"The previous version" is what production is running, not <code>HEAD^</code>; after a rollback, <code>HEAD^</code> is the broken one.</li>
<li><code>environment:</code> turns a job into a gated deploy: approve, reject with a comment, block a branch — all measured.</li>
</ul>

<h3>Chapter 10 — diagnosis by real cases</h3>
${slide('ga-11', 14, 'Ch 10 — Chẩn đoán bằng một phép đo rẻ trước khi sửa')}
<ul>
<li>Unauthenticated <code>curl</code>: 401 and 200 mean "this route is in the running build"; 404 means it is not — a stale build. A health check asks one route, so a stale image passes it.</li>
<li>A green checklist is evidence only for the files it opened: <code>tsc --noEmit</code> opened 0 files in <code>prisma/</code>, so a broken seed passed it and failed in production.</li>
<li>A checker that cannot turn red is decoration: the <code>wget</code> check ran for seven weeks inside a container that has no <code>wget</code>. Break the target on purpose and watch the check fail.</li>
<li>Next.js renames its process to <code>next-server</code>, so <code>pkill -f "next start"</code> kills nothing. Kill by port, then confirm with a second tool.</li>
<li>A failed migration is a question about the database’s <em>state</em>. Measure with <code>prisma migrate diff</code> before choosing anything; never auto-resolve.</li>
</ul>

<h3>One CI workflow that carries the whole first half</h3>
<p>If an interviewer asks you to "write a CI workflow for a Node project on the whiteboard", this is the answer — and every line has a reason you can cite from a chapter. Read the comments as the reasons.</p>
${slide('ga-11', 15, 'Một workflow CI mẫu gom cả nửa khoá, từng dòng một chương')}
<pre><code class="language-yaml">name: ci
on:
  pull_request:                       # Ch1: runs on the merge commit
  push:
    branches: [main]                  # Ch1/Ch9: CI only — no deploy here
permissions:
  contents: read                      # Ch6: least privilege for GITHUB_TOKEN
concurrency:
  group: ci-&#36;{{ github.ref }}         # Ch7: one run per branch / PR
  cancel-in-progress: true            # fine for CI, never for a deploy
jobs:
  test:
    runs-on: ubuntu-24.04             # Ch2: pinned image, not -latest
    timeout-minutes: 15               # Ch2: a hung job dies early
    defaults:
      run:
        shell: bash                   # Ch2/Ch8: adds pipefail
    steps:
      - uses: actions/checkout@&lt;40-char-sha&gt;   # v4 — Ch4: pinned
        with:
          persist-credentials: false  # Ch4/Ch6
      - uses: actions/setup-node@&lt;40-char-sha&gt; # v4
        with:
          node-version-file: .nvmrc   # Ch4: same Node as developers
          cache: npm                  # Ch5: key computed from the lockfile
      - run: npm ci
      - run: npm test                 # Ch8: the exit code is the verdict</code></pre>
<p>What is deliberately <em>not</em> there is just as important: no <code>secrets.*</code> (CI of a pull request should not need any), no <code>pull_request_target</code>, no <code>continue-on-error</code>, no <code>|| true</code>, no deploy step. Replace <code>&lt;40-char-sha&gt;</code> with the real commit SHA of the release you reviewed.</p>

<h3>The 10 most common mistakes of the first half</h3>
<p>These are collected from the "Trap" boxes of Chapters 1–10 — the ones that appeared in more than one chapter, or that caused a real incident in this repository. For each: the symptom you will see, and the fix.</p>
${slide('ga-11', 16, '10 lỗi hay gặp nhất của nửa khoá (1–5)')}
${slide('ga-11', 17, '10 lỗi hay gặp nhất của nửa khoá (6–10)')}
<table>
<thead><tr><th>#</th><th>Mistake</th><th>What you see</th><th>Fix</th><th>Ch</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trusting YAML the way it reads to the eye</td><td>Node 18.2.0 installed; the second command of a <code>run: &gt;</code> never ran</td><td>quote every version; use <code>|</code>; run actionlint</td><td>1</td></tr>
<tr><td>2</td><td>Filtering a required check at the trigger</td><td>PR stuck on "Expected — Waiting for status to be reported"</td><td>always start the workflow; skip inside the job</td><td>1, 3</td></tr>
<tr><td>3</td><td>Expecting something to carry over to the next job</td><td>"file not found", empty variable in job 2</td><td>outputs for small values, artifacts for files</td><td>2</td></tr>
<tr><td>4</td><td>A condition that is always true or silently empty</td><td>a step runs when it should not; a value is blank</td><td>whole condition inside <code>&#36;{{ }}</code>; compare <code>== 'true'</code> or use real booleans</td><td>3</td></tr>
<tr><td>5</td><td>Pinning actions to a tag or branch</td><td>nothing — until a tag is moved</td><td>40-character SHA + Dependabot</td><td>4</td></tr>
<tr><td>6</td><td>A cache nobody measured</td><td>"Cache not found" every run, or a hit of ~0 MB</td><td>read three consecutive runs: four log lines and the size</td><td>5</td></tr>
<tr><td>7</td><td>Believing the mask protects everything</td><td>a transformed secret in plain text in the log</td><td>never print derived values; rotate if leaked</td><td>6</td></tr>
<tr><td>8</td><td>Optimising a job that is not on the critical path</td><td>the job got faster, the run did not</td><td>compute the critical path from the jobs API first</td><td>7</td></tr>
<tr><td>9</td><td>Using Re-run as a diagnosis</td><td>green after a re-run, red again next week</td><td>run N times and count; count failures by test name</td><td>8</td></tr>
<tr><td>10</td><td>Two deploy paths, and a rollback that guesses <code>HEAD^</code></td><td>containers modified by two runs; rollback to the broken build</td><td>one deploy path + shared lock; ask production what it runs</td><td>9, 10</td></tr>
</tbody></table>

<h3>What the ten have in common</h3>
<p>Look at the "What you see" column again. In almost every row the failure is <strong>quiet</strong>: an empty string instead of an error, a green step instead of a red one, a run that simply never appears. GitHub Actions is generous — it prefers to continue rather than stop — and that generosity is exactly what lets a broken pipeline look healthy for weeks. So the method of the whole first half is one loop:</p>
${slide('ga-11', 18, 'Mẫu chung của cả mười lỗi: một thứ HỎNG mà không ỒN')}
<ol>
<li><strong>Assume it can fail silently.</strong> Ask: if this were broken, what would I see? If the answer is "nothing", you have found the risk.</li>
<li><strong>Measure it once.</strong> A real run, the real log, the API — not the YAML and not your memory of the docs.</li>
<li><strong>Break it on purpose.</strong> The check must turn red when the thing it checks is broken. A check you have never seen red is not a check.</li>
<li><strong>Turn the measurement into a permanent check</strong>: actionlint and zizmor before the push, a smoke test after the deploy, a test that fails if the checker stays green.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Trap — reviewing only the chapters that felt hard.</strong> Most of the ten mistakes come from the "easy" chapters (1, 2 and 3), because nobody re-reads them. Reviewing by feeling picks the wrong chapters; reviewing with the checklist below picks the ones you cannot yet prove.</div>

<h3>Checklist — "I can do this"</h3>
<p>Tick a line only when you have done it on a repository of your own, with a run link you could show someone. Twelve ticks means you are ready for the second half.</p>
${slide('ga-11', 19, 'Tự kiểm: tôi đã làm được những việc này chưa?')}
<ul>
<li>☐ I can write a workflow for <code>pull_request</code> and <code>push</code>, with correct <code>paths</code> filters, without freezing a required check.</li>
<li>☐ I can split work into three jobs and pass a version number from the first to the last through outputs.</li>
<li>☐ I can write a matrix over three operating systems with <code>exclude</code>/<code>include</code> and explain when I set <code>fail-fast: false</code>.</li>
<li>☐ I can write the <code>if:</code> for "only on main", "only when tests failed", "even when cancelled", and say which one must never be used for a deploy.</li>
<li>☐ I can pin every action by SHA and set up Dependabot for <code>github-actions</code>.</li>
<li>☐ I can prove a cache works by reading three consecutive runs.</li>
<li>☐ I can set minimal <code>permissions:</code> and read the result in "Set up job".</li>
<li>☐ I can explain how OIDC replaces a stored cloud key (<code>sub</code>, <code>aud</code>, five-minute token).</li>
<li>☐ I can find the critical path of a run from the jobs API.</li>
<li>☐ I can triage a red run in the four-level order in under five minutes from the terminal with <code>gh</code>.</li>
<li>☐ I can write a deploy job that saves the running version, swaps, checks, rolls back and still ends red.</li>
<li>☐ I can break a checker on purpose and watch it turn red.</li>
</ul>

<h3>Interview question bank — 15 foundation questions</h3>
<p>These are the questions a CI/CD interview for a junior or intern role usually starts with. The answers are outlines, not scripts: say the <em>mechanism</em>, then one <em>number or incident</em> from this course. That second half is what separates "I read about it" from "I have done it".</p>
${slide('ga-11', 20, 'Câu hỏi phỏng vấn nền tảng (1/2): trả lời bằng cơ chế + số đo')}
${slide('ga-11', 21, 'Câu hỏi phỏng vấn nền tảng (2/2): kể một sự cố thật')}
<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q1: What is the difference between CI, continuous delivery and continuous deployment?</strong><br>A: CI tests every change automatically when it is pushed or proposed. Continuous delivery keeps every green build releasable, with a human deciding when to ship. Continuous deployment ships every green build automatically. My own site does CI on GitHub and delivery by a script I run — deliberately, after two incidents with automatic deploys.</p>
<p><strong>Q2: Workflow, job, step, action — what is each?</strong><br>A: A workflow is one YAML file under <code>.github/workflows</code>; a job is a set of steps that runs on one fresh machine; a step is one shell process or one action; an action is packaged code called with <code>uses:</code>. Jobs run in parallel unless <code>needs:</code> orders them.</p>
<p><strong>Q3: How do two jobs share data?</strong><br>A: They do not share a disk. Small values go through job outputs (four hops: <code>$GITHUB_OUTPUT</code>, step id, job <code>outputs:</code>, <code>needs.x.outputs</code>); files go through artifacts. A cache is not a hand-over mechanism — it can be evicted.</p>
<p><strong>Q4: A PR was green, you merged it, and main went red. How?</strong><br>A: The PR run tested the merge commit with the <em>old</em> main. Main moved after that, so the combination was never tested. "Require branches to be up to date" or a merge queue fixes it.</p>
<p><strong>Q5: Why pin actions to a commit SHA?</strong><br>A: Tags and branches can be moved; a full SHA cannot. In March 2025 the tags of tj-actions/changed-files were moved to malicious code and tag-pinned workflows leaked secrets into logs. Pinning without updates ages badly, so pair it with Dependabot.</p>
<p><strong>Q6: Why is <code>pull_request_target</code> dangerous?</strong><br>A: It runs in the base repository’s context, with its secrets and a write token. That is fine for labelling a PR; checking out and running the PR’s code in it gives any fork your secrets. Keep PR code under <code>pull_request</code>.</p>
<p><strong>Q7: Cache or artifact?</strong><br>A: Cache to make a later run faster — it may be missing and the job must still work. Artifact to hand a result to another job or a person — it is guaranteed for its retention period. I measured a node_modules cache: −79% on a hit, but only profitable above ~26% hit rate.</p>
<p><strong>Q8: Our CI takes twelve minutes. Where do you start?</strong><br>A: Measure before changing anything: find the critical path from the jobs API. Only jobs on it change the wait. Then remove false <code>needs:</code> edges, then attack the slowest job on the path, and only then add caches or split jobs.</p>
<p><strong>Q9: Are secrets safe in logs because GitHub masks them?</strong><br>A: Only the exact stored string is masked, and only in the log. A base64 of it is masked, but an upper-cased copy, a JSON field, a file or an artifact is not. If one leaks, rotate first.</p>
<p><strong>Q10: How do you deploy to a cloud without storing a key?</strong><br>A: OIDC: the job gets <code>id-token: write</code>, requests a signed token that lives five minutes, and the cloud exchanges it for short-lived credentials if the trust policy matches the token’s <code>sub</code> — ideally down to the environment name.</p>
<p><strong>Q11: A test failed, you re-ran it, it passed. Is it flaky?</strong><br>A: Not proven. Re-run uses the same commit, and a 20% flake passes four re-runs 41% of the time. I would run it many times, count, and count failures by test name — eleven red runs in one day on this repository turned out to be one real bug.</p>
<p><strong>Q12: Exit code 137 versus 134?</strong><br>A: 137 is 128 + 9: the process was killed by SIGKILL, usually out of memory, with no message from the program. 134 is an abort — Node/V8 reached its own heap limit and said so. For 134 you raise the heap limit; for 137 you lower memory use below what the machine has.</p>
<p><strong>Q13: Two workflows deploy to the same server. How do you stop them colliding?</strong><br>A: First, make it one deploy path. Then one concurrency group named after the target, shared by everything that deploys, with <code>cancel-in-progress: false</code>. Concurrency orders runs; it does not make them idempotent.</p>
<p><strong>Q14: How do you roll back a bad deploy?</strong><br>A: Record what production runs before swapping, health-check after, and swap back automatically if the check fails — the job still ends red. "The previous version" is read from production, not guessed as <code>HEAD^</code>. Schema changes follow expand-and-contract so code rollback stays possible.</p>
<p><strong>Q15: The deploy was green but a new endpoint returns 404. Where do you look?</strong><br>A: One unauthenticated <code>curl</code>: 401 or 200 means the route is in the running build, 404 means the build is stale. Then rebuild for real, and add that route to a post-deploy smoke test that fails on 404.</p>
</div>

<h3>The second half of the course: Chapters 12–15</h3>
<p>The first half taught you to <em>read, fix, secure and speed up</em> a pipeline that already exists. That is most of what a junior does in the first months. The second half teaches you to <em>build</em> pipelines that other people depend on — the level an interviewer means by "from basic to expert".</p>
${slide('ga-11', 23, 'Nửa sau khoá: từ "dùng được" tới "dựng cho cả đội"')}
<ul>
<li><strong>Chapter 12 — Reuse at team scale.</strong> Lesson 4.5 only touched "three ways to stop copying". Chapter 12 goes all the way: reusable workflows with <code>workflow_call</code> (inputs, secrets, outputs), composite actions, writing your own JavaScript and Docker actions, and templates for an organisation.</li>
<li><strong>Chapter 13 — Your own runners.</strong> How a runner works, a self-hosted runner started as an <em>ephemeral</em> container for one job and removed immediately, why a self-hosted runner must never serve a public repository’s PRs, and scaling with Actions Runner Controller.</li>
<li><strong>Chapter 14 — Quality gates, supply-chain security and releases.</strong> Rulesets and required checks, Dependabot and CodeQL, releases created automatically, artifact attestations, and CI for a monorepo like api-backend (backend + frontend + desktop).</li>
<li><strong>Chapter 15 — Capstone.</strong> A complete CI/CD pipeline from zero for a small clinic-booking app: PR checks with a Postgres service container, a multi-stage image pushed to GHCR, a gated deploy with a lock and rollback — then the <strong>final exam of the whole course</strong> (20 questions).</li>
</ul>
<div class="callout"><p><strong>Order matters.</strong> Chapter 12 assumes Chapter 4 (actions) and Chapter 6 (permissions); Chapter 13 assumes Chapter 2 (runners) and Chapter 6; Chapter 14 assumes Chapters 4 and 6; the capstone uses everything. If the checklist above has more than three empty boxes, close them first — the second half builds on top of them rather than repeating them.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> an interviewer says "open your own GitHub repository and tell me what its CI does and what you would fix first". Do the short version of the audit now, on a repository of your own that has at least one workflow.</p><ol>
<li>List the workflows and their triggers: <code>grep -n -A6 '^on:' .github/workflows/*.yml</code>. Write one line per workflow: events, <code>paths</code>, whether it touches a server.</li>
<li>Count SHA pins: <code>grep -h 'uses:' .github/workflows/*.yml | wc -l</code> and <code>grep -hE 'uses: .*@[0-9a-f]{40}' .github/workflows/*.yml | wc -l</code>. Write the ratio.</li>
<li>Count permission blocks: <code>grep -l 'permissions:' .github/workflows/*.yml | wc -l</code>.</li>
<li>Open the last failed run: <code>gh run list --status failure -L 1</code>, then <code>gh run view &lt;id&gt; --log-failed | tail -40</code>. Write down the exit code and which of the four reading levels told you the cause.</li>
<li>Pick ONE of the ten mistakes your repository has, and write the one-line fix you would make.</li></ol>
<p><strong>Done when:</strong> you have a written note with one line per workflow, a SHA-pin ratio (a number, even if it is 0), the permission-block count, one exit code with its meaning, and one chosen fix — and you can say all of it out loud in under two minutes. The full 60-minute version, with a real PR, is slide 24.</p></div>
${slide('ga-11', 24, 'Thực hành Chương 11 (60 phút): soát kho của chính bạn')}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CI (continuous integration)</span><span class="v">Testing every change automatically when it is pushed or proposed, so broken code is found in minutes, not at release.</span></div>
  <div class="kv"><span class="k">Continuous delivery / deployment</span><span class="v">Delivery: every green build is releasable and a human decides when. Deployment: every green build ships automatically.</span></div>
  <div class="kv"><span class="k">Critical path</span><span class="v">The longest chain of dependent jobs in a run. Only jobs on it change how long you wait.</span></div>
  <div class="kv"><span class="k">Silent failure</span><span class="v">A failure that produces no error: an empty string, a green step, a run that never appears. The common shape of the ten mistakes.</span></div>
  <div class="kv"><span class="k">SHA pin</span><span class="v">Referencing an action by its full 40-character commit hash, which cannot be moved the way a tag or branch can.</span></div>
  <div class="kv"><span class="k">Least privilege</span><span class="v">Giving the token only the permissions a job needs, set with <code>permissions:</code>.</span></div>
  <div class="kv"><span class="k">Smoke test</span><span class="v">A quick check after a deploy that the important routes exist and answer; it must fail loudly on a broken target.</span></div>
  <div class="kv"><span class="k">Reusable workflow (Ch 12)</span><span class="v">A workflow called by other workflows with <code>workflow_call</code>, the first tool of the second half.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The first half built five abilities: write, reuse safely, speed up with numbers, keep safe, fix and ship.</li>
<li>A run passes through eight boxes — event, filters, job, set-up, steps, secrets, log, deploy — and every diagnosis starts with "which box?".</li>
<li>Each chapter leaves a handful of measured facts; knowing the number and how it was measured is what an interviewer listens for.</li>
<li>The ten most common mistakes share one shape: something breaks quietly. Measure once, break it on purpose, then make the measurement a permanent check.</li>
<li>Use the twelve-line checklist and the fifteen interview questions to find the chapters you cannot yet prove, and close them before Chapter 12.</li>
<li>The second half (Chapters 12–15) moves from using pipelines to building them for a team, and ends with the capstone and the final exam.</li>
</ul>

<h3>Sources for the next step</h3>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — where the CI ends and the operation starts</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the boundary this course stopped at: what you do once the artifact is built and the deploy has landed. Reads like a continuation of Chapter 9.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — the layer that GH cache hits and misses talk about</span><span class="lc-sub">/courses/docker/learn${REF} — build cache, layer invalidation, and what makes a Dockerfile cache-friendly. Chapter 5 assumed you had these primitives.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — the shell semantics behind the run block</span><span class="lc-sub">/courses/linux-bash/learn${REF} — <code>set -e</code>, pipe exit codes, subshells, argv rewriting. Half the traps in Chapters 6 and 10 are shell semantics wearing YAML clothes.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — the source dataset for Chapter 10</span><span class="lc-sub">the incident log this repo maintains, with dates. The habit worth copying: every diagnosis becomes a dated row and a lesson.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Cái sống sót qua đo đạc</h2>
<p class="lead">Mười chương đo đạc gói vào ba cột: cái MẶC ĐỊNH đúng, cái CHỈ đúng khi đã đo, và cái thoải mái tin và LUÔN sai. Đọc theo hình dạng ấy khiến bạn có thể áp cuốn này lên một kho bạn chưa từng thấy.</p>

<h3>Bạn đang ở đâu: bản đồ nửa khoá đầu</h3>
<p>Bạn đã học xong mười chương. Trước khi vào ba cột bên dưới, lùi lại một bước và nhìn xem mười chương ấy thật ra đã dựng nên cái gì. Chúng không phải mười chủ đề rời. Chúng là năm năng lực mà một kỹ sư đi làm được kỳ vọng phải có với CI/CD (continuous integration / continuous delivery — tích hợp liên tục / phát hành liên tục: thói quen kiểm mọi thay đổi một cách tự động, và đưa nó lên bằng một con đường lặp lại được):</p>
<ol>
<li><strong>Viết</strong> một workflow chạy đúng sự kiện, trên đúng commit, với đúng các job (Chương 1–3).</li>
<li><strong>Dùng lại</strong> mã của người khác — các action — mà không trao chìa khoá cho họ (Chương 4).</li>
<li><strong>Tăng tốc</strong> bằng con số, không bằng lời đồn (Chương 5 và 7).</li>
<li><strong>Giữ an toàn</strong>: bí mật, quyền của token, OIDC (Chương 6).</li>
<li><strong>Sửa khi đỏ, đưa lên production, và chẩn đoán production</strong> (Chương 8–10).</li>
</ol>
${slide('ga-11', 2, 'Nửa khoá đầu là năm năng lực, không phải mười chương rời')}
<p>Hình thứ hai là hình đáng giữ trong đầu khi đi phỏng vấn hoặc khi có sự cố. Một lần chạy (run) của workflow đi qua tám "ô" theo thứ tự, và mỗi ô là chủ đề của một chương. Khi có gì hỏng, câu hỏi hữu ích đầu tiên không phải "sửa thế nào?" mà là "<em>nó hỏng ở ô nào?</em>" — vì mỗi ô có bằng chứng riêng và công cụ riêng.</p>
${slide('ga-11', 3, 'Một lần chạy đi qua tám ô — mỗi ô là một chương')}
<table>
<thead><tr><th>Ô</th><th>Chuyện gì xảy ra ở đó</th><th>Bằng chứng nằm ở đâu</th><th>Chương</th></tr></thead>
<tbody>
<tr><td>Sự kiện</td><td>push, pull_request, schedule, workflow_dispatch… quyết định CÓ run hay không</td><td>danh sách run — run không bao giờ xuất hiện là triệu chứng duy nhất</td><td>1</td></tr>
<tr><td>Bộ lọc + <code>if:</code></td><td><code>branches</code>/<code>paths</code> và biểu thức mức job được tính trên GitHub, trước khi có máy nào</td><td>job "skipped", ô kiểm đứng mãi ở "Expected"</td><td>1, 3</td></tr>
<tr><td>Job xin máy</td><td><code>runs-on</code>, <code>needs</code>, nở ma trận; mỗi job nhận một runner (máy chạy) MỚI tinh</td><td>thời gian xếp hàng, đồ thị job</td><td>2</td></tr>
<tr><td>Set up job</td><td>action được đổi ra SHA và tải về; quyền của token được in ra</td><td>nhóm "Set up job" — đọc nó đầu tiên khi CI "tự đổi tính"</td><td>4, 6</td></tr>
<tr><td>Các bước chạy</td><td>mỗi bước là một tiến trình shell mới; mã thoát 0 = xanh; cache và artifact di chuyển tệp</td><td>log bước, các bước <code>Post</code>, dòng cache</td><td>2, 5</td></tr>
<tr><td>Bí mật + token</td><td>che trong log, phạm vi <code>GITHUB_TOKEN</code>, token OIDC</td><td><code>***</code> trong log, lỗi 403</td><td>6</td></tr>
<tr><td>Log + annotation</td><td>cú hỏng được tóm ở cuối trang run, kèm mã thoát</td><td>annotation, <code>gh run view --log-failed</code></td><td>8</td></tr>
<tr><td>Deploy + kiểm</td><td>một đường deploy, một khoá, một phép kiểm sức khoẻ, một rollback (quay lui)</td><td>API deployments, output smoke-test, production THẬT đang chạy gì</td><td>9, 10</td></tr>
</tbody></table>
<p>Chương 7 không phải một ô: nó là một lăng kính phủ lên tất cả — đường tới hạn (critical path: chuỗi job quyết định bạn phải chờ bao lâu), nhóm concurrency, độ dao động giữa các lần chạy giống hệt nhau, và giá theo phút.</p>

<h3>Kỹ năng → chương: muốn làm việc gì thì ôn chương nào</h3>
<p>Người phỏng vấn không hỏi "Chương 5 có gì". Họ hỏi "CI của bọn anh mất mười hai phút, em sẽ làm gì?". Bảng này lật ngược khoá học: bắt đầu từ kỹ năng, tìm ra chương, rồi kiểm xem bạn có <em>bằng chứng</em> chưa — một con số bạn đã đo hoặc một run bạn đã đọc — chứ không chỉ thuộc định nghĩa.</p>
${slide('ga-11', 4, 'Muốn làm được việc này thì ôn chương nào')}
<table>
<thead><tr><th>Kỹ năng một đội kỳ vọng</th><th>Chương</th><th>Bằng chứng bạn đã có</th></tr></thead>
<tbody>
<tr><td>Cho workflow chạy đúng sự kiện, đúng nhánh, đúng tệp</td><td>1</td><td>bộ lọc đo trên sân tập; trên api-backend <code>src/*</code> khớp 1 tệp còn <code>src/**</code> khớp 353</td></tr>
<tr><td>Chia việc thành job, truyền dữ liệu giữa job, chạy ma trận</td><td>2</td><td>output đi bốn chặng; <code>2×3 − 1 + 1 = 6</code> job; 8 job dùng 6 runner khác nhau</td></tr>
<tr><td>Viết điều kiện không luôn-đúng mà cũng không chết im</td><td>3</td><td>chỉ năm giá trị là sai; chữ ngoài <code>&#36;{{ }}</code> làm điều kiện luôn đúng</td></tr>
<tr><td>Dùng action bên thứ ba an toàn</td><td>4</td><td>ghim SHA đủ 40 ký tự; vụ dời thẻ tj-actions/changed-files 03/2025</td></tr>
<tr><td>Làm CI nhanh hơn và biết khi nào cache LỖ</td><td>5, 7</td><td>cache node_modules −79% (17,5 s → 3,6 s); hoà vốn khi trúng ~26%; đường tới hạn</td></tr>
<tr><td>Giữ bí mật, quyền tối thiểu, không lưu khoá cloud</td><td>6</td><td>khối <code>permissions:</code>, token OIDC có <code>exp − iat = 300</code> giây</td></tr>
<tr><td>Đọc run đỏ và tách flake (test chập chờn) khỏi hỏng thật</td><td>8</td><td>thứ tự đọc bốn bậc; flake 20% qua bốn lần chạy lại 41% số lần</td></tr>
<tr><td>Deploy có cổng, có khoá, có rollback</td><td>9</td><td>rollback trên sân tập sập 12,6 s; environment duyệt / từ chối / luật nhánh</td></tr>
<tr><td>Chẩn đoán sự cố production bằng một phép đo rẻ</td><td>10</td><td><code>curl</code> không xác thực: 401/200 = có route, 404 = bản dựng cũ</td></tr>
</tbody></table>
<div class="callout"><p><strong>Cách dùng bảng này.</strong> Che cột bên phải lại và thử nói thành tiếng phần bằng chứng. Nếu bạn chỉ nói được định nghĩa ("cache lưu tệp giữa các lần chạy"), quay lại 📌 tóm tắt và bài kiểm tra của chương đó. Nếu bạn nói được con số và ý nghĩa của nó, đi tiếp.</p></div>


<h3>Cột 1 — luôn đúng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">một workflow chỉ là cái YAML của nó nói</span><span class="lz-lnote">Ch 1 — file là toàn bộ hợp đồng; nếu hành vi trên push khác với file, file thắng và một cái gì khác hỏng (runner, trigger, một cú override)</span></div>
<div class="lz-layer"><span class="lz-lname">một action ghim vào tham chiếu di động là một bề mặt chuỗi cung ứng bạn không sở hữu</span><span class="lz-lnote">Ch 4, Ch 6 — <code>@main</code> và <code>@v3</code> đều di động; chỉ ghim theo SHA đầy đủ mới không thể bị viết lại âm thầm</span></div>
<div class="lz-layer"><span class="lz-lname">một bí mật trong <code>echo</code> là một bí mật trong log</span><span class="lz-lnote">Ch 6 — mask là bộ lọc hiển thị, không phải bảo đảm dữ liệu; bất cứ gì phái sinh từ bí mật KHÔNG được ra stdout</span></div>
<div class="lz-layer"><span class="lz-lname">một phép kiểm chưa từng đỏ KHÔNG phải phép kiểm</span><span class="lz-lnote">Ch 8, Ch 10 — xác thực phép kiểm trước khi tin; làm hỏng cái nó kiểm và xác nhận nó chuyển đỏ</span></div>
<div class="lz-layer"><span class="lz-lname">deploy KHÔNG phải hệ quả phụ của push</span><span class="lz-lnote">Ch 9 — hai sự cố tháng 7/2026 ở đây khởi từ hai workflow đua trên <code>push:</code>; dispatch-only gỡ nguyên cả lớp</span></div>
</div>

<h3>Cột 2 — chỉ đúng khi bạn đã đo</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">cache hit tiết kiệm thời gian</span><span class="lz-lnote">Ch 5 — đôi khi đúng. Trong kho này <code>node_modules/.cache</code> chưa bao giờ tồn tại, nên bước "cache tsc incremental" chạy trên một path chưa-bao-giờ-được-tạo. Đo trước khi tin</span></div>
<div class="lz-layer"><span class="lz-lname">matrix job nhanh hơn</span><span class="lz-lnote">Ch 7 — với việc song song hoàn hảo, đúng. Với việc có nút thắt chung (registry npm, upload cache layer docker) chúng có thể CHẬM HƠN VÀ đắt hơn. Đo wall-clock, không CPU-time</span></div>
<div class="lz-layer"><span class="lz-lname">một test flake là nhiễu hạ tầng</span><span class="lz-lnote">Ch 8 — đôi khi đúng, thường xuyên hơn thì test có một cuộc đua mà harness bộc lộ chập chờn. Một lần chạy lại xanh tự nó không chứng minh gì — Re-run dùng lại CÙNG commit, và một flake 20% qua bốn lần chạy lại liên tiếp 41% số lần (8.2). Chạy nhiều lần và đếm; cú hỏng lặp lại mới là thật</span></div>
<div class="lz-layer"><span class="lz-lname">action này AN TOÀN vì nó có sao</span><span class="lz-lnote">Ch 4, Ch 6 — danh tiếng là một xác suất tiên nghiệm, không phải bằng chứng. Đọc mã nguồn, hoặc ghim theo SHA đã review</span></div>
</div>

<h3>Cột 3 — thoải mái tin và LUÔN sai</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>|| true</code> làm bước "an toàn"</span><span class="lz-lnote">Ch 6, Ch 10 — nó nuốt tín hiệu bạn CẦN. Một bước mà cú hỏng VÔ HÌNH thì TỆ HƠN không có bước</span></div>
<div class="lz-layer"><span class="lz-lname">mã thoát 0 nghĩa là thành công</span><span class="lz-lnote">Ch 6, Ch 10 — pkill trả 0 với tiến trình sai để lại sống; grep -c đếm dòng không đếm khớp; một <code>set -e</code> qua pipe mất mã thoát. Mã thoát cần một kiểm HẬU-ĐIỀU-KIỆN</span></div>
<div class="lz-layer"><span class="lz-lname">build xanh nghĩa là ảnh chạy được</span><span class="lz-lnote">Ch 9 — 18/08/2026: build xanh, ảnh hỏng, bảy phút 502. Thêm phép kiểm libc-đối-lập-engine TRƯỚC push</span></div>
<div class="lz-layer"><span class="lz-lname">một migration hỏng vá được bằng một lệnh</span><span class="lz-lnote">Ch 10 — <code>--rolled-back</code> và <code>--applied</code> đều SAI ở trạng thái giữa. Cú vá là sáu-bước, không phải một cờ</span></div>
</div>

<h3>Hai luật vận hành trên các cột</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">A</span><span class="lz-t">đo trước khi tin</span><span class="lz-d">Cột 2 tồn tại vì hầu hết tối ưu "hiển nhiên" đều SAI trên <em>chính kho cụ thể này</em>. Số đo thường là một lệnh; niềm tin không có nó tốn hàng giờ hoặc một cú deploy hỏng.</span></div>
<div class="lz-step"><span class="lz-k">B</span><span class="lz-t">cú tự-vá khớp với lỗi thường SAI</span><span class="lz-d">Cột 3 có cùng hình dạng ở mọi nơi: công cụ in ra một giải pháp, và giải pháp giả định công cụ đã hiểu vấn đề. Nó KHÔNG. Đọc lỗi, liệt kê cái đã chạy, đề nghị cú vá, xin duyệt. CHẬM thắng HỎNG-ÂM-THẦM.</span></div>
</div>

<h3>Các lớp hỏng chương này đã liệt kê</h3>
<p>Chương 10 có ngày cho sáu sự cố thật. Mỗi cái gói vào một lớp bạn có thể nhận ra trên một kho mới:</p>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">tài sản cũ</span><span class="lz-nsub">10.1</span></span>
<span class="lz-nbody">mã bạn thấy KHÔNG phải mã đã chạy. 404 với file trên đĩa, hash gói sai được CDN cache, một tag ảnh đã bị dùng lại. Chẩn đoán bằng một cú <code>curl</code> không xác thực.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">lỗ hổng checklist</span><span class="lz-nsub">10.2</span></span>
<span class="lz-nbody">checklist đã chạy cái nó được CẤU HÌNH để chạy. Cú hỏng xảy ra ở cái nó LOẠI TRỪ. Mở rộng checklist đối chiếu với cái CỤ THỂ đã vỡ.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">phép kiểm không nổ được</span><span class="lz-nsub">10.3</span></span>
<span class="lz-nbody">một bước LUÔN qua không phải một phép kiểm. Làm hỏng cái nó kiểm và xem bước chuyển đỏ; nếu không, bước là đồ trang trí.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">tín hiệu theo-tên trong tiến trình đổi-tên</span><span class="lz-nsub">10.4</span></span>
<span class="lz-nbody">công cụ khớp bằng một tên đích có thể ghi đè. Khớp bằng một BẤT BIẾN thay vì — cổng cho daemon, tên container cho service, PID cho tiến trình được theo dõi.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">lỗi TRẠNG THÁI bị nhầm là lỗi LỆNH</span><span class="lz-nsub">10.5</span></span>
<span class="lz-nbody">một cú hỏng migration là câu hỏi về TRẠNG THÁI database, không phải về cờ nào truyền. Đo bằng <code>migrate diff</code> trước khi chọn hành động resolve.</span>
</div>
</div>

<h3>Cần làm gì trên một kho MỚI</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">đọc file workflow trước</span><span class="lz-lnote">không phải README. File workflow là sự thật gốc cho cái CI THẬT SỰ làm. Grep <code>secrets.</code>, <code>uses:</code>, <code>run: |</code> — bề mặt cụ thể</span></div>
<div class="lz-layer"><span class="lz-lname">đếm action ghim-SHA đối lập ghim-nhánh</span><span class="lz-lnote">tỉ lệ nói cho bạn biết bao nhiêu chuỗi cung ứng của build đã được review. Tỉ lệ thấp là chuyện thường, không phải ngoại lệ: chính api-backend có 0 chỗ ghim SHA trên 24 dòng <code>uses:</code> ngày 24/09/2026 — và chính vì thế con số này đáng đo</span></div>
<div class="lz-layer"><span class="lz-lname">grep <code>|| true</code>, <code>continue-on-error</code>, <code>|| sleep</code></span><span class="lz-lnote">đây là hình dạng của các cú qua hỏng-âm-thầm. Mỗi cái là một nơi phép kiểm có thể không nổ</span></div>
<div class="lz-layer"><span class="lz-lname">xem năm cú chạy hỏng gần nhất</span><span class="lz-lnote"><code>gh run list --status failure --limit 5</code>. Chúng cùng một cú hỏng? Thế thì có cái gì đang bị bỏ qua. Chúng khác nhau? Thế thì mọi người đang push mã vỡ và dọn dẹp sau — đo tần suất</span></div>
<div class="lz-layer"><span class="lz-lname">đo tỉ lệ cache hit của một build</span><span class="lz-lnote">bật debug logging (<code>ACTIONS_STEP_DEBUG=true</code>) trên một cuộc chạy. Đọc các dòng cache-miss THẬT. Tin những cái ấy, không phải ý định của yaml</span></div>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Cuốn này KHÔNG phải một tập luật để học thuộc — nó là một THÓI QUEN: mỗi khi một bước CI làm bạn ngạc nhiên, hỏi xem bước ấy ĐO cái gì, quyết định xem nó có ĐO cái bạn nghĩ không, và nếu không, sửa PHÉP ĐO trước khi sửa mã.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — xem cuốn này là XONG.</strong> Mỗi kho có sổ sự cố của riêng nó, và mỗi sự cố thêm một lớp mà catalog này KHÔNG bao phủ. Cách đúng để dùng chương này là như MỘT KHỞI ĐẦU — lần thứ hai bạn chẩn đoán một cú hỏng mới, hãy thêm nó vào ghi chú kiểu <code>CLAUDE.md</code> của chính bạn, với một ngày và một số đo.</p>
</div>


<h3>Mười chương, mỗi chương một trang</h3>
<p>Ba cột ở trên là <em>thói quen</em>. Phần này là <em>nội dung</em>: với mỗi chương, vài sự thật đáng nhớ tới năm sau, cái bẫy bắt nhiều người nhất, và một run thật bạn mở ra xem được. Mọi con số ở đây đều đã được đo trong chương tương ứng — trên chính kho này hoặc trên sân tập công khai <a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a> — nên con số nào làm bạn bất ngờ thì chương đó chỉ cho bạn cách nó được đo.</p>

<h3>Chương 1 — tệp workflow, và những cái bẫy tới từ YAML</h3>
${slide('ga-11', 5, 'Ch 1 — YAML đọc khác bạn nghĩ; trigger là một chính sách')}
<ul>
<li>Một workflow trả lời bốn câu: KHI NÀO (<code>on:</code>), LÀM GÌ (<code>jobs:</code>), Ở ĐÂU (<code>runs-on:</code>), THẾ NÀO (<code>steps:</code> với <code>uses:</code> hoặc <code>run:</code>).</li>
<li>YAML (định dạng tệp) đọc khác mắt bạn: <code>18.20</code> không nháy thành số <code>18.2</code> và cài Node 18.2.0 mà không lỗi gì; <code>run: &gt;</code> gập hai dòng thành MỘT lệnh nên lệnh thứ hai biến mất âm thầm (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35986150275" target="_blank" rel="noopener">run 35986150275</a>, job <code>gap-dong</code>). Đặt nháy mọi phiên bản, dùng <code>|</code> cho script nhiều dòng.</li>
<li>Bộ kích hoạt (trigger) là một <strong>chính sách</strong>: "chạy khi push" nghĩa là "ai push được thì khởi động được" — kể cả deploy. <code>types:</code> <em>thay thế</em> danh sách mặc định (với <code>pull_request</code>: opened, synchronize, reopened).</li>
<li><code>pull_request</code> chạy trên một merge commit do GitHub dựng (<code>refs/pull/N/merge</code>), không phải nhánh của bạn — hai nhánh xanh vẫn có thể ra một PR đỏ.</li>
<li><code>schedule</code> nghĩa là "không sớm hơn": 14 Chủ nhật thật, 0 lần đúng giờ, trễ từ 41 phút tới 5,8 giờ.</li>
<li>Bộ lọc: <code>*</code> dừng ở <code>/</code>; đừng bao giờ lọc một ô kiểm <em>bắt buộc</em> ở trigger — workflow bị bỏ qua không bao giờ báo cáo và PR chờ mãi ở "Expected".</li>
</ul>

<h3>Chương 2 — job, runner, và những cỗ máy ngồi chờ</h3>
${slide('ga-11', 6, 'Ch 2 — Mỗi job là một cỗ máy mới; needs: là thứ tự duy nhất')}
<ul>
<li>Mỗi job nhận một máy mới: 8 job dùng 6 runner ID (2 job bị bỏ qua không xin máy). Không gì tự đi qua ranh giới job — không tệp, không <code>node_modules</code>, không biến môi trường.</li>
<li><code>needs:</code> là công cụ sắp thứ tự duy nhất. Một giá trị đi bốn chặng: <code>$GITHUB_OUTPUT</code> → bước có <code>id</code> → <code>outputs:</code> của job → <code>needs.&lt;job&gt;.outputs</code>. Gõ sai tên thì ra chuỗi rỗng, không ra lỗi.</li>
<li>Cha hỏng thì con SKIP (bị bỏ qua), và skip lan truyền. Mọi <code>if:</code> không có hàm trạng thái đều ngầm là <code>success() &amp;&amp; …</code>.</li>
<li>Shell mặc định trên Linux/macOS là <code>bash -e {0}</code> — <strong>không có</strong> <code>pipefail</code>; <code>shell: bash</code> thêm nó vào. Trên Windows mặc định là <code>pwsh</code>, nơi một lệnh ngoài hỏng ở giữa script không làm bước đỏ. Bảng điều kiện của các bước đã chạy thật ở <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/35989945632" target="_blank" rel="noopener">run 35989945632</a>.</li>
<li>Ma trận: tích chéo → <code>exclude</code> → <code>include</code>. <code>fail-fast</code> mặc định true và huỷ các nhánh khác, khiến chúng kết thúc không có kết quả.</li>
<li>Gõ sai nhãn <code>runs-on</code> không báo lỗi — job xếp hàng mãi. actionlint bắt được trước khi bạn push.</li>
</ul>

<h3>Chương 3 — biểu thức, context, và lúc nào thứ gì tồn tại</h3>
${slide('ga-11', 7, 'Ch 3 — Biểu thức được thay thành chữ TRƯỚC khi shell tồn tại')}
<ul>
<li><code>&#36;{{ }}</code> được thay thành chữ <em>trước</em> khi shell tồn tại; shell chỉ thấy script đã hoàn chỉnh. Vì thế giá trị không tin được (tiêu đề PR, tên nhánh) phải đi qua <code>env:</code> và đọc bằng <code>"$VAR"</code>.</li>
<li>Chỉ năm giá trị là sai: <code>false</code>, <code>0</code>, <code>-0</code>, <code>''</code>, <code>null</code>. Chuỗi <code>'false'</code>, <code>'0'</code> và mảng rỗng đều <em>đúng</em>.</li>
<li>Chữ nằm ngoài cặp ngoặc biến cả điều kiện thành một chuỗi khác rỗng — luôn đúng. <code>github.event.inputs.x</code> là chuỗi; <code>inputs.x</code> giữ nguyên boolean.</li>
<li>Context gõ sai hoặc không dùng được ở chỗ đó tính ra chuỗi rỗng, không bao giờ ra lỗi — đúng hình dạng của con bug sống sót qua review.</li>
<li><code>hashFiles()</code> trả chuỗi rỗng khi không khớp gì, nên khoá cache kết thúc bằng dấu gạch nghĩa là glob trượt (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000179987" target="_blank" rel="noopener">run 36000179987</a> cho ra <code>cache-Linux-</code>).</li>
<li>Sau một cú hỏng, <code>failure()</code>, <code>always()</code> và <code>!cancelled()</code> chạy; sau một cú huỷ, chỉ <code>always()</code> và <code>cancelled()</code>.</li>
</ul>

<h3>Chương 4 — action, và chuyện chạy mã của người khác</h3>
${slide('ga-11', 8, 'Ch 4 — @v4 là một con trỏ; chỉ SHA 40 ký tự là đứng yên')}
<ul>
<li>Một dòng <code>uses:</code> được đổi ra một commit SHA và tải về trong "Set up job", trước bước 1. Một action với tới được workspace, mạng và <code>$GITHUB_ENV</code> của bạn.</li>
<li><code>@v4</code> là một con trỏ: mười lăm bản phát hành của checkout đã lần lượt nằm dưới nó. Tháng 3/2025 các thẻ của tj-actions/changed-files bị dời sang một commit độc; workflow ghim thẻ in secret ra log công khai, workflow ghim SHA thì không.</li>
<li>Ghim bằng SHA đủ 40 ký tự kèm chú thích <code># vX.Y.Z</code>, và để Dependabot (<code>package-ecosystem: github-actions</code>) dời các chỗ ghim, không thì chúng già thành phụ thuộc chưa vá. Đo trên api-backend ngày 24/09/2026: 24 dòng <code>uses:</code>, 0 chỗ ghim SHA.</li>
<li><code>actions/checkout</code> lấy độ sâu 1: không có <code>origin/main</code>, không có thẻ — <code>git diff origin/main...HEAD</code> hỏng với "ambiguous argument". <code>persist-credentials: false</code> gỡ token đã lưu.</li>
<li>Action cục bộ (<code>uses: ./.github/actions/x</code>) được đọc từ đĩa, nên nó chỉ tồn tại sau checkout (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36000264372" target="_blank" rel="noopener">run 36000264372</a>).</li>
</ul>

<h3>Chương 5 — cache và artifact, đo thật</h3>
${slide('ga-11', 9, 'Ch 5 — Cache là tối ưu có thể biến mất; artifact là bàn giao')}
<ul>
<li>Trên runner của GitHub, <code>cache: npm</code> cắt bước cài từ 17,5 s xuống 13,7 s (−22%); cache <code>node_modules</code> và bỏ <code>npm ci</code> khi trúng cắt xuống 3,6 s (−79%). Lần chạy đầu với bất kỳ cache nào cũng chậm hơn: nó làm đủ việc rồi còn lưu.</li>
<li>Một mục cache ghi một lần cho mỗi khoá; khoá hằng đông cứng ở lần chạy đầu; khoá chứa <code>github.sha</code> trượt và lưu ở mọi lần.</li>
<li>Khoá còn được khớp như tiền tố: <code>restore-keys</code> có thể khôi phục tệp trong khi <code>cache-hit</code> báo false (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36005610825" target="_blank" rel="noopener">run 36005610825</a>). Hãy kết thúc khoá bằng một hash.</li>
<li>Cache chết in một cảnh báo vàng trong một job xanh; cache <em>rỗng</em> còn tệ hơn — không cảnh báo, lần nào cũng "trúng", chỉ <code>Cache Size: ~0 MB</code> tố cáo nó.</li>
<li>Artifact (sản phẩm dựng) = bàn giao có bảo đảm (mặc định 90 ngày); cache = phép tối ưu có thể biến mất (7 ngày không dùng, mặc định 10 GB mỗi kho). Tải lên cùng tên hai lần thì hỏng với 409; zip làm mất bit thực thi.</li>
<li>Hoà vốn: cache node_modules có lãi khi hơn khoảng 26% số lần chạy trúng.</li>
</ul>

<h3>Chương 6 — bí mật, quyền, và cái token</h3>
${slide('ga-11', 10, 'Ch 6 — Che bí mật chỉ phủ ĐÚNG chuỗi đã lưu, trong LOG')}
<ul>
<li>Che bí mật thay đúng các chuỗi đã đăng ký <strong>trong log</strong>. Đo bằng giá trị giả: giá trị, base64 trơn của nó và từng dòng của secret nhiều dòng bị che; bản viết hoa, phép thay ký tự, tiền tố, một trường JSON, tệp, artifact và request mạng thì không.</li>
<li>Nếu secret bị lộ: <strong>xoay khoá trước</strong>, xoá log sau.</li>
<li><code>GITHUB_TOKEN</code> được đúc riêng cho mỗi job, cho một kho, và chết cùng job. Nêu một quyền là mọi quyền còn lại về <code>none</code>; khối mức job <em>thay thế</em> khối mức workflow.</li>
<li>OIDC thay một khoá cloud đã lưu bằng một token đã ký sống năm phút (<code>exp − iat = 300</code>); job cần <code>id-token: write</code>, và phần bảo mật thật nằm ở trust policy phía cloud khớp <code>sub</code>.</li>
<li>Một script soát cả kho, cộng actionlint và zizmor, đã chạy trên Linux và macOS ở <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36007044889" target="_blank" rel="noopener">run 36007044889</a>. zizmor tìm ra bốn chỗ template injection trên api-backend mà grep bỏ sót.</li>
</ul>

<h3>Chương 7 — tốc độ, concurrency, và cái giá của nó</h3>
${slide('ga-11', 11, 'Ch 7 — Chỉ job trên đường tới hạn làm run nhanh hơn')}
<ul>
<li>Một run có ba con số: máy-giây (tiền), thời gian đồng hồ (chờ) và đường tới hạn (cái sàn của thời gian đồng hồ). Chỉ job trên đường tới hạn mới đổi được thời gian bạn chờ: giảm nửa bản dựng Linux của api-backend tiết kiệm 0 s vì nó có 199 s độ chùng.</li>
<li>Gỡ một cạnh <code>needs:</code> không phải phụ thuộc dữ liệu thật là thay đổi tốt nhất đã đo: trung vị 124 s → 95 s trên sân tập, cùng số máy-giây.</li>
<li>Concurrency, ba cú push: <code>cancel-in-progress: true</code> xong commit cuối ở +154 s; <code>false</code> ở +183 s và bỏ ÂM THẦM commit 2; <code>queue: max</code> ở +274 s và chạy đủ mọi commit. Huỷ giết một bước ở giữa chừng (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36009923442" target="_blank" rel="noopener">run 36009923442</a>) — đừng bao giờ dùng nó cho deploy.</li>
<li>Cùng một commit mất 37–77 s qua 14 lần chạy (2,08×). So trung vị, theo cặp.</li>
<li>Giá (09/2026, kho riêng tư): Linux $0,006, Windows $0,010, macOS $0,062 mỗi phút, mỗi job làm tròn lên phút nguyên. Kho công khai trên runner tiêu chuẩn thì miễn phí.</li>
</ul>

<h3>Chương 8 — khi CI đỏ</h3>
${slide('ga-11', 12, 'Ch 8 — Đọc mã thoát trước, đọc log sau')}
<ul>
<li>Đọc annotation ở cuối trang run trước tiên: nó đã in mã thoát của từng job hỏng. 1 là phán quyết của công cụ; 2, 126 và 127 nghĩa là shell không chạy nổi chương trình; 134 là V8 bỏ cuộc ồn ào vì hết heap; 137 là nhân (kernel) giết trong im lặng (hết bộ nhớ). Cách vá 134 và 137 ngược nhau.</li>
<li>Thứ tự đọc: annotation → job đỏ đầu tiên (job xám là hệ quả của <code>needs:</code>) → bước đỏ → dòng lỗi thật phía trên <code>##[error]</code>.</li>
<li>"Nó hỏng, tôi chạy lại, nó qua" không chứng minh gì: một bài test hỏng 20% số lần qua bốn lần chạy lại liên tiếp với xác suất 0,8⁴ ≈ 41% (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36011087956" target="_blank" rel="noopener">run 36011087956</a>). Re-run dùng CÙNG commit. Hãy chạy nhiều lần và đếm.</li>
<li>Tái lập ở máy trước khi push các commit "debug": <code>docker run</code> với ảnh đang hỏng, hoặc <code>act</code> — nhưng <code>act</code> không phải ảnh, hệ điều hành hay dịch vụ của GitHub.</li>
<li>Một bản vá được kiểm chứng như một cặp: đỏ khi không có bản vá, xanh khi có, dưới cùng điều kiện.</li>
</ul>

<h3>Chương 9 — deploy từ CI, và vì sao kho này đã thôi</h3>
${slide('ga-11', 13, 'Ch 9 — Deploy an toàn cần một đường, một khoá, và rollback')}
<ul>
<li>Trước 06/07/2026, một cú push lên <code>main</code> ở đây khởi động bốn workflow, ba cái chạm VPS, vì hai bộ lọc <code>paths:</code> giao nhau. Ngày 06/07 ba lần chạy cùng sửa các container trong vòng 74 giây.</li>
<li>Một nhóm concurrency chung xoá sự chồng chéo nhưng không làm cho đúng: một nhóm chỉ giữ một run đang chờ, nên run mang migration bị thay khi đang chờ.</li>
<li>Push-để-deploy an toàn cần một đường deploy, deploy bất biến (idempotent — chạy lại không gây hại) và rollback nằm trên đường deploy. Kho này chọn một script do người chạy (<code>bash deploy-nha.sh</code>, và nó tự push lên GitHub ở cuối) cho tới khi có đủ những thứ đó; 12 trên 14 workflow chỉ chạy tay.</li>
<li>Rollback trên sân tập: một ảnh hỏng, năm lần kiểm sức khoẻ, tự rollback — sập 12,6 s, trong đó 2,2 s là chính cuộc rollback, và job vẫn ĐỎ (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36017616624" target="_blank" rel="noopener">run 36017616624</a>).</li>
<li>"Bản trước" là thứ production đang chạy, không phải <code>HEAD^</code>; sau một lần rollback, <code>HEAD^</code> chính là bản hỏng.</li>
<li><code>environment:</code> biến một job thành cuộc deploy có cổng: duyệt, từ chối kèm lời bình, chặn một nhánh — tất cả đã đo.</li>
</ul>

<h3>Chương 10 — chẩn đoán bằng ca thật</h3>
${slide('ga-11', 14, 'Ch 10 — Chẩn đoán bằng một phép đo rẻ trước khi sửa')}
<ul>
<li><code>curl</code> không xác thực: 401 và 200 nghĩa là "route này có trong bản dựng đang chạy"; 404 nghĩa là không có — bản dựng cũ. Health check chỉ hỏi một route, nên ảnh cũ vẫn qua nó.</li>
<li>Checklist xanh chỉ là bằng chứng cho những tệp nó đã mở: <code>tsc --noEmit</code> mở 0 tệp trong <code>prisma/</code>, nên một seed hỏng qua sạch và vỡ trên production.</li>
<li>Bộ kiểm không thể đỏ chỉ là đồ trang trí: chốt <code>wget</code> chạy bảy tuần bên trong một container không hề có <code>wget</code>. Làm hỏng đích có chủ đích và xem bộ kiểm đỏ.</li>
<li>Next.js đổi tên tiến trình thành <code>next-server</code>, nên <code>pkill -f "next start"</code> không giết gì. Diệt theo cổng, rồi xác nhận bằng công cụ thứ hai.</li>
<li>Migration hỏng là câu hỏi về <em>trạng thái</em> của cơ sở dữ liệu. Đo bằng <code>prisma migrate diff</code> trước khi chọn gì; không bao giờ tự resolve.</li>
</ul>

<h3>Một workflow CI gom cả nửa khoá đầu</h3>
<p>Nếu người phỏng vấn bảo bạn "viết lên bảng một workflow CI cho dự án Node", đây là câu trả lời — và dòng nào cũng có một lý do bạn dẫn được từ một chương. Đọc các chú thích như là lý do.</p>
${slide('ga-11', 15, 'Một workflow CI mẫu gom cả nửa khoá, từng dòng một chương')}
<pre><code class="language-yaml">name: ci
on:
  pull_request:                       # Ch1: chạy trên merge commit
  push:
    branches: [main]                  # Ch1/Ch9: chỉ CI — không deploy ở đây
permissions:
  contents: read                      # Ch6: quyền tối thiểu cho GITHUB_TOKEN
concurrency:
  group: ci-&#36;{{ github.ref }}         # Ch7: mỗi nhánh / PR một run
  cancel-in-progress: true            # ổn cho CI, không bao giờ cho deploy
jobs:
  test:
    runs-on: ubuntu-24.04             # Ch2: ghim ảnh, không -latest
    timeout-minutes: 15               # Ch2: job treo thì chết sớm
    defaults:
      run:
        shell: bash                   # Ch2/Ch8: thêm pipefail
    steps:
      - uses: actions/checkout@&lt;sha-40-ky-tu&gt;   # v4 — Ch4: ghim
        with:
          persist-credentials: false  # Ch4/Ch6
      - uses: actions/setup-node@&lt;sha-40-ky-tu&gt; # v4
        with:
          node-version-file: .nvmrc   # Ch4: cùng Node với máy dev
          cache: npm                  # Ch5: khoá tính từ lockfile
      - run: npm ci
      - run: npm test                 # Ch8: mã thoát là phán quyết</code></pre>
<p>Thứ cố ý <em>không</em> có mặt cũng quan trọng không kém: không <code>secrets.*</code> (CI của một pull request không nên cần cái nào), không <code>pull_request_target</code>, không <code>continue-on-error</code>, không <code>|| true</code>, không bước deploy. Thay <code>&lt;sha-40-ky-tu&gt;</code> bằng SHA commit thật của bản phát hành bạn đã xem qua.</p>

<h3>10 lỗi hay gặp nhất của nửa khoá đầu</h3>
<p>Gom từ các ô "Bẫy" của Chương 1–10 — những cái xuất hiện ở hơn một chương, hoặc đã gây sự cố thật ở kho này. Với mỗi lỗi: triệu chứng bạn sẽ thấy, và cách vá.</p>
${slide('ga-11', 16, '10 lỗi hay gặp nhất của nửa khoá (1–5)')}
${slide('ga-11', 17, '10 lỗi hay gặp nhất của nửa khoá (6–10)')}
<table>
<thead><tr><th>#</th><th>Lỗi</th><th>Bạn thấy gì</th><th>Cách vá</th><th>Ch</th></tr></thead>
<tbody>
<tr><td>1</td><td>Tin YAML theo cách mắt đọc</td><td>cài Node 18.2.0; lệnh thứ hai của <code>run: &gt;</code> không bao giờ chạy</td><td>đặt nháy mọi phiên bản; dùng <code>|</code>; chạy actionlint</td><td>1</td></tr>
<tr><td>2</td><td>Lọc một ô kiểm bắt buộc ở trigger</td><td>PR kẹt ở "Expected — Waiting for status to be reported"</td><td>luôn khởi động workflow; bỏ qua ở TRONG job</td><td>1, 3</td></tr>
<tr><td>3</td><td>Mong thứ gì đó tự sang job sau</td><td>"file not found", biến rỗng ở job 2</td><td>outputs cho giá trị nhỏ, artifact cho tệp</td><td>2</td></tr>
<tr><td>4</td><td>Điều kiện luôn đúng hoặc rỗng âm thầm</td><td>bước chạy khi không nên; một giá trị trống trơn</td><td>cả điều kiện nằm trong <code>&#36;{{ }}</code>; so <code>== 'true'</code> hoặc dùng boolean thật</td><td>3</td></tr>
<tr><td>5</td><td>Ghim action theo thẻ hoặc nhánh</td><td>không gì cả — cho tới khi một thẻ bị dời</td><td>SHA 40 ký tự + Dependabot</td><td>4</td></tr>
<tr><td>6</td><td>Cache không ai đo</td><td>"Cache not found" mọi lần, hoặc trúng một cache ~0 MB</td><td>đọc ba run liên tiếp: bốn dòng log và kích thước</td><td>5</td></tr>
<tr><td>7</td><td>Tin rằng mặt nạ che mọi thứ</td><td>một secret đã biến đổi hiện nguyên văn trong log</td><td>không bao giờ in giá trị suy ra; lộ thì xoay khoá</td><td>6</td></tr>
<tr><td>8</td><td>Tối ưu một job không nằm trên đường tới hạn</td><td>job nhanh hơn, run thì không</td><td>tính đường tới hạn từ API jobs trước</td><td>7</td></tr>
<tr><td>9</td><td>Dùng Re-run làm phép chẩn đoán</td><td>xanh sau khi chạy lại, tuần sau đỏ lại</td><td>chạy N lần và đếm; đếm cú hỏng theo tên test</td><td>8</td></tr>
<tr><td>10</td><td>Hai đường deploy, và rollback đoán <code>HEAD^</code></td><td>container bị hai run cùng sửa; rollback về đúng bản hỏng</td><td>một đường deploy + khoá chung; hỏi production đang chạy gì</td><td>9, 10</td></tr>
</tbody></table>

<h3>Mười lỗi có chung một điểm</h3>
<p>Nhìn lại cột "Bạn thấy gì". Gần như hàng nào cú hỏng cũng <strong>im lặng</strong>: chuỗi rỗng thay vì lỗi, bước xanh thay vì đỏ, một run đơn giản là không bao giờ xuất hiện. GitHub Actions rất "rộng lượng" — nó thích chạy tiếp hơn là dừng — và chính sự rộng lượng ấy cho phép một pipeline hỏng trông khoẻ mạnh suốt nhiều tuần. Vì vậy phương pháp của cả nửa khoá là một vòng lặp:</p>
${slide('ga-11', 18, 'Mẫu chung của cả mười lỗi: một thứ HỎNG mà không ỒN')}
<ol>
<li><strong>Giả định nó có thể hỏng im lặng.</strong> Hỏi: nếu cái này hỏng, tôi sẽ thấy gì? Nếu câu trả lời là "không thấy gì", bạn đã tìm ra rủi ro.</li>
<li><strong>Đo nó một lần.</strong> Run thật, log thật, API — không phải YAML và không phải trí nhớ của bạn về docs.</li>
<li><strong>Làm hỏng nó có chủ đích.</strong> Bộ kiểm phải đỏ khi thứ nó kiểm bị hỏng. Bộ kiểm bạn chưa từng thấy đỏ thì không phải bộ kiểm.</li>
<li><strong>Biến phép đo thành một phép kiểm thường trực</strong>: actionlint và zizmor trước khi push, smoke test sau khi deploy, một bài test hỏng nếu bộ kiểm cứ xanh mãi.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Bẫy — chỉ ôn những chương thấy khó.</strong> Phần lớn mười lỗi tới từ các chương "dễ" (1, 2 và 3), vì chẳng ai đọc lại chúng. Ôn theo cảm giác chọn sai chương; ôn theo checklist bên dưới chọn đúng những chương bạn chưa chứng minh được.</div>

<h3>Checklist — "Tôi đã làm được"</h3>
<p>Chỉ đánh dấu một dòng khi bạn đã làm nó trên một kho của chính mình, có link run đưa cho người khác xem được. Đủ mười hai dấu là bạn sẵn sàng cho nửa sau.</p>
${slide('ga-11', 19, 'Tự kiểm: tôi đã làm được những việc này chưa?')}
<ul>
<li>☐ Tôi viết được workflow cho <code>pull_request</code> và <code>push</code>, bộ lọc <code>paths</code> đúng, không làm đông cứng ô kiểm bắt buộc.</li>
<li>☐ Tôi chia được việc thành ba job và truyền một số phiên bản từ job đầu tới job cuối qua outputs.</li>
<li>☐ Tôi viết được ma trận ba hệ điều hành có <code>exclude</code>/<code>include</code> và giải thích khi nào đặt <code>fail-fast: false</code>.</li>
<li>☐ Tôi viết được <code>if:</code> cho "chỉ trên main", "chỉ khi test hỏng", "kể cả khi bị huỷ", và nói được cái nào không bao giờ được dùng cho deploy.</li>
<li>☐ Tôi ghim được mọi action bằng SHA và bật Dependabot cho <code>github-actions</code>.</li>
<li>☐ Tôi chứng minh được một cache có tác dụng bằng cách đọc ba run liên tiếp.</li>
<li>☐ Tôi đặt được <code>permissions:</code> tối thiểu và đọc kết quả trong "Set up job".</li>
<li>☐ Tôi giải thích được OIDC thay khoá cloud đã lưu thế nào (<code>sub</code>, <code>aud</code>, token năm phút).</li>
<li>☐ Tôi tìm được đường tới hạn của một run từ API jobs.</li>
<li>☐ Tôi phân loại được một run đỏ theo bốn bậc trong dưới năm phút, ngay từ terminal bằng <code>gh</code>.</li>
<li>☐ Tôi viết được job deploy lưu bản đang chạy, tráo, kiểm, rollback và vẫn kết thúc đỏ.</li>
<li>☐ Tôi làm hỏng được một bộ kiểm có chủ đích và thấy nó đỏ.</li>
</ul>

<h3>Ngân hàng câu hỏi phỏng vấn — 15 câu nền tảng</h3>
<p>Đây là những câu một buổi phỏng vấn CI/CD cho vị trí junior hay thực tập thường mở đầu. Câu trả lời là dàn ý, không phải kịch bản: nói <em>cơ chế</em>, rồi một <em>con số hoặc sự cố</em> từ khoá này. Nửa sau ấy là thứ phân biệt "em có đọc về nó" với "em đã làm nó".</p>
${slide('ga-11', 20, 'Câu hỏi phỏng vấn nền tảng (1/2): trả lời bằng cơ chế + số đo')}
${slide('ga-11', 21, 'Câu hỏi phỏng vấn nền tảng (2/2): kể một sự cố thật')}
<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H1: CI, continuous delivery và continuous deployment khác nhau thế nào?</strong><br>Đ: CI kiểm mọi thay đổi một cách tự động khi nó được push hoặc đề xuất. Continuous delivery giữ mọi bản dựng xanh ở trạng thái phát hành được, con người quyết định khi nào đưa lên. Continuous deployment tự đưa mọi bản dựng xanh lên. Site của em chạy CI trên GitHub và phát hành bằng một script em tự chạy — có chủ đích, sau hai sự cố với deploy tự động.</p>
<p><strong>H2: Workflow, job, step, action là gì?</strong><br>Đ: Workflow là một tệp YAML trong <code>.github/workflows</code>; job là một nhóm bước chạy trên một máy mới; step là một tiến trình shell hoặc một action; action là mã đóng gói gọi bằng <code>uses:</code>. Các job chạy song song trừ khi <code>needs:</code> sắp thứ tự.</p>
<p><strong>H3: Hai job chia sẻ dữ liệu thế nào?</strong><br>Đ: Chúng không có đĩa chung. Giá trị nhỏ đi qua output của job (bốn chặng: <code>$GITHUB_OUTPUT</code>, id của bước, <code>outputs:</code> của job, <code>needs.x.outputs</code>); tệp đi qua artifact. Cache không phải cơ chế bàn giao — nó có thể bị dọn.</p>
<p><strong>H4: PR xanh, em merge, rồi main đỏ. Sao lại thế?</strong><br>Đ: Run của PR đã kiểm merge commit với main <em>cũ</em>. Main đi tiếp sau đó, nên tổ hợp mới chưa từng được kiểm. "Require branches to be up to date" hoặc merge queue vá chuyện này.</p>
<p><strong>H5: Vì sao ghim action bằng commit SHA?</strong><br>Đ: Thẻ và nhánh dời được; SHA đầy đủ thì không. Tháng 3/2025 các thẻ của tj-actions/changed-files bị dời sang mã độc và workflow ghim thẻ làm lộ secret ra log. Ghim mà không cập nhật thì già đi, nên đi kèm Dependabot.</p>
<p><strong>H6: <code>pull_request_target</code> nguy hiểm ở đâu?</strong><br>Đ: Nó chạy trong ngữ cảnh của kho gốc, với secret và token có quyền ghi của kho gốc. Dùng để gắn nhãn PR thì ổn; checkout rồi chạy mã của PR trong đó là trao secret cho mọi fork. Giữ mã PR dưới <code>pull_request</code>.</p>
<p><strong>H7: Cache hay artifact?</strong><br>Đ: Cache để làm run sau nhanh hơn — nó có thể vắng mặt và job vẫn phải chạy được. Artifact để bàn giao kết quả cho job khác hay cho người — nó được bảo đảm trong thời hạn lưu. Em đã đo cache node_modules: −79% khi trúng, nhưng chỉ có lãi khi tỉ lệ trúng trên ~26%.</p>
<p><strong>H8: CI của bọn anh mất mười hai phút. Em bắt đầu từ đâu?</strong><br>Đ: Đo trước khi đổi gì: tìm đường tới hạn từ API jobs. Chỉ job trên đó mới đổi được thời gian chờ. Rồi gỡ các cạnh <code>needs:</code> không thật, rồi đánh vào job chậm nhất trên đường, rồi mới thêm cache hay tách job.</p>
<p><strong>H9: Secret có an toàn trong log vì GitHub che nó không?</strong><br>Đ: Chỉ đúng chuỗi đã lưu bị che, và chỉ trong log. Base64 của nó bị che, nhưng bản viết hoa, một trường JSON, một tệp hay một artifact thì không. Nếu lộ, xoay khoá trước.</p>
<p><strong>H10: Deploy lên cloud mà không lưu khoá thế nào?</strong><br>Đ: OIDC: job có <code>id-token: write</code>, xin một token đã ký sống năm phút, và cloud đổi nó lấy thông tin đăng nhập sống ngắn nếu trust policy khớp <code>sub</code> của token — tốt nhất khớp tới tận tên environment.</p>
<p><strong>H11: Test hỏng, em chạy lại, nó qua. Có phải flaky không?</strong><br>Đ: Chưa chứng minh được. Re-run dùng cùng commit, và một flake 20% qua bốn lần chạy lại 41% số lần. Em sẽ chạy nhiều lần, đếm, và đếm cú hỏng theo tên test — mười một run đỏ trong một ngày ở kho của em hoá ra là một con bug thật.</p>
<p><strong>H12: Mã thoát 137 khác 134 thế nào?</strong><br>Đ: 137 là 128 + 9: tiến trình bị SIGKILL giết, thường do hết bộ nhớ, chương trình không kịp in gì. 134 là abort — Node/V8 chạm trần heap của chính nó và nói ra. Với 134 thì nâng trần heap; với 137 thì hạ lượng bộ nhớ dùng xuống dưới mức máy có.</p>
<p><strong>H13: Hai workflow cùng deploy lên một máy chủ. Chặn chúng đè nhau thế nào?</strong><br>Đ: Trước hết, gộp thành một đường deploy. Rồi một nhóm concurrency đặt tên theo đích, dùng chung cho mọi thứ deploy, với <code>cancel-in-progress: false</code>. Concurrency sắp thứ tự các run; nó không làm chúng bất biến.</p>
<p><strong>H14: Rollback một deploy hỏng thế nào?</strong><br>Đ: Ghi lại production đang chạy gì trước khi tráo, kiểm sức khoẻ sau, và tự tráo lại nếu kiểm hỏng — job vẫn kết thúc đỏ. "Bản trước" đọc từ production, không đoán bằng <code>HEAD^</code>. Thay đổi schema theo kiểu expand-and-contract để rollback mã vẫn làm được.</p>
<p><strong>H15: Deploy xanh mà endpoint mới trả 404. Em nhìn vào đâu?</strong><br>Đ: Một cú <code>curl</code> không xác thực: 401 hoặc 200 nghĩa là route có trong bản dựng đang chạy, 404 nghĩa là bản dựng cũ. Rồi dựng lại thật, và thêm route đó vào smoke test sau deploy, làm deploy hỏng khi gặp 404.</p>
</div>

<h3>Nửa sau của khoá: Chương 12–15</h3>
<p>Nửa đầu dạy bạn <em>đọc, sửa, bảo mật và tăng tốc</em> một pipeline đã có sẵn. Đó là phần lớn việc của một junior trong những tháng đầu. Nửa sau dạy bạn <em>dựng</em> những pipeline mà người khác phụ thuộc vào — đúng cái mức người phỏng vấn gọi là "từ cơ bản đến chuyên gia".</p>
${slide('ga-11', 23, 'Nửa sau khoá: từ "dùng được" tới "dựng cho cả đội"')}
<ul>
<li><strong>Chương 12 — Tái sử dụng ở quy mô đội.</strong> Bài 4.5 mới chạm "ba cách thôi chép". Chương 12 đi hết đường: reusable workflow (workflow dùng lại) với <code>workflow_call</code> (inputs, secrets, outputs), composite action, tự viết action JavaScript và Docker, và mẫu workflow cho cả tổ chức.</li>
<li><strong>Chương 13 — Runner của riêng bạn.</strong> Runner hoạt động thế nào, một self-hosted runner (runner tự dựng) chạy dạng container <em>dùng một lần</em> (ephemeral) cho đúng một job rồi gỡ ngay, vì sao runner tự dựng không bao giờ được phục vụ PR của kho công khai, và mở rộng bằng Actions Runner Controller.</li>
<li><strong>Chương 14 — Cổng chất lượng, bảo mật chuỗi cung ứng và phát hành.</strong> Ruleset và ô kiểm bắt buộc, Dependabot và CodeQL, tự tạo bản phát hành, artifact attestation (chứng thực nguồn gốc sản phẩm dựng), và CI cho monorepo kiểu api-backend (backend + frontend + desktop).</li>
<li><strong>Chương 15 — Dự án cuối khoá.</strong> Một pipeline CI/CD hoàn chỉnh từ số 0 cho một app đặt lịch phòng khám nhỏ: kiểm PR với Postgres chạy dạng service container, ảnh nhiều tầng đẩy lên GHCR, deploy có cổng, có khoá và rollback — rồi <strong>bài thi cuối khoá của cả khoá học</strong> (20 câu).</li>
</ul>
<div class="callout"><p><strong>Thứ tự có ý nghĩa.</strong> Chương 12 giả định Chương 4 (action) và Chương 6 (quyền); Chương 13 giả định Chương 2 (runner) và Chương 6; Chương 14 giả định Chương 4 và 6; dự án cuối khoá dùng tất cả. Nếu checklist ở trên còn hơn ba ô trống, hãy lấp chúng trước — nửa sau xây TRÊN chúng chứ không dạy lại.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> người phỏng vấn bảo "mở một kho GitHub của em ra và cho anh biết CI của nó làm gì, em sẽ sửa gì đầu tiên". Làm bản ngắn của cuộc soát ngay bây giờ, trên một kho của chính bạn có ít nhất một workflow.</p><ol>
<li>Liệt kê workflow và trigger: <code>grep -n -A6 '^on:' .github/workflows/*.yml</code>. Ghi mỗi workflow một dòng: sự kiện, <code>paths</code>, có chạm máy chủ không.</li>
<li>Đếm chỗ ghim SHA: <code>grep -h 'uses:' .github/workflows/*.yml | wc -l</code> và <code>grep -hE 'uses: .*@[0-9a-f]{40}' .github/workflows/*.yml | wc -l</code>. Ghi tỉ lệ.</li>
<li>Đếm khối quyền: <code>grep -l 'permissions:' .github/workflows/*.yml | wc -l</code>.</li>
<li>Mở run hỏng gần nhất: <code>gh run list --status failure -L 1</code>, rồi <code>gh run view &lt;id&gt; --log-failed | tail -40</code>. Ghi mã thoát và bậc đọc nào trong bốn bậc đã cho bạn biết nguyên nhân.</li>
<li>Chọn MỘT trong mười lỗi mà kho của bạn đang mắc, và viết một dòng cách vá bạn sẽ làm.</li></ol>
<p><strong>Đạt khi:</strong> bạn có một ghi chú mỗi workflow một dòng, một tỉ lệ ghim SHA (một con số, kể cả khi nó là 0), số khối quyền, một mã thoát kèm ý nghĩa, và một cách vá đã chọn — và bạn nói được tất cả thành tiếng trong dưới hai phút. Bản đầy đủ 60 phút, có một PR thật, là slide 24.</p></div>
${slide('ga-11', 24, 'Thực hành Chương 11 (60 phút): soát kho của chính bạn')}

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CI (tích hợp liên tục)</span><span class="v">Kiểm mọi thay đổi một cách tự động khi nó được push hoặc đề xuất, để mã hỏng lộ ra sau vài phút chứ không phải lúc phát hành.</span></div>
  <div class="kv"><span class="k">Continuous delivery / deployment</span><span class="v">Delivery: mọi bản dựng xanh đều phát hành được, con người quyết định khi nào. Deployment: mọi bản dựng xanh tự lên.</span></div>
  <div class="kv"><span class="k">Đường tới hạn (critical path)</span><span class="v">Chuỗi job phụ thuộc nhau dài nhất trong một run. Chỉ job trên đó mới đổi được thời gian bạn chờ.</span></div>
  <div class="kv"><span class="k">Hỏng im lặng (silent failure)</span><span class="v">Cú hỏng không sinh lỗi: chuỗi rỗng, bước xanh, run không bao giờ xuất hiện. Hình dạng chung của mười lỗi.</span></div>
  <div class="kv"><span class="k">Ghim SHA (SHA pin)</span><span class="v">Gọi action bằng mã băm commit đủ 40 ký tự, thứ không dời được như thẻ hay nhánh.</span></div>
  <div class="kv"><span class="k">Quyền tối thiểu (least privilege)</span><span class="v">Chỉ cấp cho token những quyền job cần, đặt bằng <code>permissions:</code>.</span></div>
  <div class="kv"><span class="k">Smoke test (kiểm khói)</span><span class="v">Phép kiểm nhanh sau deploy xem các route quan trọng có tồn tại và trả lời không; nó phải hỏng to khi đích hỏng.</span></div>
  <div class="kv"><span class="k">Reusable workflow (Ch 12)</span><span class="v">Workflow được workflow khác gọi bằng <code>workflow_call</code> — công cụ đầu tiên của nửa sau.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Nửa đầu dựng năm năng lực: viết, dùng lại an toàn, tăng tốc bằng số đo, giữ an toàn, sửa và đưa lên.</li>
<li>Một run đi qua tám ô — sự kiện, bộ lọc, job, set-up, các bước, bí mật, log, deploy — và mọi cuộc chẩn đoán bắt đầu bằng "ô nào?".</li>
<li>Mỗi chương để lại vài sự thật đã đo; biết con số và cách nó được đo là thứ người phỏng vấn lắng nghe.</li>
<li>Mười lỗi hay gặp nhất có chung một hình dạng: thứ gì đó hỏng mà không ồn. Đo một lần, làm hỏng có chủ đích, rồi biến phép đo thành phép kiểm thường trực.</li>
<li>Dùng checklist mười hai dòng và mười lăm câu phỏng vấn để tìm những chương bạn chưa chứng minh được, và lấp chúng trước Chương 12.</li>
<li>Nửa sau (Chương 12–15) chuyển từ dùng pipeline sang dựng pipeline cho cả đội, và kết thúc bằng dự án cuối khoá cùng bài thi cuối khoá.</li>
</ul>

<h3>Nguồn cho bước kế</h3>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — nơi CI kết thúc và vận hành bắt đầu</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — ranh giới cuốn này DỪNG lại: bạn làm gì khi artifact đã dựng và cuộc deploy đã đáp. Đọc như một cú tiếp nối Chương 9.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — tầng mà cache hit và miss của GH nói về</span><span class="lc-sub">/courses/docker/learn${REF} — cache dựng, tầng vô hiệu hoá, và cái làm một Dockerfile thân-với-cache. Chương 5 giả định bạn có các nguyên tố này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — ngữ nghĩa shell đằng sau khối run</span><span class="lc-sub">/courses/linux-bash/learn${REF} — <code>set -e</code>, mã thoát pipe, subshell, viết lại argv. Nửa số bẫy ở Chương 6 và 10 là ngữ nghĩa shell mặc quần áo YAML.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — bộ dữ liệu nguồn cho Chương 10</span><span class="lc-sub">sổ sự cố kho này duy trì, có ngày. Thói quen đáng chép: mỗi chẩn đoán trở thành một dòng có ngày và một bài học.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 11.0 ─────────────────────────── */
    {
      title: '11.0 — Chapter 11 slides: the first half of the course in pictures|||11.0 — Slide Chương 11: nửa khoá đầu bằng hình',
      slug: 'ga-11-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 24 slide ôn tập Chương 1–10: bản đồ năm năng lực, tám ô một lần chạy đi qua, bảng kỹ năng → chương, mỗi chương một trang điều cốt lõi có số đo thật, một workflow CI mẫu gom cả nửa khoá, 10 lỗi hay gặp nhất, checklist tự kiểm, 15 câu phỏng vấn nền tảng, bảng tra nhanh và lộ trình Chương 12–15.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Slides</span>
<h2>The first half of the course in 24 slides</h2>
<p class="lead">This deck is a revision sheet for Chapters 1–10. Read it once before Lesson 11.1 to see how much you still remember, and again before the mid-course check. Every picture reappears inside Lesson 11.1 next to the text that explains it.</p>
<p>Slides 2–4 are the map: five abilities, the eight boxes a run passes through, and a table from skill to chapter. Slides 5–14 give each chapter one page of core facts, all measured earlier in the course on this repository or on the public sandbox <a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>. Slide 15 is one CI workflow in which every line comes from a chapter. Slides 16–18 are the ten most common mistakes and what they share; 19 is a self-check; 20–21 are fifteen foundation interview questions; 22 is the cheat sheet; 23 is the road through Chapters 12–15; 24 is a 60-minute practice on your own repository.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Slide</span>
<h2>Nửa khoá đầu trong 24 slide</h2>
<p class="lead">Bộ slide này là một tờ ôn tập cho Chương 1–10. Lướt một lượt trước Bài 11.1 để xem mình còn nhớ bao nhiêu, và lướt lại trước bài kiểm tra giữa khoá. Hình nào cũng xuất hiện lại trong Bài 11.1, ngay cạnh đoạn giải thích nó.</p>
<p>Slide 2–4 là bản đồ: năm năng lực, tám ô một lần chạy đi qua, và bảng từ kỹ năng sang chương. Slide 5–14 cho mỗi chương một trang điều cốt lõi, tất cả đều đã đo ở các chương trước trên chính kho này hoặc trên sân tập công khai <a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>. Slide 15 là một workflow CI mà dòng nào cũng tới từ một chương. Slide 16–18 là mười lỗi hay gặp nhất và điểm chung của chúng; 19 là tự kiểm; 20–21 là mười lăm câu phỏng vấn nền tảng; 22 là bảng tra nhanh; 23 là lộ trình Chương 12–15; 24 là buổi thực hành 60 phút trên kho của chính bạn.</p>
</div>
${gallery('ga-11', [
[1, 'Bìa'],
[2, 'Nửa khoá đầu là năm năng lực, không phải mười chương rời'],
[3, 'Một lần chạy đi qua tám ô — mỗi ô là một chương'],
[4, 'Muốn làm được việc này thì ôn chương nào'],
[5, 'Ch 1 — YAML đọc khác bạn nghĩ; trigger là một chính sách'],
[6, 'Ch 2 — Mỗi job là một cỗ máy mới; needs: là thứ tự duy nhất'],
[7, 'Ch 3 — Biểu thức được thay thành chữ TRƯỚC khi shell tồn tại'],
[8, 'Ch 4 — @v4 là một con trỏ; chỉ SHA 40 ký tự là đứng yên'],
[9, 'Ch 5 — Cache là tối ưu có thể biến mất; artifact là bàn giao'],
[10, 'Ch 6 — Che bí mật chỉ phủ ĐÚNG chuỗi đã lưu, trong LOG'],
[11, 'Ch 7 — Chỉ job trên đường tới hạn làm run nhanh hơn'],
[12, 'Ch 8 — Đọc mã thoát trước, đọc log sau'],
[13, 'Ch 9 — Deploy an toàn cần một đường, một khoá, và rollback'],
[14, 'Ch 10 — Chẩn đoán bằng một phép đo rẻ trước khi sửa'],
[15, 'Một workflow CI mẫu gom cả nửa khoá, từng dòng một chương'],
[16, '10 lỗi hay gặp nhất của nửa khoá (1–5)'],
[17, '10 lỗi hay gặp nhất của nửa khoá (6–10)'],
[18, 'Mẫu chung của cả mười lỗi: một thứ HỎNG mà không ỒN'],
[19, 'Tự kiểm: tôi đã làm được những việc này chưa?'],
[20, 'Câu hỏi phỏng vấn nền tảng (1/2): trả lời bằng cơ chế + số đo'],
[21, 'Câu hỏi phỏng vấn nền tảng (2/2): kể một sự cố thật'],
[22, 'Bảng tra nhanh nửa khoá: lệnh và dòng YAML dùng nhiều nhất'],
[23, 'Nửa sau khoá: từ "dùng được" tới "dựng cho cả đội"'],
[24, 'Thực hành Chương 11 (60 phút): soát kho của chính bạn'],
])}
`,
    },

    /* ─────────────────────────── 11.2 ─────────────────────────── */
    {
      title: '11.2 — Mid-course check|||11.2 — Kiểm tra giữa khoá',
      slug: 'ga-11-2-thi-cuoi',
      type: 'QUIZ',
      description: 'Mười câu tình huống trải đều Chương 1–10 — YAML, job và output, biểu thức, ghim action, cache, bí mật, đường tới hạn, run đỏ, deploy, chẩn đoán — mỗi câu có giải thích. Làm xong trước khi sang Chương 12.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Mid-course check</span>
<h2>Ten situations across Chapters 1–10</h2>
<p class="lead">Ten questions, fifteen minutes, one per chapter. Each is a situation you will meet on a real repository, and each option was written to sound plausible — the right one is the one a measurement from this course supports, not the one that sounds most confident. Every question has an explanation; read it even when you were right.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain how YAML can change a value before GitHub ever sees it, and why a filtered required check freezes a PR.</li>
<li>I can pass a value from one job to another and say what happens when a name is wrong.</li>
<li>I can tell which <code>if:</code> conditions are always true, and why untrusted text goes through <code>env:</code>.</li>
<li>I can explain why a SHA pin is safer than <code>@v4</code>, and what a cache really saves on a GitHub runner.</li>
<li>I can say what masking does NOT protect, and how OIDC replaces a stored key.</li>
<li>I can find the critical path of a run, read a red run in four steps, and explain why a single green re-run proves nothing.</li>
<li>I can describe a safe deploy (one path, a shared lock, rollback from what production runs) and diagnose a 404 after a green deploy.</li>
</ul>
${slide('ga-11', 22, 'Bảng tra nhanh nửa khoá: lệnh và dòng YAML dùng nhiều nhất')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra giữa khoá</span>
<h2>Mười tình huống trải Chương 1–10</h2>
<p class="lead">Mười câu, mười lăm phút, mỗi chương một câu. Câu nào cũng là một tình huống bạn sẽ gặp trên một kho thật, và phương án nào cũng được viết cho nghe hợp lý — đáp án đúng là cái mà một phép đo trong khoá này ủng hộ, không phải cái nghe tự tin nhất. Câu nào cũng có giải thích; đọc nó kể cả khi bạn làm đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được YAML có thể đổi một giá trị thế nào trước khi GitHub kịp thấy, và vì sao một ô kiểm bắt buộc bị lọc làm PR đứng im.</li>
<li>Tôi truyền được một giá trị từ job này sang job khác và nói được chuyện gì xảy ra khi gõ sai tên.</li>
<li>Tôi chỉ ra được điều kiện <code>if:</code> nào luôn đúng, và vì sao chữ không tin được phải đi qua <code>env:</code>.</li>
<li>Tôi giải thích được vì sao ghim SHA an toàn hơn <code>@v4</code>, và một cache thật sự tiết kiệm được gì trên runner của GitHub.</li>
<li>Tôi nói được mặt nạ che bí mật KHÔNG bảo vệ những gì, và OIDC thay một khoá đã lưu thế nào.</li>
<li>Tôi tìm được đường tới hạn của một run, đọc một run đỏ theo bốn bước, và giải thích vì sao một lần chạy lại xanh không chứng minh gì.</li>
<li>Tôi mô tả được một cuộc deploy an toàn (một đường, khoá chung, rollback theo thứ production đang chạy) và chẩn đoán được một lỗi 404 sau cú deploy xanh.</li>
</ul>
${slide('ga-11', 22, 'Bảng tra nhanh nửa khoá: lệnh và dòng YAML dùng nhiều nhất')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "Chapter 1. A workflow says <code>node-version: 18.20</code> without quotes, and CI installs Node 18.2.0 with no error. What happened?|||Chương 1. Một workflow ghi <code>node-version: 18.20</code> không có nháy, và CI cài Node 18.2.0 mà không báo lỗi gì. Chuyện gì đã xảy ra?",
            options: [
              "setup-node rounds an unknown patch version down to the nearest minor release it has in the tool cache|||setup-node làm tròn một bản vá lạ xuống bản minor gần nhất có sẵn trong tool cache",
              "YAML read 18.20 as the number 18.2 before setup-node ever saw it; quoting the version keeps it as the text 18.20|||YAML đọc 18.20 thành số 18.2 trước khi setup-node kịp thấy; đặt nháy giữ nó ở dạng chữ 18.20",
              "GitHub treats a trailing zero in a version as a wildcard and picks the lowest matching release|||GitHub coi số 0 ở cuối phiên bản là ký tự đại diện và chọn bản khớp thấp nhất",
              "The runner image had only Node 18.2.0 installed, so setup-node fell back to it silently|||Ảnh runner chỉ cài sẵn Node 18.2.0, nên setup-node âm thầm lùi về bản đó",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: 18.20 is a valid YAML number, and as a number it equals 18.2 — the trailing zero is gone before the action receives its input. setup-node then correctly installs the version it was given. The tool-cache option is tempting because the tool cache is real (Chapter 4), but setup-node downloads versions that are not cached; it never substitutes a different version. Quote every version: '18.20'.|||VI: 18.20 là một số YAML hợp lệ, và ở dạng số nó bằng 18.2 — số 0 cuối đã mất trước khi action nhận input. setup-node sau đó cài đúng phiên bản nó được đưa. Phương án tool cache hấp dẫn vì tool cache có thật (Chương 4), nhưng setup-node tải về bản không có trong cache chứ không bao giờ thay bằng bản khác. Đặt nháy mọi phiên bản: '18.20'.",
          },
          {
            question: "Chapter 2. Job <code>build</code> writes <code>version=1.4.2</code> to <code>$GITHUB_OUTPUT</code> in a step with <code>id: v</code>. Job <code>deploy</code> has <code>needs: build</code> and reads <code>needs.build.outputs.version</code> — it gets an empty string and no error. What is the most likely cause?|||Chương 2. Job <code>build</code> ghi <code>version=1.4.2</code> vào <code>$GITHUB_OUTPUT</code> ở một bước có <code>id: v</code>. Job <code>deploy</code> có <code>needs: build</code> và đọc <code>needs.build.outputs.version</code> — nhận chuỗi rỗng, không lỗi gì. Nguyên nhân khả dĩ nhất?",
            options: [
              "needs: only waits for the job; outputs can only be passed between jobs through an artifact|||needs: chỉ chờ job; output chỉ truyền được giữa các job qua artifact",
              "The two jobs ran on different runners, and $GITHUB_OUTPUT is a file that stays on the first machine|||Hai job chạy trên hai runner khác nhau, và $GITHUB_OUTPUT là một tệp nằm lại trên máy đầu",
              "The value was written after the step had already finished, so the runner ignored it|||Giá trị được ghi sau khi bước đã kết thúc, nên runner bỏ qua nó",
              "Job build has no outputs: block mapping version to steps.v.outputs.version — the third of the four hops is missing|||Job build không có khối outputs: ánh xạ version tới steps.v.outputs.version — thiếu chặng thứ ba trong bốn chặng",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: An output travels in four hops: $GITHUB_OUTPUT → a step with an id → the job's outputs: block → needs.build.outputs in the receiving job. Skip the job-level mapping and the reader gets an empty string, not an error. The runner option is tempting because jobs really do run on different machines, but that is exactly why GitHub carries outputs through the job's outputs: block for you.|||VI: Một output đi bốn chặng: $GITHUB_OUTPUT → bước có id → khối outputs: của job → needs.build.outputs ở job nhận. Bỏ chặng ánh xạ ở mức job thì bên đọc nhận chuỗi rỗng, không lỗi. Phương án runner hấp dẫn vì các job đúng là chạy trên máy khác nhau, nhưng chính vì thế GitHub mang output qua khối outputs: của job giúp bạn.",
          },
          {
            question: "Chapter 3. A step has <code>if: ${{ github.event_name }} == 'push'</code>. It also runs on pull requests. Why?|||Chương 3. Một bước có <code>if: ${{ github.event_name }} == 'push'</code>. Nó chạy cả trên pull request. Vì sao?",
            options: [
              "Text outside the braces turns the whole condition into a non-empty string, which is always true|||Chữ nằm ngoài cặp ngoặc biến cả điều kiện thành một chuỗi khác rỗng, và chuỗi ấy luôn đúng",
              "String comparison with == ignores case, so 'push' also matches 'pull_request'|||So chuỗi bằng == không phân biệt hoa thường, nên 'push' cũng khớp 'pull_request'",
              "github.event_name is empty on pull requests, and an empty value compares equal to any string|||github.event_name rỗng trên pull request, và giá trị rỗng so bằng với mọi chuỗi",
              "Step-level if: is evaluated after the step has run, so it can only change the step's colour|||if: mức bước được tính sau khi bước đã chạy, nên nó chỉ đổi được màu của bước",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: GitHub substitutes the expression and is left with text like pull_request == 'push' — a non-empty string, which is truthy, so the step always runs. Put the whole comparison inside the braces, or write it without braces at all. The case-insensitive option is tempting because == really is case-insensitive for strings, but 'push' and 'pull_request' differ in more than case.|||VI: GitHub thay biểu thức và còn lại một đoạn chữ kiểu pull_request == 'push' — một chuỗi khác rỗng, tức là đúng, nên bước luôn chạy. Đặt cả phép so vào trong cặp ngoặc, hoặc viết không có ngoặc. Phương án không phân biệt hoa thường hấp dẫn vì == đúng là không phân biệt hoa thường với chuỗi, nhưng 'push' và 'pull_request' khác nhau nhiều hơn là chữ hoa.",
          },
          {
            question: "Chapter 4. Your workflows use <code>some-org/changed-files@v45</code>. The maintainer’s account is compromised and the attacker re-points the tag to malicious code. Which pin would have kept your runs on the reviewed code?|||Chương 4. Workflow của bạn dùng <code>some-org/changed-files@v45</code>. Tài khoản người bảo trì bị chiếm và kẻ tấn công trỏ lại thẻ sang mã độc. Cách ghim nào đã giữ các run của bạn ở đúng mã đã xem?",
            options: [
              "@v45.0.1 — a full semantic version is frozen once it is published|||@v45.0.1 — một phiên bản semver đầy đủ bị đóng băng khi đã phát hành",
              "@main — the default branch is protected, so an attacker cannot change it|||@main — nhánh mặc định được bảo vệ, nên kẻ tấn công không đổi được",
              "@ followed by the full 40-character commit SHA of the release you reviewed|||@ kèm SHA commit đủ 40 ký tự của bản phát hành bạn đã xem",
              "@ followed by the first 7 characters of that commit SHA, as shown on GitHub|||@ kèm 7 ký tự đầu của SHA commit đó, như GitHub hiển thị",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Every tag, including a full semantic version like v45.0.1, can be moved by someone with write access — which is what happened to tj-actions/changed-files in March 2025. Only a full commit SHA cannot be re-pointed. The short SHA is tempting, but GitHub rejects short SHAs in uses: at Set up job, so that workflow would not run at all.|||VI: Mọi thẻ, kể cả semver đầy đủ như v45.0.1, đều dời được bởi người có quyền ghi — đúng chuyện đã xảy ra với tj-actions/changed-files tháng 3/2025. Chỉ SHA commit đầy đủ là không trỏ lại được. SHA ngắn hấp dẫn, nhưng GitHub từ chối SHA ngắn trong uses: ngay ở Set up job, nên workflow đó sẽ không chạy được.",
          },
          {
            question: "Chapter 5. On a GitHub-hosted runner, which change cut the dependency install the most in this course’s measurements (17.5 s without any cache)?|||Chương 5. Trên runner của GitHub, thay đổi nào cắt bước cài phụ thuộc nhiều nhất trong các phép đo của khoá (17,5 s khi không có cache)?",
            options: [
              "cache: npm on setup-node, which stores ~/.npm and still runs npm ci — down to 13.7 s|||cache: npm của setup-node, giữ ~/.npm và vẫn chạy npm ci — xuống 13,7 s",
              "Caching node_modules with a lockfile-hash key and skipping npm ci on a hit — down to 3.6 s|||Cache node_modules với khoá theo hash lockfile và bỏ npm ci khi trúng — xuống 3,6 s",
              "Caching node_modules with restore-keys so every branch always gets a partial hit|||Cache node_modules kèm restore-keys để nhánh nào cũng luôn trúng một phần",
              "Using a key that contains github.sha so each commit gets its own fresh cache entry|||Dùng khoá chứa github.sha để mỗi commit có một mục cache mới riêng",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Measured on the runner: cache: npm saved 22% (17.5 s → 13.7 s) because GitHub's runners download packages fast; caching node_modules and skipping npm ci on a hit saved 79% (3.6 s). cache: npm is the tempting answer because it is the one everybody adds first. A github.sha key misses and saves on every run, and restore-keys on node_modules can restore contents that do not match the lockfile.|||VI: Đo trên runner: cache: npm tiết kiệm 22% (17,5 s → 13,7 s) vì runner của GitHub tải gói rất nhanh; cache node_modules và bỏ npm ci khi trúng tiết kiệm 79% (3,6 s). cache: npm là đáp án hấp dẫn vì ai cũng thêm nó đầu tiên. Khoá có github.sha trượt và lưu ở mọi lần, còn restore-keys cho node_modules có thể khôi phục nội dung không khớp lockfile.",
          },
          {
            question: "Chapter 6. A step base64-decodes a registered secret into a variable and, while debugging, prints the decoded value in upper case. What does the log show?|||Chương 6. Một bước giải mã base64 một secret đã đăng ký vào một biến và, trong lúc gỡ lỗi, in giá trị đã giải mã ở dạng viết hoa. Log hiện gì?",
            options: [
              "The upper-cased value in plain text — masking only replaces the exact registered strings, not transformations of them|||Giá trị viết hoa ở dạng chữ trơn — mặt nạ chỉ thay đúng các chuỗi đã đăng ký, không thay các biến đổi của chúng",
              "*** — GitHub masks any value derived from a secret, whatever transformation produced it|||*** — GitHub che mọi giá trị suy ra từ secret, bất kể phép biến đổi nào tạo ra nó",
              "Nothing — the runner refuses to print a line that contains data derived from a secret|||Không gì cả — runner từ chối in dòng có chứa dữ liệu suy ra từ secret",
              "*** for the letters and the original characters for the digits, because masking is case-sensitive|||*** cho các chữ cái và ký tự gốc cho các chữ số, vì mặt nạ phân biệt hoa thường",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Masking is a find-and-replace on the log for the registered strings (and a few encodings such as plain base64 of them). An upper-cased copy, a substitution, a JSON field or a decoded key is a different string and leaks. The 'masks anything derived' option is the comfortable belief Chapter 6 measured as false. Register derived values with ::add-mask:: before first use — or better, never print them — and rotate if one leaks.|||VI: Mặt nạ là phép tìm-và-thay trên log cho các chuỗi đã đăng ký (và vài dạng mã hoá như base64 trơn của chúng). Bản viết hoa, phép thay ký tự, một trường JSON hay khoá đã giải mã là chuỗi KHÁC và bị lọt. Phương án 'che mọi thứ suy ra' là niềm tin dễ chịu mà Chương 6 đã đo là sai. Đăng ký giá trị suy ra bằng ::add-mask:: trước lần dùng đầu — tốt hơn là đừng in nó — và xoay khoá nếu đã lộ.",
          },
          {
            question: "Chapter 7. A release run has three jobs after setup: <code>linux</code> (90 s) and <code>macos</code> (430 s) in parallel, then <code>publish</code> (20 s) which needs both. You halve the Linux job. How much sooner does the run finish?|||Chương 7. Một run phát hành có ba job sau bước chuẩn bị: <code>linux</code> (90 s) và <code>macos</code> (430 s) chạy song song, rồi <code>publish</code> (20 s) cần cả hai. Bạn giảm nửa job Linux. Run xong sớm hơn bao lâu?",
            options: [
              "45 s — every second removed from a job is removed from the run|||45 s — mỗi giây bớt khỏi một job là bớt khỏi run",
              "About 22 s — parallel jobs share the saving between them|||Khoảng 22 s — các job song song chia nhau khoản tiết kiệm",
              "It depends on the cache hit rate of the Linux job, not on its duration|||Tuỳ tỉ lệ trúng cache của job Linux, không tuỳ thời lượng của nó",
              "0 s — publish still waits for macos, which is on the critical path; Linux only gains slack|||0 s — publish vẫn chờ macos, job nằm trên đường tới hạn; Linux chỉ có thêm độ chùng",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: The wall-clock of a run is the length of its critical path: setup → macos → publish. Linux already had 340 s of slack; halving it adds slack and saves machine-seconds (money), not waiting time. The same thing was measured on api-backend: halving its Linux build would save 0 s because it has 199 s of slack. Speed up the macOS job, or remove a false needs: edge, to change the wall-clock.|||VI: Thời gian đồng hồ của một run là độ dài đường tới hạn: chuẩn bị → macos → publish. Linux đã có 340 s độ chùng; giảm nửa nó chỉ thêm độ chùng và bớt máy-giây (tiền), không bớt thời gian chờ. Điều này đã đo trên api-backend: giảm nửa bản dựng Linux tiết kiệm 0 s vì nó có 199 s độ chùng. Muốn đổi thời gian đồng hồ, hãy tăng tốc job macOS hoặc gỡ một cạnh needs: không thật.",
          },
          {
            question: "Chapter 8. A test fails on 4 of 20 matrix legs. You click “Re-run failed jobs” and all four pass. What does that tell you?|||Chương 8. Một bài test hỏng ở 4 trên 20 nhánh ma trận. Bạn bấm “Re-run failed jobs” và cả bốn đều qua. Điều đó cho bạn biết gì?",
            options: [
              "The failure was caused by the runners, because the same code passed on the second try|||Cú hỏng do runner gây ra, vì cùng mã ấy qua ở lần thử thứ hai",
              "The bug has been fixed, because Re-run always checks out the latest commit on the branch|||Bug đã được vá, vì Re-run luôn checkout commit mới nhất trên nhánh",
              "Very little — a test that fails 20% of the time passes four re-runs 0.8⁴ ≈ 41% of the time; run it many times and count|||Rất ít — một test hỏng 20% số lần qua bốn lần chạy lại với xác suất 0,8⁴ ≈ 41%; hãy chạy nhiều lần và đếm",
              "The test is order-dependent, because it only fails when other legs run at the same time|||Test phụ thuộc thứ tự, vì nó chỉ hỏng khi các nhánh khác chạy cùng lúc",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: This is sandbox run 36011087956: the test fails whenever Math.random() < 0.2, it was never fixed, and the re-run still turned the run green. Re-run reuses the SAME commit, so it cannot contain a fix. The 'runners' option is the comfortable conclusion the chapter measured against: four greens are weak evidence, twenty in a row (1.2% by chance) would be strong.|||VI: Đây là run sân tập 36011087956: bài test hỏng mỗi khi Math.random() < 0.2, chưa từng được vá, và lần chạy lại vẫn biến run thành xanh. Re-run dùng CÙNG commit nên không thể chứa bản vá. Phương án 'do runner' là kết luận dễ chịu mà chương đã đo để bác: bốn lần xanh là bằng chứng yếu, hai mươi lần liên tiếp (1,2% do may rủi) mới mạnh.",
          },
          {
            question: "Chapter 9. Your deploy job saves the running version, swaps in a new image, the health check fails, and the job swaps the old image back successfully. How should the job end, and why?|||Chương 9. Job deploy của bạn lưu phiên bản đang chạy, tráo ảnh mới vào, kiểm sức khoẻ hỏng, và job tráo ảnh cũ về thành công. Job nên kết thúc thế nào, và vì sao?",
            options: [
              "Red — the deploy failed even though production is safe, and a green run would tell everyone the change shipped|||Đỏ — cuộc deploy thất bại dù production an toàn, và một run xanh sẽ nói với mọi người rằng thay đổi đã lên",
              "Green — the rollback worked, so the pipeline did its job and nobody needs to look|||Xanh — rollback đã chạy đúng, nên pipeline làm xong việc và không ai cần nhìn",
              "Cancelled — GitHub marks a run cancelled whenever a later step undoes an earlier one|||Cancelled — GitHub đánh dấu run là bị huỷ mỗi khi một bước sau hoàn tác một bước trước",
              "Green with continue-on-error on the health check, so the rollback step is allowed to run|||Xanh với continue-on-error trên bước kiểm sức khoẻ, để bước rollback được phép chạy",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Two facts, both must be reported: the deploy failed, and production is fine. Sandbox run 36017616624 does exactly that — rollback in 2.2 s, 12.6 s of downtime, job red, summary says what production runs. The continue-on-error option is tempting because it looks like the way to let the rollback run, but if: failure() on the rollback step already runs it; continue-on-error would also hide the failure from everyone.|||VI: Hai sự thật, phải báo cả hai: deploy thất bại, và production vẫn ổn. Run sân tập 36017616624 làm đúng vậy — rollback 2,2 s, sập 12,6 s, job đỏ, tóm tắt ghi production đang chạy gì. Phương án continue-on-error hấp dẫn vì trông như cách để bước rollback được chạy, nhưng if: failure() trên bước rollback đã cho nó chạy rồi; continue-on-error còn giấu cú hỏng khỏi mọi người.",
          },
          {
            question: "Chapter 10. A deploy finished green and the container is healthy, but a new endpoint returns 404 in the browser. What is the cheapest first measurement?|||Chương 10. Một cuộc deploy xong xanh và container khoẻ, nhưng một endpoint mới trả 404 trên trình duyệt. Phép đo đầu tiên rẻ nhất là gì?",
            options: [
              "Clear the browser cache and log in again, because a stale session often returns 404|||Xoá cache trình duyệt và đăng nhập lại, vì phiên cũ hay trả 404",
              "An unauthenticated curl of that route and of a known route: 401/200 means it is in the running build, 404 means the build is stale|||curl không xác thực route đó và một route đã biết: 401/200 nghĩa là nó có trong bản dựng đang chạy, 404 nghĩa là bản dựng cũ",
              "Re-run the deploy workflow, because a green deploy with a 404 is usually a flake|||Chạy lại workflow deploy, vì deploy xanh mà 404 thường là flake",
              "Read the health-check log, because it tests every route the application exposes|||Đọc log health check, vì nó kiểm mọi route mà ứng dụng mở ra",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Without a token, a mounted route answers 401 (needs auth) or 200 (public); only a route missing from the running build answers 404. Comparing with a known route rules out a typo. That is how the 2 July 2026 incident here was diagnosed: a stale build. The health-check option is tempting, but a health check asks one route, which is exactly why the stale image passed it — the fix was a post-deploy smoke test that fails on 404.|||VI: Không có token, route đã gắn trả 401 (cần đăng nhập) hoặc 200 (công khai); chỉ route không có trong bản dựng đang chạy mới trả 404. So với một route đã biết để loại trừ gõ sai. Sự cố 02/07/2026 ở đây được chẩn đoán đúng cách ấy: bản dựng cũ. Phương án health check hấp dẫn, nhưng health check chỉ hỏi một route — chính vì thế ảnh cũ vẫn qua nó; cách vá là smoke test sau deploy, hỏng khi gặp 404.",
          },
        ],
      },
    },
  ],
};
