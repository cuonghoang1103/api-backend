import java.util.*;

public class GroupAnagrams {
    // #region sorted
    static List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new LinkedHashMap<>(); // keeps first-seen order
        for (String w : strs) {
            char[] cs = w.toCharArray();
            Arrays.sort(cs);
            String key = new String(cs);                          // "eat" -> "aet"
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(w);
        }
        return new ArrayList<>(groups.values());
    }
    // #endregion

    // #region count
    static List<List<String>> groupAnagramsCount(String[] strs) {
        Map<String, List<String>> groups = new LinkedHashMap<>();
        for (String w : strs) {
            int[] c = new int[26];
            for (char ch : w.toCharArray()) c[ch - 'a']++;
            StringBuilder key = new StringBuilder();
            for (int i = 0; i < 26; i++) { if (i > 0) key.append('#'); key.append(c[i]); }
            groups.computeIfAbsent(key.toString(), k -> new ArrayList<>()).add(w);
        }
        return new ArrayList<>(groups.values());
    }
    // #endregion

    public static void main(String[] args) {
        String[] input = {"eat", "tea", "tan", "ate", "nat", "bat"};
        System.out.println("sorted key : " + groupAnagrams(input));
        System.out.println("count key  : " + groupAnagramsCount(input));
    }
}
