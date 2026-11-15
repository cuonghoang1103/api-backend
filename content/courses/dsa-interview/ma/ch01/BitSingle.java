import java.util.*;

// LC 136 · Single Number — count map, sort, XOR.
public class BitSingle {
    // #region map
    static int singleNumberMap(int[] nums) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) count.merge(x, 1, Integer::sum);
        for (Map.Entry<Integer, Integer> e : count.entrySet()) if (e.getValue() == 1) return e.getKey();
        return -1;
    }
    // #endregion

    // #region sort
    static int singleNumberSort(int[] nums) {
        int[] a = nums.clone();
        Arrays.sort(a);
        for (int i = 0; i < a.length; i += 2) {
            if (i + 1 == a.length || a[i] != a[i + 1]) return a[i];
        }
        return -1;
    }
    // #endregion

    // #region xor
    static int singleNumber(int[] nums) {
        int acc = 0;
        for (int x : nums) acc ^= x;      // pairs cancel out
        return acc;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] cases = {{2, 2, 1}, {4, 1, 2, 1, 2}, {1}, {-3, 7, -3}, {5, 9, 3, 9, 5}};
        for (int[] c : cases) {
            System.out.println(Arrays.toString(c) + " -> map " + singleNumberMap(c) + ", sort " + singleNumberSort(c) + ", xor " + singleNumber(c));
        }
    }
}
