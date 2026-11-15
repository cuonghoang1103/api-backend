import java.util.*;

// LC 518 Coin Change II (combinations) vs LC 377 Combination Sum IV (ordered sequences).
public class McDemCach {
    // #region tohop
    static int change(int amount, int[] coins) {
        int[] ways = new int[amount + 1];
        ways[0] = 1;                                 // one way to make 0: take nothing
        for (int c : coins)                          // coins OUTSIDE ⇒ combinations
            for (int a = c; a <= amount; a++) ways[a] += ways[a - c];
        return ways[amount];
    }
    // #endregion

    // #region hoanvi
    static int combinationSum4(int[] nums, int target) {
        int[] ways = new int[target + 1];
        ways[0] = 1;
        for (int a = 1; a <= target; a++)            // amount OUTSIDE ⇒ ordered sequences
            for (int c : nums) if (c <= a) ways[a] += ways[a - c];
        return ways[target];
    }
    // #endregion

    static void walk(int left, int minIdx, int[] coins, boolean ordered, Deque<Integer> path, List<String> out) {
        if (left == 0) {
            StringBuilder sb = new StringBuilder();
            for (int x : path) { if (sb.length() > 0) sb.append('+'); sb.append(x); }
            out.add(sb.toString());
            return;
        }
        for (int k = ordered ? 0 : minIdx; k < coins.length; k++) {
            if (coins[k] <= left) { path.addLast(coins[k]); walk(left - coins[k], k, coins, ordered, path, out); path.removeLast(); }
        }
    }
    static String listAll(int amount, int[] coins, boolean ordered) {
        List<String> out = new ArrayList<>();
        walk(amount, 0, coins, ordered, new ArrayDeque<>(), out);
        return String.join(" | ", out);
    }

    public static void main(String[] args) {
        int[] coins = {1, 2, 5};
        System.out.println("change(5, [1,2,5]) = " + change(5, coins) + "           -> " + listAll(5, coins, false));
        System.out.println("combinationSum4([1,2,5], 5) = " + combinationSum4(coins, 5) + "  -> " + listAll(5, coins, true));
        System.out.println("change(3, [2]) = " + change(3, new int[]{2}) + "   change(10, [10]) = " + change(10, new int[]{10}) + "   change(0, [7]) = " + change(0, new int[]{7}));
        System.out.println("combinationSum4([1,2,3], 4) = " + combinationSum4(new int[]{1, 2, 3}, 4) + "   combinationSum4([9], 3) = " + combinationSum4(new int[]{9}, 3));
    }
}
