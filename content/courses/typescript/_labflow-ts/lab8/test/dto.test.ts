import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBooking, applyUpdate, toPublic } from '../src/dto.ts';
test('createBooking', () => {
  const b = createBooking({ lab: 'BE-201', seats: 40, purpose: 'Lab' });
  assert.equal(b.id, 1); assert.equal(b.status, 'PENDING');
});
test('toPublic strips the hash', () => {
  const p = toPublic({ id: 1, name: 'An', email: 'a@x.vn', passwordHash: 'secret' });
  assert.ok(!('passwordHash' in p)); assert.equal(p.name, 'An');
});
test('applyUpdate merges', () => {
  const b = createBooking({ lab: 'BE-201', seats: 40, purpose: 'Lab' });
  assert.equal(applyUpdate(b, { seats: 24 }).seats, 24);
});
