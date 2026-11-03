/**
 * ts-08-1 — TypeScript · Chapter 8 · Lesson 8.1 "Partial, Required & Readonly" (04/11/2026). Slug: typescript-8-1-partial-required-readonly.
 * Mọi mã/output lấy từ content/courses/typescript/s08/_ma-ts-08-1.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s08/_ma-ts-08-1.mjs';

export const deck = { key: 'ts-08-1', code: 'TS 8.1', title: 'Partial, Required & Readonly', sub: 'the everyday mapped types, named' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 8 — Utility types', bai: '8.1' }, [
  { cover: true, t: 'Partial, Required &amp; Readonly', sub: 'Chapter 8 · Lesson 8.1 — the everyday mapped types, named' },
  { t: 'What you will take away from this chapter', to: true, giua: true, body: `<ul>
    <li>The library of utility types — the mapped &amp; conditional types of Chapter 7, with names</li>
    <li><b>Partial / Required / Readonly</b>: change the modifiers of every field (this lesson)</li>
    <li><b>Pick / Omit</b> shape a DTO (8.2); <b>Record</b> builds a table (8.3)</li>
    <li><b>Exclude / NonNullable / ReturnType / Parameters / Awaited</b> (8.4)</li>
    <li>Pass <b>Lab 8</b>: rebuild Partial/Pick/Omit, then build the API DTO layer</li></ul>` },
  { t: 'Partial: every field optional', body: ts(pick(CODE.partialPatch, 0, 7), { sm: true, hl: [3] }) + tc(OUT['11-partial'], { title: 'node' }) +
    box('A PATCH body', `${c('Partial<Booking>')} makes every field optional, so a caller sends only what changes. It is ${c('{ [K in keyof T]?: T[K] }')} from 7.2 — one word.`, 'xanh') },
  { t: 'Required: every field mandatory', body: ts(pick(CODE.requiredComplete, 0, 6), { sm: true, hl: [2, 4] }) + tc(OUT['12-required'], { wrap: 80 }) +
    box('-? removes the optional', `${c('Required<Draft>')} makes ${c('body')} and ${c('tags')} required, so a value with only ${c('title')} is <b>TS2739</b>. The plain ${c('Draft')} accepted it.`, 'lam') },
  { t: 'Readonly: every field frozen', body: ts(pick(CODE.readonlyConfig, 0, 7), { sm: true, hl: [5] }) + tc(OUT['13-readonly'], { wrap: 72 }) +
    box('Compile-time, one level deep', `Reassigning ${c('cfg.port')} is <b>TS2540</b>. ${c('Readonly<T>')} is a type-level freeze — Node strips it (${c('Object.freeze')} does the runtime one), and a nested object stays mutable.`, 'lam') },
  { t: 'Utility types compose', body: ts(pick(CODE.combineSnapshot, 0, 7), { sm: true, hl: [3] }) + tc(OUT['14-combine'], { title: 'node' }) +
    box('They nest like functions', `${c('Readonly<Partial<Booking>>')} is a read-only patch — every field optional AND read-only. A small vocabulary covers many shapes because it composes.`, 'xanh') },
  { t: 'Which of the three, when', body: cards([
      [c('Partial<T>'), 'Every field optional — a PATCH body.'],
      [c('Required<T>'), 'Every field required (-?) — missing is TS2739.'],
      [c('Readonly<T>'), 'Every field read-only — reassign is TS2540.'],
      [c('Readonly<Partial<T>>'), 'They compose.'],
      ['Named mapped types', 'Each is one word for a Chapter-7 mapped type.'],
      ['Next · 8.2', 'Pick & Omit — shape a DTO.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A hand-written ${c('UserEdit')} makes the caller resend every field (TS2739). Change the patch parameter to ${c('Partial<User>')} so any subset is accepted.`, 'xanh'),
      box('Remember', `${c('Partial')}/${c('Required')} for optionality, ${c('Readonly')} for immutability — the named mapped types of Chapter 7, and they compose.`, 'lam')) +
    box('Next · 8.2 — Pick & Omit', `Shape one type into another: the create DTO, the public view.`, '') },
]);
