// Lesson 10.2: are the characterization tests strong enough to refactor under? Plant 10 real changes in the
// LEGACY file, one at a time, and count how many turn the given test file red.
// node demo10/dac-ta/dot-bien-dac-ta.mjs <test file>
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const TEST = process.argv[2];
const FILE = 'demo10/legacy/monthlyReport.v0.js';
const MUTANTS = [
  ['b.seats > 30', 'b.seats >= 30', 'a 30-seat booking counts as large'],
  ["b.status != 'CANCELLED'", "b.status == 'CONFIRMED'", 'pending bookings disappear from the report'],
  ['day == 0 || day == 6', 'day == 6', 'Sunday is no longer a weekend'],
  ['hol.indexOf(b.date) != -1', 'hol.indexOf(b.date) > 0', 'the first holiday of the year is ignored'],
  ['Math.round(mins / 60 * 10) / 10', 'Math.round(mins / 60)', 'hours rounded to whole hours'],
  ["(b.status == 'PENDING' ? ' (pending)' : '')", "''", 'the (pending) mark is lost'],
  ['var m = d.getMonth() + 1;', 'var m = d.getMonth();', 'the report shows last month'],
  ["txt += 'No bookings.\\n';", "txt += 'No bookings this month.\\n';", 'the empty-month line changes (the office Excel import breaks)'],
  ['b.lab == lab && ', '', 'every lab is counted in every report'],
  ['mins = mins + t;', 'mins = t;', 'only the last booking counts toward the hours'],
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
console.log('\n' + killed + '/' + MUTANTS.length + ' changes caught by ' + TEST);
process.exitCode = killed === MUTANTS.length ? 0 : 1;
