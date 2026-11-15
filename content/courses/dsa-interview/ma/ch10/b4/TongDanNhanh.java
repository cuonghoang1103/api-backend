// @bo-qua  (run by oa-do.ts with a real input file)
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.util.StringTokenizer;

// Java — the same task with the two-line upgrade: StringTokenizer in, one PrintWriter out.
public class TongDanNhanh {
    // #region khuon
    static BufferedReader br = new BufferedReader(new InputStreamReader(System.in), 1 << 16);
    static StringTokenizer st = new StringTokenizer("");

    static String next() throws IOException {
        while (!st.hasMoreTokens()) st = new StringTokenizer(br.readLine());
        return st.nextToken();
    }

    public static void main(String[] args) throws IOException {
        PrintWriter out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out), 1 << 16));
        int n = Integer.parseInt(next());
        long sum = 0;
        for (int i = 0; i < n; i++) {
            sum += Long.parseLong(next());
            out.println(sum);
        }
        out.flush();
    }
    // #endregion
}
