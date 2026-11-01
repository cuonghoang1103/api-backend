// Lab 10 grader (Chapter 10). Your tests are run against code you did not write:
//   1. the characterization tests of clubFee: green on the ORIGINAL v0 (lab10/clubFee.v0.js) and on your refactored version;
//   2. the tests of weeklyDates (BR-10): green on the team's reference (lab10/recurring.ref.js);
//   3. eight planted bugs — four in v0, four in the reference — one at a time: each must turn your tests red.
// Your own files are put back after every run (finally), even if you stop the script.
// Usage: node scripts/dot-bien-10.mjs [recurring test] [clubFee test]
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const REC_TEST = process.argv[2] ?? 'src/rules/recurring.test.js';
const FEE_TEST = process.argv[3] ?? 'src/legacy/clubFee.test.js';
const TARGETS = [
  { file: 'src/legacy/clubFee.js', reference: 'lab10/clubFee.v0.js', test: FEE_TEST, mutants: [
    ['if (seats > 40)', 'if (seats >= 40)', 'an event for exactly 40 seats pays the big-event fee'],
    ['if (hrs >= 4)', 'if (hrs > 4)', 'a 4-hour event loses its long-event discount'],
    ['Math.round(price / 1000)', 'Math.floor(price / 1000)', 'prices are rounded down instead of to the nearest 1,000'],
    ['today.getDay() == 0 || ', '', 'Sunday is no longer charged the weekend rate'],
  ] },
  { file: 'src/rules/recurring.js', reference: 'lab10/recurring.ref.js', test: REC_TEST, mutants: [
    ['toDay(firstDate) + 7 * i', 'toDay(firstDate) + 7 * (i + 1)', 'the series starts one week late'],
    ['weeks > MAX_WEEKS', 'weeks >= MAX_WEEKS', 'a 15-week series is refused'],
    ['if (toDay(date) > toDay(until))', 'if (toDay(date) >= toDay(until))', 'a class on the last day of term is dropped'],
    ['else if (holidays.includes(date))', 'else if (false)', 'a class is booked on a holiday'],
  ] },
];
const green = (test) => spawnSync('npx', ['vitest', 'run', test], { encoding: 'utf8', shell: process.platform === 'win32' }).status === 0;

// Run `test` with `code` in place of `file`; always put the learner's file back.
function withCode(file, code, test) {
  const mine = readFileSync(file, 'utf8');
  writeFileSync(file, code);
  try { return green(test); } finally { writeFileSync(file, mine); }
}

let ok = true;
for (const t of TARGETS) {
  const pass = withCode(t.file, readFileSync(t.reference, 'utf8'), t.test);
  console.log((pass ? '✔ ' : '✘ ') + t.test + ' is green on ' + t.reference);
  ok &&= pass;
}
const mine = green(FEE_TEST);
console.log((mine ? '✔ ' : '✘ ') + FEE_TEST + ' is green on your src/legacy/clubFee.js (after your refactor)');
ok &&= mine;

let killed = 0, n = 0;
for (const t of TARGETS) {
  const ref = readFileSync(t.reference, 'utf8');
  for (const [from, to, label] of t.mutants) {
    n++;
    if (ref.split(from).length !== 2) throw new Error('Mutant ' + n + ': must appear exactly once in ' + t.reference);
    const dead = !withCode(t.file, ref.replace(from, to), t.test);
    if (dead) killed++;
    console.log((dead ? '✔ killed  ' : '✘ SURVIVED') + '  #' + n + ' ' + label);
  }
}
console.log('\n' + killed + '/' + n + ' mutants killed');
process.exitCode = ok && killed === n ? 0 : 1;
