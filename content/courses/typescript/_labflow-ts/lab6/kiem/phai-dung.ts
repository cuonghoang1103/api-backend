// Lab 6 — CORRECT uses. They must keep compiling with your generics (part B).
import { Repo, groupBy, pluck, ok, err, mapResult, unwrapOr } from '../src/repo.ts';
import type { Result } from '../src/repo.ts';
import type { User, BookingRecord } from '../src/model.ts';

declare const an: User;
declare const rec: BookingRecord;

// The same Repo works for any type with an id — and keeps that exact type.
const users = new Repo<User>();
const bookings = new Repo<BookingRecord>();
const added: Result<User> = users.add(an);
const got = users.get(1);
const name: string = got.ok ? got.value.name : '(none)';       // got.value is a User, narrowed
const list: BookingRecord[] = bookings.all();

// pluck keeps the value type; groupBy keeps the item type.
const emails: string[] = pluck([an], 'email');
const byRole = groupBy([an], (u) => u.role);
const studentIds: number[] = (byRole.get('STUDENT') ?? []).map((u) => u.id);

// ok / err / map / unwrap, all generic.
const r: Result<number> = ok(10);
const doubled: Result<number> = mapResult(r, (n) => n * 2);
const value: number = unwrapOr(r, 0);
const failed: Result<User> = err('boom');

console.log(added.ok, name, list.length, emails, studentIds, doubled, value, failed.ok, bookings.size, rec.id);
