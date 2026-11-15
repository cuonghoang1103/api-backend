// @thoi-gian
// Cùng phép đo như jobs-do.ts: DP của LC 1235 với quét lùi tuyến tính (O(n²)) vs tìm nhị phân (O(n log n)).
import java.util.*;

public class PvJobsDo {
    static int[][] makeJobs(int n) {
        long seed = 7;
        int[] s = new int[n], e = new int[n], p = new int[n];
        for (int i = 0; i < n; i++) {
            seed = (seed * 1103515245L + 12345L) & 0xFFFFFFFFL; int a = 1 + (int) ((seed * 1_000_000_000L) >>> 32);
            seed = (seed * 1103515245L + 12345L) & 0xFFFFFFFFL; int d = 1 + (int) ((seed * 500_000_000L) >>> 32);
            seed = (seed * 1103515245L + 12345L) & 0xFFFFFFFFL; int pr = 1 + (int) ((seed * 10_000L) >>> 32);
            s[i] = a; e[i] = a + d; p[i] = pr;
        }
        return new int[][]{s, e, p};
    }

    static long solve(int[] start, int[] end, int[] profit, boolean binary) {
        int n = start.length;
        Integer[] idx = new Integer[n];
        for (int i = 0; i < n; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> Integer.compare(end[a], end[b]));
        int[] ends = new int[n];
        for (int i = 0; i < n; i++) ends[i] = end[idx[i]];
        long[] dp = new long[n + 1];
        for (int i = 1; i <= n; i++) {
            int job = idx[i - 1], j;
            if (binary) {
                int lo = 0, hi = i - 1;
                while (lo < hi) { int mid = (lo + hi) >>> 1; if (ends[mid] > start[job]) hi = mid; else lo = mid + 1; }
                j = lo;
            } else {
                j = i - 1;
                while (j > 0 && ends[j - 1] > start[job]) j--;
            }
            dp[i] = Math.max(dp[i - 1], profit[job] + dp[j]);
        }
        return dp[n];
    }

    public static void main(String[] args) {
        System.out.println("java " + System.getProperty("java.version") + " " + System.getProperty("os.arch"));
        for (int n : new int[]{1_000, 10_000, 50_000, 200_000, 1_000_000}) {
            int[][] j = makeJobs(n);
            double tb = Double.MAX_VALUE; long vb = 0;
            for (int r = 0; r < 3; r++) { long t = System.nanoTime(); vb = solve(j[0], j[1], j[2], true); tb = Math.min(tb, (System.nanoTime() - t) / 1e6); }
            String lin = "skipped";
            if (n <= 50_000) {
                double tl = Double.MAX_VALUE; long vl = 0;
                for (int r = 0; r < (n <= 10_000 ? 3 : 1); r++) { long t = System.nanoTime(); vl = solve(j[0], j[1], j[2], false); tl = Math.min(tl, (System.nanoTime() - t) / 1e6); }
                lin = String.format("%.1f ms%s", tl, vl == vb ? "" : " MISMATCH");
            }
            System.out.printf("n=%,d  linear scan: %s   binary search: %.1f ms   answer=%d%n", n, lin, tb, vb);
        }
    }
}
