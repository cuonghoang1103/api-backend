import { BookingRepo, type Booking } from './service.ts';
export class MemoryRepo extends BookingRepo {
  #rows = new Map<number, Booking>();
  find(id: number): Booking | undefined { return this.#rows.get(id); }
  save(b: Booking): void { this.#rows.set(b.id, b); }
}
