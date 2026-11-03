// Attempt A — generic at last, but no constraint (so id needs a cast) and get returns T | undefined.
export type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };
export function ok<T>(value: T): Result<T, never> { return { ok: true, value }; }
export function err<E>(error: E): Result<never, E> { return { ok: false, error }; }
export function mapResult<T, U, E>(r: Result<T, E>, f: (value: T) => U): Result<U, E> {
  return r.ok ? { ok: true, value: f(r.value) } : r;
}
export function unwrapOr<T, E>(r: Result<T, E>, fallback: T): T {
  return r.ok ? r.value : fallback;
}

// No constraint on T, so item.id is not known — reached for a cast to read it.
export class Repo<T> {
  private items = new Map<number, T>();
  add(item: T): Result<T> {
    const id = (item as { id: number }).id;
    if (this.items.has(id)) return err('duplicate id ' + id);
    this.items.set(id, item);
    return ok(item);
  }
  get(id: number): T | undefined {       // returns the item, not a Result
    return this.items.get(id);
  }
  all(): T[] { return [...this.items.values()]; }
  remove(id: number): boolean { return this.items.delete(id); }
  get size(): number { return this.items.size; }
}

export function pluck<T, K extends keyof T>(items: readonly T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}
export function groupBy<T, K>(items: readonly T[], keyFn: (item: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const list = groups.get(key);
    if (list === undefined) groups.set(key, [item]); else list.push(item);
  }
  return groups;
}
