// TODO: type Booking, make BookingRepo abstract, and hide the repo with #private.
export type Booking = any;

export class BookingRepo {
  find(id: any): any { return undefined; }
  save(b: any): void {}
}

export class BookingService {
  repo: any;
  constructor(repo: any) { this.repo = repo; }
  book(id: any, lab: any): any { const b = { id, lab }; this.repo.save(b); return b; }
  find(id: any): any { return this.repo.find(id); }
}
