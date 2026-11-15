import java.util.*;

// LC 1235 · Maximum Profit in Job Scheduling — sort by end, dp over prefixes, binary search for the last compatible job.
public class PvJobs {
    // #region dp-nhi-phan
    static int jobScheduling(int[] start, int[] end, int[] profit) {
        int n = start.length;
        Integer[] idx = new Integer[n];
        for (int i = 0; i < n; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> Integer.compare(end[a], end[b]));   // compare, never end[a] - end[b]
        int[] ends = new int[n];
        for (int i = 0; i < n; i++) ends[i] = end[idx[i]];
        int[] dp = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            int job = idx[i - 1];
            int lo = 0, hi = i - 1;                       // first position with end > start[job]
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (ends[mid] > start[job]) hi = mid; else lo = mid + 1;
            }
            dp[i] = Math.max(dp[i - 1], profit[job] + dp[lo]);
        }
        return dp[n];
    }
    // #endregion

    // #region truy-vet
    static List<Integer> chosenJobs(int[] start, int[] end, int[] profit) {
        int n = start.length;
        Integer[] idx = new Integer[n];
        for (int i = 0; i < n; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> Integer.compare(end[a], end[b]));
        int[] ends = new int[n];
        for (int i = 0; i < n; i++) ends[i] = end[idx[i]];
        int[] dp = new int[n + 1], prev = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            int job = idx[i - 1], lo = 0, hi = i - 1;
            while (lo < hi) { int mid = (lo + hi) >>> 1; if (ends[mid] > start[job]) hi = mid; else lo = mid + 1; }
            prev[i] = lo;
            dp[i] = Math.max(dp[i - 1], profit[job] + dp[lo]);
        }
        LinkedList<Integer> picked = new LinkedList<>();
        for (int i = n; i > 0; ) {
            if (dp[i] == dp[i - 1]) i--;
            else { picked.addFirst(idx[i - 1]); i = prev[i]; }
        }
        return picked;
    }
    // #endregion

    static int brute(int[] start, int[] end, int[] profit) {
        int n = start.length, best = 0;
        for (int mask = 0; mask < (1 << n); mask++) {
            List<Integer> js = new ArrayList<>();
            for (int i = 0; i < n; i++) if ((mask & (1 << i)) != 0) js.add(i);
            js.sort((a, b) -> Integer.compare(start[a], start[b]));
            boolean ok = true;
            int s = 0;
            for (int t = 0; t < js.size(); t++) {
                if (t > 0 && start[js.get(t)] < end[js.get(t - 1)]) { ok = false; break; }
                s += profit[js.get(t)];
            }
            if (ok) best = Math.max(best, s);
        }
        return best;
    }

    static long seed = 2026;
    static int rnd(int m) {
        seed = (seed * 1103515245L + 12345L) & 0xFFFFFFFFL;
        return (int) ((seed >>> 8) % m);
    }

    public static void main(String[] args) {
        int[][][] cases = {
            {{8, 9, 13, 10}, {10, 12, 15, 14}, {3, 5, 4, 6}},
            {{1, 3, 3, 6, 2}, {4, 5, 7, 8, 9}, {20, 10, 30, 25, 40}},
            {{1}, {2}, {5}},
            {{1, 1, 1}, {5, 5, 5}, {4, 9, 2}},
            {{1, 2, 3}, {2, 3, 4}, {1, 1, 1}},
            {{1, 2, 2, 3}, {3, 3, 5, 6}, {10, 1, 1, 100}},
        };
        for (int[][] c : cases) {
            System.out.println("start=" + Arrays.toString(c[0]) + " end=" + Arrays.toString(c[1]) + " profit=" + Arrays.toString(c[2])
                + " -> " + jobScheduling(c[0], c[1], c[2]) + " jobs=" + chosenJobs(c[0], c[1], c[2]) + " brute=" + brute(c[0], c[1], c[2]));
        }
        int ok = 0;
        for (int t = 0; t < 300; t++) {
            int n = 1 + rnd(10);
            int[] s = new int[n], e = new int[n], p = new int[n];
            for (int i = 0; i < n; i++) { int a = 1 + rnd(20); s[i] = a; e[i] = a + 1 + rnd(6); p[i] = 1 + rnd(30); }
            if (jobScheduling(s, e, p) == brute(s, e, p)) ok++;
        }
        System.out.println("random: " + ok + "/300 match brute force");
    }
}
