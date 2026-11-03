/**
 * ts-05-3 — TypeScript · Chapter 5 · Lesson 5.3 "Discriminated unions & type predicates" (03/11/2026). Slug: typescript-5-3-discriminated-union.
 * Mọi mã/output lấy từ content/courses/typescript/s05/_ma-ts-05-3.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s05/_ma-ts-05-3.mjs';

export const deck = { key: 'ts-05-3', code: 'TS 5.3', title: 'Discriminated unions', sub: 'the tag pattern & type predicates' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 5 — Unions, literals & narrowing', bai: '5.3' }, [
  { cover: true, t: 'Discriminated unions<br>&amp; type predicates', sub: 'Chapter 5 · Lesson 5.3 — LabFlow’s booking state' },
  { t: 'The pattern: one shared tag, per-member data', to: true, giua: true, body: `<ul>
    <li>A booking is <b>drafting</b> → <b>invalid</b> (a code) or <b>pending/confirmed</b> (a record) → <b>cancelled</b> (a reason)</li>
    <li>A <b>discriminated union</b>: one shared field whose literal picks the case</li>
    <li>Each member carries <b>only</b> the data that step has — no illegal states</li>
    <li>${c('BookingState')} is built on Chapter 4’s ${c('BookingRecord')} — the file of <b>Lab 5</b></li>
    <li>Plus <b>type predicates</b>: named, reusable narrowing</li></ul>` },
  { t: 'The discriminated union', body: ts(pick(CODE.labelState, 4, 10), { sm: true, hl: [2, 3, 4, 5, 6] }) + tc(OUT['11-label'], { title: 'node — describe() over three states' }) +
    two(box('step is the discriminant', `Every member shares ${c('step')} with a different literal, so ${c('switch (state.step)')} narrows the whole object.`, 'xanh'),
      box('Per-member data', `${c('code')} only in invalid; ${c('record')} in pending/confirmed/cancelled; ${c('reason')} only in cancelled — a draft cannot carry a record.`, 'lam')) },
  { t: 'No tag, no narrowing', body: ts(pick(CODE.nonarrowBad, 8, 11), { sm: true, hl: [2] }) + tc(OUT['12-nonarrow'], { wrap: 62 }) +
    box('A draft has no record', `Touching ${c('state.record')} without testing the tag is <b>TS2339</b> — "does not exist on type ${c('{ step: \"draft\" }')}". The shape of a draft cannot be used as a pending.`, 'do2') },
  { t: 'Type predicates: naming a narrowing', body: ts(pick(CODE.predicateActive, 8, 12), { sm: true, hl: [2] }) + tc(OUT['13-predicate'], { title: 'node' }) +
    box('state is ActiveState', `The ${c('is')} return tells tsc a true result means an ActiveState. Inside ${c('if (isActive(s))')}, ${c('s.record.id')} is available — reusable, named narrowing.`, 'lam') },
  { t: 'Trap: a predicate is trusted, not checked', body: ts(pick(CODE.lie, 4, 7), { sm: true, hl: [2] }) + tc(OUT['15-lie-run'].split('\n').slice(0, 5).join('\n'), { title: 'node — it crashes', wrap: 64 }) +
    two(box('tsc reports 0 errors', `It believes the ${c('is')} return and never checks the body.`, 'do2'),
      box('…then a TypeError', `The wrong condition narrows to the wrong member, so ${c('s.reason')} is undefined at runtime. Keep predicates simple and tested.`, 'do2')) },
  { t: 'Predicates and Array.filter', body: ts(pick(CODE.filterLive, 13, 16), { sm: true }) + tc(OUT['16-filter'], { title: 'filter(isActive) → ActiveState[]' }) +
    two(box('A predicate narrows the array', `${c('states.filter(isActive)')} is ${c('ActiveState[]')}, so ${c('.map(s => s.record.id)')} needs no guard.`, 'xanh'),
      box('A named boolean does not', `A helper returning plain ${c('boolean')} gives TS2322; an inline arrow guard is inferred as a predicate (TS 5.5+).`, 'lam')) },
  { t: 'Anatomy of a discriminated union', body: cards([
      ['Discriminant', 'One field on every member, a different literal each: step.'],
      ['Per-member data', 'Each member carries only its fields: invalid has code, cancelled has reason.'],
      ['Narrow', 'Test the discriminant (=== / switch) — the object narrows.'],
      ['Type predicate', 'x is T — a named narrowing function; tsc trusts the is.'],
      ['Illegal state', 'A draft with a record is TS2339 / TS2353.'],
      ['Next · 5.4', 'Prove the switch complete with never.'],
    ], 3) },
  { t: 'Coming from Java (PRO192)', giua: true, body: two(
      box('Java: a sealed hierarchy', 'A sealed interface with a record per case, matched by a switch pattern — the compiler checks you covered every case, and that is the familiar part.', 'lam'),
      box('TypeScript: structural', `No shared base class, nothing to instantiate. tsc narrows by the literal value of the ${c('step')} field; the union is just the set of shapes that share that tag.`, 'xanh')) +
    two(box('What carries over', `The intuition "model a lifecycle as a closed set of cases and handle each" is identical — and the exhaustiveness check of 5.4 is the ${c('switch')}-must-cover-all rule made into a compile error.`, 'xanh'),
      box('What is new', `A value fits by shape (4.1), so the same object can satisfy two unrelated unions; there is no ${c('implements')} to write, and nothing exists at runtime to ${c('instanceof')}.`, 'lam')) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `Return the record when a state has one — narrow with ${c("'record' in state")} so it returns the record where there is one and null otherwise.`, 'xanh'),
      box('You now have Lab 5’s data', `The ${c('BookingState')} union, ${c('describe')}, ${c('isActive')}, ${c('recordOf')} — every piece of ${c('src/rules/state.ts')} except the exhaustiveness guard.`, 'lam')) +
    box('Next · 5.4 — Exhaustiveness checking with never', `Make "add a state" a compile error, not a silent bug.`, '') },
]);
