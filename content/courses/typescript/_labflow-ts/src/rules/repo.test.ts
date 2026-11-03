import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Repo, groupBy, pluck, ok, err, mapResult, unwrapOr } from './repo.ts';
import type { Result } from './repo.ts';
import type { User } from './model.ts';

const an: User = { id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' };
const binh: User = { id: 2, createdAt: '2026-11-03', email: 'binh@fpt.edu.vn', name: 'Binh', role: 'LECTURER' };

test('Repo.add / get / remove return Results', () => {
  const repo = new Repo<User>();
  assert.deepEqual(repo.add(an), { ok: true, value: an });
  assert.equal(repo.size, 1);
  const dup = repo.add(an);
  assert.equal(dup.ok, false);
  const got = repo.get(1);
  assert.equal(got.ok && got.value.name, 'An');
  const miss = repo.get(99);
  assert.equal(miss.ok === false && miss.error, 'not found: 99');
  assert.equal(repo.remove(1).ok, true);
  assert.equal(repo.size, 0);
});

test('Repo.all returns the stored items', () => {
  const repo = new Repo<User>();
  repo.add(an);
  repo.add(binh);
  assert.deepEqual(repo.all().map((u) => u.id), [1, 2]);
});

test('ok / err / mapResult / unwrapOr', () => {
  const r: Result<number> = ok(10);
  const doubled = mapResult(r, (n) => n * 2);
  assert.equal(doubled.ok && doubled.value, 20);
  const bad: Result<number> = err('nope');
  const mapped = mapResult(bad, (n) => n * 2);
  assert.equal(mapped.ok, false);
  assert.equal(unwrapOr(r, 0), 10);
  assert.equal(unwrapOr(bad, -1), -1);
});

test('pluck keeps the value type', () => {
  const names: string[] = pluck([an, binh], 'name');
  assert.deepEqual(names, ['An', 'Binh']);
  const ids: number[] = pluck([an, binh], 'id');
  assert.deepEqual(ids, [1, 2]);
});

test('groupBy keys by a function and keeps the item type', () => {
  const byRole = groupBy([an, binh], (u) => u.role);
  assert.deepEqual(byRole.get('STUDENT')?.map((u) => u.id), [1]);
  assert.deepEqual(byRole.get('LECTURER')?.map((u) => u.id), [2]);
  assert.equal(byRole.get('ADMIN'), undefined);
});
