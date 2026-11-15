public class DemVong {
    // #region vong
    static long linear(int n)   { long c = 0; for (int i = 0; i < n; i++) c++; return c; }
    static long nested(int n)   { long c = 0; for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) c++; return c; }
    static long triangle(int n) { long c = 0; for (int i = 0; i < n; i++) for (int j = i + 1; j < n; j++) c++; return c; }
    static long halving(int n)  { long c = 0; for (int i = n; i > 1; i /= 2) c++; return c; }
    static long nlogn(int n)    { long c = 0; for (int i = 0; i < n; i++) for (int j = 1; j < n; j *= 2) c++; return c; }
    static long twoLoops(int n, int m) { long c = 0; for (int i = 0; i < n; i++) c++; for (int j = 0; j < m; j++) c++; return c; }
    // #endregion
    static long calls = 0;
    static long fib(int n) { calls++; return n < 2 ? n : fib(n - 1) + fib(n - 2); }
    public static void main(String[] args) {
        for (int n : new int[]{16, 32}) {
            System.out.println("n=" + n + ": linear=" + linear(n) + " nested=" + nested(n) + " triangle=" + triangle(n)
                + " halving=" + halving(n) + " nlogn=" + nlogn(n) + " twoLoops(n,n)=" + twoLoops(n, n));
        }
        for (int n : new int[]{10, 20, 30}) { calls = 0; long v = fib(n); System.out.println("fib(" + n + ")=" + v + " calls=" + calls); }
    }
}
