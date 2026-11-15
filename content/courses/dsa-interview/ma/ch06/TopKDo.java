// @thoi-gian
import java.util.*;

// The same measurement in Java: Arrays.sort(int[]) · PriorityQueue<Integer> of size k · 3-way quickselect;
// then 2-way (Lomuto) vs 3-way quickselect on an array of equal values.
public class TopKDo {
    static long seed = 7;
    static int rnd() { seed = (seed * 1103515245L + 12345) % 2147483648L; return (int) seed; }

    static int kthSort(int[] nums, int k) { int[] s = nums.clone(); Arrays.sort(s); return s[s.length - k]; }
    static int kthHeap(int[] nums, int k) {
        PriorityQueue<Integer> h = new PriorityQueue<>();
        for (int x : nums) { h.offer(x); if (h.size() > k) h.poll(); }
        return h.peek();
    }
    static void sw(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }
    static int kthSelect3(int[] nums, int k) {
        int[] a = nums.clone(); int t = a.length - k, lo = 0, hi = a.length - 1;
        for (;;) {
            int pivot = a[lo + rnd() % (hi - lo + 1)], lt = lo, i = lo, gt = hi;
            while (i <= gt) {
                if (a[i] < pivot) sw(a, lt++, i++);
                else if (a[i] > pivot) sw(a, i, gt--);
                else i++;
            }
            if (t < lt) hi = lt - 1; else if (t > gt) lo = gt + 1; else return pivot;
        }
    }
    static int kthSelect2(int[] nums, int k) {
        int[] a = nums.clone(); int t = a.length - k, lo = 0, hi = a.length - 1;
        for (;;) {
            sw(a, lo + rnd() % (hi - lo + 1), hi);
            int pivot = a[hi], s = lo;
            for (int i = lo; i < hi; i++) if (a[i] < pivot) sw(a, s++, i);
            sw(a, s, hi);
            if (s == t) return a[s]; if (t < s) hi = s - 1; else lo = s + 1;
        }
    }
    interface Job { int run(); }
    static double ms(Job f, int lap) {
        double best = Double.MAX_VALUE;
        for (int i = 0; i < lap; i++) { long t0 = System.nanoTime(); f.run(); best = Math.min(best, (System.nanoTime() - t0) / 1e6); }
        return best;
    }
    public static void main(String[] args) {
        System.out.printf("%9s | %7s | %10s | %10s | %11s%n", "n", "k", "sort", "heap of k", "quickselect");
        for (int n : new int[]{10_000, 100_000, 1_000_000}) {
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) nums[i] = rnd() % 1_000_000_000;
            for (int k : new int[]{10, n / 2}) {
                int want = kthSort(nums, k);
                if (kthHeap(nums, k) != want || kthSelect3(nums, k) != want) throw new RuntimeException("mismatch");
                final int kk = k;
                for (int w = 0; w < 3; w++) { kthSort(nums, kk); kthHeap(nums, kk); kthSelect3(nums, kk); } // JIT warm-up
                System.out.printf("%,9d | %,7d | %7.1f ms | %7.1f ms | %8.1f ms%n", n, k,
                    ms(() -> kthSort(nums, kk), 3), ms(() -> kthHeap(nums, kk), 3), ms(() -> kthSelect3(nums, kk), 3));
            }
        }
        System.out.println("all values equal (k = n/2):");
        for (int n : new int[]{10_000, 20_000, 40_000}) {
            int[] same = new int[n]; Arrays.fill(same, 42);
            final int nn = n;
            System.out.printf("%,9d | 2-way Lomuto %7.1f ms | 3-way %5.1f ms%n", n, ms(() -> kthSelect2(same, nn / 2), 1), ms(() -> kthSelect3(same, nn / 2), 3));
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
