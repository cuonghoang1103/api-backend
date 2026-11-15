import java.util.*;

// LC 235 · Lowest Common Ancestor of a Binary Search Tree — walk down until p and q are on different sides.
public class LcaBst {
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
        TreeNode n = root;
        while (n != null && n.val != v) n = v < n.val ? n.left : n.right;
        return n;
    }

    // #region lca
    static TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode node = root;
        while (node != null) {
            if (p.val < node.val && q.val < node.val) node = node.left;
            else if (p.val > node.val && q.val > node.val) node = node.right;
            else return node;
        }
        return null;
    }
    // #endregion

    public static void main(String[] args) {
        TreeNode t = build(6, 2, 8, 0, 4, 7, 9, null, null, 3, 5);
        int[][] pairs = {{2, 8}, {2, 4}, {3, 5}, {7, 9}, {0, 5}};
        for (int[] pq : pairs)
            System.out.println("lca(" + pq[0] + ", " + pq[1] + ") = " + lowestCommonAncestor(t, find(t, pq[0]), find(t, pq[1])).val);
    }
}
