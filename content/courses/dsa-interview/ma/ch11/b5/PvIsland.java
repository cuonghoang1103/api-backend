import java.util.*;

// LC 695 · Max Area of Island — recursive DFS and the explicit-stack version.
public class PvIsland {
    // #region dfs-de-quy
    static int R, C;
    static int[][] g;

    static int maxAreaRecursive(int[][] grid) {
        R = grid.length; C = grid[0].length;
        g = new int[R][];
        for (int r = 0; r < R; r++) g[r] = grid[r].clone();    // copy: do not mutate the caller's grid
        int best = 0;
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                if (g[r][c] == 1) best = Math.max(best, area(r, c));
        return best;
    }

    static int area(int r, int c) {
        if (r < 0 || r >= R || c < 0 || c >= C || g[r][c] != 1) return 0;
        g[r][c] = 0;
        return 1 + area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1);
    }
    // #endregion

    // #region dfs-ngan-xep
    static int maxAreaIterative(int[][] grid) {
        int R = grid.length, C = grid[0].length;
        int[][] g = new int[R][];
        for (int r = 0; r < R; r++) g[r] = grid[r].clone();
        int[] DR = {1, -1, 0, 0}, DC = {0, 0, 1, -1};
        int best = 0;
        Deque<Integer> stack = new ArrayDeque<>();
        for (int r0 = 0; r0 < R; r0++) {
            for (int c0 = 0; c0 < C; c0++) {
                if (g[r0][c0] != 1) continue;
                g[r0][c0] = 0;
                stack.push(r0 * C + c0);
                int size = 0;
                while (!stack.isEmpty()) {
                    int cell = stack.pop();
                    size++;
                    int r = cell / C, c = cell % C;
                    for (int d = 0; d < 4; d++) {
                        int nr = r + DR[d], nc = c + DC[d];
                        if (nr >= 0 && nr < R && nc >= 0 && nc < C && g[nr][nc] == 1) {
                            g[nr][nc] = 0;
                            stack.push(nr * C + nc);
                        }
                    }
                }
                best = Math.max(best, size);
            }
        }
        return best;
    }
    // #endregion

    static String show(int[][] g) {
        StringBuilder sb = new StringBuilder("[");
        for (int r = 0; r < g.length; r++) sb.append(r > 0 ? "," : "").append(Arrays.toString(g[r]));
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        int[][][] grids = {
            {{1, 1, 0, 0, 0}, {1, 1, 0, 1, 1}, {0, 0, 0, 1, 0}, {0, 1, 0, 1, 1}},
            {{0, 0, 0}, {0, 0, 0}},
            {{1}},
            {{1, 0, 1}, {0, 1, 0}, {1, 0, 1}},
            {{1, 1, 1}, {1, 0, 1}, {1, 1, 1}},
        };
        for (int[][] gr : grids) {
            System.out.println(show(gr) + " -> recursive=" + maxAreaRecursive(gr) + " iterative=" + maxAreaIterative(gr));
        }
        int[][] full = new int[50][50];
        for (int[] row : full) Arrays.fill(row, 1);
        System.out.println("50x50 all land -> recursive=" + maxAreaRecursive(full) + " iterative=" + maxAreaIterative(full));
    }
}
