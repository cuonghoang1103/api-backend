/**
 * ts-06-3 — TypeScript · Chapter 6 · Lesson 6.3 "Generic interfaces, classes & defaults" (03/11/2026). Slug: typescript-6-3-generic-types-classes.
 * Mọi mã/output lấy từ content/courses/typescript/s06/_ma-ts-06-3.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s06/_ma-ts-06-3.mjs';

export const deck = { key: 'ts-06-3', code: 'TS 6.3', title: 'Generic types & classes', sub: 'aliases, interfaces, classes, defaults' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 6 — Generics', bai: '6.3' }, [
  { cover: true, t: 'Generic interfaces,<br>classes &amp; defaults', sub: 'Chapter 6 · Lesson 6.3 — Result<T, E> and Repo<T>' },
  { t: 'A generic type alias — and a default', body: ts(pick(CODE.result, 1, 14), { sm: true, hl: [2, 3, 4] }) + tc(OUT['11-result'], { title: 'node' }) +
    box('E = string is a default', `${c('Result<number>')} means ${c('Result<number, string>')} — the common case stays short. This is the ${c('Result')} you export in Lab 6.`, 'xanh') },
  { t: 'Overriding the default', body: ts(pick(CODE.override, 3, 7), { sm: true, hl: [3, 4] }) + tc(OUT['12-override'], { wrap: 72 }) +
    box('A default is a start, not a cage', `${c('Result<number, Code>')} accepts only a ${c('Code')} for the error, so ${c("error: 'typo'")} is <b>TS2322</b>. Override it when the error has structure.`, 'lam') },
  { t: 'A generic interface', body: ts(pick(CODE.iface, 1, 12), { sm: true, hl: [1, 7] }) + tc(OUT['13-iface'], { title: 'node' }) +
    box('One contract, every element type', `${c('interface Stack<T>')} is fulfilled by ${c('ArrayStack<T> implements Stack<T>')}. A ${c('Stack<string>')} speaks strings; a ${c('Stack<User>')} users.`, 'lam') },
  { t: 'A generic class: the repository', body: ts(pick(CODE.klass, 3, 10), { sm: true, hl: [2] }) + tc(OUT['14-class'], { title: 'node' }) +
    box('Fixed at new Repo<User>()', `Every method then speaks that type: ${c('add')} takes a ${c('User')}, ${c('get')} returns ${c('User | undefined')}. The constraint lets ${c('add')} use ${c('item.id')}. This is Lab 6’s class.`, 'xanh') },
  { t: 'A method with its own type parameter', body: ts(pick(CODE.method, 0, 10), { sm: true, hl: [7] }) + tc(OUT['15-method'], { title: 'node' }) +
    box('map<U> is independent of T', `A ${c('Box<number>')} mapped with ${c("x => 'seats: ' + x")} becomes a ${c('Box<string>')}. Methods, like functions, can be generic on their own.`, 'lam') },
  { t: 'Trap: a parameter property emits code', body: ts(pick(CODE.paramprop, 2, 6), { sm: true, hl: [3] }) + tc(OUT['16-paramprop'], { wrap: 72 }) +
    box('TS1294 under erasableSyntaxOnly', `${c('constructor(readonly value: T)')} EMITS an assignment, so it is refused (like ${c('enum')} and ${c('namespace')}). Write the field and assign it in the body — so Node can strip types (0.4).`, 'do2') },
  { t: 'Which generic kind, when', body: cards([
      [c('type Result<T, E = string>'), 'A named type with parameters (and a default).'],
      [c('interface Stack<T>'), 'One contract across element types.'],
      [c('class Repo<T>'), 'Fixed at new; every method speaks T.'],
      [c('map<U>(f): Box<U>'), 'A method with its own type parameter.'],
      [c('constructor(readonly x)'), 'A parameter property — TS1294 here.'],
      ['Next · 6.4', 'Inference, and the generic traps.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A ${c('Queue')} hard-coded to ${c('string')} refuses a number for the wrong reason. Make it ${c('class Queue<T>')} and ${c('new Queue<number>()')} accepts 42.`, 'xanh'),
      box('Remember', `Aliases, interfaces and classes all take type parameters; a default keeps the common case short; a parameter property is refused by ${c('erasableSyntaxOnly')}.`, 'lam')) +
    box('Next · 6.4 — Generics in practice: inference & pitfalls', `The return-only generic, the needless generic, literal widening.`, '') },
]);
