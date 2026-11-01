// Defaults: the caller may leave the argument out, and inside the function it is never undefined.
export function formatTime(minutes: number, separator = ':'): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return String(h).padStart(2, '0') + separator + String(m).padStart(2, '0');
}

// A default on a destructured property: seats is 1 when the request does not say.
export function seatsOf({ seats = 1 }: { lab: string; seats?: number }) {
  return seats;
}
