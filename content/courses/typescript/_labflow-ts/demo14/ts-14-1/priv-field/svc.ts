export class BookingService {
  private count = 0;
  book(): number { this.count += 1; return this.count; }
}
const svc = new BookingService();
// count is private — reading it from outside is refused.
export const n = svc.count;
