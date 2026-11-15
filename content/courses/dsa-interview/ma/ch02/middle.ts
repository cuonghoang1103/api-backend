// @java: Middle.java
// LC 876 · Middle of the Linked List — fast runs twice as fast; when it reaches the end, slow is in the middle.

class ListNode {
  val: number; next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) { this.val = val; this.next = next; }
}
const fromArray = (a: number[]) => a.reduceRight<ListNode | null>((nx, v) => new ListNode(v, nx), null);

// #region giua
// Even length => the SECOND of the two middles (what LC 876 asks for).
function middleNode(head: ListNode | null): ListNode | null {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}
// Even length => the FIRST middle (what you need to split a list in half: palindrome list, reorder list, merge sort).
function firstMiddle(head: ListNode | null): ListNode | null {
  if (head === null) return null;
  let slow = head, fast = head;
  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  return slow;
}
// #endregion

for (const a of [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6], [7], [7, 8]]) {
  const h = fromArray(a);
  console.log(`${JSON.stringify(a)}: middleNode = ${middleNode(h)!.val}, firstMiddle = ${firstMiddle(h)!.val}`);
}
