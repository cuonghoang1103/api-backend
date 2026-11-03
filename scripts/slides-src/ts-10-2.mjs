/** ts-10-2 — TypeScript · Chapter 10 · Lesson 10.2 "Declaration files (.d.ts)". Slug: typescript-10-2-declaration-files. _ma: s10/_ma-ts-10-2.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s10/_ma-ts-10-2.mjs';
export const deck = { key: 'ts-10-2', code: 'TS 10.2', title: 'Declaration files (.d.ts)', sub: 'types for JavaScript that has none' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 10 — Modules & declaration files', bai: '10.2' }, [
  { cover: true, t: 'Declaration files (.d.ts)', sub: 'Chapter 10 · Lesson 10.2 — types for JavaScript that has none' },
  { t: 'An untyped import is unknown', body: ts(CODE.nodtsApp, { sm: true, hl: [2] }) + tc(OUT['12-nodts'], { wrap: 80 }) +
    box('TS7016', `An import with no declaration has nothing for tsc to go on — the value would otherwise be ${c('any')}, and one untyped import turns off every check downstream.`, 'do2') },
  { t: 'Sidecar .d.ts for a relative file', body: ts(CODE.sidecarDts, { sm: true, hl: [1] }) + ts(pick(CODE.sidecarApp, 0, 3), { sm: true, hl: [1] }) + tc(OUT['11-sidecar'], { title: 'node' }) +
    box('tsc reads the .d.ts, Node runs the .js', `A ${c('slug.d.ts')} next to ${c('slug.js')} types the import — ${c('slugify')} takes a string, returns a string — while the real JavaScript runs unchanged.`, 'xanh') },
  { t: 'declare module: type a package by name', body: ts(CODE.declaremoduleTypes, { sm: true, hl: [2, 3] }) + ts(pick(CODE.declaremoduleApp, 0, 2), { sm: true, hl: [1] }) + tc(OUT['13-declaremodule'], { title: 'tsc' }) +
    two(box('A bare-name package', `${c("declare module 'labflow-legacy'")} gives a package types by its import name. Without it, the bare import is TS2307.`, 'lam'),
      box('An ambient declaration', `It lives in a ${c('.d.ts')} anywhere in the project and the compiler finds it — one block, and an untyped dependency is usable.`, 'xanh')) },
  { t: 'Three ways a package gets types', body: cards([
      [c('.d.ts'), 'Pure type — no bodies, no runtime code.'],
      ['untyped import', 'TS7016 under strict — otherwise any.'],
      ['bundled', 'The package ships its own .d.ts — nothing to do.'],
      [c('@types'), 'DefinitelyTyped — one install: npm i -D @types/x.'],
      ['write your own', 'A sidecar .d.ts or a declare module block you own.'],
      ['Next · 10.3', 'Augment a type you do not own — the Request.user pattern.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A ${c('legacy.js')} helper imported with no declaration is TS7016 — add a ${c('legacy.d.ts')} beside it and the import is typed and runs.`, 'xanh'),
      box('Remember', `A ${c('.d.ts')} describes the shape; the ${c('.js')} provides the behaviour. Bundled, ${c('@types')}, or written by you.`, 'lam')) +
    box('Next · 10.3 — Augmentation', `Add a field to a type you do not own — the Request.user pattern.`, '') },
]);
