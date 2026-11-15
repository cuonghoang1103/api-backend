// @thoi-gian
// The attacker's view: brute force IS backtracking with no pruning — every leaf of the tree is one guess.
// How long does it take to walk the whole space when the check is a free, local comparison?
function crack(alphabet: string, len: number, isRight: (s: string) => boolean): [string | null, number] {
  const path: string[] = [];
  let guesses = 0;
  let found: string | null = null;
  function bt(): boolean {
    if (path.length === len) {
      guesses++;
      const s = path.join('');
      if (isRight(s)) { found = s; return true; }
      return false;
    }
    for (const ch of alphabet) {
      path.push(ch);
      if (bt()) return true;                 // stop at the first hit
      path.pop();
    }
    return false;
  }
  bt();
  return [found, guesses];
}
function timed(alphabet: string, len: number, secret: string): void {
  let best = Infinity, res: [string | null, number] = [null, 0];
  for (let k = 0; k < 3; k++) {
    const t = performance.now();
    res = crack(alphabet, len, (s) => s === secret);
    best = Math.min(best, performance.now() - t);
  }
  const space = alphabet.length ** len;
  console.log(`space ${alphabet.length}^${len} = ${space.toLocaleString('en-US').padStart(13)} | found "${res[0]}" after ${res[1].toLocaleString('en-US')} guesses | ${best.toFixed(1)} ms | ${Math.round(res[1] / best * 1000).toLocaleString('en-US')} guesses/s`);
}
timed('0123456789', 6, '999999');               // a 6-digit OTP, worst case = the last leaf
timed('abcdefghijklmnopqrstuvwxyz', 5, 'zzzzz');  // 5 lowercase letters, worst case
const rate = 1e7;                                  // round number near what the line above prints
console.log(`26^8 = ${(26 ** 8).toLocaleString('en-US')} → at 10^7 guesses/s ≈ ${(26 ** 8 / rate / 3600).toFixed(1)} hours`);
console.log(`26^12 = ${(26 ** 12).toExponential(2)} → at 10^7 guesses/s ≈ ${(26 ** 12 / rate / 3600 / 24 / 365).toFixed(0)} years`);
console.log(`10^6 OTP online, 10 requests/min/IP → ${(1e6 / 10 / 60 / 24).toFixed(0)} days for one IP to try them all`);
console.log(`node ${process.version} · ${process.arch}`);
