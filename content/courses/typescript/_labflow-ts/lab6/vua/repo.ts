// Attempt B — generic and constrained, but pluck's key is a loose string and groupBy keys by string.
export type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };
export function ok<T>(value: T): Result<T, never> { return { ok: true, value }; }
export function err<E>(error: E): Result<never, E> { return { ok: false, error }; }
export function mapResult<T, U, E>(r: Result<T, E>, f: (value: T) => U): Result<U, E> {
  return r.ok ? { ok: true, value: f(r.value) } : r;
}
export function unwrapOr<T, E>(r: Result<T, E>, fallback: T): T {
  return r.ok ? r.value : fallback;
}

export class Repo<T extends { id: number }> {
  private items = new Map<number, T>();
  add(item: T): Result<T> {
    if (this.items.has(item.id)) return err('duplicate id ' + item.id);
    this.items.set(item.id, item);
    return ok(item);
  }
  get(id: number): Result<T> {
    const found = this.items.get(id);
    return found === undefined ? err('not found: ' + id) : ok(found);
  }
  all(): T[] { return [...this.items.values()]; }
  remove(id: number): Result<number> { return this.items.delete(id) ? ok(id) : err('not found: ' + id); }
  get size(): number { return this.items.size; }
}

// Loose: key is a string, so a typo is not caught and the return type is unknown.
export function pluck<T>(items: readonly T[], key: string): unknown[] {
  return items.map((item) => (item as Record<string, unknown>)[key]);
}
export function groupBy<T>(items: readonly T[], keyFn: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const list = groups.get(key);
    if (list === undefined) groups.set(key, [item]); else list.push(item);
  }
  return groups;
}
