/**
 * ts-03-1 — TypeScript · Chapter 3 · Lesson 3.1 "Typing parameters: required, optional, default, rest" (01/11/2026). Slug: typescript-3-1-tham-so.
 * Mọi mã/output lấy từ content/courses/typescript/s03/_ma-ts-03-1.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, js, tc, two, box, cards, c, zm } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s03/_ma-ts-03-1.mjs';

export const deck = { key: 'ts-03-1', code: 'TS 3.1', title: 'Typing parameters', sub: 'required, optional, default, rest' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const noComment = (s) => L(s).filter((l) => !/^\s*\/\//.test(l)).join('\n').replace(/\n\n+/g, '\n');
const OPT_TSC = L(OUT['13-optional']).filter((l) => !/^\s+Type 'undefined'/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 3 — Functions', bai: '3.1' }, [
  { cover: true, t: 'Typing parameters:<br>required, optional, default, rest', sub: 'Chapter 3 · Lesson 3.1 — the contract between a function and every caller' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Chapter 3 goal: LabFlow’s booking checks as typed functions — and pass <b>Lab 3</b></li>
    <li>JavaScript never counts arguments; TypeScript makes every parameter <b>required</b></li>
    <li>Optional ${c('end?')}, its two rules, and ${c('?:')} vs ${c('| undefined')}</li>
    <li>Defaults — and the trap: ${c('null')} does not trigger them</li>
    <li>Rest ${c('...ranges')} and spread ${c('f(...range)')}</li>
    <li>Two booleans in a row → an <b>options object</b>; return types on exported functions</li></ul>` },
  { t: 'JavaScript never counts arguments', body: js(noComment(pick(CODE.missingJs, 1, 99)), { sm: true, hl: [6, 7] }) + tc(OUT['11-js-missing'], { title: 'terminal — Node 22.23.3' }) +
    two(box('Too few', `The missing ${c('end')} is ${c('undefined')} → ${c('NaN:NaN')} on screen, exit code 0.`, 'do2'), box('Too many', `The extra ${c("'BE-201'")} is silently dropped. Every JS parameter is optional.`, 'do2')) },
  { t: 'TypeScript counts: every parameter is required', body: ts(pick(CODE.count, 2, 9), { hl: [6, 7] }) + tc(OUT['12-count'], { wrap: 90 }) +
    box('The opposite default', `Unless you say otherwise, a parameter is <b>required</b>. TS2554 fires for too few <i>and</i> too many arguments.`, 'xanh') },
  { t: 'Optional parameters: ?', body: ts(noComment(pick(CODE.optional, 2, 99)), { sm: true, hl: [2, 5] }) + tc(OPT_TSC, { wrap: 96 }) +
    box('Inside, end is number | undefined', `Pass it on (TS2345), do arithmetic (TS18048) — both refused until you check. The call range becomes “1-2 arguments”.`, 'lam') },
  { t: 'Two rules about ?', body: ts(noComment(pick(CODE.order, 2, 99)), { sm: true, hl: [1] }) + ts(noComment(CODE.optUndef), { sm: true, hl: [2, 4] }) +
    two(tc(OUT['15-order'], { wrap: 56 }), tc(OUT['16-opt-undef'], { wrap: 56 })) +
    two(box('1 · Optional comes last', 'Arguments match by position, so a required parameter after an optional one is TS1016.', 'lam'),
      box('2 · ?: is not | undefined', `${c('b(480)')} is refused; ${c('b(480, undefined)')} is accepted. Only ${c('?')} lets callers leave it out.`, 'lam')) },
  { t: 'Default values', body: ts(noComment(CODE.defaultTime), { sm: true, hl: [1, 6] }) +
    two(tc(OUT['17-default-dts'], { title: 'the signature tsc wrote (.d.ts)', wrap: 56 }), tc(OUT['18-default-run'], { title: 'node use.ts', wrap: 56 })) +
    box('Optional for the caller, never undefined inside', `${c("separator = ':'")} became ${c('separator?: string')}. Passing ${c('undefined')} also triggers the default.`, 'xanh') },
  { t: 'Trap: a default does not replace null', body: ts(pick(CODE.nullRequest, 4, 7), { sm: true }) + tc(OUT['19-null-run'], { title: 'node request.ts — two JSON bodies', wrap: 100 }) +
    two(tc(OUT['20-null-tsc'], { title: 'with a typed body', wrap: 52 }), box('Fix in two places', `Type: ${c('seats?: number | null')}. Code: ${c('body.seats ?? 1')} — ${c('??')} covers null <b>and</b> undefined.`, 'do2')) },
  { t: 'Rest parameters and spread', body: two(`<div>${ts(noComment(pick(CODE.restTotal, 1, 99)), { sm: true })}${tc(OUT['23-rest-run'], { title: 'node use.ts' })}</div>`,
      tc(OUT['22-rest-tsc'] + '\n' + OUT['24-spread-tsc'], { title: 'tsc — wrong.ts and spread.ts', wrap: 54 }), 'r46') +
    box('Spread needs a known length', `${c('rangeLabel(...range)')} with a ${c('TimeRange')} compiles; with ${c('number[]')} it is TS2556. Into a rest parameter, any array spreads.`, 'lam') },
  { t: 'Two booleans in a row: use an options object', body: two(tc(OUT['26-flags-run'], { title: 'book(lab, true, false) — a swapped call compiles and runs' }),
      box('Two booleans side by side', `${c("book('BE-201', false, true)")} swapped the flags: the lecturer is never e-mailed. Both are ${c('boolean')}, so tsc cannot see it.`, 'do2'), 'r46') +
    ts(pick(CODE.options, 1, 4) + '\n  …\n}\n' + pick(CODE.options, 7, 11), { sm: true, hl: [3, 8, 9] }) + tc(OUT['27-flags-tsc'], { wrap: 100 }) },
  { t: 'Return types on exported functions', body: two(ts(noComment(pick(CODE.retInfer, 2, 99)), { sm: true, hl: [4] }),
      `<div>${tc(OUT['29-return-infer'], { title: 'no return type: the error is in ANOTHER file', wrap: 50 })}${tc(OUT['30-return-annotated'], { title: 'with : number — refused where it is written', wrap: 50 })}</div>`) +
    box('Annotate the edges (lesson 1.3)', `Parameters always; return types on every <b>exported</b> function. The return type is a promise to other files — write it once and tsc holds every ${c('return')} to it.`, 'xanh') },
  { t: 'Which parameter, when', body: cards([
      [c('end: number'), 'Required — the default choice. TS2554 for too few or too many.'],
      [c('end?: number'), '“Not known yet” is a real case. Check before use.'],
      [c("sep = ':'"), 'One sensible value. Never undefined inside — but null skips it.'],
      [c('...ranges: TimeRange[]'), 'Any number of the same thing, each checked.'],
      [c('{ notify = false } = {}'), 'Several flags or > 3 parameters: name them.'],
      ['Next · 3.2', 'Functions as values: ' + c('type Rule = (input) => Problem | null')],
    ], 3) },
]);
