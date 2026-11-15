import java.util.*;

// LC 234 · Palindrome Linked List — first middle + reverse second half + compare + restore.
public class PalindromeList {
    static class ListNode {
        int val; ListNode next;
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }
    static ListNode fromArray(int[] a) { ListNode h = null; for (int i = a.length - 1; i >= 0; i--) h = new ListNode(a[i], h); return h; }
    static List<Integer> toList(ListNode h) { List<Integer> out = new ArrayList<>(); for (ListNode p = h; p != null; p = p.next) out.add(p.val); return out; }

    // #region giai
    static ListNode reverse(ListNode head) {
        ListNode prev = null;
        while (head != null) { ListNode nx = head.next; head.next = prev; prev = head; head = nx; }
        return prev;
    }
    static boolean isPalindrome(ListNode head) {
        if (head == null || head.next == null) return true;
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) { slow = slow.next; fast = fast.next.next; }
        ListNode second = reverse(slow.next);
        ListNode p = head, q = second;
        boolean ok = true;
        while (q != null) {
            if (p.val != q.val) { ok = false; break; }
            p = p.next; q = q.next;
        }
        slow.next = reverse(second);
        return ok;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] tests = {{1, 2, 2, 1}, {1, 2}, {1, 2, 3, 2, 1}, {1}, {1, 2, 3, 1}};
        for (int[] a : tests) {
            ListNode h = fromArray(a);
            boolean r = isPalindrome(h);
            System.out.println("isPalindrome(" + Arrays.toString(a) + ") = " + r + "   list afterwards = " + toList(h));
        }
    }
}
