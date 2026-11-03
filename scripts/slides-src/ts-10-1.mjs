/** ts-10-1 — TypeScript · Chapter 10 · Lesson 10.1 "ES modules & the type boundary". Slug: typescript-10-1-es-modules. _ma: s10/_ma-ts-10-1.mjs (Node 22.23.3, tsc 7.0.2). */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s10/_ma-ts-10-1.mjs';
export const deck = { key: 'ts-10-1', code: 'TS 10.1', title: 'ES modules & the type boundary', sub: 'values run; types are erased' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 10 — Modules & declaration files', bai: '10.1' }, [
  { cover: true, t: 'ES modules &amp;<br>the type boundary', sub: 'Chapter 10 · Lesson 10.1 — values run; types are erased' },
  { t: 'What you will take away from this chapter', to: true, giua: true, body: `<ul>
    <li>Types travelling across boundaries — files, packages, runtimes</li>
    <li><b>import type</b> and the module boundary (this lesson)</li>
    <li>Write a <b>.d.ts</b> for an untyped JS package (10.2)</li>
    <li>Augment a global or a library type — <code>Request.user</code> (10.3); how a package ships types (10.4)</li>
    <li>Pass <b>Lab 10</b>: write the declaration file for a real JS module</li></ul>` },
  { t: 'Exporting: named, default, and types', body: ts(pick(CODE.exportsApp, 0, 5), { sm: true, hl: [1, 2] }) + tc(OUT['11-exports'], { title: 'node' }) +
    box('Three kinds cross the boundary', `A named value, a default, and a type — imported each in kind. The ${c('Money')} type is for the compiler only; it is erased before the code runs.`, 'xanh') },
  { t: 'import type: the explicit boundary', body: ts(CODE.importtypeBad, { sm: true, hl: [2] }) + tc(OUT['12-importtype-bad'], { wrap: 74 }) +
    box('TS1484', `Under ${c('verbatimModuleSyntax')}, importing a type as a value is refused. ${c('import type')} says “erase the whole import” — so tsc never emits an import that does not exist at run time.`, 'lam') },
  { t: 'The module boundary, at a glance', body: cards([
      [c('export function'), 'A named export — imported by name.'],
      [c('export default'), 'A default export — imported under any name.'],
      [c('export type'), 'A type export — crosses for the compiler only.'],
      [c('import type'), 'The whole import is erased (required for a type here).'],
      ['values vs types', 'Values at run time; types only at compile time.'],
      ['Next · 10.2', 'Declaration files for untyped JavaScript.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A ${c('Role')} type imported as a value is TS1484 — change it to ${c('import type')} and it compiles and runs.`, 'xanh'),
      box('Remember', `Values and types share the import syntax but live in different worlds; ${c('import type')} marks the boundary tsc checks vs what Node runs.`, 'lam')) +
    box('Next · 10.2 — Declaration files', `Give types to a JavaScript package that has none.`, '') },
]);
