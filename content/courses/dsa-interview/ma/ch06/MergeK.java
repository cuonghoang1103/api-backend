import java.util.*;

// LC 23 · Merge k Sorted Lists — min-heap of the current heads.
public class MergeK {
    static class ListNode {
        int val; ListNode next;
        ListNode(int v) { val = v; }
    }

    // #region giai
    static ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> h = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));
        for (ListNode node : lists) if (node != null) h.offer(node);
        ListNode dummy = new ListNode(0), tail = dummy;
        while (!h.isEmpty()) {
            ListNode node = h.poll();
            tail.next = node;
            tail = node;
            if (node.next != null) h.offer(node.next);
        }
        return dummy.next;
    }
    // #endregion

    static ListNode fromArray(int[] xs) {
        ListNode d = new ListNode(0), t = d;
        for (int x : xs) { t.next = new ListNode(x); t = t.next; }
        return d.next;
    }
    static List<Integer> toList(ListNode h) { List<Integer> o = new ArrayList<>(); for (; h != null; h = h.next) o.add(h.val); return o; }
    static String show(int[][] c) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < c.length; i++) sb.append(i > 0 ? "," : "").append(Arrays.toString(c[i]));
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        int[][][] cases = {{{2, 6, 9}, {1, 7}, {3, 4, 8}}, {{1, 5, 6}, {1, 2, 5}, {3, 8}}, {{}, {0}}, {}};
        for (int[][] c : cases) {
            ListNode[] lists = new ListNode[c.length];
            for (int i = 0; i < c.length; i++) lists[i] = fromArray(c[i]);
            System.out.println(show(c) + " -> " + toList(mergeKLists(lists)));
        }
    }
}
