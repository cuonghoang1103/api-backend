import java.util.*;

// LC 876 · Middle of the Linked List — second middle and first middle.
public class Middle {
    static class ListNode {
        int val; ListNode next;
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }
    static ListNode fromArray(int[] a) {
        ListNode h = null;
        for (int i = a.length - 1; i >= 0; i--) h = new ListNode(a[i], h);
        return h;
    }

    // #region giua
    static ListNode middleNode(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }
    static ListNode firstMiddle(ListNode head) {
        if (head == null) return null;
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] tests = {{1, 2, 3, 4, 5}, {1, 2, 3, 4, 5, 6}, {7}, {7, 8}};
        for (int[] a : tests) {
            ListNode h = fromArray(a);
            System.out.println(Arrays.toString(a) + ": middleNode = " + middleNode(h).val + ", firstMiddle = " + firstMiddle(h).val);
        }
    }
}
