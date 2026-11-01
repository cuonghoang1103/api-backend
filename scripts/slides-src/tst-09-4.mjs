/**
 * tst-09-4 — Testing · Chapter 9 · Lesson 9.4 "Matrix and sharding in CI" (01/11/2026). Slug: tst-9-4-ma-tran.
 * Output = chạy thật bằng act 0.2.94 (s09/_ma.mjs): Node 20.20.2 4 failed (Promise.withResolvers / Set.prototype.intersection trong MSW 3),
 * 66 EBADENGINE, Node 22/24 116 passed; act không huỷ nhánh Node 24 (GitHub huỷ — tài liệu); shard 5.71/1.18/3.72 → 3.69/3.70/3.19 s;
 * CI 3 shard + gộp 147 s so với một job 36 s; thực hành 2 shard 6.28 → 5.67 s.
 */
import { lamDeck, sql, js, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-09-4', code: 'TST 9.4', title: 'Matrix and sharding in CI', sub: 'many versions, many machines — measured' };

const yml = (src, o = {}) => sql(src, { lang: 'yaml', sm: true, ...o });

const MT = `strategy:
  fail-fast: false          # see every version
  matrix:
    node: [20, 22, 24]
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: \${{ matrix.node }}
      cache: npm`;
const KQ = `[tests/unit (Node 22)-2]   |       Tests  116 passed (116)
[tests/unit (Node 20)-1]   | v20.20.2
[tests/unit (Node 20)-1]   | Caused by: TypeError: Promise.withResolvers is not a function
[tests/unit (Node 20)-1]   | TypeError: currentHandlers.intersection is not a function …
[tests/unit (Node 20)-1]   |       Tests  4 failed | 112 passed (116)
[tests/unit (Node 24)-3]   | v24.22.2
[tests/unit (Node 24)-3]   |       Tests  116 passed (116)`;
const ENGINE = `[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@asamuzakjp/css-color@7.1.9',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.22.2 || ^24.15.0 || >=26.0.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
…
[tests/unit (Node 20)-1]   ✅  Success - Main npm ci [13.610046708s]`;
const THU_TU = `[tests/unit (Node 20)-1]   ✅  Success - Main actions/setup-node@v4 [1m52.527816167s]
[tests/unit (Node 20)-1]   ❌  Failure - Main npm run test:unit [1.399499667s]
[tests/unit (Node 20)-1] 🏁  Job failed
[tests/unit (Node 24)-3]   ✅  Success - Main actions/setup-node@v4 [2m25.975465917s]
[tests/unit (Node 24)-3]   ✅  Success - Main npm run test:unit [1.113110083s]
[tests/unit (Node 24)-3] 🏁  Job failed`;
const VITEST = `$ for i in 1 2 3; do npx vitest run demo9/cham --shard=$i/3 --no-file-parallelism …
 ✓ demo9/cham/a.test.js (1 test) 3004ms
 ✓ demo9/cham/d.test.js (1 test) 2503ms
   Duration  5.71s (tests 100%)
 ✓ demo9/cham/b.test.js (1 test) 503ms
 ✓ demo9/cham/c.test.js (1 test) 503ms
   Duration  1.18s (tests 98%, import 1%)
 ✓ demo9/cham/f.test.js (1 test) 3003ms
 ✓ demo9/cham/e.test.js (1 test) 503ms
   Duration  3.72s (tests 99%, import 1%)`;
const TA = `$ for i in 1 2 3; do node scripts/shard.mjs $i/3 … | xargs npx vitest run …
 ✓ demo9/cham/a.test.js (1 test) 3005ms
 ✓ demo9/cham/e.test.js (1 test) 504ms
   Duration  3.69s (tests 99%)
 ✓ demo9/cham/f.test.js (1 test) 3005ms
 ✓ demo9/cham/b.test.js (1 test) 504ms
   Duration  3.70s (tests 99%)
 ✓ demo9/cham/d.test.js (1 test) 2503ms
 ✓ demo9/cham/c.test.js (1 test) 504ms
   Duration  3.19s (tests 99%)`;
const SPLIT = `const order = [...files].sort((a, b) => cost(b) - cost(a) || a.localeCompare(b));
for (const file of order) {
  const lightest = shards.reduce((min, s) => (s.ms < min.ms ? s : min));
  lightest.files.push(file);
  lightest.ms += cost(file);
}`;
const CI = `[shards/slow suite (shard 1/3)-1]   ✅  Success - Main npm ci [33.720546375s]
[shards/slow suite (shard 3/3)-3]   ✅  Success - Main npm ci [38.212863875s]
[shards/slow suite (shard 2/3)-2]   ✅  Success - Main npm ci [40.565853333s]
[shards/slow suite (shard 1/3)-1]   ✅  Success - Main tests of this shard [6.232182208s]
[shards/slow suite (merged report)]   |       Tests  6 passed (6)
[shards/slow suite (merged report)]   |    Per blob  4.02s 3.91s 3.50s
act exit: 0
wall time: 147 s
$ act push -W demo9/wf/94-mot-job.yml …
[shards/slow suite (one job)] 🏁  Job succeeded
wall time: 36 s`;
const CONC = `concurrency:
  group: tests-\${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: \${{ github.event_name == 'pull_request' }}`;

export const slides = lamDeck({ chuong: 'Chapter 9 — Tests in CI', bai: '9.4' }, [
  { cover: true, t: 'Matrix and sharding<br>in CI', sub: 'Chapter 9 · Lesson 9.4 — a real Node 20 break, and a split that made CI slower' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Run the same tests on several Node versions and read what differs</li>
    <li>Decide which versions to support — and write it in <b>engines</b></li>
    <li>Choose <b>fail-fast</b> and <b>continue-on-error</b> on purpose</li>
    <li>Split a slow suite into shards balanced by time, merge the reports</li>
    <li>Know when sharding costs more than it saves</li></ul>` },
  { t: 'A matrix of Node versions', body: two(yml(MT, { hl: [2, 4, 8] }),
      box('Not our code', 'MSW 3 (the fake e-mail provider of lesson 3.2) calls Promise.withResolvers and Set.prototype.intersection — Node 22+ only. 4 mailer tests fail on Node 20; one run shows the exact line.', 'do2'), 'r64') +
    vt(KQ, { title: 'act — the unit job on 20, 22, 24', fs: 14 }) },
  { t: 'EBADENGINE is only a warning', body: vt(ENGINE, { title: 'act — npm ci on Node 20: 66 warnings like this, then exit 0', fs: 13.5 }) +
    two(box('Decide, then write it down', `nodejs.org lists Node.js 20 as end-of-life (01/11/2026). Vitest 5 declares ${c('^22.12.0 || ^24.0.0 || >=26.0.0')}. LabFlow Lite: ${c('"engines": { "node": ">=22.12" }')}, matrix ${c('[22, 24]')}.`, 'lam'),
      box('Kept in agreement by a test', `${c('src/ci/workflow.test.js')} checks that engines and the matrix say the same thing.`, 'xanh')) },
  { t: 'fail-fast: GitHub cancels, act does not', body: vt(THU_TU, { title: 'act — the same run, in order (fail-fast left at its default)', fs: 13 }) +
    two(box('GitHub Docs (01/11/2026)', `fail-fast “defaults to true”; GitHub “will cancel all in-progress and queued jobs in the matrix if any job in the matrix fails”.`, 'lam'),
      box('So', `Compatibility matrix: ${c('fail-fast: false')} — you want every answer. act even labels the green Node 24 leg “Job failed”: it reports the matrix as one job.`, 'xanh')) +
    box('Never on the whole matrix', `${c('continue-on-error: true')} turns every red leg green. Mark one experimental leg: ${c('continue-on-error: ${{ matrix.experimental == true }}')}.`, 'do2') },
  { t: 'Vitest --shard splits by file', body: vt(VITEST, { title: 'local — 6 slow files, 10.56 s one after another', fs: 15 }) +
    box('The run waits for the slowest shard', `Shard 1 got both big files (3 s + 2.5 s): 5.71 s. Shard 2: 1.18 s. Vitest’s ${c('--shard=i/n')} does not know how long a file takes.`, 'do2') },
  { t: 'Split by time: longest first, lightest shard', body: vt(TA, { title: 'local — timing-balanced (src/ci/shard.js)', fs: 12.5 }) + js(SPLIT, { sm: true, hl: [1, 3] }) +
    box('Same split on every machine', `Timings from an earlier JSON report; ties broken by file name, so every CI machine computes the same shards.`, 'lam') },
  { t: 'Shards in CI: blob reports, one merge', body: flow([{ t: 'Timings', s: 'JSON report' }, { t: 'Split', s: 'shard.mjs i/n' }, { t: '3 jobs', s: 'blob each' }, { t: 'Artifacts', s: 'blob-1…3' }, { t: 'Merge', s: '--merge-reports', mau: '#2f7d4f' }], { h: 130, fs: 19 }) +
    vt(CI, { title: 'act — 3 shard jobs + merge job, then one job', fs: 12.5 }) },
  { t: '36 seconds vs 147: when sharding pays', body: zm(`<table class="t"><tr><th>Measured</th><th>Slowest shard</th><th>Whole run (act)</th></tr>
    <tr><td>One job, files in sequence</td><td>—</td><td><b>36 s</b></td></tr>
    <tr><td>Vitest --shard=i/3 (local)</td><td>5.71 s</td><td>—</td></tr>
    <tr><td>Timing-balanced, 3 shards (local)</td><td>3.70 s</td><td>—</td></tr>
    <tr><td>3 shard jobs + merge job (act)</td><td>4.01 s</td><td><b>147 s</b></td></tr></table>`, 1.0) +
    two(box('Each shard is a new machine', `checkout + Node + ${c('npm ci')} (34–41 s here) per shard, plus a merge job. Shard only when tests dwarf that setup.`, 'do2'),
      box('Playwright, same arithmetic', 'e2e: 3.7 s of tests after a 5-minute browser install. Two shards would pay the install twice. Measure first (8.4), shard last.', 'lam')) },
  { t: 'concurrency: cancel outdated runs', body: yml(CONC, { hl: [3] }) +
    two(box('Pull requests', 'Three pushes in a minute ⇒ only the newest run continues; the older ones are cancelled (GitHub Docs pattern: github.head_ref || github.run_id).', 'xanh'),
      box('Not on main, not measurable here', 'A run on main is the record of what was merged — let it finish. act accepts the key; one laptop has no second run to cancel: documentation only.', 'lam')) },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `Split ${c('demo9/cham')} into <b>two</b> shards with Vitest’s ${c('--shard')}`,
      `Split it again with ${c('scripts/shard.mjs i/2')}`,
      'Which is faster, by how much — and what is the best possible slowest shard?',
    ]) + box('Measured', 'Vitest 6.28 / 4.26 s · by time 5.67 / 4.85 s · best possible 5.5 s (the two 3 s files cannot share a shard).', 'lam') +
    box('Done when', `You have both measurements and can say why the timings file must be refreshed when tests are added (${c('UNKNOWN_MS')} = 1 s).`, 'xanh') },
]);
