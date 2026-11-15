import java.util.*;

// LC 110 · Balanced Binary Tree — naive O(n^2) vs one post-order pass with a -1 "already unbalanced" signal.
public class CanBang {
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

    // #region ngay-tho
    static int height(TreeNode n) { return n == null ? 0 : 1 + Math.max(height(n.left), height(n.right)); }
    static boolean isBalancedNaive(TreeNode root) {
        if (root == null) return true;
        return Math.abs(height(root.left) - height(root.right)) <= 1
            && isBalancedNaive(root.left) && isBalancedNaive(root.right);
    }
    // #endregion

    // #region mot-luot
    static boolean isBalanced(TreeNode root) { return check(root) != -1; }
    static int check(TreeNode node) {
        if (node == null) return 0;
        int l = check(node.left);
        if (l == -1) return -1;
        int r = check(node.right);
        if (r == -1) return -1;
        if (Math.abs(l - r) > 1) return -1;
        return 1 + Math.max(l, r);
    }
    // #endregion

    public static void main(String[] args) {
        Integer[][] cases = {
            {3, 9, 20, null, null, 15, 7},
            {1, 2, 2, 3, 3, null, null, 4, 4},
            {1, 2, 2, 3, null, null, 3, 4, null, null, 4},
            {},
        };
        for (Integer[] a : cases) {
            TreeNode t = build(a);
            System.out.println("isBalanced(" + Arrays.toString(a) + ") = " + isBalanced(t) + "   naive = " + isBalancedNaive(t));
        }
    }
}
