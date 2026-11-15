import java.util.*;

// LC 724 Find Pivot Index · LC 525 Contiguous Array · LC 974 Subarray Sums Divisible by K.
public class PrefixBienThe {
    // #region pivot
    static int pivotIndex(int[] nums) {
        int total = 0;
        for (int x : nums) total += x;
        int left = 0;
        for (int i = 0; i < nums.length; i++) {
            if (left == total - left - nums[i]) return i;
            left += nums[i];
        }
        return -1;
    }
    // #endregion

    // #region contiguous
    static int findMaxLength(int[] nums) {
        Map<Integer, Integer> first = new HashMap<>();
        first.put(0, -1);
        int balance = 0, best = 0;
        for (int i = 0; i < nums.length; i++) {
            balance += nums[i] == 1 ? 1 : -1;
            Integer j = first.get(balance);
            if (j != null) best = Math.max(best, i - j);
            else first.put(balance, i);
        }
        return best;
    }
    // #endregion

    // #region chiahet
    static int subarraysDivByK(int[] nums, int k) {
        int[] seen = new int[k];          // remainders are 0..k-1, so an array beats a map
        seen[0] = 1;
        int sum = 0, count = 0;
        for (int x : nums) {
            sum += x;
            int r = Math.floorMod(sum, k); // Java % is negative too: -1 % 5 == -1
            count += seen[r];
            seen[r]++;
        }
        return count;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("pivotIndex([1,7,3,6,5,6]) = " + pivotIndex(new int[]{1, 7, 3, 6, 5, 6}));
        System.out.println("pivotIndex([1,2,3]) = " + pivotIndex(new int[]{1, 2, 3}));
        System.out.println("pivotIndex([2,1,-1]) = " + pivotIndex(new int[]{2, 1, -1}));
        System.out.println("findMaxLength([0,1,1,1,0,0,1]) = " + findMaxLength(new int[]{0, 1, 1, 1, 0, 0, 1}));
        System.out.println("findMaxLength([0,0,0]) = " + findMaxLength(new int[]{0, 0, 0}));
        System.out.println("subarraysDivByK([4,5,0,-2,-3,1], 5) = " + subarraysDivByK(new int[]{4, 5, 0, -2, -3, 1}, 5));
        System.out.println("subarraysDivByK([-1,2,9], 2) = " + subarraysDivByK(new int[]{-1, 2, 9}, 2));
    }
}
