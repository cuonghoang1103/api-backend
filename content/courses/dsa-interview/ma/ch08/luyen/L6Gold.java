// LC 1219 · Path with Maximum Gold — Word Search's grid DFS, but we want the BEST path, not any path.
public class L6Gold {
    // #region giai
    static int getMaximumGold(int[][] grid) {
        int ans = 0;
        for (int r = 0; r < grid.length; r++)
            for (int c = 0; c < grid[0].length; c++)
                if (grid[r][c] > 0) ans = Math.max(ans, dfs(grid, r, c));
        return ans;
    }

    static int dfs(int[][] g, int r, int c) {
        if (r < 0 || c < 0 || r == g.length || c == g[0].length || g[r][c] == 0) return 0;
        int v = g[r][c];
        g[r][c] = 0;
        int best = Math.max(Math.max(dfs(g, r + 1, c), dfs(g, r - 1, c)), Math.max(dfs(g, r, c + 1), dfs(g, r, c - 1)));
        g[r][c] = v;
        return v + best;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(getMaximumGold(new int[][]{{0, 6, 0}, {5, 8, 7}, {0, 9, 0}}));
        System.out.println(getMaximumGold(new int[][]{{1, 0, 7}, {2, 0, 6}, {3, 4, 5}, {0, 3, 0}, {9, 0, 20}}));
        System.out.println(getMaximumGold(new int[][]{{0, 0}, {0, 0}}));
    }
}
