// LC 1863 · Sum of All Subset XOR Totals — take / skip, carrying the running XOR down the tree.
public class L1XorSubsets {
    // #region giai
    static int subsetXORSum(int[] nums) { return go(nums, 0, 0); }

    static int go(int[] nums, int i, int x) {
        if (i == nums.length) return x;
        return go(nums, i + 1, x ^ nums[i]) + go(nums, i + 1, x);
    }
    // #endregion

    static int bits(int[] nums) {
        int or = 0;
        for (int v : nums) or |= v;
        return or * (1 << (nums.length - 1));
    }

    public static void main(String[] args) {
        int[][] tests = {{1, 3}, {5, 1, 6}, {3, 4, 5, 6, 7, 8}, {7}};
        for (int[] a : tests) System.out.println(java.util.Arrays.toString(a) + " -> " + subsetXORSum(a) + "   (bit trick: " + bits(a) + ")");
    }
}
