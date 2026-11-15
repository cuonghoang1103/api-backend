import java.util.*;

// LC 572 · Subtree of Another Tree — isSame at every node; and the serialize trick, with its delimiter trap.
public class Subtree {
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
    static boolean isSame(TreeNode p, TreeNode q) {
        if (p == null || q == null) return p == q;
        return p.val == q.val && isSame(p.left, q.left) && isSame(p.right, q.right);
    }
    static boolean isSubtree(TreeNode root, TreeNode subRoot) {
        if (root == null) return subRoot == null;
        return isSame(root, subRoot) || isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
    }
    // #endregion

    // #region chuoi
    static void ser(TreeNode n, StringBuilder sb, boolean sep) {
        if (n == null) { sb.append(sep ? ",#" : "#,"); return; }
        if (sep) sb.append(',').append(n.val); else sb.append(n.val).append(',');
        ser(n.left, sb, sep);
        ser(n.right, sb, sep);
    }
    static String key(TreeNode n, boolean sep) {
        StringBuilder sb = new StringBuilder(); ser(n, sb, sep);
        return sep ? sb.toString() : sb.substring(0, sb.length() - 1);
    }
    static boolean isSubtreeByString(TreeNode root, TreeNode sub, boolean sep) { return key(root, sep).contains(key(sub, sep)); }
    // #endregion

    public static void main(String[] args) {
        Integer[][][] cases = {
            {{3, 4, 5, 1, 2}, {4, 1, 2}},
            {{3, 4, 5, 1, 2, null, null, null, null, 0}, {4, 1, 2}},
            {{1, 1}, {1}},
            {{12}, {2}},
        };
        for (Integer[][] c : cases) {
            TreeNode r = build(c[0]), s = build(c[1]);
            System.out.println("isSubtree(" + Arrays.toString(c[0]) + ", " + Arrays.toString(c[1]) + ") = " + isSubtree(r, s)
                + "   string, no delimiter = " + isSubtreeByString(r, s, false) + "   string, delimiter = " + isSubtreeByString(r, s, true));
        }
    }
}
