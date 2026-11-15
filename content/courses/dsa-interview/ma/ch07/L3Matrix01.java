import java.util.*;

public class L3Matrix01 {
    // #region giai
    static int[][] updateMatrix(int[][] mat) {
        int R = mat.length, C = mat[0].length;
        int[][] dist = new int[R][C];
        ArrayDeque<int[]> q = new ArrayDeque<>();
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++) {
                dist[r][c] = -1;
                if (mat[r][c] == 0) { dist[r][c] = 0; q.add(new int[]{r, c}); }
            }
        int[][] D = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            for (int[] d : D) {
                int nr = cur[0] + d[0], nc = cur[1] + d[1];
                if (nr >= 0 && nr < R && nc >= 0 && nc < C && dist[nr][nc] == -1) {
                    dist[nr][nc] = dist[cur[0]][cur[1]] + 1;
                    q.add(new int[]{nr, nc});
                }
            }
        }
        return dist;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(Arrays.deepToString(updateMatrix(new int[][]{{0, 0, 0}, {0, 1, 0}, {0, 0, 0}})));
        System.out.println(Arrays.deepToString(updateMatrix(new int[][]{{0, 0, 0}, {0, 1, 0}, {1, 1, 1}})));
        System.out.println(Arrays.deepToString(updateMatrix(new int[][]{{1, 1, 1, 1, 0}})));
    }
}
