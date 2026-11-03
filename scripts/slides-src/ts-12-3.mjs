/** ts-12-3 — TypeScript · Chapter 12 · Lesson 12.3 "Typing events". Slug: typescript-12-3-events. _ma: s12/_ma-ts-12-3.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s12/_ma-ts-12-3.mjs';
export const deck = { key: 'ts-12-3', code: 'TS 12.3', title: 'Typing events', sub: 'e.target.value is a typed string' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 12 — Typing React', bai: '12.3' }, [
  { cover: true, t: 'Typing events', sub: 'Chapter 12 · Lesson 12.3 — a typed event gives a typed target' },
  { t: 'A change handler: e.target.value is a string', body: ts(CODE.eventDemo, { sm: true, hl: [3] }) + tc(OUT['11-event'], { title: 'node' }) +
    box('The value is a string', `Type the parameter as ${c('ChangeEvent')} and ${c('e.target.value')} is a string — ${c('.toUpperCase()')} is valid. The DOM gives an input’s value as a string.`, 'xanh') },
  { t: 'The typed event refuses a wrong read', body: ts(CODE.wrongevent, { sm: true, hl: [4] }) + tc(OUT['12-wrongevent'], { wrap: 74 }) +
    box('TS2339', `The value is nested under ${c('target')} — reading ${c('e.value')} directly does not exist on the event.`, 'lam') },
  { t: 'The value is a string, even for numbers', body: ts(CODE.asnumber, { sm: true, hl: [4] }) + tc(OUT['13-asnumber'], { wrap: 74 }) +
    box('TS2322 · parse it', `Assigning ${c('e.target.value')} to a ${c('number')} is refused — an input’s value is a string even for a number input, so use ${c('Number()')} first.`, 'lam') },
  { t: 'The real React event types', body: cards([
      [c('ChangeEvent<HTMLInputElement>'), 'For inputs. Because the element is in the type parameter, e.target.value is a string and e.target.checked a boolean — correctly typed for an input specifically.'],
      [c('FormEvent<HTMLFormElement>'), "For a form's onSubmit, where e.preventDefault() lives. Typing it as ChangeEvent compiles but misleads the next reader."],
      [c('MouseEvent / KeyboardEvent'), 'For clicks and key presses — React’s own types, not the DOM’s. Importing the DOM one by mistake gives errors about nativeEvent.'],
      ['generic over the element', 'The element argument is what makes e.target have a value at all, instead of a bare EventTarget with nothing on it.'],
      ['inline handlers infer', 'In JSX, onChange={e => …} gives e the right type for free; you only name the type when the handler is a separate function.'],
      ['target vs currentTarget', 'currentTarget is the element you bound to (statically known); target is whatever was actually hit, which may be a child.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A handler returns ${c('Number(e.value)')} — TS2339; read ${c('e.target.value')} and it runs, returning the parsed number.`, 'xanh'),
      box('Remember', `A typed event gives a typed target: ${c('value')} is a string, an undeclared field is a compile error.`, 'lam')) +
    box('Next · 12.4 — Context &amp; generics', `A typed context forces the no-provider check; a generic component adapts to any data.`, '') },
]);
