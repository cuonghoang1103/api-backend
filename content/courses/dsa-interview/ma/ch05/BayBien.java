import java.util.*;

// Pitfall: using Integer.MIN_VALUE / MAX_VALUE as "minus / plus infinity" when the values themselves can be those numbers.
public class BayBien {
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

    // #region sai
    static boolean okSentinel(TreeNode n, int lo, int hi) {
        if (n == null) return true;
        if (n.val <= lo || n.val >= hi) return false;          // 2147483647 >= Integer.MAX_VALUE  ->  "invalid"
        return okSentinel(n.left, lo, n.val) && okSentinel(n.right, n.val, hi);
    }
    // #endregion

    // #region dung
    static boolean okLong(TreeNode n, long lo, long hi) {      // widen to long: real infinities for int values
        if (n == null) return true;
        if (n.val <= lo || n.val >= hi) return false;
        return okLong(n.left, lo, n.val) && okLong(n.right, n.val, hi);
    }
    // #endregion

    public static void main(String[] args) {
        Integer[][] cases = {{2, 1, 3}, {2147483647}, {-2147483648, null, 2147483647}};
        for (Integer[] a : cases) {
            TreeNode t = build(a);
            System.out.println(Arrays.toString(a) + ": int sentinels = " + okSentinel(t, Integer.MIN_VALUE, Integer.MAX_VALUE)
                + ", long bounds = " + okLong(t, Long.MIN_VALUE, Long.MAX_VALUE));
        }
    }
}
