/** ts-lab-12 — TypeScript · Chapter 12 · Lab 12. Slug: typescript-12-6-lab-form-co-kieu. _ma: s12/_ma-ts-lab-12.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s12/_ma-ts-lab-12.mjs';
export const deck = { key: 'ts-lab-12', code: 'TS Lab 12', title: 'A typed component & hook', sub: 'BookingForm · grader runs tsc & Node' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const noc = (s) => L(s).map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');
const score = (out) => L(out).filter((l) => /^(✓|✗).* — |^Score:/.test(l)).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 12 — Typing React', bai: 'Lab 12' }, [
  { cover: true, t: 'Lab 12 — A typed<br>component &amp; hook', sub: 'write a typed BookingForm · grader runs tsc & Node' },
  { t: 'The task', to: true, giua: true, body: `<ul>
    <li>Write a typed <b>BookingForm</b>: a ${c('useBookingForm')} hook + a ${c('BookingFormView')} component</li>
    <li>Define ${c('CreateBooking')} (lab, seats) and ${c('BookingFormProps')} (onSubmit)</li>
    <li>Type the hook so ${c('lab')} is a string and ${c('seats')} a number; parse the input with ${c('Number()')}</li>
    <li>No ${c('any')}, ${c('as')} or ${c('!')}. The ${c('any')} stub scores <b>3</b>; typed scores 10</li>
    <li>${c('npm run lab12')} (tsc 7.0.2 + Node 22.23.3)</li></ul>` },
  { t: 'The any stub scores 3', body: ts(pick(CODE.starter, 3, 13), { sm: true, hl: [10] }) + tc(score(OUT['l3-starter']), { title: 'npm run lab12 — the any stub', fs: 14 }) +
    box('Runs, but holds no contract', `Everything is ${c('any')} and the seat input is never parsed to a number: the correct uses pass, but every wrong use slips and the behaviour test fails (seats stays a string).`, 'do2') },
  { t: 'The eight wrong uses', to: true, body: ts(noc(pick(CODE.sai, 3, 11)), { sm: true }) +
    box('Each is caught by a correct model', `A correct ${c('CreateBooking')}, hook and ${c('BookingFormProps')} must refuse every one: a create body missing ${c('seats')} (TS2741) or carrying a server ${c('id')} (TS2353), ${c('seats')} as a string (TS2322), a change handler called with a bare value instead of a ${c('target')} (TS2353), props with no ${c('onSubmit')} (TS2741), an ${c('onSubmit')} taking the wrong argument (TS2322), ${c('seats')} read as a string (TS2322), and a field the model does not have (TS2339).`, 'lam') },
  { t: 'Attempt A: the hook left any (7.5/10)', body: tc(score(OUT['l4-yeu']), { title: 'npm run lab12 --from lab12/yeu', fs: 14 }) +
    box('As strong as the weakest type', `You typed ${c('CreateBooking')} and ${c('BookingFormProps')} but left the hook’s return ${c('any')} — so the form-side wrong uses slip, and the ${c('any')} costs the honesty point.`, 'do2') },
  { t: 'Attempt B: optional seats (9.5/10)', body: tc(score(OUT['l5-vua']), { title: 'npm run lab12 --from lab12/vua', fs: 14 }) +
    box('The model must match the endpoint', `Everything is typed and there is no ${c('any')}, but ${c('CreateBooking')}’s ${c('seats')} is optional — a body with no seats is accepted (S1 slips). A booking needs a seat count.`, 'lam') },
  { t: 'The reference: 10/10', body: ts(pick(CODE.ref, 4, 12), { sm: true, hl: [5] }) +
    tc(L(OUT['l6-ref']).filter((l) => /Score:/.test(l)).join('\n'), { title: 'npm run lab12 — the reference', fs: 15 }) +
    box('Every layer in one form', `Exact ${c('CreateBooking')}, a hook whose return types ${c('lab')} as a string and ${c('seats')} a number, ${c('Number()')} on the input, and the component typed ${c('FC<BookingFormProps>')}.`, 'xanh') },
  { t: 'How the grader scores you', to: true, body: cards([
      ['A · compiles (2)', 'form.ts compiles under the course tsconfig (strict).'],
      ['B · correct uses (1)', 'kiem/phai-dung.ts: a CreateBooking, props, and a submitted booking.'],
      ['C · honesty (1)', 'no any, no as (as const is fine), no ! and no @ts-.'],
      ['D · behaviour (2)', 'node --test: the hook collects a lab and seats, and submit()’s seats is a number.'],
      ['E · wrong uses (4)', 'the eight wrong uses, each refused with its exact code (8 × 0.5).'],
      ['pass mark', '7 of 10 — the any stub scores 3, the reference 10.'],
    ], 3) },
  { t: 'Before you call it done', body: cards([
      [c('npm run lab12'), 'Prints Score: 10/10 — tsc and Node.'],
      ['No any / as / !', 'CreateBooking and the hook’s return are typed exactly.'],
      ['seats parses', 'Number() turns the input string into a number.'],
      ['Explain it', 'You can say which type refuses each of S1–S8.'],
      ['stub 3, typed 10', 'From a form that runs to one that holds a contract.'],
      ['Course React arc done', 'The backend models now cross, checked, to the client.'],
    ], 3) },
]);
