import java.util.*;

public class ReorderList {
    static class ListNode { int val; ListNode next; ListNode(int v, ListNode n) { val = v; next = n; } }
    static ListNode build(int... a) { ListNode h = null; for (int i = a.length - 1; i >= 0; i--) h = new ListNode(a[i], h); return h; }
    static String show(ListNode h) { StringBuilder sb = new StringBuilder(); for (; h != null; h = h.next) sb.append(sb.length() > 0 ? "->" : "").append(h.val); return sb.length() > 0 ? sb.toString() : "null"; }

    // #region giai
    static void reorderList(ListNode head) {
        if (head == null || head.next == null) return;
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) { slow = slow.next; fast = fast.next.next; }
        ListNode prev = null, curr = slow.next;
        slow.next = null;
        while (curr != null) { ListNode nx = curr.next; curr.next = prev; prev = curr; curr = nx; }
        ListNode a = head, b = prev;
        while (b != null) {
            ListNode an = a.next, bn = b.next;
            a.next = b; b.next = an;
            a = an; b = bn;
        }
    }
    // #endregion

    public static void main(String[] args) {
        int[][] all = {{1, 2, 3, 4}, {1, 2, 3, 4, 5}, {1}, {1, 2}};
        for (int[] arr : all) {
            ListNode h = build(arr);
            reorderList(h);
            StringBuilder in = new StringBuilder();
            for (int x : arr) in.append(in.length() > 0 ? "->" : "").append(x);
            System.out.println(in + " -> " + show(h));
        }
    }
}
