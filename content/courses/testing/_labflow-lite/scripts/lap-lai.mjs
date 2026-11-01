// Run the same Vitest command N times, each in a fresh process, and count the red runs (lesson 8.3).
// node scripts/lap-lai.mjs <N> <vitest args…>      e.g.  node scripts/lap-lai.mjs 20 demo8/thu-tu.test.js --sequence.shuffle
// With --sequence.shuffle, the seed of every red run is printed: re-run it with --sequence.seed=<seed> to see the same order again.
import { spawnSync } from 'node:child_process';

const [n, ...args] = process.argv.slice(2);
let red = 0;
const seeds = [];
const started = Date.now();
for (let i = 0; i < Number(n); i++) {
  const run = spawnSync('npx', ['vitest', 'run', ...args], { encoding: 'utf8', shell: process.platform === 'win32' });
  if (run.status !== 0) {
    red++;
    const seed = /seed "(\d+)"/.exec(run.stdout);
    if (seed) seeds.push(seed[1]);
  }
}
console.log('red in ' + red + '/' + n + ' runs (' + ((Date.now() - started) / 1000).toFixed(1) + ' s)');
if (seeds.length) console.log('seeds of red runs: ' + seeds.slice(0, 5).join(', ') + (seeds.length > 5 ? ', …' : ''));
