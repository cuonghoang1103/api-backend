/**
 * ts-01-3 — TypeScript · Chapter 1 · Lesson 1.3 "Type inference: you write less than you think" (01/11/2026). Slug: typescript-1-3-suy-luan-kieu.
 * Mọi mã/output lấy từ content/courses/typescript/s01/_ma-ts-01-3.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, steps, c, zm } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s01/_ma-ts-01-3.mjs';

export const deck = { key: 'ts-01-3', code: 'TS 1.3', title: 'Type inference', sub: 'You write less than you think' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const INFER = L(OUT['13-infer']);
const D_SLOT = INFER.slice(14, 23).join('\n');
const D_BOOK = INFER.slice(27, 34).join('\n');
const WIDEN = L(OUT['13-widen']);
const FIX = L(OUT['13-fixes-dts']);
const VUA = L(OUT['13-vua']).slice(0, 5).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 1 — Why TypeScript exists', bai: '1.3' }, [
  { cover: true, t: 'Type inference:<br>you write less than you think', sub: 'Chapter 1 · Lesson 1.3 — what tsc works out on its own, and where it stops' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Ask tsc what it inferred — even without an editor</li>
    <li>${c('let')} vs ${c('const')}: <b>widening</b> and literal types</li>
    <li>Why an inferred return type made ${c('slot.minutes')} a ${c('number | undefined')}</li>
    <li>Objects widen their properties — and three fixes: annotation, ${c('as const')}, ${c('satisfies')}</li>
    <li><b>Contextual typing</b>: callbacks need no annotations</li>
    <li>Where inference stops — and the rule: annotate the edges, infer the middle</li></ul>` },
  { t: 'Ask the compiler what it inferred', body: ts(CODE.dtsJson, { sm: true, hl: [5, 6] }) +
    tc(`$ npx tsc -p demo1/ts-01-3/dts.json
${WIDEN.slice(1, 4).join('\n')}
…`, { title: 'terminal — declarations tsc wrote for widen.ts' }) +
    box('A .d.ts is a list of types', `${c('declaration')} + ${c('emitDeclarationOnly')} make tsc write only the types it worked out — the same thing your editor shows on hover.`, 'lam') },
  { t: 'let vs const: widening', body: zm(`<table class="t"><tr><th>You write</th><th>tsc infers</th><th>Why</th></tr>
    <tr><td>${c("let a = 'CuongThai'")}</td><td>${c('string')}</td><td>${c('let')} can be reassigned later ⇒ widened to the general type</td></tr>
    <tr><td>${c("const b = 'CuongThai'")}</td><td>${c('"CuongThai"')}</td><td>can never change ⇒ the <b>literal type</b>, exactly that string</td></tr>
    <tr><td>${c('const seats = 31')}</td><td>${c('31')}</td><td>same rule for numbers</td></tr>
    <tr><td>${c('const opensAt = 7 * 60')}</td><td>${c('number')}</td><td>a computed value is not a literal</td></tr>
    <tr><td>${c("const mixed = [1, 'two', true]")}</td><td>${c('(string | number | boolean)[]')}</td><td>arrays get the <b>best common type</b> of their elements</td></tr>
    <tr><td>${c("const input = { role: 'STUDENT', … }")}</td><td>${c('{ role: string; … }')}</td><td>a const object’s <b>properties</b> can change ⇒ widened</td></tr></table>`, 1.12) +
    box('Every row is real', 'Copied from the .d.ts that tsc 7.0.2 wrote for widen.ts.', 'xanh') },
  { t: 'An inferred return type: checkSlot', body: ts(pick(CODE.infer, 12, 22), { sm: true }) +
    two(tc(D_SLOT, { title: 'what tsc inferred (infer/out/booking.d.ts)' }),
      box('Two surprises', `${c('ok')} became ${c('boolean')}, not ${c('true')}/${c('false')}; ${c('code')} became ${c('string')}. To merge the five objects, tsc added ${c('minutes?: undefined')} and ${c('code?: undefined')}.`, 'do2'), 'r64') },
  { t: 'Why slot.minutes is still number | undefined', body: ts(pick(CODE.use, 3, 9), { sm: true, hl: [3] }) +
    tc(OUT['13-use'], { title: 'terminal — tsc 7.0.2', wrap: 100 }) +
    box('ok: boolean cannot narrow', `Both halves of the union say ${c('ok: boolean')}, so ${c('if (!slot.ok) throw')} tells tsc nothing. The same two errors cost the Lab 1 “string/number” attempt point B.`, 'lam') },
  { t: 'The fix: say what you return', body: ts(pick(CODE.ref, 10, 12) + '\n// …\n' + pick(CODE.ref, 22, 23), { sm: true, hl: [4] }) +
    tc(OUT['13-use-fixed'], { title: 'use.ts against the reference rules: 0 errors' }) +
    ts(pick(CODE.returnType, 8, 12), { sm: true, hl: [2] }) +
    tc(OUT['13-return'], { title: 'a typo caught where it is written', wrap: 100 }) },
  { t: 'Objects widen their properties', body: ts(pick(CODE.widenCall, 2, 5), { sm: true, hl: [2] }) +
    tc(OUT['13-widen-call'], { title: 'terminal — tsc 7.0.2', wrap: 100 }) +
    box('Same idea as let', `${c('const')} protects the <b>variable</b>, not its properties: ${c("input.role = 'anything'")} is legal JavaScript. So tsc gives ${c('role')} the type ${c('string')} — and ${c('string')} is wider than ${c('Role')}.`, 'lam') },
  { t: 'Three fixes: annotation, as const, satisfies', body: ts(pick(CODE.fixes, 3, 14), { sm: true }) +
    zm(`<table class="t"><tr><th>Variable</th><th>Type in fixes.d.ts</th><th>Use it when</th></tr>
    <tr><td>${c('input1')}</td><td>${c('BookingInput')}</td><td>the value IS that type, nothing more</td></tr>
    <tr><td>${c('input2')}</td><td>every property ${c('readonly')} + literal (${c("role: 'STUDENT'")}, ${c('seats: 31')})</td><td>a fixed constant</td></tr>
    <tr><td>${c('input3')}</td><td>${c('role: "STUDENT"')}, the rest ${c('string')}/${c('number')}</td><td>check it, keep its own type</td></tr></table>`, 1.0) },
  { t: 'Contextual typing: callbacks need no annotations', body: ts(pick(CODE.context, 7, 11), { sm: true }) +
    tc(L(OUT['13-context']).slice(1, 5).join('\n'), { title: 'context.d.ts + node context.ts' }) +
    ts(pick(CODE.noContext, 4, 6), { sm: true, hl: [2] }) +
    tc(OUT['13-no-context'], { title: 'no context, no type' }) },
  { t: 'Where inference stops: parameters', body: two(
      `<div>${tc(L(OUT['13-starter']).slice(0, 6).join('\n'), { title: 'Lab 1 starter: JS renamed to .ts', wrap: 62 })}${tc(OUT['13-starter-count'], { title: 'count by code' })}</div>`,
      steps([`A parameter has <b>no value yet</b> where it is declared — nothing to infer from`,
        `Strict mode refuses to guess: ${c('TS7006')} (plain parameter), ${c('TS7031')} (destructured)`,
        `13 red lines = 13 decisions only <b>you</b> can make`])) },
  { t: 'When to annotate, when to let it infer', body: cards([
      ['✍️ Annotate: parameters', 'Always. A parameter’s type is a decision, not a deduction.'],
      ['✍️ Annotate: exported returns', `Pins the contract; a typo errors in the function, not at 20 callers.`],
      ['✍️ Annotate: data built far from use', `${c('const day: BookingInput[] = [...]')} keeps ${c('role')} narrow.`],
      ['🤖 Infer: locals', `${c('const total = 0')} — writing ${c(': number')} adds a second place to update.`],
      ['🤖 Infer: callbacks', `${c('bookings.map((b) => b.minutes)')} — the context already knows.`],
      ['💬 Interview', '“Do you annotate everything?” — No: the edges of a module, and wherever inference would widen.'],
    ], 3) },
]);
