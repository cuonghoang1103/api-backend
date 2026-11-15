import java.util.*;

// LC 101 · Symmetric Tree — "same tree" between a subtree and the MIRROR of the other.
public class Symmetric {
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
    static boolean isSymmetric(TreeNode root) { return root == null || mirror(root.left, root.right); }
    static boolean mirror(TreeNode a, TreeNode b) {
        if (a == null || b == null) return a == b;
        return a.val == b.val && mirror(a.left, b.right) && mirror(a.right, b.left);
    }
    // #endregion

    public static void main(String[] args) {
        Integer[][] cases = {{1, 2, 2, 3, 4, 4, 3}, {1, 2, 2, null, 3, null, 3}, {1}, {1, 2, 2, 2, null, 2}};
        for (Integer[] a : cases) System.out.println("isSymmetric(" + Arrays.toString(a) + ") = " + isSymmetric(build(a)));
    }
}
