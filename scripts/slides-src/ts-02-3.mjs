/**
 * ts-02-3 — TypeScript · Chapter 2 · Lesson 2.3 "The special types: any, unknown, never, void" (01/11/2026). Slug: typescript-2-3-kieu-dac-biet.
 * Mọi mã/output lấy từ content/courses/typescript/s02/_ma-ts-02-3.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, js, tc, two, box, cards, steps, c, zm } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s02/_ma-ts-02-3.mjs';

export const deck = { key: 'ts-02-3', code: 'TS 2.3', title: 'The special types', sub: 'any, unknown, never, void' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const strip = (s) => L(s).filter((l) => !/^\s*\/\/|^$/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 2 — The basic type system', bai: '2.3' }, [
  { cover: true, t: 'The special types:<br>any, unknown, never, void', sub: 'Chapter 2 · Lesson 2.3 — four types that describe situations, not data' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The <b>type hierarchy</b>: ${c('unknown')} on top, ${c('never')} at the bottom, ${c('any')} as a hole</li>
    <li>${c('void')}: “there is nothing here to use” — and why it is not ${c('undefined')}</li>
    <li>${c('never')} for a ${c('fail()')} helper — and the surprise where tsc infers ${c('void')}</li>
    <li>An <b>exhaustive switch</b>: tsc names the case a teammate forgot</li>
    <li>The empty-list trap: ${c('never[]')} refuses every ${c('push')}</li>
    <li>${c('object')}, ${c('{}')} and ${c('Object')} — three look-alikes</li></ul>` },
  { t: 'The type hierarchy: a top and a bottom', body: two(ts(strip(CODE.assign), { sm: true, hl: [7, 10, 13] }),
      `<div>${tc(OUT['11-hierarchy'], { title: 'terminal — tsc 7.0.2', wrap: 52 })}${box('Read a type as a set of values', `${c('unknown')} = every value (top). ${c('never')} = no value at all (bottom). ${c('a = b')} is allowed when b’s set fits inside a’s.`, 'lam')}</div>`, 'r64') },
  { t: 'What the three errors tell you', body: zm(`<table class="t"><tr><th>Assignment</th><th>Result</th><th>Why</th></tr>
    <tr><td>anything → ${c('unknown')}</td><td>✅</td><td>top: every value fits</td></tr>
    <tr><td>${c('unknown')} → ${c('string')}</td><td>❌ TS2322</td><td>check it first (lesson 1.4)</td></tr>
    <tr><td>${c('never')} → ${c('string')}, ${c('number')}</td><td>✅</td><td>bottom: the empty set fits everywhere</td></tr>
    <tr><td>${c('31')} → ${c('never')}</td><td>❌ TS2322</td><td>no value has type never</td></tr>
    <tr><td>${c('any')} → ${c('string')}, ${c('number')}</td><td>✅ unchecked</td><td>any switches the table off…</td></tr>
    <tr><td>${c('any')} → ${c('never')}</td><td>❌ TS2322</td><td>…except here: even any does not fit</td></tr></table>`, 1.12) +
    box('One line to remember', `${c('unknown')}: everything goes in, nothing comes out unchecked. ${c('never')}: nothing goes in, it goes anywhere.`, 'xanh') },
  { t: 'void: there is nothing here to use', body: ts(pick(CODE.log, 1, 18), { sm: true, hl: [6, 7, 11, 17] }) +
    tc(OUT['12-void-tsc'], { title: 'terminal — tsc 7.0.2', wrap: 100 }) },
  { t: 'At runtime void is undefined — and still refused', body: two(tc(OUT['13-void-run'], { title: 'terminal — Node 22.23.3' }),
      steps([`A JS function without ${c('return')} gives ${c('undefined')}`,
        `${c('void')} is a promise about <b>intent</b>: “do not rely on this result”`,
        `So ${c('const r3: undefined = logBooking(3)')} is TS2322`,
        `A <b>callback slot</b> typed void may return a value — ${c('forEach((id) => seen.push(id))')} is fine (lesson 3.3)`]), 'r46') +
    two(box('Declared void', `${c('function saveNote(): void { return note.length; }')} ⇒ TS2322. Your own void function must not return a value.`, 'do2'),
      box('Rarely: undefined', `Need a result that is exactly ${c('undefined')} and may be tested? Write the return type ${c('undefined')}. Normally: ${c('void')}.`, 'lam')) },
  { t: 'never: a function that never comes back', body: ts(strip(pick(CODE.fail, 3, 20)), { sm: true, hl: [1, 4, 7, 11, 12] }) +
    tc(OUT['14-never-dts'], { title: 'declarations tsc wrote for fail.ts', wrap: 100 }) },
  { t: 'The surprise: a declaration is inferred void', body: ts(CODE.use, { sm: true, hl: [4] }) +
    tc(OUT['15-never-use'], { title: 'terminal — tsc 7.0.2', wrap: 100 }) +
    two(box('The rule (since TypeScript 2.0)', `${c('never')} is inferred only for function <b>expressions</b> and <b>arrows</b>. A ${c('function')} declaration that only throws gets ${c('void')}.`, 'do2'),
      box('So', `Write ${c(': never')} on every helper that only throws. ${c('number | never')} is just ${c('number')}.`, 'xanh')) },
  { t: 'Exhaustive switch: every code handled', body: ts(pick(CODE.v1, 3, 15), { sm: true, hl: [8] }) +
    two(tc(pick(OUT['16-ex-v1'], 1, 6), { title: 'node exhaustive/v1/run.ts', wrap: 60 }),
      box('Why it compiles', `After four ${c('case')}s, no value is left for ${c('code')} in ${c('default')} — its type is ${c('never')}. The ${c('throw')} stays for values from outside.`, 'lam'), 'r64') },
  { t: 'A teammate adds LAB_CLOSED', body: tc(OUT['17-ex-v2'], { title: 'the never version, against the new list', wrap: 100 }) +
    zm(`<table class="t"><tr><th>How the switch ends</th><th>tsc</th><th>The user sees</th></tr>
    <tr><td>plain JavaScript</td><td>—</td><td>“Booking refused: undefined”</td></tr>
    <tr><td>${c("default: return 'Something is wrong…'")}</td><td><b>exit 0, silent</b></td><td>a vague message, forever</td></tr>
    <tr><td>no default, ${c(': string')}</td><td>TS2366 “lacks ending return”</td><td>caught — but which case?</td></tr>
    <tr><td>${c('const unreachable: never = code')}</td><td>TS2322 names ${c('"LAB_CLOSED"')}</td><td>caught, value named</td></tr></table>`, 1.05) +
    box('This website does it too', `Desktop app: ${c('const x: never = cai.dinhDang')} (music export formats) and ${c('assertNever(status)')} (updater states).`, 'xanh') },
  { t: 'Trap: the empty list that refuses everything', body: two(`<div>${ts(L(CODE.day).filter((l) => /^const day|^day\.bookings/.test(l)).join('\n'), { sm: true, hl: [1] })}${tc(OUT['21-empty'], { title: 'terminal — tsc 7.0.2', wrap: 50 })}</div>`,
      `<div>${ts(L(CODE.dayFixed).filter((l) => /^type LabDay|^const day|^day\.bookings\.push/.test(l)).join('\n'), { sm: true, hl: [1, 2] })}${tc(OUT['22-empty-fixed'], { title: 'fixed: exit 0', wrap: 56 })}</div>`) +
    box('Why never[]?', `An empty ${c('[]')} as an object <b>property</b> has nothing to infer from ⇒ ${c('never[]')}. A local ${c('const ids = []')} “evolves” as you push. Say what the list will hold.`, 'do2') +
    box('Spot it fast', `An unexpected ${c('never')} in an error usually means “tsc ran out of possible values”: look for an empty array or two types that cannot overlap.`, 'lam') },
  { t: 'object, {} and Object — and which type when', body: ts(strip(CODE.objects), { sm: true, hl: [2, 5] }) +
    two(tc(OUT['23-objects'], { title: 'terminal — tsc 7.0.2', wrap: 46 }),
      cards([
        [c('unknown'), 'data from outside'],
        [c(': void'), 'only does something'],
        [c(': never'), 'always throws'],
        [c('x: never'), 'exhaustive default'],
        [c('{}'), '“not null/undefined”'],
        [c('any'), 'almost never'],
      ], 2), 'r46') },
]);
