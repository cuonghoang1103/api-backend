import java.util.*;

// LC 1679 · Max Number of K-Sum Pairs.
public class Luyen1679 {
    // #region map
    static int maxOperations(int[] nums, int k) {
        Map<Integer, Integer> waiting = new HashMap<>(); // value -> unpaired copies
        int ops = 0;
        for (int x : nums) {
            int need = k - x;
            int c = waiting.getOrDefault(need, 0);
            if (c > 0) {
                waiting.put(need, c - 1);
                ops++;
            } else {
                waiting.merge(x, 1, Integer::sum);
            }
        }
        return ops;
    }
    // #endregion

    // #region sort
    static int maxOperationsSorted(int[] nums, int k) {
        int[] a = nums.clone();
        Arrays.sort(a);
        int lo = 0, hi = a.length - 1, ops = 0;
        while (lo < hi) {
            int s = a[lo] + a[hi];
            if (s == k) { ops++; lo++; hi--; }
            else if (s < k) lo++;
            else hi--;
        }
        return ops;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] arrays = {{2, 7, 4, 5, 3}, {3, 3, 3, 1, 4}, {2, 2, 2, 2, 2}, {1, 1}, {10, 1, 9, 2, 8, 3}};
        int[] ks = {9, 6, 4, 3, 11};
        for (int t = 0; t < arrays.length; t++) {
            System.out.println("maxOperations(" + Arrays.toString(arrays[t]) + ", " + ks[t] + ") = "
                + maxOperations(arrays[t], ks[t]) + "   sorted = " + maxOperationsSorted(arrays[t], ks[t]));
        }
    }
}
