import java.util.*;

// LC 100 · Same Tree, LC 226 · Invert Binary Tree — recursion on TWO trees, and recursion that rebuilds.
public class SameInvert {
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

    // #region same
    static boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null || q == null) return p == q;
        return p.val == q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
    // #endregion

    // #region invert
    static TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode left = invertTree(root.left), right = invertTree(root.right);
        root.left = right;
        root.right = left;
        return root;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("isSameTree([1,2,3], [1,2,3]) = " + isSameTree(build(1, 2, 3), build(1, 2, 3)));
        System.out.println("isSameTree([1,2], [1,null,2]) = " + isSameTree(build(1, 2), build(1, null, 2)));
        System.out.println("isSameTree([], []) = " + isSameTree(build(), build()));
        Integer[][] cases = {{4, 2, 7, 1, 3, 6, 9}, {2, 1, 3}, {1, 2}, {}};
        for (Integer[] a : cases) System.out.println("invertTree(" + Arrays.toString(a) + ") = " + toList(invertTree(build(a))));
    }
}
