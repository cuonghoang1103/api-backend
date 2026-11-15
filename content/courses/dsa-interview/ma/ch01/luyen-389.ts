// @java: Luyen389.java
// LC 389 · Find the Difference — XOR cancels every pair, the extra letter survives.

// #region xor
function findTheDifference(s: string, t: string): string {
  let x = 0;
  for (let i = 0; i < s.length; i++) x ^= s.charCodeAt(i); // each letter of s ...
  for (let i = 0; i < t.length; i++) x ^= t.charCodeAt(i); // ... cancels its copy in t
  return String.fromCharCode(x);                           // only the extra letter is left
}
// #endregion

// #region dem
function findTheDifferenceCount(s: string, t: string): string {
  const count = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) count[s.charCodeAt(i) - 97]++;
  for (let i = 0; i < t.length; i++) {
    const c = t.charCodeAt(i) - 97;
    if (--count[c] < 0) return t[i];                       // t has one more of this letter than s
  }
  return '';
}
// #endregion

for (const [s, t] of [['abcd', 'dbcea'], ['', 'z'], ['aab', 'abab'], ['xyz', 'zyxx']]) {
  console.log(`findTheDifference("${s}", "${t}") = ${findTheDifference(s, t)}   count = ${findTheDifferenceCount(s, t)}`);
}
// What the XOR accumulator holds after s: a letter code that is not a letter at all, until t cancels it.
let acc = 0;
for (const ch of 'abcd') acc ^= ch.charCodeAt(0);
console.log(`XOR of "abcd" = ${acc} (binary ${acc.toString(2).padStart(8, '0')})`);
