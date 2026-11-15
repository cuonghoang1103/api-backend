import java.util.*;

// LC 179 Largest Number · LC 274 H-Index · LC 75 Sort Colors.
public class SortBienThe {
    // #region largest
    static String largestNumber(int[] nums) {
        String[] s = new String[nums.length];
        for (int i = 0; i < nums.length; i++) s[i] = String.valueOf(nums[i]);
        Arrays.sort(s, (a, b) -> (b + a).compareTo(a + b));
        if (s[0].equals("0")) return "0";
        return String.join("", s);
    }
    // #endregion

    // #region hindex
    static int hIndexSort(int[] citations) {
        int[] c = citations.clone();
        Arrays.sort(c);                                   // ascending: read from the right end
        int n = c.length, h = 0;
        while (h < n && c[n - 1 - h] >= h + 1) h++;
        return h;
    }
    static int hIndexCount(int[] citations) {
        int n = citations.length;
        int[] papers = new int[n + 1];
        for (int c : citations) papers[Math.min(c, n)]++;
        int atLeast = 0;
        for (int h = n; h >= 0; h--) {
            atLeast += papers[h];
            if (atLeast >= h) return h;
        }
        return 0;
    }
    // #endregion

    // #region colors
    static void sortColors(int[] nums) {
        int[] cnt = new int[3];
        for (int x : nums) cnt[x]++;
        int i = 0;
        for (int v = 0; v < 3; v++) for (int t = 0; t < cnt[v]; t++) nums[i++] = v;
    }
    // #endregion

    public static void main(String[] args) {
        System.out.println("largestNumber([3,30,34,5,9]) = " + largestNumber(new int[]{3, 30, 34, 5, 9}));
        System.out.println("largestNumber([10,2]) = " + largestNumber(new int[]{10, 2}));
        System.out.println("largestNumber([0,0]) = " + largestNumber(new int[]{0, 0}));
        int[][] cs = {{3, 0, 6, 1, 5}, {1, 3, 1}, {100}, {0}};
        for (int[] c : cs) {
            System.out.println("hIndex(" + Arrays.toString(c) + ") = " + hIndexSort(c) + " (sort) / " + hIndexCount(c) + " (count)");
        }
        int[] colors = {2, 0, 2, 1, 1, 0};
        sortColors(colors);
        System.out.println("sortColors([2,0,2,1,1,0]) -> " + Arrays.toString(colors));
    }
}
