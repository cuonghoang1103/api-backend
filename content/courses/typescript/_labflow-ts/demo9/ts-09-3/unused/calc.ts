// noUnusedLocals: a declared-but-never-used local is an error.
export function total(xs: number[]): number {
  const count = xs.length;
  return xs.reduce((a, b) => a + b, 0);
}
