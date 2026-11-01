/**
 * ts-03-4 — TypeScript · Chapter 3 · Lesson 3.4 "this: the parameter you did not know you had" (01/11/2026). Slug: typescript-3-4-this.
 * Mọi mã/output lấy từ content/courses/typescript/s03/_ma-ts-03-4.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c, zm } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s03/_ma-ts-03-4.mjs';

export const deck = { key: 'ts-03-4', code: 'TS 3.4', title: 'this: the parameter you did not know you had', sub: 'decided by the call, checked by tsc — mostly' };

const L = (s) => s.split('\n');
const bo = (s) => L(s).filter((l) => !/^\s+at (ModuleJob|async |listOnTimeout|process\.)|^Node\.js v|^$/.test(l)).join('\n');
const LOST_OBJ = L(CODE.lostValidator).slice(13, 25).join('\n');
const LOST_RUN = L(CODE.lostRun).slice(5, 9).join('\n');
const LOST_OUT = bo(OUT['12-lost-run']).split('\n').filter((l) => !/^\s+at file/.test(l)).join('\n');
const PLAIN = L(CODE.plain).slice(4, 12).join('\n');
const PARAM_TYPE = L(CODE.paramValidator).slice(5, 10).join('\n');
const USE = L(CODE.paramUse).slice(5, 14).join('\n');
const PT = L(OUT['15-param-tsc']);
const TSC_2684 = [PT[0], PT[4]].join('\n');
const TSC_2345 = PT.slice(0, 4).join('\n');
const MAP_LINE = L(OUT['16-param-run']).filter((l) => /^\$|\.map\(validator\.run\) |length =/.test(l)).join('\n');
const TIMER = bo(OUT['17-timer']);
const FORM = L(CODE.form).slice(5, 15).filter((l) => l !== '').join('\n');
const ARROW_OBJ = L(CODE.arrow).slice(6, 17).join('\n');
const ARROW_OUT = [OUT['18-arrow-tsc'], ...bo(OUT['19-arrow-run']).split('\n').filter((l) => /^\$|TypeError/.test(l))].join('\n');
const FIX_FN = L(CODE.fixValidator).slice(7, 19).map((l) => l.replace(/\s+\/\/.*$/, '')).join('\n');
const FIX_OUT = [OUT['20-fix-tsc'], OUT['21-fix-run']].join('\n');

export const slides = lamDeck({ chuong: 'Chapter 3 — Functions', bai: '3.4' }, [
  { cover: true, t: 'this: the parameter<br>you did not know you had', sub: 'Chapter 3 · Lesson 3.4 — LabFlow’s validator, called five ways, run for real' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>${c('this')} is decided by <b>how a function is called</b>, not where it is written</li>
    <li>Why ${c('const run = validator.run; run(bad)')} compiles and crashes</li>
    <li>${c('noImplicitThis')} (TS2683) and the <b>this parameter</b> (TS2684) — Lab 3’s last wrong use</li>
    <li>The hole: callbacks in ${c('map')} and timers are <b>not</b> checked</li>
    <li>${c('this: void')} for APIs that take callbacks (TS2345)</li>
    <li>The sturdiest fix: a closure — no ${c('this')} at all</li></ul>` },
  { t: 'A validator whose run() reads this', body: two(ts(LOST_OBJ, { hl: [4, 6] }),
      `<div>${box('A method reads this', `Inside ${c('run')}, ${c('this')} means “the object run was called on”. For a method in an object literal tsc types ${c('this')} as that object, so ${c('this.rules')} compiles.`, 'lam')}${box('The catch', 'The word <b>called</b>. Change how run is called and this changes — while the code stays the same.', 'do2')}</div>`, 'r64') },
  { t: 'Take the method off its object', body: ts(LOST_RUN, { sm: true, hl: [3, 4] }) + tc(OUT['11-lost-tsc']) + tc(LOST_OUT, { title: 'terminal — Node 22.23.3', wrap: 96 }) +
    box('Zero errors, then a crash', `${c('run')} is the same function without the link to ${c('validator')}. A plain call in an ES module gets ${c('this === undefined')}.`, 'do2') },
  { t: 'this is decided by the call', body: zm(`<table class="t"><tr><th>Call</th><th>this (measured, Node 22, ES module)</th></tr>
    <tr><td>${c('validator.run(bad)')}</td><td>the object before the dot</td></tr>
    <tr><td>${c('run(bad)')}</td><td>${c('undefined')} ⇒ TypeError</td></tr>
    <tr><td>${c('run.call(validator, bad)')} · ${c('run.bind(validator)')}</td><td>the object you give</td></tr>
    <tr><td>${c('[bad].map(validator.run)')}</td><td>${c('undefined')} (unless map’s thisArg)</td></tr>
    <tr><td>${c('setTimeout(validator.run, 0, bad)')}</td><td>Node’s ${c('Timeout')} object</td></tr>
    <tr><td>an arrow function</td><td>this of the place it was <b>written</b></td></tr></table>`, 1.12) },
  { t: 'noImplicitThis: TS2683', body: ts(PLAIN, { sm: true, hl: [3] }) + tc(OUT['13-implicit'], { wrap: 96 }) + tc(OUT['14-implicit-loose'], { title: 'the same file, noImplicitThis: false' }) +
    box('Clean is not safe', `With the flag off, ${c('this')} silently becomes ${c('any')} — ${c('this.rulez')} would compile too. Keep strict on.`, 'do2') },
  { t: 'The this parameter: TS2684', body: ts(PARAM_TYPE, { sm: true, hl: [4] }) + ts(USE, { sm: true, hl: [3] }) + tc(TSC_2684, { wrap: 96 }) +
    box('', `A rule, not an argument: Node strips it (${c('run.length')} is still 1). Only the plain call is refused.`, 'xanh') },
  { t: 'Trap: callbacks slip through', body: tc(MAP_LINE, { title: 'map — 0 tsc errors, then at runtime', wrap: 100 }) + tc(TIMER, { title: 'setTimeout — 0 tsc errors, then at runtime', wrap: 100 }) +
    box('Why tsc is silent', `The callback types of ${c('map')} and ${c('setTimeout')} declare no ${c('this')}, so nothing is checked. The timer even calls run with its own ${c('Timeout')} as this.`, 'do2') },
  { t: 'The API side: promise this: void', body: ts(FORM, { sm: true, hl: [1, 6] }) + tc(TSC_2345, { wrap: 100 }) +
    box('Refused where it is registered', `${c('(this: void, …) =>')} says “I will call you with no object”. A method that needs one is TS2345; the arrow wrapper passes. The lint rule ${c('unbound-method')} does the same job.`, 'xanh') },
  { t: 'An arrow in an object literal', to: true, body: two(ts(ARROW_OBJ, { hl: [3, 5] }), `<div>${tc(ARROW_OUT, { title: 'tsc, then Node', wrap: 48 })}${box('Written at module level', `An arrow takes ${c('this')} from where it is written: the module, where ${c('this')} is ${c('undefined')}. The object literal does not count.`, 'do2')}</div>`) },
  { t: 'The sturdiest fix: no this at all', body: ts(FIX_FN, { sm: true, hl: [4, 6] }) + two(tc(FIX_OUT, { title: 'extracted, in map, in a timer', wrap: 50 }), box('The closure keeps the rules', `${c('run')} never asks who called it, so every call style works. Prefer it whenever the code is yours.`, 'xanh')) },
  { t: 'Which fix, when', body: cards([
      ['Your own object', 'No <b>this</b>: a factory + closure. Works however it is called.'],
      ['Must keep a method', 'Declare <b>this: Validator</b> — plain calls become TS2684'],
      ['Passing a method', 'Wrap it: <b>(b) =&gt; validator.run(b)</b>'],
      ['Cannot wrap', '<b>bind(validator)</b> or map’s <b>thisArg</b>'],
      ['Writing the API', 'Callback type <b>(this: void, …) =&gt; …</b> — TS2345'],
      ['From Java', '<b>validator::run</b> stays bound; JS <b>validator.run</b> does not'],
    ], 3) },
]);
