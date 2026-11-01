// The final project grader (Chapter 11): US-11 "My bookings", 100 points.
//   node scripts/cham-cuoi-khoa.mjs                  → grades the files in place (yours)
//   node scripts/cham-cuoi-khoa.mjs --from <dir>     → first copies the deliverables found in <dir> into place
//                                                      (e.g. --from capstone/yeu: the weak first attempt of lesson 11.5)
// Needs Docker or TEST_DATABASE_URL (integration) and Chromium for Playwright. Every file is put back in `finally`.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { parse } from 'yaml';
import { MUTANTS } from '../capstone/mutants.mjs';
import { checkWorkflow } from '../src/ci/policy.js';
import { testsFromVitest, testsFromPlaywright, buildMatrix, traceGaps } from '../src/ci/rtm.js';

// Your deliverables: where they live → the file name looked for in --from <dir>.
const DELIVERABLES = {
  'src/rules/cancel.test.js': 'cancel.test.js',
  'src/booking/myBookings.test.js': 'myBookings.test.js',
  'src/api/myBookings.test.js': 'myBookings.api.test.js',
  'test/integration/myBookings.int.test.js': 'myBookings.int.test.js',
  'web/MyBookings.test.jsx': 'MyBookings.test.jsx',
  'e2e/huy-phong.spec.js': 'huy-phong.spec.js',
  'test-plan/TEST-PLAN.md': 'TEST-PLAN.md',
  '.github/workflows/test.yml': 'test.yml',
};
const LAYERS = [
  ['unit + API', ['vitest', 'run', 'src/rules/cancel.test.js', 'src/booking/myBookings.test.js', 'src/api/myBookings.test.js', '--reporter=json', '--outputFile=reports/cham-unit.json'], 'reports/cham-unit.json'],
  ['UI', ['vitest', 'run', '--config', 'vitest.web.config.js', 'web/MyBookings.test.jsx', '--reporter=json', '--outputFile=reports/cham-web.json'], 'reports/cham-web.json'],
  ['DB', ['vitest', 'run', '--config', 'vitest.integration.config.js', 'test/integration/myBookings.int.test.js', '--reporter=json', '--outputFile=reports/cham-int.json'], 'reports/cham-int.json'],
  ['E2E', ['playwright', 'test', 'e2e/huy-phong.spec.js', '--project=chromium', '--reporter=json'], 'reports/cham-e2e.json'],
];
const npx = (args) => spawnSync('npx', args, { encoding: 'utf8', env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: 'reports/cham-e2e.json' }, shell: process.platform === 'win32' });
const green = ([, args]) => npx(args).status === 0;

const fromDir = process.argv.includes('--from') ? process.argv[process.argv.indexOf('--from') + 1] : null;
const saved = new Map();
const score = [];
const add = (part, got, max, note) => { score.push([part, got, max]); console.log(String(got).padStart(3) + '/' + String(max).padEnd(3) + ' ' + part + (note ? ' — ' + note : '')); };

function swapIn() {
  if (!fromDir) return;
  for (const [target, name] of Object.entries(DELIVERABLES)) {
    const source = path.join(fromDir, name);
    if (!existsSync(source)) continue;
    saved.set(target, existsSync(target) ? readFileSync(target, 'utf8') : null);
    writeFileSync(target, readFileSync(source, 'utf8'));
  }
  console.log('Graded: the deliverables of ' + fromDir + ' (' + saved.size + ' files)\n');
}
function swapBack() { for (const [target, text] of saved) if (text !== null) writeFileSync(target, text); }

try {
  swapIn();

  // A. Your tests are green on the correct code: 5 points per layer.
  const reports = {};
  for (const layer of LAYERS) {
    const ok = green(layer);
    reports[layer[0]] = existsSync(layer[2]) ? JSON.parse(readFileSync(layer[2], 'utf8')) : null;
    add('A. green on the correct code: ' + layer[0], ok ? 5 : 0, 5);
  }

  // B. Twelve real bugs, one at a time: 3 points for each one your tests turn red (cheap layers first).
  let killed = 0;
  for (const [i, [file, from, to, label]] of MUTANTS.entries()) {
    const original = readFileSync(file, 'utf8');
    if (original.split(from).length !== 2) throw new Error('Mutant ' + (i + 1) + ': must appear exactly once in ' + file);
    writeFileSync(file, original.replace(from, to));
    let by = null;
    try {
      for (const layer of LAYERS) if (!green(layer)) { by = layer[0]; break; }
    } finally {
      writeFileSync(file, original);
    }
    if (by) killed++;
    console.log('      ' + (by ? '✔ killed by ' + by.padEnd(10) : '✘ SURVIVED          ') + ' #' + (i + 1) + ' ' + label);
  }
  add('B. bugs your tests catch', killed * 3, 36, killed + '/' + MUTANTS.length);

  // C. The suite's own quality bars: coverage thresholds, mutation score.
  add('C. coverage thresholds (npm run test:cov)', npx(['vitest', 'run', 'src/', '--coverage']).status === 0 ? 6 : 0, 6);
  add('C. mutation score ≥ break (npm run test:mutation)', npx(['stryker', 'run']).status === 0 ? 8 : 0, 8);

  // D. Traceability: US-11 AC1–AC6 and Lite-3, each proven by one of YOUR passing tests (High risk: above the Unit layer).
  const tests = [
    ...['unit + API', 'UI', 'DB'].flatMap((k) => (reports[k] ? testsFromVitest(reports[k], process.cwd()) : [])),
    ...(reports.E2E ? testsFromPlaywright(reports.E2E) : []),
  ];
  const all = JSON.parse(readFileSync('test-plan/requirements.json', 'utf8')).requirements;
  const story = all.filter((r) => r.id.startsWith('US-11') || r.id === 'Lite-3');
  const gaps = traceGaps(buildMatrix(story, tests));
  add('D. traceability of US-11 and Lite-3', Math.round((10 * (story.length - gaps.length)) / story.length), 10, gaps.length ? gaps.join('; ') : 'all ' + story.length + ' traced');

  // E. The test plan has the sections a reviewer looks for, and names every High-risk requirement in scope.
  const plan = existsSync('test-plan/TEST-PLAN.md') ? readFileSync('test-plan/TEST-PLAN.md', 'utf8') : '';
  const SECTIONS = ['Scope', 'Risks', 'Approach', 'Entry criteria', 'Exit criteria', 'Traceability', 'Definition of done'];
  const missing = SECTIONS.filter((s) => !new RegExp('^#{2,3} .*' + s, 'mi').test(plan));
  const high = all.filter((r) => r.inScope && r.risk === 'High').map((r) => r.id).filter((id) => !plan.includes(id));
  const planOk = SECTIONS.length - missing.length + (high.length ? 0 : 1);
  add('E. test plan', Math.round((10 * planOk) / (SECTIONS.length + 1)), 10,
    [missing.length ? 'missing: ' + missing.join(', ') : '', high.length ? 'High risks not named: ' + high.join(', ') : ''].filter(Boolean).join(' · '));

  // F. The pipeline: valid, safe (Lab 9 rules), and it runs mutation testing and the quality report as required checks.
  const yml = readFileSync('.github/workflows/test.yml', 'utf8');
  const lint = spawnSync('actionlint', ['.github/workflows/test.yml'], { encoding: 'utf8' });
  const lintOk = lint.status === 0;
  const policyOk = checkWorkflow(yml).every((r) => r.ok);
  const jobs = parse(yml).jobs ?? {};
  const gateNeeds = [jobs['ci-ok']?.needs ?? []].flat();
  const runsIn = (needle) => Object.entries(jobs).find(([, j]) => (j.steps ?? []).some((s) => String(s.run ?? '').includes(needle)));
  const mutationJob = runsIn('test:mutation');
  const reportJob = runsIn('ci-report.mjs');
  const reportStep = reportJob?.[1].steps.find((s) => String(s.run ?? '').includes('ci-report.mjs'));
  const f = (lint.error ? 0 : lintOk ? 2 : 0) + (policyOk ? 2 : 0) + (mutationJob && gateNeeds.includes(mutationJob[0]) ? 3 : 0) +
    (reportJob && gateNeeds.includes(reportJob[0]) && reportStep.shell === 'bash' ? 3 : 0);
  add('F. CI pipeline', f, 10, lint.error ? 'actionlint not installed (brew install actionlint)' : '');
} finally {
  swapBack();
}

const total = score.reduce((n, [, got]) => n + got, 0);
console.log('\nTotal: ' + total + '/100 — ' + (total >= 85 ? 'excellent' : total >= 70 ? 'pass' : 'not yet: read the lines with fewer points'));
process.exitCode = total >= 70 ? 0 : 1;
