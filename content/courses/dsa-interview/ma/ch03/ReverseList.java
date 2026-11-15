public class ReverseList {
    // #region node
    static class ListNode {
        int val; ListNode next;
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }
    static ListNode build(int... a) { ListNode h = null; for (int i = a.length - 1; i >= 0; i--) h = new ListNode(a[i], h); return h; }
    static String show(ListNode h) {
        StringBuilder sb = new StringBuilder();
        for (; h != null; h = h.next) sb.append(sb.length() > 0 ? "->" : "").append(h.val);
        return sb.length() > 0 ? sb.toString() : "null";
    }
    // #endregion

    // #region lap
    static ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
    // #endregion

    // #region dequy
    static ListNode reverseRec(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode newHead = reverseRec(head.next);
        head.next.next = head;
        head.next = null;
        return newHead;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] all = {{1, 2, 3, 4, 5}, {1, 2}, {}};
        for (int[] a : all) {
            System.out.println(show(build(a)) + "  iterative -> " + show(reverseList(build(a))) + "  recursive -> " + show(reverseRec(build(a))));
        }
    }
}
