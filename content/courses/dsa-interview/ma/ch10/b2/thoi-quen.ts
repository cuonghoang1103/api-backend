// TypeScript/JavaScript habits that cost points in a live interview — each one RUN, not just described.

// #region eq
console.log('1) == coerces types:', 0 == ('' as any), '0' == (0 as any), null == undefined, '|| === does not:', 0 === ('' as any));
// #endregion

// #region var
const withVar: (() => number)[] = [];
for (var i = 0; i < 3; i++) withVar.push(() => i);
const withLet: (() => number)[] = [];
for (let j = 0; j < 3; j++) withLet.push(() => j);
console.log('2) closures over var:', withVar.map((g) => g()), '| over let:', withLet.map((g) => g()));
// #endregion

// #region any
const fromInput: any = JSON.parse('{"qty": "5"}');   // the API sent a string
const total = fromInput.qty + 1;                       // any: no complaint, string concatenation
console.log('3) any lets "5" + 1 through:', JSON.stringify(total));
// #endregion

// #region sort
console.log('4) sort() without comparator:', JSON.stringify([10, 9, 1, 100].sort()), '| with (a, b) => a - b:', JSON.stringify([10, 9, 1, 100].sort((a, b) => a - b)));
// #endregion

// #region mutate
function medianBad(nums: number[]): number {
  nums.sort((a, b) => a - b);                          // sorts the CALLER'S array in place
  return nums[Math.floor(nums.length / 2)];
}
function median(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);      // work on a copy
  return sorted[Math.floor(sorted.length / 2)];
}
const scores = [7, 2, 9, 4, 5];
const m1 = medianBad(scores);
console.log('5) medianBad =', m1, '— caller array is now', JSON.stringify(scores));
const scores2 = [7, 2, 9, 4, 5];
const m2 = median(scores2);
console.log('   median    =', m2, '— caller array stays', JSON.stringify(scores2));
// #endregion

// #region spread
const big = Array.from({ length: 1_000_000 }, (_, k) => k);
try {
  console.log('6) Math.max(...big) =', Math.max(...big));
} catch (e) {
  console.log('6) Math.max(...big) threw', (e as Error).name + ':', (e as Error).message);
}
let best = -Infinity;
for (const x of big) if (x > best) best = x;
console.log('   a plain loop gives', best, '| and Math.max() of nothing is', Math.max());
// #endregion

// #region precision
console.log('7) 2^53 + 1 =', 2 ** 53 + 1, '| 0.1 + 0.2 =', 0.1 + 0.2, '| BigInt:', String(2n ** 53n + 1n));
// #endregion
