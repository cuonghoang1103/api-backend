/** ts-13-4 — TypeScript · Chapter 13 · Lesson 13.4 "Types from Prisma". Slug: typescript-13-4-types-from-prisma. _ma: s13/_ma-ts-13-4.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s13/_ma-ts-13-4.mjs';
export const deck = { key: 'ts-13-4', code: 'TS 13.4', title: 'Types from Prisma', sub: 'generated types at the database boundary' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 13 — Runtime validation: Zod & Prisma', bai: '13.4' }, [
  { cover: true, t: 'Types from Prisma', sub: 'Chapter 13 · Lesson 13.4 — the database boundary gets a real type' },
  { t: 'The generated types describe the model', body: ts(pick(CODE.prismaModel, 1, 6), { sm: true }) + ts(pick(CODE.create, 2, 6), { sm: true, hl: [1] }) +
    box('CreateInput is the model minus server fields', `${c('prisma generate')} writes ${c('Booking')} (what a row is) and ${c('BookingCreateInput')} (what you may create). A repository takes the create input and returns the model.`, 'xanh') },
  { t: 'You cannot create a server-owned field', body: ts(CODE.wrongcreate, { sm: true, hl: [4] }) + tc(OUT['12-wrongcreate'], { wrap: 74 }) +
    box('TS2353', `${c('BookingCreateInput')} has no ${c('id')} — the database assigns it. The boundary between "what you send" and "what the row becomes" is a type, not a convention.`, 'lam') },
  { t: 'A query that may miss returns T | null', body: ts(CODE.nullrow, { sm: true, hl: [5] }) + tc(OUT['13-nullrow'], { wrap: 74 }) +
    box('TS18047', `${c('findUnique')} may not find a row, so its type is ${c('Booking | null')}. The same T | null discipline as a Chapter 11 service return, now from the database layer for free.`, 'lam') },
  { t: 'At a glance', body: cards([
      ['generated types', 'prisma generate writes a type per model.'],
      ['CreateInput', 'The model minus server fields — passing id is TS2353.'],
      ['honest queries', 'findUnique is T | null — reading unchecked is TS18047.'],
      ['derived, like Zod', 'Change the schema, regenerate, the types follow.'],
      ['no as', 'The database boundary gets a real type, not a cast.'],
      ['Next · Lab 13', 'A schema as the single source of truth.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A function reads ${c('row.seats')} when ${c('findUnique')} is ${c('Booking | null')} — TS18047; narrow with ${c('row === null ? 0 : row.seats')} and it compiles.`, 'xanh'),
      box('Chapter 13 done', `Zod in, Prisma at the database — both derived, both honest. No ${c('as')}, no guessing at either boundary.`, 'lam')) +
    box('Next · Lab 13', `A schema as the single source of truth — validate POST /bookings, graded by tsc and Node.`, '') },
]);
