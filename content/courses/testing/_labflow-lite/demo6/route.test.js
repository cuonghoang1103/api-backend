// @vitest-environment node
import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';
import { GET } from '../web/next/app/api/slots/route.js';

const API = 'http://labflow-api.test';
const ALL = [
  { id: 1, lab: 'BE-201', date: '2026-11-16', start: '07:00', end: '09:00', seats: 20, status: 'CONFIRMED', minutes: 120 },
  { id: 2, lab: 'BE-201', date: '2026-11-16', start: '10:00', end: '20:30', seats: 20, status: 'CONFIRMED', minutes: 630 },
  { id: 3, lab: 'BE-305', date: '2026-11-16', start: '09:00', end: '10:00', seats: 20, status: 'CONFIRMED', minutes: 60 },
];
const server = setupServer(http.get(API + '/api/admin/bookings', () => HttpResponse.json(ALL)));
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('route handler: a function from Request to Response', () => {
  it('free slots of BE-201 on one day', async () => {
    vi.stubEnv('LABFLOW_API_URL', API);
    const res = await GET(new Request('http://localhost/api/slots?lab=BE-201&date=2026-11-16'));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ lab: 'BE-201', date: '2026-11-16', free: ['09:00', '09:30', '20:30'] });
  });

  it('400 without a date', async () => {
    const res = await GET(new Request('http://localhost/api/slots?lab=BE-201'));
    expect(res.status).toBe(400);
  });

  it('502 when the LabFlow API is down', async () => {
    vi.stubEnv('LABFLOW_API_URL', API);
    server.use(http.get(API + '/api/admin/bookings', () => HttpResponse.json({ error: { code: 'INTERNAL' } }, { status: 500 })));
    const res = await GET(new Request('http://localhost/api/slots?lab=BE-201&date=2026-11-16'));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: { code: 'UPSTREAM_DOWN' } });
  });
});
