import java.util.*;

public class Pacific {
    // #region giai
    static List<List<Integer>> pacificAtlantic(int[][] h) {
        int R = h.length, C = h[0].length;
        List<int[]> pac = new ArrayList<>(), atl = new ArrayList<>();
        for (int r = 0; r < R; r++) { pac.add(new int[]{r, 0}); atl.add(new int[]{r, C - 1}); }
        for (int c = 0; c < C; c++) { pac.add(new int[]{0, c}); atl.add(new int[]{R - 1, c}); }
        boolean[][] P = climb(h, pac), A = climb(h, atl);
        List<List<Integer>> out = new ArrayList<>();
        for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) if (P[r][c] && A[r][c]) out.add(List.of(r, c));
        return out;
    }
    static boolean[][] climb(int[][] h, List<int[]> starts) {
        int R = h.length, C = h[0].length;
        boolean[][] seen = new boolean[R][C];
        ArrayDeque<int[]> q = new ArrayDeque<>();
        for (int[] s : starts) if (!seen[s[0]][s[1]]) { seen[s[0]][s[1]] = true; q.add(s); }
        int[][] D = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty()) {
            int[] cur = q.poll();
            for (int[] d : D) {
                int nr = cur[0] + d[0], nc = cur[1] + d[1];
                if (nr < 0 || nr >= R || nc < 0 || nc >= C || seen[nr][nc]) continue;
                if (h[nr][nc] < h[cur[0]][cur[1]]) continue;
                seen[nr][nc] = true; q.add(new int[]{nr, nc});
            }
        }
        return seen;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(pacificAtlantic(new int[][]{{1, 2, 2, 3, 5}, {3, 2, 3, 4, 4}, {2, 4, 5, 3, 1}, {6, 7, 1, 4, 5}, {5, 1, 1, 2, 4}}));
        System.out.println(pacificAtlantic(new int[][]{{1}}));
        System.out.println(pacificAtlantic(new int[][]{{3, 3, 3}, {3, 1, 3}, {3, 3, 3}}));
    }
}
