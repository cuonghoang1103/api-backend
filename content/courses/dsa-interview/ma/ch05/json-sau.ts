// A deeply nested JSON body: the built-in parser survives, a recursive walker does not.
// 1,000,000 levels of [ ] is a 2 MB body — well under express.json({ limit: '10mb' }).

const D = 1_000_000;
const body = '['.repeat(D) + ']'.repeat(D);
console.log(`body = ${body.length.toLocaleString('en-US')} bytes; '10mb' limit = ${(10 * 1024 * 1024).toLocaleString('en-US')} bytes`);
const value: unknown = JSON.parse(body);
console.log('JSON.parse(body): ok');

// #region de-quy
function depthRec(x: unknown): number {           // the "obvious" walker
  if (!Array.isArray(x)) return 0;
  let m = 0;
  for (const c of x) m = Math.max(m, depthRec(c));
  return 1 + m;
}
// #endregion

// #region lap
function depthIter(x: unknown): number {          // same answer with an explicit stack of [value, depth]
  let best = 0;
  const stack: [unknown, number][] = [[x, 1]];
  while (stack.length > 0) {
    const [v, d] = stack.pop()!;
    if (!Array.isArray(v)) continue;
    if (d > best) best = d;
    for (const c of v) stack.push([c, d + 1]);
  }
  return best;
}
// #endregion

// #region chan
function depthGuarded(x: unknown, limit: number, d = 1): number {   // recursive, but refuses to go past `limit`
  if (!Array.isArray(x)) return 0;
  if (d > limit) throw new Error(`nesting deeper than ${limit}`);
  let m = 0;
  for (const c of x) m = Math.max(m, depthGuarded(c, limit, d + 1));
  return 1 + m;
}
// #endregion

try { console.log('depthRec:', depthRec(value)); }
catch (e) { console.log(`depthRec: ${(e as Error).constructor.name}: ${(e as Error).message}`); }
console.log('depthIter:', depthIter(value).toLocaleString('en-US'));
try { console.log('depthGuarded:', depthGuarded(value, 1000)); }
catch (e) { console.log(`depthGuarded: rejected (${(e as Error).message}) — answer 400, not 500`); }
console.log('depthGuarded on a normal document [[1,[2]],[3]]:', depthGuarded([[1, [2]], [3]], 1000));
