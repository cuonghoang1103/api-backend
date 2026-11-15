// @java: McDecodeWays.java
// LC 91 Decode Ways: 'A' = 1 ... 'Z' = 26. How many ways can a digit string be read back as letters?

// #region decode
// dp[i] = number of ways to decode the first i characters (the prefix s[0..i-1]).
function numDecodings(s: string): number {
  const n = s.length;
  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;                                         // base: the empty prefix has one decoding (do nothing)
  for (let i = 1; i <= n; i++) {
    const one = s.charCodeAt(i - 1) - 48;            // last digit alone
    if (one !== 0) dp[i] += dp[i - 1];               // '0' alone is NOT a letter
    if (i >= 2) {
      const two = (s.charCodeAt(i - 2) - 48) * 10 + one;   // last two digits together
      if (two >= 10 && two <= 26) dp[i] += dp[i - 2];      // "06" is not 6: needs 10..26
    }
  }
  return dp[n];
}
// #endregion

// #region sai
// A common first attempt: "a pair is fine if it is <= 26" and "every digit is a letter".
function numDecodingsWrong(s: string): number {
  const n = s.length;
  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= n; i++) {
    dp[i] += dp[i - 1];
    if (i >= 2 && Number(s.slice(i - 2, i)) <= 26) dp[i] += dp[i - 2];
  }
  return dp[n];
}
// #endregion

for (const s of ['12', '226', '06', '10', '2101', '11106', '27', '100', '1111111111']) {
  console.log(`"${s}": right = ${numDecodings(s)}   wrong = ${numDecodingsWrong(s)}`);
}
