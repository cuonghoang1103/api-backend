/** ts-14-3 — TypeScript · Chapter 14 · Lesson 14.3 "Native #private, getters & static". Slug: typescript-14-3-hash-private-static. _ma: s14/_ma-ts-14-3.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s14/_ma-ts-14-3.mjs';
export const deck = { key: 'ts-14-3', code: 'TS 14.3', title: 'Native #private, getters & static', sub: 'real run-time encapsulation' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 14 — Classes & decorators', bai: '14.3' }, [
  { cover: true, t: 'Native #private,<br>getters &amp; static', sub: 'Chapter 14 · Lesson 14.3 — hidden by the language, not just the types' },
  { t: '#private is enforced at run time', body: ts(pick(CODE.hashprivate, 1, 9), { sm: true, hl: [2] }) + tc(OUT['11-hashprivate'], { title: 'node' }) +
    box('Hidden by the language', `A ${c('#count')}, a ${c('get booked()')} and a ${c('static readonly MAX')}. The ${c('#')} field is reachable only from inside the class body — not by types alone, but by JavaScript itself.`, 'xanh') },
  { t: '#private cannot be read from outside', body: ts(CODE.access, { sm: true, hl: [7] }) + tc(OUT['12-access'], { wrap: 72 }) +
    box('TS18013 · real encapsulation', `Unlike ${c('private')} (only the type checker knows), even plain JavaScript cannot read a ${c('#')} field — no cast, no bracket trick, no run-time escape.`, 'lam') },
  { t: 'getters and static members', to: true, giua: true, body: two(
      box('get booked()', `A read-only computed view of the private count — callers read ${c('svc.booked')} like a field but cannot set it.`, 'xanh'),
      box('static readonly MAX', `Belongs to the class, not an instance — a shared constant read as ${c('BookingService.MAX')}.`, 'lam')) +
    box('They shape the public surface', `Getters, statics and ${c('#private')} together decide exactly what a class exposes.`, '') },
  { t: 'At a glance', body: cards([
      [c('#private'), 'Hidden by the language at run time — reading it outside is TS18013.'],
      ['vs private', 'private is compile-time only; #private is real.'],
      ['a getter', 'get x() — a read-only computed view.'],
      [c('static'), 'Belongs to the class, not an instance.'],
      ['no escape', 'Even plain JavaScript cannot read a # field.'],
      ['Next · 14.4', 'Decorators: wrap a member with a typed function.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A ${c('Counter')} reads its ${c('#n')} from outside — TS18013; read it through the getter and it runs.`, 'xanh'),
      box('Remember', `${c('#private')} is real run-time encapsulation (TS18013 outside), stronger than compile-time ${c('private')}.`, 'lam')) +
    box('Next · 14.4 — Decorators', `A typed function that wraps a method or class — the TC39 standard.`, '') },
]);
