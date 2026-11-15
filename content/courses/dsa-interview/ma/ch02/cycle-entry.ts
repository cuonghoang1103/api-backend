// @java: CycleEntry.java
// LC 142 · Linked List Cycle II — Floyd phase 1 (meet) + phase 2 (one pointer from head, one from the meeting point).

class ListNode {
  val: number; next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) { this.val = val; this.next = next; }
}
function build(vals: number[], pos: number): ListNode | null {
  const nodes = vals.map((v) => new ListNode(v));
  for (let i = 0; i + 1 < nodes.length; i++) nodes[i].next = nodes[i + 1];
  if (pos >= 0 && nodes.length > 0) nodes[nodes.length - 1].next = nodes[pos];
  return nodes[0] ?? null;
}

// #region entry
function detectCycle(head: ListNode | null): ListNode | null {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {                 // phase 1 done: they meet somewhere INSIDE the cycle
      let p = head;
      while (p !== slow) {               // phase 2: same speed, one from head, one from the meeting point
        p = p!.next;
        slow = slow!.next;
      }
      return p;                          // they meet exactly at the entry
    }
  }
  return null;
}
// #endregion

function indexOf(head: ListNode | null, node: ListNode | null): number {   // position of node, for printing
  if (node === null) return -1;
  let i = 0;
  for (let p = head; p !== node; p = p!.next) i++;
  return i;
}
const cases: [number[], number][] = [[[3, 2, 0, -4], 1], [[1, 2], 0], [[1], -1], [[10, 11, 12, 13, 14, 15, 16, 17], 2], [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 7]];
for (const [vals, pos] of cases) {
  const h = build(vals, pos);
  const e = detectCycle(h);
  console.log(`${JSON.stringify(vals)}, pos=${pos}: entry index = ${indexOf(h, e)}${e ? ' (value ' + e.val + ')' : ''}`);
}
