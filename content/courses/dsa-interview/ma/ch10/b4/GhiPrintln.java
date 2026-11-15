// @bo-qua  (run by oa-mau.ts / oa-do.ts)
// Java — print n lines with System.out.println, one call per line.
public class GhiPrintln {
    // #region sai
    public static void main(String[] args) {
        int n = Integer.parseInt(args[0]);
        for (int i = 1; i <= n; i++) {
            System.out.println(i);
        }
    }
    // #endregion
}
