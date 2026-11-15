// @java: McWordBreak.java
// LC 139 Word Break: can s be cut into pieces that are all dictionary words?

// #region wb
// dp[i] = true when the first i characters s[0..i-1] can be cut into words.
function wordBreak(s: string, wordDict: string[]): boolean {
  const dict = new Set(wordDict);
  let maxLen = 0;
  for (const w of wordDict) maxLen = Math.max(maxLen, w.length);
  const dp = new Array<boolean>(s.length + 1).fill(false);
  dp[0] = true;                                       // base: the empty prefix needs no cut
  for (let i = 1; i <= s.length; i++) {
    for (let j = i - 1; j >= Math.max(0, i - maxLen); j--) {   // last word = s[j..i-1]
      if (dp[j] && dict.has(s.slice(j, i))) { dp[i] = true; break; }
    }
  }
  return dp[s.length];
}
// #endregion

// #region cat
// Same table, but remember WHERE the last word started, then walk back to print one segmentation.
function segment(s: string, wordDict: string[]): string | null {
  const dict = new Set(wordDict);
  const from = new Array<number>(s.length + 1).fill(-1);   // from[i] = start of the last word, -1 = impossible
  from[0] = 0;
  for (let i = 1; i <= s.length; i++)
    for (let j = 0; j < i; j++)
      if (from[j] !== -1 && dict.has(s.slice(j, i))) { from[i] = j; break; }
  if (from[s.length] === -1) return null;
  const words: string[] = [];
  for (let i = s.length; i > 0; i = from[i]) words.push(s.slice(from[i], i));
  return words.reverse().join(' ');
}
// #endregion

console.log(`wordBreak("leetcode", [leet, code]) = ${wordBreak('leetcode', ['leet', 'code'])}`);
console.log(`wordBreak("applepenapple", [apple, pen]) = ${wordBreak('applepenapple', ['apple', 'pen'])}`);
console.log(`wordBreak("catsandog", [cats, dog, sand, and, cat]) = ${wordBreak('catsandog', ['cats', 'dog', 'sand', 'and', 'cat'])}`);
console.log(`wordBreak("aaaaaaab", [a, aa, aaa]) = ${wordBreak('aaaaaaab', ['a', 'aa', 'aaa'])}`);
console.log(`segment("thanhtoanthatbai", [thanh, toan, that, bai, thanhtoan]) = ${segment('thanhtoanthatbai', ['thanh', 'toan', 'that', 'bai', 'thanhtoan'])}`);
console.log(`segment("ilovecoding", [i, love, cod, coding, ing]) = ${segment('ilovecoding', ['i', 'love', 'cod', 'coding', 'ing'])}`);
