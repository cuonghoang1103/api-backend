import java.util.*;

// LC 142 · Linked List Cycle II — Floyd phase 1 + phase 2.
public class CycleEntry {
    static class ListNode {
        int val; ListNode next;
        ListNode(int val) { this.val = val; }
    }
    static ListNode build(int[] vals, int pos) {
        if (vals.length == 0) return null;
        ListNode[] nodes = new ListNode[vals.length];
        for (int i = 0; i < vals.length; i++) nodes[i] = new ListNode(vals[i]);
        for (int i = 0; i + 1 < nodes.length; i++) nodes[i].next = nodes[i + 1];
        if (pos >= 0) nodes[nodes.length - 1].next = nodes[pos];
        return nodes[0];
    }

    // #region entry
    static ListNode detectCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                ListNode p = head;
                while (p != slow) {
                    p = p.next;
                    slow = slow.next;
                }
                return p;
            }
        }
        return null;
    }
    // #endregion

    static int indexOf(ListNode head, ListNode node) {
        if (node == null) return -1;
        int i = 0;
        for (ListNode p = head; p != node; p = p.next) i++;
        return i;
    }
    public static void main(String[] args) {
        int[][] vals = {{3, 2, 0, -4}, {1, 2}, {1}, {10, 11, 12, 13, 14, 15, 16, 17}, {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}};
        int[] pos = {1, 0, -1, 2, 7};
        for (int k = 0; k < vals.length; k++) {
            ListNode h = build(vals[k], pos[k]);
            ListNode e = detectCycle(h);
            System.out.println(Arrays.toString(vals[k]) + ", pos=" + pos[k] + ": entry index = " + indexOf(h, e) + (e != null ? " (value " + e.val + ")" : ""));
        }
    }
}
