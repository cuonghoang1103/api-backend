import java.util.*;

public class SlidingMax {
    static int[] brute(int[] nums, int k) {
        int[] out = new int[nums.length - k + 1];
        for (int i = 0; i + k <= nums.length; i++) {
            int m = Integer.MIN_VALUE;
            for (int j = i; j < i + k; j++) m = Math.max(m, nums[j]);
            out[i] = m;
        }
        return out;
    }

    // #region deque
    static int[] maxSlidingWindow(int[] nums, int k) {
        Deque<Integer> dq = new ArrayDeque<>();          // indices, values decreasing head -> tail
        int[] out = new int[nums.length - k + 1];
        for (int i = 0; i < nums.length; i++) {
            if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();
            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
            dq.offerLast(i);
            if (i >= k - 1) out[i - k + 1] = nums[dq.peekFirst()];
        }
        return out;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] arrs = {{1, 3, -1, -3, 5, 3, 6, 7}, {9, 8, 7, 6}, {4}, {1, -1}};
        int[] ks = {3, 2, 1, 1};
        for (int t = 0; t < arrs.length; t++) {
            System.out.println(Arrays.toString(arrs[t]) + ", k=" + ks[t] + " -> " + Arrays.toString(maxSlidingWindow(arrs[t], ks[t]))
                + "   brute = " + Arrays.toString(brute(arrs[t], ks[t])));
        }
    }
}
