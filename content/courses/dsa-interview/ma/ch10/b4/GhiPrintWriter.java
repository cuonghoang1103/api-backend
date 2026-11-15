// @bo-qua  (run by oa-mau.ts / oa-do.ts)
import java.io.BufferedWriter;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

// Java — print n lines through ONE buffered PrintWriter, flushed once at the end.
public class GhiPrintWriter {
    // #region khuon
    public static void main(String[] args) {
        int n = Integer.parseInt(args[0]);
        PrintWriter out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out), 1 << 16));
        for (int i = 1; i <= n; i++) {
            out.println(i);
        }
        out.flush();                     // forget this line and the judge receives NOTHING
    }
    // #endregion
}
