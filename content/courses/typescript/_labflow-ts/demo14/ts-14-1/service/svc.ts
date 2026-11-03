// A class groups data and the operations on it; private hides internals.
export class BookingService {
  private count = 0;
  readonly lab: string;
  constructor(lab: string) { this.lab = lab; }
  book(): number { this.count += 1; return this.count; }
}
const svc = new BookingService('BE-201');
console.log(svc.lab, svc.book(), svc.book());
