/**
 * ts-00-1 — TypeScript · Section 0 · Lesson 0.1 "About this course, the LabFlow TS project & the roadmap" (01/11/2026).
 * Slug bài: typescript-0-1-gioi-thieu. Code/output = chạy thật (Node 22.23.3, tsc 7.0.2) — đọc thẳng từ _ma-ts-00-1.mjs.
 */
import { lamDeck, ts, js, tc, two, box, steps, cards, c, zm, flow } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s00/_ma-ts-00-1.mjs';

export const deck = { key: 'ts-00-1', code: 'TS 0.1', title: 'About this course', sub: 'LabFlow TS and the roadmap' };

const L = (s, a, b) => s.split('\n').slice(a - 1, b).join('\n');
const noStack = (s) => s.split('\n').filter((l) => !/^\s+at /.test(l) && l.trim() !== '').join('\n');
const APP = [L(CODE.appJs, 6, 7), '// …', L(CODE.appJs, 13, 16), '// …', L(CODE.appJs, 22, 24), '// …', L(CODE.appJs, 31, 31)].join('\n');
const RULES = L(CODE.bookingJs, 3, 8);

export const slides = lamDeck({ chuong: 'Section 0 — Introduction', bai: '0.1' }, [
  { cover: true, t: 'About this course:<br>LabFlow TS &amp; the roadmap', sub: 'Section 0 · Lesson 0.1 — what you will build, and why it is worth it (measured)' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What you will be able to <b>build</b> when the course ends</li>
    <li>The shared project <b>LabFlow TS</b> — where it comes from, how it grows</li>
    <li>One LabFlow day with <b>four hidden bugs</b>: what Node says vs what ${c('tsc')} says</li>
    <li>A rename, measured: 6 places listed in 0.08 s vs a crash later</li>
    <li>The roadmap: 16 chapters, a Lab per chapter, a final project</li>
    <li>Your first 15 minutes: run the project yourself</li></ul>` },
  { t: 'What you will be able to build', body: cards([
      ['🛠 A typed Express API', 'LabFlow routes, handlers and errors with real types (Ch11)'],
      ['🧩 A React form', 'that shares the SAME types as the API — no copy-paste (Ch12)'],
      ['🛂 Zod at the door', 'one schema = the runtime check AND the type (Ch13)'],
      ['🗄 Prisma types', 'database rows typed all the way to the handler (Ch13)'],
      ['⚙️ A strict tsconfig + CI gate', '<b>tsc --noEmit</b> blocks a red build before it ships (Ch9)'],
      ['🎤 Interview answers', 'any vs unknown, interface vs type, generics, narrowing — with numbers'],
    ], 3) },
  { t: 'The project: LabFlow TS', body: flow([
      { t: 'Node.js', s: 'LabFlow API', mau: '#2f7d4f' },
      { t: 'API Design', s: 'contracts, Zod', mau: '#336791' },
      { t: 'Testing', s: 'LabFlow Lite rules', mau: '#b85a2b' },
      { t: 'TypeScript', s: 'LabFlow TS', mau: '#3178c6' },
    ], { h: 130 }) + js(RULES, { sm: true }) + box('Same rules, now typed', `Chapter 1 takes ${c('js/time.js')} + ${c('js/booking.js')} from LabFlow Lite and turns them into TypeScript — BR-04 grid and opening hours, BR-05 booking window, BR-06 approval above 30 seats.`, 'lam') },
  { t: 'The project on disk (end of Chapter 1)', body: two(tc(OUT['15-cay'], { title: 'a fresh copy, no node_modules', wrap: 34 }),
      `<div>${box('Three kinds of folder', `<b>js/</b> the original JavaScript · <b>src/</b> the TypeScript version (always green) · <b>lab1/</b> your Chapter 1 lab, graded by ${c('scripts/cham-lab-1.mjs')}.`, 'lam')}${box('Two tools only', `${c('typescript@7.0.2')} checks, Node 22.23.3 runs ${c('.ts')} directly. Lesson 0.3 sets it up from zero.`, 'xanh')}</div>`, 'r46') },
  { t: 'One LabFlow day, four hidden bugs (JavaScript)', body: js(APP, { sm: true, hl: [2, 6, 10, 13] }) +
    box('Spot them?', `${c('b.minute')} (typo) · ${c('{ seat: … }')} (misspelled property) · ${c("'lecturer'")} (roles are upper-case) · ${c("'APPROVED'")} (no such status).`, 'do2') },
  { t: 'What JavaScript says', body: two(tc(OUT['01-js-small'], { title: 'node app.js small' }), tc(noStack(OUT['02-js-big']), { title: 'node app.js big — the student-class path runs', wrap: 52 })) +
    box('Three bugs are silent, one waits for a big class', `${c('NaN')} usage, a lecturer who "needs approval", 0 approved bookings — exit code 0. The ${c('seat')} typo only crashes when a 40-seat student request arrives.`, 'do2') },
  { t: 'What TypeScript says', body: tc(OUT['03-tsc'], { title: 'npx tsc -p demo0/ts-00-1 — nothing is run', wrap: 92 }) +
    two(box('All four, before running', 'File, line, column, error code — and three of them even suggest the fix ("Did you mean…?").', 'xanh'),
      box('Measured cost', `${c('tsc')} itself: 0.07–0.08 s (two runs). Through ${c('npx')}: 0.31–0.33 s.`, 'lam')) },
  { t: 'A rename, measured', body: two(tc(OUT['05-doi-ten'], { title: 'rename seats → seatCount in the types', wrap: 60 }),
      `<div>${tc(noStack(OUT['07-doi-ten-js-call']), { title: 'the same rename in JavaScript', wrap: 46 })}${box('6 places, 2 files', 'tsc lists every call site. JavaScript loads fine (11 exports) and crashes only when a booking is made.', 'xanh')}</div>`, 'r64') },
  { t: 'The scoreboard', body: zm(`<table class="t"><tr><th>Bug</th><th>node (JavaScript)</th><th>tsc 7.0.2</th></tr>
    <tr><td>${c('b.minute')}</td><td>silent — usage ${c('NaN')}</td><td>TS2551 · Did you mean 'minutes'?</td></tr>
    <tr><td>${c('{ seat: 40 }')}</td><td>RangeError — only on the big-class path</td><td>TS2561 · Did you mean to write 'seats'?</td></tr>
    <tr><td>${c("role: 'lecturer'")}</td><td>silent — lecturer "needs approval"</td><td>TS2820 · Did you mean '"LECTURER"'?</td></tr>
    <tr><td>${c("=== 'APPROVED'")}</td><td>silent — always 0</td><td>TS2367 · no overlap</td></tr>
    <tr><td>rename ${c('seats')}</td><td>loads; crashes when called</td><td>6 errors, 2 files, every place</td></tr></table>`, 1.08) +
    box('And yet', `${c('node app.ts')} still runs and still prints ${c('NaN')}: Node strips the types without checking them. The check is a separate step (lesson 0.4).`, 'do2') },
  { t: 'The roadmap: 16 chapters in 4 stages', body: cards([
      ['1 · Foundations (Ch1–4)', 'Why TypeScript exists · the basic type system · functions · objects, interfaces &amp; type aliases'],
      ['2 · The real type system (Ch5–8)', 'Unions &amp; narrowing · generics · advanced types · utility types'],
      ['3 · In practice (Ch9–12)', 'tsconfig &amp; the compiler · modules &amp; .d.ts · a Node/Express backend · React'],
      ['4 · Mastery (Ch13–16)', 'Zod &amp; Prisma · classes &amp; decorators · build performance · architecture'],
    ], 2) + box('Every chapter', 'lessons with slides → practice with real output → Code Lab exercises → a Lab with a grader (pass 7/10) → a 10-question quiz. Chapter 16 ends with the final project: LabFlow TS full-stack.', 'lam') },
  { t: 'Your first 15 minutes', body: two(steps([
      `copy the project, ${c('npm ci')}`,
      `${c('npm run typecheck')} — silence means 0 errors`,
      `${c('npm test')} — 10 tests pass`,
      `${c('npm run lab1')} — 2.5/10, and that is expected`,
    ]), tc(OUT['14-lab1'].split('\n').slice(-11).join('\n'), { title: 'npm run lab1 — the starter, before you touch it', wrap: 56 })) +
    box('Why a low score is good news', 'The grader already works on day one. Chapter 1 takes it from 2.5 to 10 — one lesson at a time.', 'xanh') },
]);
