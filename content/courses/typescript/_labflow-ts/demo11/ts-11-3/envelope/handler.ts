import type { ApiResult } from './api.ts';
type Booking = { id: string; seats: number };

export function findBooking(id: string): ApiResult<Booking> {
  if (id === 'bk_1') return { ok: true, data: { id, seats: 40 } };
  return { ok: false, error: { code: 'NOT_FOUND', message: 'No such booking' } };
}

const r = findBooking('bk_1');
// The discriminant narrows the union — data is only reachable on the ok branch.
if (r.ok) console.log(r.data.seats);
else console.log(r.error.code);
