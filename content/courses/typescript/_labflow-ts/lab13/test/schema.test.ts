import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBooking } from '../schema.ts';

test('a valid body is parsed into typed data', () => {
  const r = createBooking({ lab: 'BE-201', seats: 40 });
  assert.equal(r.success, true);
  if (r.success) { assert.equal(r.data.lab, 'BE-201'); assert.strictEqual(r.data.seats, 40); }
});

test('an invalid body is rejected, not trusted', () => {
  const r = createBooking({ lab: 'BE-201', seats: 'forty' });
  assert.equal(r.success, false);
});
