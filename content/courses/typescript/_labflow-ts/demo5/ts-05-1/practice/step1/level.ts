export type Reading = number | string;

export function tempLabel(r: Reading): string {
  if (typeof r === 'number') return r.toFixed(1) + '°C';
  return r; // r: string here
}

console.log(tempLabel(21.5));
console.log(tempLabel('offline'));
