import java.util.*;

// Same recipe, different skin: LC 746 Min Cost Climbing Stairs and LC 1137 N-th Tribonacci Number.
public class BienThe91 {
    // #region lc746
    static int minCostClimbingStairs(int[] cost) {
        int n = cost.length;
        int prev2 = 0, prev1 = 0;                     // cheapest way to STAND at i - 2 and i - 1
        for (int i = 2; i <= n; i++) {                // i = n is "the top"
            int cur = Math.min(prev1 + cost[i - 1], prev2 + cost[i - 2]);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
    // #endregion

    // #region lc1137
    static int tribonacci(int n) {
        int a = 0, b = 1, c = 1;                      // T(i), T(i + 1), T(i + 2) for i = 0
        for (int i = 0; i < n; i++) { int d = a + b + c; a = b; b = c; c = d; }
        return a;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("minCost([10,15,20]) = " + minCostClimbingStairs(new int[]{10, 15, 20}));
        System.out.println("minCost([1,100,1,1,1,100,1,1,100,1]) = " + minCostClimbingStairs(new int[]{1, 100, 1, 1, 1, 100, 1, 1, 100, 1}));
        System.out.println("minCost([5,7]) = " + minCostClimbingStairs(new int[]{5, 7}));
        int[] t = new int[11];
        for (int i = 0; i <= 10; i++) t[i] = tribonacci(i);
        System.out.println("tribonacci(0..10) = " + Arrays.toString(t));
        System.out.println("tribonacci(25) = " + tribonacci(25) + "  tribonacci(37) = " + tribonacci(37));
    }
}
