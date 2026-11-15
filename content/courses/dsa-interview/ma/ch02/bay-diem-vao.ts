// Two real fast/slow bugs, run for real.
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
const idx = (h: ListNode | null, n: ListNode | null) => { let i = 0; for (let p = h; p !== n; p = p!.next) i++; return i; };

// #region sai1
// Bug 1: the null checks in the wrong order. fast.next is read BEFORE we know fast is not null.
function hasCycleWrongOrder(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast!.next !== null && fast !== null) {
    slow = slow!.next;
    fast = fast!.next!.next;
    if (slow === fast) return true;
  }
  return false;
}
// #endregion

// #region sai2
// Bug 2: phase 1 started with fast = head.next ("so the loop condition slow !== fast is false at the start").
// That shifts the meeting point by one step, and in phase 2 the two pointers circle the loop forever, one step apart.
function detectCycleShifted(head: ListNode, maxSteps: number): ListNode | string {
  let slow: ListNode = head, fast: ListNode = head.next!;
  while (slow !== fast) { slow = slow.next!; fast = fast.next!.next!; }
  let p: ListNode = head;
  for (let k = 0; p !== slow; k++) {
    if (k === maxSteps) return `still apart after ${maxSteps} steps (an infinite loop without this cap)`;
    p = p.next!; slow = slow.next!;
  }
  return p;
}
// #endregion

for (const vals of [[1, 2, 3], [1, 2, 3, 4]]) {
  try { console.log(`wrong order on ${JSON.stringify(vals)} (no cycle):`, hasCycleWrongOrder(build(vals, -1))); }
  catch (e) { console.log(`wrong order on ${JSON.stringify(vals)} (no cycle): ${(e as Error).constructor.name}: ${(e as Error).message}`); }
}
const h = build([10, 11, 12, 13, 14, 15, 16, 17], 2)!;
const r = detectCycleShifted(h, 1000);
console.log('true entry index = 2; shifted phase 1 gives:', typeof r === 'string' ? r : 'index ' + idx(h, r));
