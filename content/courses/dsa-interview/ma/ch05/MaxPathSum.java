import java.util.*;

// LC 124 · Binary Tree Maximum Path Sum — the diameter template with values instead of edge counts.
public class MaxPathSum {
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

    // #region gain
    static int best;
    static int maxPathSum(TreeNode root) {
        best = Integer.MIN_VALUE;               // not 0: every value may be negative
        gain(root);
        return best;
    }
    static int gain(TreeNode node) {
        if (node == null) return 0;
        int l = Math.max(0, gain(node.left));
        int r = Math.max(0, gain(node.right));
        best = Math.max(best, node.val + l + r);
        return node.val + Math.max(l, r);
    }
    // #endregion

    public static void main(String[] args) {
        Integer[][] cases = {{1, 2, 3}, {-10, 9, 20, null, null, 15, 7}, {-3}, {2, -1, -2}, {5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1}};
        for (Integer[] a : cases) System.out.println("maxPathSum(" + Arrays.toString(a) + ") = " + maxPathSum(build(a)));
    }
}
