import java.util.*;

public class ThoiQuen {
    public static void main(String[] args) {
        // #region integer
        Integer a = 127, b = 127, c = 128, d = 128;
        System.out.println("1) Integer == : 127 -> " + (a == b) + ", 128 -> " + (c == d) + " | equals: " + c.equals(d));
        // #endregion

        // #region string
        String typed = "ab";
        String built = new StringBuilder("a").append("b").toString();   // e.g. read from input
        System.out.println("2) String == : " + (typed == built) + " | equals: " + typed.equals(built));
        // #endregion

        // #region chia
        int sum = 7, count = 2;
        System.out.println("3) 7 / 2 = " + (sum / count) + " | (double) 7 / 2 = " + ((double) sum / count) + " | 7 / 2.0 = " + (sum / 2.0));
        // #endregion

        // #region giua
        int lo = 2_000_000_000, hi = 2_100_000_000;
        System.out.println("4) (lo + hi) / 2 = " + ((lo + hi) / 2) + " | lo + (hi - lo) / 2 = " + (lo + (hi - lo) / 2) + " | (lo + hi) >>> 1 = " + ((lo + hi) >>> 1));
        // #endregion

        // #region abs
        System.out.println("5) Math.abs(Integer.MIN_VALUE) = " + Math.abs(Integer.MIN_VALUE) + " | Math.abs((long) MIN) = " + Math.abs((long) Integer.MIN_VALUE));
        // #endregion

        // #region tong
        int[] fines = new int[100_000];
        Arrays.fill(fines, 100_000);
        int intTotal = 0;
        long longTotal = 0;
        for (int x : fines) { intTotal += x; longTotal += x; }
        System.out.println("6) sum of 100,000 x 100,000: int -> " + intTotal + " | long -> " + longTotal);
        // #endregion

        // #region kytu
        System.out.println("7) 'a' + 1 = " + ('a' + 1) + " | (char) ('a' + 1) = " + (char) ('a' + 1) + " | \"\" + 'a' + 1 = " + ("" + 'a' + 1));
        // #endregion

        // #region aslist
        int[] prim = {3, 1, 2};
        Integer[] boxed = {3, 1, 2};
        System.out.println("8) Arrays.asList(int[]).size() = " + Arrays.asList(prim).size() + " | Arrays.asList(Integer[]).size() = " + Arrays.asList(boxed).size());
        // #endregion

        // #region static
        // The judge creates one process and calls your method once per test case.
        System.out.println("9) static counter: test 1 -> " + countEven(new int[] {2, 4, 5}) + " (want 2), test 2 -> " + countEven(new int[] {6}) + " (want 1)");
        // #endregion
    }

    // #region staticham
    static int evenSeen = 0;                 // "global" state that survives between test cases

    static int countEven(int[] nums) {
        for (int x : nums) if (x % 2 == 0) evenSeen++;
        return evenSeen;
    }
    // #endregion
}
