import java.util.*;

// Pitfall: a static field keeps its value from the previous test case (LeetCode runs many cases in one JVM).
public class BayStatic {
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
    static class Solution {
        static int best = 0;                       // BUG: initialised once per JVM, not once per test case
        public int diameterOfBinaryTree(TreeNode root) {
            height(root);
            return best;
        }
        int height(TreeNode n) {
            if (n == null) return 0;
            int l = height(n.left), r = height(n.right);
            best = Math.max(best, l + r);
            return 1 + Math.max(l, r);
        }
    }
    // #endregion

    // #region dung
    static class SolutionFixed {
        private int best;                          // instance field ...
        public int diameterOfBinaryTree(TreeNode root) {
            best = 0;                              // ... AND reset at the entry point
            height(root);
            return best;
        }
        int height(TreeNode n) {
            if (n == null) return 0;
            int l = height(n.left), r = height(n.right);
            best = Math.max(best, l + r);
            return 1 + Math.max(l, r);
        }
    }
    // #endregion

    public static void main(String[] args) {
        Integer[][] tests = {{1, 2, 3, 4, 5}, {1, 2}, {1}};
        for (Integer[] a : tests) {
            int wrong = new Solution().diameterOfBinaryTree(build(a));      // a NEW object per case, like the judge
            int right = new SolutionFixed().diameterOfBinaryTree(build(a));
            System.out.println("diameter(" + Arrays.toString(a) + ")  static field: " + wrong + "   fixed: " + right);
        }
    }
}
