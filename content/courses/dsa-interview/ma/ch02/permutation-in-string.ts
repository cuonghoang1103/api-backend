// @java: PermutationInString.java
// LC 567 · Permutation in String — a window that never holds MORE of a letter than s1 has; length m means "permutation found".

// #region window
function checkInclusion(s1: string, s2: string): boolean {
  const m = s1.length;
  const cnt = new Array(26).fill(0);              // how many of each letter the window may still take
  for (const c of s1) cnt[c.charCodeAt(0) - 97]++;
  let l = 0;
  for (let r = 0; r < s2.length; r++) {
    const c = s2.charCodeAt(r) - 97;
    cnt[c]--;                                      // s2[r] enters
    while (cnt[c] < 0) {                           // one too many of c: shrink until it fits again
      cnt[s2.charCodeAt(l) - 97]++;
      l++;
    }
    if (r - l + 1 === m) return true;              // m letters, none over budget => same multiset as s1
  }
  return false;
}
// #endregion

for (const [a, b] of [['ab', 'eidbaooo'], ['ab', 'eidboaoo'], ['adc', 'dcda'], ['hello', 'ooolleoooleh']]) {
  console.log(`checkInclusion(${JSON.stringify(a)}, ${JSON.stringify(b)}) = ${checkInclusion(a, b)}`);
}
