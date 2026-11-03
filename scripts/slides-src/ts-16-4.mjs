/** ts-16-4 — TypeScript · Chapter 16 · Lesson 16.4 "The whole picture & where to go next". Slug: typescript-16-4-whole-picture. _ma: s16/_ma-ts-16-4.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s16/_ma-ts-16-4.mjs';
export const deck = { key: 'ts-16-4', code: 'TS 16.4', title: 'The whole picture & where to go next', sub: 'let the compiler hold the invariants' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 16 — Architecture & type-driven design', bai: '16.4' }, [
  { cover: true, t: 'The whole picture<br>&amp; where to go next', sub: 'Chapter 16 · Lesson 16.4 — sixteen chapters, one idea' },
  { t: 'Every habit, in one slice', body: ts(pick(CODE.together, 1, 11), { sm: true, hl: [1, 3, 4] }) + tc(OUT['11-together'], { title: 'node' }) +
    box('They compose', `A branded ${c('LabCode')} (16.1), a ${c('readonly Booking')} (8), a ${c('Result<T>')} discriminated union (5, 6) — the whole course in one function.`, 'xanh') },
  { t: 'The discriminant still does the work', body: ts(CODE.wrongtogether, { sm: true, hl: [4] }) + tc(OUT['12-wrongtogether'], { wrap: 72 }) +
    box('TS2339', `Read ${c('r.data')} without narrowing on ${c('ok')} and the error branch has none. Chapter 5, the API envelope (11), ${c('safeParse')} (13) — one tag, narrowed.`, 'lam') },
  { t: 'A trusted core behind validated edges', to: true, giua: true, body: `<ul>
    <li>Types are erased at run time — the invariants hold only if every <b>boundary validates</b></li>
    <li>Zod at the request (13) · Prisma at the database (13) · branded constructors at the edges (16.1)</li>
    <li>Inside those boundaries you <b>trust the types completely</b>; across them you validate</li>
    <li>That is the architecture — a trusted core behind validated edges</li></ul>` },
  { t: 'Where to go next', body: cards([
      ['Zod in depth', 'Refinements, transforms, unions.'],
      ['A typed API end to end', 'tRPC or an OpenAPI generator.'],
      ['satisfies', 'Check a value against a type without widening it.'],
      ['const type parameters', 'Keep literal types through a generic.'],
      ['type-challenges', 'Sharpen the type system with puzzles.'],
      ['Next · Final Project', 'Assemble LabFlow TS full-stack.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A generic ${c('dataOr')} reads ${c('r.data')} without narrowing — TS2339; return ${c('r.ok ? r.data : fallback')} and it runs.`, 'xanh'),
      box('One idea', `Let the compiler hold the invariants — move a class of bugs from run time to compile time.`, 'lam')) +
    box('Next · Final Project', `Assemble LabFlow TS full-stack and score it out of 100 — your capstone.`, '') },
]);
