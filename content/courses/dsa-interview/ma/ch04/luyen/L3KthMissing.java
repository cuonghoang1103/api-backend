import java.util.*;
import java.util.function.IntPredicate;

// LC 1539 · Kth Missing Positive Number.
public class L3KthMissing {
    static int firstTrue(int lo, int hi, IntPredicate ok) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (ok.test(mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
    }
    // #region giai
    static int findKthPositive(int[] arr, int k) {
        int i = firstTrue(0, arr.length, j -> arr[j] - (j + 1) >= k);
        return i + k;
    }
    // #endregion
    static int slow(int[] arr, int k) {
        Set<Integer> s = new HashSet<>();
        for (int v : arr) s.add(v);
        int x = 0;
        while (k > 0) { x++; if (!s.contains(x)) k--; }
        return x;
    }
    public static void main(String[] args) {
        int[] a = {3, 4, 7, 12, 13};
        int[] miss = new int[a.length];
        for (int i = 0; i < a.length; i++) miss[i] = a[i] - (i + 1);
        int[] r1 = new int[9], r2 = new int[9];
        for (int k = 1; k <= 9; k++) { r1[k - 1] = findKthPositive(a, k); r2[k - 1] = slow(a, k); }
        System.out.println("arr = " + Arrays.toString(a) + "  missing(i) = " + Arrays.toString(miss));
        System.out.println("k = 1..9 -> " + Arrays.toString(r1));
        System.out.println("slow    -> " + Arrays.toString(r2));
        System.out.println("arr = [1,2,3], k = 2 -> " + findKthPositive(new int[]{1, 2, 3}, 2));
    }
}
