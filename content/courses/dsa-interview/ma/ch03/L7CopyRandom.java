import java.util.*;

public class L7CopyRandom {
    static class RNode { int val; RNode next, random; RNode(int v) { val = v; } }

    // #region giai
    static RNode copyRandomList(RNode head) {
        Map<RNode, RNode> clone = new HashMap<>();          // identity is fine: RNode does not override equals/hashCode
        for (RNode p = head; p != null; p = p.next) clone.put(p, new RNode(p.val));
        for (RNode p = head; p != null; p = p.next) {
            RNode c = clone.get(p);
            c.next = clone.get(p.next);                     // get(null) -> null: no special case needed
            c.random = clone.get(p.random);
        }
        return clone.get(head);
    }
    // #endregion

    static RNode buildR(int[] vals, Integer[] rnd) {
        RNode[] ns = new RNode[vals.length];
        for (int i = 0; i < vals.length; i++) ns[i] = new RNode(vals[i]);
        for (int i = 0; i < vals.length; i++) { ns[i].next = i + 1 < vals.length ? ns[i + 1] : null; ns[i].random = rnd[i] == null ? null : ns[rnd[i]]; }
        return vals.length > 0 ? ns[0] : null;
    }
    static String describe(RNode h) {
        Map<RNode, Integer> idx = new IdentityHashMap<>();
        int i = 0;
        for (RNode p = h; p != null; p = p.next) idx.put(p, i++);
        StringBuilder sb = new StringBuilder();
        for (RNode p = h; p != null; p = p.next) sb.append(sb.length() > 0 ? " " : "").append("[").append(p.val).append(",").append(p.random == null ? "null" : idx.get(p.random)).append("]");
        return sb.toString();
    }
    public static void main(String[] args) {
        RNode orig = buildR(new int[]{7, 13, 11, 10, 1}, new Integer[]{null, 0, 4, 2, 0});
        RNode cp = copyRandomList(orig);
        boolean shared = false;
        for (RNode a = orig, b = cp; a != null && b != null; a = a.next, b = b.next) if (a == b || (a.random != null && a.random == b.random)) shared = true;
        System.out.println("original: " + describe(orig));
        System.out.println("copy:     " + describe(cp));
        System.out.println("copy shares any node with the original: " + shared);
    }
}
