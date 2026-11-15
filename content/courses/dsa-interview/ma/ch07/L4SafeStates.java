import java.util.*;

public class L4SafeStates {
    // #region giai
    static List<Integer> eventualSafeNodes(int[][] graph) {
        int n = graph.length;
        List<List<Integer>> rev = new ArrayList<>();
        for (int i = 0; i < n; i++) rev.add(new ArrayList<>());
        int[] out = new int[n];
        for (int u = 0; u < n; u++) { out[u] = graph[u].length; for (int v : graph[u]) rev.get(v).add(u); }
        ArrayDeque<Integer> q = new ArrayDeque<>();
        for (int u = 0; u < n; u++) if (out[u] == 0) q.add(u);
        boolean[] safe = new boolean[n];
        while (!q.isEmpty()) {
            int v = q.poll();
            safe[v] = true;
            for (int u : rev.get(v)) if (--out[u] == 0) q.add(u);
        }
        List<Integer> res = new ArrayList<>();
        for (int u = 0; u < n; u++) if (safe[u]) res.add(u);
        return res;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(eventualSafeNodes(new int[][]{{1, 2}, {2, 3}, {5}, {0}, {5}, {}, {}}));
        System.out.println(eventualSafeNodes(new int[][]{{1, 2, 3, 4}, {1, 2}, {3, 4}, {0, 4}, {}}));
        System.out.println(eventualSafeNodes(new int[][]{{0}}));
    }
}
