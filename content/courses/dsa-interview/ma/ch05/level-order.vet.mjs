// Trace of BFS level order (LC 102): one row per dequeued node, with the queue AFTER that step.
import { dungCay } from './_cay.mjs';

export function vetLevelOrder(arr) {
  const root = dungCay(arr);
  const rows = [], res = [];
  const queue = root ? [root] : [];
  let head = 0, lv = 0;
  while (head < queue.length) {
    const size = queue.length - head;
    const level = [];
    for (let k = 0; k < size; k++) {
      const node = queue[head++];
      level.push(node.val);
      const kids = [];
      if (node.left) { queue.push(node.left); kids.push(node.left.val); }
      if (node.right) { queue.push(node.right); kids.push(node.right.val); }
      rows.push({ lv, k, size, node: node.val, kids, queue: queue.slice(head).map((n) => n.val), level: [...level], done: k === size - 1 });
    }
    res.push(level);
    lv++;
  }
  return rows;
}
