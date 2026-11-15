import java.util.*;

// Java sort traps, run for real.
public class SortSoSanh {
    public static void main(String[] args) {
        // #region nguyenthuy
        int[] a = {10, 9, 1};
        Arrays.sort(a);                                   // int[]: ascending only, no comparator overload
        System.out.println("Arrays.sort(int[])          = " + Arrays.toString(a));
        Integer[] boxed = {10, 9, 1};
        Arrays.sort(boxed, Collections.reverseOrder());   // a comparator needs objects: Integer[]
        System.out.println("Integer[] reverseOrder()    = " + Arrays.toString(boxed));
        // #endregion

        // #region transo
        Integer[] xs = {2_000_000_000, -2_000_000_000, 0};
        Integer[] bad = xs.clone(), good = xs.clone();
        Arrays.sort(bad, (p, q) -> p - q);                // p - q overflows for far-apart values
        Arrays.sort(good, (p, q) -> Integer.compare(p, q));
        System.out.println("comparator p - q            = " + Arrays.toString(bad));
        System.out.println("Integer.compare(p, q)       = " + Arrays.toString(good));
        System.out.println("2_000_000_000 - (-2_000_000_000) as int = " + (2_000_000_000 - (-2_000_000_000)));
        // #endregion

        // #region mang2
        int[][] intervals = {{5, 6}, {1, 3}, {2, 4}};
        Arrays.sort(intervals, (x, y) -> Integer.compare(x[0], y[0]));  // int[][] is an array of OBJECTS: comparator allowed
        System.out.println("int[][] by start            = " + Arrays.deepToString(intervals));
        // #endregion
    }
}
