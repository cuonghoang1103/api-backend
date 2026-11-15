import java.util.*;

// @thoi-gian
// The same workload in Java: ArrayList.remove(0) (shifts every element, like JS shift) vs LinkedList vs ArrayDeque.
public class QueueDo {
    static long withArrayList(int n) {
        List<Integer> q = new ArrayList<>();
        for (int i = 0; i < n / 2; i++) q.add(i);
        long s = 0;
        for (int i = 0; i < n; i++) { q.add(i); s += q.remove(0); }
        return s;
    }
    static long withLinkedList(int n) {
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < n / 2; i++) q.offer(i);
        long s = 0;
        for (int i = 0; i < n; i++) { q.offer(i); s += q.poll(); }
        return s;
    }
    static long withArrayDeque(int n) {
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n / 2; i++) q.offerLast(i);
        long s = 0;
        for (int i = 0; i < n; i++) { q.offerLast(i); s += q.pollFirst(); }
        return s;
    }
    interface Job { void run(); }
    static double ms(Job f, int lap) {
        double best = Double.MAX_VALUE;
        for (int k = 0; k < lap; k++) { long t = System.nanoTime(); f.run(); best = Math.min(best, (System.nanoTime() - t) / 1e6); }
        return best;
    }
    public static void main(String[] args) {
        System.out.printf("%10s | %16s | %12s | %12s%n", "n", "ArrayList rm(0)", "LinkedList", "ArrayDeque");
        for (int n : new int[]{1_000, 10_000, 20_000, 100_000, 200_000, 1_000_000}) {
            String a = n <= 200_000 ? String.format("%.2f ms", ms(() -> withArrayList(n), n >= 100_000 ? 1 : 3)) : "skipped";
            String b = String.format("%.2f ms", ms(() -> withLinkedList(n), 5));
            String c = String.format("%.2f ms", ms(() -> withArrayDeque(n), 5));
            System.out.printf("%10s | %16s | %12s | %12s%n", String.format("%,d", n), a, b, c);
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
