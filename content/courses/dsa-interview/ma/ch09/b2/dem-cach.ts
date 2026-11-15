// @java: McDemCach.java
// LC 518 Coin Change II (combinations) vs LC 377 Combination Sum IV (ordered sequences):
// the SAME two loops, swapped.

// #region tohop
// coins OUTSIDE: every combination is built in coin order (1s, then 2s, then 5s), counted once.
function change(amount: number, coins: number[]): number {
  const ways = new Array<number>(amount + 1).fill(0);
  ways[0] = 1;                                   // one way to make 0: take nothing
  for (const c of coins)
    for (let a = c; a <= amount; a++) ways[a] += ways[a - c];
  return ways[amount];
}
// #endregion

// #region hoanvi
// amount OUTSIDE: at every amount any coin may come last, so 1+2+2 and 2+1+2 are different.
function combinationSum4(nums: number[], target: number): number {
  const ways = new Array<number>(target + 1).fill(0);
  ways[0] = 1;
  for (let a = 1; a <= target; a++)
    for (const c of nums) if (c <= a) ways[a] += ways[a - c];
  return ways[target];
}
// #endregion

// Brute force listing, to SEE what each number counts.
function listAll(amount: number, coins: number[], ordered: boolean): string[] {
  const out: string[] = [];
  const walk = (left: number, minIdx: number, path: number[]) => {
    if (left === 0) { out.push(path.join('+')); return; }
    for (let k = ordered ? 0 : minIdx; k < coins.length; k++) {
      if (coins[k] <= left) { path.push(coins[k]); walk(left - coins[k], k, path); path.pop(); }
    }
  };
  walk(amount, 0, []);
  return out;
}

const coins = [1, 2, 5];
console.log(`change(5, [1,2,5]) = ${change(5, coins)}           -> ${listAll(5, coins, false).join(' | ')}`);
console.log(`combinationSum4([1,2,5], 5) = ${combinationSum4(coins, 5)}  -> ${listAll(5, coins, true).join(' | ')}`);
console.log(`change(3, [2]) = ${change(3, [2])}   change(10, [10]) = ${change(10, [10])}   change(0, [7]) = ${change(0, [7])}`);
console.log(`combinationSum4([1,2,3], 4) = ${combinationSum4([1, 2, 3], 4)}   combinationSum4([9], 3) = ${combinationSum4([9], 3)}`);
