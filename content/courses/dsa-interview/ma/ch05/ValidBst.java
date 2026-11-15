import java.util.*;

// LC 98 · Validate Binary Search Tree — the "compare with children" trap, the range fix, and the in-order check.
public class ValidBst {
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

    // #region sai
    static boolean isValidBSTWrong(TreeNode root) {
        if (root == null) return true;
        if (root.left != null && root.left.val >= root.val) return false;
        if (root.right != null && root.right.val <= root.val) return false;
        return isValidBSTWrong(root.left) && isValidBSTWrong(root.right);
    }
    // #endregion

    // #region khoang
    static boolean isValidBST(TreeNode root) { return ok(root, null, null); }
    // Integer bounds (null = no bound). Using Integer.MIN_VALUE / MAX_VALUE as "infinity" breaks on [2147483647].
    static boolean ok(TreeNode node, Integer lo, Integer hi) {
        if (node == null) return true;
        if (lo != null && node.val <= lo) return false;
        if (hi != null && node.val >= hi) return false;
        return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);
    }
    // #endregion

    // #region trung-thu-tu
    static boolean isValidBSTInorder(TreeNode root) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode cur = root;
        Integer prev = null;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) { stack.push(cur); cur = cur.left; }
            cur = stack.pop();
            if (prev != null && cur.val <= prev) return false;
            prev = cur.val;
            cur = cur.right;
        }
        return true;
    }
    // #endregion

    public static void main(String[] args) {
        Integer[][] cases = {
            {2, 1, 3},
            {5, 1, 4, null, null, 3, 6},
            {5, 4, 6, null, null, 3, 7},
            {2, 2, 2},
            {2147483647},
            {-2147483648, null, 2147483647},
        };
        for (Integer[] a : cases) {
            TreeNode t = build(a);
            System.out.println(Arrays.toString(a) + ": range = " + isValidBST(t) + ", inorder = " + isValidBSTInorder(t)
                + ", children-only = " + isValidBSTWrong(t));
        }
    }
}
