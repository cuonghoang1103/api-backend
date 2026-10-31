/**
 * tst-00-8 — Testing · Section 0 · Start here (1/2) "What testing is, and why every team asks about it" (31/10/2026).
 * Nguồn: content/courses/testing/s00-intro.mjs › tst-0-8-bat-dau-tai-day. Output = chạy thật Node 22.23.3 (node:test).
 * Mốc lịch sử kiểm nguồn: Wikipedia JUnit/Software bug/Software testing/ISTQB/TDD, martinfowler.com (TestPyramid, Xunit),
 * engineering.fb.com (Jest 2011/2014), kentcdodds.com (trophy 06/02/2018), nodejs.org/api/test.html (v18 → stable v20), npm (vitest 0.0.1 12/2021).
 */
import { lamDeck, js, vt, two, box, steps, cards, kw, vsd, c, flow, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-00-8', code: 'TST 0.S1', title: 'What testing is', sub: 'Start here (1/2)' };

/** Dòng thời gian: items [[năm, tiêu đề, dòng phụ]] */
const timeline = (items, opts = {}) => {
  const { w = 1110, h = 400, mau = '#e08a1e' } = opts;
  const n = items.length, gap = (w - 260) / (n - 1), y = 190;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  s += `<line x1="40" y1="${y}" x2="${w - 40}" y2="${y}" stroke="#bfbfbf" stroke-width="5" stroke-linecap="round"/>`;
  items.forEach(([nam, t, sub], i) => {
    const x = 130 + i * gap, up = i % 2 === 0;
    s += `<circle cx="${x}" cy="${y}" r="13" fill="${mau}" stroke="#fff" stroke-width="4"/>`;
    s += `<text x="${x}" y="${up ? y - 34 : y + 58}" text-anchor="middle" font-size="32" font-weight="800" fill="#b85a2b">${nam}</text>`;
    const ty = up ? y - 140 : y + 104;
    s += `<text x="${x}" y="${ty}" text-anchor="middle" font-size="21" font-weight="700" fill="#262626">${t}</text>`;
    if (sub) s += `<text x="${x}" y="${ty + 30}" text-anchor="middle" font-size="18" fill="#666">${sub}</text>`;
    if (up) s += `<line x1="${x}" y1="${y - 26}" x2="${x}" y2="${y - 16}" stroke="${mau}" stroke-width="2"/>`;
  });
  return s + '</svg>';
};

/** Chi phí kiểm lại bằng tay tăng theo số tính năng, tự động thì gần phẳng. */
const regress = () => {
  const W = 700, H = 330, x0 = 70, y0 = 280, sx = 58, bars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  s += `<line x1="${x0}" y1="20" x2="${x0}" y2="${y0}" stroke="#888" stroke-width="2"/><line x1="${x0}" y1="${y0}" x2="${W - 20}" y2="${y0}" stroke="#888" stroke-width="2"/>`;
  bars.forEach((b, i) => {
    const x = x0 + 14 + i * sx, hm = b * 24, ha = 18;
    s += `<rect x="${x}" y="${y0 - hm}" width="22" height="${hm}" fill="#c0392b" opacity=".85"/>`;
    s += `<rect x="${x + 24}" y="${y0 - ha}" width="22" height="${ha}" fill="#2f7d4f"/>`;
    s += `<text x="${x + 23}" y="${y0 + 22}" text-anchor="middle" font-size="15" fill="#555">${b}</text>`;
  });
  s += `<text x="${W / 2 + 30}" y="${H - 2}" text-anchor="middle" font-size="16" fill="#555">features already shipped (each release re-checks all of them)</text>`;
  s += `<text x="24" y="150" text-anchor="middle" font-size="16" fill="#555" transform="rotate(-90 24 150)">time to re-check</text>`;
  s += `<rect x="110" y="26" width="18" height="18" fill="#c0392b"/><text x="136" y="41" font-size="17" fill="#333">by hand: grows with every feature</text>`;
  s += `<rect x="110" y="56" width="18" height="18" fill="#2f7d4f"/><text x="136" y="71" font-size="17" fill="#333">automated: the machine re-runs all, seconds</text>`;
  return s + '</svg>';
};

const FIRST_TEST = `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseTime } from './gio.js';

test('07:00 is minute 420', () => {
  assert.equal(parseTime('07:00'), 420);
});

test('21:30 is minute 1290', () => {
  assert.equal(parseTime('21:30'), 1290);
});`;

const PASS = `$ node --test --test-reporter=spec gio.test.js
✔ 07:00 is minute 420 (0.704208ms)
✔ 21:30 is minute 1290 (0.074041ms)
ℹ tests 2
ℹ pass 2
ℹ fail 0`;

export const slides = lamDeck({ chuong: 'Section 0 — Start here (1/2)' }, [
  { cover: true, t: 'What testing is,<br>and why it matters', sub: 'Start here (1/2) · automated testing from zero, in plain words', nhan: 'Section 0 · Start here 1/2' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What a <b>test</b> is — first as an everyday picture, then as code</li>
    <li>The words people mix up: testing · QA · debugging · error / defect / failure</li>
    <li><b>Unit</b>, <b>integration</b> and <b>end-to-end</b> tests in one picture</li>
    <li>Where automated testing came from: 1947 → 2026, every date checked</li>
    <li>What it gives <b>you</b>: SWT301 labs, LabFlow, interviews, a real job</li>
    <li>Your first passing test in 10 minutes — zero installs</li></ul>` },
  { t: 'You already test things every day', to: true, giua: true, body: cards([
      ['🍲 Tasting the soup', 'You taste <b>before</b> serving, not after the guests complain. A test is a taste taken on purpose, at the right moment.'],
      ['✈️ Pre-flight checklist', 'Pilots run the <b>same list</b> before every flight, even after 10,000 flights. Automation = a checklist that runs itself.'],
      ['📝 The 15-minute quiz', 'The teacher knows the right answers in advance and compares. A test knows the <b>expected</b> result and compares it with the <b>actual</b> one.'],
    ], 3) + box('One sentence to keep', 'A test = <b>run something</b> with a known input, <b>compare</b> the actual result with the expected result, report <span class="xanh">pass</span> or <span class="do">fail</span>.', 'lam') },
  { t: 'An automated test is code that runs your code', giua: true, body: two(zm(js(FIRST_TEST, { hl: [6] }), 1.2), `<div style="display:flex;flex-direction:column;gap:16px">${zm(vt(PASS, { title: 'terminal — Node 22.23.3', sm: false }), 1.15)}${box('', `Line 6: <b>actual</b> = ${c("parseTime('07:00')")}, <b>expected</b> = ${c('420')}. Same ⇒ ✔. Different ⇒ ✖ and the exact numbers.`, 'xanh')}</div>`, 'r46') },
  { t: 'Manual vs automated: the difference is the 100th run', giua: true, body: `<table style="zoom:1.3" class="t"><tr><th></th><th>Manual testing (by hand)</th><th>Automated testing (by code)</th></tr>
    <tr><td><b>Who runs it</b></td><td>a person clicks and reads</td><td>a program, in seconds</td></tr>
    <tr><td><b>1st run</b></td><td>fast — nothing to write</td><td>slower — you write the test first</td></tr>
    <tr><td><b>100th run</b></td><td>bored, skips steps, misses things</td><td>exactly the same as run 1</td></tr>
    <tr><td><b>Good at</b></td><td>exploring, “does this feel right?”, UX</td><td>re-checking known rules after every change</td></tr>
    <tr><td><b>In SWT301</b></td><td>test cases in Report 5.x, executed by a tester</td><td>JUnit tests (Lab 2), Selenium (Ch.8)</td></tr></table>` +
    box('Not a competition', 'Teams need both. This course is about the <b>automated</b> half — the part a machine can repeat for free forever.', 'lam') },
  { t: 'Testing ≠ debugging ≠ QA', to: true, giua: true, body: cards([
      ['🔎 Testing', '<b>Shows</b> that something is wrong (or gives confidence it is right). Output: a failing test, a bug report.'],
      ['🛠 Debugging', '<b>Finds and removes the cause</b> after a test failed. Output: a fix. Usually the developer’s job.'],
      ['🏭 QA — quality assurance', 'The <b>whole process</b> that prevents defects: reviews, standards, tests, CI. Testing is one part of QA.'],
    ], 3) + box('Interview trap', '“Testing proves the software has no bugs” — <span class="do">wrong</span>. Testing shows the <b>presence</b> of defects, never their absence (ISTQB principle 1).', 'do2') },
  { t: 'Error → defect → failure: three different words', to: true, giua: true, body: flow([
      { t: 'Error', s: 'a human mistake', mau: '#b85a2b' },
      { t: 'Defect (bug)', s: 'wrong line in the code', mau: '#e08a1e' },
      { t: 'Failure', s: 'wrong behaviour at run time', mau: '#c0392b' },
    ], { h: 150, fs: 26 }) + `<ul>
    <li><b>Error:</b> you think “14 days ahead” means <i>less than</i> 14 → you type ${c('<')} instead of ${c('<=')}</li>
    <li><b>Defect:</b> the line ${c('daysAhead < MAX_DAYS_AHEAD')} now sits in the code, silent</li>
    <li><b>Failure:</b> a student books exactly 14 days ahead and gets “not allowed”</li></ul>` +
    box('', 'A defect that never runs causes no failure — that is why tests must <b>run</b> the risky line with the risky value.', 'lam') },
  { t: 'Verification vs validation', to: true, giua: true, body: vsd(
      `<p style="font-size:22px"><b>Verification</b> — did we build the thing <b>right</b>?</p><p style="font-size:20px">Checks the code against the <b>spec</b>: “BR-05 says ≤ 14 days; the code accepts 14.” Automated tests live mostly here.</p>`,
      `<p style="font-size:22px"><b>Validation</b> — did we build the <b>right thing</b>?</p><p style="font-size:20px">Checks against the <b>real need</b>: “Do students actually want to book 14 days ahead?” Users, demos, UAT answer this.</p>`,
      '✔ Verification', '✔ Validation') + box('Memory trick', '<b>V</b>erification = <b>v</b>ersus the spec. <b>V</b>alidation = <b>v</b>alue for the user.', 'lam') },
  { t: 'Unit, integration, end-to-end — one picture', to: true, giua: true, body: cards([
      ['🧩 Unit test', `One function, no network, no database. <b>Milliseconds.</b><br>${c("checkSlot('06:30', '08:00')")} → ${c('OUTSIDE_HOURS')}`],
      ['🔗 Integration test', `Several parts together: route + rules + a <b>real</b> database. Tens of ms to seconds.<br>${c('POST /bookings')} → a row in PostgreSQL`],
      ['🌐 End-to-end (e2e)', 'A real browser clicks through the real app like a user. <b>Seconds.</b><br>log in → pick a lab → book → see it listed'],
    ], 3) +
    box('', 'Same business rule, three distances from the user. Lesson 0.2 measures the speed difference for real.', 'lam') },
  { t: 'Where it came from (1/2): from a moth to JUnit', giua: true, body: timeline([
      ['1878', 'Edison writes “bug”', 'for a fault in a device'],
      ['1947', 'A real moth', 'in the Harvard Mark II relay'],
      ['1979', 'Myers: testing ≠ debugging', 'The Art of Software Testing'],
      ['1980s', '“Software tester”', 'becomes a profession'],
      ['1997', 'JUnit', 'Beck & Gamma, on a flight'],
      ['1999', 'Extreme Programming', 'tests written first, every day'],
    ]) + `<div class="nho" style="text-align:center">Sources: Wikipedia “Software bug”, “Software testing”, “JUnit”, “Test-driven development”; martinfowler.com/bliki/Xunit.html</div>` },
  { t: 'Where it came from (2/2): JUnit → your tools', giua: true, body: timeline([
      ['2002', 'TDD by Example', 'Kent Beck · ISTQB founded'],
      ['2009', 'Test pyramid', 'Mike Cohn, Succeeding with Agile'],
      ['2014', 'Jest open-sourced', 'built at Facebook in 2011'],
      ['2018', 'Testing trophy', 'Kent C. Dodds'],
      ['2021', 'Vitest 0.0.1', 'first npm release, Dec 2021'],
      ['2023', 'node:test stable', 'in Node.js 20'],
    ], { mau: '#336791' }) + `<div class="nho" style="text-align:center">Sources: martinfowler.com/bliki/TestPyramid.html · engineering.fb.com (2022/05/11) · kentcdodds.com · npm registry · nodejs.org/api/test.html</div>` },
  { t: 'Why automation was born: re-checks keep growing', giua: true, body: two(regress(), `<div style="font-size:21px"><p>Release 1 has 1 feature to re-check. Release 10 has 10 — and a change in feature 10 can break feature 2.</p><p style="margin-top:10px">By hand, the re-check (<b>regression testing</b>) grows every release until the team <span class="do">skips it</span>.</p><p style="margin-top:10px">Written once as code, the machine re-runs <b>all of it</b> on every change.</p></div>`, 'r64') },
  { t: 'What testing gives YOU — this year and at work', to: true, giua: true, body: cards([
      ['🎓 SWT301', 'Lab 2 asks for unit tests (JUnit). The ideas here — AAA, boundaries, decision tables as code — are the same in Java.'],
      ['🧪 LabFlow', 'Your graduation project has business rules (BR-04, 05, 06…). Tests prove them before the defence, not during.'],
      ['💼 Interviews', '“How do you test your API?” is asked in almost every backend interview. You will answer with your own project.'],
      ['🏢 Real teams', 'Pull requests are blocked until CI is green. No tests ⇒ your code cannot be merged.'],
    ], 2) },
  { t: 'Questions you will hear in interviews', to: true, giua: true, body: `<ol>
    <li>What is the difference between a unit test and an integration test?</li>
    <li>What is the test pyramid? Why not mostly end-to-end tests?</li>
    <li>When do you mock, and when do you use the real thing?</li>
    <li>Is 100% code coverage a good goal?</li>
    <li>What is a flaky test and how do you fix one?</li>
    <li>Tell me how you tested your last project.</li></ol>` +
    box('This course', 'Every question has a chapter. Chapter 10 collects them with model answers — built from <b>your</b> LabFlow Lite tests.', 'xanh') },
  { t: 'Your first test in 10 minutes (no install)', body: two(steps([
      `Make a folder ${c('thu-test')} and a file ${c('package.json')} containing ${c('{"type":"module"}')}`,
      `Write ${c('gio.js')} with ${c('parseTime')} (the lesson gives it)`,
      `Write ${c('gio.test.js')} with the two tests on slide 4`,
      `Run ${c('node --test --test-reporter=spec gio.test.js')}`,
      `Break the code on purpose, run again, read the ✖`,
    ]), zm(vt(PASS, { title: 'terminal — Node 22.23.3', sm: false }), 1.2), 'r46') + box('Done when', 'You saw <span class="xanh">✔ ✔</span>, then <span class="do">✖ 1260 !== 1290</span> after breaking it — and you can say why.', 'xanh') },
  { t: 'Key terms and the summary', to: true, giua: true, body: two(`<div style="display:flex;flex-direction:column;gap:10px;font-size:20px;zoom:1.25">
    ${kw('test', 'run + compare + report')} ${kw('assertion', 'the “compare” line')} ${kw('regression', 'something that used to work breaks')}
    ${kw('defect / bug', 'the wrong line')} ${kw('failure', 'the wrong behaviour')} ${kw('unit · integration · e2e', 'three distances')}
    ${kw('test runner', 'program that finds and runs tests')}</div>`,
    `<ul style="font-size:21px"><li>A test compares <b>actual</b> with <b>expected</b></li><li>Automation pays off from the 2nd run on</li><li>Testing shows defects; debugging removes them</li><li>Unit → integration → e2e: slower, closer to the user</li><li>JUnit (1997) → Jest → Vitest / node:test: same idea</li></ul>`, 'r46') },
]);
