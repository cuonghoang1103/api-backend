// @bo-qua  (reads stdin; run by oa-mau.ts / oa-do.ts with real input files)
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

// Java — BufferedReader + StringTokenizer: the classic fast reader. Any whitespace, any line breaks.
public class DocTokenizer {
    // #region khuon
    static BufferedReader br = new BufferedReader(new InputStreamReader(System.in), 1 << 16);
    static StringTokenizer st = new StringTokenizer("");

    static String next() throws IOException {
        while (!st.hasMoreTokens()) {          // current line used up: read the next one
            String line = br.readLine();
            if (line == null) return null;     // end of input
            st = new StringTokenizer(line);    // default delimiters: space, tab, \n, \r, \f
        }
        return st.nextToken();
    }

    public static void main(String[] args) throws IOException {
        int n = Integer.parseInt(next());
        long sum = 0;
        long max = Long.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            long x = Long.parseLong(next());
            sum += x;
            if (x > max) max = x;
        }
        System.out.println("sum=" + sum + " max=" + max);
    }
    // #endregion
}
