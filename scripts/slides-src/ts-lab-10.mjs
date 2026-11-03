/** ts-lab-10 — TypeScript · Chapter 10 · Lab 10 "Write a .d.ts for a JS package". Slug: typescript-10-6-lab-viet-dts. _ma: s10/_ma-ts-lab-10.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s10/_ma-ts-lab-10.mjs';
export const deck = { key: 'ts-lab-10', code: 'TS Lab 10', title: 'Write a .d.ts for a JS package', sub: 'type an untyped module until it refuses every wrong call' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const noc = (s) => L(s).map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');
const score = (out) => L(out).filter((l) => /^(✓|✗).* — |^Score:/.test(l)).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 10 — Modules & declaration files', bai: 'Lab 10' }, [
  { cover: true, t: 'Lab 10 — Write a .d.ts<br>for a JS package', sub: 'type labflow-slug.js · grader runs tsc & Node' },
  { t: 'The task', to: true, giua: true, body: `<ul>
    <li>A real untyped module, ${c('labflow-slug.js')}, ships with four exports and no types</li>
    <li>Write ${c('labflow-slug.d.ts')}: ${c('SLUG_MAX: number')}, ${c('slugify')}, ${c('truncate')}, ${c('isSlug')}</li>
    <li>No ${c('any')}, no ${c('@ts-')} — and the real ${c('.js')} never changes</li>
    <li>The ${c('any')} stub scores <b>6</b>; a correct declaration scores 10</li>
    <li>${c('npm run lab10')} (tsc 7.0.2 + Node 22.23.3)</li></ul>` },
  { t: 'The module you are typing', body: ts(CODE.js, { sm: true }) +
    box('Describe it, do not edit it', `You write a pure-type ${c('.d.ts')} that matches this JavaScript exactly — tsc reads your types, Node runs this ${c('.js')}.`, 'xanh') },
  { t: 'The any stub scores 6', body: ts(CODE.starterDts, { sm: true, hl: [2, 3, 4] }) + tc(score(OUT['l3-starter']), { title: 'npm run lab10 — the any stub', fs: 14 }) +
    box('Well-formed, but checks nothing', `Every export is ${c('any')}: the stub compiles and the tests pass, but ${c('slugify(42)')} and a missing argument all slip. The ${c('any')} costs the honesty point.`, 'do2') },
  { t: 'The eight wrong calls', body: ts(noc(pick(CODE.sai, 0, 9)), { sm: true }) +
    box('Each is caught by a correct type', `${c('slugify(42)')} TS2345 · ${c("truncate('x')")} TS2554 · a string read as a number TS2322 · a boolean read as ${c('.length')} TS2339 · ${c('SLUG_MAX.toUpperCase()')} TS2339 · an unexported name TS2305.`, 'lam') },
  { t: 'Attempt A: any on a parameter (8/10)', body: tc(score(OUT['l4-yeu']), { title: 'npm run lab10 --from lab10/yeu', fs: 14 }) +
    box('As strict as its loosest signature', `You typed most exports but left ${c('slugify')}’s parameter ${c('any')} and made ${c('truncate')}’s ${c('max')} optional — so ${c('slugify(42)')} (S1) and ${c("truncate('x')")} (S2) slip, and the ${c('any')} costs C.`, 'do2') },
  { t: 'Attempt B: an optional parameter (9.5/10)', body: tc(score(OUT['l5-vua']), { title: 'npm run lab10 --from lab10/vua', fs: 14 }) +
    box('The type must match the JavaScript', `Everything is typed honestly, but ${c('truncate')}’s ${c('max')} is optional — so calling it with one argument is accepted (S2 slips). The real ${c('truncate')} needs its ${c('max')}; make it non-optional.`, 'lam') },
  { t: 'The reference: 10/10', body: ts(CODE.refDts, { sm: true, hl: [1, 2, 3, 4] }) +
    tc(L(OUT['l6-ref']).filter((l) => /Score:/.test(l)).join('\n'), { title: 'npm run lab10 — the reference', fs: 15 }) +
    box('Four exact declarations', `One line per export, each with the types the JavaScript actually has. Pure type — no bodies, no ${c('any')} — so every wrong call is a compile error and Node runs the original ${c('.js')} unchanged.`, 'xanh') },
  { t: 'Before you call it done', body: cards([
      [c('npm run lab10'), 'Prints Score: 10/10 — the grader runs tsc and Node.'],
      ['No any / @ts-', 'Every export has its exact type, matching the JS.'],
      ['Explain it', 'You can say which type refuses each of S1–S8.'],
      ['Commit', 'feat(types): declaration file for labflow-slug.'],
      ['stub 6, correct 10', 'Types for a package that had none before.'],
      ['Next · Chapter 11', 'Typing a Node/Express backend, where these meet a framework.'],
    ], 3) },
]);
