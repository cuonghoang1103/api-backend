public class L2PalindromeList {
    static class ListNode { int val; ListNode next; ListNode(int v, ListNode n) { val = v; next = n; } }
    static ListNode build(int... a) { ListNode h = null; for (int i = a.length - 1; i >= 0; i--) h = new ListNode(a[i], h); return h; }
    static String show(ListNode h) { StringBuilder sb = new StringBuilder(); for (; h != null; h = h.next) sb.append(sb.length() > 0 ? "->" : "").append(h.val); return sb.toString(); }

    // #region giai
    static ListNode reverse(ListNode h) {
        ListNode prev = null;
        while (h != null) { ListNode nx = h.next; h.next = prev; prev = h; h = nx; }
        return prev;
    }
    static boolean isPalindrome(ListNode head) {
        if (head == null || head.next == null) return true;
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) { slow = slow.next; fast = fast.next.next; }
        ListNode second = reverse(slow.next);
        ListNode a = head, b = second;
        boolean ok = true;
        while (b != null) { if (a.val != b.val) { ok = false; break; } a = a.next; b = b.next; }
        slow.next = reverse(second);
        return ok;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] all = {{1, 2, 2, 1}, {1, 2, 3, 2, 1}, {1, 2}, {7}};
        for (int[] a : all) {
            ListNode h = build(a);
            String in = show(h);
            System.out.println(in + " -> " + isPalindrome(h) + "  (list after: " + show(h) + ")");
        }
    }
}
