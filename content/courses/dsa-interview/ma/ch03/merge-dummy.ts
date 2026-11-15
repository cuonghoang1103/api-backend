// @java: MergeDummy.java
// LC 21 · Merge Two Sorted Lists · LC 19 · Remove Nth Node From End — both made simple by a DUMMY node.
class ListNode { constructor(public val: number, public next: ListNode | null = null) {} }
const build = (a: number[]): ListNode | null => a.reduceRight<ListNode | null>((nx, v) => new ListNode(v, nx), null);
const show = (h: ListNode | null): string => { const p: number[] = []; for (; h; h = h.next) p.push(h.val); return p.join('->') || 'null'; };

// #region merge
function mergeTwoLists(a: ListNode | null, b: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);            // a fake head: "the first real node" is no longer a special case
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }   // <= keeps equal elements in original order (stable)
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a ?? b;                       // splice the leftover in O(1) — no loop needed
  return dummy.next;
}
// #endregion

// #region nth
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let fast: ListNode | null = dummy, slow: ListNode = dummy;
  for (let i = 0; i <= n; i++) fast = fast!.next;   // gap of n+1 nodes between slow and fast
  while (fast) { fast = fast.next; slow = slow.next!; }
  slow.next = slow.next!.next;              // slow stands just BEFORE the node to delete
  return dummy.next;                        // works even when the head itself was deleted
}
// #endregion

console.log('merge 1->2->4 + 1->3->4 =', show(mergeTwoLists(build([1, 2, 4]), build([1, 3, 4]))));
console.log('merge null + 0 =', show(mergeTwoLists(build([]), build([0]))));
console.log('remove 2nd from end of 1->2->3->4->5 =', show(removeNthFromEnd(build([1, 2, 3, 4, 5]), 2)));
console.log('remove 1st from end of 1 =', show(removeNthFromEnd(build([1]), 1)));
console.log('remove 2nd from end of 1->2 =', show(removeNthFromEnd(build([1, 2]), 2)));
