import java.util.*;

// LC 78 · Subsets — the backtracking template, written two ways, with a call counter.
public class Subsets {
    // #region khuon
    static List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), res);
        return res;
    }

    static void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
        res.add(new ArrayList<>(path));            // record a COPY of the current path
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);                     // 1. choose
            backtrack(nums, i + 1, path, res);     // 2. explore
            path.remove(path.size() - 1);          // 3. unchoose (by index: remove(int), not remove(Object))
        }
    }
    // #endregion

    // #region chon-bo
    static List<List<Integer>> subsetsBinary(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        go(nums, 0, new ArrayList<>(), res);
        return res;
    }

    static void go(int[] nums, int i, List<Integer> path, List<List<Integer>> res) {
        if (i == nums.length) { res.add(new ArrayList<>(path)); return; }
        path.add(nums[i]);                         // take nums[i]
        go(nums, i + 1, path, res);
        path.remove(path.size() - 1);
        go(nums, i + 1, path, res);                // skip nums[i]
    }
    // #endregion

    static long calls, answers;
    static void counted(int n, int start, int depth) {
        calls++;
        answers++;
        for (int i = start; i < n; i++) counted(n, i + 1, depth + 1);
    }

    public static void main(String[] args) {
        System.out.println("subsets([1,2,3])       = " + subsets(new int[]{1, 2, 3}));
        System.out.println("subsetsBinary([1,2,3]) = " + subsetsBinary(new int[]{1, 2, 3}));
        System.out.println("subsets([])            = " + subsets(new int[]{}));
        for (int n : new int[]{1, 2, 3, 4, 10, 20}) {
            calls = 0; answers = 0;
            counted(n, 0, 0);
            System.out.println("n = " + n + ": answers = " + answers + ", calls = " + calls + ", 2^n = " + (1L << n));
        }
    }
}
