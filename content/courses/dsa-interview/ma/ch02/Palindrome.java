// LC 125 · Valid Palindrome — two pointers from both ends, skipping non-alphanumerics.
public class Palindrome {
    // #region dung
    static boolean isAlnum(char c) {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
    }
    static boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !isAlnum(s.charAt(l))) l++;
            while (l < r && !isAlnum(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;
            l++; r--;
        }
        return true;
    }
    // #endregion

    public static void main(String[] args) {
        for (String s : new String[]{"A man, a plan, a canal: Panama", "race a car", " ", "0P", ".,", "ab_a"})
            System.out.println("isPalindrome(\"" + s + "\") = " + isPalindrome(s));
    }
}
