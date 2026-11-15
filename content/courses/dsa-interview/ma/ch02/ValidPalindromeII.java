// LC 680 · Valid Palindrome II — try deleting either side at the first mismatch.
public class ValidPalindromeII {
    // #region giai
    static boolean isPal(String s, int l, int r) {
        while (l < r) { if (s.charAt(l) != s.charAt(r)) return false; l++; r--; }
        return true;
    }
    static boolean validPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            if (s.charAt(l) != s.charAt(r)) return isPal(s, l + 1, r) || isPal(s, l, r - 1);
            l++; r--;
        }
        return true;
    }
    // #endregion

    // #region sai
    static boolean validPalindromeLeftOnly(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            if (s.charAt(l) != s.charAt(r)) return isPal(s, l + 1, r);
            l++; r--;
        }
        return true;
    }
    // #endregion

    public static void main(String[] args) {
        for (String s : new String[]{"aba", "abca", "abc", "cbbcc", "a", "deeee"})
            System.out.println("validPalindrome(\"" + s + "\") = " + validPalindrome(s) + "   left-only = " + validPalindromeLeftOnly(s));
    }
}
