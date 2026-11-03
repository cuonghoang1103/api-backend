export class BookingService {
  readonly lab: string;
  constructor(lab: string) { this.lab = lab; }
}
const svc = new BookingService('BE-201');
// lab is readonly — reassigning it is refused.
svc.lab = 'CS-101';
export { svc };
