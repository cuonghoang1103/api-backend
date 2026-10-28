// Locks.java — 4 luồng × 2 triệu lần tăng: không khoá, synchronized, ReentrantLock.
import java.util.concurrent.locks.ReentrantLock;

public class Locks {
    static long plain = 0, sync = 0, re = 0;
    static final Object mon = new Object();
    static final ReentrantLock lock = new ReentrantLock();
    static final int T = 4, N = 2_000_000;

    static void time(String name, Runnable body, java.util.function.LongSupplier result) throws Exception {
        Thread[] ts = new Thread[T];
        long t0 = System.nanoTime();
        for (int i = 0; i < T; i++) (ts[i] = new Thread(body)).start();
        for (Thread t : ts) t.join();
        long ms = (System.nanoTime() - t0) / 1_000_000;
        long got = result.getAsLong();
        System.out.printf("%-13s got=%-8d %s %5d ms%n", name, got, got == (long) T * N ? "correct" : "WRONG  ", ms);
    }

    public static void main(String[] a) throws Exception {
        time("no lock", () -> { for (int i = 0; i < N; i++) plain++; }, () -> plain);
        time("synchronized", () -> { for (int i = 0; i < N; i++) synchronized (mon) { sync++; } }, () -> sync);
        time("ReentrantLock", () -> {
            for (int i = 0; i < N; i++) { lock.lock(); try { re++; } finally { lock.unlock(); } }
        }, () -> re);
    }
}
