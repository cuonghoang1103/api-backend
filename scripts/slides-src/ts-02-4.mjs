/**
 * ts-02-4 — TypeScript · Chapter 2 · Lesson 2.4 "Literal types & as const" (01/11/2026). Slug: typescript-2-4-literal-as-const.
 * Mọi mã/output lấy từ content/courses/typescript/s02/_ma-ts-02-4.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c, zm } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s02/_ma-ts-02-4.mjs';

export const deck = { key: 'ts-02-4', code: 'TS 2.4', title: 'Literal types & as const', sub: 'One list, used by the compiler and by Node' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const DTS = L(OUT['03-derive-dts']);

export const slides = lamDeck({ chuong: 'Chapter 2 — The basic type system', bai: '2.4' }, [
  { cover: true, t: 'Literal types<br>&amp; as const', sub: 'Chapter 2 · Lesson 2.4 — one list of lab codes: data for Node, a type for tsc' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Write literal types by hand: ${c('15 | 30 | 60')}, ${c('ok: true')}</li>
    <li>See why a list <b>copied by hand</b> goes stale — while tsc stays silent</li>
    <li>Write the list once: ${c('as const')} + ${c('(typeof LABS)[number]')}</li>
    <li>Get past the ${c('LABS.includes(text)')} error, and check ${c('?lab=')} with a guard</li>
    <li>Complete, read-only lookup tables — and why not ${c('enum')}</li>
    <li>The ${c('readonly')} trap when old code expects ${c('string[]')}</li></ul>` },
  { t: 'A type that is exactly one value', body: ts(pick(CODE.step, 1, 9), { sm: true, hl: [1, 4, 8] }) +
    tc(OUT['01-literal'], { title: 'terminal — tsc 7.0.2', wrap: 100 }) +
    box('You already use this', `Lab 1’s ${c('SlotResult')}: the literal ${c('ok: true')} is how tsc knows ${c('minutes')} exists after ${c('if (!slot.ok) throw')}.`, 'lam') },
  { t: 'The bug: a list copied by hand', body: ts(CODE.copyTypes + '\n\n// check.ts\n' + pick(CODE.copyCheck, 2, 8), { sm: true, hl: [6] }) +
    two(tc(OUT['02-copy'], { title: 'terminal — tsc, then Node', wrap: 60 }),
      box('tsc exit 0, a real lab refused', `The array is ${c('readonly string[]')}: nothing tells tsc it must mirror ${c('LabCode')}. A copy is only checked against itself — like the 08/08 seed.`, 'do2')) },
  { t: 'One source of truth', body: ts(pick(CODE.labs, 0, 3), { hl: [2, 3] }) +
    zm(`<table class="t"><tr><th>Piece</th><th>Read it as</th><th>Here</th></tr>
    <tr><td>${c('as const')}</td><td>keep each element literal, make it read-only</td><td>${c("readonly ['BE-201', 'BE-202', 'AL-301']")}</td></tr>
    <tr><td>${c('typeof LABS')}</td><td>the <b>type</b> of the <b>value</b> LABS</td><td>that read-only tuple</td></tr>
    <tr><td>${c('[number]')}</td><td>the type at any number index</td><td>${c('"AL-301" | "BE-201" | "BE-202"')}</td></tr></table>`, 1.0) +
    tc([DTS[0], DTS[1], DTS[5]].join('\n'), { title: 'labs.d.ts written by tsc — with and without as const', wrap: 92 }) +
    box('Without as const', `The same array is just ${c('string[]')} — and the derived type is just ${c('string')}.`, 'do2') },
  { t: 'What the derived type really is', body: zm(ts(pick(CODE.show, 3, 5), { sm: true }) +
    tc(OUT['03b-derive-show'], { title: 'a wrong value makes tsc print the real type', wrap: 92 }) +
    ts(pick(CODE.grow, 1, 3), { sm: true, hl: [1] }) +
    two(tc(L(OUT['12-grow']).slice(1).join('\n'), { title: 'AL-302 added in ONE line' }),
      box('One line changes', `The array, the type ${c('LabCode')} and the runtime check ${c('isLab')} all follow — no second list to forget.`, 'xanh')), 1.1) },
  { t: 'Trap: LABS.includes(text) does not compile', body: ts(pick(CODE.inclRed, 3, 6), { sm: true, hl: [2] }) +
    tc(L(OUT['04-includes-red']).slice(0, 2).join('\n'), { title: 'terminal — tsc 7.0.2', wrap: 92 }) +
    two(ts(pick(CODE.incl, 4, 9), { hl: [1] }),
      box('Widen honestly', `A list of ${c('LabCode')} <b>is</b> a list of strings, so this assignment is safe and checked — no ${c('as')}, no ${c('any')}, and ${c('as const')} stays.`, 'xanh'), 'r64') },
  { t: 'A guard for data from outside', body: ts(pick(CODE.inclRun, 3, 12), { sm: true, hl: [4, 5] }) +
    two(tc(L(OUT['05-includes']).slice(1).join('\n'), { title: 'node includes/run.ts' }),
      box('as const is compile-time only', `${c('Object.isFrozen(LABS)')} is ${c('false')} at runtime. tsc guards <b>your code</b>; ${c('isLab')} guards <b>outside data</b>.`, 'lam'), 'r64') },
  { t: 'Object maps: one message per code', body: ts(pick(CODE.messages, 4, 13), { sm: true }) +
    tc(OUT['07-map-red'].replace(/'\{ readonly OFF_GRID.*?; \}'/, "'{ readonly OFF_GRID: …; }'"), { title: 'forget TOO_LONG, then edit OFF_GRID', wrap: 92 }) +
    box('keyof typeof', `${c('keyof typeof SLOT_MESSAGES')} = the four codes. A new ${c('SlotCode')} turns this table red until it has a message.`, 'xanh') },
  { t: 'Why not enum?', body: two(ts(pick(CODE.enumTs, 1, 5), { sm: true }), tc([L(OUT['08-enum-tsc'])[1]].join('\n'), { title: 'course tsconfig: erasableSyntaxOnly', wrap: 52 })) +
    ts(pick(CODE.status, 1, 3), { sm: true }) + tc(OUT['09-enum-run'], { title: 'Node runs it as plain JavaScript' }) +
    box('Same names, a runtime list, a type — erased', `${c("label('APPROVED')")} ⇒ TS2345, and a ${c('Status')} parameter still accepts the plain ${c("'CONFIRMED'")} that arrives from JSON.`, 'lam') },
  { t: 'Trap: as const meets an old string[] parameter', body: ts(pick(CODE.print, 2, 8), { hl: [2, 6] }) +
    tc(OUT['10-readonly'], { title: 'terminal — tsc 7.0.2', wrap: 92 }) +
    two(ts('function printLabs(labs: readonly string[]): void { … }', { sm: true }),
      box('Fix the promise, not the data', `A ${c('readonly string[]')} parameter accepts ${c('LABS')} and ordinary arrays alike (measured).`, 'xanh')) },
  { t: 'When to use what', body: cards([
      ['Literal union by hand', `${c("'PENDING' | 'CONFIRMED'")} — code only <b>compares</b>.`],
      ['as const array', `${c('LABS')} + ${c('(typeof LABS)[number]')} — you also <b>loop or validate</b> at runtime.`],
      ['as const object map', `${c('SLOT_MESSAGES')} + ${c('satisfies Record')} — one value per code.`],
      ['Not enum', `Generates code: Node strip-only and ${c('erasableSyntaxOnly')} refuse it.`],
      ['Plain string + guard', `Open input such as ${c('?lab=')} — check it, then it is a ${c('LabCode')}.`],
      ['Next: Lab 2', `The schedule model uses ${c('LABS')}, ${c('TimeRange')} and ${c('string | null')}.`],
    ], 3) },
]);
