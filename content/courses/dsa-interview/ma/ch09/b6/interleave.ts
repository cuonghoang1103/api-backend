// @java: LuInterleave.java
// LC 97 Interleaving String — dp[i][j]: can the first i chars of s1 and first j chars of s2 build the first i+j chars of s3?

// #region giai
function isInterleave(s1: string, s2: string, s3: string): boolean {
  const n = s1.length, m = s2.length;
  if (n + m !== s3.length) return false;            // check lengths FIRST, or s3[i+j-1] reads past the end
  const dp: boolean[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(false));
  dp[0][0] = true;                                  // base: empty + empty builds empty
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= m; j++) {
      const k = i + j - 1;                          // the char of s3 we are trying to place
      if (i > 0 && dp[i - 1][j] && s1[i - 1] === s3[k]) dp[i][j] = true;  // last char came from s1
      if (j > 0 && dp[i][j - 1] && s2[j - 1] === s3[k]) dp[i][j] = true;  // last char came from s2
    }
  }
  return dp[n][m];
}
// #endregion

// Brute force: plain recursion, no memo (exponential, fine for tiny strings).
function brute(s1: string, s2: string, s3: string): boolean {
  if (!s1 && !s2) return !s3;
  if (s1 && s1[0] === s3[0] && brute(s1.slice(1), s2, s3.slice(1))) return true;
  return !!s2 && s2[0] === s3[0] && brute(s1, s2.slice(1), s3.slice(1));
}

for (const [a, b, c] of [['ab', 'cd', 'acbd'], ['ab', 'cd', 'adbc'], ['aab', 'ab', 'abaab'], ['', 'xy', 'xy'], ['a', 'b', 'abc']]) {
  console.log(`isInterleave("${a}", "${b}", "${c}") = ${isInterleave(a, b, c)}`);
}
let seed = 20261115;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; };
const word = (n: number) => Array.from({ length: n }, () => 'ab'[rnd(2)]).join('');
let bad = 0, yes = 0;
for (let t = 0; t < 3000; t++) {
  const a = word(rnd(5)), b = word(rnd(5)), c = word(a.length + b.length);
  const r = isInterleave(a, b, c);
  if (r) yes++;
  if (r !== brute(a, b, c)) bad++;
}
console.log(`random self-test vs brute force: 3000 cases (${yes} true), ${bad} mismatches`);
