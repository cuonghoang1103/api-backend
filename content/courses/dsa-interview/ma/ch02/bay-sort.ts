// Trap: Array.prototype.sort() with NO comparator sorts numbers as STRINGS.
const a = [10, 9, 1, -4, -1, 2];
console.log('a.sort()              ->', JSON.stringify([...a].sort()));
console.log('a.sort((x, y) => x - y) ->', JSON.stringify([...a].sort((x, y) => x - y)));
// Two pointers on the wrongly sorted array silently misses a pair that exists:
function twoSumSorted(nums: number[], target: number): number[] {
  let l = 0, r = nums.length - 1;
  while (l < r) {
    const s = nums[l] + nums[r];
    if (s === target) return [nums[l], nums[r]];
    if (s < target) l++; else r--;
  }
  return [];
}
console.log('pair with sum -3, string-sorted  ->', JSON.stringify(twoSumSorted([...a].sort(), -3)));
console.log('pair with sum -3, numeric-sorted ->', JSON.stringify(twoSumSorted([...a].sort((x, y) => x - y), -3)));
