import java.util.*;

// LC 15 · 3Sum — sort + fix one number + two pointers; skip duplicates at all three positions.
public class ThreeSum {
    // #region dung
    static List<List<Integer>> threeSum(int[] nums) {
        int[] a = nums.clone();
        Arrays.sort(a);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < a.length - 2; i++) {
            if (a[i] > 0) break;
            if (i > 0 && a[i] == a[i - 1]) continue;
            int l = i + 1, r = a.length - 1;
            while (l < r) {
                int sum = a[i] + a[l] + a[r];
                if (sum < 0) l++;
                else if (sum > 0) r--;
                else {
                    res.add(List.of(a[i], a[l], a[r]));
                    l++; r--;
                    while (l < r && a[l] == a[l - 1]) l++;
                    while (l < r && a[r] == a[r + 1]) r--;
                }
            }
        }
        return res;
    }
    // #endregion

    // #region sai
    static List<List<Integer>> threeSumNoDedup(int[] nums) {
        int[] a = nums.clone();
        Arrays.sort(a);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < a.length - 2; i++) {
            int l = i + 1, r = a.length - 1;
            while (l < r) {
                int sum = a[i] + a[l] + a[r];
                if (sum < 0) l++;
                else if (sum > 0) r--;
                else { res.add(List.of(a[i], a[l], a[r])); l++; r--; }
            }
        }
        return res;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] tests = {{-1, 0, 1, 2, -1, -4}, {0, 0, 0, 0}, {0, 1, 1}, {-2, 0, 0, 2, 2}};
        for (int[] t : tests) {
            System.out.println("threeSum(" + Arrays.toString(t) + ") = " + threeSum(t));
            System.out.println("   without dedup  = " + threeSumNoDedup(t));
        }
    }
}
