// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { freeSlots } from '../web/next/lib/slots.js';
import { GET } from '../web/next/app/api/slots/route.js';

describe('practice 6.4', () => {
  it('an empty day has 28 free slots, 07:00 … 20:30', () => {
    const free = freeSlots([]);
    expect(free).toHaveLength(28);
    expect([free[0], free.at(-1)]).toEqual(['07:00', '20:30']);
  });

  it('touching slots stay free around 08:00–10:00', () => {
    const free = freeSlots([{ start: '08:00', end: '10:00' }]);
    expect(free).toContain('07:30');
    expect(free).toContain('10:00');
    expect(free).not.toContain('08:00');
    expect(free).not.toContain('09:30');
  });

  it('the route answers 400 without a lab', async () => {
    const res = await GET(new Request('http://localhost/api/slots?date=2026-11-16'));
    expect(res.status).toBe(400);
  });
});
