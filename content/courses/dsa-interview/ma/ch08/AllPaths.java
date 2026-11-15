import java.util.*;

// LC 797 · All Paths From Source to Target — every route through a menu, from "Home" to one page.
public class AllPaths {
    // #region all-paths
    static List<List<Integer>> allPathsSourceTarget(int[][] graph) {
        List<List<Integer>> res = new ArrayList<>();
        List<Integer> path = new ArrayList<>(List.of(0));
        dfs(graph, 0, path, res);
        return res;
    }

    static void dfs(int[][] graph, int u, List<Integer> path, List<List<Integer>> res) {
        if (u == graph.length - 1) { res.add(new ArrayList<>(path)); return; }
        for (int v : graph[u]) {
            path.add(v);
            dfs(graph, v, path, res);
            path.remove(path.size() - 1);
        }
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(allPathsSourceTarget(new int[][]{{1, 2}, {3}, {3}, {}}));
        System.out.println(allPathsSourceTarget(new int[][]{{4, 3, 1}, {3, 2, 4}, {3}, {4}, {}}));
        String[] names = {"Home", "Courses", "Academy", "Programming", "Back-end", "SDN302", "Node.js"};
        int[][] menu = {{1, 2}, {3, 4}, {5}, {6}, {6}, {6}, {}};
        List<List<Integer>> routes = allPathsSourceTarget(menu);
        System.out.println(routes.size() + " routes to \"" + names[6] + "\":");
        for (List<Integer> r : routes) {
            StringBuilder sb = new StringBuilder();
            for (int k = 0; k < r.size(); k++) sb.append(k == 0 ? "" : " > ").append(names[r.get(k)]);
            System.out.println("  " + sb);
        }
    }
}
