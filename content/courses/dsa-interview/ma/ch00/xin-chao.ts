// @java: XinChao.java
// Environment check for the practice folder: if this prints the three lines below, you are ready.
// #region giai
function reverseWords(s: string): string {
  return s.trim().split(/\s+/).reverse().join(' ');
}
// #endregion
console.log(reverseWords('  the sky   is blue '));
console.log(reverseWords('hello'));
console.log(reverseWords('a good   example'));
