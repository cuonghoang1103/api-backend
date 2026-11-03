/** ts-10-4 — TypeScript · Chapter 10 · Lesson 10.4 "Getting types from packages". Slug: typescript-10-4-types-from-packages. _ma: s10/_ma-ts-10-4.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s10/_ma-ts-10-4.mjs';
export const deck = { key: 'ts-10-4', code: 'TS 10.4', title: 'Getting types from packages', sub: 'bundled, @types, or your own' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 10 — Modules & declaration files', bai: '10.4' }, [
  { cover: true, t: 'Getting types<br>from packages', sub: 'Chapter 10 · Lesson 10.4 — bundled, @types, or your own' },
  { t: 'Bundled types: node:path', body: ts(CODE.bundledApp, { sm: true, hl: [1] }) + tc(OUT['11-bundled'], { title: 'node' }) +
    box('Already there', `${c('node:path')} ships its types through ${c('@types/node')}, so ${c('join')} is fully typed with no setup. The common case — you import, the types are there.`, 'xanh') },
  { t: 'The types are real — a wrong call is caught', body: ts(pick(CODE.bundledbadApp, 0, 3), { sm: true, hl: [2] }) + tc(OUT['12-bundled-bad'], { wrap: 74 }) +
    box('TS2345 · not decoration', `A number where ${c('join')} wants a string is refused. A typed dependency protects your call sites exactly like a typed function in your own module.`, 'lam') },
  { t: 'How TypeScript finds a package’s types', body: ts(CODE.localpkgPkg, { sm: true, hl: [1] }) + ts(CODE.localpkgDts, { sm: true, hl: [1] }) + ts(pick(CODE.localpkgApp, 0, 2), { sm: true, hl: [1] }) + tc(OUT['13-localpkg'], { title: 'tsc' }) +
    two(box('The "types" field', `TypeScript reads the ${c('types')} field in ${c('package.json')} and loads the ${c('.d.ts')} it points at — so the import is typed.`, 'lam'),
      box('If there is no field', `It looks for an ${c('@types')} package next; if that is missing too, it is TS7016 and you write the declaration yourself.`, 'xanh')) },
  { t: 'Bundled, @types, or your own', body: cards([
      ['bundled types', 'The package ships its own .d.ts via the types field.'],
      [c('@types'), 'DefinitelyTyped — one install: npm i -D @types/x.'],
      ['write your own', 'A declare module or sidecar .d.ts, as in 10.2.'],
      ['how TS finds them', 'The types field → an @types package → nothing (TS7016).'],
      ['real, not decoration', 'A wrong call into a typed package is TS2345.'],
      ['Next · Lab 10', 'Write the .d.ts for a real untyped JS module.'],
    ], 3) },
  { t: 'Practice &amp; Lab 10', to: true, giua: true, body: two(
      box('🧪 Practice', `A call to ${c('path.join')} with a number is TS2345 — pass a string and it runs.`, 'xanh'),
      box('Remember', `Three outcomes: bundled, ${c('@types')}, or your own — know which to install, write, or just use.`, 'lam')) +
    box('Next · Lab 10 — Write a .d.ts for a JS package', `Type ${c('labflow-slug.js')} until every wrong call is refused.`, '') },
]);
