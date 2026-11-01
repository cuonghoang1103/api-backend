// Lab 2 — behaviour of the schedule module. Run: node --test --test-reporter=spec lab2/test/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LABS, isLab, toRange, findEntry, noteOf, firstStart, sortByStart, labelOf } from '../src/schedule.ts';
import type { ScheduleEntry } from '../src/schedule.ts';

// Three bookings of 2 Nov 2026, in the order the database returned them.
const e1: ScheduleEntry = { id: 1, lab: 'BE-201', range: [600, 720], bookedBy: 'an.nv', note: null };
const e2: ScheduleEntry = { id: 2, lab: 'BE-201', range: [480, 600], bookedBy: 'binh.tt', note: '', cancelledAt: '2026-11-01T09:15:00Z' };
const e3: ScheduleEntry = { id: 3, lab: 'BE-202', range: [540, 660], bookedBy: 'chi.lm', note: 'Bring HDMI adapters' };
const today = (): ScheduleEntry[] => [e1, e2, e3];

test('LABS lists the three LabFlow labs', () => assert.deepEqual([...LABS], ['BE-201', 'BE-202', 'AL-301']));
test('isLab: BE-201 yes, BE-999 and be-201 no', () => {
  assert.equal(isLab('BE-201'), true);
  assert.equal(isLab('BE-999'), false);
  assert.equal(isLab('be-201'), false);
});
test('toRange: 08:00-10:00 is [480, 600]', () => assert.deepEqual([...toRange('08:00-10:00')], [480, 600]));
test('toRange: a single time is a TypeError', () => assert.throws(() => toRange('08:00'), TypeError));
test('toRange: three times is a TypeError', () => assert.throws(() => toRange('08:00-10:00-12:00'), TypeError));
test('findEntry: id 3 is the BE-202 booking', () => assert.equal(findEntry(today(), 3)?.bookedBy, 'chi.lm'));
test('findEntry: an unknown id gives undefined', () => assert.equal(findEntry(today(), 99), undefined));
test('noteOf: a NULL note reads "(no note)"', () => assert.equal(noteOf(e1), '(no note)'));
test('noteOf: an empty note stays empty', () => assert.equal(noteOf(e2), ''));
test('firstStart: BE-201 starts at 600 (the 480 booking is cancelled)', () => assert.equal(firstStart(today(), 'BE-201'), 600));
test('firstStart: AL-301 has no booking today, so null', () => assert.equal(firstStart(today(), 'AL-301'), null));
test('sortByStart: sorted copy, the input keeps its order', () => {
  const input = today();
  assert.deepEqual(sortByStart(input).map((e) => e.id), [2, 3, 1]);
  assert.deepEqual(input.map((e) => e.id), [1, 2, 3]);
});
test('labelOf: shows times, booker and cancellation date', () => {
  assert.equal(labelOf(e2), 'BE-201 08:00–10:00 binh.tt (cancelled 2026-11-01)');
  assert.equal(labelOf(e3), 'BE-202 09:00–11:00 chi.lm');
});
