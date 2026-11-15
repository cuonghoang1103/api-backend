// @java: L2LetterCase.java
// LC 784 · Letter Case Permutation — a letter is a level with two choices, a digit is a level with one.

// #region giai
function letterCasePermutation(s: string): string[] {
  const res: string[] = [];
  const ch = s.split('');
  function bt(i: number): void {
    if (i === ch.length) { res.push(ch.join('')); return; }
    if (/[0-9]/.test(ch[i])) { bt(i + 1); return; }      // digit: only one way forward
    ch[i] = ch[i].toLowerCase(); bt(i + 1);              // choice 1: lower case
    ch[i] = ch[i].toUpperCase(); bt(i + 1);              // choice 2: upper case
    // no explicit undo needed: position i is overwritten before it is read again
  }
  bt(0);
  return res;
}
// #endregion

for (const s of ['a1b2', '3z4', '12345', 'C']) console.log('"' + s + '" -> ' + JSON.stringify(letterCasePermutation(s)));
console.log('"abcdefghijkl" -> ' + letterCasePermutation('abcdefghijkl').length + ' strings (2^12)');
