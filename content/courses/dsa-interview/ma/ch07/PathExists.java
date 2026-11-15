import java.util.*;

public class PathExists {
    // #region giai
    static boolean validPath(int n, int[][] edges, int source, int destination) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        boolean[] seen = new boolean[n];
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(source);
        seen[source] = true;                   // mark when PUSHED
        while (!stack.isEmpty()) {
            int u = stack.pop();
            if (u == destination) return true;
            for (int v : adj.get(u)) {
                if (!seen[v]) { seen[v] = true; stack.push(v); }
            }
        }
        return false;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(validPath(3, new int[][]{{0, 1}, {1, 2}, {2, 0}}, 0, 2));
        System.out.println(validPath(6, new int[][]{{0, 1}, {0, 2}, {3, 5}, {5, 4}, {4, 3}}, 0, 5));
        System.out.println(validPath(1, new int[][]{}, 0, 0));
        System.out.println(validPath(5, new int[][]{{0, 1}, {1, 2}, {2, 3}, {3, 4}}, 4, 0));
    }
}
