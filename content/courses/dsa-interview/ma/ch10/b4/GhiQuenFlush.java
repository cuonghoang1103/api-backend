// @bo-qua  (run by oa-mau.ts)
import java.io.BufferedWriter;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

// Java — the same PrintWriter, but the flush() at the end was forgotten.
public class GhiQuenFlush {
    // #region sai
    public static void main(String[] args) {
        int n = Integer.parseInt(args[0]);
        PrintWriter out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out), 1 << 16));
        for (int i = 1; i <= n; i++) {
            out.println(i);
        }
        // out.flush();  <- missing: the buffer dies with the program
    }
    // #endregion
}
