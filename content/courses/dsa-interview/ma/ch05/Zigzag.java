import java.util.*;

// LC 103 · Binary Tree Zigzag Level Order Traversal — same BFS, only the WRITE position changes.
public class Zigzag {
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

    // #region bfs
    static List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        Queue<TreeNode> queue = new ArrayDeque<>();
        if (root != null) queue.offer(root);
        boolean leftToRight = true;
        while (!queue.isEmpty()) {
            int size = queue.size();
            Integer[] level = new Integer[size];
            for (int k = 0; k < size; k++) {
                TreeNode node = queue.poll();
                level[leftToRight ? k : size - 1 - k] = node.val;
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            res.add(Arrays.asList(level));
            leftToRight = !leftToRight;
        }
        return res;
    }
    // #endregion

    public static void main(String[] args) {
        Integer[][] inputs = {{3, 9, 20, null, null, 15, 7}, {1, 2, 3, 4, 5, null, 6}, {1}, {}};
        for (Integer[] a : inputs)
            System.out.println("zigzag(" + Arrays.toString(a) + ") = " + zigzagLevelOrder(build(a)));
    }
}
