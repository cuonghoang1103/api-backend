/**
 * ts-lab-8 — TypeScript · Chapter 8 · Lab 8 "Utility types & the API DTO layer" (04/11/2026). Slug: typescript-8-6-lab-utility-dto.
 * Mọi mã/output lấy từ content/courses/typescript/s08/_ma-ts-lab-8.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s08/_ma-ts-lab-8.mjs';

export const deck = { key: 'ts-lab-8', code: 'TS Lab 8', title: 'Utility types & the API DTO layer', sub: 'rebuild Partial/Pick/Omit, then the DTOs' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const noc = (s) => L(s).map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');
const grab = (src, first, n) => { const l = L(src); const i = l.findIndex((x) => x.startsWith(first)); return l.slice(i, i + n).join('\n'); };
const score = (out) => L(out).filter((l) => /^(✓|✗).* — |^Score:/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 8 — Utility types', bai: 'Lab 8' }, [
  { cover: true, t: 'Lab 8 — Utility types<br>&amp; the API DTO layer', sub: 'rebuild Partial/Pick/Omit · then derive the DTOs · grader runs tsc & Node' },
  { t: 'The task', to: true, giua: true, body: `<ul>
    <li>Rebuild the three everyday utility types from scratch: ${c('MyPartial')}, ${c('MyPick')}, ${c('MyOmit')}</li>
    <li>Then derive the API DTOs: ${c('CreateBooking')}, ${c('UpdateBooking')}, ${c('PublicUser')}</li>
    <li>A teammate wrote it with ${c('any')} — it compiles, scores <b>5/10</b></li>
    <li>${c('MyOmit')} = ${c('MyPick<T, Exclude<keyof T, K>>')} — three utilities in one line</li>
    <li>Pass mark 7; grader = ${c('npm run lab8')} (tsc 7.0.2 + Node 22.23.3)</li></ul>` },
  { t: 'Zero errors — and why that proves nothing', body: ts(pick(CODE.starter, 2, 10), { sm: true, hl: [2, 3, 4] }) + tc(OUT['l2-starter-tsc'], { title: 'tsc -p lab8/tsconfig.src.json' }) +
    box('any refuses nothing', `The utilities and all three DTOs are ${c('any')}. A create body with an ${c('id')}, a leaked password, a typo'd patch all slip through — a boundary that checks nothing.`, 'do2') },
  { t: 'The grader — the starter scores 5', body: tc(score(OUT['l3-starter']), { title: 'npm run lab8 — the any starter', fs: 15 }) +
    box('E is 0/8', `A, B, D pass (any compiles, runtime works), C fails (any), and every wrong use slips. The point is E: make the utilities and DTOs precise.`, 'lam') },
  { t: 'The eight wrong uses', body: ts(noc(pick(CODE.sai, 2, 10)), { sm: true }) +
    two(box('A bad create or patch body', `S1 a create carrying ${c('id')} → TS2353 · S3 a create missing ${c('seats')} → TS2741 · S5 a patch setting ${c('createdAt')} → TS2353 · S6 a typo'd field → TS2561.`, 'lam'),
      box('A leak or a bad key', `S2 reading ${c('passwordHash')} → TS2339 · S7 a ${c('PublicUser')} as a full ${c('User')} → TS2741 · S4/S8 a non-key in ${c('MyPick')}/${c('MyOmit')} → TS2344.`, 'lam')) },
  { t: 'Attempt A: the DTOs too loose (8/10)', body: tc(score(OUT['l4-yeu']), { title: 'npm run lab8 --from lab8/yeu', fs: 15 }) +
    box('Do not loosen to compile', `The three utilities are right, but both booking DTOs were made ${c('MyPartial<Booking>')} and ${c('MyPick')}’s key is unconstrained: a create may carry ${c('id')} or omit ${c('seats')}, a patch may set ${c('createdAt')}. Derive precisely with ${c('MyOmit')}.`, 'do2') },
  { t: 'Attempt B: an unconstrained MyPick (9.5/10)', body: tc(score(OUT['l5-vua']), { title: 'npm run lab8 --from lab8/vua', fs: 15 }) +
    box('The constraint is the point', `The DTOs are right, 7 of 8 refused. But ${c('MyPick<T, K extends PropertyKey>')} accepts a key that is not there (S4). Use ${c('K extends keyof T')} — that is what makes Pick and Omit refuse a bad key.`, 'lam') },
  { t: 'The reference: 10/10', body: ts(grab(CODE.ref, 'export type MyPartial', 3) + '\n\n' + grab(CODE.ref, 'export type CreateBooking', 3), { sm: true, hl: [1, 2, 3] }) +
    tc(L(OUT['l6-ref']).filter((l) => /Score:/.test(l)).join('\n'), { title: 'npm run lab8 — the reference', fs: 15 }) +
    two(box('Three lines, three DTOs', `${c('MyOmit')} is ${c('MyPick')} over ${c('Exclude')} — three utilities of the chapter in one line.`, 'xanh'),
      box('Derived from the models', `Add a field to ${c('Booking')} and the DTOs gain it; the leak is a compile error, not a review note.`, 'lam')) },
  { t: 'Before you call it done', body: cards([
      [c('npm run lab8'), 'Prints Score: 10/10.'],
      ['No any / as / !', 'DTOs derived, not hand-written.'],
      ['Explain it', 'Which utility refuses each S1–S8.'],
      ['Commit', 'feat(dto): utility-type DTO layer.'],
      ['any = 5, typed = 10', 'A boundary the compiler enforces.'],
      ['Next · Chapter 9', 'tsconfig & the compiler — the strict flags + a CI gate.'],
    ], 3) },
]);
