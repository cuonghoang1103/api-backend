public class L5AddTwo {
    static class ListNode { int val; ListNode next; ListNode(int v, ListNode n) { val = v; next = n; } ListNode(int v) { val = v; } }
    static ListNode build(int... a) { ListNode h = null; for (int i = a.length - 1; i >= 0; i--) h = new ListNode(a[i], h); return h; }
    static String show(ListNode h) { StringBuilder sb = new StringBuilder(); for (; h != null; h = h.next) sb.append(sb.length() > 0 ? "->" : "").append(h.val); return sb.toString(); }

    // #region giai
    static ListNode addTwoNumbers(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0), tail = dummy;
        int carry = 0;
        while (a != null || b != null || carry != 0) {
            int s = (a != null ? a.val : 0) + (b != null ? b.val : 0) + carry;
            carry = s / 10;
            tail.next = new ListNode(s % 10);
            tail = tail.next;
            if (a != null) a = a.next;
            if (b != null) b = b.next;
        }
        return dummy.next;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("342 + 465: " + show(addTwoNumbers(build(2, 4, 3), build(5, 6, 4))));
        System.out.println("0 + 0: " + show(addTwoNumbers(build(0), build(0))));
        System.out.println("9999999 + 9999: " + show(addTwoNumbers(build(9, 9, 9, 9, 9, 9, 9), build(9, 9, 9, 9))));
        System.out.println("5 + 5: " + show(addTwoNumbers(build(5), build(5))));
    }
}
