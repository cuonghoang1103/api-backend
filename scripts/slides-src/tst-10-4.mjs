/**
 * tst-10-4 — Testing · Chapter 10 · Lesson 10.4 "Testing interview questions" (01/11/2026). Slug: tst-10-4-phong-van.
 * Mọi con số trên slide = số đo của chính khoá (ghi bài): 0.1, 3.3/10.1, 4.1, 4.3, 8.1–8.4, 9.1, 9.3, 10.2, 10.3.
 * Output = chạy thật (s10/_ma.mjs): 101-splice, 103-retry-khong/co, 102-mut-3/4, 104-yeu, 104-cham-yeu, 104-mau, 104-cham-mau.
 */
import { lamDeck, js, vt, two, box, steps, c, zm, flow, vsd, tbl } from './_tst-chung.mjs';

export const deck = { key: 'tst-10-4', code: 'TST 10.4', title: 'Testing interview questions', sub: 'answers backed by numbers you measured' };

const SPLICE = `$ node scripts/thu-loi.mjs src/booking/service.js "rows.splice(i, 1)[0]" "rows.splice(i, 1)" …
planted in src/booking/service.js:  rows.splice(i, 1)[0]  →  rows.splice(i, 1)
 ✓ demo10/truong-phai/mockist.test.js (1 test) 3ms
 ❯ demo10/truong-phai/classicist.test.js (3 tests | 2 failed) 61ms
     × deletes the booking and offers the slot to the first student waiting
     × sends no e-mail when nobody is waiting`;
const RETRY = `$ … node scripts/lap-lai.mjs 30 demo10/review/khong-retry.test.js -t "should return correct value"
red in 10/30 runs (22.6 s)
$ node scripts/lap-lai.mjs 30 demo10/review/pr57.test.js -t "should return correct value"
red in 0/30 runs (17.8 s)`;
const LEGACY = `$ node demo10/dac-ta/dot-bien-dac-ta.mjs demo10/dac-ta/3-chot.test.js
3/10 changes caught by demo10/dac-ta/3-chot.test.js
$ node demo10/dac-ta/dot-bien-dac-ta.mjs demo10/dac-ta/4-golden.test.js
10/10 changes caught by demo10/dac-ta/4-golden.test.js`;
const YEU = `it('test mergeBusy', () => {
  const result = mergeBusy([
    { start: '08:00', end: '10:00' },
    { start: '09:00', end: '11:00' },
  ]);
  expect(result.length).toBe(1);
});
it('test mergeBusy 2', () => {
  expect(mergeBusy([/* 08–09, 13–14 */]))
    .toBeTruthy();
});`;
const CHAM_YEU = `$ node demo10/phong-van/cham.mjs …/ung-vien-yeu.test.js
✘ SURVIVED  #1 touching bookings stay apart
✘ SURVIVED  #2 a booking inside another one cuts the block short
✘ SURVIVED  #3 input order is trusted (no sort)
✘ SURVIVED  #4 sorted by end time instead of start
✘ SURVIVED  #5 the caller's array is reordered
✘ SURVIVED  #6 a booking inside another one becomes its own block
0/6 bugs caught by …/ung-vien-yeu.test.js`;
const CHAM_MAU = `$ npx vitest run src/rules/busy.test.js
      Tests  8 passed (8)
$ node demo10/phong-van/cham.mjs src/rules/busy.test.js
✔ killed    #1 touching bookings stay apart
…
✔ killed    #6 a booking inside another one becomes its own block
6/6 bugs caught by src/rules/busy.test.js`;

export const slides = lamDeck({ chuong: 'Chapter 10 — TDD and testing in real teams', bai: '10.4' }, [
  { cover: true, t: 'Testing interview<br>questions', sub: 'Chapter 10 · Lesson 10.4 — answers backed by numbers you measured yourself' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Answer the 11 most common testing questions in <b>60–90 seconds</b> each</li>
    <li>Back every claim with a <b>number you measured</b> — and the lesson where</li>
    <li>Name the <b>trade-off</b> before the interviewer asks for it</li>
    <li>Pass a <b>20-minute live-coding</b> round: tests for a small function, thinking aloud</li>
    <li>Avoid the claims that collapse on the first follow-up</li></ul>` },
  { t: 'How to answer any testing question', body: flow([{ t: 'Clarify', s: 'one short question' }, { t: 'Claim', s: 'one sentence, first' }, { t: 'Evidence', s: 'a number + where', mau: '#b85a2b' }, { t: 'Trade-off', s: 'what it costs', mau: '#336791' }, { t: 'Stop', s: '60–90 seconds', mau: '#2f7d4f' }], { h: 150, fs: 19 }) +
    box('Example — “Is 100% coverage enough?”', `<b>Claim:</b> coverage shows what ran, not what was checked. <b>Evidence:</b> a suite of ${c('toBeDefined')} checks reached 100% and killed 41.49% of mutants (lessons 8.1–8.2). <b>Trade-off:</b> mutation testing costs 10.5 s against 0.8 s, so it runs at night.`, 'lam') +
    box('Never quote a number you cannot back', '“How did you measure that?” is the follow-up. Quote your own runs — or the lesson where you ran it.', 'do2') },
  { t: 'Weak answer, strong answer', body: vsd(
      `<p><b>“Mock, stub, spy, fake?”</b></p><p>“They are all fake objects. I mock everything so the tests are fast.”</p><p class="nho">No distinction, no cost, no story — the follow-up “when does a mock lie?” has no answer.</p>`,
      `<p>Stub: canned answers · spy: records calls · mock: checks expected calls · fake: a small working version (3.1).</p><p>“In 10.1 a repo bug left the <b>mockist</b> test green and the <b>classicist</b> test red. So I mock what I do not own — mail, clock — and keep fakes inside.”</p>`,
      '✗ Weak', '✓ Strong') },
  { t: 'The numbers to have ready', body: zm(tbl(['Topic', 'Number', 'Lesson'], [
      ['unit vs HTTP', '≈0.015 ms vs 0.75–1 ms per check', '0.1'],
      ['cost per layer', 'unit 1.1 s · component 2.7 s · integration 3.7 s · e2e 9.6 s', '8.4'],
      ['real database', '23P01 → OVERLAP · SQLite takes text in INTEGER', '4.1'],
      ['coverage ≠ quality', '100% coverage, 41.49% mutants killed', '8.1–8.2'],
      ['retry hides bugs', '17/50 → 0/50 · random ids 10/30 → 0/30', '8.3 · 10.3'],
      ['slow suite', '6.14 s → 210 ms by fixing causes', '8.4'],
      ['CI', 'npm cache 49.6 s → 15.0 s · one gate ci-ok', '9.1 · 9.3'],
      ['legacy code', '3 sample rows 3/10 · every branch 10/10', '10.2'],
    ]), 1.0) },
  { t: 'Mocks: the bug only a real collaborator saw', body: vt(SPLICE, { title: 'terminal — lesson 10.1: remove() returns an array instead of the row', fs: 14 }) +
    two(box('Mockist: green', `It replaced the whole repository with ${c('vi.fn()')} — the bug lives in code the test never runs.`, 'do2'),
      box('Classicist: red 2 of 3', 'It used the real in-memory repository, so the broken contract showed up at once. Say this in an interview: it is a story, not a definition.', 'xanh')) },
  { t: 'Flaky tests: retry hides the problem', body: vt(RETRY, { title: 'terminal — lesson 10.3: a test with random student ids, 30 runs each', fs: 15 }) +
    two(box('What retry did', `${c('retry: 3')} turned 10 red runs in 30 into 0. The random ids still collide; nobody looks again. Lesson 8.3: 17/50 → 0/50 while a real double booking stayed.`, 'do2'),
      box('Strong answer', 'Reproduce with a loop and a seed · quarantine with an owner and a date (9.3: 13/30 red, blocking nobody) · fix the cause · prove it with 100 shuffled runs.', 'xanh')) },
  { t: 'TDD and legacy code: honest answers', body: two(
      box('“Do you do TDD?”', `<b>Weak:</b> “Yes, always.” <b>Strong:</b> “For rules, yes — the 10.1 waitlist in six red-green steps scored 100% on Stryker (45/45). For a UI spike, no: spike, throw it away, then test.”`, 'lam'),
      box('“Code with no tests?”', `<b>Weak:</b> “Rewrite it.” <b>Strong:</b> “Pin it with characterization tests, then refactor (Feathers). Rows for every branch, not three samples.”`, 'lam')) +
    vt(LEGACY, { title: 'terminal — lesson 10.2: 10 planted changes in the legacy report', fs: 15 }) },
  { t: 'Live coding: 20 minutes, minute by minute', body: zm(tbl(['Min', 'Do', 'Say aloud'], [
      ['0–3', 'ask; write the answers as a comment', '“Do touching bookings merge? Sorted input? 8:00 without a zero?”'],
      ['3–5', 'a test list: empty, separate, overlap, touching, inside…', '“Happy path first, then the boundaries.”'],
      ['5–12', 'code + the first two tests, run them', '“Sort by start, extend the last block.”'],
      ['12–16', 'boundaries as one it.each table', '“Touching is the off-by-one: &lt;= or &lt;.”'],
      ['16–18', 'run, read every line, fix', '“8 passed; names read like a spec.”'],
      ['18–20', 'what is still missing', '“No test for end before start — is it possible?”'],
    ]), 1.0) + box('Silence is the worst answer', 'Two quiet minutes look like being stuck. Say what you are checking; if stuck, ask for a hint.', 'do2') },
  { t: 'Graded by six real bugs: weak vs model answer', body: two(js(YEU, { sm: true, fs: 14 }), vt(CHAM_YEU, { title: 'terminal — the weak answer: 2 tests, both green', fs: 13.5 }), 'r46') +
    two(box('The model answer: 8 tests', `Boundaries in one ${c('it.each')} table, ${c('toEqual')} on the whole result. The rows that do the most work: <b>touching</b> (kills ${c('<=')} → ${c('<')}) and <b>inside, listed first</b> (kills sorting by end time).`, 'xanh'),
      vt(CHAM_MAU, { title: 'terminal — the model answer', fs: 13.5 }), 'r46') },
  { t: 'Practice (20 minutes)', to: true, body: steps([
      `Start a 20-minute timer; write ${c('src/rules/busy.test.js')} yourself, talking aloud`,
      `When it rings: ${c('node demo10/phong-van/cham.mjs src/rules/busy.test.js')}`,
      'Answer questions 3, 6 and 7 aloud — 60–90 s each, one number, one lesson',
    ]) + box('Measured', `Model answer: ${c('8 passed')}, ${c('6/6 bugs caught')}. Weak answer: 2 green tests, ${c('0/6')}.`, 'lam') +
    box('Done when', '6/6 inside 20 minutes, and each answer fits in 90 seconds with a number you can explain.', 'xanh') },
]);
