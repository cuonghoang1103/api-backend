import java.util.*;

// LC 131 · Palindrome Partitioning — the choice at each level is "where does the next piece end?"
public class PalindromePartition {
    // #region partition
    static List<List<String>> partition(String s) {
        int n = s.length();
        boolean[][] pal = new boolean[n][n];
        for (int i = n - 1; i >= 0; i--)
            for (int j = i; j < n; j++)
                pal[i][j] = s.charAt(i) == s.charAt(j) && (j - i < 2 || pal[i + 1][j - 1]);
        List<List<String>> res = new ArrayList<>();
        bt(s, 0, pal, new ArrayList<>(), res);
        return res;
    }

    static void bt(String s, int start, boolean[][] pal, List<String> path, List<List<String>> res) {
        if (start == s.length()) { res.add(new ArrayList<>(path)); return; }
        for (int end = start; end < s.length(); end++) {
            if (!pal[start][end]) continue;
            path.add(s.substring(start, end + 1));
            bt(s, end + 1, pal, path, res);
            path.remove(path.size() - 1);
        }
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("partition(\"aab\")  = " + partition("aab"));
        System.out.println("partition(\"a\")    = " + partition("a"));
        System.out.println("partition(\"abba\") = " + partition("abba"));
        System.out.println("partition(\"aaaaaaaaaaaaaaaa\") has " + partition("aaaaaaaaaaaaaaaa").size() + " partitions (2^15 = 32768)");
    }
}
