// Lab 6 — eight uses that are WRONG. Your generics must make tsc refuse every one of them.
// The grader compiles this file against YOUR src/ and expects one error, with this code, on each marked line.
import { Repo, groupBy, pluck, ok, mapResult, unwrapOr } from '../src/repo.ts';
import type { User } from '../src/model.ts';

declare const users: User[];
declare const repo: Repo<User>;

repo.add({ email: 'x@fpt.edu.vn', name: 'X', role: 'STUDENT', createdAt: '' });   // S1 TS2741 a User needs an id
const r2 = new Repo<{ name: string }>();                                          // S2 TS2741 the constraint needs { id: number }
const g = pluck(users, 'ghost');                                                  // S3 TS2345 'ghost' is not a key of User
const v = repo.get(1).value;                                                      // S4 TS2339 a Result must be narrowed first
const m = mapResult(ok(10), (s: string) => s.length);                             // S5 TS2345 the value is a number, not a string
const u = unwrapOr(ok('open'), 0);                                                // S6 TS2345 the fallback must match the value type
const first = groupBy(users, (x) => x.role).get('STUDENT').length;                // S7 TS2532 Map.get may be undefined
const caps = pluck(users, 'id').map((id) => id.toUpperCase());                     // S8 TS2339 pluck('id') is number[], not string[]
export { r2, g, v, m, u, first, caps };
