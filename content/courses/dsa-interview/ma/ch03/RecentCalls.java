import java.util.*;

public class RecentCalls {
    // #region giai
    static class RecentCounter {
        private final Deque<Integer> q = new ArrayDeque<>();
        int ping(int t) {
            q.offerLast(t);
            while (q.peekFirst() < t - 3000) q.pollFirst();
            return q.size();
        }
    }
    // #endregion

    static class Limiter {
        private final Deque<Long> q = new ArrayDeque<>();
        private final int limit; private final long windowMs;
        Limiter(int limit, long windowMs) { this.limit = limit; this.windowMs = windowMs; }
        boolean allow(long t) {
            while (!q.isEmpty() && q.peekFirst() <= t - windowMs) q.pollFirst();
            if (q.size() >= limit) return false;
            q.offerLast(t);
            return true;
        }
    }

    public static void main(String[] args) {
        RecentCounter rc = new RecentCounter();
        List<Integer> r = new ArrayList<>();
        for (int t : new int[]{1, 100, 3001, 3002}) r.add(rc.ping(t));
        System.out.println("ping 1, 100, 3001, 3002 -> " + r);
        Limiter lim = new Limiter(3, 1000);
        List<Boolean> a = new ArrayList<>();
        for (long t : new long[]{0, 100, 200, 300, 999, 1000, 1101}) a.add(lim.allow(t));
        System.out.println("limiter(3 per 1000 ms) at t = 0,100,200,300,999,1000,1101 -> " + a);
    }
}
