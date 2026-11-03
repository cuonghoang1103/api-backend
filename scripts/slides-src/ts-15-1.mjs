/** ts-15-1 — TypeScript · Chapter 15 · Lesson 15.1 "Where the time goes & skipLibCheck". Slug: typescript-15-1-where-time-goes. _ma: s15/_ma-ts-15-1.mjs. */
import { lamDeck, sql, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s15/_ma-ts-15-1.mjs';
export const deck = { key: 'ts-15-1', code: 'TS 15.1', title: 'Where the time goes & skipLibCheck', sub: 'the biggest easy win for build time' };
const json = (s, o = {}) => sql(s, { lang: 'json', ...o });
export const slides = lamDeck({ chuong: 'Chapter 15 — Build performance', bai: '15.1' }, [
  { cover: true, t: 'Where the time goes<br>&amp; skipLibCheck', sub: 'Chapter 15 · Lesson 15.1 — a type-check parses, binds, and checks' },
  { t: 'skipLibCheck off: a dependency’s .d.ts surfaces', body: ts(CODE.brokenDts, { sm: true }) + json(CODE.nolibCfg, { sm: true }) + tc(OUT['11-nolib'], { wrap: 72 }) +
    box('TS2304 · you cannot fix it', `Without ${c('skipLibCheck')}, tsc checks every ${c('.d.ts')} — a broken declaration anywhere in ${c('node_modules')} fails your build.`, 'lam') },
  { t: 'skipLibCheck on: the .d.ts is skipped', body: json(CODE.libCfg, { sm: true }) + tc(OUT['12-lib'] || '(no errors — exit 0)', { title: 'tsc', fs: 15 }) +
    box('Trust the declarations', `The course config has ${c('skipLibCheck: true')}: tsc trusts the declaration files and checks only your code — you gain back all the time spent checking them.`, 'xanh') },
  { t: 'What actually takes the time', to: true, giua: true, body: `<ul>
    <li>A build does three things: <b>parse</b> · <b>bind</b> · <b>check</b> — checking dominates</li>
    <li>Much of checking is your dependencies’ <b>.d.ts</b> files; <b>skipLibCheck</b> removes that cost</li>
    <li>What is left grows with the type <b>work</b> you ask for: deep conditionals, large unions, heavy inference</li>
    <li>The rest of the chapter does less of it: build only what changed · skip checking where a transpiler suffices · trim the graph</li></ul>` },
  { t: 'At a glance', body: cards([
      ['parse · bind · check', 'Checking dominates a large build.'],
      ['.d.ts cost', 'Much of checking is dependency declarations.'],
      [c('skipLibCheck: true'), 'Skips the .d.ts — the biggest easy win.'],
      ['off', 'A broken dependency .d.ts is TS2304.'],
      ['on (course config)', 'tsc trusts declarations, checks only your code.'],
      ['Next · 15.2', 'Build only what changed.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A vendor ${c('.d.ts')} references a missing ${c('Shape')} — with ${c('skipLibCheck: false')} it is TS2304; turn it on and the build is clean.`, 'xanh'),
      box('Remember', `${c('skipLibCheck')} skips the declaration files; without it a broken dependency ${c('.d.ts')} can fail your build.`, 'lam')) +
    box('Next · 15.2 — Incremental & references', `Build only what changed with tsc -b and a .tsbuildinfo cache.`, '') },
]);
