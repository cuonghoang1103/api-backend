// Runs cua-so.test.ts with Node's built-in test runner, twice: against the fixed version and against the buggy one.
// The TAP reporter prints durations that change on every run, so we keep only the stable lines (ok / not ok /
// expected / actual / the totals) — that is what a CI log shows you when a test goes red.
import { spawnSync } from 'node:child_process';

for (const ban of ['dung', 'loi']) {
  console.log(`$ ${ban === 'loi' ? 'BAN=loi ' : ''}node --test --test-reporter=tap cua-so.test.ts`);
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'cua-so.test.ts'], {
    cwd: import.meta.dirname, encoding: 'utf8', env: { ...process.env, BAN: ban, NODE_NO_WARNINGS: '1' },
  });
  const giu = r.stdout.split('\n').filter((l) =>
    /^(not )?ok \d+ - /.test(l) || /^\s+(expected|actual): /.test(l) || /^# (tests|pass|fail) /.test(l));
  for (const l of giu) console.log(l.replace(/^\s+/, '    '));
  console.log(`exit code ${r.status}\n`);
}
