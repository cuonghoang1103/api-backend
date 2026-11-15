import java.util.*;

// LC 141 · Linked List Cycle — HashSet of nodes vs Floyd's tortoise and hare.
public class HasCycle {
    // #region node
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
    // #endregion

    // #region set
    static boolean hasCycleSet(ListNode head) {
        Set<ListNode> seen = new HashSet<>();   // ListNode does not override equals/hashCode => identity
        for (ListNode p = head; p != null; p = p.next) {
            if (!seen.add(p)) return true;       // add returns false: already there
        }
        return false;
    }
    // #endregion

    // #region floyd
    static boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;        // == on objects compares references: exactly what we want here
        }
        return false;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] vals = {{3, 2, 0, -4}, {1, 2}, {1}, {}, {1, 1, 1, 1}};
        int[] pos = {1, 0, -1, -1, -1};
        for (int k = 0; k < vals.length; k++) {
            ListNode h = build(vals[k], pos[k]);
            System.out.println(Arrays.toString(vals[k]) + ", pos=" + pos[k] + ": floyd = " + hasCycle(h) + ", set = " + hasCycleSet(h));
        }
    }
}
