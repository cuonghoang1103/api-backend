// Lesson 1.5 — "npm test" runs this with Node's built-in test runner
const { test } = require('node:test');
const assert = require('node:assert/strict');
const dayjs = require('dayjs');

test('dayjs counts days between two dates', () => {
  assert.equal(dayjs('2026-12-01').diff(dayjs('2026-11-02'), 'day'), 29);
});
