export function firstName(names: string[]): string {
  const first = names[0];
  return (first ?? 'none').toUpperCase();
}
console.log(firstName(['an', 'binh']), firstName([]));
