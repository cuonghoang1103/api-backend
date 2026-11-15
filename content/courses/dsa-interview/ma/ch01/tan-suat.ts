// @java: TanSuat.java
// LC 217 Contains Duplicate · LC 242 Valid Anagram — a Set and a frequency count.

// #region dup
function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();
  for (const x of nums) {
    if (seen.has(x)) return true;   // second time we meet x
    seen.add(x);
  }
  return false;
}
// #endregion

// #region anagram
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);          // only 'a'..'z' per the constraints
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;              // +1 for letters of s
    count[t.charCodeAt(i) - 97]--;              // -1 for letters of t
  }
  return count.every((c) => c === 0);           // all cancelled => same multiset
}
// #endregion

console.log('containsDuplicate([1,2,3,1]) =', containsDuplicate([1, 2, 3, 1]));
console.log('containsDuplicate([1,2,3,4]) =', containsDuplicate([1, 2, 3, 4]));
console.log('isAnagram("anagram","nagaram") =', isAnagram('anagram', 'nagaram'));
console.log('isAnagram("rat","car") =', isAnagram('rat', 'car'));
