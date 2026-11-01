/**
 * ts-01-4 — TypeScript · Chapter 1 · Lesson 1.4 "any, unknown & adopting TypeScript gradually" (01/11/2026). Slug: typescript-1-4-any-unknown.
 * Mã + output lấy THẲNG từ content/courses/typescript/s01/_ma-ts-01-4.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, three, box, cards, vsd, c, zm, tbl } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s01/_ma-ts-01-4.mjs';

export const deck = { key: 'ts-01-4', code: 'TS 1.4', title: 'any, unknown & adopting TypeScript gradually', sub: 'The off switch, the safe door, and how real teams migrate' };

const bo = (s, n) => s.split('\n').slice(n).join('\n');               // bỏ n dòng đầu (chú thích)
const vua = (s, a, b) => s.split('\n').slice(a, b).join('\n');
const NODE_ANY = OUT['41-any-node'].split('\n').filter((l, i) => i === 0 || /^TypeError/.test(l)).join('\n…\n');
// Bảng S1–S8: dựng từ hai lần chạy THẬT của máy chấm Lab 1 (khởi đầu vs "mọi chỗ any"), không gõ tay.
const dong = (k) => OUT[k].split('\n').map((l) => /^\s+(✓|✗) (S\d) (.*) — expected (TS\d+), got (.*)$/.exec(l)).filter(Boolean);
const A = dong('43-cham-khoi-dau'), B = dong('43-cham-yeu');
const o = (m) => m[1] === '✓' ? '<span class="xanh">✓ ' + m[5] + '</span>' : '<span class="do">✗ no error</span>';
const BANG_E = A.map((m, i) => [m[2], m[3], m[4], o(m), o(B[i])]);
const TONG_A = A.filter((m) => m[1] === '✓').length, TONG_B = B.filter((m) => m[1] === '✓').length;

export const slides = lamDeck({ chuong: 'Chapter 1 — Why TypeScript exists', bai: '1.4' }, [
  { cover: true, t: 'any, unknown &amp; <br>adopting TypeScript gradually', sub: 'Chapter 1 · Lesson 1.4 — the off switch, the safe door, and a real migration' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why ${c('any')} is an <b>off switch</b> — and how it spreads</li>
    <li>A measured surprise: adding ${c('any')} made LabFlow’s checker <b>weaker than doing nothing</b></li>
    <li>${c('unknown')} — the safe door: check first, then use</li>
    <li>Implicit ${c('any')} (refused) vs explicit ${c('any')} (allowed — the dangerous one)</li>
    <li>Three ways to adopt TypeScript gradually, with real error counts</li>
    <li>The double cast ${c('as any as X')} — and the order real teams migrate in</li></ul>` },
  { t: 'any is the off switch', body: ts(bo(CODE.anyOff, 1), { sm: true, hl: [4, 5, 6] }) +
    two(tc(OUT['41-any-tsc'] + '\n[exit 0]', { title: 'tsc — no errors at all' }), tc(NODE_ANY, { title: 'node — the first bug crashes', wrap: 52 }), 'r37') +
    box('Three bugs, zero errors', `${c('any')} is assignable to and from everything, so tsc checks nothing that touches ${c('x')}. You learn about the bugs one crash at a time.`, 'do2') },
  { t: 'any spreads: JSON.parse returns any', body: ts(bo(CODE.contagion, 2), { sm: true, hl: [3, 5, 6, 9] }) +
    two(tc(vua(OUT['42-lan-node'], 0, 2) + '\n…\nTypeError: bookings is not iterable', { title: 'node demo1/ts-01-4/2-lan/contagion.ts', wrap: 56 }),
      box('Read the output', `${c('"lecturer"')} sailed into ${c('createBooking')}: the lecturer is <b>PENDING</b> (wrong, silently). ${c('seatsText')} is a number in a string slot. Then ${c('usageRate(undefined)')} crashes.`, 'do2')) },
  { t: 'Proof: ask tsc what the loaders return', body: ts(bo(CODE.load, 1), { sm: true, hl: [1, 5, 11] }) +
    two(tc(bo(OUT['42-dts'], 1), { title: 'declarations tsc wrote (load.d.ts)', wrap: 40 }), box('The type of a value is contagious', `${c('loadBookings')} returns ${c('any')} ⇒ ${c('total')} and ${c('first')} are ${c('any')} ⇒ the typo ${c('.minute')} passes. Returning ${c('unknown')} stops the spread at the door.`, 'lam'), 'r46') },
  { t: 'Measured: any made the checker weaker', body: tbl(['', 'Wrong call in kiem/sai.ts', 'Want', 'Untouched starter', 'Every parameter : any'],
    [...BANG_E, ['', '<b>refused</b>', '', `<b>${TONG_A}/8</b>`, `<b>${TONG_B}/8</b>`]], { hl: [8] }) +
    box(`${TONG_A} of 8 → ${TONG_B} of 8`, `Even untyped, tsc inferred enough from the code itself to refuse ${TONG_A} wrong calls. Writing ${c(': any')} everywhere told it to stop looking — and it refused only ${TONG_B}. (Real runs of ${c('node scripts/cham-lab-1.mjs')}.)`, 'do2') },
  { t: 'unknown is the safe door', body: ts(bo(CODE.unknown1, 1), { sm: true, hl: [5, 6] }) +
    tc(OUT['44-unknown-tsc'] + '\n[exit 1]', { title: 'npx tsc', wrap: 98 }) +
    box('Same value, opposite rule', `Anything can go INTO ${c('unknown')}. Nothing comes OUT until you prove what it is. ${c('any')} trusts you; ${c('unknown')} makes you check.`, 'xanh') },
  { t: 'Narrow unknown before you use it', body: ts(bo(CODE.unknown2, 1), { sm: true, hl: [4, 6, 7, 11] }) +
    three(tc(OUT['44-unknown-node'], { title: 'node — compiles clean', wrap: 26 }),
      box('Tools you know from JS', `${c('typeof')} · ${c('!== null')} · ${c('in')} · ${c('Array.isArray')} — each one shrinks the type.`, 'lam'),
      box('Leak to know', `${c('Array.isArray(unknown)')} gives ${c('any[]')} — type the elements ${c('unknown')} too.`, 'do2')) },
  { t: 'Implicit any vs explicit any', body: vsd(
    `${ts(bo(CODE.explicit, 1), { sm: true })}<p style="font-size:20px;margin:8px 0 0">tsc: <b>0 errors</b>. You wrote ${c('any')}, so the nonsense call is allowed.</p>`,
    `${ts(bo(CODE.implicit, 1), { sm: true })}${tc(bo(OUT['45-ngam-tsc'], 1), { title: 'tsc', wrap: 44 })}`,
    '✗ Explicit any — allowed', '✓ Implicit any — refused (strict)') +
    box('noImplicitAny is part of strict', `Under ${c('strict')} (the TypeScript 7 default) tsc will not <i>guess</i> ${c('any')} for you. But it never stops you from <i>writing</i> it — that is a decision only code review and lint rules catch.`, 'lam') },
  { t: 'Three ways to adopt TypeScript gradually', body: zm(tbl(['Path', 'What you change', 'Measured on LabFlow (js/ files + 3 wrong calls)'], [
    ['A · checkJs', `${c('allowJs')} + ${c('checkJs')}, files stay .js`, '14 errors: 13 implicit any + 1 real bug (seat)'],
    ['A+ · JSDoc', `${c('/** @param {string} start */')} in the .js`, '3 errors = all 3 wrong calls; node runs the file as is'],
    ['B · rename, strict', '.js → .ts, strict (TS 7 default)', '14 errors: 6 × TS7006, 7 × TS7031, 1 × TS2561'],
    ['B · rename, not strict', `${c('"strict": false')}`, '1 error — the 13 holes became silent any'],
    ['C · strict from day one', 'new code starts in .ts', 'no holes to find later'],
  ]), 1.12) + box('Rule', 'Move fast on the files, never on the strictness: a non-strict migration reports 1 problem where strict reports 14.', 'xanh') },
  { t: 'Trap: as any as X switches the checker off', body: ts(bo(CODE.doubleCast, 1), { sm: true, hl: [4, 5, 6] }) +
    two(tc(OUT['47-ep-kieu-tsc'].split('\n').slice(0, 2).join('\n'), { title: 'tsc — only the single cast is refused', wrap: 56 }),
      tc(OUT['47-ep-kieu-node'], { title: 'node — the double cast lets NaN through' })) },
  { t: 'Migration order real teams use', body: cards([
    ['1 · Type the edges', 'Parameters and exported return types first — that is where values enter and leave a module.'],
    ['2 · unknown at the boundary', 'JSON.parse, request bodies, files, env: type them unknown and narrow (Ch13: Zod does it for you).'],
    ['3 · Strict on, never off', 'Fix the reds file by file; a red you silence with any is a bug you will meet in production.'],
    ['4 · Ban any in review', 'Search the diff for any, as any, @ts-ignore. Each one needs a comment saying why.'],
    ['5 · Connect every copy', 'Import types, never retype them by hand — this website’s seed broke on 08/08/2026 from one hand-made copy (lesson 0.9).'],
    ['6 · Measure', 'Count errors and any per step, like the table two slides back. Progress you can show.'],
  ], 3) },
]);
