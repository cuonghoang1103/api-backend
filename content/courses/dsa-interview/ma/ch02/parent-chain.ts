// Real-world shape of the same problem: "parent" pointers (pages inside pages, folders, managers, comment replies).
// parentOf maps a page id to its parent id (null = top level). A cycle makes "walk up to the root" loop forever.

// #region ghi
// Guard on WRITE (what src/services/notesHierarchy.service.ts › setNoteParent does): before setting
// parent(page) = newParent, walk up from newParent; if we meet page itself, the move would create a ring.
function canMove(parentOf: Map<number, number | null>, page: number, newParent: number, maxDepth = 10): string {
  if (page === newParent) return 'SELF_PARENT';
  let cur: number | null = newParent, depth = 1;
  while (cur !== null) {
    if (cur === page) return 'PARENT_CYCLE';
    if (++depth > maxDepth) return 'MAX_DEPTH';
    cur = parentOf.get(cur) ?? null;
  }
  return 'OK';
}
// #endregion

// #region doc
// Guard on READ when the data may ALREADY be corrupted (old rows, a manual UPDATE, a race between two moves):
// Floyd on the implicit list id -> parentOf(id) detects the ring with O(1) memory and no depth cap.
function hasRingAbove(parentOf: Map<number, number | null>, start: number): boolean {
  const up = (x: number | null) => (x === null ? null : parentOf.get(x) ?? null);
  let slow: number | null = start, fast: number | null = start;
  while (fast !== null && up(fast) !== null) {
    slow = up(slow);
    fast = up(up(fast));
    if (slow === fast) return true;
  }
  return false;
}
// #endregion

// 1 is the root; 2 and 3 are children of 1; 4 is a child of 2; 5 is a child of 4.
const tree = new Map<number, number | null>([[1, null], [2, 1], [3, 1], [4, 2], [5, 4]]);
console.log('move 2 under 3 :', canMove(tree, 2, 3));
console.log('move 2 under 5 :', canMove(tree, 2, 5), '(5 is a grandchild of 2)');
console.log('move 4 under 4 :', canMove(tree, 4, 4));
// Corrupted data: someone ran UPDATE ... SET parent = 5 WHERE id = 2, so 2 -> 5 -> 4 -> 2.
const broken = new Map(tree); broken.set(2, 5);
console.log('ring above 5 in the healthy tree :', hasRingAbove(tree, 5));
console.log('ring above 5 in the corrupted one:', hasRingAbove(broken, 5));
console.log('ring above 3 in the corrupted one:', hasRingAbove(broken, 3), '(3 -> 1 -> root, untouched)');
