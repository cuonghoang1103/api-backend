import java.util.*;

// LC 112 · Path Sum (top-down: pass the remaining sum) and LC 113 · Path Sum II (collect paths, undo on the way back).
public class PathSum {
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

    // #region co-khong
    static boolean hasPathSum(TreeNode root, int targetSum) {
        if (root == null) return false;
        int rest = targetSum - root.val;
        if (root.left == null && root.right == null) return rest == 0;
        return hasPathSum(root.left, rest) || hasPathSum(root.right, rest);
    }
    // #endregion

    // #region liet-ke
    static List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        List<List<Integer>> res = new ArrayList<>();
        go(root, targetSum, new ArrayList<>(), res);
        return res;
    }
    static void go(TreeNode node, int rest, List<Integer> path, List<List<Integer>> res) {
        if (node == null) return;
        path.add(node.val);
        rest -= node.val;
        if (node.left == null && node.right == null && rest == 0) res.add(new ArrayList<>(path));   // copy!
        go(node.left, rest, path, res);
        go(node.right, rest, path, res);
        path.remove(path.size() - 1);
    }
    // #endregion

    public static void main(String[] args) {
        Integer[] big = {5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1};
        Object[][] cases = {{big, 22}, {new Integer[]{1, 2, 3}, 5}, {new Integer[]{1, 2}, 1}, {new Integer[]{}, 0}};
        for (Object[] c : cases) {
            Integer[] a = (Integer[]) c[0];
            int s = (Integer) c[1];
            TreeNode t = build(a);
            System.out.println("target " + s + " on " + Arrays.toString(a) + ": hasPathSum = " + hasPathSum(t, s) + ", paths = " + pathSum(t, s));
        }
    }
}
