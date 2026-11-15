import java.util.*;

public class BfsDfsThuTu {
    static int[][] adj = {{1, 2}, {0, 3}, {0, 3, 6}, {1, 2, 4}, {3, 5}, {4}, {2}};

    // #region bfs
    static int[] dist, parent;
    static List<Integer> bfs(int[][] adj, int s) {
        int n = adj.length;
        dist = new int[n]; parent = new int[n];
        Arrays.fill(dist, -1); Arrays.fill(parent, -1);
        List<Integer> order = new ArrayList<>();
        ArrayDeque<Integer> q = new ArrayDeque<>();
        q.add(s); dist[s] = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            order.add(u);
            for (int v : adj[u]) if (dist[v] == -1) { dist[v] = dist[u] + 1; parent[v] = u; q.add(v); }
        }
        return order;
    }
    static List<Integer> pathTo(int t) {
        LinkedList<Integer> p = new LinkedList<>();
        for (int v = t; v != -1; v = parent[v]) p.addFirst(v);
        return p;
    }
    // #endregion

    // #region dfs
    static void dfs(int[][] adj, int u, boolean[] seen, List<Integer> order) {
        seen[u] = true;
        order.add(u);
        for (int v : adj[u]) if (!seen[v]) dfs(adj, v, seen, order);
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("BFS order : " + bfs(adj, 0));
        System.out.println("dist      : " + Arrays.toString(dist));
        System.out.println("path 0->5 : " + pathTo(5) + "  length " + dist[5]);
        List<Integer> order = new ArrayList<>();
        dfs(adj, 0, new boolean[adj.length], order);
        System.out.println("DFS order : " + order);
    }
}
