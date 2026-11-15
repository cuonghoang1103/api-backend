import java.util.*;

public class SummaryRanges {
    // #region ban
    static List<String> f(int[] a) {
        List<String> r = new ArrayList<>();
        int x1 = a[0];
        int x2 = a[0];
        for (int i = 1; i < a.length; i++) {
            if (a[i] != x2 + 1) {
                if (x1 == x2) {
                    r.add("" + x1);
                } else {
                    r.add(x1 + "->" + x2);
                }
                x1 = a[i];
                x2 = a[i];
            } else {
                x2 = a[i];
            }
        }
        if (x1 == x2) {
            r.add("" + x1);
        } else {
            r.add(x1 + "->" + x2);
        }
        return r;
    }
    // #endregion

    // #region sach
    static List<String> summaryRanges(int[] nums) {
        List<String> ranges = new ArrayList<>();
        int start = 0;
        while (start < nums.length) {
            int end = extendRun(nums, start);
            ranges.add(formatRange(nums[start], nums[end]));
            start = end + 1;
        }
        return ranges;
    }

    /** Last index of the run of consecutive numbers that begins at start. */
    static int extendRun(int[] nums, int start) {
        int end = start;
        while (end + 1 < nums.length && nums[end + 1] == nums[end] + 1) end++;
        return end;
    }

    static String formatRange(int first, int last) {
        return first == last ? String.valueOf(first) : first + "->" + last;
    }
    // #endregion

    public static void main(String[] args) {
        int[][] tests = {
            {0, 1, 2, 4, 5, 7},
            {0, 2, 3, 4, 6, 8, 9},
            {-3, -2, -1, 4, 6, 7, 8, 10},
            {5},
            {-2147483648, 2147483647},
        };
        for (int[] t : tests) {
            List<String> dirty = f(t);
            List<String> clean = summaryRanges(t);
            System.out.println(Arrays.toString(t) + " -> " + clean + " " + (dirty.equals(clean) ? "same" : "DIFFERENT"));
        }
        System.out.println("[] -> clean: " + summaryRanges(new int[0]));
    }
}
