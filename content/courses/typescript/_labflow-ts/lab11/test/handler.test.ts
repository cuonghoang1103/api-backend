import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBooking } from '../handler.ts';
import { fakeReq, fakeRes } from '../run.ts';
test('valid body -> 201 ok with data', () => {
  const sink: { body?: any; code?: number } = {};
  createBooking(fakeReq({ body: { lab: 'BE-201', seats: 40, purpose: 'Lab' } }), fakeRes(sink));
  assert.equal(sink.code, 201);
  assert.equal(sink.body.ok, true);
  assert.equal(sink.body.data.lab, 'BE-201');
  assert.equal(sink.body.data.status, 'PENDING');
});
test('seats <= 0 -> 400 error', () => {
  const sink: { body?: any; code?: number } = {};
  createBooking(fakeReq({ body: { lab: 'BE-201', seats: 0, purpose: 'Lab' } }), fakeRes(sink));
  assert.equal(sink.code, 400);
  assert.equal(sink.body.ok, false);
  assert.equal(sink.body.error.code, 'INVALID_SEATS');
});
