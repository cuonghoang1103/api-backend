// Trace of Diameter of Binary Tree (LC 543): one row each time a call RETURNS (post-order), with the call stack
// that is still waiting above it. Runs the real algorithm.
import { dungCay } from './_cay.mjs';

export function vetDuongKinh(arr) {
  const root = dungCay(arr);
  const rows = [];
  const stack = [];
  let best = 0;
  function height(node) {
    if (node === null) return 0;
    stack.push(node.val);
    const l = height(node.left);
    const r = height(node.right);
    const truoc = best;
    best = Math.max(best, l + r);
    const h = 1 + Math.max(l, r);
    rows.push({ node: node.val, waiting: stack.slice(0, -1), l, r, bend: l + r, h, best, moi: best > truoc });
    stack.pop();
    return h;
  }
  height(root);
  return { rows, best };
}
