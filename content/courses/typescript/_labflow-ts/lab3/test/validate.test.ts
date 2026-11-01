// Lab 3 — behaviour of the rule list. Run: node --test --test-reporter=spec lab3/test/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toMinutes, validate, maxSeats, onGrid, endAfterStart, withinHours, notTooLong, totalMinutes, createValidator, RULES } from '../src/validate.ts';
import type { BookingInput } from '../src/booking.ts';

const ok: BookingInput = { lab: 'BE-201', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };
const codes = (input: BookingInput) => validate(input, RULES).map((p) => p.code);

test('toMinutes: one time', () => assert.equal(toMinutes('08:30'), 510));
test('toMinutes: a list of times', () => assert.deepEqual(toMinutes(['07:00', '21:00']), [420, 1260]));
test('a good request has no problems', () => assert.deepEqual(validate(ok, RULES), []));
test('each rule alone', () => {
  assert.equal(onGrid({ ...ok, start: '08:15' })?.code, 'OFF_GRID');
  assert.equal(endAfterStart({ ...ok, end: '07:30' })?.code, 'END_BEFORE_START');
  assert.equal(withinHours({ ...ok, start: '06:00' })?.code, 'OUTSIDE_HOURS');
  assert.equal(notTooLong({ ...ok, end: '12:30' })?.code, 'TOO_LONG');
});
test('validate collects EVERY problem, in rule order', () =>
  assert.deepEqual(codes({ ...ok, start: '06:15', end: '06:00' }), ['OFF_GRID', 'END_BEFORE_START', 'OUTSIDE_HOURS']));
test('maxSeats(40): exactly 40 seats is allowed', () => assert.equal(maxSeats(40)({ ...ok, seats: 40 }), null));
test('maxSeats(40): 41 seats is a problem', () => assert.equal(maxSeats(40)({ ...ok, seats: 41 })?.code, 'TOO_MANY_SEATS'));
test('onProblem hears each problem once', () => {
  const heard: string[] = [];
  validate({ ...ok, start: '08:15', seats: 99 }, RULES, (p) => heard.push(p.code));
  assert.deepEqual(heard, ['OFF_GRID', 'TOO_MANY_SEATS']);
});
test('totalMinutes: none, one, two ranges', () => {
  assert.equal(totalMinutes(), 0);
  assert.equal(totalMinutes([480, 600]), 120);
  assert.equal(totalMinutes([480, 600], [660, 720]), 180);
});
test('createValidator: run uses the validator’s own rules', () => {
  const v = createValidator([maxSeats(10)]);
  assert.deepEqual(v.run(ok).map((p) => p.code), ['TOO_MANY_SEATS']);
});
