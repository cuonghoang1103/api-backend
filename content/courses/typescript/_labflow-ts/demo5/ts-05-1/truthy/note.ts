// A note is text that may be absent (NULL in the database, 2.1).
export function preview(note: string | null): string {
  if (note) return note.slice(0, 20); // narrowed to string — null removed
  return '(no note)';
}

// A trap: truthiness also removes 0 and '' — not just null/undefined.
export function seatsLabel(seats: number | undefined): string {
  if (seats) return seats + ' seats';  // 0 falls through here!
  return 'seats unknown';
}

console.log(preview('Weekly backend sync'));
console.log(preview(null));
console.log(seatsLabel(30));
console.log(seatsLabel(0));   // a real 0-seat room, mislabelled
console.log(seatsLabel(undefined));
