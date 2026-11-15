import java.util.*;

// LC 144 / 94 / 145 · Binary Tree Preorder / Inorder / Postorder Traversal — recursive and iterative.
public class Traversals {
    // #region dung
    static class TreeNode {
        int val; TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }
    // Level-order array -> tree. Integer (not int) so that null means "no child".
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
    // #endregion

    // #region de-quy
    static void preorder(TreeNode root, List<Integer> out) {
        if (root == null) return;
        out.add(root.val);             // visit BEFORE the children
        preorder(root.left, out);
        preorder(root.right, out);
    }
    static void inorder(TreeNode root, List<Integer> out) {
        if (root == null) return;
        inorder(root.left, out);
        out.add(root.val);             // visit BETWEEN the children
        inorder(root.right, out);
    }
    static void postorder(TreeNode root, List<Integer> out) {
        if (root == null) return;
        postorder(root.left, out);
        postorder(root.right, out);
        out.add(root.val);             // visit AFTER the children
    }
    // #endregion

    // #region pre-lap
    static List<Integer> preorderIter(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();   // ArrayDeque, not the old synchronized Stack
        if (root != null) stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            out.add(node.val);
            if (node.right != null) stack.push(node.right);
            if (node.left != null) stack.push(node.left);
        }
        return out;
    }
    // #endregion

    // #region in-lap
    static List<Integer> inorderIter(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode cur = root;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) { stack.push(cur); cur = cur.left; }
            cur = stack.pop();
            out.add(cur.val);
            cur = cur.right;
        }
        return out;
    }
    // #endregion

    // #region post-lap
    static List<Integer> postorderIter(TreeNode root) {
        LinkedList<Integer> out = new LinkedList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        if (root != null) stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            out.addFirst(node.val);                   // prepend = build the reversed order directly
            if (node.left != null) stack.push(node.left);
            if (node.right != null) stack.push(node.right);
        }
        return out;
    }
    // #endregion

    public static void main(String[] args) {
        Integer[][] inputs = {{1, 2, 3, 4, 5, null, 6}, {3, 9, 20, null, null, 15, 7}, {1}, {}};
        for (Integer[] a : inputs) {
            TreeNode t = build(a);
            List<Integer> pre = new ArrayList<>(), in = new ArrayList<>(), post = new ArrayList<>();
            preorder(t, pre); inorder(t, in); postorder(t, post);
            System.out.println("tree " + Arrays.toString(a));
            System.out.println("  preorder  = " + pre + "  iterative = " + preorderIter(t));
            System.out.println("  inorder   = " + in + "  iterative = " + inorderIter(t));
            System.out.println("  postorder = " + post + "  iterative = " + postorderIter(t));
        }
    }
}
