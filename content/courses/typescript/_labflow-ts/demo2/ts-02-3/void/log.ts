// A function that only does something (prints) and gives nothing back.
export function logBooking(id: number): void {
  console.log('booking ' + id + ' saved');
}

const r1 = logBooking(1);              // r1: void
const r2: number = logBooking(2);      // using a void result as a number
const r3: undefined = logBooking(3);   // void is not the same as undefined

// A void function must not return a value…
export function saveNote(note: string): void {
  return note.length;
}

// …but a callback whose type says void MAY return one: the caller ignores it.
const ids = [1, 2, 3];
const seen: number[] = [];
ids.forEach((id) => seen.push(id));    // push returns a number — accepted

console.log(r1, r2, r3, seen);
