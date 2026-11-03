/** ts-16-3 — TypeScript · Chapter 16 · Lesson 16.3 "Organizing types". Slug: typescript-16-3-organizing-types. _ma: s16/_ma-ts-16-3.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s16/_ma-ts-16-3.mjs';
export const deck = { key: 'ts-16-3', code: 'TS 16.3', title: 'Organizing types', sub: 'type or interface, and where they live' };
export const slides = lamDeck({ chuong: 'Chapter 16 — Architecture & type-driven design', bai: '16.3' }, [
  { cover: true, t: 'Organizing types', sub: 'Chapter 16 · Lesson 16.3 — where a type lives matters as much as what it says' },
  { t: 'type vs interface: redeclaration', body: ts(CODE.typeredecl, { sm: true, hl: [2, 3] }) + tc(OUT['11-typeredecl'], { wrap: 72 }) +
    box('TS2300 · a single definition', `A ${c('type')} alias is one name, one shape. Use it for unions, tuples, mapped and conditional types — everything that is not just an object shape.`, 'lam') },
  { t: 'interface: declaration merging', body: ts(CODE.interfacemerge, { sm: true, hl: [2, 3] }) + tc(OUT['12-interfacemerge'], { title: 'node' }) +
    box('Merge, on purpose', `Two interfaces of the same name merge — the mechanism behind augmentation (Chapter 10’s ${c('Request.user')}). Use ${c('interface')} for shapes you may extend.`, 'xanh') },
  { t: 'Where types live', to: true, giua: true, body: `<ul>
    <li>Keep a type <b>next to what it describes</b> — the model’s type beside the model, a DTO beside its route</li>
    <li>Re-export the public ones through a <b>barrel</b> (<b>export type</b> from 15.3)</li>
    <li>Every consumer imports the <b>same name from one place</b></li>
    <li>A type imported from two files is two types that will <b>drift</b> — one source, one import</li></ul>` },
  { t: 'At a glance', body: cards([
      [c('type'), 'A single definition — redeclaring is TS2300.'],
      ['use type for', 'Unions, tuples, mapped & conditional types.'],
      [c('interface'), 'Merges on redeclaration — the augmentation mechanism.'],
      ['use interface for', 'Object shapes you may extend or augment.'],
      ['one source', 'Keep a type next to what it describes; one barrel.'],
      ['Next · 16.4', 'The whole picture.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A ${c('type Lab')} is declared twice — TS2300; merge the two shapes into one definition and it runs.`, 'xanh'),
      box('Remember', `${c('type')} for everything (single definition); ${c('interface')} for object shapes you augment (merges).`, 'lam')) +
    box('Next · 16.4 — The whole picture', `How every chapter’s habit fits into one type-driven codebase.`, '') },
]);
