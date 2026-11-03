/** ts-15-3 — TypeScript · Chapter 15 · Lesson 15.3 "Separate checking from transpiling". Slug: typescript-15-3-isolated-modules. _ma: s15/_ma-ts-15-3.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s15/_ma-ts-15-3.mjs';
export const deck = { key: 'ts-15-3', code: 'TS 15.3', title: 'Separate checking from transpiling', sub: 'each file must transpile on its own' };
export const slides = lamDeck({ chuong: 'Chapter 15 — Build performance', bai: '15.3' }, [
  { cover: true, t: 'Separate checking<br>from transpiling', sub: 'Chapter 15 · Lesson 15.3 — slow whole-program check vs fast per-file emit' },
  { t: 'A per-file transpiler is blind across files', body: ts(CODE.reexport, { sm: true, hl: [4] }) + tc(OUT['11-reexport'], { wrap: 74 }) +
    box('TS1205', `A transpiler sees one file; it cannot look into ${c('./model.ts')} to learn ${c('Booking')} is a type. A plain ${c('export { Booking }')} is ambiguous — so it is refused here.`, 'lam') },
  { t: 'export type makes the intent explicit', body: ts(CODE.okReexport, { sm: true, hl: [3] }) + tc(OUT['12-ok'] || '(no errors — exit 0)', { title: 'tsc', fs: 15 }) +
    box('On the line itself', `${c('export type { Booking }')} can be erased per-file; ${c('export { VERSION }')} is kept. No cross-file analysis — the error was the compiler enforcing transpile-readiness.`, 'xanh') },
  { t: 'Two jobs, split', to: true, giua: true, body: two(
      box('Check — slow, whole-program', `${c('tsc --noEmit')} reads the whole program to verify types. Run it once, in parallel, in CI.`, 'xanh'),
      box('Transpile — fast, per-file', `esbuild / swc / Node’s type-stripping emit one file at a time. They do not type-check.`, 'lam')) +
    box('verbatimModuleSyntax keeps them in step', `It makes tsc check that every file could be transpiled alone, so the fast emitter and the slow checker never disagree.`, '') },
  { t: 'At a glance', body: cards([
      ['two jobs', 'Checking (slow, whole-program) vs transpiling (fast, per-file).'],
      ['the split', 'tsc --noEmit checks; esbuild/swc/Node emits.'],
      ['per-file blind spot', 'A transpiler cannot tell a type from a value across files.'],
      [c('export type'), 'A plain re-export of a type is TS1205 — mark it.'],
      ['transpile-ready', 'Fix the errors once; any fast tool can emit.'],
      ['Next · 15.4', 'import type trims the module graph.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A module does ${c('export { Lab }')} where ${c('Lab')} is a type — TS1205; write ${c('export type { Lab }')} and it compiles.`, 'xanh'),
      box('Remember', `A per-file transpiler cannot tell a type from a value; ${c('export type')} / ${c('import type')} put the intent on the line.`, 'lam')) +
    box('Next · 15.4 — Trimming the module graph', `import type keeps a type out of the runtime graph entirely.`, '') },
]);
