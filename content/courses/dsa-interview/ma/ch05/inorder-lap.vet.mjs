// Trace of the iterative inorder traversal (LC 94): runs the REAL algorithm and records every push / pop.
import { dungCay } from './_cay.mjs';

export function vetInorderLap(arr) {
  const root = dungCay(arr);
  const stack = [], out = [], rows = [];
  let cur = root;
  const snap = (action) => rows.push({ action, cur: cur ? cur.val : null, stack: stack.map((n) => n.val), out: [...out] });
  while (cur !== null || stack.length > 0) {
    while (cur !== null) {
      stack.push(cur);
      const v = cur.val;
      cur = cur.left;
      snap({ kind: 'push', v });
    }
    cur = stack.pop();
    out.push(cur.val);
    const v = cur.val;
    cur = cur.right;
    snap({ kind: 'pop', v });
  }
  return rows;
}
