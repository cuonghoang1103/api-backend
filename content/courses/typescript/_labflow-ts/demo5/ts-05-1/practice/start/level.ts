// A sensor reading from the lab: either a number (°C) or the string 'offline'.
export type Reading = number | string;

// Bug: tsc refuses this, and even if it compiled the 'offline' case would be wrong.
export function tempLabel(r: Reading): string {
  return r.toFixed(1) + '°C';
}

console.log(tempLabel(21.5));
console.log(tempLabel('offline'));
