function createBooking(lab: string, seats: number): string {
  return lab + ':' + seats;
}

// Parameters reads the argument list as a tuple — a wrapper stays in step with the function.
type Args = Parameters<typeof createBooking>;
const call: Args = ['BE-201', 40];
console.log(createBooking(...call));
