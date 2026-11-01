// Which layer catches which bug? (lessons 11.1–11.3) Plants each of the 12 US-11 bugs of capstone/mutants.mjs, one at a time,
// and runs EVERY layer's US-11 tests against it — not stopping at the first red, so the table shows each layer's blind spots.
//   node scripts/ma-tran-bat-loi.mjs        (needs Docker or TEST_DATABASE_URL, and Chromium)
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { MUTANTS } from '../capstone/mutants.mjs';

const LAYERS = [
  ['Unit', ['vitest', 'run', 'src/rules/cancel.test.js', 'src/booking/myBookings.test.js']],
  ['API', ['vitest', 'run', 'src/api/myBookings.test.js']],
  ['UI', ['vitest', 'run', '--config', 'vitest.web.config.js', 'web/MyBookings.test.jsx']],
  ['DB', ['vitest', 'run', '--config', 'vitest.integration.config.js', 'test/integration/myBookings.int.test.js']],
  ['E2E', ['playwright', 'test', 'e2e/huy-phong.spec.js', '--project=chromium']],
];
const red = (args) => spawnSync('npx', args, { encoding: 'utf8', shell: process.platform === 'win32' }).status !== 0;

console.log('| # | Bug | ' + LAYERS.map(([l]) => l).join(' | ') + ' |');
console.log('|---|---|' + LAYERS.map(() => ':---:|').join(''));
const caught = Object.fromEntries(LAYERS.map(([l]) => [l, 0]));
for (const [i, [file, from, to, label]] of MUTANTS.entries()) {
  const original = readFileSync(file, 'utf8');
  if (original.split(from).length !== 2) throw new Error('Mutant ' + (i + 1) + ': must appear exactly once in ' + file);
  writeFileSync(file, original.replace(from, to));
  const cells = [];
  try {
    for (const [layer, args] of LAYERS) {
      const hit = red(args);
      if (hit) caught[layer]++;
      cells.push(hit ? '🔴' : '·');
    }
  } finally {
    writeFileSync(file, original);
  }
  console.log('| ' + (i + 1) + ' | ' + label + ' | ' + cells.join(' | ') + ' |');
}
console.log('| | **caught** | ' + LAYERS.map(([l]) => caught[l] + '/' + MUTANTS.length).join(' | ') + ' |');
