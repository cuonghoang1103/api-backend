import java.util.*;

public class XinChao {
    // #region giai
    static String reverseWords(String s) {
        List<String> words = new ArrayList<>(Arrays.asList(s.trim().split("\\s+")));
        Collections.reverse(words);
        return String.join(" ", words);
    }
    // #endregion
    public static void main(String[] args) {
        System.out.println(reverseWords("  the sky   is blue "));
        System.out.println(reverseWords("hello"));
        System.out.println(reverseWords("a good   example"));
    }
}
