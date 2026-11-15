import java.util.*;

public class L2MaxArea {
    // #region giai
    static int maxAreaOfIsland(int[][] grid) {
        int R = grid.length, C = grid[0].length, best = 0;
        int[][] D = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int r0 = 0; r0 < R; r0++)
            for (int c0 = 0; c0 < C; c0++) {
                if (grid[r0][c0] != 1) continue;
                int area = 0;
                Deque<int[]> stack = new ArrayDeque<>();
                stack.push(new int[]{r0, c0});
                grid[r0][c0] = 0;
                while (!stack.isEmpty()) {
                    int[] cur = stack.pop();
                    area++;
                    for (int[] d : D) {
                        int nr = cur[0] + d[0], nc = cur[1] + d[1];
                        if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] == 1) { grid[nr][nc] = 0; stack.push(new int[]{nr, nc}); }
                    }
                }
                best = Math.max(best, area);
            }
        return best;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(maxAreaOfIsland(new int[][]{{1, 1, 0, 0, 0}, {1, 1, 0, 0, 0}, {0, 0, 0, 1, 1}, {0, 0, 0, 1, 1}}));
        System.out.println(maxAreaOfIsland(new int[][]{{0, 1, 1}, {1, 1, 0}, {0, 0, 1}}));
        System.out.println(maxAreaOfIsland(new int[][]{{0, 0, 0, 0}}));
    }
}
