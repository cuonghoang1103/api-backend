// LC 424 · Longest Repeating Character Replacement.
public class CharReplacement {
    // #region giai
    static int characterReplacement(String s, int k) {
        int[] cnt = new int[26];
        int l = 0, maxf = 0, best = 0;
        for (int r = 0; r < s.length(); r++) {
            int c = s.charAt(r) - 'A';
            cnt[c]++;
            maxf = Math.max(maxf, cnt[c]);
            while (r - l + 1 - maxf > k) {
                cnt[s.charAt(l) - 'A']--;
                l++;
            }
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
    // #endregion

    public static void main(String[] args) {
        String[] ss = {"ABAB", "AABABBA", "AAAA", "ABCDE", "BAAAB"};
        int[] ks = {2, 1, 0, 1, 2};
        for (int t = 0; t < ss.length; t++)
            System.out.println("characterReplacement(\"" + ss[t] + "\", " + ks[t] + ") = " + characterReplacement(ss[t], ks[t]));
    }
}
