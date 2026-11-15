import java.util.*;

// LC 199 · Binary Tree Right Side View — BFS (last node of each level) and DFS (right child first).
public class RightSide {
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
    static List<Integer> rightSideView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        Queue<TreeNode> queue = new ArrayDeque<>();
        if (root != null) queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int k = 0; k < size; k++) {
                TreeNode node = queue.poll();
                if (k == size - 1) res.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
        }
        return res;
    }
    // #endregion

    // #region dfs
    static void go(TreeNode node, int depth, List<Integer> res) {
        if (node == null) return;
        if (depth == res.size()) res.add(node.val);
        go(node.right, depth + 1, res);
        go(node.left, depth + 1, res);
    }
    // #endregion

    public static void main(String[] args) {
        Integer[][] inputs = {{1, 2, 3, null, 5, null, 4}, {1, 2, 3, 4}, {1, null, 3}, {}};
        for (Integer[] a : inputs) {
            TreeNode t = build(a);
            List<Integer> dfs = new ArrayList<>();
            go(t, 0, dfs);
            System.out.println("rightSideView(" + Arrays.toString(a) + ") = " + rightSideView(t) + "   dfs = " + dfs);
        }
    }
}
