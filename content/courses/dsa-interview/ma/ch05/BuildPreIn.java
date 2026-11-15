import java.util.*;

// LC 105 · Construct Binary Tree from Preorder and Inorder Traversal — preorder gives the root, inorder splits the sides.
public class BuildPreIn {
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

    static List<Integer> toList(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        List<TreeNode> q = new ArrayList<>();
        q.add(root);
        for (int h = 0; h < q.size(); h++) {
            TreeNode n = q.get(h);
            if (n != null) { out.add(n.val); q.add(n.left); q.add(n.right); } else out.add(null);
        }
        while (!out.isEmpty() && out.get(out.size() - 1) == null) out.remove(out.size() - 1);
        return out;
    }

    // #region giai
    static int next;
    static Map<Integer, Integer> pos;
    static TreeNode buildTree(int[] preorder, int[] inorder) {
        pos = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) pos.put(inorder[i], i);
        next = 0;                                      // reset static state for every call
        return make(preorder, 0, inorder.length - 1);
    }
    static TreeNode make(int[] preorder, int lo, int hi) {
        if (lo > hi) return null;
        int val = preorder[next++];
        int mid = pos.get(val);
        TreeNode node = new TreeNode(val);
        node.left = make(preorder, lo, mid - 1);
        node.right = make(preorder, mid + 1, hi);
        return node;
    }
    // #endregion

    public static void main(String[] args) {
        int[][][] cases = {{{3, 9, 20, 15, 7}, {9, 3, 15, 20, 7}}, {{-1}, {-1}}, {{1, 2, 3}, {3, 2, 1}}, {{1, 2, 4, 5, 3, 6}, {4, 2, 5, 1, 3, 6}}};
        for (int[][] c : cases)
            System.out.println("buildTree(" + Arrays.toString(c[0]) + ", " + Arrays.toString(c[1]) + ") = " + toList(buildTree(c[0], c[1])));
    }
}
