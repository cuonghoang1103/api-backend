// PREVIEW of Chapter 16 (branded types) — do not worry about the syntax yet.
// Two numbers that mean different units get different types.
type NewtonSeconds = number & { readonly unit: 'N·s' };
type PoundForceSeconds = number & { readonly unit: 'lbf·s' };

const lbf = (n: number) => n as PoundForceSeconds;
const toNewtonSeconds = (x: PoundForceSeconds) => (x * 4.45) as NewtonSeconds;

// The navigation software expects newton-seconds, as the interface specification said.
function correctTrajectory(impulse: NewtonSeconds): string {
  return 'correction applied: ' + impulse.toFixed(2) + ' N·s';
}

const fromGroundSoftware = lbf(10);            // the other team's program reports pound-force seconds
console.log(correctTrajectory(fromGroundSoftware));   // the 1999 mistake — refused by tsc
console.log(correctTrajectory(toNewtonSeconds(fromGroundSoftware)));
