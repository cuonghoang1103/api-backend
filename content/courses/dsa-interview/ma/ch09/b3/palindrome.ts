// @java: HcPalindrome.java
// LC 5 Longest Palindromic Substring: table filled by LENGTH (diagonals), then expand-around-centre in O(1) memory.

// #region bang
function longestPalindromeTable(s: string): string {
  const n = s.length;
  if (n === 0) return '';
  // is[i][j] = true when s[i..j] (inclusive) reads the same both ways
  const is: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  let bi = 0, bj = 0;
  for (let len = 1; len <= n; len++) {               // ORDER: by length, because is[i][j] needs is[i+1][j-1] (shorter)
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      is[i][j] = s[i] === s[j] && (len <= 2 || is[i + 1][j - 1]);
      if (is[i][j] && len > bj - bi + 1) { bi = i; bj = j; }
    }
  }
  return s.slice(bi, bj + 1);
}
// #endregion

// #region tam
function longestPalindrome(s: string): string {
  let bi = 0, bj = -1;
  const expand = (l: number, r: number) => {          // grow while the two ends match
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    if (r - l - 1 > bj - bi + 1) { bi = l + 1; bj = r - 1; }
  };
  for (let c = 0; c < s.length; c++) {
    expand(c, c);                                    // odd length: centre is one letter  ("aba")
    expand(c, c + 1);                                // even length: centre between two   ("abba")
  }
  return s.slice(bi, bj + 1);
}
// #endregion

for (const s of ['cabbad', 'babad', 'racecar', 'a', 'ab', 'abacdfgdcaba']) {
  console.log(`"${s}": table = "${longestPalindromeTable(s)}"  centre = "${longestPalindrome(s)}"`);
}
