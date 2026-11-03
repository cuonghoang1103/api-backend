/**
 * ts-08-4 — TypeScript · Chapter 8 · Lesson 8.4 "Exclude, NonNullable, ReturnType & Awaited" (04/11/2026). Slug: typescript-8-4-exclude-returntype-awaited.
 * Mọi mã/output lấy từ content/courses/typescript/s08/_ma-ts-08-4.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s08/_ma-ts-08-4.mjs';

export const deck = { key: 'ts-08-4', code: 'TS 8.4', title: 'Exclude, NonNullable, ReturnType & Awaited', sub: 'filter a union; read types from code' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 8 — Utility types', bai: '8.4' }, [
  { cover: true, t: 'Exclude, NonNullable,<br>ReturnType &amp; Awaited', sub: 'Chapter 8 · Lesson 8.4 — filter a union; read types out of code' },
  { t: 'Exclude: remove members from a union', body: ts(pick(CODE.excludeStatus, 0, 5), { sm: true, hl: [3] }) + tc(OUT['11-exclude'], { wrap: 72 }) +
    box('Distributes over the union', `${c("Exclude<Status, 'CANCELLED'>")} is the states a booking can still move to; assigning ${c('CANCELLED')} is <b>TS2322</b>. You derive one union from another, not write a second list.`, 'lam') },
  { t: 'NonNullable: drop null and undefined', body: ts(pick(CODE.nonnullFind, 0, 5), { sm: true, hl: [3] }) + tc(OUT['12-nonnull'], { wrap: 72 }) +
    box('The common filter', `${c('NonNullable<U>')} removes ${c('null')} and ${c('undefined')} — the ${c('Exclude')} you reach for after a guard. Assigning ${c('null')} is TS2322.`, 'lam') },
  { t: 'ReturnType: read a function’s result', body: ts(pick(CODE.returntypeRet, 0, 9), { sm: true, hl: [6] }) + tc(OUT['13-returntype'], { title: 'node' }) +
    box('No second declaration', `${c('ReturnType<typeof checkSlot>')} is ${c('SlotResult')}, read from the function — change it and the type follows. The named form of the ${c('infer')} trick (7.3).`, 'xanh') },
  { t: 'Parameters &amp; Awaited', body: ts(pick(CODE.parametersArgs, 0, 8), { sm: true, hl: [5] }) + tc(OUT['14-parameters'], { title: 'node' }) +
    box('The arguments, and the resolved value', `${c('Parameters<F>')} is the argument tuple; ${c('Awaited<ReturnType<typeof fetchBooking>>')} is ${c('Booking')}, not ${c('Promise<Booking>')} — the type you have after ${c('await')}.`, 'xanh') },
  { t: 'Read types, do not re-declare them', body: cards([
      [c('Exclude<U, M>'), 'The union minus the members you name (distributes).'],
      [c('NonNullable<U>'), 'The union minus null and undefined — after a guard.'],
      [c('ReturnType<F>'), 'A function’s result type, read from its signature.'],
      [c('Parameters<F>'), 'Its argument types, as a tuple to spread back.'],
      [c('Awaited<P>'), 'The value a Promise resolves to — the type after await.'],
      ['Next · Lab 8', 'Rebuild MyPartial/MyPick/MyOmit, then derive the API DTOs.'],
    ], 3) },
  { t: 'Practice &amp; Lab 8', to: true, giua: true, body: two(
      box('🧪 Practice', `A wrapper re-declares ${c('checkSlot')}’s return type by hand and it has drifted (TS2322). Derive it with ${c('ReturnType<typeof checkSlot>')}.`, 'xanh'),
      box('Remember', `${c('Exclude')}/${c('NonNullable')} filter a union; ${c('ReturnType')}/${c('Parameters')}/${c('Awaited')} read types from a function — never re-declare what exists.`, 'lam')) +
    box('Next · Lab 8 — Utility types & the API DTO layer', `Rebuild ${c('MyPartial')}/${c('MyPick')}/${c('MyOmit')}, then build the DTOs.`, '') },
]);
