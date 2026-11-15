public class L1RemoveAdjacent {
    // #region giai
    static String removeDuplicates(String s) {
        StringBuilder sb = new StringBuilder();             // a StringBuilder is a perfectly good char stack
        for (char c : s.toCharArray()) {
            int n = sb.length();
            if (n > 0 && sb.charAt(n - 1) == c) sb.deleteCharAt(n - 1);
            else sb.append(c);
        }
        return sb.toString();
    }
    // #endregion

    public static void main(String[] args) {
        for (String s : new String[]{"abbaca", "azxxzy", "aaaa", "aaa", "abc"}) System.out.println(s + " -> \"" + removeDuplicates(s) + "\"");
    }
}
