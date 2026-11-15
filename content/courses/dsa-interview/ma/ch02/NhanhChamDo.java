import java.util.*;

// @thoi-gian
// Same measurement in Java: HashSet of nodes vs Floyd, list of n nodes whose tail points back to the middle.
public class NhanhChamDo {
    static class ListNode { ListNode next; }
    static ListNode build(int n) {
        ListNode[] nodes = new ListNode[n];
        for (int i = 0; i < n; i++) nodes[i] = new ListNode();
        for (int i = 0; i + 1 < n; i++) nodes[i].next = nodes[i + 1];
        nodes[n - 1].next = nodes[n >> 1];
        return nodes[0];
    }
    static int withSet(ListNode h) {
        Set<ListNode> seen = new HashSet<>();
        for (ListNode p = h; p != null; p = p.next) { if (!seen.add(p)) return seen.size(); }
        return -1;
    }
    static int floyd(ListNode h) {
        ListNode slow = h, fast = h;
        int steps = 0;
        while (fast != null && fast.next != null) {
            slow = slow.next; fast = fast.next.next; steps++;
            if (slow == fast) return steps;
        }
        return -1;
    }
    interface Job { void run(); }
    static double ms(Job f, int lap) {
        double best = Double.MAX_VALUE;
        for (int k = 0; k < lap; k++) { long t = System.nanoTime(); f.run(); best = Math.min(best, (System.nanoTime() - t) / 1e6); }
        return best;
    }
    public static void main(String[] args) {
        System.out.printf("%10s | %10s | %12s | %10s | %11s | Floyd extra memory%n", "n", "Set", "Set entries", "Floyd", "slow steps");
        for (int n : new int[]{1_000, 10_000, 100_000, 1_000_000}) {
            ListNode h = build(n);
            String a = String.format("%.2f ms", ms(() -> withSet(h), 5));
            String b = String.format("%.2f ms", ms(() -> floyd(h), 7));
            System.out.printf("%10s | %10s | %12s | %10s | %11s | 2 references%n", String.format("%,d", n), a, String.format("%,d", withSet(h)), b, String.format("%,d", floyd(h)));
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
