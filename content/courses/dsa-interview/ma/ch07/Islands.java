import java.util.*;

public class Islands {
    // #region dfs
    static int numIslandsDfs(char[][] grid) {
        int islands = 0;
        for (int r = 0; r < grid.length; r++)
            for (int c = 0; c < grid[0].length; c++)
                if (grid[r][c] == '1') { islands++; sink(grid, r, c); }
        return islands;
    }
    static void sink(char[][] g, int r, int c) {
        if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] != '1') return;
        g[r][c] = '0';
        sink(g, r + 1, c); sink(g, r - 1, c); sink(g, r, c + 1); sink(g, r, c - 1);
    }
    // #endregion

    // #region bfs
    static int numIslandsBfs(char[][] grid) {
        int R = grid.length, C = grid[0].length, islands = 0;
        int[][] D = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int r0 = 0; r0 < R; r0++)
            for (int c0 = 0; c0 < C; c0++) {
                if (grid[r0][c0] != '1') continue;
                islands++;
                grid[r0][c0] = '0';
                ArrayDeque<Integer> q = new ArrayDeque<>();
                q.add(r0 * C + c0);
                while (!q.isEmpty()) {
                    int cell = q.poll(), r = cell / C, c = cell % C;
                    for (int[] d : D) {
                        int nr = r + d[0], nc = c + d[1];
                        if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] == '1') {
                            grid[nr][nc] = '0';
                            q.add(nr * C + nc);
                        }
                    }
                }
            }
        return islands;
    }
    // #endregion

    static char[][] parse(String[] g) {
        char[][] a = new char[g.length][];
        for (int i = 0; i < g.length; i++) a[i] = g[i].toCharArray();
        return a;
    }

    public static void main(String[] args) {
        String[][] grids = {
            {"11110", "11010", "11000", "00000"},
            {"11000", "11000", "00100", "00011"},
            {"101", "010", "101"},
            {"0"},
        };
        for (String[] g : grids) {
            System.out.println(Arrays.toString(g) + " -> dfs " + numIslandsDfs(parse(g)) + ", bfs " + numIslandsBfs(parse(g)));
        }
    }
}
