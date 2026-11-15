import java.util.*;

public class L6LongestLimit {
    // #region giai
    static int longestSubarray(int[] nums, int limit) {
        Deque<Integer> mx = new ArrayDeque<>(), mn = new ArrayDeque<>();
        int left = 0, best = 0;
        for (int r = 0; r < nums.length; r++) {
            int x = nums[r];
            while (!mx.isEmpty() && mx.peekLast() < x) mx.pollLast();
            mx.offerLast(x);
            while (!mn.isEmpty() && mn.peekLast() > x) mn.pollLast();
            mn.offerLast(x);
            while (mx.peekFirst() - mn.peekFirst() > limit) {
                if (mx.peekFirst() == nums[left]) mx.pollFirst();   // int on the right side => unboxed compare, safe
                if (mn.peekFirst() == nums[left]) mn.pollFirst();
                left++;
            }
            best = Math.max(best, r - left + 1);
        }
        return best;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println(longestSubarray(new int[]{8, 2, 4, 7}, 4));
        System.out.println(longestSubarray(new int[]{10, 1, 2, 4, 7, 2}, 5));
        System.out.println(longestSubarray(new int[]{4, 2, 2, 2, 4, 4, 2, 2}, 0));
        System.out.println(longestSubarray(new int[]{1, 5, 6, 7, 8, 10, 6, 5, 6}, 4));
    }
}
