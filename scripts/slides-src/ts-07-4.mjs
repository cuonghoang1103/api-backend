/**
 * ts-07-4 — TypeScript · Chapter 7 · Lesson 7.4 "Template literal types" (03/11/2026). Slug: typescript-7-4-template-literal-types.
 * Mọi mã/output lấy từ content/courses/typescript/s07/_ma-ts-07-4.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s07/_ma-ts-07-4.mjs';

export const deck = { key: 'ts-07-4', code: 'TS 7.4', title: 'Template literal types', sub: 'build a string type from other types' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 7 — Advanced types', bai: '7.4' }, [
  { cover: true, t: 'Template literal types', sub: 'Chapter 7 · Lesson 7.4 — a string type built from other types' },
  { t: 'One string per union member', body: ts(pick(CODE.namesNames, 0, 8), { sm: true, hl: [3] }) + tc(OUT['11-names'], { title: 'node' }) +
    box('booking: + each action', `Reads like a template string, at the type level: the type is ${c("'booking:created' | 'booking:confirmed' | 'booking:cancelled'")}. Add an action and the event names grow with it.`, 'xanh') },
  { t: 'Two unions: every combination', body: ts(pick(CODE.combosGrid, 1, 11), { sm: true, hl: [4] }) + tc(OUT['12-combos'], { title: 'node' }) +
    box('The cartesian product', `Two unions in one template → ${c('2 × 2 = 4')} keys. A ${c('Record<MessageKey, string>')} then forces every combination to have a value — a complete translation table.`, 'lam') },
  { t: 'Transforming the string', body: ts(pick(CODE.intrinsicLoud, 1, 9), { sm: true, hl: [2, 3, 4] }) + tc(OUT['13-intrinsic'], { title: 'node' }) +
    box('Uppercase · Capitalize · …', `Four intrinsic string types transform a string type. With a template, ${c("get + Capitalize<'code'>")} is ${c("'getCode'")} — the building block for key remapping.`, 'lam') },
  { t: 'Renaming keys with as', body: ts(pick(CODE.keyremapGetters, 2, 11), { sm: true, hl: [2, 3] }) + tc(OUT['14-keyremap'], { title: 'node' }) +
    box('[K in keyof T as newKey]', `7.1 renamed the value; this renames the KEY. ${c('Getters<Lab>')} has ${c('getCode')} and ${c('getCapacity')} — how a library makes ${c('getX')} methods or ${c('onX')} handlers.`, 'xanh') },
  { t: 'The payoff: a typo is caught', body: ts(pick(CODE.typoName, 0, 5), { sm: true, hl: [4] }) + tc(OUT['15-typo'], { wrap: 72 }) +
    box('TS2820 · Did you mean?', `A closed union means a misspelling is refused with a suggestion. A plain ${c('string')} would accept ${c("'booking:creatd'")} and the handler would silently never fire — the value of Lab 7’s typed events.`, 'do2') },
  { t: 'Which pattern, when', body: cards([
      [c('booking:ACTION'), 'One string per union member — event names.'],
      [c('A.B (two unions)'), 'Every combination — message keys.'],
      [c('Uppercase / Capitalize'), 'Transform the string type.'],
      [c('[K in keyof T as newKey]'), 'Rename each property — getCode.'],
      [c('Resource:Method'), 'A closed set of valid keys.'],
      ['Next · Lab 7', 'A typed event system.'],
    ], 3) },
  { t: 'Practice &amp; Lab 7', to: true, giua: true, body: two(
      box('🧪 Practice', `A ${c('PermissionKey')} typed ${c('string')} accepts ${c("'labget'")}. Make it a template literal ${c('Resource:Method')} and a malformed key becomes TS2820.`, 'xanh'),
      box('Remember', `A template literal type builds a closed set of strings; two unions give the product; ${c('as')} renames keys; a typo is TS2820.`, 'lam')) +
    box('Next · Lab 7 — A typed event system', `Combine template literal names, a payload map, ${c('PayloadOf')}, and two mapped types.`, '') },
]);
