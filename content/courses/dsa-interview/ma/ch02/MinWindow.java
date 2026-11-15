// LC 76 · Minimum Window Substring — need counts + missing counter.
public class MinWindow {
    // #region window
    static String minWindow(String s, String t) {
        int[] need = new int[128];
        for (char c : t.toCharArray()) need[c]++;
        int missing = t.length();
        int l = 0, bestL = 0, bestLen = Integer.MAX_VALUE;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            if (need[c] > 0) missing--;
            need[c]--;
            while (missing == 0) {
                if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestL = l; }
                char d = s.charAt(l);
                need[d]++;
                if (need[d] > 0) missing++;
                l++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestL, bestL + bestLen);
    }
    // #endregion

    public static void main(String[] args) {
        String[][] tests = {{"ADOBECODEBANC", "ABC"}, {"a", "a"}, {"a", "aa"}, {"aaflslflsldkalskaaa", "aaa"}};
        for (String[] x : tests)
            System.out.println("minWindow(\"" + x[0] + "\", \"" + x[1] + "\") = \"" + minWindow(x[0], x[1]) + "\"");
    }
}
