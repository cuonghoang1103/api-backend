import type { ApiResult } from './api.ts';
type Booking = { id: string; seats: number };
export function read(r: ApiResult<Booking>): number {
  // Reading data without checking ok — it does not exist on the error branch.
  return r.data.seats;
}
