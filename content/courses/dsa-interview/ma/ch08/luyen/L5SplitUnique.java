import java.util.*;

// LC 1593 · Split a String Into the Max Number of Unique Substrings — partition + a Set + a bound.
public class L5SplitUnique {
    static int best;
    static long calls;

    // #region giai
    static int maxUniqueSplit(String s) {
        best = 0;
        bt(s, 0, new HashSet<>(), true);
        return best;
    }

    static void bt(String s, int start, Set<String> seen, boolean bound) {
        calls++;
        if (bound && seen.size() + (s.length() - start) <= best) return;
        if (start == s.length()) { best = Math.max(best, seen.size()); return; }
        for (int end = start + 1; end <= s.length(); end++) {
            String piece = s.substring(start, end);
            if (!seen.add(piece)) continue;          // add returns false if it was already there
            bt(s, end, seen, bound);
            seen.remove(piece);
        }
    }
    // #endregion

    public static void main(String[] args) {
        for (String s : new String[]{"ababccc", "aba", "aa", "wwwzfvedwfvhsww"}) System.out.println("\"" + s + "\" -> " + maxUniqueSplit(s));
        String big = "abcdefghijklmnop";
        best = 0; calls = 0; bt(big, 0, new HashSet<>(), false); long a = calls; int ans = best;
        best = 0; calls = 0; bt(big, 0, new HashSet<>(), true); long b = calls;
        System.out.println("\"" + big + "\": answer " + ans + " | calls without bound = " + a + " | with bound = " + b);
    }
}
