import java.util.*;

// LC 863 · All Nodes Distance K in Binary Tree — add parent links, then the tree is a graph: BFS from the target.
public class DistanceK {
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

    static TreeNode find(TreeNode root, int v) {
        if (root == null || root.val == v) return root;
        TreeNode l = find(root.left, v);
        return l != null ? l : find(root.right, v);
    }

    // #region giai
    static List<Integer> distanceK(TreeNode root, TreeNode target, int k) {
        Map<TreeNode, TreeNode> parent = new HashMap<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        if (root != null) { stack.push(root); parent.put(root, null); }
        while (!stack.isEmpty()) {
            TreeNode n = stack.pop();
            if (n.left != null) { parent.put(n.left, n); stack.push(n.left); }
            if (n.right != null) { parent.put(n.right, n); stack.push(n.right); }
        }
        Set<TreeNode> seen = new HashSet<>(List.of(target));
        List<TreeNode> level = new ArrayList<>(List.of(target));
        for (int d = 0; d < k && !level.isEmpty(); d++) {
            List<TreeNode> next = new ArrayList<>();
            for (TreeNode n : level) {
                for (TreeNode m : new TreeNode[]{n.left, n.right, parent.get(n)}) {
                    if (m != null && seen.add(m)) next.add(m);
                }
            }
            level = next;
        }
        List<Integer> res = new ArrayList<>();
        for (TreeNode n : level) res.add(n.val);
        Collections.sort(res);
        return res;
    }
    // #endregion

    public static void main(String[] args) {
        TreeNode t = build(3, 5, 1, 6, 2, 0, 8, null, null, 7, 4);
        int[][] cases = {{5, 2}, {5, 0}, {7, 3}, {3, 3}, {8, 5}};
        for (int[] c : cases) System.out.println("distanceK(target=" + c[0] + ", k=" + c[1] + ") = " + distanceK(t, find(t, c[0]), c[1]));
    }
}
