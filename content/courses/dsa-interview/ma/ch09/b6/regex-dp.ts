// @java: LuRegex.java
// LC 10 Regular Expression Matching ('.' = any one char, 'x*' = zero or more x) — O(n·m) table, never exponential.

// #region giai
function isMatch(s: string, p: string): boolean {
  const n = s.length, m = p.length;
  // dp[i][j] = does s[0..i) match p[0..j) ?
  const dp: boolean[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(false));
  dp[0][0] = true;                                         // base: empty matches empty
  for (let j = 2; j <= m; j++) {                           // base: empty s vs "a*b*c*" — every x* may vanish
    if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2];
  }
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (p[j - 1] === '*') {
        const x = p[j - 2];                                // the char the star repeats
        dp[i][j] = dp[i][j - 2]                            // use "x*" zero times
          || ((x === '.' || x === s[i - 1]) && dp[i - 1][j]); // or eat one s char and STAY on "x*"
      } else {
        dp[i][j] = (p[j - 1] === '.' || p[j - 1] === s[i - 1]) && dp[i - 1][j - 1];
      }
    }
  }
  return dp[n][m];
}
// #endregion

for (const [s, p] of [['abbb', 'ab*'], ['ac', 'a.c'], ['', 'x*y*'], ['xyz', '.*z'], ['aaa', 'a*a'], ['ab', '.*c'], ['caab', 'c*a*b']]) {
  console.log(`isMatch("${s}", "${p}") = ${isMatch(s, p)}`);
}
// Self-test against the language's own regex engine on random small inputs.
let seed = 20261115;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; };
let bad = 0, yes = 0;
for (let t = 0; t < 3000; t++) {
  const s = Array.from({ length: rnd(7) }, () => 'ab'[rnd(2)]).join('');
  let p = '';
  const k = rnd(5);
  for (let q = 0; q < k; q++) { p += 'ab.'[rnd(3)]; if (rnd(2)) p += '*'; }
  const mine = isMatch(s, p);
  if (mine) yes++;
  if (mine !== new RegExp('^(?:' + p + ')$').test(s)) bad++;
}
console.log(`random self-test vs the built-in regex engine: 3000 cases (${yes} match), ${bad} mismatches`);
