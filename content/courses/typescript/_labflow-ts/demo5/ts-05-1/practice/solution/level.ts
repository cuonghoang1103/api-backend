export type Reading = number | string;

// Narrow by type, keep the two answers apart.
export function tempLabel(r: Reading): string {
  if (typeof r === 'number') return r.toFixed(1) + '°C';
  return 'sensor ' + r; // r is string
}

console.log(tempLabel(21.5));
console.log(tempLabel('offline'));
