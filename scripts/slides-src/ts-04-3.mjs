/**
 * ts-04-3 — TypeScript · Chapter 4 · Lesson 4.3 "Composing types: extends & intersection" (01/11/2026). Slug: typescript-4-3-extends-intersection.
 * Mọi mã/output lấy từ content/courses/typescript/s04/_ma-ts-04-3.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s04/_ma-ts-04-3.mjs';

export const deck = { key: 'ts-04-3', code: 'TS 4.3', title: 'Composing types', sub: 'extends & intersection' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const noComment = (s) => L(s).filter((l) => !/^\s*\/\//.test(l)).join('\n').replace(/\n\n+/g, '\n');

export const slides = lamDeck({ chuong: 'Chapter 4 — Objects, interfaces & type aliases', bai: '4.3' }, [
  { cover: true, t: 'Composing types:<br>extends &amp; intersection', sub: 'Chapter 4 · Lesson 4.3 — write the shared part once' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A base type ${c('Entity')} — ${c('id')} + ${c('createdAt')} — written <b>once</b></li>
    <li>${c('interface User extends Entity')}, several bases, inherited ${c('readonly')}</li>
    <li>Narrowing an inherited property vs changing it (TS2430)</li>
    <li>A view type: ${c('BookingRecord & { labName; userName }')} + spread</li>
    <li>The trap: an intersection that silently became ${c('never')}</li>
    <li>${c('&')} means <b>and</b>, ${c('|')} means <b>or</b> — count values, not properties</li></ul>` },
  { t: 'Write the shared part once: extends', body: two(ts(pick(CODE.base, 3, 21), { sm: true, hl: [3, 4, 7, 13] }),
      `<div>${box('Entity', `${c('readonly id')}, ${c('readonly createdAt')} — set once by the database, shared by every record.`, 'xanh')}${box('extends', `${c('User extends Entity')} = everything ${c('Entity')} has, plus email, name, role.`, 'lam')}</div>`, 'r64') },
  { t: 'What extends brings along', body: ts(pick(CODE.extendsUse, 2, 5).replace(", email: 'an", ",\n  email: 'an").replace(/ \/\/ the database.*$/m, ''), { sm: true, hl: [3, 4] }) + tc(OUT['11-extends'], { wrap: 100 }) +
    two(box('TS2739', `Form data has no ${c('id')} / ${c('createdAt')} — so it is not a ${c('User')} (Chapter 8: ${c("Omit<User, 'id' | 'createdAt'>")}).`, 'lam'),
      box('TS2540', `${c('User')} never wrote ${c('readonly')} — it was inherited from ${c('Entity')}.`, 'lam')) },
  { t: 'Narrowing is allowed; changing the type is not', body: ts(noComment(pick(CODE.override, 2, 99)), { hl: [2, 6] }) + tc(OUT['12-override'], { wrap: 100 }) +
    two(box(c("role: 'STUDENT'"), `Narrower than ${c('Role')}: every Student is still a valid User. No error.`, 'xanh'),
      box(c('id: string'), 'Would break every function that takes a User. TS2430 <b>at the declaration</b>, naming the property.', 'do2')) },
  { t: 'The intersection: A &amp; B', body: ts(pick(CODE.inter, 3, 9), { sm: true, hl: [1, 5] }) + tc(OUT['13-inter'], { wrap: 100 }) +
    box('“A BookingRecord AND these two fields”', `${c('&')} works with any type. The missing ${c('userName')} is reported against the anonymous right-hand part.`, 'lam') },
  { t: 'A view, derived with spread', body: two(ts(pick(CODE.view, 8, 12).replace('{ ...b, ', '{\n    ...b,\n    ').replace("'AI Lab', ", "'AI Lab',\n    ").replace('user.name };', 'user.name,\n  };'), { sm: true, hl: [2, 3] }), tc(OUT['16-view'], { title: 'node view/run.ts', wrap: 44 }), 'r64') +
    box('Derived, so it cannot drift', `Add a field to ${c('BookingRecord')} and ${c('BookingView')} has it too. A hand-written ${c('interface BookingView')} would fall behind.`, 'xanh') },
  { t: 'Trap: an intersection that became never', body: ts(pick(CODE.conflict, 3, 12), { sm: true, hl: [1, 4] }) + tc(OUT['14-conflict'], { wrap: 100 }) +
    box(`${c('number & string')} = ${c('never')}`, 'Line 4 compiles. The error waits for the first object — on a correct-looking data line, maybe in another file, with no hint where never came from. Use <b>extends</b> to get TS2430 at the cause.', 'do2') },
  { t: '&amp; means “and”, | means “or”', body: ts(noComment(CODE.andor), { hl: [3] }) + tc(OUT['15-andor'], { wrap: 100 }) +
    two(box(c('HasLab & HasSeats'), 'Must have <b>both</b>: more properties, <b>fewer</b> values fit.', 'lam'),
      box(c('HasLab | HasSeats'), 'Must have <b>one</b>: <b>more</b> values fit (Chapter 5).', 'lam')) },
  { t: 'Practice: move the error to its cause', body: ts(pick(CODE.prStart, 3, 4), { sm: true }) + tc(OUT['17-pr-start'], { title: 'with & — the error is on the data (line 7)', wrap: 100 }) +
    ts(pick(CODE.prStep1, 3, 4), { sm: true }) + tc(OUT['18-pr-step1'], { title: 'with extends — the error is on the cause (line 4)', wrap: 100 }) +
    box('The fix', `The supplier’s ${c('"EQ-0042"')} is a different fact: ${c('supplierCode: string')}. Equipment keeps a numeric ${c('id')}.`, 'xanh') },
  { t: 'extends or &amp;?', body: cards([
      [c('interface B extends A'), 'Object shapes with known members. Conflicts: TS2430 at the declaration.'],
      [c('type B = A & { … }'), 'Anything, unions included. Conflicts: never, found later.'],
      ['Entities', `A shared base: ${c('User extends Entity')}.`],
      ['Views', `An existing type plus a few fields: ${c('BookingView')}.`],
      ['Narrowing', `${c("role: 'STUDENT'")} — fine with both.`],
      ['Next · 4.4', `Dictionaries: ${c('{ [code: string]: Lab }')} vs ${c('Record<LabCode, Lab>')}.`],
    ], 3) },
]);
