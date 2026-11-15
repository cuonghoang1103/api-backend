import java.util.*;

// LC 46 · Permutations — "which element goes in the next slot?" with a used[] array.
public class Permutations {
    // #region perm
    static List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(nums, new boolean[nums.length], new ArrayList<>(), res);
        return res;
    }

    static void backtrack(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> res) {
        if (path.size() == nums.length) { res.add(new ArrayList<>(path)); return; }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true; path.add(nums[i]);        // choose
            backtrack(nums, used, path, res);
            path.remove(path.size() - 1); used[i] = false; // unchoose both
        }
    }
    // #endregion

    static long nodes, leaves;
    static void bt(int n, boolean[] used, int depth) {
        nodes++;
        if (depth == n) { leaves++; return; }
        for (int i = 0; i < n; i++) if (!used[i]) { used[i] = true; bt(n, used, depth + 1); used[i] = false; }
    }

    public static void main(String[] args) {
        System.out.println("permute([1,2,3]) = " + permute(new int[]{1, 2, 3}));
        System.out.println("permute([7])     = " + permute(new int[]{7}));
        for (int n = 1; n <= 8; n++) {
            nodes = 0; leaves = 0;
            bt(n, new boolean[n], 0);
            System.out.println("n = " + n + ": leaves (n!) = " + leaves + ", nodes = " + nodes
                + ", nodes / n! = " + String.format("%.3f", (double) nodes / leaves));
        }
    }
}
