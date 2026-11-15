import java.util.*;

// LC 1448 · Count Good Nodes in Binary Tree — top-down: pass the maximum seen on the path from the root.
public class GoodNodes {
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

    // #region giai
    static int goodNodes(TreeNode root) { return go(root, Integer.MIN_VALUE); }
    static int go(TreeNode node, int maxSoFar) {
        if (node == null) return 0;
        int good = node.val >= maxSoFar ? 1 : 0;
        int m = Math.max(maxSoFar, node.val);
        return good + go(node.left, m) + go(node.right, m);
    }
    // #endregion

    public static void main(String[] args) {
        Integer[][] cases = {{3, 1, 4, 3, null, 1, 5}, {3, 3, null, 4, 2}, {1}, {-1, -2, -3}};
        for (Integer[] a : cases) System.out.println("goodNodes(" + Arrays.toString(a) + ") = " + goodNodes(build(a)));
    }
}
