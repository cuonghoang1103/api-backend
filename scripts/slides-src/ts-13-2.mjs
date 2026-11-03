/** ts-13-2 — TypeScript · Chapter 13 · Lesson 13.2 "parse vs safeParse". Slug: typescript-13-2-parse-safeparse. _ma: s13/_ma-ts-13-2.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s13/_ma-ts-13-2.mjs';
export const deck = { key: 'ts-13-2', code: 'TS 13.2', title: 'parse vs safeParse', sub: 'throw for the exceptional, return for the expected' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 13 — Runtime validation: Zod & Prisma', bai: '13.2' }, [
  { cover: true, t: 'parse vs safeParse', sub: 'Chapter 13 · Lesson 13.2 — a validation result you must handle' },
  { t: 'safeParse returns a discriminated result', body: ts(CODE.safeparse, { sm: true, hl: [5, 6] }) + tc(OUT['11-safeparse'], { title: 'node' }) +
    box('Narrow on success', `${c('safeParse')} returns ${c('{ success: true; data }')} or ${c('{ success: false; error }')}. The Chapter 5 discriminated union, tagging a validation outcome.`, 'xanh') },
  { t: 'You cannot read data without checking', body: ts(CODE.wrongbranch, { sm: true, hl: [5] }) + tc(OUT['12-wrongbranch'], { wrap: 74 }) +
    box('TS2339', `${c('data')} does not exist on the failure branch. A handler cannot reach the parsed value without handling the invalid case — no path where bad data is silently used.`, 'lam') },
  { t: 'When to throw, when to return', to: true, body: two(
      box('parse — throws', `For the exceptional: config at startup, data you control. You want it to blow up loudly.`, 'xanh'),
      box('safeParse — returns', `For the expected: user input, a third-party API. You will show a message, so you handle the failure.`, 'lam')) +
    box('Both validate the same way', `They differ only in how a failure is delivered — a thrown error, or a result you read.`, '') },
  { t: 'At a glance', body: cards([
      ['parse(unknown): T', 'Throws on invalid data.'],
      ['safeParse(unknown)', '{ success: true; data } | { success: false; error }.'],
      ['narrow on success', 'data on true, error on false.'],
      ['no unchecked data', 'Reading data without narrowing is TS2339.'],
      ['Chapter 5 again', 'A discriminated union, tagging a validation outcome.'],
      ['Next · 13.3', 'Derive the type — never copy the schema.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A function reads ${c('result.data.seats')} without narrowing — TS2339; return ${c('result.success ? result.data.seats : 0')} and it runs.`, 'xanh'),
      box('Remember', `Throw for the exceptional, return for the expected — the type makes the choice visible at every call site.`, 'lam')) +
    box('Next · 13.3 — Single source of truth', `Define the schema once and derive the type, so a hand-written copy can never drift.`, '') },
]);
