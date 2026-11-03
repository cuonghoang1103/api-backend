type Booking = { id: number; lab: string; seats: number; purpose: string };

// Partial<T> makes every field optional — the shape of a PATCH body.
function applyPatch(b: Booking, patch: Partial<Booking>): Booking {
  return { ...b, ...patch };
}

const base: Booking = { id: 1, lab: 'BE-201', seats: 40, purpose: 'Lab' };
console.log(applyPatch(base, { seats: 30 }));          // only one field changes
console.log(applyPatch(base, { lab: 'AL-301', seats: 24 }));
