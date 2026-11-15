import java.util.*;

// LC 47 · Permutations II — duplicates in the input: sort, and use twins only in their original order.
public class L3PermUnique {
    // #region giai
    static List<List<Integer>> permuteUnique(int[] nums) {
        int[] a = nums.clone();
        Arrays.sort(a);
        List<List<Integer>> res = new ArrayList<>();
        bt(a, new boolean[a.length], new ArrayList<>(), res);
        return res;
    }

    static void bt(int[] a, boolean[] used, List<Integer> path, List<List<Integer>> res) {
        if (path.size() == a.length) { res.add(new ArrayList<>(path)); return; }
        for (int i = 0; i < a.length; i++) {
            if (used[i]) continue;
            if (i > 0 && a[i] == a[i - 1] && !used[i - 1]) continue;
            used[i] = true; path.add(a[i]);
            bt(a, used, path, res);
            path.remove(path.size() - 1); used[i] = false;
        }
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("[1,1,2]   -> " + permuteUnique(new int[]{1, 1, 2}));
        System.out.println("[1,2,3]   -> " + permuteUnique(new int[]{1, 2, 3}).size() + " permutations");
        System.out.println("[1,1,2,2] -> " + permuteUnique(new int[]{1, 1, 2, 2}).size() + " permutations (4!/(2!*2!) = 6)");
        System.out.println("[2,2,2]   -> " + permuteUnique(new int[]{2, 2, 2}));
    }
}
