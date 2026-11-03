/** ts-12-1 — TypeScript · Chapter 12 · Lesson 12.1 "Components & props". Slug: typescript-12-1-components-props. _ma: s12/_ma-ts-12-1.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s12/_ma-ts-12-1.mjs';
export const deck = { key: 'ts-12-1', code: 'TS 12.1', title: 'Components & props', sub: 'a component is a function of typed props' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 12 — Typing React', bai: '12.1' }, [
  { cover: true, t: 'Components &amp; props', sub: 'Chapter 12 · Lesson 12.1 — a component is a function of typed props' },
  { t: 'What you will take away from this chapter', to: true, giua: true, body: `<ul>
    <li>Type a UI end to end — a self-contained model of the React surface, run with tsc &amp; Node (no JSX)</li>
    <li>A component with typed <b>props</b> (this lesson)</li>
    <li>Hooks whose setter is checked, and a nullable state that forces a loading branch (12.2)</li>
    <li>Typed <b>events</b> (12.3) and a typed <b>context</b> + a <b>generic</b> component (12.4)</li>
    <li>Pass <b>Lab 12</b>: a typed BookingForm — a component and a hook</li></ul>` },
  { t: 'A component is a function of typed props', body: ts(pick(CODE.component, 3, 8), { sm: true, hl: [4] }) + tc(OUT['11-component'], { title: 'node' }) +
    box('The props type is the contract', `Declare the props and read them: ${c('props.code')} and ${c('props.seats')} are typed exactly as you wrote them. The component documents its own API.`, 'xanh') },
  { t: 'The typed component refuses a wrong or missing prop', body: ts(CODE.wrongprop, { sm: true, hl: [6] }) + tc(OUT['12-wrongprop'], { wrap: 72 }) +
    box('TS2339 · and TS2741', `Read an undeclared prop and it is ${c('TS2339')}; call the component without a required prop and it is ${c('TS2741')}. A typo or a forgotten field is a compile error, not a blank spot.`, 'lam') },
  { t: 'A component, at a glance — and the React.FC trap', body: cards([
      [c('FC<Props>'), 'A function of a typed props object.'],
      ['typed props', 'props.code is checked; an undeclared prop is TS2339.'],
      ['a required prop', 'Calling without it is TS2741.'],
      [c('children'), 'Just another prop, typed ReactNode.'],
      ['React.FC trap', 'It used to add children implicitly — text passed to a component that ignores it vanished.'],
      ['the real thing', '@types/react is this, with JSX.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A ${c('Button')} reads ${c('props.text')} when the type declares only ${c('label')} — TS2339; read ${c('props.label')} and it runs.`, 'xanh'),
      box('Remember', `A component is a function of its props; type the props and every reader and call site is checked.`, 'lam')) +
    box('Next · 12.2 — Typing hooks', `useState infers the state and types the setter; a nullable state forces the loading branch.`, '') },
]);
