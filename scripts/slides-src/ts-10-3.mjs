/** ts-10-3 — TypeScript · Chapter 10 · Lesson 10.3 "Global & module augmentation". Slug: typescript-10-3-augmentation. _ma: s10/_ma-ts-10-3.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s10/_ma-ts-10-3.mjs';
export const deck = { key: 'ts-10-3', code: 'TS 10.3', title: 'Global & module augmentation', sub: 'add a field to a type you do not own' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 10 — Modules & declaration files', bai: '10.3' }, [
  { cover: true, t: 'Global &amp; module<br>augmentation', sub: 'Chapter 10 · Lesson 10.3 — add a field to a type you do not own' },
  { t: 'Declaration merging: the mechanism', body: ts(CODE.mergeLab, { sm: true, hl: [1, 2] }) + tc(OUT['13-merge'], { title: 'node' }) +
    box('Two interfaces join into one', `A ${c('Lab')} declared twice — once with ${c('code')}, once with ${c('seats')} — is a single ${c('Lab')} that must have both. This merging is the engine under every augmentation.`, 'xanh') },
  { t: 'declare global: extend a global type', body: ts(pick(CODE.globalaugEnv, 0, 8), { sm: true, hl: [4] }) + tc(OUT['11-globalaug'], { title: 'tsc' }) +
    box('process.env.LABFLOW_PORT is string', `Declaring ${c('NodeJS.ProcessEnv')} with a known key makes the read a plain ${c('string')} — not ${c('string | undefined')}. You told the compiler a fact it could not infer.`, 'lam') },
  { t: 'Without the augmentation', body: ts(CODE.noaugApp, { sm: true, hl: [2] }) + tc(OUT['12-noaug'], { wrap: 74 }) +
    box('TS2322 · the whole point', `Remove the declaration and the read is ${c('string | undefined')} again. Augmentation records a guarantee the types cannot know — “always set”, or “every request has a ${c('user')}” (the Express pattern).`, 'do2') },
  { t: 'Augmentation: the rules', body: cards([
      ['declaration merging', 'Same-named interfaces join into one.'],
      [c('declare global'), 'Extend a global interface from a module.'],
      ['module augmentation', 'Add a field to a library type (Request.user).'],
      ['match name + kind', 'An interface augments an interface.'],
      ['be in a module', 'A file with an import or export.'],
      ['type-only', 'It adds declarations, never runtime code.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `${c('process.env.DATABASE_URL')} is ${c('string | undefined')} (TS2322) — add a ${c('declare global')} declaring ${c('DATABASE_URL: string')} and it compiles.`, 'xanh'),
      box('Remember', `Augmentation extends a type you do not own from one small file — not a fork of the library.`, 'lam')) +
    box('Next · 10.4 — Getting types from packages', `Bundled, @types, and how TypeScript finds them.`, '') },
]);
