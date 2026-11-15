import java.util.*;

// LC 1423 · Maximum Points You Can Obtain from Cards — brute force, slide-from-left-to-right O(k), the
// "window we leave behind" view, and the greedy rule that looks right but is wrong.
public class PvCards {
    // #region vet-can
    static int maxScoreBrute(int[] cards, int k) { return go(cards, 0, cards.length - 1, k); }
    static int go(int[] c, int l, int r, int left) {
        if (left == 0) return 0;
        return Math.max(c[l] + go(c, l + 1, r, left - 1), c[r] + go(c, l, r - 1, left - 1));
    }
    // #endregion

    // #region truot
    static int maxScore(int[] cards, int k) {
        int n = cards.length, sum = 0;
        for (int i = 0; i < k; i++) sum += cards[i];
        int best = sum;
        for (int i = 1; i <= k; i++) {
            sum += cards[n - i] - cards[k - i];
            best = Math.max(best, sum);
        }
        return best;
    }
    // #endregion

    // #region cua-so-bo-lai
    static int maxScoreWindow(int[] cards, int k) {
        int n = cards.length, w = n - k, total = 0;
        for (int c : cards) total += c;
        if (w == 0) return total;
        int win = 0;
        for (int i = 0; i < w; i++) win += cards[i];
        int minWin = win;
        for (int i = w; i < n; i++) {
            win += cards[i] - cards[i - w];
            minWin = Math.min(minWin, win);
        }
        return total - minWin;
    }
    // #endregion

    // #region tham-lam-sai
    static int maxScoreGreedyWrong(int[] cards, int k) {
        int l = 0, r = cards.length - 1, s = 0;
        for (int t = 0; t < k; t++) s += cards[l] >= cards[r] ? cards[l++] : cards[r--];
        return s;
    }
    // #endregion

    static long seed = 12345;
    static int rnd(int m) {
        seed = (seed * 1103515245L + 12345L) & 0xFFFFFFFFL;   // same 32-bit LCG as the TS file
        return (int) ((seed >>> 8) % m);
    }

    public static void main(String[] args) {
        int[][] cs = {{1, 2, 3, 4, 5, 6, 1}, {2, 2, 2}, {9, 7, 7, 9, 7, 7, 9}, {1, 1000, 1}, {1, 79, 80, 1, 1, 1, 200, 1}, {5},
            {1, 100, 1, 1, 1, 2}};
        int[] ks = {3, 2, 7, 1, 3, 1, 2};
        for (int t = 0; t < cs.length; t++) {
            int[] c = cs[t];
            int k = ks[t];
            System.out.println(Arrays.toString(c) + " k=" + k + " -> slide=" + maxScore(c, k) + " window=" + maxScoreWindow(c, k)
                + " brute=" + maxScoreBrute(c, k) + " greedy=" + maxScoreGreedyWrong(c, k));
        }
        int ok = 0, greedyWrong = 0;
        for (int t = 0; t < 300; t++) {
            int n = 1 + rnd(12);
            int[] c = new int[n];
            for (int i = 0; i < n; i++) c[i] = 1 + rnd(50);
            int k = 1 + rnd(n);
            int b = maxScoreBrute(c, k);
            if (maxScore(c, k) == b && maxScoreWindow(c, k) == b) ok++;
            if (maxScoreGreedyWrong(c, k) != b) greedyWrong++;
        }
        System.out.println("random: " + ok + "/300 match brute force; greedy wrong on " + greedyWrong + "/300");
    }
}
