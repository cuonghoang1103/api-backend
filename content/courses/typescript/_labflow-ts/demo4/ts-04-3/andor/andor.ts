type HasLab = { lab: string };
type HasSeats = { seats: number };

// & : must have BOTH  → more properties, fewer values
// | : must have ONE   → fewer guarantees, more values (Chapter 5)
const both: HasLab & HasSeats = { lab: 'BE-201' };
const either: HasLab | HasSeats = { lab: 'BE-201' };
export { both, either };
