// Pitfall: Climbing Stairs answers fit in int for n <= 45 — and not one step further.
public class TranSo91 {
    // #region bay
    static int waysInt(int n) { int p2 = 1, p1 = 1; for (int i = 2; i <= n; i++) { int c = p1 + p2; p2 = p1; p1 = c; } return p1; }
    static long fibLong(int n) { long a = 0, b = 1; for (int i = 0; i < n; i++) { long c = a + b; a = b; b = c; } return a; }

    public static void main(String[] args) {
        System.out.println("Integer.MAX_VALUE = " + Integer.MAX_VALUE);
        System.out.println("int ways(45) = " + waysInt(45));
        System.out.println("int ways(46) = " + waysInt(46) + "   <- silent overflow, no exception");
        System.out.println("long fib(92) = " + fibLong(92));
        System.out.println("long fib(93) = " + fibLong(93) + "   <- long overflows too");
        System.out.println("Math.addExact(1836311903, 1134903170) -> " + safeAdd(1836311903, 1134903170));
    }
    static String safeAdd(int x, int y) {
        try { return String.valueOf(Math.addExact(x, y)); }
        catch (ArithmeticException e) { return "ArithmeticException: " + e.getMessage(); }
    }
    // #endregion
}
