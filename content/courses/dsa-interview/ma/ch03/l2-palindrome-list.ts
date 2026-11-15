// @java: L2PalindromeList.java
// LC 234 · Palindrome Linked List — O(1) memory: middle (fast/slow) + reverse second half + compare (+ restore).
class ListNode { constructor(public val: number, public next: ListNode | null = null) {} }
const build = (a: number[]): ListNode | null => a.reduceRight<ListNode | null>((nx, v) => new ListNode(v, nx), null);
const show = (h: ListNode | null): string => { const p: number[] = []; for (; h; h = h.next) p.push(h.val); return p.join('->') || 'null'; };

// #region giai
function reverse(h: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  while (h) { const nx: ListNode | null = h.next; h.next = prev; prev = h; h = nx; }
  return prev;
}
function isPalindrome(head: ListNode | null): boolean {
  if (!head || !head.next) return true;
  let slow = head, fast: ListNode | null = head;
  while (fast.next && fast.next.next) { slow = slow.next!; fast = fast.next.next; }  // slow = end of first half
  const second = reverse(slow.next);
  let a: ListNode | null = head, b = second, ok = true;
  while (b) { if (a!.val !== b.val) { ok = false; break; } a = a!.next; b = b.next; }
  slow.next = reverse(second);                                  // put the list back: callers own their input
  return ok;
}
// #endregion

for (const a of [[1, 2, 2, 1], [1, 2, 3, 2, 1], [1, 2], [7]]) {
  const h = build(a);
  console.log(`${a.join('->')} -> ${isPalindrome(h)}  (list after: ${show(h)})`);
}
