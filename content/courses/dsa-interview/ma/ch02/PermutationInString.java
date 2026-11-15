// LC 567 · Permutation in String — window with a per-letter budget.
public class PermutationInString {
    // #region window
    static boolean checkInclusion(String s1, String s2) {
        int m = s1.length();
        int[] cnt = new int[26];
        for (char c : s1.toCharArray()) cnt[c - 'a']++;
        int l = 0;
        for (int r = 0; r < s2.length(); r++) {
            int c = s2.charAt(r) - 'a';
            cnt[c]--;
            while (cnt[c] < 0) {
                cnt[s2.charAt(l) - 'a']++;
                l++;
            }
            if (r - l + 1 == m) return true;
        }
        return false;
    }
    // #endregion

    public static void main(String[] args) {
        String[][] tests = {{"ab", "eidbaooo"}, {"ab", "eidboaoo"}, {"adc", "dcda"}, {"hello", "ooolleoooleh"}};
        for (String[] x : tests)
            System.out.println("checkInclusion(\"" + x[0] + "\", \"" + x[1] + "\") = " + checkInclusion(x[0], x[1]));
    }
}
