import java.util.*;

public class L7MaxProbability {
    // #region giai
    static double maxProbability(int n, int[][] edges, double[] succProb, int start, int end) {
        List<List<double[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < edges.length; i++) {
            adj.get(edges[i][0]).add(new double[]{edges[i][1], succProb[i]});
            adj.get(edges[i][1]).add(new double[]{edges[i][0], succProb[i]});
        }
        double[] best = new double[n];
        best[start] = 1;
        PriorityQueue<double[]> pq = new PriorityQueue<>((a, b) -> Double.compare(b[0], a[0]));   // max-heap
        pq.add(new double[]{1, start});
        while (!pq.isEmpty()) {
            double[] top = pq.poll();
            double p = top[0]; int u = (int) top[1];
            if (p < best[u]) continue;
            if (u == end) return p;
            for (double[] e : adj.get(u)) {
                int v = (int) e[0];
                if (p * e[1] > best[v]) { best[v] = p * e[1]; pq.add(new double[]{best[v], v}); }
            }
        }
        return 0;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(String.format(Locale.US, "%.5f", maxProbability(3, new int[][]{{0, 1}, {1, 2}, {0, 2}}, new double[]{0.5, 0.5, 0.2}, 0, 2)));
        System.out.println(String.format(Locale.US, "%.5f", maxProbability(3, new int[][]{{0, 1}, {1, 2}, {0, 2}}, new double[]{0.5, 0.5, 0.3}, 0, 2)));
        System.out.println(String.format(Locale.US, "%.5f", maxProbability(3, new int[][]{{0, 1}}, new double[]{0.5}, 0, 2)));
    }
}
