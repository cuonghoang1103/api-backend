import java.util.*;

// LC 438 · Find All Anagrams in a String — fixed window with 26 counts.
public class FindAnagrams {
    // #region giai
    static List<Integer> findAnagrams(String s, String p) {
        int m = p.length();
        List<Integer> res = new ArrayList<>();
        if (m > s.length()) return res;
        int[] need = new int[26], win = new int[26];
        for (char c : p.toCharArray()) need[c - 'a']++;
        for (int r = 0; r < s.length(); r++) {
            win[s.charAt(r) - 'a']++;
            if (r >= m) win[s.charAt(r - m) - 'a']--;
            if (r >= m - 1 && Arrays.equals(need, win)) res.add(r - m + 1);
        }
        return res;
    }
    // #endregion

    public static void main(String[] args) {
        String[][] tests = {{"cbaebabacd", "abc"}, {"abab", "ab"}, {"a", "ab"}, {"aaaaa", "aa"}};
        for (String[] x : tests)
            System.out.println("findAnagrams(\"" + x[0] + "\", \"" + x[1] + "\") = " + findAnagrams(x[0], x[1]));
    }
}
