import java.util.*;

// LC 767 · Reorganize String.
public class L3Reorganize {
    // #region giai
    static String reorganizeString(String s) {
        int[] cnt = new int[26];
        for (char c : s.toCharArray()) cnt[c - 'a']++;
        PriorityQueue<int[]> h = new PriorityQueue<>((a, b) -> a[1] != b[1] ? Integer.compare(b[1], a[1]) : Integer.compare(a[0], b[0]));
        for (int i = 0; i < 26; i++) if (cnt[i] > 0) h.offer(new int[]{i, cnt[i]});   // {letter, count}
        StringBuilder out = new StringBuilder();
        int[] held = null;
        while (!h.isEmpty()) {
            int[] cur = h.poll();
            out.append((char) ('a' + cur[0]));
            cur[1]--;
            if (held != null && held[1] > 0) h.offer(held);
            held = cur;
        }
        return out.length() == s.length() ? out.toString() : "";
    }
    // #endregion

    public static void main(String[] args) {
        for (String s : new String[]{"aaabc", "aaab", "vvvlo", "aabbcc", "z"}) System.out.println("\"" + s + "\" -> \"" + reorganizeString(s) + "\"");
    }
}
