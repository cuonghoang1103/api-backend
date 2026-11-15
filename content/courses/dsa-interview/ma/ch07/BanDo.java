import java.util.*;

public class BanDo {
    static final String[] PLACES = {"Nha tro", "Nga tu Thu Duc", "Suoi Tien", "FPTU", "Vincom LVV", "Nga ba Man Thien"};

    // #region duong
    static String route(int n, int[][] roads, int s, int t) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] r : roads) { adj.get(r[0]).add(new int[]{r[1], r[2]}); adj.get(r[1]).add(new int[]{r[0], r[2]}); }
        int[] dist = new int[n], parent = new int[n];
        boolean[] done = new boolean[n];
        Arrays.fill(dist, Integer.MAX_VALUE); Arrays.fill(parent, -1);
        dist[s] = 0;
        for (int round = 0; round < n; round++) {
            int u = -1;
            for (int x = 0; x < n; x++) if (!done[x] && (u == -1 || dist[x] < dist[u])) u = x;
            if (dist[u] == Integer.MAX_VALUE) break;
            done[u] = true;
            for (int[] e : adj.get(u)) if (dist[u] + e[1] < dist[e[0]]) { dist[e[0]] = dist[u] + e[1]; parent[e[0]] = u; }
        }
        LinkedList<String> path = new LinkedList<>();
        for (int v = t; v != -1; v = parent[v]) path.addFirst(PLACES[v]);
        return dist[t] + " min  " + String.join(" -> ", path);
    }
    // #endregion

    public static void main(String[] args) {
        int[][] roads = {{0, 1, 7}, {0, 4, 4}, {4, 5, 3}, {5, 3, 6}, {1, 2, 5}, {2, 3, 4}, {4, 1, 2}, {5, 2, 5}};
        System.out.println("normal : " + route(6, roads, 0, 3));
        int[][] jam = new int[roads.length][];
        for (int i = 0; i < roads.length; i++) jam[i] = (roads[i][0] == 5 && roads[i][1] == 3) ? new int[]{5, 3, 15} : roads[i];
        System.out.println("jam    : " + route(6, jam, 0, 3));
    }
}
