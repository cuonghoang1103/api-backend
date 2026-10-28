// Atomics.java — 8 luồng × 2 triệu lần tăng: synchronized, AtomicLong (CAS/LDADD trên MỘT ô), LongAdder (mỗi luồng một ô).
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.LongAdder;

public class Atomics {
    static final int T = 8, N = 2_000_000;
    static long sync = 0;
    static final Object mon = new Object();

    static void time(String name, Runnable body, java.util.function.LongSupplier result) throws Exception {
        Thread[] ts = new Thread[T];
        long t0 = System.nanoTime();
        for (int i = 0; i < T; i++) (ts[i] = new Thread(body)).start();
        for (Thread t : ts) t.join();
        System.out.printf("%-12s got=%d  %5d ms%n", name, result.getAsLong(), (System.nanoTime() - t0) / 1_000_000);
    }

    public static void main(String[] a) throws Exception {
        AtomicLong al = new AtomicLong();
        LongAdder adder = new LongAdder();
        time("synchronized", () -> { for (int i = 0; i < N; i++) synchronized (mon) { sync++; } }, () -> sync);
        time("AtomicLong", () -> { for (int i = 0; i < N; i++) al.incrementAndGet(); }, al::get);
        time("LongAdder", () -> { for (int i = 0; i < N; i++) adder.increment(); }, adder::sum);
    }
}
