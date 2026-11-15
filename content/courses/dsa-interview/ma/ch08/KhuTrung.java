import java.util.*;

// LC 90 · Subsets II and LC 40 · Combination Sum II — sort, then skip a twin at the same level.
public class KhuTrung {
    // #region subsets-dup
    static List<List<Integer>> subsetsWithDup(int[] nums) {
        int[] a = nums.clone();
        Arrays.sort(a);
        List<List<Integer>> res = new ArrayList<>();
        bt(a, 0, new ArrayList<>(), res);
        return res;
    }

    static void bt(int[] a, int start, List<Integer> path, List<List<Integer>> res) {
        res.add(new ArrayList<>(path));
        for (int i = start; i < a.length; i++) {
            if (i > start && a[i] == a[i - 1]) continue;
            path.add(a[i]);
            bt(a, i + 1, path, res);
            path.remove(path.size() - 1);
        }
    }
    // #endregion

    static void naive(int[] a, int start, List<Integer> path, List<List<Integer>> res) {
        res.add(new ArrayList<>(path));
        for (int i = start; i < a.length; i++) { path.add(a[i]); naive(a, i + 1, path, res); path.remove(path.size() - 1); }
    }

    // #region combo2
    static List<List<Integer>> combinationSum2(int[] candidates, int target) {
        int[] a = candidates.clone();
        Arrays.sort(a);
        List<List<Integer>> res = new ArrayList<>();
        sum2(a, 0, target, new ArrayList<>(), res);
        return res;
    }

    static void sum2(int[] a, int start, int remain, List<Integer> path, List<List<Integer>> res) {
        if (remain == 0) { res.add(new ArrayList<>(path)); return; }
        for (int i = start; i < a.length; i++) {
            if (i > start && a[i] == a[i - 1]) continue;
            if (a[i] > remain) break;
            path.add(a[i]);
            sum2(a, i + 1, remain - a[i], path, res);
            path.remove(path.size() - 1);
        }
    }
    // #endregion

    // #region sai-i-gt-0
    static void wrongSkip(int[] a, int start, List<Integer> path, List<List<Integer>> res) {
        res.add(new ArrayList<>(path));
        for (int i = start; i < a.length; i++) {
            if (i > 0 && a[i] == a[i - 1]) continue;   // BUG: should be i > start
            path.add(a[i]); wrongSkip(a, i + 1, path, res); path.remove(path.size() - 1);
        }
    }
    // #endregion

    public static void main(String[] args) {
        int[] a = {1, 2, 2};
        List<List<Integer>> n = new ArrayList<>(); naive(a, 0, new ArrayList<>(), n);
        System.out.println("naive  [1,2,2]: " + n);
        System.out.println("dedup  [1,2,2]: " + subsetsWithDup(a));
        List<List<Integer>> w = new ArrayList<>(); wrongSkip(a, 0, new ArrayList<>(), w);
        System.out.println("i > 0  [1,2,2]: " + w);
        System.out.println("dedup  [4,4,4,1,4]: " + subsetsWithDup(new int[]{4, 4, 4, 1, 4}));
        System.out.println("combinationSum2([10,1,2,7,6,1,5], 8) = " + combinationSum2(new int[]{10, 1, 2, 7, 6, 1, 5}, 8));
        System.out.println("combinationSum2([2,5,2,1,2], 5)      = " + combinationSum2(new int[]{2, 5, 2, 1, 2}, 5));
    }
}
