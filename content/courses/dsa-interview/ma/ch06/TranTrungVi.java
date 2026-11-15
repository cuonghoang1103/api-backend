// The median of two ints, three ways — only one of the "obvious" ones overflows.
public class TranTrungVi {
    public static void main(String[] args) {
        // #region tran
        int a = 2147483647, b = 2147483647;          // Integer.MAX_VALUE twice (LC 480 has this test)
        double wrong = (a + b) / 2.0;                // a + b is computed in int FIRST ⇒ wraps to -2
        double right1 = ((double) a + b) / 2.0;      // widen one side before adding
        double right2 = a / 2.0 + b / 2.0;           // halve first
        long right3 = ((long) a + b) / 2;            // long has room for the sum
        System.out.println("(a + b) / 2.0          = " + wrong);
        System.out.println("((double) a + b) / 2.0 = " + right1);
        System.out.println("a / 2.0 + b / 2.0      = " + right2);
        System.out.println("((long) a + b) / 2     = " + right3);
        // #endregion
    }
}
