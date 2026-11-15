// @java: HasCycle.java
// LC 141 · Linked List Cycle — a Set of visited nodes (O(n) memory) vs Floyd's tortoise and hare (O(1) memory).

// #region node
class ListNode {
  val: number; next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) { this.val = val; this.next = next; }
}
// LeetCode's input format: values + pos = index the tail points back to (-1 = no cycle).
function build(vals: number[], pos: number): ListNode | null {
  const nodes = vals.map((v) => new ListNode(v));
  for (let i = 0; i + 1 < nodes.length; i++) nodes[i].next = nodes[i + 1];
  if (pos >= 0 && nodes.length > 0) nodes[nodes.length - 1].next = nodes[pos];
  return nodes[0] ?? null;
}
// #endregion

// #region set
function hasCycleSet(head: ListNode | null): boolean {
  const seen = new Set<ListNode>();        // stores NODES (references), not values: values may repeat
  for (let p = head; p !== null; p = p.next) {
    if (seen.has(p)) return true;          // walked into a node we already visited
    seen.add(p);
  }
  return false;                            // reached null: the list ends
}
// #endregion

// #region floyd
function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {   // fast checks the road two steps ahead
    slow = slow!.next;                             // 1 step
    fast = fast.next.next;                         // 2 steps
    if (slow === fast) return true;                // same NODE: fast lapped slow inside a cycle
  }
  return false;
}
// #endregion

const cases: [number[], number][] = [[[3, 2, 0, -4], 1], [[1, 2], 0], [[1], -1], [[], -1], [[1, 1, 1, 1], -1]];
for (const [vals, pos] of cases) {
  const h = build(vals, pos);
  console.log(`${JSON.stringify(vals)}, pos=${pos}: floyd = ${hasCycle(h)}, set = ${hasCycleSet(h)}`);
}
