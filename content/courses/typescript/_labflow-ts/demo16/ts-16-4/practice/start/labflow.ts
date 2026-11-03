type Result<T> = { ok: true; data: T } | { ok: false; error: string };
export function dataOr<T>(r: Result<T>, fallback: T): T {
  // Narrow on ok before reading data.
  return r.data;
}
