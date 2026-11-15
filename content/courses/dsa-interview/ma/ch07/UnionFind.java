import java.util.*;

public class UnionFind {
    // #region dsu
    static class DSU {
        int[] parent, size;
        int sets;
        DSU(int n) {
            parent = new int[n]; size = new int[n]; sets = n;
            for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
        }
        int find(int x) {
            int root = x;
            while (parent[root] != root) root = parent[root];
            while (parent[x] != root) { int nx = parent[x]; parent[x] = root; x = nx; }
            return root;
        }
        boolean union(int a, int b) {
            int ra = find(a), rb = find(b);
            if (ra == rb) return false;
            if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }
            parent[rb] = ra;
            size[ra] += size[rb];
            sets--;
            return true;
        }
    }
    // #endregion

    // #region provinces
    static int findCircleNum(int[][] isConnected) {
        DSU d = new DSU(isConnected.length);
        for (int i = 0; i < isConnected.length; i++)
            for (int j = i + 1; j < isConnected.length; j++) if (isConnected[i][j] == 1) d.union(i, j);
        return d.sets;
    }
    // #endregion

    // #region redundant
    static int[] findRedundantConnection(int[][] edges) {
        DSU d = new DSU(edges.length + 1);
        for (int[] e : edges) if (!d.union(e[0], e[1])) return e;
        return new int[0];
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(findCircleNum(new int[][]{{1, 1, 0}, {1, 1, 0}, {0, 0, 1}}) + " " + findCircleNum(new int[][]{{1, 0, 0}, {0, 1, 0}, {0, 0, 1}}));
        System.out.println(Arrays.toString(findRedundantConnection(new int[][]{{1, 2}, {1, 3}, {2, 3}})) + " "
            + Arrays.toString(findRedundantConnection(new int[][]{{1, 2}, {2, 3}, {3, 4}, {1, 4}, {1, 5}})));
    }
}
