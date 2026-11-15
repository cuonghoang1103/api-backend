// git bisect = binary search over commits. This program builds a throw-away repo in $TMPDIR with 100 commits,
// commit #73 silently changes a timeout from 30 to 3, then lets `git bisect run` find it. Every line below the
// "$ git" prompts is git's REAL output (dates and names are fixed so the hashes are the same on every run).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'bisect-demo-'));
const repo = join(dir, 'repo');
const env = {
  ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1', LC_ALL: 'C',
  GIT_AUTHOR_NAME: 'Cuong', GIT_AUTHOR_EMAIL: 'cuong@example.com', GIT_COMMITTER_NAME: 'Cuong', GIT_COMMITTER_EMAIL: 'cuong@example.com',
};
const git = (...args: string[]) => execFileSync('git', args, { cwd: repo, env, encoding: 'utf8' });
try {
  execFileSync('git', ['init', '-q', '-b', 'main', repo], { env });
  for (let k = 1; k <= 100; k++) {
    const timeout = k >= 73 ? 3 : 30;                       // the regression lands in commit #73
    writeFileSync(join(repo, 'config.txt'), `version=${k}\ntimeout=${timeout}\n`);
    const date = `2026-11-01T${String(Math.floor(k / 60)).padStart(2, '0')}:${String(k % 60).padStart(2, '0')}:00Z`;
    execFileSync('git', ['add', 'config.txt'], { cwd: repo, env });
    execFileSync('git', ['commit', '-q', '-m', `commit #${k}`], { cwd: repo, env: { ...env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } });
  }
  // The "test": exit 0 = good, exit 1 = bad. It sits OUTSIDE the repo so every checkout sees the same test.
  // #region test
  writeFileSync(join(dir, 'test.sh'), 'grep -q "^timeout=30$" config.txt\n');
  // #endregion
  const first = git('rev-list', '--max-parents=0', 'HEAD').trim();
  // #region lenh
  console.log('$ git bisect start HEAD <commit #1>');
  console.log(git('bisect', 'start', 'HEAD', first).trim());
  console.log('$ git bisect run sh ../test.sh');
  console.log(git('bisect', 'run', 'sh', '../test.sh').trim());
  // #endregion
  const tested = git('bisect', 'log').split('\n').filter((l) => /^git bisect (good|bad) /.test(l)).length;
  console.log(`-- commits tested by bisect: ${tested}  (a linear walk #2, #3, ... would need 72 test runs)`);
  git('bisect', 'reset');
} finally {
  rmSync(dir, { recursive: true, force: true });
}
