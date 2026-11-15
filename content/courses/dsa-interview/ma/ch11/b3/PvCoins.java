import java.util.*;

// LC 979 · Distribute Coins in Binary Tree — post-order, each subtree returns its excess (coins − nodes).
public class PvCoins {
    static class TreeNode {
        int val; TreeNode left, right;
        TreeNode(int v) { val = v; }
    }

    static TreeNode build(Integer[] a) {                       // LeetCode level-order format
        if (a.length == 0 || a[0] == null) return null;
        TreeNode root = new TreeNode(a[0]);
        Deque<TreeNode> q = new ArrayDeque<>();
        q.add(root);
        int i = 1;
        while (i < a.length) {
            TreeNode node = q.poll();
            if (i < a.length && a[i] != null) { node.left = new TreeNode(a[i]); q.add(node.left); }
            i++;
            if (i < a.length && a[i] != null) { node.right = new TreeNode(a[i]); q.add(node.right); }
            i++;
        }
        return root;
    }

    // #region tien-du
    static int moves;

    static int distributeCoins(TreeNode root) {
        moves = 0;
        excess(root);
        return moves;
    }

    static int excess(TreeNode node) {                          // coins − nodes of this subtree
        if (node == null) return 0;
        int l = excess(node.left), r = excess(node.right);
        moves += Math.abs(l) + Math.abs(r);
        return node.val + l + r - 1;
    }
    // #endregion

    // #region kiem-tong
    static int nodes, coins;
    static void walk(TreeNode x) { if (x == null) return; nodes++; coins += x.val; walk(x.left); walk(x.right); }

    static int distributeOrMinusOne(TreeNode root) {
        nodes = 0; coins = 0;
        walk(root);
        return coins == nodes ? distributeCoins(root) : -1;
    }
    // #endregion

    static String show(Integer[] a) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < a.length; i++) sb.append(i > 0 ? "," : "").append(a[i] == null ? "null" : a[i].toString());
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        Integer[][] cases = {
            {3, 0, 0}, {0, 3, 0}, {1, 0, 2}, {1}, {0, 0, null, 3}, {0, 0, 0, 0, 0, 0, 7},
            {5, 0, null, 0, null, 0, null, 0},
        };
        for (Integer[] a : cases) System.out.println(show(a) + " -> moves=" + distributeCoins(build(a)));
        System.out.println("-- total coins != nodes (follow-up) --");
        Integer[][] other = {{2, 0, 0}, {1, 1, 1}, {0, 0, 1}};
        for (Integer[] a : other) System.out.println(show(a) + " -> " + distributeOrMinusOne(build(a)));
    }
}
