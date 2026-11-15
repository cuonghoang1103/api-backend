import java.util.*;

public class BieuDien {
    // #region ke
    static List<List<Integer>> buildAdj(int n, int[][] edges, boolean directed) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());     // n SEPARATE empty lists
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            if (!directed) adj.get(e[1]).add(e[0]);                // undirected = two arcs
        }
        return adj;
    }
    // #endregion

    // #region ma-tran
    static int[][] buildMatrix(int n, int[][] edges) {
        int[][] m = new int[n][n];                                 // Java zero-fills for you
        for (int[] e : edges) { m[e[0]][e[1]] = 1; m[e[1]][e[0]] = 1; }
        return m;
    }
    // #endregion

    public static void main(String[] args) {
        int n = 5;
        int[][] edges = {{0, 1}, {0, 2}, {1, 2}, {1, 3}, {3, 4}};
        System.out.println("edge list   : " + Arrays.deepToString(edges));
        List<List<Integer>> adj = buildAdj(n, edges, false);
        System.out.println("adj list    : " + adj);
        List<Integer> deg = new ArrayList<>();
        int sum = 0;
        for (List<Integer> a : adj) { deg.add(a.size()); sum += a.size(); }
        System.out.println("degree      : " + deg + "  sum = " + sum + " = 2·E");
        int[][] m = buildMatrix(n, edges);
        for (int i = 0; i < n; i++) System.out.println("matrix row " + i + ": " + Arrays.toString(m[i]));
        System.out.println("is 1-3 an edge? list: " + adj.get(1).contains(3) + "  matrix: " + (m[1][3] == 1));
        List<List<Integer>> d = buildAdj(n, edges, true);
        System.out.println("directed adj: " + d);
        int[] indeg = new int[n];
        for (int[] e : edges) indeg[e[1]]++;
        List<Integer> out = new ArrayList<>();
        for (List<Integer> a : d) out.add(a.size());
        System.out.println("out-degree  : " + out + "  in-degree: " + Arrays.toString(indeg));
    }
}
