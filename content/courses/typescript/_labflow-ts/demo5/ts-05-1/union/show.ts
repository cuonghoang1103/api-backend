// A union: "one of these types". A value of type Id is a string OR a number — nothing else.
export type Id = string | number;

export function badge(id: Id): string {
  // Only what BOTH members allow is available without narrowing.
  return 'LAB-' + id.padStart(4, '0');
}
