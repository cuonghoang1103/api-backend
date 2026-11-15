import java.util.*;

// LC 297 · Serialize and Deserialize Binary Tree — pre-order with an explicit marker for every null.
public class Serialize {
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

    // #region codec
    static String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        ser(root, sb);
        return sb.substring(0, sb.length() - 1);          // drop the trailing comma
    }
    static void ser(TreeNode node, StringBuilder sb) {
        if (node == null) { sb.append("#,"); return; }
        sb.append(node.val).append(',');
        ser(node.left, sb);
        ser(node.right, sb);
    }

    static int pos;
    static TreeNode deserialize(String data) {
        String[] tokens = data.split(",");
        pos = 0;
        return des(tokens);
    }
    static TreeNode des(String[] tokens) {
        String t = tokens[pos++];
        if (t.equals("#")) return null;                   // equals, never == on strings
        TreeNode node = new TreeNode(Integer.parseInt(t));
        node.left = des(tokens);
        node.right = des(tokens);
        return node;
    }
    // #endregion

    public static void main(String[] args) {
        Integer[][] cases = {{1, 2, 3, null, null, 4, 5}, {1, null, 2, 3}, {-7}, {}};
        for (Integer[] a : cases) {
            String s = serialize(build(a));
            List<Integer> back = toList(deserialize(s));
            System.out.println(Arrays.toString(a) + " -> \"" + s + "\" -> " + back + "  round-trip ok: " + back.equals(Arrays.asList(a)));
        }
    }
}
