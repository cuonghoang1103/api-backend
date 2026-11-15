import java.util.*;

// LC 740 Delete and Earn — House Robber in disguise, plus "which values did we take?" (rebuilding the choice).
public class NdDeleteEarn {
    // #region giai
    static int deleteAndEarn(int[] nums) {
        int maxV = Arrays.stream(nums).max().getAsInt();
        int[] points = new int[maxV + 1];                 // points[v] = v × (how many times v appears)
        for (int x : nums) points[x] += x;
        int prev2 = 0, prev1 = 0;                         // best using values ≤ v−2, best using values ≤ v−1
        for (int v = 1; v <= maxV; v++) {
            int cur = Math.max(prev1, prev2 + points[v]); // skip v  |  take every copy of v
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
    // #endregion

    // #region chon
    static List<Integer> pickedValues(int[] nums) {
        int maxV = Arrays.stream(nums).max().getAsInt();
        int[] points = new int[maxV + 1];
        for (int x : nums) points[x] += x;
        int[] dp = new int[maxV + 1];                     // keep the whole table: we walk back through it
        for (int v = 1; v <= maxV; v++) dp[v] = Math.max(dp[v - 1], (v >= 2 ? dp[v - 2] : 0) + points[v]);
        List<Integer> picked = new ArrayList<>();
        for (int v = maxV; v >= 1;) {
            if (dp[v] == dp[v - 1]) v--;                  // skipping v was as good: v not taken
            else { picked.add(v); v -= 2; }               // v taken ⇒ v−1 forbidden, continue at v−2
        }
        Collections.reverse(picked);
        return picked;
    }
    // #endregion

    static int brute(int[] nums) {
        int[] vals = Arrays.stream(nums).distinct().sorted().toArray();
        int best = 0;
        for (int mask = 0; mask < 1 << vals.length; mask++) {
            boolean ok = true; int sum = 0;
            for (int i = 0; i < vals.length && ok; i++) if ((mask & (1 << i)) != 0) {
                for (int j = 0; j < i; j++) if ((mask & (1 << j)) != 0 && vals[i] - vals[j] == 1) ok = false;
                for (int x : nums) if (x == vals[i]) sum += x;
            }
            if (ok) best = Math.max(best, sum);
        }
        return best;
    }

    static long seed = 740;
    static int rnd(int m) { seed = (seed * 48271) % 2147483647L; return (int) (seed % m); }

    public static void main(String[] args) {
        int[][] tests = {{3, 4, 2}, {2, 2, 3, 3, 3, 4}, {1, 1, 1, 2, 4, 5, 5, 5, 6}, {7}};
        for (int[] nums : tests) System.out.println(Arrays.toString(nums) + " -> " + deleteAndEarn(nums) + "  take " + pickedValues(nums));
        int bad = 0;
        for (int t = 0; t < 2000; t++) {
            int[] nums = new int[1 + rnd(9)];
            for (int i = 0; i < nums.length; i++) nums[i] = 1 + rnd(9);
            if (deleteAndEarn(nums) != brute(nums)) bad++;
        }
        System.out.println("random self-test vs brute force: 2000 cases, " + bad + " mismatches");
    }
}
