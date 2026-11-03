type Booking = { id: number; lab: string; seats: number };

// Both modifiers at once: every field read-only and optional.
type ReadonlyPatch<T> = { readonly [K in keyof T]?: T[K] };

const rp: ReadonlyPatch<Booking> = { seats: 40 };
console.log(rp.seats);
// rp.seats = 30; // TS2540 — readonly
