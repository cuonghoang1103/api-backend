import java.util.*;

public class NetworkDelay {
    // #region dijkstra
    static int networkDelayTime(int[][] times, int n, int k) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        for (int[] t : times) adj.get(t[0]).add(new int[]{t[1], t[2]});
        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[k] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));   // not a[0] - b[0]
        pq.add(new int[]{0, k});
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int d = top[0], u = top[1];
            if (d > dist[u]) continue;
            for (int[] e : adj.get(u)) {
                int v = e[0], w = e[1];
                if (d + w < dist[v]) { dist[v] = d + w; pq.add(new int[]{dist[v], v}); }
            }
        }
        int worst = 0;
        for (int v = 1; v <= n; v++) worst = Math.max(worst, dist[v]);
        return worst == Integer.MAX_VALUE ? -1 : worst;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(networkDelayTime(new int[][]{{2, 1, 1}, {2, 3, 1}, {3, 4, 1}}, 4, 2));
        System.out.println(networkDelayTime(new int[][]{{1, 2, 1}}, 2, 1));
        System.out.println(networkDelayTime(new int[][]{{1, 2, 1}}, 2, 2));
        System.out.println(networkDelayTime(new int[][]{{1, 2, 4}, {1, 3, 1}, {3, 2, 1}, {2, 4, 1}}, 4, 1));
    }
}
