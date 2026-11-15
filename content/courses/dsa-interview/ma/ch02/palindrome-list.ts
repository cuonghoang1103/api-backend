// @java: PalindromeList.java
// LC 234 · Palindrome Linked List — first middle (fast/slow) + reverse the second half + compare, O(1) extra memory.

class ListNode {
  val: number; next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) { this.val = val; this.next = next; }
}
const fromArray = (a: number[]) => a.reduceRight<ListNode | null>((nx, v) => new ListNode(v, nx), null);
const toArray = (h: ListNode | null) => { const out: number[] = []; for (let p = h; p; p = p.next) out.push(p.val); return out; };

// #region giai
function reverse(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  while (head !== null) { const nx: ListNode | null = head.next; head.next = prev; prev = head; head = nx; }
  return prev;
}
function isPalindrome(head: ListNode | null): boolean {
  if (head === null || head.next === null) return true;
  let slow = head, fast = head;
  while (fast.next !== null && fast.next.next !== null) { slow = slow.next!; fast = fast.next.next; }   // FIRST middle
  const second = reverse(slow.next);                // reverse the second half
  let p: ListNode | null = head, q = second, ok = true;
  while (q !== null) {                              // the second half is never longer than the first
    if (p!.val !== q.val) { ok = false; break; }
    p = p!.next; q = q.next;
  }
  slow.next = reverse(second);                      // put the list back: callers do not expect it changed
  return ok;
}
// #endregion

for (const a of [[1, 2, 2, 1], [1, 2], [1, 2, 3, 2, 1], [1], [1, 2, 3, 1]]) {
  const h = fromArray(a);
  const r = isPalindrome(h);
  console.log(`isPalindrome(${JSON.stringify(a)}) = ${r}   list afterwards = ${JSON.stringify(toArray(h))}`);
}
