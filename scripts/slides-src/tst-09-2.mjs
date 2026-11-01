/**
 * tst-09-2 — Testing · Chapter 9 · Lesson 9.2 "Reports, annotations and artifacts" (01/11/2026). Slug: tst-9-2-bao-cao.
 * Output = chạy thật bằng act 0.2.94 trên PR pr/tin-ngan (s09/_ma.mjs): 3 job đỏ, ci-ok đỏ, 414 s; ::error annotation; Vitest summary;
 * flaky 2/6 lần "passed on retry"; tóm tắt sai "174 of 174" → "❌ 1 of 191"; JUnit 16 testcase; Playwright report 23 file (trace 131 KB);
 * act không có --artifact-server-path ⇒ ACTIONS_RUNTIME_TOKEN; tên trùng: act giữ bản Node 24, GitHub v4 từ chối (tài liệu).
 */
import { lamDeck, sql, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-09-2', code: 'TST 9.2', title: 'Reports, annotations and artifacts', sub: 'make a red run explain itself' };

const yml = (src, o = {}) => sql(src, { lang: 'yaml', sm: true, ...o });

const TONG = `$ git switch -q pr/tin-ngan && act pull_request -e demo9/pr-event.json …
[tests/quarantine (report only)   ] 🏁  Job failed
[tests/integration (PostgreSQL 17)] 🏁  Job succeeded
[tests/unit (Node 22)-1           ] 🏁  Job failed
[tests/unit (Node 24)-2           ] 🏁  Job failed
[tests/e2e (Chromium)             ] 🏁  Job failed
[tests/ci-ok                      ] 🏁  Job failed
act exit: 1
wall time: 414 s`;
const STEPS = `- name: unit tests + coverage
  run: >-
    npx vitest run src/ --coverage
    --reporter=tree --reporter=github-actions
    --reporter=junit --outputFile.junit=reports/junit-unit.xml
    --reporter=json --outputFile.json=reports/unit.json
- name: summary
  if: \${{ !cancelled() }}
  run: node scripts/ci-summary.mjs "unit (Node …)"
    reports/unit.json,reports/web.json coverage/coverage-summary.json
    | tee -a "$GITHUB_STEP_SUMMARY"`;
const WEB = `   × sends what the user typed, once, and says it is booked 546ms
Expected element to have text content:
  Booked. See you in BE-201.
Received:
  Booked.
 ❯ web/BookingForm.test.jsx:28:47
❗  ::error file=…/web/BookingForm.test.jsx,title=…,line=28,column=47::Error: …
❌  Failure - Main web tests [4.883659333s]
⚙  Summary - ## Vitest Test Report`;
const GH = `## Vitest Test Report
### Summary
- **Test Files**: ❌ **1 failure** · ✅ **1 pass** · 2 total
- **Test Results**: ❌ **1 failure** · ✅ **15 passes** · 16 total`;
const FLAKY = `$ for i in 1 2 3 4 5 6; do … npx vitest run demo8/dua-lech.test.js --retry=2 …
run 1: exit 0, 0 test(s) passed on retry
run 2: exit 0, 0 test(s) passed on retry
run 3: exit 0, 0 test(s) passed on retry
run 4: exit 0, 1 test(s) passed on retry
run 5: exit 0, 0 test(s) passed on retry
run 6: exit 0, 1 test(s) passed on retry
### Flaky Tests
- \`two students book the same slot at once: exactly one wins\`
  (passed on retry 1 out of 2)`;
const SAI = `## unit (Node 22)
### ✅ 174 of 174 tests passed
| lines | 98.96% | 85% | ✅ |`;
const DUNG = `## unit (Node 22)
### ❌ 1 of 191 tests failed
- \`web/BookingForm.test.jsx\` › BookingForm sends what the user typed,
  once, and says it is booked — Error: expect(element).toHaveTextContent()
| lines | 98.97% | 85% | ✅ |`;
const E2E = `✘  10 [chromium] › e2e/dat-phong.spec.js:8:3 › … (retry #1) (5.4s)
✘  11 [chromium] › e2e/dat-phong.spec.js:8:3 › … (retry #2) (5.2s)
    Received: "Booked."
  1 failed
  8 passed (21.5s)
❌  Failure - Main npm run test:e2e [22.31516425s]
| Artifact playwright-report.zip successfully finalized. …
$ unzip -l .act/artifacts/1/playwright-report/playwright-report.zip
   131437  …  data/4e3e8ea0de29f774c01a3adc069ffb1d1d53d4fb.zip
     3236  …  data/7b92e3650159fb602663235272fdc5814de6aca3.md
     3236  …  data/bc74ace8a1cfeccb737f0ff2ef39149036bf73e8.md
     3236  …  data/d0ce91418c88581d4c699fb65ad7a89d59432ccd.md
   531320  …  index.html
  2054453                     23 files`;
const KHONG = `$ act push -W demo9/wf/92-artifact-trung.yml -j report
[artifacts/report (Node 22)-1]   ❗  ::error::Unable to get the ACTIONS_RUNTIME_TOKEN env variable
[artifacts/report (Node 22)-1]   ❌  Failure - Main actions/upload-artifact@v4
act exit: 1`;
const TRUNG = `$ act push -W demo9/wf/92-artifact-trung.yml --artifact-server-path .act/artifacts
[artifacts/report (Node 22)-1]   ✅  Success - Main actions/upload-artifact@v4
[artifacts/report (Node 24)-2]   ✅  Success - Main actions/upload-artifact@v4
act exit: 0
$ unzip -p .act/artifacts/1/reports/reports.zip result.txt
tests on Node 24`;

export const slides = lamDeck({ chuong: 'Chapter 9 — Tests in CI', bai: '9.2' }, [
  { cover: true, t: 'Reports, annotations<br>and artifacts', sub: 'Chapter 9 · Lesson 9.2 — one real red pull request, made to explain itself' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Read a red CI run in the right order, fast</li>
    <li>Pick reporters for people, for GitHub and for tools</li>
    <li>Write a job summary that does not lie — and test it</li>
    <li>Keep the evidence: Playwright report, trace, coverage</li>
    <li>Know what act does differently with artifacts</li></ul>` },
  { t: 'The pull request: “Shorter booking confirmation”', body: vt(TONG, { title: 'act — the whole workflow on the PR branch', fs: 16 }) +
    two(box('One line changed', `${c("'Booked. See you in ' + lab + '.'")} became ${c("'Booked.'")} — reads harmless. Three jobs and the gate disagree.`, 'lam'),
      box('Not this PR’s fault', 'Quarantine is red too: report-only, known flaky, never blocks (lesson 9.3).', 'xanh')) },
  { t: 'Read a red run in order', to: true, giua: true, body: flow([{ t: 'Which job?', s: 'ci-ok says' }, { t: 'Which step?', s: 'first ❌' }, { t: 'Which test?', s: 'FAIL · file:line', mau: '#c0392b' }, { t: 'What did it see?', s: 'the artifact', mau: '#b85a2b' }, { t: 'Reproduce', s: 'same command', mau: '#2f7d4f' }], { h: 210, fs: 22 }) +
    two(box('Everything after the first ❌ is a consequence', 'Skipped steps, a failed upload, a red gate: read them last. The first failed step holds the cause.', 'do2'),
      box('Why it matters', 'The reader is rarely the author. Fast diagnosis keeps people from pressing re-run and hoping (lesson 8.3).', 'xanh')) },
  { t: 'Reporters: people, GitHub, tools', body: two(zm(yml(STEPS, { hl: [4, 5, 6, 8] }), 1.12),
      zm(`<table class="t"><tr><th>Reporter</th><th>For</th></tr>
      <tr><td>tree</td><td>a person reading the log</td></tr>
      <tr><td>github-actions</td><td>annotations + Vitest’s job summary</td></tr>
      <tr><td>junit</td><td>Jenkins, GitLab, report actions</td></tr>
      <tr><td>json</td><td>our own summary script</td></tr>
      <tr><td>Playwright html</td><td>a person, after download</td></tr></table>`, 1.15), 'r64') },
  { t: 'Annotations and Vitest’s summary', body: vt(WEB, { title: 'act — the web step of unit (Node 22)', fs: 13 }) +
    two(vt(GH, { title: 'local — GITHUB_STEP_SUMMARY written by the github-actions reporter', fs: 12.5 }),
      box('On GitHub (docs)', `${c('::error file=…,line=28')} becomes a red mark on line 28 in “Files changed”. act prints it with ❗ — and the first line of the summary.`, 'lam'), 'r64') },
  { t: 'The summary also reports flaky tests', body: vt(FLAKY, { title: 'local — the race test of lesson 8.3, retry=2, six runs', fs: 14 }) +
    two(box('Exit 0, six times', 'Every run is green. Two of them needed a retry. Without the summary nobody would know.', 'do2'),
      box('Lesson 8.3, finished', 'A retry is a report, not a fix — here is the report: test name, “passed on retry 1 out of 2”.', 'xanh')) },
  { t: 'A summary that lied', body: vt(SAI, { title: 'first version — reads only unit.json', fs: 15 }) + vt(DUNG, { title: 'fixed — mergeReports(unit + web), same pull request', fs: 15 }) +
    two(box('174 of 174 — on a red run', 'The web tests were red. The summary only knew the report it was given. A summary is a claim about the run.', 'do2'),
      box('So it has tests', `${c('src/ci/summary.js')} + ${c('summary.test.js')}: headline, failed list, coverage vs thresholds, merged reports. And ${c('if: ${{ !cancelled() }}')} so it runs when tests fail.`, 'xanh')) },
  { t: 'Artifacts: keep the evidence', body: vt(E2E, { title: 'act — the e2e job, then the uploaded report', fs: 12.5 }) +
    box('Inside the zip', `${c('index.html')} the report · ${c('data/*.zip')} the trace (retry #1, 131 KB) · ${c('data/*.md')} three error contexts. ${c('npx playwright show-report')} / ${c('show-trace')}.`, 'lam') },
  { t: 'act and artifacts', body: vt(KHONG, { title: 'act — no --artifact-server-path', fs: 13 }) + vt(TRUNG, { title: 'act — two matrix legs, one artifact name', fs: 13 }) +
    two(box('act kept one, silently', 'Both uploads “succeeded”; only Node 24’s file is left.', 'do2'),
      box('GitHub v4 refuses (README, 01/11/2026)', `“uploading to the same artifact via multiple jobs is not supported”. Name it ${c('unit-reports-node${{ matrix.node }}')}.`, 'lam')) },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `You have only ${c('playwright-report.zip')} — no log, no code`,
      'Which test failed, at which line?',
      'What did the page show, and how many attempts were made?',
    ]) + box('Measured', `test at ${c('dat-phong.spec.js:8')}, expect on line 12 · page snapshot ${c('status: Booked.')} · three error contexts = first try + two retries.`, 'lam') +
    box('Done when', 'Every answer comes from a file in the zip — and you can say why only the retry has a trace.', 'xanh') },
]);
