type Result<T> = { ok: true; data: T } | { ok: false; error: string };
function describe<T>(r: Result<T>): T {
  // Reading data without narrowing on ok — the error branch has none.
  return r.data;
}
export { describe };
