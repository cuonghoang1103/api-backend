/**
 * tst-09-3 — Testing · Chapter 9 · Lesson 9.3 "Required checks and branch protection" (01/11/2026). Slug: tst-9-3-bat-buoc.
 * Slide 3–4: HÌNH MINH HOẠ dựng bằng HTML (ghi rõ trên slide), không phải ảnh chụp GitHub; nội dung theo tài liệu GitHub đọc 01/11/2026.
 * Output = chạy thật bằng act 0.2.94 (s09/_ma.mjs): act -l; ci-ok đỏ "unit: failure", naive-gate không xuất hiện; | tee ⇒ ✅ dù 1 test đỏ,
 * shell: bash ⇒ -o pipefail ⇒ ❌; quarantine đỏ 13/30; lần xanh ci-ok ✔ mà act exit 1; workflow đêm (schedule).
 */
import { lamDeck, sql, js, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-09-3', code: 'TST 9.3', title: 'Required checks and branch protection', sub: 'one gate that really fails' };

const yml = (src, o = {}) => sql(src, { lang: 'yaml', sm: true, ...o });

const CAI_DAT = `<div style="border:1.5px solid #d0d7de;border-radius:10px;padding:14px 18px;background:#f6f8fa;font-family:-apple-system,Arial;font-size:19px;color:#1f2328">
<div style="font-weight:700;font-size:21px;margin-bottom:8px">Branch protection rule · Branch name pattern: <code class="i">main</code></div>
<div>☑ <b>Require a pull request before merging</b></div>
<div>☑ <b>Require status checks to pass before merging</b></div>
<div style="margin-left:28px">☑ Require branches to be up to date before merging</div>
<div style="margin-left:28px;margin-top:6px">Status checks that are required: <span style="border:1px solid #d0d7de;border-radius:14px;padding:1px 10px;background:#fff">✓ ci-ok</span> <span style="color:#57606a">— GitHub Actions</span></div>
<div style="margin-top:6px">☐ Allow force pushes</div></div>`;
const HOP_MERGE = `<div style="border:1.5px solid #d0d7de;border-radius:10px;background:#fff;font-family:-apple-system,Arial;font-size:17px;color:#1f2328">
<div style="padding:8px 14px;border-bottom:1px solid #d0d7de">❌ tests / ci-ok (pull_request) <b style="background:#ddf4ff;border-radius:8px;padding:0 6px;font-size:14px">Required</b> — Do not merge — unit: failure, e2e: failure</div>
<div style="padding:8px 14px;border-bottom:1px solid #d0d7de">❌ tests / unit (Node 22) — Failing</div>
<div style="padding:8px 14px;border-bottom:1px solid #d0d7de">✅ tests / integration (PostgreSQL 17) — Successful</div>
<div style="padding:8px 14px;border-bottom:1px solid #d0d7de">❌ tests / quarantine (report only) — not required</div>
<div style="padding:10px 14px;color:#cf222e;font-weight:700">🚫 Merging is blocked — the required check “ci-ok” has not succeeded</div></div>`;
const TEN = `$ act -l -W .github/workflows/test.yml
Stage  Job ID       Job name                        …
0      integration  integration (PostgreSQL 17)     …
0      e2e          e2e (Chromium)                  …
0      quarantine   quarantine (report only)        …
0      unit         unit (Node \${{ matrix.node }})  …
1      ci-ok        ci-ok                           …`;
const CONG = `ci-ok:
  name: ci-ok
  if: always()        # run (and fail) when a need failed
  needs: [unit, integration, e2e]
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: every required job passed?
      env:
        NEEDS: \${{ toJSON(needs) }}
        REQUIRED: unit,integration,e2e
      run: node scripts/ci-gate.mjs`;
const GATE = `for (const job of required) {
  const result = needs[job]?.result;
  if (result === undefined) problems.push(job + ': not in needs');
  else if (result !== 'success') problems.push(job + ': ' + result);
}
return { ok: problems.length === 0, problems };`;
const DO = `$ git switch -q pr/30-cho && act pull_request -W demo9/wf/93-cong.yml …
[gate/unit    ]   ❌  Failure - Main npm run test:unit [1.861160666s]
[gate/unit    ] 🏁  Job failed
[gate/ci-ok     ]   | ✘ unit: failure
[gate/ci-ok     ]   ❗  ::error title=ci-ok::Do not merge — unit: failure
[gate/ci-ok     ] 🏁  Job failed
act exit: 1`;
const LOCAL = `$ NEEDS='{"unit":{"result":"success"},"integration":{"result":"skipped"},
         "e2e":{"result":"cancelled"}}' REQUIRED=unit,integration,e2e node scripts/ci-gate.mjs
✔ unit: success
✘ integration: skipped
✘ e2e: cancelled
::error title=ci-ok::Do not merge — integration: skipped, e2e: cancelled
[exit 1]`;
const TEE = `[gate/unit-tee]   🐳  docker exec cmd=[bash -e /var/run/act/workflow/3]
[gate/unit-tee]   |       Tests  1 failed | 173 passed (174)
[gate/unit-tee]   ✅  Success - Main npx vitest run src/ --reporter=dot | tee unit.log
[gate/unit-tee]   🐳  docker exec cmd=[bash --noprofile --norc -e -o pipefail …/4.sh]
[gate/unit-tee]   ❌  Failure - Main same command, shell bash (adds -o pipefail)
[gate/unit-tee] 🏁  Job failed`;
const FLAKY = `$ node scripts/lap-lai.mjs 30 test/quarantine --tagsFilter=quarantine
red in 13/30 runs (17.2 s)
$ act pull_request -e demo9/pr-event.json …
[tests/quarantine (report only)   ] 🏁  Job failed
[tests/unit (Node 22)-1           ] 🏁  Job succeeded
[tests/e2e (Chromium)             ] 🏁  Job succeeded
[tests/ci-ok                      ]   | ci-ok: every required job passed
[tests/ci-ok                      ] 🏁  Job succeeded
act exit: 1`;
const DEM = `$ act schedule -W .github/workflows/nightly.yml …
[nightly/unit, shuffled ×5 (flaky hunt) ]   |       Tests  175 passed (175)
[nightly/mutation (Stryker)             ]   | … Final mutation score of 98.73 is greater than …
[nightly/e2e (5 browsers and devices)   ]   ✅  Success - Main npx playwright install … [12m13.294186917s]
[nightly/e2e (5 browsers and devices)   ]   |   37 passed (12.6s)
act exit: 0
wall time: 806 s`;

export const slides = lamDeck({ chuong: 'Chapter 9 — Tests in CI', bai: '9.3' }, [
  { cover: true, t: 'Required checks and<br>branch protection', sub: 'Chapter 9 · Lesson 9.3 — a red check blocks nothing until a rule says it must pass' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Protect <b>main</b> so that red tests cannot be merged</li>
    <li>Require <b>one</b> gate job whose name never changes</li>
    <li>Make sure the gate really fails — skipped counts as passed</li>
    <li>Keep flaky tests from blocking the team</li>
    <li>Decide what runs per pull request and what runs at night</li></ul>` },
  { t: 'The rule lives on the branch', body: two(CAI_DAT,
      box('GitHub Docs (read 01/11/2026)', `Required checks “must have a <b>successful, skipped, or neutral</b> status”. Strict (default): the branch must be up to date with main. Rulesets “work alongside” branch protection; all applicable rules are enforced.`, 'lam'), 'r64') +
    box('Illustration', 'Drawn in HTML for this course — not a screenshot of GitHub. Settings cannot be measured with act; names, exit codes and needs can.', 'do2') },
  { t: 'From pull request to Merge button', body: flow([{ t: 'Pull request' }, { t: 'Jobs', s: 'unit · int · e2e' }, { t: 'Gate', s: 'ci-ok · always()', mau: '#b85a2b' }, { t: 'Rule on main', s: 'ci-ok must pass', mau: '#c0392b' }, { t: 'Merge', s: 'only when green', mau: '#2f7d4f' }], { h: 150, fs: 19 }) +
    HOP_MERGE + `<p class="nho">Illustration drawn in HTML (not a GitHub screenshot) — the red pull request of lesson 9.2.</p>` },
  { t: 'Names change; require one stable gate', body: two(vt(TEN, { title: 'terminal — act lists the jobs as written', fs: 14 }),
      box('One check per matrix leg', `On a run: ${c('unit (Node 22)')}, ${c('unit (Node 24)')}. Require them directly and every matrix change breaks the rule — a new leg is not required, a removed one is waited for forever.`, 'do2'), 'r64') +
    box('So', `Branch protection requires exactly one check: ${c('ci-ok')}. It needs all the others and decides. Its name is a plain string.`, 'xanh') },
  { t: 'The gate is code, with tests', body: two(yml(CONG, { hl: [3, 4, 10, 11] }),
      box('Why a script', `${c('decideMerge')} lives in ${c('src/ci/gate.js')} with 7 tests: failure, cancelled and skipped block; a job missing from needs blocks; a non-required job (quarantine) never does.`, 'lam'), 'r64') +
    js(GATE, { sm: true, hl: [4] }) },
  { t: 'Skipped counts as passed', body: vt(DO, { title: 'act — the 30-seat PR, two gates side by side', fs: 13 }) + vt(LOCAL, { title: 'terminal — the gate, every non-success result', fs: 13 }) +
    box('GitHub Docs: a job skipped by a conditional “reports Success”', `${c('naive-gate')} (no ${c('if: always()')}) is skipped when unit fails — act prints not a single line for it, GitHub shows “skipped”, and a rule requiring it lets the PR merge.`, 'do2') },
  { t: 'Exit codes: the pipe that hides a red test', body: vt(TEE, { title: 'act — the same tests, behind | tee, with and without pipefail', fs: 14 }) +
    two(box('bash -e', `Default shell (GitHub docs: ${c('bash -e {0}')}). A pipe returns the LAST command’s code — ${c('tee')} succeeded, so the step is ✅ with a red test.`, 'do2'),
      box('shell: bash', `${c('bash --noprofile --norc -eo pipefail {0}')} — any failing command fails the pipe. Our summary step pipes on purpose: it reports, it does not decide.`, 'xanh')) },
  { t: 'Flaky tests must not block anyone', body: vt(FLAKY, { title: 'terminal, then act on main — the quarantined race test of lesson 8.3', fs: 13.5 }) +
    two(box('Report, never block', `${c('continue-on-error: true')}, not in ci-ok’s needs. It reports on every PR; it returns to the gate after 0 red in 100 shuffled runs.`, 'xanh'),
      box('act ≠ GitHub here', `act exits 1 for any failed job. GitHub docs: job-level continue-on-error “prevents a workflow run from failing”. Read ci-ok, not act’s exit.`, 'lam')) },
  { t: 'Every pull request, or every night?', body: zm(`<table class="t"><tr><th>Check</th><th>When</th><th>Blocks?</th></tr>
    <tr><td>unit + web (22, 24), integration, e2e Chromium</td><td>every PR</td><td>yes, via ci-ok</td></tr>
    <tr><td>quarantine (known flaky)</td><td>every PR</td><td>no — report only</td></tr>
    <tr><td>mutation, 5 browsers and devices, shuffled ×5</td><td>nightly 20:00 UTC = 03:00 VN</td><td>no — read every morning</td></tr></table>`, 1.12) +
    vt(DEM, { title: 'act — the schedule event, played on demand', fs: 15 }) },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `In ${c('demo9/wf/th93.yml')}, write ${c('ci-ok')} with expressions only: run always, fail if any need did not succeed`,
      `Run it with act on ${c('main')}, then on ${c('pr/30-cho')}`,
      `Explain why ${c("contains(needs.*.result, 'skipped')")} belongs in the condition`,
    ]) + box('Measured', `main: ${c('ci-ok — every required job passed')}, act exit 0 · pr/30-cho: ${c('unit: failure')}, ci-ok Job failed, act exit 1.`, 'lam') +
    box('Done when', 'Green on main, red on the bug branch — and the skipped case is covered, not hoped for.', 'xanh') },
]);
