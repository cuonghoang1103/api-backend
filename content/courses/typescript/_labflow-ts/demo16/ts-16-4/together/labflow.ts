// Every habit of the course, in one slice.
type LabCode = string & { readonly __brand: 'LabCode' };          // 16.1 branded
const labCode = (s: string): LabCode => s as LabCode;
type Booking = { readonly id: number; readonly lab: LabCode; readonly seats: number }; // 4 readonly
type Result<T> = { ok: true; data: T } | { ok: false; error: string };  // 5/6 discriminated + generic
function create(lab: LabCode, seats: number): Result<Booking> {
  if (seats <= 0) return { ok: false, error: 'seats must be positive' };
  return { ok: true, data: { id: 1, lab, seats } };
}
const r = create(labCode('BE-201'), 40);
console.log(r.ok ? r.data.lab : r.error);
