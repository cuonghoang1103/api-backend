// @java: BstChenXoa.java
// LC 700 Search · LC 701 Insert · LC 450 Delete in a BST · LC 108 Convert Sorted Array to (balanced) BST.

class TreeNode {
  val: number; left: TreeNode | null; right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val; this.left = left; this.right = right;
  }
}
function build(a: (number | null)[]): TreeNode | null {
  if (a.length === 0 || a[0] === null) return null;
  const root = new TreeNode(a[0]);
  const q: TreeNode[] = [root];
  let head = 0, i = 1;
  while (i < a.length) {
    const node = q[head++];
    if (a[i] !== null) { node.left = new TreeNode(a[i] as number); q.push(node.left); }
    i++;
    if (i < a.length && a[i] !== null) { node.right = new TreeNode(a[i] as number); q.push(node.right); }
    i++;
  }
  return root;
}

// Tree -> LeetCode array (level order, trailing nulls trimmed), to print results.
function toArr(root: TreeNode | null): (number | null)[] {
  const out: (number | null)[] = [];
  const q: (TreeNode | null)[] = [root];
  for (let h = 0; h < q.length; h++) {
    const n = q[h];
    if (n) { out.push(n.val); q.push(n.left, n.right); } else out.push(null);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

// #region tim
function searchBST(root: TreeNode | null, val: number): TreeNode | null {
  let node = root;
  while (node !== null && node.val !== val) node = val < node.val ? node.left : node.right;   // one path, O(h)
  return node;
}
// #endregion

// #region chen
function insertIntoBST(root: TreeNode | null, val: number): TreeNode {
  if (root === null) return new TreeNode(val);            // the empty spot where val belongs
  if (val < root.val) root.left = insertIntoBST(root.left, val);
  else root.right = insertIntoBST(root.right, val);
  return root;                                            // return the (possibly new) subtree root
}
// #endregion

// #region xoa
function deleteNode(root: TreeNode | null, key: number): TreeNode | null {
  if (root === null) return null;                         // key not found: nothing changes
  if (key < root.val) { root.left = deleteNode(root.left, key); return root; }
  if (key > root.val) { root.right = deleteNode(root.right, key); return root; }
  // found it
  if (root.left === null) return root.right;              // case 1 + 2: zero or one child
  if (root.right === null) return root.left;
  let succ = root.right;                                  // case 3: two children
  while (succ.left !== null) succ = succ.left;            // in-order successor = smallest in the right subtree
  root.val = succ.val;                                    // copy it up ...
  root.right = deleteNode(root.right, succ.val);          // ... and delete it below (it has no left child)
  return root;
}
// #endregion

// #region can-bang
function sortedArrayToBST(nums: number[]): TreeNode | null {
  const make = (lo: number, hi: number): TreeNode | null => {
    if (lo > hi) return null;
    const mid = Math.floor((lo + hi) / 2);                // the middle becomes the root: halves differ by <= 1
    return new TreeNode(nums[mid], make(lo, mid - 1), make(mid + 1, hi));
  };
  return make(0, nums.length - 1);
}
// #endregion

const base = [5, 3, 6, 2, 4, null, 7];
console.log(`search 4 in ${JSON.stringify(base)}: subtree ${JSON.stringify(toArr(searchBST(build(base), 4)))}; search 9: ${JSON.stringify(toArr(searchBST(build(base), 9)))}`);
console.log(`insert 5 into [4,2,7,1,3] = ${JSON.stringify(toArr(insertIntoBST(build([4, 2, 7, 1, 3]), 5)))}`);
for (const k of [7, 6, 3, 5, 0]) console.log(`delete ${k} from ${JSON.stringify(base)} = ${JSON.stringify(toArr(deleteNode(build(base), k)))}`);
console.log(`sortedArrayToBST([-10,-3,0,5,9]) = ${JSON.stringify(toArr(sortedArrayToBST([-10, -3, 0, 5, 9])))}`);
console.log(`sortedArrayToBST([1,2,3,4,5,6,7]) = ${JSON.stringify(toArr(sortedArrayToBST([1, 2, 3, 4, 5, 6, 7])))}`);
