/**
 * ts-lab-7 — TypeScript · Chapter 7 · Lab 7 "A typed event system" (03/11/2026). Slug: typescript-7-6-lab-he-su-kien.
 * Mọi mã/output lấy từ content/courses/typescript/s07/_ma-ts-lab-7.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s07/_ma-ts-lab-7.mjs';

export const deck = { key: 'ts-lab-7', code: 'TS Lab 7', title: 'A typed event system', sub: 'template literal + mapped + conditional' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const noc = (s) => L(s).map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');
const grab = (src, first, n) => { const l = L(src); const i = l.findIndex((x) => x.startsWith(first)); return l.slice(i, i + n).join('\n'); };
const score = (out) => L(out).filter((l) => /^(✓|✗).* — |^Score:/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 7 — Advanced types', bai: 'Lab 7' }, [
  { cover: true, t: 'Lab 7 — A typed<br>event system', sub: 'template literal + mapped + conditional · grader runs tsc & Node' },
  { t: 'The task', to: true, giua: true, body: `<ul>
    <li>LabFlow emits events — booking created / confirmed / cancelled — and every part subscribes</li>
    <li>The teammate used ${c('string')} names and ${c('any')} payloads — it compiles, scores <b>5/10</b></li>
    <li>Rebuild with: template literal ${c('BookingEvent')}, a payload map, ${c('PayloadOf')}, per-event ${c('on')}/${c('emit')}, two mapped types</li>
    <li>Pass mark 7; grader = ${c('npm run lab7')} (tsc 7.0.2 + Node 22.23.3)</li></ul>` },
  { t: 'Zero errors — and why that proves nothing', body: ts(pick(CODE.starter, 2, 8), { sm: true, hl: [1, 2] }) + tc(OUT['l2-starter-tsc'], { title: 'tsc -p lab7/tsconfig.src.json' }) +
    box('string/any refuses nothing', `${c('string')} event names accept any string; ${c('any')} payloads accept any value. The bus "works for every event" by checking none.`, 'do2') },
  { t: 'The grader — the starter scores 5', body: tc(score(OUT['l3-starter']), { title: 'npm run lab7 — the string/any starter', fs: 15 }) +
    box('E is 0/8', `A, B, D pass (loose types compile, runtime works), but C fails (any) and every wrong use slips through. The point is E: make names and payloads a closed, checked set.`, 'lam') },
  { t: 'The eight wrong uses', body: ts(noc(pick(CODE.sai, 7, 18)), { sm: true }) +
    box('Each advanced type catches one', `S1/S4 a typo’d event name → TS2345/TS2322 (7.4) · S2/S3/S8 a wrong payload → TS2741/TS2551/TS2345 (7.1, 7.3) · S5 a bad PayloadOf → TS2344 · S6 a Frozen reassign → TS2540 · S7 a Patch typo → TS2353.`, 'lam') },
  { t: 'Attempt A: a non-generic bus (7.5/10)', body: tc(score(OUT['l4-yeu']), { title: 'npm run lab7 --from lab7/yeu', fs: 15 }) +
    box('unknown payload = no correlation', `The names are typed, but ${c('on(name, handler: (p: unknown))')} drops the link between the name and its payload: B fails, S2 slips, and ${c('Frozen<T> = T')} does nothing (S6). The per-event generic is the whole value.`, 'do2') },
  { t: 'Attempt B: a loose Patch (9.5/10)', body: tc(score(OUT['l5-vua']), { title: 'npm run lab7 --from lab7/vua', fs: 15 }) +
    box('An index signature is not closed', `The bus, the names, ${c('PayloadOf')} and ${c('Frozen')} are right, so 7 of 8 are refused. But ${c('Patch<T> = { [key: string]: unknown }')} accepts a typo (S7). Use ${c('{ [K in keyof T]?: T[K] }')}.`, 'lam') },
  { t: 'The reference: 10/10', body: ts(grab(CODE.ref, 'export type BookingEvent', 1) + '\n\n' + grab(CODE.ref, 'export type EventPayloads', 5), { sm: true, hl: [1] }) +
    tc(L(OUT['l6-ref']).filter((l) => /Score:/.test(l)).join('\n'), { title: 'npm run lab7 — the reference', fs: 15 }) +
    two(box('The whole chapter in one file', `Template literal names, a mapped payload map, a conditional ${c('PayloadOf')}, and two mapped types — each pulling its weight.`, 'xanh'),
      box('Initialised for every event', `The handler map has ${c('[]')} per event, so the generic ${c('on')} pushes into ${c('handlers[name]')} with no cast — add an event and the initialiser forces it here too.`, 'lam')) },
  { t: 'Before you call it done', body: cards([
      [c('npm run lab7'), 'Prints Score: 10/10.'],
      ['No any / as / !', 'Event names are a template literal type.'],
      ['Explain it', 'Which advanced type refuses each S1–S8.'],
      ['Commit', 'feat(events): a typed event system.'],
      ['string/any = 5, typed = 10', 'A closed set the compiler checks.'],
      ['Next · Chapter 8', 'Utility types: Partial, Pick, Omit, Record.'],
    ], 3) },
]);
