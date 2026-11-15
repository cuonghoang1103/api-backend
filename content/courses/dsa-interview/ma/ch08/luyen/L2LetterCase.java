import java.util.*;

// LC 784 · Letter Case Permutation — a letter is a level with two choices, a digit is a level with one.
public class L2LetterCase {
    // #region giai
    static List<String> letterCasePermutation(String s) {
        List<String> res = new ArrayList<>();
        bt(s.toCharArray(), 0, res);
        return res;
    }

    static void bt(char[] ch, int i, List<String> res) {
        if (i == ch.length) { res.add(new String(ch)); return; }
        if (Character.isDigit(ch[i])) { bt(ch, i + 1, res); return; }
        ch[i] = Character.toLowerCase(ch[i]); bt(ch, i + 1, res);
        ch[i] = Character.toUpperCase(ch[i]); bt(ch, i + 1, res);
    }
    // #endregion

    public static void main(String[] args) {
        for (String s : new String[]{"a1b2", "3z4", "12345", "C"}) System.out.println("\"" + s + "\" -> " + letterCasePermutation(s));
        System.out.println("\"abcdefghijkl\" -> " + letterCasePermutation("abcdefghijkl").size() + " strings (2^12)");
    }
}
