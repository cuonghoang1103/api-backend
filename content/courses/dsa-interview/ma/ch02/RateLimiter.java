import java.util.*;

// Four rate limiters, same rule, fed the same request times.
public class RateLimiter {
    interface Limiter { String name(); boolean allow(long t); }

    // #region fixed
    static class FixedClock implements Limiter {
        final int limit; final long w; long win = -1; int count = 0;
        FixedClock(int limit, long w) { this.limit = limit; this.w = w; }
        public String name() { return "fixed window (clock-aligned)"; }
        public boolean allow(long t) {
            long id = Math.floorDiv(t, w);
            if (id != win) { win = id; count = 0; }
            count++;
            return count <= limit;
        }
    }
    static class FixedFirstHit implements Limiter {
        final int limit; final long w; long start = Long.MIN_VALUE / 2; int count = 0;
        FixedFirstHit(int limit, long w) { this.limit = limit; this.w = w; }
        public String name() { return "fixed window (from first hit)"; }
        public boolean allow(long t) {
            if (t - start >= w) { start = t; count = 0; }
            count++;
            return count <= limit;
        }
    }
    // #endregion

    // #region log
    static class SlidingLog implements Limiter {
        final int limit; final long w; final ArrayDeque<Long> times = new ArrayDeque<>();
        SlidingLog(int limit, long w) { this.limit = limit; this.w = w; }
        public String name() { return "sliding window log"; }
        public boolean allow(long t) {
            while (!times.isEmpty() && t - times.peekFirst() >= w) times.pollFirst();   // left edge moves
            if (times.size() >= limit) return false;
            times.addLast(t);                                                            // right edge moves
            return true;
        }
    }
    // #endregion

    // #region counter
    static class SlidingCounter implements Limiter {
        final int limit; final long w; long win = -1; long cur = 0, prev = 0;
        SlidingCounter(int limit, long w) { this.limit = limit; this.w = w; }
        public String name() { return "sliding window counter"; }
        public boolean allow(long t) {
            long id = Math.floorDiv(t, w);
            if (id != win) { prev = (id == win + 1) ? cur : 0; cur = 0; win = id; }
            long elapsed = t - id * w;
            if (prev * (w - elapsed) + cur * w >= (long) limit * w) return false;
            cur++;
            return true;
        }
    }
    // #endregion

    static final int LIMIT = 10;
    static final long W = 60_000;
    static List<Limiter> make() {
        return List.of(new FixedClock(LIMIT, W), new FixedFirstHit(LIMIT, W), new SlidingLog(LIMIT, W), new SlidingCounter(LIMIT, W));
    }
    static void run(String title, long[] times, long from, long to) {
        System.out.println(title);
        for (Limiter lim : make()) {
            int ok = 0, inBurst = 0;
            for (long t : times) if (lim.allow(t)) { ok++; if (t >= from && t < to) inBurst++; }
            System.out.println(String.format("  %-30s accepted %2d of %d, %2d of them inside [%d, %d) ms", lim.name(), ok, times.length, inBurst, from, to));
        }
    }
    static long[] range(long a, int n, long step) {
        long[] r = new long[n];
        for (int i = 0; i < n; i++) r[i] = a + i * step;
        return r;
    }
    static long[] concat(long[]... parts) {
        int n = 0;
        for (long[] p : parts) n += p.length;
        long[] r = new long[n];
        int k = 0;
        for (long[] p : parts) for (long x : p) r[k++] = x;
        return r;
    }
    public static void main(String[] args) {
        System.out.println("rule: at most " + LIMIT + " requests per " + W + " ms");
        run("A. normal user: one request every 7 s for 2 minutes", range(0, 18, 7000), 0, 120_000);
        run("B. attacker bursts across the clock minute (10 at 59.90-59.99 s, 10 at 60.00-60.09 s)", concat(range(59_900, 10, 10), range(60_000, 10, 10)), 59_900, 60_100);
        run("C. attacker opens its own window at t=0, waits, then the same burst", concat(new long[]{0}, range(59_910, 9, 10), range(60_000, 10, 10)), 59_900, 60_100);
    }
}
