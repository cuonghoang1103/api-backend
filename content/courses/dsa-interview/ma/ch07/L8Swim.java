import java.util.*;

public class L8Swim {
    // #region giai
    static int swimInWater(int[][] grid) {
        int n = grid.length;
        int[][] best = new int[n][n];
        for (int[] row : best) Arrays.fill(row, Integer.MAX_VALUE);
        best[0][0] = grid[0][0];
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        pq.add(new int[]{grid[0][0], 0, 0});
        int[][] D = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int t = cur[0], r = cur[1], c = cur[2];
            if (t > best[r][c]) continue;
            if (r == n - 1 && c == n - 1) return t;
            for (int[] d : D) {
                int nr = r + d[0], nc = c + d[1];
                if (nr < 0 || nr >= n || nc < 0 || nc >= n) continue;
                int nt = Math.max(t, grid[nr][nc]);
                if (nt < best[nr][nc]) { best[nr][nc] = nt; pq.add(new int[]{nt, nr, nc}); }
            }
        }
        return -1;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(swimInWater(new int[][]{{0, 2}, {1, 3}}));
        System.out.println(swimInWater(new int[][]{{0, 1, 2, 3, 4}, {24, 23, 22, 21, 5}, {12, 13, 14, 15, 16}, {11, 17, 18, 19, 20}, {10, 9, 8, 7, 6}}));
        System.out.println(swimInWater(new int[][]{{3, 2}, {0, 1}}));
    }
}
