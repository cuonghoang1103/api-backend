import java.util.HashMap;
import java.util.Map;

public class LongestSubstring {
    // #region giai
    static int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> lastSeen = new HashMap<>();   // character -> last index
        int best = 0;
        int left = 0;                                         // window is s[left..right]
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            Integer prev = lastSeen.get(c);
            if (prev != null && prev >= left) left = prev + 1;    // jump past the old copy
            lastSeen.put(c, right);
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
    // #endregion

    public static void main(String[] args) {
        for (String s : new String[]{"abcabcbb", "bbbbb", "pwwkew", "", "abba", "dvdf"}) {
            System.out.println("\"" + s + "\" -> " + lengthOfLongestSubstring(s));
        }
    }
}
