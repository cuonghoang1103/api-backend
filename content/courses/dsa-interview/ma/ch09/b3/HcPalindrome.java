// LC 5 Longest Palindromic Substring: table filled by LENGTH (diagonals), then expand-around-centre in O(1) memory.
public class HcPalindrome {
    // #region bang
    static String longestPalindromeTable(String s) {
        int n = s.length();
        if (n == 0) return "";
        boolean[][] is = new boolean[n][n];
        int bi = 0, bj = 0;
        for (int len = 1; len <= n; len++)
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;
                is[i][j] = s.charAt(i) == s.charAt(j) && (len <= 2 || is[i + 1][j - 1]);
                if (is[i][j] && len > bj - bi + 1) { bi = i; bj = j; }
            }
        return s.substring(bi, bj + 1);
    }
    // #endregion

    // #region tam
    static int bi, bj;
    static void expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
        if (r - l - 1 > bj - bi + 1) { bi = l + 1; bj = r - 1; }
    }
    static String longestPalindrome(String s) {
        bi = 0; bj = -1;
        for (int c = 0; c < s.length(); c++) { expand(s, c, c); expand(s, c, c + 1); }
        return s.substring(bi, bj + 1);
    }
    // #endregion

    public static void main(String[] args) {
        for (String s : new String[]{"cabbad", "babad", "racecar", "a", "ab", "abacdfgdcaba"})
            System.out.println("\"" + s + "\": table = \"" + longestPalindromeTable(s) + "\"  centre = \"" + longestPalindrome(s) + "\"");
    }
}
