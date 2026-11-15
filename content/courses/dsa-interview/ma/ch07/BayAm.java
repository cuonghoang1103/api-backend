import java.util.*;

public class BayAm {
    static int[] dijkstraDone(int n, int[][] edges, int s) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) adj.get(e[0]).add(new int[]{e[1], e[2]});
        int[] dist = new int[n];
        boolean[] done = new boolean[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[s] = 0;
        for (int k = 0; k < n; k++) {
            int u = -1;
            for (int x = 0; x < n; x++) if (!done[x] && (u == -1 || dist[x] < dist[u])) u = x;
            done[u] = true;
            for (int[] e : adj.get(u)) if (!done[e[0]] && dist[u] + e[1] < dist[e[0]]) dist[e[0]] = dist[u] + e[1];
        }
        return dist;
    }
    static int[] bellmanFord(int n, int[][] edges, int s) {
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[s] = 0;
        for (int i = 0; i < n - 1; i++)
            for (int[] e : edges) if (dist[e[0]] != Integer.MAX_VALUE && dist[e[0]] + e[2] < dist[e[1]]) dist[e[1]] = dist[e[0]] + e[2];
        return dist;
    }
    public static void main(String[] args) {
        int[][] E = {{0, 1, 2}, {0, 2, 5}, {2, 1, -4}, {1, 3, 1}};
        System.out.println("Dijkstra    : " + Arrays.toString(dijkstraDone(4, E, 0)));
        System.out.println("Bellman-Ford: " + Arrays.toString(bellmanFord(4, E, 0)));
    }
}
