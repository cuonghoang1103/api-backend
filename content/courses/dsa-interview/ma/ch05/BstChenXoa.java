import java.util.*;

// LC 700 Search · LC 701 Insert · LC 450 Delete in a BST · LC 108 Convert Sorted Array to (balanced) BST.
public class BstChenXoa {
    static class TreeNode {
        int val; TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }
    static TreeNode build(Integer... a) {
        if (a.length == 0 || a[0] == null) return null;
        TreeNode root = new TreeNode(a[0]);
        Deque<TreeNode> q = new ArrayDeque<>();
        q.add(root);
        int i = 1;
        while (i < a.length) {
            TreeNode node = q.poll();
            if (a[i] != null) { node.left = new TreeNode(a[i]); q.add(node.left); }
            i++;
            if (i < a.length && a[i] != null) { node.right = new TreeNode(a[i]); q.add(node.right); }
            i++;
        }
        return root;
    }

    static List<Integer> toList(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        List<TreeNode> q = new ArrayList<>();
        q.add(root);
        for (int h = 0; h < q.size(); h++) {
            TreeNode n = q.get(h);
            if (n != null) { out.add(n.val); q.add(n.left); q.add(n.right); } else out.add(null);
        }
        while (!out.isEmpty() && out.get(out.size() - 1) == null) out.remove(out.size() - 1);
        return out;
    }

    // #region tim
    static TreeNode searchBST(TreeNode root, int val) {
        TreeNode node = root;
        while (node != null && node.val != val) node = val < node.val ? node.left : node.right;
        return node;
    }
    // #endregion

    // #region chen
    static TreeNode insertIntoBST(TreeNode root, int val) {
        if (root == null) return new TreeNode(val);
        if (val < root.val) root.left = insertIntoBST(root.left, val);
        else root.right = insertIntoBST(root.right, val);
        return root;
    }
    // #endregion

    // #region xoa
    static TreeNode deleteNode(TreeNode root, int key) {
        if (root == null) return null;
        if (key < root.val) { root.left = deleteNode(root.left, key); return root; }
        if (key > root.val) { root.right = deleteNode(root.right, key); return root; }
        if (root.left == null) return root.right;
        if (root.right == null) return root.left;
        TreeNode succ = root.right;
        while (succ.left != null) succ = succ.left;
        root.val = succ.val;
        root.right = deleteNode(root.right, succ.val);
        return root;
    }
    // #endregion

    // #region can-bang
    static TreeNode sortedArrayToBST(int[] nums) { return make(nums, 0, nums.length - 1); }
    static TreeNode make(int[] nums, int lo, int hi) {
        if (lo > hi) return null;
        int mid = (lo + hi) >>> 1;
        TreeNode node = new TreeNode(nums[mid]);
        node.left = make(nums, lo, mid - 1);
        node.right = make(nums, mid + 1, hi);
        return node;
    }
    // #endregion

    public static void main(String[] args) {
        Integer[] base = {5, 3, 6, 2, 4, null, 7};
        System.out.println("search 4 in " + Arrays.toString(base) + ": subtree " + toList(searchBST(build(base), 4)) + "; search 9: " + toList(searchBST(build(base), 9)));
        System.out.println("insert 5 into [4,2,7,1,3] = " + toList(insertIntoBST(build(4, 2, 7, 1, 3), 5)));
        for (int k : new int[]{7, 6, 3, 5, 0}) System.out.println("delete " + k + " from " + Arrays.toString(base) + " = " + toList(deleteNode(build(base), k)));
        System.out.println("sortedArrayToBST([-10,-3,0,5,9]) = " + toList(sortedArrayToBST(new int[]{-10, -3, 0, 5, 9})));
        System.out.println("sortedArrayToBST([1,2,3,4,5,6,7]) = " + toList(sortedArrayToBST(new int[]{1, 2, 3, 4, 5, 6, 7})));
    }
}
