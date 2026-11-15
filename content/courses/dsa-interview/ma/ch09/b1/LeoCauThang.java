import java.util.*;

// LC 70 Climbing Stairs, written four times: recursion → memo (top-down) → table (bottom-up) → two variables.
public class LeoCauThang {
    static long calls = 0;

    // #region de-quy
    static int climbNaive(int n) {
        calls++;
        if (n <= 1) return 1;                             // 0 or 1 step left: exactly one way
        return climbNaive(n - 1) + climbNaive(n - 2);     // last move was 1 step, or 2 steps
    }
    // #endregion

    // #region nho
    static int climbMemo(int n, Map<Integer, Integer> memo) {
        calls++;
        if (n <= 1) return 1;
        Integer known = memo.get(n);
        if (known != null) return known;                  // solved before: read the notebook
        int ways = climbMemo(n - 1, memo) + climbMemo(n - 2, memo);
        memo.put(n, ways);                                // write it down BEFORE returning
        return ways;
    }
    // #endregion

    // #region bang
    static int climbTable(int n) {
        if (n <= 1) return 1;
        int[] dp = new int[n + 1];                        // dp[i] = ways to reach step i; n + 1 cells (0..n)
        dp[0] = 1;
        dp[1] = 1;
        for (int i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
        return dp[n];
    }
    // #endregion

    // #region hai-bien
    static int climbTwoVars(int n) {
        int prev2 = 1, prev1 = 1;                         // ways(i - 2), ways(i - 1) when i = 2
        for (int i = 2; i <= n; i++) {
            int cur = prev1 + prev2;
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
    // #endregion

    public static void main(String[] args) {
        int[] ns = new int[10], a = new int[10], b = new int[10], c = new int[10], d = new int[10];
        for (int i = 0; i < 10; i++) {
            int n = i + 1;
            ns[i] = n; a[i] = climbNaive(n); b[i] = climbMemo(n, new HashMap<>()); c[i] = climbTable(n); d[i] = climbTwoVars(n);
        }
        System.out.println("n        = " + Arrays.toString(ns));
        System.out.println("naive    = " + Arrays.toString(a));
        System.out.println("memo     = " + Arrays.toString(b));
        System.out.println("table    = " + Arrays.toString(c));
        System.out.println("two vars = " + Arrays.toString(d));
        for (int n : new int[]{10, 30}) {
            calls = 0; climbNaive(n); long x = calls;
            calls = 0; climbMemo(n, new HashMap<>()); long y = calls;
            System.out.println("n=" + n + ": naive calls = " + x + ", memo calls = " + y);
        }
        System.out.println("ways(45) = " + climbTwoVars(45) + "   (LeetCode's limit is n <= 45)");
    }
}
