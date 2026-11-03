// LabFlow — a generic Result and an in-memory repository (Chapter 6, = Lab 6 reference solution).

// A Result is "a value OR an error", generic over both — the generic form of SlotResult (Chapter 5).
// E defaults to string, so Result<number> is Result<number, string>.
export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// ok/err build a Result while keeping the exact type. `never` on the other side means "this case never happens here".
export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}
export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// map transforms the value and keeps the error; the result type follows the function's return type U.
export function mapResult<T, U, E>(r: Result<T, E>, f: (value: T) => U): Result<U, E> {
  return r.ok ? { ok: true, value: f(r.value) } : r;
}

// unwrapOr returns the value, or the fallback of the SAME type when the result is an error.
export function unwrapOr<T, E>(r: Result<T, E>, fallback: T): T {
  return r.ok ? r.value : fallback;
}

// An in-memory repository over anything with a numeric id. The constraint T extends { id: number }
// is what lets add/get use item.id without tsc complaining.
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

  all(): T[] {
    return [...this.items.values()];
  }

  remove(id: number): Result<number> {
    return this.items.delete(id) ? ok(id) : err('not found: ' + id);
  }

  get size(): number {
    return this.items.size;
  }
}

// pluck keeps the value type: for a key K of T, the result is an array of T[K] (indexed access).
export function pluck<T, K extends keyof T>(items: readonly T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

// groupBy keeps the item type and keys by a function. K is whatever the key function returns.
export function groupBy<T, K>(items: readonly T[], keyFn: (item: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const list = groups.get(key);
    if (list === undefined) groups.set(key, [item]);
    else list.push(item);
  }
  return groups;
}
