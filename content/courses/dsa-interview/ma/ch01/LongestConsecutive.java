import java.util.*;

public class LongestConsecutive {
    // #region giai
    static int longestConsecutive(int[] nums) {
        Set<Integer> s = new HashSet<>();
        for (int x : nums) s.add(x);
        int best = 0;
        for (int x : s) {
            if (s.contains(x - 1)) continue;   // not the start of a run
            int len = 1;
            while (s.contains(x + len)) len++;
            best = Math.max(best, len);
        }
        return best;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(longestConsecutive(new int[]{100, 4, 200, 1, 3, 2}));
        System.out.println(longestConsecutive(new int[]{0, 3, 7, 2, 5, 8, 4, 6, 0, 1}));
        System.out.println(longestConsecutive(new int[]{}));
    }
}
