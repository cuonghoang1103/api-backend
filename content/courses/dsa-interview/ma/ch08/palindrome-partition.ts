// @java: PalindromePartition.java
// LC 131 · Palindrome Partitioning — the choice at each level is "where does the next piece end?"

// #region partition
function partition(s: string): string[][] {
  const n = s.length;
  // pal[i][j] = s[i..j] is a palindrome — precomputed so each check is O(1) instead of O(n)
  const pal: boolean[][] = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
  for (let i = n - 1; i >= 0; i--)
    for (let j = i; j < n; j++)
      pal[i][j] = s[i] === s[j] && (j - i < 2 || pal[i + 1][j - 1]);
  const res: string[][] = [];
  const path: string[] = [];
  function bt(start: number): void {
    if (start === n) { res.push([...path]); return; }
    for (let end = start; end < n; end++) {
      if (!pal[start][end]) continue;             // prune: a piece that is not a palindrome can never be fixed later
      path.push(s.slice(start, end + 1));
      bt(end + 1);
      path.pop();
    }
  }
  bt(0);
  return res;
}
// #endregion

console.log('partition("aab")  = ' + JSON.stringify(partition('aab')));
console.log('partition("a")    = ' + JSON.stringify(partition('a')));
console.log('partition("abba") = ' + JSON.stringify(partition('abba')));
console.log('partition("aaaaaaaaaaaaaaaa") has ' + partition('aaaaaaaaaaaaaaaa').length + ' partitions (2^15 = 32768)');
