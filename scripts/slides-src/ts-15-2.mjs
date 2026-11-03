/** ts-15-2 — TypeScript · Chapter 15 · Lesson 15.2 "Incremental & project references". Slug: typescript-15-2-incremental-references. _ma: s15/_ma-ts-15-2.mjs. */
import { lamDeck, sql, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s15/_ma-ts-15-2.mjs';
export const deck = { key: 'ts-15-2', code: 'TS 15.2', title: 'Incremental & project references', sub: 'the cheapest work is the work you do not repeat' };
const json = (s, o = {}) => sql(s, { lang: 'json', ...o });
const L = (s) => s.split('\n');
const keep = (out, re) => L(out).filter((l) => /^\$ /.test(l) || re.test(l)).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 15 — Build performance', bai: '15.2' }, [
  { cover: true, t: 'Incremental &amp;<br>project references', sub: 'Chapter 15 · Lesson 15.2 — do not repeat the work' },
  { t: 'The first build does the work', body: ts(CODE.coreSrc, { sm: true }) + tc(keep(OUT['11-build-first'], /Building project|Projects in this build|tsconfig.json$/), { title: 'tsc -b --verbose', fs: 14, wrap: 78 }) +
    box('In dependency order', `${c('tsc -b')} builds each project in order — the dependency (${c('core')}) first, then the one that uses it (${c('app')}). Each is “out of date” and gets built.`, 'xanh') },
  { t: 'The second build is near-instant', body: tc(keep(OUT['12-build-second'], /up to date|Projects in this build|tsconfig.json$/), { title: 'tsc -b --verbose (nothing changed)', fs: 14, wrap: 78 }) +
    box('“up to date” ⇒ no work', `Run the same command with nothing changed and every project is up to date — tsc compares each file’s timestamp to the ${c('.tsbuildinfo')}. You pay only for what you touched.`, 'xanh') },
  { t: 'Why references, not one big project', body: json(CODE.appCfg, { sm: true }) +
    box('composite: true', `References make each project emit its declarations, so a consumer checks against the ${c('built')} types of its dependency — which is what lets tsc skip an unchanged project entirely, and lets a monorepo build in parallel.`, 'lam') },
  { t: 'At a glance', body: cards([
      [c('tsc -b'), 'Builds projects in dependency order.'],
      [c('.tsbuildinfo'), 'Remembers the last build — a second run is near-instant.'],
      ['“up to date”', 'No change ⇒ no work; only what you touched is rebuilt.'],
      [c('composite: true'), 'Each project emits declarations; consumers check the built types.'],
      ['monorepo', 'Build packages in order, in parallel where possible.'],
      ['Next · 15.3', 'Separate checking from transpiling.'],
    ], 3) },
  { t: 'What is next', to: true, giua: true, body: two(
      box('Remember', `${c('tsc -b')} + ${c('.tsbuildinfo')} cut the work by not repeating it; references let each project be checked independently against built types.`, 'xanh'),
      box('The next lever', `15.3: do not even <b>do</b> some of the work — separate the slow, whole-program checker from the fast, per-file transpiler.`, 'lam')) +
    box('Next · 15.3 — Separate checking from transpiling', `A fast transpiler emits while tsc --noEmit checks in parallel.`, '') },
]);
