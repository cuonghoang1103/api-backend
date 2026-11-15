import java.util.*;

public class Dfs3Mau {
    static final int WHITE = 0, GRAY = 1, BLACK = 2;
    static List<List<Integer>> out;
    static int[] color;
    static List<Integer> path, finished, cycle;

    // #region dfs3
    static String topoDfs(int n, int[][] edges) {
        out = new ArrayList<>();
        for (int i = 0; i < n; i++) out.add(new ArrayList<>());
        for (int[] e : edges) out.get(e[0]).add(e[1]);
        color = new int[n];
        path = new ArrayList<>(); finished = new ArrayList<>(); cycle = null;
        for (int u = 0; u < n && cycle == null; u++) if (color[u] == WHITE) visit(u);
        if (cycle != null) return "{cycle:" + cycle + "}";
        Collections.reverse(finished);
        return "{order:" + finished + "}";
    }
    static void visit(int u) {
        color[u] = GRAY; path.add(u);
        for (int v : out.get(u)) {
            if (cycle != null) return;
            if (color[v] == GRAY) {                       // back edge: v is on the current path
                cycle = new ArrayList<>(path.subList(path.indexOf(v), path.size()));
                cycle.add(v);
                return;
            }
            if (color[v] == WHITE) visit(v);
        }
        color[u] = BLACK; path.remove(path.size() - 1);
        finished.add(u);
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(topoDfs(4, new int[][]{{0, 1}, {0, 2}, {1, 3}, {2, 3}}));
        System.out.println(topoDfs(5, new int[][]{{0, 1}, {1, 2}, {2, 3}, {3, 1}, {0, 4}}));
        System.out.println(topoDfs(3, new int[][]{{2, 1}, {1, 0}}));
    }
}
