import java.util.*;

// LC 139 Word Break.
public class McWordBreak {
    // #region wb
    static boolean wordBreak(String s, List<String> wordDict) {
        Set<String> dict = new HashSet<>(wordDict);
        int maxLen = 0;
        for (String w : wordDict) maxLen = Math.max(maxLen, w.length());
        boolean[] dp = new boolean[s.length() + 1];  // dp[i] = first i characters can be cut
        dp[0] = true;                                // base: empty prefix
        for (int i = 1; i <= s.length(); i++) {
            for (int j = i - 1; j >= Math.max(0, i - maxLen); j--) {   // last word = s[j..i-1]
                if (dp[j] && dict.contains(s.substring(j, i))) { dp[i] = true; break; }
            }
        }
        return dp[s.length()];
    }
    // #endregion

    static String segment(String s, List<String> wordDict) {
        Set<String> dict = new HashSet<>(wordDict);
        int[] from = new int[s.length() + 1];
        Arrays.fill(from, -1);
        from[0] = 0;
        for (int i = 1; i <= s.length(); i++)
            for (int j = 0; j < i; j++)
                if (from[j] != -1 && dict.contains(s.substring(j, i))) { from[i] = j; break; }
        if (from[s.length()] == -1) return null;
        Deque<String> words = new ArrayDeque<>();
        for (int i = s.length(); i > 0; i = from[i]) words.addFirst(s.substring(from[i], i));
        return String.join(" ", words);
    }

    public static void main(String[] args) {
        System.out.println("wordBreak(\"leetcode\", [leet, code]) = " + wordBreak("leetcode", List.of("leet", "code")));
        System.out.println("wordBreak(\"applepenapple\", [apple, pen]) = " + wordBreak("applepenapple", List.of("apple", "pen")));
        System.out.println("wordBreak(\"catsandog\", [cats, dog, sand, and, cat]) = " + wordBreak("catsandog", List.of("cats", "dog", "sand", "and", "cat")));
        System.out.println("wordBreak(\"aaaaaaab\", [a, aa, aaa]) = " + wordBreak("aaaaaaab", List.of("a", "aa", "aaa")));
        System.out.println("segment(\"thanhtoanthatbai\", [thanh, toan, that, bai, thanhtoan]) = " + segment("thanhtoanthatbai", List.of("thanh", "toan", "that", "bai", "thanhtoan")));
        System.out.println("segment(\"ilovecoding\", [i, love, cod, coding, ing]) = " + segment("ilovecoding", List.of("i", "love", "cod", "coding", "ing")));
    }
}
