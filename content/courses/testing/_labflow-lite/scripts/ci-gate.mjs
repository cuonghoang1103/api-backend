// ci-ok gate (lesson 9.3). Runs as the last job of .github/workflows/test.yml:
//   NEEDS='${{ toJSON(needs) }}'  REQUIRED=unit,integration,e2e  node scripts/ci-gate.mjs
import { decideMerge } from '../src/ci/gate.js';

const needs = JSON.parse(process.env.NEEDS ?? '{}');
const required = (process.env.REQUIRED ?? '').split(',').map((s) => s.trim()).filter(Boolean);
if (required.length === 0) {
  console.log('::error title=ci-ok::REQUIRED is empty — list the jobs that must pass');
  process.exit(1);
}
for (const job of required) console.log((needs[job]?.result === 'success' ? '✔ ' : '✘ ') + job + ': ' + (needs[job]?.result ?? 'not in needs'));
const { ok, problems } = decideMerge(needs, required);
if (!ok) {
  console.log('::error title=ci-ok::Do not merge — ' + problems.join(', '));
  process.exit(1);
}
console.log('ci-ok: every required job passed');
