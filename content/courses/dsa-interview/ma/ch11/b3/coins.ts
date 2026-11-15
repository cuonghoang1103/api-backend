// @java: PvCoins.java
// LC 979 · Distribute Coins in Binary Tree — n nodes, n coins in total; one move = one coin across one edge.
// Key question of Chapter 5: "what does the function return to its parent?" ⇒ the EXCESS of the subtree
// (coins in it minus nodes in it). Every unit of excess, positive or negative, must cross the edge to the parent:
// moves += |excess(left)| + |excess(right)|. One post-order pass, O(n) time, O(h) stack.

class TreeNode {
  constructor(public val: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {}
}

function build(a: (number | null)[]): TreeNode | null {      // LeetCode level-order format
  if (!a.length || a[0] === null) return null;
  const root = new TreeNode(a[0]);
  const q: TreeNode[] = [root];
  let h = 0, i = 1;
  while (i < a.length) {
    const node = q[h++];
    if (i < a.length && a[i] !== null) { node.left = new TreeNode(a[i] as number); q.push(node.left); }
    i++;
    if (i < a.length && a[i] !== null) { node.right = new TreeNode(a[i] as number); q.push(node.right); }
    i++;
  }
  return root;
}

// #region tien-du
function distributeCoins(root: TreeNode | null): number {
  let moves = 0;
  const excess = (node: TreeNode | null): number => {      // returns coins − nodes of this subtree
    if (node === null) return 0;
    const l = excess(node.left);
    const r = excess(node.right);
    moves += Math.abs(l) + Math.abs(r);                       // what crosses the two child edges
    return node.val + l + r - 1;                              // keep one coin here, pass the rest up (or ask for it)
  };
  excess(root);
  return moves;
}
// #endregion

// #region kiem-tong
function distributeOrMinusOne(root: TreeNode | null): number {   // follow-up: total coins may differ from n
  let nodes = 0, coins = 0;
  const walk = (x: TreeNode | null) => { if (!x) return; nodes++; coins += x.val; walk(x.left); walk(x.right); };
  walk(root);
  return coins === nodes ? distributeCoins(root) : -1;
}
// #endregion

const cases: (number | null)[][] = [
  [3, 0, 0],
  [0, 3, 0],
  [1, 0, 2],
  [1],
  [0, 0, null, 3],
  [0, 0, 0, 0, 0, 0, 7],
  [5, 0, null, 0, null, 0, null, 0],
];
for (const a of cases) console.log(`${JSON.stringify(a)} -> moves=${distributeCoins(build(a))}`);
console.log('-- total coins != nodes (follow-up) --');
for (const a of [[2, 0, 0], [1, 1, 1], [0, 0, 1]] as (number | null)[][]) {
  console.log(`${JSON.stringify(a)} -> ${distributeOrMinusOne(build(a))}`);
}
