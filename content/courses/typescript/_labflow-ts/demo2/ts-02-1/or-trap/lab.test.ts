import { test } from 'node:test';
import assert from 'node:assert/strict';
import { capacityOf, noteOf } from './lab.ts';

test('a lab with no recorded capacity gets the default 40', () => {
  assert.equal(capacityOf({ code: 'BE-202', capacity: null }), 40);
});
test('a lab closed for maintenance has 0 seats', () => {
  assert.equal(capacityOf({ code: 'AL-301', capacity: 0 }), 0);
});
test('no note shows (no note)', () => assert.equal(noteOf(null), '(no note)'));
test('an empty note stays empty', () => assert.equal(noteOf(''), ''));
