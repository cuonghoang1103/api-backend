// @java: ValidPalindromeII.java
// LC 680 · Valid Palindrome II — at the first mismatch you may delete ONE character: try both sides.

// #region giai
function isPal(s: string, l: number, r: number): boolean {
  while (l < r) { if (s[l] !== s[r]) return false; l++; r--; }
  return true;
}
function validPalindrome(s: string): boolean {
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return isPal(s, l + 1, r) || isPal(s, l, r - 1);   // delete s[l] OR delete s[r]
    l++; r--;
  }
  return true;
}
// #endregion

// #region sai
function validPalindromeLeftOnly(s: string): boolean {
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return isPal(s, l + 1, r);                          // BUG: only tries deleting the left one
    l++; r--;
  }
  return true;
}
// #endregion

for (const s of ['aba', 'abca', 'abc', 'cbbcc', 'a', 'deeee']) {
  console.log(`validPalindrome(${JSON.stringify(s)}) = ${validPalindrome(s)}   left-only = ${validPalindromeLeftOnly(s)}`);
}
