// A discriminated union: a slot is free OR booked-by-someone, never both or neither.
type Slot = { kind: 'free' } | { kind: 'booked'; by: string };
export function who(s: Slot): string {
  // Reading 'by' without narrowing: a free slot has no 'by'.
  return s.by;
}
