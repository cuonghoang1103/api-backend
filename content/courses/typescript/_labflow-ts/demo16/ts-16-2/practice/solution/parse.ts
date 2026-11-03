export function first(raw: unknown): string {
  if (typeof raw === 'string') return raw[0] ?? '';
  return '';
}
console.log(first('BE-201'));
