// src/practice.test.ts — the practice task of lesson 0.3.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatTime } from './hello.ts';

test('midnight is 00:00', () => {
  assert.equal(formatTime(0), '00:00');
});

test('the last slot ends at 21:00', () => {
  assert.equal(formatTime(21 * 60), '21:00');
});
