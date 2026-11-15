public class MergeDummy {
    static class ListNode { int val; ListNode next; ListNode(int v, ListNode n) { val = v; next = n; } ListNode(int v) { val = v; } }
    static ListNode build(int... a) { ListNode h = null; for (int i = a.length - 1; i >= 0; i--) h = new ListNode(a[i], h); return h; }
    static String show(ListNode h) { StringBuilder sb = new StringBuilder(); for (; h != null; h = h.next) sb.append(sb.length() > 0 ? "->" : "").append(h.val); return sb.length() > 0 ? sb.toString() : "null"; }

    // #region merge
    static ListNode mergeTwoLists(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0), tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; }
            else { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = (a != null) ? a : b;
        return dummy.next;
    }
    // #endregion

    // #region nth
    static ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head), fast = dummy, slow = dummy;
        for (int i = 0; i <= n; i++) fast = fast.next;
        while (fast != null) { fast = fast.next; slow = slow.next; }
        slow.next = slow.next.next;
        return dummy.next;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("merge 1->2->4 + 1->3->4 = " + show(mergeTwoLists(build(1, 2, 4), build(1, 3, 4))));
        System.out.println("merge null + 0 = " + show(mergeTwoLists(build(), build(0))));
        System.out.println("remove 2nd from end of 1->2->3->4->5 = " + show(removeNthFromEnd(build(1, 2, 3, 4, 5), 2)));
        System.out.println("remove 1st from end of 1 = " + show(removeNthFromEnd(build(1), 1)));
        System.out.println("remove 2nd from end of 1->2 = " + show(removeNthFromEnd(build(1, 2), 2)));
    }
}
