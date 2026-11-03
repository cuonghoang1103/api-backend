/** ts-15-4 — TypeScript · Chapter 15 · Lesson 15.4 "Trimming the module graph". Slug: typescript-15-4-import-type. _ma: s15/_ma-ts-15-4.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s15/_ma-ts-15-4.mjs';
export const deck = { key: 'ts-15-4', code: 'TS 15.4', title: 'Trimming the module graph', sub: 'a type import should leave no edge' };
export const slides = lamDeck({ chuong: 'Chapter 15 — Build performance', bai: '15.4' }, [
  { cover: true, t: 'Trimming the<br>module graph', sub: 'Chapter 15 · Lesson 15.4 — import type is erased' },
  { t: 'A value import of a type is refused', body: ts(CODE.use, { sm: true, hl: [2] }) + tc(OUT['11-valimport'], { wrap: 74 }) +
    box('TS1484', `Every ${c('import')} is a graph edge. A plain import of a type would survive to run time as an edge to a module that, after types are erased, might have nothing to export.`, 'lam') },
  { t: 'import type is erased', body: ts(CODE.okUse, { sm: true, hl: [2, 3] }) + tc(OUT['12-ok'], { title: 'node' }) +
    box('No edge, no module', `${c('import type')} for the shape, plain ${c('import')} for the value. The type import disappears from the emitted JavaScript — the runtime pulls in only what it runs.`, 'xanh') },
  { t: 'Smaller graph, faster everything', to: true, giua: true, body: `<ul>
    <li>The bundler follows <b>fewer edges</b> — faster to walk, smaller output</li>
    <li>Circular <b>type</b> dependencies become harmless — the type edges are gone</li>
    <li>It makes the per-file transpile of 15.3 correct — a type import has <b>nothing to emit</b></li>
    <li>Mix freely: <b>import type</b> for shapes, plain <b>import</b> for the values you actually run</li></ul>` },
  { t: 'At a glance', body: cards([
      ['an import is an edge', 'A file the build must load and follow.'],
      ['a type has none', 'It exists only at compile time.'],
      ['value import of a type', 'TS1484 — write import type.'],
      [c('import type') + ' is erased', 'No edge, no module loaded at run time.'],
      ['smaller graph', 'Faster bundling, smaller output, no circular runtime edge.'],
      ['Next · Lab 15', 'A transpile-ready boundary module.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `An app does ${c('import { Lab, MAX }')} where ${c('Lab')} is a type — TS1484; split into ${c('import type { Lab }')} and ${c('import { MAX }')} and it runs.`, 'xanh'),
      box('Chapter 15 done', `skipLibCheck · incremental · isolated files · trimmed graph — every lever for a fast build.`, 'lam')) +
    box('Next · Lab 15', `Make a boundary module transpile-ready — graded by tsc and Node.`, '') },
]);
