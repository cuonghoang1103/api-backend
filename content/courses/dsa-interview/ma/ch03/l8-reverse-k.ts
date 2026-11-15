// @java: L8ReverseK.java
// LC 25 · Reverse Nodes in k-Group — dummy node + "reverse a block of k, reconnect, move on"; a short tail stays as is.
class ListNode { constructor(public val: number, public next: ListNode | null = null) {} }
const build = (a: number[]): ListNode | null => a.reduceRight<ListNode | null>((nx, v) => new ListNode(v, nx), null);
const show = (h: ListNode | null): string => { const p: number[] = []; for (; h; h = h.next) p.push(h.val); return p.join('->') || 'null'; };

// #region giai
function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let before: ListNode = dummy;                       // the node just BEFORE the current block
  while (true) {
    let kth: ListNode | null = before;                // 1. is there a full block of k?
    for (let i = 0; i < k && kth; i++) kth = kth.next;
    if (!kth) break;
    const after = kth.next;                           // 2. first node of the NEXT block
    let prev: ListNode | null = after, curr = before.next!;   // 3. reverse the block; its tail points to `after`
    const first = curr;
    while (curr !== after) { const nx: ListNode | null = curr.next; curr.next = prev; prev = curr; curr = nx!; }
    before.next = kth;                                // 4. reconnect: kth is the block's new head
    before = first;                                   //    the old first is the block's new tail
  }
  return dummy.next;
}
// #endregion

console.log('k=2:', show(reverseKGroup(build([1, 2, 3, 4, 5]), 2)));
console.log('k=3:', show(reverseKGroup(build([1, 2, 3, 4, 5]), 3)));
console.log('k=1:', show(reverseKGroup(build([1, 2, 3]), 1)));
console.log('k=3 on 1->2->3->4->5->6:', show(reverseKGroup(build([1, 2, 3, 4, 5, 6]), 3)));
