import java.util.*;

public class Luoi {
    // #region huong
    static final int[][] DIR4 = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    static final int[][] DIR8 = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}, {1, 1}, {1, -1}, {-1, 1}, {-1, -1}};

    static List<int[]> neighbours(int[][] grid, int r, int c, int[][] dirs) {
        List<int[]> out = new ArrayList<>();
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) out.add(new int[]{nr, nc});
        }
        return out;
    }
    // #endregion

    // #region chu-vi
    static int islandPerimeter(int[][] grid) {
        int p = 0;
        for (int r = 0; r < grid.length; r++)
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] != 1) continue;
                for (int[] d : DIR4) {
                    int nr = r + d[0], nc = c + d[1];
                    boolean water = nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length || grid[nr][nc] == 0;
                    if (water) p++;
                }
            }
        return p;
    }
    // #endregion

    static String show(List<int[]> cells) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < cells.size(); i++) sb.append(i > 0 ? "," : "").append(Arrays.toString(cells.get(i)));
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        int[][] g = new int[3][3];
        System.out.println("4-dir neighbours of (0,0): " + show(neighbours(g, 0, 0, DIR4)));
        System.out.println("8-dir neighbours of (0,0): " + show(neighbours(g, 0, 0, DIR8)));
        System.out.println("8-dir neighbours of (1,1): " + neighbours(g, 1, 1, DIR8).size());
        int cols = 3;
        System.out.println("cell (2,1) as a node id r*cols+c = " + (2 * cols + 1) + "  back: r = " + (7 / cols) + " c = " + (7 % cols));
        System.out.println("perimeter = " + islandPerimeter(new int[][]{{0, 1, 0, 0}, {1, 1, 1, 0}, {0, 1, 0, 0}, {1, 1, 0, 0}}));
        System.out.println("perimeter = " + islandPerimeter(new int[][]{{1}}));
        System.out.println("perimeter = " + islandPerimeter(new int[][]{{1, 0}}));
    }
}
