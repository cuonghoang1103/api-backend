// Helper for the .vet.mjs files of chapter 5 (not run by _chay.mjs): build a tree from a LeetCode level-order array.
export function dungCay(a) {
  if (!a.length || a[0] === null) return null;
  const root = { val: a[0], left: null, right: null };
  const q = [root];
  let head = 0, i = 1;
  while (i < a.length) {
    const n = q[head++];
    if (a[i] !== null && a[i] !== undefined) { n.left = { val: a[i], left: null, right: null }; q.push(n.left); }
    i++;
    if (i < a.length && a[i] !== null) { n.right = { val: a[i], left: null, right: null }; q.push(n.right); }
    i++;
  }
  return root;
}
