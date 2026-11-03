/**
 * ts-05-1 — TypeScript · Chapter 5 · Lesson 5.1 "Union types & narrowing" (03/11/2026). Slug: typescript-5-1-union-narrowing.
 * Mọi mã/output lấy từ content/courses/typescript/s05/_ma-ts-05-1.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, js, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s05/_ma-ts-05-1.mjs';

export const deck = { key: 'ts-05-1', code: 'TS 5.1', title: 'Union types', sub: 'narrowing by type and control flow' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 5 — Unions, literals & narrowing', bai: '5.1' }, [
  { cover: true, t: 'Union types &amp;<br>narrowing', sub: 'Chapter 5 · Lesson 5.1 — one of these, made safe' },
  { t: 'What you will take away from this chapter', to: true, giua: true, body: `<ul>
    <li>A <b>union</b> ${c('A | B')} is "one of these" — use only what members share, then <b>narrow</b></li>
    <li>Guards tsc understands: ${c('typeof')}, truthiness, ${c('===')}, ${c('in')}, ${c('instanceof')}</li>
    <li>Narrow literal unions and ${c('SlotResult')} by value (5.2)</li>
    <li>Design a <b>discriminated union</b> + a <b>type predicate</b> — LabFlow's booking state (5.3)</li>
    <li>Prove a switch complete with ${c('never')}; pass <b>Lab 5</b> (5.4)</li></ul>` },
  { t: 'JavaScript: one function, two kinds of value', body: js(CODE.idJs, { hl: [2, 3] }) + tc(OUT['11-js'].split('\n').slice(0, 4).join('\n'), { title: 'node — the second call throws', wrap: 60 }) +
    box('Found at runtime, in production', `${c("'42'")} from the URL, ${c('42')} from an old table. Numbers have no ${c('padStart')} — a crash on the path nobody tested.`, 'do2') },
  { t: 'A union says "one of these"', body: ts(pick(CODE.unionShow, 1, 8), { sm: true, hl: [2, 6] }) + tc(OUT['12-union'], { wrap: 64 }) +
    box('Only the common part', `${c('string | number')} allows what <b>both</b> members have. ${c('padStart')} is a string method → <b>TS2339</b>, "does not exist on type <b>number</b>".`, 'lam') },
  { t: 'Narrow with typeof', body: ts(pick(CODE.typeofShow, 2, 7), { sm: true, hl: [3, 4] }) + tc(OUT['13-typeof'], { title: 'tsc clean, then node' }) +
    two(box('Inside the branch, smaller', `In the ${c('if')}, ${c('id')} is ${c('string')}; after it, ${c('number')}. Each branch gets the member's methods.`, 'xanh'),
      box('The one that bites', `${c("typeof null")} is ${c("'object'")} — null hides among objects. Prefer an explicit ${c('x === null')}.`, 'lam')) },
  { t: 'Truthiness — and the 0 trap', body: ts(pick(CODE.truthyNote, 1, 12), { sm: true, hl: [2, 8] }) + tc(L(OUT['14-truthy']).slice(0, 6).join('\n'), { title: 'node — seatsLabel(0) is wrong', wrap: 40 }) +
    box('if (x) eats 0 and \'\' too', `Truthiness drops every falsy value, not just ${c('null')}/${c('undefined')}. A real 0-seat room printed <b>"seats unknown"</b>. Use ${c('seats !== undefined')}.`, 'do2') },
  { t: 'Control-flow analysis: tsc follows your code', body: ts(pick(CODE.cfaReassign, 0, 8), { sm: true, hl: [3, 6, 7] }) + tc(OUT['15-cfa'], { title: 'tsc clean, then node' }) +
    box('Type depends on where you are', `After ${c('id = 42')}, tsc knows ${c('id')} is ${c('number')} — ${c('toFixed')} needs no guard. A return, a throw, an assignment each update what tsc knows next.`, 'lam') },
  { t: 'When nothing is left: never', body: ts(pick(CODE.exhaustNever, 2, 12), { sm: true, hl: [2, 3, 6] }) + tc('$ npx tsc -p demo5/ts-05-1/exhaust\n[clean — 0 errors]', { title: 'both members handled' }) +
    box('never is the empty type', `After the string and number branches return, ${c('id')} is ${c('never')}. Passing it to a ${c('never')} slot compiles — the basis of exhaustiveness (5.4).`, 'xanh') },
  { t: 'Which guard, when', body: cards([
      [c('typeof x === \'string\''), 'Primitives: string, number, boolean, bigint… (typeof null is \'object\').'],
      [c('if (x)'), 'Drops null/undefined — and 0, \'\', NaN, false. Watch the empty value.'],
      [c('x === \'LITERAL\''), 'A member of a literal union; a tag of a discriminated union (5.2, 5.3).'],
      [c('\'key\' in x'), 'Object unions with different keys (5.2).'],
      [c('x instanceof C'), 'Classes and the unknown of a catch (5.2).'],
      ['Next · 5.2', 'Narrowing by value: SlotResult, switch, in, instanceof.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A sensor reading is ${c('number | string')} (a temperature or ${c("'offline'")}). ${c('r.toFixed(1)')} is TS2339 — narrow with ${c('typeof')} and keep the two answers apart.`, 'xanh'),
      box('Remember', `A union allows only the shared part; a guard narrows it; ${c('if (x)')} also drops 0 and ${c("''")}; the type depends on where you are.`, 'lam')) +
    box('Next · 5.2 — Literal unions & narrowing by value', `${c('SlotResult')} by its ${c('ok')} tag, a ${c('switch')} that needs no default, ${c('in')} and ${c('instanceof')}.`, '') },
]);
