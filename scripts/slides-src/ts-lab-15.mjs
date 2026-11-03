/** ts-lab-15 — TypeScript · Chapter 15 · Lab 15. Slug: typescript-15-6-lab-bien-transpile. _ma: s15/_ma-ts-lab-15.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s15/_ma-ts-lab-15.mjs';
export const deck = { key: 'ts-lab-15', code: 'TS Lab 15', title: 'A transpile-ready boundary module', sub: 'import type / export type · grader runs tsc & Node' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const noc = (s) => L(s).map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');
const score = (out) => L(out).filter((l) => /^(✓|✗).* — |^Score:/.test(l)).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 15 — Build performance', bai: 'Lab 15' }, [
  { cover: true, t: 'Lab 15 — A transpile-ready<br>boundary module', sub: 'import type / export type · grader runs tsc & Node' },
  { t: 'The task', to: true, giua: true, body: `<ul>
    <li>Fix ${c('boundary.ts')} so a fast per-file transpiler can emit it</li>
    <li>${c('import type')} for the shape (${c('Booking')}); plain ${c('import')} for the values (${c('makeBooking')}, ${c('VERSION')})</li>
    <li>${c('export type')} for the type re-export; keep ${c('describe')} and ${c('demo')}</li>
    <li>No ${c('any')}, ${c('as')} or ${c('!')}. The stub scores <b>6</b> — it does not build</li>
    <li>${c('npm run lab15')} (tsc 7.0.2 + Node 22.23.3)</li></ul>` },
  { t: 'The stub scores 6', body: ts(pick(CODE.starter, 1, 7), { sm: true, hl: [2, 4] }) + tc(score(OUT['l3-starter']), { title: 'npm run lab15 — the stub', fs: 14 }) +
    box('Does not build', `A value import (TS1484) and a value re-export (TS1205) of a type both fail under ${c('verbatimModuleSyntax')} — the logic is fine, but a module that does not build is not transpile-ready.`, 'do2') },
  { t: 'The eight wrong uses', to: true, body: ts(noc(CODE.sai), { sm: true }) +
    box('Each blocks a per-file transpile', `Four plain imports of a type (${c('import { Booking }')} … TS1484) and four plain re-exports (${c('export { Booking } from …')} TS1205) — every place a transpiler would guess wrong.`, 'lam') },
  { t: 'Attempt A: import fixed, re-export not (6/10)', body: tc(score(OUT['l4-yeu']), { title: 'npm run lab15 --from lab15/yeu', fs: 14 }) +
    box('Both halves must be marked', `You wrote ${c('import type { Booking }')} but still ${c('export { Booking }')} — still TS1205, so the module still does not build. “Closer” does not transpile.`, 'do2') },
  { t: 'Attempt B: one needless cast (9/10)', body: tc(score(OUT['l5-vua']), { title: 'npm run lab15 --from lab15/vua', fs: 14 }) +
    box('as is where guarantees leak', `The imports and re-exports are correct and it builds, but a needless ${c('as string')} trips the honesty check. The value was already a string.`, 'lam') },
  { t: 'The reference: 10/10', body: ts(pick(CODE.ref, 0, 7), { sm: true, hl: [1, 4] }) +
    tc(L(OUT['l6-ref']).filter((l) => /Score:/.test(l)).join('\n'), { title: 'npm run lab15 — the reference', fs: 15 }) +
    box('Transpile-ready', `${c('import type')} for the shape, plain ${c('import')} for the values, ${c('export type')} for the re-export — the module builds, and every type edge is gone.`, 'xanh') },
  { t: 'How the grader scores you', to: true, body: cards([
      ['A · compiles (2)', 'boundary.ts compiles under strict + verbatimModuleSyntax.'],
      ['B · correct uses (1)', 'the boundary’s exports used correctly.'],
      ['C · honesty (1)', 'no any, no as (as const is fine), no ! and no @ts-.'],
      ['D · behaviour (2)', 'node --test: the module runs after types are erased.'],
      ['E · wrong uses (4)', 'the eight transpile-hostile lines, each refused (8 × 0.5).'],
      ['pass mark', '7 of 10 — the stub scores 6, the reference 10.'],
    ], 3) },
  { t: 'Before you call it done', body: cards([
      [c('npm run lab15'), 'Prints Score: 10/10 — tsc and Node.'],
      ['No any / as / !', 'Types use import type / export type, values stay plain.'],
      ['Explain it', 'Why each of S1–S8 blocks a per-file transpile.'],
      ['stub 6, ready 10', 'From a module that does not build to one the fast tools accept.'],
      ['Commit', 'chore(build): make the boundary module transpile-ready.'],
      ['Chapter 15 done', 'Every lever for a fast build is in your hands.'],
    ], 3) },
]);
