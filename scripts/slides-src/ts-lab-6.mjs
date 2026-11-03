/**
 * ts-lab-6 — TypeScript · Chapter 6 · Lab 6 "A generic repository" (03/11/2026). Slug: typescript-6-6-lab-repository-generic.
 * Mọi mã/output lấy từ content/courses/typescript/s06/_ma-ts-lab-6.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s06/_ma-ts-lab-6.mjs';

export const deck = { key: 'ts-lab-6', code: 'TS Lab 6', title: 'A generic repository', sub: 'Result<T, E>, Repo<T>, groupBy' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const noc = (s) => L(s).map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');
const grab = (src, first, n) => { const l = L(src); const i = l.findIndex((x) => x.startsWith(first)); return l.slice(i, i + n).join('\n'); };
const score = (out) => L(out).filter((l) => /^(✓|✗).* — |^Score:/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 6 — Generics', bai: 'Lab 6' }, [
  { cover: true, t: 'Lab 6 — A generic<br>repository', sub: 'Result<T, E>, Repo<T extends { id }>, groupBy · grader runs tsc & Node' },
  { t: 'The task', to: true, giua: true, body: `<ul>
    <li>One repository for every entity — users, bookings, labs — keeping each type</li>
    <li>A teammate reached for ${c('any')} — it compiles, scores <b>4.5/10</b></li>
    <li>Rewrite with generics: ${c('Result<T, E = string>')}, ${c('Repo<T extends { id: number }>')}, ${c('pluck')}, ${c('groupBy')}</li>
    <li>Pass mark 7; grader = ${c('npm run lab6')} (tsc 7.0.2 + Node 22.23.3)</li>
    <li>A: compile · B: correct uses · C: honesty · D: behaviour · E: 8 wrong uses</li></ul>` },
  { t: 'Zero errors — and why that proves nothing', body: ts(pick(CODE.starter, 2, 8), { sm: true, hl: [1, 5] }) + tc(OUT['l2-starter-tsc'], { title: 'tsc -p lab6/tsconfig.src.json' }) +
    box('any turns checking off', `${c('get')} returns ${c('any')}, ${c('pluck')} takes a ${c('string')} key, the class is not even generic. A model built on ${c('any')} refuses nothing (1.4).`, 'do2') },
  { t: 'The grader — the starter scores 4.5', body: tc(score(OUT['l3-starter']), { title: 'npm run lab6 — the any starter', fs: 15 }) +
    box('any is not generic', `B fails: ${c('new Repo<User>()')} is <b>TS2558</b> ("Expected 0 type arguments"). C fails (any). E is 1/8. Only the behaviour (D) passes, because the code happens to be correct.`, 'lam') },
  { t: 'The eight wrong uses', body: ts(noc(pick(CODE.sai, 8, 17)), { sm: true }) +
    two(box('Missing / wrong type', `S1/S2 no id → TS2741 · S3 bad key → TS2345 · S5/S6 wrong value/fallback → TS2345`, 'do2'),
      box('Not narrowed / lost type', `S4 value off a Result → TS2339 · S7 Map.get undefined → TS2532 · S8 pluck('id') is number[] → TS2339`, 'do2')) },
  { t: 'Attempt A: no constraint, a cast (6.5/10)', body: tc(score(OUT['l4-yeu']), { title: 'npm run lab6 --from lab6/yeu', fs: 15 }) +
    box('The constraint is not optional', `${c('class Repo<T>')} with no ${c('extends { id }')} cannot read ${c('item.id')}, so it casts — and ${c('get')} returns ${c('T | undefined')} instead of a ${c('Result')}. B and D fail.`, 'do2') },
  { t: 'Attempt B: a loose pluck key (7/10)', body: tc(score(OUT['l5-vua']), { title: 'npm run lab6 --from lab6/vua', fs: 15 }) +
    box('string key loses two things', `${c('pluck<T>(items, key: string): unknown[]')} accepts a typo (S3) and returns ${c('unknown[]')}, so B fails and S8 reports the wrong code. Use ${c('K extends keyof T')} → ${c('T[K][]')}.`, 'lam') },
  { t: 'The reference: 10/10', body: ts(grab(CODE.ref, 'export type Result', 4) + '\n\n' + grab(CODE.ref, 'export class Repo', 8), { sm: true, hl: [1, 2, 3, 6] }) +
    tc(L(OUT['l6-ref']).filter((l) => /Score:/.test(l)).join('\n'), { title: 'npm run lab6 — the reference', fs: 15 }) +
    box('The constraint replaces every cast', `${c('T extends { id: number }')} lets ${c('add')} read ${c('item.id')} with no ${c('as')} — the honest version is shorter than the loose one. One class, every type kept.`, 'xanh') },
  { t: 'Before you call it done', body: cards([
      [c('npm run lab6'), 'Prints Score: 10/10.'],
      ['No any / as / !', 'The Repo is Repo<T extends { id: number }>.'],
      ['Explain it', 'Which line refuses each S1–S8.'],
      ['Commit', 'feat(repo): generic Result and repository.'],
      ['any = 4.5, generic = 10', 'Reuse AND safety, from one class.'],
      ['Next · Chapter 7', 'Mapped & conditional types, template literals.'],
    ], 3) },
]);
