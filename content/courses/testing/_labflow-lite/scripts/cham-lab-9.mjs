// Lab 9 grader (Chapter 9). Usage:
//   node scripts/cham-lab-9.mjs [workflow]          static: actionlint + the 8 rules of src/ci/policy.js (seconds)
//   node scripts/cham-lab-9.mjs [workflow] --act    + two real runs with act (Docker, ~10 minutes):
//        1. the code as it is      → every job ci-ok needs, and ci-ok itself, must succeed
//        2. a planted bug (30 seats need approval) → ci-ok must FAIL, so the pull request cannot merge
// Default workflow: lab9/ci.yml. The bug is always removed again (finally), even if you press Ctrl+C during act.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { checkWorkflow } from '../src/ci/policy.js';

const args = process.argv.slice(2);
const WF = args.find((a) => !a.startsWith('--')) ?? 'lab9/ci.yml';
const WITH_ACT = args.includes('--act');
let ok = true;
const mark = (pass, text) => { console.log((pass ? '✔ ' : '✘ ') + text); if (!pass) ok = false; };

// 1. actionlint: is it a valid workflow at all?
const lint = spawnSync('actionlint', ['-oneline', WF], { encoding: 'utf8' });
if (lint.error) { console.log('✘ actionlint not found — install it (lesson 9.1)'); process.exit(1); }
const problems = lint.stdout.split('\n').filter(Boolean);
mark(problems.length === 0, 'actionlint: ' + problems.length + ' problem(s)');
for (const p of problems) console.log('    ' + p);

// 2. the rules: is it a SAFE workflow?
const rules = checkWorkflow(readFileSync(WF, 'utf8'));
for (const r of rules) mark(r.ok, r.id + ' ' + r.title + (r.ok ? '' : ' — ' + r.why));
console.log(rules.filter((r) => r.ok).length + '/' + rules.length + ' rules');

// 3. act: does it really go green — and really go red?
function act(label) {
  const res = spawnSync('act', ['pull_request', '-W', WF, '-e', 'demo9/pr-event.json',
    '--cache-server-path', '.act/cache', '--artifact-server-path', '.act/artifacts'], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  const out = (res.stdout + res.stderr).replace(/\x1b\[[0-9;]*m/g, '');
  const jobs = {};
  for (const m of out.matchAll(/^\[[^/\]]+\/([^\]]+?)\s*\] 🏁 {2}Job (succeeded|failed)/gm)) jobs[m[1].replace(/-\d+$/, '')] = jobs[m[1].replace(/-\d+$/, '')] === 'failed' ? 'failed' : m[2];
  console.log('  ' + label + ': act exit ' + res.status + ' · ' + Object.entries(jobs).map(([j, s]) => j + ' ' + s).join(' · '));
  return { status: res.status, jobs };
}
if (WITH_ACT && ok) {
  const green = act('real code');
  mark(green.jobs['ci-ok'] === 'succeeded', 'act, real code: ci-ok succeeded');
  const FILE = 'src/rules/booking.js';
  const original = readFileSync(FILE, 'utf8');
  writeFileSync(FILE, original.replace('return seats > APPROVAL_SEATS;', 'return seats >= APPROVAL_SEATS;'));
  try {
    const red = act('planted bug (30 seats need approval)');
    mark(red.jobs['ci-ok'] === 'failed' && red.status !== 0, 'act, planted bug: ci-ok failed — the pull request is blocked');
  } finally {
    writeFileSync(FILE, original);
  }
} else if (WITH_ACT) {
  console.log('… act runs skipped: fix the static problems first');
}
console.log(ok ? '\nLab 9: PASS' : '\nLab 9: not yet');
process.exitCode = ok ? 0 : 1;
