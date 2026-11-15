// @java: L5AddTwo.java
// LC 2 · Add Two Numbers — digits stored in reverse; dummy node + carry, keep going while ANY of the three is left.
class ListNode { constructor(public val: number, public next: ListNode | null = null) {} }
const build = (a: number[]): ListNode | null => a.reduceRight<ListNode | null>((nx, v) => new ListNode(v, nx), null);
const show = (h: ListNode | null): string => { const p: number[] = []; for (; h; h = h.next) p.push(h.val); return p.join('->') || 'null'; };

// #region giai
function addTwoNumbers(a: ListNode | null, b: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let tail = dummy, carry = 0;
  while (a || b || carry) {                      // `|| carry`: 5 + 5 = 10 needs one more node
    const s = (a?.val ?? 0) + (b?.val ?? 0) + carry;
    carry = Math.floor(s / 10);
    tail.next = new ListNode(s % 10);
    tail = tail.next;
    a = a?.next ?? null; b = b?.next ?? null;
  }
  return dummy.next;
}
// #endregion

console.log('342 + 465:', show(addTwoNumbers(build([2, 4, 3]), build([5, 6, 4]))));
console.log('0 + 0:', show(addTwoNumbers(build([0]), build([0]))));
console.log('9999999 + 9999:', show(addTwoNumbers(build([9, 9, 9, 9, 9, 9, 9]), build([9, 9, 9, 9]))));
console.log('5 + 5:', show(addTwoNumbers(build([5]), build([5]))));
