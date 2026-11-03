import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Repo, groupBy, pluck, ok, err, mapResult, unwrapOr } from '../src/repo.ts';
import type { Result } from '../src/repo.ts';
import type { User } from '../src/model.ts';

const an: User = { id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' };
const binh: User = { id: 2, createdAt: '2026-11-03', email: 'binh@fpt.edu.vn', name: 'Binh', role: 'LECTURER' };

test('Repo add / get / remove / size', () => {
  const repo = new Repo<User>();
  assert.equal(repo.add(an).ok, true);
  assert.equal(repo.add(an).ok, false); // duplicate
  assert.equal(repo.size, 1);
  const got = repo.get(1);
  assert.equal(got.ok && got.value.name, 'An');
  assert.equal(repo.get(99).ok, false);
  assert.equal(repo.remove(1).ok, true);
  assert.equal(repo.size, 0);
});

test('Repo.all', () => {
  const repo = new Repo<User>();
  repo.add(an);
  repo.add(binh);
  assert.deepEqual(repo.all().map((u) => u.id), [1, 2]);
});

test('ok / err / mapResult / unwrapOr', () => {
  const r: Result<number> = ok(10);
  assert.equal(mapResult(r, (n) => n + 1).ok, true);
  assert.equal(unwrapOr(r, 0), 10);
  assert.equal(unwrapOr(err('x'), -1), -1);
});

test('pluck', () => {
  assert.deepEqual(pluck([an, binh], 'name'), ['An', 'Binh']);
  assert.deepEqual(pluck([an, binh], 'id'), [1, 2]);
});

test('groupBy', () => {
  const byRole = groupBy([an, binh], (u) => u.role);
  assert.deepEqual(byRole.get('STUDENT')?.map((u) => u.id), [1]);
  assert.equal(byRole.get('ADMIN'), undefined);
});
