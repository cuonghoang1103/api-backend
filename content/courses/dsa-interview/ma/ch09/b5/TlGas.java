import java.util.*;

// LC 134 Gas Station: one pass, reset the start whenever the tank goes negative.
public class TlGas {
    // #region lc134
    static int canCompleteCircuit(int[] gas, int[] cost) {
        int total = 0, tank = 0, start = 0;
        for (int i = 0; i < gas.length; i++) {
            int gain = gas[i] - cost[i];
            total += gain;                   // the whole loop: is there enough fuel at all?
            tank += gain;                    // fuel left since `start`
            if (tank < 0) {                  // cannot reach i + 1 from `start` (nor from anything in between)
                start = i + 1;
                tank = 0;
            }
        }
        return total >= 0 ? start : -1;
    }
    // #endregion

    static int forgetTotal(int[] gas, int[] cost) {
        int tank = 0, start = 0;
        for (int i = 0; i < gas.length; i++) {
            tank += gas[i] - cost[i];
            if (tank < 0) { start = i + 1; tank = 0; }
        }
        return start < gas.length ? start : -1;
    }

    static int brute(int[] gas, int[] cost) {
        int n = gas.length;
        for (int s = 0; s < n; s++) {
            int tank = 0; boolean ok = true;
            for (int k = 0; k < n && ok; k++) { int i = (s + k) % n; tank += gas[i] - cost[i]; if (tank < 0) ok = false; }
            if (ok) return s;
        }
        return -1;
    }

    static long seed = 11;
    static int rnd(int m) { seed = (seed * 48271) % 2147483647L; return (int) (seed % m); }

    public static void main(String[] args) {
        int[][][] cases = {
            {{1, 2, 3, 4, 5}, {3, 4, 5, 1, 2}},
            {{2, 3, 4}, {3, 4, 3}},
            {{5, 1, 2, 3, 4}, {4, 4, 1, 5, 1}},
            {{3, 1, 1}, {1, 2, 2}},
        };
        for (int[][] gc : cases)
            System.out.println("gas=" + Arrays.toString(gc[0]) + " cost=" + Arrays.toString(gc[1]) + " -> greedy " + canCompleteCircuit(gc[0], gc[1])
                + ", brute " + brute(gc[0], gc[1]) + ", forgot-total " + forgetTotal(gc[0], gc[1]));
        int bad = 0, badWrong = 0;
        for (int t = 0; t < 3000; t++) {
            int n = 1 + rnd(7);
            int[] g = new int[n], c = new int[n];
            for (int i = 0; i < n; i++) g[i] = rnd(6);
            for (int i = 0; i < n; i++) c[i] = rnd(6);
            int b = brute(g, c);
            if (canCompleteCircuit(g, c) != b) bad++;
            if (forgetTotal(g, c) != b) badWrong++;
        }
        System.out.println("random check vs brute force: 3000 cases, greedy " + bad + " mismatches, forgot-total " + badWrong + " mismatches");
    }
}
