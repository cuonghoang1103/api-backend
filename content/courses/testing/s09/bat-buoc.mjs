/**
 * Testing · Chương 9 · 9.3 — Check bắt buộc và bảo vệ nhánh. Slug giữ từ khung: tst-9-3-bat-buoc.
 * Phần GitHub (branch protection, ruleset, "skipped tính là đạt", continue-on-error) là TÀI LIỆU đọc 01/11/2026 + hình minh hoạ dựng
 * bằng HTML (ghi rõ). Phần đo được bằng act 0.2.94: tên job (act -l, "unit (Node ${{ matrix.node }})"), cổng ci-ok đỏ khi unit đỏ,
 * cổng thiếu always() bị bỏ qua (act không in dòng nào), "| tee" nuốt mã thoát (bash -e) còn shell: bash thêm pipefail,
 * quarantine đỏ 13/30 trên máy mà ci-ok vẫn xanh, act exit 1 vì job continue-on-error (GitHub: run không đỏ — tài liệu),
 * workflow đêm (schedule) chạy mutation + 5 trình duyệt + xáo thứ tự.
 */
import G from '../giang/tst-09-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const loc = (t, re) => t.split('\n').filter((l) => re.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const GATE_FN = CODE.gate.split('\n').slice(4).join('\n');
const TEN = loc(OUT['93-act-l'], /^\$ |Stage|^\d /);
const CONG_YML = CODE.testYml.split('\n').slice(-13).join('\n');
const XANH = loc(OUT['92-xanh'], /^\$ |Job (succeeded|failed)|ci-ok.*\| (✔|ci-ok)|act exit/);
const DO = loc(OUT['93-cong-do'], /^\$ |gate\/unit {4}\].*(Failure|Job)|ci-ok.*(✘|::error|Job)|act exit/);
const TEE = loc(OUT['93-cong-do'], /unit-tee\].*(docker exec cmd=\[bash -e \/var\/run\/act\/workflow\/3|Tests {2}1 failed|Success - Main npx|pipefail \/var|Failure - Main same|Job failed)/);
const LOCAL = OUT['93-gate-local'];
const LAP = OUT['93-quarantine-lap'];
const DEM = loc(OUT['93-nightly'], /^\$ |Success - Main npm run|Failure - Main|Success - Main npx (playwright|vitest)|Final mutation|\| {3}\d+ passed \(|Tests {2}\d+ passed|Job (succeeded|failed)|act exit|wall time/);
const TH93 = CODE.th93.split('\n').slice(16).join('\n');
const TH_XANH = loc(OUT['93-th-xanh'], /^\$ |ci-ok.*(every required|Job)|act exit/);
const TH_DO = loc(OUT['93-th-do'], /^\$ |ci-ok.*(\| unit:|Failure|Job)|act exit/);

const MINH_HOA_EN = `<div class="callout"><p><strong>Illustration</strong> (drawn in HTML for this lesson, not a screenshot of GitHub): the merge box of a pull request whose repository requires the check <code>ci-ok</code>.</p>
<table>
<thead><tr><th>Check</th><th></th><th>Status</th></tr></thead>
<tbody>
<tr><td>❌ tests / ci-ok (pull_request)</td><td><strong>Required</strong></td><td>Do not merge — unit: failure, e2e: failure</td></tr>
<tr><td>❌ tests / unit (Node 22)</td><td></td><td>Failing after 1m</td></tr>
<tr><td>✅ tests / integration (PostgreSQL 17)</td><td></td><td>Successful</td></tr>
<tr><td>❌ tests / quarantine (report only)</td><td></td><td>Failing — not required</td></tr>
</tbody></table>
<p>🚫 <strong>Merging is blocked</strong> — the required status check “ci-ok” has not succeeded.</p></div>`;
const MINH_HOA_VI = `<div class="callout"><p><strong>Hình minh hoạ</strong> (vẽ bằng HTML cho bài này, không phải ảnh chụp GitHub): ô merge của một pull request trong kho đòi check <code>ci-ok</code>.</p>
<table>
<thead><tr><th>Check</th><th></th><th>Trạng thái</th></tr></thead>
<tbody>
<tr><td>❌ tests / ci-ok (pull_request)</td><td><strong>Required</strong></td><td>Do not merge — unit: failure, e2e: failure</td></tr>
<tr><td>❌ tests / unit (Node 22)</td><td></td><td>Failing after 1m</td></tr>
<tr><td>✅ tests / integration (PostgreSQL 17)</td><td></td><td>Successful</td></tr>
<tr><td>❌ tests / quarantine (report only)</td><td></td><td>Failing — không bắt buộc</td></tr>
</tbody></table>
<p>🚫 <strong>Merging is blocked</strong> — check bắt buộc “ci-ok” chưa thành công.</p></div>`;

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Pull request</div><div class="lz-d">opened or updated — the workflow starts</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Jobs</div><div class="lz-d">unit (22, 24) · integration · e2e — and quarantine, which nobody waits for</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Gate: ci-ok</div><div class="lz-d">if: always(); reads needs; success only if every required job succeeded</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Rule on main</div><div class="lz-d">branch protection / ruleset: “ci-ok must pass”</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Merge button</div><div class="lz-d">enabled only when ci-ok is green (plus reviews, if required)</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Pull request</div><div class="lz-d">được mở hoặc cập nhật — workflow bắt đầu</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Các job</div><div class="lz-d">unit (22, 24) · integration · e2e — và quarantine, không ai chờ nó</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Cổng: ci-ok</div><div class="lz-d">if: always(); đọc needs; chỉ xanh khi mọi job bắt buộc đều thành công</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Luật trên main</div><div class="lz-d">branch protection / ruleset: “ci-ok phải đạt”</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Nút Merge</div><div class="lz-d">chỉ bật khi ci-ok xanh (cộng review, nếu có đòi)</div></div>
</div>`;

const LICH_EN = `<table>
<thead><tr><th>Check</th><th>When</th><th>Blocks a merge?</th></tr></thead>
<tbody>
<tr><td>unit + web (Node 22, 24), integration, e2e Chromium</td><td>every pull request (396 s in act)</td><td>yes, through ci-ok</td></tr>
<tr><td>quarantine (known flaky)</td><td>every pull request</td><td>no — report only</td></tr>
<tr><td>mutation, 5 browsers and devices, shuffled ×5</td><td>every night + on demand</td><td>no — read every morning</td></tr>
</tbody></table>`;
const LICH_VI = `<table>
<thead><tr><th>Phép kiểm</th><th>Khi nào</th><th>Chặn merge?</th></tr></thead>
<tbody>
<tr><td>unit + web (Node 22, 24), integration, e2e Chromium</td><td>mọi pull request (396 s trong act)</td><td>có, qua ci-ok</td></tr>
<tr><td>quarantine (đã biết chập chờn)</td><td>mọi pull request</td><td>không — chỉ báo cáo</td></tr>
<tr><td>mutation, 5 trình duyệt và thiết bị, xáo thứ tự ×5</td><td>mỗi đêm + khi cần</td><td>không — sáng nào cũng đọc</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('🛡️', 'GitHub Docs — About protected branches', 'Required checks: successful, skipped or neutral; strict = up to date (read 01/11/2026).', 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches'),
  nguon('🧩', 'GitHub Docs — Troubleshooting required status checks', 'A job skipped by a conditional reports “Success”; use always() with needs.', 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks'),
].join('\n');

export default {
  title: '9.3 — Required checks and branch protection|||9.3 — Check bắt buộc và bảo vệ nhánh',
  slug: 'tst-9-3-bat-buoc',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Biến một check đỏ thành một PR không merge được: branch protection/ruleset đòi check theo TÊN (tài liệu GitHub, hình minh hoạ dựng bằng HTML), một cổng ci-ok duy nhất có tên cố định, if: always() vì job bị bỏ qua được tính là đạt, mã thoát (| tee nuốt lỗi, shell: bash thêm pipefail — đo bằng act), test chập chờn không được chặn ai (quarantine đỏ 13/30 mà ci-ok vẫn xanh), và cái gì chạy mỗi PR, cái gì để đêm (mutation, 5 trình duyệt).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Required checks and branch protection</h2>
<p class="lead">In lesson 9.2 a pull request turned three jobs red. Nothing stopped anyone from pressing Merge: a red check is only information until a rule on the branch says it must pass. This lesson adds that rule — and closes the four holes through which red code still gets merged.</p>
<p><strong>After this lesson you can</strong> protect <code>main</code> so that red tests cannot be merged, design one gate job with a name that never changes, make sure it really fails when a test fails, keep flaky tests from blocking the team, and decide what runs on every pull request and what runs at night. <strong>Why it is useful:</strong> “we never merge red” is a promise; branch protection is how a team keeps it on the Friday afternoon nobody is careful — and an interview favourite (“how do you stop broken code reaching main?”).</p>

<h3>The rule lives on the branch, not in the workflow</h3>
<p>A workflow cannot block a merge. A <strong>branch protection rule</strong> or <strong>ruleset</strong> on <code>main</code> does: “Require status checks to pass before merging”, listing checks <em>by name</em>. GitHub’s documentation (read 01/11/2026): required checks “must have a successful, skipped, or neutral status”; by default the branch must also be up to date (strict); rulesets “work alongside” branch protection. act cannot measure settings — only names, exit codes and needs, which is what follows.</p>
${MINH_HOA_EN}
${FLOW_EN}

<h3>One gate with a name that never changes</h3>
<p>The name a rule matches is the job’s <code>name:</code> plus the matrix values. act lists the jobs as written:</p>
${ra(TEN)}
<p>A run turns <code>unit (Node &#36;{{ matrix.node }})</code> into <code>unit (Node 22)</code> and <code>unit (Node 24)</code>. Require those and every matrix change breaks the rule (a new leg is not required; a removed one is waited for forever). So LabFlow Lite requires <strong>one</strong> check, <code>ci-ok</code>, which needs all the others:</p>
${ma('yaml', CONG_YML)}
<p>The decision is code — <code>decideMerge</code> in <code>src/ci/gate.js</code>, tested in <code>gate.test.js</code>:</p>
${ma('javascript', GATE_FN)}
<p>On the green run of the reference workflow (lesson 9.2) the gate passes:</p>
${ra(XANH)}
<p>Notice <code>act exit: 1</code> on a run whose gate is green: the quarantine job failed and act counts every failed job. GitHub’s documentation says job-level <code>continue-on-error</code> “prevents a workflow run from failing when a job fails”. When you rehearse with act, read <code>ci-ok</code>’s result, not act’s exit code — the Lab 9 grader does exactly that.</p>

<h3>if: always() — because skipped counts as passed</h3>
<p><code>demo9/wf/93-cong.yml</code> puts two gates side by side on the 30-seat pull request (rule BR-06 broken: <code>seats &gt;= 30</code>): <code>ci-ok</code> (with <code>if: always()</code>) and <code>naive-gate</code> (without, it just echoes “all green”). On the red branch:</p>
${ra(DO)}
<p><code>ci-ok</code> ran and failed with the reason. <code>naive-gate</code> does not appear at all — a job whose needs failed is skipped, and act prints nothing for it. On GitHub it is shown as skipped, and the documentation is explicit: a job skipped this way “reports Success”. Require <code>naive-gate</code> and this pull request merges. The same check, run locally with every result that is not success:</p>
${ra(LOCAL)}
<div class="pitfall co-tieu-de"><strong>Skipped is not passed.</strong> In LabFlow Lite every required job always runs, so a skip means something broke (a needs chain, an <code>if:</code> typo); our gate blocks on <code>skipped</code> and <code>cancelled</code>. If you have jobs that are skipped <em>on purpose</em> (e2e only with a label), decide per job — the GitHub Actions course, lesson 14.1, measures that case on real pull requests.</div>

<h3>Exit codes: the pipe that hides a red test</h3>
<p>A step is red only when its last command exits with non-zero. Someone wants the test log in a file and writes <code>npx vitest run src/ | tee unit.log</code>:</p>
${ra(TEE)}
<p>1 test failed, step ✅: a pipe returns <code>tee</code>’s exit code, and the default shell <code>bash -e</code> has no <code>pipefail</code>. With <code>shell: bash</code>, GitHub runs <code>bash --noprofile --norc -eo pipefail</code> (documentation; act did the same) and the step fails. Lesson 9.2’s summary step pipes on purpose: it reports, it does not decide.</p>

<h3>Flaky tests must not block anyone</h3>
<p>The race test of lesson 8.3 now lives in <code>test/quarantine/</code>, tagged <code>quarantine</code>, with an issue, an owner and a date. Locally:</p>
${ra(LAP)}
<p>Red in 13 of 30 runs on the same code. As a required check it would block one pull request in three for a bug none of them caused, and people would learn to press re-run. So its job has <code>continue-on-error: true</code> and is <strong>not</strong> in <code>ci-ok</code>’s needs: it reports on every PR (and in lesson 9.2’s job summary), it blocks nobody, and it goes back into the gate only after the fix proves 0 red in 100 shuffled runs (lesson 8.3).</p>

<h3>Every pull request, or every night?</h3>
${LICH_EN}
<p>The slow checks go into <code>.github/workflows/nightly.yml</code> with <code>on: schedule: - cron: '0 20 * * *'</code> and <code>workflow_dispatch</code>. Cron runs in UTC: that is 03:00 in Viet Nam — before 07:00, the hour at which lesson 8.3’s real-clock test was red. A nightly job is exactly where such a bug shows up. act plays the <code>schedule</code> event on demand:</p>
${ra(DEM)}
<p>All green: 175 tests in shuffled order, a mutation score of 98.73 (break threshold 80, Chapter 8), 37 browser tests on five browsers and devices. The night took 806 s, and 12 minutes 13 seconds of it was installing three browsers with their libraries — one more reason these checks do not run on every pull request. Nothing nightly blocks a merge. Instead, someone looks at it every morning — a red night with no owner is how a nightly job dies.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>Write a gate without a script: in <code>demo9/wf/th93.yml</code> the job <code>ci-ok</code> must run always, and fail if any job it needs did not succeed — using only expressions (<code>needs.*.result</code>). Prove it on <code>main</code> and on <code>pr/30-cho</code> — a branch with one change in <code>src/rules/booking.js</code>: <code>seats &gt; APPROVAL_SEATS</code> → <code>seats &gt;= APPROVAL_SEATS</code> (create it yourself after <code>git init</code>).</p>
<p><strong>Solution and real output:</strong></p>
${ma('yaml', TH93)}
${ra(TH_XANH)}
${ra(TH_DO)}
<p><strong>Done when</strong> the gate is green on <code>main</code>, red on <code>pr/30-cho</code>, and you can say why <code>contains(needs.*.result, 'skipped')</code> is in the condition.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">required status check (check bắt buộc)</span><span class="v">A check, matched by name, that must pass before a PR can merge.</span></div>
  <div class="kv"><span class="k">branch protection / ruleset (bảo vệ nhánh)</span><span class="v">Rules on a branch: required checks, reviews, no force-push.</span></div>
  <div class="kv"><span class="k">gate job (job cổng)</span><span class="v">One job that needs all others and decides; the only required check.</span></div>
  <div class="kv"><span class="k">skipped (bị bỏ qua)</span><span class="v">A job that did not run; counts as success for required checks.</span></div>
  <div class="kv"><span class="k">nightly (chạy đêm)</span><span class="v">Slow, broad checks on a schedule; reported, not blocking.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A red check blocks nothing until a rule on <code>main</code> requires it, by name.</li>
<li>Require one stable gate, <code>ci-ok</code>, not matrix-named jobs.</li>
<li>The gate needs <code>if: always()</code> and must read the results: skipped counts as passed.</li>
<li>Exit codes decide; <code>| tee</code> hides failures unless the shell has <code>pipefail</code>.</li>
<li>Flaky tests report but never block; slow checks run at night and someone reads them in the morning.</li>
</ul>

${NGUON}
${lienKet({ khoa: 'git', bai: 'git-6-4-bao-ve-nhanh', title: 'Git course — 6.4: branch protection, CODEOWNERS and required checks', sub: 'There: the rules — no direct push, reviews, CODEOWNERS. Here: the CI side — one gate that really fails.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'github-actions', bai: 'ga-14-1-cong-chat-luong', title: 'GitHub Actions course — 14.1: quality gates', sub: 'There: measured on five real GitHub pull requests — a summary job without always() skipped and counted as passing. Here: the same gate for a test suite, with act.', cta: 'OPEN LESSON →' })}
${lienKet({ bai: 'swt301-ci-automation', title: 'Theory in SWT301 — 8.6: “no merge on red”', sub: 'Same: nobody merges on red. Deeper here: how GitHub enforces it, and four ways red still gets through.', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Check bắt buộc và bảo vệ nhánh</h2>
<p class="lead">Ở bài 9.2 một pull request làm ba job đỏ. Không gì ngăn ai bấm Merge: một check đỏ chỉ là thông tin cho tới khi một luật trên nhánh nói nó phải đạt. Bài này thêm luật đó — và bịt bốn lỗ mà qua đó code đỏ vẫn được merge.</p>
<p><strong>Sau bài này bạn có thể</strong> bảo vệ <code>main</code> để test đỏ không merge được, thiết kế một job cổng có tên không bao giờ đổi, bảo đảm nó thật sự đỏ khi test đỏ, giữ test chập chờn khỏi chặn cả nhóm, và quyết định cái gì chạy ở mỗi pull request, cái gì chạy ban đêm. <strong>Vì sao hữu ích:</strong> “không bao giờ merge khi đỏ” là một lời hứa; bảo vệ nhánh là cách nhóm giữ lời hứa đó vào chiều thứ Sáu khi chẳng ai cẩn thận — và là câu phỏng vấn quen thuộc (“bạn chặn code hỏng vào main thế nào?”).</p>

<h3>Luật nằm trên nhánh, không nằm trong workflow</h3>
<p>Workflow không chặn được merge. Một <strong>branch protection rule</strong> (luật bảo vệ nhánh) hoặc <strong>ruleset</strong> trên <code>main</code> thì chặn được: “Require status checks to pass before merging”, liệt kê check <em>theo tên</em>. Tài liệu GitHub (đọc 01/11/2026): check bắt buộc “must have a successful, skipped, or neutral status”; mặc định nhánh còn phải cập nhật theo main (strict); ruleset “work alongside” luật bảo vệ nhánh. act không đo được phần cài đặt — chỉ đo được tên, mã thoát và needs, là phần dưới đây.</p>
${MINH_HOA_VI}
${FLOW_VI}

<h3>Một cổng với cái tên không bao giờ đổi</h3>
<p>Tên mà luật so khớp là <code>name:</code> của job cộng các giá trị matrix. act liệt kê các job như khi viết:</p>
${ra(TEN)}
<p>Khi chạy, <code>unit (Node &#36;{{ matrix.node }})</code> thành <code>unit (Node 22)</code> và <code>unit (Node 24)</code>. Đòi chúng thì mỗi lần đổi matrix là luật hỏng (nhánh mới không bị đòi; nhánh đã bỏ bị chờ mãi). Vì vậy LabFlow Lite chỉ đòi <strong>một</strong> check, <code>ci-ok</code>, cần mọi job còn lại:</p>
${ma('yaml', CONG_YML)}
<p>Quyết định là code — <code>decideMerge</code> trong <code>src/ci/gate.js</code>, được test trong <code>gate.test.js</code>:</p>
${ma('javascript', GATE_FN)}
<p>Trên lần chạy xanh của workflow tham khảo (bài 9.2), cổng đạt:</p>
${ra(XANH)}
<p>Để ý <code>act exit: 1</code> trên một lần chạy mà cổng xanh: job quarantine đỏ và act tính mọi job đỏ. Tài liệu GitHub nói <code>continue-on-error</code> ở mức job “prevents a workflow run from failing when a job fails”. Khi tổng duyệt bằng act, hãy đọc kết quả của <code>ci-ok</code>, đừng đọc mã thoát của act — máy chấm Lab 9 làm đúng như vậy.</p>

<h3>if: always() — vì bị bỏ qua được tính là đạt</h3>
<p><code>demo9/wf/93-cong.yml</code> đặt hai cổng cạnh nhau trên pull request 30 chỗ (luật BR-06 bị làm hỏng: <code>seats &gt;= 30</code>): <code>ci-ok</code> (có <code>if: always()</code>) và <code>naive-gate</code> (không có, chỉ echo “all green”). Trên nhánh đỏ:</p>
${ra(DO)}
<p><code>ci-ok</code> chạy và đỏ kèm lý do. <code>naive-gate</code> không hề xuất hiện — job có needs bị hỏng thì bị bỏ qua, và act không in dòng nào cho nó. Trên GitHub nó hiện là skipped, và tài liệu nói rõ: job bị bỏ qua kiểu này “reports Success”. Đòi <code>naive-gate</code> thì pull request này merge được. Cùng phép kiểm đó, chạy trên máy với mọi kết quả không phải success:</p>
${ra(LOCAL)}
<div class="pitfall co-tieu-de"><strong>Bị bỏ qua không phải là đạt.</strong> Trong LabFlow Lite mọi job bắt buộc đều luôn chạy, nên bị bỏ qua nghĩa là có gì đó hỏng (chuỗi needs, một <code>if:</code> gõ sai); cổng của ta chặn cả <code>skipped</code> và <code>cancelled</code>. Nếu bạn có job bị bỏ qua <em>có chủ đích</em> (e2e chỉ chạy khi có nhãn), hãy quyết định theo từng job — khoá GitHub Actions, bài 14.1, đo đúng trường hợp đó trên pull request thật.</div>

<h3>Mã thoát: đường ống che mất một test đỏ</h3>
<p>Một bước chỉ đỏ khi lệnh cuối của nó thoát khác 0. Ai đó muốn lưu log test ra file và viết <code>npx vitest run src/ | tee unit.log</code>:</p>
${ra(TEE)}
<p>1 test đỏ, bước ✅: đường ống trả mã thoát của <code>tee</code>, và shell mặc định <code>bash -e</code> không có <code>pipefail</code>. Với <code>shell: bash</code>, GitHub chạy <code>bash --noprofile --norc -eo pipefail</code> (tài liệu; act cũng vậy) và bước đỏ. Bước tóm tắt ở bài 9.2 dùng ống có chủ đích: nó báo cáo, không quyết định.</p>

<h3>Test chập chờn không được chặn ai</h3>
<p>Test tranh chấp của bài 8.3 giờ nằm trong <code>test/quarantine/</code>, gắn tag <code>quarantine</code>, có issue, người phụ trách và hạn. Trên máy:</p>
${ra(LAP)}
<p>Đỏ 13 trên 30 lần trên cùng một code. Là check bắt buộc, nó sẽ chặn một trong ba pull request vì một bug không PR nào gây ra, và mọi người sẽ học cách bấm chạy lại. Vì thế job của nó có <code>continue-on-error: true</code> và <strong>không</strong> nằm trong needs của <code>ci-ok</code>: nó báo cáo ở mọi PR (và trong job summary của bài 9.2), không chặn ai, và chỉ quay lại cổng sau khi bản sửa chứng minh 0 lần đỏ trong 100 lần chạy xáo thứ tự (bài 8.3).</p>

<h3>Mỗi pull request, hay mỗi đêm?</h3>
${LICH_VI}
<p>Các phép kiểm chậm vào <code>.github/workflows/nightly.yml</code> với <code>on: schedule: - cron: '0 20 * * *'</code> và <code>workflow_dispatch</code>. Cron chạy theo UTC: đó là 03:00 giờ Việt Nam — trước 07:00, đúng giờ mà test dùng đồng hồ thật ở bài 8.3 bị đỏ. Job đêm chính là chỗ bug kiểu đó lộ ra. act phát event <code>schedule</code> theo yêu cầu:</p>
${ra(DEM)}
<p>Tất cả xanh: 175 test theo thứ tự xáo trộn, điểm đột biến 98,73 (ngưỡng break 80, Chương 8), 37 test trình duyệt trên năm trình duyệt và thiết bị. Cả đêm mất 806 s, trong đó 12 phút 13 giây là cài ba trình duyệt kèm thư viện — thêm một lý do để các phép kiểm này không chạy ở mỗi pull request. Không gì chạy đêm chặn merge. Thay vào đó, sáng nào cũng có người nhìn nó — một đêm đỏ không ai nhận là cách một job đêm chết dần.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Viết một cổng không cần script: trong <code>demo9/wf/th93.yml</code>, job <code>ci-ok</code> phải luôn chạy, và đỏ nếu bất kỳ job nào nó cần không thành công — chỉ dùng biểu thức (<code>needs.*.result</code>). Chứng minh trên <code>main</code> và trên <code>pr/30-cho</code> — một nhánh chỉ đổi một chỗ trong <code>src/rules/booking.js</code>: <code>seats &gt; APPROVAL_SEATS</code> → <code>seats &gt;= APPROVAL_SEATS</code> (tự tạo sau khi <code>git init</code>).</p>
<p><strong>Lời giải và output thật:</strong></p>
${ma('yaml', TH93)}
${ra(TH_XANH)}
${ra(TH_DO)}
<p><strong>Xong khi</strong> cổng xanh trên <code>main</code>, đỏ trên <code>pr/30-cho</code>, và bạn giải thích được vì sao <code>contains(needs.*.result, 'skipped')</code> nằm trong điều kiện.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">required status check (check bắt buộc)</span><span class="v">Một check, so khớp theo tên, phải đạt trước khi PR được merge.</span></div>
  <div class="kv"><span class="k">branch protection / ruleset (bảo vệ nhánh)</span><span class="v">Luật trên một nhánh: check bắt buộc, review, cấm force-push.</span></div>
  <div class="kv"><span class="k">gate job (job cổng)</span><span class="v">Một job cần mọi job khác và ra quyết định; check bắt buộc duy nhất.</span></div>
  <div class="kv"><span class="k">skipped (bị bỏ qua)</span><span class="v">Job không chạy; được tính là đạt với check bắt buộc.</span></div>
  <div class="kv"><span class="k">nightly (chạy đêm)</span><span class="v">Phép kiểm chậm, rộng, chạy theo lịch; báo cáo, không chặn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một check đỏ không chặn gì cho tới khi một luật trên <code>main</code> đòi nó, theo tên.</li>
<li>Đòi một cổng có tên ổn định, <code>ci-ok</code>, đừng đòi các job mang tên matrix.</li>
<li>Cổng cần <code>if: always()</code> và phải đọc kết quả: bị bỏ qua được tính là đạt.</li>
<li>Mã thoát quyết định; <code>| tee</code> che lỗi trừ khi shell có <code>pipefail</code>.</li>
<li>Test chập chờn báo cáo nhưng không chặn; phép kiểm chậm chạy ban đêm và sáng ra có người đọc.</li>
</ul>

${NGUON}
${lienKet({ khoa: 'git', bai: 'git-6-4-bao-ve-nhanh', title: 'Khoá Git — 6.4: bảo vệ nhánh, CODEOWNERS và check bắt buộc', sub: 'Ở đó: các luật — cấm push thẳng, review, CODEOWNERS. Ở đây: phía CI — một cổng thật sự đỏ.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'github-actions', bai: 'ga-14-1-cong-chat-luong', title: 'Khoá GitHub Actions — 14.1: cổng chất lượng', sub: 'Ở đó: đo trên năm pull request thật trên GitHub — job tổng hợp thiếu always() bị skip và được tính là đạt. Ở đây: cùng cái cổng đó cho một bộ test, bằng act.', cta: 'MỞ BÀI →' })}
${lienKet({ bai: 'swt301-ci-automation', title: 'Lý thuyết ở SWT301 — 8.6: “không merge khi đỏ”', sub: 'Giống: không ai merge khi đỏ. Sâu thêm ở đây: GitHub thi hành điều đó thế nào, và bốn đường code đỏ vẫn lọt.', cta: 'MỞ BÀI →' })}
</div>
`,
};
