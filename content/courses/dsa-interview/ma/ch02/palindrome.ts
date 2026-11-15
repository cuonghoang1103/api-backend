// @java: Palindrome.java
// LC 125 · Valid Palindrome — two pointers from both ends, skipping anything that is not a letter or digit.

// #region dung
function isAlnum(c: string): boolean {            // ASCII only, exactly what the problem promises
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
}
function isPalindrome(s: string): boolean {
  let l = 0, r = s.length - 1;
  while (l < r) {
    while (l < r && !isAlnum(s[l])) l++;            // l < r again: the inner loops must not cross
    while (l < r && !isAlnum(s[r])) r--;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++; r--;
  }
  return true;
}
// #endregion

for (const s of ['A man, a plan, a canal: Panama', 'race a car', ' ', '0P', '.,', 'ab_a']) {
  console.log(`isPalindrome(${JSON.stringify(s)}) = ${isPalindrome(s)}`);
}
