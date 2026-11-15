import java.util.*;

// LC 104 · Maximum Depth of Binary Tree (bottom-up and top-down) and LC 543 · Diameter of Binary Tree.
public class DoSauDuongKinh {
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

    // #region duoi-len
    static int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
    // #endregion

    // #region tren-xuong
    static int bestDepth;
    static int maxDepthTopDown(TreeNode root) {
        bestDepth = 0;                               // reset: static fields survive between calls
        go(root, 1);
        return bestDepth;
    }
    static void go(TreeNode node, int depth) {
        if (node == null) return;
        if (node.left == null && node.right == null) bestDepth = Math.max(bestDepth, depth);
        go(node.left, depth + 1);
        go(node.right, depth + 1);
    }
    // #endregion

    // #region duong-kinh
    static int best;
    static int diameterOfBinaryTree(TreeNode root) {
        best = 0;
        height(root);
        return best;
    }
    static int height(TreeNode node) {
        if (node == null) return 0;
        int l = height(node.left), r = height(node.right);
        best = Math.max(best, l + r);        // path that bends here
        return 1 + Math.max(l, r);           // path the parent can extend
    }
    // #endregion

    public static void main(String[] args) {
        Integer[][] cases = {
            {3, 9, 20, null, null, 15, 7},
            {1, 2, 3, 4, 5, null, 6},
            {1, 2},
            {1, 2, null, 3, 4, 5, null, null, 6, 7, null, null, 8},
            {},
        };
        for (Integer[] a : cases) {
            TreeNode t = build(a);
            System.out.println(Arrays.toString(a) + ": maxDepth = " + maxDepth(t) + " (top-down " + maxDepthTopDown(t)
                + "), diameter = " + diameterOfBinaryTree(t));
        }
    }
}
