import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkSlot } from './slot.ts';

test('08:00–10:00 is a 120-minute slot', () => {
  assert.deepEqual(checkSlot('08:00', '10:00'), { ok: true, minutes: 120 });
});

test('09:00–09:00 is not a slot (end must be after start)', () => {
  assert.deepEqual(checkSlot('09:00', '09:00'), { ok: false, code: 'END_BEFORE_START' });
});
