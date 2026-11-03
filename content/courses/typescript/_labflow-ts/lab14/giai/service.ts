export type Booking = { id: number; lab: string };

export abstract class BookingRepo {
  abstract find(id: number): Booking | undefined;
  abstract save(b: Booking): void;
}

export class BookingService {
  #repo: BookingRepo;
  constructor(repo: BookingRepo) { this.#repo = repo; }
  book(id: number, lab: string): Booking {
    const b: Booking = { id, lab };
    this.#repo.save(b);
    return b;
  }
  find(id: number): Booking | undefined { return this.#repo.find(id); }
}
