import java.util.*;

public class NextGreater {
    // #region nge1
    static int[] nextGreaterElement(int[] nums1, int[] nums2) {
        Map<Integer, Integer> next = new HashMap<>();
        Deque<Integer> st = new ArrayDeque<>();
        for (int x : nums2) {
            while (!st.isEmpty() && x > st.peek()) next.put(st.pop(), x);
            st.push(x);
        }
        int[] ans = new int[nums1.length];
        for (int i = 0; i < nums1.length; i++) ans[i] = next.getOrDefault(nums1[i], -1);
        return ans;
    }
    // #endregion

    // #region nge2
    static int[] nextGreaterElements(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        Arrays.fill(ans, -1);
        Deque<Integer> st = new ArrayDeque<>();
        for (int k = 0; k < 2 * n; k++) {
            int i = k % n;
            while (!st.isEmpty() && nums[i] > nums[st.peek()]) ans[st.pop()] = nums[i];
            if (k < n) st.push(i);
        }
        return ans;
    }
    // #endregion

    // #region span
    static class StockSpanner {
        private final Deque<int[]> st = new ArrayDeque<>();   // {price, span}
        int next(int price) {
            int span = 1;
            while (!st.isEmpty() && st.peek()[0] <= price) span += st.pop()[1];
            st.push(new int[]{price, span});
            return span;
        }
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("nextGreaterElement([4,1,2],[1,3,4,2]) = " + Arrays.toString(nextGreaterElement(new int[]{4, 1, 2}, new int[]{1, 3, 4, 2})));
        System.out.println("nextGreaterElements([1,2,1]) = " + Arrays.toString(nextGreaterElements(new int[]{1, 2, 1})));
        System.out.println("nextGreaterElements([5,4,3,2,1]) = " + Arrays.toString(nextGreaterElements(new int[]{5, 4, 3, 2, 1})));
        StockSpanner sp = new StockSpanner();
        int[] prices = {100, 80, 60, 70, 60, 75, 85};
        int[] spans = new int[prices.length];
        for (int i = 0; i < prices.length; i++) spans[i] = sp.next(prices[i]);
        System.out.println("spans for [100,80,60,70,60,75,85] = " + Arrays.toString(spans));
    }
}
