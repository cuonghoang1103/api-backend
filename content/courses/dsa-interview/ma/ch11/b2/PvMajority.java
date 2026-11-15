import java.util.*;

// LC 169 · Majority Element — HashMap count, sort + middle, Boyer–Moore voting, and the verifying second pass.
public class PvMajority {
    // #region dem
    static int majorityCount(int[] nums) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) {
            int c = count.getOrDefault(x, 0) + 1;
            if (c > nums.length / 2) return x;          // integer n/2: c > 3 for n = 7 means c >= 4
            count.put(x, c);
        }
        throw new IllegalArgumentException("no majority");
    }
    // #endregion

    // #region sap-xep
    static int majoritySort(int[] nums) {
        int[] a = nums.clone();                          // do not mutate the caller's array
        Arrays.sort(a);
        return a[a.length / 2];
    }
    // #endregion

    // #region bau-chon
    static int majorityVote(int[] nums) {
        int candidate = 0, count = 0;
        for (int x : nums) {
            if (count == 0) candidate = x;
            count += (x == candidate) ? 1 : -1;
        }
        return candidate;                                // correct ONLY if a majority exists
    }
    // #endregion

    // #region kiem-lai
    static Integer majorityOrNone(int[] nums) {
        int c = majorityVote(nums), seen = 0;
        for (int x : nums) if (x == c) seen++;
        return seen > nums.length / 2 ? c : null;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] cases = {
            {3, 2, 3}, {2, 2, 1, 1, 1, 2, 2}, {7}, {-1, -1, 5}, {4, 5, 4, 5, 4, 5, 5},
            {1000000000, -1000000000, 1000000000},
        };
        for (int[] a : cases) {
            System.out.println(Arrays.toString(a) + " -> count=" + majorityCount(a) + " sort=" + majoritySort(a)
                + " vote=" + majorityVote(a));
        }
        System.out.println("-- no majority guaranteed (follow-up) --");
        int[][] none = {{1, 2, 3}, {1, 2, 1, 3}, {2, 2, 1, 1}, {5, 5, 1}};
        for (int[] a : none) {
            Integer v = majorityOrNone(a);
            System.out.println(Arrays.toString(a) + " -> raw candidate=" + majorityVote(a) + " verified="
                + (v == null ? "none" : v));
        }
    }
}
