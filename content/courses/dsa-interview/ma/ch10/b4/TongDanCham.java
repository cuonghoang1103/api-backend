// @bo-qua  (run by oa-do.ts with a real input file)
import java.util.Scanner;

// Java — read n numbers, print the running sum after each one (n output lines). Scanner + println.
public class TongDanCham {
    // #region sai
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long sum = 0;
        for (int i = 0; i < n; i++) {
            sum += sc.nextLong();
            System.out.println(sum);
        }
    }
    // #endregion
}
