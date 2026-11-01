// Two loaders. Hover them — or ask tsc to print their declarations.
export function loadBookings(text: string) {
  return JSON.parse(text);               // returns any, so the function does too
}

export function loadBookingsSafe(text: string): unknown {
  return JSON.parse(text);               // callers must check before use
}

const rows = loadBookings('[{"minutes":60}]');
export const total = rows.reduce((sum: number, r: { minutes: number }) => sum + r.minutes, 0);
export const first = rows[0].minute;     // typo, not caught: rows is any
