// @java: ReverseList.java
// LC 206 · Reverse Linked List — iterative (3 pointers) and recursive.

// #region node
class ListNode {
  constructor(public val: number, public next: ListNode | null = null) {}
}
const build = (a: number[]): ListNode | null => a.reduceRight<ListNode | null>((nx, v) => new ListNode(v, nx), null);
const show = (h: ListNode | null): string => { const p: number[] = []; for (; h; h = h.next) p.push(h.val); return p.join('->') || 'null'; };
// #endregion

// #region lap
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null, curr = head;
  while (curr) {
    const next = curr.next;   // 1. SAVE the rest of the list before we cut the link
    curr.next = prev;         // 2. turn this arrow around
    prev = curr;              // 3. step both pointers forward
    curr = next;
  }
  return prev;                // prev is the old tail = the new head
}
// #endregion

// #region dequy
function reverseRec(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;      // 0 or 1 node: already reversed
  const newHead = reverseRec(head.next);     // trust the call: the rest is reversed, head.next is now its TAIL
  head.next.next = head;                     // hang head after that tail
  head.next = null;                          // head becomes the new tail
  return newHead;
}
// #endregion

for (const a of [[1, 2, 3, 4, 5], [1, 2], []]) {
  console.log(`${show(build(a))}  iterative -> ${show(reverseList(build(a)))}  recursive -> ${show(reverseRec(build(a)))}`);
}
