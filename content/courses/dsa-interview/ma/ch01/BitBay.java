// Traps in Java: 32-bit int, shift count mod 32, signed >> vs unsigned >>>, int overflow.
public class BitBay {
    // #region lc191
    static String popcountSigned(int n) {
        int c = 0, loops = 0;
        while (n != 0 && loops < 100) { c += n & 1; n >>= 1; loops++; }
        return loops == 100 ? "still running after 100 loops, n = " + n : c + " (" + loops + " loops)";
    }
    static int popcount(int n) {
        int c = 0;
        while (n != 0) { c += n & 1; n >>>= 1; }
        return c;
    }
    // #endregion

    public static void main(String[] args) {
        // #region bay
        System.out.println("1 << 31   = " + (1 << 31));
        System.out.println("1 << 32   = " + (1 << 32));          // shift count mod 32
        System.out.println("1L << 32  = " + (1L << 32));         // long: shift count mod 64
        System.out.println("-1 >>> 28 = " + (-1 >>> 28));
        System.out.println("-7 >> 1 = " + (-7 >> 1) + ",  -7 / 2 = " + (-7 / 2));
        System.out.println("Integer.bitCount(-1) = " + Integer.bitCount(-1) + ",  bitCount(52) = " + Integer.bitCount(52));
        int n = 100_000;
        System.out.println("int  n * (n + 1) / 2 = " + (n * (n + 1) / 2));
        System.out.println("long n * (n + 1) / 2 = " + ((long) n * (n + 1) / 2));
        // #endregion
        System.out.println("popcount with >>  on -1: " + popcountSigned(-1));
        System.out.println("popcount with >>> on -1: " + popcount(-1));
    }
}
