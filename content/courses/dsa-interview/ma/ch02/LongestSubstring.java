import java.util.*;

// LC 3 · Longest Substring Without Repeating Characters.
public class LongestSubstring {
    // #region brute
    static int lengthBrute(String s) {
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            Set<Character> seen = new HashSet<>();
            for (int j = i; j < s.length() && !seen.contains(s.charAt(j)); j++) {
                seen.add(s.charAt(j));
                best = Math.max(best, j - i + 1);
            }
        }
        return best;
    }
    // #endregion

    // #region set
    static int lengthOfLongestSubstring(String s) {
        Set<Character> win = new HashSet<>();
        int l = 0, best = 0;
        for (int r = 0; r < s.length(); r++) {
            while (win.contains(s.charAt(r))) {
                win.remove(s.charAt(l));
                l++;
            }
            win.add(s.charAt(r));
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
    // #endregion

    // #region map
    static int lengthJump(String s) {
        int[] last = new int[128];              // ASCII per the constraints; -1 = not seen
        Arrays.fill(last, -1);
        int l = 0, best = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            if (last[c] >= 0) l = Math.max(l, last[c] + 1);
            last[c] = r;
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
    // #endregion

    // #region sai
    static int lengthJumpBuggy(String s) {
        int[] last = new int[128];
        Arrays.fill(last, -1);
        int l = 0, best = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            if (last[c] >= 0) l = last[c] + 1;
            last[c] = r;
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
    // #endregion

    public static void main(String[] args) {
        for (String s : new String[]{"abcabcbb", "bbbbb", "pwwkew", "", "abba", "tmmzuxt"})
            System.out.println("\"" + s + "\": set = " + lengthOfLongestSubstring(s) + ", jump = " + lengthJump(s)
                + ", brute = " + lengthBrute(s) + ", jump without max = " + lengthJumpBuggy(s));
    }
}
