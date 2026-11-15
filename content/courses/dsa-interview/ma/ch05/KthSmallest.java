import java.util.*;

// LC 230 · Kth Smallest Element in a BST — iterative in-order that stops after k pops.
public class KthSmallest {
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

    // #region kth
    static int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode cur = root;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) { stack.push(cur); cur = cur.left; }
            cur = stack.pop();
            if (--k == 0) return cur.val;
            cur = cur.right;
        }
        return -1;
    }
    // #endregion

    public static void main(String[] args) {
        Object[][] cases = {{new Integer[]{3, 1, 4, null, 2}, 1}, {new Integer[]{5, 3, 6, 2, 4, null, null, 1}, 3},
                            {new Integer[]{5, 3, 6, 2, 4, null, null, 1}, 6}, {new Integer[]{1}, 1}};
        for (Object[] c : cases)
            System.out.println("kthSmallest(" + Arrays.toString((Integer[]) c[0]) + ", k=" + c[1] + ") = " + kthSmallest(build((Integer[]) c[0]), (Integer) c[1]));
    }
}
