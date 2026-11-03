import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBooking, applyUpdate, toPublic } from './dto.ts';
test('createBooking fills the server-owned fields', () => {
  const b = createBooking({ lab: 'BE-201', seats: 40, purpose: 'Lab' });
  assert.equal(b.id, 1); assert.equal(b.status, 'PENDING'); assert.equal(b.lab, 'BE-201');
});
test('toPublic drops the password hash', () => {
  const p = toPublic({ id: 1, name: 'An', email: 'a@x.vn', passwordHash: 'secret' });
  assert.deepEqual(p, { id: 1, name: 'An', email: 'a@x.vn' });
  assert.ok(!('passwordHash' in p));
});
