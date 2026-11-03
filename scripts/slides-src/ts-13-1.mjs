/** ts-13-1 — TypeScript · Chapter 13 · Lesson 13.1 "The boundary problem & Zod". Slug: typescript-13-1-boundary-zod. _ma: s13/_ma-ts-13-1.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s13/_ma-ts-13-1.mjs';
export const deck = { key: 'ts-13-1', code: 'TS 13.1', title: 'The boundary problem & Zod', sub: 'a schema validates and infers' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 13 — Runtime validation: Zod & Prisma', bai: '13.1' }, [
  { cover: true, t: 'The boundary problem &amp; Zod', sub: 'Chapter 13 · Lesson 13.1 — a schema validates and infers' },
  { t: 'A schema validates and infers', body: ts(pick(CODE.parse, 1, 8), { sm: true, hl: [2, 7] }) + tc(OUT['11-parse'], { title: 'node' }) +
    box('One definition, both jobs', `Types are erased at run time, so external data is ${c('unknown')} and ${c('as T')} checks nothing. A schema is a value (${c('z.object')}) and a type (${c('z.Infer')}) at once.`, 'xanh') },
  { t: 'The inferred type has exactly the schema', body: ts(CODE.wrongfield, { sm: true, hl: [5] }) + tc(OUT['12-wrongfield'], { wrap: 74 }) +
    box('TS2339 · not a loose any', `Read ${c('booking.purpose')} when the schema has only ${c('lab')} and ${c('seats')} and it is refused. ${c('z.Infer')} is precisely what the schema allows.`, 'lam') },
  { t: 'Invalid data is rejected at run time', body: ts(CODE.badinput, { sm: true, hl: [5] }) + tc(OUT['13-badinput'], { title: 'node' }) +
    box('The check `as` skipped', `Static types cannot stop bad data that only exists at run time. Parse a body whose ${c('seats')} is a string and the schema throws — the boundary where a type and a run-time check must agree.`, 'lam') },
  { t: 'Zod, at a glance', body: cards([
      ['the boundary', 'External data is unknown; as T is a promise, not a check.'],
      ['validate + infer', 'z.object is a value; z.Infer is a type — one definition.'],
      ['exact shape', 'The inferred type has only the schema’s fields — a typo is TS2339.'],
      ['run-time guard', 'Invalid data makes parse throw.'],
      ['the real thing', 'zod adds email/min/optional/refine — same shape.'],
      ['Next · 13.2', 'parse throws; safeParse returns a result.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A schema has ${c('code')}, but the code reads ${c('lab.name')} — TS2339; read ${c('lab.code')} and it runs.`, 'xanh'),
      box('Remember', `A schema validates AND infers — one value is also one type, so a typo is a compile error and bad data throws.`, 'lam')) +
    box('Next · 13.2 — parse vs safeParse', `safeParse returns a discriminated result you narrow — the Chapter 5 union, applied to validation.`, '') },
]);
