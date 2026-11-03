type Booking = { id: number; lab: string; seats: number };

// Utility types compose: a read-only patch of a booking.
type FrozenPatch = Readonly<Partial<Booking>>;
const change: FrozenPatch = { seats: 30 };
console.log(change.seats);
// change.seats = 24  // would be TS2540 — Readonly wraps the Partial
