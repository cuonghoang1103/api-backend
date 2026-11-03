/** ts-13-3 — TypeScript · Chapter 13 · Lesson 13.3 "Schema as the single source of truth". Slug: typescript-13-3-schema-source-of-truth. _ma: s13/_ma-ts-13-3.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s13/_ma-ts-13-3.mjs';
export const deck = { key: 'ts-13-3', code: 'TS 13.3', title: 'Schema as the single source of truth', sub: 'derive the type, never copy it' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 13 — Runtime validation: Zod & Prisma', bai: '13.3' }, [
  { cover: true, t: 'Schema as the<br>single source of truth', sub: 'Chapter 13 · Lesson 13.3 — one definition, computed not copied' },
  { t: 'Derive the type, do not copy it', body: ts(pick(CODE.infer, 1, 8), { sm: true, hl: [3] }) + tc(OUT['11-infer'], { title: 'node' }) +
    box('One source of truth', `Define the schema, then ${c('z.Infer<typeof BookingInput>')}. Add a field to the schema and every function typed ${c('BookingInput')} updates for free.`, 'xanh') },
  { t: 'A hand-written copy drifts', body: ts(CODE.drift, { sm: true, hl: [4, 7] }) + tc(OUT['12-drift'], { wrap: 74 }) +
    box('TS2741 · the drift made visible', `A hand-written type with a ${c('purpose')} the schema never added disagrees with the parsed value — caught at the seam, not by a user later.`, 'lam') },
  { t: 'Computed types cannot drift', to: true, giua: true, body: `<ul>
    <li>This is Chapter 9’s seed incident at the boundary: a copied union drifting from the generated one</li>
    <li>A type <b>computed from</b> a source of truth cannot drift; a type that <b>copies</b> one will</li>
    <li>Zod’s <b>Infer</b>, Prisma’s generated types (13.4), Chapter 7’s <b>mapped types</b> — all the computed kind</li>
    <li>Reach for them wherever a tool already owns the shape</li></ul>` },
  { t: 'At a glance', body: cards([
      ['one source', 'Define the schema once; derive the type from it.'],
      ['z.Infer<typeof s>', 'Computed from the schema — always in step.'],
      ['a copy drifts', 'A hand-written duplicate that disagrees is TS2741.'],
      ['computed, not copied', 'Infer, Prisma types, mapped types — cannot drift.'],
      ['Chapter 9’s lesson', 'The seed incident was a copied union drifting.'],
      ['Next · 13.4', 'Prisma generates the database types.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A hand-written type claims a ${c('name')} the schema never had — TS2741; replace it with ${c('z.Infer<typeof UserInput>')} and it runs.`, 'xanh'),
      box('Remember', `A computed type cannot drift; a copied one will — prefer derived types everywhere a tool owns the shape.`, 'lam')) +
    box('Next · 13.4 — Types from Prisma', `Prisma generates the types for your database models — the server-side twin of Zod at the boundary.`, '') },
]);
