/** ts-lab-13 — TypeScript · Chapter 13 · Lab 13. Slug: typescript-13-6-lab-schema-nguon-su-that. _ma: s13/_ma-ts-lab-13.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s13/_ma-ts-lab-13.mjs';
export const deck = { key: 'ts-lab-13', code: 'TS Lab 13', title: 'A schema as the single source of truth', sub: 'validate POST /bookings · grader runs tsc & Node' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const noc = (s) => L(s).map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');
const score = (out) => L(out).filter((l) => /^(✓|✗).* — |^Score:/.test(l)).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 13 — Runtime validation: Zod & Prisma', bai: 'Lab 13' }, [
  { cover: true, t: 'Lab 13 — A schema as the<br>single source of truth', sub: 'validate the boundary · grader runs tsc & Node' },
  { t: 'The task', to: true, giua: true, body: `<ul>
    <li>Write ${c('createBooking(raw: unknown)')}: a Zod schema validates the body, its inferred type is the only ${c('BookingInput')}</li>
    <li>Build ${c('object({ lab: string(), seats: number() })')}, derive ${c('type = Infer<typeof BookingInput>')}</li>
    <li>Validate with ${c('safeParse')}: valid → ${c('{ success: true, data }')}, invalid → ${c('{ success: false, error }')}</li>
    <li>No hand-written copy of the type, no ${c('as')}, no ${c('any')}. The ${c('any')} stub scores <b>5</b></li>
    <li>${c('npm run lab13')} (tsc 7.0.2 + Node 22.23.3)</li></ul>` },
  { t: 'The any stub scores 5', body: ts(pick(CODE.starter, 2, 10), { sm: true, hl: [7] }) + tc(score(OUT['l3-starter']), { title: 'npm run lab13 — the any stub', fs: 14 }) +
    box('A boundary that is not a boundary', `${c('BookingInput')} is ${c('any')} and the raw input is returned untouched: the invalid-body test fails (bad data is trusted), the ${c('any')} costs honesty, and the wrong uses slip.`, 'do2') },
  { t: 'The eight wrong uses', to: true, body: ts(noc(pick(CODE.sai, 2, 10)), { sm: true }) +
    box('Each is caught by a correct schema', `A body missing ${c('seats')} TS2741 or carrying ${c('purpose')} TS2353 · ${c('seats')} a string or ${c('lab')} a number TS2322 · ${c('data')}/${c('error')} unnarrowed TS2339 · a success with no data TS2322 · an error that is a number TS2322.`, 'lam') },
  { t: 'Attempt A: cast instead of validate (7/10)', body: tc(score(OUT['l4-yeu']), { title: 'npm run lab13 --from lab13/yeu', fs: 14 }) +
    box('A schema you do not parse is just a type', `The inferred type is real (wrong uses refused), but ${c('createBooking')} casts the raw input instead of parsing it — the invalid-body test fails and the ${c('as')} costs honesty.`, 'do2') },
  { t: 'Attempt B: one redundant cast (9/10)', body: tc(score(OUT['l5-vua']), { title: 'npm run lab13 --from lab13/vua', fs: 14 }) +
    box('as is where guarantees leak', `Validation is correct and the behaviour tests pass, but one needless ${c('as string')} trips the honesty check. The rule is strict on purpose.`, 'lam') },
  { t: 'The reference: 10/10', body: ts(pick(CODE.ref, 2, 11), { sm: true, hl: [1, 8] }) +
    tc(L(OUT['l6-ref']).filter((l) => /Score:/.test(l)).join('\n'), { title: 'npm run lab13 — the reference', fs: 15 }) +
    box('One definition, both jobs', `${c('object({ lab: string(), seats: number() })')}, the type derived with ${c('Infer')}, and ${c('safeParse')} narrowed on ${c('success')} — nothing reaches data without being validated.`, 'xanh') },
  { t: 'How the grader scores you', to: true, body: cards([
      ['A · compiles (2)', 'schema.ts compiles under the course tsconfig (strict).'],
      ['B · correct uses (1)', 'a BookingInput and a narrowed result.'],
      ['C · honesty (1)', 'no any, no as (as const is fine), no ! and no @ts-.'],
      ['D · behaviour (2)', 'node --test: a valid body is parsed, an invalid one rejected.'],
      ['E · wrong uses (4)', 'the eight wrong uses, each refused with its code (8 × 0.5).'],
      ['pass mark', '7 of 10 — the any stub scores 5, the reference 10.'],
    ], 3) },
  { t: 'Before you call it done', body: cards([
      [c('npm run lab13'), 'Prints Score: 10/10 — tsc and Node.'],
      ['No any / as / !', 'BookingInput is z.Infer, not a hand-written copy.'],
      ['Invalid is rejected', 'A cast would not pass the behaviour test.'],
      ['stub 5, schema 10', 'From a boundary that trusts to one that validates.'],
      ['Commit', 'feat(api): validate POST /bookings with a Zod schema.'],
      ['Next · Chapter 14', 'Classes & decorators: a BookingService.'],
    ], 3) },
]);
