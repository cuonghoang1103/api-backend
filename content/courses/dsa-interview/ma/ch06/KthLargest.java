import java.util.*;

// LC 215 · Kth Largest Element in an Array — sort, a min-heap of size k, quickselect.
public class KthLargest {
    // #region sort
    static int kthSort(int[] nums, int k) {
        int[] s = nums.clone();
        Arrays.sort(s);                         // ascending, O(n log n)
        return s[s.length - k];
    }
    // #endregion

    // #region heap
    static int kthHeap(int[] nums, int k) {
        PriorityQueue<Integer> h = new PriorityQueue<>();   // min-heap of the k largest
        for (int x : nums) {
            h.offer(x);
            if (h.size() > k) h.poll();
        }
        return h.peek();
    }
    // #endregion

    // #region quickselect
    static long seed = 12345;
    static int rand(int n) { seed = (seed * 1103515245L + 12345) % 2147483648L; return (int) (seed % n); }

    static int kthQuickselect(int[] nums, int k) {
        int[] a = nums.clone();
        int target = a.length - k, lo = 0, hi = a.length - 1;
        while (true) {
            int pivot = a[lo + rand(hi - lo + 1)];
            int lt = lo, i = lo, gt = hi;           // [< pivot | = pivot | > pivot]
            while (i <= gt) {
                if (a[i] < pivot) { int t = a[lt]; a[lt] = a[i]; a[i] = t; lt++; i++; }
                else if (a[i] > pivot) { int t = a[i]; a[i] = a[gt]; a[gt] = t; gt--; }
                else i++;
            }
            if (target < lt) hi = lt - 1;
            else if (target > gt) lo = gt + 1;
            else return pivot;
        }
    }
    // #endregion

    public static void main(String[] args) {
        int[][] arrays = {{7, 2, 9, 4, 1, 8, 3}, {5, 5, 1, 5, 2}, {4}, {-3, -1, -2}, {6, 6, 6, 6}};
        int[] ks = {3, 2, 1, 1, 4};
        for (int t = 0; t < arrays.length; t++) {
            seed = 12345;
            System.out.println("k=" + ks[t] + " " + Arrays.toString(arrays[t]) + ": sort=" + kthSort(arrays[t], ks[t])
                + " heap=" + kthHeap(arrays[t], ks[t]) + " quickselect=" + kthQuickselect(arrays[t], ks[t]));
        }
    }
}
