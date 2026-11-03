// LabFlow — a repository and a Result (a teammate's first version). It compiles. Is it right?
// The teammate reached for `any` to "make it work for every type".

export type Result = { ok: boolean; value?: any; error?: string };

export function ok(value: any): Result {
  return { ok: true, value };
}
export function err(error: string): Result {
  return { ok: false, error };
}
export function mapResult(r: Result, f: (value: any) => any): Result {
  return r.ok ? { ok: true, value: f(r.value) } : r;
}
export function unwrapOr(r: Result, fallback: any): any {
  return r.ok ? r.value : fallback;
}

export class Repo {
  private items = new Map<number, any>();

  add(item: any): Result {
    if (this.items.has(item.id)) return err('duplicate id ' + item.id);
    this.items.set(item.id, item);
    return ok(item);
  }
  get(id: number): Result {
    const found = this.items.get(id);
    return found === undefined ? err('not found: ' + id) : ok(found);
  }
  all(): any[] {
    return [...this.items.values()];
  }
  remove(id: number): Result {
    return this.items.delete(id) ? ok(id) : err('not found: ' + id);
  }
  get size(): number {
    return this.items.size;
  }
}

export function pluck(items: any[], key: string): any[] {
  return items.map((item) => item[key]);
}

export function groupBy(items: any[], keyFn: (item: any) => any): Map<any, any[]> {
  const groups = new Map<any, any[]>();
  for (const item of items) {
    const key = keyFn(item);
    const list = groups.get(key);
    if (list === undefined) groups.set(key, [item]);
    else list.push(item);
  }
  return groups;
}
