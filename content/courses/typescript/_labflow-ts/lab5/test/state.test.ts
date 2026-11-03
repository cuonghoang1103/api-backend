import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { BookingRecord } from '../src/model.ts';
import { describe, recordOf, isActive, canCancel, cancel, STEP_LABEL } from '../src/state.ts';
import type { BookingState } from '../src/state.ts';

const rec: BookingRecord = {
  id: 10,
  createdAt: '2026-11-03T09:00:00Z',
  lab: 'BE-201',
  userId: 1,
  range: [480, 600],
  seats: 30,
  status: 'PENDING',
  note: null,
};

test('describe covers every step', () => {
  assert.equal(describe({ step: 'draft' }), 'Draft — nothing chosen yet');
  assert.equal(describe({ step: 'invalid', code: 'OFF_GRID' }), 'Invalid slot: OFF_GRID');
  assert.equal(describe({ step: 'pending', record: rec }), 'Pending approval (#10)');
  assert.equal(describe({ step: 'confirmed', record: rec }), 'Confirmed (#10)');
  assert.equal(describe({ step: 'cancelled', record: rec, reason: 'room closed' }), 'Cancelled (#10): room closed');
});

test('recordOf returns the record only where there is one', () => {
  assert.equal(recordOf({ step: 'draft' }), null);
  assert.equal(recordOf({ step: 'invalid', code: 'TOO_LONG' }), null);
  assert.equal(recordOf({ step: 'pending', record: rec }), rec);
  assert.equal(recordOf({ step: 'cancelled', record: rec, reason: 'x' }), rec);
});

test('isActive is true only for pending and confirmed', () => {
  assert.equal(isActive({ step: 'draft' }), false);
  assert.equal(isActive({ step: 'invalid', code: 'OFF_GRID' }), false);
  assert.equal(isActive({ step: 'pending', record: rec }), true);
  assert.equal(isActive({ step: 'confirmed', record: rec }), true);
  assert.equal(isActive({ step: 'cancelled', record: rec, reason: 'x' }), false);
});

test('canCancel matches isActive', () => {
  assert.equal(canCancel({ step: 'confirmed', record: rec }), true);
  assert.equal(canCancel({ step: 'draft' }), false);
});

test('cancel returns a NEW cancelled state and leaves the input alone', () => {
  const before: BookingState = { step: 'confirmed', record: rec };
  const after = cancel(before, 'exam week');
  assert.deepEqual(after, { step: 'cancelled', record: rec, reason: 'exam week' });
  assert.equal(before.step, 'confirmed'); // input must not be mutated
  assert.notEqual(after, before);
});

test('cancel is a no-op for states that cannot be cancelled', () => {
  const draft: BookingState = { step: 'draft' };
  assert.equal(cancel(draft, 'why'), draft);
});

test('STEP_LABEL has one entry per step', () => {
  assert.deepEqual(Object.keys(STEP_LABEL).sort(), ['cancelled', 'confirmed', 'draft', 'invalid', 'pending']);
  assert.equal(STEP_LABEL.pending, 'Pending');
});
