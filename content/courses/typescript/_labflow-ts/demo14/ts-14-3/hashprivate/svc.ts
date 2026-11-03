// #private is enforced by the language at run time, not just by types.
export class BookingService {
  #count = 0;
  static readonly MAX = 100;
  book(): number { this.#count += 1; return this.#count; }
  get booked(): number { return this.#count; }
}
const svc = new BookingService();
svc.book(); svc.book();
console.log(svc.booked, 'of', BookingService.MAX);
