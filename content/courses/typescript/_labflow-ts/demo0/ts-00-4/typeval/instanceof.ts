type Booking = { lab: string; seats: number };

function describe(x: unknown): string {
  if (x instanceof Booking) {
    return 'a booking for ' + x.lab;
  }
  return 'something else';
}

console.log(describe({ lab: 'BE-201', seats: 12 }));
