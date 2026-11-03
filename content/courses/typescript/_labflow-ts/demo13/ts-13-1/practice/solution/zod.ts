// A tiny typed model of Zod's core (the shapes zod gives you).
export type ZodIssue = { path: string[]; message: string };
export type ZodError = { issues: ZodIssue[] };
export type SafeResult<T> = { success: true; data: T } | { success: false; error: ZodError };
export interface Schema<T> {
  parse(input: unknown): T;
  safeParse(input: unknown): SafeResult<T>;
}
export type Infer<S> = S extends Schema<infer T> ? T : never;

function make<T>(check: (input: unknown) => T): Schema<T> {
  return {
    parse(input) { return check(input); },
    safeParse(input) {
      try { return { success: true, data: check(input) }; }
      catch (e) { return { success: false, error: { issues: [{ path: [], message: (e as Error).message }] } }; }
    },
  };
}
export function string(): Schema<string> {
  return make((i) => { if (typeof i !== 'string') throw new Error('expected string'); return i; });
}
export function number(): Schema<number> {
  return make((i) => { if (typeof i !== 'number') throw new Error('expected number'); return i; });
}
type Shape = Record<string, Schema<unknown>>;
type Output<T extends Shape> = { [K in keyof T]: Infer<T[K]> };
export function object<T extends Shape>(shape: T): Schema<Output<T>> {
  return make((i) => {
    if (typeof i !== 'object' || i === null) throw new Error('expected object');
    const row = i as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [key, schema] of Object.entries(shape)) out[key] = schema.parse(row[key]);
    return out as Output<T>;
  });
}
