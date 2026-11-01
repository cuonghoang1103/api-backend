// US-11 "My bookings" over HTTP (Chapter 11): status codes, privacy, and every response checked against openapi.json.
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApi, body } from '../../test/support/api.js';
import { contractErrors } from '../../test/support/contract.js';

const at = (clock) => new Date('2026-11-16T' + clock + ':00+07:00');

// A fresh API whose clock reads `clock` (Viet Nam time on 16/11/2026); an has one booking, 08:00–10:00 BE-201.
async function setup(clock = '06:00') {
  const api = makeApi({ now: () => at(clock) });
  const an = await api.bearer('an');
  const created = await request(api.app).post('/api/bookings').set('Authorization', an).send(body());
  return { api, an, id: created.body.id };
}
const cancel = (api, id, auth) => request(api.app).post('/api/bookings/' + id + '/cancel').set('Authorization', auth);

describe('GET /api/bookings (US-11)', () => {
  it('200: only my bookings, cancelled ones too, as in the contract (AC1)', async () => {
    const { api, an, id } = await setup();
    await request(api.app).post('/api/bookings').set('Authorization', await api.bearer('binh')).send(body({ lab: 'BE-305' }));
    await cancel(api, id, an);
    const res = await request(api.app).get('/api/bookings').set('Authorization', an);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id, lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20, status: 'CANCELLED', minutes: 120 }]);
    expect(contractErrors('get', '/api/bookings', res)).toEqual([]);
  });

  it('401 without a token', async () => {
    const res = await request(makeApi().app).get('/api/bookings');
    expect(res.status).toBe(401);
    expect(contractErrors('get', '/api/bookings', res)).toEqual([]);
  });
});

describe('POST /api/bookings/:id/cancel (US-11)', () => {
  it('200 with the booking, now CANCELLED (AC2)', async () => {
    const { api, an, id } = await setup();
    const res = await cancel(api, id, an);
    expect([res.status, res.body.status]).toEqual([200, 'CANCELLED']);
    expect(contractErrors('post', '/api/bookings/{id}/cancel', res)).toEqual([]);
  });

  it.each([
    ['07:00 (60 minutes before)', 200, 'CANCELLED', '07:00'],
    ['07:01 (59 minutes before)', 422, 'TOO_LATE_TO_CANCEL', '07:01'],
  ])('Lite-3: at %s → %i %s (AC2)', async (_, status, code, clock) => {
    const { api, an, id } = await setup(clock);
    const res = await cancel(api, id, an);
    expect([res.status, res.body.status ?? res.body.error.code]).toEqual([status, code]);
    expect(contractErrors('post', '/api/bookings/{id}/cancel', res)).toEqual([]);
  });

  it.each([
    { who: 'binh', role: 'STUDENT', status: 404, ac: 'AC3' },
    { who: 'thay', role: 'LECTURER', status: 404, ac: 'AC3' },
    { who: 'boss', role: 'ADMIN', status: 200, ac: 'AC6' },
  ])('$who ($role) cancelling an’s booking → $status ($ac)', async ({ who, role, status }) => {
    const { api, id } = await setup();
    const res = await cancel(api, id, await api.bearer(who, role));
    expect(res.status).toBe(status);
    expect(contractErrors('post', '/api/bookings/{id}/cancel', res)).toEqual([]);
  });

  it('an admin may cancel inside the last hour (AC6)', async () => {
    const { api, id } = await setup('07:30');
    expect((await cancel(api, id, await api.bearer('boss', 'ADMIN'))).status).toBe(200);
  });

  it('409 ALREADY_CANCELLED the second time (AC4)', async () => {
    const { api, an, id } = await setup();
    await cancel(api, id, an);
    const res = await cancel(api, id, an);
    expect([res.status, res.body.error.code]).toEqual([409, 'ALREADY_CANCELLED']);
    expect(contractErrors('post', '/api/bookings/{id}/cancel', res)).toEqual([]);
  });

  it.each(['999', 'abc', '0', '-1', '1.5', '2147483648'])('id %s → 404, never 500', async (raw) => {
    const { api, an } = await setup();
    const res = await cancel(api, raw, an);
    expect([res.status, res.body.error.code]).toEqual([404, 'NOT_FOUND']);
  });

  it('401 without a token, and the booking is untouched', async () => {
    const { api, an, id } = await setup();
    const res = await request(api.app).post('/api/bookings/' + id + '/cancel');
    expect(res.status).toBe(401);
    expect((await request(api.app).get('/api/bookings/' + id).set('Authorization', an)).body.status).toBe('CONFIRMED');
  });

  it('after cancelling, the same slot can be booked again: 201 (AC5)', async () => {
    const { api, an, id } = await setup();
    await cancel(api, id, an);
    const again = await request(api.app).post('/api/bookings').set('Authorization', await api.bearer('binh')).send(body());
    expect(again.status).toBe(201);
  });
});
