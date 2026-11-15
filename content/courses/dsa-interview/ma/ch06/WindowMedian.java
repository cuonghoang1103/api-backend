import java.util.*;

// LC 480 · Sliding Window Median — two heaps + lazy deletion.
public class WindowMedian {
    // #region giai
    static PriorityQueue<Integer> lo, hi;
    static Map<Integer, Integer> late;
    static int loN, hiN;

    static void prune(PriorityQueue<Integer> h) {
        while (!h.isEmpty() && late.getOrDefault(h.peek(), 0) > 0) late.merge(h.poll(), -1, Integer::sum);
    }
    static void balance() {
        if (loN > hiN + 1) { hi.offer(lo.poll()); loN--; hiN++; prune(lo); }
        else if (hiN > loN) { lo.offer(hi.poll()); hiN--; loN++; prune(hi); }
    }
    static void add(int x) {
        if (loN == 0 || x <= lo.peek()) { lo.offer(x); loN++; } else { hi.offer(x); hiN++; }
        balance();
    }
    static void remove(int x) {
        late.merge(x, 1, Integer::sum);
        if (x <= lo.peek()) { loN--; if (x == lo.peek()) prune(lo); }
        else { hiN--; if (x == hi.peek()) prune(hi); }
        balance();
    }
    static double[] medianSlidingWindow(int[] nums, int k) {
        lo = new PriorityQueue<>(Collections.reverseOrder()); hi = new PriorityQueue<>();
        late = new HashMap<>(); loN = 0; hiN = 0;
        double[] out = new double[nums.length - k + 1];
        for (int i = 0; i < nums.length; i++) {
            add(nums[i]);
            if (i >= k) remove(nums[i - k]);
            if (i >= k - 1) out[i - k + 1] = k % 2 == 1 ? lo.peek() : lo.peek() / 2.0 + hi.peek() / 2.0;
        }
        return out;
    }
    // #endregion

    static double[] brute(int[] nums, int k) {
        double[] out = new double[nums.length - k + 1];
        for (int i = 0; i + k <= nums.length; i++) {
            int[] w = Arrays.copyOfRange(nums, i, i + k); Arrays.sort(w);
            out[i] = k % 2 == 1 ? w[k / 2] : w[k / 2 - 1] / 2.0 + w[k / 2] / 2.0;
        }
        return out;
    }
    static String fmt(double[] xs) {
        StringBuilder sb = new StringBuilder();
        for (double x : xs) sb.append(sb.length() > 0 ? " " : "").append(String.format(Locale.ROOT, "%.1f", x));
        return sb.toString();
    }
    static long seed = 3;
    static int rnd() { seed = (seed * 1103515245L + 12345) % 2147483648L; return (int) seed; }

    public static void main(String[] args) {
        int[] a = {4, 1, 7, 1, 8, 7, 8, 7, 7, 4};
        System.out.println("k=3 [4,1,7,1,8,7,8,7,7,4] -> " + fmt(medianSlidingWindow(a, 3)));
        System.out.println("k=4 [4,1,7,1,8,7,8,7,7,4] -> " + fmt(medianSlidingWindow(a, 4)));
        System.out.println("k=2 [2147483647,2147483647] -> " + fmt(medianSlidingWindow(new int[]{2147483647, 2147483647}, 2)));
        int ok = 0;
        for (int t = 0; t < 300; t++) {
            int n = 1 + rnd() % 30, k = 1 + rnd() % n;
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) nums[i] = rnd() % 7 - 3;
            if (fmt(medianSlidingWindow(nums, k)).equals(fmt(brute(nums, k)))) ok++;
        }
        System.out.println("random tests that agree with brute force: " + ok + "/300");
    }
}
