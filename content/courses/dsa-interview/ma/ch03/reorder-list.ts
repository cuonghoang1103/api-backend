// @java: ReorderList.java
// LC 143 · Reorder List — L0 -> Ln -> L1 -> Ln-1 ...  = find middle + reverse second half + weave. In place, O(1) memory.
class ListNode { constructor(public val: number, public next: ListNode | null = null) {} }
const build = (a: number[]): ListNode | null => a.reduceRight<ListNode | null>((nx, v) => new ListNode(v, nx), null);
const show = (h: ListNode | null): string => { const p: number[] = []; for (; h; h = h.next) p.push(h.val); return p.join('->') || 'null'; };

// #region giai
function reorderList(head: ListNode | null): void {
  if (!head || !head.next) return;
  let slow = head, fast: ListNode | null = head;          // 1. middle (Chapter 2: fast & slow)
  while (fast.next && fast.next.next) { slow = slow.next!; fast = fast.next.next; }
  let prev: ListNode | null = null, curr = slow.next;     // 2. reverse the second half
  slow.next = null;                                       //    and CUT the first half off
  while (curr) { const nx: ListNode | null = curr.next; curr.next = prev; prev = curr; curr = nx; }
  let a: ListNode | null = head, b = prev;                // 3. weave: one from the front, one from the back
  while (b) {
    const an: ListNode | null = a!.next, bn: ListNode | null = b.next;
    a!.next = b; b.next = an;
    a = an; b = bn;
  }
}
// #endregion

for (const arr of [[1, 2, 3, 4], [1, 2, 3, 4, 5], [1], [1, 2]]) {
  const h = build(arr);
  reorderList(h);
  console.log(`${arr.join('->')} -> ${show(h)}`);
}
