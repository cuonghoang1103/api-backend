import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseTime, formatTime } from './time.ts';

test('07:00 is minute 420', () => {
  assert.equal(parseTime('07:00'), 420);
});

test('rejects "7:00" (needs two digits)', () => {
  assert.throws(() => parseTime('7:00'), TypeError);
});

test('rejects 24:00', () => {
  assert.throws(() => parseTime('24:00'), RangeError);
});

test('formats minute 450 as 07:30', () => {
  assert.equal(formatTime(450), '07:30');
});
