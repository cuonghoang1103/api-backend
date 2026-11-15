import java.util.*;

// LC 236 · Lowest Common Ancestor of a Binary Tree — post-order: "what did you find below you?"
public class Lca {
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

    static TreeNode find(TreeNode root, int v) {
        if (root == null || root.val == v) return root;
        TreeNode l = find(root.left, v);
        return l != null ? l : find(root.right, v);
    }

    // #region giai
    static TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;     // compare NODES (references), not values
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;
        return left != null ? left : right;
    }
    // #endregion

    public static void main(String[] args) {
        TreeNode t = build(3, 5, 1, 6, 2, 0, 8, null, null, 7, 4);
        int[][] pairs = {{5, 1}, {5, 4}, {7, 8}, {6, 4}, {7, 7}};
        for (int[] pq : pairs) System.out.println("lca(" + pq[0] + ", " + pq[1] + ") = " + lowestCommonAncestor(t, find(t, pq[0]), find(t, pq[1])).val);
    }
}
