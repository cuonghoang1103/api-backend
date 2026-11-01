// Lesson 10.3: the same five changes against the test file as submitted and as reviewed.
// A bug should turn a file red; a harmless refactor should leave it green.
// node demo10/review/so-sanh.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const FILES = ['demo10/review/pr57.test.js', 'demo10/review/pr57-sau-review.test.js'];
const CHANGES = [
  ['bug', 'src/booking/waitlistService.js', 'if (offer) {', 'if (false) {', 'nobody is e-mailed'],
  ['bug', 'src/rules/waitlist.js', 'const [first, ...rest] = queue;', 'const [first, ...rest] = [...queue].reverse();', 'the slot goes to the last in line'],
  ['bug', 'src/rules/waitlist.js', 'queue.length >= WAITLIST_MAX', 'queue.length > WAITLIST_MAX', 'a fourth student can wait'],
  ['harmless', 'src/booking/service.js', 'repo.insert({ ...input, minutes: slot.minutes, status })', "repo.insert({ ...input, minutes: slot.minutes, status, source: 'web' })", 'bookings also store where they came from'],
  ['harmless', 'src/booking/waitlistService.js', 'waitlists.set(key, queue);', 'if (offer) waitlists.set(key, queue);', 'the waitlist Map is written only when it changed'],
];
const red = (file) => spawnSync('npx', ['vitest', 'run', file], { encoding: 'utf8', shell: process.platform === 'win32' }).status !== 0;
const score = FILES.map(() => 0);
for (const [kind, file, from, to, label] of CHANGES) {
  const original = readFileSync(file, 'utf8');
  if (original.split(from).length !== 2) throw new Error('"' + from + '" must appear exactly once in ' + file);
  writeFileSync(file, original.replace(from, to));
  try {
    const cells = FILES.map((f, i) => {
      const r = red(f);
      const right = kind === 'bug' ? r : !r;
      if (right) score[i]++;
      return (r ? 'red  ' : 'green') + (right ? ' ✔' : ' ✘');
    });
    console.log(kind.padEnd(8) + ' ' + label.padEnd(48) + ' submitted: ' + cells[0] + '   reviewed: ' + cells[1]);
  } finally {
    writeFileSync(file, original);
  }
}
console.log('\nright answers — submitted: ' + score[0] + '/' + CHANGES.length + ', reviewed: ' + score[1] + '/' + CHANGES.length);
