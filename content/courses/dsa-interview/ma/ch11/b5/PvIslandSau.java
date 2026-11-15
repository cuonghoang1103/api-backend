// Cùng bẫy độ sâu trong Java: chạy DFS đệ quy trong một luồng có stack 1 MB (cỡ mặc định -Xss của JVM 64-bit),
// vì bộ chạy của khoá cố ý cho luồng main stack 64 MB. Lưới toàn đất N x N ⇒ độ sâu đệ quy tới N².
public class PvIslandSau {
    static int R, C;
    static boolean[][] land;
    static int maxDepth;

    static int area(int r, int c, int d) {
        if (r < 0 || r >= R || c < 0 || c >= C || !land[r][c]) return 0;
        land[r][c] = false;
        if (d > maxDepth) maxDepth = d;
        return 1 + area(r + 1, c, d + 1) + area(r - 1, c, d + 1) + area(r, c + 1, d + 1) + area(r, c - 1, d + 1);
    }

    static String run(int n) throws InterruptedException {
        final String[] out = new String[1];
        Thread t = new Thread(null, () -> {
            R = n; C = n; maxDepth = 0;
            land = new boolean[n][n];
            for (boolean[] row : land) java.util.Arrays.fill(row, true);
            try {
                int a = area(0, 0, 1);
                out[0] = a + " (max depth " + maxDepth + ")";
            } catch (StackOverflowError e) {
                out[0] = "StackOverflowError";
            }
        }, "dfs", 1L << 20);
        t.start();
        t.join();
        return out[0];
    }

    public static void main(String[] args) throws InterruptedException {
        for (int n : new int[]{50, 60, 300, 1000}) {
            System.out.println(n + "x" + n + " all land, 1 MB stack: recursive -> " + run(n));
        }
    }
}
