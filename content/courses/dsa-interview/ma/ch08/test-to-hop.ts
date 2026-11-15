// SWT301 in real life: "test every combination" of a login form is a cartesian product — Letter Combinations again.
// Backtracking lists them all; then we count how many PAIRS of values a test suite must cover (pairwise testing).

// #region cartesian
type Param = { name: string; values: string[] };
function allCombinations(params: Param[]): string[][] {
  const res: string[][] = [];
  const path: string[] = [];
  function bt(i: number): void {
    if (i === params.length) { res.push([...path]); return; }
    for (const v of params[i].values) {   // level i = parameter i, its choices = its values
      path.push(v);
      bt(i + 1);
      path.pop();
    }
  }
  bt(0);
  return res;
}
// #endregion

const params: Param[] = [
  { name: 'browser', values: ['Chrome', 'Safari', 'Firefox'] },
  { name: 'os', values: ['Windows', 'macOS', 'Android'] },
  { name: 'role', values: ['Student', 'Teacher', 'Admin'] },
  { name: 'lang', values: ['vi', 'en'] },
];
const all = allCombinations(params);
console.log('exhaustive test cases: ' + all.length + ' (3 * 3 * 3 * 2)');
for (const r of all.slice(0, 4)) console.log('  ' + r.join(' | '));
console.log('  ...');
let pairs = 0;
for (let a = 0; a < params.length; a++)
  for (let b = a + 1; b < params.length; b++) pairs += params[a].values.length * params[b].values.length;
console.log('value pairs a pairwise suite must cover: ' + pairs + ' (each test case covers 6 of them)');
console.log('lower bound for pairwise: at least ' + 3 * 3 + ' cases (browser x os alone has 9 pairs)');
// Grow it: 10 on/off switches = 2^10 cases for "all combinations".
const switches: Param[] = Array.from({ length: 10 }, (_, i) => ({ name: 's' + i, values: ['on', 'off'] }));
console.log('10 on/off switches, exhaustive: ' + allCombinations(switches).length + ' cases');
