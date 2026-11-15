import java.util.*;

public class Bay2Mau {
    static List<List<Integer>> build(int n, int[][] edges) {
        List<List<Integer>> out = new ArrayList<>();
        for (int i = 0; i < n; i++) out.add(new ArrayList<>());
        for (int[] e : edges) out.get(e[0]).add(e[1]);
        return out;
    }
    static boolean wrong(List<List<Integer>> out, int u, boolean[] visited) {
        if (visited[u]) return true;
        visited[u] = true;
        for (int v : out.get(u)) if (wrong(out, v, visited)) return true;
        return false;
    }
    static boolean right(List<List<Integer>> out, int u, int[] color) {
        color[u] = 1;
        for (int v : out.get(u)) {
            if (color[v] == 1) return true;
            if (color[v] == 0 && right(out, v, color)) return true;
        }
        color[u] = 2;
        return false;
    }
    static boolean hasCycleWrong(int n, int[][] e) {
        List<List<Integer>> out = build(n, e); boolean[] vis = new boolean[n];
        for (int u = 0; u < n; u++) if (!vis[u] && wrong(out, u, vis)) return true;
        return false;
    }
    static boolean hasCycleRight(int n, int[][] e) {
        List<List<Integer>> out = build(n, e); int[] color = new int[n];
        for (int u = 0; u < n; u++) if (color[u] == 0 && right(out, u, color)) return true;
        return false;
    }
    public static void main(String[] args) {
        int[][] diamond = {{0, 1}, {0, 2}, {1, 3}, {2, 3}}, ring = {{0, 1}, {1, 2}, {2, 0}};
        System.out.println("diamond: two-colour says " + hasCycleWrong(4, diamond) + " | three-colour says " + hasCycleRight(4, diamond));
        System.out.println("ring   : two-colour says " + hasCycleWrong(3, ring) + " | three-colour says " + hasCycleRight(3, ring));
    }
}
