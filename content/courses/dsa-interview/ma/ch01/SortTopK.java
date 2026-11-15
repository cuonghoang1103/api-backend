import java.util.*;

// LC 347 · Top K Frequent Elements — sort by frequency vs bucket by frequency.
public class SortTopK {
    // #region sort
    static int[] topKSort(int[] nums, int k) {
        Map<Integer, Integer> count = new LinkedHashMap<>();     // insertion order, to print like TypeScript
        for (int x : nums) count.merge(x, 1, Integer::sum);
        List<Map.Entry<Integer, Integer>> es = new ArrayList<>(count.entrySet());
        es.sort((a, b) -> Integer.compare(b.getValue(), a.getValue()));
        int[] out = new int[k];
        for (int i = 0; i < k; i++) out[i] = es.get(i).getKey();
        return out;
    }
    // #endregion

    // #region bucket
    static int[] topKBucket(int[] nums, int k) {
        Map<Integer, Integer> count = new LinkedHashMap<>();
        for (int x : nums) count.merge(x, 1, Integer::sum);
        List<List<Integer>> bucket = new ArrayList<>();
        for (int i = 0; i <= nums.length; i++) bucket.add(new ArrayList<>());
        for (Map.Entry<Integer, Integer> e : count.entrySet()) bucket.get(e.getValue()).add(e.getKey());
        int[] out = new int[k];
        int n = 0;
        for (int f = nums.length; f >= 1 && n < k; f--) {
            for (int v : bucket.get(f)) {
                out[n++] = v;
                if (n == k) break;
            }
        }
        return out;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] arrays = {{5, 3, 5, 7, 3, 5, 9, 3, 7, 5}, {4, 4, 1, 2, 2, 3}, {8}, {1, 2, 3, 1, 2, 3}};
        int[] ks = {2, 1, 1, 3};
        for (int t = 0; t < arrays.length; t++) {
            System.out.println("k=" + ks[t] + " " + Arrays.toString(arrays[t]) + ": sort = " + Arrays.toString(topKSort(arrays[t], ks[t]))
                + "   bucket = " + Arrays.toString(topKBucket(arrays[t], ks[t])));
        }
    }
}
