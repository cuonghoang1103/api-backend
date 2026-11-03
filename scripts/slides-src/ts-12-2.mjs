/** ts-12-2 — TypeScript · Chapter 12 · Lesson 12.2 "Typing hooks". Slug: typescript-12-2-hooks. _ma: s12/_ma-ts-12-2.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s12/_ma-ts-12-2.mjs';
export const deck = { key: 'ts-12-2', code: 'TS 12.2', title: 'Typing hooks', sub: 'useState infers; a null start forces the loading branch' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 12 — Typing React', bai: '12.2' }, [
  { cover: true, t: 'Typing hooks', sub: 'Chapter 12 · Lesson 12.2 — useState infers the state and types the setter' },
  { t: 'Hooks are generic functions', to: true, giua: true, body: `<ul>
    <li>Hooks are typed like everything from Chapter 6 — generics</li>
    <li>Most of the time <b>inference</b> does the work: ${c('useState(0)')} is a number</li>
    <li>The setter is typed to match — state and its updater cannot drift</li>
    <li>You pass a type argument only when the initial value cannot tell the whole story</li>
    <li>Above all when the state starts <b>null</b></li></ul>` },
  { t: 'useState infers, and the setter is checked too', body: ts(CODE.useStateDemo, { sm: true, hl: [3] }) +
    ts(CODE.wrongset, { sm: true, hl: [4] }) + tc(OUT['12-wrongset'], { wrap: 74 }) +
    box('Inferred, and the setter matches', `${c('useState(0)')} infers ${c('number')}; the setter is typed to match, so ${c('setCount("three")')} is ${c('TS2345')} — refused at the call, not three renders later.`, 'lam') },
  { t: 'Nullable state &amp; refs force the loading branch', body: ts(CODE.nullstate, { sm: true, hl: [6] }) + tc(OUT['13-nullstate'], { wrap: 74 }) +
    box('TS18047 · "possibly null"', `${c('useState<User | null>(null)')} — the ${c('| null')} is the "not loaded yet" state, so you must narrow before reading. A ref’s ${c('.current')} is ${c('T | null')} the same way.`, 'xanh') },
  { t: 'At a glance — and the stale-closure trap', body: cards([
      [c('useState(0)'), 'Infers number; nothing to write.'],
      ['setter checked', "setCount('three') is TS2345."],
      [c('useState<T | null>(null)'), 'A null start needs the annotation.'],
      ['read null unchecked', 'TS18047 — handle the loading state.'],
      [c('ref.current'), 'Always T | null.'],
      ['stale closure', 'setCount(c => c + 1) when the next value depends on the previous.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A number state with ${c('setSeats("forty")')} is TS2345; pass a number and it runs.`, 'xanh'),
      box('Remember', `useState infers and types the setter; a null start needs ${c('<T | null>')}, and a ref’s current is always ${c('T | null')}.`, 'lam')) +
    box('Next · 12.3 — Typing events', `e.target.value is a typed string — the same lesson as Express params, now on the DOM.`, '') },
]);
