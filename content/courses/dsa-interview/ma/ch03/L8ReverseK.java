public class L8ReverseK {
    static class ListNode { int val; ListNode next; ListNode(int v, ListNode n) { val = v; next = n; } }
    static ListNode build(int... a) { ListNode h = null; for (int i = a.length - 1; i >= 0; i--) h = new ListNode(a[i], h); return h; }
    static String show(ListNode h) { StringBuilder sb = new StringBuilder(); for (; h != null; h = h.next) sb.append(sb.length() > 0 ? "->" : "").append(h.val); return sb.length() > 0 ? sb.toString() : "null"; }

    // #region giai
    static ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0, head), before = dummy;
        while (true) {
            ListNode kth = before;
            for (int i = 0; i < k && kth != null; i++) kth = kth.next;
            if (kth == null) break;
            ListNode after = kth.next, prev = after, curr = before.next, first = curr;
            while (curr != after) { ListNode nx = curr.next; curr.next = prev; prev = curr; curr = nx; }
            before.next = kth;
            before = first;
        }
        return dummy.next;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("k=2: " + show(reverseKGroup(build(1, 2, 3, 4, 5), 2)));
        System.out.println("k=3: " + show(reverseKGroup(build(1, 2, 3, 4, 5), 3)));
        System.out.println("k=1: " + show(reverseKGroup(build(1, 2, 3), 1)));
        System.out.println("k=3 on 1->2->3->4->5->6: " + show(reverseKGroup(build(1, 2, 3, 4, 5, 6), 3)));
    }
}
