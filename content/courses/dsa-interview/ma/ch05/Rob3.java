import java.util.*;

// LC 337 · House Robber III — each node returns a PAIR to its parent: [best if I am robbed, best if I am not].
public class Rob3 {
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
    static int rob(TreeNode root) { int[] r = go(root); return Math.max(r[0], r[1]); }
    static int[] go(TreeNode node) {
        if (node == null) return new int[]{0, 0};
        int[] l = go(node.left), r = go(node.right);
        int robMe = node.val + l[1] + r[1];
        int skipMe = Math.max(l[0], l[1]) + Math.max(r[0], r[1]);
        return new int[]{robMe, skipMe};
    }
    // #endregion

    public static void main(String[] args) {
        Integer[][] cases = {{3, 2, 3, null, 3, null, 1}, {3, 4, 5, 1, 3, null, 1}, {4, 1, null, 2, null, 3}, {}};
        for (Integer[] a : cases) System.out.println("rob(" + Arrays.toString(a) + ") = " + rob(build(a)));
    }
}
