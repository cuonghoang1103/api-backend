export class BookingService {
  #count = 0;
  book(): number { this.#count += 1; return this.#count; }
}
const svc = new BookingService();
// #count is private to the class — it cannot be read from outside.
export const n = svc.#count;
