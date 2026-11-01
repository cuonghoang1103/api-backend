type Booking = { lab: string; seats: number };

// A runtime check written in real JavaScript — this is what survives erasure.
function isBooking(x: unknown): x is Booking {
  return typeof x === 'object' && x !== null &&
    typeof (x as { lab?: unknown }).lab === 'string' &&
    typeof (x as { seats?: unknown }).seats === 'number';
}

function describe(x: unknown): string {
  if (isBooking(x)) return 'a booking for ' + x.lab;
  return 'something else';
}

console.log(describe({ lab: 'BE-201', seats: 12 }));
console.log(describe({ lab: 'BE-201', seats: '12' }));
