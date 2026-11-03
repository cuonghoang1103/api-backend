/** ts-lab-11 — TypeScript · Chapter 11 · Lab 11. Slug: typescript-11-6-lab-handler-co-kieu. _ma: s11/_ma-ts-lab-11.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s11/_ma-ts-lab-11.mjs';
export const deck = { key: 'ts-lab-11', code: 'TS Lab 11', title: 'A typed handler with an error envelope', sub: 'POST /bookings · grader runs tsc & Node' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const noc = (s) => L(s).map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');
const score = (out) => L(out).filter((l) => /^(✓|✗).* — |^Score:/.test(l)).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 11 — Typing a Node/Express backend', bai: 'Lab 11' }, [
  { cover: true, t: 'Lab 11 — A typed handler<br>with an error envelope', sub: 'write POST /bookings · grader runs tsc & Node' },
  { t: 'The task', to: true, giua: true, body: `<ul>
    <li>Write the ${c('POST /bookings')} handler: a ${c('CreateBooking')} body, an ${c('ApiResult<Booking>')} response</li>
    <li>Validate: ${c('seats ≤ 0')} → 400 ${c('INVALID_SEATS')}; otherwise 201 with the booking</li>
    <li>Define ${c('CreateBooking')} and ${c('Booking')} exactly; no ${c('any')}, ${c('as')} or ${c('!')}</li>
    <li>The ${c('any')} stub scores <b>4.5</b>; a typed handler scores 10</li>
    <li>${c('npm run lab11')} (tsc 7.0.2 + Node 22.23.3)</li></ul>` },
  { t: 'The any stub scores 4.5', body: ts(pick(CODE.starter, 3, 11), { sm: true, hl: [2, 3] }) + tc(score(OUT['l3-starter']), { title: 'npm run lab11 — the any stub', fs: 14 }) +
    box('Runs, but holds no contract', `${c('CreateBooking')} and ${c('Booking')} are ${c('any')} and validation is skipped: the valid case runs, but a wrong field slips and the invalid-seats test fails (D).`, 'do2') },
  { t: 'The eight wrong uses', body: ts(noc(pick(CODE.sai, 0, 9)), { sm: true }) +
    box('Each is caught by a correct model', `a create body missing ${c('purpose')} TS2741 or carrying ${c('id')} TS2353 · ${c('seats')} as a string TS2322 · a bad status TS2322 · ${c('r.data')} on the error branch TS2339 · an ${c('error')} that is a string TS2322.`, 'lam') },
  { t: 'Attempt A: Booking left any (8/10)', body: tc(score(OUT['l4-yeu']), { title: 'npm run lab11 --from lab11/yeu', fs: 14 }) +
    box('As strong as the weakest model', `You typed ${c('CreateBooking')} but left ${c('Booking')} as ${c('any')} — so the Booking checks (a bad status, a missing field) slip, and the ${c('any')} costs the honesty point.`, 'do2') },
  { t: 'Attempt B: an optional field (9.5/10)', body: tc(score(OUT['l5-vua']), { title: 'npm run lab11 --from lab11/vua', fs: 14 }) +
    box('The model must match the endpoint', `Both models are typed, but ${c('CreateBooking')}’s ${c('purpose')} is optional — so a body with no purpose is accepted (S1 slips). The route requires it, so the type must too.`, 'lam') },
  { t: 'The reference: 10/10', body: ts(pick(CODE.ref, 0, 12), { sm: true, hl: [4, 5, 7] }) +
    tc(L(OUT['l6-ref']).filter((l) => /Score:/.test(l)).join('\n'), { title: 'npm run lab11 — the reference', fs: 15 }) +
    box('Every layer in one function', `Exact ${c('CreateBooking')} and ${c('Booking')}, a typed ${c('Handler')} over ${c('ApiResult')}, and a validation branch that sends a typed 400 or a typed 201.`, 'xanh') },
  { t: 'How the grader scores you', to: true, body: cards([
      ['A · compiles (2)', 'handler.ts compiles under the course tsconfig (strict).'],
      ['B · correct uses (1)', 'kiem/phai-dung.ts: a CreateBooking and a Booking.'],
      ['C · honesty (1)', 'no any, no as (as const is fine), no ! and no @ts-.'],
      ['D · behaviour (2)', 'node --test: a valid body → 201 ok, seats ≤ 0 → 400 INVALID_SEATS.'],
      ['E · wrong uses (4)', 'the eight wrong uses, each refused with its exact code (8 × 0.5).'],
      ['pass mark', '7 of 10 — the any stub scores 4.5, the reference 10.'],
    ], 3) },
  { t: 'Before you call it done', body: cards([
      [c('npm run lab11'), 'Prints Score: 10/10 — the grader runs tsc and Node.'],
      ['No any / as / !', 'CreateBooking and Booking are typed exactly.'],
      ['Explain it', 'You can say which type refuses each of S1–S8.'],
      ['Commit', 'feat(api): typed POST /bookings handler (lab 11).'],
      ['stub 4.5, typed 10', 'From a handler that runs to one that holds a contract.'],
      ['Next · Chapter 12', 'Typing a React frontend, where the models cross to the client.'],
    ], 3) },
]);
