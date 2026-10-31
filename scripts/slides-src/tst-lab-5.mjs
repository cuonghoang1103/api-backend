/**
 * tst-lab-5 — Testing · Chapter 5 · Lab 5 "API tests: kill 8 mutants" (01/11/2026). Slug bài: tst-5-5-lab-api.
 * Output = chạy thật: bộ yếu 4 test xanh → 0/8; lời giải 12 test → 8/8; npm run test:unit 85 xanh.
 */
import { lamDeck, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-lab-5', code: 'TST Lab 5', title: 'Lab 5 — API tests', sub: 'kill 8 mutants in routes, auth and errors' };

const WEAK_RUN = ` ✓ src/weak5.test.js (4 tests) 66ms
   ✓ creates a booking 34ms
   ✓ the owner can read the booking 26ms
   ✓ requests without a token fail 2ms
   ✓ a wrong booking is refused 3ms`;
const WEAK = `✘ SURVIVED  #1 lecturers can read anyone's booking
✘ SURVIVED  #2 anyone can read anyone's booking (IDOR)
✘ SURVIVED  #3 forbidden answered as 401
✘ SURVIVED  #4 unknown fields (role) silently accepted
✘ SURVIVED  #5 created answered as 200
✘ SURVIVED  #6 no Location header
✘ SURVIVED  #7 taken slot answered as 400
✘ SURVIVED  #8 expiry checked against the real clock, not the given one

0/8 mutants killed`;
const STRONG = `✔ killed    #1 lecturers can read anyone's booking
✔ killed    #2 anyone can read anyone's booking (IDOR)
✔ killed    #3 forbidden answered as 401
✔ killed    #4 unknown fields (role) silently accepted
✔ killed    #5 created answered as 200
✔ killed    #6 no Location header
✔ killed    #7 taken slot answered as 400
✔ killed    #8 expiry checked against the real clock, not the given one

8/8 mutants killed`;

export const slides = lamDeck({ chuong: 'Chapter 5 — Testing HTTP APIs', bai: 'Lab 5' }, [
  { cover: true, t: 'Lab 5 — API tests:<br>kill 8 mutants', sub: 'Chapter 5 lab · 75 minutes · graded by a script, not by opinion' },
  { t: 'Your mission', to: true, giua: true, body: steps([
      `Write ${c('src/api/server.test.js')} for the LabFlow Lite API with Supertest`,
      'Real tokens, a fresh app per test, exact statuses, headers and bodies',
      `Run ${c('node scripts/dot-bien-5.mjs')}: 8 bugs in routes, auth and error mapping`,
      'A good suite turns red for every one — 8/8 “killed”',
    ]) + box('New this time', 'Half of the bugs are about security: two ways to read other people’s data, a 403 turned into 401, and an expiry check that ignores the clock it is given.', 'do2') },
  { t: 'The 8 planted bugs', body: zm(`<table class="t" style="font-size:17px"><tr><th>#</th><th>File</th><th>Planted bug</th><th>What a user would notice</th></tr>
    <tr><td>1</td><td>server.js</td><td>${c("role !== 'STUDENT'")} may read any booking</td><td>lecturers see students’ bookings</td></tr>
    <tr><td>2</td><td>server.js</td><td>${c('if (!booking)')} instead of ${c('if (!mine)')}</td><td>anyone reads anyone’s booking</td></tr>
    <tr><td>3</td><td>server.js</td><td>403 answered as 401</td><td>the app asks a logged-in user to log in again</td></tr>
    <tr><td>4</td><td>schemas.js</td><td>${c('z.object')} instead of ${c('z.strictObject')}</td><td>extra fields silently dropped</td></tr>
    <tr><td>5</td><td>server.js</td><td>201 → 200</td><td>clients treat “created” as “read”</td></tr>
    <tr><td>6</td><td>server.js</td><td>no Location header</td><td>the app cannot open the new booking</td></tr>
    <tr><td>7</td><td>server.js</td><td>OVERLAP → 400</td><td>“your request is wrong” instead of “slot taken”</td></tr>
    <tr><td>8</td><td>auth.js</td><td>expiry ignores the given clock</td><td>nothing today — but expiry can no longer be tested</td></tr></table>`, 1.02) },
  { t: 'A typical first attempt: 0 of 8', body: vt(WEAK_RUN, { title: 'terminal — 4 tests, all green', fs: 16 }) +
    two(vt(WEAK, { title: 'node scripts/dot-bien-5.mjs', fs: 12 }), box('Why nothing was caught', `${c('toBeLessThan(300)')} and ${c('toBeGreaterThanOrEqual(400)')} accept the wrong status; only the owner ever reads; no other roles, no headers, no clock.`, 'do2'), 'r64') },
  { t: 'The reference solution: 8 of 8', body: two(`<div>${vt(STRONG, { title: '12 tests in src/api/server.test.js', fs: 12 })}${vt(' Test Files  10 passed (10)\n      Tests  85 passed (85)', { title: 'npm run test:unit — whole project', fs: 15 })}</div>`, box('What made the difference', `<ul style="font-size:19px"><li>exact statuses: 201, 400, 401, 403, 404, 409, 422</li><li>a table: owner, other student, lecturer, admin</li><li>Location and the full body</li><li>a role in the body → 400</li><li>an expired token with a fixed clock</li></ul>`, 'xanh'), 'r64') },
  { t: 'Rubric (10 points)', body: zm(`<table class="t"><tr><th>Criterion</th><th>Points</th><th>How it is checked</th></tr>
    <tr><td>Mutants killed</td><td>4 (0.5 each)</td><td>${c('node scripts/dot-bien-5.mjs')}</td></tr>
    <tr><td>Access control as a table: every role × own / other’s data; admin route</td><td>2</td><td>read the tests</td></tr>
    <tr><td>Exact statuses, Location, full bodies (no “&lt; 300”)</td><td>2</td><td>read the tests</td></tr>
    <tr><td>Real tokens with a test secret; a fixed clock for expiry</td><td>1</td><td>no auth mocks</td></tr>
    <tr><td>Fresh app per test, no listen() in tests, under 1 second</td><td>1</td><td>${c('npm run test:unit')}</td></tr></table>`, 1.05) },
  { t: 'Hints, from gentle to strong', to: true, body: steps([
      `Write ${c('it.each')} rows: who asks, for whose data, which status`,
      'Never use a range for a status — write the exact number',
      `Send ${c('role: "ADMIN"')} in a body and expect 400`,
      `Use ${c('makeApi({ now: () => clock })')} and move ${c('clock')} past the expiry`,
      `Check the ${c('Location')} header and the full body with ${c('toEqual')}, not only the status`,
    ]) },
  { t: 'Before you call it done', to: true, giua: true, body: `<ul>
    <li>${c('npm run test:unit')} green, no listen() in any test</li>
    <li>${c('node scripts/dot-bien-5.mjs')} prints <b>8/8 mutants killed</b></li>
    <li>Labs 1–3 still print 8/8</li>
    <li>${c('git diff src/')} shows only test files</li>
    <li>Commit: ${c('test: LabFlow Lite HTTP API (Lab 5, 8/8)')}</li></ul>` },
]);
