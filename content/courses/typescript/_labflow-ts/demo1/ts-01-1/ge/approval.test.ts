import { test } from 'node:test';
import assert from 'node:assert/strict';
import { needsApproval } from './approval.ts';

test('31 student seats need approval (BR-06)', () => {
  assert.equal(needsApproval({ seats: 31, role: 'STUDENT' }), true);
});

test('exactly 30 student seats do NOT need approval (BR-06)', () => {
  assert.equal(needsApproval({ seats: 30, role: 'STUDENT' }), false);
});
