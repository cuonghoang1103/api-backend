// @bo-qua  (reads stdin; run by oa-mau.ts / oa-do.ts with real input files)
import java.util.Scanner;

// Java — Scanner: the first thing everyone learns. Correct on any layout, but slow (regex per token).
public class DocScanner {
    // #region khuon
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long sum = 0;
        long max = Long.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            long x = sc.nextLong();
            sum += x;
            if (x > max) max = x;
        }
        System.out.println("sum=" + sum + " max=" + max);
    }
    // #endregion
}
