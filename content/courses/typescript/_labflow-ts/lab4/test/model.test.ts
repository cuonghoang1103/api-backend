// Lab 4 — behaviour of the data model. Run: node --test --test-reporter=spec lab4/test/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LAB_INFO, labName, freeSeats, seatsByLab, indexById, withStatus, toView } from '../src/model.ts';
import type { BookingRecord, User } from '../src/model.ts';

const an: User = { id: 1, createdAt: '2026-11-01T08:00:00Z', email: 'an.nv@fpt.edu.vn', name: 'Nguyen Van An', role: 'STUDENT', studentCode: 'HE176322' };
const binh: User = { id: 2, createdAt: '2026-11-01T08:05:00Z', email: 'binh.tt@fpt.edu.vn', name: 'Tran Thi Binh', role: 'LECTURER' };
const b1: BookingRecord = { id: 10, createdAt: '2026-11-01T09:00:00Z', lab: 'BE-201', userId: 1, range: [480, 600], seats: 30, status: 'CONFIRMED', note: null };
const b2: BookingRecord = { ...b1, id: 11, lab: 'AL-301', userId: 2, seats: 25, status: 'PENDING', note: 'AI demo' };
const b3: BookingRecord = { ...b1, id: 12, seats: 5, status: 'CANCELLED' };

test('LAB_INFO has the three labs', () => assert.deepEqual(Object.keys(LAB_INFO), ['BE-201', 'BE-202', 'AL-301']));
test('labName', () => assert.equal(labName('AL-301'), 'AI Lab'));
test('freeSeats never goes below 0', () => {
  assert.equal(freeSeats(LAB_INFO['BE-201'], 30), 10);
  assert.equal(freeSeats(LAB_INFO['AL-301'], 35), 0);
});
test('equipment: BE-202 has not been recorded yet', () => assert.equal(LAB_INFO['BE-202'].equipment, undefined));
test('seatsByLab lists EVERY lab, even with 0', () => assert.deepEqual(seatsByLab([b1, b2]), { 'BE-201': 30, 'BE-202': 0, 'AL-301': 25 }));
test('seatsByLab ignores cancelled bookings', () => assert.deepEqual(seatsByLab([b1, b3]), { 'BE-201': 30, 'BE-202': 0, 'AL-301': 0 }));
test('indexById finds by id, misses with undefined', () => {
  const byId = indexById([an, binh]);
  assert.equal(byId[2]?.name, 'Tran Thi Binh');
  assert.equal(byId[99], undefined);
});
test('withStatus returns a NEW record and leaves the list alone', () => {
  const list = [b2];
  const approved = withStatus(b2, 'CONFIRMED');
  assert.equal(approved.status, 'CONFIRMED');
  assert.equal(list[0]?.status, 'PENDING');
});
test('toView adds the two names', () => {
  const v = toView(b2, indexById([an, binh]));
  assert.deepEqual([v.labName, v.userName, v.seats], ['AI Lab', 'Tran Thi Binh', 25]);
});
test('toView survives a deleted user', () => assert.equal(toView(b1, indexById([binh])).userName, '(deleted user)'));
