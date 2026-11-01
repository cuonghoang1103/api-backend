// Lesson 10.4: how strong are the tests written in a 20-minute live-coding round? Six real bugs in busy.js.
// node demo10/phong-van/cham.mjs <test file>
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const TEST = process.argv[2];
const FILE = 'src/rules/busy.js';
const MUTANTS = [
  ['start <= last[1]', 'start < last[1]', 'touching bookings stay apart'],
  ['Math.max(last[1], end)', 'end', 'a booking inside another one cuts the block short'],
  ['.sort((a, b) => a[0] - b[0])', '', 'input order is trusted (no sort)'],
  ['a[0] - b[0]', 'a[1] - b[1]', 'sorted by end time instead of start'],
  ['ranges.map(', 'ranges.sort((a, b) => a.start.localeCompare(b.start)).map(', "the caller's array is reordered"],
  ['if (last && start <= last[1])', 'if (last && start <= last[1] && end > last[1])', 'a booking inside another one becomes its own block'],
];
let killed = 0;
const original = readFileSync(FILE, 'utf8');
for (const [i, [from, to, label]] of MUTANTS.entries()) {
  if (original.split(from).length !== 2) throw new Error('Mutant ' + (i + 1) + ': must appear exactly once');
  writeFileSync(FILE, original.replace(from, to));
  try {
    const dead = spawnSync('npx', ['vitest', 'run', TEST], { encoding: 'utf8', shell: process.platform === 'win32' }).status !== 0;
    if (dead) killed++;
    console.log((dead ? '✔ killed  ' : '✘ SURVIVED') + '  #' + (i + 1) + ' ' + label);
  } finally {
    writeFileSync(FILE, original);
  }
}
console.log('\n' + killed + '/' + MUTANTS.length + ' bugs caught by ' + TEST);
process.exitCode = killed === MUTANTS.length ? 0 : 1;
