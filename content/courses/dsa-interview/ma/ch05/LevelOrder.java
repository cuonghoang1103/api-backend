import java.util.*;

// LC 102 · Binary Tree Level Order Traversal — BFS with a queue, one inner loop per level.
public class LevelOrder {
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
    static List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();                 // freeze the level size
            List<Integer> level = new ArrayList<>(size);
            for (int k = 0; k < size; k++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            res.add(level);
        }
        return res;
    }
    // #endregion

    public static void main(String[] args) {
        Integer[][] inputs = {{3, 9, 20, null, null, 15, 7}, {1, 2, 3, 4, 5, null, 6}, {1}, {}};
        for (Integer[] a : inputs)
            System.out.println("levelOrder(" + Arrays.toString(a) + ") = " + levelOrder(build(a)));
    }
}
