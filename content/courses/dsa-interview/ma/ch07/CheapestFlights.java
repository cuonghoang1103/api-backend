import java.util.*;

public class CheapestFlights {
    // #region dung
    static int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        int INF = Integer.MAX_VALUE;
        int[] cost = new int[n];
        Arrays.fill(cost, INF);
        cost[src] = 0;
        for (int round = 0; round <= k; round++) {
            int[] next = cost.clone();                       // COPY
            for (int[] f : flights)
                if (cost[f[0]] != INF && cost[f[0]] + f[2] < next[f[1]]) next[f[1]] = cost[f[0]] + f[2];
            cost = next;
        }
        return cost[dst] == INF ? -1 : cost[dst];
    }
    // #endregion

    static int noCopy(int n, int[][] flights, int src, int dst, int k) {
        int INF = Integer.MAX_VALUE;
        int[] cost = new int[n];
        Arrays.fill(cost, INF);
        cost[src] = 0;
        for (int round = 0; round <= k; round++)
            for (int[] f : flights)
                if (cost[f[0]] != INF && cost[f[0]] + f[2] < cost[f[1]]) cost[f[1]] = cost[f[0]] + f[2];
        return cost[dst] == INF ? -1 : cost[dst];
    }

    public static void main(String[] args) {
        int[][] f1 = {{0, 1, 100}, {1, 2, 100}, {2, 0, 100}, {1, 3, 600}, {2, 3, 200}};
        int[][] f2 = {{0, 1, 100}, {1, 2, 100}, {0, 2, 500}};
        System.out.println("k=1: " + findCheapestPrice(4, f1, 0, 3, 1) + "  k=2: " + findCheapestPrice(4, f1, 0, 3, 2));
        System.out.println("k=1: " + findCheapestPrice(3, f2, 0, 2, 1) + "  k=0: " + findCheapestPrice(3, f2, 0, 2, 0));
        System.out.println("no copy, k=0: " + noCopy(3, f2, 0, 2, 0) + "  (should be 500: one direct flight only)");
    }
}
