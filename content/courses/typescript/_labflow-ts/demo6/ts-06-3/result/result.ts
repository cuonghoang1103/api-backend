// A generic type alias. E defaults to string, so Result<number> means Result<number, string>.
export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function parseSeats(text: string): Result<number> {
  const n = Number(text);
  return Number.isInteger(n) && n > 0 ? ok(n) : { ok: false, error: 'bad seats: ' + text };
}

const a = parseSeats('30');
console.log(a.ok ? 'seats ' + a.value : a.error);
const b = parseSeats('x');
console.log(b.ok ? 'seats ' + b.value : b.error);
