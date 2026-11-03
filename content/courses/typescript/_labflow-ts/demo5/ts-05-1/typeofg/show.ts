export type Id = string | number;

// Inside each branch, tsc KNOWS the narrower type: string here, number there.
export function badge(id: Id): string {
  if (typeof id === 'string') return 'LAB-' + id.padStart(4, '0'); // id: string
  return 'LAB-' + String(id).padStart(4, '0');                      // id: number
}

console.log(badge('42'));
console.log(badge(42));
