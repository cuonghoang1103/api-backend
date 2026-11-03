/**
 * ts-06-4 — TypeScript · Chapter 6 · Lesson 6.4 "Generics in practice: inference & pitfalls" (03/11/2026). Slug: typescript-6-4-generics-in-practice.
 * Mọi mã/output lấy từ content/courses/typescript/s06/_ma-ts-06-4.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s06/_ma-ts-06-4.mjs';

export const deck = { key: 'ts-06-4', code: 'TS 6.4', title: 'Generics in practice', sub: 'inference & the common traps' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 6 — Generics', bai: '6.4' }, [
  { cover: true, t: 'Generics in practice:<br>inference &amp; pitfalls', sub: 'Chapter 6 · Lesson 6.4 — looks safe, checks nothing?' },
  { t: 'Inference does the work', body: ts(pick(CODE.inferGroup, 0, 13), { sm: true, hl: [9] }) + tc(OUT['11-infer'], { title: 'node' }) +
    box('No type arguments needed', `${c('groupBy(users, u => u.role)')} infers ${c('T = User')} and ${c('K = Role')}, so the result is ${c('Map<Role, User[]>')}. This is Lab 6’s ${c('groupBy')}.`, 'xanh') },
  { t: 'Trap 1: a return-only generic checks nothing', body: ts(pick(CODE.parseReturn, 2, 10), { sm: true, hl: [2, 3, 7] }) + tc(OUT['12-returnonly'], { title: 'node — id is "oops"', wrap: 56 }) +
    box('0 errors, wrong data', `${c('T')} is only in the return, so tsc has nothing to check it against — ${c('parseJson<User[]>(…)')} is a cast in disguise. Return ${c('unknown')} and narrow with a guard.`, 'do2') },
  { t: 'Trap 2: a type parameter used once is noise', body: ts(pick(CODE.needlessCount, 1, 9), { sm: true, hl: [2, 7] }) + tc(OUT['13-needless'], { title: 'node — identical' }) +
    box('T must connect in to out', `${c('countGeneric<T>')} never uses ${c('T')} in its result, so it buys nothing — ${c('count(items: readonly unknown[])')} is honest and shorter.`, 'lam') },
  { t: 'Trap 3: literals widen', body: ts(pick(CODE.widenFirst, 4, 10), { sm: true, hl: [2, 5] }) + tc(OUT['14-widen'], { title: 'node' }) +
    box('firstOf(["a","b"]) infers string', `A plain array literal widens its elements, so the exact codes are gone. Add ${c('as const')} at the call to keep ${c("'BE-201' | 'AL-301'")}.`, 'do2') },
  { t: 'A const type parameter keeps literals', body: ts(pick(CODE.constpFirst, 1, 8), { sm: true, hl: [2] }) + tc(OUT['15-constp'], { title: 'node' }) +
    box('<const T> — no as const needed', `${c('firstOf<const T>(…)')} (TS 5.0+) infers the narrowest type, so ${c("firstOf(['BE-201', 'AL-301'])")} is ${c("'BE-201' | 'AL-301' | undefined")} with nothing extra.`, 'xanh') },
  { t: 'Generic smells &amp; fixes', body: cards([
      [c('f<T>(): T'), 'Return-only — checks nothing; return unknown + guard.'],
      [c('count<T>(items: T[]): number'), 'T used once — drop it, use unknown[].'],
      [c("firstOf(['a','b'])"), 'Widens to string — as const or <const T>.'],
      [c('f<T>(x: T, y: T)'), 'Mixing types infers the common one — hides a mismatch.'],
      ['Inference', 'groupBy(users, u => u.role) — no <…> needed.'],
      ['Next · Lab 6', 'A generic repository + groupBy.'],
    ], 3) },
  { t: 'Practice &amp; Lab 6', to: true, giua: true, body: two(
      box('🧪 Practice', `${c('loadUsers<T>')} returns ${c('T')}, a type nobody checked. Remove the generic: return ${c('User[]')} and verify the data with a real guard (5.3).`, 'xanh'),
      box('Remember', `Inference fills ${c('<T>')} from the arguments; a return-only generic checks nothing; a type parameter used once is needless; literals widen.`, 'lam')) +
    box('Next · Lab 6 — A generic repository', `Build ${c('Result<T, E>')}, ${c('Repo<T extends { id }>')} and ${c('groupBy')}; ${c('any')} scores 4.5.`, '') },
]);
