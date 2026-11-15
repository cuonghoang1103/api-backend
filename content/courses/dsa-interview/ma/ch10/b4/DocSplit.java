// @bo-qua  (reads stdin; run by oa-mau.ts / oa-do.ts with real input files)
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

// Java — BufferedReader + split(" "): fast, but it trusts the layout (one space, all numbers on line 2).
public class DocSplit {
    // #region sai
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(br.readLine());
        String[] parts = br.readLine().split(" ");
        long sum = 0;
        long max = Long.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            long x = Long.parseLong(parts[i]);
            sum += x;
            if (x > max) max = x;
        }
        System.out.println("sum=" + sum + " max=" + max);
    }
    // #endregion
}
