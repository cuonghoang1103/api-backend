// Two linked-list traps, run for real.
class ListNode { constructor(public val: number, public next: ListNode | null = null) {} }
const build = (a: number[]): ListNode | null => a.reduceRight<ListNode | null>((nx, v) => new ListNode(v, nx), null);
const show = (h: ListNode | null): string => { const p: number[] = []; for (; h && p.length < 20; h = h.next) p.push(h.val); return p.join('->') || 'null'; };

// #region sai
function reverseWrongOrder(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null, curr = head;
  while (curr) {
    curr.next = prev;          // BUG: the arrow is turned BEFORE the rest of the list was saved
    prev = curr;
    curr = curr.next;          // ...so this is now `prev`'s old value: we walk backwards into null
  }
  return prev;
}
// #endregion
console.log('reverse with the lines in the wrong order: 1->2->3->4 ->', show(reverseWrongOrder(build([1, 2, 3, 4]))));

// #region dequy
function reverseRec(h: ListNode | null): ListNode | null {
  if (!h || !h.next) return h;
  const nh = reverseRec(h.next);
  h.next.next = h; h.next = null;
  return nh;
}
function reverseIter(h: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  while (h) { const nx: ListNode | null = h.next; h.next = prev; prev = h; h = nx; }
  return prev;
}
// #endregion
for (const n of [1_000, 100_000]) {
  const a = Array.from({ length: n }, (_, i) => i);
  let r: string;
  try { r = 'head = ' + reverseRec(build(a))!.val; } catch (e) { r = `${(e as Error).name}: ${(e as Error).message}`; }
  console.log(`n = ${n.toLocaleString('en-US')}: recursive -> ${r}   iterative -> head = ${reverseIter(build(a))!.val}`);
}
