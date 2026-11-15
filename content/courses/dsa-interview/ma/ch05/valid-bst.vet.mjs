// Trace of the range check (LC 98) on a tree that FOOLS the children-only check. One row per visited node.
import { dungCay } from './_cay.mjs';

export function vetValidBst(arr) {
  const rows = [];
  const path = [];
  function ok(node, lo, hi, side) {
    if (node === null) return true;
    path.push(node.val);
    const pass = (lo === null || node.val > lo) && (hi === null || node.val < hi);
    rows.push({ node: node.val, side, lo, hi, pass, path: [...path] });
    const res = pass && ok(node.left, lo, node.val, 'left') && ok(node.right, node.val, hi, 'right');
    path.pop();
    return res;
  }
  const valid = ok(dungCay(arr), null, null, 'root');
  return { rows, valid };
}
