/**
 * tst-00-9 — Testing · Section 0 · Start here (2/2) "Life without tests" (31/10/2026).
 * Nguồn: content/courses/testing/s00-intro.mjs › tst-0-9-bat-dau-khi-khong-co. Số liệu sự cố kiểm nguồn: SEC 2013-222 (Knight),
 * Wikipedia Therac-25 / Ariane flight V88 / Mars Climate Orbiter, CrowdStrike RCA 06/08/2024, Microsoft blog 20/07/2024.
 * Output Vitest = chạy thật Node 22.23.3 + Vitest 5.0.5.
 */
import { lamDeck, vt, two, box, steps, cards, kw, c, flow, zm, three } from './_tst-chung.mjs';

export const deck = { key: 'tst-00-9', code: 'TST 0.S2', title: 'Life without tests', sub: 'Start here (2/2)' };

/** Ô số lớn. */
const so = (n, nhan, mau = '#c0392b') => `<div style="border:2px solid ${mau}33;background:${mau}0d;border-radius:12px;padding:10px 12px;text-align:center">` +
  `<div style="font-size:40px;font-weight:800;color:${mau};line-height:1.1">${n}</div><div style="font-size:18px;color:#555;margin-top:4px">${nhan}</div></div>`;
const soHang = (items) => `<div style="display:grid;grid-template-columns:repeat(${items.length},1fr);gap:14px">${items.map((x) => so(...x)).join('')}</div>`;

/** Một thẻ sự cố: số liệu + nguyên nhân + test còn thiếu. */
const suCo = (nums, cause, missing, src) => zm(soHang(nums) + '<div style="height:14px"></div>' +
  two(box('What went wrong', cause, 'do2'), box('The test that was missing', missing, 'xanh')) +
  `<div class="nho" style="text-align:right;margin-top:8px">Source: ${src}</div>`, 1.12);

const RED = `$ npx vitest run
 ❯ src/rules/time.test.js (3 tests | 1 failed) 5ms
     × pads hours and minutes to two digits 3ms

 FAIL  src/rules/time.test.js > formatTime > pads hours…
AssertionError: expected '7:30' to be '07:30'

Expected: "07:30"
Received: "7:30"

 ❯ src/rules/time.test.js:16:29
     16|     expect(formatTime(450)).toBe('07:30');
       |                             ^
      Tests  1 failed | 2 passed (3)`;

export const slides = lamDeck({ chuong: 'Section 0 — Start here (2/2)' }, [
  { cover: true, t: 'Life without tests', sub: 'Start here (2/2) · real incidents, and how to learn this without giving up', nhan: 'Section 0 · Start here 2/2' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Five real, checked incidents — what broke, what it cost, <b>which test was missing</b></li>
    <li>One incident from this very website (October 2026)</li>
    <li>Two student situations you can picture (illustrations, not real reports)</li>
    <li>Why beginners give up on testing — and the antidote to each reason</li>
    <li>A study rhythm, a 2-week minimum path and the full path</li>
    <li>How to read a red test output calmly</li></ul>` },
  { t: 'Every story follows the same chain', to: true, giua: true, body: flow([
      { t: 'Error', s: 'someone assumes', mau: '#b85a2b' },
      { t: 'Defect', s: 'a line waits', mau: '#e08a1e' },
      { t: 'Failure', s: 'it runs, it breaks', mau: '#c0392b' },
      { t: 'Effect', s: 'money, trust, lives', mau: '#7a1f12' },
    ], { h: 160, fs: 26 }) + `<table class="t" style="font-size:20px"><tr><th>Error</th><th>Defect</th><th>Failure</th><th>Effect</th></tr><tr><td>“the other team uses pound-force too”</td><td>output written in lbf·s, not N·s</td><td>every trajectory correction 4.45× off</td><td>$327.6M spacecraft lost (1999)</td></tr></table>` + box('How to read the next slides', 'For each incident ask one question: <b>which test, run before release, would have turned the failure into a red line on a developer’s screen?</b>', 'lam') },
  { t: 'Knight Capital, 2012: $460 million in 45 minutes', giua: true, body: suCo(
      [['45 min', 'after the market opened'], ['4 million+', 'orders sent for 212 customer orders'], ['$460M+', 'lost; $12M SEC penalty later']],
      'An old, unused function was left in the order router since 2005. New code deployed in late July 2012 was <b>deployed incorrectly</b> to the same router and woke the dead path up.',
      'A check that every server runs the <b>same tested build</b>, and a test that the retired path cannot be triggered. Dead code is untested code.',
      'SEC press release 2013-222') },
  { t: 'Therac-25, 1985–87: a race condition', giua: true, body: suCo(
      [['6+', 'massive overdoses'], ['~100×', 'the intended dose'], ['3', 'patients died of overdoses']],
      'Software reused from older models had been protected by <b>hardware interlocks</b>, which the Therac-25 removed. A fast operator editing the treatment within ~8 seconds hit a <b>race condition</b>; a counter that overflowed skipped a safety check.',
      'Tests of the <b>timing</b> (fast edits) and of <b>boundaries</b> (the counter wrapping to zero) — and never assuming reused code is safe in a new context.',
      'Wikipedia “Therac-25”; Leveson &amp; Turner, IEEE Computer 1993') },
  { t: 'Ariane 5 flight 501, 4 June 1996: 37 seconds', giua: true, body: suCo(
      [['37 s', 'after launch'], ['64 → 16 bit', 'number conversion overflowed'], ['$370M+', 'lost']],
      'Navigation code was reused from Ariane 4. Ariane 5 flew faster sideways, so one value became too big for a 16-bit integer. Both navigation computers stopped.',
      'Tests fed with <b>Ariane 5’s own trajectory data</b> — the equipment tests never used it. Post-flight simulation with real data reproduced the failure.',
      'Wikipedia “Ariane flight V88” (inquiry board findings)') },
  { t: 'Mars Climate Orbiter, 1999: two teams, two units', giua: true, body: suCo(
      [['4.45×', 'size of the error'], ['57 km', 'from the surface: too low'], ['$327.6M', 'mission cost']],
      'One team’s ground software reported thruster impulse in <b>pound-force seconds</b>; the other team’s software expected <b>newton-seconds</b>, as the interface spec required.',
      'An <b>integration / contract test</b> between the two programs: “given this input, the output is in N·s”. Each side was fine alone; the join was wrong.',
      'Wikipedia “Mars Climate Orbiter”') },
  { t: 'CrowdStrike, 19 July 2024: the 21st field', giua: true, body: suCo(
      [['8.5M', 'Windows devices crashed'], ['21 vs 20', 'fields expected vs supplied'], ['“*”', 'tests only used wildcards']],
      'A new template defined <b>21</b> input fields; the code supplied <b>20</b>. Tests and early updates matched the 21st field with a <b>wildcard</b> (“match anything”), so field 21 was never read — until an update used a real value.',
      'A test with a <b>non-wildcard value in every field</b> — CrowdStrike’s own root-cause report lists exactly that, plus bounds checks and staged rollout.',
      'CrowdStrike RCA 06/08/2024; Microsoft blog 20/07/2024') },
  { t: 'The pattern: each disaster had a cheap missing test', giua: true, body: zm(`<table class="t"><tr><th>Incident</th><th>Root cause in one line</th><th>Kind of test that catches it</th><th>Chapter</th></tr>
    <tr><td>Knight Capital</td><td>dead code + inconsistent deployment</td><td>deploy checks in CI, test retired paths</td><td>9, 10</td></tr>
    <tr><td>Therac-25</td><td>race condition, counter overflow</td><td>timing tests, boundary tests</td><td>1, 2</td></tr>
    <tr><td>Ariane 5</td><td>value too big for 16 bits</td><td>boundary / real-data tests</td><td>1</td></tr>
    <tr><td>Mars Climate Orbiter</td><td>units differ across two programs</td><td>integration / contract tests</td><td>4, 5</td></tr>
    <tr><td>CrowdStrike</td><td>field 21 only tested with “*”</td><td>vary every input, mutation testing</td><td>1, 8</td></tr></table>`, 1.15) +
    box('Not “they were careless”', 'All five teams <b>had</b> tests. The tests just never ran the risky line with the risky value. That is a skill — the one this course trains.', 'lam') },
  { t: 'Closer to home: this website, October 2026', to: true, giua: true, body: two(
      box('What happened', 'The local config held <b>real</b> cloud-storage and e-mail keys. Test runs uploaded junk into the <b>production</b> bucket (98 files cleaned by hand on 10/10) and sent real e-mails to real people.', 'do2'),
      box('What fixed it', 'A <b>sandbox</b>: during tests, storage and e-mail go to fakes in memory/temp folders; a tripwire makes the whole suite fail if any test opens a connection to the real storage.', 'xanh')) +
    box('Lesson', 'Tests must be <b>isolated</b> from production — Chapter 3 (test doubles) and Chapter 4 (throwaway databases) teach how.', 'lam') },
  { t: 'Illustration A (not a real report): fix one, break three', to: true, giua: true, body: steps([
      'Night before the LabFlow demo: a teammate makes ' + c('parseTime') + ' accept ' + c('"7:00"') + ' as well as ' + c('"07:00"') + '.',
      'It works on his screen. He pushes. Nobody re-checks booking, cancelling, the weekly report.',
      'Demo: booking 20:30–21:00 says “outside opening hours”; the report shows 0 hours used.',
      'Three features broke because one helper changed — a 40-test suite would have shown it in one second.',
    ]) },
  { t: 'Illustration B (not real): the merge that killed login', to: true, giua: true, body: two(
      box('What happens', 'Two branches each pass on their owners’ laptops. Merged an hour before the progress review, login returns 500: one branch renamed a field the other still reads.', 'do2'),
      box('What would have helped', 'An <b>API test</b> for login (Chapter 5) and <b>CI on every pull request</b> (Chapter 9): the merge would have been blocked, red, an hour <b>before</b> the review.', 'xanh')) },
  { t: 'Why beginners give up — and the antidote', giua: true, body: zm(`<table class="t"><tr><th>Reason</th><th>Antidote in this course</th></tr>
    <tr><td>“It feels like writing the code twice”</td><td>One project all course long; you see tests catch real bugs from Chapter 1</td></tr>
    <tr><td>Red output looks scary</td><td>Lesson 0.3 + this deck: read a failure line by line, on purpose</td></tr>
    <tr><td>Too many English terms (mock, stub, fixture…)</td><td>🗂 Key terms in every lesson, Vietnamese meaning first</td></tr>
    <tr><td>Toy examples like ${c('add(1, 2)')}</td><td>Real rules: 30-minute grid, 14 days, 30 seats — from LabFlow</td></tr>
    <tr><td>No feedback on whether your tests are good</td><td>Lab 1: a script injects 8 bugs; your tests must catch all 8</td></tr></table>`, 1.15) },
  { t: 'The rhythm of one lesson (about 75 minutes)', to: true, giua: true, body: steps([
      '<b>Slides</b> (10 min) — the ideas and pictures, read the Vietnamese notes under each slide',
      '<b>Written lesson</b> (30 min) — <b>type</b> every example yourself, run it, compare with the real output',
      '<b>🧪 Practice</b> (15–20 min) — a task with a “done when” you can check',
      '<b>🗂 Key terms + 📌 summary</b> (5 min) — say each summary line out loud',
      '<b>Quiz</b> at the end of each chapter — 10 questions, explanations included',
    ]) },
  { t: 'Two paths: minimum 2 weeks, or the full course', giua: true, body: zm(`<table class="t"><tr><th></th><th>Minimum (≈ 2 weeks, 1 h/day)</th><th>Full (≈ 8–10 weeks)</th></tr>
    <tr><td>Goal</td><td>Write useful tests for a Node/Express API</td><td>A complete, trusted suite + CI + capstone</td></tr>
    <tr><td>Chapters</td><td>0 · 1 · 3 · 4 · 5 · 9</td><td>0 → 11 in order</td></tr>
    <tr><td>Labs</td><td>Lab 1 (rules), Lab 5 (API)</td><td>every chapter lab</td></tr>
    <tr><td>Good for</td><td>SWT301 Lab 2 now, LabFlow backend</td><td>internship interviews, real teams</td></tr></table>`, 1.2) +
    box('Studying SWT301 this semester?', 'Do Chapter 1 now: it is Lab 2 thinking (boundaries, decision tables) written as code you can run.', 'xanh') },
  { t: 'Reading a red test without panic', giua: true, body: two(zm(vt(RED, { title: 'terminal — Vitest 5.0.5 (shortened)' }), 1.2), `<div style="font-size:20px">${steps([
      `<b>Where:</b> file › describe › test name`,
      `<b>What:</b> the AssertionError sentence`,
      `<b>Expected</b> (what you wrote) vs <b>Received</b> (what the code did)`,
      `<b>Which line:</b> the ${c('^')} under the code`,
      `<b>How many:</b> the last line — 1 failed, 2 passed`,
    ])}</div>`, 'r64') },
  { t: 'When you are stuck, and milestones worth celebrating', giua: true, body: zm(two(box('A help message people can answer', `<ol style="font-size:19px"><li>What I ran (the command)</li><li>What I expected</li><li>What I got (paste the output, not a photo)</li><li>What I already tried</li></ol>`, 'lam'),
      box('Milestones', `<ul style="font-size:19px"><li>🟢 first green test</li><li>🔴 first red test read calmly</li><li>🎯 first boundary bug caught</li><li>🧬 8/8 mutants killed (Lab 1)</li><li>🤖 first green CI run</li></ul>`, 'xanh')), 1.45) },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Real disasters came from <b>missing</b> tests, not missing testers</li>
    <li>Risky line + risky value: boundaries, real data, every field, timing</li>
    <li>Integration and contract tests catch “each part fine, the join wrong”</li>
    <li>Tests must be isolated from production systems</li>
    <li>Learn in a rhythm: slides → type → 🧪 → terms → quiz</li>
    <li>Red output has five parts — read them in order</li></ul>` },
]);
