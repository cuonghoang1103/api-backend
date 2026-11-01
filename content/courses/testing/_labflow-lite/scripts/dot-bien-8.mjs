// Lab 8 grader (Chapter 8). Two checks on ONE test file:
//   1. order: the file must stay green in 10 shuffled orders (a test that needs another test first is flaky);
//   2. strength: 8 planted bugs in src/rules/checkin.js, one at a time — each must turn the file red.
// Usage: node scripts/dot-bien-8.mjs [test file]   (default: src/rules/checkin.test.js)
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const TEST = process.argv[2] ?? 'src/rules/checkin.test.js';
const FILE = 'src/rules/checkin.js';
const MUTANTS = [
  ['if (t < start - EARLY)', 'if (t <= start - EARLY)', 'check-in refused exactly 10 minutes before the start'],
  ['if (t > start + GRACE)', 'if (t >= start + GRACE)', 'the 15th minute already counts as a no-show'],
  ['late: t > start', 'late: t >= start', 'arriving exactly on time is marked late'],
  ["booking.status !== 'CONFIRMED'", "booking.status === 'CANCELLED'", 'a PENDING booking can check in'],
  ['t - d < LOOKBACK_DAYS', 't - d <= LOOKBACK_DAYS', 'a no-show 30 days ago still counts'],
  ['recent.length < STRIKES', 'recent.length <= STRIKES', 'three no-shows are not enough for a ban'],
  ['Math.max(...recent)', 'Math.min(...recent)', 'the ban counts from the first no-show, not the last'],
  ['end < t ? null', 'end <= t ? null', 'the last day of the ban is no longer banned'],
];
const vitest = (...args) => spawnSync('npx', ['vitest', 'run', TEST, ...args], { encoding: 'utf8', shell: process.platform === 'win32' });

let green = 0;
for (let seed = 1; seed <= 10; seed++) if (vitest('--sequence.shuffle', '--sequence.seed=' + seed).status === 0) green++;
console.log((green === 10 ? '✔ ' : '✘ ') + 'green in ' + green + '/10 shuffled orders');

let killed = 0;
const original = readFileSync(FILE, 'utf8');
for (const [i, [from, to, label]] of MUTANTS.entries()) {
  if (original.split(from).length !== 2) throw new Error('Mutant ' + (i + 1) + ': must appear exactly once in ' + FILE);
  writeFileSync(FILE, original.replace(from, to));
  try {
    const dead = vitest().status !== 0;
    if (dead) killed++;
    console.log((dead ? '✔ killed  ' : '✘ SURVIVED') + '  #' + (i + 1) + ' ' + label);
  } finally {
    writeFileSync(FILE, original);
  }
}
console.log();
console.log(killed + '/' + MUTANTS.length + ' mutants killed');
process.exitCode = green === 10 && killed === MUTANTS.length ? 0 : 1;
