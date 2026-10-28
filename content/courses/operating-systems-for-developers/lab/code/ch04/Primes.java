// Primes.java — cùng bài đếm số nguyên tố của primes.c, viết bằng năm cách của Java.
//   java Primes.java MODE T N      MODE = threads | pool | cf | stream | virtual
// Chạy hai lần: lần "cold" (JIT chưa biên dịch xong) và lần "warm" — dòng cuối là lần warm.
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.LongStream;

public class Primes {
    static final int CHUNK = 10_000;

    static boolean isPrime(long n) {
        if (n < 2) return false;
        if (n % 2 == 0) return n == 2;
        for (long d = 3; d * d <= n; d += 2) if (n % d == 0) return false;
        return true;
    }
    static long countRange(long lo, long hi) {
        long c = 0;
        for (long n = lo; n < hi; n++) if (isPrime(n)) c++;
        return c;
    }

    // 1) Thread thô: T luồng, mỗi luồng một khúc liền, join từng luồng.
    static long threads(int t, long n) throws Exception {
        long[] found = new long[t];
        Thread[] th = new Thread[t];
        for (int i = 0; i < t; i++) {
            final int id = i;
            th[i] = new Thread(() -> found[id] = countRange(n * id / t, n * (id + 1) / t));
            th[i].start();
        }
        long sum = 0;
        for (int i = 0; i < t; i++) { th[i].join(); sum += found[i]; }
        return sum;
    }

    // 2) ExecutorService: T luồng cố định, mỗi khúc 10 000 số là một Callable, cộng các Future.
    static long pool(ExecutorService ex, long n) throws Exception {
        List<Future<Long>> fs = new ArrayList<>();
        for (long lo = 0; lo < n; lo += CHUNK) {
            long a = lo, b = Math.min(lo + CHUNK, n);
            fs.add(ex.submit(() -> countRange(a, b)));
        }
        long sum = 0;
        for (Future<Long> f : fs) sum += f.get();
        return sum;
    }

    // 3) CompletableFuture: supplyAsync từng khúc trên cùng pool, allOf rồi cộng.
    static long cf(ExecutorService ex, long n) {
        List<CompletableFuture<Long>> fs = new ArrayList<>();
        for (long lo = 0; lo < n; lo += CHUNK) {
            long a = lo, b = Math.min(lo + CHUNK, n);
            fs.add(CompletableFuture.supplyAsync(() -> countRange(a, b), ex));
        }
        CompletableFuture.allOf(fs.toArray(new CompletableFuture[0])).join();
        return fs.stream().mapToLong(CompletableFuture::join).sum();
    }

    // 4) parallelStream: một dòng — chạy trên ForkJoinPool.commonPool() (cỡ = số lõi - 1, + luồng gọi).
    static long stream(long n) {
        return LongStream.range(0, n).parallel().filter(Primes::isPrime).count();
    }

    public static void main(String[] args) throws Exception {
        String mode = args[0];
        int t = Integer.parseInt(args[1]);
        long n = Long.parseLong(args[2]);
        ExecutorService ex = switch (mode) {
            case "pool", "cf" -> Executors.newFixedThreadPool(t);
            case "virtual" -> Executors.newVirtualThreadPerTaskExecutor();   // 5) mỗi khúc một virtual thread
            default -> null;
        };
        for (String run : new String[] {"cold", "warm"}) {
            long t0 = System.nanoTime();
            long r = switch (mode) {
                case "threads" -> threads(t, n);
                case "pool", "virtual" -> pool(ex, n);
                case "cf" -> cf(ex, n);
                case "stream" -> stream(n);
                default -> throw new IllegalArgumentException(mode);
            };
            System.out.printf("%-7s x%-2d N=%d primes=%d %s %6.0f ms%n", mode, t, n, r, run, (System.nanoTime() - t0) / 1e6);
        }
        if (ex != null) ex.shutdown();
    }
}
