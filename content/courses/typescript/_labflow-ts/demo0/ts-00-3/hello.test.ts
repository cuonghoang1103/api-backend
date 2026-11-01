// src/hello.test.ts — node:test is built into Node, nothing to install.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatTime } from './hello.ts';

test('420 minutes is 07:00', () => {
  assert.equal(formatTime(420), '07:00');
});

test('1290 minutes is 21:30', () => {
  assert.equal(formatTime(1290), '21:30');
});
