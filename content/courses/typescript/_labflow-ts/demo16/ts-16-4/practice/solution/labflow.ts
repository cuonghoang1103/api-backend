type Result<T> = { ok: true; data: T } | { ok: false; error: string };
export function dataOr<T>(r: Result<T>, fallback: T): T {
  return r.ok ? r.data : fallback;
}
console.log(dataOr({ ok: true, data: 42 }, 0));
