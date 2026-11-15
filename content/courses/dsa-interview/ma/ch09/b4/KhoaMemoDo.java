// @thoi-gian
// Same memoised LCS, four ways to store the memo (Java): HashMap<String> · HashMap<Long> · int[][] · bottom-up table.
import java.util.*;

public class KhoaMemoDo {
    static String rand(int L, long seed) {
        long s = seed; StringBuilder sb = new StringBuilder();
        for (int k = 0; k < L; k++) { s = (s * 48271) % 2147483647L; sb.append("ACGT".charAt((int) (s % 4))); }
        return sb.toString();
    }
    static String A, B;
    static HashMap<String, Integer> ms;
    static int fs(int i, int j) {
        if (i == A.length() || j == B.length()) return 0;
        String k = i + "," + j;
        Integer hit = ms.get(k);
        if (hit != null) return hit;
        int v = A.charAt(i) == B.charAt(j) ? 1 + fs(i + 1, j + 1) : Math.max(fs(i + 1, j), fs(i, j + 1));
        ms.put(k, v);
        return v;
    }
    static HashMap<Long, Integer> ml;
    static int fl(int i, int j) {
        if (i == A.length() || j == B.length()) return 0;
        long k = (long) i * (B.length() + 1) + j;
        Integer hit = ml.get(k);
        if (hit != null) return hit;
        int v = A.charAt(i) == B.charAt(j) ? 1 + fl(i + 1, j + 1) : Math.max(fl(i + 1, j), fl(i, j + 1));
        ml.put(k, v);
        return v;
    }
    static int[][] ma;
    static int fa(int i, int j) {
        if (i == A.length() || j == B.length()) return 0;
        if (ma[i][j] != -1) return ma[i][j];
        int v = A.charAt(i) == B.charAt(j) ? 1 + fa(i + 1, j + 1) : Math.max(fa(i + 1, j), fa(i, j + 1));
        return ma[i][j] = v;
    }
    static int table(String a, String b) {
        int n = a.length(), m = b.length();
        int[] next = new int[m + 1], cur = new int[m + 1];
        for (int i = n - 1; i >= 0; i--) {
            for (int j = m - 1; j >= 0; j--) cur[j] = a.charAt(i) == b.charAt(j) ? 1 + next[j + 1] : Math.max(next[j], cur[j + 1]);
            int[] t = next; next = cur; cur = t;
        }
        return next[0];
    }
    interface Job { int run(); }
    static double[] best(Job f, int lap) {
        double t = Double.MAX_VALUE; int v = 0;
        for (int k = 0; k < lap; k++) { long s = System.nanoTime(); v = f.run(); t = Math.min(t, (System.nanoTime() - s) / 1e6); }
        return new double[]{t, v};
    }
    public static void main(String[] args) {
        System.out.printf("%5s | %9s | %15s | %13s | %9s | %9s | LCS%n", "L", "states", "HashMap<String>", "HashMap<Long>", "int[][]", "table");
        for (int L : new int[]{250, 500, 1000}) {
            A = rand(L, 7); B = rand(L, 11);
            double[] r1 = best(() -> { ms = new HashMap<>(); return fs(0, 0); }, 3);
            double[] r2 = best(() -> { ml = new HashMap<>(); return fl(0, 0); }, 3);
            double[] r3 = best(() -> { ma = new int[A.length() + 1][B.length() + 1]; for (int[] row : ma) Arrays.fill(row, -1); return fa(0, 0); }, 3);
            double[] r4 = best(() -> table(A, B), 3);
            if (r1[1] != r2[1] || r2[1] != r3[1] || r3[1] != r4[1]) throw new IllegalStateException("versions disagree");
            System.out.printf("%5d | %9s | %15s | %13s | %9s | %9s | %d%n", L, String.format("%,d", (L + 1) * (L + 1)),
                String.format("%.1f ms", r1[0]), String.format("%.1f ms", r2[0]), String.format("%.1f ms", r3[0]), String.format("%.1f ms", r4[0]), (int) r1[1]);
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
