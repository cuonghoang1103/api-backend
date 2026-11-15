import java.util.*;

public class BfsPreview {
    // #region giai
    static int shortestPathBinaryMatrix(int[][] g) {
        int n = g.length;
        if (g[0][0] == 1 || g[n - 1][n - 1] == 1) return -1;
        Deque<int[]> q = new ArrayDeque<>();
        q.offer(new int[]{0, 0, 1});
        g[0][0] = 1;
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            int r = cur[0], c = cur[1], d = cur[2];
            if (r == n - 1 && c == n - 1) return d;
            for (int dr = -1; dr <= 1; dr++) for (int dc = -1; dc <= 1; dc++) {
                int nr = r + dr, nc = c + dc;
                if (nr >= 0 && nc >= 0 && nr < n && nc < n && g[nr][nc] == 0) { g[nr][nc] = 1; q.offer(new int[]{nr, nc, d + 1}); }
            }
        }
        return -1;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(shortestPathBinaryMatrix(new int[][]{{0, 1}, {1, 0}}));
        System.out.println(shortestPathBinaryMatrix(new int[][]{{0, 0, 0}, {1, 1, 0}, {1, 1, 0}}));
        System.out.println(shortestPathBinaryMatrix(new int[][]{{1, 0, 0}, {1, 1, 0}, {1, 1, 0}}));
        System.out.println(shortestPathBinaryMatrix(new int[][]{{0, 0, 0, 0}, {1, 1, 1, 0}, {0, 0, 0, 0}, {0, 1, 1, 0}}));
    }
}
