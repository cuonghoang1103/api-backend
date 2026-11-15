import java.util.*;

// LC 22 · Generate Parentheses (prune by counts) and LC 17 · Letter Combinations (a cartesian product).
public class NgoacChu {
    // #region parens
    static List<String> generateParenthesis(int n) {
        List<String> res = new ArrayList<>();
        bt(n, 0, 0, new StringBuilder(), res);
        return res;
    }

    static void bt(int n, int open, int close, StringBuilder path, List<String> res) {
        if (path.length() == 2 * n) { res.add(path.toString()); return; }
        if (open < n) { path.append('('); bt(n, open + 1, close, path, res); path.deleteCharAt(path.length() - 1); }
        if (close < open) { path.append(')'); bt(n, open, close + 1, path, res); path.deleteCharAt(path.length() - 1); }
    }
    // #endregion

    // #region letters
    static final String[] PHONE = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};

    static List<String> letterCombinations(String digits) {
        List<String> res = new ArrayList<>();
        if (digits.isEmpty()) return res;
        letters(digits, 0, new StringBuilder(), res);
        return res;
    }

    static void letters(String digits, int i, StringBuilder path, List<String> res) {
        if (i == digits.length()) { res.add(path.toString()); return; }
        for (char ch : PHONE[digits.charAt(i) - '0'].toCharArray()) {
            path.append(ch);
            letters(digits, i + 1, path, res);
            path.deleteCharAt(path.length() - 1);
        }
    }
    // #endregion

    static long nodes;
    static void naive(int n, int len) { nodes++; if (len == 2 * n) return; naive(n, len + 1); naive(n, len + 1); }
    static void pruned(int n, int open, int close) {
        nodes++;
        if (open + close == 2 * n) return;
        if (open < n) pruned(n, open + 1, close);
        if (close < open) pruned(n, open, close + 1);
    }

    public static void main(String[] args) {
        System.out.println("generateParenthesis(3) = " + generateParenthesis(3));
        System.out.println("letterCombinations(\"23\") = " + letterCombinations("23"));
        System.out.println("letterCombinations(\"\") = " + letterCombinations(""));
        System.out.println("letterCombinations(\"79\") has " + letterCombinations("79").size() + " strings (4 * 4)");
        System.out.println(" n | answers | nodes, filter at the end | nodes, pruned");
        for (int n = 1; n <= 10; n++) {
            nodes = 0; naive(n, 0); long a = nodes;
            nodes = 0; pruned(n, 0, 0); long b = nodes;
            System.out.printf("%2d | %7d | %24d | %13d%n", n, generateParenthesis(n).size(), a, b);
        }
    }
}
