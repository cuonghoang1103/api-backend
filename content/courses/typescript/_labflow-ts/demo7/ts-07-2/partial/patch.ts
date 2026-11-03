type Booking = { id: number; lab: string; seats: number; status: string };

// Add ? to every field: a PATCH body may carry any subset.
type Patch<T> = { [K in keyof T]?: T[K] };

function applyPatch(b: Booking, patch: Patch<Booking>): Booking {
  return { ...b, ...patch };
}

const b: Booking = { id: 1, lab: 'BE-201', seats: 40, status: 'PENDING' };
console.log(applyPatch(b, { seats: 30 }));          // only one field
console.log(applyPatch(b, { status: 'CONFIRMED' }));
