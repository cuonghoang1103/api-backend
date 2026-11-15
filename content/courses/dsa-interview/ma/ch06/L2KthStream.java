import java.util.*;

// LC 703 · Kth Largest Element in a Stream.
public class L2KthStream {
    // #region giai
    static class KthLargest {
        private final PriorityQueue<Integer> h = new PriorityQueue<>();
        private final int k;
        KthLargest(int k, int[] nums) { this.k = k; for (int x : nums) add(x); }
        int add(int val) {
            h.offer(val);
            if (h.size() > k) h.poll();
            return h.peek();
        }
    }
    // #endregion

    public static void main(String[] args) {
        KthLargest kl = new KthLargest(3, new int[]{5, 1, 9});
        System.out.println("k=3 start [5,1,9]: add(4)=" + kl.add(4) + " add(10)=" + kl.add(10) + " add(2)=" + kl.add(2) + " add(7)=" + kl.add(7));
        KthLargest k1 = new KthLargest(1, new int[0]);
        System.out.println("k=1 start []: add(-3)=" + k1.add(-3) + " add(-8)=" + k1.add(-8) + " add(0)=" + k1.add(0));
    }
}
