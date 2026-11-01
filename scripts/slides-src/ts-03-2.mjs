/**
 * ts-03-2 — TypeScript · Chapter 3 · Lesson 3.2 "Functions as values: function types & callbacks" (01/11/2026). Slug: typescript-3-2-callback.
 * Mọi mã/output lấy từ content/courses/typescript/s03/_ma-ts-03-2.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, js, tc, two, box, cards, c, zm } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s03/_ma-ts-03-2.mjs';

export const deck = { key: 'ts-03-2', code: 'TS 3.2', title: 'Functions as values', sub: 'function types & callbacks' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const strip = (s) => L(s).filter((l) => !/^\s*\/\/|^$|^import/.test(l)).join('\n');
const JS_RULES = pick(CODE.js, 1, 13).replace(/\s+\/\/.*$/gm, '');
const JS_OUT = L(OUT['02-js']).slice(1).join('\n');
const WRONG = strip(CODE.wrong).replace(/\s+\/\/.*$/gm, '');
const RUN_OUT = L(OUT['01-rules-run']).slice(1).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 3 — Functions', bai: '3.2' }, [
  { cover: true, t: 'Functions as values:<br>function types &amp; callbacks', sub: 'Chapter 3 · Lesson 3.2 — LabFlow checks a booking with a list of rule functions' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A <b>function type</b>: ${c('(input: BookingInput) => Problem | null')}, named ${c('Rule')}</li>
    <li>A list of rules and one ${c('validate')} that runs them all</li>
    <li>Three ways a callback fails to fit — and why <b>fewer</b> parameters is fine</li>
    <li>A <b>factory</b> that returns a rule: ${c('maxSeats(limit)')} and its closure</li>
    <li>Contextual typing in ${c('map')} / ${c('filter')}; why ${c('Function')} is as loose as ${c('any')}</li>
    <li>The ${c('.map(parseInt)')} trap: compiles, returns garbage</li></ul>` },
  { t: 'JavaScript: two rules with the wrong shape', body: js(JS_RULES, { sm: true, hl: [11, 12] }) + tc(JS_OUT, { title: 'node demo3/ts-03-2/js/validate.js — exit 0', wrap: 100 }) +
    two(box('45 seats pass a 40-seat limit', `${c('seatsOnly')} receives the whole request; ${c('{…} > 40')} is false, so it returns ${c('null')}.`, 'do2'),
      box('A string is not a problem', `${c('tooLong')} returns ${c("'TOO_LONG'")}; a string has no ${c('code')}, so the screen shows ${c('undefined')}.`, 'do2')) },
  { t: 'A function type: name the shape of a rule', body: ts(pick(CODE.rules, 4, 19), { sm: true, hl: [5, 7, 12] }) +
    box('Read it as a sentence', `A ${c('Rule')} takes one ${c('BookingInput')} and returns a ${c('Problem')} or ${c('null')}. The ${c(': Rule')} on each value types its parameter — no annotation inside.`, 'lam') },
  { t: 'validate runs the whole list', body: ts(pick(CODE.rules, 26, 34), { hl: [1, 4] }) + two(tc(RUN_OUT, { title: 'node demo3/ts-03-2/rules/run.ts', wrap: 52 }),
    box('A list of functions is just an array', `${c('readonly Rule[]')} — read-only, like the schedule in lesson 2.2. Adding a rule is adding an element; Lab 3 builds exactly this.`, 'xanh')) },
  { t: 'Which functions fit the slot?', body: ts(WRONG, { sm: true, hl: [3, 4, 5, 6] }) + tc(OUT['03-wrong'], { title: 'terminal — tsc 7.0.2', wrap: 112 }) },
  { t: 'Fewer parameters fit — more do not', body: zm(`<table class="t"><tr><th>Function put in a Rule slot</th><th>tsc</th><th>Why</th></tr>
    <tr><td>${c('() => null')}</td><td>✅</td><td>ignoring an argument cannot break anything</td></tr>
    <tr><td>${c('(seats: number) => …')}</td><td>❌ TS2322</td><td>the caller passes a BookingInput, not a number</td></tr>
    <tr><td>${c('(input, day: string) => null')}</td><td>❌ TS2322</td><td>needs an argument the caller never sends</td></tr>
    <tr><td>${c("(input) => 'TOO_LONG'")}</td><td>❌ TS2322</td><td>return must fit ${c('Problem | null')}</td></tr>
    <tr><td>${c("{ code: 'TOO_LATE' }")}</td><td>❌ TS2322</td><td>down to the literal union ${c('ProblemCode')}</td></tr></table>`, 1.08) +
    box('Read nested errors from the last line up', '“Type \'BookingInput\' is not assignable to type \'number\'” is the root cause; the lines above only say where it was found.', 'lam') },
  { t: 'A function that returns a rule', body: ts(pick(CODE.rules, 20, 25), { hl: [2, 4] }) + tc(RUN_OUT, { title: 'node demo3/ts-03-2/rules/run.ts — maxSeats(40) vs maxSeats(60)', wrap: 100 }) +
    two(box('A closure', `The returned arrow still sees ${c('limit')} after ${c('maxSeats')} returned. ${c('maxSeats(40)')} refuses 45 seats; ${c('maxSeats(60)')} gives “0 problems”.`, 'xanh'),
      box('The shape of Express middleware', `${c('requireRole(role)')} returns ${c('(req, res, next) => …')} — the same factory idea. The return type ${c(': Rule')} also types the inner ${c('input')}.`, 'lam')) },
  { t: 'Contextual typing in map and filter', body: ts(pick(CODE.context, 7, 11).replace(/\s+\/\/.*$/gm, '')) +
    tc(L(OUT['07-context-dts']).slice(1).join('\n'), { title: 'the .d.ts tsc wrote — nothing was annotated', wrap: 88 }) +
    box('filter narrows by itself (TypeScript 5.5+)', `${c('(p) => p !== null')} is inferred as a check, so the result is ${c('Problem[]')}, not ${c('(Problem | null)[]')}.`, 'xanh') },
  { t: 'Function is not a function type', body: ts(strip(CODE.fnLoose).replace(/\s+\/\/.*$/gm, '').replace(/\{ lab: 'BE-201', seats: 31, role: 'STUDENT', /, '{ …, '), { sm: true, hl: [1, 5] }) +
    two(tc(OUT['04-fn-loose'], { title: 'Function[] — tsc silent · node', wrap: 34 }), tc(OUT['05-fn-typed'], { title: 'the same list as Rule[]', wrap: 60 }), 'r37') +
    box('Treat Function like any', `Calling a ${c('Function')} returns ${c('any')}: a wrong rule and the typo ${c('cod')} both slip through. Lab 3’s grader refuses it.`, 'do2') },
  { t: 'Trap: .map(parseInt) compiles and returns garbage', body: ts(pick(CODE.hours, 1, 5), { sm: true, hl: [3] }) +
    two(tc(OUT['08-parseint'], { title: 'tsc: 0 errors · node', wrap: 52 }), tc(OUT['09-why'], { title: 'what map really calls', wrap: 46 })) +
    box('Why tsc agrees', `${c('map')} passes ${c('(value, index, array)')}; ${c('parseInt')} has an optional ${c('radix')}. The types fit — the meaning does not. Wrap it: ${c('(h) => Number.parseInt(h, 10)')}.`, 'do2') },
  { t: 'When to use which', body: cards([
      ['type Rule = (…) => …', 'the same callback shape in several places'],
      ['inline (p: Problem) => void', 'a one-off callback parameter'],
      ['factory(…): Rule', 'build configured callbacks; annotate the return'],
      ['not Function', 'calls return any — write the real signature'],
      ['wrap library functions', '(h) => Number.parseInt(h, 10), not .map(parseInt)'],
      ['property, not method', 'callback fields: method syntax skips strictFunctionTypes'],
    ], 3) },
]);
