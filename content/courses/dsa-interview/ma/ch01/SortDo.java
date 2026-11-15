import java.util.*;

// @thoi-gian
// Same measurement in Java: Integer[] with a comparator vs int[] (primitive), and top-k frequent by sort vs bucket.
public class SortDo {
    static long seed;
    static int rnd(int m) { seed = (seed * 48271L) % 2147483647L; return (int) (seed % m); }
    interface Job { void run(); }
    static double ms(Job f, int lap) {
        double best = Double.MAX_VALUE;
        for (int k = 0; k < lap; k++) { long t = System.nanoTime(); f.run(); best = Math.min(best, (System.nanoTime() - t) / 1e6); }
        return best;
    }
    static int[] topKSort(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) count.merge(x, 1, Integer::sum);
        List<Map.Entry<Integer, Integer>> es = new ArrayList<>(count.entrySet());
        es.sort((a, b) -> Integer.compare(b.getValue(), a.getValue()));
        int[] out = new int[k];
        for (int i = 0; i < k; i++) out[i] = es.get(i).getKey();
        return out;
    }
    @SuppressWarnings("unchecked")
    static int[] topKBucket(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) count.merge(x, 1, Integer::sum);
        List<Integer>[] bucket = new List[nums.length + 1];
        for (Map.Entry<Integer, Integer> e : count.entrySet()) {
            int c = e.getValue();
            if (bucket[c] == null) bucket[c] = new ArrayList<>();
            bucket[c].add(e.getKey());
        }
        int[] out = new int[k];
        int n = 0;
        for (int f = nums.length; f >= 1 && n < k; f--) {
            if (bucket[f] == null) continue;
            for (int v : bucket[f]) { out[n++] = v; if (n == k) break; }
        }
        return out;
    }
    public static void main(String[] args) {
        System.out.printf("%10s | %10s | %10s | %10s | %11s%n", "n", "Integer[]", "int[]", "topK sort", "topK bucket");
        for (int n : new int[]{1_000, 10_000, 100_000, 1_000_000}) {
            seed = 7;
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = rnd(n);
            Integer[] boxed = new Integer[n];
            for (int i = 0; i < n; i++) boxed[i] = a[i];
            double t1 = ms(() -> { Integer[] c = boxed.clone(); Arrays.sort(c, (x, y) -> Integer.compare(x, y)); }, 5);
            double t2 = ms(() -> { int[] c = a.clone(); Arrays.sort(c); }, 5);
            double t3 = ms(() -> topKSort(a, 10), 5);
            double t4 = ms(() -> topKBucket(a, 10), 5);
            System.out.printf("%10s | %10s | %10s | %10s | %11s%n", String.format("%,d", n), String.format("%.2f ms", t1),
                String.format("%.2f ms", t2), String.format("%.2f ms", t3), String.format("%.2f ms", t4));
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
