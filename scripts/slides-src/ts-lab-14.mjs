/** ts-lab-14 — TypeScript · Chapter 14 · Lab 14. Slug: typescript-14-6-lab-service-repo. _ma: s14/_ma-ts-lab-14.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s14/_ma-ts-lab-14.mjs';
export const deck = { key: 'ts-lab-14', code: 'TS Lab 14', title: 'A service over an abstract repo', sub: 'BookingService + BookingRepo · grader runs tsc & Node' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const noc = (s) => L(s).map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');
const score = (out) => L(out).filter((l) => /^(✓|✗).* — |^Score:/.test(l)).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 14 — Classes & decorators', bai: 'Lab 14' }, [
  { cover: true, t: 'Lab 14 — A service<br>over an abstract repo', sub: 'BookingService + abstract BookingRepo · grader runs tsc & Node' },
  { t: 'The task', to: true, giua: true, body: `<ul>
    <li>Type ${c('Booking')} (id, lab); make ${c('BookingRepo')} abstract with ${c('find')} and ${c('save')}</li>
    <li>Write ${c('BookingService')} with a ${c('#repo')} set in the constructor</li>
    <li>${c('book')} saves a typed booking and returns it; ${c('find')} returns ${c('Booking | undefined')}</li>
    <li>No ${c('any')}, ${c('as')} or ${c('!')}. The ${c('any')} stub scores <b>5.5</b></li>
    <li>${c('npm run lab14')} (tsc 7.0.2 + Node 22.23.3)</li></ul>` },
  { t: 'The any stub scores 5.5', body: ts(pick(CODE.starter, 1, 11), { sm: true, hl: [11] }) + tc(score(OUT['l3-starter']), { title: 'npm run lab14 — the any stub', fs: 14 }) +
    box('A service with no boundaries', `${c('Booking')} is ${c('any')}, ${c('BookingRepo')} is non-abstract, the repo is a public field: the Booking wrong uses slip, the abstract rule is gone, and the repo is reachable from outside.`, 'do2') },
  { t: 'The eight wrong uses', to: true, body: ts(noc(pick(CODE.sai, 4, 12)), { sm: true }) +
    box('Each is caught by a designed service', `${c('new BookingRepo()')} TS2511 · a subclass with no methods TS2654 · a ${c('Booking')} missing ${c('lab')} TS2741 or an extra field TS2353 or string ${c('id')} TS2322 · ${c('book')} with a string id TS2345 · reading ${c('#repo')} TS18013 · a MemoryRepo as a BookingService TS2739.`, 'lam') },
  { t: 'Attempt A: Booking left any (7.5/10)', body: tc(score(OUT['l4-yeu']), { title: 'npm run lab14 --from lab14/yeu', fs: 14 }) +
    box('As strong as the weakest type', `You made ${c('BookingRepo')} abstract and the repo ${c('#private')}, but left ${c('Booking')} as ${c('any')} — the three Booking checks slip and the ${c('any')} costs honesty.`, 'do2') },
  { t: 'Attempt B: TS-private, not #private (9.5/10)', body: tc(score(OUT['l5-vua']), { title: 'npm run lab14 --from lab14/vua', fs: 14 }) +
    box('private is not #private', `The repo is a ${c('private')} field — reading it outside is still refused, but with TS2341, not the TS18013 the wrong-use expected. True run-time encapsulation needs ${c('#private')}.`, 'lam') },
  { t: 'The reference: 10/10', body: ts(pick(CODE.ref, 0, 11), { sm: true, hl: [3, 9] }) +
    tc(L(OUT['l6-ref']).filter((l) => /Score:/.test(l)).join('\n'), { title: 'npm run lab14 — the reference', fs: 15 }) +
    box('Every class feature, one design', `${c('Booking')} typed, ${c('BookingRepo')} abstract, and ${c('BookingService')} holding a ${c('#repo')} — a wrong booking, an outside repo read, and a direct abstract build all refused.`, 'xanh') },
  { t: 'How the grader scores you', to: true, body: cards([
      ['A · compiles (2)', 'service.ts compiles under the course tsconfig (strict).'],
      ['B · correct uses (1)', 'a Booking, a service, a booking made and found.'],
      ['C · honesty (1)', 'no any, no as (as const is fine), no ! and no @ts-.'],
      ['D · behaviour (2)', 'node --test: the service books through the repo and finds it back.'],
      ['E · wrong uses (4)', 'the eight wrong uses, each refused with its code (8 × 0.5).'],
      ['pass mark', '7 of 10 — the any stub scores 5.5, the reference 10.'],
    ], 3) },
  { t: 'Before you call it done', body: cards([
      [c('npm run lab14'), 'Prints Score: 10/10 — tsc and Node.'],
      ['No any / as / !', 'BookingRepo abstract, repo #private, Booking typed.'],
      ['Encapsulation', 'The compiler and the language both enforce it.'],
      ['stub 5.5, design 10', 'From a service with no boundaries to one with all of them.'],
      ['Commit', 'feat(api): BookingService over an abstract repo.'],
      ['Next · Chapter 15', 'Build performance: tsc, incremental, project references.'],
    ], 3) },
]);
