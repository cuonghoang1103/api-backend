// @bo-qua  (reads stdin; run by oa-mau.ts / oa-do.ts with real input files)
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StreamTokenizer;

// Java — StreamTokenizer: very fast and short, with one catch: every number comes back as a double (nval).
public class DocStream {
    // #region khuon
    public static void main(String[] args) throws IOException {
        StreamTokenizer in = new StreamTokenizer(new BufferedReader(new InputStreamReader(System.in)));
        in.nextToken();
        int n = (int) in.nval;
        long sum = 0;
        long max = Long.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            in.nextToken();
            long x = (long) in.nval;             // exact only up to 2^53 — fine for |x| <= 1e9
            sum += x;
            if (x > max) max = x;
        }
        System.out.println("sum=" + sum + " max=" + max);
    }
    // #endregion
}
