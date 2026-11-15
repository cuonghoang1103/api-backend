import java.util.*;

// LC 77 · Combinations and LC 39 · Combination Sum — "order does not matter" means a start index.
public class ToHop {
    // #region combine
    static List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> res = new ArrayList<>();
        bt(n, k, 1, new ArrayList<>(), res);
        return res;
    }

    static void bt(int n, int k, int start, List<Integer> path, List<List<Integer>> res) {
        if (path.size() == k) { res.add(new ArrayList<>(path)); return; }
        int need = k - path.size();
        for (int x = start; x <= n - need + 1; x++) {
            path.add(x);
            bt(n, k, x + 1, path, res);
            path.remove(path.size() - 1);
        }
    }
    // #endregion

    // #region combination-sum
    static List<List<Integer>> combinationSum(int[] candidates, int target) {
        int[] a = candidates.clone();
        Arrays.sort(a);
        List<List<Integer>> res = new ArrayList<>();
        sum(a, 0, target, new ArrayList<>(), res);
        return res;
    }

    static void sum(int[] a, int start, int remain, List<Integer> path, List<List<Integer>> res) {
        if (remain == 0) { res.add(new ArrayList<>(path)); return; }
        for (int i = start; i < a.length; i++) {
            if (a[i] > remain) break;
            path.add(a[i]);
            sum(a, i, remain - a[i], path, res);
            path.remove(path.size() - 1);
        }
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("combine(4, 2) = " + combine(4, 2));
        System.out.println("combine(5, 3) has " + combine(5, 3).size() + " combinations (C(5,3) = 10)");
        System.out.println("combinationSum([2,3,6,7], 7) = " + combinationSum(new int[]{2, 3, 6, 7}, 7));
        System.out.println("combinationSum([2,3,5], 8)   = " + combinationSum(new int[]{2, 3, 5}, 8));
        System.out.println("combinationSum([2], 1)       = " + combinationSum(new int[]{2}, 1));
    }
}
