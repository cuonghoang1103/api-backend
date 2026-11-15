// Trace of Kth Smallest (LC 230): iterative in-order, k counts down on every pop, stops at 0.
import { dungCay } from './_cay.mjs';

export function vetKth(arr, k) {
  const rows = [];
  const stack = [];
  let cur = dungCay(arr);
  let total = 0;
  (function count(n) { if (n) { total++; count(n.left); count(n.right); } })(cur);
  while (cur !== null || stack.length > 0) {
    while (cur !== null) { stack.push(cur); rows.push({ kind: 'push', v: cur.val, stack: stack.map((n) => n.val), k }); cur = cur.left; }
    cur = stack.pop();
    k--;
    rows.push({ kind: 'pop', v: cur.val, stack: stack.map((n) => n.val), k });
    if (k === 0) return { rows, answer: cur.val, total };
    cur = cur.right;
  }
  return { rows, answer: -1, total };
}
