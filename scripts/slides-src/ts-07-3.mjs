/**
 * ts-07-3 — TypeScript · Chapter 7 · Lesson 7.3 "Conditional types & infer" (03/11/2026). Slug: typescript-7-3-conditional-infer.
 * Mọi mã/output lấy từ content/courses/typescript/s07/_ma-ts-07-3.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s07/_ma-ts-07-3.mjs';

export const deck = { key: 'ts-07-3', code: 'TS 7.3', title: 'Conditional types', sub: 'T extends U ? X : Y, and infer' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 7 — Advanced types', bai: '7.3' }, [
  { cover: true, t: 'Conditional types<br>&amp; infer', sub: 'Chapter 7 · Lesson 7.3 — an if at the type level' },
  { t: 'A condition at the type level', body: ts(pick(CODE.basicIs, 1, 7), { sm: true, hl: [1] }) + tc(OUT['11-basic'], { wrap: 72 }) +
    box('T extends U ? X : Y', `"If T is assignable to U, the type is X, else Y." ${c('IsArray<number>')} is ${c("'single'")}, so assigning ${c("'array'")} to it is <b>TS2322</b>. Same ${c('extends')} as a constraint (6.2).`, 'lam') },
  { t: 'infer: capture a type inside a pattern', body: ts(pick(CODE.elementEl, 1, 10), { sm: true, hl: [1] }) + tc(OUT['12-element'], { wrap: 72 }) +
    box('infer E grabs the element type', `${c('T extends (infer E)[] ? E : T')}: ${c('ElementType<number[]>')} is ${c('number')}, ${c('ElementType<boolean>')} is ${c('boolean')}. Assigning a string to the number one is TS2322.`, 'xanh') },
  { t: 'Capture a function’s return type', body: ts(pick(CODE.retRet, 2, 10), { sm: true, hl: [2, 5] }) + tc(OUT['13-ret'], { title: 'node' }) +
    box('ReturnType, written out', `${c('F extends (…args) => infer R ? R : never')}. ${c('Return<typeof checkSlot>')} is ${c('SlotResult')} — read from the function, so it tracks ${c('checkSlot')} if it changes.`, 'lam') },
  { t: 'Conditionals distribute over a union', body: ts(pick(CODE.distribNonull, 1, 8), { sm: true, hl: [1, 4] }) + tc(OUT['14-distrib'], { wrap: 72 }) +
    box('Applied to each member', `${c('NoNull<string | null | undefined>')} becomes ${c('never | never | string')} = ${c('string')}, so assigning ${c('null')} is TS2322. This is ${c('NonNullable<T>')}.`, 'xanh') },
  { t: 'Looking up a payload by key (Lab 7)', body: ts(pick(CODE.payloadPayload, 1, 8), { sm: true, hl: [2] }) + tc(OUT['15-payload'], { title: 'node' }) +
    box('EventPayloads extends Record<E, infer P>', `${c("PayloadOf<'booking:created'>")} is ${c('{ id; lab }')}, ${c("PayloadOf<'booking:cancelled'>")} is ${c('{ id; reason }')} — the conditional type behind Lab 7’s typed emit.`, 'lam') },
  { t: 'Which pattern, when', body: cards([
      [c('T extends U ? X : Y'), 'Choose a type based on T.'],
      [c('T extends (infer E)[] ? E : T'), 'Capture the element type.'],
      [c('… => infer R ? R : never'), 'ReturnType<F>.'],
      [c('T extends null|undefined ? never : T'), 'NonNullable<T> (distributes).'],
      [c('Map extends Record<E, infer P> ? P'), 'Look a payload up by key.'],
      ['Next · 7.4', 'Template literal string types.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `${c('UnwrapArray')} is typed ${c('any')}, so a wrong value slips. Write it with ${c('T extends (infer E)[] ? E : T')} and the string value fails.`, 'xanh'),
      box('Remember', `A conditional is an ${c('if')} at the type level; ${c('infer')} captures part of T; a conditional over a union distributes to each member.`, 'lam')) +
    box('Next · 7.4 — Template literal types', `Build string types: ${c('booking:ACTION')}, route keys, getter names.`, '') },
]);
