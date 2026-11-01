/**
 * tst-10-2 — Testing · Chapter 10 · Lesson 10.2 "Adding tests to legacy code" (01/11/2026). Slug: tst-10-2-code-cu.
 * Output = chạy thật (content/courses/testing/s10/_ma.mjs): gọi thẳng ⇒ ECONNREFUSED 127.0.0.1:54399; link seam + "expect ''" in ra
 * hành vi thật; 1 ví dụ: 96,42% dòng, 66,66% nhánh, 3/10; golden master: 100%, 10/10; v0 đỏ ở America/New_York (2 → 1);
 * refactor xanh ở cả 3 múi giờ; toFixed(1) ⇒ "Hours: 7.0" đỏ.
 */
import { lamDeck, js, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-10-2', code: 'TST 10.2', title: 'Adding tests to legacy code', sub: 'pin what it does today, then change it' };

const V0 = `export async function monthlyReport(lab) {
  var d = new Date();
  var y = d.getFullYear();
  var m = d.getMonth() + 1;
  …
  var rows = await db.all('SELECT * FROM bookings');
  var hol = [];
  try {
    var r = await fetch('https://holidays…/vn/' + y);
    hol = await r.json();
  } catch (e) {
    // no network: no holidays
  }
  …
      var day = new Date(b.date).getDay();`;
const DO1 = `$ npx vitest run demo10/dac-ta/1-ngay-tho.test.js
   × prints the report of BE-201 4ms
Error: connect ECONNREFUSED 127.0.0.1:54399
      Tests  1 failed (1)`;
const SEAM = `vi.mock('../legacy/db.js', () => ({ db: { all: async () => [
  { lab: 'BE-201', date: '2026-10-05', start: '08:00', … }, …
] } }));
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });               // seam 2: the clock
  vi.setSystemTime(new Date('2026-10-31T12:00:00+07:00'));
  vi.stubGlobal('fetch', async () => ({ json: async () => [] })); // seam 3: the network
  …
});
it('prints the report of BE-201', async () => {
  expect(await monthlyReport('BE-201')).toBe('');
});`;
const DO2 = `AssertionError: expected 'LAB BE-201 - 2026/10\\n2026-10-05 08:0…' to be ''
- Expected
+ Received
+ LAB BE-201 - 2026/10
+ 2026-10-05 08:00-10:00 20 seats
+ 2026-10-12 13:30-15:00 25 seats
+ 2026-10-19 09:00-11:00 18 seats
+ Bookings: 3
+ Hours: 5.5
+ Large (>30 seats): 0
+ Weekend/holiday: 0`;
const COV3 = `$ npx vitest run demo10/dac-ta/3-chot.test.js --coverage …
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered
 ...lyReport.v0.js |   91.17 |    66.66 |     100 |   96.42 | 34`;
const MUT3 = `$ node demo10/dac-ta/dot-bien-dac-ta.mjs demo10/dac-ta/3-chot.test.js
✘ SURVIVED  #1 a 30-seat booking counts as large
✘ SURVIVED  #2 pending bookings disappear from the report
✘ SURVIVED  #3 Sunday is no longer a weekend
✘ SURVIVED  #4 the first holiday of the year is ignored
✔ killed    #5 hours rounded to whole hours
✘ SURVIVED  #6 the (pending) mark is lost
✔ killed    #7 the report shows last month
✘ SURVIVED  #8 the empty-month line changes (the office Excel import breaks)
✘ SURVIVED  #9 every lab is counted in every report
✔ killed    #10 only the last booking counts toward the hours
3/10 changes caught by demo10/dac-ta/3-chot.test.js`;
const GOLD = `vi.mock('../legacy/db.js', () => ({ db: { all: async () => ROWS } }));
it('prints the same reports as before, for every lab and month we keep', async () => {
  let all = '';
  for (const today of ['2026-09-30T12:00…', '2026-10-31T12:00…', '2026-11-15T12:00…']) {
    vi.setSystemTime(new Date(today));
    for (const lab of ['BE-201', 'BE-305']) all += await monthlyReport(lab) + '----\\n';
  }
  await expect(all).toMatchFileSnapshot('./__approved__/monthly-report.txt');
});`;
const GOLD_OUT = `$ npx vitest run demo10/dac-ta/4-golden.test.js
   ✓ prints the same reports as before, for every lab and month we keep 4ms
  Snapshots  1 written
$ npx vitest run demo10/dac-ta/4-golden.test.js --coverage …
 ...lyReport.v0.js |     100 |      100 |     100 |     100 |
$ node demo10/dac-ta/dot-bien-dac-ta.mjs demo10/dac-ta/4-golden.test.js
✔ killed    #1 a 30-seat booking counts as large
…
✔ killed    #10 only the last booking counts toward the hours
10/10 changes caught by demo10/dac-ta/4-golden.test.js`;
const TZ = `$ for tz in UTC Asia/Ho_Chi_Minh America/New_York; do …; done
TZ=UTC
      Tests  1 passed (1)
TZ=Asia/Ho_Chi_Minh
      Tests  1 passed (1)
TZ=America/New_York
      Tests  1 failed (1)
$ TZ=America/New_York npx vitest run demo10/dac-ta/4-golden.test.js
- Expected
+ Received
- Weekend/holiday: 2
+ Weekend/holiday: 1`;
const SEAMS = `export async function monthlyReport(lab, deps = {}) {
  var d = deps.now ? deps.now() : new Date();
  var rows = await (deps.database || db).all('SELECT * FROM bookings');
    var r = await (deps.fetch || fetch)('https://holidays…' + y);`;
const TRUOT = `planted in src/report/monthly.js:  Math.round((minutes / 60) * 10) / 10  →  (minutes / 60).toFixed(1)
     × prints the same reports as v0, for every lab and month we keep 7ms
- Expected
+ Received
- Hours: 7
+ Hours: 7.0
- Hours: 9
+ Hours: 9.0
  Snapshots  1 failed
      Tests  1 failed | 1 passed (2)`;
const GD = `$ npx vitest run src/legacy/monthlyReport.test.js
      Tests  2 passed (2)
$ npx vitest run src/legacy/monthlyReport.test.js
      Tests  2 passed (2)
$ npx vitest run src/legacy/monthlyReport.test.js src/report/monthly.test.js
      Tests  5 passed (5)`;

export const slides = lamDeck({ chuong: 'Chapter 10 — TDD and testing in real teams', bai: '10.2' }, [
  { cover: true, t: 'Adding tests<br>to legacy code', sub: 'Chapter 10 · Lesson 10.2 — pin what the code does today, then change it safely' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Run “untestable” code in a test by replacing its dependencies from outside</li>
    <li>Write <b>characterization tests</b>: what the code does, not what it should do</li>
    <li>Measure them: branch coverage plus planted changes (3/10 → 10/10)</li>
    <li>Keep a big output in an <b>approved file</b> (golden master)</li>
    <li>Add seams and refactor under the tests without changing behaviour</li></ul>` },
  { t: 'Legacy code: code without tests', body: two(js(V0, { sm: true, hl: [2, 6, 9, 15] }),
      box('Michael Feathers (2004)', `<i>Working Effectively with Legacy Code</i>: legacy code is simply <b>code without tests</b>. LabFlow v0’s monthly report: the office pastes its text into Excel — the text is the contract.`, 'lam') +
      box('Three hidden dependencies', `a global database (port 54399), a network call whose ${c('catch')} swallows errors, and ${c('new Date()')} choosing the month.`, 'do2'), 'r73') },
  { t: 'The legacy code change algorithm', giua: true, body: flow([{ t: 'Change point', s: 'new column' }, { t: 'Test point', s: 'the whole text' }, { t: 'Break deps', s: 'DB · net · clock', mau: '#b85a2b' }, { t: 'Write tests', s: 'pin today', mau: '#c0392b' }, { t: 'Change', s: 'and refactor', mau: '#2f7d4f' }], { h: 170, fs: 20 }) +
    zm(two(box('Seam', `“A place where you can alter behavior in your program <b>without editing in that place</b>” (Feathers). Its <b>enabling point</b> is where you choose the behaviour.`, 'lam'),
      box('In JavaScript', `<b>Link seam</b>: replace an import (${c('vi.mock')}), a global (${c('vi.stubGlobal')}), the date (fake timers). <b>Object seam</b>: pass the dependency as a parameter.`, 'xanh')), 1.12) },
  { t: 'Step 1 and 2: call it, then add link seams', body: vt(DO1, { title: 'terminal — just call it', fs: 14 }) + js(SEAM, { sm: true, hl: [5, 6, 7, 11] }) +
    box('Not one line of v0 changed', `The enabling point is the test file. The expected value ${c("''")} is wrong <b>on purpose</b>: a dummy expectation, then read the actual value from the failure (Feathers).`, 'xanh') },
  { t: 'Let the failure print the truth', body: vt(DO2, { title: 'terminal — demo10/dac-ta/2-doc-loi.test.js', fs: 16 }) +
    box('Then pin it', `Paste the received text as the expected value: ${c('3-chot.test.js')} is green. A <b>characterization test</b> documents “your system’s actual behavior, not … the behavior you wish your system had” (Feathers).`, 'lam') },
  { t: 'Pinned — but how strong?', body: vt(COV3, { title: 'coverage of v0 with one example', fs: 14 }) + vt(MUT3, { title: '10 real changes planted in v0, one at a time', fs: 13.5 }) +
    box('96.42% of lines, 3 changes out of 10', `Branches say the truth: 66.66% — no weekend, no holiday, no pending, no other lab, no empty month (line 34).`, 'do2') },
  { t: 'A golden master: inputs for every branch', body: js(GOLD, { sm: true, hl: [8] }) +
    two(vt(GOLD_OUT, { title: 'first run writes the file · 100% branches · 10/10', fs: 12 }),
      box('Approval testing', `The whole output lives in ${c('__approved__/')}, reviewed once, compared on every run. Rows hit every branch: Sat, Sun, 30/31 seats, pending, cancelled, other lab, other month, holidays.`, 'lam'), 'r73') },
  { t: 'Pin the quirks — do not fix them now', body: two(vt(TZ, { title: 'terminal — v0 golden master in three time zones', fs: 13 }),
      box('Quirks found and pinned', `${c('Hours: 9')}, not 9.0 · no network ⇒ no holidays, silently · weekday from ${c('new Date(b.date).getDay()')}: in New York, Saturday 3 Oct becomes Friday.`, 'lam') +
      box('One change at a time', 'Right where the code runs (UTC, UTC+7). Refactor with the output unchanged; change behaviour in its own PR, with the approved file’s diff.', 'do2'), 'r64') },
  { t: 'Seams, then refactor under the tests', body: js(SEAMS, { sm: true }) +
    two(vt(GD, { title: 'v0 · v1 with seams · refactored — same tests', fs: 12 }),
      box('Pure core', `${c('buildMonthlyReport({ lab, month, rows, holidays })')}: no DB, no network, no clock. Weekday read in UTC ⇒ 5 passed under UTC, VN and New York.`, 'xanh'), 'r64') +
    vt(TRUOT, { title: 'a “cleaner” hours format, caught by the approved file', fs: 13 }) },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `Start from ${c('3-chot.test.js')}: 3/10 changes, 66.66% branches`,
      `Make it a golden master; add booking rows only — never edit v0`,
      `Run ${c('node demo10/dac-ta/dot-bien-dac-ta.mjs <your test>')} after each row`,
    ]) + box('Measured (reference rows)', `${c('10/10 changes caught')} · v0 coverage 100% statements, branches, functions and lines.`, 'lam') +
    box('Done when', '10/10, 100% branches, the approved file committed — and you can say which row kills #1 (exactly 30 seats) and #8 (an empty month).', 'xanh') },
]);
