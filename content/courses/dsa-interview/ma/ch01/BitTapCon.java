import java.util.*;

// LC 78 · Subsets with a bitmask.
public class BitTapCon {
    // #region subsets
    static List<List<Integer>> subsets(int[] nums) {
        int n = nums.length;
        List<List<Integer>> out = new ArrayList<>();
        for (int mask = 0; mask < (1 << n); mask++) {
            List<Integer> cur = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) cur.add(nums[i]);   // Java: an int is not a boolean, compare with 0
            }
            out.add(cur);
        }
        return out;
    }
    // #endregion

    // #region tin-chi
    static int countPicks(int[] credits, int target, List<Integer> first) {   // fills first = indices of the first pick
        int n = credits.length, ways = 0;
        for (int mask = 0; mask < (1 << n); mask++) {
            int sum = 0;
            for (int i = 0; i < n; i++) if (((mask >> i) & 1) == 1) sum += credits[i];
            if (sum == target) {
                if (ways == 0) for (int i = 0; i < n; i++) if (((mask >> i) & 1) == 1) first.add(i);
                ways++;
            }
        }
        return ways;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("subsets([1,2,3]) = " + subsets(new int[]{1, 2, 3}));
        System.out.println("subsets(n=20) count = " + (1 << 20));
        List<Integer> first = new ArrayList<>();
        int ways = countPicks(new int[]{3, 3, 2, 4, 1}, 7, first);
        System.out.println("credits [3,3,2,4,1], target 7 -> " + ways + " ways, first one uses courses " + first);
    }
}
