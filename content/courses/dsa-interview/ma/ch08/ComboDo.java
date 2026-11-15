import java.util.*;

// @thoi-gian
// Combination Sum in Java: A = no sort, reject on entry · B = sorted + continue · C = sorted + break.
public class ComboDo {
    static int[] a;
    static long calls, checks, answers;
    static char mode;

    static void bt(int start, int remain) {
        calls++;
        if (remain < 0) return;
        if (remain == 0) { answers++; return; }
        for (int i = start; i < a.length; i++) {
            checks++;
            if (mode != 'A' && a[i] > remain) { if (mode == 'C') break; continue; }
            bt(i, remain - a[i]);
        }
    }

    static void run(int[] cands, int target, char m) {
        mode = m;
        a = cands.clone();
        if (m != 'A') Arrays.sort(a);
        calls = 0; checks = 0; answers = 0;
        bt(0, target);
    }

    public static void main(String[] args) {
        int[] cands = new int[38];
        for (int i = 0; i < 38; i++) cands[i] = 40 - i;
        System.out.println("candidates = 40, 39, ..., 3 (38 numbers)");
        System.out.println("  T | answers |  mode | calls (nodes) | loop checks |      time");
        for (int T : new int[]{40, 60, 80}) {
            for (char m : new char[]{'A', 'B', 'C'}) {
                double best = Double.MAX_VALUE;
                for (int k = 0; k < 5; k++) {
                    long t = System.nanoTime();
                    run(cands, T, m);
                    best = Math.min(best, (System.nanoTime() - t) / 1e6);
                }
                System.out.printf("%3d | %7d | %5s | %,13d | %,11d | %6.1f ms%n", T, answers, m, calls, checks, best);
            }
        }
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
